// ==UserScript==
// @name         Filter lemmy.ml communities
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  filter unwanted communities from showing up in your lemmy.ml feed
// @author       bigguy
// @match        https://lemmy.ml/home/data_type/Post/*
// @match        https://lemmy.ml
// @icon         https://www.google.com/s2/favicons?domain=lemmy.ml
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/426314/Filter%20lemmyml%20communities.user.js
// @updateURL https://update.greasyfork.org/scripts/426314/Filter%20lemmyml%20communities.meta.js
// ==/UserScript==

//simple scrappy way to auto filter unwanted communities from showing up in your feed
//a link (Y) shows up next to the community name in your feed which you press to filter that community
//to undo a filtered community: you need to press H key to halt all further filtering, then refresh, now you can select 'N' link.
//press H again to toggle halting on/off - no need to refresh turning halt off.

var fucks = GM_getValue("fuckers",[]); //local storage within userscript space
var halt = GM_getValue("halt",false);
console.log("community filter on", fucks);
function removePosts() {
    document.querySelectorAll('.list-inline-item').forEach(function(postinner) {

        var links = postinner.getElementsByTagName('a');
        if (links.length > 1) {
            var curl = postinner.getElementsByTagName('a')[1].href.split('/');
            var community = curl[3]+'/'+curl[4];
            //console.log(community);

            if (!halt && community && fucks.includes(community)) {
                console.log(community + ' the fucker, has been blocked');
                //console.log(postinner.parentElement.parentElement.parentElement.parentElement.parentElement);
                postinner.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
            }
        }

    });
};

function applyButtons() {
    if (document.getElementsByClassName("togg").length == 0 && document.getElementsByClassName("toff").length == 0){
        document.querySelectorAll('.list-inline-item').forEach(function(postinner) {
            //console.log(postinner.getElementsByTagName('a').length);
            var links = postinner.getElementsByTagName('a');
            if (links.length > 1) {
                var curl = postinner.getElementsByTagName('a')[1].href.split('/');
                var community = curl[3]+'/'+curl[4];
                //console.log(community);

                var a = document.createElement('a');
                a.className = 'togg';
                //a.href = 'javascript:void(0)'; //causes chrome to shit the bed with the script.
                a.innerText = " [Y] ";
                a.onclick = function test(){ fucks.indexOf(community) === -1 ? fucks.push(community) : null; GM_setValue("fuckers", fucks); console.log(fucks); removePosts(); postinner.parentElement.parentElement.getElementsByClassName("post-title")[0].innerText = ",'" + community + "'";}
                postinner.append(a);
                if (community && fucks.includes(community)) {
                    var b = document.createElement('a');
                    b.className = 'toff';
                    b.innerText = " [N] ";
                    b.onclick = function test(){ delete fucks[fucks.indexOf(community)]; GM_setValue("fuckers", fucks); console.log(fucks);}
                    postinner.append(b);
                }
            }
        });
    }
};
setInterval(applyButtons, 5000);
setInterval(removePosts, 3000); //lemmy is a dynamic site so I am spamming the function execution since I can't remember what dom modification I need to listen for.
applyButtons();

document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyS'){ //start
            applyButtons();
        }
        if (event.code == 'KeyF'){ //filter
            removePosts();
        }
        if (event.code == 'KeyR'){ //reset fully
            //GM_setValue("fuckers", [])
        }
        if (event.code == 'KeyL'){ //list
            console.log(fucks);
        }
        if (event.code == 'KeyH'){ //halt
            halt = !halt;
            console.log("halting", halt);
            GM_setValue("halt", halt);
            removePosts();
        }
});

