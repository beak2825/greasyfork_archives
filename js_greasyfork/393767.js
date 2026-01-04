// ==UserScript==
// @name         巴哈姆特公會哈拉串轉存小屋創作
// @namespace    http://www.isaka.idv.tw/
// @version      1.0
// @description  只要按一下，就可以把公會哈拉串轉存小屋創作了呦～
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://guild.gamer.com.tw/singlePost.php*
// @match        http://guild.gamer.com.tw/singlePost.php*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/d3-time-format/2.1.1/d3-time-format.min.js
// @require      https://cdn.jsdelivr.net/npm/art-template@4.13.2/lib/template-web.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/393767/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E5%93%88%E6%8B%89%E4%B8%B2%E8%BD%89%E5%AD%98%E5%B0%8F%E5%B1%8B%E5%89%B5%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/393767/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E5%93%88%E6%8B%89%E4%B8%B2%E8%BD%89%E5%AD%98%E5%B0%8F%E5%B1%8B%E5%89%B5%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.domain = "gamer.com.tw";

    var DEFAULT_TEMPLATE = `[div][table cellspacing=3 cellpadding=1 align=right width=35%]
[tr]
[td width=30%][size=1][i]開串時間：{{msg_create_time}}
公會名稱：{{guild_name}}
開串編號：{{guild_id}}
開串者：{{msg_owner_nickname}}({{msg_owner_id}})[/i][/size][/td]
[/tr]
[/table]
[/div]
[div][/div]
[div][i][size=2][font=微軟正黑體]
{{msg_text}}[/font][/size][/i][/div]
[div][hr][/div]
[div][table align=center width=98% cellspacing=9]{{each reply_data}}
[tr{{if ($index % 2 == 0)}} bgcolor=#EEEEEE{{/if}}]
[td{{if ($index == 0)}} width=20%{{/if}}][font=微軟正黑體][size=2][b]{{$value['user_nick']}}[/b][/size][/font][/td]
[td{{if ($index == 0)}} width=80%{{/if}}][font=微軟正黑體][size=2]{{$value['content']}}[/size][/font][/td]
[/tr]{{/each}}
[/table]
[/div]`;
    var DEFAULT_EVAL_PRE_RENDER = '';

    function defer (callback) {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (e) {
            callback();
        };
        channel.port2.postMessage(null);
    }

    function getDomainFromUrl(url) {
        var host = null;

        if (typeof url == "undefined" || null == url)
            url = window.location.href;
        var regex = /.*\:\/\/([^\/]*)\/([^\/]*).*/;
        var match = url.match(regex);
        if (typeof match != "undefined" && null != match) {
            host = new Array(match[1], match[2]);
        }
        return host;
    }

    function getPHPFileNameString(s) {
        var host = null;

        var regex = /([^\/]*)\.php([^\/]*)/;
        var match = s.match(regex);
        if (typeof match != "undefined" && null != match) {
            host = new Array(match[1], match[2]);
        }
        return host;
    }

    function btn_click_funt_generator(post_funt){
        return (function(){
            var changeTime = function(str) {
                console.log(str)
                var _format_only_date = d3.timeFormat("%Y-%m-%d ");
                var _format_complete = d3.timeFormat("%Y-%m-%d %H:%M");
                var calender = new Date();
                if (str.indexOf("0 分鐘") !== -1){
                    calender.setDate(calender.getDate());
                }else if (str.indexOf("昨天") !== -1) {
                    calender.setDate(calender.getDate() - 1);
                    str = str.replace("昨天", _format_only_date(calender));
                } else if (str.indexOf("前天") !== -1) {
                    calender.setDate(calender.getDate() - 2);
                    str = str.replace("前天", _format_only_date(calender));
                } else if (str.indexOf("分前") !== -1) {
                    var matchs = str.match(/([0-9]+)\W?分前/);
                    calender.setMinutes(calender.getMinutes() - matchs[1]);
                    str = _format_complete(calender);
                } else if (str.indexOf("1分內") !== -1) {
                    str = _format_complete(calender);
                } else if (str.indexOf("小時前") !== -1) {
                    var matchs = str.match(/([0-9]+)\W?小時前/);
                    calender.setHours(calender.getHours() - matchs[1]);
                    str = _format_complete(calender);
                } else if (str.indexOf("月") !== -1 && str.indexOf("日") !== -1) {
                    var matchs = str.match(/([0-9]+)月([0-9]+)日 ([0-9]+):([0-9]+)/);

                    var newDate = new Date(calender.getYear(), matchs[1], matchs[2], matchs[3], matchs[4], 0, 0);
                    if (newDate > calender)
                        calender.setYear(calender.getYear() - 1);
                    str = _format_complete(calender);
                } else {
                    var matchs = str.match(/([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)/);

                    var newDate = new Date(calender.getYear(), matchs[1], matchs[2], matchs[3], matchs[4], 0, 0);
                    if (newDate > calender)
                        calender.setYear(calender.getYear() - 1);
                    str = _format_complete(calender);
                }
                return str;
            }

            new Promise((resolve, reject) => {
                console.log('Initial');

                var singleACMsgParme = null;
                var urls = getDomainFromUrl(window.location.href);
                var pageName = getPHPFileNameString(urls[1]);
                var sn_regex = /[\?&]sn=(\d*)/;
                var sn_match = pageName[1].match(sn_regex);
                var gsn_regex = /[\?&]gsn=(\d*)/;
                var gsn_match = pageName[1].match(gsn_regex);

                window.MsgId = sn_match[1];
                window.guildId = gsn_match[1];

                resolve();
            }).then((resolve, reject) => {
                return $.ajax({
                    url: globalConfig.apiRoot + '/v1/comment_list_legacy.php',
                    method: 'GET',
                    data: {
                        gsn: guildId,
                        messageId: MsgId,
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                })

            }).then((resolve, reject) => {
                window.res = resolve

                return Promise.resolve();
            }).then((resolve, reject) => {
                return $.ajax({
                    url: globalConfig.apiRoot + '/v1/post_detail.php',
                    method: 'GET',
                    data: {
                        gsn: guildId,
                        messageId: MsgId,
                    },
                    xhrFields: {
                        withCredentials: true
                    }
                })
            }).then((resolve, reject) => {
                var m;
                var reply_data = [];
                var player_data = {};
                var total_num = res.data.comments.length;

                res.data.comments.forEach((element,idx)=>{
                    var temp_data = {
                        'reply_id': element['id'],
                        'user_id': element['userid'],
                        'user_nick': element['name'],
                        'content': $.trim(element['text'].replace(/<br \/>/g,'\n')),
                        'time': changeTime(element['time']),
                        'msgid': element['comment_no'],
                        'reply_num':idx + 1
                    }
                    reply_data.push(temp_data)

                    if( player_data[ element['userid'] ] != null ){
                        player_data[ element['userid'] ].count += 1;
                    }else{
                        player_data[ element['userid'] ] = {};
                        player_data[ element['userid'] ].nickname = element['name'];
                        player_data[ element['userid'] ].count = 1;
                    }
                });

                var template_value = {
                    'guild_id': resolve.data.to.gsn,
                    'guild_name': resolve.data.to.name,
                    'player_stat': player_data,
                    'reply_data': reply_data,
                    'total_reply': total_num,
                    'msg_id': resolve.data.id,
                    'msg_owner_nickname': resolve.data.publisher.name,
                    'msg_owner_id': resolve.data.publisher.id,
                    'msg_owner_picurl': resolve.data.publisher.propic,
                    'msg_text': resolve.data.content,
                    'msg_create_time': changeTime(resolve.data.time),
                }
                console.log(template_value);

                window.template_value = template_value
                return Promise.resolve();
            }).then((resolve, reject)=>{
                (async () => {
                    var final_str = '';
                    var template_str = await GM.getValue('TEMPLATE_STR', DEFAULT_TEMPLATE);
                    var eval_str = await GM.getValue('EVAL_PRE_RENDER_STR', DEFAULT_EVAL_PRE_RENDER);
                    await eval(eval_str)
                    final_str = await template.render(template_str, template_value);
                    post_funt(final_str)
                })();
            });
        });
    }

    (function(){$('#BH-slave').prepend(
        '<h5 id="baha-rightSaveMsgToCreate">公會串轉存創作</h5>' +
        '<div class="BH-rbox MSG-list5" id="baha-rightSaveMsgToCreateContent">' +
            '<div class="BH-slave_more">' +
                '<button type="button" id="baha-rightSaveMsgToCreateSaveBtn">轉存小屋創作</button>' +
                '<button type="button" id="baha-rightSaveMsgToCreateCopyBoardBtn">複製到剪貼簿</button>' +
            '</div>' +
            '<div class="BH-slave_more">' +
                '<button type="button" id="baha-rightSaveMsgToCreateTemplateBtn">管理轉存樣板</button>' +
                '<textarea id="baha-rightSaveMsgToCreateHiddenCopy" style="opacity: .01;height:0;position:absolute;z-index: -1;"></textarea>' +
            '</div>' +
        '</div>'
    )})()

    var btn_save_funt = btn_click_funt_generator(function(text){
        GM.setClipboard(text);
        (async () => {
            var create_window = await window.open('https://home.gamer.com.tw/creationNew1.php')
            await setTimeout( function (){
                create_window.$('#source').val(text);
            }, 2000);
        })();
    });
    $('#baha-rightSaveMsgToCreateSaveBtn').click(btn_save_funt);

    var btn_CopyBoard_funt = btn_click_funt_generator(function(text){
        /*var temp_text = text.replace(/\r?\n/g, '\r\n')
        document.getElementById("baha-rightSaveMsgToCreateHiddenCopy").value = temp_text
        console.log(document.getElementById("baha-rightSaveMsgToCreateHiddenCopy").value)
        document.getElementById("baha-rightSaveMsgToCreateHiddenCopy").select()

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? '成功' : '失敗';
            alert('公會串複製' + msg);
        } catch (err) {
            alert('噢不！複製功能出了問題！');
        }*/
        GM.setClipboard(text);
        alert('公會串複製成功！');
    });
    $('#baha-rightSaveMsgToCreateCopyBoardBtn').click(btn_CopyBoard_funt);

    var btn_template_funt = function(){
        var template_window = window.open('', '樣板管理頁面', 'channelmode=yes,directories=no,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,height=600,width=400', false)
        template_window.document.write(`
<body><b>模板內容</b><br>（留白代表使用預設模板）<br><textarea id="template_textarea" cols="50" rows="10"></textarea><br><br>
<b>Eval() Before Render</b><br>（注意！除非你知道你在做什麼，否則留白！）<br><textarea id="eval_textarea" cols="50" rows="10"></textarea><br><br>
<button type="button" id="save_btn">存檔並關閉</button><script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"/></body>`
        );
        (async () => {
            template_window.document.getElementById("template_textarea").value = await GM.getValue('TEMPLATE_STR', '');
            template_window.document.getElementById("eval_textarea").value = await GM.getValue('EVAL_PRE_RENDER_STR', '');
        })();
        template_window.document.getElementById('save_btn').addEventListener('click',function(){
            (async () => {
                if(template_window.document.getElementById("template_textarea").value == ''){
                    await GM.deleteValue('TEMPLATE_STR');
                }else{
                    await GM.setValue('TEMPLATE_STR', template_window.document.getElementById("template_textarea").value);
                }

                if(template_window.document.getElementById("eval_textarea").value == ''){
                    await GM.deleteValue('EVAL_PRE_RENDER_STR');
                }else{
                    await GM.setValue('EVAL_PRE_RENDER_STR', template_window.document.getElementById("eval_textarea").value);
                }
                template_window.close()
            })();
        })
    }
    $('#baha-rightSaveMsgToCreateTemplateBtn').click(btn_template_funt);
})();