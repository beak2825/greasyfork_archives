// ==UserScript==
// @name        ASF AddLicense Helper
// @description Make !addlicense commands clickable.
// @version     0.1.6
// @namespace   Lex@GreasyFork
// @author      Lex
// @match       *://*.steamgifts.com/discussion/*
// @match       *://*.reddit.com/r/FreeGamesOnSteam/comments/*
// @match       *://*.reddit.com/r/FreeGameFindings/comments/*
// @match       *://steam.madjoki.com/apps/free
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/405572/ASF%20AddLicense%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405572/ASF%20AddLicense%20Helper.meta.js
// ==/UserScript==

(function() {
    /*  Configure Custom Server or Password  */
    let ASF_SERVER = ""; // e.g. 127.0.0.1:1242
    let ASF_PASSWORD = ""; // e.g. 123456
    /*  End Configuration  */
    
    // Promise wrapper for GM_xmlhttpRequest
    const Request = details => new Promise((resolve, reject) => {
        details.onerror = details.ontimeout = reject;
        details.onload = resolve;
        GM_xmlhttpRequest(details);
    });
    
    async function sendASF(command) {
        if (Array.isArray(command))
            command = command.filter(e => e !== undefined).join(" ");
        const ASF_URL = "http://" + ASF_SERVER + "/Api/Command";
        return await Request({
            method: "POST",
            url: ASF_URL,
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
                Authentication: ASF_PASSWORD,
            },
            data: JSON.stringify({
                COMMAND: command,
            }),
        });
    }

    async function addLicenseClick(event) {
        const el = event.target;
        el.style.textDecoration = "";
        el.style.cursor = "";
        el.style.color = "inherit";
        el.onclick = undefined;
        console.log("Executing " + el.dataset.asfcommand);
        const resp = await sendASF(el.dataset.asfcommand);
        const indicator = document.createElement("span");
        if (resp.responseText.includes("Status: OK")) {
            indicator.innerText = "✔️";
            indicator.title = "Successfully added";
        } else {
            indicator.innerText = "❗";
            indicator.title = "Error adding license. See console for more info";
            console.log(resp.responseText);
        }
        el.after(indicator);
        return false;
    }
  
    // https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
    function textNodesUnder(el){
      let n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
      while(n=walk.nextNode()) a.push(n);
      return a;
    }
    
    function findCommands(ps) {
        const addreg = /\!addlicense\s+ASF\s+([as]\/\d+|sub\/\d+|app\/\d+|\d+)(?:,\s*([as]\/\d+|sub\/\d+|app\/\d+|\d+))*/gi;
        ps.forEach(p => {
            if (!p.innerText.includes("!addlicense")) return;
            textNodesUnder(p).forEach(node => {
                const ms = node.textContent.matchAll(addreg);
                for (const m of ms) {
                    // tail contains any remaining text after the ASF command
                    const tail = node.textContent.substring(m.index + m[0].length);
                    // truncate the existing text node at the start of the ASF command
                    node.textContent = node.textContent.substring(0, m.index);
                    // full ASF command
                    const cmd = m[0].trim();
                    const a = document.createElement("span");
                    a.style = "color:#4B72D4; background-color:inherit; cursor: pointer; text-decoration: underline; border:0;margin:0;padding:0;display:inline;text-align:inherit;"
                    a.dataset.asfcommand = cmd;
                    a.innerText = cmd;
                    a.onclick = addLicenseClick;
                    node.after(a);
                    // if text was present after the ASF command, append it as a new text node
                    if (tail !== "") {
                        a.after(document.createTextNode(tail));
                    }
                }
            })
        });
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
  
    CustomSettings();

    if (/steamgifts\.com/.test(location.href)) {
        const ps = document.querySelectorAll(".markdown > *");
        findCommands(ps);
    }
    if (/reddit\.com/.test(location.href)) {
        // Reddit does some late styling that will overwrite our changes, so we have to load even later
        setTimeout(function(){
            const ps = document.querySelectorAll("[class*=RichTextJSON-root]");
            findCommands(ps);
        }, 2000);
    }
    if (/steam\.madjoki\.com\/apps\/free/.test(location.href)) {
        const cmd = document.querySelector("[placeholder='!addlicense']").value;
        const add_asf_div = document.getElementById("add_asf");
        const a = document.createElement("span");
        a.style = "color:#4B72D4; background-color:inherit; cursor: pointer; text-decoration: underline; border:0;margin:0;padding:0;display:inline;text-align:inherit;";
        a.dataset.asfcommand = cmd;
        a.innerText = cmd;
        a.onclick = addLicenseClick;
        add_asf_div.append(a);
    }

})();