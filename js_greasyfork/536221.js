// ==UserScript==
// @name         4chan Thread Post Time Graph with Quote Arcs + REAL ID Colors
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Graphs the time of posting for all posts in a 4chan thread, shows the post content as a tooltip, draws arcs for quoted posts, and uses actual ID colors from inline styles.
// @author       Your Name
// @match        *://boards.4chan.org/pol/thread/*
// @match        *://boards.4chan.org/bant/thread/*
// @match        *://boards.4chan.org/sp/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536221/4chan%20Thread%20Post%20Time%20Graph%20with%20Quote%20Arcs%20%2B%20REAL%20ID%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/536221/4chan%20Thread%20Post%20Time%20Graph%20with%20Quote%20Arcs%20%2B%20REAL%20ID%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create chart container
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '300px';
    container.style.overflow = 'hidden';

    const canvas = document.createElement('canvas');
    canvas.id = 'postTimeGraph';
    canvas.style.display = 'block';
    canvas.style.maxHeight = '100%';
    container.appendChild(canvas);

    // Insert into DOM
    const adlDiv = document.querySelector('.adl');
    if (adlDiv) {
        adlDiv.parentNode.insertBefore(container, adlDiv.nextSibling);
    } else {
        console.error('Target div not found.');
        return;
    }

    // Color extraction functions
    function waitForUIDColors(timeout = 3000) {
        return new Promise((resolve, reject) => {
            const checkColors = () => {
                const spans = Array.from(document.querySelectorAll(
                    'div[id^="p"]:not([id$="pinned"]) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1)'
                ));
                return spans.length > 0 && spans.every(span => {
                    const style = span.getAttribute('style');
                    return style && style.match(/background-color:\s*(#[0-9a-fA-F]+|rgb\(.*?\))/);
                });
            };

            if (checkColors()) return resolve();

            const observer = new MutationObserver(() => {
                if (checkColors()) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('UID colors not loaded in time'));
            }, timeout);
        });
    }

    async function main() {
        // Wait for color elements to load
        try {
            await waitForUIDColors();
        } catch (e) {
            console.error('UID color extraction failed:', e);
            return;
        }

        // Extract actual UID colors
        const uidColorMap = new Map();
        document.querySelectorAll('div[id^="p"]:not([id$="pinned"])').forEach(post => {
            const colorSpan = post.querySelector('span:nth-child(2) > span:nth-child(2) > span:nth-child(1)');
            const uidElement = post.querySelector('.posteruid');

            if (colorSpan && uidElement) {
                const style = colorSpan.getAttribute('style');
                const colorMatch = style.match(/background-color:\s*(#[0-9a-fA-F]+|rgb\(.*?\))/);
                const uid = uidElement.textContent.trim();

                if (colorMatch) {
                    uidColorMap.set(uid, colorMatch[1]);
                }
            }
        });

        // Prepare chart data
        const ctx = canvas.getContext('2d');
        const timeLabels = [], postNumbers = [], postContents = [], quotes = [], postUIDs = [];
        const posts = document.querySelectorAll('.post');

        posts.forEach((post, index) => {
            const timeElement = post.querySelector('.dateTime');
            const uidElement = post.querySelector('.posteruid');

            if (timeElement) {
                // Time data
                const postTime = new Date(parseInt(timeElement.getAttribute('data-utc'), 10) * 1000);
                timeLabels.push(postTime);
                postNumbers.push(index + 1);
                postContents.push(post.outerHTML);

                // UID data
                const uid = uidElement ? uidElement.textContent.trim() : 'no-uid';
                postUIDs.push(uid);

                // Quote relationships
                post.querySelectorAll('.quotelink').forEach(link => {
                    const quotedPostId = link.getAttribute('href').split('#p')[1];
                    const quotedPost = document.getElementById(`p${quotedPostId}`);
                    if (quotedPost) {
                        quotes.push({
                            from: index,
                            to: Array.from(posts).indexOf(quotedPost)
                        });
                    }
                });
            }
        });

        // Drawing functions
        function drawCurvedLine(ctx, startPoint, endPoint, highlight) {
            const cp1x = startPoint.x + (endPoint.x - startPoint.x) / 2;
            const cp1y = startPoint.y;
            const cp2x = cp1x;
            const cp2y = endPoint.y;

            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endPoint.x, endPoint.y);
            ctx.strokeStyle = highlight ? '#880000' : '#5f89ac02';
            ctx.lineWidth = highlight ? 1.5 : 1;
            ctx.stroke();
        }

        function drawAllArcs(chart, hoveredIndex = -1) {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;

            quotes.forEach(quote => {
                const fromPoint = {
                    x: xAxis.getPixelForValue(timeLabels[quote.from]),
                    y: yAxis.getPixelForValue(postNumbers[quote.from])
                };
                const toPoint = {
                    x: xAxis.getPixelForValue(timeLabels[quote.to]),
                    y: yAxis.getPixelForValue(postNumbers[quote.to])
                };

                ctx.save();
                drawCurvedLine(ctx, fromPoint, toPoint,
                    hoveredIndex === quote.from || hoveredIndex === quote.to);
                ctx.restore();
            });
        }

        // Chart configuration
        const chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Post Number',
                    data: timeLabels.map((time, index) => ({
                        x: time,
                        y: postNumbers[index],
                        content: postContents[index],
                        backgroundColor: uidColorMap.get(postUIDs[index]) || '#666'
                    })),
                    pointStyle: 'rectRounded',
                    pointRadius: 2,
                    pointBackgroundColor: ctx => ctx.raw.backgroundColor,
                    pointBorderColor: ctx => ctx.raw.backgroundColor,
                    showLine: true,
                    borderColor: 'transparent'
                }]
            },
            options: {
                devicePixelRatio: 2,
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: false,
                        external: context => {
                            const tooltipEl = document.getElementById('chartjs-tooltip') ||
                                (() => {
                                    const el = document.createElement('div');
                                    el.id = 'chartjs-tooltip';
                                    Object.assign(el.style, {
                                        position: 'absolute',
                                        background: '#282a2e',
                                        border: '1px solid rgba(107, 107, 107, 0.65)',
                                        borderRadius: '4px',
                                        pointerEvents: 'none',
                                        zIndex: '1000'
                                    });
                                    document.body.appendChild(el);
                                    return el;
                                })();

                            if (context.tooltip.opacity === 0) {
                                tooltipEl.style.opacity = '0';
                                return;
                            }

                            tooltipEl.innerHTML = context.tooltip.dataPoints[0].raw.content;
                            const position = context.chart.canvas.getBoundingClientRect();
                            tooltipEl.style.opacity = '1';
                            tooltipEl.style.left = `${Math.min(
                                position.left + window.pageXOffset + context.tooltip.caretX,
                                document.body.clientWidth - tooltipEl.offsetWidth
                            )}px`;
                            tooltipEl.style.top = `${
                                position.top + window.pageYOffset + context.tooltip.caretY
                            }px`;
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute',
                            tooltipFormat: 'h:mm:ss a',
                            displayFormats: { minute: 'h:mm a', hour: 'MMM d, h a' }
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                            font: { family: 'arial,helvetica,sans-serif', size: 10 }
                        },
                        grid: { color: '#33373d25', lineWidth: 1 }
                    },
                    y: {
                        ticks: {
                            stepSize: 1,
                            font: { family: 'arial,helvetica,sans-serif', size: 10 }
                        },
                        grid: { color: '#33373d25', lineWidth: 1 },
                        beginAtZero: true
                    }
                },
                layout: { padding: { left: 6, right: 11, top: 14, bottom: 4 } }
            },
plugins: [{
    afterDraw: chart => {
        drawAllArcs(chart);

        const ctx = chart.ctx;
        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;

        const uidCounts = postUIDs.reduce((acc, uid) => {
            acc[uid] = (acc[uid] || 0) + 1;
            return acc;
        }, {});

        chart.data.datasets[0].data.forEach((point, i) => {
            const uid = postUIDs[i];
            const count = uidCounts[uid];
            if (!uid || count < 2) return;

            const x = xAxis.getPixelForValue(point.x);
            const centerY = yAxis.getPixelForValue(point.y);
            ctx.fillStyle = uidColorMap.get(uid) || '#666';

            const baseOffset = 5;
            const totalDots = count - 1;

            for (let j = 0; j < totalDots; j++) {
                const direction = j % 2 === 0 ? -1 : 1;
                const step = Math.ceil((j + 1) / 2);
                const offset = direction * (baseOffset + (step - 1) * 3);
                ctx.beginPath();
                ctx.arc(x, centerY + offset, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
}]
        });

// Chart interaction handlers
const debounce = (fn, wait) => (...args) =>
    clearTimeout(fn.timeout) || (fn.timeout = setTimeout(() => fn(...args), wait));

const debouncedRedraw = debounce((hoveredIndex = -1) => {
    chart.clear();
    chart.draw();
    drawAllArcs(chart, hoveredIndex);
}, 200);

canvas.addEventListener('mousemove', event => {
    const active = chart.getElementsAtEventForMode(
        event, 'nearest', { intersect: false }, true
    );
    debouncedRedraw(active[0]?.index);
});

canvas.addEventListener('mouseleave', () => debouncedRedraw(-1));

canvas.addEventListener('click', event => {
    const active = chart.getElementsAtEventForMode(
        event, 'nearest', { intersect: false }, true
    );
    if (active.length > 0) {
        const index = active[0].index;
        const post = posts[index];
        if (post && post.id) {
            // Update the URL so back button works
            history.pushState(null, '', `#${post.id}`);
            // Scroll to the post smoothly
            post.scrollIntoView({ block: 'center' });
            // Highlight briefly
            post.style.boxShadow = '0 0 0 3px rgba(255, 0, 0, 0.4)';
            setTimeout(() => post.style.boxShadow = '', 1500);
        }
    }
});
}

// Start the main process
main().catch(console.error);
})();
