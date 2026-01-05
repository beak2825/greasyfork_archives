// ==UserScript==
// @name               Fakku.net image list
// @description        Lists all images in a chapter/volume
// @name:zh-TW         Fakku.net 漫畫列表
// @description:zh-TW  列出章節內所有圖片
// @version            1.0.0
// @include            /^https\:\/\/.*?.fakku.net\/manga\/.*/
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/11771/Fakkunet%20image%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/11771/Fakkunet%20image%20list.meta.js
// ==/UserScript==
//
var fl="";
for(var i=0;i<unsafeWindow.params.thumbs.length;i++){
    fl+='<img src="'+unsafeWindow.params.thumbs[i].replace('.thumb.','.').replace('thumbs','images')+'"><br />'
}
document.write(fl); // outputs the list*/