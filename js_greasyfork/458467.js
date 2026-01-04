// ==UserScript==
// @name         Better Beta Navigation
// @author       Vaebae
// @description  Enhances the Neopets Beta Navigation bar with a ton of useful links
// @match        *://www.neopets.com/*
// @namespace    Vaebae@CK
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/458467/Better%20Beta%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/458467/Better%20Beta%20Navigation.meta.js
// ==/UserScript==

var BUTTON_INDEX = 2;
var BUTTON_NAME = "explorenav";
var BUTTON_NAME2 = "gamesnav";
var BUTTON_WIDTH = 160; //Pixels wide

var nav = $(".nav-top-grid__2020");
var navShopDropDownButton = nav.find("> .nav-shop__2020").addClass("nav-shop-original").find(">.shopdropdown-button"); //Assign a unique CSS class name to the Shop button's container, and hold onto the button itself so that we can repair it's drop down menu after inserting our own button
var navCommunityDropDownButton = nav.find("> .nav-community__2020").addClass("nav-community-original").find(">.communitydropdown-button"); //Assign a unique CSS class name to the Shop button's container, and hold onto the button itself so that we can repair it's drop down menu after inserting our own button

$(".nav-explore-link__2020, .nav-games-link__2020").remove();

//Add our custom button to the nav's grid-template-columns CSS
var gridTemplateColumns = nav.css("grid-template-columns").split(" ");
gridTemplateColumns[0] = "auto"; //Reset the first element in the nav

gridTemplateColumns.splice(0, `${BUTTON_WIDTH}px`);

nav.css("grid-template-columns", gridTemplateColumns.join(" "));

//Add our custom button to the nav after the given position
nav.find(`> :nth-child(${BUTTON_INDEX})`).after(`
<div class="nav-shop__2020 ${BUTTON_NAME}">
    <div class="shopdropdown-button" onclick="toggleDropdownArrow('${BUTTON_NAME}');toggleNavDropdown__2020(document.querySelector('.${BUTTON_NAME} > #shopdropdown__2020'));">
        <div class="nav-explore-icon__2020"></div>
        <div class="nav-text__2020">Explore</div>
        <div class="nav-dropdown-arrow__2020"></div>
    </div>
    <div class="nav-dropdown__2020 shop-dropdown__2020" id="shopdropdown__2020" style="display:none">
        <div>
            <ul>
                <a href="/explore.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon1"></div>
                    <h4>Explore</h4>
                </li></a>
                <a href="/dome/"><li>
                    <div class="${BUTTON_NAME}-menu-icon2"></div>
                    <h4>Battledome</h4>
                </li></a>
                <a href="/pirates/academy.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon3"></div>
                    <h4>Swashbuckling Academy</h4>
                </li></a>
                <a href="/island/training.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon4"></div>
                    <h4>Mystery Island Training School</h4>
                </li></a>
                <a href="/island/fight_training.phtml?type=courses"><li>
                    <div class="${BUTTON_NAME}-menu-icon5"></div>
                    <h4>Secret Ninja Training School</h4>
                </li></a>
                <a href="/island/kitchen.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon6"></div>
                    <h4>Kitchen Quests</h4>
                </li></a>
                <a href="/halloween/witchtower.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon7"></div>
                    <h4>Edna's Tower</h4>
                </li></a>
                <a href="medieval/earthfaerie.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon8"></div>
                    <h4>Illusen's Glade</h4>
                </li></a>
                <a href="/faerieland/darkfaerie.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon9"></div>
                    <h4>Jhudora's Bluff</h4>
                </li></a>
                <a href="/vending.phtml"><li>
                    <div class="${BUTTON_NAME}-menu-icon10"></div>
                    <h4>Alien Aisha Vending Machine</h4>
                </li></a>
             </ul>
        </div>
    </div>
</div>
`);

nav.find(`> :nth-child(${BUTTON_INDEX})`).after(`
<div class="nav-community__2020 ${BUTTON_NAME2}">
    <div class="communitydropdown-button" onclick="toggleDropdownArrow('${BUTTON_NAME2}');toggleNavDropdown__2020(document.querySelector('.${BUTTON_NAME2} > #communitydropdown__2020'));">
        <div class="nav-games-icon__2020"></div>
        <div class="nav-text__2020">Games</div>
        <div class="nav-dropdown-arrow__2020"></div>
    </div>
    <div class="nav-dropdown__2020 community-dropdown__2020" id="communitydropdown__2020" style="display:none">
        <div>
            <ul>
                <a href="/games/"><li>
                    <div class="${BUTTON_NAME2}-menu-icon1"></div>
                    <h4>Games Room</h4>
                </li></a>
                <a href="/prizes.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon2"></div>
                    <h4>Trophy Cabinet</h4>
                </li></a>
                <a href="/games/kadoatery/index.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon3"></div>
                    <h4>Kadoatery</h4>
                </li></a>
                <a href="/games/neoquest/neoquest.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon5"></div>
                    <h4>Neoquest</h4>
                </li></a>
                <a href="/games/nq2/nq2.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon6"></div>
                    <h4>Neoquest II</h4>
                </li></a>
                <a href="/games/cliffhanger/cliffhanger.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon7"></div>
                    <h4>Cliffhanger</h4>
                </li></a>
                <a href="/games/pyramids/index.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon8"></div>
                    <h4>Pyramids</h4>
                </li></a>
                <a href="/games/sakhmet_solitaire/index.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon9"></div>
                    <h4>Sakhmet Solitaire</h4>
                </li></a>
                <a href="/games/scarab21/"><li>
                    <div class="${BUTTON_NAME2}-menu-icon10"></div>
                    <h4>Scarab 21</h4>
                </li></a>
                <a href="/games/draw_poker/round_table_poker.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon11"></div>
                    <h4>Round Table Poker</h4>
                </li></a>
                <a href="/games/neggsweeper/index.phtml"><li>
                    <div class="${BUTTON_NAME2}-menu-icon12"></div>
                    <h4>Neggsweeper</h4>
                </li></a>
            </ul>
        </div>
    </div>
</div>
`);

//Recalculate the button placement to accommodate our custom button
for (var button, buttons = nav.find("> :visible"), i = 0, j; (button = buttons.eq(i++))[0];)
    if (j = (button.css("grid-column") || "").match(new RegExp("(\\d+)\\s*/\\s*(\\d+)"))) button.css("grid-column", `${(i + 1)}/${(i + (j[2] - j[1]) + 1)}`);

//Repair the .shopdropdown-button's ability to toggle it's drop down menu
navShopDropDownButton.attr("onclick", (navShopDropDownButton.attr("onclick") || "").replace(new RegExp("nav-shop__2020"), "nav-shop-original").replace(new RegExp("shopdropdown__2020"), "document.querySelector('.nav-shop-original > #shopdropdown__2020')"));
navCommunityDropDownButton.attr("onclick", (navCommunityDropDownButton.attr("onclick") || "").replace(new RegExp("nav-community__2020"), "nav-community-original").replace(new RegExp("communitydropdown__2020"), "document.querySelector('.nav-community-original > #communitydropdown__2020')"));


//Add custom icons to the page if desired
$(".nav-top__2020").after(`
<style>
.${BUTTON_NAME}-icon:hover {
    transform: rotate(-10deg);
}

.${BUTTON_NAME}-menu-icon1,
.${BUTTON_NAME}-menu-icon2,
.${BUTTON_NAME}-menu-icon3,
.${BUTTON_NAME}-menu-icon4,
.${BUTTON_NAME}-menu-icon5,
.${BUTTON_NAME}-menu-icon6,
.${BUTTON_NAME}-menu-icon7,
.${BUTTON_NAME}-menu-icon8,
.${BUTTON_NAME}-menu-icon9,
.${BUTTON_NAME}-menu-icon10,
.${BUTTON_NAME2}-menu-icon1,
.${BUTTON_NAME2}-menu-icon2,
.${BUTTON_NAME2}-menu-icon3,
.${BUTTON_NAME2}-menu-icon4,
.${BUTTON_NAME2}-menu-icon5,
.${BUTTON_NAME2}-menu-icon6,
.${BUTTON_NAME2}-menu-icon7,
.${BUTTON_NAME2}-menu-icon8,
.${BUTTON_NAME2}-menu-icon9,
.${BUTTON_NAME2}-menu-icon10,
.${BUTTON_NAME2}-menu-icon11,
.${BUTTON_NAME2}-menu-icon12 {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
    height: 100%;
    min-height: 30px;
    width: 30px;
}

.${BUTTON_NAME}-menu-icon1 {
    background-image: url('https://images.neopets.com/themes/h5/basic/images/explore-icon.svg');
}

.${BUTTON_NAME}-menu-icon2 {
    background-image: url('https://images.neopets.com/themes/004_bir_a2e60/events/battle_accept.png');
}

.${BUTTON_NAME}-menu-icon3 {
    background-image: url('https://images.neopets.com/items/dubloon1.gif');
}

.${BUTTON_NAME}-menu-icon4 {
    background-image: url('https://images.neopets.com/items/codestone10.gif');
}

.${BUTTON_NAME}-menu-icon5 {
    background-image: url('https://images.neopets.com/items/codestone13.gif');
}

.${BUTTON_NAME}-menu-icon6 {
    /*background-image: url('');*/
}

.${BUTTON_NAME}-menu-icon7 {
    /*background-image: url('');*/
}

.${BUTTON_NAME}-menu-icon8 {
    /*background-image: url('');*/
}

.${BUTTON_NAME}-menu-icon9 {
    /*background-image: url('');*/
}

.${BUTTON_NAME}-menu-icon10 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon1 {
    background-image: url('https://images.neopets.com/themes/h5/basic/images/games-icon.svg');
}

.${BUTTON_NAME2}-menu-icon2 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon3 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon4 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon5 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon6 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon7 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon8 {
    /*background-image: url('');*/
}

.${BUTTON_NAME2}-menu-icon9 {
    /*background-image: url();*/
}

.${BUTTON_NAME2}-menu-icon10 {
    /*background-image: url();*/
}

.${BUTTON_NAME2}-menu-icon11 {
    /*background-image: url();*/
}

.${BUTTON_NAME2}-menu-icon12 {
    /*background-image: url();*/
}

</style>
`);

//Add new links to Community and Shop dropdowns
$($('.shopdropdownNPTab ul')[0]).append(`<a href="/inventory.phtml"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://images.neopets.com/themes/h5/basic/images/v3/inventory-icon.svg')"></div>
								<h4>Inventory</h4>
							</li></a>
                            <a href="/safetydeposit.phtml"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://images.neopets.com/themes/h5/grey/images/safetydeposit-icon.png')"></div>
								<h4>Safety Deposit Box</h4>
							</li></a>
                            <a href="/safetydeposit.phtml"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://images.neopets.com/themes/h5/basic/images/customise-icon.svg')"></div>
								<h4>Closet</h4>
							</li></a>
                            <a href="/gallery/index.phtml"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://images.neopets.com/themes/h5/altadorcup/images/gallery-icon.png')"></div>
								<h4>Gallery</h4>
							</li></a>
                            <a href="/neohome/"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://images.neopets.com/themes/h5/newyears/images/neohome-icon.png')"></div>
								<h4>Neohome 2.0</h4>
							</li></a>
                            <a href="/neohome.phtml"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://images.neopets.com/neohome2/user_pages/nh_house_logo.png')"></div>
								<h4>Classic Neohome</h4>
							</li></a>`)

$($('.nav-community__2020 ul')[0]).append(`<a href="/calendar.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/neocircles/calendar.gif')"></div>
                                <div class="community-dropdown-text">
								<h4>Calendar</h4>
                                </div>
							</li></a>
                            <a href="/userinfo.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/images/htmltonu.gif')"></div>
                                <div class="community-dropdown-text">
								<h4>Edit Profile</h4>
                                </div>
							</li></a>
                            <a href="/edithomepage.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/neoboards/avatars/sitespotlight.gif')"></div>
                                <div class="community-dropdown-text">
								<h4>Edit Petpages</h4>
                                </div>
							</li></a>
                            <a href="/nf.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/themes/h5/newyears/images/news-icon.png')"></div>
                                <div class="community-dropdown-text">
								<h4>News</h4>
                                </div>
							</li></a>
                            <a href="/ntimes/index.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/homepage/marquee/icons/nt_weewoo_icon.png')"></div>
                                <div class="community-dropdown-text">
								<h4>Neopian Times</h4>
                                </div>
							</li></a>
                            <a href="/neoboards/preferences.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/items/mall_thinpen_green_40.gif')"></div>
                                <div class="community-dropdown-text">
								<h4>Board Preferences</h4>
                                </div>
							</li></a>
                            <a href="/preferences.phtml"><li>
								<div class="community-guilds-icon community-dropdown-icon" style="background-image: url('https://images.neopets.com/neggfest/2020/hub/icons/green-check.png')"></div>
                                <div class="community-dropdown-text">
								<h4>Preferences</h4>
                                </div>
							</li></a>
                                   `)