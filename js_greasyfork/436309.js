// ==UserScript==
// @name         NicoNico Search Plus
// @namespace　　https://tanbatu.github.io/
// @version      0.1
// @description  ニコ動検索カスタム
// @author       You
// @match        https://www.nicovideo.jp/tag/*
// @match        https://www.nicovideo.jp/search/*
// @icon         https://www.google.com/s2/favicons?domain=nicovideo.jp
// @license      tanbatu
// @grant        none
// @namespace https://greasyfork.org/users/663478
// @downloadURL https://update.greasyfork.org/scripts/436309/NicoNico%20Search%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/436309/NicoNico%20Search%20Plus.meta.js
// ==/UserScript==

let url = location.href
let new_url = url.replace(/\?.*$/,"");

let getbutton = document.getElementsByClassName('hidden')[0]
getbutton.insertAdjacentHTML('afterend',`
<div class="autoPlay" style="background-color:#dcdcdc;border-radius:10px;">
            <p class="switchingBtn">人気順</p>
			<p class="switchingBtn">視聴回数</p>
            <p class="switchingBtn">投稿日</p>
</div>
`)

let btn = document.getElementsByClassName('switchingBtn')
btn[2].addEventListener("click", function() {
  location.href=new_url+"?sort=h&order=d"
});
btn[3].addEventListener("click", function() {
  location.href=new_url+"?sort=v&order=d"
});
btn[4].addEventListener("click", function() {
  location.href=new_url+"?sort=f&order=d"
});