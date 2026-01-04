// ==UserScript==
// @name         qq音乐，酷我，酷狗，虾米，咪咕，网易，千千，喜马拉雅在线音乐平台倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  qq音乐，酷我，酷狗，虾米，咪咕在线可实现倍速音乐播放，那些喜欢加速播放音乐的可有福利了，音乐加速播放带感。网易，千千音乐，喜马拉雅都是利用flash生成播放的，做了特别处理，舍弃自带播放器（并不是删了）创建了一个audio播放器来操作速度
// @author       YQS
// @match        *://y.qq.com/portal/player*
// @match        *://www.kuwo.cn/*
// @match        *://www.kugou.com/song/*
// @match        *://*.xiami.com/*
// @match        *://music.migu.cn/v3/music/player*
// @match        *://music.163.com/*
// @match        *://music.taihe.com/song/*
// @match        *://play.taihe.com/*
// @match        *://www.ximalaya.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407884/qq%E9%9F%B3%E4%B9%90%EF%BC%8C%E9%85%B7%E6%88%91%EF%BC%8C%E9%85%B7%E7%8B%97%EF%BC%8C%E8%99%BE%E7%B1%B3%EF%BC%8C%E5%92%AA%E5%92%95%EF%BC%8C%E7%BD%91%E6%98%93%EF%BC%8C%E5%8D%83%E5%8D%83%EF%BC%8C%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E5%9C%A8%E7%BA%BF%E9%9F%B3%E4%B9%90%E5%B9%B3%E5%8F%B0%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/407884/qq%E9%9F%B3%E4%B9%90%EF%BC%8C%E9%85%B7%E6%88%91%EF%BC%8C%E9%85%B7%E7%8B%97%EF%BC%8C%E8%99%BE%E7%B1%B3%EF%BC%8C%E5%92%AA%E5%92%95%EF%BC%8C%E7%BD%91%E6%98%93%EF%BC%8C%E5%8D%83%E5%8D%83%EF%BC%8C%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E5%9C%A8%E7%BA%BF%E9%9F%B3%E4%B9%90%E5%B9%B3%E5%8F%B0%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = window.location.host;
    var audio = "";
    var speed =  GM_getValue("audio_speed")?  GM_getValue("audio_speed") : 1.0;
    console.log(speed);
    var add_speed = 0.1;
    var timer = null;
    var val = null;
    var getObj = function(flag,id,doc){
        var obj = doc ? doc :document;
        if(flag == 1){
            return obj.getElementById(id);
        }else if(flag == 2){
            return obj.getElementsByTagName(id)[0];
        }else if(flag == 3){
            return obj.getElementsByClassName(id)[0];
        }
    }
    //获取url参数合集，比较简单
    var getUrlMethod = function(){
        var obj = {};
        let method = location.href;
        //console.log(method);
        var str = "";
        if(method){
            str = method.split("?")[1];
        }
        if(typeof(str) == "undefined") return obj;
        str = str.split("&");
        for(var i in str){
            obj[str[i].split("=")[0]] = str[i].split("=")[1];
        }
        return obj;
    }
    var body = getObj(2,"body");
    if(host.search("qq.com") != -1){
       timer = setInterval(function(){
           audio = getObj(1,"h5audio_media");
           if(audio){
               clearInterval(timer);
           }
       },1000);
    }else if(host.search("kuwo.cn") != -1){
        audio = getObj(2,"audio");
    }else if(host.search("kugou.com") != -1){
        audio = getObj(1,"myAudio");
    }else if(host.search("xiami.com") != -1){
        audio = getObj(2,"audio");
    }else if(host.search("migu.cn") != -1){
        audio = getObj(1,"migu_audio");
    }else if(host.search("163.com") != -1 || host.search("taihe.com") != -1 || host.search("ximalaya.com") != -1){
        /**
         * 网易云音乐是flash，所以只能获取源地址构建html audio标签播放了
         * 获取地址，必须先点击播放按钮，或点击音乐列表中的音乐才能获取源地址
         * 默认情况下是获取当前点击跳转到该音乐播放获取id，播放列表的需要点击了
        */
        var top = "";
        var doc = "";
        if(host.indexOf("163") != -1){
            top = window.top.document.body;
            doc = window.top.document;
        }else if(host.indexOf("taihe") != -1){
            //getDefalutUrl();
            top = body;
            doc = window.document;
            GM_setValue("status",true);
        }else if(host.indexOf("ximalaya") != -1){
            top = window.top.document.body;
            doc = window.top.document;
            GM_setValue("status",true);
        }
        var method = getUrlMethod();
        var audio_url = "";
        var get_url = "";
        if(host.indexOf("163") != -1){
            //网易音乐等利用iframe框架来的打开一个页面执行两次,执行第二次时赋值动态创建的audio的音乐地址
            if(typeof(method.id) != "undefined"){
                audio_url = "http://music.163.com/song/media/outer/url?id="+method.id+".mp3";
            }
            let audio = getObj(1,"create_audio",doc);
            if(audio){
                audio.setAttribute('src',audio_url);
                //获取用户自定的速度
                audio.playbackRate = GM_getValue("audio_speed")
                audio.play();
            }
            timer = setInterval(function(){
                var play = getObj(1,"g_playlist",doc);
                if(play){
                    var p = play.getElementsByTagName('li');
                    for(var i = 0; i < p.length; i++){
                        audio = getObj(1,"create_audio",doc);
                        p[i].addEventListener("click",function(){
                            var id=this.getAttribute('data-id');
                            audio.setAttribute('src','http://music.163.com/song/media/outer/url?id='+id+'.mp3');
                            //audio.playbackRate = GM_getValue("audio_speed")
                            setTimeout(function(){
                                var ay = getObj(3,"ply",doc);
                                if(ay.getAttribute("data-action") == "pause"){
                                    ay.click();
                                }
                            },2000);
                            if(audio.paused){
                                audio.play();
                            }
                        });
                    }
                }
            },1000);
        }else if(host.indexOf("taihe") != -1){
            var id = getAudioId();
            //千千音乐盒
            if(host == "play.taihe.com"){
                getDefalutUrl();
                var xml = new XMLHttpRequest();
                console.log(xml.responseURL);
                var a = getObj(1,"playTitle").getElementsByClassName("songname")[0];
                var b = a.getAttribute("href")//.split("?")[0];
                console.log(a);
                var c = b.split("/");
                id = parseInt(c[c.length-1]);
            }
            if(typeof(id) == "number"){
                GM_xmlhttpRequest({
                    method: "get",
                    url: "http://musicapi.taihe.com/v1/restserver/ting?method=baidu.ting.song.playAAC&format=jsonp&songid="+id+"&from=web",
                    data: "",
                    responseType:"json",
                    onload: function(res){
                        var play = getObj(1,"create_audio",doc);
                        console.log(res.response);
                        res = res.response;
                        play.setAttribute("src",res.bitrate.file_link);
                        //play.playbackRate = GM_getValue("audio_speed")
                        setTimeout(function(){
                            play.play();
                            var parue = getObj(3,"song-pause");
                            if(parue.getAttribute("class").indexOf("song-pause") !== -1){
                                parue.click();
                            }
                        },2000);

                    }
                });
            }
        }else if(host.indexOf("ximalaya") != -1){
            id = getAudioId();
            var play_list1 = getObj(3,"play-btn fR_",doc);
            if(play_list1){
                play_list1.style.display = "none";
            }
            var p_timer = setInterval(function(){
                var play_list2 = getObj(3,"xm-player-list-content",doc);
                if(play_list2){
                    var play_li = play_list2.getElementsByClassName("row");
                    var play_st = "";
                    let audio = getObj(1,"create_audio",doc);
                    var btn = getObj(3,"xm-player-btns",doc).getElementsByTagName("a")[1];
                    for(var i = 0,len = play_li.length; i < len; i++){
                        play_li[i].addEventListener("click",function(){
                            play_st = getObj(3,"xm-player-cover",doc);
                            var id = getAudioId(play_st.getAttribute("href"));
                            GM_xmlhttpRequest({
                                method: "get",
                                url: "https://www.ximalaya.com/revision/play/v1/audio?id="+id+"&ptype=1",
                                data: "",
                                responseType:"json",
                                onload: function(res){
                                    res = res.response
                                    audio.setAttribute("src",res.data.src);
                                    //audio.playbackRate = GM_getValue("audio_speed")
                                    if(audio.paused){
                                        audio.play();
                                    }
                                    setTimeout(function(){
                                        if(btn.getAttribute("class") == "pause"){
                                            btn.click();
                                        }
                                    },1000);
                                }
                            });
                        });
                    }
                    clearInterval(p_timer);
                }
            },1000);
            if(typeof(id) == "number"){
                GM_xmlhttpRequest({
                    method: "get",
                    url: "https://www.ximalaya.com/revision/play/v1/audio?id="+id+"&ptype=1",
                    data: "",
                    responseType:"json",
                    onload: function(res){
                        res = res.response;
                        audio_url = res.data.src;
                    }
                });
            }
        }
        if(GM_getValue("status")){
            var create_adiv = document.createElement("div");
            var create_audio = document.createElement("audio");
            create_adiv.style.cssText = "position:fixed; right:53px; bottom:50px; width:400px; height:100px; border-radius:5px; background:rgba(0,0,0,.3); z-index:100000";
            create_audio.id = "create_audio";
            create_audio.setAttribute("controls","controls");
            create_audio.setAttribute("autoplay","autoplay");
            create_audio.setAttribute("src",audio_url);
            create_audio.style.cssText = "width:350px; position: absolute; top:0; left:0; bottom:0; right:0; margin:auto;";
            //获取用户自定的速度
            //create_audio.playbackRate = GM_getValue("audio_speed")
            create_adiv.appendChild(create_audio);
            audio = create_audio;
            top.appendChild(create_adiv);
            createDocument(top);
            GM_deleteValue("status");
        }else{
            GM_setValue("status",true);
            setTimeout(function(){GM_deleteValue("status")},2000);
        }
    }
    if(host.indexOf("163") == -1 && host.indexOf("taihe") == -1 && host.indexOf("ximalaya") == -1){
        createDocument(body);
    }

    function createDocument(curdoc){
        var style_div = "position:fixed; right:0; bottom:50px; width:40px; height:100px;border-top-left-radius:3px; border-bottom-left-radius:3px; background:rgba(0,0,0,.3); z-index:100000";
        var style_add = "width:100%;height:40px; box-sizing: border-box; text-align:center; line-height:40px; color:white; font-size:30px; font-weight:bold;cursor: pointer;";
        var style_plus = "border-bottom:1px solid #ccc";
        var style_show = "width:100%;height:20px; box-sizing: border-box; text-align:center; line-height:20px; color:white; font-size:16px; font-weight:bold;";
        var create_div = document.createElement("div");
        var create_plus = document.createElement("div");
        var create_show = document.createElement("div");
        var create_sign = document.createElement("div");
        create_div.style.cssText = style_div;
        create_plus.innerText = "+";
        create_plus.style.cssText = style_add + style_plus;
        create_sign.innerText ="-";
        create_sign.style.cssText = style_add;
        create_show.style.cssText = style_show + style_plus;
        create_show.innerText = parseFloat(speed).toFixed(1);
        create_div.appendChild(create_plus);
        create_div.appendChild(create_show);
        create_div.appendChild(create_sign);
        curdoc.appendChild(create_div);

        create_plus.addEventListener("click",function(){
            var rate = audio.playbackRate;
            audio.playbackRate = parseFloat(rate + add_speed).toFixed(1);
            speed = audio.playbackRate;
            console.log(speed);
            create_show.innerText = speed;
            //存储当前播放速度
            GM_setValue("audio_speed", speed)
        });
        create_sign.addEventListener("click",function(){
            if(speed <= add_speed){
                alert("不能再减了");
                return;
            }
            var rate = audio.playbackRate;
            audio.playbackRate = parseFloat(rate - add_speed).toFixed(1);
            speed = audio.playbackRate;
            console.log(speed);
            create_show.innerText = speed;
            GM_setValue("audio_speed", speed)
        });

        setInterval(function(){
            audio.playbackRate = speed;
        },500);
    }
    //获取url中音乐的id
    function getAudioId(url){
        let song = "";
        if(url){
            song = url.split("/");
        }else{
            song = location.href.split("/");
        }
        var id = song[song.length-1];
        return parseInt(id);
    }
    function getDefalutUrl(){
       Object.defineProperty(XMLHttpRequest.prototype,"status",{
            get: function(status) {
                val = {
                    url: this.responseURL,
                    data: this.response
                };
            },
            post:function(status){
                val = {
                    url: this.responseURL,
                    data: this.response
                };
            }
        });
    }

})();