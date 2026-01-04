// ==UserScript==
// @name         消消黑眼圈
// @namespace    http://www.c-xyyx.cn
// @version      2.3
// @description  跳过限制
// @author       长期更新
// @match        https://huke88.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368863/%E6%B6%88%E6%B6%88%E9%BB%91%E7%9C%BC%E5%9C%88.user.js
// @updateURL https://update.greasyfork.org/scripts/368863/%E6%B6%88%E6%B6%88%E9%BB%91%E7%9C%BC%E5%9C%88.meta.js
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

function videoPlay(confirm) {
    login();
    var clickTime = (new Date()).valueOf();
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
        xhrFields: {
            withCredentials: true
        },
        'success': function (response) {
            response = JSON.parse(response);
            console.log("patch ok");
            var aa = document.getElementsByClassName("app-gz")[0];
            aa.innerText = "显示M3U8链接";
            aa.onclick = function () {
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
                    'error': function () {
                            sendVideoPlayError(playerTypeForSend, (new Date()).valueOf());
                            console.log('错误，请联系管理员');
                        },
                        'play': function () {
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
                        }, 'pause': function () {
                            $('#reply-tip').removeClass('hide');
                        },
                        'lastTenSeconds': function () {
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