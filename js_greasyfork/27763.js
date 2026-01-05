// ==UserScript==
// @name         Putlocker Navigation With Keyboard Arrow Keys Or PgUp/PgDn
// @version      4
// @description  Navigate through episodes with arrow keys.
// @author       jsutilities
// @namespace    com.jsutilities
// @include      *putlocker*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/27763/Putlocker%20Navigation%20With%20Keyboard%20Arrow%20Keys%20Or%20PgUpPgDn.user.js
// @updateURL https://update.greasyfork.org/scripts/27763/Putlocker%20Navigation%20With%20Keyboard%20Arrow%20Keys%20Or%20PgUpPgDn.meta.js
// ==/UserScript==
var url = location.href;
function getnumber(x) {
  var pos = url.search(x) + x.length;
  var num = parseInt(url.substr(pos));
  return num;
}
function nextepisode() {
  var num = getnumber('episode-');
  var newurl = url.replace('episode-' + num, 'episode-' + (num + 1));
  $.ajax({
    type: 'HEAD',
    url: newurl,
    success: function () {
      location.href = newurl;
    },
    error: function () {
      num = getnumber('season-');
      newurl = url.replace('season-' + num, 'season-' + (num + 1)).replace('episode-' + getnumber('episode-'), 'episode-1');
      $.ajax({
        type: 'HEAD',
        url: newurl,
        success: function () {
          location.href = newurl;
        },
        error: function () {
          alert('No more episodes');
        }
      });
    }
  });
}
function previousepisode() {
  var num = getnumber('episode-');
  var newurl;
  if (num > 1) {
    newurl = url.replace('episode-' + num, 'episode-' + (num - 1));
    location.href = newurl;
  } 
  else {
    num = getnumber('season-');
    if (num > 1) {
      newurl = url.replace('season-' + num, 'season-' + (num - 1)).replace('-episode-' + getnumber('episode-'), '');
      $.ajax({
        type: 'GET',
        url: newurl,
        success: function (response) {
          if($(response).find('.entry').length!=0)
            location.href = $(response).find('.entry').last().children().first().attr('href');
          else if($(response).find('.tv_episode_item').length!=0)
            location.href = $(response).find('.tv_episode_item').last().children().first().attr('href');
          else
            alert('Unsupported site. Please report on greasyfork.org');
        },
        error: function () {
          alert('No more episodes');
        }
      });
    } 
    else {
      alert('No more episodes');
    }
  }
}
document.onkeypress = function (event) {
  if (url.search('episode')) {
    var key = event.keyCode;
    if (key == 39) {
      nextepisode();
    }
    if (key == 37) {
      previousepisode();
    }
  }
}