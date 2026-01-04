// ==UserScript==
// @name        晋江作者专用-自动随机填充新章章名和内容，快捷键存稿 
// @namespace   RX
// @match       http://my.jjwxc.net/*
// @grant       none
// @version     1.1.3
// @author      RX
// @description 2021/9/5 下午7:37:26
// @downloadURL https://update.greasyfork.org/scripts/431947/%E6%99%8B%E6%B1%9F%E4%BD%9C%E8%80%85%E4%B8%93%E7%94%A8-%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E5%A1%AB%E5%85%85%E6%96%B0%E7%AB%A0%E7%AB%A0%E5%90%8D%E5%92%8C%E5%86%85%E5%AE%B9%EF%BC%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%AD%98%E7%A8%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/431947/%E6%99%8B%E6%B1%9F%E4%BD%9C%E8%80%85%E4%B8%93%E7%94%A8-%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E5%A1%AB%E5%85%85%E6%96%B0%E7%AB%A0%E7%AB%A0%E5%90%8D%E5%92%8C%E5%86%85%E5%AE%B9%EF%BC%8C%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%AD%98%E7%A8%BF.meta.js
// ==/UserScript==

(function() {
    function random_int (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

	  var address = '请自行输入文章的jsid';
     //请自行输入文章的jsid(在更新旧文界面的地址栏)
    if(window.location.href.includes(address)){
        var title1=document.getElementById('input_text');

        var content1=document.getElementById('chapterbody');		
        var num=random_int (0, 99999999);
        title1.setAttribute('value',num);
        content1.innerText=num;

        console.log('自动填写');
        var click1=document.getElementsByTagName('tbody')[9].children[5].children[1].children[2];
        if(click1){
           click1.click();
        }
        else{
            console.log('无验证码');
        }
        var savetobox=document.getElementById('db_click');
      
        document.onkeydown = function () {
            if (event.ctrlKey == true && event.keyCode == 81) {                
                savetobox.click(); 
                
            }
        }
    var auth_num_novel = document.getElementById("auth_num_novel");
        if(auth_num_novel){
            document.getElementById("auth_num_novel").focus();
        }
        else{
            console.log('无验证码输入框');
        }                
    }
    else{
        console.log('非合适网址');
    }
})();  
  
