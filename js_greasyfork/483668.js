// ==UserScript==
// @name         13听书网下载工具
// @namespace    Max
// @version      v1.3-20240110
// @description  自动下载13听书网音频
// @author       Max
// @run-at       document-end
// @license      MIT
// @match        https://www.ting13.com/play/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/483668/13%E5%90%AC%E4%B9%A6%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/483668/13%E5%90%AC%E4%B9%A6%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

let cfg_download_interval = 5
let cfg_prefix_num_switch = false
let cfg_prefix_num_now = 1

let stop_download = false

function gdown(data){
    let filename = document.querySelector("div.p-h > h1").innerText.split('正在播放：')[1].split('.')[0]
    filename = filename + '.m4a'
    console.log(cfg_prefix_num_switch)
    if (cfg_prefix_num_switch) {
        filename = cfg_prefix_num_now + '-' + filename
    }
    let DOWNLOAD_INTERVAL = cfg_download_interval * 1000;
    console.log({url:data, name:filename});
    GM_download({
        url:data,
        name: filename, //gname[gname.length-1].split("?")[0],
        onerror:function(e){
            window.open(data);
        },
        onload:function(e){
            setTimeout(function() {
                if (stop_download) {
                    console.log('stop!');
                    return;
                }
                let new_url = document.querySelector("#nexturl").href
                cfg_prefix_num_now = parseInt(cfg_prefix_num_now) + 1
                new_url = new_url + '?dcfg=' + cfg_download_interval + '|' + cfg_prefix_num_switch + '|' + cfg_prefix_num_now;
                window.location = new_url
            }, DOWNLOAD_INTERVAL)
        },
    });
}

function start_download() {
    var dofind=true,gurl=null;
    setInterval(function(){
        if(dofind){
            var ga=document.getElementsByTagName("audio");
            if(ga.length>0){
                gurl=ga[0].getAttribute("src");
            }
            if(gurl!=null){
                dofind=false;
                gdown(gurl);
            }
        }
    },1000);
}

(function() {
    'use strict';
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'floating-settings-panel';
    settingsPanel.style.position = 'fixed';
    settingsPanel.style.top = '20px';
    settingsPanel.style.right = '20px';
    settingsPanel.style.width = '200px';
    settingsPanel.style.padding = '10px';
    settingsPanel.style.background = '#fff';
    settingsPanel.style.border = '1px solid #ccc';
    settingsPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    settingsPanel.style.zIndex = '9999';

    settingsPanel.innerHTML = `
    <div id="mydrag" style="background-color:#08F; cursor:move">
        <h3>设置</h3>
        </div>
        <label for="cfg_prefix_num_switch">文件名添加前缀数字</label>
        <input type="checkbox" id="cfg_prefix_num_switch">
        <br>
        <label for="cfg_prefix_num_now">目前前缀数字</label>
        <input type="number" id="cfg_prefix_num_now">
        <br>
        <label for="cfg_download_interval">下载间隔(秒)</label>
        <input type="number" id="cfg_download_interval">
        <hr>
        <button type="button" id="cfg_download_start">开始下载!</button>
        <button type="button" id="cfg_download_stop">停止下载!</button>
        <hr>
        <p>修改设置后请点“开始下载”</p>
        <p>下载间隔过小会封IP，推荐5秒</p>

    `;

    document.body.appendChild(settingsPanel);

    let isDragging = false;
    let offsetX, offsetY;

    const dragDiv = document.getElementById('mydrag');

    dragDiv.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - settingsPanel.getBoundingClientRect().left;
        offsetY = e.clientY - settingsPanel.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            settingsPanel.style.top = (e.clientY - offsetY) + 'px';
            settingsPanel.style.left = (e.clientX - offsetX) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    function loadSettings() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const dcfg = params.get('dcfg');

        if (dcfg) {
            const split_dcfg = dcfg.split('|')

            cfg_download_interval = split_dcfg[0]
            cfg_prefix_num_switch = split_dcfg[1] == 'true' ? true : false;
            cfg_prefix_num_now = split_dcfg[2]

            start_download();
        }

        document.getElementById('cfg_prefix_num_switch').checked = cfg_prefix_num_switch;
        document.getElementById('cfg_prefix_num_now').value = cfg_prefix_num_now;
        document.getElementById('cfg_download_interval').value = cfg_download_interval;
    }

    function on_start_download() {
        let cfg_download_interval = document.getElementById('cfg_download_interval').value
        let cfg_prefix_num_switch = document.getElementById('cfg_prefix_num_switch').checked
        let cfg_prefix_num_now = document.getElementById('cfg_prefix_num_now').value
        let url = window.location.href;
        url = url.split('?dcfg')[0]
        url = url + '?dcfg=' + cfg_download_interval + '|' + cfg_prefix_num_switch + '|' + cfg_prefix_num_now;
        window.location.href = url;
    }

    document.getElementById('cfg_download_start').addEventListener('click', function(event) {
        on_start_download();
    });

    document.getElementById('cfg_download_stop').addEventListener('click', function(event) {
        stop_download = true;
    });

    loadSettings();
})();