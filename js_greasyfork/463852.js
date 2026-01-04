// ==UserScript==
// @name     r34app gallery
// @description Gallery view for results in https://r34.app
// @locale en
// @namespace r34app-gallery
// @version  1.4.1
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js
// @include https://r34.app/*
// @downloadURL https://update.greasyfork.org/scripts/463852/r34app%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/463852/r34app%20gallery.meta.js
// ==/UserScript==

const styles = `
.mfp-bg{top:0;left:0;width:100%;height:100%;z-index:1042;overflow:hidden;position:fixed;background:#0b0b0b;opacity:0.95}.mfp-wrap{top:0;left:0;width:100%;height:100%;z-index:1043;position:fixed;outline:none !important;-webkit-backface-visibility:hidden}.mfp-container{text-align:center;position:absolute;width:100%;height:100%;left:0;top:0;padding:0 8px;box-sizing:border-box}.mfp-container:before{content:'';display:inline-block;height:100%;vertical-align:middle}.mfp-align-top .mfp-container:before{display:none}.mfp-content{position:relative;display:inline-block;vertical-align:middle;margin:0 auto;text-align:left;z-index:1045}.mfp-inline-holder .mfp-content,.mfp-ajax-holder .mfp-content{width:100%;cursor:auto}.mfp-ajax-cur{cursor:progress}.mfp-zoom-out-cur,.mfp-zoom-out-cur .mfp-image-holder .mfp-close{cursor:-moz-zoom-out;cursor:-webkit-zoom-out;cursor:zoom-out}.mfp-zoom{cursor:pointer;cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.mfp-auto-cursor .mfp-content{cursor:auto}.mfp-close,.mfp-arrow,.mfp-preloader,.mfp-counter{-webkit-user-select:none;-moz-user-select:none;user-select:none}.mfp-loading.mfp-figure{display:none}.mfp-hide{display:none !important}.mfp-preloader{color:#CCC;position:absolute;top:50%;width:auto;text-align:center;margin-top:-0.8em;left:8px;right:8px;z-index:1044}.mfp-preloader a{color:#CCC}.mfp-preloader a:hover{color:#FFF}.mfp-s-ready .mfp-preloader{display:none}.mfp-s-error .mfp-content{display:none}button.mfp-close,button.mfp-arrow{overflow:visible;cursor:pointer;background:transparent;border:0;-webkit-appearance:none;display:block;outline:0;padding:0;z-index:1046;box-shadow:none;touch-action:manipulation}button::-moz-focus-inner{padding:0;border:0}.mfp-close{width:44px;height:44px;line-height:44px;position:absolute;right:0;top:0;text-decoration:none;text-align:center;opacity:.65;padding:0 0 18px 10px;color:#FFF;font-style:normal;font-size:28px;font-family:Arial,Baskerville,monospace}.mfp-close:hover,.mfp-close:focus{opacity:1}.mfp-close:active{top:1px}.mfp-close-btn-in .mfp-close{color:#333}.mfp-image-holder .mfp-close,.mfp-iframe-holder .mfp-close{color:#FFF;right:-6px;text-align:right;padding-right:6px;width:100%}.mfp-counter{position:absolute;top:0;right:0;color:#CCC;font-size:12px;line-height:18px;white-space:nowrap}.mfp-arrow{position:absolute;opacity:.65;margin:0;top:50%;margin-top:-55px;padding:0;width:90px;height:110px;-webkit-tap-highlight-color:transparent}.mfp-arrow:active{margin-top:-54px}.mfp-arrow:hover,.mfp-arrow:focus{opacity:1}.mfp-arrow:before,.mfp-arrow:after{content:'';display:block;width:0;height:0;position:absolute;left:0;top:0;margin-top:35px;margin-left:35px;border:medium inset transparent}.mfp-arrow:after{border-top-width:13px;border-bottom-width:13px;top:8px}.mfp-arrow:before{border-top-width:21px;border-bottom-width:21px;opacity:.7}.mfp-arrow-left{left:0}.mfp-arrow-left:after{border-right:17px solid #FFF;margin-left:31px}.mfp-arrow-left:before{margin-left:25px;border-right:27px solid #3f3f3f}.mfp-arrow-right{right:0}.mfp-arrow-right:after{border-left:17px solid #FFF;margin-left:39px}.mfp-arrow-right:before{border-left:27px solid #3f3f3f}.mfp-iframe-holder{padding-top:40px;padding-bottom:40px}.mfp-iframe-holder .mfp-content{line-height:0;width:100%;max-width:900px}.mfp-iframe-holder .mfp-close{top:-40px}.mfp-iframe-scaler{width:100%;height:0;overflow:hidden;padding-top:56.25%}.mfp-iframe-scaler iframe{position:absolute;display:block;top:0;left:0;width:100%;height:100%;box-shadow:0 0 8px rgba(0,0,0,0.6);background:#000}img.mfp-img{width:auto;max-width:100%;height:auto;display:block;line-height:0;box-sizing:border-box;padding:40px 0 40px;margin:0 auto}.mfp-figure{line-height:0}.mfp-figure:after{content:'';position:absolute;left:0;top:40px;bottom:40px;display:block;right:0;width:auto;height:auto;z-index:-1;box-shadow:0 0 8px rgba(0,0,0,0.6);background:#444}.mfp-figure small{color:#bdbdbd;display:block;font-size:12px;line-height:14px}.mfp-figure figure{margin:0}.mfp-bottom-bar{margin-top:-36px;position:absolute;top:100%;left:0;width:100%;cursor:auto}.mfp-title{text-align:left;line-height:18px;color:#f3f3f3;word-wrap:break-word;padding-right:36px}.mfp-image-holder .mfp-content{max-width:100%}.mfp-gallery .mfp-image-holder .mfp-figure{cursor:pointer}@media screen and (max-width:800px) and (orientation:landscape),screen and (max-height:300px){.mfp-img-mobile .mfp-image-holder{padding-left:0;padding-right:0}.mfp-img-mobile img.mfp-img{padding:0}.mfp-img-mobile .mfp-figure:after{top:0;bottom:0}.mfp-img-mobile .mfp-figure small{display:inline;margin-left:5px}.mfp-img-mobile .mfp-bottom-bar{background:rgba(0,0,0,0.6);bottom:0;margin:0;top:auto;padding:3px 5px;position:fixed;box-sizing:border-box}.mfp-img-mobile .mfp-bottom-bar:empty{padding:0}.mfp-img-mobile .mfp-counter{right:5px;top:3px}.mfp-img-mobile .mfp-close{top:0;right:0;width:35px;height:35px;line-height:35px;background:rgba(0,0,0,0.6);position:fixed;text-align:center;padding:0}}@media all and (max-width:900px){.mfp-arrow{-webkit-transform:scale(0.75);transform:scale(0.75)}.mfp-arrow-left{-webkit-transform-origin:0 0;transform-origin:0 0}.mfp-arrow-right{-webkit-transform-origin:100%;transform-origin:100%}.mfp-container{padding-left:6px;padding-right:6px}}
`;

const otherStyles = `
  .r34-app-gallery-loader-info {
    position: fixed;
    z-index: 5000;
    bottom: 10px;
    right: 10px;
    text-size: 8px;
    color: white;
  }
  .r34-app-gallery-loader {
    position: fixed;
    z-index: 5000;
    bottom: 45px;
    right: 10px;
    width: 40px;
    height: 40px;
    display: none;
  }

  .r34-app-gallery-loader::after {
    content: " ";
    display: block;
    width: 36px;
    height: 36px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  .r34-app-gallery-loader.loading {
    display: block;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

var styleSheet2 = document.createElement("style");
styleSheet2.innerText = otherStyles;
document.head.appendChild(styleSheet2);

var initPlaySettingKey = "initPlay";
var playSpeedKey = "initPlaySpeed";
var initOpenKey = "initGalleryOpen";

var open = getSetting(initOpenKey || "false");
var isPlaying = getSetting(initPlaySettingKey);
var playSpeed = Number(getSetting(playSpeedKey) || 5000);
var playTimer = null;

var loading = document.createElement("div");
loading.classList.add("r34-app-gallery-loader");

document.body.appendChild(loading);

var info = document.createElement("div");
info.classList.add("r34-app-gallery-loader-info");
document.body.appendChild(info);

function startLoading() {
  loading.classList.add("loading");
}

function stopLoading() {
  loading.classList.remove("loading");
}

function updateInfo() {
  info.innerHTML = "Gallery " + (isPlaying === "true" ? "Playing" : "Pause") + " / Speed: " + playSpeed / 1000 + "s";
}

function setPlaySpeed(speed) {
  stop();
  var speedToSet = speed;
  if (speed < 1000) speedToSet = 1000;
  if (speed > 15000) speedToSet = 15000;
  setSetting(playSpeedKey, speedToSet.toString());
  playSpeed = speedToSet;
  play();
}

function playNext() {
  if ($.magnificPopup.instance.items.length - 1 === $.magnificPopup.instance.index) {
    movePage(1);
  } else {
    $.magnificPopup.instance.next();
  }
}

function play() {
  stop();

  isPlaying = "true";
  setSetting(initPlaySettingKey, "true");

  if (open != "true") {
    toggle();
  }

  playTimer = setInterval(function () {
    playNext();
  }, playSpeed);
}

function stop() {
  if (isPlaying === "false") return;

  isPlaying = "false";
  clearTimeout(playTimer);
  setSetting(initPlaySettingKey, "false");
}

function getImages() {
  return $("li img.w-full, li video");
}

function openGallery() {
  var images = getImages();
  var items = [];

  images.each(function () {
    var image = $(this);

    if (image.is("img")) {
      if (image.attr("alt") !== "Advertisement") {
        const src = image.attr('src');
        items.push({
          src: src,
          type: "image",
          title: image.attr("alt") || "",
        });
      }
    } else {
      items.push({
        src: image.attr('src'),
        type: "iframe",
      });
    }
  });
  

  $.magnificPopup.open(
    {
      items: items,
      gallery: {
        enabled: true,
      },
      image: {
        titleSrc: "title",
      },
    },
    0
  );

  open = "true";
  setSetting(initOpenKey, "true");
}

function closeGallery() {
  $.magnificPopup.close();
  open = "false";
  setSetting(initOpenKey, "false");
}

function toggle() {
  if (open === "true") {
    closeGallery();
    return;
  }

  openGallery();
}

var downloading = false;

function download(url, filename) {
  if (downloading) return;

  downloading = true;
  startLoading();

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error)
    .finally(() => {
      downloading = false;
      stopLoading();
    });
}

function getImgUrl() {
  return $.magnificPopup.instance.currItem.src;
}

function getPage() {
  var searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.has("page") ? searchParams.get("page") : 0;
  return !Number.isNaN(Number(pageParam)) ? Number(pageParam) : 0;
}

function addParam(currentUrl, key, val) {
  var url = new URL(currentUrl);
  url.searchParams.set(key, val);
  return url.href;
}

function movePage(offset) {
  let page = getPage() + offset;
  if (page < 0) page = 0;
  window.location.href = addParam(window.location.href, "page", page);
}

function setSetting(setting, value) {
  localStorage.setItem(setting, value);
}

function getSetting(setting) {
  return localStorage.getItem(setting);
}

function canHandleKeyPress() {
  if (window.location.pathname === '/') return false;
  return true;
}

function init() {
  if (isPlaying === "true") {
    closeGallery();
    play();
  } else if (open === "true") {
    openGallery();
  }

  updateInfo();

  $(window).keypress(function (e) {   
    if (!canHandleKeyPress()) return;

    if (e.which == 53 || e.which == 115) {
      stop();
      // numeric 5
      toggle();
    } else if (e.which == 49 || e.which == 122) {
      // numeric 1
      movePage(-1);
    } else if (e.which == 51 || e.which == 99) {
      // numeric 2
      movePage(1);
    } else if (e.which == 56 || e.which == 119) {
      // numeric 8
      if (isPlaying === "true") {
        stop();
      } else {
        play();
      }
    } else if (e.which == 55 || e.which == 113) {
      // numeric 7
      setPlaySpeed(playSpeed + 1000);
    } else if (e.which == 57 || e.which == 101) {
      // numeric 9
      setPlaySpeed(playSpeed - 1000);
    }
    updateInfo();

    if (!open) return;

    if (e.which == 52 || e.which === 97) {
      // numeric 4
      $.magnificPopup.instance.prev();
    } else if (e.which == 54 || e.which == 100) {
      // numeric 6
      $.magnificPopup.instance.next();
    } else if (e.which == 50 || e.which == 120) {
      // numeric 2
      const url = getImgUrl();
      download(url, url.substring(url.lastIndexOf("/") + 1));
    }
  });
}

function checkIfImageExists() {
  var images = getImages();
  if (images.length === 0) {
    setTimeout(checkIfImageExists, 1000);
  } else {
    init();
  }
}

setTimeout(checkIfImageExists, 1000);
