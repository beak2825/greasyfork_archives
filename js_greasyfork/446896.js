// ==UserScript==
// @name     jira-hack
// @namespace thedream
// @description "调整jira面板列的宽度"
// @version  1.0.4
// @grant    none
// @include  http://jira.game.x.thedream.cc/secure/RapidBoard.jspa?rapidView=4*
// @author thedream
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446896/jira-hack.user.js
// @updateURL https://update.greasyfork.org/scripts/446896/jira-hack.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var colWidth = 300

  function addColWidth(){
    var $lis = document.querySelectorAll(".ghx-column-header-group ul li")
    var $divs = document.querySelectorAll(".ghx-has-swimlanes .ghx-swimlane")

    for(var i =0;i<$lis.length;i++){
     $lis[i].style.width = colWidth+'px'
    }

    for(var j=0;j<$divs.length;j++){
       var $lis1 =  $divs[0].querySelectorAll('ul li')

       for(let k=0;k<$lis1.length;k++){
          $lis1[k].style.width = colWidth+'px'
       }
    }

    document.getElementById('ghx-pool-wrapper').style.width = (colWidth*$lis.length)+(10*($lis.length-1))+'px'
  }


    window.onload = function(){
      setTimeout(function(){
        addColWidth()
      },200)
    };
})()