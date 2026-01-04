// ==UserScript==
// @name         知乎快捷工具
// @namespace    https://gitee.com/liaoyinglong
// @version      0.1
// @description  一键收起文章
// @author       lyl
// @match        https://www.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376492/%E7%9F%A5%E4%B9%8E%E5%BF%AB%E6%8D%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/376492/%E7%9F%A5%E4%B9%8E%E5%BF%AB%E6%8D%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
    //#region 源码
    var setCollapsedButton = function () {
        var $CornerButtons = $('.CornerButtons');
        if (!$CornerButtons.length)
            return;
        var $CollapsedTogetherButton = $('.CollapsedTogetherButton');
        if ($CollapsedTogetherButton.length)
            return;
        var $button = $("<button>\u6536\u8D77</button>")
            .addClass('Button CornerButton Button--plain CollapsedTogetherButton')
            .attr('data-tooltip', '一键收起全部')
            .attr('data-tooltip-position', 'left')
            .attr('data-tooltip-will-hide-on-click', 'true')
            .on('click', function () {
            $('.RichContent-collapsedText').each(function (_, btn) { return btn.click(); });
        });
        var $div = $("<div class='CornerAnimayedFlex'></div>").append($button);
        $div.insertBefore($CornerButtons[0].children[0]);
    };
    var setCollapsedButtonInTopicPage = function () {
        if ($('.CollapsedButtonInTopicPage').length)
            return;
        var $button = $("<div class=\"zh-backtotop CollapsedButtonInTopicPage\">\n          <div class=\"btn-backtotop btn-action\" style=\"\n          display: flex;\n          justify-content: center;\n          align-items: center\">\n            \u6536\u8D77\n          </div>\n      </div>").css({
            opacity: 1,
            bottom: '165px'
        });
        $('body').append($button);
    };
    var bootstrap = function () {
        var url = window.location.href;
        var topicDetailReg = /(topic\/).*$/;
        var topicReg = /(topic#?).*$/;
        if (topicReg.test(url) && !topicDetailReg.test(url)) {
            setCollapsedButtonInTopicPage();
            return;
        }
        setCollapsedButton();
    };
    bootstrap();
    $(function () {
        bootstrap();
    });
    //#endregion 源码
})();
