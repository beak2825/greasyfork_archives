// ==UserScript==
// @name         Neopets Theme Overhaul
// @namespace    http://lel.wtf
// @license      GNU GPLv3
// @version      1.40.3
// @description  Extends Neopets theme. For use with The Unofficial Neopets Patch.
// @author       You
// @match        https://www.neopets.com/*
// @match        https://www.neopets.com/inventory.phtml
// @match        https://www.neopets.com/market.phtml?type=your
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/482142/Neopets%20Theme%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/482142/Neopets%20Theme%20Overhaul.meta.js
// ==/UserScript==

(function() {


    if (document.location != "https://www.neopets.com/games/classic.phtml" && !document.location.toString().startsWith("https://www.neopets.com/neomail_block_check.phtml") && !document.location.toString().startsWith("https://www.neopets.com/notice_iframe.phtml") && !document.location.toString().startsWith("https://www.neopets.com/neoboards/")) {







            var style = document.createElement('style');
            style.type = 'text/css';
            if (document.location != "https://www.neopets.com/ntimes/") {
                style.innerHTML = "";
                style.innerHTML += `
.errormessage b {color: black !important;}
#content, table, tbody, tr, td, p, b{color:` + localStorage.getItem("textcolor") + ` !important}
#shopMiddle, .tab, #tabNext, #tabPrevious, #shopFooter, #rolloverTopLeft, #rolloverTopMiddle, #rolloverTopRight, #rolloverLeftMiddle, #rolloverRightMiddle, #rolloverBottomMiddle, #rolloverBottomRight, #rolloverBottomLeft{

background: transparent !important;
}

.tab, #tabs:has(#tab1)  {
border: 1px solid `+localStorage.getItem("textcolor")+`
}

.tabSelected {
border: 1px solid `+localStorage.getItem("textcolor")+`;
color: rgb(`+localStorage.getItem("gradient").split('rgb(')[1].split(')')[0]+`) !important;
background: `+localStorage.getItem("textcolor")+` !important;
}

#rolloverContent, #rollover{
background-color: transparent !important;
    background: `+ localStorage.getItem("gradient") +` !important;

}

#rollover{
border-radius: 25px;
border: 1px solid `+localStorage.getItem("textcolor")+`;
}`;
            }


            style.innerHTML +=
                `#main {border-left: 0px !important; border-right: 0px !important; color:` + localStorage.getItem("textcolor") +` !important;
background-color: transparent !important;text-align: center;vertical-align: top;margin: 0 auto;
background: ` + localStorage.getItem('gradient') + ` !important}`;
            document.getElementsByTagName('head')[0].appendChild(style);









        if (document.getElementsByClassName('randomEvent').length > 0) {

            document.getElementsByClassName('randomEvent')[0].setAttribute("style", "display: block; color: black !important ;background-color: transparent !important;");
        }

        if (document.getElementsByClassName('shh_prem_frame').length > 0) {

            document.getElementsByClassName('shh_prem_frame')[0].setAttribute("style", "display: block; color: black !important; background-color: transparent !important;");
        }



        if (document.location == "https://www.neopets.com/halloween/gravedanger/index.phtml") {
            var styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode("#gdAdventure{color: black !important; }#gdArt {position: relative;width: 100%;height: 0;background-color: transparent !important;margin: 10px auto;background-repeat: no-repeat;background-position: center;padding-top: 33.3%;background-size: contain;}"));
            document.getElementsByTagName("head")[0].appendChild(styleElement);
        }

        if (document.getElementsByClassName('nav-profile-dropdown__2020')[0] && !document.getElementById('oldnew')) {

            var textcolor = getComputedStyle(document.getElementsByClassName('nav-profile-dropdown__2020')[0].getElementsByTagName('ul')[0].getElementsByTagName('a')[0])["color"];
            localStorage.setItem("textcolor", textcolor);

            var gradient = getComputedStyle(document.getElementsByClassName('nav-profile-dropdown__2020')[0])["background"];

            if (gradient.includes('gradient')){


            var gradone = gradient.split('rgb')[1].split('(')[1].split(')')[0];
                 if (gradient.split('rgb')[2]) {
            var gradtwo = gradient.split('rgb')[2].split('(')[1].split(')')[0];
                 }
            if (gradient.split('rgb')[3]) {

                var gradone = gradient.split('rgb')[3].split('(')[1].split(')')[0];
            }
            localStorage.setItem("gradient", gradient);

        }
            else{
                gradone = gradient.split('rgb')[1].split('(')[1].split(')')[0];
                 gradtwo = gradient.split('rgb')[1].split('(')[1].split(')')[0];
            }
    }





        else if (document.getElementById('oldnew')) {
            var gradient = localStorage.getItem("gradient");
            var textcolor = localStorage.getItem("textcolor");
if (gradient.includes('gradient')){

            var gradone = gradient.split('rgb')[1].split('(')[1].split(')')[0];
     if (gradient.split('rgb')[32]) {
            var gradtwo = gradient.split('rgb')[2].split('(')[1].split(')')[0];
     }
            if (gradient.split('rgb')[3]) {

                var gradone = gradient.split('rgb')[3].split('(')[1].split(')')[0];
            }
        }
            else{
                gradone = gradient.split('rgb')[1].split('(')[1].split(')')[0];
                 gradtwo = gradient.split('rgb')[1].split('(')[1].split(')')[0];
            }

}



        if (!document.location.toString().startsWith('https://www.neopets.com/neoboards/')) {
            if (document.location != "https://www.neopets.com/home/" && document.location != "https://www.neopets.com/home/index.phtml" && document.location != "https://www.neopets.com/bank.phtml" && document.getElementsByClassName('container')[0]) {
                document.getElementsByClassName('container')[0].setAttribute("style", "color:" + localStorage.getItem("textcolor") +" !important; background: " + gradient + " !important");
            }
        }


        var modules = document.getElementsByClassName('contentModuleTable');



        for (let i = 0; i < modules.length; i++) {
            modules[i].setAttribute("style", "color:" + localStorage.getItem("textcolor") +" !important;");
        }



        if (document.location.toString().startsWith('https://www.neopets.com/auctions.phtml') ||
            document.location.toString().startsWith('https://www.neopets.com/safetydeposit.phtml') ||
            document.location.toString().startsWith('https://www.neopets.com/quickstock.phtml') ||
            document.location.toString().startsWith('https://www.neopets.com/island/tradingpost.phtml') ||
            document.location.toString().startsWith('https://www.neopets.com/pirates/foodclub.phtml') ||
            document.location.toString().startsWith('https://www.neopets.com/market.phtml?type=your')



        ) {



            var styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(`

        .content table{
        background-color: transparent !important;
        }
        .content td{
        border: 1px solid ` + localStorage.getItem("textcolor") +`;
        }`));
            document.getElementsByTagName("head")[0].appendChild(styleElement);

        }





            if (document.location.toString().startsWith('https://www.neopets.com/dome/')) {


                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `





.gQ_sprite p, #gQ_sprite, #bdHome, #bdFightStepContainer{
color: black !important;
}


#stepIcon1Container, #stepIcon2Container, #stepIcon3Container, #stepIcon4Container {

background: transparent !important;
}

#fightStepIcons div.container {
    width: 0px !important;

}


#bdFight {
    background: white;

    }





.borderExpansion, .npcContainer, .npcHeader, #bd_rewards, .bdPopupGeneric.contents {
background: rgba(0, 0, 0, 0) linear-gradient(rgb(7, 5, 23) 0%, rgb(9, 6, 30) 40%, rgb(76, 14, 50) 100%) repeat scroll 0% 0% / auto padding-box border-box !important;
}

`;


                document.getElementsByTagName('head')[0].appendChild(style);


            }




        var styleElement = document.createElement("style");
        styleElement.appendChild(document.createTextNode(`.nf-newsfeed-content, .nf-newsfeed-container, .nf-newsfeed-week {color: black !important;}
        mark {visibility: hidden !important}
.wizard-results-grid{
color:black !important;
}

      div.errorOuter {
    top: 90px;
    width: 60% !important;
    margin: auto auto 6px auto;
    text-align: left;
    border: 2px solid red;
    position: relative;
}
.donated .np, .donated .nc{
   border: 0px !important;
}




#search_for, .shop-grid a, .invTabs h3, .inv-menulinks a, #invItemDesc, .settings-label, .input-desc, .settings-nav a.menu-link, .settings-header h2, .settings-accordion .settings-subheader h3, .settings-subheader.group-subheader h3, .settings-ro, input.settings-textbox:read-only, .panel-link, .settings-subheader h3, .settings-desc, .input-desc {
color: ` + localStorage.getItem("textcolor") +` !important;
}

.bgImage {
    background-color: white;
}
        .nh_top_bkg, .nh_mid_bkg, .nh_content_module  p, .nh_content_module  b, #bob_middle, #gdReward{

        color:black !important;
        }
        .shh_prem_frame {
    right: 3px;
    position: relative;
    bottom: 20px;
    width: 840px;
    height: 150px;
    background: transparent url(https://lel.wtf/petpet/shh/txt/shh-premium.png) no-repeat left top;
}

#shh_prem_bg {
    width: 790px !important;
    height: 110px !important;
    background-color: white;
    position: relative;
}

.shh_prem_frame, .recipe {
    color: black !important;
}
        .shop-item .item-img {border: 0px !important}

 .settings-accordion .settings-subheader {background-color: transparent !important;}
#bxwrap, .bx-wrapper, .background-tikitours2 {
    background-color: transparent !important;
    background: transparent !important;
    border: 0px !important;
}

tr {
background-color: transparent !important;
}

.content{

    border-radius: 10px;

    }
        .popup-header__2020, .popup-footer__2020, .settings-accordion .settings-subheader, .settings-subheader h3, .petCare-petpet h3, .petCare-descGrid h3, .settings-subheader.group-subheader, td,  h2{
        background: transparent !important; background: rgba(0, 0, 0, 0) linear-gradient(360deg, rgb(` + gradtwo + `) 0%, rgb(` + gradone + `) 64%) repeat scroll 0% 0% / auto padding-box border-box !important; }



#dailies-container, #snapshot-container, #snapshot-container th, .featureddrop {
  background: ` + localStorage.getItem("gradient") +` !important;
      border-radius: 25px;
    border: 2px solid ` + localStorage.getItem("textcolor") + `
}
.inner-content{
background: transparent !important;
   color: ` + localStorage.getItem("textcolor") + ` !important;
}

#ssw-tabs {
    overflow: hidden !important;
    }
    #ssw_tabs_pane {
    color: ` + localStorage.getItem("textcolor") + ` !important;
    }
#outer-container{
  background: ` + localStorage.getItem("gradient") +` !important;
    border-radius: 25px;
    border: 2px solid ` + localStorage.getItem("textcolor") + `
}
 #ssw-tabs-1, #ssw-tabs-2{
 background: ` + localStorage.getItem("gradient") +` !important;
 padding: 5px !important;
}

.mod-header-left, .mod-header-right, .mod-content, .mod-c1, .mod-c2, .mod-c3, #ssw_tabs_pane, .mod-footer-left, .mod-footer-right{
background: transparent !important;
background-color: transparent !important;
}

      #table-container td{

background: transparent !important;
}
        .petCare-stats, .settings-nav ul li:hover,.settings-nav a.menu-link.active {background-color: transparent !important; background: rgba(0, 0, 0, 0) linear-gradient(360deg, rgb(` + gradtwo + `) 0%, rgb(` + gradone + `) 64%) repeat scroll 0% 0% / auto padding-box border-box !important }`));
        document.getElementsByTagName("head")[0].appendChild(styleElement);




        if (document.location.toString().startsWith('https://www.neopets.com/pl_preview.phtml') || document.location.toString().startsWith('https://www.neopets.com/petlookup.phtml')) {

            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `

#main{

background: transparent !important;
}



`;


            document.getElementsByTagName('head')[0].appendChild(style);



        }




        if (document.location.toString().startsWith("https://www.neopets.com/objects.phtml")) {
            document.getElementsByClassName('theme-bg')[0].style.color =  localStorage.getItem("textcolor");

            document.getElementsByTagName('h2')[0].setAttribute("style", "background: " + gradient + " !important");




            function processItems() {
                var items = document.getElementsByClassName('item-img');


                for (let i = 0; i < items.length; i++) {



                    var style = items[i].currentStyle || window.getComputedStyle(items[i], false);
                    var url = style.backgroundImage.slice(4, -1).replace(/"/g, "");

                    var glowstr = 4;

                    if (url.startsWith("https://lel.wtf")) {} else {

                        items[i].setAttribute("style", "border:0px !important; background-image: url('https://lel.wtf/petpet/" + url.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '') + "') !important; -webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");
                    }




                }

            }

            setInterval(processItems, 200);

        }




        if (document.location.toString().startsWith("https://www.neopets.com/inventory.phtml")) {

            document.getElementsByClassName('inv-items')[0].setAttribute("style", "background: rgba(0, 0, 0, 0) linear-gradient(360deg, rgb(" + gradtwo + ") 0%, rgb(" + gradone + ") 64%) repeat scroll 0% 0% / auto padding-box border-box !important");
            document.getElementsByClassName('inv-items')[0].style.color = localStorage.getItem("textcolor");

            var styleElement = document.createElement("style");
            styleElement.appendChild(document.createTextNode(".inv-tabs-container::-webkit-scrollbar-track { background: transparent !important;} .inv-tabs-container::-webkit-scrollbar-thumb:hover {background: transparent !important;} ul.invTabs li.invTab-selected, .invTabsCarousel .invTab-selected {background-color: transparent !important;}"));
            document.getElementsByTagName("head")[0].appendChild(styleElement);

            document.getElementsByClassName('inv-tabs-container')[0].setAttribute("style", "background-color: transparent !important; background: " + gradient + " !important");
            document.getElementsByClassName('inv-menulinks')[0].setAttribute("style", "background: " + gradient + " !important");

        }




        function popupColor() {
            if (document.getElementsByClassName('nav-profile-dropdown__2020')[0] && !document.getElementById('oldnew')) {

                var gradient = getComputedStyle(document.getElementsByClassName('nav-profile-dropdown__2020')[0])["background"];
                localStorage.setItem("gradient", gradient);


                if (gradient.includes('gradient')){











                var gradone = gradient.split('rgb')[2].split('(')[1].split(')')[0];
                    if (gradient.split('rgb')[3]) {
                var gradtwo = gradient.split('rgb')[3].split('(')[1].split(')')[0];
                    }
                if (gradient.split('rgb')[4]) {

                    var gradone = gradient.split('rgb')[4].split('(')[1].split(')')[0];
                }

                            }
            else{
                gradone = gradient.split('rgb')[1].split('(')[1].split(')')[0];
                 gradtwo = gradient.split('rgb')[1].split('(')[1].split(')')[0];
            }


            }
            if (document.getElementById('oldnew')) {
                var gradient = localStorage.getItem("gradient");



            }



            var pops = document.getElementsByClassName('popup-body__2020');
            for (let i = 0; i < pops.length; i++) {
                if (!pops[i].closest('#wheelbox')) {
                    pops[i].setAttribute("style", "background: " + gradient + " !important");
                }
                pops[i].style.color = localStorage.getItem("textcolor");


            }




            var stats = document.getElementsByClassName('inv-itemStat');
            for (let i = 0; i < stats.length; i++) {
                stats[i].setAttribute("style", "background: rgba(0, 0, 0, 0) linear-gradient(360deg, rgb(" + gradtwo + ") 0%, rgb(" + gradone + ") 64%) repeat scroll 0% 0% / auto padding-box border-box !important");


            }




        }




        function processpopitems() {

            var glowstr = 4;
            const elements = document.getElementsByClassName('popup-body__2020');


            for (let i = 0; i < elements.length; i++) {

                const imgs = elements[i].getElementsByTagName('img');

                for (let j = 0; j < imgs.length; j++) {
                    if (!imgs[j].closest('#wheelbox')) {
                        if (imgs[j].src.startsWith("https://lel.wtf") || imgs[j].src.startsWith("https://pets.neopets.com/")) {} else {
                            imgs[j].src = "https://lel.wtf/petpet/" + imgs[j].src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');

                        }
                    }
                    imgs[j].setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

                }
            }


        }




        function processinvitems() {

            var glowstr = 4;
            itemprev = document.getElementById('invItemImg');
            var style = itemprev.currentStyle || window.getComputedStyle(itemprev, false);
            var prevurl = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            if (prevurl.startsWith("https://lel.wtf")) {} else {
                document.getElementById('invItemImg').setAttribute("style", "background-image: url('https://lel.wtf/petpet/" + prevurl.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '') + "') !important; -webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");
            }

            var counts = document.getElementsByClassName('inv-total-count');
            for (let i = 0; i < counts.length; i++) {
                counts[i].setAttribute("style", "background: " + gradient + " !important");
                counts[i].style.color = localStorage.getItem("textcolor");
            }

        }




        function processboxitems() {



            var form = document.getElementsByTagName('table')[6];




            var images = form.getElementsByTagName('img');


            for (var i = 0; i < images.length; i++) {

                if (images[i].src.startsWith("https://lel.wtf")) {} else if (!images[i].closest('.search-helper')) {
                    images[i].src = 'https://lel.wtf/petpet/' + images[i].src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
                    var glowstr = 4;
                    images[i].setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

                }
            }




        }




        function processshopitems() {
var glowstr = 4;
            var shop = document.getElementsByClassName('content')[0];


let links = shop.getElementsByTagName('a');


for (let link of links) {

    let images = link.getElementsByTagName('img');


    for (let img of images) {

        if (img.src.startsWith('https://images.neopets.com/items/')) {

             img.src = "https://lel.wtf/petpet/" + img.src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');

                img.setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

        }
    }
}

        }



        function processmyshopitems() {


 var form = document.getElementsByTagName('table')[5];




            var images = form.getElementsByTagName('img');


            for (var i = 0; i < images.length; i++) {


                if (images[i].src.startsWith("https://lel.wtf")) {} else if (!images[i].closest('.search-helper')) {

                    images[i].src = 'https://lel.wtf/petpet/' + images[i].src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
                    var glowstr = 4;
                    images[i].setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

                }
            }

        }


        function processlabitems() {


 var form = document.getElementsByTagName('table')[3];




            var images = form.getElementsByTagName('img');


            for (var i = 0; i < images.length; i++) {


                if (images[i].src.startsWith("https://lel.wtf")) {} else if (!images[i].closest('.search-helper')) {

                    images[i].src = 'https://lel.wtf/petpet/' + images[i].src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
                    var glowstr = 4;
                    images[i].setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

                }
            }

        }

        function processdyeitems() {


 var form = document.getElementById('shopMiddle');




            var images = form.getElementsByTagName('img');


            for (var i = 0; i < images.length; i++) {


                if (images[i].src.startsWith("https://lel.wtf")) {} else if (!images[i].closest('.search-helper')) {

                    images[i].src = 'https://lel.wtf/petpet/' + images[i].src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
                    var glowstr = 4;
                    images[i].setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

                }
            }

        }



        function processlistitems() {

            var glowstr = 4;

            var items = document.getElementsByClassName('item-img');


            for (let i = 0; i < items.length; i++) {


                var style = items[i].currentStyle || window.getComputedStyle(items[i], false);
                var url = style.backgroundImage.slice(4, -1).replace(/"/g, "");

                if (url.startsWith("https://lel.wtf")) {} else {

                    items[i].setAttribute("style", "background-image: url('https://lel.wtf/petpet/" + url.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '') + "') !important; -webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");
                }




            }




            var items = document.getElementsByClassName('item');


            for (let j = 0; j < items.length; j++) {
                if (items[j].src.startsWith("https://lel.wtf") || items[j].src.startsWith("https://pets.neopets.com/")) {} else {
                    items[j].src = "https://lel.wtf/petpet/" + items[j].src.replace('https://images.neopets.com/', '').replace('http://images.neopets.com/', '').replace('//images.neopets.com/', '');
                }
                items[j].setAttribute("style", "border:0px !important;-webkit-filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);filter: drop-shadow(1px 1px " + glowstr + "px white) drop-shadow(-1px -1px " + glowstr + "px white) drop-shadow(1px -1px " + glowstr + "px white) drop-shadow(-1px 1px " + glowstr + "px white);");

            }




        }




        setInterval(processlistitems, 50);
        if (document.location.toString().startsWith("https://www.neopets.com/inventory.phtml") ){
            setInterval(processinvitems, 50);
        }
         if (document.location.toString().startsWith("https://www.neopets.com/petpetlab.phtml") ){
            setInterval(processlabitems, 50);
        }
        if (document.location.toString().startsWith("https://www.neopets.com/mall/dyeworks/") ){
            setInterval(processdyeitems, 50);
        }


  if (document.location.toString().startsWith("https://www.neopets.com/browseshop.phtml") ){
            setInterval(processshopitems, 50);
        }
          if (document.location.toString().startsWith("https://www.neopets.com/market.phtml?type=your") ){
            setInterval(processmyshopitems, 50);
        }

        if (document.location.toString().startsWith("https://www.neopets.com/safetydeposit.phtml")) {
            setInterval(processboxitems, 50);
        }
        setInterval(processpopitems, 50);
        setInterval(popupColor, 50);
    }

})();