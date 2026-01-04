// ==UserScript==
// @name         批量吸血
// @namespace    http://tampermonkey.net/
// @version      2025-05-17
// @description  吸血
// @author       Sbeven
// @match        */torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterclub.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/536416/%E6%89%B9%E9%87%8F%E5%90%B8%E8%A1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/536416/%E6%89%B9%E9%87%8F%E5%90%B8%E8%A1%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function isHttps(url){
        if(url.indexOf('https://') === 0){
            return true;
        }
        return false;
    }
    function getPasskey() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', './getrss.php', false);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('inclbookmarked=0&showrows=10&https=1');
        let res = xhr.responseText;
        let l = res.indexOf('passkey=') + 8;
        let r = l + 32;
        return res.substring(l, r);
    }

    function trimTrailingSlash(str) {
        return str.endsWith('/') ? str.slice(0, -1) : str;
    }

    const passkey = getPasskey();
    let dl_type = "qb";
    const style = document.createElement('style');
    style.textContent = `
    #leech-btn {
        position: fixed;
        top: 10px;
        right: 10px;
        width: 60px;
        height: 60px;
        background: #e64a19;
        color: #fff;
        border: none;
        outline: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 99999;
        box-shadow: 0 0 10px #00000066;
        user-select: none;
        transition: all .5s ease;
    }
    #leech-btn:hover {
        background: #ff7043;
        box-shadow: 0 0 10px #ff7043BB;
        transform: scale(1.1) rotate(360deg);
    }
    #leech-window {
        position: fixed;
        top:calc(50% - 400px);
        left: calc(50% - 600px);
        z-index: -9999999;
        height: 800px;
        width: 1200px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 20px #00000066;
        opacity: 0;
        display: grid;
        grid-template-columns: 900px 300px;
        transition: all .5s ease;
    }
    #leech-close {
        position: absolute;
        top:-30px;
        right:-30px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #FFF;
        font-size: 20px;
        color: #000;
        line-height:30px;
        text-align: center;
        box-shadow: 0 0 20px #00000066;
        user-select: none;
        border: none;
        outline: none;
        transition: all .5s ease;
    }
    #leech-close:hover {
        transform: scale(1.1) rotate(360deg);
        box-shadow: 0 0 20px #ff7043BB;
    }
    .leech-button {
        border: none;
        outline: none;
        box-shadow: 0 0 10px #00000022;
        background: linear-gradient(45deg, #9932cc, #ba55d3);
        height:40px;
        line-height: 40px;
        color: #fff;
        padding: 0 14px;
        border-radius: 20px;
        user-select:none;
        margin:4px;
        transition: all .3s ease;
    }
    .leech-button:hover {
        transform: translateY(-2px);
    }
    .leech-button:active {
        transform: translateY(0px);
    }
    .window-left {
        text-align:left;
        padding:10px;
        overflow: auto;
    }
    .window-right {
        border-left:1px solid #DDD;
        padding:10px;
    }
    #downloader-type{
        list-style: none;
        display:flex;
    }
    .downloader-type {
        border: 1px solid #444;
        border-radius: 10px;
        padding:10px;
        margin:10px;
        color:#444;
        list-style: none;
        user-select:none;
        transition: all .5s ease;
    }
    .downloader-type-checked{
        border: 1px solid #9932cc;
        color: #9932cc;
    }
    .leech-input {
        padding: 10px;
        border-radius: 10px;
        border:1px solid #666;
        outline:none;
        display:block;
        width: 260px;
        margin:10px auto;
        transition: all .5s ease;
    }
    .leech-input:focus {
        border:1px solid #9932cc;
    }
    #downloader_select{
        width:280px;
        height:30px;
        border-radius:10px;
        margin:0 auto;
        outline:none;
    }
    .leech-torrents-urls-textarea{
        width: 850px;
        height: 480px;
        border: 1px solid #666;
        border-radius: 10px;
        outline:none;
        padding:10px;
        transition: all .5s ease;
    }
    .leech-torrents-urls-textarea:focus {
        border:1px solid #9932cc;
    }
    .leech-logs-textarea{
        width: 850px;
        height: 160px;
        border: 1px solid #666;
        border-radius: 10px;
        outline:none;
        padding:10px;
    }
  `;
    document.head.appendChild(style);
    const leech_window = document.createElement('div');
    leech_window.id = 'leech-window';
    const leech_close = document.createElement('button');
    leech_close.id = 'leech-close';
    leech_close.innerHTML = `×`;
    leech_close.addEventListener('click', function () {
        leech_window.style.zIndex = '-99999999';
        leech_window.style.opacity = '0';
    })
    leech_window.appendChild(leech_close);
    const window_left = document.createElement('div');
    const window_right = document.createElement('div');
    window_left.className = 'window-left';
    window_right.className = 'window-right';
    const h3_downloader = document.createElement('h3');
    h3_downloader.innerHTML="下载器";
    h3_downloader.style.userSelect = 'none';
    window_right.appendChild(h3_downloader);
    const downloader_select = document.createElement('select');
    downloader_select.id = 'downloader_select';
    window_right.appendChild(downloader_select);
    function refresh_select(){
        while (downloader_select.firstChild) {
            downloader_select.removeChild(downloader_select.firstChild);
        }
        let downloaders = GM_getValue('downloaders', []);
        for (let i = 0; i < downloaders.length; i++) {
            let option = document.createElement("option");
            option.innerHTML = downloaders[i].host;
            option.value = downloaders[i].host;
            downloader_select.appendChild(option);
        }
    }
    refresh_select();
    downloader_select.addEventListener('change',function(){
        downloader_select.click();
    });
    downloader_select.addEventListener('click', function (event) {
        const selectedValue = event.target.value;
        let downloaders = GM_getValue('downloaders', []);
        downloader_status.innerHTML = "登录状态：正在登录";
        for (let i = 0; i < downloaders.length; i++) {
            if (downloaders[i].host === selectedValue) {
                downloader_host.value = downloaders[i].host;
                downloader_username.value = downloaders[i].username;
                downloader_password.value = downloaders[i].password;
                if(downloaders[i].type == 'qb'){
                    downloader_type_qb.click();
                    let host = trimTrailingSlash(downloaders[i].host);
                    const formdata = new FormData();
                    formdata.append("username", downloaders[i].username);
                    formdata.append("password", downloaders[i].password);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: host + "/api/v2/auth/login",
                        data:formdata,
                        withCredentials: true,
                        onload: function (res) {
                            if(res.responseText == 'Ok.'){
                                //登录成功
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: host + "/api/v2/app/version",
                                    withCredentials: true,
                                    onload: verRes => {
                                        downloader_status.innerHTML = "登录状态：登录成功，qBittorrent版本：" + verRes.responseText;
                                    }
                                });
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: host + "/api/v2/app/preferences",
                                    headers: {
                                        'Accept': 'application/json'
                                    },
                                    withCredentials: true,
                                    onload: res => {
                                        savepath.value = JSON.parse(res.responseText).save_path;
                                    }
                                });
                            }else{
                                downloader_status.innerHTML = "登录状态：登录失败";
                            }
                        }
                    });
                }else{
                    downloader_type_tr.click();
                    let host = trimTrailingSlash(downloaders[i].host);
                    let host2 = host;
                    let login = `${downloaders[i].username}:${downloaders[i].password}@`;
                    if (isHttps(host)) {
                        host = host.replace('https://', '');
                        host = `https://${login}${host}`;
                    }else{
                        host = host.replace('http://', '');
                        host = `http://${login}${host}`;
                    }

                    let tr_session_id = '';
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url:   host + '/transmission/rpc',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Transmission-Session-Id': ''
                        },
                        onload: res => {
                            if (res.status === 409) {
                                tr_session_id = res.responseHeaders.match(/X-Transmission-Session-Id:\s*([^\r\n]+)/i)[1].trim();
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url:   host2 + '/transmission/rpc',
                                    headers:{
                                        'X-Transmission-Session-Id': tr_session_id,
                                        'Content-Type': 'application/json'
                                    },
                                    data:JSON.stringify({ method: 'session-get' }),
                                    onload: res => {
                                        if(res.status !== 200){
                                            downloader_status.innerHTML = "登录状态：登录失败";
                                            return;
                                        }
                                        const json = JSON.parse(res.responseText);
                                        const ver  = json.arguments?.version;
                                        downloader_status.innerHTML = "登录状态：登录成功，Transmission 版本:"+ ver;
                                    }
                                });
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url:   host2 + '/transmission/rpc',
                                    headers:{
                                        'X-Transmission-Session-Id': tr_session_id,
                                        'Content-Type': 'application/json'
                                    },
                                    data:JSON.stringify({ method: 'session-get', arguments: {}}),
                                    onload: res => {
                                        savepath.value = JSON.parse(res.responseText)['arguments']['download-dir'];
                                    }
                                });
                            } else {
                                downloader_status.innerHTML = "登录状态：登录失败";
                            }
                        }
                    });
                }
            }
        }
    });
    const downloader_status = document.createElement('div');
    downloader_status.innerHTML = "登录状态：正在登录";
    window_right.appendChild(downloader_status);
    const downloader_type = document.createElement('ul');
    downloader_type.id = 'downloader-type';
    const downloader_type_qb = document.createElement('li');
    const downloader_type_tr = document.createElement('li');
    downloader_type_qb.className = 'downloader-type downloader-type-checked';
    downloader_type_tr.className = 'downloader-type';
    downloader_type_qb.innerHTML = `qBittorrent`;
    downloader_type_tr.innerHTML = `Transmission`;
    downloader_type_qb.addEventListener('click', function () {
        dl_type = 'qb';
        downloader_type_qb.className = 'downloader-type downloader-type-checked';
        downloader_type_tr.className = 'downloader-type';
    })
    downloader_type_tr.addEventListener('click', function () {
        dl_type = 'tr';
        downloader_type_qb.className = 'downloader-type';
        downloader_type_tr.className = 'downloader-type downloader-type-checked';
    })
    downloader_type.appendChild(downloader_type_qb);
    downloader_type.appendChild(downloader_type_tr);
    const downloader_host = document.createElement('input');
    downloader_host.placeholder = "下载器地址";
    downloader_host.className = 'leech-input';
    const downloader_username = document.createElement('input');
    downloader_username.placeholder = "下载器用户名";
    downloader_username.className = 'leech-input';
    const downloader_password = document.createElement('input');
    downloader_password.type="password";
    downloader_password.placeholder = "下载器密码";
    downloader_password.className = 'leech-input';
    window_right.appendChild(downloader_type);
    window_right.appendChild(downloader_host);
    window_right.appendChild(downloader_username);
    window_right.appendChild(downloader_password);
    const div1 = document.createElement('div');
    div1.style.textAlign = 'center';
    window_right.appendChild(div1);
    const add_downloader = document.createElement('button');
    add_downloader.id = 'add-downloader';
    add_downloader.className = 'leech-button';
    add_downloader.innerHTML = "添加";
    add_downloader.addEventListener('click', function () {
        let downloaders = GM_getValue('downloaders', []);
        for (let i = 0; i < downloaders.length; i++) {
            if(downloaders[i].host == downloader_host.value) {
                alert('下载器已存在');
                return;
            }
        }
        downloaders.push({
            type: dl_type,
            host: downloader_host.value,
            username: downloader_username.value,
            password: downloader_password.value
        });
        GM_setValue('downloaders', downloaders);
        downloader_type_qb.click();
        downloader_host.value = "";
        downloader_username.value = "";
        downloader_password.value = "";
        refresh_select();
        downloader_select.dispatchEvent(new Event('click'));
    });
    const edit_downloader = document.createElement('button');
    edit_downloader.id = 'edit-downloader';
    edit_downloader.className = 'leech-button';
    edit_downloader.innerHTML = "编辑";
    edit_downloader.addEventListener('click', function () {
        let downloaders = GM_getValue('downloaders', []);
        for (let i = 0; i < downloaders.length; i++) {
            if(downloaders[i].host == downloader_host.value) {
                downloaders[i] ={
                    type: dl_type,
                    host: downloader_host.value,
                    username: downloader_username.value,
                    password: downloader_password.value
                };
                GM_setValue('downloaders', downloaders);
                refresh_select();
                downloader_select.dispatchEvent(new Event('click'));
                return;
            }
        }
        alert("下载器不存在");
    });
    const del_downloader = document.createElement('button');
    del_downloader.id = 'del-downloader';
    del_downloader.className = 'leech-button';
    del_downloader.innerHTML = "删除";
    del_downloader.addEventListener('click', function () {
        let downloaders = GM_getValue('downloaders', []);
        for (let i = 0; i < downloaders.length; i++) {
            if(downloaders[i].host == downloader_host.value) {
                downloaders.splice(i,1);
                downloader_type_qb.click();
                downloader_host.value = "";
                downloader_username.value = "";
                downloader_password.value = "";
                GM_setValue('downloaders',downloaders);
                refresh_select();
                downloader_select.dispatchEvent(new Event('click'));
                return;
            }
        }
        alert("下载器不存在");
    });
    const remove_all_downloader = document.createElement('button');
    remove_all_downloader.id = 'remove-all-downloader';
    remove_all_downloader.className = 'leech-button';
    remove_all_downloader.innerHTML = "清空";
    remove_all_downloader.addEventListener('click', function () {
        GM_setValue('downloaders',[]);
        downloader_type_qb.click();
        downloader_host.value = "";
        downloader_username.value = "";
        downloader_password.value = "";
        refresh_select();
    });

    div1.appendChild(add_downloader);
    div1.appendChild(edit_downloader);
    div1.appendChild(del_downloader);
    div1.appendChild(remove_all_downloader);
    const input_dur = document.createElement('input');
    input_dur.className = 'leech-input';
    input_dur.placeholder= "下载间隔（秒）,不填写默认为2秒";
    window_right.appendChild(input_dur);
    const savepath = document.createElement('input');
    savepath.className = 'leech-input';
    savepath.placeholder= "保存路径";
    window_right.appendChild(savepath);
    const div2 = document.createElement('div');
    div2.style.textAlign = 'center';
    window_right.appendChild(div2);
    const add_torrents = document.createElement('button');
    add_torrents.className = 'leech-button';
    add_torrents.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;开始下载&nbsp;&nbsp;&nbsp;&nbsp;";
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    add_torrents.addEventListener('click', function (event) {
        logs_textarea.value = "";
        add_torrents.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;正在下载&nbsp;&nbsp;&nbsp;&nbsp;";
        add_torrents.style.pointerEvents = 'none';
        //下载种子
        const urls = torrent_url_textarea.value.split("\n");
        const username = downloader_username.value;
        const password = downloader_password.value;
        let host = trimTrailingSlash(downloader_host.value);
        const save_path = savepath.value;
        let sleep_dur = 2000;
        if(input_dur.value != ''){
            sleep_dur = parseInt(input_dur.value) * 1000
        }
        if(dl_type == 'qb'){
            const formdata = new FormData();
            formdata.append("username", username);
            formdata.append("password", password);
            GM_xmlhttpRequest({
                method: "POST",
                url: host + "/api/v2/auth/login",
                data:formdata,
                withCredentials: true,
                onload: async function (res) {
                    if(res.responseText == 'Ok.'){
                        //登录成功
                        logs_textarea.value = "qBittorrent:"+host+"登录成功。\n" + logs_textarea.value;
                        for(let url of urls){
                            if(url.replaceAll(' ','') == ''){
                                break;
                            }
                            let url2 = url;
                            if(url.indexOf('passkey=') == -1 && passkey != ''){
                                url += "&passkey=" + passkey;
                            }
                            logs_textarea.value = "正在下载：" + url + "\n" + logs_textarea.value;
                            try{
                                fetch(url).then(res => res.blob()).then(torrent => {
                                    logs_textarea.value = "下载完成：" + url + "\n" + logs_textarea.value;
                                    logs_textarea.value = "正在推送到Qbittorrent\n" + logs_textarea.value;
                                    let torrent_formdata = new FormData();
                                    torrent_formdata.append('fileselect[]', torrent);
                                    torrent_formdata.append('autoTMM', 'false');
                                    torrent_formdata.append('savepath', save_path);
                                    torrent_formdata.append('rename', '');
                                    torrent_formdata.append('category', '');
                                    torrent_formdata.append('stopped', 'false');
                                    torrent_formdata.append('stopCondition', 'None');
                                    torrent_formdata.append('dlLimit', '0');
                                    torrent_formdata.append('upLimit', '0');
                                    GM_xmlhttpRequest({
                                        method: "POST",
                                        url: host + "/api/v2/torrents/add",
                                        data:torrent_formdata,
                                        withCredentials: true,
                                        onload: function (res) {
                                            if(res.responseText == 'Ok.'){
                                                logs_textarea.value = "推送成功\n" + logs_textarea.value;
                                                torrent_url_textarea.value =  torrent_url_textarea.value.replace(url2+"\n","");
                                                torrent_url_textarea.value =  torrent_url_textarea.value.replace(url2,"");
                                            }else{
                                                logs_textarea.value = "推送失败\n" + logs_textarea.value;
                                            }
                                        }
                                    });
                                });
                            }catch(err) {
                                logs_textarea.value = "下载失败：" + url + "\n" + logs_textarea.value;
                            }

                            await sleep(sleep_dur);
                        }
                    }else{
                        logs_textarea.value = "qBittorrent:"+host+"登录失败，请检查设置是否正确。\n" + logs_textarea.value;
                    }
                    add_torrents.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;开始下载&nbsp;&nbsp;&nbsp;&nbsp;";
                    add_torrents.style.pointerEvents = 'auto';
                }
            });
        }else{
            let host2 = host;
            let login = `${username}:${password}@`;
            if (isHttps(host)) {
                host = host.replace('https://', '');
                host = `https://${login}${host}`;
            }else{
                host = host.replace('http://', '');
                host = `http://${login}${host}`;
            }

            let tr_session_id = '';
            GM_xmlhttpRequest({
                method: 'POST',
                url:   host + '/transmission/rpc',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Transmission-Session-Id': ''
                },
                onload: async res => {
                    if (res.status === 409) {
                        tr_session_id = res.responseHeaders.match(/X-Transmission-Session-Id:\s*([^\r\n]+)/i)[1].trim();
                        for(let url of urls){
                            let url2 = url;
                            if(url.replaceAll(' ','') == ''){
                                break;
                            }
                            if(url.indexOf('passkey=') == -1 && passkey != ''){
                                url += "&passkey=" + passkey;
                            }
                            logs_textarea.value = "正在下载：" + url + "\n" + logs_textarea.value;
                            try{
                                fetch(url).then(res => res.blob()).then(torrent => {
                                    logs_textarea.value = "下载完成：" + url + "\n" + logs_textarea.value;
                                    logs_textarea.value = "正在推送到Transmisson\n" + logs_textarea.value;
                                    torrent.arrayBuffer().then(buf => {
                                        const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
                                        const payload = {
                                            method: 'torrent-add',
                                            arguments: {
                                                metainfo: b64,
                                                'download-dir': save_path
                                            }
                                        };
                                        GM_xmlhttpRequest({
                                            method: 'POST',
                                            url: host + '/transmission/rpc',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-Transmission-Session-Id': tr_session_id
                                            },
                                            data: JSON.stringify(payload),
                                            onload: res => {
                                                if (res.status === 200) {
                                                    const json = JSON.parse(res.responseText);
                                                    if (json.result === 'success') {
                                                        logs_textarea.value = "推送成功\n" + logs_textarea.value;
                                                    } else {
                                                        logs_textarea.value = "推送失败\n" + logs_textarea.value;
                                                    }
                                                } else {
                                                    logs_textarea.value = "推送失败\n" + logs_textarea.value;
                                                }
                                            },
                                            onerror: ()=>{
                                                logs_textarea.value = "推送失败\n" + logs_textarea.value;
                                            }
                                        });
                                    });
                                });
                            }catch(err) {
                                logs_textarea.value = "下载失败：" + url + "\n" + logs_textarea.value;
                            }

                            await sleep(sleep_dur);
                        }
                    } else {
                        logs_textarea.value = "Transmission:"+host2+"登录失败，请检查设置是否正确。\n" + logs_textarea.value;
                    }
                    add_torrents.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;开始下载&nbsp;&nbsp;&nbsp;&nbsp;";
                    add_torrents.style.pointerEvents = 'auto';
                }
            });
        }

    });
    div2.appendChild(add_torrents);
    const torrent_url = document.createElement('h3');
    torrent_url.innerHTML = "种子下载地址，一行一个";
    window_left.appendChild(torrent_url);
    const torrent_url_textarea = document.createElement('textarea');
    torrent_url_textarea.className = 'leech-torrents-urls-textarea';
    window_left.appendChild(torrent_url_textarea);
    const logs_h3 = document.createElement('h3');
    logs_h3.innerHTML = "日志";
    window_left.appendChild(logs_h3);
    const logs_textarea = document.createElement('textarea');
    logs_textarea.className = 'leech-logs-textarea';
    logs_textarea.readOnly = true;
    window_left.appendChild(logs_textarea);
    leech_window.appendChild(window_left);
    leech_window.appendChild(window_right);
    document.body.appendChild(leech_window);
    const open = document.createElement('button');
    open.id = 'leech-btn';
    open.innerHTML = "吸血";
    open.addEventListener('click', function () {
        leech_window.style.zIndex = '99999999';
        leech_window.style.opacity = '1';
    })
    document.body.appendChild(open);
    downloader_select.dispatchEvent(new Event('click'));
})();