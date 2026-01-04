// ==UserScript==
// @name         Auto Unlock Hat and Pets
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Annoyed by have to click "Follow" or "Subcrise" everytime equip your pet? Let this sipmle script help you
// @author       Havy
// @match        http://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442313/Auto%20Unlock%20Hat%20and%20Pets.user.js
// @updateURL https://update.greasyfork.org/scripts/442313/Auto%20Unlock%20Hat%20and%20Pets.meta.js
// ==/UserScript==

game.network.addEnterWorldHandler(() => {
   game.ui.components.MenuShop.onTwitterFollow();
   game.ui.components.MenuShop.onTwitterShare();
   game.ui.components.MenuShop.onFacebookLike();
   game.ui.components.MenuShop.onFacebookShare();
   game.ui.components.MenuShop.onYouTubeSubscribe();
});