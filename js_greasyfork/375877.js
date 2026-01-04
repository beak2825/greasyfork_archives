// ==UserScript==
// @name         BackToTheTop
// @namespace    https://github.com/AchooLuv/Back-To-The-Top
// @icon         http://store.steampowered.com/favicon.ico
// @version      1.1
// @description  Steam全站回到顶部脚本(原生JavaScript)!
// @author       AchooLuv
// @include      http*://steamcommunity.com/*
// @include      http*://store.steampowered.com/*
// @grant        none
//downloadURL	 https://github.com/AchooLuv/Back-To-The-Top/blob/master/backToTheTop.user.js
//updateURL	     https://github.com/AchooLuv/Back-To-The-Top/blob/master/backToTheTop.user.js
// @downloadURL https://update.greasyfork.org/scripts/375877/BackToTheTop.user.js
// @updateURL https://update.greasyfork.org/scripts/375877/BackToTheTop.meta.js
// ==/UserScript==

(function _bTT() {
    'use strict';
    var eventObject = {
        addOnload: function (fn) {
            if (fn == null) {
                fn = document;
            }
            var oldOnload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = fn;
            } else {
                window.onload = function () {
                    oldOnload();
                    fn();
                };
            }
        },
        addHander: function (ele, type, hander) {
            if (ele.addEventListerner) {
                ele.addEventListerner(type, hander, false);
            } else if (ele.attachEvent) {
                ele.attachEvent('on' + type, hander);
            } else {
                ele['on' + type] = hander;
            }
        }
    };

    function toTop() {
        var timer = null,
            isTop = true,
            clientHeight = document.documentElement.clientHeight || document.clientHeight,
            targetTag = document.getElementById('global_header'),
            _style = document.createElement('style'),
            _i = document.createElement('i'),
            _top = document.createElement('a'),
            head = document.head || document.getElementByTagName("head")[0] || document.documentElement,
            link = document.createElement("link");

        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css");
        link.setAttribute("charset", "utf-8");
        head.appendChild(link);
        _style.innerHTML = `
        @font-face {
            font-family: 'iconfont';  /* project id 1046153 */
            src: url('//at.alicdn.com/t/font_1046153_2dm8186tys1.eot');
            src: url('//at.alicdn.com/t/font_1046153_2dm8186tys1.eot?#iefix') format('embedded-opentype'),
            url('//at.alicdn.com/t/font_1046153_2dm8186tys1.woff2') format('woff2'),
            url('//at.alicdn.com/t/font_1046153_2dm8186tys1.woff') format('woff'),
            url('//at.alicdn.com/t/font_1046153_2dm8186tys1.ttf') format('truetype'),
            url('//at.alicdn.com/t/font_1046153_2dm8186tys1.svg#iconfont') format('svg');
          }
        .iconfont{
        font-family:"iconfont" !important;
        font-size:40px;font-style:normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;}`;
        document.body.insertBefore(_style, document.body.firstElementChild);
        _i.classList.add("iconfont");
        _i.style.cssText = 'display:block;width:100%;height:100%;color:#e5f4fc;';
        _i.innerHTML = '&#xe602;';
        _top.appendChild(_i);
        _top.classList.add("animated");
        _top.setAttribute('href', 'javascript:;');
        _top.style.cssText = 'position:fixed;bottom:8%;right:20%;display:none;width:50px;height:50px;overflow:hidden;z-index:9999;';
        targetTag.appendChild(_top);

        eventObject.addHander(window, 'scroll', function () {
            var _aTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (_aTop >= clientHeight) {
                _top.style.display = 'block'
                _top.classList.add('zoomIn')
            } else {
                _top.classList.remove('zoomIn')
                _top.classList.add('fadeOutUp')
            }
            if (!isTop) {
                clearInterval(timer);
            }
            isTop = false;
        });

        eventObject.addHander(_top, 'click', function () {
            timer = setInterval(function () {
                var _aTop = document.documentElement.scrollTop || document.body.scrollTop,
                    speed = Math.floor(-_aTop / 50);
                document.documentElement.scrollTop = document.body.scrollTop = _aTop + speed;
                isTop = true;
                if (_aTop == 0) {
                    clearInterval(timer);
                }
            });
        }, 50);
    }
    eventObject.addOnload(toTop);
})();