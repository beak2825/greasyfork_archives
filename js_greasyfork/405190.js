// ==UserScript==
// @name         南大教务网默认好评
// @namespace    
// @version      0.1
// @description  给南大教务网的教学评价默认好评
// @author       LadderOperator
// @include      *://elite.nju.edu.cn/jiaowu/student/evalcourse/courseEval.do?method=currentEvalCourse
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405190/%E5%8D%97%E5%A4%A7%E6%95%99%E5%8A%A1%E7%BD%91%E9%BB%98%E8%AE%A4%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/405190/%E5%8D%97%E5%A4%A7%E6%95%99%E5%8A%A1%E7%BD%91%E9%BB%98%E8%AE%A4%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

var getAll
var getMulRadio
var getQuesRadio
var stateCheck = true

setInterval(fillForm, 100);

function fillForm() {
  stateCheck = true
  getAll = document.querySelectorAll("#tbEvalItem form input[type^='radio']")
  getAll.forEach(function(e){
    if (e.checked === true){
      stateCheck = false
    }
  })

  if (stateCheck === true){

    getQuesRadio = document.querySelectorAll("#tbEvalItem form input[name^='ques'][value^='5']")
    getMulRadio = document.querySelectorAll("#tbEvalItem form input[name^='mul'][value^='0']")
    
    getQuesRadio.forEach(function(f){
      f.checked = true
    })
    
    getMulRadio.forEach(function(f){
      f.checked = true
    })

  }



}


