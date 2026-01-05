// ==UserScript==
// @name        -:C&C TA Chat Colorize:-
// @description Let's change the nickname color (chat only) in dependence of the role in the alliance.
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @icon        http://i.imgur.com/0dweZMu.png
// @version     0.1.6
// @author      der_flake
// @downloadURL https://update.greasyfork.org/scripts/12791/-%3ACC%20TA%20Chat%20Colorize%3A-.user.js
// @updateURL https://update.greasyfork.org/scripts/12791/-%3ACC%20TA%20Chat%20Colorize%3A-.meta.js
// ==/UserScript==
'use strict';
(function ()
{
  var ta_chat_colorize_main = function ()
  {
    function ta_chat_initialize()
    {
      console.log('-:C&C TA Chat Colorize:- loaded');
      var config = {
        colors: [
          {
            name: 'Leader',
            color: '#ff7878'
          },
          {
            name: 'Second Commander',
            color: '#ca91d4'
          },
          {
            name: 'Officer',
            color: '#fdd94b'
          },
          {
            name: 'Veteran',
            color: '#4ec49f'
          },
          {
            name: 'Member',
            color: '#a5f25b'
          },
          {
            name: 'Newbe',
            color: '#a5f25b'
          },
          {
            name: 'Inactive',
            color: '#ababab'
          }
        ],
        append_alliance_name_limit: 15
      };
      var options = {
        colorize_names: true,
        colorize_comments: false,
        append_abbr: true
      };
      // module functions
      var mod = {
        colorize: function () {
          var css_colors = '';
          var role_colors = [
          ];
          var LibData = ClientLib.Data.MainData.GetInstance().get_Alliance();
          // get correct role id
          var alliance_roles = LibData.get_Roles().d;
          for (var akey in alliance_roles)
          {
            for (var ckey in config.colors)
            {
              if (config.colors[ckey].name == alliance_roles[akey].Name) {
                role_colors[alliance_roles[akey].Id] = config.colors[ckey].color;
              }
            }
          }
          // assign styles to the each player of the current alliance

          var players = LibData.get_MemberDataAsArray();
          for (var pkey in players)
          {
            var current_player = players[pkey];
            if (typeof role_colors[current_player.Role] != 'undefined')
            {
              if (options.colorize_comments) {
                css_colors += '[color="#a5f25b"] #CHAT_SENDER_' + current_player.Name + ',[color="#a5f25b"] #CHAT_SENDER_' + current_player.Name + ' + * {color: ' + role_colors[current_player.Role] + '}';
              } else {
                css_colors += '[color="#a5f25b"] #CHAT_SENDER_' + current_player.Name + ' {color: ' + role_colors[current_player.Role] + '}';
              }
            }
          }
          append_styles(css_colors);
        },
        /**
       * Append the alliance abbreviation to the player's name
       * @example der_flake -> #RoF der_flake
       */
        add_abbr: function () {
          //get top [append_alliance_name_limit] alliances by rating
          ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('RankingGetData', {
            firstIndex: 0,
            lastIndex: config.append_alliance_name_limit - 1,
            view: 1,
            rankingType: 0,
            sortColumn: 2,
            ascending: true
          }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, data) {
            if (data !== null)
            {
              for (var i = 0; i < data.a.length; i++)
              {
                var alliance_id = data.a[i]['a'];
                // get alliance players
                ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('GetPublicAllianceInfo', {
                  id: alliance_id
                }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, alliance_data) {
                  var alliance_shortname = alliance_data['a'],
                  alliance_players = alliance_data['m'],
                  css_names = [
                  ];
                  for (var akey in alliance_players)
                  {
                    css_names.push('[color="#4becff"] #CHAT_SENDER_' + alliance_players[akey]['n'] + ':after');
                  }
                  var temp_css = css_names.join(',') + ' {content: " #' + alliance_shortname + '";opacity: .6;font-size: 11px;}';
                  append_styles(temp_css);
                }), null);
              }
            }
          }), null);
        }
      }
      if (options.colorize_names) {
        mod.colorize();
      }
      if (options.append_abbr)
      {
        mod.add_abbr();
      }
    }
    function append_styles(css) {
      document.getElementsByTagName('style') [0].innerHTML += css;
    }
    function tachat_checkIfLoaded() {
      try {
        if (typeof qx != 'undefined') {
          if (qx.core.Init.getApplication() && qx.core.Init.getApplication().getMenuBar()) {
            // @TODO try to find other method to make ClientLib "WORKABLE"
            window.setTimeout(ta_chat_initialize, 15000);
          } else
          window.setTimeout(tachat_checkIfLoaded, 1000);
        } else {
          window.setTimeout(tachat_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log('tachat_checkIfLoaded: ', e);
      }
    }
    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(tachat_checkIfLoaded, 1000);
    }
  }
  var tachatScript = document.createElement('script');
  tachatScript.innerHTML = '(' + ta_chat_colorize_main.toString() + ')();';
  tachatScript.type = 'text/javascript';
  if (/commandandconquer\.com/i.test(document.domain)) {
    document.getElementsByTagName('head') [0].appendChild(tachatScript);
  }
}) ();