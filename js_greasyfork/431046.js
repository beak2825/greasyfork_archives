// ==UserScript==
// @name         文档类目考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网页刷新，，，
// @author       Huqz
// @match        http://discover.sm.cn/2/
// @icon         https://www.google.com/s2/favicons?domain=sm.cn
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/431046/%E6%96%87%E6%A1%A3%E7%B1%BB%E7%9B%AE%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431046/%E6%96%87%E6%A1%A3%E7%B1%BB%E7%9B%AE%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!location.hash.includes('doc_category_exam')) return ;

  let data = [];
  let ans = [];
  let ans_urls = [];
  let submit = $('.ant-btn-primary');
  $(".right___1dQeJ > div").after(`
    <div style="margin-top: 20px">
      <button class="sc-auto ant-btn">自动做</button>
      <button class="sc-export ant-btn">导出表格数据</button>
      <button class="sc-export2 ant-btn">导出json数据</button>
      <button class="sc-next ant-btn ant-btn-primary">保存并下一题</button>
    </div>
`)

  $('.sc-next').click(function () {
    let info = $('p');
    let title = info[0].textContent;
    title = title.includes('title') ? title : prompt('手动输入title：');
    let url = info[1].textContent;
    url = url.includes('url') ? url : prompt('手动输入url');

    let ans = $('.ant-cascader-picker-label')[0].textContent;
    if (!ans) alert('没有获取到答案')

    if (title && url && ans) {
      data.push({title, url, ans});
      submit.click();
    }
  });

  $('.sc-export').click(function () {
    if (data.length === 0) {
      alert('还没有内容');
      return ;
    }
    let info = "";
    for (let i of data) {
      info += i.title + '\t' + i.url + '\t' + i.ans + '\n';
    }
    GM_setClipboard(info);
    alert('已复制到剪贴板');
    // todo 自动？
  });

  $('.sc-export2').click(function () {
    if (data.length === 0) {
      alert('还没有内容');
      return ;
    }
    let info = JSON.stringify(data);
    GM_setClipboard(info);
    alert('已复制到剪贴板');
  });

  $('.sc-auto').click(function () {
    if (ans.length !== 0) {
      autoMove();
      return ;
    }
    let ansText = prompt('输入json数据');
    if (!ansText) return ;
    try {
      ans = JSON.parse(ansText);
    }catch (e) {
      alert('语法错误');
    }
    if (!ans) return ;
    ans_urls = ans.map(e => e.url);
    autoMove();
  });

  function autoMove() {
    setTimeout(() => {
      let info = $('p');
      let url = info[1].textContent;

      if (ans_urls.includes(url)) {
        let index = ans_urls.indexOf(url);
        let answer = ans[index]['ans'];
        let text = answer.split('/').map(e => e.trim());
        console.log(text);
        new Promise((resolve, reject) => {
          $('input').click();
          resolve(text);
        }).then(data => {
            $('.ant-cascader-menu > li:contains("' + data[0] + '")').click();
            console.log(data[0]);
            return data
        }).then(data => {
          setTimeout(() => {
            $('.ant-cascader-menu > li:contains("' + data[1] + '")').click();
            console.log(data[1]);
            return data;
          }, 1000)
        }).then((data) => {
          setTimeout(() => {
            submit.click();
            autoMove();
          }, 1000);
        })
      }

    }, 3000);
  }
})();
