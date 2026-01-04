// ==UserScript==
// @name         DH3 ModMod
// @namespace    com.anwinity.dh3
// @version      1.2.4
// @description  Adds QoL moderator utilities
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418520/DH3%20ModMod.user.js
// @updateURL https://update.greasyfork.org/scripts/418520/DH3%20ModMod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MUTE_LIST_DATE_FORMAT = "MMM DD HH:mm";
    const MUTE_LIST_DATE_FORMAT_TITLE = "YYYY-MM-DD HH:mm:ss";

    const FLOOD_DETECTION_PERIOD_SECONDS = 4;
    const FLOOD_DETECTION_THRESHOLD = 8;
    const FLOOD_DETECTION_RENOTIFY_PERIOD_SECONDS = 20;

    const scope = {
        handleConfirmDialogue: null,
        levels: {},
        list: [],
        listModUsernames: [],
        listMutedUsernames: [],
        recentFloodPopups: {},
        floodDetection: {}
    };

    function isDebug() {
        return $("#modmod-debug").prop("checked");
    }

    function isUpdateTimerActive() {
        let update = parseInt(window.var_updateTimer||"0");
        return update > 0 && update < 60; // less than 1 minute, but not 0 (0 is inactive)
    }

    function logDebugInfo(tag) {
        if(isDebug()) {
            console.log();
            console.log("---- ModMod DEBUG ----");
            console.log("ModMod DEBUG: TAG: ", tag);
            console.log("ModMod DEBUG: scope ", scope);
            console.log("ModMod DEBUG: flood-enabled ", $("#modmod-flood-enabled").prop("checked"));
            console.log("ModMod DEBUG: flood-combat ", $("#modmod-flood-combat").prop("checked"));
            console.log("ModMod DEBUG: var_monsterName ", window.var_monsterName);
            console.log("ModMod DEBUG: flood-perm ", $("#modmod-flood-perm").prop("checked"));
            console.log("ModMod DEBUG: flood-ip ", $("#modmod-flood-ip").prop("checked"));
            console.log("ModMod DEBUG: flood-duration ", $("#modmod-flood-duration").val());
            console.log("ModMod DEBUG: flood-auto-mute ", $("#modmod-flood-auto-mute").prop("checked"));
            console.log("---- ModMod DEBUG ----");
            console.log();
        }
    }

    function floodCheck(username) {
        logDebugInfo("floodCheck");
        if(isUpdateTimerActive()) {
            return;
        }
        if(username == "none") {
            return;
        }
        if(!(username in scope.floodDetection)) {
            scope.floodDetection[username] = [];
        }
        let threshold = moment().subtract(FLOOD_DETECTION_PERIOD_SECONDS, "seconds");
        let arr = scope.floodDetection[username];
        arr.push(moment());
        arr = arr.filter(t => t.isSameOrAfter(threshold));
        scope.floodDetection[username] = arr;
        if(arr.length > FLOOD_DETECTION_THRESHOLD) {
            if(username in scope.recentFloodPopups) {
                let lastPopup = scope.recentFloodPopups[username];
                let threshold = moment().subtract(FLOOD_DETECTION_RENOTIFY_PERIOD_SECONDS, "seconds");
                if(lastPopup.isAfter(threshold)) {
                    return; // prevent constant re-popup
                }
            }
            scope.recentFloodPopups[username] = moment();
            ModMod.notifyFlood(username);
        }
    }

    function loadBooleanPreference(name, defaultValue) {
        let val = localStorage.getItem(name);
        if(val == "true" || val == "1") {
            //console.log(name, true);
            return true;
        }
        else if(val == "false" || val == "0") {
            //console.log(name, false);
            return false;
        }
        //console.log(name, defaultValue);
        return defaultValue;
    }

    function loadIntPreference(name, defaultValue) {
        let val = localStorage.getItem(name);
        try {
            val = parseInt(val);
        }
        catch(err) {
            //console.log(name, defaultValue);
            return defaultValue;
        }
        if(!isNaN(val)) {
            //console.log(name, val);
            return val;
        }
        //console.log(name, defaultValue);
        return defaultValue;
    }

    function initUI() {
       const styles = document.createElement("style");
        styles.textContent = `
        .modmod-monospace {
          font-family: 'Courier New', monospace;
        }
        .modmod-nowrap {
          white-space: nowrap;
        }
        table.modmod-table {
          border-collapse: collapse;
          width: 100%;
        }
        table.modmod-table tr, table.modmod-table th, table.modmod-table td {
          border: 1px solid rgb(50, 50, 50);
          background-color: rgba(26, 26, 26, 0.4);
          text-align: left;
        }
        table.modmod-table th, table.modmod-table td {
          padding: 0.25em;
          padding-left: 0.5em;
          padding-right: 0.5em;
        }
        table.modmod-table.striped tbody tr:nth-child(even) td {
          background-color: rgba(52, 52, 52, 0.2);
        }
        table.modmod-table.striped tbody tr:nth-child(odd) td {
          background-color: rgba(26, 26, 26, 0.2);
        }
        table.modmod-table.striped thead tr th {
          background-color: rgba(78, 78, 78, 0.2);
        }
        table.modmod-table tr.not-current {
          color: rgba(255, 255, 255, 0.4);
        }
        table.modmod-table tr.not-current:hover {
          color: rgba(255, 255, 255, 1);
        }
        table.modmod-table tr.current {
          color: rgba(255, 255, 255, 0.9);
        }
        table.modmod-table tr.current:hover {
          color: rgba(255, 255, 255, 1);
        }
        #modmod-list-table-container {
          max-height: 80vh;
          overflow-y: scroll;
        }
        table.modmod-table td.permanent {
          color: rgba(255, 0, 0, 0.9);
        }
        table.modmod-table td.permanent:hover {
          color: rgba(255, 0, 0, 1);
        }
        #modmod-list-filters {
          margin-bottom: 1em;
        }
        .modmod-horizontal-form {
          display :flex;
          justify-content: flex-start;
        }
        .modmod-horizontal-form > div:not(last-child) {
          margin-right: 2em;
        }
        `;
        $("head").append(styles);

        $("#navigation-area-buttons").append(`
        <div onclick="navigate('modmod')" id="navigation-modmod-button" class="navigate-button" style="color: white;">
          <div style="color: #189531; text-align: center; height: 50px; width: 50px; font-size: 46px">M</div>
          <div style="font-size: 10pt; text-align: center;">ModMod</div>
        </div>
        `);

        $("#right-panel").append(`
        <div id="navigation-modmod" style="display: none; padding: 1em;">
          <h3>Mute</h3>
          <div class="modmod-horizontal-form">
            <div id="modmod-mute-username-div">
              <label style="margin-bottom: 0.5em">Username</label><br />
              <input type="text" id="modmod-mute-username" />
              <button type="button" id="modmod-whois-button" onclick="ModMod.whoIs($('#modmod-mute-username').val());">Who Is</button>
            </div>
            <div id="modmod-mute-duration-div">
              <label style="margin-bottom: 0.5em">Type/Duration</label><br />
              <select id="modmod-mute-type" onchange="
                switch(this.value) {
                  case '-1':
                  case '0':
                    $('#modmod-mute-duration').prop('disabled', true);
                    break;
                  case '1':
                    $('#modmod-mute-duration').prop('disabled', false);
                    break;
                }
                ">
                <option value="1">Mute</option>
                <option value="-1">Permanent</option>
                <option value="0">Unmute</option>
              </select>
              <input type="number" id="modmod-mute-duration" min="1" max="336" />
            </div>
            <div id="modmod-mute-ip-div">
              <label style="margin-bottom: 0.5em">Mute IP</label><br />
              <input type="checkbox" id="modmod-mute-ip">
            </div>
            <div id="modmod-mute-reason-div">
              <label style="margin-bottom: 0.5em">Reason</label><br />
              <input type="text" id="modmod-mute-reason" maxlength="200" style="min-width: 300px" />
            </div>
            <div id="modmod-mute-submit-div">
              <label style="margin-bottom: 0.5em">Action</label><br />
              <button type="button" title="Submits mute" style="margin-bottom: 0.5em" onclick="sendBytes('CHAT='+ModMod.formatMute());">Submit</button>&nbsp;
              <button type="button" title="Copies mute command to chat" style="margin-bottom: 0.5em" onclick="$('#chat-area-input').val(ModMod.formatMute())">Chat Cmd</button>
              <button type="button" title="Clears mute form" style="margin-bottom: 0.5em" onclick="ModMod.resetMuteForm()">Clear</button>&nbsp;
              <br />
            </div>
          </div>
          <br /><br />
          <div id="modmod-whois-result">
            <div id="modmod-whois-nope" style="display:none"></div>
            <div id="modmod-whois-yep" style="display:none">
              <table id="modmod-whois-table" class="modmod-table striped">
                <thead>
                  <tr>
                    <th width="25%">User</th>
                    <th width="25%">Level</th>
                    <th width="25%">User (Guests)</th>
                    <th width="25%">Level</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
          <hr/>
          <div>
            <h3>Flood Detection</h3>
            <div class="modmod-horizontal-form">
              <div>
                <label style="margin-bottom: 0.5em">Enabled</label><br />
                <input type="checkbox" id="modmod-flood-enabled" onchange="ModMod.savePreferences()">
              </div>
              <div>
                <label style="margin-bottom: 0.5em">Popup During Combat</label><br />
                <input type="checkbox" id="modmod-flood-combat" onchange="ModMod.savePreferences()">
              </div>
              <div>
                <label style="margin-bottom: 0.5em">Permanent</label><br />
                <input type="checkbox" id="modmod-flood-perm" onchange="ModMod.savePreferences()">
              </div>
              <div>
                <label style="margin-bottom: 0.5em">IP</label><br />
                <input type="checkbox" id="modmod-flood-ip" onchange="ModMod.savePreferences()">
              </div>
              <div>
                <label style="margin-bottom: 0.5em">Duration</label><br />
                <input type="number" id="modmod-flood-duration" min="1" max="336" onchange="ModMod.savePreferences()" />
              </div>
              <div>
                <label style="margin-bottom: 0.5em">Auto Mute</label><br />
                <input type="checkbox" id="modmod-flood-auto-mute" onchange="ModMod.savePreferences()">
              </div>
            </div>
          </div>
          <hr/>
          <h3>List</h3>
          <div>
            <div id="modmod-list-filters">
              <input id="modmod-list-filter-username" type="text" placeholder="Filter Username" />&nbsp;
              <input id="modmod-list-filter-mod" type="text" placeholder="Filter Mod" />&nbsp;
              <input id="modmod-list-filter-current" type="checkbox" /><label>Current Only</label>&nbsp;
              <button type="button" onclick="ModMod.refilterMuteList();">Filter</button>&nbsp;
              <button type="button" onclick="ModMod.clearFilter();">Clear Filter</button>&nbsp;
              <button type="button" title="refresh from server" onclick="sendBytes('CHAT=/list');">Refresh</button>
            </div>
            <div id="modmod-list-table-container">
              <table id="modmod-list-table" class="modmod-table striped">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Muted By</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Duration</th>
                    <th>Remaining</th>
                    <th>Reason</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
          <br /><br /><br /><br />
          <input id="modmod-debug" type="checkbox" /><label>Debug (for testing)</label>
        </div>
        `);

        $("#game").append(`
        <div class="dialogue" id="dialogue-flood" style="top: 20px; display: none;">
          <input id="dialogue-flood-username" type="hidden" style="display: none">
          <div class="center">
            <h1>Chat Flooding Detected!</h1>
          </div>
          <div style="text-align:center">
            <strong>Username: </strong><span id="dialogue-flood-username-display">smitty hc</span>
          </div>
          <br/ ><br />
          <hr class="hr-thin">
          <div>
            <div class="dialogue-button" style="background-color:#b3ffff" onclick="ModMod.issueFloodMute(); $('#dialogue-flood').hide();">Mute</div>
            <br />
            <div class="dialogue-button" style="background-color:#b3ffff" onclick="ModMod.prefillFloodMute(true); $('#dialogue-flood').hide();">Fill Mute Form</div>
            <br />
            <div class="dialogue-button" onclick="$('#dialogue-flood').hide();">Close</div>
          </div>
        </div>
        `);
    }

    function overrideFunctions() {
        const originalNavigate = window.navigate;
        window.navigate = function(a) {
            originalNavigate.apply(this, arguments);
            if(a=="modmod") {
                //
            }
            else {
                $("#navigation-modmod").hide();
            }
        };

        const originalConfirmDialogue = window.confirmDialogue;
        window.confirmDialogue = function(a, html) {
            if(typeof scope.handleConfirmDialogue === "function") {
                try {
                    scope.handleConfirmDialogue(...arguments);
                }
                finally {
                    scope.handleConfirmDialogue = null;
                }
            }
            else {
                originalConfirmDialogue(...arguments);
            }
        }

        window.loadMuteList = function(data) {
            // Smitty~anwinity~1607736219516~1607736219514~test~false~false
            // who by start end reason ip current
            data = data.split("~");
            scope.list = [];
            scope.listModUsernames = [];
            scope.listMutedUsernames = [];
            for(let i = 0; i < data.length; i+=7) {
                let startTimestamp = parseInt(data[i+2]);
                let start = moment(startTimestamp);
                let end = moment(parseInt(data[i+3]));
                if(!scope.listModUsernames.includes(data[i+1])) {
                    scope.listModUsernames.push(data[i+1]);
                }
                if(!scope.listMutedUsernames.includes(data[i])) {
                    scope.listMutedUsernames.push(data[i]);
                }
                let duration = Math.round(end.diff(start, "hours", true));
                let durString = ""
                if(duration > 19000) {
                    durString = "Perm";
                }
                else {
                    let durD = Math.floor(duration/24);
                    let durH = duration-(durD*24);
                    if(durD > 0) durString += `${durD}d `;
                    if(durH > 0) durString += `${durH}h `;
                    durString = durString.trim();
                    if(!durString) {
                        durString = "0";
                    }
                }
                scope.list.push({
                    username: data[i],
                    mod: data[i+1],
                    startTimestamp: startTimestamp,
                    startMoment: start,
                    start: start.format(MUTE_LIST_DATE_FORMAT),
                    startTitle: start.format(MUTE_LIST_DATE_FORMAT_TITLE),
                    end: end.format(MUTE_LIST_DATE_FORMAT),
                    endMoment: end,
                    endTitle: end.format(MUTE_LIST_DATE_FORMAT_TITLE),
                    duration: durString,
                    reason: data[i+4],
                    ip: data[i+5]=="true",
                    current: data[i+6]=="true"
                });
            }
            scope.list.sort((a, b) => {
                return b.startTimestamp - a.startTimestamp;
            });
            ModMod.refilterMuteList();
            setTimeout(() => navigate("modmod"), 250);
        }

        const originalChat = window.chat;
        window.chat = function(data) {
            const username = data.substr(0, data.indexOf("~"));
            logDebugInfo("chat:"+username);
            originalChat(data);
            if($("#modmod-flood-enabled").prop("checked")) {
                floodCheck(username);
            }
        }

    }

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        $.get("https://dh3.diamondhunt.co/hiscores/", function(data) {
            let jq = $(data);
            jq.find("tr.hiscore-tr").each(function() {
                let tr = $(this);
                let username = tr.find("td:nth-child(2)").text().trim().toLowerCase();
                let level = tr.find("td:nth-child(4)").text().trim();
                scope.levels[username] = parseInt(level);
            });
        });

        window.ModMod = {
            debug() {
                logDebugInfo("ModMod.debug()");
            },
            notifyFlood(username) {
                logDebugInfo("notifyFlood");
                $("#dialogue-flood-username").val(username);
                $("#dialogue-flood-username-display").html(username.replace(/ /g, "&nbsp;"));
                if($("#modmod-flood-auto-mute").prop("checked")) {
                    ModMod.issueFloodMute();
                }
                else {
                    if($("#modmod-flood-combat").prop("checked") || window.var_monsterName == "none") {
                        $("#dialogue-flood").show();
                    }
                    else {
                        setTimeout(() => window.ModMod.notifyFlood(username), 5000);
                    }
                }
            },
            issueFloodMute() {
                logDebugInfo("issueFloodMute");
                ModMod.prefillFloodMute();
                //console.log('CHAT='+ModMod.formatMute());
                sendBytes('CHAT='+ModMod.formatMute());
            },
            prefillFloodMute(openTab=false) {
                logDebugInfo("prefillFloodMute");
                let username = $("#dialogue-flood-username").val();
                let perm = $("#modmod-flood-perm").prop("checked");
                let type = perm?"-1":"1";
                let duration = perm ? -1 : ($("#modmod-flood-duration").val()||48);
                let ip = $("#modmod-flood-ip").prop("checked");
                let reason = "Auto Mute (flooding)";

                $("#modmod-mute-username").val(username);
                $("#modmod-mute-type").val(type);
                $("#modmod-mute-duration").val(duration);
                $("#modmod-mute-ip").prop("checked", ip);
                $("#modmod-mute-reason").val(reason);
                ModMod.whoIs(username, false);
                if(openTab) {
                    navigate("modmod");
                }
            },
            prefillMute(username, openTab=false, whois=false) {
                logDebugInfo("prefillMute");
                $("#modmod-mute-username").val(username);
                $("#modmod-mute-type").val("1");
                $("#modmod-mute-duration").val(24);
                $("#modmod-mute-ip").prop("checked", false);
                $("#modmod-mute-reason").val("");
                if(openTab) {
                    navigate("modmod");
                }
                if(whois) {
                    ModMod.whoIs(username, false);
                }
            },
            resetMuteForm() {
                logDebugInfo("resetMuteForm");
                $("#modmod-mute-username").val("");
                $("#modmod-mute-type").val("1");
                $("#modmod-mute-duration").val("24");
                $("#modmod-mute-ip").prop("checked", false);
                $("#modmod-mute-reason").val("");
                ModMod.clearWhoIs();
            },
            formatMute() {
                logDebugInfo("formatMute");
                let username = $("#modmod-mute-username").val().replace(/\s/g, "_").trim() || "<username>";
                let type = $("#modmod-mute-type").val();
                let duration = type;
                if(duration == "1") {
                    duration = $("#modmod-mute-duration").val();
                }
                let ip = $("#modmod-mute-ip").prop("checked");
                let reason = $("#modmod-mute-reason").val();
                return `/smute ${username} ${duration} ${ip?1:0} ${reason}`;
            },
            clearFilter() {
                logDebugInfo("clearFilter");
                $("#modmod-list-filter-username").val("");
                $("#modmod-list-filter-mod").val("");
                $("#modmod-list-filter-current").prop("checked", false);
                ModMod.refilterMuteList();
            },
            refilterMuteList() {
                logDebugInfo("refilterMuteList");
                let filters = {
                    username: $("#modmod-list-filter-username").val().toLowerCase(),
                    mod: $("#modmod-list-filter-mod").val().toLowerCase(),
                    current: $("#modmod-list-filter-current").prop("checked")
                };
                let tbody = $("#modmod-list-table tbody");
                tbody.empty();
                let now = moment();
                let rows = "";
                scope.list.forEach(mute => {
                    if(!mute.current && filters.current) {
                        return;
                    }
                    if(filters.username && !mute.username.toLowerCase().includes(filters.username)) {
                        return;
                    }
                    if(filters.mod && !mute.mod.toLowerCase().includes(filters.mod)) {
                        return;
                    }
                    let remaining = Math.round(mute.endMoment.diff(now, "minutes", true));
                    let remString = ""
                    if(mute.current) {
                        if(remaining > 60*19000) {
                            remString = "Perm";
                        }
                        else {
                            let remD = Math.floor(remaining/(24*60));
                            remaining -= (remD*24*60);
                            let remH = Math.floor(remaining/(60));
                            remaining -= (remH*60);
                            let remM = remaining;

                            if(remD > 0) remString += `${remD}d `;
                            if(remH > 0) remString += `${remH}h `;
                            if(remM > 0) remString += `${remM}m `;
                            remString = remString.trim();
                            if(!remString) {
                                remString = "0";
                            }
                        }
                    }
                    rows += `
                      <tr class="${mute.current?'current':'not-current'}">
                        <td class="modmod-nowrap">${mute.username}</td>
                        <td class="modmod-nowrap">${mute.mod}</td>
                        <td class="modmod-monospace modmod-nowrap"><span title="${mute.startTitle}">${mute.start}</span></td>
                        <td class="modmod-monospace modmod-nowrap"><span title="${mute.endTitle}">${mute.end}</span></td>
                        <td class="modmod-nowrap ${mute.duration=='Perm'?'permanent':''}">${mute.duration}</td>
                        <td class="modmod-nowrap ${remString=='Perm'?'permanent':''}">${remString}</td>
                        <td>${mute.reason}</td>
                        <td>${mute.ip?'IP':''}</td>
                      </tr>
                    `;
                });
                tbody.append(rows);
            },
            clearWhoIs() {
                logDebugInfo("clearWhoIs");
                let nope = $("#modmod-whois-nope");
                nope.empty();
                nope.hide();
                let yep = $("#modmod-whois-yep");
                yep.hide();
                let tbody = $("#modmod-whois-table tbody");
                tbody.empty();
            },
            whoIs(username, openTab=false) {
                logDebugInfo("whoIs");
                let nope = $("#modmod-whois-nope");
                nope.empty();
                nope.hide();
                let yep = $("#modmod-whois-yep");
                yep.hide();
                let tbody = $("#modmod-whois-table tbody");
                tbody.empty();

                ModMod.waitForConfirmDialogue(function(a, html) {
                    logDebugInfo("waitForConfirmDialogue");
                    if(html == "Player offline or does not exist.") {
                        nope.html(`<strong>whois:</strong> ${html}`);
                        nope.show();
                    }
                    else if(html.endsWith("is a noob!!!!")) {
                        nope.html("<strong>whois:</strong> smitty is a noob!!!!");
                        nope.show();
                    }
                    else {
                        let users = html.split("<br />").filter(s => s).sort();
                        let nonGuests = users.filter(s => !s.startsWith("guest_"));
                        let guests = users.filter(s => s.startsWith("guest_"));
                        let rows = "";
                        for(let i = 0; i < nonGuests.length || i < guests.length; i++) {
                            let nonGuest = nonGuests[i];
                            let guest = guests[i];
                            let row = "<tr>";
                            if(nonGuest) {
                                let lower = nonGuest.toLowerCase();
                                let level = scope.levels[lower] || "";
                                row += `<td>${nonGuest}</td><td>${level}</td>`;
                            }
                            else {
                                row += "<td></td><td></td>";
                            }
                            if(guest) {
                                let lower = guest.toLowerCase();
                                let level = scope.levels[lower] || "";
                                row += `<td>${guest}</td><td>${level}</td>`;
                            }
                            else {
                                row += "<td></td><td></td>";
                            }
                            row += "</tr>";
                            rows += row;
                        }
                        tbody.append(rows);
                        yep.show();
                    }
                }, 2000);
                sendBytes(`CHAT=/whois ${username}`);
                if(openTab) {
                    navigate("modmod");
                }
            },
            waitForConfirmDialogue(f, timeout=1000) {
                logDebugInfo("waitForConfirmDialogue");
                scope.handleConfirmDialogue = f;
                setTimeout(function() {
                    if(scope.handleConfirmDialogue == f) {
                        scope.handleConfirmDialogue = null;
                    }
                }, timeout);
            },
            loadPreferences() {
                logDebugInfo("loadPreferences");
                $("#modmod-flood-enabled").prop("checked", loadBooleanPreference("modmod-flood-enabled", false));
                $("#modmod-flood-combat").prop("checked", loadBooleanPreference("modmod-flood-combat", false));
                $("#modmod-flood-perm").prop("checked", loadBooleanPreference("modmod-flood-perm", false));
                $("#modmod-flood-ip").prop("checked", loadBooleanPreference("modmod-flood-ip", false));
                $("#modmod-flood-duration").val(loadIntPreference("modmod-flood-duration", 48));
                $("#modmod-flood-auto-mute").prop("checked", loadBooleanPreference("modmod-flood-auto-mute", false));
            },
            savePreferences() {
                logDebugInfo("savePreferences");
                localStorage.setItem("modmod-flood-enabled", $("#modmod-flood-enabled").prop("checked"));
                localStorage.setItem("modmod-flood-combat", $("#modmod-flood-combat").prop("checked"));
                localStorage.setItem("modmod-flood-perm", $("#modmod-flood-perm").prop("checked"));
                localStorage.setItem("modmod-flood-ip", $("#modmod-flood-ip").prop("checked"));
                localStorage.setItem("modmod-flood-duration", $("#modmod-flood-duration").val());
                localStorage.setItem("modmod-flood-auto-mute", $("#modmod-flood-auto-mute").prop("checked"));
            }
        };

        initUI();
        overrideFunctions();
        window.ModMod.loadPreferences();
        sendBytes("CHAT=/list");
    }

    $(init);

})();