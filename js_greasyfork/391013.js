// ==UserScript==
// @name 快捷键
// @namespace @mars
// @match *://*/*
// @grant none
// @description 测试
// @version 0.0.1.20191011071159
// @downloadURL https://update.greasyfork.org/scripts/391013/%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/391013/%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

document.body.addEventListener('keydown',function(e){
      console.log(e.keyCode);    
  
    let keys=[
      {
        keyName:"F1",
        keyCode:112,
        func:()=>{
            window.open("http://home.site");
        }
      },
      {
        title:"本地采集系统",
        keyName:"F2",        
        keyCode:113,
        func:()=>{
            window.open("http://localhost:3000/#/app/monitoringSys");
        }
      },
      {
        title:"采集系统bug列表",
        keyName:"F3",        
        keyCode:114,
        func:()=>{
            window.open("http://192.168.1.229:81/zentao/project-bug-8-status,id_desc-0-bySearch-myQueryID.html");
        }
      }
    ]
    
    keys.forEach((item)=>{
      if(e.keyCode===item.keyCode)
        {
          item.func&&item.func();
        }
    });
  
 // e.preventDefault(); //阻止默认行为,会有兼容问题        
  
});