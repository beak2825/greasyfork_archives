// ==UserScript==
// @name        6V剧版评分强化器
// @namespace   xingxing_neu6rateenhancer
// @description NEU6剧版评分强化器
// @author      xingxing
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_download
// @include     http://bt.neu6.edu.cn/forum*
// @include     http://bt.neu6.edu.cn/thread*
// @include     http://bt.neu6.edu.cn/search*
// @require     https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon        http://bt.neu6.edu.cn/favicon.ico
// @version     20190108
// @downloadURL https://update.greasyfork.org/scripts/373462/6V%E5%89%A7%E7%89%88%E8%AF%84%E5%88%86%E5%BC%BA%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/373462/6V%E5%89%A7%E7%89%88%E8%AF%84%E5%88%86%E5%BC%BA%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

const jq = jQuery.noConflict();
(function () {

    // 全局变量初始化
    var i, j, k;
    var auto_add, title_check, search_enhance, seedsize_human;
    var title_zoom, add_rate_user, second_timeout, common_links;
    getConfig();
    const tv_forum = [155, 48, 77, 14, 73];
    const forum_id = getForumId();
    const current_user = getCurrentUser();
    const current_url = getCurrentUrl();

    function getConfig() {
        if (!GM_getValue('already_setted')) {
            alert('第一次使用请前往设置页设置>\n\n论坛首页>功能>脚本设置>保存设置');
        }
        auto_add = (GM_getValue('auto_add')) ? GM_getValue('auto_add') : false;
        title_check = (GM_getValue('title_check')) ? GM_getValue('title_check') : false;
        search_enhance = (GM_getValue('search_enhance')) ? GM_getValue('search_enhance') : false;
        seedsize_human = (GM_getValue('seedsize_human')) ? GM_getValue('seedsize_human') : false;
        title_zoom = (typeof (GM_getValue('title_zoom')) == "undefined") ? 1.2 : parseFloat(GM_getValue('title_zoom'));
        if (title_zoom < 1 || title_zoom > 2) {
            title_zoom = 1.2;
            GM_setValue('title_zoom', 1.2);
        }
        second_timeout = (typeof (GM_getValue('second_timeout')) == "undefined") ? 400 : parseInt(GM_getValue('second_timeout'));
        if (second_timeout < 300 || second_timeout > 1000) {
            second_timeout = 400;
            GM_setValue('second_timeout', 400);
        }
        add_rate_user = GM_getValue('add_rate_user') ? GM_getValue('add_rate_user').split(',') : ["j552k", "baishuangxing", "kun2phg"];
        common_links = GM_getValue('common_links') ? JSON.parse(GM_getValue('common_links')) : {};
    }

    function atHomePage() {
        return location.href.match(/forum\.php$/) ? true : false;
    }

    function atForumPage() {
        return location.href.match(/forum-|fid=/) ? true : false;
    }

    function atDetailPage() {
        return location.href.match(/thread-|tid=/) ? true : false;
    }

    function getForumId() {
        var forum_match = location.href.match(/(forum-|fid=)(\d+)/);
        if (forum_match) {
            return parseInt(forum_match[2]);
        }
        if (atDetailPage() && jq('#visitedforums>a').length) {
            var type_m = jq('#visitedforums>a').attr('href').match(/(forum-|fid=)(\d+)/);
            return parseInt(type_m ? type_m[2] : 0);
        }
        return 0;
    }

    function getCurrentUser() {
        return jq("div#um strong.vwmy a").text().trim();
    }

    function getCurrentUrl() {
        if (atDetailPage()) {
            let seed_id = jq("#pt>div>a:last").attr('href').match(/(thread-|tid=)(\d+)/)[2];
            return "http://bt.neu6.edu.cn/thread-" + seed_id + "-1-1.html";
        }
        return 0;
    }

    // 各板块列表
    if (jq('table#threadlisttableid').length) {
        let formhash = jq('input[name="formhash"]').val();
        let listextra = jq('input[name="listextra"]').val();
        jq("table#threadlisttableid tbody").each(function () {
            let tbody = jq(this);
            //id
            let id = tbody.attr('id').match(/(\d+)/) ? tbody.attr('id').match(/(\d+)/)[1] : 0;
            let size_index, copy_index;
            if (tbody.find('tr>td:eq(1)>img').length) {
                copy_index = 1;
                size_index = 2;
            } else {
                copy_index = 2;
                size_index = 3;
            }
            //size
            let size = parseFloat(tbody.find('tr>td:eq(' + size_index + ')').text());
            if (size > 0 && id !== 0) {
                tbody.find('tr>td:eq(' + copy_index + ')>img').click(function () {
                    window.open("http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + forum_id + "#clone_" + id);
                });
                //
                if (size_index == 3 && /stickthread_/.test(tbody.attr('id'))) {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://bt.neu6.edu.cn/forum.php?mod=topicadmin&action=moderate&infloat=yes&nopost=yes&inajax=1&fid=" + forum_id,
                        data: "formhash=" + formhash + "&listextra=" + listextra + "&moderate[]=" + id + "&optgroup=1&operation=stick",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function (response) {
                            var doc = (new DOMParser()).parseFromString(response.responseText, 'text/html');
                            var body = doc.querySelector("body");
                            var page = jq(body);
                            if (page.find('input#expirationstick').length) {
                                let expirationstick = page.find('input#expirationstick').val();
                                if (expirationstick != "") {
                                    tbody.find('th').append('<b>(限时:' + calculateStickLeftTime(expirationstick) + ')</b>');
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    function calculateStickLeftTime(str) {
        let m = parseInt((new Date(str) - new Date()) / 60000);
        let ret = [];
        let ret_u = ['分', '时', '天'];
        ret.push(m % 60); //分
        m = parseInt(m / 60);
        ret.push(m % 24); //时
        m = parseInt(m / 24); //天
        ret.push(m);

        let left_time = "",
            count = 0;
        for (let i = 2; i >= 0; i--) {
            if (ret[i] > 0) {
                count++;
                left_time += ret[i] + ret_u[i];
            }
            if (count >= 2) {
                break;
            }
        }
        return left_time ? left_time : (ret[0] + ret_u[0]);
    }


    // 搜索页面
    if (jq('table.dt').length) {
        jq('table.dt tr:gt(0)').each(function () {
            let tr = jq(this);
            tr.find('td:lt(2)').css("text-align", "center");
            let cat = tr.find('td:eq(4) a').attr('href').match(/forum-(\d+)-1/)[1];
            let id = tr.find('td:eq(2) a').attr('href').match(/thread-(\d+)-1/)[1];
            if (tr.find('td:eq(0) img').length) {
                tr.find('td:eq(0) img').click(function () {
                    window.open("http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + cat + "#clone_" + id);
                });
                tr.find('td:eq(1)').click(function () {
                    jq.get("http://bt.neu6.edu.cn/thread-" + id + "-1-1.html", function (resp) {
                        let str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                        let downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                        let downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                        window.open(downlink);
                    });
                });
            }
        });
    }

    // 评分设置
    if (atHomePage()) {
        jq('#mn_N04e2_menu').append('<li><a id="pfsettings" hidefocus="true" style="color: purple;cursor:pointer">脚本设置</a></li>');
        jq('#pfsettings').click(function () {
            var pfhtml = '<h3 class="flb"><em id="return_reply">脚本设置</em><span><a target="_blank" href="http://bt.neu6.edu.cn/thread-1612462-1-1.html">帮助</a><a href="javascript:;" class="flbc" onclick="hideWindow(\'pfst\')" title="关闭">关闭</a></span></h3><div style="width:580px;height:310px;"><div class="c" style="height:257px;">' +
                '<hr><table><caption>评分设置</caption><tr><td colspan="3"><label><input type="checkbox" id="setnewstyle" checked>使用新样式</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox" id="setnotify">通知作者(超版以上可用)</label></td></tr><tr><td><p><b>设置理由</b></p><textarea id="setreason"></textarea></td><td><p><b>设置浮云评分</b></p><textarea id="setoption2"></textarea></td><td><p><b>设置贡献评分</b></p><textarea id="setoption5"></textarea></td></tr>' +
                '</table><hr><table><caption>脚本设置</caption><tr><td colspan="4"><label><input type="checkbox" id="auto_add" checked>自动增加集数</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox" id="title_check">标题快捷检查</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox" id="search_enhance" checked>开启搜索加强</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox" id="seedsize_human" checked>种子信息加强</label></tr><tr><td><p><b>标题框缩放</b></p><input type="number" id="title_zoom" min="1" max="2" value="1.2" step="0.05"></td><td><p><b>处理延时(秒)</b></p><input type="number" id="second_timeout" min="300" max="1000" value="400" step="10"></td><td><p><b>剧版版主(活跃)</b></p><textarea id="add_rate_user">j552k,baishuangxing,kun2phg</textarea></td><td><p><b>常用链接</b></p><textarea id="common_links"></textarea></td></tr></table><hr>' +
                '</div><div class="o"><button id="submitset">保存设置</button>&nbsp;<button id="submitdelete">清空设置</button></div></div><style>.c textarea{resize:both} .c table td{width:100px}</style>';
            showWindow('pfst', pfhtml, 'html');
            jq('#setnewstyle').prop('checked', GM_getValue('setnewstyle'));
            jq('#setnotify').prop('checked', GM_getValue('setnotify'));
            jq('#setreason').val(tencode(GM_getValue('setreason')));
            jq('#setoption2').val(tencode(GM_getValue('setoption2')));
            jq('#setoption5').val(tencode(GM_getValue('setoption5')));
            jq('#auto_add').prop('checked', GM_getValue('auto_add'));
            jq('#title_check').prop('checked', GM_getValue('title_check'));
            jq('#search_enhance').prop('checked', GM_getValue('search_enhance'));
            jq('#seedsize_human').prop('checked', GM_getValue('seedsize_human'));
            if (GM_getValue('title_zoom')) {
                jq('#title_zoom').val(GM_getValue('title_zoom'));
            }
            if (GM_getValue('second_timeout')) {
                jq('#second_timeout').val(GM_getValue('second_timeout'));
            }
            if (GM_getValue('add_rate_user')) {
                jq('#add_rate_user').val(GM_getValue('add_rate_user'));
            }
            jq('#common_links').val(tencode(GM_getValue('common_links')));
            jq('#submitset').click(function () {
                GM_setValue('setnewstyle', jq('#setnewstyle').prop('checked'));
                GM_setValue('setnotify', jq('#setnotify').prop('checked'));
                GM_setValue('setreason', tparse(jq('#setreason').val()));
                GM_setValue('setoption2', tparse(jq('#setoption2').val()));
                GM_setValue('setoption5', tparse(jq('#setoption5').val()));
                GM_setValue('auto_add', jq('#auto_add').prop('checked'));
                GM_setValue('title_check', jq('#title_check').prop('checked'));
                GM_setValue('search_enhance', jq('#search_enhance').prop('checked'));
                GM_setValue('seedsize_human', jq('#seedsize_human').prop('checked'));
                GM_setValue('title_zoom', jq('#title_zoom').val().trim());
                GM_setValue('second_timeout', jq('#second_timeout').val().trim());
                GM_setValue('add_rate_user', jq('#add_rate_user').val().trim().replace(/\r|\n/g, ',').replace(/\s*,+\s*/g, ','));
                GM_setValue('common_links', tparse(jq('#common_links').val()));
                GM_setValue('already_setted', true);
                hideWindow('pfst');
            });
            jq('#submitdelete').click(function () {
                GM_deleteValue('setnewstyle');
                GM_deleteValue('setnotify');
                GM_deleteValue('setreason');
                GM_deleteValue('setoption2');
                GM_deleteValue('setoption5');
                GM_deleteValue('auto_add');
                GM_deleteValue('title_check');
                GM_deleteValue('search_enhance');
                GM_deleteValue('seedsize_human');
                GM_deleteValue('title_zoom');
                GM_deleteValue('second_timeout');
                GM_deleteValue('add_rate_user');
                GM_deleteValue('common_links');
                GM_deleteValue('already_setted');
                hideWindow('pfst');
            });
        });

        function tparse(input) {
            if (input.trim()) {
                return JSON.stringify(input.trim().replace(/(\r)/g, '').split('\n'));
            } else {
                return '';
            }
        }

        function tencode(input) {
            return input ? (JSON.parse(input).join('\n')) : '';
        }
    }
    // 修改评分按钮click事件
    if (atDetailPage()) {
        jq('.pob>p>a').each(function () {
            if (jq(this).html() == '\u8bc4\u5206') {
                jq(this).attr('ratepid', jq(this).attr('onclick').match(/pid=(\d+)/)[1]);
                jq(this).removeAttr('onclick');
                jq(this).click(function () {
                    openRate(this);
                });
            }
        });
        jq('#ak_rate').each(function () {
            jq(this).attr('ratepid', jq(this).attr('onclick').match(/pid=(\d+)/)[1]);
            jq(this).removeAttr('onclick');
            jq(this).click(function () {
                openRate(this);
            });
        });

        // 评分click事件
        function openRate(target) {
            var loadingst;
            var postget = function () {
                var ratehtml = jq('#fwin_temp_rate').html();
                jq('#fwin_temp_r').remove();
                clearTimeout(loadingst);
                showWindow('rate', ratehtml, 'html');
                if (GM_getValue('setoption2')) {
                    jq('#scoreoption2').html('<li>' + JSON.parse(GM_getValue('setoption2')).join('</li><li>') + '</li>');
                }
                if (GM_getValue('setoption5')) {
                    jq('#scoreoption5').html('<li>' + JSON.parse(GM_getValue('setoption5')).join('</li><li>') + '</li>');
                }
                var reasonselector;
                if (GM_getValue('setreason')) {
                    reasonselector = '<li>' + JSON.parse(GM_getValue('setreason')).join('</li><li>') + '</li>';
                } else {
                    reasonselector = jq('#reasonselect').html();
                }
                if (GM_getValue('setnewstyle')) {
                    var newstylehtml = '<h4 style="width:auto"><a onclick="showselect(this, \'reason\', \'reasonselect\')" class="dpbtn y" href="javascript:;">^</a>\u53ef\u9009\u8bc4\u5206\u7406\u7531:</h4><p class="reason_slct">' +
                        '<input type="text" name="reason" id="reason" class="pt" onkeyup="seditor_ctlent(event, \'$(\\\'rateform\\\').ratesubmit.click()\')"></p><ul id="reasonselect" style="display: none">' + reasonselector + '</ul>';
                    jq('#rateform>.c>.tpclg').html(newstylehtml);
                } else if (GM_getValue('setreason')) {
                    jq('#reasonselect').html(reasonselector);
                }
                if (GM_getValue('setnotify')) {
                    jq('#sendreasonpm').prop('checked', true);
                }
                var rewards_info = getSeedRewards();
                if (rewards_info[0]) {
                    if ((rewards_info[1] > 100) || (rewards_info[2] > 5)) {
                        var addcoulds = ((rewards_info[1] - 100) > 0) ? (rewards_info[1] - 100) : 0;
                        var addcontribution = ((rewards_info[2] - 5) > 0) ? (rewards_info[2] - 5) : 0;
                        rewards_info[1] = (rewards_info[1] > 100) ? 100 : rewards_info[1];
                        rewards_info[2] = (rewards_info[2] > 5) ? 5 : rewards_info[2];
                        alert("大包\n请@其他人补上浮云：" + addcoulds + "，贡献：" + addcontribution + "\n\n已将上述消息复制到快速回复框中...");
                        var msg = "大包，" + current_url + "\n请补上浮云：" + addcoulds + "，贡献：" + addcontribution + ",";
                        for (var name in add_rate_user) {
                            if (add_rate_user[name] != current_user) {
                                msg += " @" + add_rate_user[name] + " ";
                            }
                        }
                        jq("form#fastpostform textarea#fastpostmessage").text(msg);
                    }
                    jq("input#score2").val(rewards_info[1]);
                    jq("input#score5").val(rewards_info[2]);
                    jq("input#reason").val(rewards_info[3]);
                }
            };
            jq('#append_parent').append('<div id="fwin_temp_r" style="display:none"><div id="fwin_temp_rate"></div></div>');
            ajaxget('forum.php?mod=misc&action=rate&tid=' + tid + '&pid=' + jq(target).attr('ratepid') + '&infloat=yes&handlekey=rate' +
                '&t=' + (+new Date()),
                'fwin_temp_rate', null, '', '',
                function () {
                    postget();
                });
            loadingst = setTimeout(function () {
                showDialog('', 'info', '<img src="' + IMGDIR + '/loading.gif"> \u8bf7\u7a0d\u5019...');
            }, second_timeout);
        }
    }
    // 版块
    if (atForumPage() && jq('table#threadlisttableid').length) {
        var move_to = 0;
        if (forum_id == 48 || forum_id == 77) {
            move_to = 58;
        } else if (forum_id == 14 || forum_id == 73) {
            move_to = 62;
        } else if (forum_id == 155) {
            move_to = 14;
        }
        if ([48, 14].indexOf(forum_id) >= 0) {
            jq("ul#thread_types>li:last").after('<li><a id="my_select" href="javascript:void(0)">选择<span class="xg1 num">0</span></a></li><li><a id="my_move" href="javascript:void(0)">移动<span class="xg1 num">0</span></a></li>');
        }
        if ([155, 48, 77, 14, 73, 45, 13].indexOf(forum_id) >= 0 && jq('table#threadlisttableid tr:first input').length) {
            jq("tbody#separatorline:not(.emptb) th").html('<a id="forum_highlight" href="javascript:void(0)">高亮</a>&nbsp;&nbsp;&nbsp;<a id="forum_stick" href="javascript:void(0)">置顶</a>&nbsp;&nbsp;&nbsp;<a id="forum_move" href="javascript:void(0)">移动</a>');
        }
        jq("#my_select").click(function () {
            var time_today = new Date();
            var select_count = 0;
            jq("table#threadlisttableid>tbody").each(function () {
                var tbody = jq(this);
                var size = 0;
                if (tbody.find('tr>td').length > 3) {
                    size = parseFloat(tbody.find('tr td:eq(3)').text());
                }
                var to_delete = false;
                var time_seed = new Date(tbody.find('tr span:last').text());
                if ((time_today - time_seed) >= 31536000000) {
                    to_delete = true;
                }
                if (size > 0 && to_delete && tbody.attr("id") != "separatorline" && tbody.find('tr>td:eq(2)>img').attr("src").match(/signal_0\.png/)) {
                    tbody.find('tr>td:eq(1)>input').click();
                    select_count++;
                }
            });
            jq('#my_select>span').text(select_count);
            jq('#my_move>span').text(select_count);
        });
        jq('#my_move').click(function () {
            myMoveTo(true, move_to, "断种回收，感谢分享");
        });
        jq("a#forum_highlight").click(function () {
            var final_info;
            var info_high = [false, "已经处理过了..."]; //是否已经高亮过了	reason
            jq("table#threadlisttableid>tbody").each(function () {
                if (jq(this).find('input:first').prop("checked") && jq(this).attr("id") != "separatorline") {
                    var gb_size = parseInt(getSeedSize(true, jq(this).find('tr td:eq(3)').text()) / 1024);
                    info_high[0] = (jq(this).find('th a:eq(2)').css('color') == 'rgb(51, 51, 51)') ? false : true;
                    var t_match = jq(this).find('th a:eq(1)').attr('href').match(/typeid=(\d+)/);
                    var type_id = t_match ? t_match[1] : 0;
                    var title_str = jq(this).find('th a:eq(2)').text();
                    final_info = getHighlightInfo(forum_id, type_id, gb_size, getInfoFromTitle(forum_id, gb_size, title_str));
                    return false;
                }
            });
            fillHighlightInfo(true, info_high, final_info);
        });
        jq("a#forum_stick").click(function () {
            var stick_days = 0;
            var stick_reason = "感谢分享";
            jq("table#threadlisttableid>tbody").each(function () {
                if (jq(this).find('input:first').prop("checked") && jq(this).attr("id") != "separatorline") {
                    if (jq(this).attr('id').match(/stickthread/)) {
                        stick_reason = '正在置顶中...';
                        return false;
                    }
                    var gb_size = parseInt(getSeedSize(true, jq(this).find('tr td:eq(3)').text()) / 1024);
                    var title_str = jq(this).find('th a:eq(2)').text();
                    stick_days = getInfoFromTitle(forum_id, gb_size, title_str)[0];
                    return false;
                }
            });
            myStick(true, stick_days, stick_reason);
        });
        jq("a#forum_move").click(function () {
            myMoveTo(true, move_to, "感谢分享");
        });
    }
    // 帖子
    if (atDetailPage()) {
        //
        if (jq('pre').length) {
            let file_info = jq('pre').text().match(/file.*:([\s\S]+)archive/);
            if (title_check && file_info) {
                file_info = file_info[1].split(/\(\d+\)/)[0].trim().replace(/^.*\//, '');
                let seed_info = jq('p.attnm>a').text().replace(".torrent", "");
                if (file_info.indexOf(seed_info) == -1) {
                    file_info += ' | ' + seed_info;
                }
                jq('div.pct>div>div.mtw.mbw').append('<b> | ' + file_info + '</b>');
            }
            //文件大小人性化显示
            if (seedsize_human) {
                let utorrentinfo = jq('ignore_js_op>dl.tattl>dd>pre').text();
                utorrentinfo = utorrentinfo.replace(/size\.+:\s(\d+)/ig, function ($1) {
                    var b_size = parseInt($1.match(/\d+/)[0]);
                    var m_size = (b_size / 1024 / 1024).toFixed(2);
                    if (m_size >= 1000) {
                        return $1 + " = " + (m_size / 1024).toFixed(2) + "(G)";
                    }
                    return $1 + " = " + m_size + "(M)";
                });
                let filecount = 0;
                utorrentinfo = utorrentinfo.replace(/\s\(\d{3,}\)/ig, function ($1) {
                    var b_size = parseInt($1.match(/\d+/)[0]);
                    var m_size = (b_size / 1024 / 1024).toFixed(2);
                    filecount++;
                    if (m_size >= 1000) {
                        return " [" + b_size + " = " + (m_size / 1024).toFixed(2) + "(G)]";
                    } else if ((b_size / 1024) >= 1000) {
                        return " [" + b_size + " = " + m_size + "(M)]";
                    } else if (b_size >= 1000) {
                        return " [" + b_size + " = " + (b_size / 1024).toFixed(2) + "(K)]";
                    }
                    return " [" + b_size + " = " + b_size + "(B)]";
                });
                utorrentinfo = utorrentinfo.replace(/files\./, "files(总共" + filecount + "个文件).");
                jq('ignore_js_op>dl.tattl>dd>pre').text(utorrentinfo);
            }
        }
        if (tv_forum.indexOf(forum_id) >= 0) {
            jq('div#modmenu span:last').before('<span class="pipe">|</span><a id="isrepeat" href="javascript:;">重复</a><span class="pipe">|</span><a id="commonquestions" href="javascript:;">常见问题</a>');
        }

        jq("div#modmenu>a:eq(2)").removeAttr('onclick');
        jq("div#modmenu>a:eq(2)").bind('click', myStickSub);
        jq("div#modmenu>a:eq(4)").removeAttr('onclick');
        jq("div#modmenu>a:eq(4)").bind('click', myHighlightSub);
        jq("div#modmenu>a:eq(8)").removeAttr('onclick');
        jq("div#modmenu>a:eq(8)").bind('click', myMoveToSub);
        //常用链接
        let seedid = location.href.match(/(thread-|tid=)(\d+)/)[2];
        let index = 0;
        jq('div.pob.cl').each(function () {
            let seed_p = jq(this).find('p');
            let quote_id = jq('td.t_f:eq(' + index + ')').attr("id").match(/postmessage_(\d+)/)[1];
            let link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + forum_id + "&extra=page%3D1&tid=" + seedid + "&reppost=" + quote_id;
            if (index > 0) {
                link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + forum_id + "&extra=page%3D1&tid=" + seedid + "&repquote=" + quote_id;
            }
            index++;
            let commonlink = "commonlink_" + index;
            seed_p.find('a:first').before('<a href="javascript:;" id="' + commonlink + '" onmouseover="showMenu(this.id)" class="showmenu">常用链接</a>');
            // 添加常用链接
            let commonlink_string = '<ul id="' + commonlink + '_menu" class="p_pop mgcmn" style="display: none;"><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/084832wh4p2z362amsf4mv.png) no-repeat 4px 50%;" target="_blank" href="' + link_reply + '">回复本帖高级</a></li>';
            for (let key in common_links) {
                let s = common_links[key].split(':http');
                if (s.length == 2) {
                    commonlink_string = commonlink_string + '<li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/104809kzjj6ujkzpv6j6uj.png) no-repeat 4px 50%;" target="_blank" href="http' + s[1].trim() + '">' + s[0].trim() + '</a></li>';
                }
            }
            commonlink_string = commonlink_string + "</ul>";
            seed_p.after(commonlink_string);
        });
    }
    if (location.href.match(/action=reply&fid=/)) {
        var seed_forum = location.href.match(/action=reply&fid=(\d+)/)[1];
        if (tv_forum.indexOf(parseInt(seed_forum)) >= 0) {
            jq('span#subjecthide').after('<span class="pipe">|</span><a id="commonquestions" href="javascript:;">常见问题</a>');
        }
    }
    // 数字转2位字符串
    function numToString2(num) {
        return (num < 10) ? ("0" + num) : (num.toString());
    }
    // 是否是闰年
    function isLeapYear(year) {
        return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
    }
    // 是否已经高亮过了
    function getAlreadyHighlight() {
        var res = [false, ""];
        if (jq("div.modact").length && jq("div.modact>a").text().indexOf("高亮") > 0) {
            res[0] = true;
            res[1] = jq("div.modact>a").text();
        }
        return res;
    }
    // 是否已经置顶过了
    function getAlreadyStick() {
        var res = [false, ""];
        if (jq("div.modact").length && jq("div.modact>a").text().indexOf("置顶") > 0) {
            res[0] = true;
            res[1] = jq("div.modact>a").text();
        }
        return res;
    }
    // 移动
    function myMoveTo(forum, move_to, move_to_reason) {
        if (forum) {
            tmodthreads(2, 'move');
        } else {
            modthreads(2, 'move');
        }
        setTimeout(function () {
            jq("#moderateform select#moveto").val(move_to);
            jq("#moderateform textarea#reason").text(move_to_reason);
        }, second_timeout);
    }

    function myMoveToSub() {
        myMoveTo(false, forum_id, "感谢分享");
    }
    // 置顶
    function myStick(forum, stick_days, stick_reason) {
        if (forum) {
            tmodthreads(1, 'stick');
        } else {
            modthreads(1, 'stick');
        }
        setTimeout(function () {
            if (stick_days > 0) {
                jq('#itemcp_stick>table>tbody>tr:nth-child(1)>td.hasd>div>select').val(1);
                jq('#expirationstick').val(myTime(0, stick_days));
            }
            jq("#moderateform textarea#reason").text(stick_reason);
        }, second_timeout);
    }

    function myStickSub() {
        var stick_reason = '感谢分享';
        var stick_days = 0;
        var stick_info = getAlreadyStick();
        if (stick_info[0]) {
            stick_reason = stick_info[1];
        } else {
            stick_days = getInfoFromTitle(forum_id, parseInt(getSeedSize(false, "") / 1024), "")[0];
        }
        myStick(false, stick_days, stick_reason);
    }

    function myHighlightSub() {
        var i_highlight = getAlreadyHighlight();
        var typeid = jq("h1.ts a").attr("href").match(/typeid=(\d+)/)[1];
        // [置顶天数, 颜色, 加粗, 高亮时间(-1:永久)]
        var high_info = getHighlightInfo(forum_id, typeid, parseInt(getSeedSize(false, "") / 1024), "");
        if (getAlreadyStick()[0]) {
            high_info[0] = 0;
        }
        fillHighlightInfo(false, i_highlight, high_info);
    }
    //获取种子大小，返回int(MB)
    function getSeedSize(forum, size_str) {
        var res = 0;
        var seed_size, seed_size_unit;
        if (!forum) {
            var size_str_match = jq('div.pcb div.mtw.mbw').text().match(/\d+.*/);
            size_str = size_str_match ? size_str_match[0] : "";
        }
        var u_size = size_str.match(/[MGT]B/);
        seed_size_unit = u_size ? u_size[0] : 0;
        seed_size = parseFloat(size_str);

        if ("GB" === seed_size_unit) {
            res = parseInt(seed_size * 1024);
        } else if ("MB" === seed_size_unit) {
            res = parseInt(seed_size);
        } else if ("TB" === seed_size_unit) {
            res = parseInt(seed_size * 1024 * 1024);
        }
        return res;
    }
    //获取标题中的信息
    function getInfoFromTitle(seed_type, gb_size, title) {
        var res = [0, 0]; //res[0]:(置顶天数)	res[1]:(1:剧集首集, 2:高清韩剧, 3:高清日剧)
        title = (title) ? title : jq("span#thread_subject").text();
        if (seed_type == 48 || seed_type == 77) { //高清
            if (title.match(/韩/)) {
                res[1] = 2;
            } else if (title.match(/日/)) {
                res[1] = 3;
            }
            if (seed_type == 48 && title.match(/(S\d+E01)|([EP]*01[\.\s-])/i)) {
                res[0] = 1;
                res[1] = 1;
            }
            if (seed_type == 48 && gb_size >= 10) {
                res[0] = 1;
            }
            if ((seed_type == 77) && (gb_size >= 10)) {
                res[0] = 3;
            }
        } else if (seed_type == 14 || seed_type == 73) {
            if (seed_type == 14 && title.match(/(\[01)|(EP?01)/i)) {
                res[1] = 1;
            }
            if (seed_type == 73 && (gb_size >= 50)) {
                res[0] = 2;
            }
        }
        return res;
    }
    //获取高亮信息
    function getHighlightInfo(seed_type, type_id, gb_size, title_info) {
        title_info = (title_info) ? title_info : getInfoFromTitle(seed_type, gb_size, "");
        let res = [title_info[0], -1, 0, 0]; //[置顶天数, 颜色, 加粗, 高亮时间(-1:永久)]
        let title = jq("span#thread_subject").text();
        if (seed_type == 14 || seed_type == 73) {
            if (seed_type == 14) {
                res[3] = 1; //电视剧集高亮一天
            }
            if (seed_type == 73) { //完结剧集
                res[2] = 1; //加粗
                if (gb_size < 10) {
                    res[3] = 7;
                } else if (gb_size < 20) {
                    res[3] = 30 + (gb_size - 10) * 3;
                } else if (gb_size < 30) {
                    res[3] = 90;
                } else {
                    res[3] = -1;
                }
            }
            if (title_info[1] == 1) { //首集
                res[1] = 2;
                res[2] = 1;
                res[3] = 7;
            } else if (type_id == 101 || type_id == 298) {
                res[1] = 3;
            } else if (type_id == 102 || type_id == 299) {
                res[1] = 7;
            } else if (type_id == 103 || type_id == 300) {
                res[1] = 8;
            } else if (type_id == 104 || type_id == 301) {
                res[1] = 5;
            } else if (type_id == 105 || type_id == 302) {
                res[1] = 6;
            }
        } else if (seed_type == 48 || seed_type == 77) { //高清剧集
            if (seed_type == 48) {
                res[3] = 3;
            } else {
                res[2] = 1;
                res[3] = -1;
            }
            if (title_info[1] == 1) { //首集
                res[2] = 1;
                res[3] = -1;
            }
            if (seed_type == 77 && gb_size >= 100) {
                res[1] = 1;
            } else if (type_id == 247 || type_id == 178) {
                res[1] = 7;
            } else if (type_id == 248 || type_id == 179) {
                res[1] = 2;
            } else if (type_id == 249 || type_id == 180) {
                if (title_info[1] == 2) { //韩剧{
                    res[1] = 6;
                } else if (title_info[1] == 3) { //日剧
                    res[1] = 5;
                }
            } else if (type_id == 250 || type_id == 181) {
                res[1] = 4;
            }
        } else if (seed_type == 45) { //高清电影
            let topGroup = ["CtrlHD", "CRiSC", "DON", "EbP", "SbR", "VietHD", "RightSiZE", "NTb", "BMF", "D-Z0N3", "decibeL", "HiFi", "NCmt", "ZQ", "de[42]", "FoRM", "HiDt", "HDMaNiAcS"];
            let popGroup = ["ATHD", " FraMeSToR", "HDAccess", "HDxT", "TayTO", "ESiR", "THORA", "HDClassic", "iLL", "PerfectionHD", "HDWinG", "WiKi", "CHD", "beAst", "R2HD", "HDS", "MTeam", "CMCT", "EPiC", "HDTime", "HDChina", "Tron"];
            let zeroGroup = ["2HD", "aAf", "aBD", "ALLiANCE", "AMIABLE", "AVCHD", "AVS720", "BAJSKORV", "BestHD", "BiA", "CBGB", "Chakra", "CiNEFiLE", "CROSSBOW", "CTU", "CYBERMEN", "DiCH", "DIMENSION", "FSiHD", "HAiDEAF", "HALCYON", "HANGOVER", "hV", "IMMERSE", "iNFAMOUS", "Japhson", "LCHD", "MELiTE", "METiS", "NGR", "NODLABS", "ORENJi", "OUTDATED", "publicHD", "REFiNED", "REVEiLL", "SiNNERS", "SPARKS", "THUGLiNE", "XPRESS"];
            if (title.match(/4K/i) && title.match(/Remux/i)) {
                res = [0, 2, 1, -1];
            } else if (title.match(/Remux/i)) {
                res = [0, 5, 0, -1];
            } else if (title.match(/2160p/i)) {
                res = [0, 2, 0, -1];
            } else if (title.match(new RegExp(topGroup.join('|'), "i"))) {
                res = [0, 7, 0, -1];
                res[2] = title.match(/1080p/i) ? 1 : 0;
            } else if (title.match(new RegExp(popGroup.join('|'), "i"))) {
                res = [0, 8, 0, 7];
            } else if (title.match(new RegExp(zeroGroup.join('|'), "i"))) {
                res = [0, 3, 0, 3];
            } else if (title.match(/原创/)) {
                res = [0, 3, 0, -1];
            } else if (title.match(/合集/)) {
                res = [0, 8, 1, -1];
            }
        } else if (seed_type == 13) {
            if (title.match(/BluRay.*(CMCT|CnSCG)/i) && title.match(/720p/i)) {
                res = [0, 5, 0, -1];
            } else if (title.match(/(BluRay|HDTV).*WOFEI/i) || title.match(/HDTV(CMCT|CMCTV|CnSCG)/i)) {
                res = [0, 5, 0, 15];
            } else if (title.match(/BDRip.*(iNT-TLF|BDRip-BMDruCHinYaN|MicroHD-mFANs|MNHD-FRDS)/i)) {
                res = [0, 7, 0, -1];
            } else if (title.match(/HR-HDTV.*-YYeTs/i)) {
                res = [0, 4, 0, 15];
            } else if (title.match(/DVDISO/i)) {
                res = [0, 3, 1, -1];
            } else if (title.match(/DVDRip/i)) {
                res = [0, 8, 0, 7];
            } else if (title.match(/BluRay.*(beAst|HDS|Mteam)/i) && title.match(/720p/i)) {
                res = [0, 8, 0, -1];
            }
        }
        //alert("(置顶天数 " + res[0] + ", 颜色 " + res[1] + ", 加粗 " + res[2] + ", 高亮时间 " + res[3] + ")");
        return res;
    }
    //计算时间
    function myTime(addmonth, addday) {
        var mydate = new Date();
        var add_day = addmonth * 30 + addday;
        var t_year = mydate.getFullYear();
        var t_month = mydate.getMonth() + 1; //0-11
        var t_day = mydate.getDate() + add_day; //1-31
        var t_hour = mydate.getHours(); //0-23
        var t_min = mydate.getMinutes(); //0-59

        var dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        dayofmonths[1] = (isLeapYear(t_year)) ? (dayofmonths[1] + 1) : dayofmonths[1];

        while (t_day > dayofmonths[t_month - 1]) {
            t_day -= dayofmonths[t_month - 1];
            t_month += 1;
            if (t_month > 12) {
                t_month -= 12;
                t_year += 1;
                dayofmonths[1] = (isLeapYear(t_year)) ? (dayofmonths[1] + 1) : dayofmonths[1];
            }
        }
        t_year = t_year.toString();
        t_month = numToString2(t_month);
        t_day = numToString2(t_day);
        t_hour = numToString2(t_hour);
        t_min = numToString2(t_min);
        return t_year + "-" + t_month + "-" + t_day + " " + t_hour + ":" + t_min;
    }
    //高亮具体信息填写
    function fillHighlightInfo(forum, i_highlight, high_info) {
        if (forum) {
            tmodthreads(1, 'highlight');
        } else {
            modthreads(1, 'highlight');
        }
        if (i_highlight[0]) {
            setTimeout(function () {
                jq("#moderateform textarea#reason").text(i_highlight[1]);
            }, second_timeout);
        } else {
            setTimeout(function () {
                var b_color = ['rgb(0, 0, 0)', 'rgb(238, 27, 46)', 'rgb(238, 80, 35)', 'rgb(153, 102, 0)', 'rgb(60, 157, 64)', 'rgb(40, 151, 197)', 'rgb(43, 101, 183)', 'rgb(143, 42, 144)', 'rgb(236, 18, 130)'];
                // 置顶
                if (high_info[0] > 0 && (!jq("#moderateform li#itemcp_stick").hasClass('copt'))) {
                    jq("#moderateform li#itemcp_stick table td:first input").click();
                    jq("#moderateform li#itemcp_stick table td:eq(1) select").val(1);
                    jq("#moderateform li#itemcp_stick table input#expirationstick").val(myTime(0, high_info[0]));
                }
                // 颜色
                if (high_info[1] >= 0 && high_info[1] <= 8) {
                    jq("#moderateform li#itemcp_highlight table input#highlight_color").val(high_info[1]);
                    jq("#moderateform li#itemcp_highlight table a#highlight_color_ctrl").css('background-color', b_color[high_info[1]]);
                }
                // 加粗
                if ((high_info[2] == 1) && (!jq("#moderateform li#itemcp_highlight table a#highlight_op_1").hasClass('cnt'))) {
                    jq("#moderateform li#itemcp_highlight table a#highlight_op_1").click();
                }
                // 高亮时间
                if (high_info[3] > 0) {
                    jq("#moderateform li#itemcp_highlight table input#expirationhighlight").val(myTime(0, high_info[3]));
                } else if (high_info[3] == -1) {
                    jq("#moderateform li#itemcp_highlight table input#expirationhighlight").val('');
                }
                // 原因
                jq("#moderateform textarea#reason").text("感谢分享");
            }, second_timeout);
        }
    }
    //计算帖子奖励
    function getSeedRewards() {
        let clouds = 0;
        let contribution = 0;
        let ratereason = "";

        let rate_already = false;
        jq("div.pct:first table.ratl tbody.ratl_l tr").each(function () {
            var tr = jq(this);
            var user = tr.find('a:eq(1)').text().trim();
            if ((jq.inArray(user, add_rate_user)) >= 0) {
                rate_already = true;
                return false;
            }
        });
        let reasons = ["帖子规范，资源优秀，谢谢您的分享", "更新辛苦，图文并茂，格式规范，奖励"];
        let seedsize = getSeedSize(false, "");

        if ((!rate_already) && (forum_id > 0) && (seedsize > 0)) {
            seedsize = parseFloat(seedsize / 1024).toFixed(2); //GB
            clouds = 0;
            contribution = 0;
            let d = new Date();
            let index = d.getSeconds() % 2;
            ratereason = reasons[index];
            let nummatch, num;
            let title = jq("span#thread_subject").text();
            if (forum_id == 77) { //高清剧合集
                if (seedsize >= 400) {
                    clouds = 200;
                    contribution = 7;
                } else if (seedsize >= 200) {
                    clouds = 100 + Math.ceil((seedsize - 200) / 2);
                    contribution = 5 + Math.ceil((seedsize - 200) / 100);
                } else if (seedsize >= 100) {
                    clouds = Math.ceil(60 + (seedsize - 100) * 40 / 100);
                    contribution = 4;
                } else if (seedsize >= 60) {
                    clouds = Math.ceil(10 + seedsize - 60);
                    contribution = 3;
                } else if (seedsize >= 30) {
                    clouds = 10;
                    contribution = 2;
                } else if (seedsize >= 10) {
                    clouds = 0;
                    contribution = 1;
                }
            } else if (forum_id == 48) { //高清剧集
                contribution = 0;
                nummatch = title.match(/EP?(\d+)(-E?P?(\d+))?/i);
                if (nummatch) {
                    if (nummatch[3]) {
                        num = nummatch[3] - nummatch[1] + 1;
                        if (num >= 10) {
                            clouds = 30;
                        } else if (num >= 5) {
                            clouds = 20;
                        } else if (num >= 3) {
                            clouds = 10;
                        } else {
                            clouds = 0;
                        }
                    } else {
                        num = 1;
                    }
                    if (nummatch[1] == 1) {
                        clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
                    }
                    if ((seedsize / num) >= 2) {
                        clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
                    }
                }
            } else if (forum_id == 73) { //完结剧集
                if (seedsize >= 120) {
                    clouds = 100;
                    contribution = 5;
                } else if (seedsize >= 80) {
                    clouds = (60 + seedsize - 80).toFixed(0);
                    contribution = 4;
                } else if (seedsize >= 40) {
                    clouds = (40 + (seedsize - 40) * 20 / 40).toFixed(0);
                    contribution = 3;
                } else if (seedsize >= 20) {
                    clouds = (20 + seedsize - 20).toFixed(0);
                    contribution = 2;
                } else if (seedsize >= 10) {
                    clouds = (10 + seedsize - 10).toFixed(0);
                    contribution = 1;
                }
            } else if (forum_id == 14) { //电视剧集
                contribution = 0;
                nummatch = title.match(/EP?(\d+)(-E?P?(\d+))?\]/i);
                nummatch = nummatch ? nummatch : (title.match(/(\d+)(-(\d+))?\]/i));
                if (nummatch) {
                    if (nummatch[3]) {
                        num = nummatch[3] - nummatch[1] + 1;
                        if (num >= 10) {
                            clouds = 30;
                        } else if (num >= 5) {
                            clouds = 20;
                        } else if (num >= 3) {
                            clouds = 10;
                        } else {
                            clouds = 0;
                        }
                    } else {
                        num = 1;
                    }
                    if (nummatch[1] == 1) {
                        clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
                    }
                    if ((seedsize / num) >= 1) {
                        clouds = ((clouds + 10) >= 30) ? 30 : (clouds + 10);
                    }
                }
            } else if (forum_id == 49) { //高清记录
                contribution = Math.ceil(seedsize / 20);
                if (seedsize >= 10) {
                    clouds = Math.ceil(seedsize / 10) * 10;
                } else if (seedsize >= 3) {
                    clouds = 10;
                }
            } else if (forum_id == 155) { //电视剧集试种区
                clouds = 10;
                contribution = 2;
                ratereason = "补加浮云和贡献奖励，感谢分享";
            } else if (forum_id == 45) { //高清电影
                ratereason = "补加浮云和贡献奖励，感谢分享";
                let topGroup = ["CtrlHD", "CRiSC", "DON", "EbP", "SbR", "VietHD", "RightSiZE", "NTb", "BMF", "D-Z0N3", "decibeL", "HiFi", "NCmt", "ZQ", "de[42]", "FoRM", "HiDt", "HDMaNiAcS"];
                let popGroup = ["ATHD", " FraMeSToR", "HDAccess", "HDxT", "TayTO", "ESiR", "THORA", "HDClassic", "iLL", "PerfectionHD", "HDWinG", "WiKi", "CHD", "beAst", "R2HD", "HDS", "MTeam", "CMCT", "EPiC", "HDTime", "HDChina", "Tron"];
                if (title.match(/Remux/i)) { //无损资源
                    contribution = 2;
                    clouds = (seedsize >= 40) ? 60 : 40;
                    clouds = (seedsize >= 30) ? 50 : 40;
                } else if (title.match(new RegExp(topGroup.join('|'), "i"))) { //TOP组
                    contribution = (seedsize >= 9.5 || title.match(/1080p|合集/i)) ? 2 : 1;
                    clouds = 40;
                } else if (title.match(new RegExp(popGroup.join('|'), "i"))) { //主流组
                    if (seedsize >= 20) {
                        contribution = 2;
                        clouds = 40;
                    } else if (seedsize >= 9.5) {
                        contribution = 1;
                        clouds = 40;
                    }
                } else if (title.match(/合集|全集/)) {
                    if (seedsize >= 100) {
                        contribution = 5;
                        clouds = 100;
                    } else if (seedsize >= 60) {
                        contribution = 4;
                        clouds = 80;
                    } else if (seedsize >= 40) {
                        contribution = 3;
                        clouds = 60;
                    } else if (seedsize >= 20) {
                        contribution = 2;
                        clouds = 40;
                    } else if (seedsize >= 9.5) {
                        contribution = 1;
                        clouds = 40;
                    }
                } else if (seedsize >= 9.5) {
                    contribution = 1;
                    clouds = 40;
                }
                contribution = (contribution > 5) ? 5 : contribution;
                clouds = (clouds > 100) ? 100 : clouds;
            } else if (forum_id == 13 && title.match(/\d{4}-\d{4}/)) { //电影
                ratereason = "补加浮云和贡献奖励，感谢分享";
                if (seedsize >= 30) {
                    contribution = 5;
                    clouds = 100;
                } else if (seedsize >= 20) {
                    contribution = 4;
                    clouds = 80;
                } else if (seedsize >= 15) {
                    contribution = 3;
                    clouds = 60;
                } else if (seedsize >= 5) {
                    contribution = 2;
                    clouds = 40;
                } else {
                    contribution = 1;
                    clouds = 20;
                }
            } else {
                clouds = 0;
                contribution = 0;
            }
        } else {
            let setrateinfo = {
                "38": [10, 0, "送上鲜花"],
                "87": [10, 0, "送鲜花"],
                "32": [10, 0, "送鲜花"],
                "136": [1, 0, "已发送，请尽快注册"],
                "4": [100, 0, "剧版猜谜活动奖励"]
            };
            if (setrateinfo[forum_id]) {
                clouds = setrateinfo[forum_id][0];
                contribution = setrateinfo[forum_id][1];
                ratereason = setrateinfo[forum_id][2];
            }
        }
        let fill_in = ((clouds > 0) || (contribution > 0)) ? true : false;
        return [fill_in, clouds, contribution, ratereason];
    }

    if (atDetailPage()) {
        //解析文件信息
        function praseFileInfo(text) {
            var res = [];
            var file_info = text.replace(/info.*\n/, "").replace(/directory.*\n/, "");
            if (file_info.indexOf("files") >= 0) {
                file_info = file_info.replace(/archive.*/, "").replace(/file.*:{1}\n?/, "");
                var arr1 = file_info.split("\n");
                for (var i = 0; i < arr1.length; i++) {
                    var match = arr1[i].match(/(.*)[\(\[](\d+)[\)\s]/);
                    if (match && match.length >= 3) {
                        res.push([match[1].trim(), match[2], false]);
                    }
                }
            } else {
                file_info = file_info.replace(/archive.*:{1}/, "").replace(/file.*:{1}\n?/, "");
                var arr2 = file_info.split("\n");
                res.push([arr2[0].trim(), arr2[1].match(/\d+/)[0], false]);
            }
            return res;
        }

        jq('#isrepeat').click(function () {
            var pfhtml = '<h3 class="flb"><em id="return_reply">帖子相似度判断</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'irdialog\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div style="width:580px;height:380px;">' +
                '<div class="c" style="height:327px;">' +
                '<div class="pbt cl"><span><span>帖子链接: </span><input type="text" style="width:310px;" id="is_id" class="px">&nbsp;&nbsp;<button style="width:75px;" id="is_submit">提交</button>&nbsp;&nbsp;&nbsp;&nbsp;<button style="width:75px;" id="is_open">打开</button></span></div>' +
                '<div id="ir_list" style="overflow-y:scroll;width:550px; height:290px;"></div>' +
                '</div><div class="o"><button style="width:75px;" id="is_reply">回复</button>&nbsp;&nbsp;&nbsp;&nbsp;<button style="width:75px;" id="irclose">关闭</button></div><style>.c p{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}</style>';
            showWindow('irdialog', pfhtml, 'html');
            jq('#irclose').click(function () {
                hideWindow('irdialog');
            });
            jq('#is_open').click(function () {
                var link = jq('#is_id').val().trim();
                var seedfrom = (/^\d+$/.test(link)) ? link : link.match(/(thread-|tid=)(\d+)/)[2];
                window.open('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html');
            });
            var reason1 = "感谢分享，剧版已有相同版本：\n";
            var reason2 = "\n\n资源重复，欢迎续种";
            var title = "";
            jq('#is_reply').click(function () {
                var link = jq('#is_id').val().trim();
                var seedfrom = (/^\d+$/.test(link)) ? link : link.match(/(thread-|tid=)(\d+)/)[2];
                link = 'http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html';
                jq("form#fastpostform textarea#fastpostmessage").append(reason1 + title + ": " + link + reason2);
            });
            jq('#is_submit').click(function () {
                var link = jq('#is_id').val().trim();
                var seedfrom = (/^\d+$/.test(link)) ? link : link.match(/(thread-|tid=)(\d+)/)[2];

                var text1 = jq('ignore_js_op>dl.tattl>dd>pre').text();
                var thisinfo = praseFileInfo(text1);
                jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function (resp) {
                    var page = jq(resp);
                    title = page.find("span#thread_subject").text();
                    var text2 = page.find('ignore_js_op>dl.tattl>dd>pre').text();
                    var thatinfo = praseFileInfo(text2);
                    for (var i = 0; i < thisinfo.length; i++) {
                        var j = 0;
                        for (j = 0; j < thatinfo.length; j++) {
                            if (thisinfo[i][1] == thatinfo[j][1]) {
                                thisinfo[i][2] = true;
                                break;
                            }
                        }
                        thatinfo.splice(j, 1);
                    }
                    var ir_list_html = '<table style="width:540px" border="0">';
                    var no_match_html = '';
                    var that_match_html = '<tr><td colspan="3" style="color:green">[另一个帖子未匹配列表如下]</td></tr>';
                    for (i = 0; i < thisinfo.length; i++) {
                        if (thisinfo[i][2]) {
                            ir_list_html += "<tr><td><b style=\"color:red\">√</b></td><td>" + thisinfo[i][1] + "</td><td>" + thisinfo[i][0] + "</td></tr>";
                        } else {
                            no_match_html += "<tr><td><b style=\"color:black\">×</b></td><td>" + thisinfo[i][1] + "</td><td>" + thisinfo[i][0] + "</td></tr>";
                        }
                    }
                    for (i = 0; i < thatinfo.length; i++) {
                        that_match_html += "<tr><td><b style=\"color:black\">×</b></td><td>" + thatinfo[i][1] + "</td><td>" + thatinfo[i][0] + "</td></tr>";
                    }
                    ir_list_html += no_match_html + that_match_html + '</table>';
                    jq('#ir_list').html(ir_list_html);
                });
            });
        });

        jq('#commonquestions').click(function () {
            var replay_index = 0;
            var com_qus = [
                "请按照这个格式修改标题：[中文名/外文名][季度集数][分辨率/录制片源/文件格式][语言/字幕][发布组名称或文件来源][其他说明]",
                "请按照这个格式修改标题：[简体中文名称][0day英文全名][语言/字幕情况][其他说明]",
                "发帖时不要删掉上方的剧版公告，请补上",
                "图片请上传到本地，请不要使用外链图片",
                "关于图片位置，编辑时，点击图片按钮打开图片列表，用鼠标点到想要插入图片的位置，然后点击刚刚上传的图片就可以了（海报放在顶部，缩略图放在简介下面）。\n[img=400,0]http://bt.neu6.edu.cn/data/attachment/forum/201801/04/175841pollw3u2uuadxxaj.gif[/img]",
                "请添加标签（必须要有中文剧名），填写中文剧名，另外可添加英文剧名，主要演员，版本（制作组）等信息。在帖子左下角：\n[img]http://bt.neu6.edu.cn/data/attachment/forum/201407/09/214058rb1rymm11ps6zpf1.png[/img]",
                "下载帖子下面的新种子文件，用UT打开它开始做种 （选择下载位置与文件所在的位置吻合，自己的种子勾选上跳过校验）。成功连接后会显示有一格信号的，之后只要保持做种状态就可以了（Tracker bt.neu6.edu正常工作中）",
                "完结剧集请发到相应板块：\n高清剧合集：[url=http://bt.neu6.edu.cn/forum-77-1.html]http://bt.neu6.edu.cn/forum-77-1.html[/url]\n完结剧集：[url=http://bt.neu6.edu.cn/forum-73-1.html]http://bt.neu6.edu.cn/forum-73-1.html[/url]",
                "字幕及其他无关文件禁止出现在种子中，如：与资源无关的图片/文档/链接/uT临时文件/BT种子文件等\n例如： ",
                "除非有特殊情况（稀有资源、古董级资源、字幕组有特殊说明），本版只允许发布格式统一版本（包括压制字幕组），禁止发布混合字幕组或混合格式的合集。",
                "如果字幕组没有发布统一文件格式是允许发布混合合集。以后有这种情况请在简介下面加个简单额说明，之后欢迎再补上统一格式版本。",
                "因为这部剧本季未播放完毕，所以不接收包含剧版已有资源的小合集。\n剧版已有相同版本的单集，例如：",
                "剧版已有相同版本：\n资源重复，欢迎续种",
                "日韩剧请选择分类“其他1”，欧美剧请选择分类“其他2”",
                "高清区资源发布均为HDTV/Bluray来源的720P及以上分辨率高清电视剧集，码率要求为：欧美剧 >3500kbps; 非欧美剧>2500kbps。\n（欧美剧0day资源码率要求可以降低，但必须为MKV格式。WEB来源，带有网站水印的电视剧集，码率要求为 >3000kps)",
                "高清资源请补上视频编码或者复制粘贴NFO信息（置为代码（编辑器中（[b]<>[/b]）按钮）），编码信息制作教程：\n[url=http://bt.neu6.edu.cn/thread-1633434-1-1.html]http://bt.neu6.edu.cn/thread-1633434-1-1.html[/url]",
                "因为文件名无0day或压制组信息，请补上一张视频缩略图\n缩略图制作教程：[url=http://bt.neu6.edu.cn/thread-1633434-1-1.html]http://bt.neu6.edu.cn/thread-1633434-1-1.html[/url]",
                "帖子发布后就不能再修改种子文件，服务器无法识别第二次上传的，所以现在种子失效了（正常情况下，帖子下面可以看到种子和文件信息的）\n种子失效了，请重新制作新种子文件，发新帖",
                "剧版已有相同版本：\n如果旧帖已断种和无法直接续种（校验失败）允许重新发新帖但请在帖子顶部提供旧帖的链接和简单说明情况",
                "“任何资源发布请尊重原始制作小组或制作者；发布请保持原作者文件属性（原始文件名、小组信息等），资源相同的情况下优先保留保持原始文件名的资源。”\n这个的原始文件名应该是：",
                "编码信息需要置为代码，方法如下：\n[img=450,0]http://bt.neu6.edu.cn/data/attachment/forum/201801/04/175847c44zroqqsru9dg4s.gif[/img]"
            ];
            let pfhtml = '<h3 class="flb"><em id="return_reply">剧版常见问题</em><span><a href="javascript:;" class="flbc" id="cqclose1" title="关闭">关闭</a></span></h3><div style="width:580px;height:420px;">' +
                '<div id="cqreason" class="c" style="height:367px;">';
            for (let val = 0; val < com_qus.length; val++) {
                if ((val % 2) === 0) {
                    pfhtml = pfhtml + '<p><span>(' + (val + 1) + ')</span><span>' + com_qus[val] + '</span></p>';
                } else {
                    pfhtml = pfhtml + '<p style="background: #F0F0F0"><span>(' + (val + 1) + ')</span><span>' + com_qus[val] + '</span></p>';
                }
            }

            pfhtml = pfhtml + '</div><div class="o"><button id="cqclose">关闭</button></div><style>.c p{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}</style>';
            showWindow('comques', pfhtml, 'html');
            jq('#cqclose').click(function () {
                hideWindow('comques');
                if (location.href.match(/action=reply&fid=/)) {
                    if (jq('#e_iframe').contents().find('body').html()) {
                        jq('#e_iframe').contents().find('body').html(jq('#e_iframe').contents().find('body').html() + bbcode2html("\n修改后请回复"));
                    }
                } else {
                    if (jq("form#fastpostform textarea#fastpostmessage").text()) {
                        jq("form#fastpostform textarea#fastpostmessage").append("\n修改后请回复");
                    }
                }
            });
            jq('#cqclose1').click(function () {
                jq('#cqclose').click();
            });
            jq('div#cqreason>p').each(function () {
                jq(this).click(function () {
                    if (location.href.match(/action=reply&fid=/)) {
                        if (replay_index === 0) {
                            jq('#e_iframe').contents().find('body').html(bbcode2html("感谢分享\n\n"));
                        }
                        replay_index++;
                        jq('#e_iframe').contents().find('body').html(jq('#e_iframe').contents().find('body').html() + bbcode2html(replay_index + ") " + jq(this).find('span:last').text() + "\n"));

                    } else {
                        if (replay_index === 0) {
                            jq("form#fastpostform textarea#fastpostmessage").append("感谢分享\n\n");
                        }
                        replay_index++;
                        jq("form#fastpostform textarea#fastpostmessage").append(replay_index + ") " + jq(this).find('span:last').text() + "\n");
                    }
                });
                jq(this).hover(function () {
                    jq(this).css({
                        "font-weight": "bold",
                        "font-size": '110%'
                    });
                }, function () {
                    jq(this).css({
                        "font-weight": "normal",
                        "font-size": '100%'
                    });
                });
            });
        });
    }
    // 搜索页面
    if (search_enhance && location.href.match(/search\.php(\Smod=forum)?$/) && jq('div.sttl.mbn').length) {
        jq("table tr:eq(1)").after('<tr><th>搜索范围</th><td><p id="showsearchenhance"><b>----[显示/隐藏]----</b></p><div id="mysearchbox"><table bgcolor="#F0F0F0" cellspacing="0" cellpadding="0"><tr>----[大版块]----</tr><tr><td><label class="lb"><b>[各版块]</b></label></td><td><label class="my_search lb" id="forum_big1"><input type="radio" class="pr" name="searchenhance"/>六维索引互动区</label></td><td><label class="my_search lb" id="forum_big2"><input type="radio" class="pr" name="searchenhance"/>六维高清资源区</label></td><td><label class="my_search lb" id="forum_big3"><input type="radio" class="pr" name="searchenhance"/>六维普通资源区</label></td><td><label class="my_search lb" id="forum_big4"><input type="radio" class="pr" name="searchenhance"/>六维休闲娱乐区</label></td><td><label class="my_search lb" id="forum_big5"><input type="radio" class="pr" name="searchenhance"/>六维事务处理区</label></td><td><label class="my_search lb" id="forum_big6"><input type="radio" class="pr" name="searchenhance"/>六维内部交流区</label></td></tr><tr><td><label class="lb"><b>[资源区]</b></label></td><td><label class="my_search lb" id="forum_resource1"><input type="radio" class="pr" name="searchenhance"/>电影剧场</label></td><td><label class="my_search lb" id="forum_resource2"><input type="radio" class="pr" name="searchenhance"/>电视剧集</label></td><td><label class="my_search lb" id="forum_resource3"><input type="radio" class="pr" name="searchenhance"/>综艺娱乐</label></td><td><label class="my_search lb" id="forum_resource4"><input type="radio" class="pr" name="searchenhance"/>体育天地</label></td><td><label class="my_search lb" id="forum_resource5"><input type="radio" class="pr" name="searchenhance"/>音乐地带</label></td><td><label class="my_search lb" id="forum_resource6"><input type="radio" class="pr" name="searchenhance"/>纪录写实</label></td></tr><tr><td></td><td><label class="my_search lb" id="forum_resource7"><input type="radio" class="pr" name="searchenhance"/>卡通动漫</label></td><td><label class="my_search lb" id="forum_resource8"><input type="radio" class="pr" name="searchenhance"/>游戏天下</label></td><td><label class="my_search lb" id="forum_resource9"><input type="radio" class="pr" name="searchenhance"/>资料文档</label></td><td><label class="my_search lb" id="forum_resource10"><input type="radio" class="pr" name="searchenhance"/>软件快跑</label></td><td><label class="my_search lb" id="forum_resource11"><input type="radio" class="pr" name="searchenhance"/>其他资源</label></td></tr></table><table bgcolor="#F0F0F0" cellspacing="0" cellpadding="0"><tr>----[小版块]----</tr><tr><td><label class="lb"><b>[电- -影]</b></label></td><td><label class="my_search lb" id="movie1"><input type="radio" class="pr" name="searchenhance"/>电影--资源区</label></td><td><label class="my_search lb" id="movie2"><input type="radio" class="pr" name="searchenhance"/>电影--高清</label></td><td><label class="my_search lb" id="movie3"><input type="radio" class="pr" name="searchenhance"/>电影--普清</label></td><td><label class="my_search lb" id="movie4"><input type="radio" class="pr" name="searchenhance"/>电影--所有</label></td></tr><tr><td><label class="lb"><b>[剧- -集]</b></label></td><td><label class="my_search lb" id="tvseries1"><input type="radio" class="pr" name="searchenhance"/>剧集--资源区</label></td><td><label class="my_search lb" id="tvseries2"><input type="radio" class="pr" name="searchenhance"/>剧集--高清</label></td><td><label class="my_search lb" id="tvseries3"><input type="radio" class="pr" name="searchenhance"/>剧集--普清</label></td><td><label class="my_search lb" id="tvseries4"><input type="radio" class="pr" name="searchenhance"/>剧集--合集</label></td><td><label class="my_search lb" id="tvseries5"><input type="radio" class="pr" name="searchenhance"/>高清剧集</label></td><td><label class="my_search lb" id="tvseries6"><input type="radio" class="pr" name="searchenhance"/>电视剧集</label></td><td><label class="my_search lb" id="tvseries7"><input type="radio" class="pr" name="searchenhance"/>剧集--所有</label></td></tr></table></div></td></tr>');
        let value_of_forums = {
            "forum_big1": [2, 129, 29, 145, 33, 133, 358, 41, 156, 155, 153, 152, 154, 162, 147, 148, 149, 151, 150, 146],
            "forum_big2": [45, 161, 57, 48, 77, 58, 49, 59, 50, 60, 91, 92],
            "forum_big3": [13, 81, 79, 61, 14, 73, 62, 16, 72, 112, 17, 292, 96, 65, 15, 126, 144, 63, 127, 128, 44, 293, 165, 52, 125, 69, 21, 329, 78, 171, 124, 163, 56, 18, 138, 54, 66, 19, 160, 159, 84, 74, 169, 67, 20, 368, 70],
            "forum_big4": [7, 141, 4, 139, 43, 142, 175, 182, 136, 172],
            "forum_big5": [38, 121, 131, 122, 39, 119, 31, 143],
            "forum_big6": [32, 87, 123, 137, 93, 113, 114, 135, 36, 116, 115, 187],
            "forum_resource1": [45, 161, 13, 81, 79],
            "forum_resource2": [48, 77, 14, 73],
            "forum_resource3": [16, 72],
            "forum_resource4": [17, 292, 96],
            "forum_resource5": [50, 91, 15, 126, 144],
            "forum_resource6": [49, 127],
            "forum_resource7": [44, 293, 165, 52, 125],
            "forum_resource8": [21, 329, 78, 171, 124, 163],
            "forum_resource9": [18, 138, 54],
            "forum_resource10": [19, 160, 159, 84, 74, 169],
            "forum_resource11": [20, 368],
            "movie1": [45, 161, 13, 81, ],
            "movie2": [45, 161],
            "movie3": [13, 81],
            "movie4": [45, 161, 57, 13, 81, 79, 61],
            "tvseries1": [48, 77, 14, 73],
            "tvseries2": [48, 77],
            "tvseries3": [14, 73],
            "tvseries4": [77, 73],
            "tvseries5": [48],
            "tvseries6": [14],
            "tvseries7": [48, 77, 58, 14, 73, 62]
        };
        jq("label.my_search").click(function () {
            let spanid = jq(this).attr("id");
            jq("select#srchfid").val(value_of_forums[spanid]);
        });
        jq("p#showsearchenhance").click(function () {
            jq("div#mysearchbox").toggle();
        });
    }

    function requestData(url, successHandle, timeoutHandle) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 5000,
            onreadystatechange: successHandle,
            ontimeout: timeoutHandle,
        });
    }

    function requestHTML(url, successHandle, timeoutHandle) {
        requestData(url, function (response) {
            if (response.readyState == 4) {
                successHandle(response);
            }
        }, function (response) {
            timeoutHandle(response);
        });
    }

    function requestJson(url, successHandle, timeoutHandle) {
        requestData(url, function (response) {
            if (response.readyState == 4) {
                successHandle(JSON.parse(response.responseText));
            }
        }, function (response) {
            timeoutHandle(response);
        });
    }

    // 发种&修改页面
    if (location.href.match(/action=(newthread|edit)/)) {
        jq('span#custominfo').click();
        jq('span#custominfo').remove();
        jq('span#subjectchk').remove();
        let d_with = jq('#postbox').width() - 130;
        let seed_with = jq('#postbox').width() - 450;
        let title_height = title_zoom + 0.05;
        jq('#subject').attr('style', 'width: ' + d_with + 'px;height: ' + title_height + 'em;font-size: ' + title_zoom + 'em');
        jq("div.specialpost.s_clear input").attr('style', 'width: ' + seed_with + 'px');
        jq('div#postbox').before('<div class="pbt cl"><div class="ftid"><span width="80">种子信息克隆：</span></div><div class="z"><span><input type="text" style="width:400px;" id="clone_from" class="px" placeholder="要克隆的种子ID、链接" onkeypress="if(event.keyCode==13){clone_btn.click();}"></span><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span id="myformat_t">克隆状态：[</span><span id="clone_info">要克隆的种子ID、链接</span><span>]</span></div></div>' +
            '<div class="pbt cl"><div class="ftid"><span width="80">电影信息查询：</span></div><div class="z"><span class="ftid"><select id="query_typeid"><option value="1">电影</option><option value="2">动漫</option><option value="3">游戏</option></select></span><span><input type="text" style="width:300px;" id="query_input" class="px" placeholder="名称、豆瓣ID/链接、IMDB、Bangumi、Steam" onkeypress="if(event.keyCode==13){query_btn.click();}">' +
            '</span><input type="button" id="query_btn" style="size:100px;" value=" 查   询 ">&nbsp;&nbsp;&nbsp;&nbsp;<span id="myformat_d">查询状态：[</span><span id="query_info">名称、豆瓣ID/链接、IMDB、Bangumi、Steam</span><span>]</span><span id="d_poster"></span></div></div>' +
            '<div id="seedfilename" hidden="true" class="pbt cl"><div class="ftid"><span width="80">种子文件名称：</span></div><div class="z"><input  type="text" style="width:71.5em;" class="px" id="uploadseedname"></div></div>');
        //展开标签栏，预备填写
        jq('#extra_tag_b').addClass('a');
        jq('#extra_tag_c').css('display', 'block');

        jq('#myformat_t').click(function () {
            let t_str = jq('input[name=subject]').val();
            t_str = t_str.replace(/[\.\s]*([\[\]\/])[\.\s]*/ig, "$1");
            t_str = t_str.replace(/\s/g, ".");
            if (tv_forum.indexOf(forum_id) >= 0) {
                t_str = t_str.replace(/(\[\d+)P\//, "$1p/");
                t_str = t_str.replace(/\/(MP4|MKV|TS|ISO|RMVB|FLV|AVI|VOB|MPEG|WEB-DL|WEB|HDTV)/ig, function ($1) {
                    return $1.toUpperCase();
                });
            }
            jq('input[name=subject]').attr('value', t_str);
        });
        jq('#myformat_d').click(function () {
            if (location.href.match(/action=edit/)) {
                let desc = jq('#e_textarea').html() + "\n";
                let match = desc.match(/\[table[\s\S]+?\[\/table\]/);
                let gong_gao = match ? "[align=center]" + match[0] + "[/align]" : "";
                desc = desc.replace(/\[table[\s\S]+?\[\/table\]/, "")
                    .replace(/\[align=center\]\[size=4\]—+\[\/size\]\[\/align\]/, "")
                    .replace(/\[(?!(img|url|code|quote|attachimg|\/))[\s\S]*?\]/ig, "")
                    .replace(/\[\/(?!(img|url|code|quote|attachimg))[\s\S]*?\]/ig, "")
                    .replace(/\[(img|code|quote|attachimg)/g, "\n[$1")
                    .replace(/\[\/(img|code|quote|attachimg)\]/g, "[/$1]\n")
                    .replace(/^[\s—]+/g, "\n")
                    .replace(/^\s*[\r\n]+/gm, "\n");
                desc = desc.replace('[code]', '[img]http://bt.neu6.edu.cn/data/attachment/forum/201809/29/201707z077dpi50ljmdldr.png[/img]\n[code]');
                desc = desc.replace('[/code]', '[/code]\n[img]http://bt.neu6.edu.cn/data/attachment/forum/201809/29/201713kwgnnhldfy7ss9yy.png[/img]');
                jq('#e_iframe').contents().find('body').html(bbcode2html(gong_gao + desc));
            } else if (location.href.match(/action=newthread/)) {
                let match = jq('#e_textarea').html().match(/\[table[\s\S]+?\[\/table\]/);
                let gong_gao = match ? "[align=center]" + match[0] + "[/align]" : "";
                gong_gao += '\n\n[img]http://bt.neu6.edu.cn/data/attachment/forum/201809/29/201707z077dpi50ljmdldr.png[/img]\n\n[img]http://bt.neu6.edu.cn/data/attachment/forum/201809/29/201713kwgnnhldfy7ss9yy.png[/img]';
                jq('#e_iframe').contents().find('body').html(bbcode2html(gong_gao + "\n\n"));
            }
        });
        jq("div.specialpost.s_clear input").bind("change", seedNameCopy);

        // 自动处理并复制种子文件名
        function seedNameCopy() {
            jq("div#seedfilename").show();
            // 去掉路径
            let tname = jq("div.specialpost.s_clear input").val().replace(/.*\\([^\.\\]+)/g, "$1");
            tname = tname.replace(/\.(torrent|mkv|mp4|rmvb|ts|avi|iso)/ig, "").replace(/\s/g, ".");
            let tname_copy = tname;
            tname = tname.replace(/(\.*\[\S+\]\.*)*/, "").replace(/(^\.*)|(\.*$)/g, ""); // 去掉[发布组],开头与结尾的.
            if (tname) {
                jq("input#uploadseedname").val(tname);
                let t_match = tname.match(/^(\W+)?\.*(.*)$/);
                let name_en = "";
                if (t_match && t_match[2]) {
                    name_en = t_match[2];
                }
                if (name_en && ((forum_id == 48 && name_en.match(/Ep?\d+/i)) || forum_id == 13 || forum_id == 45)) {
                    let t = jq('input[name=subject]').val().replace(/\]\[[^\]]+/, "][" + name_en);
                    jq('input[name=subject]').attr('value', t);
                }
                if (forum_id == 14 || forum_id == 73 || forum_id == 77) {
                    t_match = tname.match(/(WEB|HDTV|Blu)[-a-zA-Z]+\b/i);
                    let medium = t_match ? t_match[0] : ""; //媒介
                    t_match = tname.match(/(\d+p|4k|1080i)/i);
                    let standard = t_match ? t_match[1] : ""; //分辨率
                    t_match = tname.match(/(\w+)$/);
                    let processing = t_match ? t_match[1] : ""; //制作组
                    let t_split = jq('input[name=subject]').val().split('][');
                    if (t_split.length >= 5) {
                        t_split[4] = processing ? processing : t_split[4];
                        t_split[4] = (t_split.length == 6) ? t_split[4] : t_split[4] + "]";
                        let t2_split = t_split[2].split('/');
                        if (t2_split.length == 3) {
                            t2_split[0] = standard ? standard : t2_split[0];
                            t2_split[1] = medium ? medium : t2_split[1];
                            t_split[2] = t2_split.join('/');
                        } else if (t2_split.length == 2) {
                            if (t2_split[0].match(/\d+p/i)) {
                                t2_split[0] = standard ? standard : t2_split[0];
                            } else if (t2_split[0].match(/WEB|HDTV|Blu/i)) {
                                t2_split[0] = medium ? medium : t2_split[0];
                            }
                            t_split[2] = t2_split.join('/');
                        } else if (t2_split.length == 1) {
                            let t2_temp = standard ? standard + "/" : "";
                            t2_temp = medium ? medium + "/" : "";
                            t_split[2] = t2_temp + t2_split[0];
                        }
                    }
                    jq('input[name=subject]').attr('value', t_split.join(']['));
                }
            } else {
                jq("input#uploadseedname").val(tname_copy);
            }
        }

        // 影片信息查询类型填写
        if (jq('#query_typeid').length) {
            var query_typeid = 1;
            if (forum_id == 44 || forum_id == 293 || forum_id == 52) {
                query_typeid = 2;
            } else if (forum_id == 21 || forum_id == 329) {
                query_typeid = 3;
            }
            jq('select#query_typeid').val(query_typeid);
        }

        // 下载海报
        function downloadPoster(img) {
            let img_span = '&nbsp;&nbsp;&nbsp;&nbsp;';
            if (img.length == 1) {
                img_span += '<b>[点击下载海报]</b>';
                jq('span#d_poster').html(img_span);
                jq('span#d_poster').unbind('click');
                jq('span#d_poster').click(function () {
                    let s = img[0].split("/");
                    let name = (s.length > 0) ? s[s.length - 1] : "default.png";
                    name = name.trim().replace(/\?.*$/, '');
                    GM_download(img[0], name);
                });
            } else if (img.length > 1) {
                img_span = img_span + '<select width="100px" id="query_img_down"><option value="">选择图片下载</option>';
                for (let i = 0; i < img.length; i++) {
                    let s = img[i].split("/");
                    let name = (s.length > 0) ? s[s.length - 1] : "default.png";
                    name = name.trim().replace(/\?.*$/, '');
                    img_span = img_span + '<option value="' + img[i] + '">' + name + '</option>';
                }
                img_span += '</select>';

                jq('span#d_poster').html(img_span);
                jq('span#d_poster').unbind('click');
                jq('select#query_img_down').change(function () {
                    let h = jq('select#query_img_down').val();
                    if (h != "") {
                        let s = h.split("/");
                        let name = (s.length > 0) ? s[s.length - 1] : "default.png";
                        name = name.trim().replace(/\?.*$/, '');
                        GM_download(h, name);
                        let img_name = jq('select#query_img_down').find("option:selected").text();
                        img_name = img_name.replace(/^√*\s*/, '√ ');
                        jq('select#query_img_down').find("option:selected").text(img_name);
                    }
                });
            }
        }

        //查询电影信息
        jq('#query_btn').click(function () {
            var query_input = jq('#query_input').val().trim();
            var query_info = jq('#query_info');
            jq('span#d_poster').html('');
            if (query_input == '') {
                query_info.html('<b>请输入搜索内容</b>')
                return;
            }
            if (/^\d+$/.test(query_input)) {
                query_input = (forum_id == 44) ? ('https://bgm.tv/subject/' + query_input) : ('https://movie.douban.com/subject/' + query_input);
            }
            if (/^tt\d+/.test(query_input)) {
                query_input = 'http://www.imdb.com/title/' + query_input;
            }
            if (/^http/.test(query_input)) {
                if (/www\.imdb\.com/.test(query_input)) {
                    requestJson('https://api.douban.com/v2/movie/search?q=' + query_input.match(/tt\d+/)[0], function (json) {
                        if (json.total == 1) {
                            jq('#query_input').val(json.subjects[0].alt);
                            jq('#query_btn').click();
                        } else {
                            query_info.html('<b>请检查IMDB是否正确</b>');
                        }
                    }, function (res) {
                        query_info.html('<b>查询IMDB信息失败</b>');
                    });
                } else if (/movie\.douban\.com/.test(query_input)) {
                    var fetch = function (anchor) {
                        return anchor[0].nextSibling.nodeValue.trim();
                    };
                    query_info.text("识别输入为豆瓣链接，查询中......");
                    requestHTML(query_input, function (res) {
                        // 以下豆瓣相关解析修改自 `https://greasyfork.org/zh-CN/scripts/38878-电影信息查询脚本` 对此表示感谢
                        var title_match = res.responseText.match(/<title>页面不存在<\/title>/)
                        if (/<title>页面不存在<\/title>/.test(res.responseText)) {
                            query_info.html('<b>该链接对应的资源似乎并不存在，你确认没填错</b>');
                        } else {
                            var page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                            var movie_id = res.finalUrl.match(/\/subject\/(\d+)/)[1];

                            var this_title, trans_title;
                            var chinese_title = res.responseText.match(/<title>([\s\S]+)<\/title>/)[1].replace('(豆瓣)', '').trim();
                            var foreign_title = page.find('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title, '').trim();
                            var aka_anchor = page.find('#info span.pl:contains("又名")');
                            var aka;
                            if (aka_anchor[0]) {
                                aka = fetch(aka_anchor).split(' / ').sort(function (a, b) { //首字(母)排序
                                    return a.localeCompare(b);
                                }).join('/');
                            }
                            if (foreign_title) {
                                trans_title = chinese_title + (aka ? ('/' + aka) : '');
                                this_title = foreign_title;
                            } else {
                                trans_title = aka ? aka : '';
                                this_title = chinese_title;
                            }
                            //年代
                            var year = page.find('#content>h1>span.year').text().slice(1, -1);
                            //产地
                            var regions_anchor = page.find('#info span.pl:contains("制片国家/地区")');
                            var region;
                            if (regions_anchor[0]) {
                                region = fetch(regions_anchor).split(' / ').join('/');
                            }
                            //类别
                            var genre = page.find('#info span[property="v:genre"]').map(function () {
                                return jq(this).text().trim();
                            }).toArray().join('/');
                            //语言
                            var language_anchor = page.find('#info span.pl:contains("语言")');
                            var language;
                            if (language_anchor[0]) {
                                language = fetch(language_anchor).split(' / ').join('/');
                            }
                            //上映日期
                            var playdate = page.find('#info span[property="v:initialReleaseDate"]').map(function () {
                                return jq(this).text().trim();
                            }).toArray().sort(function (a, b) { //按上映日期升序排列
                                return new Date(a) - new Date(b);
                            }).join('/');
                            //IMDb链接
                            var imdb_link_anchor = page.find('#info span.pl:contains("IMDb链接")');
                            var imdb_link;
                            if (imdb_link_anchor[0]) {
                                imdb_link = imdb_link_anchor.next().attr('href').replace(/(\/)?$/, '/');
                            }
                            //豆瓣链接
                            var douban_link = 'https://' + res.finalUrl.match(/movie.douban.com\/subject\/\d+\//);
                            //集数
                            var episodes_anchor = page.find('#info span.pl:contains("集数")');
                            var episodes;
                            if (episodes_anchor[0]) {
                                episodes = fetch(episodes_anchor);
                            }
                            //片长
                            var duration_anchor = page.find('#info span.pl:contains("单集片长")');
                            var duration;
                            if (duration_anchor[0]) {
                                duration = fetch(duration_anchor);
                            } else {
                                duration = page.find('#info span[property="v:runtime"]').text().trim();
                            }

                            var director, writer, cast;
                            var awards;
                            var douban_average_rating, douban_votes, douban_rating, introduction = '',
                                poster;
                            var imdb_average_rating, imdb_votes, imdb_rating;
                            var tags;

                            var descriptionGenerator = function () {
                                var descr = "";
                                descr += foreign_title ? ("[b]" + foreign_title + "[/b]\n\n") : "";
                                descr += trans_title ? ('◎译　　名　' + trans_title + "\n") : "";
                                descr += this_title ? ('◎片　　名　' + this_title + "\n") : "";
                                descr += year ? ('◎年　　代　' + year + "\n") : "";
                                descr += region ? ('◎产　　地　' + region + "\n") : "";
                                descr += genre ? ('◎类　　别　' + genre + "\n") : "";
                                descr += language ? ('◎语　　言　' + language + "\n") : "";
                                descr += playdate ? ('◎上映日期　' + playdate + "\n") : "";
                                descr += imdb_rating ? ('◎IMDb评分  ' + imdb_rating + "\n") : "";
                                descr += imdb_link ? ('◎IMDb链接  ' + imdb_link + "\n") : "";
                                descr += douban_rating ? ('◎豆瓣评分　' + douban_rating + "\n") : "";
                                descr += douban_link ? ('◎豆瓣链接　' + douban_link + "\n") : "";
                                descr += episodes ? ('◎集　　数　' + episodes + "\n") : "";
                                descr += duration ? ('◎片　　长　' + duration + "\n") : "";
                                descr += director ? ('◎导　　演　' + director + "\n") : "";
                                descr += writer ? ('◎编　　剧　' + writer + "\n") : "";
                                descr += cast ? ('◎主　　演　' + cast.replace(/\n/g, '\n' + '　'.repeat(4) + '  　').trim() + "\n") : "";
                                descr += tags ? ('\n◎标　　签　' + tags + "\n") : "";
                                descr += introduction ? ('\n◎简　　介\n\n　　' + introduction.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";
                                descr += awards ? ('\n◎获奖情况\n\n　　' + awards.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";

                                GM_setClipboard(descr);
                                query_info.html('<b>已复制到剪切板</b>');
                            };
                            // IMDb信息（最慢，最先请求）
                            if (imdb_link) {
                                requestHTML('https://p.media-imdb.com/static-content/documents/v1/title/' + imdb_link.match(/tt\d+/) + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json', function (res) {
                                    var try_match = res.responseText.match(/imdb.rating.run\((.+)\)/);
                                    var a = JSON.parse(try_match[1]);
                                    imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1) + '').replace('NaN', '');
                                    imdb_votes = a.resource.ratingCount ? a.resource.ratingCount.toLocaleString() : '';
                                    imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';
                                    descriptionGenerator();
                                }, function (res) {
                                    query_info.html('<b>查询影片的IMDb信息失败</b>');
                                });

                                // IMDb Storyline
                                const TMDB_api_key = atob('OWNmZmQ5MjY4OTUzZDhhYzA1OTYxMWYwMDg2OGNkNmU=');
                                requestJson('https://api.themoviedb.org/3/find/' + imdb_link.match(/tt\d+/) + '?api_key=' + TMDB_api_key + '&external_source=imdb_id', function (res) {
                                    let story_line = '';
                                    if (res.movie_results.length) {
                                        story_line = res.movie_results[0].overview;
                                    } else if (res.tv_episode_results.length) {
                                        story_line = res.tv_episode_results[0].overview;
                                    } else if (res.person_results.length) {
                                        story_line = res.person_results[0].overview;
                                    } else if (res.tv_results.length) {
                                        story_line = res.tv_results[0].overview;
                                    } else if (res.tv_season_results.length) {
                                        story_line = res.tv_season_results[0].overview;
                                    }
                                    introduction = story_line ? (introduction + '\n\n' + story_line) : introduction;
                                    descriptionGenerator();
                                }, function () {
                                    query_info.html('<b>查询 IMDb Storyline 失败</b>');
                                });
                            }
                            // 该影片的评奖信息
                            requestHTML(douban_link + 'awards', function (res) {
                                var awards_page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                                awards = awards_page.find('#content>div>div.article').html()
                                    .replace(/[ \n]/g, '')
                                    .replace(/<\/li><li>/g, '</li> <li>')
                                    .replace(/<\/a><span/g, '</a> <span')
                                    .replace(/<(div|ul)[^>]*>/g, '\n')
                                    .replace(/<[^>]+>/g, '')
                                    .replace(/&nbsp;/g, ' ')
                                    .replace(/ +\n/g, '\n')
                                    .trim();
                                descriptionGenerator();
                            }, function (res) {
                                query_info.html('<b>查询影片的获奖情况失败</b>');
                            });
                            //豆瓣评分，简介，海报，导演，编剧，演员，标签
                            requestJson('https://api.douban.com/v2/movie/' + movie_id, function (json) {
                                douban_average_rating = json.rating.average || 0;
                                douban_votes = json.rating.numRaters.toLocaleString() || 0;
                                douban_rating = douban_average_rating + '/10 from ' + douban_votes + ' users';
                                let introduction_t = json.summary.replace(/^None$/g, '暂无相关剧情介绍');
                                introduction = introduction ? (introduction_t + introduction) : introduction_t;
                                poster = json.image.replace(/s(_ratio_poster|pic)/g, 'l$1');
                                director = json.attrs.director ? json.attrs.director.join(' / ') : '';
                                writer = json.attrs.writer ? json.attrs.writer.join(' / ') : '';
                                cast = json.attrs.cast ? json.attrs.cast.join('\n') : '';
                                tags = json.tags.map(function (member) {
                                    return member.name;
                                }).join(' | ');
                                descriptionGenerator();
                                downloadPoster([poster]);
                            }, function (res) {
                                query_info.html('<b>查询影片的豆瓣信息失败</b>');
                            });
                        }
                    }, function (res) {
                        query_info.html('<b>查询影片的豆瓣信息失败</b>');
                    });
                } else if (query_input.match(/(bgm\.tv|bangumi\.tv|chii\.in)\/subject/)) {
                    query_info.text("识别输入为Bgm链接，查询中......");
                    // 以下Bgm相关解析修改自 `https://github.com/Rhilip/PT-help/blob/master/docs/js/Bangumi%20-%20Info%20Export.user.js` 对此表示感谢a
                    const STAFFSTART = 4; // 读取Staff栏的起始位置（假定bgm的顺序为中文名、话数、放送开始、放送星期... ，staff从第四个 导演 起算）；初始值为 4（对于新番比较合适）
                    const STAFFNUMBER = 9; // 读取Staff栏数目；初始9，可加大，溢出时按最大可能的staff数读取，如需读取全部请设置值为 Number.MAX_VALUE (或一个你觉得可能最大的值 eg.20)
                    requestHTML(query_input, function (res) {
                        var page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                        var img = page.find("div#bangumiInfo>div>div:nth-child(1)>a>img").attr("src").replace(/cover\/[lcmsg]/, "cover/l");
                        img = img.match(/^http/) ? img : 'http:' + img;
                        downloadPoster([img]);
                        // 主介绍
                        var story = page.find("div#subject_summary").text(); //Story
                        var raw_staff = [],
                            staff_box = page.find("ul#infobox"); //Staff
                        for (var staff_number = STAFFSTART; staff_number < Math.min(STAFFNUMBER + STAFFSTART, staff_box.children("li").length); staff_number++) {
                            raw_staff[staff_number - STAFFSTART] = staff_box.children("li").eq(staff_number).text();
                        }
                        var raw_cast = [],
                            cast_box = page.find("ul#browserItemList"); //Cast
                        for (var cast_number = 0; cast_number < cast_box.children("li").length; cast_number++) {
                            var cast_name = cast_box.children("li").eq(cast_number).find("span.tip").text();
                            if (!(cast_name.length)) { //如果不存在中文名，则用cv日文名代替
                                cast_name = cast_box.children("li").eq(cast_number).find("div > strong > a").text().replace(/(^\s*)|(\s*$)/g, ""); //#browserItemList > li > div > strong > a
                            }
                            var cv_name = cast_box.children("li").eq(cast_number).find("span.tip_j > a").text();
                            raw_cast[cast_number] = cast_name + ' : ' + cv_name;
                            //console.log(raw_cast[cast_number]);
                        }

                        var outtext = "\n\n" + // img + "\n\n" +
                            "[b]STORY : [/b]\n" + story + "\n\n" +
                            "[b]STAFF : [/b]\n" + raw_staff.join("\n") + "\n\n" +
                            "[b]CAST : [/b]\n" + raw_cast.join("\n") + "\n\n" +
                            "(来源于 " + res.finalUrl + " )\n";

                        GM_setClipboard(outtext);
                        query_info.html('<b>已复制到剪切板</b>');
                    }, function (res) {
                        query_info.html('<b>查询影片的豆瓣信息失败</b>');
                    });
                } else if (query_input.match(/(store\.steampowered\.com|steamcommunity\.com)/)) {
                    query_info.text("识别输入为Steam链接，查询中......");
                    requestJson('https://api.rhilip.info/tool/movieinfo/gen?url=' + query_input, function (json) {
                        if (json.success) {
                            let steam_info = json.format;
                            //https://store.steampowered.com/app/504230
                            var img_arr = [];
                            steam_info = steam_info.replace(/\[img\][\s\S]*?\[\/img\]/g, function (m) {
                                let h = m.replace(/\[\/?img\]/g, "");
                                img_arr.push(h);
                                return h;
                            });
                            downloadPoster(img_arr);
                            GM_setClipboard(steam_info);
                            query_info.html('<b>已复制到剪切板</b>');
                        } else {
                            query_info.html('<b>查询Steam信息失败</b>');
                        }
                    }, function (res) {
                        query_info.html('<b>查询Steam信息失败</b>');
                    });
                } else {
                    query_info.html('<b>不支持这种链接(ノ｀Д)ノ</b>');
                }
            } else {
                query_info.text('识别输入内容为文字格式，尝试搜索.......');
                var Search_From_API = function (url, successHandle) {
                    requestHTML(url, function (resj) {
                        query_info.text("请求成功，请选择对应链接");
                        var search_html = successHandle(resj);
                        if (search_html) {
                            var qshtml = '<h3 class="flb"><em id="return_reply">查询结果</em><span><a href="javascript:;" class="flbc" onclick="hideWindow(\'qszs\')" title="\u5173\u95ed">\u5173\u95ed</a></span></h3><div id="hdsettingdialog" style="width:680px;height:320px;">' +
                                '<div class="c" style="height:357px;">' +
                                '<div id="query_res" style="overflow-y:scroll;width:650px; height:300px;">';
                            qshtml += search_html;
                            qshtml += '</div></div></div><style>#query_res span{display:inline-block;width: 55px}</style>';
                            showWindow('qszs', qshtml, 'html');
                            jq("a.res_search_choose").click(function () {
                                var tag = jq(this);
                                jq('#query_input').val(tag.attr("data-url"));
                                jq('#query_btn').click();
                                hideWindow('qszs');
                            });

                        } else {
                            query_info.html('<b>无搜索结果</b>');
                        }
                    }, function (res) {
                        query_info.html('<b>搜索失败</b>');
                    });
                };
                let query_typeid = jq('select#query_typeid').val();
                if (query_typeid == 2) { // Bgm
                    Search_From_API("https://api.bgm.tv/search/subject/" + query_input + "?responseGroup=large&max_results=20&start=0", function (res) {
                        let resj = JSON.parse(res.responseText);
                        let search_html = "";
                        if (resj.results !== 0) {
                            search_html = '<table id="search_res_table" style="width: 100%" cellspacing="10px"><tr bgcolor="#F3F781">' +
                                '<th style="width: 15%">放送<br>开始</th>' +
                                '<th style="width: 15%">类别</th>' +
                                '<th style="width: 54%">名称</th>' +
                                '<th align="center" style="width: 8%">Bangumi</th>' +
                                '<th align="center" style="width: 8%"></th></tr>';
                            let tp_dict = {
                                1: "漫画/小说",
                                2: "动画/二次元番",
                                3: "音乐",
                                4: "游戏",
                                6: "三次元番"
                            };
                            for (let i_bgm = 0; i_bgm < resj.list.length; i_bgm++) {
                                let i_item = resj.list[i_bgm];
                                let bg_color = (i_bgm % 2 == 1) ? " bgcolor=\"#E8E8E8\"" : "";
                                search_html += "<tr" + bg_color + "><td>" + i_item.air_date + "</td><td>" + tp_dict[i_item.type] + "</td><td>" + i_item.name_cn + " | " + i_item.name + "</td><td align=\"center\"><a href='" + i_item.url + "' target='_blank'>" + i_item.id + "</a></td><td align=\"center\"><a href='javascript:void(0);' class='res_search_choose' data-url='" + i_item.url + "'><b>选择</b></a></td></tr>";
                            }
                            search_html += "</table>";
                        }
                        return search_html;
                    });
                } else if (query_typeid == 3) { //Steam
                    query_input = query_input.trim().replace(/[\.\s]+/g, '+');
                    Search_From_API('https://store.steampowered.com/search/?term=' + query_input, function (res) {
                        let page = jq(res.responseText.match(/<body[^>]*?>([\S\s]+)<\/body>/)[1].replace(/<script(\s|>)[\S\s]+?<\/script>/g, ''));
                        var search_html = "";
                        if (page.find('a.search_result_row').length) {
                            search_html = '<table id="search_res_table" style="width: 100%" cellspacing="10px"><tr bgcolor="#F3F781">' +
                                '<th style="width: 20%">日期</th>' +
                                '<th style="width: 45%">标题</th>' +
                                '<th style="width: 15%">平台</th>' +
                                '<th style="width: 10%">费用</th>' +
                                '<th style="width: 10%" align="center"></th></tr>';
                            let index = 0;
                            page.find('a.search_result_row').each(function () {
                                let a_result = jq(this);
                                let publish_date = a_result.find('div.search_released').text();
                                let title = a_result.find('span.title').text();
                                let plat = a_result.find('div.search_name.ellipsis>p').html().match(/(win|mac|linux)/ig).join('|');
                                let price = a_result.find('div.search_price').text().trim().match(/¥ \d+$/);
                                price = price ? price[0] : '';
                                let alt = 'https://store.steampowered.com/app/' + a_result.attr('data-ds-appid');
                                let bg_color = (index % 2 == 1) ? " bgcolor=\"#E8E8E8\"" : "";
                                index++;
                                search_html += "<tr" + bg_color + "><td>" + publish_date + "</td><td>" + title + "</td><td>" + plat + "</td><td>" + price + "</td><td align=\"center\"><a href='javascript:void(0);' class='res_search_choose' data-url='" + alt + "'><b>选择</b></a></td></tr>";
                            });
                            search_html += "</table>";
                        }
                        return search_html;
                    });
                } else { // Douban
                    Search_From_API("https://api.douban.com/v2/movie/search?q=" + query_input, function (res) {
                        let resj = JSON.parse(res.responseText);
                        let search_html = "";
                        if (resj.total !== 0) {
                            search_html = '<table id="search_res_table" style="width: 100%" cellspacing="10px"><tr bgcolor="#F3F781">' +
                                '<th style="width: 10%">年代</th>' +
                                '<th style="width: 10%">类别</th>' +
                                '<th style="width: 40%">标题</th>' +
                                '<th style="width: 30%">豆瓣</th>' +
                                '<th style="width: 10%" align="center"></th></tr>';
                            for (let i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                                let i_item = resj.subjects[i_douban];
                                let bg_color = (i_douban % 2 == 1) ? " bgcolor=\"#E8E8E8\"" : "";
                                search_html += "<tr" + bg_color + "><td>" + i_item.year + "</td><td>" + i_item.subtype + "</td><td>" + i_item.title + "</td><td><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td align=\"center\"><a href='javascript:void(0);' class='res_search_choose' data-url='" + i_item.alt + "'><b>选择</b></a></td></tr>";
                            }
                            search_html += "</table>";
                        }
                        return search_html;
                    });
                }
            }
        });

        //auto_add 处理部分内容
        function numatostring2(num) {
            return (num < 10) ? ("0" + num) : (num.toString());
        }

        function leapyear(year) {
            return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
        }

        function tvseasonhandle(str, type) {
            if (str.match(/\[\d+[Pp]\]/)) {
                return str;
            }
            let aaatv = str.match(/\d+/g);
            let bbbtv = str.match(/\D+/g);
            if (aaatv && aaatv.length == 1) {
                str = numatostring2(parseInt(aaatv[0]) + 1);
                if (bbbtv) {
                    str = bbbtv[0] + str;
                    if (bbbtv && bbbtv.length > 1) {
                        str = str + bbbtv[1];
                    }
                }
            }
            if (aaatv && aaatv.length == 2) {
                if (bbbtv && bbbtv.length >= 2 && bbbtv[1] == "E") {
                    aaatv[1] = numatostring2(parseInt(aaatv[1]) + 1);
                } else {
                    let temp = parseInt(aaatv[1]) - parseInt(aaatv[0]);
                    aaatv[0] = numatostring2(parseInt(aaatv[1]) + 1);
                    aaatv[1] = numatostring2(parseInt(aaatv[0]) + temp);
                }
                if (bbbtv && bbbtv.length == 1) {
                    str = aaatv[0] + bbbtv[0] + aaatv[1];
                } else if (bbbtv && bbbtv.length == 2) {
                    str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1];
                } else if (bbbtv && bbbtv.length == 3) {
                    str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
                }
            }
            return str;
        }

        function fillSeedInfo(title, desc, link, tag) {
            jq('#subject').val(title); //填写标题
            jq('#query_input').val(link);

            let m_am = jq('#e_textarea').html().match(/\[table[\s\S]+?\[\/table\]/);
            if (m_am) {
                let gong_gao = "[align=center]" + m_am[0] + "[/align]";
                desc = desc.replace(/^(<br\s*\/*>)*/, '');
                jq('#e_iframe').contents().find('body').html(bbcode2html(gong_gao) + desc);
            } else {
                jq('#e_iframe').contents().find('body').html(desc);
            }
            jq('#tags').val(tag);
        }

        function getMoiveInfoLink(title, desc) {
            let bgm_match = desc.match(/http.+?(bgm\.tv|bangumi\.tv|chii\.in)\/subject\/\d+/);
            if (bgm_match) {
                return bgm_match[0];
            }
            let douban_match = desc.match(/movie\.douban\.com\/subject\/(\d+)/);
            if (douban_match) {
                return 'https://movie.douban.com/subject/' + douban_match[1];
            }
            let imdb_match = desc.match(/www\.imdb\.com\/title\/(tt\d+)/);
            if (imdb_match) {
                return imdb_match[1];
            }
            let steam_match = desc.match(/http.+?(store\.steampowered\.com|steamcommunity\.com)\/app\/\d+/);
            if (steam_match) {
                return steam_match[0];
            }
            let title_match = title.match(/\[([\s\S]+?)[\/\]]/);
            return title_match ? title_match[1].trim() : "";
        }
        //复制种子信息
        jq('#clone_btn').click(function () {
            var info = jq('#clone_info');
            let copy_link = jq('#clone_from').val().trim();
            if (copy_link == '') {
                info.html('<b>请输入链接</b>')
                return;
            }
            if (/^\d+$/.test(copy_link) || copy_link.match(/bt\.neu6\.edu\.cn/)) {
                let seedfrom = (/^\d+$/.test(copy_link)) ? copy_link : copy_link.match(/(thread-|tid=)(\d+)/)[2];

                // 如果输入了有效的编号，开始读取对应的种子页面
                info.html('<b>正在读取...</b>');
                jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function (resp) {
                    info.html('<b>正在分析...</b>');
                    let body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0].replace(/来自群组: <a[\s\S]*?a>/, "");
                    let page = jq(body); // 构造 jQuery 对象，用于后期处理
                    let title = page.find("span#thread_subject").text();
                    if (!title) {
                        info.html('<b>失败，可能由于种子不存在或者网络问题</b>');
                        return;
                    }
                    if (auto_add) {
                        if (forum_id == 48) { //高清剧集
                            let tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                            if (tv_name) {
                                let tv_season = tvseasonhandle(tv_name[0], 48);
                                title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                            }
                        } else if (forum_id == 14) { //电视剧集
                            let tv_name1 = title.match(/\[[ESP]{0,2}\d{2}[-\w]*\d{0,2}\]/);
                            if (tv_name1) {
                                let tv_season1 = tvseasonhandle(tv_name1[0], 14);
                                title = title.replace(/\[[ESP]{0,2}\d{2}[-\w]*\d{0,2}\]/, tv_season1);
                            }
                        } else if (forum_id == 44) { //动漫
                            let tv_name2 = title.match(/\[[ES]{0,2}\d{2,3}[-E\/]{0,2}\d{0,3}[\s\S]*?\]/);
                            if (tv_name2) {
                                let tv_season2 = tvseasonhandle(tv_name2[0], 44);
                                title = title.replace(/\[[ES]{0,2}\d{2,3}[-E\/]{0,2}\d{0,3}[\s\S]*?\]/, tv_season2);
                            }
                        } else if (forum_id == 16) { //综艺娱乐
                            let fields = title.match(/\[[^\]]*\]/g);
                            if (fields[0].length === 10) {
                                let dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                                let year = fields[0].substring(1, 5);
                                let month = fields[0].substring(5, 7);
                                let day = fields[0].substring(7, 9);
                                if (leapyear(parseInt(year))) {
                                    dayofmonths[1] += 1;
                                }
                                let monthadd = parseInt((parseInt(day) + 7) / dayofmonths[parseInt(month) - 1]);
                                day = numatostring2((parseInt(day) + 7) % dayofmonths[parseInt(month) - 1]);
                                let yearadd = 0;
                                if ((parseInt(month) + monthadd) > 12) {
                                    yearadd = 1;
                                }
                                year = parseInt(year) + yearadd;
                                month = numatostring2((parseInt(month) + monthadd) % 12);
                                fields[0] = "[" + year + month + day + "]";
                            }
                            fields[3] = "[]";
                            title = "";
                            for (let i = 0; i < fields.length; i++) {
                                title = title + fields[i];
                            }
                        }
                    }

                    //填写分类
                    let oldtype = page.find('a#newspecial').attr("onclick").match(/fid=(\d+)/)[1];
                    let newtype = location.href.match(/fid=(\d+)/)[1];
                    if (page.find("h1.ts a").length) {
                        let movietype = page.find("h1.ts a").text().replace(/^\[|\]$/g, '');
                        let typeid = page.find("h1.ts a").attr("href").match(/typeid=(\d+)/)[1];
                        // 如果发布种子与引用的种子的版块不一样
                        if (oldtype != newtype) {
                            let type_id_name = {
                                "48": {
                                    "247": "大陆",
                                    "248": "港台",
                                    "249": "其他1",
                                    "250": "其他2",
                                    "251": "其他",
                                    "252": "版务公告"
                                },
                                "77": {
                                    "178": "大陆",
                                    "179": "港台",
                                    "180": "其他1",
                                    "181": "其他2",
                                    "182": "其他"
                                },
                                "14": {
                                    "101": "大陆",
                                    "102": "港台",
                                    "103": "其他1",
                                    "104": "其他2",
                                    "105": "其他",
                                    "106": "版务公告"
                                },
                                "73": {
                                    "298": "大陆",
                                    "299": "港台",
                                    "300": "其他1",
                                    "301": "其他2",
                                    "302": "其他",
                                    "303": "版务公告"
                                },
                                "45": {
                                    "231": "大陆",
                                    "232": "港台",
                                    "233": "日韩",
                                    "234": "欧美",
                                    "235": "其他",
                                    "236": "版务公告"
                                },
                                "13": {
                                    "94": "大陆",
                                    "95": "港台",
                                    "96": "日韩",
                                    "97": "欧美",
                                    "98": "其他",
                                    "99": "版务公告",
                                    "100": "移动视频"
                                }
                            };
                            let matched = false;
                            for (let k in type_id_name[newtype]) {
                                if (movietype == type_id_name[newtype][k]) {
                                    typeid = k;
                                    matched = true;
                                    break;
                                }
                            }
                            typeid = (matched) ? typeid : 0;
                        }
                        if (movietype && typeid) {
                            jq('#typeid_ctrl_menu li').removeClass('current');
                            jq('#typeid_ctrl').html(movietype);
                            jq('#typeid>option').val(typeid);
                        }
                    }
                    //对将要填入的内容部分进行预处理
                    let descr = page.find('td.t_f').first();
                    //如果存在修改信息(本帖最后由 xxxxxx 于 yyyy-MM-dd HH:mm 编辑)，则删除
                    if (descr.find('.pstatus').length) {
                        descr.find('.pstatus').remove();
                        //删除修改信息与正文之间两个空行
                        descr.find('br').eq(0).remove();
                        descr.find('br').eq(0).remove();
                    }
                    //图片处理（对上传的图片）
                    descr.find('ignore_js_op').each(function () {
                        let img = jq(this).find('img:first');
                        //借用file属性信息修正引用过程中出错的src信息
                        img.attr('src', 'http://bt.neu6.edu.cn' + img.attr('file'));
                        //移除引用过程中原图片无用的img属性
                        img.removeAttr('file id aid zoomfile class inpost onmouseover onclick');
                        let hideimg = img.parent('ignore_js_op'); //移动img结点
                        img.insertAfter(hideimg);
                    });
                    //代码部分处理
                    descr.find('div.quote').remove();
                    descr.find('.blockcode').remove();
                    descr.find('blockcode').remove();
                    //移除含有图片或附件的父节点
                    descr.find('ignore_js_op').remove();
                    // 影片链接
                    let link = getMoiveInfoLink(title, descr.text());
                    // 公告
                    if (jq('#e_textarea').html().match(/\[table[\s\S]+?\[\/table\]/)) {
                        descr.find('table:first').remove();
                    }
                    //标签
                    let tag = [];
                    page.find('div.ptg.mbm.mtn a').each(function () {
                        tag.push(jq(this).text());
                    });
                    // 填写信息
                    fillSeedInfo(title, descr.html(), link, tag.join(','));
                    info.html('<b>克隆种子信息完成</b>');
                });
            } else {
                info.html('<b>请输入有效的种子链接</b>');
            }
        });
    }

    let match = location.href.match(/#clone_(\d+)/);
    if (match) {
        jq('#clone_from').val(match[1]);
        history.pushState("", document.title, location.href.replace(/#clone_\d+/, ""));
        jq('#clone_btn').click();
    }
    if (location.href.match(/action=edit/)) {
        jq('#query_input').val(getMoiveInfoLink(jq('#subject').val(), jq('#e_textarea').html()));
    }

    jq(window).resize(function () {
        jq("#subject").width(jq('#postbox').width() - 130);
        jq("div.specialpost.s_clear input").width(jq('#postbox').width() - 450);
    });

})();