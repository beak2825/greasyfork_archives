// ==UserScript==
// @name         Add-niconico-mylist-button
// @namespace    https://github.com/yuzulabo
// @version      1.0.1
// @description  右クリックするとニコ動のマイリスト追加ボタンがいい感じに出るやつ (適当)
// @author       neziri_wasabi (yuzu_1203)
// @match        https://friends.nico/*
// @match        https://best-friends.chat/*
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/375880/Add-niconico-mylist-button.user.js
// @updateURL https://update.greasyfork.org/scripts/375880/Add-niconico-mylist-button.meta.js
// ==/UserScript==

(function() {
  window.vid = "";

  window.onload = function() {
    const element = document.createElement("div");
    element.id = "add-niconico-mylist-button";
    element.style.display = "none";
    element.style.position = "fixed";
    element.style.cursor = "pointer";
    element.innerHTML = `
<div style="z-index:99999;border-radius: 5%;border: gray solid 1px;background: #fafafa;color:#000;">
  <span id="add-niconico-mylist-button-id"></span>をマイリストに追加
</div>
`;

    document.querySelector("body").appendChild(element);
    element.addEventListener('click', open);
  };

  window.oncontextmenu = function(e) {
    for (let item of e.path) {
      if (item.tagName === "A" && item.href.indexOf('https://nico.ms/') !== -1) {
        const id = item.href.replace("https://nico.ms/", "");
        document.getElementById('add-niconico-mylist-button-id').innerHTML = id;
        window.vid = id;

        const b = document.getElementById("add-niconico-mylist-button");
        b.style.left = (e.pageX - 80) + "px";
        b.style.top = (e.pageY - 20) + "px";
        b.style.display = "block";

        break;
      }
    }
  }

  window.onclick = function () {
    const b = document.getElementById("add-niconico-mylist-button");
    if (b && b.style.display === "block") b.style.display = "none";
  }

  function open() {
    window.open('https://www.nicovideo.jp/mylist_add/video/' + window.vid, '_blank', 'width=800,height=600');
  }
})();
