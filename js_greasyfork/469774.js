// ==UserScript==
// @name        百度网盘Svip会员破解青春版
// @namespace   http://tampermonkey.net/
// @match       https://pan.baidu.com/
// @match       https://pan.baidu.com/*
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_openInTab
// @run-at      document-start
// @noframes
// @require     https://lib.baomitu.com/jquery/3.5.1/jquery.min.js
// @require     https://lib.baomitu.com/hls.js/latest/hls.js
// @version     1.4.0
// @license     GPL
// @author      Gwen
// @downloadUrl https://greasyfork.org/scripts/469774-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88/code/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98Svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88.user.js
// @homepageUrl https://greasyfork.org/zh-CN/scripts/469774-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88
// @description 修改所有可改的身份信息，修改成超级会员身份，可以使用网站自带的倍速、字幕等功能。
// @downloadURL https://update.greasyfork.org/scripts/469774/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98Svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469774/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98Svip%E4%BC%9A%E5%91%98%E7%A0%B4%E8%A7%A3%E9%9D%92%E6%98%A5%E7%89%88.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //浏览历史模块，不需要的话删掉以下↓
    GM_addStyle(".bdh-button{z-index:10000;font-size:14px;width:60px;height:30px;line-height:30px;text-align:center;color:black;position:absolute;left:calc(20vw);top:10px;cursor:pointer}.bdh-panel{z-index:10000;background:white;position:fixed;left:20px;top:20px;width:390px;border:1px solid #000}.bdh-header{position:relative;height:30px;background:rgb(250, 250, 250);cursor:move}.bdh-close{position:absolute;right:10px;top:0;font-size:19px;cursor:pointer}.bdh-body{min-height:200px;max-height:500px;overflow-y:auto;overflow-x:hidden}.bdh-group{padding:10px;border-bottom:1px solid #d3d3d3}.bdh-group-header{color:gray;font-size:14px;margin-bottom:5px}.bdh-group-item{position:relative;width:100%;height:80px;padding:5px;box-sizing:border-box;border-bottom:1px solid #d3d3d3;cursor:pointer;display:flex}.bdh-group-item.picture{display:inline-block;border-bottom:none;width:80px}.bdh-group-item:nth-last-child(1){border-bottom:none}.bdh-group-item-image{width:70px;height:70px;object-fit:cover;display:inline-block;margin-right:5px}.bdh-group-item-image.video{width:90px}.bdh-group-item-video{position:absolute;left:5px;top:5px;width:90px;height:70px;background-color:rgba(0,0,0,.4)}.bdh-group-item-video-play{position:absolute;top:18px;left:35px;border-width:17px;border-style:solid;border-color:transparent transparent transparent #fff}.bdh-group-item-info{display:inline-block;max-width:280px;min-width:280px;height:70px;position:relative}.bdh-group-item-info.video{display:inline-block;max-width:260px;height:70px;position:relative}.bdh-group-item-info.picture{display:none}.bdh-group-item-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all}.bdh-group-item-record{position:absolute;left:0;bottom:0;font-size:14px;color:gray}");const bd_history_store={};function createElement(type,className){let d=document.createElement(type);d.className=className;return d}function initPanel(){let panel=createElement("div","bdh-panel");let header=createElement("div","bdh-header");let close=createElement("div","bdh-close");close.innerText="×";let body=createElement("div","bdh-body");header.appendChild(close);panel.appendChild(header);panel.appendChild(body);document.body.appendChild(panel);let lastX=GM_getValue("box_last_x",100);let lastY=GM_getValue("box_last_y",100);panel.style.left=lastX+"px";panel.style.top=lastY+"px";panel.style.display="none";header.addEventListener("mousedown",makeDraggableFunction(panel,false,null,()=>{GM_setValue("box_last_x",parseInt(panel.style.left));GM_setValue("box_last_y",parseInt(panel.style.top))}),false);let showButton=createElement("span","bdh-button");showButton.innerText="浏览历史";document.body.appendChild(showButton);showButton.addEventListener("click",e=>{showButton.style.display="none";panel.style.display="block";body.innerHTML="";getHistory()});close.addEventListener("click",e=>{panel.style.display="none";showButton.style.display="block"})}function makeDraggableFunction(elem,allowMoveOut,exec,callback){let handleMouseDown=function(event){let offsetX=parseInt(elem.style.left);let offsetY=parseInt(elem.style.top);let innerX=event.clientX-offsetX;let innerY=event.clientY-offsetY;if(!!exec){exec()}document.onmousemove=function(event){elem.style.left=event.clientX-innerX+"px";elem.style.top=event.clientY-innerY+"px";if(!allowMoveOut){if(parseInt(elem.style.left)<=0){elem.style.left="0px"}if(parseInt(elem.style.top)<=0){elem.style.top="0px"}if(parseInt(elem.style.left)>=window.innerWidth-parseInt(elem.style.width)){elem.style.left=window.innerWidth-parseInt(elem.style.width)+"px"}if(parseInt(elem.style.top)>=window.innerHeight-parseInt(elem.style.height)){elem.style.top=window.innerHeight-parseInt(elem.style.height)+"px"}}};document.onmouseup=function(){document.onmousemove=null;document.onmouseup=null;if(!!callback){callback()}}};return handleMouseDown}function getHistory(){let url="https://pan.baidu.com/recent/list?";let params={app_id:"250528",vip:"2",version:"11.14.0",queryfree:"0",channel:"iPhone_14.4.2_iPhone11ProMax_chunlei_1099a_wifi",apn_id:"1_0",network_type:"wifi",freeisp:"0",activestatus:"0",time:(new Date).getTime(),clienttype:"1",bgstatus:"1",need_detail:"1"};Object.keys(params).forEach(k=>{console.log(k);url+=k+"="+params[k]+"&"});fetch(url,{method:"GET",credentials:"include",headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(res=>{return res.json()}).then(res=>{console.log("res: ",res);resolveHistory(res.list)})}async function download(fsid){let url=await fetch("https://pan.baidu.com/api/gettemplatevariable?clienttype=0&app_id=250528&web=1&fields=[%22sign1%22,%22sign2%22,%22sign3%22,%22timestamp%22]").then(res=>{return res.json()}).then(a=>{console.log(a);a=a.result;let s=a.sign1,r=a.sign2,c=a.sign3,l=a.timestamp;let u=new Function("return "+a.sign2)();let sign=btoa(u(c,s));let url=`https://pan.baidu.com/api/download?clienttype=0&app_id=250528&web=1
      &fidlist=[${fsid}]&type=dlink&vip=2&sign=${encodeURIComponent(sign)}&timestamp=${l}`;return fetch(url).then(res=>res.json()).then(res=>{console.log("下载链接："+res.dlink[0].dlink);GM_openInTab(res.dlink[0].dlink)})})}function resolveHistory(list){let bdhBody=$(".bdh-body");for(let group of list){console.log(group);let groupElem=$('<div class="bdh-group"></div>');groupElem.append(`<div class="bdh-group-header">
                ${formatTime(group.smtime)}&nbsp;&nbsp;${group.clienttype}查看
            </div>`);let count=0;for(let item of group.detail){let tag=item.category==1?" video":item.category==3?" picture":"";let itemElem=$(`<div class="bdh-group-item${tag}">
                <img class="bdh-group-item-image${tag}" src="${item.thumbs?item.thumbs.url3:""}" alt="无图片">
                ${item.category==1?'<div class="bdh-group-item-video"><div class="bdh-group-item-video-play"></div></div>':""}
                <div class="bdh-group-item-info${tag}">
                    <div class="bdh-group-item-title" title="${item.server_filename}">${item.server_filename}</div>
                    ${item.category==1&&group.view_time?'<div class="bdh-group-item-record">播放至 '+formatViewTime(group.view_time[count])+"/"+formatViewTime(item.duration)+"</div>":""}
                </div>
            </div>`);itemElem.attr("count",count);groupElem.append(itemElem);itemElem.click(function(e){let url="";let category=item.category;if(category==1){url="https://pan.baidu.com/pfile/video?path="+encodeURIComponent(item.path);GM_openInTab(url)}else if(category==2){console.log(this.getAttribute("count"));download(group.fsids[this.getAttribute("count")])}else if(category==3){download(group.fsids[this.getAttribute("count")])}else if(category==4){url="https://pan.baidu.com/pfile/docview?path="+encodeURIComponent(item.path);GM_openInTab(url)}else if(category==5){}});count++}bdhBody.append(groupElem)}}function formatTime(timestamp){let now=new Date;let nowTime=now.getTime();nowTime/=1e3;if(nowTime-timestamp<60){return"刚刚"}else if(nowTime-timestamp<60*60){return Math.floor((nowTime-timestamp)/60)+"分钟前"}else if(nowTime-timestamp<24*60*60){return Math.floor((nowTime-timestamp)/60/24)+"小时前"}else{let result="";let date=new Date(timestamp*1e3);if(date.getFullYear()!=now.getFullYear()){result+=date.getFullYear()+"-"}let M=date.getMonth()+1;let d=date.getDate();let h=date.getHours()<10?"0"+date.getHours():date.getHours();let m=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();let s=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();result+=M+"-"+d+" "+h+":"+m+":"+s;return result}}function formatViewTime(time){let h=Math.floor(time/60/24);h=h<10?"0"+h:h;let m=Math.floor(time/60%24);m=m<10?"0"+m:m;let s=Math.floor(time%60);s=s<10?"0"+s:s;return h+":"+m+":"+s}
  //浏览历史模块，不需要的话删掉以上↑

  var store = {
    path: null,
    adToken: null,
    bdstoken: null,
    resolutionPattern: /M3U8_AUTO_([0-9]+?)&/,
    timePoints: null,
    captureHls: null,
    shareFilePage: /\/s\/.*?\?fid=.*?/.test(location.href),
    originalOpen: null,
    newOpen: null,
  }
  store.path = new URLSearchParams(new URL(location.href).search).get('path');

  function createElement(tag, clazz, attrs) {
    const elem = document.createElement(tag);
    elem.className = clazz;
    if (attrs) {
      for (let key in attrs) {
        elem[key] = attrs[key];
      }
    }
    return elem;
  }

  function hookRequest() {
    var originalOpen = XMLHttpRequest.prototype.open;
    store.originalOpen = originalOpen
    XMLHttpRequest.prototype.open = function (method, url) {
      if (url.indexOf('/api/loginStatus') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            let res = JSON.parse(this.responseText)
            res.login_info.vip_type = '21'
            res.login_info.vip_identity = '21'
            res.login_info.vip_level =  8
            res.login_info.vip_point = 99999
            res.login_info.username = 'GwenCrackヾ(-_-;)'
            store.bdstoken = res.login_info.bdstoken
            Object.defineProperty(this, "responseText", {
                writable: true,
            });
            this.responseText = JSON.stringify(res)
          }
        })
        originalOpen.apply(this, arguments);
      } else if (url.indexOf('/user/info') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            let res = JSON.parse(this.responseText)
            res.user_info.is_vip = 1
            res.user_info.is_svip = 1
            res.user_info.is_plus_buy =	1
            Object.defineProperty(this, "responseText", {
                writable: true,
            });
            this.responseText = JSON.stringify(res)
          }
        })
        originalOpen.apply(this, arguments);
      } else if (url.indexOf('/membership/user') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            let res = JSON.parse(this.responseText)
            res.reminder = {
              "svip": {
                "leftseconds": 9999999999,
                "nextState": "normal"
              }
            }
            res.level_info = {
              "current_value": 12090,
              "current_level": 10,
              "history_value": 11830,
              "history_level": 10,
              "v10_id": "666666",
              "last_manual_collection_time": 0
            }
            res.product_infos = [{
              "product_id": "",
              "start_time": 1685635199,
              "end_time": 1888227199,
              "buy_time": 0,
              "cluster": "vip",
              "detail_cluster": "svip",
              "auto_upgrade_to_svip": 0,
              "product_name": "svip2_nd",
              "status": 0,
              "function_num": 0,
              "buy_description": "",
              "product_description": "",
              "cur_svip_type": "month"
            }]
            res.current_product = {
              "cluster": "vip",
              "detail_cluster": "svip",
              "product_type": "vip2_1m_auto",
              "product_id": "12187135090581539740"
            }
            res.current_product_v2 = {
              "cluster": "vip",
              "detail_cluster": "svip",
              "product_type": "vip2_1m_auto",
              "product_id": "12187135090581539740"
            }
            Object.defineProperty(this, "responseText", {
                writable: true,
            });
            this.responseText = JSON.stringify(res)
          }
        })
        originalOpen.apply(this, arguments);
      } else if (url.indexOf('/api/streaming') != -1 && url.indexOf('M3U8_SUBTITLE_SRT') == -1) { //获取视频m3u8接口
        let modifiedUrl = url.replace(/vip=2/, 'vip=0')
                .replace(/_1080&/, '_720&')
        if (store.adToken) {
          modifiedUrl += ('&adToken=' + encodeURIComponent(store.adToken))
          this.adToken = store.adToken
          store.adToken = null
          store.m3u8url = modifiedUrl;
          originalOpen.call(this, method, modifiedUrl, false);
          return
        }
        originalOpen.call(this, method, modifiedUrl);
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            if (this.responseText[0] == '{') {
              let res = JSON.parse(this.responseText)
              store.adToken = res.adToken
              let manualRequest = new XMLHttpRequest();
              // let manualUrl = `https://pan.baidu.com/api/streaming?app_id=250528&clienttype=0&channel=chunlei&web=1&isplayer=1&check_blue=1&type=M3U8_AUTO_${store.resolutionPattern.exec(url)[1]}&trans=&vip=0` +
              //           `&bdstoken=${store.bdstoken||unsafeWindow.locals.bdstoken}&path=${store.path}&jsToken=${unsafeWindow.jsToken}`
              let manualUrl = modifiedUrl
              console.log(manualUrl)
              manualRequest.open(method, manualUrl, false);
              manualRequest.send();
              Object.defineProperty(this, "status", {
                writable: true,
              });
              this.status = manualRequest.status;
              Object.defineProperty(this, "responseText", {
                writable: true,
              });
              this.responseText = manualRequest.responseText;
            }
          }
        })
      } else if (url.indexOf('/api/streaming') != -1 && url.indexOf('SUBTITLE_SRT') != -1 && false) {
        // this.addEventListener('readystatechange', function() {
        //   if (this.readyState == 4) {
        //     let res = this.responseText
        //     Object.defineProperty(this, "responseText", {
        //         writable: true,
        //     });
        //     this.responseText = res.replace(/https:\/\/.*?\//, 'https://nv0.baidupcs.com/')
        //   }
        // })
        originalOpen.apply(this, arguments);
      } else if (url.indexOf('/msg/streaming') != -1 || url.indexOf('/share/streaming') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            if (this.responseText[0] != '{')
              return
            let res = JSON.parse(this.responseText)
            res.ltime = 0.000001
            res.adTime = 0.000001
            Object.defineProperty(this, 'responseText', {
              writable: true,
            })
            this.responseText = JSON.stringify(res)
          }
        })
        originalOpen.apply(this, arguments);
      } else if (url.indexOf('/aitrans/ppt/get') != -1) {
        const parseTimeToSeconds = (timeStr) => {
          let [h, m, s] = timeStr.split(":");
          return parseInt(h)*60*60 + parseInt(m)*60 + parseInt(s);
        }
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            console.log("课件：" + this.responseText);
            let res = JSON.parse(this.responseText);
            console.log(res);
            let list = res.data.list;
            if (!list || list.length == 0) {
              console.error("没有pdf，等待生成或者别生成了");
              return;
            }
            const timePoints = [];
            for (let item of list) {
              for (let time of item.img_timestamp) {
                console.log(time);
                timePoints.push(parseTimeToSeconds(time))
              }
            }
            console.log(timePoints)
            store.timePoints = timePoints;
            showPdf();
          }
        })
        originalOpen.apply(this, arguments);
      } else {
        originalOpen.apply(this, arguments);
      }
    }
    store.newOpen = XMLHttpRequest.prototype.open;
  }

  function showPdf() {
    document.querySelector('.vp-tabs__header').children[2].click()
    const doShow = () => {
      if (!store.timePoints || store.timePoints.length == 0) {
        console.log("正在加载课件时间点...");
        setTimeout(doShow, 500);
      } else {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let aiCourse = document.querySelector(".vp-ai-course")
        let aiCourseTools = null;
        let logText = null;
        let reloadBtn = null;
        let exportBtn = null;
        let imageContainer = document.getElementById("export-image-container")
        // if (aiCourse && !aiCourse.querySelector('.vp-ai-course-tools')) {
        if (aiCourse) {
          aiCourse.innerHTML = ''
          aiCourseTools = createElement('div', 'vp-ai-course-tools', {style:'margin-bottom:5px;'})
          logText = createElement('span', '', {style:'margin-right:10px;font-size:16px;'})
          reloadBtn = createElement('button', '', {innerText: '重新加载', disabled: true, style: 'margin-right:10px;padding: 3px 10px;font-size: 14px;background:#fff;border:1px solid #ccc;cursor:pointer;'});
          exportBtn = createElement('button', '', {innerText: '导出', disabled: true, style: 'padding: 3px 10px;font-size: 14px;background:#fff;border:1px solid #ccc;cursor:pointer;'});
          reloadBtn.onclick = () => {
            if (!reloadBtn.disabled) {
              showPdf();
            }
          }
          let exportLock = false;
          exportBtn.onclick = () => {
            if (!exportBtn.disabled && !exportLock) {
              exportLock = true;
              logText.innerText = "正在写入pdf"
              if (store.captureHls)
                store.captureHls.destroy();
              store.captureHls = null;
              // 导出pdf
              const imgs = imageContainer.querySelectorAll('img')
              let w = imgs[0].naturalWidth, h = imgs[0].naturalHeight
              let pdf = new jspdf.jsPDF('l', 'px', [w, h]);
              for (let i = 0; i < imgs.length; i++) {
                  let img = imgs[i]
                  pdf.addImage(img.src, 'JPEG', 0, 0, w, h)
                  pdf.addPage([img.naturalWidth, img.naturalHeight], 'l')
              }
              const targetPage = pdf.internal.getNumberOfPages()
              pdf.deletePage(targetPage)
              pdf.save(document.querySelector('.vp-personal-home-layout__video > .vp-toolsbar > .vp-toolsbar__title').title + '.pdf')
              logText.innerHTML = '<span style="color:green">导出成功</span>'
              // store.timePoints = []
              exportLock = false;
            }
          }
          aiCourseTools.appendChild(logText)
          aiCourseTools.appendChild(reloadBtn)
          aiCourseTools.appendChild(exportBtn)
          aiCourse.append(aiCourseTools);
        }
        if (!imageContainer) {
          imageContainer = document.createElement('div')
          imageContainer.id = "export-image-container"
          imageContainer.style.overflowY = 'auto'
        } else {
          imageContainer.innerHTML = ''
        }
        aiCourse.appendChild(imageContainer)

        //const hls = new Hls();
        if (store.captureHls) {
          store.captureHls.destroy();
          store.captureHls = null;
        }
        store.captureHls = new Hls();
        const hls = store.captureHls;
        video.volume = 0

        hls.on(Hls.Events.MEDIA_ATTACHED, function() {
            hls.loadSource(store.m3u8url);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          // console.log("HLS ERROR");
          // console.log(event, data)
          if (data.fatal && data.type == Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            logText.innerHTML = '<span style="color:red">导出出现异常，尝试恢复</span>'
          } else if (data.fatal) {
            logText.innerHTML = '<span style="color:red">导出失败，请重试</span>'
            reloadBtn.disabled = false;
          }
        })

        video.oncanplay = function() {
          video.oncanplay = null;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          function captureScreenshot(timePoints, index) {
            if (index >= timePoints.length) {
              // 销毁视频对象
              store.captureHls.destroy();
              store.captureHls = null;
              logText.innerHTML = '加载完成';
              reloadBtn.disabled = false;
              exportBtn.disabled = false;
              return;
            }
            logText.innerHTML = `加载中(${index+1}/${timePoints.length})`
            const time = timePoints[index]
            video.pause();
            video.currentTime = time;
            video.onseeked = function() {
              video.onseeked = null;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imgDataUrl = canvas.toDataURL('image/jpeg', 1);
              const imgWrapper = createElement('div', '', {style:'position:relative;width:100%;height:fit-content;'})
              const img = createElement('img', '', {src: imgDataUrl, style: 'width:100%;'});
              imgWrapper.append(img)
              imageContainer.appendChild(imgWrapper);
              imgWrapper.addEventListener('mouseenter', () => {
                const imgOverlay = createElement('div', 'img-index-text', {textContent:`${index+1}/${timePoints.length}`, style: "font-size:13px;position:absolute;top:0;left:0;background:black;color:white;padding:5px;border-radius:5px;"});
                imgWrapper.appendChild(imgOverlay);
              });
              imgWrapper.addEventListener('mouseleave', () => {
                const imgOverlay = imgWrapper.querySelector('.img-index-text');
                imgWrapper.removeChild(imgOverlay);
              });
              captureScreenshot(timePoints, index+1)
            };
          }
          captureScreenshot(store.timePoints, 0)
        };
        hls.attachMedia(video);
      }
    }
    if (!unsafeWindow.jspdf) {
      let script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.1.1/jspdf.umd.min.js'
      document.head.appendChild(script)
      script.onload = doShow
      console.log("正在引入pdf所需js依赖")
    } else {
      doShow()
    }
  }

  hookRequest()
  let localsTimer = setInterval(() => {
    if (!unsafeWindow.locals) return
    clearInterval(localsTimer)
    console.log('设置window.locas', unsafeWindow.locals)
    let originalSet = unsafeWindow.locals.set
    unsafeWindow.locals.set = function(n, t) {
      console.log('%c[hook]' + n + ': ' + t, 'color:blue;')
      if (['is_vip', 'is_svip'].indexOf(n) != -1) {
        t = 1
      } else if (n == 'vip_level') {
        t = 10
      } else if (n == 'v10_id') {
        t = '请低调使用，安装后24小时内自行删除'
      } else if (n == 'self' && store.shareFilePage) {
        t = 1
      }
      console.log(arguments)
      originalSet.apply(this, [n, t])
    }
    if (unsafeWindow.locals.userInfo) {
      unsafeWindow.locals.userInfo.vip_level = 10
      unsafeWindow.locals.userInfo.vip_identity = 21
      unsafeWindow.locals.userInfo.svip10_id = '请低调使用，安装后24小时内自行删除'
      store.shareFilePage && (unsafeWindow.locals.self = 1)
    } else if(unsafeWindow.locals.mset) {
      unsafeWindow.locals.mset({
        'is_vip': 1,
        'is_svip': 1,
        'vip_level': 10,
        'svip10_id': '请低调使用，安装后24小时内自行删除',
        'show_vip_ad': 0,
      })
    } else {
      unsafeWindow.locals.vip_level = 10
      unsafeWindow.locals.svip10_id = '请低调使用，安装后24小时内自行删除'
      unsafeWindow.locals.is_vip = 1
      unsafeWindow.locals.is_svip = 1
      unsafeWindow.locals.is_evip = 0
      unsafeWindow.locals.show_vip_ad = 0
      store.shareFilePage && (unsafeWindow.locals.self = 1)
    }
    try {
      initPanel()
    } catch(e) {}
  }, 10)

  function fixRateChange() {
    const buttons = document.querySelectorAll('.vp-video__control-bar--playback-rates button');
    if (!buttons || buttons.length == 0) {
      return setTimeout(fixRateChange, 300);
    }
    const read = GM_getValue('read_1.4.0', false);
    if (!read) {
      alert('脚本仅供交流学习使用，请在24小时内自觉删除此脚本，通过正规渠道购买会员。该版本解决倍速问题，后续脚本不再更新，感谢这一年大家的支持和建议❗')
      GM_setValue('read_1.4.0', true);
    }
    for (const btn of buttons) {
      btn.addEventListener('click', () => {
        XMLHttpRequest.prototype.open = store.originalOpen;
        setTimeout(() => {
          XMLHttpRequest.prototype.open = store.newOpen;
        }, 100);
      })
    }
  }
  fixRateChange();


})()