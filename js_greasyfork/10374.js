// ==UserScript==
// @name         Agar Auto-Explode
// @version      0.2
// @description  An added challenge to Agar.io.  If you are fed with 'w' mass, you die in an explosion
// @author       mikeyk730
// @match        http://agar.io/
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        none
// @namespace http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/10374/Agar%20Auto-Explode.user.js
// @updateURL https://update.greasyfork.org/scripts/10374/Agar%20Auto-Explode.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
        if (/^http:\/\/agar\.io\/main_out\.js/.test(mutations[i].addedNodes[0].src)) {
            var scriptNode = mutations[i].addedNodes[0];
            httpRequest(scriptNode.src, handleResponse);
            document.head.removeChild(scriptNode);
            observer.disconnect();
            break;
        }
    }    
});
observer.observe(document.head, {childList: true});

function httpRequest(source, callBack) {
    var request = new XMLHttpRequest();
    request.onload = function() {
        callBack(this.responseText);
    };
    request.onerror = function() {
        console.log("Response was null");
    };
    request.open("get", source, true);
    request.send();
}

function insertScript(script) {
    if (typeof jQuery === "undefined") {
        return setTimeout(insertScript, 0, script);
    }
    var scriptNode = document.createElement("script");
    scriptNode.innerHTML = script;
    document.head.appendChild(scriptNode);
}

function handleResponse(script) {
    script = script.replace(/(\r\n|\n|\r)/gm,"");
    script = addOnCellEatenHook(script);
    insertScript(script);
}

function addOnCellEatenHook(script) {
    var match = script.match(/81==\w+\.keyCode&&\w+&&\((\w+)\(/);
    var SendPacket = match[1];
    match = script.match(/1==(\w+)\.length&&\(/);
    var my_cells = match[1];
    match = script.match(/(\w+)&&(\w+)&&\((\w+)\.T/);
    var split = script.split(match[0]);
    return split[0] + match[1] + '&&' + match[2] + '&&((window.SendPacket='+SendPacket+'),(window.my_cells='+my_cells+'),OnCellEaten('+match[1]+','+match[2]+'),' + match[3] + '.T' + split[1];
}

function OnGainMass(me, other)
{
    var mass = other.size * other.size;
	// heuristic to determine if mass is 'w', not perfect
    if (!other.name && mass > 400 && mass <= 1444 && (mass >= 1369 || (other.x == other.ox && other.y == other.oy))){
        if (other.color != me.color){ //don't count own ejections, again not perfect
            SendPacket(20);            
        }
    }
}

window.OnCellEaten = function(predator, prey)
{
    if (!my_cells) return;

    if (my_cells.indexOf(predator) != -1){
        OnGainMass(predator, prey);
    }
}
