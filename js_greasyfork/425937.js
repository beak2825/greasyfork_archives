// ==UserScript==
// @name        SharePointUsage
// @name:zh-cn     SharePoint剩余空间
// @namespace   benzbrake-sharepoint-usate
// @match       https://*.sharepoint.com/personal/*/_layouts/15/onedrive.aspx*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Ryan
// @run-at      document-end
// @description Show sharepoint usage at the left bottom on the sharepoint web page.
// @description:zh-cn Sharepoint 页面左下角显示剩余空间
// @downloadURL https://update.greasyfork.org/scripts/425937/SharePointUsage.user.js
// @updateURL https://update.greasyfork.org/scripts/425937/SharePointUsage.meta.js
// ==/UserScript==
let stormanLink = location.href.split('?')[0].replace('onedrive.aspx', 'storman.aspx'),
    stormanHTML = '',
    cl;

function addLink() {
  let section = document.querySelector('.LeftNav-notifications-section');
  let div = document.createElement('div');
  if (section && stormanHTML.length > 0) {
    clearInterval(cl);
    let div = document.createElement('div');
    div.style.textAlign = 'center';
    div.innerHTML = stormanHTML;
    let progressBar = div.querySelectorAll('.ms-storman-quotabarnormalcol')[0];
    progressBar.style.border = '1px solid #649b61';
    progressBar.style.margin = '5px';
    section.insertBefore(div, section.querySelectorAll('a')[0]);
  }
}

GM_xmlhttpRequest({
    method: "GET",
    url: stormanLink,
    headers: {  
         "Content-Type": "text/html"
    },
    onload: function(response) {
      let div = document.createElement('div');
      div.innerHTML = response.responseText;
      let usage = div.querySelectorAll('.ms-dnd-progressInfoTb');
      if (usage.length > 0) {
        stormanHTML = usage[0].innerHTML;
        cl = setInterval(addLink, 200);
      }
    }
});