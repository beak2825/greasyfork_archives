// ==UserScript==
// @name         Google Drive Auto Download (without preview)
// @namespace    https://greasyfork.org/en/users/223360
// @version      1.0.0.1
// @description  Auto download files from Google Drive without preview.
// @author       Zennar
// @match        https://drive.google.com/*
// @match        https://docs.google.com/*
// @grant        none
// @icon         https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_4.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/380394/Google%20Drive%20Auto%20Download%20%28without%20preview%29.user.js
// @updateURL https://update.greasyfork.org/scripts/380394/Google%20Drive%20Auto%20Download%20%28without%20preview%29.meta.js
// ==/UserScript==vvvvar thisUrl = document.location.href;
var thisUrl=location.href;
if(/[drive|docs].google.com\/file/.test(thisUrl))
{
    var gdf_id= /\/file\/d\/([^\/]+)/i.exec(thisUrl);
    var newhref = location.protocol+'//'+location.hostname+'/uc?id='+gdf_id[1]+'&export=download'
    location.href=newhref;
}
if(/[drive|docs].google.com\/uc\?id/.test(thisUrl))
{
    var dlbtn = document.getElementById('uc-download-link');
    if (dlbtn.href.length > 0) {
        dlbtn.click();
    }
}
