// ==UserScript==
// @name         Dynamic Graph (Calc Extension)
// @version      1.7
// @description  A script to plot graphs with improved plotting and axis markings
// @match        *://*/*
// @namespace    https://greasyfork.org/en/users/1291009
// @author       BadOrBest
// @license      MIT
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbUKCIRZQujx1f9j9HfzO0igzHyCAFjAxYKQ&s
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/505202/Dynamic%20Graph%20%28Calc%20Extension%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505202/Dynamic%20Graph%20%28Calc%20Extension%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultViewport = {
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        scale: 1
    };

    let viewport = { ...defaultViewport };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let renderingInterval;

    // Create canvas and zoom control elements
    const canvas = document.createElement('canvas');
    canvas.id = 'graph-canvas';
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '24px solid black';
    canvas.style.borderRadius = '12px';
    canvas.style.backgroundColor = 'white';
    canvas.style.display = 'none';
    canvas.style.position = 'absolute';
    canvas.style.left = '100px';
    canvas.style.top = '100px';
    document.body.appendChild(canvas);

    const zoomBar = document.createElement('div');
    zoomBar.id = 'zoom-bar';
    zoomBar.style.position = 'absolute';
    zoomBar.style.top = '10px';
    zoomBar.style.left = '10px';
    zoomBar.style.padding = '5px';
    zoomBar.style.backgroundColor = 'white';
    zoomBar.style.border = '1px solid black';
    zoomBar.style.borderRadius = '8px';
    zoomBar.style.zIndex = '1001';
    zoomBar.textContent = `Zoom: ${viewport.scale.toFixed(2)}x`;
    document.body.appendChild(zoomBar);

    function plotGraph(data) {
        const context = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        context.clearRect(0, 0, width, height);

        // Draw x and y axes only (no grid)
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(width / 2, 0);  // Y axis
        context.lineTo(width / 2, height);
        context.moveTo(0, height / 2); // X axis
        context.lineTo(width, height / 2);
        context.stroke();

        // Draw graph line and plot points only when in view
        context.strokeStyle = 'blue';
        context.lineWidth = 2;
        context.beginPath();
        let first = true;
        data.forEach(point => {
            const screenX = (point.x - viewport.x) * viewport.scale + width / 2;
            const screenY = height / 2 - (point.y - viewport.y) * viewport.scale;

            // Plot the line and points only when they're in view
            if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
                if (first) {
                    context.moveTo(screenX, screenY);
                    first = false;
                } else {
                    context.lineTo(screenX, screenY);
                }

                // Plot the point
                context.fillStyle = 'red';
                context.beginPath();
                context.arc(screenX, screenY, 3, 0, Math.PI * 2);
                context.fill();
            }
        });
        context.stroke();
    }

    function parseExpression(expression) {
        const dataPoints = [];
        const step = 1 / viewport.scale; // Increased granularity for better detail
        let lastX = viewport.x - viewport.width / 2;
        while (lastX <= viewport.x + viewport.width / 2) {
            try {
                const y = evaluateExpression(expression, lastX);
                if (Math.abs(lastX) <= viewport.width / 2 && Math.abs(y) <= viewport.height / 2) {
                    dataPoints.push({ x: lastX, y });
                }
            } catch (e) {
                console.error('Error evaluating expression:', e);
            }
            lastX += step;
        }
        return filterPlotPoints(dataPoints);
    }

    function filterPlotPoints(points) {
        const filteredPoints = [];
        let lastPoint = null;
        points.forEach(point => {
            if (!lastPoint || Math.abs(point.y - lastPoint.y) >= 2) { // Only add points with a gap of 2
                filteredPoints.push(point);
                lastPoint = point;
            }
        });
        return filteredPoints;
    }

    function evaluateExpression(expr, x) {
        return Function('x', `return ${expr.replace('^', '**')}`)(x);
    }

    function addGraphData() {
        const expression = prompt('Enter a mathematical expression (e.g., x^2 + 2*x + 1):');
        if (expression) {
            const data = parseExpression(expression);
            plotGraph(data);
            saveGraphData(expression, data);
        }
    }

    function clearGraphData() {
        localStorage.removeItem('graphExpression');
        localStorage.removeItem('graphData');
        plotGraph([]); // Clear the graph
    }

    function saveGraphData(expression, data) {
        try {
            localStorage.setItem('graphExpression', expression);
            localStorage.setItem('graphData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving graph data to localStorage:', error);
        }
    }

    function loadGraphData() {
        try {
            const expression = localStorage.getItem('graphExpression');
            const data = JSON.parse(localStorage.getItem('graphData'));
            if (expression && data) {
                plotGraph(data);
            }
        } catch (error) {
            console.error('Error loading graph data from localStorage:', error);
        }
    }

    function toggleGraph() {
        const canvas = document.getElementById('graph-canvas');
        if (canvas.style.display === 'none') {
            canvas.style.display = 'block';
            updateZoomBar();
            loadGraphData(); // Load saved graph data
        } else {
            canvas.style.display = 'none';
        }
    }

    function handleWheel(event) {
        event.preventDefault();
        const zoomFactor = 0.1;
        const zoomIn = event.deltaY < 0;
        const newScale = zoomIn ? viewport.scale * (1 + zoomFactor) : viewport.scale / (1 + zoomFactor);
        viewport.scale = Math.max(Math.min(newScale, 20), 0.1); // Clamp scale between 0.1 and 20

        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left - canvas.width / 2) / viewport.scale + viewport.x;
        const mouseY = (event.clientY - rect.top - canvas.height / 2) / viewport.scale + viewport.y;

        viewport.x = mouseX - (event.clientX - rect.left - canvas.width / 2) / viewport.scale;
        viewport.y = mouseY - (event.clientY - rect.top - canvas.height / 2) / viewport.scale;

        updateZoomBar();

        const expression = localStorage.getItem('graphExpression');
        if (expression) {
            const data = parseExpression(expression);
            plotGraph(data);
            startRenderingInterval(true); // Faster rendering while zooming
        }
    }

    function handleMouseDown(event) {
        if (event.button === 0) { // Left mouse button
            isDragging = true;
            dragStart.x = event.clientX;
            dragStart.y = event.clientY;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }

    // Updated to sync canvas dragging with viewport
    function handleMouseMove(event) {
        if (!isDragging) return;
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;
        viewport.x -= dx / viewport.scale;
        viewport.y += dy / viewport.scale;
        dragStart.x = event.clientX;
        dragStart.y = event.clientY;
        plotGraph(parseExpression(localStorage.getItem('graphExpression')));
    }

    function handleMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    function updateZoomBar() {
        zoomBar.textContent = `Zoom: ${viewport.scale.toFixed(2)}x`;
    }

    function startRenderingInterval(zooming = false) {
        stopRenderingInterval();
        renderingInterval = setInterval(() => {
            const expression = localStorage.getItem('graphExpression');
            if (expression) {
                const data = parseExpression(expression);
                plotGraph(data);
            }
        }, zooming ? 500 : 1000); // Adjusted faster rendering when zooming
    }

    function stopRenderingInterval() {
        if (renderingInterval) {
            clearInterval(renderingInterval);
            renderingInterval = null;
        }
    }

    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);

    const button = document.createElement('button');
    button.textContent = 'Graph';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.addEventListener('click', toggleGraph);
    document.body.appendChild(button);

    GM_registerMenuCommand('Add Equation', addGraphData);
    GM_registerMenuCommand('Clear Graph', clearGraphData);

    updateZoomBar();
    loadGraphData(); // Load saved graph data on script load
})();
