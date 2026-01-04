// ==UserScript==
// @name         eye-protection
// @name:zh-CN   护眼模式
// @noframes     true
// @namespace    https://github.com/jackdizhu
// @version      0.2.11
// @description:zh-CN  护眼模式，兼容所有网站，自动开启护眼模式，支持自定义颜色
// @description:en     Eye protection mode, compatible with all websites, automatically open eye protection mode, support custom colors
// @author       jackdizhu
// @match        *
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @description 护眼模式，兼容所有网站，自动开启护眼模式，支持自定义颜色
// @downloadURL https://update.greasyfork.org/scripts/407166/eye-protection.user.js
// @updateURL https://update.greasyfork.org/scripts/407166/eye-protection.meta.js
// ==/UserScript==
// 好评记得收藏一下，哈  If you think this script is good, please bookmark it, thanks!
(function() {
  'use strict';
  function getLang (key) {
    var $lang = navigator.language.toLowerCase().indexOf('zh') !== -1 ? 'zh' : 'en'
    var langObj = {
      'tips-zh': '护眼模式自定义颜色,如：rgb(204, 232, 207) 或者 #cddc39',
      'tips-en': 'Custom color for eye-protection, such as rgb(204, 232, 207) or #cddc39',
      'btn-save-zh': '保存',
      'btn-save-en': 'save',
      'btn-reset-zh': '重置',
      'btn-reset-en': 'reset',
      'btn-close-zh': '关闭',
      'btn-close-en': 'close',
      'btn-close-tips-zh': '如果无法关闭 请刷新界面',
      'btn-close-tips-en': 'If you cannot close, please refresh the interface',
      'btn-add-whitelist-zh': '添加白名单',
      'btn-add-whitelist-en': 'add whitelist',
      'btn-remove-whitelist-zh': '移出白名单',
      'btn-remove-whitelist-en': 'remove whitelist',
      'btn-menu-open-zh': '自定义颜色',
      'btn-menu-open-en': 'custom color',
    }
    return langObj[key + '-' + $lang] || ''
  }
  var dataKey = {
    color: 'eye-protection-color',
    whitelist: 'eye-protection-whitelist'
  }
  var defColor = 'rgb(204, 232, 207)';
  var curColor = defColor;
  var $el = document.createElement('div');
  var inWhitelist = false
  $el.style = `
    position: fixed;
    pointer-events: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: ${getDbColor()};
    opacity: 0.2;
    z-index: 999999999;
  `;
  // 从数据库取配置数据
  function getDbColor () {
    var color = GM_getValue(dataKey.color) || defColor;
    return color;
  }
  function getWhitelist () {
    var whitelist = GM_getValue(dataKey.whitelist) || '';
    return whitelist;
  }
  function saveWhitelist (data) {
    GM_setValue(dataKey.whitelist, data);
  }
  // 关闭菜单
  function closeMenu() {
    var oldEditBox = document.querySelector('#eye-protection-setMenu');
    if (oldEditBox) {
      oldEditBox.parentNode.removeChild(oldEditBox);
    }
    $el.style.background = curColor
  }
  // 保存选项
  function saveSetting() {
    curColor = document.querySelector('#eye-protection-setMenuTextArea').value;
    curColor = curColor.replace(/(^\s)|(\s$)/, '');
    GM_setValue(dataKey.color, curColor);
    closeMenu();
  }
  // 重置
  function reset() {
    curColor = defColor
    GM_setValue(dataKey.color, curColor);
    closeMenu();
  }
  // 打开菜单
  function openMenu() {
    var oldEditBox = document.querySelector('#eye-protection-setMenu');
    if (oldEditBox) {
      oldEditBox.parentNode.removeChild(oldEditBox);
      return;
    }
    var color = getDbColor();
    var $dom = document.createElement('div');
    $dom.id = 'eye-protection-setMenu';
    $dom.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50px;
        padding: 10px;
        background: #fff;
        border-radius: 4px;
    `;
    GM_addStyle(`
        #eye-protection-setMenu {
          font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
          font-size: 14px;
          z-index: 999999999;
          border: 1px solid #dedede;
        }
        
        #eye-protection-setMenu .button {
          padding: 3px 6px;
          line-height: 16px;
          margin-right: 10px;
          display: inline-block;
          border: 1px solid #999;
          border-radius: 3px;
          display: inline-block;
          cursor: pointer;
        }
        #eye-protection-setMenu p {
          margin: 0;
        }
        #eye-protection-setMenu p + p {
          margin-top: 10px;
        }
        #eye-protection-setMenu textarea {
            border: 1px solid;
            padding: 4px;
            overflow: auto;
            border-radius: 4px;
            margin-bottom: 10px;
            margin-top: 10px;
        }
        #eye-protection-setMenu .input-color span {
          display: inline-block;
          line-height: 28px;
          vertical-align: bottom;
        }
    `);
    var inColor = '#cddc39'
    function getHtml (color) {
      color = color || curColor
      if (/^\#/.test(color)) {
        inColor = color
      }
      return `
        <p>${getLang('tips')}</P>
        <textarea id="eye-protection-setMenuTextArea" wrap='off' cols='45' rows='5' value="${color}">${color}</textarea>
        <p class="input-color">
        <input type="color" id="eye-protection-color-input" value="${inColor}">
        <span>${inColor}</span>
        </p>
        <p>
        <span class="button" id='eye-protection-setMenuSave'>${getLang('btn-save')}</span>
        <span class="button" id='eye-protection-setMenureset'>${getLang('btn-reset')}</span>
        <span class="button" id='eye-protection-setMenuClose' title='${getLang('btn-close-tips')}'>${getLang('btn-close')}</span>
        </p>
        <p>
        ${inWhitelist ?
          '<span class="button" id="eye-protection-removeWhitelist">' + getLang('btn-remove-whitelist') + '</span>' :
          '<span class="button" id="eye-protection-addWhitelist">' + getLang('btn-add-whitelist') + '</span>'
        }
        </p>
        <!--<p>
        <input type="text" id="eye-protection-customInput"/>
        <span class="button" id='eye-protection-customWhitelist'>自定义白名单</span>
        </p>-->
    `;
    }
    
    var innerH = getHtml()
    function colorChange (e) {
      inColor = e.target.value
      $dom.innerHTML = getHtml(inColor);
    }
    $dom.innerHTML = innerH;
    document.body.appendChild($dom);

    function eventFn (event, fn, id) {
      if (event.target.id === id) {
        fn(event)
      }
    }
    function addWhitelist (domain) {
      var $whitelist = getWhitelist()
      var str = ',' + domain
      if ($whitelist.indexOf(str) === -1) {
        inWhitelist = true
        saveWhitelist($whitelist + str)
      }
      init()
      closeMenu()
    }
    function removeWhitelist (domain) {
      var $whitelist = getWhitelist()
      var str = ',' + domain
      if ($whitelist.indexOf(str) !== -1) {
        inWhitelist = false
        saveWhitelist($whitelist.replace(str, ''))
      }
      init()
      closeMenu()
    }

    $dom.addEventListener('click', function (event) {
      eventFn(event, saveSetting, 'eye-protection-setMenuSave')
    }, false);
    $dom.addEventListener('click', function (event) {
      eventFn(event, reset, 'eye-protection-setMenureset')
    }, false);
    $dom.addEventListener('click', function (event) {
      eventFn(event, closeMenu, 'eye-protection-setMenuClose')
    }, false);
    $dom.addEventListener('change', function (event) {
      eventFn(event, colorChange, 'eye-protection-color-input')
    }, false);
    // 白名单
    $dom.addEventListener('click', function (event) {
      eventFn(event, function () {
        addWhitelist(document.domain)
      }, 'eye-protection-addWhitelist')
    }, false);
    $dom.addEventListener('click', function (event) {
      eventFn(event, function () {
        removeWhitelist(document.domain)
      }, 'eye-protection-removeWhitelist')
    }, false);
  }
  GM_registerMenuCommand(getLang('btn-menu-open'), openMenu); // 设置油猴插件的菜单

  function init () {
    var $whitelist = getWhitelist()
    var domain = document.domain
    var tld = '|.com|.xyz|.net|.top|.tech|.org|.gov|.edu|.ink|.int|.mil|.pub|.cn|.com.cn|.net.cn|.gov.cn|.org.cn|.red|.ink|.biz|.cc|.tv|.info|.name|.pro|.museum|.coop|.aero|.mobi|.travel'
    var arr = domain.split('.')

    var $tld = ''
    var name = ''

    for (let i = arr.length; i > 0; i--) {
      let item = arr[i];
      let _tld = $tld
      if (_tld) {
        _tld = item + '.' + _tld
      } else {
        _tld = '.' + item
      }
      if (tld.indexOf('|' + _tld) !== -1) {
        $tld = _tld
      } else {
        name = arr[i - 1]
        break
      }
    }
    if ($whitelist.indexOf(',' + domain) !== -1 || $whitelist.indexOf(',*.' + name + $tld) !== -1) {
      inWhitelist = true
      $el.style.display = 'none'
      return false
    } else {
      inWhitelist = false
      $el.style.display = 'block'
    }
    document.body.appendChild($el)
  }
  init()
})();