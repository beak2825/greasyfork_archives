// ==UserScript==
// @name         ExExtended
// @author       Hauffen
// @description  CSS fixes to make extended view less stupid.
// @version      2.2
// @include      /https?:\/\/(e-|ex)hentai\.org\/.*/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/285675
// @downloadURL https://update.greasyfork.org/scripts/380768/ExExtended.user.js
// @updateURL https://update.greasyfork.org/scripts/380768/ExExtended.meta.js
// ==/UserScript==

$(function() {
    var hUrl = "https://" + window.location.hostname;
    var url = document.URL;
    var index = document.getElementsByTagName("select").length > 1 ? 1 : 0;

    var d1 = url.split('/')[3];
    if(d1 === "s") {
        var $nb = $('<div>');
        $nb.load(`${hUrl} #nb`, function() {
            $('body').prepend(this.children[0]);
        });
    }

    if(document.getElementsByTagName("select").length === 0) {
        return;
    }

    if(document.getElementsByTagName("select")[index].selectedIndex === 3) {
        $("<style data-jqstyle='exextended'>.glte > tbody > tr {height: 348px;}.glte > tbody > tr > td {border-right: 1px solid #6f6f6f;}" +
          ".gl1e,.gl2e,.glfe {border: 1px solid #6f6f6f;}.gl1e > div {border-radius: 0px;}.gl4e {min-height: 348px;border-left: 1px solid transparent;}" +
          ".gl4e > div:nth-child(1) {font-weight: bold;}.gl3e {max-width: none;position: absolute;bottom: 10px;width: 100%;}" +
          ".gl3e > div:nth-child(1) {left: 6px;top: 118px;}.gl3e > div:nth-child(2) {top: 154px;}.gl3e > div:nth-child(3) {right: 35px;top: 153px;left: auto;}" +
          ".gl3e > div:nth-child(4) {right: 10px;top: 110px;left: auto;text-align: right;}.gl3e > div:nth-child(5) {right: 10px;top: 130px;left: auto;text-align: right;}" +
          ".gl3e > div:nth-child(6) {text-align: right !important;right: 12px;top: 154px;left: unset;};</style>").appendTo("head");
    } else if (document.getElementsByTagName("select")[index].selectedIndex === 4) {
        $("<style data-jqstyle='exextended'>.gld{grid-template-columns: repeat(auto-fit, minmax(252px, 1fr)) !important;}" +
          "div.ido{padding-left:0px;max-width:100% !important;}.glnew:after{right: -116px;top: -50px;}</style>").appendTo("head");
    }

    //Changing up the New icon, comment this out for it to not be there
    switch(document.getElementsByTagName("select")[index].selectedIndex) {
        default:
            $("<style>.glnew:after {content: url('https://i.imgur.com/p0yiKb7.gif');margin-left: 5px;position:absolute;right:-733px;top:7px;z-index:2;</style>").appendTo("head");
            break;
        case 1:
            $("<style>.glnew:after {content: url('https://i.imgur.com/p0yiKb7.gif');margin-left: 5px;position:absolute;right:-733px;top:7px;z-index:2;</style>").appendTo("head");
            break;
        case 2:
            $("<style>.glnew:after {content: url('https://i.imgur.com/p0yiKb7.gif');margin-left: 5px;position:absolute;right:-805px;top:3px;z-index:2;</style>").appendTo("head");
            break;
        case 3:
            $("<style>.glnew:after {content: url('https://i.imgur.com/p0yiKb7.gif');margin-left: 5px;position:absolute;right:-790px;top:-315px;z-index:2;</style>").appendTo("head");
            break;
        case 4:
            $("<style>.glnew:after {content: url('https://i.imgur.com/p0yiKb7.gif');margin-left: 5px;position:absolute;z-index:2;</style>").appendTo("head");
            break;
    }
})