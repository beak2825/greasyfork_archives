// ==UserScript==
// @name         t66y
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Extract the page content
// @author       Syncxplus
// @license      Unlicense
// @match        http*://*.t66y.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/412044/t66y.user.js
// @updateURL https://update.greasyfork.org/scripts/412044/t66y.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let button = "<div style='background:gray;color:white;cursor:pointer;padding:.25rem .5rem;display:flex;font-size:1rem;position:fixed;top:0;z-index:9999'><div id='sxbtn-cl-preview' style='margin-right:1rem'>Preview</div><div id='sxbtn-cl-upload'>Copy</div></div>";
    document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', button);
    document.getElementById('sxbtn-cl-preview').onclick = function () {
        let data = cl_read();
        if (data.content) {
            cl_preview(data.content);
        }
    }
    document.getElementById('sxbtn-cl-upload').onclick = function () {
        let data = cl_read();
        if (data.content) {
            cl_copy(data.tid, data.content);
            //cl_save(data.tid, data.page, data.content);
            //cl_upload(data.tid, data.page, data.content);
        }
    }

    function cl_read() {
        let params = [];
        let search = location.search.substr(1);
        if (search) {
            search.split("&").forEach(function (i) {
                let split = i.split("=");
                params[split[0]] = split[1];
            })
        }
        if (params.toread) {
            let tid = params.tid;
            let page = params.page || 1;
            let raw = document.querySelectorAll(".tpc_content");
            if (tid && page && raw.length > 0) {
                let content = "";
                raw.forEach(function (e) {
                    content += e.innerHTML
                        //.replace(/(&nbsp; &nbsp;)/g, "\n\n")
                        //.replace(/(<br>){2,}/g, "\n\n")
                        .replace(/(<br>)+/g, "\n\n")
                        .replace(/<.*?>/g, '');
                })
                return {
                    tid: tid,
                    page: page || 1,
                    content: content,
                };
            }
        }
        alert("Read Nothing!");
        return {};
    }

    function cl_preview(content) {
        alert(content);
    }

    function cl_upload(name, page, content) {
        let options = {
            api: '/server/index.php?s=/api/item/updateByApi',
            api_key: '',
            api_token: '',
            cat_name: name,
            page_title: page,
            page_content: content,
        };
        GM_xmlhttpRequest({
            url: options.api,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: JSON.stringify(Object.keys(options)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options[k]))
                .join('&')),
            timeout: 5000,
            onloadstart: function () {
                alert('Uploading: ' + name + ', ' + page + ', ' + content.substr(0, 100))
            },
            onload: function (response) {
                if (response.readyState && response.status == 200) {
                    alert('Success');
                } else {
                    error(response);
                }
            },
            onerror: error,
        });
    }

    function cl_save(name, page, content) {
        let file = new File([content], name + page, {type: 'text/markdown;charset=utf-8'});
        saveAs(file);
    }

    function cl_copy(name, content) {
        GM_setClipboard(content, {type: 'text/markdown;charset=utf-8'});
        alert(name + ' copied');
    }

    function error(raw) {
        alert('Error happens!');
        console.log(raw);
    }
})();