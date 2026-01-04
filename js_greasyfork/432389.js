// ==UserScript==
// @name post_message
// @description Отправка сообщений
// @version 1.0.0
// @include https://www.heroeswm.ru/forum_messages.php?tid=2035569&page=*
// @namespace https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/432389/post_message.user.js
// @updateURL https://update.greasyfork.org/scripts/432389/post_message.meta.js
// ==/UserScript==

(function() {
    var page = '';
    var xhr = new XMLHttpRequest();
    var url = "https://www.heroeswm.ru/forum_messages.php?tid=2035569&page=49999";

    setInterval(() => {

        xhr.open('GET', url);
        xhr.send();
        xhr.onload = function() {
            if (xhr.status != 200) {
                    //console.log(xhr.status);
            } else {
                page = xhr.responseText;
                if (page.indexOf("class=pi>999999</a>") != "-1") {
                    document.getElementsByName("newmsg")[0].submit();
                    //console.log("1");
                } else {
                    console.log("0");
                }
            }
        }
    }, 400);
})();