// ==UserScript==
// @name         雪阅模式|SNOREAD
// @namespace    https://userscript.snomiao.com/
// @version      1.4.2
// @description  (20200725)【雪阅模式|SNOREAD】像读报纸一样纵览这个世界吧！豪华广角宽屏视角 / 刷知乎神器 / 2D排版 / 快速提升视觉维度 / 横向滚动阅读模式 / 翻页模式 / 充分利用屏幕空间 / 快阅速读插件 / 雪阅模式  / 宽屏必备 / 带鱼屏专属 | 使用说明：按 Escape 退出雪阅模式 | 【欢迎加入QQ群交流 1043957595 或 官方TG群组 https://t.me/snoread 】
// @author       snomiao@gmail.com
// @match        https://www.zhihu.com/*
// @match        http://*/*
// @match        https://*/*
// @exclude      https://*.taobao.com/*
// @exclude      https://*.1688.com/*
// @exclude      https://*.tmall.com/*
// @supportURL   https://github.com/snomiao/SNOREAD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392213/%E9%9B%AA%E9%98%85%E6%A8%A1%E5%BC%8F%7CSNOREAD.user.js
// @updateURL https://update.greasyfork.org/scripts/392213/%E9%9B%AA%E9%98%85%E6%A8%A1%E5%BC%8F%7CSNOREAD.meta.js
// ==/UserScript==
//
// 更新记录：
// (20200726)修复scroll into view 在firefox上的兼容问题
// (20200717)排除tbody
// (20200714)优化节流防抖、后台性能、滚动性能等
// (20200713)升级UI，提升知乎页面兼容性
// (20200430)修复文字溢出问题
// (20200428)更新文案
// (20200413)调整横向滚动速率
// (20200413)减少背景透明度，降低干扰
// (20200413)增加调试选项，删除不必要代码
//
// 测试页面
/*
https://www.zhihu.com/  
https://www.zhihu.com/hot

观察新回答加载后能否自动适应SNOREAD：
https://www.zhihu.com/question/35829677

观察
https://www.jd.com/
*/

// TODO
// 尝试清除挡物
// javascript:[...document.querySelectorAll("*")].filter(e=>e).filter(e=>window.getComputedStyle(e).getPropertyValue("z-index")>1).

// 横向滚动
(function () {
    'use strict';
    const 滚动监听 = e => {
        // 排除几种不太可能发生滚动的无素提高性能
        if (e.tagName in ['A', 'P', 'TD', 'TR']) return;
        [...e.children].map(滚动监听)
        if (e.标记_已监听横向滚动) return;
        e.标记_已监听横向滚动 = true;

        const 滚动处理 = (事件) => {
            if (事件.altKey || 事件.ctrlKey || 事件.shiftKey) return;
            const scrollRate = (事件.detail || -事件.wheelDelta) / 120 //Y轴
            const dx = scrollRate * e.clientWidth * 0.3
            const scrolled_x = (e.scrollLeft != (e.scrollLeft += dx, e.scrollLeft))
            if (scrolled_x) {
                // 若需定位则撤销滚动
                (e.scrollIntoViewIfNeeded || e.scrollIntoView).call(e);
                const 当前Y = e.getBoundingClientRect().y;
                if (e.getBoundingClientRect().y != 当前Y)
                    e.scrollLeft -= dx;
                //
                事件.preventDefault();
                事件.stopPropagation();
                return false;
            }
            const dy = scrollRate * e.clientHeight * 0.5
            const scrolled_y = (e.scrollTop != (e.scrollTop += dy, e.scrollTop))
            if (scrolled_y) {
                (e.scrollIntoViewIfNeeded || e.scrollIntoView).call(e);
                const 当前X = e.getBoundingClientRect().x;
                if (e.getBoundingClientRect().x != 当前X)
                    e.scrollTop -= dy;
                //
                事件.preventDefault();
                事件.stopPropagation();
                return false;
            }
            // 横竖都滚到底了
            [...e.children].map(滚动监听)
        }
        e.addEventListener("mousewheel", 滚动处理, { capture: false, passive: false }) // Chrome/Edge
        e.addEventListener("DOMMouseScroll", 滚动处理, { capture: false, passive: false }) // FF
    }
    const 开始 = () => 滚动监听(document.body)
    document.addEventListener("DOMContentLoaded", 开始)
    window.addEventListener("load", 开始)
    开始()
})();


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

(function () {
    'use strict';
    'esversion: 6';
    let 用户意向_雪阅模式 = true;
    let DEBUG_SNOREAD = false;

    const 新元素 = (HTML, 属性 = {}) => {
        const e = document.createElement("div");
        e.innerHTML = HTML;
        return Object.assign(e.children[0], 属性)
    }
    const 睡 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const 取窗口高 = () => document.body.parentElement.clientHeight;
    const 取窗口宽 = () => document.body.parentElement.clientWidth;

    const 更新样式 = () => {
        const 窗口高 = 取窗口高(), 窗口宽 = 取窗口宽()
        var 样式盒 = document.querySelector("div.snomiao-article-style")
        if (!样式盒) {
            样式盒 = document.createElement("div");
            样式盒.classList.add("snomiao-article-style");
            样式盒.style.display = "none";
            document.body.appendChild(样式盒)
        }
        // 规避 iframe 的 innerHeight 超长问题
        样式盒.innerHTML = `
<style>

div#main-wrapper:after, .clearfix:after {
    display:block;
    content:"clear";
    clear:both;
    line-height:0;
    visibility:hidden;
}

.snomiao-article::-webkit-scrollbar { width: 0 !important }
.snomiao-article{ -ms-overflow-style: none; }
.snomiao-article{ overflow: -moz-scrollbars-none; }
.snomiao-article:before{
    content: "雪阅 | SNOREAD";
    background: rgba(0,0,0,0.1);
    color: rgba(0,0,0,0.5);
    position: absolute;
    padding: 0.5rem 1.5rem;
    left: 3px;
    top: 3px;
    text-align: center;
}
.snomiao-article{
    position: relative  !important;
    /* top: 0; */
    box-sizing: border-box !important;
    height: ${窗口高}px !important;
    width: ${窗口宽}px !important;
    max-width: ${窗口宽}px !important;

    display: flex   !important;
    flex-flow: column   !important;
    flex-wrap: wrap   !important;
    align-content: flex-start   !important;

    overflow-x: auto   !important;
    overflow-y: hidden   !important;

    z-index:1   !important;
    /* 双框 */
    box-shadow: 00 0 0rem 1px black inset, 0 0 0rem 2px white inset, 0 0 0rem 3px black inset !important;
    background-color: rgba(255,255,255,0.8)   !important;
    color: black   !important;

    text-align: justify   !important;
    text-indent: 0   !important;
    padding: 10% 1rem;
}
.snomiao-article>*{
    /* display: block              !important; */
    background-color: rgba(255,255,255,0.8) !important;
    max-width: 40rem            !important;
}
.snomiao-article>*:not(li){
    padding: 0 2rem 1rem 0          !important;
    margin: 0 -1rem 0 0             !important;
    min-width: 32rem            !important;
    width: min-content          !important;

    max-height: 100%            !important;
    height:auto                 !important;
    overflow-x: auto            !important;
    overflow-y: auto            !important;
}
/* 解决pre换行问题 */
.snomiao-article pre{
    white-space: pre-wrap;
}
/* 知乎侧边推送精准置底 */
/* https://www.zhihu.com/ */
.Question-sideColumn,.ContentLayout-sideColumn{
    z-index: 0;
}

</style>`;
    }

    const 点击定位到文章监听 = 元素 => {
        if (元素.标记_点击切换雪阅模式) return;
        元素.标记_点击切换雪阅模式 = true
        // 点击定位到文章
        元素.addEventListener("click", function (事件) {
            (元素.scrollIntoViewIfNeeded || 元素.scrollIntoView).call(元素)
        }, false);
    }
    const 元素可见性修复解除 = (元素) => {
        元素.parentElement && 元素可见性修复解除(元素.parentElement)
        if (!元素.标记_元素可见性修复完成) return;
        元素.标记_元素可见性修复完成 = false

        // 父元素 overflow: visible
        if (元素.origin_overflow) { 元素.style.overflow = 元素.origin_overflow }
    }
    const 元素可见性修复 = (元素) => {
        元素.parentElement && 元素可见性修复(元素.parentElement)
        if (元素.标记_元素可见性修复完成) return;
        元素.标记_元素可见性修复完成 = true

        // 父元素 overflow: visible
        if (window.getComputedStyle(元素).getPropertyValue('overflow') == "hidden") {
            元素.origin_overflow = "hidden"
            元素.style.overflow = "visible"
        }
    }
    const 元素位置到屏幕适配 = (元素) => {
        元素.setAttribute("style", `left: 0`);
        const { left } = 元素.getBoundingClientRect()
        元素.classList.add("snomiao-article")
        元素.setAttribute("style", `left: calc(${-left}px)`);
    }
    // 元素位置到屏幕适配(temp1)

    const 内含文本节点向段落替换 = (元素) => [...元素.childNodes].filter(e => !e.tagName).forEach(e => {
        if (!e.textContent.trim()) return null
        e.parentElement.insertBefore(新元素(`<p class='snomiao-replaced'>${e.textContent}</p>`), e)
        e.remove()
    })
    const 段落向文本节点还原 = (元素) => [...元素.querySelectorAll("p.snomiao-replaced")].forEach(e => {
        if (!e.textContent.trim()) return null
        e.parentElement.insertBefore(document.createTextNode(e.textContent), e)
        e.remove()
    })
    const 进入雪阅模式 = (元素) => {
        退出雪阅模式(元素)
        window.snomiao_article = 元素
        点击定位到文章监听(元素)
        元素可见性修复(元素);
        // 为了对齐
        内含文本节点向段落替换(元素)
        更新样式()
        元素位置到屏幕适配(元素)
        // ref: 适配此页面 https://medium.com/s/story/why-sleep-on-it-is-the-most-useful-advice-for-learning-and-also-the-most-neglected-86b20249f06d
        // 未知原因错位，不过写2次就能正常了
        元素位置到屏幕适配(元素)
        元素.标记_雪阅模式 = true
        console.debug(元素, "进入雪阅模式");
    }
    const 退出雪阅模式 = 元素 => {
        段落向文本节点还原(元素)
        元素.setAttribute("style", ``);
        元素.classList.remove("snomiao-article")
        元素可见性修复解除(元素)
        元素.标记_雪阅模式 = false
        console.debug(元素, "退出雪阅模式");
    }
    const 退出雪阅模式_临时 = 元素 => {
        元素.setAttribute("style", ``);
        元素.classList.remove("snomiao-article")
        元素可见性修复解除(元素)
    }

    const 切换雪阅模式 = (元素) => 元素.classList.contains("snomiao-article") && (退出雪阅模式(元素), true) || 进入雪阅模式(元素)
    const 更新雪阅模式 = (元素) => 元素.classList.contains("snomiao-article") != 元素.标记_雪阅模式 && 切换雪阅模式(元素)

    const 恢复所有文章样式_临时 = () => [...document.querySelectorAll(".snomiao-article")].map(退出雪阅模式_临时)

    // 解决span取到offsetHeight为0的问题
    const 取元素投影高 = (元素) => 元素.offsetHeight || 元素.getBoundingClientRect().height
    const 取元素投影宽 = (元素) => 元素.offsetWidth || 元素.getBoundingClientRect().width
    const 取元素投影顶 = (元素) => 元素.getBoundingClientRect().top
    const 取元素面积 = (元素) => 取元素投影高(元素) * 取元素投影宽(元素)
    const 取最大值序 = (列) => 列.indexOf(Math.max(...列))
    const 压平 = 列 => 列.flat()
    const 排序按 = 函数 => 列 => 列.sort((a, b) => 函数(a) - 函数(b))
    const 取距离按 = 函数 => (a, b) => 函数(a) - 函数(b)
    const 翻转矩阵 = 矩阵 => 矩阵[0].map((列, 列号) => 矩阵.map(行 => 行[列号]));
    const 取相邻对 = 列 => 翻转矩阵([列.slice(1), 列.slice(0, -1)])
    const 取相邻关系按 = 关系 => 列 => 取相邻对(列).map(对 => 关系(...对))
    const 文章树取元素 = (文章树) => [文章树.元素, ...(文章树.子树列 && 文章树.子树列.map(文章树取元素) || [])]
    const 元素包含判断 = (父元素, 子孙元素) => 父元素.contains(子孙元素)
    const 检测重叠冲突 = (文章树) => {
        const 窗口高 = 取窗口高(),
            窗口宽 = 取窗口宽()
        const 元素列 = 文章树取元素(文章树).flat(Infinity)
        const 文章列 = 排序按(取元素投影顶)(元素列.filter(e => e.标记_是文章))
        const 相邻对列 = 取相邻对(文章列).map(对 => (对.距离 = 取距离按(取元素投影顶)(...对), 对))
        const 异常对列 = 相邻对列.filter(对 => 对.距离 < 窗口高)
        const 冲突元素列 = 异常对列.map(异常对 => 排序按(取元素面积)(异常对))
        冲突元素列.forEach(([弱势元素, 强势元素]) => {
            // 若子元素与父元素冲突，则子元素不算弱势；换句话说，若弱势元素为强势元素的子元素，则强弱关系互换
            if (元素包含判断(强势元素, 弱势元素)) {
                const tmp = 弱势元素
                弱势元素 = 强势元素
                强势元素 = tmp
            }
            强势元素.标记_冲突弱势元素 = 强势元素.标记_冲突弱势元素 || false
            弱势元素.标记_冲突弱势元素 = 弱势元素.标记_冲突弱势元素 || true

            if (DEBUG_SNOREAD) {
                强势元素.冲突元素对 = [弱势元素, 强势元素]
                弱势元素.冲突元素对 = [弱势元素, 强势元素]
                弱势元素.setAttribute('冲突弱势元素', true)
            }
        })
    }
    const 取文章树 = (元素, 层数 = 0) => {
        const 窗口高 = 取窗口高(),
            窗口宽 = 取窗口宽();

        const 元素外高 = 取元素投影高(元素);

        const 子元素 = [...元素.children]
        const 子元素高于屏 = 子元素.filter(e => 取元素投影高(e) > 窗口高)
        const 主要的子元素 = 子元素高于屏.filter(e => 取元素投影高(e) / 元素外高 > 0.5)

        const 元素宽度占比够小 = 元素.clientWidth < 窗口宽 * 0.95
        const 正确的元素类型 = !['IMG', 'PRE', 'TBODY'].includes(元素.tagName)
        const 是文章 = !主要的子元素.length && 元素宽度占比够小 && 子元素.length >= 3 && 正确的元素类型

        const 子树列 = 子元素高于屏.map(e => 取文章树(e, 层数 + 1)) || []

        const 占比 = 取元素投影高(元素) / 取元素投影高(元素.parentElement)
        元素.标记_是文章 = 是文章

        if (DEBUG_SNOREAD) {
            元素.setAttribute("len子元素", 子元素.length)
            元素.setAttribute("len子元素高于屏", 子元素高于屏.length)
            元素.setAttribute("len主要的子元素", 主要的子元素.length)
            元素.setAttribute("是文章", 是文章)
            元素.setAttribute("占比", 占比)
            是文章 && console.debug(元素, "是文章");
        }
        return { 元素, 是文章, 占比, 子树列 }
    }
    var 输出文章树 = (树) => {
        return [树.元素, 树.是文章, 树.占比, ...(树.子树列 && 树.子树列.map(输出文章树) || [])]
    }
    var 转换文章树 = ({ 元素, 是文章, 子树列 }) => {
        var 子树有文章 = !!子树列.map(转换文章树).filter(e => e).length
        if (子树有文章) return true;
        if (元素 == document.body) return;

        if (!元素.标记_是文章) return;
        // if (!是文章) return;
        if (元素.标记_冲突弱势元素) return;
        更新雪阅模式(元素)
        return true
    }
    var 正在扫描并转换文章树 = false;
    const 文章树扫描并转换 = async () => {
        console.info("[雪阅] 激活");
        正在扫描并转换文章树 = 1
        // 进行操作的时候不要监听自已
        window.SNOREAD_observer && window.SNOREAD_observer.disconnect()
        await 恢复所有文章样式_临时()
        if (!用户意向_雪阅模式) return null;

        const 文章树 = 取文章树(document.body)
        if (DEBUG_SNOREAD) {
            window.调试文章树1 = 文章树
            window.调试文章树2 = 输出文章树(文章树)
            console.debug(输出文章树(文章树))
        }
        检测重叠冲突(文章树)
        转换文章树(文章树)
        正在扫描并转换文章树 = 0
        window.SNOREAD_observer && window.SNOREAD_observer.observe(document.querySelector('body'), { childList: true, subtree: true });
    }


    const 节流防抖化 = (函数, 间隔 = 1000) => {
        // 本函数的作用是结合节流和防抖的特性，只保留间隔内的首次和末次调用
        // 执行示意（比如间隔 4 字符）
        // 外部调用
        // ----!--!!!!!!-!---------!----
        // 内部调用
        // ----!-------------!-----!----
        let 冷却中 = false
        let 时钟号 = null
        const 冷却开始 = () => {
            冷却中 = true
            时钟号 = setTimeout(() => { 冷却中 = false }, 间隔);
        }
        return (...参数) => new Promise((resolve, _) => {
            const 现在时间 = +new Date()
            // 若本次是首次触发，则直接执行
            if (!冷却中) {
                resolve(函数(...参数))
                冷却开始()
            } else {
                // 若短时间再次触发则进入防抖
                if (时钟号 !== null) clearTimeout(时钟号);
                时钟号 = setTimeout(() => {
                    resolve(函数(...参数))
                    冷却开始()
                }, 间隔);
            }
        })
    }
    const 页面可见时才运行化 = (函数) => async (...参) => {
        if (document.hidden) return;
        return await 函数(...参)
    }
    const 开始 = 页面可见时才运行化(节流防抖化(文章树扫描并转换, 1000))

    // 窗口载入
    window.addEventListener('load', 开始, false)
    // 页面大小变化
    window.addEventListener("resize", 开始, false)
    window.SNOREAD_observer = new MutationObserver(function (mutations, observe) {
        开始()
    });
    SNOREAD_observer.observe(document.querySelector('body'), { childList: true, subtree: true });

    console.info("[雪阅] 加载完成");
    开始()


    const 用户意向退出雪阅模式 = () => {
        用户意向_雪阅模式 = false;
        开始()
    }
    window.addEventListener("keydown", e => e.code == "Escape" && 用户意向退出雪阅模式())

})();
// 雪星今天也要努力活下去吖！