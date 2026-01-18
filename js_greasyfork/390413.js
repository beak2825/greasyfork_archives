// ==UserScript==
// @name         Auto Klik
// @namespace    http://j.mp/au_ah_gelap
// @version      1.26.01101943
// @description  Auto Klik oploverz, samehadaku, dkk
// @author       eZee
// @icon         https://i.imgur.com/j4poe63.png

// @match        *://welcome.indihome.co.id/landing-page

// @match        *://*.kusonime.com/*
// @include      /^https?://(.*\.)?oploverz\..*/.*$/
// @include      /^https?://(.*\.)?samehadaku\..*/.*$/
// @include      /^https?://(.*\.)?sokuja\..*/.*$/
// @include      /^https?://(.*\.)?kuramanime\..*/.*$/
// @include      /^https?://(.*\.)?otakudesu\..*/.*$/
// @include      /^https?://(.*\.)?anichin\..*/.*$/

// @match        *://*.kuyhaa.me/*
// @match        *://*.meong.club/*

// @match        *://*.mirrored.to/*

// @match        *://*.mediafire.com/file/*
// @match        *://*.clicknupload.org/*
// @match        *://*.uptobox.com/*
// @match        *://*.mp4upload.com/*
// @match        *://pixeldrain.com/u/*

// @license      GNU General Public License v3.0 or later
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setStyle
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.7.1.js
// @supportURL   https://greasyfork.org/en/scripts/390413-auto-klik/feedback
// @downloadURL https://update.greasyfork.org/scripts/390413/Auto%20Klik.user.js
// @updateURL https://update.greasyfork.org/scripts/390413/Auto%20Klik.meta.js
// ==/UserScript==

var link = null, anu = 0, tipe = 'default', jdl, aidi;
var str, atext, dlv, a, b, c;
$(document).ready(function () {
  var url = document.documentURI,
  new_ep, player, bann_bottom, scrl_to, prm;

  var rel, next, prev; /* var for prev next */

  if (url.match(/welcome.indihome.co.id/g)) {
    link = getHref("div.footer-banner");
  } else if (url.match(/oploverz/g)) {
    var wfull = getBy('Class', 'w-full');

    player = document.querySelector("div.absolute.z-10.size-full.items-center.justify-center.rounded-lg.bg-black.bg-opacity-70.text-white > div");
    scroll_to(player);
  } else if (url.match(/samehadaku/g)) {
    var wepl, ya, ck_gbr;
    $('article').find('a').each(function(){
      ya = false;
      rel = $(this).attr('rel');
      wepl = $(this).attr('data-wpel-link');
      if (typeof rel !== 'undefined' && rel.match(/external|”nofollow”/)) { ya = true; }
      else if (typeof wepl !== 'undefined' && wepl.match(/external/)) { ya = true; }
      else { ya = false; }

      if (ya == true) {
        ck_gbr = $(this).find('img');
        if (ck_gbr.length) { $(this).hide(); }
      }
    });
    hide_ads('iklan', 'div');

    new_ep = getBy('Id', 'tontonbaru');
    player = getBy('Id', 'embed_holder');
    if (player) {
      $("div.server_option").find("p").each(function () {
        $(this).hide();
      });
      scrl_to = [player, { vertical: 'center' }];

      rel = $('div.nvs').find('a');
      prev_menu_next_click(rel[0], rel[1], rel[2]); /* Previous and Next*/
    } else if (new_ep) {
      scrl_to = [new_ep, {vertical: 'start'}];
    }

    if (scrl_to) {
      scroll_to(scrl_to[0], scrl_to[1]);
    }
  } else if (url.match(/sokuja/g)) {
    var prnt = getBy('Class', 'megavid');
    var mirror = getBy('Class', 'mirror');
    bann_bottom = getBy('Class', 'blox');

    new_ep = getBy('class', 'thumbook');
    player = getBy('Id', 'embed_holder');
    if (player) {
      scrl_to = [player, { vertical: 'center' }];

      rel = $('div.nvs').find('a');
      prev_menu_next_click(rel[0], rel[1], rel[2]); /* Previous and Next*/
    } else if (new_ep.length > 0) {
      scrl_to = [new_ep[0], { vertical: 'start' }];
    }

    if ($("style#self-style").length == 0) {
      $("head").append('<style id="self-style">.soraddlx{overflow:hidden;margin-bottom:15px}.soraddlx .sorattlx{overflow:hidden;padding:8px 10px;margin-bottom:5px;background:#0c70de;color:#fff}.soraddlx .soraurlx{padding:0 8px 0 0;background:#f1f1f1;margin-bottom:5px;font-size:14px;line-height:32px}.soraddlx br,.soraddlx p{display:none}.soraddlx .sorattlx h3{margin:0;font-size:14px;font-weight:500}.soraddlx .soraurlx strong{background:#0c70de;color:#fff;padding:0 5px;margin-right:5px;font-size:13px;width:50px;text-align:center;display:inline-block;font-weight:500}.soraddlx a:last-child:after{display:none}.soraddlx a:after{content:"|";margin:0 5px;color:#ddd}.darkmode .soraddlx .soraurlx{background:#333}.darkmode .soraddlx a:after{color:#555}</style>');
    }

    try {
      if (bann_bottom.length > 0) {
        bann_bottom[0].remove();
        document.querySelector('body > div:last-of-type').remove();
        hide_ads('iDd0s-4dgu4rd');
      }
    } catch (e) { console.log(e.toString()); }

    if (mirror.length) {
      mirror = mirror[0];
      var pembed = getBy('Id', 'pembed'),
      navs = document.querySelector(".naveps.bignav"),
      ntxt = [],
      proc,
      mir;

      for (var i in mirror.options) {
        mir = mirror.options[i];
        if (mir.value && mir.value.match !== "") {
          proc = atob(mir.value).replace(/^.*src="(.*)(\\)?"\s.*$/, "$1").replace(/storage(s)?\./, 'dl.');
          if (proc.match(/^http|(mp4|mkv)$/g)) {
            ntxt.push('<div class="soraurlx"><strong>' + mir.text.replace(/^\w+\s?/i, '') + '</strong>' + '<a href="#' + mir.text.replace(/\w+\s?/i, '') + '" onmouseover="this.href=\'' + proc + '\';this.target=\'_blank\';">Direct Save as</a></div>');
          }
        }
      }

      if (ntxt.length) {
        navs.outerHTML += '<div class="soraddlx soradlg"><div class="sorattlx" style="text-align:center"><h3>Direct Link DL</h3></div>' + ntxt.join("<br>") + '</div>';
      }
    }

    if (prnt.length > 0) {
      try {
        var child = prnt[0].childNodes[1];
        var child2 = child.childNodes[8];

        var cek_img = child2.getElementsByTagName('img');
        if (cek_img.length) {
          child2.childNodes[1].remove();
        }
      } catch (e) {}
    }

    if (scrl_to) {
      scroll_to(scrl_to[0], scrl_to[1]);
    }
  } else if (url.match(/kuramanime/i)) {
    bann_bottom = document.querySelectorAll('.mx-auto');
    bann_bottom.forEach(function (elm) {
      elm.style.display = 'none';
    });

    /* remove target='blank' on ep List */
    if ($("script#self-script").length == 0) {
      $("head").append(`<script id="self-script" type="text/javascript">$("a#episodeLists, div.popover-body").on('mouseenter',function(){var datacontent=$(this).attr('data-content');$(this).attr('data-content',datacontent.replace(/\s?target=['"]_blank['"]\s?/gi,''));});setInterval(function(){$("div#animeList, div.episode__navigations, .popover-body, .popover").find('a').each(function(){$(this).removeAttr('target');});$("div.mx-auto, #floatingFooterBannerSection").hide()},500);</script>`);
    }
 
    window_load_ready(function () {
      var int_kurama = setInterval(function () {
        new_ep = getBy('Class', 'anime-details');
        player = getBy('Id', 'animeVideoPlayer');
 
        if (new_ep.length > 0 || (player && player.style.display == "")) {
          if (player) {
            rel = $('.episode__navigations').find('a');
            prm = { vertical: 'center', horizontal: 'center' };
            scroll_to(player, prm);
            prev_menu_next_click(rel[0], rel[1], rel[2], 'href'); /* Previous and Next*/
          } else if (new_ep.length > 0) {
            scroll_to(new_ep[0], { vertical: 'start' });
          }

          clearInterval(int_kurama);
          console.log('Ready!');
        }
      }, 500);
    });
  } else if (url.match(/kusonime.com\//g)) {
    var div = getBy('Tag', 'div');
    var list_urls = Object.entries(div).filter((key, val) => key[1].className.match(/smokeurl(.*)?/i));
    list_urls.filter((key, val) => {
      var aww = key[1].children;
      for (var a in aww) {
        if (aww[a].href && aww[a].href.match(/http/)) {
          var str = decodeURIComponent(aww[a].href);
          if (str.match(/kepoow.me/g)) {
            str = atob(str.split("r=")[1]);
          } else {
            if (str.match(/url=/i)) {
              str = atob(str.replace(/^.*url=(.*)&.*$/i, "$1"));
            }
          }
          aww[a].setAttribute('href', '#' + aww[a].innerText.replace(/\W\D/g, '_'));
          aww[a].setAttribute('onmouseover', 'this.href="' + str + '"');
          aww[a].setAttribute('onclick', 'window.open("' + str + '", "_blank");return false;');
          aww[a].removeAttribute('target');
        }
      }
    });
  } else if (url.match(/otakudesu/g)) {
    $('head').append('<script>window.open = function() {};</script>');

    hide_ads('iklan|blox|box_item_ads_popup', 'div');
    $("a").each(function(){
      if ($(this).attr('href') && $(this).attr('href').match(/rebrand/)) {
        $(this).remove();
      }
    });

    if (url.match(/\/anime\//)) {
      $(".episodelist").find("a").each(function () {
        $(this).removeAttr('target');
      });
      scrl_to = [getBy('Id', 'venkonten'), {vertical: 'start'}];
    } else {
      getBy('Id', 'overplay').remove();
      prm = { vertical: 'start' };
      if (get_win_size()) { prm.vertical = 'center'; }
      scrl_to = [getBy('Class', 'prevnext')[0], prm];

      rel = $("div.prevnext").find('a');
      prev_menu_next_click(rel[0], rel[1], rel[2]); /* Previous and Next*/
    }

    scroll_to(scrl_to[0], scrl_to[1]);
  } else if (url.match(/anichin/g)) {
    hide_ads("kln");
    new_ep = getBy('class', 'thumbook');
    player = getBy('id', 'embed_holder');
    if (player) {
      prm = { vertical: 'center', horizontal: 'center' };
      scroll_to(player, prm);

      rel = $("div.nvs").find('a');
      prev_menu_next_click(rel[0], rel[1], rel[2]); /* Previous and Next*/
    } else if (new_ep.length > 0) {
      scroll_to(new_ep[0], { vertical: 'start' });
    }
  } else if (url.match(/kuyhaa/g)) {
    $("div.entry-content").find("a").each(function () {
      if ($(this).attr("href").match(/ljutkeunvpn.blogspot.com\/p\/vpn.html\?url/g)) {
        str = atob(decodeURIComponent($(this).attr("href")).split("url=")[1]);
        if (str.match(/href/g)) {
          str = str.split("?")[1];
        }
      }
      $(this).attr("href", str);
    });
    $("input[type=image]").remove();


    /***** Url Shorter *****/
  } else if (url.match(/mirrored/g)) {
    if (url.match(/\/out_url/)) {
      var meta = $('meta[http-equiv="refresh"]').attr("content");
      link = getStr(meta, 'url=', '"');
      if (link.match(/%2F/)) {
        link = decodeURIComponent(link);
      }
    } else if (url.match(/\/(files|getlink)/) && !url.match(/\?hash/)) {
      link = $("div.container").find("a")[0].href;
    }
  } else if (url.match(/meong/g)) {
    try {
      setTimeout(function () {
        $("div#encrit").find('a')[0].click();
      }, 1500);
    } catch (e) {
      console.log(e.toString());
    }

    /***** Situs Download *****/
  } else if (url.match(/mediafire.com\/file\//g)) {
    link = getHref("div.download_link", "a.input");
  } else if (url.match(/clicknupload.org\//g)) {
    if ($("span.downloadbtn").length) {
      tipe = 'klik';
      jdl = getBy("Class", "downloadbtn")[1].textContent;
      link = $("span.downloadbtn");
    } else if ($("input[name=method_free]").length) {
      tipe = 'klik';
      aidi = url.split("/")[3];
      $("div#download").html(
        '<form method="POST" action="">' +
        '<input type="hidden" name="op" value="download1">' +
        '<input type="hidden" name="usr_login" value="">' +
        '<input type="hidden" name="id" value="' + aidi + '">' +
        '<div class="regular"><i class="far fa-tachometer-alt-slow"></i> <input type="submit" id="method_free" name="method_free" value="Free Download >>"></div>' +
        '</form>');
      jdl = getBy("Name", "method_free")[0].value;
      link = $("input[name=method_free]");
    } else if ($("div.download").find('downloadbtn').find('span').context.activeElement.innerText.length > 0) {
      tipe = '';
      jdl = $("div.download").find('downloadbtn').find('span').context.activeElement.innerText;
      link = $("button.downloadbtn").attr('onclick').replace("window.open('", "").replace("');" + '"', "");
    }
  } else if (url.match(/uptobox.com\//g)) {
    tipe = 'klik';
    if ($("span.red").length == 0) {
      if ($("input.download-btn").length) {
        var a = $("input.download-btn").attr("class").replace("disabled", "");
        $("input.download-btn").attr("class", a);
        jdl = $("input.download-btn").text;
        link = $("input.download-btn.big-button-green-flat.mt-4.mb-4");
      } else if ($("a.big-button-green-flat.mt-4.mb-4").text().match(/start/)) {
        link = document.querySelector("a.big-button-green-flat.mt-4.mb-4");
        jdl = link.text;
      }
    } else {
      alert($("span.red")[0].innerText);
    }
  } else if (url.match(/mp4upload.com\//g)) {
    if ($("span.btext").length) {
      tipe = 'klik';
      link = $("span.btext");
    }
  } else if (url.match(/pixeldrain/g)) {
    tipe = 'klik';
    var main = $("div.description");
    var buttons = main.find("button");
    if (buttons.length) {
      jdl = buttons[0].innerText.replace(/^.*\\n/, '');
      link = buttons[0];
    }
  }

  if (link !== null) {
    setTimeout(function () {
      tipe = tipe.toLowerCase();
      switch (tipe) {
      case "klik":
        klik(link, jdl, dlv);
        break;
      case "sambit":
        sambit(link, jdl);
        break;
      default:
        mangkat(link);
      }
    }, (anu * 1000));
  }
});

function klik(url, tbl, tp = "dl") {
  var jdul;
  if (url.click()) {
    if (tp !== "dl") {
      document.title = tbl;
    } else {
      if (url.text().length > 0) {
        jdul = url.text();
      } else {
        if (tbl !== "") {
          jdul = tbl;
        } else
          jdul = url;
      }
      document.title = 'Mencet Tombol "' + jdul + '"';
    }
  } else {
    document.title = url;
  }
}
function sambit(btn, tbl) {
  var jdul;
  if (btn.submit()) {
    if (tbl.text().length > 0) {
      jdul = tbl.text();
    } else {
      if (tbl !== "") {
        jdul = tbl;
      } else
        jdul = btn;
      document.title = 'Submit Form "' + jdul + '"';
    }
  } else {
    document.title = btn;
  }
}
function mangkat(url) {
  document.title = 'Cuss ' + url;
  window.location.replace(url);
}
function getHref(tanda, prm = null) {
  var fnd,
  hsl;

  if (tanda.match(/^a/)) {
    hsl = $(tanda).attr("href");
  } else {
    if (prm !== null) {
      fnd = prm;
    } else {
      fnd = "a";
    }
    hsl = $(tanda).find(fnd).attr("href");
  }

  return hsl;
}
function getBy(by, prm) {
  var gtb;

  switch (by.toLowerCase()) {
  case "tag":
    gtb = document.getElementsByTagName(prm);
    break;
  case "id":
    gtb = document.getElementById(prm);
    break;
  case "class":
    gtb = document.getElementsByClassName(prm);
    break;
  case "name":
    gtb = document.getElementsByName(prm);
    break;
  }

  return gtb;
}
function scroll_to(elem, params = {}) {
  /*
   * docs: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
   */
  var param = {
    behavior: 'smooth', /** 'auto': default, 'smooth': For smooth scrolling animation **/
    block: 'start',   /** 'center': center visible area, 'start': Aligns the element to the top of the visible area **/
    inline: 'nearest' /** horizontal visible area **/
  };

  if (get_win_size()) {
    param.block = 'center';
  }

  if (params.vertical != undefined) {
    param.block = params.vertical;
  }
  if (params.horizontal != undefined) {
    param.inline = params.horizontal;
  }

  elem.scrollIntoView(param);
}
function getStr(string, start, end) {
  var str = string.split(start);
  str = str[1].split(end);
  return str[0];
}
function hide_ads(rgx_idcl, elem = null, opts = null) {
  if (elem == null) { elem = "*"; }
  if (opts == null) { opts = 'ig'; }

  var regex = new RegExp(rgx_idcl, opts);
  try {
    $(elem).each(function () {
      if ($(this)[0].className.match(regex) || $(this)[0].id.match(regex)) {
        $(this).hide();
        /***$(this).fadeOut();***/
      }
    });
  } catch (e) { console.log(e.toString()); }
}
function get_win_size() {
  var win_size = false;
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  if (windowWidth < 768) { win_size = "mobile"; }

  return win_size;
}
function prev_menu_next_click(prev_btn, dtls_btn, next_btn, type = 'click') {
  if (!prev_btn && !dtls_btn && !next_btn) { return false; }

  /*
   * KeyCode Source: https://www.toptal.com/developers/keycode/table
   */
  var keysPressed = {};
  $(document).on('keydown', function(event) {
    /**
     * Disable Previous Details Next, key if focused on search box (input box)
     **/
    var cek = $(document.activeElement);
    if (cek.length && cek[0].tagName.match(/input/i)) { return false; }

    keysPressed[event.key] = true; // Mark the key as pressed
    if (keysPressed.Shift && keysPressed.PageDown) {
      if (next_btn == undefined || next_btn == '' || (next_btn.href && next_btn.href.match(/empty|#/g))) {
        next_btn = dtls_btn;
        console.log("Back to Details!");
      } else {
        console.log("Next!");
      }

      if (type == 'href') {
        window.location.replace(next_btn.href);
      } else {
        next_btn.click();
      }

      event.preventDefault();
    } else if (keysPressed.Shift && keysPressed.Home) {
      console.log("Details!");
      if (type == 'href') {
        window.location.replace(dtls_btn.href);
      } else {
        dtls_btn.click();
      }

      event.preventDefault();
    } else if (keysPressed.Shift && keysPressed.PageUp) {
      console.log("Previous!");
      if (type == 'href') {
        window.location.replace(prev_btn.href);
      } else {
        prev_btn.click();
      }
      event.preventDefault();
    }
  });

  /* clear keysPressed variable for reset */
  $(document).on('keyup', function(event) {
    keysPressed = {};
  });
}
function window_load_ready(callback) {
  $(window).on('load ready', callback);
}
