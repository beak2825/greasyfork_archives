// ==UserScript==
// @name        Cattify_staroetv
// @namespace   cattify
// @include     http://staroetv.su/
// @include     http://staroetv.su/*
// @include     staroetv.su
// @include     staroetv.su/*
// @version     1.2
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @description duh
// @downloadURL https://update.greasyfork.org/scripts/4799/Cattify_staroetv.user.js
// @updateURL https://update.greasyfork.org/scripts/4799/Cattify_staroetv.meta.js
// ==/UserScript==
//var cssTxt  = GM_getResourceText ("YOUR_CSS");
//GM_addStyle (cssTxt);

var imgs = document.getElementsByTagName('img');
var text_source = document.body.innerHTML;
var pic_real_width,
pic_real_height;
for (var i = 0, l = imgs.length; i < l; i++) {
  pic_real_width = imgs[i].width;
  pic_real_height = imgs[i].height;
  imgs[i].src = 'http://www.vetprofessionals.com/catprofessional/images/home-cat.jpg';
  imgs[i].height = pic_real_height;
  //imgs[i].width = pic_real_width;
}

document.body.innerHTML = document.body.innerHTML.replace(/Росс/ig, 'Котовас');
document.title = document.title.replace(/Старый телевизор/ig, 'Старая тёплая коробка для кошки');
document.title = document.title.replace(/ТВ/ig, 'мяу');
document.title = document.title.replace(/Телевиден/ig, 'мяукан');
document.body.innerHTML = document.body.innerHTML.replace(/ТВ/ig, 'мяу');
document.body.innerHTML = document.body.innerHTML.replace(/теле/ig, 'мурр');
document.body.innerHTML = document.body.innerHTML.replace(/Телевиден/ig, 'Мяукан');
