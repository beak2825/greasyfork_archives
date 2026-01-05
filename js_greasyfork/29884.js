// ==UserScript==
// @id           WhatsApp Web Background Changer
// @name         WhatsApp Web Background Changer
// @namespace    https://www.github.com/iamKunal
// @version      4.0.0
// @description  Change WhatsApp Web Chat Background
// @author       Kunal Gupta < kunal.gupta@myself.com >
// @icon         https://github.com/iamKunal/UserScripts/raw/master/WhatsApp-Web-Background-Changer/assets/wa-bg.png
// @icon64       https://github.com/iamKunal/UserScripts/raw/master/WhatsApp-Web-Background-Changer/assets/wa-bg64.png
// @match        https://web.whatsapp.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29884/WhatsApp%20Web%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/29884/WhatsApp%20Web%20Background%20Changer.meta.js
// ==/UserScript==


// ==/UserScript==
var bgURLold="https://github.com/iamKunal/UserScripts/raw/master/WhatsApp-Web-Background-Changer/assets/default_wallpaper.jpg";
var bgImage;
(function() {
    'use strict';

    var bgImage = GM_getValue("bgURL",bgURLold);
        var checkExist = setInterval(function() {
        if (!$('#startup').length) { //Check for Content to Load
            clearInterval(checkExist);
    var a=document.getElementsByTagName("body")[0];
    //node.addEventListener('click',askBG,false);
    var input = document.createElement("input");
    input.type="file";
    input.setAttribute("id","wa-bg-change-input");
    input.style.display="none";
    input.accept="image/*";
    input.onchange=function(){
        var fr = new FileReader();
        fr.onload = function(){
            if(input.files!==null){
                var thisChat = null;
                thisChat = confirm("Press OK to confirm setting the selected wallpaper for all chats.");
                GM_setValue("bgURL",fr.result);
                //document.body.click();
                updateWP();
            }
        };
        if(input.files!==null){
            fr.readAsDataURL(input.files[0]);
        }
    };
    a.appendChild(input);

    document.getElementById("wa-bg-change-input").click();

        }
    }, 100);
    $(document).keydown(function(e){
        if (e.keyCode==66 && e.ctrlKey)
            $('#wa-bg-change-input').click();
    });
    updateWP();
    })();


function updateWP(){
    var bgImage = GM_getValue("bgURL",bgURLold);
    if ($('#wa-bg-css' != null)){
        $('#wa-bg-css').innerHTML=''
    }
    injectHTML(`
<div id="wa-bg-css"><style>
[data-asset-chat-background]{
background-image:url('` + bgImage + `') !important;
background-position: center;
opacity: 1.0;
}
</style></div>
`);

}

function injectHTML(rule) {
    var div = $("<div />", {
        html: '' + rule + ''
    }).appendTo("body");
}
