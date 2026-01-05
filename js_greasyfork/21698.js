(function () {
// ==UserScript==
// @name           Soundcloud Downloader
// @namespace      thompcha
// @author         cecekpawon (THRSH)
// @description    Download all soundcloud tracks
// @version        1.4
// @require        http://code.jquery.com/jquery-latest.js
// @grant          none
// @match          https://soundcloud.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/21698/Soundcloud%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/21698/Soundcloud%20Downloader.meta.js
// ==/UserScript==

var _this, scdlr = function(){};

_this = scdlr.prototype = {
  $: {},
  clientId: atob("MDJnVUpDMGhIMmN0MUVHT2NZWFFJelJGVTkxYzcyRWE="),
  apiURL: "https://api.soundcloud.com",
  plist_length: 0,
  chrome: navigator.userAgent.match(/webkit/i) ? true : false,
  wGet: "",
  prettyname_rgx: /[^a-z0-9\.,_\-\(\) ]/gi,

  // Soundcloud Class
  c_playlist_true: ".playlistShuffleToggle",
  c_playlist_wrap: ".listenDetails__trackList",
  c_playlist_item: ".trackList__item",
  c_playlist_compact: ".playlist",
  c_sound_title: " .soundTitle__title",
  c_sound_actions: " .soundActions",
  c_detail_title: ".l-listen-hero",
  c_about: ".l-about-top",
  c_badge_item: ".soundBadgeList__item",
  c_private: ".sc-label-private",
  c_button: "sc-button",
  c_button_download: "sc-button-download",
  c_button_medium: "sc-button-medium",
  c_button_small: "sc-button-small",
  c_button_responsive: "sc-button-responsive",
  c_button_group: "sc-button-group",
  c_button_group_medium: "sc-button-group-medium",

  // Script Class / Vars
  c_parsed: "parsed",
  c_dyn: "dyn",
  c_with_label: "with_label",
  v_sh: "sh",
  v_bat: "bat",
  v_hbang: "#!/bin/bash\n\ncd \"`dirname \"$0\"`\"\n\n",
  v_mime_bat: "application/x-msdos-program",
  v_mime_sh: "application/x-sh",
  v_plindex: 0,

  l_128: "128",
  l_dlext: "#Download bash ext",
  l_wgetbtn: "WGET",
  l_dlbatch: "Download Batch",
  l_plindex: "Tracks Number",
  l_remaining: "remaining",
  l_working: "working..",
  l_RTMPdetected: "RTMP detected, let IDM handle this :))",
  l_get128: "Get 128",
  //l_128ready: "Mp3 link ready",

  e_ta: "yod_textarea",
  e_wget_wrap: "yod_wget_wrap",
  e_wgetbtn: "yod_wget_btn",
  e_sel_ext: "yod_sel_ext",
  e_remaining: "yod_remaining",
  e_dlbatch: "yod_dlbatch",
  e_plindex: "yod_plindex",
  e_a_128ready: "yod_a128ready",
  e_btn_128ready: "yod_128ready",

  db_bash: "yod_bash",
  db_plindex: "yod_plindex",

  a_data_token: "data-token",
  a_data_url: "data-url",
  a_data_title: "data-title",
  a_data_rtmp: "data-rtmp",
  a_data_downloadurl: "data-downloadurl",

  // Script CSS
  css: "\
    #yod_textarea {width: 100%; margin-bottom: 10px; height: 100px; resize: vertical;}\
    #yod_sel_ext {margin: 0 0 10px 10px;}\
    #yod_wget_wrap {width: 100%; margin: 20px 0; display: inline-block;}\
    #yod_wget {text-indent: inherit;}\
    #yod_remaining {margin-left: 10px}\
    .with_label {vertical-align: middle;display: inline-block; margin: auto 10px;}\
    .with_label input {margin-right: 5px; margin-bottom: 2px;}\
    .yod_a128ready {float: left; line-height: 0;}\
    .yod_128ready {background-color: #F50;}\
  ",

  setValue: function(key, value) {
    localStorage.setItem(key, value);
  },

  getValue: function(key) {
    return localStorage.getItem(key);
  },

  log: function(s) {
    console.log(s);
  },

  isset: function(v) {
    return typeof v != 'undefined';
  },

  toAttr: function(a, s, c) {
    if (!_this.isset(c)) c = "";
    return a + s + c;
  },

  remAttr: function(a, s, c) {
    if (!_this.isset(c)) c = "";
    var reg = new RegExp("[" + s + c + "]", "g");
    return s.replace(reg, "");
  },

  init: function(JQ) {
    _this.$ = JQ;
    _this.$("<style/>", {text: _this.css}).appendTo("head");
  },

  go: function() {
    var _private = _this.$(_this.c_private);

    _this.$(_this.c_sound_actions).not(_this.toAttr(".", _this.c_parsed)).each(function () {
      var par = _this.$(this),
        sound = par.find(_this.toAttr(".", _this.c_button_group) + ":first");

      par.addClass(_this.c_parsed);

      if (_private.length && !sound.length) {
        sound = _this.$("<div/>", {
          class: _this.c_button_group + " " + _this.c_button_group_medium,
          html: "<span></span>"
        }).appendTo(this);
      }

      if (sound.length && sound.html() && !sound.parents(_this.c_playlist_compact).length) {
        _this.addDownloadButton(sound);
      }
    });
  },

  addDownloadButton: function(sound) {
    var downloadLink = this.$("<button/>", {html: _this.l_128}),
      par = sound.parents("[role=group], " + _this.c_badge_item),
      anchor = par.find(_this.c_sound_title),
      resolveUrl = null,
      buttonClass = _this.c_button + " " + _this.c_button_download + " " + _this.c_button_responsive + " ",
      buttonClass_group = sound.attr("class"),
      playlist_item = sound.parents(_this.c_playlist_item);

    if (!par.length) {
      // Playlists tracks
      if (playlist_item.length) {
        anchor = playlist_item.find("a");
      } else {
      // Detail
        anchor = _this.$(_this.c_detail_title).find(_this.c_sound_title);

        var is_playlist = _this.$(_this.c_playlist_true);

        if (is_playlist.length) {
          return _this.wget(is_playlist, anchor.text().trim());
        }
      }
    }

    if (!anchor.length) return;

    if (buttonClass_group.match(/medium/i)) {
      resolveUrl = document.location.href;
      buttonClass += _this.c_button_medium;
    } else {
      resolveUrl = "https://soundcloud.com" + anchor.attr("href");
      buttonClass += _this.c_button_small;
    }

    var urlSplitArray = resolveUrl.split("/"),
      lastElement = urlSplitArray.pop(),
      secretToken = lastElement.match(/^s\-/i) ? lastElement : "";

    downloadLink.attr({title: _this.l_get128/*_this.l_128*/, class: buttonClass})
    .attr(_this.a_data_token, secretToken)
    .attr(_this.a_data_url, resolveUrl)
    .click(function () {
      _this.$(this).prop("disabled", true);
      _this.download(this);
      return false;
    });

    if (sound.find("button").length) {
      sound.append(downloadLink);
    } else {
      downloadLink.insertBefore(sound.children().last());
    }
  },

  update_ta: function() {
    var ta = _this.$(_this.toAttr("#", _this.e_ta));
    if (ta_val = ta.val()) {
      var bash_patt = new RegExp(_this.v_hbang.replace(/\$/igm, "\\$"), "igm");
      ta_val = ta_val.replace(bash_patt, "");
      if (_this.v_yod_bash === _this.v_sh) {
        ta_val = _this.v_hbang + ta_val;
      }

      ta.val(ta_val);

      _this.downloadBatch(ta);
    }
  },

  wget: function(el, title) {
    if (
      _this.$(_this.toAttr("#", _this.e_wget_wrap)).length
    ) return;

    var wgetTarget = el.parents(_this.c_about);

    _this.v_plindex = parseInt(_this.getValue(_this.db_plindex)) ? 1 : 0;

    if (wgetTarget.length) {
      _this.v_yod_bash = _this.getValue(_this.db_bash) !== _this.v_sh ? _this.v_bat : _this.v_sh;

      var selExt = _this.$("<select/>", {id: _this.e_sel_ext, class: _this.c_dyn})
        .append(_this.$("<option/>", {value: _this.v_bat, html: _this.toAttr(".", _this.v_bat)}))
        .append(_this.$("<option/>", {value: _this.v_sh, html: _this.toAttr(".", _this.v_sh)}))
        .change(function(){
          _this.v_yod_bash = _this.$(this).val();
          _this.setValue(_this.db_bash, _this.v_yod_bash);
          _this.update_ta();
        });

      selExt.find("option[value=\"" + _this.v_yod_bash + "\"]").prop("selected", true);

      _this.$("<div/>", {id: _this.e_wget_wrap})
      .append(
        _this.$("<textarea/>", {
          id: _this.e_ta,
          "data-title": title.replace(_this.prettyname_rgx, "").trim()
        }).hide()
      )
      .append(
        _this.$("<label/>", {id: _this.e_sel_ext + "_label", "for": _this.e_sel_ext, html: _this.l_dlext})
          .append(selExt)
      )
      .append(
        _this.$("<label/>", {id: _this.e_plindex + "_label", "for": _this.e_plindex, class: _this.c_with_label})
          .append(_this.$("<input/>", {id: _this.e_plindex, type: "checkbox", checked: _this.v_plindex ? "checked" : ""})
              .click(function(){
                _this.v_plindex = _this.$(this).prop("checked") ? 1 : 0;
                _this.setValue(_this.db_plindex, _this.v_plindex);
              })
            )
          .append(_this.l_plindex)
      )
      .append(
        _this.$("<button/>", {
          html: _this.l_wgetbtn,
          id: _this.e_wgetbtn,
          class: _this.c_dyn + " " + _this.c_button + " " + _this.c_button_responsive + " " + _this.c_button_medium
        })
        .click(function () {
          var ta = _this.$(_this.toAttr("#", _this.e_ta)),
            plist = _this.$(_this.c_playlist_wrap).find("[" + _this.a_data_token + "]").not("[" + _this.a_data_rtmp + "]"),
            remaining = _this.$(_this.toAttr("#", _this.e_remaining));

          _this.wGet = "";

          _this.$(_this.toAttr(".", _this.c_dyn)).prop("disabled", true);
          _this.$(_this.toAttr("#", _this.e_dlbatch)).remove();
          _this.plist_length = parseInt(plist.length) || 0;
          ta.val("").hide();
          remaining.html(_this.l_working);

          plist.each(function(i, e){
            if (ta) _this.download(e, ta, remaining, _this.v_plindex ? (i+1) : 0);
          });
        })
      )
      .append(
        _this.$("<span/>", {
          id: _this.e_remaining
        })
      )
      .appendTo(wgetTarget);
    }
  },

  download: function(el, ta, remaining, index) {
    var btnDL = _this.$(el), secret_token = btnDL.attr(_this.a_data_token);

    _this.$.getJSON(_this.apiURL + "/resolve.json", {
      url: btnDL.attr(_this.a_data_url),
      client_id: _this.clientId,
      secret_token: secret_token
    }, function (track) {
      var trackId = track.id.toString(),
        trackTitle = track.title.replace(_this.prettyname_rgx, "").trim() + ".mp3",
        trackTitle_enc = "&t=" + encodeURIComponent(trackTitle),
        uri = _this.apiURL + "/i1/tracks/" + trackId + "/streams";

      _this.$.getJSON(uri, {
        client_id: _this.clientId,
        secret_token: secret_token
      }, function (data) {
        if (!(data.hasOwnProperty("http_mp3_128_url") && data.http_mp3_128_url.match(/\.128\.mp3\?/i))) {
          data = { http_mp3_128_url: "" };
        }

        if (ta) {
          _this.plist_length--;

          if (_this.plist_length <= 0) remaining.empty();
          else remaining.html(_this.plist_length + " " + _this.l_remaining);

          if (data.http_mp3_128_url) {
            if (!_this.wGet && (_this.v_yod_bash === _this.v_sh)) _this.wGet += _this.v_hbang;
            index = index ? index + ". " : "";
            val = "wget -c -O \"" + index +  trackTitle + "\" \"" + data.http_mp3_128_url.replace(/%/gi, "%%") + "\" --no-check-certificate\n\n";
            _this.wGet += val;
            ta.val(_this.wGet);
            if (_this.plist_length === 0) {
              _this.$(_this.toAttr(".", _this.c_dyn)).prop("disabled", false);
              ta.val(ta.val().trim()).show();
              _this.downloadBatch(ta);
            }
          } else {
            _this.log(_this.l_RTMPdetected);
            btnDL.html("RTMP").prop("disabled", true).attr(_this.a_data_rtmp, true).off();
          }
        } else {
          if (data.http_mp3_128_url) {
            _this.download128(data.http_mp3_128_url, trackTitle, btnDL);
            btnDL.prop("disabled", false);
          } else {
            _this.log(_this.l_RTMPdetected);
            btnDL.html("RTMP").attr("disabled", true).off();
          }
        }

        return false;
      });
    });
  },

/*
  download128 : function(url, title) {
    var el = this.$("<a/>", {href: url, "download": title}),
      clickEvent  = document.createEvent('MouseEvents');

    clickEvent.initEvent('click', true, true);
    el.get(0).dispatchEvent(clickEvent);
  },
*/

  download128 : function(url, title, btnDL) {
	//console.log('http://thompcha.com/sc/?url='+encodeURIComponent(url)+'&title='+encodeURIComponent(title));
	myURL = 'http://thompcha.com/sc/?url='+encodeURIComponent(url)+'&title='+encodeURIComponent(title);
	
    btnDL.replaceWith(
      this.$("<a/>", {
          "class": _this.e_a_128ready,
          //href: url,
          href: myURL,
          "download": title,
          title: _this.l_128 + ": " + title,
          target: "_blank"
        })
        .append(
          this.$("<btn/>", {
            "class": btnDL.attr("class"),
            html: _this.l_128,
          })
          .addClass(_this.e_btn_128ready)
        )
      );
	  
  },

  downloadBatch: function(ta) {
    window.URL = window.webkitURL || window.URL;

    var mime = _this.v_yod_bash !== _this.v_sh ? _this.v_mime_bat : _this.v_mime_sh,
      bb = new Blob([ta.val()], {type: mime}),
      href = window.URL.createObjectURL(bb),
      fn = ta.attr(_this.a_data_title) + _this.toAttr(".", _this.v_yod_bash);

    _this.$(_this.toAttr("#", _this.e_dlbatch)).remove();

    _this.$("<a/>", {
      id: _this.e_dlbatch,
      href: href,
      html: _this.l_dlbatch,
      "download": fn
    })
    .attr(_this.a_data_downloadurl, [mime, fn, href].join(":"))
    .appendTo(ta.parent());
  }
};

function GM_wait() {
  if (typeof $ == "undefined") {
    setTimeout(GM_wait, 200);
  } else {
    var yodSncld = new scdlr(),
      JQ = $.noConflict(true);

    yodSncld.init(JQ);

    document.addEventListener("DOMNodeInserted", function (event) {
      var cname, elmt = event.target;

      if (!(/(CANVAS|DIV|LI)/.test(elmt.tagName))) return;
      if (cname = elmt.className) {
        if (
          (/(g\-box\-full|soundList__item|trackList|soundBadgeList__item)/i.test(cname))
        ) {
          yodSncld.go();
        }
      }
    }, false);
  }
}

document.addEventListener("DOMContentLoaded", GM_wait, true);
})();
