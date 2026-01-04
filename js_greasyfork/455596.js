// ==UserScript==
// @name         game.dusays.com自动云端存档
// @namespace    http://bmqy.net/
// @version      1.0.4
// @description  支持game.dusays.com平台挂机放置小游戏自动云端存档
// @author       bmqy
// @match        https://game.dusays.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dusays.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455596/gamedusayscom%E8%87%AA%E5%8A%A8%E4%BA%91%E7%AB%AF%E5%AD%98%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/455596/gamedusayscom%E8%87%AA%E5%8A%A8%E4%BA%91%E7%AB%AF%E5%AD%98%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.c-tooltip-content .Backpack{width:60px;}.c-tooltip-content .Backpack img{vertical-align:middle;}');

    // Your code here...
    const AutoSync = {
        // 自动保存倒计时：秒
        interval: 10,
        gistName: 'dusays.com',
        gistFileName: 'game.dusays.com',
        // 自动保存
        bindAutoSave(){
            window.onload = function(){
                // 保存进度按钮增加倒计时显示
                let $btn = document.querySelectorAll('.c-tooltip-content .Backpack')[4];
                let old = $btn.innerHTML;
                let t = AutoSync.interval;
                // 计时为0时执行存档
                setInterval(() => {
                    if(t === 0){
                        !$btn.click() && AutoSync.saveToCloud();
                        t = AutoSync.interval;
                    }
                    $btn.innerHTML = old + ' ('+ t +')';
                    t--;
                }, 1000);
            }
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
            let local = localStorage.getItem('_sd')
            if(local){
                AutoSync.gist(local);
                console.log('存档已保存到云端')
            }
        },
        // 加载云端存档
        async loadSaveForCloud(){
            let cloud = await AutoSync.gist();
            let local = localStorage.getItem('_sd')
            if(cloud && cloud!='hello' && local!=cloud){
                if(confirm('检测到云端存档，是否需要恢复？')){
                    localStorage.setItem('_sd', cloud)
                    console.log('已恢复为云端存档');
                    location.reload();
                }
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
                    if(key == AutoSync.gistFileName){
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
            return gist.files[AutoSync.gistFileName].content;
        },
        updateGist(id, content){
            let data = {
                "description":AutoSync.gistName,
                "files": {},
            };
            if(id && content){
                data.files[AutoSync.gistFileName] = {};
                data.files[AutoSync.gistFileName].content = content;
                AutoSync.http(`https://api.github.com/gists/${id}`, data, 'post')
            } else {
                data.public = false;
                data.files[`${AutoSync.gistFileName}`] = {
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
                this.loadSaveForCloud();
                this.bindAutoSave();
            })();
        },
    }

    AutoSync.init();
})();