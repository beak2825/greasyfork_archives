// ==UserScript==
// @name         FetLife Follower Growth Tracker
// @namespace    http://violentmonkey.com/
// @version      1.0
// @description  Track your follower growth over time on FetLife with modern Chart.js visualization
// @match        https://fetlife.com/*
// @exclude      https://fetlife.com/home*
// @exclude      https://fetlife.com/feed*
// @exclude      https://fetlife.com/explore*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543326/FetLife%20Follower%20Growth%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/543326/FetLife%20Follower%20Growth%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 FetLife Follower Tracker v2.0 with Chart.js starting...');

    // Storage key for follower data
    const STORAGE_KEY = 'fetlifeFollowerData';

    // Get current follower count from the page
    function getCurrentFollowerCount() {
        // Method 1: Try to find follower count in the page data
        try {
            // Look for the followers link in the DOM
            const followerLink = document.querySelector('a[href*="/followers"]');
            if (followerLink) {
                const text = followerLink.textContent.trim();
                // Look for numbers in the link text, handle comma-separated numbers
                const match = text.match(/([\d,]+)/);
                if (match) {
                    return parseInt(match[1].replace(/,/g, ''), 10);
                }
            }
        } catch (e) {
            console.log('Method 1 failed:', e);
        }

        // Method 2: Look for any element containing "followers" text with numbers
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
            const text = el.textContent.toLowerCase();
            if (text.includes('followers') && !text.includes('following')) {
                const match = el.textContent.match(/([\d,]+)/);
                if (match) {
                    return parseInt(match[1].replace(/,/g, ''), 10);
                }
            }
        }

        // Method 3: Look in all links that might contain follower info
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
            if (link.href.includes('/followers')) {
                const text = link.textContent.trim();
                const match = text.match(/([\d,]+)/);
                if (match) {
                    return parseInt(match[1].replace(/,/g, ''), 10);
                }
            }
        }

        return null;
    }

    // Get stored follower data
    function getStoredData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Save follower data point with automatic tracking
    function saveDataPoint(count) {
        const data = getStoredData();
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        const timeKey = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0'); // HH:MM format

        // Check if we already have data for this exact hour today
        const existingIndex = data.findIndex(point =>
            point.date === today &&
            point.time === timeKey
        );

        if (existingIndex >= 0) {
            // Update this hour's count if different
            if (data[existingIndex].count !== count) {
                data[existingIndex].count = count;
                data[existingIndex].timestamp = now.toISOString();
                console.log(`📊 Updated follower count for ${today} ${timeKey}: ${count}`);
            }
        } else {
            // Add new data point
            const newPoint = {
                date: today,
                time: timeKey,
                count: count,
                timestamp: now.toISOString()
            };
            data.push(newPoint);
            console.log(`📈 New follower count recorded for ${today} ${timeKey}: ${count}`);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    }

    // Check if we're on our own profile (for auto-tracking)
    function isOnOwnProfile() {
        // Check if this is our own profile by looking at the current user data
        try {
            if (window.FL && window.FL.user && window.FL.user.nickname) {
                const currentUser = window.FL.user.nickname;
                const pathname = window.location.pathname;
                // Check if pathname matches our username
                return pathname === `/${currentUser}` || pathname.startsWith(`/${currentUser}/`);
            }
        } catch (e) {
            console.log('Could not determine if on own profile:', e);
        }
        return false;
    }

    // Auto-track follower count when on own profile
    function autoTrackFollowers() {
        if (!isOnOwnProfile()) {
            console.log('Not on own profile, skipping auto-track');
            return;
        }

        // Wait a bit for page to load completely
        setTimeout(() => {
            const count = getCurrentFollowerCount();
            if (count !== null) {
                const data = saveDataPoint(count);
                const latestEntry = data[data.length - 1];
                console.log(`🎯 Auto-tracked followers: ${count} at ${latestEntry.time}`);

                // Update button text to show latest count
                updateChartButtonText(count);
            } else {
                console.log('Could not auto-track: follower count not found');
            }
        }, 2000);
    }

    // Calculate check frequency and growth per check statistics
    function calculateCheckFrequencyStats(data) {
        if (data.length < 2) {
            return {
                averageTimeBetweenChecks: 0,
                totalChecks: data.length,
                growthPerCheck: 0,
                checkingDays: 0,
                averageChecksPerDay: 0
            };
        }

        // Calculate time differences between checks
        const timeDiffs = [];
        for (let i = 1; i < data.length; i++) {
            const prevTime = new Date(data[i - 1].timestamp);
            const currentTime = new Date(data[i].timestamp);
            const diffHours = (currentTime - prevTime) / (1000 * 60 * 60);
            timeDiffs.push(diffHours);
        }

        const averageTimeBetweenChecks = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;

        // Calculate growth per check
        const totalGrowth = data[data.length - 1].count - data[0].count;
        const growthPerCheck = totalGrowth / (data.length - 1);

        // Calculate tracking period and frequency
        const firstDate = new Date(data[0].timestamp);
        const lastDate = new Date(data[data.length - 1].timestamp);
        const totalDays = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
        const averageChecksPerDay = data.length / totalDays;

        return {
            averageTimeBetweenChecks,
            totalChecks: data.length,
            growthPerCheck,
            checkingDays: totalDays,
            averageChecksPerDay
        };
    }
    function calculateDailyGrowth(data) {
        if (data.length < 2) {
            return {
                dailyAverage: 0,
                totalDays: 0,
                bestDay: { growth: 0, date: 'N/A' },
                hasEnoughData: false
            };
        }

        // Group data by date to calculate daily changes
        const dailyGrowth = {};
        const dailyCounts = {};

        // Group data points by date and get the last (highest) count for each day
        data.forEach(point => {
            const date = point.date;
            if (!dailyCounts[date]) {
                dailyCounts[date] = [];
            }
            dailyCounts[date].push(point);
        });

        // Calculate growth for each day (comparing end of day to end of previous day)
        const dates = Object.keys(dailyCounts).sort();
        let bestDayGrowth = 0;
        let bestDayDate = 'N/A';
        const validDailyGrowths = [];

        for (let i = 1; i < dates.length; i++) {
            const prevDate = dates[i - 1];
            const currentDate = dates[i];

            // Get the last (latest) count of each day
            const prevDayLastCount = Math.max(...dailyCounts[prevDate].map(p => p.count));
            const currentDayLastCount = Math.max(...dailyCounts[currentDate].map(p => p.count));

            const dayGrowth = currentDayLastCount - prevDayLastCount;
            dailyGrowth[currentDate] = dayGrowth;
            validDailyGrowths.push(dayGrowth);

            if (dayGrowth > bestDayGrowth) {
                bestDayGrowth = dayGrowth;
                bestDayDate = new Date(currentDate).toLocaleDateString();
            }
        }

        // Calculate average daily growth from actual day-to-day changes
        let dailyAverage = 0;
        if (validDailyGrowths.length > 0) {
            const totalDailyGrowth = validDailyGrowths.reduce((sum, growth) => sum + growth, 0);
            dailyAverage = totalDailyGrowth / validDailyGrowths.length;
        } else if (dates.length >= 2) {
            // Fallback: if we have data spanning multiple days but not enough daily comparisons
            const firstDate = new Date(data[0].timestamp);
            const lastDate = new Date(data[data.length - 1].timestamp);
            const actualDays = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));

            // Only calculate if we have at least 2 full days of data
            if (actualDays >= 2) {
                const totalGrowth = data[data.length - 1].count - data[0].count;
                dailyAverage = totalGrowth / actualDays;
            }
        }

        return {
            dailyAverage,
            totalDays: Math.max(dates.length - 1, 1),
            bestDay: {
                growth: bestDayGrowth,
                date: bestDayDate
            },
            hasEnoughData: validDailyGrowths.length > 0 || dates.length >= 2
        };
    }

    // Get milestone emoji based on follower count
    function getMilestoneEmoji(milestone) {
        if (milestone >= 100000) return "👑";
        if (milestone >= 50000) return "🌟";
        if (milestone >= 25000) return "🚀";
        if (milestone >= 10000) return "💎";
        if (milestone >= 7500) return "🔥";
        if (milestone >= 5000) return "⭐";
        if (milestone >= 3000) return "🎯";
        if (milestone >= 2000) return "🏆";
        if (milestone >= 1500) return "🎉";
        if (milestone >= 1000) return "🥳";
        if (milestone >= 500) return "🎊";
        return "🌸";
    }

    // Create D3.js chart with zoom functionality
    function createD3Chart(container, data) {
        // Clear container
        d3.select(container).selectAll("*").remove();

        // Set dimensions and margins
        const margin = { top: 20, right: 30, bottom: 60, left: 80 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = container.clientHeight - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create clip path for zooming
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Create scales
        let xScale, yScale, originalXScale, originalYScale;

        if (data.length === 0) {
            // Empty state - show default axes
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            xScale = d3.scaleTime()
                .domain([oneHourAgo, now])
                .range([0, width]);

            yScale = d3.scaleLinear()
                .domain([0, 1000])
                .range([height, 0]);

            originalXScale = xScale.copy();
            originalYScale = yScale.copy();
        } else {
            // With data
            const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
            const processedData = data.map(d => ({
                date: new Date(d.timestamp),
                count: d.count
            }));

            const counts = processedData.map(d => d.count);
            const minCount = d3.min(counts);
            const maxCount = d3.max(counts);
            const range = maxCount - minCount;
            const padding = Math.max(range * 0.1, 10);

            xScale = d3.scaleTime()
                .domain(d3.extent(processedData, d => d.date))
                .range([0, width]);

            yScale = d3.scaleLinear()
                .domain([Math.max(0, minCount - padding), maxCount + padding])
                .range([height, 0]);

            // Store original scales for reset
            originalXScale = xScale.copy();
            originalYScale = yScale.copy();
        }

        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 50])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        // Apply zoom to SVG
        svg.call(zoom);

        // Create containers for zoomable content
        const gridContainer = g.append("g").attr("class", "grid-container");
        const dataContainer = g.append("g").attr("class", "data-container").attr("clip-path", "url(#clip)");
        const axisContainer = g.append("g").attr("class", "axis-container");

        function updateChart() {
            // Clear previous content
            gridContainer.selectAll("*").remove();
            dataContainer.selectAll("*").remove();
            axisContainer.selectAll("*").remove();

            // Create grid lines
            // X-axis grid
            gridContainer.selectAll(".grid-x")
                .data(xScale.ticks())
                .enter()
                .append("line")
                .attr("class", "grid-x")
                .attr("x1", d => xScale(d))
                .attr("x2", d => xScale(d))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "rgba(255, 255, 255, 0.1)")
                .attr("stroke-width", 1);

            // Y-axis grid
            gridContainer.selectAll(".grid-y")
                .data(yScale.ticks())
                .enter()
                .append("line")
                .attr("class", "grid-y")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => yScale(d))
                .attr("y2", d => yScale(d))
                .attr("stroke", "rgba(255, 255, 255, 0.1)")
                .attr("stroke-width", 1);

            // Create axes
            const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%m/%d %H:%M"));

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => d.toLocaleString());

            // Add X axis
            axisContainer.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .style("fill", "#999")
                .style("font-family", "monospace")
                .style("font-size", "11px");

            // Add Y axis
            axisContainer.append("g")
                .attr("class", "y-axis")
                .call(yAxis)
                .selectAll("text")
                .style("fill", "#999")
                .style("font-family", "monospace")
                .style("font-size", "11px");

            // Style axis lines
            axisContainer.selectAll(".domain")
                .style("stroke", "#404040");

            axisContainer.selectAll(".tick line")
                .style("stroke", "#404040");

            if (data.length === 0) {
                // Add empty state message
                dataContainer.append("text")
                    .attr("x", width / 2)
                    .attr("y", height / 2 - 10)
                    .attr("text-anchor", "middle")
                    .style("fill", "#666")
                    .style("font-size", "16px")
                    .text("📊");

                dataContainer.append("text")
                    .attr("x", width / 2)
                    .attr("y", height / 2 + 10)
                    .attr("text-anchor", "middle")
                    .style("fill", "#666")
                    .style("font-size", "14px")
                    .text("Start tracking to see your growth!");
            } else {
                // Process data for line
                const processedData = data.map(d => ({
                    date: new Date(d.timestamp),
                    count: d.count
                }));

                // Create line generator
                const line = d3.line()
                    .x(d => xScale(d.date))
                    .y(d => yScale(d.count))
                    .curve(d3.curveCardinal);

                // Add area under the line
                const area = d3.area()
                    .x(d => xScale(d.date))
                    .y0(height)
                    .y1(d => yScale(d.count))
                    .curve(d3.curveCardinal);

                // Add the area
                dataContainer.append("path")
                    .datum(processedData)
                    .attr("fill", "rgba(229, 62, 62, 0.1)")
                    .attr("d", area);

                // Add the line
                dataContainer.append("path")
                    .datum(processedData)
                    .attr("fill", "none")
                    .attr("stroke", "#e53e3e")
                    .attr("stroke-width", 3)
                    .attr("d", line);

                // Add milestone markers
                const milestones = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 25000, 50000, 100000];
                const achievedMilestones = [];

                // Debug: log the data we're working with
                console.log('Processing milestones for data:', processedData.map(d => d.count));

                // Find achieved milestones with correct logic
                milestones.forEach(milestone => {
                    // Find the first data point that crosses this milestone
                    let milestonePoint = null;
                    let wasCrossed = false;

                    // Look for the crossing point
                    for (let i = 0; i < processedData.length; i++) {
                        const currentCount = processedData[i].count;
                        const prevCount = i > 0 ? processedData[i - 1].count : 0;

                        // Check if this point crosses the milestone
                        if (currentCount >= milestone && prevCount < milestone) {
                            milestonePoint = processedData[i];
                            wasCrossed = true;
                            console.log(`Milestone ${milestone} crossed at point:`, milestonePoint.count);
                            break;
                        }
                    }

                    if (wasCrossed && milestonePoint) {
                        // Double-check: make sure this milestone hasn't been added already
                        const alreadyExists = achievedMilestones.some(existing => existing.milestone === milestone);
                        if (!alreadyExists) {
                            achievedMilestones.push({
                                milestone: milestone,
                                point: milestonePoint,
                                emoji: getMilestoneEmoji(milestone)
                            });
                            console.log(`Added milestone: ${milestone} at count ${milestonePoint.count}`);
                        }
                    }
                });

                console.log('Final achieved milestones:', achievedMilestones.map(m => m.milestone));

                // Check if milestones should be shown
                const showMilestones = container.parentElement.querySelector('.milestone-toggle')?.checked !== false;

                // Add milestone markers (only if enabled)
                if (showMilestones) {
                    console.log('Drawing milestones:', achievedMilestones);

                    achievedMilestones.forEach((ms, index) => {
                        const x = xScale(ms.point.date);
                        const y = yScale(ms.point.count);

                        console.log(`Drawing milestone ${ms.milestone} at position (${x}, ${y})`);

                        // Add subtle milestone line (vertical dashed line)
                        dataContainer.append("line")
                            .attr("class", "milestone-line")
                            .attr("data-milestone", ms.milestone)
                            .attr("x1", x)
                            .attr("x2", x)
                            .attr("y1", 0)
                            .attr("y2", height)
                            .attr("stroke", "#ff6b6b")
                            .attr("stroke-width", 1)
                            .attr("stroke-dasharray", "3,3")
                            .attr("opacity", 0.4);

                        // Add milestone marker (subtle special dot)
                        dataContainer.append("circle")
                            .attr("class", "milestone-marker")
                            .attr("data-milestone", ms.milestone)
                            .attr("data-index", index)
                            .attr("cx", x)
                            .attr("cy", y)
                            .attr("r", 8)
                            .attr("fill", "#e53e3e")
                            .attr("stroke", "#ff6b6b")
                            .attr("stroke-width", 2)
                            .style("cursor", "pointer")
                            .style("filter", "drop-shadow(0px 0px 3px rgba(229, 62, 62, 0.6))");

                        // Add milestone emoji (smaller and more subtle)
                        dataContainer.append("text")
                            .attr("class", "milestone-emoji")
                            .attr("data-milestone", ms.milestone)
                            .attr("x", x)
                            .attr("y", y + 3)
                            .attr("text-anchor", "middle")
                            .attr("font-size", "10px")
                            .text(ms.emoji)
                            .style("pointer-events", "none");
                    });

                    // Add milestone tooltips
                    dataContainer.selectAll(".milestone-marker")
                        .on("mouseover", function(event, d) {
                            // Get milestone data from the element's data attribute
                            const milestoneValue = parseInt(this.getAttribute('data-milestone'));
                            const milestoneIndex = parseInt(this.getAttribute('data-index'));
                            const milestone = achievedMilestones[milestoneIndex];

                            console.log('Hovering milestone:', milestoneValue, milestone);

                            if (milestone && milestone.milestone === milestoneValue) {
                                const containerRect = container.getBoundingClientRect();
                                const mouseX = event.clientX - containerRect.left;
                                const mouseY = event.clientY - containerRect.top;

                                // Remove existing milestone tooltip
                                d3.select(container).selectAll(".milestone-tooltip").remove();

                                const milestoneTooltip = d3.select(container)
                                    .append("div")
                                    .attr("class", "milestone-tooltip")
                                    .style("position", "absolute")
                                    .style("padding", "8px 12px")
                                    .style("background", "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)")
                                    .style("color", "#ff6b6b")
                                    .style("border", "1px solid #e53e3e")
                                    .style("border-radius", "8px")
                                    .style("font-size", "12px")
                                    .style("font-weight", "600")
                                    .style("font-family", "monospace")
                                    .style("pointer-events", "none")
                                    .style("opacity", 0)
                                    .style("z-index", "1001")
                                    .style("box-shadow", "0 4px 12px rgba(229, 62, 62, 0.3)")
                                    .html(`🎯 <strong>Milestone Reached!</strong><br/>${milestone.emoji} ${milestone.milestone.toLocaleString()} followers<br/><small style="color: #999;">${milestone.point.date.toLocaleDateString()} ${milestone.point.date.toLocaleTimeString()}</small>`);

                                milestoneTooltip.transition()
                                    .duration(200)
                                    .style("opacity", 1);

                                milestoneTooltip
                                    .style("left", (mouseX + 15) + "px")
                                    .style("top", (mouseY - 15) + "px");
                            }
                        })
                        .on("mouseout", function() {
                            d3.select(container).selectAll(".milestone-tooltip")
                                .transition()
                                .duration(300)
                                .style("opacity", 0)
                                .remove();
                        });
                }

                // Add dots
                dataContainer.selectAll(".dot")
                    .data(processedData)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("cx", d => xScale(d.date))
                    .attr("cy", d => yScale(d.count))
                    .attr("r", 6)
                    .attr("fill", "#ff6b6b")
                    .attr("stroke", "#e53e3e")
                    .attr("stroke-width", 2)
                    .style("cursor", "pointer");

                // Remove existing tooltip to avoid duplicates
                d3.select(container).selectAll(".tooltip").remove();

                // Add tooltips
                const tooltip = d3.select(container)
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("padding", "8px 12px")
                    .style("background", "rgba(26, 26, 26, 0.95)")
                    .style("color", "#ff6b6b")
                    .style("border", "1px solid #404040")
                    .style("border-radius", "8px")
                    .style("font-size", "12px")
                    .style("font-family", "monospace")
                    .style("pointer-events", "none")
                    .style("opacity", 0)
                    .style("z-index", "1000");

                dataContainer.selectAll(".dot")
                    .on("mouseover", function(event, d) {
                        // Get the container's position for proper tooltip positioning
                        const containerRect = container.getBoundingClientRect();
                        const mouseX = event.clientX - containerRect.left;
                        const mouseY = event.clientY - containerRect.top;

                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.html(`${d.date.toLocaleDateString()} ${d.date.toLocaleTimeString()}<br/>${d.count.toLocaleString()} followers`)
                            .style("left", (mouseX + 10) + "px")
                            .style("top", (mouseY - 10) + "px");
                    })
                    .on("mouseout", function(d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .on("mousemove", function(event, d) {
                        // Update tooltip position as mouse moves
                        const containerRect = container.getBoundingClientRect();
                        const mouseX = event.clientX - containerRect.left;
                        const mouseY = event.clientY - containerRect.top;

                        tooltip
                            .style("left", (mouseX + 10) + "px")
                            .style("top", (mouseY - 10) + "px");
                    });
            }
        }

        function zoomed(event) {
            const transform = event.transform;

            // Update scales with zoom transform
            const newXScale = transform.rescaleX(originalXScale);
            const newYScale = transform.rescaleY(originalYScale);

            xScale = newXScale;
            yScale = newYScale;

            // Update chart
            updateChart();
        }

        // Add axis labels
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill", "#999")
            .style("font-size", "12px")
            .text("Followers");

        g.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .style("fill", "#999")
            .style("font-size", "12px")
            .text("Time");

        // Add zoom controls
        const zoomControls = d3.select(container)
            .append("div")
            .style("position", "absolute")
            .style("top", "10px")
            .style("right", "10px")
            .style("display", "flex")
            .style("gap", "4px");

        // Zoom in button
        zoomControls.append("button")
            .style("padding", "4px 8px")
            .style("background", "rgba(26, 26, 26, 0.9)")
            .style("color", "#e53e3e")
            .style("border", "1px solid #404040")
            .style("border-radius", "4px")
            .style("cursor", "pointer")
            .style("font-size", "12px")
            .text("🔍+")
            .on("click", function() {
                svg.transition().duration(300).call(zoom.scaleBy, 1.5);
            });

        // Zoom out button
        zoomControls.append("button")
            .style("padding", "4px 8px")
            .style("background", "rgba(26, 26, 26, 0.9)")
            .style("color", "#e53e3e")
            .style("border", "1px solid #404040")
            .style("border-radius", "4px")
            .style("cursor", "pointer")
            .style("font-size", "12px")
            .text("🔍-")
            .on("click", function() {
                svg.transition().duration(300).call(zoom.scaleBy, 0.67);
            });

        // Reset zoom button
        zoomControls.append("button")
            .style("padding", "4px 8px")
            .style("background", "rgba(26, 26, 26, 0.9)")
            .style("color", "#e53e3e")
            .style("border", "1px solid #404040")
            .style("border-radius", "4px")
            .style("cursor", "pointer")
            .style("font-size", "12px")
            .text("↺")
            .on("click", function() {
                svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
            });

        // Initial chart render
        updateChart();

        // Add zoom instructions
        if (data.length > 0) {
            const instructions = d3.select(container)
                .append("div")
                .style("position", "absolute")
                .style("bottom", "10px")
                .style("left", "10px")
                .style("background", "rgba(26, 26, 26, 0.8)")
                .style("color", "#999")
                .style("padding", "4px 8px")
                .style("border-radius", "4px")
                .style("font-size", "10px")
                .style("font-family", "monospace")
                .text("🖱️ Scroll to zoom • Drag to pan • Click buttons to control");
        }
    }
    function showChart(data) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 1000000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(10px);
        `;

        // Create modal content with dark theme
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            padding: 24px;
            border-radius: 16px;
            max-width: 1100px;
            width: 95%;
            max-height: 90vh;
            position: relative;
            border: 1px solid #404040;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
            color: #e53e3e;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow-y: auto;
        `;

        // Close button with FetLife styling
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 16px;
            right: 20px;
            background: rgba(229, 62, 62, 0.15);
            border: 1px solid rgba(229, 62, 62, 0.3);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 20px;
            cursor: pointer;
            color: #e53e3e;
            transition: all 0.2s ease;
            backdrop-filter: blur(5px);
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = 'rgba(229, 62, 62, 0.25)';
            closeBtn.style.color = '#ff6b6b';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'rgba(229, 62, 62, 0.15)';
            closeBtn.style.color = '#e53e3e';
        };
        closeBtn.onclick = () => document.body.removeChild(overlay);

        // Chart title
        const title = document.createElement('h2');
        title.textContent = '📈 Follower Growth Analytics';
        title.style.cssText = `
            margin: 0 0 16px 0;
            color: #e53e3e;
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            letter-spacing: 0.5px;
        `;

        // Time range controls
        const timeRangeContainer = document.createElement('div');
        timeRangeContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        `;

        const timeRanges = [
            { label: '4H', hours: 4, active: false },
            { label: '8H', hours: 8, active: false },
            { label: '12H', hours: 12, active: false },
            { label: '24H', hours: 24, active: false },
            { label: '2D', hours: 24 * 2, active: false },
            { label: '3D', hours: 24 * 3, active: false },
            { label: '5D', hours: 24 * 5, active: false },
            { label: '7D', hours: 24 * 7, active: false },
            { label: '14D', hours: 24 * 14, active: false },
            { label: '30D', hours: 24 * 30, active: false },
            { label: 'ALL', hours: null, active: true }
        ];

        let currentTimeRange = 'ALL';
        let currentData = data;

        timeRanges.forEach(range => {
            const btn = document.createElement('button');
            btn.textContent = range.label;
            btn.style.cssText = `
                padding: 8px 16px;
                border: 1px solid #404040;
                border-radius: 6px;
                background: ${range.active ? 'linear-gradient(135deg, #e53e3e 0%, #ff6b6b 100%)' : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'};
                color: ${range.active ? '#fff' : '#e53e3e'};
                cursor: pointer;
                font-weight: 600;
                font-size: 12px;
                font-family: inherit;
                transition: all 0.2s ease;
                min-width: 50px;
            `;

            btn.onmouseover = () => {
                if (currentTimeRange !== range.label) {
                    btn.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)';
                    btn.style.color = '#ff6b6b';
                }
            };

            btn.onmouseout = () => {
                if (currentTimeRange !== range.label) {
                    btn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                    btn.style.color = '#e53e3e';
                }
            };

            btn.onclick = () => {
                // Update active state
                currentTimeRange = range.label;

                // Filter data based on time range
                if (range.hours) {
                    const cutoffTime = new Date(Date.now() - range.hours * 60 * 60 * 1000);
                    currentData = data.filter(point => new Date(point.timestamp) >= cutoffTime);
                } else {
                    currentData = data; // Show all data
                }

                // Update all buttons
                timeRangeContainer.querySelectorAll('button').forEach(b => {
                    if (b === btn) {
                        b.style.background = 'linear-gradient(135deg, #e53e3e 0%, #ff6b6b 100%)';
                        b.style.color = '#fff';
                    } else {
                        b.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                        b.style.color = '#e53e3e';
                    }
                });

                // Recreate chart with filtered data
                const chartDiv = document.getElementById('followerChart');
                if (chartDiv && window.d3) {
                    createD3Chart(chartDiv, currentData);
                }

                // Update stats with filtered data
                updateStatsForTimeRange(currentData);
            };

            timeRangeContainer.appendChild(btn);
        });

        // Chart container
        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = `
            width: 100%;
            height: 500px;
            position: relative;
            border: 1px solid #404040;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
            margin-bottom: 20px;
            border-radius: 12px;
            padding: 20px;
            box-sizing: border-box;
        `;

        if (data.length === 0) {
            // Create D3.js chart with empty state
            const chartDiv = document.createElement('div');
            chartDiv.id = 'followerChart';
            chartDiv.style.cssText = 'width: 100%; height: 100%; position: relative;';
            chartContainer.appendChild(chartDiv);

            // Load D3.js and create empty chart
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
            script.onload = () => {
                createD3Chart(chartDiv, []);
            };
            document.head.appendChild(script);
        } else {
            // Create D3.js chart with data
            const chartDiv = document.createElement('div');
            chartDiv.id = 'followerChart';
            chartDiv.style.cssText = 'width: 100%; height: 100%; position: relative;';
            chartContainer.appendChild(chartDiv);

            // Load D3.js and create chart
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
            script.onload = () => {
                createD3Chart(chartDiv, data);
            };
            document.head.appendChild(script);
        }

        // Calculate daily growth statistics
        const dailyStats = calculateDailyGrowth(currentData);

        // Calculate check frequency statistics
        const checkStats = calculateCheckFrequencyStats(currentData);

        // Function to update stats for time range
        function updateStatsForTimeRange(filteredData) {
            const newDailyStats = calculateDailyGrowth(filteredData);
            const newCheckStats = calculateCheckFrequencyStats(filteredData);
            const newCurrentCount = filteredData.length > 0 ? filteredData[filteredData.length - 1].count : 0;

            // Calculate intelligent recent change for filtered data
            let newRecentChange = 0;
            let newChangeLabel = 'Recent Change';
            let newShowRecentChange = false;

            if (filteredData.length >= 2) {
                const now = new Date();
                const latest = filteredData[filteredData.length - 1];

                // For different time ranges, use different comparison logic
                let comparisonPoint = null;

                if (currentTimeRange === '4H') {
                    // For 4H view, compare to 2h ago
                    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= twoHoursAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 2h';
                            break;
                        }
                    }
                } else if (currentTimeRange === '8H') {
                    // For 8H view, compare to 4h ago
                    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= fourHoursAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 4h';
                            break;
                        }
                    }
                } else if (currentTimeRange === '12H') {
                    // For 12H view, compare to 6h ago
                    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= sixHoursAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 6h';
                            break;
                        }
                    }
                } else if (currentTimeRange === '24H') {
                    // For 24H view, compare to 12h ago or earlier
                    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= twelveHoursAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 12h';
                            break;
                        }
                    }
                } else if (currentTimeRange === '2D') {
                    // For 2D view, compare to 1 day ago
                    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= oneDayAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 24h';
                            break;
                        }
                    }
                } else if (currentTimeRange === '3D') {
                    // For 3D view, compare to 1.5 days ago
                    const oneAndHalfDaysAgo = new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= oneAndHalfDaysAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 1.5d';
                            break;
                        }
                    }
                } else if (currentTimeRange === '5D') {
                    // For 5D view, compare to 2 days ago
                    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= twoDaysAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 2d';
                            break;
                        }
                    }
                } else if (currentTimeRange === '14D') {
                    // For 14D view, compare to 7 days ago
                    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= sevenDaysAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 7d';
                            break;
                        }
                    }
                } else if (currentTimeRange === '7D') {
                    // For 7D view, compare to 1 day ago
                    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= oneDayAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 24h';
                            break;
                        }
                    }
                } else if (currentTimeRange === '30D') {
                    // For 30D view, compare to 7 days ago
                    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= sevenDaysAgo) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 7d';
                            break;
                        }
                    }
                } else {
                    // For ALL view, use the original logic
                    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    for (let i = filteredData.length - 2; i >= 0; i--) {
                        const pointDate = new Date(filteredData[i].timestamp);
                        if (pointDate <= yesterday) {
                            comparisonPoint = filteredData[i];
                            newChangeLabel = 'Last 24h';
                            break;
                        }
                    }
                }

                if (comparisonPoint) {
                    newRecentChange = newCurrentCount - comparisonPoint.count;
                    newShowRecentChange = true;
                }
            }

            // Calculate total growth for filtered data (smart logic)
            let newTotalGrowth = 0;
            let newShowTotalGrowth = false;
            let newFirstDate = '';

            if (filteredData.length >= 3) { // Need at least 3 points to show meaningful growth
                // Only show period growth if it's been more than a few hours of tracking
                const timeSinceStart = new Date().getTime() - new Date(filteredData[0].timestamp).getTime();
                const hoursSinceStart = timeSinceStart / (1000 * 60 * 60);

                if (hoursSinceStart >= 6) { // Only after 6+ hours of tracking
                    newTotalGrowth = newCurrentCount - filteredData[0].count;
                    newFirstDate = new Date(filteredData[0].timestamp).toLocaleDateString();

                    // For ALL view, only show if growth is reasonable (not the initial jump)
                    if (currentTimeRange === 'ALL') {
                        // Only show total growth if we have multiple data points over time
                        // and the growth seems realistic (not just the initial data point)
                        if (filteredData.length >= 5 && Math.abs(newTotalGrowth) <= 500) {
                            newShowTotalGrowth = true;
                        }
                    } else {
                        // For time-filtered views, always show if we have data
                        newShowTotalGrowth = true;
                    }
                }
            }

            // Check if realistic metrics should be shown
            const showRealisticMetrics = container.parentElement.querySelector('.realistic-toggle')?.checked !== false;

            // Update the stats display
            stats.innerHTML = `
                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">Current Followers</strong><br>
                    <span style="font-size: 28px; color: #e53e3e; font-weight: 600;">${newCurrentCount.toLocaleString()}</span>
                </div>

                ${newShowRecentChange ? `
                    <div style="min-width: 140px;">
                        <strong style="color: #ff6b6b;">${newChangeLabel}</strong><br>
                        <span style="font-size: 28px; color: ${newRecentChange >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                            ${newRecentChange >= 0 ? '+' : ''}${newRecentChange}
                        </span>
                    </div>
                ` : `
                    <div style="min-width: 140px;">
                        <strong style="color: #ff6b6b;">Recent Change</strong><br>
                        <span style="font-size: 20px; color: #666; font-weight: 600;">
                            ${currentTimeRange === 'ALL' ? 'Just started tracking' : 'No data in range'}
                        </span>
                        <div style="font-size: 11px; color: #999; margin-top: 2px;">Check back later</div>
                    </div>
                `}

                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">Growth per Check</strong><br>
                    ${newCheckStats.totalChecks >= 2 ? `
                        <span style="font-size: 24px; color: ${newCheckStats.growthPerCheck >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                            ${newCheckStats.growthPerCheck >= 0 ? '+' : ''}${newCheckStats.growthPerCheck.toFixed(1)}
                        </span>
                        <div style="font-size: 11px; color: #999; margin-top: 2px;">Per profile visit</div>
                    ` : `
                        <span style="font-size: 20px; color: #666; font-weight: 600;">
                            Need more checks
                        </span>
                        <div style="font-size: 11px; color: #999; margin-top: 2px;">Visit more often</div>
                    `}
                </div>

                ${showRealisticMetrics ? `
                    <div style="min-width: 140px;">
                        <strong style="color: #ff6b6b;">Daily Average</strong><br>
                        ${newDailyStats.hasEnoughData ? `
                            <span style="font-size: 24px; color: ${newDailyStats.dailyAverage >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                                ${newDailyStats.dailyAverage >= 0 ? '+' : ''}${newDailyStats.dailyAverage.toFixed(1)}/day
                            </span>
                            <div style="font-size: 11px; color: #999; margin-top: 2px;">Over ${newDailyStats.totalDays} days</div>
                        ` : `
                            <span style="font-size: 20px; color: #666; font-weight: 600;">
                                Calculating...
                            </span>
                            <div style="font-size: 11px; color: #999; margin-top: 2px;">Need more time</div>
                        `}
                    </div>
                ` : `
                    <div style="min-width: 140px;">
                        <strong style="color: #ff6b6b;">Check Frequency</strong><br>
                        ${newCheckStats.totalChecks >= 2 ? `
                            <span style="font-size: 18px; color: #e53e3e; font-weight: 600;">
                                ${newCheckStats.averageTimeBetweenChecks < 24 ?
                                    `${newCheckStats.averageTimeBetweenChecks.toFixed(1)}h` :
                                    `${(newCheckStats.averageTimeBetweenChecks / 24).toFixed(1)}d`}
                            </span>
                            <div style="font-size: 11px; color: #999; margin-top: 2px;">Between visits</div>
                        ` : `
                            <span style="font-size: 20px; color: #666; font-weight: 600;">
                                Just started
                            </span>
                            <div style="font-size: 11px; color: #999; margin-top: 2px;">Keep tracking</div>
                        `}
                    </div>
                `}

                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">Total Checks</strong><br>
                    <span style="font-size: 24px; color: #e53e3e; font-weight: 600;">${newCheckStats.totalChecks}</span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">Profile visits</div>
                </div>

                ${newShowTotalGrowth ? `
                    <div style="min-width: 140px;">
                        <strong style="color: #ff6b6b;">Period Growth</strong><br>
                        <span style="font-size: 20px; color: ${newTotalGrowth >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                            ${newTotalGrowth >= 0 ? '+' : ''}${newTotalGrowth}
                        </span>
                        <div style="font-size: 11px; color: #999; margin-top: 2px;">In ${currentTimeRange === 'ALL' ? 'tracking period' : currentTimeRange}</div>
                    </div>
                ` : `
                    <div style="min-width: 140px;">
                        <strong style="color: #ff6b6b;">Tracking Since</strong><br>
                        <span style="font-size: 16px; color: #e53e3e; font-weight: 600;">
                            ${data.length > 0 ? new Date(data[0].timestamp).toLocaleDateString() : 'Today'}
                        </span>
                        <div style="font-size: 11px; color: #999; margin-top: 2px;">${filteredData.length} data points</div>
                    </div>
                `}
            `;
        }

        // Stats section with enhanced metrics
        const stats = document.createElement('div');
        stats.style.cssText = `
            display: flex;
            justify-content: space-around;
            text-align: center;
            margin-bottom: 20px;
            background: rgba(15, 15, 15, 0.6);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #2d2d2d;
            flex-wrap: wrap;
            gap: 16px;
        `;

        const currentCount = data.length > 0 ? data[data.length - 1].count : 0;

        // Calculate intelligent recent change
        let recentChange = 0;
        let changeLabel = 'Recent Change';
        let showRecentChange = false;

        if (data.length >= 2) {
            const now = new Date();
            const latest = data[data.length - 1];

            // Look for a meaningful comparison point (not the very first data point)
            let comparisonPoint = null;

            // Try to find data from 24 hours ago
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            for (let i = data.length - 2; i >= 0; i--) {
                const pointDate = new Date(data[i].timestamp);
                if (pointDate <= yesterday) {
                    comparisonPoint = data[i];
                    changeLabel = 'Last 24h';
                    break;
                }
            }

            // If no 24h data, try 12 hours
            if (!comparisonPoint) {
                const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
                for (let i = data.length - 2; i >= 0; i--) {
                    const pointDate = new Date(data[i].timestamp);
                    if (pointDate <= twelveHoursAgo) {
                        comparisonPoint = data[i];
                        changeLabel = 'Last 12h';
                        break;
                    }
                }
            }

            // If no 12h data, try 6 hours
            if (!comparisonPoint) {
                const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
                for (let i = data.length - 2; i >= 0; i--) {
                    const pointDate = new Date(data[i].timestamp);
                    if (pointDate <= sixHoursAgo) {
                        comparisonPoint = data[i];
                        changeLabel = 'Last 6h';
                        break;
                    }
                }
            }

            // If no meaningful time period, use previous data point but only if it's not the first
            if (!comparisonPoint && data.length >= 3) {
                comparisonPoint = data[data.length - 2];
                const timeDiff = new Date(latest.timestamp).getTime() - new Date(comparisonPoint.timestamp).getTime();
                const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60));
                if (hoursDiff >= 1) {
                    changeLabel = hoursDiff === 1 ? 'Last Hour' : `Last ${hoursDiff}h`;
                    showRecentChange = true;
                }
            } else if (comparisonPoint) {
                showRecentChange = true;
            }

            if (comparisonPoint) {
                recentChange = currentCount - comparisonPoint.count;
            }
        }

        // Calculate intelligent total growth (only show if meaningful)
        let totalGrowth = 0;
        let showTotalGrowth = false;
        let firstDate = '';

        if (data.length >= 3) { // Only show total growth if we have multiple data points
            totalGrowth = currentCount - data[0].count;
            firstDate = new Date(data[0].timestamp).toLocaleDateString();

            // Only show total growth if it's been more than a few hours
            const timeSinceStart = new Date().getTime() - new Date(data[0].timestamp).getTime();
            const hoursSinceStart = timeSinceStart / (1000 * 60 * 60);
            showTotalGrowth = hoursSinceStart >= 6; // Show only after 6+ hours of tracking
        }

        stats.innerHTML = `
            <div style="min-width: 140px;">
                <strong style="color: #ff6b6b;">Current Followers</strong><br>
                <span style="font-size: 28px; color: #e53e3e; font-weight: 600;">${currentCount.toLocaleString()}</span>
            </div>

            ${showRecentChange ? `
                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">${changeLabel}</strong><br>
                    <span style="font-size: 28px; color: ${recentChange >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                        ${recentChange >= 0 ? '+' : ''}${recentChange}
                    </span>
                </div>
            ` : `
                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">Recent Change</strong><br>
                    <span style="font-size: 20px; color: #666; font-weight: 600;">
                        Just started tracking
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">Check back later</div>
                </div>
            `}

            <div style="min-width: 140px;">
                <strong style="color: #ff6b6b;">Daily Average</strong><br>
                ${dailyStats.hasEnoughData ? `
                    <span style="font-size: 24px; color: ${dailyStats.dailyAverage >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                        ${dailyStats.dailyAverage >= 0 ? '+' : ''}${dailyStats.dailyAverage.toFixed(1)}/day
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">Over ${dailyStats.totalDays} days</div>
                ` : `
                    <span style="font-size: 20px; color: #666; font-weight: 600;">
                        Calculating...
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">Need more time</div>
                `}
            </div>

            <div style="min-width: 140px;">
                <strong style="color: #ff6b6b;">Best Day</strong><br>
                ${dailyStats.bestDay.growth > 0 ? `
                    <span style="font-size: 20px; color: #4ade80; font-weight: 600;">
                        +${dailyStats.bestDay.growth}
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">${dailyStats.bestDay.date}</div>
                ` : `
                    <span style="font-size: 20px; color: #666; font-weight: 600;">
                        No data yet
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">Keep tracking</div>
                `}
            </div>

            ${showTotalGrowth ? `
                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">Total Growth</strong><br>
                    <span style="font-size: 20px; color: ${totalGrowth >= 0 ? '#4ade80' : '#ef4444'}; font-weight: 600;">
                        ${totalGrowth >= 0 ? '+' : ''}${totalGrowth}
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">Since ${firstDate}</div>
                </div>
            ` : `
                <div style="min-width: 140px;">
                    <strong style="color: #ff6b6b;">Tracking Since</strong><br>
                    <span style="font-size: 16px; color: #e53e3e; font-weight: 600;">
                        ${data.length > 0 ? new Date(data[0].timestamp).toLocaleDateString() : 'Today'}
                    </span>
                    <div style="font-size: 11px; color: #999; margin-top: 2px;">${data.length} data points</div>
                </div>
            `}
        `;

        // Buttons with dark theme
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;';

        // Export button
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📁 Export Data';
        exportBtn.style.cssText = `
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #e53e3e;
            border: 1px solid #404040;
            padding: 12px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
            font-family: inherit;
        `;
        exportBtn.onmouseover = () => {
            exportBtn.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)';
            exportBtn.style.color = '#ff6b6b';
        };
        exportBtn.onmouseout = () => {
            exportBtn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
            exportBtn.style.color = '#e53e3e';
        };
        exportBtn.onclick = () => {
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fetlife-follower-data.json';
            a.click();
            URL.revokeObjectURL(url);
        };

        // Clear data button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ Clear Data';
        clearBtn.style.cssText = `
            background: linear-gradient(135deg, #2d1a1a 0%, #3d2d2d 100%);
            color: #ef4444;
            border: 1px solid #404040;
            padding: 12px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
            font-family: inherit;
        `;
        clearBtn.onmouseover = () => {
            clearBtn.style.background = 'linear-gradient(135deg, #3d2d2d 0%, #4a3a3a 100%)';
            clearBtn.style.color = '#ff6b6b';
        };
        clearBtn.onmouseout = () => {
            clearBtn.style.background = 'linear-gradient(135deg, #2d1a1a 0%, #3d2d2d 100%)';
            clearBtn.style.color = '#ef4444';
        };
        clearBtn.onclick = () => {
            if (confirm('Are you sure you want to clear all follower data?')) {
                localStorage.removeItem(STORAGE_KEY);
                document.body.removeChild(overlay);
                console.log('📊 Follower data cleared');
            }
        };

        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(clearBtn);

        // Add controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
            flex-wrap: wrap;
        `;

        // Milestone toggle
        const milestoneToggleContainer = document.createElement('div');
        milestoneToggleContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const milestoneCheckbox = document.createElement('input');
        milestoneCheckbox.type = 'checkbox';
        milestoneCheckbox.className = 'milestone-toggle';
        milestoneCheckbox.checked = true;
        milestoneCheckbox.style.cssText = `
            width: 16px;
            height: 16px;
            accent-color: #e53e3e;
            cursor: pointer;
        `;

        const milestoneLabel = document.createElement('label');
        milestoneLabel.textContent = 'Show Milestones';
        milestoneLabel.style.cssText = `
            color: #999;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
        `;

        milestoneLabel.onclick = () => {
            milestoneCheckbox.checked = !milestoneCheckbox.checked;
            milestoneCheckbox.dispatchEvent(new Event('change'));
        };

        milestoneCheckbox.onchange = () => {
            const chartDiv = document.getElementById('followerChart');
            if (chartDiv && window.d3) {
                createD3Chart(chartDiv, currentData);
            }
        };

        milestoneToggleContainer.appendChild(milestoneCheckbox);
        milestoneToggleContainer.appendChild(milestoneLabel);

        // Realistic metrics toggle
        const realisticToggleContainer = document.createElement('div');
        realisticToggleContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;

        const realisticCheckbox = document.createElement('input');
        realisticCheckbox.type = 'checkbox';
        realisticCheckbox.className = 'realistic-toggle';
        realisticCheckbox.checked = false; // Default to showing realistic metrics
        realisticCheckbox.style.cssText = `
            width: 16px;
            height: 16px;
            accent-color: #e53e3e;
            cursor: pointer;
        `;

        const realisticLabel = document.createElement('label');
        realisticLabel.textContent = 'Show Unrealistic Metrics';
        realisticLabel.style.cssText = `
            color: #999;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
        `;

        // Info button
        const infoButton = document.createElement('span');
        infoButton.textContent = 'ℹ️';
        infoButton.style.cssText = `
            cursor: help;
            font-size: 14px;
            margin-left: 4px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        `;

        infoButton.onmouseover = () => {
            infoButton.style.opacity = '1';

            // Remove existing tooltip
            document.querySelectorAll('.info-tooltip').forEach(t => t.remove());

            // Create info tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'info-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                color: #ff6b6b;
                border: 1px solid #e53e3e;
                border-radius: 8px;
                padding: 12px;
                font-size: 11px;
                font-family: monospace;
                white-space: nowrap;
                z-index: 1002;
                box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
                max-width: 300px;
                white-space: normal;
                line-height: 1.4;
            `;
            tooltip.innerHTML = `
                <strong>ℹ️ About Unrealistic Metrics:</strong><br>
                This script only tracks when YOU visit your profile.<br>
                "Daily Average" assumes constant growth, which isn't realistic.<br>
                Turn this ON only if you check your profile very frequently.
            `;

            realisticToggleContainer.style.position = 'relative';
            realisticToggleContainer.appendChild(tooltip);
        };

        infoButton.onmouseout = () => {
            infoButton.style.opacity = '0.7';
            document.querySelectorAll('.info-tooltip').forEach(t => t.remove());
        };

        realisticLabel.onclick = () => {
            realisticCheckbox.checked = !realisticCheckbox.checked;
            realisticCheckbox.dispatchEvent(new Event('change'));
        };

        realisticCheckbox.onchange = () => {
            updateStatsForTimeRange(currentData);
        };

        realisticToggleContainer.appendChild(realisticCheckbox);
        realisticToggleContainer.appendChild(realisticLabel);
        realisticToggleContainer.appendChild(infoButton);

        controlsContainer.appendChild(milestoneToggleContainer);
        controlsContainer.appendChild(realisticToggleContainer);

        // Assemble modal
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(timeRangeContainer);
        modal.appendChild(chartContainer);
        modal.appendChild(stats);
        modal.appendChild(buttonContainer);
        modal.appendChild(controlsContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Initialize with ALL data
        updateStatsForTimeRange(currentData);
    }

    // Check if we're on a user profile page
    function isOnProfilePage() {
        // Check if URL matches a profile pattern
        const path = window.location.pathname;
        // Exclude common non-profile pages
        const excludePatterns = [
            '/home', '/feed', '/explore', '/login', '/help', '/conversations',
            '/inbox', '/events', '/groups', '/fetishes', '/kinksters', '/places',
            '/pictures', '/videos', '/posts', '/audio', '/guidelines'
        ];

        // Check if path starts with any excluded pattern
        for (const pattern of excludePatterns) {
            if (path.startsWith(pattern)) {
                return false;
            }
        }

        // If path is just a username (like /username123), it's likely a profile
        const pathParts = path.split('/').filter(part => part.length > 0);
        if (pathParts.length === 1 && pathParts[0].length > 0) {
            return true;
        }

        // Also check if the page contains profile-specific elements
        return document.querySelector('[data-component="UserProfile"]') !== null;
    }

    // Update chart button text to show current follower count
    function updateChartButtonText(count) {
        const button = document.getElementById('chart-viewer-btn');
        if (button && count) {
            button.textContent = `📊 View Chart (${count.toLocaleString()})`;
        }
    }

    // Add view chart button (remove tracking button since we auto-track now)
    function addChartButton() {
        // Check if button already exists
        if (document.getElementById('chart-viewer-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'chart-viewer-btn';
        btn.textContent = '📊 View Growth Chart';
        btn.style.cssText = `
            position: fixed !important;
            top: 50%;
            right: 20px !important;
            transform: translateY(-50%);
            z-index: 999999 !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #e53e3e !important;
            border: 1px solid #404040 !important;
            padding: 12px 18px !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            font-size: 13px !important;
            cursor: pointer !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            backdrop-filter: blur(10px) !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
            letter-spacing: 0.3px !important;
            user-select: none !important;
            min-width: 200px !important;
        `;

        btn.onclick = () => {
            const data = getStoredData();
            showChart(data);
        };

        // Add hover effect
        btn.onmouseover = () => {
            btn.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%) !important';
            btn.style.color = '#ff6b6b !important';
            btn.style.transform = 'translateY(-50%) translateY(-2px) scale(1.02)';
            btn.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15) !important';
            btn.style.borderColor = '#555555 !important';
        };
        btn.onmouseout = () => {
            btn.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important';
            btn.style.color = '#e53e3e !important';
            btn.style.transform = 'translateY(-50%) translateY(0) scale(1)';
            btn.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important';
            btn.style.borderColor = '#404040 !important';
        };

        document.body.appendChild(btn);
        console.log('📊 Chart button added to page');
    }

    // Initialize the script
    function init() {
        console.log('🚀 FetLife Follower Tracker initializing...');
        console.log('Current URL:', window.location.href);
        console.log('Is on profile page:', isOnProfilePage());
        console.log('Is on own profile:', isOnOwnProfile());

        if (isOnProfilePage()) {
            console.log('✅ On profile page - adding chart button');
            // Only add chart button, remove manual tracking button
            addChartButton();

            // Auto-track followers when on own profile
            if (isOnOwnProfile()) {
                console.log('✅ On own profile - starting auto-track');
                autoTrackFollowers();
            } else {
                console.log('ℹ️ On someone else\'s profile - no auto-tracking');
            }
        } else {
            console.log('❌ Not on profile page - no button added');
        }
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run on page navigation (for single page app behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000); // Delay to allow page to load
        }
    }).observe(document, { subtree: true, childList: true });

})();