// ==UserScript==
// @name         上学吧查答案获取工具，综合搜索，可查询大部分问题。
// @namespace    zkn521
// @version      1.1
// @description  上学吧问题快捷跳转到查答案网站去查答案，点击页面左侧图标按钮，即可快速跳转。能查询大多数问题。
// @author       zkn521
// @icon         https://www.shangxueba.com/favicon.ico
// @match        http://www.shangxueba.com/*
// @match        https://www.shangxueba.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465790/%E4%B8%8A%E5%AD%A6%E5%90%A7%E6%9F%A5%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%8C%E7%BB%BC%E5%90%88%E6%90%9C%E7%B4%A2%EF%BC%8C%E5%8F%AF%E6%9F%A5%E8%AF%A2%E5%A4%A7%E9%83%A8%E5%88%86%E9%97%AE%E9%A2%98%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/465790/%E4%B8%8A%E5%AD%A6%E5%90%A7%E6%9F%A5%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7%EF%BC%8C%E7%BB%BC%E5%90%88%E6%90%9C%E7%B4%A2%EF%BC%8C%E5%8F%AF%E6%9F%A5%E8%AF%A2%E5%A4%A7%E9%83%A8%E5%88%86%E9%97%AE%E9%A2%98%E3%80%82.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    $("head").append (
        '<link '
        + 'href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" '
        + 'rel="stylesheet" type="text/css">'
    );
    var content = document.getElementById('reader-container-inner-1');
 
    let divEle = document.getElementById('hqdiv');
    if(!divEle){
        var para = document.createElement("div");
        para.innerHTML = '<div style="position:fixed;left:60px;top:240px;width:55px;z-index:999;" id="hqdiv"></div>';
        document.body.appendChild(para);
        $("#hqdiv").append('<ul id="hq-nav-bar" />');
    }
 
    $("#hq-nav-bar").append('<li class="level-one" id="hqdownload"><i class="fa fa-arrow-circle-down"></i><ul class="level-two"><li>搜索答案</li></ul></li>');
 
 
 
    var tit=document.title;
    tit=tit.replace(" - 上学吧找答案","");
    tit=tit.replace(" - 上学吧继续教育考试","");
    tit=tit.replace("（）","");
    tit=tit.replace("（)","");
 
    var wturl='http://www.shangxueba365.com/?q='
    document.getElementById("hqdownload").onclick = function() {
        let newurl = wturl + tit;
        window.open(newurl);
    };
 
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
  border: 1px solid #f2951c;
  border-radius: 4%;
  background-color: white;
  -webkit-box-shadow: -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
  -moz-box-shadow:    -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
  box-shadow:         -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
  border-radius: 25px;
  }
  #hq-nav-bar>li {
  color: white;
  margin: 0;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.75em;
  list-style: none;
  border-radius: 25px;
  }
  #hq-nav-bar>li.level-one {
  font-size: 1.5em;
  text-align: center;
  border-top: 1px solid #f2951c;
  cursor: pointer;
  border-radius: 25px;
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
  color: #f2951c;
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
  background: #f2951c;
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
  border-color: transparent  #f2951c;
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
})();