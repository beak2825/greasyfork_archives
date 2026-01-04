// ==UserScript==
// @name         SVG Mindmap to Freemind Converter (NotebookLM - Hierarchical)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Converts NotebookLM mindmap SVG to hierarchical Freemind (.mm). Auto-expands nodes. Matches path ends to node EDGE MIDPOINTS. REQUIRES ACCURATE SELECTORS. Check console.
// @author       mike868（小红书：迈克八六八）
// @match        https://notebooklm.google.com/notebook/*
// @grant        GM_download
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537600/SVG%20Mindmap%20to%20Freemind%20Converter%20%28NotebookLM%20-%20Hierarchical%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537600/SVG%20Mindmap%20to%20Freemind%20Converter%20%28NotebookLM%20-%20Hierarchical%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    // ====> !!! CRITICAL: YOU **MUST** INSPECT THE LIVE NOTEBOOKLM SVG AND ADJUST THESE !!! <====
    const svgSelector = 'div.mindmap > svg';         // Selector for the main SVG element.
    const nodeGroupSelector = 'g[transform]';        // Selector for the <g> containing all nodes/paths. Try 'g' if unsure.
    const nodeSelector = 'g.node';                   // Selector for individual node <g> elements.
    const rectSelector = 'rect';                     // Selector *within* a node <g> for the main background rectangle.
    const textSelector = 'text.node-name';           // Selector *within* a node <g> for the primary text.
    const textFallbackSelector = 'text';             // Fallback selector for text.
    const linkSelector = 'path.link';                // Selector for connection <path> elements.
    const expandCircleSelector = 'circle';           // Selector for expandable node circles.
    const expandSymbolSelector = 'text.expand-symbol'; // Selector for expand/collapse symbols (> or <).
    const NODE_MATCH_TOLERANCE_PX = 85;              // How close (pixels) path endpoint needs to be to node *edge midpoint*. ADJUST IF NEEDED.
    const EXPAND_DELAY_MS = 300;                     // Delay between expanding nodes (to prevent overwhelming the browser).
    const MAX_EXPAND_ATTEMPTS = 3;                   // Maximum number of attempts to expand all nodes.
    // ==========================================================================================

    const buttonText = 'Convert MindMap to .mm (Hierarchy v2.4 Edge Match)';
    const buttonId = 'svg-to-mm-converter-button-v2-4-hierarchical';
    const expandButtonText = 'Expand All Nodes';
    const expandButtonId = 'expand-all-nodes-button';
    const NODE_MATCH_TOLERANCE_SQ = NODE_MATCH_TOLERANCE_PX * NODE_MATCH_TOLERANCE_PX;

    console.log("SVG to MM Script v2.4 (Edge Match + Auto-Expand) Loaded. Waiting for page content...");

    // --- Helper Functions ---
    function escapeXml(unsafe) { /* ... same ... */ if(typeof unsafe !== 'string') return ''; return unsafe.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'})[c]); }
    function getTranslateXY(element) { /* ... same ... */ if(!element || typeof element.getAttribute !== 'function') return null; try { const transform = element.getAttribute('transform'); if(transform) { const match = transform.match(/translate\(\s*([^,\s]+)\s*,\s*([^,\s\)]+)\s*\)/); if(match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) }; } } catch (e) { console.warn("Error parsing translate:", e, element); } return null; }
    function parsePathEndpoints(d) { /* ... same ... */ if(!d) return null; try { const moveMatch = d.match(/M\s*(-?[\d\.]+)\s*[,\s]\s*(-?[\d\.]+)/i); const endCoordMatch = d.match(/(-?[\d\.]+)\s*[,\s]\s*(-?[\d\.]+)\s*Z?$/i); if(moveMatch && endCoordMatch) return { startX: parseFloat(moveMatch[1]), startY: parseFloat(moveMatch[2]), endX: parseFloat(endCoordMatch[1]), endY: parseFloat(endCoordMatch[2]) }; else { console.warn(`Path parse failed primary regex:`, d); /* fallback omitted for brevity but could be added back */ } } catch (e) { console.error("Path parse error:", e, d); } return null; }
    function distanceSq(p1, p2) { /* ... same ... */ if (!p1 || !p2) return Infinity; const dx = p1.x - p2.x; const dy = p1.y - p2.y; return dx * dx + dy * dy; }

    /**
     * Finds the node whose specified edge midpoint(s) are closest to a given point.
     * @param {{x: number, y: number}} point The target point (e.g., path endpoint).
     * @param {Array} nodesWithEdges Array of node objects { id, leftEdgeMid?: {x, y}, rightEdgeMid?: {x, y}, ... }.
     * @param {number} toleranceSq Max squared distance allowed.
     * @param {Array<string>} edgeKeys Array of keys for edge midpoints to check (e.g., ['leftEdgeMid', 'rightEdgeMid']).
     * @returns {object | null} The closest node object or null.
     */
    function findClosestNodeByEdge(point, nodesWithEdges, toleranceSq, edgeKeys) {
        let closestNode = null;
        let minDistSq = Infinity;
        let closestEdgeKey = null; // For debugging

        if (!point || !edgeKeys || edgeKeys.length === 0) {
            console.warn("findClosestNodeByEdge: Invalid point or edgeKeys.", {point, edgeKeys});
            return null;
        }

        nodesWithEdges.forEach(node => {
            edgeKeys.forEach(key => {
                const edgeMidpoint = node[key];
                if (edgeMidpoint) { // Check if this specific edge point exists for the node
                    const distSq = distanceSq(point, edgeMidpoint);
                    if (distSq < minDistSq) {
                        minDistSq = distSq;
                        closestNode = node;
                        closestEdgeKey = key; // Store which edge matched best
                    }
                }
            });
        });

        if (closestNode && minDistSq <= toleranceSq) {
            // console.log(`-> Matched point (${point.x.toFixed(1)}, ${point.y.toFixed(1)}) to node "${closestNode.text}" via edge "${closestEdgeKey}" (Dist: ${Math.sqrt(minDistSq).toFixed(1)}px)`);
            return closestNode;
        } else {
            // console.warn(`-> No node edge (${edgeKeys.join('/')}) found close enough to point (${point.x.toFixed(1)}, ${point.y.toFixed(1)}). ` +
            //              `Closest edge dist: ${Math.sqrt(minDistSq).toFixed(1)}px`);
            return null;
        }
    }

    function getNodeText(svgNodeElement) { /* ... same as v2.2 ... */ if(!svgNodeElement || typeof svgNodeElement.querySelector !== 'function') return 'Invalid Element'; let nodeText = 'Untitled'; try { let textElement = svgNodeElement.querySelector(`:scope > ${textSelector}`); if(!textElement) textElement = svgNodeElement.querySelector(`:scope > ${textFallbackSelector}`); if(textElement && textElement.textContent){ nodeText = textElement.textContent.trim(); const tspans = textElement.querySelectorAll(':scope > tspan'); if(tspans.length > 0) nodeText = Array.from(tspans).map(tspan => tspan.textContent.trim()).join(' ').trim(); nodeText = nodeText.replace(/\s+/g, ' '); } else { console.warn(`getNodeText: No text found:`, svgNodeElement); nodeText = (svgNodeElement.textContent || '').replace(/\s+/g, ' ').trim() || 'Untitled Fallback'; } } catch (e) { console.error("Error in getNodeText:", svgNodeElement, e); nodeText = "Error Reading Text"; } return nodeText || "Untitled Error"; }

    /**
     * Attempts to click on an SVG element using various methods
     * @param {Element} element The element to click
     * @param {string} description Description for logging
     * @returns {boolean} Whether any click method succeeded
     */
    function attemptClickOnElement(element, description) {
        if (!element) return false;

        let clickSuccess = false;

        // Method 1: dispatchEvent with MouseEvent
        try {
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(clickEvent);
            console.log(`Method 1 (MouseEvent) attempted on ${description}`);
            clickSuccess = true;
        } catch (e) {
            console.warn(`Method 1 (MouseEvent) failed on ${description}: ${e.message}`);
        }

        // Method 2: createEvent (older browsers)
        if (!clickSuccess) {
            try {
                const clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('click', true, true);
                element.dispatchEvent(clickEvent);
                console.log(`Method 2 (createEvent) attempted on ${description}`);
                clickSuccess = true;
            } catch (e) {
                console.warn(`Method 2 (createEvent) failed on ${description}: ${e.message}`);
            }
        }

        // Method 3: Trigger click via parent HTML element if available
        if (!clickSuccess && element.parentElement && !(element instanceof SVGElement)) {
            try {
                element.parentElement.click();
                console.log(`Method 3 (parent click) attempted on ${description}`);
                clickSuccess = true;
            } catch (e) {
                console.warn(`Method 3 (parent click) failed on ${description}: ${e.message}`);
            }
        }

        return clickSuccess;
    }

    /**
     * Expands all collapsible nodes in the mindmap.
     * @param {Element} svgElement The SVG element containing the mindmap.
     * @param {Function} callback Optional callback to run after expansion is complete.
     */
    function expandAllNodes(svgElement, callback) {
        if (!svgElement) {
            console.error("expandAllNodes: No SVG element provided.");
            if (callback) callback(false);
            return;
        }

        console.log("Starting node expansion process...");

        // Find all nodes with ">" expand symbol (collapsed nodes)
        const mainGroup = svgElement.querySelector(nodeGroupSelector) || svgElement;
        let expandableNodes = Array.from(mainGroup.querySelectorAll(`${nodeSelector} ${expandSymbolSelector}`))
            .filter(symbol => symbol.textContent === ">" || symbol.textContent.includes(">"));

        if (expandableNodes.length === 0) {
            console.log("No expandable nodes found.");
            if (callback) callback(true);
            return;
        }

        console.log(`Found ${expandableNodes.length} expandable nodes.`);

        let expandedCount = 0;
        let attemptCount = 0;
        let previousCount = -1;

        // Function to expand nodes with delay
        function expandNodesWithDelay() {
            // If no progress was made in the last attempt and we've tried enough times, stop
            if (previousCount === expandableNodes.length && attemptCount >= MAX_EXPAND_ATTEMPTS) {
                console.log(`Stopped expanding after ${attemptCount} attempts. ${expandedCount} nodes expanded. ${expandableNodes.length} nodes still collapsed.`);
                if (callback) callback(expandedCount > 0);
                return;
            }

            previousCount = expandableNodes.length;
            attemptCount++;

            // Find expandable nodes again (as DOM may have changed)
            expandableNodes = Array.from(mainGroup.querySelectorAll(`${nodeSelector} ${expandSymbolSelector}`))
                .filter(symbol => symbol.textContent === ">" || symbol.textContent.includes(">"));

            if (expandableNodes.length === 0) {
                console.log(`All nodes expanded successfully after ${attemptCount} attempts.`);
                if (callback) callback(true);
                return;
            }

            console.log(`Attempt ${attemptCount}: Found ${expandableNodes.length} nodes to expand.`);

            // Get the parent node of the expand symbol and find its circle
            const nodeToExpand = expandableNodes[0];
            const parentNode = nodeToExpand.closest(nodeSelector);

            if (parentNode) {
                const nodeText = getNodeText(parentNode);
                console.log(`Trying to expand node: "${nodeText}"`);

                let clickSuccess = false;

                // Try 1: Click on the circle element
                const expandCircle = parentNode.querySelector(expandCircleSelector);
                if (expandCircle) {
                    console.log(`Trying to click circle for node: "${nodeText}"`);
                    clickSuccess = attemptClickOnElement(expandCircle, `circle for "${nodeText}"`);
                }

                // Try 2: Click on the expand symbol text
                if (!clickSuccess) {
                    console.log(`Trying to click expand symbol for node: "${nodeText}"`);
                    clickSuccess = attemptClickOnElement(nodeToExpand, `expand symbol for "${nodeText}"`);
                }

                // Try 3: Click on the rect element
                if (!clickSuccess) {
                    const rect = parentNode.querySelector(rectSelector);
                    if (rect) {
                        console.log(`Trying to click rect for node: "${nodeText}"`);
                        clickSuccess = attemptClickOnElement(rect, `rect for "${nodeText}"`);
                    }
                }

                // Try 4: Click on the parent node itself
                if (!clickSuccess) {
                    console.log(`Trying to click parent node for: "${nodeText}"`);
                    clickSuccess = attemptClickOnElement(parentNode, `parent node for "${nodeText}"`);
                }

                if (clickSuccess) {
                    expandedCount++;
                } else {
                    console.warn(`Failed to expand node "${nodeText}" after all attempts`);
                }

                // Continue with next node after a delay
                setTimeout(expandNodesWithDelay, EXPAND_DELAY_MS);
            } else {
                console.warn("Could not find parent node for expand symbol:", nodeToExpand);
                setTimeout(expandNodesWithDelay, EXPAND_DELAY_MS);
            }
        }

        // Start expanding nodes
        expandNodesWithDelay();
    }

    function generateMmNodeXml(node, nodeMap, indent, parentNode) { /* ... same logic as v2.2, uses centerPos or pos for POSITION attr ... */
        let position = '';
        const nodePosForSort = node.centerPos || node.pos; // Prefer center for position attribute too
        const parentPosForSort = parentNode ? (parentNode.centerPos || parentNode.pos) : null;

        if (parentPosForSort && nodePosForSort) {
            const positionBuffer = 10;
            if (nodePosForSort.x > parentPosForSort.x + positionBuffer) position = 'right';
            else if (nodePosForSort.x < parentPosForSort.x - positionBuffer) position = 'left';
        }
        const posAttr = position ? ` POSITION="${position}"` : '';
        const nodeIdText = node.text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
        const nodeId = `ID_${node.id || nodeIdText || 'node'}`;
        let xml = `${indent}<node TEXT="${escapeXml(node.text)}"${posAttr} ID="${nodeId}"`;
        if (node.children && node.children.length > 0) {
            xml += `>\n`;
            const sortedChildren = node.children
               .map(id => nodeMap.get(id))
               .filter(Boolean)
               .sort((a, b) => ((a.centerPos?.y ?? a.pos?.y ?? 0) - (b.centerPos?.y ?? b.pos?.y ?? 0))); // Sort by Y
             sortedChildren.forEach(childNode => { xml += generateMmNodeXml(childNode, nodeMap, indent + '\t', node); });
            xml += `${indent}</node>\n`;
        } else { xml += `/>\n`; }
        return xml;
     }

    function convertSvgToHierarchicalFreemind(svgElement) {
        console.log("convertSvgToHierarchicalFreemind v2.4: Starting conversion...");
        if (!svgElement || typeof svgElement.querySelector !== 'function') { /*...*/ return null; }

        const mainGroup = svgElement.querySelector(nodeGroupSelector);
        const containerElement = mainGroup || svgElement;
        console.log("Using container:", containerElement.tagName);

        const nodeElements = Array.from(containerElement.querySelectorAll(`:scope > ${nodeSelector}`));
        const linkElements = Array.from(containerElement.querySelectorAll(`:scope > ${linkSelector}`));
        console.log(`Found ${nodeElements.length} nodes, ${linkElements.length} links.`);

        if (nodeElements.length === 0) { /*...*/ return null; }

        // 1. Extract Node Info (including Edge Midpoint Calculation)
        const nodeMap = new Map();
        const nodesWithEdges = []; // Holds nodes with successfully calculated edge positions
        let nodeCounter = 0;

        nodeElements.forEach((el) => {
            nodeCounter++;
            const nodeId = `node_${nodeCounter}`;
            const nodePos = getTranslateXY(el);
            const text = getNodeText(el);

            if (!text || text.startsWith('Untitled') || text.startsWith('Error') || text === 'Invalid Element') { /* skip */ return; }

            let centerPos = null, leftEdgeMid = null, rightEdgeMid = null;
            let nodeRectElem = null;

            try {
                 nodeRectElem = el.querySelector(`:scope > ${rectSelector}`);
                 if (nodeRectElem && nodePos) {
                     const rx = parseFloat(nodeRectElem.getAttribute('x') || '0');
                     const ry = parseFloat(nodeRectElem.getAttribute('y') || '0');
                     const rwidth = parseFloat(nodeRectElem.getAttribute('width') || '0');
                     const rheight = parseFloat(nodeRectElem.getAttribute('height') || '0');

                     if (rwidth > 0 && rheight > 0) {
                         // Calculate center (still useful for sorting/position attr)
                         centerPos = { x: nodePos.x + rx + rwidth / 2, y: nodePos.y + ry + rheight / 2 };
                         // Calculate edge midpoints (absolute coords)
                         leftEdgeMid = { x: nodePos.x + rx, y: nodePos.y + ry + rheight / 2 };
                         rightEdgeMid = { x: nodePos.x + rx + rwidth, y: nodePos.y + ry + rheight / 2 };
                         // console.log(`Node "${text}": translate=(${nodePos.x.toFixed(0)}, ${nodePos.y.toFixed(0)}), L-Edge=(${leftEdgeMid.x.toFixed(0)}, ${leftEdgeMid.y.toFixed(0)}), R-Edge=(${rightEdgeMid.x.toFixed(0)}, ${rightEdgeMid.y.toFixed(0)})`);
                     } else { console.warn(`Node "${text}": Rect width/height invalid.`); }
                 } else if (nodePos) {
                     console.warn(`Node "${text}": Rect not found or node has no pos. Cannot calc edges.`);
                 } else { console.warn(`Node "${text}": No position.`); }
            } catch(e) { console.error(`Error processing rect for node "${text}":`, e, el); }

            const nodeData = {
                id: nodeId, text: text, pos: nodePos,
                centerPos: centerPos, leftEdgeMid: leftEdgeMid, rightEdgeMid: rightEdgeMid, // Store edge points
                parentId: null, children: [],
            };
            nodeMap.set(nodeId, nodeData);

            // Add to list for matching only if edge points were calculable
            if (leftEdgeMid && rightEdgeMid) {
                nodesWithEdges.push(nodeData);
            }
        });
        console.log(`Processed ${nodeMap.size} nodes. ${nodesWithEdges.length} nodes have edge midpoints calculated for linking.`);

        if (nodesWithEdges.length < 2 && nodeMap.size >= 2) { console.warn("Not enough nodes with calculable edges. Linking likely impossible."); }


        // 2. Extract Links and Match Parent/Child (using node edge midpoints)
        let linksEstablished = 0;
        let pathsParsed = 0;
        linkElements.forEach((linkEl, index) => {
            const d = linkEl.getAttribute('d');
            if (!d) { return; }
            const endpoints = parsePathEndpoints(d);

            if (endpoints) {
                pathsParsed++;
                const startPoint = { x: endpoints.startX, y: endpoints.startY };
                const endPoint = { x: endpoints.endX, y: endpoints.endY };
                // console.log(`Path ${index+1}: Start=(${startPoint.x.toFixed(1)}, ${startPoint.y.toFixed(1)}), End=(${endPoint.x.toFixed(1)}, ${endPoint.y.toFixed(1)})`);

                // Try to find parent by matching startPoint to a node's edge
                // Prioritize right edge, then left edge
                let parentNode = findClosestNodeByEdge(startPoint, nodesWithEdges, NODE_MATCH_TOLERANCE_SQ, ['rightEdgeMid']);
                if (!parentNode) {
                    parentNode = findClosestNodeByEdge(startPoint, nodesWithEdges, NODE_MATCH_TOLERANCE_SQ, ['leftEdgeMid']);
                }

                // Try to find child by matching endPoint to a node's edge
                // Prioritize left edge, then right edge
                let childNode = findClosestNodeByEdge(endPoint, nodesWithEdges, NODE_MATCH_TOLERANCE_SQ, ['leftEdgeMid']);
                 if (!childNode) {
                     childNode = findClosestNodeByEdge(endPoint, nodesWithEdges, NODE_MATCH_TOLERANCE_SQ, ['rightEdgeMid']);
                 }


                if (parentNode && childNode && parentNode.id !== childNode.id) {
                     const childNodeData = nodeMap.get(childNode.id);
                     const parentNodeData = nodeMap.get(parentNode.id);

                    if (!childNodeData || !parentNodeData) { console.error(`Internal Map Error`); return; }

                    if (childNodeData.parentId === null) {
                        childNodeData.parentId = parentNodeData.id;
                        if (!parentNodeData.children) parentNodeData.children = [];
                        if (!parentNodeData.children.includes(childNodeData.id)){
                           parentNodeData.children.push(childNodeData.id);
                           linksEstablished++;
                           console.log(`Link ${linksEstablished}: "${parentNodeData.text}" -> "${childNodeData.text}" (via path ${index+1})`);
                        }
                    } else if (childNodeData.parentId !== parentNodeData.id) {
                         console.warn(`Child "${childNodeData.text}" already has parent. Tried assigning "${parentNodeData.text}". Path ${index+1}`);
                    }
                } else {
                     // Log failure reason
                     let reason = "";
                     if (!parentNode) reason += ` Could not match path start (${startPoint.x.toFixed(0)},${startPoint.y.toFixed(0)}) to any node edge (L/R).`;
                     if (!childNode) reason += ` Could not match path end (${endPoint.x.toFixed(0)},${endPoint.y.toFixed(0)}) to any node edge (L/R).`;
                     if (parentNode && childNode && parentNode.id === childNode.id) reason += ` Path endpoints matched same node ("${parentNode.text}").`;
                     console.warn(`Failed link for path ${index + 1}.${reason}`);
                }
            } else { console.warn(`Skipping link ${index + 1} - bad 'd'`); }
        });
        console.log(`Parsed ${pathsParsed}/${linkElements.length} paths. Established ${linksEstablished} links via edge matching.`);

        if (nodeMap.size > 1 && linksEstablished === 0 && linkElements.length > 0) {
            console.error("CRITICAL: Edge linking failed. Check console warnings. Ensure rect selector is correct, try increasing tolerance drastically (e.g., 150), or SVG structure is unexpected.");
            alert("Conversion Warning (v2.4): Failed to link nodes using edges. Check console (F12). Verify selectors, try higher tolerance.");
        }

        // 3. Find Root Node(s)
        const rootNodesData = []; /* ... same logic as v2.2 ... */
        nodeMap.forEach(node => { if(node.parentId === null) rootNodesData.push(node); });
        console.log(`Found ${rootNodesData.length} potential root(s).`);
        let actualRootNode = null; /* ... same root selection logic as v2.2 ... */
        let rootText = "MindmapRoot";
        if(rootNodesData.length === 0 && nodeMap.size > 0) { console.error("No root found!"); /* fallback... */ if(nodesWithEdges.length > 0) { nodesWithEdges.sort((a,b) => (a.centerPos?.x ?? a.pos?.x ?? Infinity) - (b.centerPos?.x ?? b.pos?.x ?? Infinity)); actualRootNode = nodesWithEdges[0]; console.warn(`Fallback root: "${actualRootNode?.text}"`); } else { actualRootNode = nodeMap.values().next().value; } if(!actualRootNode) { alert("Crit Err: No root"); return null; } }
        else if (rootNodesData.length > 1) { console.warn("Multiple roots:", rootNodesData.map(n=>n.text)); rootNodesData.sort((a,b)=>{ const ax = a.centerPos?.x ?? a.pos?.x ?? Infinity; const bx = b.centerPos?.x ?? b.pos?.x ?? Infinity; if (ax !== bx) return ax - bx; const ay = a.centerPos?.y ?? a.pos?.y ?? Infinity; const by = b.centerPos?.y ?? b.pos?.y ?? Infinity; return ay - by; }); actualRootNode = rootNodesData[0]; console.warn(`Selected root: "${actualRootNode?.text}"`); }
        else { actualRootNode = rootNodesData[0]; console.log(`Single root: "${actualRootNode?.text}"`); }
        if(!actualRootNode) { console.error("No root determined."); return null; }
        rootText = actualRootNode.text;


        // 4. Generate Hierarchical XML
        console.log(`Generating XML from root: "${rootText}"`); /* ... same as v2.2 ... */
        let mindmapXmlBody = ""; try { mindmapXmlBody = generateMmNodeXml(actualRootNode, nodeMap, '\t', null); } catch (e) { console.error("XML Gen Error:", e); return null; } if (!mindmapXmlBody) { console.error("XML Empty"); return null; }

        // --- Final XML ---
        const freemindXml = `<map version="1.0.1">\n` + /* ... same header comments as v2.2 + version bump ... */
                            `<!-- Mind map converted from SVG by Userscript v2.4 (Hierarchical/Edge Match with Auto-Expand) -->\n` +
                            `<!-- Selectors: svg='${svgSelector}', group='${nodeGroupSelector}', node='${nodeSelector}', rect='${rectSelector}', link='${linkSelector}', text='${textSelector}' -->\n`+
                            `<!-- Tolerance: ${NODE_MATCH_TOLERANCE_PX}px -->\n`+
                             mindmapXmlBody + `</map>`;
        console.log("v2.3 Conversion process completed.");
        return { mmContent: freemindXml, rootText: rootText };
    }

    // --- Download Function --- (Identical)
    function downloadMMFile(filename, content) { /* ... same ... */ console.log(`Download: ${filename}`); try { GM_download({ url: `data:application/xml;charset=utf-8,${encodeURIComponent(content)}`, name: filename, saveAs: true, onerror: (err) => { console.error("GM_download error:", err); alert(`DL fail: ${err.error?.message || 'Unknown'}`); }, onload: () => { console.log(`DL initiated: ${filename}`); } }); } catch (e) { console.error("DL Call Error:", e); alert("DL Error: Tampermonkey/Permissions?"); } }

    // --- Button Creation and Event Handling ---
    function createConversionButton() {
        if(document.getElementById(buttonId)) return;
        const button = document.createElement('button');
        button.id = buttonId;
        button.textContent = buttonText;
        /* Style */
        button.style.position = 'fixed';
        button.style.bottom = '60px';
        button.style.right = '20px';
        button.style.zIndex = '10003'; /* Higher z */
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#fbbc05'; /* Yellow */
        button.style.color = 'black';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.fontFamily = 'Roboto, Arial, sans-serif';
        /* Event */
        button.addEventListener('click', () => {
            console.log(`Button "${buttonText}" clicked.`);
            button.textContent = "Processing...";

            // Use these properties instead of disabled attribute to avoid focus issues
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.7';
            button.style.cursor = 'default';

            setTimeout(() => {
                try {
                    const svg = document.querySelector(svgSelector);
                    if(!svg) {
                        throw new Error("SVG missing!");
                    }
                    console.log("SVG found:", svg);
                    const result = convertSvgToHierarchicalFreemind(svg);
                    if(result?.mmContent) {
                        let fn = "mindmap_hierarchy.mm";
                        if(result.rootText && !result.rootText.startsWith('Untitled')) {
                            fn = result.rootText.replace(/[<>:"/\\|?*\s\.]+/g, '_').replace(/_+/g, '_').substring(0, 100);
                            fn = (fn || "mindmap") + ".mm";
                        }
                        console.log(`Success. Root: "${result.rootText}". Download: ${fn}`);
                        downloadMMFile(fn, result.mmContent);
                        button.textContent = "DL Initiated";
                    } else {
                        alert("Edge Conversion failed (v2.4). Check console (F12). Verify selectors/tolerance.");
                        console.error("v2.4 result null/empty.");
                        button.textContent = "Convert Fail";
                    }
                } catch(error) {
                    alert("Error during v2.4 conversion. Check console (F12).");
                    console.error("v2.4 click error:", error);
                    button.textContent = "Error!";
                } finally {
                    setTimeout(() => {
                        button.textContent = buttonText;
                        // Re-enable the button
                        button.style.pointerEvents = '';
                        button.style.opacity = '';
                        button.style.cursor = '';
                    }, 3000);
                }
            }, 150);
        });
        document.body.appendChild(button);
        console.log("v2.4 Edge Match button added.");
    }

    // Create a button to expand all nodes
    function createExpandButton() {
        if (document.getElementById(expandButtonId)) return;

        const button = document.createElement('button');
        button.id = expandButtonId;
        button.textContent = expandButtonText;

        // Style similar to conversion button but different color
        button.style.position = 'fixed';
        button.style.bottom = '110px'; // Position above the conversion button
        button.style.right = '20px';
        button.style.zIndex = '10003';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4285f4'; // Blue
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.fontFamily = 'Roboto, Arial, sans-serif';

        // Event
        button.addEventListener('click', () => {
            console.log(`Button "${expandButtonText}" clicked.`);
            button.textContent = "Expanding...";

            // Use these properties instead of disabled attribute to avoid focus issues
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.7';
            button.style.cursor = 'default';

            setTimeout(() => {
                try {
                    const svg = document.querySelector(svgSelector);
                    if (!svg) {
                        throw new Error("SVG missing!");
                    }

                    expandAllNodes(svg, (success) => {
                        if (success) {
                            button.textContent = "Expanded!";
                            console.log("All nodes expanded successfully.");
                        } else {
                            button.textContent = "Expand Failed";
                            console.error("Failed to expand all nodes.");
                        }

                        setTimeout(() => {
                            button.textContent = expandButtonText;
                            // Re-enable the button
                            button.style.pointerEvents = '';
                            button.style.opacity = '';
                            button.style.cursor = '';
                        }, 2000);
                    });
                } catch (error) {
                    alert("Error during node expansion. Check console (F12).");
                    console.error("Expand click error:", error);
                    button.textContent = "Error!";

                    setTimeout(() => {
                        button.textContent = expandButtonText;
                        // Re-enable the button
                        button.style.pointerEvents = '';
                        button.style.opacity = '';
                        button.style.cursor = '';
                    }, 2000);
                }
            }, 150);
        });

        document.body.appendChild(button);
        console.log("Expand All button added.");
    }

    // --- Script Execution ---
    let observer = null;
    let buttonAdded = false;

    function initObserver() {
        console.log("Init Observer v2.4 for:", svgSelector);
        const target = document.body;
        const config = { childList: true, subtree: true };
        const callback = (mutations, obs) => {
            const svgExists = document.querySelector(svgSelector);
            if(svgExists && !buttonAdded) {
                console.log("SVG detected v2.4");
                if(!document.getElementById(buttonId)) {
                    createConversionButton();
                    createExpandButton();
                    buttonAdded = true;
                }
            } else if (!svgExists && buttonAdded) {
                console.log("SVG removed v2.4");
                buttonAdded = false;
                const btn = document.getElementById(buttonId);
                if(btn) btn.remove();
                const expandBtn = document.getElementById(expandButtonId);
                if(expandBtn) expandBtn.remove();
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(target, config);

        if(document.querySelector(svgSelector) && !buttonAdded) {
            console.log("SVG already present v2.4");
            if(!document.getElementById(buttonId)) {
                createConversionButton();
                createExpandButton();
                buttonAdded = true;
            }
        }
    }

    if(document.readyState === "complete" || document.readyState === "interactive") {
        initObserver();
    } else {
        window.addEventListener("load", initObserver);
    }

})();
