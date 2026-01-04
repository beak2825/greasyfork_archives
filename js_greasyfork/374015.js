// ==UserScript==
// @name         百度贴吧 一键@全部吧务
// @namespace    https://zfdev.com/
// @version      0.2
// @description  想找吧务？一键呼唤全部吧务过来！
// @author       ZFDev
// @match        *://tieba.baidu.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/374015/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E4%B8%80%E9%94%AE%40%E5%85%A8%E9%83%A8%E5%90%A7%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/374015/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%20%E4%B8%80%E9%94%AE%40%E5%85%A8%E9%83%A8%E5%90%A7%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bawu_list = !1, forum_name = !1;

    function get_forum_name() {
        return "/f" === location.pathname ? PageData.forum.name : "/p/" === location.pathname.substring(0, 3) && PageData.forum.forum_name;
    }

    function getbawu() {
        return new Promise(function(t) {
            if (bawu_list) {
                return void t(bawu_list);
            }
            let n = "", e = get_forum_name();
            if (!e) {
                return;
            }
            try {
                n = "/bawu2/platform/listBawuTeamInfo?word=" + encodeURIComponent(e) + "&ie=utf-8";
            } catch (t) {
                return;
            }
            $.get(n).then(function(n) {
                let e = [], a = new RegExp().compile(/\"user_name\" title\=\"([\S\d]+)\"/gi), o = n.match(a);
                if (o) {
                    a.compile(/\"user_name\" title\=\"([\S\d]+)\"/i);
                    for (let t = 0; t < o.length; t++) {
                        let n = o[t].match(a);
                        n && e.push(n[1]);
                    }
                }
                bawu_list = e, t(e);
            });
        });
    }

    function postAt(t) {
        let n = "<p>";
        t.forEach(t => {
            n += '<span class="at">@' + t + "</span>&nbsp; &nbsp;";
        }), n += "</p><p></p>", $("#ueditor_replace").append(n);
    }

    let lzlAt = function(t) {
        let n = $("#j_editor_for_container").html(), e = n.substring(0, n.length - 4);
        t.forEach(t => {
            e += '<span class="at">@' + t + "</span>&nbsp; ";
        }), e += "</p>", $("#j_editor_for_container").html(e);
    }, btnHTML = `<div class="edui-btn edui-btn-name-list edui-last-btn" unselectable="on" onmousedown="return false" data-original-title="@全部吧务" id="at-bawu"><div unselectable="on" class=" edui-icon" style="\nbackground: none;\nwidth: auto;\ndisplay: inline-flex;\ncolor: #4270bc;\n">@全部吧务</div></div>\n`, lzlHTML = '<span class="at-bawu" alog-action="lzlpostor" style="color: #4270bc;cursor: pointer;">@</span>';

    function homeBtn() {
        if ($("#at-bawu").length > 0) {
            return;
        }
        let t = $(".edui-toolbar .edui-btn-toolbar");
        t.length > 0 && (t.append(btnHTML), $("#at-bawu").click(function() {
            getbawu().then(t => {
                postAt(t);
            });
        }));
    }

    let lzlBtnEvent = function() {
        getbawu().then(t => {
            lzlAt(t);
        });
    };

    "/f" === location.pathname ? homeBtn() : "/p/" === location.pathname.substring(0, 3) && (document.addEventListener("DOMNodeInserted", function(t) {
        if ("edui_at_box" === t.target.className) {
            homeBtn();
            try {
                $(t.target.parentNode.parentNode.parentNode.parentNode).find(".lzl_panel_btn:not(:has(.at-bawu))").prepend(lzlHTML);
            } catch (t) {}
        }
    }), $("body").on("click", ".at-bawu", lzlBtnEvent));
})();