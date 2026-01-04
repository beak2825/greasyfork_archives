// ==UserScript==
// @name        RemoveAVSiteAD
// @namespace   chenzww
// @description remove AV site AD
// @include     http://3xplanet.com/view/*

// @include     http://imageteam.org/*
// @include     http://imagedecode.com/*
// @include     http://damimage.com/*

// @include     http://www.imgbabes.com/*

// @include     http://www.imgflare.com/*

// @include     /^https?://img\.yt/
// @include     http://imgblank.com/*

// @include     http://imgseeds.com/*

// @include     http://imgcandy.net/*

// @include     http://imgban.com/*

// @include     http://imgicy.com/*
// @include     http://picmoza.com/*
// @include     https://ecoimages.xyz/*
// @include     http://hdmoza.com/*

// @include     http://imgrock.net/*

// @include     http://imgtiger.org/*

// @include     http://www.imgdrive.net/*

// @include     http://*javtotal.com/*

// @include     http://imgclick.net/*

// @include     http://imgtrex.com/*

// @include     http://imgzap.com/*

// @include     http://55888.eu/*

// @include     http://www.imagepearl.com/*

// @include     http://imgdream.net/*

// @include     http://www.pixsense.net/*

// @include     http://imgchili.net/*

// @include     http://hentai-baka.com/*
// @include     http://img-hentai.host/*
// @include     https://underpic.club/*

// @include     https://imgbaron.com/*
// @include     https://picbaron.com/*


// @version     0.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/387832/RemoveAVSiteAD.user.js
// @updateURL https://update.greasyfork.org/scripts/387832/RemoveAVSiteAD.meta.js
// ==/UserScript==

function removeElementsBySelector(selector) {
  var elements = document.querySelectorAll(selector);
  for (var i = elements.length - 1; i >= 0; i -= 1) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

function setStyleBySelector(selector, style) {
  var elements = document.querySelectorAll(selector);
  for (var i = elements.length - 1; i >= 0; i -= 1) {
    elements[i].setAttribute("style", style);
  }
}

// 刪除保留屬性以外的所有屬性。
function reserveAttributesBySelector(selector) {
  var es = document.querySelectorAll(selector);

  // 保留屬性。
  var reserveAttrs = [];
  for (var i = 1; i < arguments.length; i += 1) {
    reserveAttrs.push(arguments[i]);
  }

  for (var i = 0; i < es.length; i += 1) {
    var e = es[i];
    var deprecatedAttrs = [];
    for (var j = 0; j < e.attributes.length; j++) {
      var attr = e.attributes[j];

      // 保留第一個參數。
      for (var k = 0; k < reserveAttrs.length; k++) {
        if (reserveAttrs.indexOf(attr.name) === -1) {
          deprecatedAttrs.push(attr.name);
        }
      }
    }

    // 刪除無用的節點屬性。
    for (var j = 0; j < deprecatedAttrs.length; j++) {
      if (e.hasAttribute(deprecatedAttrs[j])) {}
      e.removeAttribute(deprecatedAttrs[j]);
    }
  }
}



if (/3xplanet.com\/view\//.test(location.href)) {
  removeElementsBySelector(".layout, .picsContent, .full_bot");
}

if (/imageteam.org|imagedecode.com|damimage.com/.test(location.hostname)) {
  var container = document.querySelector("#container");
  if (container) { container.setAttribute("style", "width: auto;"); }

  removeElementsBySelector("#menu, #accordion, #footer, strong, .overlay_ad, .top_ads, iframe");
}

if (/imgbabes.com/.test(location.hostname)) {
  // MSG: I am +18 I would like to Enter
  var veriBtn = document.querySelector(".verif input[type='submit']");
  if (veriBtn) veriBtn.click();
  removeElementsBySelector("#header, #footer, .result_slot");

  var img = document.querySelector("#this_image");
  if (img) {
    img.removeAttribute("width");
    document.body.innerHTML = img.outerHTML
  }
}

if (/www.imgflare.com/.test(location.hostname)) {
  var human = document.querySelector(".skin-box input[type='button']");
  if (human) human.click();

  var img = document.querySelector("#this_image");
  if (img) {
    img.removeAttribute("width");
    document.body.innerHTML = img.outerHTML
  }
}

if (/img.yt|imgblank.com/.test(location.hostname)) {
  var continuebutton = document.querySelector("#continuebutton");
  if (continuebutton) {
    continuebutton.click();
  } else {
    removeElementsBySelector("#menu, #logo, #footer, .bottom_ads, .top_ads");
  }

  var continuetoimage = document.querySelector("#continuetoimage input[type='submit']");
  if (continuetoimage) { continuetoimage.click(); }
}

if (/imgseeds.com|imgcandy.net|imgban.com|imgicy.com|picmoza.com|ecoimages.xyz|hdmoza.com/.test(location.hostname)) {
  var continuetoimage = document.querySelector("#continuetoimage input[type='submit']");
  if (continuetoimage) { continuetoimage.click(); }

  var img = document.querySelector("img.centred, img.centred_resized");
  if (img) { location.href = img.src; }
}


if (/imgrock.net/.test(location.hostname)) {
  var imageviewirs = document.querySelectorAll("#imageviewir input[type='submit']");
  for (var i = 0; i < imageviewirs.length; i += 1) {
    if (imageviewirs[i].style.display !== "none") { imageviewirs[i].click(); }
  }

  var closeButton = document.querySelector("button.close");
  if (closeButton) { closeButton.click(); }

  var image = document.querySelector("img.pic");
  image.removeAttribute("width");
  image.removeAttribute("height");
  document.body.innerHTML = image.outerHTML;
}

if (/imgtiger.org/.test(location.hostname)) {
  var continueButton = document.querySelector("#continueButton");
  if (continueButton) { continueButton.click(); }

  var image = document.querySelector(".spoiler img");
  if (image) { document.body.innerHTML = image.outerHTML; }
}

if (/imgdrive.net/.test(location.hostname)) {
  window.onload = function() {
    setTimeout(function() {
      var overlay_ad_link = document.querySelector(".overlay_ad_link");
      if (overlay_ad_link) {
        overlay_ad_link.click();
      } else {
        var image = document.querySelector("img.centred");
        if (image) {
          document.body.innerHTML = image.outerHTML;
        }
      }
    }, 1000);
  };
}

if (/javtotal.com/.test(location.hostname)) {
  var img = document.querySelector("img.centred");
  if (img) { document.body.innerHTML = img.outerHTML; }
}

if (/imgclick.net/.test(location.hostname)) {
  var ddshow = document.querySelector("#ddshow input[type='submit']");
  if (!!ddshow) {
    ddshow.click();
  } else {
    removeElementsBySelector(".ddemo-wrapper, .navbar-inner, .footer, .copy");
  }
}

if (/imgtrex.com/.test(location.hostname)) {
  var interRaptor = document.querySelector("#interRaptor");
  if (interRaptor && window.getComputedStyle(interRaptor).display !== "none" ) {
    interRaptor.querySelector("a[onclick]").click();
  }
  var img = document.querySelector("img.pic");
  if (img) { document.body.innerHTML = img.outerHTML; }

  removeElementsBySelector("script");
  setTimeout(setStyleBySelector("html", "overflow: auto !important;"), 3000);
}

if (/imgzap.com/.test(location.hostname)) {
  var popupBox = document.querySelector("#popupBox");
  if (popupBox && window.getComputedStyle(popupBox).display !== "none") {
    popupBox.querySelector("a[onclick]").click();
  }
  var cursor_lupa = document.querySelector("#cursor_lupa");
  if (cursor_lupa) { document.body.innerHTML = cursor_lupa.outerHTML; }
}

if (/55888.eu/.test(location.hostname)) {
  var popupOverlay = document.querySelector("#popupOverlay");
  if (popupOverlay && window.getComputedStyle(popupOverlay).display !== "none") {
    popupOverlay.querySelector("a").click();
  }
  var image = document.querySelector(".centred_resized");
  if (image) { document.body.innerHTML = image.outerHTML; }
}

if (/imagepearl.com/.test(location.hostname)) {
  // 第一個確認頁面。
  if (document.querySelector("#verify2 p")) {
    var s_list = document.querySelector("#verify2 p").textContent.split(" ");
    if (s_list.length === 5) {
      var s = s_list[2];

      var nodes = document.querySelectorAll("#verify2 a");
      for (var i = 0; i < nodes.length; i += 1) {
        if (nodes[i].textContent === s) {
          nodes[i].click();
        }
      }
    }
  }
  // 第二個確認頁面。
  var adult = document.querySelector("#view-image");
  if (adult) { adult.click(); }
}


if (/imgdream.net/.test(location.hostname)) {
  reserveAttributesBySelector("img", "alt", "src", "title");

  var popupConfirm = document.querySelector(".buttonblue");
  if (popupConfirm) popupConfirm.click();

  setTimeout(function () {
    var imgs = document.querySelectorAll("a img");
    var pivot = 0;
    for (var i = 0; i < imgs.length; i += 1) {
      if (imgs[pivot].naturalWidth*imgs[pivot].naturalHeight < imgs[i].naturalWidth * imgs[i].naturalHeight) {
        pivot = i;
      }
    }
    imgs[pivot].setAttribute("style", "max-width: 100%;");
    document.body.removeAttribute("class");
    document.body.setAttribute("style", "text-align: center");
    document.body.innerHTML = imgs[pivot].outerHTML;
  }, 1000);
}

if (/www.pixsense.net/.test(location.hostname)) {
  if (myUniqueImg) { document.body.innerHTML = myUniqueImg.outerHTML; }
}

if (/imgchili.net/.test(location.host)) {
  if (show_image) {
    document.body.innerHTML = show_image.outerHTML;
  }
}

if (/hentai-baka.com|img-hentai.host|jav-hentai.host|underpic.club/.test(location.host)) {
  reserveAttributesBySelector("#introOverlayBg", "id", "class");

  var img = document.querySelector(".centred_resized");
  if (img) { location.href = img.src; }

  var buttonblue = document.querySelector(".buttonblue");
  if (buttonblue) {
    buttonblue.click();
  }

  var continuetoimage = document.querySelector("#continuetoimage input[type='submit']");
  if (continuetoimage ) { continuetoimage.click(); }
}

if (/imgbaron.com|picbaron.com/.test(location.host)) {
  var submitBtn = document.querySelector("input[type='submit']");
  if (submitBtn) { submitBtn.click(); }

  var img = document.querySelector("img.pic");
  if (img) { location.href = img.src; }
}
