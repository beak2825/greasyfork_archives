// ==UserScript==
// @name         猫咪av
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  破解vip视频免费观看
// @author       thunder-sword
// @match        *://*/home
// @match        *://*/page/vip/*
// @match        *://*/page/remen/*
// @require      https://cdn.staticfile.net/crypto-js/4.2.0/crypto-js.min.js#sha256=dppVXeVTurw1ozOPNE3XqhYmDJPOosfbKQcHyQSE58w=
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f2c013d5bbbb.com
// @grant        none
// @connect      mjson.szaction.cc
// @downloadURL https://update.greasyfork.org/scripts/459525/%E7%8C%AB%E5%92%AAav.user.js
// @updateURL https://update.greasyfork.org/scripts/459525/%E7%8C%AB%E5%92%AAav.meta.js
// ==/UserScript==

//变量作用：负责一些配置
var settings = {
    m3u8Prefix: "https://tma.qianchengwandian.top",        //setSource(config?.m3u8_host_encrypt ?? data?.source?.m3u8_host)（video.tsx）
    apiPrefix: "https://mjson.szaction.cc",   //_domain = _domain.endsWith('/') ? _domain : `${_domain}/`;（useAxios.ts）
}

//变量作用：管理当前pageIndex
var pageIndex=1;
//变量作用：管理当前mediaType
var mediaType=1;

//常量作用：页面端type和mediaType不是一一对应的，需要转换一下（/data/category/base-2.js）
const mediaTypes={
    58: "base-vip-mmtj-",
    59: "base-vip-ycgc-",
    62: "base-vip-zfyx-",
    60: "base-vip-hlaiq-",
    61: "base-vip-sjzy-",
    63: "base-vip-cydm-",
    64: "base-vip-omdp-",
    65: "base-vip-txzq-",
    150: "base-remen-xpsd-",
    151: "base-remen-djjx-",
    152: "base-remen-gccm-",
    153: "base-remen-jpgq-",
    154: "base-remen-zmcs-",
    155: "base-remen-thss-",
    156: "base-remen-spxm-",
    157: "base-remen-avjs-",
}

//常量作用：加解密所需常量
const key = CryptoJS.enc.Utf8.parse("IdTJq0HklpuI6mu8iB%OO@!vd^4K&uXW");
const iv = "$0v@krH7V2";
const mode = CryptoJS.mode.CBC;
const padding = CryptoJS.pad.Pkcs7;
const formatter = CryptoJS.format.OpenSSL;
const secretKey = "D7hGKHnWThaECaQ3ji4XyAF3MfYKJ53M";

//来自util.js
        // this.key = "SWRUSnEwSGtscHVJNm11OGlCJU9PQCF2ZF40SyZ1WFc=";
        // this.iv = "JDB2QGtySDdWMg==";
        // this.sign_key = "JkI2OG1AJXpnMzJfJXUqdkhVbEU0V2tTJjFKNiUleG1VQGZO";
        // this.suffix = 123456;
        // this.statDomain = process.env.REACT_APP_STATIC_STAT_DOMAIN;
        // this.secretKey = "D7hGKHnWThaECaQ3ji4XyAF3MfYKJ53M";

//判断第三方库是否导入成功
if('undefined'===typeof CryptoJS || undefined===CryptoJS.AES){
    showStackToast("导入第三方库crypto-js失败","red");
    throw Error("导入第三方库crypto-js失败，请尝试更换cdn或更改网络环境");
}

function addVidKeyParam2(url) {
        let secret_key = secretKey;
        let currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        let storedTime = sessionStorage.getItem('timestamp'); // Get the stored timestamp from sessionStorage

        let time; // Declare the time variable

        // If there is a stored time and 5 minutes haven't passed, reuse the stored time
        if (storedTime && currentTime - parseInt(storedTime) < 300) {
            time = parseInt(storedTime) + 300; // Use the stored timestamp and add 300 seconds
        } else {
            // If no stored time or more than 5 minutes have passed, generate a new timestamp
            time = currentTime + 300; // Add 300 seconds to the current time
            sessionStorage.setItem('timestamp', currentTime.toString()); // Store the new timestamp in sessionStorage
        }

        // Convert the time to a hexadecimal string
        let hexTime = time.toString(16);
        console.log('Hex time:', hexTime);

        // The URI for which we're generating the key
        let uri = url;
        console.log('URI:', uri);

        // Concatenate secret_key, uri, and time (decimal) for the MD5 hash
        let paramToAppend = secret_key + uri + time; // Time in decimal
        console.log('Param to append for MD5:', paramToAppend);

        // Calculate the MD5 hash using CryptoJS
        let key = CryptoJS.MD5(paramToAppend).toString();
        console.log('Generated key (MD5):', key);

        // Return the URL with wsSecret (the MD5 hash) and wsTime (in decimal)
        return '?wsSecret=' + key + "&wsTime=" + time; // wsTime is the time in seconds (decimal)
}

function encrypt(plaintext, suffix = "123456") {
	var tmp=CryptoJS.enc.Utf8.parse(plaintext);
    let new_iv = CryptoJS.enc.Utf8.parse(iv + suffix);
	var enc=CryptoJS.AES.encrypt(tmp, key, {
		iv: new_iv,
		mode: mode,
		padding: padding,
        formatter: formatter
	});
	return enc.toString();
}

//let __data = u.decrypt(response.data.data, response.data.suffix);（useAxios.ts）
function decrypt(ciphertext, suffix = "123456") {
    let new_iv = CryptoJS.enc.Utf8.parse(iv + suffix);
	var dec=CryptoJS.AES.decrypt(ciphertext, key, {
		iv: new_iv,
		mode: mode,
		padding: padding,
        formatter: formatter
	});
	var s=dec.toString(CryptoJS.enc.Utf8);
	return JSON.parse(s);
}

function getSignature(data) {
    function objKeySort(arys) {
        let newObj = {};
        let newkey = Object.keys(arys).sort();
        for (var i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = arys[newkey[i]];
        }
        return newObj;
    }
        data = objKeySort(data);
        let pre_sign = "";
        for (let i in data) {
            pre_sign += i + "=" + data[i] + "&";
        }
        let key = '&B68m@%zg32_%u*vHUlE4WkS&1J6%%xmU@fN';
        pre_sign += key;
        return CryptoJS.MD5(pre_sign).toString();
}

//作用：生成toast，让其在toast_container中，显示在页面中上部，会永久性向页面添加一个id为ths_toast_container的div标签
function showStackToast(message, backcolor='rgb(76, 175, 80)', timeout=3000){
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
    background-color: ${backcolor};
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

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

//api='https://mmnew.tlxxw.cc/api/list/base';

async function query(url, obj={}){
	let data='';
	try{
		//data=encrypt(JSON.stringify(obj));
        //data=JSON.stringify(obj);
	}catch(e){
		console.log("发送包aes加密失败");
		console.log(obj);
		console.log(key);
		console.log(gzip);
		throw e;
	}
	const ret = await fetch(url, {
			method: 'GET',
			headers: {
				//'Content-Type': 'application/json'
			}})
		.then(function(response) {
			if(!response.ok) {
				throw new NetworkError(`HTTP error! status: ${response.status}`);
			}
			return response.text();
		}).catch(error => {
			if (error instanceof NetworkError) {
				console.error("Network error: ", error.message);
				throw error;
		} else {
			console.error("Other error: ", error);
			//alert("发生其他错误");
			throw error;
		}
		});
    const tmp=JSON.parse(ret);
    if(!tmp || 0!==tmp.code){
        showStackToast("解析返回包失败！","red");
        console.log(tmp);
        throw Error("解析返回包失败！");
    }
	//解密返回包
	try{
		data=decrypt(tmp.data, tmp.suffix);
	}catch(e){
		console.log("返回包aes解密失败");
		console.log(tmp);
		console.log(key);
		throw e;
	}
	return data;
}

//作用：弹出新窗口播放指定m3u8视频
function playMedia(mediaUrl, width=800, height=600) {
    /* 第三个参数规定了新窗口的大小，不加则会以新窗口的形式出现 */
    var windowHandle = window.open("", "_blank", `width=${width}, height=${height}`);
    windowHandle.document.write(`
        <html>
        <head>
            <script src="https://cdn.staticfile.net/dplayer/1.27.1/DPlayer.min.js"></script>
            <script src="https://cdn.staticfile.net/hls.js/1.5.1/hls.min.js"></script>
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

//await query("https://utt.51jiajiao.top/data/index/home.js?1718510400000");

//插入视频条目执行函数
async function insertList(box, videoList){
    showStackToast("正在破解中...");
    //修改第一个容器内的标识
    box.firstElementChild.firstElementChild.innerText="已破解VIP视频";
    let list=box.querySelector("div:nth-child(2) > div");
    //循环添加事件
    for(let i=0; i < videoList.length && i < list.childNodes.length; i++){
        //先去除绑定
        list.childNodes[i].onclick= () => {
            if(!videoList[i].video_url){
                alert("未找到该视频地址");
                throw Error("未找到该视频地址");
            }
            let video_url=videoList[i].video_url.replaceAll('//', '/')
            let m3u8url=settings['m3u8Prefix']+video_url;
            m3u8url=m3u8url+addVidKeyParam2(video_url);
            showStackToast("视频地址获取成功，将弹窗播放");
            showStackToast(videoList[i].title);
            console.log(m3u8url);
            console.log(videoList[i]);
            playMedia(m3u8url);
        };
    }
    showStackToast("破解完成！");
}

//获取当前时间戳
function getTime(){
    var time = new Date();
    if (time.getHours() < 4){
        time.setHours(0, 0, 0, 0)
    }
    else if (time.getHours() < 8){
        time.setHours(4, 0, 0, 0)
    }
    else if (time.getHours() < 12){
        time.setHours(8, 0, 0, 0)
    }
    else if (time.getHours() < 16){
        time.setHours(12, 0, 0, 0)
    }
    else if (time.getHours() < 20){
        time.setHours(16, 0, 0, 0)
    }
    else if (time.getHours() < 24){
        time.setHours(20, 0, 0, 0)
    }
    else{
        time.setHours(24, 0, 0, 0)
    }

    let ts = time.getTime();
    return ts;
}

//main要执行的内容
async function main_func(){
    //let apiUrl=settings["apiPrefix"]+"/data/index/home.js?"+getTime();
    let apiUrl=settings["apiPrefix"]+"/data/index/home.js?";
    //showStackToast(apiUrl);
    const ret = await query(apiUrl);
    if(!ret || !ret.vip_list || !ret.vip_list.data){
        alert("api访问异常");
        throw Error("api访问异常");
    }
    showStackToast(`成功找到【${ret.vip_list.data.length}】个vip视频`);
    //查找box
    let box = document.querySelector("div.mw1100 > div:nth-child(1)");
    if(!box){
        showStackToast("未找到box！", "red");
        throw Error("未找到box！");
    }
    showStackToast("成功找到box！");
    insertList(box, ret.vip_list.data);
}

///page/vip/和/page/remen/的执行内容
async function func_list(user_id=0){
    let urlType=mediaTypes[mediaType];
    if(undefined === urlType){
        alert("脚本异常，urlType为空");
        throw Error("脚本异常，urlType为空");
    }
    //let apiUrl=settings["apiPrefix"]+"/data/list/"+urlType+pageIndex+".js?"+getTime();
    let apiUrl=settings["apiPrefix"]+"/data/list/"+urlType+pageIndex+".js?";
    //showStackToast(apiUrl);
    const ret = await query(apiUrl);
    if(!ret || !ret.list || !ret.list.data){
        alert("api访问异常");
        throw Error("api访问异常");
    }
    showStackToast(`成功找到【${ret.list.data.length}】个vip视频`);
    //查找box
    let box = document.querySelector("div.mw1100");
    if(!box){
        showStackToast("未找到box！", "red");
        throw Error("未找到box！");
    }
    showStackToast("成功找到box！");
    insertList(box, ret.list.data);
    //找到上一页、下一页按钮容器
    let pagination=document.querySelector("div.fl.align_center.justify_center.gap20.mb20");
    //清空原有按钮
    //pagination.innerHTML='';
    pagination.removeChild(pagination.lastChild);
    pagination.removeChild(pagination.firstChild);
    pagination.removeChild(pagination.childNodes[1]);
    //找到上一页按钮
    var prePage=pagination.firstChild;
    prePage.textContent="上一页";
    prePage.setAttribute("style", "padding: 5px .6rem;border: 1px solid #bebebd;text-align: center;border-radius: 7px;cursor: pointer;background: #fff;");
    //pagination.appendChild(prePage);
    //绑定事件
    prePage.addEventListener("click", async () => {
        if(pageIndex<=1){
            showStackToast(`当前page为${pageIndex}，不能再向上一页`);
            throw Error(`当前page为${pageIndex}，不能再向上一页`);
        }
        pageIndex-=1;
        //apiUrl=settings["apiPrefix"]+"/data/list/"+urlType+pageIndex+".js?"+getTime();
        apiUrl=settings["apiPrefix"]+"/data/list/"+urlType+pageIndex+".js?";
        //showStackToast(apiUrl);
        const ret = await query(apiUrl);
        if(!ret || !ret.list || !ret.list.data){
            alert("api访问异常");
            throw Error("api访问异常");
        }
        showStackToast(`成功找到【${ret.list.data.length}】个vip视频`);
        insertList(box, ret.list.data);
    });
    //找到下一页按钮
    var nextPage=pagination.lastChild;
    nextPage.textContent="下一页";
    nextPage.setAttribute("style", "padding: 5px .6rem;border: 1px solid #bebebd;text-align: center;border-radius: 7px;cursor: pointer;background: #fff;");
    //pagination.appendChild(nextPage);
    //绑定事件
    nextPage.addEventListener("click", async () => {
        pageIndex+=1;
        //apiUrl=settings["apiPrefix"]+"/data/list/"+urlType+pageIndex+".js?"+getTime();
        apiUrl=settings["apiPrefix"]+"/data/list/"+urlType+pageIndex+".js?";
        //showStackToast(apiUrl);
        const ret = await query(apiUrl);
        if(!ret || !ret.list || !ret.list.data){
            alert("api访问异常");
            throw Error("api访问异常");
        }
        showStackToast(`成功找到【${ret.list.data.length}】个vip视频`);
        insertList(box, ret.list.data);
    });
}

// 主函数：检验是否在可执行域，不是则不管
async function mainFunction(){
    //每次执行都重置pageIndex
    pageIndex=1;
    if('/home'===window.location.pathname){
        //执行main相关内容
        showStackToast("当前位于main页面");
        setTimeout(async () => {
            await main_func();
        }, 2000);
    } else if(-1!==window.location.pathname.search("/page/vip/") || -1!==window.location.pathname.search("/page/remen/")){
        //执行video_list相关内容
        showStackToast("当前位于list页面");
        //修改mediaType
        const e=window.location.pathname.match(/(\d+)$/);
        if(!e || e.length < 2){
            alert(`没有找到type，当前url为${window.location}`);
            throw Error(`没有找到type，当前url为${window.location}`);
        }

        if(!e[1] in mediaTypes){
            showStackToast("未找到vip视频标识，将忽略");
            throw Error("未找到vip视频标识，将忽略");
        }

        mediaType=e[1];

        setTimeout(async () => {
            await func_list();
        }, 300);
    }
    //否则什么也不执行
}

setTimeout(async () => {
    'use strict';
    //alert("测试");
    // console.log(encrypt);
    // console.log(decrypt);//decrypt用于方便调试
    // console.log(query);
    // console.log(getSignature);
    // console.log(addVidKeyParam2);
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
