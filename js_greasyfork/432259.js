// ==UserScript==
// @name         ScoutReport
// @namespace    https://trophymanager.com
// @version      1.7
// @description  Trophymanager: scout information
// @include      https://trophymanager.com/players/*
// @exclude	     https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432259/ScoutReport.user.js
// @updateURL https://update.greasyfork.org/scripts/432259/ScoutReport.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const REPORT_TABLE_BODY_ID = 'tmvn_script_report_table_body';
    const COLOR = ['Yellow', 'darkblue', 'Black', 'Darkred', 'darkturquoise'];

    const TalentRate = [
        [1.22684101, 1.22684101, 1.206393707, 1.188461538, 1.163636364, 1.148172906, 1.128430388, 1.09875, 1.081617647, 1.066291291, 1.052777778, 1.01690167],
        [1.000673077, 0.978985507, 0.964893617, 0.936580087, 0.909574468, 0.905555556, 0.893269231, 0.863276144, 0.836033724, 0.833712121, 0.819419419, 0.791268299],
        [0.76484375, 0.744627193, 0.737622549, 0.723239437, 0.705, 0.689516908, 0.661842105, 0.662054329, 0.629166667, 0.616497634, 0.595283019, 0.58531746],
        [0.567241379, 0.546296296, 0.524073653, 0.526941489, 0.500609756, 0.485555556, 0.479411765, 0.453048781, 0.432758621, 0.425, 0.408984249, 0.403163752],
        [0.36599923, 0.363104839, 0.359522406, 0.358387698, 0.334583333, 0.342142857, 0.332904412, 0.324857955, 0.321494253, 0.316, 0.306040627, 0.293114863],
        [0.283333333, 0.283515965, 0.284437387, 0.2703125, 0.277295119, 0.267310181, 0.251923077, 0.240769231, 0.236666667, 0.236607143, 0.230625, 0.226215806],
        [0.220881226, 0.215243902, 0.207446809, 0.203061225, 0.204098361, 0.202678571, 0.191346154, 0.182291667, 0.173275862, 0.168644068, 0.175, 0.165],
        [0.16076087, 0.156521739, 0.156081755, 0.15053313, 0.144984505, 0.13943588, 0.133887255, 0.12833863, 0.122790005, 0.117241379, 0.114634146, 0.10754717],
        [0.101031447, 0.094515724, 0.088, 0.086972222, 0.085944444, 0.084916666, 0.083888888, 0.08286111, 0.081833332, 0.080805554, 0.079777776, 0.078749998],
        [0.0725, 0.069970096, 0.067440192, 0.064910288, 0.062380384, 0.05985048, 0.057320576, 0.054790672, 0.052260768, 0.049730864, 0.04720096, 0.044671056],
        [0.042141152, 0.039611248, 0.037081344, 0.03455144, 0.032021536, 0.029491632, 0.026961728, 0.024431818, 0.022904829, 0.02137784, 0.019850851, 0.018323862],
        [0.016796873, 0.015269884, 0.013742895, 0.012215906, 0.010688917, 0.009161928, 0.007634939, 0.00610795, 0.004580961, 0.003053972, 0.001526983, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    var playerId;
    var player = { age: "", months: "", skill_index: "", favposition: "" };


    present();

    // Iniz The Table //
    function present() {
        playerId = player_id.toString()
        let scoutReport =
            "<div class=\"box\">" +
            "<div class=\"box_head\">" +
            "<h2 class=\"std\">SCOUT REPORT</h2>" +
            "</div>" +
            "<div class=\"box_body\">" +
            "<div class=\"box_shadow\"></div>" +
            "<div id=\"Report_content\" class=\"content_menu\"></div>" +
            "</div>" +
            "<div class=\"box_footer\">" +
            "<div></div>" +
            "</div>" +
            "</div>";
        $(".column3_a").append(scoutReport);

        let Report_content = "<table><tbody id='" + REPORT_TABLE_BODY_ID + "'></tbody></table>";
        $("#Report_content").append(Report_content);
        let tbody = $('#' + REPORT_TABLE_BODY_ID)[0];



        /*Recommendation*/
        let trRec = document.createElement('tr');

        let tdRecLabel = document.createElement('td');
        tdRecLabel.innerText = 'Recommendation [5]: ';

        let tdRec = document.createElement('td');
        tdRec.id = 'tdRecommendation';

        colorId(tdRec, 'Rec');

        trRec.appendChild(tdRecLabel);
        trRec.appendChild(tdRec);
        tbody.appendChild(trRec);

        /*Potential*/
        let trPotential = document.createElement('tr');
        trPotential.className = 'odd';

        let tdPotentialLabel = document.createElement('td');
        tdPotentialLabel.innerText = 'Potential [20]: ';

        let tdPotential = document.createElement('td');
        tdPotential.id = 'tdPotential';

        colorId(tdPotential, 'Potential');

        trPotential.appendChild(tdPotentialLabel);
        trPotential.appendChild(tdPotential);
        tbody.appendChild(trPotential);

        /*Skill Potential*/
        let trSkillPotential = document.createElement('tr');

        let tdSkillPotentialLabel = document.createElement('td');
        tdSkillPotentialLabel.innerText = 'Skill Potential: ';

        let tdSkillPotential = document.createElement('td');
        tdSkillPotential.id = 'tdSkillPotential';

        colorId(tdSkillPotential, 'SkillPotential');

        trSkillPotential.appendChild(tdSkillPotentialLabel);
        trSkillPotential.appendChild(tdSkillPotential);
        tbody.appendChild(trSkillPotential);

        /*Skill Potential - ASI*/
        let trSkillPotentialAsi = document.createElement('tr');
        trSkillPotentialAsi.className = 'odd';

        let tdSkillPotentialAsiLabel = document.createElement('td');
        tdSkillPotentialAsiLabel.innerText = 'Skill Potential - ASI: ';

        let tdSkillPotentialAsi = document.createElement('td');
        tdSkillPotentialAsi.id = 'tdSkillPotentialAsi';

        colorId(tdSkillPotentialAsi, 'SkillPotentialAsi');

        trSkillPotentialAsi.appendChild(tdSkillPotentialAsiLabel);
        trSkillPotentialAsi.appendChild(tdSkillPotentialAsi);
        tbody.appendChild(trSkillPotentialAsi);



        /*Bloom Status*/
        let trBloomStatus = document.createElement('tr');


        let tdBloomStatusLabel = document.createElement('td');
        tdBloomStatusLabel.innerText = 'Bloom Status:';

        let tdBloomStatus = document.createElement('td');
        tdBloomStatus.id = 'tdBloomStatus';
        colorId(tdBloomStatus, 'BloomStatus');

        trBloomStatus.appendChild(tdBloomStatusLabel);
        trBloomStatus.appendChild(tdBloomStatus);
        tbody.appendChild(trBloomStatus);


        /*Talent */
        let trTalent = document.createElement('tr');
        trTalent.className = 'odd';

        let tdTalentLabel = document.createElement('td');
        tdTalentLabel.innerText = 'Talent:';

        let tdTalent = document.createElement('td');
        tdTalent.id = 'tdTalent';
        colorId(tdTalent, 'Talent');

        trTalent.appendChild(tdTalentLabel);
        trTalent.appendChild(tdTalent);
        tbody.appendChild(trTalent);

        /*Boost */
        let trBoost = document.createElement('tr');

        let tdBoostLabel = document.createElement('td');
        tdBoostLabel.innerText = 'Boost:';

        let tdBoost = document.createElement('td');
        tdBoost.id = 'tdBoost';
        colorId(tdBoost, 'Boost');

        trBoost.appendChild(tdBoostLabel);
        trBoost.appendChild(tdBoost);
        tbody.appendChild(trBoost);

        /*Physical Peak*/
        let trPhysicalPeak = document.createElement('tr');
        trPhysicalPeak.className = 'odd';

        let tdPhysicalPeakLabel = document.createElement('td');
        tdPhysicalPeakLabel.innerText = 'Physical Peak: ';

        let tdPhysicalPeak = document.createElement('td');
        tdPhysicalPeak.id = 'tdPhysicalPeak';
        tdPhysicalPeak.innerHTML = '<span class="TextPeak" style="color: Yellow"></span><span class="NumberPeak" style="color: Darkred"></span>'
        trPhysicalPeak.appendChild(tdPhysicalPeakLabel);
        trPhysicalPeak.appendChild(tdPhysicalPeak);
        tbody.appendChild(trPhysicalPeak);

        /*Tactical Peak*/
        let trTacticalPeak = document.createElement('tr');

        let tdTacticalPeakLabel = document.createElement('td');
        tdTacticalPeakLabel.innerText = 'Tactical Peak: ';

        let tdTacticalPeak = document.createElement('td');
        tdTacticalPeak.id = 'tdTacticalPeak';

        tdTacticalPeak.innerHTML = '<span class="TextPeak" style="color: Yellow"></span><span class="NumberPeak" style="color: Darkred"></span>';

        trTacticalPeak.appendChild(tdTacticalPeakLabel);
        trTacticalPeak.appendChild(tdTacticalPeak);
        tbody.appendChild(trTacticalPeak);

        /*Technical Peak*/
        let trTechnicalPeak = document.createElement('tr');
        trTechnicalPeak.className = 'odd';

        let tdTechnicalPeakLabel = document.createElement('td');
        tdTechnicalPeakLabel.innerText = 'Technical Peak: ';

        let tdTechnicalPeak = document.createElement('td');
        tdTechnicalPeak.id = 'tdTechnicalPeak';
        tdTechnicalPeak.innerHTML = '<span class="TextPeak" style="color: Yellow"></span><span class="NumberPeak" style="color: Darkred"></span>';


        trTechnicalPeak.appendChild(tdTechnicalPeakLabel);
        trTechnicalPeak.appendChild(tdTechnicalPeak);
        tbody.appendChild(trTechnicalPeak);


        /*Specialty Peak*/
        let trSpecialty = document.createElement('tr');

        let tdSpecialtyLabel = document.createElement('td');
        tdSpecialtyLabel.innerText = 'Specialty: ';

        let tdSpecialty = document.createElement('td');
        tdSpecialty.id = 'tdSpecialty';
        colorId(tdSpecialty, 'Specialty');


        trSpecialty.appendChild(tdSpecialtyLabel);
        trSpecialty.appendChild(tdSpecialty);
        tbody.appendChild(trSpecialty);


        /*Scout Info / Bid Info*/
        let trReportType = document.createElement('tr');
        trReportType.className = 'odd';

        let tdReportTypeLabel = document.createElement('td');
        tdReportTypeLabel.innerText = 'Report Type: ';

        let tdReportType = document.createElement('td');
        tdReportType.id = 'tdReportType';
        colorId(tdReportType, 'Report_Type');

        trReportType.appendChild(tdReportTypeLabel);
        trReportType.appendChild(tdReportType);
        tbody.appendChild(trReportType);

        const nodes = document.querySelectorAll('.column3_a .box')
        const filtered = [...nodes].filter(n => n.textContent.includes('SCOUT REPORT'))
        const box_footer = (filtered[0]).getElementsByClassName('box_footer');
        box_footer[0].style.margin = '-1.5px 0'

        getPlayerSkill(playerId).then((values) => {
            getPlayerReport(playerId);
        });

    }

    // Get Player Report Data//
    function getPlayerReport(playerId) {
        $.get("//autoscoutproject.com/scout/api/report/read.php", {
            "player_id": playerId
        }, function (response) {
            let data = response;
            if (data.boost != null && data.talent != null && data.boost_age != null) {
                updatePotential(data)
            };
            if (data.boost_age != null) {
                updateBloomStatus(data);
            }

            if (data.boost != null && data.talent != null) {
                updateTalentBoost(data);
            };
            if (data.specialty != null) {
                updateSpecialty(data);
            };
            updatePeaks(data);
            updateReportType(data);
        })
    }

    // Get Player Data - age, month , fav pos , skill index
    function getPlayerSkill(playerId) {
        return $.post("//trophymanager.com/ajax/tooltip.ajax.php", {
            "player_id": playerId
        }, function (response) {
            let data = JSON.parse(response);
            player.age = parseInt(data.player.age);
            player.months = parseInt(data.player.months);
            player.skill_index = data.player.skill_index;
            player.favposition = data.player.favposition;
            player.skill_index = getSkillsFromASI(player)
        })
    }

    // Convert ASI to Skill Index //
    function getSkillsFromASI(player) {
        let skill_index = parseInt(player.skill_index.split(",").join(''))
        let index = 0.0;
        let ch = 0.0;
        if (player.favposition == "gk") {
            index = (0.143);
            ch = 0.02979;
        }
        else {
            index = (1 / 6.99998);
            ch = 0.023359;
        }
        skill_index = Math.pow(skill_index, index) / ch;
        skill_index = skill_index.toFixed(1);
        return skill_index
    }

    // Calc Future Skill Potential//
    function calcSkillPotential(data) {
        let talent = parseFloat(data.talent);
        let boost = parseFloat(data.boost);
        let boost_age = parseInt(data.boost_age);
        let skills = parseFloat(player.skill_index);
        let boost_per = player.age > (boost_age + 2) ? 0 : player.age < (boost_age) ? 36 : (1 + (boost_age + 3 - player.age - 1) * 12 + (11 - player.months))
        let SkillPotential = TalentRate[player.age - 15][player.months] * talent + (boost * boost_per / 36) + skills;
        return Math.round(SkillPotential)
    }

    function calcSkillPotentialAsi(skillPotential) {
        const skillsl_count = player.favposition == "gk" ? 11 : 14;
        const skill_index_number = Math.round(Math.pow(skillPotential / skillsl_count * 14 * 0.023359, 6.99998));
        const skill_index = skill_index_number.toLocaleString();
        return skill_index;
    }



    // Calc Potentiel 1-20  //
    function calcPotentiel(SkillPotential) {
        let Rec = ''
        if (player.favposition != "gk") {
            if (SkillPotential > 219) {
                Rec = '20';
                return Rec;
            }
            if (SkillPotential > 199) {
                Rec = '19';
                return Rec;
            }
            if (SkillPotential > 189) {
                Rec = '18';
                return Rec;
            }
            if (SkillPotential > 179) {
                Rec = '17';
                return Rec;
            }
            if (SkillPotential > 169) {
                Rec = '16';
                return Rec;
            }
            if (SkillPotential > 159) {
                Rec = '15';
                return Rec;
            }
            if (SkillPotential > 149) {
                Rec = '14';
                return Rec;
            }
            if (SkillPotential > 139) {
                Rec = '13';
                return Rec;
            }

            if (SkillPotential <= 139) {
                Rec = 'Below 13';
                return Rec;
            }
        }
        else {
            if (SkillPotential > 172) {
                Rec = '20';
                return Rec;
            }
            if (SkillPotential > 157) {
                Rec = '19';
                return Rec;
            }
            if (SkillPotential > 149) {
                Rec = '18';
                return Rec;
            }
            if (SkillPotential > 141) {
                Rec = '17';
                return Rec;
            }
            if (SkillPotential > 133) {
                Rec = '16';
                return Rec;
            }
            if (SkillPotential > 125) {
                Rec = '15';
                return Rec;
            }
            if (SkillPotential > 117) {
                Rec = '14';
                return Rec;
            }
            if (SkillPotential > 109) {
                Rec = '13';
                return Rec;
            }

            if (SkillPotential <= 109) {
                Rec = 'Below 13';
                return Rec;
            }
        }
    }


    // Calc Potentiel Recommendation  //
    function calcRecommendation(SkillPotential) {
        let Potential = ''
        if (player.favposition != "gk") {

            if (SkillPotential > 209) {
                Potential = '5.0';
                return Potential;
            }
            if (SkillPotential > 179) {
                Potential = '4.5';
                return Potential;
            }

            if (SkillPotential > 159) {
                Potential = '4.0';
                return Potential;
            }
            if (SkillPotential > 139) {
                Potential = '3.5';
                return Potential;
            }
            if (SkillPotential <= 139) {
                Potential = 'Below 3.5';
                return Potential;
            }
        }
        else {
            if (SkillPotential > 164) {
                Potential = '5.0';
                return Potential;
            }
            if (SkillPotential > 141) {
                Potential = '4.5';
                return Potential;
            }

            if (SkillPotential > 125) {
                Potential = '4.0';
                return Potential;
            }
            if (SkillPotential > 109) {
                Potential = '3.5';
                return Potential;
            }
            if (SkillPotential <= 109) {
                Potential = 'Below 3.5';
                return Potential;
            }
        }
    }


    // Update Potential In The Report //
    function updatePotential(data) {
        let tdRec = document.getElementById("tdRecommendation");
        let tdPotential = document.getElementById("tdPotential");
        let tdSkillPotential = document.getElementById("tdSkillPotential");
        let tdSkillPotentialAsi = document.getElementById("tdSkillPotentialAsi");

        let SkillPotential = calcSkillPotential(data);
        let SkillPotentialAsi = calcSkillPotentialAsi(SkillPotential);

        tdRec.innerText = calcRecommendation(SkillPotential);
        tdPotential.innerText = calcPotentiel(SkillPotential);
        tdSkillPotential.innerText = SkillPotential;
        tdSkillPotentialAsi.innerText = SkillPotentialAsi;
    }

    // Update Bloom Status In The Report //
    function updateBloomStatus(data) {
        let tdBloomStatus = document.getElementById("tdBloomStatus");
        tdBloomStatus.innerText = data.boost_age + ".00 - " + (parseInt(data.boost_age) + 2).toString() + ".11"
    }

    // Update Talent & Boost In The Report //
    function updateTalentBoost(data) {
        let tdTalent = document.getElementById("tdTalent");
        let tdBoost = document.getElementById("tdBoost");
        tdTalent.innerText = data.talent;
        tdBoost.innerText = data.boost;

    }

    function updateSpecialty(data) {
        let tdSpecialty = document.getElementById("tdSpecialty");
        tdSpecialty.innerText = data.specialty;
    }

    function updateReportType(data) {
        let tdReportType = document.getElementById("tdReportType");
        tdReportType.innerText = data.report_type;
    }

    // Update Peaks In The Report //

    function updatePeaks(data) {
        let tdPhysicalPeakText = document.getElementById("tdPhysicalPeak").getElementsByClassName("TextPeak")[0];
        let tdPhysicalPeakNumber = document.getElementById("tdPhysicalPeak").getElementsByClassName("NumberPeak")[0];



        let tdTacticalPeakText = document.getElementById("tdTacticalPeak").getElementsByClassName("TextPeak")[0];
        let tdTacticalPeakNumber = document.getElementById("tdTacticalPeak").getElementsByClassName("NumberPeak")[0];


        let tdTechnicalPeakText = document.getElementById("tdTechnicalPeak").getElementsByClassName("TextPeak")[0];
        let tdTechnicalPeakNumber = document.getElementById("tdTechnicalPeak").getElementsByClassName("NumberPeak")[0];

        if (data.phy != null) {
            tdPhysicalPeakText.innerText = getPeakText(data.phy, "Physical");
            tdPhysicalPeakNumber.innerText = "(" + data.phy + ")";
        };

        if (data.tac != null) {
            tdTacticalPeakText.innerText = getPeakText(data.tac, "Tactical");
            tdTacticalPeakNumber.innerText = "(" + data.tac + ")";
        }
        if (data.tec != null) {
            tdTechnicalPeakText.innerText = getPeakText(data.tec, "Technical");
            tdTechnicalPeakNumber.innerText = "(" + data.tec + ")";
        }
    }

    // Get Peaks Text //
    function getPeakText(peakStr, peak_type) {
        let peak = parseInt(peakStr);
        let peak_text = ''
        let peak_options = ['Splendid  ', 'Good  ', 'Ok  ', 'Poor  ']
        if (['Physical', 'Tactical'].includes(peak_type)) {
            if (peak > 69) {
                peak_text = peak_options[0]
            }
            if (peak > 59 && peak < 70) {
                peak_text = peak_options[1]
            }
            if (peak > 49 && peak < 60) {
                peak_text = peak_options[2]
            }
            if (peak < 50) {
                if (peak_type == "Physical") {
                    peak_text = 'Weak  '
                }
                else {
                    peak_text = peak_options[3]
                }
            }
        }

        if (['Technical'].includes(peak_type)) {
            if (peak > 104) {
                peak_text = peak_options[0]
            }
            if (peak > 89 && peak < 105) {
                peak_text = peak_options[1]
            }
            if (peak > 74 && peak < 90) {
                peak_text = peak_options[2]
            }
            if (peak < 75) {
                peak_text = peak_options[3]
            }
        }
        return peak_text;
    }


    // Set Color For TD //
    function colorId(td, type) {

        if (['Specialty', 'Report_Type'].includes(type)) {
            td.style.color = COLOR[4];
            return;
        }

        if (['Potential', 'Rec', 'SkillPotential', 'SkillPotentialAsi'].includes(type)) {
            td.style.color = COLOR[3];
            return;
        }
        if (['BloomStatus'].includes(type)) {
            td.style.color = COLOR[2];
            return;
        }

        if (['Talent', 'Boost'].includes(type)) {
            td.style.color = COLOR[1];
            return;
        }

    }


})();
