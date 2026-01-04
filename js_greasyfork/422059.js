// ==UserScript==
// @name         finesearch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.fineboy.co/search*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422059/finesearch.user.js
// @updateURL https://update.greasyfork.org/scripts/422059/finesearch.meta.js
// ==/UserScript==
var n = 3;
(function() {
    'use strict';
    var urls = document.querySelectorAll(".xs3 > a");
    var lis = document.querySelectorAll(".pbw");
    lis[0].childNodes
    var n = 3;
    var img_urls

    document.getElementsByTagName("head")[0].innerHTML += '<style type="text/css">.slst {width: auto;} img {height: auto;width: 50%;float: left;}.pbw {float: left;}</style>';





    function sleep(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
        // console.log('休眠后：' + new Date().getTime());
    }

    function gx(url_, n) {
        if (--n == 0) {
            return
        }


        GM_xmlhttpRequest({
            method: "GET",
            url: url_,
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",

            },

            onload: function(e) {

                var regex = /(?<=(zoomfile="))(.*?).(jpg|png)/g;

                var re = e.response;

                if (!re || !re.match(regex)) {
                    gx(e.finalUrl, n);
                    console.log("^^^^^^");
                    console.log(e.finalUrl);
                    console.log("______");
                }

                img_urls = re.match(regex);


                var regex2 = /\d{5}/g;
                var liid = e.finalUrl.match(regex2);
                var li = document.getElementById(liid);


                for (var j = 0; j < img_urls.length; j++) {
                    li.innerHTML += ('<img src="https://www.fineboy.co/' + img_urls[j] + '"></img>');
                }


            },

        })

    }


    for (var i = 0; i < urls.length; i++) {
        var url_ = urls[i].href
        console.log(url_);
        n = 20;
        gx(url_, n)


        // if(i==4){
        //     break;
        // }

    }


})();