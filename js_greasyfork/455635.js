// ==UserScript==
// @name         百度文库下载器
// @version      0.1.0.1
// @description  保持源文件排版导出 PDF 文件(仅支持 word)，解除阅读限制，净化网页，本地 VIP
// @author       Chriz_Li
// @license      End-User License Agreement
// @match        *://wenku.baidu.com/view*
// @match        *://wk.baidu.com/view*
// @match        *://wenku.baidu.com/tfview*
// @match        *://wk.baidu.com/tfview*
// @icon         https://i.postimg.cc/QNByZJWg/anonymous-mask.png
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @connect      wenku.baidu.com
// @connect      bdimg.com
// @connect      tool.wezhicms.com
// @connect      zhihuweb.com
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace    http://zhihupe.com/
// @downloadURL https://update.greasyfork.org/scripts/455635/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455635/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var qrname,nodeid,goodid,method,action,updateconfig;
    const scpritversion = "1.7.0";
    function Getgoodid(gid) {
        var reg = new RegExp("(^|&)" + gid + "=([^&]*)(&|$)");
        var s = window.location.search.substr(1).match(reg);
        if (s != null) {
            return s[2];
        }
        return "";
    }
    function getid(url) {
        if (url.indexOf("?") != -1) {
            url = url.split("?")[0]
        }
        if (url.indexOf("#") != -1) {
            url = url.split("#")[0]
        }
        var text = url.split("/");
        var id = text[text.length - 1];
        id = id.replace(".html", "");
        return id
    }
    function Toast(msg, duration = 3000) {
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(() => {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            document.body.removeChild(m)
        }, duration);
    }
    function GMaddStyle(data, id = null) {
        var addStyle = document.createElement('style');
        addStyle.textContent = data;
        addStyle.type = 'text/css';
        addStyle.id = id;
        var doc = document.head || document.documentElement;
        doc.appendChild(addStyle);
    }
    function req(method,url,headers,data=null){
            return new Promise(function(resolve, reject){
                GM_xmlhttpRequest({
                    url: url,
                    method: method,
                    data:data,
                    headers:headers,
                    onload: function(res) {
                        var status = res.status;
                        var responseText = res.responseText;
                        if(status==200||status=='200'){
                            resolve({"result":"success", "data":responseText});
                        }else{
                            reject({"result":"error", "data":null});
                        }
                    }
                });
            })
        }
    function open(data) {
        var main = document.createElement('div');
        var width = data.area[0];
        var height = data.area[1];
        var margintop = height / 2;
        var marginleft = width / 2;
        var style = "z-index: 999999998;width: " + width + "px;height:" + height + "px;position: fixed;top: 50%;left: 50%;margin-left:-" + marginleft + "px;margin-top:-" + margintop + "px;"
        var btnHTML = '<a class="zhihu-layer-btn0">' + data.btn[0] + '</a><a class="zhihu-layer-btn1">' + data.btn[1] + '</a>';
        main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">' + data.title + '</div><div class="zhihu-layer-content" >' + data.content + '</div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">' + btnHTML + '</div>';
        main.setAttribute('id', data.id);
        main.setAttribute('style', style);
        main.setAttribute('class', "zhihu-layer-page");
        document.body.appendChild(main);
        var shade = document.createElement('div');
        shade.setAttribute('style', "z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
        shade.setAttribute('class', "zhihu-layer-shade");
        shade.setAttribute('id', "zhihu-layer-shade");
        shade.innerHTML = ''
        document.body.appendChild(shade);
        var css = `
             ::-webkit-scrollbar {
                height: 6px;
                width: 6px;
             }
             ::-webkit-scrollbar-track {
                background: transparent;
                width: 6px;
             }
             ::-webkit-scrollbar-thumb {
                background-color: #54be99;
                border-radius: 4px;
                -webkit-transition: all 1s;
                transition: all 1s;
                width: 6px;
             }
             ::-webkit-scrollbar-corner {
                background-color: #54be99;
             }
             li {
               list-style: none;
             }
             .zhihu-form-label, .zhihu-form-select, .zhihu-input-block, .zhihu-input-inline{
               position: relative;
             }
             .zhihu-layer-shade {
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               position: fixed;
               _height: expression(document.body.offsetHeight+"px");
             }
             .zhihu-layer-page{
                   margin: 0;
                   padding: 0;
                   background-color: #fff;
                   border-radius: 10px;
                   box-shadow: 1px 1px 50px rgba(0,0,0,.4);
                   font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
             }
             .zhihu-layer-title{
                   padding: 0 80px 0 20px;
                   height: 50px;
                   line-height: 50px;
                   border-bottom: 1px solid #F0F0F0;
                   border-radius: 2px 2px 0 0;
                   font-size: 14px;
                   color: #333;
                   overflow: hidden;
                   text-overflow: ellipsis;
                   white-space: nowrap;
                   font-weight: bold;
             }
             .zhihu-layer-setwin {
                   position: absolute;
                   right: 15px;
                   top: 17px;
                   font-size: 0;
                   line-height: initial;
              }
              .zhihu-layer-setwin .zhihu-layer-close1 {
                   background-position: 1px -40px;
                   cursor: pointer;
              }
              .zhihu-layer-setwin a {
                   position: relative;
                   width: 16px;
                   height: 16px;
                   margin-left: 10px;
                   font-size: 12px;
                   _overflow: hidden;
              }
             .zhihu-layer-btn a, .zhihu-layer-setwin a {
                   display: inline-block;
                   vertical-align: top;
              }
              .zhihu-layer-ico {
                   background: url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat;
              }
              .zhihu-layer-btn {
                   text-align: right;
                   padding: 10px 15px 12px;
                   pointer-events: auto;
                   user-select: none;
                   -webkit-user-select: none;
              }
              .zhihu-layer-btn-c {
                   text-align: center;
              }
              .zhihu-layer-btn a {
                   height: 28px;
                   line-height: 28px;
                   margin: 5px 5px 0;
                   padding: 0 15px;
                   border: 1px solid #dedede;
                   background-color: #fff;
                   color: #333;
                   border-radius: 4px;
                   font-weight: 400;
                   cursor: pointer;
                   text-decoration: none;
               }
               .zhihu-layer-btn1 {
                   border-color: #54be99!important;
                   background-color: #54be99!important;
                   color: #fff!important;
               }
               .zhihu-form-item {
                   margin-bottom: 5px;
                   clear: both;
               }
               .zhihu-form-label {
                   float: left;
                   display: block;
                   padding: 9px 15px;
                   width: 80px;
                   font-weight: 400;
                   line-height: 20px;
                   text-align: right;
                   box-sizing: content-box;
                }
                .zhihu-input-inline {
                   display: inline-block;
                   vertical-align: middle;
                   width: 190px;
                   margin-right: 10px;
                }
                .zhihu-input, .zhihu-select, .zhihu-textarea {
                   height: 38px;
                   line-height: 1.3;
                   border-width: 1px;
                   border-style: solid;
                   border-color: #eee;
                   display: block;
                   width: 100%;
                   padding-left: 10px;
                   background-color: #fff;
                   color: rgba(0,0,0,.85);
                   border-radius: 2px;
                   outline: 0;
                   -webkit-appearance: none;
                   transition: all .3s;
                   -webkit-transition: all .3s;
                   box-sizing: border-box;
                }
                .zhihu-input-block {
                   min-height: auto;
                   margin-left: 110px;
                }
                .zhihu-input-block p {
                   font-size: 12px;
                   line-height: 22px;
                }
                .zhihu-form {
                   display: flex;
                   margin-top: 20px;
                }

            `;
        GMaddStyle(css, "open");
        // await commonFunction.sleep(1000);
        //获取表单对象
        var zhihuform = document.querySelector('.zhihu-form');
        //保存按钮点击事件
        document.querySelector('.zhihu-layer-btn1').addEventListener('click', function () {
            data.btn1(zhihuform);
            document.body.removeChild(document.querySelector(".zhihu-layer-page"));
            document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
            document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
        })
        //取消钮点击事件
        document.querySelector(".zhihu-layer-btn0").addEventListener('click', function () {
            document.body.removeChild(document.querySelector(".zhihu-layer-page"));
            document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
            document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
        })
        //关闭钮点击事件
        document.querySelector(".zhihu-layer-close1").addEventListener('click', function () {
            document.body.removeChild(document.querySelector(".zhihu-layer-page"));
            document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
            document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
        })
    }
    function User() {
        let userhtml = '<div id="user" style="position: fixed;top: 50%;left: 50%;width: 480px;max-width: 80%;height: 468px;border-radius: 10px;background-image: url(https://static.hitv.com/pc/img/601d3ee.png),url(https://static.hitv.com/pc/img/21b00eb.png);background-position: 0 0,100% 280px;background-repeat: no-repeat;background-color: #fff;-webkit-box-shadow: 0 0 80px rgba(0,0,0,.25);box-shadow: 0 0 80px rgba(0,0,0,.25);opacity: 1;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform: translate(-50%,-50%);z-index: 99999;">';
        var btncss = "margin: 0 90px;";
        var tybtncss = "width: 180px;";
        userhtml += '<div style="margin-top: 45px;color: #222;font-weight: 700;font-size: 28px;text-align: center;">脚本使用协议</div>'
        userhtml += '<div style="width: 100%;height: 220px;margin: 35px auto 40px;overflow-x: hidden;overflow-y: scroll;">'
        userhtml += '<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您对本脚本的信任，为了更好的使用本脚本，在此，我们郑重提醒您：</p>'
        userhtml += '<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">1.有能力的情况，请大家支持正版</p>'
        userhtml += '<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">2.本脚本仅用学习交流，请勿用于非法、商业用途，使用本脚本下载的内容请勿进行复制、传播等侵权行为</p>'
        userhtml += '<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">3.脚本会在使用过程中，修改网站部分本地数据，未侵入及修改远程服务器内容</p>'
        userhtml += '<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">4.下载内容均来自平台本身API接口，如果侵权请邮件（188872170@qq.com）联系删除。</p>'
        userhtml += '<p style="margin: 0 50px 5px;color: #777;font-weight: 400;font-size: 13px;line-height: 22px;word-break: break-all;text-align: justify;">5.点击我同意后，即已代表您已经充分了解相关问题，否则后果自负，特此声明！</p></div>'
        userhtml += '<div style="display: flex;' + btncss + 'justify-content: space-between;"><button style="width: 100px;height: 45px;border: none;border-radius: 25px;outline: none;color: #fff;background: #ddd;font-weight: 700;font-size: 15px;line-height: 45px;" id="bty">不同意</button> <button style="' + tybtncss + 'height: 45px;border: none;border-radius: 25px;outline: none;color: #fff;background: #ffa000;background: -webkit-gradient(linear,left top,right top,from(#ff5f00),to(#ffa000));background: -webkit-linear-gradient(left,#ff5f00,#ffa000);background: -o-linear-gradient(left,#ff5f00 0,#ffa000 100%);background: linear-gradient(90deg,#ff5f00,#ffa000);font-weight: 700;font-size: 15px;line-height: 45px;" id="ty">我同意</button></div></div>'
        console.log(userhtml)
        document.body.insertAdjacentHTML('afterbegin', userhtml);


        document.querySelector("#ty").addEventListener('click', function () {
            GM_setValue("isuser", "1");
            window.location.reload();
        })
        document.querySelector("#bty").addEventListener('click', function () {
            GM_setValue("isuser", "0");
            document.body.removeChild(document.querySelector("#user"));
        });
    }
    function Commonsetinterval(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                  data.forEach((item,index)=>{
                    var node = document.querySelector(item);
                    if(node != null ){
                        resolve(node);
                        clearInterval(Count);
                    }
                    if(num ==100){
                        clearInterval(Count);
                    }
                    num++;
                  });
                },200);
            });
        }
    function setIntervalhost() {
        let playhref = window.location.href
        setInterval(function () {
            var workurl = window.location.href;
            if (playhref != workurl) {
                console.log(workurl);
                playhref = workurl;
                wenkuinit();
            }
        }, 500);
    }
    function request(method, url, headers = null, data = null) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                url: url,
                method: method,
                data: data,
                headers: headers,
                onload: function (res) {
                    var status = res.status;
                    var responseText = res.responseText;
                    if (status == 200 || status == '200') {
                        resolve({ "result": "success", "data": responseText });
                    } else {
                        reject({ "result": "error", "data": null });
                    }
                }
            });
        })
    }
    async function setcacheid(wenkuid) {
        console.log(wenkuid);
        var id = wenkuid;
        let time = new Date().getTime();
        let data = request("GET", "http://tool.wezhicms.com/coupon/getReaderInfo.php?id=" + id);
        data.then(function (res) {
            let json = JSON.parse(res.data);
            if (json.code == 0) {
                console.log(json);
                let readerinfo = json.readerinfo;
                if (readerinfo) {
                    console.log(readerinfo, id);
                    GM_setValue('readerinfo', readerinfo);
                    GM_setValue('wenkuid', id);
                    window.location.href='https://wenku.baidu.com/tfview/'+id;
                }
            }
        })
    }
    function getvip() {
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
        let pageData, pureViewPageData;
        let readerdata = GM_getValue('readerinfo');
        Object.defineProperty(unsafeWindow, 'pageData', {
            set: v => pageData = v,
            get() {
                if (!pageData) return pageData;

                // 启用 VIP
                if ('vipInfo' in pageData) {
                    pageData.vipInfo.global_svip_status = 1;
                    pageData.vipInfo.global_vip_status = 1;
                    pageData.vipInfo.isVip = 1;
                    pageData.vipInfo.isWenkuVip = true;
                }

                if ('readerInfo' in pageData && pageData?.readerInfo?.htmlUrls?.json) {
                    if (readerdata) {
                        pageData.readerInfo = readerdata;
                    } else {
                        pageData.readerInfo.showPage = pageData.readerInfo.htmlUrls.json.length;
                    }

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
                if ('customParam' in pureViewPageData) {
                    pureViewPageData.customParam.noWaterMark = 1;
                    pureViewPageData.customParam.visibleFoldPage = 1;
                }

                if ('readerInfo2019' in pureViewPageData) {
                    pureViewPageData.readerInfo2019.freePage = pureViewPageData.readerInfo2019.page;
                }

                return pureViewPageData
            }
        })
    }
    function downdocs() {
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
            observer.observe(document, {
                attributes: true,
                subtree: true,
                childList: true
            });
            return observer
        }

        const creaderReady = new Promise(resolve => {
            observeVueRoot((el, disconnect) => {
                while (el.$parent) {
                    // find base Vue
                    el = el.$parent
                }

                const findCreader = (root, selector) => {
                    if (!root) return null;
                    if (root?.$el?.nodeType === Node.ELEMENT_NODE && 'creader' in root && 'renderPages' in root.creader) return root.creader;

                    for (const child of root.$children) {
                        let found = findCreader(child, selector);
                        if (found) return found;
                    }
                    return null;
                }

                unsafeWindow['__creader__'] = findCreader(el);
                disconnect();
                resolve(unsafeWindow['__creader__']);

            });
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
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            return unsafeWindow.jspdf;
        }

        creaderReady.then(async creader => {
            const showStatus = (text = '', progress = -1) => {
                document.querySelector('.s-top.s-top-status').classList.add('show');
                if (text) document.querySelector('.s-panel .s-text').innerHTML = text;
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
            const showMessage = (msg, time = 3000) => {
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

            const downloadPDF = async (arr) => {
                let pageRangearr = [...Array(creader.readerDocData.showPage).keys()];
                var pageRange;
                if (arr != null) {
                    pageRange = arr;
                } else {
                    pageRange = pageRangearr;
                }
                const version = 6;

                showStatus('正在加载', 0);

                // 强制加载所有页面
                creader.loadNextPage(Infinity, true);
                console.debug('[+] pages:', creader.renderPages);

                const jspdf = await loadJsPDF();

                let doc;
                for (let i = 0; i < pageRange.length; i++) {
                    if (pageRange[i] >= creader.renderPages.length) {
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

                    if (['new_view', 'xmind_view'].includes(creader.readerDocData.readerType)) {
                        page.readerInfo = await page.readerInfoDataSource.requestIfNeed(i);
                        page.parsePPT();
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

                    if (page._pureImg?.src) URL.revokeObjectURL(page._pureImg.src);
                    page._pureImg?.remove();
                }

                doc.save(`${unsafeWindow?.pageData?.title?.replace(/ - 百度文库$/, '') ?? '百度文库文档'}.pdf`);
            }

            // 添加需要用到的样式
            async function injectUI() {
                const pdfButton = `<div class="s-btn-pdf"><div class="s-btn-img" ></div> <span>下载文档</span></div>`
                const statusOverlay = `<div class="s-top s-top-status"><div class="s-panel"><div class="s-progress-wrapper"><div class="s-progress"></div></div><div class="s-status" style=""><div class="s-text" style="">正在加载...</div><div class="s-progress-text">0%<div></div></div></div></div></div>`;
                const messageOverlay = `<div class="s-top s-top-message"><div class="s-message">testtest</div></div>`;

                document.body.insertAdjacentHTML('afterbegin', statusOverlay);
                document.body.insertAdjacentHTML('afterbegin', messageOverlay);
                document.body.insertAdjacentHTML('beforeend', pdfButton);
                document.head.appendChild(document.createElement('style')).innerHTML = `
            .s-btn-pdf {
              background: #0b1628;
              box-shadow: 0 2px 8px 0 #ddd;
              border-radius: 23px;
              width: 122px;
              height: 45px;
              line-height: 45px;
              text-align: center;
              cursor: pointer;
              position: fixed;
              top: 150px;
              right: 42px;
              z-index: 999;
            }

            .s-btn-pdf:hover {
              background-color: #fff;
              cursor: pointer;
            }
            .s-btn-pdf span{
              font-size: 14px;
              color: #d0b276;
              line-height: 14px;
              font-weight: 700;
            }
            .s-btn-img {
               background: url(https://wkstatic.bdimg.com/static/ndpcwenku/static/ndaggregate/img/gold-arrow-down.2a7dd761ebe866f57483054babe083bd.png) no-repeat;
               width: 18px;
               height: 18px;
               background-position: -1px 5px;
               background-size: cover;
               display: inline-block;
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
              background-color: #54be99;
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
              color: #54be99;
              font-weight: bold;
            }
          `;
            }

            injectUI();
            const addMain = async (json) => {
                document.head.appendChild(document.createElement('style')).innerHTML = `
            .main-left{
              width: 367px;
            }
            .zhihu-scan{
               width:180px;
			   display:inline-block;
			   text-align: center;
               margin-right: 40px;
            }
			.zhihu-scan img{
				width: 140px;
				margin: 0 5px 10px 5px;
			}
			.zhihu-scan h1{
				font-size: 18px;
				font-weight: bold;
				margin: 0px 0 20px 0;
			}
			.zhihu-scan p{
			  margin: 0;
			  color: #666;
			  font-size: 14px;
			}
         `;
                let defaultpassword = "";
                if (localStorage.password && (Date.now() - localStorage.passwordTime) < 17280000) {
                    defaultpassword = localStorage.password;
                } else {
                    localStorage.password = "";
                }
                let contenthtml = "";
                contenthtml += '<form class="zhihu-form" style="height: 255px;"><div class="main-left">'
                contenthtml += '<div class="zhihu-form-item"> <label class="zhihu-form-label">分批下载</label><div class="zhihu-input-inline" style="display:flex"><input id="start" type="number"  placeholder="开始" class="zhihu-input"><span style="line-height: 38px;margin: 0 10px;">-</span><input id="end" type="number" placeholder="结束" class="zhihu-input"></div></div>'
                contenthtml += '<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>不填默认下载全部页数</p></div></div>'
                open({
                    area: ['520', '380'],
                    title: `正在获取 ${unsafeWindow?.pageData?.title?.replace(/ - 百度文库$/, '') ?? '百度文库文档'}`,
                    shade: 0,
                    id: "wenkuset",
                    btn: ['取消', '下载PDF'],
                    content: contenthtml,
                    btn1: function (data) {
                        let startnum = data.querySelector("#start").value;
                        let endnum = data.querySelector("#end").value;
                        exportPDF(startnum, endnum);
                        unsafeWindow['downloadPDF'] = exportPDF;
                        }
                    }
                );
            }
            const addtip = async (json) => {
                alert("下载失败")
            }
            const generateArray = (start, end) => {
                return Array.from(new Array(end + 1).keys()).slice(start)
            }
            const exportPDF = async (startnum, endnum) => {
                try {
                    let num;
                    if (startnum != "" && endnum != "") {
                        if (parseInt(startnum) <= parseInt(endnum)) {
                            if (parseInt(endnum) > creader.readerDocData.showPage || parseInt(startnum) < 1) {
                                throw new Error('页码输入错误,结束页码大于可预览页数或者起始页码小于1');
                                return
                            } else {
                                let arr = generateArray(parseInt(startnum) - 1, parseInt(endnum) - 1);
                                num = arr.length;
                                await downloadPDF(arr);
                                console.log(arr);
                            }
                        } else {
                            throw new Error('页码输入错误,结束页码小于或等于开始页码');
                            return
                        }
                    } else {
                        await downloadPDF();
                        num = creader.readerDocData.page;
                    }
                    showMessage(`已成功导出，共计 ${num} 页~`);
                } catch (error) {
                    console.error('[x] failed to export:', error);
                    showMessage('导出失败：' + error?.message ?? error);
                } finally {
                    hideStatus();
                }
            }
            const resp = await request("GET", "https://zhihuweb.com/update.json");
            if (!resp) return;
            var json = JSON.parse(resp);
            const checkUpdate = async () => {
                    if (creader) {
                        addMain(json)
                    } else {
                        addtip();
                    //exportPDF();
                    // unsafeWindow['downloadPDF'] = exportPDF;
                }
            }
            document.querySelector('.s-btn-pdf').onclick = () => checkUpdate();
        });
    }
    function addgetreaderinfobtn(wenkuid) {

        setTimeout(function(){
            if (!unsafeWindow?.readerinfobtn) {
                var btn = document.createElement('div');
                btn.innerHTML = `<div id="getreaderinfo" class="s-btn-pdf"><div class="s-btn-img" ></div> <span>获取全文</span></div>`;
                document.body.appendChild(btn);
                unsafeWindow.readerinfobtn = true;
                document.head.appendChild(document.createElement('style')).innerHTML = `
                .s-btn-pdf {
                background: #0b1628;
                box-shadow: 0 2px 8px 0 #ddd;
                border-radius: 23px;
                width: 122px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                cursor: pointer;
                position: fixed;
                top: 150px;
                right: 42px;
                z-index: 999;
                }

                .s-btn-pdf:hover {
                background-color: #fff;
                cursor: pointer;
                }
                .s-btn-pdf span{
                font-size: 14px;
                color: #d0b276;
                line-height: 14px;
                font-weight: 700;
                }
                .s-btn-img {
                background: url(https://wkstatic.bdimg.com/static/ndpcwenku/static/ndaggregate/img/gold-arrow-down.2a7dd761ebe866f57483054babe083bd.png) no-repeat;
                width: 18px;
                height: 18px;
                background-position: -1px 5px;
                background-size: cover;
                display: inline-block;
                }
            `
            }
            document.querySelector('#getreaderinfo').onclick = () => {
            setcacheid(wenkuid);
        }
        },2000);
    }
    function wenkuinit() {
        let CacheID = GM_getValue("wenkuid");
        let wenkuid = getid(window.location.href);
        console.log(CacheID, wenkuid);
        if (CacheID != null && wenkuid == CacheID) {
            getvip();
            downdocs();
        } else {
            addgetreaderinfobtn(wenkuid);
        }
    }
    switch (window.location.host) {
        case 'wenku.baidu.com':
        case 'wk.baidu.com':
            if (GM_getValue("isuser") == 1) {
                wenkuinit();
                setIntervalhost();
            } else {
                User();
            }
            break;
    }
})();