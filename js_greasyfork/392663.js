// ==UserScript==
// @name           Neopets - Empty Shop
// @namespace
// @include        http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @include        http://www.neopets.com/objects.phtml?obj_type=*&type=shop
// @description    Puts something in the unused shop IDs
// @copyright      mysticmajin
// @grant          none
// @homepageURL    http://www.neopets.com/~Jialana
// @version 0.0.1.20191119212706
// @namespace http://www.neopets.com/~Jialana
// @downloadURL https://update.greasyfork.org/scripts/392663/Neopets%20-%20Empty%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/392663/Neopets%20-%20Empty%20Shop.meta.js
// ==/UserScript==

function id(el,id) {return el.getElementById(id);} //These three functions are just typing shortcuts for getting page elements.
function cl(el,cls) {return el.getElementsByClassName(cls);}
function tg(el,tag) {return el.getElementsByTagName(tag);}

(function() {
var pageArea = cl(document,"content")[0]
pageArea = tg(pageArea,"center")[0]
pageArea = tg(pageArea,"br")[0]; //Gets an anchor point for the HTML.
var shopName; //What's displayed at the top-left of the content module.
var shopGreeting; //The bolded text under the shopkeeper image.
var shopCaption; //The non-bolded text under the greeting.
var shopkeeperImage; //The shopkeeper themselves.
var imgNotPet = '\" width=\"450\" height=\"150\" border=\"0\">' //The attributes for ordinary shopkeeper images.
var imgIsPet = '/2/2.png\" style=\"padding-left:150px;padding-right:150px;height:150px;\" border=\"0\">' //For when the active pet is in place of the shopkeeper.

var currentURL = window.location.href; //Reads the URL of the current page.
var shopID = currentURL.replace(/[\D]/g, ''); //Extracts the shop ID number from the URL.

var validShop = false; //Determines whether anything is done.


//Simulates the Pteri hints at the bottom of out-of-stock shops for a more authentic feel.
var REDPTERIHINT = ["You may be able to find some cheap food, or other objects in the <a href=\"http://www.neopets.com/auctions.phtml\"><b>Neopian Auctions</b></a>!",
                    "Fancy some free <a href=\"http://www.neopets.com/prehistoric/omelette.phtml\"><b>Omelette</b></a>?",
                    "Hungry?  Why not try <a href=\"http://www.neopets.com/objects.phtml?type=shop&amp;obj_type=47\"><b>PIZZAROO!</b></a>???",
                    "The <a href=\"http://www.neopets.com/soupkitchen.phtml\"><b>Soup Kitchen</b></a> will give away free food to pets!",
                    "There are loads more shops in the <a href=\"http://www.neopets.com/market_map.phtml\"><b>Marketplace</b></a>",
                    "Chocolate is good.  Go to the <a href=\"http://www.neopets.com/objects.phtml?type=shop&amp;obj_type=14\"><b>Chocolate Factory</b></a> now to get some :)",
                    "Have you tried the <a href=\"http://www.neopets.com/island/tradingpost.phtml\"><b>Island Trading Post</b></a> for some good deals?",
                    "You can find food randomly over the site, it does happen, so keep trying!", "Did you know you can click on the shopkeeper to refresh the shop??",
                    "Playing <a href=\"http://www.neopets.com/games/dicearoo.phtml\"><b>Dice-A-Roo</b></a> is a good way to get food!",
                    "Out of food?  Why not try <a href=\"http://www.neopets.com/objects.phtml?type=shop&amp;obj_type=46\"><b>Hubert\'s Hot Dogs</b></a>???"];
var hintNumber = Math.ceil(Math.random() * (REDPTERIHINT.length - 1)); //Selects one of the phrases from the list above.

var actpetmodule = cl(document,"sidebartable")[0]
var actpetname = tg(actpetmodule,"b")[0].textContent; //Reads the active pet's name, for use with never-used shops

if (shopID == 6 || shopID == 19 || shopID == 33 || shopID == 52 || shopID == 64 || shopID == 65 || shopID == 115 || shopID >= 118){
    shopName = "???";
//These sites were never used or could not be identified.
	shopGreeting = actpetname + " says, \'What is this place?\'";
	shopCaption = "I don\'t think we\'re supposed to be here. Let\'s go before something happens.";
	shopkeeperImage = "http://pets.neopets.com/cpn/" + actpetname + imgIsPet;
}
else if (shopID == 11){
    shopName = "Video Store";
//This shop sold VHS tapes and merchandise in Neopia Central until February 28, 2001, where it closed presumably due to changing rules about what technology existed in Neopia. The items sold were turned into books and Usuki merchandise.
	shopGreeting = "Huh? A visitor?";
	shopCaption = "What? You want a video? Uh... I\'m really sorry, but I\'m retired. I don't sell those anymore.<br>If you want to stick around for a while and we can watch something, I like company, but...";
	shopkeeperImage = "http://images.neopets.com/shopkeepers/w11.gif" + imgNotPet;
//Interesting to note is that the shopkeeper image was the generic "sad" Red Lenny pose at the time, not a unique shopkeeper image.
    }
else if (shopID == 28){
    shopName = "Koi Foods";
//This food shop was destroyed with Old Maraqua on August 18th, 2001. The items it sold were retired.
	shopGreeting = "What brings you to the ruins?"
	shopCaption = "Huh? Me? Oh, I\'m just here to reminisce. I used to have a store in this spot...<br>I\'m actually the head chef at <a href=\"http://www.neopets.com/water/restaurant.phtml\">Kelp</a> now, though. I\'ll see you there!";
	shopkeeperImage = "http://images.neopets.com/shopkeepers/w28.gif" + imgNotPet;
}
else if (shopID == 29){
    shopName = "Utility Fish";
//This shop, selling items originally intended for Classic Neohomes but never implemented, closed shortly before the destruction of Old Maraqua on August 14th, 2001.
	shopGreeting = "Do you have business here?"
	shopCaption = "Utility Fish? Oh, those old things? I gave those up as a failed project long ago.<br>I\'ve moved onto bigger and better inventions. My latest project is something called the \"3D Crabulator\"...";
	shopkeeperImage = "http://images.neopets.com/shopkeepers/w29.gif" + imgNotPet;
}
else if (shopID == 32){
    shopName = "Apothecary";
//This shop sold mushrooms that raised a pet's stats, and closed sometime in 2001 presumably for balance reasons. I can't find a specific date.
	shopGreeting = "Mr. Coconut says, \'GOOD NIGHT!!!\'"
	shopCaption = actpetname + " whispers, \'I don\'t know what this thing is, but it gives me the creeps... let\'s get out of here.\'";
	shopkeeperImage = "http://images.neopets.com/shopkeepers/w32.gif" + imgNotPet;
}
else if (shopID == 99){
    shopName = "Altador Cup Souvenirs";
//This shop existed during the first two Altador Cups.
	shopGreeting = "Oh, sorry! Looking in the wrong place."
	shopCaption = "I just watch the games now. Totally psyched for next year\'s Cup, aren\'t you? Which team you following?"
	shopkeeperImage = "http://images.neopets.com/shopkeepers/w99.gif" + imgNotPet;
}
else if (shopID == 109){
    shopName = "Crumble and Twig";
//This shop was never used, but it was the one that came closest to opening. It was apparently intended for the Habitarium.
	shopGreeting = "Crumble says, \'Oh, hello!\'"
	shopCaption = "Shopkeeping wasn\'t for me. I just decided to raise Petpetpets myself. Adorable, aren\'t they?"
	shopkeeperImage = "http://images.neopets.com/shopkeepers/w109.gif" + imgNotPet;
}
else {
    validShop = true; //This is a working shop ID. Skip the script.
    };

    if (validShop === false){//If the shop isn't detected to be a real shop
var newHTML = //What will actually be injected into the page.
'<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="left" valign="top"><div class="contentModule" style="height: 100%"><table cellpadding="3" cellspacing="0" border="0" class="contentModuleTable"><tr><td class="contentModuleHeader"> '+ shopName
//This part creates the box with the black label that you see in the Neopian shops.
+ '</td></tr><tr><td align="left" valign="top" class="contentModuleContent">'
//The stuff within the box.
+ '<div align="center"><br /><a href="objects.phtml?type=shop&obj_type=' + shopID + '\"><img src=\"' + shopkeeperImage + '</a><br>'
//"Did you know you can click on the shopkeeper to refresh the shop?" I mean, there's not much point to here, but just a little detail.
+ '<b>' + shopGreeting + '</b><br>' + shopCaption + '<P><div align="center">Neopian Inflation is currently at <b>2.31%</b><br></div><BR>'
//The message from the shopkeeper. Neopian inflation number is arbitrary because I've never had a clue what it means.
+ '</div></td></tr></table></div></td></tr></table><br /><hr><center>Sorry, but this shop has been removed from the site.</center><hr>'
//"Sorry, we are sold out of everything! We get restocked every eight minutes or so, so please come back soon."
+ '<p><table align=center border=1 cellpadding=3 cellspacing=0><tr><td align=center bgcolor="#ffffee" colspan=2><b>NEOPETS HINT</b></td></tr><tr><td width=80 align=center valign=center><img src="http://images.neopets.com/pets/80by80/pteri_red_happy.gif" width=80 height=80 border=0></td><td width=220 align=center valign=center><i>' + REDPTERIHINT[hintNumber] + '</i></td></tr></table>';
//Lastly, the hint box for the Red Pteri.

var pageTitle = "Neopets - " + shopName;
document.title = pageTitle; // Sets the page title to match the shop in question.

pageArea.insertAdjacentHTML('beforebegin',newHTML); //The line that actually modifies the page, inserting the above into the point anchored at the start.
}

})();