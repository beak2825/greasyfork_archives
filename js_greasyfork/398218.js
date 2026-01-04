// ==UserScript==
// @name         GoBattle.io script
// @namespace    Tampermonkey
// @version      0.4
// @description  GoBattle.io script cuz why not :3
// @author       MohiMoo
// @match        https://gobattle.io
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/398218/GoBattleio%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/398218/GoBattleio%20script.meta.js
// ==/UserScript==

var switcher = false;

    function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
    }



  window.addEventListener("keydown", function(e) {
    var key = e.keyCode || e.which;

    if (key === 70) {
        
        if(switcher === true){
            switcher = false;
            
        }else {
            
        switcher = true; 
        
        }
    }

  });//key down event


    if(switcher === true){

        window.alert("switcher is set to true")
        var i = 1;
        
        for(i; i > 100; i++){
        split();
        setTimeout(split(), 1000 * i);

        }
        
        

    }else {
        window.alert("switcher is now set to false")
        console.log("STOOP!");
        

    }