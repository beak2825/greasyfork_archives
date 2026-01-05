// ==UserScript==
// @name           Reload 4 Kong *OLD*
// @namespace      tag://kongregate
// @description    Reload games without refreshing the page.
// @author         SReject
// @version        1.2.2.1
// @date           2013.05.21
// @include        *://www.kongregate.com/games/*/*
// @downloadURL https://update.greasyfork.org/scripts/18413/Reload%204%20Kong%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/18413/Reload%204%20Kong%20%2AOLD%2A.meta.js
// ==/UserScript==

var d=document,s=d.createElement("script");
if (top===self&&/^(?:https?:\/\/)?(?:www\.)?kongregate\.com\/games\/[^\s\\\/]+\/[^\s\\\/]+$/i.test(d.location.href)) {
	s.type="text/javascript";
	d.head.appendChild(s.appendChild(d.createTextNode('('+function(){
        reload4Kong=function(a){
            var b,d=document;
            if(holodeck&&activateGame&&(b=d.getElementById("quicklinks"))!==null){
                a=d.createElement('li');
                a.innerHTML='<a href="" onclick="activateGame();return false">Reload</a>';
                b.insertBefore(a,b.firstChild);
                holodeck.addChatCommand("reload",function(a,b){
                    a.displayUnsanitizedMessage("Reloading","Please wait...",{class: "whisper whisper_received"},{non_user:true});
                    activateGame();
                    return false
                });
                setTimeout(function(){delete reload4Kong},1)
            }
            else if(a){setTimeout(function(b){reload4Kong(b)},10000,a--)}
            else{setTimeout(function(){delete reload4Kong},1)}
        }
        reload4Kong(10);
	}+')()')).parentNode);
}