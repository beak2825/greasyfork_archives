// ==UserScript==
// @name         Check for robots
// @version      0.1
// @description  Easy script to check robots.txt content
// @author       Alfonso Gomez
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/145984
// @downloadURL https://update.greasyfork.org/scripts/31962/Check%20for%20robots.user.js
// @updateURL https://update.greasyfork.org/scripts/31962/Check%20for%20robots.meta.js
// ==/UserScript==

GM_addStyle ( "                                     \
    #dialogId {                                   \
        z-index: 99999;background-color: #fff;padding: 2%;\
    }                                               \
    .ui-dialog-titlebar{\
        width: 100%;\
        display: inline-table;\
        margin-bottom: 10%;\
    }\                                              \
    .ui-button{\
        float: right;\
    }\
" );

(function() {
    
$(document).on('click','#trigger', function(){  
    var url = window.location;
    GM_xmlhttpRequest ( {
    method:     'GET',
    url:        url + '/robots.txt',
    onload:     function (responseDetails) {
                $("#dialog").html(responseDetails.response);
                $( "#dialog" ).dialog().parent().attr('id', 'dialogId');
                }
     } );
});
    
$('body').append('\
<div id="dialog" title="Robots Result" style="display:none;white-space: pre-line"></div>\
                 <a id="trigger" style="background-color: #f44336;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;cursor:pointer;position: fixed;top: 0;right: 0;z-index: 999999;">Check for Robots TXT</a>\
                ');
})();