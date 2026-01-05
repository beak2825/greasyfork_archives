// ==UserScript==
// @name MGS5 age check selection Keeper
// @namespace http://www.konami.jp/mgs5/ storeageselection/
// @version 0.1
// @author suPirman
// @description Store MGS5 Ground Zero and METAL GEAR SOLID V: THE PHANTOM PAIN country and age selection locally in browser.
// @include http://www.konami.jp/mgs5/*/certification.php5
// @downloadURL https://update.greasyfork.org/scripts/13761/MGS5%20age%20check%20selection%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/13761/MGS5%20age%20check%20selection%20Keeper.meta.js
// ==/UserScript==   

if(typeof(Storage) !== "undefined") {
    $('.easy-select-box').remove();
    $('#sel-country').val(localStorage.val_country).easySelectBox();
    $('#sel-month').val(localStorage.val_month).easySelectBox();
    $('#sel-day').val(localStorage.val_day).easySelectBox();
    $('#sel-year').val(localStorage.val_year).easySelectBox();
    $('input[type=image]').click(function(){
        localStorage.setItem("val_country", $('#sel-country').val());
        localStorage.setItem("val_month", $('#sel-month').val());
        localStorage.setItem("val_day", $('#sel-day').val());
        localStorage.setItem("val_year", $('#sel-year').val());
    });
} else {
    // Sorry! No Web Storage support..
}