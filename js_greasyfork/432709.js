// ==UserScript==
// @name         pushMagLinkTo115Offline
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @version      0.0.1
// @description  1. 推送到115离线 2. btdig页面可以添加按钮推送到115离线
// @author       skywoodlin
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lovefield@2.1.12/dist/lovefield.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @resource     icon https://cdn.jsdelivr.net/gh/hobbyfang/javOldDriver@master/115helper_icon_001.jpg
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @include      *
// @connect      *
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/432709/pushMagLinkTo115Offline.user.js
// @updateURL https://update.greasyfork.org/scripts/432709/pushMagLinkTo115Offline.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 115用户ID
    let jav_userID = GM_getValue('jav_user_id', 0);
    // icon图标
    let icon = GM_getResourceURL('icon');
    // 瀑布流状态：1：开启、0：关闭
    let waterfallScrollStatus = GM_getValue('scroll_status', 1);
    // 当前网页域名
    let domain = location.host;
    // 数据库
    let javDb;
    // 表
    let myMovie;

    function pushTo115OfflineDownload(magUrl) {
        //获取115 token接口
        let promise = request('http://115.com/?ct=offline&ac=space&_=' + new Date().getTime());
        promise.then((responseDetails) => {
            if (responseDetails.responseText.indexOf('html') >= 0) {
                //未登录处理
                Common.notifiy("115还没有登录",
                    '请先登录115账户后,再离线下载！',
                    icon,
                    'http://115.com/?mode=login'
                );
                return false;
            }
            let sign115 = JSON.parse(responseDetails.response).sign;
            let time115 = JSON.parse(responseDetails.response).time;
            console.log("uid=" + jav_userID + " sign:" + sign115 + " time:" + time115);
            console.log("rsp:" + responseDetails.response);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://115.com/web/lixian/?ct=lixian&ac=add_task_url', //添加115离线任务接口
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: "url=" + encodeURIComponent(magUrl) + "&uid=" + jav_userID + "&sign=" + sign115
                    + "&time=" + time115,
                onload: function (responseDetails) {
                    let lxRs = JSON.parse(responseDetails.responseText); //离线结果
                    if (lxRs.state) {
                        //离线任务添加成功
                        Common.notifiy("115老司机自动开车",
                            '离线任务添加成功',
                            icon,
                            'http://115.com/?tab=offline&mode=wangpan'
                        );
                    } else {
                        //离线任务添加失败
                        if (lxRs.errcode == '911') {
                            lxRs.error_msg = '你的帐号使用异常，需要在线手工重新验证即可正常使用。';
                        }
                        Common.notifiy("失败了",
                            '请重新打开115,' + lxRs.error_msg,
                            icon,
                            'http://115.com/?tab=offline&mode=wangpan'
                        );
                    }
                    console.log("sign:" + sign115 + " time:" + time115);
                    console.log("磁链:" + magUrl + " 下载结果:" + lxRs.state + " 原因:" + lxRs.error_msg);
                    console.log("rsp:" + responseDetails.response);
                }
            });

        });
        // event.preventDefault(); //阻止跳转
    }

    function request(url, referrerStr, timeoutInt) {
        // 点击`115离线`按钮发送请求
        return new Promise((resolve, reject) => {
            console.log(`发起网址请求：${url}`);
            GM_xmlhttpRequest({
                url,
                method: 'GET',
                headers: {
                    "Cache-Control": "no-cache",
                    referrer: referrerStr
                },
                timeout: timeoutInt > 0 ? timeoutInt : 20000,
                onload: response => { //console.log(url + " reqTime:" + (new Date() - time1));
                    response.loadstuts = true;
                    resolve(response);
                },
                onabort: response => {
                    console.log(url + " abort");
                    response.loadstuts = false;
                    resolve(response);
                },
                onerror: response => {
                    console.log(url + " error");
                    console.log(response);
                    response.loadstuts = false;
                    resolve(response);
                },
                ontimeout: response => {
                    console.log(`${url} ${timeoutInt}ms timeout`);
                    response.loadstuts = false;
                    response.finalUrl = url;
                    resolve(response);
                },
            });
        });
    }

    let Common = {
        /**
         * 方法: 通用chrome通知
         * @param title
         * @param body
         * @param icon
         * @param click_url
         */
        notifiy: function (title, body, icon, click_url) {
            var notificationDetails = {
                text: body,
                title: title,
                timeout: 3000,
                image: icon,
                onclick: function () {
                    window.open(click_url);
                }
            };
            GM_notification(notificationDetails);
        },
    }
    function createdomForBtdig(){
        let $searchBar = $("form");
        if($searchBar && $searchBar.length === 1) {
            let template = `<button id="115btnForBTDig" style="height:40px;width:120px;color: red;font-size: 24px">115离线</button>`;
            $searchBar.after(template);
        }
    }

    function createdomForLocalhost() {
        let childNode = document.createElement("div");
        childNode.setAttribute("id", 'main');
        childNode.setAttribute("style", "height:400px;width:800px")

        let template = `<input id="magUrl" value="" style="width: 80%"><button id="115btnForLocalhost" style="height:30px;width:80px">115离线</button>`;

        childNode.innerHTML = template;
        document.getElementsByTagName('body')[0].appendChild(childNode);
    }


    function bindClickForLocalhost() {
        $(document).on('click', "#115btnForLocalhost", function () {
            let url = $("#magUrl").val();
            if (url && url.trim() !== "") {
                pushTo115OfflineDownload(url)
            }
        });
    }

    function bindClickForBtdig() {
        $(document).on('click', "#115btnForBTDig", function () {
            let $magItem = $(".fa.fa-magnet");
            if($magItem && $magItem.length !== 1){
                alert("请在详情页而不是在搜索页点击此按钮！！！")
                return;
            }

            let magUrl = $(".fa.fa-magnet").find("a").attr("href");
            if (magUrl && magUrl.trim() !== "") {
                pushTo115OfflineDownload(magUrl)
            }
        });
    }

    function mainRun() {
        if (domain.indexOf("localhost") >= 0) {
            createdomForLocalhost();
            bindClickForLocalhost();
        }else if(domain.indexOf("btdig.com") >= 0) {
            createdomForBtdig();
            bindClickForBtdig();
        }

    }

    mainRun();
})();