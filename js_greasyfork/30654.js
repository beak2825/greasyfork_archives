// ==UserScript==
// @name         Spying Srunya
// @namespace    http://1chan.ca
// @version      0.1
// @description  B D E E T
// @author       Why You Mom Suck
// @match        https://1chan.ca/news/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30654/Spying%20Srunya.user.js
// @updateURL https://update.greasyfork.org/scripts/30654/Spying%20Srunya.meta.js
// ==/UserScript==

(function() {
  var $header = $('.b-header-block.m-mascot-news')
  , $eyeless = $('<img src="http://i.imgur.com/U37paJ5.png">').css({
    position: 'absolute',
    bottom: 0,
    left: '274px',
    zIndex: -1,
  })
  $header.css({
    background: 'none'
  }).append($eyeless)
  var center = {
    left: 305,
    bottom: 32
  }
  var span = {
    x: 8,
    y: 7
  }
  var $eyes = $('<div><div class="eye"></div><div class="eye"></div></div>').css({
    position: 'absolute',
    bottom: center.bottom,
    left: center.left,
    zIndex: -2,
    width: '56px',
    fontSize: 0,
    transition: 'left 0.2s, bottom 0.2s'
  }).appendTo($header)
  $('.eye').css({
    display: 'inline-block',
    height: '15px',
    width: '15px',
    borderRadius: '20px',
    background: 'black',
  })
  $('.eye:last').css({float: 'right'})

  var bounds = {
    dead: {
      y: [-20, 40],
      x: [-44, 44]
    },
    full: {
      y: [-56, 428],
      x: [-332, 332]
    }
  }

  $(window).mousemove(function(ev) {
    var mascot_pos = $eyeless.offset()
    var curPos = {
      y: ev.pageY - (mascot_pos.top  + 72),
      x: ev.pageX - (mascot_pos.left + 58)
    }
    var relPos = {};
    ['x', 'y'].forEach(function(xy) {
      if(curPos[xy] >= bounds.dead[xy][0] && curPos[xy] <= bounds.dead[xy][1])
        relPos[xy] = 0
      else if(curPos[xy] <= bounds.full[xy][0])
        relPos[xy] = -1
      else if(curPos[xy] >= bounds.full[xy][1])
        relPos[xy] = 1
      else {
        var sign = +(relPos[xy] > 0)
        relPos[xy] = (curPos[xy] / bounds.full[xy][+(curPos[xy] > 0)]) * ((curPos[xy] > 0) ? 1 : -1)
      }
    })

    setEyesAt(relPos.x, relPos.y)

  })
  .mouseleave(function() {
    setEyesAt(0, 0)
  })

  function setEyesAt(x, y) {
    $eyes.css({
      left:   center.left +   Math.round(span.x * x),
      bottom: center.bottom - Math.round(span.y * y),
    })
  }
})();