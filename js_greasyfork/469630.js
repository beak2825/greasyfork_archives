// ==UserScript==
// @name         Tree new bee
// @namespace    Omnipotent_wzj
// @version      1.1
// @description  Omnipotent
// @author       wudaye
// @include      */*
// @icon         http://p1.qhmsg.com/dm/180_180_100/t01fa05315630358ffe.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469630/Tree%20new%20bee.user.js
// @updateURL https://update.greasyfork.org/scripts/469630/Tree%20new%20bee.meta.js
// ==/UserScript==
//name 脚本名称、namespace 命名空间

(function() {
    'use strict';
    const originalInterfaceList = [
        {"name":"纯净1","url":"https://im1907.top/?jx="},
        {"name":"B站1","url":"https://jx.jsonplayer.com/player/?url="},
        {"name": "虾米","url": "https://jx.xmflv.com/?url="},
        {"name":"爱豆","url":"https://jx.aidouer.net/?url="},
        {"name":"CHok","url":"https://www.gai4.com/?url="},
        {"name":"OK","url":"https://api.okjx.cc:3389/jx.php?url="},
        {"name":"YT","url":"https://jx.yangtu.top/?url=","mobile":0},
        {"name":"BL","url":"https://vip.bljiex.com/?v=","mobile":0},
        {"name":"冰豆","url":"https://bd.jx.cn/?url=","mobile":0},
        {"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url=","mobile":0},
        {"name":"弹幕","url":"https://dmjx.m3u8.tv/?url=","mobile":0},
        {"name":"IK9","url":"https://yparse.ik9.cc/index.php?url=","mobile":0},
        {"name":"JY","url":"https://jx.playerjy.com/?url=","mobile":0},
        {"name":"解析la","url":"https://api.jiexi.la/?url=","mobile":0},
        {"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url=","mobile":0},
        {"name":"PM","url":"https://www.playm3u8.cn/jiexi.php?url=","mobile":0},
        {"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url=","mobile":0},
        {"name":"盘古2","url":"https://www.pangujiexi.com/jiexi/?url=","mobile":0},
        {"name":"剖云","url":"https://www.pouyun.com/?url=","mobile":0},
        {"name":"七哥","url":"https://jx.nnxv.cn/tv.php?url=","mobile":0},
        {"name":"神哥","url":"https://json.ovvo.pro/jx.php?url=","mobile":0},
        {"name":"听乐","url":"https://jx.dj6u.com/?url=","mobile":1},
        {"name":"维多","url":"https://jx.ivito.cn/?url=","mobile":0},
        {"name":"虾米","url":"https://jx.xmflv.com/?url=","mobile":0},
        {"name":"虾米2","url":"https://jx.xmflv.cc/?url=","mobile":0},
        {"name":"夜幕","url":"https://www.yemu.xyz/?url=","mobile":0},
        {"name":"云析","url":"https://jx.yparse.com/index.php?url=","mobile":0},
        {"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url=","mobile":0},
        {"name":"180","url":"https://jx.000180.top/jx/?url=","mobile":0},
        {"name":"2ys","url":"https://gj.fenxiangb.com/player/analysis.php?v=","mobile":0},
        {"name":"8090","url":"https://www.8090g.cn/?url=","mobile":0}
    ];
    const href_ = window.location.href;
    //判断界面
    var s_arr = Array()
    s_arr[0] = {'reg':/http/g}
    s_arr[1] = {'reg':/.le./,'div_name':"le_playbox",'url_name':'乐视网'}
    s_arr[2] = {'reg':/youku./,'div_name':"player",'url_name':'优酷视频'}
    s_arr[3] = {'reg':/iyi./,'div_name':"flashbox",'url_name':'爱奇艺'}
    s_arr[4] = {'reg':/v.qq./,'div_name':"player-container",'url_name':'腾讯视频'}
    s_arr[5] = {'reg':/bilibili./,'div_name':"bilibili-player",'url_name':'哔哩哔哩'}

    if(href_.match(s_arr[0].reg).length==1){
        var i = 1
        for(i=1;i<s_arr.length;i++){
            if(href_.match(s_arr[i].reg)!=null){
                setMenu(s_arr[i].div_name)
                console.log(s_arr[i].url_name)
                i=s_arr.length
                //alert(window.location.href)
            }
        }

    }else{
        console.log('当前页面未设置脚本！！！s0=null')
    }


    //设置play
    function setMenu(vd_div){
        var d_div = document.createElement('div');
        d_div.setAttribute('id','playBtn');
        d_div.setAttribute('style','position:fixed;z-index:999999;top:0;left:0;width:25%;padding:0;magin:0;text-align:center;overflow:hidden;background-color:rgba(255,182,193,0.5)');
        d_div.style.height="40px";
        d_div.onmouseover=function(){
            d_div.style.height = "440px"
        }
        d_div.onmouseout=function(){
            d_div.style.height = "40px"
        }

        var p_div = document.createElement('p');
        p_div.setAttribute("style","height:40px;color:#4E6EF2;display:block;line-height:40px;font-size:25px;padding:0;margin:0");
        p_div.innerText = 'Play';
        d_div.appendChild(p_div );

        p_div.onclick = function(){

            var height_ = d_div.style.height;
            //alert(height_);
            if(height_=="40px"){d_div.style.height = "440px";}else{d_div.style.height = "40px";}

        }


        var l_div = document.createElement('div');
        l_div.setAttribute('style','width:100%;max-height:400px;overflow:auto');


        for(var i=0;i<originalInterfaceList.length;i++){
            var a_div = document.createElement('a');
            var a_url = originalInterfaceList[i].url+href_;
            //a_div.setAttribute('href',a_url);
            a_div.setAttribute('style','display:block;text-decoration:none;color:#ffffff;height:40px;line-height:40px')
            a_div.innerText = originalInterfaceList[i].name;
            setFun(a_div,a_url,vd_div)
            l_div.appendChild(a_div);
        }

        d_div.appendChild(l_div);

        document.getElementsByTagName('body')[0].appendChild(d_div);

    }
    //设置事件
    function setFun(meu,str1,vd_div){
        meu.addEventListener('click',function(){
            var setMu_iframe = document.createElement("iframe");
            setMu_iframe.id = "setMu_videoD";
            setMu_iframe.style.cssText="width:100%;height:100%;position:absolute;top:0;left:0;background:black;z-index:999998;display;block;border:0";
            setMu_iframe.src=str1+window.location.href
            document.getElementById(vd_div).innerHTML=""
            document.getElementById(vd_div).appendChild(setMu_iframe)
            console.log(str1)
        })
    }

}


)();
