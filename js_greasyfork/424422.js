// ==UserScript==
// @name        Imgur numbered images
// @description Numbers image galeries on Imgur
// @version     1
// @namespace   powertomato.ovh
// @match       https://imgur.com/gallery/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424422/Imgur%20numbered%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/424422/Imgur%20numbered%20images.meta.js
// ==/UserScript==
var script = document.createElement("script");
document.head.append(script);
script.textContent = `
function numberItems(images) {
    var s = document.getElementById('numberItems');
    if(s) s.parentNode.removeChild(s);
    var rules = [
      '.Gallery-Content--mediaContainer{position:relative;}',
      '.Gallery-Content--mediaContainer:after{position:absolute;top:0.5em;right:100%;padding:0.5em;border-radius:3px 0 0 3px;background:#2c2f34;}'
    ];
    for(var i = 0; i < images.length; i++) {
      rules.push(\`.Gallery-Content--mediaContainer:nth-of-type(\${i+1}):after{content:"#\${i+1}\\\";}\`);
    }
    s = document.createElement('style');
    s.setAttribute('id','numberItems');
    s.appendChild(document.createTextNode(rules.join('\\n')));
    document.head.appendChild(s);
    waitForChange(numberItems);
  }
  var len = null;
  var postId = null;
  function waitForChange(fn) {
    let images = document.querySelectorAll(".Gallery-Content--mediaContainer");
    let currentPostId = JSON.parse(window.postDataJSON)["id"];
    if(len != images.length || postId != currentPostId) {
      len = images.length;
      postId = currentPostId;
      fn(images);
    } else {
      setTimeout(function() { waitForChange(fn) }, 50)
    }
  };
  waitForChange(numberItems);
`;
