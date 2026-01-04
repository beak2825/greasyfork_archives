// ==UserScript==
// @name           Get FileList
// @description    테라박스 특정 폴더내의 모든 파일 리스트 추출
// @namespace https://greasyfork.org/users/976225
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20230322003512
// @downloadURL https://update.greasyfork.org/scripts/462285/Get%20FileList.user.js
// @updateURL https://update.greasyfork.org/scripts/462285/Get%20FileList.meta.js
// ==/UserScript==
 
(function() {
function GetJson(url, options = {}) {
  return fetch(url, options)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return data;
  });
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function Save(text) {
  b = new Blob([text],{type : 'application/text'});
  f = new FileReader();
  f.onload = function(e) {
    t = 'filelist';
    a = document.createElement('a');
    a.setAttribute('download', `${t}.txt`);
    a.setAttribute('target', '_blank');
    a.href = e.target.result;
    a.click();
  };
  f.readAsDataURL(b);
}

async function GetFileList() {
  let fulllist = '';

  let aid = 'app_id=250528';
  let dir = (null !== window.location.search.match(/[\?&]path=([^&]+)/) ? RegExp.$1 : '/');
  let num = 100;

  for (let page = 1; true; ++page) {
    let data = await GetJson(`https://www.terabox.com/api/list?${aid}&web=1&channel=dubox&clienttype=0&jsToken=${jsToken}&order=name&desc=0&dir=${dir}&num=${num}&page=${page}&showempty=0`);
    if (0 == data.list.length) {
      console.log('end');
      break;
    }
    for (let item of data.list) {
      fulllist += `${item.server_filename} : ${formatBytes(item.size)}\r\n`;
    }
  }
  Save(fulllist);
}

GetFileList();

})();