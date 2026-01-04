// ==UserScript==
// @name         福利吧徽章设置
// @namespace    https://github.com/CHminggao
// @homepage     https://github.com/CHminggao
// @version      1.1
// @description  为徽章设置展示和隐藏
// @author       GM
// @include      /www.wnflb\d*.com/thread.*.html/
// @include      /www.wnflb\d*.com/forum.php.*/
// @icon         https://icons.duckduckgo.com/ip2/wnflb2023.com.ico
// @require      https://greasyfork.org/scripts/403716-gm-config-cn/code/GM_config_CN.js
// @grant        GM_addStyle
// @run-at       document-end
// @license             GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/520876/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%BE%BD%E7%AB%A0%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/520876/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%BE%BD%E7%AB%A0%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styles=`.hid_md_ctrl{
            display:none;
        }
        .hid_show_md_ctrl{
            display:none;
        }
        .hid_hid_md_ctrl{
            display:none;
        }
        `
    GM_addStyle(styles);

    let user = document.querySelectorAll('.md_ctrl');
    for(let index = 0; index < user.length; index++){
        let db = user[index]
        db.querySelector('a').style.display = 'none'
        let showbut = document.createElement('button');
        showbut.className = '';
        showbut.textContent = '展示徽章'
        showbut.onclick = function(){ show_mdctrl(index)}
        db.appendChild(showbut)
    }

    // Your code here...
})();

function show_mdctrl(index){
  let user = document.querySelectorAll('.md_ctrl')[index];
  user.querySelector('button').textContent='隐藏徽章'
  user.querySelector('button').onclick=function(){ hid_mdctrl(index)}
  user.querySelector('a').style.display = 'block'
}

function hid_mdctrl(index){
  let user = document.querySelectorAll('.md_ctrl')[index];
  user.querySelector('button').textContent='展示徽章'
  user.querySelector('button').onclick=function(){ show_mdctrl(index)}
  user.querySelector('a').style.display = 'none'
}