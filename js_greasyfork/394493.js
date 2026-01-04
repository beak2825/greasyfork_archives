// ==UserScript==
// @name         Melonbooks: cart: save to file
// @namespace    http://darkfader.net/
// @version      0.1
// @run-at       document-idle
// @description  Save cart to text file
// @author       Rafael Vuijk
// @match        http*://www.melonbooks.co.jp/clipboard/*
// @require      http://code.jquery.com/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/394493/Melonbooks%3A%20cart%3A%20save%20to%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/394493/Melonbooks%3A%20cart%3A%20save%20to%20file.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function save_cart() {
        //var file = new File(["Hello, world!"], "melonbooks_cart.txt", {type: "text/plain;charset=utf-8"});
        //saveAs(file);//blob, "cart.txt");

        let str = '';

        $("table[class='list mb20']").find("tr").each(function () {
            str += $(this).find("td[class='name']").find("a").text() + '\n';
        });

        // let test = 'data:text/plain;charset=utf-8;base64,' + btoa(str));
        let test = 'data:text/plain;charset=utf-8,' + encodeURIComponent(str);

        GM_download({
            url: test,
            name: "melonbooks_cart.txt",
            headers: {}, // - see GM_xmlhttpRequest for more details
            saveAs: false, // - boolean value, show a saveAs dialog
            onerror: () => { console.log('error'); },
            onload: () => { console.log('finished'); },
            onprogress: () => { console.log('progress'); },
            ontimeout: () => { console.log('timeout'); },
        });
    }

    GM_registerMenuCommand("save cart (delete first!)", save_cart, "s");

//    save_cart();

    console.log('---------------------');

    $("table[class='list mb20']").find("tr").each(function () {
        var title = $(this).find("td[class='name']").find("a").text();
        title = title.replace(/【メロン.*】/, "");
        console.log(title);
        let link = function() {
            var td = $('<td/>');
            // insertAfter, wrap etc..
            var link = $('<a/>');
            link.attr('target', '_blank');
            link.attr('href', 'https://www.suruga-ya.jp/search?searchbox=1&category=11&search_word=' + title);
            link.text('suru');
            td.append(link);
            return td;
        };
        let img = $(this).find("td[class='img']");
        link().insertAfter(img);
    });

})();
