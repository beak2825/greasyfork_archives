// ==UserScript==
// @name         Discord Token Login
// @namespace    http://ecrimin.al
// @version      0.1
// @description  Adds a token login button to Discord login page and removes the passkey button
// @author       APZ
// @match        https://discord.com/login
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501683/Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/501683/Discord%20Token%20Login.meta.js
// ==/UserScript==

! function() {
    "use strict";
    async function e() {
        const e = prompt("Please enter your token:");
        if (e) try {
            const o = await fetch("https://discord.com/api/v9/users/@me", {
                    method: "GET",
                    headers: {
                        Authorization: e,
                        "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
                        "Sec-Ch-Ua-Mobile": "?0",
                        "Sec-Ch-Ua-Platform": '"Windows"',
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                        "X-Debug-Options": "bugReporterEnabled",
                        "X-Discord-Locale": "en-US",
                        "X-Discord-Timezone": "Asia/Tokyo",
                        "X-Super-Properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNi4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI2LjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjMwOTUxMywiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
                    }
                }),
                i = await o.json();
            if (401 === o.status) return void alert("Invalid token.");
            if (confirm(`Logging in as ${i.username} with ID ${i.id}. Do you want to proceed?`)) {
                const o = document.createElement("iframe");
                document.body.appendChild(o), o.contentWindow.localStorage.token = `"${e}"`, document.body.removeChild(o), setTimeout((() => location.reload()), 2500)
            } else alert("Login aborted by user.")
        } catch (e) {
            console.error("Error:", e), alert("Error validating the token.")
        } else alert("Error: No token provided.")
    }
    window.addEventListener("load", (() => {
        ! function() {
            const e = document.querySelector("button.button_dd4f85.lookLink_dd4f85.lowSaturationUnderline_c7819f.colorLink_dd4f85.sizeLarge_dd4f85.grow_dd4f85");
            e && e.remove()
        }(),
        function() {
            const o = document.querySelector(".qrLoginInner_c6cd4b");
            if (!o) return;
            const i = document.createElement("button");
            i.type = "button", i.className = "button_dd4f85 lookLink_dd4f85 lowSaturationUnderline_c7819f colorLink_dd4f85 sizeLarge_dd4f85 grow_dd4f85", i.innerHTML = '<div class="contents_dd4f85">Or, sign in with token</div>', i.onclick = e, o.appendChild(i)
        }()
    }))
}();
