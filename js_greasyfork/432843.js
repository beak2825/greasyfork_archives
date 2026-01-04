// ==UserScript==
// @name         InsertRemoveShortlist
// @namespace    https://trophymanager.com
// @version      1.9.1
// @description  Trophymanager: synthesize scout information, calculate skill peak
// @include      https://trophymanager.com/players/*
// @exclude	     https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432843/InsertRemoveShortlist.user.js
// @updateURL https://update.greasyfork.org/scripts/432843/InsertRemoveShortlist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const InsertRemoveShortlist_TABLE_BODY_ID =
    'tmvn_script_InsertRemoveShortlist_table_body';
  var playerId;

  let updateTime = new Date(Date.now());
  updateTime =
    updateTime.toDateString() + ' ' + updateTime.toLocaleTimeString();



  present();

  /*Main Ui Function  - present the Insert/Remove From Shortlist */
  function present() {
    playerId = player_id.toString();

    let ShortListDiv =
      '<div class="box">' +
      '<div class="box_head">' +
      '<h2 class="std">Shortlist</h2>' +
      '</div>' +
      '<div class="box_body">' +
      '<div class="box_shadow"></div>' +
      '<div id="ShortlistButton" class="ScoutButton"></div>' +
      '</div>' +
      '<div class="box_footer">' +
      '<div></div>' +
      '</div>' +
      '</div>';
    $('.column1').append(ShortListDiv);

    $('#ShortlistButton').attr(
      'style',
      'text-align: center; padding-top: 10px;padding-bottom: 10px;'
    );

    let AddToShortlistButton =
      '<span class="button"  style="width:170px; text-align:left;"><span class="button_border" style="width:168px;text-align: center ; padding: 0;">&nbsp;<img src="/pics/icons/clips.gif">&nbsp;&nbsp;Add To Shortlist</span></span>';
    let RemoveFromShortlistButton =
      '<span class="button"  style="width:170px; text-align:left;"><span class="button_border" style="width:168px;text-align: center ; padding: 0;">&nbsp;<img src="/pics/small_red_x.png">&nbsp;&nbsp;Remove from shortlist</span></span>';

    CheckPlayerInShortlist(playerId).then((shortlist_values) => {
      shortlist_values.player_id == null
        ? $('#ShortlistButton').append(AddToShortlistButton)
        : $('#ShortlistButton').append(RemoveFromShortlistButton);
      getPlayerData(playerId).then((tooltip_values) => {
        let data = JSON.parse(tooltip_values);
        let player = setPlayerInfo(data.player);
        $('#ShortlistButton > span.button').on('click', function () {
          if (shortlist_values.player_id == null) {
            insertToShortlist(player).then((values) => {
              location.reload();
            });
          } else {
            removeFromShortlist(player).then((values) => {
              location.reload();
            });
          }
        });
      });
    });
  }

  // Check If Player is in the ShortList
  function CheckPlayerInShortlist(playerId) {
    return $.get('//autoscoutproject.com/scout/api/shortlist/read_single.php', {
      player_id: playerId,
    });
  }

  // Get Player Data - age, month , fav pos , skill index
  function getPlayerData(playerId) {
    return $.post('//trophymanager.com/ajax/tooltip.ajax.php', {
      player_id: playerId,
    });
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

  //insert player to shortlist - promise//
  function insertToShortlist(player) {
    var playerJSON = JSON.stringify(player);
    return $.ajax({
      type: 'POST',
      url: 'https://autoscoutproject.com/scout/api/shortlist/create.php',
      data: playerJSON,
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

  // remove player from shortlist - promise //
  function removeFromShortlist(player) {
    let data = {};
    data['player_id'] = player.player_id;
    var dataJSON = JSON.stringify(data);
    return $.ajax({
      type: 'POST',
      url: 'https://autoscoutproject.com/scout/api/shortlist/delete.php',
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
})();
