// ==UserScript==
// @name        AnimeBytes stats
// @namespace   github.com/ewasion
// @author      Eva
// @description Computes people's hidden stats (might be inaccurate)
// @icon        https://animebytes.tv/favicon.ico
// @homepage    https://ewasion.github.io/userscripts/ab-stats/
// @include     https://animebytes.tv/user.php?*
// @version     1.0.3
// @license     GPL-3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37729/AnimeBytes%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/37729/AnimeBytes%20stats.meta.js
// ==/UserScript==

var stats = [];

$('.userstatsright .userprofile_list dd').each(function (key) {
  stats[key] = ($(this).has('span[title]').length ? $('.userstatsright .userprofile_list dd:nth-child('+(key+1)*2+') > span')[0].title : $(this).has('span').length);
});

stats.push($('.userstatsleft .userprofile_list dd:nth-child(2)').has('span').length);
stats.push($('.userstatsleft .userprofile_list dd:nth-child(4)').has('span').length);

function traffic(str) {
  if (str.includes('MiB')) {
    return str.split(' ')[0] * 1e+6;
  }
  if (str.includes('GiB')) {
    return str.split(' ')[0] * 1e+9;
  }
  if (str.includes('TiB')) {
    return str.split(' ')[0] * 1e+12;
  }
  return str.split(' ')[0];
}

function humanise(diff) { // Taken from stackoverflow lul
  // The string we're working with to create the representation
  var str = '';
  // Map lengths of `diff` to different time periods
  var values = [[' year', 365], [' month', 30], [' week', 7], [' day', 1]];

  // Iterate over the values...
  for (var i=0;i<values.length;i++) {
    var amount = Math.floor(diff / values[i][1]);

    // ... and find the largest time value that fits into the diff
    if (amount >= 1) {
       // If we match, add to the string ('s' is for pluralization)
       str += amount + values[i][0] + (amount > 1 ? 's' : '') + ', ';

       // and subtract from the diff
       diff -= amount * values[i][1];
    }
  }

  return str.slice(0, -2);
}

stats.push(traffic($('.userstatsright .userprofile_list dd:nth-child(2)')[0].innerText.split('(')[1]));
stats.push(traffic($('.userstatsright .userprofile_list dd:nth-child(4)')[0].innerText.split('(')[1]));
stats.push(traffic($('.userstatsright .userprofile_list dd:nth-child(2)')[0].innerText.split('(')[1]));
stats.push(traffic($('.userstatsright .userprofile_list dd:nth-child(4)')[0].innerText.split('(')[1]));

console.log(stats);

var upload      = stats[0],
    download    = stats[1],
    ratio       = stats[2],
    joined      = stats[10],
    lastseen    = stats[11],
    totupload   = stats[15],
    totdownload = stats[16],
    uploadday   = stats[17],
    downloadday = stats[18];

if(upload && !ratio) {
  $('.userstatsright .userprofile_list dd:nth-child(6) > i')[0].innerText = (upload / download).toFixed(2);
}

if(upload && !joined) {
  $('.userstatsleft .userprofile_list dd:nth-child(2) > i')[0].innerText = humanise((upload / totupload)) + ' ago';
}
