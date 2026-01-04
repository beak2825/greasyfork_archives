// ==UserScript==
// @name       WebSphere
// @namespace  http://herodigital.com/
// @version    1.1
// @description  Adds some functionality to WebSphere
// @match      http://portal2bl01.plygem.com/*
// @copyright  2016+, Ryan Brill
// @require    https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/38671/WebSphere.user.js
// @updateURL https://update.greasyfork.org/scripts/38671/WebSphere.meta.js
// ==/UserScript==

(function() {

    var imgSrc = $("#ImageResourceCmpntIMAGE_FILEresource_cmpnt_filePREVIEW_IMAGE_previewImgDiv").find('img').attr('src');
    imgSrc = imgSrc.replace('/myconnect/', '/connect/');
    imgSrc = imgSrc.substring(0, imgSrc.indexOf("&CACHEID"));

    // console.log(imgSrc);

    $("#ImageResourceCmpntIMAGE_FILEresource_cmpnt_filefileinfo").append("<br /><br />" + imgSrc);

})();