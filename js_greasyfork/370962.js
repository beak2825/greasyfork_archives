// ==UserScript==
// @name         NicoMyTimeLineSmartView
// @namespace    http://tampermonkey.net/
// @version      0.7.6
// @description  ニコレポから不要な通知を非表示化するスクリプト
// @author       You
// @match        *://www.nicovideo.jp/my/top
// @match        *://www.nicovideo.jp/my/top/all
// @match        *://www.nicovideo.jp/my/top/myself
// @match        *://www.nicovideo.jp/my/top/user
// @match        *://www.nicovideo.jp/my/top/ch
// @match        *://www.nicovideo.jp/my/top/com
// @match        *://www.nicovideo.jp/my/top/mylist
// @grant        none
// @require      //ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370962/NicoMyTimeLineSmartView.user.js
// @updateURL https://update.greasyfork.org/scripts/370962/NicoMyTimeLineSmartView.meta.js
// ==/UserScript==

(function ($) {
    //===================================
    // タイムラインの要素監視と縮小化
    //===================================
    $(function(){
        // 監視対象を定義
        var targetTimelines =  document.getElementsByClassName('nicorepo-page')[0];
        console.log("タイムラインの親要素監視開始");
        var timelineMO = new MutationObserver(createTimeLine);

        function createTimeLine(){
            // ニコレポの縮小処理
            nicorepoViewItems(false);
            console.log("タイムラインの監視開始");

            var targetTimeline =  document.getElementsByClassName('NicorepoTimeline')[0];
            var itemMO = new MutationObserver(addTimeLineItem);

            // 【さらに読み込む】で要素が監視対象に追加された場合に実行される処理
            function addTimeLineItem(){
                nicorepoViewItems(false);
            }

            // NicorepoTimelineへの要素の追加の監視を開始
            itemMO.observe(targetTimeline, {childList:true});
        }

        // NicorepoTimelineへの要素の追加の監視を開始
        timelineMO.observe(targetTimelines, {childList:true});
    });

    function nicorepoViewItems(isChanged){
        // 表示設定を取得
        var videoPostReport = $("#videoPostReport").prop("checked");
        var illustrationPostReport = $("#illustrationPostReport").prop("checked");
        var adReport = $("#adReport").prop("checked");
        var mylistReport = $("#mylistReport").prop("checked");
        var clipReport = $("#clipReport").prop("checked");
        var mangaReport = $("#mangaReport").prop("checked");
        var liveReport = $("#liveReport").prop("checked");
        var blomagaReport = $("#blomagaReport").prop("checked");
        var rankingReport = $("#rankingReport").prop("checked");
        var playcountReport = $("#playcountReport").prop("checked");
        var channelArticleReport = $("#channelArticleReport").prop("checked");
        var channelVideoReport = $("#channelVideoReport").prop("checked");
        var channelLiveReservationReport = $("#channelLiveReservationReport").prop("checked");
        var channelLiveReport = $("#channelLiveReport").prop("checked");

        // ニコレポの要素を取得
        var timeLine = $(".NicorepoTimeline");
        var timeLineItems = $('.NicorepoTimelineItem');

        // 表示・非表示処理
        $.each(timeLineItems,function(index,val){
            // ニコレポのlog-body要素を取得
            var checkElement = $(this).find(".log-body");
            // ニコレポのlog-bodyの内容を取得
            var text = checkElement.text();

            if(text.match(/動画を投稿しました。/)){
                // 動画投稿
                viewItem(videoPostReport, $(this));

            }else if(text.match(/イラストを投稿しました。/)){
                // イラスト投稿
                viewItem(illustrationPostReport, $(this));

            }else if(text.match(/ニコニ広告しました。/)){
                // ニコニコ広告
                viewItem(adReport, $(this));

            }else if(text.match(/動画を登録しました。/)){
                // 動画のマイリスト登録
                viewItem(mylistReport, $(this));

            }else if(text.match(/イラストをクリップしました。/)){
                // イラストのクリップ登録
                viewItem(clipReport, $(this));

            }else if(text.match(/マンガをお気に入りしました。/)){
                // マンガのお気に入り追加
                viewItem(mangaReport,$(this));

            }else if(text.match(/生放送.*を開始しました。/)){
                // コミュニティ生放送の開始
                viewItem(liveReport, $(this));

            }else if(text.match(/記事を投稿しました。/)){
                // ブロマガの投稿
                viewItem(blomagaReport,$(this));

            }else if(text.match(/ランキングで/)){
                viewItem(rankingReport,$(this));

            }else if(text.match(/再生を達成しました。/)){
                viewItem(playcountReport,$(this))

            }else if(text.match(/チャンネル.*に記事が追加されました。/)){
                // チャンネル記事
                viewItem(channelArticleReport,$(this));

            }else if(text.match(/チャンネル.*動画が追加されました。/)){
                // チャンネル動画
                viewItem(channelVideoReport,$(this));

            }else if(text.match(/チャンネル.*で.*に生放送が予約されました。/)){
                // チャンネル生放送の予約
                viewItem(channelLiveReservationReport,$(this));

            }else if(text.match(/チャンネル.*で生放送が開始されました。/)){
                // チャンネル生放送の開始
                viewItem(channelLiveReport,$(this));

            }else{
                // その他（非表示）
                viewItem(false, $(this));
            }
        });
    };

    // 表示・非表示処理
    function viewItem(viewFlag,element){
        if(viewFlag){
            // 表示処理
            element.css("display","");
        }else{
            // 非表示処理
            element.css("display","none");
        }
    }

    // string型をBoolean型に変換する関数
    function strToBool(boolStr){
        if(boolStr == null || boolStr == "undefined"){
            return false;
        }
        return boolStr.toLowerCase() === "true";
    }

    // ニコレポの表示設定
    $("body").append("<div id='config'></div>");
    $("#config").append("<div id='configTitle'><label>ニコレポの表示設定</label><label id='reapplication'>🔃</label></div>");
    $("#config").append("<div><details id='userReport'><summary>ユーザ</summary><ul id='viewUserConfig'></lu></details></div>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='videoPostReport'>動画投稿</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='illustrationPostReport'>イラスト投稿</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='adReport'>広告</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='mylistReport'>マイリスト登録</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='clipReport'>イラストのクリップ</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='mangaReport'>マンガのお気に入り</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='liveReport'>生放送開始</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='blomagaReport'>ブロマガの投稿</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='rankingReport'>ランキング</label></li>");
    $("#viewUserConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='playcountReport'>再生数</label></li>");
    $("#config").append("<div><details id='channelReport'><summary>チャンネル</summary><ul id='channelConfig'></ul></details></div>");
    $("#channelConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='channelArticleReport'>チャンネル記事</label></li>");
    $("#channelConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='channelVideoReport'>チャンネル動画</label></li>");
    $("#channelConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='channelLiveReservationReport'>チャンネル生放送予約</label></li>");
    $("#channelConfig").append("<li><label><input type='checkbox' class='configCheckbox' id='channelLiveReport'>チャンネル生放送開始</label></li>");
    $("#config").css({"position":"fixed", "top":"300px", "right":"0px", "width":"150px",
                      "padding":"0.5em 1em", "margin":"2em 0", "background":"#FFF",
                      "border":"solid 3px #6091d3", "font-weight":"bold", "border-radius":"10px"});

    // ユーザ・チャンネルの折り畳みの状態適用
    var userReportState = strToBool(window.localStorage.getItem("userReportState"));
    var channelReportState = strToBool(window.localStorage.getItem("channelReportState"));
    $("#userReport").prop("open",userReportState);
    $("#channelReport").prop("open",channelReportState);

    // 保存済みの表示設定の取得
    // ユーザ
    var videoPostReport = window.localStorage.getItem("videoPostReport");
    var illustrationPostReport = window.localStorage.getItem("illustrationPostReport");
    var adReport = window.localStorage.getItem("adReport");
    var mylistReport = window.localStorage.getItem("mylistReport");
    var clipReport = window.localStorage.getItem("clipReport");
    var mangaReport = window.localStorage.getItem("mangaReport");
    var liveReport = window.localStorage.getItem("liveReport");
    var blomagaReport = window.localStorage.getItem("blomagaReport");
    var rankingReport = window.localStorage.getItem("rankingReport");
    var playcountReport = window.localStorage.getItem("playcountReport");

    // チャンネル
    var channelArticleReport = window.localStorage.getItem("channelArticleReport");
    var channelVideoReport = window.localStorage.getItem("channelVideoReport");
    var channelLiveReservationReport = window.localStorage.getItem("channelLiveReservationReport");
    var channelLiveReport = window.localStorage.getItem("channelLiveReport");

    if(videoPostReport == null || illustrationPostReport == null || adReport == null
       || mylistReport == null || clipReport == null || liveReport == null || blomagaReport == null
       || mangaReport == null || rankingReport == null || playcountReport == null
       || channelArticleReport == null || channelVideoReport == null
       || channelLiveReservationReport == null || channelLiveReport == null){

        // 保存された要素がどれか1つでもnullの場合、Trueを設定
        videoPostReport = true;
        illustrationPostReport = true;
        adReport = true;
        mylistReport = true;
        clipReport = true;
        mangaReport = true;
        liveReport = true;
        blomagaReport = true;
        rankingReport = true;
        playcountReport = true;
        channelArticleReport = true;
        channelVideoReport = true;
        channelLiveReservationReport = true;
        channelLiveReport = true;
    }else{
        // 保存された要素をBooleanに変換
        videoPostReport = strToBool(videoPostReport);
        illustrationPostReport = strToBool(illustrationPostReport);
        adReport = strToBool(adReport);
        mylistReport = strToBool(mylistReport);
        clipReport = strToBool(clipReport);
        mangaReport = strToBool(mangaReport);
        liveReport = strToBool(liveReport);
        blomagaReport = strToBool(blomagaReport);
        rankingReport = strToBool(rankingReport);
        playcountReport = strToBool(playcountReport);
        channelArticleReport = strToBool(channelArticleReport);
        channelVideoReport = strToBool(channelVideoReport);
        channelLiveReservationReport = strToBool(channelLiveReservationReport);
        channelLiveReport = strToBool(channelLiveReport);
    }

    // ニコレポの表示設定の適用
    $("#videoPostReport").prop("checked", videoPostReport);
    $("#illustrationPostReport").prop("checked", illustrationPostReport);
    $("#adReport").prop("checked", adReport);
    $("#mylistReport").prop("checked", mylistReport);
    $("#clipReport").prop("checked",clipReport);
    $("#mangaReport").prop("checked",mangaReport);
    $("#liveReport").prop("checked", liveReport);
    $("#blomagaReport").prop("checked",blomagaReport);
    $("#rankingReport").prop("checked",rankingReport);
    $("#playcountReport").prop("checked",playcountReport);
    $("#channelArticleReport").prop("checked", channelArticleReport);
    $("#channelVideoReport").prop("checked", channelVideoReport);
    $("#channelLiveReservationReport").prop("checked", channelLiveReservationReport);
    $("#channelLiveReport").prop("checked", channelLiveReport);

    // 表示設定の変更及びニコレポへの反映処理
    $("input.configCheckbox").change(function(){
        // 表示設定の内容をlocalStorageへ保存
        window.localStorage.setItem("videoPostReport", $("#videoPostReport").prop("checked"));
        window.localStorage.setItem("illustrationPostReport", $("#illustrationPostReport").prop("checked"));
        window.localStorage.setItem("adReport", $("#adReport").prop("checked"));
        window.localStorage.setItem("mylistReport", $("#mylistReport").prop("checked"));
        window.localStorage.setItem("clipReport", $("#clipReport").prop("checked"));
        window.localStorage.setItem("mangaReport", $("#mangaReport").prop("checked"));
        window.localStorage.setItem("liveReport", $("#liveReport").prop("checked"));
        window.localStorage.setItem("blomagaReport",$("#blomagaReport").prop("checked"));
        window.localStorage.setItem("rankingReport",$("#rankingReport").prop("checked"));
        window.localStorage.setItem("playcountReport",$("#playcountReport").prop("checked"));
        window.localStorage.setItem("channelArticleReport", $("#channelArticleReport").prop("checked"));
        window.localStorage.setItem("channelVideoReport", $("#channelVideoReport").prop("checked"));
        window.localStorage.setItem("channelLiveReservationReport", $("#channelLiveReservationReport").prop("checked"));
        window.localStorage.setItem("channelLiveReport", $("#channelLiveReport").prop("checked"));

        // ニコレポの表示・非表示処理
        nicorepoViewItems(true);
    });

    // 設定の再適用
    $("#reapplication").on("click",function(){
        // ニコレポの表示・非表示処理
        nicorepoViewItems(true);
    });

    // ユーザの折り畳みの情報保持
    $("#userReport").on("click",function(){
        var userReportState = $("#userReport").prop("open") == false;
        window.localStorage.setItem("userReportState",userReportState);
    });

    // チャンネルの折り畳み情報保持
    $("#channelReport").on("click",function(){
        var channelReportState = $("#channelReport").prop("open") == false;
        window.localStorage.setItem("channelReportState",channelReportState);
    });
})(jQuery);