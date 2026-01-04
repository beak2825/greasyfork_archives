// ==UserScript==
// @name         Walla Walla - modified
// @namespace    walla.walla.heasley
// @version      1.1.4
// @description  Adds join attack to hosped player. Script by heasley
// @author       Heasley
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAXVBMVEU7NzcAAAABAQEkJCSBgIA+OjpQTExHQ0N/fHxZWVlKR0dPS0t8eXlUUVGIhYVaVlaTkJCfnZ2Ni4ssLCwUFBQMDAzAvr7HxsaVk5NlYmJ1c3NubW1oZ2cZGRlCPj6EAbdMAAAAfklEQVQYlYWO2RKDIAwAEwUiR8Cjl8Xy/59ZpAwOT903dpYkACDJcsiwJQknFNy8ZGYXqAjltrGwOVUE+wF/eG7FDfHeCtLiIQbUT19nSNKvNYtlr1sAzHQWKwP0Qv0V3RfsCnpHRCNsE2k/xg9Hcwl1CB851acEmYxik8pZX3gcBm7Qs05FAAAAAElFTkSuQmCC
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @connect      warbirds.rocks
// @connect      api.torn.com
// @connect      tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/537149/Walla%20Walla%20-%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/537149/Walla%20Walla%20-%20modified.meta.js
// ==/UserScript==
var tertWars = {};
var observer_started = false;
var socket;
var TS_APIKEY = localStorage.getItem('obn_ts_apikey') || '';
var APIKEY = localStorage.getItem('obn_apikey') || '';
var SPIES = JSON.parse(localStorage.getItem('obn_spies')) || {};
var factionID;
var targetID;
var faction = {};
var LAST_VIEW = localStorage.getItem('obn_last_view') || '';
var hide_scroll = localStorage.getItem('obn_hide_scrollbar') || "true";
var hide_faction_desc = localStorage.getItem('obn_hide_fac_desc') || "false";
var obn_new_window = localStorage.getItem('obn_new_window') || "true";
var filter_buttons = JSON.parse(localStorage.getItem('obn_filter_buttons')) || {};

const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    var [resource, config] = args;
    var response = await originalFetch(resource, config);
    const json = () => response.clone().json()
    .then((data) => {
        data = { ...data };
        if(response.url.indexOf('?sid=attackData') != -1) {
            if(data.DB.error?.includes('in hospital') || data.DB.error?.includes('unconscious') || data.DB.error?.includes('This fight no longer exists')) {
                data.DB.defenderUser.playername += ' [Hospital]'
                delete data.DB.error
                delete data.startErrorTitle
            }
        }

        if(response.url.indexOf('page.php?sid=factionsProfile&step=getInfo') != -1) {
            if (hide_faction_desc === "true") {
                data.faction.description = 'Blocked by Walla Walla'
            }
        }

        return data
    })

    response.json = json;
    response.text = async () =>JSON.stringify(await json());

    if(response.url.indexOf('page.php?sid=factionsProfile&step=getInfo') != -1) {
        //response.json().then( r => factionInfo(r))
    }

    if(response.url.indexOf('faction_wars.php?redirect=false&step=getwardata') != -1) {
        response.json().then( r => getWarData(r,response.url))
    }

    if(response.url.indexOf('faction_wars.php?redirect=false&step=joinwar') != -1) {
        //response.json().then( r => joinwar(r))
    }

    if(response.url.indexOf('?sid=attackData') != -1) {
        response.json().then( r => startAttack(r))
    }

    if(response.url.indexOf('sidebarAjaxAction.php?q=getSidebarData') != -1) {
        //response.json().then( r => myInfo(r))
    }

    return response;
};
const userID = document.cookie
.split('; ')
.find(row => row.startsWith('uid'))
.split('=')[1];

async function once(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!targetID) return;
    $(event.target).attr('disabled','disabled');
    const request_url = `https://www.torn.com/loader.php?sid=attackData&mode=json&user2ID=${targetID}&rfcv=${getRFC()}&step=poll`;
    const response = await unsafeWindow.fetch(request_url, {
        "credentials": "same-origin",
        "headers": {
            "X-Requested-With": "XMLHttpRequest",
        },
        "method": "GET"
    });
    const result = await response.json();
    $(event.target).removeAttr('disabled');
}

async function startAttack(r) {
    var elm = await waitForElm(`[class*='dialogButtons_'] button.torn-btn[type="submit"]`);
    var btn = $(elm);

    if (elm && btn && btn.length) {
        if(r.DB.defenderUser.playername.includes('[Hospital]') || r.DB?.startButtonTimer?.timeLeft > 0) {
            btn.addClass('disabled');
            elm.addEventListener("click", once, false);
        } else {
            if(btn.hasClass('disabled')){
                btn.removeClass('disabled');
                elm.removeEventListener("click", once, false);
            }
        }
    }

    if (r.DB?.currentFightStatistics) {
        const participants = $('ul[class*="participants"]');
        for (const [id, p] of Object.entries(r.DB.currentFightStatistics)) {
            const player = participants.find(`li span[class*="playername_"]:contains(${p.playername})`);
            if (!player.length) continue;
            if ($(player).find(`.obn-intercept`).length) continue;

            player.closest('li[class*="row_"]').append(`<div id="obn-int-${p.userID}" class="obn-intercept-wrap"></div>`)

            if (APIKEY && userID) {
                const type = "checkFaction";
                const enemyID = p.userID;

                let request = 'type='+type+'&user='+userID+'&enemy='+enemyID;
                var url = 'https://warbirds.rocks/process/warRequest.php';
                GM_xmlhttpRequest({
                    url: url,
                    method: "POST",
                    data: request,
                    headers:    {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': `${APIKEY}`
            },
                    onload: function(response) {
                        try {
                          const r = response.response;
                          const f = JSON.parse(r);
                          if ($(`#obn-int-${p.userID}`).length) {
                              $(`#obn-int-${p.userID}`).prepend(`<div class="obn-${f.faction_type}">${f.faction_name}</div>`);
                          }
			} catch (e) {
				console.error(e);
			}
                    }
                });

            }

            player.html(`<a href="/loader.php?sid=attack&user2ID=${p.userID}" class="obn-intercept" target="_blank">${p.playername}</a>`);

            if (SPIES[id] && $(`#obn-spy-${p.userID}`).length == 0) {
                if ($(`#obn-int-${p.userID}`).length) {

                    let timestampStr = "";
                    let spyTitle = "<b><u>Battle Stats</u></b>";
                    let spy = SPIES[id];

                    spyTitle += `<br><b>${shortnameStats("strength")}: </b><span style='float: right; padding-left: 5px;'>${isNaN(spy["strength"]) ? spy["strength"] : spy["strength"].toLocaleString()}</span>`;
                    spyTitle += `<br><b>${shortnameStats("defense")}: </b><span style='float: right; padding-left: 5px;'>${isNaN(spy["defense"]) ? spy["defense"] : spy["defense"].toLocaleString()}</span>`;
                    spyTitle += `<br><b>${shortnameStats("speed")}: </b><span style='float: right; padding-left: 5px;'>${isNaN(spy["speed"]) ? spy["speed"] : spy["speed"].toLocaleString()}</span>`;
                    spyTitle += `<br><b>${shortnameStats("dexterity")}: </b><span style='float: right; padding-left: 5px;'>${isNaN(spy["dexterity"]) ? spy["dexterity"] : spy["dexterity"].toLocaleString()}</span>`;
                    spyTitle += `<br><b>${shortnameStats("total")}: </b><span style='float: right; padding-left: 5px;'>${isNaN(spy["total"]) ? spy["total"] : spy["total"].toLocaleString()}</span>`;
                    spyTitle += `<br><b>Last Spy: </b>${timeDifference(Date.now(),spy.timestamp*1000)}`;


                    $(`#obn-int-${p.userID}`).append(`<div title="${spyTitle}"><b style="cursor: pointer;">${abbreviateNumber(spy.total)}</b></div>`);
                }
            } else {
                getTSSPYAPI("user", p.userID);
            }


        }

    }
}

$( document ).ready(function() {
    'use strict';
    const url = window.location.href;

    if (url.includes("loader.php") && url.includes("sid=attack")) {
        targetID = url.split('ID=').pop();
    }

    if (url.includes("factions.php") && url.includes("step=your")) {
        window.addEventListener('hashchange', hashHandler, false);
    }

    createWebSocketConnection(); //Initialize connection

    if (hide_scroll === "true") {
        GM_addStyle(`
        ::-webkit-scrollbar {width: 0px;background: transparent;}  html { scrollbar-width: none !important;}
        `);
    }
});

function initWalla() {
    if ($('#walla-walla').length != 0) return;
    const c = getCounts();

    const floaterElement = `
    <div class="obn-floater obn-hide" id="walla-walla">
        <div class="obn-container">
         <div class="obn-row obn-views">
             <div class="obn-btn-group" >
                <button type="button" class="obn-btn obn-first" data-target=".obn-userlist">Userlist</button>
                <button type="button" class="obn-btn obn-mid" data-target=".obn-walls">Walls</button>
                <button type="button" class="obn-btn obn-last" data-target=".obn-settings">Settings</button>
             </div>
         </div>

         <div class="obn-row obn-userlist obn-page" style="display: none;">
             <div class="obn-filter-buttons">
             <div>
                 <input type="checkbox" class="obn-onlinestatus-checkbox">
                 <label class="noselect obn-rounded-btn">
                     Online <span class="obn-badge" id="obn-onlineCount">${c?.onlineCount}</span>
                 </label>
             </div>

             <div>
                 <input type="checkbox" class="obn-onlinestatus-checkbox">
                 <label class="noselect obn-rounded-btn">
                     Idle <span class="obn-badge" id="obn-idleCount">${c?.idleCount}</span>
                 </label>
             </div>

             <div>
                 <input type="checkbox" class="obn-onlinestatus-checkbox">
                 <label class="noselect obn-rounded-btn">
                     Offline <span class="obn-badge" id="obn-offlineCount">${c?.offlineCount}</span>
                 </label>
            </div>

            <div>
                <input type="checkbox" class="obn-status-checkbox">
                <label class="noselect obn-rounded-btn">
                    Okay <span class="obn-badge" id="obn-okayCount">${c?.okayCount}</span>
                </label>
            </div>

            <div>
                <input type="checkbox" class="obn-status-checkbox">
                <label class="noselect obn-rounded-btn">
                    Hospital <span class="obn-badge red" id="obn-hospCount">${c?.hospCount}</span>
                </label>
            </div>

            <div>
                <input type="checkbox" class="obn-status-checkbox">
                <label class="noselect obn-rounded-btn">
                    Travel <span class="obn-badge" id="obn-travelCount">${c?.travelCount}</span>
                </label>
            </div>

            <div>
                <input type="checkbox" class="obn-status-checkbox">
                <label class="noselect obn-rounded-btn">
                    Jail <span class="obn-badge red" id="obn-jailCount">${c?.jailCount}</span>
                </label>
            </div>

            <div>
                <input type="checkbox" class="obn-status-checkbox">
                <label class="noselect obn-rounded-btn">
                    On Walls <span class="obn-badge red" id="obn-wallCount">${c?.wallCount}</span>
                </label>
            </div>
            </div>

            <div class="obn-memberlist">
              <div class="obn-loader">
                <img src="/images/v2/main/ajax-loader.gif" class="ajax-placeholder m-top10 m-bottom10 obn-loader">
              </div>
            </div>
        </div>

        <div class="obn-row obn-walls obn-page" style="display: none;">
            <img src="/images/v2/main/ajax-loader.gif" class="ajax-placeholder m-top10 m-bottom10 obn-loader">
        </div>

        <div class="obn-row obn-settings obn-page" style="display: none;">
         <div class="obn-row obn-apikeys">
           <div id="api_input">
            <input class="obn-input obn-input-group" type="text" id="obn_apikey_input" required minlength="16" maxlength="16" placeholder="Public API key" autocomplete="off">
            <button class="obn-input-btn obn-input-group" type="button" id="obn_save_apikey">Save</button>
           </div>
           <div id="ts_api_input">
            <input class="obn-input obn-input-group" type="text" id="obn_ts_apikey_input" required minlength="16" maxlength="19" placeholder="Torn Stats API key" autocomplete="off">
            <button class="obn-input-btn obn-input-group" type="button" id="obn_save_ts_apikey">Save</button>
           </div>
         </div>

         <div class="obn-row obn-error">
             <p id="obn_error">&nbsp;</p>
         </div>

            <div>
                <input type="checkbox" class="obn-checkbox" id="obn-scrollbar">
                <label class="noselect">
                    Hide Scrollbar
                </label>
            </div>
            <div>
                <input type="checkbox" class="obn-checkbox" id="obn-hide-desc">
                <label class="noselect">
                    Hide Profile Faction Description
                </label>
            </div>
            <div>
                <input type="checkbox" class="obn-checkbox" id="obn_new_window">
                <label class="noselect">
                    Open Attacks in New Window
                </label>
            </div>
         </div>

        </div>
    </div>
    `;

    //Click event to show/hide modal
    $('#obn-float-btn').click((e) => {
        e.preventDefault();
        e.stopPropagation();
        $('#walla-walla').toggleClass('obn-hide');
        $('#obn-bg').toggleClass('obn-darken-bg');
    });

    $('#obn_save_apikey').click(function() {
        $("#obn_error").html("&nbsp;");
        const api = $('#obn_apikey_input').val();
        if (!api) {
            localStorage.setItem('obn_apikey', api);
            return;
        }
        if (api && api.length != 16) {
            $('#obn_error').text("API key invalid");
            return;
        }

        const request_url = `https://api.torn.com/user/?selections=&comment=obn_script&key=${api}`;

        GM_xmlhttpRequest ({
            method:     "GET",
            url:        request_url,
            headers:    {
                "Content-Type": "application/json"
            },
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if(data.error) {
                        $('#obn_error').text(data.error.error);
                    } else {
                        APIKEY = api;
                        localStorage.setItem('obn_apikey', api);
                    }
                }
                catch (e) {
                    console.error(e);
                }

            },
            onerror: (e) => {
                console.error(e);
            }
        })
    });

    $('#obn_save_ts_apikey').click(function() {
        $("#obn_error").html("&nbsp;");
        const tsapi = $('#obn_ts_apikey_input').val();
        if (!tsapi) {
            localStorage.setItem('obn_ts_apikey', tsapi);
            return;
        }
        if (tsapi && (tsapi.length < 16 || tsapi.length > 19)) {
            $('#obn_error').text("API key invalid");
            return;
        }
        const request_url = `https://www.tornstats.com/api/v2/${tsapi}`;
        GM_xmlhttpRequest ({
            method:     "GET",
            url:        request_url,
            headers:    {
                "Content-Type": "application/json"
            },
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if(!data.status) {
                        $('#obn_error').text(data.message);
                    } else {
                        TS_APIKEY = tsapi;
                        localStorage.setItem('obn_ts_apikey', tsapi);
                        getTSSPYAPI("faction", factionID);
                    }
                }
                catch (e) {
                    console.error(e);
                }

            },
            onerror: (e) => {
                console.error(e);
            }
        })
    });


    if (APIKEY) {
        $('#obn_apikey_input').val(APIKEY);
    }
    if (TS_APIKEY) {
        $('#obn_ts_apikey_input').val(TS_APIKEY);
        getTSSPYAPI("faction", factionID);
    }

    try {
        initializeTooltip('.obn-container', 'white-tooltip');
    } catch {}
}

function createWebSocketConnection() {
    socket = new WebSocket("wss://ws-centrifugo.torn.com/connection/websocket");

    //Create on open listener
    socket.onopen = function(e) {
        //console.log("[open] Connection established");
        //console.log("Sending to server");

        var params = {
            "params": {"token": getWebSocketToken()},
            "id": 1
        };

        socket.send(JSON.stringify(params));
        //console.log("[Sent to server]", params);
    };

    //Create on message listener
    socket.onmessage = function(event) {

        //console.log(`[WS][message] Data received from server: ${event.data}`);
        var data = JSON.parse(event.data);
        //console.log('[WS][message]', data);

        //If recieved message is initial connection for elimination, send back correct params
        if (data.id && data.id == 1 && data.result && data.result.version) {
            if (!factionID) return;
            var params = {"method":1,"params":{"channel":`faction-users-${factionID}`},"id":2}


            socket.send(JSON.stringify(params));
            //console.log("[Sent to server]", params);
        }

        if (data?.result?.channel == `faction-users-${factionID}`) {
            const iconObj = data?.data?.data?.message?.namespaces?.users?.actions?.updateIcons;
            if (!isObjectEmpty(iconObj)) {
                //parseIcons(iconObj.icons);
            }
        }
    };

    //Create on close listener
    socket.onclose = function(event) {
        if (event.wasClean) {
            //console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            //console.log('[close] Connection died.');
            //console.log("Reconnecting...");
            createWebSocketConnection(); //Recursive connection
        }
    };

    //Create on error listener
    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`, error);
    };

}

function getWebSocketToken() {
    var websocketConnectionDataElement = document.getElementById('websocketConnectionData');
    var data = JSON.parse(websocketConnectionDataElement.innerText);

    return data.token;
}

const SI_PREFIXES = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 't' },
    { value: 1e15, symbol: 'q' },
    { value: 1e18, symbol: 'Q' },
    { value: 1e21, symbol: 's' },
    { value: 1e24, symbol: 'S' }
]

const abbreviateNumber = (number) => {
    if (number === 0) return number;
    if (isNaN(number)) return number;

    const tier = SI_PREFIXES.filter((n) => number >= n.value).pop()
    const numberFixed = (number / tier.value).toFixed(1)

    return `${numberFixed}${tier.symbol}`
  }

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const isObjectEmpty = (objectName) => {
    return JSON.stringify(objectName) === "{}";
};

$.fn.random = function() {
    return this.eq(Math.floor(Math.random() * this.length));
}

GM_addStyle(`
.obn-floater a, a.obn-intercept {
    cursor: pointer;
    color: #069;
    text-decoration: none;
}
.dark-mode .obn-floater a, a.obn-intercept {
    color: #74c0fc;
}

.obn-intercept-wrap {
    display: flex;
}
.obn-intercept-wrap > div {
    margin-right: 5px;
}

.obn-floater {
   z-index: 99998;
   min-height: 400px;
   width: 784px;
   height: auto;
   background-color: var(--tooltip-bg-color);
   border: var(--mini-profile-border);
   border-radius: 5px;
   position: fixed;
   left:  calc(50% + 96px);
   top: 8%;
   transform: translate(-50%, 0);
   visibility: visible;
   opacity: 1;
   transition: opacity 250ms ease-in, visibility 0ms ease-in 0ms;
   max-height: calc(100vh - 15%);
   overflow-y: auto;
   overflow-x: hidden;
}

.obn-float-button {
    z-index: 99999;
    height: 40px;
    width: 66px;
    color: #ff5722;
    cursor: pointer;
    right: -10px;
    top: 170px !important;
    padding: 11px 30px 11px 10px;
    box-sizing: border-box;
    border: 1px solid var(--default-panel-divider-outer-side-color);
    position: fixed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

    display: flex;
    justify-content: space-between;
    align-items: center;
    text-shadow: var(--default-tabs-text-shadow);
    background: var(--info-msg-bg-gradient);
    box-shadow: var(--default-tabs-box-shadow);
    border-radius: 5px;
    overflow: hidden
}

.obn-float-button.join-wall, .obn-float-button.obn-ed {
    width: 120px;
}
.obn-float-button.obn-left {
    left: -10px;
    right: unset;
    padding: 11px 10px 11px 20px;
}

.obn-float-button.join-wall .obn-float-icon {
    font-size: 16px;
    font-weight: 700;
}
.obn-float-button.obn-ed .obn-float-icon {
    font-size: 15px;
    font-weight: 700;
}

.obn-float-icon {
    font-weight: 400;
    line-height: 18px;
    font-size: 30px;
    font-family: arial;
}
.obn-hide {
  visibility: hidden;
  opacity: 0;
  transition: opacity 250ms ease-in, visibility 0ms ease-in 250ms;
}

#obn_error {
  color: var(--default-red-color);
  letter-spacing: 1px;
}

.obn-darken-bg {
   background-color: rgb(0,0,0);
   width: 100%;
   height: 100%;
   position: fixed;
   top: 0;
   left: 0;
   opacity: 0.5;
   transition: all 250ms ease-in;
   z-index: 99997;
}

.obn-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-top: 10px;
}

.obn-row {
   display: flex;
   flex-wrap: wrap;
   justify-content: center;
   margin-top: 10px;
}

.obn-row.obn-page {
   margin-top: 20px;
}

.obn-row.obn-settings {
   flex-direction: column;
}

.obn-settings > div {
   margin-bottom: 5px;
}

.obn-memberlist {
   margin-top: 2em;
   margin-bottom: 10em;
}

.obn-memberlist > div {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.obn-memberlist > div.obn-loader {
  flex-basis: 100%;
  flex-direction: row;
}

.obn-userlist {
  flex-direction: column;
}

.obn-userlist .obn-filter-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.obn-userlist .obn-filter-buttons > div {
  margin: 0.25em;
}

.obn-userlist label {
  width: 75px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 11px;
  /*cursor: pointer;*/
  padding-right: 5px;
  color: var(--btn-color);
  text-shadow: var(--btn-text-shadow);
  background: var(--btn-background);
  border: var(--btn-border);
}
/*.obn-userlist label:hover {
  color: var(--btn-hover-color);
  text-shadow: var(--btn-hover-text-shadow);
  background: var(--btn-hover-background);
  border: var(--btn-hover-border)
}*/

.obn-userlist input:checked ~ label {
  box-shadow: 0 0 0 1px #000000;
}
body.dark-mode .obn-userlist input:checked ~ label {
  box-shadow: 0 0 0 1px #d4d4d4;
}


.obn-userlist input[type="checkbox"] {
  display: none;
}


.obn-rounded-btn {
  border-radius: 100px;
  border: 1px solid var(--default-panel-divider-outer-side-color);
}

.obn-badge {
  display: inline-block;
  margin-left: 0.5em;
  padding: 4px 2px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 100px;
  color: #fff;
  line-height: 6px;
  text-align: center;
  width: 17px;
  text-shadow: 0px 0px 2px black;
}

.obn-badge#obn-onlineCount {
  background-image: linear-gradient(#a3d900, #4c6600);
}
.obn-badge#obn-idleCount {
  background-image: linear-gradient(#ffbf00, #b25900);
}
.obn-badge#obn-offlineCount {
  background-image: linear-gradient(#ccc, #666);
}

.obn-badge#obn-okayCount {
  background-color: var(--user-status-green-color);
}
.obn-badge.red {
  background-color: var(--user-status-red-color);
}
.obn-badge#obn-travelCount {
  background-color: var(--user-status-blue-color);
}

.obn-walls {
flex-direction: column;
align-items: center;
}

.obn-walls > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3em;
}

div .obn-war-title {
    margin-bottom: 5px;
    font-size: 16px;
}

.obn-war-title.territory {
    font-weight: 700;
    font-size: 18px;
}

.obn-table-head, .obn-table-body {
    max-width: 360px;
    width: 360px;
    font-size: 12px;
}

.obn-table-head {
    font-weight: 700;
}

.obn-table-row {
    width: 100%;
    border: 1px solid var(--default-color);
    border-bottom: 0;
    display: flex;
    justify-content: flex-start;
}
.obn-table-row:last-child {
    border-bottom: 1px solid var(--default-color);
}

.obn-table-cell {
    padding: 6px;
    box-sizing: border-box;
}
.obn-table-cell.member {
    flex-grow: 1;
    border-right: 1px solid var(--default-color);
}

.obn-table-cell.status {
    width: 70px;
    border-right: 1px solid var(--default-color);
}

.obn-table-cell.wall {
    width: 50px;
    border-right: 1px solid var(--default-color);
}

.obn-table-cell.stats {
    width: 60px;
    cursor: pointer;
}

.obn-table-cell.status.Hospital, .obn-table-cell.status.Jail, .obn-table-cell.status.Federal {
    color: var(--user-status-red-color);
}
.obn-table-cell.status.Okay {
    color: var(--user-status-green-color);
}
.obn-table-cell.status.Traveling, .obn-table-cell.status.Abroad {
    color: var(--user-status-blue-color);
}



.obn-table-cell.none {
   width: 100%;
   text-align: center;
}

.obn-apikeys > div {
   display: flex;
}

.obn-input {
width: 90%;
height: 23px;
border-radius: 5px;
border: 1px solid rgba(0, 0, 0, .5);
padding: 0 4px 0 10px;
background: var(--input-money-background-color);
color: var(--default-color);
}
.obn-input-group {
margin-top: 5px;
}
.obn-input.obn-input-group {
border-radius: 5px 0px 0px 5px !important;
width: 70%;
}
.obn-input-btn {
height: 25px;
border-radius: 5px;
background: var(--btn-background);
color: var(--btn-color);
border: 1px solid rgba(0, 0, 0, .5);
}
.obn-input-btn:hover {
  color: var(--btn-hover-color);
  text-shadow: var(--btn-hover-text-shadow);
  background: var(--btn-hover-background);
  border: var(--btn-hover-border);
}
.obn-input-btn:active {
background-color: #d9d9d9;
}
.obn-input-btn.obn-input-group {
border-radius: 0px 5px 5px 0px;
vertical-align: middle;
margin-left: -5px;
}

#obn_apikey_input, #obn_ts_apikey_input {
-webkit-text-security: disc;
-moz-text-security: disc;
text-security: disc;
}

button:not(:disabled) {
    cursor: pointer;
}

.obn-btn-group > .obn-btn {
    position: relative;
    flex: 1 1 auto;
    border-radius: 0.375em;
    user-select: none;
    vertical-align: middle;
    text-align: center;
    text-decoration: none;
    line-height: 1.5;
    display: inline-block;
    padding: 0.2em 0.75em;
    margin: 0;
    color: var(--btn-color);
    border: 1px solid var(--default-panel-divider-outer-side-color);
    text-shadow: var(--default-tabs-text-shadow);
    background: var(--info-msg-bg-gradient);
    box-shadow: var(--default-tabs-box-shadow);
}
.obn-btn-group > .obn-btn:hover {
  color: var(--btn-hover-color);
  text-shadow: var(--btn-hover-text-shadow);
  background: var(--btn-hover-background);
  border: var(--btn-hover-border);
}
.obn-btn-group > .obn-btn.active {

}

.obn-btn-group > .obn-btn.obn-first {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.obn-btn-group> .obn-btn.obn-mid {
    border-radius: 0;
}
.obn-btn-group>.obn-btn.obn-last {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

#obn_apikey_input::placeholder, #obn_ts_apikey_input::placeholder {
	-webkit-text-security: none;
}

[class*="statsWrap_"] [class*="participants_"] li {
    border: 1px solid;
}

.obn_spy_indicator {
    animation-direction: normal;
    animation-duration: .5s;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-name: showup___H3ao7;
    animation-timing-function: ease-in-out;
    background: transparent linear-gradient(180deg,hsla(0,0%,80%,0),#ccc 50%,#ccc) 0 0 no-repeat padding-box;
    bottom: 31px;
    height: 32px;
    justify-content: space-evenly;
    left: 0;
    position: absolute;
    right: 0;
    width: 100%;
    z-index: 10000;
}
.dark-mode .obn_spy_indicator {
    background: transparent linear-gradient(180deg,hsla(0,0%,80%,0),#333 50%,#333) 0 0 no-repeat padding-box;
    z-index: 1;
}

.obn-friendly {
      color: var(--default-green-color) !important;
}
.obn-enemy {
      color: var(--default-red-color) !important;
}

@media screen and (max-width: 1000px) {

.obn-floater {
   left: 50%
}

}

@media screen and (max-width: 784px) {

.obn-floater {
    width: 386px;
}

}
`);
