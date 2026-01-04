// ==UserScript==
// @name            SZTU自动评教
// @namespace       https://github.com/xiaowhang/sztu-automated-course-evaluation
// @version         0.2.0
// @description     深圳技术大学自动评教——2024-2025-2
// @author          xiaowhang
// @match           https://jwxt.sztu.edu.cn/jsxsd/framework/xsMain.htmlx#*
// @match           https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_list.do*
// @match           https://jwxt.sztu.edu.cn/jsxsd/xspj/xspj_edit.do*
// @match           https://jwxt-sztu-edu-cn-s.webvpn.sztu.edu.cn:8118/jsxsd/framework/xsMain.htmlx#
// @match           https://jwxt-sztu-edu-cn-s.webvpn.sztu.edu.cn:8118/jsxsd/xspj/xspj_list.do*
// @match           https://jwxt-sztu-edu-cn-s.webvpn.sztu.edu.cn:8118/jsxsd/xspj/xspj_edit.do*
// @grant           GM_openInTab
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/498753/SZTU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/498753/SZTU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


function handleListPage() {
  const urlList = [];
  const trList = document.querySelectorAll('tr');

  for (let i = 1; i < trList.length; i++) {
    const isDone = trList[i].children[5].children[0].value;
    if (isDone === '否') urlList.push(trList[i].children[7].children[0].getAttribute('href'));
    console.log(trList[i].children[2].textContent, trList[i].children[3].textContent);
  }

  if (urlList.length !== 0) {
    urlList.forEach(url => GM_openInTab(location.origin + url, { active: true }));
  } else {
    alert('已完成所有评教，请及时提交！！！');
  }
}

function handleEditPage() {
  const tdList = document.querySelectorAll('[name="zbtd"]');
  for (const td of tdList) {
    td.children[0].click();
  }
  tdList[tdList.length - 3].children[2].click();

  const submit = document.getElementById('bc');
  submit.click();
}

function main() {
  const currentUrl = location.pathname;

  if (currentUrl.includes('/jsxsd/xspj/xspj_list.do')) {
    handleListPage();
  } else if (currentUrl.includes('/jsxsd/xspj/xspj_edit.do')) {
    handleEditPage();
  }
}

main();
