// ==UserScript==
// @name         HuangQS
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  自用,一些页面的优化
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490311/HuangQS.user.js
// @updateURL https://update.greasyfork.org/scripts/490311/HuangQS.meta.js
// ==/UserScript==

(function() {
    'use strict';




    function modifyPage (){

        // 获取当前页面的URL
        const currentURL = window.location.href;
        // alert(currentURL)

        // 亡灵增量
        if (currentURL.includes('www.mhhf.com') || currentURL.includes('www.json1.cn')) {
            document.title = '测试-Canvas绘制展示';

            setInterval(()=>{
                // 找到包含所有按钮的父元素
                let spellsContainer = document.querySelector('.spells');

                // 找到所有按钮元素
                let spellButtons = spellsContainer? spellsContainer.querySelectorAll('.spell') : undefined;

                // 循环点击每个按钮
                if(spellButtons){
                    for(let i =0 ; i<spellButtons.length ; i++){
                        //仅点击前两个
                        if(i>=2)break;
                        let button = spellButtons[i];
                        // 触发点击事件
                        button.dispatchEvent( new MouseEvent('click', { bubbles: true,cancelable: true, view: window }));
                    }

                }
            },1000)

        }

        //json在线解析去广告 进入后全屏
        else if (currentURL.includes('www.json.cn')) {
            document.title = 'JSON';

            // 找到对应的按钮元素 触发点击事件
            let clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            document.getElementById('formatFullScreen').dispatchEvent(clickEvent);
        }
        //文本比对 进入后全屏
        else if(currentURL.includes('https://tool.lu/diff')){
            let clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            document.getElementById('js-webfullscreen').dispatchEvent(clickEvent);
        }
        else if (currentURL.includes('https://www.baidu.com')){
            //let element = document.querySelector('[id="content_right"]')
            const element = document.getElementById('content_right');

            if (element) {
                element.style.width = '300px'; // 设置宽度
                // element.style.color = 'red'; // 设置文字颜色
                // element.style.backgroundColor = 'red'; // 设置背景颜色
            }
        }
        //KIMI
        else if (currentURL.includes('kimi.moonshot.cn')){
            /**
        setTimeout( ()=>{
            let item = document.getElementsByClassName('css-1x6e6a7')

            const targetDiv = document.querySelector('.MuiBox-root.css-1x6e6a7');
            console.log(targetDiv)
            // 检查是否找到了该元素
            if (targetDiv) {
                // 移除或更新 max-width 样式属性
                targetDiv.style.maxWidth = 'none'; // 或者使用 'unset' 或者具体的宽度值
                // 如果你想要完全移除这个样式属性，可以这样做：
                // targetDiv.style.removeProperty('max-width');
            }
        }, 2000)
**/
        }
        else if (currentURL.includes('https://www.coze.com/space')){

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        // 检查是否是你要查找的元素
                        const parentContainer = document.querySelector('.sidesheet-container');
                        if (parentContainer) {
                            parentContainer.style.display = 'flex';
                            parentContainer.style.removeProperty('grid-template-columns');

                            console.log('HuangQS parentContainer>' , parentContainer)
                            // 获取父容器内所有的子元素
                            const children = parentContainer.children;
                            // 检查是否有至少3个元素
                            if (children.length >= 3) {
                                children[0].style .width= '15vw'
                                parentContainer.removeChild(children[1]);
                            }

                            // 获取父容器中最后一个子元素
                            const lastChild = parentContainer.lastElementChild;

                            if (lastChild) {
                                console.log('HuangQS lastChild>')
                                // 设置样式
                                lastChild.style.width = '100%'; // 设置宽度
                                //lastChild.style.backgroundColor = 'red'; // 设置背景色
                            }

                            observer.disconnect(); // 完成任务后断开连接
                        }
                    }
                });
            });
            // 配置观察者，观察整个文档的变动
            observer.observe(document, { childList: true, subtree: true });
        }
    }

    // ======================================入口======================================
    window.onload = function() {
        modifyPage();
    };



})();

