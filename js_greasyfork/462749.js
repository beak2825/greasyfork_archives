
// ==UserScript==
// @name       KYI复制Api格式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description   KYI复制Api格式 by chancoki
// @author       chancoki
// @match        https://apidoc.kyigd.com:10000/
// @icon         https://apidoc.kyigd.com:10000/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462749/KYI%E5%A4%8D%E5%88%B6Api%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462749/KYI%E5%A4%8D%E5%88%B6Api%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const body = document.body;
  const div = document.createElement('div');

  body.appendChild(div);
  div.className = 'cc-copy el-button el-button--primary el-button--mini el-dropdown-selfdefine';
  div.innerHTML = '复制Api格式';
  div.addEventListener('click', getString);
  div.setAttribute('style','position: fixed;top: 154px;right: 150px;z-index:999909')

  window.onload = () => {
    const title = document.querySelector('.doc-title');

    if(!title){
      return
    }

    title.style.cursor = 'pointer';

    title.addEventListener('click', getString);
  };

  window.onkeydown=function() {
   if(event.ctrlKey && event.keyCode===67){
     getString()
    }
  }


  async function getString() {
    if(!document.querySelector('.doc-id')){
      return
    }

    const id = document.querySelector('.doc-id').innerText.split('：')[1];

    const url = `https://apidoc.kyigd.com:10000/doc/view/detail?id=${id}`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('torna.token')}` } });

    const data = await res.json();
    try {
      const res = await copyToClip(resultStr(data.data));
      div.innerHTML = res;
    } catch (error) {
      div.innerHTML = error;
    }

    setTimeout(() => {
      div.innerHTML = '复制Api格式';
    }, 2000);
  }

  function resultStr(data) {
    return `
/**
 * ${data.name}
${data.queryParams.map(item => ` * @param {${paramType(item.type)}} data.${item.name} ${item.description}\n`)} */
export function ${data.url.split('/').pop()}(data) {
  return useRequest({ baseUrl, url:'${getUrl(data)}', method:'${data.httpMethod}', data });
}`.replaceAll(', *', ` *`).replaceAll('<br>','');
  }

  function getUrl(data) {
    return `${data.debugEnvs[0].url.split('/').slice(3).length?'/':''}${data.debugEnvs[0].url.split('/').slice(3).join('/')}${data.url}`;
  }

  function paramType(type) {
    if (type === 'int32') {
      return 'Number';
    }

    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  function copyToClip(content) {
    return new Promise((resolve, reject) => {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        const hasFocus = document.hasFocus(); //这个是重点，可判断是否为当前dom页面
        if (hasFocus && (result.state === 'granted' || result.state === 'prompt')) {
          const clipboard = navigator.clipboard.writeText(content);
          clipboard
            .then(res => {
              resolve('复制成功');
            })
            .catch(error => {
              reject('复制失败');
            });
        }
      });
    });
  }
})();
