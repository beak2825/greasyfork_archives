// ==UserScript==
// @name         AutoScouting
// @namespace    https://trophymanager.com
// @version      1.8
// @description  Trophymanager: synthesize scout information, calculate skill peak
// @include      https://trophymanager.com/players/*
// @exclude	     https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432258/AutoScouting.user.js
// @updateURL https://update.greasyfork.org/scripts/432258/AutoScouting.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const SCOUT_TABLE_BODY_ID = 'tmvn_script_scout_table_body';
    const SCOUT_RELIABLE_SKILL = {
        seniors: 20,
        youths: 20,
        development: 19,
        physical: 20,
        tactical: 20,
        technical: 20,
    };
    const SCOUT_ALL_SKILLS = ["development", "youths", "seniors", "physical", "tactical", "technical"]
    const SPECIALTY_ARRAY_FIELD_PLAYER = new Map([
        ['1', 'Strength'], ['2', 'Stamina'], ['3', 'Pace'], ['4', 'Marking'], ['5', 'Tackling'], ['6', 'Workrate'], ['7', 'Positioning'],
        ['8', 'Passing'], ['9', 'Crossing'], ['10', 'Technique'], ['11', 'Heading'], ['12', 'Finishing'], ['13', 'Longshots'], ['14', 'Set Pieces']
    ])

    const SPECIALTY_ARRAY_GK_PLAYER = new Map([
        ['1', 'Strength'], ['2', 'Stamina'], ['3', 'Pace'],
        ['4', 'Handling'], ['5', 'One-On-Ones'], ['6', 'Reflexes'], ['7', 'Aerial Ability'],
        ['8', 'Jumping'], ['9', 'Communication'], ['10', 'Kicking'], ['11', 'Throwing']
    ])


    const findAllSubsetsoOfGivenSet =
        originalArrayValue => originalArrayValue.reduce(
            (givenSet, setValue) => givenSet.concat(
                givenSet.map(givenSet => [setValue, ...givenSet])
            ),
            [[]]
        );

    var scoutMap = new Map();
    var playerId;


    present();



    /*Main Ui Function  - present the select box of the required scouting skills */
    function present() {

        playerId = player_id.toString()

        let scoutReport =
            "<div class=\"box\">" +
            "<div class=\"box_head\">" +
            "<h2 class=\"std\">SCOUT REPORT</h2>" +
            "</div>" +
            "<div class=\"box_body\">" +
            "<div class=\"box_shadow\"></div>" +
            "<div id=\"sendScoutButton\" class=\"ScoutButton\"></div>" +
            "<div id=\"sendDevelopmentScoutButton\" class=\"ScoutButton\"></div>" +
            "<div id=\"scoutReport_content\" class=\"content_menu\"></div>" +
            "</div>" +
            "<div class=\"box_footer\">" +
            "<div></div>" +
            "</div>" +
            "</div>";




        $(".column1").append(scoutReport);

        $("#sendScoutButton").attr('style', 'text-align: center; padding-top: 0px; margin-top: 10px;margin-bottom: 10px;');

        let ScoutPlayerButton = "<span class=\"button\"  style=\"width:170px; text-align:left;\"><span class=\"button_border\" style=\"width:168px;text-align: center ; padding: 0;\">&nbsp;<img src=\"/pics/binoc.png\">&nbsp;&nbsp;Send Scout</span></span>";


        $("#sendScoutButton").append(ScoutPlayerButton)


        let scoutReport_content = "<table><tbody id='" + SCOUT_TABLE_BODY_ID + "'></tbody></table>";
        $("#scoutReport_content").append(scoutReport_content);
        let tbody = $('#' + SCOUT_TABLE_BODY_ID)[0];

        /*Development*/
        let trDevelopment = document.createElement('tr');
        trDevelopment.className = 'odd';

        let tdDevelopmentLabel = document.createElement('td');
        tdDevelopmentLabel.innerText = 'Development: ';

        let tdDevelopment = document.createElement('td');

        let inputDevelopmentCheckBox = document.createElement('input');
        inputDevelopmentCheckBox.type = "checkbox";
        inputDevelopmentCheckBox.id = "DevelopmentCheckBox";
        inputDevelopmentCheckBox.checked = true


        tdDevelopment.appendChild(inputDevelopmentCheckBox)
        trDevelopment.appendChild(tdDevelopmentLabel);
        trDevelopment.appendChild(tdDevelopment);
        tbody.appendChild(trDevelopment);

        /*Potential*/
        let trPotential = document.createElement('tr');

        let tdPotentialLabel = document.createElement('td');
        tdPotentialLabel.innerText = 'Potential: ';

        let tdPotential = document.createElement('td');


        let inputPotentialCheckBox = document.createElement('input');
        inputPotentialCheckBox.type = "checkbox";
        inputPotentialCheckBox.id = "PotentialCheckBox";
        inputPotentialCheckBox.checked = true


        tdPotential.appendChild(inputPotentialCheckBox)


        trPotential.appendChild(tdPotentialLabel);
        trPotential.appendChild(tdPotential);
        tbody.appendChild(trPotential);

        /*Physical*/
        let trPhysical = document.createElement('tr');
        trPhysical.className = 'odd';

        let tdPhysicalLabel = document.createElement('td');
        tdPhysicalLabel.innerText = 'Physical: ';

        let tdPhysical = document.createElement('td');

        let inputPhysicalCheckBox = document.createElement('input');
        inputPhysicalCheckBox.type = "checkbox";
        inputPhysicalCheckBox.id = "PhysicalCheckBox";
        inputPhysicalCheckBox.checked = true


        tdPhysical.appendChild(inputPhysicalCheckBox)


        trPhysical.appendChild(tdPhysicalLabel);
        trPhysical.appendChild(tdPhysical);
        tbody.appendChild(trPhysical);

        /*Tactical*/
        let trTactical = document.createElement('tr');

        let tdTacticalLabel = document.createElement('td');
        tdTacticalLabel.innerText = 'Tactical: ';

        let tdTactical = document.createElement('td');
        let inputTacticalCheckBox = document.createElement('input');
        inputTacticalCheckBox.type = "checkbox";
        inputTacticalCheckBox.id = "TacticalCheckBox";
        inputTacticalCheckBox.checked = true


        tdTactical.appendChild(inputTacticalCheckBox)

        trTactical.appendChild(tdTacticalLabel);
        trTactical.appendChild(tdTactical);
        tbody.appendChild(trTactical);

        /*Technical*/
        let trTechnical = document.createElement('tr');
        trTechnical.className = 'odd';

        let tdTechnicalLabel = document.createElement('td');
        tdTechnicalLabel.innerText = 'Technical: ';

        let tdTechnical = document.createElement('td');

        let inputTechnicalCheckBox = document.createElement('input');
        inputTechnicalCheckBox.type = "checkbox";
        inputTechnicalCheckBox.id = "TechnicalCheckBox";
        inputTechnicalCheckBox.checked = true


        tdTechnical.appendChild(inputTechnicalCheckBox)


        trTechnical.appendChild(tdTechnicalLabel);
        trTechnical.appendChild(tdTechnical);
        tbody.appendChild(trTechnical);




        getPlayerReport(playerId).then((report) => {
            if (report.boost_age == null && checkTransferlisted()) {
                $("#sendDevelopmentScoutButton").attr('style', 'text-align: center; padding-top: 0px; margin-top: 10px;margin-bottom: 10px;');
                let ScoutDevelopmentPlayerButton = "<span class=\"button\"  style=\"width:170px; text-align:left;\"><span class=\"button_border\" style=\"width:168px;text-align: center ; padding: 0;\">&nbsp;<img src=\"/pics/binoc.png\">&nbsp;&nbsp;Send Development</span></span>";
                $("#sendDevelopmentScoutButton").append(ScoutDevelopmentPlayerButton)
                $("#sendDevelopmentScoutButton > span.button").on("click", function () {
                    getPlayerData(playerId).then((values) => {
                        const playerData = JSON.parse(values);
                        const playerAge = parseInt(playerData.player.age);
                        let requiredData = ['development'];
                        SendScouts(requiredData, playerAge)
                    })
                })
            }
            if (hasMixedValues(report)) {
                if (report.boost_age !== null) {
                    inputDevelopmentCheckBox.checked = false;
                }
                if (report.boost !== null && report.talent !== null) {
                    inputPotentialCheckBox.checked = false;
                }
                if (report.phy !== null) {
                    inputPhysicalCheckBox.checked = false;
                }
                if (report.tac !== null) {
                    inputTacticalCheckBox.checked = false;
                }
                if (report.tec !== null) {
                    inputTechnicalCheckBox.checked = false;
                }
            }
        });


        $("#sendScoutButton > span.button").on("click", function () {
            getPlayerData(playerId).then((values) => {
                const playerData = JSON.parse(values);
                const playerAge = parseInt(playerData.player.age);
                let requiredData = getRequiredData(playerAge)
                SendScouts(requiredData, playerAge)
            })
        })
    }

    /*SendScouts - Send Scout On The Player */
    function SendScouts(requiredData, playerAge) {
        getScoutInfo(playerId, playerAge).then((values) => {
            let ScoutsIds = BuildScoutsForJob(scoutMap, requiredData)
            let RunLoop = []
            var reports = []
            ScoutsIds.forEach(value => {
                let scout = scoutMap.get(value)
                console.log(scout.name + " " + scout.surname)
            })

            function buildReportObj(data) {
                // Data is result from tm service
                // report is for our service!
                let report = {};
                let scout = scoutMap.get(data.scoutid)
                report["player_id"] = data.playerid
                if (scout.skills.includes('development')) {
                    report["boost_age"] = data.boost_age;
                }

                if (scout.skills.includes('physical')) {
                    report["phy"] = data.peak_phy;
                }

                if (scout.skills.includes('tactical')) {
                    report["tac"] = data.peak_tac;
                }

                if (scout.skills.includes('technical')) {
                    report["tec"] = data.peak_tec;
                }
                if (playerAge < 20) {
                    if (scout.skills.includes('youths')) {
                        report["boost"] = data.boost;
                        report["talent"] = data.talent;
                    }
                }
                if (playerAge > 19) {
                    if (scout.skills.includes('seniors')) {
                        report["boost"] = data.boost;
                        report["talent"] = data.talent;
                    }
                }
                if (data.favposition == "gk") {
                    report["specialty"] = SPECIALTY_ARRAY_GK_PLAYER.get(data.specialist)
                }
                else {
                    report["specialty"] = SPECIALTY_ARRAY_FIELD_PLAYER.get(data.specialist)
                }
                return report;
            }

            function getScoutData() {
                return $.post("//trophymanager.com/ajax/scouts_get_reports.ajax.php", {
                }, function (response) {
                    let data = JSON.parse(response);
                    reports.push(buildReportObj(data[0]))
                });
            }

            function getScoutDataWithRetry(maxRetries = 10) {
                function getScoutDataAttempt(attempt) {
                    return Promise.resolve(getScoutData())
                        .catch(error => {
                            console.error(`Error in getScoutData (attempt ${attempt}):`, error);
                            if (attempt < maxRetries) {
                                console.log(`Retrying getScoutData (attempt ${attempt + 1})...`);
                                return getScoutDataAttempt(attempt + 1);
                            } else {
                                throw new Error(`Max retries reached for getScoutData`);
                            }
                        });
                }
                return getScoutDataAttempt(1);
            }

            function postReport(report) {
                var reportJSON = JSON.stringify(report);
                return $.ajax({
                    type: "POST",
                    url: "https://autoscoutproject.com/scout/api/report/create.php",
                    data: reportJSON,
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

            function RequestUpdateWithRetry(index, maxRetries = 10) {
                function requestUpdateAttempt(attempt) {
                    let report = reports[index];
                    return Promise.resolve(postReport(report))
                        .catch(error => {
                            console.error(`Error in RequestUpdate (attempt ${attempt}):`, error);
                            if (attempt < maxRetries) {
                                console.log(`Retrying RequestUpdate (attempt ${attempt + 1})...`);
                                return requestUpdateAttempt(attempt + 1);
                            } else {
                                throw new Error(`Max retries reached for RequestUpdate`);
                            }
                        });
                }
                return requestUpdateAttempt(1);
            }


            for (let i = 0; i < ScoutsIds.length; i++) {
                RunLoop.push(i * 3)
                RunLoop.push(i * 3 + 1)
                RunLoop.push(i * 3 + 2)
            }

            // Usage in your reduce function
            let Result = RunLoop.reduce((p, x, index) =>
                p.then(() => {
                    if (index % 3 === 0) {
                        return sendScoutWithRetry(playerId, ScoutsIds[parseInt(index / 3)]);
                    } else if (index % 3 === 1) {
                        return getScoutDataWithRetry();
                    } else {
                        return RequestUpdateWithRetry(parseInt(index / 3));
                    }
                }), Promise.resolve());

            Result.then(() => {
                reports = [];
                location.reload();
            });

        });
    }

    /*Build The Scouts Assigned for the job */
    function BuildScoutsForJob(existingScoutMap, requiredData) {
        let ScoutsPowerSet = buildPowerSetMain(requiredData)
        let scoutMap = new Map(existingScoutMap)
        let ScoutsIds = []

        for (let i = 0; i < ScoutsPowerSet.length; i++) {
            if (IsSubSet(requiredData, ScoutsPowerSet[i])) {
                let Result = findSuitableScout(scoutMap, ScoutsPowerSet[i], true, true)
                let ScoutID = Result[0]
                let ScoutSkills = Result[1]
                if (ScoutID) {
                    ScoutsIds.push(ScoutID)
                    scoutMap.delete(ScoutID)
                    requiredData = requiredData.filter((el) => !ScoutSkills.includes(el));
                }
            }
        }
        if (requiredData.length > 0) {
            for (let i = 0; i < ScoutsPowerSet.length; i++) {
                if (IsSubSet(requiredData, ScoutsPowerSet[i])) {
                    let Result = findSuitableScout(scoutMap, ScoutsPowerSet[i], true, false)
                    let ScoutID = Result[0]
                    let ScoutSkills = Result[1]
                    if (ScoutID) {
                        ScoutsIds.push(ScoutID)
                        scoutMap.delete(ScoutID)
                        requiredData = requiredData.filter((el) => !ScoutSkills.includes(el));
                    }
                }
            }
        }
        if (requiredData.length > 0) {
            for (let i = 0; i < ScoutsPowerSet.length; i++) {
                if (IsSubSet(requiredData, ScoutsPowerSet[i])) {
                    let Result = findSuitableScout(scoutMap, ScoutsPowerSet[i], false, false)
                    let ScoutID = Result[0]
                    let ScoutSkills = Result[1]
                    if (ScoutID) {
                        ScoutsIds.push(ScoutID)
                        scoutMap.delete(ScoutID)
                        requiredData = requiredData.filter((el) => !ScoutSkills.includes(el));
                    }
                }
            }
        }
        return ScoutsIds
    }

    /* getRequiredData - get the user required scouting data - dev/pot/phy/tac/tec  */
    function getRequiredData(playerAge) {
        let requiredData = []
        if (PotentialCheckBox.checked) {
            playerAge < 20 ? requiredData.push('youths') : requiredData.push('seniors')
        }
        if (DevelopmentCheckBox.checked) {
            requiredData.push('development')
        }
        if (PhysicalCheckBox.checked) {
            requiredData.push('physical')
        }
        if (TacticalCheckBox.checked) {
            requiredData.push('tactical')
        }
        if (TechnicalCheckBox.checked) {
            requiredData.push('technical')
        }
        return requiredData
    }

    /*find Scout For Specific job */
    function findSuitableScout(scoutMap, requiredData, savingPolicy, eqPolicy) {
        let ScoutID = ''
        let ScoutSkills = []
        for (let [key, scout] of scoutMap.entries()) {
            let Set = savingPolicy ? scout.skills : requiredData
            let PotentialSubSet = savingPolicy ? requiredData : scout.skills
            let eqSkills = Set.sort().join(',') === PotentialSubSet.sort().join(',');
            if (eqPolicy) {
                if (eqSkills) {
                    ScoutID = key;
                    ScoutSkills = scout.skills
                    break;
                }
            }
            else {
                if (IsSubSet(Set, PotentialSubSet)) {
                    ScoutID = key;
                    ScoutSkills = scout.skills
                    break;
                }
            }
        }
        return [ScoutID, ScoutSkills]
    }
    /*Get Scout Info - Request and Build Map Main Function */
    function getScoutInfo(playerId, playerAge) {
        return $.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
            "type": "scout",
            "player_id": playerId
        }, function (response) {
            let data = JSON.parse(response);
            getScout(data, playerAge);
        });
    }

    function getPlayerData(playerId) {
        return $.post('//trophymanager.com/ajax/tooltip.ajax.php', {
            player_id: playerId,
        });
    }

    //check if scout has both youths and seniors
    function checkYthAndSen(scoutSkills, playerAge) {
        let filter = playerAge < 20 ? 'seniors' : 'youths'
        let check = scoutSkills.includes('youths') && scoutSkills.includes('seniors')
        return check ? scoutSkills.filter(item => item !== filter) : scoutSkills
    }

    /*Build the Scout Map */

    function getScout(data, playerAge) {
        for (let propt in data.scouts) {
            let scout = data.scouts[propt];
            let scoutSkills = checkYthAndSen(buildScoutSkills(scout), playerAge)
            if (scout.away == false && scoutSkills.length > 0) {
                scout.skills = scoutSkills
                scoutMap.set(scout.id, scout);
            }
        }
    }

    /*Send Scout */
    function sendScout(player_id, scout_id) {
        return $.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
            "type": "scout",
            "player_id": player_id,
            "scout_id": parseInt(scout_id)
        });
    }

    function sendScoutWithRetry(player_id, scout_id, maxRetries = 10) {
        function sendScoutAttempt(attempt) {
            return Promise.resolve(sendScout(player_id, scout_id))
                .catch(error => {
                    console.error(`Error in sendScout (attempt ${attempt}):`, error);
                    if (attempt < maxRetries) {
                        console.log(`Retrying sendScout (attempt ${attempt + 1})...`);
                        return sendScoutAttempt(attempt + 1);
                    } else {
                        throw new Error(`Max retries reached for sendScout`);
                    }
                });
        }

        return sendScoutAttempt(1);
    }

    /*Build For Each Scout His Skills Array */
    function buildScoutSkills(scout) {
        let scoutSkills = []
        SCOUT_ALL_SKILLS.forEach(skill => {
            if (scout[skill] >= SCOUT_RELIABLE_SKILL[skill]) {
                scoutSkills.push(skill)
            }
        })
        return scoutSkills
    }

    function buildPowerSetMain(requiredData) {
        let PowerSet = buildPowerSet(requiredData)
        return PowerSet.filter(e => e.length);
    }

    /*Build The Power Set - main logic */
    function buildPowerSet(arr) {
        let result = findAllSubsetsoOfGivenSet(arr)
        return result.sort(function (a, b) {
            return b.length - a.length;
        });
    }


    /*Check If Set is a SuSet Of Set - scouts compration */
    function IsSubSet(Set, SubSet) {
        return SubSet.every(val => Set.includes(val));
    }

    // Get Player Report Data//
    function getPlayerReport(playerId) {
        return $.get("//autoscoutproject.com/scout/api/report/read.php", {
            "player_id": playerId
        });
    }

    function hasMixedValues(report) {
        let hasNullValues = false;
        let hasNonNullValues = false;
        for (const key in report) {
            if (report.hasOwnProperty(key)) {
                if (report[key] === null) {
                    hasNullValues = true;
                } else {
                    hasNonNullValues = true;
                }
            }
        }
        return hasNullValues && hasNonNullValues;
    }

    function checkTransferlisted() {
        const divs = $('#transferbox > div');
        for (let i = 0; i < divs.length; i++) {
            const div_text = divs[i].innerText;
            if (div_text.indexOf('is transferlisted') != -1) {
                return true;
            }
        }
        return false;
    }

})();

