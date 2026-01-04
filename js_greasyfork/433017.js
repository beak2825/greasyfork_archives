// ==UserScript==
// @name         nyaa show
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动加载nyaa图片并显示!
// @author       You
// @grant        GM_xmlhttpRequest
// @include      https://sukebei.nyaa.si/*
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433017/nyaa%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/433017/nyaa%20show.meta.js
// ==/UserScript==
(function () {
    var a = document.getElementById("torrent-description");
    var patt1 = new RegExp("https://hentai-covers.site/image/[0-9a-zA-Z]*");
    if (patt1.test(a.innerHTML)) {
        var im = patt1.exec(a.innerHTML);
        GM_xmlhttpRequest({
            method: "GET",
            url: im[0],
            Referer: im[0],
            headers: {
                'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            },
            onload: function (response) {
                var regex1 = new RegExp("https\:\/\/hentai\-covers\.site\/images\/[0-9]+\/[0-9]+\/[0-9]+\/[a-zA-Z0-9-_.]*.(jpg|webp)");
                var temp = regex1.exec(response.responseText);
                var board = document.getElementById("torrent-description");
                var img = document.createElement("img");
                GM_xmlhttpRequest({
                    method: "GET",
                    url: temp[0],
                    Referer:im[0],
                    responseType :'blob',
                    headers: {
                        'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                        'Referer':im[0],
                    },
                    onload: function (response) {
                        if (this.status == 200) {
                            var blob = this.response
                            var link = window.URL.createObjectURL(blob)
                            img.src = link
                            img.onload = function() {
                                window.URL.revokeObjectURL(this.src);
                            }
                            board.appendChild(img)
                        }
                    }
                })


            }
        });
    }

})();