// ==UserScript==
// @name        Private Toolkit
// @version     1.13
// @namespace   https://greasyfork.org/en/scripts/21084-privatetoolkit
// @description Private toolkit
// @include 	/japanese-bukkake\.net/
// @include     /javlibrary\.com\/.*vl/
// @include     /javlibrary\.com\/.*\?v=/
// @exclude     /javlibrary\.com.*\?list&/
// @include 	/btkitty\.la/
// @include 	/storebt\.com/
// @include 	/javpop\.biz/
// @include     /dfpan\.com/
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant 		GM_addStyle
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21084/Private%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/21084/Private%20Toolkit.meta.js
// ==/UserScript==

var ur = document.URL;

function log(s) {
    console.log(s);
}

function plugin_jap_buk() {
    $(document).ready(function () {
        $('#content-protector-password-1').focus();
    });
    $('#content-protector-1 a:has(img)').each(function () {
        var fullsize = $(this).attr('href');
        var imgPlace = $(this).find('img');
        imgPlace.attr('style', 'width:100%');
        imgPlace.attr('src', fullsize);
        $('#main-col').attr('style', 'width:1000px');
    });
}

function plugin_library_login() {
    $('#userid').attr('value', 'theydonotwant');
    $('#password').attr('value', '123456');
    $('#rememberme').attr('checked', 'checked');
}

function plugin_library_style() {
    GM_addStyle(".title { height:10em!important; } .video{ height:321px!important; }");
}

function plugin_library_watched() {
    log("begin watched plugin");

    $(document).ready(function () {
        var notOwnedButton = $('#owned .smallbutton');
        if (notOwnedButton.hasClass("hidden")) {
            log("this video is owned");
            var notWatchedButton = $('#watched .smallbutton');
            if (!notWatchedButton.hasClass("hidden")) {
              log("click watched button")
              notWatchedButton.click();
            }
        }
    });
}

function plugin_btkitty() {
    log("Remove btkitty link");
    $('a[href="http://btkitty.la/gogo.php"]').remove();
    $('a[href="/gogo.php"]').remove();
}

function plugin_javpop() {
    log("javpop site");
    $('img[src*="imgchili.net"').each(function (index, elem) {
        var link = $(this).attr('src');
        link = link.replace(/\/t.+\.imgchili\.net\//, "\/imgchili\.net\/show\/");
        $(this).parent().attr('href', link);
    });
}

function plugin_dfpan() {
    log("dfpan remove popup");
    $(document).ready(function () {
        $('a[href*="pr0001.com"]').remove();
        $('a[id*="lgUnion"]').remove();
    });
}

if (1 > 2) { } //dummy line
else if (ur.indexOf('japanese-bukkake.net') > 0) plugin_jap_buk();
else if (ur.indexOf('javlibrary.com') > 0) {
    if (ur.indexOf('/vl_') > 0) plugin_library_style();
    else if (ur.indexOf('/?v=') > 0) {
        plugin_library_watched();
    }
}
else if (ur.indexOf('btkitty') > 0 || ur.indexOf('storebt') > 0) plugin_btkitty();
else if (ur.indexOf('javpop') > 0) plugin_javpop();
else if (ur.indexOf('dfpan') > 0) plugin_dfpan();