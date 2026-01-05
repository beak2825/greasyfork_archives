// ==UserScript==
// @name         GMod host_workshop collection helper
// @namespace    https://schumann.pw/
// @version      0.1
// @description  Generates a LUA script to automate `resource.AddWorkshop` stuff~
// @author       Hendrik 'Bloody' Schumann
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        http://steamcommunity.com/sharedfiles/filedetails/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19287/GMod%20host_workshop%20collection%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/19287/GMod%20host_workshop%20collection%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateScript() {
        var items = document.getElementsByClassName('collectionItem');
        var lua = "local items = {\n";

        for(var i in items) {
            var it = items[i];
            if(!it.id) continue;
            var itemid = it.id.slice(it.id.indexOf('_')+1);
            if(lua.indexOf(itemid) !== -1) continue;
            
            lua += '\t["'+itemid+'"] = ';
            
            var itemTitle = it.getElementsByClassName('workshopItemTitle');
            if(itemTitle.length > 0) {
                var t = itemTitle[0];
                var title = t.innerText.replace('"', '\"').replace("'", "\'"); // poor mans injection protection
                lua += '\t "' + title + '",';
            } else {
                lua += '\t "Unknown (' + itemid + ')",';
            }
            
            lua += '\n';
            
        }
        lua += ' };\n';
        
        lua += `\nprint("Workshop collection helper by Hendrik 'Bloody' Schumann")
print("Adding workshop collection to resources:")
for k, v in pairs(items) do
	resource.AddWorkshop( k )
	print (" - " .. k .. " " .. v)
end
print ("Done!");`;
        
        return lua;
    };
    
    function showText(txt) {
        var body = "data:text/plain," + encodeURIComponent(txt);
        if(!window.open(body, 'GMod workshop collection helper')) {
            console.warn("Please allow popups on this page and try again.");
            return;
        }
    }
    
    window.mklua = function() { showText(generateScript()); };
})();