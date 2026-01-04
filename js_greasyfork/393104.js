// ==UserScript==
// @name         Better smelting potion v2
// @namespace    Better smelting potion v2
// @version      0.202
// @description  Less confusing smelting potion and fixes broken links
// @author       Badgehunter
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        *.diamondhunt.co/game.php
// @match		http://*.diamondhunt.co/DH1/game.php
// @match		https://*.diamondhunt.co/DH1/game.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393104/Better%20smelting%20potion%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/393104/Better%20smelting%20potion%20v2.meta.js
// ==/UserScript==
// first 3 are working images but images changed to other to make them more distinguashable from others
//http://dh2.diamondhunt.co/DH1/images/minerals/goldbar.png
$('img[src*="smeltingpotion.png"]').attr("src", "http://i.imgur.com/uihjJ1J.png"); //add // at start of this line if you don't want this change aka before $
$('img[src*="smeltingPotion.png"]').attr("src", "http://i.imgur.com/uihjJ1J.png"); //add // at start of this line if you don't want this change aka before $
$('img[src*="compost.png"]').attr("src", "https://i.imgur.com/JfLxp4B.png"); //add // at start of this line if you don't want this change aka before $ so it becomes //$
$('img[src*="dottedGreenLeaf.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/brewing/dottedgreenleaf.png");
$('img[src*="greenLeaf.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/brewing/greenleaf.png");
$('img[src*="snapeGrass.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/brewing/snapegrass.png");
$('img[src*="limeLeaf.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/brewing/limeleaf.png");
$('img[src*="crystalLeaf.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/brewing/crystalleaf.png");
$('img[src*="silverBar.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/minerals/silverbar.png");
$('img[src*="goldBar.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/minerals/goldbar.png");
$('img[src*="goldStaff.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/magic/goldstaff.png");
$('img[src*="upgradePumpjackOrb.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/crafting/upgradePumpJackOrb.png");
$('img[src*="giantDrill.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/shop/vip/giantdrill.png");
$('img[src*="magicCoolDownDonor.png"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/magic/magicCooldownDonor.png");
$('img[src*="promethiumFurnace.gif"]').attr("src", "http://dh2.diamondhunt.co/DH1/images/crafting/promethiumfurnace.gif");