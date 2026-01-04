// ==UserScript==
// @name         点击鉴赏家
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/curator/33625352/
// @match        https://store.steampowered.com/curator/33741419/
// @match        https://store.steampowered.com/curator/33719948/
// @match        https://store.steampowered.com/curator/33217084/
// @match        https://store.steampowered.com/curator/33976504/
// @match        https://store.steampowered.com/curator/33626600/
// @match        https://store.steampowered.com/curator/33626473/
// @match        https://store.steampowered.com/curator/29426545/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375738/%E7%82%B9%E5%87%BB%E9%89%B4%E8%B5%8F%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/375738/%E7%82%B9%E5%87%BB%E9%89%B4%E8%B5%8F%E5%AE%B6.meta.js
// ==/UserScript==
(function() {
    var bk1 = 0;
    var jsq = setInterval(function dianji(){
        FollowCurator( 33625352, true );
        FollowCurator( 33741419, true );
        FollowCurator( 33719948, true );
        FollowCurator( 33217084, true );
        FollowCurator( 33976504, true );
        FollowCurator( 33626600, true );
        FollowCurator( 33626473, true );
        FollowCurator( 29426545, true );
        bk1++;
        if (bk1 >= 3){
            console.log('大于30秒，关闭计时器')
            clearInterval(jsq)}
    },10000);//定时
}
)();