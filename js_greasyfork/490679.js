// ==UserScript==
// @name         Attack Timers
// @namespace    http://tampermonkey.net/
// @version      2024-03-23-2
// @description  See attack data on the attack page (like online, hosp countdown etc)
// @author       olesien
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490679/Attack%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/490679/Attack%20Timers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const recheckSpeed = 5000 //5000 = 5 seconds, absolute min 1 second
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

    const getLongDiff = (seconds) => {
        //SS
        if (seconds <= 59) {
            return `${seconds} second${seconds !== 1 ? "s" : ""}`;
        }

        //SS HH
        if (seconds <= 300) {
            const min = Math.floor(seconds / 60);
            const sec = seconds - min * 60;
            return `${min} min${min !== 1 ? "s" : ""} ${sec} sec${
            sec !== 1 ? "s" : ""
        }`;
        }

        //MM
        if (seconds <= 60 * 60 - 1) {
            const min = Math.round(seconds / 60);
            return `${min} min${min !== 1 ? "s" : ""}`;
        }

        //MM HH
        const hrs = Math.floor(seconds / (60 * 60));
        const min = Math.floor(seconds / 60) - hrs * 60;
        return `${hrs} hr${hrs !== 1 ? "s" : ""} ${min} min${min !== 1 ? "s" : ""}`;
    };

    function getData() {
        console.log("DOING IT");
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get("user2ID");

        const url = `https://api.torn.com/user/${userId}?selections=&key=${apiKey}&comment=attack_checker_script`;
        const titleEl = document.querySelector(".title___fOh2J");
        const parentEl = titleEl.parentNode;
        const existingDialogs = parentEl.querySelector(".dialogButtons___nX4Bz"); //Dialog is the one with la buttons

        if (titleEl) {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    let res = JSON.parse(response.responseText);
                    console.log("GOT DATA FROM TORN!!");
                    const description = res.status.description;
                    titleEl.innerHTML = description + ` <div style="display: flex; align-items: center; gap: 0.5rem; color: ${res.last_action.status === "Online" ? "green" : res.last_action.status === "Away" ? "orange" : "lightgray" };">LA: ${res.last_action.relative}</div>`;;
                    titleEl.style.color = res.status.color;
                    titleEl.style.display = "flex";
                    titleEl.style.justifyContent = "center";
                    titleEl.style.alignItems = "center";
                    titleEl.style.flexDirection = "column";
                    console.log(res);

                    if (res.status.until > 0 && res.status.state === "Hospital") {
                        //Let's set a countdown.

                        const i = setInterval(() => {
                            if (titleEl.classList.contains("finished")) return; //Fight is already over.
                            const epoch = Math.floor(Date.now() / 1000);
                            const diff = res.status.until - epoch;
                            if (diff > 0) {
                                //set time left
                                titleEl.innerHTML = "In hospital for " + getLongDiff(diff) + ` <div style="display: flex; align-items: center; gap: 0.5rem; color: ${res.last_action.status === "Online" ? "green" : res.last_action.status === "Away" ? "orange" : "lightgray" };">LA: ${res.last_action.relative}</div>`;
                            } else {
                                //Set OKAY
                                titleEl.innerHTML = `Okay <div style="display: flex; align-items: center; gap: 0.5rem; color: ${res.last_action.status === "Online" ? "green" : res.last_action.status === "Idle" ? "orange" : "lightgray" };">LA: ${res.last_action.relative}</div>`;
                                titleEl.style.color = "green";
                            }
                        }, 1000);

                        const ii = setInterval(() => {
                            console.log("rechecking...");
                            if (titleEl.classList.contains("finished")) return; //Fight is already over.
                            //Every 5 seconds check (if tab is active)
                            if (!document.hidden) {
                                // do what you need
                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: url,
                                    onload: function (response) {
                                        const newData = JSON.parse(response.responseText);
                                        if (res?.last_action) res = newData;
                                        console.log("GOT DATA FROM TORN!!");
                                    },
                                    onerror: function (error) {
                                        console.log('Something went wrong, please let olesien know')
                                    }
                                });
                            }
                        }, recheckSpeed);
                    }
                },
                onerror: function (error) {
                    alert('Something went wrong, please let olesien know')
                }
            })
        }

    }


    // Your code here...
    const observer = new MutationObserver((_, observer) => {
        let wrapper = document.querySelector("#attacker");
        if (wrapper) {
            observer.disconnect();
            getData()
        }
    });
    observer.observe(document, { subtree: true, childList: true });
})();