// ==UserScript==
// @name         网页版有道翻译-净化
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  网页版有道翻译净化
// @author       XiaoMao
// @match        https://fanyi.youdao.com/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482846/%E7%BD%91%E9%A1%B5%E7%89%88%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91-%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482846/%E7%BD%91%E9%A1%B5%E7%89%88%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91-%E5%87%80%E5%8C%96.meta.js
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
                let DropElement = document.getElementsByClassName('color_text_3')
                for(let i = 0;i < DropElement.length;i++){
                    DropElement[i].style.display = "none"
                }
                document.getElementsByClassName('ic_new_tag').length ? document.getElementsByClassName('ic_new_tag')[0].parentNode.removeChild(document.getElementsByClassName('ic_new_tag')[0]) : ''

                //新版本屏蔽 - 2024/05
                //移除顶部按钮
                document.getElementsByClassName('header-content').length ? document.getElementsByClassName('header-content')[0].parentNode.removeChild(document.getElementsByClassName('header-content')[0]) : ''
                //移除侧边页签
                let AsideBtnElement = document.getElementsByClassName('menu-item')
                for(let i = 0;i < AsideBtnElement.length;i++){
                    if(i >= 1 ){
                        AsideBtnElement[i].style.display = "none"
                    }
                }
                //移除反馈
                document.getElementsByClassName('feedback-container').length ? document.getElementsByClassName('feedback-container')[0].parentNode.removeChild(document.getElementsByClassName('feedback-container')[0]) : ''


                //旧版本屏蔽
                //移除顶部页签
                let HeaderBtnElement = document.getElementsByClassName('nav_item')
                for(let i = 0;i < HeaderBtnElement.length;i++){
                    if(i != 0){
                        HeaderBtnElement[i].innerHTML = ""
                    }
                }
                //移除底部
                document.getElementsByClassName('footer').length ? document.getElementsByClassName('footer')[0].parentNode.removeChild(document.getElementsByClassName('footer')[0]) : ''

                //移除底部banner
                document.getElementsByClassName('banner').length? document.getElementsByClassName('banner')[0].parentNode.removeChild(document.getElementsByClassName('banner')[0]) : ''

                //移除反馈按钮
                document.getElementsByClassName('sticky-sidebar').length ? document.getElementsByClassName('sticky-sidebar')[0].parentNode.removeChild(document.getElementsByClassName('sticky-sidebar')[0]) : ''

                //移除登陆
                document.getElementsByClassName('account').length ? document.getElementsByClassName('account')[0].innerHTML = "" : ''

                //移除AI引导
                document.getElementsByClassName('ai-guide').length ? document.getElementsByClassName('ai-guide')[0].innerHTML = "" : ''

                //移除底部banner引导
                document.getElementsByClassName('banner-outer-container').length ? document.getElementsByClassName('banner-outer-container')[0].innerHTML = "" : ''
                
                //移除弹窗
                document.getElementsByClassName('pop-up-comp').length ? document.getElementsByClassName('pop-up-comp')[0].innerHTML = "" : ''

                //移除底部footer
                document.getElementsByClassName('dict-website-footer').length ? document.getElementsByClassName('dict-website-footer')[0].innerHTML = "" : ''

                //移除顶部广告banner
                document.getElementsByClassName('top-banner-outer-container').length ? document.getElementsByClassName('top-banner-outer-container')[0].innerHTML = "" : ''

                //移除下载广告
                document.getElementsByClassName('box_ch').length ? document.getElementsByClassName('box_ch')[0].parentNode.removeChild(document.getElementsByClassName('box_ch')[0]) : ''

                //移除弹窗
                setTimeout(()=>{
                    document.getElementsByClassName('pop-up-comp').length ? document.getElementsByClassName('pop-up-comp')[0].parentNode.removeChild(document.getElementsByClassName('pop-up-comp')[0]) : ''
                },300)

                //监听地址栏变化
                window.onhashchange = function() {
                    //移除顶部标签
                    let DropElement = document.getElementsByClassName('color_text_3')
                    for(let i = 0;i < DropElement.length;i++){
                        DropElement[i].style.display = "none"
                    }
                    document.getElementsByClassName('ic_new_tag').length ? document.getElementsByClassName('ic_new_tag')[0].parentNode.removeChild(document.getElementsByClassName('ic_new_tag')[0]) : ''
                    //移除下载广告
                    document.getElementsByClassName('box_ch').length ? document.getElementsByClassName('box_ch')[0].parentNode.removeChild(document.getElementsByClassName('box_ch')[0]) :''
                };

            }
        },500)
    }
})();