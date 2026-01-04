// ==UserScript==
// @name         yuppo password
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  backup password
// @author       You
// @match        *.x.yupoo.com/*
// @match        *.x.zhidian-inc.cn/*
// @match        stlzh1688.x.yupoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yupoo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439898/yuppo%20password.user.js
// @updateURL https://update.greasyfork.org/scripts/439898/yuppo%20password.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const host = window.location.host;
  const site = host.match(/[\w-]+/)[0];

  const code = {
    A: 10,
    B: 12,
    AB: 13,
    C: 14,
    D: 16,
    E: 18,
    F: 20,
    G: 21,
    H: 23,
    I: 25,
    J: 26,
    K: 28,
    L: 30,
    M: 32,
    N: 35,
    O: 38,
    P: 40,
    R: 42,
    S: 45,
    T: 48,
    U: 50,
    V: 55,
    W: 65,
    X: 70,
    Y: 90,
    Z: 105,
  };

  if (host.match('stlzh1688')) {
    window.onload = function () {
      const price = document.querySelector('.showalbumheader__gallerysubtitle');
      if (price) {
        let text = price.innerHTML;
        text = text.replaceAll(/[a-zA-Z]+/g, function (params) {
          const pr = code[params.toUpperCase()];
          return pr ? `${params}(${pr})` : params;
        });
        price.innerHTML = text;
      }
    };
  }
  const p = {
    lfy1995: 686868, // 新银越
    lucky06688: 668899, // 芊芊1:1
    yihuimei: 668899, // 芊芊原单
    meige6688: 668899, // 芊芊PU
    qixiaojie1: 710086, // 七小姐
    h9999: 111456, // 明月几时有
    happy829: 111456, // 明月几时有GG
    jgg5678: 441619, // 格美
    pjc1988: 'youpai@362324', // PJC
    ailisi888: 654321, // 爱丽丝
    'hair-beauty': 112233, // 发箍
    fsd10086: 147258, // 手表
    stlzh1688: 88888868, // YXJ
    hxl1688: 609014, // 龙龙
    hwf13579000: 997923, // 龙龙旧
    xiangbao920119: 666666, // 保定
    cassieinspried: 'Grace123', // cassie
    lululemon77: 'lulu0147', // lulu常用
    dajidali520: 'dada520', //yiyi
    wuhan1234: 258369, // 手表
    lmt888: 444555666, // 顺顺
    lulubag: 'lm1234', // 露露12/28 10:17
    yihuimei: 235388, // mirror quality 1/12 16:21
    fashion987: 'kk9877', // 保定
    fangcungongchang: '895623', // 方寸
    bruceppt123: '666669', // 火龙果
    taisenlong: '1234888', // 电子产品
    guibiaopifa888: '9999999',
    wuhang1234: '8888888',
    daiwanxiangbao: '666888',
    junshidingzhi: '87654321',
  };
  const password = p[site] || '';
  const input = document.getElementById('indexlock__input');
  if (password && input) {
    input.value = password;
    const confirmBtn = document.getElementById('indexlock__ok');
    setTimeout(() => {
      confirmBtn.click();
    }, 100);
  }
})();
