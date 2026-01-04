// ==UserScript==
// @name         图片清晰处理 - Image Clarity Processing
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  当一张100×100的图片被css改为别的尺寸时会变得模糊，利用image-rendering，让被缩放过的图片变清晰，兼容常见浏览器
// @license      MIT
// @author       Lainbo
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAyRJREFUWEftl09oHFUcxz+/SYQYEBTERtOIHtJjekhmYnpqKEpoBRtQQRAaSVJpS4JQ050RJKuk7iyRigm0tmhUxAQaqErRg4gJom3ztqkleBTaQyloS+3FYkyan8xmJ5lsks1umiE9+E6z89783ud9f3/eb4VNHrLJ+3N/AThp7UXpALbGoMxVIGNceTlqe0EBO60nRdkfw8ZLTCq8n3GlJ3y5AOD4egV4ak5pvujJ+EaDNKR0pyWMAdeMKzUrAWjw0rgSW1w4vi7bI6rAPQM4KQ3ipwuhToRfFD41CfkkPG2sAI6vp4GX8l0XdWlsAPVJfbSsghu5zbuNK4NOSpMIvQjnTUJ2BHOxAYQBpjCecaV5NcljA6j/QB8vm+Z6sHEoueNrFzCAMmU82R6rAoFx29cxgZ3Bc6BE+IzSaTz5eN0Ajf1ap3cZQvi33GLvuR75c7Ua4fg6kM2CxTEarXwlu8BJawPKMFCbtal8ZzzZU6hINR3T6plpanWa3yaTcjO6tiQA29cdAiPAkypcQqkSeAIYNK50F4KwU9om8LfxZHRdAI1HtVktRhC2BP6cs+iQWaosi58DgwJvTLjy4UoQtq/9Am/mYuFgxpUTJRUioIX5kz8CnJ2Zo/3XtySb47avrwp8kYPYO+HKN1GIRl9PKXTmgT1vXPm26CAE7gCVCF/eepD237tlOmrQTuvborwL3FSLZzNH5HJ9UivLKvgceDG3NiHCY6ocBm6oxXPBuqJiIGtA+Mgk5MBqfrZ9HRJ4TcGUzdA29wCDwK7ctx1h/XdSOozwCjBZ/g+7Zyv4I1gTvfCWXUYo/caTI4WCLC/v/8q6S7gFtJuEfL1EscX68BXQuiZAsdex3ac1lDMl8DBwW+GFjCs/5YM39Wn13XJ+BLaFcwUVKBYgq0Jau0XJZoMqhzKeHF9JuYa0OpbyA/DQhimwkFrv6T4sPgt+W8rTFzwJer9lw0lpK8KZDQfIptf81dtiXHmmUOwUlQWluGCtQM2fXwtgk5vSsIMp9VilrlfeMZ4kw8+WdMA5X7bH9cdEhe8zCXk9yhxbC16sMP8D/AdoCaAwutTNLwAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440754/%E5%9B%BE%E7%89%87%E6%B8%85%E6%99%B0%E5%A4%84%E7%90%86%20-%20Image%20Clarity%20Processing.user.js
// @updateURL https://update.greasyfork.org/scripts/440754/%E5%9B%BE%E7%89%87%E6%B8%85%E6%99%B0%E5%A4%84%E7%90%86%20-%20Image%20Clarity%20Processing.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    styleSheet.textContent = 'img {image-rendering: -webkit-optimize-contrast;image-rendering: crisp-edges;}';
})()