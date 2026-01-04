// ==UserScript==
// @name         Youtube Download ALL VIDEO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download music, video of youtube in the best qualities and without annoying programs.
// @author       Dukaro App
// @match        https://chrome.google.com/webstore/detail/chrome-dashboard/phifenlcioihjeappjcoeldjmjpbhdgc
// @grant        none
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/*
// @match https://s.ytimg.com/yts/jsbin/*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @connect googlevideo.com
// @connect ytimg.com
// @downloadURL https://update.greasyfork.org/scripts/30413/Youtube%20Download%20ALL%20VIDEO.user.js
// @updateURL https://update.greasyfork.org/scripts/30413/Youtube%20Download%20ALL%20VIDEO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var urlact = window.location.href;
        console.log(urlact);
        if(/watch\?v=/i.test(urlact)){
            console.log('inicio');
            var codevi = urlact.split('v=');
            var codevi = codevi[1].split('&');
            var div = '<style type="text/css">#yt-masthead-signin{position:relative;}.ulinocar{width: 100%;}.ulinocar li{padding: 0;margin: 0;position: relative;width: 100%;}.ulinocar li a{color: #000;font: bold 12px arial;box-sizing: border-box;width: 100%;float: left;padding: 5px 10px;border-bottom: 1px solid #dedede;text-decoration:none;}.ulinocar li a span{margin: 0 7px;background: #f00;color: #FFF;padding: 2px 10px;}.conatinerul{position: absolute;right: 0;top: 30px;background: #FFF;z-index: 9;box-shadow: 0 0 10px #a0a0a0;}#watch7-user-header{overflow:initial !important;}</style><div style="position: absolute;right: 0;background: rgb(239, 239, 239);border: 1px solid #828384;padding: 5px 10px;cursor: pointer;top:0px;font: bold 14px arial;" op="0" class="openerindt" id="dukarodownload">Descargar</div><div class="conatinerul" style="display:none"><div style="width: 100%;"><ul class="ulinocar"><li><a href="" class="ureldicr">Video MP4 1080 <span>HD</span></a></li><li><a href="" class="ureldicr">Video MP4 720<span>HD</span></a></li><li><a href="" class="ureldicr">Video MP4 480</a></li><li><a href="" class="ureldicr">Video MP4 360</a></li><li><a href="" class="ureldicr">Video MP4 280</a></li><li><a href="" class="ureldicr">Video MP4 160</a></li><li><a href="" class="ureldicr">Audio MP3 320kb</a></li><li><a href="" class="ureldicr">Audio MP3 128kb</a></li></ul></div></div>';
            var sl = document.getElementById('watch7-user-header');
            if(sl === null){
                var sl = document.getElementById('yt-masthead-signin');
            }
            var chk = document.getElementById('dukarodownload');
            if(sl && chk===null || chk==='undefined'){
                sl.insertAdjacentHTML('beforeend',div);
                var ocl = document.getElementsByClassName('openerindt');
                if(ocl){
                    ocl[0].addEventListener('click',function(){
                        if(this.getAttribute('op') == '0'){
                            var opnrrd = 'block';
                            this.setAttribute('op','1');
                        }else{
                            var opnrrd = 'none';
                            this.setAttribute('op','0');
                        }
                        document.getElementsByClassName('conatinerul')[0].setAttribute('style','display:'+opnrrd);
                    },false);
                }
                var dur = document.getElementsByClassName('ureldicr');
                for(var i = 0;i<dur.length;i++){
                    dur[i].setAttribute('href','http://downloadyoutube.me/?watch='+codevi[0]);
                    dur[i].setAttribute('target','_blank');
                }
            }
        }else{
            console.log('no corre');
        }
    },2500);
})();