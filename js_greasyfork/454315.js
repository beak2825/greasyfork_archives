// ==UserScript==
// @name         telegra.ph存图自用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  生人勿进!
// @author       You
// @match        https://telegra.ph/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegra.ph
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454315/telegraph%E5%AD%98%E5%9B%BE%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/454315/telegraph%E5%AD%98%E5%9B%BE%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  console.log(document.querySelector('.tl_article_header'));

  // 添加按钮
  const yjSaveBtn = document.createElement('button');
  yjSaveBtn.textContent = '一键存图';
  yjSaveBtn.onclick = yjSave;
  document.querySelector('.tl_article_header').appendChild(yjSaveBtn);

  function yjSave() {
    // console.log(axios);
    // console.log(JSZip);
    // console.log(FileSaver);
    // console.log('window', window);
    alert('一键存图');
    const title = document.querySelector('.tl_article_header>h1').textContent;
    console.log(title);
    const ql = document.querySelector('.ql-editor');
    const imgNodes = ql.querySelectorAll('.figure_wrapper>img');
    const imgs = [];
    imgNodes.forEach((value) => {
      imgs.push(value.getAttribute('src'));
    })

    handleBatchDownload(imgs, title);
  }

  function getFile(url) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer'
      }).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error.toString())
      })
    })
  };

  // 批量下载
  async function handleBatchDownload (selectImgList, fileName) {
    const data = selectImgList;
    const zip = new JSZip()
    const cache = {}
    const promises = []
    await data.forEach(item => {
      const promise = getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
        const arr_name = item.split("/");
        let file_name = arr_name[arr_name.length - 1] // 获取文件名
        zip.file(file_name, data, {
          binary: true
        }) // 逐个添加文件
        cache[file_name] = data
      })
      promises.push(promise)
    })
    Promise.all(promises).then(() => {
      zip.generateAsync({
        type: "blob"
      }).then(content => { // 生成二进制流
        saveAs(content, `${fileName}.zip`) // 利用file-saver保存文件
      })
    })

  };
})();