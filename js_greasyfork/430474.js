// ==UserScript==
// @name      Imgur numbered images 2
// @description Numbers images in Imgur galleries 
// @namespace ouroborus.org
// @version   2
// @match     https://imgur.com/*
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/430474/Imgur%20numbered%20images%202.user.js
// @updateURL https://update.greasyfork.org/scripts/430474/Imgur%20numbered%20images%202.meta.js
// ==/UserScript==
var script = document.createElement('script');
script.id = 'numbered-images';
script.textContent = `
(()=>{
  var s = document.getElementById('numberItems');
  if(s) s.parentNode.removeChild(s);
  var rules = [
    '#root{counter-reset:images;}',
    '#root .Gallery-Content--media{position:relative;}',
    '#root .Gallery-Content--media:after{position:absolute;top:0.5em;right:100%;padding:0.5em;border-radius:3px 0 0 3px;background:#000;counter-increment:images;content:"#" counter(images);}',
  ];
  s = document.createElement('style');
  s.setAttribute('id','numberItems');
  s.appendChild(document.createTextNode(rules.join('\\n')));
  document.head.appendChild(s);
  console.log(s);
})();
`;
document.head.append(script);
