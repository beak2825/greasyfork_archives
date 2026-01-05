// ==UserScript==
// @name        Hide BPL Trolls and other junk
// @namespace   ffmike
// @description Cleanup new BPL
// @include     https://bplight.wpengine.com/*
// @include     https://backpackinglight.com/*
// @grant       none
// @version     1
// @domain      www.backpackinglight.com
// @license        CC0 1.0; https://creativecommons.org/publicdomain/zero/1.0/
// @downloadURL https://update.greasyfork.org/scripts/14229/Hide%20BPL%20Trolls%20and%20other%20junk.user.js
// @updateURL https://update.greasyfork.org/scripts/14229/Hide%20BPL%20Trolls%20and%20other%20junk.meta.js
// ==/UserScript==

// In part shamelessly based on https://greasyfork.org/en/scripts/48-maximumpc-troll-remover/code
$(function () {
    function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) { return; }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
    }
  
    console.log('Hiding subscription block and how the forums work');
    $("#text-28").hide();
    $("#text-29").hide();
    $("#text-32").hide();
    $("#text-34").hide();
    $("#menu-item-15").hide();
  
    console.log('Hiding related posts');
    addGlobalStyle('div.zem_rp_content { display: none ! important; }');

  console.log('Hiding trolls');
    var joList = ["tipiwalter",
                  "rosyfinch",
                 ];
    
    var joLength = joList.length;
    var numJoComments = 0;
                  
    var thisJo, userName, ref;
        
    // Rinse and repeat
    $("a").each(function(index, value) 
    {
        ref = value.href;
        var pieces = ref.split('/');
        userName = pieces[pieces.length - 2];
        for(var i=0; i<joLength; i++) 
        {
            if(userName == joList[i])
            {
                //console.log('Hiding ' + userName);
                $(this).closest('.reply').hide();
                break;
            }
        }
     });

});