// ==UserScript==
// @name        AddTweetButtonToCustomTest
// @namespace   https://greasyfork.org/ja/scripts/369839-addtweetbuttontocustomtest
// @version     1.0.1
// @description コードテストにツイートボタンを追加します
// @author      keymoon
// @license     MIT
// @homepage    https://greasyfork.org/ja/scripts/369839-addtweetbuttontocustomtest
// @supportURL  https://twitter.com/kymn_
// @match       https://beta.atcoder.jp/contests/*/custom_test
// @match       https://*.contest.atcoder.jp/custom_test
// @downloadURL https://update.greasyfork.org/scripts/369839/AddTweetButtonToCustomTest.user.js
// @updateURL https://update.greasyfork.org/scripts/369839/AddTweetButtonToCustomTest.meta.js
// ==/UserScript==

(function () {
var outputElem = getOutputElem();
console.log(outputElem)

var tweetStr = trimForTweet(outputElem.text())

var tweetScript =
`<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>`;
var tweetBtn = 
`<a href="https://twitter.com/intent/tweet?text=${tweetStr}" class="btn btn-default col-xs-offset-8 col-xs-4" rel="nofollow" onclick="window.open(encodeURI(decodeURI(this.href)),'twwindow','width=550, height=450, personalbar=0, toolbar=0, scrollbars=1'); return false;">ツイート</a>`;
outputElem.after(tweetScript)
outputElem.after(tweetBtn)

function getOutputElem() {
    return $(isBeta() ? '#stdout' : 'textarea[name="output"]');
    function isBeta() {
        return location.href.split("//")[1].substr(0,4) === "beta";
    }
}

function trimForTweet(str) {
    var tweetStr = "";
    var count = 0;
    Array.prototype.forEach.call(str, 
    function(c) {
        if(isHalf(c)) count += 1;
        else count += 2;
        if (count <= 280) tweetStr += c;
        function isHalf(c){
            if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) ||
                    (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                return true;
            }
        }
    });
    return encodeURI(tweetStr);
}
})();