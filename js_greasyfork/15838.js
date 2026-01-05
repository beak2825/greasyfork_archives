// ==UserScript==
// @name        Clear Button For Almost Every Text Input Field
// @name:ja     Clear Button For Almost Every Text Input Field
// @namespace   https://greasyfork.org/ja/users/24052-granony
// @description Adds clear button for almost every <input type="text">, like ms-clear.
// @description:ja ほぼすべての<input type="text">に対して ms-clear のようなクリアボタンを追加します．
// @include     http://*
// @include     https://*
// @version     1.0.0
// @grant       none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/15838/Clear%20Button%20For%20Almost%20Every%20Text%20Input%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/15838/Clear%20Button%20For%20Almost%20Every%20Text%20Input%20Field.meta.js
// ==/UserScript==
/*
  = Detailed Description (Japanese) =
  このスクリプトはほとんどのサイトのテキストフィールドに対してレイアウトを崩
  すことなしに ms-clear のようなクリアボタンを追加します．クリアボタンはテキ
  ストフィールドにマウスカーソルがある場合のみ，フィールド内部の右側
  （text-align=="right"の場合は左側）に表示されます．クリアボタンの表示される
  位置にサイトが送信ボタンなどの要素を配置している場合 (たとえば Twitter の検
  索フォーム) には動作しません．

  = Detailed Description (English) =
  This script adds clear button for almost evey text-field in web site 
  without breaking its layout, like ms-clear. The clear button is 
  displayed on the right side (or left side if text-align=="right") of
  the inside of the field when the mouse cursor is over the field. The
  clear button does not work if the web site puts some elements (such as
  submit button) on the clear button's place (e.g. search form in Twitter).
*/
(function () {
  'use strict';
  var wmap = new WeakMap(); // text-field と button の対応
  var textFields = [];
  
  // ウィンドウの左上を基準とした要素の位置を得る
  var getOffset = function (elem) {
    var rect = elem.getBoundingClientRect();
    var positionX = rect.left;
    var positionY = rect.top;
    var scrollX = document.body.scrollLeft;
    var scrollY = document.body.scrollTop;
    return {
      x: positionX + scrollX,
      y: positionY + scrollY
    };
  }
  
  // ボタンを作成する
  var createButton = function (textField) {
    var button = document.createElement('div');
    button.innerHTML = '<span style="position:relative; font-family: Arial, sans-serif">x</span>';
    textField.parentNode.insertBefore(button, textField.nextSibling);
    (function () {
      var bs = button.style;
      button.addEventListener('click', function () {
        textField.value = '';
      });
      textField.addEventListener('mouseenter', function () {
        bs.display = 'inline-block';
      });
      button.addEventListener('mouseenter', function () {
        bs.display = 'inline-block';
      });
      textField.addEventListener('mouseleave', function () {
        bs.display = 'none';
      });
      button.addEventListener('mouseleave', function () {
        bs.display = 'none';
      });
    })();
    return button;
  }
  
  // ボタンの位置とサイズを更新する
  var updateButton = function (textField) {
    var button = wmap.get(textField);
    var th = textField.clientHeight;
    var tw = textField.clientWidth;
    var size = th * 0.7;
    var innerShift = size * 0.1;
    var ts = textField.style;
    var tsp = ts.position? ts.position.toLowerCase(): '';
    var innerText = button.getElementsByTagName('span') [0];
    innerText.style.top = - innerShift + 'px';
    var bs = button.style;
    var bsOriginalDisplay = bs.display;
    
    bs.display = 'inline-block';
    bs.textAlign = 'center';
    bs.borderRadius = '50%';
    bs.fontSize = size + 'px';
    bs.width = size + 'px';
    bs.height = size + 'px';
    bs.lineHeight = size + 'px';
    bs.padding = '0';
    bs.margin = '0';
    bs.cursor = 'pointer';
    bs.color = '#AAAAAA';
    bs.backgroundColor = '#DDDDDD';
    bs.position = (tsp == 'fixed') ? 'fixed' : 'absolute';
    bs.top = 0;
    bs.bottom = 0;
    bs.left = 0;
    bs.right = 0;
    bs.zIndex = ts.zIndex ? ts.zIndex : "auto";
    var tOffset = getOffset(textField);
    var bOffset = getOffset(button);
    bs.top = (tOffset.y - bOffset.y) + th * 0.15 + 'px';
    
    if(getComputedStyle(textField).textAlign=='right'){
      bs.left = (tOffset.x - bOffset.x)      + size * 0.1 + 'px';
    }else{
      bs.left = (tOffset.x - bOffset.x) + tw - size * 1.1 + 'px';
    }
    if (bsOriginalDisplay != 'inline-block') {
      bs.display = 'none';
    }
    
    return button;
  }
  
  // ボタンの登録
  // onload 時と DOM の変化が検出されるたびに実行される
  var registerButtons = function () {
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var iType = input.getAttribute('type')==null?"text":input.getAttribute('type').toLowerCase();
      console.log(input.getAttribute('id'), input.getAttribute('type'), iType);
      if (iType!='text' && iType!='search') {
        continue;
      }
      if (wmap.has(input)) {
        continue;
      }
      if (getComputedStyle(input).display == 'none') {
        continue;
      }
      
      textFields.push(input);
      var button = createButton(input);
      wmap.set(input, button);
      updateButton(input);
    }
    return;
  }
  
  // 全ボタンの位置とサイズを更新
  var updateAllButtons = function () {
    for (var i = 0; i < textFields.length; i++) {
      updateButton(textFields[i]);
    }
  }
  
  // DOM の構築時にボタンを登録
  registerButtons();
  
  // Load 完了時にボタンの位置を更新
  window.addEventListener('load', updateAllButtons);

  // ウィンドウサイズが変化した場合はボタンの位置だけ更新する
  (function(){
    var resizeTimer = false;
    window.addEventListener('resize', function () {
      if (resizeTimer !== false) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function () {
        updateAllButtons();
      }, 100);
    });
  })();
  
  // DOM の変化時には追加された text-field にボタンを登録し，
  // 全てのボタンの位置を更新する
  (function(){
    var DOMObserverTimer = false;
    var DOMObserverConfig = {
      attributes: true,
      childList: true,
      subtree: true
    };
    var DOMObserver = new MutationObserver(function () {
      if (DOMObserverTimer !== 'false') {
        clearTimeout(DOMObserverTimer);
      }
      DOMObserverTimer = setTimeout(function () {
        DOMObserver.disconnect();
        registerButtons();
        updateAllButtons();
        DOMObserver.observe(document.body, DOMObserverConfig);
      }, 100);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);
  })();
  
}) ();
