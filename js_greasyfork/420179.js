// ==UserScript==
// @name        New script - 125.46.98.226:8004
// @namespace   Violentmonkey Scripts
// @match       http://125.46.98.226:8004/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @connect vagrantup.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @version     1.1
// @author      -
// @description 2021/1/13 下午11:28:28
// @downloadURL https://update.greasyfork.org/scripts/420179/New%20script%20-%201254698226%3A8004.user.js
// @updateURL https://update.greasyfork.org/scripts/420179/New%20script%20-%201254698226%3A8004.meta.js
// ==/UserScript==

(function(){
  'use strict';

  //console.log("这是我的内容");
  //console.log($);
  console.log($.fn.jquery);
  
  
  //console.log(window.top.document);
  var doc = $(window.top.document);
  //console.log(doc.find("body"));
  var bdy = doc.find("html");
  var divStr=`
    <div id="myjsdiv" style='position:fixed;left:10px;top:10px;background-color:gray;border:2px solid black;padding:10px;'>
      <button style="width:100px">测试</button>
    </div> 
  `
  bdy.append(divStr);
  /*bdy.find("#myjsdiv").append(`
    <input type="text" id="my_exam_course" name="my_exam_course" style="width:100px" value="scala"/><br/>
  `);*/
  console.log("开始测试了");
  
  
  //console.log(bdy.find("#myjsdiv"));
  
  bdy.find("#myjsdiv button").click(function(){
    console.log(bdy.find("#my_exam_course"));
    //获取课程名字
    //var txtCourse = bdy.find("#my_exam_course");
    //var courseName=txtCourse[0].value;
    //console.log(courseName);
    //if(!courseName) return;
    var res = GM_getValue("data");
    console.log(res); 
    if(!res) return; 

    //将数据填充到Map中
    var courseMap = new Map();
    for(var c of res){
      let jian = Object.keys(c);
      courseMap.set(jian[0],c[jian[0]]);
      //courseMap.set()
      //console.log(Object.keys(c));
    }
    console.log(courseMap); 
     
     var subdoc=$(window.document);
     var subbdy = subdoc.find("body");
     //console.log(subbdy)
     var trs = subbdy.find("tr:gt(2)");
     for(var tr of trs){
       var name = tr.childNodes[2].innerHTML.trim().replace("<br>","");
       var pscj = tr.childNodes[5].childNodes[0];
       var qmcj = tr.childNodes[7].childNodes[0];
       var jncj = tr.childNodes[8].childNodes[0];
       console.log(name,pscj.value,qmcj.value,jncj.value)
       var cobj = courseMap.get(name);
       if(cobj){
        pscj.value=cobj[0];
        qmcj.value=cobj[1];
        jncj.value=cobj[2];
       }
       
     }
  })
})()