// ==UserScript==
// @name         Utwente Cleaner
// @namespace    Ass
// @version      0.3
// @description  Remove unessecary elements from the webpage
// @author       You
// @match        http://websdr.ewi.utwente.nl:8901/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28915/Utwente%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/28915/Utwente%20Cleaner.meta.js
// ==/UserScript==
//var newStyle = "<style>#maincontrols { float:left; } #feedControls{white-space:nowrap;float: left;width: 325px;} #feedControls > div { display: block;box-sizing: border-box;margin: 0;}</style>";
var newStyle = "<style>#feedControls{ white-space:nowrap;width: 100%;background: white;height: 121px;} #feedControls > div { display: block;box-sizing: border-box;margin: 0; float:left; height:121px;}</style>";

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
document.onreadystatechange = function(e)
{
    if (document.readyState === 'complete')
    {
        setupElements();
        (document.head || document.documentElement).insertAdjacentHTML('beforeend',newStyle);
        
        document.body.innerHTML = (
            function(){ 
                var html = "";
                document.querySelectorAll("script").forEach(function(a){ html += a.outerHTML; });
                document.querySelectorAll("style").forEach(function(a){ html += a.outerHTML; });
                document.querySelectorAll("div.mainspan").forEach(function(a){ html += a.outerHTML; });
                return html;
            }
        )();
    }
};
function setupElements(){
    var feedControls = document.querySelector('div[style="white-space:nowrap;"');
    feedControls.id = "feedControls";
    feedControls.querySelectorAll(":scope > .ctl").forEach(function(ctl){
       
    });
    document.querySelectorAll("br").forEach(function(a){
        console.log(a.parentElement.classList);
        if(!a.parentElement.classList.contains("ctl"))
            a.remove();
    });
}