// ==UserScript==
// @name        Yet Another Imagehost Redirect
// @namespace   H2Studio
// @description Remove ads from ImageHost
// @require        http://code.jquery.com/jquery-1.11.3.min.js
// @include       *://imgdream.net/viewer.php*
// @include       *://daily-img.com/viewer.php*
// @include       *://www.imgbabes.com/*jpeg.html
// @include       *://www.imgbabes.com/*jpg.html
// @include       *://imgclick.net/*jpeg.html
// @include       *://imgclick.net/*jpg.html
// @include       *://*imgseeds.com/img*
// @version     1.3
// @downloadURL https://update.greasyfork.org/scripts/11053/Yet%20Another%20Imagehost%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/11053/Yet%20Another%20Imagehost%20Redirect.meta.js
// ==/UserScript==


if(UrlContains("imgdream.net") ||
  UrlContains("daily-img.com"))
{
    GetByHref($("div.text_align_center a:first"));
}
if(UrlContains("imgbabes.com"))
{
    GetBySrc($("span#zoomimage img#this_image"));
}
if(UrlContains("imgclick.net"))
{
    if( $(".fuckadb form").length > 0) {
        $(".fuckadb form").submit();
    } else {
        GetBySrc($(".pic"));
    }
}
if(UrlContains("imgseeds.com"))
{
    if( $("#continuetoimage .centred0").length > 0) {
        var path = $("#continuetoimage .centred0").attr("src");
        path = path.replace("small", "big");
        GoTo(path);
        
    } else if ($(".fullimg").length > 0) {
        GetBySrc($(".fullimg img"));
    }
}
// --------------------------------------------------------------------------------------
// public method-------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
function GetByHref(jHref) {
     GoTo(jHref.attr('href'));
}

function GetBySrc(jImg) {
     GoTo(jImg.attr('src'));
}

function GoTo(url) {
     window.location.assign(url);
}

function UrlContains(urlfragment) 
{
	return document.URL.indexOf(urlfragment) != -1;
}