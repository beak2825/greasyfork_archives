// ==UserScript==
// @name         jenkins
// @namespace    http://tampermonkey.net/
// @version      2024.11.6
// @description  jenkins 增强
// @author       owell
// @match        *://jenkins-ci.igfax.net/job/*
// @match        *://jenkins-ci.igfax.net/**/job/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=igfax.net
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/499566/jenkins.user.js
// @updateURL https://update.greasyfork.org/scripts/499566/jenkins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 包装 GM_xmlhttpRequest 到 Promise 中
    function gmHttpRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: options.url,
                headers: options.headers || {},
                data: options.data || null,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error)
            });
        });
    }

    async function killPod(pod_name,namespace){
        const url = `https://om-platform.igfax.com/get_pod/?pod_name=${pod_name}&namespace=${namespace}`;
        const result = await gmHttpRequest({url:url,method:'DELETE',headers:{'Auth-Token':'A4P9TgExGybc8B9KMYc2xG7afORSOQbOjHTk7t1f3FrSCaEgFLEMLAEIvbQKv8hK'}});
        console.log(result);
    }

    async function restartPod(pod_name,namespace){
        const data = {"pod_name":pod_name,"namespace":namespace};
        const result = await gmHttpRequest({url:url,data:data,method:'PUT',headers:{'Auth-Token':'A4P9TgExGybc8B9KMYc2xG7afORSOQbOjHTk7t1f3FrSCaEgFLEMLAEIvbQKv8hK'}});
        console.log(result);
    }

    document.head.innerHTML += `
            <style>
            .pod_Running {
                color: #3a8a37;
            }
            .pod_Failed {
                color: #f41212;
            }
            </style>
        `;

    // 使用 async/await 实现类似同步调用
    async function renderPod() {
        const test = await gmHttpRequest({
            url: "https://om-platform.igfax.com/get_pod/?namespace=test&searcVal="+unsafeWindow.location.pathname.match(/job\/([^\/]+)/)[1],
            headers:{'Auth-Token':'A4P9TgExGybc8B9KMYc2xG7afORSOQbOjHTk7t1f3FrSCaEgFLEMLAEIvbQKv8hK'}
        });
        const dev = await gmHttpRequest({
            url: "https://om-platform.igfax.com/get_pod/?namespace=dev&searcVal="+unsafeWindow.location.pathname.match(/job\/([^\/]+)/)[1],
            headers:{'Auth-Token':'A4P9TgExGybc8B9KMYc2xG7afORSOQbOjHTk7t1f3FrSCaEgFLEMLAEIvbQKv8hK'}
        });
        const data = [...JSON.parse(test.responseText),...JSON.parse(dev.responseText)];
        console.log(data)

        // 查找 id 为 'abc' 的 div 元素
        var element = document.getElementById("pod_container");
        // 检查元素是否存在，然后从其父节点中删除它
        element && element.parentNode.removeChild(element);

        // 生成 HTML 内容
        let html = '<div id="pod_container" style="position:absolute;top:100px;right:10px"><table>';
        // 遍历数据数组
        data.forEach(item => {
            var formattedDate = "";
            if(item.createtime){
                const utcDate = new Date(item.createtime);
                // 转换并格式化日期到东八区时间
                const options = { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
                formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(utcDate);
            }
            html += `
            <tr>
                <td>
                <a href="https://omserver.igfax.com/#/conn-k8s?namespace=${item.namespace}&pod_name=${item.pod_name}" target="_blank">
                    <span>${formattedDate}</span>
                    <span>${item.namespace}</span>
                    <span>${item.pod_name}</span>
                </a>
                </td>
                <td><span>${item.restart_count}</span></td>
                <td><span class="pod_${item.status}">${item.status}</span></td>
                <td><span>${item.pod_ip}</span></td>
                <td><a href="javascript:restartPod('${item.pod_name}','${item.namespace}')">重启</a></td>
                <td><a href="javascript:killPod('${item.pod_name}','${item.namespace}')">杀死</a></td>
            </tr>
            `;
        });
        html+= "</table></div>";
        const div = document.createElement("div");
        div.innerHTML = html;
        document.body.append(div);
    };

    renderPod();

    // 每5000毫秒（即5秒）执行一次yourFunction
    setInterval(renderPod, 5000);
})();