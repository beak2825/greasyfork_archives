// ==UserScript==
// @name         pixivEasyBookmark
// @namespace    http://myskng.xyz/
// @version      0.1.3
// @description  モバイル版みたいにすぐにブックマークできるようにするやつ
// @author       myskng
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @resource     toastr https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @match        *://www.pixiv.net/member_illust.php*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26625/pixivEasyBookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/26625/pixivEasyBookmark.meta.js
// ==/UserScript==

var pixiv_bookmark;
(function (pixiv_bookmark) {
    var scraper;
    (function (scraper) {
        function findIDFromIllustID(illustid, callback) {
            //search for max 100pages
            var doajax = function (pageid) {
                var counter = pageid;
                $.ajax({
                    type: "GET",
                    url: "//www.pixiv.net/bookmark.php?rest=show&p=" + pageid,
                    success: function (data) {
                        var retflag = false;
                        $(data).find(".image-item").each(function (index, val) {
                            if ($(this).find("img")[0].getAttribute("data-id") == illustid) {
                                //item found
                                callback($(this).find("input")[0].getAttribute("value"));
                                retflag = true;
                            }
                        });
                        //if not found
                        counter++;
                        if (counter > 100 || retflag)
                            return;
                        doajax(counter); //call myself
                    }
                });
            };
            doajax(1);
        }
        scraper.findIDFromIllustID = findIDFromIllustID;
    })(scraper = pixiv_bookmark.scraper || (pixiv_bookmark.scraper = {}));
})(pixiv_bookmark || (pixiv_bookmark = {}));
/// <reference path="./findbookmark.ts"/>
var pixiv_bookmark;
/// <reference path="./findbookmark.ts"/>
(function (pixiv_bookmark) {
    function main() {
        var style = GM_getResourceText('toastr');
        GM_addStyle(style);
        $(".bookmark-container").append("<a href=\"javascript:void(0)\" style=\"display:none\" id=\"us_bookmark\" class=\"_bookmark-toggle-button add-bookmark\">\n                                        <span class=\"bookmark-icon\"></span>\n                                        <span class=\"description\">\u5373\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u3059\u308B</span>\n                                        </a>");
        $(".bookmark-container").append("<a href=\"javascript:void(0)\" style=\"display:none\" id=\"us_unbookmark\" class=\"_bookmark-toggle-button add-bookmark\">\n                                        <span class=\"bookmark-icon\"></span>\n                                        <span class=\"description\">\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u3092\u5916\u3059</span>\n                                        </a>");
        ($(".edit-bookmark").length == 0) ? $("#us_bookmark").show() : $("#us_unbookmark").show();
        $('#us_bookmark').on('click', function () { return onBookmarkClick(); });
        $('#us_unbookmark').on('click', function () { return onUnBookmarkClick(); });
    }
    pixiv_bookmark.main = main;
    function onBookmarkClick() {
        $.ajax({
            type: "POST",
            url: "//www.pixiv.net/bookmark_add.php?id=" + pixiv.context.illustId,
            data: {
                "mode": "add",
                "tt": pixiv.context.token,
                "id": pixiv.context.illustId,
                "type": "illust",
                "from_sid": "",
                "comment": "",
                "tag": "",
                "restrict": "0"
            },
            success: function (j_data) {
                toastr["success"]("ブックマークに追加しました");
                $('#us_bookmark').hide();
                $('#us_unbookmark').show();
            }
        });
    }
    function onUnBookmarkClick() {
        //find id
        pixiv_bookmark.scraper.findIDFromIllustID(pixiv.context.illustId, function (contextid) {
            $.ajax({
                type: "POST",
                url: "//www.pixiv.net/bookmark_setting.php",
                data: {
                    "type": "",
                    "tt": pixiv.context.token,
                    "tag": "",
                    "untagged": "0",
                    "rest": "show",
                    "p": "1",
                    "book_id[]": contextid,
                    "add_tag": "",
                    "del": "ブックマーク解除"
                },
                success: function (j_data) {
                    toastr.success("ブックマークを解除しました");
                    $('#us_bookmark').show();
                    $('#us_unbookmark').hide();
                },
                error: function () {
                    toastr.warning("(多分)ブックマークを解除しました");
                    $('#us_bookmark').show();
                    $('#us_unbookmark').hide();
                }
            });
        });
    }
})(pixiv_bookmark || (pixiv_bookmark = {}));
/// <reference path="./main.ts"/>
pixiv_bookmark.main();
//# sourceMappingURL=pixiv_bookmark.user.js.map