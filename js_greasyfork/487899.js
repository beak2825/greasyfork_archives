// ==UserScript==
// @name         alienware_game_vault
// @namespace    http://tampermonkey.net/
// @version      2024.05.29.1
// @description  alienware game vault
// @author       jacky
// @license     MIT
// @match        https://*.alienwarearena.com/marketplace/game-vault
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alienwarearena.com
// @run-at      document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487899/alienware_game_vault.user.js
// @updateURL https://update.greasyfork.org/scripts/487899/alienware_game_vault.meta.js
// ==/UserScript==

$('.marketplace-hr').after('<table id="a" style="width:100%;table-layout:automatic"></table>');
$('.marketplace-game-product').each(function(){
    var id = $(this).attr('data-product-id');
    var image = $(this).attr('data-product-image');
    var name = $(this).attr('data-product-name');
    var price = $(this).attr('data-product-price');
    var able = $(this).attr('data-product-disabled');
    var tier = $(this).attr('data-arp-tier');
    var plat = $(this).attr('data-product-platform');
    var url = $(this).attr('data-product-website-url');
    $('#a').append(`<tr id="${id}" ><td style="min-width:10%;">${id}</td><td style="min-width:50%;"><a target=_blank href="${url}">${name}</a></td><td style="min-width:15%;">${price}</td><td style="min-width:10%;">${tier}</td><td style="min-width:15%;">${plat}</td></tr>`);
    if (($(this).next('span').text().indexOf('Out of Stock') > -1))
        $(`#${id}`).css("background-color","red");
});