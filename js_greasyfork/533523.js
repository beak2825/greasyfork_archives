// ==UserScript==
// @name         ReNXEnhanced
// @namespace    https://github.com/origamiofficial/ReNXEnhanced
// @version      1.1
// @description  A lightweight Tampermonkey script for importing and exporting NextDNS configuration profiles
// @author       OrigamiOfficial
// @match        https://my.nextdns.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533523/ReNXEnhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/533523/ReNXEnhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for better UX
    const style = document.createElement("style");
    style.innerHTML = `
        .list-group-item:hover .btn { visibility: visible !important; }
        .tooltipParent:hover .customTooltip { opacity: 1 !important; visibility: visible !important; }
        .tooltipParent .customTooltip:hover { opacity: 0 !important; visibility: hidden !important; }
        div:hover #counters { visibility: hidden !important; }
        .list-group-item:hover input.description, input.description:focus { display: initial !important;}
        .Logs .row > * { width: auto; }
    `;
    document.head.appendChild(style);

    // Internal functions
    function makeApiRequest(method, path, body) {
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, "https://api.nextdns.io/profiles/" + location.href.split("/")[3] + "/" + path, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300)
                        resolve(xhr.responseText);
                    else
                        reject(xhr.responseText);
                }
            };
            xhr.send(body ? JSON.stringify(body) : null);
        });
    }

    function allowDenyDomain(btn, listName) {
        const domain = btn.parentElement.parentElement.querySelector("a").innerHTML;
        const description = ReNXsettings.logsDomainDescriptions[domain] || "";
        makeApiRequest("POST", listName, { id: domain, description: description }).then(function() {
            btn.parentElement.parentElement.style.display = "none";
        });
    }

    function hideLogEntry(btn) {
        btn.parentElement.parentElement.style.display = "none";
    }

    function exportToFile(obj, fileName) {
        const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
        const a = document.createElement("a");
        a.setAttribute("href", data);
        a.setAttribute("download", fileName);
        a.click();
    }

    function createSpinner(btn) {
        const spinner = document.createElement("span");
        spinner.className = "spinner-border spinner-border-sm";
        spinner.style = "margin-left: 5px;";
        btn.appendChild(spinner);
    }

    function createPleaseWaitModal(text) {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style = "display: block; background: rgba(0,0,0,0.5);";
        modal.innerHTML = `<div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-body" style="text-align: center;">
                                    <span class="spinner-border spinner-border-sm" style="margin-right: 10px;"></span>
                                    ${text}...
                                </div>
                            </div>
                        </div>`;
        document.body.appendChild(modal);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function saveSettings() {
        localStorage.setItem("ReNXsettings", JSON.stringify(ReNXsettings));
    }

    function loadReNXsettings() {
        return new Promise(function(resolve) {
            ReNXsettings = JSON.parse(localStorage.getItem("ReNXsettings")) || {
                logsDomainDescriptions: {},
                privacyBlocklistsCounters: {},
                allowlistDescriptions: {},
                denylistDescriptions: {}
            };
            resolve();
        });
    }

    // Main function
    function main() {
        if (/\/logs/i.test(location.href)) {
            const waitForContent = setInterval(function() {
                if (document.querySelector(".row-cols-md-2") != null) {
                    clearInterval(waitForContent);
                    const logsContainer = document.querySelector(".row-cols-md-2");
                    const countersDiv = document.createElement("div");
                    countersDiv.id = "counters";
                    countersDiv.style = "position: absolute; right: 0; margin: 10px; font-size: small; opacity: 0.5;";
                    logsContainer.parentElement.insertBefore(countersDiv, logsContainer);

                    let blockedCounter = 0;
                    let allowedCounter = 0;
                    let hiddenCounter = 0;

                    const observer = new MutationObserver(function(mutations) {
                        blockedCounter = 0;
                        allowedCounter = 0;
                        hiddenCounter = 0;
                        document.querySelectorAll(".col").forEach(function(logEntry) {
                            if (logEntry.style.display == "none") {
                                hiddenCounter++;
                                return;
                            }
                            if (logEntry.querySelector(".text-danger"))
                                blockedCounter++;
                            else
                                allowedCounter++;
                        });
                        countersDiv.innerHTML = "Blocked: " + blockedCounter + " | Allowed: " + allowedCounter + " | Hidden: " + hiddenCounter;
                    });
                    observer.observe(logsContainer, { childList: true, subtree: true });

                    setInterval(function() {
                        document.querySelectorAll(".col").forEach(function(logEntry) {
                            if (logEntry.querySelector(".btn-group"))
                                return;
                            const btnGroup = document.createElement("div");
                            btnGroup.className = "btn-group btn-group-sm";
                            btnGroup.style = "position: absolute; right: 0; visibility: hidden;";
                            const allowBtn = document.createElement("button");
                            allowBtn.className = "btn btn-success";
                            allowBtn.innerHTML = "Allow";
                            allowBtn.onclick = function() { allowDenyDomain(this, "allowlist"); };
                            const denyBtn = document.createElement("button");
                            denyBtn.className = "btn btn-danger";
                            denyBtn.innerHTML = "Deny";
                            denyBtn.onclick = function() { allowDenyDomain(this, "denylist"); };
                            const hideBtn = document.createElement("button");
                            hideBtn.className = "btn btn-dark";
                            hideBtn.innerHTML = "Hide";
                            hideBtn.onclick = function() { hideLogEntry(this); };
                            btnGroup.appendChild(allowBtn);
                            btnGroup.appendChild(denyBtn);
                            btnGroup.appendChild(hideBtn);
                            logEntry.appendChild(btnGroup);
                            const domain = logEntry.querySelector("a").innerHTML;
                            const tooltipParent = document.createElement("div");
                            tooltipParent.className = "tooltipParent";
                            tooltipParent.style = "display: contents;";
                            tooltipParent.innerHTML = domain;
                            const tooltip = document.createElement("div");
                            tooltip.className = "customTooltip text-muted small";
                            tooltip.style = "position: absolute; z-index: 1; top: 25px; background: #000; color: #fff; padding: 5px; border-radius: 5px; opacity: 0; visibility: hidden; transition: opacity .2s;";
                            tooltip.innerHTML = ReNXsettings.logsDomainDescriptions[domain] || "";
                            tooltipParent.appendChild(tooltip);
                            logEntry.querySelector("a").innerHTML = "";
                            logEntry.querySelector("a").appendChild(tooltipParent);
                        });
                    }, 1000);
                }
            }, 500);
        } else if (/privacy$/.test(location.href)) {
            const waitForContent = setInterval(function() {
                if (document.querySelector(".card-body") != null) {
                    clearInterval(waitForContent);
                    document.querySelectorAll(".list-group-item").forEach(function(item) {
                        const switchInput = item.querySelector("input[type=checkbox]");
                        if (!switchInput)
                            return;
                        const blocklistId = switchInput.id.match(/\d+/)[0];
                        const counterSpan = document.createElement("span");
                        counterSpan.className = "text-muted small";
                        counterSpan.style = "position: absolute; right: 70px;";
                        counterSpan.innerHTML = ReNXsettings.privacyBlocklistsCounters[blocklistId] || "0";
                        item.querySelector(".form-check").appendChild(counterSpan);
                        switchInput.onchange = function() {
                            ReNXsettings.privacyBlocklistsCounters[blocklistId] = "...";
                            saveSettings();
                            counterSpan.innerHTML = "...";
                        };
                    });
                }
            }, 500);
        } else if (/security$/.test(location.href)) {
            const waitForContent = setInterval(function() {
                if (document.querySelector(".card-body") != null) {
                    clearInterval(waitForContent);
                    document.querySelectorAll(".form-check").forEach(function(item) {
                        const switchInput = item.querySelector("input[type=checkbox]");
                        if (!switchInput || switchInput.id.includes("web3"))
                            return;
                        const tooltipParent = document.createElement("div");
                        tooltipParent.className = "tooltipParent";
                        tooltipParent.style = "display: contents;";
                        tooltipParent.innerHTML = item.querySelector("label").innerHTML;
                        const tooltip = document.createElement("div");
                        tooltip.className = "customTooltip text-muted small";
                        tooltip.style = "position: absolute; z-index: 1; top: 25px; background: #000; color: #fff; padding: 5px; border-radius: 5px; opacity: 0; visibility: hidden; transition: opacity .2s;";
                        tooltip.innerHTML = switchInput.checked ? "Enabled" : "Disabled";
                        tooltipParent.appendChild(tooltip);
                        item.querySelector("label").innerHTML = "";
                        item.querySelector("label").appendChild(tooltipParent);
                        switchInput.onchange = function() {
                            tooltip.innerHTML = this.checked ? "Enabled" : "Disabled";
                        };
                    });
                }
            }, 500);
        } else if (/allowlist$|denylist$/.test(location.href)) {
            const waitForContent = setInterval(function() {
                if (document.querySelector(".card-body") != null) {
                    clearInterval(waitForContent);
                    const listName = /allowlist$/.test(location.href) ? "allowlist" : "denylist";
                    document.querySelectorAll(".list-group-item").forEach(function(item) {
                        const domain = item.querySelector("span").innerHTML.match(/[^>]+$/)[0];
                        const descriptionInput = document.createElement("input");
                        descriptionInput.type = "text";
                        descriptionInput.className = "description form-control form-control-sm";
                        descriptionInput.placeholder = "Description";
                        descriptionInput.style = "display: none; position: absolute; right: 40px; width: 200px;";
                        descriptionInput.value = ReNXsettings[listName + "Descriptions"][domain] || "";
                        descriptionInput.onchange = function() {
                            ReNXsettings[listName + "Descriptions"][domain] = this.value;
                            saveSettings();
                        };
                        item.appendChild(descriptionInput);
                    });
                    setInterval(function() {
                        document.querySelectorAll(".list-group-item").forEach(function(item) {
                            if (item.querySelector(".btn-danger"))
                                return;
                            const domain = item.querySelector("span").innerHTML.match(/[^>]+$/)[0];
                            const deleteBtn = document.createElement("button");
                            deleteBtn.className = "btn btn-danger btn-sm";
                            deleteBtn.innerHTML = "Delete";
                            deleteBtn.style = "position: absolute; right: 0;";
                            deleteBtn.onclick = function() {
                                makeApiRequest("DELETE", listName + "/" + domain).then(function() {
                                    item.remove();
                                    delete ReNXsettings[listName + "Descriptions"][domain];
                                    saveSettings();
                                });
                            };
                            item.appendChild(deleteBtn);
                        });
                    }, 1000);
                }
            }, 500);
        } else if (/settings$/.test(location.href)) {
            const waitForContent = setInterval(function() {
                if (document.querySelector(".card-body") != null) {
                    clearInterval(waitForContent);
                    const exportConfigButton = document.createElement("button");
                    exportConfigButton.className = "btn btn-primary";
                    exportConfigButton.innerHTML = "Export this config";
                    exportConfigButton.onclick = function() {
                        const config = {};
                        const pages = ["security", "privacy", "parentalcontrol", "denylist", "allowlist", "settings", "rewrites"];
                        const configName = this.parentElement.previousSibling.querySelector("input").value;
                        let numPagesExported = 0;
                        createSpinner(this);
                        for (let i = 0; i < pages.length; i++) {
                            makeApiRequest("GET", pages[i]).then(function(response) {
                                config[pages[i]] = JSON.parse(response).data;
                                numPagesExported++;
                                if (numPagesExported == pages.length) {
                                    config.privacy.blocklists = config.privacy.blocklists.map(b => ({ id: b.id }));
                                    config.rewrites = config.rewrites.map(r => ({ name: r.name, content: r.content }));
                                    config.parentalcontrol.services = config.parentalcontrol.services.map(s => ({ id: s.id, active: s.active, recreation: s.recreation }));
                                    const fileName = configName + "-" + location.href.split("/")[3] + "-Export.json";
                                    exportToFile(config, fileName);
                                    exportConfigButton.lastChild.remove();
                                }
                            });
                        }
                    };
                    const importConfigButton = document.createElement("button");
                    importConfigButton.className = "btn btn-primary";
                    importConfigButton.innerHTML = "Import a config";
                    importConfigButton.onclick = function() { this.nextSibling.click(); };
                    const fileConfigInput = document.createElement("input");
                    fileConfigInput.type = "file";
                    fileConfigInput.style = "display: none;";
                    fileConfigInput.onchange = function() {
                        const file = new FileReader();
                        file.onload = async function() {
                            const config = JSON.parse(this.result);
                            const numItemsImported = { denylist: 0, allowlist: 0, rewrites: 0 };
                            const numFinishedRequests = { denylist: 0, allowlist: 0, rewrites: 0 };
                            const importIndividualItems = async function(listName) {
                                let listObj = config[listName];
                                listObj.reverse();
                                for (let i = 0; i < listObj.length; i++) {
                                    await sleep(1000);
                                    const item = listObj[i];
                                    makeApiRequest("POST", listName, item)
                                        .then(function(response) {
                                            if (!response.includes('"error') || response.includes("duplicate") || response.includes("conflict")) {
                                                numItemsImported[listName]++;
                                            }
                                        })
                                        .catch(function(response) {
                                            console.error(`Error importing ${listName} item:`, response);
                                        })
                                        .finally(function() {
                                            numFinishedRequests[listName]++;
                                        });
                                }
                            };
                            try {
                                console.log("Importing security settings...");
                                await makeApiRequest("PATCH", "security", config.security);
                                console.log("Security settings imported.");
                            } catch (error) {
                                console.error("Error importing security settings:", error);
                            }
                            try {
                                console.log("Importing privacy settings...");
                                await makeApiRequest("PATCH", "privacy", config.privacy);
                                console.log("Privacy settings imported.");
                            } catch (error) {
                                console.error("Error importing privacy settings:", error);
                            }
                            if (config.parentalcontrol) {
                                const parentalControlData = {
                                    safeSearch: config.parentalcontrol.safeSearch,
                                    youtubeRestrictedMode: config.parentalcontrol.youtubeRestrictedMode,
                                    blockBypass: config.parentalcontrol.blockBypass,
                                    services: config.parentalcontrol.services ? config.parentalcontrol.services.map(service => ({ id: service.id, active: service.active })) : [],
                                    categories: config.parentalcontrol.categories ? config.parentalcontrol.categories.map(category => ({ id: category.id, active: category.active })) : []
                                };
                                try {
                                    console.log("Importing parental control settings...");
                                    await makeApiRequest("PATCH", "parentalcontrol", parentalControlData);
                                    console.log("Parental control settings imported.");
                                } catch (error) {
                                    console.error("Error importing parental control settings:", error);
                                }
                            }
                            try {
                                console.log("Importing settings...");
                                await makeApiRequest("PATCH", "settings", config.settings);
                                console.log("Settings imported.");
                            } catch (error) {
                                console.error("Error importing settings:", error);
                            }
                            importIndividualItems("rewrites");
                            importIndividualItems("denylist");
                            importIndividualItems("allowlist");
                            setInterval(function() {
                                if (numFinishedRequests.denylist === config.denylist.length &&
                                    numFinishedRequests.allowlist === config.allowlist.length &&
                                    numFinishedRequests.rewrites === config.rewrites.length) {
                                    console.log("All import requests have finished.");
                                    console.log(`Imported items - Denylist: ${numItemsImported.denylist}/${config.denylist.length}, ` +
                                                `Allowlist: ${numItemsImported.allowlist}/${config.allowlist.length}, ` +
                                                `Rewrites: ${numItemsImported.rewrites}/${config.rewrites.length}`);
                                    setTimeout(() => location.reload(), 1000);
                                }
                            }, 1000);
                        };
                        file.readAsText(this.files[0]);
                        createPleaseWaitModal("Importing configuration");
                    };
                    const container = document.createElement("div");
                    container.style = "display: flex; grid-gap: 20px; margin-top: 20px;";
                    container.appendChild(exportConfigButton);
                    container.appendChild(importConfigButton);
                    container.appendChild(fileConfigInput);
                    document.querySelector(".card-body").appendChild(container);
                }
            }, 500);
        }
    }

    // Load settings and run main function
    let ReNXsettings;
    loadReNXsettings().then(() => {
        main();
        let currentPage = location.href;
        setInterval(function() {
            if (currentPage !== location.href) {
                currentPage = location.href;
                main();
            }
        }, 250);
    });
})();