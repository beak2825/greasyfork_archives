// ==UserScript==
// @name        轻之国度论坛阅读模式
// @namespace   https://greasyfork.org/users/4514
// @author      喵拉布丁
// @homepage    https://greasyfork.org/scripts/16464
// @description 为轻之国度论坛帖子页面添加阅读模式的功能，还可提取本页帖子的文本内容
// @include     http*://www.lightnovel.cn/thread-*.html
// @include     http*://www.lightnovel.cn/forum.php?mod=viewthread*
// @include     http*://www.lightnovel.us/thread-*.html
// @include     http*://www.lightnovel.us/forum.php?mod=viewthread*
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @version     2.2
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/16464/%E8%BD%BB%E4%B9%8B%E5%9B%BD%E5%BA%A6%E8%AE%BA%E5%9D%9B%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/16464/%E8%BD%BB%E4%B9%8B%E5%9B%BD%E5%BA%A6%E8%AE%BA%E5%9D%9B%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
jQuery.noConflict();

// 配置类
var Config = {
    // 是否自动进入阅读模式（在当前版块的ID包含在下方列表时），true：开启；false：关闭
    autoEnterReadMode: false,
    // 自动进入阅读模式的版块ID列表（留空表示在所有版块生效）
    autoEnterForumIdList: [4, 173, 91, 28, 133, 88],
    // 各楼层文本之间的分隔符（用于提取帖子的文本内容）
    threadSeparator: '\n==============================================\n',
    // 是否自动去除多余空行（用于提取帖子的文本内容），true：开启；false：关闭
    autoRemoveBlankLines: true,

    /* 阅读模式风格设置 */
    pageBgColor: '#E5E4DB', // 页面背景颜色
    threadBgColor: '#DBEED9', // 帖子背景颜色
    fontSize: '22px', // 帖子字体大小
    fontFamily: 'Microsoft YaHei', // 帖子字体名称
    lineHeight: '180%' // 帖子文字行高
};

(function ($) {
    // 进入阅读模式
    var enterReadMode = function () {
        $('head').append(
            ('<style id="pd_read_mode_style">' +
            '  body { background: {0}; }' +
            '  #ct { max-width: 1000px; }' +
            '  .pls { display: none; }' +
            '  #postlist { background-color: {1}; }' +
            '  [id^="postmessage_"] { font-size: {2}; line-height: {3}; }' +
            '  [id^="postmessage_"] font { font-size: {2} !important; line-height: {3}; font-family: "{4}"; }' +
            '  img[id^="aimg_"] { width: auto; max-width: 920px; max-height: 850px; }' +
            '</style>')
                .replace(/\{0\}/g, Config.pageBgColor)
                .replace(/\{1\}/g, Config.threadBgColor)
                .replace(/\{2\}/g, Config.fontSize)
                .replace(/\{3\}/g, Config.lineHeight)
                .replace(/\{4\}/g, Config.fontFamily)
        );
    };

    // 获取当前域名的URL
    var getHostNameUrl = function () {
        return '{0}//{1}/'.replace('{0}', location.protocol).replace('{1}', location.host);
    };

    // 处理帖子文本内容
    var handleThreadContent = function (content) {
        content = content.replace(/<i class="pstatus">\s*本帖最后由.+?编辑\s*<\/i>/ig, '')
            .replace(/<img[^<>\r\n]+?class="vm"[^<>\r\n]*?>/ig, '')
            .replace(/<ignore_js_op>(?:.|\r|\n)+?<img[^<>\r\n]+?file="([^"<>\r\n]+?)"(?:.|\r|\n)+?<\/ignore_js_op>/ig, '【图片：' + getHostNameUrl() + '$1】')
            .replace(/<img[^<>\r\n]+?file="http([^"<>\r\n]+?)"[^<>\r\n]+?>/ig, '【图片：http$1】')
            .replace(/(<div align="\w+">)/ig, '$1\n')
            .replace(/(<.+?>|<\/.+?>)/ig, '')
            .replace(/&quot;/gi, '\"')
            .replace(/&#39;/gi, '\'')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&gt;/gi, '>')
            .replace(/&lt;/gi, '<')
            .replace(/&amp;/gi, '&');
        return content;
    };

    var $enterReadModeLink = $('<a style="color:#FF6666;" href="#" title="进入或退出阅读模式">进入阅读模式</a>')
        .appendTo('#toptb > .wp > .z')
        .click(function (event) {
            event.preventDefault();
            var $this = $(this);
            if ($this.text() === '退出阅读模式') {
                $('#pd_read_mode_style').remove();
                $this.text('进入阅读模式');
            }
            else {
                enterReadMode();
                $this.text('退出阅读模式');
            }
        });

    $('<a style="color:#0099CC;" href="#" title="提取本页所有楼层的文本内容">提取帖子内容</a>')
        .insertBefore($enterReadModeLink)
        .click(function (event) {
            event.preventDefault();
            if ($('#pd_thread_content').length > 0) return;
            var content = '';
            $('[id^="postmessage_"], .pattl').each(function () {
                content += $(this).html() + Config.threadSeparator;
            });

            var $threadContent = $(
                '<div id="pd_thread_content" style="position: fixed;">' +
                '  <div style="background-color: #2B7ACD; text-align: right">' +
                '    <span style="font-size: 16px; margin-right: 5px; padding: 2px 5px; color: #FFF; cursor: pointer;">&times;</span>' +
                '  </div>' +
                '  <div style="background-color: #FCFCFC;">' +
                '    <label><input type="checkbox" id="pd_remove_blank_lines" style="vertical-align: middle;" /> 去除多余空行</label><br />' +
                '    <textarea wrap="off" style="width: 750px; height: 450px; white-space: pre;"></textarea>' +
                '  </div>' +
                '</div>'
            ).appendTo('body');
            $threadContent.css('left', ($(window).width() - $threadContent.outerWidth()) / 2 + 'px')
                .css('top', ($(window).height() - $threadContent.outerHeight()) / 2 + 'px')
                .find('span:first')
                .click(function (e) {
                    e.preventDefault();
                    $('#pd_thread_content').remove();
                });
            var $textArea = $threadContent.find('textarea');
            var $removeBlankLines = $threadContent.find('#pd_remove_blank_lines');
            $removeBlankLines.click(function () {
                if ($(this).prop('checked')) {
                    var content = $textArea.val();
                    $textArea.data('content', content);
                    $textArea.val(content.replace(/\n{3,}/g, '\n\n'));
                }
                else {
                    var content = $textArea.data('content');
                    if (content) $textArea.val(content);
                }
                $textArea.focus().select();
            });
            $textArea.val(handleThreadContent(content)).focus().select();
            if (Config.autoRemoveBlankLines)
                $removeBlankLines.prop('checked', true).triggerHandler('click');
        });

    $('img[id^="aimg_"]').each(function () {
        var $this = $(this);
        $this.attr('src', $this.attr('file'));
    });

    if (Config.autoEnterReadMode) {
        var forumId = parseInt($('input[type="hidden"][name="srhfid"]').val());
        if (!Config.autoEnterForumIdList.length || $.inArray(forumId, Config.autoEnterForumIdList) > -1) {
            enterReadMode();
            $enterReadModeLink.text('退出阅读模式');
        }
    }
})(jQuery);