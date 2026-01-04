// ==UserScript==
// @icon        
// @name        累我网课助手 
// @match       *://lovol.21tb.com/*
// @match       *://v4.21tb.com/*
// @version     1.0.3
// @author      eEasy
// @description 累我网课助手脚本
// @namespace eEasy
// @downloadURL https://update.greasyfork.org/scripts/418822/%E7%B4%AF%E6%88%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418822/%E7%B4%AF%E6%88%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
  
      var oldClass = {
          monitor:function () {
              var body =document.getElementsByTagName('body')[0].innerHTML; 
              if(body.indexOf("item-no cl-catalog-playing")!=-1){
                console.log("当前视频未完成,继续等待……");
              }else{
                if(body.indexOf("item-no\">")!=-1){
                    console.log("当前视频已完成,刷新开始下一个视频");
                    window.location.reload();
                }else{
                  console.log("课程已完成");
                  // 取消定时器
                  clearInterval(oldClass_timer);
                  
                  var courseEvaluation = document.querySelector("#courseInfoSteps > ul > li.cs-menu-item.cs-item-evaluate > a");
                  if(null!=courseEvaluation){
                    var nextStage = document.querySelector("#goNextStep > a");
                    if(null!=nextStage){
                      nextStage.click();
                    }
      
      
                    var star5 = document.querySelector("body > article > div > div.cs-test-head.cs-evaluate-head > div > p.cs-eval-score > input:nth-child(9)")
                     if(null!=star5){
                      star5.click();
                    }
                    
                
                    var a = document.querySelector("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(1) > div:nth-child(2) > p.cs-option-cell > span");
                    if(null!=a){
                      a.click();
                    }
                    var b = document.querySelector("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(2) > div:nth-child(2) > p.cs-option-cell > span");
                    if(null!=b){
                      b.click();
                    }
                    var c = document.querySelector("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(3) > div:nth-child(2) > p.cs-option-cell > span");
                    if(null!=c){
                      c.click();
                    }
                    var d = document.querySelector("#courseEvaluateForm > div:nth-child(2) > ul > li:nth-child(4) > div:nth-child(2) > p.cs-option-cell > span");
                    if(null!=d){
                      d.click();
                    }

                    var txt = document.querySelector("#courseEvaluateForm > div:nth-child(3) > ul > li > div > textarea");
                    if(null!=txt){
                      txt.value = "课程很棒, 我会再看5遍的!";
                    }
                    
                    var submit = document.querySelector("#courseEvaluateSubmit");
                    if(null!=submit){
                      submit.click();
                      submit = document.querySelector("#layui-layer1 > div.layui-layer-btn > a.layui-layer-btn1");
                      if(null!=submit){
                        submit.click();
                      }
                    }

                  }
                }
              
              }
          }
      };
  
      var newClass = {
          monitor:function () {
              let doms = document.getElementById('aliPlayerFrame').contentWindow.document.getElementsByClassName('next-button');
              if(!doms.length){
                  console.log('当前视频未完成,继续等待……')
                  return
              }
              doms[0].click();
          }
      };
  
      var oldClass_timer = self.setInterval(oldClass.monitor,1000*20);
      var newClass_timer = self.setInterval(newClass.monitor,1000*20);

})();
