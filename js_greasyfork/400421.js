// ==UserScript==
// @name        save images
// @namespace   Violentmonkey Scripts
// @match       https://pbs.twimg.com/media/*
// @match       https://*.kakaocdn.net/dn/*/*/*/img.*
// @match       *://*/*.jpg
// @match       *://*/*.jpeg
// @match       *://*/*.png
// @match       *://*/*.gif
// @grant       none
// @version     1.2
// @author      -
// @description 25.02.2020, 16:42:23
// @downloadURL https://update.greasyfork.org/scripts/400421/save%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/400421/save%20images.meta.js
// ==/UserScript==

let css = '\
a.save {\
  background-color: #2b2b2b;\
  width: 100%;\
  height: 5em;\
  position: fixed;\
  text-align: center;\
  display: flex;\
  opacity: 0;\
  transition: opacity .3s;\
  color: white;\
  text-decoration: none;\
  font-family: sans-serif;\
}\
a.save:hover {\
  opacity: 0.8;\
}\
span.save {\
  width: 100%;\
  margin-top: auto;\
  margin-bottom: auto;\
}\
';
let style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.querySelector('head').appendChild(style);

let fname = '';

if (/^https:\/\/pbs\.twimg\.com\/media\/.*:orig$/.test(window.location.href)) {
  let p = window.location.href.split('/');
  let name = p[p.length-1];
  fname = name.split(':')[0];
}
if (/^https:\/\/\w+\.kakaocdn\.net\/dn\/\w+\/\w+\/\w+\/img\.\w{3}$/.test(window.location.href)) {
  let p = window.location.href.split('/');
  let ext = window.location.href.split('\.');
  ext = ext[ext.length-1];
  fname = p[p.length-4]+'_'+p[p.length-3]+'_'+p[p.length-2]+'.'+ext;
}

if (/^https:\/\/v-phinf.pstatic.net\/{1,2}\/\d+_\d+\/.+\/image\.jpg$/.test(window.location.href)) {
  let p = /^https:\/\/v-phinf.pstatic.net\/{1,2}\/\d+_\d+\/(.+)_.+\/image\.jpg$/.exec(window.location.href);
  fname = p[1]+".jpg";
}

if (/^https?:\/\/photo\.speedreiseo\.com\/(.*)\/(.*)$/.test(window.location.href)) {
  let p = /^https?:\/\/photo\.speedreiseo\.com\/(.*)\/(.*)$/.exec(window.location.href);
  fname = p[1]+"_"+p[2];
}

if (/^https:\/\/image\.static\.bstage\.in\/cdn-cgi\/image\/.+\/tri-be\/.+\/.+\/ori\.jpg$/.test(window.location.href)) {
  let p = /^https:\/\/image\.static\.bstage\.in\/cdn-cgi\/image\/.+\/tri-be\/.+\/(.+)\/ori\.jpg$/.exec(window.location.href);
  fname = p[1]+".jpg";
}

let save_bar = document.createElement('a');
save_bar.setAttribute('class', 'save');
save_bar.setAttribute('href', window.location.href);
save_bar.setAttribute('download', fname);
let save_link = document.createElement('span');
save_link.setAttribute('class', 'save');
save_link.innerHTML = 'Zapisz';
save_bar.appendChild(save_link);
document.body.appendChild(save_bar);

document.onkeyup = function(e) {
  if (e.ctrlKey && e.which == 219) {
    save_bar.click();
  }
}

document.body.addEventListener('auxclick', function(e) {
  if (e.which == 2 || e.button == 4) {
    e.preventDefault();
    window.close();
  }
});
