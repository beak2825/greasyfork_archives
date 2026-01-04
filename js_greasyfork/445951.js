// ==UserScript==
// @name         百度文库复制
// @namespace    http://zhihupe.com/
// @version      1.01
// @author       cij81
// @antifeature  membership  
// @description  百度网盘文字可复制
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/limonte-sweetalert2/11.1.9/sweetalert2.all.min.js
// @match        *.baidu.com/*
// @match        wenku.baidu.com/view/*
// @match        wenku.baidu.com/tfview/*
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @connect      pan.10zv.com
// @connect      wp.nanmu.cool
// @connect      tool.zhihupe.com
// @connect      bdimg.com
// @license           AGPL
// @downloadURL https://update.greasyfork.org/scripts/445951/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/445951/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

// 文档净化
(function () {
  'use strict';

  // 注册个 MutationObserver，根治各种垃圾弹窗
  let count = 0;
  const blackListSelector = [
    '.vip-pay-pop-v2-wrap',
    '.reader-pop-manager-view-containter',
    '.fc-ad-contain',
    '.shops-hot',
    '.video-rec-wrap',
    '.pay-doc-marquee',
    '.card-vip',
    '.vip-privilege-card-wrap',
    '.doc-price-voucher-wrap',
    '.vip-activity-wrap-new',
    '.creader-root .hx-warp',
    '.hx-recom-wrapper',
    '.hx-bottom-wrapper',
    '.hx-right-wrapper.sider-edge'
  ]

  const killTarget = (item) => {
    if (item.nodeType !== Node.ELEMENT_NODE) return false;
    let el = item;
    if (blackListSelector.some(i => (item.matches(i) || (el = item.querySelector(i)))))
      el?.remove(), count++;
    return true
  }
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      killTarget(mutation.target)
      for (const item of mutation.addedNodes) {
        killTarget(item)
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  window.addEventListener("load", () => {
    console.log(`[-] 文库净化：共清理掉 ${count} 个弹窗~`);
  });
})();

// 启用 VIP，解锁继续阅读
(function () {
  'use strict';

  let pageData, pureViewPageData;
  Object.defineProperty(unsafeWindow, 'pageData', {
    set: v => pageData = v,
    get() {
      if (!pageData) return pageData;

      // 启用 VIP
      if('vipInfo' in pageData) {
        pageData.vipInfo.global_svip_status = 1;
        pageData.vipInfo.global_vip_status = 1;
        pageData.vipInfo.isVip = 1;
        pageData.vipInfo.isWenkuVip = 1;
      }

      if ('readerInfo' in pageData && pageData?.readerInfo?.htmlUrls?.json) {
        pageData.readerInfo.showPage = pageData.readerInfo.htmlUrls.json.length;
      }

      if ('appUniv' in pageData) {
        // 取消百度文库对谷歌、搜狗浏览器 referrer 的屏蔽
        pageData.appUniv.blackBrowser = [];

        // 隐藏 APP 下载按钮
        pageData.viewBiz.docInfo.needHideDownload = true;
      }

      return pageData
    }
  })
  Object.defineProperty(unsafeWindow, 'pureViewPageData', {
    set: v => pureViewPageData = v,
    get() {
      if (!pureViewPageData) return pureViewPageData;

      // 去除水印，允许继续阅读
      if('customParam' in pureViewPageData) {
        pureViewPageData.customParam.noWaterMark = 1;
        pureViewPageData.customParam.visibleFoldPage = 1;
      }

      if('readerInfo2019' in pureViewPageData) {
        pureViewPageData.readerInfo2019.freePage = pureViewPageData.readerInfo2019.page;
      }

      return pureViewPageData
    }
  })
})();




main();
async function main() {
    'use strict';
//公共方法
const zhurl =  "http://tool.zhihupe.com/";
const servers = [
    "http://wp.nanmu.cool/",
    "http://pan.10zv.com/",
];
var website = "";
var ua =""
const scriptInfo = GM_info.script;
const author = scriptInfo.author;
var Page = "";
var url = window.location.href;
var copyurl=url.replace('view','share');
var InterfaceList = [ {"name":"wkdownload1","url":"http://www.html22.com/d/?url="}];
var type = "";

 function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
//加载定时
function Toast(msg, duration = 3000) {
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(() => {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(m) }, d * 1000);
    }, duration);
}
let zhihu = {
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            }
        }
       }
let toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
 //弹窗提示
function getPage(){
    if (url.indexOf(".baidu.com/disk/main") > 0) {
            Page = "main"
        } else if (url.indexOf(".baidu.com/disk/home") > 0) {
            Page = "home"
     }
    else if (url.indexOf(".baidu.com/view/") > 0) {
            Page = "wenku"
     }

}
addbtn();
async function addbtn() {
    await sleep(1500);
    getPage();
    if (Page === 'home'){
    let button  = `<span class="g-dropdown-button" style="display: inline-block;" id="zhihuDown">
	<a class="g-button  g-button-blue blue-upload upload-wrapper"  title="智狐下载助手" >
		<span class="g-button-right">
			<em class="icon icon-download" title="智狐下载助手"></em>
			<span class="text" style="width: 80px;">智狐下载助手</span>
		</span>
	</a>
   </span>
`;
    $('#layoutMain div:has(span.g-new-create)>span.g-dropdown-button:first').before(button);
    }
     if (Page === 'main'){
     let button  = `<a id="zhihuDown"  class="nd-upload-button upload-wrapper"><button class="u-button nd-file-list-toolbar-action-item u-button--primary u-button--small is-round is-has-icon" data-v-1b8a63d2="">
		<i class="u-icon u-icon-download"></i><span style="margin-left: 5px;">智狐下载助手
		</span>
		</button>

</a>

`;
     $('.nd-main-layout__body div:has(a.nd-upload-button)>a.nd-upload-button:first').before(button);
     }
     if (Page === 'wenku'){
      let botton = `<div  style="cursor: pointer;
    position: fixed;
    top: 150px;
    left: 0px;
    width: 0px;
    z-index: 2147483647;
    font-size: 12px;
    text-align: left;">
    <div id="wenkuDown" style="position: absolute;right: 0; width: 1.375rem;padding: 10px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 5px 5px 0;transform: translate3d(100%, 5%, 0);background: #f7603e;">
    <span >文库下载助手<span>
     </div>
    </div>

    `;
       $("body").append(botton);

     }
    $('#zhihuDown').on('click', async e => {
        let file = getSelectedfileList(),
            pwd = getPwd(4);
        if (!file)
            return;
        zhihu.message.success('正在获取百度分享链接...');
        let surl = await getShortUrl(file.fs_id, pwd);
        if (!surl) {
            return zhihu.message.error('百度分享链接获取失败');
        }
        showMain(surl, pwd, file.server_filename)
		console.log(surl,pwd);

    });
    $('#wenkuDown').on('click', async e => {
        showWenku();
    });
}

//百度文库
  function showWenku(){
   let defaultpassword = "";
   detectType();
   if (localStorage.password && (Date.now() - localStorage.passwordTime) < 17280000) {
        defaultpassword = localStorage.password;
    } else {
        localStorage.password = "";
    }
   let fileName = $('h3.doc-title').text();
   var downtit ="下载PDF";
   console.log(fileName);
   if(type =="ppt"){
            downtit ="下载word(PDF)";
                     }
        else{
           downtit ="下载PDF";
     }
   let html = `<div id="mian" style="background-color: #fff;">
	  <div style="line-height: 25px;">
		<span id="title" style="color: 545454;font-size: 18px;font-weight: bold;font-size: 18px;">正在获取 ${fileName}</span>
	  </div>
		<div style="display: flex;flex-direction:column;">
			<img style="width: 130px;height: 130px;margin: 20px auto;border-radius: 5px;" src="http://cdn.wezhicms.com/uploads/allimg/20211215/1-21121500044Q94.jpg">
			<span style="font-size: 14px;color: #666;text-align: center;">微信扫描上方二维码关注公众号<br>回复"3"获取验证码</span>
            <div style="text-align: center;font-weight: bold;margin: 20px 0;height: 40px;line-height: 40px;">
				<input name="passwordCode" id="passwordCode"
                         value="${defaultpassword}" placeholder="请输入验证码" style="box-sizing:border-box;font-size: 14px; width: 150px;height: 100%;padding:0 10px ;     border: 1px solid #D4D7DE;border-radius: 8px;" />
			</div>
			<div style="display: flex;justify-content: space-between;height: 40px;line-height: 40px;">
                 <div id="dowmBtn" style="margin-right: 15px; font-size: 14px;height: 100%;width: 155px;background: #0b1628;border-radius: 10px;text-align: center;color: #fff;">${downtit}</div>
				<div id="copyBtn" style="margin-right: 15px; font-size: 14px;height: 100%;width: 125px;background: #22ab82;border-radius: 10px;text-align: center;color: #fff;">手动复制</div>
			</div>
		</div>
	  </div>
      </div>`;

    Swal.fire({
        html:html,
        width: 380,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: '交流反馈',
        cancelButtonText: '关闭',
        reverseButtons: true
    }).then(r => {
        if (r.isConfirmed)
            GM_openInTab('https://www.zhihupe.com/ask/list_21_9.html');
    });
     $('#dowmBtn').off().on("click", function () {
        let passwordCode = $("#passwordCode").val();
        if (passwordCode) {
        GM_xmlhttpRequest({
             method: "GET",
             url: "http://tool.zhihupe.com/bdwp.php?m=WENKU&author="+author+"&PWD="+passwordCode,
             headers: {
                 "Content-Type": "text/html; charset=utf-8"
              },
              onload: function(res){
                var json=JSON.parse(res.responseText);
                 if(json.error == 1){
                     if (passwordCode != localStorage.password) {
                      localStorage.password = passwordCode;
                       localStorage.passwordTime = Date.now();
                      }
                      if(type =="ppt"){
                         window.open(InterfaceList[0].url + url);
                     }
                     else{
                     $(".swal2-cancel").click();
                     $(".pdfbtn").click();
                     }
                 }else if(json.error == -2){
                   Toast('验证码错误！');
                 }else {
                   Toast('服务器请求失败，请重试！');
                 }
               },
              onerror: function(err){
                            Toast(err);
                        }
           });
        }else {
            Toast('请输入验证码！');
        }
    });
    $('#copyBtn').off().on("click", function () {
        let passwordCode = $("#passwordCode").val();
        if (passwordCode) {
        GM_xmlhttpRequest({
             method: "GET",
             url: "http://tool.zhihupe.com/bdwp.php?m=WENKU&author="+author+"&PWD="+passwordCode,
             headers: {
                 "Content-Type": "text/html; charset=utf-8"
              },
              onload: function(res){
                var json=JSON.parse(res.responseText);
                 if(json.error == 1){
                     if (passwordCode != localStorage.password) {
                      localStorage.password = passwordCode;
                       localStorage.passwordTime = Date.now();
                      }
                      $(".pure-tool-btn").click();
                      $(".swal2-cancel").click();
                 }else if(json.error == -2){
                   Toast('验证码错误！');
                 }else {
                   Toast('服务器请求失败，请重试！');
                 }
               },
              onerror: function(err){
                            Toast(err);
                        }
           });
        }else {
            Toast('请输入验证码！');
        }
    });

  }
function printDeal(){

        }
function detectType() {
    // 获取文档类型名称
    if($('div').is('.doc-title-wrap')){
      let doc_title_wrap = document.getElementsByClassName("doc-title-wrap")[0];
     let file_type = doc_title_wrap.children[0].className;
     if (file_type.search("word") !== -1) {
         type = "word";
         console.log(type);
      } else if (file_type.search("ppt") !== -1) {
        type = "ppt";
      } else if (file_type.search("excel") !== -1) {
        type = "excel";
      } else if (file_type.search("pdf") !== -1) {
        type = "pdf";
      } else if (file_type.search("txt" !== -1)) {
        type = "txt";
      } else {
        type = file_type;
      }
    }else{
      type = "word";
    }

    console.log(type);

    // 判断文档类型

}
//百度网盘
 function showMain(surl, pwd, fileName) {
    let defaultpassword = "";
    if (localStorage.password && (Date.now() - localStorage.passwordTime) < 17280000) {
        defaultpassword = localStorage.password;
    } else {
        localStorage.password = "";
    }
    let html = `<div style="background-color: #fff;">
	  <div style="height: 63px;line-height: 63px;padding-left: 15px;">
		<span id="title" style="color:#545454;font-size: 18px;font-weight: bold;text-align: left;">正在获取 ${fileName} 的直链</span>
	  </div>
	  <div style="background:#F5F6FA;padding: 15px;display: flex;box-sizing: border-box;">
		<div style="width: 50%;margin-left: 5px;">
			<div style="font-size: 14px;color:#06A7FF;text-align: center;margin:5px 15px 25px 0;" id="tip"></div>
		    <div style="margin-bottom: 20px;text-align: left;">
				<span style="font-size: 12px;">方式一：IDM用户代理（UA）必须设置为：</span><span style="color:#FF0000;font-size: 12px;font-weight: bold;" id="ua"></span>
				<div style="display: flex;height: 40px;line-height: 40px;margin-top: 20px;">
					<div id="copyIDM"></div>
					<a href="https://www.zhihupe.com/html/w10/13168.html" style="color: #09AAFF;font-size: 14px;text-decoration: none;">软件下载及教程</a>
				</div>
			</div>
			<div style="margin-bottom: 20px;text-align: left;">
				<span style="font-size: 12px;">方式二：Aria2/Motrix 无需配置，请看下方使用教程</span>
				<div style="display: flex;height: 40px;line-height: 40px;margin-top: 20px;">
					<div  id="sendAria"></div>
					<a href="https://www.zhihupe.com/html/w10/13167.html" style="color: #09AAFF;font-size: 14px;text-decoration: none;"">软件下载及教程</a>
				</div>
			</div>
			<div style="font-size: 14px;color: #FF0000;margin-bottom: 10px;text-align: left;">为防止接口被滥用，需要输入验证码</div>
			<div style="display: flex;justify-content: space-between;height: 40px;line-height: 40px;">
				<input name="passwordCode" id="passwordCode"
                         value="${defaultpassword}" placeholder="请输入验证码" style="box-sizing: border-box; width: 150px;height: 100%;padding:0 10px ;     border: 1px solid #D4D7DE;border-radius: 8px;" />
				<div id="dowmBtn" style="margin-right: 15px; font-size: 14px;height: 100%;width: 125px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;">点击获取直链</div>
			</div>
		</div>
		<div style="width: 50%;display: flex;flex-direction:column;">
			<img style="width: 130px;height: 130px;margin: 20px auto;border-radius: 5px;" src="http://cdn.wezhicms.com/uploads/allimg/20211215/1-21121500044Q94.jpg">
			<span style="font-size: 14px;color: #666;text-align: center;">微信扫描上方二维码获取验证码</span>
			<h1 style="text-align: center; font-size: 18px;font-weight: bold;margin: 20px 0;">解析步骤</h1>
			<div style="font-size: 14px;color: #000;margin-left:15px;text-align: left;">
				<div style="line-height: 3;">1.关注公众号【智狐百宝箱】</div>
                <div style="line-height: 3;">2.回复‘解析’获取验证码</div>
                <div style="line-height: 3;">3.将验证码输入左边输入框中，点击获取高速直链！</div>
			</div>
		</div>
	  </div>
      <div style="font-size: 12px;color: #878C9C;line-height: 18px;text-align: center;height: 35px;padding-top: 15px;background-color: #F5F6FA; border-top: 1px solid #F0F0F2;"><span style="color:red;padding-right:5px">每晚23点到凌晨30分维护服务器，脚本暂停使用</span>大家有问题点击下方的交流反馈进行反应，脚本的问题也会第一时间交流区公布</div>
	</div>`;

    Swal.fire({
        html:html,
        width: 780,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: '交流反馈',
        cancelButtonText: '关闭',
        reverseButtons: true
    }).then(r => {
        if (r.isConfirmed)
            GM_openInTab('https://www.zhihupe.com/ask/list_21_9.html');
    });

    $('#dowmBtn').off().on("click", function () {
        website = servers[Math.floor(Math.random()*servers.length)];
        console.log(website)
        let passwordCode = $("#passwordCode").val();
      if (passwordCode) {
        GM_xmlhttpRequest({
             method: "GET",
             url: "http://tool.zhihupe.com/bdwpcs.php?m=WANPAN&author="+author+"&PWD="+passwordCode+"&website="+website,
             headers: {
                 "Content-Type": "text/html; charset=utf-8"
              },
              onload: function(res){
				console.log(res.responseText)
                var json=JSON.parse(res.responseText);
                 if(json.error == 1){
                     if (passwordCode != localStorage.password) {
                      localStorage.password = passwordCode;
                       localStorage.passwordTime = Date.now();
                      }
                     let password = json.code;
                      ua = json.ua;
                     getLink(password);
                     $("#tip").html("正在获取链接，请稍等！");
                 }else if(json.error == -2){
                   let msg =json.msg
                   Toast(msg);
                 }else {
                   Toast('服务器请求失败，请重试！');
                 }
               },
              onerror: function(err){
                            Toast(err);
                        }
           });
        }else {
            Toast('请输入验证码！');
        }
    });

    function getLink(passwordCode) {
        (async () => {
            let exception = null;
                try {
                    let str = await getFileInfo(surl, pwd, passwordCode, website);
					console.log(surl, pwd, passwordCode, website);
                    return await getLinkCommon(str, website);
                } catch (e) {
                    exception = e;
                }
            throw exception;
        })().then(link => {
            $("#tip").html("高速链接获取成功！！！");
            $("#title").html(`获取 ${fileName} 的高速直链成功`);
            $("#ua").html(`${ua}`);
            $("#copyIDM").html(`<div style="margin-right: 15px; font-size: 14px;height: 100%;width: 175px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;">复制IDM链接到剪贴板</div>`)
            $('#copyIDM').off().on('click', e => {
                GM_setClipboard(link);
                Toast('已复制IDM链接到剪贴板');
            });
            $("#sendAria").html(`<div style="margin-right: 15px; font-size: 14px;height: 100%;width: 175px;background: #09AAFF;border-radius: 20px;text-align: center;color: #fff;">发送到Aria2(motix)</div>`);
            $('#sendAria').off().on('click', e => showAria(link, fileName));
        }).catch(e => {
            $("#title").html(`获取 ${fileName} 的高速直链失败`)
            $("#tip").html(`获取高速链接<span style="font-weight:800;color:red">失败！！！</span>,原因是${e}`)
        });
    }

}
 function getPwd(len) {
        len = len || 4;
        let $char = 'abcdefhijkmnprstwxyz123456789';
        let l = $char.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $char.charAt(Math.floor(Math.random() * l));
        }
        return pwd;
}
function getList() {
    try {
                return require('system-core:context/context.js').instanceForSystem.list.getSelected();
            } catch (e) {
                return document.querySelector('.nd-main-list').__vue__.selectedList;
            }
    }
function getSelectedfileList() {
    let list = getList();
    if (list && list.length === 1) {
        if (list[0].isdir === 1) {
            return zhihu.message.error('提示：请打开文件夹后勾选文件！');
        }
        return list[0];
    }else if(list.length > 1){
       return zhihu.message.error('提示：不要同时勾选多个文件');
    }else{
       return zhihu.message.error('提示：请先勾选要下载的文件！');
    }

}

function getShortUrl(fs_id, pwd) {
    let bdstoken = '';
    return fetch(`https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "text/plain;charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "none"
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `fid_list=[${fs_id}]&schannel=4&channel_list=[]&period=1&pwd=` + pwd,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(r => r.json()).then(r => r.shorturl.replace(/^.+\//, '')).catch(e => null);
}


function getFileInfo(surl, pwd, passwordCode, website) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            data: `surl=${surl}&pwd=${pwd}&Password=` + passwordCode,
            url: website,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            onload: res => {
                if (res.status != 200)
                    return reject(res);
                resolve(res.responseText);
				console.log(res.responseText)
            },
            onerror: err => reject(err)
        });
    }).then(r => {
        let m = r.match(/javascript:confirmdl\((.+)\);/);
		console.log(m);
        if (m) return m[1];
        return Promise.reject($(r).find('div.alert.alert-danger').text().trim() || `获取下载信息失败`);
    });
}
function getParam(str) {
    function fetch_token(fs_id, timestamp, sign, randsk, share_id, uk, bdstoken, filesize) {
        let base64 = btoa(fs_id + sign + uk);
        let base642 = btoa("nbest" + base64 + fs_id + "Yuan_Tuo" + share_id + sign + base64 + "baiduwp-php-donate");
        let md5 = CryptoJS.MD5(base642 + timestamp + base64).toString()
        return md5;
    }
    function urlEncode(obj) {
        return Array.isArray(obj) ? obj.map(o => urlEncode(o)).join('&') : Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    }
    let arr = str.replace(/'/g,'').split(',');
    arr.push(fetch_token(...arr));
    return urlEncode(['fs_id', 'time', 'sign', 'randsk', 'share_id', 'uk', 'bdstoken', 'filesize', 'token'].reduce((t, v, i) => (t[v] = arr[i]) && t, {}));
}
function getLinkCommon(str, website) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            data: getParam(str),
            url: website + "/?download",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            onload: res => {
                if (res.status != 200)
                    return reject(res);
                resolve(res.responseText);
            },
            onerror: err => reject(err)
        });
    }).then(r => {
        let link = $(r).find('#https').attr('href');
        if (link)
            return link;
        return Promise.reject($(r).find('div.alert.alert-danger').text().trim() || '获取直链失败');
    });
}
function showAria(url, filename) {
    Swal.fire({
        title: '发送到 Aria2 Json-RPC',
        html: `<div style="width:95%;text-align:left;">
         <label>RPC地址:</label>
         <input id="wsurl" class="swal2-input" style="width:100%;margin:10px 0;" value="${localStorage.wsurl || ''}">
          <div style="width:100%;margin:10px 0;"><small style="text-align:left;">推送aria2默认配置:<b>ws://localhost:6800/jsonrpc</b><br>推送Motrix默认配置:<b>ws://localhost:16800/jsonrpc</b></small></div>
         <label>Token:</label>
         <input id="token" class="swal2-input" style="width:100%;margin:10px 0;" value="${localStorage.wsToken || ''}">
         <div style="width:100%;margin:10px 0;"><small style="text-align:left;">没有token的话，留空</small></div>
         </div>`,
        allowOutsideClick: false,
        focusConfirm: false,
        confirmButtonText: '发送',
        showCancelButton: true,
        cancelButtonText: '取消',
        reverseButtons: true,
        preConfirm: () => {
            let wsurl = $('#wsurl').val();
            if (!wsurl) {
                Swal.showValidationMessage('RPC地址必填');
                return;
            }
        }
    }).then(r => r.isConfirmed && addUri(url, filename));
}

function addUri(url, filename) {
    var wsurl = localStorage.wsurl = $('#wsurl').val();
    var uris = [url.replace('https:', 'http:'), url];
    var token = localStorage.wsToken = $('#token').val();

    var options = {
        "max-connection-per-server": "16",
        "user-agent": ua
    };
    if (filename != "") {
        options.out = filename;
    }

    let json = {
        "id": "baiduwp-php",
        "jsonrpc": '2.0',
        "method": 'aria2.addUri',
        "params": [uris, options],
    };

    if (token != "") {
        json.params.unshift("token:" + token);
    }

    let patt = /^wss?\:\/\/(((([A-Za-z0-9]+[A-Za-z0-9\-]+[A-Za-z0-9]+)|([A-Za-z0-9]+))(\.(([A-Za-z0-9]+[A-Za-z0-9\-]+[A-Za-z0-9]+)|([A-Za-z0-9]+)))*(\.[A-Za-z0-9]{2,10}))|(localhost)|((([01]?\d?\d)|(2[0-4]\d)|(25[0-5]))(\.([01]?\d?\d)|(2[0-4]\d)|(25[0-5])){3})|((\[[A-Za-z0-9:]{2,39}\])|([A-Za-z0-9:]{2,39})))(\:\d{1,5})?(\/.*)?$/;
    if (!patt.test(wsurl)) {
        Swal.fire('地址错误', 'WebSocket 地址不符合验证规则，请检查是否填写正确！', 'error');
        return;
    }
    var ws = new WebSocket(wsurl);

    ws.onerror = event => {
        console.log(event);
        Swal.fire('连接错误', 'Aria2 连接错误，请打开控制台查看详情！', 'error');
    };
    ws.onopen = () => {
        ws.send(JSON.stringify(json));
    }

    ws.onmessage = event => {
        console.log(event);
        let received_msg = JSON.parse(event.data);
        if (received_msg.error !== undefined) {
            if (received_msg.error.code === 1)
                Swal.fire('通过RPC连接失败', '请打开控制台查看详细错误信息，返回信息：' + received_msg.error.message, 'error');
        }
        switch (received_msg.method) {
            case "aria2.onDownloadStart":
                Swal.fire('Aria2 发送成功', 'Aria2 已经开始下载！' + filename, 'success');

                localStorage.setItem('aria2wsurl', wsurl); // add aria2 config to SessionStorage
                if (token != "" && token != null)
                    localStorage.setItem('aria2token', token);
                break;

            case "aria2.onDownloadError": ;
                Swal.fire('下载错误', 'Aria2 下载错误！', 'error');
                break;

            case "aria2.onDownloadComplete":
                Swal.fire('下载完成', 'Aria2 下载完成！', 'success');
                break;

            default:
                break;
        }
    };
}

}
//本段代码取自：https://greasyfork.org/scripts/438420
(function () {
  'use strict';

  // 拿到阅读器的 Vue 实例
  // https://github.com/EHfive/userscripts/tree/master/userscripts/enbale-vue-devtools
  function observeVueRoot(callbackVue) {
    const checkVue2Instance = (target) => {
      const vue = target && target.__vue__
      return !!(
        vue
        && (typeof vue === 'object')
        && vue._isVue
        && (typeof vue.constructor === 'function')
      )
    }

    const vue2RootSet = new WeakSet();
    const observer = new MutationObserver(
      (mutations, observer) => {
        const disconnect = observer.disconnect.bind(observer);
        for (const { target } of mutations) {
          if (!target) {
            return
          } else if (checkVue2Instance(target)) {
            const inst = target.__vue__;
            const root = inst.$parent ? inst.$root : inst;
            if (vue2RootSet.has(root)) {
              // already callback, continue loop
              continue
            }
            vue2RootSet.add(root);
            callbackVue(root, disconnect);
          }
        }
      }
    );
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      childList: true
    });
    return observer
  }
  observeVueRoot((el, disconnect) => {
    while (el.$parent) {
      // find base Vue
      el = el.$parent
    }

    const findCreader = (root, selector) => {
      if (!root) return null;
      if (root?.$el?.nodeType === Node.ELEMENT_NODE && root?.$el?.matches('#creader-app') && 'creader' in root) return root.creader;

      for (const child of root.$children) {
        let found = findCreader(child, selector);
        if (found) return found;
      }
      return null;
    }

    if (unsafeWindow['__creader__'] || (unsafeWindow['__creader__'] = findCreader(el))) disconnect();
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const loadScript = url => new Promise((resolve, reject) => {
    const removeWrap = (func, ...args) => {
      if (script.parentNode) script.parentNode.removeChild(script);
      return func(...args)
    }

    const script = document.createElement('script');
    script.src = url;
    script.onload = removeWrap.bind(null, resolve);
    script.onerror = removeWrap.bind(null, reject);
    document.head.appendChild(script);
  })

  const loadJsPDF = async () => {
    if (unsafeWindow.jspdf) return unsafeWindow.jspdf;
    await loadScript('https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js');
    return unsafeWindow.jspdf;
  }

  window.addEventListener('DOMContentLoaded', async () => {
    const creader = unsafeWindow?.__creader__;
    if (!creader) {
      console.error('[x] creader is undefined');
      return
    }

    const showStatus = (text='', progress=-1) => {
      document.querySelector('.s-top.s-top-status').classList.add('show');
      if(text) document.querySelector('.s-panel .s-text').innerHTML = text;
      if (progress >= 0) {
        progress = Math.min(progress, 100);
        document.querySelector('.s-panel .s-progress').style.width = `${Math.floor(progress)}%`;
        document.querySelector('.s-panel .s-progress-text').innerHTML = `${Math.floor(progress)}%`;
      }
    }

    const hideStatus = () => {
      document.querySelector('.s-top.s-top-status').classList.remove('show');
    }

    let lastMessageTimer;
    const showMessage = (msg, time=3000) => {
      const msgEl = document.querySelector('.s-top.s-top-message');
      msgEl.classList.add('show');
      document.querySelector('.s-top.s-top-message .s-message').innerHTML = msg;
      clearTimeout(lastMessageTimer);
      lastMessageTimer = setTimeout(() => msgEl.classList.remove('show'), time);
    }

    const loadImage = (url) => new Promise(async (resolve, reject) => {
      if (!url) {
        resolve(null);
        return;
      }

      let img = await request('GET', url, null, 'blob');
      let imgEl = document.createElement('img');
      imgEl.onload = () => {
        resolve(imgEl);
      }
      imgEl.onabort = imgEl.onerror = reject;
      imgEl.src = URL.createObjectURL(img);
    })

    const drawNode = async (doc, page, node) => {
      if (node.type == 'word') {
        for (let font of node.fontFamily) {
          font = /['"]?([^'"]+)['"]?/.exec(font)
          if (!font || page.customFonts.indexOf(font[1]) === -1) continue;

          doc.setFont(font[1], node.fontStyle);
          break;
        }

        doc.setTextColor(node.color);
        doc.setFontSize(node.fontSize);

        const options = {
          charSpace: node.letterSpacing,
          baseline: 'top'
        };
        const transform = new doc.Matrix(
          node.matrix?.a ?? node.scaleX,
          node.matrix?.b ?? 0,
          node.matrix?.c ?? 0,
          node.matrix?.d ?? node.scaleY,
          node.matrix?.e ?? 0,
          node.matrix?.f ?? 0);

        if (node.useCharRender) {
          for (const char of node.chars)
            doc.text(char.text, char.rect.left, char.rect.top, options, transform);
        } else {
          doc.text(node.content, node.pos.x, node.pos.y, options, transform);
        }
      } else if (node.type == 'pic') {
        let img = page._pureImg;
        if (!img) {
          console.debug('[+] page._pureImg is undefined, loading...');
          img = await loadImage(node.src);
        }

        if (!('x1' in node.pos)) {
          node.pos.x0 = node.pos.x1 = node.pos.x;
          node.pos.y1 = node.pos.y2 = node.pos.y;
          node.pos.x2 = node.pos.x3 = node.pos.x + node.pos.w;
          node.pos.y0 = node.pos.y3 = node.pos.y + node.pos.h;
        }

        const canvas = document.createElement('canvas');
        const [w, h] = [canvas.width, canvas.height] = [node.pos.x2 - node.pos.x1, node.pos.y0 - node.pos.y1];
        const ctx = canvas.getContext('2d');

        if (node.pos.opacity && node.pos.opacity !== 1) ctx.globalAlpha = node.pos.opacity;
        if (node.scaleX && node.scaleX !== 1) ctx.scale(node.scaleX, node.scaleY);
        if (node.matrix) ctx.transform(node.matrix.a ?? 1, node.matrix.b ?? 0, node.matrix.c ?? 0, node.matrix.d ?? 1, node.matrix.e ?? 0, node.matrix.f ?? 0);

        ctx.drawImage(img, node.picPos.ix, node.picPos.iy, node.picPos.iw, node.picPos.ih, 0, 0, node.pos.w, node.pos.h);
        doc.addImage(canvas, 'PNG', node.pos.x1, node.pos.y1, w, h);

        canvas.remove();
      }
    }

    const request = (method, url, data, responseType = 'text') => new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method,
        url,
        data,
        responseType,
        onerror: reject,
        ontimeout: reject,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve(responseType === 'text' ? response.responseText : response.response);
          } else {
            reject(new Error(response.statusText));
          }
        }
      });
    });

    const loadFont = async (doc, page) => {
      const apiBase = 'https://wkretype.bdimg.com/retype';
      let params = ["pn=" + page.index, "t=ttf", "rn=1", "v=" + page.readerInfo.pageInfo.version].join("&");
      let ttf = page.readerInfo.ttfs.find(ttf => ttf.pageIndex === page.index)
      if (!ttf) return;

      let resp = await request('GET', apiBase + "/pipe/" + page.readerInfo.storeId + "?" + params + ttf.params)
      if (!resp) return;
      resp = resp.replace(/[\n\r ]/g, '');

      let fonts = [];
      let blocks = resp.matchAll(/@font-face{[^{}]+}/g);
      for (const block of blocks) {
        const base64 = block[0].match(/url\(["']?([^"']+)["']?\)/);
        const name = block[0].match(/font-family:["']?([^;'"]+)["']?;/);
        const style = block[0].match(/font-style:([^;]+);/);
        const weight = block[0].match(/font-weight:([^;]+);/);
        if (!base64 || !name) throw new Error('failed to parse font');
        fonts.push({
          name: name[1],
          style: style ? style[1] : 'normal',
          weight: weight ? weight[1] : 'normal',
          base64: base64[1]
        })
      }

      for (const font of fonts) {
        doc.addFileToVFS(`${font.name}.ttf`, font.base64.slice(font.base64.indexOf(',') + 1));
        doc.addFont(`${font.name}.ttf`, font.name, font.style, font.weight);
      }
    }

    const downloadPDF = async (pageRange = [...Array(creader.readerDocData.page).keys()]) => {
      const version = 6;

      showStatus('正在加载', 0);

      // 强制加载所有页面
      creader.loadNextPage(Infinity, true);
      console.debug('[+] pages:', creader.renderPages);

      const jspdf = await loadJsPDF();

      let doc;
      for (let i = 0; i < pageRange.length; i++) {
        if(pageRange[i] >= creader.renderPages.length) {
          console.warn('[!] pageRange[i] >= creader.renderPages.length, skip...');
          continue;
        }

        showStatus('正在准备', ((i + 1) / pageRange.length) * 100);
        const page = creader.renderPages[pageRange[i]];

        // 缩放比例设为 1
        page.pageUnDamageScale = page.pageDamageScale = () => 1;

        if (creader.readerDocData.readerType === 'html_view')
          await page.loadXreaderContent()

        if (creader.readerDocData.readerType === 'txt_view')
          await page.loadTxtContent()

        if (page.readerInfo.pageInfo.version !== version) {
          throw new Error(`脚本已失效： 文库版本号=${page.readerInfo.pageInfo.version}, 脚本版本号=${version}`);
        }

        const pageSize = [page.readerInfo.pageInfo.width, page.readerInfo.pageInfo.height]
        if (!doc) {
          doc = new jspdf.jsPDF(pageSize[0] < pageSize[1] ? 'p' : 'l', 'pt', pageSize);
        } else {
          doc.addPage(pageSize);
        }

        showStatus('正在下载图片');
        page._pureImg = await loadImage(page.picSrc);

        showStatus('正在加载字体');
        await loadFont(doc, page);

        showStatus('正在绘制');
        for (const node of page.nodes) {
          await drawNode(doc, page, node);
        }

        if(page._pureImg?.src) URL.revokeObjectURL(page._pureImg.src);
        page._pureImg?.remove();
      }

      doc.save(`${unsafeWindow?.pageData?.title?.replace(/ - 百度文库$/, '') ?? 'export'}.pdf`);
    }

    // 添加需要用到的样式
    async function injectUI() {
      const pdfButton = `<div class="pdfbtn"><svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1991" width="24" height="24"><path d="M821.457602 118.382249H205.725895c-48.378584 0-87.959995 39.583368-87.959996 87.963909v615.731707c0 48.378584 39.581411 87.959995 87.959996 87.959996h615.733664c48.380541 0 87.961952-39.581411 87.961952-87.959996V206.346158c-0.001957-48.378584-39.583368-87.963909-87.963909-87.963909zM493.962468 457.544987c-10.112054 32.545237-21.72487 82.872662-38.806571 124.248336-8.806957 22.378397-8.380404 18.480717-15.001764 32.609808l5.71738-1.851007c58.760658-16.443827 99.901532-20.519564 138.162194-27.561607-7.67796-6.06371-14.350194-10.751884-19.631237-15.586807-26.287817-29.101504-35.464584-34.570387-70.440002-111.862636v0.003913z m288.36767 186.413594c-7.476424 8.356924-20.670227 13.191847-40.019704 13.191847-33.427694 0-63.808858-9.229597-107.79277-31.660824-75.648648 8.356924-156.097 17.214754-201.399704 31.729308-2.199293 0.876587-4.832967 1.759043-7.916674 3.077836-54.536215 93.237125-95.031389 132.767663-130.621199 131.19646-11.286054-0.49895-27.694661-7.044-32.973748-10.11988l-6.52157-6.196764-2.29517-4.353583c-3.07588-7.91863-3.954423-15.395054-2.197337-23.751977 4.838837-23.309771 29.907651-60.251638 82.686779-93.237126 8.356924-6.159587 27.430511-15.897917 45.020944-24.25484 13.311204-21.177004 19.45905-34.744531 36.341171-72.259702 19.102937-45.324228 36.505531-99.492589 47.500041-138.191543v-0.44025c-16.267727-53.219378-25.945401-89.310095-9.67376-147.80856 3.958337-16.71189 18.46702-33.864031 34.748444-33.864031h10.552304c10.115967 0 19.791684 3.520043 26.829814 10.552304 29.029107 29.031064 15.39114 103.824649 0.8805 162.323113-0.8805 2.63563-1.322707 4.832967-1.761 6.153717 17.59239 49.697378 45.400538 98.774492 73.108895 121.647926 11.436717 8.791304 22.638634 18.899444 36.71098 26.814161 19.791684-2.20125 37.517128-4.11487 55.547812-4.11487 54.540128 0 87.525615 9.67963 100.279169 30.351814 4.400543 7.034217 6.595923 15.389184 5.281043 24.1844-0.44025 10.996467-4.39663 21.112434-12.31526 29.031064z m-27.796407-36.748157c-4.394673-4.398587-17.024957-16.936907-78.601259-16.936907-3.073923 0-10.622744-0.784623-14.57521 3.612007 32.104987 14.072347 62.830525 24.757704 83.058545 24.757703 3.083707 0 5.72325-0.442207 8.356923-0.876586h1.759044c2.20125-0.8805 3.520043-1.324663 3.960293-5.71738-0.87463-1.324663-1.757087-3.083707-3.958336-4.838837z m-387.124553 63.041845c-9.237424 5.27713-16.71189 10.112054-21.112433 13.634053-31.226444 28.586901-51.018128 57.616008-53.217422 74.331812 19.789727-6.59788 45.737084-35.626987 74.329855-87.961952v-0.003913z m125.574957-297.822284l2.197336-1.761c3.079793-14.072347 5.232127-29.189554 7.87167-38.869184l1.318794-7.036174c4.39663-25.070771 2.71781-39.720334-4.76057-50.272637l-6.59788-2.20125a57.381208 57.381208 0 0 0-3.079794 5.27713c-7.474467 18.47289-7.063567 55.283661 3.0524 94.865072l-0.001956-0.001957z" fill="currentColor" p-id="1992"></path></svg></div>`
      const statusOverlay = `<div class="s-top s-top-status"><div class="s-panel"><div class="s-progress-wrapper"><div class="s-progress"></div></div><div class="s-status" style=""><div class="s-text" style="">正在加载...</div><div class="s-progress-text">0%<div></div></div></div></div></div>`;
      const messageOverlay = `<div class="s-top s-top-message"><div class="s-message">testtest</div></div>`;

      document.body.insertAdjacentHTML('afterbegin', statusOverlay);
      document.body.insertAdjacentHTML('afterbegin', messageOverlay);
      document.querySelector('.tool-bar-wrapper')?.insertAdjacentHTML('afterbegin', pdfButton);
      document.head.appendChild(document.createElement('style')).innerHTML = `
        .pdfbtn {
           display:none
        }

        .s-btn-pdf:hover {
          background-color: #6c32bc;
          cursor: pointer;
        }

        .s-top {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 2000;
          padding-top: 40vh;
          display: none;
        }

        .s-top.s-top-message {
          text-align: center;
        }

        .s-message {
          background-color: #000000aa;
          color: white;
          padding: 8px 14px;
          text-align: center;
          font-size: 18px;
          border-radius: 6px;
          display: inline-block;
        }

        .s-top.s-top-status {
          z-index: 1000;
          cursor: wait;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px) saturate(1.8);
        }

        .s-top.show {
          display: block;
        }

        .s-panel {
          background: white;
          width: 90%;
          max-width: 480px;
          border-radius: 12px;
          padding: 14px 24px;
          margin: 0 auto;
        }

        .s-progress-wrapper {
          height: 24px;
          border-radius: 12px;
          width: 100%;
          background-color: #eeeff3;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .s-progress {
          background-color: #f7603e;
          height: 24px;
          width: 0;
          transition: width 0.2s ease;
        }

        .s-status {
          display: flex;
          font-size: 14px;
        }

        .s-text {
          flex-grow: 1;
          color: #5f5f5f;
        }

        .s-progress-text {
          color: #f7603e;
          font-weight: bold;
        }

        .s-message {

        }
      `;
    }

    injectUI();

    const exportPDF = async (...args) => {
      try {
        await downloadPDF(...args);
        showMessage(`已成功导出，共计 ${creader.readerDocData.page} 页~`);
      } catch (error) {
        console.error('[x] failed to export:', error);
        showMessage('导出失败：'+error?.message ?? error);
      } finally {
        hideStatus();
      }
    }

    document.querySelector('.pdfbtn').onclick = ()=>exportPDF();
    unsafeWindow['downloadPDF'] = exportPDF;
  });
})();