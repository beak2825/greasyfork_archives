// ==UserScript==
// @name         奈菲影视小猪手
// @namespace
// @version      2.10.4
// @description  功能较多并增加中，使用方法详见 https://greasyfork.org/zh-CN/scripts/403365-奈菲影视小猪手
// @author       ok!
// @match        https://www.nfmovies.com/*
// @grant        unsafeWindow
// @run-at       document-start

// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/403365/%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E5%B0%8F%E7%8C%AA%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403365/%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E5%B0%8F%E7%8C%AA%E6%89%8B.meta.js
// ==/UserScript==

var sec_sub;
var sec_fwd;
var wheel_sec;
var buffer_time;
var dark_mode;
var del_sid;

var pig_hand = {
    //清
    ads_all:function(){
        if(document.querySelector("body > .hidden-xs")){
            let hidden_xs=document.querySelectorAll("body > .hidden-xs");
            hidden_xs[hidden_xs.length-1].hidden=true;
            console.log(hidden_xs.length);
        }
        if(document.querySelector("body > div.myui-ra-container.container")){
            var myui_ra_container=document.querySelectorAll("body > div.myui-ra-container.container");
            myui_ra_container[0].hidden=true;
            myui_ra_container[1].hidden=true;
        }
        if(document.querySelector("body > div.container > div > div.col-md-wide-7.col-xs-1.padding-0 div.hy-layout"))document.querySelector("body > div.container > div > div.col-md-wide-7.col-xs-1.padding-0 div.hy-layout").hidden=true;
        if (window.location.href.startsWith("https://www.nfmovies.com/video/")||window.location.href.startsWith("https://www.nfmovies.com/list/")||window.location.href == "https://www.nfmovies.com/"||window.location.href.startsWith("https://www.nfmovies.com/login.php")||window.location.href == "https://www.nfmovies.com/index.php"||
            window.location.href.startsWith("https://www.nfmovies.com/detail/")||window.location.href.startsWith("https://www.nfmovies.com/gbook.php")||window.location.href.startsWith("https://www.nfmovies.com/search.php")){
            setTimeout(function(){
                if(document.querySelector("body > .hidden-xs")){document.querySelector("body > .hidden-xs").remove();
                                                                console.log("成功删除hidden2");}
            },5550);
            setTimeout(function(){
                if(document.querySelector("body > div.myui-ra-container.container")){
                    myui_ra_container[0].remove();
                    myui_ra_container[1].remove();
                    console.log("成功删除ra_c");}
            },5550);
            setTimeout(function(){
                if(document.querySelector("body > div.container > div > div.col-md-wide-7.col-xs-1.padding-0 div.hy-layout"))document.querySelector("body > div.container > div > div.col-md-wide-7.col-xs-1.padding-0 div.hy-layout").remove();
            },5550);
        }
    },
    //保存历史和登录记录(停用)
    /*
    history_save:function(){
        if (window.location.href.startsWith("https://www.nfmovies.com/video/")||window.location.href.startsWith("https://www.nfmovies.com/list/")||window.location.href == "https://www.nfmovies.com/"||window.location.href.startsWith("https://www.nfmovies.com/login.php")||window.location.href == "https://www.nfmovies.com/index.php"||
            window.location.href.startsWith("https://www.nfmovies.com/detail/")||window.location.href.startsWith("https://www.nfmovies.com/gbook.php")||window.location.href.startsWith("https://www.nfmovies.com/search.php")){
            var history_html;
            var store_cookie = setInterval(function (){
                if(history_html = document.querySelector('.history-list').innerHTML){
                    if(MyTheme.Cookie.Get("loginstate")){
                        localStorage.setItem("loginstate",MyTheme.Cookie.Get("loginstate"));
                    }
                    else if(localStorage.getItem('loginstate')){
                        MyTheme.Cookie.Set('loginstate',localStorage.getItem('loginstate'));
                    }
                   if(MyTheme.Cookie.Get("history")===undefined){MyTheme.Cookie.Set('history',localStorage.getItem('history'))}
                   else{var histo_local = "["+Array.from(new Set(localStorage.getItem('history').replace(/\,\]/,"").replace(/\[/,"").replace(/\]/,"").split(/(?<=}),/).concat(MyTheme.Cookie.Get("history").replace(/\,\]/,"").replace(/\[/,"").replace(/\]/,"").split(/(?<=}),/)))).toString()+"]";
				   let jsonto_array=JSON.parse(histo_local);
				    if(jsonto_array.length>15){jsonto_array.splice(0,1)}
				   let filter_array = jsonto_array.filter(item=>item.name === jsonto_array[jsonto_array.length-1].name);
				   //console.log(filter_array);
				   if(filter_array.length > 1){
					   let index = jsonto_array.findIndex(item => item.name === jsonto_array[jsonto_array.length-1].name);
				   index > -1 && jsonto_array.splice(index, 1);
				  // console.log(jsonto_array);
				   }
					   localStorage.setItem('history',JSON.stringify(jsonto_array));
					   MyTheme.Cookie.Set('history',localStorage.getItem('history'));
						}
                    clearInterval(store_cookie);
                }
            },50)
            }
    },
	*/
    //保存历史记录
    history_save:function(){
        let history_html;
        if(history_html = document.querySelector('.history-list').innerHTML){
            if(MyTheme.Cookie.Get("history")===undefined){MyTheme.Cookie.Set('history',localStorage.getItem('history'))}
            else{var histo_local = "["+Array.from(new Set(localStorage.getItem('history').replace(/\,\]/,"").replace(/\[/,"").replace(/\]/,"").split(/(?<=}),/).concat(MyTheme.Cookie.Get("history").replace(/\,\]/,"").replace(/\[/,"").replace(/\]/,"").split(/(?<=}),/)))).toString()+"]";
                 let jsonto_array=JSON.parse(histo_local);
                 if(jsonto_array.length>15){jsonto_array.splice(0,1)}
                 let filter_array = jsonto_array.filter(item=>item.name === jsonto_array[jsonto_array.length-1].name);
                 //console.log(filter_array);
                 if(filter_array.length > 1){
                     let index = jsonto_array.findIndex(item => item.name === jsonto_array[jsonto_array.length-1].name);
                     index > -1 && jsonto_array.splice(index, 1);
                     //  console.log(jsonto_array);
                 }
                 localStorage.setItem('history',JSON.stringify(jsonto_array));
                 MyTheme.Cookie.Set('history',localStorage.getItem('history'));
                }
        }
    },
    /*
    //删除PHPSEDSSID
    del_sid:function(){
        if(!window.location.href.startsWith("https://www.nfmovies.com/js/player")){
            if(localStorage.getItem('del_sid')==1){
                setTimeout(function(){
                    MyTheme.Cookie.Del("PHPSESSID");},2000)}}},
			*/
    //暗夜模式
    dark_eye:function (){
        if(localStorage.getItem('dark_mode')==1){
            if(!window.location.href.startsWith("https://www.nfmovies.com/js/player")){
                var style_type = document.createElement("style");style_type.id = "style_type";
                style_type.innerHTML = `body {color:#aaa !important;background-color:#333 !important;} #header-top{background-color:#222 !important;} div.col-md-wide-3.col-xs-1.myui-sidebar.hidden-sm.hidden-xs > div{background-color:#222 !important;} div.myui-foot {background-color:#222 !important;}div.myui-panel.myui-panel-bg {background-color:#222 !important;} div.myui-panel.myui-panel-bg2 {background-color:#222 !important;}
     #iscaptcha{color:#fff !important;}  #playlist li a{color:#ddd !important;} #playlink{color:#eee !important;} div.operate.clearfix a.btn.btn-info.dropdown-hover.hidden-xs{color:#eee !important;} span {color:#aaa !important;background-color:#333 !important;}.pic-tag{color:#fff !important;background-color: #5bb7fe !important;}.tab-pane.fade .myui-content__list.sort-list li a{box-shadow:0 5px 10px rgba(246,246,246,.25) !important;border-radius: 5px;} #playlist li a{box-shadow:0 5px 10px rgba(246,246,246,.25);border-radius: 5px;} #video {background:black !important;} #player-sidebar > div > div > div > div.text-muted > ul > li > a {background:#5bb7fe !important;color:#eee !important;border-radius: 5px !important;} .btn-gray {box-shadow:0 5px 10px rgba(246,246,246,.25) !important;}.btn-default {background-color:#222 !important;background:#222 !important;} .dropdown-box .item {background-color:#222 !important;} a {color:#aaa !important;}a:hover { font-size: 105%;color:#eee !important;} #talk div{background-color:#888 !important;} h3 {color:#aaa !important;}  .myui-topbg{background-image:none !important;background-color:#333 !important;} #header-top > div.container div.item{background-color:#333 !important;}`;
                document.head.appendChild(style_type);}
            var abcd1 = document.createElement("SCRIPT");abcd1.innerHTML = `var adTime=0;var adsTime=0;var timer=0;const initAd=0;adsPage='';var adCount = 150;adsPausePage='';var _ck1 = true;var inited = true;var timerAdCountdown = null;`; document.head.appendChild(abcd1);if(document.querySelector('#aaaDiv'))document.querySelector('#aaaDiv').remove();

        }
        else if (window.location.href.startsWith("https://www.nfmovies.com/video/")){
            if(document.querySelector("body > div.myui-topbg.clearfix"))
                document.querySelector("body > div.myui-topbg.clearfix").style.height='1680px';
        }
        else if (window.location.href.startsWith("https://www.nfmovies.com/detail/")){
            if(document.querySelector("body > div.myui-topbg.clearfix"))
                document.querySelector("body > div.myui-topbg.clearfix").style.height='233px';
        }
    },
    play_menu:function () {
        if(document.querySelectorAll("#header-top > div.container > div > ul.myui-header__user > li:nth-child(1) > div > div > div > p")){
            //播放设置菜单
            let li_new = document.createElement("li");
            li_new.innerHTML=`<a href="javascript:;" title="设置"><i class="fa fa-gear"></i></a><div class="dropdown-box fadeInDown"><div class="item clearfix"><p class="text-muted">播放设置</p><div class="history-list clearfix"></div><span>当前速度：</span><span id="speed_display"></span><p>选择播放速度:&nbsp;&nbsp;<button id="speed_button" style="background-color: #5bb7fe;border-radius:5px;color:white;"> &nbsp;默认 1x&nbsp; </button></p><input type="range" min="1" max="100" value="25" class="slider" id="speed_slider"><br /><br /><p>跳过片头秒数：<input type="text" id="sec_fwd" style="width:62px;height:22px;vertical-align: middle;padding: 5px;background-color:#fff;border: 2px solid #ddd;" placeholder="空则不跳"></p><p>跳过片尾秒数：<input type="text" id="sec_sub" style="width:62px;height:22px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;" placeholder="空则不播"></p><p>鼠标滚动秒数：<input type="text" id="wheel_sec" style="width:62px;height:22px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;" placeholder="空则不动"></p><p>暂停缓存秒数：<input type="text" id="buffer_time" style="width:62px;height:22px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;" placeholder="空则不缓"></p><br /><p>暗夜模式 : &nbsp; <input id="dark_mode" class="switch switch-anim" type="checkbox" checked></p><p>自动全屏 : &nbsp; <input id="del_sid" class="switch switch-anim" type="checkbox" checked=0></p></div></div>
<style>.switch {           width: 42px;           height: 20px;           position: relative;           border: 1px solid #dfdfdf;           background-color: #fdfdfd;           box-shadow: #dfdfdf 0 0 0 0 inset;           border-radius: 20px;           background-clip: content-box;           display: inline-block;           -webkit-appearance: none;           user-select: none;           outline: none;       }       .switch:before {           content: '';           width: 20px;           height: 20px;           position: absolute;           top: 0;           left: 0;           border-radius: 14px;           background-color: #fff;           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);       }       .switch:checked {           border-color: #5bb7fe;           box-shadow: #5bb7fe 0 0 0 16px inset;           background-color: #5bb7fe;       }       .switch:checked:before {           left: 20px;       }       .switch.switch-anim {           transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;       }       .switch.switch-anim:before {           transition: left 0.3s;       }       .switch.switch-anim:checked {           box-shadow: #5bb7fe 0 0 0 16px inset;           background-color: #5bb7fe;           transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;       }       .switch.switch-anim:checked:before {           transition: left 0.3s;       }
 .text-red {color: #aaa;}
</style>
<style>.fadeInDown{-webkit-animation:fadeInDown .5s .2s ease both;-moz-animation:fadeInDown .5s .2s ease both}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translateY(-10px)}100%{opacity:1;-webkit-transform:translateY(0)}}@-moz-keyframes fadeInDown{0%{opacity:0;-moz-transform:translateY(-10px)}100%{opacity:1;-moz-transform:translateY(0)}}.dropdown{position:relative}.dropdown-box{display:none;position:absolute;z-index:99}.dropdown-box.top{bottom:100%;padding-bottom:10px;left:50%;margin-left:-80px}.dropdown-box.bottom{top:100%;padding-top:10px;left:50%;margin-left:-80px}.dropdown-box.left{left:100%;padding-left:10px;bottom:0}.dropdown-box.right{right:100%;padding-right:10px;bottom:0}.dropdown-box .item{padding:10px;width:160px;border-radius:2px}.dropdownhover{position:relative}.dropdownhover:hover .dropdown-box{display:block}</style>
`
                /*<script> (function(){
            var history_get = MyTheme.Cookie.Get("history"),html='';
            if (history_get) {
                var json = eval("(" + history_get + ")");
                for (i = 0; i < json.length; i++) {
                    html+="<p><a class='text-333' href='" + json[i].link + "' title='" + json[i].name +"'><span class='pull-right text-red'>" + json[i].part + "</span>" + json[i].name + "</a></p>";
                }
            } else {
                html="<p style='padding: 80px 0; text-align: center'>您还没有看过影片哦</p>";
            }
            document.querySelector('.history-list').innerHTML=html})();
</script>;//开关动画有借鉴：原文链接：https://blog.csdn.net/qq_35909852/java/article/details/79079815
*/
            li_new.classList.add('dropdownhover');
                document.querySelector("#header-top > div.container > div > ul.myui-header__user").appendChild(li_new);
                //播放设置
                var speed_display=document.getElementById("speed_display"),speed_slider=document.getElementById("speed_slider"),speed_button=document.getElementById("speed_button"),
                    y=document.getElementById("sec_sub"),z=document.getElementById("wheel_sec"),x=document.getElementById("buffer_time"),w=document.getElementById("dark_mode"),v=document.getElementById("sec_fwd"),h=document.getElementById("del_sid");
                var video_speed;dark_mode = localStorage.getItem('dark_mode');del_sid = localStorage.getItem('del_sid');
                video_speed = localStorage.getItem('speed');sec_fwd = localStorage.getItem('sec_fwd');sec_sub = localStorage.getItem('sec_sub');wheel_sec = localStorage.getItem('wheel_sec');buffer_time = localStorage.getItem('buffer_time');
                video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                setTimeout(function (){if(video_speed&&document.querySelector('#cciframe'))
                    document.querySelector('iframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video").playbackRate = video_speed;},4000);
                speed_slider.value = localStorage.getItem('speed')*25;
                speed_slider.oninput=function(){localStorage.setItem('speed',this.value/25);video_speed = localStorage.getItem('speed');video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                                                document.querySelector('iframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video").playbackRate = video_speed;
                                               }
                speed_button.onclick=function(){localStorage.setItem('speed',1);video_speed = localStorage.getItem('speed');video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                                                document.querySelector('iframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video").playbackRate = video_speed;
                                                speed_slider.value = localStorage.getItem('speed')*25;
                                               }
                sec_fwd?v.value=sec_fwd:v.value="";
                v.onchange=function(){localStorage.setItem('sec_fwd',this.value);sec_fwd = localStorage.getItem('sec_fwd');sec_fwd?v.value=sec_fwd:v.value="";
                                     }
                sec_sub?y.value=sec_sub:y.value="";
                y.onchange=function(){localStorage.setItem('sec_sub',this.value);sec_sub = localStorage.getItem('sec_sub');sec_sub?y.value=sec_sub:y.value="";
                                     }
                wheel_sec?z.value=wheel_sec:z.value="";
                z.onchange=function(){localStorage.setItem('wheel_sec',this.value);wheel_sec = localStorage.getItem('wheel_sec');wheel_sec?z.value=wheel_sec:z.value="";
                                     }
                buffer_time?x.value=buffer_time:x.value="";
                x.onchange=function(){localStorage.setItem('buffer_time',this.value);buffer_time = localStorage.getItem('buffer_time');buffer_time?x.value=buffer_time:x.value="";
                                     }
                w.checded=dark_mode; if(dark_mode!=1){document.getElementById("dark_mode").removeAttribute('checked');}
                w.onchange=function(){if(w.checked){localStorage.setItem('dark_mode','1');pig_hand.dark_eye();}else{localStorage.setItem('dark_mode',0);document.querySelector('#style_type').remove();pig_hand.dark_eye();}
                                      dark_mode = localStorage.getItem('dark_mode');
                                     }
                h.checded=del_sid;if(del_sid!=1){document.getElementById("del_sid").removeAttribute('checked');}
                h.onchange=function(){if(h.checked){localStorage.setItem('del_sid','1');pig_hand.del_sid();}else{localStorage.setItem('del_sid',0);}
                                      del_sid = localStorage.getItem('del_sid');
                                     }
            }
        },
    iframe_video:function(){
        //视频操作
        //视频自动全屏
        var v_elem1;
        if(localStorage.getItem('del_sid')==1){
            setTimeout(function(){if(document.querySelector('#cciframe')){
                
                function toggleFullscreen() {
                    if (!document.fullscreenElement) {
                        if(v_elem1.requestFullscreen){
                            return v_elem1.requestFullscreen();
                        }else if(v_elem1.webkitRequestFullScreen){
                            return v_elem1.webkitRequestFullScreen();
                        }else if(v_elem1.mozRequestFullScreen){
                            return v_elem1.mozRequestFullScreen();
                        }else{
                            return v_elem1.msRequestFullscreen();
                        }
                        //  v_elem.requestFullscreen().catch(err => { console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);});
                    }
                }
                var fullscreen_req = setInterval(function () {
                    v_elem1 =document.querySelector('#cciframe').contentDocument.body.querySelector('#video');
                    if(document.querySelector('#cciframe').contentDocument.body.querySelector('#video')){
                        if(document.querySelector('#cciframe').contentDocument.body.querySelector('#sponsorAdDiv')){
                            document.querySelector('#cciframe').contentDocument.body.querySelector('#sponsorAdDiv').remove();
                            document.querySelector('#cciframe').contentDocument.body.querySelector("body > div.play").click();
                        }
                        if(document.querySelector('#cciframe').contentDocument.body.querySelector('#aaaDiv')){
                            document.querySelector('#cciframe').contentDocument.body.querySelector('#aaaDiv').remove();
                            document.querySelector('#cciframe').contentDocument.body.querySelector("body > div.play").click();
                        }
                    }
                    if (document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video")) {
                        toggleFullscreen();clearInterval(fullscreen_req);
                    }
                },2000);

            }
                                 },1000)
        }
        //3秒后主程序
        setTimeout(function(){
            if(!document.querySelector('#cciframe')){location.reload();}
            else{
                play_main();
                function play_main(){
                    sec_fwd = localStorage.getItem('sec_fwd');
                    sec_sub = localStorage.getItem('sec_sub');
                    wheel_sec = localStorage.getItem('wheel_sec');
                    buffer_time = localStorage.getItem('buffer_time');
                    var video_speed = localStorage.getItem('speed');
                    var video_elem,v_elem;

                    //每3秒试执行主应用操作
                    var main_timer = setInterval(function () {
                        video_elem = document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video");
                        v_elem =document.querySelector('#cciframe').contentDocument.body.querySelector('#video');
                        /*  if(v_elem){
                            if(document.querySelector('#cciframe').contentDocument.body.querySelector('#aaaDiv')){
                                document.querySelector('#cciframe').contentDocument.body.querySelector('#aaaDiv').remove();
                            }
                            if(document.querySelector('#cciframe').contentDocument.body.querySelector('#sponsorAdDiv')){
                                document.querySelector('#cciframe').contentDocument.body.querySelector('#sponsorAdDiv').remove();
                                document.querySelector('#cciframe').contentDocument.body.querySelector("body > div.play").click()
                            }
                        } */
                        if (video_elem){
                            main_opr();
                            clearInterval(main_timer);}
                    },2000)
                    //主应用操作
                    function main_opr() {
                        //   video_elem.poster = "https://www.nfmovies.com/uploads/images/play.jpg";
                        video_elem.autoplay=true;
                   /*     //视频结束退全屏
                        video_elem.onended= function () {
                    if (v_elem1.exitFullscreen) {
           v_elem1.exitFullscreen()
         } else if (v_elem1.msExitFullscreen) {
           v_elem1.msExitFullscreen()
         } else if (v_elem1.mozCancelFullScreen) {
           v_elem1.mozCancelFullScreen()
         } else if (v_elem1.oRequestFullscreen) {
           v_elem1.oCancelFullScreen()
         } else if (v_elem1.webkitExitFullscreen) {
           v_elem1.webkitExitFullscreen();
         }
                  }*/
                        if(video_speed&&video_elem){video_elem.playbackRate = video_speed;}
                        //前跳过秒数
                        video_elem.oncanplay = function(){
                            if(video_elem.currentTime < 20){
                                video_elem.currentTime += sec_fwd/1;
                                video_elem.oncanplay = "";
                            }
                        }
                        video_elem.currentTime += 1;
                        var current_time,current_timeM,hot_hit;
                        hot_hit = document.querySelector("#hit").innerText;
                        video_elem.onpause = function(){
                            if(document.querySelector('#cciframe').contentDocument.body.querySelector('#aaaDiv2')){
                                document.querySelector('#cciframe').contentDocument.body.querySelector('#aaaDiv2').remove();
                            }
                            if(document.querySelector('#cciframe').contentDocument.body.querySelector("#sponsorAdDiv2")){
                                document.querySelector('#cciframe').contentDocument.body.querySelector("#sponsorAdDiv2").remove();
                            }
                            buffer_time = localStorage.getItem('buffer_time');
                            current_time = video_elem.currentTime;
                            current_timeM=current_time>=3600?(Math.floor(current_time/3600)+" : "+Math.floor(current_time/60-60)+" : "+Math.floor(current_time%60)):(Math.floor(current_time/60)+" : "+Math.floor(current_time%60));
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel.dplayer-info-panel-hide").className='dplayer-info-panel dplayer-info-panel-show';
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-resolution > span.dplayer-info-panel-item-data").innerHTML = video_elem.videoWidth+'x'+video_elem.videoHeight;
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-version > span.dplayer-info-panel-item-data").innerHTML = "DPlayer v1.25.0 fdcf45b";
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-duration > span.dplayer-info-panel-item-title").innerHTML = '当前暂停时间';
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-duration > span.dplayer-info-panel-item-data").innerHTML = current_timeM;
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-url > span.dplayer-info-panel-item-title").innerHTML = '视频点击热度';
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-url > span.dplayer-info-panel-item-data").innerHTML = hot_hit+' 次';
                            document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel.dplayer-info-panel-show").style = "z-index:2000;";
                            video_elem.oncanplaythrough = function(){
                                video_elem.currentTime += 1;
                                if(video_elem.currentTime-current_time>=(buffer_time?buffer_time:0)||(video_elem.duration<(video_elem.currentTime+30))){
                                    video_elem.currentTime = current_time;
                                    video_elem.oncanplaythrough='';}
                            }
                            video_elem.currentTime += 1;
                        }
                        video_elem.onplay = function(){
                            console.log(current_time);
                            if(current_time){
                                video_elem.currentTime = parseInt(current_time);
                                document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel.dplayer-info-panel-show").className='dplayer-info-panel dplayer-info-panel-hide';
                                document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-info-panel div.dplayer-info-panel-item.dplayer-info-panel-item-resolution > span.dplayer-info-panel-item-data").innerHTML="";
                                document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video").oncanplaythrough = "";
                            }
                        }
                        // 在视频框内按键ctrl或鼠标右键，直接跳到下一集
                        document.querySelector('#cciframe').contentDocument.body.addEventListener("keydown", function(e) {
                            if (e.keyCode == 17) {
                                e.preventDefault();
                                next_exec();
                            }
                        }, false);
                        document.querySelector('#cciframe').contentDocument.body.querySelector('#video').addEventListener("contextmenu", function(e) {
                            e.preventDefault();
                            next_exec();
                        }, false);
                        //双击全屏
                        video_elem.ondblclick= function() {document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-full > button.dplayer-icon.dplayer-full-icon").click();
                                                          }
                        //中键全屏
                         document.querySelector('#cciframe').contentDocument.body.querySelector('#video').addEventListener("mouseup", function(e) {
                            e.preventDefault();
                            if(e.button==1){
                            //video_elem.webkitRequestFullscreen();
                    if (!document.fullscreenElement) {
                        document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-full > button.dplayer-icon.dplayer-full-icon").click();
                        /*
                        if(video_elem.requestFullscreen){
                            return video_elem.requestFullscreen();
                        }else if(video_elem.webkitRequestFullScreen){
                            return video_elem.webkitRequestFullScreen();
                        }else if(video_elem.mozRequestFullScreen){
                            return video_elem.mozRequestFullScreen();
                        }else{
                            return video_elem.msRequestFullscreen();
                        }
*/
                    }
                            else{document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-full > button.dplayer-icon.dplayer-full-icon").click();
                                //document.webkitCancelFullScreen();
                            }
                            }
                        }, false);

                        /*
                        video_elem.onauxclick = function(e){e.preventDefault()};
                        video_elem.onauxclick = function(event) {event.preventDefault();video_elem.webkitRequestFullscreen();}
                        
                      video_elem.onauxclick = video_elem.addEventListener("mouseup", mid_key, true);
                       function mid_key(e) {
                           // e.preventDefault();
                            if(e.button==1){
                            //video_elem.webkitRequestFullscreen();
                    if (!document.fullscreenElement) {
                        if(video_elem.requestFullscreen){
                             video_elem.removeEventListener("mouseup", mid_key, true);
                            return video_elem.requestFullscreen();
                        }else if(video_elem.webkitRequestFullScreen){
                             video_elem.removeEventListener("mouseup", mid_key, true);
                            return video_elem.webkitRequestFullScreen();
                        }else if(video_elem.mozRequestFullScreen){
                            return video_elem.mozRequestFullScreen();
                        }else{
                            return video_elem.msRequestFullscreen();
                        }

                    }
                            else{document.webkitCancelFullScreen();}
                            }
                        }*/
                        // 滚轮前进后退
                        video_elem.onwheel = function(e){e.preventDefault()};
                        v_elem.onwheel = wheel_e;
                        function wheel_e (event) {
                            event.preventDefault();
                            video_elem.currentTime += (event.deltaY>0?wheel_sec/1:-wheel_sec) ;
                            v_elem.onwheel="";
                            setTimeout(function(){v_elem.onwheel= wheel_e;},300);
                        }
                        // 去右上角logo
                        let logo;
                        if(logo = document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > div.dplayer-logo"))
                        {logo.innerHTML="";
                        }
                    }
                    //每隔25秒获取播放剩余时间，如在25秒内则执行主程序
                    if(sec_sub !== ""){
                        const sec_sub2=sec_sub/1+12;
                        setInterval(function(){
                            let duration = get_dura(),sel_part = document.querySelector("#player-left > ul > li:nth-child(7) > a");
                            if((duration < sec_sub2) && (duration !== 0) && sel_part)
                            {
                                const sec = (duration-sec_sub)*1000;
                                if (sec !== 0) {
                                    setTimeout(next_exec, sec);
                                }
                                // clearInterval(auto_play);
                            }
                        }, 12000);
                    }
                    //next part 执行
                    function next_exec(){
                        const sel_part2 = document.querySelector("#player-left > ul > li:nth-child(7) > a");
                        if (sel_part2 != null)
                        {sel_part2.click();}
                    }
                    //获取播放剩余时间
                    function get_dura() {
                        const sel_start = document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video").currentTime;
                        const sel_fin = document.querySelector('#cciframe').contentDocument.body.querySelector("#video > div.dplayer-video-wrap > video").duration;
                        if (sel_fin !== null) {
                            return sel_fin-sel_start;
                        }
                        return 0;
                    }
                }
            }
        },3000)
    },
    history_edit:function(){
        //删除选定历史播放记录
        var p_add = document.querySelectorAll("#header-top > div.container > div > ul.myui-header__user > li:nth-child(1) > div > div > div > p")
        for(var i = 0;i<p_add.length;i++){
            var a_elem = document.createElement("a");
            a_elem.innerHTML= ` &nbsp;<a href="javascript:;" style="color:#eee !important;background-color: #5bb7fe;border-radius:5px;font-size:70%;"> &nbsp;-删 除-&nbsp;&nbsp </a>`;
            p_add[i].appendChild(a_elem);
            p_add[i].lastChild.addEventListener('click',change_cookie)};
        function change_cookie(e){
            var str_del = e.target.parentElement.parentElement.firstElementChild.title;
            str_del = str_del.replace("(","\\(");
            str_del = str_del.replace(")","\\)");
            console.log(str_del);
            var reg_exp =new RegExp(`{\"name\":\"${str_del}[^}]*},?`);
            //console.log(reg_exp);
            var xyza= encodeURIComponent(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)history\s*\=\s*([^;]*).*$)|^.*$/, "$1")).replace(reg_exp,''));
            // console.log(xyza);
            var exp = new Date();
            exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
            document.cookie=`history=${xyza}; path=/; expires=${exp.toUTCString()}`;
            e.target.parentElement.parentElement.remove();
            localStorage.setItem('history',localStorage.getItem('history').replace(reg_exp,''));
        }
    },
    anti_win:function(){
        var main_script = document.createElement("script");
        // main_script.innerHTML = 'resp.vip = 1;';
        //  main_script.innerHTML = 'var $myui = function(e){console.log(e.name)}';
        //main_script.src="./ck/player.js";
        //main_script.type="text/javascript";
        //main_script.charset="utf-8";
main_script.innerHTML = `vfed={'player':{'loaded':function(){player.addListener('loadedmetadata',ckdata);player.addListener('time',cktime);player.addListener('ended',ckended);},'cplayer':function(auto,live,trys,seek,take,urls,jump,logo,pics){var seek=vfed.cookie.get(take)&&live==false?vfed.cookie.get(take):seek;player.newVideo({loaded:'vfed.player.loaded',container:'#video',variable:'player',flashplayer:true,autoplay:auto,poster:pics,video:urls,live:live,seek:seek});},'aplayer':function(auto,live,trys,seek,take,urls,jump,logo,pics){var player=new Aliplayer({useFlashPrism:true,autoplay:auto,isLive:live,source:urls,id:'video'});player.on('ended',function(){if(jump)top.location.href=jump;});},'eplayer':function(auto,live,trys,seek,take,urls,jump,logo,pics){var type=urls.indexOf('.m3u8')>-1?'customHls':'auto';var player=new DPlayer({container:document.getElementById('video'),autoplay:auto,live:live,logo:logo,video:{url:urls,type:type,pic:pics,customType:{'customHls':function(video,player){var hls=new Hls();hls.loadSource(video.src);hls.attachMedia(video);hls.on(Hls.Events.ERROR,function(event,data){console.log('err',data)
if(data.details=='fragLoadError'){video.currentTime=data.frag.start+data.frag.duration+1.0;}
if(data.fatal){switch(data.type){case Hls.ErrorTypes.NETWORK_ERROR:console.error('fatal network error encountered, trying to recover');HLS.startLoad();break;case Hls.ErrorTypes.MEDIA_ERROR:console.error('fatal media error encountered, trying to recover');HLS.recoverMediaError();break;default:console.error('fatal media error encountered, CANNOT recover');HLS.destroy();break;}}else hls.startLoad();});}}},pluginOptions:{hls:{autoStartLoad:true,startFragPrefetch:true,maxBufferLength:120},},});player.on('loadstart',function(){typeof on_play_loadstart!=="undefined"&&on_play_loadstart();$('video').attr('playsinline','true');$('video').attr('x5-playsinline','true');$('video').attr('webkit-playsinline','true');if(player.video.paused)$('.play').show();});player.on('loadeddata',function(){typeof on_play_loadeddata!=="undefined"&&on_play_loadeddata();if(vfed.cookie.get(take)&&live==false)
if(player.video.duration-vfed.cookie.get(take)<60)player.seek(seek);else player.seek(vfed.cookie.get(take));else player.seek(seek);player.on('timeupdate',function(){if(take&&live==false)vfed.cookie.set(take,player.video.currentTime,30);if(trys!=0&&player.video.currentTime>trys)player.seek(0);});});player.on('ended',function(){typeof on_play_ended!=="undefined"&&on_play_ended();if(jump)top.location.href=jump;});player.on('play',function(){typeof on_play_play!=="undefined"&&on_play_play();$('.play').hide();});player.on('error',function(){typeof on_play_error!=="undefined"&&on_play_error();vfed.player.dplayer(auto,live,trys,seek,take,urls,jump,logo,pics);});$('.play').click(function(){player.play();});},'dplayer':function(auto,live,trys,seek,take,urls,jump,logo,pics){var player=new DPlayer({container:document.getElementById('video'),autoplay:auto,live:live,logo:logo,video:{url:urls,pic:pics},pluginOptions:{hls:{autoStartLoad:true,startFragPrefetch:true,maxBufferLength:120,maxMaxBufferLength:600,maxBufferSize:60*1000*1000,},},});player.on('loadstart',function(){typeof on_play_loadstart!=="undefined"&&on_play_loadstart();$('video').attr('playsinline','true');$('video').attr('x5-playsinline','true');$('video').attr('webkit-playsinline','true');if(player.video.paused)$('.play').show();});player.on('loadeddata',function(){typeof on_play_loadeddata!=="undefined"&&on_play_loadeddata();if(vfed.cookie.get(take)&&live==false)
if(player.video.duration-vfed.cookie.get(take)<60)player.seek(seek);else player.seek(vfed.cookie.get(take));player.on('timeupdate',function(){if(take&&live==false)vfed.cookie.set(take,player.video.currentTime,30);if(trys!=0&&player.video.currentTime>trys)player.seek(0);});});player.on('ended',function(){typeof on_play_ended!=="undefined"&&on_play_ended();if(jump)top.location.href=jump;});player.on('play',function(){typeof on_play_play!=="undefined"&&on_play_play();$('.play').hide();});$('.play').click(function(){player.play();});}},'cookie':{'set':function(name,value,days){try{localStorage.setItem(name,value)}catch(e){}},'get':function(name){try{return localStorage.getItem(name)}catch(e){}},'put':function(urls){return urls;}}};`;
        document.head.appendChild(main_script);
        //document.querySelector("head > style:nth-child(13)").appendChild(main_script);
    },
    anti_bug:function(){
        var a_bug = document.createElement("script");
        a_bug.innerHTML = `timer && clearInterval(timer);timer=0;`;
        document.body.appendChild(a_bug);
    }
}
//执行暗黑
setTimeout(function(){
    pig_hand.dark_eye();
   // pig_hand.anti_win();
},50);
//修复反复播放暂停,不显示播放按键
let del_icon = setInterval(function(){
if (window.location.href.startsWith("https://www.nfmovies.com/js/player/m3u8.html")&&document.querySelector("head > style")){
 pig_hand.anti_win();
 clearInterval(del_icon);}
 },80);
let a_bug1 = setInterval(function(){
if (window.location.href.startsWith("https://www.nfmovies.com/js/player/m3u8.html")&&document.querySelector("body > script")){
 pig_hand.anti_bug();
 clearInterval(a_bug1);}
 },80);
//执行菜单-历史-清
exec_menu_history_ads();
//执行视频操作
if (window.location.href.startsWith("https://www.nfmovies.com/video/")){
    pig_hand.iframe_video();
}

////保险:
//没黑就再来一次
setTimeout(function(){
    if (window.location.href.startsWith("https://www.nfmovies.com/video/")||window.location.href.startsWith("https://www.nfmovies.com/list/")||window.location.href.startsWith("https://www.nfmovies.com/detail/")||window.location.href == "https://www.nfmovies.com/"||window.location.href.startsWith("https://www.nfmovies.com/search.php")||window.location.href == "https://www.nfmovies.com/index.php")
    {
        if(document.querySelector("head > #style_type")){}
        else{pig_hand.dark_eye();
             // alert("又黑一次");
             console.log("没黑就又来一次1")
             // pig_hand.ads_all();
             exec_menu_history_ads();
             console.log("没黑就又来一次清2");
            }
    }
},950);
//没干净就4秒后再来一次
setTimeout(function(){pig_hand.ads_all();
                      if(localStorage.getItem('history')){
                          //加载历史
                          pig_hand.history_save();
                          //历史加删除按键
                          if(!document.querySelector("#header-top > div.container > div > ul.myui-header__user > li:nth-child(1) > div > div > div > p > a:nth-child(2)")){
                              pig_hand.history_edit();
                          }
                      }
                     },3950);

//声明菜单-历史-清
function exec_menu_history_ads(){
    if (window.location.href.startsWith("https://www.nfmovies.com/video/")||window.location.href.startsWith("https://www.nfmovies.com/list/")||window.location.href == "https://www.nfmovies.com/"||window.location.href.startsWith("https://www.nfmovies.com/login.php")||window.location.href == "https://www.nfmovies.com/index.php"||
        window.location.href.startsWith("https://www.nfmovies.com/detail/")||window.location.href.startsWith("https://www.nfmovies.com/gbook.php")||window.location.href.startsWith("https://www.nfmovies.com/search.php")){
        let load_menu = setInterval(function (){
            if(document.querySelector("#header-top > div.container > div > ul.myui-header__user"))
            { pig_hand.play_menu();//菜单
             clearInterval(load_menu);}
        },300)
        let history_e = setInterval(function (){
            let times_count=0;
            times_count++;
            if(times_count>300){console.log("reach MAX"+times_count+"MyTheme missing");
                                clearInterval(history_e);}
            //增加了先确认MyTheme.Browser.url
            if($&&MyTheme.Browser.url&&document.querySelector('.history-list')){
                //清
                pig_hand.ads_all();
                //加载历史
                pig_hand.history_save();
                //历史加删除按键及显化
                pig_hand.history_edit();
                if (window.location.href.startsWith("https://www.nfmovies.com/video/")){
                    if(document.querySelector("body > div.myui-topbg.clearfix")){
                        document.querySelector("body > div.myui-topbg.clearfix").style.height='1680px';
                        /* 评论区验证码窗口
                                       setTimeout(function(){
                                           document.querySelector('#parentframe').style.height="240px";
                                           document.querySelector('#parentframe').contentDocument.body.querySelector("#gcaptcha").style.marginRight="150px";},2000)
                                         */
                    }
                }
                else if (window.location.href.startsWith("https://www.nfmovies.com/detail/")){
                    if(document.querySelector("body > div.myui-topbg.clearfix")){
                        document.querySelector("body > div.myui-topbg.clearfix").style.height='233px';
                        /* 评论区验证码窗口
                                       setTimeout(function(){
                                           document.querySelector('#parentframe').style.height="240px";
                                           document.querySelector('#parentframe').contentDocument.body.querySelector("#gcaptcha").style.marginRight="150px";},2000)
                                      */
                    }
                }
            }
            clearInterval(history_e);}
                                    ,100)
        }
}

/*
setTimeout(function(){if(!window.location.href.startsWith("https://www.nfmovies.com/js/player")&&(!window.location.href.startsWith("https://www.nfmovies.com/comment/"))){
   document.querySelector('a[href="https://www.naifei.shop/?sid=EyTkXH"]').parentElement.remove();
}},6000);
*/
//pig_hand.history_save(); //pig_hand.del_sid();