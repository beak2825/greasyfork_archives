// ==UserScript==
// @name         AGMA.IO ( macro fast split + macro fast feed + more )
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  agma.io - Macro fast split + Macro fast feed + Removed ads + Auto spawn + Fast buy from shop + More
// @author       I HAVE A REALLY LONG NICKNAME
// @match        *://agma.io*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376932/AGMAIO%20%28%20macro%20fast%20split%20%2B%20macro%20fast%20feed%20%2B%20more%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376932/AGMAIO%20%28%20macro%20fast%20split%20%2B%20macro%20fast%20feed%20%2B%20more%20%29.meta.js
// ==/UserScript==

var CellEjectDown = false, Fast = 20;

// STYLE CODES
$(document).ready(function() {
  function adsRemove() {     
  if (!adplayer == false) {
     adplayer = null
    }
  }

  setTimeout(adsRemove, 5000)

  $('#cnt_panel').remove();
  $('.featured-yt').remove();
  $('#advertCenterPanel').remove();
  $('.center-panel').css({
    'height': '500px'
  });
  $('.center-panel, .panel-heading, .table_content, #scorebox, #loginTabs, #md-content, #loginForm, #btnFriends').css({
    'background-image': 'linear-gradient(to right, #92FE9D, #00C9FF)'
  });
  $('.center-panel, .panel-heading, .table_content, #scorebox, #loginTabs, #md-content #loginForm, #btnFriends').css({
   'border': '2px solid #000000'
  });
  $(".low-margin").append('<br><br><br>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>D</b> to double split</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>A</b> to triple split</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>Z</b> to 16 split</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>F</b> to freeze / stop cell</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>R</b> to spawn or respawn</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Hold <b>D</b> or <b>A</b> or <b>Z</b> to unlimited split</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Hold <b>W</b> to macro feed</span></center>');
  $(".low-margin").append('<hr>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>1</b> to fast buy recombine</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>2</b> to fast buy 2x speed</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>3</b> to fast buy push enemies</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>4</b> to fast buy spawn portal</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press <b>0</b> to fast open shop</span></center>');
  $(".low-margin").append('<center><span class=\'text-muted\'> Press B or N or M to dance</span></center>');

  $("#loginForm").append('<br>');
  $("#loginForm").append('<button class=\"btn-mod\" id=\"SkipStats\" style=\"width: 100%;\">auto skip stats off</button>');
  $("#loginForm").append('<br><br>');
  $("#loginForm").append('<button class=\"btn-mod\" id=\"AutoRespawn\" style=\"width: 100%;\">auto respawn off</button>');
  $('.btn-mod').css({
    'display': 'inline-block',
    'height': '40px',
    'line-height': '40px',
    'padding': '0 20px',
    'background': '#444',
    'color': '#eee',
    'border': '0',
    'font-size': '14px',
    'vertical-align': 'top',
    'text-align': 'center',
    'text-decoration': 'none',
    'text-shadow': '0 1px 0 rgba(0, 0, 0, 0.4)',
    'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.2)',
    'border-radius': '4px',
    'transition': 'all 0.15s ease-in-out',
  });
});

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

function keydown(event) {
  if (event.keyCode == 87 && CellEjectDown === false) {
    CellEjectDown = true;
    setTimeout(CellEject, Fast);
  }
  if (event.keyCode == 68) { // key D = DOUBLESPLIT 
    CellSplit();
    setTimeout(CellSplit, Fast);
  }
  if (event.keyCode == 65) { // key A = TRIPLESPLIT
    CellSplit();
    setTimeout(CellSplit, Fast);
    setTimeout(CellSplit, Fast * 2);
  }
  if (event.keyCode == 90) { // key Z = 16 SPLIT
    CellSplit();
    setTimeout(CellSplit, Fast);
    setTimeout(CellSplit, Fast * 2);
    setTimeout(CellSplit, Fast * 3);
  }
  if (event.keyCode == 70) { // key F = FREEZE / STOP CELL
    X = window.innerWidth / 2;
    Y = window.innerHeight / 2;
    $("canvas").trigger($.Event("mousemove", {
      clientX: X,
      clientY: Y
    }));
  }
  if (event.keyCode == 82 && document.activeElement === document.body) { // key R = SPAWN IN
      $('#playBtn').click()
  }
  if (event.keyCode == 49 && document.activeElement === document.body) { // key 1 = BUY RECOMBINE
      $('.purchase-btn')[0].click();
    fastConfirm();
  }
  if (event.keyCode == 50 && document.activeElement === document.body) { // key 2 = BUY SPEED
      $('.purchase-btn')[01].click();
    fastConfirm();
  }
  if (event.keyCode == 51 && document.activeElement === document.body) { // key 3 = BUY PUSH
      $('.purchase-btn')[03].click();
    fastConfirm();
  }
  if (event.keyCode == 52 && document.activeElement === document.body) { // key 4 = BUY SPAWN PORTAL
      $('.purchase-btn')[08].click();
    fastConfirm();
  }
  if (event.keyCode == 66 && document.activeElement === document.body) { // key B = PLAYER SHAKE
      $('#chtbox').val('shake');
    sendMsg()
  }
  if (event.keyCode == 78 && document.activeElement === document.body) { // key N = PLAYER SPIN
      $('#chtbox').val('spin');
    sendMsg()
  }
  if (event.keyCode == 77 && document.activeElement === document.body) { // key M =  PLAYER FLIP
      $('#chtbox').val('flip');
    sendMsg()
  }
}

function keyup(event) {
  if (event.keyCode == 87) {
    CellEjectDown = false;
  }
}

// CELL EJECT
function CellEject() {
  if (CellEjectDown) {
    window.onkeydown({
      keyCode: 87
    }); 
    window.onkeyup({
      keyCode: 87
    });
    setTimeout(CellEject, Fast);
  }
}

// CELL SPILT
function CellSplit() {
  $("body").trigger($.Event("keydown", {
    keyCode: 32
  }));
  $("body").trigger($.Event("keyup", {
    keyCode: 32
  }));
}

// SEND DANCE
function sendMsg() {
 $('#chtbox').trigger('focus').trigger($.Event("keydown", {
    keyCode: 13
  }));
}

// FAST CONFIRM
function fastConfirm() {
  setTimeout(function() {
    $('.confirm')[0].click();
  }, 500);
  setTimeout(function() {
    $('.confirm')[0].click();
  }, 1700);
}

// AUTO RESPAWN
(function() {
  AutoRespawn = false;
  target1 = document.getElementById('playBtn');
  respawn = document.getElementById('AutoRespawn');

  obs1 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      if (target1.style.display != 'block') {
        RESPAWN();
      }
    });
  });

  config1 = {
    attributes: true,
    childList: true,
    characterData: true
  };

  RESPAWN = function() {
    $('#playBtn').trigger('click');
  };

  toggleObserve1 = function() {
    AutoRespawn = !AutoRespawn;
    if (AutoRespawn) {
      obs1.observe(target1, config1);
      respawn.innerHTML = "auto respawn on";
    } else {
      obs1.disconnect();
      respawn.innerHTML = "auto respawn off";
    }
  };
})();

$("#AutoRespawn").on("click", toggleObserve1);

// AUTO SKIP STATS
(function() {
  SkipStats = false;
  target2 = document.getElementById('advert');
  skip = document.getElementById('SkipStats');

  obs2 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      if ($('#advert').css('display') == 'block')
        SKIPSTATS();
    });
  });

  config2 = {
    attributes: true,
    childList: true,
    characterData: true
  };

  SKIPSTATS = function() {
    $('#statsContinue').trigger('click');
  };

  toggleObserve2 = function() {
    SkipStats = !SkipStats;
    if (SkipStats) {
      obs2.observe(target2, config2);
      skip.innerHTML = "auto skip stats on";
    } else {
      obs2.disconnect();
      skip.innerHTML = "auto skip stats off";
    }
  };
})();

$("#SkipStats").on("click", toggleObserve2);

// MAX NICKNAME LENGHT
$(document).ready(function() {
  $("#nick").attr('maxlength', '30');
});