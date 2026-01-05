// ==UserScript==
// @name        Extract images for Twitter
// @name:ja     Extract images for Twitter
// @namespace   https://greasyfork.org/ja/users/24052-granony
// @description Adds a button that opens all attached images as original size to every tweet.
// @description:ja 各ツィートに，添付されている画像をオリジナルのサイズで開くためのボタンを追加します．
// @include     https://twitter.com/*
// @author      granony
// @version     2.0.1
// @grant       none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/15271/Extract%20images%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/15271/Extract%20images%20for%20Twitter.meta.js
// ==/UserScript==
(function () {  
  var processedLists = new WeakMap();
  
  // ボタンの作成
  var createButton = function (list) {
    var images = list.parentNode.parentNode.getElementsByClassName('AdaptiveMedia-photoContainer');
    var button = document.createElement('div');
    button.setAttribute('class', 'ProfileTweet-action js-toggleState ProfileTweet-action--ExtractImages');
    button.innerHTML = '<button class="ProfileTweet-actionButton js-actionButton" type="button">'+
    '<div class="IconContainer js-tooltip" title="Extract Images">'+
    '<span class="Icon Icon--photo"></span>'+
    '</div>'+
    '</button>';
    button.addEventListener('click', function () {
      for (var j = 0; j < images.length; j++) {
        var url = images[j].getAttribute('data-image-url') + ':orig';
        window.open(url);
      }
    });
    button.addEventListener('mouseenter',function(){
      if(images.length<1){
        return;
      }
      var icon = button.getElementsByClassName("Icon")[0];
      icon.style.color = "rgb(47,194,239)";
    })
    button.addEventListener('mouseleave',function(){
      var icon = button.getElementsByClassName("Icon")[0];
      icon.style.color = "rgb(170,184,194)";
    })
    return button;
  };
  
  // 新規に出現したtweetsに対してボタンを追加
  var addButtons = function () {
    var lists = document.getElementsByClassName('ProfileTweet-actionList');
    for (var i = 0; i < lists.length; i++) {
      var list = lists[i];
      if (processedLists.has(list)) {
        continue;
      } else {
        // なぜか画面遷移前のボタンが残ることがあるので，暫定的に対処
        var oldButton = list.getElementsByClassName("ProfileTweet-action--ExtractImages")[0];
        if(oldButton){
          oldButton.parentNode.removeChild(oldButton);
        }
        // 実際に登録
        processedLists.set(list, 1);
        var button = createButton(list);
        list.appendChild(button);
      }
    }
  };
  
  // ツィートの表示件数が増えた場合
  (function () {
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
        addButtons();
        DOMObserver.observe(document.body, DOMObserverConfig);
      }, 100);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);
  }) ();
  
  // 初回実行
  addButtons();
}) ();
