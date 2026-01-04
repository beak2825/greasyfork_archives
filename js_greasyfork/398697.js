// ==UserScript==
// @name         ID
// @version      0.1
// @description  ///
// @author       nmynov
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=identity
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/398697/ID.user.js
// @updateURL https://update.greasyfork.org/scripts/398697/ID.meta.js
// ==/UserScript==

let parent = document.querySelector('.nav-tabs'),
    li = document.createElement('li'),
    button = document.createElement('a')

button.setAttribute('id','idDRV')
button.textContent = 'История'
button.style.borderRadius = '4px'
button.style.backgroundColor = '#267fb1'
button.style.color = '#fff'
button.style.cursor = 'pointer'
li.appendChild(button)
parent.appendChild(li)

document.getElementById('idDRV').onclick = function(){
      let str = document.getElementById('content').getAttribute('style');
      let res = str.split("_")
      let s = res[1];
      s = s.split('/')[0]
  window.open('https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=identity&limit=100&id='+ s);
}

