// ==UserScript==
// @name         Panopto-DL
// @namespace    https://scripts.lirc572.com/
// @version      0.2
// @description  download video from panopto
// @author       lirc572
// @match        https://*.panopto.com/Panopto/Pages/Viewer.aspx?id=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416679/Panopto-DL.user.js
// @updateURL https://update.greasyfork.org/scripts/416679/Panopto-DL.meta.js
// ==/UserScript==

function pdlDownload() {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') == 'twitter:player:stream') {
      const videoUrl = metas[i].getAttribute('content').split('?')[0];
      console.log(videoUrl);
      window.open(videoUrl);
    }
  }
}

(function () {
  const btnNode = document.createElement('div');
  btnNode.setAttribute('id', 'pdl-container');
  btnNode.innerHTML = '<button id="pdl-btn">'
    + 'Download'
    + '</button>';
  document.body.appendChild(btnNode);
  document.getElementById("pdl-btn").addEventListener(
    "click", pdlDownload, false
  );
})();

GM_addStyle(`
    #pdl-container {
        position:               absolute;
        bottom:                 5px;
        left:                   5px;
        opacity:                0.8;
        z-index:                1100;
    }
    #pdl-btn {
        cursor:                 pointer;
        border:                 none;
        background:             orange;
        font-size:              20px;
        color:                  white;
        padding:                5px 5px;
        text-align:             center;
    }
`);