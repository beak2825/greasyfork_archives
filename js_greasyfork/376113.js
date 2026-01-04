// ==UserScript==
// @name         VKX
// @version      1.1.1
// @description  VK EXtended! Адблоки, Антирепост, Отключение Комментов, Инфо об странице и другое!
// @authors      dimden (Eff the cops)
// @match        https://vk.com/*
// @namespace    https://greasyfork.org/users/222541
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/376113/VKX.user.js
// @updateURL https://update.greasyfork.org/scripts/376113/VKX.meta.js
// ==/UserScript==

Wiki = { inBox: function(e, o) { if (!checkEvent(o)) { cur.wkBox && cur.wkBox.hide(); var a = cur.wkUrlInBox ? cur.wkUrlInBox : "/pages?act=in_box"; return cur.wkBox = showBox(a, e, { params: { width: 657 } }), cancelEvent(o) } }, switchHider: function(e) { var o = e.parentNode.parentNode; hasClass(o, "wk_hider_box") ? o.className = o.className.replace("wk_hider_box", "wk_hider_box_opened") : o.className = o.className.replace("wk_hider_box_opened", "wk_hider_box") }, toHash: function(e, o) { var a = extend(clone(nav.objLoc), { f: o }); e.href = "/" + nav.toStr(a), e.setAttribute("onmousedown", ""), e.onmousedown = null, delete e.onmousedown }, showIconTT: function(e, o) { showTooltip(e, { text: o, slideX: vk.rtl ? -15 : 15, black: 1, asrtl: 1, className: "tt_black_side", shift: [-25, -21, 0] }) } }; try { stManager.done("wk.js") } catch (e) { };
  setInterval(function() {
    if (!document.getElementById('VKX_OPTIONS') && !window.location.href.includes("/gim") && !window.location.href.includes("/al_im.php") && !window.location.href.includes("/audio") && !window.location.href.includes("/im") && !window.location.href.includes("/albums") && !window.location.href.includes("/apps")) {
    try {
      document.getElementsByClassName('page_block')[1].insertAdjacentHTML('AfterEnd', `
<br>
<style>
#VKX_OPTIONS {
  background-color: #ffffff;
      z-index: 9999;
      border: solid;
      padding-bottom: 45px;
      border-width: 1px;
      border-radius: 3px;
      border-color: #d9dfe9;
}
</style>
<div id="VKX_OPTIONS">
<font color="#2a5885" style="position:absolute;left:8px;padding-top:5px">VKX 1.1.1</font><img onmouseover="Wiki.showIconTT(this, 'Чтобы отключить некоторые опции нужно перезагрузить страницу.\
 Донат QIWI ник: DIMDEN.')" src="https://icon-library.com/images/white-question-mark-icon-png/white-question-mark-icon-png-12.jpg" style="width:16px;height:16px;position:absolute;right:5px;margin-top:3px;opacity:0.3"/>
<br>
<br>
<div style="position:absolute;left: 8%">
Блокировать рекламу.
</div>
<input id="vkx_blockads" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.blockads = true} else {localStorage.blockads = false}">
<br>
<div  style="position:absolute;left: 8%">
Выключить комментарии.
</div>
<input id="vkx_disablecomments" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.disablecomments = true} else {localStorage.disablecomments = false}">
<br>
<div style="position:absolute;left: 8%">
Выключить репосты.
</div>
<input id="vkx_disablereposts" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.disablereposts = true} else {localStorage.disablereposts = false}">
<br>
<div style="position:absolute;left: 8%">
Информация об странице.
</div>
<input id="vkx_userinfo" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.userinfo = true} else {localStorage.userinfo = false}">
<br>
<div style="position:absolute;left: 8%">
Удалять картинки.
</div>
<input id="vkx_deleteimages" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.deleteimages = true} else {localStorage.deleteimages = false}">
<br>
<div style="position:absolute;left: 8%">
Удалять текст.
</div>
<input id="vkx_deletetext" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.deletetext = true} else {localStorage.deletetext = false}">
<br>
<div style="position:absolute;left: 8%">
Удалять подкасты.
</div>
<input id="vkx_deletepodcasts" type="checkbox" style="position:absolute;right:10px" onclick="if(this.checked == true) {localStorage.deletepodcasts = true} else {localStorage.deletepodcasts = false}">
<br>
<br>
<font color="#2a5885" style="position:absolute;left:8px;padding-top:5px">Автор: <a href="https://dimden.dev/">dimden</a></font>
`)

      if (localStorage.blockads == "true") {
        document.getElementById('vkx_blockads').checked = true;
      };
      if (localStorage.disablecomments == "true") {
        document.getElementById('vkx_disablecomments').checked = true;
      };
      if (localStorage.disablereposts == "true") {
        document.getElementById('vkx_disablereposts').checked = true;
      };
      if (localStorage.userinfo == "true") {
        document.getElementById('vkx_userinfo').checked = true;
      };
      if (localStorage.deleteimages == "true") {
        document.getElementById('vkx_deleteimages').checked = true;
      };
      if (localStorage.deletetext == "true") {
        document.getElementById('vkx_deletetext').checked = true;
      };
      if (localStorage.deletepodcasts == "true") {
        document.getElementById('vkx_deletepodcasts').checked = true;
      };

      setInterval(function() {
        if (localStorage.userinfo == "true" && !document.getElementById('VKX_id') && !window.location.href.includes('/im') && !window.location.href.includes('/apps') && !window.location.href.includes('/feed') && !window.location.href.includes('/friends') && !window.location.href.includes('/albums') && !window.location.href.includes('/audios')) {
          try {
            var vkUserWall = document.body.querySelector("a.ui_tab_sel[href*=\"/wall\"]");
            var vkUserId = (vkUserWall.href.match(/wall(\d+)/i) || [])[1];
            if (typeof vkUserWall != "undefined" && typeof vkUserId != "undefined") {
              document.getElementsByClassName('label fl_l')[0].insertAdjacentHTML('beforebegin', `
         <div id="VKX_id" class="label fl_l">Айди:</div>
         <div class="labeled"><font color="#2a5885">${vkUserId}</font></div>
         <br>
         `);
              var xhr = new XMLHttpRequest();
              xhr.onload = function() {
                console.log(this.responseXML.title);
              }
              xhr.open("GET", "/foaf.php?id=" + vkUserId);
              xhr.responseType = "document";
              xhr.send();
              xhr.onload = (data) => {
                body = data.srcElement.response.body;
                document.getElementsByClassName('label fl_l')[0].insertAdjacentHTML('beforebegin', `
           <div id="VKX_id" class="label fl_l">Дата регистрации:</div>
           <div class="labeled"><font color="#2a5885">${body.getElementsByTagName('ya:created')[0].attributes[0].value}</font></div>
           <div id="VKX_id" class="label fl_l">Последний вход:</div>
           <div class="labeled"><font color="#2a5885">${body.getElementsByTagName('ya:lastloggedin')[0].attributes[0].value}</font></div>
           <div id="VKX_id" class="label fl_l">Последнее изменение:</div>
           <div class="labeled"><font color="#2a5885">${body.getElementsByTagName('ya:modified')[0].attributes[0].value}</font></div>
           `);
              };
            }
          } catch (e) { ; };
        };
        if (localStorage.disablecomments == "true") {
          try {
            document.getElementById('hidecomments').remove()
          } catch (e) { ; };
          try {
            document.getElementById('VKX_OPTIONS').insertAdjacentHTML('beforebegin', `<style id="hidecomments">.replies_list {display: none}</style>`)
          } catch (e) { ; };
        } else {
          try {
            document.getElementById('hidecomments').remove()
          } catch (e) { ; };
          try {
            document.getElementById('VKX_OPTIONS').insertAdjacentHTML('beforebegin', `<style id="hidecomments">.replies_list {display: block}</style>`)
          } catch (e) { ; };
        };
      }, 200);
      setInterval(function() {
        if (localStorage.disablereposts == "true") {
          try {
            for (var k in document.getElementsByClassName('copy_quote')) {
              document.getElementsByClassName('copy_quote')[k].parentElement.parentElement.parentElement.parentElement.parentElement.remove();
            }
          } catch (e) { ; };
        };
      }, 200);
      setInterval(function() {
        if (localStorage.blockads == "true") {
          try {
            for (var k in document.getElementsByClassName('wall_text')) {
              if (document.getElementsByClassName('wall_text')[k].innerHTML && (document.getElementsByClassName('wall_text')[k].innerHTML.includes("Post__copyright") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("vk.cc") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("Подробнее") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("Подписаться") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("Подписка") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("Лайк") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("Репост") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("Не пропусти") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("рекомендуем") || document.getElementsByClassName('wall_text')[k].innerHTML.includes("посмотреть"))) {
                document.getElementsByClassName('wall_text')[k].parentElement.parentElement.parentElement.parentElement.remove();
              }
            }
          } catch (e) { ; };
        };
      }, 200);

      setInterval(function() {
        if (localStorage.deletetext == "true" && !window.location.href.includes('/im')) {
          try {
            for (var k in document.getElementsByClassName('wall_post_text')) {
              document.getElementsByClassName('wall_post_text')[k].remove()
            };
          } catch (e) { ; };
        };
      }, 200)
      setInterval(function() {
        if (localStorage.deleteimages == "true" && !window.location.href.includes('/im')) {
          try {
            for (var k in document.getElementsByClassName('page_post_sized_thumbs')) {
              document.getElementsByClassName('page_post_sized_thumbs')[k].remove()
            };
          } catch (e) { ; };
        };
      }, 200)
      setInterval(function() {
        if (localStorage.deletepodcasts == "true" && !window.location.href.includes('/im')) {
          try {
            for (var k in document.getElementsByClassName('podcast_snippet')) {
              document.getElementsByClassName('podcast_snippet')[k].remove()
            };
          } catch (e) { ; };
        };
      }, 200)
    } catch (e) { ; };
  };
  }, 1000);
