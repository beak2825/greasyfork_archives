// ==UserScript==
// @name         公視公播網跳過檢查
// @version      庫
// @description  try to take over the world!
// @author       pica
// @match        http://ptsvod.sunnystudy.com.tw/contentPage.aspx*
// @namespace https://greasyfork.org/users/168155
// @downloadURL https://update.greasyfork.org/scripts/37809/%E5%85%AC%E8%A6%96%E5%85%AC%E6%92%AD%E7%B6%B2%E8%B7%B3%E9%81%8E%E6%AA%A2%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/37809/%E5%85%AC%E8%A6%96%E5%85%AC%E6%92%AD%E7%B6%B2%E8%B7%B3%E9%81%8E%E6%AA%A2%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var readedpage = 1;//當前頁數

    $(function () {

        //下卷看更多
        var $container = $('.masonry');


        $container.infinitescroll({
            navSelector: '.pagination',    // selector for the paged navigation
            nextSelector: '.pagination a',  // selector for the NEXT link (to page 2)
            itemSelector: '.listCol',     // selector for all items you'll retrieve
            loading: {
                msgText: "讀取中，請稍後.....",
                finishedMsg: '列表已無內容',
                img: 'http://i.imgur.com/6RMhx.gif'
            }
        },function (newElements) {
            // hide new items while they are loading
            var $newElems = $(newElements).css({ opacity: 0 });
            // ensure that images load before adding to masonry layout
            $newElems.imagesLoaded(function () {
                // show elems now they're ready
                $newElems.animate({ opacity: 1 });
                $container.masonry('appended', $newElems, true);
                readedpage++;//当前页滚动完后，定位到下一页
                if (readedpage >= totalpage) {//如果滚动到超过最后一页，置成不要再滚动。
                    $(".pagination").remove();
                    $container.infinitescroll({ state: { isDone: true } });
                } else {
                    //'#page-nav a置成下一页的值
                    $(".pagination a").attr("href", "videoPage-n.aspx?pageIndex=" + readedpage + "&vgid=" + VideoGroupId);
                }
            });
            //設定影片是否已經播放
            SetVideoPlayState();
        });

        if (CurrVideoId == '0') {
            //進入頁面後播放第一集
            CurrVideoId = $(".masonry .listCol").eq(0).attr("vid");
            VideoPlay($(".masonry .listCol").eq(0), false);
        }
        else { //搜索结果点进来，播放指定的影片
            VideoPlay($("#listCol" + CurrVideoId), false);
        }

        //setCookie("pts_video_play_list",'',-1);
    });

    var VideoId = 0; //當前播放影片的ID
    var isPause = false;
    function VideoPlay(CurrObj, autostart) {
        //ajax方式時使用
        //if ($(CurrObj).find("input[type=hidden][name=hidVideoId]").length == 0) return;
        //VideoId = $(CurrObj).find("input[type=hidden][name=hidVideoId]:eq(0)").val();

        VideoId = CurrVideoId;
        var obj = {};
        obj["JJMethod"] = "GetVideoDetail";
        obj["VideoId"] = VideoId;
        AjaxFun.SelectGateway("ashx/video.ashx", obj, function (RsData) {
            var data = RsData;
            if (data.length > 0) {
                $("#divVideoName").text(data[0]["Name"]);
                $("#divIntro").html(data[0]["Intro"]);

                var file_source = "[";
                var SdLink='';
                var HdLink='';
                if (data[0]["Files_SD"] != null && $.trim(data[0]["Files_SD"]) != ''){
                    file_source += "{file: \"" + VideoPath + data[0]["Files_SD"] + "\",label:\"SD\"},";
                    var SdLink='<a href="http://ptsvod.sunnystudy.com.tw/videoFiles/'+data[0]["Files_SD"]+'" download="'+data[0]["Name"]+'"> [SD] </a>';
                    console.log('SD http://ptsvod.sunnystudy.com.tw/videoFiles/'+data[0]["Files_SD"]);
                }
                if (data[0]["Files_HD"] != null && $.trim(data[0]["Files_HD"]) != ''){
                    file_source += "{file: \"" + VideoPath + data[0]["Files_HD"] + "\",label:\"HD\",\"default\": \"true\"},";
                    var HdLink='<a href="http://ptsvod.sunnystudy.com.tw/videoFiles/'+data[0]["Files_HD"]+'" download="'+data[0]["Name"]+'"> [HD] </a>';
                    console.log('HD http://ptsvod.sunnystudy.com.tw/videoFiles/'+data[0]["Files_HD"]);
                }
                file_source = file_source.substring(0, file_source.length - 1); //去掉最後的逗號
                file_source += "]";
                if (data[0]["Name"] != ""){
                    $("#divVideoTime").html('約 ' + data[0]["VideoTime"] + '分鐘    下載： '+HdLink+SdLink);
                    $("#divVideoTime a").css("color","rgb(255, 209, 209)");
                }
                isPause = false;
                //新 jwplayer直接播放
                jwplayer("player01").setup({
                    width: "100%",
                    height: "100%",
                    type: "mp4",
                    //file: VideoPath + data[0]["Files_SD"],
                    //清晰度設定參考地址：https://support.jwplayer.com/customer/portal/articles/1428524-hd-quality-toggling
                    sources: eval(file_source),
                    image: (data[0]["IntroImg"]!=null ? (VideoImgPath + data[0]["IntroImg"]) : (VideoGroupImgPath + data[0]["VideoGroupImg"])),
                    aspectratio: "3:2",//影片比例
                    autostart: autostart, //自動播放
                    repeat: false, //重複播放
                    events: {
                        onPlay: function () {
                            isPause = false;
                        },
                        onPause: function () {
                            isPause = false;
                        }
                    }
                });
            }
        });
    }
})();