// ==UserScript==
// @name         wkyd本地加载数据id
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  用于让wkyd从本地加载数据id
// @author       looom
// @run-at       document-end
// @match        http://121.40.92.198:9090/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=92.198
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      sports.wfust.edu.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504902/wkyd%E6%9C%AC%E5%9C%B0%E5%8A%A0%E8%BD%BD%E6%95%B0%E6%8D%AEid.user.js
// @updateURL https://update.greasyfork.org/scripts/504902/wkyd%E6%9C%AC%E5%9C%B0%E5%8A%A0%E8%BD%BD%E6%95%B0%E6%8D%AEid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '0px';
    div.style.left = '20%';
    div.style.zIndex = '999';
    div.style.color = '#fff';
    div.innerHTML = '加载数据id:<input type="number" id="dataId"><button id="suseridButton">查询</button>';

    // 将div插入到body中
    document.body.appendChild(div);

    // 连接到本地查询
    function getuserbyid_local () {
        const dataId = document.getElementById('dataId').value;
        if (!dataId) return alert('请输入一个数据ID');
        console.log("本地查询:"+dataId)

        GM_xmlhttpRequest({
            method: 'GET',
            url: `http://127.0.0.1:9093/get_markList_bydataId?data_id=${dataId}`,
            timeout: 1800000,
            headers: {
                "Content-Type": "application/json ; charset=utf-8"
            },
            onload: xhr => {
                if (xhr.status === 200) {
                    const response = xhr.responseText;
                    const data = JSON.parse(response);
                    alert('数据id查询结果: ' + JSON.stringify(data, null, 2));
                    window.mapshowOLDMAPD_DataCon('['+response+']', document.getElementById("js_xh_map_div"));
                } else {
                    alert('查询失败: ' + xhr.status);
                    console.log(xhr);
                }
            },
            onerror: () => alert('网络错误')
        });
    }

    // 连接到学校服务器查询
    function getuserbyid_wfust () {
        const dataId = document.getElementById('dataId').value;
        if (!dataId) return alert('请输入一个数据ID');
        console.log("学校服务器查询:"+dataId)

        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://sports.wfust.edu.cn/api/run/getRunInfo?salt="+document.getElementById('salt').value+"&sign="+document.getElementById('sign').value,
            timeout: 30 * 60 * 1000,
            data: {
                "id": dataId
            },
            headers: {
                Origin: "sports.wfust.edu.cn",
                Referer: "sports.wfust.edu.cn",
                Host: "sports.wfust.edu.cn",
                "Content-Type": "application/json ; charset=utf-8"
            },
            onload: xhr => {
                if (xhr.status === 200) {
                    const response = xhr.responseText;
                    const data = JSON.parse(response);
                    alert('数据id查询结果: ' + JSON.stringify(data, null, 2));
                    window.mapshowOLDMAPD_DataCon('['+response+']', document.getElementById("js_xh_map_div"));
                } else {
                    alert('查询失败: ' + xhr.status);
                    console.log(xhr);
                }
            },
            onerror: () => alert('网络错误')
        });
    }

    // 连接到本地服务器再跳到学校服务器查询
    function getuserbyid_local_wfust () {

        const dataId = document.getElementById('dataId').value;
        if (!dataId) return alert('请输入一个数据ID');
        console.log("本地查询:"+dataId)

        GM_xmlhttpRequest({
            method: 'GET',
            url: `http://127.0.0.1:9093/wfust/get_markList_bydataId?data_id=${dataId}&salt=${document.getElementById('salt').value}&sign=${document.getElementById('sign').value}`,
            timeout: 1800000,
            headers: {
                "Content-Type": "application/json ; charset=utf-8"
            },
            onload: xhr => {
                if (xhr.status === 200) {
                    const response = xhr.responseText;
                    const data = JSON.parse(response);
                    const dataString = JSON.stringify(data.data)
                    console.log(data);
                    mapshowOLDMAPD_DataCon('[' + dataString + ']', document.getElementById("js_xh_map_div"));
                } else {
                    alert('查询失败: ' + xhr.status);
                    console.log(xhr);
                }
            },
            onerror: () => alert('网络错误')
        });
    }

    document.getElementById('suseridButton').addEventListener('click', getuserbyid_local_wfust);

})();