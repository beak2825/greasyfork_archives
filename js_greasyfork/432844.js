// ==UserScript==
// @name         UpdateShortlist
// @namespace    https://trophymanager.com
// @version      1.9.2
// @description  Trophymanager: Update Shortlist
// @include			https://trophymanager.com/league/*
// @include			https://trophymanager.com/league/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432844/UpdateShortlist.user.js
// @updateURL https://update.greasyfork.org/scripts/432844/UpdateShortlist.meta.js
// ==/UserScript==



(function () {
    'use strict';
    const UPDATE_SHORTLIST_TABLE_BODY_ID = 'tmvn_script_update_shortlist_table_body';

    let updateTime = new Date(Date.now());
    updateTime = updateTime.toDateString() + " " + updateTime.toLocaleTimeString();

    let prevTuesday = new Date();
    prevTuesday.setDate(prevTuesday.getDate() - (prevTuesday.getDay() + 5) % 7);
    prevTuesday.setHours(2, 0, 0, 0);

    present();

    // Iniz The Table //
    function present() {
        let UpdateShortlistDiv =
            "<div class=\"box\">" +
            "<div class=\"box_head\">" +
            "<h2 class=\"std\">UPDATE SHORTLIST</h2>" +
            "</div>" +
            "<div class=\"box_body\">" +
            "<div class=\"box_shadow\"></div>" +
            "<div id=\"updateShortlistButton\" class=\"updateShortlist\"></div>" +
            "<div id=\"updateShortlist_content\" class=\"content_menu\"></div>" +
            "</div>" +
            "<div class=\"box_footer\">" +
            "<div></div>" +
            "</div>" +
            "</div>";

        $(".column3_a").append(UpdateShortlistDiv);


        $("#updateShortlistButton").attr('style', 'text-align: center; padding-top: 0px; margin-top: 10px;margin-bottom: 10px;');

        let updateShortlistButton = "<span class=\"button\"  style=\"width:170px; text-align:left;\"><span class=\"button_border\" style=\"width:168px;text-align: center ; padding: 0;\">Update Shortlist</span></span>";


        $("#updateShortlistButton").append(updateShortlistButton)


        let updateShortlist_content = "<table><tbody id='" + UPDATE_SHORTLIST_TABLE_BODY_ID + "'></tbody></table>";
        $("#updateShortlist_content").append(updateShortlist_content);
        let tbody = $('#' + UPDATE_SHORTLIST_TABLE_BODY_ID)[0];


        /*Last Update Time*/
        let trLastUpdateTime = document.createElement('tr');
        trLastUpdateTime.className = 'odd';

        let tdLastUpdateTimeLabel = document.createElement('td');
        tdLastUpdateTimeLabel.innerText = 'Last Update Time: ';

        let tdLastUpdateTime = document.createElement('td');
        tdLastUpdateTime.id = 'tdLastUpdateTime';
        tdLastUpdateTime.style.color = "lime";
        trLastUpdateTime.appendChild(tdLastUpdateTimeLabel);
        trLastUpdateTime.appendChild(tdLastUpdateTime);
        tbody.appendChild(trLastUpdateTime);

        /*% Update Count*/
        let trUpdateCount = document.createElement('tr');

        let tdUpdateCountLabel = document.createElement('td');
        tdUpdateCountLabel.innerText = 'Update Count: ';

        let tdUpdateCount = document.createElement('td');
        tdUpdateCount.id = 'tdUpdateCount';
        tdUpdateCount.style.color = "lime";
        trUpdateCount.appendChild(tdUpdateCountLabel);
        trUpdateCount.appendChild(tdUpdateCount);
        tbody.appendChild(trUpdateCount);

        getPlayers().then(players => {
            const updatedPlayers = players.filter((player) => {
                return new Date(player.last_update) > prevTuesday;
            })
            const updatedPlayersPerc = ((updatedPlayers.length / players.length) * 100).toFixed(2);
            setUpdatedPlayersCount(`(${updatedPlayers.length} / ${players.length}) ${updatedPlayersPerc}%`)

        })

        getLastUpdateTime().then(values => {
            setLastUpdateTime(values);
            $("#updateShortlistButton > span.button").on("click", function () {
                setLastUpdateTime("Loading ...")
                getPlayers().then((players) => {
                    const playersToUpdate = players.filter((player) => {
                        return new Date(player.last_update) <= prevTuesday;
                    })
                    const playersIds = playersToUpdate.map(player => player.player_id);
                    const playersSelected = getRandomPlayers(400, playersIds);
                    updatePlayers(playersSelected);
                })
            })
        });

    }

    async function getPlayers() {
        return $.get("//autoscoutproject.com/scout/api/shortlist/read.php");
    }

    async function getPlayersData(playersIds) {

        const retiredPlayers = [];

        const getPlayersDataResult = await Promise.allSettled(playersIds.map(async playerId => {
            const playerData = await getPlayerData(playerId);
            const playerDataJSON = JSON.parse(playerData);
            if (playerDataJSON.player.name === 'Retired') {
                retiredPlayers.push({ player_id: playerId });
            }
            return playerData;
        }));


        const playersData = getPlayersDataResult
            .filter(response => response.status === 'fulfilled')
            .map(response => response.value);

        let playersArr = []
        playersData.forEach(playerData => {
            let playerDataJSON = JSON.parse(playerData)
            if (playerDataJSON.player.name !== 'Retired') {
                playersArr.push(setPlayerInfo(playerDataJSON.player))
            }
        });

        await Promise.allSettled(
            retiredPlayers.map(
                player => removeFromShortlist(player)
            ));

        await updateShortlist(playersArr);
        await deleteOldPlayers();
        await updateUpdateTime();
        location.reload();

    }

    function updatePlayers(playersIds) {
        getPlayersData(playersIds);
    }




    function setPlayerInfo(playerData) {
        let player = {
            player_id: '',
            name: '',
            age: '',
            months: '',
            country: '',
            skill_index: '',
            favposition: '',
            last_update: '',
            nation: ''
        };

        player.player_id = playerData.player_id;
        player.name = playerData.name;
        player.favposition = playerData.favposition.toUpperCase().replace(",", "/");
        player.age = parseInt(playerData.age);
        player.months = parseInt(playerData.months);
        player.country = playerData.country == 'il' ? 'local' : 'foreign';
        player.skill_index = getSkillsFromASI(playerData.skill_index, playerData.favposition);
        player.last_update = updateTime;
        player.nation = playerData.country;
        return player;
    }

    // Convert ASI to Skill Index //
    function getSkillsFromASI(skill_index, favposition) {
        let skillSum = parseInt(skill_index.split(',').join(''));
        if (favposition != 'gk') {
            return (Math.pow(skillSum, 1 / 6.99998) / 0.023359).toFixed(2)
        }
        else {
            return ((Math.pow(skillSum, 1 / 6.99998) / 0.023359) / 14 * 11).toFixed(2)
        }
    }


    function getRandomPlayers(count, array) {
        const random_arr = [...array];
        shuffle(random_arr);
        return random_arr.slice(0, count);
    }
    function shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }


    function updateShortlist(data) {
        var dataJSON = JSON.stringify(data);
        return $.ajax({
            type: "POST",
            url: "https://autoscoutproject.com/scout/api/shortlist/update_table.php",
            data: dataJSON,
            ContentType: "application/json",
            success: function () {
                console.log("Finished")
            },
            error: function (e) {
                console.log("Fail , Error: ")
                console.log(e)
            }
        });
    }

    // delete old players //
    function deleteOldPlayers() {
        return $.post("//autoscoutproject.com/scout/api/shortlist/delete_old_players.php");
    }

    function getPlayerData(playerId) {
        return $.post("//trophymanager.com/ajax/tooltip.ajax.php", {
            "player_id": playerId
        })
    }


    function setLastUpdateTime(data) {
        let tdLastUpdateTime = document.getElementById("tdLastUpdateTime");
        tdLastUpdateTime.innerText = data.toString();
    }

    function setUpdatedPlayersCount(data) {
        let tdUpdateCount = document.getElementById("tdUpdateCount");
        tdUpdateCount.innerText = data.toString();
    }

    function getLastUpdateTime() {
        return $.get("//autoscoutproject.com/scout/api/shortlist/read_last_update_time.php");
    }

    // remove player from shortlist - promise //
    function removeFromShortlist(player) {
        const dataJSON = JSON.stringify(player);
        return $.ajax({
            type: "POST",
            url: "https://autoscoutproject.com/scout/api/shortlist/delete.php",
            data: dataJSON,
            ContentType: "application/json",
            success: function () {
                console.log("Finished")
            },
            error: function (e) {
                console.log("Fail , Error: ")
                console.log(e)
            }
        });
    }

    function updateUpdateTime() {
        let data = {};
        let timeNow = new Date(Date.now());
        timeNow = timeNow.toDateString() + " " + timeNow.toLocaleTimeString();
        data["last_update"] = timeNow;
        var dataJSON = JSON.stringify(data);

        return $.ajax({
            type: "POST",
            url: "https://autoscoutproject.com/scout/api/shortlist/update_last_update_time.php",
            data: dataJSON,
            ContentType: "application/json",
            success: function () {
                console.log("Finished")
            },
            error: function (e) {
                console.log("Fail , Error: ")
                console.log(e)
            }
        });
    }
})();
