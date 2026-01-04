// ==UserScript==
// @name         SonkwoRedeem 杉果自动提取key脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  shows how to use babel compiler
// @author       Everain
// @website      https://everain.me
// @match        https://www.sonkwo.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/33637/SonkwoRedeem%20%E6%9D%89%E6%9E%9C%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96key%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/33637/SonkwoRedeem%20%E6%9D%89%E6%9E%9C%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96key%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var account = localStorage.getItem('account') || prompt('请输入账号', '');
var password = localStorage.getItem('password') || prompt('请输入密码', ''); console.log('0');

localStorage.setItem('account', account);
localStorage.setItem('password', password);

var $saleBlock = $('.game-actions .sale-block');
if (!$saleBlock || $saleBlock.text() !== '已拥有') return;

$.post('/oauth2/token.json', {
    'grant_type': 'password',
    'login_name': account,
    'password': password,
    'type': 'client'
}).then(res => {

    var {
        access_token
    } = res;
    var game_id = location.search.substr(1).split('=')[1]; console.log('1');

    $.ajax(`/api/game_key.json?game_id=${game_id}&access_token=${access_token}`).then(res => {
        var [{
            code,
            type_desc
        }] = res.game_keys;

        var platform = type_desc.substr(0, 5).toLowerCase(); console.log('2');
        $saleBlock.text(`${platform === 'steam' ? platform : '其它平台'}: ${code}`);
    });
});