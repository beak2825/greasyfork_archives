// ==UserScript==
// @name         XHDA
// @description  XSS Hunter, One-Key delete all data.
// @author       LzSkyline
// @match        https://xsshunter.com/app
// @grant        none
// @version 0.0.1.20181108062953
// @namespace https://greasyfork.org/users/152259
// @downloadURL https://update.greasyfork.org/scripts/371542/XHDA.user.js
// @updateURL https://update.greasyfork.org/scripts/371542/XHDA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function del_all_item(){
        console.log("Working...");
        api_request( "GET", "/api/payloadfires", {"offset": 0, "limit": 500}, function( items ) {
            items.results.forEach(function(item, index){
                console.log("Deleting: "+item.id);
                setTimeout(100);
                api_request( "DELETE", "/api/delete_injection", {"id": item.id}, function( response ) {
                    delete_injection( item.id );
                });
            })
        })
    }
    $(".panel-heading").append('<button type="button" class="delete_all btn btn-xs btn-danger pull-right"><span class="glyphicon glyphicon-trash"></span> Delete All</button>')
    $(".delete_all").on('click', del_all_item);
    //reload
    $("a[href='#home1']").css("cursor","pointer");
    $("a[href='#home1']").on('click', function(){location.reload();});
})();