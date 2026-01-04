// ==UserScript==
// @name         fineVideo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.fineboy.co/forum.php?mod=forumdisplay&fid=46&page=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422058/fineVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/422058/fineVideo.meta.js
// ==/UserScript==

var n = 5;
var img_urls;
(function() {
    

    //发送http请求
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

                var as = document.querySelectorAll(".work-thumbnail__bd > a");
                console.log(as[0].href);

                var a;
                for (var i = 0; i < as.length; i++) {
                    if (as[i].href == e.finalUrl)
                        a = as[i];
                }






                for (var j = 0; j < img_urls.length; j++) {
                    a.innerHTML += ('<img src="https://www.fineboy.co/' + img_urls[j] + '"></img>');
                }


            },

        })

    }





    //改变样式
    var css = '<style type="text/css"> .grid5 .span1 {width: auto;float: inherit;padding: 0 5 px;}.pbw {float: left;} .imageCard .work-thumbnail__bd {height: auto;} .work-thumbnail__bd>a>img {border: 0;width: 30%;height: auto;min - height: 100 % ;}</style>'
    document.getElementsByTagName("head")[0].innerHTML += css;

    //获取每个url
    var urls = document.querySelectorAll(".work-thumbnail__bd > a");
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i].href
        console.log(url);
        n = 5;
        gx(url, n)


    }



})();