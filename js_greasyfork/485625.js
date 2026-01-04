// ==UserScript==
// @name         修改百度css样式(Ac-baidu + Dark Reader)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  配合 Ac-baidu- 脚本和 Dark Reader 扩展程序修改百度css样式
// @author       Brayden
// @license      AGPL-3.0-or-later
// @icon         data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAAuBJREFUSEutlEtoE1EUhv8zaX3ATKsLH6GiTbVW0FWhFV20UO1GFGxVRBeCz5pJfGwr6ELBbn2kifW5EBTx0YK6ihbahdIWulKwtuZGUYK60HYGtLaZKzftjTPjxKaSA8Mkc8653/3PPfcQpq0iZuyQvwv1TgS1h2ItkgsG2o0XIGwoFAAcL1lI2+iAVESNTg5sLxSEgK6ErjU5lUTHOgA6UigIwK8yvaTFXa6zIJwuGITjHAtpZ1xKjBCAiIQMHZo7a17V9XF7TpjpWrsTcsXYCQv3CwZRsIsd1R44IRGjDgp6JKR5tQ9l6sximip9KNMInwyOhnu//iRYqGdhrdd98FUAvZl5WWdE9+45GUhfysK+pxM2J1/D9JIhB6T8Fl9AP8xv/wt59DaN1t7JbDqfry5M7qfvDoj4E4gaPwFkTvxYtQ81fiWbtEzN3lvHPoQKYS7IONO1eTLQkRmIGu8BLJeQcHVR3sIig5O4PJiW8R+Yrq3IATH7AV4jnLV+BeFqnwMiDtdtokGEiVIJNVNGA0xXa70hMfMxON+a7/YFoK1uSq0DQvSEBdVtnpDy9rEbRHRAOEWtb28pzsR1DqftpcjuwQ4R7SuVcs5vJkMlB70hUfM8gbdKiGhPYa56ZyGiOeS5OSCgtqSunsqhxDxBxC+4IWKHQk1fiqM/ZWVUNlcqkBdRxNtHCud0MhlSL+aAjO4hUu5I52zmlxNi7U2GSu96QlbGjAaL47l0iprXLCXIDnI3hFD40eToGrZsnQUohE3vglq3J2RVxFibVvDKvZgoT5lKWO+nzAUdSFnZ0nl1os/CupGw9tobcslYlC7Cl3xbOFecbxKLR45rXz0h4mMg6nHjZkll+vSsmc77ayAFrplLMIFGQDxcvP15MFIAxQHEUYw4O6x+tud4Tz1bRCA2WgtLaQRlwPU2Vw844lCsOAuW9v9rIzNC7MkVHbwUlrkZivos0UKjeSjMhPwG2OIXKUPTsJoAAAAASUVORK5CYII=
// @match        https://www.baidu.com/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485625/%E4%BF%AE%E6%94%B9%E7%99%BE%E5%BA%A6css%E6%A0%B7%E5%BC%8F%28Ac-baidu%20%2B%20Dark%20Reader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485625/%E4%BF%AE%E6%94%B9%E7%99%BE%E5%BA%A6css%E6%A0%B7%E5%BC%8F%28Ac-baidu%20%2B%20Dark%20Reader%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 功能：注入样式以覆盖:hover样式
    function overrideHoverStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            #wrapper #content_left .result-op:hover,
            #wrapper #content_left .result:hover,
            #wrapper #content_left .result-op:hover article {
                background-color: rgba(255, 255, 255, 1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 当文档加载完成时清除样式
    // window.onload = function () {
    //     overrideHoverStyles('#wrapper #content_left .result-op:hover, #wrapper #content_left .result:hover, #wrapper #content_left .result-op:hover article');
    // };
    overrideHoverStyles('#wrapper #content_left .result-op:hover, #wrapper #content_left .result:hover, #wrapper #content_left .result-op:hover article');

    // 创建一个观察者实例并传入回调函数
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // 当style属性变化时，清除:hover样式
                overrideHoverStyles('#wrapper #content_left .result-op:hover, #wrapper #content_left .result:hover, #wrapper #content_left .result-op:hover article');
            }
        }
    });

    // 配置观察者实例：观察style属性的变化
    const config = { attributes: true, subtree: true, attributeFilter: ['style'] };

    // 开始观察文档根节点对应的DOM元素
    observer.observe(document.documentElement, config);
})();