// ==UserScript==
// @name         南台科大科技英文自動答題(測試)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  南台科大科技英文自動答題
// @author       ThanatosDi
// @match        http://ilearning.csie.stust.edu.tw/EST/Member/Test/PSO.aspx
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/374045/%E5%8D%97%E5%8F%B0%E7%A7%91%E5%A4%A7%E7%A7%91%E6%8A%80%E8%8B%B1%E6%96%87%E8%87%AA%E5%8B%95%E7%AD%94%E9%A1%8C%28%E6%B8%AC%E8%A9%A6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374045/%E5%8D%97%E5%8F%B0%E7%A7%91%E5%A4%A7%E7%A7%91%E6%8A%80%E8%8B%B1%E6%96%87%E8%87%AA%E5%8B%95%E7%AD%94%E9%A1%8C%28%E6%B8%AC%E8%A9%A6%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
    main();
})();

function main(){
    var list = document.getElementById('ContentPlaceHolder1_RadioButtonList1');
    var chose = list.getElementsByTagName('input');
    var random_answer = answer();
    console.log(random_answer);
    for(var a=0;a<chose.length;a++){
        if(random_answer==1){
            console.log('T');
            if(chose[a]["value"]=="True"){
                chose[a].checked='True';
            }
            //document.getElementById('ContentPlaceHolder1_Button3').click();
        }else{
            console.log('F');
            if(chose[a]["value"]=="False"){
                chose[a].checked='True';
            }
        }
    }
    sleep(Math.floor((Math.random() * 10000) + 15000));
    document.getElementById('ContentPlaceHolder1_Button3').click();
}

function answer(){
    /*for(var a=0;a<document.getElementById('ContentPlaceHolder1_TextBox1').value;a++){
        var value = Array();
        value[a] = Math.floor((Math.random() * 2) + 1);
        console.log(value);
    }*/
    return Math.floor((Math.random() * 2) + 1);
}

function sleep(ms) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > ms){
      break;
    }
  }
}