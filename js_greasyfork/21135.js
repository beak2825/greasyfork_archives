function doMod() {
  var colorScheme = {
    'rgb(205,205,205)': 'rgb(28,28,28)', // background
    'rgb(245,245,245)': 'rgb(222,222,222)', // name
    'rgb(0,178,225)': 'rgb(22,127,255)', // blue tank
    'rgb(241,78,84)': 'rgb(255,33,33)', // red tank / ffa bullet
    'rgb(153,153,153)': 'rgb(55,55,55)', // tank's nozzle
    'rgb(85,85,85)': 'rgb(10,10,10)', // outline for objects, names and healthbar
    'rgb(255,232,105)': 'rgb(255,222,33)', // square / sentry in dominator mode
    'rgb(252,118,119)': 'rgb(255,77,0)', // triangle
    'rgb(118,141,252)': 'rgb(111,55,255)', // hexagon
    'rgb(241,119,221)': 'rgb(255,111,255)', // triangle bot
    'rgb(252,195,118)': 'rgb(255,155,55)' // square minion
  };
  var debug_logc = false,
  debug_colors = [
  ],
  debug_text = '';
  function onCanvasFill(fullColor) {
    fullColor = fullColor.replace(/ /g, '');
    //if(debug_logc) { if(debug_colors.indexOf(fullColor) == -1 && !colorScheme.hasOwnProperty(fullColor)) debug_colors.push(fullColor); }
    if (colorScheme.hasOwnProperty(fullColor)) return document.getElementById('optnDarkTheme').checked ? colorScheme[fullColor] : fullColor;
     else return fullColor;
  }
  function onCanvasStroke(fullColor) {
    fullColor = fullColor.replace(/ /g, '');
    //if(debug_logc) { if(debug_colors.indexOf(fullColor) == -1 && !colorScheme.hasOwnProperty(fullColor)) debug_colors.push(fullColor); }
    if (colorScheme.hasOwnProperty(fullColor)) return document.getElementById('optnDarkTheme').checked ? colorScheme[fullColor] : fullColor;
     else return fullColor;
  }
  setTimeout(function () {
    if (debug_logc) {
      for (var i = 0; i < debug_colors.length; i++) debug_text += debug_colors[i] + '   ';
      if (debug_text !== '') prompt('Color list', debug_text);
    }
    debug_logc = false;
  }, 10000);
  var canvas = document.getElementById('canvas');
  var nick = document.getElementById('textInput');
  var optionsDiv,
  popupsDiv,
  trDiv;
  var keepOptionOpen = false,
  playerAlive = - 1;
  var holdingKey = {
  };
  window.onbeforeunload = function () {
    return 'Quit game?';
  };
  function editPanels() {
    optionsDiv = document.createElement('div');
    optionsDiv.id = 'gameOptions';
    optionsDiv.style = 'position: absolute; display: none; top: 60%; left: 50%; transform: translate(-50%, 0%); width: 340px; padding: 6px 12px; border: 2px dashed #333; background-color: #EEE; color: #000; font-family: Tahoma; font-size: 12px;';
    optionsDiv.innerHTML = '<div></div><div></div><div></div>';
    document.body.insertBefore(optionsDiv, nick.parentElement.nextElementSibling);
    optionsDiv.children[0].style = 'margin-bottom: 4px; padding-bottom: 6px; border-bottom: 1px solid #888; font-family: Ubuntu; font-size: 16px; text-align: center';
    optionsDiv.children[1].style = 'margin-bottom: 12px;';
    optionsDiv.children[2].style = 'font-size: 10px; text-align: right;';
    optionsDiv.children[0].innerHTML += 'Game Options<a style="position: absolute; top: 1px; right: 4px; color: #222; text-decoration: none; font-family: serif; font-size: 12px;" href="#">&#x2716;</a>';
    optionsDiv.children[1].innerHTML += '<div><strong>(Z)</strong><label><input type="checkbox" id="optnAutoRespawn">Auto respawn</label></div>';
    optionsDiv.children[1].innerHTML += '<div><strong>(X)</strong><label><input type="checkbox" id="optnAutoFire">Auto fire</label></div>';
    optionsDiv.children[1].innerHTML += '<div><strong>(C)</strong><label><input type="checkbox" id="optn4x3">4:3 aspect</label></div>';
    optionsDiv.children[1].innerHTML += '<div><strong>(V)</strong><label><input type="checkbox" id="optnDarkTheme">Dark theme</label></div>';
    optionsDiv.children[2].innerHTML += '<a style="background-color: #222; color: #AF3; padding: 1px 6px; border-radius: 2px; text-decoration: none; float: left;" href="http://i.imgur.com/zGB6vLI.png" target="_blank">></form>';
    popupsDiv = document.createElement('div');
    popupsDiv.id = 'notificationPopups';
    popupsDiv.style = 'position: absolute; display: flex; flex-direction: column-reverse; bottom: 10px; left: 210px; width: 260px; max-height: 200px; overflow: hidden; font-family: Ubuntu;';
    document.body.insertBefore(popupsDiv, optionsDiv.nextElementSibling);
    trDiv = document.createElement('div');
    trDiv.id = 'topRight';
    trDiv.style = 'position: absolute; top: 5px; right: 5px;';
    document.body.insertBefore(trDiv, popupsDiv.nextElementSibling);
    optionsDiv.children[0].getElementsByTagName('a') [0].onclick = function (e) {
      toggleOptions();
      e.preventDefault();
    };
    var options = optionsDiv.children[1];
    for (var i = 0; i < options.children.length; i++) {
      options.children[i].style = 'display: inline-block; width: 50%; margin: 2px 0px;';
      options.children[i].children[0].style = 'display: inline-block; width: 18px;';
      options.children[i].children[1].style = 'position: relative; top: 1px;';
      options.children[i].children[1].children[0].style = 'position: relative; top: 2px;';
    }
  }
  editPanels();
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].id) continue;
    if (localStorage.getItem(inputs[i].id) !== null) {
      if (inputs[i].type == 'checkbox') inputs[i].checked = JSON.parse(localStorage.getItem(inputs[i].id));
       else inputs[i].value = localStorage.getItem(inputs[i].id);
    }
    inputs[i].addEventListener('change', onInputsChanged);
  }
  function onInputsChanged() {
    if (this.id == 'optnAutoRespawn' && this.checked) respawnPlayer();
     else if (this.id == 'optnAutoFire') simulateKeyPress(69);
     else if (this.id == 'optn4x3') toggle4x3(this.checked);
    if (this != nick) createPopup(this.parentNode.textContent + ' <span style="color: ' + (this.checked ? '#9D2;">Enabled</span>' : '#F33;">Disabled</span>'));
    if (this.type == 'checkbox') localStorage.setItem(this.id, this.checked);
     else localStorage.setItem(this.id, this.value);
  }
  function toggle4x3(enabled) {
    if (enabled) {
      canvas.setAttribute('width', window.innerHeight * 4 / 3 + 'px');
      canvas.style.width = window.innerHeight * 4 / 3 + 'px';
    } 
    else {
      canvas.setAttribute('width', window.innerWidth);
      canvas.style.width = '';
    }
    optionsDiv.style.left = canvas.width / 2 + 'px';
  }
  document.addEventListener('keydown', function (e) {
    var key = e.keyCode || e.which;
    if (holdingKey[key]) {
      e.stopPropagation();
      return;
    }
    if (key == 27) toggleOptions();
    if (e.target == nick) {
      if (key == 13) onPlayerSpawn_Pre();
    } 
    else {
      if (!(e.ctrlKey || e.altKey || e.shiftKey)) {
        if (key == 90) document.getElementById('optnAutoRespawn').click();
         else if (key == 88) document.getElementById('optnAutoFire').click();
         else if (key == 67) document.getElementById('optn4x3').click();
         else if (key == 86) document.getElementById('optnDarkTheme').click();
      } 
      else if (e.shiftKey) {
        if (key >= 49 && key <= 52) {
          canvas.dispatchEvent(new MouseEvent('mousemove', {
            'clientX': 60,
            'clientY': 60
          }));
          setTimeout(function () {
            canvas.dispatchEvent(new MouseEvent('mousemove', {
              'clientX': 60,
              'clientY': 60
            }));
            if (canvas.style.cursor == 'pointer') {
              var nextTank = tankInfo.order[currentTank][key - 49];
              if (nextTank) {
                var data = new Uint8Array([4,
                nextTank]);
                proxiedSend.call(wsPrototype, data);
                currentTank = nextTank;
                createPopup('Tank upgrade: <span style="color: #FA2;">' + tankInfo.list[nextTank] + '</span>', 4000, '#800');
              }
            }
          }, 0);
        }
        e.stopPropagation();
      }
      holdingKey[key] = true;
    }
  });
  document.addEventListener('keyup', function (e) {
    var key = e.keyCode || e.which;
    holdingKey[key] = false;
  });
  function toggleOptions() {
    optionsDiv.style.display = optionsDiv.style.display == 'none' ? 'block' : 'none';
    keepOptionOpen = keepOptionOpen ? false : true;
  }
  function createPopup(msg, displayTime = 2000, bgColor = 'rgba(0,0,0,0.7)') {
    var popup = document.createElement('div');
    popup.style = 'display: table; background-color: ' + bgColor + '; color: #DDD; margin: 2px 0px; max-width: 260px; padding: 0px 16px 2px 16px; border-radius: 30px; font-size: 12px;';
    popup.innerHTML = msg;
    popupsDiv.insertBefore(popup, popupsDiv.firstChild);
    setTimeout(function () {
      popup.remove();
    }, displayTime);
  }
  var observer = new MutationObserver(function (changes) {
    changes.forEach(function (change) {
      if (nick.parentElement.style.display == 'none') {
        onPlayerSpawn();
        playerAlive = true;
      } 
      else {
        if (playerAlive == - 1) onGameLoad();
         else if (playerAlive === true) onPlayerDeath();
        playerAlive = false;
      }
    });
  });
  observer.observe(nick.parentElement, {
    attributes: true,
    attributeFilter: [
      'style'
    ]
  });
  function loadTrDiv() { //lol goodbye google...or maybe not?????
  }
  setTimeout(loadTrDiv, 10000);
  setInterval(loadTrDiv, 60000);
  function onGameLoad() {
    nick.value = localStorage.getItem('textInput');
    optionsDiv.style.display = 'block';
    if (document.getElementById('optnAutoRespawn').checked) setTimeout(function () {
      respawnPlayer();
    }, 1000);
    if (document.getElementById('optn4x3').checked) toggle4x3(true);
  }
  function onPlayerSpawn_Pre() {
    trDiv.style.display = 'none';
    if (!keepOptionOpen) optionsDiv.style.display = 'none';
  }
  function onPlayerSpawn() {
    currentTank = 0;
    for (var i = 0; i < Object.keys(statInfo).length; i++) statInfo[Object.keys(statInfo) [i]][2] = 0;
    if (document.getElementById('optnAutoFire').checked) simulateKeyPress(69);
  }
  function onPlayerDeath() {
    trDiv.style.display = 'block';
    if (document.getElementById('optnAutoRespawn').checked) respawnPlayer();
     else optionsDiv.style.display = 'block';
  }
  function respawnPlayer() {
    trDiv.style.display = 'none';
    nick.focus();
    simulateKeyPress(13);
    if (!keepOptionOpen) optionsDiv.style.display = 'none';
  }
  [
    'blur',
    'focus'
  ].forEach(function (e) {
    window.addEventListener(e, function () {
      holdingKey = {
      };
    });
  });
  window.addEventListener('resize', function () {
    if (document.getElementById('optn4x3').checked) toggle4x3(true);
  });
  function simulateKeyPress(key) {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') != - 1) {
      window.dispatchEvent(new KeyboardEvent('keydown', {
        keyCode: key
      }));
      window.dispatchEvent(new KeyboardEvent('keyup', {
        keyCode: key
      }));
    } 
    else {
      var eventObj;
      eventObj = document.createEvent('Events');
      eventObj.initEvent('keydown', true, true);
      eventObj.keyCode = key;
      window.dispatchEvent(eventObj);
      eventObj = document.createEvent('Events');
      eventObj.initEvent('keyup', true, true);
      eventObj.keyCode = key;
      window.dispatchEvent(eventObj);
    }
  } // Big thanks to the folks at https://github.com/firebolt55439/Diep.io-Protocol for the codes below

  var proxiedSend = window.WebSocket.prototype.send;
  var wsInstances = new Set();
  var wsPrototype = null;
  window.WebSocket.prototype.send = function (data) {
    if (!wsInstances.has(this)) {
      wsInstances.add(this);
      var inst = this;
      var proxiedRecv = inst.onmessage;
      this.onmessage = function (event) {
        event = handleRecvData.call(this, event, proxiedRecv);
        return proxiedRecv.call(this, event);
      };
      wsPrototype = this;
      console.log('Successfully hijacked onmessage handler.');
    }
    data = handleSendData.call(this, data);
    return proxiedSend.call(this, data);
  };
  var statInfo = {
    0: [
      'Movement Speed',
      '43FFF9',
      0
    ],
    2: [
      'Reload',
      '82FF43',
      0
    ],
    4: [
      'Bullet Damage',
      'FF4343',
      0
    ],
    6: [
      'Bullet Penetration',
      'FFDE43',
      0
    ],
    8: [
      'Bullet Speed',
      '437FFF',
      0
    ],
    10: [
      'Body Damage',
      '8543FF',
      0
    ],
    12: [
      'Max Health',
      'F943FF',
      0
    ],
    14: [
      'Health Regen',
      'FCAD76',
      0
    ]
  };
  var currentTank = 0;
  var tankInfo = {
    'list': {
      2: 'Twin',
      4: 'Triplet',
      6: 'Triple Shot',
      8: 'Quad Tank',
      10: 'Octo Tank',
      12: 'Sniper',
      14: 'Machine Gun',
      16: 'Flank Guard',
      18: 'Tri-Angle',
      20: 'Destroyer',
      22: 'Overseer',
      24: 'Overlord',
      26: 'Twin Flank',
      28: 'Penta Shot',
      30: 'Assassin',
      34: 'Necromancer',
      36: 'Triple Twin',
      38: 'Hunter',
      40: 'Gunner',
      42: 'Stalker',
      44: 'Ranger',
      46: 'Booster',
      48: 'Fighter',
      50: 'Hybrid',
      52: 'Manager'
    },
    'order': {
      0: [
        2,
        12,
        14,
        16
      ], // 'Default': [ 'Twin', 'Sniper', 'Machine Gun', 'Flank Guard' ],
      2: [
        6,
        8,
        26
      ], // 'Twin': [ 'Triple Shot', 'Quad Tank', 'Twin Flank' ],
      12: [
        30,
        22,
        38
      ], // 'Sniper': [ 'Assassin', 'Overseer', 'Hunter' ],
      14: [
        20,
        40
      ], // 'Machine Gun': [ 'Destroyer', 'Gunner' ],
      16: [
        18,
        8,
        26
      ], // 'Flank Guard': [ 'Tri Angle', 'Quad Tank', 'Twin Flank' ],
      6: [
        4,
        28
      ], // 'Triple Shot': [ 'Triplet', 'Penta Shot' ],
      8: [
        10
      ], // 'Quad Tank': [ 'Octo Tank' ],
      26: [
        10,
        36
      ], // 'Twin Flank': [ 'Octo Tank', 'Triple Twin' ],
      30: [
        44,
        42
      ], // 'Assassin': [ 'Ranger', 'Stalker' ],
      22: [
        24,
        34,
        52
      ], // 'Overseer': [ 'Overlord', 'Necromancer', 'Manager' ],
      20: [
        50
      ], // 'Destroyer' : [ 'Hybrid' ],
      18: [
        46,
        48
      ] // 'Tri-Angle': [ 'Booster', 'Fighter' ],
    },
    'order_min': {
      0: [
        2,
        12,
        14,
        16
      ],
      2: [
        6,
        8,
        26
      ],
      12: [
        30,
        22,
        38
      ],
      14: [
        20,
        40
      ],
      16: [
        18,
        8,
        26
      ],
      6: [
        4,
        28
      ],
      8: [
        10
      ],
      26: [
        10,
        36
      ],
      30: [
        44,
        42
      ],
      22: [
        24,
        34,
        52
      ],
      20: [
        50
      ],
      18: [
        46,
        48
      ]
    },
    'fullorder_min': {
      0: {
        2: {
          6: [
            4,
            28
          ],
          8: [
            10
          ],
          26: [
            10,
            36
          ]
        },
        12: {
          30: [
            44,
            42
          ],
          22: [
            24,
            34,
            52
          ],
          38: [
          ]
        },
        14: {
          20: [
            50
          ],
          40: [
          ]
        },
        16: {
          18: [
            46,
            48
          ],
          8: [
            10
          ],
          26: [
            10,
            36
          ]
        }
      }
    }
  };
  function handleRecvData(event, proxiedRecv) {
    var dv = new DataView(event.data);
    var arr = new Uint8Array(event.data);
    if (arr[0] == 4) { // server info
      var str = String.fromCharCode.apply(null, arr.slice(1, arr.length - 1));
      console.log('WS Packet: ServerInfo. str: ' + str);
    }
    return event;
  }
  function handleSendData(data) {
    if (data[0] == 0 || data[0] == 2) { // server connect
      var str = String.fromCharCode.apply(null, data.slice(1, data.length - 1));
      if (data[0] == 0) console.log('WS Packet: OnConnect. Player ID: ' + str);
       else console.log('WS Packet: OnSpawn. Name: "' + str + '"');
    } 
    else if (data[0] == 3) { // stat upgrade
      var upgrade = data[1];
      statInfo[upgrade][2]++;
      createPopup('Upgraded level ' + statInfo[upgrade][2] + ' <span style="color: #' + statInfo[upgrade][1] + '">' + statInfo[upgrade][0] + '</span>');
    } 
    else if (data[0] == 4) { // tank upgrade
      var upgrade = data[1];
      currentTank = upgrade;
      createPopup('Tank upgrade: <span style="color: #FA2;">' + tankInfo.list[upgrade] + '</span>', 4000, '#800');
    }
    return data;
  }
}
