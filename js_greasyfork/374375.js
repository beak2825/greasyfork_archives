// ==UserScript==
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAnqGX/Kali/ymoY/8nqGP/Jqhh/yepYv8nqGP/J6hj/yinYv8jp2T/J6li/yeoY/8pp2X/J6hl/yeoY/8nqWL/J6hl/yanYv8mqWb/Jqdk/yuoYv8mpmX/J6hj/yepYv8op2L/J6hj/yeoY/8op2L/Jqpj/yapYP8pqWL/J6hj/ymoY/8mp2L/J6li/yeoZf8pqGP/Kali/ymoY/8mp2T/J6hj/yeoY/8mp2L/KKlm/yinYv8lp2j/Jqdi/ymnZf8op2L/K6hi/yWpY/8mp2T/J6li/////v///v///f/////////9/////////////////////////////v8nqGP/J6li/yeoY/8mp2L/J6hj/yeoY//9//7///7+///+/////////f/////////9///////+//////////7/J6li/yeoZf8lp2b/Jqpk/yaoYf8nqGX/KKdi/yanYv8pqWH/JKdk/yeqYf8pqGP/J6hl/yaoYf/8/v7//////ympYv8pqWL/KKhg/yinYv8qqmP/Jqdk/ymoY/8pqWL/Jalj/yioYf8lqGX/KKdi/yepYv8lqWP/+/////3///8lqWP/J6hl//////////7/KKdi/yepYv8kp2T/Jqdk/yeoY/8lqWL/Jqdi/yeoY/8pqGP/Jahl////////////KKdi/yinYv///////////yWoZf8pqGP/J6hj/yanYv8lqWL/J6hj/yanZP8kp2T/J6li/yinYv////7//////yeoZf8lqWP//f////v///8lqWP/J6li/yinYv8lqGX/KKhh/yWpY/8pqWL/Kahj/yanZP8qqmP/KKdi/yioYP8pqWL/Kali///////8/v7/Jqhh/yeoZf8pqGP/J6ph/ySnZP8pqWH/Jqdi/yinYv8nqGX/Jqhh/yaqZP8lp2b/J6hl/yepYv////7//////////v/9//////////3///////////7////+/v/9//7/J6hj/yeoY/8mp2L/J6hj/yepYv8nqGP////+///////////////////////9//////////3//////v/////+/yepYv8mp2T/Jalj/yuoYv8op2L/Kadl/yanYv8lp2j/KKdi/yipZv8mp2L/J6hj/yeoY/8mp2T/Kahj/ympYv8pqGP/J6hl/yepYv8mp2L/Kahj/yeoY/8pqWL/Jqlg/yaqY/8op2L/J6hj/yeoY/8op2L/J6li/yeoY/8mpmX/K6hi/yanZP8mqWb/Jqdi/yeoZf8nqWL/J6hj/yeoZf8pp2X/J6hj/yepYv8jp2T/KKdi/yeoY/8nqGP/J6li/yaoYf8nqGP/Kahj/ympYv8nqGX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @name         看准网免登陆看详情（改）
// @namespace    https://www.kanzhun.com/
// @version      0.2
// @description  免登陆看完整点评、面试、问答
// @author       axel 10 && greendev（改）
// @match        https://www.kanzhun.com/*.html*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/374375/%E7%9C%8B%E5%87%86%E7%BD%91%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E8%AF%A6%E6%83%85%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/374375/%E7%9C%8B%E5%87%86%E7%BD%91%E5%85%8D%E7%99%BB%E9%99%86%E7%9C%8B%E8%AF%A6%E6%83%85%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.search.startsWith("?ka=")){
        var form = document.createElement('form');
        var meta = document.createElement('meta');
        meta.name = "referrer";
        meta.content = "no-referrer";
        document.getElementsByTagName('head')[0].appendChild(meta);

        form.id = 'my_form';
        form.method = 'get';
        form.action = "https://" + location.host + location.pathname;
        form.innerHTML = '<input type="submit" value="submit" id="my_submit" style="display:none">'

        document.body.appendChild(form);
        const e = document.createEvent('MouseEvents')
        e.initEvent('click', true, true)
        const el = document.querySelector('#my_submit')
        el.dispatchEvent(e)
    }
})();