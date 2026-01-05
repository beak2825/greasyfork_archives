// ==UserScript==
// @name           百度贴吧图片点击放大
// @namespace      https://greasyfork.org/users/51104
// @version        1.7.3
// @description    直接在当前页面点击查看原图（包括签名档）。支持图片的多开、拖拽、垂直或水平滚动和缩放旋转
// @match          *://tieba.baidu.com/p/*
// @match          *://tieba.baidu.com/f?*
// @exclude        *://tieba.baidu.com/f?*kw=*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @author         lliwhx
// @license        MIT
// @copyright      Copyright © 2016-2022 lliwhx
// @downloadURL https://update.greasyfork.org/scripts/20969/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/20969/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function (win, doc) {
    'use strict';

    /* 贴子404不执行。（可修改） */
    if(doc.title==='贴吧404')return;

    var iTarget,
        preferences,
        gallery,
        iMouse,
        debounce,
        docElement = doc.documentElement,
        docWidth = docElement.clientWidth - 5,
        docHeight = docElement.clientHeight - 5;

    // 打开图片函数
    function open(e) {
        var i,
            tSrc,
            t = e.target;

        /* className分别指向BDE_Image新图，j_user_sign签名档，d_content_img老图。只有鼠标左键点击以上图片且不是图册贴里的图片时才会放大图片。（可修改） */
        if (!e.button && ['BDE_Image', 'j_user_sign', 'd_content_img'].includes(t.className) && t.parentNode.nodeName !== 'A') {
            iTarget = t;
            i = doc.createElement('img');
            i.className = 'btzi-img';

            // 如果原图加载失败，直接显示贴子里的压缩图片；图片损坏不加载
            i.onerror = function () {
                if (this.src !== t.src) {
                    this.src = t.src;
                } else {
                    t = null;
                    tSrc = null;
                    this.onerror = null;
                    this.onload = null;
                }
            };

            // 获取要加载图片的w宽和h高，计算图片的s大小以及x横y纵坐标
            i.onload = function () {
                var w = this.width,
                    h = this.height,
                    s = (!+preferences.size) && (docWidth - w < 0 || docHeight - h < 0) ? Math.min((docWidth - 5) / w,(docHeight - 5) / h) : 1, // 等比例缩小到最长边显示在窗口内或1原图显示
                    x = docWidth - w * s - 5 > 0 ? (docWidth - w * s) / 2 : 5, // 判断图片w宽是否小于docWidth窗口宽，是则居中，不是则左上角。5表示预留5px位置不贴合
                    y = docHeight - h * s - 5 > 0 ? (docHeight - h * s) / 2 : 5;
                this.iData = {
                    width: w,
                    height: h,
                    x: x,
                    y: y,
                    scale: s,
                    rotate: 0
                };
                transform(this, x, y, s, 0);
                t = null;
                x = null;
                y = null;
                s = null;
                tSrc = null;
                this.onerror = null;
                this.onload = null;
                gallery.appendChild(this); // 将加载好的图片插入到图片框架里显示
            };

            /*
            以下两句代码关系着放大后的图片是否是原图，匹配失败打开的则是贴子里被压缩的图片。
            比如某图片直接右键打开是下面这个地址：
            http://abc.baidu.com/forum/xxx/sign=xxx/123.jpg?tbpicau=xxx
            用原贴吧图片功能查到原图是下面这个地址：
            https://abc.baidu.com/forum/pic/item/123.jpg
            我们需要获取到点击图片的abc和123的内容，然后补全成原图的地址。
            需学习“正则表达式”。（可修改）
            */
            tSrc = /https?:\/\/(\w+)\.baidu\.com\/.+\/(\w+\.[a-zA-Z]{3,4}([^_]*_?))/.exec(t.src);
            if(tSrc && tSrc[3]){
                loadComment(i,tSrc[2],t);
            }else{
                i.src = tSrc ? `//${tSrc[1]}.baidu.com/forum/pic/item/${tSrc[2]}` : t.src;
            }
        }
    }

    var tiebaTid = /\d+/.exec(location.pathname)[0];

    function loadComment(i,tSrc,t){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                i.src = JSON.parse(this.responseText)?.data?.img?.original?.waterurl || t.src;
            }
        };
        tSrc = /(\w+)/.exec(tSrc)[0];
        xhttp.open("GET", "https://tieba.baidu.com/photo/p?alt=jview&pic_id="+tSrc+"&tid="+tiebaTid, true);
        xhttp.send();
    }
    
    // 鼠标按下图片函数
    function down(e) {
        var t,
            data;
        if (!e.button) {
            t = e.target;
            data = t.iData;
            iTarget = t;
            iMouse = { // 获取鼠标按下时的xy坐标和相对图片的xy坐标
                clientX: e.clientX,
                clientY: e.clientY,
                offsetX: data.x - e.clientX,
                offsetY: data.y - e.clientY
            };
            t = null;
            data = null;
            e.preventDefault();
            e.stopPropagation();
            doc.addEventListener('mousemove', move); // 鼠标按下时给页面注册鼠标移动和鼠标放开事件
            doc.addEventListener('mouseup', up);
        }
    }

    // 鼠标移动图片函数
    function move(e) {
        var t = iTarget,
            data = t.iData,
            x = e.clientX + iMouse.offsetX,
            y = e.clientY + iMouse.offsetY;
        e.stopPropagation();
        transform(t, x, y, data.scale, data.rotate);
        t = null;
        x = null;
        y = null;
        data = null;
    }

    // 固定图片位置函数
    function up(e) {
        var t,
            data,
            translate;
        if (iMouse.clientX === e.clientX && iMouse.clientY === e.clientY) { // 判断鼠标按下和松开的位置一致才能关闭图片
            iTarget = null;
        } else {
            t = iTarget;
            data = t.iData;
            translate = /translate\((-?\d+)px,\s?(-?\d+)px\)/.exec(t.getAttribute('style')); // 获取图片变化后的位置导入图片属性内
            data.x = translate[1] | 0; // 取整
            data.y = translate[2] | 0;
            t = null;
            data = null;
            translate = null;
        }
        iMouse = null;
        doc.removeEventListener('mousemove', move); // 鼠标松开后注销页面鼠标移动和鼠标放开事件
        doc.removeEventListener('mouseup', up);
    }

    /* 图片关闭函数。（可修改） */
    function close(e) {
        var t = e.target;
        switch (preferences.closeWindow) {
            case 'btzi_gallery': // 关闭图片范围为图片时，点击图片关闭该图片
                if (!iTarget) {
                    t.iData = null;
                    t.remove();
                }
                break;
            case 'document': // 当关闭图片方式为页面时，点击要放大的图片以外的区域都会关闭所有图片
                if (!iTarget || (t !== iTarget && t !== docElement)) {
                    if(doc.body.classList.contains('btzi-enabled') || t.id === 'btzi_settings_save')break; // 打开用户设置界面，不会关闭图片
                    gallery.style.display = 'none';
                    while (gallery.hasChildNodes()) { // 关闭所有图片
                        gallery.firstChild.iData = null;
                        gallery.firstChild.remove();
                    }
                    gallery.style.display = '';
                }
                break;
        }
        t=null;
        iTarget = null;
    }

    // 鼠标滚轮函数
    function wheel(e) {
        var t = e.target,
            data = t.iData,
            x = data.x,
            y = data.y,
            s = data.scale,
            r = data.rotate,
            p = preferences,
            eKey = !e.altKey && !e.ctrlKey && !e.shiftKey,
            wKey = p.wheelKey,
            zKey = p.zoomKey,
            rKey = p.rotateKey,
            wDirection = p.wheelDirection,
            zDirection = p.zoomDirection,
            rDirection = p.rotateDirection,
            deltaXY = (e.deltaY || e.deltaX) > 0 ? 100 : -100, // 滚轮向下滚动时e.deltaY/e.deltaX返回正值，向上滚动时e.deltaY/e.deltaX返回负值。因使用组合键时浏览器变化的参数不一样，故判断e.deltaY/e.deltaX哪个发生了变化。图片移动设置为一次100px
            delta,
            tmp,
            z;
        e.preventDefault();
        e.stopPropagation();
        if (wKey === 'type' && eKey || wKey !== 'type' && e[wKey]) { // 图片滚轮移动判断
            tmp = docHeight - data.height * s; // 只要图片高大于窗口高，就上下移动。
            if (tmp < 0) {
                delta = r > 90 ? data.height * s : 0; // 图片翻转超过90度后，原本图片的左上角跑到了下方，要增加图片高度计算
                z = y - deltaXY * wDirection; // 图片y纵坐标移动后的新纵坐标。相对窗口左上角，往上移（图片到底）减小，往下移（图片到顶）增加
                if (z > 5 + delta) { // 到顶
                    z = 5 + delta;
                } else if (z < tmp + delta) { // 到底
                    z = tmp + delta;
                }
                data.y = z;
                transform(t, x, z, s, r);
                return;
            }
            tmp = docWidth - data.width * s; // 单单只有图片宽大于窗口宽，才左右移动
            if (tmp < 0) {
                delta = r % 270 ? data.width * s : 0;
                z = x - deltaXY * wDirection;
                if (z > 5 + delta) {
                    z = 5 + delta;
                } else if (z < tmp + delta) {
                    z = tmp + delta;
                }
                data.x = z;
                transform(t, z, y, s, r);
                return;
            }
        }
        if (zKey === 'type' && eKey || zKey !== 'type' && e[zKey]) { // 图片缩放判断
            delta = deltaXY * zDirection > 0 ? 0.1 : -0.1;
            z = s + delta;
            if ((z < 0.2 && s >= 0.1) || (s < 0.1 && z < 0)) { // 缩放过小不再进行缩放
                return;
            }
            tmp = z / s;
            data.x = e.clientX - (e.clientX - x) * tmp; // 计算以鼠标位置进行缩放。e.clientX - x为鼠标距离图片边的距离，* tmp为缩放后的距离，e.clientX - 计算得相对鼠标移动缩放后的图片边距
            data.y = e.clientY - (e.clientY - y) * tmp;
            data.scale = z;
            transform(t, data.x, data.y, z, r);
            return;
        }
        if (rKey === 'type' && eKey || rKey !== 'type' && e[rKey]) { // 图片旋转判断
            tmp = data.width; // 对图片内data.width宽data.height高属性进行调换，使旋转后的图片数据正常计算
            data.width = data.height;
            data.height = tmp;
            delta = deltaXY * rDirection > 0 ? 90 : 270; // 270比-90好计算
            z = (r + delta) % 360; // 取余。保证为0，90，180，270度
            tmp = 0.01745329 * delta;
            data.x = e.clientX - (e.clientX - x) * Math.cos(tmp) + (e.clientY - y) * Math.sin(tmp); // 以鼠标位置(e.clientX,e.clientY)为中心，图片坐标(x,y)旋转tmp弧度，计算新坐标
            data.y = e.clientY - (e.clientX - x) * Math.sin(tmp) - (e.clientY - y) * Math.cos(tmp);
            data.rotate = z;
            transform(t, data.x, data.y, s, z);
            return;
        }
    }

    // 图片动画函数。translate移动，scale缩放，rotate旋转度
    function transform(t, x, y, s, r) {
        t.style.transform = `translate(${x | 0}px, ${y | 0}px) scale(${s}) rotate(${r}deg)`;
    }

    // 关闭图片的范围是w图片框架还是doc页面
    function frame(w) {
        return doc.getElementById(w) || doc;
    }

    // 浏览器窗口缩放后重新计算窗口大小，保证图片打开后的位置基于变化后的窗口大小
    function resize() {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
            docWidth = docElement.clientWidth - 5;
            docHeight = docElement.clientHeight - 5;
        }, 500);
    }

    /* 定位到贴子内容，用来注册事件。（可修改） */
    var postlist = doc.getElementById('j_p_postlist');

    /* 阻止贴吧默认打开图片方式函数。（可修改） */
    var prevent = function (e) {
        var t = e.target;
        if (!e.button && t.className === 'BDE_Image' && t.parentNode.nodeName !== 'A') { // t.parentNode.nodeName !== 'A'图册贴里的图片打开方式不取消，仍为默认方式
            e.stopPropagation();
        }
    },

        /* 贴子翻页删除图片函数。（可修改） */
        callback = function () {
            gallery.style.display = 'none';
            while (gallery.hasChildNodes()) {
                gallery.firstChild.iData = null;
                gallery.firstChild.remove();
            }
            gallery.style.display = '';
        },

        /* 监听贴子是否翻页。（可修改） */
        observer = new MutationObserver(callback);
    observer.observe(postlist, {
        childList: true
    });

    /* 添加样式。鼠标放到图片上的cursor鼠标样式，放大后图片的btzi-gallery框架位置，以及btzi-img图片定位和hover鼠标经过图片时置顶并显示阴影，active鼠标按下图片后隐藏阴影。（可修改） */
    GM_addStyle('.BDE_Image,.d_content_img,.j_user_sign{cursor:zoom-in;}.btzi-gallery{position:fixed;top:0;left:0;z-index:19990801;}.btzi-img{position:absolute;transform-origin:0 0;box-shadow:0 0 7px rgba(0,0,0,.4);}.btzi-img:hover{z-index:20220801;box-shadow:0 0 7px rgb(0,0,0);}.btzi-img:active{box-shadow:0 0 7px rgba(0,0,0,.4);cursor:move;}');

    /*
    获取btzi-UserSettings用户设置，初次使用设定一个默认值。
    open鼠标左键打开图片方式；
    close鼠标左键关闭图片方式，closeWindow可关闭图片的范围；
    size图片打开后大小；
    wheelKey滚动图片组合键，wheelDirection滚动图片滚轮方向；
    zoomKey缩放图片组合键，zoomDirection缩放图片滚轮方向；
    rotateKey旋转图片组合键，rotateDirection旋转图片滚轮方向。
    */
    preferences = JSON.parse(GM_getValue('btzi-UserSettings', '{"open": "click","close": "click","closeWindow":"btzi_gallery","size":"100","wheelKey":"type","wheelDirection": "1","zoomKey": "ctrlKey","zoomDirection": "-1","rotateKey": "altKey","rotateDirection": "1"}'));

    // 创建存放图片的div框架
    gallery = doc.createElement('div');
    gallery.className = 'btzi-gallery';
    gallery.id = 'btzi_gallery';
    gallery.addEventListener('mousedown', down); // 给框架注册鼠标按下事件，可以移动关闭图片
    gallery.addEventListener('wheel', wheel); // 给框架注册鼠标滚轮事件，可以滚动图片
    doc.body.appendChild(gallery);

    postlist.addEventListener('click', prevent, true); //  给贴子内容注册阻止原图片打开事件
    postlist.addEventListener(preferences.open, open, true); // 给贴子内容注册打开图片事件
    frame(preferences.closeWindow).addEventListener(preferences.close, close); // 给关闭图片的范围注册图片关闭图片事件
    win.addEventListener('resize', resize); // 给浏览器注册窗口缩放事件

    // 用户设置界面函数
    var settings = function () {

        // 用户设置界面样式
        GM_addStyle('.btzi-enabled .btzi-modal,.btzi-enabled .btzi-container{display:flex;}.btzi-modal,.btzi-container{position:fixed;top:0;left:0;display:none;width:100%;height:100%;}.btzi-modal{z-index:20211231;background-color:rgba(0,0,0,.7);}.btzi-container{z-index:20220101;justify-content:center;align-items:center;text-align:left;}.btzi-content{width:335px;border-radius:6px;background-color:#fff;}.btzi-header,.btzi-body,.btzi-footer{padding:11px;}.btzi-header{border-bottom:1px solid #e6ecf0;}.btzi-title{padding:0;margin:0;font:400 20px sans-serif;color:#000;text-align:center;}.btzi-group{padding:0;margin:0;margin-bottom:15px;border:0;}.btzi-legend,.btzi-controls,.btzi-select,.btzi-button{font:14px sans-serif;color:#000;}.btzi-legend{padding:5px 0;margin:0;float:left;width:81px;text-align:right;}.btzi-controls{margin-left:93px;clear:none;}.btzi-select{box-sizing:border-box;padding:4px;margin:0;width:180px;height:30px;border:1px solid #e6ecf0;border-radius:3px;appearance:auto;}.btzi-select:focus{outline:#f0f auto;}.btzi-footer{text-align:center;border-top:1px solid #e6ecf0;}.btzi-button{padding:9px 18px;border:0;border-radius:75px;font-weight:700;color:#fff;background:#4ab3f4;cursor:pointer;transition:box-shadow .17s ease-in-out;}.btzi-button:hover,.btzi-button:active{background:#1da1f2;}.btzi-button:focus{box-shadow:0 0 0 2px #fff,0 0 0 4px #a4d9f9;}.btzi-button:active{box-shadow:0 0 0 2px #fff,0 0 0 4px #4ab3f4;}');

        var html,
            form,
            p,
            prop,
            KeyIndex,
            change;

        // 用户设置界面html
        html = '<div class=btzi-modal></div><div class=btzi-container><div class=btzi-content><div class=btzi-header><h3 class=btzi-title>用户设置</h3></div><div class=btzi-body><form id=btzi_settings_form><fieldset class=btzi-group><legend class=btzi-legend>打开图片</legend><div class=btzi-controls><select class=btzi-select name=btzi[open]><option value=click>鼠标左键，单击图片</option><option value=dblclick>鼠标左键，双击图片</option></select></div></fieldset><fieldset class=btzi-group><legend class=btzi-legend>关闭图片</legend><div class=btzi-controls><select class=btzi-select name=btzi[close]><option value=click>鼠标左键，单击</option><option value=dblclick>鼠标左键，双击</option></select><select class=btzi-select name=btzi[closeWindow]><option value=btzi_gallery>图片，关闭单个图片</option><option value=document>页面，关闭所有图片</option></select></div></fieldset><fieldset class=btzi-group><legend class=btzi-legend>图片大小</legend><div class=btzi-controls><select class=btzi-select name=btzi[size]><option value=100>默认： 原始</option><option value=0>默认： 等比例适应屏幕</option></select></div></fieldset><fieldset class=btzi-group><legend class=btzi-legend>滚动图片</legend><div class=btzi-controls><select class=btzi-select name=btzi[wheelKey]><option value=type>组合键： 无</option><option value=ctrlKey>组合键： Ctrl</option><option value=altKey>组合键： Alt</option><option value=shiftKey>组合键： Shift</option></select><select class=btzi-select name=btzi[wheelDirection]><option value=1>滚轮向下，图片上/左移</option><option value=-1>滚轮向上，图片上/左移</option></select></div></fieldset><fieldset class=btzi-group><legend class=btzi-legend>缩放图片</legend><div class=btzi-controls><select class=btzi-select name=btzi[zoomKey]><option value=type>组合键： 无</option><option value=ctrlKey>组合键： Ctrl</option><option value=altKey>组合键： Alt</option><option value=shiftKey>组合键： Shift</option></select><select class=btzi-select name=btzi[zoomDirection]><option value=1>滚轮向下，图片放大</option><option value=-1>滚轮向上，图片放大</option></select></div></fieldset><fieldset class=btzi-group><legend class=btzi-legend>旋转图片</legend><div class=btzi-controls><select class=btzi-select name=btzi[rotateKey]><option value=type>组合键： 无</option><option value=ctrlKey>组合键： Ctrl</option><option value=altKey>组合键： Alt</option><option value=shiftKey>组合键： Shift</option></select><select class=btzi-select name=btzi[rotateDirection]><option value=1>滚轮向下，顺时针旋转</option><option value=-1>滚轮向上，顺时针旋转</option></select></div></fieldset></form></div><div class=btzi-footer><button class=btzi-button id=btzi_settings_save type=button>保存设置</button></div></div></div>';
        doc.body.insertAdjacentHTML('beforeend', html);
        form = doc.getElementById('btzi_settings_form');
        p = preferences;
        for (prop in p) { // 将数据库里的设置导入到用户设置界面显示
            form[`btzi[${prop}]`].value = p[prop];
        }

        KeyIndex = {'btzi[wheelKey]':form['btzi[wheelKey]'].selectedIndex,'btzi[zoomKey]':form['btzi[zoomKey]'].selectedIndex,'btzi[rotateKey]':form['btzi[rotateKey]'].selectedIndex};

        // 避免组合键冲突，当选择已有组合键时会互相替换
        change = function () {
            var prop,tmp;
            for (prop in KeyIndex) {
                if (this.selectedIndex === KeyIndex[prop]) {
                    tmp = KeyIndex[this.name];
                    KeyIndex[prop] = tmp;
                    form[prop].selectedIndex = tmp;
                    break;
                }
            }
            KeyIndex[this.name] = this.selectedIndex;
            prop = null;
            tmp = null;
        };
        form['btzi[wheelKey]'].addEventListener('change', change);
        form['btzi[zoomKey]'].addEventListener('change', change);
        form['btzi[rotateKey]'].addEventListener('change', change);

        // 给保存按钮注册事件
        doc.getElementById('btzi_settings_save').addEventListener('click', function () {
            var prop,
                prefer = p,
                opened = prefer.open,
                closed = prefer.close,
                closedWindow = prefer.closeWindow;
            for (prop in prefer) { // 整合获得的新设置
                prefer[prop] = form[`btzi[${prop}]`].value;
            }
            if (opened !== prefer.open) { // 判断鼠标打开图片的方式是否更换
                postlist.removeEventListener(opened, open, true);
                postlist.addEventListener(prefer.open, open, true);
            }
            if (closed !== prefer.close || closedWindow !== prefer.closeWindow) { // 判断鼠标关闭图片的范围是否更换
                frame(closedWindow).removeEventListener(closed, close);
                frame(prefer.closeWindow).addEventListener(prefer.close, close);
            }
            GM_setValue('btzi-UserSettings', JSON.stringify(prefer)); // 将用户的新设置导入到数据库里保存
            doc.body.classList.remove('btzi-enabled');
            prefer=null;
        });
        settings = null;
        doc.body.classList.add('btzi-enabled');
    };
    if (!GM_getValue('btzi-UserSettings')) { // 第一次使用，弹出设置界面
        settings();
    }

    // 在浏览器扩展的菜单列表里添加设置选项
    GM_registerMenuCommand('btzi-用户设置', function () {
        if (settings) {
            settings();
        } else {
            doc.body.classList.add('btzi-enabled');
        }
    });

})(window, document);

console.log('也许我走了，什么都不会剩下。');