// ==UserScript==
// @name        凯桥蓝湖助手
// @description 重庆凯桥蓝湖助手
// @version     0.0.3
// @author      mushan0x0
// @match       *://lanhuapp.com/*
// @grant       none
// @run-at      document-start

// @namespace https://greasyfork.org/users/932867
// @downloadURL https://update.greasyfork.org/scripts/447487/%E5%87%AF%E6%A1%A5%E8%93%9D%E6%B9%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447487/%E5%87%AF%E6%A1%A5%E8%93%9D%E6%B9%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    const originOpen = XMLHttpRequest.prototype.open;
    const log = console.log;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function (obj) {
            const url = obj.target.responseURL;
            const toast = document.querySelector('.normal-toast');
            const toastText = document.querySelector('.normal-toast .normal-toast-text');
            const toastIcon = document.querySelector('.normal-toast use');
            if (url.includes('/api/project/image')) {
                fetch(`https://dds.lanhuapp.com/api/dds/image/store_schema_revise?version_id=${JSON.parse(this.response).result.versions[0].id}`, {
                    credentials: 'include'
                })
                    .then(response => response.json())
                    .then(data => {
                    toast.className = 'normal-toast';
                    toastText.innerText = '凯桥蓝湖插件应用成功'
                    toastIcon.setAttribute('xlink:href', '#icon-ic-success');
                    if (!location.href.includes('schema')) {
                        history.replaceState({}, '', `${location.href}&schema=${encodeURIComponent(data.data?.data_resource_url || 'none')}`);
                        if (!data.data?.data_resource_url) {
                            toastText.innerText = '该设计图不支持生成代码，需要设计师重新上传';
                            toastIcon.setAttribute('xlink:href', '#icon-ic-warning');
                        }
                    }
                }).catch(e => {
                    toast.className = 'normal-toast';
                    toastText.innerText = '凯桥蓝湖插件应用失败，请将蓝湖网页添加到跨域插件白名单';
                    toastIcon.setAttribute('xlink:href', '#icon-ic-warning');
                }).finally(() => {
                    setTimeout(() => {
                        toast.className = 'normal-toast hide';
                    }, 3000);
                });
            }
        });

        originOpen.apply(this, arguments);
    };
})();
