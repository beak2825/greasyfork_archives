// ==UserScript==
// @name         机核文章页视频自动隐藏
// @namespace    https://github.com/silevilence/enhances-g-cores
// @version      1.1
// @description  自动隐藏文章页面上的视频（被自动播放烦得不要不要的）
// @author       Silevilence
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js
// @match        http*://www.gcores.com/articles/*
// @supportURL   https://github.com/silevilence/enhances-g-cores/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=silevilence@outlook.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/39836/%E6%9C%BA%E6%A0%B8%E6%96%87%E7%AB%A0%E9%A1%B5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/39836/%E6%9C%BA%E6%A0%B8%E6%96%87%E7%AB%A0%E9%A1%B5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 机核现在不用jQuery了，需要自己引入
    /**
     * 隐藏视频用的函数
     * @param video 带视频的外层div
     * @param timeout 延时
     */
    function hideVideo(video, timeout) {
        // 现在外层是figure
        let figure = $(video).parent();

        window.setTimeout(function () {

            figure.addClass('story_block-spoiler');

            if ($(video).find('iframe').length === 0) {
                hideVideo(video, timeout * 2);
                return;
            }

            // 提示按钮
            let div = document.createElement('div');
            $(div).addClass('story_hidden');
            $(div).attr('role', 'button');
            div.tabIndex = -1;

            // 提示文字
            let p = document.createElement('p');
            $(p).text('这里有一个被自动隐藏的视频');

            let strong = document.createElement('strong');
            $(strong).text('点击查看');

            div.append(p);
            div.append(strong);

            $(function () {
                $(div).click(function () {
                    figure.removeClass('story_block-spoiler');
                });
            });

            figure.prepend(div);
        }, timeout);
    }

    // 每个视频放在一个div中，class带有story_embed-video
    let videos = $('div.story_embed-video');
    // 用each针对每个视频进行单独的隐藏处理，处理方式模仿机核的剧透隐藏功能
    videos.each(function () {

        // 已经被隐藏了
        if ($(this).parent().hasClass('story_block-spoiler')) {
            console.log('A video is already hidden.');
            return;
        }

        hideVideo(this, 2000);

        // 新版换了个处理方式，下面的代码全部木大
        // 其实能用，只是会很难看而已
        /*
        // 获取外层html并作为字符串保存在一个隐藏的textarea中
        let str = this.outerHTML;
        let textarea = document.createElement('textarea');
        // noinspection SpellCheckingInspection
        $(textarea).addClass('j_storyshow_textareaEmbed');
        $(textarea).hide();
        $(textarea).text(str);
        // 删除视频的iframe标签
        $(this).remove();
        // 生成一个显示隐藏内容的a标签
        let a = document.createElement('a');
        $(a).attr('href', 'javascript:;');
        $(a).text('这是插件自动隐藏的视频，点击以显示');
        // noinspection SpellCheckingInspection
        $(a).addClass('story_elem-embed_manual j_storyshow_showEmbed');
        // 设置a标签的点击事件，参考了机核本身的源码
        $(function () {
            $(a).click(function () {
                $(this).hide();
                // noinspection SpellCheckingInspection
                let e = $(this).siblings('.j_storyshow_textareaEmbed');
                e.replaceWith(e.val());
            });
        });
        // 对父级div通过前端插入的方式依次放入a和textarea
        figure.prepend($(a));
        figure.prepend($(textarea));
        */
    });
})();