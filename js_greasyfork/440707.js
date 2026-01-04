// ==UserScript==
// @name        alertPageRefresher
// @namespace   Violentmonkey Scripts
// @match       https://kaltura.app.opsgenie.com/alert/list#
// @version     1.0.2
// @author      vludanenkov
// @description 4/4/2020, 12:30:05 PM
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440707/alertPageRefresher.user.js
// @updateURL https://update.greasyfork.org/scripts/440707/alertPageRefresher.meta.js
// ==/UserScript==


GM_addStyle ( `
    .rainbow {
      animation: color-change 1s infinite;
    }
    @keyframes color-change {
      0% { color: red; }
      50% { color: blue; }
      100% { color: red; }
    }
` );

function idleUser() {
  var time;
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer; // catches touchscreen presses as well
  window.ontouchstart = resetTimer; // catches touchscreen swipes as well
  window.onclick = resetTimer; // catches touchpad clicks as well
  window.onkeydown = resetTimer;
  window.addEventListener('scroll', resetTimer, true);

  function redirectFunction() {
    let URI = 'https://kaltura.app.opsgenie.com/alert/list#';
    if (document.readyState == "complete") {
      if (document.URL != URI) {
        console.log("User inactive. Redirecting");
        window.location.href = URI;
      }
    }
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(redirectFunction, 30 * 1000);
  }
}

function ping() {
  var pinnedDashboard = '.og-saved-search__list__section__content__item__pin';
  idleUser();
  
  window.onload = function() {
    var pinnedDashboard = '.og-saved-search__list__section__content__item__pin';
    var loadedElement = document.querySelector(pinnedDashboard);
    if (!loadedElement) {
      setInterval(() => {
        if (!loadedElement) {
          loadedElement = document.querySelector(pinnedDashboard);
        }
        if (!loadedElement.classList.contains('rainbow')) {
          loadedElement.classList.add('rainbow');
        }
      }, 5 * 1000);
    }
  }
}
// async

(async function () {
  ping();

  while (true) {
    await new Promise((resolve) => {
      setTimeout(() => {
        try {
          let pinnedDashboard = '.og-saved-search__list__section__content__item__pin';
          let loadedElement = document.querySelector(pinnedDashboard);
          loadedElement.click();
          if (!loadedElement.classList.contains('rainbow')) {
            loadedElement.classList.add('rainbow');
          }
        } catch(e) {
          ping();
        }
        
        var date = new Date().toLocaleString();
        console.log(date + " - reload works!")
        resolve(true);
      }, 60 * 1000);
    });
  }
})();