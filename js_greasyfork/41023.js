// ==UserScript==
// @name         虎课网突破VIP-PLUS
// @namespace    http://www.c-xyyx.cn
// @version      1.0
// @description  破解VIP限制
// @author       逍遥一仙
// @match        https://huke88.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41023/%E8%99%8E%E8%AF%BE%E7%BD%91%E7%AA%81%E7%A0%B4VIP-PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/41023/%E8%99%8E%E8%AF%BE%E7%BD%91%E7%AA%81%E7%A0%B4VIP-PLUS.meta.js
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
var jihe = "";
var zt = 0;
var lost = 0;
var dangqian = "";
var jici = 0;
var shuzu = [];
function videoPlay(confirm) {
    login();
    var clickTime = (new Date()).valueOf();
    dangqian = Param.video_id;
    var sendAlready = false;
    $.when($.ajax({
        'url': Url.videoPlay,
        data: {
            id: Param.video_id,
            exposure: Param.exposure,
            studySourceId: Param.studySourceId,
            confirm: 0,
            async: false,
            "_csrf-frontend": $('meta[name="csrf-token"]').attr("content")
        },
        method: 'post',
        async:false,
        xhrFields: {
            withCredentials: true
        },
        'success': function(response) {
            response = JSON.parse(response);
            console.log(zt);
            if (zt == 1) {
                console.log("ok 1");

                jihe = jihe + shuzu[jici] + "," + response.video_url + "&#13;&#10;";
                jici = jici + 1;

                if (jici == lost) {
                    var aa1 = document.getElementsByClassName("clect-cut fr album-win-btn")[0];
                    aa1.innerText = "解析整张专辑";
                    console.log(jihe);
                    alert("即将打开新页面，请复制并保存配置，拖入下载器以下载");
                    p = '<div> <textarea style="width: 100%;height:100%" wrap="hard" onclick="this.focus();this.select()">' + jihe + '</textarea> </div>';
                    w = window.open('about:blank');
                    w.document.write(p);
                    w.document.close();
                }
                return;
            }
            var aa = document.getElementsByClassName("app-gz")[0];
            aa.innerText = "显示M3U8链接";
            aa.onclick = function() {
                prompt("请手动复制M3U8链接", response.video_url);
            };
            if ($.inArray(response.code, [1, 2, 3, 4, 5, 6]) !== -1 || (response.code && response.confirm === 1)) {
                $('#huke88-video').unbind('click');
                $('#no-learn-reply-win-js').remove();
                $('#reply-publish-js').removeClass('hide');
                course.hasStudy = 1;
                $('#huke88-video img').remove();
                $("#huke88-video").hkPlayer({
                    'playerVideoUrl': response.video_url,
                    'error': function() {
                        sendVideoPlayError(playerTypeForSend, (new Date()).valueOf());
                        console.log('错误，请联系管理员');
                    },
                    'play': function() {
                        $('#huke88-video-play').remove();
                        $('#reply-tip').addClass('hide');
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
                    'pause': function() {
                        $('#reply-tip').removeClass('hide');
                    },
                    'lastTenSeconds': function() {
                        newToNextVideo();
                    }
                });
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
                $("div[data-video-modal-id=" + response.code + "]").removeClass('hide');
            }
        }
    }));
}
$("#huke88-video").bind('click',
function() {
    zt = 0;
    videoPlay(0);
});
$("#download-case-js").unbind('click');
$("#download-source-js").unbind('click');

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
            'success': function(response) {
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
    } catch(e) {}
}

function isIE() {
    if ( !! window.ActiveXobject || "ActiveXObject" in window) {
        return true;
    } else {
        return false;
    }
}
$("#download-source-js").on('click',
function() {
    login();
    download(1, 0);
});
$("#download-case-js").on('click',
function() {
    login();
    download(2, 0);
});
console.log("patch ok");
var aa1 = document.getElementsByClassName("clect-cut fr album-win-btn")[0];
aa1.innerText = "解析整张专辑";
$album._config.$btn.unbind();
$album._config.$btn.click(function() {
    var aa1 = document.getElementsByClassName("clect-cut fr album-win-btn")[0];
    aa1.innerText = "解析中,请勿操作";

    //
    var list_huke = document.getElementById("t2");
    if(list_huke==null){
        alert("就一个课程要啥批量=。=");
    aa1 = document.getElementsByClassName("clect-cut fr album-win-btn")[0];
aa1.innerText = "解析整张专辑";
    return;}
    var list_a_huke = list_huke.getElementsByTagName("a");
    console.log(list_a_huke);
    zt = 1;
    jici = 0;

    lost = list_a_huke[list_a_huke.length - 1].getAttribute("href");
    lost = lost.substring(lost.indexOf("course/") + 7, lost.indexOf(".html"));
    console.log(lost);
    // videoPlay(0);
    //return;
    lost = list_a_huke.length;
    var linshi = Param.video_id;
    for (var i = 0; i < list_a_huke.length; i++) {

        Param.video_id = list_a_huke[i].getAttribute("href");
        Param.video_id = Param.video_id.substring(Param.video_id.indexOf("course/") + 7, Param.video_id.indexOf(".html"));
        shuzu.push(list_a_huke[i].children[0].innerText);
        videoPlay(0);
    }
    Param.video_id = linshi;
    //zt=0;
    console.log(jihe + "aaa");
});
