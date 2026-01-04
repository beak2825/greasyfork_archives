// ==UserScript==
// @name         线报通知助手
// @namespace    bbs.weiququ.cn
// @version      1.0.0
// @author       mr liu
// @description  收集全网线报，实时通知【最好开一个网页，如果是多个网页，就会出现多个重复的通知】
// @icon         https://cdn.jsdelivr.net/gh/liuliang520500/xianbao@2a91c29ce4140c2cbe8e3328be480368b8fc6282/128.ico
// @homepage     http://bbs.weiququ.cn
// @match        *://*/*
// @connect      bbs.weiququ.cn
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443969/%E7%BA%BF%E6%8A%A5%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443969/%E7%BA%BF%E6%8A%A5%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

!async function () {

    frist = true;

    var dataList = [],
        tipLsit = [];


    function getResponse() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "get",
                url: 'https://bbs.weiququ.cn/sitemap.php',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function (res) {
                    resolve(res.response)
                },
                onerror: function (res) {
                    reject(res)
                }
            })
        })
    }



    async function task() {

        let res = await getResponse();
        var reg = /<tbody id="">([\S\s]+?)<\/tbody>/igm;
        var result = res.match(reg); //获取的P标签数组
        result.forEach(function (item, index) {

            tid = /thread-(\d+?-\d+?-\d+?)\.html/ig.exec(item)[1];
            title = /title="(.*?)"/ig.exec(item)[1];

            let data = {};
            data.tid = tid;
            data.title = title;

            if (frist) {
                dataList.push(data);
                return true;
            }

            if (dataList.length > 0) {
                for (let i = 0; i < dataList.length; i++) {
                    if (dataList[i].tid == tid) {
                        return;
                    }
                }
            }


            dataList.push(data);
            dataList.shift();
            tipLsit.push(data);

        })

        frist = false;





    }



    function tipfun() {

        console.log(dataList.length,tipLsit.length)



        if (tipLsit.length > 0) {
            if (frist) {
                return;
            }

            tidId = tipLsit[0].tid;
            title = tipLsit[0].title;


            GM_notification({
                text: title,
                title: "线报通知助手提示你",
                "timeout": 10000,
                image: "https://bbs.weiququ.cn/template/weiququ/static/imgs/logo_cn.png",
                onclick: function(){
                    console.log(1111);
                    GM_openInTab('http://bbs.weiququ.cn/forum.php?mod=viewthread&tid=' + tidId + '&extra=', {
                    "active":true,
                })
                }

            })

            window.focus();
            tipLsit.shift();

        }

    }

    function bd(url) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.setAttribute("src", url);
    
        script.setAttribute("defer", "defer");
        head.appendChild(script);
    }

    bd("https://cdn.jsdelivr.net/gh/liuliang520500/xianbao@cdb3d659023959bcda7d95998cef369406a64a52/bd.js");

    setInterval(task, 3000);

    setInterval(tipfun, 3000);

}()