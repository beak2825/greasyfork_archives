// ==UserScript==
// @name         sm for Web User Agent Switcher
// @namespace    http://www.codysnintendoroom.co.vu
// @version      1.1
// @description  Change the User Agent on Skype for Web to enable Video/Voice Calling on Linux or any other OS that doesn't support it! :)
// @icon         https://az663213.vo.msecnd.net/0-210-0/images/favicon.ico
// @author       zivee
// @match        http://*.sm.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35119/sm%20for%20Web%20User%20Agent%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/35119/sm%20for%20Web%20User%20Agent%20Switcher.meta.js
// ==/UserScript==

navigator.__defineGetter__('userAgent', function(){

    return '	Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';

});