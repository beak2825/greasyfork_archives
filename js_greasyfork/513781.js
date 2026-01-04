// ==UserScript==
// @name         hpScript1
// @namespace    1972482376@qq.com
// @version      2024-10-23
// @description  json转换
// @author       You
// @license      MIT liHpscript 
// @match        https://dev-cp-hp.zhongkegx.com/Main/authHome
// @match        https://dev-cp-hp.zhongkegx.com/MainShouYin
// @match        https://dev-cp-hp.zhongkegx.com/Main
// @match        https://dev-cp-hp.zhongkegx.com/MainShouYin/
// @match        http://localhost:8086/MainShouYin/
// @match        http://localhost:8085/MainYunYing/authHome
// @match        http://localhost:8086/
// @match        https://dev-cp-hp.zhongkegx.com/MainShouYin/auth/ShouYinTai/QieHuan
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhongkegx.com
// @grant        none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/513781/hpScript1.user.js
// @updateURL https://update.greasyfork.org/scripts/513781/hpScript1.meta.js
// ==/UserScript==
 // MIT li
(function() {
    'use strict';
    window.addEventListener('load', function() {
        let url=window.location.href
        let btn = document.createElement("button");
        let btnJson = document.createElement("button");
        let guanbiBtn = document.createElement("button");
        let divBox = document.createElement("div");
        let jsonFormBox = document.createElement("div");
        if(url=='https://dev-cp-hp.zhongkegx.com/MainShouYin' || url=='https://dev-cp-hp.zhongkegx.com/MainShouYin/' || url=='https://dev-cp-hp.zhongkegx.com/Main'||url=='https://dev-cp-hp.zhongkegx.com/Main/'){
            let loginBtn= document.querySelectorAll('input')    
            if(loginBtn[0].value==''&& loginBtn[1].value==''){
                btn.innerHTML ="登录";
                btn.style.width='350px'
                btn.style.height='35px'
                btn.style.position='fixed'
                btn.style.top='180px'
                btn.style.left='800px'
                btn.style.zIndex='100'
                btn.onclick = function () {
                loginBtn[0].value='zhongkehp'
                loginBtn[1].value='66666'
                // 创造事件
                var event = document.createEvent('HTMLEvents');
                event.initEvent("input", true, true);
                event.eventType = 'message';
                // 调度事件
                loginBtn[0].dispatchEvent(event);
                loginBtn[1].dispatchEvent(event);
                let btnClick=document.querySelector('.zhu-r .btn')
                btnClick.click();
                };
              document.body.append(btn);
            }
            setTimeout(()=>{
                btn.remove()
            },5000)
        }
     document.addEventListener("keyup", function(event) {
        if(event.key=='j'||event.key=='J'){
        btnJson.innerHTML='JSON'
        guanbiBtn.innerHTML='关闭'
        guanbiBtn.style.width='80px'
        guanbiBtn.style.height='35px'
        guanbiBtn.style.position='fixed'
        guanbiBtn.style.top='0'
        guanbiBtn.style.left='80px'
        guanbiBtn.style.zIndex='100'
        btnJson.style.width='80px'
        btnJson.style.height='35px'
        btnJson.style.position='fixed'
        btnJson.style.top='0'
        btnJson.style.left='0'
        btnJson.style.zIndex='100'
        document.body.append(btnJson);
        document.body.append(guanbiBtn);
        }
        if(event.key=='`'){
            removeFun()
        }
    });
    guanbiBtn.addEventListener('click',function(){
        removeFun()
    })
     btnJson.addEventListener('click', function () {
        divBox.innerHTML=`
        <textarea id="story" name="story" rows="9" cols="28"></textarea>
        <button style='margin:10px auto;' id="TiJiao">提交</button>
        `
        divBox.style.width='220px'
        divBox.style.height='200px'
        divBox.style.backgroundColor='white'
        divBox.style.boxShadow='0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'
        divBox.style.position='fixed'
        divBox.style.top='35px'
        divBox.style.left='0'
        divBox.style.zIndex='100'
        document.body.append(divBox);
        let tijiaoBtn=document.getElementById('TiJiao')
        let textareaJson=document.getElementById('story')
        tijiaoBtn.onclick=function(){
            let jsonData=textareaJson.value
            var jsonStr=jsonData.replace(new RegExp('\\"',"gm"), '"' );
            jsonFormBox.innerHTML= `
                    <textarea readonly style='font-size:14px;font-family: sans-serif;'  id="jsonTextarea" name="story" rows="40" cols="60"></textarea>
            `
            jsonFormBox.style.position='fixed'
            jsonFormBox.style.top='0'
            jsonFormBox.style.left='220px'
            jsonFormBox.style.zIndex='100'
            document.body.append(jsonFormBox);
            let jsonTextareaData=document.querySelector('#jsonTextarea')
            let jsonStrTextarea=JSON.parse(JSON.parse(jsonStr))
            jsonTextareaData.value= JSON.stringify(jsonStrTextarea, null, "\t")
        }
     })


     function removeFun(){
        btnJson.remove()
        divBox.remove()
        guanbiBtn.remove()
        jsonFormBox.remove()
    }
      });


    // Your code here...
})();