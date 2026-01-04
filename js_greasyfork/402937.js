 /* jshint esversion: 8 */
// ==UserScript==
// @name         网页音乐播放自动下载音乐文件
// @namespace    javyliu
// @version      1.2
// @description  在酷狗音乐播放页面下载所听歌曲到本地，仅在chrome下测试通过，当第一次打开播放界面时，如果仅播放一首歌，那么是通过hash变化触发下载，也就是在列表页再次点击新的一首歌时会触发下载，试听音乐不下载，不会重复下载
// @author       javy_liu
// @include      *://*.kugou.com/*
// @include      *://*.xiami.com/*
// @include      *://music.163.com/*
// @include      *://y.qq.com/*

// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_notification
// @grant        GM_deleteValue
// @license      GPL License


// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/402937/%E7%BD%91%E9%A1%B5%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/402937/%E7%BD%91%E9%A1%B5%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==
// kugou.com 音乐下载
(function() {
    'use strict';
    if(unsafeWindow.jQuery){
        $ = unsafeWindow.jQuery;
    }

    //从url中提取指定key的值
    function getHashParams(key) {
        var arr = location.hash.replace("#", "").split("&"), keyValue = "";
        for (var i = 0;i<arr.length;i++) {
            if (arr[i].split("=")[0] == key) {
                keyValue = arr[i].split("=")[1];
                break;
            }
        }
        return keyValue;
    }

    //通过文档对像得到react组件对像,虾米用
    function get_react_com(dom, traverseUp = 0) {
        const key = Object.keys(dom).find(key=>key.startsWith("__reactInternalInstance$"));
        const domFiber = dom[key];
        if (domFiber == null) return null;    
        // react <16
        if (domFiber._currentElement) {
            let compFiber = domFiber._currentElement._owner;
            for (let i = 0; i < traverseUp; i++) {
                compFiber = compFiber._currentElement._owner;
            }
            return compFiber._instance;
        }    
        // react 16+
        const GetCompFiber = fiber=>{
            //return fiber._debugOwner; // this also works, but is __DEV__ only
            let parentFiber = fiber.return;
            while (typeof parentFiber.type == "string") {
                parentFiber = parentFiber.return;
            }
            return parentFiber;
        };
        let compFiber = GetCompFiber(domFiber);
        for (let i = 0; i < traverseUp; i++) {
            compFiber = GetCompFiber(compFiber);
        }
        return compFiber.stateNode;
    }

    
    //封装通知
    function notify(txt,title="通知"){
        GM_notification({
            title: txt,
            text: title,
            // highlight: true,
            timeout: 5000,
            ondone: function(){
                console.log("关闭了通知");
            }
        });
    }

    //下载url指定的资源，并指定文件名
    function promise_download(res_url, file_name) {
        return new Promise(function (resolve, reject) {
            GM_download({
                url: res_url,
                name: file_name,
                onload: function () {
                    resolve(`${file_name} 下载完成`);
                },
                onerror: function (error) {
                    reject(`${file_name} 下载失败 ${error.error}`);
                }
            });
        });

    }

    //for kugou url fetch
    function promise_fetch(req_url){
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                method: "GET",
                url: req_url,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                responseType: "json",
                onload: function(r){
                    // console.log(r);
                    if(r.readyState == 4){
                        var res = r.response.data;
                        console.log("mp3地址", res.play_url);
                        resolve(res);
                    }                  
                },
                onerror: function(err){
                    console.error("请求地址失败", err);
                    reject("请求地址失败");
                }
            });  
        });       
    }


    //is_free_part 为1时为试听, 不下载试听
    //传入一个对像数组[{hash:xxx, encode_album_audio_id：xxx}]
    //for of 内部 break, return 会跳出循环.
    let list = GM_getValue("download_list") || {};

  

    
    let base_url = location.href;
    const KuGou = 'kugou.com';
    const XiaMi = 'xiami.com';
    const Netease = '163.com';
    const Qq = 'y.qq.com';
    let reg = new RegExp(`${KuGou}|${XiaMi}|${Netease}|${Qq}`.replace(/\./g, "\\."));
    let match_domain = base_url.match(reg)[0];

    let exec_in_kugou = function(){
        let play_list = JSON.parse($.jStorage.get("k_play_list"));
        //播放页面第一次打开为列表时，批量下载列表，否则通过监听hash地址变化触发下载
        if(play_list && play_list.length > 1){
            console.log("有列表：", play_list);
            download_kugou(play_list).then(function(){
                console.log("列表中的已下载完，增加单曲监听");
                window.addEventListener("hashchange", function(ev){
                    download_kugou([{'Hash': ev.target.Hash, 'encode_album_audio_id': ev.target.encode_album_audio_id}]);
                });
            });
        }else{
            window.addEventListener("hashchange", function(ev){
                download_kugou([{'Hash': ev.target.Hash, 'encode_album_audio_id': ev.target.encode_album_audio_id}])
                .then(function(_return){
                    //单曲时如果列表不只一首，则播放下一首
                    if(_return == 1 && (JSON.parse($.jStorage.get("k_play_list"))).length > 1){
                        console.log("跳过--------------");
                        $("#next").trigger("click");//不播放试听音乐
                    }
                });           
            });
        }
    };

    let download_kugou = async function(ary_obj){
        for (var obj of ary_obj) {
            let _hash = obj.Hash;
            let _album_id = obj.encode_album_audio_id;

            let req_url = "https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=" + _hash + "&encode_album_audio_id=" + _album_id + "&dfid=&mid=&platid=4";
           // https://wwwapi.kugou.com/yy/index.php?r=play/getdata&dfid=2mSxKE1FMBgg4N2TLT4Y3yic&appid=1014&mid=6bc5c6880bc2ce18c248fb6b88eb0ccc&platid=4&encode_album_audio_id=6eliwgeb&_=1677045356215
            console.log("请求地址：", req_url);
            try {
                //已下载的不下载，也不提醒
                if (list[_hash]) {
                    console.log("已下载",obj);
                    continue;
                }
                var res = await promise_fetch(req_url);
                //试听音乐也加到已加载列表
                if (res.is_free_part) {
                    list[res.hash] = 1;
                    var txt = `${res.audio_name}为试听音乐`;
                    console.log(txt);
                    notify(txt);
                    //如果是试听音乐且是单曲播放时，则返回1，利于后期处理
                    if(ary_obj.length == 1){
                        return 1;
                    }
                    continue;
                }
                var extname = res.play_url.match(/(\.[\w]+?$)/)[1];
                await promise_download(res.play_url, res.audio_name + extname);
                list[res.hash] = 1;
                GM_setValue("download_list", list);
                console.log(res);
                notify(res);
            } catch (error) {
                console.error(error);
                notify(error);                
            }
        }
    };

    let exec_in_xiami = function(){
        let play_box_com = get_react_com($(".player")[0]);
        let inject_methods = ['play','playMusic','playNext','playPrev'];
        let ori_mtds = [];
        //注入方法 
        for (let i=0,len=inject_methods.length; i<len; i++) {
            ori_mtds[i] = play_box_com[inject_methods[i]];
            play_box_com[inject_methods[i]] = function() {
                ori_mtds[i].apply(this,arguments);
                xiami_download(this);
            }.bind(play_box_com);
        }
      
    };

    let xiami_download = function(cobj){
        console.count("--------xiami_download called----");
        try {
            let song_id = cobj.audio.currentSrc.match(/fn=(\d+)_/)[1];
            if (!song_id) {
                throw new Error("歌曲id不存在");
            }

            if(list[`xm_${song_id}`]){
                console.log(`${song_id} 已下载`);
                return;
            }

            let song_item = cobj.props.activePlayList.find((item) => {
                return item.id == song_id;
            });
            if (!song_item) {
                throw new Error("歌曲不存在");
            }

            console.log(song_item.detail.songName);

            let play_info = song_item.playInfo.find((item)=>{
                return item.listenFile && item.listenFile.length > 0;
            });

            console.log(play_info);            
            let song_name = `${song_item.detail.songName.replace(/\s+/g,"_")}_${song_item.detail.artistName}.${play_info.format}`;           

            promise_download(play_info.listenFile, song_name).then(res => {
                list[`xm_${song_id}`] = 1;
                GM_setValue("download_list", list);
                notify(`${song_name} 下载完成！` );
            });
        } catch (error) {
            console.error(error);
        }

        /*
        // k1=$0.__reactInternalInstance$twjwzf1adie.return.stateNode;
        // p1=k1.play;
        // k1.play=function(){p1.apply(this,arguments);console.log("------play",arguments)}.bind(k1);
        // p2=k1.playMusic;  
        // k1.playMusic=function(){p2.apply(this,arguments);console.log("------playMusic",arguments)}.bind(k1);
        // p3=k1.playNext ;     
        // k1.playNext=function(){p3.apply(this,arguments);console.log("------playNext",arguments)}.bind(k1);
        // p4=k1.playPrev;
        // k1.playPrev=function(){p4.apply(this,arguments);console.log("------playPrev",arguments)}.bind(k1);

        // p5=k1.props.playMusic;
        // k1.props.playMusic=function(){p5.apply(this,arguments);console.log("------k1.props.playMusic",arguments)}.bind(k1.props);

        // p6=k1.props.setPlayListPlayInfo;
        // k1.props.setPlayListPlayInfo=function(){p6.apply(this,arguments);console.log("------k1.props.setPlayListPlayInfo",arguments)}.bind(k1.props);

        // p7=k1.props.setPlayListDetail;
        // k1.props.setPlayListDetail=function(){p7.apply(this,arguments);console.log("------k1.props.setPlayListDetail",arguments)}.bind(k1.props);    
       */ 
        
    };

    let exec_in_netease = function(){
        let ori_change = unsafeWindow.onplaychange;
        unsafeWindow.onplaychange = function(){
            ori_change.apply(this,arguments);
            console.log("----------onplaychange");
            // setTimeout(() => {
                netease_download();
            // }, 1000);
        }.bind(unsafeWindow);   
      
    };   

    let netease_download = function(){
        try {
            if(!unsafeWindow.player)  return 0;

            let url = unsafeWindow.cAi5n;
            let playinfo = unsafeWindow.player.getPlaying();

            console.log("--------播放信息：",playinfo);
            if(list[`netease_${playinfo.track.id}`]){
                console.log(`${playinfo.track.id} 已下载`);
                return;
            }

            let extname = url.match(/\.([\w]+?$)/)[1];
            let articles = playinfo.track.artists.map((item) => item.name).join("_");
            let song_name = `${playinfo.track.name}_${articles}.${extname}`;

            promise_download(url, song_name).then(res => {
                list[`netease_${playinfo.track.id}`] = 1;
                GM_setValue("download_list", list);
                notify(`${song_name} 下载完成！` );
            })
            .catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    };

    //注入的getSongUrl方法会被调用多次，所以需要限制下,如果下载失败需刷新后才会再次触发下载
    let pre_download_list = {};
    let exec_in_qq = function(){
        let ori_mtd = unsafeWindow.MUSIC.util.getSongUrl;        
        unsafeWindow.MUSIC.util.getSongUrl = function(arg){
            let res = ori_mtd.call(this,arg);
            setTimeout(() => void qq_download(arg), 1000 );
            return res;          
        };   
      
    };

    let qq_download = function(playinfo){
        try {
            if( pre_download_list[playinfo.songid]==1) return 0;
            if(!playinfo.songid) return 0;
            
            if(list[`qq_${playinfo.songid}`]){
                console.log(`${playinfo.songid} 已下载`);
                return 0;
            } 
            //预下载标记
            pre_download_list[playinfo.songid]=1;

            let song_url = playinfo.playUrl || $("audio")[0].src;

            // console.log("-------------需下载对像地址----------------");
            // console.log("1:",playinfo.playUrl);
            // console.log("2:",song_url);

            let extname = song_url.match(/\.(\w+)\?/)[1];
            let song_name = `${playinfo.songname}_${playinfo.singername}.${extname}`;

            promise_download(song_url, song_name).then(res => {
                list[`qq_${playinfo.songid}`] = 1;
                pre_download_list[playinfo.songid] = 0;
                GM_setValue("download_list", list);
                notify(`${song_name} 下载完成！` );
            })
            .catch(error => {
                pre_download_list[playinfo.songid] = 0;
                console.error(error);
            });
        } catch (error) {
            pre_download_list[playinfo.songid] = 0;
            console.error(error);
        }
    };


    console.log("----------------------",match_domain);
    switch (match_domain) {
        case KuGou:
            exec_in_kugou();            
            break;
        case XiaMi:
            exec_in_xiami();
            break;
        case Netease:
            exec_in_netease();
            break;    
        case Qq:
            setTimeout(()=>{
                exec_in_qq();
            },2000);
            break;    
        default:
            break;
    }
    
    /*
        music_title[0]="163.com"
        music_title[1]= "y.qq.com"
        music_title[2]= "kugou.com"
        music_title[3]= "kuwo.cn"
        music_title[4]= "xiami.com"
        music_title[5]= "taihe.com"
        music_title[6]= "1ting.com"
        music_title[7]= "migu.cn"
        music_title[8]= "qingting.fm"
        music_title[9]= "lizhi.fm"
        music_title[10]= "ximalaya.com"
    */  

   

    //头部添加清除下载记录按钮
    $("body").prepend(`<button id='clear_download_list' style="position:absolute;left:0px;top:0;z-index:1000;background-color: green;padding:10px;color:white;opacity: 0.7;">clear download list</button>`);
    $("#clear_download_list").on("click", function(){
        GM_deleteValue("download_list");
        console.log("list:",GM_getValue("download_list"));
        notify("清除下载记录成功");
    });
  

})();