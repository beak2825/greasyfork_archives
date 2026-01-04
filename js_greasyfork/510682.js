// ==UserScript==
// @name         微信公众号沉浸式阅读
// @namespace    http://www.example.com/
// @version      1.1.0
// @license      MIT Licensed
// @description  为微信公众号PC网站文章添加沉浸式阅读功能
// @author       静美书斋
// @match        https://mp.weixin.qq.com/s*
// @icon         https://mp.weixin.qq.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/510682/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510682/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

/**
 * 版本更新细节
 * ----------
 * [1.1.0][20250418]
 * 1.实现按钮不跟随主体文章滑动而滑动
 */
(function() {
    'use strict';

    // 是否进入沉浸阅读 false-否 true-是，默认为false
    let isImmersive = false;

    // 用window的onload事件，窗体加载完毕的时候
    window.onload = function(){
        console.log("页面加载完成====》onload");
        main();
    }

    // 主函数
    function main() {

        // 创建沉浸阅读按钮
        const immersiveButton = $('<div>', {
            class: 'immersive-button',
            css: {
                'width': '48px',
                'height': '48px',
                'border': '1px solid #edf1fd',
                'border-radius': '50%',
                'cursor': 'pointer',
                'align-items': 'center',
                'justify-content': 'center',
                'position': 'relative'
            }
        });

        // 创建自定义提示框
        const customTooltip = $('<div>', {
            class: 'custom-tooltip',
            text: '沉浸阅读',
            css: {
                'position': 'absolute',
                'background-color': '#333333',
                'color': '#ffffff',
                'padding': '5px 10px',
                'border-radius': '4px',
                'font-size': '12px',
                'white-space': 'nowrap',
                'bottom': '120%',
                'left': '50%',
                'transform': 'translateX(-50%)',
                'opacity': '0',
                'transition': 'opacity 0.3s, bottom 0.3s',
                'pointer-events': 'none',
                'z-index': '1000'
            }
        }).appendTo(immersiveButton);

        // 添加图标
        const icon = $('<div>', {
            css: {
                'width': '22px',
                'height': '22px',
                'background-color': '#333333',
                'mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
                '-webkit-mask-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 21 21\'%3E%3Cpath d=\'M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H4C4.41421 0.25 4.75 0.585786 4.75 1C4.75 1.41421 4.41421 1.75 4 1.75H1.75V4C1.75 4.41421 1.41421 4.75 1 4.75C0.585786 4.75 0.25 4.41421 0.25 4V1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75H4C4.41421 19.75 4.75 19.4142 4.75 19C4.75 18.5858 4.41421 18.25 4 18.25H1.75V16C1.75 15.5858 1.41421 15.25 1 15.25C0.585786 15.25 0.25 15.5858 0.25 16V19ZM19 0.25C19.4142 0.25 19.75 0.585786 19.75 1V4C19.75 4.41421 19.4142 4.75 19 4.75C18.5858 4.75 18.25 4.41421 18.25 4V1.75H16C15.5858 1.75 15.25 1.41421 15.25 1C15.25 0.585786 15.5858 0.25 16 0.25H19ZM19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H16C15.5858 19.75 15.25 19.4142 15.25 19C15.25 18.5858 15.5858 18.25 16 18.25H18.25V16C18.25 15.5858 18.5858 15.25 19 15.25C19.4142 15.25 19.75 15.5858 19.75 16V19ZM7 5C5.89543 5 5 5.89543 5 7V13C5 14.1046 5.89543 15 7 15H13C14.1046 15 15 14.1046 15 13V7C15 5.89543 14.1046 5 13 5H7Z\'/%3E%3C/svg%3E")',
                'mask-size': 'cover',
                '-webkit-mask-size': 'cover',
                'margin-top': '14px',
                'margin-left': '13px',
            }
        });

        immersiveButton.append(icon);

        // 创建包裹沉浸阅读按钮的div
        const immersiveWrapper = $('<div>', {
            class: 'immersive-wrapper',
            css: {
                'text-align': 'center',
                'width': '48px',
                'height': '48px',
                'top': '180px',
                'position': 'fixed',
                'z-index': '1',
                'transform': 'translateX(-108px)',// 在position为fixed时，此字段设置为核心
            }
        }).append(immersiveButton);

        // 将按钮添加到适当位置
        $('#img-content').prepend(immersiveWrapper);

        // 点击沉浸阅读按钮时的处理函数
        function toggleImmersiveReading() {
            isImmersive = !isImmersive;

            if (isImmersive) {
                console.log('左键单击了沉浸阅读按钮--->>进入沉浸');
                hide(true, false);
            } else {
                console.log('左键单击了沉浸阅读按钮--->>退出沉浸');
                hide(false, false);
            }
            updateTooltipText(); // 更新文本
        }

        // 左键单击事件：进入沉浸阅读，保留沉浸按钮
        immersiveButton.on('click', toggleImmersiveReading);

        // 右键单击事件：进入沉浸阅读，不保留沉浸按钮，方便数据采集
        immersiveButton.on('contextmenu', function(e) {
            e.preventDefault(); // 阻止默认的右键菜单
            // 在这里添加右键单击时要执行的操作
            console.log('右键单击了沉浸阅读按钮');
            hide(true, true);
        });

        // 更新提示文本的函数
        function updateTooltipText() {
            customTooltip.text(isImmersive ? '退出沉浸' : '沉浸阅读');
        }

        // 添加悬停效果 特别说明：当在此对icon.css设置背景色后，则在hide方法中再设置该值时无效。
        immersiveButton.hover(
            function() {
                icon.css('background-color', '#858585');
                customTooltip.css({
                    'opacity': '1',
                    'bottom': '125%'
                });
            },
            function() {
                icon.css('background-color', '#333333');
                customTooltip.css({
                    'opacity': '0',
                    'bottom': '320%'
                });
            }
        );

        // 公共调用方法
        function hide(isImmersive, isImmersiveX) {

            // 文章开始前的关注信息
            //$('.rich_media_content > section').eq(0).hide();
            const firstChild = $('.rich_media_content > section').children().first();
            // console.log('当前 section 下的第一个元素是: ', firstChild.prop('tagName'));

            if (isImmersive) {
                if (firstChild.prop('tagName') === 'SPAN') {
                    // 针对文章前section标签下只有span元素的情况
                    console.log('[进入沉浸][标签选择]第一种情况...');
                } else if (firstChild.prop('tagName') === 'SECTION') {
                    // 针对文章在section标签下的情况
                    console.log('[进入沉浸][标签选择]第二种情况...');
                    $('.rich_media_content > section').children().eq(0).hide();
                    $('.rich_media_content > section').children().eq(1).hide();
                    $('.rich_media_content > section').children().eq(2).hide();
                } else {
                    console.log('[进入沉浸]当前 section 没有子元素');
                }
                // 底部-喜欢作者
                $('#content_bottom_area').hide();
                // 底部-用户标栏
                $('#content_bottom_interaction').hide();

                // 底部-往期精彩内容
                $('section[mpa-from-tpl="t"][data-mpa-action-id="m6tbx2mp1ism"]').hide();
                $('section[data-mpa-template="t"][mpa-from-tpl="t"][data-mpa-action-id="m6tc16j0olh"]').hide();
                // 底部-公众号关注
                $('.mp_profile_iframe_wrp').hide();
                // 底部-标签列表
                $('.article-tag__list').hide();
                // 底部-上一篇&下一篇
                $('.appmsg_card_context album_read_card').hide();

                // 将文章主体扩至指定宽度
                $('.pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_primary_inner').css('max-width', '1024px');
                // icon.css('background-color', '#FFAC06');  // 橙色 与收藏按钮点击效果保持一致

                // 进入完全沉浸
                if (isImmersiveX) {
                    // 隐藏沉浸按钮
                    $('.immersive-button').hide();
                }

            } else {

                if (firstChild.prop('tagName') === 'SPAN') {
                    // 针对文章前section标签下只有span元素的情况
                    console.log('[退出沉浸][标签选择]第一种情况...');
                } else if (firstChild.prop('tagName') === 'SECTION') {
                    // 针对文章在section标签下的情况
                    console.log('[退出沉浸][标签选择]第二种情况...');
                    $('.rich_media_content > section').children().eq(0).show();
                    $('.rich_media_content > section').children().eq(1).show();
                    $('.rich_media_content > section').children().eq(2).show();
                } else {
                    console.log('[退出沉浸]当前 section 没有子元素');
                }

                // 文章开始前的关注信息
                // $('.rich_media_content > section').eq(0).show();

                // 底部-喜欢作者
                $('#content_bottom_area').show();
                // 底部-用户标栏
                $('#content_bottom_interaction').show();


                // 底部-往期精彩内容
                $('section[mpa-from-tpl="t"][data-mpa-action-id="m6tbx2mp1ism"]').show();
                $('section[data-mpa-template="t"][mpa-from-tpl="t"][data-mpa-action-id="m6tc16j0olh"]').show();
                // 底部-公众号关注
                $('.mp_profile_iframe_wrp').show();
                // 底部-标签列表
                $('.article-tag__list').show();
                // 底部-上一篇&下一篇
                $('.appmsg_card_context album_read_card').show();

                // 恢复主体内容宽度
                $('.pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_primary_inner').css('max-width', '677px');
                // icon.css('background-color', '#333333');
            }
        }
    }


})();