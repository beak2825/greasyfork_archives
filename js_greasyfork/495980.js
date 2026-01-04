// ==UserScript==
// @name         ghs
// @namespace    http://tampermonkey.net/
// @version      2024-05-23
// @description  用来在某些网址去广告的油猴插件
// @author       You
// @include      https://haijiao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495980/ghs.user.js
// @updateURL https://update.greasyfork.org/scripts/495980/ghs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 禁止body添加style，一般登录弹窗出现时滚轮不能使用，这是在
     * body上添加了'overflow: hidden'，所以要删掉style属性
     * 给body添加一个MutationObserver来进行监视
     * @return {void}
     */
    function delBodyStyle() {
        const Callback = function (mutationsList, observer) {
            document.body.removeAttribute('style')
            document.body.removeAttribute('class')
            observer.disconnect();
        };
        let Observer = new MutationObserver(Callback);
        Observer.observe(document.body, {
            attributes: true
        });
    }

    /**
     * 禁止body添加class，一般登录弹窗出现时滚轮不能使用，这是在
     * body上添加了'overflow: hidden'，所以要删掉class属性
     * 给body添加一个MutationObserver来进行监视
     * @return {void}
     */
    function delBodyClass() {
        const Callback = function (mutationsList, observer) {
            debugger
            document.body.removeAttribute('class')
            observer.disconnect();
        };
        let Observer = new MutationObserver(Callback);
        Observer.observe(document.body, {
            attributes: true,
            attributeFilter :['class']
        });
        debugger
    }

    /**
     * 对可以直接用css选择的元素用油猴的GM_addStyle函数隐藏
     * 隐藏方法是添加css的style属性{display: none !important;}
     * @param {...string} selectors - 参数是css选择器可以识别的一个或多个字符串
     * @returns {void}
     * @example
     * hideElementByGM(
     *   '.class1',
     *   '.class2',
     *   '#name'
     * )
     */
    function hideElementByGM() {
        if (arguments.length == 0) return
        let css = ''
        for (var i = 0; i < arguments.length; i++) {
            css += arguments[i] + ','
        }
        // 去掉最后一个逗号
        css = css.slice(0, -1) + "{display: none !important;}"
        GM_addStyle(css)
    }

    /**
     * 对传入的一个或多个jQuery对象里的元素添加style属性'display: none !important'
     * 一般css选择器无法匹配才用，参数是用jQuery匹配的一个或对象
     * 对页面元素加载完后再用JavaScript生成的元素不管用
     * @param {...jQuery} elements -传入一个或多个jQuery对象
     * @returns {void}
     * @example
     * hideElement(
     *   $('.class1'),
     *   $('.class2'),
     *   $('#name')
     * )
     */
    function hideElement() {
        if (arguments.length == 0) return
        for (var i = 0; i < arguments.length && arguments[i].length > 0; i++) {
            try{
                arguments[i][0].remove()
            }catch(e){
                console.log(e)
            }

        }
    }

    function haijiao(){
        GM_addStyle(
            '.el-popup-parent--hidden,'+
            '.ishide'+
            '{'+
            'overflow: auto !important;'+
            'max-height: none !important;'+
            '}'+
            '.ishide::before{display: none !important;}'
        )
        hideElementByGM(
            '.v-modal',
            '.el-message-box__wrapper',
            '.scroll-btn',
            '.justify-content-center',
            '.hj-rankinglist',
            '#hj_login__window__',
            '.html-bottom-box',
            '.addbox',
            '.van-swipe__track',
            '.giftListContainer',
            '.van-overlay',
            '.van-dialog',
            '.containeradvertising',
            '#button'
        )

        function delPopupAfterLogin(){
            // 去登录后的弹窗
            const haijiaoCallback = function (mutationsList, observer) {
                $('.van-button').click()
                observer.disconnect();
            };
            let Observer = new MutationObserver(haijiaoCallback);
            Observer.observe(document.body, {
                childList: true
            });
        }
        if (window.location.href == 'https://haijiao.com/login') {
            // 去登录页的弹窗
            const haijiaoCallback = function (mutationsList, observer) {
                if (mutationsList[0].addedNodes[0].className == 'mobile')
                {
                    $('.login-btn').click(()=>{delPopupAfterLogin()})
                    observer.disconnect();
                }
            };
            let Observer = new MutationObserver(haijiaoCallback);
            Observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

    }

    function start_(){
        haijiao()
    }

    window.addEventListener('load', (event) => {
        start_()
    });
    // Your code here...
})();