// ==UserScript==
// @name         Singroll - delete timers
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Close EDM1 floating ad on singroll.com
// @author       You
// @match        *://*.singroll.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527185/Singroll%20-%20delete%20timers.user.js
// @updateURL https://update.greasyfork.org/scripts/527185/Singroll%20-%20delete%20timers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 引入 jQuery (如果网站没有加载 jQuery)
    let script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);

    // 2. 延迟执行脚本，等待 jQuery 加载完成
    script.onload = function() {
        console.log("jQuery loaded, executing main script...");

        // 3. MutationObserver 监听广告元素出现
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    if (document.querySelector('.edm1')) {
                        console.log("EDM1 ad element found, hiding it and overriding functions...");

                        // 4. 隐藏广告
                        $('.edm1').hide();
                        $('.hidden_background1').hide();

                        // 5. 覆盖 countandcloseedm 函数
                        unsafeWindow.countandcloseedm = function() {
                            $('.edm1').hide();
                            $('.hidden_background1').hide();
                            console.log("Ad hidden by overridden countandcloseedm().");

                            $('.closeedm1').remove();
                            $('.closeedm2').remove();
                        };

                        // 6. 覆盖 closeEDM1 函数 (可选)
                        unsafeWindow.closeEDM1 = function() {
                            console.log("closeEDM1() called, but overridden.");
                        };

                        // 7. 清除广告显示定时器 (可选)
                        let showAdTimeout = null;
                        $(document).ready(function(){
                            showAdTimeout = setTimeout(function(){
                                $('.edm1').show();
                                $('.hidden_background1').show();
                            }, 2000);
                            clearTimeout(showAdTimeout);
                            console.log("Cleared initial ad display timeout.");
                        });

                        observer.disconnect();
                    }
                }
            });
        });

        // 8. 开始监听 body 元素
        observer.observe(document.body, { childList: true, subtree: true });

    };

    script.onerror = function() {
        console.error("Failed to load jQuery.");
    };

})();