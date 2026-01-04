// ==UserScript==
// @name        tv.cctv.com_auto_720p
// @name:zh-CN        tv.cctv.com_auto_720p
// @namespace   tv.cctv.com_auto_720p
// @supportURL  https://github.com/zhuzemin
// @description tv.cctv.com auto set 720p and max volume
// @description:zh-CN tv.cctv.com auto set 720p and max volume
// @include     https://tv.cctv.com/live/*
// @version     1.0
// @run-at      document-end
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/419383/tvcctvcom_auto_720p.user.js
// @updateURL https://update.greasyfork.org/scripts/419383/tvcctvcom_auto_720p.meta.js
// ==/UserScript==


var config = {
    'debug': false,
}
var debug = config.debug ? console.log.bind(console)  : function () {
};
let interval=setInterval(function(){
    let elem=document.querySelector('#resolution_item_720_player');
    debug('elem: '+elem);
    if(elem!=null){
        elem.click();
        let btn=document.querySelector('#player_sound_btn_player');
        btn.setAttribute('volume',100);
        btn.click();
        btn.click();
        btn.click();
        clearInterval(interval);
    }
}, 1000);