// ==UserScript==
// @name         老毕影视资源链接批量提取工具
// @namespace    https://leo.bi
// @version      1.0
// @license      MIT
// @description  老毕影视资源链接批量提取工具，一键获取网页某一个区域内所有链接文本相似的影视资源链接，复制到剪切板，方便使用迅雷等工具进行批量下载。点击某个区域内任意一个资源链接前的"下载"图标即可完成批量复制操作。
// @description:example  案例: https://www.bt-tt.com/html/6/36583.html (只有一个链接时不适用该脚本，因为一个链接算不上"批量"，动动鼠标就能轻松复制一个链接)
// @author       Leo Bi
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/489280/%E8%80%81%E6%AF%95%E5%BD%B1%E8%A7%86%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/489280/%E8%80%81%E6%AF%95%E5%BD%B1%E8%A7%86%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    function isDownloadResource(str) {
        const regexp1 = /.*:/i;
        const regexp2 = /magnet|ed2k|thunder|mp3|mp4|mov|rmvb|avi|mkv/i;
        if (str.match(regexp1) != null && str.match(regexp2) != null) {
            return true;
        } else {
            return false;
        }
    }

    function getLinksWithSimilarText(targetUrl, rate, maxDepth) {
        var targetLink;
        var similiarLinks = [];
        var parentElement;
        const MAX_DEPTH = maxDepth ? maxDepth : 9;
        var loopCount = 0;

        $("a").each(function () {
            if (decodeURI(this.href) == decodeURI(targetUrl)) {
                targetLink = $(this);
                parentElement = $(this);
            }
        });


        while (targetLink != null && loopCount < MAX_DEPTH) {
            parentElement = parentElement.parent();
            loopCount++;

            $(parentElement).find("a").each(function (index) {

                if (similar(purifyDownloadKeyword($(this).text()), purifyDownloadKeyword(targetLink.text())) >= rate
                    && decodeURI($(this).attr("href")).substring(0, 4) == decodeURI(targetLink.attr("href")).substring(0, 4)) {
                    console.log("link text: " + $(this).text());

                    similiarLinks.push($(this));
                }
            });

            if (similiarLinks.length <= 1) {
                similiarLinks = [];
            } else if (similiarLinks.length > 1) {
                break;
            }
        }

        // console.log("similiarLinks.length: " + similiarLinks.length);

        if (similiarLinks.length > 1) {
            return similiarLinks.map(x => x.attr("href"));
        } else {
            return [targetUrl];
        }

    }

    function purifyDownloadKeyword(str) {
        return str.replace("下载", "yqVlFl0g6i-下载")
            .replace("第", "H2ZgC-第")
            .replace("集", "ZHgjP-集")
            .replace(/480p/ig, "nGPdLOvTeWRRGTrxkmhN-480p")
            .replace(/720p/ig, "P21Gt5LBnlP21Gt5LBnl-720p")
            .replace(/1080p/ig, "ZJ1oCgJZ2wZJ1oCgJZ2w-1080p")
            .replace(/2060p/ig, "St3xQfTsVhtD9QwseO6r-2160p")
            .replace(/4k/ig, "ak2oAuKw9shejYADwXBG-4K");
    }

    function similar(s, t, f) {
        if (!s || !t) {
            return 0
        }
        var l = s.length > t.length ? s.length : t.length
        var n = s.length
        var m = t.length
        var d = []
        f = f || 3
        var min = function (a, b, c) {
            return a < b ? (a < c ? a : c) : (b < c ? b : c)
        }
        var i, j, si, tj, cost
        if (n === 0) return m
        if (m === 0) return n
        for (i = 0; i <= n; i++) {
            d[i] = []
            d[i][0] = i
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1)
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1)
                if (si === tj) {
                    cost = 0
                } else {
                    cost = 1
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
            }
        }
        let res = (1 - d[n][m] / l)
        return res.toFixed(f)
    }


    $(document).ready( function() {
        $('a').each(function(index){
            let url = $(this).attr('href');

            if(isDownloadResource(url)) {
                let linkOffset =$(this).offset();
                let $myLinkShortcutElement = $('<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path fill="#1e42d4" d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor"/><path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor"/></svg>');

                $myLinkShortcutElement.on("click", function(){
                    let similarLinks = getLinksWithSimilarText(url, 0.51);
                    if(similarLinks && similarLinks.length) {
                        GM_setClipboard(similarLinks.join("\n"), "text", () => alert(similarLinks.length + "个链接已被成功复制到您的剪切板."));
                    }
                });

                $('body').append($myLinkShortcutElement);

                $myLinkShortcutElement.css({left: linkOffset.left - 25, top: linkOffset.top, position: "absolute", "z-index": 1001});

            }

        });

    });



})(jQuery);