// ==UserScript==
// @name         泥巴影院小助手
// @version      1.33
// @description  泥巴影院多种辅助功能,广告,自动播放最后观看剧集,无级调速,自动缓冲全集.键盘控制进退全屏,自动跳过片头片尾播放下集等
// @author       ok!
// @match        https://m.nbyy.tv/detail*
// @match        https://m.nbyy.tv/*
// @match        https://www.nbys1.tv/*
// @match        https://www.mudvod1.tv/*
// @match        https://www.mudvod.tv/*
// @match        https://www.nivod.tv/*
// @match        https://www.nivod4.tv/*
// @icon         https://www.google.com/s2/idlefavicons?sz=64&domain=nbys1.tv
// @run-at       document-idle
// @grant        none
// @namespace https://github.com/rasso1/u-Youtube
// @downloadURL https://update.greasyfork.org/scripts/452399/%E6%B3%A5%E5%B7%B4%E5%BD%B1%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452399/%E6%B3%A5%E5%B7%B4%E5%BD%B1%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    $("#my_saberfeedback_button").click(function () {
        if (!__isLogin) {
            login_btn_click_callback();
            return;
        }
        $("#my_popup_qp").toggle();
    });
    $(".qp-button").click(function () {

        alert("提交成功");
        $("#my_popup_qp").hide();

    })



    var v,y,video_elem,v_elem,temp_buffer,temp_speed,speed_display,current_time,doc_s,icare_mode,dplay_bezel,sec_sub,sec_fwd,wheel_sec,buffer_time,dark_mode,video_speed,dplayer_bezel;

    var nvod = { message_box:{
        show: function(message) {
            clearTimeout(dplay_bezel);
            if(!document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading")){
                dplayer_bezel = document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel");
                var dplayer_danloading = document.createElement("span");dplayer_danloading.className = "dplayer-danloading";
                dplayer_bezel.appendChild(dplayer_danloading);
                if(document.querySelector("#ad")){document.querySelector("#ad").remove();}
            }

            document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading").style.fontSize = "x-large";
            // document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading").style.color = "black";
            document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading").innerHTML = message;
            document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading").style.display = "";

            dplay_bezel = setTimeout(nvod.message_box.hide, 2000);
        },
        hide: function() {
            document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading").innerText = "";
            document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel > span.dplayer-danloading").style.display = "none";
        }
    },

                //等待整个window加载完成后再执行下边内容
                load:function(){
                    //var video_elem = document.querySelector("#example_video_1 > video");
                    //var v_elem = document.querySelector("#example_video_1");
                    video_elem = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                    v_elem = document.querySelector("#dplayer > div.dplayer-video-wrap");
                    //var wheel_sec =10;var buffer_time=3600;var sec_sub=40;var sec_fwd=20;var video_speed=1.4;

                    var html_app = document.createElement("div");
                    // html_app.style="padding-bottom: 10px;max-width: 142px;";
                    html_app.innerHTML = `<script>function getUserVip(){alert("111");return 1;}</script>
   <button style="border:none;outline:none;background-color:#111312;height:28px;width:28px;margin:16px;" aria-label="缓存/速度设置"><svg id="svg100" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
       <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="transparent" stroke="red" stroke-linecap="round" stroke-width=0.5></path>
      </svg>
</button>

<div style="background:#191a20;border-radius: 10px;left: -160px;right: 0;margin-left: 0;margin-right: -100px;padding-top: 10px;" class="dropdown-box fadeInDown"><div class="item clearfix" style="border-radius:10px;"><p style="margin:10px auto;font-size:18px;"><span class="mandarin invisible">播放设置&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">Playback Setting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font size=2>Chs </font><input style="margin:auto" id="english_mode" class="switch switch-anim" type="checkbox" checked></p>
<div  style="margin:10px auto;font-size:12px;"><hr /><hr /></div>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible" style="margin:10px auto;font-size:16px;">当前速度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">current speed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span id="speed_display"></span></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">选择播放速度<font style="color:#5bb7fe">(d)</font>:&nbsp;&nbsp;&nbsp;</span><span class="english">specify speed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><button id="speed_button" style="background-color: #5bb7fe;border: solid white 1px;border-radius:5px;color:white;font-size:15px;">&nbsp;&nbsp; 1x &nbsp;&nbsp;</button></p><input type="range" min="0" max="100" value="25" class="slider" id="speed_slider"><br /><br />
<p style="margin:10px auto;font-size:16px;"><button id="reset_button" style="background-color: #5bb7fe;border: solid white 1px;border-radius:5px;color:white;font-size:15px;">&nbsp;&nbsp;R eset &nbsp;&nbsp;</button></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">跳过片头秒数<font style="color:#5bb7fe">(a)</font>：</span><span class="english">skip the title:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="sec_fwd" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color:#fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds">
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">跳过片尾秒数<font style="color:#5bb7fe">(s)</font>：</span><span class="english">skip the end:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="sec_sub" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">鼠标滚动秒数：&nbsp;&nbsp;&nbsp; </span><span class="english">mouse scroll:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="wheel_sec" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">暂停缓存<font style="color:#5bb7fe">(e)</font>：;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">pause n cashing:&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="buffer_time" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>

<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">自动播放 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">auto play:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="dark_mode" class="switch switch-anim" type="checkbox" checked></p>
</div></div>

<style>#speed_slider {width: 175px;}.invisible {display: none;}.ytd-feed-filter-chip-bar-renderer.style-scope{z-index:999 !important;}.fadeInDown{-webkit-animation:fadeInDown .5s .2s ease both;-moz-animation:fadeInDown .5s .2s ease both}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translateY(-10px)}100%{opacity:1;-webkit-transform:translateY(0)}}@-moz-keyframes fadeInDown{0%{opacity:0;-moz-transform:translateY(-10px)}100%{opacity:1;-moz-transform:translateY(0)}}.dropdown{position:relative}.dropdown-box{display:none;position:absolute;z-index:9999999999}.dropdown-box.top{bottom:100%;padding-bottom:10px;left:50%;margin-left:-80px}.dropdown-box.bottom{top:100%;padding-top:10px;left:50%;margin-left:-80px}.dropdown-box.left{left:100%;padding-left:10px;bottom:0}.dropdown-box.right{right:100%;padding-right:10px;bottom:0}.dropdown-box .item{padding:10px;width:250px;border-radius:2px}.dropdown-hover{position:relative}.dropdown-hover:hover .dropdown-box{display:block}</style>
<style>a {color: #670000;}.switch {width: 26px;height: 13px;position: relative;border: 1px solid #dfdfdf;background-color: #fdfdfd;box-shadow: #dfdfdf 0 0 0 0 inset; border-radius: 18px;background-clip: content-box;display: inline-block;-webkit-appearance: none;user-select: none;outline: none;} .switch:before { content: '';width: 13px;height: 13px;position: absolute;top: 0;left: 0;border-radius: 12px;background-color: #fff;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);}.switch:checked {border-color: #5bb7fe;box-shadow: #5bb7fe 0 0 0 16px inset;background-color: #5bb7fe;}.switch:checked:before {left: 15px;}.switch.switch-anim {transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;}.switch.switch-anim:before {transition: left 0.3s;}.switch.switch-anim:checked {box-shadow: #5bb7fe 0 0 0 14px inset;background-color: #5bb7fe;transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;}.switch.switch-anim:checked:before {transition: left 0.3s;}.text-red {color: #aaa;}</style>
<style>input[type='range'] {
  width: 400px;
}

input[type='range'],
input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 6px;
  background: linear-gradient(to right, #293043, #293043), #D7D7D7;
  background-size: var(--background-size, 0%) 100%;
  background-repeat: no-repeat;
  border-radius: 5px;

}

input[type='range']::-webkit-slider-thumb {
  width: 19px;
  height: 19px;
  cursor: pointer;
 background: #5bb7fe;
  border: solid white 1px;
  border-radius: 50%;
  margin-top: -6px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
}</style>`;
                    html_app.classList.add('dropdown-hover');
                    html_app.classList.add('header-sideItem');
                    document.querySelector(".qy-header-side").append(html_app);
                    //document.querySelector(".header-inner").append(html_app);
                    //dark
                    var style_type = document.createElement("style");style_type.id = "style_type";
                    style_type.innerHTML = `#end > div.dropdown-hover > div{font-size:12px;color:#bbb !important;background-color:#111312 !important;}
div.dropdown-hover > button{background-color:#222 !important;} div.dropdown-hover path{fill:transparent !important;stroke:white !important;}
div.dropdown-hover > div > div{color:#aaa !important;background-color:#202020 !important;}
div.dropdown-hover > div > div p{font-size:12px;color:#bbb !important;background-color:#202020 !important;}
.dropdown-hover button div{font-size:12px;color:#aaa !important;background-color:#333 !important;}
#sec_sub,#sec_fwd,#wheel_sec,#buffer_time{font-size:12px;color:#bbb !important;background-color:#333 !important;border-radius:5px;}`;
                    document.head.appendChild(style_type);

                    //
                    var speed_slider=document.getElementById("speed_slider"),speed_button=document.getElementById("speed_button"),
                        z=document.getElementById("wheel_sec"),x=document.getElementById("buffer_time"),w=document.getElementById("dark_mode"),
                        t=document.getElementById("english_mode"),r=document.getElementById("reset_button");
                    dark_mode = localStorage.getItem('dark_mode');
                    speed_display=document.getElementById("speed_display");y=document.getElementById("sec_sub");v=document.getElementById("sec_fwd");
                    var english_mode = localStorage.getItem('english_mode');
                    const mandarins = document.querySelectorAll('.mandarin');const englishs = document.querySelectorAll('.english');


                    video_speed = localStorage.getItem('speed');sec_fwd = localStorage.getItem('sec_fwd');sec_sub = localStorage.getItem('sec_sub');
                    wheel_sec = localStorage.getItem('wheel_sec');buffer_time = localStorage.getItem('buffer_time');

                    english_mode = localStorage.getItem('english_mode');
                    //判读英文菜单
                    if(localStorage.getItem('english_mode')==1){
                        for (const mandarin of mandarins) {
                            mandarin.className -= ' invisible';
                        }
                        for (const english of englishs) {
                            english.className += ' invisible';
                        }
                    }

                    video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";

                    setTimeout(function (){
                        if(video_speed&&document.querySelector("#dplayer > div.dplayer-video-wrap > video"))
                        {document.querySelector("#dplayer > div.dplayer-video-wrap > video").playbackRate = video_speed;
                         dplayer_bezel = document.querySelector("#dplayer > div.dplayer-video-wrap > div.dplayer-bezel");
                         var dplayer_danloading = document.createElement("span");dplayer_danloading.className = "dplayer-danloading";
                         dplayer_bezel.appendChild(dplayer_danloading);                        
                        }        
                        if(document.querySelector("#play-btn-c")){document.querySelector("#play-btn-c").remove();}
                    },4000);
                    setTimeout(function(){
                        if(document.querySelector("#ad")){document.querySelector("#ad").remove();}
                        if(document.querySelector("#adltop")){ document.querySelector("#adltop").remove();}

                    },8000)
                    setTimeout(function(){
                        if(document.querySelector("#ad")){document.querySelector("#ad").remove();}
                        if(document.querySelector("#adltop")){ document.querySelector("#adltop").remove();}

                    },5000)
                    // video_elem.onloadeddata = function (){alert("onload");}
                    // video_elem.ondurationchange = function(){alert("onchange");}
                    speed_slider.value = localStorage.getItem('speed')*25;

                    speed_slider.oninput=function(){localStorage.setItem('speed',this.value/25);video_speed = localStorage.getItem('speed');video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                                                    video_elem.playbackRate = video_speed;
                                                   }

                    speed_button.onclick=function(){localStorage.setItem('speed',1);video_speed = localStorage.getItem('speed');video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                                                    video_elem.playbackRate = video_speed;
                                                    speed_slider.value = localStorage.getItem('speed')*25;
                                                   }
                    r.onclick=function(){
                        localStorage.setItem('sec_fwd',"");
                        localStorage.setItem('sec_sub',"");
                        v.value=""; y.value="";
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
                    w.onchange=function(){if(w.checked){localStorage.setItem('dark_mode','1');}
                                          else{localStorage.setItem('dark_mode',0);
                                               // document.querySelector("html").removeAttribute("dark");
                                               // document.querySelector('#style_type').remove();
                                              }
                                          dark_mode = localStorage.getItem('dark_mode');
                                         }
                    t.checded=english_mode; if(english_mode!=1){document.getElementById("english_mode").removeAttribute('checked');}
                    t.onchange=function(){if(t.checked){localStorage.setItem('english_mode','1');
                                                        for (const mandarin of mandarins) {
                                                            mandarin.className -= ' invisible';}
                                                        for (const english of englishs) {
                                                            english.className += ' invisible';}
                                                       }
                                          else{localStorage.setItem('english_mode',0);
                                               for (const mandarin of mandarins) {
                                                   mandarin.className += ' invisible';}
                                               for (const english of englishs) {
                                                   english.className -= ' invisible';}
                                              }
                                          english_mode = localStorage.getItem('english_mode');
                                         }

                },

                key:function(){
                    //按c开启/停止缓冲功能,按e调整视频速度
                    doc_s = window.document;
                    doc_s.onkeydown = key_down;

                    function key_down(e){
                        //document.addEventListener("keydown", function(e) {
                        //v_elem = document.querySelector("#dplayer > div.dplayer-video-wrap");
                        if (document.activeElement.id != "") {
                            return;}

                        else{
                            if (e.keyCode == 69) {//video_elem = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                                e.preventDefault();
                                if(buffer_time){
                                    temp_buffer = buffer_time;
                                    buffer_time="";
                                    current_time=0;
                                    //localStorage.setItem('buffer_time','');
                                    nvod.message_box.show("no cashing set");
                                }
                                else if(temp_buffer){buffer_time=temp_buffer;
                                                     // localStorage.setItem('buffer_time',temp_buffer);
                                                     nvod.message_box.show("cashing "+buffer_time+" seconds set");
                                                    }
                                else{nvod.message_box.show("no cashing time preset");}
                            }
                            else if(e.keyCode == 68) {
                                if(video_speed != 1){
                                    temp_speed = video_speed;
                                    video_speed=1;
                                    video_elem.playbackRate = video_speed;
                                    speed_display.innerHTML="1x";
                                    //localStorage.setItem('speed','1')
                                    nvod.message_box.show("video speed 1x set");
                                }
                                else if(temp_speed){
                                    if(localStorage.getItem('speed')!=temp_speed){video_speed=localStorage.getItem('speed');}
                                    else{video_speed=temp_speed;}
                                    video_elem.playbackRate = video_speed/1;
                                    speed_display.innerHTML=video_speed+"x";
                                    //localStorage.setItem('speed',temp_speed);
                                    nvod.message_box.show("video speed "+video_speed+"x set");
                                }
                                else{ nvod.message_box.show("no video speed preset");}

                            }
                            else if (e.keyCode == 70) {//video_elem = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                                e.preventDefault();

                                if (!document.fullscreenElement) {
                                    if(document.querySelector("#block-B > div > div.qy-flash-box").requestFullscreen){

                                        document.querySelector("#block-B > div > div.qy-flash-box").requestFullscreen(); nvod.message_box.show("full screen");
                                    }else if(document.querySelector("#block-B > div > div.qy-flash-box").webkitRequestFullScreen){

                                        document.querySelector("#block-B > div > div.qy-flash-box").webkitRequestFullScreen();
                                    }else if(document.querySelector("#block-B > div > div.qy-flash-box").mozRequestFullScreen){
                                        document.querySelector("#block-B > div > div.qy-flash-box").mozRequestFullScreen();
                                    }else{
                                        document.querySelector("#block-B > div > div.qy-flash-box").msRequestFullscreen();
                                    }

                                }
                                else{document.webkitCancelFullScreen();}

                            }
                            else if(e.keyCode == 65){
                                if(video_elem.currentTime){
                                    localStorage.setItem('sec_fwd',parseInt(video_elem.currentTime)); sec_fwd= localStorage.getItem('sec_fwd');
                                    nvod.message_box.show("设置跳过片头"+sec_fwd+"秒");
                                    v.value=sec_fwd;}
                            }
                            else if(e.keyCode == 83){
                                if(video_elem.currentTime){
                                    localStorage.setItem('sec_sub',parseInt(nvod.dura()));sec_sub = localStorage.getItem('sec_sub');
                                    nvod.message_box.show("设置跳过片尾"+sec_sub+"秒");
                                    y.value=sec_sub;}
                            }
                            else if(e.keyCode == 82){
                                if(video_elem.currentTime){
                                    localStorage.setItem('sec_fwd',"");
                                    localStorage.setItem('sec_sub',"");
                                    nvod.message_box.show("跳过片头片尾已重置");
                                    v.value=""; y.value="";}
                            }
                            doc_s.onkeydown = "";


                            setTimeout(function(){doc_s.onkeydown = key_down;},200);
                        }
                    }
                },
                wheel:function(){
                    // 滚轮前进后退

                    video_elem.onwheel = function(e){e.preventDefault()};
                    v_elem.onwheel = wheel_e;

                    function wheel_e (event) {
                        event.preventDefault();
                        video_elem = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                        v_elem = document.querySelector("#dplayer > div.dplayer-video-wrap");
                        //console.log(event.deltaY);
                        // event.deltaY = Math.min(Math.max(.125,event.deltaY), 4);
                        //console.log(wheel_sec);
                        video_elem.currentTime += (event.deltaY>0?wheel_sec/1:-wheel_sec) ;

                        v_elem.onwheel="";
                        setTimeout(function(){v_elem.onwheel= wheel_e;
                                              video_elem.onwheel = function(e){e.preventDefault()};
                                             },200);
                    }

                },
                allset:function(){


                    //vip设定
                    var a_bug = document.createElement("script");
        a_bug.innerHTML = `function getUserVip(){return 1;}
       
        curVipItem = 5;`;
        document.body.appendChild(a_bug);



                    //暂停缓存
                    //alert("allset");
                    //前跳过秒数+速度+播放质量设定
                    video_elem.oncanplay = function(){

                        if(video_speed&&video_elem){
                            video_elem.playbackRate = video_speed;}
                        // if(current_time>200){current_time=0}
                        if(sec_fwd&&(parseInt(video_elem.currentTime) < parseInt(sec_fwd))){
                            //video_elem.currentTime += 1
                            video_elem.currentTime = parseInt(sec_fwd);

                            video_elem.oncanplay = "";
                        }
                        // ;

                    }

                    video_elem.onpause = function(){
                        if(document.querySelector("#adltop")){
                            document.querySelector("#adltop").remove();}

                        if(!buffer_time||buffer_time == 0){return;}
                        if(video_elem.currentTime==video_elem.duration){current_time=0;video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";}
                        else{current_time = video_elem.currentTime;
                             video_elem.oncanplaythrough = function(){
                                 if(video_elem.currentTime==video_elem.duration){current_time=0;video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";}
                                 else{video_elem.currentTime +=2;
                                      if(sec_sub){
                                          if((video_elem.currentTime-current_time)>(buffer_time?buffer_time:0)||(video_elem.duration<(video_elem.currentTime+parseInt(sec_sub)+10)))
                                          {video_elem.currentTime = current_time;
                                           //console.log(current_time);console.log(video_elem.currentTime);
                                           video_elem.oncanplaythrough='';
                                           //current_time=0;
                                          }
                                      }
                                      else{
                                          if(current_time!=0){
                                              if((video_elem.currentTime-current_time)>(buffer_time?buffer_time:0)||(video_elem.duration<(video_elem.currentTime+10)))
                                              {video_elem.currentTime = current_time;
                                               video_elem.oncanplaythrough='';}
                                          }
                                          else{ video_elem.oncanplaythrough='';}
                                      }
                                     }
                             }
                             video_elem.currentTime += 1;
                            }
                    }


                    video_elem.onplay = function(){

                        if(parseInt(video_elem.currentTime)==parseInt(video_elem.duration-1)){
                            current_time = 0;video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";} // new
                        else if(current_time){video_elem.currentTime = current_time;
                                              video_elem.oncanplaythrough = "";
                                             }
                    }

                    video_elem.onended = function(){
                        //alert("onended");
                        //去視頻標識
                        if(document.querySelector("#adltop")){ document.querySelector("#adltop").remove();}



                        // video_elem = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                        //  v_elem = document.querySelector("#dplayer > div.dplayer-video-wrap");
                        setTimeout(function(){
                            video_elem = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                            v_elem = document.querySelector("#dplayer > div.dplayer-video-wrap");
                            nvod.allset();nvod.wheel();
                        },5000)
                        setTimeout(function(){
                            if(document.querySelector("#adltop")){ document.querySelector("#adltop").remove();}
                            if(document.querySelector("#ad")){document.querySelector("#ad").remove();}
                            if(document.querySelector("#play-btn-c")){document.querySelector("#play-btn-c").remove();}
                        },5100)
                    }


                    //每隔25秒获取播放剩余时间，如在25秒内则执行主程序
                    if(sec_sub !== ""&&sec_sub !=0){

                        setInterval(function(){
                            let left_duration = nvod.dura(),sel_part = document.querySelector("#dplayer > div.dplayer-video-wrap > video");
                            if((left_duration < sec_sub) && (left_duration !== 0) && sel_part)
                            {
                                video_elem.currentTime=video_elem.duration;
                                //setTimeout(all_set, 4000);
                            }
                            // clearInterval(auto_play);

                        }, 2000);
                    }



                },
                dura:function(){
                    //获取播放剩余时间

                    const sel_start = video_elem.currentTime;
                    const sel_fin = video_elem.duration;
                    if (sel_fin !== null) {
                        return sel_fin-sel_start;
                    }
                    return 0;
                }

               }
    //video_elem.playbackRate

    var load_menu = setInterval(function(){

        if (!window.location.href.startsWith("https://www.nivod4.tv/user")&&!window.location.href.startsWith("https://www.nivod4.tv/class")&&
            !window.location.href.startsWith("https://www.nivod4.tv/search")&&!window.location.href.startsWith("https://www.nivod4.tv/index")){
            // if (!window.location.href.startsWith("https://www.nivod.tv/user")){
            if(parseInt(localStorage.getItem('dark_mode'))&&document.querySelector("#play-btn")){
                document.querySelector("#play-btn").click();}
            if(document.querySelector("#dplayer > div.dplayer-video-wrap > video")){

                nvod.load();
                /*
//去除分享要求的遮挡
   if(document.querySelector("#copytoshareAlert")){

document.querySelector("#copytoshareAlert").remove();
   }
   */
                clearInterval(load_menu);
                nvod.key(); nvod.wheel();nvod.allset();
                if(document.querySelector("#playerContainer > div.nav-ads")){document.querySelector("#playerContainer > div.nav-ads").remove()}
                if(document.querySelector("#adSkinInner > div.ph-skin-wrap > div.nav-ads.ch-res")){document.querySelector("#adSkinInner > div.ph-skin-wrap > div.nav-ads.ch-res").remove();}
            }
            //  }
        }
        else {clearInterval(load_menu);
              if(document.querySelector("#adSkinInner > div.ph-skin-wrap > div.nav-ads.ch-res")){document.querySelector("#adSkinInner > div.ph-skin-wrap > div.nav-ads.ch-res").remove();}}
    },1500)


    //vip设定

    setTimeout(function(){
                    var a_bug1 = document.createElement("script");
        a_bug1.innerHTML = `function getUserVip(){return 1;}
       
       curVipItem = 5;`;
        document.body.appendChild(a_bug1);},10)


    })();


/*
.dplayer-bezel .dplayer-danloading{position:absolute;top:50%;margin-top:-7px;width:100%;text-align:center;font-size:14px;line-height:14px;-webkit-animation:my-face 5s ease-in-out infinite;animation:my-face 5s ease-in-out infinite}
*/