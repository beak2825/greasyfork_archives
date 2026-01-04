// ==UserScript==
// @name         Easy Wishlist & Ignore
// @namespace    store.steampowered.com
// @version      2022
// @description  Press 1 to Wishlist, 2 to Ignore
// @source       Reddit
// @license      MIT
// @match        https://store.steampowered.com/*
// @homepageURL  https://www.reddit.com/r/Steam/comments/e2c5bq/comment/ibbj3nr
// @icon         https://www.flaticon.com/download/icon/3670382?icon_id=3670382&author=473&team=473&keyword=Steam&pack=3670270&style=1&style_id=1223&format=png&color=%23000000&colored=1&size=64&selection=1&type=standard&search=steam
// @icon64         https://www.flaticon.com/download/icon/3670382?icon_id=3670382&author=473&team=473&keyword=Steam&pack=3670270&style=1&style_id=1223&format=png&color=%23000000&colored=1&size=64&selection=1&type=standard&search=steam
// @downloadURL https://update.greasyfork.org/scripts/499010/Easy%20Wishlist%20%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/499010/Easy%20Wishlist%20%20Ignore.meta.js
// ==/UserScript==

(function () {
  const wishlist_game_key_code = 49;
  const ignore_game_key_code = 50;

  let gameItem;
  let mouseX;
  let mouseY;

  function remove_game(_) {
    if(gameItem){
      gameItem.querySelector('.ds_options').click();
      document.querySelectorAll('.ds_options_tooltip div.option')[_].click();
      gameItem = undefined;
      setTimeout(() => window.dispatchEvent(new MouseEvent('mousemove', {clientX: mouseX,clientY: mouseY})), 500);
    }
  }

  const wishlist_game = () => remove_game(0);
  const ignore_game = () => remove_game(1);

  window.addEventListener('mousemove', e => {
    const hoverElement = document.elementFromPoint(e.clientX, e.clientY);
    const mouseHoverElement = hoverElement.closest('a[data-ds-appid]');
    gameItem = mouseHoverElement;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('keydown', (e) => {
    if(e.keyCode == wishlist_game_key_code)
    { wishlist_game(); }
    else if(e.keyCode == ignore_game_key_code)
    { ignore_game(); }
  });
})();