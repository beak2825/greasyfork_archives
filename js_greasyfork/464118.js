// ==UserScript==
// @name         新快猫破解【pc版】
// @namespace    http://tampermonkey.net/
// @version      0.7.5
// @description  使新快猫可以播放付费视频
// @author       thunder-sword
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @match        *://*/pc/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnhim5.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      api.6k98rnw.xyz
// @downloadURL https://update.greasyfork.org/scripts/464118/%E6%96%B0%E5%BF%AB%E7%8C%AB%E7%A0%B4%E8%A7%A3%E3%80%90pc%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/464118/%E6%96%B0%E5%BF%AB%E7%8C%AB%E7%A0%B4%E8%A7%A3%E3%80%90pc%E7%89%88%E3%80%91.meta.js
// ==/UserScript==
/*
更新日志：
v0.7：修复脚本功能（之后修复可以试试修复下m3u8Prefix，api则是apiAddr【网络标签搜api】，记得同时修改@connect）；
v0.6.x：添加检验视频id；
v0.6：去除首页广告，去除不起作用的按钮；
v0.5：添加功能，点击视频封面下方作者名可以跳转到作者的所有视频界面；
v0.4：修复部分视频无法观看；
v0.3：修复0.2导致的上下页按钮失效；
v0.2：在关注用户页面也能看付费视频；
v0.1：完成index和list页面视频替换；
*/

//变量作用：负责一些配置
var settings={
    "perPage": 18,  //list页面一页多少视频（因为会有广告，所以实际上比这个数目多）
    "removeAD": 1,  //是否去除首页广告，默认是
    "apiAddr": "https://api.6k98rnw.xyz/api/video/index", //https://api.3hfdkg.xyz/api/video/index
    "m3u8Prefix": "https://oafjdskpqwjnizlqwenmaqwkcxzpty.keyms2r.xyz/", //"https://onsdqia.kf116.com/",//https://sfdsdfwrwe.dxgafu.xyz/
};
//变量作用：管理当前pageIndex
var pageIndex=1;
//变量作用：管理当前mediaType
var mediaType=1;

//常量作用：页面端type和mediaType不是一一对应的，需要转换一下：
const mediaTypes={
    "0": 11,
    "原创视频": 11,
    "1": 3,
    "热门视频": 3,
    "2": 1,
    "精选视频": 1,
    "3": 9,
    "付费视频": 9,
    "4": 2,
    "视频广场": 2,
}

//常量作用：加解密所需常量
const key = CryptoJS.enc.Utf8.parse("x;j/6olSp})&{ZJD");
const iv = CryptoJS.enc.Utf8.parse("znbV%$JN5olCpt<c");
const mode = CryptoJS.mode.CBC;
const padding = CryptoJS.pad.Pkcs7;

function encrypt(plaintext) {
	var tmp=CryptoJS.enc.Utf8.parse(plaintext);
	var enc=CryptoJS.AES.encrypt(tmp, key, {
		iv: iv,
		mode: mode,
		padding: padding
	});
	return enc.ciphertext.toString().toUpperCase();
}

function decrypt(ciphertext) {
	var tmp=CryptoJS.enc.Hex.parse(ciphertext);
	var tmp2=CryptoJS.enc.Base64.stringify(tmp);
	var dec=CryptoJS.AES.decrypt(tmp2, key, {
		iv: iv,
		mode: mode,
		padding: padding
	});
	var s=dec.toString(CryptoJS.enc.Utf8);
	return JSON.parse(s);
}

function getSignature(data){
	function i(t) {
		return Object.keys(t).sort().map((function(e) {
			return "".concat(encodeURIComponent(e), "=").concat(encodeURIComponent(t[e]));
		})).join("&");
	}
	var r=i(data);
	var o=r + 'ohI}-bFpD*z8)W7~REusVa]U`YKQ=[C1&XZ."n5:dl<{?@J6NkO+f%c^"$tevxB>j2M_9;G#y3Tw|gL/HS,Pqr0!Ami(49Y_.~Tan#z{5ZLO,_E(7!vJ^HC5_{Xq5$z*';
	var signature=CryptoJS.enc.Hex.stringify(CryptoJS.MD5(o)).toUpperCase();
	return signature;
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

// 封装GM_xmlhttpRequest为Promise
function httpRequest(options) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onload: response => resolve(response),
      onerror: error => reject(error)
    });
  });
}

async function query(api="/api/video/index", data={}){
	data.signature=getSignature(data);
    //console.log(data);
    const encData=encrypt(JSON.stringify(data));
    var formData = new URLSearchParams();
    formData.append('data', encData);
    formData.append('device_version', 'pc');
    formData.append('device_type', 'pc');
    formData.append('version_code', '1.0');
    formData.append('device', 'pc');
    formData.append('api_token', "");
    formData.append('c_name', 'developer-default');
    //console.log(formData);
	const ret = await httpRequest({
        url: api,
		data: formData.toString(),
		method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
	}).then(function(response) {
        return response.responseText;
    }).catch(error => {
        if (error instanceof NetworkError) {
            console.error("Network error: ", error.message);
        } else {
            console.error("Other error: ", error);
            alert("获取api数据失败，请联系开发者");
        }
    });
    //console.log(ret);
    const plain=decrypt(ret);
    return plain;
}

//作用：生成toast，让其在toast_container中，显示在页面中上部，会永久性向页面添加一个id为ths_toast_container的div标签
function showStackToast(message, timeout=3000){
    //没有容器则生成容器
    let box=document.querySelector("body > div#ths_toast_container");
    if(!box){
        box=document.createElement('div');
        box.id="ths_toast_container";
        box.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    right: 10px;
    width: 300px;
    height: auto;
    display: flex;
    z-index: 9999;
    flex-direction: column-reverse;`;
        document.body.appendChild(box);
    }
    //创建toast
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
    padding: 10px;
    background-color: rgb(76, 175, 80);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    box-shadow: rgb(0 0 0 / 30%) 0px 5px 10px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out 0s;
    z-index: 9999;
    margin: 5px;
  `;
    box.appendChild(toast);
    toast.style.opacity = 1;
    if(timeout > 0){
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                box.removeChild(toast);
            }, 300);
        }, timeout);
    }
    return toast;
}

// 主函数：检验是否在可执行域，不是则不管
async function mainFunction(){
    //每次执行都重置pageIndex
    pageIndex=1;
    if("#/"===window.location.hash){
        //执行index相关内容
        showStackToast("当前位于index页面");
        setTimeout(async () => {
            await index_func();
        }, 2000);
    } else if(-1!==window.location.hash.search("#/video_list\\?type=")){
        //执行video_list相关内容
        showStackToast("当前位于list页面");
        //修改mediaType
        const e=window.location.hash.match(/type=(\d+)/);
        if(!e || e.length < 2){
            alert(`没有找到type，当前url为${window.location}`);
            throw Error(`没有找到type，当前url为${window.location}`);
        }
        mediaType=mediaTypes[e[1]];
        showStackToast(`当前视频类型为${mediaType}`);
        setTimeout(async () => {
            await func_list();
        }, 300);
    } else if("#/forvip"===window.location.hash){
        //执行vip相关内容
        showStackToast("vip视频当前无法破解");
    } else if(-1!==window.location.hash.search("#/user_details\\?id=")){
        showStackToast("当前位于用户视频页面");
        //修改mediaType
        const e=window.location.hash.match(/id=(\d+)/);
        if(!e || e.length < 2){
            alert(`没有找到id，当前url为${window.location}`);
            throw Error(`没有找到id，当前url为${window.location}`);
        }
        mediaType=5;
        showStackToast(`当前视频类型为${mediaType}`);
        setTimeout(async () => {
            await func_list(e[1]);
        }, 300);
    }
    //否则什么也不执行
}

//video_list、user_details要执行的内容
async function func_list(user_id=0){
    let queryData={};
    let box=null;
    if(0==user_id){
        //如果没提供user_id则是video_list页面
        queryData={type: mediaType, page: pageIndex, perPage: settings["perPage"]};
        //清除title，因为它的title是为了切换不同种类视频，更改后就不起作用了
        var title = document.querySelector("#app > div.videolist > div.title");
        if(title){
            title.remove();
        }
        box = document.querySelector("#app > div.videolist > div.box");
        if(!box){
            alert("没有找到要插入的视频容器box，请重试");
            throw Error("没有找到要插入的视频容器box，请重试");
        }
    } else{
        //如果提供了则是用户视频界面
        queryData={type: mediaType, page: pageIndex, by_id: user_id};
        box = document.querySelector("#app > div.details");
        if(!box){
            alert("没有找到要插入的视频容器box，请重试");
            throw Error("没有找到要插入的视频容器box，请重试");
        }
    }
    //清除所有原视频条目
    box.textContent='';
    //新建条目栏并插入
    var hotarea=document.createElement("div");
    hotarea.setAttribute("class", "hotarea");
    box.appendChild(hotarea);
    //新建list容器
    var list=document.createElement("div");
    list.setAttribute("class", "list");
    hotarea.appendChild(list);
    var ul=document.createElement("ul");
    ul.setAttribute("style", `display: flex;flex-wrap: wrap;width: 100%;`);
    list.appendChild(ul);
    //新建上一页、下一页按钮容器
    var pagination=document.createElement("div");
    pagination.setAttribute("class", "pagination");
    pagination.setAttribute("style", "display: flex;font-size: 13px;justify-content: space-around;width: 100%;margin-top: .4rem;");
    hotarea.appendChild(pagination);
    //新建上一页按钮
    var prePage=document.createElement("p");
    prePage.textContent="上一页";
    prePage.setAttribute("style", "padding: 5px .6rem;border: 1px solid #bebebd;text-align: center;border-radius: 7px;cursor: pointer;background: #fff;");
    pagination.appendChild(prePage);
    //绑定事件
    prePage.addEventListener("click", async () => {
        if(pageIndex<=1){
            showStackToast(`当前page为${pageIndex}，不能再向上一页`);
            throw Error(`当前page为${pageIndex}，不能再向上一页`);
        }
        pageIndex-=1;
        queryData["page"]=pageIndex;
        delete queryData["signature"];
        await insertList(ul, queryData);
    });
    //新建下一页按钮
    var nextPage=document.createElement("p");
    nextPage.textContent="下一页";
    nextPage.setAttribute("style", "padding: 5px .6rem;border: 1px solid #bebebd;text-align: center;border-radius: 7px;cursor: pointer;background: #fff;");
    pagination.appendChild(nextPage);
    //绑定事件
    nextPage.addEventListener("click", async () => {
        pageIndex+=1;
        queryData["page"]=pageIndex;
        delete queryData["signature"];
        await insertList(ul, queryData);
    });
    //插入视频条目
    await insertList(ul, queryData);
}

//index要执行的内容
async function index_func(){
    //去除首页广告
    if(settings["removeAD"]){
        showStackToast("开始去除广告");
        let el=document.querySelector("#app > div.box div.banner_vue");
        if(el){
            el.remove();
        }
        el=document.querySelector("#app > div.box > div.main > div.rightside");
        if(el){
            el.remove();
        }
    }
    //处理每个栏目尝试进行破解
    await document.querySelectorAll("div.hotarea").forEach( async (hotarea) => {
        var p=hotarea.previousElementSibling.querySelector("div.title > div.name > p:nth-child(1)");
        if(p){
            if(p.textContent in mediaTypes){
                //插入视频条目
                var list=hotarea.querySelector("ul");
                if(list){
                    //index页面的视频栏目都为7
                    let queryData={type: mediaTypes[p.textContent], page: pageIndex, perPage: 7};
                    await insertList(list, queryData);
                }
            } else{
                showStackToast(`${p.textContent}未在可破解序列，忽略`);
            }
        }
        //删除“换一批”按钮
        p=hotarea.previousElementSibling.querySelector("div.title > p");
        if(p){
            p.remove();
        }
    });
}

//插入视频条目执行函数
async function insertList(list, queryData){
    let page=queryData["page"];
    if(page<=0){
        alert("page不能小于等于0");
        throw Error("page不能小于等于0");
    }
    showStackToast(`当前page为${page}`);
    showStackToast("清除原目录内容");
    //先清除list全部内容
    list.textContent='';
    showStackToast("获取视频条目中……");
    const ret = await query(settings["apiAddr"], queryData);
    if(!ret || !ret.data ){
        alert("api访问失败，请检查");
        console.log(queryData);
        console.log(ret);
        throw Error("api访问失败，请检查");
    } else if(!ret.data.video_list){
        showStackToast("视频条目为空");
        console.log(ret);
        throw Error("视频条目为空");
    }
    showStackToast("获取成功！");
    console.log("获取成功结果：");
    console.log(ret);
    ret.data.video_list.forEach( (data) => {
        let html=`<div data-v-eb7f2fa4="" class="box">
        <div class="video_img" style="width: 100%;height: 1.4rem;position: relative;cursor: pointer;border-radius: 15px;">
          <p class="gold" style="position: absolute;top: 0;left: 0;display: flex;justify-content: flex-end;font-size: 12px;z-index: 9;background: linear-gradient(180deg,#ff74ac,#ff3480);border-radius: 5px 0 0 0;">
          <span style="">${data["gold"]}金币</span></p>
          <p style="position: absolute;right: 5px;top: 5px;font-size: 12px;color: #000;background: #ffdb00;padding: 0 5px;z-index: 9;border-radius: 5px;" class="is_original">${data["is_original"]}原创</p>
          <p style="position: absolute;left: 4px;bottom: 0;color: #fff;z-index: 9;font-size: 12px;" class="fee_num">${data["fee_num"]}人付费</p>
          <div style="width: 100%;height: 100%;border-radius: 5px;" class="el-image img_url"><img src="${data["cover"]}" class="el-image__inner"></div>
        </div>
        <p style="height: .4rem;margin-top: 9px;font-size: 14px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;" class="txt">${data["title"]}</p>
        <div style="margin-top: 10px;display: flex;align-items: center;justify-content: space-between;" class="avatar">
          <div style="display: flex;align-items: center;">
            <a href="#/user_details?id=${data["user_id"]}" style="display: flex;align-items: center;">
            <span style="font-size: 12px;color: #999;margin-right: 8px;">${data["nickname"]}</span>
            </a>
          </div>
          <div style="display: flex;align-items: center;">
            <span style="font-size: 12px;color: #999;">${data["praise_num"]}</span>
          </div>
        </div>
        </div>`;
        let li=document.createElement("li");
        li.setAttribute("style",`width: 2rem;margin: .3rem .1rem 0 0;`);//为了使一行正常显示，降低0.2rem间隔为0.1rem
        li.innerHTML=html;
        list.appendChild(li);
        //为封面添加点击事件
        let img=li.querySelector("img.el-image__inner");
        if(!img){
            alert("未找到img");
            throw Error("未找到img");
        }
        //console.log(img);
        img.addEventListener("click", () => {
            //console.log(data);
            if(!data["cover"]){
                alert("未找到该视频地址");
                throw Error("未找到该视频地址");
            }
            //alert(data["cover"]);
            if(data["id"]){
                console.log(`video_id: ${data["id"]}`);
            }
            const match=data["cover"].match("/uploads/cover/(.*?)\\.");
            if(!match || match.length < 2){
                alert(`未匹配指定封面地址，当前地址为${data["cover"]}`);
                throw Error(`未匹配指定封面地址，当前地址为${data["cover"]}`);
            }
            let m3u8url=settings["m3u8Prefix"]+"uploads/video/"+match[1]+"_wm.mp4/index.m3u8";
            showStackToast("视频地址获取成功，将弹窗播放");
            console.log(m3u8url);
            playMedia(m3u8url);
        });
    });
}

//作用：弹出新窗口播放指定m3u8视频
function playMedia(mediaUrl, width=800, height=600) {
    /* 第三个参数规定了新窗口的大小，不加则会以新窗口的形式出现 */
    var windowHandle = window.open("", "_blank", `width=${width}, height=${height}`);
    windowHandle.document.write(`
        <html>
        <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.26.0/DPlayer.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js"></script>
        </head>
        <body>
            <div id="dplayer"></div>
            <script>
                //var url = prompt("请输入要播放的视频url");
                var dp = new DPlayer({
                     container: document.getElementById('dplayer'),
                     autoplay: true,
                     theme: '#FADFA3',
                     loop: true,
                     lang: 'zh',
                     screenshot: true,
                     hotkey: true,
                     preload: 'auto',
                     video: {
                         url: "${mediaUrl}",
                         type: 'hls'
                     }
                 });
            </script>
        </body>
        </html>
    `);
}

setTimeout(async () => {
    'use strict';
    //alert("测试");
    //console.log(encrypt);
    //console.log(decrypt);//decrypt用于方便调试
    //console.log(query);
    //console.log(getSignature);
    let previousUrl = '';
    const observer = new MutationObserver(async function(mutations) {
        let nowUrl=window.location.href;
        if (nowUrl !== previousUrl) {
            console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
            previousUrl = nowUrl;
            await mainFunction();
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
}, 500);