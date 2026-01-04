// ==UserScript==
// @name         SangTacViet Full Reading Page & Auto Collect Items
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Thiết lập đọc full màn hình, tự động nhặt bảo trên sangtacviet
// @author       @mkbyme
// @match        *sangtacviet.pro/truyen/*
// @match        *sangtacvietfpt.com/truyen/*
// @match        *sangtacviet.com/truyen/*
// @match        *sangtacviet.me/truyen/*
// @match        *sangtacviet.vip/truyen/*
// @match        *14.225.254.182/truyen/*
// @icon         http://14.225.254.182/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439106/SangTacViet%20Full%20Reading%20Page%20%20Auto%20Collect%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/439106/SangTacViet%20Full%20Reading%20Page%20%20Auto%20Collect%20Items.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var count = 0;
    var waitTime = 0;
    var cType = 0;
    var collectFn = function () {
        return new Promise((resolve, reject) => {
            let itemInfo = {
                name: "",
                info: "",
                level: "",
                error: "",
                message: "",
                type: 3
            };
            try {
                var params = "ngmar=collect&ajax=collect";
                var http = new XMLHttpRequest();
                var url = '/index.php';
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {
                        try {
                            itemInfo = JSON.parse(http.responseText);
                            window.g("cInfo").innerHTML = itemInfo.info;
                            window.g("cName").innerHTML = itemInfo.name;
                            window.g("cLevel").innerHTML = itemInfo.level;
                            itemInfo.message = `Tên: <b style="color:red">${itemInfo.name}</b><br/>Cấp: ${itemInfo.level}<br/>Thông tin:  ${itemInfo.info}`
                            resolve(itemInfo);
                            cType = itemInfo.type;
                            if (cType == 3 || cType == 4) {
                                window.g("cInfo").contentEditable = true;
                                window.g("cInfo").style.border = "1px solid black";
                                window.g("cName").contentEditable = true;
                                window.g("cName").style.border = "1px solid black";
                                window.g("addInfo").innerHTML = "Bạn vừa đạt được công pháp/vũ kỹ, hãy đặt tên và nội dung nào.<br>";
                            }
                        }
                        catch (f) {
                            alert(http.responseText);
                            itemInfo.error = http.responseText;
                            resolve(itemInfo);
                        }
                    }
                }
                http.send(params);
            } catch (err) {
                window.console.error(err);
                itemInfo.error = err;
                resolve(itemInfo);
            }
        });
    };
    var submitFn = function () {
        return new Promise((resolve, reject) => {

            try {
                var params = "ajax=fcollect&c=137";
                if (cType == 3 || cType == 4) {
                    var nname = window.g("cName").innerText;
                    if (nname.length > 80) {
                        return;
                        alert("Tên công pháp/vũ kỹ quá dài.");
                    }
                    params += "&newname=" + encodeURI(nname) + "&newinfo=" + encodeURI(window.g("cInfo").innerText);
                }
                var http = new XMLHttpRequest();
                var url = '/index.php';
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                http.onreadystatechange = function () {
                    if (http.readyState == 4 && http.status == 200) {
                        try {
                            var x = JSON.parse(http.responseText);
                            if (x.code == 1) {
                                window.ui.notif("Thành công");
                            } else {
                                if (x.err.contains("không nhặt được gì")) {
                                    window.ui.alert("Thật đáng tiếc, kỳ ngộ đã không cánh mà bay, có duyên gặp lại ah.");
                                } else {
                                    window.ui.alert(x.err);
                                }
                            }
                            resolve("Nhặt bảo thành công");
                        }
                        catch (e) {
                            window.console.error("Nhặt bảo thất bại(ex2)");
                            resolve(http.responseText);
                        }
                    }
                }
                http.send(params);
            } catch (err) {
                window.console.error(err);
                resolve("Nhặt bảo thất bại(ex1)");
            }
        });

    };
    var randomFn = function (min, max) {
        min = min || 1000;
        max = max || 10000;
        return Math.floor((Math.random()) * (max - min + 1)) + min;
    };
    var randomTimeoutFn = function (time, action) {
        time = time || randomFn();
        window.console.log("STVAuto delay start in ", time, "ms");
        var handle = setTimeout(() => {
            action();
            clearTimeout(handle);
            window.console.log("STVAuto delay end in ", time, "ms");
        }, time);
    };
    function sleep(time) {
        time = time || randomFn(500, 3000);
        window.console.log("STVAuto sleep in ", time, "ms");
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }
    setInterval(() => {
        let div = document.getElementById('content-container');
        div.style.margin = "0px";
        div.style.maxWidth = "100%";
        div.style.margin = "0px";
        div.style.padding = "0px";
        let btn = document.querySelector('.contentbox .btn.btn-info[id]');
        if (count == 0) {
            waitTime = randomFn();
        }
        if (btn) {
            count++;
            window.ui.notif(`Phát hiện bảo vật (${count}) - Chờ trong ${waitTime} ms sẽ tự động nhặt vật phẩm`);
            window.console.log("STVAuto: Phát hiện bảo vật...", count);
            if (count == 1) {
                //set random timeout
                randomTimeoutFn(waitTime, () => {
                    collectFn().then(async (item) => {
                        let format = `color:red;font-size:16px;font-weigth:bold;`;
                        console.log("STVAuto: ------------------------");
                        window.console.log("STVAuto: Tìm thấy " + item.name);
                        console.log(`%c${item.name}, Level: ${item.level}, ${item.info}`, format);

                        await sleep();
                        await submitFn().then((resolve, reject) => {
                            let showTime = 10;
                            let notiCountHandle = setInterval(() => {
                                showTime--;
                                window.ui.notif(`Nhặt thành công(${showTime})<br/>${item.message}<br/>Sử dụng ngay <b><a href="/user/0/" target="_blank">tại đây<a></b>`);
                                if (showTime <= 1) {
                                    clearInterval(notiCountHandle);
                                }
                            }, 1000);
                            window.console.log("STVAuto: " + resolve + item.name);
                        });
                        console.log("STVAuto: ------------------------");
                    });
                    window.jQuery('.contentbox .btn.btn-info[id]').css('font-size', '270px').css('filter', 'none');
                    btn.remove();
                });
            }
        }
        else {
            count = 0;
        }
        //set background color
        var bodyBg = document.getElementById('full');
        var contentBg = document.querySelector('#content-container .contentbox');
        if(bodyBg){
            bodyBg.style.backgroundColor = "rgba(234, 228, 211, 0.7)";
        }
        if(contentBg){
            contentBg.style.backgroundColor = "rgba(234, 228, 211, 0.7)";
        }
    }, 1000);

    //set background
    window.localStorage.setItem('backgroundcolor','rgb(234, 228, 211)')
})();