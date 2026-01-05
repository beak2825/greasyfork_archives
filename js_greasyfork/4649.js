// ==UserScript==
// @name           Reload 4 Kong
// @namespace      https://greasyfork.org/users/4818
// @description    Reload Kongregate games without refreshing their page.
// @author         SReject
// @version        3.0
// @match          *://www.kongregate.com/games/*/*
// @downloadURL https://update.greasyfork.org/scripts/4649/Reload%204%20Kong.user.js
// @updateURL https://update.greasyfork.org/scripts/4649/Reload%204%20Kong.meta.js
// ==/UserScript==

var d=document,s=d.createElement("script");
if (top===self&&/^(?:https?:\/\/)?(?:www\.)?kongregate\.com\/games\/[^\s\\\/]+\/[^\s\\\/]+$/i.test(d.location.href)) {
    s.type="text/javascript";
    d.head.appendChild(s.appendChild(d.createTextNode('('+function(){
        function reload4Kong(a){
            var b,d=document;
            var f=d.getElementById("fullscreen_button");
            b=f?.parentElement;
            if(document.readyState=="complete"){
                if(f!==null){ // October 2025 new layout
                    let a=d.createElement('button');
                    a.innerHTML=`<a href='' onclick=' document.getElementById("play-now-overlay").getElementsByTagName("BUTTON")?.[0].click(); if(document.getElementById("game").style.display != "none"){ document.getElementById("game").querySelector("iframe").src = document.getElementById("game").querySelector("iframe").src; } return false'>Reload</a>`;
                    b.insertBefore(a,f);
                }
                else if(holodeck&&activateGame&&(b=d.getElementById("quicklinks"))!==null){ // Pre-october 2025 layout
                    let a=d.createElement('li');
                    a.innerHTML=`<a href='' onclick='activateGame._alreadyActivated = false; activateGame._preloaded = false; activateGame(); document.getElementById("gameiframe").style.visibility = null; return false'>Reload</a>`;
                    b.insertBefore(a,b.firstChild);
                    holodeck.addChatCommand("reload",function(a,b){
                        a.displayUnsanitizedMessage("Reloading","Please wait...",{class: "whisper whisper_received"},{non_user:true});
                        activateGame._alreadyActivated = false;
                        activateGame._preloaded = false;
                        activateGame();
                        document.getElementById("gameiframe").style.visibility = null;
                        return false;
                    });
                }
            }
            else if(a){setTimeout(function(b){reload4Kong(b);},10000,a--);}
        }
        reload4Kong(10);
    }+')()')).parentNode);
}