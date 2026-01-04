// ==UserScript==

// @name KubeDown
// @description KubeDown-Script-百度网盘-不限速-下载

// @version 0.7
// @author KubeDown

// @antifeature membership

// @license AGPL-3.0

// @icon https://p0.meituan.net/csc/6a347940f064146525be36b80541490124528.png

// @resource https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css

// @require https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.all.min.js
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js

// @grant          GM_xmlhttpRequest

// @match *://pan.baidu.com/*

// @connect      127.0.0.1
// @connect      api.kubedown.com

// @connect      p0.meituan.net

// @connect      cdn.staticfile.org

// @connect      pan.baidu.com

// @namespace https://greasyfork.org/users/1045131
// @downloadURL https://update.greasyfork.org/scripts/464921/KubeDown.user.js
// @updateURL https://update.greasyfork.org/scripts/464921/KubeDown.meta.js
// ==/UserScript==

(() => {
    AddElement();

    function AddElement() {
        if (document.getElementById("KubeDown") === null) {
            const newbutton = document.createElement("button");

            newbutton.id = "KubeDown";
            newbutton.className = "u-button nd-file-list-toolbar-action-item u-button--primary";
            newbutton.style.marginRight = "8px";
            newbutton.innerText = "KubeDown";

            document.querySelector("div.wp-s-agile-tool-bar__header").prepend(newbutton);
        } else {
            setTimeout(() => {
                AddElement();
            }, 100);
        }
    }

    document.getElementById("KubeDown").addEventListener("click", () => {
        const list = document.getElementsByClassName("wp-s-pan-table__body-row mouse-choose-item selected");

        if (list.length === 1) {
            const fileid = list[0].getAttribute("data-id");

            if (fileid === "" || fileid === null) {
                Swal.fire({
                    icon: "error",
                    title: "获取文件ID错误",
                    confirmButtonText: "关闭",
                });
            } else {
                Swal.fire({
                    title: "正在获取验证码",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();

                        var formdata = new FormData();

                        formdata.append("time", new Date().getTime());

                        GM_xmlhttpRequest({
                            method: "POST",
                            // url: "http://127.0.0.1/getcaptcha.php",
                            url: "https://api.kubedown.com/getcaptcha.php",
                            data: formdata,
                            onload: function (response) {
                                console.log(response.responseText);

                                const jsondata = JSON.parse(response.responseText);
                                const captchaid = jsondata["captchaid"];
                                const imagebase64 = jsondata["imagebase64"];

                                if (captchaid === "" || captchaid === undefined || imagebase64 === "" || imagebase64 === undefined) {
                                    Swal.fire({
                                        icon: "error",
                                        title: "数据异常",
                                        confirmButtonText: "关闭",
                                    });
                                } else {
                                    Swal.fire({
                                        title: "请输入您的姓名",
                                        input: "text",
                                        html: '<img src="' + imagebase64 + '" />',
                                        inputPlaceholder: "请输入验证码",
                                        showCancelButton: true,
                                        confirmButtonText: "验证",
                                        cancelButtonText: "关闭",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            Swal.fire({
                                                title: "text",
                                                title: "正在获取下载链接",
                                                allowOutsideClick: false,
                                                didOpen: () => {
                                                    Swal.showLoading();

                                                    GM_xmlhttpRequest({
                                                        method: "GET",
                                                        url: "https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1&fsids=[" + fileid + "]",
                                                        onload: (response) => {
                                                            console.log(response.responseText);

                                                            const jsondata = JSON.parse(response.responseText);
                                                            const link = jsondata["list"][0]["dlink"];

                                                            if (link === "" || link === undefined) {
                                                                Swal.fire({
                                                                    Status: false,
                                                                    icon: "error",
                                                                    title: "获取下载地址错误",
                                                                    confirmButtonText: "关闭",
                                                                });
                                                            } else {
                                                                var formdata = new FormData();

                                                                formdata.append("captchaid", captchaid);
                                                                formdata.append("captchaanswer", result.value);

                                                                GM_xmlhttpRequest({
                                                                    method: "POST",
                                                                    // url: link.replace("d.pcs.baidu.com", "127.0.0.1").replace("https://", "http://"),
                                                                    url: link.replace("d.pcs.baidu.com", "api.kubedown.com").replace("http://", "https://"),
                                                                    data: formdata,
                                                                    onload: (response) => {
                                                                        console.log(response.responseText);

                                                                        const jsondata = JSON.parse(response.responseText);
                                                                        const status = jsondata["status"];
                                                                        const downloadlink = jsondata["downloadlink"];
                                                                        const useragent = jsondata["useragent"];

                                                                        if (status) {
                                                                            if (downloadlink === "" || downloadlink === undefined || useragent === "" || useragent === undefined) {
                                                                                Swal.fire({
                                                                                    icon: "error",
                                                                                    title: "数据异常",
                                                                                    confirmButtonText: "关闭",
                                                                                });
                                                                            } else {
                                                                                Swal.fire({
                                                                                    icon: "success",
                                                                                    title: "获取下载地址成功",
                                                                                    html: '<input id="swal-input1" class="swal2-input" value="' + downloadlink + '"><input id="swal-input2" class="swal2-input" value="' + useragent + '">',
                                                                                });
                                                                            }
                                                                        } else {
                                                                            let error = jsondata["error"];

                                                                            if (error === "" || error === undefined) {
                                                                                error = "";
                                                                            }

                                                                            Swal.fire({
                                                                                icon: "error",
                                                                                title: "解析下载地址错误",
                                                                                text: error,
                                                                                confirmButtonText: "关闭",
                                                                            });
                                                                        }
                                                                    },
                                                                    onerror: () => {
                                                                        Swal.fire({
                                                                            icon: "error",
                                                                            title: "请求解析下载地址错误",
                                                                            confirmButtonText: "关闭",
                                                                        });
                                                                    },
                                                                });
                                                            }
                                                        },
                                                        onerror: () => {
                                                            Swal.fire({
                                                                icon: "error",
                                                                title: "请求生成下载地址错误",
                                                                confirmButtonText: "关闭",
                                                            });
                                                        },
                                                    });
                                                },
                                            });
                                        }
                                    });
                                }
                            },
                            onerror: () => {
                                Swal.fire({
                                    icon: "error",
                                    title: "请求获取验证码错误",
                                    text: "请检查是否关闭了代理！只允许中国IP访问！",
                                    confirmButtonText: "关闭",
                                });
                            },
                        });
                    },
                });
            }
        } else {
            Swal.fire({
                icon: "info",
                title: "请选择一个文件",
                confirmButtonText: "关闭",
            });
        }
    });
})();
