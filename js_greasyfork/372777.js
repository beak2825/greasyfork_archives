// ==UserScript==
// @name         Torn - Old Profile Icons
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match        *.torn.com/profiles.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372777/Torn%20-%20Old%20Profile%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/372777/Torn%20-%20Old%20Profile%20Icons.meta.js
// ==/UserScript==

GM_addStyle(`
.x_old_icon {
    display: inline-block;
    height: 42px;
    pointer-events: none;
    width: 42px;
}
.x_old_attack {
  background: url(https://i.imgur.com/vpFhwKQ.png);
}
.x_old_sendMessage {
  background: url(https://i.imgur.com/LhWQV3u.png);
}
.x_old_initiateChat {
  background: url(https://i.imgur.com/TA2vVJS.png);
}
.x_old_sendMoney {
  background: url(https://i.imgur.com/ZdK90sx.png);
}
.x_old_initiateTrade {
  background: url(https://i.imgur.com/8Pxuu7s.png);
}
.x_old_placeBounty {
  background: url(https://i.imgur.com/nXyJrST.png);
}
.x_old_report {
  background: url(https://i.imgur.com/z7gMjDA.png);
}
.x_old_addFriend {
  background: url(https://i.imgur.com/Ibn3oNV.png);
}
.x_old_addEnemy {
  background: url(https://i.imgur.com/wo79vAV.png);
}
.x_old_personalStats {
  background: url(https://i.imgur.com/4JDN8UE.png);
}
.x_old_viewBazaar {
  background: url(https://i.imgur.com/Lxreb6r.png);
}
.x_old_viewDisplayCabinet {
  background: url(https://i.imgur.com/Fq77eM2.png);
}
`)

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.classList && node.classList.contains('profile-button')) {
        const button_name = node.classList[1].split('button-')[1]
        node.querySelector('i').className = `x_old_icon x_old_${button_name}`
      }
    }
  }
})
observer.observe(document.querySelector('#profileroot'), {
  subtree: true,
  childList: true
})