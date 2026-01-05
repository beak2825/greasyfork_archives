// ==UserScript==
// @name        コイツにﾌﾞﾁﾐる
// @namespace   li.butimi.tweet.reply
// @include     https://twitter.com/*
// @version     2
// @grant       none
// @description:ja うおおおおおおおおおおおおあああああああああああああああああああああああああああああああ！！！！！！！！！！！ (ﾌﾞﾘﾌﾞﾘﾌﾞﾘﾌﾞﾘｭﾘｭﾘｭﾘｭﾘｭﾘｭ！！！！！！ﾌﾞﾂﾁﾁﾌﾞﾌﾞﾌﾞﾁﾁﾁﾁﾌﾞﾘﾘｲﾘﾌﾞﾌﾞﾌﾞﾌﾞｩｩｩｩｯｯｯ！！！！！！！)
// @description うおおおおおおおおおおおおあああああああああああああああああああああああああああああああ！！！！！！！！！！！ (ﾌﾞﾘﾌﾞﾘﾌﾞﾘﾌﾞﾘｭﾘｭﾘｭﾘｭﾘｭﾘｭ！！！！！！ﾌﾞﾂﾁﾁﾌﾞﾌﾞﾌﾞﾁﾁﾁﾁﾌﾞﾘﾘｲﾘﾌﾞﾌﾞﾌﾞﾌﾞｩｩｩｩｯｯｯ！！！！！！！)
// @downloadURL https://update.greasyfork.org/scripts/14070/%E3%82%B3%E3%82%A4%E3%83%84%E3%81%AB%EF%BE%8C%EF%BE%9E%EF%BE%81%EF%BE%90%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/14070/%E3%82%B3%E3%82%A4%E3%83%84%E3%81%AB%EF%BE%8C%EF%BE%9E%EF%BE%81%EF%BE%90%E3%82%8B.meta.js
// ==/UserScript==

(() => {
  const screenName = document.getElementsByClassName('u-linkComplex-target')[0].innerHTML;
  const twitterName = document.getElementsByClassName('ProfileHeaderCard-nameLink')[0].innerHTML;

  const butimiriButtonWrapper = document.createElement('div');
  butimiriButtonWrapper.setAttribute('class', 'ProfileMessagingActions-buttonWrapper');

  const butimiriButton = document.createElement('a');
  butimiriButton.setAttribute('class', 'u-sizeFull js-tooltip EdgeButton EdgeButton--primary u-textTruncate');
  butimiriButton.setAttribute('style', 'font-size:1.5rem;line-height:1.2rem;');
  butimiriButton.setAttribute('data-dialog-title', twitterName + 'さんにﾌﾞﾁﾐる');
  butimiriButton.setAttribute('data-original-title', twitterName + 'さんにﾌﾞﾁﾐる');
  butimiriButton.href = 'http://tweet.butimi.li/' + screenName;
  butimiriButton.innerHTML = '?';

  butimiriButtonWrapper.appendChild(butimiriButton);

  const buttonContainer = document.getElementsByClassName('ProfileMessagingActions-actionsContainer')[0];
  buttonContainer.appendChild(butimiriButtonWrapper);
})();

