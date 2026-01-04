// ==UserScript==
// @name         文明2辅助
// @namespace    http://bmqy.net/
// @version      1.0.2
// @description  默认支持更多平台文明2：自动云端存档，理论支持所有平台，请自行添加试用...
// @author       bmqy
// @match        https://game1.dusays.com/*
// @match        https://g1tyx.github.io/cividlization2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dusays.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456670/%E6%96%87%E6%98%8E2%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/456670/%E6%96%87%E6%98%8E2%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const AutoSync = {
        gistName: 'dusays.com',
        gistFileNamePrefix: 'cv2sv_',
        // 增加加载gist按钮
        addLoadGistBtn(){
            window.onload = function(){
                let $btnOld = document.querySelector('.btn.btn-dark.btn-block');

                let $btn = document.createElement('div');
                $btn.id = 'btnLoadGist';
                $btn.className = 'btn btn-dark btn-block';
                $btn.innerHTML = '加载GIST存档';
                $btn.addEventListener('click', function () {
                    AutoSync.loadSaveForCloud()
                });
                $btnOld.parentNode.appendChild($btn);
            }
        },
        // 监听自动存档，保存至gist云端
        bindAutoSaveToSaveGist(){
            setInterval(() => {
                AutoSync.saveToCloud();
            }, 10000);
        },

        checkGithub(){
            let storage = GM_getValue('github') || {}
            if(!storage.username){
                storage.username = prompt('请输入你的github用户名')
                if(!storage.username) return false;
                GM_setValue('github', storage);
            }
            if(!storage.token){
                storage.token = prompt('请输入你的github gist token')
                if(!storage.token) return false;
                GM_setValue('github', storage);
            }
            return true;
        },

        // 保存本地存档到云端
        saveToCloud(){
            let local = localStorage
            for (const key in local) {
                if (key!='openpages' && Object.hasOwnProperty.call(local, key)) {
                    AutoSync.gist({key: key, value: local[key]});
                    console.log('存档已保存到云端')
                }
            }
        },
        // 加载云端存档
        async loadSaveForCloud(){
            let cloud = await AutoSync.gist();
            let count = 0;
            if(cloud && Object.keys(cloud).length>0){
                if(confirm('检测到云端存档，是否需要恢复？')){
                    for (const key in cloud) {
                        if (key.indexOf(AutoSync.gistFileNamePrefix) == 0 && Object.hasOwnProperty.call(cloud, key)) {
                            count++;
                            console.log(`云端存档 [${key.split('_')[1]}] 已恢复`, cloud[key].content);
                            localStorage.setItem(key, cloud[key].content);
                        }
                    }
                    alert(`共恢复 ${count} 个存档。`);
                    location.href = './';
                }
            } else {
                alert('没有云端存档！');
            }
        },

        // 获取云端存档
        async gist(newContent){
            let storage = GM_getValue('github')
            let username = storage.username;
            let outContent = '';
            let gists = await AutoSync.http(`https://api.github.com/users/${username}/gists`);
            
            for (let i = 0; i < gists.length; i++) {
                let theGist = gists[i];
                let files = theGist.files;
                for (const key in files) {
                    if(key.indexOf(AutoSync.gistFileNamePrefix) == 0){
                        if(newContent){
                            AutoSync.updateGist(theGist.id, newContent);
                        }

                        outContent = await AutoSync.getGist(theGist.url);
                        break;
                    }
                }
            }
            if(outContent == ''){
                AutoSync.updateGist(null, '');
            }

            return outContent;
        },
        async getGist(url){
            let gist = await AutoSync.http(url);
            return gist.files;
        },
        updateGist(id, content){
            let data = {
                "description":AutoSync.gistName,
                "files": {},
            };
            if(id && content){
                data.files[content.key] = {};
                data.files[content.key].content = content.value;
                AutoSync.http(`https://api.github.com/gists/${id}`, data, 'post')
            } else {
                data.public = false;
                data.files[`${AutoSync.gistFileNamePrefix}backup`] = {
                    content: 'hello'
                };
                AutoSync.http('https://api.github.com/gists', data, 'post')
            }
        },


        http(url, data, method){
            let storage = GM_getValue('github')
            let token = storage.token;
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method=='post' ? 'POST' : 'GET',
                    headers: {
                        Accept: 'application/vnd.github+json',
                        Authorization: `Bearer ${token}`
                    },
                    url: url,
                    responseType: 'json',
                    data: data ? JSON.stringify(data) : '',
                    onload(res){
                        if(res.response){
                            resolve(res.response)
                        } else {
                            resolve(res)
                        }
                    },
                    onerror(error){
                        reject(error)
                    }
                })
            })
        },

        // 初始化
        init(){
            console.log('已加载自动云端存档...');
            this.checkGithub() && (()=>{
                this.addLoadGistBtn();
                this.bindAutoSaveToSaveGist();
            })();
        },
    }

    AutoSync.init();
})();