// ==UserScript==
// @name         github、码云 md文件目录化
// @name:en      Github, code cloud md file directory
// @namespace    github、码云 md文件目录化
// @version      1.14
// @description  github、码云、npmjs项目README.md增加目录侧栏导航，悬浮按钮
// @description:en  Github,code cloud project README.md add directory sidebar navigation,Floating button
// @author       lecoler
// @supportURL   https://github.com/lecoler/md-list
// @icon         https://raw.githubusercontent.com/lecoler/readme.md-list/master/static/icon.png
// @match        *://gitee.com/*/*
// @match        *://www.gitee.com/*/*
// @match        *://github.com/*/*
// @match        *://www.github.com/*/*
// @match        *://npmjs.com/*/*
// @match        *://www.npmjs.com/*/*
// @include      *.md
// @note         2022.03.18-v1.14 降低悬浮球位置，修改样式
// @note         2021.01.09-v1.13 修复高亮bug
// @note         2021.01.09-v1.12 新增根据页面阅读进度高亮
// @note         2020.11.10-v1.11 修复标题显示标签化问题
// @note         2020.10.30-v1.10 Fix not find node
// @note         2020.09.15-V1.9  优化，移除计时器，改成用户触发加载检测，同时为检测失败添加‘移除目录’按钮（测试版）
// @note         2020.09.14-V1.8  新增支持全部网站 *.md（测试版）
// @note         2020.07.14-V1.7  新增当前页面有能解析的md才展示
// @note         2020.06.23-V1.6  css样式进行兼容处理
// @note         2020.05.22-V1.5  新增支持github wiki 页
// @note         2020.05.20-V1.4  拖动按钮坐标改用百分比，对窗口大小改变做相应适配
// @note         2020.02.10-V1.3  修改样式,整个按钮可点;新增支持 npmjs.com
// @note         2019.12.04-V1.2  新增容错
// @note         2019.10.31-V1.1  修改样式，新增鼠标右键返回顶部
// @note         2019.10.28-V1.0  优化逻辑，追加判断目录内容是否存在
// @note         2019.10.25-V0.9  重构项目，移除jq，改用原生开发，新增悬浮按钮
// @note         2019.10.14-V0.9  修复bug
// @note         2019.9.18-V0.8  修改样式,新增可手动拉伸
// @note         2019.9.11-V0.7  新增点击跳转前判断是否能跳,不能将回到主页执行跳转
// @note         2019.8.11-V0.6  优化代码，修改样式
// @note         2019.7.25-V0.5  美化界面
// @note         2019.7.25-V0.4  新增支持github
// @note         2019.7.25-V0.2 修复bug，优化运行速度，新增按序获取
// @home-url     https://greasyfork.org/zh-CN/scripts/387834
// @homepageURL  https://github.com/lecoler/md-list
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/387834/github%E3%80%81%E7%A0%81%E4%BA%91%20md%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/387834/github%E3%80%81%E7%A0%81%E4%BA%91%20md%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 初始化
    let reload = false; // 是否需重载
    let $main = null;
    let $menu = null;
    let $button = null;
    let lastPathName = '';
    let moveStatus = false;
    let titleHeight = 0;

    // 初始化按钮
    function createDom() {
        // 往页面插入样式表
        style();
        // 创建主容器
        $main = document.createElement('div');
        // 创建按钮
        $button = document.createElement('div');
        // 创建菜单
        $menu = document.createElement('ul');
        // 按钮设置
        $button.innerHTML = `目录`;
        $button.title = '右键返回顶部(RM to Top)';
        // 添加点击事件
        $button.addEventListener('click', btnClick);
        // 添加右键点击事件
        $button.oncontextmenu = e => {
            // 回到顶部
            scrollTo(0, 0);
            return false;
        };
        // 往主容器添加dom
        $main.appendChild($button);
        $main.appendChild($menu);
        // 主容器设置样式
        $main.setAttribute('class', 'le-md');
        // 为按钮添加拖动
        dragEle($button);
        // 往页面添加主容器
        document.body.appendChild($main);
        // 监听窗口大小
        window.onresize = function () {
            // 隐藏列表
            if (!$menu.className.match(/hidden/)) {
                $menu.className += ' hidden';
            }
        };
    }

    // 按钮点击事件
    function btnClick(e) {
        //判断是否在移动
        if (moveStatus) {
            moveStatus = false;
            return false;
        }
        if ($menu.className.match(/hidden/)) {
            // 判断路径是否改变，menu是否重载
            if (lastPathName !== window.location.pathname || reload) {
                start(true);
            }
            // 判断menu位置
            const winWidth = document.documentElement.clientWidth;
            const winHeight = document.documentElement.clientHeight;
            const x = e.clientX;
            const y = e.clientY;
            const classname1 = winWidth / 2 - x > 0 ? 'le-md-right' : 'le-md-left';
            const classname2 = winHeight / 2 - y > 0 ? 'le-md-bottom' : 'le-md-top';
            $menu.className = `${classname1} ${classname2}`;
        } else {
            $menu.className += ' hidden';
        }
    }

    // 插入样式表
    function style() {
        const style = document.createElement('style');
        style.innerHTML = `
       .le-md {
            position: fixed;
            top: 16%;
            left: 90%;
            z-index: 999;
        }
        .le-md-btn {
            display: block;
            font-size: 14px;
            text-transform: uppercase;
            width: 60px;
            height: 60px;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            border-radius: 50%;
            color: #fff;
            text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.8);
            border: 0;
            background: hsla(230, 50%, 50%, 0.6);
            -webkit-animation: pulse 1s infinite alternate;
                    animation: pulse 1s infinite alternate;
            -webkit-transition: background 0.4s, margin 0.2s;
            -o-transition: background 0.4s, margin 0.2s;
            transition: background 0.4s, margin 0.2s;
            text-align: center;
            line-height: 60px;
            -webkit-user-select: none;
               -moz-user-select: none;
                -ms-user-select: none;
                    user-select: none;
            cursor: move;
        }
        .le-md-btn:after {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 50%;
            bottom: -22.5px;
            content: "";
            display: block;
            height: 0;
            margin: 0 auto;
            left: 0;
            position: absolute;
            right: 0;
            width: 40px;
            -webkit-transition: height 0.5s ease-in-out, width 0.5s ease-in-out;
            -o-transition: height 0.5s ease-in-out, width 0.5s ease-in-out;
            transition: height 0.5s ease-in-out, width 0.5s ease-in-out;
            -webkit-animation: shadow 1s infinite alternate;
                    animation: shadow 1s infinite alternate;
        }
        .le-md-btn:hover {
            background: hsla(220, 50%, 47%, 1);
            margin-top: -1px;
            -webkit-animation: none;
                    animation: none;
            -webkit-box-shadow: inset -5px -10px 1px hsla(220, 50%, 42%, 1);
                    box-shadow: inset -5px -10px 1px hsla(220, 50%, 42%, 1);
        }
        .le-md-btn:hover:after {
            -webkit-animation: none;
                    animation: none;
            height: 10px;
        }
        .le-md-btn-hidden{
            display: none;
             -webkit-animation: none;
                     animation: none;
        }
        .hidden {
            height: 0 !important;
            min-height: 0 !important;
            border: 0 !important;
        }
        .le-md-left {
            right: 0;
            margin-right: 100px;
        }
        .le-md-right {
            left: 0;
            margin-left: 100px;
        }
        .le-md-top {
            bottom: 0;
        }
        .le-md-bottom {
            top: 0;
        }
        .le-md > ul {
            width: 200px;
            min-width: 100px;
            max-width: 1000px;
            list-style: none;
            position: absolute;
            overflow: auto;
            -webkit-transition: min-height 0.4s;
            -o-transition: min-height 0.4s;
            transition: min-height 0.4s;
            min-height: 50px;
            height: auto;
            max-height: 700px;
            resize: both;
            padding-right: 10px;
        }
        .le-md > ul::-webkit-scrollbar {
            width: 8px;
            height: 1px;
        }
        .le-md > ul::-webkit-scrollbar-thumb {
            border-radius: 8px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background-color: #96C2F1;
            background-image: linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.2) 25%,
                transparent 25%,
                transparent 50%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(255, 255, 255, 0.2) 75%,
                transparent 75%,
                transparent
            );
        }
        .le-md > ul::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
                    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
            border-radius: 8px 8px 0 0;
            background: #EFF7FF;
        }
        .le-md > ul a:hover {
            background: #fff;
            border-left: 1em groove #0099CC !important;
        }
        .le-md > ul a {
            text-decoration: none;
            font-size: 1em;
            color: #909399;
            text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
            display: block;
            white-space: nowrap;
            -o-text-overflow: ellipsis;
               text-overflow: ellipsis;
            overflow: hidden;
            padding: 5px 10px;
            border-bottom: 0.5em solid #eee;
            -webkit-transition: 0.4s all;
            -o-transition: 0.4s all;
            transition: 0.4s all;
            border-left: 0.5em groove #e2e2e2;
            border-right: 1px solid #e2e2e2;
            border-top: 1px solid #e2e2e2;
            background: #f4f4f5;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
            border-radius: 0 0 5px 5px;
        }
        @-webkit-keyframes pulse {
            0% {
                margin-top: 0;
            }
            100% {
                margin-top: 6px;
                -webkit-box-shadow: inset -5px -10px 1px hsla(230, 50%, 55%, 0.6), 0 0 25px hsla(230, 50%, 50%, 1);
                        box-shadow: inset -5px -10px 1px hsla(230, 50%, 55%, 0.6), 0 0 25px hsla(230, 50%, 50%, 1);
            }
        }
        @keyframes pulse {
            0% {
                margin-top: 0;
            }
            100% {
                margin-top: 6px;
                -webkit-box-shadow: inset -5px -10px 1px hsla(230, 50%, 55%, 0.6), 0 0 25px hsla(230, 50%, 50%, 1);
                        box-shadow: inset -5px -10px 1px hsla(230, 50%, 55%, 0.6), 0 0 25px hsla(230, 50%, 50%, 1);
            }
        }
        @-webkit-keyframes shadow {
            to {
                height: 16px;
            }
        }
        @keyframes shadow {
            to {
                height: 16px;
            }
        }
        .le-md li.le-md-title-active a{
            background: linear-gradient(-135deg, #ffcccc 0.6em, #fff 0);
        }
        .le-md li.le-md-title-active.le-md-title-active-first a{
            background: linear-gradient(-135deg, #ff9999 0.6em, #fff 0);
            color: #000;
            font-weight: 700;
        }
        `;
        document.head.appendChild(style);
    }

    // 拖动事件
    function dragEle(ele) {
        ele.onmousedown = event => {
            // 鼠标相对dom坐标
            let eleX = event.offsetX;
            let eleY = event.offsetY;
            let count = 0;
            window.document.onmousemove = e => {
                //防止误触移动
                if (count > 9) {
                    moveStatus = true;
                }
                // dom相对win坐标
                let winX = e.clientX;
                let winY = e.clientY;
                // 实际坐标
                let x = winX - eleX;
                let y = winY - eleY;
                // win长宽
                let winWidth = document.documentElement.clientWidth;
                let winHeight = document.documentElement.clientHeight;
                // 转化成百分比
                ele.parentNode.style.left = (x / winWidth).toFixed(3) * 100 + '%';
                ele.parentNode.style.top = (y / winHeight).toFixed(3) * 100 + '%';
                count++;
            };
        };
        ele.onmouseup = () => {
            window.document.onmousemove = null;
        };
        ele.onmouseout = () => {
            window.document.onmousemove = null;
        };
    }

    // 执行, flag 是否部分重载
    function start(flag) {
        // 初始化
        reload = false;
        // 获取链接
        const host = window.location.host;
        lastPathName = window.location.pathname;

        // 获取相应的容器dom
        let $content = null;
        let list = [];
        if (host === 'github.com') {
            //github home / wiki
            const $parent = document.getElementById('readme') || document.getElementById('wiki-body');
            $content = $parent && $parent.getElementsByClassName('markdown-body')[0];
            // 标题dom高度
            const $boxTitle = ($parent && $parent.parentElement) ? $parent.parentElement.getElementsByClassName('js-sticky')[0] : null;
            titleHeight = $boxTitle ? $boxTitle.offsetHeight + 2 : 0;
            // 监听github dom的变化
            // !$menu && domChangeListener(document.getElementById('js-repo-pjax-container'), start);
            !$menu && window.addEventListener('pjax:complete', start);
        } else if (host === 'gitee.com') {
            //码云 home
            const $parent = document.getElementById('tree-content-holder');
            $content = $parent && $parent.getElementsByClassName('markdown-body')[0];
            // 监听gitee dom的变化
            !$menu && domChangeListener(document.getElementById('tree-holder'), start);
        } else if (host === 'www.npmjs.com') {
            // npmjs.com
            const $parent = document.getElementById('readme');
            $content = $parent ? $parent : null;
        } else {
            // 检测是否符合md格式
            $content = checkMd();
        }
        // 获取子级
        const $children = $content ? $content.children : [];
        for (let $dom of $children) {
            const tagName = $dom.tagName;
            const lastCharAt = +tagName.charAt(tagName.length - 1);
            // 获取Tag h0-h9
            if (tagName.length === 2 && tagName.startsWith('H') && !isNaN(lastCharAt)) {
                // 获取value
                const value = $dom.innerText.trim();
                // 新增容错率
                const $a = $dom.getElementsByTagName('a')[0];
                if ($a) {
                    // 获取锚点
                    const href = $a.getAttribute('href');
                    // 获取offsetTop
                    const offsetTop = getTop($a)
                    list.push({
                        type: lastCharAt,
                        value,
                        href,
                        offsetTop
                    });
                }
            }
        }
        // 清空容器，不存在则创建
        if ($menu) {
            const list = [...$menu.childNodes];
            list.forEach(i => $menu.removeChild(i));
        } else {
            createDom();
        }
        if (!$menu || !$button) {
            console.warn('md文件目录化 脚本初始化失败');
            return false;
        }
        // 隐藏菜单
        if (!flag) {
            $menu.className = 'hidden';
        }
        //是否存在
        if (list.length) {
            // 生成菜单
            for (let i of list) {
                const li = document.createElement('li');
                li.setAttribute('data-offsetTop', i.offsetTop)
                const a = document.createElement('a');
                a.href = i.href;
                a.title = i.value;
                a.style = `font-size: ${1.3 - i.type * 0.1}em;margin-left: ${i.type - 1}em;border-left: 0.5em groove hsla(200, 80%, ${45 + i.type * 10}%, 0.8);`;
                a.innerText = i.value;
                li.appendChild(a);
                $menu.appendChild(li);
                // 是否不符合规范
                if (!i.value) {
                    reload = true;
                }
            }
            // 提供关闭入口
            if (reload) {
                const li = document.createElement('li');
                li.innerHTML = `<a title="移除目录" style="font-size: 1.1em;margin-left: 0.1em;border-left: 0.5em groove hsla(0,80%,50%,0.8);">移除目录</a>`;
                // 添加事件
                li.onclick = function () {
                    $main.remove();
                };
                $menu.appendChild(li);
            }
            // 设置按钮样式
            $button.setAttribute('class', 'le-md-btn');
        } else {
            // 设置按钮样式
            $button.setAttribute('class', 'le-md-btn le-md-btn-hidden');
        }
    }

    /**
     * @Description 监听指定dom发现变化事件
     * @author lecoler
     * @date 2020/7/14
     * @param dom
     * @param fun 回调 (MutationRecord[],MutationObserver)
     * @param opt 额外参数
     * @return MutationObserver
     */
    function domChangeListener(dom, fun, opt = {}) {
        if (!dom) return null;
        const observe = new MutationObserver(fun);
        observe.observe(dom, Object.assign({
            childList: true,
            attributes: true,
        }, opt));
        return observe;
    }

    /**
     * @Description 判断是否符合格式的md
     * @author lecoler
     * @date 2020/9/14
     * @return DOM
     */
    function checkMd() {
        // 缓存
        let tmp = [];
        // 是否存在h1 h2 h3 h4 h5 ...标签,同时他们父级相同
        for (let i = 1; i < 7; i++) {
            let list = document.body.getElementsByTagName(`h${i}`);
            // 获取父级
            for (let i = 0; i < list.length; i++) {
                const parent = list[i].parentElement;
                const item = tmp.filter(j => j && j['ele'].isEqualNode(parent))[0];
                if (item) {
                    item.count += 1;
                } else {
                    tmp.push({
                        ele: parent,
                        count: 1,
                    });
                }
            }
        }
        // 排序
        tmp.sort((a, b) => b.count - a.count);
        // 获取出现次数最高父级 返回
        return tmp.length ? tmp[0]['ele'] : null;
    }

    // 监听Windows滚动事件
    function onScrollEvent() {
        const fun = debounce(updateTitleActive, 500)
        // 判断原页面是否存在滚动事件监听，存在则合并，否则新建
        const oldFun = window.onscroll
        // 存在
        if (oldFun && oldFun.constructor === Function) {
            window.onscroll = function () {
                // 触发原页面事件
                oldFun.call(this)
                // 刷新标题 active 状态
                fun()
            }
        } else {
            window.onscroll = function () {
                // 刷新标题 active 状态
                fun()
            }
        }
    }

    /**
     * @Description 防抖动
     * @author lecoler
     * @date 2020/7/1
     * @param func<Function>
     * @param time<number>
     * @return Function
     */
    function debounce(func, time) {
        let context, args, timeId, timestamp

        function timeout() {
            const now = Date.now() - timestamp
            if (now >= 0 && now < time) {
                timeId = setTimeout(timeout, time - now)
            } else {
                timeId = null
                func.apply(context, args)
            }
        }

        function action() {
            context = this
            args = arguments
            timestamp = Date.now()
            if (!timeId) timeId = setTimeout(timeout, time)
        }

        return action
    }

    // 更新标题active状态
    function updateTitleActive() {
        // 获取目前页面scrollTop
        const ScrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
        const scrollTop = ScrollTop + titleHeight
        const offsetHeight = document.documentElement.clientHeight || document.body.clientHeight || 0
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0
        // 存在菜单
        if ($menu) {
            const list = $menu.children || []

            for (let i = 0; i < list.length; i++) {
                const val = list[i].getAttribute('data-offsetTop')
                const nextVal = list[i + 1] ? list[i + 1].getAttribute('data-offsetTop') : scrollHeight
                // 排他
                list[i].removeAttribute('class')

                // 肉眼可见部分，标题高亮
                if (scrollTop <= val && val <= offsetHeight + scrollTop) {
                    list[i].className = 'le-md-title-active'
                }
                // 正在阅读部分，标题高亮
                if (scrollTop >= val && nextVal > scrollTop) {
                    list[i].className = 'le-md-title-active le-md-title-active-first'
                }
            }
        }
    }

    /**
     * @describe 获取dom元素距离body的offsetTop
     * @author lecoler
     * @date 21-1-8
     * @param $dom<Node>
     * @return Number
     */
    function getTop($dom, val = 0) {
        if (!$dom) return val
        const offsetTop = $dom.offsetTop || 0
        return getTop($dom.offsetParent, offsetTop + val)
    }

    try {
        document.onreadystatechange = function () {
            if (document.readyState === 'complete') {
                start();
                // 监听滚动
                onScrollEvent()
            }
        };
    } catch (e) {
        console.error('github、码云 md文件目录化 脚本异常报错：');
        console.error(e);
        console.error('请联系作者修复解决，https://github.com/lecoler/md-list');
    }
})();
