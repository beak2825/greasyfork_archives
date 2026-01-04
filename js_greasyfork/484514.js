// ==UserScript==
// @name         Xingtan Download Edited Torrents
// @namespace    https://github.com/hui-shao
// @homepage     https://greasyfork.org/zh-CN/scripts/484514
// @version      0.1
// @description  个人中心获取已编辑的种子的下载链接
// @license      GPLv3
// @author       hui-shao
// @match        https://xingtan.one/userdetails.php?*
// @icon         https://xingtan.one/favicon.ico
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.7.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/484514/Xingtan%20Download%20Edited%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/484514/Xingtan%20Download%20Edited%20Torrents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        const father_node = document.querySelector("td:has(>div#ka5)");
        button.id = "btn001";
        button.textContent = "提取链接";
        button.style.borderRadius= "6px"
        button.style.height = "40px";
        button.style.width = "15%";
        button.style.backgroundColor = "#76EEC6";
        button.style.display = "none";
        button.onclick = async function () {
            button.disabled = true;
            get_passkey();
            button.disabled = false;
        };
        father_node.appendChild(button);
    }

    function get_passkey() {
        let passkey = "";
        const passkey_url = "https://xingtan.one/usercp.php";

        let arr = document.querySelectorAll("div#ka5 tbody>tr>td.rowfollow[align=left]>a");
        let url_str = "";

        $.when($.get(passkey_url))
            .done(function(resp) {
            // 处理成功的响应
            let tr_father = $(resp).find("tbody>tr:has(>td.nowrap:contains('密钥'))");
            passkey = $(tr_father).find(":last-child").text()
            console.log(passkey)

            for (let i=0; i < arr.length; i++){
                url_str += arr[i].href.replace("details", "download") + "&passkey=" + passkey + "\n";
            }
            download_txt("torrent_urls_withpasskey",url_str);

        })
            .fail(function(error) {
            // 处理失败的请求
            alert("请求passkey失败, 请手动添加：" + error.status + " " + error.statusText);
            for (let i=0; i < arr.length; i++){
                url_str += arr[i].href.replace("details", "download") + "\n";
            }
            download_txt("torrent_urls",url_str);

        });
    }

    function download_txt(filename, text) {
        console.debug("[Script] Start Download.");
        let pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
    }


    var button = document.createElement("button");

    document.onreadystatechange = ()=>{
        if(document.readyState == "complete") {
            console.debug("[Script] Document Complete.");

            createButton();

            // 监听节点变化
            let elem = document.querySelector("div#ka5");
            const observer = new MutationObserver((mutationsList, observer) => {
                console.log(mutationsList, observer);
                button.style.display = elem.style.display;
            });
            observer.observe(elem, {childList: true, attributes: true });
        }
    };

})();