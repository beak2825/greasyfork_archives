// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       Edib S Vejselović
// @match        https://faucethunt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36346/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/36346/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    var adress = "186DWV8gpP6MTDWazXkg7FVYhdFTehh821";       //unesi svoju walet adresu unutar navodnika
    if($('.form-control').length === 1)
    {
        if(adress === "")
        {
            alert('unesi svoju walet adresu unutar skripte');
        }
        else
        {
            $('.form-control').val(adress);
            setTimeout( function() {
                $('.btn.btn--primary.type--uppercase').click();
            }, 3000);
        }
        $('.form-control').focus();

    }
    else{
        setInterval( function(){
            if($('#timer').text() === "")
            {
                claimSatoshis();
            }
        },1000);
        setTimeout(function() {
  location.reload();
}, 30000);
           }
})();