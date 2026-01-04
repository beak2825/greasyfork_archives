// ==UserScript==
// @name     goodgame.ru stats buttons
// @description add stats buttons to user profile pages on goodgame.ru
// @description:en add stats buttons to user profile pages on goodgame.ru
// @version  1.4.2
// @include  https://goodgame.ru/*
// @grant    unsafeWindow
// @run-at   document-idle
// @namespace https://greasyfork.org/users/72530
// @downloadURL https://update.greasyfork.org/scripts/37239/goodgameru%20stats%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/37239/goodgameru%20stats%20buttons.meta.js
// ==/UserScript==

var url = window.location.href;

if (isProfilePage(url)) { AddButtonToProfile(); };


setInterval(function () {
  if (window.location.href != url)
  {
    url = window.location.href;
    if (isProfilePage(url)) { AddButtonToProfile(); };
  }
}, 1000);

function isProfilePage(currentUrl) {
  return currentUrl.indexOf("goodgame.ru/user/") !== -1;
}

function AddButtonToProfile() {
  let count = 0;
  var checkExist = setInterval(function() {
      count += 1;
      if (count > 100) {clearInterval(checkExist); return;};
      let elems = document.getElementsByClassName("user-profile__buttons");
      let elem_subcount = 0;
      if (elems.length > 0) {
          elem_subcount = elems[0].childElementCount;
      }
      if ((elem_subcount >= 2) && (elem_subcount < 5)) {
          clearInterval(checkExist);
          // action
          var userId = window.location.href.split("/user/")[1].replace("/","");
          var statsHref = "https://ggstats.strayge.com/user/" + userId;
          var buttons = document.getElementsByClassName("user-profile__buttons")[0];

          var btn = document.createElement("a");
          btn.href = statsHref;
          btn.setAttribute('target', '_blank');
          btn.className = "btn btn-blue transparent";
          btn.setAttribute('onmouseover', 'this.style.backgroundColor="rgba(68,83,126,.75)"');
          btn.setAttribute('onmouseout', 'this.style.backgroundColor="rgba(68,83,126,.5)"');
          btn.setAttribute('style', 'background-color: rgba(68,83,126,.5);');
          btn.innerHTML = '<span class="icon icon-charts2" style="margin-right: 8px;"></span><span class="user-profile__text_desktop">Стата</span>';
          buttons.appendChild(btn);
      }
  }, 100);
}