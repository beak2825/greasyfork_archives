// ==UserScript==
// @name         asr-wifi-helper
// @namespace    https://github.com/twtcer
// @version      0.0.1
// @description  zxw/asr switch sim decode helper
// @author       twtcer
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489963/asr-wifi-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/489963/asr-wifi-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer_asr = self.setInterval(function (){
       init();
    },1000);

    function init(){
        let simpassword = $("#simpassword");
        if($('#LWGLTGSwitch #imei_msg').length<=0){
        $('#LWGLTGSwitch').append(`<p id="imei_msg"></p>`);}
        if($(simpassword).length>0 && $('#btn_encode').length<=0){
            var a = document.createElement('button');
            a.style.cssText =  'background-color:#66CC99;text-align:center;opacity:0.7;';
            a.innerHTML ='算密';
            a.id='btn_encode';
            a.addEventListener('click', function(){
                let status_xml = callProductXML("status1");
                let imeiValue = $(status_xml).find("IMEI").text();
                $('#LWGLTGSwitch #imei_msg').text(`串号(IMEI):${imeiValue}`);
                let new_str = imeiValue.slice(9,15);
                let last_val = new_str.slice(-2);
                let ex_val = last_val[1] + last_val[0];
                let result = parseInt(new_str.slice(0,-2) + ex_val)*5 ;
                let imei2_val = result.toString();

                $(simpassword).val(imei2_val);
            }, false );
            $("#LWGLTGSwitch").append(a);
        }
    }
})();