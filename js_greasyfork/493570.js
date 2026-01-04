// ==UserScript==
// @name     Vicidial Shortcuts
// @version  1
// @grant    none
// @description press 1 for voicemail, 2 for callback tomorrow, 3 to open servey with token in clipboard
// @match    https://66.212.162.91/agc/vicidial.php*
// @namespace https://greasyfork.org/users/1293587
// @downloadURL https://update.greasyfork.org/scripts/493570/Vicidial%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/493570/Vicidial%20Shortcuts.meta.js
// ==/UserScript==
document.onkeydown = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    if(key===49 || key===97){
        dialedcall_send_hangup('','','','','YES');setTimeout(() => {DispoSelectContent_create('A','ADD','YES');DispoSelect_submit('','','YES');   }, 1000);
    }
    if(key===50 || key===98){
        dialedcall_send_hangup('','','','','YES');setTimeout(() => {DispoSelectContent_create('CALLBK','ADD','YES');DispoSelect_submit('','','YES');}, 1000);CB_date_pick(new Date(+new Date() + 86400000).toISOString().split('T')[0]);CallBackDatE_submit();
    }
    if(key===51 || key===99){
        var s = document.evaluate('//*[@id=\"comments\"]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null,).singleNodeValue.value;
        navigator.clipboard.writeText(s);
        var url = document.evaluate('/html/body/form[1]/span[5]/table/tbody/tr[3]/td[1]/font/center[2]/span[3]/a',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null,).singleNodeValue.toString();
        window.open(url, 'vdcwebform').focus();

    }
}
