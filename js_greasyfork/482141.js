// ==UserScript==
// @name         The Unofficial Neopets Patch
// @namespace    http://lel.wtf
// @license      GNU GPLv3
// @version      1.44.3
// @description  Entirely new, unified UI and experience for Neopets, built from the ground up.
// @author       Lamp
// @match        https://www.neopets.com/*
// @exclude      https://www.neopets.com/art/picview.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482141/The%20Unofficial%20Neopets%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/482141/The%20Unofficial%20Neopets%20Patch.meta.js
// ==/UserScript==

(function() {

if (document.getElementById('loading')){
document.getElementById('loading').remove();
}

if (!document.location.toString().startsWith("https://www.neopets.com/neomail_block_check.phtml") && !document.location.toString().startsWith("https://www.neopets.com/notice_iframe.phtml")){






    if (!document.location.toString().startsWith('https://www.neopets.com/games/play_flash.phtml') && !document.location.toString().startsWith('https://www.neopets.com/trudydaily/game.phtml')) {

        if (document.location == "https://www.neopets.com/index.phtml" || document.location == "https://www.neopets.com/") {

            document.location = "https://www.neopets.com/home/index.phtml";
        } else {




            if (document.location == "https://www.neopets.com/games/classic.phtml") {




                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
        .content {
    position: relative !important;

    right: 60px;
}


`;
                document.getElementsByTagName('head')[0].appendChild(style);




            }

            if (document.location.toString().startsWith('https://www.neopets.com/games/game.phtml?')) {


                if (document.location.toString().includes('&play=true')) {

                    //document.getElementById('content').style.visibility = "hidden";







                    var gameurl = document.getElementsByTagName('iframe')[1].src;




                    var newgameurl = gameurl.split('height=')[0] + 'height=500&width=900';

                    document.getElementsByTagName('iframe')[1].remove();

                    var newgame = document.createElement('iframe');
                    newgame.height = '500px';
                    newgame.width = '900px';
                    newgame.setAttribute('scrolling', 'no');
                    newgame.setAttribute('style', 'position:absolute; top:200px;left:500px;overflow:hidden;');

                    newgame.id = 'newgame'
                    newgame.src = newgameurl;

                    document.body.append(newgame);

                    document.getElementsByClassName('mid-content')[0].remove();
                    document.getElementsByClassName('container')[4].remove();




                                document.getElementsByClassName('container')[3].setAttribute("style", "background: transparent !important;");
                      document.getElementsByClassName('container')[2].remove();
                     document.getElementsByClassName('container')[1].remove();
                      document.getElementsByClassName('container')[0].remove();

                    document.getElementById('gr-ctp-recomendations').remove();
                    document.getElementById('gr-favorites').remove();

                    if (document.getElementById('gr-ctp-premium-featured')){
                        document.getElementById('gr-ctp-premium-featured').remove();
                    }








                } else {

                    document.body.setAttribute('style', 'visibility:hidden !important; display: none !important;');
                    document.location = document.location + "&size=regular&quality=high&play=true";

                }

            }




            if (document.getElementsByClassName('nav-profile-dropdown__2020')[0] && !document.getElementById('oldnew')) {



                var gradient = getComputedStyle(document.getElementsByClassName('nav-profile-dropdown__2020')[0])["background"];
                localStorage.setItem("gradient", gradient);

            } else {

                gradient = localStorage.getItem('gradient');
            }


 if (gradient.includes('gradient')){

            var gradone = gradient.split('rgb')[2].split('(')[1].split(')')[0];
     if (gradient.split('rgb')[3]){
            var gradtwo = gradient.split('rgb')[3].split('(')[1].split(')')[0];
     }
            if (gradient.split('rgb')[4]) {

                var gradone = gradient.split('rgb')[4].split('(')[1].split(')')[0];
            } else {}

 }

            else{
                gradone = gradient.split('rgb')[1].split('(')[1].split(')')[0];
                 gradtwo = gradient.split('rgb')[1].split('(')[1].split(')')[0];
            }




            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
#nst {

    font-size: 11pt !important;

    font-family: "MuseoSansRounded700", 'Arial', sans-serif !important;

}
.nav-profile-dropdown-text{

text-align: left !important;
}
.nav-profile-dropdown__2020{
overflow-x:hidden;
}
/* width */
::-webkit-scrollbar {
  width: 20px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(` + gradtwo + `);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(` + gradtwo + `);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(` + gradone + `);
}



`;
            document.getElementsByTagName('head')[0].appendChild(style);

if (document.location.toString().startsWith('https://www.neopets.com/userlookup')){

    customhtml = document.getElementsByTagName('div')[26].querySelectorAll('*').length;
    customcss =  document.getElementsByTagName('div')[26].getElementsByTagName('style').length;


    if (customhtml > 2 && customcss > 0){
        notcustom = false;

    }

    else{

        notcustom = true;

    }
}
else{

    notcustom = true;
}


            if (notcustom === true && !document.location.toString().startsWith('https://www.neopets.com/ul_preview.phtml')) {


                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
  .override-left {
    left: auto !important; /* Reset left */
    right: 0px !important; /* Set right */
    position: fixed !important;
    display: block !important;
     overflow: hidden !important;
  }
`;
                document.getElementsByTagName('head')[0].appendChild(style);


                var dailies = document.createElement('div');

                dailies.id = 'dailies'
                dailies.classList.add("nav-profile-dropdown__2020");
                dailies.classList.add("override-left");


                dailies.setAttribute("style", "color:"+localStorage.getItem('textcolor')+"; display: block !important; position:fixed; right: 0px !important; left !important");
                var glowstr = 7;
                dailies.innerHTML = `

<center><div id=dailiestop style="background: rgba(0, 0, 0, 0) linear-gradient(360deg, rgb(` + gradtwo + `) 0%, rgb(` + gradone + `) 64%) repeat scroll 0% 0% / auto padding-box border-box !important; position:relative; left:5px;"><img src="https://images.neopets.com/themes/h5/basic/images/np-icon.svg"
width="150px" height="150px" id="dailyprev" style=" max-width: 150px; max-height: 150px; -webkit-filter: drop-shadow(1px 1px ` + glowstr + `px white) drop-shadow(-1px -1px ` +
                    glowstr + `px white) drop-shadow(1px -1px ` + glowstr + `px white) drop-shadow(-1px 1px ` + glowstr + `px white);filter: drop-shadow(1px 1px ` + glowstr + `px white) drop-shadow(-1px -1px ` +
                    glowstr + `px white) drop-shadow(1px -1px ` + glowstr + `px white) drop-shadow(-1px 1px ` + glowstr +
                    `px white);"><br><p id="dailyname">Dailies List<div id="table-container" style="position:absolute; right:20px; top:250px"></div></center>




`;
                document.body.appendChild(dailies);




                let dailiesList = [];



                dailiesList.push({
                    url: "https://www.neopets.com/desert/shrine.phtml",
                    name: "Coltzan's Shrine",
                    img: "stamp_desert_coltzan.gif"
                });

                dailiesList.push({
                    url: "https://www.neopets.com/faerieland/tdmbgpop.phtml",
                    name: "TDMBGPOP",
                    img: "toy_bluegrundo.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/island/tombola.phtml",
                    name: "Tombola",
                    img: "toy_squeezy_tombola.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/prehistoric/omelette.phtml",
                    name: "Giant Omelette",
                    img: "om_sausage_pepperoni1.gif"
                });

                dailiesList.push({
                    url: "https://www.neopets.com/jelly/jelly.phtml",
                    name: "Free Jelly",
                    img: "jel_glowing_whole.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/altador/council.phtml",
                    name: "Altador Prizes",
                    img: "toy_kingaltador_figure.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/magma/quarry.phtml",
                    name: "Obsidian Quarry",
                    img: "mmat_obsidian.gif"
                });

                dailiesList.push({
                    url: "https://www.neopets.com/halloween/applebobbing.phtml",
                    name: "Apple Bobbing",
                    img: "bitredapple.gif"
                });

                dailiesList.push({
                    url: "https://www.neopets.com/pirates/anchormanagement.phtml",
                    name: "Anchor Management",
                    img: "fur_pirate_anchor.gif"
                });

                dailiesList.push({
                    url: "https://www.neopets.com/halloween/gravedanger/index.phtml",
                    name: "Grave Danger",
                    img: "gar_gravestone_mossy.gif"
                });



                dailiesList.push({
                    url: "https://www.neopets.com/prehistoric/mediocrity.phtml",
                    name: "Wheel of Mediocrity",
                    img: "wheel_of_mediocrity.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/faerieland/wheel.phtml",
                    name: "Wheel of Excitement",
                    img: "n13.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/halloween/wheel/index.phtml",
                    name: "Wheel of Misfortune",
                    img: "misfortune.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/medieval/knowledge.phtml",
                    name: "Wheel of Knowledge",
                    img: "bvb_mancrownlife.gif"
                });


                dailiesList.push({
                    url: "https://www.neopets.com/prehistoric/monotony/monotony.phtml",
                    name: "Wheel of Monotony",
                    img: "toy_monotony_plushie.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/stockmarket.phtml?type=portfolio",
                    name: "Stocks",
                    img: "stock_graph.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/petpetlab.phtml",
                    name: "Petpet Lab Ray",
                    img: "petpetlab_soot.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/lab2.phtml",
                    name: "Lab Ray",
                    img: "bd_spaceray1.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/halloween/strtest/index.phtml",
                    name: "Test Your Strength",
                    img: "gar_testyourstrength.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/halloween/coconutshy.phtml",
                    name: "Coconut Shy",
                    img: "gar_coconut_shy.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/wishing.phtml",
                    name: "Wishing Well",
                    img: "stamp_neo_well.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/games/lottery.phtml",
                    name: "Neopian Lottery",
                    img: "n58.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/pirates/buriedtreasure/index.phtml",
                    name: "Buried Treasure",
                    img: "n78.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/pirates/forgottenshore.phtml",
                    name: "Forgotten Shore",
                    img: "bg_forgotten_shore.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/dome/",
                    name: "Battledome",
                    img: "bd_faerieacornslingshot.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/faerieland/springs.phtml",
                    name: "Healing Springs",
                    img: "pot_illusen_day.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/moon/meteor.phtml",
                    name: "Kreludan Meteor",
                    img: "foo_space_moonrockpie.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/water/fishing.phtml",
                    name: "Underwater Fishing",
                    img: "vor_breadfish.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/desert/fruitmachine.phtml",
                    name: "Fruit Machine",
                    img: "food_desert7.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/medieval/grumpyking.phtml",
                    name: "Grumpy Old King",
                    img: "toy_plushie_skarl.gif"
                });




                dailiesList.push({
                    url: "https://www.neopets.com/medieval/wiseking.phtml",
                    name: "Wise Old King",
                    img: "bvb_kinghagan.gif"
                });






                 dailiesList.push({
                    url: "https://www.neopets.com/shenkuu/lunar/",
                    name: "Lunar Temple",
                    img: "kfu_glow_moon.gif"
                });









                 dailiesList.push({
                    url: "https://www.neopets.com/faerieland/caverns/index.phtml",
                    name: "Faerie Caverns",
                    img: "patamoose_pink.gif"
                });









                 dailiesList.push({
                    url: "https://www.neopets.com/winter/snowager.phtml",
                    name: "Snowager",
                    img: "petpet_snowickle.gif"
                });









                 dailiesList.push({
                    url: "https://www.neopets.com/worlds/geraptiku/tomb.phtml",
                    name: "Deserted Tomb",
                    img: "bd_scarab_neclkace.gif"
                });








                 dailiesList.push({
                    url: "https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes",
                    name: "Shop of Offers",
                    img: "hall_petpet1.gif"
                });


















                var dataArray = [];
                var glowstr = 4;
                for (let i = 0; i < dailiesList.length; i++) {

                    dataArray[i] = '<a href="' + dailiesList[i]['url'] + '"><img onmouseover="' +
                        `document.getElementById('dailyprev').src=this.src;document.getElementById('dailyname').innerHTML=this.title;document.getElementById('dailyprev').style.visibility='visible';` +
                        `" onmouseout="` + `document.getElementById('dailyprev').src='https://images.neopets.com/themes/h5/basic/images/np-icon.svg'; document.getElementById('dailyname').innerHTML='Dailies List';` +
                        `" src="https://lel.wtf/dailies/4` + dailiesList[i]['img'] + '" title="' + dailiesList[i]['name'] +
                        '" style="max-width: 45px; max-height: 45px; -webkit-filter: drop-shadow(1px 1px ' + glowstr + 'px white) drop-shadow(-1px -1px ' + glowstr + 'px white) drop-shadow(1px -1px ' +
                        glowstr + 'px white) drop-shadow(-1px 1px ' + glowstr + 'px white);filter: drop-shadow(1px 1px ' + glowstr + 'px white) drop-shadow(-1px -1px ' + glowstr + 'px white) drop-shadow(1px -1px ' +
                        glowstr + 'px white) drop-shadow(-1px 1px ' + glowstr + 'px white);"></a>';

                }



                function generateTable(data) {
                    var table = '<table>';
                    for (var i = 0; i < data.length; i++) {
                        if (i % 5 === 0) {
                            if (i !== 0) {
                                table += '</tr>';
                            }
                            table += '<tr>';
                        }
                        table += '<td>' + data[i] + '</td>';
                    }


                    table += '</tr></table>';

                    return table;
                }


                document.getElementById('table-container').innerHTML = generateTable(dataArray);

            }




            if (document.getElementById('header') || !document.getElementById('navState')) {

if (document.location.toString().startsWith('https://www.neopets.com/userlookup')){

    customhtml = document.getElementsByTagName('div')[26].querySelectorAll('*').length;
    customcss =  document.getElementsByTagName('div')[26].getElementsByTagName('style').length;


    if (customhtml > 2 && customcss > 0){
        notcustom = false;

    }

    else{

        notcustom = true;

    }
}
                else{

notcustom = true;

                }
               if (notcustom === true && !document.location.toString().startsWith('https://www.neopets.com/ul_preview.phtml')) {



                    if (!document.location.toString().startsWith('https://www.neopets.com/dome/')) {
                        var style = document.createElement('style');
                        style.type = 'text/css';
                        style.innerHTML = ` #body{ overflow:hidden; }#content{ padding-top:10px}



#main {

display: block !important;
height: auto !important;
border-left: 0px !important;
border-right: 0px !important;
color:white !important;
}
box-sizing: border-box;

.content{
position:absolute !important;
display: block !important;
 height: auto !important;
 width: 80% !important;
left:10%;
 text-align: center;


  box-sizing: border-box;
}

.content img{

max-width: 850px;
}

#content{
position: relative !important;
padding-left: 10px !important;
padding-right: 50px !important;

padding-bottom: 500px !important;
 width: 90% !important;
 left:5% !important;
}


#bob_content {

    left: 410px !important;

}

`;


                        document.head.appendChild(style);

                    }


                    var link = document.createElement('link');


                    link.rel = 'stylesheet';
                    link.id = "oldnew";
                    link.type = 'text/css';
                    link.href = localStorage.getItem("themecss");

                    document.head.appendChild(link);

                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = "https://images.neopets.com/themes/h5/common/navigation.css";
                    document.head.appendChild(link);
                    if (!document.location.toString().startsWith('https://www.neopets.com/dome/')) {
                        var link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.href = "https://images.neopets.com/themes/h5/common/template.css?d=20231024";
                        document.head.appendChild(link);

                    }


                    if (document.location == "https://www.neopets.com/ntimes/" || document.location == "https://www.neopets.com/process_stockmarket.phtml") {


                        var script = document.createElement('script');

                        script.type = 'text/javascript';
                        script.src = "https://images.neopets.com/js/jquery-ui-1.8.17.min.js";
                        document.head.appendChild(script);

                        var script = document.createElement('script');

                        script.type = 'text/javascript';
                        script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
                        document.head.appendChild(script);

                    }



                    if (!document.getElementById("container__2020")) {

                        var containerfix = document.createElement('div');



                        containerfix.id = "container__2020";



                        document.head.appendChild(containerfix);
                    }




                    var script = document.createElement('script');

                    script.type = 'text/javascript';
                    script.src = "https://images.neopets.com/themes/h5/common/js/header.js?d=20231024";
                    document.head.appendChild(script);



                    document.head.appendChild(script);











                    var script = document.createElement('script');

                    script.type = 'text/javascript';
                    script.src = "https://images.neopets.com/themes/h5/common/js/np-popups.js?d=20231024";
                    document.head.appendChild(script);




                    if (document.getElementById('header')) {
                        document.getElementById('header').style.visibility = "hidden";
                    }

                    if (document.getElementById('footer')) {
                        document.getElementById('footer').style.visibility = "hidden";
                    }
                    if (document.getElementsByClassName('sidebar')[0]) {
                        document.getElementsByClassName('sidebar')[0].remove();
                    }
                    if (document.getElementById('content')) {
                        document.getElementById('content').style.zIndex = "0";
                    }




                    if (document.getElementById('nst')) {

                        document.getElementById('nst').remove();
                    }


                    var div = document.createElement('div');
                    div.innerHTML = `<div id="navnewsdropdown__2020" class="nav-dropdown__2020">
		<div class="dropdown-triangle-up__2020"></div>
		<div class="news-tab-select__2020" onclick="window.location.href='/nf.phtml';">
				<div class="news-tab-title__2020">
						<a href="/nf.phtml"><div class="news-dropdown-text__2020">News</div></a>
					</div>
		</div>
		<div class="alerts-tab-select__2020 tabActive__2020" xonclick="			appInsights.trackEvent({name: 'News-Alert-Dropdown',
				properties:{
				Type: 'Alert'				}
				});
			appInsights.flush();
			toggleNewsTab__2020('alerts'); onTabChanged(2);">
		<div class="alerts-tab-title__2020">
			<div id="alerts-notif__2020"></div>
			<div class="news-dropdown-text__2020">Alerts</div>
		</div>
		</div>
		<div id="newstab__2020">
			<div class="news-tab-viewall__2020">
				<a href="/nf.phtml"><div class="news-tab-viewclick__2020">
				<div class="news-tab-icon__2020"></div>
				<div class="news-dropdown-text__2020">View All</div>
				</div></a>
			</div>
			<div id="news" class="news-tab-content__2020">
				<ul id="newsList">
				</ul>
				<div id="sentinel" class="loader"></div>
			</div>
		</div>
		<div id="alertstab__2020">
			<div class="alerts-tab-viewall__2020">
				<a href="/allevents.phtml"><div class="alerts-tab-viewclick__2020">
				<div class="alerts-tab-icon__2020"></div>
				<div class="news-dropdown-text__2020">View All</div>
				</div></a>
			</div>
		<div id="alerts" class="alerts-tab-content__2020">
			<ul><p class="alerts-none__2020" >It looks like there's nothing new for you here. Ho hum.</p></ul>
		</div>
		</div>
	</div><div class="nav-top__2020">
				<div tabindex="0" id="navPetMenuIcon__2020" class="nav-pet-menu-icon__2020" onclick="toggleNavDropdown__2020(navprofiledropdown__2020)" style="background-image:url('//pets.neopets.com/cp/55lq2fqc/1/1.png');"></div>
				<a href="/home/"><div class="nav-logo__2020"></div></a>

		<div class="nav-top-grid__2020">

				<form id="navSearchH5" onSubmit="javascript: search_handle(this);" style="display:none;">
			<div tabindex="0" id="navSearchBack" onclick="toggleSearchH5()"></div>
						<input class="sf" type="text" name="q" size="25" maxlength="255" value="Enter search text..." style="color: #a5a5a5; padding: 2px;" onFocus="this.style.color='#000000'; if( this.value=='Enter search text...' ) { this.value=''; }" onBlur="if( this.value=='' ) { this.style.color='#A5A5A5'; this.value='Enter search text...'; }">
			<input class="nav-search-button__H5 button-default__2020 button-blue__2020" type="submit" value="Go!" class="sf">
			<input type="hidden" name="client" value="pub-9208792519293771">
			<input type="hidden" name="forid" value="1">
			<input type="hidden" name="ie" value="ISO-8859-1">
			<input type="hidden" name="oe" value="ISO-8859-1">
			<input type="hidden" name="safe" value="active">
			<input type="hidden" name="domains" value="www.neopets.com">
			<input type="hidden" name="cof" value="GALT:#FFFFFF;GL:1;DIV:#000066;VLC:FFFFFF;AH:center;BGC:FFFFFF;LBGC:000066;ALC:FFFFFF;LC:FFFFFF;T:000000;GFNT:000066;GIMP:000077;FORID:1">
			<input type="hidden" name="hl" value="en">
			<input type="hidden" name="s">
		</form>



			<div class="nav-community__2020">
				<div tabindex="0" class="communitydropdown-button" onclick="toggleDropdownArrow('nav-community__2020');toggleNavDropdown__2020(communitydropdown__2020);">
										<div class="nav-community-icon__2020"></div>
					<div class="nav-text__2020">Community</div>
					<div class="nav-dropdown-arrow__2020"></div>
				</div>
				<div id="communitydropdown__2020" class="community-dropdown__2020 nav-dropdown__2020" style="display:none;">
					<div>
						<div class='neofriendStatus'><div class='neofriendStatus-dot neofriendStatus-dot-offline'></div><p><a href='/neofriends.phtml'>No Neofriends Online</a></p></div>
											</div>
					<ul>
						<a href="/community/index.phtml"><li>
							<div class="community-central-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Community Central</h4></div>
						</li></a>
						<a href="/neomessages.phtml"><li>
							<div class="neomail-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Neomail</h4></div>
						</li></a>
						<a href="/neoboards/index.phtml"><li>
							<div class="community-neoboards-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Neoboards</h4></div>
						</li></a>
						<a href="/contests.phtml"><li>
							<div class="community-spotlights-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Spotlights</h4></div>
						</li></a>
						<a href="/guilds/index.phtml"><li>
							<div class="community-guilds-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Guilds</h4></div>
						</li></a>
					</ul>
					<div class="communitydropdown-social">
						<a href="https://twitter.com/neopets"><div class="twitter-icon"></div></a>
						<a href="https://www.facebook.com/Neopets/"><div class="facebook-icon"></div></a>
						<a href="https://www.instagram.com/neopetsofficialaccount/"><div class="instagram-icon"></div></a>
					</div>

				</div>

			</div>
			<a class="nav-games-link__2020" href="/games/"><div class="nav-games__2020">
				<div class="nav-games-icon__2020"></div>
				<div class="nav-text__2020">Games</div>
			</div></a>
			<a class="nav-explore-link__2020" href="/explore.phtml"><div class="nav-explore__2020">
				<div class="nav-explore-icon__2020"></div>
				<div class="nav-text__2020">Explore</div>
			</div></a>
			<div class="nav-shop__2020">
				<div tabindex="0" class="shopdropdown-button" onclick="toggleDropdownArrow('nav-shop__2020');toggleNavDropdown__2020(shopdropdown__2020);">
					<div class="nav-shop-icon__2020"></div>
					<div class="nav-text__2020">Shop</div>
					<div class="nav-dropdown-arrow__2020"></div>
				</div>

				<div id="shopdropdown__2020" class="shop-dropdown__2020 nav-dropdown__2020" style="display:none;">
					<div class="shopdropdown-tabs">
						<div tabindex="0" class="shopdropdown-tab-np shopdropdown-tab-active" onclick="toggleShopTab__2020('np')">
							<div class="shop-np-icon"></div>
							<h3>NP</h3>
						</div>
						<div tabindex="0" class="shopdropdown-tab-nc" onclick="toggleShopTab__2020('nc')">
							<div class="shop-nc-icon"></div>
							<h3>NC</h3>
						</div>
					</div>
					<div class="shopdropdownNPTab">
						<ul>
							<a href="/shops/wizard.phtml"><li>
								<div class="shop-sw-icon shop-dropdown-icon"></div>
								<h4>Shop Wizard</h4>
							</li></a>
							<a href="/market.phtml?type=your"><li>
								<div class="shop-usershop-icon shop-dropdown-icon"></div>
								<h4>My Shop</h4>
							</li></a>
							<a href="/auctions.phtml"><li>
								<div class="shop-auction-icon shop-dropdown-icon"></div>
								<h4>Auctions</h4>
							</li></a>
							<a href="/island/tradingpost.phtml"><li>
								<div class="shop-trading-icon shop-dropdown-icon"></div>
								<h4>Trading Post</h4>
							</li></a>
							<a href="/bank.phtml"><li>
								<div class="shop-bank-icon shop-dropdown-icon"></div>
								<h4>Bank</h4>
							</li></a>
							<a href="/space/warehouse/prizecodes.phtml"><li>
								<div class="shop-npcodes-icon shop-dropdown-icon"></div>
								<h4>Redeem Codes</h4>
							</li></a>
						</ul>
					</div>
					<div class="shopdropdownNCTab" style="display:none;">
						<ul>
							<a href="http://ncmall.neopets.com/mall/shop.phtml"><li>
								<div class="shop-ncmall-icon shop-dropdown-icon"></div>
								<h4>NC Mall</h4>
							</li></a>
							<a href="https://secure.nc.neopets.com/get-neocash"><li>
								<div class="shop-buync-icon shop-dropdown-icon"></div>
								<h4>Buy NC</h4>
							</li></a>
							<a href="https://secure.nc.neopets.com/redeemnc"><li>
								<div class="shop-redeemnc-icon shop-dropdown-icon"></div>
								<h4>Redeem NC Cards</h4>
							</li></a>
							<a href="https://neopetsshop.com/"><li>
								<div class="shop-merch-icon shop-dropdown-icon"></div>
								<h4>Merch Shop</h4>
							</li></a>
                            <a href="/shopping/index.phtml"><li>
                                    <div class="shop-merchshop-icon shop-dropdown-icon"></div>
                                    <h4>Merch Partners</h4>
                            </li></a>
							<a href="/games/we/"><li>
								<div class="shop-shenanigifts-icon shop-dropdown-icon"></div>
								<h4>Shenanigifts</h4>
							</li></a>
							<a href="/mall/stylingstudio/"><li>
								<div class="shop-stylingstudio-icon shop-dropdown-icon"></div>
								<h4>Styling Studio</h4>
							</li></a>
														<a href="http://ncmall.neopets.com/mall/shop.phtml?page=wonderclaw"><li>
								<div class="shop-wonderclaw-icon shop-dropdown-icon"></div>
								<h4>Wonderclaw</h4>
							</li></a>
						</ul>
					</div>
				</div>
			</div>
						<a class="nav-premium-link__2020" href="/premium/">
						<div class="nav-premium__2020">
				<div class="nav-premium-icon__2020"></div>
				<div class="nav-text__2020">Premium</div>
			</div>
						</a>
						<div id="nst" class="nst nav-top-nst"></div>

			<div tabindex="0" class="nav-search-icon__2020" onclick="toggleSearchH5()"></div>
						<div tabindex="0" class="nav-quest-icon__2020" onclick="			appInsights.trackEvent({name: 'Quest-Dropdown',
				properties:{
				Type: 'Quests'				}
				});
			appInsights.flush();
			window.location='/questlog/'">
				<div id="NavQuestsNotif" class="nav-notif-dot__2020" style="display:none;"></div>
			</div>
			<div tabindex="0" class="nav-bell-icon__2020" onclick="			appInsights.trackEvent({name: 'News-Alert-Dropdown',
				properties:{
				Type: 'Alerts'				}
				});
			appInsights.flush();
			toggleNavDropdown__2020(navnewsdropdown__2020)">
				<div id="NavAlertsNotif" class="nav-notif-dot__2020" style="display:none;"></div>
			</div>
					</div>

		<div class="nav-top-pattern__2020"></div>
	</div>

	<div class="nav-bottom__2020">
		<div class="nav-npc-left__2020"></div>
		<div class="nav-community__2020">
			<div tabindex="0" class="communitydropdown-button" onclick="toggleNavDropdownBottom__2020(communitydropdownbottom__2020);">
								<div class="nav-community-icon__2020"></div>
				<div class="nav-text-bottom__2020">Community</div>
			</div>

			<div id="communitydropdownbottom__2020" class="community-dropdown__2020 nav-dropdown__2020" style="display:none;">
					<div>
						<div class='neofriendStatus'><div class='neofriendStatus-dot neofriendStatus-dot-offline'></div><p>No Neofriends Online</p></div>
											</div>
					<ul>
						<a href="/community/index.phtml"><li>
							<div class="community-central-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Community Central</h4></div>
						</li></a>
						<a href="/neomessages.phtml"><li>
							<div class="neomail-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Neomail</h4></div>
						</li></a>
						<a href="/neoboards/index.phtml"><li>
							<div class="community-neoboards-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Neoboards</h4></div>
						</li></a>
						<a href="/contests.phtml"><li>
							<div class="community-spotlights-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Spotlights</h4></div>
						</li></a>
						<a href="/guilds/index.phtml"><li>
							<div class="community-guilds-icon community-dropdown-icon"></div>
							<div class="community-dropdown-text"><h4>Guilds</h4></div>
						</li></a>
					</ul>
					<div class="communitydropdown-social">
						<a href="https://twitter.com/neopets"><div class="twitter-icon"></div></a>
						<a href="https://www.facebook.com/Neopets/"><div class="facebook-icon"></div></a>
						<a href="https://www.instagram.com/neopetsofficialaccount/"><div class="instagram-icon"></div></a>
					</div>

				</div>

		</div>
		<a href="/games/">
			<div class="nav-games__2020">
				<div class="nav-games-icon__2020"></div>
				<div class="nav-text-bottom__2020">Games</div>
			</div>
		</a>
		<a href="/explore.phtml"><div class="nav-explore__2020">
			<div class="nav-explore-icon__2020"></div>
			<div class="nav-text-bottom__2020">Explore</div>
		</div></a>
		<div class="nav-shop__2020">
			<div tabindex="0" class="shopdropdown-button" onclick="toggleNavDropdownBottom__2020(shopdropdownbottom__2020);">
				<div class="nav-shop-icon__2020"></div>
				<div class="nav-text-bottom__2020">Shop</div>
			</div>

			<div id="shopdropdownbottom__2020" class="shop-dropdown__2020 nav-dropdown__2020" style="display:none;">
					<div class="shopdropdown-tabs">
						<div class="shopdropdown-tab-np shopdropdown-tab-active" onclick="toggleShopTab__2020('np')">
							<div class="shop-np-icon"></div>
							<h3>NP</h3>
						</div>
						<div tabindex="0" class="shopdropdown-tab-nc" onclick="toggleShopTab__2020('nc')">
							<div class="shop-nc-icon"></div>
							<h3>NC</h3>
						</div>
					</div>
					<div class="shopdropdownNPTab">
						<ul>
							<a href="/shops/wizard.phtml"><li>
								<div class="shop-sw-icon shop-dropdown-icon"></div>
								<h4>Shop Wizard</h4>
							</li></a>
							<a href="/market.phtml?type=your"><li>
								<div class="shop-usershop-icon shop-dropdown-icon"></div>
								<h4>My Shop</h4>
							</li></a>
							<a href="/auctions.phtml"><li>
								<div class="shop-auction-icon shop-dropdown-icon"></div>
								<h4>Auctions</h4>
							</li></a>
							<a href="/island/tradingpost.phtml"><li>
								<div class="shop-trading-icon shop-dropdown-icon"></div>
								<h4>Trading Post</h4>
							</li></a>
							<a href="/bank.phtml"><li>
								<div class="shop-bank-icon shop-dropdown-icon"></div>
								<h4>Bank</h4>
							</li></a>
							<a href="/space/warehouse/prizecodes.phtml"><li>
								<div class="shop-npcodes-icon shop-dropdown-icon"></div>
								<h4>Redeem Codes</h4>
							</li></a>
						</ul>
					</div>
					<div class="shopdropdownNCTab" style="display:none;">
						<ul>
							<a href="http://ncmall.neopets.com/mall/shop.phtml"><li>
								<div class="shop-ncmall-icon shop-dropdown-icon"></div>
								<h4>NC Mall</h4>
							</li></a>
							<a href="https://secure.nc.neopets.com/get-neocash"><li>
								<div class="shop-buync-icon shop-dropdown-icon"></div>
								<h4>Buy NC</h4>
							</li></a>
							<a href="https://secure.nc.neopets.com/redeemnc"><li>
								<div class="shop-redeemnc-icon shop-dropdown-icon"></div>
								<h4>Redeem NC Cards</h4>
							</li></a>
							<a href="https://neopetsshop.com/"><li>
								<div class="shop-merch-icon shop-dropdown-icon"></div>
								<h4>Merch Shop</h4>
							</li></a>
                            <a href="/shopping/index.phtml"><li>
                                    <div class='shop-merchshop-icon shop-dropdown-icon'></div>
                                    <h4>Merch Partners</h4>
                            </li></a>
							<a href="/games/we/"><li>
								<div class="shop-shenanigifts-icon shop-dropdown-icon"></div>
								<h4>Shenanigifts</h4>
							</li></a>
							<a href="/mall/stylingstudio/"><li>
								<div class="shop-stylingstudio-icon shop-dropdown-icon"></div>
								<h4>Styling Studio</h4>
							</li></a>
							<!--<a href="/mall/patapult/"><li>
								<div class="shop-patapult-icon shop-dropdown-icon"></div>
								<h4>Patapult</h4>
							</li></a>-->
							<a href="http://ncmall.neopets.com/mall/shop.phtml?page=&cat=#claw"><li>
								<div class="shop-wonderclaw-icon shop-dropdown-icon"></div>
								<h4>Wonderclaw</h4>
							</li></a>
						</ul>
					</div>
				</div>
		</div>
		<a href="/premium/"><div class="nav-premium__2020">
			<div class="nav-premium-icon__2020"></div>
			<div class="nav-text-bottom__2020">Premium</div>
		</div></a>
		<div class="nav-npc-right__2020"></div>
		<div class="nav-bottom-pattern__2020"></div>
	</div>` +



                        `<div id="navdropdownshade__2020" class="nav-dropdown-shade__2020" onclick="toggleNavDropdown__2020()" style="z-index: -999; visibility: hidden; display: block;"></div>

` +




                        `<div class="nav-profile-dropdown__2020" id="navprofiledropdown__2020" style="display: block !important">
	    <div class="dropdown-triangle-up__2020" style="display: none;"></div>
		<div class="profile-grid__2020">
			<div class="nav-profile-pet-box-lg__2020" id="navProfilePetBox__2020" style="background-color: transparent;">
				<div class="nav-profile-pet-contract__2020" id="navProfilePetExpandIcon__2020" onclick="toggleProfilePet();" style="display: none;"></div>
				<div class="nav-profile-pet-lg__2020" id="navProfilePet__2020" style='background-size: 70% !important; background-image:` + localStorage.getItem(localStorage.getItem('activepet') + 'img') + ` !important;'></div>
			<img width="60" height="60" id="` + localStorage.getItem('activepet') + `petpet" src="https://lel.wtf/petpet/` + localStorage.getItem(localStorage.getItem('activepet') + 'petpet').replace("https://lel.wtf/", "").replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '') + `"
            style="position:absolute;left:0px;bottom:-10px;-webkit-filter: drop-shadow(1px 1px 3px white) drop-shadow(-1px -1px 3px white) drop-shadow(1px -1px 3px white) drop-shadow(-1px 1px 3px white);filter: drop-shadow(1px 1px 3px white) drop-shadow(-1px -1px 3px white) drop-shadow(1px -1px 3px white) drop-shadow(-1px 1px 3px white);">
            <img width="30" height="30" id="StormArea51petpetpet" src="https://lel.wtf/petpet/` + localStorage.getItem(localStorage.getItem('activepet') + 'petpetpet').replace("https://lel.wtf/", "").replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '') + `" style="position:absolute;left:55px;bottom:-10px;-webkit-filter: drop-shadow(1px 1px 2px white) drop-shadow(-1px -1px 2px white) drop-shadow(1px -1px 2px white) drop-shadow(-1px 1px 2px white);filter: drop-shadow(1px 1px 2px white) drop-shadow(-1px -1px 2px white) drop-shadow(1px -1px 2px white) drop-shadow(-1px 1px 2px white);"></div>
		</div>

<div class="nav-profile-dropdown-text" style="margin-top:15px">Welcome, <a href="/userlookup.phtml?user=` + localStorage.getItem('username') + `" class="text-muted">` + localStorage.getItem('username') + `</a></div>
<div class="nav-profile-dropdown-text">Active Pet: <a href="/petlookup.phtml?pet=` + localStorage.getItem('activepet') + `" class="profile-dropdown-link">` + localStorage.getItem('activepet') + `</a></div>
	<div class="nav-profile-dropdown-clock__2020">
		<div class="nav-calendar-icon__2020 nav-link-leave-beta__2020" data-url="/calendar.phtml"></div>
		<div class="nav-profile-dropdown-text"><span class="nst" id="nst">10:01:28 am NST</span></div>
	</div>

	    <ul>
			<a href="/settings/profile/"><li class="profile-linkflex">
				<div class="nav-profile-icon profile-dropdown-link-icon"></div>
				<h3>My Profile</h3>
			</li></a>
			<li class="profile-linkgrid">
				<a href="/home/index.phtml" class="profile-linkflex">
					<div class="nav-petcentral-icon profile-dropdown-link-icon"></div>
					<h3>My Pets</h3>
				</a>
				<div class="profile-dropdown-arrow" onclick="toggleDropdownSection('profilePetsSection',$(this))"></div>
			</li>
			<div id="profilePetsSection" style="display:none;">
				<a href="/customise/"><li class="profile-dropdown-subsection">
					<div class="nav-customise-icon profile-dropdown-link-icon"></div>
					<h4>Customise</h4>
				</li></a>
				<a href="/stylingchamber/"><li class="profile-dropdown-subsection">
					<div class="nav-stylingchamber-icon profile-dropdown-link-icon"></div>
					<h4>Styling Chamber</h4>
				</li></a>
				<a href="/reg/page4.phtml"><li class="profile-dropdown-subsection">
					<div class="nav-createpet-icon profile-dropdown-link-icon"></div>
					<h4>Create a Pet</h4>
				</li></a>
				<a href="/pound/"><li class="profile-dropdown-subsection">
					<div class="nav-adopt-icon profile-dropdown-link-icon"></div>
					<h4>Adopt a Pet</h4>
				</li></a>
			</div>

			<li class="profile-linkgrid">
				<a href="/inventory.phtml" class="profile-linkflex">
					<div class="nav-inventory-icon profile-dropdown-link-icon"></div>
					<h3>Inventory</h3>
				</a>
				<div class="profile-dropdown-arrow" onclick="toggleDropdownSection('profileInventorySection',$(this))"></div>
			</li>
			<div id="profileInventorySection" style="display:none;">
				<a href="/safetydeposit.phtml"><li class="profile-dropdown-subsection">
					<div class="nav-sdb-icon profile-dropdown-link-icon"></div>
					<h4>Safety Deposit Box</h4>
				</li></a>
				<a href="/quickstock.phtml"><li class="profile-dropdown-subsection">
					<div class="nav-quickstock-icon profile-dropdown-link-icon"></div>
					<h4>Quick Stock</h4>
				</li></a>
				<a href="/items/transfer_list.phtml"><li class="profile-dropdown-subsection">
					<div class="nav-transferlog-icon profile-dropdown-link-icon"></div>
					<h4>Item Transfer Log</h4>
				</li></a>
			</div>

			<li class="profile-linkgrid" onclick="toggleDropdownSection('profileAlbumSection',$(this))">
				<div class="profile-linkflex">
					<div class="nav-albums-icon profile-dropdown-link-icon"></div>
					<h3>My Albums</h3>
				</div>
				<div class="profile-dropdown-arrow"></div>
			</li>
			<div id="profileAlbumSection" style="display:none;">
				<a href="/gallery/index.phtml"><li class="profile-dropdown-subsection">
					<div class="nav-gallery-icon profile-dropdown-link-icon"></div>
					<h4>Gallery</h4>
				</li></a>
				<a href="/stamps.phtml?type=album"><li class="profile-dropdown-subsection">
					<div class="nav-stamps-icon profile-dropdown-link-icon"></div>
					<h4>Stamps</h4>
				</li></a>
				<a href="/tcg/album.phtml"><li class="profile-dropdown-subsection">
					<div class="nav-tcg-icon profile-dropdown-link-icon"></div>
					<h4>Trading Cards</h4>
				</li></a>
				<a href="/ncma/"><li class="profile-dropdown-subsection">
					<div class="nav-ncalbum-icon profile-dropdown-link-icon"></div>
					<h4>NC Mall Album</h4>
				</li></a>
			</div>

<!-- 			<a href="/preferences.phtml"><li class="profile-linkflex">
				<div class="nav-settings-icon profile-dropdown-link-icon"></div>
				<h3>Settings</h3>
			</li></a> -->

			<li class="profile-linkgrid">
				<a href="/settings/" class="profile-linkflex">
					<div class="nav-settings-icon profile-dropdown-link-icon"></div>
					<h3>Settings</h3>
				</a>
				<div class="profile-dropdown-arrow" onclick="toggleDropdownSection('profileSettings',$(this))"></div>
			</li>
			<div id="profileSettings" style="display:none;">
				<a href="/settings/account">
					<li class="profile-dropdown-subsection">
						<div class="nav-settings-icon profile-dropdown-link-icon"></div>
						<h4>Account</h4>
					</li>
				</a>
				<a href="/settings/privacy">
					<li class="profile-dropdown-subsection">
						<div class="nav-settings-icon profile-dropdown-link-icon"></div>
						<h4>Privacy & Security</h4>
					</li>
				</a>
				<a href="/settings/email">
					<li class="profile-dropdown-subsection">
						<div class="nav-settings-icon profile-dropdown-link-icon"></div>
						<h4>Email</h4>
					</li>
				</a>
				<a href="/settings/neoboards">
					<li class="profile-dropdown-subsection">
						<div class="nav-settings-icon profile-dropdown-link-icon"></div>
						<h4>Neoboards</h4>
					</li>
				</a>
			</div>

						<a href="/logout.phtml">
				<li class="profile-linkflex">
					<div class="nav-signout-icon profile-dropdown-link-icon"></div>
					<h3>Sign Out</h3>
				</li>
			</a>
	    </ul>
	</div>`



                        +




                        `<div class="footer__2020" id="footer__2020" style="z-index: 1 !important; position:fixed; bottom: 0px; top: auto !important">
	<div class="footer-pattern__2020"></div>
	<div class="footer-copyright__2020">
		NEOPETS and all related indicia are trademarks of Neopets, Inc., © 1999-2023. ® denotes Reg. USPTO. All rights reserved.
	</div>
	<div class="footer-links__2020">
		<div class="footer-link__2020"><a href="//www.neopets.com/terms.phtml">Terms of Use</a></div>
		<div class="footer-link__2020"><a href="//www.neopets.com/privacy.phtml">Privacy Policy</a></div>
		<div class="footer-link__2020"><a href="https://support.neopets.com/">Support</a></div>
	</div>
	<div class="footer-npcs__2020">
				<div class="nav-npc-left__2020"></div>
		<div class="nav-npc-right__2020"></div>
			</div>
</div>`;


                    while (div.children.length > 0) {
                        document.body.appendChild(div.children[0]);
                    }




                    if (document.getElementsByClassName('nav-profile-dropdown-clock__2020')[0]) {
                        document.getElementsByClassName('nav-profile-dropdown-clock__2020')[0].remove();
                    }




                }



            } else {




                localStorage.setItem("username", document.getElementsByClassName('nav-profile-dropdown-text')[0].getElementsByTagName('a')[0].innerHTML);
                localStorage.setItem("activepet", document.getElementsByClassName('nav-profile-dropdown-text')[1].getElementsByTagName('a')[0].innerHTML);

                localStorage.setItem("themecss", document.getElementById('siteTheme').href);

            }


if ( document.getElementsByClassName('nav-pet-menu-icon__2020')[0]){
            document.getElementsByClassName('nav-pet-menu-icon__2020')[0].remove();
}









       if (document.location.toString().startsWith('https://www.neopets.com/dome/')) {


                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `#bdHeader, .bdPopupGeneric.r, #navSearchH5
{
display: none !important;
}


@font-face {
	font-family: "Cafeteria";
	src:url(https://images.neopets.com/js/fonts/cafeteria-black.ttf) format("truetype");
	src:url(https://images.neopets.com/js/fonts/cafeteria-black.otf) format("opentype");
}

.communitydropdown-button, .nav-games__2020, .nav-explore__2020, .shopdropdown-button, .nav-premium__2020 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

}

.nav-text__2020, .nav-text-bottom__2020 {
    font-family: "Cafeteria", 'Arial Bold', sans-serif !important;
    text-align: center;
}

.nav-profile-dropdown__2020 ul li {
    font-family: "Cafeteria", 'Arial Bold', sans-serif !important;
    font-size: 18pt;
}

.nav-profile-dropdown__2020 ul li {
    float: none;
    text-align: left;
    width: 100%;
    margin: 0;
    padding: 5px 0px 5px 15px;
    line-height: 35px;
    cursor: pointer;
    box-sizing: border-box;
}

#bd_rewards, .bdPopupGeneric.contents {
width: 530px !important;
background: white;
}

#log_footer, #logcont .damagetaken, .itemicon, #bdHomeRecordBox, #bdHomeRecordMore, #bdHomeRecordTitle, #bdHomeFeaturedTitle, #bdHomeRecordWinBar, #bdHomeRecordLoseBar, bdHomeRecordDrawBar, .statBar{
z-index: 0 !important;
}


#stepIcon1Container, #stepIcon2Container, #stepIcon3Container, #stepIcon4Container {

    top: -70px !important;
    }


#stepIcon1Container img.pet {

    top: 74px !important;


    }
#bd_rewardsnav {
left: -7px !important;
}`;


                document.getElementsByTagName('head')[0].appendChild(style);


            }













            if (!document.location.toString().startsWith('https://www.neopets.com/dome/')) {


                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `.nav-logo__2020 {left: auto !important;}.container{padding-bottom:100px} .footer__2020{z-index: 9 !important; position:fixed; bottom: 0px; top: auto !important}
.nav-npc-right__2020{ right:300px !important;} nav-npc-left__2020{left:300px !important;}
.gr-innernav-cont {
left: auto !important;
    right: -40px !important;

}
#SelectAvatarPopup .popup-body__2020
{
max-height: calc(70vh - 60px) !important;
overflow: scroll !important;
}

  .advent2021_SQRaisha2{

                        left: 100px !important;

                        }

                        .advent2021_SQRaisha1{

                        right: 300px !important;

                        }

                        #gr-ctp-hiscores table {

color: black !important;
    top: -87px !important;
height: 134.5px !important;
z-index: 1 !important;
}

.mid-content table{
background: white !important;
background-color: white !important;

}



#gr-ctp-hiscores {
top: auto !important;
bottom: 70px !important;


    right: 270px !important;
}

.module .header {

    z-index: 5 !important;
;
}




#game_cont iframe{
position:relative !important;
bottom: 100px !important;
}
#FaeriesHope {
    position: relative;
    left: 20%;
    width: 60%;
    font-size: 20px;
    font-family: "Segoe UI", Arial, sans-serif;
    font-weight: 600;
    line-height: 30px;
    overflow-x: hidden;
    z-index:0 !important;
}`;


                document.getElementsByTagName('head')[0].appendChild(style);


            }


            if (document.location.toString().startsWith('https://www.neopets.com/pl_preview.phtml') || document.location.toString().startsWith('https://www.neopets.com/petlookup.phtml')) {

                var style = document.createElement('style');
                style.type = 'text/css';
                if (!getComputedStyle(document.getElementsByTagName('body')[0])["background-image"].split('url("')[1].startsWith('https://images.neopets.com')) {
                    style.innerHTML = `


body{
background-size: cover;
}


`;




                }



                document.getElementsByTagName('head')[0].appendChild(style);



            }




















            var link = document.createElement('link');




            if (document.getElementById('navnewsdropdown__2020')) {
                document.getElementById('navnewsdropdown__2020').setAttribute("style", "z-index: 99 !important;");
            }

            if (document.getElementsByClassName('profile-dropdown-link')[0]){
            var activepet = document.getElementsByClassName('profile-dropdown-link')[0].innerHTML;

            var petlarge = document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0];
                if (document.getElementsByClassName('nav-profile-pet-contract__2020')[0]){
            document.getElementsByClassName('nav-profile-pet-contract__2020')[0].style.display = "none";
                }

            document.getElementsByClassName('dropdown-triangle-up__2020')[0].style.display = "none";


if (document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0]){
            document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0].style.backgroundColor = "transparent";
}
                if(document.getElementsByClassName('nav-profile-pet-lg__2020')[0]){
            document.getElementsByClassName('nav-profile-pet-lg__2020')[0].setAttribute("style", "background-size:70% !important");
                }



            var currstyle = document.createElement('style');
            currstyle.type = 'text/css';
            currstyle.innerHTML = `
  .pushcurrency {
    left: auto !important;
    right: 150px !important;
    position: absolute !important;
    display: block !important;
  }
`;
            document.getElementsByTagName('head')[0].appendChild(currstyle);

            if (document.location == "https://www.neopets.com/home/" || document.location == "https://www.neopets.com/home/index.phtml") {

                if (document.getElementsByClassName('hp-event-icon')[0]){
                document.getElementsByClassName('hp-event-icon')[0].style.right = "150px";
                }
            }

            if (document.getElementsByClassName('navsub-right__2020')[0]) {
                document.getElementsByClassName('navsub-right__2020')[0].classList.add("pushcurrency");
                document.getElementsByClassName('navsub-right__2020')[0].setAttribute("style", "margin-right: 275px !important");
            }




            var img = document.createElement('img');
            img.width = "60";
            img.height = "60";
            img.id = activepet + 'petpet';


            petpetimg = localStorage.getItem(img.id);


            img.src = "https://lel.wtf/petpet/" + petpetimg.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');


            var glowstr = 3;
            img.setAttribute("style", "position:absolute;left:0px;bottom:-10px;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);")

if (document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0]){
            document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0].appendChild(img);
}


            var img = document.createElement('img');
            img.width = "30";
            img.height = "30";
            img.id = activepet + 'petpetpet';


            petpetpetimg = localStorage.getItem(img.id);


            img.src = "https://lel.wtf/petpet/" + petpetpetimg.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');


            var glowstr = 2;
            img.setAttribute("style", "position:absolute;left:55px;bottom:-10px;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);")

if (document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0]){
            document.getElementsByClassName('nav-profile-pet-box-lg__2020')[0].appendChild(img);
}



                if(document.getElementsByClassName('nav-profile-pet-lg__2020')[0]){

            document.getElementsByClassName('nav-profile-pet-lg__2020')[0].style.backgroundImage = localStorage.getItem(activepet + "img");
                }

            document.getElementById('navprofiledropdown__2020').setAttribute("style", "display: block !important");
            document.getElementById('navprofiledropdown__2020').classList.remove('nav-dropdown__2020');
            document.getElementById('navdropdownshade__2020').setAttribute("style", "z-index: -999; visibility: hidden; display:none");

 }

            if (document.getElementsByClassName('hp-carousel-container')[0]) {
                document.getElementsByClassName('hp-carousel-container')[0].style.width = "80%";
                document.getElementsByClassName('hp-carousel-container')[0].style.left = "150px";
            }




        }





    }


    if (document.location.toString().startsWith("https://www.neopets.com/mall/dyeworks/")){
         var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
            .content{
            left: -55px !important;
            position: absolute !important;
            }
            #main{
            height:1300px !important;

            }
            #shopMiddle{
padding-top: 20px;
}
            `;
        document.getElementsByTagName('head')[0].appendChild(style);
        }




        if (document.location.toString().startsWith("https://www.neopets.com/petpetlab.phtml")){
         var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
       #content table{
display: block !important;
}

#content td{
display: inline-block !important;
height:175px;
margin: 5px;
}
            `;
        document.getElementsByTagName('head')[0].appendChild(style);
        }




}

})();