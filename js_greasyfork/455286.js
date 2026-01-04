// ==UserScript==
// @name         zhelper妙传码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通过zhelper搜索书籍点击直接复制秒传码
// @author       伟业
// @match        https://*.v4.zhelper.net/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhelper.net
// @grant        GM_xmlhttpRequest
// @connect      *
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455286/zhelper%E5%A6%99%E4%BC%A0%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/455286/zhelper%E5%A6%99%E4%BC%A0%E7%A0%81.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    //首先获取到所有的a标签
    var a = document.getElementsByClassName(" list-group-item list-group-item-action ");
    for (var i = 0; i < a.length; i++) {
        a[i].onclick = async function (e) {
            //阻止跳转
            stop(e)
            //获取链接
            var url = this.href;
            //获取z-libary 数据id
            console.log(e);
            console.log(this.herf);
            var id = url.split("/").slice(-2)[0];
            console.log(id);
            //获取接口url
            var baseUrl = 'https://mc.zhelper.net/miaochuan/' + id
            console.log(baseUrl);
            //模拟请求接口
            var mcMark =  await getmcMarkHtml(baseUrl)
            //复制到剪切板
            copyToClip(mcMark,'秒传码'+mcMark+'复制成功');
            return false;
        }
    }

    //获取到mcMark页面
    async function getmcMarkHtml(baseurl) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: baseurl,
                onload(xhr) {
                    console.log(xhr.responseText);
                    //解析html
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
                    var mark = htmlDoc.getElementById('Input 1').value;
                    console.log(validateTitle(mark));
                    resolve(validateTitle(mark));
                }
            });
        });
    }

    //复制内容到剪切板
    function copyToClip(content, message) {
        var aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        if (message == null) {
            alert("复制成功");
        } else{
            alert(message);
        }
    }

    //删除秒传码里面的特殊字符
    function validateTitle(title) {
        var pattern = '/[\\/:?"<>~|\r\n]+?/g';
        var newTitle = title.replace(/[\\/:?"<>|\r\n]/g, '_');
        return newTitle.trim();
    }




    //禁止跳转第三方网页
    function stop(event) {
        //IE和Chrome下是window.event 火狐下是event
        event = event || window.event;
        if (event.preventDefault) { //event.preventDefault(); 取消事件的默认动作
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

})();

