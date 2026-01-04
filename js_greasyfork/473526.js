// ==UserScript==
// @name         Auction house mutiplier
// @namespace    ahmultiplier.zero.torn
// @version      0.1
// @description  adds product of dmg * acc
// @author       -zero [2669774]
// @match        https://www.torn.com/amarket.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473526/Auction%20house%20mutiplier.user.js
// @updateURL https://update.greasyfork.org/scripts/473526/Auction%20house%20mutiplier.meta.js
// ==/UserScript==

function insert(){
    if ($('.bonus-attachment').length == 0){
        setTimeout(insert, 300);
        return;
    }
    $('.items-list > li').each(function(){
        let stat = $('.bonus-attachment > span', $(this));
        
        let dmg = $($(stat)[0]).html();
        // console.log(dmg);
        let acc = $($(stat)[1]).html();

        let product = Math.round(dmg * acc);
        console.log(`${dmg} x ${acc} : ${product}`);
        $('.title > p',$(this)).html(`${dmg} x ${acc} : ${product}`);


    });
    console.log('inserting');

}
let url = window.location.href;

window.onload = () => {
    if (url.includes("weapon")){
        insert();
    }
};

$(window).on('hashchange', function (e) {
    url = window.location.href;
    if (url.includes("weapon")){
        insert();
    }
});

