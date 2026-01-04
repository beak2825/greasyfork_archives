// ==UserScript==
// @name         化学SFT助手
// @namespace    http://tampermonkey.net/
// @version      10-03-v1
// @description  研思科技
// @author       ErikPan
// @match        http://124.243.239.193:8081/markpage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=239.193
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      agent.tongji.edu.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511306/%E5%8C%96%E5%AD%A6SFT%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/511306/%E5%8C%96%E5%AD%A6SFT%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {



    'use strict';

    setTimeout(()=>{
        function generateButton() {
            setTimeout(()=>{
                const text_region = document.getElementsByClassName("ivu-input-type-textarea")[0]
                const button = document.createElement("button")
                button.innerText = "生成"
                button.style.width="50px"
                button.style.height="30px"
                // button.style.position = "relative"
                // button.style.top = "10px"
                // button.style.right = "10px"
                button.style.zIndex = "1000"
                const input_textarea=document.createElement("textarea")
                input_textarea.style.width="100%"
                input_textarea.style.height="80%"
                input_textarea.placeholder="输入查询内容"
                const div_wrapper=document.createElement("div")
                div_wrapper.style.width="100%"
                div_wrapper.style.marginTop="50px"
                div_wrapper.style.height="200px"
                // div_wrapper.style.border="1px solid #ccc"
                div_wrapper.appendChild(input_textarea)
                document.getElementsByClassName("tagItem_mark")[0].appendChild(div_wrapper)
                const result_region=document.createElement("p")
                result_region.style.textAlign = "left"
                result_region.style.userSelect = "text"
                document.getElementsByClassName("tagItem_mark")[0].appendChild(result_region)

                button.addEventListener("click", ()=>{
                    let input_text=input_textarea.value

                    let headers = {
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr-FR;q=0.5,fr;q=0.4',
                        'Connection': 'keep-alive',
                        'Content-Type': 'application/json',
                        'Origin': 'https://agent.tongji.edu.cn',
                        'Referer': 'https://agent.tongji.edu.cn/product/llm/chat/cruk8skphjdr82t7g7sg',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
                        'app-visitor-key': 'crm4hqpi0s64efv4l7ig',
                        'proxy_proxy_timeout': '300000',
                        'proxy_rewrite_path_reg': '/api/proxy/',
                        'proxy_rewrite_target': '/',
                        'proxy_target': 'llmops-app-server:6789',
                        'proxy_timeout': '300000',
                        'sec-ch-ua': '"Microsoft Edge";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'timeout': '300000',
                        'x-csrf-token': 'MhnsLrEg-c2CXe40qT1T1cWxQhypAd5gYgus',
                    }


                    // text_region.children[0].click()
                    var appKey="cruk8skphjdr82t7g7sg"
                    var query_data = {
                        "Query": input_text,
                        "AppConversationID": "cruv224phjdr82t7gc40",
                        "AppKey": appKey,
                    }
                    var query_conversation_data = {
                        "AppKey": appKey,
                    }
                    // var is_stream=true
                    console.log(query_data)
                    let res_text=""
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: 'http://agent.tongji.edu.cn/api/proxy/chat/v2/chat_query',
                        //url : "https://agent.tongji.edu.cn/api/proxy/chat/v2/create_conversation",
                        headers: headers,
                        data: JSON.stringify(query_data),
                        onload: function(response) {
                            try {
                                
                                const data_list = response.responseText.split("\n")
                                // const res_text=data.choices[0].message.content
                                for (const data of data_list) { 
                                    if (data.startsWith("data:data:")) {
                                        const res_json=JSON.parse(data.split("data:data:")[1])
                                        if (res_json.event=="message"){
                                            res_text+=res_json.answer
                                        }
                                }
                                console.log(res_text);
                                result_region.innerText=res_text
                            }
                            } catch (e) {
                                console.error('Error parsing response:', e);
                            }
                        },
                        onerror: function(error) {
                            console.error('Error:', error);
                        }
                    });
                    console.log(res_text)
                })
                div_wrapper.appendChild(button)
            },2000)
        }
        generateButton()
        const submitBtn = document.getElementsByClassName("submitBtn")[0];
        const bad_data=document.getElementsByClassName("badData")[0]
        const nextBtn=document.getElementsByClassName("nextData")[0]
        const prevBtn=document.getElementsByClassName("prevData")[0]
        const errorData=document.getElementsByClassName("errorData")[0]
        if (submitBtn) {
            submitBtn.addEventListener("click", generateButton, false);
        }
        if (bad_data) {
            bad_data.addEventListener("click", generateButton, false);
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", generateButton, false);
        }
        if (prevBtn) {
            prevBtn.addEventListener("click", generateButton, false);
        }
        if (errorData) {
            errorData.addEventListener("click", generateButton, false);
        }

    },2000);
})();
