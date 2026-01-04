// ==UserScript==
// @name         mpv load more
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello world
// @author       ayasetan
// @match        https://exhentai.org/mpv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454623/mpv%20load%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/454623/mpv%20load%20more.meta.js
// ==/UserScript==

(() => {
  const w = unsafeWindow || window;
  const main = () => {
    console.log('hook mpv function')

    // 加载多页
    w.pane_thumbs.onscroll = preload_scroll_thumbs;
    w.pane_images.onscroll = preload_scroll_images;
    // 取消请求休眠
    w.load_image = load_image
  };
  function load_image(a) {
    if (void 0 != imagelist[a - 1].i) {
      var b = '<a href="#page' + (a + 1) + '"><img id="imgsrc_' + a + '" src="' + imagelist[a - 1].i + '" title="' + imagelist[a - 1].n + '" style="margin:0; width:' + imagelist[a - 1].xres + "px; height:" + imagelist[a - 1].yres + 'px"' + (void 0 == imagelist[a - 1].reloaded ? ' onerror="this.onerror=null; action_reload(' + a + ')"' : "") + ' /></a> <div class="mi1"> \t<div class="mi2"> \t\t' + ("org" == imagelist[a - 1].o ? '<img style="cursor:default; opacity:0.5" title="Original Image" src="' + img_url + 'mpvd.png" />' : '<img title="' + imagelist[a - 1].o + '" onclick="action_fullimg(' + a + ')" src="' + img_url + 'mpvd.png" />') + ' \t\t<img title="Reload broken image" onclick="action_reload(' + a + ')" src="' + img_url + 'mpvr.png" /> \t</div> \t<div class="mi3"> \t\t<a href="' + base_url + imagelist[a - 1].lo + '" target="_ehshow_' + gid + "_" + a + '"><img title="Open image in normal viewer" onclick="action_open(' + a + ')" src="' + img_url + 'mpvn.png" /></a> \t\t<img title="Show galleries with this image" onclick="action_search(' + a + ')" src="' + img_url + 'mpvs.png" /> \t\t<img title="Get forum link to image" onclick="action_link(' + a + ')" src="' + img_url + 'mpvl.png" /> \t</div> \t<div class="mi4">' + imagelist[a - 1].d + " :: " + imagelist[a - 1].n + '</div> \t<div style="clear:both"></div> </div>';
      document.getElementById("image_" + a).innerHTML = b;
      rescale_image(a, document.getElementById("imgsrc_" + a))
    } else {
      void 0 == imagelist[a - 1].xhr && (imagelist[a - 1].xhr = new XMLHttpRequest,
                                         preload_image(a))
    }
  }
  function preload_scroll_thumbs() {
    preload_generic(pane_thumbs, "thumb", 5000)
  }
  function preload_scroll_images() {
    preload_generic(pane_images, "image", 1e5);
    sync_thumbpane()
  }
  main()

})();