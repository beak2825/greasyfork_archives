// ==UserScript==
// @name        Coding Repos Size
// @version     1.0.0
// @description Coding仓库大小统计
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/475875-coding-repos-size
// @match       https://*.coding.net/api/repos*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475875/Coding%20Repos%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/475875/Coding%20Repos%20Size.meta.js
// ==/UserScript==

(function(){

  function formatSize(size) {
    if (size === 0) return '0 B';
    // var k = 1000; // or 1024
    var k = 1024; // or 1024
    size = size * k;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(size) / Math.log(k));
    return (size / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }

  var $style = document.createElement('style');
  $style.setAttribute('type', 'text/css');
  $style.innerText = `
.loading{
  text-align: center;
  padding: 50px 20px;
}

table{
  border-collapse: collapse;
  width: 100%;
}

table th{
  background: #f5f5f5;
}

table,
table th,
table td{
  border: 1px solid #e5e5e5;
}

table th,
table td{
  padding: 2px 5px;
}
`;

  var profile = location.host.split('.')[0];
  console.log('profile:', profile);
  if (!profile) {
    return console.error('出现异常了哇！');
  }

  document.title = 'Coding Repos Size - by Jack.Chan';
  var $body = document.body;
  var $result = document.createElement('div');
  var $loading = document.createElement('p');

  $loading.className = 'loading';
  $loading.innerText = '加载中...';
  $result.appendChild($loading);

  $body.innerHTML = '';
  $body.appendChild($style);
  $body.appendChild($result);

  var baseURL = `https://${ profile }.coding.net`;

  fetch(`${ baseURL }/api/user/shebaochina/depots?type=ALL`, { method: 'GET' }).then((res) => res.json()).then((res) => {
    $loading.innerText = '计算中...';

    console.log('res:', res);

    res.data.sort((a, b)=>{ return b.size - a.size; });

    // res.data = res.data.sort((a, b) => {
    //   return a.size - b.size
    // });

    var totalSize = 0;

    var html = [];
    html.push(`<colgroup>`);
    html.push(`<col style="min-width: 180px;max-width: 260px;">`);
    html.push(`<col style="min-width: 180px;max-width: 260px;">`);
    html.push(`<col style="min-width: 100px;max-width: 160px;">`);
    html.push(`<col style="width: auto;">`);
    html.push(`<col style="width: auto;">`);
    html.push(`<col style="width: auto;">`);
    html.push(`<\/colgroup>`);
    html.push(`<thead>`);
    html.push(`<tr>`);
    html.push(`<th>名称<\/th>`);
    html.push(`<th>描述<\/th>`);
    html.push(`<th>大小<\/th>`);
    html.push(`<th>HTTP<\/th>`);
    html.push(`<th>SSH<\/th>`);
    html.push(`<th>URL<\/th>`);
    html.push(`<\/tr>`);
    html.push(`<\/thead>`);
    html.push(`<tbody>`);
    res.data.forEach((item) => {
      totalSize = totalSize + parseInt(item.size);
      html.push(`<tr>
<td>${ item.name }<\/td>
<td>${ item.description }<\/td>
<td style="text-align: right;" title="${ item.size }">${ formatSize(item.size) }<\/td>
<td>${ item.gitHttpsUrl }<\/td>
<td>${ item.gitSshUrl }<\/td>
<td><a href="${ baseURL + item.depotPath }">https://shebaochina.coding.net${ item.depotPath }</a><\/td>
<\/tr>`);
    });
    html.push(`<\/tbody>`);

    var $table = document.createElement('table');
    $table.innerHTML = html.join('');
    $table.tBodies[0].innerHTML = `
    <tr>
    <td colspan="2" style="font-weight: bold;">共: ${ res.data.length } 个仓库<\/td>
    <td style="text-align: right;font-weight: bold;" title="${ totalSize }">${ formatSize(totalSize) }<\/td>
    <td colspan="3">&nbsp;<\/td>
    <\/tr> ${ $table.tBodies[0].innerHTML }
`;
    $result.innerHTML = '';
    $result.appendChild($table);
  }).catch((err) => {
    $result.innerHTML = '<p style="text-align: center;padding: 50px 20px;color: red;">接口出错了哇!</p>';
    console.error(err);
  });

})();