// ==UserScript==
// @name               SEEMH.NET image list
// @description        Lists all images in a chapter/volume
// @name:zh-TW         SEEMH.NET 漫畫列表
// @description:zh-TW  列出章節內所有圖片
// @version            1.0.0
// @include            /^(http|https)\:\/\/.*?.seemh.com\/comic\/.*/
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/12017/SEEMHNET%20image%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/12017/SEEMHNET%20image%20list.meta.js
// ==/UserScript==
//

var fl="";
for(var i=0;i<cInfo.files.length;i++){
    fl+='<a href="'+pVars.manga.filePath+cInfo.files[i]+'"><img src="'+pVars.manga.filePath+cInfo.files[i]+'"></a></br>';
}
fl+='<a href="#" onClick="SMH.nextC()">NEXT &gt;&gt;</a>';
document.write(fl); // outputs the list