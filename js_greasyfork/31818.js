// ==UserScript==
// @name         3n5b图片放大
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  通过修改style实现漫画图片放大
// @author       1049918689@qq.com
// @include      https://www.3n5b.com/t/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31818/3n5b%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/31818/3n5b%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==
/*
function addCSS(cssText){
    var style = document.createElement('style'),  //创建一个style元素
        head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
    style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
    if(style.styleSheet){ //IE
        var func = function(){
            try{ //防止IE中stylesheet数量超过限制而发生错误
                style.styleSheet.cssText = cssText;
            }catch(e){

            }
        }
        //如果当前styleSheet还不能用，则放到异步中则行
        if(style.styleSheet.disabled){
            setTimeout(func,10);
        }else{
            func();
        }
    }else{ //w3c
        //w3c浏览器中只要创建文本节点插入到style元素中就行了
        var textNode = document.createTextNode(cssText);
        style.appendChild(textNode);
    }
    head.appendChild(style); //把创建的style元素插入到head中
    return style;
}
*/

var css;
var zoom = false;
var btn = $("<button class='widget-button btn create no-text btn-icon'></button>");
var zoom_icon = $("<i class='fa fa-search-plus d-icon'></i>");
var min_icon = $("<i class='fa fa-search-minus d-icon'></i>");

btn.click(function(){
    if(zoom){
        css.remove();
        btn.empty();
        btn.append(zoom_icon);
    }else{
        css = GM_addStyle('.cooked img:not(.emoji){height: auto; width: 100%;}');
        btn.empty();
        btn.append(min_icon);
    }
    zoom = !zoom;
});

btn.append(zoom_icon);
$(".timeline-footer-controls").append(btn);
