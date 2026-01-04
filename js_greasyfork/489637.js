

// ==UserScript==
// @name         图搜图(淘宝\天猫\京东)
// @namespace    http://tampermonkey.net/
// @version      2024-03-16——0.1
// @description  try to take over the world!
// @author       Song
// @match        https://detail.tmall.com/item.htm?*
// @match        https://item.taobao.com/item.htm?*
// @match        https://item.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489637/%E5%9B%BE%E6%90%9C%E5%9B%BE%28%E6%B7%98%E5%AE%9D%5C%E5%A4%A9%E7%8C%AB%5C%E4%BA%AC%E4%B8%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489637/%E5%9B%BE%E6%90%9C%E5%9B%BE%28%E6%B7%98%E5%AE%9D%5C%E5%A4%A9%E7%8C%AB%5C%E4%BA%AC%E4%B8%9C%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        console.log('页面加载完成！挂载jQ');
        console.log(location.origin)
        //如果有jq就不挂载jquery了
        if (typeof jQuery == 'undefined') {
            console.log('没有jq，开始挂载');
            var script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-latest.js';
            script.type = 'text/javascript';
            script.onload = function () {
                console.log('jq加载完成，开始执行');
                main();
            }
            document.body.appendChild(script);
        } else {
            console.log('有jq，不挂载');
            main();
        }

    }

    function main() {
        // 重新命名$
        function getImgUrl() {
            if(location.origin === 'https://item.jd.com') {
                const src = $('#spec-img').attr('src')
                return src ? 'https:' + (src.replace(/.avif/g, "")) : ''
            } else {
                const src = $('.PicGallery--mainPic--1eAqOie').attr('src')
                return src ? 'https:' + (src.replace(/_.webp/g, "")) : ''
            }
        }
        function openLink(url) {
            if (!getImgUrl()) {
                alert('商品图片不可是视频格式！')
                return false
            }
            window.open(url);
        }
        const zjf = 'https://search.zhaojiafang.com/search/index/searchbyimage?images='
        const zyt = 'https://zhaoyuantou.com/yiFang?img='
        const jf = 'https://detail.91jf.com/search/image?url='
        var zjfUrl = zjf + getImgUrl()
        var zytUrl = zyt + getImgUrl()
        var jfUrl = jf + getImgUrl()
        let JfButton = $("<button id='JfButton'></button>").text("找家纺").attr('target', '_blank').attr('href', zjfUrl);
        let ZytButton = $("<button id='ZytButton'></button>").text("找源头").attr('target', '_blank').attr('href', zytUrl);
        let jfButtom = $("<button id='jfButtom'></button>").text("91家纺").attr('target', '_blank').attr('href', jfUrl);
        let openAllButton = $("<button id='openAllButton'></button>").text("一键打开").attr('target', '_blank');
        let pluginBox = $("<div id='pluginBox'></div>");
        pluginBox.append(JfButton).append(ZytButton).append(jfButtom).append(openAllButton);
        // setTimeout(() => {
            $('body').append(pluginBox);
            // 找家纺
            $('#JfButton').click(function () {
                zjfUrl = zjf + getImgUrl()
                openLink(zjfUrl);
            })
            // 找源头
            $('#ZytButton').click(function () {
                zytUrl = zyt + getImgUrl()
                openLink(zytUrl);
            })
            // 91家纺
            $('#jfButtom').click(function () {
                jfUrl = jf + getImgUrl()
                openLink(jfUrl);
            })
            // 一键打开三个tab

            $('#openAllButton').click(function () {
                if (!getImgUrl()) {
                    alert('商品图片不可是视频格式！')
                    return false
                }
                zjfUrl = zjf + getImgUrl()
                zytUrl = zyt + getImgUrl()
                jfUrl = jf + getImgUrl()
                openLink(zjfUrl);
                openLink(zytUrl);
                openLink(jfUrl);
            })
            // 按钮吸顶 固定在右下角
            // 美化按钮
            $('#pluginBox').css({
                'position': 'fixed',
                'bottom': '30%',
                'left': '30px',
                'display': 'flex',
                'height': '35vh',
                'align-items': 'center',
                'justify-content': 'space-between',
                'flex-direction': 'column',
            })

            // 按钮样式
            const buttonStyle = {
                'background-color': '#ff6600',
                'color': '#fff',
                'border': 'none',
                'padding': '10px 20px',
                'border-radius': '10px',
                'font-size': '16px',
                'cursor': 'pointer',
                'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.2)',
                'transition': 'transform 0.3s ease-in-out',
            };

            // Add animation on hover
            buttonStyle['transform'] = 'scale(1)';
            buttonStyle['transition'] = 'transform 0.3s ease-in-out';
            buttonStyle['will-change'] = 'transform';

            $('#JfButton').hover(
                function () {
                    $(this).css('transform', 'scale(1.1)');
                },
                function () {
                    $(this).css('transform', 'scale(1)');
                }
            );

            $('#ZytButton').hover(
                function () {
                    $(this).css('transform', 'scale(1.1)');
                },
                function () {
                    $(this).css('transform', 'scale(1)');
                }
            );

            $('#jfButtom').hover(
                function () {
                    $(this).css('transform', 'scale(1.1)');
                },
                function () {
                    $(this).css('transform', 'scale(1)');
                }
            );

            $('#openAllButton').hover(
                function () {
                    $(this).css('transform', 'scale(1.1)');
                },
                function () {
                    $(this).css('transform', 'scale(1)');
                }
            );

            $('#JfButton').css(buttonStyle);
            $('#ZytButton').css(buttonStyle);
            $('#jfButtom').css(buttonStyle);
            $('#openAllButton').css({
                ...buttonStyle,
                'margin-top': '5vh',
            });
        // }, 1000);
    }
})();