// ==UserScript==
// @name            Show Just Image Misc
// @description     Removes garbage from some image hosting sites and displays the image only.
// @version         1.0.48
// @grant           none
// @icon            data:image/png;base64,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
// @include         http://pixxtra.com/image/*
// @include         http://fifialfa.com/today.php?pic=*full=1
// @include         http://www.fifialfa.com/today.php?pic=*full=1
// @include         http://www.morazzia.com/*/*
// @include         http://www.starpix.us/show.php/*.htm
// @include         http://www.starpix.us/show.php/*.html
// @include         http://www.exgirlfriendmarket.com/*/*.html
// @include         http://sharezones.com/view.php?*
// @include         http://4ufrom.me/viewer.php?*
// @include         http://imgchili.com/show/*
// @include         http://imgchili.net/show/*
// @include         http://imgchili.com/viewer*
// @include         http://www.asredas.com/image.php?img=*
// @include         http://www.glam0ur.com/*/*.html
// @include         http://www.piratepix.org/show*.html
// @include         http://pixme.es/share-*.html
// @include         http://euro-pic.eu/share-*.html
// @include         http://www.euro-pic.eu/share-*.html
// @include         http://imgurn.net/?v=*
// @include         http://www.wlock.org/?v=*
// @include         http://imgnix.com/show*
// @include         http://ximg.me/viewer*
// @include         http://www.seedimage.com/X/viewer.php*
// @include         http://mytimba.com/Image.aspx*
// @include         http://www.lettherebeporn.com/galleries/*/*/*/*.php
// @include         http://*.pixsor.com/share*
// @include         http://pixsor.com/share*
// @include         http://dailyjunky.com/?attachment_id=*
// @include         http://tajcelebz.com/?attachment_id=*
// @include         http://www.allxxxbabes.com/picture/*
// @include         http://www.theomegaproject.org/*.html
// @include         http://www.novojoy.com/*.html
// @include         http://www.novohot.com/*.html
// @include         http://www.novoporn.com/*.html
// @include         http://www.livejasminbabes.net/*.html
// @include         http://www.pbabes.com/galleries/*/*.html
// @include         http://www.nakedanatomy.com/*.html
// @include         http://dailyniner.com/?page=gallery*
// @include         http://www.babesandgirls.com/*.html
// @include         http://www.bustybloom.com/galleries/*.html
// @include         http://photos.freeones.com/*/html/photo*.shtml
// @include         http://www.galleries.badgirlsblog.com/albums/*/*/*.html
// @include         http://www.sexykittenporn.com/*/*.html
// @include         http://4fuckr.com/image_*.htm
// @include         http://www.pussystate.com/*/*.html
// @include         http://www.perkybabes.com/*.html
// @include         http://www.2damnhot.com/*/?pid=*
// @include         http://www.2damnhot.com/galleries/*.php
// @include         http://www.babesandbitches.net/*/*.html
// @include         http://www.sensualgirls.org/galleries/*/*/
// @include         http://www.sexyandfunny.com/image_gallery/*_*_*.html
// @include         http://fapking.in/*/share-*.html
// @include         http://www.imgnip.com/viewerr.php?file=*
// @include         http://www.tinypix.me/viewerr.php?file=*
// @include         http://imgload.me/img-*.html
// @include         http://imagepdb.com/?v=*
// @include         http://imagepdb.com/?p=*
// @include         http://imgtou.com/?v=*
// @include         http://imgtou.com/?p=*
// @include         http://imgfantasy.com/?v=*
// @include         http://xxxhost.me/viewer.php?file=*
// @include         http://www.picrak.com/viewer.php?file=*
// @include         http://www.bravoerotica.com/*/*/*/*.html
// @include         http://www.teenport.com/galleries/*/*/*.html
// @include         http://www.bravonude.com/*/*/*/*.html
// @include         http://babesmachine.com/*/*.html
// @include         http://www.babesaround.com/*/*.html
// @include         http://www.nakedneighbour.com/*/*.html
// @include         http://www.labatidora.net/gallery/*/pic*/
// @include         http://www.babesanatomy.com/*/*/*/*.html
// @include         http://imagecurl.org/viewer.php?file=*
// @include         http://imgboxxx.com/viewer.php?file=*
// @include         http://imgserve.net/img-*
// @include         http://www.imgbabes.com/*/*.*.html
// @include         http://imgdino.com/viewer.php?file=*
// @include         http://www.244pix.com/viewerr.php?file=*
// @include         http://www.mycelebrity.eu/*/*/
// @include         http://avenuexxx.com/archives/*
// @include         http://imgsee.me/*
// @include         http://www.pixhost.org/show/*
// @include         http://imgurx.net/x/share-*
// @include         http://imgaah.com/viewer.php?file=*
// @include         http://www.imagesnake.org/show/*
// @include         http://img-central.com/image/*
// @include         http://*/img-*.html
// @include         http://*/share-*.html
// @namespace https://greasyfork.org/users/13667
// @downloadURL https://update.greasyfork.org/scripts/27795/Show%20Just%20Image%20Misc.user.js
// @updateURL https://update.greasyfork.org/scripts/27795/Show%20Just%20Image%20Misc.meta.js
// ==/UserScript==

var img, imgURL;
// var domain = location.hostname.match('[^\.]+\.(be|com|de|gr|in|name|net|no|org|pl|ro|ru|su|to|us|me|es|eu)$');
var domain = window.location.host.match(/(?:www\.)?(.*)/i);

function doIt() {
  if (img || imgURL) {
    if (img && !imgURL) imgURL = (img.src ? img.src : img.href);
    if (imgURL) {
      location.replace(imgURL);
    }
  }
}

if (domain) {
  switch (domain[1]) {
    case 'pixxtra.com':
      imgURL = location.href.replace(/\/image\//, '/pic/');
      doIt();
      break;
    case 'fifialfa.com':
      img = document.evaluate('//div[@class="clearfix"]/div/img', document, null, 9, null).singleNodeValue;
      setTimeout(doIt, 500);
      break;
    case 'morazzia.com':
      // img = document.evaluate('//body/p/a/img', document, null, 9, null).singleNodeValue;
      img = document.evaluate('//img[@style="max-width: 580px"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'starpix.us':
    case 'imagesnake.org':
      img = document.evaluate('//span[@id="imagecode"]/img', document, null, 9, null).singleNodeValue;
      setTimeout(doIt, 500);
      break;
    case 'exgirlfriendmarket.com':
      img = document.evaluate('//div[@class="gallery_thumb"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'sharezones.com':
      img = document.evaluate('//img[@id="photo"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'asredas.com':
      imgURL = location.href.replace(/\/image\.php\?img=/, '/media/gals/');
      doIt();
      break;
    case 'ximg.me':
    case '4ufrom.me':
    case 'xxxhost.me':
      imgURL = location.href.replace(/\/viewer\.php\?file=/, '/files/');
      doIt();
      break;
    case 'picrak.com':
      imgURL = location.href.replace(/\/viewer\.php\?file=/, '/images/');
      doIt();
      break;
    case 'imgchili.net':
    case 'imgchili.com':
      img = document.evaluate('//img[@id="show_image"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'lettherebeporn.com':
    case 'glam0ur.com':
    case 'theomegaproject.org':
      img = document.evaluate('//img[@id="fullImage"]', document, null, 9, null).singleNodeValue;
      setTimeout(doIt, 500);
      break;
    case 'imgnix.com':
    case 'piratepix.org':
      img = document.evaluate('//img[@id="img_obj"]', document, null, 9, null).singleNodeValue;
      setTimeout(doIt, 500);
      break;
    case 'pixme.es':
    case 'fapking.in':
    case 'euro-pic.eu':
	case 'pixsor.com':
	case 'imgurx.net':
      img = document.evaluate('//img[@id="iimg"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imgurn.net':
    case 'wlock.org':
      img = document.evaluate('//img[@id="full_image"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'seedimage.com':
      img = document.evaluate('//img[@id="dispImg"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'mytimba.com':
      img = document.evaluate('//img[@id="Image1"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'dailyjunky.com':
    case 'tajcelebz.com':
      imgURL = document.evaluate('//p[@class="attachment"]/a', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'allxxxbabes.com':
      img = document.evaluate('//div[@class="content_box"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'novohot.com':
      img = document.evaluate('//div[@id="viewIMG"]//div/img', document, null, 9, null).singleNodeValue;
      setTimeout(doIt, 500);
      break;
    case 'novojoy.com':
    case 'pbabes.com':
      img = document.evaluate('//div[contains(@class,"big_picture")]/a/img', document, null, 9, null).singleNodeValue;
      setTimeout(doIt, 500);
      break;
    case 'livejasminbabes.net':
      img = document.evaluate('//div[@class="large"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'nakedanatomy.com':
      // img = document.evaluate('//img[@alt="'+document.title.match(/([\w\s]+) -/)[1]+'"]', document, null, 9, null).singleNodeValue;
      img = document.evaluate('//div[@class="gall"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'dailyniner.com':
      if(location.href.match(/size=medium/))
          imgURL = location.href.replace(/=medium/, '=large');
      if(!imgURL)
          img = document.evaluate('//td/a[@target="_BLANK"]/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'babesandgirls.com':
      img = document.evaluate('//div[starts-with(@id, "gallery-container")]//a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'bustybloom.com':
      imgURL = document.evaluate('//a[@title="Enlarge"]', document, null, 9, null).singleNodeValue;
      doIt();
    case 'freeones.com':
      img = document.evaluate('//img[@id="largePictureContainer"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'badgirlsblog.com':
      imgURL = location.href.replace(/\.html/, '.jpg');
      doIt();
      break;
    case 'sexykittenporn.com':
      img = document.evaluate('//img[@class="bigpic"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imgsee.me':
    case 'imgbabes.com':
      img = document.evaluate('//img[@class="pic"]', document, null, 9, null).singleNodeValue;
      doIt();
      if(typeof(document.F1)=="object") document.F1.submit();
      break;
    case '4fuckr.com':
      img = document.evaluate('//img[@id="mypic"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'pussystate.com':
      img = document.evaluate('//div[@class="galleryw"]//a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'perkybabes.com':
    case '2damnhot.com':
      img = document.evaluate('//div[@class="pic"]/a/img', document, null, 9, null).singleNodeValue;
      if(!img)
          img = document.evaluate('//img[@id="fullImage"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'babesandbitches.net':
    case 'novoporn.com':
      img = document.evaluate('//div[@class="gallery"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'sensualgirls.org':
      img = document.evaluate('//div[@class="cbox2_cont"]//a/img', document, null, 9, null).singleNodeValue;
      window.addEventListener('load', function() {
        doIt();
      }, false);
      break;
    case 'sexyandfunny.com':
      img = document.evaluate('//div[@class="CenterFull"]/div/a/img', document, null, 9, null).singleNodeValue;
      if(!img)
          var tmpurl = document.evaluate('//a[contains(@href,"_full.html")]', document, null, 9, null).singleNodeValue;
      if(tmpurl)
          imgURL = tmpurl;
      doIt();
      break;
    case 'tinypix.me':
    case '244pix.com':
    case 'imgnip.com':
      img = document.evaluate('//img[@id="main_image"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imageontime.org':
    case 'dragimage.org':
    case 'damimage.com':
    case 'imgload.me':
    case 'imgspot.org':
    case 'imghit.com':
    case 'megaimage.org':
      img = document.evaluate('//img[@class="centred_resized"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imgfantasy.com':
    case 'imagepdb.com': 
    case 'imgtou.com': 
      try { confirmAge(1); } catch(e) {}
      img = document.evaluate('//img[@title="Click to enlarge"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'bravonude.com':
    case 'teenport.com':
    case 'bravoerotica.com':
      img = document.evaluate('//div[@class="modelbox-thumbs"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'babesmachine.com':
      img = document.evaluate('//td[@align="center"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'babesaround.com':
      img = document.evaluate('//div[@class="post_cont"]/div/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'nakedneighbour.com':
      img = document.evaluate('//img[@class="imagep"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'labatidora.net':
      img = document.evaluate('//div[@id="content3"]/p/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'babesanatomy.com':
      img = document.evaluate('//div/a[@target="_blank"]/img[contains(@style,"width")]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imagecurl.org':
      try { showimg_now(); } catch(e) {}
      img = document.evaluate('//div[@id="image_view"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imgboxxx.com':
      imgURL = location.href.replace(/viewer\.php\?file=/, 'images/');
      doIt();
      break;
    case 'pixhost.org':
    case 'imgserve.net':
      img = document.evaluate('//p/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imgdino.com':
      img = document.evaluate('//img[@id="cursor_lupa"]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'mycelebrity.eu':
      img = document.evaluate('//img[@class="attachment-large"]', document, null, 9, null).singleNodeValue.parentNode;
      doIt();
      break;
    case 'avenuexxx.com':
      img = document.evaluate('//div[contains(@class,"entry")]//img[contains(@class,"size-full")]', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'imgaah.com':
      img = document.evaluate('//div[@class="text_align_center"]/a/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    case 'img-central.com':
      img = document.evaluate('//div[@id="image-viewer-container"]/img', document, null, 9, null).singleNodeValue;
      doIt();
      break;
    default:
      try{document.evaluate('//input[@name="imgContinue"]', document, null, 9, null).singleNodeValue.click()}catch(err){
        img = document.evaluate('//img[contains(@class,"centred")]', document, null, 9, null).singleNodeValue;
        doIt();
      };
      break;
  }
}
