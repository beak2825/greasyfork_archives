// ==UserScript==
// @name         MIDISHOW DOWNLOAD
// @namespace    pa001024
// @version      0.1
// @description  A MIDISHOW DOWNLOAD
// @author       pa001024
// @match        https://www.midishow.com/midi/*.html
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/390582/MIDISHOW%20DOWNLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/390582/MIDISHOW%20DOWNLOAD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var $ = unsafeWindow.$;
  function saveAs(link, filename) {
    var i = document.createElement("a");
    i.download = filename;
    i.href = link;
    i.target = "_blank";
    var o = document.createEvent("MouseEvent");
    o.initEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
    i.dispatchEvent(o);
  }
  function saveBin(bin, filename) {
    function stringToUint8Array(str) {
      var arr = [];
      for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
      }
      return new Uint8Array(arr);
    }
    var blob = new Blob([stringToUint8Array(bin).buffer], {
      type: "application/octet-stream"
    });
    saveAs(URL.createObjectURL(blob), filename);
  }
  function downloadMidi() {
    var el = $(".ms-player-container");
    function o(t) {
      return t
        .replace(/^tokeno#:@!/, "token")
        .replace("www.midishow.com", "s.midishow.net")
        .replace(".mid?", ".js?");
    }
    function e(t, e) {
      for (var n, i, r, o, s, a, u, c = "", h = 0; h < t.length;) {
        o = e.indexOf(t.charAt(h++));
        s = e.indexOf(t.charAt(h++));
        a = e.indexOf(t.charAt(h++));
        u = e.indexOf(t.charAt(h++));
        n = (o << 2) | (s >> 4);
        i = ((15 & s) << 4) | (a >> 2);
        r = ((3 & a) << 6) | u;
        c += String.fromCharCode(n);
        64 != a && (c += String.fromCharCode(i));
        64 != u && (c += String.fromCharCode(r));
      }
      return c;
    }
    var i = $.Deferred(),
      r = $.ajax({
        url: o(el.data("mid")),
        dataType: "jsonp",
        cache: !0,
        jsonp: !1,
        jsonpCallback: "e",
        type: "GET"
      }),
      a = $.post(
        "https://www.midishow.com/midi/new-file?id=" + el.data("id"),
        { id: el.data("id") },
        null,
        "text"
      );
    return (
      $.when(r, a).done(function (t, r) {
        var o = r[2].getResponseHeader("ETag").o() + r[0].substr(56);
        try {
          var res = e(r[0].substr(28, 28), o) + e(t[0], o) + e(r[0].substr(0, 28), o);
          var name = $("#stickyBlockStartPoint > div > div > div > div:nth-child(6) > div.media-body > span").text();
          saveBin(res, name || "down.mid");
          window.dlMid = res;
          i.resolve("done!");
        } catch (t) {
          unsafeWindow.PNotify.error({ title: "Error", text: t });
          i.reject(t);
        }
      }),
      i.promise()
    );
  }
  $("div.col-md-9 > div > a").click(e => {
    e.preventDefault();
    downloadMidi();
  });
})();
