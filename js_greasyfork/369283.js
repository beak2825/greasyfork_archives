// ==UserScript==
// @name         虎课网显示M3U8
// @namespace    http://www.c-xyyx.cn
// @version      1.0
// @description  显示M3U8
// @author       逍遥一仙
// @match        https://huke88.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369283/%E8%99%8E%E8%AF%BE%E7%BD%91%E6%98%BE%E7%A4%BAM3U8.user.js
// @updateURL https://update.greasyfork.org/scripts/369283/%E8%99%8E%E8%AF%BE%E7%BD%91%E6%98%BE%E7%A4%BAM3U8.meta.js
// ==/UserScript==
function toLogin() {
    $('#loginModal').removeClass('hide');
}

function login() {
    if (0 == Param.uid) {
        toLogin();
        return false;
    } else {
        return true;
    }
}
$("#huke88-video").unbind('click');
var look = document.getElementsByClassName("app-m")[0];
look.parentNode.removeChild(look);
var look1 = document.getElementsByClassName("fixed-bar")[0];
look1.parentNode.removeChild(look1);
//a2a2.parentNode.removeChild(a2a2);
var a3a3 = document.getElementsByClassName("open-vip")[0];
a3a3.parentNode.removeChild(a3a3);
function videoPlay(confirm) {
        //登陆状态
        login();
        var clickTime = (new Date()).valueOf();
        var sendAlready = false;
        //发送请求
        $.when($.ajax({
            'url': Url.videoPlay, data: {
                id: Param.video_id,
                exposure: Param.exposure,
                studySourceId: Param.studySourceId,
                confirm: confirm,
                async: false,
                "_csrf-frontend": $('meta[name="csrf-token"]').attr("content")
            }, method: 'post',
            xhrFields: {
                withCredentials: true
            },
            'success': function (response) {
                response = JSON.parse(response);
                console.log("patch ok");
                var aa = document.getElementsByClassName("app-gz")[0];
            aa.parentElement.removeAttribute('href');
            aa.parentElement.removeAttribute('target');
            var a1a1=document.getElementsByClassName("app-m")[0];
            a1a1.parentNode.removeChild(a1a1);
            aa.innerText = "显示M3U8链接";
            aa.onclick = function () {
                prompt("请手动复制M3U8链接", response.video_url);
            };
                //播放视频入口：有权限播放/确认学习
                if ($.inArray(response.code, [1, 2, 3, 4, 6]) !== -1 || (response.code && response.confirm === 1)) {
                    $('#huke88-video').unbind('click');
                    $('#no-learn-reply-win-js').remove();
                    $('#reply-publish-js').removeClass('hide');
                    course.hasStudy = 1;
                    $('#huke88-video img').remove();
                    $("#huke88-video").hkPlayer({
                        'playerVideoUrl': response.video_url,
                        // 'playerVideoUrl': 'http://og9dz2jqu.cvoda.com/Zmlyc3R2b2RiOm9jZWFucy0xLm1wNA==_q00000001.m3u8',
                        'error': function () {

                            //播放错误只有h5触发
                            sendVideoPlayError(playerTypeForSend, (new Date()).valueOf());
                            console.log('错误，请联系管理员');
                        },
                        'play': function () {
                            $('#huke88-video-play').remove();
                            //暂停弹窗
                            if(!$('#reply-tip').hasClass('hide')){
                                $('#reply-tip').addClass('hide');
                            }
                            //发送统计时间
                            if (playerTypeForSend == 'html5') {
                                var nowstate = playerCopyForSend.state();
                                if (nowstate == 1) {
                                    if (!sendAlready) {
                                        sendAlready = true;
                                        sendStatisticTime(playerTypeForSend, (new Date()).valueOf() - clickTime);
                                    }
                                }
                            } else {
                                if (!sendAlready) {
                                    sendAlready = true;
                                    sendStatisticTime(playerTypeForSend, (new Date()).valueOf() - clickTime);
                                }
                            }
                        },
                        'pause': function () {
                            //暂停弹窗（只第一次点击暂停时出现）
                            var pauseTip = $('#reply-tip');
                            if(!pauseTip.hasClass('beforePlayShow')){
                                pauseTip.removeClass('hide');
                                pauseTip.addClass('beforePlayShow');
                            }else{
                                if(!pauseTip.hasClass('hasShow')){
                                    pauseTip.removeClass('hide');
                                    pauseTip.addClass('hasShow');
                                }
                            }
                        },
                        'lastTenSeconds': function () {
                            newToNextVideo();
                        }
                    });

                    //统计播放
                    if (Param.key.length) {
                        var data = {
                            uv: Param.uv_id,
                            keyword: Param.key,
                            videoId: Param.video_id
                        };
                        $.get(Config.searchPlayUrl, data);
                    }
                } else {
                    iThink = 1;
                    if (response.class === Param.lesssonLimitClass) {
                        $(".qz-win").show();
                        return false;
                    }
                    //##invite_free_60
                    /*if( response.code==14 ){
                    	layer.confirm('<div class="img-w75"><img src="'+Param.imgWin1Url+'"></div><p class="fz16-c6">您的学习次数已经达到上限</p><p class="fz16-c6">你可以通过邀请好友注册解锁更多学习次数</p>',
                        {
                            btn: ['获取免费学习次数','赞助成为VIP'],//按钮
                            btnColor: ['2','2'] //按钮颜色 1白色 2黄色 3橙色
                        },function(){
                        	window.open(response.inviteUrl);
                        	layer.closeAll();
                        },function(){
                        	window.open(Url.payUrl);
                        	layer.closeAll();
                        }
                       );
                    } else if( response.code==15 ){
                    	layer.confirm('<div class="img-w75"><img src="'+Param.imgWin2Url+'"></div><p class="fz16-c3">确认学习吗？</p><p class="fz16-c6">您的免费学习剩余<span class="cf70">'+response.free_num+'</span>次</p><p class="fz16-c6">你可以通过邀请好友注册解锁更多学习次数</p><p class="af70-l"><a href="'+Url.payUrl+'" target="_blank">我要成为VIP</a></p>',
                        {
                            btn: ['确认学习','获取免费学习次数'],//按钮
                            btnColor: ['1','3'] //按钮颜色 1白色 2黄色 3橙色
                        },function(){
                        	sure_study();
                        	layer.closeAll();
                        },function(){
                        	window.open(response.inviteUrl);
                        	layer.closeAll();
                        }
                        );
                    }else{
                    	$("div[data-video-modal-id=" + response.code + "]").removeClass('hide');
                    }*/
                    if( response.code==5 ){
                    	var html = '<div class="img-w75"><img src="'+Param.imgWin3Url+'"></div>';
                    	html += '<p class="fz16-c3">确认学习吗？</p><p class="fz16-c6">亲爱的虎课学员，你每天可免费学习一个教程</p>';
                    	html += '<p class="fz16-c6">成为VIP可无限学习</p>';
                    	html += '<p class="af70-l"><a onclick="entrance(5);buttonClickRecord('+Param.courseLimitButtonType+');" href="'+Url.payUrl+'" target="_blank">成为'+Param.vipName+'VIP</a>';
                    	if( response.is_upgrade==1 ){
                    		html += '<a href="'+Url.upgradeUrl+'" class="upvip" target="_blank" onclick="entrance(5);buttonClickRecord(130);">升级全站通VIP</a>';
                    	}
                    	html += '</p>';
                    	layer.confirm(html,
            	         {
            	             btn: ['再看看','确认学习'],//按钮
            	             btnColor: ['1','2'] //按钮颜色 1白色 2黄色 3橙色
            	         },function(){
            	            layer.closeAll();
            	         },
            	         function(){
            	        	 sure_study();
                         	 layer.closeAll();
            	         }
            	        );
                    }else{
                    	$("div[data-video-modal-id=" + response.code + "]").removeClass('hide');
                    }
                }
            }
        })).done(function (response) {
            if (videoPlayResponse(response)) {
                videoExposureLogic(Param.video_id, Param.exposure, 'play_times');
            }

        }).then(function (response) {
            if (videoPlayResponse(response)) {
                videoClassificationStatistics(Param.video_id, 'play', 'video_id', 0);
            }
        });
    }
$("#huke88-video").bind('click', function () {
    videoPlay(0);
});
$("#download-case-js").unbind('click');
$("#download-source-js").unbind('click');
function sure_study(){
    	if (0 == Param.uid) {
            toLogin();
            return false;
        }
        $("#learn-win-js").remove();
        if (1 == iThink) {//创建视频
            videoPlay(1);
        } else if (2 == iThink) {//下载源文件
            download(1, 1);
        } else if (3 == iThink) {//下载素材
            download(2, 1);
        } else if (4 == iThink) {//查看剩余内容
            getVideoContent(1);
        }
    }
function download(type, confirm) {
    if (Param.uid) {
        $.ajax({
            'url': Url.download,
            data: {
                id: Param.video_id,
                type: type,
                studySourceId: Param.studySourceId,
                confirm: 0,
                "_csrf-frontend": $('meta[name="csrf-token"]').attr("content")
            },
            method: 'post',
            'dataType': 'JSON',
            'success': function (response) {
                if ($.inArray(response.code, [1, 2, 3, 4, 5]) !== -1 || (response.code && response.confirm === 1)) {
                    new downloadFiles(response.download_url);
                    course.hasStudy = 1;
                    $('#no-learn-reply-win-js').remove();
                    $('#reply-publish-js').removeClass('hide');
                } else {
                    iThink = type + 1;
                    $("div[data-video-modal-id=" + response.code + "]").removeClass('hide');
                }
            }
        });
    }
}

function downloadFile(url) {
    try {
        if (isIE()) {
            var a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("target", "_blank");
            document.body.appendChild(a);
            a.click();
        } else {
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
    } catch (e) {}
}

function isIE() {
    if (!!window.ActiveXobject || "ActiveXObject" in window) {
        return true;
    } else {
        return false;
    }
}
$("#download-source-js").on('click', function () {
    login();
    download(1, 0);
});
$("#download-case-js").on('click', function () {
    login();
    download(2, 0);
});