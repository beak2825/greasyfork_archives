// ==UserScript==
// @name         free novelai
// @namespace    http://novelai.net/
// @version      0.1
// @description  idk
// @author       You
// @match        https://novelai.net/stories*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448926/free%20novelai.user.js
// @updateURL https://update.greasyfork.org/scripts/448926/free%20novelai.meta.js
// ==/UserScript==
function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}
window.localStorage.removeItem("localTrialState2");
window.localStorage.setItem("localTrialState2", "NTY=")
window.localStorage.removeItem("idk");
window.localStorage.setItem('idk', (document.getElementsByClassName('sc-8197cbff-4 jbTDXQ')[0].innerHTML));
window.localStorage.removeItem("idk1");
window.localStorage.setItem('idk1', '3/50 actions left');
async function f1() {
  var x = await resolveAfter2Seconds(20);
  console.log(x); // 10
}
setInterval(function(){
if ( (localStorage.getItem('idk')) === (localStorage.getItem('idk1'))) {

location.reload()


     window.localStorage.removeItem("idk");
  window.localStorage.setItem('idk', (document.getElementsByClassName('sc-8197cbff-4 jbTDXQ')[0].innerHTML));
  window.localStorage.removeItem("idk1");
window.localStorage.setItem('idk1', '3/50 actions left');
} else {
    window.localStorage.removeItem("idk");
  window.localStorage.setItem('idk', (document.getElementsByClassName('sc-8197cbff-4 jbTDXQ')[0].innerHTML));
  window.localStorage.removeItem("idk1");
window.localStorage.setItem('idk1', '3/50 actions left');

}
  window.localStorage.removeItem("idk");
  window.localStorage.setItem('idk', (document.getElementsByClassName('sc-8197cbff-4 jbTDXQ')[0].innerHTML));
  window.localStorage.removeItem("idk1");
window.localStorage.setItem('idk1', '3/50 actions left');
},1000);

setInterval(function(){
window.localStorage.removeItem("localTrialState2");
window.localStorage.setItem("localTrialState2", "NTY=")
 //logic
},5600);
