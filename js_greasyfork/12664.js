// ==UserScript==
// @name         ZTx-Lite
// @namespace    Exposed
// @description  LTEST
// @version      0.1
// @author       AkiraYasha
// @match        http://agar.io
// @match        https://agar.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.0/lodash.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/12664/ZTx-Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/12664/ZTx-Lite.meta.js
// ==/UserScript==
i18n_lang = 'en';
i18n_dict = {
  'en': {
    'connecting': 'Connecting',
    'connect_help': 'If you cannot connect to the servers, check if you have some anti virus or firewall blocking the connection.',
    'play': 'ORC',
    'spectate': 'Spectate',
    'login_and_play': 'Login and play',
    'play_as_guest': 'Play as guest',
    'share': 'Share',
    'advertisement': 'Advertisement',
    'privacy_policy': 'Privacy Policy',
    'terms_of_service': 'Terms of Service',
    'changelog': 'Changelog',
    'instructions_mouse': 'Move your mouse to control your cell',
    'instructions_space': 'Press <b>Space</b> to split',
    'instructions_w': 'Press <b>W</b> to eject some mass',
    'gamemode_ffa': 'FFA',
    'gamemode_teams': 'Teams',
    'gamemode_experimental': 'Experimental',
    'region_select': ' -- Select a Region -- ',
    'region_us_east': 'US East',
    'region_us_west': 'US West',
    'region_north_america': 'North America',
    'region_south_america': 'South America',
    'region_europe': 'Europe',
    'region_turkey': 'Turkey',
    'region_poland': 'Poland',
    'region_east_asia': 'East Asia',
    'region_russia': 'Russia',
    'region_china': 'China',
    'region_oceania': 'Oceania',
    'region_australia': 'Australia',
    'region_players': 'players',
    'option_no_skins': 'No skins',
    'option_no_names': 'No names',
    'option_dark_theme': 'Dark theme',
    'option_no_colors': 'No colors',
    'option_show_mass': 'Show mass',
    'leaderboard': 'Leaderboard',
    'unnamed_cell': 'An unnamed cell',
    'last_match_results': 'Last match results',
    'score': 'Score',
    'leaderboard_time': 'Leaderboard Time',
    'mass_eaten': 'Mass Eaten',
    'top_position': 'Top Position',
    'position_1': 'First',
    'position_2': 'Second',
    'position_3': 'Third',
    'position_4': 'Fourth',
    'position_5': 'Fifth',
    'position_6': 'Sixth',
    'position_7': 'Seventh',
    'position_8': 'Eighth',
    'position_9': 'Ninth',
    'position_10': 'Tenth',
    'player_cells_eaten': 'Player Cells Eaten',
    'survival_time': 'Survival Time',
    'games_played': 'Games played',
    'highest_mass': 'Highest mass',
    'total_cells_eaten': 'Total cells eaten',
    'total_mass_eaten': 'Total mass eaten',
    'longest_survival': 'Longest survival',
    'logout': 'Logout',
    'stats': 'Stats',
    'shop': 'Shop',
    'party': 'Party',
    'party_description': 'Play with your friends in the same map',
    'create_party': 'Create',
    'creating_party': 'Creating party...',
    'join_party': 'Join',
    'back_button': 'Back',
    'joining_party': 'Joining party...',
    'joined_party_instructions': 'You are now playing with this party:',
    'party_join_error': 'There was a problem joining that party, please make sure the code is correct, or try creating another party',
    'login_tooltip': 'Login with Facebook and get:<br\xA0/><br /><br />Start the game with more mass!<br />Level up to get even more starting mass!',
    'create_party_instructions': 'Give this link to your friends:',
    'join_party_instructions': 'Your friend should have given you a code, type it here:',
    'continue': 'Continue',
    'option_skip_stats': 'Skip stats',
    'stats_food_eaten': 'food eaten',
    'stats_highest_mass': 'highest mass',
    'stats_time_alive': 'time alive',
    'stats_leaderboard_time': 'leaderboard time',
    'stats_cells_eaten': 'cells eaten',
    'stats_top_position': 'top position',
    '': ''
  },
  '?': {}
};
i18n_lang = (window.navigator.userLanguage || window.navigator.language || 'en').split('-')[0];
if (!i18n_dict.hasOwnProperty(i18n_lang)) {
  i18n_lang = 'en';
}
i18n = i18n_dict[i18n_lang];

jQuery("#canvas").remove();
jQuery("#connecting").after('<canvas id="canvas" width="800" height="600"></canvas>');

(function(window, $) {
  function Init() {
    g_drawLines = true;
    PlayerStats();
    setInterval(PlayerStats, 180000);
    g_canvas = g_canvas_ = document.getElementById('canvas');
    g_context = g_canvas.getContext('2d');
    g_canvas.onmousedown = function(event) {
      if (g_touchCapable) {
        var deltaX = event.clientX - (5 + g_ready / 5 / 2);
        var deltaY = event.clientY - (5 + g_ready / 5 / 2);
        if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= g_ready / 5 / 2) {
          SendPos();
          SendCmd(17);
          return;
        }
      }
      g_mouseX = 1 * event.clientX;
      g_mouseY = 1 * event.clientY;
      UpdatePos();
      SendPos();
    };
    g_canvas.onmousemove = function(event) {
      g_mouseX = 1 * event.clientX;
      g_mouseY = 1 * event.clientY;
      UpdatePos();
    };
    g_canvas.onmouseup = function() {};
    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener('DOMMouseScroll', WheelHandler, false);
    } else {
      document.body.onmousewheel = WheelHandler;
    }
    var spaceDown = false;
    var cachedSkin = false;
    var wkeyDown = false;
    var gkeyDown = false;
    var ekeyDown = false;

    function handleQuickFeed() {
      if (ekeyDown) {
        SendPos();
        SendCmd(21);            
        setTimeout(handleQuickFeed, 142);
      }
    }
      
    window.onkeydown = function(event) {
      if (!(32 != event.keyCode || spaceDown)) {
        SendPos();
        SendCmd(17);
        spaceDown = true;
      }
      if (!(81 != event.keyCode || cachedSkin)) {
        SendCmd(18);
        cachedSkin = true;
      }
      if (!(87 != event.keyCode || wkeyDown)) {
        SendPos();
        SendCmd(21);
        wkeyDown = true;
      }
      if (!(71 != event.keyCode || gkeyDown)) {
        showGrid = window.localStorage.showGrid = !showGrid;
        gkeyDown = true;
      }
      if (!(69 != event.keyCode || gkeyDown)) {
        ekeyDown = true;
        handleQuickFeed();
      }
      if (27 == event.keyCode) {
        __unmatched_10(300);
      }
    };
    window.onkeyup = function(event) {
      if (32 == event.keyCode) {
        spaceDown = false;
      }
      if (87 == event.keyCode) {
        wkeyDown = false;
      }
      if (71 == event.keyCode) {
        gkeyDown = false;
      }
      if (69 == event.keyCode) {
        ekeyDown = false;
      }
      if (81 == event.keyCode && cachedSkin) {
        SendCmd(19);
        cachedSkin = false;
      }
    };
    window.onblur = function() {
      SendCmd(19);
      wkeyDown = gkeyDown = ekeyDown = cachedSkin = spaceDown = false;
    };
    window.onresize = ResizeHandler;
    window.requestAnimationFrame(__unmatched_135);
    setInterval(SendPos, 40);
    if (g_region) {
      $('#region').val(g_region);
    }
    SyncRegion();
    SetRegion($('#region').val());
    if (0 == __unmatched_114 && g_region) {
      Start();
    }
    __unmatched_10(0);
    ResizeHandler();
    if (window.location.hash && 6 <= window.location.hash.length) {
      RenderLoop(window.location.hash);
    }
  }
  function WheelHandler(event) {
      g_zoom *= Math.pow(0.9, event.wheelDelta / -120 || event.detail || 0);
  }
  function UpdateTree() {
    if (0.4 > g_scale) {
      g_pointTree = null;
    } else {
      for (var minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, i = 0; i < g_cells.length; i++) {
        var cell = g_cells[i];
        if (!(!cell.H() || cell.L || 20 >= cell.size * g_scale)) {
          minX = Math.min(cell.x - cell.size, minX);
          minY = Math.min(cell.y - cell.size, minY);
          maxY = Math.max(cell.x + cell.size, maxY);
          maxX = Math.max(cell.y + cell.size, maxX);
        }
      }
      g_pointTree = QTreeFactory.X({
        ba: minX - 10,
        ca: minY - 10,
        Z: maxY + 10,
        $: maxX + 10,
        fa: 2,
        ha: 4
      });
      for (i = 0; i < g_cells.length; i++) {
        if (cell = g_cells[i], cell.H() && !(20 >= cell.size * g_scale)) {
          for (minX = 0; minX < cell.a.length; ++minX) {
            minY = cell.a[minX].x;
            maxY = cell.a[minX].y;
            if (!(minY < g_viewX - g_ready / 2 / g_scale || maxY < g_viewY - noClip / 2 / g_scale || minY > g_viewX + g_ready / 2 / g_scale || maxY > g_viewY + noClip / 2 / g_scale)) {
              g_pointTree.Y(cell.a[minX]);
            }
          }
        }
      }
    }
  }
  function UpdatePos() {
    g_moveX = (g_mouseX - g_ready / 2) / g_scale + g_viewX;
    g_moveY = (g_mouseY - noClip / 2) / g_scale + g_viewY;
  }
  function PlayerStats() {
    if (null == g_regionLabels) {
      g_regionLabels = {};
      $('#region').children().each(function() {
        var $this = $(this);
        var val = $this.val();
        if (val) {
          g_regionLabels[val] = $this.text();
        }
      });
    }
    $.get(g_protocol + 'info', function(data) {
      var regionNumPlayers = {};
      var region;
      for (region in data.regions) {
        var region_ = region.split(':')[0];
        regionNumPlayers[region_] = regionNumPlayers[region_] || 0;
        regionNumPlayers[region_] += data.regions[region].numPlayers;
      }
      for (region in regionNumPlayers) {
        $('#region option[value="' + region + '"]').text(g_regionLabels[region] + ' (' + regionNumPlayers[region] + ' players)');
      }
    }, 'json');
  }
  function HideOverlay() {
    $('#adsBottom').hide();
    $('#overlays').hide();
    $('#stats').hide();
    $('#mainPanel').hide();
    __unmatched_147 = g_playerCellDestroyed = false;
    SyncRegion();
    __unmatched_14(window.aa.concat(window.ac));
  }
  function SetRegion(val) {
    if (val && val != g_region) {
      if ($('#region').val() != val) {
        $('#region').val(val);
      }
      g_region = window.localStorage.location = val;
      $('.region-message').hide();
      $('.region-message.' + val).show();
      $('.btn-needs-server').prop('disabled', false);
      if (g_drawLines) {
        Start();
      }
    }
  }
  function __unmatched_10(char) {
    if (!(g_playerCellDestroyed || __unmatched_147)) {
      g_nick = null;
      if (!__unmatched_122) {
        $('#adsBottom').show();
        $('#g300x250').hide();
        $('#a300x250').show();
      }
      __unmatched_13(__unmatched_122 ? window.ac : window.aa);
      __unmatched_122 = false;
      if (1000 > char) {
        qkeyDown = 1;
      }
      g_playerCellDestroyed = true;
      $('#mainPanel').show();
      if (0 < char) {
        $('#overlays').fadeIn(char);
      } else {
        $('#overlays').show();
      }
    }
  }
  function n(rect) {
    $('#helloContainer').attr('data-gamemode', rect);
    __unmatched_97 = rect;
    $('#gamemode').val(rect);
  }
  function SyncRegion() {
    if ($('#region').val()) {
      window.localStorage.location = $('#region').val();
    } else if (window.localStorage.location) {
      $('#region').val(window.localStorage.location);
    }
    if ($('#region').val()) {
      $('#locationKnown').append($('#region'));
    } else {
      $('#locationUnknown').append($('#region'));
    }
  }
  function __unmatched_13(__unmatched_180) {
    if (window.googletag) {
      window.googletag.cmd.push(function() {
        if (g_canRefreshAds) {
          g_canRefreshAds = false;
          setTimeout(function() {
            g_canRefreshAds = true;
          }, 60000 * g_refreshAdsCooldown);
          if (window.googletag && window.googletag.pubads && window.googletag.pubads().refresh) {
            window.googletag.pubads().refresh(__unmatched_180);
          }
        }
      });
    }
  }
  function __unmatched_14(__unmatched_181) {
    if (window.googletag && window.googletag.pubads && window.googletag.pubads().clear) {
      window.googletag.pubads().clear(__unmatched_181);
    }
  }
  function Render(i) {
    return window.i18n[i] || window.i18n_dict.en[i] || i;
  }
  function FindGame() {
    var __unmatched_183 = ++__unmatched_114;
    console.log('Find ' + g_region + __unmatched_97);
    $.ajax(g_protocol + 'findServer', {
      error: function() {
        setTimeout(FindGame, 1000);
      },
      success: function(point) {
        if (__unmatched_183 == __unmatched_114) {
          if (point.alert) {
            alert(point.alert);
          }
          Connect('ws://' + point.ip, point.token);
        }
      },
      dataType: 'json',
      method: 'POST',
      cache: false,
      crossDomain: true,
      data: (g_region + __unmatched_97 || '?') + '\n154669603'
    });
  }
  function Start() {
    if (g_drawLines && g_region) {
      $('#connecting').show();
      FindGame();
    }
  }
  function Connect(address, ticket) {
    if (g_socket) {
      g_socket.onopen = null;
      g_socket.onmessage = null;
      g_socket.onclose = null;
      try {
        g_socket.close();
      } catch (exception) {}
      g_socket = null;
    }
    if (__unmatched_116.ip) {
      address = 'ws://' + __unmatched_116.ip;
    }
    if (null != __unmatched_126) {
      var __unmatched_187 = __unmatched_126;
      __unmatched_126 = function() {
        __unmatched_187(ticket);
      };
    }
    if (g_secure) {
      var parts = address.split(':');
      address = parts[0] + 's://ip-' + parts[1].replace(/\./g, '-').replace(/\//g, '') + '.tech.agar.io:' + +parts[2];
    }
    g_playerCellIds = [];
    g_playerCells = [];
    g_cellsById = {};
    g_cells = [];
    g_destroyedCells = [];
    g_scoreEntries = [];
    g_leaderboardCanvas = g_scorePartitions = null;
    g_maxScore = 0;
    g_connectSuccessful = false;
    console.log('Connecting to ' + address);
    g_socket = new WebSocket(address);
    g_socket.binaryType = 'arraybuffer';
    g_socket.onopen = function() {
      var data;
      console.log('socket open');
      data = GetBuffer(5);
      data.setUint8(0, 254);
      data.setUint32(1, 5, true);
      SendBuffer(data);
      data = GetBuffer(5);
      data.setUint8(0, 255);
      data.setUint32(1, 154669603, true);
      SendBuffer(data);
      data = GetBuffer(1 + ticket.length);
      data.setUint8(0, 80);
      for (var i = 0; i < ticket.length; ++i) {
        data.setUint8(i + 1, ticket.charCodeAt(i));
      }
      SendBuffer(data);
      RefreshAds();
    };
    g_socket.onmessage = MessageHandler;
    g_socket.onclose = CloseHandler;
    g_socket.onerror = function() {
      console.log('socket error');
    };
  }
  function GetBuffer(size) {
    return new DataView(new ArrayBuffer(size));
  }
  function SendBuffer(data) {
    g_socket.send(data.buffer);
  }
  function CloseHandler() {
    if (g_connectSuccessful) {
      g_retryTimeout = 500;
    }
    console.log('socket close');
    setTimeout(Start, g_retryTimeout);
    g_retryTimeout *= 2;
  }
  function MessageHandler(data) {
    Receive(new DataView(data.data));
  }
  function Receive(data) {
    function __unmatched_196() {
      for (var string = '';;) {
        var char = data.getUint16(pos, true);
        pos += 2;
        if (0 == char) {
          break;
        }
        string += String.fromCharCode(char);
      }
      return string;
    }
    var pos = 0;
    if (240 == data.getUint8(pos)) {
      pos += 5;
    }
    switch (data.getUint8(pos++)) {
      case 16:
        ParseCellUpdates(data, pos);
        break;
      case 17:
        g_viewX_ = data.getFloat32(pos, true);
        pos += 4;
        g_viewY_ = data.getFloat32(pos, true);
        pos += 4;
        g_scale_ = data.getFloat32(pos, true);
        pos += 4;
        break;
      case 20:
        g_playerCells = [];
        g_playerCellIds = [];
        break;
      case 21:
        g_linesY_ = data.getInt16(pos, true);
        pos += 2;
        g_linesX_ = data.getInt16(pos, true);
        pos += 2;
        if (!__unmatched_100) {
          __unmatched_100 = true;
          g_linesX = g_linesY_;
          g_linesY = g_linesX_;
        }
        break;
      case 32:
        g_playerCellIds.push(data.getUint32(pos, true));
        pos += 4;
        break;
      case 49:
        if (null != g_scorePartitions) {
          break;
        }
        var num = data.getUint32(pos, true);
        var pos = pos + 4;
        g_scoreEntries = [];
        for (var i = 0; i < num; ++i) {
          var id = data.getUint32(pos, true);
          var pos = pos + 4;
          g_scoreEntries.push({
            id: id,
            name: __unmatched_196()
          });
        }
        UpdateLeaderboard();
        break;
      case 50:
        g_scorePartitions = [];
        num = data.getUint32(pos, true);
        pos += 4;
        for (i = 0; i < num; ++i) {
          g_scorePartitions.push(data.getFloat32(pos, true));
          pos += 4;
        }
        UpdateLeaderboard();
        break;
      case 64:
        g_minX = data.getFloat64(pos, true);
        pos += 8;
        g_minY = data.getFloat64(pos, true);
        pos += 8;
        g_maxX = data.getFloat64(pos, true);
        pos += 8;
        g_maxY = data.getFloat64(pos, true);
        pos += 8;
        g_viewX_ = (g_maxX + g_minX) / 2;
        g_viewY_ = (g_maxY + g_minY) / 2;
        g_scale_ = 1;
        if (0 == g_playerCells.length) {
          g_viewX = g_viewX_;
          g_viewY = g_viewY_;
          g_scale = g_scale_;
        }
        break;
      case 81:
        var x = data.getUint32(pos, true);
        var pos = pos + 4;
        var __unmatched_202 = data.getUint32(pos, true);
        var pos = pos + 4;
        var __unmatched_203 = data.getUint32(pos, true);
        var pos = pos + 4;
        setTimeout(function() {
          __unmatched_44({
            d: x,
            e: __unmatched_202,
            c: __unmatched_203
          });
        }, 1200);
    }
  }
  function ParseCellUpdates(data, pos) {
    function __unmatched_208() {
      for (var string = '';;) {
        var id = data.getUint16(pos, true);
        pos += 2;
        if (0 == id) {
          break;
        }
        string += String.fromCharCode(id);
      }
      return string;
    }
    function __unmatched_209() {
      for (var __unmatched_224 = '';;) {
        var r = data.getUint8(pos++);
        if (0 == r) {
          break;
        }
        __unmatched_224 += String.fromCharCode(r);
      }
      return __unmatched_224;
    }
    __unmatched_109 = g_time = Date.now();
    if (!g_connectSuccessful) {
      g_connectSuccessful = true;
      __unmatched_25();
    }
    __unmatched_90 = false;
    var num = data.getUint16(pos, true);
    pos += 2;
    for (var i = 0; i < num; ++i) {
      var cellA = g_cellsById[data.getUint32(pos, true)];
      var cellB = g_cellsById[data.getUint32(pos + 4, true)];
      pos += 8;
      if (cellA && cellB) {
        cellB.R();
        cellB.o = cellB.x;
        cellB.p = cellB.y;
        cellB.n = cellB.size;
        cellB.C = cellA.x;
        cellB.D = cellA.y;
        cellB.m = cellB.size;
        cellB.K = g_time;
        __unmatched_50(cellA, cellB);
      }
    }
    for (i = 0;;) {
      num = data.getUint32(pos, true);
      pos += 4;
      if (0 == num) {
        break;
      }
      ++i;
      var size;
      var cellA = data.getInt32(pos, true);
      pos += 4;
      cellB = data.getInt32(pos, true);
      pos += 4;
      size = data.getInt16(pos, true);
      pos += 2;
      var flags = data.getUint8(pos++);
      var y = data.getUint8(pos++);
      var b = data.getUint8(pos++);
      var y = __unmatched_41(flags << 16 | y << 8 | b);
      var b = data.getUint8(pos++);
      var isVirus = !!(b & 1);
      var isAgitated = !!(b & 16);
      var __unmatched_220 = null;
      if (b & 2) {
        pos += 4 + data.getUint32(pos, true);
      }
      if (b & 4) {
        __unmatched_220 = __unmatched_209();
      }
      var name = __unmatched_208();
      var flags = null;
      if (g_cellsById.hasOwnProperty(num)) {
        flags = g_cellsById[num];
        flags.J();
        flags.o = flags.x;
        flags.p = flags.y;
        flags.n = flags.size;
        flags.color = y;
      } else {
        flags = new Cell(num, cellA, cellB, size, y, name);
        g_cells.push(flags);
        g_cellsById[num] = flags;
        flags.ia = cellA;
        flags.ja = cellB;
      }
      flags.f = isVirus;
      flags.j = isAgitated;
      flags.C = cellA;
      flags.D = cellB;
      flags.m = size;
      flags.K = g_time;
      flags.T = b;
      if (__unmatched_220) {
        flags.V = __unmatched_220;
      }
      if (name) {
        flags.t(name);
      }
      if (-1 != g_playerCellIds.indexOf(num) && -1 == g_playerCells.indexOf(flags)) {
        g_playerCells.push(flags);
        if (1 == g_playerCells.length) {
          g_viewX = flags.x;
          g_viewY = flags.y;
          __unmatched_141();
          document.getElementById('overlays').style.display = 'none';
          points = [];
          __unmatched_145 = 0;
          __unmatched_146 = g_playerCells[0].color;
          __unmatched_148 = true;
          __unmatched_149 = Date.now();
          g_mode = __unmatched_152 = __unmatched_151 = 0;
        }
      }
    }
    cellA = data.getUint32(pos, true);
    pos += 4;
    for (i = 0; i < cellA; i++) {
      num = data.getUint32(pos, true);
      pos += 4;
      flags = g_cellsById[num];
      if (null != flags) {
        flags.R();
      }
    }
    if (__unmatched_90 && 0 == g_playerCells.length) {
      __unmatched_150 = Date.now();
      __unmatched_148 = false;
      if (!(g_playerCellDestroyed || __unmatched_147)) {
        if (__unmatched_154) {
          __unmatched_13(window.ab);
          ShowOverlay();
          __unmatched_147 = true;
          $('#overlays').fadeIn(3000);
          $('#stats').show();
        } else {
          __unmatched_10(3000);
        }
      }
    }
  }
  function __unmatched_25() {
    $('#connecting').hide();
    SendNick();
    if (__unmatched_126) {
      __unmatched_126();
      __unmatched_126 = null;
    }
    if (null != __unmatched_128) {
      clearTimeout(__unmatched_128);
    }
    __unmatched_128 = setTimeout(function() {
      if (window.ga) {
        ++__unmatched_129;
        window.ga('set', 'dimension2', __unmatched_129);
      }
    }, 10000);
  }
  function SendPos() {
    if (IsConnected()) {
      var deltaY = g_mouseX - g_ready / 2;
      var delta = g_mouseY - noClip / 2;
      if (!(64 > deltaY * deltaY + delta * delta || 0.01 > Math.abs(g_lastMoveY - g_moveX) && 0.01 > Math.abs(g_lastMoveX - g_moveY))) {
        g_lastMoveY = g_moveX;
        g_lastMoveX = g_moveY;
        deltaY = GetBuffer(13);
        deltaY.setUint8(0, 16);
        deltaY.setInt32(1, g_moveX, true);
        deltaY.setInt32(5, g_moveY, true);
        deltaY.setUint32(9, 0, true);
        SendBuffer(deltaY);
      }
    }
  }
  function SendNick() {
    if (IsConnected() && g_connectSuccessful && null != g_nick) {
      var data = GetBuffer(1 + 2 * g_nick.length);
      data.setUint8(0, 0);
      for (var i = 0; i < g_nick.length; ++i) {
        data.setUint16(1 + 2 * i, g_nick.charCodeAt(i), true);
      }
      SendBuffer(data);
      g_nick = null;
    }
  }
  function IsConnected() {
    return null != g_socket && g_socket.readyState == g_socket.OPEN;
  }
  function SendCmd(cmd) {
    if (IsConnected()) {
      var data = GetBuffer(1);
      data.setUint8(0, cmd);
      SendBuffer(data);
    }
  }
  function RefreshAds() {
    if (IsConnected() && null != __unmatched_110) {
      var __unmatched_232 = GetBuffer(1 + __unmatched_110.length);
      __unmatched_232.setUint8(0, 81);
      for (var y = 0; y < __unmatched_110.length; ++y) {
        __unmatched_232.setUint8(y + 1, __unmatched_110.charCodeAt(y));
      }
      SendBuffer(__unmatched_232);
    }
  }
  function ResizeHandler() {
    g_ready = 1 * window.innerWidth;
    noClip = 1 * window.innerHeight;
    g_canvas_.width = g_canvas.width = g_ready;
    g_canvas_.height = g_canvas.height = noClip;
    var $dialog = $('#helloContainer');
    $dialog.css('transform', 'none');
    var dialogHeight = $dialog.height();
    var height = window.innerHeight;
    if (dialogHeight > height / 1.1) {
      $dialog.css('transform', 'translate(-50%, -50%) scale(' + height / dialogHeight / 1.1 + ')');
    } else {
      $dialog.css('transform', 'translate(-50%, -50%)');
    }
    GetScore();
  }
  function ScaleModifier() {
    var scale;
    scale = 1 * Math.max(noClip / 1080, g_ready / 1920);
    return scale *= g_zoom;
  }
  function __unmatched_33() {
    if (0 != g_playerCells.length) {
      for (var scale = 0, i = 0; i < g_playerCells.length; i++) {
        scale += g_playerCells[i].size;
      }
      scale = Math.pow(Math.min(64 / scale, 1), 0.4) * ScaleModifier();
      g_scale = (9 * g_scale + scale) / 10;
    }
  }
    
    var showGrid = window.localStorage.showGrid || false;
    
    function renderBackground(context, x1, x0, y1, y0) {
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        var gridWidth = 5;
        var gridHeight = 7;

        var xMax = Math.round(x1);
        var xMin = Math.round(x0);
        var yMax = Math.round(y1);
        var yMin = Math.round(y0);

        var xLength = xMax - xMin;
        var yLength = yMax - yMin;

        context.save();

        if (showGrid) {
            var xPart = xLength / gridWidth;
            var yPart = yLength / gridHeight;

            context.beginPath();
            context.lineWidth = 20;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = (0.6 * xPart) + 'px Ubuntu';
            
            context.fillStyle = g_showMass ? '#1A1A1A' : '#e5e5e5';

            for (var j = 0; j < gridHeight; j++) {
                for (var i = 0; i < gridWidth; i++) {
                    context.fillText(letters[j] + (i + 1), (xMin + xPart * i) + (xPart / 2), (yMin + yPart * j) + (yPart / 2));
                }
            }

            context.lineWidth = 160;
            context.strokeStyle = g_showMass ? '#1A1A1A' : '#e5e5e5';

            for (var j = 0; j < gridHeight; j++) {
                for (var i = 0; i < gridWidth; i++) {
                    context.strokeRect(xMin + xPart * i, yMin + yPart * j, xPart, yPart);
                }
            }

            context.stroke();
        }

        context.beginPath();
        context.strokeStyle = "#F44336";
        context.lineWidth = 90;
        context.strokeRect(x0 - 90, y0 - 90, xLength + 180, yLength + 180);
        context.restore();
    }    
    
  function GetScore() {
    var x;
    var time = Date.now();
    ++__unmatched_77;
    g_time = time;
    if (0 < g_playerCells.length) {
      __unmatched_33();
      for (var y = x = 0, i = 0; i < g_playerCells.length; i++) {
        g_playerCells[i].J();
        x += g_playerCells[i].x / g_playerCells.length;
        y += g_playerCells[i].y / g_playerCells.length;
      }
      g_viewX_ = x;
      g_viewY_ = y;
      g_scale_ = g_scale;
      g_viewX = (g_viewX + x) / 2;
      g_viewY = (g_viewY + y) / 2;
    } else {
      g_viewX = (29 * g_viewX + g_viewX_) / 30;
      g_viewY = (29 * g_viewY + g_viewY_) / 30;
      g_scale = (9 * g_scale + g_scale_ * ScaleModifier()) / 10;
    }
    UpdateTree();
    UpdatePos();
    if (!g_showTrails) {
      g_context.clearRect(0, 0, g_ready, noClip);
    }
    if (g_showTrails) {
      g_context.fillStyle = g_showMass ? '#111111' : '#F2FBFF';
      g_context.globalAlpha = 0.05;
      g_context.fillRect(0, 0, g_ready, noClip);
      g_context.globalAlpha = 1;
    } else {
        if (showGrid) {
          g_context.fillStyle = g_showMass ? '#000000' : '#F2FBFF';
          g_context.fillRect(0, 0, g_ready, noClip);
        } else {
          DrawGrid();
        }
    }
    g_cells.sort(function(A, B) {
      return A.size == B.size ? A.id - B.id : A.size - B.size;
    });
    g_context.save();
    g_context.translate(g_ready / 2, noClip / 2);
    g_context.scale(g_scale, g_scale);
    g_context.translate(-g_viewX, -g_viewY);
      
    renderBackground(g_context, g_maxX, g_minX, g_maxY, g_minY);
      
    for (i = 0; i < g_destroyedCells.length; i++) {
      g_destroyedCells[i].s(g_context);
    }
    for (i = 0; i < g_cells.length; i++) {
      g_cells[i].s(g_context);
    }
    if (__unmatched_100) {
      g_linesX = (3 * g_linesX + g_linesY_) / 4;
      g_linesY = (3 * g_linesY + g_linesX_) / 4;
      g_context.save();
      g_context.strokeStyle = '#FFAAAA';
      g_context.lineWidth = 10;
      g_context.lineCap = 'round';
      g_context.lineJoin = 'round';
      g_context.globalAlpha = 0.5;
      g_context.beginPath();
      for (i = 0; i < g_playerCells.length; i++) {
        g_context.moveTo(g_playerCells[i].x, g_playerCells[i].y);
        g_context.lineTo(g_linesX, g_linesY);
      }
      g_context.stroke();
      g_context.restore();
    }
    g_context.restore();
    if (g_leaderboardCanvas && g_leaderboardCanvas.width) {
      g_context.drawImage(g_leaderboardCanvas, g_ready - g_leaderboardCanvas.width - 10, 10);
    }
    g_maxScore = Math.max(g_maxScore, __unmatched_37());
    if (0 != g_maxScore) {
      if (null == g_cachedScore) {
        g_cachedScore = new CachedCanvas(24, '#FFFFFF');
      }
      g_cachedScore.u(Render('score') + ': ' + ~~(g_maxScore / 100));
      y = g_cachedScore.F();
      x = y.width;
      g_context.globalAlpha = 0.2;
      g_context.fillStyle = '#000000';
      g_context.fillRect(10, noClip - 10 - 24 - 10, x + 10, 34);
      g_context.globalAlpha = 1;
      g_context.drawImage(y, 15, noClip - 10 - 24 - 5);
    }
    DrawSplitImage();
    time = Date.now() - time;
    if (time > 1000 / 60) {
      g_pointNumScale -= 0.01;
    } else if (time < 1000 / 65) {
      g_pointNumScale += 0.01;
    }
    if (0.4 > g_pointNumScale) {
      g_pointNumScale = 0.4;
    }
    if (1 < g_pointNumScale) {
      g_pointNumScale = 1;
    }
    time = g_time - __unmatched_79;
    if (!IsConnected() || g_playerCellDestroyed || __unmatched_147) {
      qkeyDown += time / 2000;
      if (1 < qkeyDown) {
        qkeyDown = 1;
      }
    } else {
      qkeyDown -= time / 300;
      if (0 > qkeyDown) {
        qkeyDown = 0;
      }
    }
    if (0 < qkeyDown) {
      g_context.fillStyle = '#000000';
      if (__unmatched_115) {
        g_context.globalAlpha = qkeyDown;
        g_context.fillRect(0, 0, g_ready, noClip);
        if (canvas.complete && canvas.width) {
          if (canvas.width / canvas.height < g_ready / noClip) {
            time = g_ready;
            x = canvas.height * g_ready / canvas.width;
          } else {
            time = canvas.width * noClip / canvas.height;
            x = noClip;
          }
          g_context.drawImage(canvas, (g_ready - time) / 2, (noClip - x) / 2, time, x);
          g_context.globalAlpha = 0.5 * qkeyDown;
          g_context.fillRect(0, 0, g_ready, noClip);
        }
      } else {
        g_context.globalAlpha = 0.5 * qkeyDown;
        g_context.fillRect(0, 0, g_ready, noClip);
      }
      g_context.globalAlpha = 1;
    } else {
      __unmatched_115 = false;
    }
    __unmatched_79 = g_time;
  }
  function DrawGrid() {
    g_context.fillStyle = g_showMass ? '#111111' : '#F2FBFF';
    g_context.fillRect(0, 0, g_ready, noClip);
    g_context.save();
    g_context.strokeStyle = g_showMass ? '#AAAAAA' : '#000000';
    g_context.globalAlpha = 0.2 * g_scale;
    for (var width = g_ready / g_scale, height = noClip / g_scale, g_width = (-g_viewX + width / 2) % 50; g_width < width; g_width += 50) {
      g_context.beginPath();
      g_context.moveTo(g_width * g_scale - 0.5, 0);
      g_context.lineTo(g_width * g_scale - 0.5, height * g_scale);
      g_context.stroke();
    }
    for (g_width = (-g_viewY + height / 2) % 50; g_width < height; g_width += 50) {
      g_context.beginPath();
      g_context.moveTo(0, g_width * g_scale - 0.5);
      g_context.lineTo(width * g_scale, g_width * g_scale - 0.5);
      g_context.stroke();
    }
    g_context.restore();
  }
  function DrawSplitImage() {
    if (g_touchCapable && g_splitImage.width) {
      var size = g_ready / 5;
      g_context.drawImage(g_splitImage, 5, 5, size, size);
    }
  }
  function __unmatched_37() {
    for (var score = 0, i = 0; i < g_playerCells.length; i++) {
      score += g_playerCells[i].m * g_playerCells[i].m;
    }
    return score;
  }
  function UpdateLeaderboard() {
    g_leaderboardCanvas = null;
    if (null != g_scorePartitions || 0 != g_scoreEntries.length) {
      if (null != g_scorePartitions || g_showNames) {
        g_leaderboardCanvas = document.createElement('canvas');
        var context = g_leaderboardCanvas.getContext('2d');
        var height = 60;
        var height = null == g_scorePartitions ? height + 24 * g_scoreEntries.length : height + 180;
        var scale = Math.min(200, 0.3 * g_ready) / 200;
        g_leaderboardCanvas.width = 200 * scale;
        g_leaderboardCanvas.height = height * scale;
        context.scale(scale, scale);
        context.globalAlpha = 0.4;
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 200, height);
        context.globalAlpha = 1;
        context.fillStyle = '#FFFFFF';
        scale = null;
        scale = Render('leaderboard');
        context.font = '30px Ubuntu';
        context.fillText(scale, 100 - context.measureText(scale).width / 2, 40);
        if (null == g_scorePartitions) {
          for (context.font = '20px Ubuntu', height = 0; height < g_scoreEntries.length; ++height) {
            scale = g_scoreEntries[height].name || Render('unnamed_cell');
            if (!g_showNames) {
              scale = Render('unnamed_cell');
            }
            if (-1 != g_playerCellIds.indexOf(g_scoreEntries[height].id)) {
              if (g_playerCells[0].name) {
                scale = g_playerCells[0].name;
              }
              context.fillStyle = '#FFAAAA';
            } else {
              context.fillStyle = '#FFFFFF';
            }
            scale = height + 1 + '. ' + scale;
            context.fillText(scale, 100 - context.measureText(scale).width / 2, 70 + 24 * height);
          }
        } else {
          for (height = scale = 0; height < g_scorePartitions.length; ++height) {
            var end = scale + g_scorePartitions[height] * Math.PI * 2;
            context.fillStyle = g_teamColors[height + 1];
            context.beginPath();
            context.moveTo(100, 140);
            context.arc(100, 140, 80, scale, end, false);
            context.fill();
            scale = end;
          }
        }
      }
    }
  }
  function Node(left, top, width, height, depth) {
    this.P = left;
    this.x = top;
    this.y = width;
    this.g = height;
    this.b = depth;
  }
  function Cell(id, x, y, size, color, name) {
    this.id = id;
    this.o = this.x = x;
    this.p = this.y = y;
    this.n = this.size = size;
    this.color = color;
    this.a = [];
    this.Q();
    this.t(name);
  }
  function __unmatched_41(__unmatched_267) {
    for (__unmatched_267 = __unmatched_267.toString(16); 6 > __unmatched_267.length;) {
      __unmatched_267 = '0' + __unmatched_267;
    }
    return '#' + __unmatched_267;
  }
  function CachedCanvas(size, color, stroke, strokeColor) {
    if (size) {
      this.q = size;
    }
    if (color) {
      this.M = color;
    }
    this.O = !!stroke;
    if (strokeColor) {
      this.r = strokeColor;
    }
  }
  function __unmatched_43(params) {
    for (var size_ = params.length, __unmatched_274, __unmatched_275; 0 < size_;) {
      __unmatched_275 = Math.floor(Math.random() * size_);
      size_--;
      __unmatched_274 = params[size_];
      params[size_] = params[__unmatched_275];
      params[__unmatched_275] = __unmatched_274;
    }
  }
  function __unmatched_44(rect, callback) {
    var __unmatched_278 = '1' == $('#helloContainer').attr('data-has-account-data');
    $('#helloContainer').attr('data-has-account-data', '1');
    if (null == callback && window.localStorage[i_]) {
      var rand = JSON.parse(window.localStorage[i_]);
      rand.xp = rect.e;
      rand.xpNeeded = rect.c;
      rand.level = rect.d;
      window.localStorage[i_] = JSON.stringify(rand);
    }
    if (__unmatched_278) {
      var width = +$('.agario-exp-bar .progress-bar-text').first().text().split('/')[0];
      var __unmatched_278 = +$('.agario-exp-bar .progress-bar-text').first().text().split('/')[1].split(' ')[0];
      var rand = $('.agario-profile-panel .progress-bar-star').first().text();
      if (rand != rect.d) {
        __unmatched_44({
          e: __unmatched_278,
          c: __unmatched_278,
          d: rand
        }, function() {
          $('.agario-profile-panel .progress-bar-star').text(rect.d);
          $('.agario-exp-bar .progress-bar').css('width', '100%');
          $('.progress-bar-star').addClass('animated tada').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $('.progress-bar-star').removeClass('animated tada');
          });
          setTimeout(function() {
            $('.agario-exp-bar .progress-bar-text').text(rect.c + '/' + rect.c + ' XP');
            __unmatched_44({
              e: 0,
              c: rect.c,
              d: rect.d
            }, function() {
              __unmatched_44(rect, callback);
            });
          }, 1000);
        });
      } else {
        var __unmatched_281 = Date.now();
        var name = function() {
          var deltaX;
          deltaX = (Date.now() - __unmatched_281) / 1000;
          deltaX = 0 > deltaX ? 0 : 1 < deltaX ? 1 : deltaX;
          deltaX = deltaX * deltaX * (3 - 2 * deltaX);
          $('.agario-exp-bar .progress-bar-text').text(~~(width + (rect.e - width) * deltaX) + '/' + rect.c + ' XP');
          $('.agario-exp-bar .progress-bar').css('width', (88 * (width + (rect.e - width) * deltaX) / rect.c).toFixed(2) + '%');
          if (1 > deltaX) {
            window.requestAnimationFrame(name);
          } else if (callback) {
            callback();
          }
        };
        window.requestAnimationFrame(name);
      }
    } else {
      $('.agario-profile-panel .progress-bar-star').text(rect.d);
      $('.agario-exp-bar .progress-bar-text').text(rect.e + '/' + rect.c + ' XP');
      $('.agario-exp-bar .progress-bar').css('width', (88 * rect.e / rect.c).toFixed(2) + '%');
      if (callback) {
        callback();
      }
    }
  }
  function __unmatched_45(__unmatched_284) {
    if ('string' == typeof __unmatched_284) {
      __unmatched_284 = JSON.parse(__unmatched_284);
    }
    if (Date.now() + 1800000 > __unmatched_284.expires) {
      $('#helloContainer').attr('data-logged-in', '0');
    } else {
      window.localStorage[i_] = JSON.stringify(__unmatched_284);
      __unmatched_110 = __unmatched_284.authToken;
      $('.agario-profile-name').text(__unmatched_284.name);
      RefreshAds();
      __unmatched_44({
        e: __unmatched_284.xp,
        c: __unmatched_284.xpNeeded,
        d: __unmatched_284.level
      });
      $('#helloContainer').attr('data-logged-in', '1');
    }
  }
  function __unmatched_46(data) {
    data = data.split('\n');
    __unmatched_45({
      name: data[0],
      fbid: data[1],
      authToken: data[2],
      expires: 1000 * +data[3],
      level: +data[4],
      xp: +data[5],
      xpNeeded: +data[6]
    });
  }
  function UpdateScale(__unmatched_286) {
    if ('connected' == __unmatched_286.status) {
      var y = __unmatched_286.authResponse.accessToken;
      console.log(y);
      window.FB.api('/me/picture?width=180&height=180', function(__unmatched_288) {
        window.localStorage.fbPictureCache = __unmatched_288.data.url;
        $('.agario-profile-picture').attr('src', __unmatched_288.data.url);
      });
      $('#helloContainer').attr('data-logged-in', '1');
      if (null != __unmatched_110) {
        $.ajax(g_protocol + 'checkToken', {
          error: function() {
            __unmatched_110 = null;
            UpdateScale(__unmatched_286);
          },
          success: function(__unmatched_289) {
            __unmatched_289 = __unmatched_289.split('\n');
            __unmatched_44({
              d: +__unmatched_289[0],
              e: +__unmatched_289[1],
              c: +__unmatched_289[2]
            });
          },
          dataType: 'text',
          method: 'POST',
          cache: false,
          crossDomain: true,
          data: __unmatched_110
        });
      } else {
        $.ajax(g_protocol + 'facebookLogin', {
          error: function() {
            __unmatched_110 = null;
            $('#helloContainer').attr('data-logged-in', '0');
          },
          success: __unmatched_46,
          dataType: 'text',
          method: 'POST',
          cache: false,
          crossDomain: true,
          data: y
        });
      }
    }
  }
  function RenderLoop(x) {
    n(':party');
    $('#helloContainer').attr('data-party-state', '4');
    x = decodeURIComponent(x).replace(/.*#/gim, '');
    __unmatched_49('#' + window.encodeURIComponent(x));
    $.ajax(g_protocol + 'getToken', {
      error: function() {
        $('#helloContainer').attr('data-party-state', '6');
      },
      success: function(quick) {
        quick = quick.split('\n');
        $('.partyToken').val('agar.io/#' + window.encodeURIComponent(x));
        $('#helloContainer').attr('data-party-state', '5');
        n(':party');
        Connect('ws://' + quick[0], x);
      },
      dataType: 'text',
      method: 'POST',
      cache: false,
      crossDomain: true,
      data: x
    });
  }
  function __unmatched_49(item) {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, window.document.title, item);
    }
  }
  function __unmatched_50(__unmatched_293, __unmatched_294) {
    var playerOwned = -1 != g_playerCellIds.indexOf(__unmatched_293.id);
    var __unmatched_296 = -1 != g_playerCellIds.indexOf(__unmatched_294.id);
    var __unmatched_297 = 30 > __unmatched_294.size;
    if (playerOwned && __unmatched_297) {
      ++__unmatched_145;
    }
    if (!(__unmatched_297 || !playerOwned || __unmatched_296)) {
      ++__unmatched_152;
    }
  }
  function __unmatched_51(__unmatched_298) {
    __unmatched_298 = ~~__unmatched_298;
    var color = (__unmatched_298 % 60).toString();
    __unmatched_298 = (~~(__unmatched_298 / 60)).toString();
    if (2 > color.length) {
      color = '0' + color;
    }
    return __unmatched_298 + ':' + color;
  }
  function __unmatched_52() {
    if (null == g_scoreEntries) {
      return 0;
    }
    for (var i = 0; i < g_scoreEntries.length; ++i) {
      if (-1 != g_playerCellIds.indexOf(g_scoreEntries[i].id)) {
        return i + 1;
      }
    }
    return 0;
  }
  function ShowOverlay() {
    $('.stats-food-eaten').text(__unmatched_145);
    $('.stats-time-alive').text(__unmatched_51((__unmatched_150 - __unmatched_149) / 1000));
    $('.stats-leaderboard-time').text(__unmatched_51(__unmatched_151));
    $('.stats-highest-mass').text(~~(g_maxScore / 100));
    $('.stats-cells-eaten').text(__unmatched_152);
    $('.stats-top-position').text(0 == g_mode ? ':(' : g_mode);
    var g_height = document.getElementById('statsGraph');
    if (g_height) {
      var pointsAcc = g_height.getContext('2d');
      var scale = g_height.width;
      var g_height = g_height.height;
      pointsAcc.clearRect(0, 0, scale, g_height);
      if (2 < points.length) {
        for (var maxSize = 200, i = 0; i < points.length; i++) {
          maxSize = Math.max(points[i], maxSize);
        }
        pointsAcc.lineWidth = 3;
        pointsAcc.lineCap = 'round';
        pointsAcc.lineJoin = 'round';
        pointsAcc.strokeStyle = __unmatched_146;
        pointsAcc.fillStyle = __unmatched_146;
        pointsAcc.beginPath();
        pointsAcc.moveTo(0, g_height - points[0] / maxSize * (g_height - 10) + 10);
        for (i = 1; i < points.length; i += Math.max(~~(points.length / scale), 1)) {
          for (var __unmatched_306 = i / (points.length - 1) * scale, thisNode = [], __unmatched_308 = -20; 20 >= __unmatched_308; ++__unmatched_308) {
            if (!(0 > i + __unmatched_308 || i + __unmatched_308 >= points.length)) {
              thisNode.push(points[i + __unmatched_308]);
            }
          }
          thisNode = thisNode.reduce(function(__unmatched_309, __unmatched_310) {
              return __unmatched_309 + __unmatched_310;
            }) / thisNode.length / maxSize;
          pointsAcc.lineTo(__unmatched_306, g_height - thisNode * (g_height - 10) + 10);
        }
        pointsAcc.stroke();
        pointsAcc.globalAlpha = 0.5;
        pointsAcc.lineTo(scale, g_height);
        pointsAcc.lineTo(0, g_height);
        pointsAcc.fill();
        pointsAcc.globalAlpha = 1;
      }
    }
  }
  if (!window.agarioNoInit) {
    var __unmatched_54 = window.location.protocol;
    var g_secure = 'https:' == __unmatched_54;
    var g_protocol = __unmatched_54 + '//m.agar.io/';
    var __unmatched_57 = window.navigator.userAgent;
    if (-1 != __unmatched_57.indexOf('Android')) {
      if (window.ga) {
        window.ga('send', 'event', 'MobileRedirect', 'PlayStore');
      }
      setTimeout(function() {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.miniclip.agar.io';
      }, 1000);
    } else if (-1 != __unmatched_57.indexOf('iPhone') || -1 != __unmatched_57.indexOf('iPad') || -1 != __unmatched_57.indexOf('iPod')) {
      if (window.ga) {
        window.ga('send', 'event', 'MobileRedirect', 'AppStore');
      }
      setTimeout(function() {
        window.location.href = 'https://itunes.apple.com/app/agar.io/id995999703?mt=8&at=1l3vajp';
      }, 1000);
    } else {
      var g_canvas_;
      var g_context;
      var g_canvas;
      var g_ready;
      var noClip;
      var g_pointTree = null;
      var g_socket = null;
      var g_viewX = 0;
      var g_viewY = 0;
      var g_playerCellIds = [];
      var g_playerCells = [];
      var g_cellsById = {};
      var g_cells = [];
      var g_destroyedCells = [];
      var g_scoreEntries = [];
      var g_mouseX = 0;
      var g_mouseY = 0;
      var g_moveX = -1;
      var g_moveY = -1;
      var __unmatched_77 = 0;
      var g_time = 0;
      var __unmatched_79 = 0;
      var g_nick = null;
      var g_minX = 0;
      var g_minY = 0;
      var g_maxX = 10000;
      var g_maxY = 10000;
      var g_scale = 1;
      var g_region = null;
      var g_showSkins = true;
      var g_showNames = true;
      var g_noColors = false;
      var __unmatched_90 = false;
      var g_maxScore = 0;
      var g_showMass = true;
      var g_darkTheme = true;
      var g_viewX_ = g_viewX = ~~((g_minX + g_maxX) / 2);
      var g_viewY_ = g_viewY = ~~((g_minY + g_maxY) / 2);
      var g_scale_ = 1;
      var __unmatched_97 = '';
      var g_scorePartitions = null;
      var g_drawLines = false;
      var __unmatched_100 = false;
      var g_linesY_ = 0;
      var g_linesX_ = 0;
      var g_linesX = 0;
      var g_linesY = 0;
      var g_ABGroup = 0;
      var g_teamColors = [
        '#333333',
        '#FF3333',
        '#33FF33',
        '#3333FF'
      ];
      var g_showTrails = false;
      var g_connectSuccessful = false;
      var __unmatched_109 = 0;
      var __unmatched_110 = null;
      var g_zoom = 1;
      var qkeyDown = 1;
      var g_playerCellDestroyed = false;
      var __unmatched_114 = 0;
      var __unmatched_115 = true;
      var __unmatched_116 = {};
      (function() {
        var cached = window.location.search;
        if ('?' == cached.charAt(0)) {
          cached = cached.slice(1);
        }
        for (var cached = cached.split('&'), i = 0; i < cached.length; i++) {
          var parts = cached[i].split('=');
          __unmatched_116[parts[0]] = parts[1];
        }
      }());
      var canvas = new Image();
      canvas.src = 'img/background.png';
      var g_touchCapable = 'ontouchstart' in window && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
      var g_splitImage = new Image();
      g_splitImage.src = 'img/split.png';
      var canvasTest = document.createElement('canvas');
      if ('undefined' == typeof console || 'undefined' == typeof DataView || 'undefined' == typeof WebSocket || null == canvasTest || null == canvasTest.getContext || null == window.localStorage) {
        alert('You browser does not support this game, we recommend you to use Firefox to play this');
      } else {
        var g_regionLabels = null;
        window.setNick = function(__unmatched_314) {
          if (window.ga) {
            window.ga('send', 'event', 'Nick', __unmatched_314.toLowerCase());
          }
          HideOverlay();
          g_nick = __unmatched_314;
          SendNick();
          g_maxScore = 0;
        };
        window.setRegion = SetRegion;
        var __unmatched_122 = true;
        window.setSkins = function(val) {
          g_showSkins = val;
        };
        window.setNames = function(val) {
          g_showNames = val;
        };
        window.setDarkTheme = function(val) {
          g_showMass = val;
        };
        window.setColors = function(val) {
          g_noColors = val;
        };
        window.setShowMass = function(val) {
          g_darkTheme = val;
        };
        window.spectate = function() {
          g_nick = null;
          SendCmd(1);
          HideOverlay();
        };
        window.setGameMode = function(__unmatched_320) {
          if (__unmatched_320 != __unmatched_97) {
            if (':party' == __unmatched_97) {
              $('#helloContainer').attr('data-party-state', '0');
            }
            n(__unmatched_320);
            if (':party' != __unmatched_320) {
              Start();
            }
          }
        };
        window.setAcid = function(val) {
          g_showTrails = val;
        };
        if (null != window.localStorage) {
          if (null == window.localStorage.AB9) {
            window.localStorage.AB9 = 0 + ~~(100 * Math.random());
          }
          g_ABGroup = +window.localStorage.AB9;
          window.ABGroup = g_ABGroup;
        }
        $.get(__unmatched_54 + '//gc.agar.io', function(code) {
          var __unmatched_323 = code.split(' ');
          code = __unmatched_323[0];
          __unmatched_323 = __unmatched_323[1] || '';
          if (-1 == ['UA'].indexOf(code)) {
            g_skinNamesA.push('ussr');
          }
          if (g_regionsByCC.hasOwnProperty(code)) {
            if ('string' == typeof g_regionsByCC[code]) {
              if (!g_region) {
                SetRegion(g_regionsByCC[code]);
              } else if (g_regionsByCC[code].hasOwnProperty(__unmatched_323)) {
                if (!g_region) {
                  SetRegion(g_regionsByCC[code][__unmatched_323]);
                }
              }
            }
          }
        }, 'text');
        var g_canRefreshAds = true;
        var g_refreshAdsCooldown = 0;
        var g_regionsByCC = {
          AF: 'JP-Tokyo',
          AX: 'EU-London',
          AL: 'EU-London',
          DZ: 'EU-London',
          AS: 'SG-Singapore',
          AD: 'EU-London',
          AO: 'EU-London',
          AI: 'US-Atlanta',
          AG: 'US-Atlanta',
          AR: 'BR-Brazil',
          AM: 'JP-Tokyo',
          AW: 'US-Atlanta',
          AU: 'SG-Singapore',
          AT: 'EU-London',
          AZ: 'JP-Tokyo',
          BS: 'US-Atlanta',
          BH: 'JP-Tokyo',
          BD: 'JP-Tokyo',
          BB: 'US-Atlanta',
          BY: 'EU-London',
          BE: 'EU-London',
          BZ: 'US-Atlanta',
          BJ: 'EU-London',
          BM: 'US-Atlanta',
          BT: 'JP-Tokyo',
          BO: 'BR-Brazil',
          BQ: 'US-Atlanta',
          BA: 'EU-London',
          BW: 'EU-London',
          BR: 'BR-Brazil',
          IO: 'JP-Tokyo',
          VG: 'US-Atlanta',
          BN: 'JP-Tokyo',
          BG: 'EU-London',
          BF: 'EU-London',
          BI: 'EU-London',
          KH: 'JP-Tokyo',
          CM: 'EU-London',
          CA: 'US-Atlanta',
          CV: 'EU-London',
          KY: 'US-Atlanta',
          CF: 'EU-London',
          TD: 'EU-London',
          CL: 'BR-Brazil',
          CN: 'CN-China',
          CX: 'JP-Tokyo',
          CC: 'JP-Tokyo',
          CO: 'BR-Brazil',
          KM: 'EU-London',
          CD: 'EU-London',
          CG: 'EU-London',
          CK: 'SG-Singapore',
          CR: 'US-Atlanta',
          CI: 'EU-London',
          HR: 'EU-London',
          CU: 'US-Atlanta',
          CW: 'US-Atlanta',
          CY: 'JP-Tokyo',
          CZ: 'EU-London',
          DK: 'EU-London',
          DJ: 'EU-London',
          DM: 'US-Atlanta',
          DO: 'US-Atlanta',
          EC: 'BR-Brazil',
          EG: 'EU-London',
          SV: 'US-Atlanta',
          GQ: 'EU-London',
          ER: 'EU-London',
          EE: 'EU-London',
          ET: 'EU-London',
          FO: 'EU-London',
          FK: 'BR-Brazil',
          FJ: 'SG-Singapore',
          FI: 'EU-London',
          FR: 'EU-London',
          GF: 'BR-Brazil',
          PF: 'SG-Singapore',
          GA: 'EU-London',
          GM: 'EU-London',
          GE: 'JP-Tokyo',
          DE: 'EU-London',
          GH: 'EU-London',
          GI: 'EU-London',
          GR: 'EU-London',
          GL: 'US-Atlanta',
          GD: 'US-Atlanta',
          GP: 'US-Atlanta',
          GU: 'SG-Singapore',
          GT: 'US-Atlanta',
          GG: 'EU-London',
          GN: 'EU-London',
          GW: 'EU-London',
          GY: 'BR-Brazil',
          HT: 'US-Atlanta',
          VA: 'EU-London',
          HN: 'US-Atlanta',
          HK: 'JP-Tokyo',
          HU: 'EU-London',
          IS: 'EU-London',
          IN: 'JP-Tokyo',
          ID: 'JP-Tokyo',
          IR: 'JP-Tokyo',
          IQ: 'JP-Tokyo',
          IE: 'EU-London',
          IM: 'EU-London',
          IL: 'JP-Tokyo',
          IT: 'EU-London',
          JM: 'US-Atlanta',
          JP: 'JP-Tokyo',
          JE: 'EU-London',
          JO: 'JP-Tokyo',
          KZ: 'JP-Tokyo',
          KE: 'EU-London',
          KI: 'SG-Singapore',
          KP: 'JP-Tokyo',
          KR: 'JP-Tokyo',
          KW: 'JP-Tokyo',
          KG: 'JP-Tokyo',
          LA: 'JP-Tokyo',
          LV: 'EU-London',
          LB: 'JP-Tokyo',
          LS: 'EU-London',
          LR: 'EU-London',
          LY: 'EU-London',
          LI: 'EU-London',
          LT: 'EU-London',
          LU: 'EU-London',
          MO: 'JP-Tokyo',
          MK: 'EU-London',
          MG: 'EU-London',
          MW: 'EU-London',
          MY: 'JP-Tokyo',
          MV: 'JP-Tokyo',
          ML: 'EU-London',
          MT: 'EU-London',
          MH: 'SG-Singapore',
          MQ: 'US-Atlanta',
          MR: 'EU-London',
          MU: 'EU-London',
          YT: 'EU-London',
          MX: 'US-Atlanta',
          FM: 'SG-Singapore',
          MD: 'EU-London',
          MC: 'EU-London',
          MN: 'JP-Tokyo',
          ME: 'EU-London',
          MS: 'US-Atlanta',
          MA: 'EU-London',
          MZ: 'EU-London',
          MM: 'JP-Tokyo',
          NA: 'EU-London',
          NR: 'SG-Singapore',
          NP: 'JP-Tokyo',
          NL: 'EU-London',
          NC: 'SG-Singapore',
          NZ: 'SG-Singapore',
          NI: 'US-Atlanta',
          NE: 'EU-London',
          NG: 'EU-London',
          NU: 'SG-Singapore',
          NF: 'SG-Singapore',
          MP: 'SG-Singapore',
          NO: 'EU-London',
          OM: 'JP-Tokyo',
          PK: 'JP-Tokyo',
          PW: 'SG-Singapore',
          PS: 'JP-Tokyo',
          PA: 'US-Atlanta',
          PG: 'SG-Singapore',
          PY: 'BR-Brazil',
          PE: 'BR-Brazil',
          PH: 'JP-Tokyo',
          PN: 'SG-Singapore',
          PL: 'EU-London',
          PT: 'EU-London',
          PR: 'US-Atlanta',
          QA: 'JP-Tokyo',
          RE: 'EU-London',
          RO: 'EU-London',
          RU: 'RU-Russia',
          RW: 'EU-London',
          BL: 'US-Atlanta',
          SH: 'EU-London',
          KN: 'US-Atlanta',
          LC: 'US-Atlanta',
          MF: 'US-Atlanta',
          PM: 'US-Atlanta',
          VC: 'US-Atlanta',
          WS: 'SG-Singapore',
          SM: 'EU-London',
          ST: 'EU-London',
          SA: 'EU-London',
          SN: 'EU-London',
          RS: 'EU-London',
          SC: 'EU-London',
          SL: 'EU-London',
          SG: 'JP-Tokyo',
          SX: 'US-Atlanta',
          SK: 'EU-London',
          SI: 'EU-London',
          SB: 'SG-Singapore',
          SO: 'EU-London',
          ZA: 'EU-London',
          SS: 'EU-London',
          ES: 'EU-London',
          LK: 'JP-Tokyo',
          SD: 'EU-London',
          SR: 'BR-Brazil',
          SJ: 'EU-London',
          SZ: 'EU-London',
          SE: 'EU-London',
          CH: 'EU-London',
          SY: 'EU-London',
          TW: 'JP-Tokyo',
          TJ: 'JP-Tokyo',
          TZ: 'EU-London',
          TH: 'JP-Tokyo',
          TL: 'JP-Tokyo',
          TG: 'EU-London',
          TK: 'SG-Singapore',
          TO: 'SG-Singapore',
          TT: 'US-Atlanta',
          TN: 'EU-London',
          TR: 'TK-Turkey',
          TM: 'JP-Tokyo',
          TC: 'US-Atlanta',
          TV: 'SG-Singapore',
          UG: 'EU-London',
          UA: 'EU-London',
          AE: 'EU-London',
          GB: 'EU-London',
          US: 'US-Atlanta',
          UM: 'SG-Singapore',
          VI: 'US-Atlanta',
          UY: 'BR-Brazil',
          UZ: 'JP-Tokyo',
          VU: 'SG-Singapore',
          VE: 'BR-Brazil',
          VN: 'JP-Tokyo',
          WF: 'SG-Singapore',
          EH: 'EU-London',
          YE: 'JP-Tokyo',
          ZM: 'EU-London',
          ZW: 'EU-London'
        };
        var __unmatched_126 = null;
        window.connect = Connect;
        var g_retryTimeout = 500;
        var __unmatched_128 = null;
        var __unmatched_129 = 0;
        var g_lastMoveY = -1;
        var g_lastMoveX = -1;
        window.refreshPlayerInfo = function() {
          SendCmd(253);
        };
        var g_leaderboardCanvas = null;
        var g_pointNumScale = 1;
        var g_cachedScore = null;
        var __unmatched_135 = function() {
          var sizeRatio = Date.now();
          var maxItems = 1000 / 60;
          return function() {
            window.requestAnimationFrame(__unmatched_135);
            var x = Date.now();
            var step = x - sizeRatio;
            if (step > maxItems) {
              sizeRatio = x - step % maxItems;
              if (!IsConnected() || 240 > Date.now() - __unmatched_109) {
                GetScore();
              } else {
                console.warn('Skipping draw');
              }
              __unmatched_143();
            }
          };
        }();
        var g_skinCache = {};
        var g_skinNamesA = 'poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;facebook;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;venezuela;blatter;chavez;cuba;fidel;merkel;palin;queen;boris;bush;trump'.split(';');
        var __unmatched_138 = '8;nasa;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;blatter;chavez;fidel;merkel;palin;queen;boris;bush;trump'.split(';');
        var node = {};
        Node.prototype = {
          P: null,
          x: 0,
          y: 0,
          g: 0,
          b: 0
        };
        Cell.prototype = {
          id: 0,
          a: null,
          name: null,
          k: null,
          I: null,
          x: 0,
          y: 0,
          size: 0,
          o: 0,
          p: 0,
          n: 0,
          C: 0,
          D: 0,
          m: 0,
          T: 0,
          K: 0,
          W: 0,
          A: false,
          f: false,
          j: false,
          L: true,
          S: 0,
          V: null,
          R: function() {
            var i;
            for (i = 0; i < g_cells.length; i++) {
              if (g_cells[i] == this) {
                g_cells.splice(i, 1);
                break;
              }
            }
            delete g_cellsById[this.id];
            i = g_playerCells.indexOf(this);
            if (-1 != i) {
              __unmatched_90 = true;
              g_playerCells.splice(i, 1);
            }
            i = g_playerCellIds.indexOf(this.id);
            if (-1 != i) {
              g_playerCellIds.splice(i, 1);
            }
            this.A = true;
            if (0 < this.S) {
              g_destroyedCells.push(this);
            }
          },
          i: function() {
            return Math.max(~~(0.3 * this.size), 24);
          },
          t: function(val) {
            if (this.name = val) {
              if (null == this.k) {
                this.k = new CachedCanvas(this.i(), '#FFFFFF', true, '#000000');
              } else {
                this.k.G(this.i());
              }
              this.k.u(this.name);
            }
          },
          Q: function() {
            for (var num = this.B(); this.a.length > num;) {
              var i = ~~(Math.random() * this.a.length);
              this.a.splice(i, 1);
            }
            for (0 == this.a.length && 0 < num && this.a.push(new Node(this, this.x, this.y, this.size, Math.random() - 0.5)); this.a.length < num;) {
              i = ~~(Math.random() * this.a.length);
              i = this.a[i];
              this.a.push(new Node(this, i.x, i.y, i.g, i.b));
            }
          },
          B: function() {
            var num = 10;
            if (20 > this.size) {
              num = 0;
            }
            if (this.f) {
              num = 30;
            }
            var size = this.size;
            if (!this.f) {
              size *= g_scale;
            }
            size *= g_pointNumScale;
            if (this.T & 32) {
              size *= 0.25;
            }
            return ~~Math.max(size, num);
          },
          da: function() {
            this.Q();
            for (var cell = this.a, num = cell.length, i = 0; i < num; ++i) {
              var prevAcc = cell[(i - 1 + num) % num].b;
              var nextAcc = cell[(i + 1) % num].b;
              cell[i].b += (Math.random() - 0.5) * (this.j ? 3 : 1);
              cell[i].b *= 0.7;
              if (10 < cell[i].b) {
                cell[i].b = 10;
              }
              if (-10 > cell[i].b) {
                cell[i].b = -10;
              }
              cell[i].b = (prevAcc + nextAcc + 8 * cell[i].b) / 10;
            }
            for (var thisCell = this, roll = this.f ? 0 : (this.id / 1000 + g_time / 10000) % (2 * Math.PI), i = 0; i < num; ++i) {
              var size = cell[i].g;
              var prevAcc = cell[(i - 1 + num) % num].g;
              var nextAcc = cell[(i + 1) % num].g;
              if (15 < this.size && null != g_pointTree && 20 < this.size * g_scale && 0 < this.id) {
                var reduce = false;
                var x = cell[i].x;
                var y = cell[i].y;
                g_pointTree.ea(x - 5, y - 5, 10, 10, function(rect) {
                  if (rect.P != thisCell && 25 > (x - rect.x) * (x - rect.x) + (y - rect.y) * (y - rect.y)) {
                    reduce = true;
                  }
                });
                if (!reduce && (cell[i].x < g_minX || cell[i].y < g_minY || cell[i].x > g_maxX || cell[i].y > g_maxY)) {
                  reduce = true;
                }
                if (reduce) {
                  if (0 < cell[i].b) {
                    cell[i].b = 0;
                  }
                  cell[i].b -= 1;
                }
              }
              size += cell[i].b;
              if (0 > size) {
                size = 0;
              }
              size = this.j ? (19 * size + this.size) / 20 : (12 * size + this.size) / 13;
              cell[i].g = (prevAcc + nextAcc + 8 * size) / 10;
              prevAcc = 2 * Math.PI / num;
              nextAcc = this.a[i].g;
              if (this.f && 0 == i % 2) {
                nextAcc += 5;
              }
              cell[i].x = this.x + Math.cos(prevAcc * i + roll) * nextAcc;
              cell[i].y = this.y + Math.sin(prevAcc * i + roll) * nextAcc;
            }
          },
          J: function() {
            if (0 >= this.id) {
              return 1;
            }
            var posRatio;
            posRatio = (g_time - this.K) / 120;
            posRatio = 0 > posRatio ? 0 : 1 < posRatio ? 1 : posRatio;
            var sizeRatio = 0 > posRatio ? 0 : 1 < posRatio ? 1 : posRatio;
            this.i();
            if (this.A && 1 <= sizeRatio) {
              var i = g_destroyedCells.indexOf(this);
              if (-1 != i) {
                g_destroyedCells.splice(i, 1);
              }
            }
            this.x = posRatio * (this.C - this.o) + this.o;
            this.y = posRatio * (this.D - this.p) + this.p;
            this.size = sizeRatio * (this.m - this.n) + this.n;
            return sizeRatio;
          },
          H: function() {
            return 0 >= this.id ? true : this.x + this.size + 40 < g_viewX - g_ready / 2 / g_scale || this.y + this.size + 40 < g_viewY - noClip / 2 / g_scale || this.x - this.size - 40 > g_viewX + g_ready / 2 / g_scale || this.y - this.size - 40 > g_viewY + noClip / 2 / g_scale ? false : true;
          },
          s: function(context) {
            if (this.H()) {
              ++this.S;
              var isSimpleDrawing = 0 < this.id && !this.f && !this.j && 0.4 > g_scale;
              if (5 > this.B() && 0 < this.id) {
                isSimpleDrawing = true;
              }
              if (this.L && !isSimpleDrawing) {
                for (var text = 0; text < this.a.length; text++) {
                  this.a[text].g = this.size;
                }
              }
              this.L = isSimpleDrawing;
              context.save();
              this.W = g_time;
              text = this.J();
              if (this.A) {
                context.globalAlpha *= 1 - text;
              }
              context.lineWidth = 10;
              context.lineCap = 'round';
              context.lineJoin = this.f ? 'miter' : 'round';
              if (g_noColors) {
                context.fillStyle = '#FFFFFF';
                context.strokeStyle = '#AAAAAA';
              } else {
                context.fillStyle = this.color;
                context.strokeStyle = this.color;
              }
              if (isSimpleDrawing) {
                context.beginPath();
                context.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, false);
              } else {
                this.da();
                context.beginPath();
                var num = this.B();
                context.moveTo(this.a[0].x, this.a[0].y);
                for (text = 1; text <= num; ++text) {
                  var skin = text % num;
                  context.lineTo(this.a[skin].x, this.a[skin].y);
                }
              }
              context.closePath();
              text = this.name.toLowerCase();
              if (!this.j && g_showSkins && ':teams' != __unmatched_97) {
                num = this.V;
                if (null == num) {
                  num = null;
                } else if (':' == num[0]) {
                  if (!node.hasOwnProperty(num)) {
                    node[num] = new Image();
                    node[num].src = num.slice(1);
                  }
                  num = 0 != node[num].width && node[num].complete ? node[num] : null;
                } else {
                  num = null;
                }
                if (!num) {
                  if (-1 != g_skinNamesA.indexOf(text)) {
                    if (!g_skinCache.hasOwnProperty(text)) {
                      g_skinCache[text] = new Image();
                      g_skinCache[text].src = 'skins/' + text + '.png';
                    }
                    num = 0 != g_skinCache[text].width && g_skinCache[text].complete ? g_skinCache[text] : null;
                  } else {
                    num = null;
                  }
                }
              } else {
                num = null;
              }
              skin = num;
              if (!isSimpleDrawing) {
                context.stroke();
              }
              context.fill();
              if (null != skin) {
                context.save();
                context.clip();
                context.drawImage(skin, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
                context.restore();
              }
              if ((g_noColors || 15 < this.size) && !isSimpleDrawing) {
                context.strokeStyle = '#000000';
                context.globalAlpha *= 0.1;
                context.stroke();
              }
              context.globalAlpha = 1;
              num = -1 != g_playerCells.indexOf(this);
              isSimpleDrawing = ~~this.y;
              if (0 != this.id && (g_showNames || num) && this.name && this.k && (null == skin || -1 == __unmatched_138.indexOf(text))) {
                skin = this.k;
                skin.u(this.name);
                skin.G(this.i());
                text = 0 >= this.id ? 1 : Math.ceil(10 * g_scale) / 10;
                skin.U(text);
                var skin = skin.F();
                var g_width = ~~(skin.width / text);
                var g_height = ~~(skin.height / text);
                context.drawImage(skin, ~~this.x - ~~(g_width / 2), isSimpleDrawing - ~~(g_height / 2), g_width, g_height);
                isSimpleDrawing += skin.height / 2 / text + 4;
              }
              if (40 < this.size) {
                if (null == this.I) {
                  this.I = new CachedCanvas(this.i() / 2, '#FFFFFF', true, '#000000');
                }
                num = this.I;
                num.G(this.i() / 1.2);
                num.u(~~(this.size * this.size / 100));
                text = Math.ceil(10 * g_scale) / 10;
                num.U(text);
                skin = num.F();
                g_width = ~~(skin.width / text);
                g_height = ~~(skin.height / text);
                context.drawImage(skin, ~~this.x - ~~(g_width / 2), isSimpleDrawing - ~~(g_height / 2), g_width, g_height);
              }
              context.restore();
            }
          }
        };
        CachedCanvas.prototype = {
          w: '',
          M: '#000000',
          O: false,
          r: '#000000',
          q: 16,
          l: null,
          N: null,
          h: false,
          v: 1,
          G: function(val) {
            if (this.q != val) {
              this.q = val;
              this.h = true;
            }
          },
          U: function(val) {
            if (this.v != val) {
              this.v = val;
              this.h = true;
            }
          },
          setStrokeColor: function(val) {
            if (this.r != val) {
              this.r = val;
              this.h = true;
            }
          },
          u: function(val) {
            if (val != this.w) {
              this.w = val;
              this.h = true;
            }
          },
          F: function() {
            if (null == this.l) {
              this.l = document.createElement('canvas');
              this.N = this.l.getContext('2d');
            }
            if (this.h) {
              this.h = false;
              var items = this.l;
              var context = this.N;
              var value = this.w;
              var scale = this.v;
              var size = this.q;
              var font = size + 'px Ubuntu';
              context.font = font;
              var extra = ~~(0.2 * size);
              items.width = (context.measureText(value).width + 6) * scale;
              items.height = (size + extra) * scale;
              context.font = font;
              context.scale(scale, scale);
              context.globalAlpha = 1;
              context.lineWidth = 3;
              context.strokeStyle = this.r;
              context.fillStyle = this.M;
              if (this.O) {
                context.strokeText(value, 3, size - extra / 2);
              }
              context.fillText(value, 3, size - extra / 2);
            }
            return this.l;
          }
        };
        if (!Date.now) {
          Date.now = function() {
            return new Date().getTime();
          };
        }
        (function() {
          for (var g_skinNamesB = [
                'ms',
                'moz',
                'webkit',
                'o'
              ], i = 0; i < g_skinNamesB.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[g_skinNamesB[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[g_skinNamesB[i] + 'CancelAnimationFrame'] || window[g_skinNamesB[i] + 'CancelRequestAnimationFrame'];
          }
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(rect) {
              return setTimeout(rect, 1000 / 60);
            };
            window.cancelAnimationFrame = function(item) {
              clearTimeout(item);
            };
          }
        }());
        var QTreeFactory = {
          X: function(item) {
            function __unmatched_372(val) {
              if (val < __unmatched_374) {
                val = __unmatched_374;
              }
              if (val > __unmatched_376) {
                val = __unmatched_376;
              }
              return ~~((val - __unmatched_374) / 32);
            }
            function __unmatched_373(__unmatched_382) {
              if (__unmatched_382 < __unmatched_375) {
                __unmatched_382 = __unmatched_375;
              }
              if (__unmatched_382 > __unmatched_377) {
                __unmatched_382 = __unmatched_377;
              }
              return ~~((__unmatched_382 - __unmatched_375) / 32);
            }
            var __unmatched_374 = item.ba;
            var __unmatched_375 = item.ca;
            var __unmatched_376 = item.Z;
            var __unmatched_377 = item.$;
            var depth = ~~((__unmatched_376 - __unmatched_374) / 32) + 1;
            var maxDepth = ~~((__unmatched_377 - __unmatched_375) / 32) + 1;
            var point = Array(depth * maxDepth);
            return {
              Y: function(__unmatched_383) {
                var __unmatched_384 = __unmatched_372(__unmatched_383.x) + __unmatched_373(__unmatched_383.y) * depth;
                if (null == point[__unmatched_384]) {
                  point[__unmatched_384] = __unmatched_383;
                } else if (Array.isArray(point[__unmatched_384])) {
                  point[__unmatched_384].push(__unmatched_383);
                } else {
                  point[__unmatched_384] = [
                    point[__unmatched_384],
                    __unmatched_383
                  ];
                }
              },
              ea: function(__unmatched_385, __unmatched_386, val, __unmatched_388, callback) {
                var __unmatched_390 = __unmatched_372(__unmatched_385);
                var __unmatched_391 = __unmatched_373(__unmatched_386);
                __unmatched_385 = __unmatched_372(__unmatched_385 + val);
                __unmatched_386 = __unmatched_373(__unmatched_386 + __unmatched_388);
                if (0 > __unmatched_390 || __unmatched_390 >= depth || 0 > __unmatched_391 || __unmatched_391 >= maxDepth) {
                  debugger;
                }
                for (; __unmatched_391 <= __unmatched_386; ++__unmatched_391) {
                  for (__unmatched_388 = __unmatched_390; __unmatched_388 <= __unmatched_385; ++__unmatched_388) {
                    if (val = point[__unmatched_388 + __unmatched_391 * depth], null != val) {
                      if (Array.isArray(val)) {
                        for (var i = 0; i < val.length; i++) {
                          callback(val[i]);
                        }
                      } else {
                        callback(val);
                      }
                    }
                  }
                }
              }
            };
          }
        };
        var __unmatched_141 = function() {
          var __unmatched_393 = new Cell(0, 0, 0, 32, '#ED1C24', '');
          var __unmatched_394 = document.createElement('canvas');
          __unmatched_394.width = 32;
          __unmatched_394.height = 32;
          var rect = __unmatched_394.getContext('2d');
          return function() {
            if (0 < g_playerCells.length) {
              __unmatched_393.color = g_playerCells[0].color;
              __unmatched_393.t(g_playerCells[0].name);
            }
            rect.clearRect(0, 0, 32, 32);
            rect.save();
            rect.translate(16, 16);
            rect.scale(0.4, 0.4);
            __unmatched_393.s(rect);
            rect.restore();
            var __unmatched_396 = document.getElementById('favicon');
            var __unmatched_397 = __unmatched_396.cloneNode(true);
            __unmatched_397.setAttribute('href', __unmatched_394.toDataURL('image/png'));
            __unmatched_396.parentNode.replaceChild(__unmatched_397, __unmatched_396);
          };
        }();
        $(function() {
          __unmatched_141();
        });
        var i_ = 'loginCache3';
        $(function() {
          if (+window.localStorage.wannaLogin) {
            if (window.localStorage[i_]) {
              __unmatched_45(window.localStorage[i_]);
            }
            if (window.localStorage.fbPictureCache) {
              $('.agario-profile-picture').attr('src', window.localStorage.fbPictureCache);
            }
          }
        });
        window.facebookLogin = function() {
          window.localStorage.wannaLogin = 1;
        };
        window.fbAsyncInit = function() {
          function __unmatched_398() {
            window.localStorage.wannaLogin = 1;
            if (null == window.FB) {
              alert('You seem to have something blocking Facebook on your browser, please check for any extensions');
            } else {
              window.FB.login(function(callback) {
                UpdateScale(callback);
              }, {
                scope: 'public_profile, email'
              });
            }
          }
          window.FB.init({
            appId: '677505792353827',
            cookie: true,
            xfbml: true,
            status: true,
            version: 'v2.2'
          });
          window.FB.Event.subscribe('auth.statusChange', function(__unmatched_400) {
            if (+window.localStorage.wannaLogin) {
              if ('connected' == __unmatched_400.status) {
                UpdateScale(__unmatched_400);
              } else {
                __unmatched_398();
              }
            }
          });
          window.facebookLogin = __unmatched_398;
        };
        window.logout = function() {
          __unmatched_110 = null;
          $('#helloContainer').attr('data-logged-in', '0');
          $('#helloContainer').attr('data-has-account-data', '0');
          delete window.localStorage.wannaLogin;
          delete window.localStorage[i_];
          delete window.localStorage.fbPictureCache;
          Start();
        };
        var __unmatched_143 = function() {
          function ParseString(width, top, callback, height, left) {
            var __unmatched_415 = top.getContext('2d');
            var __unmatched_416 = top.width;
            top = top.height;
            width.color = left;
            width.t(callback);
            width.size = height;
            __unmatched_415.save();
            __unmatched_415.translate(__unmatched_416 / 2, top / 2);
            width.s(__unmatched_415);
            __unmatched_415.restore();
          }
          for (var __unmatched_402 = new Cell(-1, 0, 0, 32, '#5bc0de', ''), __unmatched_403 = new Cell(-1, 0, 0, 32, '#5bc0de', ''), __unmatched_404 = '#0791ff #5a07ff #ff07fe #ffa507 #ff0774 #077fff #3aff07 #ff07ed #07a8ff #ff076e #3fff07 #ff0734 #07ff20 #ff07a2 #ff8207 #07ff0e'.split(' '), g_skinNamesC = [], j = 0; j < __unmatched_404.length; ++j) {
            var sub = j / __unmatched_404.length * 12;
            var __unmatched_408 = 30 * Math.sqrt(j / __unmatched_404.length);
            g_skinNamesC.push(new Cell(-1, Math.cos(sub) * __unmatched_408, Math.sin(sub) * __unmatched_408, 10, __unmatched_404[j], ''));
          }
          __unmatched_43(g_skinNamesC);
          var data = document.createElement('canvas');
          data.getContext('2d');
          data.width = data.height = 70;
          ParseString(__unmatched_403, data, '', 26, '#ebc0de');
          return function() {
            $('.cell-spinner').filter(':visible').each(function() {
              var __unmatched_417 = $(this);
              var g = Date.now();
              var width = this.width;
              var __unmatched_420 = this.height;
              var item = this.getContext('2d');
              item.clearRect(0, 0, width, __unmatched_420);
              item.save();
              item.translate(width / 2, __unmatched_420 / 2);
              for (var g_numFrames = 0; 10 > g_numFrames; ++g_numFrames) {
                item.drawImage(data, (0.1 * g + 80 * g_numFrames) % (width + 140) - width / 2 - 70 - 35, __unmatched_420 / 2 * Math.sin((0.001 * g + g_numFrames) % Math.PI * 2) - 35, 70, 70);
              }
              item.restore();
              if (__unmatched_417 = __unmatched_417.attr('data-itr')) {
                __unmatched_417 = Render(__unmatched_417);
              }
              ParseString(__unmatched_402, this, __unmatched_417 || '', +$(this).attr('data-size'), '#5bc0de');
            });
            $('#statsPellets').filter(':visible').each(function() {
              $(this);
              var height = this.width;
              var __unmatched_424 = this.height;
              this.getContext('2d').clearRect(0, 0, height, __unmatched_424);
              for (height = 0; height < g_skinNamesC.length; height++) {
                ParseString(g_skinNamesC[height], this, '', g_skinNamesC[height].size, g_skinNamesC[height].color);
              }
            });
          };
        }();
        window.createParty = function() {
          n(':party');
          __unmatched_126 = function(rect) {
            __unmatched_49('/#' + window.encodeURIComponent(rect));
            $('.partyToken').val('agar.io/#' + window.encodeURIComponent(rect));
            $('#helloContainer').attr('data-party-state', '1');
          };
          Start();
        };
        window.joinParty = RenderLoop;
        window.cancelParty = function() {
          __unmatched_49('/');
          $('#helloContainer').attr('data-party-state', '0');
          n('');
          Start();
        };
        var points = [];
        var __unmatched_145 = 0;
        var __unmatched_146 = '#000000';
        var __unmatched_147 = false;
        var __unmatched_148 = false;
        var __unmatched_149 = 0;
        var __unmatched_150 = 0;
        var __unmatched_151 = 0;
        var __unmatched_152 = 0;
        var g_mode = 0;
        var __unmatched_154 = true;
        setInterval(function() {
          if (__unmatched_148) {
            points.push(__unmatched_37() / 100);
          }
        }, 1000 / 60);
        setInterval(function() {
          var start = __unmatched_52();
          if (0 != start) {
            ++__unmatched_151;
            if (0 == g_mode) {
              g_mode = start;
            }
            g_mode = Math.min(g_mode, start);
          }
        }, 1000);
        window.closeStats = function() {
          __unmatched_147 = false;
          $('#stats').hide();
          __unmatched_14(window.ab);
          __unmatched_10(0);
        };
        window.setSkipStats = function(__unmatched_427) {
          __unmatched_154 = !__unmatched_427;
        };
        $(function() {
          $(Init);
        });
      }
    }
  }
}(unsafeWindow, unsafeWindow.jQuery));