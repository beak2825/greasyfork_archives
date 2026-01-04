// ==UserScript==
// @name         视频号小店
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  视频号小店脚本
// @author       许大包
// @match        https://store.weixin.qq.com/shop/goods/list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @require      https://update.greasyfork.org/scripts/500012/1407355/jquery20.js
// @downloadURL https://update.greasyfork.org/scripts/531114/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%B0%8F%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/531114/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%B0%8F%E5%BA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let rootDom
    let mouseover = new Event('mouseover', { bubbles: true })
    let mouseout = new Event('mouseout', { bubbles: true })
    let Doms = {
        bianma: '.ignore_default_input:eq(1)', //商品编码文本框
        shaixuanbtn: '.weui-desktop-btn_default', // 筛选按钮
        updateprice: '.handle_icon', //修改价格按钮
        updatepriceinput: '.half-dialog .ignore_default_input', //批量修改价格文本框
        piliangbtn: '.half-dialog .input_btn .weui-desktop-btn_default:eq(1)', //批量修改按钮
        quedingbtn: '.footer .weui-desktop-btn_primary:eq(2)', //确定按钮
        quedingbtn2: '.weui-desktop-popover__desc .weui-desktop-btn_primary:eq(1)', // 确定修改按钮
        tuiguangurl: '.whitespace-nowrap:contains("推广链接")', // 推广链接按钮
        copyurl: '.whitespace-nowrap.cursor-pointer', // 复制链接按钮
    }
    function waitForElement(selector, callback) {
        if (selector) {
            callback();
        } else {
            const observer = new MutationObserver(() => {
                if (selector) {
                    observer.disconnect();
                    callback();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    waitForElement($('micro-app')[0], () => {
        rootDom = document.querySelector('micro-app').shadowRoot
        setTimeout(() => {
            $(rootDom).find(Doms.bianma)[0].addEventListener('keydown',function(e) {
                if(e.keyCode == 13) {
                    setVueInputValue($(rootDom).find(Doms.bianma)[0],$(rootDom).find(Doms.bianma)[0].value.toUpperCase())
                    $(rootDom).find(Doms.shaixuanbtn)[0].click()
                }
            })
        },1000)
    });
    /**
 * 显示Toast提示
 * @param {string} text - 提示文字
 * @param {number} [time=2000] - 显示时长（毫秒）
 * @param {string} [id='toast'] - 元素ID（用于防止重复提示）
 */
    function toast(text, time = 2000, id = 'toast') {
        // 移除已存在的相同提示
        const existingToast = document.getElementById(id);
        if (existingToast) {
            existingToast.remove();
        }

        // 创建容器
        const toast = document.createElement('div');
        const htmlElement = document.documentElement;

        // 样式配置（推荐使用CSS类）
        Object.assign(toast.style, {
            position: 'fixed',
            left: '10px',
            top: id === 'toast' ? '20%' : '40%', // 根据ID调整位置
            padding: '6px 10px',
            borderRadius: '8px',
            opacity: '0',
            color: '#fff',
            lineHeight: '30px',
            background: 'rgba(169,187,267, 0.9)', // 修正了颜色值
            zIndex: '9999', // 合理化的层级值
            transition: 'opacity 0.3s ease-in-out' // 改用CSS过渡动画
        });

        // 设置元素属性
        toast.id = id;
        toast.innerText = text;
        htmlElement.appendChild(toast);

        // 使用requestAnimationFrame优化动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // 自动关闭定时器
        setTimeout(() => {
            toast.style.opacity = '0';
            // 等待渐出动画完成后再移除元素
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, time);
    }

    function setVueInputValue(element, value) {
        const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setValue.call(element, value);

        const event = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        event._isVue = true; // 标记为 Vue 内部事件
        element.dispatchEvent(event);
    }

    function UpdatePriceFn() {
        $(rootDom).find(Doms.updateprice)[0].click()
        setTimeout(() => {
            $(rootDom).find(Doms.updatepriceinput)[0].focus()
            $(rootDom).find(Doms.updatepriceinput)[0].addEventListener('keydown', function(e) {
                if(e.keyCode == 13) {
                    $(rootDom).find(Doms.piliangbtn)[0].click()
                    if($(rootDom).find(Doms.quedingbtn2)[0]) {
                        $(rootDom).find(Doms.quedingbtn2)[0].click()
                    }else {
                        $(rootDom).find(Doms.quedingbtn)[0].click()
                    }
                }
            })
        },300)
    }
    window.addEventListener('keydown', function (e){
        if(e.altKey && e.keyCode == 81 ) {
            // alt + Q
            UpdatePriceFn()
        }else if(e.keyCode == 27) {
            $(rootDom).find(Doms.bianma).focus()
            $(rootDom).find(Doms.bianma).select()
        }else if(e.keyCode == 67) {
            const event = new Event('mouseover', {
                bubbles: true,
                cancelable: true
            });
            event._isVue = true; // 标记为 Vue 内部事件
            $(rootDom).find(Doms.tuiguangurl)[0].dispatchEvent(event);
            $(rootDom).find(Doms.tuiguangurl)[0].dispatchEvent(mouseover)
            console.log($(rootDom).find(Doms.tuiguangurl).parents('.cursor-pointer'))
            $(rootDom).find(Doms.tuiguangurl).parents('.cursor-pointer').trigger("mouseenter")
            $(rootDom).find(Doms.copyurl)[0].click()
        }
    })
    // Your code here...
})();