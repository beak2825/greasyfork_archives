// ==UserScript==
// @name         hand free dxonline.ruc
// @namespace    https://github.com/tandf
// @version      0.1
// @description  click checking dialog automatically
// @author       tandf
// @match        http://dxonline.ruc.edu.cn/index.php?s=/Index/vedio_cont/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404471/hand%20free%20dxonlineruc.user.js
// @updateURL https://update.greasyfork.org/scripts/404471/hand%20free%20dxonlineruc.meta.js
// ==/UserScript==

(function() {

function fuckChecking(){
    var success = false;
    var dialogs = $(".tanc2");
    for (var i = 0; i < dialogs.length; i++){
        if (dialogs[i].style['display'] == "block"){
            console.log("catchya");
            dialogs[i].children[1].click();
            success = true;
        }
    }
    if (!success){
        console.log("normal");
    }
}

var t1 = window.setInterval(fuckChecking, 1234);

$(".ts1.tanc>p").click();


})();