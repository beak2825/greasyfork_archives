// ==UserScript==
// @name         中研企课程习题自动作答
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动选择答案，解放自我
// @author       obt
// @match        https://ent.toujianyun.com/exercise/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476260/%E4%B8%AD%E7%A0%94%E4%BC%81%E8%AF%BE%E7%A8%8B%E4%B9%A0%E9%A2%98%E8%87%AA%E5%8A%A8%E4%BD%9C%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/476260/%E4%B8%AD%E7%A0%94%E4%BC%81%E8%AF%BE%E7%A8%8B%E4%B9%A0%E9%A2%98%E8%87%AA%E5%8A%A8%E4%BD%9C%E7%AD%94.meta.js
// ==/UserScript==
 
 
 
(function () {
  var examid = location.pathname.split('/')[2]
  var userid = document.getElementsByClassName('user-avatar')[0].src.split("/").pop()
 
  function a() {
    return new Promise((resolve, reject) => {
      var suju;
      $.get('https://ent.toujianyun.com/exercise/' + examid + '?userid='+userid, function(data, textStatus) {
        var suju = data.msg;
        resolve(suju);
      });
      return suju;
    });
 
 
  }
 
 
  async function answerQuestion() {
    console.log('3秒后输出请求返回结果')
    let res = await a();
    console.log(res)
    var list = document.getElementsByClassName("question-title")
    var listlegth = list.length
    for(let a = 0;a<listlegth;a++){
    	for(let b = 0;b<res.length;b++){
      	if(list[a].textContent.indexOf(res[b]['title'])>0){
          for(let c = 0;c<res[b].answer.length;c++){
          	document.getElementsByClassName('question-content question-option question-option-hover')[a].getElementsByTagName('input')[res[b].answer[c]].click()
          }
        	
        
        
        }
      
      }
      
 
  }
  }
  //调用测试
  answerQuestion()
  
  
  
})();