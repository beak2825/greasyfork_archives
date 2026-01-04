// ==UserScript==
// @name         Visited Links 标记访问过的链接（打√、打○）
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @license      MIT
// @description  Tag visited links.
// @author       renhao.x@seu.edu.cn
// @icon         data:image/png;base64,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
// @grant        none
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/444609/Visited%20Links%20%E6%A0%87%E8%AE%B0%E8%AE%BF%E9%97%AE%E8%BF%87%E7%9A%84%E9%93%BE%E6%8E%A5%EF%BC%88%E6%89%93%E2%88%9A%E3%80%81%E6%89%93%E2%97%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444609/Visited%20Links%20%E6%A0%87%E8%AE%B0%E8%AE%BF%E9%97%AE%E8%BF%87%E7%9A%84%E9%93%BE%E6%8E%A5%EF%BC%88%E6%89%93%E2%88%9A%E3%80%81%E6%89%93%E2%97%8B%EF%BC%89.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Your code here...
    var itemName = "visited_links";
    var tag1 = "√", tag2 = "○";

    var GetItem = function() {
        var item = window.localStorage.getItem(itemName);
        return (item?JSON.parse(item):new Object());
    }

    var SetItem = function(oLink) {
        var text = $(oLink).text(), link = oLink.href;

        if(IsMarked(text)) return;

        var item = GetItem();
        item[LinkKey(oLink)] = link;

        window.localStorage.setItem(itemName, JSON.stringify(item));
    }

    var IsMarked = function(text) {
        return text.startsWith(tag1) || text.startsWith(tag2);
    }

    var MarkLink = function() {
        var filter = /^\d{1,2}|(< )?上一页|下一页( >)?|next|pre|previous|>|<$/i;
        $("a").each(function() {
            var link = GetItem()[LinkKey(this)];
            if(link && !IsMarked($(this).children().first().text()) && !$(this).text().trim().match(filter)) {
                $(this).prepend("<div style='color:red;font-weight:bold;display:inline-block;'>" + (link==this.href?tag1:tag2) + "&nbsp;&nbsp;</div>");
            }
        });
    };

    var LinkKey = function(oLink) {
        return ($(oLink).text().trim()==""?oLink.href:$(oLink).text());
    }

    var bindClick = function() {
        var boundClassName = "__bindedClick", notBound = $("a[class!='" + boundClassName + "']");

        notBound.on("click", function() {
            SetItem(this);
            MarkLink();

            setTimeout(bindClick, 800);
        } );

        notBound.each(function() {
            $(this).addClass(boundClassName);
        });
    }

    $(document).scroll(function() {
        MarkLink();
        bindClick();
    });

    bindClick();
    MarkLink();

})(jQuery);