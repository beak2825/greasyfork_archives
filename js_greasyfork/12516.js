// ==UserScript==
// @name         艦これ Script
// @namespace    KancolleZenta
// @version      0.1
// @description  艦これ 自動修改 cookie / 自動直連
// @author       ZENTA
// @include      http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/
// @include      http://osapi.dmm.com/gadgets/*
// @include      http://*/kcs/*
// @grant        none
// @icon         http://otiai10.github.io/kanColleWidget/src/img/icon.png
// @downloadURL https://update.greasyfork.org/scripts/12516/%E8%89%A6%E3%81%93%E3%82%8C%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12516/%E8%89%A6%E3%81%93%E3%82%8C%20Script.meta.js
// ==/UserScript==

// alert("艦これ Script")

var loopfunc;
var iNodeList, iNode;

loopfunc = function() {
    
     if (location.host == "www.dmm.com") {
        
        // 烤餅乾
        document.cookie="ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=osapi.dmm.com;path=/";
        document.cookie="ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=203.104.209.7;path=/";
        document.cookie="ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.com;path=/netgame/";
        document.cookie="ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=log-netgame.dmm.com;path=/";
        
        // 直連詢問
		var game_frame = document.getElementById('game_frame');
		if (game_frame === null)
			window.setTimeout(loopfunc, 100);
		else {
			var conf = confirm("要轉換到直連視窗嗎?");
			if (conf) {
                window.location.href = game_frame.getAttribute("src");
			}
        }
        
    } else if (location.host == "osapi.dmm.com") {
    
        var externalswf = document.getElementById('externalswf');
        if (externalswf === null) {
		
			var maintenanceswf = document.getElementById('maintenanceswf');
			
			if (maintenanceswf === null)
				window.setTimeout(loopfunc, 100);
			else
				alert("維修中！");
		}
        else
		{
			window.location.href = externalswf.getAttribute("src");
		}
    }
};



if ((location.host == "www.dmm.com") ||
    (location.host == "osapi.dmm.com")) {
   
	window.setTimeout(loopfunc, 100);
	
} else {
   
    iNodeList = document.querySelectorAll("embed");
    iNode = iNodeList.item(0);
    iNode.style.width = "800";
    iNode.style.height = "480";
    
    var line = document.createElement("br"); // hr
    iNode.parentNode.insertBefore(line, Node.nextSibling);
    
    var button_1 = document.createElement('input');
    button_1.type ="button"
    button_1.value = "50%";
    button_1.onclick = function onclick(event){changeSize(50);};
    
    var button_2 = document.createElement('input');
    button_2.type ="button"
    button_2.value = "75%";
    button_2.onclick = function onclick(event){changeSize(75);};
    
    var button_3 = document.createElement('input');
    button_3.type ="button"
    button_3.value = "100%";
    button_3.onclick = function onclick(event){changeSize(100);};
    
    line.parentNode.insertBefore(button_3, line.nextSibling);
    button_3.parentNode.insertBefore(button_2, button_3);
    button_2.parentNode.insertBefore(button_1, button_2);
    
    var button_Reload = document.createElement('input');
    button_Reload.type ="button"
    button_Reload.value = "Reload";
    button_Reload.onclick = function onclick(event){location.reload();};
    button_3.parentNode.insertBefore(button_Reload, button_3.nextSibling);

}

function changeSize(size) {
    iNode.style.width = 8*size;
    iNode.style.height = 4.8*size;
}