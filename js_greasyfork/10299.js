// ==UserScript==
// @name         Img changer
// @version      0.1
// @description  changes most (some exeptions) images on a page
// @author       Not you
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/12092
// @downloadURL https://update.greasyfork.org/scripts/10299/Img%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/10299/Img%20changer.meta.js
// ==/UserScript==
var src = "https://cloud.githubusercontent.com/assets/10279512/8022411/7ce67eb0-0c84-11e5-9017-6b87ae8eff87.jpg" 
/*CHANGE THE URL IN QUOTES TO A URL. URL MUST HAVE HTTPS:// BEFORE IT. NOT HTTP://
IF YOU CANNOT FIND ONE USE THIS: http://httpsimage.com/
THANK YOU
*/
function replace() {
var inputs = document.getElementsByTagName("input");
    var inputimgs = [];
    for(var i = 0;i < inputs.length;i ++) {
        if(inputs[i].type == "image") inputimgs = inputimgs.concat(inputs[i]);
    }
var imgs = document.getElementsByTagName("img");
//var imgs2 = imgs.concat(inputimgs);
for(var i = 0;i < imgs.length;i ++) {
    var width = imgs[i].clientWidth;
    var height = imgs[i].clientHeight;
    imgs[i].srcset = src;
    imgs[i].src = src;
    imgs[i].width = width;
    imgs[i].height = height;
    console.log(imgs[i]);
}
    for(var i = 0;i < inputimgs.length;i ++) {
    var width = inputimgs[i].clientWidth;
    var height = inputimgs[i].clientHeight;
    inputimgs[i].srcset = src;
    inputimgs[i].src = src;
    inputimgs[i].width = width;
    inputimgs[i].height = height;
    }
}

setInterval(replace(), 1000);
