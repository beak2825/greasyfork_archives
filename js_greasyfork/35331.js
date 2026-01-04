// ==UserScript==
// @name        FMS Image link replacer
// @namespace   FMS Image link replacer
// @include     http://127.0.0.1:8080/forumviewthread.htm*
// @version     1
// @grant       none
// @description FMS Image Link expander!
// @downloadURL https://update.greasyfork.org/scripts/35331/FMS%20Image%20link%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/35331/FMS%20Image%20link%20replacer.meta.js
// ==/UserScript==

var maxWidth = 1280
var maxHeigth = 1000
var FProxy = 'http://127.0.0.1:8888/'


function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var imageLinkRE = new RegExp('^' + escapeRegExp(FProxy) + '(?:CHK|SSK|USK|KSK)(?:@|%40).+(?:\\.|%2E)(?:jpeg|jpg|png|gif)$', 'i');

var revealImageData = 'data:image/png;base64,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'

function $x(p, context) {
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}


function testLinkToImage(link) {
	return imageLinkRE.test(link.href);
}

function revealPost(post, revealImage) {
    revealImage.parentNode.removeChild(revealImage);
    
    $x('a | div[@class="postattachments"]/div[@class="attachment"]/a', post).filter(testLinkToImage).forEach(function(link) {
        
        img = new Image();
        img.src = link.href;
        img.alt = 'Loading '+link.innerText;

        img.addEventListener('load', function() {
            var setWidth;
            var setHeigth;

            if(this.naturalWidth > maxWidth)
                setWidth = maxWidth +"px"; 
            else
                setWidth = this.naturalWidth + "px";

            if(this.naturalHeigth > maxHeigth)
                setHeigth = maxHeigth +"px"; 
            else
                setHeigth = this.naturalHeigth + "px";

            this.style.width = setWidth;
            this.style.heigth = setHeigth;


        }, false);

        link.innerHTML = '';
        link.appendChild(img);
            
    });
}

function hookPost(post) {
    post.hooked = true;
        
    img = new Image;
    img.src = revealImageData;
    img.title = 'Show images in this post'
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        revealPost(this.parentElement, this);
    });

    post.insertBefore(img, post.firstChild);
}

$x('//td[@class="post"]/a', document.body).filter(testLinkToImage).forEach(function(link) {
    if(!link.parentElement.hooked)
        hookPost(link.parentElement);
});

$x('//td[@class="post"]/div[@class="postattachments"]/div[@class="attachment"]/a', document.body).filter(testLinkToImage).forEach(function(link) {
    var post = link.parentElement.parentElement.parentElement;
    
    if(!post.hooked)
        hookPost(post);
});
