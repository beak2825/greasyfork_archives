// ==UserScript==
// @name               取消youtube自动播放下一个视频
// @name               No more youtube nextVideo!
// @icon               data:image/jpg;base64,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
// @namespace          CherryChen
// @version            0.0.10
// @description        自动取消所有Youtube视频结尾的自动播放，拒绝YT推流.
// @description        Automatically cancel all youtube video endscreen playnext!
// @author             CherryChen
// @license            GPL-3.0 License
// jshint              esversion:6
// @match              *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/428187/%E5%8F%96%E6%B6%88youtube%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/428187/%E5%8F%96%E6%B6%88youtube%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cancelInt=0;
    var timeout=2000;
    var nowmax;
    var debug=false;
    var level2=false;
    var level3=false;

    var log=function(msg, level=debug){
        if(debug){
            if(level){
                window.console.log (msg);
            }
        }
    };
    var undisplaymenu=function(){
        //context menu panel
        var contextmenu=document.querySelector(".ytp-popup.ytp-contextmenu");
        //setting menu panel
        var settingmenu=document.querySelector(".ytp-popup.ytp-settings-menu");
        log('- setting:'+settingmenu+'_context:'+contextmenu, level2);
        //undisplay settingmenu and contextmenu
        if(contextmenu){
            //context menu panel
            var contextmenu_style=document.querySelector(".ytp-contextmenu").style.display;
            if(contextmenu_style==''){contextmenu_style='none';}else{log('no settingmenu',level3);}
        }else{log('- contextmenu is null.', level2);}
        if(settingmenu){
            //setting menu panel
            var settingmenu_style=document.querySelector(".ytp-settings-menu").style.display;
            if(settingmenu_style==''){settingmenu_style='none';}else{log('no contextmenu',level3);}
        }else{log('- settingmenu is null.', level2);}
    };
    var gettimeout=function(){
        //video
        var video=document.querySelector("video");
        var current=video.currentTime;
        var duration=video.duration;
        var diff=duration-current;
        log('- duration:'+duration+'_current:'+current+'_diff:'+diff, level2);
        //switch
        if(diff>10){
            log('- timeout=5000',level3);
            timeout=5000;
        }else if(diff>5){
            log('- timeout=3000',level3);
            timeout=3000;
            undisplaymenu()
        }else if(diff>2){
            log('- timeout=1000',level3);
            timeout=1000;
            undisplaymenu()
        }else if(diff>0){
            log('- timeout=400',level3);
            timeout=400;
        }else{
            log('- timeout=5000',level3);
            timeout=5000;
        }
        var durations=duration.toString().split('.')[0];
        var currents=current.toString().split('.')[0];
        nowmax=currents+'-'+durations+'_'+(durations-currents)+'-'+timeout;
        return timeout;
    };
    var cancelUpnext=function(){
        //permanent element:
        //<button class="ytp-autonav-endscreen-upnext-button ytp-autonav-endscreen-upnext-cancel-button" aria-label="取消自动播放">取消</button>
        //<a class="ytp-autonav-endscreen-upnext-button ytp-autonav-endscreen-upnext-play-button" role="button" aria-label="播放下一个视频">立即播放</a>
        //<button class="ytp-button ytp-mdx-privacy-popup-cancel">取消</button>
        //<button class="ytp-button ytp-mdx-privacy-popup-confirm">确认</button>

        //endscreen suggest set header(including countdown)
		var countdown=document.querySelector(".ytp-autonav-endscreen-upnext-header-countdown-number");
        //endscreen suggest set cancel button
        var upnextbtn=document.querySelector(".ytp-autonav-endscreen-upnext-cancel-button");
        //Determine whether the element is displayed
        log('- cancelBtn_noNum:'+upnextbtn, level2);
        if(upnextbtn){
            log('- countdown_num:'+countdown, level2);
            if(countdown!=null){
                upnextbtn=document.querySelector(".ytp-autonav-endscreen-upnext-cancel-button");
                log('- cancelBtn_withNum:'+upnextbtn, level3);
                log("Clicking cancelBtn now..."+new Date().toLocaleTimeString().substring(2));
                upnextbtn.click();
                if(cancelInt){clearTimeout(cancelInt);}else{log('exception1:'+cancelInt, level3);}
                cancelInt=setTimeout(cancelUpnext,5000);
            }else{
                log("Checking cancelBtn now..."+cancelInt+"..."+new Date().toLocaleTimeString().substring(2)+"..."+nowmax);
                if(cancelInt){clearTimeout(cancelInt);}else{log('exception2:'+cancelInt, level3);}
                cancelInt=setTimeout(cancelUpnext,gettimeout());
                log('- gettimeout: runed.', level2);
            }
        }else{
            log("Null upnextbtn.", level2);
            if(cancelInt) {clearTimeout(cancelInt);}else{log('exception3:'+cancelInt, level3);}
            cancelInt=setTimeout(cancelUpnext,5000);
        }
        log('---------------end of cancelUpnext_'+(cancelInt-1)+'----------------');
    };
    cancelUpnext();

})();