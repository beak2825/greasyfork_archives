// ==UserScript==
// @name        高效的百度搜索去广告插件
// @namespace    https://github.com/HaoNShi/Tampermonkey_Scripts
// @version      1.2
// @icon         https://www.baidu.com/favicon.ico
// @description  百度搜索去广告
// @author       七瑀
// @match        *://*.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426457/%E9%AB%98%E6%95%88%E7%9A%84%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/426457/%E9%AB%98%E6%95%88%E7%9A%84%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
 
(function() {
    let total = 100;
    let count = 0;
    $('#content_left').css('visibility', 'hidden');

    let fn = () => {
        count = 0;
        interval = setInterval(() => {
            count++

            if (count >= total) {
                clearInterval(interval);
            }
            let list = $('#content_left').children();
            let indexArr = [];

            list.map((index, item) => {
                if (item.innerHTML.includes('tuiguang') || item.innerHTML.includes('广告')) {
                    indexArr.push(index);
                }
            });

            indexArr = indexArr.reverse();
            indexArr.map((item) => {
                $(list[item]).css('display', 'none');
            })

            $('#content_left').css('visibility', 'visible');
        }, 100);
    }

    fn();

    document.addEventListener('click', e =>{
        fn();
    });

    $('#kw')[0].addEventListener('blur', e =>{
        fn();
    });
})();