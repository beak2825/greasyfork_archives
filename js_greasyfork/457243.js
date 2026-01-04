// ==UserScript==
// @name         删除b站已出奖的官方抽奖动态和所有非官方抽奖动态
// @namespace    http://tampermonkey.net/
// @namespace    https://greasyfork.org/zh-CN/scripts/457243
// @version      2.0
// @description  删除b站已出奖的官方抽奖动态&重复的官抽&所有非官方抽奖动态
// @author       whale-shark888
// @match        https://space.bilibili.com/*/dynamic
// @match        https://space.bilibili.com/*/dynamic?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457243/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%B7%B2%E5%87%BA%E5%A5%96%E7%9A%84%E5%AE%98%E6%96%B9%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E5%92%8C%E6%89%80%E6%9C%89%E9%9D%9E%E5%AE%98%E6%96%B9%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/457243/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%B7%B2%E5%87%BA%E5%A5%96%E7%9A%84%E5%AE%98%E6%96%B9%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E5%92%8C%E6%89%80%E6%9C%89%E9%9D%9E%E5%AE%98%E6%96%B9%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var dic = [];
    var i=0;
    console.log('start');

    function combin(v) {
        var exist = false
        var i=v;
        if (document.getElementsByClassName('bili-dyn-list-no-more').length==0) {
            let refresh = setInterval(function() {
                // 刷新页面内容
                window.scrollTo(0, document.documentElement.scrollHeight);
                combin(i)
                console.log('更新页面内容');
                clearInterval(refresh);
            }, 0);
        } else {
            setTimeout(function() {
                console.log('第'+i+'个动态');
                // 每一次循环都更新动态数量
                var num = document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item').length;
                // 如果动态刷新没到底，下标动态数量不等于0就执行
                if (document.getElementsByClassName('bili-dyn-list-no-more').length==0 || num-i!=0) {
                    // let element = document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i];
                    document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i].scrollIntoView();
                    // 如果这条动态是官方抽奖
                    try {
                        if (dic.includes(document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i].getElementsByClassName('bili-dyn-content__orig__desc')[0].getElementsByClassName('lottery')[0].getAttribute('data-oid'))) {
                            exist = true;
                        }
                    } catch (e) {
                        exist = true;
                    }
                    // exist包括了重复的官抽&非官抽&原动态被删除的互动
                    if (exist) {
                        document.querySelectorAll("[data-type='THREE_POINT_DELETE']")[i].click();
                        console.log('点击删除重复或其他动态------------------------');
                        let del = setInterval(function() {
                            document.getElementsByClassName('bili-modal__button confirm')[0].click();
                            console.log('删除完成');
                            if (document.getElementsByClassName('bili-modal__wrap')!=0) {
                                document.body.removeChild(document.getElementsByClassName('bili-modal__wrap')[0])
                            }
                            combin(i);
                            clearInterval(del);
                        }, 1000);
                    }
                    else if (document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i]!=undefined && document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i].getElementsByClassName('lottery').length!=0) {
                        console.log('打开互动抽奖弹窗');
                        // 点击打开官方互动抽奖弹窗

                        document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('lottery')[i].click();
                        console.log('抽奖详情打开？'+document.getElementsByClassName('bili-popup').length!=0);
                        setTimeout(function() {
                            const myDate = new Date();
                            const currentDate = myDate.getMinutes() + '分'+ myDate.getSeconds() + '秒' + myDate.getMilliseconds() + '豪秒';
                            // 每次循环打印当前时间
                            console.log(currentDate);
                            // 查看抽奖状态

                            try{
                                var judge = document.getElementsByClassName('bili-popup__content__browser')[0].contentDocument.getElementsByClassName('prize-winner-block has-prize').length!=0;
                                var count = document.getElementsByClassName('bili-popup__content__browser')[0].contentDocument.getElementsByClassName('title').length==0;
                                console.log(':judge='+judge);
                                // 关闭抽奖详情窗口
                                // document.getElementsByClassName('bili-popup__header__close')[0].click();
                                document.getElementsByClassName('bili-popup')[0].style.display='none';
                                document.body.removeChild(document.getElementsByClassName('bili-popup')[0])
                                console.log('关闭抽奖详情窗口');
                                // 如果judge为true，代表抽奖结果已经公布，要删除
                                if (judge) {
                                    // 执行删除 循环下一个
                                    document.querySelectorAll("[data-type='THREE_POINT_DELETE']")[i].click();
                                    let del = setInterval(function() {
                                        document.getElementsByClassName('bili-modal__button confirm')[0].click();
                                        console.log("删除:" + i);
                                        console.log('官方抽奖删除完成');
                                        if (document.getElementsByClassName('bili-modal__wrap')!=0) {
                                            document.body.removeChild(document.getElementsByClassName('bili-modal__wrap')[0])
                                        }
                                        combin(i);
                                        clearInterval(del);
                                    }, 1000);
                                } else if (!judge && count) {
                                    // 避免出现错误或者轻微网络问题暂停
                                    combin(i);
                                } else {
                                    // 不要删除 循环下一个
                                    var oid = document.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i].getElementsByClassName('bili-dyn-content__orig__desc')[0].getElementsByClassName('lottery')[0].getAttribute('data-oid')
                                    dic.push(oid);
                                    console.log(dic)
                                    combin(i+1);
                                }
                            } catch (e) {
                                // document.getElementsByClassName('bili-popup__header__close')[0].click();
                                document.getElementsByClassName('bili-popup')[0].style.display='none';
                                document.body.removeChild(document.getElementsByClassName('bili-popup')[0]);
                                combin(i);
                            }
                        }, 2000);
                    } else {
                        // 不是官方抽奖就是非官方抽奖
                        // 一律删除非官方抽奖动态
                        document.querySelectorAll("[data-type='THREE_POINT_DELETE']")[i].click();
                        console.log('点击删除非官方------------------------');
                        let del = setInterval(function() {
                            document.getElementsByClassName('bili-modal__button confirm')[0].click();
                            console.log('已经确定删除按钮');
                            console.log('非官方抽奖删除完成');
                            if (document.getElementsByClassName('bili-modal__wrap')!=0) {
                                document.body.removeChild(document.getElementsByClassName('bili-modal__wrap')[0])
                            }
                            combin(i);
                            clearInterval(del);
                        }, 1000);
                    }
                }
            }, 3000);
        }}
    window.onload = function() {
        var btn = document.createElement('button');
        btn.innerHTML = '删除动态';
        btn.style.position = 'absolute';
        btn.style.top = '65px';
        btn.style.right = '0';
        btn.style.background = '#f25d8e';
        btn.style.color = 'white';
        btn.style.border = '#f25d8e';
        btn.style.width = '1%';
        btn.style.height = '100px';
        btn.style.borderRadius = '3px';
        btn.style.zIndex = '1003';
        btn.onmousemove = function() {
            console.log('show');
            btn.style.width = '7%';
            btn.style.height = '150px';
        };
        btn.onmouseout = function() {
            console.log('hide');
            btn.style.width = '1%';
            btn.style.height = '100px';
        };
        document.body.append(btn);
        btn.onclick = function(){
            combin(i);
        };
    };
})();