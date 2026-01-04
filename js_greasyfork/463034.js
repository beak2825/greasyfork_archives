// ==UserScript==
// @name          Wikipedia History and History Visualizer
// @namespace     https://en.wikipedia.org/wiki/*
// @description   Visualize Wikipedia Articles that you've visited in an interactive graph
// @author        Sidem
// @version       0.1
// @match         https://en.wikipedia.org/wiki/*
// @grant         none
// @license       GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/463034/Wikipedia%20History%20and%20History%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/463034/Wikipedia%20History%20and%20History%20Visualizer.meta.js
// ==/UserScript==

const dbName = "WikipediaHistoryDB";
const objectStoreName = "wikipediaHistory";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(objectStoreName, { keyPath: "id", autoIncrement: true });
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function getWikipediaHistoryData() {
    const db = await openDatabase();
    const transaction = db.transaction(objectStoreName, "readonly");
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.getAll();
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

async function setWikipediaHistoryData(data) {
    const db = await openDatabase();
    const transaction = db.transaction(objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.clear();
    request.onsuccess = () => {
        if (data && data.length) { // Add this condition
            for (const item of data) {
                objectStore.add(item);
            }
        }
    };
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
    });
}


const linkToTitle = (link) => { return link.split('#')[0].split('/wiki/')[1] };

const createHistoryButton = () => {
    const button = document.createElement('button');
    button.innerText = 'View History Graph';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.onclick = () => {
        window.location = '/wiki/History_visualization_script';
    };
    document.body.appendChild(button);
};
let tooltipTimer;


const addStyles = () => {
    const style = document.createElement("style");
    style.innerHTML = `
        svg {
            font-family: sans-serif;
            overflow: visible;
        }

        circle {
            stroke: #fff;
            stroke-width: 1.5px;
        }

        line {
            stroke: #999;
            stroke-opacity: 0.6;
            stroke-width: 2;
        }

        text {
            /*make unselectable*/
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
        }
        body {
          overflow-y: hidden !important;
          overflow-x: hidden !important;
        }
    `;
    document.head.appendChild(style);
};

const forceCluster = () => {
    const strength = 0.3;
    const clusters = new Map();
    let nodes;

    function force(alpha) {
        for (const node of nodes) {
            const cluster = clusters.get(node.clusterId);
            if (!cluster) continue;
            let { x: cx, y: cy } = cluster;
            node.vx -= (node.x - cx) * strength * alpha;
            node.vy -= (node.y - cy) * strength * alpha;
        }
    }

    force.initialize = (_) => (nodes = _);

    force.clusters = (_) => {
        clusters.clear();
        for (const node of _) {
            clusters.set(node.clusterId, node);
        }
        return force;
    };

    return force;
};


function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

const clearGraph = () => {
    d3.select("#graphContainer").remove();
};
let isMouseOverNode = false;

const createGraph = (wikipediaHistoryData) => {

    const deleteEntry = (id) => {
        const updatedHistoryData = wikipediaHistoryData.filter((_, index) => index !== id);
        localStorage.setItem('wikipediaHistory', JSON.stringify(updatedHistoryData));
        clearGraph();
        createGraph(updatedHistoryData);
    };

    const links = wikipediaHistoryData.flatMap((entry, index) =>
        entry.links.map((link) => {
            const targetIndex = wikipediaHistoryData.findIndex((e) => e.link === link.link);
            return targetIndex !== -1 ? { source: index, target: targetIndex } : null;
        })
    ).filter((link) => link !== null);
    const nodes = wikipediaHistoryData.map((entry, index) => {
        const connectedNodes = links.filter(link => link.source === index || link.target === index);
        const clusterId = connectedNodes.length > 0 ? index : null;
        return { id: index, label: entry.title, clusterId };
    });

    const svg = d3.select("#graph");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const g = svg.append("g").attr("id", "graphContainer");

    svg.append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 13)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("xoverflow", "visible")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", "#999")
        .style("stroke", "none");

    const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(60))
        .force("cluster", forceCluster().clusters(nodes)); // Add cluster force



    const link = g
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2)
        .attr("marker-end", (d) => {
            const sourceLinks = wikipediaHistoryData[d.source.index].links;
            const targetLinks = wikipediaHistoryData[d.target.index].links;
            const sourceToTarget = sourceLinks.some((link) => link.link === wikipediaHistoryData[d.target.index].link);
            const targetToSource = targetLinks.some((link) => link.link === wikipediaHistoryData[d.source.index].link);
            return sourceToTarget && !targetToSource ? "url(#arrowhead)" : "";
        });


    const node = g
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", "#69b3a2");

    node.on("dblclick", (event, d) => {
        window.open(`https://en.wikipedia.org/wiki/${wikipediaHistoryData[d.id].link}`, "_blank");
    });

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute")
        .style("pointer-events", "auto");

    node.on("mouseover", (event, d) => {
        isMouseOverNode = true;
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip.html(`Title: ${wikipediaHistoryData[d.id].title}<br/>URL: https://en.wikipedia.org/wiki/${wikipediaHistoryData[d.id].link}<br/>Dates Accessed: ${wikipediaHistoryData[d.id].dates_accessed.join(', ')}<br/><button id="deleteButton">Delete</button>`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);

        tooltip.select("#deleteButton").on("click", () => deleteEntry(d.id));


    })
        // ...
        .on("mousemove", (event) => {
            tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY + 10}px`);
        });

    tooltip.on("mouseover", () => {
        clearTimeout(tooltipTimer);
        if (isMouseOverNode) {
            tooltip.style("opacity", 1);
            // move tooltip back to mouse position
            tooltip.style("left", `${d3.event.pageX + 10}px`).style("top", `${d3.event.pageY + 10}px`);
        }
    })
        .on("mouseout", () => {
            clearTimeout(tooltipTimer);
            tooltipTimer = setTimeout(() => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                //also move invisible tooltip out of screen so it doesn't block mouse events
                tooltip.style("left", "-1000px").style("top", "-1000px");
            }, 150);
        });

    node.on("mouseout", () => {
        isMouseOverNode = false;
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            //also move invisible tooltip out of screen so it doesn't block mouse events
            tooltip.style("left", "-1000px").style("top", "-1000px");
        }, 150);
    });




    const label = g
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text((d) => d.label)
        .attr("font-size", "10px")
        .attr("dx", 8)
        .attr("dy", "0.35em");

    const zoomBehavior = d3.zoom()
        .scaleExtent([0.1, 5])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    svg.call(zoomBehavior);

    simulation.on("tick", () => {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);

        label
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y);
    });
};

window.addEventListener('load', () => {
    let links = document.querySelector('#bodyContent').querySelectorAll('a[href*="/wiki/"]');
    let title = document.querySelector('#firstHeading').innerText;
    let link = linkToTitle(window.location.pathname);
    let linkEntries = [];
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes('/wiki/')) {
            let linkEntry = {
                title: links[i].title,
                link: linkToTitle(links[i].href)
            };
            linkEntries.push(linkEntry);
        }
    }

    let entry = {
        title: title,
        link: link,
        links: linkEntries
    };
    let date = new Date();
    let dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    let database;
    getWikipediaHistoryData().then(data => {
        database = data;
        if (database) {
            let entryIndex = -1;
            for (let i = 0; i < database.length; i++) {
                if (database[i].title === entry.title) {
                    entryIndex = i;
                    break;
                }
            }
            if (entryIndex < 0) {
                entry.dates_accessed = [dateString];
                database.push(entry);
            } else {
                let lastDate = database[entryIndex].dates_accessed[database[entryIndex].dates_accessed.length - 1];
                if (lastDate.split(' ')[0] !== dateString.split(' ')[0]) {
                    database[entryIndex].dates_accessed.push(dateString);
                }
                database[entryIndex].links = entry.links;
            }
        } else {
            entry.dates_accessed = [dateString];
            database = [entry];
        }
        if (link === 'History_visualization_script') {
            addStyles();
            const bodyContent = document.querySelector('#bodyContent');
            bodyContent.innerHTML = '';
            document.body.innerHTML = '';
            document.body.appendChild(bodyContent);
            let script = document.createElement('script');
            script.src = 'https://d3js.org/d3.v7.min.js';
            document.querySelector('#bodyContent').appendChild(script);
            let script2 = document.createElement('script');
            script2.src = 'https://unpkg.com/d3-force-cluster@latest';
            document.querySelector('#bodyContent').appendChild(script2);

            script.onload = () => {
                let svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
                svgElement.setAttribute('width', window.innerWidth);
                svgElement.setAttribute('height', window.innerHeight);
                svgElement.setAttribute('id', 'graph');
                document.querySelector('#bodyContent').appendChild(svgElement);
                getWikipediaHistoryData().then(wikipediaHistoryData => {
                    createGraph(wikipediaHistoryData);
                });
            }
        } else {
            setWikipediaHistoryData(database);
            createHistoryButton();
        }
    });
}, false);