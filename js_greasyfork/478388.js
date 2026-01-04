// ==UserScript==
// @name        内容展开显示
// @namespace   hzhbest
// @include     *://*/*
// @description    展开鼠标下方的内容。
// @version     0.4
// @run-at      document-end
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478388/%E5%86%85%E5%AE%B9%E5%B1%95%E5%BC%80%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/478388/%E5%86%85%E5%AE%B9%E5%B1%95%E5%BC%80%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {

    'use strict';
    var videotimeout, popuptimeout, mvouttimeout;
    var popuptimer, mvouttimer, clstime;
    var curelem;
    var topbox, expbox;
    var firstopen, paused = false, vsrc, mt = "";
    var padding = 3;
    let css = `
		.expand_box {
            display: none; position: absolute; height: fit-content; max-width: 95%; height: auto; overflow-y: auto;
            scrollbar-width: thin; background: #fafbed; border: 1px solid #a8a8a8; box-shadow: 0 0 5px #222;
            z-index: 10000; padding: ${padding}px;
        }
        .expand_box>div {color: black !important;}
        .expand_box.shown {display: block !important;}
	`;

    // 设置选项 ===
    popuptimeout = 0.5;	// 鼠标悬停弹出延时（秒）
    mvouttimeout = 1;	// 鼠标移出关闭延时（秒）
    //videotimeout = 3;	// 视频播放完后自动关闭延时（秒）；钉住时不关闭
    // 设置选项 ||=

    var scrolltimer;
    document.body.addEventListener('mousemove', (e) => {        // 按住shfit键悬停鼠标时弹出主容器
        if (!paused && e.shiftKey) {                            // 非暂停状态下
            clearTimeout(popuptimer);                           // 重置弹出计时（不再为前一个弹出计时）
            texpand(e);
        }
    }, false);
    var wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll");	//compatibility fix for Chrome-core browsers
    document.body.addEventListener(wheelEvt, () => {
        paused = true;
        clearTimeout(scrolltimer);
        clearTimeout(popuptimer);
        scrolltimer = setTimeout(() => {
            paused = false;
        }, 1000);
    }, false);   // 鼠标滚动，进入暂停状态并延时取消
    document.body.addEventListener('mousedown', () => { paused = true; }, false);   // 鼠标按键落下，进入暂停状态
    document.body.addEventListener('mouseup', () => { paused = false; }, false);    // 鼠标按键弹起，取消暂停状态
    /*     document.body.addEventListener('mousemove', (event) => {
            if (event.shiftKey && isOverflow(event.target, event)) {
                popuptime = setTimeout(() => {
                    expandtext(event.target, getTrueSize(event.target));
                }, popuptimeout * 300);
            }
        }, false); */
    addCSS(css);
    topbox = creaElemIn('div', document.body);                  // 主容器
    topbox.className = 'expand_box';
    expbox = creaElemIn('div', topbox);                         // 内容容器
    firstopen = false;                                          // 主容器是否“新的”

    topbox.addEventListener('mouseleave', (event) => {          // 鼠标移出主容器时，计时隐藏主容器
        firstopen = false;                                      // 主容器变“旧”
        paused = false;                                         // 取消暂停状态（可触发其他弹出）
        mvouttimer = setTimeout(() => {                          // 若主容器不更“新”，则一秒后隐藏主容器
            if (!firstopen) reset();
        }, mvouttimeout * 1000);
    }, false);
    topbox.addEventListener('mousemove', () => {                // 鼠标在主容器中移动时暂停其他计时
        clearTimeout(mvouttimer);                                // 重置隐藏主容器计时
        clearTimeout(popuptimer);                                // 重置弹出计时（避免另一个弹出产生）
        paused = true;                                          // 进入暂停状态（不再开新的弹出计时）
    }, false);

    function texpand(event) {                                   // 弹出主容器，承接鼠标移动事件
        if (!event.shiftKey || event.ctrlKey || event.altKey) { // 如果计时结束时 sfhit 键已弹起，不再弹出
            return;
        }
        let tnode = event.target;
        if (isCursorInElem(topbox, event)) {                    // 如果在主容器内触发，不再弹出
            return;
        }
        if (tnode !== curelem) {                                // 如果目标节点不是前一个节点，重置弹出计时（专注当前节点）
            clearTimeout(popuptimer);
        }
        /* var vnode = getVideoBox(tnode);
        if (!!vnode) {
            expandvideo(vnode);
            return;
        } */
        if (!tnode.textContent && !tnode.src && !window.getComputedStyle(tnode).backgroundImage) {  // 如果目标节点不含文本，不再弹出
            return;
        }
        if (!!tnode.textContent && (tnode.nodeName == "A" || tnode.nodeName == "SPAN")) {     // 如果目标节点为文本链接或节点
            var tnodestyle = window.getComputedStyle(tnode);                // 提取样式
            var fontsize = Number(tnodestyle.fontSize.replace('px', ''));   // 提取样式字体大小
            var linehght = Number(tnodestyle.lineHeight.replace('px', '')); // 提取样式行高
            var pos = getTrueSize(tnode);                                   // 提取节点真实占位
            var lineChrCnt = Math.floor(pos.w / fontsize);
            var lineCnt = Math.ceil(tnode.textContent.length / lineChrCnt);
            var textHeight = linehght * lineCnt * 1.5;
            if (pos.h < textHeight) {
                pos.h = textHeight;
                popuptimer = setTimeout(() => {
                    expandtext(tnode, pos);
                }, popuptimeout * 1000);
            }
        } else if (isOverflow(tnode, event)) {
            popuptimer = setTimeout(() => {
                expandtext(tnode, getTrueSize(tnode));
            }, popuptimeout * 1000);
        } else {
            var pnode = getOverflowPnode(getElemUnderCursor(event), event);
            if (!!pnode) {
                popuptimer = setTimeout(() => {
                    expandtext(pnode, getTrueSize(pnode));
                }, popuptimeout * 1000);
            }
        }


        /*         if (tnode.nodeName == 'DIV' && tnode.className.indexOf('detail_wbtext_') == 0) {
                    btnexpand = tnode.querySelector('span.expand');
                } else if (tnode.nodeName == 'P' && tnode.className == 'txt') {
                    btnexpand = tnode.querySelector('a[action-type="fl_unfold"]');
                } else if (true || !/weibo\.com\/\d{10}\/[a-z0-9A-Z]{9}\??/.test(location.href)) {
                    var tvnode = getVideoBox(tnode, event);
                    //console.log('tvnode159: ', tvnode);
                    if (!!tvnode) {
                        popuptime = setTimeout(() => {
                            expandvideo(tvnode, event);
                        }, popuptimeout * 1000);
                        //console.log("167:", exptime, tvnode);
                    } else {
                        //console.log("181c:", exptime);
                        clearTimeout(popuptime);
                    }
                } */
        curelem = tnode;
    }

    function reset() {
        topbox.classList.remove('shown');

    }

    function expandtext(tnode, posiz) {
        if ((posiz.w * posiz.h) > (window.innerHeight * window.innerWidth * 0.7)) {
            return;
        }
        firstopen = true;
        expbox.innerHTML = tnode.innerHTML;
        var tnodestyle = window.getComputedStyle(tnode);
        var fontsize = Number(tnodestyle.fontSize.replace('px', ''));
        var linehigh = Number(tnodestyle.lineHeight.replace('px', ''));
        var wh = window.innerHeight;
        var ww = window.innerWidth;
        var etop = Math.max(posiz.t - padding, wh * 0.02);
        var eheight = wh * 0.94 - etop;
        var ewidth = Math.max(posiz.w, 120);
        var eleft = Math.max(ww * 0.02, Math.min(ww * 0.98 - posiz.w, posiz.l)) - padding;

        topbox.classList.add('shown');
        expbox.style = `line-height: ${linehigh}px; font-size: ${fontsize}px;`;
        topbox.style = `max-height: ${eheight}px; width: ${ewidth}px; top: ${etop + window.scrollY}px; left: ${eleft}px; `;
    }

    function getVideoBox(elem, event) {
        var velem, telem;
        if (!!elem) {
            if (elem.nodeName == 'VIDEO') {
                velem = elem;
            } else {
                telem = elem.parentNode.querySelector('video');
                if (!!telem && isCursorInElem(telem, event)) {
                    velem = telem;
                }
            }
            return velem;
        }
        return false;
    }

    function expandvideo(vnode) {
        firstopen = true;
        var vbox = creaElemIn('video', expbox);
        vbox.src = vnode.src;
        var etop = window.innerHeight * 0.4;

        topbox.classList.add('shown');
        expbox.style = ``;
        topbox.style = `top: ${etop}px; right: 50px; position: fixed !important;`;
    }

    function creaElemIn(tagname, destin) {	//在 destin 内末尾创建元素 tagname
        let theElem = destin.appendChild(document.createElement(tagname));
        return theElem;
    }

    function addCSS(css, cssid) {
        let stylenode = creaElemIn('style', document.getElementsByTagName('head')[0]);
        stylenode.textContent = css;
        stylenode.type = 'text/css';
        stylenode.id = cssid || '';
    }

    function isCursorInElem(elem, event) {
        var x = Number(event.clientX) // 鼠标相对屏幕横坐标
        var y = Number(event.clientY) // 鼠标相对屏幕纵坐标

        var elemLeft = Number(elem.getBoundingClientRect().left) // obj相对屏幕的横坐标
        var elemRight = Number(
            elem.getBoundingClientRect().left + elem.clientWidth
        ) // obj相对屏幕的横坐标+width

        var elemTop = Number(elem.getBoundingClientRect().top) // obj相对屏幕的纵坐标
        var elemBottom = Number(
            elem.getBoundingClientRect().top + elem.clientHeight
        ) // obj相对屏幕的纵坐标+height

        return (x > elemLeft && x < elemRight && y > elemTop && y < elemBottom);
    }

    function getOverflowPnode(elem, event, steps) {
        var l = steps || 0;
        if (isOverflow(elem, event)) {
            return elem;
        } else {
            if (steps > 1) return false;
            var ret = getOverflowPnode(elem.parentNode, event, l++);
            if (!!ret) {
                return ret;
            } else {
                return false;
            }
        }
    }

    function isOverflow(elem, event) {
        if (elem.nodeName !== "#text" && isCursorInElem(elem, event) && window.getComputedStyle(elem).overflow !== "visible") {
            return elem;
        } else {
            return false;
        }
    }

    function getElemUnderCursor(event) {
        const x = event.clientX;
        const y = event.clientY;
        if (document['caretPositionFromPoint']) {
            const pos = document['caretPositionFromPoint'](x, y);
            if (!pos) { return; }
            console.log('pos.offsetNode.parentNode: ', pos.offsetNode.parentNode);
            return pos.offsetNode.parentNode;
        } else {
            return false;
        }
    }

    function getTrueSize(elem, posiz) {
        if (!posiz) {
            var p = elem.getBoundingClientRect();
            posiz = {
                w: p.width,
                h: p.height,
                t: p.top,
                l: p.left,
            };
        }
        var pp = elem.parentNode.getBoundingClientRect();
        var pr = posiz.l + posiz.w, pb = posiz.t + posiz.h;
        var isvi = {
            l: posiz.l < pp.right && posiz.l >= pp.left,            // 子左在父左右之间
            r: pr > pp.left && pr <= pp.right,                      // 子右在父左右之间
            t: posiz.t < pp.bottom && posiz.t >= pp.top,            // 子顶在父顶底之间
            b: pb > pp.top && pb <= pp.bottom                       // 子底在父顶底之间
        };
        if (isvi.l && isvi.r && isvi.t && isvi.b) {                 // 子全在父之内，则返回子占位
            return posiz;
        } else {
            var ppl = (isvi.l) ? posiz.l : pp.left;                 // 确定可见四边（在父之内按子，否则按父）
            var ppt = (isvi.t) ? posiz.t : pp.top;
            var ppr = (isvi.r) ? posiz.l + posiz.w : pp.right;
            var ppb = (isvi.b) ? posiz.t + posiz.h : pp.bottom;
            return getTrueSize(elem.parentNode, {
                w: ppr - ppl,
                h: ppb - ppt,
                t: ppt,
                l: ppl,
            });
        }
    }

})();
