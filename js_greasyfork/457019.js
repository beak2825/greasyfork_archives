// ==UserScript==
// @name         虫虫钢琴铺面查看脚本
// @namespace    TesterNaN.github.io
// @version      1.8
// @description  虫虫钢琴铺面查看工具，可点击下载，全屏，打印等功能。
// @author       TesterNaN
// @license      GPLv3
// @match        *://www.gangqinpu.com/jianpu/*
// @match        *://www.gangqinpu.com/cchtml/*
// @match        *://www.gangqinpu.com/sheetplayer/web.html?*
// @icon         https://www.gangqinpu.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/457019/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E9%93%BA%E9%9D%A2%E6%9F%A5%E7%9C%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457019/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E9%93%BA%E9%9D%A2%E6%9F%A5%E7%9C%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function downAu() {
    return new Promise((resolve, reject) => {
        let targetUrl = window.location.href; // 注意：这里修改为let，因为要重新赋值
        if(targetUrl.includes("/jianpu/")){
            targetUrl = targetUrl.replace('jianpu', 'cchtml');
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: targetUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const audioElement = doc.querySelector('audio.music-audio.audio');
                    if (audioElement) {
                        const sourceElement = audioElement.querySelector('source[type="audio/mp3"]');
                        if (sourceElement && sourceElement.src) {
                            console.log('找到音频源:', sourceElement.src);
                            resolve(sourceElement.src); // 成功时返回结果
                        } else {
                            console.log('未找到音频source标签或src属性');
                            reject('未找到音频源');
                        }
                    } else {
                        console.log('未找到audio元素');
                        reject('未找到音频元素');
                    }
                } else {
                    console.error('请求失败，状态码:', response.status);
                    reject('请求失败，状态码: ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('请求出错:', error);
                reject('请求出错: ' + error.message);
            }
        });
    });
}
async function forceDownload(url, filename = 'audio.mp3') {
    try {
        // 1. 先获取文件的Blob对象
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors', // 处理跨域
            headers: {
                'Accept': 'audio/mpeg' // 明确指定MP3格式
            }
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.status}`);
        }

        // 2. 将响应转换为Blob对象
        const blob = await response.blob();

        // 3. 创建本地URL（不受跨域限制）
        const blobUrl = window.URL.createObjectURL(blob);

        // 4. 创建a标签并触发下载
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename; // 强制下载的关键属性

        // 添加到文档并触发点击
        document.body.appendChild(link);
        link.click();

        // 5. 清理资源
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl); // 释放Blob URL
        }, 100);

    } catch (error) {
        console.error('强制下载失败:', error);
        alert('下载失败: ' + error.message);
    }
}

function setJianpuMode(url,type) {
    const urlObj = new URL(url);
    const newMode = type;
    urlObj.searchParams.set('jianpuMode', newMode);
    return urlObj.toString();
}

function CrackMain(){
    const jp_icon = "https://s201.lzjoy.com/public/web_static/images/score_details/jianpu-icon.png";
    const wxp_icon = "https://s201.lzjoy.com/public/web_static/images/score_details/qupu-icon.png";
    try{
        var kj=document.getElementById("ai-score");
    }catch(e){
        alert("抱歉，您当前查看的谱面暂时无法读取");
        return -1;
    };

    var btn1=document.querySelector(".down.download");
    var btn2=document.getElementById("s_d_fullBtn");
    var btn3=document.querySelector(".print.Printing");
    var tojp=document.querySelector(".jianpu-btn");
    var downAudio=document.querySelector(".share.s_d_shareBtn")
    setTimeout(function(){
        try{
            document.querySelector("#line-spectrum-box > div.ai > div").style.visibility="hidden";
        }catch(e){}
        try{
            document.querySelector(".s-d-m-b-buy").style.visibility="hidden";
        }catch(e){}
        try{
        //document.querySelector(".no-buy.active > div.img-mask").style.visibility="hidden";
            document.querySelector("#line-spectrum-box > div.defalut.no-buy.active > div.img-mask").style.visibility="hidden";
        }catch(e){}
        try{
            document.querySelector("#line-spectrum-box > div.ai").style.display='block';
        }catch(e){}
        try{
            document.querySelector("#line-spectrum-box > div.defalut.no-buy.active").style.display="none";
        }catch(e){}
        try{
            document.querySelector("#siwper1-middle-play").style.display="none";
        }catch(e){}
        try{
            document.querySelector("#ai-score").scrolling="yes";
        }catch(e){}
        try{
            document.querySelector("#header > div.content-box-0").style.display="none";
            document.querySelector("body > section").style="";
        }catch(e){}
        try{
            downAudio.childNodes[0].innerHTML = '<i class="down-icon"></i>下载音频'
        }catch(e){}
    }, 1000);
    btn1.addEventListener("click",function(){
        const Player = document.querySelector("#ai-score").contentWindow.Player
        let link = setJianpuMode(kj.src,Player.getJianpuMode())
        let gdd = Player.getJianpuMode()
        window.open(link+"&gdd="+gdd);
        event.stopImmediatePropagation();
    },true);
    btn2.addEventListener("click",function(){
        const Player = document.querySelector("#ai-score").contentWindow.Player
        let link = setJianpuMode(kj.src,Player.getJianpuMode())
        let gdd = Player.getJianpuMode()
        window.open(link+"&gdd="+gdd);
        event.stopImmediatePropagation();
    },true);
    btn3.addEventListener("click",function(){
        //window.open(kj.src);
        document.getElementById('ai-score').contentWindow.window.print();
        event.stopImmediatePropagation();
    },true);
    downAudio.addEventListener("click",function(){
        const iframe = document.createElement('iframe');
        downAu().then(audioSrc => {
            var audioName = document.querySelector("hgroup > div > h1").innerText
            forceDownload(audioSrc,audioName)
        }).catch(error => {
            console.error("出错了：", error);
        });
        event.stopImmediatePropagation();
    },true);
    try{
    tojp.addEventListener("click",function(){
        //卡顿一下是正常的
        const Player = document.querySelector("#ai-score").contentWindow.Player
        if(Player.getJianpuMode()==0){
            tojp.src = wxp_icon
            Player.setJianpuMode(1)
        }else{
            tojp.src = jp_icon
            Player.setJianpuMode(0)
        }

        //沟槽的虫虫钢琴给/jianpu/做了跳转
        //所以旧的简铺切换不能用了
        //目前已经定位造成跳转的脚本是jpu_detail.js
        //位于该脚本的第2124行
        //if (!info.play_json) {
		//    var tmp_url = window.location.href;
		//	  tmp_url = tmp_url.replace('jianpu', 'cchtml');
		//	  window.location.href = tmp_url;
		//	  return;
		//}
        //我搞了一下午都没能成功用油猴篡改掉这个函数
        //望有识之士能助我一臂之力，打败这个可恶的函数

        //原本代码：
        //var str = window.location.pathname;
        //if(str.includes("/jianpu/")){
        //    window.open("https://www.gangqinpu.com/cchtml"+str.substring(7));
        //}else{
        //    window.open("https://www.gangqinpu.com/jianpu"+str.substring(7));
        //}

        event.stopImmediatePropagation();
    },true);
    }catch(e){};
    console.log("破解全屏和下载完毕");
    return 0;
}

(function() {
    'use strict';
    var str = window.location.pathname;
    if(str.includes("/jianpu/") || str.includes("/cchtml/")){
	    CrackMain();
    }else{
        !document.referrer&&(location.href+="");
        setTimeout(function(){
            try{
                const url = new URL(window.location.href);
                const gdd = url.searchParams.get('gdd');
                console.log("固定调模式："+gdd)
                if(gdd == "2"){
                    console.log("切换到固定调")
                    try{unsafeWindow.Player.setJianpuMode(2)}catch(e){console.log(e)}
                }
            }catch(e){}
            document.querySelector("#page_0 > g.qrcode.print").style.visibility="hidden";
            document.querySelector("#page_0 > g:nth-child(1) > image").style.visibility="hidden";
            document.querySelector("#page_0 > g.footer > text.print").style.visibility="hidden";
            for(var i=1;i<=document.querySelector("#svg").children.length-3;i++){
                document.querySelector("#page_"+i+" > g.print > image").style.visibility="hidden";
                document.querySelector("#page_"+i+" > g.footer > text.print").style.visibility="hidden";
            }
            console.log("去除水印完毕");
        }, 3000);

    }
})();