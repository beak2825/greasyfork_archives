// ==UserScript==
// @name         ScienceReading PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show download link of books on sciencereading.cn
// @author       Null
// @match        https://book.sciencereading.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencereading.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449740/ScienceReading%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/449740/ScienceReading%20PDF%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // let p = /https:\/\/wkobwp.sciencereading.cn\/(.+)\/(.+)\/getDocumentbuffer\/tag0xabcdef/;
    // if (p.test(location.href)) {
    //     let match = location.href.match(p);
    //     let url = `https://wkobwp.sciencereading.cn/api/file/${match[1]}/getDocumentbuffer`;
    //     let name = `${match[2]}.pdf`
    //     download(url, name);
    //     window.close();
    // };


    function download(url, name) {
        let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        save_link.href = url;
        save_link.download = name;
        let ev = new MouseEvent('click');
        save_link.dispatchEvent(ev);
    };

    function add_loading_button() {
        let btn = document.createElement('button');
        btn.setAttribute('class', 'btn download_btn');
        btn.setAttribute('id', 'sr_dl');
        btn.setAttribute('type', 'button');
        btn.setAttribute('disabled', '');
        btn.innerText = '加载中';
        document.getElementById('offlineTr').appendChild(btn);
    };

    function add_fail_button() {
        let btn = document.getElementById('sr_dl');
        btn.innerText = '加载失败!'
    };

    function add_download_button(docid, bookid) {
        let btn = document.getElementById('sr_dl');
        let url = `https://wkobwp.sciencereading.cn/api/file/${docid}/getDocumentbuffer`;
        btn.setAttribute('onclick', `navigator.clipboard.writeText(\'${url}\');alert('下载链接已复制到剪贴板!\\n\\n图书标识: ${bookid}\\n\\n下载地址: ${url}\\n\\n可直接复制下载链接到浏览器地址栏或下载器中下载.');`)
        btn.innerText = '下载';
        btn.removeAttribute('disabled');
        return;
    };


    if (location.href.includes('https://book.sciencereading.cn/shop/book/Booksimple/show.do')) {
        add_loading_button();
        let node = document.getElementById('id');
        if (!node) return;
        let bookid = node.value;
        if (typeof (bookid) === 'string') {
            fetch("https://wkobwp.sciencereading.cn/api/file/add", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "accesstoken": "accessToken",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"104\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                "referrer": "https://book.sciencereading.cn/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `params=%7B%22params%22%3A%7B%22userName%22%3A%22Guest%22%2C%22userId%22%3A%22446170d020a9468a811421619d0f1b7d%22%2C%22file%22%3A%22http%3A%2F%2F159.226.241.32%3A81%2F${bookid}.pdf%22%7D%7D&type=http`,
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            }).then(
                res => res.json()
            ).then(
                res => {
                    if (res.result === 'OutOfFileSizeLimit') {
                        fetch("https://wkobwp.sciencereading.cn/spi/v2/doc/pretreat", {
                            "headers": {
                                "accept": "*/*",
                                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                                "accesstoken": "accessToken",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"104\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-site"
                            },
                            "referrer": "https://book.sciencereading.cn/",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": `filetype=http&zooms=-1%2C100&tileRender=false&fileuri=%7B%22params%22%3A%7B%22userName%22%3A%22Guest%22%2C%22file%22%3A%22http%3A%2F%2F159.226.241.32%3A81%2F${bookid}.pdf%22%7D%7D&pdfcache=true&callback=`,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "omit"
                        }).then(
                            res => res.json()
                        ).then(
                            res => {
                                let taskid = res.resultBody.taskid;
                                function querytask(taskid) {
                                    fetch(`https://wkobwp.sciencereading.cn/api/v2/task/${taskid}/query`, {
                                        "headers": {
                                            "accept": "*/*",
                                            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                                            "sec-fetch-dest": "empty",
                                            "sec-fetch-mode": "cors",
                                            "sec-fetch-site": "same-site"
                                        },
                                        "referrer": "https://book.sciencereading.cn/",
                                        "referrerPolicy": "strict-origin-when-cross-origin",
                                        "body": null,
                                        "method": "GET",
                                        "mode": "cors",
                                        "credentials": "omit"
                                    }).then(
                                        res => res.json()
                                    ).then(
                                        res => {
                                            if (res.resultBody.result == '1') {
                                                setTimeout(function () { querytask(taskid); }, 5e3);
                                                return;
                                            };
                                            if (res.resultBody.result == '0') {
                                                let docid = res.resultBody.uuid;
                                                add_download_button(docid, bookid);
                                                return;
                                            };
                                            add_fail_button();
                                        }
                                    );
                                };
                                querytask(taskid);
                            }
                        );
                        return;
                    } else {
                        let docid = res.result;
                        add_download_button(docid, bookid);
                    }
                }
            )
        };
    };
})();