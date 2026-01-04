// ==UserScript==
// @name        Проверить, кто из пользователей Онлайн.
// @name:ru     Проверить, кто из пользователей Онлайн
// @namespace   inner-scripts
// @description get author status from  forum/t1414,1-экскурсия-по-форуму.htm just because most of moders available here
// @description:ru скрипт чист и не содержит бяк, если скрипт вдруг будет грузить машину (зависит от конф.), просто закройте вкладку или откл скрипт в Tampermonkey
// @include     https://www.eldarya.ru/messaging*

// @version     0.0.7
// @author      konstantin55000 kean.dev@gmail.com Milaen


// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377153/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%B8%D1%82%D1%8C%2C%20%D0%BA%D1%82%D0%BE%20%D0%B8%D0%B7%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%20%D0%9E%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377153/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%B8%D1%82%D1%8C%2C%20%D0%BA%D1%82%D0%BE%20%D0%B8%D0%B7%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%20%D0%9E%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD.meta.js
// ==/UserScript==
var usersCount = 0; //  global get all unique added users count
var allUsers = {}; //ids just for count (how much gathered) purpose

//var DEBUG = false;
//if (!DEBUG) {
//    if (!window.console) window.console = {};
//    var methods = ["debug", "warn", "info", "error"];
//    for (var i = 0; i < methods.length; i++) {
//        console[methods[i]] = function () {};
//    }
//}
var main = function () {
    var msgList = document.getElementById('messaging-conversations');


    if (msgList) {



        var fetchMore = true;
        //var results = [];
        //WHEN promise will to end catch next page
        //window.location.href.indexOf('conversation') != -1 ||
        if (window.location.href.indexOf('messaging') == -1) //return if not main msg page
        {
            return;
        }
        // var url = 'https://www.eldarya.ru/forum/t1657,1-дискуссионный-уголок-нытье.htm';
        var catchPage = function (page_id, page) {
            if (window.location.href.indexOf('messaging') == -1) //return if not main msg page
            {
                return;
            }
            var headersObj = new Headers({
                "Content-Type": "text/html",
                "X-Custom-Header": "Clear script. just wanna know, are moderators online? ",
            });

            var initObj = {
                method: 'GET',
                headers: headersObj,
                mode: 'cors',
                cache: 'default'
            };

            var requestObj = new Request(page, initObj);

            fetch(requestObj).then(function (response) {
                return response.text();
            }).then(function (responseThen) {
                //create html from fetchet text
                var fetchedContent = document.createElement('div');
                fetchedContent.innerHTML = responseThen;
                //console.log(fetchedContent);

                var users = {};
                var posts = fetchedContent.querySelectorAll('.forum_post'); //fetch all posts authors
                if (posts.length < 1) {
                    fetchMore = false;
                    return;
                }
                posts.forEach(function (post, index) {
                    var ava = post.querySelectorAll('.author .author_avatar img'); //src a
                    ava = ava[0].src;
                    var name = post.querySelectorAll('.author .author_name a');
                    name = name[0].text;
                    var arr = ava.split('/');
                    var last = arr[arr.length - 1];
                    var id = (last.split('_')[0]);
                    var authors_st = post.querySelectorAll('.author_bottom p');
                    authors_st = authors_st[0].innerText;
                    users[id] = authors_st;

                    if (!allUsers.hasOwnProperty(id)) {
                        allUsers[id] = {
                            st: authors_st,
                            login: name
                        };
                        usersCount++;
                    }

                });

                //console.log('users stats:', users);

                for (var k in users) {

                    if (typeof users[k] !== 'function') {
                        var isOnline = users[k]; //isOnline

                        //console.log('key', k, 'isonline', isOnline);

                        var userMsg = msgList.querySelectorAll('li[data-from="' + k + '"] .messaging-conversation-content .messaging-conversation-date');

                        var aNode = null; //node status to insert
                        //if user has chats with this moderator already
                        if (userMsg && userMsg.length == 1) {
                            aNode = msgList.querySelector('#st-' + k);
                            if (aNode && isOnline == 'Офлайн') {
                                aNode.parentNode.removeChild(aNode);
                                aNode = null;
                            }
                            if (isOnline == 'Онлайн') {
                                //console.log('*', aNode);
                                if (!aNode) {
                                    userMsg[0].insertAdjacentHTML('beforeBegin', '<span id="st-' + k + '" style="color: green; font-size: 200%; position:relative; top: 3px; left:5px;">' + '•' + '</span>');
                                }
                            }

                        }

                    }
                }


            });

        }

   var urls = [
        'https://www.eldarya.ru/forum/t1731,1-итоги-года-орден-элдарии-2018.htm',
  'https://www.eldarya.ru/forum/t1657,1-дискуссионный-уголок-нытье.htm',
            'https://www.eldarya.ru/forum/t102,1-анкета.htm',
           'https://www.eldarya.ru/forum/t1304,1-чем-знаменит-игрок-сверху.htm',
            'https://www.eldarya.ru/forum/t735,1-история-ника.htm',
          'https://www.eldarya.ru/forum/t1697,2-церемония-обмена-подарками-до-31-12-тайный-творческий-санта-2.htm',
            'https://www.eldarya.ru/forum/t1417,1-гастрономический-рай-14.htm',
            'https://www.eldarya.ru/forum/t209,1-я-люблю.htm'



         ];

        var urlsEven = [
     'https://www.eldarya.ru/forum/t1731,1-итоги-года-орден-элдарии-2018.htm',
       'https://www.eldarya.ru/forum/t1708,5-libertatem-14.htm',
            'https://www.eldarya.ru/forum/t1379,2-ярмарка-bbcode.htm',
            'https://www.eldarya.ru/forum/t1748,1-2019-поздравляем-с-новым-годом.htm',
            'https://www.eldarya.ru/forum/t855,1-валькирии-круглого-стола.htm',
            'https://www.eldarya.ru/forum/t1318,1-критика-плюсы-и-минусы.htm',
            'https://www.eldarya.ru/forum/t1526,1-стенд-увлечений.htm',
            'https://www.eldarya.ru/forum/t1328,1-отзывы.htm',
            'https://www.eldarya.ru/forum/t1768,1-ашкор-vs-лейфтан.htm',
'https://www.eldarya.ru/forum/t1203,1-продли.htm',
            'https://www.eldarya.ru/forum/t1676,1-в-нас-похоже.htm',
            'https://www.eldarya.ru/forum/t1657,1-дискуссионный-уголок-нытье.htm',
            'https://www.eldarya.ru/forum/t1405,1-конкурс-пасха-по-элдарийски.htm',
            'https://www.eldarya.ru/forum/t1666,1-страна-навевающая-ужас.htm',
            'https://www.eldarya.ru/forum/t1441,1-7-беседка-под-открытым-небом.htm',
            'https://www.eldarya.ru/forum/t1110,1-трактир-древо-одина.htm',
           'https://www.eldarya.ru/forum/t1210,1-давайте-рисовать-2.htm',
 'https://www.eldarya.ru/forum/t1697,2-церемония-обмена-подарками-до-31-12-тайный-творческий-санта-2.htm',


       ];
        var urlsThird = [
            'https://www.eldarya.ru/forum/t1710,1-люблю-vs-не-люблю.htm',
            'https://www.eldarya.ru/forum/t266,1-известен-ли-тебе-персонаж.htm',
            'https://www.eldarya.ru/forum/t1638,1-правда-или-ложь.htm',

        'https://www.eldarya.ru/forum/t1304,1-чем-знаменит-игрок-сверху.htm',
            'https://www.eldarya.ru/forum/t1662,1-я-бы-взял-у-тебя.htm',
            'https://www.eldarya.ru/forum/t1364,3-999-скрепок.htm',

            'https://www.eldarya.ru/forum/t1008,1-внутренний-рынок-гвардии-теней.htm',
            'https://www.eldarya.ru/forum/t97,3-турнирная-таблица.htm',
            'https://www.eldarya.ru/forum/t1215,1-комната-практик-для-новобранцев.htm',
            'https://www.eldarya.ru/forum/t1307,3-зеркальный-сад.htm',
             'https://www.eldarya.ru/forum/t1079,2-флешмобы-и-мероприятия-абсент-идет-по-проводам.htm',
        'https://www.eldarya.ru/forum/t1745,1-самое-прекрасное-в-игроке-выше.htm'

         ];

        var urlsFourth = [
            'https://www.eldarya.ru/forum/t584,1-вопросы-о-фамильярах.htm',
            'https://www.eldarya.ru/forum/t587,1-банк-мана-и-золотые-монеты.htm',
            'https://www.eldarya.ru/forum/t588,1-вопросы-по-мини-играм-квестам.htm',
            'https://www.eldarya.ru/forum/t585,1-магазины-и-рынок.htm',
            'https://www.eldarya.ru/forum/t810,1-вопросы-по-эпизоду-9.htm',
            'https://www.eldarya.ru/forum/t697,1-вопросы-по-эпизоду-7.htm',
            'https://www.eldarya.ru/forum/t460,1-зал-посвящения.htm',
            'https://www.eldarya.ru/forum/t1744,1-твоя-героиня-напоминает.htm',
            'https://www.eldarya.ru/forum/t1541,1-бан.htm',
            'https://www.eldarya.ru/forum/t1734,1-лотерея-рождественская-стужа.htm',
            'https://www.eldarya.ru/forum/t119,1-ваши-аккаунты-на-других-ресурсах.htm',
            'https://www.eldarya.ru/forum/t1306,1-сны-алхимиков.htm',
             'https://www.eldarya.ru/forum/t1634,1-мрачная-гостиная.htm'
         ];



        setTimeout(function () {
            urls.forEach(function (url, key) {

                var currentUrl = url;
                var chunks = url.split(',');
                var second = (chunks[1]).split('-');
                second.shift();
                var tail = second.join('-');

                var page_id = 1;
                catchPage(page_id, currentUrl);
                setInterval(function () {
                    if (page_id > 20)
                        return;
                    if (!fetchMore)
                        return;
                    page_id++;
                    currentUrl = chunks[0] + ',' + page_id + '-' + tail;
                    //console.log(page_id, 'curentUrl', currentUrl, 'fetchMore', fetchMore);

                    catchPage(page_id, currentUrl);

                }, 6 * 1000); //catch page each 2 seconds

            });
            console.log('users', allUsers);
        }, 6 * 1000);

    } //end if fessage list

}
main();
setInterval(function () {
    main();
}, 110 * 1000); // 3 min 180 * 1000 milsec
