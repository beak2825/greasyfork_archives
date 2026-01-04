// ==UserScript==
// @name        Gems value
// @license     MIT
// @icon        https://static.wikia.nocookie.net/steamtradingcards/images/d/d5/Gems.png/revision/latest?cb=20141212041407
// @namespace   https://greasyfork.org/en/scripts/442953-gems-value
// @match       *://steamcommunity.com/market/listings/*
// @grant       none
// @version     1.0
// @author      Legend
// @description Checks the gems value of every steam item
// @include     *://steamcommunity.com/market/listings/*
// @exclude     *://steamcommunity.com/market/listings/*/*Foil*
// @exclude     *://steamcommunity.com/market/listings/*/*Booster*Pack*
// @homepageURL https://greasyfork.org/en/scripts/442953-gems-value
// @supportURL  https://greasyfork.org/en/scripts/442953-gems-value
// @downloadURL https://update.greasyfork.org/scripts/442953/Gems%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/442953/Gems%20value.meta.js
// ==/UserScript==

javascript:var

  a=g_rgAssets[Object.keys(g_rgAssets)[0]];

  b=a[Object.keys(a)[0]];

  c=b[Object.keys(b)[0]];
    
  gem_action=c.owner_actions&&c.owner_actions.filter
  (
    function(d)
    {
      return/javascript:GetGooValue/.test(d.link)
    }
  )
  [0];

  if(gem_action)
    {
      var matches=gem_action.link.match(/javascript:GetGooValue\( '%contextid%', '%assetid%', (\d+), (\d+), \d+ \)/);
      
      fetch("https://steamcommunity.com/auction/ajaxgetgoovalueforitemtype/?appid="+matches[1]+"&item_type="+matches[2]+"&border_color=0").
      
      then
      (
        function(d)
        {
          return d.json()
        }
      ).
      then
      (
        function(d)
        {
          alert("This is worth "+d.goo_value+" gems")
        }
      )
  ["catch"]
  (
    function(d)
    {
      return console.error(d)
    }
  )
    }
  else
    alert("NO GEM VALUE!!");