// ==UserScript==
// @name        Single Click Bin and Clean
// @namespace   https://junque.org/
// @license     Please do not modify yourself, contact thesilwar with any problems on junque.org
// @version     2.1.4
// @description Add a clean button to the Flarum forum's discussion page nav and access session storage access dead links from LCJunque
// @author      thesilwar
// @match        *://junque.org/*
// @grant       GM_xmlhttpRequest
// @grant       window.close
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at      document-idle

// @downloadURL https://update.greasyfork.org/scripts/535043/Single%20Click%20Bin%20and%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/535043/Single%20Click%20Bin%20and%20Clean.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    let SCBC_HasReloaded = sessionStorage.getItem("SCBC_HasReloaded") === "true";


    // 🔧 Initialize SCBC Preferences
    let SCBC_Preferences = JSON.parse(localStorage.getItem("SCBC_Preferences")) || {
        botMode: false,
        autoCloseTab: false,
        autoBinIfAllDead: false,
        linkCheckDelay: 20  // seconds
    };

    function saveSCBCPreferences() {
        localStorage.setItem("SCBC_Preferences", JSON.stringify(SCBC_Preferences));
    }

    // 🔧 Add Settings UI Panel
    function createSCBCSettingsPanel() {
        if (document.getElementById("SCBC_SettingsPanel")) return;

        const panel = document.createElement("div");
        panel.id = "SCBC_SettingsPanel";
        panel.style.position = "fixed";
        panel.style.top = "50%";
        panel.style.left = "50%";
        panel.style.transform = "translate(-50%, -50%)";
        panel.style.zIndex = "99999";
        panel.style.padding = "20px 30px";
        panel.style.border = "2px solid #007bff";
        panel.style.backgroundColor = "#ffffff";
        panel.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
        panel.style.borderRadius = "10px";
        panel.style.fontFamily = "Arial, sans-serif";
        panel.style.minWidth = "320px";
        panel.style.maxWidth = "90%";

        panel.innerHTML = `
        <h3 style="margin-top:0; margin-bottom: 15px;">⚙️ SCBC Settings</h3>
        <label style="display:block; margin-bottom: 8px;">
            <input type="checkbox" id="scbc_botMode"> Bot Mode
        </label>
        <label style="display:block; margin-bottom: 8px;">
            <input type="checkbox" id="scbc_autoCloseTab"> Auto Close Tab
        </label>
        <label style="display:block; margin-bottom: 8px;">
            <input type="checkbox" id="scbc_autoBin"> Auto Bin if All Dead
        </label>
        <label style="display:block; margin-bottom: 12px;">
            Link Check Delay (sec):
            <input type="number" id="scbc_delay" style="width:60px" min="5" max="300">
        </label>
        <div style="display: flex; justify-content: space-between;">
            <button id="scbc_save" style="padding:6px 14px; font-weight: bold;">💾 Save</button>
            <button id="scbc_close" style="padding:6px 14px; font-weight: bold;">❌ Close</button>
        </div>
    `;

        document.body.appendChild(panel);

        // Set values from localStorage
        document.getElementById("scbc_botMode").checked = SCBC_Preferences.botMode;
        document.getElementById("scbc_autoCloseTab").checked = SCBC_Preferences.autoCloseTab;
        document.getElementById("scbc_autoBin").checked = SCBC_Preferences.autoBinIfAllDead;
        document.getElementById("scbc_delay").value = SCBC_Preferences.linkCheckDelay;

        // Save button click
        document.getElementById("scbc_save").onclick = function () {
            SCBC_Preferences.botMode = document.getElementById("scbc_botMode").checked;
            SCBC_Preferences.autoCloseTab = document.getElementById("scbc_autoCloseTab").checked;
            SCBC_Preferences.autoBinIfAllDead = document.getElementById("scbc_autoBin").checked;
            SCBC_Preferences.linkCheckDelay = parseInt(document.getElementById("scbc_delay").value) || 20;

            saveSCBCPreferences();
            alert("✅ SCBC preferences saved.");
        };

        // Close button
        document.getElementById("scbc_close").onclick = function () {
            panel.remove();
        };
    }


    document.addEventListener("keydown", function (e) {
        // Ctrl+Shift+Y to toggle panel
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            createSCBCSettingsPanel();
        }

        // Esc key to close panel
        if (e.key === "Escape") {
            const panel = document.getElementById("SCBC_SettingsPanel");
            if (panel) panel.remove();
        }
    });

    function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
     actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
     bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
     iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes     = $(iframeSelector).contents ()
                .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound     = actionFunction (jThis);
                    if (cancelFound)
                        btargetsFound   = false;
                    else
                        jThis.data ('alreadyFound', true);
                }
            } );
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    waitForKeyElements (selectorTxt,
                                        actionFunction,
                                        bWaitOnce,
                                        iframeSelector
                                       );
                },
                                           300
                                          );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }

    function getTopicIdFromUrl() {
        var urlPath = window.location.pathname;
        var pathSegments = urlPath.split('/');
        return pathSegments[2].split('-')[0];
    }

    const domains = {
        "1dl.net": {
            regex: /(https?:\/\/(www\.)?(1dl\.net)\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "1fichier.com": {
            regex: /(https?:\/\/(www\.)?(1fichier\.com)\/\?([a-zA-Z0-9]+)([^\s]*)?)/g,
            replacement: (match, link, subdomain, domain, id, extra) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "clicknupload.org|clicknupload.co|clicknupload.cc|clicknupload.cfd|clicknupload.to|clicknupload.club|clicknupload.red|clicknupload.click|clicknupload.site|clicknupload.name|clicknupload.xyz|clicknupload.vip|clicknupload.space|clicknupload.online|clicknupload.download|clickndownload.org|clickndownload.space|clickndownload.site": {
            regex: /(https?:\/\/(www\.)?((?:clicknupload|clickndownload)\.(?:to|cc|cfd|club|me|link|org|co|com|vip|download|xyz|click|space|site|name|online))\/(\w+))(?:\/[^\s?#]+)?/gi,
            replacement: (match, full, sub, host, id) => {
                return `${host} ~ Dead Link Removed ~ username ~ ID:[${id}]`;
            }
        },

        "dailyuploads.net": {
            regex: /(https?:\/\/(www\.)?(dailyuploads\.net)\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "ddownload.com|ddl.to": {
            regex: /https?:\/\/(ddownload\.com|ddl\.to)(?:\/d)?\/(\w+)(?:\/[^?\s]*)?/g,
            replacement: (match, domain, id) => {
                return domain + " ~ Dead Link Removed ~ thesilwar ~ ID:[" + id + "]";
            }
        },
        "devuploads.com": {
            regex: /(https?:\/\/(www\.)?(devuploads\.com)\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "drop.download|dropapk.to": {
            regex: /(https?:\/\/(dropapk\.to|drop\.download)\/(\w+).*)/g,
            replacement: (match, link, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "filefactory.com": {
            regex: /(https?:\/\/(www\.)?(filefactory\.com)\/file\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "filespayout.com|filespayouts.com": {
            regex: /(https?:\/\/(www\.)?(filespayout\.com|filespayouts\.com)\/(?:d\/)?(\w+))/g,
            replacement: (match, link, subdomain, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "filestore.me": {
            regex: /(https?:\/\/(www\.)?(filestore\.me)\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead/Premium Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "fikper.com": {
            regex: /(https?:\/\/(www\.)?(fikper\.com)\/(\w{10,}))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash, tail) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "frdl.to|frdl.io|frdl.is": {
            regex: /(https?:\/\/(www\.)?(frdl\.to|frdl\.io|frdl.\is)\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "k2s.cc": {
            regex: /(https?:\/\/(www\.)?(k2s\.cc)\/file\/(\w+))(\/.*)?/g,
            replacement: (match, link, subdomain, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "katfile.com": {
            regex: /(https?:\/\/(www\.)?(katfile\.com)\/(\w+))(\/.*?)?/g,
            replacement: (match, link, subdomain, domain, id, slash) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "megaup.net": {
            regex: /(https?:\/\/(www\.)?(megaup\.net)\/(\w+)\/?.*)/g,
            replacement: (match, link, subdomain, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "nitroflare.com|nitroflare.net|nitro.download": {
            regex: /(https?:\/\/(www\.)?(nitroflare\.com|nitroflare\.net|nitro\.download)\/view\/(\w+).*)/g,
            replacement: (match, link, subdomain, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "novafile.com|novafile.org|nfile.cc": {
            regex: /(https?:\/\/(novafile\.com|novafile\.org|nfile\.cc)\/(\w+)(\/[^\s]*)?)/g,
            replacement: (match, link, domain, id, path) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "rapidgator.net|rg.to": {
            regex: /(https?:\/\/(www\.)?(rg\.to|rapidgator\.net)\/file\/([a-zA-Z0-9]+)(?:\/[^\s?#]+)?)/gi,
            replacement: (match, link, _www, domain, id) => {
                return domain.toLowerCase() + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "send.cm": {
            regex: /(https?:\/\/(www\.)?(send\.cm)\/(\w+).*?)/g,
            replacement: (match, link, subdomain, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "turbobit.get|turbobit.net|turbobit.com|turbobit.pw": {
            regex: /(https?:\/\/(www\.)?(turbobit\.(?:net|pw|get|com))\/([A-Za-z0-9]+))(?:\/[^\s?#]+\.html)?/gi,
            replacement: (match, fullUrl, subdomain, domain, id) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        },
        "uploadgig.com": {
            regex: /(https?:\/\/(?:www\.)?uploadgig\.com\/file\/download\/([A-Za-z0-9]+))(?:\/[^\s\]]*)?/gi,
            replacement: (match, link, id) => `uploadgig ~ Dead Link Removed ~ username ~ ID:[${id}]`
        },
        "usersdrive.com": {
            regex: /(https?:\/\/(www\.)?usersdrive\.com\/(?:d\/)?([\w-]+))(?:\.html)?(?:\/[^\s]*)?/g,
            replacement: (match, link, sub, id) => {
                return "usersdrive.com ~ Dead Link Removed ~ thesilwar ~ ID:[" + id + "]";
            }
        },
        "voltupload.com": {
            regex: /(https?:\/\/(www\.)?(voltupload\.com)\/(\w+)(\/[^\s]*)?)/g,
            replacement: (match, link, subdomain, domain, id, path) => {
                return domain + " ~ Dead Link Removed ~ username ~ ID:[" + id + "]";
            }
        }
    };

    function findMatchingDomain(domain, domains) {
        const d = domain.toLowerCase();
        for (const key in domains) {
            if (key.split('|').some(k => k.toLowerCase() === d)) return domains[key];
        }
        return null;
    }

    function triggerReload(reason) {
         const warbb = $('warbb[name="filehosts"]');
         const unknownAttr = warbb.attr("unknown") || "";
         const deadAttr = warbb.attr("dead") || "";

         const unknownHosts = unknownAttr.split(",").map(h => h.trim().toLowerCase());
         const deadHosts = deadAttr.split(",").map(h => h.trim().toLowerCase());

         const hasUploadgigUnknown = unknownHosts.includes("uploadgig.com");
         const hasUploadgigDead = deadHosts.includes("uploadgig.com");

         // 🔁 Force reload if uploadgig is either unknown or dead
         const forceReload = hasUploadgigUnknown || hasUploadgigDead;

         if (!SCBC_HasReloaded || forceReload) {
             // ✅ Only set flag if not forced due to uploadgig
             if (!forceReload) {
                 SCBC_HasReloaded = true;
                 sessionStorage.setItem("SCBC_HasReloaded", "true");
             }

             const logNote = forceReload
             ? "⚠️ Forced reload due to uploadgig.com being unknown or dead"
             : `🔁 Triggering page reload after ${reason}...`;
             console.log(logNote);

             setTimeout(() => location.reload(), 1500);
         } else {
             console.log(`🛑 Skipped reload (${reason}) - already reloaded.`);
         }
     }


    function replaceLinks(content, links, domains, username){
        let contentText = content;

        for (let raw of links){
            const cleanedLink = raw.replace(/"/g,'').trim();
            if (!cleanedLink) continue;

            const dm = cleanedLink.match(/^https?:\/\/(?:www\.)?([^\/\?#]+)/i);
            if (!dm) continue;

            const host = dm[1].toLowerCase();
            const cfg = domains[host] || findMatchingDomain(host, domains);
            if (!cfg) continue;

            const { regex, replacement } = cfg;
            if (!regex || !replacement) continue;

            // match the configured pattern against THIS link only
            const testRe = new RegExp(regex.source, regex.flags.replace('g','')); // single-shot
            const m = cleanedLink.match(testRe);
            if (!m) continue;

            // rebuild full target from the match result (use m[0])
            const linkToReplace = m[0];

            // produce replacement text using the configured global regex (so groups align)
            regex.lastIndex = 0;
            const replaced = linkToReplace.replace(regex, (...args) => {
                const out = replacement(...args);
                return typeof out === 'string' ? out.replace(/username/g, username) : out;
            });

            // replace ONLY this exact occurrence in content (escape literal)
            const safe = new RegExp(linkToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            contentText = contentText.replace(safe, replaced);
        }

        return contentText;
    }
    // Function to perform the BIN action
    function BinTopic(discussionId, csrfToken) {
        if (SCBC_HasReloaded) return; // ⛔ Prevent double reload

        const binData = {
            data: {
                type: "discussions",
                attributes: {},
                id: discussionId,
                relationships: {
                    tags: {
                        data: [{ type: 'tags', id: '45' }]
                    }
                }
            }
        };

        GM_xmlhttpRequest({
            method: "PATCH",
            url: `https://junque.org/api/discussions/${discussionId}`,
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken
            },
            data: JSON.stringify(binData),
            onload: function (updateResponse) {
                console.log('BIN response:', updateResponse.responseText);
                    console.log('🗑️ BIN completed (via BinTopic)');
                triggerReload('bin');

            }
        });
    }

    function handleCleanButtonClick() {
        var username = $('li.item-session span.username').text().trim();
        // Access the 'deadlinks' data from session storage
        var deadLinks = sessionStorage.getItem('deadlinks');
        if (deadLinks) {
            // Remove duplicates and convert to an array
            var uniqueLinksArray = removeDuplicatesAndConvertToArray(deadLinks);

            // Code for updating posts is commented out
            var topicId = getTopicIdFromUrl();
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://junque.org/api/posts?filter[discussion]=${topicId}&filter[number]=1`,
                onload: function (response) {
                    var csrfToken = response.responseHeaders.match(/x-csrf-token:\s*(\S+)/i)[1];
                    var responseData = JSON.parse(response.responseText);
                    var firstPostId = responseData.data[0].id;
                    var content = responseData.data[0].attributes.content;
                    var newContent = replaceLinks(content, uniqueLinksArray, domains, username);
                    //console.log(newContent);
                    updatePost(firstPostId, newContent, csrfToken);
                }
            });
        } else {
            alert('No dead links found in session storage.');
        }
    }

    // Function to handle the "BIN" button click event
    function handleBinButtonClick() {
        var discussionId = getTopicIdFromUrl(); // Assuming discussion ID is the same as topic ID

        // Get the first post's data from the page source
        var firstPostData = $('.PostStream-item[data-index="0"]');
        var postId = firstPostData.data('id');
        var username = firstPostData.find('.username').text().trim();

        // Retrieve CSRF token using GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://junque.org/api/posts/${postId}`,
            onload: function (response) {
                var csrfToken = response.responseHeaders.match(/x-csrf-token:\s*(\S+)/i)[1];

                // Call the addNewPostAndBin function
                addNewPostAndBin(discussionId, csrfToken, postId, username);
            }
        });
    }

    function createButtonsAndCSS() {
        var username = $('li.item-session span.username').text().trim();
        var navList = $('.DiscussionPage-nav > ul');
        if (navList.length) {
            var cleanButtonLi = $('<li>').addClass('item-clean');
            var cleanButton = $('<button>').addClass('Button Button--bookmark hasIcon').attr('type', 'button');
            // Add custom CSS to the button for background color and text color
            cleanButton.css({
                'background-color': '#b00303', // Set the background color to red
                'color': 'white' // Set the text color to white
            });
            var cleanIcon = $('<i>').addClass('icon fa fa-broom Button-icon').attr('aria-hidden', 'true');
            var cleanLabel = $('<span>').addClass('Button-label').text('Clean');

            cleanButton.append(cleanIcon, cleanLabel);
            cleanButtonLi.append(cleanButton);
            navList.find('li').eq(0).after(cleanButtonLi);

            // Add the BIN button (This code is unchanged)
            var binButtonLi = $('<li>').addClass('item-bin');
            var binButton = $('<button>').addClass('Button Button--bookmark hasIcon').attr('type', 'button');
            // Add custom CSS to the button for background color and text color
            binButton.css({
                'background-color': 'yellow', // Set the background color to yellow
                'color': 'black' // Set the text color to black
            });
            var binIcon = $('<i>').addClass('icon fa fa-trash Button-icon').attr('aria-hidden', 'true');
            var binLabel = $('<span>').addClass('Button-label').text('BIN');

            binButton.append(binIcon, binLabel);
            binButtonLi.append(binButton);
            navList.find('li.item-clean').after(binButtonLi);

            // Clean button click event (Keep the existing code for the "Clean" button)
            cleanButton.click(function () {
                handleCleanButtonClick(); // Call the function to handle "Clean" button click
            });

            // BIN button click event
            binButton.click(function () {
                handleBinButtonClick(); // Call the function to handle "BIN" button click
            });
        }
    }

    function getCSRFTokenAndBin() {
        const discussionId = getTopicIdFromUrl();
        const firstPostData = $('.PostStream-item[data-index="0"]');
        const postId = firstPostData.data('id');
        const username = firstPostData.find('.username').text().trim();

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://junque.org/api/posts/${postId}`,
            onload: function (response) {
                const csrfToken = response.responseHeaders.match(/x-csrf-token:\s*(\S+)/i)?.[1];
                if (csrfToken) {
                    addNewPostAndBin(discussionId, csrfToken, postId, username); // ✅ includes comment
                } else {
                    console.error("❌ CSRF token missing, cannot bin.");
                }
            }
        });
    }

    function waitForDeadLinks(timeoutSec, callback) {
        const interval = 1000; // check every 1 sec
        let waited = 0;

        const checker = setInterval(() => {
            const deadLinks = sessionStorage.getItem("deadlinks");
            if (deadLinks && deadLinks.length > 0) {
                clearInterval(checker);
                callback(true, JSON.parse(deadLinks));
            } else if (waited >= timeoutSec) {
                clearInterval(checker);
                console.warn("⚠️ Dead link check timed out.");
                callback(false, []);
            }
            waited += 1;
        }, interval);
    }

    function getDeadLinksArrayFromSession() {
    const raw = sessionStorage.getItem('deadlinks');

    if (!raw) return [];

    try {
        // Try parsing as JSON array
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return [...new Set(parsed.map(link => String(link).trim()))];
        }
    } catch (e) {
        // Fallback: treat raw as comma-separated string
    }

    // Ensure it's treated as string before split
    const stringified = String(raw);
    return [...new Set(
        stringified.split(",").map(link => link.trim().replace(/^"|"$/g, ''))
    )];
}

    function getLinkStatsFromProgressBox() {
    const aliveSpan = document.querySelector('.warlc-progressitem.alive');
    const deadSpan = document.querySelector('.warlc-progressitem.adead');

    if (!aliveSpan || !deadSpan) {
        console.warn("⚠️ Progress spans not found.");
        return { total: 0, dead: 0, alive: 0 };
    }

    const aliveCount = parseInt(aliveSpan.textContent.split('-')[0].trim()) || 0;
    const deadCount = parseInt(deadSpan.textContent.split('-')[0].trim()) || 0;

    return {
        total: aliveCount + deadCount,
        dead: deadCount,
        alive: aliveCount
    };
}


    function initiateAutoClean() {
        const discussion = app.current.get('discussion');
        const discussionId = discussion?.id();

        if (!discussionId) {
            console.warn("❌ No discussion ID found. Skipping auto-clean.");
            return;
        }

        // 🚫 Check if already binned in tag 45
        checkIfAlreadyBinnedLive(discussionId, function (isBinned) {
            if (isBinned) {
                console.log("🛑 Auto-clean aborted — discussion is in tag 45 (Junkyard).");
                return;
            }

            const username = $('li.item-session span.username').text().trim();
            const deadLinksArray = getDeadLinksArrayFromSession();

            console.log(`📊 Dead links detected: ${deadLinksArray.length}`, deadLinksArray);

            if (deadLinksArray.length === 0) {
                console.log("✅ No dead links found, skipping auto-clean.");
                return;
            }

            const stats = getLinkStatsFromProgressBox();
            console.log(`📊 Link Stats — Total: ${stats.total}, Alive: ${stats.alive}, Dead: ${stats.dead}`);

            if (SCBC_Preferences.autoBinIfAllDead && stats.total > 0 && stats.dead === stats.total) {
                console.log("☠️ All links are dead (from UI stats). Triggering Bin...");
                getCSRFTokenAndBin(discussionId);
                return;
            }

            // Continue with partial clean
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://junque.org/api/posts?filter[discussion]=${discussionId}&filter[number]=1`,
                onload: function (response) {
                    const csrfToken = response.responseHeaders.match(/x-csrf-token:\s*(\S+)/i)?.[1];
                    if (!csrfToken) {
                        console.error("❌ CSRF token not found.");
                        return;
                    }

                    const responseData = JSON.parse(response.responseText);
                    const firstPostId = responseData.data[0].id;
                    const content = responseData.data[0].attributes.content;

                    const normalize = url => url.trim().replace(/\/+$/, '').toLowerCase();
                    const postLinks = (content.match(/https?:\/\/[^\s)'"<>]+/g) || []).map(s =>
                                                                                           s.replace(/\[\/?(img|code)\]|\]$/gi, '').trim()
                                                                                          );
                    const total = postLinks.length;
                    const deadCount = postLinks.filter(link =>
                                                       deadLinksArray.some(dl => normalize(dl) === normalize(link))
                                                      ).length;

                    console.log(`📊 Total Links: ${total}, Dead Links (from session): ${deadCount}`);

                    if (SCBC_Preferences.autoBinIfAllDead && total > 0 && deadCount === total) {
                        console.log("💀 All links are dead. BINNING only.");
                        BinTopic(discussionId, csrfToken);
                        return;
                    }

                    console.log("🧹 Cleaning using session-stored dead links.");
                    const newContent = replaceLinks(content, deadLinksArray, domains, username);
                    updatePost(firstPostId, newContent, csrfToken);
                }
            });

        }); // 🔚 End of checkIfAlreadyBinnedLive
    } // ✅ End of initiateAutoClean()



    function showModal(title, bodyHtml, type = 'warning') {
        // Remove any existing modal
        document.querySelectorAll('.VKModalManager').forEach(el => el.remove());

        // Icon & theme classes based on type
        const iconMap = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        const iconClass = iconMap[type] || 'fa-info-circle';
        const headerBg = {
            success: 'var(--alert-success-bg)',
            warning: 'var(--alert-bg)',
            error: 'var(--alert-error-bg)',
            info: 'var(--control-bg)'
        }[type];

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'Modal-backdrop';
        backdrop.setAttribute('data-showing', '');
        backdrop.style.setProperty('--modal-count', '1');

        // Modal manager
        const manager = document.createElement('div');
        manager.className = 'VKModalManager ModalManager';
        manager.style.setProperty('--modal-number', '1');

        // Modal container
        const modal = document.createElement('div');
        modal.className = 'Modal in fade Modal--small';

        // Modal content wrapper
        const content = document.createElement('div');
        content.className = 'Modal-content';
        content.style.borderRadius = '6px';

        // Header
        const header = document.createElement('div');
        header.className = 'Modal-header';
        header.style.backgroundColor = headerBg;
        header.style.color = 'var(--text-on-light)';
        header.style.padding = '20px';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.innerHTML = `
        <i class="fas ${iconClass}" style="font-size: 1.5rem; margin-right: 10px;"></i>
        <h3 style="font-size: 18px; font-weight: bold; margin: 0;">${title}</h3>
        <button class="Modal-close" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--muted-color);
            cursor: pointer;
        ">&times;</button>
    `;

        // Body
        const body = document.createElement('div');
        body.className = 'Modal-body';
        body.innerHTML = bodyHtml;
        body.style.padding = '25px 30px';
        body.style.color = 'var(--control-color)';
        body.style.fontSize = '15px';

        // Footer (optional hint or button area)
        const footer = document.createElement('div');
        footer.className = 'Modal-footer';
        footer.innerHTML = `<em style="font-size: 13px;">Press ESC or click × to close</em>`;

        // Assemble
        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        modal.appendChild(content);
        manager.appendChild(modal);
        document.body.appendChild(backdrop);
        document.body.appendChild(manager);

        // Close behavior
        const removeModal = () => {
            backdrop.remove();
            manager.remove();
        };
        header.querySelector('.Modal-close').onclick = removeModal;
        backdrop.onclick = removeModal;
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                removeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Rest of the code remains the same

    // Create buttons and add CSS when target elements are found
    waitForKeyElements(".DiscussionPage-nav", createButtonsAndCSS);

    function checkIfAlreadyBinnedLive(discussionId, callback) {
        // Real-time API fetch instead of cached store
        fetch(`https://junque.org/api/discussions/${discussionId}`)
            .then(res => res.json())
            .then(json => {
            const tags = json.data.relationships.tags.data || [];
            const isAlreadyBinned = tags.some(tag => tag.id === '45');

            // Optional: log current tags
            console.log(`📡 Live check for discussion ${discussionId} tags:`);
            tags.forEach(tag => console.log(`🔹 ID: ${tag.id}`));

            callback(isAlreadyBinned);
        })
            .catch(err => {
            console.error("❌ Failed to fetch live tag info:", err);
            showModal("Error", "<p>Could not fetch latest discussion info.</p>", "error");
        });
    }


    function addNewPostAndBin(discussionId, csrfToken, postId, username) {

       checkIfAlreadyBinnedLive(discussionId, function (isAlreadyBinned) {
        if (isAlreadyBinned) {
            console.log("🚫 Skipping BIN. Already in Junkyard.");
            showModal("Already Binned", "<p>This topic is already in the <strong>Junkyard</strong> (tag 45). No action was taken.</p>");
            return;
        }

        var content = `@\"${username}\"#p${postId} \n[bwarning] Warning! This topic contains Dead links and is being sent to the Graveyard. If you have live links,\nplease Flag or PM a Moderator, to get it moved back to the relevant category.\n\n[b] ~ Topic binned ~ [/b] [/bwarning]`;
        // JSON data for the new post
        var postData = {
            data: {
                type: "posts",
                attributes: {
                    content: content
                },
                relationships: {
                    discussion: {
                        data: {
                            type: "discussions",
                            id: discussionId
                        }
                    }
                }
            }
        };

        // Send the POST request to add a new post
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://junque.org/api/posts",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRF-Token": csrfToken
            },
            data: JSON.stringify(postData),
            onload: function(response) {
                // Check if the POST request was successful
                if (response.status === 201) {
                    // JSON data for the BIN action
                    var binData = {
                        data: {
                            type: "discussions",
                            attributes: {},
                            id: discussionId,
                            relationships: {
                                tags: {
                                    data: [{
                                        type: "tags",
                                        id: "45" // Tag ID for Junqueyard
                                    }]
                                }
                            }
                        }
                    };

                    // Send the PATCH request to perform the BIN action
                    GM_xmlhttpRequest({
                        method: "PATCH",
                        url: `https://junque.org/api/discussions/${discussionId}`,
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-Token": csrfToken
                        },
                        data: JSON.stringify(binData),
                        onload: function(updateResponse) {
                            console.log('BIN response:', updateResponse.responseText);
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        }
                    });
                } else {
                    console.error('Error adding a new post.');
                }
            }
        });
       });
    }

    // Uncomment below to update the post with modified content
    function updatePost(postId, newContent, csrfToken) {
        GM_xmlhttpRequest({
            method: "PATCH",
            url: `https://junque.org/api/posts/${postId}`,
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken
            },
            data: JSON.stringify({
                data: {
                    type: "posts",
                    id: postId,
                    attributes: {
                        content: newContent
                    }
                }
            }),
            onload: function(response) {
                console.log('🧹 Clean completed (via updatePost)');
                triggerReload('clean'); // 🔁 Controlled reload
            }
        });
    }



    // Your removeDuplicatesAndConvertToArray function
    function removeDuplicatesAndConvertToArray(input) {
        if (Array.isArray(input)) {
            return [...new Set(input.map(x => String(x).trim()))];
        }

        if (typeof input === 'string') {
            return [...new Set(input.split(',').map(x => x.trim().replace(/^"|"$/g, '')))];
        }

        return []; // fallback
    }


   $(document).keydown(function (e) {
    // Ignore if typing in input, textarea, or editable area
    if ($(e.target).is("input, textarea, [contenteditable]")) return;

    if (e.ctrlKey && e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
            case "c":
                e.preventDefault(); // Prevent browser default (e.g., DevTools inspect element)
                handleCleanButtonClick();
                break;
            case "x":
                e.preventDefault(); // Prevent browser default cut
                handleBinButtonClick();
                break;
        }
    }
});


    function analyzeStatusAndCloseTab() {
    console.log("Initiating status check...");

    // Check if auto-close is disabled in preferences
    if (!SCBC_Preferences.autoCloseTab) {
        console.log("⚙️ autoCloseTab is disabled in preferences. Skipping tab close logic.");
        return;
    }

    // 🧠 Inject custom reload logic before proceeding
    try {
        const unknownSpanText = $(".warlc-progressitem.unknown").text().trim();
        const unknownMatch = unknownSpanText.match(/(\d+)\s*-\s*(\d+)% Unknown/i);
        const unknownPercent = unknownMatch ? parseInt(unknownMatch[2]) : 0;

        const unknownAttr = $('warbb[name="filehosts"]').attr("unknown") || "";
        const unknownHosts = unknownAttr.split(",").map(h => h.trim().toLowerCase());
        const hasUploadgig = unknownHosts.includes("uploadgig.com");

        if (unknownPercent >= 50 && hasUploadgig) {
            const delay = Math.floor(Math.random() * (20 - 15 + 1) + 15) * 1000;
            console.log(`🔄 uploadgig.com detected with ${unknownPercent}% unknown — reloading in ${delay / 1000}s`);
            setTimeout(() => location.reload(), delay);
            return; // ❌ Skip rest of tab check
        }
    } catch (e) {
        console.warn("⚠️ Error checking unknown host reload condition:", e);
    }

    // 🔁 Normal close check logic
    let attempts = 0;

    function checkAndClose() {
        attempts++;

        const alive1 = parseInt($(".warlc-progressitem.alive").text()) || 0;
        const dead1 = parseInt($(".warlc-progressitem.adead").text()) || 0;
        const unres1 = parseInt($(".warlc-progressitem.unava").text()) || 0;
        const proc1 = parseInt($(".warlc-progressitem.processing").text()) || 0;
        const unknown1 = parseInt($(".warlc-progressitem.unknown").text()) || 0;

        console.log("Check attempt " + attempts + ":");
        console.log("Alive:", alive1);
        console.log("Dead:", dead1);
        console.log("Unavailable:", unres1);
        console.log("Processing:", proc1);
        console.log("Unknown:", unknown1);

        if (alive1 > 0 && dead1 === 0 && unres1 === 0 && proc1 === 0 && unknown1 === 0) {
            console.log("✅ Conditions met. Closing tab...");
            closeWin();
        } else if (attempts < 3) {
            console.log("🔁 Conditions not met. Rechecking in 3 seconds...");
            setTimeout(checkAndClose, 3000);
        } else {
            console.log("⏹️ Maximum attempts reached without meeting conditions.");
        }
    }

    checkAndClose();
}

function closeWin() {
    try {
        window.close();
    } catch (e) {
        console.warn("❌ Unable to close window:", e);
    }
}

// ✅ Run after DOM and Flarum are ready
$(document).ready(function () {
    setTimeout(function () {
        try {
            const discussion = app.current.get('discussion');
            const tags = discussion?.tags() || [];

            const isJunkyard = tags.some(tag => tag.id() === '45');
            if (isJunkyard) {
                console.log("🛑 This discussion is in tag 45 (Junkyard). Skipping auto-close.");
                return;
            }

            analyzeStatusAndCloseTab();
        } catch (e) {
            console.warn("⚠️ Could not access discussion or tags. Proceeding anyway.", e);
            analyzeStatusAndCloseTab();
        }
    }, 5000);

    console.log("⚙️ SCBC_Preferences:", SCBC_Preferences);
});

// ✅ Auto-clean if enabled
if (SCBC_Preferences.botMode) {
    window.addEventListener("load", function () {
        const delayInMs = (SCBC_Preferences.linkCheckDelay || 20) * 1000;

        try {
            const discussion = app.current.get('discussion');
            const tags = discussion?.tags() || [];
            const isJunkyard = tags.some(tag => tag.id() === '45');

            if (isJunkyard) {
                console.log("🛑 Bot mode skipped — this discussion is already in Junkyard (tag 45).");
                return;
            }
        } catch (e) {
            console.warn("⚠️ Could not check for Junkyard tag before bot mode clean:", e);
        }

        console.log("🤖 Bot mode active - will start auto-clean in", delayInMs / 1000, "seconds");

        setTimeout(() => {
            console.log("🧪 Running initiateAutoClean...");
            initiateAutoClean();
        }, delayInMs);
    });
}



})();

/* Change log
Version 2.1.4 – 3 September 2025
• Regex update: Added frdl.is

Version 2.1.3 – 3 September 2025
• Turbobit: regex now handles IDs with/without .html and drops any trailing path; supports optional /d/.

Version 2.1.2 – 2 September 2025
• ClicknUpload: regex now handles IDs with/without .html and drops any trailing path; supports optional /d/.

Version 2.1.1 – 1 September 2025
• UsersDrive: regex now handles IDs with/without .html and drops any trailing path; supports optional /d/.
• Rapidgator: regex reliably captures the hash after /file/ across rapidgator.net and rg.to, ignoring trailing segments.

Version 2.1.0 – 25 August 2025
• Removed generic fallback replacement loop; all replacements now handled in a single pass per domain.
• Simplified replaceLinks logic to use direct domain config only, avoiding duplicate regex executions.
• Improved domain matching with pipe-separated keys (e.g., "nitroflare.com|nitroflare.net|nitro.download") via findMatchingDomain().

Version 2.0.8 – 17 August 2025
• Fixed Turbobit regex to handle links with or without .html.
• Improved script logging for clearer match and replace tracking.

Version 2.0.7 – 12 August 2025
• Unified keyboard shortcuts so that Ctrl+Shift+C triggers Clean and Ctrl+Shift+X triggers Bin/Delete
• Removed duplicate key bindings to prevent conflicts between Clean and Bin actions

Version 2.0.6 – 8 August 2025
• Cleaned ddownload.com links by stripping filenames, keeping only file IDs
• Refined rapidgator.net regex to exclude filenames after file IDs

Version 2.0.5 – 7 August 2025
• Improved reload logic: If uploadgig.com is marked as unknown or dead, page reload will always occur
• SCBC_HasReloaded safeguard flag is now skipped in such cases to allow repeated retries

Version 2.0.4 – 7 August 2025
• Regex added for novafile domains with dynamic ID capture and consistent dead link cleanup formatting

Version 2.0.3 – 5 August 2025
• Fix: 1fichier.com ID not detected – now handled from query string (?ID)
• Domain added: voltupload.com with path-based ID support

Version 2.0.2 – 1 August 2025
• Regex update: Added frdl.io support alongside frdl.to
• Unified pattern under frdl.to|frdl.io with dynamic ID capture
• Consistent dead link message applied for both domains

Version 2.0.1 – 23 July 2025
• Regex improvements: Support grouped domain patterns (e.g., filespayout[s]?)
• Domain replacement logic now uses dynamic ID capture
• All domain entries alphabetically sorted for better maintainability

Version 2.0.0 – 18 July 2025
• Auto-Bin now uses addNewPostAndBin() to insert a warning post before tagging as Junkyard (ID: 45), just like manual bin
• Integrated getCSRFTokenAndBin() in auto path to retrieve CSRF token and ensure comment is added properly before binning
• Improved clean vs bin decision logic in initiateAutoClean() based on real-time UI stats and session-stored dead links
• Enhanced logging for auto-bin with 📊 and ☠️ indicators to show exact match and trigger reason
• Ensures page reload happens only once per action using SCBC_HasReloaded safeguard flag

Version 1.1.0 – 18 July 2025
• Auto-Bin now uses addNewPostAndBin() to insert a warning post before tagging as Junkyard (ID: 45), just like manual bin
• Integrated getCSRFTokenAndBin() in auto path to retrieve CSRF token and ensure comment is added properly before binning
• Improved clean vs bin decision logic in initiateAutoClean() based on real-time UI stats and session-stored dead links
• Enhanced logging for auto-bin with 📊 and ☠️ indicators to show exact match and trigger reason
• Ensures page reload happens only once per action using SCBC_HasReloaded safeguard flag

Version 1.0.4 – 18 July 2025
• Added live tag check using `checkIfAlreadyBinnedLive()` before binning, to ensure real-time status across tabs or moderators
• Prevents double binning by verifying current tags from Flarum API
• Improved logging for tag checks with 📡 and 🔹 indicators for clarity

Version 1.0.3 – 12 July 2025
• Verified `@match` wildcards align with standard syntax *://domain/*
• Updated changelog formatting to improve readability

12 July 2025 - Updated keyboard shortcut handling:
- Changed Clean button shortcut to Ctrl + Shift + C
- Changed Bin button shortcut to Ctrl + Shift + X
- Combined multiple keydown listeners into a single handler for better performance
- Updated domain list regex entries using latest definitions
- Ensured no conflict with browser default shortcuts (e.g., Ctrl + B, Ctrl + M)

Version 1.0.1 - 06 May 2025
Download and Update URL removed

Version 1.0.0 - 06 May 2025
This user script is designed to automate and streamline link cleanup and validation across various file-hosting on flarum based platform.
*/