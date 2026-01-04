// ==UserScript==
// @name         Netflix 备份工具
// @namespace    NetflixBackupTools
// @version      1.0
// @description  快速备份和迁移 Netflix 账号内容
// @author       TGSAN
// @include      /https{0,1}\:\/\/www.netflix.com/.*/
// @run-at       document-end
// @grant        GM_unregisterMenuCommand
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420931/Netflix%20%E5%A4%87%E4%BB%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/420931/Netflix%20%E5%A4%87%E4%BB%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let netflixApi = "https://www.netflix.com/api/shakti/mre";
    try {
        netflixApi = unsafeWindow.netflix.reactContext.models.playerModel.data.config.ui.initParams.apiUrl;
    } catch {
        console.log("获取 Netflix API 失败");
        // try {
        //     netflixApi = "https://www.netflix.com/api/shakti/" + netflix.appContext.state.model.models.serverDefs.data.BUILD_IDENTIFIER
        // } catch {
        //     console.log("获取 Netflix UI Version 失败");
        // }
    }

    function createToast() {
        let toast = document.createElement("div");
        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.padding = "10px 20px";
        toast.style.backgroundColor = "rgba(250, 250, 250, 1.0)";
        toast.style.color = "rgba(32, 32, 32, 1.0)";
        toast.style.fontSize = "12px";
        toast.style.fontWeight = "600";
        toast.style.zIndex = "9999";
        toast.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.25)";
        toast.style.borderRadius = "30px";
        toast.style.opacity = "0.0";
        toast.style.transition = "opacity 0.5s";
        document.body.appendChild(toast);
        return toast;
    }

    function showToast(message, time = 1500) {
        let toast = createToast();
        toast.innerText = message;
        setTimeout(function () {
            toast.style.opacity = "1.0";
            setTimeout(function () {
                toast.style.opacity = "0.0";
                setTimeout(function () {
                    document.body.removeChild(toast);
                }, 500);
            }, time);
        }, 1);
    }

    function dateFormat(dataObj, fmt) {
        var o = {
            "M+": dataObj.getMonth() + 1,                   //月份
            "d+": dataObj.getDate(),                        //日
            "h+": dataObj.getHours(),                       //小时
            "m+": dataObj.getMinutes(),                     //分
            "s+": dataObj.getSeconds(),                     //秒
            "q+": Math.floor((dataObj.getMonth() + 3) / 3), //季度
            "S": dataObj.getMilliseconds()                  //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (dataObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    function backup() {
        let userAuthURL;
        try {
            userAuthURL = unsafeWindow.netflix.reactContext.models.userInfo.data.authURL;
        } catch {
            alert("无法获取 Netflix API 验证密钥");
            return;
        }
        let userName = "UnknownUser";
        try {
            userName = unsafeWindow.netflix.reactContext.models.userInfo.data.name;
        } catch {
            alert("无法获取用户名称，将使用默认名称备份");
        }
        let userGuid = "UnknownGUID";
        try {
            userGuid = unsafeWindow.netflix.reactContext.models.userInfo.data.userGuid;
        } catch { }

        let body = "path=" +
            encodeURIComponent(JSON.stringify([
                "mylist",
                {
                    "from": 0,
                    "to": 1000 // Netflix 最多支持一次吐 1333 个（0-1332）
                }
            ])) +
            "&authURL=" +
            encodeURIComponent(userAuthURL);
        fetch(
            netflixApi + "/pathEvaluator",
            {
                "body": body,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }
        ).then(function (res) {
            if (res.ok) {
                res.json().then(function (jsonRes) {
                    let mylist = new Array();
                    if (jsonRes.value != undefined && jsonRes.value.mylist != undefined) {
                        let jsonResList = jsonRes.value.mylist;
                        // jsonResList = [["", ""]];
                        console.log(jsonResList);
                        for (const [key, value] of Object.entries(jsonResList)) {
                            if (value != undefined) {
                                if (value.length > 1) {
                                    if (value[1] != undefined) {
                                        mylist.push(value[1]);
                                    }
                                }
                            }
                        }
                    }
                    if (mylist.length > 0) {
                        var enc = new TextEncoder();
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(new Blob([enc.encode(JSON.stringify(mylist))]));
                        link.download = "netflix-mylist-" + userName + "-" + userGuid + "-" + dateFormat(new Date(), "yyyyMMddhhmmss") + ".json";
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                        alert("备份完成！（备份中共有 " + mylist.length + " 个剧集）");
                    } else {
                        alert("播放列表为空（包括锁区内容），如果播放列表非空可尝试进入播放列表页面后再试");
                    }
                }).catch(function (err) {
                    alert("无法获取播放列表（无法解析接口返回的结果），备份失败\n" + err);
                })
            } else {
                alert("无法获取播放列表（接口访问失败），备份失败\nStatus: " + res.status);
            }
        }).catch(function (err) {
            alert("无法获取播放列表，备份失败\n" + err);
        });
    }

    function backupOld() {
        let mylistData;
        try {
            mylistData = unsafeWindow.netflix.falcorCache.mylist;
        } catch { }
        if (mylistData != undefined) {
            let userName = "UnknownUser";
            try {
                userName = unsafeWindow.netflix.reactContext.models.userInfo.data.name;
            } catch {
                alert("无法获取用户名称，将使用默认名称备份");
            }
            let userGuid = "UnknownGUID";
            try {
                userGuid = unsafeWindow.netflix.reactContext.models.userInfo.data.userGuid;
            } catch { }
            let mylist = new Array();
            for (const [key, value] of Object.entries(mylistData)) {
                if (value?.value && value.value[1] != undefined) {
                    mylist.push(value.value[1]);
                }
            }
            // let mylist = Object.keys(netflix.falcorCache.videos);
            if (mylist.length > 0) {
                var enc = new TextEncoder();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(new Blob([enc.encode(JSON.stringify(mylist))]));
                link.download = "netflix-mylist-" + userName + "-" + userGuid + "-" + dateFormat(new Date(), "yyyyMMddhhmmss") + ".json";
                link.click();
                window.URL.revokeObjectURL(link.href);
                alert("备份完成！（备份中共有 " + mylist.length + " 个剧集）");
            } else {
                alert("播放列表为空（包括锁区内容），如果播放列表非空可尝试进入播放列表页面后再试");
            }
        } else {
            if (document.location.pathname != "/browse/my-list") {
                alert("无法获取播放列表，即将跳转到播放列表页面，跳转结束后请重新尝试备份");
                document.location = "/browse/my-list";
            } else {
                alert("无法获取播放列表，备份失败");
            }
        }

    }

    function restore() {
        let userAuthURL;
        try {
            userAuthURL = unsafeWindow.netflix.reactContext.models.userInfo.data.authURL;
        } catch {
            alert("无法获取 Netflix API 验证密钥");
            return;
        }
        const fileInput = document.createElement("input");
        fileInput.id = "file";
        fileInput.type = "file";
        fileInput.style.display = "none";
        fileInput.addEventListener('change', function () {
            if (this.files.length === 0) {
                return;
            }
            const reader = new FileReader();
            reader.onload = function () {
                let result = reader.result;
                try {
                    let mylist = JSON.parse(result);
                    if (mylist.length < 1) {
                        alert("备份文件为空");
                    }
                    try {
                        let index = 0;
                        let doFetch = function () {
                            if (index < mylist.length) {
                                showToast("正在还原备份（" + (index + 1) + "/" + mylist.length + "）");
                                let body = {
                                    "operation": "add",
                                    "videoId": mylist[index],
                                    // "trackId": 253896178,
                                    "authURL": userAuthURL
                                };
                                fetch(
                                    netflixApi + "/playlistop",
                                    {
                                        "body": JSON.stringify(body),
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "include"
                                    }
                                ).then(function () {
                                    index++;
                                    doFetch();
                                }).catch(function () {
                                    alert("还原备份失败");
                                });
                            } else {
                                alert("还原备份成功！（备份中共有 " + mylist.length + " 个剧集）");
                            }
                        };
                        doFetch();
                    } catch {
                        alert("还原备份失败");
                    }
                } catch {
                    alert("解析备份失败");
                }
            };
            reader.onerror = function () {
                alert("读取备份失败");
            };
            reader.readAsText(this.files[0]);
        });
        // document.body.appendChild(fileInput);
        fileInput.click();
        // document.body.removeChild(fileInput);
    }

    GM_registerMenuCommand("备份播放列表", backup);
    GM_registerMenuCommand("还原播放列表", restore);
    let username = netflix?.reactContext?.models?.userInfo?.data?.name ?? netflix?.reactContext?.models?.profilesModel?.data?.active?.firstName;
    let switchProfile = async function () {
        let otherProfiles = netflix?.reactContext?.models?.profilesModel?.data?.others;
        if (otherProfiles) {
            let message = "请输入需要切换到的用户编号（下面的格式为“编号（用户名：XXX）”）\r\n\r\n";
            for (let i in otherProfiles) {
                let otherProfile = otherProfiles[i];
                message += i + "（用户名：" + otherProfile.firstName + "）\r\n";
            }
            let inputIndex = Number.parseInt(prompt(message));
            if (inputIndex) {
                let res = await fetch("https://www.netflix.com/api/shakti/mre/profiles/switch?switchProfileGuid=" + otherProfiles[inputIndex].guid, {
                    "headers": {
                        "accept": "*/*",
                        "cache-control": "no-cache",
                        "pragma": "no-cache"
                    },
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                });
                if (res.ok) {
                    location.reload();
                }
            }
        } else {
            if (confirm("是否跳转到支持用户切换的页面？")) {
                location.href = "https://www.netflix.com/settings/viewed";
            }
        }
    }
    if (username != undefined) {
        GM_registerMenuCommand("切换用户（当前：" + username + "）", switchProfile);
    } else {
        GM_registerMenuCommand("切换用户", switchProfile);
    }
})();