// ==UserScript==
// @name         4chan Thread Post Time Graph
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Graphs the time of posting for all posts in a 4chan thread and shows the post content as a tooltip.
// @author       Your Name
// @match        *://boards.4chan.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503291/4chan%20Thread%20Post%20Time%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/503291/4chan%20Thread%20Post%20Time%20Graph.meta.js
// ==/UserScript==

//// @require      https://cdn.jsdelivr.net/npm/chart.js
//// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns

(function() {
    'use strict';

    // Create a container for the chart to prevent layout issues
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '300px';
    container.style.overflow = 'hidden'; // Prevent overflow issues

    // Create a canvas element for the graph
    const canvas = document.createElement('canvas');
    canvas.id = 'postTimeGraph';
    canvas.style.display = 'block';
    canvas.style.maxHeight = '100%'; // Constrain the height to the container

    // Append canvas to the container
    container.appendChild(canvas);

    // Insert the container under the specified div
    const adlDiv = document.querySelector('.adl');
    if (adlDiv) {
        adlDiv.parentNode.insertBefore(container, adlDiv.nextSibling);
    } else {
        console.error('Target div not found.');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Initialize arrays for time and post numbers
    const timeLabels = [];
    const postNumbers = [];
    const postContents = []; // To store the post HTML

    // Collect all post times and content
    const posts = document.querySelectorAll('.post');
    posts.forEach(function(post, index) {
        const timeElement = post.querySelector('.dateTime');
        if (timeElement) {
            const postTime = new Date(parseInt(timeElement.getAttribute('data-utc'), 10) * 1000);
            timeLabels.push(postTime);
            postNumbers.push(index + 1); // Post number
            postContents.push(post.outerHTML); // Store the full HTML of the post
        }
    });

    // Create the graph with custom styling and tooltips
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Post Number',
                    data: timeLabels.map(function(time, index) {
                        return { x: time, y: postNumbers[index], content: postContents[index] }; // Add content to data point
                    }),
                    borderColor: '#676e7a75',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    pointStyle: 'rectRounded',
                    borderWidth: 1,
                    pointRadius: 1,
                    pointBackgroundColor: 'white',
                    pointBorderColor: 'white',
                    pointHoverBackgroundColor: 'white',
                    pointHoverBorderColor: 'white',
                    showLine: true
                }
            ]
        },
        options: {
            devicePixelRatio: 2,
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'nearest',
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false, // Disable default tooltip
                    external: function(context) {
                        // Tooltip Element
                        let tooltipEl = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.background = '#282a2e';
                            tooltipEl.style.border = '1px solid rgba(107, 107, 107, 0.65)';
                            tooltipEl.style.borderRadius = '4px';
                            tooltipEl.style.pointerEvents = 'none';
                            tooltipEl.style.zIndex = '1000';
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        const tooltipModel = context.tooltip;
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = '0';
                            return;
                        }

                        // Set Text
                        if (tooltipModel.body) {
                            const bodyLines = tooltipModel.body.map(item => item.lines);

                            const postContent = context.tooltip.dataPoints[0].raw.content; // Get post content from data

                            tooltipEl.innerHTML = postContent;
                        }

                        // Display, position, and set styles for font
                        const position = context.chart.canvas.getBoundingClientRect();

                        tooltipEl.style.opacity = '1';
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    }
                }
            },
            scales: {
                x: {
                    border: {
                        display: false,
                    },
                    type: 'time',
                    time: {
                        unit: 'minute',
                        tooltipFormat: 'h:mm:ss a',
                        displayFormats: {
                            minute: 'h:mm a',
                            hour: 'MMM D, h a'
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        minRotation: 0,
                        maxRotation: 0,
                        font: {
                          family: "arial,helvetica,sans-serif",
                          weight: 'bold',
                          size: 10
                        }
                    },
                    grid: {
                        color: '#33373d30',
                        lineWidth: 1,
                        display: true
                    }
                },
                y: {
                    border: {
                        display: false,
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                          family: "arial,helvetica,sans-serif",
                          weight: 'bold',
                          size: 10
                        },
                        callback: function(value) {
                               return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: '#33373d30',
                        lineWidth: 1,
                        display: true
                    },
                    beginAtZero: true,
                    suggestedMin: Math.min(...postNumbers) - 1,
                    suggestedMax: Math.max(...postNumbers) + 1
                }
            },
            layout: {
                padding: {
                    left: 6,
                    right: 11,
                    top: 14,
                    bottom: 4
                }
            }
        }
    });
})();
