// ==UserScript==
// @name         BGA-Tichu
// @namespace    https://gameandme.fr/
// @version      2.6
// @description  Améliore l'UX du Tichu et de la dame de pique sur BoardGameArena : affiche les options des parties et le niveau des joueurs directement dans le lobby,  permet de passer avec un clic droit, et affiche (au besoin) un récap des cartes jouées .
// @author       Yohann Nizon
// @match        https://boardgamearena.com/*
// @icon         https://x.boardgamearena.net/data/gamemedia/tichu/box/en_180.png
// @grant       GM_addElement
// @grant       unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464093/BGA-Tichu.user.js
// @updateURL https://update.greasyfork.org/scripts/464093/BGA-Tichu.meta.js
// ==/UserScript==


//Try to catch givenCards for Tichu (cards ID are shuffle at each game)
/*
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.responseURL.indexOf("giveTheCards.html")>-1){
                //Get cards parameter
                let url = this.responseURL;//https://boardgamearena.com/4/tichu/tichu/giveTheCards.html?cards=47%3B44%3B22%3B&table=401736389&noerrortracking=true&dojo.preventCache=1690622744959
                //console.log(url);
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);
*/

function displayInfo(event){
    var charCode = (typeof event.which == "number") ? event.which : event.keyCode
    if (charCode == 107){
        if (document.getElementById('chkInfo')) {
            if (document.getElementById('chkInfo').checked) {
                document.getElementById('chkInfo').checked = false;
            } else {
                document.getElementById('chkInfo').checked = true;
            }
        }
    }
}

function updateGame(item)
{
    if (item.href && item.href != '') {
        let iframeInfoId = 'iframeInfo'+ item.href.substring(39,48);
        var iframeInfo;
        if (document.getElementById(iframeInfoId)){
            iframeInfo = document.getElementById(iframeInfoId);
        } else {
            iframeInfo = document.createElement('iframe');
            iframeInfo.id = iframeInfoId;
            iframeInfo.style.border = "0";
            iframeInfo.style.height = "0px";
            iframeInfo.style.width = "1000px";
            document.getElementById('pageheader_menu').appendChild(iframeInfo);
        }

        iframeInfo.onload = function() {
            let html = this.contentWindow.document.body.innerHTML;
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');

            let info = '';
            let infoGame = '';

            let options = doc.querySelectorAll('#gameoptions select');
            Array.prototype.forEach.call(options, function(option) {
                let infoOption = option.options[option.selectedIndex].text.replace('Tichu standard à 4 joueurs','').replace('Partie moyenne','').replace('Partie rapide','').replace("Selon l'ordre de la table",'').replace("24 heures par jour (pas d'horaires de jeu)",'')
                if (infoOption != '') {
                    if (infoOption != 'Par défaut' && infoOption != 'Activé' && infoOption != 'Désactivé' && infoOption != 'Oui' && infoOption != 'Non') {
                        if (infoGame != '') {
                            infoGame = infoGame + ' > ';
                        }
                        infoGame = infoGame + infoOption;
                    }
                }
            });

            if (infoGame != ''){
                item.innerHTML = infoGame+'<hr/>';
            }

            let players = document.querySelectorAll('a.playername');
            Array.prototype.forEach.call(players, function(player) {
                let idPlayer = player.href.substring(37);
                if (player.innerHTML.indexOf('<br>') == -1){
                    if (doc.getElementById('elo_details_'+idPlayer+'_bar')) {
                        player.innerHTML = player.innerHTML + '<br>🏆'+parseInt(doc.getElementById('elo_details_'+idPlayer+'_bar').innerText) ;
                        player.innerHTML = player.innerHTML + ' / ☯'+parseInt(doc.getElementById('reputationbar_'+idPlayer).innerText.replace(" ","").replace("☯","").split("%")[0]) +"%";
                    }
                }
            });

            document.getElementById(iframeInfoId).remove();
        };
        iframeInfo.src = item.href;
    }
}

function refreshGames(){
    let games = document.querySelectorAll('#favorite_expanded .game_box_wrap');
    Array.prototype.forEach.call(games, function(game) {
        let parties = game.querySelectorAll('.gametable_button_zone');
        Array.prototype.forEach.call(parties, function(item) {
            if(item.parentNode.innerText.indexOf('Créez')==-1 && item.innerText.indexOf('🔃')==-1) {
                let button = document.createElement("button");
                button.innerHTML="🔃";
                button.className = 'bgabutton bgabutton_gray';
                button.style.display = 'inline';
                button.style.border = '0';
                button.addEventListener ("click", function() {
                    updateGame(this.parentNode.parentNode.parentNode.parentNode.querySelectorAll('a.gametablelink')[0]);
                });
                item.appendChild(button);
            }

            if (item.parentNode.parentNode.parentNode.parentNode.parentNode.innerText.indexOf("Vous ne pouvez pas rejoindre") == -1){
                let link = item.parentNode.parentNode.parentNode.parentNode.querySelectorAll('a.gametablelink')[0];
                if (link && link.href && link.href != 'https://boardgamearena.com/lobby' && link.href != '' && link.parentNode.innerText.indexOf('Créez') == -1){
                    updateGame(link);
                }
            }
        });
    });
}

if(document.URL.indexOf("/lobby") >= 0){
    document.getElementById('ebd-body').innerHTML = document.getElementById('ebd-body').innerHTML+'<style>.gametable{min-height:180px} .tableplace .player_name_wrap{overflow: auto;height:45px;} .gametablelink{padding-left:45px;position:inherit;height:25px;text-decoration:none;padding-top:10px;color:#f00;}</style>';
    window.addEventListener("load", (event) => {
        refreshGames();
    });
    window.setInterval(function() {
        refreshGames();
    }, 5000);
}

let spade = '♠';
let diamond ='♦';
let club='♣';
let heart='♥';
let givenTo = '-';
let getFrom = '-';
if (document.getElementById('maingameview_menufooter')){
    if (document.querySelectorAll('#maingameview_menufooter h2').length > 0){
        if (document.querySelectorAll('#maingameview_menufooter h2')[0].innerText == "Dame de Pique" || document.querySelectorAll('#maingameview_menufooter h2')[0].innerText == "Hearts") {
            window.addEventListener('keydown', displayInfo, true);
            let oldContent = '';
            let lastLogId = 0;
            let cards = [];
            for (let k=14; k>1; k--) {
                cards.push(heart+k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"));
                cards.push(spade+k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"));
                cards.push(diamond+k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"));
                cards.push(club+k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"));
            }
            let allCards = Array.from(cards);
            let originalCards = Array.from(cards);
            localStorage.cards = JSON.stringify(cards);
            localStorage.infoGiven = '-';
            localStorage.givenTo = givenTo;
            localStorage.getFrom = getFrom;

            let pointsCheck = window.setInterval(function() {
                cards = JSON.parse(window.localStorage.getItem('cards'));

                let lastcard = document.getElementsByClassName('log')[0];
                let lastcard1 = '';
                let lastcard2 = '';
                let lastcard3 = '';
                let lastcard4 = '';
                if (document.getElementsByClassName('log')[1]){
                    lastcard1 = document.getElementsByClassName('log')[1];
                }
                if (document.getElementsByClassName('log')[2]){
                    lastcard2 = document.getElementsByClassName('log')[2];
                }
                if (document.getElementsByClassName('log')[3]){
                    lastcard3 = document.getElementsByClassName('log')[3];
                }
                if (document.getElementsByClassName('log')[4]){
                    lastcard4 = document.getElementsByClassName('log')[4];
                }

                let playersSelect = document.getElementsByClassName('playertablename');
                let players = [];
                Array.prototype.forEach.call(playersSelect, function(item) {
                    if (item.innerText.indexOf('Score :') == -1){
                        players.push(item);
                    }
                });

                let spareQueen = false;
                let diamondJake = false;
                let hearts = false;

                if (lastcard) {
                    if (lastLogId != lastcard.getAttribute("id")){
                        let lastcardmsg = lastcard.innerText;

                        if (lastcardmsg.indexOf('Vous donnez ') > -1) {
                            let position = lastcardmsg.indexOf(' à')-12;
                            let infoCards = lastcardmsg.substr(12,position).replace(",","").replace(",","").split(' ');
                            givenTo = '';
                            Array.prototype.forEach.call(infoCards, function(item) {
                                givenTo = givenTo + "<span style='";
                                if (item.indexOf(heart)>-1 || item.indexOf(diamond)>-1) {
                                    givenTo = givenTo + "color:#f00";
                                }
                                givenTo = givenTo + "'>"+item+"</span>";
                            });
                        }

                        if (lastcardmsg.indexOf('Vous recevez ') > -1) {
                            let position = lastcardmsg.indexOf(' de')-12;
                            let infoCards = lastcardmsg.substr(12,position).replace(",","").replace(",","").split(' ');
                            getFrom = '';
                            Array.prototype.forEach.call(infoCards, function(item) {
                                getFrom = getFrom + "<span style='";
                                if (item.indexOf(heart)>-1 || item.indexOf(diamond)>-1) {
                                    getFrom = getFrom + "color:#f00";
                                }
                                getFrom = getFrom + "'>"+item+"</span>";
                            });
                        }

                        lastcardmsg = lastcardmsg.replace(heart,heart+String.fromCharCode(65039)).replace(spade,spade+String.fromCharCode(65039)).replace(diamond,diamond+String.fromCharCode(65039)).replace(club,club+String.fromCharCode(65039));

                        let lastcard1msg = '';
                        if (lastcard1){
                            lastcard1msg = lastcard1.innerText;
                        }
                        let lastcard2msg = '';
                        if (lastcard2){
                            lastcard2msg = lastcard2.innerText;
                        }
                        let lastcard3msg = '';
                        if (lastcard3){
                            lastcard3msg = lastcard3.innerText;
                        }
                        let lastcard4msg = '';
                        if (lastcard4){
                            lastcard4msg = lastcard4.innerText;
                        }

                        if (lastcardmsg.indexOf('joue '+diamond+'J') > -1) {
                            diamondJake = true;
                        }
                        if (lastcardmsg.indexOf('joue '+spade+'Q') > -1) {
                            spareQueen = true;
                        }
                        if ((lastcardmsg.indexOf('joue ') > -1 && lastcardmsg.indexOf(heart) > -1)) {
                            hearts = true;
                        }

                        //MAJ des emojis
                        if (lastcardmsg.indexOf('capture le pli') > -1) {
                            let positionJoue = lastcard1msg.indexOf(' joue ');
                            let message = ' joue ';

                            if (lastcard1msg.indexOf('joue '+spade+'Q') > -1 || lastcard2msg.indexOf('joue '+spade+'Q') > -1 || lastcard3msg.indexOf('joue '+spade+'Q') > -1 || lastcard4msg.indexOf('joue '+spade+'Q') > -1) {
                                spareQueen = true;
                            }

                            if (lastcard1msg.indexOf('joue '+diamond+'J') > -1 || lastcard2msg.indexOf('joue '+diamond+'J') > -1 || lastcard3msg.indexOf('joue '+diamond+'J') > -1 || lastcard4msg.indexOf('joue '+diamond+'J') > -1) {
                                diamondJake = true;
                            }

                            if ((lastcard1msg.indexOf('joue ') > -1 && lastcard1msg.indexOf(heart) > -1) || (lastcard2msg.indexOf('joue ') > -1 && lastcard2msg.indexOf(heart) > -1) || (lastcard3msg.indexOf('joue ') > -1 && lastcard3msg.indexOf(heart) > -1) || (lastcard4msg.indexOf('joue ') > -1 && lastcard4msg.indexOf(heart) > -1)) {
                                hearts = true;
                            }

                            let lastlog = lastcard1msg.substring(positionJoue);

                            let cardRemoved = false;
                            cards.forEach((item, index) => {
                                if (cardRemoved == false && lastlog.indexOf(message+ item) > -1) {
                                    cards.splice(index, 1);
                                    cardRemoved = true;
                                }
                            })

                            let posName = lastcardmsg.indexOf(' capture le pli');
                            let namePoints = lastcardmsg.substring(0,posName);

                            Array.prototype.forEach.call(players, function(item) {
                                if (item.innerText.replace(' ❤️','').replace(' 💀','').replace(' 🏆','') == namePoints.replace(' ❤️','').replace(' 💀','').replace(' 🏆','')){
                                    if (hearts && item.innerText.indexOf('❤️') == -1) {
                                        hearts = false;
                                        item.innerText = item.innerText+' ❤️';
                                    }
                                    if (spareQueen && item.innerText.indexOf('💀') == -1) {
                                        spareQueen = false;
                                        item.innerText = item.innerText+' 💀';
                                    }
                                    if (diamondJake && item.innerText.indexOf('🏆') == -1) {
                                        diamondJake = false;
                                        item.innerText = item.innerText+' 🏆';
                                    }
                                }
                            });
                        }

                        //Fin de partie
                        let positionJoue = lastcardmsg.indexOf(' joue ');
                        let message = ' joue ';
                        if (lastcard && (lastcardmsg.indexOf('perd') > -1 || lastcardmsg.indexOf('tous les ') > -1) || lastcardmsg.indexOf('récupéré') > -1 || lastcardmsg.indexOf('nouvelle main') > -1) {
                             Array.prototype.forEach.call(players, function(item) {
                                 item.innerText = item.innerText.replace(' ❤️','').replace(' 💀','').replace(' 🏆','');
                                 spareQueen = false;
                                 diamondJake = false;
                                 hearts = false;
                                 givenTo = '-';
                                 getFrom = '-';
                             });
                            cards = originalCards;
                            oldContent = '';
                            localStorage.cards = JSON.stringify(cards);
                            localStorage.infoGiven = '-';
                         }

                        lastLogId = lastcard.getAttribute("id");
                        let lastlog = lastcardmsg.substring(positionJoue);
                        lastlog = lastlog.replace(String.fromCharCode(65039),'');

                        //On enleve la carte
                        let cardRemoved = false;
                        cards.forEach((item, index) => {
                            if (cardRemoved == false && lastlog.indexOf(message+ item) > -1) {
                                cards.splice(index, 1);
                                cardRemoved = true;
                            }
                        })
                    }
                }

                let content = '<style>#tableDDP tr:nth-child(even) {background: #DEDEDE}</style><table id="tableDDP" style="width:100%;text-align:center;background:#fff">';
                if (document.getElementById('pagemaintitletext')){
                    if (document.getElementById('pagemaintitletext').innerText.indexOf('droite') >-1){
                        localStorage.infoGiven = '➡️';
                    }
                    if (document.getElementById('pagemaintitletext').innerText.indexOf('gauche') >-1){
                        localStorage.infoGiven = '⬅️';
                    }
                    if (document.getElementById('pagemaintitletext').innerText.indexOf('en face') >-1){
                        localStorage.infoGiven = '⬆️';
                    }
                }
                content = content + '<tr><td colspan=4>Recu / '+localStorage.infoGiven+' / Donné </td></tr>\n';
                content = content + '<tr><td colspan=4> '+getFrom + ' / '+givenTo+'</td></tr>\n';

                let infoCardPlayed = '';

                for (let k = 14; k> 1; k--){
                    infoCardPlayed = '';

                    let infoItemC = '-';
                    let infoItemD = '-';
                    let infoItemP = '-';
                    let infoItemT = '-';
                    cards.forEach ((item, index) => {
                        let itemRename = item.toString();
                        if (itemRename.indexOf(heart)>-1 && itemRename.indexOf(k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"))>-1){
                            infoItemC = itemRename;
                        }
                        if (itemRename.indexOf(spade)>-1 && itemRename.indexOf(k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"))>-1){
                            infoItemP = itemRename;
                        }
                        if (itemRename.indexOf(diamond)>-1 && itemRename.indexOf(k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"))>-1){
                            infoItemD = itemRename;
                        }
                        if (itemRename.indexOf(club)>-1 && itemRename.indexOf(k.toString().replace("11","J").replace("12","Q").replace("13","K").replace("14","A"))>-1){
                            infoItemT = itemRename;
                        }
                    });

                    content = content + '<tr><td style="color:red;width:25%">'+infoItemC+'</td><td style="width:25%">'+infoItemP+'</td><td style="color:red;width:25%">'+infoItemD+'</td><td style="width:25%">'+infoItemT+'</td></tr>\n';
                }
                content = content + '</table>';

                if (document.getElementById('player_boards')){
                    if (!document.getElementById('chkInfo')){
                        var chkInfo = document.createElement('span');
                        chkInfo.innerHTML = "<input type='checkbox' id='chkInfo'/><label for='chkInfo'>&nbsp;&nbsp;Afficher le récapitulatif (+)</label>";
                        document.getElementById('player_boards').appendChild(chkInfo);
                    }

                    if (document.getElementById('chkInfo').checked) {
                        if (document.getElementById('ddpInfo')) {
                            document.getElementById('ddpInfo').style.display='';
                        }
                        if (oldContent != content) {
                            if (document.getElementById('ddpInfo')) {
                                document.getElementById('ddpInfo').remove();
                            }
                            var tableInfo = document.createElement('span');
                            tableInfo.id = 'ddpInfo';
                            tableInfo.innerHTML = content;
                            document.getElementById('player_boards').appendChild(tableInfo);
                            oldContent = content;
                        }
                    } else {
                        if (document.getElementById('ddpInfo')) {
                            document.getElementById('ddpInfo').style.display='none';
                        }
                    }
                }
                localStorage.cards = JSON.stringify(cards);
            },200);
        }


        ////////////////////////////////////////////////////////////////////////


        if (document.querySelectorAll('#maingameview_menufooter h2')[0].innerText == "Tichu") {
            window.addEventListener('keydown', displayInfo, true);
            if (document.getElementById('table_ref_item_table_id') && document.getElementById('footer_option_value_100')) {
                document.getElementById('table_ref_item_table_id').innerText = document.getElementById('table_ref_item_table_id').innerText + ' - ' + document.getElementById('footer_option_value_100').innerText;
            }
            window.addEventListener('contextmenu', (event) => {
               if (document.getElementById('myPassTrick')){//Passe le tour
                    document.getElementById('myPassTrick').click();
                    event.preventDefault();
                }
                if (document.getElementById('noBet')){//Pas de paris
                    document.getElementById('noBet').click();
                    event.preventDefault();
                }
                if (document.getElementById('acceptCards_button')){//Accepter les cartes
                    document.getElementById('acceptCards_button').click();
                    event.preventDefault();
                }
            })

            window.setTimeout(function(){
                if (document.getElementById('clockwise')){
                    if (document.getElementById('clockwise').style.display != 'none'){
                        document.getElementById('clockwise').click();
                        document.getElementById('clockwise').style.display = '';
                        document.getElementById('counterClockwise').style.display = '';
                    }
                }
                if (document.getElementById('square_table')){
                    document.getElementById('square_table').click();
                }
            },2000);

            let oldContent = '';
            let lastLogId = 0;
            let cards = ['01','Dog', 'Phoenix', 'Dragon'];
            for (let k=14; k>1; k--) {
                cards.push(k);
                cards.push(k);
                cards.push(k);
                cards.push(k);
            }

            let checkOrder = false;
            let dragonUsed = false;
            let dragonHighlight = false;
            let dragonPoints = '';
            let allCards = Array.from(cards);
            let originalCards = Array.from(cards);
            givenTo = window.localStorage.getItem('givenTo');
            getFrom = window.localStorage.getItem('getFrom');

            localStorage.cards = JSON.stringify(cards);
            let tichuCheck = window.setInterval(function() {
                cards = JSON.parse(window.localStorage.getItem('cards'));

                let lastcard = document.getElementsByClassName('log')[0];
                let players = document.getElementsByClassName('playertablename');

                if (lastcard && lastcard.innerText.indexOf('new round start') > -1) {
                    cards = originalCards;
                    oldContent = '';
                    givenTo = '-';
                    getFrom = '-';
                    localStorage.cards = JSON.stringify(cards);
                    dragonUsed = false;
                    dragonHighlight = false;
                    checkOrder = false;

                    Array.prototype.forEach.call(players, function(item) {
                        item.style.background = "none";
                    });
                }

                let phenixUsed = false;

                if (lastcard && !dragonHighlight) {
                    if (lastcard.innerText.indexOf(' obtient toutes les cartes') > -1 && dragonUsed) {
                        let posName = lastcard.innerText.indexOf(' obtient toutes les cartes');
                        dragonPoints = lastcard.innerText.substring(0,posName);
                        Array.prototype.forEach.call(players, function(item) {
                            if (item.innerText == dragonPoints){
                                item.style.background = "#38b929";
                                dragonHighlight = true
                            }
                        });
                    }
                }

                if (lastcard) {
                    if (lastcard.innerText.indexOf('new round starts') > -1 && !checkOrder) {
                        //Check by color before rank
                        /*
                        document.getElementById('order_by_color').click();
                        window.setTimeout(function() {
                            if (!checkOrder) {
                                document.getElementById('order_by_rank').click();
                            }
                        }, 5000);
                        */
                        checkOrder = true;
                    }

                    let timers = document.getElementsByClassName('timestamp');
                    Array.prototype.forEach.call(timers, function(item) {
                        item.innerText = "";
                    });


                    let lastlog = lastcard.innerText.replace("Mahjong","01").replace("Jacks","V").replace("Queens","D").replace("Kings","R").replace("Aces","A").replace("Jack","V").replace("Queen","D").replace("King","R").replace("Ace","A");
                    if (lastlog.indexOf('You have accepted') > -1) {
                        //You have accepted 7 from previous player, 10 from partner, 7 from next player.
                        getFrom = lastlog.replace('You have accepted ','').replace(' from previous player,','').replace(' from partner, ',' ').replace(' from next player.','');
                        getFrom = getFrom.replace('Mahjong','01').split('').reverse().join('').replace('goD','🐕').replace('nogarD','🐉').replace('xineohP','🦜');
                    }
                    if (lastlog.indexOf('Vous avez accepté') > -1) {
                        //Vous avez accepté 3 du joueur précédent, Queen de votre partenaire, 4 du joueur suivant.
                        getFrom = lastlog.replace('Vous avez accepté ','').replace(' du joueur précédent,','').replace(' de votre partenaire, ',' ').replace(' du joueur suivant.','');
                        getFrom = getFrom.replace('Mahjong','01').split('').reverse().join('').replace('goD','🐕').replace('nogarD','🐉').replace('xineohP','🦜');
                    }

                    if (lastlog.indexOf('You have passed') > -1) {
                        //You have passed 2 to previous player, 9 to partner, 6 to next player.
                        givenTo = lastlog.replace('You have passed ','').replace(' to previous player,','').replace(' to partner, ',' ').replace(' to next player.','');
                        givenTo = givenTo.replace('Mahjong','01').split('').reverse().join('').replace('goD','🐕').replace('nogarD','🐉').replace('xineohP','🦜');
                    }
                    if (lastlog.indexOf('Vous avez passé') > -1) {
                        //Vous avez passé 6 au joueur précédent, Phoenix à votre partenaire, 4 au joueur suivant.
                        givenTo = lastlog.replace('Vous avez passé ','').replace(' au joueur précédent,','').replace(' à votre partenaire, ',' ').replace(' au joueur suivant.','');
                        givenTo = givenTo.replace('Mahjong','01').split('').reverse().join('').replace('goD','🐕').replace('nogarD','🐉').replace('xineohP','🦜');
                    }

                    let positionJoue = lastcard.innerText.indexOf(' joue ');
                    if (lastLogId != lastcard.getAttribute("id") && positionJoue > -1){
                        lastLogId = lastcard.getAttribute("id");
                        lastlog = lastcard.innerText.substring(positionJoue).replace("Mahjong","01").replace("Jacks","11").replace("Queens","12").replace("Kings","13").replace("Aces","14").replace("Jack","11").replace("Queen","12").replace("King","13").replace("Ace","14");

                        let nbRepeat = 1;
                        let message = ' joue ';
                        let nbCardsUsed = 0;

                        if (lastlog.indexOf(' from ') > -1 && lastlog.indexOf(' to ') > -1) {
                            let regex = new RegExp(/from (\d+)\s*to \s*(\d+)/);
                            let match = lastlog.match(regex);
                            if (match) {
                                if (lastlog.indexOf('consecutive doubles') > -1) {
                                    nbRepeat = 2;
                                }
                                let startCard = parseInt(match[1]);
                                let endCard = parseInt(match[2]);
                                phenixUsed = false;
                                nbCardsUsed = 0;
                                for (let k=0; k<nbRepeat; k++) {
                                    for (let numCard = startCard; numCard <= endCard; numCard++) {
                                        let cardRemoved = false;
                                        cards.forEach((item, index) => {
                                            if (cardRemoved == false && item == numCard) {
                                                cards.splice(index, 1);
                                                cardRemoved = true;
                                                nbCardsUsed++;
                                            }
                                        })
                                    }
                                }
                                if (nbCardsUsed != (endCard-startCard)) {
                                    let phenixUsed = true;
                                }
                            }
                        } else {
                            if (lastlog.indexOf(' joue Dragon') > -1) {
                                dragonUsed = true;
                            }
                            if (lastlog.indexOf(' joue Bomb of four') > -1) {
                                message = ' joue Bomb of four ';
                                nbRepeat = 4;
                            }
                            if (lastlog.indexOf(' joue Pair of ') > -1) {
                                message = ' joue Pair of ';
                                nbRepeat = 2;
                            }
                            if (lastlog.indexOf(' joue Triple of ') > -1) {
                                message = ' joue Triple of ';
                                nbRepeat = 3;
                            }
                            if (lastlog.indexOf(' full') > -1) {
                                //joue 10's full of 6's (3x10 & 2x6)
                                message = " full";
                                nbRepeat = 3;
                                nbCardsUsed = 0;

                                for (let k=0; k<nbRepeat; k++) {
                                    let cardRemoved = false;
                                    cards.forEach((item, index) => {
                                        if (cardRemoved == false && ((lastlog.indexOf(item+message) > -1) || (lastlog.indexOf(item+"'s"+message) > -1))) {
                                            cards.splice(index, 1);
                                            cardRemoved = true;
                                            nbCardsUsed++;
                                        }
                                    })
                                }

                                if (nbCardsUsed != nbRepeat) {
                                    phenixUsed = true;
                                }
                                message = ' of ';
                                nbRepeat = 2;
                            }

                            nbCardsUsed = 0;
                            for (let k=0; k<nbRepeat; k++) {
                                let cardRemoved = false;
                                cards.forEach((item, index) => {
                                    if (cardRemoved == false && lastlog.indexOf(message+ item) > -1) {
                                        cards.splice(index, 1);
                                        cardRemoved = true;
                                        nbCardsUsed++;
                                    }
                                })
                            }

                            if (nbCardsUsed != nbRepeat) {
                                phenixUsed = true;
                            }
                        }
                    }
                }

                if (phenixUsed){
                    cards.forEach((item, index) => {
                        if (item == 'Phoenix') {
                            cards.splice(index, 1);
                        }
                    })
                }

                let content = '<style>#makeTichuBet{margin-left:400px;} #tableTichu tr:nth-child(even) {background: #DEDEDE}</style><table id="tableTichu" style="width:100%;text-align:center;background:#fff">';
                content = content + '<tr><td colspan=2>Recu / Donné </td></tr>\n';
                content = content + '<tr><td colspan=2> '+getFrom + ' / '+givenTo+'</td></tr>\n';
                let nbItem = 0;
                let infoItem = '-';
                let infoCardPlayed = '';
                allCards.forEach ((item, index) => {
                    nbItem = nbItem+1;
                    if (nbItem == 4){
                        if (item != 'Dog' && item != '01' && item != 'Phoenix' && item != 'Dragon') {
                            infoCardPlayed = '';
                        }
                        cards.forEach ((item2, index2) => {
                            if (item == 'Dog' || item == '01' || item == 'Phoenix' || item == 'Dragon') {
                                if (item2 == '01'){
                                    infoCardPlayed = infoCardPlayed +'1';
                                }
                                if (item2 == 'Dog'){
                                    infoCardPlayed = infoCardPlayed +'🐕';
                                }
                                if (item2 == 'Phoenix'){
                                    infoCardPlayed = infoCardPlayed +'🦜';
                                }
                                if (item2 == 'Dragon'){
                                    infoCardPlayed = infoCardPlayed +'🐉';
                                }
                                infoCardPlayed = '<span id="specialCards">'+infoCardPlayed+'</span>';
                            } else {
                                let itemRename = item.toString().replace("11","V").replace("12","D").replace("13","R").replace("14","A");
                                infoItem = '<a style="cursor:pointer" title="Cliquez si le Phénix a été utilisé pour cette carte" onclick="cards=removePhoenix('+item+')">'+itemRename+'</a>';
                                if (item == item2) {
                                    if (infoCardPlayed == '') {
                                        infoCardPlayed = 0;
                                    }
                                    infoCardPlayed++;
                                }
                            }
                        });

                        content = content + '<tr><td>'+infoItem+'</td><td>'+infoCardPlayed+'</td></tr>\n';
                        nbItem = 0;
                    }
                })
                content = content + '</table>';

                if (document.getElementById('player_boards')){
                    if (!document.getElementById('chkInfo')){
                        var chkInfo = document.createElement('span');
                        chkInfo.innerHTML = "<input type='checkbox' id='chkInfo'/><label for='chkInfo'>&nbsp;&nbsp;Afficher le récapitulatif (+)</label>";
                        document.getElementById('player_boards').appendChild(chkInfo);
                    }

                    if (document.getElementById('chkInfo').checked) {
                        if (document.getElementById('tichuInfo')) {
                            document.getElementById('tichuInfo').style.display='';
                        }
                        if (oldContent != content) {
                            if (document.getElementById('tichuInfo')) {
                                document.getElementById('tichuInfo').remove();
                            }
                            var tableInfo = document.createElement('span');
                            tableInfo.id = 'tichuInfo';
                            tableInfo.innerHTML = content;
                            document.getElementById('player_boards').appendChild(tableInfo);
                            oldContent = content;
                        }
                    } else {
                        if (document.getElementById('tichuInfo')) {
                            document.getElementById('tichuInfo').style.display='none';
                        }
                    }
                }
                localStorage.cards = JSON.stringify(cards);
                localStorage.getFrom = getFrom;
                localStorage.givenTo = givenTo;
            },200);

            GM_addElement('script', {
                textContent: "var phoenixPosition = 2; window.removePhoenix = function(value) {let newCards = JSON.parse(localStorage.cards);if(document.getElementById('specialCards').innerText.indexOf('🦜')>-1){phoenixPosition = newCards.indexOf('Phoenix');newCards.splice(phoenixPosition,1);let index = newCards.indexOf(value);console.log(newCards);newCards.splice(index,0, value);console.log(newCards);}else{let index = newCards.indexOf(value);newCards.splice(index,1);newCards.splice(phoenixPosition,0, 'Phoenix');}localStorage.cards = JSON.stringify(newCards);};"
            });
        }
    }
}