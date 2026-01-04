// ==UserScript==
// @name         RED Image Unproxier
// @version      0.2
// @description  Copies proxy image URL's on shift-click.
// @author       mrpoot
// @include      https://redacted.sh/*
// @grant        none
// @namespace https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/36179/RED%20Image%20Unproxier.user.js
// @updateURL https://update.greasyfork.org/scripts/36179/RED%20Image%20Unproxier.meta.js
// ==/UserScript==
  
document.addEventListener('click', (e) => {
  if (!e.shiftKey)
    return;
  
  const { target } = e;
  const { nodeName } = target;
  if (nodeName !== 'IMG')
    return;
  
  const { src } = target;
  if (src.indexOf('https://redacted.sh/image.php?') !== 0)
    return;
  
  const [, param] = src.match(/[?&]i=([^&]+)/);
  const originalURL = decodeURIComponent(param.replace(/\+/g, ' '));
  const { body } = document;
  
  const temp = document.createElement('input');
  body.append(temp);
  temp.value = originalURL;
  temp.select();
  document.execCommand("copy");
  body.removeChild(temp);
  
  const notice = document.createElement('div');
  notice.setAttribute('style', 'display:inline-block;position:fixed;top:50vh;left:50vw;padding:15px;background:#fff;color:#000;border:3px solid #666;');
  notice.innerHTML = `Copied <strong>${originalURL}</strong> to the clipboard!`;
  body.append(notice);
  setTimeout(() => body.removeChild(notice), 2000);
  
  e.preventDefault();
}, false);
