// ==UserScript==
// @name         Serross Generator
// @version      0.1
// @description  Token Generator
// @author       Serross
// @run-at       document-start
// @match        https://discord.com/Serross
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/736763
// @downloadURL https://update.greasyfork.org/scripts/430322/Serross%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/430322/Serross%20Generator.meta.js
// ==/UserScript==
setTimeout(() => {
    window.stop();
}, 1)
window.location.reload(true);
const html = `
<title>Serross Generator</title>
<h1 align = 'center' style="color: #FFFFFF;">🖥️ 𝐒𝐄𝐑𝐑𝐎𝐒𝐒 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐎𝐑 🖥️</h1>
<h3 align = 'center'Serross Generator</h3>
<button id="loadcap">&nbsp;&nbsp;𝐋𝐎𝐀𝐃 𝐇𝐂𝐀𝐏𝐓𝐂𝐇𝐀&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>&nbsp;<button id="reloadcap">&nbsp;𝐑𝐄𝐋𝐎𝐀𝐃 𝐂𝐀𝐏𝐓𝐂𝐇𝐀</button>&nbsp;</button>&nbsp;<button id="gentoken">&nbsp;𝐆𝐄𝐓 𝐂𝐀𝐏𝐓𝐂𝐇𝐀 𝐊𝐄𝐘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button><br /><br /><br /><br /><br /><br />
<div align = 'center' class="h-captcha" data-sitekey="f5561ba9-8f1e-40ca-9b5b-a0b3f719ef34" data-theme="dark"></div>
`
/* load my html*/
document.body = document.createElement("body");
document.body.innerHTML = html;

/* clear discord html*/
document.head.innerHTML = "";

function add(type) {
    if (type == "done") {
        var value = parseInt(document.getElementById("textDone").innerHTML);
        value = value + 1;
        document.getElementById("textDone").innerHTML = value
    } else {
        var value = parseInt(document.getElementById("textfail").innerHTML);
        value = value + 1;
        document.getElementById("textfail").innerHTML = value
    }
}

function setmsg(text) {
    document.getElementById("textmsg").innerHTML = text;
}

function load_cap_api() {
    var btn = document.createElement("script");
    btn.src = "https://hcaptcha.com/1/api.js?hl=en";
    document.body.appendChild(btn);
}

function reload_cap_api() {
    location.reload();
}

function gen_token() {
    try {
        var rescap = document.getElementsByTagName("iframe")[0].getAttribute("data-hcaptcha-response");
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost/?recapkey=" + rescap,
            onload: function(res) {
                console.log(res.responseText)
                const text = JSON.parse(res.responseText);
                if (text.message != "DONE") {
                    setmsg(`${text.message} Try again in ${text.cooldown}s.`)
                    add("fail")
                } else {
                    //setmsg(text.token)
                    add("done")
                }
            },
            onerror: function(res) {
                setmsg("Host Down");
            }
        });
    } catch {
        setmsg("hcaptcha not solve")
}
}
/* set btn event */
document.getElementById("loadcap").addEventListener("click", load_cap_api);
document.getElementById("reloadcap").addEventListener("click", reload_cap_api);
document.getElementById("gentoken").addEventListener("click", gen_token);
/* set css body */
document.body.style = "background-color: #23272A; font-family: 'Roboto Mono', monospace;"