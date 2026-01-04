// ==UserScript==
// @name              Twitter expanded image
// @name:en           Twitter expanded image
// @name:zh-CN        Twitter expanded image
// @name:de           Twitter expanded image
// @namespace         https://github.com/Boneflame/groessere-schriftgroesse
// @license	          MIT
// @version           0.2.1
// @description       Replace image address to original and adjust single image's height. Work in with https://userstyles.org/styles/165662/expanded-twitter
// @description:zh-cn 替换推特图片为原图，并让每条推的高度适应图片高度。作为该CSS的辅助脚本：https://userstyles.org/styles/165662/expanded-twitter
// @description:de    Das Skript ändert die Adresse des Bild zu originale Adresse und lässt die Höhe eines Tweet sich an das Bild anpassen. 
// @author            Hitomi Jamella Hoshino
// @include           https://twitter.com/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/374550/Twitter%20expanded%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/374550/Twitter%20expanded%20image.meta.js
// ==/UserScript==


//Replace image's address

function replace() {
	var img, match;
	for (img of document.images) {
		if (match = img.src.match(/(.*?pbs\.twimg\.com\/media\/.+)\.(jpg|gif|png|jpeg|bmp|webp)/)) {
            img.src = match[1] + "?format=" + match[2] + "&name=orig";
		}
	}
};

new MutationObserver(replace).observe(document.getElementsByClassName("stream-items")[0], {
	childList: true,
	subtree: true
});


//Adjust image's height

var stream_Width = document.getElementsByClassName("AdaptiveMedia-container")[0].clientWidth;
var single_photo, Bild, nWidth, nHeight, i;
//i = amount of single image that after site first load + keeping scroll down.
//var i = 0;

function adjust() {
    single_photo = document.getElementsByClassName("AdaptiveMedia-singlePhoto");
    //i = 0, when new tweet loaded, do the adjust ALL OVER.
    i = 0;
    while (i < single_photo.length) {
        Bild = single_photo[i].firstChild.nextSibling.firstChild.nextSibling;
        nWidth = Bild.naturalWidth;
        nHeight = Bild.naturalHeight;

        if (nHeight > 0) {
            if (nWidth < stream_Width) {
                single_photo[i].style.paddingTop = nHeight + 'px';
            }
            i++;
        }
        else {
            //When scroll to the bottom, stop loop, because image isn't loaded yet.
            single_photo = i;
        }
    }
};

//new MutationObserver(adjust).observe(document.getElementsByClassName("stream-items")[0], {
new MutationObserver(adjust).observe(document.body, {
	childList: true,
	subtree: true
});


//click "new tweets"

//total amount of single image after "new tweets" click
/*
var k = 0;
function bbb() {
    document.getElementsByClassName("new-tweets-bar")[0].onclick = function(){
        //j = amount of single image in each "new tweet" click
        var j = 0;
        single_photo = document.getElementsByClassName("AdaptiveMedia-singlePhoto");
        alert(single_photo.length);
        while (j < single_photo.length - i - k) {
            Bild = single_photo[j].firstChild.nextSibling.firstChild.nextSibling;
            nWidth = Bild.naturalWidth;
            nHeight = Bild.naturalHeight;

            if (nHeight > 0) {
                if (nWidth < stream_Width) {
                    single_photo[j].style.paddingTop = nHeight + 'px';
                    alert(Bild.src + single_photo.length);
                }
                j++;
                k++;
            }
        }
    }
};

new MutationObserver(bbb).observe(document.getElementsByClassName("stream-item")[0], {
	childList: true,
	subtree: true
});
*/