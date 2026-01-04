// ==UserScript==
// @name         Bonk Friends - red mod
// @version      0.4a
// @description  Notifies user when friends are online
// @author       Inertia `int#0039`; modded by rrreddd
// @namespace    https://greasyfork.org/en/users/962705
// @license      MIT
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/451897/Bonk%20Friends%20-%20red%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/451897/Bonk%20Friends%20-%20red%20mod.meta.js
// ==/UserScript==

/* thanks to Salama/Salamana_ for pitching the idea, go say hi to him `Salama#2411` :); *from red*: thanks to int for writing this...i just made it smaller o.o
 */
(function() {

    var masterVar = true;
    var refreshRate = 30000;
    var clickDelay = 2000;

    let onlineNotifyBar = document.createElement("div");
    let onlineNotifyBarTop = document.createElement("div");
    onlineNotifyBar.innerText = 'Loading...'
    onlineNotifyBar.style = `
                        min-height:400px;
                        max-height:400px;
                        min-width:120px;
                        max-width:120px;
                        position:absolute;
                        right:1%;
                        top:70px;
                        font-family:'futurept_b1';
                        border-bottom-left-radius:5px;
                        border-bottom-right-radius:5px;
                        background-color:#696969;
                        padding-top:10px;
                        padding-left:5px;
                        padding-right:5px;
                        `;
    onlineNotifyBarTop.innerText = 'Online Friends';
    onlineNotifyBarTop.style = `
                        min-height:20px;
                        max-height:20px;
                        min-width:130px;
                        max-width:130px;
                        position:absolute;
                        right:1%;
                        top:60px;
                        font-family:'futurept_b1';
                        font-size:14px;
                        border-top-left-radius:5px;
                        border-top-right-radius:5px;
                        background-color:#424242;
                        color:white;
                        text-align:center;
                        line-height:1vw;
                        `;
    document.body.appendChild(onlineNotifyBar);
    document.body.appendChild(onlineNotifyBarTop);

    function updateFriends() {
        document.getElementById("friends_refresh_button").click();
        setTimeout(() => {
            const onlineGet = Array.from(document.getElementById("friends_online_table").getElementsByClassName("friends_cell_name")).map(e => {
                return e.textContent
            });
            const onlineSorted = [...onlineGet].sort((a, b) => {
                return a.localeCompare(b, undefined, {sensitivity: 'base'});
            });
            const onlineGetFancy = onlineSorted.join('\n');
            onlineNotifyBar.innerText = onlineGetFancy;
        }, clickDelay);
    }

    while(!document.getElementById("friends_refresh_button")) {}

    setTimeout(() => {
        updateFriends();
    }, 2500);

    setInterval(() => {
        updateFriends();
    }, refreshRate - clickDelay);

})();