// ==UserScript==
// @name        Copy projects from hetzner.cloud
// @namespace   https://coopdevs.coop
// @match       https://console.hetzner.cloud/projects
// @grant       GM_setClipboard
// @run-at      document-end
// @version     1.0
// @author      lai
// @license     AGPL3
// @description Render a button that writes, as a comma-separated list, the projects into clipboard. It also log the array of projects to console.
// @downloadURL https://update.greasyfork.org/scripts/460978/Copy%20projects%20from%20hetznercloud.user.js
// @updateURL https://update.greasyfork.org/scripts/460978/Copy%20projects%20from%20hetznercloud.meta.js
// ==/UserScript==


function exportProjects() {
  var arr = document.querySelectorAll('[data-projectname]');
  var projects = [];
  for (let i = 0; i < arr.length; i++) {
    projects.push(arr[i].innerHTML);
  }
  var type = 'text/plain';
  var data = projects;
  var controlDiv = document.evaluate('/html/body/hc-app/hc-authenticated/hc-project-list/div/div/hc-page-header/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  let div = document.createElement("div");
    div.id = "projects";
    div.className = "projects";
    div.style = "background-color: var(--color-button-grey-background);text-align:center;border-radius: 5px;";
    div.style.width = "30px";
    div.style.height = "30px";
    div.title = "Click to export projects to clipboard";
    div.innerHTML = "📥";
    div.addEventListener('click', function (event) {
      GM_setClipboard(projects);
      console.log(projects);
    });
  controlDiv.appendChild(div);
}

/**
 * Wait for an element before resolving a promise
 * @param {String} querySelector - Selector of element to wait for
 * @param {Integer} timeout - Milliseconds to wait before timing out, or 0 for no timeout
 */
function waitForElement(querySelector, timeout){
  return new Promise((resolve, reject)=>{
    var timer = false;
    if(document.querySelectorAll(querySelector).length) return resolve();
    const observer = new MutationObserver(()=>{
      if(document.querySelectorAll(querySelector).length){
        observer.disconnect();
        if(timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if(timeout) timer = setTimeout(()=>{
      observer.disconnect();
      reject();
    }, timeout);
  });
}

waitForElement('[data-projectname]', 2000).then(function(){
    exportProjects();
}).catch(()=>{
    alert("Copy projects from hetzner.cloud: Can't load projects from DOM");
});