// ==UserScript==
// @name         2ch graph
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  ...
// @author       voxxys
// @match        https://2ch.life/*
// @match        https://2ch.hk/*
// @grant    GM.getValue
// @grant    GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/517221/2ch%20graph.user.js
// @updateURL https://update.greasyfork.org/scripts/517221/2ch%20graph.meta.js
// ==/UserScript==

const SETTINGS_DEFAULT = {
    NODE_SIZE: 5,
    POST_HIGHLIGHT_COLOUR: 'rgba(120, 153, 34, 0.2)',
    SETTING_NODE_COLOUR: '#777777',
    SETTING_NODE_COLOUR_WATCHED: '#a74300',
    SETTING_NODE_COLOUR_HOVER: '#ff6600',
    SETTING_EDGE_COLOUR: '#ffffff',
    SETTING_DISPLAY_NODE_IDS: false,
    TOGGLE_UPDATE_ACTIVE: false,
    TOGGLE_OPEN_WIDGET: true,
};

const TEXT = {
    HIDE_WIDGET: 'Hide',
    SHOW_WIDGET: 'Show',
    TOGGLE_AUTOUPDATE_ON: 'Enable auto-update',
    TOGGLE_AUTOUPDATE_OFF: 'Disable auto-update',
};

(async function() {
    'use strict';

    ////

    const settingsLoaded = await GM.getValue('settings');
    const SETTINGS = {...SETTINGS_DEFAULT, ...settingsLoaded};

    ////

    let offset = 0;
    let scale = 1;

    let translateX = 0;
    let translateY = 0;

    ////

    const CANVAS_PADDING = 10;

    ////

    if(!checkIfInThread()) return;

    addCSS();

    ////

    //// GLOBAL STATE ////

    let postData = [];
    let nodes = [];
    let nodesToDraw = [];
    let edges = [];
    let positionedNodes = [];

    let mapTimestampToY = null; // should be initialized on first parsing

    // Update graph with new posts (state)
    let numPosts = 0; // for mutation observer

    const visiblePostIds = new Set(); // for intersection observer

    // Init and store canvas & overlay references
    const [canvas, overlay] = initCanvasOverlay();
    toggleOverlay(SETTINGS.TOGGLE_OPEN_WIDGET);

    const ctx = canvas.getContext('2d');


    // zoom

    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();

        const cursorY = event.offsetY;

        const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;

        const oldScale = scale;
        scale *= scaleFactor;

        offset = offset + cursorY*oldScale - cursorY*scale;

        nodesToDraw = rescaleGraph(positionedNodes, offset, scale);

        drawGraph();

    });


    // pan

    let isPanning = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (event) => {
        isPanning = true;
        startY = event.offsetY;
    });

    canvas.addEventListener('mousemove', (event) => {
        if (!isPanning) return;

        const dy = event.offsetY - startY;

        offset += dy;
        nodesToDraw = rescaleGraph(positionedNodes, offset, scale);

        drawGraph();

        startY = event.offsetY;
    });

    canvas.addEventListener('mouseup', () => {
        isPanning = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isPanning = false;
    });


    ////



    ////

    // Add dialog with settings form

    addDialog();

    //// PARSE POST DATA

    const observer = createThreadMutationObserver(() => {
        runFullPipeline();
    });


    function runFullPipeline() {
        postData = parsePostData();

        const [nodesNew, edgesNew] = getGraphData(postData);

        const positionedNodesNew = fruchtermanReingold(nodesNew, edgesNew, canvas.width*0.8, canvas.height);

        if (positionedNodes.length === 0) {
            positionedNodes = [...positionedNodesNew];
        } else {
            const existingNodeIds = new Set(nodes.map(node => node.id));

            const newNodes = nodesNew.filter(node => !existingNodeIds.has(node.id));
            positionedNodes.push(...newNodes);
        }

        nodes = nodesNew;
        edges = edgesNew;

        // positionedNodes = [...positionedNodesNew];
        nodesToDraw = rescaleGraph(positionedNodes, offset, scale);

        drawGraph();

        trackVisiblePosts();
    }

    //////
    //////
    //////

    function checkIfInThread() {
        let threads = document.querySelectorAll('#js-posts > div');
        threads = Array.from(threads).filter(node => node.id.startsWith('thread'));
        return threads.length === 1;
    }

    /////

    //     UPDATE_ACTIVE_COLOUR: 'rgba(120, 153, 34, 0.2)',

    function addCSS() {
        const style = document.createElement('style');
        style.textContent = `

            :root {
                --tool-enabled-color: rgb(150, 150, 150);
                --tool-disabled-color: color-mix(in srgb, var(--tool-active-color) 75%, transparent);
                --tool-active-color: rgba(120, 153, 34, 0.9);
            }

            .highlight {
                position: relative;
            }

            .highlight::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${SETTINGS.POST_HIGHLIGHT_COLOUR};
                pointer-events: none;
                transition: opacity 1s ease-in-out;
                transition-delay: 0s;

            }

            #modalBackdrop {
                position: fixed;
                top: 0;
               left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            #modalDialog {
                background: white;
                padding: 10px;
                border-radius: 5px;
                width: 300px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }

            .form-field {
                min-height: 24px;
                margin-bottom: 10px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding-left: 10px;
                padding-right: 10px;
            }

            .form-field > input {
                flex: 0 0 auto;
            }

            .chartCanvasToolsGroupRight {
                margin-left: auto;
                display: flex;
                flex-direction: row;
            }

            .chartCanvasToolsCategoryUpdate {
                display: flex;
                flex-direction: row;
                padding: 0 5px 0 5px;
                justify-self: end;
            }

            .chartCanvasToolbar {
                align-items: center;
            }

            .chartCanvasTool {
                padding: 0 5px 0 5px;
                color: var(--tool-enabled-color);
            }

            .chartCanvasTool.active {
                color: var(--tool-active-color);
            }

        `;

        document.head.appendChild(style);
    }

    function toggleOverlay(state) {
        overlay.style.height = state ? `${window.innerHeight - 20}px` : '40px';
        canvas.style.display = state ? 'block' : 'none';

        SETTINGS.TOGGLE_OPEN_WIDGET = state;

        GM.setValue('settings', SETTINGS);

    }

    let settingsDialogOpen = false;
    function toggleSettingsDialog(state) {

        const modalBackdrop = document.getElementById('modalBackdrop');
        modalBackdrop.style.display = state ? 'flex' : 'none';

        settingsDialogOpen = state;
    }

    function initCanvasOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.width = '300px';
        overlay.style.height = `${window.innerHeight - 20}px`;
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.padding = '10px';
        overlay.style.borderRadius = '5px';
        overlay.style.zIndex = '999';

        overlay.innerHTML = `
        <div id='chartCanvasToolbar'>
          <div class='chartCanvasTool' id='chartCanvasToolbar-settings' title="Settings">⚙</div>
          <div class='chartCanvasTool' id='chartCanvasToolbar-resetScale' title="Fit chart to data">↕</div>
          <div class='chartCanvasToolsGroupRight'>
              <div class='chartCanvasToolsCategoryUpdate'>
                  <div class='chartCanvasTool' id='chartCanvasToolbar-manualUpdate' title="Update graph">🔄&#xFE0E;</div>
                  <div class='chartCanvasTool ${SETTINGS.TOGGLE_UPDATE_ACTIVE ? 'active' : ''}' id='chartCanvasToolbar-toggleUpdate' title="${SETTINGS.TOGGLE_UPDATE_ACTIVE ? TEXT.TOGGLE_AUTOUPDATE_OFF : TEXT.TOGGLE_AUTOUPDATE_ON}">🎡&#xFE0E;</div>
              </div>
              <div class='chartCanvasTool' id='chartCanvasToolbar-toggle' title=${SETTINGS.TOGGLE_OPEN_WIDGET ? TEXT.HIDE_WIDGET : TEXT.SHOW_WIDGET }>👁</div>
          </div>
        </div>
        <canvas id="chartCanvas" width="280" height="380"></canvas>
    `;

        document.body.appendChild(overlay);

        const canvas = document.getElementById('chartCanvas');
        canvas.width = overlay.offsetWidth - 20;
        canvas.height = overlay.offsetHeight - 20 - 20;
        canvas.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';

        // todo: move to css
        const toolbar = document.getElementById('chartCanvasToolbar');
        toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        toolbar.style.height = '20px';
        toolbar.style.color = 'white';
        toolbar.style.display = 'flex';
        toolbar.style.flexDirection = 'row';

        canvas.addEventListener('click', handleCanvasClick);

        // toggle
        const toggleIcon = document.getElementById('chartCanvasToolbar-toggle');
        toggleIcon.style.cursor = 'pointer';
        // toggleIcon.style.marginLeft = 'auto';
        toggleIcon.addEventListener('click', () => {
            const state = !SETTINGS.TOGGLE_OPEN_WIDGET;

            toggleIcon.title = state ? TEXT.HIDE_WIDGET : TEXT.SHOW_WIDGET;

            toggleOverlay(state);
        });

        // settings
        const settingsIcon = document.getElementById('chartCanvasToolbar-settings');
        settingsIcon.style.cursor = 'pointer';
        settingsIcon.addEventListener('click', () => {
            toggleSettingsDialog(!settingsDialogOpen);
        });

        // toggle update
        const toggleUpdateIcon = document.getElementById('chartCanvasToolbar-toggleUpdate');
        toggleUpdateIcon.style.cursor = 'pointer';
        toggleUpdateIcon.addEventListener('click', () => {
            SETTINGS.TOGGLE_UPDATE_ACTIVE = !SETTINGS.TOGGLE_UPDATE_ACTIVE;

            if (SETTINGS.TOGGLE_UPDATE_ACTIVE) {
                toggleUpdateIcon.classList.add('active');
                toggleUpdateIcon.title = TEXT.TOGGLE_AUTOUPDATE_OFF;
            } else {
                toggleUpdateIcon.classList.remove('active');
                toggleUpdateIcon.title = TEXT.TOGGLE_AUTOUPDATE_ON;
            }

            GM.setValue('settings', SETTINGS);
        });

        // manual update
        const manualUpdateIcon = document.getElementById('chartCanvasToolbar-manualUpdate');
        manualUpdateIcon.style.cursor = 'pointer';
        manualUpdateIcon.addEventListener('click', () => {
            runFullPipeline();
        });

        // reset scale
        const resetScaleIcon = document.getElementById('chartCanvasToolbar-resetScale');
        resetScaleIcon.style.cursor = 'pointer';
        resetScaleIcon.addEventListener('click', () => {
            offset = 0;
            scale = 1;

            if(postData) {
                const earliestTimestamp = postData[0].timestamp;
                const latestTimestamp = postData[postData.length - 1].timestamp;

                mapTimestampToY = fitMapTimestampToY(earliestTimestamp, latestTimestamp, CANVAS_PADDING + offset, ctx.canvas.height-CANVAS_PADDING);

                positionedNodes = positionedNodes.map(post => {
                    return ({...post, timestamp_y: mapTimestampToY(post.timestamp)})
                });

            }

            // runFullPipeline(); // todo: optimize, no need to re-parse postss here
            nodesToDraw = rescaleGraph(positionedNodes, offset, scale);
            drawGraph();
        });

        return [canvas, overlay];
    }




    //


    function addDialog() {
        const modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'modalBackdrop';
        modalBackdrop.innerHTML = `
        <div id="modalDialog">
            <h2>Settings</h2>
            <form id="settingsForm">
                <div class="form-field">
                    <label for="setting-displayNodeIds">Display node IDs:</label>
                    <input type="checkbox" id="setting-displayNodeIds" name="setting-displayNodeIds" ${SETTINGS.SETTING_DISPLAY_NODE_IDS ? 'checked' : ''} />
                </div>
                <div class="form-field">
                    <label for="setting-nodeColour">Node colour:</label>
                    <input type="color" id="setting-nodeColour" name="setting-nodeColour" value="${SETTINGS.SETTING_NODE_COLOUR}" />
                </div>
                <div class="form-field">
                    <label for="setting-nodeColourWatched">Node colour (watched):</label>
                    <input type="color" id="setting-nodeColourWatched" name="setting-nodeColourWatched" value="${SETTINGS.SETTING_NODE_COLOUR_WATCHED}" />
                </div>
                <div class="form-field">
                    <label for="setting-edgeColour">Edge colour:</label>
                    <input type="color" id="setting-edgeColour" name="setting-edgeColour" value="${SETTINGS.SETTING_EDGE_COLOUR}" />
                </div>
            </form>
        </div>
    `;

        document.body.appendChild(modalBackdrop);

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                toggleSettingsDialog(false);
            }
        });

        document.getElementById('setting-displayNodeIds').addEventListener('change', (e) => {
            onFieldUpdate(e.target.name, e.target.checked);
        });

        document.getElementById('setting-nodeColour').addEventListener('input', (e) => {
            onFieldUpdate(e.target.name, e.target.value);
        });

        document.getElementById('setting-nodeColourWatched').addEventListener('input', (e) => {
            onFieldUpdate(e.target.name, e.target.value);
        });

        document.getElementById('setting-edgeColour').addEventListener('input', (e) => {
            onFieldUpdate(e.target.name, e.target.value);
        });

        function onFieldUpdate(name, value) {

            if (name === 'setting-displayNodeIds') {
                SETTINGS.SETTING_DISPLAY_NODE_IDS = value;
            }

            if (name === 'setting-nodeColour') {
                SETTINGS.SETTING_NODE_COLOUR = value;
            }

            if (name === 'setting-nodeColourWatched') {
                SETTINGS.SETTING_NODE_COLOUR_WATCHED = value;
            }

            if (name === 'setting-edgeColour') {
                SETTINGS.SETTING_EDGE_COLOUR = value;
            }

            GM.setValue('settings', SETTINGS);

            drawGraph();

        }


    }



    //////


    function createThreadMutationObserver(callback) {
        const observer = new MutationObserver((mutations) => {
            const refmaps = document.querySelectorAll('.post__refmap > .post-reply-link');
            const numPostsNew = document.querySelectorAll("#js-posts > div.thread > div").length;

            // if (refmaps.length > 0) {
            // }
            if (numPostsNew > numPosts) {

                // always update to get initial posts, otherwise only if update toggled on
                if (numPosts === 0) {
                  callback();
                } else if (SETTINGS.TOGGLE_UPDATE_ACTIVE) callback();

                numPosts = numPostsNew;

            }
        });

        const threadElement = document.querySelector('#js-posts');

        observer.observe(threadElement, {
            childList: true,
            subtree: true,
        });

        return observer;
    }

    function parsePostData() {

        const posts = document.querySelectorAll('.post');

        let postData = [];
        const timestamps = [];

        posts.forEach(post => {

            const postId = post.id.replace('post-', '');

            const postType = post.classList.contains('post_type_watched') ? 'watched' : '';

            const timestampElement = post.querySelector('.post__time');
            const timestamp = timestampElement ? timestampElement.textContent : null;

            const refmap = post.querySelector('#refmap-' + postId);
            const references = [];

            if (refmap) {
                const refLinks = refmap.querySelectorAll('.post-reply-link');
                refLinks.forEach(link => {
                    const refPostId = link.getAttribute('data-num');
                    if (refPostId) {
                        references.push(refPostId);
                    }
                });
            }

            postData.push({
                id: postId,
                type: postType,
                timestamp: parseTimestamp(timestamp),
                references: references
            });
        });

        // only fit on first parsing of post data, then just apply
        if (!mapTimestampToY) {
            const earliestTimestamp = postData[0].timestamp;
            const latestTimestamp = postData[postData.length - 1].timestamp;

            mapTimestampToY = fitMapTimestampToY(earliestTimestamp, latestTimestamp, CANVAS_PADDING + offset, ctx.canvas.height-CANVAS_PADDING);
        }

        postData = postData.map(post => {
            return ({...post, timestamp_y: mapTimestampToY(post.timestamp)})
        });

        return postData;
    }

    function getGraphData(postData) {
        const nodes = postData.map(node => ({...node, y: node.timestamp_y, x: CANVAS_PADDING + Math.random() * (canvas.width*0.8 - CANVAS_PADDING)}));

        const edges = [];

        postData.forEach(obj => {
            if (obj.references && obj.references.length > 0) {
                obj.references.forEach(reference => {
                    edges.push({ from: obj.id, to: reference });
                });
            }
        });

        return [nodes, edges];
    }

    function rescaleGraph(nodes, offset, scale) {
        const nodesNew = nodes.map(node => ({...node, y: scale*node.timestamp_y + offset, x: node.x}));
        //const edgesNew = edges;

        return nodesNew;
    }


    // util

    function parseTimestamp(timestamp) {

        const [datePart, _a, timePart] = timestamp.split(' ');
        const [day, month, year] = datePart.split('/').map(num => parseInt(num));
        const [hour, minute, second] = timePart.split(':').map(num => parseInt(num));

        return new Date(2000 + year, month - 1, day, hour, minute, second);
    }

    function fitMapTimestampToY(timestamp1, timestamp2, num1, num2) {

        const date1 = new Date(timestamp1);
        const date2 = new Date(timestamp2);

        const dateRange = date2 - date1;
        const numRange = num2 - num1;

        const mapTimestampToY = (datePost) => num1 + (numRange / dateRange) * (datePost - date1);

        return mapTimestampToY;

    }

//     function mapTimestampToY(timestamp, timestamp1, timestamp2, num1, num2) {
//         const date1 = new Date(timestamp1);
//         const date2 = new Date(timestamp2);
//         const datePost = new Date(timestamp);

//         const dateRange = date2 - date1;
//         const numRange = num2 - num1;

//         const datePostRel = datePost - date1;

//         const mapFun = (ts) => num1 + (numRange / dateRange) * (ts - date1);
//         return mapFun(datePost);
//     }

    ////// draw on canvas (requires postdata + canvas vars)

    // hover effect //
    let hoveredNode = null;
    const throttleDelay = 100;
    let lastPointerMoveTime = 0;

    canvas.addEventListener('pointermove', (event) => {
        const now = Date.now();
        if (now - lastPointerMoveTime < throttleDelay) return;
        lastPointerMoveTime = now;

        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const hovered = nodesToDraw.find(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            return Math.sqrt(dx * dx + dy * dy) < 10;
        });

        if (hovered !== hoveredNode) {
            hoveredNode = hovered;
            drawGraph();
            if (hoveredNode) drawHoverEffect(hoveredNode);
        }
    });

    //////

    function drawGraph() {

        if(!SETTINGS.TOGGLE_OPEN_WIDGET) return;

        ctx.fillStyle = SETTINGS.SETTING_NODE_COLOUR;
        ctx.strokeStyle = SETTINGS.SETTING_NODE_COLOUR;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        shadeNightHours();

        highlightVisibleNodes();

        nodesToDraw.forEach((node, i) => {
            const style = node.type === 'watched' ? SETTINGS.SETTING_NODE_COLOUR_WATCHED : SETTINGS.SETTING_NODE_COLOUR;
            const label = SETTINGS.SETTING_DISPLAY_NODE_IDS ? node.id : null;
            drawNode(node, style, label);
        });

        edges.forEach(edge => {
            const fromNode = nodesToDraw.find(node => node.id === edge.from);
            const toNode = nodesToDraw.find(node => node.id === edge.to);
            drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y, {color: SETTINGS.SETTING_EDGE_COLOUR});
        });

    }

//     function drawArrow(fromX, fromY, toX, toY, style) {

//         ctx.fillStyle = style?.color || SETTINGS.SETTING_EDGE_COLOUR;
//         ctx.strokeStyle = style?.color || SETTINGS.SETTING_EDGE_COLOUR;
//         ctx.lineWidth = style?.lineWidth || 1;

//         const angle = Math.atan2(toY - fromY, toX - fromX);
//         const headLength = 5;

//         ctx.beginPath();
//         ctx.moveTo(fromX, fromY);
//         ctx.lineTo(toX, toY);
//         ctx.stroke();

//         // Draw arrowhead
//         ctx.beginPath();
//         ctx.moveTo(toX, toY);
//         ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
//         ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
//         ctx.lineTo(toX, toY);
//         ctx.fill();
//     }

    function drawArrow(fromX, fromY, toX, toY, style) {
        ctx.fillStyle = style?.color || SETTINGS.SETTING_EDGE_COLOUR;
        ctx.strokeStyle = style?.color || SETTINGS.SETTING_EDGE_COLOUR;
        ctx.lineWidth = style?.lineWidth || 1;

        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLength = 5;

        const circleRadius = 5;

        const startX = fromX + circleRadius * Math.cos(angle);
        const startY = fromY + circleRadius * Math.sin(angle);
        const endX = toX - circleRadius * Math.cos(angle);
        const endY = toY - circleRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fill();
    }

    function drawNode(node, style, label) {

        ctx.fillStyle = style;
        ctx.strokeStyle = style;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, SETTINGS.NODE_SIZE, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        if (label) {
            ctx.fillStyle = '#ccc';
            ctx.font = '10px Arial';
            ctx.fillText(label, node.x - 5, node.y + 5);
        }

    }

    function drawHoverEffect(node) {

        drawNode(node, SETTINGS.SETTING_NODE_COLOUR_HOVER, node.id);

        const style = {
            color: SETTINGS.SETTING_NODE_COLOUR_HOVER,
            lineWidth: 2
        };

        edges.forEach(edge => {
            const fromNode = nodesToDraw.find(node => node.id === edge.from);
            const toNode = nodesToDraw.find(node => node.id === edge.to);

            if((fromNode === node)||(toNode === node)) {
                drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y, style);
            }
        });

    }

//     function shadeNightHours() {

//         const timeShift = 0;

//         const nightStart = 0;
//         const nightEnd = 9;

//         const earliestTimestamp = postData[0].timestamp;
//         const latestTimestamp = postData[postData.length - 1].timestamp;

//         ctx.fillStyle = 'rgba(64, 16, 64, 0.3)';

//         const earliestDate = new Date(earliestTimestamp);
//         const latestDate = new Date(latestTimestamp);

//         for (let date = new Date(earliestDate); date <= latestDate; date.setDate(date.getDate() + 1), date.setHours(0, 0, 0, 0)) {

//             const nightStartTime = new Date(date);
//             nightStartTime.setHours(nightStart + timeShift);

//             const nightEndTime = new Date(date);
//             nightEndTime.setHours(nightEnd + timeShift);

//             let startY = mapTimestampToY(nightStartTime);
//             if (startY === CANVAS_PADDING) startY = 0;
//             let endY = mapTimestampToY(nightEndTime);

//             startY = offset + startY*scale;
//             endY = offset + endY*scale;

//             ctx.fillRect(0, startY, ctx.canvas.width, endY - startY);
//         }
//     }

    function shadeNightHours() {
        const timeShift = 0;

        const nightStart = 0;
        const nightEnd = 9;

        const earliestTimestamp = postData[0].timestamp;
        const latestTimestamp = postData[postData.length - 1].timestamp;

        ctx.fillStyle = 'rgba(64, 16, 64, 0.3)';

        const earliestDate = new Date(earliestTimestamp);
        const latestDate = new Date(latestTimestamp);

        const totalDays = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24));
        const maxLabels = 10; // Maximum number of labels to show
        const labelInterval = Math.max(1, Math.floor(totalDays / maxLabels)); // Interval in days

        const labels = [];

        for (let date = new Date(earliestDate); date <= latestDate; date.setDate(date.getDate() + 1), date.setHours(0, 0, 0, 0)) {
            // Shade the night hours
            const nightStartTime = new Date(date);
            nightStartTime.setHours(nightStart + timeShift);

            const nightEndTime = new Date(date);
            nightEndTime.setHours(nightEnd + timeShift);

            let startY = mapTimestampToY(nightStartTime);
            if (startY === CANVAS_PADDING) startY = 0;
            let endY = mapTimestampToY(nightEndTime);

            startY = offset + startY * scale;
            endY = offset + endY * scale;

            ctx.fillRect(0, startY, ctx.canvas.width, endY - startY);

            // Add date labels at intervals
            const dayIndex = Math.floor((date - earliestDate) / (1000 * 60 * 60 * 24)); // Days since the start
            if (dayIndex % labelInterval === 0) {
                labels.push(new Date(date)); // Store labels to render later
            }
        }

        // Render date labels
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';

        labels.forEach(labelDate => {
            const labelTimestamp = new Date(labelDate).setHours(0, 0, 0, 0);
            const labelY = offset + mapTimestampToY(labelTimestamp) * scale;
            const formattedDate = labelDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            ctx.fillText(formattedDate, ctx.canvas.width - 10, labelY); // Draw text at the right edge
        });
    }


    function highlightVisibleNodes() {
        if (visiblePostIds.size === 0) return;

        const visiblePosts = Array.from(visiblePostIds)
        .map(id => postData.find(post => post.id === id))
        .sort((a, b) => a.timestamp_y - b.timestamp_y);

        const firstVisiblePost = visiblePosts[0];
        const lastVisiblePost = visiblePosts[visiblePosts.length - 1];

        const startY = firstVisiblePost.timestamp_y;
        const endY = lastVisiblePost.timestamp_y;

        // todo: вынести в параметры наверх + параметры drawNode
        const temp = SETTINGS.NODE_SIZE;
        SETTINGS.NODE_SIZE = SETTINGS.NODE_SIZE + 1;

        nodesToDraw.forEach((node) => {
            if (node.y >= startY && node.y <= endY) {
                drawNode(node, 'rgba(255, 255, 255, 0.5)', null);
            }
        });

        SETTINGS.NODE_SIZE = temp;
    }

    //

    function handleCanvasClick (event) {

        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        nodesToDraw.forEach(node => {
            const distance = Math.sqrt(Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2));
            if (distance <= SETTINGS.NODE_SIZE) {

                const targetDiv = document.getElementById(`post-${node.id}`);
                if (targetDiv) {
                    targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    targetDiv.classList.add('highlight');

                    setTimeout(() => {
                        targetDiv.classList.remove('highlight');
                    }, 2000);

                }
            }
        });
    };

    //

    let intersectionObserver = null;

    function trackVisiblePosts() {

        if (intersectionObserver !== null) {
            intersectionObserver.disconnect();
        }

        intersectionObserver = new IntersectionObserver(handleIntersection, {
            root: null,
            threshold: 0.3
        });

        document.querySelectorAll('[id^="post-"]').forEach(post => intersectionObserver.observe(post));
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            const postId = entry.target.id.split('-')[1];

            if (!(/^\d+$/.test(postId))) return;

            if (entry.isIntersecting) {
                visiblePostIds.add(postId);
            } else {
                visiblePostIds.delete(postId);
            }
        });

        drawGraph();
    }


    //////

    function fruchtermanReingold(nodes, edges, width, height) {
        const k = Math.sqrt(width * height / nodes.length);

        nodes.forEach(node => {
            node.x = CANVAS_PADDING + Math.random() * (width - 2*CANVAS_PADDING);
            //node.y = Math.random() * height;
        });


        const maxIterations = 10;
        const temperatureDecay = 0.95;
        let temperature = width / 10;


        for (let iter = 0; iter < maxIterations; iter++) {
            const repulsionForces = new Array(nodes.length).fill({ x: 0, y: 0 });
            const attractionForces = new Array(nodes.length).fill({ x: 0, y: 0 });

            nodes.forEach((node, i) => {
                nodes.forEach((otherNode, j) => {
                    if (i !== j) {
                        const dx = node.x - otherNode.x;
                        const dy = node.y - otherNode.y;
                        const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;

                        //const force = k * k / distance;
                        const force = k / (distance * distance);

                        repulsionForces[i].x += (force * dx) / distance;

                        //repulsionForces[i].y += (force * dy) / distance;
                        repulsionForces[i].y = 0;
                    }
                });
            });


            edges.forEach(edge => {
                const fromNode = nodes.find(node => node.id === edge.from);
                const toNode = nodes.find(node => node.id === edge.to);
                const dx = fromNode.x - toNode.x;
                const dy = fromNode.y - toNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = (distance * distance) / k;

                const attractionForceX = (force * dx) / distance;

                // !
                // const attractionForceY = (force * dy) / distance;
                const attractionForceY = 0;

                const fromIndex = nodes.findIndex(node => node.id === edge.from);
                const toIndex = nodes.findIndex(node => node.id === edge.to);

                attractionForces[fromIndex].x -= attractionForceX;
                attractionForces[fromIndex].y -= attractionForceY;

                attractionForces[toIndex].x += attractionForceX;
                attractionForces[toIndex].y += attractionForceY;
            });

            nodes.forEach((node, i) => {
                const totalForceX = repulsionForces[i].x + attractionForces[i].x;

                // !
                // const totalForceY = repulsionForces[i].y + attractionForces[i].y;
                const totalForceY = 0;

                node.x += totalForceX / k;
                node.y += totalForceY / k;

                node.x = Math.min(Math.max(node.x, 0), width);
                node.y = Math.min(Math.max(node.y, 0), height);
            });

            temperature *= temperatureDecay;
            if (temperature < 0.1) break;
        }

        return nodes;
    }

})();

