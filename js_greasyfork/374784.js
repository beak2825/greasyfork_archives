// ==UserScript==
// @name         百度文库打印
// @namespace    http://cesium.xin/
// @version      0.1.4
// @description  打印时，文档被最大化(右上方最大按钮点击)，此时需要调整一下打印参数，更多>>边距>>自定义,调整一下上下左右距离，以达到最好的效果，可以运行pdf转word 转换等功能的网站 https://smallpdf.com/
// @author       You
// require       http://fonts.googleapis.com/css?family=Open+Sans:300,400
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        http://wenku.baidu.com/*
// @match        https://wenku.baidu.com/*
// @grant        none
// @grant        GM_addStyle
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @note         1.点击 prepare print 按钮之后，除文档内容之外的其余元素会移除，
// @note         2.打印时，文档被最大化(右上方最大按钮点击)，此时需要调整一下打印参数，更多>>边距>>自定义,调整一下上下左右距离，以达到最好的效果
// @note         参考了 詹eko 百度文库（wenku）在线下载PDF格式文件 的部分代码https://greasyfork.org/zh-CN/scripts/373334-%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93-wenku-%E5%9C%A8%E7%BA%BF%E4%B8%8B%E8%BD%BDpdf%E6%A0%BC%E5%BC%8F%E6%96%87%E4%BB%B6
// @downloadURL https://update.greasyfork.org/scripts/374784/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/374784/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==
var $ = window.jQuery;
$(document).ready(function(){
    'use strict';
    $("head").append (
        '<link '
        + 'href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" '
        + 'rel="stylesheet" type="text/css">'
    );

    var content = $('.reader-wrap')[0];

    let divEle = document.getElementById('hqdiv');
    if(!divEle){
        var para = document.createElement("div");
        para.innerHTML = '<div style="position:fixed;left:10px;top:80px;width:50%;height:100px;z-index:999;" id="hqdiv"></div>';
        document.body.appendChild(para);
        $("#hqdiv").append('<ul id="hq-nav-bar" />');
    }

    //添加子节点
    $("#hq-nav-bar").append('<li class="level-one" id="hqprint"><i class="fa fa-print"></i><ul class="level-two"><li>打印文档</li></ul></li> ');

    document.getElementById("hqprint").onclick = function() {
        //删除兄弟节点,删除父节点的兄弟节点
        removeBrother(content);
        //点击全屏按钮
        //document.getElementsByClassName('top-right-fullScreen')[0].click();
        //去掉浮动导航栏
        document.getElementsByClassName('topbar-container')[0].remove();
        //document.getElementsByClassName('wk-other-new-cntent')[0].remove();

        $(".read-all").click();

        $.fn.extend({remove: function(){return false;}});
        let height = document.body.scrollHeight;
        let htemp=0;
        var time = window.setInterval(function(){
            $(window).scrollTop(htemp);
            htemp=htemp+700;
            height = document.body.scrollHeight;
            if (htemp>height) {
                window.clearInterval(time);
                window.setTimeout(function(){
                    //修改下样式
                    $(".top-right-fullScreen").click();
                    $('.reader-page').css({border: 0});
                    $('.reader-container').css({border: 0});

                    $(".try-end-fold-page")[0].remove();
                    window.print();
                }, 3000)
            }
        }, 500);
    };

    function removeBrother(elm) {
        if (elm === null || elm.parentNode === null || elm === document.body) {
            return;
        }
        var p = elm.parentNode.children;
        for (var i = 0, pl = p.length; i < pl; i++) {
            if(p[i] !== elm && p[i].tagName.toLowerCase() !== "script"){
                p[i].innerHTML = "";
            }
        }
        removeBrother(elm.parentNode);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
#hq-nav-bar {
  max-width: 50px;
  border: 1px solid #19A97B;
  border-radius: 4%;
  background-color: white;
  -webkit-box-shadow: -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
  -moz-box-shadow:    -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
  box-shadow:         -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
  }
  #hq-nav-bar>li {
  color: white;
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.75em;
  list-style: none;
  }
  #hq-nav-bar>li.level-one {
  font-size: 1.5em;
  text-align: center;
  border-top: 1px solid #19A97B;
  cursor: pointer;
  }
  #hq-nav-bar>li.level-one:first-child {
  border-top: none;
  }
  #hq-nav-bar>li.level-one:hover {
  background: rgba(255,255,255,1);
  background: -moz-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
  background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,255,255,1)), color-stop(47%, rgba(246,246,246,1)), color-stop(100%, rgba(233,238,242,1)));
  background: -webkit-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
  background: -o-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
  background: -ms-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
  background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#e9eef2', GradientType=0 );
  }
  #hq-nav-bar>li.selected {
  background: #3f8eb9;
  -webkit-box-shadow: inset 1px 1px 10px 1px rgba(0,0,0,0.45);
  -moz-box-shadow: inset 1px 1px 10px 1px rgba(0,0,0,0.45);
  box-shadow: inset 1px 1px 10px 1px rgba(0,0,0,0.45);
  }
  #hq-nav-bar>li>i {
  color: #19A97B;
  margin: 25%;
  }
  .level-one {
  position: relative;
  }
  .level-two {
  display: none;
  position: absolute;
  height: 50px;
  width: 100px;
  background: #19A97B;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.65em;
  text-align: center;
  }

  .level-two:after {
  content: '';
  position: absolute;
  border-style: solid;
  border-width: 9px 9px 9px 0;
  border-color: transparent  #19A97B;
  display: block;
  width: 0;
  z-index: 1;
  left: -9px;
  top: 15px;
  }

  .level-two li {
  margin: 15px;
  }

  .level-one:hover > .level-two {
  display: block;
  }

  .level-two {
  left: 130%;
  top: 0;
  }
`);
});
