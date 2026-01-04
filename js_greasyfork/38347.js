// ==UserScript==
// @name         HentaiHeroes Automation - Away Mode
// @namespace    FairUnknown's HentaiHeroes
// @version      0.5.2
// @description  Automatically collects from harem, fights bosses (which one set via variable), fights other players, and advances quest (no entering quest yet). Away Mode also regularly advances quests, if possible.
// @author       FairUnknown
// @match        https://www.hentaiheroes.com/*
// @exclude      https://www.hentaiheroes.com/pachinko.html*
// @exclude      https://www.hentaiheroes.com/activities.html*
// @exclude      https://www.hentaiheroes.com/tower-of-fame.html*
// @exclude      https://www.hentaiheroes.com/shop.html*
// @exclude      https://www.hentaiheroes.com/hero/*
// @exclude      https://www.hentaiheroes.com/login.html*
// @exclude      https://www.hentaiheroes.com/quest*

// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/38347/HentaiHeroes%20Automation%20-%20Away%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/38347/HentaiHeroes%20Automation%20-%20Away%20Mode.meta.js
// ==/UserScript==


(
    function() {

        const troll_id = '8'; //sets boss to fight
        //const troll_id = '1';
        //const troll_id = '2';
        //const troll_id = '3';
        //const troll_id = '4';
        //const troll_id = '5';
        //const troll_id = '6';
        //const troll_id = '7';

        function getQueryVariable(variable) //from https://css-tricks.com/snippets/javascript/get-url-variables/
        {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(false);
        } //call with var XXX = getQueryVariable("XXX");

        function sleep (time) { //https://stackoverflow.com/a/951057
            return new Promise((resolve) => setTimeout(resolve, time));
        }  // Usage: sleep(500).then(() => { ACTIONS_TO_PERFORM });

        function auto_stuff () { //automate actions - main function of script

            if (window.location.pathname=="/home.html") {

                var playertobattle = getQueryVariable("playertobattle"); //check if go to quest set by battle.html
                var gotoarenabattle = false;
                if ( $("span[hh_title='Challenge other players in harem battles ']").find('.collect_notif').css("display")=="block" ) { gotoarenabattle = true; }
                if ( playertobattle != false ) { gotoarenabattle = true; }

                //gotoarenabattle = true;

                if( gotoarenabattle ) { //if collect_notif visible or battled another player --> battling in arena possible
                    var newlocation;
                    if (playertobattle==false) { newlocation = 'https://www.hentaiheroes.com/battle.html?id_arena=0'; }
                    else { newlocation = 'https://www.hentaiheroes.com/battle.html?id_arena='+playertobattle; }

                    sleep(200).then(() => { location.assign(newlocation);  }); //go to battle other player
                    //console.log(newlocation);
                }


                var checkquest = getQueryVariable("checkquest"); //check if go to quest set by battle.html
                checkquest = false;

                if (checkquest) { //click the continue quest button after a short pause if you are instructed to go to quests
                    sleep(500).then(() => { $("#homepage > a.round_blue_button.continue_quest_home")[0].click(); } );
                }

                if($("div #collect_all_container").find('div#collect_all_bar').css("display")=="none") //if collect-all-loading-bar not visible (then collecting possible)
                { sleep(1000).then(() => {$("div.canvas a[rel='harem']")[0].click();  } ); } //go to harems.html after a pause of 1000 (shorter intereferes with stuff)

                var energy_fight = parseInt ( $('div[type="energy_fight"] span[hero="energy_fight"]')["0"].textContent );
                if (energy_fight > 1) { //if energy is large enough go to a fight
                    sleep(1500).then(() => { location.assign('https://www.hentaiheroes.com/battle.html?id_troll='+troll_id); });
                }
            }

            if (window.location.pathname=="/harem/1") {
                var hasclicked =  $("div[class='salary ']").find("button").length; //find how many buttons you can click
                sleep(500).then(() => { $("div[class='salary ']").find("button").click(); }); //click them all after a while
                if (hasclicked > 0) { sleep(1000).then(() => { $("div#breadcrumbs a[class='back']")[0].click();}); } //go back after waiting a while
                sleep(5000).then(() => { location.assign('https://www.hentaiheroes.com/home.html'); }); //backup of going back after 5 seconds
            }

            if (window.location.pathname=="/arena.html") {
                //sleep(200).then(() => { $("div[href|='/battle.html?id_arena=0']").find("button[class='sub_block blue_text_button']").click(); }); //click first button to fight
                sleep(200).then(() => { $(" #arena > div.base_block.opponents_arena > div:nth-child(2) > button").click(); }); //click first button to fight
                sleep(1000).then(() => { location.assign('https://www.hentaiheroes.com/home.html?checkquest=1'); }); //go back if nothing happens
            }


            if (window.location.pathname=="/battle.html") {
                var energy_now = parseInt ( $('div[type="energy_fight"] span[hero="energy_fight"]')["0"].textContent ); //get energy (now = current, cost = what you need)
                var energy_cost = parseInt ( $('div#battle_middle button').attr('price') );
                var istroll = getQueryVariable("id_troll"); //get if currently fighting troll
                var isarena = getQueryVariable("id_arena");

                if(isarena) {
                    var nextlocation = '';
                    if (parseInt(isarena) < 2) { nextlocation = 'https://www.hentaiheroes.com/home.html?playertobattle='+ (parseInt(isarena)+1); }
                    else { nextlocation = 'https://www.hentaiheroes.com/home.html'; }
                    //console.log(nextlocation);

                    $("div#battle_middle").find("button[rel='launch']").click(); //launch battle
                    sleep(500).then(() => { $("div#battle_middle").find("button[rel='skip']").click(); }); //wait a little, then click skip
                    sleep(1000).then(() => { location.assign(nextlocation); }); //wait a little, then click skip
                }

                if (istroll) { //fight troll automatically
                    if ( energy_now >= energy_cost ) { //if you have enough energy
                        $("div#battle_middle").find("button[rel='launch']").click(); //launch battle
                        sleep(500).then(() => { $("div#battle_middle").find("button[rel='skip']").click(); }); //wait a little, then click skip
                        //sleep(500).then(() => { $("div#battle_end").find("button").click(); }); //wait a little, then click all ok-buttons (win or loss) --> WORKS, but goes to /world/troll_id
                        sleep(1000).then(() => { location.assign('https://www.hentaiheroes.com/home.html?checkquest=1'); }); //go back after short pause, set checkquest to 1 to go to quests afterward
                    } else { location.assign('https://www.hentaiheroes.com/home.html?checkquest=1'); } //skip and go back directly
                }
            }

            if ( window.location.pathname.includes('quest/') ) {

                sleep(2000).then(() => { //give site time to load

                    var en_now = parseInt ( $('div[type="energy_quest"] span[hero="energy_quest"]')["0"].textContent ); //first get current energy and currency, and required energy and currency
                    var curr_now = parseInt ( $('div[class="currency"] div[hero="soft_currency"] span')["0"].textContent.replace(",","") ); //you have to strip the commas from the currency

                    var en_req = parseInt ( $('div[class="cost"] span[cur="*"]')["0"].textContent );
                    var curr_req = parseInt ( $('div[class="cost"] span[cur="$"]')["0"].textContent.replace(",","") );

                    if ( (en_now >= en_req) && (curr_now >= curr_req) ) { //if you have enough stuff to advance the quest
                        $("div#controls").find("button[rel='next']").click(); //find the next button and click it (there are many, but only one is displayed)
                    }
                    else { //still have to check if the free button is displayed
                        if ( $("div#controls").find("button[act='free']").css("display")=="inline-block")
                        { $("div#controls").find("button[act='free']").click(); }//click free button
                        else { $("#breadcrumbs > a:nth-child(1)")[0].click(); } //if you could perform no action go back to town
                    }

                    sleep(30000).then(() => { $("#breadcrumbs > a:nth-child(1)")[0].click(); }); //go to town after actions (or you might end up stuck in quest and miss the rest of the automation)
                });
            }

        }

        function myloop () { //loop automation
            auto_stuff();
            if ( window.location.pathname.includes('quest/') ) { setTimeout(myloop, 3000); } //loop on quest just as fast - compare main script
            else { setTimeout(myloop, 1000); } //everywhere else call yourself again after a wait of 1 seconds
        }

        myloop(); //try to initialize looping


        if ( ( ( $("h1").length > 0 ) && ( $("h1")[0].innerHTML == "Not Found") ) || $("#main-frame-error").length > 0 || ( ( $("h1").length > 0 ) && ( $("h1")[0].innerHTML == "503 Service Unavailable") ) ) {
            //sleep(1000).then(() => { location.reload(); }); //if there is a h1 that says not found or a main-frame-error, wait, then reload page
            sleep(1000).then(() => { var w2 = window.open('https://www.hentaiheroes.com/home.html');
                                    window.open('', '_self').close(); }); //open new window if current one crashes, try to close current window
        }

    }()
);