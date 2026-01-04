// ==UserScript==
// @name         TW Admin Tools - Tournoi BDF
// @version      1.0
// @description  TW Admin Tools
// @run-at document-idle
// @author       Thathanka Iyothanka
// @include      https://*.the-west.*/*admin.php?screen=character_tool*
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/375943/TW%20Admin%20Tools%20-%20Tournoi%20BDF.user.js
// @updateURL https://update.greasyfork.org/scripts/375943/TW%20Admin%20Tools%20-%20Tournoi%20BDF.meta.js
// ==/UserScript==
(function(fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function() {
  $.get("https://west-tools.alwaysdata.net/admin_tools/config.php", {}, function(res) {
    var config = JSON.parse(res);
    /*
    Object.defineProperty(Object.prototype, "getProp", {
      value: function(prop) {
        var key, self = this;
        for (key in self) {
          if (key.toLowerCase() == prop.toLowerCase()) {
            return self[key];
          }
        }
      },
      //this keeps jquery happy
      enumerable: false
    });
    */
    for (var team in config.teams) {
      for (var j = 0; j < config.teams[team].length; j++) {
        config.teams[team][j] = config.teams[team][j].toLowerCase();
      }
    }
    var html = '<div id="setup_bot_container" style="position:fixed;right:0px;bottom:0px;margin:5px;padding:5px;border:1px solid black;background-color:white;box-shadow:0px 0px 8px 0px black;"><span style="font-size: 12px; font-weight: bold; font-style: italic; color: #4a80da;">Paramétrage automatique</span><br/><span style="color:grey;">' + config.title + '</span><br/><br/>';
    for (var id in config.types) {
      html += '<a href="#" class="setup" id="' + id + '">• ' + config.types[id].name + '<br/></a>';
    }
    html += '</div>';
    $('body').append($(html));
    var player_name = /Character\:\s(.*)/.exec($('h2:last').text())[1];
    if (getTeam(player_name)) {
      $('.setup:not(#' + getTeam(player_name) + ')').css('display', 'none');
    }
    $('.setup').on('click', function() {
      var id = $(this).attr('id');
      setup(config.types[id]);
    });

    $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    };

    function getTeam(name) {
      team = undefined;
      for (var t in config.teams) {
        if (config.teams[t].indexOf(name.toLowerCase()) !== -1) {
          team = t;
        }
      }
      return team;
    }

    function jsonifyForm(form) {
      var formArray = form.serializeArray();
      var returnArray = {};
      for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
      }
      return returnArray;
    }

    var queue = {
      elements: [],
      waiting: true,
      done: false
    };

    function enqueue(form = undefined, data = undefined, url = undefined) {
      queue.elements.push({
        form: form,
        data: data,
        url: url
      });
      if (queue.waiting) {
        start_queue();
      }
    }

    function start_queue() {
      queue.waiting = false;
      var el = queue.elements[0];
      if (!el.data) {
        el.data = jsonifyForm(el.form);
      }
      el.data['csrf_token'] = Cookies.get('csrf_token');
      if (el.form) {
        el.url = el.form.attr('action');
      }
      console.log(el.url);
      console.log(el.data);
      $.ajax({
        type: 'post',
        url: el.url,
        data: el.data
      }).done(function() {
        end_request();
      }).fail(function() {
        end_request();
      });
    }

    function end_request() {
      queue.elements.shift();
      if (queue.elements.length > 0) {
        start_queue();
      } else {
        if (queue.done) {
          $.post('https://west-tools.alwaysdata.net/admin_tools/log.php', {
            content: new Date().toLocaleString() + ' | ' + location.host + ' | ' + $('h2:last').text() + ' => ' + config.title + ' (' + $('#logged strong').text() + ')'
          }, function() {
            location.reload();
            console.log('done');
          });
        } else {
          queue.waiting = true;
        }
      }
    }


    function setup(parameters) {


      $('#setup_bot_container').html('<img src="https://fr14.the-west.fr/images/throbber2.gif"/>');

      var player_id = new RegExp('[\?&]player_id=([^&#]*)').exec($('a[href*="?screen=xp_log"]:not([class])').attr('href'))[1];



      //GM param
      //$('form').eq(11).serialize()
      if (parameters.gm_params !== null) {
        form = $('form').eq(11);
        enqueue(form, parameters.gm_params);
      }

      //Quests
      if (parameters.finish_tutorial) {
        enqueue(undefined, {}, '?screen=quest_tool&action=finish_all_linear&player_id=' + player_id);
      }

      //Overview
      if (parameters.health !== null) {
        $('[name=health]').val(parameters.health);
      }
      if (parameters.energy !== null) {
        $('[name=energy]').val(parameters.energy);
      }
      if (parameters.xp !== null) {
        $('[name=exp]').val(parameters.xp);
      }
      if (parameters.duel_level !== null) {
        $('[name=duel_level]').val(parameters.duel_level);
      }
      if (parameters.alltime_duel_level !== null) {
        $('[name=alltime_duel_level]').val(parameters.alltime_duel_level);
      }
      if (parameters.professionpoints) {
        $('[name=professionpoints]').val(parameters.professionpoints);
      }
      if (parameters.free_skills !== null) {
        $('[name=skillpoints]').val(parameters.free_skills);
      }
      if (parameters.free_attributes !== null) {
        $('[name=attributepoints]').val(parameters.free_attributes);
      }
      if (parameters.money_carry !== null) {
        $('[name=money]').val(parameters.money_carry);
      }
      if (parameters.money_deposit !== null) {
        $('[name=deposit]').val(parameters.money_deposit);
      }
      if (parameters.upb !== null) {
        $('[name=coupons]').val(parameters.upb);
      }
      if (parameters.vet_pts !== null) {
        $('[name=veteran_points]').val(parameters.vet_pts);
      }
      var form = $('form').eq(1);
      enqueue(form);

      //Position
      if (parameters.pos_x !== null && parameters.pos_y !== null) {
        form = $('form').eq(2);
        enqueue(form, {
          x: parameters.pos_x,
          y: parameters.pos_y
        });
      }

      //Town
      if (parameters.town_id !== null && parameters.town_rights !== null) {
        $('[name=town_id]').val(parameters.town_id);
        $('[name=town_rights]').val(parameters.town_rights);
        form = $('form').eq(3);
        enqueue(form);
      }

      //Regen
      if (parameters.health_regen !== null && parameters.energy_regen !== null) {
        form = $('form').eq(8);
        enqueue(form, {
          health_regen: parameters.health_regen,
          energy_regen: parameters.energy_regen
        });
      }

      //Inventory
      if (parameters.inventory !== null) {
        for (var x = 0; x < parameters.inventory.length; x++) {
          enqueue(undefined, {
            add_item_id: parameters.inventory[x][0],
            stacks: parameters.inventory[x][1]
          }, '?screen=inventory_tool&mode=search_player&action=add_item&player_id=' + player_id)
        }
      }

      //Avatar
      if (parameters.avatar !== null) {
        $('[name=avatar][value=old]').click();
        $('#old_avatar_selector').val(parameters.avatar);
        form = $('form').eq(6);
        enqueue(form);
      }

      //Class
      if (!parameters.character_class) {
        parameters.character_class = "greenhorn";
      }

      $('[name=class]').val(parameters.character_class);
      form = $('form').eq(4);
      enqueue(form);

      //Complete other quests

      for (var i = 0; i < parameters.quests.length; i++) {
        var type = parameters.quests[i][0];
        var val = parameters.quests[i][1];
        if (type == 'add') {
          enqueue(undefined, {
            group_id: val
          }, "?screen=quest_tool&action=add_quest&player_id=" + player_id);
        } else if (type == 'finish') {
          enqueue(undefined, {}, "?screen=quest_tool&action=finish_quest&player_id=" + player_id + "&quest_id=" + val);
        }
      }

      queue.done = true;

    }
  });
});
