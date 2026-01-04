// ==UserScript==
// @name         获取最接近的颜色
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取最接近的颜色!
// @author       Sean
// @match        https://coolors.co/colors/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolors.co
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467389/%E8%8E%B7%E5%8F%96%E6%9C%80%E6%8E%A5%E8%BF%91%E7%9A%84%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/467389/%E8%8E%B7%E5%8F%96%E6%9C%80%E6%8E%A5%E8%BF%91%E7%9A%84%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let extraStyle = 'html.no-touchevents .closest .color-card_color span {opacity: 1;}';

    // 添加注入样式
    let extraStyleElement = document.createElement("style");
    extraStyleElement.innerHTML = extraStyle;
    document.head.appendChild(extraStyleElement);

    function hexToRgb(hexValue) {
        const r = parseInt(hexValue.substr(1, 2), 16);
        const g = parseInt(hexValue.substr(3, 2), 16);
        const b = parseInt(hexValue.substr(5, 2), 16);
        return { r, g, b };
    }

    function getColorDistance(color1, color2) {
        const rDiff = color2.r - color1.r;
        const gDiff = color2.g - color1.g;
        const bDiff = color2.b - color1.b;
        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }

    const colorsToCompare = ["#00FF00", "#0000FF", "#FFFF00"];

    window.onload = ()=> {
        setTimeout(()=>{
            jQuery('html').scrollTop(jQuery(document).height() - 200);

            setTimeout(()=> {
                const cards = document.querySelectorAll('.color-card');
                jQuery('html').scrollTop(0);
                let colors = []; // 页面上的十六进制颜色值
                let colorNames = []; // 页面上的颜色英文名称

                for(let i = 0, l = cards.length; i < l; i++) {
                    colors.push('#' + jQuery(cards[i]).find('span').text());
                    colorNames.push(jQuery(cards[i]).find('.color-card_name').text())
                }

                console.log(colors);
                console.log(colorNames);

                jQuery('.page-title').append('<input id="theme-color" style="border: 1px solid #ccc; width: 300px; height: 24px; text-indent: 10px; line-height: 24px;" autucomplete="off" placeholder="输入主题颜色如：#5D8AA8 查找最接近的颜色"/>')

                const $input = $('#theme-color');

                $input.keyup(function(event) {
                    if(event.keyCode == 13) {
                        const colorPattern = /^#[A-Fa-f0-9]{6}$/;
                        const targetColorHex = this.value.trim();
                        if (!colorPattern.test(targetColorHex)) {
                            alert('请输入十六进制颜色值')
                            return false;
                        }
                        // const targetColorHex = "#5D8AA8";

                        const targetColorRgb = hexToRgb(targetColorHex);

                        let closestColor = null;
                        let closestDistance = Infinity;
                        let colsestColorNameIndex = 0;

                        let secondClosestColor = null;
                        let secondClosestColorNameIndex = 0;
                        let secondClosestDistance = Infinity;

                        for (let i = 0, l = colors.length; i < l; i++) {
                            const colorHex = colors[i];
                            const colorRgb = hexToRgb(colorHex);
                            const distance = getColorDistance(targetColorRgb, colorRgb);

                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestColor = colorHex;
                                colsestColorNameIndex = i;
                            }
                        }

                        for (let i = 0, l = colors.length; i < l; i++) {
                            if(i == colsestColorNameIndex) {
                                continue;
                            }
                            const colorHex = colors[i];
                            const colorRgb = hexToRgb(colorHex);
                            const distance = getColorDistance(targetColorRgb, colorRgb);

                            if (distance < secondClosestDistance) {
                                secondClosestDistance = distance;
                                secondClosestColor = colorHex;
                                secondClosestColorNameIndex = i;
                            }
                        }

                        console.log("Closest color:", closestColor);
                        console.log("Closest color name :", colorNames[colsestColorNameIndex]);
                        console.log("Second closest color name :", colorNames[secondClosestColorNameIndex]);
                        alert('最接近的颜色是：' + colorNames[colsestColorNameIndex] + '\n第二接近的颜色是：' + colorNames[secondClosestColorNameIndex]);

                        const $scrollToElement = $(cards[colsestColorNameIndex]);
                        $scrollToElement.addClass('closest').siblings().removeClass('closest');
                        var offset = $scrollToElement.offset().top;

                        $('html, body').animate({ scrollTop: offset }, 'slow');

                    }
                });

            }, 1000);

        }, 2500);
    };
})();