

    // ==UserScript==
    // @name         Sort Enemies
    // @namespace    zero.sort.torn
    // @version      0.5
    // @description  Sorts Enemy with idles
    // @author       -zero [2669774]
    // @match        https://www.torn.com/blacklist.php*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463385/Sort%20Enemies.user.js
// @updateURL https://update.greasyfork.org/scripts/463385/Sort%20Enemies.meta.js
    // ==/UserScript==
     
    function compare(a,b){
        var mylist = $('.user-info-blacklist-wrap');
        var listitems = mylist.children('li').get();
     
        listitems.sort(function(a, b) {
            var stat_a = 2;
            var stat_b = 2;
            if ($('#iconTray > li', $(a)).attr('title').includes('Online')){
                stat_a = 0;
            }
            if ($('#iconTray > li', $(b)).attr('title').includes('Online')){
                stat_b = 0;
            }
            if ($('#iconTray > li', $(a)).attr('title').includes('Idle')){
                stat_a = 1;
            }
            if ($('#iconTray > li', $(b)).attr('title').includes('Idle')){
                stat_b = 1;
            }
     
            if (stat_a < stat_b){
                return -1;
            }
            if (stat_a > stat_b){
                return 1;
            }
     
     
            return $('.text',$(a)).text().toUpperCase().localeCompare($('.text',$(b)).text().toUpperCase());
        })
        $.each(listitems, function(idx, itm) { mylist.append(itm); });
     
     
     
    }
     
    setInterval(compare, 500);

