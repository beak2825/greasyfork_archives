// ==UserScript==
// @name         u-Youtube
// @name:zh-CN   功夫制霸YouTube
// @name:zh-TW   功夫製霸YouTube
// @name:en      u-Youtube
// @name:ua      u-Youtube
// @name:ja      カンフー支配YouTube
// @name:ko      쿵푸 지배YouTube
// @name:it      u-Youtube
// @name:de      u-Youtube
// @name:fr      u-Youtube
// @namespace    https://github.com/rasso1/u-Youtube
// @version      1.51
// @description  make Youtube under ur control
// @description:zh-TW make Youtube under ur control
// @description:en make Youtube under ur control
// @description:ja あなたのコントロール下でYouTubeを作る
// @description:ko 유튜브를 당신의 통제하에 두십시오
// @description:it rendi youtube sotto il tuo controllo
// @description:de Machen Sie YouTube unter Ihrer Kontrolle
// @description:fr faire de youtube sous votre contrôle
// @author       ok!
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/442317/u-Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/442317/u-Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var expand_description = 0;var subscription_up = 1;var del_promote = 1;var full_screen =0;
    var sec_sub,sec_fwd,wheel_sec,buffer_time,dark_mode,video_speed,video_quality,english_mode,comment_right,temp_buffer,temp_speed,speed_display,current_time,doc_s,icare_mode,ytplay_bezel,newVideo_check;
    var video_elem,v_elem;
    var inner_hight=window.innerHeight-parseInt(window.innerHeight/7);
    var inner_width=window.innerWidth*0.30;
    var video_left=75;
    //HTML n Script policy
    const overwrite_default = false; // If a default policy already exists, it might be best not to overwrite it, but to try and set a custom policy and use it to manually generate trusted types. Try at your own risk
    const prefix = GM_info.script.name;
    var passThroughFunc = function(string, sink){
        return string; // Anything passing through this function will be returned without change
    }
    var TTPName = "passthrough";
    var TTP_default, TTP = {createHTML: passThroughFunc, createScript: passThroughFunc, createScriptURL: passThroughFunc}; // We can use TTP.createHTML for all our assignments even if we don't need or even have Trusted Types; this should make fallbacks and polyfills easy
    var needsTrustedHTML = false;
    function doit(){
        try{
            if(typeof window.isSecureContext !== 'undefined' && window.isSecureContext){
                if (window.trustedTypes && window.trustedTypes.createPolicy){
                    needsTrustedHTML = true;
                    if(trustedTypes.defaultPolicy){
                        log("TT Default Policy exists");
                        if(overwrite_default)
                            TTP = window.trustedTypes.createPolicy("default", TTP);
                        else
                            TTP = window.trustedTypes.createPolicy(TTPName, TTP); // Is the default policy permissive enough? If it already exists, best not to overwrite it
                        TTP_default = trustedTypes.defaultPolicy;

                        log("Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '" + TTPName + "' in var 'TTP':", TTP);
                    }
                    else{
                        TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
                    }
                    log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
                }
            }
        }catch(e){
            log(e);
        }
    }
    function log(...args){
        if("undefined" != typeof(prefix) && !!prefix)
            args = [prefix + ":", ...args];
        if("undefined" != typeof(debugging) && !!debugging)
            args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
        console.log(...args);
    }
    doit();
    //end Greasy Fork Trusted-Types Helper Author Benjamin Philipp


    var youtube_hand = {
        message_box: {
            show: function(message) {
                clearTimeout(ytplay_bezel);
                document.querySelector("#container > #movie_player .ytp-bezel-text").innerHTML = message;
                document.querySelector("#container > #movie_player .ytp-bezel-text").parentNode.parentNode.style.display = "";
                document.querySelector("#container > #movie_player .ytp-bezel-text").parentNode.parentNode.classList.remove("ytp-bezel-text-hide");
                ytplay_bezel = setTimeout(youtube_hand.message_box.hide, 2500);
            },
            hide: function() {
                document.querySelector("#container > #movie_player .ytp-bezel-text").innerText = "";
                document.querySelector("#container > #movie_player .ytp-bezel-text").parentNode.parentNode.style.display = "none";
            }
        },
        dark_eye:function (){
            if(localStorage.getItem('icare_mode')==1){
                document.querySelector("html").style="font-size:13px;font-family: Roboto, Arial, sans-serif;"
            }
            else {document.querySelector("html").style="font-size:10px;font-family: Roboto, Arial, sans-serif;"}

            if(localStorage.getItem('dark_mode')==1){
                if(!document.querySelector("html").hasAttribute("dark")){
                    document.querySelector("html").setAttribute("dark",true);}
            }
            else if(document.querySelector("html").hasAttribute("dark"))
            {document.querySelector("html").removeAttribute("dark")}
            if(localStorage.getItem("comment_right")==1&&document.querySelector("#columns #primary #primary-inner #sections")&&document.querySelector("#secondary #secondary-inner")&&!document.fullscreenElement){
                //获取视频当前x分辨率，以决定画面放大大小
                function getYoutubeViewport() {
                    const videoElement = document.querySelector('.video-stream.html5-main-video');
                    if (videoElement) {
                        const rect = videoElement.getBoundingClientRect();
                        const viewportWidth = Math.round(rect.width);
                        const viewportHeight = Math.round(rect.height);
                        console.log(`实时 Viewport: ${viewportWidth} x ${viewportHeight}`);
                        return { width: viewportWidth, height: viewportHeight };
                    }
                };
                if(getYoutubeViewport().width<1400){
                    inner_width=window.innerWidth*0.30;
                    video_left=75
                }
                else{ inner_width=window.innerWidth*0.24;
                     video_left=16
                    }


                //视频整体左移
                const element =document.querySelector("#columns");if (element) {
                    // 1. 确保元素有定位上下文，通常设置为 'relative' 或 'absolute'
                    // 如果元素本身已经在 CSS 中设置了 position: absolute; 或 fixed; 则无需这行
                    if (element.style.position === '' || element.style.position === 'static') {
                        element.style.position = 'relative';
                    }

                    // 2. 获取当前的 left 值，并加上 200px
                    // 如果之前没有设置过 left，parseInt会得到NaN，所以需要默认值0
                    const currentLeft = parseInt(element.style.left) || 0;
                    element.style.left = (currentLeft - video_left) + 'px';

                    console.log('元素已向右移动 200px。当前 left:', element.style.left);
                } else {
                    console.error('未找到 ID 为 "myElement" 的元素。');
                }

                //评论右上移
                document.querySelector("#columns #primary #primary-inner #sections").style="width:"+inner_width+"px;height:"+inner_hight+"px;overflow-y:auto";
                document.querySelector("#columns #primary #primary-inner #sections").classList.add('standardized-themed-scrollbar');
                // document.querySelector("#columns #primary #primary-inner #sections")
                document.querySelector("#secondary #secondary-inner").append(document.querySelector("#columns #primary #primary-inner #sections"));
                document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").onscroll=function(){
                    document.querySelector("body").style.overflow="hidden";
                }
                document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").onpointerleave=function(){
                    document.querySelector("body").style.overflow="";
                }
                /*
                document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").onscroll=function(){
                   let comment_height= parseInt(document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").style.height);
                    comment_height+=1;
                    document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").style.height = comment_height+"px";
                    document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").style.float="right";
                };
*/
                //related 左下移
                document.querySelector("#columns #primary #primary-inner").append(document.querySelector("#secondary #secondary-inner #related"));


                // 监听全屏事件
                document.addEventListener("fullscreenchange", function () {
                    if(localStorage.getItem("comment_right")==1){
                        if (document.fullscreenElement) {
                            // 视频进入全屏
                            document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").style="width:auto;height:"+window.innerHeight*1+"px;overflow-y:auto";
                            //评论左下移
                            //localStorage.setItem('comment_right',0);
                            /*
                            document.querySelector("#columns #primary #primary-inner").append(document.querySelector("#secondary #secondary-inner #sections"));
                            //related 右上移
                            document.querySelector("#secondary #secondary-inner").append(document.querySelector("#related"));
                            document.querySelector("#secondary #secondary-inner #sections").remove();
                            document.querySelector("#columns #primary #primary-inner #sections").style="width:"+window.innerWidth*0.60+"px;height:"+window.innerHeight*1+"px;overflow-y:auto";
                          document.querySelector("#columns #primary #primary-inner #sections").classList.add('standardized-themed-scrollbar');
  */
                            //localStorage.setItem('comment_right',1);
                        } else {
                            // 视频退出全屏
                            document.querySelector("#page-manager  #columns > #secondary > #secondary-inner > #sections").style="width:"+inner_width+"px;height:"+inner_hight+"px;overflow-y:auto";

                            // if(document.getElementById("comment_to").checded==1){
                            //	localStorage.setItem('comment_right',1);}
                        }
                    }
                });

            }
            // else if(document.querySelector("yt-live-chat-app")){document.querySelector("#secondary #secondary-inner").append(document.querySelector("yt-live-chat-app"))}
        },
        dark_eye1:function (){
            if(localStorage.getItem('dark_mode')==1){
                var style_type = document.createElement("style");style_type.id = "style_type";
                style_type.innerHTML = `#end > div.dropdown-hover > div{font-size:12px;color:#bbb !important;background-color:#202020 !important;}
#end > div.dropdown-hover > button{background-color:#222 !important;} #end > div.dropdown-hover path{fill:transparent !important;stroke:white !important;}
#end > div.dropdown-hover > div > div{color:#aaa !important;background-color:#202020 !important;}
#end > div.dropdown-hover > div > div p{font-size:12px;color:#bbb !important;background-color:#202020 !important;}
.dropdown-hover button div{font-size:12px;color:#aaa !important;background-color:#333 !important;}
#sec_sub,#sec_fwd,#wheel_sec,#buffer_time{font-size:12px;color:#bbb !important;background-color:#333 !important;border-radius:5px;}`;
                document.head.appendChild(style_type);
            }
        },

        //播放设置
        play_menu:function(){
            /*
const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
  createHTML: (string) => string.replace(/</g, "&lt;"),
});
        const escaped = escapeHTMLPolicy.createHTML(`<button style="border:none;outline:none;background-color:#fff;height:37px;width:37px;margin-right:10px;" aria-label="缓存/速度设置"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon">
       <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="transparent" stroke="black"></path>
      </g></svg>
</button>

<div style="background:#fff;border-radius: 10px;left: -160px;right: 0;margin-left: 0;margin-right: -100px;padding-top: 10px;" class="dropdown-box fadeInDown"><div class="item clearfix" style="border-radius:10px;"><p style="margin:10px auto;font-size:18px;"><span class="mandarin invisible">播放设置&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">Playback Setting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font size=2>Chs </font><input style="margin:auto" id="english_mode" class="switch switch-anim" type="checkbox" checked></p>
<div  style="margin:10px auto;font-size:12px;"><hr /><hr /></div>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible" style="margin:10px auto;font-size:16px;">当前速度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">current speed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span id="speed_display"></span></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">选择播放速度:&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">specify spee<font color=#5bb7fe>d</font>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><button id="speed_button" style="background-color: #5bb7fe;border-radius:5px;color:white;font-size:12px;"> &nbsp; 1x&nbsp; </button></p><input type="range" min="0" max="100" value="25" class="slider" id="speed_slider"><br /><br />
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">跳过片头秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">skip the title:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="sec_fwd" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color:#fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds">
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">跳过片尾秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">skip the end:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="sec_sub" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">鼠标滚动秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">mouse scroll:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="wheel_sec" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">暂停缓存秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">paus<font color=#5bb7fe>e</font> n cashing:&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="buffer_time" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
  <p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">播放质量：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>  <span class="english">specify resolution&nbsp;</span> <select id="video_quality" style="border-radius:5px;"><option value="auto">auto</option><option value="hd2160">4K 2160p</option><option value="hd1440">HD 1440p</option><option value="hd1080">HD 1080p</option><option value="hd720">720p</option> <option value="large">480p</option><option value="medium">360p</option><option value="small">240p</option><option value="tiny">144p</option> </select></p>
<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">评论载右:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">comments to right:&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="comment_to" class="switch switch-anim" type="checkbox" checked></p>
<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">眼保模式 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">iCare mode:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="icare_mode" class="switch switch-anim" type="checkbox" checked></p>
<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">暗夜模式 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">dark mode:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="dark_mode" class="switch switch-anim" type="checkbox" checked></p>
</div></div>

<style>#speed_slider {width: 175px;}.invisible {display: none;}.ytd-feed-filter-chip-bar-renderer.style-scope{z-index:999 !important;}.fadeInDown{-webkit-animation:fadeInDown .5s .2s ease both;-moz-animation:fadeInDown .5s .2s ease both}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translateY(-10px)}100%{opacity:1;-webkit-transform:translateY(0)}}@-moz-keyframes fadeInDown{0%{opacity:0;-moz-transform:translateY(-10px)}100%{opacity:1;-moz-transform:translateY(0)}}.dropdown{position:relative}.dropdown-box{display:none;position:absolute;z-index:999999999}.dropdown-box.top{bottom:100%;padding-bottom:10px;left:50%;margin-left:-80px}.dropdown-box.bottom{top:100%;padding-top:10px;left:50%;margin-left:-80px}.dropdown-box.left{left:100%;padding-left:10px;bottom:0}.dropdown-box.right{right:100%;padding-right:10px;bottom:0}.dropdown-box .item{padding:10px;width:250px;border-radius:2px}.dropdown-hover{position:relative}.dropdown-hover:hover .dropdown-box{display:block}</style>
<style>a {color: #670000;}.switch {width: 26px;height: 13px;position: relative;border: 1px solid #dfdfdf;background-color: #fdfdfd;box-shadow: #dfdfdf 0 0 0 0 inset; border-radius: 18px;background-clip: content-box;display: inline-block;-webkit-appearance: none;user-select: none;outline: none;} .switch:before { content: '';width: 13px;height: 13px;position: absolute;top: 0;left: 0;border-radius: 12px;background-color: #fff;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);}.switch:checked {border-color: #5bb7fe;box-shadow: #5bb7fe 0 0 0 16px inset;background-color: #5bb7fe;}.switch:checked:before {left: 15px;}.switch.switch-anim {transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;}.switch.switch-anim:before {transition: left 0.3s;}.switch.switch-anim:checked {box-shadow: #5bb7fe 0 0 0 14px inset;background-color: #5bb7fe;transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;}.switch.switch-anim:checked:before {transition: left 0.3s;}.text-red {color: #aaa;}</style>
<style>.standardized-themed-scrollbar::-webkit-scrollbar {
    width: 1em;
}
 .standardized-themed-scrollbar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
 .standardized-themed-scrollbar::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  height: 56px;border-radius: 10px;border: 4px solid transparent;background-clip: content-box;
}</style>`);
*/

            //      const policy = trustedTypes.createPolicy('default',{createHTML: (string) => string});

            // Use the policy to assign HTML safely
            // const unsafeHtml = "<img>";
            //const safeHtml = policy.createHTML(unsafeHtml);
            //document.querySelector("#placeholder").innerHTML = safeHtml;

            /*
const policy = trustedTypes.createPolicy('default', {
    createHTML: (string) => string
  });

  // Use the policy to assign HTML safely
  const unsafeHtml = "<img>";
  const safeHtml = policy.createHTML(unsafeHtml);
document.querySelector("#title").innerHTML = safeHtml;
*/




            var html_app = document.createElement("div");

            //       html_app.innerHTML =escaped;       const unsafeHtml =`
            html_app.innerHTML =`
   <button style="border:none;outline:none;background-color:#fff;height:37px;width:37px;margin-right:10px;" aria-label="缓存/速度设置"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon">
       <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="transparent" stroke="black"></path>
      </g></svg>
</button>

<div style="background:#fff;border-radius: 10px;left: -160px;right: 0;margin-left: 0;margin-right: -100px;padding-top: 10px;" class="dropdown-box fadeInDown"><div class="item clearfix" style="border-radius:10px;"><p style="margin:10px auto;font-size:18px;"><span class="mandarin invisible">播放设置&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">Playback Setting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><font size=2>Chs </font><input style="margin:auto" id="english_mode" class="switch switch-anim" type="checkbox" checked></p>
<div  style="margin:10px auto;font-size:12px;"><hr /><hr /></div>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible" style="margin:10px auto;font-size:16px;">当前速度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">current speed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span id="speed_display"></span></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">选择播放速度:&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="english">specify spee<font color=#5bb7fe>d</font>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><button id="speed_button" style="background-color: #5bb7fe;border-radius:5px;color:white;font-size:12px;"> &nbsp; 1x&nbsp; </button></p><input type="range" min="0" max="100" value="25" class="slider" id="speed_slider"><br /><br />
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">跳过片头秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">skip the title:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="sec_fwd" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color:#fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds">
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">跳过片尾秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">skip the end:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="sec_sub" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">鼠标滚动秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">mouse scroll:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="wheel_sec" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
<p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">暂停缓存秒数：&nbsp;&nbsp;&nbsp;</span><span class="english">paus<font color=#5bb7fe>e</font> n cashing:&nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" id="buffer_time" style="width:40px;height:12px;vertical-align: middle;padding: 5px;background-color: #fff;border: 2px solid #ddd;border-radius:5px;font-size:12px;" placeholder="seconds"></p>
  <p style="margin:10px auto;font-size:16px;"><span class="mandarin invisible">播放质量：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>  <span class="english">specify resolution&nbsp;</span> <select id="video_quality" style="border-radius:5px;"><option value="auto">auto</option><option value="hd2160">4K 2160p</option><option value="hd1440">HD 1440p</option><option value="hd1080">HD 1080p</option><option value="hd720">720p</option> <option value="large">480p</option><option value="medium">360p</option><option value="small">240p</option><option value="tiny">144p</option> </select></p>
<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">评论载右:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">comments to right:&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="comment_to" class="switch switch-anim" type="checkbox" checked></p>
<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">眼保模式 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">iCare mode:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="icare_mode" class="switch switch-anim" type="checkbox" checked></p>
<p style="margin:10px auto 20px auto;font-size:16px;"><span class="mandarin invisible">暗夜模式 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span class="english">dark mode:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="margin:auto" id="dark_mode" class="switch switch-anim" type="checkbox" checked></p>
</div></div>

<style>#speed_slider {width: 175px;}.invisible {display: none;}.ytd-feed-filter-chip-bar-renderer.style-scope{z-index:999 !important;}.fadeInDown{-webkit-animation:fadeInDown .5s .2s ease both;-moz-animation:fadeInDown .5s .2s ease both}@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translateY(-10px)}100%{opacity:1;-webkit-transform:translateY(0)}}@-moz-keyframes fadeInDown{0%{opacity:0;-moz-transform:translateY(-10px)}100%{opacity:1;-moz-transform:translateY(0)}}.dropdown{position:relative}.dropdown-box{display:none;position:absolute;z-index:999999999}.dropdown-box.top{bottom:100%;padding-bottom:10px;left:50%;margin-left:-80px}.dropdown-box.bottom{top:100%;padding-top:10px;left:50%;margin-left:-80px}.dropdown-box.left{left:100%;padding-left:10px;bottom:0}.dropdown-box.right{right:100%;padding-right:10px;bottom:0}.dropdown-box .item{padding:10px;width:250px;border-radius:2px}.dropdown-hover{position:relative}.dropdown-hover:hover .dropdown-box{display:block}</style>
<style>a {color: #670000;}.switch {width: 26px;height: 13px;position: relative;border: 1px solid #dfdfdf;background-color: #fdfdfd;box-shadow: #dfdfdf 0 0 0 0 inset; border-radius: 18px;background-clip: content-box;display: inline-block;-webkit-appearance: none;user-select: none;outline: none;} .switch:before { content: '';width: 13px;height: 13px;position: absolute;top: 0;left: 0;border-radius: 12px;background-color: #fff;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);}.switch:checked {border-color: #5bb7fe;box-shadow: #5bb7fe 0 0 0 16px inset;background-color: #5bb7fe;}.switch:checked:before {left: 15px;}.switch.switch-anim {transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;}.switch.switch-anim:before {transition: left 0.3s;}.switch.switch-anim:checked {box-shadow: #5bb7fe 0 0 0 14px inset;background-color: #5bb7fe;transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;}.switch.switch-anim:checked:before {transition: left 0.3s;}.text-red {color: #aaa;}</style>
<style>.standardized-themed-scrollbar::-webkit-scrollbar {
    width: 1em;
}
 .standardized-themed-scrollbar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
 .standardized-themed-scrollbar::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  height: 56px;border-radius: 10px;border: 4px solid transparent;background-clip: content-box;
}</style>
`;

            //       const safeHtml = DOMPurify.sanitize(unsafeHtml);
            //  const safeHtml = policy.createHTML(unsafeHtml);
            //        safeHtml.classList.add('dropdown-hover');
            //document.querySelector("#placeholder").innerHTML = safeHtml;
            //document.querySelector("#end").appendChild(safeHtml);
            html_app.classList.add('dropdown-hover');
            document.querySelector("#end").appendChild(html_app);

            //
            var speed_slider=document.getElementById("speed_slider"),speed_button=document.getElementById("speed_button"),
                y=document.getElementById("sec_sub"),z=document.getElementById("wheel_sec"),x=document.getElementById("buffer_time"),w=document.getElementById("dark_mode"),
                s=document.getElementById("video_quality"),v=document.getElementById("sec_fwd"),t=document.getElementById("english_mode"),c=document.getElementById("comment_to"),iii=document.getElementById("icare_mode");
            dark_mode = localStorage.getItem('dark_mode');comment_right = localStorage.getItem('comment_right');icare_mode = localStorage.getItem('icare_mode');
            var english_mode = localStorage.getItem('english_mode');
            speed_display=document.getElementById("speed_display");
            const mandarins = document.querySelectorAll('.mandarin');const englishs = document.querySelectorAll('.english');


            video_speed = localStorage.getItem('speed');sec_fwd = localStorage.getItem('sec_fwd');sec_sub = localStorage.getItem('sec_sub');
            wheel_sec = localStorage.getItem('wheel_sec');buffer_time = localStorage.getItem('buffer_time');
            video_quality = localStorage.getItem('video_quality')?localStorage.getItem('video_quality'):"auto";

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
                if(video_speed&&document.querySelector('#movie_player'))
                    document.querySelector("#movie_player > div.html5-video-container > video").playbackRate = video_speed;},4000);

            speed_slider.value = localStorage.getItem('speed')*25;

            speed_slider.oninput=function(){localStorage.setItem('speed',this.value/25);video_speed = localStorage.getItem('speed');video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                                            document.querySelector("#movie_player > div.html5-video-container > video").playbackRate = video_speed;
                                           }

            speed_button.onclick=function(){localStorage.setItem('speed',1);video_speed = localStorage.getItem('speed');video_speed?speed_display.innerHTML=video_speed+"x":speed_display.innerHTML="1x";
                                            document.querySelector("#movie_player > div.html5-video-container > video").playbackRate = video_speed;
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
            c.checded=comment_right; if(comment_right!=1){document.getElementById("comment_to").removeAttribute('checked');}
            c.onchange=function(){if(c.checked){localStorage.setItem('comment_right','1');youtube_hand.dark_eye();}
                                  else{localStorage.setItem('comment_right',0);
                                       //评论右上移

                                       document.querySelector("#columns #primary #primary-inner").append(document.querySelector("#secondary #secondary-inner #sections"));
                                       //related 左下移
                                       document.querySelector("#secondary #secondary-inner").append(document.querySelector("#related"));
                                       document.querySelector("#secondary #secondary-inner #sections").remove();

                                      }
                                  comment_right = localStorage.getItem('comment_right');
                                 }

            iii.checded=icare_mode; if(icare_mode!=1){document.getElementById("icare_mode").removeAttribute('checked');}
            iii.onchange=function(){if(iii.checked){localStorage.setItem('icare_mode','1');}
                                    else{localStorage.setItem('icare_mode',0);
                                        }
                                    icare_mode = localStorage.getItem('icare_mode');
                                   }

            w.checded=dark_mode; if(dark_mode!=1){document.getElementById("dark_mode").removeAttribute('checked');}
            w.onchange=function(){if(w.checked){localStorage.setItem('dark_mode','1');youtube_hand.dark_eye();youtube_hand.dark_eye1();}
                                  else{localStorage.setItem('dark_mode',0);
                                       document.querySelector("html").removeAttribute("dark");
                                       document.querySelector('#style_type').remove();
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

            if(video_quality){
                for(var i=0;i<s.length;i++){
                    if(s.options[i].value==video_quality){
                        s.options[i].selected=true;
                    }
                }
            }
            s.onchange=function (){
                var quality_value = s[s.selectedIndex].getAttribute("value");
                localStorage.setItem('video_quality',quality_value);
                video_quality = localStorage.getItem('video_quality');
                var avail_quali;var v_elem = document.querySelector("#movie_player");
                if((avail_quali = v_elem.getAvailableQualityLevels())&&avail_quali.indexOf(video_quality) == -1){
                    v_elem.setPlaybackQualityRange(avail_quali[0],avail_quali[0]);
                }
                else{v_elem.setPlaybackQualityRange(video_quality,video_quality);}
            }

        },

        play_main:function (){

            sec_fwd = localStorage.getItem('sec_fwd');
            sec_sub = localStorage.getItem('sec_sub');
            wheel_sec = localStorage.getItem('wheel_sec');
            buffer_time = localStorage.getItem('buffer_time');

            var video_speed = localStorage.getItem('speed');




            //每3秒试执行主应用操作
            var main_timer = setInterval(function () {
                video_elem = document.querySelector("#movie_player > div.html5-video-container > video");
                v_elem = document.querySelector("#movie_player");

                if (video_elem){
                    newVideo_check=document.querySelector("#movie_player > div.html5-video-container > video").duration;
                    main_opr();
                    let videoText_check1 = setInterval(function(){
                        if(document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                            //video_elem.currentTime=0;
                            video_speed = localStorage.getItem('speed');
                            if(buffer_time&&document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>cashe "+buffer_time+" seconds</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                            }
                            else if(document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>no cashe</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                            }
                            clearInterval(videoText_check1);
                            //    alert("change display");

                        }

                    }
                                                       ,1000)
                    video_elem.onloadeddata = function (){
                        //22-11-29
                        //newVideo_check = document.querySelector("#movie_player > div.html5-video-info-panel > div > div:nth-child(1) > span").innerText;
                        // alert("load");
                        let videoload_check = setInterval(function(){
                            //删除全屏时顶部文字
                            if(document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title > div")){
                                document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title > div").remove();
                            }

                            //5秒后自动全屏
                            if (!document.fullscreenElement&&full_screen){
                                setTimeout(function(){
                                    if (!document.fullscreenElement){
                                        document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").click();
                                        // document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").remove()

                                        full_screen=1;
                                    }


                                },5000)
                            }

                            if(newVideo_check){
                                //youtube_hand.message_box.show("onload2");
                                clearInterval(videoload_check);}
                            else if(newVideo_check=document.querySelector("#movie_player > div.html5-video-container > video").duration){
                                main_opr();



                                //youtube_hand.message_box.show("onload1");
                                setTimeout(function(){
                                    if(buffer_time&&document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                        youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>cashe "+buffer_time+" seconds</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                                    }
                                    //document.querySelector("#info-text > #info-strings > yt-formatted-string").innerText
                                    else if(document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                        youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>no cashe</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                                    }
                                    //   alert("load display");
                                },4000)
                                setTimeout(function(){video_elem.onloadeddata = "";},3000)

                                clearInterval(videoload_check);
                            }},1000);


                    }

                    video_elem.ondurationchange = function(){
                        //删除全屏时顶部文字
                        if(document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title > div")){
                            document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title > div").remove();
                        }

                        //5秒后自动全屏
                        if (!document.fullscreenElement&&full_screen){
                            setTimeout(function(){
                                if (!document.fullscreenElement){
                                    document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").click();
                                    // document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").remove()

                                    full_screen=1;

                                }
                            },5000)
                        }

                        //alert("change");
                        // if(newVideo_check == document.querySelector("#movie_player > div.html5-video-info-panel > div > div:nth-child(1) > span").innerText){}
                        if(!newVideo_check){
                            newVideo_check=document.querySelector("#movie_player > div.html5-video-container > video").duration;
                            //   alert("in");
                            let videoText_check = setInterval(function(){
                                if(document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                    //video_elem.currentTime=0;
                                    video_speed = localStorage.getItem('speed');
                                    if(buffer_time&&document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                        youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>cashe "+buffer_time+" seconds</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                                    }
                                    else if(document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                        youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>no cashe</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                                    }


                                    clearInterval(videoText_check);

                                }

                            }
                                                              ,1000)
                            main_opr();//youtube_hand.message_box.show("change");
                        }
                        else if(newVideo_check&&newVideo_check==document.querySelector("#movie_player > div.html5-video-container > video").duration){
                            // alert("out");
                        }
                        else { video_elem.currentTime=0;
                              setTimeout(function(){
                                  //  alert("out in");

                                  video_speed = localStorage.getItem('speed');
                                  if(buffer_time&&document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                      youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>cashe "+buffer_time+" seconds</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                                  }
                                  else if(document.querySelector("#info-text > #info-strings > yt-formatted-string")){
                                      youtube_hand.message_box.show("<div>video speed "+video_speed+"x</div><div>no cashe</div><div>"+document.querySelector("#info-strings > yt-formatted-string").innerText+" & "+document.querySelector("#count > ytd-video-view-count-renderer > span.view-count.style-scope.ytd-video-view-count-renderer").innerText+"</div>");
                                  }


                              },3000)
                              main_opr();
                             }



                    }

                    clearInterval(main_timer);}
            },50)

            //主应用操作
            function main_opr() {
                doc_s = window.document;
                //视频质量选择

                var avail_quali;var current_time;
                if((avail_quali = v_elem.getAvailableQualityLevels())&&avail_quali.indexOf(video_quality) == -1){
                    v_elem.setPlaybackQualityRange(avail_quali[0],avail_quali[0]);
                }
                else if(video_quality=="auto"){}
                else if(video_quality){v_elem.setPlaybackQualityRange(video_quality,video_quality);}
                //点开视频介绍
                setTimeout(function(){
                    if(expand_description){

                        if(document.getElementById("action-panel-details")) {
                            document.getElementById("action-panel-details").classList.remove("yt-uix-expander-collapsed");
                        }

                        if(document.querySelector("#more > .more-button.style-scope.ytd-video-secondary-info-renderer")) {
                            document.querySelector("#more > .more-button.style-scope.ytd-video-secondary-info-renderer").click();
                        }
                        if(document.querySelector("#expand")){
                            document.querySelector("#expand").click();
                        }
                    }
                },5000);



                //前跳过秒数+速度+播放质量设定
                video_elem.oncanplay = function(){

                    if(video_speed&&video_elem){
                        video_elem.playbackRate = video_speed;
                    }
                    // if(current_time>200){current_time=0}
                    if(sec_fwd&&(video_elem.currentTime < sec_fwd/1)&&(document.querySelector("#title > h1 > yt-formatted-string").innerText.includes("袁色")||document.querySelector("#title > h1 > yt-formatted-string").innerText.includes("袁腾飞")||document.querySelector("#title > h1 > yt-formatted-string").innerText.includes("会员翻牌"))){
                        video_elem.currentTime += sec_fwd/1;
                        video_elem.oncanplay = "";
                    }
                    // video_elem.currentTime += 1;

                }

                //暂停缓存

                sec_sub = localStorage.getItem('sec_sub');
                video_elem.onpause = function(){
                    if(document.querySelector("body > tp-yt-iron-overlay-backdrop")){
                        document.querySelector("body > tp-yt-iron-overlay-backdrop").remove();
                        if(document.querySelector("body > ytd-app > ytd-popup-container > tp-yt-paper-dialog")){
                            document.querySelector("body > ytd-app > ytd-popup-container > tp-yt-paper-dialog").remove();

                        }
                        video_elem.play();
                        //document.querySelector("#movie_player > div.html5-video-container > video").play();



                    }




                    //youtube_hand.message_box.show('<div>'+document.querySelector("#header-author yt-formatted-string > a").innerText+'</div>');
                    if(!buffer_time||buffer_time == 0){return;}
                    if(parseInt(video_elem.currentTime)==parseInt(video_elem.duration)){current_time=0;video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";}
                    else{current_time = parseInt(video_elem.currentTime);
                         video_elem.oncanplaythrough = function(){
                             if(parseInt(video_elem.currentTime)==parseInt(video_elem.duration)){current_time=0;video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";}
                             else{video_elem.currentTime +=1;
                                  if(sec_sub){
                                      if((video_elem.currentTime-current_time)>(buffer_time?buffer_time:0)||(video_elem.duration<(video_elem.currentTime+parseInt(sec_sub)+10)))
                                      {video_elem.currentTime = current_time;
                                       //console.log(current_time);console.log(video_elem.currentTime);
                                       video_elem.oncanplaythrough='';current_time=0;}
                                  }
                                  else{
                                      if(current_time!=0){
                                          if((video_elem.currentTime-current_time)>(buffer_time?buffer_time:0)||(video_elem.duration<(video_elem.currentTime+20)))
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
                        current_time = 0;
                        video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";} // new
                    else if(current_time){video_elem.currentTime = current_time;
                                          video_elem.oncanplaythrough = "";
                                         }
                }
                video_elem.onended = function(){current_time = "";video_elem.onpause = "";video_elem.onplay = "";video_elem.oncanplaythrough ="";
                                               }
                //中键全屏

                video_elem.addEventListener("mouseup", function(e) {
                    e.preventDefault();
                    if(e.button==1){
                        document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").click();
                    }
                }, false);
                //按c开启/停止缓冲功能,按e调整视频速度
                doc_s.onkeydown = key_down;

                function key_down(e){
                    //document.addEventListener("keydown", function(e) {

                    if (document.activeElement.id != "" && document.activeElement.id != "movie_player") {
                        return;}

                    else{
                        if (e.keyCode == 69) {
                            e.preventDefault();
                            if(buffer_time){
                                temp_buffer = buffer_time;
                                buffer_time="";
                                current_time=0;
                                //localStorage.setItem('buffer_time','');
                                youtube_hand.message_box.show("no cashing set");
                            }
                            else if(temp_buffer){buffer_time=temp_buffer;
                                                 // localStorage.setItem('buffer_time',temp_buffer);
                                                 youtube_hand.message_box.show("cashing "+buffer_time+" seconds set");
                                                }
                            else{youtube_hand.message_box.show("no cashing time preset");}
                        }
                        else if(e.keyCode == 68) {
                            if(video_speed != 1){
                                temp_speed = video_speed;
                                video_speed=1;
                                video_elem.playbackRate = video_speed;
                                speed_display.innerHTML="1x";
                                //localStorage.setItem('speed','1')
                                youtube_hand.message_box.show("video speed 1x set");
                            }
                            else if(temp_speed){
                                if(localStorage.getItem('speed')!=temp_speed){video_speed=localStorage.getItem('speed');}
                                else{video_speed=temp_speed;}
                                video_elem.playbackRate = video_speed/1;
                                speed_display.innerHTML=video_speed+"x";
                                //localStorage.setItem('speed',temp_speed);
                                youtube_hand.message_box.show("video speed "+video_speed+"x set");
                            }
                            else{ youtube_hand.message_box.show("no video speed preset");}

                        }
                        doc_s.onkeydown = "";
                        setTimeout(function(){doc_s.onkeydown = key_down;},200);
                    }
                }
                /*
                // 滚轮前进后退
                video_elem.onwheel = function(e){e.preventDefault()};
                v_elem.onwheel = wheel_e;
                event.preventDefault();
                event.stopImmediatePropagation();
                function wheel_e (event) {
                    if(wheel_sec){
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        video_elem.currentTime += parseInt(event.deltaY>0?wheel_sec/1:-wheel_sec) ;

                        v_elem.onwheel="";
                        setTimeout(function(){v_elem.onwheel= wheel_e;
                                              video_elem.onwheel = function(e){e.preventDefault()};
                                             },300);

                        //同时重设播放速度
                         video_speed = localStorage.getItem('speed');
                         document.querySelector("#movie_player > div.html5-video-container > video").playbackRate = video_speed;
                    }
                }

                */

                // 滚轮前进后退
                // 1. 定义核心处理函数
                function wheel_handler(event) {
                    // 核心：强制阻止浏览器和 YouTube 原生的滚动/音量行为
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    // 执行进度跳转（向下滚动 deltaY > 0 为后退，向上为前进）
                    //const direction = event.deltaY > 0 ? -1 : 1;
                    video_elem.currentTime += parseInt(event.deltaY>0?wheel_sec/1:-wheel_sec);

                    // 同时重设播放速度，从 localStorage 读取速度，
                    video_speed = localStorage.getItem('speed') ;
                    video_elem.playbackRate = parseFloat(video_speed);

                }

                // 2. 使用捕获模式并禁用 passive
                // capture: true 确保我们的代码在 YouTube 官方脚本之前执行
                // passive: false 允许我们成功调用 preventDefault() 来阻止页面滚动
               video_elem.addEventListener('wheel', wheel_handler, {
                    passive: false,
                    capture: true
                });


                //每隔25秒获取播放剩余时间，如在25秒内则执行主程序
                if(sec_sub !== ""&&sec_sub !=0){
                    const sec_sub2=sec_sub/1+12;
                    setInterval(function(){
                        let left_duration = get_dura();
                        if((left_duration < sec_sub) && (left_duration != 0))
                        {

                            next_exec();

                        }
                    }, 1000);
                }

                //next part 执行
                function next_exec(){
                    const sel_part2 = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button");
                    if (sel_part2)
                    {
                        //console.log("clicked next---");
                        sel_part2.click();
                        // video_elem.currentTime=0;
                        current_time=0;}
                }

                //获取播放剩余时间
                function get_dura() {
                    const sel_start = video_elem.currentTime;
                    const sel_fin = video_elem.duration;
                    if (sel_fin) {
                        return sel_fin-sel_start;
                    }
                    return 0;
                }




            }

        },

        move_menu:function (){
            //点开显示其余items
            document.querySelector("#sections > ytd-guide-section-renderer:nth-child(2) > #items > ytd-guide-collapsible-entry-renderer > #expander-item > #endpoint").click();
            //移动频道到左顶部
            document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1)").parentNode.append(document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1)"))




            /*

 // Create a Trusted Type policy
        const scriptPolicy = trustedTypes.createPolicy('true', {
            createScript: (scriptContent) => scriptContent
        });

        // Use the policy to safely assign a script
        const scriptContent = "console.log('This is a trusted script');";
        const trustedScript = scriptPolicy.createScript(scriptContent);

        // Create a script element
        const scriptElement = document.createElement('script');
        scriptElement.textContent = trustedScript;
        document.head.appendChild(scriptElement);
*/

            //页面写入script和style
            var a_bug = document.createElement("script");
            a_bug.innerHTML = `// 监听draggable的相关事件
function dragstart_handler(ev) {
   //console.log("dragStart");
   document.querySelector("#"+ev.target.id).style="margin-top: 25px !important;";
 // Add the target element's id to the data transfer object
 ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.setData("text1", ev.target);
 //console.log(ev.dataTransfer.getData("text1"));
 ev.dataTransfer.dropEffect = "move";
 //console.log(ev.target.id);

}
function dragEnter(ev) {
//console.log("dragenter");
  ev.preventDefault();
  ev.target.className += ' drag-over';
}
function dragLeave(e) {
 ev.preventDefault();
  this.className = 'droppable';
}
function dragover_handler(ev) {
 ev.preventDefault();
 //ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
 ev.preventDefault();
 // Get the id of the target and add the moved element to the target's DOM
 var data = ev.dataTransfer.getData("text");
 var first=ev.target.firstChild; //得到第一个元素
ev.target.insertBefore(document.getElementById(data),first); //在第原来的第一个元素之前插入
 //ev.target.appendChild(document.getElementById(data));
}
function dragend_handler(ev) {
 // console.log("dragEnd");
  // Remove all of the drag data
  ev.dataTransfer.clearData();
  //localStorage.setItem("itemstate",document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) #items").outerHTML);

   //itemdetail写入localStorage
        var json = [];
var data = {};
var items_length=document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer").length
for(var i=0;i<items_length-1;i++){
data = {};
//data.id = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer")[i].id;
//data.imgsrc = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer #img")[i].src;
data.text =document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer")[i].innerText;
//data.href = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer > #endpoint")[i].href;

json.push(data);

}
var jsonString = JSON.stringify(json);//[{"id":1,"imgsrc":"test1","text":2}]
localStorage.setItem("itemdetail",jsonString);
 //localStorage.setItem("item_new","");
}
function noAllowDrop(ev) {
//console.log("stopPropagation");
        ev.stopPropagation();
    }


   //点击订阅或退订时,删除localStorage内已有相同item
  if(document.querySelector("#inner-header-container #subscribe-button")){var subscribe_button = document.querySelector("#inner-header-container #subscribe-button")}
  else if(document.querySelector("#meta-contents #top-row > #subscribe-button")){var subscribe_button = document.querySelector("#meta-contents #top-row > #subscribe-button");}
  // var subscribe_button = document.querySelector("#inner-header-container #subscribe-button")?document.querySelector("#inner-header-container #subscribe-button"):document.querySelector("#meta-contents #top-row > #subscribe-button");

      if(subscribe_button){

   subscribe_button.onclick=function(){

   //localStorage.setItem("item_new",document.querySelector("#text > a").innerText);
   //localStorage.removeItem("itemdetail",document.querySelector("#channel-name #text").innerText);
   let obj = JSON.parse(localStorage.itemdetail);
   for(let j=obj.length-1;j>-1;j--){
   if(obj[j]&&obj[j].text==document.querySelector("#channel-name #text").innerText){
        let items_down = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer");

                        items_down.forEach(function(element,index,array) {

                            if(element.firstElementChild.title==document.querySelector("#channel-name #text").innerText){

                                document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) #items").append(element);
                                return false;
                            }
                        })

   delete obj[j];}
   }
   localStorage.setItem("itemdetail",JSON.stringify(obj));
  // console.log("delete suc");
}
    }

`;
            document.body.appendChild(a_bug);

            var style_type2 = document.createElement("style");style_type2.id = "style_type";
            style_type2.innerHTML = `#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer{margin: 1em 0em 1em 0em !important;}
.drag-over {
  border-style: dashed;
}
.droppable{}
`;
            //#expandable-items > ytd-guide-entry-renderer{margin: 1.2em 0em 1.2em 0em !important;}
            document.head.appendChild(style_type2);

            //开始操作
            var menu_opr = setInterval(function(){

                //   const droppables = document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1)");
                if(document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) #items > ytd-guide-entry-renderer")){
                    const droppables = document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) > #items");
                    const draggable = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer");
                    const no_draggable = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer > #endpoint");
                    //  const no_droppable = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer > #endpoint > tp-yt-paper-item");
                    // const no_droppable = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer > #endpoint *");
                    const no_droppable = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items *");

                    const draggable2 = document.querySelectorAll("#expandable-items > ytd-guide-entry-renderer");
                    const no_draggable2 = document.querySelectorAll("#expandable-items > ytd-guide-entry-renderer > #endpoint");
                    // const no_droppable2 = document.querySelectorAll("#expandable-items > ytd-guide-entry-renderer > #endpoint *");

                    droppables.setAttribute("ondrop","drop_handler(event);");
                    droppables.setAttribute("ondragover","dragover_handler(event);");
                    // droppables.setAttribute("ondragenter","dragEnter(event);");
                    // droppables.setAttribute("ondragleave","dragLeave(event);");
                    no_draggable.forEach(function(element,index,array) {
                        element.setAttribute("draggable",false);
                    });
                    no_draggable2.forEach(function(element,index,array) {
                        element.setAttribute("draggable",false);
                    });

                    no_droppable.forEach(function(element,index,array) {
                        element.setAttribute("ondragover","noAllowDrop(event);");
                    });
                    //  no_droppable2.forEach(function(element,index,array) {
                    //          element.setAttribute("ondragover","noAllowDrop(event);");
                    //});


                    draggable.forEach(function(element,index,array) {
                        if(index<array.length){
                            element.setAttribute("draggable",true);
                            element.setAttribute("ondragstart","dragstart_handler(event);");
                            element.setAttribute("ondragend","dragend_handler(event);");
                            if(!element.id){element.setAttribute("id","move"+index);}
                        }
                    });
                    let index_x =0;
                    draggable2.forEach(function(element,index,array) {
                        index_x=index+7;
                        element.setAttribute("draggable",true);
                        element.setAttribute("ondragstart","dragstart_handler(event);");
                        element.setAttribute("ondragend","dragend_handler(event);");
                        element.setAttribute("id","move"+index_x);

                    });

                    //把隐藏内容拉出来,放入items
                    const parent_item = document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) #items");
                    let insert_sec = document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) #items > ytd-guide-collapsible-entry-renderer");
                    let new_content2=document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) #items > ytd-guide-collapsible-entry-renderer #expanded #expandable-items > ytd-guide-entry-renderer");
                    new_content2.forEach(function(element){parent_item.insertBefore(element,insert_sec)});


                    const obj = JSON.parse(localStorage.getItem("itemdetail"));

                    //getItem("itemdetail")然后写入网页列表
                    if(localStorage.getItem("itemdetail")){

                        var items_drag = document.querySelectorAll("#sections > ytd-guide-section-renderer:nth-child(1) > #items > ytd-guide-entry-renderer");

                        for(var j=obj.length-1;j>-1;j--){
                            //   if(j==0){
                            items_drag.forEach(function(element,index,array) {

                                //console.log(element.firstElementChild.title);
                                //console.log(obj[j].text);
                                if(obj[j]&&element.firstElementChild.title==obj[j].text){

                                    parent_item.prepend(element);
                                    return false;
                                }
                            })

                        }


                    }
                    //把当日订阅和历史记录置顶
                    //document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) > #items").prepend(document.querySelector("#sections > ytd-guide-section-renderer:nth-child(2) #items > ytd-guide-entry-renderer:nth-child(4)"));
                    //当日订阅 document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) > #items").prepend(document.querySelector("#sections a[href='/feed/subscriptions']").parentElement);
                    document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) > #items").prepend(document.querySelector("#sections a[href='/feed/history']").parentElement);
                    document.querySelector("#sections > ytd-guide-section-renderer:nth-child(1) > #items").prepend(document.querySelector("#sections  a[href='/playlist?list=WL']").parentElement);

                    clearInterval(menu_opr);
                }

            },100)

            }


    }



    var load_menu = setInterval(function(){
        //youtube_hand.dark_eye();
        //取消YouTube广告提示
        if(ytInitialPlayerResponse){}
        else{const ytInitialPlayerResponse=0;}

        if(document.querySelector("#end")){
            youtube_hand.play_menu();
            youtube_hand.play_main();
            youtube_hand.dark_eye1();

            //document.querySelector("html").onpropertychange = youtube_hand.dark_eye;

            clearInterval(load_menu);

        }
    },100)

    /*
   window.onload=function(){
    document.addEventListener("yt-navigate-finish", function() {
                      youtube_hand.play_menu();
            youtube_hand.play_main();
            youtube_hand.dark_eye1();
                })
   };
*/
    setInterval(function(){ youtube_hand.dark_eye();
                           if(del_promote){
                               if(document.querySelector(".ytp-ce-element.ytp-ce-playlist.ytp-ce-element-show")){
                                   document.querySelector(".ytp-ce-element.ytp-ce-playlist.ytp-ce-element-show").remove();
                                   // console.log("del 1");
                               }

                               if(document.querySelector(".ytp-ce-element.ytp-ce-video.ytp-ce-element-show")){
                                   document.querySelector(".ytp-ce-element.ytp-ce-video.ytp-ce-element-show").remove();
                                   //console.log("del 2");
                               }
                               if(document.querySelector(".ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this.ytp-ce-element-show")){
                                   document.querySelector(".ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this.ytp-ce-element-show").remove();
                                   // console.log("del 3");
                               }
                           }


                          },1000)


    if(subscription_up){
        var move_ma=setInterval(function(){
            if(document.querySelector("#sections > ytd-guide-section-renderer:nth-child(2)"))
            {
                youtube_hand.move_menu();

                clearInterval(move_ma);
            }
        },200)
        }
    /*
setTimeout(function(){
             document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-fullscreen-button.ytp-button").click();
             },10000)
*/
})();