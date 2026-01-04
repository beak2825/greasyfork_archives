// ==UserScript==
// @name         HWM_replace_links_to_current_mirror
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  Все ссылки на другие зеркала игры HWM заменяет на ссылки к my.lordswm.com
// @author       Zeleax
// @include      /https:\/\/(www.heroeswm.ru|www.lordswm.com|my.lordswm.com|daily.heroeswm.ru)\/.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441769/HWM_replace_links_to_current_mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/441769/HWM_replace_links_to_current_mirror.meta.js
// ==/UserScript==

(function() {
    var cur_hostname= location.hostname;

    var arr_hosts=['www.heroeswm.ru','my.lordswm.com','www.lordswm.com'].filter(function(o){ // сайты в ссылках для замены на текущее зеркало
        return o !== cur_hostname
    });
    var i, list;

    list = getL('//a[contains(@href,"//") and not(contains(@href,"'+cur_hostname+'"))]');

    var sethost= /daily.heroeswm.ru/.test(cur_hostname) ? 'my.lordswm.com' : cur_hostname;

    for (i=0; i<list.snapshotLength; i++){
        for(var j=0; j<arr_hosts.length; j++){
            list.snapshotItem(i).href= list.snapshotItem(i).href.replace(arr_hosts[j], sethost);
        }
    }

    // заменяем картинки и ссылки
    if(/lordswm/.test(cur_hostname) || /daily.heroeswm.ru/.test(cur_hostname)){
        list = getL('//img[contains(@src,"heroeswm.ru")]');
        for(i=0; i<list.snapshotLength; i++){
            list.snapshotItem(i).src=list.snapshotItem(i).src.replace(/dcdn.?.heroeswm.ru/,'cfcdn.lordswm.com');
        }

        list = getL('//a[contains(@href,"heroeswm.ru")]');
        for(i=0; i<list.snapshotLength; i++){
            list.snapshotItem(i).href=list.snapshotItem(i).href.replace(/dcdn.?.heroeswm.ru/,'cfcdn.lordswm.com');
        }
    }
})();

function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}