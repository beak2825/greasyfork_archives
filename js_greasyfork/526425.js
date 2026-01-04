// ==UserScript==
// @name         威胁情报小助手
// @namespace    安全人员威胁情报小助手 (Updated by wwwab)
// @version      1.1.0
// @description  安全人员小助手,安全人员必备的工具
// @author       huoji,wwwab
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_download
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526425/%E5%A8%81%E8%83%81%E6%83%85%E6%8A%A5%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526425/%E5%A8%81%E8%83%81%E6%83%85%E6%8A%A5%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const GPT_CONFIG = {
        api_url: "https://api.openai.com/v1/chat/completions",
        model: "gpt-3.5-turbo",
    }

    const buttonsData = [
        { id: "copy-button", text: "复制到剪切板", visible: true },
        { id: "use-chatgpt", text: "使用大语言模型进行介绍", visible: true },
        { id: "use-chatgpt-translate", text: "使用大语言模型进行翻译", visible: true },
        { id: "send-to-tip-button", text: "KSN OpenTip API 一键云查 (推荐)", visible: true },
        { id: "tip-search-button", text: "在Kaspersky OpenTip中打开", visible: true },
        { id: "vt-search-button", text: "在VirusTotal中打开", visible: true },
        { id: "meta-search-button", text: "在MetaDefender中打开", visible: true },
        { id: "wb-search-button", text: "在ThreatBook中打开", visible: true },
        { id: "qax-search-button", text: "在奇安信威胁情报中心中打开", visible: true },
        { id: "triage-search-button", text: "在Triage中打开", visible: true },
        { id: "mb-search-button", text: "在MalwareBazaar中打开", visible: true },
        { id: "download-from-triage", text: "从Triage下载", visible: true },
        { id: "download-from-virusshare", text: "从VirusShare下载", visible: true },
        { id: "download-from-malwarebazaar", text: "从MalwareBazaar下载", visible: true },
        { id: "change-ksn-key-button", text: "修改KSN API Key", visible: true },
        { id: "change-triage-key-button", text: "修改Triage API Key", visible: true },
        { id: "change-virusshare-key-button", text: "修改VirusShare API Key", visible: true },
        { id: "change-malwarebazaar-key-button", text: "修改MalwareBazaar API Key", visible: true },
        { id: "change-chatgpt-apikey", text: "修改OpenAI API Key", visible: true },
        { id: "enable-chatgpt", text: "激活GPT模式", visible: true },
    ];

    const md5Pattern = /^[a-f0-9]{32}$/i;
    const sha1Pattern = /^[a-f0-9]{40}$/i;
    const sha256Pattern = /^[a-f0-9]{64}$/i;
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const domainPattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/i;

    const customContextMenu = document.createElement('div');
    customContextMenu.id = 'huoji_tip_custom-context-menu';
    customContextMenu.style.display = 'none';
    customContextMenu.style.position = 'fixed';
    customContextMenu.style.zIndex = '10000';
    customContextMenu.style.backgroundColor = '#f8f9fa';
    customContextMenu.style.border = '1px solid #ced4da';
    customContextMenu.style.padding = '5px';
    customContextMenu.style.borderRadius = '0.25rem';
    customContextMenu.style.boxShadow = '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)';

    const buttonStyle = `
        style = "
            display: block;
            width: 100%;
            padding: 3px 20px;
            margin-bottom: 2px;
            font-size: 14px;
            border: none;
            color: #212529;
            background-color: transparent;
            text-align: left;
            cursor: pointer;
            text-decoration: none;
        "
    `;

    let visibleButtonIds = buttonsData
        .filter(button => button.visible) // 过滤出启用的按钮
        .map(button => button.id); // 提取按钮的id

    customContextMenu.innerHTML = buttonsData
        .filter(button => button.visible) // 过滤掉不启用的按钮
        .map(button => `<button id="${button.id}" ${buttonStyle}>${button.text}</button>`)
        .join('');
    
    document.body.appendChild(customContextMenu);

    let TempElement = document.createElement('Temp');  // 用于为不启用的按钮容错,不要append到body,也不要删除
    const buttons = {};
    buttonsData.forEach(button => {
        if (button.visible) {
            let buttonElement = document.getElementById(button.id);
            buttons[button.id] = buttonElement;
        } else {
            buttons[button.id] = TempElement;
        }
    });

    if (GM_getValue("enableGPT") == undefined) {
        GM_setValue("enableGPT", false);
    }

    if (GM_getValue("enableGPT")) {
        buttons["enable-chatgpt"].innerHTML = "关闭GPT模式";
    } else {
        buttons["enable-chatgpt"].innerHTML = "激活GPT模式";
    }

    // 添加悬停高亮效果
    buttonsData.forEach(button => {
        if (button.visible) {
            let btn = document.getElementById(button.id);
            btn.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#f0ffff';
                this.style.border = '#66ccff solid 1px';
            });
            btn.addEventListener('mouseout', function () {
                this.style.backgroundColor = 'transparent';
                this.style.border = 'transparent';
            });
        }
    });

    document.body.appendChild(customContextMenu);


    // 创建加载动画
    let loader = document.createElement("div");
    loader.id = "huoji_tip_loader";
    loader.style.display = "none";
    loader.style.borderRadius = "50%";
    loader.style.animation = "spin 2s linear infinite";
    loader.style.border = "8px solid #f3f3f3"; // 减小边框大小
    loader.style.borderTop = "8px solid #3498db"; // 顶部边框保持颜色，但大小减半
    loader.style.width = "60px"; // 宽度减半
    loader.style.height = "60px"; // 高度减半

    document.body.appendChild(loader);

    // 添加CSS动画
    let style = document.createElement("style");
    style.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    document.head.appendChild(style);

    function showLoad(ifshow, e) {
        let loader = document.getElementById("huoji_tip_loader");
        if (ifshow) {
            loader.style.position = "fixed";
            loader.style.left = e.clientX + "px"; // 使用鼠标点击时的坐标
            loader.style.top = e.clientY + "px";
            loader.style.display = "block";
            loader.style.zIndex = "9999";
        } else {
            loader.style.display = "none";
        }
    }

    function FileKSNResult (text, result) {
        let zone = result.zone;
        let hitscount = result.hitscount;
        let firstseen = result.firstseen;
        let size = result.size;
        let type = result.type;
        let lastseen = result.lastseen;
        let detections = result.detections;
        let signer = result.signer;
        let packer = result.packer;
        switch (zone) {
            case "Green":
                let message1 = `文件\: ${text}.${type}\nKSNzone\: ${zone} (文件中暂未发现威胁)\n流行度\: ${hitscount.toString()}\n首次发现时间\: ${firstseen}\n文件大小\: ${size}字节\n最后发现时间\: ${lastseen}\n数字签名\: ${signer}\n壳\: ${packer}\n检测到的威胁\: \n${detections}`;
                alert(message1);
                GM_notification({
                    title: 'KSN Result: Safe (Green)',
                    text: message1,
                }, function() {
                    GM_setClipboard(message1);
                    GM_log(message1);
                    // 回调函数，通知被用户关闭时调用
                });
                break;
            case "Yellow":
                let message2 = `文件\: ${text}.${type}\nKSNzone\: ${zone} (文件可能包含广告软件或其他类别文件)\n流行度\: ${hitscount.toString()}\n首次发现时间\: ${firstseen}\n文件大小\: ${size}字节\n最后发现时间\: ${lastseen}\n数字签名\: ${signer}\n壳\: ${packer}\n检测到的威胁\: \n${detections}`;
                alert(message2);
                GM_notification({
                    title: 'KSN Result: Unwanted (Yellow)',
                    text: message2,
                }, function() {
                    GM_setClipboard(message2);
                    GM_log(message2);
                    // 回调函数，通知被用户关闭时调用
                });
                break;
            case "Grey":
                let message3 = `文件\: ${text}.${type}\nKSNzone\: ${zone} (文件安全性未知)\n流行度\: ${hitscount.toString()}\n首次发现时间\: ${firstseen}\n文件大小\: ${size}字节\n最后发现时间\: ${lastseen}\n数字签名\: ${signer}\n壳\: ${packer}\n检测到的威胁\: \n${detections}`;
                alert(message3);
                GM_notification({
                    title: 'KSN Result: Unknown (Grey)',
                    text: message3,
                }, function() {
                    GM_setClipboard(message3);
                    GM_log(message3);
                    // 回调函数，通知被用户关闭时调用
                });
                break;
            case "Red":
                let message4 = `文件\: ${text}.${type}\nKSNzone\: ${zone} (文件中可能包含已知的恶意代码)\n流行度\: ${hitscount.toString()}\n首次发现时间\: ${firstseen}\n文件大小\: ${size}字节\n最后发现时间\: ${lastseen}\n数字签名\: ${signer}\n壳\: ${packer}\n检测到的威胁\: \n${detections}`;
                alert(message4);
                GM_notification({
                    title: 'KSN Result: Malware (Red)',
                    text: message4,
                }, function() {
                    GM_setClipboard(message4);
                    GM_log(message4);
                    // 回调函数，通知被用户关闭时调用
                });
                break;
        }
    }

    function PushMsgToGPT (text, thePrompt, e) {
        if (GM_getValue("enableGPT") == false) {
            alert("GPT模式没有开启,请刷新页面");
            return;
        }

        let apiKey = GM_getValue("gpt_apiKey");
        if (!apiKey) {
            alert("没有设置OpenAI API密钥,请设置后再试");
            return;
        }

        if (text.length <= 0) {
            alert("没有选中需要介绍的段落");
            return;
        }
        showLoad(true, e);
        GM_xmlhttpRequest({
            method: "POST",
            url: GPT_CONFIG.api_url,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                model: GPT_CONFIG.model,
            },
            data: JSON.stringify({
                model: GPT_CONFIG.model,
                messages: [
                    {
                        role: "system",
                        content:
                            "From now on, you are an assistant of a senior Safety engineer. You have mastered many skills and techniques related to network security. You are proficient in assembly and reverse. Your responsibility is to help the questioner analyze the function of code, explain the purpose of code, guess code and analyze code",
                    },
                    {
                        role: "user",
                        // 使用谢谢能bypass一些GPT的道德伦理限制
                        content:
                            thePrompt
                            +
                            text,
                    },
                ],
            }),
            onload: function (response) {
                showLoad(false, e);
                if (response.status === 200) {
                    let result = JSON.parse(response.responseText);
                    if ("choices" in result) {
                        let answer = result.choices[0].message.content;
                        alert(answer);
                        GM_notification({
                            title: `来自${GPT_CONFIG.model}的信`,
                            text: answer,
                        }, function() {
                            GM_setClipboard(answer);
                            GM_log(answer);
                            // 回调函数，通知被用户关闭时调用
                        });
                    }
                } else {
                    alert("大语言模型API服务器异常,请确认网络连通性以及密钥是否正确...");
                    GM_log(`[Error]${response.status} ${response.statusText}`);
                }
            },
        });
        document.getElementById(
            "huoji_tip_custom-context-menu"
        ).style.display = "none"; // 关闭菜单
    }

    function downloadFromTriage (text, e) {
        apikeyoobe("triage_apiKey", "Triage API");
        if (!GM_getValue("triage_apiKey")) {
            alert("没有设置Triage API密钥,请设置后再试");
            return;
        }
        let url1 = null;
        if (md5Pattern.test(text)) {
            url1 = `https://tria.ge/api/v0/search?query=md5%3A${text}`;
        } else if (sha1Pattern.test(text)) {
            url1 = `https://tria.ge/api/v0/search?query=sha1%3A${text}`;
        } else if (sha256Pattern.test(text)) {
            url1 = `https://tria.ge/api/v0/search?query=sha256%3A${text}`;
        } else {
            alert("请输入正确的样本Hash值");
            return;
        }
        showLoad(true, e);
        GM_xmlhttpRequest({
            method: "GET",
            url: url1,
            headers: {
                Authorization: `Bearer ${GM_getValue("triage_apiKey")}`,
                "Content-Type": "application/json",
            },
            onload: function (response) {
                if (response.status === 200) {
                    let result = JSON.parse(response.responseText);
                    if ("data" in result) {
                        let sampleID = null;
                        result.data.forEach(i => {
                            if ((i.kind == "file") && (i.id)) {
                                sampleID = i.id;
                            }
                        });
                        if (sampleID) {
                            GM_notification({
                                title: "Triage下载",
                                text: "即将开始下载,请稍作等待,Triage下载速度可能较慢,请不要关闭当前网页/标签页...",
                            });
                            let url2 = `https://tria.ge/api/v0/samples/${sampleID}/sample`;
                            GM_download({
                                url: url2,
                                name: `${text}.file`,
                                saveAs: true,
                                headers: {
                                    Authorization: `Bearer ${GM_getValue("triage_apiKey")}`,
                                },
                                onload: function (response) {
                                    showLoad(false, e);
                                },
                            });
                        }
                    } else {
                        alert("没有找到样本");
                    }
                } else {
                    alert("Triage API服务异常,请确认网络连通性以及密钥是否正确...");
                    GM_log(`[Error]${response.status} ${response.statusText}`);
                }
            },
        });
    }

    function downloadFromMB(sha256, e) {
        apikeyoobe("malwarebazaar_apiKey", "MalwareBazaar API");
        if (!GM_getValue("malwarebazaar_apiKey")) {
            alert("没有设置MalwareBazaar API密钥,请设置后再试");
            return;
        }
        if (!sha256Pattern.test(sha256)) {
            return;
        }
        let url = "https://mb-api.abuse.ch/api/v1/";
        GM_notification({
            title: "MalwareBazaar下载",
            text: "即将开始下载,请稍作等待,请不要关闭当前网页/标签页...",
        });
        showLoad(true, e);
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            responseType: "arraybuffer",
            headers: {
                "Auth-Key": GM_getValue("malwarebazaar_apiKey"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: `query=get_file&sha256_hash=${sha256}`,
            onload: function (response) {
                showLoad(false, e);
                if (response.status === 200) {
                    GM_notification({
                        title: "MalwareBazaar下载",
                        text: "Post成功,请查看下载",
                    });
                    let blob = new Blob([response.response], { type: "application/x-zip" });
                    let url0 = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.href = url0;
                    a.download = `${sha256}.zip`;
                    a.click();
                    window.URL.revokeObjectURL(url0);
                } else {
                    alert("MalwareBazaar API服务异常,请确认网络连通性以及密钥是否正确...");
                    GM_log(`[Error]${response.status} ${response.statusText}`);
                }
            },
        });
    }

    let ksnQueryCache = {};
    let stopDisVisible = false;

    function apikeyoobe(apiKey_ValueName, title) {
        let apiKey = GM_getValue(apiKey_ValueName);
        if (!apiKey) {
            apiKey = prompt(
                `第一次使用需要填写${title}密钥, 请输入您的${title}密钥:`,
                ""
            );
            if (apiKey == null) {
                return;
            }
            GM_setValue(apiKey_ValueName, apiKey);
        }
    }

    function toggleButtonDisplay(buttonElement, condition) {
        if (buttonElement) {
            if (Array.isArray(buttonElement)) {
                buttonElement.forEach(btn => {
                    if (btn) {
                        btn.style.display = condition ? "block" : "none";
                    }
                });
            } else {
                buttonElement.style.display = condition ? "block" : "none";
            }
        }
    }

    function showMenu (text, e) {
        let hashCondition = md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text);
        let ipOrDomainCondition = ipPattern.test(text) || domainPattern.test(text);

        if (
            hashCondition || ipOrDomainCondition || GM_getValue("enableGPT")
        ) {
            customContextMenu.style.left = e.clientX + "px";
            customContextMenu.style.top = e.clientY + "px";
            customContextMenu.style.display = "block";

            e.preventDefault();

            buttonsData.forEach(button => {
                if (button.visible) {
                    let btn = document.getElementById(button.id);
                    btn.style.display = "none";
                }
            });

            toggleButtonDisplay([buttons["tip-search-button"],
                                 buttons["vt-search-button"],
                                 buttons["wb-search-button"],
                                 buttons["qax-search-button"]], 
                                hashCondition || ipOrDomainCondition);

            toggleButtonDisplay([buttons["send-to-tip-button"],
                                 buttons["meta-search-button"],
                                 buttons["triage-search-button"],
                                 buttons["mb-search-button"],
                                 buttons["download-from-triage"],
                                 buttons["download-from-virusshare"],
                                 buttons["download-from-malwarebazaar"]], 
                                hashCondition);

            toggleButtonDisplay([buttons["use-chatgpt"],
                                 buttons["use-chatgpt-translate"],
                                 buttons["change-chatgpt-apikey"]], 
                                GM_getValue("enableGPT"));

            toggleButtonDisplay([buttons["copy-button"],
                                 buttons["enable-chatgpt"],
                                 buttons["change-ksn-key-button"],
                                 buttons["change-triage-key-button"],
                                 buttons["change-virusshare-key-button"],
                                 buttons["change-malwarebazaar-key-button"]], 
                                true)

            buttons["send-to-tip-button"].onclick = function () {
                apikeyoobe("opentip_apiKey", "KSN OpenTip API");
                let apiKey = GM_getValue("opentip_apiKey");
                if (!apiKey) {
                    alert("没有设置KSN OpenTip API密钥,请设置后再试");
                    return;
                }
                if (text in ksnQueryCache) {
                    FileKSNResult(text, ksnQueryCache[text]);
                    showLoad(false, e);
                } else {
                    let url = null;
                    if (md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text)) {
                        url = `https://opentip.kaspersky.com/api/v1/search/hash?request=${text}`;
                    } else {
                        alert("请输入正确的样本Hash值");
                        return;
                    }
                    showLoad(true, e);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url:
                            url,
                        headers: {
                            "x-api-key": apiKey,
                        },
                        onload: function (response) {
                            showLoad(false, e);

                            if (response.status === 404) {
                                alert("未查询到相关记录");
                            } else if (response.status === 200) {
                                let result = JSON.parse(response.responseText);

                                let DetectionNameList = [];
                                if (result.DetectionsInfo && result.DetectionsInfo.length > 0) {
                                    result.DetectionsInfo.forEach(i => {
                                        if ('DetectionName' in i) {
                                            DetectionNameList.push(i.DetectionName);  
                                        }
                                    });
                                }
                                let DetectionNameListToStr = 'N/A'
                                if (DetectionNameList.length > 0) {
                                    DetectionNameListToStr = DetectionNameList.join("\r\n");
                                }
                                ksnQueryCache[text] = {
                                    zone: result.Zone,
                                    firstseen: 'FirstSeen' in result.FileGeneralInfo ? result.FileGeneralInfo.FirstSeen : 0,
                                    size: 'Size' in result.FileGeneralInfo ? result.FileGeneralInfo.Size : 0,
                                    type: 'Type' in result.FileGeneralInfo ? result.FileGeneralInfo.Type : 'Unknown',
                                    lastseen: 'LastSeen' in result.FileGeneralInfo ? result.FileGeneralInfo.LastSeen : 0,
                                    hitscount: 'HitsCount' in result.FileGeneralInfo ? result.FileGeneralInfo.HitsCount : 0,
                                    signer: 'Signer' in result.FileGeneralInfo ? result.FileGeneralInfo.Signer : 'N/A',
                                    packer: 'Packer' in result.FileGeneralInfo ? result.FileGeneralInfo.Packer : 'N/A',
                                    detections: DetectionNameListToStr,
                                };
                                FileKSNResult(text, ksnQueryCache[text]);
                            } else if (response.status === 401) {
                                let userChoice = confirm("Opentip API密钥错误,你想更换密钥吗?");
                                if (userChoice == true) {
                                    apiKey = prompt("重新输入密钥:", "");
                                    GM_setValue("opentip_apiKey", apiKey);
                                }
                            } else if (response.status === 403) {
                                let userChoice = confirm(
                                    "密钥超过一天配额,建议更换密钥或者第二天再用,你想更换密钥吗?"
                                );
                                if (userChoice == true) {
                                    apiKey = prompt("重新输入密钥:", "");
                                    GM_setValue("opentip_apiKey", apiKey);
                                }
                            } else if (response.status === 400) {
                                alert("查询参数不正确");
                            }
                        },
                    });
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };

            buttons["copy-button"].onclick = function () {
                GM_setClipboard(text);
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["vt-search-button"].onclick = function () {
                if (md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text) || ipPattern.test(text) || domainPattern.test(text)) {
                    window.open(`https://www.virustotal.com/gui/search/${text}`, "_blank");
                } else {
                    alert("请输入正确的查询对象");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["tip-search-button"].onclick = function () {
                if (md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text) || ipPattern.test(text) || domainPattern.test(text)) {
                    window.open(`https://opentip.kaspersky.com/${text}/results`, "_blank");
                } else {
                    alert("请输入正确的查询对象");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            }
            buttons["change-ksn-key-button"].onclick = function () {
                GM_setValue("opentip_apiKey", prompt("重新输入密钥:", ""));
            };
            buttons["meta-search-button"].onclick = function () {
                if (md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text)) {
                    window.open(`https://metadefender.opswat.com/results/hash/${text}`, "_blank");
                } else {
                    alert("请输入正确的样本Hash值");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["triage-search-button"].onclick = function () {
                if (md5Pattern.test(text)) {
                    window.open(`https://tria.ge/s?q=md5%3A${text}`, "_blank");
                } else if (sha1Pattern.test(text)) {
                    window.open(`https://tria.ge/s?q=sha1%3A${text}`, "_blank");
                } else if (sha256Pattern.test(text)) {
                    window.open(`https://tria.ge/s?q=sha256%3A${text}`, "_blank");
                } else {
                    alert("请输入正确的样本Hash值");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["mb-search-button"].onclick = function () {
                if (md5Pattern.test(text)) {
                    window.open(`https://bazaar.abuse.ch/browse.php?search=md5%3A${text}`, "_blank");
                } else if (sha1Pattern.test(text)) {
                    window.open(`https://bazaar.abuse.ch/browse.php?search=sha1%3A${text}`, "_blank");
                } else if (sha256Pattern.test(text)) {
                    window.open(`https://bazaar.abuse.ch/browse.php?search=sha256%3A${text}`, "_blank");
                } else {
                    alert("请输入正确的样本Hash值");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["wb-search-button"].onclick = function () {
                if (md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text)) {
                    window.open(`https://s.threatbook.com/report/file/${text}`, "_blank");
                } else if (ipPattern.test(text)) {
                    window.open(`https://x.threatbook.com/v5/ip/${text}`, "_blank");
                } else if (domainPattern.test(text)) {
                    window.open(`https://x.threatbook.com/v5/domain/${text}`, "_blank");
                } else {
                    alert("请输入正确的查询对象");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["qax-search-button"].onclick = function () {
                if (md5Pattern.test(text)) {
                    window.open(`https://ti.qianxin.com/v2/search?type=md5&value=${text}`, "_blank");
                } else if (sha1Pattern.test(text)) {
                    window.open(`https://ti.qianxin.com/v2/search?type=sha1&value=${text}`, "_blank");
                } else if (sha256Pattern.test(text)) {
                    window.open(`https://ti.qianxin.com/v2/search?type=sha256&value=${text}`, "_blank");
                } else if (ipPattern.test(text)) {
                    window.open(`https://ti.qianxin.com/v2/search?type=ip&value=${text}`, "_blank");
                } else if (domainPattern.test(text)) {
                    window.open(`https://ti.qianxin.com/v2/search?type=domain&value=${text}`, "_blank");
                } else {
                    alert("请输入正确的查询对象");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["download-from-triage"].onclick = function () {
                downloadFromTriage(text, e);
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["change-triage-key-button"].onclick = function () {
                GM_setValue("triage_apiKey", prompt("重新输入密钥:", ""));
            };
            buttons["download-from-virusshare"].onclick = function () {
                apikeyoobe("virusshare_apiKey", "VirusShare API");
                if (!GM_getValue("virusshare_apiKey")) {
                    alert("没有设置VirusShare API密钥,请设置后再试");
                    return;
                }
                let url = "https://virusshare.com/apiv2";
                if (md5Pattern.test(text) || sha1Pattern.test(text) || sha256Pattern.test(text)) {
                    GM_notification({
                        title: "VirusShare下载",
                        text: "即将开始下载,请稍作等待,请不要关闭当前网页/标签页...",
                    });
                    showLoad(true, e);
                    GM_download({
                        url: `${url}/download?apikey=${GM_getValue("virusshare_apiKey")}&hash=${text}`,
                        name: `${text}.zip`,
                        saveAs: true,
                        onload: function (response) {
                            showLoad(false, e);
                        },
                    });
                } else {
                    alert("请输入正确的样本Hash值");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["change-virusshare-key-button"].onclick = function () {
                GM_setValue("virusshare_apiKey", prompt("重新输入密钥:", ""));
            };
            buttons["download-from-malwarebazaar"].onclick = function () {
                apikeyoobe("malwarebazaar_apiKey", "MalwareBazaar API");
                if (!GM_getValue("malwarebazaar_apiKey")) {
                    alert("没有设置MalwareBazaar API密钥,请设置后再试");
                    return;
                }
                let url = "https://mb-api.abuse.ch/api/v1/";
                let sha256 = null
                if (sha256Pattern.test(text)) {
                    sha256 = text;
                    downloadFromMB(sha256, e);
                } else if (md5Pattern.test(text) || sha1Pattern.test(text)) {
                    showLoad(true, e);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: url,
                        headers: {
                            "Auth-Key": GM_getValue("malwarebazaar_apiKey"),
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        data: `query=get_info&hash=${text}`,
                        onload: function (response) {
                            showLoad(false, e)
                            if (response.status === 200) {
                                let result = JSON.parse(response.responseText);
                                if (result.query_status == "ok") {
                                    sha256 = result.data[0].sha256_hash;
                                    downloadFromMB(sha256, e);
                                } else {
                                    GM_log(`[Error]result.query_status: ${result.query_status}`);
                                }
                            } else {
                                alert("MalwareBazaar API服务异常,请确认网络连通性以及密钥是否正确...");
                                GM_log(`[Error]${response.status} ${response.statusText}`);
                            }
                        },
                    });
                } else {
                    alert("请输入正确的样本Hash值");
                }
                customContextMenu.style.display = "none"; // 关闭菜单
            };
            buttons["change-malwarebazaar-key-button"].onclick = function () {
                GM_setValue("malwarebazaar_apiKey", prompt("重新输入密钥:", ""));
            };
            buttons["enable-chatgpt"].onclick = function () {
                GM_setValue("enableGPT", !GM_getValue("enableGPT"));
                window.location.reload();
            };
            buttons["change-chatgpt-apikey"].onclick = function () {
                GM_setValue("gpt_apiKey", prompt("重新输入密钥:", ""));                
            };
            buttons["use-chatgpt-translate"].onclick = function () {
                apikeyoobe("gpt_apiKey", "OpenAI API");
                PushMsgToGPT(text, "我需要把这些翻译成简体中文,谢谢:\n", e);
            };
            buttons["use-chatgpt"].onclick = function () {
                apikeyoobe("gpt_apiKey", "OpenAI API");
                PushMsgToGPT(text, "请帮我解释一下这段信息,请说简体中文,谢谢:\n", e);
            };
        }
    }
    // 当用户右击页面时，如果选中的是MD5或SHA1哈希值，则显示自定义的右键菜单
    document.oncontextmenu = function (e) {
        let text = window.getSelection().toString();
        if (text.length > 3) {
            showMenu(text, e);
        }
    };

    // 点击其他地方关闭菜单和气泡提示
    document.onclick = function (e) {
        if (
            e.target.id !== "send-to-tip-button" &&
            e.target.id !== "copy-button" &&
            e.target.id !== "vt-search-button" &&
            e.target.id !== "tip-search-button" &&
            e.target.id !== "meta-search-button" &&
            e.target.id !== "wb-search-button" &&
            e.target.id !== "qax-search-button" &&
            e.target.id !== "triage-search-button" &&
            e.target.id !== "mb-search-button" &&
            e.target.id !== "download-from-triage" &&
            e.target.id !== "download-from-virusshare" &&
            e.target.id !== "download-from-malwarebazaar" &&
            e.target.id !== "use-chatgpt" &&
            e.target.id !== "use-chatgpt-translate" &&
            e.target.id !== "change-ksn-key-button" &&
            e.target.id !== "change-triage-key-button" &&
            e.target.id !== "change-virusshare-key-button" &&
            e.target.id !== "change-malwarebazaar-key-button" &&
            e.target.id !== "change-chatgpt-apikey" &&
            e.target.id !== "enable-chatgpt"
        ) {
            let customContextMenu = document.getElementById("huoji_tip_custom-context-menu");
            if (customContextMenu && stopDisVisible == false) {
                customContextMenu.style.display = "none";
            }
            stopDisVisible = false;
        }
    };


    let pressTimer = null;
    let moved = false;
    let startX, startY;
    // 监听mousedown事件
    document.addEventListener('mousedown', function (e) {
        pressTimer = null;
        moved = false;
        startX = e.clientX;  // 记录鼠标按下时的位置
        startY = e.clientY;
        // 开始计时
        pressTimer = window.setTimeout(function () {
            if (!moved) {  // 只有当鼠标没有移动时才显示菜单
                stopDisVisible = true;
                showMenu(window.getSelection().toString(), e);
            }
        }, 1000);  // 这里设置长按的时间，单位是毫秒
    });

    // 监听mousemove事件
    document.addEventListener('mousemove', function (e) {
        if (pressTimer == null) {
            return;
        }
        let moveX = e.clientX;
        let moveY = e.clientY;

        // 如果鼠标移动距离大于5px, 则认为是移动
        if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 5) {
            moved = true;  // 如果鼠标移动，就将moved设为true
            clearTimeout(pressTimer);  // 并取消计时器
        }
    });

    // 监听mouseup事件
    document.addEventListener('mouseup', function () {
        if (pressTimer != null) {
            clearTimeout(pressTimer);
        }
    });

})();
