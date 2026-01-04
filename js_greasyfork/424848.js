// ==UserScript==
// @name        i Random Mail
// @namespace   https://greasyfork.org/users/756764
// @version     2021.7.25.1
// @author      ivysrono
// @description 自动生成抛弃式邮箱地址
// @match       https://www.cs.email/*
// @match       https://www.guerrillamail.com/*
// @run-at      document-idle
// @grant       GM.notification
// @grant       GM.setClipboard
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424848/i%20Random%20Mail.user.js
// @updateURL https://update.greasyfork.org/scripts/424848/i%20Random%20Mail.meta.js
// ==/UserScript==

// JS生成指定位数的随机 - 竹子的梦想在路上 - 博客园
// https://www.cnblogs.com/sunyucui/p/6804481.html

const getRandom = (num) => {
  /**
   * 如果不要求首位为1，要生成首位不为 0 的随机数则应如下：
   * Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1));
   */
  const random = Math.floor((Math.random() + 1) * Math.pow(10, num - 1));
  return random;
};

document.getElementById('inbox-id').click(); // 点击邮箱名字段
document.querySelector('#inbox-id > input').value = getRandom(11); // 写入类手机号作为邮箱名
document.querySelector('#inbox-id > button.save').click(); // 保存
// 取消勾选去除随机参数
if (document.getElementById('use-alias').checked) {
  document.getElementById('use-alias').click();
}

// 自动关闭登录提示
const copyMail = () => {
  const mail = document.getElementById('email-widget').textContent;
  console.log(mail);
  // https://github.com/violentmonkey/violentmonkey/issues/1319
  GM.setClipboard(mail);
  GM.notification(mail, 'Copy');
};
const observer = new MutationObserver(() => {
  copyMail();
});
observer.observe(document.getElementById('email-widget'), {
  childList: true,
});
