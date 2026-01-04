// ==UserScript==
// @name        AssociateAmazon
// @description SakuraScript
// @author      GinoaAI
// @namespace   https://greasyfork.org/ja/users/119008-ginoaai
// @version     1.1
// @match       https://www.amazon.co.jp/dp/*
// @match       https://www.amazon.co.jp/*/dp/*
// @match       https://www.amazon.co.jp/gp/product/*
// @match       https://www.amazon.co.jp/exec/obidos/ASIN/*
// @exclude     https://www.amazon.co.jp/exec/obidos/ASIN/*/nanaan-22/
// @icon        https://pbs.twimg.com/profile_images/1099150852390977536/nvzJU-oD_400x400.png
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/459773/AssociateAmazon.user.js
// @updateURL https://update.greasyfork.org/scripts/459773/AssociateAmazon.meta.js
// ==/UserScript==
var AsinValue = ASIN.value;
location.href = "https://www.amazon.co.jp/exec/obidos/ASIN/" + AsinValue + "/nanaan-22/";
history.pushState('','','/exec/obidos/ASIN/' + AsinValue + '/nanaan-22/');