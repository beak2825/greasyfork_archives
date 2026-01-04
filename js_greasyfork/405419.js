// ==UserScript==
// @name         Steam ASF Idle Helper
// @namespace    Lex@GreasyFork
// @version      0.1.1
// @description  Lets you manage ASF's priority queue from a game's page or the Steam Badges page. Also lets you click a game on the Badges page to take you right to the associated store page.
// @author       Lex
// @match        https://steamcommunity.com/id/*/badges*
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/405419/Steam%20ASF%20Idle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405419/Steam%20ASF%20Idle%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    /*  Configure Custom Server or Password  */
    let ASF_SERVER = ""; // e.g. 127.0.0.1:1242
    let ASF_PASSWORD = ""; // e.g. 123456
    /*  End Configuration  */

    const STORE_PAGE = "https://store.steampowered.com/app/";
    const ASF_URL = "http://{0}/Api/Command";
    
    // Promise wrapper for GM_xmlhttpRequest
    const Request = details => new Promise((resolve, reject) => {
        details.onerror = details.ontimeout = reject;
        details.onload = resolve;
        GM_xmlhttpRequest(details);
    });
    
    async function sendASF(command) {
        if (Array.isArray(command))
            command = command.filter(e => e !== undefined).join(" ");
        const resp = await Request({
            method: "POST",
            url: ASF_URL.replace("{0}", ASF_SERVER),
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authentication: ASF_PASSWORD,
            },
            data: JSON.stringify({
                COMMAND: command,
            }),
        });
        return resp;
    }
    
    async function iqadd(id, bot) {
        this.disabled = true;
        const resp = await sendASF(['iqadd', bot, id]);
        const success = /Done\!/.test(resp.responseText);
        if (success) {
            this.value = "Added!";
            this.style.background = "lightgreen";
            let self = this;
            setTimeout(function(){
                setRemove(self);
            }, 1000);
        } else {
            this.value = "Error!";
        }
    }
    
    async function iqrm(id, bot) {
        this.disabled = true;
        const resp = await sendASF(['iqrm', bot, id]);
        const success = /Done\!/.test(resp.responseText);
        if (success) {
            this.value = "Removed!";
            this.style.background = "";
            let self = this;
            setTimeout(function(){
                setAdd(self);
            }, 1000);
        } else {
            this.value = "Error!";
        }
    }
    
    async function iqlist(bot) {
        const resp = await sendASF(['iq', bot]);
        let data;
        try {
            data = JSON.parse(resp.responseText);
        } catch (Exception) {
            console.log("Error retrieving iq list");
            console.log(resp.response);
            return;
        }
        let iqs = data.Result.split(",");
        iqs = iqs.map(e => e.trim());
        iqs[0] = iqs[0].split(" ")[1];
        return iqs;
    }
    
    async function handleIqList() {
        const iqs = await iqlist();
        
        document.querySelectorAll(".sbmi_app").forEach(b => {
            const appid = b.dataset.appid;
            const iqbtn = document.createElement("input");
            iqbtn.className = "iqbtn";
            iqbtn.dataset.appid = appid;
            iqbtn.dataset.iqfunc = "iqadd";
            iqbtn.type = "button";
            iqbtn.style.display = "block";
            iqbtn.style.margin = "0 auto";
            if (iqs.includes(appid))
                setRemove(iqbtn);
            else
                setAdd(iqbtn);
            b.append(iqbtn);
        });
    }

    function handlePage() {
        const badges = document.querySelectorAll(".badge_row");
        badges.forEach(b => {
            const card_drop_info_dialog = b.querySelector(".card_drop_info_dialog");
            if (!card_drop_info_dialog) return;
            const appid = card_drop_info_dialog.id.split("_")[4];
            const url = STORE_PAGE + appid;
            const badgeTitle = b.querySelector(".badge_title");
            const game_name = badgeTitle.innerText.trim();

            let div2 = document.createElement("div");
            b.prepend(div2);
            div2.innerHTML = `<a href="${url}">${badgeTitle.innerHTML}</a>`;
            div2.className = "badge_title";
            div2.style.position = "absolute";
            div2.style.left = "12px";
            div2.style.top = "12px";
            div2.style.zIndex = "3";
            badgeTitle.style.display = "none";
            
            const appArea = document.createElement("div");
            b.prepend(appArea);
            appArea.outerHTML = `<div data-appid="${appid}" class="sbmi_app" style="position:absolute; left:-150px; top: 80px"><input onClick="this.select();" style="width: 108px;" value="${appid}"></input></div>`;
        });
        
        handleIqList();
    }

    function waitForLoad(query, callback) {
        if (document.querySelector(query)) {
            callback();
        } else {
            setTimeout(waitForLoad.bind(null, query, callback), 100);
        }
    }
    
    // Handles loading and storing of custom settings
    function CustomSettings() {
        if (ASF_PASSWORD !== "") {
            GM_setValue("asf_password", ASF_PASSWORD);
        } else {
            ASF_PASSWORD = GM_getValue("asf_password", "");
        }
        if (ASF_SERVER !== "") {
            GM_setValue("asf_server", ASF_SERVER);
        } else {
            ASF_SERVER = GM_getValue("asf_server", "127.0.0.1:1242");
        }
    }
  
    // Sets a button to be in the 'add to idle queue?' state
    function setAdd(btn) {
        btn.disabled = false;
        btn.value = "Add to Idle Queue?";
        btn.style.background = "";
        btn.onclick = function(ev) {
            iqadd.call(ev.target, ev.target.dataset.appid);
        };
    }
  
    function setRemove(btn) {
        btn.disabled = false;
        btn.value = "Game is in Idle Queue";
        btn.style.background = "lightgreen";
        btn.onclick = function(ev) {
            iqrm.call(ev.target, ev.target.dataset.appid);
        }
    }
  
    async function handleGamePage() {
        const appid = location.href.match(/app\/(\d+)/)[1];
      
        const iqs = await iqlist();
        
        const iqbtn = document.createElement("input");
        iqbtn.className = "iqbtn";
        iqbtn.dataset.appid = appid;
        iqbtn.dataset.iqfunc = "iqadd";
        iqbtn.type = "button";
        iqbtn.style.display = "block";
        iqbtn.style.margin = "0 auto";
        if (iqs.includes(appid))
            setRemove(iqbtn);
        else
            setAdd(iqbtn);
        const cblock = document.getElementById("category_block").parentElement;
        cblock.insertAdjacentHTML('afterend', `<div><div class="block responsive_apppage_details_right heading">ArchiSteamFarm</div></div>
<div><div class="block responsive_apppage_details_right recommendation_reasons">
<p class="reason">Priority Idle Queue: <span id="iqarea" style="display:inline-block"></span></p>
</div></div>`);
        document.getElementById("iqarea").append(iqbtn);
    }
  
    CustomSettings();
    if (/steamcommunity\.com/.test(location.href))
      waitForLoad(".card_drop_info_dialog", handlePage);
    if (/steampowered\.com/.test(location.href))
      handleGamePage();
})();