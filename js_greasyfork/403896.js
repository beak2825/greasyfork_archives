// ==UserScript==
// @name         本地黑名单-哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  我的地盘，我做主！
// @author       lavaf
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/all?keyword*
// @match        https://message.bilibili.com/#/reply
// @grant        none
// @require         https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/403896/%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/403896/%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let blackList = ['5942248', '38257770', '1715577', '95414253', '11374267', '192534943', '80004783', '129872455',
        '14753117', '345938075', '270020512', '15884281', '299728568', '328743982', '38101837', '320788365', '400938613',
        '371985983', '276243252', '198827461', '360103800', '321652', '11231122', '243733225', '358255794', '417247887',
        '66931931',
        '10155344', '430828802', '210161175', '13132237', '7900974', '15794932', '43692180', '472117083', '204198336',
        '14147464', '229557152',
        '20646947', '229557152', '317120823', '286047162', '220912852', '258150656', '11011', '505558287',
        '94154471', '385797655', '413420554', '36003925', '194469627','23366073','12531976','351512170','2718036',
    '20960031','19324998','50464758','39937114','45455738','20682460','17682864','270270591','178295220','362143448','12651099',
    '11067852','52922353','16257352','11926300','95913843','226284206','15722736','281899420','38212063','19656816',
    '32330373','8660197','96155866']
    setInterval(function () {
        //console.log('hello')
        let username = $("a.username")
        username.each(function (i, e) {
            if ($(e).attr("data-lavaf") !== '1') {
                let id = $(e).attr('href');
                //console.log($(e).text())
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        if ('//space.bilibili.com/' + blackList[blackListKey] === id) {
                            //console.log('hello')
                            alert("you should close this page!")
                            $(e).attr('data-lavaf', '1');
                            break;
                        }
                    }
                }
            }
        })
        let nameList = $("a.name");
        nameList.each(function (i, e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).attr("data-usercard-mid");
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        if (blackList[blackListKey] === id) {
                            //console.log(id);
                            $(e).text(id)
                            let user = $(e).parent();
                            if (user.children().length === 3) {
                                user.children("span").text("此用户已经被屏蔽");
                            } else {
                                user.next().text("此用户已经被屏蔽")
                            }
                            $(e).attr('data-lavaf', '1');
                        }
                    }
                }
            }

        });
        let nameList1 = $("div.video-card-common");
        nameList1.each(function (i, e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).children("a.up").attr("href");
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        if ('//space.bilibili.com/' + blackList[blackListKey] + '/' === id) {
                            //console.log(id);
                            $(e).find("img").attr('src', '')
                            $(e).find('a.title').text("此用户已被屏蔽");
                            $(e).attr('data-lavaf', '1');
                        }
                    }
                }
            }

        });
        let nameList2 = $("li.video-item");
        nameList2.each(function (i, e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).find("a.up-name").attr("href");
                if (id == null) {
                    console.log(e)
                    return
                }
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        //https://space.bilibili.com/220912852?from=search&seid=2665344755575079991
                        //console.log(id)
                        if (id.indexOf('//space.bilibili.com/' + blackList[blackListKey]) === 0) {
                            //console.log(id);
                            $(e).find("img").attr('src', '')
                            $(e).find('a.up-name').text("此用户已被屏蔽");
                            $(e).find('a.title').text("此用户已被屏蔽")
                            $(e).attr('data-lavaf', '1');
                        }
                    }
                }
            }

        });
        //屏蔽黑名单中用户给自己的回复
        let  replayBox=$(".reply-item")
        replayBox.each(function (i,e) {
            let field=$(e).find(".name-field");
            if (field != null) {
                let link = field.children("a");
                let id=link.attr("href")
                if (id == null) {
                    console.log(e)
                    return
                }
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        //https://space.bilibili.com/220912852?from=search&seid=2665344755575079991
                        //console.log(id)
                        if (id.indexOf('://space.bilibili.com/' + blackList[blackListKey]) === 0) {
                            //console.log(id);
                            $(e).find("avatar").attr('src', '')
                            link.text("此用户已经被屏蔽")
                            $(e).find(".line-2").text("已经被屏蔽")
                            $(e).attr('data-lavaf', '1');
                        }
                    }
                }
            }
        })
    }, 500)

})();