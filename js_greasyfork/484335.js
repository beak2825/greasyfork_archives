// ==UserScript==
// @name         网页版百度翻译-净化
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  网页版百度翻译净化
// @author       XiaoMao
// @match        https://fanyi.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484335/%E7%BD%91%E9%A1%B5%E7%89%88%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91-%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/484335/%E7%BD%91%E9%A1%B5%E7%89%88%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91-%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
    againF()
    function againF() {
        setTimeout(()=>{
            if(document.readyState != 'complete'){
                againF()
            }else{
                //移除顶部标签
                let DropElement = document.getElementsByClassName('navigation-text')
                for(let i = 0;i < DropElement.length;i++){
                    if(i > 2){
                        DropElement[i].style.display = "none"
                    }
                }

                //移除小图标
                document.getElementsByClassName('navigation-text-pro')[0].classList.remove('navigation-text-pro')

                //移除企业服务
                document.getElementsByClassName('menuItem')[0].style.display = "none"

                //移除vip按钮
                document.getElementsByClassName('vip-btn')[0].style.display = "none"

                //移除领域选择
                //document.getElementsByClassName('trans-domain-btn')[0].style.display = "none"

                //移除人工翻译
                document.getElementsByClassName('manual-trans-btn')[0].style.display = "none"

                //移除底部
                document.getElementsByClassName('footer')[0].parentNode.removeChild(document.getElementsByClassName('footer')[0])

                //监听地址栏变化
                window.onhashchange = function() {
                    //移除翻译小提示
                    document.getElementById('app-read') ? document.getElementById('app-read').parentNode.removeChild(document.getElementById('app-read')) : ''
                    document.getElementsByClassName('nav-dxy-logo').length ? document.getElementsByClassName('nav-dxy-logo')[0].parentNode.removeChild(document.getElementsByClassName('nav-dxy-logo')[0]) : ''

                };

            }
        },300)
    }
})();