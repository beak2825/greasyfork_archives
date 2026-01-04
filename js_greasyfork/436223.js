// ==UserScript==
// @name         No Afk Disconnect
// @version      1.1.0
// @description  Prevents you from disconnecting when away from the tab
// @namespace    Can't restore? Can't disconnect
// @author       ABC
// 
// @match        https://arras.io/
// @match        https://arras.netlify.app/
// @run-at       document-start
// @grant        none
// 
// @require https://greasyfork.org/scripts/434599-apm/code/APM.js?version=983252
// @downloadURL https://update.greasyfork.org/scripts/436223/No%20Afk%20Disconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/436223/No%20Afk%20Disconnect.meta.js
// ==/UserScript==

arras.hijack().then(socket => {
  const worker = new Worker(URL.createObjectURL(new Blob([`
setInterval(() => {
  postMessage(1);
}, 1000);
`])));
  
  let lastDX = 0,
      lastDY = 0,
      lastFlags = 0;
  let sendingArtificial = false;
  
  socket.hookSend(p => {
    if (p[0] === 'C' && !sendingArtificial) {
      lastDX = p[1];
      lastDY = p[2];
      lastFlags = p[3];
    }
  });
  
  worker.onmessage = () => {
    sendingArtificial = true;
    socket.talk('C', lastDX + (Math.random() < .5 ? 0 : 1), lastDY + (Math.random() < .5 ? 0 : 1), lastFlags);
    sendingArtificial = false;
  }
})