// ==UserScript==
// @name         文字化けcoder
// @namespace    http://tampermonkey.net/
// @version      1
// @description  atcoderの問題文がたまに文字化けします。縛りプレイ用。
// @author       @neet1737984
// @license      MIT
// @match        https://atcoder.jp/*_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485969/%E6%96%87%E5%AD%97%E5%8C%96%E3%81%91coder.user.js
// @updateURL https://update.greasyfork.org/scripts/485969/%E6%96%87%E5%AD%97%E5%8C%96%E3%81%91coder.meta.js
// ==/UserScript==

const bakemozi = "蜀?捉荳翫蛟九?轤ｹ縺檎ｭ蛾俣髫斐荳ｦ繧薙〒縺翫縲縲繧狗縺九縺ｦ譎ｨ縺ｾ縺ｧ縺ｮ逡ｪ蜿ｷ縺御ｻ倥￠繧峨蠑ｦ縺ｩ縺?＠縺ｮ莠､轤ｹ縺悟ｭ伜惠縺吶ｋ縺?°蛻､螳壹＠縺ｦ縺上□縺輔＞縲縺ｦ縺?∪縺吶?�����������";

const jatch = /^[\p{scx=Hiragana}\p{scx=Katakana}\p{scx=Han}]+$/u;

const CORRUPTION_P = 0.2;

(function() {
    'use strict';

    // Your code here...
    let content = document.querySelectorAll('div.col-sm-12');
    if(content.length==2){
        let elements = content[1].querySelectorAll('p,h3,li');
        elements.forEach(element => {
            element.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    let s = child.textContent;
                    let t = ""
                    for (var i = 0; i < s.length; ++i) {
                        if(jatch.test(s[i]) && Math.random()<CORRUPTION_P){
                            t += bakemozi[Math.floor(Math.random()*bakemozi.length)];
                        }
                        else{
                            t += s[i];
                        }
                    }
                    child.textContent = t;
                }
            });
        });
    }
})();