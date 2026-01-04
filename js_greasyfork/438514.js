// ==UserScript==
// @name         Cocos Github UserName
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Github UserName for Cocos
// @author       YuanYuan
// @match        https://github.com/cocos/*
// @icon         https://forum.cocos.org/uploads/default/original/3X/7/a/7ac704385ca592fd41be29b0dff29dd20884c58d.png
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/438514/Cocos%20Github%20UserName.user.js
// @updateURL https://update.greasyfork.org/scripts/438514/Cocos%20Github%20UserName.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const customUsrName = {
        'yanOO1497': '编辑器-严媛媛',
    };
    function getUserNameMap() {
        return new Promise(function(resolve, reject) {
            let nameMap = localStorage.getItem('cocos-username');
            if (nameMap) {
                try {
                    nameMap = Object.assign(JSON.parse(nameMap), customUsrName);
                    return resolve(nameMap);
                } catch (error) {
                    console.log(error);
                }
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: 'https://download.cocos.org/CocosTest/yww/userName.json',
                responseType: 'json',
                onload: function(data) {
                    localStorage.setItem('cocos-username', JSON.stringify(data.response));
                    resolve(Object.assign(data.response, customUsrName));
                }
            });
        })
    }

    let promise = getUserNameMap();

    function onLoad() {
        console.log('enter Github UserName');
        promise.then((userNameMap) => {
            changeUserName(userNameMap);
            const $container = document.querySelector('#js-repo-pjax-container');
            if (!$container) {
                console.error('#js-repo-pjax-container');
                return;
            }
            $container.addEventListener('pjax:end', function () {
                console.debug('cocos username refresh:pjax:end');
                changeUserName(userNameMap);
            })
        });
    }

    function changeUserName(userNameMap) {
        const $ids = document.querySelectorAll(`a[data-octo-dimensions="link_type:self"]`);
        $ids.forEach(($item) => {
            $item.innerText = userNameMap[$item.innerText] || $item.innerText;
        });
    }
    window.onload = onLoad;
    window.onbeforeunload = function(event){
        console.log('onbeforeunload');
    }
})();