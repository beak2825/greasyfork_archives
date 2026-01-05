// ==UserScript==
// @name         Torn - Map help with list
// @description  This script will list all of your available items.
// @namespace    https://greasyfork.org/users/5563-bloody
// @version      1.1.1
// @author       BloodyMind [1629016]
// @match        *://www.torn.com/city.php*
// @match        *://torn.com/city.php*
// @require      https://greasyfork.org/scripts/26290-filesaver-js/code/fileSaverjs.js?version=167380
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26292/Torn%20-%20Map%20help%20with%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/26292/Torn%20-%20Map%20help%20with%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getPrice(itemName){
        var returnPrice;
        $.ajax({
            url: addRFC('/imarket.php'),
            type:'post',
            async:false,
            data:{
                p:'shop',
                step:'shop',
                type:'',
                searchname:itemName
            },
            success: function(response){
                response =$.parseHTML(response);
                returnPrice= $($(response).find('span.price').get(0)).clone().children().remove().end().text().replace('$','').replace(/\,/g,'').trim();
            }
        });
        return returnPrice;
    }
    $.ajax({
        url: addRFC('city.php'),
        type: 'get',
        data: {
            step: 'mapData'
        },
        beforeSend: function() {
            $('div.content-title').append('<div id="MapHelp"><img class="ajax-placeholder" src="/images/v2/main/ajax-loader.gif"></div>');
        },
        success: function(response) {
            var items = JSON.parse(atob(JSON.parse(response).territoryUserItems));
            if (items.length === 0) {
                $('#MapHelp').html('<p style="color:#333">You don\'t have any item on the map.</p>');
            } else {
                var names='';
                $('#MapHelp').html('');
                $('h4#skip-to-content').after('[' + items.length + ']');
                for (var i = 0; i < items.length; i++) {
                    names += items[i].title + ';' + getPrice(items[i].title) + '\r\n';
                    $('#MapHelp').append('<span class="iconShow" style="display:inline-block;" title="' + items[i].title + ' (' + parseInt(items[i].c.x, 36) + ',' + parseInt(items[i].c.y, 36) + ')"><img src="/images/items/' + parseInt(items[i].d, 36).toString() + '/small.png"></span>');
                }
                var byteNumbers = new Array(names.length);
                for (var j = 0; j < names.length; j++) {
                    byteNumbers[j] = names[j];
                }
                var blob = new Blob(byteNumbers, {type: "text/plain"});
                saveAs(blob, "hello world.txt");
            }
        },
    });
})();
