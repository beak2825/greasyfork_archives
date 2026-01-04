// ==UserScript==
// @name     goodgame.ru filter news
// @version  1.1
// @grant    none
// @include  https://goodgame.ru/
// @description:en news filter for goodgame.ru
// @namespace https://greasyfork.org/users/72530
// @description news filter for goodgame.ru
// @downloadURL https://update.greasyfork.org/scripts/37222/goodgameru%20filter%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/37222/goodgameru%20filter%20news.meta.js
// ==/UserScript==

// последний кусок урла из ссылки тега
var blacklist = ["league-of-legends", "dota2"];
// название игры из карточки турнира
var blacklistCups = ["League of Legends", "Dota 2"];

var url = window.location.href;
if (checkUrl(url)) { doWork(); };

setInterval(function () {
  if (window.location.href != url)
  {
    url = window.location.href;
    if (checkUrl(url)) { doWork(); };
  }
}, 1000);

function checkUrl(currentUrl) {
  return currentUrl.endsWith("goodgame.ru/");
}


function doWork() 
{
  var news = document.querySelectorAll('div.news-element');
  for (var i = news.length-1; i >= 0; i--) {  
    var tags = news[i].querySelector('.tag-block');
    if (tags == null)
    {
      // try detect tournament
      console.log(i);
      console.log("try detect tournament");
      var gameBlock = news[i].querySelector('.game');
      console.log(gameBlock);
      if (gameBlock != null) 
      {
      	var gameDiv = gameBlock.querySelector('.name');
        console.log(gameDiv);
        if (gameDiv != null) 
        {
          var game = gameDiv.textContent;
          console.log(game);
          if (blacklistCups.indexOf(game) > -1) 
          {
            console.log("deleting node");
            // single tag found in blacklist
            news[i].remove();
            continue;
          }
        }
      }
      continue;
    }
    var tagLinks = tags.getElementsByTagName('a');
    for (var j = 0; j < tagLinks.length; j++) {
      var tag = tagLinks[j].href.split("/by-game/")[1];
      if (blacklist.indexOf(tag) > -1) 
      {
        // single tag found in blacklist
        news[i].remove();
        break;
      }
    }
  }
}
