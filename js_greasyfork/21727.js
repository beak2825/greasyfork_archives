// ==UserScript==
// @name        81局长的抽奖秘籍
// @namespace   https://greasyfork.org/zh-CN/scripts/21727-81%E5%B1%80%E9%95%BF%E7%9A%84%E6%8A%BD%E5%A5%96%E7%A7%98%E7%B1%8D
// @version     1.0483.53
// @include     http://live.bilibili.com/*
// @grant       none
// @Author      xylern;iiicccoooddd
// @copyright   xylern
// @description 81局长的抽奖秘籍你懂的

// @downloadURL https://update.greasyfork.org/scripts/21727/81%E5%B1%80%E9%95%BF%E7%9A%84%E6%8A%BD%E5%A5%96%E7%A7%98%E7%B1%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/21727/81%E5%B1%80%E9%95%BF%E7%9A%84%E6%8A%BD%E5%A5%96%E7%A7%98%E7%B1%8D.meta.js
// ==/UserScript==

var date = new Date();
date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
var xxa = $.cookie("DedeUserID");
$.cookie("DedeUserID", xxa, {path: '/', expires: date, domain: 'bilibili.com'});
var xya = $.cookie("DedeUserID__ckMd5");
$.cookie("DedeUserID__ckMd5", xya, {path: '/', expires: date, domain: 'bilibili.com'});
var yya = $.cookie("SESSDATA");
$.cookie("SESSDATA", yya, {path: '/', expires: date, domain: 'bilibili.com'});
var zza = $.cookie("bili_jct");
$.cookie("bili_jct", zza, {path: '/', expires: date, domain: 'bilibili.com'});


var _u=window.location.pathname.replace("/","");
var Moer_=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;

window.BiliRank = {
	objList:[],
	p:[],
	c_:["#646c7a","#ff5893"],
	myRankList: function (){
		$('#mRankListDIV').empty();
		if (! ($('#P_aud').length)) {
			$('body').after('<div id="P_aud" style="width:1;height:1;display:block;"></div>');
		}
		var t = new Date,
		e = t.getDate(),
		a = t.getMonth() + 1,
		n = t.getFullYear(),
		r = "";
		r = n.toString() + (a < 10 ? "0" + a : a.toString()) + (e < 10 ? "0" + e : e.toString());
		var aj = $.ajax({
			url: '/rank/getCond?datatype=day&day='+r+'&giftid=39&usertype=master',
			async: false,
			success: function (response) {
				var resObj = JSON.parse(response);
				if (resObj.length){
					for (var ii=0; ii<resObj.length; ii++){
					//console.warn(resObj[ii]);
						var a=resObj[ii];
						var color_=BiliRank.c_[BiliRank.objList.length?($.inArray(a.roomid,BiliRank.p)>-1?1:BiliRank.checkRes(a,1)):0];
						$('#mRankListDIV').append('<div style="width:100%;line-height:23px;font-size:12px;" onmousedown="javascript:BiliRank.clearP('+a.roomid+');$(this).find(\'.url\')[0].style.color=\''+BiliRank.c_[0]+'\';"><div style="float:left;min-width:20px;color:'+BiliRank.c_[BiliRank.checkRes(a,2)]+'">'+a.num+'</div><div style="padding-left:3px"><a class="url" href="/'+a.roomid+'" target="_blank" style="white-space:nowrap;cursor:pointer;color:'+color_+';">'+a.uname+'</a></div></div>');
					}
					BiliRank.objList=resObj;
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.warn('['+new Date().toString().split(' ')[4]+']: '+textStatus);
			},
        });
		if (BiliRank._refresh){
			BiliRank.startTimeout();
		}
	},

	startTimeout: function(){
		BiliRank._timeout=setTimeout(function(){eval('BiliRank.myRankList()')},9000+parseInt(3000*Math.random()));
	},

	_timeout: '',
	_refresh: false,

	toggleRefresh: function(){
		BiliRank._refresh=!BiliRank._refresh;
		if (!BiliRank._refresh){
			$('#tgDIV').text('暂停中');
			$('#mRankListDIV').empty();
			$('#tgDIV').css('background-color', '#FF69B4');
			clearTimeout(BiliRank._timeout);
		}else{
			$('#tgDIV').text('启动中');
			$('#tgDIV').css('background-color', '#F0FFF0');
			BiliRank.myRankList();
		}
		//console.warn(BiliRank._refresh);
	},

	checkRes: function(obj, type){
		var r=1;
		for (var aa=0; aa<BiliRank.objList.length;aa++){
			if(obj.roomid==BiliRank.objList[aa].roomid){
				switch(type){
					case 1:
						r=0;
						break;
					case 2:
						if (obj.num==BiliRank.objList[aa].num){
							r=0;
						}
						break;

				}
				
			}
		}
        if (type==1 && r==1 && $.inArray(obj.roomid,BiliRank.p)==-1){
			BiliRank.p.push(obj.roomid);
			console.warn(BiliRank.p);
			$('#P_aud').html('<embed type="audio/mpeg" src="http://localhost/mymy/%E5%BC%B9%E7%B0%A7%E5%A3%B0.mp3" autostart=true loop=false hidden=ture volume="30" starttime="00:00" width=0 height=0></embed>');
        }
		return r;
	},

	clearP: function(roomid){
		BiliRank.p.splice($.inArray(roomid,BiliRank.p),1);
		console.warn(BiliRank.p);
	},

	checkContact: function(){
		//console.warn($('#live-right-attention-panel').hasClass('show'));
		/*$('.right-toolbar-btn.attention').click();
		if(BiliRank._refreshAtt){
			BiliRank._timeoutAtt=setTimeout(function(){eval('BiliRank.checkContact()')},$('#live-right-attention-panel').hasClass('show')?1000:50000);
		}*/
		
		$('#ContactHolder').css('display',BiliRank._refreshAtt?'block':'none');
		if(BiliRank._refreshAtt){
			$('#ContactPage').attr('src', $('#ContactPage').attr('src'));
			BiliRank._timeoutAtt=setTimeout(function(){eval('BiliRank.checkContact()')},50000);
		}
	},

	_timeoutAtt: '',
	_refreshAtt: true,
	toggleAttach: function(){
		BiliRank._refreshAtt=!BiliRank._refreshAtt;
		if (!BiliRank._refreshAtt){
			$('#tgDIV2').css('background-color', '#FF69B4');
			clearTimeout(BiliRank._timeoutAtt);
		}else{
			$('#tgDIV2').css('background-color', '#F0FFF0');
		}
		BiliRank.checkContact();
	},
	
	_n: 1,
	notice: function(){
		console.warn("lllllogout!");
		if (BiliRank._n){
			BiliRank._n=0;
			$('#P_aud').html('<embed type="audio/mpeg" src="http://localhost/mymy/%E9%B8%A3%E5%8F%AB%E5%A3%B0.mp3" autostart=true loop=false hidden=ture volume="20" starttime="00:00" width=0 height=0></embed>');
			if($('#live-right-attention-panel').hasClass('show')){
				BiliRank.toggleAttach();
			}else{
				clearTimeout(BiliRank._timeoutAtt);
			}
		}
	},

}


if(isNaN(_u)){
	if(_u=="rank"){
		$('body').append('<div style="min-width:180px; min-height:100px; left:150px; top:0px;padding:3px; position:fixed; border:1px solid #999;display:block;z-index:9999;background-color:#eee;line-height:20px;font-size:12px;"><div id="tgDIV" style="position:relative;width:73%;height:20px;text-align:center;cursor:pointer;background-color:#F0FFF0; color:#8B7765; float:left;" onmousedown="javascript:BiliRank.toggleRefresh();"></div><div id="tgDIV2" style="position:relative;width:25%;height:20px;text-align:center;cursor:pointer;background-color:#F0FFF0; color:#8B7765; float:right;" onmousedown="javascript:BiliRank.toggleAttach();">关注</div><div id="mRankListDIV"></div></div><div id="ContactHolder" style="width:750px;height:100%;left:300px;top:100px;position:fixed;overflow:hidden;border:1px solid #999;display:block;"><div style="position:relative; left:-380px; top:-250px; width:1150px; height:150%; border:1px solid #000;"><iframe id="ContactPage" src="/i/following" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="no"></iframe></div></div>');
		
		//////////////////logout alarm////////////////
		var mmm=new Moer_(function(records){if(records[0].addedNodes[0].id=='bilibili-quick-login'){BiliRank.notice();};});
		mmm.observe($(document.body)[0],{childList:true});
		$('#ContactPage').load(function(){
			if('/i/following'!=$('#ContactPage').attr('src')){
				console.warn($('#ContactPage').attr('src'));
				BiliRank.notice();
			};
		});

		BiliRank.checkContact();
		BiliRank.myRankList();
		BiliRank.toggleRefresh();

		//console.warn($('#prop-get-rank').children('.prop-list').children('.prop-list-wrap.tab').children('.item'));
		var tmpa=$('#prop-get-rank').children('.prop-list').children('.prop-list-wrap.tab').children('.item');
		for (var i = 0; i<tmpa.length; i++)
		{
            if(tmpa.eq(i).attr('data-giftid')==39){
				tmpa.eq(i).click();
				setTimeout(function(){$('body').scrollTop(1800)}, 500);
				//$("html,body").scrollTop(1200+"px");
                return;
			}
		}
	}
	return;
}


/////////////////////////

window.BiliBox = {
    xtgg: 0,
    dmGongGao: function() {
        BiliBox.xtgg = $('.announcement-content').children().length;
        if (BiliBox.xtgg) {
            for (var i = 0; i < BiliBox.xtgg; i++) {
                var tmp_a = $('.announcement-content').children().eq(i).text();
                var tmp_b = $('.announcement-content').children().eq(i).children('a').attr('href');
                if (tmp_a.substr(0, 2) != ';)') {
                    var tmp_s = 1;
                    if (BiliBox.s_xds && tmp_a.substr( - 11) == '小电视一个，请前往抽奖') {
                        var plus = tmp_a.split('【')[1].split('】')[0];
                        var RMid = tmp_a.split('【')[2].split('】')[0];
                        BiliBox.ChouJiang('xds', RMid, plus, i);
                        tmp_s = 0;
                    };
                    if (BiliBox.s_xds && tmp_a.substr( - 10) == '抽到 小电视抱枕一个') {
                        var plus = tmp_a.split('喜【')[1].split('】在')[0];
                        var RMid = tmp_a.split('【')[2].split('】')[0];
                        BiliBox.XDS_ChaXun(0, RMid, plus, i);
                        tmp_s = 0;
                    };
                    if (BiliBox.s_mhch && tmp_a.substr( - 13) == '触发抽奖，快来点击抽奖啦！') {
                        var plus = tmp_a.split('【')[3].split('】')[0];
                        var RMid = tmp_a.split('【')[1].split('】')[0];
                        BiliBox.JDHD_t = '/eventRoom/';
                        BiliBox.ChouJiang('mhch', RMid, 1, i);
                        tmp_s = 0;
                    };

                    if (tmp_a.substr( - 15) == '风暴，大家快去跟风领取奖励吧！') {
                        var plus = tmp_a.split('【')[1].split('】')[0];
                        var RMid = tmp_a.split('【')[2].split('】')[0];
						//BiliBox.jzfb_A(RMid, -1);
                        tmp_s = 0;
                    };

                    if (tmp_s) {
                        if (! (tmp_b == undefined)) {
                            tmp_a = tmp_a + ' ---> ' + tmp_b;
                        };
                        $('.announcement-content').children().eq(i).html(';)' + $('.announcement-content').children().eq(i).html());
                        BiliBox.Play_(5, 1);
                        console.info(tmp_a);
                    };
                };
            };
        } else {
            BiliBox.FWQerror = 1;
        };
        if (BiliBox.s_jzfb) {
            if ($('#If_mts').length) {
                var tmp_a = $('#If_mts').contents().find('.chat-msg'),
                tmp_b = 0;
                if (tmp_a.length) {
                    if ($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height() - $('#chat-msg-list').scrollTop() <= 36) {
                        tmp_b = 1;
                    };
                    $('#chat-msg-list').append('<span id="chat-tmp-anc"></span>');
                    for (i = tmp_a.length - 1; i >= 0; i--) {
                        tmp_a.eq(i).css({
                            'border': 'solid #4fc1e9',
                            'border-width': '0px 16px'
                        });
                        tmp_a.eq(i).children('.user-name').css('text-decoration', 'underline');
                        tmp_a.eq(i).parent().insertAfter($('#chat-tmp-anc'));
                    };
                    $('#chat-tmp-anc').remove();
                    if (tmp_b) {
                        $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
                    };
                };
            };
            for (i = $('.chat-msg[jzmsg]').length; i < $('.chat-msg').length; i++) {
                var jz_a = $('.chat-msg').eq(i).children('.msg-content').text();
                if (jz_a > 0) {
                    var jz_b = $('.chat-msg').eq(i).attr('data-uid');
                    $('.chat-msg').eq(i).attr('jzmsg', '1');
                    BiliBox.jzfb_A(jz_a, jz_b);
                } else {
                    $('.chat-msg').eq(i).attr('jzmsg', '0');
                };
            };
            var tmp_time = new Date().getTime(),
            tmp_a = $('#jzfb_msg').children('p');
            for (i = 0; i < tmp_a.length; i++) {
                tmp_b = parseInt(tmp_a.eq(i).attr('jztime')) * 1000 + parseInt(tmp_a.eq(i).attr('lasttime'));
                if (tmp_b < tmp_time) {
                    BiliBox.jzfb_A(tmp_a.eq(i).attr('rmid'), -1);
                };
            };
            tmp_a = $('#jzfb_hist').children('p');
            if (tmp_a.length) {
                for (i = 0; i < tmp_a.length; i++) {
                    tmp_b = parseInt(tmp_a.eq(i).attr('lasttime'));
                    if (tmp_time - tmp_b > 1800000) {
                        BiliBox.jzfb_A(tmp_a.eq(i).attr('rmid'), -1);
                    };
                };
            } else {
                $('#jzfb_hist').css('display', 'none');
            };
        };
        if (BiliBox.clear_) {
            $('.gift-msg').css('display', 'none');
            if (BiliBox.clear_ > 1) {
                $('.vip-icon').css('display', 'none');
                $('.medal-info').parent().css('display', 'none');
                $('.live-title-icon').css('display', 'none');
                $('.user-level-icon').css('display', 'none');
                if (BiliBox.clear_ > 2) {
                    $('.square-icon').css('display', 'none');
                };
            };
        };
    },
    XDSid: 0,
    JDHDid: 0,
    JDHD_t: '',
    FWQerror: 1,
    ChouJiang: function(a, b, c, d) {
        var cjLX = a,
        RMid = b,
        plus = c,
        GGid = d,
        RMid_y = b;
        if (RMid <= 5000) {
            RMid_y = BiliBox.ROOMIDzh(RMid);
        };
        if (cjLX == 'xds') {
            var tmp_jg = JSON.parse($.ajax({
                url: '/SmallTV/join?roomid=' + RMid_y + '&id=' + (BiliBox.XDSid + 1),
                async: false
            }).responseText);
            var tmp_a = tmp_jg.code;
            var tmp_b = tmp_jg.msg;
            if (tmp_a == 0) {
                BiliBox.XDSid++;
                if (tmp_b == 'OK') {
                    console.warn('小电视编号[' + BiliBox.XDSid + '-(' + RMid + ')-]参与结果:' + tmp_b + ' - 开奖剩余时间:' + tmp_jg.data.dtime + '秒');
                    $('.announcement-content').children().eq(GGid).html('<span>;)<a href="/' + RMid + '" target="_blank">编号' + BiliBox.XDSid + '开奖时间:' + tmp_jg.data.dtime + '秒</a></span><br>【' + plus + '】赠送给房间[' + RMid_y + ']-' + RMid);
                    setTimeoutfun((function() {
                        return 'BiliBox.XDS_ChaXun(' + BiliBox.XDSid + ',' + RMid + ',0,0)';
                    })(), (tmp_jg.data.dtime * 1000 + 37000));
                    if (tmp_jg.data.dtime < 150 && BiliBox.FWQerror) {
                        BiliBox.FWQerror = 0;
                        BiliBox.Play_(3, 3, '注意！抽奖时间过短');
                    };
                    if (BiliBox.xtgg - GGid == 1) {
                        setTimeoutfun((function() {
                            return 'BiliBox.XDS_YiChangChuLi("xz",1,' + RMid_y + ',' + GGid + ')';
                        })(), 999);
                    };
                } else {
                    console.warn('小电视编号[' + BiliBox.XDSid + '-(' + RMid + ')-]参与结果:' + tmp_b);
                    $('.announcement-content').children().eq(GGid).html('<span>;)抽奖异常！<a href="/' + RMid + '" target="_blank">手动前往>' + RMid + '</a></span><br>本次可能编号: ' + BiliBox.XDSid + ' - ' + RMid_y + '<br>返回值：' + tmp_b);
                    if (BiliBox.FWQerror) {
                        BiliBox.FWQerror = 0;
                        BiliBox.Play_(4, 2, '注意！抽奖已结束或未开始');
                    };
                };
				 $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
            } else {
                BiliBox.XDS_YiChangChuLi(tmp_a, tmp_b, RMid_y, GGid);
            };
        };
        if (cjLX == 'mhch') {
            if (! (BiliBox.JDHDid)) {
                BiliBox.JDHD_YiChangChuLi(0, RMid_y, GGid);
            };
            $('.announcement-content').children().eq(GGid).html(';)' + $('.announcement-content').children().eq(GGid).html() + '抽奖编号:');
            for (i = BiliBox.JDHDid; plus; i++) {
                var tmp_jg = JSON.parse($.ajax({
                    url: BiliBox.JDHD_t + 'join?roomid=' + RMid_y + '&raffleId=' + (i + 1),
                    async: false
                }).responseText);
                if (tmp_jg.msg == '等待开奖') {
                    BiliBox.JDHDid = i + 1;
                    plus--;
                    $('.announcement-content').children().eq(GGid).html($('.announcement-content').children().eq(GGid).html() + '-' + BiliBox.JDHDid);
                    setTimeoutfun((function() {
                        return 'BiliBox.JDHD_ChaXun(' + BiliBox.JDHDid + ',' + RMid_y + ')';
                    })(), 178000);
                } else {
                    BiliBox.JDHD_YiChangChuLi(plus, RMid_y, GGid);
                    plus = 0;
                };
            };
        };
    },
    jzfb_A: function(a, b) {
        var RMid = a,
        RMid_y = a,
        tmp_time = new Date().getTime();
        if (a < 5001) {
            RMid_y = BiliBox.ROOMIDzh(a);
            if (!RMid_y) {
                return;
            };
        };
        var tmp_b = $('#jzfb_hist').children('[rmid="' + RMid_y + '"]'),
        tmp_a = $('#jzfb_msg').children('[rmid="' + RMid_y + '"]');
        if (tmp_b.length) {
            if (b < 0) {
                tmp_b.remove();
                return;
            };
            if (tmp_time - tmp_b.attr('xtstime') < 6000) {
                $('.chat-msg[jzmsg="1"][data-uid="' + b + '"]').eq(0).attr('jzmsg', '3');
                return;
            };
        };
        if (tmp_a.length) {
            if (b < 0) {
                tmp_a.children('a').removeAttr('onclick');
                tmp_a.insertAfter($('#jzfb_hist_anc'));
                $('#jzfb_hist').css('display', 'block');
                return;
            };
            if (tmp_time - tmp_a.attr('xtstime') < 6000) {
                $('.chat-msg[jzmsg="1"][data-uid="' + b + '"]').eq(0).attr('jzmsg', '3');
                return;
            };
        };
        $.ajax({
            url: 'SpecialGift/room/' + RMid_y,
            complete: function(XHR, TS) {
                BiliBox.jzfb_B(RMid, b, RMid_y, tmp_time, XHR, TS);
            }
        });
    },
    JZid: {},
    jzfb_B: function(a, b, c, d, e, f) {
        var RMid = a,
        RMid_y = c,
        tmp_time = new Date().getTime(),
        tmp_jg = JSON.parse(e.responseText),
        tmp_a,
        tmp_b,
        tmp_c = 0;
        if (f == 'success' && tmp_jg.data[39].hadJoin != undefined) {
            tmp_jg = tmp_jg.data[39];
            if (BiliBox.JZid[tmp_jg.id]) {
                $('.chat-msg[jzmsg="1"][data-uid="' + b + '"]').eq(0).attr('jzmsg', '3');
                return;
            } else {
                BiliBox.JZid[tmp_jg.id] = tmp_time;
            };
            tmp_b = escape(tmp_jg.content);
            if (tmp_jg.hadJoin == 0) {
                $('#jzfb_msg').children('[rmid="' + RMid_y + '"]').remove();
                $('#jzfb_msg').prepend('<p rmid="' + RMid_y + '" xtstime="' + d + '" xtsuid="' + b + '" lasttime="' + tmp_time + '" jztime="' + tmp_jg.time + '" jzid="' + tmp_jg.id + '" jznum="' + (tmp_jg.num / 100) + '" jztext="' + tmp_b + '"><a href="/' + RMid + '" style="color:#ffffff" onclick="BiliBox.jzfb_A(' + RMid_y + ',-1);" target="_blank">' + RMid + '</a></p>');
                BiliBox.Play_(5, 3);
                if ($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height() - $('#chat-msg-list').scrollTop() <= 36) {
                    tmp_c = 1;
                };
                for (i = 0; i < $('.chat-msg[jzmsg="1"]').length; i++) {
                    tmp_a = $('.chat-msg[jzmsg="1"]').eq(i);
                    if (tmp_a.attr('data-uid') == b && tmp_a.children('.msg-content').text() == a) {
                        tmp_a.html('<i class="live-icon announcement"></i><div class="announcement-content"><p>;) <span>' + tmp_a.attr('data-uname') + '：</span><br><a href="/' + RMid + '" target="_blank">直播间【' + RMid + '】在 ' + (90 - tmp_jg.time) + ' 秒前产生了 ' + (tmp_jg.num / 100) + ' 倍节奏风暴，大家快去跟风领取奖励吧！</a></p></div>');
                        tmp_a.attr('jzmsg', '2');
                        tmp_a.parent().removeAttr('class');
                        tmp_a.removeClass().addClass('announcement-container beat-storm-sys');
                    };
                };
                if (tmp_c) {
                    $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
                };
            };
            $('#jzfb_hist').children('[rmid="' + RMid_y + '"]').remove();
            if (tmp_jg.hadJoin == 1) {
                $('#jzfb_hist_anc').after('<p rmid="' + RMid_y + '" xtstime="' + d + '" xtsuid="' + b + '" lasttime="' + tmp_time + '" jztime="' + tmp_jg.time + '" jzid="' + tmp_jg.id + '" jznum="' + (tmp_jg.num / 100) + '" jztext="' + escape(tmp_jg.content) + '"><a href="/' + RMid + '" style="color:#ffffff" target="_blank">' + RMid + '</a></p>');
            };
            if (tmp_b.indexOf('%0A') > -1 || tmp_b.indexOf('%5C') > -1 || tmp_b.indexOf('/') > -1 || tmp_b.substr( - 3) == '%20' || tmp_b.substr(0, 3) == '%20' || tmp_b.substr( - 6) == '%u3000' || tmp_b.substr(0, 6) == '%u3000') {
                $('#jzfb_hist').children('[rmid="' + RMid_y + '"]').children('a').text('BUG');
                $('#jzfb_msg').children('[rmid="' + RMid_y + '"]').children('a').text('BUG');
            };
        };
    },
    ROOMIDclass: {
        1 : 5440,
        2 : 5271,
        3 : 23058,
        4 : 5446,
        10 : 504273,
        11 : 46939,
        12 : 46938,
        13 : 46936,
        14 : 46937,
        15 : 91625,
        16 : 20006,
        17 : 308892,
        18 : 5090,
        19 : 312785,
        20 : 313879,
        21 : 638568,
        48 : 63727,
        99 : 127722,
        101 : 42172,
        102 : 5279,
        103 : 34348,
        104 : 18060,
        105 : 5318,
        106 : 10157,
        107 : 5185,
        108 : 25032,
        109 : 12910,
        110 : 5193,
        111 : 15348,
        112 : 5031,
        113 : 11598,
        114 : 5170,
        115 : 1016,
        116 : 45104,
        117 : 5082,
        118 : 46716,
        121 : 11232,
        122 : 22361,
        124 : 37158,
        125 : 41044,
        126 : 36844,
        127 : 35137,
        128 : 36954,
        129 : 39630,
        130 : 34068,
        131 : 41029,
        132 : 39252,
        133 : 10101,
        135 : 21323,
        137 : 46316,
        138 : 36963,
        139 : 1029,
        140 : 13242,
        141 : 39996,
        142 : 53870,
        143 : 5227,
        144 : 41173,
        145 : 48499,
        146 : 46737,
        147 : 24541,
        148 : 10313,
        149 : 54572,
        150 : 78347,
        152 : 46048,
        153 : 44458,
        154 : 50583,
        155 : 39936,
        156 : 51134,
        157 : 64917,
        158 : 11485,
        159 : 94534,
        160 : 81688,
        161 : 96136,
        162 : 35598,
        165 : 75446,
        166 : 32421,
        167 : 62397,
        169 : 18606,
        170 : 23719,
        171 : 57076,
        172 : 58644,
        173 : 66818,
        174 : 38227,
        175 : 51037,
        177 : 43001,
        178 : 62565,
        179 : 68432,
        180 : 98284,
        181 : 51627,
        182 : 75181,
        183 : 5198,
        184 : 64540,
        185 : 68612,
        186 : 96447,
        187 : 35774,
        188 : 142902,
        189 : 70270,
        190 : 74723,
        191 : 53579,
        192 : 55634,
        193 : 70155,
        194 : 26416,
        195 : 54869,
        196 : 19865,
        197 : 109506,
        198 : 75566,
        199 : 90061,
        200 : 94528,
        201 : 45745,
        202 : 91907,
        203 : 101320,
        204 : 82033,
        205 : 38774,
        206 : 56557,
        207 : 82092,
        208 : 76650,
        209 : 40154,
        210 : 73259,
        211 : 56355,
        212 : 98608,
        213 : 47867,
        214 : 82866,
        215 : 66287,
        216 : 94381,
        217 : 271425,
        218 : 5294,
        219 : 53613,
        220 : 272668,
        221 : 53847,
        222 : 110052,
        223 : 24589,
        224 : 31441,
        225 : 97202,
        226 : 44347,
        227 : 159586,
        228 : 37799,
        229 : 65842,
        230 : 52507,
        231 : 270236,
        232 : 277877,
        234 : 184686,
        235 : 268843,
        236 : 58072,
        237 : 75031,
        238 : 38459,
        239 : 347735,
        240 : 140011,
        241 : 93457,
        242 : 154800,
        243 : 55041,
        244 : 39189,
        245 : 27532,
        246 : 26057,
        247 : 14682,
        248 : 32731,
        249 : 258940,
        251 : 57690,
        252 : 204238,
        253 : 109176,
        254 : 36600,
        255 : 95974,
        256 : 127932,
        257 : 188995,
        258 : 177134,
        259 : 174331,
        260 : 34180,
        261 : 128308,
        262 : 291671,
        263 : 66845,
        264 : 234024,
        265 : 340090,
        266 : 67336,
        267 : 335045,
        268 : 307467,
        269 : 295843,
        270 : 54241,
        271 : 430382,
        272 : 527315,
        273 : 53515,
        274 : 403237,
        275 : 46353,
        276 : 13566,
        277 : 288002,
        278 : 306378,
        279 : 394518,
        280 : 151159,
        426 : 33616,
        666 : 452065,
        780 : 390638,
        828 : 99783,
        1000 : 5067,
        1001 : 1001,
        1002 : 1002,
        1003 : 1003,
        1004 : 1004,
        1005 : 1005,
        1006 : 1006,
        1007 : 1007,
        1008 : 1008,
        1009 : 1009,
        1010 : 1010,
        1011 : 1011,
        1012 : 1012,
        1013 : 1013,
        1014 : 1014,
        1015 : 1015,
        1016 : 1016,
        1017 : 1017,
        1018 : 1018,
        1019 : 1019,
        1020 : 1020,
        1021 : 1021,
        1022 : 1022,
        1023 : 1023,
        1024 : 1024,
        1025 : 1025,
        1026 : 1026,
        1027 : 1027,
        1028 : 1028,
        1029 : 1029,
        1030 : 1030,
        1031 : 1031,
        1032 : 1032,
        1035 : 80332,
        1036 : 30212,
        1037 : 5064,
        1038 : 26283,
        1039 : 5077,
        1040 : 49728,
        1041 : 38372,
        1042 : 279058,
        1043 : 70813,
        1045 : 37162,
        1047 : 382110,
        1048 : 97687,
        1049 : 11919,
        1050 : 18619,
        1051 : 57228,
        1052 : 57097,
        1053 : 46437,
        1054 : 102694,
        1055 : 60050,
        1056 : 301160,
        1057 : 101609,
        1058 : 424902,
        1059 : 126556,
        1060 : 145668,
        1062 : 40764,
        1063 : 57997,
        1064 : 24262,
        1065 : 92681,
        1066 : 47264,
        1067 : 10248,
        1068 : 35298,
        1069 : 67272,
        1070 : 421933,
        1071 : 204422,
        1072 : 290352,
        1073 : 392287,
        1074 : 101425,
        1075 : 917766,
        1076 : 32197,
        1077 : 44533,
        1931 : 122194,
        2333 : 59125
    },
    ROOMIDzh: function(a) {
        if (BiliBox.ROOMIDclass[a]) {
            return BiliBox.ROOMIDclass[a];
        } else {
            var RMweb = $.ajax({
                url: '/' + a,
                async: false
            }).responseText;
            if (RMweb.indexOf('ROOMID') == -1) {
                return false;
            };
            var tmp_a = parseInt(RMweb.substring(RMweb.indexOf('=', RMweb.indexOf('ROOMID')) + 2, RMweb.indexOf(';', RMweb.indexOf('ROOMID'))));
            BiliBox.ROOMIDclass[a] = tmp_a;
            return tmp_a;
        };
    },
    zjIDclass: {},
    JPstart: 0,
    XDS_jp: {
        1 : '头【大号小电视抱枕】',
        2 : '条【胖次】',
        3 : '袋【B坷垃】',
        4 : '只【喵娘】',
        5 : '份【便当】',
        6 : '颗【银瓜子】',
        7 : '根【辣条】'
    },
    XDS_ChaXun: function(a, b, c, d) {
        var RMid = b,
        zjID = c,
        GGid = d,
        RMid_y = b;
        if (RMid <= 5000) {
            RMid_y = BiliBox.ROOMIDzh(RMid);
        };
        if (a) {
            if (! (BiliBox.JPstart)) {
                BiliBox.JPstart = a
            };
            var tmp_jg = JSON.parse($.ajax({
                url: '/SmallTV/getReward?roomid=' + RMid_y + '&id=' + a,
                async: false
            }).responseText);
            var tmp_a = tmp_jg.msg;
            if (tmp_a == 'OK') {
                var tmp_b = tmp_jg.data.reward.id;
                console.warn('[' + new Date().toString().split(' ')[4] + ']小电视编号[' + a + '-(' + RMid + ')-]获得道具:[' + tmp_b + '等-' + tmp_jg.data.reward.num + '个] - 抱枕属于:' + tmp_jg.data.fname);
                BiliBox.zjIDclass[a] = {
                    fname: '',
                    room: 0,
                    sname: '',
                    myJP: '',
                    ts: true
                };
                BiliBox.zjIDclass[a]['fname'] = tmp_jg.data.fname;
                BiliBox.zjIDclass[a]['room'] = RMid_y;
                BiliBox.zjIDclass[a]['sname'] = tmp_jg.data.sname;
                BiliBox.zjIDclass[a]['myJP'] = BiliBox.XDS_jp[tmp_b];
                BiliBox.zjIDclass[a]['JPnum'] = tmp_jg.data.reward.num;
                if (tmp_b && tmp_b < 7) {
                    BiliBox.Play_(7, 2);
                    if (tmp_b < 6) {
                        BiliBox.Play_(7, 3);
                    };
                };
            } else {
                if (tmp_a == '正在抽奖中..') {
                    setTimeoutfun((function() {
                        return 'BiliBox.XDS_ChaXun(' + a + ',' + RMid + ',0,0)';
                    })(), 6000);
                } else {
                    console.error('这不可能！小电视编号[' + a + ']查询居然错过了！ ---> http://live.bilibili.com/' + RMid_y);
                    BiliBox.Play_(3, 2);
                    BiliBox.zjIDclass[a]['ts'] = false;
                };
            };
        } else {
            if (BiliBox.JPstart) {
                for (var ii = BiliBox.JPstart; BiliBox.zjIDclass[ii]; ii++) {
                    if (BiliBox.zjIDclass[ii]['ts'] && zjID == BiliBox.zjIDclass[ii]['fname'] && RMid_y == BiliBox.zjIDclass[ii]['room']) {
                        $('.announcement-content').children().eq(GGid).html(';)' + $('.announcement-content').children().eq(GGid).html() + '，您获得' + BiliBox.zjIDclass[ii]['JPnum'] + BiliBox.zjIDclass[ii]['myJP']);
                        BiliBox.zjIDclass[ii]['ts'] = false;
						 $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
                    };
                    if (ii + 1 <= BiliBox.XDSid && !(BiliBox.zjIDclass[ii + 1])) {
                        BiliBox.zjIDclass[ii + 1] = {
                            fname: '',
                            room: 0,
                            ts: false
                        };
                    };
                };
            } else {
                var tmp_jg = JSON.parse($.ajax({
                    url: '/SmallTV/index?roomid=' + RMid_y,
                    async: false
                }).responseText);
                var tmp_a = tmp_jg.code;
                if (tmp_a == 0) {
                    var tmp_lid = 0;
                    if (tmp_jg.data.unjoin[0]) {
                        BiliBox.XDSid = tmp_jg.data.unjoin[0].id - 1;
                        BiliBox.Play_(5, 1);
                        console.warn('正在触发初始化，获得纠正的小电视id为:' + (BiliBox.XDSid + 1));
                    };
                    if (tmp_jg.data.join[0]) {
                        tmp_lid = tmp_jg.data.join[0].id;
                    };
                    if (tmp_jg.data.lastid > 0) {
                        tmp_lid = tmp_jg.data.lastid;
                    };
                    if (BiliBox.XDSid >= tmp_lid) {
                        $('.announcement-content').children().eq(GGid).html(';)' + $('.announcement-content').children().eq(GGid).html());
                    };
                    if (BiliBox.XDSid < tmp_lid) {
                        BiliBox.XDSid = tmp_lid;
                        BiliBox.Play_(5, 1);
                        console.warn('中奖公告的小电视抽奖未参与，获得当次小电视id为:' + BiliBox.XDSid);
                        $('.announcement-content').children().eq(GGid).html(';)' + $('.announcement-content').children().eq(GGid).html() + '<br>纠正小电视ID:' + tmp_lid);
                    };
                } else {
                    console.error('查询小电视id失败，公告可能已过期。错误码[' + tmp_a + ':' + tmp_jg.msg + '] 房间号[' + RMid + ']');
                    $('.announcement-content').children().eq(GGid).html(';)' + $('.announcement-content').children().eq(GGid).html() + '<br>过期公告信息...');
                };
				 $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
            };
        };
    },
    JDHD_ChaXun: function(a, b) {
        var tmp_jg = JSON.parse($.ajax({
            url: BiliBox.JDHD_t + 'notice?roomid=' + b + '&raffleId=' + a,
            async: false
        }).responseText),
        tmp_a = 0;
        if ($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height() - $('#chat-msg-list').scrollTop() <= 36) {
            tmp_a = 1;
        };
        if (tmp_jg.msg == '获取成功') {
            BiliBox.Play_(7, 3);
            if (tmp_jg.data.giftName == '亿元') {
                tmp_jg.data.giftName = '亿圆';
            };
            console.warn('[' + new Date().toString().split(' ')[4] + '](' + b + '|' + a + '|' + tmp_jg.data.giftId + ')酋长叫你回家吃...枪子儿(╬ﾟдﾟ)▄︻┻┳═一 【' + tmp_jg.data.giftName + '】' + tmp_jg.data.giftNum + '个');
            $('.chat-msg-list').html($('.chat-msg-list').html() + '<div><div class="announcement-container drawing-sys"><i class="live-icon announcement"></i><div class="announcement-content"><p>;) 恭喜！在<a href="/' + b + '" target="_blank">' + a + '</a>次抽奖中<br>获得' + tmp_jg.data.giftNum + '个' + tmp_jg.data.giftName + '(°∀°)ﾉ</p></div></div></div>');
        } else {
            $('.chat-msg-list').html($('.chat-msg-list').html() + '<div><div class="announcement-container drawing-sys"><i class="live-icon announcement"></i><div class="announcement-content"><p>;) 那啥...在<a href="/' + b + '" target="_blank">' + a + '</a>次抽奖后...<br>您...充满了力量！棒棒哒</p></div></div></div>');
        };
        if (tmp_a) {
            $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
        };
    },
    XDS_YiChangChuLi: function(a, b, c, d) {
        var code = a,
        msg = b,
        RMid_y = c,
        GGid = d;
        if (code == 'xz') {
            if (msg == 1) {
                var tmp_jg = JSON.parse($.ajax({
                    url: '/SmallTV/join?roomid=' + RMid_y + '&id=' + (BiliBox.XDSid + 1),
                    async: false
                }).responseText);
                if (tmp_jg.code == '0') {
                    BiliBox.XDSid++;
                    BiliBox.Play_(3, 3);
                    console.warn('出现无公告小电视，编号[' + BiliBox.XDSid + ']参与结果:' + tmp_jg.msg + ' - http://live.bilibili.com/SmallTV/join?roomid=' + RMid_y + '&id=' + BiliBox.XDSid);
                    $('.announcement-content').children().eq(GGid).html($('.announcement-content').children().eq(GGid).html() + '<br>！无公告小电视注意！');
                    setTimeoutfun((function() {
                        return 'BiliBox.XDS_YiChangChuLi("xz",1,' + RMid_y + ',' + GGid + ')';
                    })(), 299);
					 $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
                };
            };
            return;
        };
        if (BiliBox.XDSid) {
            var tmp_a = 0,
            tmp_jg = '';
            for (var ii = 2; ii < 20 && !(tmp_a); ii++) {
                tmp_jg = JSON.parse($.ajax({
                    url: '/SmallTV/join?roomid=' + RMid_y + '&id=' + (BiliBox.XDSid + ii),
                    async: false
                }).responseText);
                if (tmp_jg.code == 0) {
                    tmp_a = BiliBox.XDSid + ii;
                };
            };
            if (tmp_a > BiliBox.XDSid) {
                BiliBox.XDSid = tmp_a;
                BiliBox.Play_(4, 3);
                console.warn('小电视id异常，已修正为[' + BiliBox.XDSid + ']并抽奖 ---> http://live.bilibili.com/' + RMid_y);
                $('.announcement-content').children().eq(GGid).html('<span>;)<a href="/' + RMid + '" target="_blank">编号' + BiliBox.XDSid + '开奖时间:' + tmp_jg.data.dtime + '秒</a></span><br>【' + plus + '】赠送给房间[' + RMid_y + ']-' + RMid);
                if (BiliBox.FWQerror) {
                    BiliBox.FWQerror = 0;
                    BiliBox.Play_(3, 3, '注意！存在无公告抱枕房');
                };
            } else {
                console.error('抽奖异常，Code[' + code + ',' + msg + ']，当前编号[' + (BiliBox.XDSid + 1) + ']手动前往 ---> http://live.bilibili.com/' + RMid_y);
                $('.announcement-content').children().eq(GGid).html(';)' + $('.announcement-content').children().eq(GGid).html() + '<br>抽奖异常，请试试手动参与');
                BiliBox.Play_(4, 2, '抽奖异常');
            };
        } else {
            BiliBox.XDS_ChaXun(0, RMid_y, 0, GGid);
            if (BiliBox.XDSid) {
                var plus = $('.announcement-content').children().eq(GGid).text().split('【')[1].split('】')[0];
                BiliBox.ChouJiang('xds', RMid_y, plus, GGid);
            } else {
                console.warn('可能已经错过的小电视 ---> http://live.bilibili.com/' + RMid_y);
                $('.announcement-content').children().eq(GGid).html($('.announcement-content').children().eq(GGid).html() + '<br>错过此电视');
            };
        };
		 $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
    },
    JDHD_YiChangChuLi: function(a, b, c) {
        var RMid_y = b,
        GGid = c;
        var tmp_jg = JSON.parse($.ajax({
            url: BiliBox.JDHD_t + 'check?roomid=' + RMid_y,
            async: false
        }).responseText),
        tmp_jg2,
        tmp_a;
        if (tmp_jg.code == 0 && tmp_jg.data[0]) {
            if (BiliBox.JDHDid) {
                BiliBox.Play_(5, 2);
                console.warn('本次抽奖进入异常处理，故障id为:' + (BiliBox.JDHDid + 1));
                $('.announcement-content').children().eq(GGid).html($('.announcement-content').children().eq(GGid).html() + '+异常处理');
                for (i = 0; tmp_jg.data[i] && a; i++) {
                    if (! (tmp_jg.data[i].status)) {
                        tmp_a = tmp_jg.data[i].raffleId;
                        tmp_jg2 = JSON.parse($.ajax({
                            url: BiliBox.JDHD_t + 'join?roomid=' + RMid_y + '&raffleId=' + tmp_a,
                            async: false
                        }).responseText);
                        if (tmp_jg2.msg == '等待开奖') {
                            $('.announcement-content').children().eq(GGid).html($('.announcement-content').children().eq(GGid).html() + '+' + tmp_a);
                            setTimeoutfun((function() {
                                return 'BiliBox.JDHD_ChaXun(' + tmp_a + ',' + RMid_y + ')';
                            })(), 178000);
                            a--;
                            if (tmp_a > BiliBox.JDHDid) {
                                BiliBox.JDHDid = tmp_a;
                            };
                        } else {
                            console.warn('抽奖参与异常，故障id[' + tmp_a + '] --> http://live.bilibili.com/' + RMid_y);
                        };
                    };
                    if (! (tmp_jg.data[i + 1])) {
                        if (a) {
                            $('.announcement-content').children().eq(GGid).html($('.announcement-content').children().eq(GGid).html() + ':出错');
                            console.warn('抽奖参与异常进入补漏，故障id无法获取或触发 --> http://live.bilibili.com/' + RMid_y);
                            BiliBox.low[RMid_y] = 1;
                            BiliBox.JDHD_YCCL2(RMid_y);
                            BiliBox.Play_(3, 3, '公告异常，登录状态错误或[raffleId]不正确或B站延迟');
                        };
                    };
                    if (a == 0) {
                        console.warn('公告缺失或错乱注意，最后尝试的抽奖id为:' + tmp_a + ' --> http://live.bilibili.com/' + RMid_y);
                        BiliBox.Play_(4, 2);
                    };
                };
            } else {
                BiliBox.Play_(5, 1);
                BiliBox.JDHDid = tmp_jg.data[0].raffleId - 1;
                console.warn('正在触发初始化，获得纠正的画师抽奖id为:' + (BiliBox.JDHDid + 1));
                BiliBox.JDHD_low[RMid_y] = 30;
                setTimeoutfun((function() {
                    return 'BiliBox.JDHD_YCCL2(' + RMid_y + ')';
                })(), 5000);
            };
        } else {
            console.error('当前公告已过期，[raffleId]获取失败');
            BiliBox.Play_(3, 3);
        };
    },
    JDHD_low: {},
    JDHD_YCCL2: function(a) {
        var tmp_jg = JSON.parse($.ajax({
            url: BiliBox.JDHD_t + 'check?roomid=' + a,
            async: false
        }).responseText);
        if (tmp_jg.data[0]) {
            for (i = 0; tmp_jg.data[i]; i++) {
                var tmp_a = tmp_jg.data[i];
                if (! (tmp_a.status)) {
                    $.ajax({
                        url: BiliBox.JDHD_t + 'join?roomid=' + a + '&raffleId=' + tmp_a.raffleId,
                        async: false
                    });
                    if (tmp_a.raffleId > BiliBox.JDHDid) {
                        BiliBox.JDHDid = tmp_a.raffleId;
                    };
                    console.warn('异常处理：最后补漏防线尝试编号ID[' + tmp_a.raffleId + ']');
                    setTimeoutfun((function() {
                        return 'BiliBox.JDHD_ChaXun(' + tmp_a.raffleId + ',' + a + ')';
                    })(), ((tmp_a.time + 79) * 1000));
                };
            };
        };
        if (BiliBox.JDHD_low[a] < 32) {
            setTimeoutfun((function() {
                return 'BiliBox.JDHD_YCCL2(' + a + ')';
            })(), (BiliBox.JDHD_low[a] * 1000));
        };
        BiliBox.JDHD_low[a] *= 2;
    },
    C0x: 0,
    C0y: 0,
    DIVm: 0,
    DIVx: 0,
    DIVy: 0,
    Xmin: 0,
    Ymin: 0,
    anyME: false,
    DIVmove: function(event, a, b, c, d, f) {
        var Cx = event.clientX,
        Cy = event.clientY;
        if (a) {
            if ($('#hide_over').css('display') == 'none') {
                $('#hide_over').css({
                    'width': $('body').width() + 'px',
                    'height': $('body').height() + 'px',
                    'display': 'block'
                });
                BiliBox.C0x = Cx;
                BiliBox.C0y = Cy;
                BiliBox.DIVx = b.position().left;
                BiliBox.DIVy = b.position().top;
                BiliBox.DIVm = b;
                BiliBox.Xmin = c;
                BiliBox.Ymin = d;
                if (f) {
                    BiliBox.anyME = f;
                };
            } else {
                $('#hide_over').css('display', 'none');
                if (BiliBox.anyME && BiliBox.C0x - Cx + BiliBox.C0y - Cy == 0) {
                    eval(BiliBox.anyME);
                    BiliBox.anyME = false;
                };
            };
        } else {
            var tmp_x = Cx - BiliBox.C0x + BiliBox.DIVx;
            if (tmp_x < BiliBox.Xmin) {
                tmp_x = BiliBox.Xmin;
            };
            var tmp_y = Cy - BiliBox.C0y + BiliBox.DIVy;
            if (tmp_y < BiliBox.Ymin) {
                tmp_y = BiliBox.Ymin;
            };
            BiliBox.DIVm.css({
                'left': tmp_x + 'px',
                'top': tmp_y + 'px'
            });
        };
    },
    inkey: function(a, event, b) {
        var tmp_a = '',
        tmp_b;
        tmp_a = window.event ? event.keyCode: event.which;
        if (tmp_a == 8 || tmp_a == 17 || tmp_a == 37 || tmp_a == 39 || tmp_a == 46 || event.ctrlKey) {
            return;
        };
        if (a == 1) {
            tmp_b = parseInt(b.val().replace(/[^0-9]/g, ''));
            if (isNaN(tmp_b)) {
                tmp_b = '';
            };
            b.val(tmp_b);
            if (tmp_a == 13 && b.val() > 0) {
                tmp_b = BiliBox.ROOMIDzh(tmp_b);
                if (!tmp_b) {
                    alert('房间号不存在或此房间状态异常');
                    return;
                };
                BiliBox.LSP(2, tmp_b);
            };
        };
        if (a == 2) {
            tmp_b = parseInt(b.val().replace(/[^0-9]/g, ''));
            if (isNaN(tmp_b)) {
                tmp_b = '';
            };
            b.val(tmp_b);
            if (tmp_a == 13 && b.val() > 0 && $('#PGt').text()) {
                if (BiliBox.gg5269 == 3) {
                    if (tmp_b > Math.ceil(BiliBox.bwm.total / 15)) {
                        tmp_b = Math.ceil(BiliBox.bwm.total / 15);
                    };
                } else {
                    tmp_a = Math.ceil(JSON.parse($.ajax({
                        url: 'area/home?area=all',
                        async: false
                    }).responseText).data.total / 15);
                    if (tmp_b > tmp_a) {
                        tmp_b = tmp_a;
                        $('#PGt').text('/' + tmp_a);
                    };
                };
                console.debug(tmp_b);
                tmp_a = tmp_b % 2;
                BiliBox.PGa = (tmp_b + tmp_a) / 2;
                BiliBox.PGb = 15 - (tmp_a * 15);
                console.debug(BiliBox.PGa + ',' + BiliBox.PGb);
                BiliBox.Pf = true;
                BiliBox.LSP(1, 0);
                b.val('');
                BiliBox.LSP(4, 0);
            };
        };
        if (a == 3) {
            if (b.val().length > 30) {
                b.val(b.val().substr(0, 30));
            };
            if (tmp_a == 13 && b.val() != '') {
                $('#If_mts').contents().find('#danmu-textbox').val(b.val().replace('\n', ''));
                b.val('');
                $('#If_mts').contents().find('#danmu-textbox').focus();
            };
        };
    },
    rmm: {},
    bwm: {
        total: 26,
        data: [{
            title: '高清精选',
            roomid: 'http://player.cntv.cn/standard/cntvHdsLivePlayer20160801.swf?addrs=http://ipanda.vtime.cntv.cloudcdn.net/cache/ipandahds.f4m?AUTH=8JIMdD+pycn0f70saBGrB/+A4JMJ3JFyb2BNQOBTz1E7C2KvmKXf0oLYOp2HzP8Xc6EjmpbRLspmv+x73BXohQ==&ChannelID=ipanda&P2PChannelID=pa://cctv_p2p_hdipanda',
            uname: '成都睾清精选',
            link: '各个园区的精彩部分会实时切换到高清频道，所以在这里可以看到各个园区的熊猫！这里就是熊猫网红之路的起点！',
            golink: 'http://live.ipanda.com/xmcd/index.shtml'
        },
        {
            title: '成年园 A',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel339?AUTH=LJOCsAW4LOrzXOza7hKuRePIAyvHYc/MPxV0JXKFSi2xK+S2d678OvRoQAtVkUSV/HI9KeFclpTh6Bg3g8Esnw==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao01',
            uname: '01 成都直播',
            link: '成年园共设有两路镜头，现居住着“美兰”',
            golink: 'http://live.ipanda.com/xmcd/01/index.shtml'
        },
        {
            title: '成年园 B',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel344?AUTH=85iIjxExXe3/rc+iFDFJBjeOYmDR+YyPPdKzQiABpap4Z21Ab46hXCiz246JmJDiFtrtcvPNYb48fJjkGkLthQ==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao02',
            uname: '02 成都直播',
            link: '“美兰”是“地球一小时”全球形象大使，也是熊猫频道知名网红“喜兰”的哥哥，人称“大爷”',
            golink: 'http://live.ipanda.com/xmcd/02/index.shtml'
        },
        {
            title: '幼年园 A',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel349?AUTH=3S3VemOFasH/jBxKRe/0t5Vlv+tshhgtQ+4G4sxwqn+i03OFSSjIOX6n1R1iSGWwLy4B71hwvKEq1VlgM7T85g==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao03',
            uname: '03 成都直播',
            link: '幼年园共设有4路镜头，3路室外，1路室内，可以全方位的看到“熊孩子”们的吃喝拉撒睡。现居住着7只2岁左右的熊猫，人称“七笼猪”',
            golink: 'http://live.ipanda.com/xmcd/03/index.shtml'
        },
        {
            title: '幼年园 B',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel354?AUTH=jPxQposeGVgudWYFj2WdEgjuA2lUKjOpg+NL/hudbPj073/rvGSudmfQwVJQ2N8hgBI5RQo+CQcIfx+X+42r/Q==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao04',
            uname: '04 成都直播',
            link: '之前这个园区居住过人气非常高的“总裁奥莉奥和他的挖煤团伙”',
            golink: 'http://live.ipanda.com/xmcd/04/index.shtml'
        },
        {
            title: '幼儿园 A',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel359?AUTH=t/OziV81gvHB4n5mo65YhmmPTsUyReJ/hx63yYuLHg8wgaD3g/Wy1hAuus1ce8TCQrfXAabBjus2YQtoyB8NdQ==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao05',
            uname: '05 成都直播',
            link: '幼儿园共设有8路镜头，会根据室内情况切进室内画面。现居住着“奇珍”',
            golink: 'http://live.ipanda.com/xmcd/05/index.shtml'
        },
        {
            title: '幼儿园 B',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel364?AUTH=v+vJF019bgiC5MNZ84rZ9oSZYvc5UGmOG/ttvk5WCOOsIdSyb2XyykKI/zUbRF9fd8f1S+EeCK/WgNJDNu++1w==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao06',
            uname: '06 成都直播',
            link: '之前这里居住过“莉莉”妈妈一家，仨儿、和兴、星小等等。',
            golink: 'http://live.ipanda.com/xmcd/06/index.shtml'
        },
        {
            title: '母子园 A',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://ipanda.vtime.cntv.cloudcdn.net:8000/live/flv/channel54?AUTH=ii7v+evfmNmd2W8LJ1jodUDnJjpgbejPP8JwKzUODD3GwhIM92QtBn2WCsGgfr7u5fkghrM69TWbACx6yUp1dA==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao07',
            uname: '07 成都直播',
            link: '母子园共有5路镜头，会根据室内情况切进室内画面。现居住着“奇福”，是幼年园“七喜”和“七巧”的妈妈，最近由于有怀孕的迹象，常住于室内',
            golink: 'http://live.ipanda.com/xmcd/07/index.shtml'
        },
        {
            title: '母子园 B',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel374?AUTH=ZXvFxDkv6fNK4wiQVwCSQ4iXOQzoG4aJuJxx9cWYMUN45SHlX9TsDbUJAIat7/rOanfnBfD48/2Ff8/zNcR2fQ==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao08',
            uname: '08 成都直播',
            link: '在这里也有过“奥莉奥”的成长踪迹，同时也是每年新生熊猫必来晒太阳的地方！',
            golink: 'http://live.ipanda.com/xmcd/08/index.shtml'
        },
        {
            title: '1号别墅 A',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel379?AUTH=CFann33aiope0C7W1ZLleTeOYmDR+YyPPdKzQiABpaoJEmGvQ4vwZQMgNwmSKYZLWnlB5yVeFBw1AWrUZWecjA==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao09',
            uname: '09 成都直播',
            link: '一号别墅3路镜头，2路室内1路室外。室外现在居住着基地“男神”“五一”',
            golink: 'http://live.ipanda.com/xmcd/10/index.shtml'
        },
        {
            title: '1号别墅 B',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel384?AUTH=fcOdeYPkKbEj8MsCdLsmmuCfWsaw8Z472gWxqlcIS/GZs0IK0QfgtFQR2Fv7iu+hVJV1zwFnI05Mr1XHMuH2Nw==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao10',
            uname: '10 成都直播',
            link: '室内现在居住着从幼年园来度假的“珍多”和聪明的“成就”。',
            golink: 'http://live.ipanda.com/xmcd/09/index.shtml'
        },
        {
            title: '雅安基地幼儿园',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel429?AUTH=1VT7A8uS+d3gl3xR/fdJl10vS5HrktOZqNLOCwq83R6Sl52jtjxxm+315rH3YUtXdpSAEhy2ywCEK/GJcQtXyg==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao18',
            uname: '18 卧龙直播',
            link: '雅安基地幼儿园位于雅安碧峰峡基地参观区的中心地带，主要用来饲养从断奶到两岁之间的幼仔。目前有六只熊猫幼仔生活在这里，直播镜头下是格格双胞胎和郡主仔',
            golink: 'http://live.ipanda.com/xmwl/08/index.shtml'
        },
        {
            title: '大熊猫 英英',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel394?AUTH=7FuE2EkSzjF877i0PTrGFBc32IzKU1YQHbJOsaj9tDH3vgjSKtPHvsCBMr8pRqdzJG8YVSNAPKcsT5LCFSfguw==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao11',
            uname: '11 卧龙直播',
            link: '“英英”，1991年出生于野外，性格温顺，十分贪吃，当前体重达140公斤。曾育有十余仔，是一位著名的“英雄母亲”',
            golink: 'http://live.ipanda.com/xmwl/01/index.shtml'
        },
        {
            title: '姚蔓和青青',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel399?AUTH=Q4p3Z0wJEGJcGSRPOtcj7QYPWYqbOcSxfx6xh6exEZTNOYRjVKu9ODJiwiM6q3Ge4LhdUjxTL9NaCboyFAN/0Q==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao12',
            uname: '12 卧龙直播',
            link: '姚蔓2009年9月27日出生于雅安碧峰峡，性格温顺，而它半岁的宝宝姚蔓仔则是个十分调皮淘气的宝宝，经常可以在直播镜头下看到宝宝与妈妈的打闹互动',
            golink: 'http://live.ipanda.com/xmwl/02/index.shtml'
        },
        {
            title: '大熊猫 泰山',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel404?AUTH=XGed5Tg/DjM3Ckm3c+ZK4sHfUJI+MhdOH80Dkj4U10DTr1wFXuhuQsP1q2uDS6at1ot07/aifIcArqnoElW3Nw==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao13',
            uname: '13 卧龙直播',
            link: '又见泰山！泰山回到了直播镜头！',
            golink: 'http://live.ipanda.com/xmwl/03/index.shtml'
        },
        {
            title: '金宝宝和雅吉',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel409?AUTH=5YsGWnb6rhUo7qAc28IbuZ6EQiVU2+Ixwt+nZX0Wfyz70cYbu7upQIcrNM4M5WzXrXeXte0FrUdg/eOerX54QA==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao14',
            uname: '14 卧龙直播',
            link: '这里是中国保护大熊猫研究中心都江堰基地的“双楠园”，现在是“金宝宝”、“雅吉”居住在这里，“金宝宝”、“雅吉”，两只一岁半的孩子，性格活泼可爱，常常在一起打闹，“金宝宝”是女孩，“雅吉”是男孩',
            golink: 'http://live.ipanda.com/xmwl/04/index.shtml'
        },
        {
            title: '大熊猫 星安',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel414?AUTH=XOkUfdf4vBjUH5j1O9aTDl0vS5HrktOZqNLOCwq83R5y+BKAr4Rlz28xAyPlsr3CerSLam247DqkLhpnKnfcXg==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao15',
            uname: '15 卧龙直播',
            link: '“喜乐”已于10月13日前往天津。现在住进来的是“星安”小朋友。“星安”，2013年8月5日出生于雅安碧峰峡，母亲是“壮妹”，“星安”曾经与“贡贡”同住在临泽园，现在搬到双楠园，住在“华丽”对面',
            golink: 'http://live.ipanda.com/xmwl/05/index.shtml'
        },
        {
            title: '大熊猫 英英',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel419?AUTH=iz8UfErvsjOYmX/id1YwYOOEbEdpVXuzWt9etIx+X7stSDkHizBCLCHu97cQ5YfTASEioZvZpI9pa02kVKtYRw==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao16',
            uname: '16 卧龙直播',
            link: '“英英”的子女遍布海内外，如日本上野动物园的“仙女”，奥地利美泉宫的“阳阳”等等',
            golink: 'http://live.ipanda.com/xmwl/06/index.shtml'
        },
        {
            title: '核桃坪',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel434?AUTH=izFk0WLuELo3xCfR8n/5NmbSgzTNcdOwyHd2Lmpoltq/QMIt4kGL/yaXU+fAm65ovZsx9v+mdaPjkh8Of8dfTg==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao19',
            uname: '19 卧龙直播',
            link: '这里是卧龙核桃坪野化培训基地的半野化培训圈，生活在这里的大熊猫以参与野化培训项目为主。在这路直播里能看到大熊猫在竹林穿行、采食竹子、上树躲避敌害等日常行为，能看到母兽教幼仔各种生存技能，能亲历熊猫幼仔的成长过程，在这里能更多地感受到大熊猫野性、自然的一面。（该镜头来自于卧龙核桃坪野化培训基地科研用监控信号）',
            golink: 'http://live.ipanda.com/xmwl/index.shtml'
        },
        {
            title: '臭水',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel424?AUTH=Y2docCT553Tg4KBbXWfC2rnKDDWfv3Nq/qTljnMPq/tk6b3V7TjbuBYacFWH17wke/qCswCnFmER/tYpxnNn7Q==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao17',
            uname: '17 卧龙直播',
            link: '这里是位于卧龙“五一棚”附近的臭水，这里海拔2600多米，一年四季、每日晨昏都有不一样的景色。这里是野生动物聚集地，这里生活着野生大熊猫、小熊猫、金丝猴、苏门羚、猪獾、斑羚等珍稀野生动物，在这里能感受到自然之美，更有机会亲见野生大熊猫活动',
            golink: 'http://live.ipanda.com/xmwl/07/index.shtml'
        },
        {
            title: '雅安碧峰峡新豹子山',
            roomid: 'http://player.cntv.cn/standard/cntvLivePlayer20150623.swf?vodURL=http://livechina.cntv.wscdns.com:8000/live/flv/channel484?AUTH=osjaKK3hSlrxGqNqq2xsaGOftX/WAi63XUG1sFWiJK3BpsW+YyevQwDN3GKTBCvlY39AqJWNZYHY50Eizojd9g==&isRtmp=false&channelId=pa://cctv_p2p_hdxiongmao20',
            uname: '20 卧龙直播',
            link: '雅安碧峰峡新豹子山海拔约1050米，位于整个园区较深处，地处熊猫幼儿园和海归园之间，为半野外产仔圈舍。主要模拟大熊猫野外环境中产仔育幼的情况，共设有6个圈舍，现居住着“津柯”、“汪佳”、“朵朵”、“优优”、“格格”和“兰仔”6只大熊猫',
            golink: 'http://live.ipanda.com/xmwl/11/index.shtml'
        },
        {
            title: 'CCTV-1',
            roomid: 'http://player.cntv.cn/standard/cntvHdsLivePlayer20160617.swf?addrs=http://cctv1.vtime.cntv.wscdns.com/cache/cctv1hds.f4m?AUTH=cn1duKmENQvLBYs9CAqntbj5l2guLF+fQGv2F8hrU8Oc6CGH7pPHBLsS9O8JWzQNkAiNOjcQ9TOvyWmt6gUMnw==&ChannelID=cctv1&P2PChannelID=pa://cctv_p2p_hdcctv1',
            uname: '中央电视台',
            link: '综合频道',
            golink: 'http://tv.cctv.com/live/cctv1/'
        },
        {
            title: 'CCTV-5',
            roomid: 'http://player.cntv.cn/standard/cntvHdsLivePlayer20160617.swf?addrs=http://cctv5.vtime.cntv.wscdns.com/cache/cctv5hds.f4m?AUTH=a+rQ3zf7TWuy3aMG1bkf0Rx9MBPscH4/T5OqlSIwTJP8+E2VmzuFv61uqNrERsOKIH8W7Rbg5fhaqmrQTcCAcA==&ChannelID=cctv5&P2PChannelID=pa://cctv_p2p_hdcctv5',
            uname: '中央电视台',
            link: '体育频道',
            golink: 'http://tv.cctv.com/live/cctv5/'
        },
        {
            title: 'CCTV-13',
            roomid: 'http://player.cntv.cn/standard/cntvHdsLivePlayer20160617.swf?addrs=http://cctv13.vtime.cntv.wscdns.com/cache/cctv13hds.f4m?AUTH=9s5eVGqsXj65vGwAv1Y0b2OftX/WAi63XUG1sFWiJK1Gx2cQotZy95cmaDaGig7KmAe4Tg3ogDp/LUev9mHTDQ==&ChannelID=cctv13&P2PChannelID=pa://cctv_p2p_hdcctv13',
            uname: '中央电视台',
            link: '新闻频道',
            golink: 'http://tv.cctv.com/live/cctv13/'
        },
        {
            title: 'CCTV-5+',
            roomid: 'http://player.cntv.cn/standard/cntvHdsLivePlayer20160617.swf?addrs=http://cctv5plus.vtime.cntv.wscdns.com/cache/cctv5plushds.f4m?AUTH=G5XLKTuUl+1+wOk96ZLXo4yYc1fc1UoEUjFx8zlxW6BBGk0PMUHdW0yUwzfgrHIq0PIedAfdjf5euchpuEt5Hw==&preView=http://cctv5plus.vtime.cntv.wscdns.com:8000/live/pic/channel259?AUTH=G5XLKTuUl+1+wOk96ZLXo4yYc1fc1UoEUjFx8zlxW6BBGk0PMUHdW0yUwzfgrHIq0PIedAfdjf5euchpuEt5Hw==&ChannelID=cctv5plus&P2PChannelID=pa://cctv_p2p_hdcctv5plus',
            uname: '中央电视台',
            link: '体育PLUS',
            golink: 'http://tv.cctv.com/live/cctv5plus/'
        },
        {
            title: 'CCTV-奥运+',
            roomid: 'http://player.cntv.cn/standard/cntvHdsLivePlayer20160617.swf?addrs=http://studio.vtime.cntv.wscdns.com/cache/studio4hds.f4m?AUTH=2ohK2oKkzMwfr6POavxg21wYwLMwILvsJMV+xBodIdHbUQ7wzmOlyiT308zXVir/+4zoVsoNQM5I/LcKC4z1SA==&preView=http://studio.vtime.cntv.wscdns.com:8000/live/pic/channel704?AUTH=2ohK2oKkzMwfr6POavxg21wYwLMwILvsJMV+xBodIdHbUQ7wzmOlyiT308zXVir/+4zoVsoNQM5I/LcKC4z1SA==&ChannelID=studio4&P2PChannelID=pa://cctv_p2p_hdstudio4',
            uname: '中央电视台',
            link: '2016奥运频道',
            golink: 'http://2016.cctv.com/live/plus/index.shtml'
        }]
    },
    PGa: 1,
    PGb: 0,
    Pf: true,
    Pm: false,
    sNUM: 0,
    sMODE: 1,
    gg5269: 0,
    LSP: function(a, b) {
        if (a == 1) {
            if (b) {
                BiliBox.PGb = Math.abs(BiliBox.PGb - 15);
                if ((! (BiliBox.PGb) && b == 1) || (BiliBox.PGb && b == -1)) {
                    BiliBox.PGa += b;
                    BiliBox.Pf = true;
                    if (BiliBox.PGa <= 0) {
                        BiliBox.PGa = 1;
                        BiliBox.PGb = 0;
                    };
                };
            };
            if (BiliBox.Pf) {
                if (BiliBox.gg5269 == 3) {
                    var tmp_a = {
                        data: []
                    },
                    tmp_b = BiliBox.PGa * 30 - 30;
                    for (i = 0; BiliBox.bwm.data[i + tmp_b] && i <= 29; i++) {
                        tmp_a.data[i] = BiliBox.bwm.data[tmp_b + i];
                    };
                    $('#PGt').text('/' + Math.ceil(BiliBox.bwm.total / 15));
                } else {
                    var tmp_a = JSON.parse($.ajax({
                        url: 'area/liveList?area=all&order=online&page=' + BiliBox.PGa,
                        async: false
                    }).responseText);
                    $('#PGt').text('/' + Math.ceil(JSON.parse($.ajax({
                        url: 'area/home?area=all',
                        async: false
                    }).responseText).data.total / 15));
                };
                if (tmp_a.data[0]) {
                    BiliBox.rmm = tmp_a;
                } else {
                    BiliBox.PGa--;
                    BiliBox.PGb = 15;
                };
                BiliBox.Pf = false;
            };
            if (BiliBox.PGb && !(BiliBox.rmm.data[15])) {
                BiliBox.PGb = 0;
            };
            $('#PGn').text((BiliBox.PGa * 2 - 1) + BiliBox.PGb / 15);
            for (; $('#rc15').length;) {
                $('#rc15').remove();
            };
            for (i = BiliBox.PGb; BiliBox.rmm.data[i] && i <= BiliBox.PGb + 14; i++) {
                if (BiliBox.Pm) {
                    $('#If_d2').append('<div id="rc15" style="width:160px;height:100px;border-radius:5px;border-style:solid;border-width:1px;border-color:#ff9b56;padding:1px;margin:4px;float:left;line-height:20px;font-size:12px;color:#646c7a;text-align:left;cursor:pointer;background-image:url(' + BiliBox.rmm.data[i].cover + ');background-size:cover;" onmouseover="$(this).css({\'background-image\':\'url(' + BiliBox.rmm.data[i].system_cover + ')\',\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'color\':\'#ffffff\'})" onmouseout="$(this).css({\'background-image\':\'url(' + BiliBox.rmm.data[i].cover + ')\',\'border-color\':\'#ff9b56\',\'color\':\'#646c7a\'})" onmousedown="$(this).css({\'border-color\':\'#555555 #cccccc #cccccc #555555\',\'color\':\'\'})" onmouseup="$(this).css({\'border-color\':\'#cccccc #555555 #555555 #cccccc\'});BiliBox.LSP(2,' + BiliBox.rmm.data[i].roomid + ');BiliBox.LSP(3,0);" title="' + BiliBox.rmm.data[i].uname + ' - ' + BiliBox.rmm.data[i].link.replace(/\//, '') + '">' + BiliBox.rmm.data[i].title + '</div>');
                } else {
                    $('#If_d2').append('<div id="rc15" style="width:166px;height:23px;background-color:#ffffff;border-radius:5px;border-style:solid;border-width:1px;border-color:#ff9b56;padding:1px;margin:1px;float:left;line-height:23px;font-size:12px;color:#646c7a;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer" onmouseover="$(this).css({\'background-color\':\'#ff9b56\',\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'color\':\'#ffffff\'})" onmouseout="$(this).css({\'background-color\':\'#ffffff\',\'border-color\':\'#ff9b56\',\'color\':\'#646c7a\'})" onmousedown="$(this).css({\'border-color\':\'#555555 #cccccc #cccccc #555555\',\'background-color\':\'#cc7c45\'})" onmouseup="$(this).css({\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'background-color\':\'#ffbd56\'});BiliBox.LSP(2,\'' + BiliBox.rmm.data[i].roomid + '\');" title="' + BiliBox.rmm.data[i].uname + ' - ' + BiliBox.rmm.data[i].link.replace(/\//, '') + '">' + BiliBox.rmm.data[i].title + '</div>');
                };
            };
        };
        if (a == 2) {
            if (b <= 5000) {
                b = BiliBox.ROOMIDzh(b);
            };
            if (! ($('#If_p').length)) {
                $('#player_object').css({
                    'width': 0,
                    'height': 0
                });
                $('#gift-panel').before('<div id="If_d" style="width:886px;height:506px;border:1px solid #ddd;top:125px;position:absolute" lspvid="1" lspvlock="1" lspvmain="1"><div style="width:100%;height:100%"><iframe id="If_p" src="http://static.hdslb.com/live-static/swf/LivePlayerEx.swf?state=LIVE&amp;quality=4&amp;player=1&amp;cid=92613" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="no"></iframe></div><!--<div style="width:190px;height:18px;font-size:12px;top:0px;position:absolute" onmouseover="$(this).children(\'div\').css(\'display\',\'inline-block\')" onmouseleave="$(this).children(\'div\').css(\'display\',\'none\')"><div style="width:20px;height:20px;font-size:14px;text-align:center;border:1px solid #ddd;vertical-align:top;display:inline-block" onmousedown="BiliBox.DIVmove(event,1,$(this).parent().parent(),-80,-13)">1</div><div style="width: 16px; height: 16px; text-align: center; border-style: solid; border-color: rgb(221, 221, 221); margin: 1px 0px 0px 1px; display: none;" onmouseover="$(this).css({\'border-width\':\'0px 1px 1px 0px\',\'margin\':\'0px\',\'color\':\'#ddd\'})" onmouseleave="$(this).css({\'border-width\':\'0px\',\'margin\':\'1px 0px 0px 1px\',\'color\':\'\'})">主</div><div style="width:16px;height:16px;text-align:center;border:1px #ddd;border-style:solid solid solid none;display:inline-block">锁</div><div style="width:16px;height:16px;text-align:center;border:1px #ddd;border-style:solid solid solid none;display:inline-block">全</div><div style="width:16px;height:16px;text-align:center;border:1px #ddd;border-style:solid solid solid none;display:inline-block">X</div></div>--></div>');
            };
            var tmp_a;
            switch (BiliBox.sMODE) {
            case 1:
                tmp_a = 'http://static.hdslb.com/live-static/swf/LivePlayerEx.swf?state=LIVE&quality=4&player=1&cid=';
                break;
            case 2:
                tmp_a = 'http://static.hdslb.com/live-static/swf/LivePlayerEx_1.swf?state=LIVE&quality=4&player=1&cid=';
                break;
            case 3:
                tmp_a = '';
                break;
            };
            if (tmp_a + b != $('#If_p').eq(BiliBox.sNUM).attr('src')) {
                $('#If_p').eq(BiliBox.sNUM).attr('src', tmp_a + b);
            };
        };
        if (a == 3) {
            if (BiliBox.Pm || b) {
                $('#If_d2').css({
                    'height': '88px',
                    'top': '-1px',
                    'z-index': ''
                });
                $('#Pm').text('∧');
                if (b) {
                    BiliBox.Pm = true;
                };
            } else {
                $('#If_d2').css({
                    'height': '336px',
                    'top': '-249px',
                    'z-index': '10'
                });
                $('#Pm').text('∨');
            };
            BiliBox.Pm = !(BiliBox.Pm);
            BiliBox.LSP(1, 0);
        };
        if (a == 4) {
            if (b) {
                if (! ($('#If_d3').length)) {
                    $('#If_d2').append('<div id="If_d3" style="height:21px;padding:13px;background-color:#ffffff;border-radius:5px;border:1px solid #ff9b56;bottom:1px;right:1px;position:absolute;display:inline-block;"><!--<div id="sm-b" class="live-tag btn" onmouseup="$(this).children().eq(0).css(\'display\',\'none\');$(this).children().eq(1).css(\'display\',\'block\');"><span style="display:none;">视屏模式</span><span style="width:72px;line-height:19px;margin:-1px -12px;display:block;"><div style="width:20px;height:19px;background-color:#4fc1e9;padding:0px 0px 0px 5px;margin:0px -1px;display:inline-block;">A</div><div style="width:20px;height:19px;background-color:#4fc1e9;margin:0px -2px;display:inline-block;">B</div><div style="width:20px;height:19px;background-color:#4fc1e9;padding:0px 5px 0px 0px;margin:0px -1px;display:inline-block;">C</div></span></div> <div id="sn-b" class="live-tag btn" onmouseup="$(this).children().eq(0).css(\'display\',\'none\');$(this).children().eq(1).css(\'display\',\'block\');"><span style="display:none;">画中画数量设定</span><span style="width:108px;line-height:19px;margin:-1px -12px;display:block;"><div style="width:32px;height:19px;background-color:#4fc1e9;margin:0px -1px;padding:0px 0px 0px 6px;display:inline-block;">本家</div><div style="width:14px;height:19px;background-color:#4fc1e9;margin:0px -2px;display:inline-block;">1</div><div style="width:14px;height:19px;background-color:#4fc1e9;margin:0px -1px;display:inline-block;">2</div><div style="width:14px;height:19px;background-color:#4fc1e9;margin:0px -2px;display:inline-block;">3</div><div style="width:14px;height:19px;background-color:#4fc1e9;margin:0px -1px;padding:0px 10px 0px 0px;display:inline-block;">4</div></span></div> --><div id="rm-j" class="live-tag btn" onmouseup="$(this).children().eq(0).css(\'display\',\'none\');$(this).children().eq(1).css(\'display\',\'block\').focus();"><span style="display:none">手写房间号</span><input style="width:56px;height:11px;font-size:12px;text-align:center;display:block;" pattern="[0-9]" onkeyup="BiliBox.inkey(1,event,$(this))" maxlength="7"></div> <div id="pg-j" class="live-tag btn" onmouseup="$(this).children().eq(0).css(\'display\',\'none\');$(this).children().eq(1).css(\'display\',\'block\').focus();"><span style="display:none">指定跳转页</span><input style="width:42px;height:11px;font-size:12px;margin:0px 7px;text-align:center;display:block" pattern="[0-9]" onkeyup="BiliBox.inkey(2,event,$(this))" maxlength="5"></div> <div class="live-tag btn" onmouseup="$(\'.live-icon.item-package\').click()"><span>道具包裹</span></div><div style="width:83px;height:16px;background-color:#ffffff;line-height:18px;font-size:12px;color:#646c7a;text-align:center;cursor:pointer;position:absolute;bottom:-16px;right:68px;" onmouseup="BiliBox.LSP(4,0)"><span>设置</span></div></div>');
                } else {
                    $('#If_d3').css('display', 'inline-block');
                    if ($('#If_d2').css('z-index') > 0) {
                        $('#If_d3').css('z-index', ($('#If_d2').css('z-index') + 1));
                    };
                };
                $('#sm-b').children().eq(1).css('display', 'none');
                $('#sm-b').children().eq(0).css('display', 'block');
                $('#sn-b').children().eq(1).css('display', 'none');
                $('#sn-b').children().eq(0).css('display', 'block');
                $('#rm-j').children().eq(1).css('display', 'none').val('');
                $('#rm-j').children().eq(0).css('display', 'block');
                $('#pg-j').children().eq(1).css('display', 'none').val('');
                $('#pg-j').children().eq(0).css('display', 'block');
            } else {
                $('#If_d3').css('display', 'none');
                $('#If_d3').css('z-index', '');
            };
        };
    },
    mute: 1,
    Play_: function(a, b, c) {
        if (! ($('#P_aud').length)) {
            $('body').after('<div id="P_aud" style="width:1;height:1;display:block;"></div>');
        };
        var tmp_a = '',
        tmp_b = 100,
        tmp_c = '00:00';
        switch (a) {
        case 1:
            tmp_a = 'http://localhost/mymy/20101510527201.mp3';
            tmp_b = 20;
            tmp_c = '00:00.500';
            break;
        case 2:
            tmp_a = 'http://localhost/mymy/%E5%BC%B9%E7%B0%A7%E5%A3%B0.mp3';
            tmp_b = 20;
            break;
        case 3:
            tmp_a = 'http://localhost/mymy/%E9%B8%A3%E5%8F%AB%E5%A3%B0.mp3';
            tmp_b = 30;
            break;
        case 4:
            tmp_a = 'http://localhost/mymy/%E6%8A%A2%E7%AD%94%E9%93%83.mp3';
            tmp_b = 25;
            break;
        case 5:
            tmp_a = 'http://localhost/mymy/%E6%8C%89%E9%92%AE%E9%93%83.mp3';
            tmp_b = 30;
            break;
        case 6:
            tmp_a = 'http://localhost/mymy/VI%20ARPDM%20C-L.mp3';
            tmp_b = 30;
            tmp_c = '00:01.650';
            break;
        case 7:
            tmp_a = 'http://localhost/mymy/CL%20RUPI2%20A-L.mp3';
            tmp_b = 20;
            break;
        default:
            tmp_a = 'C:\windows\media\tada.wav';
            break;
        };
        if (! ($('#s_vox').hasClass('off')) && b >= BiliBox.mute) {
            $('#P_aud').html('<embed type="audio/mpeg" src="' + tmp_a + '" autostart=true loop=false hidden=ture volume="' + tmp_b + '" starttime="' + tmp_c + '" width=0 height=0></embed>');
        };
        if (c) {
            console.error(c);
        };
    },
    s_xds: true,
    s_mhch: false,
    s_jzfb: false,
    jzfb_mts: false,
    s_tbox: false,
    clear_: false,
    UI: function(a, b) {
        if (a) {
            if (a == 1) {
                if (BiliBox.s_xds) {
                    BiliBox.Play_(1, 1);
                    BiliBox.s_xds = false;
                    $('#s_xds').addClass('off');
                    $('#s_xds').attr('title', '已关闭');
                } else {
                    BiliBox.Play_(1, 1);
                    BiliBox.s_xds = true;
                    $('#s_xds').removeClass('off');
                    $('#s_xds').attr('title', '已开启');
                    BiliBox.XDSid = 0;
                    BiliBox.zjIDclass = {};
                    BiliBox.JPstart = 0;
                };
            };
            if (a == 2) {
                if (b) {
                    if (BiliBox.jzfb_mts) {
                        $('#If_mts').remove();
                        $('#chat-mts').css('display', 'none');
                        $('#jzfb_msg').prev().text('');
                        $('#jzfb_msg').prev().attr('title', '');
                        BiliBox.jzfb_mts = false;
                    } else {
                        $('#jzfb_If_anc').append('<iframe id="If_mts" src="/1126525" width="1px" height="0px" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="no"></iframe>');
                        $('#If_mts').load(function() {
                            $('#chat-mts').css('display', 'block');
                            $('#jzfb_msg').prev().text('+secret');
                            $('#jzfb_msg').prev().attr('title', '密天使已开启，上面的小框可以密聊，发送弹幕请【连续按两次回车】');
                            $(If_mts.document).find('.chat-msg').parent().remove();
                            BiliBox.jzfb_mts = true;
                        });
                    };
                    return;
                };
                if (BiliBox.s_jzfb) {
                    BiliBox.Play_(1, 1);
                    BiliBox.s_jzfb = false;
                    $('#If_mts').remove();
                    $('#chat-mts').css('display', 'none');
                    $('#jzfb_msg').prev().text('');
                    $('#jzfb_msg').prev().attr('title', '');
                    BiliBox.jzfb_mts = false;
                    $('#jzfb_msg').parent().css('display', 'none');
                    $('#s_jzfb').addClass('off');
                    $('#s_jzfb').attr('title', '缓一缓');
                } else {
                    if (! ($('#jzfb_msg').length)) {
                        $('body').append('<div id="jzfb_If_anc" style="width:9px;height:9px;top:0px;left:0px;position:absolute;display:block;z-index:-10;"></div><div style="width:66px;min-height:96px;border:2px solid #eeeeee;padding:3px;background-color:#000000;top:70px;left:700px;position:fixed;display:block;z-index:300;"><textarea id="chat-mts" style="width:68px;max-height:16px;top:-44px;left:-2px;border:2px solid #eeeeee;margin:0px;font-size:12px;color:#eeeeee;background-color:#000000;word-wrap:normal;overflow:hidden;position:absolute;display:none;" cols="30" rows="1" name="text" onkeyup="BiliBox.inkey(3,event,$(this))"></textarea><div style="width:66px;height:8px;top:-20px;left:-2px;font-size:12px;line-height:8px;border:2px solid #000000;padding:3px;background-color:#eeeeee;position:absolute;display:block;" onmousedown="BiliBox.DIVmove(event,1,$(this).parent(),62,69,\'BiliBox.UI(2,1)\')"></div><div id="jzfb_msg" style="width:100%;height:100%;font-size:14px;line-height:16px;text-align:right"></div><div id="jzfb_hist" style="min-width:16px;min-height:16px;border:2px solid #eeeeee;padding:3px;background-color:#000000;font-size:14px;line-height:16px;text-align:right;top:-2px;right:75px;position:absolute;display:block;"><span id="jzfb_hist_anc" style="display:none;"></span></div></div>');
                    };
                    BiliBox.Play_(1, 1);
                    BiliBox.s_jzfb = true;
                    $('#jzfb_msg').parent().css('display', 'block');
                    $('#s_jzfb').removeClass('off');
                    if ($('.btn.lock-chat').hasClass('active')) {
                        $('.btn.lock-chat').click();
                    };
                    $('#s_jzfb').attr('title', '正在prpr');
                };
            };
            if (a == 3) {
                if (BiliBox.s_tbox) {
                    BiliBox.Play_(1, 1);
                    BiliBox.s_tbox = false;
                    $('.treasure-box-ctnr').css('display', 'block');
                    $('#treasure-box-hide').addClass('off');
                    $('#treasure-box-hide').attr('title', '宝箱图标已显示');
                } else {
                    BiliBox.Play_(1, 1);
                    BiliBox.s_tbox = true;
                    $('.treasure-box-ctnr').css('display', 'none');
                    $('#treasure-box-hide').removeClass('off');
                    $('#treasure-box-hide').attr('title', '宝箱图标已隐藏');
                };
            };
            if (a == 4) {
                if ($('#s_vox').hasClass('off')) {
                    $('#s_vox').removeClass('off');
                    BiliBox.Play_(1, 3);
                    BiliBox.mute++;
                    if (BiliBox.mute > b) {
                        BiliBox.mute = 1;
                    };
                    $('#s_vox_v').text(BiliBox.mute);
                    $('#s_vox').attr('title', '已开启');
                } else {
                    $('#s_vox_v').text('');
                    $('#s_vox').addClass('off');
                    $('#s_vox').attr('title', '已关闭');
                };
            };
            if (a == 5) {
                if ($('.gifts-package-panel').width() > 270) {
                    $('.gifts-package-panel').css({
                        'width': '270px',
                        'left': '-120px'
                    });
                    $('#big-bag').attr('title', '普通包包');
                    $('#big-bag').addClass('off');
                } else {
                    BiliBox.Play_(1, 1);
                    $('.gifts-package-panel').css({
                        'width': '540px',
                        'left': '-390px'
                    });
                    $('#big-bag').attr('title', '月半包包');
                    $('#big-bag').removeClass('off');
                };
            };
            if (a == 6) {
                BiliBox.gg5269++;
                if ($('#If_d2').length) {
                    BiliBox.LSP(3, 1);
                    $('#If_p').remove();
                    $('#If_d').remove();
                    $('#If_d2').remove();
                    BiliBox.Pf = true;
                    $('#liverooms-plus').attr('title', '不约');
                    $('#liverooms-plus').addClass('off');
                    $('#liverooms-plus').css('background', '');
                    $('#player_object').css({
                        'width': '',
                        'height': ''
                    });
                    if (BiliBox.gg5269 > 3) {
                        BiliBox.gg5269 = 0;
                        $('#liverooms-plus').children('i').text('');
                    };
                } else {
                    $('#gift-panel').append('<div id="If_d2" style="width:860px;height:88px;padding:5px 13px;background-color:#ffffff;border-radius:5px;border:1px solid #ff9b56;top:-1px;left:-1px;position:absolute;"></div>');
                    $('#If_d2').append('<div style="width:6px;height:81px;background-color:#eeeeee;border-radius:4px;border-style:solid;border-width:1px;border-color:#cccccc #555555 #555555 #cccccc;padding:1px;margin:1px;float:left;font-size:12px;cursor:pointer;position:absolute;bottom:6px;left:2px;" onmouseover="$(this).css(\'background-color\',\'#ffffff\')" onmouseout="$(this).css({\'background-color\':\'#eeeeee\',\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'color\':\'\'})" onmousedown="$(this).css({\'border-color\':\'#555555 #cccccc #cccccc #555555\',\'background-color\':\'#555555\',\'color\':\'#ffffff\'})" onmouseup="$(this).css({\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'background-color\':\'#eeeeee\',\'color\':\'\'});BiliBox.LSP(1,-1)"><br>«</div><div style="width:6px;height:81px;background-color:#eeeeee;border-radius:4px;border-style:solid;border-width:1px;border-color:#cccccc #555555 #555555 #cccccc;padding:1px;margin:1px;float:right;font-size:12px;cursor:pointer;position:absolute;bottom:6px;right:2px;" onmouseover="$(this).css(\'background-color\',\'#ffffff\')" onmouseout="$(this).css({\'background-color\':\'#eeeeee\',\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'color\':\'\'})" onmousedown="$(this).css({\'border-color\':\'#555555 #cccccc #cccccc #555555\',\'background-color\':\'#555555\',\'color\':\'#ffffff\'})" onmouseup="$(this).css({\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'background-color\':\'#eeeeee\',\'color\':\'\'});BiliBox.LSP(1,1)"><br>»</div><div id="Pm" style="width:81px;height:10px;background-color:#eeeeee;border-radius:4px;border-style:solid;border-width:1px;border-color:#cccccc #555555 #555555 #cccccc;padding:1px;margin:1px;float:left;font-size:16px;line-height:8px;text-align:center;cursor:pointer;position:absolute;top:-11px;left:402px;" onmouseover="$(this).css(\'background-color\',\'#ffffff\')" onmouseout="$(this).css({\'background-color\':\'#eeeeee\',\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'color\':\'\'})" onmousedown="$(this).css({\'border-color\':\'#555555 #cccccc #cccccc #555555\',\'background-color\':\'#555555\',\'color\':\'#ffffff\'})" onmouseup="$(this).css({\'border-color\':\'#cccccc #555555 #555555 #cccccc\',\'background-color\':\'#eeeeee\',\'color\':\'\'});BiliBox.LSP(3,0)">∧</div><div style="width:81px;height:18px;background-color:#ffffff;border-radius:5px;border-style:solid;border-width:1px;border-color:#ff9b56;padding:1px;margin:1px;float:left;line-height:18px;font-size:12px;color:#646c7a;text-align:center;cursor:pointer;position:absolute;bottom:-18px;right:68px;" onmousedown="BiliBox.DIVmove(event,1,$(this).parent(),-816,-745,\'BiliBox.LSP(4,1)\')"><span id="PGn"></span><span id="PGt"></span></div>');
                    $('#liverooms-plus').removeClass('off');
                    if (BiliBox.gg5269 == 3 && ROOMID == 5269) {
                        $('#liverooms-plus').attr('title', '5269特供');
                        $('#liverooms-plus').css('background', '#000000');
                        $('#liverooms-plus').children('i').text('ｴ');
                        BiliBox.PGa = 1;
                        BiliBox.PGb = 0;
                        BiliBox.Pf = true;
                        BiliBox.sMODE = 3;
                        BiliBox.LSP(3, 1);
                        $('#Pm').css('display', 'none');
                    } else {
                        $('#liverooms-plus').attr('title', '飞一会儿');
                        $('#liverooms-plus').css('background', '#ff9b56');
                        BiliBox.sMODE = 1;
                        if (ROOMID != 5269) {
                            BiliBox.gg5269 = 4;
                        };
                        $('#Pm').css('display', '');
                    };
                    BiliBox.LSP(1, 0);
                };
            };
        } else {
            if ($('#bilibox-config-panel').length) {
                $('#tmp_littlepink').css('display', 'none');
                if ($('#bilibox-config-panel').css('display') == 'none') {
                    $('#bilibox-config-panel').css('display', 'block');
                    if (BiliBox.s_xds) {
                        $('#s_xds').removeClass('off');
                        $('#s_xds').attr('title', '已开启');
                    };
                    if (BiliBox.s_jzfb) {
                        $('#s_jzfb').removeClass('off');
                        $('#s_jzfb').attr('title', '正在prpr');
                    };
                    if ($('.treasure-box-ctnr').css('display') != 'block' || BiliBox.s_tbox) {
                        BiliBox.s_tbox = true;
                        $('#treasure-box-hide').removeClass('off');
                        $('#treasure-box-hide').attr('title', '宝箱图标已隐藏');
                    };
                } else {
                    $('#bilibox-config-panel').css('display', 'none');
                    $('#s_xds').addClass('off');
                    $('#s_jzfb').addClass('off');
                    $('#treasure-box-hide').addClass('off');
                };
            } else {
                $('.btn.danmu-config').after('<div class="btn config" role="button" title="插件控制" style="background-position:-120px 0px"></div>');
                $('.danmu-config-panel.ctrl-panel.dp-none').after('<div id="bilibox-config-panel" class="ctrl-panel dp-none" style="width:126px;height:104px;padding:10px 10px 10px 10px;bottom:92%;right:20px;z-index:2000;display:none;"><div class="live-right-attention-panel" id="room-my-attention"><span>小电视抽奖</span><span id="s_xds" class="attention-toggle-btn off" style="left:20px;" title="已关闭"><i class="switch-icon"></i></span><br><span>PRPR小天使</span><span id="s_jzfb" class="attention-toggle-btn off" style="left:14px;" title="未开启"><i class="switch-icon"></i></span><div id="treasure-box-config"><span>隐藏宝箱　</span><span id="treasure-box-hide" class="attention-toggle-btn off" title="B站控制" style="left:20px"><i class="switch-icon"></i></span></div><div><span>欧洲人包包</span><span id="big-bag" class="attention-toggle-btn off" title="普通包包" style="left:20px"><i class="switch-icon"></i></span></div><div><span>飞越直播院</span><span id="liverooms-plus" class="attention-toggle-btn off" title="不约" style="left:20px"><i class="switch-icon"></i></span></div><span>音效提示　<i id="s_vox_v" style="position:absolute"></i></span><span id="s_vox" class="attention-toggle-btn off" style="left:20px;" title="已关闭"><i class="switch-icon"></i></span></div></div>');
                $('.link.bili-link').eq(2).after('<span id="tmp_littlepink" class="has-new splashing" style="right:-258px;top:-98px;z-index:1;display:block;"></span>');
                $('.btn.config').mouseup(function() {
                    BiliBox.UI(0, 0);
                });
                $('#bilibox-config-panel').mouseleave(function() {
                    BiliBox.UI(0, 0);
                });
                $('#s_xds').mouseup(function() {
                    BiliBox.UI(1, 0);
                });
                $('#s_jzfb').mouseup(function() {
                    BiliBox.UI(2, 0);
                });
                $('#treasure-box-hide').mouseup(function() {
                    BiliBox.UI(3, 0);
                });
                $('#s_vox').mouseup(function() {
                    BiliBox.UI(4, 3);
                });
                $('#big-bag').mouseup(function() {
                    BiliBox.UI(5, 0);
                });
                $('#liverooms-plus').mouseup(function() {
                    BiliBox.UI(6, 0);
                });
                $('body').after('<div id="hide_over" style="width:100%;height:100%;top:0px;position:fixed;cursor:move;z-index:9999;display:none;" onmouseup="BiliBox.DIVmove(event,1,0)" onmousemove="BiliBox.DIVmove(event,0,0)"></div>');
                if ($('.box-doms').length) {
                    $('.box-doms').children('.count-down').attr('onmousedown', 'BiliBox.DIVmove(event,1,$(this).parent().parent(),-85,-150)');
                    $('.hide-box').remove();
                };
                si_int = setInterval(BiliBox.dmGongGao, 999);
                if (si_int && $('#bilibox-config-panel').length) {
                    $('.chat-msg-list').html($('.chat-msg-list').html() + '<div><div class="announcement-container system-sys"><i class="live-icon announcement"></i><div class="announcement-content"><p>;) BiliBox v1.0483 已准备就绪</p></div></div></div>');
                    $('#chat-msg-list').scrollTop($('#chat-msg-list')[0].scrollHeight - $('#chat-msg-list').height());
                };
                if ($('span[data-type="drawing"]').length) {
                    BiliBox.s_mhch = true;
                    $('.chat-msg-list').html($('.chat-msg-list').html() + '<div><div class="announcement-container illustration drawing-sys"><i class="live-icon announcement"></i><div class="announcement-content"><p>;) 确认漫画&插画房间<br>已开启相关抽奖公告的监控</p></div></div></div>');
                };
            };
        };
    }
};
BiliBox.UI(0, 0);
BiliBox.UI(1, 0);

//////////////////jzfb///////////////
var so_t,jzfb_s=false,jzfb_n=0,dmc=0;
//var Moer_=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
var moer1_A=new Moer_(function(records){if(records[0].target.textContent>0){if(jzfb_s){jzfb_A();};};});
moer1_A.observe($('.danmu-length-count').children('span[class="dp-none"]')[0],{characterData:true,subtree:true});
var moer2_B=new Moer_(function(records){if(records[0].addedNodes[0].id=='beat-storm-action'){so_t=new Date();jzfb_s=true;jzfb_n++;$('#beat-storm-action').click();};});
moer2_B.observe($('#player-container')[0],{childList:true});
var moer3_yj=new Moer_(function(records){if(records[0].addedNodes[0].className=='activity-lottery'){$('.lottery-box').click();};});
moer3_yj.observe($('#chat-list-ctnr')[0],{childList:true});
var moer4_xds=new Moer_(function(records){if(records[0].addedNodes[0].className=='room-lottery'){$('.draw-img').click();};});
moer4_xds.observe($('#chat-list-ctnr')[0],{childList:true});
var moer5_sdx=new Moer_(function(records){if(records[0].addedNodes[0].className=='lighten-start'){$('.back-img').click();};});
moer5_sdx.observe($('#chat-list-ctnr')[0],{childList:true});

function jzfb_A(){
  var tmp_a=$('#danmu-textbox').val(),tmp_b=escape(tmp_a);
  if(tmp_b.indexOf('%0A')>-1||tmp_b.indexOf('%5C')>-1||tmp_b.indexOf('/')>-1||tmp_b.substr(-3)=='%20'||tmp_b.substr(0,3)=='%20'||tmp_b.substr(-6)=='%u3000'||tmp_b.substr(0,6)=='%u3000'){
    tmp_a='[BUG]'+tmp_a;
  }else{
	setTimeout((function(){$('#danmu-send-btn').click();})(),399);
  };
  jzfb_s=false;
  var tmp_c=so_t.getHours()+':'+so_t.getMinutes()+':'+so_t.getSeconds()+','+(new Date().getTime()-so_t.getTime())+'ms,'+jzfb_n+'='+tmp_a;
  console.warn(tmp_c);
  if ($('#pass').children().length>12){
    $('#pass').html('');
  };
  $('#pass').append(tmp_c+'<br>');
  setTimeout((function(){if($('.popup-button.confirm[aria-label="点击确认"]').length){$('.popup-button.confirm[aria-label="点击确认"]').click();};})(),1000);
};
function jzfb_once(){
  if($('.danmu-length-count').children('.dp-none').text()=='[[ danmuSend.data | length ]]' || $('.danmu-length-count').children('.dp-none').text()=='0') {
    $('#chat-list-ctnr').append('<div id="pass" style="font-size:12px"></div>');
    if (!($('.btn.lock-chat').hasClass('active'))) {
      $('.btn.lock-chat').click();
    };
    if (dmc) {
      $('#chat-msg-list').remove();
    };
  } else {
    moer2_B.disconnect();
    moer1_A.disconnect();
    console.error('弹幕输入区非空，可能存在弹幕增强 - 脚本终止并去功能化');
    return;
  };
};
jzfb_once();

/////////////////////////////////
function setTimeoutfun(str,t){
	setTimeout(function(){eval(str)},t);
	//console.warn("setTimeout:"+str+"--"+t);
}

function hideDanmu(){
	//console.info("[ttt]="+$('#head-info-panel').children('.info-ctnr').children('.room-info').children('.anchor-info-row').children('.row-item').children('.info-text').text());
	//console.info("[ttt]="+$('#rank-list-ctnr').children('.rank-list-tab').text());
	var t=$('#head-info-panel').children('.info-ctnr').children('.room-info').children('.anchor-info-row').children('.row-item').children('.info-text').text();
	if (t != 0)
	{
		if (ROOMID != 5269 && ROOMID != 1126525 && ROOMID != 36721 && ROOMID != 60617) {
			if($('#chat-msg-list').length){
				$('#chat-msg-list').remove();
			}
		}
		$('.rank-list-tab').children('.tab-switcher')[0].click();
	}else {
		setTimeoutfun(function(){eval('hideDanmu()')}, 1500);
	}

}

if (ROOMID == 5269) {
	BiliBox.UI(2, 0);
	BiliBox.UI(2, 1);
	BiliBox.UI(4, 2);
	//BiliBox.UI(4, 3);
	BiliBox.Play_(5, 3);
}else{
	//BiliBox.UI(1, 0);
	$('body').append('<div id="cccover" style="width:100%;height:150px;top:0px;left:0px;min-width: 800px;position:fixed;display:block;z-index:1000;background-color:#000000;opacity:0.03"></div>');

}
if ($('#jzfb_msg').length) {
	$('#jzfb_msg').parent().css("left","");
	$('#jzfb_msg').parent().css("right","330px");
	$('#jzfb_msg').parent().css("top","220px");
}



$(window).load(function(){
	setTimeout(function(){eval('hideDanmu()')}, 1500);
	$('body').scrollTop(0);
	CKxds();
});

function CKxds(){
	//console.warn($(document).contents().find('.draw-text').parent());
	if($(document).contents().find('.draw-text').parent().css('display')=='block'){
		if($(document).contents().find('.draw-text').children('p').eq(1).css('display')=='block'){
		 }else{
		   $(document).contents().find('.draw-img').click();
		};
	}
	/*console.warn($(document).contents().find('.time-text').text());
	if($(document).contents().find('.activity-lottery-panel .room-lottery .deepspacedev-lottery .deepspacedev-ancient-lottery .order0 .wait').length){
		if($(document).contents().find('.lottery-box .no-lottery').length){
		 }else{
		   $(document).contents().find('.lottery-box').click();
		};
	}*/
	if($(document).contents().find('.time-text').text()=='等待领取剩余时间'){
		$(document).contents().find('.lottery-box').click();
	};

	if($(document).contents().find('.lighten-start').css('display')=='block'){
		$(document).contents().find('.back-img').click();
	};

	setTimeout(function(){eval('CKxds()')}, 10000);
}

$('.live-haruna-ctnr').css('display','none');
$('.super-gift-ctnr').css('display','none');	//屏蔽礼物连击，不启用请删除本行
$('#gift-msg-1000').css('display','none');$('#chat-msg-list').css('height','100%');	//屏蔽小辣条，不启用请删除本行

if (ROOMID != 5269) {return;}

var msg_mors2=new Moer_(function(){MSG_gl();});
msg_mors2.observe($('#chat-msg-list').get(0),{childList:true});
function MSG_gl(){
  var tmp_a=$('#chat-msg-list').children().eq($('#chat-msg-list').children().length-1);
  if(tmp_a.length){var tmp_c=tmp_a[0].innerText.toLowerCase();};
  if(kaogu_sw&&tmp_a.length&&tmp_c.indexOf(' : ')>0&&(tmp_c.indexOf('kg')>0||tmp_c.indexOf('考古')>0||tmp_c.indexOf('遗迹')>0||tmp_c.indexOf('kao')>0||tmp_c.indexOf('土')>0||tmp_c.indexOf('船')>0||tmp_c.indexOf('抽')>0||tmp_c.indexOf('sk')>0)){
    var tmp_b=tmp_c.split(' : ')[1].replace(/[^0-9]/g,'');
    if(tmp_b){
//		bh_tsyj(tmp_b,0,0);
	};
  };
  if(gl_clear_vipicon){tmp_a.find('.vip-icon').css('display','none');};
  if(gl_clear_xunzhang){tmp_a.find('.medal-info').parent().css('display','none');};
  if(gl_clear_touxian){tmp_a.find('.live-title-icon').css('display','none');};
  if(gl_clear_UL){tmp_a.find('.user-level-icon').css('display','none');};
  if(gl_clear_teshuicon){tmp_a.find('.square-icon').css('display','none');};
  if(gl_clear_liwu&&tmp_a.find('.gift-msg').length){
    if(gl_clear_liwu_lib){
      console.log(tmp_a.find('.gift-msg')[0].innerText);
    };
    tmp_a.remove();
  };
  if(gl_clear_vipin){
    if(tmp_a.length&&tmp_a[0].innerText.substr(-8,7)=='老爷进入直播间'){
      if(gl_clear_vipin_lib){
        console.log(tmp_a[0].innerText.split('老爷进入直播间')[0]+'老爷进入直播间');
      };
      tmp_a.remove();
    };
  };
};
bh_tsyj_room={};
function bh_tsyj(a,b,c){
  if(b&&c=='success'){
    var tmp_jg=JSON.parse(b.responseText),roomid=parseInt(a.url.split('roomid=')[1]);
    if(tmp_jg.data[0]){
      $.ajax({url:'eventRoom/join?roomid='+roomid+'&raffleId='+tmp_jg.data[0].raffleId});
      console.log('房间:'+roomid+' 参与['+tmp_jg.data[0].lotteryType+']考古('+tmp_jg.data[0].raffleId+'):'+tmp_jg.data[0].time+'秒');
		BiliBox.Play_(4, 3);
    };
  } else {
    var tmp_a=new Date().getTime();
    if (a<=5000){
      a=BiliBox.ROOMIDzh(a);
    };
    if(a&&(!bh_tsyj_room[a]||(bh_tsyj_room[a]&&tmp_a-bh_tsyj_room[a]>30000))){
      $.ajax({url:'eventRoom/check?roomid='+a,complete:function(XHR,TS){bh_tsyj(this,XHR,TS);}});
      bh_tsyj_room[a]=tmp_a;
    };
  }
};
gl_clear_liwu=0;	//屏蔽礼物，不启用请修改=1成=0
gl_clear_liwu_lib=0;	//=1时F12内保留礼物记录，不启用请修改=1成=0
gl_clear_vipicon=0;	//屏蔽VIP老爷图标，不启用请修改=1成=0
gl_clear_vipin=0;	//屏蔽老爷进直播间消息，不启用请修改=1成=0
gl_clear_vipin_lib=0;	//=1时F12内保留老爷进直播间记录，不启用请修改=1成=0
gl_clear_xunzhang=0;	//屏蔽勋章，不启用请修改=1成=0
gl_clear_touxian=0;	//屏蔽头衔，不启用请修改=1成=0
gl_clear_UL=0;		//屏蔽用户等级，不启用请修改=1成=0
gl_clear_teshuicon=0;	//特殊图标，比如房管等，默认不启用，启用请修改=0成=1
kaogu_sw=1;		//自动参与考古报号房间的抽奖，默认不参与，启用请修改=0成=1
