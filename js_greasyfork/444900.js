// ==UserScript==
// @name     菁师帮免登陆下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description   菁师帮免登陆下载!
// @author       ripple57
// @license MIT
// @match        http://www.jingshibang.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/444900/%E8%8F%81%E5%B8%88%E5%B8%AE%E5%85%8D%E7%99%BB%E9%99%86%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444900/%E8%8F%81%E5%B8%88%E5%B8%AE%E5%85%8D%E7%99%BB%E9%99%86%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    function addXMLRequestCallback(callback) {
        //   var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            XMLHttpRequest.callbacks.push(callback);
        } else {
            XMLHttpRequest.callbacks = [callback];
            let oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                for (let i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                oldSend.apply(this, arguments);
            };
        }
    }
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("ur===>", xhr.responseURL);
                console.log("response===>", xhr.responseText);
                let url = xhr.responseURL;
                if (
                    url.indexOf("smallclass/pcmaterial") > -1 ||
                    url.indexOf("api/productspc") > -1
                ) {
                    if (url.indexOf("limit=1000") == -1) {
                        addButton(url, xhr.response);
                    }
                }
            }
        });
    });
    var obj = "";
    function download(obje) {
        for (let index = 0; index < obje.length; index++) {
            let item = obje[index];
            let address =
                item.word_answer || item.word_paper || item.pdf_answer || item.pdf_paper;
            console.log("http://www.jingshibang.com" + address,item.store_name);
            GM_download("http://www.jingshibang.com"+address,item.store_name)
        }
    }
    function addButton(url, response) {
        // setTimeout(() => {
        // $(".mybth").remove();
        obj = JSON.parse(response).data;
        for (let index = 0; index < obj.length; index++) {
            let item = obj[index];
            let address =
                item.word_answer || item.word_paper || item.pdf_answer || item.pdf_paper;
            address = "http://www.jingshibang.com"+address;
            $('[href*="/home/file_detail"]:eq(' + index + ")").before(
                "<button data-add='" +address +"'  data-name=' " +item.store_name +"' class='btn0 down el-button el-button--primary el-button--mini mybth'>直接下载</button>"
            );

        }

        $("body").append(
            "<button id = 'btn1'  class='down el-button el-button--primary el-button--mini mybth'>下载当前分类所有资料" +
            obj[0].count +
            "条</button>"
        );

        $(".divpagination").append(
            "<button id = 'btn2' class='down el-button el-button--primary el-button--mini mybth'>下载当前页" +
            obj.length +
            "条</button>"
        );
        $(".btn0").click(function (e) {
            let address =e.target.getAttribute('data-add');
            let name = e.target.getAttribute('data-name');
            console.log("直接下载地址",address,name)
            GM_download(address,name)
        })
        $("#btn1").click(function (e) {
            let num = obj[0].count;
            for (let page = 1; page < num / 1000 + 1; page++) {
                url = url.replace(/page=\d*&limit=\d*/, "page=" + page + "&limit=1000");
                console.log("==>", url);
                $.ajax({
                    type: "get",
                    url: url,
                    success: function (response) {
                        download(response.data);
                    },
                });
            }
        });
        $("#btn2").click(function (e) {
            download(obj);
        });
        // }, 50);
    }


})();





