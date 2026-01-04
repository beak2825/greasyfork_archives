// ==UserScript==
// @name          smskcntr Script v4
// @description   simsekcountr
// @include         http://www.erepublik.com/*
// @include	        http://ww*.erepublik.com/*
// @include	        https://ww*.erepublik.com/*
// @include			http://erepublik.com/*
// @include			https://erepublik.com/*
// @include			https://*.erepublik.com/*
// @include			http://www.erepublik.com/*
// @include			https://www.erepublik.com/*/military/battlefield-new/*
// @exclude	http://www.erepublik.com/TTE
// @version         5.1
// @license			LGPL http://www.gnu.org/licenses/lgpl.html
// @namespace https://greasyfork.org/users/29736
// @downloadURL https://update.greasyfork.org/scripts/34014/smskcntr%20Script%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/34014/smskcntr%20Script%20v4.meta.js
// ==/UserScript==
function addJQuery(callback) {
  var script = document.createElement('script');
  script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js');
  script.addEventListener('load', function () {
    var script = document.createElement('script');
    script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}
addJQuery(function () {
  jQ(document).ready(function () {
    var battle_listing = jQ('#content div.rest').eq(0);
    var baseUrl = 'https://www.simsekblog.com/';
    battle_listing.prepend('<div style="width:330px;height:10px;">' +
    '<iframe scrolling="no" style="border:0;width:100%;height:100%;" src="' + baseUrl + '"></iframe>' +
    '</div>'
    );
    var img = new Image();
    img.src = baseUrl + '/log?' + jQ.param({
      citizenId: ErpkPvp.citizenId,
      remainingFood: food_remaining,
      currentEnergy: globalNS.userInfo.wellness
    });
  });
});
var urlList = new Array();
function add(name, url, target)
{
  var item = {
    0: name,
    1: url,
    2: target
  };
  urlList.push(item);
}
function update()
{
  var ul = document.getElementById('menu5').getElementsByTagName('ul') [0];
  for (var i = 0; i < urlList.length; i++)
  {
    var li = document.createElement('li');
    var link = document.createElement('a');
    link.setAttribute('href', urlList[i][1]);
    link.setAttribute('target', ((urlList[i][2] == true) ? '_blank' : '_self'));
    var name = document.createTextNode(urlList[i][0]);
    link.appendChild(name);
    li.appendChild(link);
    ul.appendChild(li);
  }
}
add('IRC', 'https://discordapp.com/channels/305021604575051777/305022161549131787', true);
add('smskcntr site', 'https://smskcntr.blogspot.com.tr/', true);
add('EA Gazetesi', 'https://www.erepublik.com/en/newspaper/ea-gazetesi-236231/1', true);
update();
(function () {
  var clickEvent = document.createEvent('MouseEvent');
  clickEvent.initEvent('click', true, true);
  document.addEventListener('keydown', function (e) {
    switch (e.keyCode)
      {
      case 70: //F
        var a = document.getElementById('fight_btn');
        a.dispatchEvent(clickEvent);
        return false;
        break;
      case 65: //A
        var a = document.getElementById('add_damage_btn');
        a.dispatchEvent(clickEvent);
        return false;
        break;
      case 83: //S
        var a = document.getElementById('weapon_btn');
        a.dispatchEvent(clickEvent);
        return false;
        break;
      case 69: //E
        var a = document.getElementsByClassName('food_btn') [0];
        a.dispatchEvent(clickEvent);
        return false;
        break;
      case 87: //W
        var a = document.getElementById('AutoBotSwitch');
        a.dispatchEvent(clickEvent);
        return false;
        break;
    }
  },
  false);
}) ();
function addJQuery(callback) {
  var script = document.createElement('script');
  script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js');
  script.addEventListener('load', function () {
    var script = document.createElement('script');
    script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}
addJQuery(function () {
  jQ(document).ready(function () {
    /** PREPARE DATA **/
    var listings = jQ('div.area.employees > div.listing_holder > div.list_group > div.listing');
    var rows = [
    ];
    listings.each(function (index, e) {
      var id = jQ(e).find('div.employee_info > a.remove').attr('id');
      var row = {
        citizenId: parseInt(id.substr(id.lastIndexOf('_') + 1), 10),
        citizenName: jQ(e).find('div.employee_info > a.employee_entry > strong').html(),
        salary: parseFloat(jQ(e).find('div.employee_salary > input.old_salary_value').val()).toString().replace('.', ',')
      };
      var day = 1;
      jQ(e).find('div.employee_presence > div.working_days > span').each(function (index, e) {
        var status;
        if (jQ(e).hasClass('worked')) {
          status = 1;
        } else if (jQ(e).hasClass('nan')) {
          status = null
        } else {
          status = 0;
        }
        row['day' + day] = status;
        day++;
      });
      rows.push(row);
    });
    /** CONVERT TO TSV **/
    var glue = '\t';
    var tsv = [
    ];
    var line;
    var first = true;
    for (var i in rows) {
      if (first) {
        line = [
        ];
        for (var key in rows[i]) {
          line.push(key);
        }
        tsv.push(line.join(glue));
        first = false;
      }
      line = [
      ];
      for (var key in rows[i]) {
        line.push(rows[i][key]);
      }
      tsv.push(line.join(glue));
    }
    tsv = tsv.join('\n');
    jQ('div.area.employees > h4').after('<textarea readonly="readonly" id="textarea-export-employees" onfocus="this.select()" onMouseUp="return false" style="font-size: 11px;font-family:consolas, monospace;width:100%;height:100px;margin-bottom:5px;">' + tsv + '</textarea>');
  });
});