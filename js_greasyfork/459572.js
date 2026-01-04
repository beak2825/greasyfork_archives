// ==UserScript==
// @name         当前标签内弹窗搜索
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  在当前页面打开弹窗进行搜索。目前使用场景是有的页面有切换浏览器标签监控，这个插件或许可以帮助你。
// @author       mydiv
// @match         *://www.baidu.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459572/%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E5%86%85%E5%BC%B9%E7%AA%97%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459572/%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E5%86%85%E5%BC%B9%E7%AA%97%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    var searchBoxList = [] ; // 记录打开的搜索框。
    // 加载入口按钮
    function initButton(){
        var now = new Date().getTime();
        var body = document.querySelector('body');
        var mydiv = document.createElement('div');
        var html = "<div>•••</div>";
        mydiv.innerHTML = html;
        mydiv.style = "position: fixed;right: 0;top: 0;z-index: 100000;padding:5px;cursor:pointer;";
        mydiv.id = 'mydiv_'+now;
        body.append(mydiv);
        mydiv.addEventListener('click', function (e) {
            addSearchBox()
        });
    }
    // 添加弹窗
    function addSearchBox(){
        var now = new Date().getTime();
        var w = 600,h = 600;
        var myiframe = document.createElement('iframe');
        var mydiv = document.createElement('div');
        var body = document.querySelector('body');
        myiframe.width = '100%';
        myiframe.height = '100%';
        myiframe.src = 'https://m.so.com/';
        myiframe.style = 'display:block;';
        myiframe.id = 'myiframe_'+now;
        var html = "<div id='drag_"+now+"' draggable='true' style='padding:5px;cursor:move;text-align: left;'>拖动标题可以改变位置</div>"
        +"<span id='home_"+now+"' style='position:absolute;top:5px;left:48%;cursor:pointer;'>回到首页</span>"
        + "<span id='close_"+now+"' style='position:absolute;right:50px;top:0;cursor:pointer;width:22px;height:22px;'>"
        +'<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"><path d="M511.878001 1023.989c-62.999385 0-124.098788-11.699886-181.698225-34.999658-55.699456-22.49978-105.798967-54.499468-148.798547-95.599067-43.099579-40.9996-76.899249-88.899132-100.599018-142.198611-24.59976-55.29946-36.999639-114.098886-36.999639-174.698294 0-76.79925 20.699798-152.498511 59.899415-219.197859 37.799631-64.099374 92.299099-119.098837 157.498462-158.598451 14.699856-8.999912 33.899669-4.299958 42.899581 10.499897 8.999912 14.699856 4.299958 33.899669-10.499897 42.899581-56.399449 34.199666-103.498989 81.599203-136.19867 137.098661-33.599672 56.999443-51.1995 121.798811-51.1995 187.39817 0 102.498999 41.99959 199.098056 118.298845 271.697347 76.699251 73.099286 178.798254 113.298894 287.497192 113.298893s210.797941-40.299606 287.497193-113.298893c76.299255-72.799289 118.298845-169.198348 118.298844-271.797346 0-130.298728-68.699329-250.797551-183.798205-322.296852-14.599857-9.099911-19.099813-28.299724-9.999902-42.99958 9.099911-14.599857 28.299724-19.099813 42.99958-9.999903 64.099374 39.799611 117.498853 94.599076 154.59849 158.398453 38.399625 66.099354 58.699427 140.998623 58.699427 217.09788 0 60.599408-12.499878 119.398834-36.999639 174.698294-23.699769 53.299479-57.499438 101.199012-100.599017 142.198612-42.99958 40.899601-93.099091 73.099286-148.798547 95.599066-57.799436 23.099774-118.998838 34.79966-181.998223 34.79966zM511.878001 506.394055c-17.199832 0-31.199695-13.899864-31.199695-31.199696v-443.995664c0-17.199832 13.899864-31.199695 31.199695-31.199695 17.199832 0 31.199695 13.899864 31.199696 31.199695v443.895665c0.099999 17.199832-13.999863 31.299694-31.199696 31.299695z" p-id="43139"></path></svg>'
        +"</span>"
        + "<span id='min_"+now+"' style='position:absolute;right:25px;top:0;cursor:pointer;width:22px;height:22px;'>"
        +'<svg class="icon" style="width: 100%;height: 100%;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"><path d="M889.5 852.7l-220-219.9c45-53.4 72.1-122.3 72.1-197.5 0-169.4-137.8-307.3-307.3-307.3S127.1 265.8 127.1 435.3s137.8 307.3 307.3 307.3c76.1 0 145.7-27.8 199.4-73.8l219.8 219.8c4.9 5 11.4 7.4 17.9 7.4s13-2.5 17.9-7.4c10-9.9 10-26 0.1-35.9zM434.4 691.8c-141.4 0-256.5-115.1-256.5-256.5 0-141.5 115.1-256.5 256.5-256.5s256.5 115.1 256.5 256.5-115.1 256.5-256.5 256.5zM555 418.3H304.7c-14 0-25.4 11.4-25.4 25.4s11.4 25.4 25.4 25.4H555c14 0 25.4-11.4 25.4-25.4S569 418.3 555 418.3z" p-id="3545"></path></svg>'
        +"</span>"
        + "<span id='max_"+now+"' style='position:absolute;right:0;top:0;cursor:pointer;width:22px;height:22px;'>"
        +'<svg class="icon" style="width: 100%;height: 100%;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"><path d="M889.5 852.7l-220-219.9c45-53.4 72.1-122.3 72.1-197.5 0-169.4-137.8-307.3-307.3-307.3S127.1 265.8 127.1 435.3s137.8 307.3 307.3 307.3c76.1 0 145.7-27.8 199.4-73.8l219.8 219.8c4.9 5 11.4 7.4 17.9 7.4s13-2.5 17.9-7.4c10-9.9 10-26 0.1-35.9zM434.4 691.8c-141.4 0-256.5-115.1-256.5-256.5 0-141.5 115.1-256.5 256.5-256.5s256.5 115.1 256.5 256.5-115.1 256.5-256.5 256.5zM555 418.3h-99.8v-99.8c0-14-11.4-25.4-25.4-25.4s-25.4 11.4-25.4 25.4v99.8h-99.8c-14 0-25.4 11.4-25.4 25.4s11.4 25.4 25.4 25.4h99.8v99.8c0 14 11.4 25.4 25.4 25.4s25.4-11.4 25.4-25.4v-99.8H555c14 0 25.4-11.4 25.4-25.4S569 418.3 555 418.3z" p-id="4302"></path></svg>'
        +"</span>"
        + "<span id='resize_"+now+"' draggable='true' style='cursor: all-scroll;position: absolute;right: 0;bottom: 0;background: white;width:22px;height:22px;'>"
        + '<svg class="icon" style="width: 100%;height: 100%;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024"><path d="M896 128a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H128a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h768z m-128 384h-85.333333v128h-128v85.333333h213.333333v-213.333333z m-298.666667-213.333333H256v213.333333h85.333333V384h128V298.666667z" p-id="1937"></path></svg>';
        +'</sapn>';
        mydiv.innerHTML = html;
        mydiv.style = "width:"+w+"px;height:"+h+"px;position: fixed;box-shadow: 0px 0px 11px 1px rgb(102 102 102 / 21%);overflow:hidden;left:0;top:0;z-index:10000000;background:white;color:black;";
        mydiv.id = 'mydiv_'+now;
        mydiv.append(myiframe);
        body.append(mydiv);
        searchBoxList.push(now);
        var dragdom = document.querySelector('#drag_'+now);
        var mydivdom = document.querySelector('#mydiv_'+now);
        var resizedom = document.querySelector('#resize_'+now);
        var mindom = document.querySelector('#min_'+now);
        var maxdom = document.querySelector('#max_'+now);
        var closedom = document.querySelector('#close_'+now);
        var homedom = document.querySelector('#home_'+now);
        var myiframedom = document.querySelector('#myiframe_'+now);
        var draggeInfo = {
            beforX: 0, beforY: 0, afterX: 0, afterY: 0
        };
        dragdom.addEventListener('dragstart', function (e) {
            draggeInfo.beforX = e.clientX;
            draggeInfo.beforY = e.clientY;
        });
        dragdom.addEventListener('dragend', function (e) {
            var Y = e.clientY >= 0 ? e.clientY : 20;
            draggeInfo.afterX += e.clientX - draggeInfo.beforX;
            draggeInfo.afterY += Y - draggeInfo.beforY;
            mydivdom.style.left = draggeInfo.afterX + 'px';
            mydivdom.style.top = draggeInfo.afterY + 'px';
        });
        var resizeInfo = {
            beforX: 0, beforY: 0, moveX: 0, moveY: 0
        };
        resizedom.addEventListener('dragstart', function (e) {
            resizeInfo.beforX = e.clientX;
            resizeInfo.beforY = e.clientY;
        });
        resizedom.addEventListener('dragend', function (e) {
            resizeInfo.moveX = e.clientX - resizeInfo.beforX;
            resizeInfo.moveY = e.clientY - resizeInfo.beforY;
            w += resizeInfo.moveX;
            h += resizeInfo.moveY;
            mydivdom.style.width = w + 'px';
            mydivdom.style.height = h + 'px';
        });
        mindom.addEventListener('click', function (e) {
            mydivdom.style.opacity='0.5';
            var transform='translate('+Number(Number('-'+e.clientX)- 10)+'px, '+Number(window.innerHeight - e.clientY- 10)+'px)';
            mydivdom.style.transform = transform;
        });
        maxdom.addEventListener('click', function (e) {
            mydivdom.style.opacity='1';
            mydivdom.style.transform = 'translate(0,0)';
        });
        closedom.addEventListener('click', function (e) {
            mydivdom.remove();
        });
        homedom.addEventListener('click', function (e) {
            myiframedom.src = 'https://m.so.com/';
        });
    }
    function init(){
        initButton();
    }
    init()
})();