// ==UserScript==
// @name         Graphing Plugin
// @namespace    https://greasyfork.org/en/users/1291009
// @author       BadOrBest
// @license      MIT
// @version      1.4
// @description  A library for adding and managing graphs on any webpage.
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.0.3/math.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.min.js
// ==/UserScript==

(function(global) {
    'use strict';

    console.log('Graphing Library loaded');

    global.GraphingLibrary = {
        chartInstance: null,

        createCanvas: function() {
            let canvas = document.getElementById('graphCanvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = 'graphCanvas';
                canvas.style.position = 'fixed';
                canvas.style.bottom = '0';
                canvas.style.right = '0';
                canvas.style.zIndex = '9999';
                canvas.style.width = '600px'; // Set canvas width
                canvas.style.height = '400px'; // Set canvas height
                document.body.appendChild(canvas);
                console.log('Canvas created');
            }
            return canvas;
        },

        updateGraph: function() {
            console.log('Updating graph');
            const graphData = JSON.parse(localStorage.getItem('graphData') || '[]');
            const canvas = this.createCanvas();
            const ctx = canvas.getContext('2d');

            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: graphData.map(data => ({
                        label: data.label,
                        data: data.points,
                        borderColor: data.color || 'blue',
                        borderWidth: 1,
                        fill: false
                    }))
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom'
                        }
                    }
                }
            });
        },

        toggleGraph: function() {
            const canvas = this.createCanvas();
            canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
            if (canvas.style.display === 'block') {
                this.updateGraph();
            }
            console.log('Toggled graph display');
        },

        clearGraph: function() {
            localStorage.setItem('graphData', JSON.stringify([]));
            const canvas = document.getElementById('graphCanvas');
            if (canvas) {
                canvas.style.display = 'none';
            }
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }
            console.log('Cleared graph data');
        },

        addGraphData: function(expression) {
            if (expression) {
                try {
                    const xValues = Array.from({ length: 100 }, (_, i) => i - 50); // X values from -50 to 50
                    const yValues = xValues.map(x => math.evaluate(expression.replace(/x/g, x))); // Evaluate expression

                    const newGraphData = JSON.parse(localStorage.getItem('graphData') || '[]');
                    newGraphData.push({
                        label: `Graph ${newGraphData.length + 1}`,
                        points: xValues.map((x, i) => ({ x, y: yValues[i] }))
                    });

                    localStorage.setItem('graphData', JSON.stringify(newGraphData));
                    this.updateGraph();
                    console.log('Added graph data');
                } catch (error) {
                    alert('Error evaluating expression: ' + error.message);
                    console.error('Error evaluating expression:', error);
                }
            }
        }
    };

    // Initialize or update the graph display if needed
    if (JSON.parse(localStorage.getItem('graphData') || '[]').length > 0) {
        GraphingLibrary.toggleGraph();
    }

})(window);
