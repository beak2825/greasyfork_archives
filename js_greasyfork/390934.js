// ==UserScript==
// @name         RFFT: Twitter Remove Follower's Follower's Tweet
// @name:ja      RFFT: Twitter Remove Follower's Follower's Tweet
// @namespace    https://greasyfork.org/ja/users/166153-hac
// @version      1.0.2
// @description  Remove follower's follower tweet from Twitter timeline. Optionally this script can apply style to promotions, follower's retweets and follower's likes in your timeline.
// @description:ja Twitterのフォロワーのフォロワーのツイートをタイムラインから抹消します。オプションとして、プロモーション・フォロワーのリツイート・フォロワーのいいね にスタイルを適用することが出来ます。
// @author       HAC
// @match        https://twitter.com/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/390934/RFFT%3A%20Twitter%20Remove%20Follower%27s%20Follower%27s%20Tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/390934/RFFT%3A%20Twitter%20Remove%20Follower%27s%20Follower%27s%20Tweet.meta.js
// ==/UserScript==

const userstyle = `
.RFFT-retweet {/*background: skyblue;*/}
.RFFT-like {/*background: yellow;*/}
.RFFT-fft {/*background: red;*/ display: none;}
.RFFT-promotion {/*background: orange;*/}
`;

const excludeUrlPatterns = [/^https:\/\/twitter.com\/notifications/];

(function() {
  'use strict';
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = userstyle;
  head.appendChild(style);

  const observer = new MutationObserver(records => {
    const url = window.location.href;
    if(excludeUrlPatterns.some(pattern => pattern.test(url))) return;
    const tweetContainers = Array.from(document.querySelectorAll('div[aria-label^="タイムライン"] > div > div > div, div[aria-label^="Timeline"] > div > div > div'));
    tweetContainers
      .filter(tweetContainer => tweetContainer.querySelector('article > div > div:first-child path[d="M23.615 15.477c-.47-.47-1.23-.47-1.697 0l-1.326 1.326V7.4c0-2.178-1.772-3.95-3.95-3.95h-5.2c-.663 0-1.2.538-1.2 1.2s.537 1.2 1.2 1.2h5.2c.854 0 1.55.695 1.55 1.55v9.403l-1.326-1.326c-.47-.47-1.23-.47-1.697 0s-.47 1.23 0 1.697l3.374 3.375c.234.233.542.35.85.35s.613-.116.848-.35l3.375-3.376c.467-.47.467-1.23-.002-1.697zM12.562 18.5h-5.2c-.854 0-1.55-.695-1.55-1.55V7.547l1.326 1.326c.234.235.542.352.848.352s.614-.117.85-.352c.468-.47.468-1.23 0-1.697L5.46 3.8c-.47-.468-1.23-.468-1.697 0L.388 7.177c-.47.47-.47 1.23 0 1.697s1.23.47 1.697 0L3.41 7.547v9.403c0 2.178 1.773 3.95 3.95 3.95h5.2c.664 0 1.2-.538 1.2-1.2s-.535-1.2-1.198-1.2z"]'))
      .forEach(tweetContainer => tweetContainer.classList.add('RFFT-retweet'));
    tweetContainers
      .filter(tweetContainer => tweetContainer.querySelector('article > div > div:first-child path[d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"]'))
      .forEach(tweetContainer => tweetContainer.classList.add('RFFT-like'));
    tweetContainers
      .filter(tweetContainer => tweetContainer.querySelector('article > div > div:first-child path[d="M12.225 12.165c-1.356 0-2.872-.15-3.84-1.256-.814-.93-1.077-2.368-.805-4.392.38-2.826 2.116-4.513 4.646-4.513s4.267 1.687 4.646 4.513c.272 2.024.008 3.46-.806 4.392-.97 1.106-2.485 1.255-3.84 1.255zm5.849 9.85H6.376c-.663 0-1.25-.28-1.65-.786-.422-.534-.576-1.27-.41-1.968.834-3.53 4.086-5.997 7.908-5.997s7.074 2.466 7.91 5.997c.164.698.01 1.434-.412 1.967-.4.505-.985.785-1.648.785z"]'))
      .forEach(tweetContainer => tweetContainer.classList.add('RFFT-fft'));
    tweetContainers
      .filter(tweetContainer => tweetContainer.querySelector('article > div > div > div > div:last-child path[d="M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.393-.875-.876V9.967l-7.547 7.546c-.17.17-.395.256-.62.256s-.447-.086-.618-.257c-.342-.342-.342-.896 0-1.237l7.547-7.547h-3.54c-.482 0-.874-.393-.874-.876s.392-.875.875-.875h5.65c.483 0 .875.39.875.874v5.65z"]'))
      .forEach(tweetContainer => tweetContainer.classList.add('RFFT-promotion'));
  });

  const target = document.getElementById('react-root');
  const option = {
    childList: true,
    subtree: true
  };
  observer.observe(target, option);
})();
