// ==UserScript==
// @name         remove unnecessary client
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Allen Zhou
// @require      http://code.jquery.com/jquery-1.12.4.js
// @match        http://*/ui/*/nodes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387166/remove%20unnecessary%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/387166/remove%20unnecessary%20client.meta.js
// ==/UserScript==
this.jQuery = jQuery.noConflict(true);
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}
function deregister(){
    $("div.unhealthy").find("header span").each(function(i,o){
        console.log($(o).html())
        var id = $(o).html();
        console.log(id);
        $.ajax({
            url: '/v1/agent/force-leave/'+id,
            type: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-HTTP-Method-Override": "PUT" },
            success: function( response ) {
                console.log("success");
            },
            error: function(err){
                console.log("error");
            }
        });
        sleep(500);
    });
};
jQuery(function() {
    'use strict';
    sleep(500);
    setTimeout(function(){
        jQuery('#radiogroup_status').append('<button id="clean">清除</button>');

        jQuery('#clean').click(function(e){
            e.preventDefault();
            deregister();
            //window.location.reload();
        });

    }, 3000);

});