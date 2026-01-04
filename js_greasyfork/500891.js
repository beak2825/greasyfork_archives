// ==UserScript==
// @name         不合格数据记录
// @namespace    http://tampermonkey.net/
// @version      7-29
// @description  研思科技vegas平台不合格数据记录
// @author       ErikPan
// @match        https://label.vegas.100tal.com/annotation-detail/inspect-conversation-sort/Inspect/*
// @match        https://label.vegas.100tal.com/annotation-detail/inspect-conversation-rewrite/*
// @match        https://label.vegas.100tal.com/annotation-detail/low-code-template/Inspect/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100tal.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      feishu.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500891/%E4%B8%8D%E5%90%88%E6%A0%BC%E6%95%B0%E6%8D%AE%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500891/%E4%B8%8D%E5%90%88%E6%A0%BC%E6%95%B0%E6%8D%AE%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==


(function() {
    'use strict';
    setTimeout(()=>{

        class Message {
            constructor() {
                this.container = document.createElement('div');
                this.container.id = 'messageContainer';
                this.container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; z-index: 9999;';
                document.body.appendChild(this.container);
            }
            show(message, iconType) {
                const p = document.createElement('p');
                p.style.cssText = 'margin: 10px; padding: 10px; width: 150px; height: 70px; background-color: #f5f5f5; border-radius: 4px; display: flex; align-items: center;';
                let icon;
                if (iconType === 'tick') {
                    icon = document.createElement('span');
                    icon.style.cssText = 'width: 16px; height: 16px; background-color: green; border-radius: 50%; margin-right: 10px;';
                    const checkmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    checkmark.setAttribute("viewBox", "0 0 24 24");
                    checkmark.setAttribute("width", "16");
                    checkmark.setAttribute("height", "16");
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M9 16.2l-3.6-3.6c-.8-.8-.8-2 0-2.8s2-.8 2.8 0L9 11.6l6.2-6.2c.8-.8 2-.8 2.8 0s.8 2 0 2.8L11.8 16.2c-.4.4-.8.6-1.3.6-.5 0-.9-.2-1.3-.6z");
                    path.setAttribute("fill", "white");
                    checkmark.appendChild(path);
                    icon.appendChild(checkmark);
                } else {
                    icon = document.createElement('span');
                    icon.style.cssText = 'width: 16px; height: 16px; background-color: green; border-radius: 50%; margin-right: 10px;';
                }
                p.appendChild(icon);
                const text = document.createTextNode(message);
                p.appendChild(text);
                this.container.appendChild(p);
                setTimeout(() => {
                    this.container.removeChild(p);
                }, 3000);
            }
        }
        const message = new Message();
        let script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.async = true;
        document.head.appendChild(script);
        var button = document.createElement("button",{class : "control-btn"});
        button.innerText="生成记录"
        button.style.backgroundColor="#ff0404"
        button.style.borderRadius="10px"
        button.style.paddingTop="4px"
        button.style.paddingBottom="4px"
        document.head.appendChild(script);
        var controlArea = document.getElementsByClassName("right-control-area")[0];
        controlArea.appendChild(button)

        // 创建文本输入框
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "批次名称";
        input.style.borderRadius = "5px";
        input.style.padding = "4px";
        input.style.marginRight = "10px";
        input.style.width="300px"
        input.style.color="#000000"
        controlArea.insertBefore(input, controlArea.firstChild);


        button.addEventListener("click", function() {
            if (input.value.trim() === "") {
                alert("请输入批次名称");
            } else {
                html2canvas(document.body).then(function(canvas) {
                    //document.body.appendChild(canvas);
                    // const dataUrl = canvas.toDataURL("image/png")
                    // const link = document.createElement('a');
                    // link.download = 'screenshot.png';
                    // link.href = dataUrl;
                    // link.click();
                    // const binary = atob(dataUrl.split(',')[1]);
                    // const array = [];
                    // for (let i = 0; i < binary.length; i++) {
                    //     array.push(binary.charCodeAt(i));
                    // }
                    // const blob = new Blob(new Uint8Array(array),{ type: "image/png" });
                    canvas.toBlob((blob) => {
                        let key_list=document.getElementsByClassName("top-area")[0].innerText.split("-")
                        let data_id=parseInt(key_list[0])
                        let data_key=key_list[1]

                        const app_id = "cli_a6dda7c9cf38900d";
                        const app_secret = "sCqjPiRSv0eqywcrThVsXfHFYRrLza08";
                        const url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
                        const sheet_url="https://open.feishu.cn/open-apis/bitable/v1/apps/WoCmbek5za45BJsUDcjcsYdbnnd/tables/tbluJZR09ZQZnAk8/records"
                        let labeler=document.getElementsByClassName("un-modify-num")[0].innerText.split(":")[1].trim()
                        const payload = JSON.stringify({
                            "app_id": app_id,
                            "app_secret": app_secret
                        });

                        const headers = {
                            'Content-Type': 'application/json'
                        };
                        var batch_name=input.value.trim()
                        //get token
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: url,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            data: payload,
                            onload: function(response) {
                                console.log("请求成功");
                                const jsonData = JSON.parse(response.responseText);
                                //console.log(jsonData);
                                const tenant_access_token = jsonData.tenant_access_token;
                                //console.log(`Tenant Access Token: ${tenant_access_token}`);
                                //upload file
                                var uploadMetadata = new FormData();
                                uploadMetadata.append('file_name', `${data_key}.png`);
                                uploadMetadata.append('parent_type', 'bitable_image');
                                uploadMetadata.append('parent_node', 'WoCmbek5za45BJsUDcjcsYdbnnd');
                                uploadMetadata.append('size', `${blob.size}`);
                                uploadMetadata.append('file', blob);
                                console.log(blob.size);
                                // uploadMetadata=JSON.stringify(uploadMetadata)
                                console.log(uploadMetadata);
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: "https://open.feishu.cn/open-apis/drive/v1/medias/upload_all",
                                    headers: {
                                        // 'Content-Type': 'multipart/form-data; boundary=---7MA4YWxkTrZu0gW',
                                        'Authorization': `Bearer ${tenant_access_token}`,
                                    },
                                    data: uploadMetadata,
                                    onload: function(response) {

                                        if (response.status === 200) {
                                            const responseData = JSON.parse(response.responseText);
                                            let file_token=responseData.data.file_token
                                            //console.log(file_token);
                                            const now = new Date();
                                            let label_info=JSON.stringify({
                                                "fields": {
                                                    "ID": data_key,
                                                    "批次名称":batch_name,
                                                    "题号":`${data_id}`,
                                                    "标注员":labeler,
                                                    "链接":window.location.href,
                                                    "附件":[{"file_token":file_token}],
                                                }
                                            })

                                            GM_xmlhttpRequest({
                                                method: "POST",
                                                url: sheet_url,
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${tenant_access_token}`
                                                },
                                                data: label_info,
                                                onload: function(response) {

                                                    if (response.status === 200) {
                                                        const responseData = JSON.parse(response.responseText);
                                                        //console.log(responseData);
                                                        message.show('记录成功', 'tick');
                                                    } else {
                                                        console.error('Error:', response.status, response.statusText);
                                                        message.show('记录失败', 'null');
                                                    }
                                                },
                                                onerror: function(error) {
                                                    console.error('Request failed', error);
                                                }
                                            });

                                        } else {
                                            console.error('Error:', response);
                                        }
                                    },
                                    onerror: function(error) {
                                        console.error('Request failed', error);
                                    }
                                });

                            },
                            onerror: function(response) {
                                console.log("请求失败");
                                console.log(response);
                            }
                        })
                    })
                })
            }
        })


    },3000)

})();