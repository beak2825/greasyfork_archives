// ==UserScript==
// @name         斗鱼自动房间等级签到 发弹幕 最高画质 不更新
// @version      1
// @author       jeayu
// @match        *://www.douyu.com/*
// @namespace    https://greasyfork.org/zh-CN/users/98859-jeayu
// @description  不更新
// @downloadURL https://update.greasyfork.org/scripts/390947/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%88%BF%E9%97%B4%E7%AD%89%E7%BA%A7%E7%AD%BE%E5%88%B0%20%E5%8F%91%E5%BC%B9%E5%B9%95%20%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%20%E4%B8%8D%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390947/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%88%BF%E9%97%B4%E7%AD%89%E7%BA%A7%E7%AD%BE%E5%88%B0%20%E5%8F%91%E5%BC%B9%E5%B9%95%20%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%20%E4%B8%8D%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const q = function (selector) {
        let nodes = [];
        if (typeof selector === 'string') {
            Object.assign(nodes, document.querySelectorAll(selector));
            nodes.selectorStr = selector;
        } else if (selector instanceof NodeList) {
            Object.assign(nodes, selector);
        } else if (selector instanceof Node) {
            nodes = [selector];
        }
        nodes.click = function (index = 0) {
            nodes.length > index && nodes[index].click();
            return this;
        }
        nodes.addClass = function (classes, index = 0) {
            nodes.length > index && nodes[index].classList.add(classes);
            return this;
        }
        nodes.removeClass = function (classes, index = 0) {
            nodes.length > index && nodes[index].classList.remove(classes);
            return this;
        }
        nodes.text = function (index = 0) {
            return nodes.length > index && nodes[index].textContent || '';
        }
        nodes.css = function (name, value, index = 0) {
            nodes.length > index && nodes[index].style.setProperty(name, value);
            return this;
        }
        nodes.getCss = function (name, index = 0) {
            return nodes.length > index && nodes[index].ownerDocument.defaultView.getComputedStyle(nodes[index], null).getPropertyValue(name);
        }
        nodes.mouseover = function (index = 0) {
            return this.trigger('mouseover', index);
        }
        nodes.mouseout = function (index = 0) {
            return this.trigger('mouseout', index);
        }
        nodes.attr = function (name, index = 0) {
            const result = nodes.length > index ? nodes[index].attributes[name] : undefined;
            return result && result.value;
        }
        nodes.hasClass = function (className, index = 0) {
            return nodes.length > index && nodes[index].className.match && (nodes[index].className.match(new RegExp(`(\\s|^)${className}(\\s|$)`)) != null);
        }
        nodes.append = function (text, where = 'beforeend', index = 0) {
            nodes.length > index && nodes[index].insertAdjacentHTML(where, text);
            return this;
        }
        nodes.find = function (name, index = 0) {
            return q(nodes[index].querySelectorAll(name));
        }
        nodes.toggleClass = function (className, flag, index = 0) {
            return flag ? this.addClass(className, index) : this.removeClass(className, index);
        }
        nodes.next = function (index = 0) {
            return nodes.length > index && nodes[index].nextElementSibling ? q(nodes[index].nextElementSibling) : [];
        }
        nodes.prev = function (index = 0) {
            return nodes.length > index && nodes[index].previousElementSibling ? q(nodes[index].previousElementSibling) : [];
        }
        nodes.trigger = function (event, index = 0) {
            if (nodes.length > index) {
                const evt = document.createEvent('Event');
                evt.initEvent(event, true, true);
                nodes[index].dispatchEvent(evt);
            }
            return this;
        }
        nodes.last = function () {
            return q(nodes[nodes.length - 1]);
        }
        nodes.on = function (event, fn, index = 0) {
            nodes.length > index && nodes[index].addEventListener(event, fn);
            return this;
        }
        nodes.select = function (index = 0) {
            nodes.length > index && nodes[index].select();
            return this;
        }
        nodes.blur = function (index = 0) {
            nodes.length > index && nodes[index].blur();
            return this;
        }
        nodes.val = function (value, index = 0) {
            if (value) {
                nodes[index].value = value;
                return this;
            }
            return nodes[index].value;
        }
        nodes.offset = function (index = 0) {
            if (nodes.length <= index) {
                return {top: 0, left: 0};
            }
            const rect = nodes[index].getBoundingClientRect();
            return {top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft}
        }
        nodes.parseFloat = function (css, index = 0) {
            return (parseFloat(this.getCss(css, index)) || 0);
        }
        nodes.after = function (node, index = 0) {
            nodes.length > index && node instanceof Node && nodes[index].parentNode.insertBefore(node, nodes[index]);
            return this;
        }
        return nodes;
    }
    let num = 1;
    const send = () => {
        console.log(num);
        if (q('.ChatSend-button').hasClass('is-gray')) {
            console.log('is-gray');
            return;
        }
        q('.ChatSend-txt').val(num++);
        q('.ChatSend-button').click();
        if ( num > 4 ) {
            num = 1;
            clearInterval(danmu);
        }
    };
    const high = () => {
        let t = q('#rateId');
        if (!t.length) {
            return;
        }
        t = t.next().next()[0].children[0];
        if (!t.className) {
            t.click();
        }
        console.log("最高画质" + t.textContent);
        clearInterval(highQuality);
    };
    let danmu;
    const highQuality  = setInterval(high, 1000);
    // 自动全屏
    //q('video').trigger('dblclick');
    //q('.layout-Player-asidetoggleButton').click();
    const observer = new MutationObserver((mutations, observer) => {
        mutations.forEach(mutation => {
            const target = q(mutation.target);
            if (target.text().indexOf('房间等级签到') > -1) {
                console.log('房间等级签到 弹幕');
                danmu = setInterval(send,1200);
                q('.RoomLevelDetail-level.RoomLevelDetail-level--no').click();
                observer.disconnect();
            }
        });
    }).observe(document.body, {
        childList: true,
        subtree: true,
    });
    console.log('房间等级签到启动');
    //unsafeWindow.q = q;
})();