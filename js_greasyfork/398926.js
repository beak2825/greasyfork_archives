// ==UserScript==
// @name         Mojim De-cancer
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  lmao
// @author       Hengyu
// @match        *://mojim.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398926/Mojim%20De-cancer.user.js
// @updateURL https://update.greasyfork.org/scripts/398926/Mojim%20De-cancer.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    var elem = document.getElementById("fsZx3");
    elem.innerHTML = elem.innerHTML.replace('更多更詳盡歌詞 在 <a href="http://mojim.com">※ Mojim.com　魔鏡歌詞網 </a><br>', '');
    elem.innerHTML = elem.innerHTML.replace('更多更详尽歌词 在 <a href="http://mojim.com">※ Mojim.com　魔镜歌词网 </a><br>', '');
    

})();