// ==UserScript==
// @name         Tree new bee 2
// @namespace    Omnipotent_wzj
// @version      1.2
// @description  Omnipotent
// @author       wudaye
// @include      */*
// @icon         http://p1.qhmsg.com/dm/180_180_100/t01fa05315630358ffe.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502309/Tree%20new%20bee%202.user.js
// @updateURL https://update.greasyfork.org/scripts/502309/Tree%20new%20bee%202.meta.js
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
    s_arr[3] = {'reg':/iyi./,'div_name':"video",'url_name':'爱奇艺'}//flashbox
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
        var btnCatDiv = document.createElement("div");

        // 步骤2: 设置其id和style属性
        btnCatDiv.id = "btnCat";
        btnCatDiv.style.width = "50px"; // 设置宽度
        btnCatDiv.style.height = "50px"; // 可选：如果你想要一个可见的元素，最好也设置一个高度
        btnCatDiv.style.backgroundColor = "blue"; // 可选：设置一个背景颜色以便更容易看到元素
        btnCatDiv.style.position = "fixed"; // 设置为固定定位
        btnCatDiv.style.top = "0px"; // 固定在页面顶部
        btnCatDiv.style.left = "0px"; // 固定在页面左侧
        btnCatDiv.style.backgroundImage = 'url("http://p1.qhmsg.com/dm/180_180_100/t01fa05315630358ffe.jpg")';
        btnCatDiv.style.backgroundRepeat = 'no-repeat';
        btnCatDiv.style.backgroundSize = 'cover'; // 或者 '100% 100%' 根据需要
        btnCatDiv.style.zIndex = 99999;
        btnCatDiv.addEventListener('click',function(){

            var iframeContainer = document.createElement("div");

            // 设置div的ID
            iframeContainer.id = "iframecontainer";

            // 设置div的样式
            iframeContainer.style.width = "100%"; // 宽度100%
            iframeContainer.style.height = "100%"; // 高度100%
            //iframeContainer.style.display="block";
            iframeContainer.style.overflow = "auto";
            iframeContainer.style.top="0px";
            iframeContainer.style.left="0px";
            iframeContainer.style.position = "fixed";
            iframeContainer.style.opacity = "1"; // 透明度50%
            //iframeContainer.style.backgroundColor = "black"; // 背景颜色为黑色
            iframeContainer.style.zIndex = 999999;

            // 注意：如果你想要的是背景半透明而内容不透明，你可能需要使用伪元素或另一个div来仅设置背景的透明度
            // 但在这个简单的例子中，我们直接设置整个div的透明度

            // 将这个div添加到body的末尾
            document.body.appendChild(iframeContainer);


            for (let i = 0; i < originalInterfaceList.length; i++) {
                // 创建一个新的div元素
                var newDiv = document.createElement("div");

                // 设置新div的样式
                newDiv.style.width = "200px"; // 宽度为360px
                newDiv.style.height = "150px"; // 高度为270px
                newDiv.style.overflow = "hidden";
                newDiv.style.float = "left";
                newDiv.style.backgroundColor = "green";
                newDiv.style.position = "relative ";

                // 你可以添加更多的样式，比如边框、背景色等
                // newDiv.style.border = "1px solid #000"; // 例如，添加一个黑色边框
                //添加iframe
                var newDiv2 = document.createElement("div");

                // 设置新div的样式
                newDiv2.style.width = "100%"; // 宽度为360px
                newDiv2.style.height = "100%"; // 高度为270px
                newDiv2.style.overflow = "hidden";
                newDiv2.style.backgroundColor = "yellow";
                newDiv2.style.position = "absolute ";
                newDiv2.style.zIndex = 999998;

                //newDiv2.style.float="left";
                newDiv2.style.top="0"

                var setMu_iframe0 = document.createElement("iframe");
           // setMu_iframe0.id = "setMu_videoD";
            setMu_iframe0.style.cssText="width:100%;height:100%;position:absolute;top:0;left:0;background:black;z-index:999998;display;block;border:0";
            setMu_iframe0.src=originalInterfaceList[i].url+window.location.href;
                newDiv2.appendChild(setMu_iframe0);


                //添加bt按钮
                var newDiv1 = document.createElement("div");

                // 设置新div的样式
                newDiv1.style.width = "100%"; // 宽度为360px
                newDiv1.style.height = "100%"; // 高度为270px
                newDiv1.style.overflow = "hidden";
                newDiv1.style.textAlign = "center";
                newDiv1.style.display = "flex"; // 启用Flexbox
                newDiv1.style.justifyContent = "center"; // 水平居中
                newDiv1.style.alignItems = "center"; // 垂直居中
                newDiv1.style.height = "100%"; // 设置容器高度（根据需要）
                //newDiv1.style.float="left";
                newDiv1.style.position = "absolute ";
                newDiv1.style.top="0"
                newDiv1.style.opacity = "1";
                //newDiv1.style.width = "100%";
                newDiv1.style.fontSize="60px";
newDiv1.style.color="red";
                newDiv1.innerHTML= originalInterfaceList[i].name;
                newDiv1.style.zIndex = 999999;
                newDiv.appendChild(newDiv2);
                newDiv.appendChild(newDiv1);
                setFun(newDiv1,originalInterfaceList[i].url,vd_div)

                // 将新创建的div添加到iframeContainer内
                iframeContainer.appendChild(newDiv);
            }


        })
        document.body.appendChild(btnCatDiv);


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
            //移除iframecontainer界面
            document.getElementById("iframecontainer").remove();
            console.log(str1)
        })
    }

}


)();
