// ==UserScript==
// @name         epuBee downloader
// @namespace    epuBee.downloader
// @version      1.0.0
// @description  try to take over the world!
// @author       wh1989
// @match        http://cn.epubee.com/books/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @connect     *
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/392977/epuBee%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/392977/epuBee%20downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //var $ = window.jQuery;
    $(window).bind("load", setTimeout(() => {
        console.log("epub download loaded")
        $(".ebookitem").each(function () {
            let title = $(this).attr("title");
            console.log(title);
            let str = $(this).children(".list_download").children("a")[0].getAttributeNode('onclick').value;
            let bid = str.match(/'(.*?)'/)[1];
            console.log(bid);
            $(this).append(`<div class="list_download"><a href="javascript:void(0);" class="dl_link" id="${bid}">下载epub</a></div>`)
        });
        $(".dl_link").click(dl_click);
    }, 500));
    var storeData;
    function dl_click(event) {
        var ele = event.target;
        var bid = ele.id;
        console.log(bid);
        var dateNow = new Date().toLocaleDateString();
        storeData = GM_getValue("epubDownloaderData", { 'users': [] });
        // data.users = [{
        //     id: '318943',
        //     ip: '134.234.123.123',
        //     date: '2019/11/24',
        //     times: 2
        // }];
        var user = storeData.users.find(u => u.date != dateNow || u.times < 3)
        if (user == null) {
            //创建账号
            ele.innerText = "创建账号...";
            user = {};
            user.ip = getRandomIp();
            user.date = dateNow;
            user.times = 0;
            genId(user, function (uid) {
                if (uid) {
                    user.id = uid;
                    storeData.users.push(user);
                    user = storeData.users[storeData.users.length - 1];
                    GM_setValue("epubDownloaderData", storeData);
                    saveAndDownload(ele, user, bid)
                } else {
                    ele.innerText = "创建账号失败！";
                }
            });
        } else {
            if (user.date != dateNow) {
                user.date = dateNow;
                user.times = 0;
                GM_setValue("epubDownloaderData", storeData);
            }
            saveAndDownload(ele, user, bid)
        }
    }

    function saveAndDownload(ele, user, bookId) {
        ele.innerText = "保存书籍...";
        console.log(user);
        console.log(bookId);
        saveBook(user, bookId, function (result) {
            if (result) {
                user.times++;
                GM_setValue("epubDownloaderData", storeData);

                ele.innerText = "获取下载地址...";
                getFileUrl(user, function (url) {
                    if (url) {
                        console.log("获取地址成功：" + url);
                        // GM_download(url, 'aaa.epub');
                        let a = document.createElement("a");
                        a.href = url;   //content
                        a.download = "filename";            //file name
                        a.click();
                        ele.innerText = "已下载！";
                    } else {
                        ele.innerText = "获取地址失败，点击重新下载";
                    }
                });
            } else {
                ele.innerText = "保存书籍失败，点击重新下载";
            }
        });
    }


    function genId(user, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://cn.epubee.com/keys/genid_with_localid.asmx/genid_with_localid",
            data: "{'localid':'0'}",
            headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': user.ip },
            onload: function (rsp) {
                console.log(rsp.response)
                let data = JSON.parse(rsp.response);
                if (data.d.length > 0) {
                    callback(data.d[0].ID)
                }
                else {
                    callback(null);
                }
            }
        });
    }

    function saveBook(user, bookId, callback) {
        // set cookie
        $.cookie("identify", user.id, {
            expires: 360,
            path: '/'
        });
        $.cookie("user_localid", `ip_${user.ip}`, {
            expires: 360,
            path: '/'
        });

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://cn.epubee.com/app_books/addbook.asmx/online_addbook",
            data: `{'bookid':'${bookId}','uid':${user.id},'act':'search'}`,
            headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': user.ip },
            onload: function (rsp) {
                let result = rsp.response == '{"d":[]}'
                if (!result) {
                    console.log("保存图书失败：" + rsp.response);
                }
                callback(result);
            }
        });
    }

    function getFileUrl(user, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://cn.epubee.com/files.aspx",
            headers: { 'X-Forwarded-For': user.ip },
            onload: function (rsp) {
                var url = rsp.response.match(/<a class="child_send" href="(.*?)" target="_Reader">/)[1];
                if (url) {
                    url = 'http://cn.epubee.com/' + url;
                    GM_xmlhttpRequest({
                        url: url,
                        method: "GET",
                        // ignoreRedirect:true,
                        onload: function (rsp) {
                            console.log(rsp);
                            url = rsp.finalUrl;
                            if (url) {
                                url = url.match(/book=(.*?)&/)[1];
                                url = `http://reader.epubee.com/${url}.epub`;
                            }
                            callback(url);
                        }
                    })
                } else {
                    callback(null);
                }
            }
        });
    }

    function getRandomIp() {
        var ip_long = [
            [607649792, 608174079], // 36.56.0.0-36.63.255.255
            [1038614528, 1039007743], // 61.232.0.0-61.237.255.255
            [1783627776, 784676351], // 106.80.0.0-106.95.255.255
            [2035023872, 2035154943], // 121.76.0.0-121.77.255.255
            [2078801920, 2079064063], // 123.232.0.0-123.235.255.255
            [-1950089216, -1948778497], // 139.196.0.0-139.215.255.255
            [-1425539072, -1425014785], // 171.8.0.0-171.15.255.255
            [-1236271104, -1235419137], // 182.80.0.0-182.92.255.255
            [-770113536, -768606209], // 210.25.0.0-210.47.255.255
            [-569376768, -564133889], // 222.16.0.0-222.95.255.255
        ];
        var rand_arr = ip_long[Math.floor(Math.random() * 10)]
        var rand_long = rand_arr[0] + Math.floor(Math.random() * (rand_arr[1] - rand_arr[0] - 1)) + 1
        //return rand_long;
        return long2ip(rand_long);
    }

    function long2ip(proper_address) {
        if (!isFinite(proper_address)) {
            return false
        }
        return [proper_address >>> 24, proper_address >>> 16 & 0xFF, proper_address >>> 8 & 0xFF, proper_address & 0xFF].join('.')
    }
})();