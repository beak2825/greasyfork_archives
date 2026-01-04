// ==UserScript==
// @name         U2种子备份查询
// @namespace    https://u2.dmhy.org/
// @version      2.6
// @description  在页面下载旁加入图标，支持一键发送请求。
// @author       McHobby & kysdm
// @grant        none
// @match        *://u2.dmhy.org/torrents.php*
// @match        *://u2.dmhy.org/sendmessage.php?receiver=*
// @match        *://u2.dmhy.org/details.php?id=*
// @match        *://u2.dmhy.org/offers.php?id=*
// @match        *://u2.dmhy.org/userdetails.php?id=*
// @match        *://u2.dmhy.org/request.php?action=viewreseed&id=*
// @icon         https://u2.dmhy.org/favicon.ico
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/414882/U2%E7%A7%8D%E5%AD%90%E5%A4%87%E4%BB%BD%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/414882/U2%E7%A7%8D%E5%AD%90%E5%A4%87%E4%BB%BD%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

/*
本脚本基于 Bamboo Green 界面风格进行修改
/*

/*
GreasyFork 地址
    https://greasyfork.org/zh-CN/scripts/414882-u2%E7%A7%8D%E5%AD%90%E5%A4%87%E4%BB%BD%E6%9F%A5%E8%AF%A2
*/

/*
使用说明
    https://u2.dmhy.org/forums.php?action=viewtopic&topicid=12748&page=p139981#pid139981
*/

(async () => {
    'use strict';

    const userid = 45940; // 勿动
    const Uploaders = 7;
    let GstaticIco;
    const date = getDateString();

    // Ajax-hook 有点复杂，用 xhook 简单点...
    // 好像 Ajax-hook 的处理效率更高? 也可能我的写法有问题
    // 当通过链接直接打开下载列表时，由于脚本载入时间的关系，是无法对列表进行修改的。
    // https://u2.dmhy.org/userdetails.php?id=xxxxx&dllist=1#leechlist
    // 启用参数 @run-at document-start 可以捕获到请求，但接下来的代码就回报错。
    // 可能可以加个判断，仅当网页加载完毕才进行下一步操作？
    // 暂时标记下，以后有时间再弄了。
    xhook.after(function (request, response) {
        if (request.url.match(/getusertorrentlistajax\.php\?userid=\d+?&type=leeching/i)) {
            response.text = userdetails(response.text);
        }
    });

    let gdListObj = JSON.parse(localStorage.getItem("u2_gd_list"));
    if (gdListObj === null || gdListObj.date !== date) {
        let gdListStr = await getList();
        gdListObj = { date: date, list: gdListStr.trim().split('\n') };
        console.log(gdListObj);
        localStorage.setItem("u2_gd_list", JSON.stringify(gdListObj)); // https://www.runoob.com/jsref/obj-storage.html
    }
    const gdList = gdListObj.list;
    const lang = $('#locale_selection').val(); // 获取当前网页使用的语言
    let txt1 = {
        'zh_CN': '发送请求',
        'zh_TW': '發送請求',
        'zh_HK': '發送請求',
        'en_US': 'Send request',
        'ru_RU': 'послать запрос' // 谷歌翻译
    };
    let txt2 = {
        'zh_CN': '做种良好',
        'zh_TW': '做種良好',
        'zh_HK': '做種良好',
        'en_US': 'Good seeding',
        'ru_RU': 'хороший посев' // 谷歌翻译
    };
    let txt3 = {
        'zh_CN': '记住邮箱地址',
        'zh_TW': '記住信箱地址',
        'zh_HK': '記住郵箱地址',
        'en_US': 'Remember email address',
        'ru_RU': 'Запомнить адрес электронной почты' // 谷歌翻译
    };
    let txt4 = {
        'zh_CN': '邮箱地址错误或未定义，请重新输入。',
        'zh_TW': '信箱地址錯誤或未定義，請重新輸入。',
        'zh_HK': '郵箱地址錯誤或未定義，請重新輸入。',
        'en_US': 'Email address is wrong or undefined, please re-enter.',
        'ru_RU': 'Адрес электронной почты неверен или не указан, введите его еще раз.' // 谷歌翻译
    };
    let txt5 = {
        'zh_CN': '下载种子',
        'zh_TW': '下載種子',
        'zh_HK': '下載種子',
        'en_US': 'Download Torrent',
        'ru_RU': 'Скачать Торрент'
    };
    if (location.href.match(/u2\.dmhy\.org\/torrents\.php/i)) {
        new torrents();
    } else if (location.href.match(/u2\.dmhy\.org\/(?:details|offers)\.php/i)) {
        new torrents();
        new details();
    } else if (location.href.match(/u2\.dmhy\.org\/sendmessage\.php\?receiver=45940#\d+$/i)) { // 45940好像没法设置为变量
        new sendmessage();
    } else if (location.href.match(/u2\.dmhy\.org\/request\.php\?action=viewreseed&id=/i)) {
        new request();
    }

    function torrents() {
        const torrentTable = $('table.torrents')
        torrentTable.find('> tbody > tr:not(:first-child)').each(function () {
            const tds = $(this).find('> td');
            const SeederNum = parseInt($(tds[tds.length - 3]).text());
            const idLink = $(this).find("[href*='id=']")[0].getAttribute('href');
            const id = parseInt(idLink.substr(idLink.indexOf('id=') + 3));
            const Id_Data = gdList.findIndex((value) => value == id);
            if (Id_Data != -1 && SeederNum <= Uploaders) {
                GstaticIco = $(this).find('td.embedded')[1];
                $(GstaticIco).width(55);
                $(GstaticIco).prepend('<a href="sendmessage.php?receiver=' + userid + '#' + id + '" target="_blank"><img src="//cdn.jsdelivr.net/gh/kysdm/u2_share@main/img/drive_2020q4_48dp.png" style="padding-bottom: 2px; width:16px;height:16px;" alt="request" title="' + txt1[lang] + '"></a>');
            } else if (Id_Data != -1) {
                GstaticIco = $(this).find('td.embedded')[1];
                $(GstaticIco).width(55);
                $(GstaticIco).prepend('<img src="//cdn.jsdelivr.net/gh/kysdm/u2_share@main/img/drive_2020q4_48dp.png" style="padding-bottom: 2px; width:16px;height:16px; filter: grayscale(100%);" alt="request" title="' + txt2[lang] + '">');
            }
        })
    }

    function details() {
        const id = $("#outer > h3").text().split(/\(#(\d+?)\)/, 2)[1];
        const SeederNum = $("#peercount").text().match(/^(\d+?)\s?(?:个做种者|個做種者|Seeders|Раздающих)/i)[1];
        const Id_Data = gdList.findIndex((value) => value == Number(id));
        if (Id_Data != -1 && SeederNum <= Uploaders) {
            $("td.rowfollow:first").append('&nbsp;<a class="index" href="sendmessage.php?receiver=' + userid + '#' + id + '" title="' + txt1[lang] + '">[GD]</a>');
        } else if (Id_Data != -1) {
            $("td.rowfollow:first").append('&nbsp;<div class="gdindex" title="' + txt2[lang] + '" style="display: inline-block; text-decoration: none; font-weight: bold" >[GD]</div>');
        }
    }

    function sendmessage() {
        const email = localStorage.getItem("u2_gd_email");
        $("td.rowfollow > input[type=text]").val("#request#");
        $(".bbcode").val('{ "id":"' + location.href.split("#")[1] + '" , "email":"' + email + '" }');

        if (localStorage.getItem("u2_gd_email_switch") === "1") {
            $('td.toolbox').append('<input type="checkbox" name="save_email" checked="checked">' + txt3[lang]);
        } else {
            $('td.toolbox').append('<input type="checkbox" name="save_email">' + txt3[lang]);
        };

        $('#compose').attr('onsubmit', 'return checkemail();');
        $('body').append(
            '<script>\n\
function checkemail(){\n\
    const re = /\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}/;\n\
    let newemail = $.parseJSON($("textarea#body.bbcode").val()).email;\n\
    let email_switch = $("input[name=save_email]").prop("checked");\n\
    if ( !re.test(newemail) ) {\n\
        alert("' + txt4[lang] + '");\n\
        return false;\n\
    }\n\
    if ( email_switch ){\n\
        localStorage.setItem("u2_gd_email", newemail);\n\
        localStorage.setItem("u2_gd_email_switch", "1");\n\
        return true;\n\
    }\n\ else {\n\
        localStorage.removeItem("u2_gd_email");\n\
        localStorage.setItem("u2_gd_email_switch", "0");\n\
        return true;\n\
    }\n\
}</script>'
        );
    }

    function request() {
        // 本来想在主界面里加的，但是主界面里没有种子ID信息，预建立数据挺麻烦的，ajax遍历也不怎么好(即使遍历后进行缓存)，u2本来就负载很高了，算了。
        const _Table = document.querySelector("table.main > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody");
        let id = _Table.querySelector("tr:nth-child(1) > td.rowfollow > a").href.match(/id=(\d+)/i)[1]; // 获取种子ID
        let Id_Data = gdList.findIndex((value) => value == Number(id)); // 查找数据库中是否有备份，没有返回-1
        let SeederNum = _Table.querySelector("tr:nth-child(9) > td.rowfollow > b:nth-child(2)").innerHTML; // 获取当前做种人数
        if (Id_Data != -1 && SeederNum <= Uploaders) {
            _Table.insertAdjacentHTML('beforeend', '<tr><td class="rowhead nowrap" valign="top" align="right">备份</td>\
            <td class="rowfollow" valign="top" align="left"><span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">\
            <a class="index" href="download.php?id=' + id + '">[下载种子]</a>\
            <a class="index" href="sendmessage.php?receiver=' + userid + '#' + id + '" target="_blank">[' + txt1[lang] + ']</a>\
            </bdo></span></td></tr>'
            )
        } else if (Id_Data != -1) {
            _Table.insertAdjacentHTML('beforeend', '<tr><td class="rowhead nowrap" valign="top" align="right">备份</td>\
            <td class="rowfollow" valign="top" align="left"><span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">\
            <a class="index" href="download.php?id=' + id + '">[下载种子]</a>\
            [' + txt1[lang] + ']\
            </bdo></span></td></tr>'
            )
        } else {
            _Table.insertAdjacentHTML('beforeend', '<tr><td class="rowhead nowrap" valign="top" align="right">备份</td>\
            <td class="rowfollow" valign="top" align="left"><span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">\
            <a class="index" href="download.php?id=' + id + '">[下载种子]</a>\
            </bdo></span></td></tr>'
            )
        }
    }

    function userdetails(msg) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/DOMParser
        let parser = new DOMParser();
        let resXML = parser.parseFromString(msg, 'text/html');
        const kaTable = resXML.querySelectorAll("body > table > tbody > tr:not(:first-child)");
        for (var i = 0; i < kaTable.length; i++) {
            let ka = kaTable[i].querySelector("td.rowfollow:nth-child(2) > table > tbody > tr:nth-child(1)");
            let id = ka.querySelector("td > a").href.match(/id=(\d+)/i)[1];
            let Id_Data = gdList.findIndex((value) => value == Number(id));
            let SeederNum = kaTable[i].querySelector("td:nth-child(4) > b > a").innerHTML;
            if (Id_Data != -1 && SeederNum <= Uploaders) {
                ka.insertAdjacentHTML('beforeend', '<td class="embedded" style="text-align: right; width: 55px;" valign="middle">\
        <a href="sendmessage.php?receiver=' + userid + '#' + id + '" target="_blank"><img src="//cdn.jsdelivr.net/gh/kysdm/u2_share@main/img/drive_2020q4_48dp.png" style="padding-bottom: 2px; width:16px;height:16px;" alt="request" title="' + txt1[lang] + '"></a>\
        <a href="download.php?id=' + id + '"><img class="download" src="pic/trans.gif" style="padding-bottom: 2px;" alt="download" title="' + txt5[lang] + '">\
        </a></td>'
                );
            } else if (Id_Data != -1) {
                ka.insertAdjacentHTML('beforeend', '<td class="embedded" style="text-align: right; width: 55px;" valign="middle">\
                    <img src="//cdn.jsdelivr.net/gh/kysdm/u2_share@main/img/drive_2020q4_48dp.png" style="padding-bottom: 2px; width:16px;height:16px; filter: grayscale(100%);" alt="request" title="' + txt2[lang] + '">\
        <a href="download.php?id=' + id + '"><img class="download" src="pic/trans.gif" style="padding-bottom: 2px;" alt="download" title="' + txt5[lang] + '">\
        </a></td>'
                );
            }
            else {
                ka.insertAdjacentHTML('beforeend', '<td class="embedded" style="text-align: right; width: 55px;" valign="middle">\
        <a href="download.php?id=' + id + '"><img class="download" src="pic/trans.gif" style="padding-bottom: 2px;" alt="download" title="' + txt5[lang] + '">\
        </a></td>')
            };
        }
        return resXML.body.innerHTML
    }
})();

function getList() {
    return new Promise((resolve, reject) => {
        // https://www.w3school.com.cn/jquery/ajax_ajax.asp
        $.ajax({
            type: 'get',
            url: 'https://cdn.jsdelivr.net/gh/kysdm/u2_share@main/u2list.txt',
            contentType: 'text/plain',
            dataType: 'text',
            cache: false,
            success: r => resolve(r),
            error: r => {
                console.log('下载列表发生错误，HTTP状态码[' + r.status + ']。');
                reject(r.status)
            }
        })
    })

}

function Appendzero(obj) {
    return obj < 10 ? '0' + obj : obj
}

function getDateString() {
    const time = new Date();
    return time.getFullYear().toString() +
        Appendzero(time.getMonth() + 1).toString() +
        Appendzero(time.getDate()).toString() +
        Appendzero(time.getHours())
}
