// ==UserScript==
// @license MIT
// @name         POE自动续期cookie
// @namespace    http://tampermonkey.net/
// @version      2024.8.10
// @description  自动续期cookie，使网页端，易刷，apt等工具保持登陆状态，by：放课后
// @author       放课后
// @match        https://poe.game.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/492649/POE%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%9C%9Fcookie.user.js
// @updateURL https://update.greasyfork.org/scripts/492649/POE%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%9C%9Fcookie.meta.js
// ==/UserScript==

(function() {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expires = nextYear.toUTCString();
    const cookieValues = document.cookie.match(`(^|;)\\s*p_uin\\s*=\\s*([^;]+)`);
    const cookieValue = cookieValues ? cookieValues.pop() : '';
    if(cookieValue){
        document.cookie = `p_uin=${cookieValue}; expires=${expires}; path=/`;
    }

    if(window.location.href.indexOf("login") > -1){
        if(cookieValue || document.body.innerText.indexOf("发生了一个错误") > -1){
            clearAllCookies()
            let last = GM_getValue('last') ? GM_getValue('last') : 0
            if(document.body.innerText.indexOf("登录失败，请点击") < 0 && (last + 10 * 1000) < new Date().getTime()){
                GM_setValue('last',new Date().getTime())
                window.location.href = 'https://poe.game.qq.com/login'
            }
        }
    }

    function clearAllCookies() {
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + location.hostname;
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + location.hostname;
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + (new URL(location.href).hostname);
            const name1 = 'poe.qq.com'
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + name1;
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + name1;

            const name2 = 'qq.com'
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + name2;
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + name2;

            const name3 = 'game.qq.com'
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + name3;
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + name3;
        }
    }
})();