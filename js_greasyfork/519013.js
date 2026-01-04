// ==UserScript==
// @name         nHentai preloader
// @version      3
// @namespace    _pc
// @license      MIT
// @description  Adds preloading function for disabled scripts
// @author       verydelight
// @icon         https://nhentai.net/favicon.ico
// @grant        none
// @match	     *://nhentai.net/g/*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519013/nHentai%20preloader.user.js
// @updateURL https://update.greasyfork.org/scripts/519013/nHentai%20preloader.meta.js
// ==/UserScript==
//User settings
var preload_limit = 3; //no of images to preload
var imgtype_marker = 0; //marks the imagetype 1=on 0=off
var imgtypes = [".webp",".jpg"]; //image types to be tried for preloading
//on DOM loaded
document.addEventListener("DOMContentLoaded", function() {
//remove all the lazy load
document.getElementById('content').querySelectorAll("img.lazyload").forEach(e => e.remove());
//get main image
var elms = document.getElementById('image-container').getElementsByTagName('img');
var img=elms[0];
//display original size, use browser for zoom
img.removeAttribute('width');
img.removeAttribute('height');
//pattern to replace dynamic i1 i2 i3 i4 i5 etc. servers by static i4 server
var pattern = /^https\:\/\/i[1-35-9]\.nhentai\.net\/(.*)$/;
//replacement of image source to static server
if (img.src.match(pattern)) {
    img.src = img.src.replace(pattern, 'https://i4.nhentai.net/$1');
};
//image type marking
if(imgtype_marker == 1){
    var container_div = document.createElement("div");
    container_div.id = "divcontainer";
    container_div.style.position='relative';
    container_div.style.textAlign='center';
    container_div.style.display='inline-block';
    document.getElementById('image-container').innerHTML ="";
    document.getElementById('image-container').appendChild(container_div);
    document.getElementById('divcontainer').appendChild(img);
}else{
    document.getElementById('image-container').innerHTML ="";
    document.getElementById('image-container').appendChild(img);
}
//detecting last page
    var maxpage = parseInt(document.getElementById('content').getElementsByClassName('num-pages')[0].innerHTML);
//image operations
    var imgurl = img.src;
    var i;
	var splitimgurl = imgurl.split('/');
	var img_type = splitimgurl[5].split('.');
    if(imgtype_marker == 1){
//image type marker div
    var new_div = document.createElement("div");
    new_div.style.background='rgba(255, 0, 0, 0.3)';
    new_div.style.position='absolute';
    new_div.style.right='0px';
    new_div.style.top='0px';
    new_div.style.padding='5px';
    new_div.style.color='#fff';
    new_div.style.fontSize='30px';
    new_div.innerHTML=img_type[1];
    document.getElementById('divcontainer').appendChild(new_div);
    }
//current image number
    var preload_img = parseInt(img_type[0]);
	var preload_image_url;
//preloading $preload_limit images but not more than maxpage.
	for (i = 0; i < preload_limit; i++) {
		preload_img++;
		if(preload_img <= maxpage){
			imgtypes.forEach((imgtype) => {
				preload_image_url = 'https://i4.nhentai.net/galleries/'+splitimgurl[4]+'/'+preload_img+imgtype;
                (new Image()).src = preload_image_url;
            });
        }
	}
document.getElementById('image-container').removeAttribute("class");
});
