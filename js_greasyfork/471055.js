// ==UserScript==
// @name         BRDTS_AutoKeyboardScript
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  新版BR大逃杀全键盘操作脚本
// @author       f1stSea
// @compatible   chrome
// @compatible   firefox
// @license      GNU
// @match        http://s2.dtsgame.com/game.php
// @match        http://s1.dtsgame.com/game.php
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471055/BRDTS_AutoKeyboardScript.user.js
// @updateURL https://update.greasyfork.org/scripts/471055/BRDTS_AutoKeyboardScript.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 全局变量
    // 脚本整体开启/关闭
    var isScriptEnabled = true;
    // 自动搜刮战利品
    var autoSpoil = false;

    // 初始化
    var run = function() {
        initSettingsBox();
    }

    function initSettingsBox() {
        // 寻找主界面
        var mainBox;
        if ($("td[rowspan='2']").length > 0) {
            mainBox = $("td[rowspan='2']").parent();
        }

        // 创建脚本展示框
        var content = $('<td>').attr('rowspan', '2').appendTo(mainBox);
        var table = $('<table>')
            .attr('border', '1')
            .attr('width', '250')
            .attr('height', '550')
            .attr('cellspacing', '0')
            .attr('cellpadding', '0')
            .appendTo(content);
        var tbody = $('<tbody>').appendTo(table);
        var tr = $('<tr>').appendTo(tbody);
        var td = $('<td>')
            .attr('valign', 'top')
            .addClass('b3')
            .css('text-align', 'left')
            .appendTo(tr);
        var div = $('<div>').attr('id', 'log').appendTo(td);
        var span = $('<span>')
            .addClass('yellow b')
            .css('letter-spacing', '2px')
            .appendTo(div);

        // 主按钮及描述
        appendBaseCheckBox(span);

        // 自动搜刮
        appendAutoSpoilCheckBox(span);

    }

    function appendBaseCheckBox(span) {
        // 添加描述文本到 span 中
        span.append('启用脚本: ');

        // 添加勾选框到 span 中
        var checkbox = $('<input>')
            .attr('type', 'checkbox')
            .appendTo(span);
        checkbox.prop('checked', isScriptEnabled);

        // 键盘监控器
        var handleKeyDown;
        // 定时器
        var timer;
        if (isScriptEnabled) {
            handleKeyDown = startListenKeyboard();
            timer = updateTimer(timer, 100);
        }

        // 监听勾选框的改变事件
        checkbox.on('change', function() {
            if ($(this).prop('checked')) {
                // 开始监听键盘事件
                handleKeyDown = startListenKeyboard();
                timer = updateTimer(timer, 100);
            } else if (handleKeyDown) {
                // 停止监听键盘事件
                window.removeEventListener('keydown', handleKeyDown);
                timer = updateTimer(timer, 0);
            }
        });

        // 添加描述文本到 span 中
        span.append(
            '<br/><br/>' +
            '基础功能快捷键:<br/>' +
            '确认--空格<br/>' +
            '探索--q<br/>' +
            '自动拾取开启/关闭--TAB<br/><br/>' +
            '移动:<br/>' +
            '灯塔--1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源二郎池--2<br/>' +
            '消防署--3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;观音堂--4<br/>' +
            '清水池--5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;森林地带--6<br/>' +
            '诊所--7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隧道--8<br/><br/>'
        );
    }

    // 更新定时器
    function updateTimer(timer, interval) {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
        if (interval > 0) {
            timer = setInterval(confirm, interval);
        }
        return timer;
    }

    function startListenKeyboard() {
        var handleKeyDown = function(e) {
            if (document.activeElement.type == 'text' || document.activeElement.type == 'password' || e.metaKey || e.ctrlKey || e.target.isContentEditable || document.designMode === "on") {
                console.log('block key：' + e.e.keyCode);
                return;
            }
            if (listenKeyboardMap[e.keyCode]) {
                console.log('active key：' + e.keyCode);
                //触发映射
                listenKeyboardMap[e.keyCode]();
                //无效化按键原来的效果
                e.preventDefault();
                e.stopPropagation();
            } else {
                console.log('useless key：' + e.keyCode);
                return;
            }
        };
        window.addEventListener('keydown', handleKeyDown, false);
        return handleKeyDown;
    }
    var listenKeyboardMap = {
        // 空格:32 确认
        '32': function() {
            confirm();
        },
        // 1:49 移动到灯塔
        '49': function() {
            moveTo(20);
        },
        // 2:50 移动到源二郎池
        '50': function() {
            moveTo(17);
        },
        // 3:51 移动到消防署
        '51': function() {
            moveTo(5);
        },
        // 4:52 移动到观音堂
        '52': function() {
            moveTo(6);
        },
        // 5:53 移动到清水池
        '53': function() {
            moveTo(7);
        },
        // 6:54 移动到森林地带
        '54': function() {
            moveTo(16);
        },
        // 7:55 移动到诊所
        '55': function() {
            moveTo(19);
        },
        // 8:56 移动到隧道
        '56': function() {
            moveTo(11);
        },
        // q:81 探索
        '81': function() {
            pressButtonIfExist("探索");
        },
        // TAB:9 开启/关闭自动拾取
        '9': function() {
            dontSpoil = !dontSpoil;
        },
    };

    function appendAutoSpoilCheckBox(span) {
        // 添加描述文本到 span 中
        span.append('自动搜刮战利品: ');

        // 添加勾选框到 span 中
        var checkbox = $('<input>')
            .attr('type', 'checkbox')
            .appendTo(span);
        checkbox.prop('checked', autoSpoil);

        // 监听勾选框的改变事件
        checkbox.on('change', function() {
            autoSpoil = $(this).prop('checked');
        });

        // 添加描述文本到 span 中
        span.append(
            '<br/>搜刮且仅搜刮金钱、罐头与徽章<br/>'
        );
    };

    function confirm() {
        // 合并
        if (checkMerge()) {
            return;
        }
        // 无需额外判断直接确认的按钮
        if (pressButtonIfExist()) {
            return;
        }

        // 拾取按钮
        if (checkPickup()) {
            return;
        }
        // 搜刮尸体有价值部分，无价值部分可自行搜刮，或者快速移动直接离开
        if (checkSpoil()) {
            return;
        }
    }

    function checkMerge() {
        // 可拾取物品
        var $inputElement = $('input[type="button"].postbutton[value="确定"]');
        var pageText = $("#cmd").text();
        if ($inputElement.length > 0 && pageText.includes("合并")) {
            sl("itm0");
            sl("itm1");
            sl("itm2");
            sl("itm3");
            sl("itm4");
            $inputElement.click();
            return true;
        }
        // 不存在该标签
        return false;
    }

    function pressButtonIfExist(value) {
        var directConfirmList = ["确定", "提交", "斩刺\\(斩\\)", "投掷\\(投\\)", "射击\\(射\\)"];
        if (value) {
            directConfirmList = [value];
        }
        for (var i = 0; i < directConfirmList.length; i++) {
            var $inputElement = $('input[type="button"].postbutton[value=' + directConfirmList[i] + ']');
            if ($inputElement.length > 0) {
                // 存在该标签，触发点击事件
                $inputElement.click();
                return true;
            }
        }
        // 不存在该标签
        return false;
    }

    function checkPickup() {
        // 可拾取物品
        var pickupItemSet = new Set([
            "杂炊", "松茸", "香菇", "蘑菇", "树枝", "面", "炖肉", " 冰",
            "水", "牛奶", "苹果", "清涼饮料", "蔬菜汁",
            "强壮剂", "中药", "特效药", "疗伤药", "针筒", "牛奶",
            "瑞士刀", "力场", "之盾", "RoseMystica", "胴具足", "针线包",
            // "磨刀石", "废金属",
            // "手机","电脑",
            // "投","绷带",
            // "子弹","废金属","钢琴线","铁管",
        ]);
        needArmor(pickupItemSet);
        var $pickupElement = $('input[type="button"].postbutton[value="拾取"]');
        var $drupElement = $('input[type="button"].postbutton[value="丢弃"]');
        if ($pickupElement.length > 0 && $drupElement.length > 0) {
            // 存在该标签，判断是否是目标物品
            var pageText = $("#cmd").text();
            // 遍历目标字，判断是否存在
            var have = false;
            pickupItemSet.forEach(function(item) {
                if (pageText.includes(item)) {
                    have = true;
                    return true;
                }
            });
            have ? $pickupElement.click() : $drupElement.click();
            return true;
        } else {
            return false;
        }
    }
    // 没有防具会拾取对应防具，有的话就不拾取了，高价值防具在默认拾取列表，不在此列
    function needArmor(pickupItemSet) {
        var need = false;
        var targetTdElement = $("#main");
        if (!pickupItemSet) {
            pickupItemSet = new Set();
        }
        if (targetTdElement.text().includes("【防具(体)】\n无")) {
            // console.log("没有【防具(体)】");
            need = true;
            pickupItemSet.add("体");
        }
        if (targetTdElement.text().includes("【防具(头)】\n无")) {
            // console.log("没有【防具(头)】");
            need = true;
            pickupItemSet.add("头");
        }
        if (targetTdElement.text().includes("【防具(腕)】\n无")) {
            // console.log("没有【防具(腕)】");
            need = true;
            pickupItemSet.add("腕");
        }
        if (targetTdElement.text().includes("【防具(足)】\n无")) {
            // console.log("没有【防具(足)】");
            need = true;
            pickupItemSet.add("足");
        }
        return need;
    }

    function checkSpoil() {
        // 可拾取尸体
        var pageText = $("#cmd").text();
        if (autoSpoil && pageText.includes("尸体") && pageText.includes("军")) {
            if (pageText.includes("罐头") || pageText.includes("元") || pageText.includes("碎片")) {
                sl("itm0");
                sl("itm1");
                sl("itm2");
                sl("itm3");
                sl("itm4");
                sl("money");
                postCommand();
                return true;
            } else {
                postCommand();
                return true;
            }
        }
        return false;
    }

    function moveTo(id) {
        var locationMap = {
            "1": "北海岸(A-2)",
            "2": "北村住宅区(B-4)",
            "3": "北村公所(C-3)",
            "4": "邮电局(C-4)",
            "5": "消防署(C-5)",
            "6": "观音堂(C-6)",
            "7": "清水池(D-4)",
            "8": "西村神社(E-2)",
            "9": "墓地(E-4)",
            "10": "山丘地带(F-6)",
            "11": "隧道(E-8)",
            "12": "西村住宅区(F-2)",
            "13": "寺庙(F-9)",
            "14": "废校(G-3)",
            "15": "南村神社(G-6)",
            "16": "森林地带(H-4)",
            "17": "源二郎池(H-6)",
            "18": "南村住宅区(I-6)",
            "19": "诊所(I-7)",
            "20": "灯塔(I-10)",
            "21": "南海岸(J-6)",
            "22": "神秘研究所(H-8)"
        }
        $('#moveto').val(id);
        postCommand("command", "move");
    }
    // hack

    //update time
    function updateTime(timing, mode) {
        if (timing) {
            t = timing;
            tm = mode;
            h = Math.floor(t / 3600);
            m = Math.floor((t % 3600) / 60);
            s = t % 60;
            // add a zero in front of numbers<10
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);
            $('#timing').html(h + ':' + m + ':' + s);
            tm ? t++ : t--;
            setTimeout("updateTime(t,tm)", 1000);
        } else {
            window.location.href = 'index.php';
        }
    }
    //icon select
    function iconMover() {
        var gd = document.valid.gender[0].checked ? 'm' : 'f';
        var index = document.valid.icon.selectedIndex;
        var inum = document.valid.icon[index].value;
        ''
        $('#iconImg').html('<img src="' + pic_root + gd + '_' + inum + '.gif" alt="' + inum + '">');
    }

    function dniconMover() {
        dngd = document.cmd.dngender[0].checked ? 'm' : 'f';
        dninum = document.cmd.dnicon.selectedIndex;
        $('#dniconImg').html('<img src="' + pic_root + dngd + '_' + dninum + '.gif" alt="' + dninum + '">');
    }

    function postCommand(mode, command, other) {
        for (var id in other) {
            if (id != 'toJSONString') {
                $('#cmd').append('<input type="hidden" name="' + id + '" value="' + other[id] + '">');
            }
        }
        if (mode != undefined) {
            $('#cmd').append('<input type="hidden" name="mode" value="' + mode + '">');
        }
        if (command != undefined) {
            $('#cmd').append('<input type="hidden" name="command" value="' + command + '">');
        }
        $('#submit').attr("disabled", true);
        var oXmlHttp = zXmlHttp.createRequest();
        var sBody = getRequestBody(document.forms['cmd']);
        oXmlHttp.open("post", "command.php", true);
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oXmlHttp.onreadystatechange = function() {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200) {
                    showGamedata(oXmlHttp.responseText);
                    $('#submit').attr("disabled", false);
                } else {
                    showNotice(oXmlHttp.statusText);
                }
            }
        };
        oXmlHttp.send(sBody);
    }

    function transformMoveList() {
        var options = $('#moveto option');
        var html = "<div id='moveto_trans' class='select'><div class='options'>"
        if (options.length > 0) {
            options.each(function() {
                var title = $(this).html();
                var value = $(this).attr('value');
                html += "<div value='" + value + "'>" + title + "</div>";
                $(this).html();
            });
        }
        html += "</div></div>";
        $('#moveto').remove();
        $('#cmd').prepend(html);
        $('#moveto_trans').css('position', 'absolute');
        $('#moveto_trans').css('left', $('.postbutton').position().left + 10);
        $('#moveto_trans').css('top', $('.postbutton').position().top - 25);
        $('.select .options div').each(function() {
            var type = $(this).attr('value');
            if (type != 'main') {
                $(this).hide();
            }
            $(this).click(function() {
                var value = $(this).attr('value');
                if (value == 'main') {
                    $(this).siblings().toggle();
                } else {
                    postCommand('command', 'move', {
                        moveto: value
                    });
                }
            })
        })
    }

    function showGamedata(sGamedata) {
        gamedata = sGamedata.parseJSON();
        if (gamedata['url']) {
            window.location.href = gamedata['url'];
        } else if (!gamedata['main']) {
            window.location.href = 'index.php';
        }
        if (gamedata['team']) {
            $('#team').val(gamedata['team']);
            gamedata['team'] = '';
        }
        for (var id in gamedata) {
            if ((id == 'toJSONString') || (!gamedata[id])) {
                continue;
            }
            $('#' + id).html(gamedata[id]);
            console.log(id);
        }
        if (DEBUGMODE == 99) {
            transformMoveList();
        }
    }

    function showNotice(sNotice) {
        $('#notice').html(sNotice);
    }

    function sl(id) {
        checkbox = $('#' + id);
        // if (checkbox.is(':checked')){$('#submit').click();}
        checkbox.click();
    }

    function showNews(n) {
        var oXmlHttp = zXmlHttp.createRequest();
        oXmlHttp.open("post", "news.php", true);
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oXmlHttp.onreadystatechange = function() {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200) {
                    showNewsdata(oXmlHttp.responseText);
                } else {
                    showNotice(oXmlHttp.statusText);
                }
            }
        };
        oXmlHttp.send('newsmode=' + n);
    }

    function showNewsdata(newsdata) {
        news = newsdata.parseJSON();
        if (news['msg']) {
            newchat = '';
            for (var nid in news['msg']) {
                if (nid == 'toJSONString') {
                    continue;
                }
                newchat += news['msg'][nid];
            }
            $('#newsinfo').html(newchat);
        } else {
            $('#newsinfo').html(news);
        }
    }

    function showAlive(mode) {
        window.location.href = 'alive.php?alivemode=' + mode;
    }
    var refchat = null;

    function chat(mode, reftime) {
        clearTimeout(refchat);
        var oXmlHttp = zXmlHttp.createRequest();
        var s = document.forms['sendchat'];
        if (mode == 'send') {
            s['sendmode'].value = 'send';
        } //
        sBody = getRequestBody(s);
        //alert(sBody);
        oXmlHttp.open("post", "chat.php", true);
        oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oXmlHttp.onreadystatechange = function() {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200) {
                    showChatdata(oXmlHttp.responseText);
                } else {
                    showNotice(oXmlHttp.statusText);
                }
            }
        };
        oXmlHttp.send(sBody);
        if (mode == 'send') {
            $('#chatmsg').val("");
            $("#sendmode").val('ref');
        }
        rtime = reftime;
        refchat = setTimeout("chat('ref',rtime)", rtime);
    }

    function showChatdata(jsonchat) {
        chatdata = jsonchat.parseJSON();
        if (chatdata['msg']) {
            $('#lastcid').val(chatdata['lastcid']);
            newchat = '';
            for (var cid in chatdata['msg']) {
                if (cid == 'toJSONString' || cid == 'parseJSON') {
                    continue;
                }
                newchat += chatdata['msg'][cid];
            }
            /*Code For At*/
            Reg = new RegExp("@[\u4E00-\u9FA5A-Za-z0-9_]*", "g");
            result = Reg.test(newchat);
            if (result == true) {
                newchat = newchat.replace(Reg, "<a class='aite' onclick=AiteOther('$&') href='javascript:void(0)'>$&</a>");
            }
            $('#chatlist').html(newchat + $('#chatlist').html());
            if (result == true) {
                UpdataAite();
            }
        }
    }

    function UpdataAite() {
        nickname = $("#nickname").html();
        var i = 0;
        $("a.aite").each(function() {
            if (i < 10) {
                var name = $(this).html();
                if ("@" + nickname == name) {
                    $(this).removeClass('aite').addClass('aiteme');
                }
            }
            i++;
        });
    }

    function AiteOther(name) {
        if (name != "@" + nickname) {
            $("#chatmsg").val(name + ",");
        }
    }

    run();
})();