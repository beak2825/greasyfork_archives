// ==UserScript==
// @name          哥特动漫王国自动签到
// @namespace     http://tampermonkey.net/
// @version       1.5
// @description   不再维护，建议使用 [哥特LOLI网站小辅助](https://greasyfork.org/zh-CN/scripts/438974-%E5%93%A5%E7%89%B9loli%E7%BD%91%E7%AB%99%E5%B0%8F%E8%BE%85%E5%8A%A9)
// @author        旧言
// @match         *://www.gtloli.gay/*
// @icon          https://www.google.com/s2/favicons?domain=gtloli.gay
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/437544/%E5%93%A5%E7%89%B9%E5%8A%A8%E6%BC%AB%E7%8E%8B%E5%9B%BD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/437544/%E5%93%A5%E7%89%B9%E5%8A%A8%E6%BC%AB%E7%8E%8B%E5%9B%BD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

const pc = localStorage.getItem('pc');
const gtb = localStorage.getItem('gtb');
const ten = localStorage.getItem('ten');
if (pc && gtb && ten) {
  const date = JSON.parse(localStorage.getItem('date'));
  if (date === null) localStorage.setItem('date', JSON.stringify(new Date().getDate()));
}
if (location.href === 'https://www.gtloli.gay/forum.php') {
  const nowDate = new Date();
  const date = JSON.parse(localStorage.getItem('date'));
  if (nowDate.getDate() !== date) {
    localStorage.removeItem('pc');
    localStorage.removeItem('gtb');
    localStorage.removeItem('ten');
    localStorage.removeItem('date');
    console.log(nowDate.toTimeString().substring(0, 8));
    signIn();
  }
} else if (location.href === 'https://www.gtloli.gay/member.php?mod=logging&action=login') {
  localStorage.removeItem('pc');
  localStorage.removeItem('gtb');
  localStorage.removeItem('ten');
  localStorage.removeItem('date');
  console.log('已清空记录!');
}

function signIn() {
  const pc = {
    id: 'pc',
    name: '胖次',
    applyUrl: 'https://www.gtloli.gay/home.php?mod=task&do=apply&id=32',
    drawUrl: 'https://www.gtloli.gay/home.php?mod=task&do=draw&id=32',
  };
  const gtb = {
    id: 'gtb',
    name: 'GT币',
    applyUrl: 'https://www.gtloli.gay/home.php?mod=task&do=apply&id=33',
    drawUrl: 'https://www.gtloli.gay/home.php?mod=task&do=draw&id=33',
  };
  if (document.getElementById('JD_sign').onclick) {
    // https://www.gtloli.gay/plugin.php?id=k_misign:sign&operation=qiandao&format=button&formhash=79b1539f&inajax=1&ajaxtarget=midaben_sign
    document.getElementById('JD_sign').click();
    console.log('签到成功!');
  } else {
    console.log('已签到!');
  }
  const pcLocal = localStorage.getItem('pc');
  if (!pcLocal) get(pc);
  const gtbLocal = localStorage.getItem('gtb');
  if (!gtbLocal) get(gtb);
  const tenLocal = localStorage.getItem('ten');
  if (!tenLocal) showPage();
}

function get(data) {
  const http = new XMLHttpRequest();
  http.open('GET', data.applyUrl);
  http.send();
  http.onreadystatechange = (e) => {
    if (e.target.status === 200) {
      http.open('GET', data.drawUrl);
      http.send();
      http.onreadystatechange = (event) => {
        if (event.target.status === 200) {
          localStorage.setItem(data.id, 'true');
          console.log(data.name + '领取成功!');
          http.open('GET', 'https://www.gtloli.gay/home.php?mod=space&do=notice&view=system');
          http.send();
        }
      };
    }
  };
}

function showPage() {
  const users = [
    'https://www.gtloli.gay/home.php?mod=space&uid=1',
    'https://www.gtloli.gay/home.php?mod=space&uid=687195',
    'https://www.gtloli.gay/home.php?mod=space&uid=250669',
    'https://www.gtloli.gay/home.php?mod=space&uid=455571',
    'https://www.gtloli.gay/home.php?mod=space&uid=596234',
    'https://www.gtloli.gay/home.php?mod=space&uid=828725',
    'https://www.gtloli.gay/home.php?mod=space&uid=831814',
    'https://www.gtloli.gay/home.php?mod=space&uid=911716',
    'https://www.gtloli.gay/home.php?mod=space&uid=644482',
    'https://www.gtloli.gay/home.php?mod=space&uid=911905',
    'https://www.gtloli.gay/home.php?mod=space&uid=936765',
  ];
  users.forEach((v, i) => {
    const http = new XMLHttpRequest();
    http.open('GET', v);
    http.send();
    if (i === users.length - 1) {
      localStorage.setItem('ten', 'true');
      console.log('已查看10人主页!');
    }
  });
}
