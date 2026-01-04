// ==UserScript==
// @name:en         HLSMS Online Cousre Hack
// @name            省横中网课破解
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description     改变网课昵称
// @description:en  make nickname changeable!
// @author       zhufucdev
// @match        http://yk.yixuewang.net//uc/courseInfo/*
// @icon         http://yk.yixuewang.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430866/%E7%9C%81%E6%A8%AA%E4%B8%AD%E7%BD%91%E8%AF%BE%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/430866/%E7%9C%81%E6%A8%AA%E4%B8%AD%E7%BD%91%E8%AF%BE%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

let interval;

function custom() {
    'use strict';
    livePlay = (kpointId,courseId) => {
        clearInterval(interval);

        if(!isLogin())
        {
            lrFun();
            return;
        }

        function commonDialog(kid, videoUrl, downloadUrl) {
            dialog("进入房间","如果未安装直播助手，请点击“下载直播助手”，下载后进行安装", kid, videoUrl, downloadUrl)
        }

        $.ajax(
            {
                type : "POST",
                dataType : "json",
                url:baselocation+"/front/ajax/livePlay",
                data:{"kpointId":kpointId},
                cache : true,
                success : function(result)
                {
                    if(result.success)
                    {
                        var heigth=$(window).height();
                        /*如果是百家云掉用客户端用window.location.href*/
                        if (result.message=="bajiayunApp")
                        {
                            if (checkIsMobile())
                            {
                                msgshow("无法调取客户端，请联系管理员","false","2000");
                                return;
                            }
                            if (navigator.userAgent.indexOf('Mac OS X') != -1)
                            {
                                commonDialog(13,result.entity, "http://www.baijiacloud.com/default/home/liveclientDownload?type=mac")
                            } else {
                                commonDialog(13,result.entity, "http://www.baijiacloud.com/default/home/liveclientDownload?type=windows")
                            }
                            /*window.location.href=result.entity;*/
                        }
                        else if(result.message=='bajiayunPlayback')
                        {
                            window.open(result.entity+"&width=100%&height="+heigth);
                        }
                        else if (result.message=="96kooClient")
                        {
                            if (navigator.userAgent.indexOf('Mac OS X') != -1)
                            {
                                commonDialog(13,result.entity, "https://c1.96koo.net/package/zhinengzhibomac6.8.0.dmg")
                            }
                            else
                            {
                                commonDialog(13,result.entity, "https://c1.96koo.net/package/zhinengzhibo6.8.0.zip")
                            }
                        }
                        else if (result.message=="gensee")
                        {
                            // 判断PC则是返回客户端模式，手机返回web端模式
                            if (result.entity.phoneFlag=="PC")
                            {
                                //genseeClientPlay(result.entity.videoUrl);
                                commonDialog(991,result.entity.videoUrl, "https://c1.96koo.net/package/zhinengzhibo6.8.0.zip")
                            }
                            else
                            {
                                window.open(result.entity.videoUrl + "&width=100%&height=" + heigth);
                            }
                        }
                        else
                        {
                            window.open(result.entity+"&width=100%&height="+heigth);
                        }
                    }
                    else
                    {
                        if(result.message.indexOf("该直播为收费直播，请购买后操作。")!=-1 && courseId!=null)
                        {
                            window.location.href = "/front/couinfo/"+courseId;
                        }
                        else
                        {
                            dialog('提示',result.message,1);
                        }
                    }
                }
            });
    }

    dialog = (dTitle,msg,index,videoUrl,downloadUrl) => {
        const isLive = downloadUrl !== undefined;

        $("#tisbutt,#dClose,#qujiao").click();
        var oBg = $('<div class="bMask"></div>').appendTo($("body")),
            dialogEle = $(
                isLive ?
                `<div class="dialogWrap">
                    <div class="dialog-ele">
                        <h4 class="d-s-head pr">
                            <a id="dClose" href="javascript:void(0)" title="关闭" class="dClose icon16 pa">&nbsp;</a>
                            <span class="d-s-head-txt">` + dTitle + `</span>
                        </h4>
                        <div class="of bg-fff">
                        <label for="nickname" class="mt20 mb20 ml20 mr20">自定义昵称</label>
                        <input type="text" id="nickname"></input>
                        <div id="dcWrap" class="mt20 mb20 ml20 mr20 "></div>
                        </div>
                    </div>
                </div>`
                : `<div class="dialogWrap">
                    <div class="dialog-ele">
                        <h4 class="d-s-head pr">
                            <a id="dClose" href="javascript:void(0)" title="关闭" class="dClose icon16 pa">&nbsp;</a>
                            <span class="d-s-head-txt">` + dTitle + `</span>
                        </h4>
                        <div class="of bg-fff">
                        <div id="dcWrap" class="mt20 mb20 ml20 mr20 "></div>
                        </div>
                    </div>
                </div>`
            ).appendTo($("body"));

        function updateDialog() {
            function close() {
                dialogEle.remove();
                oBg.remove();
            }

            function updateContent(url) {
                $.ajax({
                    url : baselocation + "/dialog/ajax/showPage",
                    data:{"dTitle":dTitle,"msg":msg,"index":index,"url": url},
                    type : 'post',
                    dataType : 'text',
                    async : false,
                    success : function(result)
                    {
                        $("#dcWrap").html(result);
                        /*7为上传头像 加载上传图片插件*/
                        if (index==7){
                            uploadImg('fileupload','uploadfile');
                        }
                        var dTop = (parseInt(document.documentElement.clientHeight, 10)/2) + (parseInt(document.documentElement.scrollTop || document.body.scrollTop, 10)),
                            dH = dialogEle.height(),
                            dW = dialogEle.width(),
                            dHead = $(".dialog-ele>h4");
                        dialogEle.css({"top" : (dTop-(dH/2)) , "margin-left" : -(dW/2)});
                        $("#tisbutt,#dClose,#qujiao").bind("click", close);
                    }
                })
            }

            if (isLive) {
                console.log('Using ' + videoUrl);
                $.ajax({
                    url: videoUrl + '&type=jsonp',
                    type: "post",
                    jsonp: "jsonpcallback",
                    dataType: "jsonp",
                    sync: false,
                    success: function (data) {
                        if (data.success) {

                            let client_link = data.protocol + '://' + data.code;
                            let client_down = data.download;

                            updateContent(client_link + '|' + client_down);

                        } else {
                            console.log(data);
                            alert('失败啦：' + data.msg);
                        }
                    },
                    error: function (e) {
                        alert(e);
                    }
                });
            } else {
                updateContent('');
            }
        }

        if (isLive) {
            let nickInput = $('#nickname');
            // Get origin name
            (function(){
                console.log(videoUrl);
                let name = videoUrl.split('&')
                .find((v) => v.includes('nickname'))
                .split('=')[1];
                nickInput.val(name);
            })();

            nickInput.focusout(() => {
                videoUrl = videoUrl.replace(/nickname=[\u4e00-\u9fa5_a-zA-Z0-9]+/g, 'nickname=' + nickInput.val());
                updateDialog();
            })
        }
        updateDialog();
    }
}

setInterval(custom, 1000);