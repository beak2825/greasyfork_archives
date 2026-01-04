// ==UserScript==
// @name         Stat Spy Script
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Ultimata stat script for adding spies
// @author       olesien
// @match        https://www.torn.com/profiles.php?XID=*
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1/plugin/relativeTime.js
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/478880/Stat%20Spy%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/478880/Stat%20Spy%20Script.meta.js
// ==/UserScript==

const formattedNumber = (
    num,
    returnZero = false
) => {
    if (!num || isNaN(num)) {
        if (returnZero) return 0;
        return "";
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const abbreviate = (value) => {
    return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
};
(function() {
    'use strict';
    GM_addStyle ( `
      .stat-total {
        color: orange;
      }
      .stat-weakness {
        color: green;
      }
      .stat-strong {
        color: red;
      }
      .custom-stat-box {
        padding: 0.25rem 0.5rem;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-size: 0.9em;
      }

      .custom-stat-box-attackpage {
        min-height: 52px;
        padding: 0.5rem;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-size: 1em;
        background-color: #333333;
        color: lightgray;
        border-radius: 5px;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .custom-stat-box-attackpage .flex {
         display: flex;
         gap: 1rem;
         flex-wrap: wrap;
         padding: 0.25rem;
      }

      .custom-stat-box .top-row {
          display: flex;
          justify-content: space-between;
          padding: 0 0.4rem;
      }

      .custom-stat-box .bottom-row {
          display: flex;
          justify-content: space-around;
      }

      .custom-stat-box p {
        padding: 0.2rem;
      }
   `);
    dayjs.extend(window.dayjs_plugin_relativeTime)
    let apiKey = String(localStorage.getItem("ultimata-key"));
    if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        console.log(key);
        if (key.length > 10) {
            console.log("setting....");
            localStorage.setItem("ultimata-key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }
    const observer = new MutationObserver((_, observer) => {

        const isAttackPage = window.location.href.includes("loader.php?sid=attack&user2ID=");
        if (!isAttackPage) {
            const outer = document.querySelector(".profile-container");
            if (outer) {
                const div = document.createElement("div");
                div.classList.add("empty-block");
                //div.style.position = "absolute";
                //div.style.bottom = "0";
                //div.style.width = "100%";
                div.style.paddingTop = "5px";
                outer.appendChild(div);
            }
        }
        let panel = document.querySelector(isAttackPage ? ".content-wrapper" : ".empty-block");
        const percentOfTotal = (stat, total) => {
            return Math.round((stat / total) * 100)
        }

        if (panel) {
            observer.disconnect();

            const statroot = document.createElement("div");
            statroot.innerHTML = "Loading...";
            statroot.className = isAttackPage ? "custom-stat-box-attackpage" : "custom-stat-box";
            panel.insertBefore(statroot, panel.children[1]);


            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get(isAttackPage ? 'user2ID' : 'XID');

            if (isAttackPage) {
                setTimeout(() => {
                    const names = document.querySelectorAll(".user-name");
                    console.log(names);
                    if (names.length > 1) {
                        const name = names[1];
                        name.innerHTML = `<a href="https://www.torn.com/profiles.php?XID=${userId}" style="color: lightblue;">${name.innerHTML}</a>`;
                    }
                }, 500);

            }

            const url = `https://ultimata.net/api/v1/spies/getplayer?id=${userId}&key=${apiKey}`;
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    const res = JSON.parse(response.responseText);
                    if (res?.error === false) {
                        const data = res?.data;
                        //We're in business!
                        const strengthPercent = percentOfTotal(data.strength, data.total);
                        const speedPercent = percentOfTotal(data.speed, data.total);
                        const defensePercent = percentOfTotal(data.defense, data.total);
                        const dexterityPercent = percentOfTotal(data.dexterity, data.total);
                        statroot.innerHTML = `
                         <div class="${isAttackPage ? 'flex' : 'top-row'}">
                            <p class="stat-total">Total: ${abbreviate(data.total)}</p>
                            <p>Spy Date: ${dayjs(data.spy_date).fromNow()}</p>
                         </div>
                         <div class="${isAttackPage ? 'flex' : 'bottom-row'}">
                            <p class="${strengthPercent <= 10 ? "stat-weakness" : (strengthPercent >= 50 ? "stat-strong" : "")}">Strength: ${abbreviate(data.strength)}</p>
                            <p class="${speedPercent <= 10 ? "stat-weakness" : (speedPercent >= 50 ? "stat-strong" : "")}">Speed: ${abbreviate(data.speed)}</p>
                            <p class="${defensePercent <= 10 ? "stat-weakness" : (defensePercent >= 50 ? "stat-strong" : "")}">Defense: ${abbreviate(data.defense)}</p>
                            <p class="${dexterityPercent <= 10 ? "stat-weakness" : (dexterityPercent >= 50 ? "stat-strong" : "")}">Dexterity: ${abbreviate(data.dexterity)}</p>
                       </div>

                       `
                    } else {
                        if (!res?.message?.toLowerCase()?.includes("found")) {

                            const btn = document.createElement("button");
                            btn.innerText = (res?.message ?? "Unknown error") + "-  Click here to reset your key";
                            btn.style.color = "red";
                            btn.addEventListener("click", () => {
                                const c = confirm("Are you sure you want to reset key?");
                                if (c) {
                                    localStorage.removeItem("ultimata-key");
                                    location.reload();
                                }
                            });

                            statroot.appendChild(btn);
                        } else{
                            statroot.innerHTML = (res?.message ?? "Unknown error")
                        }
                    }
                    console.log(res);
                },
                onerror: function (error) {
                    alert('Something went wrong, please let olesien know')
                }
            })
        }
    });

    observer.observe(document, { subtree: true, childList: true });
})();