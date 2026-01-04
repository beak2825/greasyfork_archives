// ==UserScript==
// @name         ManualReport
// @namespace    https://trophymanager.com
// @version      1.6.1
// @description  Trophymanager: synthesize scout information, calculate skill peak
// @include      https://trophymanager.com/players/*
// @exclude	     https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432365/ManualReport.user.js
// @updateURL https://update.greasyfork.org/scripts/432365/ManualReport.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const MANUAL_REPORT_TABLE_BODY_ID = 'tmvn_script_manual_report_table_body';

  const SPECIALTY_ARRAY_FIELD_PLAYER = new Map([
    ['1', 'Strength'],
    ['2', 'Stamina'],
    ['3', 'Pace'],
    ['4', 'Marking'],
    ['5', 'Tackling'],
    ['6', 'Workrate'],
    ['7', 'Positioning'],
    ['8', 'Passing'],
    ['9', 'Crossing'],
    ['10', 'Technique'],
    ['11', 'Heading'],
    ['12', 'Finishing'],
    ['13', 'Longshots'],
    ['14', 'Set Pieces'],
  ]);

  const SPECIALTY_ARRAY_GK_PLAYER = new Map([
    ['1', 'Strength'],
    ['2', 'Stamina'],
    ['3', 'Pace'],
    ['4', 'Handling'],
    ['5', 'One-On-Ones'],
    ['6', 'Reflexes'],
    ['7', 'Aerial Ability'],
    ['8', 'Jumping'],
    ['9', 'Communication'],
    ['10', 'Kicking'],
    ['11', 'Throwing'],
  ]);

  var playerId;

  present();

  /*Main Ui Function  - present the input form props */
  function present() {
    playerId = player_id.toString();

    let ManualReportDiv =
      '<div class="box">' +
      '<div class="box_head">' +
      '<h2 class="std">Manual report</h2>' +
      '</div>' +
      '<div class="box_body">' +
      '<div class="box_shadow"></div>' +
      '<div id="BidUpdateButton" class="Update Bid Info"></div>' +
      '</div>' +
      '<div class="box_footer">' +
      '<div></div>' +
      '</div>' +
      '</div>';

    $('.column1').append(ManualReportDiv);

    // $('#ManualUpdateButton').attr(
    //   'style',
    //   'text-align: center; padding-top: 0px; margin-top: 10px;margin-bottom: 10px;'
    // );

    // let ManualUpdateButton =
    //   '<span class="button"  style="width:170px; text-align:left;"><span class="button_border" style="width:168px;text-align: center ; padding: 0;">&nbsp;<img src="/pics/binoc.png">&nbsp;&nbsp;Update Info</span></span>';

    // $('#ManualUpdateButton').append(ManualUpdateButton);

    // let ManualUpdate_content =
    //   "<table><tbody id='" + MANUAL_REPORT_TABLE_BODY_ID + "'></tbody></table>";
    // $('#ManualUpdate_content').append(ManualUpdate_content);
    let tbody = $('#' + MANUAL_REPORT_TABLE_BODY_ID)[0];

    // /*Boost Age*/
    // let trMRBoost_Age = document.createElement('tr');
    // trMRBoost_Age.className = 'odd';

    // let tdMRBoost_AgeLabel = document.createElement('td');
    // tdMRBoost_AgeLabel.innerHTML = '&nbsp;Boost Age:';

    // let tdMRBoost_Age = document.createElement('td');

    // let Boost_Age_Input = document.createElement('input');
    // setInput(Boost_Age_Input, 'Boost_Age_Input', 16, 22, 18);
    // tdMRBoost_Age.appendChild(Boost_Age_Input);
    // trMRBoost_Age.appendChild(tdMRBoost_AgeLabel);
    // trMRBoost_Age.appendChild(tdMRBoost_Age);

    // tbody.appendChild(trMRBoost_Age);

    // /*Talent */
    // let trMRTalent = document.createElement('tr');

    // let tdMRTalentLabel = document.createElement('td');
    // tdMRTalentLabel.innerHTML = '&nbsp;Talent:';

    // let tdMRTalent = document.createElement('td');

    // let Talent_Input = document.createElement('input');
    // setInput(Talent_Input, 'Talent_Input', 1, 120, 50);
    // tdMRTalent.appendChild(Talent_Input);
    // trMRTalent.appendChild(tdMRTalentLabel);
    // trMRTalent.appendChild(tdMRTalent);

    // tbody.appendChild(trMRTalent);

    // /*Boost */
    // let trMRBoost = document.createElement('tr');
    // trMRBoost.className = 'odd';

    // let tdMRBoostLabel = document.createElement('td');
    // tdMRBoostLabel.innerHTML = '&nbsp;Boost:';

    // let tdMRBoost = document.createElement('td');

    // let Boost_Input = document.createElement('input');
    // setInput(Boost_Input, 'Boost_Input', 1, 120, 50);
    // tdMRBoost.appendChild(Boost_Input);
    // trMRBoost.appendChild(tdMRBoostLabel);
    // trMRBoost.appendChild(tdMRBoost);

    // tbody.appendChild(trMRBoost);

    // /*Physical */
    // let trMRPhysical = document.createElement('tr');

    // let tdMRPhysicalLabel = document.createElement('td');
    // tdMRPhysicalLabel.innerHTML = '&nbsp;Physical:';

    // let tdMRPhysical = document.createElement('td');

    // let Physical_Input = document.createElement('input');
    // setInput(Physical_Input, 'Physical_Input', 30, 80, 50);
    // tdMRPhysical.appendChild(Physical_Input);
    // trMRPhysical.appendChild(tdMRPhysicalLabel);
    // trMRPhysical.appendChild(tdMRPhysical);

    // tbody.appendChild(trMRPhysical);

    // /*Tactical */
    // let trMRTactical = document.createElement('tr');
    // trMRTactical.className = 'odd';

    // let tdMRTacticalLabel = document.createElement('td');
    // tdMRTacticalLabel.innerHTML = '&nbsp;Tactical:';

    // let tdMRTactical = document.createElement('td');

    // let Tactical_Input = document.createElement('input');
    // setInput(Tactical_Input, 'Tactical_Input', 30, 80, 50);
    // tdMRTactical.appendChild(Tactical_Input);
    // trMRTactical.appendChild(tdMRTacticalLabel);
    // trMRTactical.appendChild(tdMRTactical);

    // tbody.appendChild(trMRTactical);

    // /*Technical */
    // let trMRTechnical = document.createElement('tr');

    // let tdMRTechnicalLabel = document.createElement('td');
    // tdMRTechnicalLabel.innerHTML = '&nbsp;Technical:';

    // let tdMRTechnical = document.createElement('td');

    // let Technical_Input = document.createElement('input');
    // setInput(Technical_Input, 'Technical_Input', 40, 120, 60);
    // tdMRTechnical.appendChild(Technical_Input);
    // trMRTechnical.appendChild(tdMRTechnicalLabel);
    // trMRTechnical.appendChild(tdMRTechnical);

    // tbody.appendChild(trMRTechnical);

    // /*Specialty */
    // let trMRSpecialty = document.createElement('tr');
    // trMRSpecialty.className = 'odd';

    // let tdMRSpecialtyLabel = document.createElement('td');
    // tdMRSpecialtyLabel.innerHTML = '&nbsp;Specialty:';

    // let tdMRSpecialty = document.createElement('td');

    // let Specialty_Select = document.createElement('select');
    // setSpecialty(Specialty_Select, 'Specialty_Select');
    // setOptions(Specialty_Select);

    // tdMRSpecialty.appendChild(Specialty_Select);
    // trMRSpecialty.appendChild(tdMRSpecialtyLabel);
    // trMRSpecialty.appendChild(tdMRSpecialty);

    // tbody.appendChild(trMRSpecialty);

    $('#BidUpdateButton').attr(
      'style',
      'text-align: center; padding-top: 10px;padding-bottom: 10px;'
    );

    let BidUpdateButton =
      '<span class="button" id="BidUpdateButtonSpan" style="width:170px; text-align:left;"><span class="button_border" style="width:168px;text-align: center ; padding: 0;">&nbsp;<img src="/pics/icons/button_yellow.gif">&nbsp;&nbsp;Bid Update Info</span></span>';

    getPlayerData(playerId).then((values) => {
      let data = JSON.parse(values);
      if (checkDisable(data.club.a_team, data.club.id)) {
        $('#BidUpdateButtonSpan').hide();
      } else {
        $('#BidUpdateButton').append(BidUpdateButton);
        $('#BidUpdateButton > span.button').on('click', function () {
          getBidInfo(playerId).then((values) => {
            let data = JSON.parse(values);
            let Data = getPlayerDataFromBid(data.debug);
            updateInfo(Data);
          });
        });
      }
    });


  }

  function getPlayerData(playerId) {
    return $.post('//trophymanager.com/ajax/tooltip.ajax.php', {
      player_id: playerId,
    });
  }

  //set input style and attr//
  function setInput(input, id, min, max, default_value) {
    input.type = 'number';
    input.id = id;
    input.min = min;
    input.max = max;
    input.value = default_value;
    input.style.width = '45px';
    input.style.background = 'transparent';
    input.style.color = 'white';
    input.style.border = 'none';
    input.style.float = 'right';
    return;
  }

  // set select style and options //
  function setSpecialty(select, id) {
    select.id = id;
    select.style.color = 'white';
    select.style.border = 'none';
    select.style.background = '#649024';
    select.style.float = 'right';
    select.style['text-align'] = 'center';
    select.style['max-width'] = '85px';
  }

  // set options for select //

  function setOptions(select) {
    let skillsArray =
      player_fp == 'gk'
        ? SPECIALTY_ARRAY_GK_PLAYER
        : SPECIALTY_ARRAY_FIELD_PLAYER;
    for (let value of skillsArray.values()) {
      var option = document.createElement('option');
      option.text = value;
      option.value = value;
      select.appendChild(option);
    }
  }

  function checkDisable(player_club_id, player_club_id_2) {
    let club_id = SESSION.main_id;
    if (club_id == player_club_id || player_club_id == '' || player_club_id == undefined || player_club_id_2 == undefined) {
      return true;
    }
    if (club_id == player_club_id_2) {
      return true;
    } else {
      let p_array = $('#transferbox > p');
      for (let i = 0; i < p_array.length; i++) {
        if (p_array[i].innerText == 'This player is not for sale.') {
          return true;
        }
      }
      let divs = $('#transferbox > div');
      for (let i = 0; i < divs.length; i++) {
        let div_text = divs[i].innerText;
        if (div_text.indexOf('is transferlisted') != -1) {
          return true;
        }
        if (div_text.indexOf('Transfer expired.') != -1) {
          return true;
        }
      }
    }
    return false;
  }

  // get report data - get user info //
  function getData() {
    let report = {};
    report['player_id'] = playerId;
    report['boost_age'] = document.getElementById('Boost_Age_Input').value;
    report['talent'] = document.getElementById('Talent_Input').value;
    report['boost'] = document.getElementById('Boost_Input').value;
    report['phy'] = document.getElementById('Physical_Input').value;
    report['tac'] = document.getElementById('Tactical_Input').value;
    report['tec'] = document.getElementById('Technical_Input').value;
    report['specialty'] = document.getElementById('Specialty_Select').value;
    return report;
  }

  // get report data - get user info //
  function getPlayerDataFromBid(data) {
    let report = {};
    report['player_id'] = playerId;
    report['boost_age'] = data.boost_age;
    report['talent'] = data.talent;
    report['boost'] = data.boost;
    report['phy'] = data.peak_phy;
    report['tac'] = data.peak_tac;
    report['tec'] = data.peak_tec;
    if (data.favposition == 'gk') {
      report['specialty'] = SPECIALTY_ARRAY_GK_PLAYER.get(data.specialist);
    } else {
      report['specialty'] = SPECIALTY_ARRAY_FIELD_PLAYER.get(data.specialist);
    }
    return report;
  }

  // update info//
  function updateInfo(data) {
    deleteReports(playerId).then((values) => {
      postReport(data).then((values) => {
        location.reload();
      });
    });
  }

  function getBidInfo(playerId) {
    return $.post('//trophymanager.com/ajax/transfer_bids.ajax.php', {
      player_id: playerId,
      type: 'approach',
      bid: 99999999999999999999,
      text: '',
    });
  }

  // delete all reports - promise//
  function deleteReports(playerId) {
    let data = {};
    data['player_id'] = playerId;
    var dataJSON = JSON.stringify(data);
    return $.ajax({
      type: 'POST',
      url: 'https://autoscoutproject.com/scout/api/report/delete.php',
      data: dataJSON,
      ContentType: 'application/json',
      success: function () {
        console.log('Finished');
      },
      error: function (e) {
        console.log('Fail , Error: ');
        console.log(e);
      },
    });
  }

  //post report - promise//
  function postReport(report) {
    var reportJSON = JSON.stringify(report);
    return $.ajax({
      type: 'POST',
      url: 'https://autoscoutproject.com/scout/api/report/create.php',
      data: reportJSON,
      ContentType: 'application/json',
      success: function () {
        console.log('Finished');
      },
      error: function (e) {
        console.log('Fail , Error: ');
        console.log(e);
      },
    });
  }
})();
