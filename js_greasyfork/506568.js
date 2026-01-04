// ==UserScript==
// @name         阿拉伯语插件
// @namespace    http://tampermonkey.net/
// @version      2024-09-03-v1
// @description  研思科技
// @author       ErikPan
// @match        http://124.243.239.193:8081/markpage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=239.193
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      ark.cn-beijing.volces.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506568/%E9%98%BF%E6%8B%89%E4%BC%AF%E8%AF%AD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/506568/%E9%98%BF%E6%8B%89%E4%BC%AF%E8%AF%AD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        const role_text="你是一个阿拉伯语翻译成中文的专家，所以你必须完成下面的翻译修改任务"
        const url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
        const apiKey = "c4d9ab16-95fb-497e-857c-7cad196ccfea";

        const endpointId_4k = "ep-20240802141543-shmbg";
        const endpointId_4k_lite = "ep-20240802133823-9xhm7";
        const input_list=document.getElementsByClassName("input-content")
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          };
        const query=input_list[0].children[0].innerText

          var body = JSON.stringify({
            model: endpointId_4k,
            messages: [
                  {role: "system", content: role_text},
                {role: "user", content: `${query} ,1.帮我修改这个句子，删掉其中的字数限制，其他不改变 2.并在下一行翻译成中文`},
            ],
            stream: false
          });

          GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: body,
            onload: function(response) {
              try {

                const data = JSON.parse(response.responseText)
                const res_text=data.choices[0].message.content
                console.log(res_text);
                const box0=input_list[0]
                var div0 = document.createElement('div', "div0");
                div0.innerText=res_text
                box0.appendChild(div0)

              } catch (e) {
                console.error('Error parsing response:', e);
              }
            },
            onerror: function(error) {
              console.error('Error:', error);
            }
          });




        const res1=input_list[1].children[0].innerText

           body = JSON.stringify({
            model: endpointId_4k_lite,
            messages: [
                  {role: "system", content: role_text},
                {role: "user", content: `把下面这段阿拉伯语翻译成中文${res1} 注意只需要翻译 不需要回答问题`},
            ],
            stream: false
          });
          GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: headers,
            data: body,
            onload: function(response) {
              try {

                const data = JSON.parse(response.responseText)
                const res_text=data.choices[0].message.content
                console.log(res_text);
                const box1=input_list[1]
                var div1 = document.createElement('div', "div1");
                div1.innerText=res_text
                box1.appendChild(div1)

              } catch (e) {
                console.error('Error parsing response:', e);
              }
            },
            onerror: function(error) {
              console.error('Error:', error);
            }
          });

       

    },1000
)

function traslate(){
  const role_text="你是一个阿拉伯语翻译成中文的专家，肩负着中国和阿拉伯国家之间文化交流的重任，所以你必须完成下面的翻译修改任务"
  const url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  const apiKey = "c4d9ab16-95fb-497e-857c-7cad196ccfea";
  const endpointId_4k = "ep-20240802141543-shmbg";
  const endpointId_4k_lite = "ep-20240802133823-9xhm7";
  const input_list=document.getElementsByClassName("input-content")
  const div0=input_list[0].children[2]
  const div1=input_list[1].children[2]
  div0.innerHTML=""
  div1.innerHTML=""
  setTimeout(()=>{

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      };
    const query=input_list[0].children[0].innerText


      var body = JSON.stringify({
        model: endpointId_4k,
        messages: [
              {role: "system", content: role_text},
            {role: "user", content: `${query} ,1.帮我修改这个句子，删掉其中的字数限制，其他不改变 2.并在下一行翻译成中文`},
        ],
        stream: false
      });

      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: body,
        onload: function(response) {
          try {

            const data = JSON.parse(response.responseText)
            const res_text=data.choices[0].message.content
            div0.innerText=res_text
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        },
        onerror: function(error) {
          console.error('Error:', error);
        }
      });

    const res1=input_list[1].children[0].innerText

       body = JSON.stringify({
        model: endpointId_4k_lite,
        messages: [
              {role: "system", content: role_text},
            {role: "user", content: `把下面这段阿拉伯语翻译成中文${res1} 注意只需要翻译 不需要回答问题`},
        ],
        stream: false
      });
      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: body,
        onload: function(response) {
          try {

            const data = JSON.parse(response.responseText)
            const res_text=data.choices[0].message.content
            div1.innerText=res_text

          } catch (e) {
            console.error('Error parsing response:', e);
          }
        },
        onerror: function(error) {
          console.error('Error:', error);
        }
      });

     


},2000
)
}
const submitBtn = document.getElementsByClassName("submitBtn")[0];
const bad_data=document.getElementsByClassName("badData")[0]
const nextBtn=document.getElementsByClassName("nextData")[0]
const prevBtn=document.getElementsByClassName("prevData")[0]
const errorData=document.getElementsByClassName("errorData")[0]
if (submitBtn) {
    submitBtn.addEventListener("click", traslate, false);
}
if (bad_data) {
  bad_data.addEventListener("click", traslate, false);
}
if (nextBtn) {
  nextBtn.addEventListener("click", traslate, false);
}
if (prevBtn) {
  prevBtn.addEventListener("click", traslate, false);
}
if (errorData) {
  errorData.addEventListener("click", traslate, false);
}

})();
