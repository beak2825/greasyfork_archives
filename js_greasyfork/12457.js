// ==UserScript==
// @name         Escape submits hit.
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.1
// @description  Escape key submits hit. And other stuffs ya know. For 411RIchmond single receipt penny batch elephant donkey hits.
// @author       saqfish
// @include      https://www.checkout51.com/hit?*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/12457/Escape%20submits%20hit.user.js
// @updateURL https://update.greasyfork.org/scripts/12457/Escape%20submits%20hit.meta.js
// ==/UserScript==

var banana = [];
var instructions = $('body > div.row > div > div.span8 > div.alert.alert-success > h2');
banana[0] = $('body > div.row > div > div.span8 > div.alert.alert-success > ul');
banana[1] = $('#hitform > div > ul');
//banana[1] = $('
banana[2] = $('body > div.row > div > div.span8 > div.alert.alert-warn');
banana[3] = $('#hitform > div > p:nth-child(1)');
for( var i = 0; i <4; i++){
        banana[i].hide();
    }
$(document).keyup(function(e){
    if(e.keyCode === 27){
        $('#submit-btn').click();
       
    }
});


$(instructions).on("click",function(){
    
    for( var i = 0; i <4; i++){
        banana[i].show();
    }
});
