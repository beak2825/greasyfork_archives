// ==UserScript==
// @name     Unlock BA.no (Bergens Avisen)
// @author   ChrisHvide
// @version  1.2
// @include  https://ba.no/*
// @include  https://www.ba.no/*
// @description     Unlock Bergens Avisen BA.no's paid content. BA is a Norwegian newspaper.
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/31723
// @downloadURL https://update.greasyfork.org/scripts/387942/Unlock%20BAno%20%28Bergens%20Avisen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387942/Unlock%20BAno%20%28Bergens%20Avisen%29.meta.js
// ==/UserScript==
//-- Get everything that has the class "aid-background-blur".

var userTypeNodes = $ (".aid-background-blur");

userTypeNodes.removeClass ("aid-background-blur");
userTypeNodes.addClass ("");

GM_addStyle("#aid-overlay { display: none; } div.access-card.incentive-card { display: none; } div.right-product-container { display: none; } div.incentive-card.product-card { display: none; }");
