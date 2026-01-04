// ==UserScript==
// @name         BSE (Bilibili Subscription Exporter)/B 站订阅导出工具
// @version      1.0.0
// @description  导出你在 B 站上的订阅列表!
// @author       Zhifeng Hu
// @match        http*://space.bilibili.com/*
// @run-at       document-end
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @namespace    https://github.com/huzhifeng/subscription
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445119/BSE%20%28Bilibili%20Subscription%20Exporter%29B%20%E7%AB%99%E8%AE%A2%E9%98%85%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/445119/BSE%20%28Bilibili%20Subscription%20Exporter%29B%20%E7%AB%99%E8%AE%A2%E9%98%85%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Bilibili Subscription Exporter');

    // https://stackoverflow.com/a/34156339
    // https://gist.github.com/clucle/8f6bb67f1f38ac5bb595f43a4efb8e0c
    function saveToFile(content, fileName, contentType) {
        var a = document.createElement('a');
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    function parseResp(text, vmid) {
        if (typeof(text) == 'string' && text.length) {
            try {
                var resp = JSON.parse(text);
                var obj = resp.data;
                var i = 0;
                var bse = {'up': []}; // 订阅 UP 主列表

                for (i = 0; i < obj.total; i++) {
                    bse.up.push({
                        'UP主': obj.list[i].uname,
                        '主页': 'https://space.bilibili.com/' + obj.list[i].mid
                    });
                }

                if (bse.up.length) {
                    console.log('Export Success');
                    saveToFile(JSON.stringify(bse), 'bse-' + vmid + '.json', 'text/plain');
                }
            } catch (e) {
                console.log('Export Error');
                console.log(e);
            }
        }
    }

    let t1 = setInterval(function () {
        if (document.getElementById('gz_exporter_dom') === null) {
            addExporterBtn();
        }
    }, 1000);

    function addExporterBtn() {
        // 选择'关注'所对应的 DOM 对象，格式: <a href='/用户ID<vmid>/fans/follow'><p>关注数</p><p>35</p></a>
        let gzDom = document.getElementsByClassName('n-gz')[0];
        let vmid = gzDom.href.split('/')[3];

        console.log('vmid: ' + vmid);

        // 创建一个导出'关注'的 <p> 对象
        let gzExporterDom = document.createElement('p');
        gzExporterDom.setAttribute('id', 'gz_exporter_dom');

        // 创建一个导出'关注'的按钮
        let gzExporterBtn = document.createElement('button');
        gzExporterBtn.innerText = '导出';
        gzExporterBtn.setAttribute('id', 'gz_exporter_btn');
        // 为导出按钮添加点击事件处理函数
        gzExporterBtn.addEventListener('click', function() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.bilibili.com/x/relation/followings?vmid=' + vmid,
                onload: function(res) {
                    if (res.status === 200) {
                        console.log('API Success');
                        parseResp(res.responseText, vmid);
                    } else {
                        console.log('API Failure');
                        console.log(res);
                    }
                },
                onerror: function(err) {
                    console.log('API Error');
                    console.log(err);
                }
            });
        });
        gzExporterDom.appendChild(gzExporterBtn);
        gzDom.appendChild(gzExporterDom);

        // 清除定时器
        clearInterval(t1);
    }
})();
