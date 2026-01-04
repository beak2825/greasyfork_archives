// ==UserScript==
// @name        TweetDeck Paste Image
// @namespace   gaeulbyul.userscript
// @description 트윗덱에 클립보드 붙여넣기(Ctrl-V)로 이미지를 업로드하는 기능을 추가한다. (이미지 복사 기능 추가)
// @author      Gaeulbyul (Edit by jjo779)
// @license     WTFPL
// @match     https://twitter.com/i/tweetdeck
// @version     0.3b4
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/486571/TweetDeck%20Paste%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/486571/TweetDeck%20Paste%20Image.meta.js
// ==/UserScript==

void (function ($) {
  var catcher = $("<div>")
    .attr("contenteditable", true)
    .css("opacity", 0)
    .appendTo(document.body)
    .focus();

  function dataURIToBlob(dataURI) {
    var [mimeString, encodedData] = dataURI.split(",");
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0) {
      byteString = atob(encodedData);
    } else {
      byteString = unescape(encodedData);
    }
    var type = mimeString.match(/^data:(.+);/)[1];
    var ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], { type });
    return blob;
  }

  function waitClipboard() {
    var cer = catcher[0];
    var child = cer.childNodes && cer.childNodes[0];
    if (child) {
      if (child.tagName === "IMG") {
        var file = dataURIToBlob(child.src);
        pasteFile([file]);
      }
      cer.innerHTML = "";
    } else {
      setTimeout(waitClipboard, 100);
    }
  }

  function pasteFile(files) {
    // 트윗 입력창을 닫은 이후에 멘션 안 남게
    if (!$(".app-content").hasClass("is-open")) {
      $(document).trigger("uiComposeTweet", { type: "tweet" });
    }
    $(document).trigger("uiFilesAdded", { files });
  }

  $(document.body).on("paste", function (event) {
    if ($(".js-add-image-button").hasClass("is-disabled")) return;
    try {
      var clipdata = event.originalEvent.clipboardData;
      var items = clipdata.items;
      var item = items[0];
      if (clipdata.files.length > 0 && clipdata.files[0].type.startsWith('image/')) {
        var image = clipdata.files[0];
      }
    } catch (e) {
      catcher.focus();
      setTimeout(waitClipboard, 300);
      return;
    }
    if (image !== undefined) {
      pasteFile([image]);
    } else {
      if (item.kind !== "file") return;
      pasteFile([item.getAsFile()]);
    }
  });
})(
  window.webpackJsonp.push([
    [],
    {
      $(m, e, r) {
        return (m.exports = r(0));
      },
    },
    [["$"]],
  ])
);