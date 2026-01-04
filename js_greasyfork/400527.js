// ==UserScript==
// @name         BlissDTMScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a script for Down Town Mafia DTM
// @author mrbliss1
// @license MIT
// @match        ...
// @grant        none
// @include https://play.dtmafia.mobi/?_al=0
// @include https://play.dtmafia.mobi/*
// @include https://play.dtmafia.mobi
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/400527/BlissDTMScript.user.js
// @updateURL https://update.greasyfork.org/scripts/400527/BlissDTMScript.meta.js
// ==/UserScript==

//console.log('DTM Bliss Loaded - Tampermonkey ease of life');

var txtTitle = "";
var txtMessage = "";

(window.setInterval(function() {
    'use strict';
    //Weird Shit
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    txtTitle = time + "  /  " + date;
    //buy menu modifications - for reference has_count sellable_item are classes for items if a check is ever needed
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        if(typeof all[i] == 'undefined'){
            //dirty fix I know I am lazy
            //this fixes me removing elements and the all[i] element now being empty
            //I could remove it from the array and use an event but meh why? a few extra ms of response time? if not a fps game
            //but one day I will fix all this rubbish
        } else if(all[i].classList.contains('BuyOptions')){ // so it only effects the buy options
            all[i].classList.add('x-dock-body');
            var childDivs = document.getElementById(all[i].id).getElementsByTagName("*");
            for(var i2=0, max2=childDivs.length; i2 < max2; i2++)
            {
                //Makes the buy menu input box editable by typing into the box
                childDivs[i2].classList.add('x-item-enabled');
                childDivs[i2].classList.remove('x-item-disabled');
                childDivs[i2].disabled = false;
            }
        } else if(all[i].classList.contains('FeedPostMessage')){ //Someones profile post box found on page
            var messageDivs = document.getElementById(all[i].id).getElementsByTagName("*");
            for(var i3=0, max3=messageDivs.length; i3 < max3; i3++)
            {
                if(messageDivs[i3].tagName && messageDivs[i3].tagName.toLowerCase() == "textarea") {
                    //messageDivs[i3].value = txtMessage; set message box value for something maybe later?
                }
            }
        } else if (all[i].classList.contains('PanelsContainer') & all[i].classList.contains('x-unsized') & all[i].classList.contains('x-container')){
            console.log(!!document.getElementById(all[i].id).getElementsByClassName("SaleBannerHome")[0]);
            if (!!document.getElementById(all[i].id).getElementsByClassName("SaleBannerHome")[0]){
                all[i].style.display = 'none'; //DO NOT ADVERTISE TO ME - hides the annoying huge box telling me about the AMAZING new event mercs every month or so
                document.getElementById(all[i].id).getElementsByClassName("SaleBannerHome")[0].parentNode.removeChild(document.getElementById(all[i].id).getElementsByClassName("SaleBannerHome")[0]); //remove the node cause I dont wanna see that shit again makes the last line pointless shoot me?
            } else {
                all[i].style.display = 'block';
            }
        } else if (all[i].classList.contains('BtnGotoMarket')){
            //android market button
            //lets replace this with a link to a real code shareing site
            all[i].href = "https://www.fcswap.com/game/downtown-mafia/"
            all[i].innerHTML = "FCSwap - DTM Codes";
            all[i].id = "lol nope";
            all[i].target = "_blank";
        } else if (all[i].classList.contains('BtnGotoAppstore')){
            //apple market button
            //lets laso replace this - who wants an app store on pc?
            all[i].href = "https://dtm4u.com/codes.html"
            all[i].innerHTML = "DTM4U - DTM Codes";
            all[i].id = "lol nope";
            all[i].target = "_blank";
        } else if (all[i].classList.contains('BtnGotofacebook')){
            //facebook lets keep this
            all[i].innerHTML = "Facebook - Promos/Codes/More";
        } else if (all[i].classList.contains('BtnGotostean')){ //who tf spelt this wrong?
            //STEAM - maybe?
            all[i].innerHTML = "Steam Page";
        } else if(all[i].classList.contains('TopUserStats')){ //Someones profile post box found on page
            var topBarDivs = document.getElementById(all[i].id).getElementsByTagName("*");
            for(var i4=0, max4=topBarDivs.length; i4 < max4; i4++)
            {
                //Topbar code here
                if(topBarDivs[i4].classList.contains('FirstRow')){
                    //top row
                    var topnDivs = document.getElementById(topBarDivs[i4].id).getElementsByTagName("*");
                    for(var i6=0, max6=topnDivs.length; i6 < max5; i6++)
                    {
                        if(topnDivs[i6].classList.contains('NotificationButton')){
                            //notification button has 1 contained div between <a> tags with the number of notifications contained between the <div> tags (inner html)
                        } else if(topnDivs[i6].classList.contains('coins_box')){
                            //contains 2 <divs with inner html - main text has the current money - subtext has the income and time
                        } else if(topnDivs[i6].classList.contains('StaminaBar')){
                            //contains 2 <divs>
                        } else if(topnDivs[i6].classList.contains('EnergyBar')){
                            //contains 2 <divs>
                        } else if(topnDivs[i6].classList.contains('HealthBar')){
                            //contains 2 <divs>
                        } else if(topnDivs[i6].classList.contains('XpBox')){
                            //contains 2 <divs>
                        } else if(topnDivs[i6].classList.contains('SpCoinsBar')){
                            //contains 2 <divs>
                        } else if(topnDivs[i6].classList.contains('LevelBox')){
                            //contains 2 <divs>
                        }
                    }
                } else if(topBarDivs[i4].classList.contains('ThirdRow')){
                    //page title
                    var titleDivs = document.getElementById(topBarDivs[i4].id).getElementsByTagName("*");
                    for(var i5=0, max5=titleDivs.length; i5 < max5; i5++)
                    {
                        if(titleDivs[i5].classList.contains('label')){
                            titleDivs[i5].innerHTML = txtTitle;
                        }
                    }
                }
            }
        }
    }
    //
    //
}, 1000));