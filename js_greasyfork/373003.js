// ==UserScript==
// @name        Imgur numbered images
// @description Numbers images in Imgur galleries
// @namespace   ouroborus.org
// @version     1
// @match       https://imgur.com/gallery/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373003/Imgur%20numbered%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/373003/Imgur%20numbered%20images.meta.js
// ==/UserScript==
var script = document.createElement("script");
document.head.append(script);
script.textContent = `
function numberItems(images) {
  var s = document.getElementById('numberItems');
  if(s) s.parentNode.removeChild(s);
  var rules = [
    '.post-image-container{position:relative;}',
    '.post-image-container:after{position:absolute;top:0.5em;right:100%;padding:0.5em;border-radius:3px 0 0 3px;background:#2c2f34;}'
  ];
  for(var i = 0; i < images.length; i++) {
    rules.push(\`[id="\${images[i].hash}"]:after{content:"#\${i+1}\\\";}\`);
  }
  s = document.createElement('style');
  s.setAttribute('id','numberItems');
  s.appendChild(document.createTextNode(rules.join('\\n')));
  document.head.appendChild(s);
  waitForChange(numberItems);
}
var hash = null;
function waitForChange(fn) {
  let image = Imgur.Gallery._instance.imgurInsideNav._.image;
  if(hash != image.hash && image.album_images) {
    hash = image.hash;
    fn(image.album_images.images || image.album_images);
  } else {
    setTimeout(function() { waitForChange(fn) }, 50)
  }
};
waitForChange(numberItems);
`;
