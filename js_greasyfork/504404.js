// ==UserScript==
// @name        [GC] Volcano Tracker
// @namespace   hanso
// @match       https://www.grundos.cafe/*
// @version     1.9
// @author      hanso
// @description Helps you stay on top of the Tyrannia Volcano event
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/504404/%5BGC%5D%20Volcano%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/504404/%5BGC%5D%20Volcano%20Tracker.meta.js
// ==/UserScript==

function getSecondsTillMidnight() {
  const nstMatch = document.body.innerHTML.match(/<span id="NST_clock_hours">(\d+)<\/span>:<span id="NST_clock_minutes">(\d+)<\/span>:<span id="NST_clock_seconds">(\d+)<\/span> ([ap]m) NST/);
  if(!nstMatch)
    return 86400;
  let zhour = parseInt(nstMatch[1]);
  if(nstMatch[4] == 'pm')
    zhour += 12;
  else if(zhour === 12) //12 am
    zhour = 0;
  let zmin = parseInt(nstMatch[2]);
  let zsec = parseInt(nstMatch[3]);
  const currentTimeInSeconds = (zhour * 3600) + (zmin * 60) + zsec;
  return 86400 - currentTimeInSeconds;
}

function showVolcanoTimelies() {
  return;
  const timelies = document.querySelector('.timelies .aioImg');
  if(timelies)
    timelies.insertAdjacentHTML('afterbegin', `<div style="order:0"><a href="/prehistoric/volcano/"><img title="Volcano" src="https://grundoscafe.b-cdn.net/prehistoric/tyvolcano_entrance.png" style="max-height: 35px"></a></div>`);
}

function formatDuration(duration) {
  duration /= 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration % 3600 / 60);
  const seconds = Math.ceil(duration % 60);
  return hours + (hours === 1 ? ' hour, ' : ' hours, ') + minutes + (minutes === 1 ? ' minute' : ' minutes') + ', and ' + seconds + (seconds === 1 ? ' second' : ' seconds');
}

function getRemainingTime() {
  return Math.max(0, parseInt(GM_getValue('gc_volcanoNextTime', 0)) - (new Date()).getTime());
}

function setNextVisitTime() {
   GM_setValue('gc_volcanoNextTime', (new Date()).getTime() + 30 * 60000);
}

function setNextVisitTimeTomorrow() {
  GM_setValue('gc_volcanoNextTime', (new Date()).getTime() + getSecondsTillMidnight() * 1000);
}

const buttonGroup = document.querySelector('.button-group');
function showRemainingTimeOnPage(time) {
  if(buttonGroup) {
    const time = formatDuration(getRemainingTime());
    buttonGroup.insertAdjacentHTML('beforebegin', `<p>Come back in <strong>${time}</strong>.</p>`);
  }
}

function getCurrentRoom() {
  const roomMatch = document.body.innerHTML.match(/volcano_tube_BG_([0-9]+).+\./);
  return roomMatch ? parseInt(roomMatch[1]) : -1;
}

function showCurrentRoomOptions(room) {
  if(!buttonGroup)
    return;
/*
  // not being used, the table output was ugly and new data emerges almost daily
  const roomOptions = {
    1: {
      'Left' : {
        'name': 'Magma River',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': true
      },
      'Middle' : {
        'name': 'Soot',
        'givesShard': 'appendq',
        'canExcavate': false,
        'preventsReturn': true
      },
      'Right' : {
        'name': 'NextRoom',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': false
      }
    },
    2: {
      'Left' : {
        'name': 'Noxious Gas',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': true
      },
      'Middle' : {
        'name': 'NextRoom',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': false
      },
      'Right' : {
        'name': 'Flaming Non-Cube',
        'givesShard': 'uerypa',
        'canExcavate': false,
        'preventsReturn': true
      }
    },
    3: {
      'Left' : {
        'name': 'Stalagmites',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': true
      },
      'Middle' : {
        'name': 'NextRoom',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': false
      },
      'Right' : {
        'name': 'Mudslide',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': true
      }
    },
    4: {
      'Left' : {
        'name': 'Empty Room',
        'givesShard': 'ramco',
        'canExcavate': false,
        'preventsReturn': true
      },
      'Middle' : {
        'name': 'NextRoom',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': false
      },
      'Right' : {
        'name': 'Magma River 2',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': true
      }
    },
    5: {
      'Left' : {
        'name': 'NextRoom',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': false
      },
      'Middle' : {
        'name': 'Soot Room 2',
        'givesShard': false,
        'canExcavate': false,
        'preventsReturn': true
      },
      'Right' : {
        'name': 'Noxious Gas 2',
        'givesShard': 'njure=b',
        'canExcavate': false,
        'preventsReturn': true
      }
    },
    6: {
      'Left' : {
        'name': '???',
        'givesShard': false,
        'canExcavate': true,
        'preventsReturn': true
      },
      'Middle' : {
        'name': '???',
        'givesShard': false,
        'canExcavate': true,
        'preventsReturn': true
      },
      'Right' : {
        'name': '???',
        'givesShard': false,
        'canExcavate': true,
        'preventsReturn': true
      }
    }
  };
 let optionsHtml = '<style>table.volcano-table td,th {border: 1px solid #000;padding: 8px;text-align: left;}</style>';
  optionsHtml += '<table class="volcano-table"><tr><th>Tunnel</th><th>Room Name</th><th>Gives Shard</th><th>Can Excavate</th><th>Prevents Return for 30 Minutes</th></tr>';
  for (const [tunnel, properties] of Object.entries(roomOptions[room])) {
    optionsHtml += `<tr><td>${tunnel}</td><td>${properties.name}</td><td>${properties.givesShard}</td><td>${properties.canExcavate}</td><td>${properties.preventsReturn}</td></tr>`;
  }
  optionsHtml += '</table>';
  */
}

function linkToGuide() {
  if(buttonGroup)
    buttonGroup.insertAdjacentHTML('beforebegin', '<center><small>See the latest known developments at <a href="https://www.grundos.cafe/~Tyranniac/" target="_blank">~Tyranniac</a>!</small></center>');
}

function showRoomNavMenu(curRoom) {
  let center = document.querySelectorAll('div.center');
  if(!center)
    return;
  center = center[center.length - 1]; //random events mess with center div
  let roomMenu = [];
  for(let x=10;x>=1;x--) {
    roomMenu.push(curRoom === x ? `<i>Room ${x}</i>` : `<a href="/prehistoric/crevasse/?room=${x}">Room ${x}</a>`);
  }
  center.insertAdjacentHTML('afterbegin', roomMenu.join(' | '));
}

function showMissingShards() {
  let shardTips = {
    'appendq':'Collect the <i>appendq</i> shard in the Soot Room. (<b>Middle</b> Path from <a href="https://www.grundos.cafe/prehistoric/crevasse/?room=1">Room 1</a>)',
    'uerypa':'Collect the <i>uerypa</i> shard in the Gelatinous Flaming Non-Cube Room. (<b>Right</b> Path from <a href="https://www.grundos.cafe/prehistoric/crevasse/?room=2">Room 2</a>)',
    'ramco':'Collect the <i>ramco</i> shard in the Empty Room. (<b>Left</b> Path from <a href="https://www.grundos.cafe/prehistoric/crevasse/?room=4">Room 4</a>)',
    'njure=b':'Collect the <i>jure=b</i> shard in the second Noxious Gas Room. (<b>Right</b> Path from <a href="https://www.grundos.cafe/prehistoric/crevasse/?room=5">Room 5</a>)',
    'ubbl':'Collect the <i>ubbl</i> shard in the third Magma River room. (<b>Left</b> Path from <a href="https://www.grundos.cafe/prehistoric/crevasse/?room=8">Room 8</a>)',
    'estorm': 'Collect the <i>estorm</i> shard in the third Stalagmite room. (<b>Middle</b> Path from <a href="https://www.grundos.cafe/prehistoric/crevasse/?room=10">Room 10</a>)'
  };
  let shardHtml = '<b>You need to collect the following shards:</b><br /><ul>';
  let missingShards = false;
  for (let shard in shardTips) {
    if (!document.body.innerHTML.includes(`shard_${shard}.png`)) {
      missingShards = true;
      shardHtml += `<li>${shardTips[shard]}</li>`;
    }
  }
  shardHtml += '</ul>'
  if(missingShards) {
    buttonGroup.insertAdjacentHTML('beforebegin', shardHtml);
  }
}

if(getRemainingTime() === 0)
  showVolcanoTimelies();

if(location.href.includes('/prehistoric/townhall/?discussshards=True')) {
  showMissingShards();
  linkToGuide();
} else if(location.href.includes('/prehistoric/townhall/')) {
  linkToGuide();
} else if(location.href.includes('/prehistoric/crevasse/') || location.href.includes('/prehistoric/volcano/')) {
  if(buttonGroup) {
    buttonGroup.insertAdjacentHTML('beforeend', `<input class="form-control half-width" type="button" onclick="document.location.href ='/prehistoric/townhall/'" value="Back to Tyrannia Town Hall">`);
  }

  linkToGuide();
  const currentRoom = getCurrentRoom();
  showRoomNavMenu(currentRoom);
  if(document.body.innerHTML.includes('give yourself until tomorrow to recharge')) {
    setNextVisitTimeTomorrow();
    showRemainingTimeOnPage();
  } else if(document.body.innerHTML.includes("think you'll need some time to compose yourself")) {
    setNextVisitTime();
    showRemainingTimeOnPage();
  } else if(document.body.innerHTML.includes('still feeling a bit shaken up')) {
    if(GM_getValue('gc_volcanoNextTime', -1) === -1) {
      setNextVisitTime();
    }
    showRemainingTimeOnPage();
  } else { //if(currentRoom !== -1)
      //showCurrentRoomOptions(currentRoom);
  }
}