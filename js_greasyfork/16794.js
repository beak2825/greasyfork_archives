// ==UserScript==
// @name        看趣闻快捷查看引用楼层内容
// @namespace   https://greasyfork.org/users/4514
// @author      喵拉布丁
// @homepage    https://greasyfork.org/scripts/16794
// @description 在看趣闻中方便快捷地查看引用楼层的内容
// @include     http://kanquwen.com/*/*
// @include     http://m.kanquwen.com/*/*
// @version     1.0
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/16794/%E7%9C%8B%E8%B6%A3%E9%97%BB%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B%E5%BC%95%E7%94%A8%E6%A5%BC%E5%B1%82%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/16794/%E7%9C%8B%E8%B6%A3%E9%97%BB%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B%E5%BC%95%E7%94%A8%E6%A5%BC%E5%B1%82%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
var Kqw = {
    // 网站类型，0：桌面版；1：移动版（无需在此修改）
    type: 0,
    // 本页楼层列表
    floorList: {},

    /**
     * 获取本页楼层列表
     * @param {string} content 正文内容的HTML代码
     */
    getFloorList: function (content) {
        if (!content) return;
        var floorMatches = content.match(/<p.+?\d+：.*?\d+\/\d+\/\d+(.|\r|\n)+?(?=<p.+?\d+：.*?\d+\/\d+\/\d+|<p class="article_page_info">)/ig);
        if (!floorMatches) return;

        Kqw.floorList = {};
        for (var i in floorMatches) {
            var textMatches = /^<p.+?(\d+)：(.|\r|\n)+/i.exec(floorMatches[i]);
            if (!textMatches) return;
            var floor = parseInt(textMatches[1]);
            if (typeof Kqw.floorList[floor] === 'undefined') Kqw.floorList[floor] = textMatches[0];
            else Kqw.floorList[floor] += '<hr />' + textMatches[0];
        }
        //console.log(Kqw.floorList);
    },

    /**
     * 添加CSS
     */
    appendCss: function () {
        $('head').append(
            '<style>' +
            '  a.pd_anchor:hover { text-decoration: underline; }' +
            '  .pd_panel {' +
            '    position: absolute; overflow-y: auto; background-color: #FCFCFC; border: 1px solid #BBB; opacity: 0.95; z-index: 100;' +
            '    padding: 0 5px; min-height: 48px;' +
            '} ' +
            '</style>'
        );
    },

    /**
     * 处理本页的引用楼层链接
     * @param {jQuery} $content 正文内容的jQuery节点
     * @param {string} content 正文内容的HTML代码
     */
    handleAnchorLinks: function ($content, content) {
        var linkMatches = content.match(/&gt;&gt;\d+/ig);
        var replacedFloorList = {};
        for (var i in linkMatches) {
            var floor = parseInt(/\d+/.exec(linkMatches[i])[0]);
            if (floor === 1) continue;
            if (typeof Kqw.floorList[floor] !== 'undefined' && typeof replacedFloorList[floor] === 'undefined') {
                content = content.replace(new RegExp('&gt;&gt;' + floor + '(?!\\d)', 'ig'),
                    '<a class="pd_anchor" href="#" data-floor="{0}">&gt;&gt;{0}</a>'.replace(/\{0\}/g, floor)
                );
                replacedFloorList[floor] = true;
            }
        }
        $content.html(content);
    },

    /**
     * 处理引用楼层的文本内容
     * @param {string} content 原文本内容
     * @returns {string} content 处理后的文本内容
     */
    handleFloorContent: function (content) {
        return content.replace(/<p class="article_page[^"]+">.+?<\/p>/ig, '')
            .replace(/<p( style="[^"]+")?>&nbsp;<\/p>\n((?=<hr \/>)|$)/ig, '');
    },

    /**
     * 绑定引用楼层链接点击事件
     */
    bindAnchorLinkClick: function () {
        $(document).click(function (e) {
            var $target = $(e.target);
            if ($target.is('.pd_anchor')) {
                e.preventDefault();
                $('.pd_panel').remove();
                var $this = $(e.target);
                var floor = parseInt($this.data('floor'));
                if (isNaN(floor)) return;

                if (typeof Kqw.floorList[floor] === 'undefined') return;
                var $panel = $('<div class="pd_panel">{0}</div>'.replace('{0}', Kqw.handleFloorContent(Kqw.floorList[floor]))).appendTo('body');

                var offsetTop = $this.offset().top;
                var scrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();
                var min = windowHeight / 4, max = windowHeight / 2;
                var panelMaxHeight = 0;
                var isUnder = offsetTop - scrollTop < min + 18;
                if (isUnder)
                    panelMaxHeight = scrollTop + windowHeight - offsetTop - (Kqw.type === 1 ? 18 : 7);
                else
                    panelMaxHeight = offsetTop - scrollTop - (Kqw.type === 1 ? 18 : 7);
                if (panelMaxHeight > max) panelMaxHeight = max;

                var $line = $this.closest('p');
                if (!$line.length) $line = $this.closest('div');
                if (Kqw.type === 1) {
                    $panel.css('padding-top', '5px')
                        .css('padding-bottom', '5px')
                        .css('max-width', $this.closest('#post_content').width() - 10)
                        .css('max-height', panelMaxHeight)
                        .css('left', $line.offset().left);
                }
                else {
                    $panel.css('max-width', $line.width() - 30)
                        .css('max-height', panelMaxHeight)
                        .css('left', $line.offset().left + 30)
                }
                $panel.css('top', isUnder ? offsetTop + $this.height() + 3 : offsetTop - $panel.outerHeight() - 3);
            }
            else if (!($target.is('.pd_panel') || $target.closest('.pd_panel').length > 0)) {
                $('.pd_panel').remove();
            }
        });
    },

    /**
     * 初始化
     */
    init: function () {
        if (typeof jQuery === 'undefined') return;
        if (!/\/\d+\/(\?|#|$)/.test(location.href)) return;

        var $content = null;
        if (location.hostname.indexOf('m.') === 0) {
            Kqw.type = 1;
            $content = $('#post_content');
        }
        else {
            Kqw.type = 0;
            $content = $('.post .single_text');
        }
        if (!$content.length) return;

        var content = $content.html();
        Kqw.getFloorList(content);
        if (!Kqw.floorList || $.isEmptyObject(Kqw.floorList)) return;

        Kqw.appendCss();
        Kqw.handleAnchorLinks($content, content);
        Kqw.bindAnchorLinkClick();
    }
};

Kqw.init();