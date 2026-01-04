// ==UserScript==
// @name         Pandora Music Download
// @namespace    https://greasyfork.org/users/71658
// @version      0.7
// @description  Gives Pandora download function!
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @author       Dante Miyamoto
// @inspired-by  Fei Sun
// @grant        none
// @include      http://*.pandora.com/*
// @include      https://*.pandora.com/*
// @downloadURL https://update.greasyfork.org/scripts/36433/Pandora%20Music%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/36433/Pandora%20Music%20Download.meta.js
// ==/UserScript==
/*jshint multistr: true */
$(function(){
    var styleele=$("<style></style>");
    styleele.html(`
#audioitems {
position:fixed;
right:80px;
top:100px;
background-color:rgba(0,0,0,.1);
z-index:1000;
width:400px;
box-sizing:border-box;
padding:20px;
opacity:.5;
transition:opacity .3s;
border-radius:3px;
max-height:400px;
overflow-y:auto;
color:white;
box-shadow:1px 1px 10px rgba(255,255,255,.5);
}
#audioitems::-webkit-scrollbar {
width:5px;
}
#audioitems::-webkit-scrollbar-track {
background-color:rgba(0,0,0,.3);
}
#audioitems::-webkit-scrollbar-thumb {
background-color:rgba(255,255,255,.3);
}
#audioitems:hover {
opacity:1;
}
#audioitems audio {
width:100%;
}
.audiowrap:not(:last-child) {
margin-bottom:15px;
}
.audiowrap {
display:flex;
}
.audiocloned {
flex:1;
display:none;
}
.audioinfo {
flex: 1;
display: flex;
flex-direction: column;
justify-content: space-between;
padding:2px 4px;
}
.download {
background-image:url(data:image/png;base64,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);
background-position:center;
background-repeat:no-repeat;
background-size:16px;
width:16px;
height:16px;
display: inline-block;
margin-bottom: -4px;
margin-right: 0px;
}
.audiodownload {
height:16px;
display: inline-block;
float: right;
}
.audioartist{
font-size: 1.2rem;
display: inline;
}
.inline-block-div{
}
`);
    var audioitems=$("<div id='audioitems'></div>");
    var mpos={
        start:{x:0,y:0},
        offset:{x:0,y:0},
        last:{x:0,y:0},
        movable:false
    };
    audioitems.mousedown(function(){
        mpos.start.x=event.clientX;
        mpos.start.y=event.clientY;
        mpos.last.x=event.clientX;
        mpos.last.y=event.clientY;
        mpos.movable=true;
    });
    $("body").mousemove(function(){
        if (!mpos.movable) return;
        mpos.offset.x=event.clientX-mpos.last.x;
        mpos.offset.y=event.clientY-mpos.last.y;
        audioitems.css({left:"+="+mpos.offset.x,top:"+="+mpos.offset.y});
        mpos.last.x=event.clientX;
        mpos.last.y=event.clientY;
    });
    $("body").mouseup(function(){
        mpos.movable=false;
    });
    $("body").append(audioitems).append(styleele);
    window.audioURLs=[];
    Array.prototype.contains=function(v){
        var ret;
        $.each(this,function(index,item){
            if (item===v) {
                ret= [true,index];
            }
        });
        if (ret) {
            return ret;
        }else {
            return false;
        }
    };
    function getAudioURL (){
        var audios=document.querySelectorAll("body>audio");
        $.each(audios,function(index,item){
            if (!audioURLs.contains(item.src)) {
                audioURLs.push(item.src);
                renderAudioHTML(item.src,$("[data-qa='mini_track_title']").text(),$("[data-qa='mini_track_artist_name']").text(),$("[data-qa='mini_track_image']")[0].src);
            }
        });
    }
    function renderAudioHTML (src,title,artist,image){
        var ele=$(`<div class='audiowrap onloading'>

<div class='audioinfo'>
<div class='inline-block-div'>
<div class='audioartist'>${artist} - ${title}</div>

<a class="audiodownload" download><div class="download"></div></a>
</div>

</div>
<audio preload loop class='audiocloned'>
</audio>
</div>`);
        var totaltime=0,currenttime=0,state=0,audio=null,audiourl=null;
        $("audio",ele)[0].onloadedmetadata=function(e){
            totaltime=e.srcElement.duration;
            updateView();
        };
        $("audio",ele)[0].ontimeupdate=function(e){
            currenttime=e.target.currentTime;
            updateView();
        };
        $("audio",ele)[0].onplay=function(){
            Pandora.pauseTrack();
            $("audio",$(this).parents(".audiowrap").siblings()).each(function(index,item){item.pause();});
            state=1;
            updateView();
        };
        $("audio",ele)[0].onpause=function(e){
            state=0;
            updateView();
        };
        $(".audioplay",ele).click(function(){
            $("audio",ele)[0].play();
        });
        $(".audiopause",ele).click(function(){
            $("audio",ele)[0].pause();
        });
        $(".audiotrack",ele).click(function(e){
            $("audio",ele)[0].currentTime=e.offsetX/e.target.clientWidth*totaltime;
        });
        function getAudio () {
            var xhr=new XMLHttpRequest();
            xhr.open("get",src);
            xhr.responseType="blob";
            xhr.onreadystatechange=function(){
                if (this.status==200&&this.readyState==4) {
                    audio=this.response;
                    audiourl=URL.createObjectURL(audio);
                    $("audio",ele).prop("src",audiourl);
                    $("a",ele).prop("href",audiourl);
                }
            };
            xhr.send();
        }
        function updateView(){
            $(".audioposition",ele).css("left",currenttime/totaltime*100+"%");
            $(ele).removeClass("onplaying onpaused onloading");
            if (state===1) {
                $(ele).addClass("onpaused");
            }else if (state===0) {
                $(ele).addClass("onplaying");
            }else if (state===-1) {
                $(ele).addClass("onloading");
            }
        }
        $("#audioitems").append(ele);
        getAudio();
    }
    setInterval(getAudioURL,1000);
});