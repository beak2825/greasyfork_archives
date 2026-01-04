// ==UserScript==
// @name         天涯小助手
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  6个功能：1.去广告(包括楼层中的) 2.隐藏垃圾楼层(红包、打赏、废话) 3.展开评论 4.只看楼主 5.显示头像 6.显示用户资料卡
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @author       高压锅
// @include      http*://bbs.tianya.cn/post-*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/383277/%E5%A4%A9%E6%B6%AF%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383277/%E5%A4%A9%E6%B6%AF%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    $('script[src="https://d31qbv1cthcecs.cloudfront.net/atrk.js"]').remove();
    var gyg_filter_garbage = GM_getValue('filter_garbage', '1') == '1';
    var gyg_expand_comments = GM_getValue('expand_comments', '1') == '1';
    var gyg_see_only_host = GM_getValue('see_only_host', '0') == '1';
    var gyg_disp_avatar = GM_getValue('disp_avatar', '1') == '1';
    var lzid = $('.js-bbs-act').attr('_host');

    $('head').append('<style type="text/css">#js-bc-shang,#js-tybc-3-2,#bc_dsEbookMon,.tybc-wp,.ds_vip_seats,#ty_msg_mod,#shang-move,#ds-quick-menu,.open-vip-tips,.vip-btn,#bbs_login_div,.bbs-login-tip{display:none !important;}</style>');
    $('head').append('<style type="text/css">#gyg_primsg_div{padding: 5px; background-color: white; border: 1px solid black; display: none; width: 500px; height: 360px; position:fixed; top: calc(50% - 180px); left: calc(50% - 250px);} .gyg_card_btn{margin: 2px 6px 2px 0; padding: 2px; width: 45px; text-align: center; border: 1px solid grey; cursor: pointer; float: left} .gyg_card_btn:hover{border: 1px solid red} .atl-head .atl-info{height: 42px !important;} .avatar_inline{height:40px;width:40px;}</style>');
    $('body').append('<div id="gyg_user_card" style="display: none; padding: 5px; width: 300px; height: 180px; background-color: white; position: fixed; z-index: 2; border: 1px solid grey"></div>');
    $('div[id^="js-tybc-"],div.ads-loc-holder,div.post-area-adv,.host-stocks,#niuren_ifm,#host_per_info,div.read-menu > a').remove();
    $('.read-menu').first().append('<input type="checkbox" id="disp-avatar"' + (gyg_disp_avatar ? ' checked="checked"' : '') + ' /><label for="disp-avatar">头像</label><input type="checkbox" id="filter-garbage"' + (gyg_filter_garbage ? ' checked="checked"' : '') + ' /><label for="filter-garbage">脱水</label><input type="checkbox" id="expand-comments"' + (gyg_expand_comments ? ' checked="checked"' : '') + ' /><label for="expand-comments">展开评论</label><input type="checkbox" id="see-only-host"' + (gyg_see_only_host ? ' checked="checked"' : '') + ' /><label for="see-only-host">只看楼主</label><iframe style="display: none" id="proxy" src="http://www.tianya.cn/proxy.html"></iframe>');
    var ks = [
        '<br>',
        'mark',
        '记号',
        '留个脚印',
        '兰州烧饼',
        '(早|晚)上好',
        '(上|中|下)午好',
        '(早|晚)安',
        '(好|顶)(帖|贴)',
        '(顶|纪念|标记|马克)一?下?',
        '帮顶',
        '点赞',
        '赞同',
        '日常',
        '安全点赞区',
        '翻(页|了)',
        '顶(起|贴|帖)',
        '(支持|学习)(一下|楼主)',
        '(催|快|坐?等)更',
        '(路|撸)过',
        '加油',
        '继续',
        '(节日|新年|春|元旦|国庆|端午|中秋|仲秋|元宵|情人|父亲|母亲|七夕|重阳|除夕|龙舟|清明|腊八|寒食|小年|周末|儿童|六一|五四|五一|劳动|青年|妇女|三八|光棍|建军|泼水|感恩|复活|圣诞|平安夜|万圣|植树|愚人|耶旦|耶诞|受难|开斋)节?(快乐|安康|愉快)',
        '火?(钳|前)?(留|刘)(名|明|翔|声)',
        '盖楼',
        '打卡',
        '睡(觉|前)',
        '谢谢',
        '感(谢|恩|激|动)',
        '合影',
        '冒泡',
        '留念',
        '(人(民|们)发来)?(贺|核)电',
        '灌水',
        '看看',
        '试试',
        '呵呵',
        '哈哈',
        '恭喜',
        '前排',
        '围观',
        '占座',
        '沙发',
        '板凳',
        '占个?座位?',
        '欢迎',
        '先顶再看',
        '(师|拭)(母|目)(以|已)(呆|待)',
        '(收藏|关注|厉害|辛苦|学习|回来)(了|啦)?',
        '酱油',
        '牛(逼|批|b|笔)',
        '精辟',
        '已阅',
        '膜拜',
        '红包',
        '小广告',
        '(有点|几个|什么)意思',
        '破亿',
        '今夜无眠',
        '七(哥|叔)',
        '本人没有任何联系方式，小广告都是骗子',
        '埋钻发红包.\\d\\d%',
        '埋钻，(\\d\\d%)?概率(\\d\\d%)?'
    ];
    var re = new RegExp('(?:' + ks.join(')|(?:') + ')', 'ig');
    $('#filter-garbage').click(function () {
        gyg_filter_garbage = !gyg_filter_garbage;
        resort();
        GM_setValue('filter_garbage', gyg_filter_garbage ? '1' : '0');
        $(this).blur();
    });
    $('#see-only-host').click(function () {
        gyg_see_only_host = !gyg_see_only_host;
        resort();
        GM_setValue('see_only_host', gyg_see_only_host ? '1' : '0');
        $(this).blur();
    });
    $('#disp-avatar').click(function () {
        gyg_disp_avatar = !gyg_disp_avatar;
        resort();
        GM_setValue('disp_avatar', gyg_disp_avatar ? '1' : '0');
        $(this).blur();
    });
    function resort() {
        var aHidden = new Array();
        if (gyg_filter_garbage) {
            aHidden.push('[garbage="1"]');
        }
        if (gyg_see_only_host) {
            aHidden.push('[ishost="0"]');
        }
        $('div.atl-item').each(function () {
            var jThis = $(this);
            jThis.is(aHidden.join(',')) ? jThis.hide() : jThis.show();
        });
        gyg_disp_avatar ? $('.avatar_inline').show() : $('.avatar_inline').hide();
    }
    $('#expand-comments').click(function () {
        $(this).blur();
        gyg_expand_comments = !gyg_expand_comments;
        $('a.ir-showreply[yh_cmt_btn="1"]').each(function () {
            $(this)[0].click();
        });
        GM_setValue('expand_comments', gyg_expand_comments ? '1' : '0');
    });
    var lastCnt = '';
    $('div.atl-item').each(function () {
        var jThis = $(this);
        var _hostid = jThis.attr('_hostid');
        jThis.attr('ishost', _hostid == lzid ? '1' : '0');

        if (jThis.find('div.red-pkt-v2').length > 0 || jThis.find('a.dashang-btn').length > 0) {
            jThis.attr('garbage', '1');
            return;
        }

        var jContent = jThis.find('div.bbs-content').first();
        var imgs = jContent.find('img');
        if (imgs.length > 2) {
            var arrCheck = [], src = '';
            for (var i = 0; i < imgs.length; i++) {
                src = $(imgs[i]).attr('original');
                if (arrCheck.indexOf(src) == -1) {
                    arrCheck.push(src);
                }
            }
            if (arrCheck.length == 1) {
                jThis.attr('garbage', '1');
                return;
            }
        }
        jThis.find('div.atl-info span').first().prepend('<img class="avatar_inline" _hostname="' + $(this).attr('js_username') + '" _hostid="' + _hostid + '" style="display: none" src="http://tx.tianyaui.com/logo/small/' + _hostid + '" />');
        jThis.find('.ir-list li').each(function () {
            var cid = $(this).attr('_userid');
            $(this).find('p a').first().prepend('<img class="avatar_inline" _hostname="' + $(this).attr('_username') + '" _hostid="' + cid + '" style="display: none" src="http://tx.tianyaui.com/logo/small/' + cid + '" />' + (cid != lzid && _hostid == cid ? '(层主) ' : ''));
        });
        var jReply = jThis.find('a.ir-showreply');
        if (jReply.length > 0) {
            jThis.attr('garbage', '0');
            jReply.attr('yh_cmt_btn', '1');
            if (gyg_expand_comments) {
                jReply[0].click();
            }
            return;
        }
        var htmlContent = jContent.html();
        if ((_hostid + htmlContent) == lastCnt) {
            jThis.attr('garbage', '1');
            return;
        }
        lastCnt = _hostid + htmlContent;
        var dry = $.trim(htmlContent.replace(re, '')).replace(/([·…!?！？\n。、.~～，,顶哈哦呵嗯噢喔嘻啊咳（） ])\1+/g, '$1').replace(/[·…!?！？\n。、.~～，,顶哈哦呵嗯噢喔嘻啊咳（） ]+$/, '').replace(/^[·…!?！？\n。、.~～，,顶哈哦呵嗯噢喔嘻啊咳（） ]+/, '');
        if (dry.length < 4 || /^[a-zA-Z0-9]+$/.test(dry)) {
            jThis.attr('garbage', '1');
        }
    });
    $('body').on('DOMSubtreeModified', '.ir-list ul', function (e) {
        if (gyg_disp_avatar) {
            return;
        }
        var evt = e || window.event;
        var t = $(evt.target);
        var _hostid = t.parents('div.atl-item').attr('_hostid');
        if (t.html() != '') {
            t.find('li').each(function () {
                var cid = $(this).attr('_userid');
                $(this).find('p a').first().prepend('<img class="avatar_inline" _hostname="' + $(this).attr('_username') + '" _hostid="' + cid + '"' + (gyg_disp_avatar ? '' : ' style="display: none"') + ' src="http://tx.tianyaui.com/logo/small/' + cid + '" />' + (cid != lzid && _hostid == cid ? '(层主) ' : ''));
            });
        }
    });
    var arrFollowed = {}, gyg_json_uinfo = {}, gyg_score = {}
    function gyg_getUserInfo(uid, uname) {
        if (gyg_json_uinfo[uid] == undefined) {
            $('#proxy')[0].contentWindow.jQuery.when($('#proxy')[0].contentWindow.jQuery.ajax({
                method: 'GET',
                url: 'http://www.tianya.cn/api/tw',
                dataType: 'json',
                data: {
                    'params.userId': uid,
                    'method': 'userBlack.ice.isBlack'
                }
            }), $('#proxy')[0].contentWindow.jQuery.ajax({
                method: 'GET',
                dataType: 'json',
                url: 'http://www.tianya.cn/api/bbsuser',
                data: {
                    'params.userId': uid,
                    'method': 'userinfo.ice.getUserTotalList'
                }
            }), $('#proxy')[0].contentWindow.jQuery.ajax({
                method: 'GET',
                dataType: 'json',
                url: 'http://www.tianya.cn/api/tw',
                data: {
                    'params.userId': uid,
                    'method': 'following.ice.select'
                }
            }), $('#proxy')[0].contentWindow.jQuery.ajax({
                method: 'GET',
                dataType: 'json',
                url: 'http://www.tianya.cn/api/tw',
                data: {
                    'params.userId': uid,
                    'method': 'follower.ice.select'
                }
            }), $('#proxy')[0].contentWindow.jQuery.ajax({
                method: 'GET',
                dataType: 'html',
                url: 'http://www.tianya.cn/' + uid
            })).done(function (m1, m2, m3, m4, m5) {
                var isBlack = m1[0].data != undefined && m1[0].data.isBlack == 1;
                var nReply = 0, nThread = 0, nFollowed = 0, nFans = 0;
                if (m2[0].data != undefined && m2[0].data.reply != undefined) {
                    nReply = m2[0].data.reply;
                    nThread = m2[0].data.compose;
                }
                if (m3[0].data != undefined && m3[0].data.total != undefined) {
                    nFollowed = m3[0].data.total;
                }
                if (m4[0].data != undefined && m4[0].data.total != undefined) {
                    nFans = m4[0].data.total;
                }
                var regTime = /regTime:'(.+)'/.exec(m5)[1];
                gyg_json_uinfo[uid] = {'uname': uname, 'isBlack': isBlack, 'nReply': nReply, 'nThread': nThread, 'nFollowed': nFollowed, 'nFans': nFans, 'regTime': regTime};
                gyg_updateUserCard(uid, gyg_json_uinfo[uid]);
                $.get('http://tyt.tianya.cn/reward/getUserScore.do?userId=' + uid + '&var=g_voteEnergy', '', function () {
                    var a = g_voteEnergy['data'];
                    var score = parseInt((a['estimateValue'] + a['score']) * 100) / 100;
                    gyg_score[a['userId']] = score;
                    $('#gyg_tyscore').text(score);
                }, 'script');
            });
        } else {
            gyg_updateUserCard(uid, gyg_json_uinfo[uid]);
        }
    }
    function gyg_updateUserCard(uid, uinfo) {
        var bFollowed = !!arrFollowed[uid];
        var html = '<div style="height: 22px; text-align: center"><h3><a href="http://www.tianya.cn/' + uid + '" target="_blank">' + uinfo['uname'] + '</a></h3></div>'
                + '<div style="float: left"><img src="http://tx.tianyaui.com/logo/' + uid + '" style="margin: 0 20px 0 4px; height: 130px; width: 130px" /></div>'
                + '<div id="gyg_ufollowing"><a href="http://www.tianya.cn/' + uid + '/follow" target="_blank">Ta关注的人：<strong>' + uinfo['nFollowed'] + '</strong></a></div>'
                + '<div><a href="http://www.tianya.cn/' + uid + '/fans" target="_blank">Ta的粉丝：<strong id="gyg_ufans">' + uinfo['nFans'] + '</strong></a></div>'
                + '<div id="gyg_uthread"><a href="http://www.tianya.cn/' + uid + '/bbs?t=post" target="_blank">主贴：<strong>' + uinfo['nThread'] + '</strong></a></div>'
                + '<div id="gyg_ureply"><a href="http://www.tianya.cn/' + uid + '/bbs?t=reply" target="_blank">回帖：<strong>' + uinfo['nReply'] + '</strong></a></div>'
                + '<div id="gyg_followit" followed="' + (bFollowed ? 1 : 0) + '" class="gyg_card_btn">' + (bFollowed ? '已关注' : '关注') + '</div>'
                + '<div id="gyg_blackit" blacked="' + (uinfo['isBlack'] ? 1 : 0) + '" class="gyg_card_btn">' + (uinfo['isBlack'] ? '已拉黑' : '拉黑') + '</div>'
                + '<div id="gyg_send_primsg" class="gyg_card_btn">发消息</div>'
                + '<div style="float: left; color: grey">天涯分：<span id="gyg_tyscore">' + (gyg_score[uid] == undefined ? '...' : gyg_score[uid]) + '</span> 注册日期：' + uinfo['regTime'] + '</div>'
                + '<input type="hidden" id="cardUid" value="' + uid + '" />'
                + '<input type="hidden" id="cardUname" value="' + uinfo['uname'] + '" />';
        $('#gyg_user_card').html(html);
    }
    $(document).on('click', '#gyg_followit', function () {
        var that = $(this);
        var followed = $(this).attr('followed') == '1';
        var uid = $('#cardUid').val();
        var data = followed ? {} : {'params.followingUserId': uid};
        var url = followed ? 'http://www.tianya.cn/api/tw?method=following.ice.delete&params.followingUserId=' + uid : 'http://www.tianya.cn/api/tw?method=following.ice.insert';
        var method = followed ? 'GET' : 'POST';
        $('#proxy')[0].contentWindow.jQuery.ajax({
            type: method,
            url: url,
            dataType: 'json',
            data: data
        }).done(function (msg) {
            that.attr('followed', followed ? '0' : '1');
            arrFollowed[uid] = !followed;
            $('#gyg_ufans').text(followed ? parseInt($('#gyg_ufans').text()) - 1 : parseInt($('#gyg_ufans').text()) + 1);
            if (!followed) {
                $('#gyg_blackit').html('拉黑');
                gyg_json_uinfo[uid]['isBlack'] = false;
            }
            that.html(followed ? '关注' : '已关注');
            alert(msg.message);
        }).fail(function (a, text, err) {
            alert('出错了： ' + text);
        });
    });
    $(document).on('click', '#gyg_blackit', function () {
        var that = $(this);
        var blacked = $(this).attr('blacked') == '1';
        var uid = $('#cardUid').val();
        var data = blacked ? {'method': 'userBlack.ice.delete', 'params.blackUserIds': uid} : {'method': 'userBlack.ice.add', 'params.blackUserId': uid};
        $('#proxy')[0].contentWindow.jQuery.ajax({
            type: 'POST',
            url: 'http://www.tianya.cn/api/tw',
            dataType: 'json',
            data: data
        }).done(function (msg) {
            that.attr('blacked', blacked ? '0' : '1');
            gyg_json_uinfo[uid]['isBlack'] = !blacked;
            if (!blacked) {
                $('#gyg_followit').html('关注');
                arrFollowed[uid] = false;
            }
            that.html(blacked ? '拉黑' : '已拉黑');
            alert(msg.message);
        }).fail(function (a, text, err) {
            alert('出错了： ' + text);
        });
    });
    $('body').append('<div id="gyg_primsg_div" style="z-index:999"></div>');
    $(document).on('click', '#gyg_send_primsg', function () {
        $('#gyg_user_card').hide();
        var html = '<div style="float: right; cursor: pointer; font-weight: bold; color: blue;" class="gyg_primsg_cancel_btn">X</div><div>给 <span style="font-weight: bold">' + $('#cardUname').val() + '</span> 发消息</div>'
                + '<textarea id="gyg_primsg_content" style="width: 90%; height:300px"></textarea>'
                + '<input id="gyg_primsg_uid" type="hidden" value="' + $('#cardUid').val() + '" />'
                + '<input id="gyg_primsg_uname" type="hidden" value="' + $('#cardUname').val() + '" />'
                + '<div><input id="gyg_primsg_send_btn" type="button" value="发送" /><input class="gyg_primsg_cancel_btn" type="button" value="取消" /></div>';
        // .css({top: $(this).offset().top, left: $(this).offset().left, position: 'absolute'})
        $('#gyg_primsg_div').html(html).show();
        $('#gyg_primsg_content').focus();
    });
    $(document).on('click', '#gyg_primsg_send_btn', function () {
        $('#proxy')[0].contentWindow.jQuery.ajax({
            'type': 'POST',
            'url': 'http://www.tianya.cn/api/msg?method=messageuser.insertmessageforweb',
            'data': {
                'params.receiveUserId': $('#cardUid').val(),
                'params.content': $('#gyg_primsg_content').val(),
                'params.code': '',
                'params.sourceName': '个人主页'
            },
            'success': function (msg) {
                alert(msg.message);
                $('#gyg_primsg_div').hide();
            },
            'dataType': 'json'
        });
    });
    $(document).on('click', '.gyg_primsg_cancel_btn', function () {
        $('#gyg_primsg_div').hide();
    });
    var gTimer = null;
    function bindCard() {
        $(document).on('mouseenter', '.avatar_inline', function (e) {
            var it = $(this);
            gTimer = setTimeout(function () {
                $('#gyg_user_card').css({top: it.offset().top, left: it.offset().left, position: 'absolute'}).html('稍等。。。').show();
                gyg_getUserInfo(it.attr('_hostid'), it.attr('_hostname'));
            }, 500);
        }).on('mouseleave', '.avatar_inline', function () {
            clearTimeout(gTimer);
        });
        $('#gyg_user_card').on('mouseleave', function () {
            $(this).hide();
        })
    }
    var isLogin = false;
    (function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            isLogin = true;
            $.getScript(iceURL + "?var=varMyAllFriend&method=following.ice.selectall", function (d) {
                for (var i = 0; i < varMyAllFriend.data.follow.length; i++) {
                    arrFollowed[varMyAllFriend.data.follow[i]] = 1;
                }
                bindCard();
            });
            return parts.pop().split(";").shift();
        } else {
            bindCard();
        }
    })('user');
    resort();
})();