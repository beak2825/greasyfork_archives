// ==UserScript==
// @name         CRMEB论坛粘贴上传
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CRMEB论坛不支持粘贴上传，比较麻烦
// @author       飘逸的刘海
// @match        https://q.crmeb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crmeb.com
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444562/CRMEB%E8%AE%BA%E5%9D%9B%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/444562/CRMEB%E8%AE%BA%E5%9D%9B%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var images = []
    var path = window.location.pathname
    var id = Number(path.substring(path.lastIndexOf('/') + 1))
    //绑定粘贴事件 Ctrl+V
    bindPaste();


    //绑定粘贴事件
    function bindPaste() {
        $('body').prepend(`

    <div style="height: 400px;width: 400px;position: absolute;z-index: 999999;margin: 50px 0 0 20px;">
        <span id="count" style="font-size: 26px;color: red"></span>
        <p id="tishi"></p>
        <textarea id="inputvalue" class="dzq-textarea__inner" rows="16" style="height: 125px;width: 300px;border: 1px solid;background-color: #f5f7f8;"></textarea>
        <button id="reset" class="dzq-button _2uRPWiiz0XqKw-fAE6ccqq dzq-button--large dzq-button--primary">重置</button>
        <button id="submit" class="dzq-button _2uRPWiiz0XqKw-fAE6ccqq dzq-button--large dzq-button--primary">发送</button>

    </div>

    `)

        resetNumber()
        //定义变量存储获取的图片内容
        var blob;
        //获取body对象
        var body = document.getElementsByTagName("body");
        //定义body标签绑定的粘贴事件处理函数
        var fun = function (e) {
            //获取clipboardData对象
            var data = e.clipboardData || window.clipboardData;
            //获取图片内容
            blob = data.items[0].getAsFile();
            //判断是不是图片，最好通过文件类型判断
            var isImg = (blob && 1) || -1;
            let sendData = new FormData();
            sendData.append("file", blob);
            sendData.append("type", 1);
            $.ajax({
                type: 'POST', // 规定请求的类型（GET 或 POST）
                url: 'https://apiq.crmeb.com/apiv3/attachments', // 请求的url地址
                dataType: 'json', //预期的服务器响应的数据类型
                headers: {
                    authorization: `Bearer ` + localStorage.getItem("access_token").substring(1, localStorage.getItem("access_token").length - 1)
                },
                contentType: false, //
                processData: false, //不处理发送的数据
                data: sendData,
                success: function (res) {
                    console.log(res)
                    if (res.Code === 0) {
                        addImg(res)
                    }
                },
                error: function (err) {
                    console.log(err)
                },
            });
        }
        //通过body标签绑定粘贴事件，注意有些标签绑定粘贴事件可能出错
        body[0].removeEventListener('paste', fun);
        body[0].addEventListener('paste', fun);

        $('#submit').click(function () {

            var attachments = images.map(x => {
                return {
                    id: x,
                    type: 'attachments'
                }
            })

            let param = {
                attachments: attachments,
                content: $("#inputvalue").val(),
                id: id
            }

            $.ajax({
                type: 'POST', // 规定请求的类型（GET 或 POST）
                url: 'https://apiq.crmeb.com/apiv3/posts', // 请求的url地址
                dataType: 'json', //预期的服务器响应的数据类型
                headers: {
                    authorization: `Bearer ` + localStorage.getItem("access_token").substring(1, localStorage.getItem("access_token").length - 1),
                    'content-type': 'application/json; charset=utf-8'
                },
                contentType: 'application/json; charset=utf-8', //
                processData: false, //不处理发送的数据
                data: JSON.stringify(param),
                success: function (res) {
                    console.log(res)
                    $('#tishi').text(param.content + ' 提交成功，图片' + attachments.length + '张')
                    clearAllData()
                    setTimeout(() => {
                        $('#tishi').text('')
                    }, 3000)
                },
                error: function (err) {
                    console.log(err)
                },
            });

        })

        $('#reset').click(function () {
            clearAllData()
        })
    }


    function addImg(res) {
        // res.Data.id
        // res.Data.thumbUrl
        images.push(res.Data.id)

        $('#submit').after(`

        <div class="dzq-upload-list-card__item" id="${res.Data.id}">
            <img src="${res.Data.thumbUrl}" alt="下载.png"
                 class="dzq-upload-list-card__thumbUrl">
            <div class="dzq-upload-list-card__operate" >
                <div class="dzq-icon dzq-icon-DeleteOutlined" style="font-size: 16px;"></div>
            </div>
        </div>


    `)


        $(`#${res.Data.id}`).click(function () {
            removeImg(res.Data.id, true)
        })

    }

    function removeImg(id, removeImages) {
        $('#' + id).remove()
        if (removeImages) {
            var number = images.findIndex(x => x === id);
            if (number === -1) return
            images.splice(number, 1)
        }
        console.log(images, '22')
    }

    function clearAllData() {
        images.forEach(x => {
            console.log(x)
            console.log(images)
            removeImg(x)
        })
        images = []
        $("#inputvalue").val('')
    }

    function resetNumber() {
        $.ajax({
            type: 'GET', // 规定请求的类型（GET 或 POST）
            url: 'https://apiq.crmeb.com/apiv3/wallet/log', // 请求的url地址
            dataType: 'json', //预期的服务器响应的数据类型
            headers: {
                authorization: `Bearer ` + localStorage.getItem("access_token").substring(1, localStorage.getItem("access_token").length - 1)
            },
            contentType: 'application/json; charset=utf-8', //
            processData: false, //不处理发送的数据
            data: `walletLogType=income&page=1&perPage=5000&filter[startTime]=2022-01-01&filter[endTime]=2022-12-31`,
            success: function (res) {
                console.log(res)
                var count = 0;
                res.Data.pageData.forEach(x => {
                    console.log(Number(x.amount))
                    count += Number(x.amount)
                })
                $('#count').text('累积获得：' + count+'要加油哦')

            },
            error: function (err) {
                console.log(err)
            },
        });
    }

})();
