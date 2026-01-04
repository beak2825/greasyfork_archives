// ==UserScript==
// 脚本名称
// @name         demo open talk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  课件. 又拍云 open talk 公开课 油猴脚本 —— 只为更好的交互体验
// @author       You
// 在哪些页面生效, 支持通配符
// @match        https://www.zhihu.com/question/*
// GM_addStyle 油猴内置的 api, `@grant GM_addStyle` 的作用相当于 import, 这样就可以在当前页面调用 GM_addStyle 这个接口了. GM_addStyle 这个可以用来添加样式.
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400791/demo%20open%20talk.user.js
// @updateURL https://update.greasyfork.org/scripts/400791/demo%20open%20talk.meta.js
// ==/UserScript==

// 隐藏右边栏. display: none 是要隐藏选中的节点
// 因为 CSS 中可能会存在多个样式渲染到同一个节点上, 为了达到我们想要的效果, 这些样式有一个优先级,
// 使用 `!important` 就表明我们当前的样式优先级比较高
GM_addStyle('.Question-sideColumn {display: none !important}');
// 加宽内容栏
// with 表示盒子的宽度,
GM_addStyle('.Question-mainColumn {width: 1000px !important}');

(function() {
    'use strict';

    // Your code here...
    // 创建元素
    function createEle(eleName, text, attrs){
        let ele = document.createElement(eleName);
        // innerText 也就是 <p>text会被添加到这里</p>
        ele.innerText = text;
        // attrs 的类型是一个 map
        for (let k in attrs) {
            // 遍历 attrs, 给节点 ele 添加我们想要的属性
           ele.setAttribute(k, attrs[k]);
        }
        // 返回节点
        return ele;
    }

    // 复制到剪贴板
    function updateClipboard(newClip) {
        // 把内容复制到剪贴板. then 是代表回调的意思
        navigator.clipboard.writeText(newClip).then(function() {
            // 一切都没问题的话会执行 alert 操作
        alert('succeed copy');
        }, function(err) {
            // 失败时执行的函数
            /* clipboard write failed */
            console.info('failed copy', err);
            alert('faild copy')
        });
    }

    const added = [];
    // btnStyle 是一个我事先写好的样式.
    // 因为写样式调试的时间比较久,我就不一一向大家演示了.
    const btnStyle = 'background-color: #0084ff; margin-top: 15px; margin-bottom: 15px; margin-left:-5px; cursor:pointer; color: #fff; border-radius: 3px; border: 1px solid; padding: 3px 6px';


    // 加转载按钮
    function addBtn() {
        //  获取回答列表
        // querySelectorAll 这个 api 可以获取一组 api 节点
        const all = document.querySelectorAll('div[class="List-item"]');
        for (let item of all) {
            // 定位到每个节点的 meta 节点
            const meta = item.querySelector('div[class="ContentItem-meta"]');
            // 因为知乎规则, 每个人只允许回答一次, 所以我们可以使用 who 作为每个答案的 id;
            // todo: 这个地方是有 bug 的, 因为知乎规则中是允许匿名回答的, 匿名的时候会导致当前节点的节点为空, 导致重复添加
            // 解决办法是, 多从 meta 中获取几个属性, 拼接成一个独一无二的 id, 这里为了演示, 简单起见, 暂不考虑这种情况.
            const who = meta.querySelector('meta[itemprop="url"]').getAttribute('content').split('/').pop();
            // added 是一个全局变量, 用来保存已经添加过按钮的节点.
            // 这步的作用是, 已经添加按钮节点不重复添加
            if (added.indexOf(who) > -1) {
                continue;
            }
            // createEle 是我封住的一个工具函数, 可以生成一个节点.
            const btn = createEle('button', '转载按钮', {style: btnStyle});
            // text 是我们选中的文本.
            const text = item.querySelector('div[class="RichContent-inner"]').innerText;
            // 给 btn 节点添加一个鼠标点击事件
            // 当 btn 节点接听到鼠标事件后, 会触发后面的方法
            // ()=>{}, 这种是箭头函数, 是 ES6 的语法.
            btn.addEventListener('click', ()=>{updateClipboard(text)});
            // 把创建好的 btn 节点添加到 meta 后面.
            meta.append(btn);
            // 添加了 btn后的推到 added 列表, 不再重复添加.
            added.push(who);
        }
    }

    // 给 window 对象添加一个滚动事件, 当滚动时触发就执行对应的操作.
    window.addEventListener('scroll', addBtn);

})();