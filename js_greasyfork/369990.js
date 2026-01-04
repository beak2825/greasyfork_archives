// ==UserScript==
// @name         動畫瘋·Plus
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=xu3u04u48
// @version      2.2.4
// @description  分級標識自動同意、自動切換至下一集、自動點此跳過廣告、影片空降座標、網頁全螢幕、子母畫面
// @author       xu3u04u48
// @match        *://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://i2.bahamut.com.tw/anime/baha_s.png
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/369990/%E5%8B%95%E7%95%AB%E7%98%8B%C2%B7Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/369990/%E5%8B%95%E7%95%AB%E7%98%8B%C2%B7Plus.meta.js
// ==/UserScript==
var update_info = {
    version : GM_info.script.version,
    content(){ return `
    ${this.version} 更新
    <ol style="list-style: auto;margin: 0px 0px 0px 20px;">
      <li>其它小修改。</li>
   </ol>
   `}
},
funvalue = {
    ncc_warning : false,
    video_next : true,
    ad_skip : true,
},
Anivalue = {
    pass: false,
    regex: /sn=(\d*)/m,
    str:location.search,
    videoSn(){
        return this.regex.exec(this.str)[1];
    }
},
Aniplus = {
    ui(){
        var aniplusui_html = '<div class="ani-tabs__item">';
        aniplusui_html += '<div id="setting-aniplus" class="plus_ani-tabs-link" style="cursor: pointer;">動畫瘋·Plus</div>';
        aniplusui_html += '</div>';
        $('.sub_top').append(aniplusui_html);
        $('.ani-tab-content').append('<div id="ani-tab-content" class="ani-tab-content__item" style="display: none;"></div>');

        $("#setting-aniplus").click(function(e){
            $(".ani-tab-content__item").css("display","none");
            $("#ani-tab-content").css("display","block");
            $('.ani-tabs-link').removeClass('is-active');
            $(this).addClass("is-active");
        })

        $(".ani-tabs-link").click(function(e){
            $("#ani-tab-content").css("display","none");
            $('#setting-aniplus').removeClass('is-active');
        })

        aniplus_ui_css();
        $("#ani-tab-content").append(aniplus_ui_html());
        load.set();
        this.ncc_warning()

		var Firefox = '<span class="plus_explain"><span>因Firefox瀏覽器的政策【禁止自動播放聲音】，如果啟動此選項後無法正常播放影片<br>';
		Firefox +='請在瀏覽器權限【防止網站自動播放聲音】將【ani.gamer.com.tw】加入例外網站</span></span>';
		if(Tool.browser.BrowserCheck("Firefox")[0] != null )$("#firefox_w").after(Firefox);

    },
    initial(){
        let self = this;
        Tool.globalHotkeys();
        setTimeout(function () {
            self.ad_skip();
            window.initial = window.setInterval(function () {
                if (Player.video_html()[0] == null) return;
                if ($(".R18").length == 0 && $(".vast-skip-button").length == 0 && Player.src().indexOf("fbcdn.net") == -1 && Player.readyState() != 0) {
                    Anivalue.pass = true;
                    self.danmuGet.load();
                    self.video_next.videoisended();
                    $("#plus-video-skip-minute").attr("disabled",false);
                    $("#plus-video-skip-second").attr("disabled",false);
                    $("#plus-video-skip-sendout").attr("disabled",false);
                    clearInterval(window.initial);

                }
            }, 1e3);
        }, 1e3);
    },
    ncc_warning(){
        clearInterval(window.ncc);
        if(load.storage.ncc_warning && $(".R18").length >= 0 && $(".agree").length == 0){
            window.ncc = setInterval(function () {
                if ($("#adult").length > 0){
                    setTimeout(function () {$("#adult").click();},5e2);
                    clearInterval(window.ncc);
                }
            }, 1e3);
        }
    },
    ad_skip(){
        clearInterval(window.ad_skip_checker);
        if(load.storage.ad_skip){
            window.ad_skip_checker = setInterval(function(){
                var aniad = ($(".vast-skip-button").length == 1)?$(".vast-skip-button-text")[0].innerText:null
                if($("video").length && $(".R18").length == 0 && aniad == null) {
                    clearInterval(window.ad_skip_checker);
                }else if($("video").length && aniad == "點此跳過廣告"){
                    $("#adSkipButton , .vast-skip-button").click();
                    clearInterval(window.ad_skip_checker);
                }
            },1000);
        }
    },
    video_next:{
        repeate:true,
        countdown:5,
        main(){
            let self = this;
            window.videoend = window.setInterval(function () {
                var nextplayer = $('.playing').next().html();
                var match = (nextplayer != null) ? nextplayer.match('<a href="(.*)">')[1] : null;
                if (Player.ended() && match != null) {
                    $("#ani_video-next").css("display", '');
                    $("#video_next_countdown").text(self.countdown.toString().padStart(2, "0") + " 秒後切換至下一集");
                    if (self.countdown == 1){
                        document.location.href = "https://ani.gamer.com.tw/animeVideo.php" + match
                    }else if (self.countdown < 1){
                        self.countdown = 1;
                        $("#ani_video-next").css("display", 'none');
                    }
                    self.countdown -= 1;
                } else {
                    self.repeate = true;
                    $("#ani_video-next").css("display", 'none');
                    clearInterval(window.videoend);
                }
            }, 1e3)

       },
       videoisended(){
           let self = this;
           $("#ani_video-next").html('<p class="vast-skip-button-text" id="video_next_countdown" style="float: left;"></p><p id="stop_video-next" style="cursor:pointer;float: left;padding: 0 0 0 10px;">X</p>');
           clearInterval(window.videoend);
            if(load.storage.video_next){
                Player.video_html().on( 'ended', function() {
                    self.countdown = 5;
                    let nextplayer = $('.playing').next().html();
                    let match = (nextplayer != null) ? nextplayer.match('<a href="(.*)">')[1] : null;
                    if(match != null && self.repeate){
                        self.main();
                        self.repeate = false;
                    }
                });
            }else{
                $("#ani_video-next").css("display", 'none');
            }

            $("#stop_video-next").click(function () {
                self.repeate = true;
                $("#ani_video-next").css("display", 'none');
                clearInterval(window.videoend);
            });

        }
    },
    danmuGet:{
        danmudata:null,
        main(){
            let self = this;
            var ngkeyword = Object.values($(".ani-keyword-body").children(".ani-keyword-label").children("span")).map(item => item.innerText)
            if($.inArray(":",ngkeyword) != -1 || $.inArray("：",ngkeyword) != -1){
                $(".plus_time_body").html('<ul class="plus_no_sub"><img src="https://i2.bahamut.com.tw/anime/no_sub.png"style="width: 33%;"><br>是什麼遮蔽了我的雙眼？<br>找不到足跡?看看彈幕設定是否過濾【：】</ul>');
                return;
            }

            self.datalink().then(function(response) {
                self.danmudata = response;
                self.dataload(response,function(e){
                    $(".plus_time_body").html('<ul class="plus_no_sub" style="display: inline;"></ul>');
                    if (e.length) {
                        for (var arrayid in e) {
                            let airborne = (e[arrayid].airborne) ? "" : "background:#bbbbbb;"
                            $(".plus_no_sub").append('<li id="skip_' + arrayid + '" class="plus_k-label" style="cursor:pointer;' + airborne + '">' + e[arrayid].time + '</li>');
                            VideoTime.skip(arrayid, e[arrayid]);
                        }
                    } else {
                        $(".plus_time_body").html('<ul class="plus_no_sub"><img src="https://i2.bahamut.com.tw/anime/no_sub.png"style="width: 33%;"><br>目前沒有人嘗試空降<br>發個彈幕報告空降座標吧！</ul>')
                    }
                })
            })

        },
        datalink(){
            return new Promise((resolve, reject) => {
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "ajax/danmuGet.php",
                    "method": "POST",
                    "data": {"sn": Anivalue.videoSn()}
                }

                $.ajax(settings).done(function (response) {
                    resolve(response);
                })
            });
        },
        dataload(data,callback){
            var array = [];
            for (var key in data) {
                let asc = Tool.tobig5(data[key].text);
                let match = asc.match(/[0-9]{1,3}:[0-9]{1,3}/g);
                if (asc.indexOf("空降") != "-1" || asc.indexOf("座標") != "-1") {
                    VideoTime.parse(asc, array, true);
                } else if (match) {
                    VideoTime.parse(asc, array, false);
                }
            }
            var json = Tool.jsonsort(Tool.filter_r(array, 'time'), 'time');
            callback(json);
        },
        load() {
            let self = this;
            setTimeout(function () {
                self.main();
                $(".plus_refresh,#bahablack,.bluebtn,.ani-keyword-close").click(function () {
                    setTimeout(function () { self.main() }, 1e3)
                });
            }, 1e3)
        }
    },
    fullscreen:{
        click_check:false,
        check(){
            let isFullScreen = document.fullscreenElement;
            Aniplus.fullscreen.hideshow(isFullScreen);
        },
        hideshow(isFullScreen){
            setTimeout(function () {
                if (isFullScreen) {
                    $(".plus_Web_fullscreen_icon").css("display", "none");
                    $(".plus_picture_in_picture_icon").css("display", "none");
                } else {
                    $(".plus_Web_fullscreen_icon").css("display", "");
                    $(".plus_picture_in_picture_icon").css("display", "");
                    $(".vjs-fullscreen-control").css("display", "");
                }

            },5e2);
        },
        web:{
            main(){
                let self = this;
                var web_fullscreen = '<button id="web_fullscreen" class="plus_Web_fullscreen_icon plus_Web_fullscreen_on vjs-control vjs-show-tip" type="button" aria-disabled="false" title="網頁全螢幕"></button>';
                window.web_fullscreen = setInterval(function () {
                    if($(".control-bar-rightbtn").length == 1 && $("#web_fullscreen").length == 0){
                        $(".vjs-fullscreen-control").after(web_fullscreen);
                    }else if($("#web_fullscreen").length == 1){
                        clearInterval(window.web_fullscreen);
                        $("#web_fullscreen").click(function () {
                            self.add();
                        })
                    }
                }, 5e2);
            },
            add(){
                if ($("#Web_fullscreen_style").length == 0) {

                    $("#web_fullscreen").addClass("plus_Web_fullscreen_off");
                    $("#web_fullscreen").removeClass("plus_Web_fullscreen_on");

                    $("head").after('<style id="Web_fullscreen_style"></style>');
                    $('#Web_fullscreen_style').html(`
                        #animeTip {bottom: -40px !important;}
                        html {overflow-y:hidden !important; overflow-x:hidden !important;}
                        .vjs-indent-button {display: none !important;}
                        .container-player {max-width: unset !important;}
                        .player {height: 100% !important;width: 100% !important;padding-top: 0 !important;margin-top: 0 !important;z-index: 999 !important;position: fixed !important;}
                        .videoframe {height: 100% !important;width: 100% !important;margin: auto !important;max-height: unset !important;}
                        .video {width: 100% !important;height: 100% !important;position: unset !important;padding-bottom: unset !important;}
                        .BH_background {margin-top: unset !important;}
                        @media (min-width: 1000px)
                        .BH_background {margin-top: unset !important;}
                        .top_sky{display: none !important;}
                        .mainmenu {display: none !important;}
                        .subtitle {display: none !important;}
                        section:not(.player) {position: unset !important; display: none !important;}
                    `);
                } else {
                    $("#Web_fullscreen_style").remove();
                    $("#web_fullscreen").addClass("plus_Web_fullscreen_on");
                    $("#web_fullscreen").removeClass("plus_Web_fullscreen_off");
                }

            },
            hotkey(v){
                let self = this;
                if(v == 87 || (v == 27 && $("#Web_fullscreen_style").length == 1)){
                   Aniplus.fullscreen.web.add();
                }
            }
        }
    },
    picture_in_picture:{
        main(){
            let self = this;
            let picture = '<button id="plus_picture_in_picture" class="plus_picture_in_picture_icon plus_pip_on vjs-control vjs-button vjs-show-tip" type="button" aria-disabled="false" title="子母畫面"';
            picture += '"><span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text" aria-live="polite"></span></button>';
            window.picture = setInterval(function () {
                if($(".control-bar-rightbtn").length == 1 && $("#plus_picture_in_picture").length == 0){
                    $("#web_fullscreen").after(picture);
                }else if($("#plus_picture_in_picture").length == 1){
                    clearInterval(window.picture);
                    self.add();
                }
            },5e2);
        },
        add(){
            var video = Player.video_html()[0];
            $("#plus_picture_in_picture").click(function(){
                if(Tool.browser.Search("Chrome") != null && Tool.browser.Var()[0] > 70){
                    if ( video !== document.pictureInPictureElement){
                        video.requestPictureInPicture();
                    }else{
                        document.exitPictureInPicture();
                    }
                }else{
                    $(".video-js").append('<div id="nopicture" class="vjs-switchRes-button">子母畫面目前不支援Firefox及少數瀏覽器</div>');
                    setTimeout(function () { $("#nopicture").remove() }, 3000);
                }
            });

            video.addEventListener('enterpictureinpicture', () => {
                $("#ani_video_html5_api").attr("poster",Aniplus.picture_screenshot("image/jpeg,0.1"));
                $("#plus_picture_in_picture").addClass("plus_pip_off");
                $("#plus_picture_in_picture").removeClass("plus_pip_on");
            });
            video.addEventListener('leavepictureinpicture', () => {
                $("#ani_video_html5_api").attr("poster","");
                $("#plus_picture_in_picture").addClass("plus_pip_on");
                $("#plus_picture_in_picture").removeClass("plus_pip_off");
            });
        }
    },
    picture_screenshot(imagetype,callback){
        let video_canvas = document.createElement("canvas");
        const isFullScreen = document.fullscreenElement;
        video_canvas.width = (isFullScreen)?1920:$("video").width();
        video_canvas.height = (isFullScreen)?1080:$("video").height();
        let ctx = video_canvas.getContext("2d");
        ctx.drawImage(Player.video_html()[0], 0, 0, video_canvas.width, video_canvas.height);

        if(typeof callback === "function"){
            callback(video_canvas);
        }else{
            let dataUrl = video_canvas.toDataURL(imagetype);
            return dataUrl;
        }
    },
    video_danmu_copy:{
        video_danmu_box : null,
        main(){
            let self = this;
            var html =
            `
            <div id="video_danmu_box" class="plus_hide" style="position: absolute; width: 100%; height: 100%; top: 0; z-index: 2;">
                <div id="video_danmu" style="top:0px; left:0px;" class="v_danmu_box" data-block="" data-listid="">
                    <div class="v_danmu_box_b" >
                        <input type="text" id="pluskeyword" class="v_danmu_text" disabled ></input>
                        <div id="copy" class="v_danmu_menu">複製</div>
                        <div id="filter" class="v_danmu_menu plus_hide">過濾</div>
                        <div id="edit" class="v_danmu_menu">編輯</div>
                        <div id="ben" class="v_danmu_menu">消音</div>
                        <div id="accuse" class="v_danmu_menu" style="background-color: #960505b5;">檢舉</div>
                    </div>
                </div>
            </div>`;
            window.danmu_copy = setInterval(function () {
                if($("#video_danmu_box").length == 0){
                   $(".vjs-danmu").before(html);
                }else if($("#video_danmu_box").length == 1){
                    clearInterval(window.danmu_copy);
                    self.mouse();
                    self.edit();
                    self.copy();
                    self.ben();
                    self.accuse();
                    self.danmu_select_cancel();
                    self.filter_cancel()
                    self.stopPropagatio()
                }
            }, 5e2);
        },
        stopPropagatio(){
            $('.v_danmu_text').keydown(function (e) {
                e.stopPropagation();
            });
        },
        danmu_select_cancel(){
            let self = this;
            $("#video_danmu_box").click(function(e){
                if(e.target == this){
                    self.cancel();
                    $(this).addClass("plus_hide");
                }
            });
        },
        filter_cancel(){
            let self = this;
            $("#filter").click(function(e){
                $("#newkeyword").val($("#pluskeyword").val())
                $("#video_danmu_box").addClass("plus_hide");
                animefun.addkeyword();
                self.cancel()
            });
        },
        cancel(){
            $("#edit").text("編輯");
            $('.v_danmu_text').attr('disabled', true);
            $('.v_danmu_text').css('background-color',"rgba(255, 255, 255, 0)");
            $("#copy,#accuse,#ben").removeClass("plus_hide");
            $("#filter").addClass("plus_hide");
        },
        mouse(){
            $("video-js,#video_danmu_box").on("mousedown", function(e) {
                if(e.button === 2 && !$(".v_danmu_box").is(e.path)){
                    e.preventDefault();
                    var cmt = $(".danmu");
                    var danmu_X,danmu_Y,danmu_T_P,web_pageX,web_pageY;

                    for(const [i, danmu] of Array.from(cmt).entries()){

                        var find_c = $.inArray('useless', danmu.classList);

                        if ($.inArray('danmu-mode-rolling', danmu.classList) == -1) {
                            danmu_T_P = (Player.video_html().width() - Number(danmu.offsetWidth)) / 2;
                        }else if ($.inArray('danmu-mode-rolling', danmu.classList) != -1){
                            var style = window.getComputedStyle(danmu);
                            var matrix = new WebKitCSSMatrix(style.webkitTransform);
                            danmu_T_P = matrix.m41;
                        }

                        web_pageX = e.pageX - parseInt($("video-js").offset().left)
                        web_pageY = e.pageY - parseInt($("video-js").offset().top)
                        danmu_X = (web_pageX >= danmu_T_P && web_pageX <= danmu_T_P + danmu.offsetWidth);
                        danmu_Y = (web_pageY >= danmu.offsetTop && web_pageY <= danmu.offsetTop + danmu.offsetHeight)


                        if(danmu_X && danmu_Y && find_c == -1 && e.button===2){
                            $("#video_danmu").attr("data-listid",i);
                            $("#video_danmu").attr("data-block",/\d+$/gm.exec(cmt[i].id)[0]);
                            $("#video_danmu_box").removeClass("plus_hide");
                            $("#video_danmu").css('top',function(){
                                return web_pageY > (Player.video_html().height() - 100) ? `${(Player.video_html().height() - ( 100 + 15))}px` : `${web_pageY}px`;
                            })
                            $("#video_danmu").css('left',function(){
                                return web_pageX > Player.video_html().width() - $("#video_danmu")[0].offsetWidth + 5 ? `${Player.video_html().width() - ($("#video_danmu")[0].offsetWidth + 5)}px` : `${web_pageX + 5}px`;
                            })
                            $(".v_danmu_text").val(cmt[i].innerText);
                        }


                        if($(".danmu").length >= 1  && cmt[i].classList[1] != "danmu-mode-rolling"){
                            cmt[i].style.width = "";
                            cmt[i].style.left = "";
                        }
                    }
                }
            });
        },
        edit(){
            let self = this;
            $("#edit").click(function(){
                if($(this).text() == "取消"){
                    self.cancel();
                }else{
                    $("#edit").text("取消");
                    $('.v_danmu_text').attr('disabled', function(index, attr){
                        return attr == "disabled" ? false : true;
                    });
                    $('.v_danmu_text').css('background-color', function(index, css){
                        return css == "rgba(255, 255, 255, 0)" ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0)";
                    });
                    $('.v_danmu_text').focus();
                    $("#copy,#accuse,#ben").addClass("plus_hide");
                    $("#filter").removeClass("plus_hide");
                }
            })
        },
        copy(){
            let self = this;
            $("#copy").click(function(){
                $('#danmutxt').val($(".v_danmu_text").val());
                $("#video_danmu_box").addClass("plus_hide");
                $('#danmutxt').focus();
            })
        },
        accuse(){
            let self = this;
            $("#accuse").click(function(){
                var sn = $(this).parent().parent().attr("data-block");
                var i = $(this).parent().parent().attr("data-listid");
                $("#video_danmu_box").addClass("plus_hide");
                self.accuselink(sn,i);
            })
        },
        ben(){
            let self = this;
            $("#ben").click(function(){
                var data = Aniplus.danmuGet.danmudata;
                var sn = $(this).parent().parent().attr("data-block");
                for (var key in data) {
                    if(data[key].sn == sn){
                        $("#video_danmu_box").addClass("plus_hide");
                        self.benlink(data[key].userid,Anivalue.videoSn())
                    }
                }
            })
        },
        benlink(uid,videoSn){
            Tool.getCSRFToken().done(function(token) {
                $.ajax({
                    url: '/ajax/blackUser.php',
                    data: {'fid':uid,'cno':0,'token':token,'vidoeSn':videoSn},
                    method: 'POST',
                    dataType: 'json'
                }).done(function(rdata) {

                    if (rdata.error != null ) {
                        $(".video-js").append(`<div id="nopicture" class="vjs-switchRes-button">消音失敗，請稍後再試</div>`);
                        setTimeout(function () { $("#nopicture").remove() }, 3000);
                    } else {
                        $(".video-js").append(`<div id="nopicture" class="vjs-switchRes-button">${uid} 已消音成功</div>`);
                        setTimeout(function () { $("#nopicture").remove() }, 3000);
                        $(".refresh").click();
                    }
                });
            });
        },
        accuselink(sn,i){
            Tool.getCSRFToken().done(function(token) {
                var apiLink = 'https://api.gamer.com.tw/mobile_app/anime/'
                $.ajax({
                    url: apiLink + 'v1/danmu_accuse.php',
                    data: {'danmaku_sn': [sn], 'token': token},
                    method: 'POST',
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function(rdata) {
                    try {
                        if (rdata.code == 0) {
                            $(".video-js").append(`<div id="nopicture" class="vjs-switchRes-button">檢舉失敗，請稍後再試</div>`);
                            setTimeout(function () { $("#nopicture").remove() }, 3000);
                        } else {
                            $(".video-js").append(`<div id="nopicture" class="vjs-switchRes-button">已完成檢舉!</div>`);
                            setTimeout(function () { $("#nopicture").remove() }, 3000);
                        }
                    } catch (error) {}
                });
            });
        }
    }
},
Tool = {
    tobig5(obj) {
        var text = obj;
        var asciiTable = "!\"#$%&\’()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
        var big5Table = "%uFF01%u201D%uFF03%uFF04%uFF05%uFF06%u2019%uFF08%uFF09%uFF0A%uFF0B%uFF0C%uFF0D%uFF0E%uFF0F%uFF10" +
            "%uFF11%uFF12%uFF13%uFF14%uFF15%uFF16%uFF17%uFF18%uFF19%uFF1A%uFF1B%uFF1C%uFF1D%uFF1E%uFF1F%uFF20%uFF21%uFF22%uFF23" +
            "%uFF24%uFF25%uFF26%uFF27%uFF28%uFF29%uFF2A%uFF2B%uFF2C%uFF2D%uFF2E%uFF2F%uFF30%uFF31%uFF32%uFF33%uFF34%uFF35%uFF36" +
            "%uFF37%uFF38%uFF39%uFF3A%uFF3B%uFF3C%uFF3D%uFF3E%uFF3F%u2018%uFF41%uFF42%uFF43%uFF44%uFF45%uFF46%uFF47%uFF48%uFF49" +
            "%uFF4A%uFF4B%uFF4C%uFF4D%uFF4E%uFF4F%uFF50%uFF51%uFF52%uFF53%uFF54%uFF55%uFF56%uFF57%uFF58%uFF59%uFF5A%uFF5B%uFF5C" +
            "%uFF5D%uFF5E";
        var result = "";
        for (var i = 0; i < text.length; i++) {
            var val = escape(text.charAt(i));
            var j = big5Table.indexOf(val);
            result += (((j > -1) && (val.length == 6)) ? asciiTable.charAt(j / 6) : text.charAt(i));
        }
        return result;
    },
    filter_r(arr, attr) {
        var tmp = {}, re = [], len = arr.length;
        for (var i = 0; i < len; i++) {
            if (!(arr[i][attr] in tmp)) re.push(arr[i]);
            tmp[arr[i][attr]] = 1;
        }
        return re;
    },
    jsonsort(json, key) {
        for (var j = 1; j < json.length; j++) {
            var temp = json[j], val = temp[key], i = j - 1;
            while (i >= 0 && json[i][key] > val) {
                json[i + 1] = json[i];
                i = i - 1;
            }
            json[i + 1] = temp;
        }
        return json;
    },
    browser:{
        Browser:window.navigator.userAgent.match(/Chrome\/(\d*)/gm),
        Var(){
            return (this.Browser!= null)?this.Browser[0].match(/\d*$/gm):[0];
        },
        Search(value){
            return (this.Browser!= null)?this.Browser[0].indexOf(value):null;
        },
        BrowserCheck(name){
            let Regex = name+"/(\\d*)";
            let re = new RegExp(Regex,"gm");
            let Browser = window.navigator.userAgent.match(re);
            let Search = (Browser!= null)?Browser[0].indexOf(name):null;
            let BrowserVar = (Browser!= null)?Browser[0].match(/\d*$/gm):[0];
            return [Search,BrowserVar[0]];
        }
    },
    storage:{
        get(key){
            return GM_getValue(key);
        },
        set(key, value, bool = true){
            GM_setValue(key,value);
            if (bool) {
                clearTimeout(window.hidemsg);
                $("#plussetup").css("display","block");
                $("#plussetup").text("設定已儲存");
                window.hidemsg = setTimeout(function(){$("#plussetup").css("display","none")},3000);
           }
        }
    },
    getCSRFToken() {
        return $.ajax({
            url: '/ajax/getCSRFToken.php',
            cache: false
        });
    },
    blockalert(v){
        unsafeWindow.alert = function (t) {
            if (!t.includes(v)){
                alert(t);
            }
        };
    },
    globalHotkeys(){
        $(document).keydown(function(event){
            var v = event.which
            Aniplus.fullscreen.web.hotkey(v)
        });
    },
},
VideoTime = {
    main(v1, v2) {
        let video_v1 = parseInt(v1) || 0;
        let video_v2 = parseInt(v2) || 0;
        var stime = (video_v1 * 60) + video_v2;
        if ( stime < Player.duration()) {
            Player.play(function(){
                Player.currentTime = stime;
            });
        }else{
            Player.play(function(){
                alert("未知的座標，空降失敗");
            });
        }
    },
    skip(index, json) {
        $('#skip_' + index).click(function () {
            if (Anivalue.pass) {
                Player.play(function(){
                    Player.currentTime = json.stime;
                });
            }
        });
    },
    parse(stringasc, array, bool) {
        var match = stringasc.match(/([0-9]+:[0-9]+:[0-9]+)|([0-9]+:[0-9]+)|([0-9]{4})/g);
        for (var id in match) {
            var split = match[id].split(":");
            var video_hour = 0
            var video_minute = 0
            var video_second = 0
            var stime = 0
            switch (split.length) {
                case 2:
                    video_minute = split[0].toString().padStart(2, "0");
                    video_second = split[1].toString().padStart(2, "0");
                    stime = parseInt((video_minute * 60)) + parseInt(video_second);
                    if (stime < Player.duration()) {
                        array.push({ "airborne": bool, "stime": stime , "time": video_minute + ":" + video_second });
                    }
                    break;
                case 3:
                    video_hour = split[0].toString().padStart(2, "0");
                    video_minute = split[1].toString().padStart(2, "0");
                    video_second = split[2].toString().padStart(2, "0");
                    stime = parseInt((video_hour * 3600)) + parseInt((video_minute * 60)) + parseInt(video_second);
                    if ( stime < Player.duration()) {
                        array.push({ "airborne": bool, "stime": stime , "time": video_hour + ":" + video_minute + ":" + video_second });
                    }
                    break;
                case 1:
                    video_minute = match[id].substr(0,2);
                    video_second = match[id].substr(2,4);
                    stime = parseInt((video_minute * 60)) + parseInt(video_second)
                    if ( bool && stime < Player.duration()) {
                        array.push({ "airborne": bool, "stime": stime , "time": video_minute + ":" + video_second });
                    }
                    break;
            }
        }
    }
},
Player = {
    video_html(){
        return $("#ani_video_html5_api");
    },
    src(){
        return this.video_html().attr("src") || "";
    },
    readyState(){
        return this.video_html()[0].readyState;
    },
    duration(){
        return this.video_html()[0].duration;
    },
    play(callback){
        if (this.paused() != true) { $(".vjs-play-control").click(); }
        callback();
        if (this.paused() == true) { $(".vjs-play-control").click(); }
    },
    paused(){
        return this.video_html()[0].paused;
    },
    ended(){
        return this.video_html()[0].ended;
    },
    set currentTime(value){
        this.video_html()[0].currentTime = value;
    },
    get currentTime(){
        return this.video_html()[0].currentTime;
    }
},
load = {
    storage:{
        ncc_warning:null,
        video_next:null,
        ad_skip:null,
        hotkey_danmu:null
    },
    async set(){
        let self = this;
        //載入儲存值
        this.storage.ncc_warning = funvalue.ncc_warning;
        this.storage.video_next =  funvalue.video_next;
        this.storage.ad_skip =  funvalue.ad_skip;
        this.storage.hotkey_danmu = funvalue.hotkey_danmu;

        $("#grading").prop("checked", this.storage.ncc_warning);
        $("#video_next_skip").prop("checked", this.storage.video_next);
        $("#ad_skip").prop("checked",this.storage.ad_skip);

        //自動切換至下一集
        window.next_button = setInterval(function () {
            if($("#ani_video-next").length == 0){
                $("#ani_video").append('<div class="video-next-button" id="ani_video-next" style="display:none"></div>');
            }else{
                clearInterval(window.next_button);
            }
        },1e3);

        //設定自動同意分級標識警告
        $("#grading").change(function (e) {
            self.storage.ncc_warning = $(this).prop("checked")
            Tool.storage.set('ncc_warning', self.storage.ncc_warning)
            Aniplus.ncc_warning()

        });

        //設定自動切換至下一集
        $("#video_next_skip").change(function () {
            self.storage.video_next = $(this).prop("checked")
            Tool.storage.set('video_next', self.storage.video_next)
            Aniplus.video_next.videoisended();
        });

        //自動點此跳過廣告
        $("#ad_skip").change(function() {
            self.storage.ad_skip = $(this).prop("checked")
            Tool.storage.set('ad_skip', self.storage.ad_skip)
            Aniplus.ad_skip();
        });

        //空降座標
        $('#plus-video-skip-sendout').on('click', function () {
            var minute = $("#plus-video-skip-minute").val();
            var second = $("#plus-video-skip-second").val();
            $("#plus-video-skip-minute").val("");
            $("#plus-video-skip-second").val("");
            VideoTime.main(minute, second);
        })


    }
};

//使用者介面HTML
function aniplus_ui_html(){

    var ui_html = '<div class="ani-setting-section">';
    ui_html += '<div id="plussetup" class="plus_dialog-border" style="display:none;"></div>';
    ui_html += '<h4 class="ani-setting-title" style=" display: flex;align-items: center;">動畫瘋·Plus ';
    ui_html += '<div class="plus_explain"><span>此插件設計是為了給短時間大量補番的人使用的，並加入一些沒用的功能<br>如果您覺得此插件好用，請付費支持動畫瘋讓此插件能持續為本平台服務';
    ui_html += '</span></div>';
    ui_html += '<div class="plus_version">' + update_info.version + '<span>' + update_info.content() + '</span></div>';
    ui_html += '</h4>';
    ui_html += '<div class="ani-setting-item ani-flex">';
    ui_html += '<div class="ani-setting-label">';
    ui_html += '<span class="ani-setting-label__mian">Google Chrome擴充插件</span>';
    ui_html += '</div>';
    ui_html += '<div class="ani-setting-value ani-set-flex-right">';
    ui_html += '<a href="https://chrome.google.com/webstore/detail/%E5%8B%95%E7%95%AB%E7%98%8B%C2%B7plus/jkpkmeimgkhodlppajjgikfcodlilmpd" target="_blank">前往安裝</a>';
    ui_html += '</div>';
    ui_html += '</div>';

    ui_html += '<div class="ani-setting-item ani-flex">';
    ui_html += '<div class="ani-setting-label">';
    ui_html += '<span id="firefox_w" class="ani-setting-label__mian">自動同意分級標識警告</span>';
    ui_html += '</div>';
    ui_html += '<div class="ani-setting-value ani-set-flex-right">';
    ui_html += '<div class="ani-checkbox">';
    ui_html += '<label class="ani-checkbox__label">';
    ui_html += '<input id="grading" type="checkbox">';
    ui_html += '<div class="ani-checkbox__button"></div>';
    ui_html += '</label>';
    ui_html += '</div>';
    ui_html += '</div>';
    ui_html += '</div>';

    ui_html += '<div class="ani-setting-item ani-flex">';
    ui_html += '<div class="ani-setting-label">';
    ui_html += '<span class="ani-setting-label__mian">自動切換至下一集</span>';
    ui_html += '</div>';
    ui_html += '<div class="ani-setting-value ani-set-flex-right">';
    ui_html += '<div class="ani-checkbox">';
    ui_html += '<label class="ani-checkbox__label">';
    ui_html += '<input id="video_next_skip" type="checkbox">';
    ui_html += '<div class="ani-checkbox__button"></div>';
    ui_html += '</label>';
    ui_html += '</div>';
    ui_html += '</div>';
    ui_html += '</div>';

    ui_html += '<div class="ani-setting-item ani-flex">';
    ui_html += '<div class="ani-setting-label">';
    ui_html += '<span class="ani-setting-label__mian">自動點此跳過廣告</span>';
    ui_html += '</div>';
    ui_html += '<div class="ani-setting-value ani-set-flex-right">';
    ui_html += '<div class="ani-checkbox">';
    ui_html += '<label class="ani-checkbox__label">';
    ui_html += '<input id="ad_skip" type="checkbox">';
    ui_html += '<div class="ani-checkbox__button"></div>';
    ui_html += '</label>';
    ui_html += '</div>';
    ui_html += '</div>';
    ui_html += '</div>';

    ui_html += '<div class="ani-setting-item ani-flex">';
    ui_html += '<div class="ani-setting-label">';
    ui_html += '<span class="ani-setting-label__mian">空降座標</span>';
    ui_html += '</div>';
    ui_html += '<div class="ani-setting-value ani-set-flex-right">';
    ui_html += '<div class="plus-keyword-header">';
    ui_html += '<input type="text" id="plus-video-skip-minute" class="plus-input--keyword ani-input ani-input--keyword" disabled placeholder="00" onKeypress="if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;">：';
    ui_html += '<input type="text" id="plus-video-skip-second" class="plus-input--keyword ani-input ani-input--keyword" disabled placeholder="00" onKeypress="if (event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;">';
    ui_html += '<input id="plus-video-skip-sendout" class="plus-bluebtn" value="降落" disabled type="submit" style="border:2px blue none;">';
    ui_html += '</div>';
    ui_html += '</div>';
    ui_html += '</div>';

    ui_html += '<div class="ani-setting-item">';
    ui_html += '<div class="ani-setting-label">';
    ui_html += '<span class="ani-setting-label__mian">空降足跡<font size="2">(點擊降落)</font></span>';
    ui_html += '<span class="plus_explain"><span>說明：<br>運作原理是取所有彈幕文字並利用關鍵字篩選，如果有在自訂過濾關鍵字裡新增<br>【空降】or【座標】or【：】和開啟自動過濾，顯示結果會不同</span></span>';
    ui_html += '<div class="ani-setting-value ani-set-flex-right">';
    ui_html += '<span class="plus_k-label">確認座標<span>說明：已回報的座標</span></span>';
    ui_html += '<span class="plus_k-label" style="background:#bbbbbb;">其它座標<span>說明：<br>其它座標又稱未確定座標，有可能的原因是紀念觀賞時間<br>或未放入"空降"or"座標"關鍵字</span></span>';
    ui_html += '<button class="plus_refresh"><i class="plus_material-icons">refresh</i></button>';
    ui_html += '</div>';
    ui_html += '</div>';
    ui_html += '<div class="plus_time_body">';
    ui_html += '<ul class="plus_no_sub"><img src="https://i2.bahamut.com.tw/anime/no_sub.png"style="width: 33%;"><br>正在努力尋找中···</ul>';
    ui_html += '</div>';
    ui_html += '</div>';
    ui_html += '</div>';

    return ui_html;
}


//使用者介面CSS
function aniplus_ui_css(){
$('head').append(`
<style type="text/css">
.ani-setting-item a {
    color: unset;
}

.plus_bullet-send {
padding:0 5px 0 5px;
width:20%;
z-index:1;
border-radius:5px;
cursor:all-scroll;
}

.plus_bullet-control {
left:unset;
right:0;
z-index:1;
height:100%;
}

.plus_bullet-send_icon {
width: 35px;
height: 38px;
float: right;
padding: 6px 8px;
border-style: none;
background-color: transparent;
color: #fff;
opacity: 0.7;
}

.plus_bullet-send_icon:before {
content: "chat";
}

.plus_bullet-send_icon:before {
font-size: 19px !important;
direction: ltr;
display: inline-block;
font-family: 'Material Icons';
font-style: normal;
font-weight: normal;
letter-spacing: normal;
text-transform: none;
white-space: nowrap;
word-wrap: normal;
-webkit-font-smoothing: antialiased;
text-rendering: optimizeLegibility;
-moz-osx-font-smoothing: grayscale;
-webkit-font-feature-settings: 'liga';
font-feature-settings: 'liga';
}

.plus_bullet-send_icon:hover{
opacity: 1;
}


.plus_Web_fullscreen_icon {
	float: right;
   cursor: pointer;
   opacity: 0.7;
   position: relative;
   margin: 0;
   padding: 6px 6px 7px 6px;
   text-align: center;
   border: none;
   color: #fff;
   background-color: transparent;
}

.plus_Web_fullscreen_icon:before {
   display: inline-block;
	content: "";
   width: 23px;
   height: 23px;
   background: var(--web_fullscreen);
   background-repeat: no-repeat;
}


.plus_Web_fullscreen_icon:hover {
	opacity: 1;
}


.plus_Web_fullscreen_on:before {
   background:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTcuOSwxMmgtMS42djIuNEgxNFYxNmgzLjlWMTJ6IE04LjYsOS42aDIuM1Y4SDYuOXY0aDEuNlY5LjZ6IE0xOS40LDQuOGgtMTRjLTAuOSwwLTEuNiwwLjctMS42LDEuNnYxMS4yDQoJYzAsMC45LDAuNywxLjYsMS42LDEuNmgxNC4xYzAuOSwwLDEuNi0wLjcsMS42LTEuNlY2LjRDMjEsNS41LDIwLjMsNC44LDE5LjQsNC44eiBNMTkuNCwxNy42aC0xNFY2LjRoMTQuMXYxMS4ySDE5LjR6Ii8+DQo8L3N2Zz4NCg==');
}

.plus_Web_fullscreen_off:before {
   background:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTUuOSwxMS40aC0xLjZ2Mi40SDEydjEuNmgzLjlWMTEuNHogTTEwLjIsMTAuNWgyLjNWOC45SDguNnY0aDEuNlYxMC41eiBNMTkuNCw0LjhoLTE0DQoJYy0wLjksMC0xLjYsMC43LTEuNiwxLjZ2MTEuMmMwLDAuOSwwLjcsMS42LDEuNiwxLjZoMTQuMWMwLjksMCwxLjYtMC43LDEuNi0xLjZWNi40QzIxLDUuNSwyMC4zLDQuOCwxOS40LDQuOHogTTE5LjQsMTcuNmgtMTRWNi40DQoJaDE0LjF2MTEuMkgxOS40eiIvPg0KPC9zdmc+DQo=');
}



.plus_time_body{
width: 100%;
padding: 8px;
min-height: 170px;
border: 1px solid #ddd;
background: #f5f5f5;
border-radius: 4px;
box-sizing: border-box;
}


html[data-theme='dark'] .plus_time_body{
background: #272728;
border: 1px solid #424242;
}

.plus_keyword-label {
display: inline-flex;
align-items: center;
max-width: 100%;
margin: 0 4px 4px 0;
background: #02B4D8;
font-size: 13px;
color: #fff;
border-radius: 4px;
}

.plus_keyword-label > span {
display: block;
padding: 3px 6px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
vertical-align: middle;
}

.plus_k-label {
align-items: center;
max-width: 100%;
margin: 0 4px 4px 0;
padding: 3px 6px;
background: #02B4D8;
font-size: 13px;
color: #fff;
border-radius: 4px;
display: inline-block;
}

.plus_k-label > span {
display: none
}

.plus_k-label:hover span {
min-height: 20px;
width: 330px;
position: absolute;
z-index: 999;
padding: 10px;
display: block;
background-color:rgba(0, 0, 0, 0.86);
color: #ffffff;
border-radius: 5px;
font-size: 16px;
left: 50px;
}

.plus_explain {
font-size: 21px;
color: #888;;
padding: 0 0 0 5px;
}

.plus_explain:before {
content: "help";
}

.plus_explain:before {
direction: ltr;
display: inline-block;
font-family: 'Material Icons';
font-style: normal;
font-weight: normal;
letter-spacing: normal;
text-transform: none;
white-space: nowrap;
word-wrap: normal;
-webkit-font-smoothing: antialiased;
text-rendering: optimizeLegibility;
-moz-osx-font-smoothing: grayscale;
-webkit-font-feature-settings: 'liga';
font-feature-settings: 'liga';
}


.plus_explain > span {
display: none
}

.plus_explain:hover span {
min-height: 20px;
width: 330px;
position: absolute;
z-index: 999;
padding: 10px;
display: block;
background-color:rgba(0, 0, 0, 0.86);
color: #ffffff;
border-radius: 5px;
font-size: 16px;
left: 50px;
}

.plus_no_sub {
text-align: center;
color: #888;
margin: 10px auto;
}

button.plus_refresh {
float: none;
margin: 0;
padding: 0;
height: 30px;
width: 30px;
border: 1px solid #ccc;
background: #eee;
font-size: 18px;
border-radius: 5px;
cursor: pointer;
outline: none;
}

.ani-tab-content__item .plus_refresh  {
width: 30px;
height: 30px;
border: 1px solid #00B4D8;
background: #00B4D8;
color: #fff;
}

.ani-tab-content__item .plus_refresh:hover {
background: #FFF049;
border-color: #FFF049;
color: #333;
}

.plus_material-icons {
font-family: 'Material Icons';
font-weight: normal;
font-style: normal;
font-size: 21px;
letter-spacing: normal;
text-transform: none;
display: inline-block;
white-space: nowrap;
word-wrap: normal;
direction: ltr;
font-feature-settings: "liga" 1;
}

.ani-tab-content__item .plus_refresh > i {
vertical-align: middle;
}

.video-next-button {
display: block;
position: absolute;
color: #fff;
background: #000;
text-decoration: none;
padding: 10px;
bottom: 40px;
right: 0px;
z-index: 10;
border-top: 1px solid #aaa;
border-left: 1px solid #aaa;
border-bottom: 1px solid #aaa;
font-size: 1.5em;
}

.plus_dialog-border{
border: 1px solid #599bdc;
position: absolute;
z-index: 1000;
background: white;
padding: 10px;
font-size: 1.3rem;
right: 15px;
color: #888888;
}

.plus_picture_in_picture_icon {
   float: right;
   cursor: pointer;
   opacity: 0.7;
   position: relative;
   margin: 0;
   padding: 6px 6px 7px 6px;
   text-align: center;
   border: none;
   color: #fff;
   background-color: transparent;
}

.plus_picture_in_picture_icon:before {
   display: inline-block;
   content: "";
   width: 23px;
   height: 23px;
   background-repeat: no-repeat;
}

.plus_picture_in_picture_icon:hover {
	opacity: 1;
}

.plus_pip_on:before {
   background:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTkuNCw0LjloLTE0Yy0wLjksMC0xLjYsMC43LTEuNiwxLjV2MTFjMCwwLjksMC43LDEuNiwxLjYsMS42aDE0LjFjMC45LDAsMS42LTAuNywxLjYtMS42di0xMQ0KCUMyMSw1LjYsMjAuMyw0LjksMTkuNCw0Ljl6IE0xOS40LDE3LjVoLTd2LTQuN2g3VjE3LjV6Ii8+DQo8L3N2Zz4NCg==');
}

.plus_pip_off:before {
   background:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTkuNCw0LjloLTE0Yy0wLjksMC0xLjYsMC43LTEuNiwxLjV2MTFjMCwwLjksMC43LDEuNiwxLjYsMS42aDE0LjFjMC45LDAsMS42LTAuNywxLjYtMS42di0xMQ0KCUMyMSw1LjYsMjAuMyw0LjksMTkuNCw0Ljl6IE0xOC44LDE3aC03di00LjdoN1YxN3ogTTUuNCwxNi45VjcuMWMwLTAuNCwwLjMtMC43LDAuNy0wLjdoMTIuOGMwLjQsMCwwLjcsMC4zLDAuNywwLjd2OS45DQoJYzAsMC40LTAuMywwLjctMC43LDAuN0g2LjFDNS43LDE3LjYsNS40LDE3LjMsNS40LDE2Ljl6Ii8+DQo8L3N2Zz4NCg==');
}

.plus-keyword-header .plus-bluebtn {
flex: 0 0 auto;
position: relative;
display: inline-block;
padding: 6px 12px;
font-size: 13px;
border-radius: 4px;
vertical-align: middle;
}

.plus-bluebtn {
border-radius: 10px;
padding: 12px;
text-align: center;
text-decoration: none;
color: #fff;
margin: 0px 7px 0 0;
background: #00B4D8;
display: inline-block;
font-size: 1.3em;
}

.plus-bluebtn:disabled{
background-color:#ebebe4;
color: #757575;
}


.plus-input {
display: inline-block;
margin: 0 8px 0 0;
padding: 0 8px;
height: 30px;
border: 1px solid #ddd;
box-sizing: border-box;
border-radius: 4px;
font-size: 16px;
vertical-align: middle;
width: 165px;
}

.plus-input.plus-input--keyword {
max-width: 300px;
margin: 0px 8px 0px 8px;
}

.plus-input--keyword {
width: 71px !important;
}

.v_danmu_box{
    position: absolute;
    background-color: #292929ed;
    border-radius: 4px;
    width: auto;
    height: 40px;
	margin: 0px 5px 0px 0px;
	padding: 0 5px;
	z-index: 1;
    font-family: Microsoft JhengHei, Heiti, Simhei, Simsun, wqy-zenhei, MS Mincho, Meiryo, Microsoft Yahei, monospace;
    font-size: 12px;
}

.v_danmu_box_b {
	display: flex;
    align-items: center;
    height: inherit;
}

.v_danmu_text{
    font-size: 12px;
    height: 28px;
    margin: 0px 5px;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: rgba(255, 255, 255, 0);
    border: none;
    color: white;
    border-radius: 4px;
    padding: 0px 5px;
}

.v_danmu_menu{
    border-radius: 4px;
    width: 56px;
    height: 28px;
    margin: 0 2px;
    color: #fff;
    cursor: pointer;
    background-color: #404040;
    display: flex;
    align-items: center;
    justify-content: center;
}


.plus_version {
font-size: 15px;
color: #666;
position: absolute;
right: 0;
margin: 0 15px 0 0px;
}

.plus_version > span {
display: none
}

.plus_version:hover span {
min-height: 20px;
width: 330px;
position: absolute;
z-index: 999;
padding: 10px;
display: block;
background-color: rgba(0, 0, 0, 0.86);
color: #ffffff;
border-radius: 5px;
font-size: 16px;
right: 0;
}


.plus_hide{
display: none;
}

.plus_ani-tabs-link {
position: relative;
display: block;
padding: 0 16px;
background: var(--card-bg);
color: var(--text-default-color);
text-decoration: none;
white-space: nowrap;
}

.plus_ani-tabs-link:after {
left: 0;
bottom: 0;
z-index: 1;
width: 100%;
height: 3px;
background: var(--border-timeline);
}

.plus_ani-tabs-link:before {
bottom: 3px;
left: 50%;
margin-left: -5px;
width: 0;
height: 0;
border-style: solid;
border-width: 0 5px 4px 5px;
border-color: transparent transparent;
-webkit-transform: translate3d(0, 3px, 0);
transform: translate3d(0, 3px, 0);
}

.plus_ani-tabs-link.is-active:after {
height: 3px;
background: var(--selected-color);
}

.plus_ani-tabs-link.is-active:before {
-webkit-animation: none !important;
animation: none !important;
bottom: 6px !important;
border-color: transparent transparent var(--selected-color) transparent !important;
}

.plus_ani-tabs-link:hover:before {
border-color: transparent transparent var(--border-timeline) transparent;
-webkit-animation: moving 200ms ease-in forwards;
animation: moving 200ms ease-in forwards;
}

.plus_ani-tabs-link:before, .plus_ani-tabs-link:after {
content: "";
position: absolute;
}

</style>
`);
}

(function() {
    "use strict";

    Tool.blockalert("廣告");

    $.each(funvalue, function (key, value) {
        if(GM_getValue(key) != undefined){
             funvalue[key] = GM_getValue(key);
        }else{
            GM_setValue(key,value)
        }
    })

    Aniplus.ui();
    Aniplus.initial();
    Aniplus.fullscreen.web.main();
    Aniplus.picture_in_picture.main();
    Aniplus.video_danmu_copy.main();

    $(document).on("mozfullscreenchange webkitfullscreenchange fullscreenchange",Aniplus.fullscreen.check);


})();