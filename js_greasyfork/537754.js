// ==UserScript==
// @name         pibbEnhanced
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  Refines SCUPI Blackboard module to display assignments with database storage, manual completion tracking, and recovery features. Force refresh preserves user completion status while updating assignment cache. Ensures only the assignment list is scrollable, includes timeout/error feedback, and automatically reloads if page content overwrites script output.
// @author       violetctl39
// @match        https://pibb.scu.edu.cn/webapps/portal/execute/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      pibb.scu.edu.cn
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537754/pibbEnhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/537754/pibbEnhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('pibbEnhanced script started (v1.3.4).');

    function checkFirefoxCompatibility() {
        const isFirefox = navigator.userAgent.includes('Firefox');
        console.log('Browser detection:', {
            userAgent: navigator.userAgent,
            isFirefox: isFirefox,
            tampermonkeyVersion: typeof GM_info !== 'undefined' ? GM_info.version : 'unknown'
        });

        if (isFirefox) {
            console.log('Firefox detected - using GM_xmlhttpRequest for network requests');
            if (typeof GM_xmlhttpRequest === 'undefined') {
                console.error('GM_xmlhttpRequest is not available! Please check Tampermonkey settings.');
                return false;
            }
        }
        return true;
    }

    if (!checkFirefoxCompatibility()) {
        alert('pibbEnhanced: 检测到兼容性问题，请检查 Tampermonkey 设置');
    }

    const SCRIPT_CONTENT_ID = 'userscript-assignment-content';
    let isMainRunning = false;
    let currentObserver = null;
    const assignmentsUrl = 'https://pibb.scu.edu.cn/webapps/calendar/calendarData/selectedCalendarEvents';
    const courseLinksXMLUrl = 'https://pibb.scu.edu.cn/webapps/portal/execute/tabs/tabAction?action=refreshAjaxModule&modId=_2_1&tabId=_1_1&tab_tab_group_id=_1_1';    // Database keys for localStorage
    const DB_KEYS = {
        ASSIGNMENTS: 'pibbEnhanced_assignments',
        COMPLETED: 'pibbEnhanced_completed',
        LAST_UPDATE: 'pibbEnhanced_lastUpdate'
    };

    function sanitizeUnicodeString(str) {
        if (!str || typeof str !== 'string') return '';

        try {
            return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                .replace(/[\uFEFF]/g, '') 
                .trim();
        } catch (error) {
            console.warn('String sanitization failed:', error);
            return str.toString();
        }
    }

    class AssignmentDB {
        static saveAssignments(assignments) {
            try {
                GM_setValue(DB_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
                GM_setValue(DB_KEYS.LAST_UPDATE, Date.now());
                console.log('Assignments saved to database:', assignments.length);
            } catch (error) {
                console.error('Error saving assignments to database:', error);
            }
        }

        static loadAssignments() {
            try {
                const data = GM_getValue(DB_KEYS.ASSIGNMENTS, '[]');
                const assignments = JSON.parse(data).map(item => new Assignment(item.title, item.calendarName, item.end, item.courseLink));
                console.log('Assignments loaded from database:', assignments.length);
                return assignments;
            } catch (error) {
                console.error('Error loading assignments from database:', error);
                return [];
            }
        }

        static markCompleted(assignmentId) {
            try {
                const completed = this.getCompleted();
                completed.add(assignmentId);
                GM_setValue(DB_KEYS.COMPLETED, JSON.stringify([...completed]));
                console.log('Assignment marked as completed:', assignmentId);
            } catch (error) {
                console.error('Error marking assignment as completed:', error);
            }
        } static markDeleted(assignmentId) {
            console.warn('markDeleted is deprecated, using markCompleted instead');
            this.markCompleted(assignmentId);
        } static recoverAssignment(assignmentId) {
            try {
                const completed = this.getCompleted();
                completed.delete(assignmentId);
                GM_setValue(DB_KEYS.COMPLETED, JSON.stringify([...completed]));
                console.log('Assignment recovered:', assignmentId);
            } catch (error) {
                console.error('Error recovering assignment:', error);
            }
        }

        static getCompleted() {
            try {
                const data = GM_getValue(DB_KEYS.COMPLETED, '[]');
                return new Set(JSON.parse(data));
            } catch (error) {
                console.error('Error loading completed assignments:', error);
                return new Set();
            }
        } static getDeleted() {
            console.warn('getDeleted is deprecated, returning empty set');
            return new Set();
        }

        static getLastUpdate() {
            return GM_getValue(DB_KEYS.LAST_UPDATE, 0);
        }

        static shouldUpdateFromServer() {
            const lastUpdate = this.getLastUpdate();
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;
            return (now - lastUpdate) > oneHour;
        } static clearAssignmentCache() {
            GM_deleteValue(DB_KEYS.ASSIGNMENTS);
            GM_deleteValue(DB_KEYS.LAST_UPDATE);
            console.log('Assignment cache cleared, completed assignments preserved');
        }

        static clearDatabase() {
            GM_deleteValue(DB_KEYS.ASSIGNMENTS);
            GM_deleteValue(DB_KEYS.COMPLETED);
            GM_deleteValue(DB_KEYS.LAST_UPDATE);
            console.log('Database cleared completely');
        }
    } class Assignment {
        constructor(title, calendarName, end, courseLink = null) {
            this.title = sanitizeUnicodeString(title) || 'Untitled Assignment';
            this.calendarName = sanitizeUnicodeString(calendarName) || 'Unknown Course';
            this.end = new Date(end);
            this.courseLink = courseLink;
            this.id = this.generateId();

            if (title !== this.title || calendarName !== this.calendarName) {
                console.log('Unicode characters sanitized:', {
                    originalTitle: title,
                    sanitizedTitle: this.title,
                    originalCalendarName: calendarName,
                    sanitizedCalendarName: this.calendarName
                });
            }
        } generateId() {
            const safeTitle = this.title.substring(0, 50);
            const safeCalendarName = this.calendarName.substring(0, 30);
            const baseString = `${safeTitle}_${safeCalendarName}_${this.end.getTime()}`;

            console.log('Generating ID for assignment with Chinese characters:', {
                title: this.title,
                calendarName: this.calendarName,
                baseStringLength: baseString.length
            });

            try {
                let hash = 5381;
                for (let i = 0; i < baseString.length; i++) {
                    const char = baseString.charCodeAt(i);
                    hash = ((hash << 5) + hash) + char;
                }
                const hashResult = Math.abs(hash).toString(36).substring(0, 16);
                console.log('Assignment ID generated using djb2 hash:', hashResult);
                return hashResult;
            } catch (hashError) {
                console.warn('Hash method failed:', hashError);
            }

            try {
                const timestamp = this.end.getTime().toString(36);
                const random = Math.random().toString(36).substring(2, 8);
                const fallbackId = `${timestamp}_${random}`.substring(0, 16);
                console.warn('Using timestamp fallback ID:', fallbackId);
                return fallbackId;
            } catch (finalError) {
                console.error('All ID generation methods failed:', finalError);
                return `err_${Date.now().toString(36)}`.substring(0, 16);
            }
        }
    } async function loadAssignments(url, timeout = 15000) {
        console.log(`Fetching assignments from: ${url} with ${timeout}ms timeout`);
        console.log('Browser:', navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other');

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: timeout,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'application/json, text/plain, */*',
                    'Cache-Control': 'no-cache'
                },
                onload: function (response) {
                    console.log('GM_xmlhttpRequest onload - status:', response.status);
                    console.log('Response headers:', response.responseHeaders);

                    if (response.status !== 200) {
                        let errorMsg = `Server returned error status: ${response.status}`;
                        if (response.status === 500) {
                            errorMsg = "Internal Server Error (HTTP 500). Please try again later or check the server status.";
                        } else if (response.status === 404) {
                            errorMsg = "Requested resource not found (HTTP 404). Please check if the URL is correct.";
                        }
                        console.error(errorMsg, response);
                        resolve({ success: false, errorType: 'httpError', message: errorMsg });
                        return;
                    }

                    let jsonData;
                    try {
                        jsonData = JSON.parse(response.responseText);
                    } catch (e) {
                        console.error("Failed to parse JSON data:", e);
                        resolve({ success: false, errorType: 'invalidFormat', message: "Could not parse server response, format might not be valid JSON." });
                        return;
                    }

                    if (!Array.isArray(jsonData)) {
                        console.error("Fetched data is not an array:", jsonData);
                        resolve({ success: false, errorType: 'invalidFormat', message: "Incorrect data format from server (expected an array)." });
                        return;
                    }

                    const assignments = jsonData.map(item => new Assignment(item.title, item.calendarName, item.end));
                    resolve({ success: true, data: assignments });
                },
                onerror: function (error) {
                    console.error("GM_xmlhttpRequest error:", error);
                    console.error("Error details:", {
                        readyState: error.readyState || 'unknown',
                        status: error.status || 'unknown',
                        statusText: error.statusText || 'unknown',
                        responseText: error.responseText || 'no response'
                    });
                    resolve({ success: false, errorType: 'network', message: "Network connection error or server unresponsive. Please check your network and try again." });
                },
                ontimeout: function () {
                    console.error("GM_xmlhttpRequest timeout:", url);
                    resolve({ success: false, errorType: 'timeout', message: "Timeout loading assignment data. Please check your network connection or try again later." });
                }
            });
        });
    } async function loadCourseLinksFromXML(url, timeout = 10000) {
        console.log(`Fetching course links from XML: ${url} with ${timeout}ms timeout`);
        console.log('Browser:', navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other');

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: timeout,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'application/xml, text/xml, */*',
                    'Cache-Control': 'no-cache'
                },
                onload: function (response) {
                    console.log('GM_xmlhttpRequest XML onload - status:', response.status);
                    console.log('XML Response headers:', response.responseHeaders);

                    if (response.status !== 200) {
                        console.error(`Error fetching XML: ${response.status} ${response.statusText} from ${url}`);
                        resolve({ success: false, errorType: 'httpError', message: `Failed to load course links XML: ${response.status}` });
                        return;
                    }

                    try {
                        const xmlString = response.responseText;
                        const parser = new DOMParser();
                        const outerXmlDoc = parser.parseFromString(xmlString, "application/xml");

                        const cdataNode = outerXmlDoc.querySelector('contents');
                        if (!cdataNode || !cdataNode.firstChild || cdataNode.firstChild.nodeType !== Node.CDATA_SECTION_NODE) {
                            console.error("CDATA section not found or invalid in XML from " + url);
                            resolve({ success: false, errorType: 'xmlFormatError', message: "Invalid XML structure: CDATA section missing." });
                            return;
                        }

                        const htmlString = cdataNode.firstChild.nodeValue;
                        const htmlDoc = parser.parseFromString(htmlString, "text/html");

                        const courseLinksMap = new Map();
                        const links = htmlDoc.querySelectorAll("ul.portletList-img li a");

                        if (links.length === 0) {
                            console.warn("No course links found in the XML content from " + url);
                        }

                        links.forEach(link => {
                            const courseName = link.textContent.trim();
                            const courseUrl = link.getAttribute("href");
                            if (courseName && courseUrl) {
                                courseLinksMap.set(courseName, courseUrl.trim());
                            } else {
                                console.warn("Found a link tag without proper course name or href in XML", link);
                            }
                        });

                        resolve({ success: true, data: courseLinksMap });
                    } catch (error) {
                        console.error("Error parsing XML:", error);
                        resolve({ success: false, errorType: 'parseError', message: "Error processing course links XML." });
                    }
                },
                onerror: function (error) {
                    console.error("GM_xmlhttpRequest XML error:", error);
                    console.error("XML Error details:", {
                        readyState: error.readyState || 'unknown',
                        status: error.status || 'unknown',
                        statusText: error.statusText || 'unknown',
                        responseText: error.responseText || 'no response'
                    });
                    resolve({ success: false, errorType: 'network', message: "Error loading course links XML." });
                },
                ontimeout: function () {
                    console.error("GM_xmlhttpRequest XML timeout:", url);
                    resolve({ success: false, errorType: 'timeout', message: "Timeout fetching course links XML." });
                }
            });
        });
    }

    function formatDateTime(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function startIndividualCountdown(endDate, displayElement) {
        const update = () => {
            const now = new Date().getTime();
            const timeLeft = endDate.getTime() - now;

            if (timeLeft <= 0) {
                displayElement.textContent = 'Past Due';
                displayElement.style.color = '#757575';
                if (displayElement.intervalId) clearInterval(displayElement.intervalId);
                return;
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            let countdownText = days > 0 ? `${days}d ` : '';
            countdownText += `${hours}h ${minutes}min ${seconds}s`;
            displayElement.textContent = ` ${countdownText}`;

            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            const TWO_DAYS_MS = 2 * ONE_DAY_MS;
            const THREE_DAYS_MS = 3 * ONE_DAY_MS;
            const FIVE_DAYS_MS = 5 * ONE_DAY_MS;
            const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

            if (timeLeft < ONE_DAY_MS) {
                displayElement.style.color = '#D32F2F';
            } else if (timeLeft < TWO_DAYS_MS) {
                displayElement.style.color = '#E64A19';
            } else if (timeLeft < THREE_DAYS_MS) {
                displayElement.style.color = '#F57C00';
            } else if (timeLeft < FIVE_DAYS_MS) {
                displayElement.style.color = '#FFA000';
            } else if (timeLeft < SEVEN_DAYS_MS) {
                displayElement.style.color = '#689F38';
            } else {
                displayElement.style.color = '#555555';
            }
        }; update();
        displayElement.intervalId = setInterval(update, 1000);
    }

    function showRecoveryDialog(recoverableAssignments) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        const dialog = document.createElement('div');
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.maxWidth = '500px';
        dialog.style.maxHeight = '400px';
        dialog.style.overflowY = 'auto';
        dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; const title = document.createElement('h3');
        title.textContent = 'Recover Completed Assignments';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';

        const list = document.createElement('div');
        recoverableAssignments.forEach(assignment => {
            const item = document.createElement('div');
            item.style.padding = '10px';
            item.style.border = '1px solid #ddd';
            item.style.marginBottom = '10px';
            item.style.borderRadius = '4px'; const assignmentInfo = document.createElement('div');
            assignmentInfo.innerHTML = `
                <strong>${assignment.title}</strong><br>
                <small>Course: ${assignment.calendarName}</small><br>
                <small>Due: ${formatDateTime(assignment.end)}</small>
            `; const recoverBtn = document.createElement('button');
            recoverBtn.textContent = 'Recover';
            recoverBtn.style.marginTop = '5px';
            recoverBtn.style.padding = '4px 8px';
            recoverBtn.style.fontSize = '11px';
            recoverBtn.style.cursor = 'pointer';
            recoverBtn.style.backgroundColor = '#e3f2fd';
            recoverBtn.style.color = '#1976d2';
            recoverBtn.style.border = '1px solid #bbdefb';
            recoverBtn.style.borderRadius = '3px'; recoverBtn.onclick = () => {
                AssignmentDB.recoverAssignment(assignment.id);
                item.style.opacity = '0.5';
                recoverBtn.disabled = true;
                recoverBtn.textContent = 'Recovered';
            };

            item.appendChild(assignmentInfo);
            item.appendChild(recoverBtn);
            list.appendChild(item);
        }); const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.padding = '6px 12px';
        closeBtn.style.fontSize = '12px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.backgroundColor = '#f5f5f5';
        closeBtn.style.color = '#333';
        closeBtn.style.border = '1px solid #ddd';
        closeBtn.style.borderRadius = '3px';
        closeBtn.style.marginTop = '15px';
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
            main().catch(e => console.error("Error refreshing after recovery dialog close:", e));
        };

        dialog.appendChild(title);
        dialog.appendChild(list);
        dialog.appendChild(closeBtn);
        overlay.appendChild(dialog);
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);

                main().catch(e => console.error("Error refreshing after recovery dialog close:", e));
            }
        };

        document.body.appendChild(overlay);
    }

    async function main() {
        if (isMainRunning) {
            console.log('main() is already running. Skipping this call.');
            return;
        }
        isMainRunning = true;
        console.log('Executing main()');

        try {
            const targetModule = document.getElementById('module:_27_1');
            if (!targetModule) {
                console.error('Target module "module:_27_1" not found.');
                return;
            }

            targetModule.style.boxSizing = 'border-box'; const headerElement = targetModule.querySelector('h2.dragHandle.clearfix');
            if (headerElement) {
                const titleSpan = headerElement.querySelector('span.moduleTitle');
                if (titleSpan) {
                    titleSpan.textContent = 'Assignment Deadline';
                } else {
                    console.warn('span.moduleTitle not found in h2. Creating and prepending a new one.');
                    const newTitleSpan = document.createElement('span');
                    newTitleSpan.className = 'moduleTitle';
                    newTitleSpan.textContent = 'Assignment Deadline';
                    headerElement.prepend(newTitleSpan);
                }
                const headerButtonsContainer = document.createElement('div');
                headerButtonsContainer.style.float = 'right';
                headerButtonsContainer.style.display = 'flex';
                headerButtonsContainer.style.gap = '5px';
                headerButtonsContainer.style.alignItems = 'center';
                headerButtonsContainer.style.marginRight = '15px';
                headerElement.appendChild(headerButtonsContainer);
            } else {
                console.warn('Original h2.dragHandle.clearfix header not found.');
            } let contentHostElement;
            let listContainer;
            const collapsibleDiv = targetModule.querySelector('div.collapsible#On_Demand_Help_Tools');

            if (collapsibleDiv) {
                contentHostElement = collapsibleDiv;
                contentHostElement.innerHTML = '';

                let innerDivForList = contentHostElement.querySelector('#div_27_1');
                if (!innerDivForList) {
                    innerDivForList = document.createElement('div');
                    innerDivForList.id = 'div_27_1';
                    innerDivForList.style.cssText = 'padding: 10px; min-height: 100px;';
                    contentHostElement.appendChild(innerDivForList);
                    console.log('Created missing #div_27_1 element within .collapsible container.');
                }
                listContainer = innerDivForList;
            } else {
                console.log('div.collapsible#On_Demand_Help_Tools not found. Creating a new content host structure.');
                contentHostElement = document.createElement('div');
                contentHostElement.className = 'collapsible';
                contentHostElement.id = 'On_Demand_Help_Tools';
                contentHostElement.style.cssText = 'border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; background: #fff;';

                const innerDiv = document.createElement('div');
                innerDiv.id = 'div_27_1';
                innerDiv.style.cssText = 'padding: 10px; min-height: 100px;';
                contentHostElement.appendChild(innerDiv);
                listContainer = innerDiv;

                const refNodeForInsertion = headerElement || targetModule.querySelector('div.edit_controls');
                if (refNodeForInsertion && refNodeForInsertion.parentElement === targetModule) {
                    refNodeForInsertion.after(contentHostElement);
                } else {
                    targetModule.appendChild(contentHostElement);
                }
            }

            listContainer.innerHTML = '';
            const loadingMessageEl = document.createElement('p');
            loadingMessageEl.id = SCRIPT_CONTENT_ID;
            loadingMessageEl.textContent = 'Loading...';
            loadingMessageEl.style.padding = '10px';
            loadingMessageEl.style.textAlign = 'center';
            loadingMessageEl.style.margin = 'auto';
            listContainer.appendChild(loadingMessageEl);

            if (currentObserver) {
                currentObserver.disconnect();
            }
            currentObserver = new MutationObserver((mutationsList, obs) => {
                if (isMainRunning) {
                    return;
                }
                if (!document.getElementById(SCRIPT_CONTENT_ID)) {
                    console.log(`Userscript content (ID: ${SCRIPT_CONTENT_ID}) no longer in DOM. Re-initializing.`);
                    obs.disconnect();
                    currentObserver = null;
                    main().catch(e => console.error("Error during observer-triggered main() execution:", e));
                }
            }); currentObserver.observe(listContainer, { childList: true, subtree: false });

            let allAssignments;
            if (AssignmentDB.shouldUpdateFromServer()) {
                console.log('Fetching fresh data from server...');
                const loadResult = await loadAssignments(assignmentsUrl);

                const currentScriptContent = document.getElementById(SCRIPT_CONTENT_ID);
                if (!currentScriptContent || !listContainer.contains(currentScriptContent)) {
                    console.warn("Userscript content (loading message) was removed from listContainer during data fetch. Observer will handle re-initialization.");
                    return;
                }

                if (loadResult.success) {
                    allAssignments = loadResult.data;

                    const courseLinksResult = await loadCourseLinksFromXML(courseLinksXMLUrl);
                    if (courseLinksResult && courseLinksResult.success) {
                        const courseLinksMap = courseLinksResult.data;
                        allAssignments.forEach(assignment => {
                            const fullCourseName = assignment.calendarName;
                            if (courseLinksMap.has(fullCourseName)) {
                                const partialLink = courseLinksMap.get(fullCourseName);
                                assignment.courseLink = 'https://pibb.scu.edu.cn' + partialLink;
                            }
                        });
                    } else {
                        console.warn("Could not load or parse course links XML. Proceeding without them.", courseLinksResult ? courseLinksResult.message : "No result from loadCourseLinksFromXML");
                    }

                    AssignmentDB.saveAssignments(allAssignments);
                } else {
                    console.warn('Server fetch failed, trying to use cached data...');
                    allAssignments = AssignmentDB.loadAssignments();
                    if (allAssignments.length === 0) {
                        listContainer.innerHTML = '';
                        const errorMessageEl = document.createElement('p');
                        errorMessageEl.id = SCRIPT_CONTENT_ID;
                        errorMessageEl.textContent = `Error: ${loadResult.message}`;
                        errorMessageEl.style.color = 'red';
                        errorMessageEl.style.padding = '10px';
                        errorMessageEl.style.textAlign = 'center';
                        listContainer.appendChild(errorMessageEl);
                        console.error(`Failed to load assignments: ${loadResult.errorType} - ${loadResult.message}`);
                        return;
                    }
                }
            } else {
                console.log('Using cached data from database...');
                allAssignments = AssignmentDB.loadAssignments();
            } listContainer.innerHTML = '';

            const completedAssignments = AssignmentDB.getCompleted();

            const now = new Date();
            const todayYear = now.getFullYear();
            const todayMonth = now.getMonth();
            const todayDay = now.getDate();

            const assignmentsToDisplay = allAssignments.filter(assignment => {
                if (completedAssignments.has(assignment.id)) {
                    return false;
                }

                const endDate = assignment.end;
                const isUpcoming = endDate > now;

                const isPastDueToday = endDate <= now &&
                    endDate.getFullYear() === todayYear &&
                    endDate.getMonth() === todayMonth &&
                    endDate.getDate() === todayDay;

                return isUpcoming || isPastDueToday;
            }).sort((a, b) => a.end - b.end);

            const recoverableAssignments = allAssignments.filter(assignment => {
                return completedAssignments.has(assignment.id) && assignment.end > now;
            }).sort((a, b) => a.end - b.end);
            const mainContainer = document.createElement('div');
            mainContainer.id = SCRIPT_CONTENT_ID;

            const headerButtonsContainer = targetModule.querySelector('h2.dragHandle.clearfix div');
            if (headerButtonsContainer) {
                headerButtonsContainer.innerHTML = '';
                const refreshBtn = document.createElement('button');
                refreshBtn.textContent = '↻';
                refreshBtn.title = 'Force Refresh';
                refreshBtn.style.padding = '2px 6px';
                refreshBtn.style.fontSize = '14px';
                refreshBtn.style.cursor = 'pointer';
                refreshBtn.style.backgroundColor = '#f8f9fa';
                refreshBtn.style.border = '1px solid #ddd';
                refreshBtn.style.borderRadius = '3px';
                refreshBtn.style.color = '#333';
                refreshBtn.style.lineHeight = '1';
                refreshBtn.onclick = () => {
                    console.log('Force refresh requested by user');
                    AssignmentDB.clearAssignmentCache();
                    main().catch(e => console.error("Error during forced refresh:", e));
                };

                headerButtonsContainer.appendChild(refreshBtn);

                if (recoverableAssignments.length > 0) {
                    const recoverBtn = document.createElement('button');
                    recoverBtn.textContent = '↶';
                    recoverBtn.title = `Recover Completed Assignments (${recoverableAssignments.length})`;
                    recoverBtn.style.padding = '2px 6px';
                    recoverBtn.style.fontSize = '14px';
                    recoverBtn.style.cursor = 'pointer';
                    recoverBtn.style.backgroundColor = '#e3f2fd';
                    recoverBtn.style.border = '1px solid #bbdefb';
                    recoverBtn.style.borderRadius = '3px';
                    recoverBtn.style.color = '#1976d2';
                    recoverBtn.style.lineHeight = '1';
                    recoverBtn.onclick = () => showRecoveryDialog(recoverableAssignments);

                    headerButtonsContainer.appendChild(recoverBtn);
                }
            }

            if (assignmentsToDisplay.length > 0) {
                const assignmentListWrapper = document.createElement('div');
                assignmentListWrapper.style.overflowY = 'auto';
                let availableHeight = 350;
                if (targetModule.style.maxHeight) {
                    availableHeight = parseInt(targetModule.style.maxHeight, 10);
                }
                let headerHeight = 0;
                if (headerElement) {
                    headerHeight = headerElement.offsetHeight;
                }
                assignmentListWrapper.style.maxHeight = (availableHeight - headerHeight - 20) + 'px';

                const list = document.createElement('ul');
                list.style.listStyleType = 'none';
                list.style.paddingLeft = '0';
                assignmentsToDisplay.forEach(assignment => {
                    const listItem = document.createElement('li');
                    listItem.style.marginBottom = '15px';
                    listItem.style.padding = '10px';
                    listItem.style.border = '1px solid #eee';
                    listItem.style.borderRadius = '4px';

                    const titleEl = document.createElement('strong');
                    titleEl.textContent = assignment.title;
                    titleEl.style.display = 'block';
                    titleEl.style.fontSize = '1.1em';
                    titleEl.style.marginBottom = '5px';

                    const courseEl = document.createElement('div');
                    courseEl.style.fontSize = '0.9em';
                    courseEl.style.color = '#555';

                    if (assignment.courseLink) {
                        courseEl.appendChild(document.createTextNode('Course: '));
                        const link = document.createElement('a');
                        link.href = assignment.courseLink;
                        link.textContent = assignment.calendarName;
                        link.target = '_blank';
                        courseEl.appendChild(link);
                    } else {
                        courseEl.textContent = `Course: ${assignment.calendarName}`;
                    }

                    const endEl = document.createElement('div');
                    endEl.textContent = `Due: ${formatDateTime(assignment.end)}`;
                    endEl.style.fontSize = '0.9em';
                    endEl.style.fontWeight = 'bold';
                    endEl.style.color = '#555';
                    const countdownButtonContainer = document.createElement('div');
                    countdownButtonContainer.style.display = 'flex';
                    countdownButtonContainer.style.justifyContent = 'space-between';
                    countdownButtonContainer.style.alignItems = 'center';
                    countdownButtonContainer.style.marginTop = '5px';

                    const countdownEl = document.createElement('div');
                    countdownEl.style.fontSize = '1.1em';
                    countdownEl.style.fontWeight = 'bold';
                    countdownEl.style.flex = '1';

                    const completeBtn = document.createElement('button');
                    completeBtn.textContent = 'Complete';
                    completeBtn.style.padding = '4px 8px';
                    completeBtn.style.fontSize = '11px';
                    completeBtn.style.cursor = 'pointer';
                    completeBtn.style.backgroundColor = '#e8f5e8';
                    completeBtn.style.color = '#2e7d32';
                    completeBtn.style.border = '1px solid #c8e6c9';
                    completeBtn.style.borderRadius = '3px';
                    completeBtn.style.marginLeft = '10px';
                    completeBtn.onclick = () => {
                        AssignmentDB.markCompleted(assignment.id);
                        main().catch(e => console.error("Error refreshing after completion:", e));
                    };

                    countdownButtonContainer.appendChild(countdownEl);
                    countdownButtonContainer.appendChild(completeBtn); listItem.appendChild(titleEl);
                    listItem.appendChild(courseEl);
                    listItem.appendChild(endEl);
                    listItem.appendChild(countdownButtonContainer);
                    list.appendChild(listItem);
                    startIndividualCountdown(assignment.end, countdownEl);
                });

                assignmentListWrapper.appendChild(list);
                mainContainer.appendChild(assignmentListWrapper);
            } else {
                const noAssignmentsMessage = document.createElement('p');
                noAssignmentsMessage.textContent = 'No upcoming assignments! Enjoy your free time!';
                noAssignmentsMessage.style.padding = '10px';
                noAssignmentsMessage.style.textAlign = 'center';
                mainContainer.appendChild(noAssignmentsMessage);
            }

            listContainer.appendChild(mainContainer);
        } catch (error) {
            console.error("Error in main function execution:", error);
        } finally {
            isMainRunning = false;
            console.log('main() execution finished.');
        }
    }

    main().catch(e => {
        console.error("Error during initial main() execution:", e);
        isMainRunning = false;
    });

})();
