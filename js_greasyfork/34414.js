// ==UserScript==
// @name         AtCoderRatingTweet
// @namespace    AtCoderRatingTweet
// @version      1.0
// @author       Luzhiled
// @description  ja
// @match        http://atcoder.jp/user/*
// @match        https://atcoder.jp/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34414/AtCoderRatingTweet.user.js
// @updateURL https://update.greasyfork.org/scripts/34414/AtCoderRatingTweet.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let contest_name = rating_history[0][3];
  contest_name = contest_name.replace("AtCoder Grand Contest", "AGC");
  contest_name = contest_name.replace("AtCoder Regular Contest", "ARC");
  contest_name = contest_name.replace("AtCoder Biginner Contest", "ABC");

  let latte = rating_history[0][1];
  let izryt = true;
  for (let i = 1; i < rating_history.length; ++i) {
    if (latte <= rating_history[i][1]) {
      izryt = false;
    }
  }

  let previous_rating = rating_history.length > 1 ? rating_history[1][1] : 0;
  let now_rating      = rating_history[0][1];
  let diff = now_rating - previous_rating;
  let sign = (diff >= 0 ? (diff === 0 ? "±" : "+") : "");
  if (previous_rating === 0) previous_rating = "Unrated";

  let tweet_text = `${contest_name} : ${previous_rating} -> ${now_rating} (${sign}${diff}${(izryt ? ", highest!!" : "")})`;

  $('div.col-sm-8 > dl.dl-horizontal').append(`<dt>Tweet</dt><dd><a href="https://twitter.com/share" data-url=" " class="twitter-share-button">Tweet</a><script>!function(d,s,id){let tweet_text = \`${tweet_text}\`;document.getElementsByClassName("twitter-share-button")[0].setAttribute("data-text", tweet_text);let js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script></dd>`);
})();
