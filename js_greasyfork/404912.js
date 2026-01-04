// ==UserScript==
// @name         浏览器工具—划词搜索
// @name:zh	 浏览器工具—划词搜索
// @version      2.1.0
// @namespace    http://tampermonkey.net/
// @description  划词搜索，默认默认自带百度搜索、Google搜索、微博搜索、百度翻译、豆瓣电影搜索、Chrome应用商店搜索引擎图标、默认自带复制、剪切、移除格式、新标签页打开链接功能图标。
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
// @downloadURL https://update.greasyfork.org/scripts/404912/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/404912/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2.meta.js
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
            name: '百度搜索',
            image: 'https://i.ibb.co/R9HMTyR/1-5.png',
            host: ['www.baidu.com'],
            popup: function (text) {
                open('https://www.baidu.com/s?wd=' + encodeURIComponent(text));
            }
        },
        {
            name: 'Google搜索',
            image: 'https://i.ibb.co/fxpm6Wc/image.png',
            host: ['www.google.co.jp'],
            popup: function (text) {
                open('https://www.google.co.jp/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '微博搜索',
            image: 'https://i.ibb.co/VC2HfBF/bnmabu2sfk4kus4dv6obkriqne-082bc03f376b8c0ffd7eff29bd9816871587215670-5-1-1.png',
            host: ['s.weibo.com'],
            popup: function (text) {
                open('https://s.weibo.com/weibo/' + encodeURIComponent(text));
            }
        },
        {
            name: '百度翻译',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAUsSURBVEhLxVdpbFRlFJ2YiFCRpSJQEDUxLijESGLcEiMxGDVxC4mJifhDEiEmKjGgqChaECibsiiKUimLFOLSFgSKsmglti7IIkgEClhDKyoW5s1bZt6b4znfm9dOh2moUuNNzmTmW+75vnvPve9NDBlrPBVgzFoPg+YkUDjdQp8ZiU6BfMnnmCoPjVaQYQMMcdmOJGLj4ygotjqVNIJ8yrc4xGWIG+OBGci34b+AuBTd2FiGQKfJXXDhdMHKIPyduyYftK7XNAs9XssfPXGJM3ZJnpxqs8Z6crMcyJF+C/ouaC6av2Cqhe4ZdKPjy19P4JZ3bRTNTJg12b7lQ5yxXFKhNx1fMS+BRz9yMXGThwc+cDCATopmJXDVfIJzQxbaGLbIxs0kGF7q4K5lDu5d4eBBrl3CPB78M8C49S4GcI/8ZfsXZyx7IIJuMKLMRv2JtBHCxp9TuJJkA+mkdEcK6/ansOGAj/I9Kazn3EZ+rz6QQvVBHwf+aFVuk5XGyFUOepMoN1XtEt+x1Ma+46GTyp9S5pbdpyZMBEpqPDP+4d4Uo+LgsQoXI8sdPL3ewzGKVdbspLH4uyRuZUT6zOggcRTqUQz1s9Ue7mf4dFuNd1VZTIrj7W+SaGgOcM9yG7GJFvoxFat2pwyp66dR8mUS/WdaOH/K6aRCC7Em5TiCRNP1VQvnvhJuztaCxNWH6+tPBOZmc7cnUfZDSOrzwvNrPSMgRS7akwtDLFKVTdEsnbwtioiLGKrCzLpoYwEPM5hC+4W3jghTQRoL65LmoLGXwwNL1YXGfx5iTQ5ZYMPy0jhKRwZ/BThEZR5jsT9R5ZobR5t1k9iLcTy8xoHnG96MpdFwMo2KfT5e2uzhvpUOrubhCqbEDUc2uSHuxcHBC3T6NHY1Bth5LMCepgCn3FDVkz4nMcMbEV7PMqo50spYvNXDzK/CVhiZxzyf5P44L6N0qK6VvjbEUYdSwfcrCSfUBFb/GObthU2u6TjD3rKx+VBIeIQRmUCFX8NI1TX4GPWxixsX2y17Imsm+UOrWVI8uDjaEEfk2cIaNJsqZZ3Knqt2TeOYV5vEk+tcDJzDDkXhSeF9SyyzRraW9R2bEGdu4xjBhvLG10ncucw2HS07VW2IsyHyS6nK8qwb9+TmLlR4lwyhxHUev/el8CLbUu/j9lIbo1nX41jTQxkNVUUuqdBhYuVYRJO3eLBNOpX/UAPt2e4mH7ctaZvbCP+I2KSB3Wv8Rg+PV7E3U7UjljpmjaxsJ0M9ngKcGA9BIeqhcVY31pjqUc1DQlOoVad6CBjj5VfsSnG/ZUroujdtIza1zIupF+3/VznuwRzL2VOfuqZ8irexhNiz1TAi2/+7j/e+T+IT9vDtRwMcpvKPx9MYXenSbzuqzkY+4u683fD3bdSydHaxxr/91UfNUR9b68M1sr2/BZjN9jmbNT3tC4/1H0IPElVJdtttl/gyEq+JiD8Lc6zwqr7lRGXUjb/7ZcopzVAvqmOOmVspX5AYhdxeL7RPPLe1jp9no9DGKMeaFxT+a1kykS2juM6ZfLqC8yEvsUj6s4vdvdzBMxs83ESRhN2tdY2+q/8O5ZtIZBVsIB0mzg1BBI2rN6tZqA5zy8EQ89Y3vBMSbzvs4xHmUunIXpcP8p33Za8jELH2DWS+9RSS4pX3M/nSvHnZa+/1tiOIyNWLw+fumf2IS/8qYubl+v94oVd+Wv7CGNnn33A2kE/5FkfLXxjzSdObxthKj+2tc8nlSz7H0LduGhrwN1fH/x1DJk9SAAAAAElFTkSuQmCC',
            host: ['fanyi.baidu.com'],
            popup: function (text) {
                open('https://fanyi.baidu.com/?aldtype=85&keyfrom=alading#auto/zh/' + encodeURIComponent(text));
            }
        },

        {
            name: '豆瓣电影',
            image: 'https://i.ibb.co/25jkbTm/afiQ73h.png',
            host: ['www.douban.com'],
            popup: function (text) {
                open('https://search.douban.com/movie/subject_search?search_text=' + encodeURIComponent(text) + '&cat=1002');
            }
        },

        {
            name: 'chrome网上应用商店',
            image: 'https://i.ibb.co/kxj5RXP/v7JqRKd.png',
//            image: 'https://i.ibb.co/xqNGyXL/icons8-chrome-512-1.png',
            host: ['chrome.google.com'],
            popup: function (text) {
                open('https://chrome.google.com/webstore/search/' + encodeURIComponent(text) + '?utm_source=chrome-ntp-icon');
            }
        },

        {
            name: '复制',
            image: 'https://i.ibb.co/nPT0yN9/icons8-copy-96-2.png',
            host: [''],
            popup: function (selText) {
                if (selText == null) {
                    selText = document.defaultView.getSelection().toString();
                }

                try {
                    //这里拷贝到剪切板 图标栏消失
                    if(document.execCommand('copy', false, null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }
                    return GM_setClipboard(selText, "text");
                } catch (error) {
                    return document.execCommand('copy', false, null);
                }
            }
        },
{
            name: '剪切',
            image: 'https://i.ibb.co/pbq8Pzr/icons8-cut-96-2.png',
            host: [''],
            popup: function (text) {
                text = document.defaultView.getSelection().toString();

                try {
                    //这里
                    if(document.execCommand("Cut", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return document.execCommand("Cut", "false", null);
                }
            }
        },
        {
           name: '移除格式',
           image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
           host: [''],
           popup: function (text) {
               text = document.defaultView.getSelection().toString();

               try {
                    //这里
                    if(document.execCommand("removeFormat", "false", null)){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return document.execCommand("removeFormat", "false", null);
                }
            }
        },
     {
            name: '新标签页打开链接',
            image: 'https://i.ibb.co/vxp3BJB/TWYjpqg.png',
            host: [''],
            popup: function (text) {
                if(text.indexOf("http://")==0||text.indexOf("https://")==0||text.indexOf("chrome://")==0)

                {
                 try {
                    //这里
                    if(GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return GM_openInTab(text, { loadInBackground: true, insert: true, setParent :true });
                }
               }

               else
               {
                try {

                    if(GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true })){
                         //success info
                         //icon.style.display = 'none';
                         fadeOut(icon);
                         console.log("doSomethingOk");
                     } else{
                         //fail info
                         console.log("doSomethingNotOk");
                     }

                } catch (error) {
                    return GM_openInTab("http://"+text, { loadInBackground: true, insert: true, setParent :true });
                }
               }
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
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY +15 + 'px';//设置文字下方距离
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';

            fadeIn(icon);

            clearTimeout(timer);

            timer = window.setTimeout(TimeOutHide, 6000);

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
    //鼠标在图标栏 清除定时器 不自动关闭
    icon.onmouseenter = function(e){

        console.log("ismouseenter");

        if(timer){ 
            clearTimeout(timer);
        }
    }
    //鼠标移开图标栏 清除定时器 自动关闭
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

    // fade out 渐出

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

    // fade in 渐入

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



    /**在新标签页中打开*/
/*    function open(url) {

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