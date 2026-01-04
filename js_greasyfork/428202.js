// ==UserScript==
// @name         AutoScouting V1.0
// @namespace    https://trophymanager.com
// @version      1
// @description  Trophymanager: synthesize scout information, calculate skill peak
// @include      https://trophymanager.com/players/*
// @exclude	     https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428202/AutoScouting%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/428202/AutoScouting%20V10.meta.js
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




        /*Note*/
        let trNote = document.createElement('tr');
        let tdNote = document.createElement('td');
        tdNote.colSpan = 2;
        tdNote.innerText = 'Set scout\'s trust level by TMVN Player Train script';
        tdNote.style = 'color:Darkgray; font-size:smaller; font-style:italic';

        trNote.appendChild(tdNote);
        tbody.appendChild(trNote);
        $("#sendScoutButton > span.button").on("click", function () {
            let requiredData = getRequiredData()
            SendScouts(requiredData)
        })
    }

    /*SendScouts - Send Scout On The Player */
    function SendScouts(requiredData) {
        getScoutInfo(playerId).then((values) => {


            let ScoutsIds = BuildScoutsForJob(scoutMap, requiredData)
            let RunLoop = []
            var reports = []
            ScoutsIds.forEach(value => {
                let scout = scoutMap.get(value)
                console.log(scout.name + " " + scout.surname)
            })

            /*Job For The Summer
            - Build Service That Inserts Into DB (getToolTip is example)
            - When Service Is Ready Build Objects For The Request Using getScoutData
            */

            function getScoutData() {
                return $.post("//trophymanager.com/ajax/scouts_get_reports.ajax.php", {
                }, function (response) {
                    let data = JSON.parse(response);
                    reports.push(data[0])
                });
            }
            function getToolTip(player_id) {
                return $.post("//trophymanager.com/ajax/tooltip.ajax.php", {
                    "player_id": player_id
                }, function (response) {
                    console.log("Finished ToolTip")
                });
            }

            function RequestUpdate(index) {
                let report = reports[index]
                //return getToolTip(parseInt(report.playerid))
            }

            for (let i = 0; i < ScoutsIds.length; i++) {
                RunLoop.push(i * 3)
                RunLoop.push(i * 3 + 1)
                RunLoop.push(i * 3 + 2)
            }

            let Result = RunLoop.reduce(
                (p, x, index) =>
                    p.then(_ =>
                        index % 3 == 0 ? sendScout(playerId, ScoutsIds[parseInt(index / 3)]) : index % 3 == 1 ? getScoutData() : RequestUpdate(parseInt(index / 3))
                    ),
                Promise.resolve()
            )
            Result.then((values) => {
                reports = []
                location.reload();
            })

        });
    }

    /*Build The Scouts Assigned for the job */
    function BuildScoutsForJob(existingScoutMap, requiredData) {
        let ScoutsPowerSet = buildPowerSetMain(requiredData)
        let scoutMap = new Map(existingScoutMap)
        let ScoutsIds = []
        for (let i = 0; i < ScoutsPowerSet.length; i++) {
            if (IsSubSet(requiredData, ScoutsPowerSet[i])) {
                let Result = findSuitableScout(scoutMap, ScoutsPowerSet[i], true)
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
                    let Result = findSuitableScout(scoutMap, ScoutsPowerSet[i], false)
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
    function getRequiredData() {
        let requiredData = []
        if (PotentialCheckBox.checked) {
            let age_text = ($("td:contains(Years)")[0]).textContent
            let yearidx = age_text.search(/\d\d/);
            let year = parseInt(age_text.substr(yearidx, 2));
            year < 20 ? requiredData.push('youths') : requiredData.push('seniors')
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
    function findSuitableScout(scoutMap, requiredData, savingPolicy) {
        let ScoutID = ''
        let ScoutSkills = []
        for (let [key, scout] of scoutMap.entries()) {
            let Set = savingPolicy ? scout.skills : requiredData
            let PotentialSubSet = savingPolicy ? requiredData : scout.skills
            if (IsSubSet(Set, PotentialSubSet)) {
                ScoutID = key;
                ScoutSkills = scout.skills
                break;
            }
        }
        return [ScoutID, ScoutSkills]
    }
    /*Get Scout Info - Request and Build Map Main Function */
    function getScoutInfo(playerId) {
        return $.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
            "type": "scout",
            "player_id": playerId
        }, function (response) {
            let data = JSON.parse(response);
            getScout(data);
        });
    }
    /*Build the Scout Map */

    function getScout(data) {
        for (let propt in data.scouts) {
            let scout = data.scouts[propt];
            let scoutSkills = buildScoutSkills(scout)
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
        PowerSet = SortPowerSet(PowerSet)
        return PowerSet.filter(e => e.length);
    }

    /*Build The Power Set - main logic */
    function buildPowerSet(arr) {
        let result = findAllSubsetsoOfGivenSet(arr)
        return result.sort(function (a, b) {
            return b.length - a.length;
        });
    }

    /*Sort The Power Set  */
    function SortPowerSet(arr) {
        let result = []
        arr.forEach(elem => {
            if (elem.includes('development')) {
                result.push(elem)
            }
        })
        arr.forEach(elem => {
            if (!elem.includes('development')) {
                result.push(elem)
            }
        })
        return result
    }

    /*Check If Set is a SuSet Of Set - scouts compration */
    function IsSubSet(Set, SubSet) {
        return SubSet.every(val => Set.includes(val));
    }




})();

