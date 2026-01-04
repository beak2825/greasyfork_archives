// ==UserScript==
// @name         Final Earth QOL Tweaks
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Various UI tweaks
// @author       Natty_Boh[29066]
// @match        https://www.finalearth.com/*
// @match        https://finalearth.com/*
// @icon         https://www.google.com/s2/favicons?domain=finalearth.com
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/443645/Final%20Earth%20QOL%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/443645/Final%20Earth%20QOL%20Tweaks.meta.js
// ==/UserScript==
(async function() {

const config = { attributes: false, childList: true, subtree: false};

async function buildSettings() {
    const settingsObj = new Object();
    settingsObj.key = await GM.getValue("feqol_apiKey", "");
    settingsObj.font = await GM.getValue("feqol_font", false);
    settingsObj.elo = await GM.getValue("feqol_elo", false);
    settingsObj.copy = await GM.getValue("feqol_copy", false);
    settingsObj.activity = await GM.getValue("feqol_activity", false);
    settingsObj.quick = await GM.getValue("feqol_quick", false);
    settingsObj.chat = await GM.getValue("feqol_chat", false);
    settingsObj.list = await GM.getValue("feqol_chatList", "");
    return settingsObj;
}

const settings = await buildSettings();

const checkPage = async function(mutationsList, observer) {
    if (document.getElementById("main") && !document.getElementById("scriptSettings")) {
        settingsButton();
    }
    if (settings.elo && settings.key !== "" && document.querySelector(".inform") && !document.getElementById("elo_info")) {
        addElo();
    }
    if (settings.copy && document.querySelector(".wartop")) {
        copyWarPage();
    }
    if (settings.copy && document.querySelector(".forces-in-country__user")){
        copyForces();
    }
    if (settings.activity && settings.key !== "" && document.querySelector(".wartable1") && !document.getElementById("status_icon")) {
        setActivity();
    }
    if (settings.quick && document.getElementById("main") && !document.getElementById("quickGroup")) {
        quickButtons();
    }
};

const checkChat = async function (mutationsList, observer) {
    highlight();
}

const observer = new MutationObserver(checkPage);
observer.observe(document.getElementById("content"), config);

if (settings.chat) {
    const chatObserver = new MutationObserver(checkChat);
    chatObserver.observe(document.querySelector(".chat-box-wrap"), {attributes: false, childList: true, subtree: true});
}

if (settings.font) {
    GM_addStyle ( `
    #banner,  .scills,  .general,  .skillsContent,  .lead_ttl,  .cat_list,  .hq_stg_list,
     .hq_stg_tbl td,  h1,  h2,  h3,  h4,  h5,  h6,  .readall,  .delall,  th,
     .clearall,  .btn_faded,  .submit_pref,  a.back,  .log,  .menu_cont,
     .subbut,  .pr_button,  .btn_stl,  .wargroup,  .newsbutton a,  .but_link a,  .butlink,
     .largelink,  .captcha_ttl,  .training_status,  .readytimer,  .font_f,  .command_ttl,  .search_force,
     .help_section strong,  .help_section th {
        font-family:    Cinzel_Bold, serif !important;
    }
` );
    GM_addStyle ( `
     .control_bar_txt {
        font-family:    Cinzel_Bold, serif !important;
        letter-spacing: normal !important;
    }
` );
}

function addElo() {
    const userId = document.querySelector('.p2pchat').id
    const url = `https://www.finalearth.com/api/user?id=${userId}&key=${settings.key}`
    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            if (response.status === 200) {
                const json = JSON.parse(response.responseText)
                const elo = json.data.rating
                const elem = document.querySelector ( '.inform > br' )
                const info = `<span id = "elo_info">Elo: </span> ${elo} <br>`
                if(elem && !document.getElementById("elo_info")) {
                    elem.insertAdjacentHTML('afterend', info);
                }
            }
        },
        onerror: function (error) {
            console.log('Something went wrong')
        }
    })

}

function copyWarPage() {
    if (!document.getElementById('copy_button')) {
        const elem = document.querySelectorAll( '.wargroup > div' )
        const countryName = document.querySelector('.wartop > h5 > b > a').innerText
        let str = `**__${countryName}__**`
        elem.forEach(e => {
            if(e.childNodes.item(3).innerText.includes("Friendly")) {
                if(userTeam === "Axis") {
                    str += "\n" + ":red_circle: **Axis Units**"
                } else {
                    str += "\n" + ":green_circle: **Allies Units**"
                }
            }
            if(e.childNodes.item(3).innerText.includes("Enemy")) {
                if(userTeam === "Axis") {
                    str += "\n" + ":green_circle: **Allies Units**"
                } else {
                    str += "\n" + ":red_circle: **Axis Units**"
                }
            }
            for (let i = 3; i < e.childNodes.length; i = i + 2) {
                str += "\n" + e.childNodes.item(i).innerText
            }
        })
        const button = `<a class="back" id="copy_button" style=" position: absolute;right: 30px; top: 180px;">Copy</a>`
        const wartop = document.querySelector( '.wartop' )
        if(wartop) {
            wartop.insertAdjacentHTML('beforeend', button);
            const copyButton = document.getElementById('copy_button');
            copyButton.addEventListener('click', function () {
                navigator.clipboard.writeText(str);
            });
        }
    }
}

async function copyForces() {
    if (!document.getElementById('copy_button')) {
        let axisStr = ":red_circle: Axis Forces:\n"
        let alliesStr = ":green_circle: Allies Forces:\n"
        const leftSide = document.querySelector(".ForcesinCountry > div:nth-child(1) > div ")
        const rightSide = document.querySelector(".ForcesinCountry > div:nth-child(2) > div")
        const rightPlayerList = rightSide.querySelector(".mCSB_container")
        const leftPlayerList = leftSide.querySelector(".mCSB_container")

        for (let i = 0; i < rightPlayerList.children.length; i++) {
            if (rightSide.children[0].attributes[0].nodeValue === "#00D8A3") {
                alliesStr += rightPlayerList.children[i].innerText + "\n"
            }

            else if (rightSide.children[0].attributes[0].nodeValue === "#FF7272") {
                axisStr += rightPlayerList.children[i].innerText + "\n"
            }
            let elt = rightPlayerList.children[i].querySelector("div > a");
            if(elt) {
                fetchActivity(elt.href.split("=")[1], elt)
            }
        }
        for (let i = 0; i < leftPlayerList.children.length; i++) {
            if (leftSide.children[0].attributes[0].nodeValue === "#00D8A3") {
                alliesStr += leftPlayerList.children[i].innerText + "\n"
            }
            else if (leftSide.children[0].attributes[0].nodeValue === "#FF7272") {
                axisStr += leftPlayerList.children[i].innerText + "\n"
            }
            let elt = leftPlayerList.children[i].querySelector("div > a");
            if(elt) {
                fetchActivity(elt.href.split("=")[1], elt)
            }
        }
        let button = `<a class="back" id="copy_button" style="margin-right: 15px;">Copy</a>`
        let back = document.querySelector( '.back' )
        if(back) {
            back.insertAdjacentHTML('beforebegin', button);
            const copyButton = document.getElementById('copy_button');
            copyButton.addEventListener('click', function () {
                navigator.clipboard.writeText(alliesStr + axisStr);
            });
        }
    }
}

let cachedStatuses;
let statusesLastUpdated;
let countryNameAtLastCache;

async function setActivity() {
    const table = document.querySelector(".wartable1");
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i]
        const children = Array.from(row.cells[1].childNodes)
        for (let j = 0; j < children.length; j++) {
            const e = children[j]
            if (e && e.href && e.href.includes("userID")) {
                const uid = e.href.split("=")[1]
                await fetchActivity(uid, e);
            }
        }
    }
}

async function fetchActivity(uid, e) {
    const re = /(?:Scanning enemy and friendly forces in )/;
    const url = `https://www.finalearth.com/api/user?id=${uid}&key=${settings.key}`
    if (!cachedStatuses
        || Date.now()/1000 - statusesLastUpdated > 180
        || (countryNameAtLastCache != document.querySelector('.wartop > h5 > b > a')?.innerText
            && countryNameAtLastCache != document.querySelector(".command_ttl")?.innerText.split(re)[1])) { //init/refresh cache
        console.log("refresh cache");
        cachedStatuses = new Map();
    }
    if (!cachedStatuses.has(uid)) {
        console.log("waiting...")
        await new Promise(resolve => setTimeout(resolve, 500));
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    console.log("calling api...")
                    const json = JSON.parse(response.responseText)
                    const action = json.data.lastAction
                    cachedStatuses.set(uid, action)
                    statusesLastUpdated = Date.now()/1000;
                    countryNameAtLastCache = document.querySelector('.wartop > h5 > b > a')?.innerText
                        ?? document.querySelector(".command_ttl")?.innerText.split(re)[1]
                    displayIcon(action, e)
                }
            },
            onerror: function (error) {
                console.log('Something went wrong')
            }
        })
    } else {
        console.log("using cached result")
        displayIcon(cachedStatuses.get(uid), e);
    }
}




function displayIcon(action, e) {
    const online = `<a id="status_icon" style="display: inline-block; vertical-align: middle; height: 12px; width: 12px; background: url(/img/chat/tab_icons.png) left top; background-position: -14px -12px;"></a>`
    const idle = `<a id="status_icon" style="display: inline-block; vertical-align: middle; height: 12px; width: 12px; background: url(/img/chat/tab_icons.png) left top; background-position: -48px -12px;"></a>`
    const offline = `<a id="status_icon" style="display: inline-block; vertical-align: middle; height: 12px; width: 12px; background: url(/img/chat/tab_icons.png) left top; background-position: -82px -12px;"></a>`
    if(e) {
        if ( Date.now()/1000 - action < 300) {
            e.insertAdjacentHTML('afterbegin', online);
        }
        else if (Date.now()/1000 - action >= 300 && Date.now()/1000 - action <= 3600) {
            e.insertAdjacentHTML('afterbegin', idle);
        }
        else if (Date.now()/1000 - action >= 3600) {
            e.insertAdjacentHTML('afterbegin', offline);
        }
    }
}

async function highlight(){
    document.querySelectorAll('.message > a').forEach( e => {
        if (e.textContent.includes(userName)) {
            e.style.color = 'mediumBlue'
        }
    });
    const keywordsToHighlight = await settingToArray();
    keywordsToHighlight.push(userName)
    document.querySelectorAll('.message > span').forEach( e => {
        const text = e.textContent.toLowerCase();
        if (keywordsToHighlight.some(element => text.includes(element.toLowerCase()))) {
            e.style.backgroundColor = 'lightBlue'
        }
    });
}

async function settingToArray() {
    const string = await GM.getValue("feqol_chatList", "");
    if (string !== "") {
        const arr = string.split(',');
        return arr.map(e =>{ return e.trim()});
    }
    return [];
}

function settingsButton() {
    const hudButton = document.getElementById("show_hide_HUD");
    const settings = `<a id=scriptSettings class="btn_stl" style="position: absolute; top: 14px; left: 137px;z-index: 5000;margin: 0;">Settings</a>`
    hudButton.insertAdjacentHTML('afterend', settings);
    const settingsButton = document.getElementById('scriptSettings');
    settingsButton.addEventListener('click', function () {
        showScriptSettings()
    })
}

function quickButtons() {
    const groupTravel = `<a id=quickGroup class="btn_stl" style="position: absolute; top: 14px; left: 223px;z-index: 5000;margin: 0;" href="/Formations/grouptravel">Group Travel</a>`
    const hudButton = document.getElementById("show_hide_HUD");
    hudButton.insertAdjacentHTML('afterend', groupTravel);
    const news = `<a id=quickGroup class="btn_stl" style="position: absolute; top: 14px; left: 342px;z-index: 5000;margin: 0;" href="/world/worldNews">World News</a>`
    hudButton.insertAdjacentHTML('afterend', news);
}

//insert script settings form over existing content
function showScriptSettings() {
    const elem = document.getElementById ('content')
    elem.insertAdjacentHTML('beforebegin', html);
    elem.remove()
    populateExistingSettings()
    const settingsButton = document.getElementById('saveSettingsButton');
    settingsButton.addEventListener('click', function () {
        setSettings()
    });
}

//save settings and redirect to HQ page so normal content will show again
async function setSettings() {
    await GM.setValue("feqol_apiKey", document.getElementById('settingKey').value)
    await GM.setValue("feqol_font", document.getElementById('fontCheckbox').checked)
    await GM.setValue("feqol_elo", document.getElementById('eloCheckbox').checked)
    await GM.setValue("feqol_copy", document.getElementById('copyCheckbox').checked)
    await GM.setValue("feqol_activity", document.getElementById('activityCheckbox').checked)
    await GM.setValue("feqol_quick", document.getElementById('quickCheckbox').checked)
    await GM.setValue("feqol_chat", document.getElementById('chatCheckbox').checked)
    await GM.setValue("feqol_chatList", document.getElementById('chatList').value)
    location.reload();
}

//prefill form with the existing settings
async function populateExistingSettings() {
    document.getElementById('settingKey').value = await GM.getValue("feqol_apiKey", "");
    document.getElementById('fontCheckbox').checked = await GM.getValue("feqol_font", false);
    document.getElementById('eloCheckbox').checked = await GM.getValue("feqol_elo", false);
    document.getElementById('copyCheckbox').checked = await GM.getValue("feqol_copy", false);
    document.getElementById('activityCheckbox').checked = await GM.getValue("feqol_activity", false);
    document.getElementById('quickCheckbox').checked = await GM.getValue("feqol_quick", false);
    document.getElementById('chatCheckbox').checked = await GM.getValue("feqol_chat", false);
    document.getElementById('chatList').value = await GM.getValue("feqol_chatList", "");
}

const html = `<div id="content"> <div class="bigdiv"><form id="frm1" style="padding-top: 25px">
      API key: <input type="text" id="settingKey"><br><br>
     <h2>Feature Toggles:</h2>
      <input type="checkbox" id="fontCheckbox"> Use Allies font <br>
      <input type="checkbox" id="eloCheckbox"> Show elo on profile pages * <br>
      <input type="checkbox" id="copyCheckbox"> Add copy button on war page and forces page <br>
      <input type="checkbox" id="activityCheckbox"> Add activity indicators on war and forces page * <br>
      <input type="checkbox" id="quickCheckbox"> Add quick buttons (group travel and world news) <br> <br>
      <input type="checkbox" id="chatCheckbox"> Highlight my name and mentions in chat <br> <br>
      Mentions to highlight: <input type="text" id="chatList"><br>(input a comma separated list, username is included by default, can add nicknames or keywords.<br>
      <br><br>
      </form>
      <br><a><button id="saveSettingsButton" class="btn_stl">Save and Close</button></a><br><br>
      <br><br>
      <p> * API key required for feature </p>
      </div> </div>`

})();