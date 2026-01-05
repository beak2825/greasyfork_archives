// ==UserScript==
// @name        TwitchBlock Plus
// @description Remove people/games from directories
// @namespace   mothproof
// @include     http://www.twitch.tv/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10348/TwitchBlock%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/10348/TwitchBlock%20Plus.meta.js
// ==/UserScript==

if(typeof $ == 'undefined') var $ = unsafeWindow.jQuery;

$(function()
{
  var
  people = [
    'lirik',
    'sodapoppin'
  ],
  games = [
    'fifa',
    'counter-strike',
    'dota',
    'hearth',
    'gaming talk shows'
  ];
  
  var
  debug = false,
  $b = $('body'),
  wrapper,
  lastChannelCount,
  pplReg,
  gamesReg;
  
  if (games) {
    gamesReg = new RegExp(games.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, '\\$&'), 'i');
  }
  if (people) {
    pplReg = new RegExp(people.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, '\\$&'), 'i');
  }
  
  function log(msg) {
    if (!debug) {
      return;
    }
    console.log(msg);
  }
  
  var treeModifiedEvent = function (e)
  {
    $b.off('DOMSubtreeModified', treeModifiedEvent);
    
    switch (window.location.pathname) {
      case '/directory':
        wrapper = '.js-games';
        titleObject = 'a.game-item';
        break;
      default:
      case '/directory/all':
        titleObject = '.boxart';
        wrapper = '.js-streams';
        break;
    }
    
    var 
    $w = $(wrapper),
    $channels = $w.find('> div > div');
    
    if ($channels.length != lastChannelCount)
    {
      $channels.each(function()
      {
        var 
        $gameContainer = $(this),
        $title = $gameContainer.find(titleObject),
        $cap = $gameContainer.find('a.cap');
        
        if (gamesReg && gamesReg.test($title.attr('title'))) {
          log('removing game ' + $title.attr('title'));
          $gameContainer.css('display', 'none');
        }
        if (pplReg && pplReg.test($cap.attr('href'))) {
          log('removing person ' + $cap.attr('href'));
          $gameContainer.remove();
        }
        
        // in cases when there are few results, there might not be enough filler to scroll
        $('.tse-scroll-content').scroll();
      });
      
      lastChannelCount = $channels.length;
    }

    setTimeout(function () {
      $b.on('DOMSubtreeModified', treeModifiedEvent);
    }, 1000);
  };
  
  $b.on('DOMSubtreeModified', treeModifiedEvent);
});
