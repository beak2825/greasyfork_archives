// ==UserScript==
// @name           erepmatik oto market by fire
// @namespace      erepmatik oto market
// @description    erepmatik oto market
// @author         Lother + simsek
// @match          https://www.erepublik.com/en/TTE
// @include        https://www.erepublik.com/en/TTE
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require        https://greasyfork.org/scripts/17018-erepmatik-oto-market-by-fire/code/erepmatik%20oto%20market%20by%20fire.js?version=107163
// @version        3.7.0
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/17019/erepmatik%20oto%20market%20by%20fire.user.js
// @updateURL https://update.greasyfork.org/scripts/17019/erepmatik%20oto%20market%20by%20fire.meta.js
// ==/UserScript==
String.prototype.interpolate = function ()
{
  if (arguments.length < 1) // do nothing
  return this;
  var s = this;
  var args = arguments;
  // see ECMA-262 3rd edition, 15.5.4.11 String.prototype.replace.
  return s.replace(/\{\d+\}/g, function (matched, offset, src) {
    var k = matched.substring(1, matched.length - 1); // index base from 0.
    return (args[k] ? args[k] : matched);
  });
}
function loading(canvas, options) {
  this.canvas = canvas;
  this.radius = 3;
  this.circelLineWidth = 1;
  this.circleColor = 'lightgray';
  this.dotColor = 'gray';
}
var loadingobj = new Array();
loading.prototype = {
  show: function () {
    var canvas = this.canvas;
    if (!canvas.getContext) return;
    if (canvas.__loading) return;
    canvas.__loading = this;
    var ctx = canvas.getContext('2d');
    var radius = this.radius;
    var rotators = [
      {
        angle: 0,
        radius: 0.2
      },
      {
        angle: 3 / radius,
        radius: 0.4
      },
      {
        angle: 7 / radius,
        radius: 0.6
      },
      {
        angle: 12 / radius,
        radius: 0.8
      }
    ];
    var me = this;
    canvas.loadingInterval = setInterval(function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var lineWidth = me.circleLineWidth;
      var center = {
        x: canvas.width / 2 - radius,
        y: canvas.height / 2 - radius
      };
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = me.circleColor;
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
      for (var i = 0; i < rotators.length; i++) {
        var rotatorAngle = rotators[i].currentAngle || rotators[i].angle;
        //在圆圈上面画小圆
        var rotatorCenter = {
          x: center.x - (radius) * Math.cos(rotatorAngle),
          y: center.y - (radius) * Math.sin(rotatorAngle)
        };
        var rotatorRadius = rotators[i].radius;
        ctx.beginPath();
        ctx.fillStyle = me.dotColor;
        ctx.arc(rotatorCenter.x, rotatorCenter.y, rotatorRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        rotators[i].currentAngle = rotatorAngle + 4 / radius;
      }
    }, 50);
  },
  hide: function () {
    var canvas = this.canvas;
    canvas.__loading = false;
    if (canvas.loadingInterval) {
      window.clearInterval(canvas.loadingInterval);
    }
    var ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};
(function () {
  var one_time = 5; //每個國家抓取資料逾時秒數
  var randTime = 0;
  var mymc; //自身國家ID
  var mylc; //自身位置國家ID   
  var update_items_name = {
    1: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: ''
    },
    2: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: ''
    },
    3: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: ''
    },
    7: {
      1: ''
    },
    12: {
      1: ''
    }
  }; //項目名稱
  var autobuy = 0;
  var autoupdate = 1;
  var wait_min = 5;
  var wait_max = 10;
  var update_items = {
    1: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },
    2: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },
    3: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    7: {
      1: 0
    },
    12: {
      1: 0
    }
  }; //更新項目
  var update_items_p = {
    1: {
      1: '0.0',
      2: '0.0',
      3: '0.0',
      4: '0.0',
      5: '0.0',
      6: '0.0',
      7: '0.0'
    },
    2: {
      1: '0.0',
      2: '0.0',
      3: '0.0',
      4: '0.0',
      5: '0.0',
      6: '0.0',
      7: '0.0'
    },
    3: {
      1: '0.0',
      2: '0.0',
      3: '0.0',
      4: '0.0',
      5: '0.0'
    },
    7: {
      1: '0.0'
    },
    12: {
      1: '0.0'
    }
  };
  var update_items_a = {
    1: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },
    2: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },
    3: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    7: {
      1: 0
    },
    12: {
      1: 0
    }
  };
  var update_items_s = {
    1: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },
    2: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    },
    3: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    7: {
      1: 0
    },
    12: {
      1: 0
    }
  };
  function saveSeeting()
  {
    var data = new function ()
    {
      this.autoupdate = autoupdate;
      this.wait_min = wait_min;
      this.wait_max = wait_max;
      this.update_items = update_items;
      this.update_items_p = update_items_p;
      this.update_items_a = update_items_a;
    }();
    localStorage.setItem('TTE_Setting', JSON.stringify(data));
  }
  function loadSeeting()
  {
    var TTE_Setting = localStorage.getItem('TTE_Setting');
    if (TTE_Setting != null)
    {
      TTE_Setting = JSON.parse(TTE_Setting);
      autoupdate = TTE_Setting.autoupdate;
      wait_min = TTE_Setting.wait_min;
      wait_max = TTE_Setting.wait_max;
      update_items = TTE_Setting.update_items;
      update_items_p = TTE_Setting.update_items_p;
      if (TTE_Setting.update_items_a != null)
      update_items_a = TTE_Setting.update_items_a;
    }
  }
  loadSeeting();
  //====
  //清單顯示國家編號
  var mc_clist_arr = [
    81,
    65,
    35,
    13,
    24,
    14,
    1,
    11,
    49,
    44,
    9,
    42,
    43,
    63,
    27,
    79,
    58,
    28,
    53,
    67,
    74,
    77,
    75,
    52,
    41,
    59,
    29,
    68,
    30,
    38,
    15,
    47,
    51,
    61,
    40,
    36,
    166,
    37,
    73,
    70,
    55,
    82,
    78,
    64,
    23,
    69,
    76,
    32,
    83,
    33,
    39,
    12,
    48,
    84,
    31,
    80,
    26,
    66,
    72,
    71,
    45,
    10,
    54,
    56,
    50,
    34,
    165,
    57,
    164
  ];
  //國家參數 請勿隨意更改
  var mc_name_arr = {
    81: 'TAIWAN',
    65: 'SERBIA',
    35: 'POLAND',
    13: 'HUNGARY',
    24: 'USA',
    1: 'ROMANIA',
    11: 'FRANCE',
    49: 'INDONESIA',
    44: 'GREECE',
    14: 'CHINA',
    9: 'BRAZIL',
    42: 'BULGARIA',
    43: 'TURKEY',
    63: 'CROATIA',
    27: 'ARGENTINA',
    79: 'MACEDONIA',
    58: 'ISRAEL',
    28: 'VENEZUELA',
    53: 'PORTUGAL',
    67: 'PHILIPPINES',
    74: 'URUGWAY',
    77: 'PERU',
    75: 'PARAGWAY',
    52: 'REPUBLIC_OF_MOLDOVIA',
    41: 'RUSSIA',
    59: 'THAILAND',
    29: 'UNITED_KINGDOM',
    68: 'SINGAPORE',
    30: 'SWITZERLAND',
    38: 'SWEDEN',
    15: 'SPAIN',
    47: 'SOUTH_KOREA',
    51: 'SOUTH_AFRICA',
    61: 'SLOVENIA',
    40: 'UKRAINE',
    36: 'SLOVAKIA',
    166: 'ARAB_EMIRATES',
    37: 'NORWAY',
    73: 'NORTH_KOREA',
    70: 'ESTONIA',
    55: 'DENMARK',
    82: 'CYPRUS',
    78: 'COLOMBIA',
    64: 'CHILE',
    23: 'CANADA',
    69: 'BOSNIA',
    76: 'BOLIVIA',
    32: 'BELGIUM',
    83: 'BELARUS',
    33: 'AUSTRIA',
    39: 'FINLAND',
    12: 'GERMANY',
    48: 'INDIA',
    84: 'NEW_ZELAND',
    31: 'NETHERLANDS',
    80: 'MONTENEGRO',
    26: 'MEXICO',
    66: 'MALAYSIA',
    72: 'LITHUANIA',
    71: 'LATVIA',
    45: 'JAPAN',
    10: 'ITALY',
    54: 'IRELAND',
    56: 'IRAN',
    50: 'AUSTRALIA',
    34: 'CZECH',
    165: 'EGYPT',
    57: 'PAKISTAN',
    164: 'SAUDI_ARABIA'
  };
  //國家連結 更改將無法抓取稅率
  var mc_url_arr = {
    81: 'Republic-of-China-Taiwan',
    65: 'Serbia',
    35: 'Poland',
    13: 'Hungary',
    24: 'USA',
    1: 'Romania',
    11: 'France',
    49: 'Indonesia',
    44: 'Greece',
    14: 'China',
    9: 'Brazil',
    42: 'Bulgaria',
    43: 'Turkey',
    63: 'Croatia',
    27: 'Argentina',
    79: 'Republic-of-Macedonia-FYROM',
    58: 'Israel',
    28: 'Venezuela',
    53: 'Portugal',
    67: 'Philippines',
    74: 'Uruguay',
    77: 'Peru',
    75: 'Paraguay',
    52: 'Republic-of-Moldova',
    41: 'Russia',
    59: 'Thailand',
    29: 'United-Kingdom',
    68: 'Singapore',
    30: 'Switzerland',
    38: 'Sweden',
    15: 'Spain',
    47: 'South-Korea',
    51: 'South-Africa',
    61: 'Slovenia',
    40: 'Ukraine',
    36: 'Slovakia',
    166: 'United-Arab-Emirates',
    37: 'Norway',
    73: 'North-Korea',
    70: 'Estonia',
    55: 'Denmark',
    82: 'Cyprus',
    78: 'Colombia',
    64: 'Chile',
    23: 'Canada',
    69: 'Bosnia-Herzegovina',
    76: 'Bolivia',
    32: 'Belgium',
    83: 'Belarus',
    33: 'Austria',
    39: 'Finland',
    12: 'Germany',
    48: 'India',
    84: 'New-Zealand',
    31: 'Netherlands',
    80: 'Montenegro',
    26: 'Mexico',
    66: 'Malaysia',
    72: 'Lithuania',
    71: 'Latvia',
    45: 'Japan',
    10: 'Italy',
    54: 'Ireland',
    56: 'Iran',
    50: 'Australia',
    34: 'Czech-Republic',
    165: 'Egypt',
    57: 'Pakistan',
    164: 'Saudi-Arabia'
  };
  var currencies = {
    1: 'RON',
    9: 'BRL',
    10: 'ITL',
    11: 'FRF',
    12: 'DEM',
    13: 'HUF',
    14: 'CNY',
    15: 'ESP',
    23: 'CAD',
    24: 'USD',
    26: 'MXN',
    27: 'ARS',
    28: 'VEB',
    29: 'GBP',
    30: 'CHF',
    31: 'NLG',
    32: 'BEF',
    33: 'ATS',
    34: 'CZK',
    35: 'PLN',
    36: 'SKK',
    37: 'NOK',
    38: 'SEK',
    39: 'FIM',
    40: 'UAH',
    41: 'RUB',
    42: 'BGN',
    43: 'TRY',
    44: 'GRD',
    45: 'JPY',
    47: 'KRW',
    48: 'INR',
    49: 'IDR',
    50: 'AUD',
    51: 'ZAR',
    52: 'MDL',
    53: 'PTE',
    54: 'IEP',
    55: 'DKK',
    56: 'IRR',
    57: 'PKR',
    58: 'NIS',
    59: 'THB',
    61: 'SIT',
    62: 'GOLD',
    63: 'HRK',
    64: 'CLP',
    65: 'RSD',
    66: 'MYR',
    67: 'PHP',
    68: 'SGD',
    69: 'BAM',
    70: 'EEK',
    71: 'LVL',
    72: 'LTL',
    73: 'KPW',
    74: 'UYU',
    75: 'PYG',
    76: 'BOB',
    77: 'PEN',
    78: 'COP',
    79: 'MKD',
    80: 'MEP',
    81: 'TWD',
    82: 'CYP',
    83: 'BYR',
    84: 'NZD',
    164: 'SAR',
    165: 'EGP',
    166: 'AED',
    167: 'ALL'
  };
  var items_html = '<b>Öğe Listesi</b><br><table>';
  {
    for (var i in update_items)
    {
      for (var j in update_items[i])
      {
        if (j == 1 && i != 12)
        items_html = items_html + '<tr>';
        items_html = items_html + '<td><INPUT TYPE=\'checkbox\'  id=\'ilist_' + i + '_' + j + '\' value=\'' + update_items_name[i][j] + '\' ';
        if (update_items[i][j] == 1)
        items_html = items_html + 'checked';
        items_html = items_html + ' />';
        items_html = items_html + '<a onclick="document.getElementById(\'ilist_' + i + '_' + j + '\').click()">';
        if (i <= 3)
        update_items_name[i][j] = 'Q' + j + '<img src=\'https://www.erepublik.net/images/icons/industry/' + i + '/q' + j + '_30x30.png\' height=20>';
         else
        update_items_name[i][j] = '<font color=\'#FFF\'>Q0</font><img src=\'https://www.erepublik.net/images/icons/industry/' + i + '/default_30x30.png\' height=20>';
        items_html = items_html + update_items_name[i][j] + '</a><INPUT TYPE=\'text\' id=\'autolist_' + i + '_' + j + '\' value=\'' + update_items_p[i][j] + '\' size=\'5\'/><br><INPUT TYPE=\'text\' id=\'amount_' + i + '_' + j + '\' value=\'' + update_items_a[i][j] + '\' size=\'5\'/><b id=\'stock_' + i + '_' + j + '\'>' + update_items_s[i][j] + '</b></td>';
        if (j == 4)
        items_html = items_html + '</tr>';
      }
    }
  }
  items_html = items_html + '</table>';
  var lang = '';
  var langString = {
    'en': {
      'Error': 'Error',
      'Title': 'eRepmatik Oto Market',
      'UpdatingMsg': 'Updating...',
      'Updating': 'Updateing',
      'Rest': 'reset',
      'RestMsg': 'All settings Resetting?',
      'AutoUpdate': 'AutoUpdate',
      'AutoBuying': 'AutoBuying',
      'Start': 'Start',
      'Hint': 'Hint',
      'Citizenship': 'Citizenship',
      'Country': 'Country',
      'Location': 'Location',
      'Storage': 'Storage',
      'Unknown': 'simsek bakıyor??? WTF',
      'Log': 'Purchased Product Registration:',
      'BuyMsg': 'Buy {0}',
      'Delay': 'Update Time Interval',
      'DelayMsg': 'Updated found about so far in seconds: {0}s',
      'BuyMsg': 'buy {0}',
      'LogMsg': '{0} at {1} Cost {2} {3} Buy {4} : {5} * {6} <br>'
    },
    'tr': {
      'Error': 'Error',
      'Title': 'eRepmatik Oto Market',
      'UpdatingMsg': 'Güncelleniyor...',
      'Updating': 'Updateing',
      'Rest': 'Sıfırla',
      'RestMsg': 'Tüm ayarlar sıfırlanacak?',
      'AutoUpdate': 'AutoUpdate',
      'AutoBuying': 'AutoBuying',
      'Start': 'Start',
      'Hint': 'Hintr',
      'Citizenship': 'Citizenship',
      'Country': 'Country',
      'Location': 'Location',
      'Storage': 'Storage',
      'Unknown': 'Unknown',
      'Log': 'Purchased Product Registration:',
      'BuyMsg': 'Buy {0}',
      'Delay': 'Update Time Interval',
      'DelayMsg': 'Updated found about so far in seconds: {0}s',
      'BuyMsg': 'Buy {0}',
      'LogMsg': '{0} at {1} Cost {2} {3} Buy {4} : {5} * {6} <br>'
    }
  };
  $('html').html('<center><h1>載入語言中....<br>Language Loading....</h1></center>');
  function getLanguageAndSetup()
  {
    var url = 'https://www.erepublik.com';
    $.ajax({
      url: url,
      context: document,
      success: function (html)
      {
        langUrl = $(html).filter('[name=\'language\']').attr('content');
        lang = 'tr';
        if (langUrl == 'tr'
        || langUrl == 'en'
        )
        {
          lang = langUrl;
        }
        if (html.search('login_form') < 0)
        {
          $('html').html('<title>' + langString[lang]['Title'] + '</title>' +
          '<table><tr valign=top><td><h3><b>' + langString[lang]['Title'] + '</b></h3>' +
          '<table>' +
          '<tr><td>' + langString[lang]['Citizenship'] + ' </td><td><canvas class=\'loading\' width=\'16\' height=\'16\'></canvas><b id=\'mymc\'>' + langString[lang]['Unknown'] + '</b></td></tr>' +
          '<tr><td>' + langString[lang]['Location'] + ' </td><td><canvas class=\'loading\' width=\'16\' height=\'16\'></canvas><b id=\'mylc\'>' + langString[lang]['Unknown'] + '</b></td></tr>' +
          '<tr><td>' + langString[lang]['Storage'] + ' </td><td><canvas class=\'loading\' width=\'16\' height=\'16\'></canvas><b id=\'inventory\'>' + langString[lang]['Unknown'] + '</b></td></tr>' +
          '<tr><td>CSRFtoken </td><td><canvas class=\'loading\' width=\'16\' height=\'16\'></canvas><b id=\'token\'>' + langString[lang]['Unknown'] + '</b></td></tr>' +
          '</table>' + items_html + '<HR />' +
          '<INPUT TYPE=\'checkbox\' id=\'auto\' ' + ((autoupdate) ? 'checked' : '') + '><a onclick="document.getElementById(\'auto\').click()">' + langString[lang]['AutoUpdate'] + '</a>  ' +
          '<INPUT TYPE=\'button\' onclick=\'if(confirm("' + langString[lang]['RestMsg'] + '")){localStorage.removeItem("TTE_Setting");location.reload();}\' value=\'' + langString[lang]['Rest'] + '\'><br>' +
          '<INPUT TYPE=\'checkbox\' id=\'autoBuy\' ' + ((autobuy) ? 'checked' : '') + '><a onclick="document.getElementById(\'autoBuy\').click()">' + langString[lang]['AutoBuying'] + '</a> (' + langString[lang]['Hint'] + ')<br>' +
          '' + langString[lang]['Delay'] + ' :<INPUT TYPE=\'text\' id=\'wait_min\' value=\'' + wait_min + '\' size=1>~<INPUT TYPE=\'text\' id=\'wait_max\' value=\'' + wait_max + '\' size=1>' +
          '<INPUT TYPE=\'button\' id=\'update_button\' onClick=\'this.value="' + langString[lang]['Updating'] + '"; this.disabled=true;  \' value=\'' + langString[lang]['Start'] + '\' /><div id=\'header_data\'></div><div id=\'data\'></div>' +
          '</td><td><div id=\'buyLog\'>' + langString[lang]['Log'] + ':<br></div></td></tr>' +
          '</table>');
          for (var i = 0; i < 4; i++)
          loadingobj.push(new loading(document.getElementsByClassName('loading') [i]));
          getAllData();
          update();
        } 
        else {
          location.assign('https://www.erepublik.com');
        }
      }
    });
  }
  getLanguageAndSetup();
  var mc_id_arr;
  var mc = 0;
  var mcP = 0;
  var times = 0; //成功連線次數暫存
  var time = 0; //等待時間暫存
  var max_time = 0;
  var mc_arr;
  var inventory = 0;
  var token = '';
  function getAllData()
  {
    if ($('#update_button').val() == langString[lang]['Updating'])
    {
      $('#header_data').html('' + langString[lang]['UpdatingMsg'] + '<br>     \t\t\t\t\t\t\t\t\t\t<progress id=\'times\' value=\'1\' max=\'1\' >'
      );
      mcP = 0;
      times = 0; //成功連線次數暫存
      time = 0; //等待時間暫存
      timedown();
    }
    for (var i = 0; i < 4; i++)
    loadingobj[i].show();
    var url = 'https://www.erepublik.com/' + lang + '/economy/inventory';
    $.ajax({
      url: url,
      context: document,
      success: function (html)
      {
        tmp = html.match(/country: '(\d{1,3})'/);
        if (tmp)
        mymc = tmp[1] * 1;
        tmp = html.match(/countryLocationId: '(\d{1,3})'/);
        if (tmp)
        mylc = tmp[1] * 1;
        tmp = html.match(/name=\"_token\" value=\"([^"]{32,32})\"/);
        if (tmp)
        token = tmp[1];
        tmp = html.match(/\(([0-9,]+)\/([0-9,]+)\)/);
        if (tmp)
        {
          tmp[1] = tmp[1].replace(/,/g, '') * 1;
          tmp[2] = tmp[2].replace(/,/g, '') * 1;
          inventory = tmp[2] - tmp[1];
        }
        for (var i = 0; i < 4; i++)
        loadingobj[i].hide();
        $('#inventory').html(inventory + ' ' + tmp[0]);
        $('#token').html(token);
        $('#mymc').html('<img src=\'https://www.erepublik.net/images/flags_png/S/' + mc_url_arr[mymc] + '.png\'/> </td><td>' + mc_url_arr[mymc]);
        $('#mylc').html('<img src=\'https://www.erepublik.net/images/flags_png/S/' + mc_url_arr[mylc] + '.png\'/> </td><td>' + mc_url_arr[mylc]);
        for (var i in update_items_s)
        {
          for (var j in update_items_s[i])
          {
            tmp = html.match(new RegExp('stock_' + i + '_' + j + '">([0-9,]+)', ''));
            if (tmp)
            {
              var v = tmp[1].replace(/,/g, '') * 1;
              $('#stock_' + i + '_' + j).html(v);
              update_items_s[i][j] = v;
            }
          }
        }
        for (var i in update_items_a)
        {
          for (var j in update_items_a[i])
          {
            update_items_a[i][j] = $('#amount_' + i + '_' + j).val();
          }
        }
        for (var i in update_items_name)
        {
          for (var j in update_items_name[i])
          {
            if ($('#ilist_' + i + '_' + j).attr('checked') == 'checked')
            update_items[i][j] = 1;
             else
            update_items[i][j] = 0;
          }
        }
        for (var i in update_items)
        for (var j in update_items[i])
        mcP = mcP + update_items[i][j];
        if ($('#update_button').val() == langString[lang]['Updating'])
        {
          mc_id_arr = new Array()
          mc_id_arr.push(mymc);
          if (mymc != mylc)
          mc_id_arr.push(mylc);
          mc = mc_id_arr.length;
          max_time = mc * one_time;
          mc_arr = new Array();
          for (var i = 0; i < mc; i++)
          mc_arr[i] = new myCountries(mc_id_arr[i]);
          $('#times').attr('max', ((mc * mcP) + 1));
          $('#times').attr('value', 1);
          for (var i = 0; i < mc; i++)
          mc_arr[i].getall();
          times++;
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $('#inventory').html('' + langString[lang]['Error'] + '');
        $('#token').html('' + langString[lang]['Error'] + '');
        $('#mymc').html('' + langString[lang]['Error'] + '');
        $('#mylc').html('' + langString[lang]['Error'] + '');
        times++;
      }
    });
  }
  function myCountries(id)
  {
    this.id = id;
    this.location = 0;
    this.name = mc_name_arr[id];
    this.url = mc_url_arr[id];
    this.items = {
      1: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      },
      2: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      },
      3: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      },
      7: {
        1: 0
      },
      12: {
        1: 0
      }
    };
    this.items_a = {
      1: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      },
      2: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      },
      3: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      },
      7: {
        1: 0
      },
      12: {
        1: 0
      }
    };
    this.items_id = {
      1: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      },
      2: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0
      },
      3: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      },
      7: {
        1: 0
      },
      12: {
        1: 0
      }
    };
    this.getall = function ()
    {
      var x = this;
      x.getprice(7, 1);
      x.getprice(12, 1);
      for (var i = 1; i <= 7; i++)
      x.getprice(1, i);
      for (var i = 1; i <= 7; i++)
      x.getprice(2, i);
      for (var i = 1; i <= 5; i++)
      x.getprice(3, i);
    }
    this.getprice = function (item, level)
    {
      if (update_items[item][level] == 0)
      return;
      var getURL = 'https://www.erepublik.com/' + lang + '/economy/marketplace/' + this.id + '/' + item + '/' + level + '/citizen/0/price_asc/1';
      var x = this;
      $.ajax({
        url: getURL,
        context: document,
        success: function (html)
        {
          tmp = html.match(/productId_(\d+)\"[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^>]+>[^0-9]+([0-9,]+)[^>]+>[^>]+>[^>]+>[^0-9.]?(\d+)[^>]+>[^>]+>[^0-9.]?([0-9.]+)/);
          x.items_id[item][level] = tmp[1];
          x.items[item][level] = (tmp[3] + tmp[4]) * 1;
          x.items_a[item][level] = tmp[2].replace(/,/g, '') * 1;
          ;
          times++;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          times++;
        }
      });
    }
  }
  function showtable()
  {
    var str = '';
    str = str + '<table border=\'1\'  cellSpacing=\'0\' style=\'white-space: nowrap\'>';
    str = str + '<tr><td>' + langString[lang]['Country'] + '</td>';
    for (var i = 0; i < mc; i++)
    str = str + '<td>' + mc_arr[i].name + '<img src=\'https://www.erepublik.net/images/flags_png/S/' + mc_url_arr[mc_arr[i].id] + '.png\'/></td>';
    str = str + '</tr>';
    buy_enoght = true;
    for (var i in update_items)
    for (var j in update_items[i])
    {
      if (update_items_a[i][j] - update_items_s[i][j] > 0)
      {
        buy_enoght = false;
      }
    }
    for (var i in update_items)
    for (var j in update_items[i])
    if (update_items[i][j] == 1)
    {
      str = str + '<tr><td>' + update_items_name[i][j] + '</td>';
      for (var k = 0; k < mc; k++)
      {
        str = str + '<td>';
        str = str + '<a href=\'' + 'https://www.erepublik.com/' + lang + '/economy/marketplace/' + mc_arr[k].id + '/' + i + '/' + j + '/citizen/0/price_asc/1' + '\' target=\'_blank\'>' + mc_arr[k].items[i][j] + '</a> (' + mc_arr[k].items_a[i][j] + ')';
        amount = ((mc_arr[k].items_a[i][j] < inventory) ? mc_arr[k].items_a[i][j] : inventory);
        if (amount > 0)
        {
          str = str + '<form target=\'_blank\'  method=\'post\' action=\'https://www.erepublik.com/' + lang + '/economy/marketplace/' + mc_arr[k].id + '/' + i + '/' + j + '/citizen/0/price_asc/1\'>';
          str = str + '<input type=\'hidden\' name=\'amount\' value=' + amount + ' />';
          str = str + '<input type=\'hidden\' name=\'offerId\' value=' + mc_arr[k].items_id[i][j] + ' />';
          str = str + '<input type=\'hidden\' name=\'_token\' value=' + token + ' />';
          str = str + '<input type=\'submit\' value=\'' + langString[lang]['BuyMsg'].interpolate(amount) + '\'/>';
          str = str + '</form>';
        }
        update_items_p[i][j] = document.getElementById('autolist_' + i + '_' + j).value;
        autoBuy = ($('#autoBuy').attr('checked') == 'checked') ? 1 : 0;
        if (buy_enoght == false)
        {
          var notNeedBuy = getNotNeedBuyAmount();
          if (update_items_a[i][j] - update_items_s[i][j] > 0)
          {
            notNeedBuy += update_items_a[i][j] - update_items_s[i][j];
          }
          if (notNeedBuy < amount)
          {
            amount = notNeedBuy;
          }
        }
        if ((amount > 0) && (autoBuy == 1)
        && (mc_arr[k].items[i][j] > 0)
        && ((update_items_p[i][j] * 1) >= mc_arr[k].items[i][j])
        && (update_items_a[i][j] > 0
        || buy_enoght == true)
        )
        {
          var d = new Date();
          var datetimeStr = (d.getMonth() + 1) + '/' + ((d.getDate() < 10) ? '0' : '') + d.getDate() + ' ' + ((d.getHours() < 10) ? '0' : '') + d.getHours() + ':' + ((d.getMinutes() < 10) ? '0' : '') + d.getMinutes() + ':' + ((d.getSeconds() < 10) ? '0' : '') + d.getSeconds();
          buyurl = 'https://www.erepublik.com/' + lang + '/economy/marketplace/' + mc_arr[k].id + '/' + i + '/' + j + '/citizen/0/price_asc/1';
          buydata = 'amount=' + amount + '&offerId=' + mc_arr[k].items_id[i][j] + '&_token=' + token;
          buyLogData = langString[lang]['LogMsg'].interpolate(datetimeStr, mc_arr[k].name, (mc_arr[k].items[i][j] * amount).toFixed(2), currencies[mymc], update_items_name[i][j], amount, mc_arr[k].items[i][j]);
          $.ajax({
            url: buyurl,
            type: 'POST',
            data: buydata,
            success: function (html)
            {
              if (html.search('success_message') > 0)
              document.getElementById('buyLog').innerHTML += buyLogData;
            }
          }
          );
        }
        str = str + '</td>';
      }
      str = str + '</tr>';
    }
    str = str + '</table>';
    $('#header_data').html('');
    $('#data').html(str);
  }
  function getColorTD(value)
  {
    str = ''
    if (value <= 0)
    str = str + '<td>';
     else if (value >= 1)
    str = str + '<td bgcolor=\'blue\'>';
     else if (value >= 0.5)
    str = str + '<td bgcolor=\'red\'>';
     else
    str = str + '<td bgcolor=\'yellow\'>';
    str = str + (value * 100).toFixed(2);
    str = str + '%</td>';
    return str;
  }
  function getNotNeedBuyAmount()
  {
    var needBuy = 0;
    for (var i in update_items_s)
    {
      for (var j in update_items_s[i])
      {
        if (update_items_a[i][j] > 0 && update_items_a[i][j] > update_items_s[i][j])
        {
          needBuy += update_items_a[i][j] - update_items_s[i][j];
        }
      }
    }
    return inventory - needBuy;
  }
  function timedown()
  {
    saveSeeting();
    $('#times').attr('value', times);
    if ((times < (mc * mcP) + 1) && (time < max_time + one_time))
    {
      time = time + 0.1;
      setTimeout(timedown, 100);
    } 
    else
    {
      showtable();
      var checked = $('#auto').attr('checked');
      if (checked != 'checked')
      {
        autoupdate = 0;
        $('#update_button').val('' + langString[lang]['Start'] + '');
        $('#update_button').removeAttr('disabled');
        setTimeout(update, 10);
      } 
      else
      {
        autoupdate = 1;
        wait_min = $('#wait_min').val() * 1;
        wait_max = $('#wait_max').val() * 1;
        randTime = Math.floor((Math.random() * (wait_max - wait_min)) + wait_min);
        $('#header_data').html('' + langString[lang]['DelayMsg'].interpolate(randTime) + '<br><progress id=\'times\' value="0" max="' + randTime + '">');
        setTimeout(timecount, 10);
      }
    }
  }
  function timecount()
  {
    $('#times').attr('value', randTime);
    if (randTime > 0)
    {
      randTime--;
      setTimeout(timecount, (1000));
    } 
    else
    {
      setTimeout(update, 10);
    }
  }
  function update()
  {
    if ($('#update_button').val() == langString[lang]['Updating'])
    getAllData();
     else
    setTimeout(update, 100);
  }
}) ();
