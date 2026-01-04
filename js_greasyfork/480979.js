
// ==UserScript==
// @name         中国干部网络学院秒看视频、自动提交等。
// @namespace    zzy
// @version      0.5
// @description  贵州省党员干部网络学院秒看视频
// @author       zzy
// @match        *https://cela.e-celap.com/dsfa/nc/pc/course/views/*
// @icon         https://gzwy.gov.cn/dsfa/gzgb.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480979/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E7%A7%92%E7%9C%8B%E8%A7%86%E9%A2%91%E3%80%81%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E7%AD%89%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/480979/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E7%A7%92%E7%9C%8B%E8%A7%86%E9%A2%91%E3%80%81%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E7%AD%89%E3%80%82.meta.js
// ==/UserScript==
 
(function () {
  //'use strict';
  window.onload = function () {
    let kcArr = [];
    let count = 10;
    let ivlId = "";
    let submitJg = 100;
    window.onblur = function () {
  
    }
    function PrefixInteger(num, length) {
      return (Array(length).join('0') + num).slice(-length);
    }
    function initCourse(){
      let liArr = $(".courseContent li");
      for(let i=0;i<liArr.length;i++){
        let data = JSON.parse($(liArr[i]).attr("data-item"));
        if(Number(data.wcjd.replace("%",''))<100){
          data["circle"] = "circle" + PrefixInteger(i,3);
          kcArr.push(data);
        }
      }
    }
    function saveProcess(sourceUrl,params,name,circle){
      ivlId = setInterval(() => {
        dsf.http
          .request(sourceUrl, params, "POST")
          .done(function (res) {
            if (res.success) {
              $("#" + circle).attr("data-percent", parseInt(Number(res.kjjd)));
              $("#" + circle).circleProgress({
                obj: circle,
                innerColor: "#FF6A00",
                size: 40,
                radius: 16,
                textY: 24,
                textX: 12,
              });
              dsf.layer.message("当前进度：" + res.kjjd+"%", 1);
              if(res.kjjd == "100"){
                kcArr.shift();
                clearInterval(ivlId);
                dsf.layer.message(`提交${name}完成！`, 1);
                startTask();
              }
            }
            
          })
          .error(function (err) {
          })
          .always(function () { })
          .exec();
      }, submitJg);
      
    }
    function startTask(){
      if(kcArr.length){
        let item = kcArr[0];
        dsf.layer.message("开始提交：" + item.name, 1);
        let sourceUrl = dsf.url.getWebPath("nc/xxgl/xxjl/addXxjlByKczj");
        let sumTime = item.sc;
        let courseid = item.kcid;
        let timeSpan = $("video")[0].duration;
        let params = {
          relid: item["id"],
          bigtimespan: sumTime,
          timespan: sumTime, //当前课程已经播放的时间,
          pass: "1",
          sumtime: timeSpan,
          everytime: 10,
          courseid: courseid,
        };
        saveProcess(sourceUrl,params,item.name,item.circle);
      }else{
        dsf.layer.message("全部提交完成！", 1);
      }
    }
      var $div = $(`
      <div style="z-index:10022;position:fixed;top:50px;right:20px;padding:10px;background:aliceblue">
      <div class="jsdiv" id="jsdiv1" style="padding:5px;">
        <span>开始</span>
      </div>
      <div class="jsdiv" id="jsdiv2" style="margin-top:10px;padding:5px;">
        <span>停止</span>
      </div>
      </div>
      <div style="z-index:10022;position:fixed;top:150px;right:0px;padding:0px;background: aquamarine;">
        <span>有问题请反馈</span>
      </div>
    `);
  
    var $style = `
      <style type="text/css">
      .jsdiv:{
        background: aqua;
      }
      .jsdiv:hover{
        background:#fff;
        cursor: pointer;
      }
      </style>
    `
    
    
    $('body').append($div);
    $('head').append($style);
    var jsdiv1 = document.getElementById("jsdiv1");
    var jsdiv2 = document.getElementById("jsdiv2");
    jsdiv1.addEventListener("click", function () {
      initCourse()
      startTask();
    })
    jsdiv2.addEventListener("click", function () {
      clearInterval(ivlId);
    })
  }
})();

