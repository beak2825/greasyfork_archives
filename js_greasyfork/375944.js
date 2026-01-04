// ==UserScript==
// @name         TW Admin Tools - Trader Tool
// @version      1.0
// @description  Trader tool
// @author       Thathanka Iyothanka
// @include      https://*.the-west.*/*admin.php?screen=town_tool&town_id=*
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/375944/TW%20Admin%20Tools%20-%20Trader%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/375944/TW%20Admin%20Tools%20-%20Trader%20Tool.meta.js
// ==/UserScript==
(function(fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function() {
  $.get("https://west-tools.alwaysdata.net/admin_tools/config_trader.php", {}, function(res) {
    var config = JSON.parse(res);

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
    var html = '<div id="setup_bot_container" style="position:fixed;right:0px;bottom:0px;margin:5px;padding:5px;border:1px solid black;background-color:white;box-shadow:0px 0px 8px 0px black;"><span style="font-size: 12px; font-weight: bold; font-style: italic; color: #4a80da;">Paramétrage automatique</span><br/><span style="color:grey;">' + config.title + '</span><br/><br/>';
    html += '<a href="#" id="setup">Paramétrer les magasins de la ville<br/></a>';
    html += '</div>';
    $('body').append($(html));
    $('#setup').on('click', function() {
      setup();
    });

    $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    };

    function setup() {


      $('#setup_bot_container').html('<img src="https://fr14.the-west.fr/images/throbber2.gif"/>');

      var town_id = $.urlParam('town_id');
      var shops = ['general', 'gunsmith', 'tailor'];

      function request(shop, i) {
        if (shop == shops.length && i == -1) {
          $.post('https://west-tools.alwaysdata.net/admin_tools/log.php', {
            content: new Date().toLocaleString() + ' | ' + location.host + ' | ' + town_id + ' paramétrée (' + $('#logged strong').text() + ')'
          }, function() {
            location.reload();
          });
        } else if (config.items[shops[shop]].length == i) {
          request(shop + 1, -1);
        } else if (i == -1) {
          $.ajax({
            type: 'post',
            url: '?screen=trader_tool&action=delete_all_items&town_id=' + town_id + '&trader=' + shops[shop],
            data: {
              csrf_token: Cookies.get('csrf_token')
            }
          }).done(function() {
            request(shop, i + 1);
          }).fail(function() {
            request(shop, i + 1);
          });
        } else {
          $.ajax({
            type: 'post',
            url: '?screen=trader_tool&action=add_item&town_id=' + town_id + '&trader=' + shops[shop],
            data: {
              add_item_id: config.items[shops[shop]][i],
              csrf_token: Cookies.get('csrf_token')
            }
          }).done(function() {
            request(shop, i + 1);
          }).fail(function() {
            request(shop, i + 1);
          });
        }
      }

      request(0, -1);

    }
  });
});
