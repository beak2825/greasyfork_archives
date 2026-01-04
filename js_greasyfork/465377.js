// ==UserScript==
// @name         Netquel auto repair
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  netquel auto repair script
// @author       me
// @match        https://netquel.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/465377/Netquel%20auto%20repair.user.js
// @updateURL https://update.greasyfork.org/scripts/465377/Netquel%20auto%20repair.meta.js
// ==/UserScript==
var typeEnter = new KeyboardEvent( "keydown", { keyCode: 13 });
var repair;
var ascii;
var shipCode;
var strToCode=function(strx){
    ascii=new Array();
    for(let i=0; i<strx.length; i++){
        ascii.push(strx.charCodeAt(i));
    }
    console.log(ascii);
};
var codeToStr=function(arrx){
    let ret="";
    for(let i=0; i<arrx.length; i++){
        ascii.push(arrx.charCodeAt(i));
    }
}

(function() {
    var toggleRepair = document.createElement("button");
    toggleRepair.textContent="off";
    var toggle=function(){
        if(toggleRepair.textContent=="off"){
            toggleRepair.textContent="on";
            document.getElementsByName("message")[0].value="/save";
            document.getElementsByName("message")[0].dispatchEvent( typeEnter );
            var chat = document.getElementById("chat").children;
            setTimeout(() => {
                shipCode= chat[chat.length-2].children[2].textContent;
                strToCode(shipCode);
                shipCode.replace(String.fromCharCode(26),"");
                console.log(shipCode);
                strToCode(shipCode);
                repair = setInterval(function(){
                    document.getElementsByName("message")[0].value="/load "+shipCode;
                    document.getElementsByName("message")[0].dispatchEvent( typeEnter );
                }, 100);
            }, 500);
        }
        else{
            toggleRepair.textContent="off";
            clearInterval(repair);
        }
    }
    toggleRepair.onclick=toggle;
    (function addToggleButton(){
        console.log("!");
        if(document.getElementById("sidebar")!=null&&document.getElementById("sidebar")!=undefined){
            document.getElementById("sidebar").append(toggleRepair);
        }
        else{
            setTimeout(function(){addToggleButton();},500);
        }
    })();
})();