// ==UserScript==
// @name         浏览器工具—打开网站
// @name:zh	 浏览器工具—打开网站
// @version      2.1.0
// @namespace    http://tampermonkey.net/
// @description  打开网站，调用快捷键弹出图标栏，点击后台打开设置的网站，默认百度首页、Google首页、Tampermonkey管理、历史记录、扩展、下载等页面。为了鼠标手势调用快捷键弹图标栏，点击图标访问网站，不需要再新建标签页，输入地址或者点击收藏的书签访问。
// @author       12style
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant	 GM_setClipboard
// @grant	 GM_info
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/404915/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E6%89%93%E5%BC%80%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/404915/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E6%89%93%E5%BC%80%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var keyword = {
        beforePopup: function (popup) {
            var text = window.getSelection().toString().trim();
            GM_setValue('search', text);
            popup(text);
        },
        beforeCustom: function (custom) {
            var text = GM_getValue('search');
            GM_setValue('search', '');
            custom(text);
        },

    };




    var iconArray = [

        {
            name: '百度',
            image: 'https://i.ibb.co/Gt7S5c5/djjii6V.png',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com');
            }
        },
        {
            name: 'Google',
            image: 'https://i.ibb.co/bRnzC1R/WdNuzR1.png',
//            image: 'https://i.ibb.co/2qy4PVn/icons8-google-512-1.png',
            host: ['www.google.com'],
            popup: function (text) {
                open('https://www.google.com');
            }
        },
        {
            name: 'Instagram',
            image: 'https://i.ibb.co/7tDRpZ4/HJMsmlL.png',
//            image: 'https://i.ibb.co/NZmysXw/icons8-instagram-512-1.png',
            host: ['www.instagram.com'],
            popup: function (text) {
                open('https://www.instagram.com/');
            }
        },
        {
            name: '微博',
            image: 'https://i.ibb.co/SwMhjvg/IuiO8KQ.png',
            host: ['www.weibo.com'],
            popup: function (text) {
                open('https://weibo.com');
            }
        },

        {
            name: '知乎',
            image: 'https://i.ibb.co/qJg9gMm/zhihu.png',
            host: ['www.zhihu.com'],
            popup: function (text) {
                open('https://www.zhihu.com');
            }
        },
        {
            name: 'Greasyfork',
            image: 'data:image/png;base64,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',
            host: ['greasyfork.org'],
            popup: function (text) {
                open('https://greasyfork.org/zh-CN/scripts');
            }
        },
        {
            name: '油猴',
            image: 'https://i.ibb.co/Fb2STTZ/1.png',
            host: [''],
            popup: function (text) {
                open('chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=dashboard');
            }
        },
        {
            name: 'Github',
            image: 'data:image/png;base64,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',
            host: ['github.com'],
            popup: function (text) {
                open('https://github.com/');
            }
        },
        {
            name: '历史',
            image: 'https://i.ibb.co/3zdGrsw/3-3.png',
            host: [''],
            popup: function () {
                open('chrome://history/');
            }
        },{
            name: '扩展',
            image: 'https://i.ibb.co/0h8rvd4/1-2.png',
            host: ['mail.qq.com'],
            popup: function () {
                open('chrome://extensions/');
            }
        },
        {
            name: '下载',
            image: 'https://i.ibb.co/t2nY9c8/2-1.png',
            host: [''],
            popup: function () {
                open('chrome://downloads/');
            }
        },


    ],


    hostCustomMap = {};
    iconArray.forEach(function (obj) {
        obj.host.forEach(function (host) {// 赋值DOM加载后的自定义方法Map
            hostCustomMap[host] = obj.custom;
        });
    });
    var text = GM_getValue('search');
    if (text && window.location.host in hostCustomMap) {
        keyword.beforeCustom(hostCustomMap[window.location.host]);
    }
    var icon = document.createElement('div');
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseup', function () {//鼠标弹起响应open函数
                keyword.beforePopup(obj.popup);
        });

        img.setAttribute('style', '' +
            'cursor:pointer!important;' +
            'display:inline-block!important;' +
            'width:24px!important;' +//图标尺寸设置
            'height:24px!important;' +
            'border:0!important;' +
            'background-color:rgba(255,255,255,0.3)!important;' +//透明度
            'padding:0!important;' +
            'margin:0!important;' +
            'margin-right:3px!important;' +//图标间距
            '');
        icon.appendChild(img);
    });
    icon.setAttribute('style', '' +
        'display:none!important;' +
//        'width:720px!important;' +//宽度换行
        'position:absolute!important;' +
        'padding:0!important;' +
        'margin:0!important;' +
        'font-size:13px!important;' +
        'text-align:left!important;' +
        'border:0!important;' +
        'background:transparent!important;' +
        'z-index:2147483647!important;' +

        '');
    // 添加到 DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
        }
    });
    // 选中变化事件：
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
        }
    });

    // 鼠标事件
    var timer;
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
            return;
        }
    });

    let mouseEvent = null;

    document.addEventListener('mousemove', event => {

        mouseEvent = event;

    });

    document.addEventListener('keydown',event => {

        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;
        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }

        if(document.activeElement.tagName.toLowerCase() !== 'iframe'){
              if(keynum==79&&event.altKey){
                icon.style.top = mouseEvent.pageY +25 + 'px';//设置文字下方距离
                if(mouseEvent.pageX -70<10)
                    icon.style.left='10px';
                else
                    icon.style.left = mouseEvent.pageX -70 + 'px';

                fadeIn(icon);

                clearTimeout(timer);

                timer = window.setTimeout(TimeOutHide, 6000);
            }
        }
    });



    var TimeOutHide;
    var ismouseenter = false;

    //延时消失
    TimeOutHide = function () {
        if (ismouseenter == false) {
            return fadeOut(icon);
            console.log("doSomethingOk");
        }
   };
    //鼠标在图标栏
    icon.onmouseenter = function(e){

        console.log("ismouseenter");

        if(timer){ 
            clearTimeout(timer);
        }
    }
    //鼠标移开图标栏 
    icon.onmouseleave = function(){

        console.log("ismouseleave");

        if(timer){ 
            clearTimeout(timer);
        }
        timer = window.setTimeout(function(){fadeOut(icon);}, 6000);
    };

    //鼠标滚动 图标栏消失
    document.addEventListener('scroll', function(e){

        fadeOut(icon);
    });

    //渐出

    function fadeOut(el){
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    //渐入

    function fadeIn(el, display){
        el.style.opacity = 0;

        el.style.display = "block";

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }


    function typeInTextarea(newText, el = document.activeElement) {
        const start = el.selectionStart
        const end = el.selectionEnd
        const text = el.value
        const before = text.substring(0, start)
        const after = text.substring(end, text.length)
        el.value = (before + newText + after)
        el.selectionStart = el.selectionEnd = start + newText.length
        el.focus()
    }


    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }



    /*在新标签页中打开*/
/*    function open(url) {
        icon.style.display='none';
                var win;
            win = window.open(url);
        if (window.focus) {
            win.focus();
        }
       return win;
    }
*/
    //后台打开标签页
    function open(url) {
         try {
            if(GM_openInTab(url, { loadInBackground: true, insert: true, setParent :true })){
                //success info
               fadeOut(icon);
               console.log("doSomethingOk");

               } else{
               //fail info
               console.log("doSomethingNotOk");
               }
          } catch (error) {
               return GM_openInTab(url, { loadInBackground: true, insert: true, setParent :true });
          }
    }
})();