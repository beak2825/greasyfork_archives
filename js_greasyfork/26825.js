// ==UserScript==
// @name         動漫瘋
// @namespace    none
// @version      1.03
// @description  取得動漫瘋m3u8檔案,用potplayer觀看,已經接近正式版
// @author       sheepdragon
// @match        *://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        none
// @icon         https://i2.bahamut.com.tw/anime/baha_s.png
// @downloadURL https://update.greasyfork.org/scripts/26825/%E5%8B%95%E6%BC%AB%E7%98%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/26825/%E5%8B%95%E6%BC%AB%E7%98%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    var snID = animefun.videoSn;
    var deviceID = animefun.getdeviceid() , listSrc, Origin, Words = [],
        //secs倒數秒數 rsec下次時間
        Player = [],Info, ad= getAd()[0], sec= 6,secs= 0,rsec=6, max = 10 , now = 0,
        adID, resolution = ['360p', '540p', '720p', '1080p'],
        locked = true,hash,
        txtA = '如果需要線上播放建議重新整理，無的話請使用使m3u8',txtB = '這次播放不會有廣告 (◔౪◔)~',txtC = '已經取得 _(:3 」∠ )_';

    $(document).ajaxSuccess(
        function(event, xhr, settings) {
            //settings.url.search("token.php?")>1
            if (settings.url.match(/ajax\/token\.php\?adID\=\d+&sn\=\d+&device\=[0-9a-z]+&hash\=[0-9a-z]+/) !== null) {
                Info=$.parseJSON(xhr.responseText);
                //console.log(Info);
                let url = settings.url.split('?')[1];
                let get = url.split('&');
                for (let i in get) {
                    let nam = get[i].split('=')[0];
                    let val = get[i].split('=')[1];
                    let has = get[i].split('=')[1];
                    if (nam === 'adID') {
                        adID = val;
                    } else if (nam === 'device') {
                        // deviceID = val;
                    }
                    else if(has === 'hash'){
                        hash=has;
                    }
                }
                control();
            }
        });
    function remove(){
        $('.ncc a').eq(0).click(function() {
            setTimeout(function() {
                $('.vast-blocker').removeAttr('href');
                $('.vast-blocker').removeAttr('target');
                $('.vast-skip-button').attr("href", "#");
                $('.vast-skip-button').removeAttr("target");
                $('#ani_video').removeClass('vjs-ad-playing');
            }, 500);
        });
    }
    let getM3u8s = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/m3u8.php',
                data: { sn: snID, device: deviceID},
                type: "GET",
                dataType: 'json',
                success: resolve,
                error: reject
            });
        });
    };
    let unlock = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/unlock.php?',
                data: { sn: snID, ttl: 0},
                type: "GET",
                dataType: 'json',
                success: resolve,
                error: reject
            });
        });
    };
    let videoStart = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/videoStart.php?',
                data: { sn: snID},
                type: "GET",
                dataType: 'json',
                success: resolve,
                error: reject
            });
        });
    };
    let CastVishu = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/videoCastcishu.php',
                data: { sn: snID, s: adID },
                type: "GET",
                dataType: 'text',
                success: resolve,
                error: reject
            });
        });
    };
    let CastVishuAD = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/videoCastcishu.php',
                data: { sn: snID, s: ad },
                type: "GET",
                dataType: 'text',
                success: resolve,
                error: reject
            });
        });
    };
    let token = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/token.php',
                data: { sn: snID, device: deviceID ,'hash':hash,'adID':adID },
                type: "GET",
                dataType: 'text',
                success: resolve,
                error: reject
            });
        });
    };
    let checklock = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/checklock.php',
                data: { device: deviceID, sn: snID },
                type: "GET",
                dataType: 'text',
                success: resolve,
                error: reject
            });
        });
    };
    let CastVishuEnd = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: 'ajax/videoCastcishu.php',
                data: { sn: snID, s: ad, ad: 'end' },
                type: "GET",
                dataType: 'html',
                success: resolve,
                error: reject
            });
        });
    };
    let getM3u8Lists = () => {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: listSrc,
                type: "GET",
                dataType: 'text',
                success: resolve,
                error: reject
            });
        });
    };

    function control() {
        if(Info.time===1){

        }
        else{
            reGET( true );
        }
    }
    function view(){
        if( now < max ){
            var viewsec=setInterval(function(){
                sec--;
                if(sec==7 && now!==0){
                    show( '重試進度' + now + '/'+ max +'(' + (now/max)*100 +')%');
                    secs=7;
                }
                else if(now===0){
                    show(sec+'秒後取得');
                }
                else{
                    show(sec+'秒後..重試');
                }
                if(sec<=0){
                    sec=rsec;
                    clearInterval(viewsec);
                    reGET(false);
                }
           }, 1000);
        }
        else{
            show('放棄~失敗');
        }
    }
    function reGET( lock = false){
        show('解鎖中...');
            setTimeout(function() {
                CastVishuEnd().then(function(msg) {
                    show('成功CastVishuEnd');
                }).catch(function(xhr, ajaxOptions, thrownError) {
                    show('取得重新CastVishuEnd失敗');
                });
                unlock();
                videoStart();
                getM3u8s().then(function(msg) {
                    //console.log(msg.src.length);
                    if(msg.src.length>0){
                        show('取得getM3u8Lists');
                        listSrc = msg.src;
                        getM3u8Lists().then(function(msg) {
                            Origin=msg.split('\n');
                            if(Origin.length<20){
                                stringPlus();
                                show(txtA);
                            }
                        }).catch(function(xhr, ajaxOptions, thrownError) {
                            show('重新getM3u8Lists失敗');
                        });
                    }
                    else{
                        now ++;
                        show(now + '/'+ max +'(' + (now/max)*100 +')% 失敗');
                        view();
                    }
                }).catch(function(xhr, ajaxOptions, thrownError) {
                    show('取得重新getList失敗');
                });
            },secs*1000);
    }
    function show(msg = false) {
        $('#error_msg').remove();
        $('.bullet-send-tip').html(msg);
    }
    function stringPlus() {
        //console.log((Origin.length-3)/2+'種 解析度');
        for (let i in Origin) {
            if (Origin[i].includes('.m3u8')) {
                Words.push(Origin[i]);
            }
        }
      Core();
    }

    function Core() {
        //$('.m3u_bn').remove();
        //$('.sub_top').html('<div class="ani-tabs__item"><a class="ani-tabs-link" onclick="$(\'#m3u8\').slideToggle(\'slow\')" >選擇畫質</a></div>' + $('.sub_top').html());
        $('.sub_top').append('<div class="ani-tabs__item"><a onclick="$(\'.ani-tabs-link\').removeClass(\'is-active\');$(this).addClass(\'is-active\');$(\'.ani-tab-content__item\').hide();$(\'#ani-tab-content-4\').show();" class="ani-tabs-link" id="m3u8Link">選擇畫質</a></div>');
        $('.ani-tab-content').append('<div id="ani-tab-content-4" class="ani-tab-content__item"></div>');
        $('#ani-tab-content-4').append("<div class='m3u_ul ani-setting-section'>M3U8 連結</div>");
        for (let i in Words) {
            let m3u_name = Words[i].split('-video')[0];
            let m3u_url = Words[i].split('-video=')[1];
            let Link = "http:" + listSrc.split('playlist')[0] + Words[i].split('.m3u8')[0] + listSrc.split('playlist')[1];
            Player.push(Link);
            let id = 'link_' + i;
            let span= "<span class='ani-setting-label__mian'>" + (!resolution[i] ? '' : resolution[i]) + "</span>";
            let m3u_copy="<div class='m3u_copy' id='copy_"+ resolution[i] +"'>已複製</div>";
            let label="<div class=''>" + span + m3u_copy + "</div>";
            let item= "<div class='m3u_li ani-setting-item ani-flex ' title='點擊後複製' onclick=\"copy('" + Link + "');show('複製成功'); $('#copy_"+ resolution[i] +"').animate({opacity: 1},300);setTimeout(()=>{$('#copy_"+ resolution[i] +"').animate({opacity: 0},500)},5000)\">" + label + "</div>";
            $('#ani-tab-content-4').append(item);

        }
    }
    function ShowHide() {
        $('#m3u8').slideToggle("slow", function() {
            // Animation complete.
        });
    }
    $(window).load(function() {
        /* FB移除器
        $('#fb_xdm_frame_https').eq(0).remove();
        $('iframe').eq(1).remove();
        $('.fb_ltr').remove();
        $('#facebook').remove();*/
        var block = setInterval(function() {
            //document.getElementById('ani_video_html5_api').currentTime+=30;
            if ($('.vast-skip-button').length === 1) {
                $('.vast-blocker').removeAttr('href');
                $('.vast-blocker').removeAttr('target');
                $('.vast-skip-button').attr("href", "#");
                $('.vast-skip-button').removeAttr("target");
                $('#ani_video').removeClass('vjs-ad-playing');
                if ($('.vast-skip-button')[0].text === '點此跳過廣告') {
                    //window.location.reload();
                    clearInterval(block);
                }
            }
        }, 500);
    });
    $(document).ready(function(){
        getM3u8s().then(function(msg) {
            if(msg.src.length>0){
                show('取得getM3u8Lists');
                listSrc = msg.src;
                getM3u8Lists().then(function(msg) {
                    Origin=msg.split('\n');
                    if(Origin.length<20){
                        stringPlus();
                        $('.bullet-send-tip').html(Math.round(Math.random())?txtB:txtC);
                        //show('取得成功');
                        token();
                    }
                }).catch(function(xhr, ajaxOptions, thrownError) {
                    show('取得getM3u8Lists失敗');
                });
            }
            else{
                show('載入中...');
                $('.bullet-send-tip').html('請先不要開始播放...哐哐');
                CastVishuAD().then(function(msg) {
                    console.log('呼叫AD成功');
                }).catch(function(xhr, ajaxOptions, thrownError) {
                    show('呼叫AD失敗');
                });
            }
        }).catch(function(xhr, ajaxOptions, thrownError) {
            show('取得getM3u8s失敗');
        });

    });
    $('head').append(`
<script>
function copy(str){\
$('body').append('<textarea id=\"temp\">'+ str +'</textarea>');\
$('#temp').select();\
document.execCommand('Copy');\
$('#temp').remove();\}
function show(msg = false) {
$('#error_msg').remove();
//$('.sub_top').append('<span id="error_msg">' + msg + '</span>');
}
</script>`);
    $('head').append(`<style>
.m3u_ul{
background: #a3a3a3;
color: #333;
padding:.5rem 0rem .5rem 1rem;
}
.m3u_li{
font-size: 1.5rem;
line-height: 2rem;
position: relative;
}
.m3u_li:nth-child(even){
color:#333;
background: #ffffff;
}
.m3u_li:nth-child(odd){
background: #00b4d8;
color:#FFF;
}
.m3u_li:hover{
background: #666666;
color: #FFF;
}
.m3u_copy{
display: block;
content: "已複製";
position: absolute;
font-size: 0.85em;
background-color: #a3a3a3;
line-height: 1em;
color: #FFF;
padding: .5rem;
border-radius: 2px;
pointer-events: none;
top: .5rem;
opacity: 0;
}
#ani-tab-content-3{ /*原本m3u8 */
display:none;
}
.m3u_bn{
height: 30px;
argin: 5px;
border: 1px solid #888;
border-radius: 5px;
background: #fff;
cursor: pointer;
outline: none;
background: none;
font-size: 1.3rem;
line-height: 27px;
padding: 0 10px;
}
</style>`);
})();