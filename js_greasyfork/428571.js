// ==UserScript==
// @name         Friends+
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds new options to the friends menu. Allows you to view your blocked players, as well as all the players in the area. It also fixes the "My People Ordered" error that will sometimes occur.
// @author       Zoltar
// @match        http://manyland.com/*
// @icon         https://cdn.discordapp.com/icons/852442189283983380/a_70793eeb1f509f9c4aa1021e5691fab4.webp
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/428571/Friends%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/428571/Friends%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';



    // took this part from Eternity's mod
    function loadObf() {
        if (typeof Deobfuscator === 'undefined')
            return $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")
    }


    async function main() {

        let friendsDraw = Deobfuscator.function(ig.game.friendsDialog, '>ig.system.height', true)
        let addPlayer = Deobfuscator.function(ig.game.friendsDialog, 'b.location&&!b.unfindable', true);

        let forwardArrow = 'https://cdn.discordapp.com/attachments/821248617628565524/858816537409486878/arrowforward.png';
        let backArrow = 'https://cdn.discordapp.com/attachments/821248617628565524/858815666492276757/arrowback.png';


        let saved = false;
        let blockedAdded = false;
        let playersAdded = false;

        let currentPage = 0;

        let playerInfo = Deobfuscator.object(ig.game, 'myPeople');
        let friendKey = Deobfuscator.keyBetween(Deobfuscator.function(playerInfo, '(e.location));'), 'd.', '[a]');
        let friendList = playerInfo[friendKey];

        let keyFunction = Deobfuscator.function(playerInfo, 'c&&c.blocked;');

        let blockList = Deobfuscator.keyBetween(keyFunction, '=c&&c.friends;b.', '=c&&c.blocked');

        ig.game.friendsDialog.old_draw = ig.game.friendsDialog[friendsDraw];
        ig.game.friendsDialog.old_close = ig.game.friendsDialog.close;
        ig.game.friendsDialog.old_open = ig.game.friendsDialog.open;
        ig.game.friendsDialog.savedContent = "";

        // My People fix
        let playerInfoKey = Deobfuscator.object(ig.game, 'myPeople', true);

        ig.game.globalTally1 = 0;
        ig.game.globalTally2 = 0;

        let myPeopleHandler1 = Deobfuscator.function(playerInfo, 'c&&c.blocked;', true);
        let myPeopleHandler2 = Deobfuscator.function(playerInfo, 'b.myPeople=c;a.resolve()', true)


        let errorMessageHandler = Deobfuscator.function(ig.game.errorManager, '&&console.log(a+', true);

        eval(`ig.game.${playerInfoKey}.${myPeopleHandler1} = function(){` + playerInfo[myPeopleHandler1].toString().split('function(){')[1].split(`ig.game.errorManager.${errorMessageHandler}`).join(`if(ig.game.globalTally1 < 3) {playerInfo[myPeopleHandler1]();} ig.game.globalTally1++; console.log`).split('b.myPeople=c&&c.friends;').join('b.myPeople=c&&c.friends; ig.game.globalTally1 = 0;'))

        eval(`ig.game.${playerInfoKey}.${myPeopleHandler2} = function(){` + playerInfo[myPeopleHandler2].toString().split('function(){')[1].split(`ig.game.errorManager.${errorMessageHandler}`).join(`if(ig.game.globalTally2 < 3) {playerInfo[myPeopleHandler2]();} ig.game.globalTally2++; console.log`).split('b.myPeople=c;').join('b.myPeople=c; ig.game.globalTally2 = 0;'))



        // Friends+ stuff
        let blockedPlayersHTML = `<h3 style="color: red">Block List</h3><div class="separator" style="border-top: 3px solid rgba(100, 100, 100, 0.4); border-bottom: 0px; margin-top: 6px; margin-bottom: 6px; --darkreader-inline-border-top:rgba(95, 103, 107, 0.4); --darkreader-inline-border-bottom: initial;" id="sep" data-darkreader-inline-border-top="" data-darkreader-inline-border-bottom=""></div>`
        let blockedPlayersSave = blockedPlayersHTML;

        let playersInAreaHTML = `<h3 style="color: green">Players In Area</h3><div class="separator" style="border-top: 3px solid rgba(100, 100, 100, 0.4); border-bottom: 0px; margin-top: 6px; margin-bottom: 6px; --darkreader-inline-border-top:rgba(95, 103, 107, 0.4); --darkreader-inline-border-bottom: initial;" id="sep" data-darkreader-inline-border-top="" data-darkreader-inline-border-bottom=""></div>`
        let playersInAreaHTMLSave = playersInAreaHTML;

        // ig.game.friendsDialog.open = function() {
        //     ig.game.friendsDialog.old_open();


        // }
        window.addEventListener('keydown', event => {
            if (ig.game.friendsDialog.isOpen && currentPage == 0 && event.key === 'Enter') {
                let input = $("#friendSearch")[0];

                if (input.value != "") {
                    let cleaned = input.value.includes(" ") ? input.value.replace(/\s/g, '') : input.value;
                    let foundUser = null;

                    for(let friend of playerInfo.myPeople) {
                        let specFriend = friendList[friend].name.includes(" ") ? friendList[friend].name.replace(/\s/g, '') : friendList[friend].name;
                        if(cleaned === specFriend) {
                            foundUser = friend;
                        }
                    }

                    if (foundUser != null) {
                        let player = ig.game.friendsDialog[addPlayer](foundUser, friendList[foundUser]);

                        $('#resultHolder')[0].style.display = "";

                        jQuery('#resultHolder').html('<div class="separator" style="border-top: 3px solid rgba(100, 100, 100, 0.4); border-bottom: 0px; margin-top: 6px; margin-bottom: 6px; --darkreader-inline-border-top:rgba(95, 103, 107, 0.4); --darkreader-inline-border-bottom: initial;" id="sep" data-darkreader-inline-border-top="" data-darkreader-inline-border-bottom=""></div>' + player)

                    }

                    input.value = "";
                }
            }
        })

        ig.game.friendsDialog.pageForward = function () {
            if (currentPage == 0) {
                if (!saved) ig.game.friendsDialog.savedContent = $("#contentPart")[0].innerHTML;
                jQuery("#contentPart").html(blockedPlayersHTML)
                saved = true;

                $("#friendSearch")[0].style.display = "none";
                $("#saa")[0].style.display = "";
                $('#resultHolder')[0].style.display = "none";
                jQuery('#resultHolder').html('');

                if (!blockedAdded) ig.game.friendsDialog.listBlocked();
                blockedAdded = true;

                ig.game.sounds.click.play();
                currentPage++;

            } else if (currentPage == 1) {
                jQuery("#contentPart").html(playersInAreaHTML)
                if (!playersAdded) ig.game.friendsDialog.listPlayers();
                playersAdded = true;
                $("#saaa")[0].style.display = "none";
                $('#resultHolder')[0].style.display = "none";
                ig.game.sounds.click.play();

                currentPage++;
            }

        }

        ig.game.friendsDialog.pageBack = function () {
            if (currentPage == 1) {
                jQuery("#contentPart").html(ig.game.friendsDialog.savedContent);
                $("#friendSearch")[0].style.display = "";
                $("#saa")[0].style.display = "none";
                ig.game.sounds.click.play();
                currentPage--;

            } else if (currentPage == 2) {
                jQuery("#contentPart").html(blockedPlayersHTML)
                $("#saaa")[0].style.display = "";
                ig.game.sounds.click.play();
                currentPage--;

            }

        }

        ig.game.friendsDialog.listBlocked = function () {
            for (let blocked of playerInfo[blockList]) {
                $.get(`http://manyland.com/j/u/ps/${blocked}`, data => {
                    let player = ig.game.friendsDialog[addPlayer](blocked, data);
                    blockedPlayersHTML += player + '<div class="separator" style="border-top: 3px solid rgba(100, 100, 100, 0.4); border-bottom: 0px; margin-top: 6px; margin-bottom: 6px; --darkreader-inline-border-top:rgba(95, 103, 107, 0.4); --darkreader-inline-border-bottom: initial;" id="sep" data-darkreader-inline-border-top="" data-darkreader-inline-border-bottom=""></div>';

                    jQuery("#contentPart").html(blockedPlayersHTML);

                })
            }

        }

        ig.game.friendsDialog.listPlayers = function () {
            updatePlayers();
            if (ig.game.players.length < 2) return;
            let playerId = Deobfuscator.variableByLength(ig.game.players[1], 24, true);

            for (let player of ig.game.players) {

                if (player[playerId] != ig.game.player.id && player.isFullAccount) {
                    $.get(`http://manyland.com/j/u/ps/${player[playerId]}`, data => {
                        if (!data.hiddenInFriendsList) {
                            let pDialog = ig.game.friendsDialog[addPlayer](player[playerId], data);
                            playersInAreaHTML += pDialog + '<div class="separator" style="border-top: 3px solid rgba(100, 100, 100, 0.4); border-bottom: 0px; margin-top: 6px; margin-bottom: 6px; --darkreader-inline-border-top:rgba(95, 103, 107, 0.4); --darkreader-inline-border-bottom: initial;" id="sep" data-darkreader-inline-border-top="" data-darkreader-inline-border-bottom=""></div>';

                            jQuery("#contentPart").html(playersInAreaHTML);
                        }


                    })
                }
            }
        }

        ig.game.friendsDialog[friendsDraw] = new Function(ig.game.friendsDialog[friendsDraw].toString().slice(11).split(`)+"</div>";`).join(`)+"</div>"; a+= '<span id="saaa" style=" float: right; z-index: 99;' + f + '"><img src="${forwardArrow}" width="45" height="26" alt=""/></span>'; a += '<span id="saa" style="display: none; float: left; z-index: 99;' + f + '"><img src="${backArrow}" width="45" height="26" alt=""/></span>'; a+= '<input type="text" autocomplete="off" value placeholder="Search friend.." id="friendSearch" style="font-size: 12px; width: 80%; font-family: inherit; text-transform: uppercase; border: 0; padding: 2px; padding-top: 2px; padding-bottom: 2px; background-color: rgba(255, 255, 255, .4); margin-top: 5px; outline: none"></input>'; a += '<div id="resultHolder"></div>';`).split('.on("click","#friendsDialog').join(`.on("click", "#saaa", () => { ig.game.friendsDialog.pageForward() }).on("click", "#saa", () => { ig.game.friendsDialog.pageBack() }).on("click","#friendsDialog`).slice(0, -1));

        ig.game.friendsDialog.close = function () {
            ig.game.friendsDialog.old_close();
            blockedPlayersHTML = blockedPlayersSave;
            saved = false;
            blockedAdded = false;
            playersAdded = false;
            currentPage = 0;
            playersInAreaHTML = playersInAreaHTMLSave;
        }

    }

    // Parses smooth loader
    !async function loader() {
        let loading = setInterval(async function () {
            if (typeof ig === "undefined") return
            else if (typeof ig.game === "undefined") return
            else if (typeof ig.game.screen === "undefined") return
            else if (ig.game.screen.x == 0) return
            else if (typeof Settings !== "function") return

            clearInterval(loading);
            await loadObf();
            main();
        }, 250)
    }()
})();