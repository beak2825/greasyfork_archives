// ==UserScript==
// @name         HW Auto Hacking & Software Installation (Looped, Toggle, Skip Bad Cracker)
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Automatically scans /list for vulnerable IPs (skipping those that return a cracker error), hacks them, uploads/installs software, clears logs, logs out, and repeats. Includes a sidebar toggle to start/stop automation, clears /logs if textarea is not empty, shows a modal on "Success! Log successfully edited." message, checks software table before uploading, and sniffs IPs from logs.
// @match        https://hackerwars.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528482/HW%20Auto%20Hacking%20%20Software%20Installation%20%28Looped%2C%20Toggle%2C%20Skip%20Bad%20Cracker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528482/HW%20Auto%20Hacking%20%20Software%20Installation%20%28Looped%2C%20Toggle%2C%20Skip%20Bad%20Cracker%29.meta.js
// ==/UserScript==

// Function to update software list in localStorage (no ID column addition)
function addSoftwareIdColumn() {
    if (window.location.href === 'https://hackerwars.io/software' || window.location.href === 'https://hackerwars.io/software.php') {
        updateSoftwareList();
    }
}

// Function to update software list in localStorage
function updateSoftwareList() {
    const rows = document.querySelectorAll('table.table-software tbody tr');
    const softwareList = [];
    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(2)');
        const versionCell = row.querySelector('td:nth-child(3)');
        const actionLink = row.querySelector('a[href*="id="]');
        if (nameCell && versionCell && actionLink) {
            const name = nameCell.textContent.trim();
            const version = versionCell.textContent.trim();
            const href = actionLink.getAttribute('href');
            const urlParams = new URLSearchParams(href.split('?')[1]);
            const id = urlParams.get('id');
            softwareList.push({ name, version, id });
        }
    });
    localStorage.setItem('HWSoftwareList', JSON.stringify(softwareList));
    console.log('Updated software list in localStorage:', softwareList);
}

// Function to get software list from localStorage
function getSoftwareList() {
    const stored = localStorage.getItem('HWSoftwareList');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error parsing software list:", e);
            return [];
        }
    }
    return [];
}

// Ensure the software list is updated on /software page load
window.addEventListener('load', addSoftwareIdColumn);

(function() {
    'use strict';

    // --- Insert Toggle Button and Modals in the Sidebar Menu ---
    window.addEventListener('load', () => {
        const menu = document.querySelector('#sidebar ul');
        if (!menu) return;

        // Toggle Auto Hacking Button
        if (!document.getElementById('menu-hw-toggle')) {
            const li = document.createElement('li');
            li.id = 'menu-hw-toggle';
            let isActive = localStorage.getItem("HWAutoHackerActive");
            if (isActive === null) {
                localStorage.setItem("HWAutoHackerActive", "true");
                isActive = "true";
            }
            const buttonText = (isActive === "true") ? "HW Auto Hacking: Stop" : "HW Auto Hacking: Start";
            li.innerHTML = '<a href="#" id="hw-toggle-button"><i class="fa fa-inverse fa-power-off"></i> <span>' + buttonText + '</span></a>';
            menu.appendChild(li);
            document.getElementById('hw-toggle-button').addEventListener('click', (e) => {
                e.preventDefault();
                const current = localStorage.getItem("HWAutoHackerActive") === "true";
                const newState = !current;
                if (!current) {
                    const softwareName = localStorage.getItem("HWSoftwareName");
                    const softwareId = localStorage.getItem("HWSoftwareId");
                    if (!softwareName || !softwareId) {
                        localStorage.setItem('HWShowSoftwareWarning', 'true');
                        window.location.href = "https://hackerwars.io/software";
                        return;
                    }
                }
                localStorage.setItem("HWAutoHackerActive", newState.toString());
                const newText = newState ? "HW Auto Hacking: Stop" : "HW Auto Hacking: Start";
                document.querySelector('#hw-toggle-button span').textContent = newText;
                console.log("HW Auto Hacking toggled. New state:", newState);
                if (newState) {
                    window.location.href = "https://hackerwars.io/list";
                } else {
                    location.reload();
                }
            });
        }

        // Add Skipped IP Button
        if (!document.getElementById('menu-add-skipped-ip')) {
            const addSkippedIPButton = document.createElement('li');
            addSkippedIPButton.id = 'menu-add-skipped-ip';
            addSkippedIPButton.innerHTML = '<a href="#skipped-ip-modal" id="add-skipped-ip-button" data-toggle="modal"><i class="fa fa-ban"></i> <span>Add Skipped IP</span></a>';
            menu.appendChild(addSkippedIPButton);

            if (!document.getElementById('skipped-ip-modal')) {
                const modalHTMLz = `
                    <div id="skipped-ip-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="skipped-ip-modal-label" aria-hidden="true">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 id="skipped-ip-modal-label">Add Skipped IP</h3>
                        </div>
                        <div class="modal-body">
                            <label for="skipped-ip-input">Enter IP:</label>
                            <input type="text" id="skipped-ip-input" placeholder="Enter IP" class="input-block-level" />
                            <hr>
                            <h4>Current Skipped IPs:</h4>
                            <div id="skipped-ip-list"></div>
                        </div>
                        <div class="modal-footer">
                            <button id="save-skipped-ip-btn" class="btn btn-primary">Add</button>
                            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHTMLz);

                function updateSkippedIPList() {
                    const skippedIPs = JSON.parse(localStorage.getItem('HWSkippedIPs')) || [];
                    const listContainer = document.getElementById('skipped-ip-list');
                    listContainer.innerHTML = '';

                    if (skippedIPs.length === 0) {
                        listContainer.innerHTML = '<p>No IPs currently skipped.</p>';
                    } else {
                        skippedIPs.forEach((ip, index) => {
                            const alertDiv = document.createElement('div');
                            alertDiv.className = 'alert alert-block';
                            alertDiv.innerHTML = `
                                <button type="button" class="close" data-ip="${ip}" data-index="${index}">×</button>
                                <p>${ip}</p>
                            `;
                            listContainer.appendChild(alertDiv);
                        });
                    }

                    document.querySelectorAll('#skipped-ip-list .close').forEach(button => {
                        button.addEventListener('click', () => {
                            const ipToRemove = button.getAttribute('data-ip');
                            let skippedIPs = JSON.parse(localStorage.getItem('HWSkippedIPs')) || [];
                            skippedIPs = skippedIPs.filter(ip => ip !== ipToRemove);
                            localStorage.setItem('HWSkippedIPs', JSON.stringify(skippedIPs));
                            console.log(`Removed IP: ${ipToRemove}`);
                            updateSkippedIPList();
                        });
                    });
                }

                $('#skipped-ip-modal').on('shown', function() {
                    updateSkippedIPList();
                });

                document.getElementById('save-skipped-ip-btn').addEventListener('click', () => {
                    const ipInput = document.getElementById('skipped-ip-input').value.trim();
                    if (ipInput) {
                        let skippedIPs = JSON.parse(localStorage.getItem('HWSkippedIPs')) || [];
                        if (!skippedIPs.includes(ipInput)) {
                            skippedIPs.push(ipInput);
                            localStorage.setItem('HWSkippedIPs', JSON.stringify(skippedIPs));
                            console.log('Added IP to skipped list:', ipInput);
                            document.getElementById('skipped-ip-input').value = '';
                            updateSkippedIPList();
                        } else {
                            alert('IP is already in skipped list.');
                        }
                    } else {
                        alert('Please enter a valid IP address.');
                    }
                });
            }
        }

        // Software Configuration Button
        if (!document.getElementById('menu-software-config')) {
            const softwareConfigButton = document.createElement('li');
            softwareConfigButton.id = 'menu-software-config';
            softwareConfigButton.innerHTML = '<a href="#software-config-modal" id="software-config-button" data-toggle="modal"><i class="fa fa-cogs"></i> <span>Set Software</span></a>';
            menu.appendChild(softwareConfigButton);

            if (!document.getElementById('software-config-modal')) {
                const modalHTML = `
                    <div id="software-config-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="software-config-modal-label" aria-hidden="true">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 id="software-config-modal-label">Set Software Name</h3>
                        </div>
                        <div class="modal-body">
                            <label for="software-select">Select Software:</label>
                            <select id="software-select" class="input-block-level">
                                <option value="">Clear Software</option>
                            </select>
                            <p>Open this at <a href="/software"><i style="color: #000;" class="fa fa-inverse fa-folder-open"></i> Software</a> if the list is empty.</p>
                        </div>
                        <div class="modal-footer">
                            <button id="save-software-btn" class="btn btn-primary">Save</button>
                            <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHTML);

                $('#software-config-modal').on('shown', function() {
                    const softwareList = getSoftwareList();
                    const select = document.getElementById('software-select');
                    select.innerHTML = '<option value="">Clear Software</option>';
                    softwareList.forEach(software => {
                        const option = document.createElement('option');
                        option.value = `${software.name}|${software.id}`;
                        option.textContent = `${software.name} (v${software.version})`;
                        select.appendChild(option);
                    });

                    const currentName = localStorage.getItem('HWSoftwareName') || '';
                    const currentId = localStorage.getItem('HWSoftwareId') || '';
                    if (currentName && currentId) {
                        select.value = `${currentName}|${currentId}`;
                    } else {
                        select.value = '';
                    }
                });

                document.getElementById('save-software-btn').addEventListener('click', () => {
                    const select = document.getElementById('software-select');
                    const selectedValue = select.value;
                    let softwareName = '';
                    let softwareId = '';
                    if (selectedValue) {
                        [softwareName, softwareId] = selectedValue.split('|');
                    }
                    localStorage.setItem('HWSoftwareName', softwareName);
                    localStorage.setItem('HWSoftwareId', softwareId);
                    alert('Software updated!' + (softwareName === '' && softwareId === '' ? ' (Cleared)' : ''));
                    console.log(`Software Name: ${softwareName}, Software ID: ${softwareId}`);
                    $('#software-config-modal').modal('hide');
                });
            }
        }

// Sniffed IPs Button
if (!document.getElementById('menu-sniffed-ips')) {
    const sniffedIPsButton = document.createElement('li');
    sniffedIPsButton.id = 'menu-sniffed-ips';
    sniffedIPsButton.innerHTML = '<a href="#sniffed-ips-modal" id="sniffed-ips-button" data-toggle="modal"><i class="fa fa-network-wired"></i> <span>Sniffed IPs</span></a>';
    menu.appendChild(sniffedIPsButton);

    if (!document.getElementById('sniffed-ips-modal')) {
        const sniffedModalHTML = `
            <div id="sniffed-ips-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="sniffed-ips-modal-label" aria-hidden="true">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="sniffed-ips-modal-label">Sniffed IP Addresses</h3>
                </div>
                <div class="modal-body">
                    <p>IP addresses parsed from logs (excluding your own IP):</p>
                    <div id="sniffed-ips-list"></div>
                </div>
                <div class="modal-footer">
                    <button id="save-sniffed-ips-btn" class="btn btn-primary">Save to TXT</button>
                    <button id="clear-sniffed-ips-btn" class="btn btn-danger">Clear List</button>
                    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', sniffedModalHTML);

        function updateSniffedIPsList() {
            const sniffedIPs = JSON.parse(localStorage.getItem('HWAutoHackingSniffedIPs')) || [];
            const listContainer = document.getElementById('sniffed-ips-list');
            listContainer.innerHTML = '';

            if (sniffedIPs.length === 0) {
                listContainer.innerHTML = '<p>No sniffed IPs recorded yet.</p>';
            } else {
                // Sort IPs numerically
                sniffedIPs.sort((a, b) => {
                    const aOctets = a.split('.').map(Number);
                    const bOctets = b.split('.').map(Number);
                    for (let i = 0; i < 4; i++) {
                        if (aOctets[i] !== bOctets[i]) {
                            return aOctets[i] - bOctets[i];
                        }
                    }
                    return 0;
                });

                // Display sorted IPs
                sniffedIPs.forEach((ip, index) => {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-block';
                    alertDiv.innerHTML = `
                        <button type="button" class="close" data-ip="${ip}" data-index="${index}">×</button>
                        <p>${ip}</p>
                    `;
                    listContainer.appendChild(alertDiv);
                });
            }

            // Event listeners for delete buttons
            document.querySelectorAll('#sniffed-ips-list .close').forEach(button => {
                button.addEventListener('click', () => {
                    const ipToRemove = button.getAttribute('data-ip');
                    let sniffedIPs = JSON.parse(localStorage.getItem('HWAutoHackingSniffedIPs')) || [];
                    sniffedIPs = sniffedIPs.filter(ip => ip !== ipToRemove);
                    localStorage.setItem('HWAutoHackingSniffedIPs', JSON.stringify(sniffedIPs));
                    console.log(`Removed sniffed IP: ${ipToRemove}`);
                    updateSniffedIPsList();
                });
            });
        }

        // Save to TXT function
        function saveSniffedIPsToTxt() {
            const sniffedIPs = JSON.parse(localStorage.getItem('HWAutoHackingSniffedIPs')) || [];
            if (sniffedIPs.length === 0) {
                console.log('No IPs to save to TXT.');
                return;
            }

            // Create text content with one IP per line
            const textContent = sniffedIPs.join('\n');
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sniffed_ips.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('Saved sniffed IPs to sniffed_ips.txt');
        }

        $('#sniffed-ips-modal').on('shown', function() {
            updateSniffedIPsList();
        });

        document.getElementById('clear-sniffed-ips-btn').addEventListener('click', () => {
            localStorage.setItem('HWAutoHackingSniffedIPs', JSON.stringify([]));
            console.log('Cleared all sniffed IPs.');
            updateSniffedIPsList();
        });

        // Add event listener for the Save to TXT button
        document.getElementById('save-sniffed-ips-btn').addEventListener('click', () => {
            saveSniffedIPsToTxt();
        });
    }
}

        // About Button
        if (!document.getElementById('menu-about')) {
            const aboutButton = document.createElement('li');
            aboutButton.id = 'menu-about';
            aboutButton.innerHTML = '<a href="#about-modal" id="about-button" data-toggle="modal"><i class="fa fa-info-circle"></i> <span>About</span></a>';
            menu.appendChild(aboutButton);

            if (!document.getElementById('about-modal')) {
                const aboutModalHTML = `
<div id="about-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="about-modal-label" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3 id="about-modal-label">About HW Auto Hacking</h3>
    </div>
    <div class="modal-body">
        <p><strong>Developed By:</strong></p>
        <p>Hi, I’m GingerDev! I’m a Hacker Wars player just like you, and I made this script to make hacking easier and more fun. It’s designed to handle the repetitive stuff—scanning, hacking, and software setup—so you can focus on strategy. Got ideas to make it better? Let me know—I’d love to keep improving it for us all!</p>
        <p><strong>Usage:</strong></p>
        <p>This script automates hacking tasks in Hacker Wars to save you time. Here’s how to use it step-by-step:</p>
        <ol>
            <li><strong>Set Up Your Software:</strong> Click "Set Software" in the sidebar. Pick a software from the dropdown and hit "Save."</li>
            <li><strong>Start Hacking:</strong> Click "HW Auto Hacking: Start" in the sidebar. The script will scan the IP list in <a href="/list">Hacked Database</a> for targets—IPs with no virus or ones not running your chosen software.</li>
            <li><strong>Let It Run:</strong> It hacks targets with brute-force (so make sure you have a cracker installed), uploads your software, installs it, clears logs to hide your tracks, and logs out automatically.</li>
            <li><strong>Skip Unwanted IPs:</strong> Use "Add Skipped IP" in the sidebar to skip specific IPs. If your cracker isn’t strong enough, the script skips those IPs and adds them to the list.</li>
            <li><strong>Sniff IPs:</strong> Check "Sniffed IPs" in the sidebar to see IPs parsed from logs (excluding your own).</li>
            <li><strong>End of List:</strong> When it hits the last page with no targets, a pop-up asks if you want to restart from page 1 or stop. Choose "Restart" to keep going or "Stop" to pause.</li>
            <li><strong>Pause Anytime:</strong> Toggle "HW Auto Hacking: Stop" in the sidebar to pause the script whenever you want.</li>
        </ol>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    </div>
</div>
                `;
                document.body.insertAdjacentHTML('beforeend', aboutModalHTML);
            }
        }

                // Software Warning Modal (for missing name/ID)
        if (!document.getElementById('software-warning-modal')) {
            const warningModalHTML = `
                <div id="software-warning-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="software-warning-modal-label" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="software-warning-modal-label">Software Configuration Required</h3>
                    </div>
                    <div class="modal-body">
                        <p>Please set Software Name before starting automation. Use 'Set Software' in the sidebar.</p>
                    </div>
                    <div class="modal-footer">
                        <button id="software-warning-ok-btn" class="btn btn-primary">OK</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', warningModalHTML);

            document.getElementById('software-warning-ok-btn').addEventListener('click', () => {
                $('#software-warning-modal').modal('hide');
            });
        }

        // Disk Space Warning Modal
        if (!document.getElementById('disk-space-warning-modal')) {
            const diskSpaceModalHTML = `
                <div id="disk-space-warning-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="disk-space-warning-modal-label" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="disk-space-warning-modal-label">Insufficient Disk Space</h3>
                    </div>
                    <div class="modal-body">
                        <p>Not enough disk space to download the software. This IP will be added to the skipped list.</p>
                    </div>
                    <div class="modal-footer">
                        <button id="disk-space-ok-btn" class="btn btn-primary">OK</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', diskSpaceModalHTML);

            document.getElementById('disk-space-ok-btn').addEventListener('click', () => {
                $('#disk-space-warning-modal').modal('hide');
                const targetIP = localStorage.getItem("HWTargetIP");
                if (targetIP) {
                    addProcessedIP(targetIP);
                    console.log(`Marked ${targetIP} as processed due to disk space error.`);
                    addSkippedIP(targetIP);
                    console.log(`Added ${targetIP} to skipped IPs due to disk space error.`);
                }
                localStorage.setItem("HWAutoHackerStep", "done");
                window.location.href = "https://hackerwars.io/internet?view=logout";
            });
        }

        // Virus Type Already Installed Modal
        if (!document.getElementById('virus-type-warning-modal')) {
            const virusTypeModalHTML = `
                <div id="virus-type-warning-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="virus-type-warning-modal-label" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="virus-type-warning-modal-label">Virus Already Installed</h3>
                    </div>
                    <div class="modal-body">
                        <p>The virus type is already installed on this computer. This IP will be marked as processed and skipped in future runs.</p>
                    </div>
                    <div class="modal-footer">
                        <button id="virus-type-ok-btn" class="btn btn-primary">OK</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', virusTypeModalHTML);

            document.getElementById('virus-type-ok-btn').addEventListener('click', () => {
                $('#virus-type-warning-modal').modal('hide');
                const targetIP = localStorage.getItem("HWTargetIP");
                if (targetIP) {
                    addProcessedIP(targetIP);
                    console.log(`Marked ${targetIP} as processed due to virus type already installed.`);
                }
                localStorage.setItem("HWAutoHackerStep", "done");
                window.location.href = "https://hackerwars.io/internet?view=logout";
            });
        }

        // Last Page Modal
        if (!document.getElementById('last-page-modal')) {
            const lastPageModalHTML = `
                <div id="last-page-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="last-page-modal-label" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="last-page-modal-label">End of IP List Reached</h3>
                    </div>
                    <div class="modal-body">
                        <p>You've reached the last page of the IP list with no suitable targets found. Would you like to restart from the beginning or stop the automation?</p>
                    </div>
                    <div class="modal-footer">
                        <button id="last-page-restart-btn" class="btn btn-primary">Restart</button>
                        <button id="last-page-stop-btn" class="btn">Stop</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lastPageModalHTML);

            $('#last-page-modal').on('shown', function() {
                clearProcessedIPs();
                console.log("HWProcessedIPs cleared on reaching last page modal.");
            });

            document.getElementById('last-page-restart-btn').addEventListener('click', () => {
                $('#last-page-modal').modal('hide');
                localStorage.setItem("HWAutoHackerActive", "true");
                localStorage.removeItem("HWShowLastPageModal");
                console.log("User chose to restart; HWAutoHackerActive set to true, redirecting to /list.");
                window.location.href = "https://hackerwars.io/list";
            });

            document.getElementById('last-page-stop-btn').addEventListener('click', () => {
                $('#last-page-modal').modal('hide');
                localStorage.setItem("HWAutoHackerActive", "false");
                localStorage.removeItem("HWShowLastPageModal");
                console.log("User chose to stop; HWAutoHackerActive confirmed as false.");
                window.location.href = "https://hackerwars.io/list";
            });
        }

        // Log Successfully Edited Modal
        if (!document.getElementById('log-edited-success-modal')) {
            const logEditedModalHTML = `
                <div id="log-edited-success-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="log-edited-success-modal-label" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="log-edited-success-modal-label">Logs Edited</h3>
                    </div>
                    <div class="modal-body">
                        <p>Success! Log successfully cleared.</p>
                    </div>
                    <div class="modal-footer">
                        <button id="log-edited-ok-btn" class="btn btn-primary">OK</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', logEditedModalHTML);

            document.getElementById('log-edited-ok-btn').addEventListener('click', () => {
                $('#log-edited-success-modal').modal('hide');
            });
        }

        // Check for last page modal trigger on load
        if (localStorage.getItem('HWShowLastPageModal') === 'true' && window.location.pathname === "/list") {
            $('#last-page-modal').modal('show');
        }

        // Check for software warning modal after redirect
        if (localStorage.getItem('HWShowSoftwareWarning') === 'true' && window.location.href === 'https://hackerwars.io/software') {
            $('#software-warning-modal').modal('show');
            localStorage.removeItem('HWShowSoftwareWarning');
        }
    });

        // --- Check if Automation is Paused ---
    function isScriptRunning() {
        const isActive = localStorage.getItem("HWAutoHackerActive") === "true";
        console.log(`HW Auto Hacking is ${isActive ? 'running' : 'paused'}.`);
        return isActive;
    }

    if (!isScriptRunning()) {
        console.log("HW Auto Hacking is paused. To resume, click the toggle button in the sidebar.");
        localStorage.removeItem("HWTargetIP");
        localStorage.removeItem("HWAutoHackerStep");
    } else {
        console.log("HW Auto Hacking Script Loaded and Active.");
    }

    // --- Force redirect from logout page ---
    if (window.location.href.includes("view=logout")) {
        console.log("On logout page. Waiting before redirecting to /list.");
        setTimeout(() => {
            localStorage.setItem("HWAutoHackerStep", "start");
            window.location.href = "https://hackerwars.io/list";
        }, 500);
        return;
    }

    // --- Auto-Login Check ---
    if (document.body.textContent.includes("Error! This IP is already on your hacked database.")) {
        console.log("Detected hacked IP error. Attempting auto-login.");
        const loginButton = document.querySelector('input[type="submit"].btn.btn-inverse[value="Login"]');
        if (loginButton) {
            loginButton.click();
        }
        return;
    }

    // --- Helper Functions ---
    function getMyIP() {
        const ipElement = document.querySelector('.header-ip-show');
        const ip = ipElement ? ipElement.textContent.trim() : "";
        console.log("My IP is:", ip);
        return ip;
    }

    function isInternetLogsPage() {
        const url = window.location.href;
        return url.includes("view=logs") || window.location.pathname === "/internet";
    }

    function isLogsPage() {
        return window.location.pathname === "/log";
    }

    function clearLogsIfNeeded(callback) {
        const logArea = document.querySelector('textarea.logarea');
        const myip = getMyIP();
        if (logArea && logArea.value.trim() !== "" && logArea.value.includes(myip)) {
            console.log("Log area contains your IP; clearing logs...");
            logArea.value = "";
            const editBtn = document.querySelector('input[type="submit"][value="Edit log file"]');
            if (editBtn) {
                editBtn.click();
                setTimeout(() => {
                    console.log("Logs cleared.");
                    callback();
                }, 500);
                return;
            } else {
                console.log("Edit log file button not found.");
            }
        }
        callback();
    }

    function clearLogsUnconditionally() {
        const isTargetPage = isLogsPage() || (window.location.href.includes("internet?view=logs") && !isScriptRunning());
        if (isTargetPage) {
            const logArea = document.querySelector('textarea.logarea');
            const editBtn = document.querySelector('input[type="submit"][value="Edit log file"]');
            if (logArea && editBtn && logArea.value.trim() !== "") {
                console.log(`On ${isLogsPage() ? '/logs' : 'internet?view=logs'} page with non-empty textarea; clearing logs...`);
                logArea.value = "";
                editBtn.click();
                setTimeout(() => {
                    const bodyText = document.body.textContent;
                    if (bodyText.includes("Success! Log successfully edited.")) {
                        console.log(`Detected 'Success! Log successfully edited.' on ${isLogsPage() ? '/logs' : 'internet?view=logs'}; showing modal.`);
                        $('#log-edited-success-modal').modal('show');
                    }
                }, 500);
            } else if (!logArea || !editBtn) {
                console.log(`Log area or edit button not found on ${isLogsPage() ? '/logs' : 'internet?view=logs'} page.`);
            } else {
                console.log(`Textarea is empty on ${isLogsPage() ? '/logs' : 'internet?view=logs'}; no action taken.`);
                const bodyText = document.body.textContent;
                if (bodyText.includes("Success! Log successfully edited.")) {
                    console.log(`Detected 'Success! Log successfully edited.' on ${isLogsPage() ? '/logs' : 'internet?view=logs'}; showing modal.`);
                    $('#log-edited-success-modal').modal('show');
                }
            }
        }
    }

function parseAndSaveIPsFromLogs() {
    const logArea = document.querySelector('textarea.logarea');
    // Get the IP from the header-ip-show span within header-ip div
    const headerIP = document.querySelector('.header-ip .header-ip-show')?.textContent.trim() || "";

    if (!logArea || !logArea.value.trim()) {
        console.log("No log area or logs are empty; no IPs to parse.");
        return;
    }

    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    const logText = logArea.value;
    const foundIPs = [...logText.matchAll(ipRegex)].map(match => match[0]);

    if (foundIPs.length === 0) {
        console.log("No IP addresses found in logs.");
        return;
    }

    let sniffedIPs = JSON.parse(localStorage.getItem('HWAutoHackingSniffedIPs')) || [];
    // Filter out the header IP explicitly along with already saved IPs
    const newIPs = foundIPs.filter(ip => ip !== headerIP && !sniffedIPs.includes(ip));

    if (newIPs.length > 0) {
        sniffedIPs = [...new Set([...sniffedIPs, ...newIPs])];
        localStorage.setItem('HWAutoHackingSniffedIPs', JSON.stringify(sniffedIPs));
        console.log(`Parsed and saved ${newIPs.length} new IPs from logs:`, newIPs);
    } else {
        console.log("No new IPs to save (all found IPs are either header IP or already saved).");
    }
}

    function getSoftwareInstallId() {
        const softwareName = localStorage.getItem("HWSoftwareName");
        if (!softwareName) {
            console.error("Software name not found in localStorage.");
            return null;
        }
        const rows = document.querySelectorAll("tr[id]");
        for (let row of rows) {
            if (row.textContent.includes(softwareName)) {
                console.log("Found installation row:", row);
                return row.id;
            }
        }
        console.log("Installation ID not found.");
        return null;
    }

    function getSkippedIPs() {
        const stored = localStorage.getItem("HWSkippedIPs");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing skipped IPs:", e);
                return [];
            }
        }
        return [];
    }

    function addSkippedIP(ip) {
        const skipped = getSkippedIPs();
        if (!skipped.includes(ip)) {
            skipped.push(ip);
            localStorage.setItem("HWSkippedIPs", JSON.stringify(skipped));
            console.log("Added skipped IP:", ip, "New list:", skipped);
        } else {
            console.log("IP already in skipped list:", ip);
        }
    }

    function getProcessedIPs() {
        const stored = localStorage.getItem("HWProcessedIPs");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing processed IPs:", e);
                return [];
            }
        }
        return [];
    }

    function addProcessedIP(ip) {
        const processed = getProcessedIPs();
        if (!processed.includes(ip)) {
            processed.push(ip);
            localStorage.setItem("HWProcessedIPs", JSON.stringify(processed));
            console.log("Added processed IP:", ip, "New list:", processed);
        } else {
            console.log("IP already in processed list:", ip);
        }
    }

    function clearProcessedIPs() {
        localStorage.removeItem("HWProcessedIPs");
        console.log("Cleared HWProcessedIPs.");
    }

    // --- Call parseAndSaveIPsFromLogs and clearLogsUnconditionally ---
    parseAndSaveIPsFromLogs();
    clearLogsUnconditionally();

        // --- Stop here if script is not running ---
    if (!isScriptRunning()) {
        return;
    }

    // --- State Management ---
    let step = localStorage.getItem("HWAutoHackerStep") || "start";
    console.log("Current step:", step);

    // --- Global Error Check on /internet ---
    if (window.location.href === "https://hackerwars.io/internet") {
        const bodyText = document.body.textContent;
        if (step === "hacking" && bodyText.includes("Error! Access denied: your cracker is not good enough.")) {
            console.log("Cracker error detected on /internet page.");
            const targetIP = localStorage.getItem("HWTargetIP");
            if (targetIP) {
                addProcessedIP(targetIP);
                console.log(`Marked ${targetIP} as processed due to cracker error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logs";
            return;
        } else if (step === "uploadSoftware" && bodyText.includes("Error! The remote client already have this software.")) {
            console.log("Software already uploaded on /internet; moving to install.");
            localStorage.setItem("HWAutoHackerStep", "installSoftware");
            window.location.href = "https://hackerwars.io/internet?view=software";
            return;
        }
    }

    // --- Main Logic ---

    // 1. On /list: scan for an IP where the virus is not HWSoftwareName or is "No running virus".
    if (window.location.pathname === "/list" && step === "start") {
        const currentUrl = window.location.href;
        const pagination = document.querySelector(".pagination.alternate ul");
        if (!pagination) {
            console.log("Pagination not found!");
            return;
        }

        console.log("Scanning /list for vulnerable IPs (not running HWSoftwareName or no virus).");
        const skipped = getSkippedIPs();
        const processed = getProcessedIPs();
        const softwareName = localStorage.getItem("HWSoftwareName") || "";
        console.log("Currently skipped IPs:", skipped, "Processed IPs:", processed, "Target Software Name:", softwareName);
        const listItems = document.querySelectorAll("ul#list li");
        let targetIP = null;

        for (let li of listItems) {
            const ipSpan = li.querySelector("#ip");
            if (!ipSpan) continue;
            const candidate = ipSpan.textContent.trim();

            if (skipped.includes(candidate)) {
                console.log(`Skipping IP ${candidate} (in HWSkippedIPs)`);
                continue;
            }
            if (processed.includes(candidate)) {
                console.log(`Skipping IP ${candidate} (in HWProcessedIPs)`);
                continue;
            }

            const virusDiv = li.querySelector(".list-virus");
            if (virusDiv) {
                const virusText = virusDiv.textContent.trim();
                if (virusText === "No running virus" || (softwareName && virusText !== softwareName)) {
                    targetIP = candidate;
                    console.log(`Selected IP ${targetIP} (Virus: ${virusText})`);
                    break;
                } else {
                    console.log(`IP ${candidate} excluded (running ${softwareName})`);
                }
            }
        }

        if (targetIP) {
            console.log("Target IP selected:", targetIP);
            localStorage.setItem("HWAutoHackerStep", "hacking");
            localStorage.setItem("HWTargetIP", targetIP);
            window.location.href = "https://hackerwars.io/internet?ip=" + targetIP + "&action=hack&method=bf";
            return;
        } else {
            console.log("No suitable vulnerable IP found on current page.");
            let nextUrl = null;
            const paginationLinks = document.querySelectorAll('.pagination.alternate ul li');
            let isLastPage = false;
            paginationLinks.forEach(li => {
                if (li.textContent.trim() === "Next") {
                    if (li.classList.contains('disabled')) {
                        isLastPage = true;
                    } else {
                        nextUrl = li.querySelector('a').getAttribute('href');
                    }
                }
            });

            if (nextUrl) {
                if (nextUrl.startsWith("?")) {
                    nextUrl = "https://hackerwars.io/list" + nextUrl;
                }
                console.log("Redirecting to next page:", nextUrl);
                window.location.href = nextUrl;
            } else if (isLastPage) {
                console.log("On last page with no IPs; setting flag to show modal.");
                localStorage.setItem("HWAutoHackerActive", "false");
                localStorage.setItem("HWShowLastPageModal", "true");
            } else {
                console.log("No 'Next' link found and not on last page; redirecting to /list.");
                window.location.href = "https://hackerwars.io/list";
            }
        }
        return;
    }

    // 2. On the target IP hack page using brute-force method.
    if (window.location.href.includes("internet?action=hack&method=bf") && step === "hacking") {
        console.log("On hack page (brute-force method). Waiting 1 second for error or success message...");
        setTimeout(() => {
            if (document.body.textContent.includes("Error! Access denied: your cracker is not good enough.")) {
                console.log("Cracker error detected on hack page.");
                const targetIP = localStorage.getItem("HWTargetIP");
                if (targetIP) {
                    addProcessedIP(targetIP);
                    console.log(`Marked ${targetIP} as processed due to cracker error.`);
                }
                localStorage.setItem("HWAutoHackerStep", "done");
                window.location.href = "https://hackerwars.io/internet?view=logs";
                return;
            } else if (
                document.body.textContent.includes("Success! Successfully cracked") &&
                document.body.textContent.includes("Password is")
            ) {
                console.log("Success message detected on hack page; redirecting to login page.");
                window.location.href = "https://hackerwars.io/internet?action=login";
                return;
            } else {
                console.log("No cracker error or success message detected; continuing hack.");
                window.location.href = "https://hackerwars.io/internet?view=logs";
                return;
            }
        }, 1000);
        return;
    }

    // 3. On hack page using other methods.
    if (window.location.href.includes("internet?action=hack") && step === "hacking") {
        console.log("On hack page (non-brute-force).");
        setTimeout(() => {
            window.location.href = "https://hackerwars.io/internet?view=logs";
        }, 500);
        return;
    }

    // 4. On logs page after hacking: clear logs then check software table before uploading.
    if (isInternetLogsPage() && step === "hacking") {
        const softwareId = localStorage.getItem("HWSoftwareId");
        const softwareName = localStorage.getItem("HWSoftwareName");
        console.log("On internet logs page post-hack.");
        parseAndSaveIPsFromLogs(); // Parse IPs before clearing logs
        clearLogsIfNeeded(() => {
            if (softwareId && softwareName) {
                localStorage.setItem("HWAutoHackerStep", "checkSoftware");
                setTimeout(() => {
                    window.location.href = "https://hackerwars.io/internet?view=software";
                }, 500);
            } else {
                console.error("Software ID or Name not found in localStorage. Cannot proceed.");
            }
        });
        return;
    }

// 4.5. On software page: check if HWSoftwareName with specific extension is already installed.
if (window.location.href.includes("view=software") && step === "checkSoftware") {
    console.log("Checking if software with specific extension is already installed on target system.");
    const softwareName = localStorage.getItem("HWSoftwareName"); // e.g., "Name.vwarez"
    const targetIP = localStorage.getItem("HWTargetIP");

    // Extract the extension from softwareName (e.g., ".vwarez")
    const extension = softwareName.substring(softwareName.lastIndexOf(".")); // Gets ".vwarez"
    console.log(`Looking for software with extension: ${extension}`);

    const rows = document.querySelectorAll("table.table-software tbody tr");
    let softwareFound = false;

    for (let row of rows) {
        const nameCell = row.querySelector("td:nth-child(2) b");
        if (nameCell && nameCell.textContent.trim().endsWith(extension)) {
            softwareFound = true;
            break;
        }
    }

    if (softwareFound) {
        console.log(`Software with extension ${extension} already installed on ${targetIP}.`);
        if (targetIP) {
            addProcessedIP(targetIP);
            console.log(`Marked ${targetIP} as processed since software with extension ${extension} is already installed.`);
        }
        localStorage.setItem("HWAutoHackerStep", "done");
        window.location.href = "https://hackerwars.io/internet?view=logout";
    } else {
        console.log(`Software with extension ${extension} not found; proceeding to upload.`);
        localStorage.setItem("HWAutoHackerStep", "uploadSoftware");
        const softwareId = localStorage.getItem("HWSoftwareId");
        window.location.href = `https://hackerwars.io/internet?view=software&cmd=up&id=${softwareId}`;
    }
    return;
}

        // 5. On software upload page: wait for confirmation or check for disk space error.
if (window.location.href.includes("view=software") && step === "uploadSoftware") {
    console.log("On software upload page; awaiting confirmation or checking for errors.");
    const targetIP = localStorage.getItem("HWTargetIP");
    const maxWaitTime = 1000; // 5 seconds max wait
    let elapsed = 0;

    const observer = new MutationObserver((mutations, obs) => {
        const bodyText = document.body.textContent;
        if (bodyText.includes("Success! Software successfully uploaded.")) {
            console.log("Upload confirmed.");
            obs.disconnect();
            localStorage.setItem("HWAutoHackerStep", "afterUpload");
            window.location.href = "https://hackerwars.io/internet?view=logs";
        } else if (bodyText.includes("Error! You do not have enough disk space to download this software.")) {
            console.log("Disk space error detected during upload.");
            obs.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                addSkippedIP(targetIP);
                console.log(`Marked ${targetIP} as processed and skipped due to disk space error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        } else if (bodyText.includes("Error! The remote client already have this software.")) {
            console.log("Software already uploaded detected late; moving to install.");
            obs.disconnect();
            localStorage.setItem("HWAutoHackerStep", "installSoftware");
            window.location.href = "https://hackerwars.io/internet?view=software";
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});

    const checkInterval = setInterval(() => {
        elapsed += 500;
        const bodyText = document.body.textContent;
        if (bodyText.includes("Error! You do not have enough disk space to download this software.")) {
            console.log("Disk space error detected via interval during upload.");
            clearInterval(checkInterval);
            observer.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                addSkippedIP(targetIP);
                console.log(`Marked ${targetIP} as processed and skipped due to disk space error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        } else if (elapsed >= maxWaitTime) {
            console.log("Max wait time exceeded during upload; assuming failure and proceeding.");
            clearInterval(checkInterval);
            observer.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                console.log(`Marked ${targetIP} as processed due to timeout.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        }
    }, 500);

    return;
}

    // 6. On logs page after upload: clear logs then proceed to install software.
    if (isInternetLogsPage() && step === "afterUpload") {
        console.log("On internet logs page post-upload; clearing logs.");
        parseAndSaveIPsFromLogs(); // Parse IPs before clearing logs
        clearLogsIfNeeded(() => {
            localStorage.setItem("HWAutoHackerStep", "installSoftware");
            setTimeout(() => {
                window.location.href = "https://hackerwars.io/internet?view=software";
            }, 500);
        });
        return;
    }

    // 7. On software page: extract installation ID and install.
    if (window.location.href.includes("view=software") && step === "installSoftware") {
        console.log("On software page; extracting installation ID.");
        clearLogsIfNeeded(() => {
            const installId = getSoftwareInstallId();
            if (installId) {
                localStorage.setItem("HWAutoHackerStep", "installSoftware_done");
                window.location.href = "https://hackerwars.io/internet?view=software&cmd=install&id=" + installId;
            } else {
                console.log("Installation ID not found; retrying.");
                setTimeout(() => { window.location.reload(); }, 500);
            }
        });
        return;
    }

    // 8. On software page after install: wait for confirmation, check for errors.
if (window.location.href.includes("view=software") && step === "installSoftware_done") {
    console.log("Awaiting installation confirmation, virus removal, or checking for errors.");
    const targetIP = localStorage.getItem("HWTargetIP");
    const maxWaitTime = 1000; // 5 seconds max wait
    let elapsed = 0;

    const observer2 = new MutationObserver((mutations, obs) => {
        const bodyText = document.body.textContent;
        if (bodyText.includes("Software installed") || bodyText.includes("Error! This software does not exists.")) {
            console.log("Installation confirmed:", bodyText);
            obs.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                console.log(`Marked ${targetIP} as processed after installation or error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logs";
        } else if (bodyText.match(/Success! \d+ viruses removed/)) {
            console.log("Virus removal success detected:", bodyText);
            obs.disconnect();
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logs";
        } else if (bodyText.includes("Error! You do not have enough disk space to download this software.")) {
            console.log("Disk space error detected during install.");
            obs.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                addSkippedIP(targetIP);
                console.log(`Marked ${targetIP} as processed and skipped due to disk space error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        } else if (bodyText.includes("Error! You already have installed a virus of this type on this computer.")) {
            console.log("Virus type already installed error detected.");
            obs.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                console.log(`Marked ${targetIP} as processed due to virus type error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        }
    });
    observer2.observe(document.body, {childList: true, subtree: true});

    const checkInterval = setInterval(() => {
        elapsed += 500;
        const bodyText = document.body.textContent;
        if (bodyText.includes("Error! You do not have enough disk space to download this software.")) {
            console.log("Disk space error detected via interval during install.");
            clearInterval(checkInterval);
            observer2.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                addSkippedIP(targetIP);
                console.log(`Marked ${targetIP} as processed and skipped due to disk space error.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        } else if (elapsed >= maxWaitTime) {
            console.log("Max wait time exceeded during install; assuming failure and proceeding.");
            clearInterval(checkInterval);
            observer2.disconnect();
            if (targetIP) {
                addProcessedIP(targetIP);
                console.log(`Marked ${targetIP} as processed due to timeout.`);
            }
            localStorage.setItem("HWAutoHackerStep", "done");
            window.location.href = "https://hackerwars.io/internet?view=logout";
        }
    }, 500);

    return;
}

    // 9. On logs page after installation: clear logs, logout, and restart.
    if (isInternetLogsPage() && step === "done") {
        console.log("Final internet logs page; clearing logs and logging out.");
        parseAndSaveIPsFromLogs(); // Parse IPs before clearing logs
        clearLogsIfNeeded(() => {
            const targetIP = localStorage.getItem("HWTargetIP");
            if (targetIP) {
                addProcessedIP(targetIP);
                console.log(`Marked ${targetIP} as processed after successful installation.`);
            }
            window.location.href = "https://hackerwars.io/internet?view=logout";
            setTimeout(() => {
                localStorage.setItem("HWAutoHackerStep", "start");
                window.location.href = "https://hackerwars.io/list";
            }, 500);
        });
        return;
    }
})();