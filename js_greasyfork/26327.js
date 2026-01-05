// ==UserScript==
// @name         Show QRCode
// @name:en      Show QRCode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  显示网页二维码
// @description:en  show current page qrcode
// @author       whbb
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.bootcss.com/vex-js/3.0.0/js/vex.combined.min.js
// @resource     vexCSS https://cdn.bootcss.com/vex-js/3.0.0/css/vex.min.css
// @resource     vexTheme https://cdn.bootcss.com/vex-js/3.0.0/css/vex-theme-default.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/26327/Show%20QRCode.user.js
// @updateURL https://update.greasyfork.org/scripts/26327/Show%20QRCode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var keyboardMap = [
    "", // [0]
    "", // [1]
    "", // [2]
    "CANCEL", // [3]
    "", // [4]
    "", // [5]
    "HELP", // [6]
    "", // [7]
    "BACK_SPACE", // [8]
    "TAB", // [9]
    "", // [10]
    "", // [11]
    "CLEAR", // [12]
    "ENTER", // [13]
    "ENTER_SPECIAL", // [14]
    "", // [15]
    "SHIFT", // [16]
    "CONTROL", // [17]
    "ALT", // [18]
    "PAUSE", // [19]
    "CAPS_LOCK", // [20]
    "KANA", // [21]
    "EISU", // [22]
    "JUNJA", // [23]
    "FINAL", // [24]
    "HANJA", // [25]
    "", // [26]
    "ESCAPE", // [27]
    "CONVERT", // [28]
    "NONCONVERT", // [29]
    "ACCEPT", // [30]
    "MODECHANGE", // [31]
    "SPACE", // [32]
    "PAGE_UP", // [33]
    "PAGE_DOWN", // [34]
    "END", // [35]
    "HOME", // [36]
    "LEFT", // [37]
    "UP", // [38]
    "RIGHT", // [39]
    "DOWN", // [40]
    "SELECT", // [41]
    "PRINT", // [42]
    "EXECUTE", // [43]
    "PRINTSCREEN", // [44]
    "INSERT", // [45]
    "DELETE", // [46]
    "", // [47]
    "0", // [48]
    "1", // [49]
    "2", // [50]
    "3", // [51]
    "4", // [52]
    "5", // [53]
    "6", // [54]
    "7", // [55]
    "8", // [56]
    "9", // [57]
    "COLON", // [58]
    "SEMICOLON", // [59]
    "LESS_THAN", // [60]
    "EQUALS", // [61]
    "GREATER_THAN", // [62]
    "QUESTION_MARK", // [63]
    "AT", // [64]
    "A", // [65]
    "B", // [66]
    "C", // [67]
    "D", // [68]
    "E", // [69]
    "F", // [70]
    "G", // [71]
    "H", // [72]
    "I", // [73]
    "J", // [74]
    "K", // [75]
    "L", // [76]
    "M", // [77]
    "N", // [78]
    "O", // [79]
    "P", // [80]
    "Q", // [81]
    "R", // [82]
    "S", // [83]
    "T", // [84]
    "U", // [85]
    "V", // [86]
    "W", // [87]
    "X", // [88]
    "Y", // [89]
    "Z", // [90]
    "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
    "", // [92]
    "CONTEXT_MENU", // [93]
    "", // [94]
    "SLEEP", // [95]
    "NUMPAD0", // [96]
    "NUMPAD1", // [97]
    "NUMPAD2", // [98]
    "NUMPAD3", // [99]
    "NUMPAD4", // [100]
    "NUMPAD5", // [101]
    "NUMPAD6", // [102]
    "NUMPAD7", // [103]
    "NUMPAD8", // [104]
    "NUMPAD9", // [105]
    "MULTIPLY", // [106]
    "ADD", // [107]
    "SEPARATOR", // [108]
    "SUBTRACT", // [109]
    "DECIMAL", // [110]
    "DIVIDE", // [111]
    "F1", // [112]
    "F2", // [113]
    "F3", // [114]
    "F4", // [115]
    "F5", // [116]
    "F6", // [117]
    "F7", // [118]
    "F8", // [119]
    "F9", // [120]
    "F10", // [121]
    "F11", // [122]
    "F12", // [123]
    "F13", // [124]
    "F14", // [125]
    "F15", // [126]
    "F16", // [127]
    "F17", // [128]
    "F18", // [129]
    "F19", // [130]
    "F20", // [131]
    "F21", // [132]
    "F22", // [133]
    "F23", // [134]
    "F24", // [135]
    "", // [136]
    "", // [137]
    "", // [138]
    "", // [139]
    "", // [140]
    "", // [141]
    "", // [142]
    "", // [143]
    "NUM_LOCK", // [144]
    "SCROLL_LOCK", // [145]
    "WIN_OEM_FJ_JISHO", // [146]
    "WIN_OEM_FJ_MASSHOU", // [147]
    "WIN_OEM_FJ_TOUROKU", // [148]
    "WIN_OEM_FJ_LOYA", // [149]
    "WIN_OEM_FJ_ROYA", // [150]
    "", // [151]
    "", // [152]
    "", // [153]
    "", // [154]
    "", // [155]
    "", // [156]
    "", // [157]
    "", // [158]
    "", // [159]
    "CIRCUMFLEX", // [160]
    "EXCLAMATION", // [161]
    "DOUBLE_QUOTE", // [162]
    "HASH", // [163]
    "DOLLAR", // [164]
    "PERCENT", // [165]
    "AMPERSAND", // [166]
    "UNDERSCORE", // [167]
    "OPEN_PAREN", // [168]
    "CLOSE_PAREN", // [169]
    "ASTERISK", // [170]
    "PLUS", // [171]
    "PIPE", // [172]
    "HYPHEN_MINUS", // [173]
    "OPEN_CURLY_BRACKET", // [174]
    "CLOSE_CURLY_BRACKET", // [175]
    "TILDE", // [176]
    "", // [177]
    "", // [178]
    "", // [179]
    "", // [180]
    "VOLUME_MUTE", // [181]
    "VOLUME_DOWN", // [182]
    "VOLUME_UP", // [183]
    "", // [184]
    "", // [185]
    "SEMICOLON", // [186]
    "EQUALS", // [187]
    "COMMA", // [188]
    "MINUS", // [189]
    "PERIOD", // [190]
    "SLASH", // [191]
    "BACK_QUOTE", // [192]
    "", // [193]
    "", // [194]
    "", // [195]
    "", // [196]
    "", // [197]
    "", // [198]
    "", // [199]
    "", // [200]
    "", // [201]
    "", // [202]
    "", // [203]
    "", // [204]
    "", // [205]
    "", // [206]
    "", // [207]
    "", // [208]
    "", // [209]
    "", // [210]
    "", // [211]
    "", // [212]
    "", // [213]
    "", // [214]
    "", // [215]
    "", // [216]
    "", // [217]
    "", // [218]
    "OPEN_BRACKET", // [219]
    "BACK_SLASH", // [220]
    "CLOSE_BRACKET", // [221]
    "QUOTE", // [222]
    "", // [223]
    "META", // [224]
    "ALTGR", // [225]
    "", // [226]
    "WIN_ICO_HELP", // [227]
    "WIN_ICO_00", // [228]
    "", // [229]
    "WIN_ICO_CLEAR", // [230]
    "", // [231]
    "", // [232]
    "WIN_OEM_RESET", // [233]
    "WIN_OEM_JUMP", // [234]
    "WIN_OEM_PA1", // [235]
    "WIN_OEM_PA2", // [236]
    "WIN_OEM_PA3", // [237]
    "WIN_OEM_WSCTRL", // [238]
    "WIN_OEM_CUSEL", // [239]
    "WIN_OEM_ATTN", // [240]
    "WIN_OEM_FINISH", // [241]
    "WIN_OEM_COPY", // [242]
    "WIN_OEM_AUTO", // [243]
    "WIN_OEM_ENLW", // [244]
    "WIN_OEM_BACKTAB", // [245]
    "ATTN", // [246]
    "CRSEL", // [247]
    "EXSEL", // [248]
    "EREOF", // [249]
    "PLAY", // [250]
    "ZOOM", // [251]
    "", // [252]
    "PA1", // [253]
    "WIN_OEM_CLEAR", // [254]
    "" // [255]
  ];

  const vexCss = GM_getResourceText('vexCSS')
  const vexTheme = GM_getResourceText('vexTheme')
  GM_addStyle(vexCss)
  GM_addStyle(vexTheme)

  vex.defaultOptions.className = 'vex-theme-default'
  
  const setting = {}, defaultSetting = {
    keyList: '81,82'.split(','),
    setting: false,
    isCtrl: true,
    isAlt: true,
    isShift: false,
    settingError: false,
  }

  function defineProperty(obj, key, onchange) {
    let value = obj[key]
    Object.defineProperty(obj, key, {
      get: function() { return value },
      set: function(val) {
        if(onchange) {
          onchange(val, value)
        }
        value = val
      }
    })
  }

  function setInit() {
    Object.keys(defaultSetting).forEach(function(key) {
      setting[key] = GM_getValue(key, defaultSetting[key])
    })
    setting.settingError = false
  }

  function setDefault() {
    Object.keys(defaultSetting).forEach(function(key) {
      setting[key] = defaultSetting[key]
    })
    setting.settingError = false
  }

  for(let key in defaultSetting) {
    setInit()
    defineProperty(setting, key, function(val) {
      let _ = null
      switch(key) {
      case 'keyList':
        $('#qr-shortcut').val(val.map(function(keyCode) { return keyboardMap[keyCode] }))
        setting.settingError = !val.length
        break;
      case 'setting':
        _ = val ? $('#qr-setting').show() : $('#qr-setting').hide()
        $('#qr-set-button-arrow').html(val ? '&#9660; ' : '&#9654; ')
        break;
      case 'isCtrl':
      case 'isAlt':
      case 'isShift':
        $('#qr-' + key).css('background', val ? 'red' : '#aaa')
        break;
      case 'settingError':
        $('#qr-shortcut').css('border', val ? '1px solid red' : 'none')
        break;
      }
    })
  }

  GM_registerMenuCommand('QrCode Default', setDefault)

  let q = 0
  document.onkeydown = function (e) {
    if ((!setting.isCtrl || e.ctrlKey) && (!setting.isAlt || e.altKey) && (!setting.isShift || e.shiftKey)) {
      if (setting.keyList[q] == e.which && setting.keyList.length === q + 1) {
        vex.dialog.open({
          message: location.href,
          input: ['<div id="qr-qrcode" style="width: 256px; margin: 20px auto"></div>',
            '<div id="qr-set-part" style="border: 1px solid #ccc; padding-left: 10px;">',
              '<div id="qr-set-button" style="cursor: pointer;"><span id="qr-set-button-arrow">&#9654; </span>Setting</div>',
              '<div id="qr-setting" style="display: none; margin: 10px 20px; font-size: 14px;" >',
                '<label style=""> ',
                  'Shortcut: <input id="qr-shortcut" style="height: 24px;" >',
                  '<label id="qr-isCtrl" class="qr-mod-key" style="margin: 0 5px; padding: 0 5px; border: 1px solid #aaa; background: #ccc; cursor: pointer;"> Ctrl </label>',
                  '<label id="qr-isAlt" class="qr-mod-key" style="margin: 0 5px; padding: 0 5px; border: 1px solid #aaa; background: #ccc; cursor: pointer;"> Alt </label>',
                  '<label id="qr-isShift" class="qr-mod-key" style="margin: 0 5px; padding: 0 5px; border: 1px solid #aaa; background: #ccc; cursor: pointer;"> Shift </label>',
                '</label>',
                '<br><label id="qr-setting-default" style="display: inline-block; line-height: 24px; margin: 20px 0 0; padding: 0 5px; border: 1px solid #aaa; background: #ccc; cursor: pointer;">default</label>',
              '</div>',
            '</div>'
            ].join(''),
          buttons: [vex.dialog.buttons.YES],
          onSubmit: function(e) {
            e.preventDefault()
            if(setting.keyList.length) {
              this.close()
              GM_setValue('keyList', setting.keyList)
              GM_setValue('isCtrl', setting.isCtrl)
              GM_setValue('isAlt', setting.isAlt)
              GM_setValue('isShift', setting.isShift)
            }
          }
        })

        setTimeout(function () {
          setInit()
          $('#qr-qrcode').qrcode(location.href)

          $('#qr-set-button').click(function(e) {
            setting.setting = !setting.setting

            e.stopPropagation()
            e.preventDefault()
          })

          $('.qr-mod-key').click(function(e) {
            const key = e.target.id.substr(3)
            setting[key] = !setting[key]
          })

          $('#qr-shortcut').keyup(function(e) {
            setting.settingError = false
            if(e.which === keyboardMap.indexOf('BACK_SPACE')) {
              setting.keyList = setting.keyList.slice(0, setting.keyList.length - 1)
            } else if(keyboardMap[e.which]) {
              setting.keyList = setting.keyList.concat(e.which)
            }
          })

          $('#qr-setting-default').click(function(e) {
            setDefault()
            setting.setting = true
          })
        }, 0);

        e.stopPropagation()
        e.preventDefault()
      }
      q = setting.keyList[q] == e.which ? q + 1 : 0
    }
  }
})();
