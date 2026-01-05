// ==UserScript==
// @name          Imagehost Redirect
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       6
// @description   Redirects Imagehost Pages to the hosted Image
// @icon          http://i.imgur.com/eLGmXwE.png
// @icon64        http://i.imgur.com/EkKNXD8.png
// @include       *://rule34.paheal.net/post/view/*
// @include       *://g.e-hentai.org/s/*/*
// @include       *://www.quickmeme.com/meme/*
// @include       *://www.quickmeme.com/p/*
// @include       *://*deviantart.com/art/*
// @include       *://adf.ly/*/banner/*
// @include       *://www.linkbucks.com/*/url/*
// @include       *://imgchili.net/show/*/*
// @include       *://imagetwist.com/*
// @include       *://imgdino.com/viewer.php?file=*
// @include       *://imgtiger.com/viewer.php?file=*
// @include       *://*imgspice.com/*/*
// @include       *://www.imgboc.com/share.php?id=*
// @include       *://imagecurl.org/viewer.php?file=*
// @include       *://imagecurl.org/v/*
// @include       *://imageshack.com/i/*
// @include       *://postimg.org/image/*
// @include       *://xxxhost.me/viewer.php?file=*
// @include       *://www.euro-pic.eu/share-*.html
// @include       *://www.pixsor.com/share-*.html
// @include       *://imgboxxx.com/viewer.php?file=*
// @include       *://picturescream.com/x/clean/*
// @include       *://www.fastpics.net/?v=*
// @include       *://www.imgnip.com/viewer.php?file=*
// @include       *://tinypic.com/view.php*pic=*
// @include       *://www.imagefap.com/photo/*/*
// @include       *://imageshimage.com/*
// @include       *://*imagevenue.com/img.php?image=*
// @include       *://www.imagesnake.org/show/*/*
// @include       *://imagenimage.com/*/*
// @include       *://img.i7m.de/show/*
// @include       *://imgbox.com/*
// @include       *://picturevip.com/x/clean/*
// @include       *://imgdone.com/viewer.php?file=*
// @include       *://www.imglooks.com/viewer.php?file=*
// @include       *://www.uploadica.com/?v=*
// @include       *://you-logo.ru/show-image.php?id=*
// @include       *://imgreserve.com/?v=*
// @include       *://www.imgflare.com/*/*
// @include       *://picexposed.com/*/*
// @include       *://imgseeds.com/image/*
// @include       *://imgserve.net/*
// @include       *://imgcandy.net/*
// @include       *://imgmega.com/*/*
// @include       *://08lkk.com/*/*
// @include       *://imgpaying.com/*/*
// @include       *://imgtab.net/v/i/*
// @include       *://imgtube.net/*
// @include       *://www.imgblow.com/*
// @include       *://img-zone.com/*
// @include       *://img.yt/*
// @include       *://pic.re/*
// @include       *://www.imgbabes.com/*/*
// @include       *://www.imglemon.com/*
// @include       *://pixsor.com/share-*.html
// @include       *://imgdetop.com/img-*.html
// @include       *://imgtrex.com/*/*
// @include       *://picturescream.asia/*
// @include       *://damimage.com/img-*.html
// @include       *://www.imagebam.com/image/*
// @include       *://pictures.mrstiff.com/view/picture/full/*
// @include       *://*.photobucket.com/user/*/media/*.htm*
// @grant         none
// @updateVersion 6
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/2641/Imagehost%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/2641/Imagehost%20Redirect.meta.js
// ==/UserScript==

if(false && UrlContains("rule34.paheal.net")){
	imageHasId("main_image");
}
if(false && UrlContains("g.e-hentai.org")){
	imageHasId("img");
}
if(false && UrlContains("www.quickmeme.com")){
	if(UrlContains("/meme/")) { imageHasId("post-image-" + document.URL.split("/meme/")[1].split("?")[0]); }
	else if(UrlContains("/p/")) { imageHasId("post-image-" + document.URL.split("/p/")[1].split("?")[0]); }
}
if(false && UrlContains("deviantart.com")){
	imageHasClass("dev-content-full");
}
// =========================================================================
if(true && UrlContains("adf.ly")){
	setTimeout(function(){
		window.location.assign(document.URL.split("/banner/")[1]);
	}, 100);
}
if(true && UrlContains("www.linkbucks.com")){
	window.location.assign(document.URL.split("/url/")[1]);
}
// =========================================================================
if(true && UrlContains("imgchili.net")){
	imageHasId('show_image');
}
if(true && UrlContains("imagetwist.com")){
	imageHasClass("pic");
}
if(true && UrlContains("imgdino.com")){
	imageHasId('cursor_lupa');
}
if(true && UrlContains("imgtiger.com")){
	imageHasId('cursor_lupa');
}
if(true && UrlContains("imgspice.com")){
	imageHasId('knjdycbs87nbd');
}
if(true && UrlContains("imgboc.com") && !UrlContains("&")){
	window.location.assign(document.URL.replace("share.php", "image.php") + "&jpg");
}
if(true && UrlContains("imagecurl.org")){
	if(UrlContains("/viewer.php?file=")){
		window.location.assign(document.URL.replace("viewer.php?file=", "images/"));
	}else{
		var links = document.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++){
			if(links[i].href.indexOf("cdn.imagecurl.org/images/") != -1){
				window.location.assign(links[i].href);
				break;
			}
		}
	}
	
}
if(true && UrlContains("imageshack.com")){
	var imgDivs = document.getElementsByTagName("img");
	for (var i = 0; i < imgDivs.length; i++){
		if(imgDivs[i].hasAttribute("onerror")){
			window.location.assign(imgDivs[i].src);
			break;
    	}
	}
}
if(true && UrlContains("postimg.org")){
	var anc = document.getElementsByTagName("a");
	for (var i = 0; i < anc.length; i++){
		if(anc[i].href.indexOf("/full/")){
			window.location.assign(anc[i].getElementsByTagName("img")[0].src);
			break;
    	}
	}
}
if(true && UrlContains("xxxhost.me")){
	window.location.assign(document.URL.replace("viewer.php?file=", "files/"));
}
if(true && UrlContains("www.euro-pic.eu")){
	window.location.assign(document.URL.replace("share-", "image.php?id=").replace(".html", ""));
}
if(true && UrlContains("www.pixsor.com")){
	window.location.assign(document.URL.replace("share-", "image.php?id=").replace(".html", ""));
}
if(true && UrlContains("imgboxxx.com")){
	window.location.assign(document.URL.replace("viewer.php?file=", "images/"));
}
if(true && UrlContains("picturescream.com")){
	var div = document.getElementById("shortURL-content");
	var url = div.getElementsByTagName("a")[0].getElementsByTagName("img")[0].src;
	window.location.assign(url);
}
if(true && UrlContains("www.fastpics.net")){
	window.location.assign(document.URL.replace("?v=", "images/"));
}
if(true && UrlContains("www.imgnip.com")){
	window.location.assign(document.URL.replace("viewer.php?file=", "images/"));
}
if(true && UrlContains("www.imagefap.com")){
	imageHasId('mainPhoto');
}
if(true && UrlContains("imageshimage.com")){
	imageHasClass("pic");
}
if(true && UrlContains("imagevenue.com")){
	imageHasId("thepic");
}
if(true && UrlContains("imagenimage.com")){
	imageHasClass("pic");
}
if(true && UrlContains("img.i7m.de")){
	imageHasId('mainImage');
}
if(true && UrlContains("imgbox.com")){
	imageHasId('img');
}
if(true && UrlContains("picturevip.com")){
	window.location.assign(document.getElementById("shortURL-content").getElementsByTagName("a")[0].getElementsByTagName("img")[0].src);
}
if(true && UrlContains("imgdone.com")){
	window.location.assign(document.URL.replace("viewer.php?file=", "images/"));
}
if(true && UrlContains("www.uploadica.com")){
	imageHasId('full_image');
}
if(true && UrlContains("you-logo.ru")){
	nthImageOnPage(0);
}
if(true && UrlContains("imgreserve.com")){
	window.location.assign(document.URL.replace("?v=", "images/") + ".jpg");
}
if(true && UrlContains("www.imgflare.com")){
	imageHasId('this_image');
}
if(true && UrlContains("picexposed.com")){
	imageHasClass('pic');
}
if(true && UrlContains("imgserve.net")){
	imageHasClass('centred');
}
if(true && UrlContains("imgpaying.com")){
	imageHasClass('pic');
}
if(true && UrlContains("imgcandy.net")){
	InputRedirect();
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("imgmega.com")){
	FormRedirect();
	imageHasClass('pic');
}
if(true && UrlContains("pixsor.com")){
	window.location.assign(document.URL.replace("share-", "image.php?id=").replace(".html", ""));
}
if(true && UrlContains("imgdetop.com")){
	InputRedirect();
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("imgtrex.com")){
	imageHasClass('pic');
}
if(true && UrlContains("picturescream.asia")){
	var link = document.getElementById("direct-link");
	if(link != null){
		window.location.assign(link.href);
	}
}
if(true && UrlContains("damimage.com")){
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("pictures.mrstiff.com")){
	imageHasId('img');
}
// Untested =====================================================
if(true && UrlContains("www.imglooks.com")){
	window.location.assign(document.URL.replace("viewer.php?file=", "images/"));
}
if(true && UrlContains("imgseeds.com")){
	imageHasId('img1');
}
if(true && UrlContains("08lkk.com")){
	InputRedirect();
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("img.yt")){
	InputRedirect();
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("imgtab.net")){
	imageHasId('main_image')
}
if(true && UrlContains("imgtube.net")){
	imageHasId('image');
}
if(true && UrlContains("www.imgblow.com")){
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("img-zone.com")){
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("pic.re")){
	FormRedirect();
	imageHasClass('pic');
}
if(true && UrlContains("www.imgbabes.com")){
	imageHasClass('pic');
}
if(true && UrlContains("www.imglemon.com")){
	continueButton = document.getElementsByClass('cti-submit-loading')[0];
	if(continueButton != null) {
		continueButton.click();
	}
	imageHasClass('centred');
	imageHasClass('centred_resized');
}
if(true && UrlContains("photobucket.com")){
    img = document.querySelector('meta[property="og:image"], meta[name="og:image"]');
    img = img ? img.getAttribute('content') : 0;console.log(img);
    if (img) { location.replace(img); }
}
// =========================================================================
if(true && UrlContains("www.imagesnake.org")){
	antiHotLinkingId("img_obj", "imagesnake.org");
}
if(true && UrlContains("tinypic.com")){
	antiHotLinkingId("imgElement", "tinypic.com");
}
if(true && UrlContains("imagebam.com")){
	antiHotLinkingNth(5, "imagebam.com");
}
// =========================================================================
function imageHasId(imageid){
	var image = document.getElementById(imageid);
	if(image != null){
		window.location.assign(image.src);
	}
}
function imageHasClass(imageclass){
	var imgs = document.getElementsByTagName("img");
	for (var i = 0; i < imgs.length; i++){
		if(imgs[i].className == imageclass){
			window.location.assign(imgs[i].src);
			break;
    	}
	}
}
function nthImageOnPage(numb){
	var imgs = document.getElementsByTagName("img");
	if(imgs.length > numb){
		window.location.assign(imgs[numb].src);
	}
}
function antiHotLinkingNth(numb, imageHost){
	var imgs = document.getElementsByTagName("img");
	if(imgs.length > numb){
		antiHotLinkingBuild(imgs[numb].src, imageHost);
	}
}
function antiHotLinkingId(imageId, imageHost){
	antiHotLinkingBuild(document.getElementById(imageId).src, imageHost);
}
function antiHotLinkingBuild(imageLink, imageHost){
	var html = document.createElement('html');
	var body = document.createElement('body');
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var link = document.createElement('a');
	link.setAttribute('href', imageLink);
	link.appendChild(document.createTextNode("click here for the image"));
	link.style.fontSize = "2em";
	div.appendChild(link);
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createTextNode(imageHost + " prevents \"hotlinking\", so you need to click the link"));
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createTextNode("this page made by Imagehost Redirect"));
	body.appendChild(div);
	html.appendChild(body);
	document.replaceChild(html, document.documentElement);
}
function UrlContains(urlfragment){
	return document.URL.indexOf(urlfragment) != -1;
}
// Added by doge {
// https://greasyfork.org/forum/discussion/899
function FormRedirect(){
	var continueForm = document.getElementsByTagName('form')[0];
	if(continueForm != null) {
		continueForm.submit();
	}
}
function InputRedirect(){
	var continueButton = document.getElementsByTagName('input')[0];
	if(continueButton != null) {
		continueButton.click();
	}
}
// doge also contributed several sites. Thanks doge!
// } End