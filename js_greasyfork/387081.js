// ==UserScript==
// @name         Google Drive Auto Download (with preview)
// @namespace    https://greasyfork.org/en/users/223360
// @version      1.2.0
// @description  Auto download files from Google Drive with preview.
// @author       Zennar
// @match        https://drive.google.com/file/d/*
// @match        https://drive.google.com/uc?id=*
// @match        https://drive.google.com/uc?export=*
// @grant        none
// @icon         https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_4.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387081/Google%20Drive%20Auto%20Download%20%28with%20preview%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387081/Google%20Drive%20Auto%20Download%20%28with%20preview%29.meta.js
// ==/UserScript==vvvvar thisUrl = document.location.href;

var thisUrl = document.location.href;

if (thisUrl.substr(0,32)=="https://drive.google.com/file/d/" ){
    thisUrl = thisUrl.replace('file/d/', 'uc?id=');
    thisUrl = thisUrl.replace('/view', '&export=download');
    window.location.href = thisUrl;
}
else
{
    var dlbtn = document.getElementById('uc-download-link');
    if (dlbtn.href.length > 0)
    {
        dlbtn.click();
    }
}


