// ==UserScript==
// @name         miHoYo快速註冊
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  快速註冊
// @author       You
// @match        https://account.mihoyo.com/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424444/miHoYo%E5%BF%AB%E9%80%9F%E8%A8%BB%E5%86%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424444/miHoYo%E5%BF%AB%E9%80%9F%E8%A8%BB%E5%86%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

  const images = [
  "https://i.imgur.com/0qhvxFu.png",
  "https://i.imgur.com/Pd7Z2dp.jpg",
  "https://i.imgur.com/1fShkKt.jpg",
  "https://i.imgur.com/Us6ffNx.jpg",
  "https://i.imgur.com/BuWB1ks.png",
  "https://i.imgur.com/D0qz0yo.jpg",
  "https://i.imgur.com/OiA0qd5.png",
  "https://i.imgur.com/8NNbHR9.jpg",
  "https://i.imgur.com/srmHMUH.png",
  "https://i.imgur.com/nX5iZTT.jpg",
  "https://i.imgur.com/0JSlbJ2.png"
];

setInterval(() => {
  GM_addStyle(`
  #root{
    background-image: url(${images[getRandom(0, images.length)]});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
    transition: 0.5s;
  }`)
}, 20000);

//email貼到這裡
const emailList = [
  "kureot40.62@gmail.com",
  "kureot4.062@gmail.com",
  "kureot.4062@gmail.com",
  "kureo.t4062@gmail.com",
  "kure.ot4062@gmail.com",
  "kur.eot4062@gmail.com",
  "ku.reot4062@gmail.com",
  "k.ureot4062@gmail.com",
  "kureot40.6.2@gmail.com",
  "kureot4.06.2@gmail.com",
  "kureot4.0.62@gmail.com",
  "kureot.406.2@gmail.com",
  "kureot.40.62@gmail.com",
  "kureot.4.062@gmail.com",
  "kureo.t406.2@gmail.com",
  "kureo.t40.62@gmail.com",
  "kureo.t4.062@gmail.com",
  "kureo.t.4062@gmail.com",
  "kure.ot406.2@gmail.com",
  "kure.ot40.62@gmail.com",
  "kure.ot4.062@gmail.com",
  "kure.ot.4062@gmail.com",
  "kure.o.t4062@gmail.com",
  "kur.eot406.2@gmail.com",
  "kur.eot40.62@gmail.com",
  "kur.eot4.062@gmail.com",
  "kur.eot.4062@gmail.com",
  "kur.eo.t4062@gmail.com",
  "kur.e.ot4062@gmail.com",
  "ku.reot406.2@gmail.com",
  "ku.reot40.62@gmail.com",
  "ku.reot4.062@gmail.com",
  "ku.reot.4062@gmail.com",
  "ku.reo.t4062@gmail.com",
  "ku.re.ot4062@gmail.com",
  "ku.r.eot4062@gmail.com",
  "k.ureot406.2@gmail.com",
  "k.ureot40.62@gmail.com",
  "k.ureot4.062@gmail.com",
  "k.ureot.4062@gmail.com",
  "k.ureo.t4062@gmail.com",
  "k.ure.ot4062@gmail.com",
  "k.ur.eot4062@gmail.com",
  "k.u.reot4062@gmail.com",
  "kureot4.0.6.2@gmail.com",
  "kureot.40.6.2@gmail.com",
  "kureot.4.06.2@gmail.com",
  "kureot.4.0.62@gmail.com",
  "kureo.t40.6.2@gmail.com",
  "kureo.t4.06.2@gmail.com",
  "kureo.t4.0.62@gmail.com",
  "kureo.t.406.2@gmail.com",
  "kureo.t.40.62@gmail.com",
  "kureo.t.4.062@gmail.com",
  "kure.ot40.6.2@gmail.com",
  "kure.ot4.06.2@gmail.com",
  "kure.ot4.0.62@gmail.com",
  "kure.ot.406.2@gmail.com",
  "kure.ot.40.62@gmail.com",
  "kure.ot.4.062@gmail.com",
  "kure.o.t406.2@gmail.com",
  "kure.o.t40.62@gmail.com",
  "kure.o.t4.062@gmail.com",
  "kure.o.t.4062@gmail.com",
  "kur.eot40.6.2@gmail.com",
  "kur.eot4.06.2@gmail.com",
  "kur.eot4.0.62@gmail.com",
  "kur.eot.406.2@gmail.com",
  "kur.eot.40.62@gmail.com",
  "kur.eot.4.062@gmail.com",
  "kur.eo.t406.2@gmail.com",
  "kur.eo.t40.62@gmail.com",
  "kur.eo.t4.062@gmail.com",
  "kur.eo.t.4062@gmail.com",
  "kur.e.ot406.2@gmail.com",
  "kur.e.ot40.62@gmail.com",
  "kur.e.ot4.062@gmail.com",
  "kur.e.ot.4062@gmail.com",
  "kur.e.o.t4062@gmail.com",
  "ku.reot40.6.2@gmail.com",
  "ku.reot4.06.2@gmail.com",
  "ku.reot4.0.62@gmail.com",
  "ku.reot.406.2@gmail.com",
  "ku.reot.40.62@gmail.com",
  "ku.reot.4.062@gmail.com",
  "ku.reo.t406.2@gmail.com",
  "ku.reo.t40.62@gmail.com",
  "ku.reo.t4.062@gmail.com",
  "ku.reo.t.4062@gmail.com",
  "ku.re.ot406.2@gmail.com",
  "ku.re.ot40.62@gmail.com",
  "ku.re.ot4.062@gmail.com",
  "ku.re.ot.4062@gmail.com",
  "ku.re.o.t4062@gmail.com",
  "ku.r.eot406.2@gmail.com",
  "ku.r.eot40.62@gmail.com",
  "ku.r.eot4.062@gmail.com",
  "ku.r.eot.4062@gmail.com",
  "ku.r.eo.t4062@gmail.com",
  "ku.r.e.ot4062@gmail.com",
  "k.ureot40.6.2@gmail.com",
  "k.ureot4.06.2@gmail.com",
  "k.ureot4.0.62@gmail.com",
  "k.ureot.406.2@gmail.com",
  "k.ureot.40.62@gmail.com",
  "k.ureot.4.062@gmail.com",
  "k.ureo.t406.2@gmail.com",
  "k.ureo.t40.62@gmail.com",
  "k.ureo.t4.062@gmail.com",
  "k.ureo.t.4062@gmail.com",
  "k.ure.ot406.2@gmail.com",
  "k.ure.ot40.62@gmail.com",
  "k.ure.ot4.062@gmail.com",
  "k.ure.ot.4062@gmail.com",
  "k.ure.o.t4062@gmail.com",
  "k.ur.eot406.2@gmail.com",
  "k.ur.eot40.62@gmail.com",
  "k.ur.eot4.062@gmail.com",
  "k.ur.eot.4062@gmail.com",
  "k.ur.eo.t4062@gmail.com",
  "k.ur.e.ot4062@gmail.com",
  "k.u.reot406.2@gmail.com",
  "k.u.reot40.62@gmail.com",
  "k.u.reot4.062@gmail.com",
  "k.u.reot.4062@gmail.com",
  "k.u.reo.t4062@gmail.com",
  "k.u.re.ot4062@gmail.com",
  "k.u.r.eot4062@gmail.com",
  "kureot.4.0.6.2@gmail.com",
  "kureo.t4.0.6.2@gmail.com",
  "kureo.t.40.6.2@gmail.com",
  "kureo.t.4.06.2@gmail.com",
  "kureo.t.4.0.62@gmail.com",
  "kure.ot4.0.6.2@gmail.com",
  "kure.ot.40.6.2@gmail.com",
  "kure.ot.4.06.2@gmail.com",
  "kure.ot.4.0.62@gmail.com",
  "kure.o.t40.6.2@gmail.com",
  "kure.o.t4.06.2@gmail.com",
  "kure.o.t4.0.62@gmail.com",
  "kure.o.t.406.2@gmail.com",
  "kure.o.t.40.62@gmail.com",
  "kure.o.t.4.062@gmail.com",
  "kur.eot4.0.6.2@gmail.com",
  "kur.eot.40.6.2@gmail.com",
  "kur.eot.4.06.2@gmail.com",
  "kur.eot.4.0.62@gmail.com",
  "kur.eo.t40.6.2@gmail.com",
  "kur.eo.t4.06.2@gmail.com",
  "kur.eo.t4.0.62@gmail.com",
  "kur.eo.t.406.2@gmail.com",
  "kur.eo.t.40.62@gmail.com",
  "kur.eo.t.4.062@gmail.com",
  "kur.e.ot40.6.2@gmail.com",
  "kur.e.ot4.06.2@gmail.com",
  "kur.e.ot4.0.62@gmail.com",
  "kur.e.ot.406.2@gmail.com",
  "kur.e.ot.40.62@gmail.com",
  "kur.e.ot.4.062@gmail.com",
  "kur.e.o.t406.2@gmail.com",
  "kur.e.o.t40.62@gmail.com",
  "kur.e.o.t4.062@gmail.com",
  "kur.e.o.t.4062@gmail.com",
  "ku.reot4.0.6.2@gmail.com",
  "ku.reot.40.6.2@gmail.com",
  "ku.reot.4.06.2@gmail.com",
  "ku.reot.4.0.62@gmail.com",
  "ku.reo.t40.6.2@gmail.com",
  "ku.reo.t4.06.2@gmail.com",
  "ku.reo.t4.0.62@gmail.com",
  "ku.reo.t.406.2@gmail.com",
  "ku.reo.t.40.62@gmail.com",
  "ku.reo.t.4.062@gmail.com",
  "ku.re.ot40.6.2@gmail.com",
  "ku.re.ot4.06.2@gmail.com",
  "ku.re.ot4.0.62@gmail.com",
  "ku.re.ot.406.2@gmail.com",
  "ku.re.ot.40.62@gmail.com",
  "ku.re.ot.4.062@gmail.com",
  "ku.re.o.t406.2@gmail.com",
  "ku.re.o.t40.62@gmail.com",
  "ku.re.o.t4.062@gmail.com",
  "ku.re.o.t.4062@gmail.com",
  "ku.r.eot40.6.2@gmail.com",
  "ku.r.eot4.06.2@gmail.com",
  "ku.r.eot4.0.62@gmail.com",
  "ku.r.eot.406.2@gmail.com",
  "ku.r.eot.40.62@gmail.com",
  "ku.r.eot.4.062@gmail.com",
  "ku.r.eo.t406.2@gmail.com",
  "ku.r.eo.t40.62@gmail.com",
  "ku.r.eo.t4.062@gmail.com",
  "ku.r.eo.t.4062@gmail.com",
  "ku.r.e.ot406.2@gmail.com",
  "ku.r.e.ot40.62@gmail.com",
  "ku.r.e.ot4.062@gmail.com",
  "ku.r.e.ot.4062@gmail.com",
  "ku.r.e.o.t4062@gmail.com",
  "k.ureot4.0.6.2@gmail.com",
  "k.ureot.40.6.2@gmail.com",
  "k.ureot.4.06.2@gmail.com",
  "k.ureot.4.0.62@gmail.com",
  "k.ureo.t40.6.2@gmail.com",
  "k.ureo.t4.06.2@gmail.com",
  "k.ureo.t4.0.62@gmail.com",
  "k.ureo.t.406.2@gmail.com",
  "k.ureo.t.40.62@gmail.com",
  "k.ureo.t.4.062@gmail.com",
  "k.ure.ot40.6.2@gmail.com",
  "k.ure.ot4.06.2@gmail.com",
  "k.ure.ot4.0.62@gmail.com",
  "k.ure.ot.406.2@gmail.com",
  "k.ure.ot.40.62@gmail.com",
  "k.ure.ot.4.062@gmail.com",
  "k.ure.o.t406.2@gmail.com",
  "k.ure.o.t40.62@gmail.com",
  "k.ure.o.t4.062@gmail.com",
  "k.ure.o.t.4062@gmail.com",
  "k.ur.eot40.6.2@gmail.com",
  "k.ur.eot4.06.2@gmail.com",
  "k.ur.eot4.0.62@gmail.com",
  "k.ur.eot.406.2@gmail.com",
  "k.ur.eot.40.62@gmail.com",
  "k.ur.eot.4.062@gmail.com",
  "k.ur.eo.t406.2@gmail.com",
  "k.ur.eo.t40.62@gmail.com",
  "k.ur.eo.t4.062@gmail.com",
  "k.ur.eo.t.4062@gmail.com",
  "k.ur.e.ot406.2@gmail.com",
  "k.ur.e.ot40.62@gmail.com",
  "k.ur.e.ot4.062@gmail.com",
  "k.ur.e.ot.4062@gmail.com",
  "k.ur.e.o.t4062@gmail.com",
  "k.u.reot40.6.2@gmail.com",
  "k.u.reot4.06.2@gmail.com",
  "k.u.reot4.0.62@gmail.com",
  "k.u.reot.406.2@gmail.com",
  "k.u.reot.40.62@gmail.com",
  "k.u.reot.4.062@gmail.com",
  "k.u.reo.t406.2@gmail.com",
  "k.u.reo.t40.62@gmail.com",
  "k.u.reo.t4.062@gmail.com",
  "k.u.reo.t.4062@gmail.com",
  "k.u.re.ot406.2@gmail.com",
  "k.u.re.ot40.62@gmail.com",
  "k.u.re.ot4.062@gmail.com",
  "k.u.re.ot.4062@gmail.com",
  "k.u.re.o.t4062@gmail.com",
  "k.u.r.eot406.2@gmail.com",
  "k.u.r.eot40.62@gmail.com",
  "k.u.r.eot4.062@gmail.com",
  "k.u.r.eot.4062@gmail.com",
  "k.u.r.eo.t4062@gmail.com",
  "k.u.r.e.ot4062@gmail.com",
  "kureo.t.4.0.6.2@gmail.com",
  "kure.ot.4.0.6.2@gmail.com",
  "kure.o.t4.0.6.2@gmail.com",
  "kure.o.t.40.6.2@gmail.com",
  "kure.o.t.4.06.2@gmail.com",
  "kure.o.t.4.0.62@gmail.com",
  "kur.eot.4.0.6.2@gmail.com",
  "kur.eo.t4.0.6.2@gmail.com",
  "kur.eo.t.40.6.2@gmail.com",
  "kur.eo.t.4.06.2@gmail.com",
  "kur.eo.t.4.0.62@gmail.com",
  "kur.e.ot4.0.6.2@gmail.com",
  "kur.e.ot.40.6.2@gmail.com",
  "kur.e.ot.4.06.2@gmail.com",
  "kur.e.ot.4.0.62@gmail.com",
  "kur.e.o.t40.6.2@gmail.com",
  "kur.e.o.t4.06.2@gmail.com",
  "kur.e.o.t4.0.62@gmail.com",
  "kur.e.o.t.406.2@gmail.com",
  "kur.e.o.t.40.62@gmail.com",
  "kur.e.o.t.4.062@gmail.com",
  "ku.reot.4.0.6.2@gmail.com",
  "ku.reo.t4.0.6.2@gmail.com",
  "ku.reo.t.40.6.2@gmail.com",
  "ku.reo.t.4.06.2@gmail.com",
  "ku.reo.t.4.0.62@gmail.com",
  "ku.re.ot4.0.6.2@gmail.com",
  "ku.re.ot.40.6.2@gmail.com",
  "ku.re.ot.4.06.2@gmail.com",
  "ku.re.ot.4.0.62@gmail.com",
  "ku.re.o.t40.6.2@gmail.com",
  "ku.re.o.t4.06.2@gmail.com",
  "ku.re.o.t4.0.62@gmail.com",
  "ku.re.o.t.406.2@gmail.com",
  "ku.re.o.t.40.62@gmail.com",
  "ku.re.o.t.4.062@gmail.com",
  "ku.r.eot4.0.6.2@gmail.com",
  "ku.r.eot.40.6.2@gmail.com",
  "ku.r.eot.4.06.2@gmail.com",
  "ku.r.eot.4.0.62@gmail.com",
  "ku.r.eo.t40.6.2@gmail.com",
  "ku.r.eo.t4.06.2@gmail.com",
  "ku.r.eo.t4.0.62@gmail.com",
  "ku.r.eo.t.406.2@gmail.com",
  "ku.r.eo.t.40.62@gmail.com",
  "ku.r.eo.t.4.062@gmail.com",
  "ku.r.e.ot40.6.2@gmail.com",
  "ku.r.e.ot4.06.2@gmail.com",
  "ku.r.e.ot4.0.62@gmail.com",
  "ku.r.e.ot.406.2@gmail.com",
  "ku.r.e.ot.40.62@gmail.com",
  "ku.r.e.ot.4.062@gmail.com",
  "ku.r.e.o.t406.2@gmail.com",
  "ku.r.e.o.t40.62@gmail.com",
  "ku.r.e.o.t4.062@gmail.com",
  "ku.r.e.o.t.4062@gmail.com",
  "k.ureot.4.0.6.2@gmail.com",
  "k.ureo.t4.0.6.2@gmail.com",
  "k.ureo.t.40.6.2@gmail.com",
  "k.ureo.t.4.06.2@gmail.com",
  "k.ureo.t.4.0.62@gmail.com",
  "k.ure.ot4.0.6.2@gmail.com",
  "k.ure.ot.40.6.2@gmail.com",
  "k.ure.ot.4.06.2@gmail.com",
  "k.ure.ot.4.0.62@gmail.com",
  "k.ure.o.t40.6.2@gmail.com",
  "k.ure.o.t4.06.2@gmail.com",
  "k.ure.o.t4.0.62@gmail.com",
  "k.ure.o.t.406.2@gmail.com",
  "k.ure.o.t.40.62@gmail.com",
  "k.ure.o.t.4.062@gmail.com",
  "k.ur.eot4.0.6.2@gmail.com",
  "k.ur.eot.40.6.2@gmail.com",
  "k.ur.eot.4.06.2@gmail.com",
  "k.ur.eot.4.0.62@gmail.com",
  "k.ur.eo.t40.6.2@gmail.com",
  "k.ur.eo.t4.06.2@gmail.com",
  "k.ur.eo.t4.0.62@gmail.com",
  "k.ur.eo.t.406.2@gmail.com",
  "k.ur.eo.t.40.62@gmail.com",
  "k.ur.eo.t.4.062@gmail.com",
  "k.ur.e.ot40.6.2@gmail.com",
  "k.ur.e.ot4.06.2@gmail.com",
  "k.ur.e.ot4.0.62@gmail.com",
  "k.ur.e.ot.406.2@gmail.com",
  "k.ur.e.ot.40.62@gmail.com",
  "k.ur.e.ot.4.062@gmail.com",
  "k.ur.e.o.t406.2@gmail.com",
  "k.ur.e.o.t40.62@gmail.com",
  "k.ur.e.o.t4.062@gmail.com",
  "k.ur.e.o.t.4062@gmail.com",
  "k.u.reot4.0.6.2@gmail.com",
  "k.u.reot.40.6.2@gmail.com",
  "k.u.reot.4.06.2@gmail.com",
  "k.u.reot.4.0.62@gmail.com",
  "k.u.reo.t40.6.2@gmail.com",
  "k.u.reo.t4.06.2@gmail.com",
  "k.u.reo.t4.0.62@gmail.com",
  "k.u.reo.t.406.2@gmail.com",
  "k.u.reo.t.40.62@gmail.com",
  "k.u.reo.t.4.062@gmail.com",
  "k.u.re.ot40.6.2@gmail.com",
  "k.u.re.ot4.06.2@gmail.com",
  "k.u.re.ot4.0.62@gmail.com",
  "k.u.re.ot.406.2@gmail.com",
  "k.u.re.ot.40.62@gmail.com",
  "k.u.re.ot.4.062@gmail.com",
  "k.u.re.o.t406.2@gmail.com",
  "k.u.re.o.t40.62@gmail.com",
  "k.u.re.o.t4.062@gmail.com",
  "k.u.re.o.t.4062@gmail.com",
  "k.u.r.eot40.6.2@gmail.com",
  "k.u.r.eot4.06.2@gmail.com",
  "k.u.r.eot4.0.62@gmail.com",
  "k.u.r.eot.406.2@gmail.com",
  "k.u.r.eot.40.62@gmail.com",
  "k.u.r.eot.4.062@gmail.com",
  "k.u.r.eo.t406.2@gmail.com",
  "k.u.r.eo.t40.62@gmail.com",
  "k.u.r.eo.t4.062@gmail.com",
  "k.u.r.eo.t.4062@gmail.com",
  "k.u.r.e.ot406.2@gmail.com",
  "k.u.r.e.ot40.62@gmail.com",
  "k.u.r.e.ot4.062@gmail.com",
  "k.u.r.e.ot.4062@gmail.com",
  "k.u.r.e.o.t4062@gmail.com",
  "kure.o.t.4.0.6.2@gmail.com",
  "kur.eo.t.4.0.6.2@gmail.com",
  "kur.e.ot.4.0.6.2@gmail.com",
  "kur.e.o.t4.0.6.2@gmail.com",
  "kur.e.o.t.40.6.2@gmail.com",
  "kur.e.o.t.4.06.2@gmail.com",
  "kur.e.o.t.4.0.62@gmail.com",
  "ku.reo.t.4.0.6.2@gmail.com",
  "ku.re.ot.4.0.6.2@gmail.com",
  "ku.re.o.t4.0.6.2@gmail.com",
  "ku.re.o.t.40.6.2@gmail.com",
  "ku.re.o.t.4.06.2@gmail.com",
  "ku.re.o.t.4.0.62@gmail.com",
  "ku.r.eot.4.0.6.2@gmail.com",
  "ku.r.eo.t4.0.6.2@gmail.com",
  "ku.r.eo.t.40.6.2@gmail.com",
  "ku.r.eo.t.4.06.2@gmail.com",
  "ku.r.eo.t.4.0.62@gmail.com",
  "ku.r.e.ot4.0.6.2@gmail.com",
  "ku.r.e.ot.40.6.2@gmail.com",
  "ku.r.e.ot.4.06.2@gmail.com",
  "ku.r.e.ot.4.0.62@gmail.com",
  "ku.r.e.o.t40.6.2@gmail.com",
  "ku.r.e.o.t4.06.2@gmail.com",
  "ku.r.e.o.t4.0.62@gmail.com",
  "ku.r.e.o.t.406.2@gmail.com",
  "ku.r.e.o.t.40.62@gmail.com",
  "ku.r.e.o.t.4.062@gmail.com",
  "k.ureo.t.4.0.6.2@gmail.com",
  "k.ure.ot.4.0.6.2@gmail.com",
  "k.ure.o.t4.0.6.2@gmail.com",
  "k.ure.o.t.40.6.2@gmail.com",
  "k.ure.o.t.4.06.2@gmail.com",
  "k.ure.o.t.4.0.62@gmail.com",
  "k.ur.eot.4.0.6.2@gmail.com",
  "k.ur.eo.t4.0.6.2@gmail.com",
  "k.ur.eo.t.40.6.2@gmail.com",
  "k.ur.eo.t.4.06.2@gmail.com",
  "k.ur.eo.t.4.0.62@gmail.com",
  "k.ur.e.ot4.0.6.2@gmail.com",
  "k.ur.e.ot.40.6.2@gmail.com",
  "k.ur.e.ot.4.06.2@gmail.com",
  "k.ur.e.ot.4.0.62@gmail.com",
  "k.ur.e.o.t40.6.2@gmail.com",
  "k.ur.e.o.t4.06.2@gmail.com",
  "k.ur.e.o.t4.0.62@gmail.com",
  "k.ur.e.o.t.406.2@gmail.com",
  "k.ur.e.o.t.40.62@gmail.com",
  "k.ur.e.o.t.4.062@gmail.com",
  "k.u.reot.4.0.6.2@gmail.com",
  "k.u.reo.t4.0.6.2@gmail.com",
  "k.u.reo.t.40.6.2@gmail.com",
  "k.u.reo.t.4.06.2@gmail.com",
  "k.u.reo.t.4.0.62@gmail.com",
  "k.u.re.ot4.0.6.2@gmail.com",
  "k.u.re.ot.40.6.2@gmail.com",
  "k.u.re.ot.4.06.2@gmail.com",
  "k.u.re.ot.4.0.62@gmail.com",
  "k.u.re.o.t40.6.2@gmail.com",
  "k.u.re.o.t4.06.2@gmail.com",
  "k.u.re.o.t4.0.62@gmail.com",
  "k.u.re.o.t.406.2@gmail.com",
  "k.u.re.o.t.40.62@gmail.com",
  "k.u.re.o.t.4.062@gmail.com",
  "k.u.r.eot4.0.6.2@gmail.com",
  "k.u.r.eot.40.6.2@gmail.com",
  "k.u.r.eot.4.06.2@gmail.com",
  "k.u.r.eot.4.0.62@gmail.com",
  "k.u.r.eo.t40.6.2@gmail.com",
  "k.u.r.eo.t4.06.2@gmail.com",
  "k.u.r.eo.t4.0.62@gmail.com",
  "k.u.r.eo.t.406.2@gmail.com",
  "k.u.r.eo.t.40.62@gmail.com",
  "k.u.r.eo.t.4.062@gmail.com",
  "k.u.r.e.ot40.6.2@gmail.com",
  "k.u.r.e.ot4.06.2@gmail.com",
  "k.u.r.e.ot4.0.62@gmail.com",
  "k.u.r.e.ot.406.2@gmail.com",
  "k.u.r.e.ot.40.62@gmail.com",
  "k.u.r.e.ot.4.062@gmail.com",
  "k.u.r.e.o.t406.2@gmail.com",
  "k.u.r.e.o.t40.62@gmail.com",
  "k.u.r.e.o.t4.062@gmail.com",
  "k.u.r.e.o.t.4062@gmail.com",
  "kur.e.o.t.4.0.6.2@gmail.com",
  "ku.re.o.t.4.0.6.2@gmail.com",
  "ku.r.eo.t.4.0.6.2@gmail.com",
  "ku.r.e.ot.4.0.6.2@gmail.com",
  "ku.r.e.o.t4.0.6.2@gmail.com",
  "ku.r.e.o.t.40.6.2@gmail.com",
  "ku.r.e.o.t.4.06.2@gmail.com",
  "ku.r.e.o.t.4.0.62@gmail.com",
  "k.ure.o.t.4.0.6.2@gmail.com",
  "k.ur.eo.t.4.0.6.2@gmail.com",
  "k.ur.e.ot.4.0.6.2@gmail.com",
  "k.ur.e.o.t4.0.6.2@gmail.com",
  "k.ur.e.o.t.40.6.2@gmail.com",
  "k.ur.e.o.t.4.06.2@gmail.com",
  "k.ur.e.o.t.4.0.62@gmail.com",
  "k.u.reo.t.4.0.6.2@gmail.com",
  "k.u.re.ot.4.0.6.2@gmail.com",
  "k.u.re.o.t4.0.6.2@gmail.com",
  "k.u.re.o.t.40.6.2@gmail.com",
  "k.u.re.o.t.4.06.2@gmail.com",
  "k.u.re.o.t.4.0.62@gmail.com",
  "k.u.r.eot.4.0.6.2@gmail.com",
  "k.u.r.eo.t4.0.6.2@gmail.com",
  "k.u.r.eo.t.40.6.2@gmail.com",
  "k.u.r.eo.t.4.06.2@gmail.com",
  "k.u.r.eo.t.4.0.62@gmail.com",
  "k.u.r.e.ot4.0.6.2@gmail.com",
  "k.u.r.e.ot.40.6.2@gmail.com",
  "k.u.r.e.ot.4.06.2@gmail.com",
  "k.u.r.e.ot.4.0.62@gmail.com",
];

const password = "Aa123123";

GM_addStyle(`
  #root{
    background-image: url(${images[getRandom(0, images.length)]});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
    transition: 0.5s;
  }

  .register-form-container,
  .mhy-sidebar,
  .content-container{
    background: hsla(0,0%,100%,.6) !important; 
    backdrop-filter: blur(4px) !important;
  }

  .account-info-value{
    background: rgba(0,0,0,0.4);
    color: #fff;
    padding:5px;
  }
`)

GM_registerMenuCommand("輸入Google帳密", () => {
  let account = prompt("帳號");
  if (!account) {
    return;
  }
  let password = prompt("密碼");
  if (!password) {
    return;
  }
  GM_setValue("account", account);
  GM_setValue("password", password);
}, "");

if (!localStorage.getItem("__count")) {
  localStorage.setItem("__count", 0)
}
let count = localStorage.getItem("__count");

window.addEventListener("hashchange", () => {
  startup();
})

function startup() {
  if (location.hash.includes("login")) {
    return;
  }
  let timer = setInterval(() => {
    if (location.hash.includes("#/account/accountInfo") && !location.hash.includes("cb_route")) {
      clearInterval(timer);
      return;
    }

    let emailInput = document.querySelector(".input-container input");

    if (emailInput) {
      nextBtn(emailInput);
      codeBtn(emailInput);
      let p1 = document.querySelectorAll(".input-container input[type=password]")[0];
      let p2 = document.querySelectorAll(".input-container input[type=password]")[1];

      document.querySelector(".box-container").click()

      emailInput.value = emailList[count];
      p1.value = password;
      p2.value = password;

      trigger(emailInput, "input");
      trigger(p1, "input");
      trigger(p2, "input");

      clearInterval(timer);
    }
  }, 1);

  setInterval(() => {
    if (!location.hash.includes("#/account/accountInfo")) {
      return;
    }
    let accountEmail = document.querySelectorAll(".account-info-value")[3];

    if (accountEmail) {
      if (accountEmail.innerHTML != emailList[localStorage.getItem("__count")]) {
        function copy(text) {
          var input = document.createElement('input');
          input.setAttribute('value', text);
          document.body.appendChild(input);
          input.select();
          var result = document.execCommand('copy');
          document.body.removeChild(input);
          return result;
        }
        accountEmail.innerHTML = emailList[localStorage.getItem("__count")];
        let btn = document.createElement("button");
        btn.innerHTML = "複製郵件";
        btn.style.padding = "10px"
        btn.style.marginLeft = "10px"

        btn.onclick = () => {
          copy(document.querySelectorAll(".account-info-value")[3].innerText);
        }

        let btn2 = btn.cloneNode(true);
        btn2.innerHTML = "複製密碼";
        btn2.onclick = () => {
          copy(password);
        }

        let btn3 = btn.cloneNode(true);
        btn3.innerHTML = "複製兌換碼 GENSHINGIFT";
        btn3.onclick = () => {
          copy("GENSHINGIFT");
        }
        document.querySelectorAll(".account-info-item")[3].appendChild(btn);
        document.querySelectorAll(".account-info-item")[3].appendChild(btn2);
        document.querySelectorAll(".account-info-item")[3].appendChild(btn3);
      }
    }
  }, 100)

  /**
   * 
   * @param {Element} emailInput 
   */
  function codeBtn() {
    let input = document.querySelector("input[placeholder='驗證碼']");
    let btn = document.createElement("button");

    btn.innerHTML = "監聽驗證碼";
    document.querySelector(".input-inner-btn").addEventListener("click", listenCode)
    btn.onclick = listenCode

    function listenCode(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.innerHTML.includes("已發送")) {
        return;
      }
      let date = new Date().toJSON();
      btn.innerHTML = "監聽中...";
      btn.disabled = true;

      (async () => {
        while (true) {
          const code = await getCode(date);

          if (code) {
            input.value = code;
            trigger(input, "input");
            btn.innerHTML = "監聽驗證碼"
            btn.disabled = false;
            break;
          }

          await delay(1.2);
        }
      })();
    }

    input.parentElement.appendChild(btn);
  }

  function delay(e) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, e * 1000);
    })
  }

  function getCode(date) {
    return new Promise(async (resolve, reject) => {
      let res = await fetch(`https://registermihoyo.oddstab.cf/WeatherForecast/gmail-code?date=${date}&account=${GM_getValue("account")}&password=${GM_getValue("password")}`);
      let text = await res.text();
      if (text != "false") {
        resolve(text);
        console.log("done")
      } else {
        console.log("none")
        resolve();
      }
    })
  }

  function nextBtn(emailInput) {
    let pbtn = document.createElement("button");
    pbtn.innerHTML = "上一個";
    let nbtn = document.createElement("button");
    nbtn.innerHTML = "下一個";

    let reloadBtn = document.createElement("button");
    reloadBtn.innerHTML = "刷新"
    reloadBtn.onclick = (e) => {
      e.preventDefault();
      location.reload();
    }

    pbtn.onclick = (e) => {
      e.preventDefault();
      localStorage.setItem("__count", --count);
      emailInput.value = emailList[count];
      trigger(emailInput, "input");
    }
    nbtn.onclick = (e) => {
      e.preventDefault();
      localStorage.setItem("__count", ++count);
      emailInput.value = emailList[count];
      trigger(emailInput, "input");
    }
    emailInput.parentElement.appendChild(pbtn);
    emailInput.parentElement.appendChild(nbtn);
    emailInput.parentElement.appendChild(reloadBtn);
  }

  function trigger(el, eventName) {
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent(eventName, false, true);
    el.dispatchEvent(evt);
  }

  setInterval(() => {
    if (document.querySelector(".tab-item.item-active")) {
      document.querySelector(".tab-item.item-active").innerHTML = "電子郵件註冊 <br/> " + (Number(localStorage.getItem("__count")) + 1) + "隻" + ((Number(localStorage.getItem("__count")) + 1) * 16) + "抽"
    }
  }, 10);
}

function getRandom(min, max) {
  return Math.floor(Math.random() * max) + min;
};

startup();
})();