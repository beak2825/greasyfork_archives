// ==UserScript==
// @name         🔥【百度网盘加速】33Down 网盘解析 🔥
// @namespace    https://www.33down.top
// @description  破除网盘限速，成就你的体验，无视任何黑号，加速你的下载！灵感来源于KDown，经作者同意，发布本脚本给各位网友体验！
// @version 1.0.0
// @author
// @license      MIT
// @icon https://cdn-static.33down.top/assets/logo.png
// @resource https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.all.min.js
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @match        *://pan.baidu.com/disk/main*
// @match        *://yun.baidu.com/disk/main*
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @match        *://yun.baidu.com/share/*
// @connect      33down.top
// @connect      staticfile.org
// @connect      baidu.com
// @connect      127.0.0.1
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/494729/%F0%9F%94%A5%E3%80%90%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%8A%A0%E9%80%9F%E3%80%9133Down%20%E7%BD%91%E7%9B%98%E8%A7%A3%E6%9E%90%20%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/494729/%F0%9F%94%A5%E3%80%90%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%8A%A0%E9%80%9F%E3%80%9133Down%20%E7%BD%91%E7%9B%98%E8%A7%A3%E6%9E%90%20%F0%9F%94%A5.meta.js
// ==/UserScript==

(() => {
    // 在页面加载时立即调用GetNotify函数
    GetNotify();

    if (window.location.pathname === "/disk/home") {
        window.location.replace("./main");
    }

    AddElement();

    function GetNotify() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.33down.top/api/isok",
            onload: function(response) {
                try {
                    const jsondata = JSON.parse(response.responseText);
                    const { code, message, open, gg } = jsondata;

                    // 确保公告是打开状态
                    if (open === 1 && code === 200) {
                        Swal.fire({
                            icon: "info",
                            title: gg, // 使用公告标题
                            text: message, // 使用公告信息
                            confirmButtonText: "关闭",
                        });
                    }
                } catch (e) {
                    console.error("Error fetching announcement:", e);
                }
            },
        });
    }

    function AddElement() {
        if (document.getElementById("33Down") === null) {
            const toolbar = document.querySelector("div.wp-s-agile-tool-bar__header");
            if (toolbar) {
                const newButton = document.createElement("button");
                newButton.id = "33Down";
                newButton.className = "u-button nd-file-list-toolbar-action-item u-button--primary";
                newButton.style.marginRight = "8px";
                newButton.innerText = "33Down";
                toolbar.prepend(newButton);

                const statusButton = document.createElement("button");
                statusButton.id = "33DownStatus";
                statusButton.className = "u-button nd-file-list-toolbar-action-item u-button--primary";
                statusButton.style.marginRight = "8px";
                statusButton.innerText = "33Down Status";
                toolbar.prepend(statusButton);

                const settingsButton = document.createElement("button");
                settingsButton.id = "aria2SettingsButton";
                settingsButton.className = "u-button nd-file-list-toolbar-action-item u-button--primary";
                settingsButton.style.marginRight = "8px";
                settingsButton.innerText = "Aria2 设置";
                settingsButton.onclick = openAria2Settings;
                toolbar.prepend(settingsButton);

                newButton.addEventListener("click", handleDownClick);
                statusButton.addEventListener("click", handleDownStatusClick);
            } else {
                setTimeout(AddElement, 100);
            }
        } else {
            console.log("33Down button already added.");
        }
    }

    async function handleDownClick() {
        let selectedElements = document.querySelectorAll(".wp-s-pan-table__body-row.mouse-choose-item.selected, .wp-s-file-grid-list__item.text-center.cursor-p.mouse-choose-item.is-checked, .wp-s-file-contain-list__item.text-center.cursor-p.mouse-choose-item.is-checked");
        let selectedIds = Array.from(selectedElements).map(item => item.getAttribute("data-id"));

        if (selectedIds.length === 0) {
            Swal.fire({
                showConfirmButton: true,
                title: '系统提示',
                text: '请选择需要下载的文件',
                icon: 'error'
            });
            return;
        }

        if (selectedIds.length > 1) {
            Swal.fire({
                showConfirmButton: true,
                title: '系统提示',
                text: '暂时只能下载一个文件',
                icon: 'error'
            });
            return;
        }

        const { value: password } = await Swal.fire({
            title: '输入密码',
            input: 'password',
            inputLabel: '新版体验，免任何密码，输入：33Down即可',
            inputPlaceholder: '新版体验！免密码！输入：33Down即可',
            inputAttributes: {
                maxlength: 30,
                autocapitalize: 'off',
                autocorrect: 'off'
            }
        });

        if (!password) {
            Swal.fire("提示", "需要密码来继续", "info");
            return;
        }

        Swal.fire({
            title: "正在获取下载链接...",
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });

        const bdstoken = await getBdsToken();
        if (!bdstoken) {
            Swal.fire("错误", "无法获取bdstoken", "error");
            return;
        }

        const bdpassword = "zzzz";
        const shareResponse = await shareFiles(bdstoken, selectedIds, bdpassword);
        const apiResponse = await getDownloadLinkFromApi(shareResponse.link, password);

        if (apiResponse && apiResponse.error && Object.keys(apiResponse).length === 1) {
            Swal.update({
                icon: 'error',
                title: '错误',
                text: apiResponse.error
            });
        } else if (apiResponse && apiResponse.dlink && apiResponse.server_filename) {
            const dlink = apiResponse.dlink;

            Swal.fire({
                icon: 'success',
                title: '下载链接获取成功',
                html: `
                    文件名: ${apiResponse.server_filename}<br>
                    链接: <input type="text" id="downloadLink" value="${dlink}" style="width: 100%;" readonly><br>
                    用户代理(UA): <textarea id="userAgent" readonly style="width: 100%; height: 60px; resize: none;">33Down;Links;33down.top</textarea>
                    <button id="copyButton" class="swal2-confirm swal2-styled">复制链接</button>
                    <button id="sendToAria2Button" class="swal2-confirm swal2-styled" style="margin-top: 10px;">发送到 Aria2</button>
                `,
                didOpen: () => {
                    const copyButton = document.getElementById("copyButton");
                    copyButton.addEventListener("click", async () => {
                        const downloadLinkInput = document.getElementById("downloadLink");
                        try {
                            await navigator.clipboard.writeText(downloadLinkInput.value);
                            Swal.fire("已复制", "下载链接已复制到剪贴板", "success");
                        } catch (err) {
                            console.error("Failed to copy: ", err);
                            Swal.fire("复制失败", "无法将链接复制到剪贴板", "error");
                        }
                    });

                    const sendToAria2Button = document.getElementById("sendToAria2Button");
                    sendToAria2Button.addEventListener("click", () => {
                        const downloadLink = document.getElementById("downloadLink").value;
                        sendToAria2(downloadLink, apiResponse.server_filename);
                    });
                },
                preConfirm: () => {
                    return { dlink: apiResponse.dlink };
                }
            });
        }
    }

    function handleDownStatusClick() {
        Swal.fire("检查中...", "正在检查服务器状态，请稍候...", "info");

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.33down.top/api/status",
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const { code, message } = data;
                    if (code === 200) {
                        Swal.fire({
                            icon: "success",
                            title: "服务器状态",
                            text: message,
                        });
                    } else if (code === 201) {
                        Swal.fire({
                            icon: "error",
                            title: "服务器状态",
                            text: message,
                        });
                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: "服务器状态",
                            text: "未知状态",
                        });
                    }
                } catch (error) {
                    Swal.fire("错误", "无法获取服务器状态", "error");
                }
            },
            onerror: function() {
                Swal.fire("错误", "无法连接到服务器", "error");
            },
        });
    }

    function openAria2Settings() {
        const aria2RpcUrl = GM_getValue('aria2RpcUrl', 'http://localhost:6800/jsonrpc');
        const aria2Token = GM_getValue('aria2Token', '');

        Swal.fire({
            title: '配置 Aria2 设置',
            html: `
                <input type="text" id="aria2RpcUrl" value="${aria2RpcUrl}" class="swal2-input" placeholder="输入 Aria2 RPC URL">
                <input type="text" id="aria2Token" value="${aria2Token}" class="swal2-input" placeholder="输入 Aria2 Token">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            preConfirm: () => {
                const rpcUrl = document.getElementById('aria2RpcUrl').value;
                const token = document.getElementById('aria2Token').value;
                GM_setValue('aria2RpcUrl', rpcUrl);
                GM_setValue('aria2Token', token);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('设置已保存', '', 'success');
            }
        });
    }

    function sendToAria2(downloadLink, filename) {
        const aria2RpcUrl = GM_getValue('aria2RpcUrl', 'http://localhost:6800/jsonrpc');
        const aria2Token = GM_getValue('aria2Token', '');

        const requestPayload = {
            jsonrpc: '2.0',
            method: 'aria2.addUri',
            id: new Date().getTime(),
            params: [
                [`${downloadLink}`],
                {
                    'out': filename,
                    'header': ['User-Agent: 33Down;Links;33down.top'],
                }
            ]
        };

        if (aria2Token) {
            requestPayload.params.unshift(`token:${aria2Token}`);
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: aria2RpcUrl,
            data: JSON.stringify(requestPayload),
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data && data.result) {
                    Swal.fire('已发送', '下载链接已成功发送到 Aria2', 'success');
                } else {
                    Swal.fire('发送失败', '无法将下载链接发送到 Aria2', 'error');
                }
            },
            onerror: function() {
                Swal.fire('发送失败', '无法连接到 Aria2 服务器', 'error');
            }
        });
    }

    async function getBdsToken() {
        var htmlString = $("html").html();
        var regex = /"bdstoken":"(\w+)"/;
        var match = regex.exec(htmlString);
        return match ? match[1] : null;
    }

    async function shareFiles(bdstoken, selectedIds, bdpassword) {
        return $.post("https://pan.baidu.com/share/set?channel=chunlei&bdstoken=" + bdstoken, {
            period: 1,
            pwd: bdpassword,
            eflag_disable: true,
            channel_list: "[]",
            schannel: 4,
            fid_list: JSON.stringify(selectedIds)
        }).then(response => response);
    }

function getDownloadLinkFromApi(link, password) {
    // 清理密码以移除非字母数字字符
    const cleanedPassword = password.replace(/[^a-zA-Z0-9_]/g, '');

    // 创建请求数据
    const requestData = {
        url: link,
        dir: '/',
        password: cleanedPassword
    };

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.33down.top/api/download_post",
            data: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    resolve(data);
                } else {
                    reject({
                        status: response.status,
                        statusText: response.statusText
                    });
                }
            },
            onerror: function(response) {
                reject({
                    status: response.status,
                    statusText: "Network error"
                });
            }
        });
    });
}



})();
