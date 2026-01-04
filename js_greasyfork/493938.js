// ==UserScript==
// @name         Blooket AntiBot
// @namespace    https://cryptodude3.github.io/
// @version      1.4
// @description  a standalone decent antibot for blooket
// @author       ducklife3141
// @match        https://*.blooket.com/*
// @icon         https://ac.blooket.com/play-l/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493938/Blooket%20AntiBot.user.js
// @updateURL https://update.greasyfork.org/scripts/493938/Blooket%20AntiBot.meta.js
// ==/UserScript==

function reactHandler() {
    return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
}
// antibot code
window.bannedbots = [];
var bind = 0;
var breg = /^([^\d]+)([\d]+)$/;
window.run = 0;
async function antibot(){
    if(window.run>1){return;}
    if(window.run>0){
    if(reactHandler().props.liveGameController._liveApp.database()._delegate._repo.server_.listens.size < 1){
    patchab();
    console.log("Game listener added!");
    window.run++;
    }
    return;
    }
    if(!reactHandler().props.liveGameController){return;}
    if(!reactHandler().props.liveGameController.getDatabaseVal){return;}
    if(!reactHandler().props.liveGameController._liveApp){return;}
    if(!reactHandler().props.liveGameController._liveApp.database()){return;}
    if(!reactHandler().props.liveGameController._liveApp.database()._delegate._repoInternal.server_){return;}
    if(!document.querySelector("#idNum")){return;}
    console.log("Anti-Bot listener added!");
    patchab();
    window.run++;
}
function patchab(){
reactHandler().props.liveGameController._liveApp.database().ref(`${reactHandler().props.liveGameController._liveGameCode}/c`).on("value",v=>antib(v.val()));
}
async function antib(e) {
        console.log(e);
        if(!e){return;}
            var fa = Object.keys(e).filter(e => breg.test(e));
            checkForBots(fa);
            fa.forEach(e => {
                bannedbots.forEach(async a => {
                    if (e.includes(a)) {
                        reactHandler().props.liveGameController.blockUser(e);
                        bind++;
                        if(bind>15){
                        bind=0;console.log("ws");
                        await wait(420);console.log("we");}
                    }
                });
            });
            for (var i in e) {
                if (typeof e[i].b === "object" || typeof e[i].tat === "object" || i === "constructor" || e[i].rt || i.includes("sahar")) {
                    reactHandler().props.liveGameController.blockUser(i);
                }
            }
}
function wait(d) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, d);
  });
}

function check(array, amt) {
    const occurrences = {};
    const result = [];
    for (let str of array) {
        occurrences[str] = (occurrences[str] || 0) + 1;
        if (occurrences[str] >= amt && !result.includes(str)) {
            result.push(str);
        }
    }
    return result.length > 0 ? result : null;
}

function checkForBots(names) {
    var n = names;
    if (n.length > 0) {
        var t = n.map(e => e.match(breg)[1]);
        var ch = check(t, 2);
        if (ch) {
            if (ch.length > 0) {
                console.log(ch);
                ch.forEach(f => {
                    if (window.bannedbots.indexOf(f) === -1) {
                        window.bannedbots.push(f);
                    }
                    n.filter(a => a.includes(f)).forEach(d => {
                        reactHandler().props.liveGameController.removeVal("c/" + d);
                    });
                });
            }
        }
    }
    return [];
}
// end
setInterval(munfun,100);