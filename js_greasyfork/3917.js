// ==UserScript==
// @name            What.CD Top 10: Toggle Jam Bands
// @description     Adds a button to the Top 10 page to hide any torrents tagged 'jam.band'.
// @version         1.8
// @author          phracker <phracker@bk.ru>
// @namespace       https://github.com/phracker
//
// @icon            https://whatimg.com/i/SKhKhG.png
// @icon64          https://whatimg.com/i/s88wVz.png
// @include         http*://*what.cd/top10.php*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/3917/WhatCD%20Top%2010%3A%20Toggle%20Jam%20Bands.user.js
// @updateURL https://update.greasyfork.org/scripts/3917/WhatCD%20Top%2010%3A%20Toggle%20Jam%20Bands.meta.js
// ==/UserScript==

function toggle_jambands() {
  var t_tables = document.getElementsByClassName('torrent_table');
  var t_tables_length = t_tables.length;
  // iterate through each table on the page
  for (var x = 0; x < t_tables_length; x++) {
    var table = t_tables.item(x);
    var torrents = table.getElementsByClassName('torrent');
    var torrents_length = torrents.length;
    // iterate through each torrent in the table
    for (var y = 0; y < torrents_length; y++) {
      var torrent = torrents.item(y);
      var torrent_style = torrent.getAttribute('style');
      var toggled_style = '';
      if (torrent_style == 'display: none;') {
        toggled_style = '';
      } else if (torrent_style == '') {
        toggled_style = 'display: none;';
      } else {
        toggled_style = '';
      }
      // get torrent group tags, if 'jam.band' is present, toggle visibility
      var group = torrent.getElementsByClassName('group_info').item(0);
      var tags = group.getElementsByClassName('tags').item(0).getElementsByTagName('a');
      var tags_length = tags.length;
      for (var z = 0; z < tags_length; z++) {
        var tag = tags.item(z);
        var tag_link = tag.href;
        var tag_text = tag.textContent;
        if (tag_link == 'https://what.cd/torrents.php?taglist=jam.band' || tag_link == 'https://ssl.what.cd/torrents.php?taglist=jam.band' || tag_text == 'jam.band') {
          torrent.setAttribute('style', toggled_style);
        }
      }
    }
  }
  // Swap hide/show text
  try {
    var toggle_link_text = document.getElementById('toggle_jambands').textContent;
    var toggled_text = '';
    if (toggle_link_text == 'Show Jam Bands') {
      toggled_text = 'Hide Jam Bands';
    } else {
      toggled_text = 'Show Jam Bands';
    };
    document.getElementById('toggle_jambands').textContent = toggled_text;
  } catch (e) {};
};

// add script to the page
var jambands_script = document.createElement('script');
jambands_script.appendChild(document.createTextNode('(' + toggle_jambands + ')();'));
(document.body || document.head || document.documentElement).appendChild(jambands_script);

// create link and add it to the page
var toggle_jambands_link = document.createElement('a');
toggle_jambands_link.onclick = toggle_jambands;
toggle_jambands_link.appendChild(document.createTextNode('Hide Jam Bands'));
toggle_jambands_link.setAttribute('class', 'brackets');
toggle_jambands_link.setAttribute('style', 'cursor: pointer;');
toggle_jambands_link.id = 'toggle_jambands';
document.getElementsByClassName('linkbox').item(1).appendChild(toggle_jambands_link);