// ==UserScript==
// @name         bgm_rt
// @version      0.22
// @description  吐槽箱转发
// @author       企鹅
// @match        *://bangumi.tv/
// @match        *://bgm.tv/
// @match        *://chii.in/
// @namespace https://greasyfork.org/users/1067308
// @downloadURL https://update.greasyfork.org/scripts/464802/bgm_rt.user.js
// @updateURL https://update.greasyfork.org/scripts/464802/bgm_rt.meta.js
// ==/UserScript==

function addRTBotton(){
  var divElement = document.querySelector('#timeline');
  var liElements = divElement.querySelectorAll('li');
  var divElement2 = document.querySelector('#columnTimelineInnerB');
  var inputElement = divElement2.querySelector('#SayInput');
  liElements.forEach(li => {
    const button = document.createElement('button');
    button.innerHTML = "转发";
    button.style.cssText = "cursor: pointer; font-size: 13px; color: white; background-color: #4EB1D4; border: 1px solid #48a2c3; border-radius: 10px; display: inline-block; margin-left: 10px;";
    var p = li.querySelector("span.info p.date");
    p.style.display = "inline-block";
    p.insertAdjacentElement("afterend", button);
    var id = li.getAttribute('data-item-user')
    button.addEventListener('click', () => {
        var text = li.querySelector("span.info").textContent.trim();
        text = text.replace(p.textContent, "");
        text = text.replace("转发", "");
        text = text.slice(0, -1);
        console.log(text);
        inputElement.value = "rt “@" + id + " " + text + "”";
    });
  });
}

addRTBotton();
const targetNode = document.querySelector('#tmlContent');
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(targetNode.querySelector(".loading") != null){
    } else {
      addRTBotton();
    }
  });
});
const config = { attributes: true, childList: true, characterData: true };
observer.observe(targetNode, config);