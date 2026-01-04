// ==UserScript==
// @name         No Surf Constant Splash Reminder
// @author       bajspuss@reddit
// @version      0.1
// @description  Every time you navigate to websites such as Reddit, Youtube, TikTok, Facebook you will get a full-face splash saying "Are you sure you want to waste your time here?". Just click on it once to hide it. A nice mental reminder without adding strict time limits.
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @include      https://www.reddit.com/*
// @include      https://www.youtube.com/*
// @include      https://www.tiktok.com/*
// @include      https://www.facebook.com/*
// @namespace https://greasyfork.org/users/789930
// @downloadURL https://update.greasyfork.org/scripts/428848/No%20Surf%20Constant%20Splash%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/428848/No%20Surf%20Constant%20Splash%20Reminder.meta.js
// ==/UserScript==

(function ()
{
let $ = window.$;

$("head").append(`<style>
#fullscreen-overlay {
    display: visible;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 1);
    z-index: 999999999;
}

.centertext
{
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 50px;
  color: #fff;
}
</style>`);

let [w, h] = [, window.innerHeight];
$("body").append(`<div id="fullscreen-overlay">
<div class="centertext">Are you sure you want to waste your time here?</div>
</div>`);

$("#fullscreen-overlay").click((e) => {
    $("#fullscreen-overlay").css("display", "none");
});

window.addEventListener('popstate', () => {
    $("#fullscreen-overlay").css("display", "visible");
});

window.addEventListener('hashchange', () => {
    $("#fullscreen-overlay").css("display", "visible");
});
})()