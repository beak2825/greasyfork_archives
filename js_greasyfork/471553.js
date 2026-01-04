// ==UserScript==
// @name         Pt助手
// @namespace    zhoubanxian
// @version      4.7
// @description  用于pt站种子页资源下载
// @author       周半仙
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/471553/Pt%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471553/Pt%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 等待 DOM 树构建完成后执行脚本
    $(document).ready(function () {
        // setting函数用于在控制面板中加载qb服务器配置
        setting();
        // flag标识用于判断控制面板中地址是否配置
        var flag = GM_getValue("address");
        if (flag != undefined) {
            // 判断是否是种子页面
            if (window.location.href.indexOf("details.php?id=") !== -1) {
                // 每次执行qb登录
                qblogin();
                torrentHashInfo(getDownloadUrl());
                // 在种子页面中插入qb下载配置，并且每次配置的参数都会保存下来
                var $newTr = $("<tr>");
                var $qbTd =
                    "<a style='color:#008000'>qb已完成种子数:" +
                    "<span id ='qbtCount'></span>" +
                    "个  |  qb正在下载种子数:" +
                    "<span id ='qbtdCount'></span>" +
                    "个" + "  |  当前种子hash值:" +
                    "<span id ='torrentHashInfo'></span>" + "</a><br><a id='fzurl'></a>";
                $newTr.html(
                    '<td class="rowhead nowrap" valign="top" align="right">pt助手</td><td>' +
                    $qbTd +
                    '<br>qb存储位置：<input type="text" id=savepath>  种子分类：<input type="text" id=category>  种子标签：<input type="text" id=tags>跳过哈希校验：<input type="checkbox" id=removehaxi value=1> <button id="buttonSend">提交</button></td>'
                );
                $('td:contains("行为"), td:contains("行為")')
                    .closest("tr")
                    .eq(1)
                    .after($newTr);
                if (GM_getValue("savepath") != undefined) {
                    $("#savepath").val(GM_getValue("savepath"));
                }
                if (GM_getValue("category") != undefined) {
                    $("#category").val(GM_getValue("category"));
                }
                if (GM_getValue("tags") != undefined) {
                    $("#tags").val(GM_getValue("tags"));
                }
                // 用于自动获取站点域名填入种子分类中
                var currentUrl = new URL(window.location.href);
                var domain = currentUrl.hostname;
                $("#category").val(domain.split(".")[0]);
                // 获取按钮元素
                var btn = document.querySelector("#buttonSend");
                // 添加点击事件监听器
                btn.addEventListener("click", function () {
                    qbAddTorrent(getDownloadUrl());
                });
            }
        } else {
            console.log("没有在控制面板配置qb信息");
        }
    });
    function setting() {
        // 判断是否是控制面板页面
        if (window.location.href.indexOf("usercp.php") !== -1) {
            var $newTr = $("<tr>");
            $newTr.html(
                '<td class="rowhead nowrap" valign="top" align="right">pt助手配置</td><td>填写qb服务器地址：<input type="text" id=address>  填写qb账号：<input type="text" id=qbusername>  填写qb密码：<input type="text" id=qbpassword>  填写iyuu token值：<input type="text" id=iyuutoken> <button id="saveInfo">保存' +
                "</button></td>"
            );
            $('tr:has(td:contains("加入日期"))').eq(1).after($newTr);
            // 获取按钮元素
            var btn = document.querySelector("#saveInfo");
            // 添加点击事件监听器
            btn.addEventListener("click", function () {
                GM_setValue("address", $("#address").val());
                GM_setValue("qbusername", $("#qbusername").val());
                GM_setValue("qbpassword", $("#qbpassword").val());
                GM_setValue("iyuutoken", $("#iyuutoken").val());
                alert("配置保存成功");
            });
            // 在页面加载时将之前的值填充回输入框中
            $("#address").val(GM_getValue("address", ""));
            $("#qbusername").val(GM_getValue("qbusername", ""));
            $("#qbpassword").val(GM_getValue("qbpassword", ""));
            $("#iyuutoken").val(GM_getValue("iyuutoken", ""));
        }
    }
    function qblogin() {
        // 填写用户名和密码
        const username = GM_getValue("qbusername");
        const password = GM_getValue("qbpassword");
        if (username == undefined) {
            alert("请先去控制面板配置您的qb地址");
            return 0;
        }
        // 构造登录请求
        const url = "auth/login";
        const data = `username=${encodeURIComponent(
            username
        )}&password=${encodeURIComponent(password)}`;
        qbRequest(url, data);
    }
    // 登录接口
    function qbRequest(url, data) {
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: GM_getValue("address"),
            Cookie: generateUUID(),
        };
        GM_xmlhttpRequest({
            method: "POST",
            url: GM_getValue("address") + "/api/v2/" + url,
            data: data,
            headers: headers,
            onload: function (response) {
                if (response.responseText == "Ok.") {
                    console.log("登录成功");
                    getDownloadList();
                } else {
                    console.log("登录失败");
                }
            },
            onerror: function (error) {
                console.log("登录请求出错:", error);
            },
        });

    }
    function qbAddTorrent(torrentUrl) {
        let savepath = $("#savepath").val();
        let category = $("#category").val();
        let tags = $("#tags").val();
        let removehaxi = $("#removehaxi").is(":checked");
        GM_setValue("savepath", savepath);
        GM_setValue("category", category);
        GM_setValue("tags", tags);

        // 构造发送到 qBittorrent 的数据
        var requestData = new FormData();
        requestData.append("urls", torrentUrl);
        requestData.append("savepath", savepath);
        requestData.append("category", category);
        requestData.append("tags", tags);
        requestData.append("skip_checking", removehaxi);
        requestData.append("paused", false);
        requestData.append("root_folder", false);
        requestData.append("rename", "");
        requestData.append("upLimit", -1);
        requestData.append("dlLimit", -1);
        requestData.append("autoTMM", false);
        requestData.append("sequentialDownload", false);
        requestData.append("firstLastPiecePrio", false);
        requestData.append("category", "");
        requestData.append("suggested_name", "");
        requestData.append("cookie", "");
        requestData.append("upload_mode", "all");
        requestData.append("paused", "false");
        requestData.append("dlLimit", "-1");
        requestData.append("upLimit", "-1");
        requestData.append("ratioLimit", "-1.000000");
        requestData.append("seedingTimeLimit", "-1");
        requestData.append("seedRatioMode", "0");
        requestData.append("superSeeding", "0");
        requestData.append("autoTMMEnabled", "false");
        requestData.append("dontCountSlowTorrents", "false");
        requestData.append("shareRatioLimit", "-1.000000");
        requestData.append("peerLimit", "0");
        requestData.append("proxyServer", "");
        requestData.append("proxyPort", "");
        requestData.append("proxyType", "0");
        requestData.append("proxyAuthEnabled", "false");
        requestData.append("proxyUsername", "");
        requestData.append("proxyPassword", "");
        requestData.append("webseeds", "");
        requestData.append("suggested_owner", "");
        // 使用 GM_xmlhttpRequest 函数发送 POST 请求添加种子链接
        GM_xmlhttpRequest({
            method: "POST",
            url: GM_getValue("address") + "/api/v2/torrents/add",
            data: requestData,
            onload: function (response) {
                console.log(response);
                alert(response.responseText);
            },
        });
    }
    // 获取下载列表的函数
    function getDownloadList() {
        // 发送GET请求获取下载列表数据
        GM_xmlhttpRequest({
            method: "GET",
            url: GM_getValue("address") + "/api/v2/torrents/info",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Referer: GM_getValue("address"),
                Cookie: generateUUID(),
            },
            onload: function (response) {
                // 在此处处理下载列表的数据
                var data = JSON.parse(response.responseText);
                var inProgressTorrents = [];
                // 遍历种子列表，筛选出正在下载的种子
                for (var i = 0; i < data.length; i++) {
                    if (data[i].state === "downloading") {
                        inProgressTorrents.push(data[i]);
                    }
                }
                // 存储qb完成种子的数量
                var aTag = $('#qbtCount');
                aTag.html(data.length - inProgressTorrents.length);
                // 存储qb正在下载种子的数量
                var aTag = $('#qbtdCount');
                aTag.html(inProgressTorrents.length);
            },
        });
    }
    function torrentHashInfo(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://zhoubanxian.angid.eu.org/index.php?url=" + url,
            onload: function (response) {
                console.log(response)
                var aTag = $('#torrentHashInfo');
                aTag.html(response.responseText);
                iyuu(response.responseText)
            },
            onerror: function (response) {
                console.error("GM_xmlhttpRequest error: ", response);
            }
        });
    }
    function iyuu(hash) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://zhoubanxian.angid.eu.org/iyuu.php?iyuutoken=" + GM_getValue("iyuutoken") + "&hash=" + hash,
            onload: function (response) {
                // 将JSON字符串解析为JavaScript对象
                console.log(response)
                const urlArray = JSON.parse(response.response);
                // Get the a element with the id "fzurl"
                const fzurl = document.getElementById("fzurl");
                // Insert each URL into the fzurl element as a separate link
                urlArray.forEach((url) => {
                    const link = document.createElement("a");
                    link.href = url;
                    link.textContent = url;
                    link.target = "_blank";
                    fzurl.appendChild(link);
                    fzurl.appendChild(document.createElement("br"));
                });
            },
        });
    }
    function getDownloadUrl() {
        // 在页面中寻找所有链接元素
        var links = $("a");
        // 筛选包含指定链接的元素（只查找链接中包含passkey和downhash的链接）
        var downloadLinks = links.filter(function () {
            if ($(this).attr("href")) {
                if ($(this).attr("href")) {
                    return (
                        $(this).attr("href").indexOf("passkey") > -1 ||
                        $(this).attr("href").indexOf("downhash") > -1
                    );
                }
            }
        });

        var torrentUrl = "";
        // 输出符合条件的链接元素
        downloadLinks.each(function () {
            // 适用于有完整下载地址的站点（其中去除upload标签是为了防止和auto_feed插件冲突）
            if (
                $(this).attr("href").indexOf("http") !== -1 &&
                $(this).attr("href").indexOf("upload") == -1
            ) {
                torrentUrl = $(this).attr("href");
            }
            // 适用于只有download.php以及passkey的站点（其中去除upload标签是为了防止和auto_feed插件冲突）
            if (
                $(this).attr("href").indexOf("http") == -1 &&
                $(this).attr("href").indexOf("download.php") !== -1 &&
                $(this).attr("href").indexOf("upload") == -1
            ) {
                var currentURL = window.location.href;
                var anchor = document.createElement("a");
                anchor.href = currentURL;
                var domain = anchor.protocol + "//" + anchor.hostname + "/";
                torrentUrl = domain + $(this).attr("href");
            }
            // 适配馒头站点（其中去除upload标签是为了防止和auto_feed插件冲突）
            if (
                $(this).attr("href").indexOf("https=1") !== -1 &&
                $(this).attr("href").indexOf("download.php") !== -1
            ) {
                var currentURL = window.location.href;
                var anchor = document.createElement("a");
                anchor.href = currentURL;
                var domain = anchor.protocol + "//" + anchor.hostname + "/";
                torrentUrl = domain + $(this).attr("href");
            }
        });
        console.log("这是pt助手获取到的种子下载地址：" + torrentUrl);
        return torrentUrl;
    }
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
        return uuid;
    }
})();
