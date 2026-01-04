// ==UserScript==
// @name         История по ВУ
// @version      0.1
// @description  ///
// @author       nmynov
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @grant        none
// @namespace
// @namespace https://greasyfork.org/users/468849
// @downloadURL https://update.greasyfork.org/scripts/398700/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%BF%D0%BE%20%D0%92%D0%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/398700/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%BF%D0%BE%20%D0%92%D0%A3.meta.js
// ==/UserScript==

let parent = document.querySelector('.nav-tabs'),
    li = document.createElement('li'),
    button = document.createElement('a')

button.setAttribute('id','DRV')
button.textContent = 'ВУ'
button.style.borderRadius = '4px'
button.style.backgroundColor = '#267fb1'
button.style.color = '#fff'
button.style.cursor = 'pointer'
li.appendChild(button)
parent.appendChild(li)

document.getElementById('DRV').onclick = function(){
      let str = document.getElementById('content').getAttribute('style');
      let res = str.split("_")
      let s = res[1];
      s = s.split('/')[0]
  window.open('https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkvu&limit=100&id='+ s);
}