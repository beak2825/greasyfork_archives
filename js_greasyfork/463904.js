// ==UserScript==
// @name         🔗Link-
// @name:zh-CN   🔗链简
// @name:zh-TW   🔗鏈簡
// @namespace    https://github.com/waldenlak
// @version      1.04
// @author       浮光河
// @run-at       document-body
// @description  让链接跳转简单不弯绕。1、网盘自动填码访问；网盘链接直达；2、单击文本转链接；3、移除链接重定向；重定向自动跳转；外链净化直达；镜像GitHub链接；4、新标签页/当前页打开链接。
// @description:zh-TW  讓鏈接跳轉簡單不彎繞。1、網盤自動填碼訪問；網盤鏈接直達；2、單擊文本轉鏈接；3、移除鏈接重定向；重定向自動跳轉；外鏈凈化直達；鏡像GitHub鏈接；4、新標簽頁/當前頁打開鏈接。
// @license      GPL-3.0 License
// @noframes
// @match        *://*/*
// @exclude      *://www.notion.so/*
// @exclude      *://www.yuque.com/*/edit
// @exclude      *://xiezuocat.com/#/doc/*
// @exclude      *://mail.*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/463904/%F0%9F%94%97Link-.user.js
// @updateURL https://update.greasyfork.org/scripts/463904/%F0%9F%94%97Link-.meta.js
// ==/UserScript==

$(function () {
    "use strict";
    /* global $ */
    const locHost=location.host,locHref=location.href,locHash=location.hash,locPath=location.pathname;
    let t={
        clog(){for(let m of(console.group("[Link-]"),("cloud.189.cn"===locHost||"pan.xunlei.com"===locHost)&&(console.log=console.dir),arguments))void 0!==m&&console.log(m);console.groupEnd();},
        get:(name,def)=>GM_getValue(name,def),
        set(name,value){GM_setValue(name,value)},
        delete(name){GM_deleteValue(name)},
        menu:(title,func)=>GM_registerMenuCommand(title,func),
        menu1(iM){GM_unregisterMenuCommand(iM)},
        open(url,options={active:!0,insert:!0,setParent:!0,loadInBackground:!0}){GM_openInTab(url,options)},
        http:(link,s=!1)=>link.startsWith("http")?link:(s?"https://":"http://")+link,
        title(a,mark=""){a.title?a.title+="\n"+mark+decodeURIComponent(a.href):a.title=mark+decodeURIComponent(a.href)},
        hashcode:(l=location)=>l.hash.slice(1),
        search(l=location,p="password"){let s=l.search.slice(1).split("&");for(let a of s)if(a.includes(p+"="))return a.replace(p+"=","");return""},
        clean(src,str){for(let s of str){src=src.replace(s,"");}return src;},
        loop(func,times){let tid=setInterval(()=>{times<=0&&clearInterval(tid);func();this.clog(times);times--},100);},
        increase(){success_times=+this.get("success_times")+1;this.set("success_times",success_times)},
        rand(min,max){return 1==arguments.length&&(max=min);Math.floor(Math.random()*(max+1-(min=0)))+min},
    };
    var g=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;var Q={};
    switch (g){
        case"zh-CN":case"zh-HK":case"zh-TW":
            Q={mir:"自動鏡像",adb:"✔️新標籤頁｜✖️當前頁",ori:"✖️新標籤頁｜✔️當前頁",proc:"直達鏈接",re:"用原文本替换目標鏈接？",Re:"【替换】",miro:"【已鏡像】",clRe:"{淨化}",clRez:"【淨化】",thun:"用迅雷下載",ed2k:"用BT下載",fil5:"無提取碼",fil4:"不見提取碼",fil0:"不用填碼",aco4:"不見code!",rdre4:"不見跳轉目標",};
            break;
        default:
            Q={mir:"AutoMirror",adb:"✔️NewTab｜✖️CurrentTab",ori:"✖️NewTab｜✔️CurrentTab",proc:"Direct Link",re:"Replace Target-link with Original-text?",Re:"【replace】",miro:"【Mirror】",clRe:"{purify}",clRez:"【purify】",thun:"Download-Thunder",ed2k:"Download-BT",fil5:"No Password",fil4:"Password No Found",fil0:"Password Needless",aco4:"code No Found!",rdre4:"Redirect-targit No Found",};
            break;
    }
    let host_suffix = "(?:com|net|org|au|br|ca|cn|cu|de|eu|fr|jp|ru|us|app|art|cam|cc|co|edu|gov|tv|vip|fun|im|in|info|io|it|link|me|ni|nu|one|top)\\b",
        http_re_str = "(?:https?:\\/\\/|www\\.)[-\\w_.~/=?&#%+:!*@]+|[\\w\\u4e00-\\u9fff]+(?:[?#][\\w\\u4e00-\\u9fff]*)?(?<!@)(?:\\w[-\\w._]*\\." + host_suffix + ")(?:\\/[-\\w_.~/=?&#%+:!*@\\u4e00-\\u9fff]*)?",
        bdpan_re_str = "(?:\\/?s)?\\/[-\\w_]{23}|(?:\\/?s)?\\/\\w{6,8}",
        email_re_str = "(?<![.@])\\w(?:[-\\w._])+@\\w[-\\w._]+\\." + host_suffix,
        ed2k_re_str = "ed2k:\\/\\/\\|file\\|[^\\|]+\\|\\d+\\|\\w{32}\\|(?:h=\\w{32}\\|)?\\/",
        magnet_re_str = "(magnet:\\?xt=urn:btih:(?:[a-fA-F0-9]{40}|[a-zA-Z2-7]{32})|(?<![|/?#=])\\b(?:[a-f0-9]{40}|[A-F0-9]{40}|[a-z2-7]{32}|[A-Z2-7]{32})\\b)",
        magnet_suffix = "(?:&[\\S]+)?",
        base64_re_str = "(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)",
        thunder_re_str = "thunder:\\/\\/" + base64_re_str,
        url_regexp = new RegExp("\\b"+ed2k_re_str+"|"+email_re_str+"|"+http_re_str+"|"+thunder_re_str+ (locHost==="tieba.baidu.com"?"|"+bdpan_re_str:"") +"|"+magnet_re_str+magnet_suffix,"i");
    let Preprocess = {
        "www.mikuclub.win":function(){if(/\/\d+/.test(locPath)){let a=$(".password1"),e=$("a.download");a.length&&e.length&&(e[0].hash=a[0].value)}},
        "www.acgjc.com":function(){if(/http:\/\/www.acgjc.com\/storage-download\/\?code=/.test(locHref)){let e=$("#theme_custom_storage-0-download-pwd");if(e.length){let t=e.val(),o=e.parents("div.fieldset-content").find("a");o&&o.prop("href",o[0].href+"#"+t)}}},
        "zhidao.baidu.com":function(){/\/question\/\d+\.html.*/.test(locPath)&&$("baiduyun.ikqb-yun-box").each((t,a)=>{let e=$(a).attr("data_title"),l=$(a).attr("data_sharelink")+"#"+$(a).attr("data_code");$(a).parent("p").before(`<p style="font-size:2em"><a href="${l}" target="_blank"><span style="color:#3b6">${Q.proc}：</span>${e}</a></p>`)});},
    };
    if (Preprocess[locHost]) Preprocess[locHost]();

    let YunDisk = {
        sites: {
            "pan.baidu.com": {inputSelector:"#accessCode",buttonSelector:"#submitBtn",regStr:"[a-z\\d]{4}",redirect:{ pathname:{"/wap/": "/share/"} },},
            "eyun.baidu.com": {inputSelector:"input.share-access-code",buttonSelector:"a.g-button",regStr:"[a-z\\d]{4,6}",},
            "www.aliyundrive.com": {inputSelector:"input.ant-input",buttonSelector:"button.button--fep7l",regStr:"[a-z\\d]{4}",timeout:3000,reverse:!0,},
            "cloud.189.cn": {inputSelector:"#code_txt",buttonSelector:"a.btn-primary",regStr:"[a-z\\d]{4}",timeout:1000,inputEvent:!0,noNotice:!0,checkError:!0,},
            "h5.cloud.189.cn": {inputSelector:"input.access-code-input",buttonSelector:"div.button",regStr:"[a-z\\d]{4}",timeout:100,password:!0,inputEvent:!0,redirect:{ href:{"h5.cloud.189.cn/share.html#/t/": "cloud.189.cn/web/share?code="} },},
            "lanzou.com": {inputSelector:"#pwd",buttonSelector:"#sub, .passwddiv-btn",regStr:"[a-z\\d.!-~]{2,10}",noNotice:!0,redirect:{ host:{"lanzous": "lanzoui"} },},
            "ctfile.com": {inputSelector:"#passcode",buttonSelector:"button.btn.btn-primary",regStr:"[a-z\\d]{4,6}",timeout:3000,},
            "vdisk.weibo.com": {inputSelector:"#keypass",buttonSelector:"div.search_btn_wrap>a",regStr:"[a-z\\d]{4}",},
            "pan.xunlei.com": {inputSelector:"#__nuxt input.td-input__inner",buttonSelector:"#__nuxt button.td-button",regStr:"[a-z\\d]{4}",timeout:1200,password:!0,inputEvent:!0,searchPath:!0,},
            "share.weiyun.com": {inputSelector:"input.input-txt",buttonSelector:"button.btn-main",regStr:"[a-z\\d]{4,6}",timeout:500,inputEvent:!0,},
            "115.com": {inputSelector:"input.text",buttonSelector:"a.btn-large",regStr:"[a-z\\d]{4}",timeout:500,password:!0,},
            "caiyun.139.com": {inputSelector:"input",buttonSelector:"a.btn-token",regStr:"[a-z\\d]{4}",timeout:100,inputEvent:!0,clickTimeout:!0,store:!0,},
            "www.jianguoyun.com": {inputSelector:"#access-pwd",buttonSelector:"button.action-button",regStr:"[a-z\\d]{4,16}",},
            "onedrive.live.com": {inputSelector: 'input[type="password"]',buttonSelector:"button.od-Button--primary",regStr:"[a-z\\d]{3,7}",timeout:5000,inputEvent:!0,store:!0,},
            "u.163.com": {inputSelector:"#pickupCode",buttonSelector:"#wpDownloadHref",regStr:"[a-z\\d]{8}",},
            "cowtransfer.com": {inputSelector:"div.receive-code-input input",buttonSelector:"div.button.open-buttom",regStr:"[a-z\\d]{6}",timeout:500,inputEvent:!0,reverse:!0,hidden:!0,},
            "www.wenshushu.cn": {inputSelector:"input.ivu-input",buttonSelector:"button.m-mg_t40",regStr:"[a-z\\d]{4,8}",timeout:1000,inputEvent:!0,},
            "yunpan.360.cn": {inputSelector:"input.pwd-input",buttonSelector:"input.submit-btn",regStr:"[a-z\\d]{4}",},
            "pan-yz.chaoxing.com": {inputSelector:"input.tqInp",buttonSelector:"a.blueBgBtn",regStr:"[a-z\\d]{6}",},
            "my.sharepoint.com": {inputSelector: '#txtPassword',buttonSelector:"#btnSubmitPassword",regStr:"[a-z\\d]{3,5}",password:!0,},
            "www.123pan.com": {inputSelector:"input.ant-input",buttonSelector:"input.ant-input+button",regStr:"[a-z\\d]{4,8}",timeout:1000,react:!0,},
        },
        mapHost(host) {
            let dict={"^yun\\.baidu\\.com":"pan.baidu.com",".*lanzou[a-z]?\\.com":"lanzou.com","^(?:[a-z]\\d{3}|\\d{3}[a-z]|t00y|\\w+\\.(?:ctfile|pipipan))\\.com$|^ctfile\\.\\w+\\.cn$":"ctfile.com","^ct\\.\\w+\\.(?:com|me|org)$":"ctfile.com","\\w{6}\\.link\\.yunpan\\.360\\.cn|yunpan\\.cn":"yunpan.360.cn"};
            for(let key in dict){if(host.match(key)){return host.replace(host,dict[key]);}}
            if (t.get("ctpanHosts", []).concat(["dl.sixyin.com", "dl.ooopn.com", "pd.ggtrj.com", "72k.us", "u.yfxj91.top"]).includes(host)) return host.replace(host, "ctfile.com");
            let mapped={"feixin.10086.cn":"139.com","ws28.cn":"www.wenshushu.cn","wss1.cn":"www.wenshushu.cn","zb.my.to:5000":"gofile.me","nf.mail.163.com":"u.163.com","1drv.ms":"onedrive.live.com","alywp.net":"www.aliyundrive.com","app.mediatrack.cn":"mdl.ink"}[host];
            if (mapped) return host.replace(host, mapped);
            return host;
        },
        redirect(a,d) {
            if(d)for(let k in d)for(let v in d[k])a[k]=a[k].replace(v,d[k][v])
        },
        autoFill(host) {
            let site = this.sites[host];
            "pan.baidu.com"===host&&locPath.startsWith("/doc/share/")&&(site={inputSelector:"input.u-input__inner",buttonSelector:"div.dialog-footer button.u-btn.u-btn--primary",regStr:"[a-z\\d]{4}",inputEvent:!0,timeout:500,clickTimeout:10}); // 百度云文档
            if (site.timeout) setTimeout(fillOnce, site.timeout);
            else fillOnce();
            function fillOnce() {
                if (site.checkError && $("div.error-content:visible").length) return;
                if (site.inputSelector) {
                    let input=$(site.inputSelector+(site.hidden?"":":visible")),button=$(site.buttonSelector),code=null;function click(){site.clickTimeout?setTimeout(()=>{(button=$(site.buttonSelector))[0].click()},site.clickTimeout):button[0].click()}
                    if(input.length){
                        if(code=site.store?t.get(host,!1):site.password&&decodeURIComponent(t.search())||t.hashcode()){
                            if(RegExp("^"+site.regStr+"$","i").test(code)){if(site.inputEvent){let e=setInterval(()=>{input.val(code);""!==input.val()&&(InputEvent?input[0].dispatchEvent(new InputEvent("input")):KeyboardEvent&&input[0].dispatchEvent(new KeyboardEvent("input")),clearInterval(e),click())},1e3)}else if(site.react){let l=input.val();input.val(code);let a=input[0]._valueTracker;a&&a.setValue(l);input[0].dispatchEvent(new Event("input",{bubbles:!0}));click()}else site.reverse?(click(),input.val(code)):(input.val(code),click());t.increase()
                            } else t.clog(Q.fil5)
                        } else t.clog(Q.fil4)
                    } else {t.clog(Q.fil0);}
            }}
        },
        addCode(a, isInput=false) {
            if (a.host === "cowtransfer.com" && a.pathname !== "/") return;
            let mapped=this.mapHost(a.host),site=this.sites[mapped];
            if (site.regStr) {
                let codeRe=RegExp("^"+site.regStr+"$","i"),other=Object.keys(this.sites).filter(e=>e!==mapped);"lanzou.com"!==mapped?other.push("lanzou[befhijlmopqstuvwxy].com"):"ctfile.com"!==mapped&&other.push("^(?:[a-z]d{3}|d{3}[a-z]|t00y|\\w+\\.ctfile).com$");
                if (site.redirect) this.redirect(a, site.redirect);
                if (site.cleanHash){let h=a.hash&&/#(\/s\/\w{6})/.exec(a.hash);h&&"/"==a.pathname&&(a.pathname=h[1],a.hash="")}else site.pathHash?a.pathname.match(/\/f\/\w+/)&&(a.href=a.href.replace("f/","#/share-detail?id=")):site.searchPath&&!a.search&&(a.search="?path=%2F");
                if (site.password){let s=a.hash.match("#("+site.regStr+")");s&&(t.search(a)||(a.search=a.search?a.search+"&password="+encodeURIComponent(s[1]):"password="+encodeURIComponent(s[1])),a.hash="")}
                if (!codeRe.test(t.hashcode(a)) && !codeRe.test(t.search(a))) {
                    let reg = new RegExp(
                            "\\s*(?:提[取示]|访问|验证|查阅|取件|密\\s*|口令|艾|Extracted-code|key|password|pwd)" + (locHost.startsWith("www.meijumi.") ? "?" : "") + "[码碼]?(?:--)?[】\\])）]?\\s*[\\u4e00-\\u9fff]?[:： （(是为]?\\s*(" +
                                site.regStr + ")|^[码碼]?[】\\])）]?\\s*[:：【\\[ （(]*\\s*(" +
                                site.regStr + ")[】\\])）]?" + (isInput ? "\\b" : "$"),"i"
                        ),
                        code = reg.exec($(a).text().trim());
                    code&&(/^http/.test(code[1])||/^http/.test(code[2]))&&(code=null);
                    for (
                        let i = 10, current = a;
                        current && current.localName != "body" && !code && i > 0;
                        i--, current = current.parentElement
                    ) {
                        let next=current;
                        while (!code) {
                            const cnext=next;
                            if (!cnext) break;
                            else if (cnext.nodeValue) code=reg.exec(cnext.nodeValue.trim());
                            else if (!other.some(s => cnext.textContent.match(s))) code=reg.exec(cnext.innerText.trim());
                            if (code && (/^http/.test(code[1]) || /^http/.test(code[2]))) code=null;
                            next=next.nextSibling;
                        }
                    }
                    if (code) {
                        let c = code[1] || code[2];
                        a.href = a.href.replace(/%E6%8F%90%E5%8F%96%E7%A0%81$/, "");
                        site.store?t.set(mapped,c):site.password?t.search(a)||(a.search=a.search?a.search+"&password="+encodeURIComponent(c):"password="+encodeURIComponent(c)):(a.href=a.href.replace(/%23.*$/,""),a.hash=c);
                    } else {if (site.store) t.delete(mapped);t.clog(Q.aco4);}
                }
            }
        },
    };
    let success_times=t.get("success_times");if (!success_times) t.set("success_times", 0);
    let dealedHost=YunDisk.mapHost(locHost);if (YunDisk.sites[dealedHost]) YunDisk.autoFill(dealedHost);
    else {
        let RedirectPage = {
            sites:{
                "t.cn":{include:"",selector:"a.m-btn-orange"},
                "to.redircdn.com":{include:"?",selector:"a.bglink"},
                "link.csdn.net":{include:"?target=",selector:"a.loading-btn",timeout:100},
                "c.pc.qq.com":{include:"middlem.html?pfurl=",selector:"#url"},
                "docs.qq.com":{include:"scenario/link.html?url=",selector:"span.url-src",timeout:500},
                "www.tianyancha.com":{include:"security?target=",selector:"div.security-link"},
                "www.yuque.com":{include:"r/goto?url=",selector:"button.ant-btn-primary>a",timeout:300},
                "jump.bdimg.com":{include:"safecheck/index?url=",selector:"div.warning_info.fl>a"},
                "jump2.bdimg.com":{include:"safecheck/index?url=",selector:"div.warning_info.fl>a"},
                "www.chinaz.com":{include:"go.shtml?url=",selector:"div.link-bd__text"},
                "www.douban.com":{include:"link2/?url=",selector:"a.btn-redir"},
                "www.jianshu.com":{include:"go-wild?ac=2&url=",selector:'div[title^="http"], div[title^="www"]'},
                "link.juejin.cn":{include:"?target=",selector:'p[style="margin: 0px;"]'},
                "www.oschina.net":{include:"action/GoToLink?url=",selector:"a.link-button"},
                "www.youtube.com":{include:"redirect?q=",selector:"#invalid-token-redirect-goto-site-button"}
            },
            redirect(host) {
                let site = this.sites[host];
                if (site) {
                    let include = host + "/" + site.include;
                    if (locHref.includes(include) || site.match && locHref.match(site.match)) {setTimeout(redirect, site.timeout || 0);return true;}
                }
                function redirect() {
                    let target=$(site.selector);target.length?location.replace(t.http(target[0].href||target[0].innerText)):"t.cn"==locHost&&$("div.text:contains('绿色上网')").length?fetch(locHref).then(e=>location.replace(e.headers.get("location"))):t.clog(Q.rdre4);t.increase();
            }},
        };
        if (RedirectPage.redirect(locHost)) return;
        else {
            let Mir=t.get('Mirror',!1);let iM1=t.menu(`${Mir?"✔️":"✖️"}${Q.mir}`,Miru);function Miru(){Mir=!Mir;t.set('Mirror',Mir);t.menu1(iM1);iM1=t.menu(`${Mir?"✔️":"✖️"}${Q.mir}`,);}
            let Tab=t.get('NewTab',!0);let iM2=t.menu(`${Tab?Q.adb:Q.ori}`,Tabu);function Tabu(){Tab=!Tab;t.set('NewTab',Tab);t.menu1(iM2);iM2=t.menu(`${Tab?Q.ori:Q.adb}`,);}
            let isChromium = navigator.userAgent.includes("Chrome");
            isChromium?$(document).on("selectstart mousedown",obj=>listener(obj)):$(document).on("mouseup",obj=>listener(obj));
            async function listener(obj) {
                let e=obj.originalEvent.explicitOriginalTarget||obj.originalEvent.target,isTextToLink=!1,isInput=false;
                if (e && !e.href) {
                    let flag=!0,selectNode=null;
                    for (
                        let current = e, limit = 5;
                        current.localName !== "html" && current.localName !== "body" && limit > 0;
                        current = current.parentElement, limit--
                    ) {
                        if (current.localName === "a") {
                            e = current;
                            break;
                        } else if (["code","pre"].some((tag)=>tag===current.localName)) {
                            let selection=getSelection(),text=selection.toString();
                            url_regexp.test(text)?selectNode=selection.anchorNode||selection.focusNode:flag=!1;
                            break;
                        } else if (['input','textarea'].some((tag)=>tag===current.localName)&&current.className=='direct-input') {
                            let text = t.clean(current.value.replace(/点/g, '.').replace(/冒号/g, ":").replace(/再?斜杠/g, "/").replace("一八九", "189").replace("康姆", "com").replace(/[码碼]/, "："), [/[\u4e00-\u9fff\u201c\u201d\uff08\uff09\u3008-\u3011]+/g, /^[:：]/]),
                                result = url_regexp.exec(text);
                            result?(selectNode=document.createTextNode(text),isInput=true):flag=!1;
                            break;
                        }
                    }
                    if(e.localName!=="a"&&flag){let node=selectNode||e;node&&node.nodeValue&&(e=text2Link(node,isInput));e&&(isTextToLink=!0)}
                }
                if (e && e.localName === "a" && e.href) {
                    let a = e;
                    if (/^magnet:\?xt=urn:btih:|^ed2k:\/\/\|file\||^thunder:\/\//i.test(a.href)) {
                        $(a).removeAttr('target');if (isTextToLink) a.click();return;
                    }
                    if (a.host==="pan.baidu.com" && a.hash.startsWith("#/transfer/send?surl=")) return;
                    let pan = YunDisk.sites[YunDisk.mapHost(a.host)];
                    ("bbs.nga.cn"==locHost||"nga.178.com"==locHost||"ngabbs.com"==locHost)&&!("bbs.nga.cn"==a.host||"nga.178.com"==a.host||"ngabbs.com"==a.host)&&a.attributes.onclick&&a.attributes.onclick.nodeValue.startsWith("ubbcode.showUrlAlert(event,this)")&&(a.onclick=null);
                    ("www.youtube.com"==locHost&&a.href.includes("www.youtube.com/redirect?"))&&(!a.style.padding||($("#secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer").css({padding:"10px 10px 10px 2px",lineHeight:0,display:"inline-block"}),$("#secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer:first-child").css("padding-left","10px")),a.classList.remove("yt-simple-endpoint"));
                    ("www.facebook.com"==locHost)&&(a.onclick=function(){return!1},t.open(a.href));
                    if ("www.bilibili.com"===locHost&&a.search.includes("video") && Tab){a.search=a.search.replace(/[?&].*$/,""),a.onclick=function(c){c.stopPropagation()},window.location.replace(locHref)};
                    if (!(pan || locHost==="blog.csdn.net" || cleanRedirectLink(a))) {
                        let text = a.textContent.trim().replace(/…$/, "");
                        if (RegExp("^(" + http_re_str + ")$").test(text)) {
                            if (isLinkText(a)) {
                                (t.title(a,Q.Re),a.href=t.http(text,!0),t.increase());
                            } else if ("twitter.com"==locHost&&"t.co"==a.host) a.href=t.http(text,!0);
                            else if (!isTextToLink&&!a.parentElement.className.includes("text2Link")&&"www.facebook.com"!==locHost&&"download.downsx.org"!=a.host&&isDifferent(a)) {
                                a.onclick=function(){return!1};
                                if(!window.confirm(Q.re)){let e=t.get("linkTextPrefixes",[]),reg=/(?:http|https|\/|\%2F).*?\?.+?=|.*?\?/.exec(a.href);reg&&(e.push(reg[0]),t.set("linkTextPrefixes",e));t.title(a,Q.Re);a.href=t.http(text,!0);t.increase()}
                            }
                        }
                    }
                    if ((!obj.originalEvent.button || isTextToLink) && Mir) {
                        let o=[["hub.yzuu.cf"],["kgithub.com"],["hub.nuaa.cf"]],e=t.rand(1,9)%3,c=o[e];o[(e+1)%3];a.onclick=function(){a.host=a.host.replace("github.com",c[0]);t.title(a,Q.miro)};
                    }
                    if (isTextToLink) {
                        let isClicked=!1;if (isInput) {if (!isClicked) a.click();$('#L_DirectInput').val("");}
                    }
                    (pan=YunDisk.sites[YunDisk.mapHost(a.host)])&&YunDisk.addCode(a,isInput);
                    (/^https?:\/\/www\.nruan\.com\/(page\/\d+)?/i.test(a.href))&&$(a).removeAttr("target");
                    addBlank(a);
                }
            }
            let url_regexp_g = new RegExp(url_regexp, "ig");
            function text2Link(node, isInput) {
                let text = node.nodeValue;
                if (!["flashget://", "qqdl://", "tg://", "ss://", "ssr://", "vmess://", "trojan://", "115://", "aliyunpan://", "bdpan://", "BDLINK"].some(p => text.includes(p)) && ![/SHA-?(1|256)/i, /MD-?5/i].some(e => e.test(node.parentElement && node.parentElement.parentElement.textContent)) && (text.length < t.get("textLength", 500) || isInput)) {
                    let parent = null;
                    if (locHost==="tieba.baidu.com") {
                        if ((node.parentElement.localName==="div"&&node.parentElement.id.match(/^post_content_\d+$/)) || (node.parentElement.localName==="span"&&node.parentElement.className==="lzl_content_main")) {
                            text=node.parentElement.innerText.replace(/\n/g, "<br>");parent=node.parentElement;
                    }}
                    let result=url_regexp_g.test(text),span=null,count=0,isMail=!1;
                    if (result) {
                        span = $("<span class='text2Link'></span>");
                        span.html(
                            text.replace(url_regexp_g, function ($1, $2) {
                                count++;
                                if ($1.includes("@") && !$1.match(/^https?:\/\/|\/@?|^magnet:/)) {isMail=!0;return`<a class="text2Link" href="mailto:${$1}">${$1}</a>`};
                                return $1.startsWith("http")
                                       ? `<a href="${$1}" target="_blank">${$1}</a>`
                                       : /^thunder:\/\//i.test($1)
                                       ? `<a href="${$1}" title="${Q.thun}">${$1}</a>`
                                       : $1.includes("ed2k")
                                       ? `<a href="${$1}" title="${Q.ed2k}">${$1}</a>`
                                       : $1.match(magnet_re_str)
                                       ? `<a href="magnet:?xt=urn:btih:${$1.includes("&tr=") ? $1.replace("magnet:?xt=urn:btih:", "") : $2.replace("magnet:?xt=urn:btih:", "")}" title="使用BT软件下载">${$1}</a>`
                                       : /^(?:\/?s)?\/[\w\-_]{23}$|^(?:\/?s)?\/\w{7,8}$/.test($1)
                                       ? `<a href="https://pan.baidu.com/s/${$1.replace(/^(?:\/?s)?\//, "")}" target="_blank">${$1}</a>`
                                       : `<a href="https://${$1}" target="_blank">${isInput ? "https://" + $1 : $1}</a>`;
                            })/*.replace(/点/g, '.')*/
                        );
                        if (parent) $(parent).html(span);
                        else if (isMail) $(node).replaceWith(span.html());
                        else $(node).replaceWith(span);
                    }
                    if (count) t.increase();return !isMail && span && span.children("a")[0];
                }
            }
            function isLinkText(a) {
                let keywords=["jump.bdimg.com/safecheck/index?url=","jump2.bdimg.com/safecheck/index?url=","iphone.myzaker.com/zaker/link.php?pk=","www.coolapp.wang/goto/",],
                    linkTextPrefixes = t.get("linkTextPrefixes", []);
                return keywords.some((k) => a.href.includes(k)) || linkTextPrefixes.some((k) => a.href.includes(k));
            }
            function isDifferent(a) {
                if (/(?:http|https|\/|\%2F).*?\?.+?=|.*?\?/.test(a.href)) {
                    let hash = a.hash, search = a.search, password = t.search(a);
                    a.hash = "";
                    if (password) a.search = "";
                    let text = decodeURIComponent(a.innerText.trim()).toLowerCase().replace(/^https?:\/\/|\/$/, '').replace(hash, ''),
                        href = decodeURIComponent(a.href).toLowerCase().replace(/^https?:\/\/|\/$/, '');
                    a.hash = hash;
                    if (password) a.search = search;
                    return !(text.includes('...') || !text.includes('/') || text == href);
                } return false;
            }
            let excludes=["image.","img.","pic.","graph.","passport.","api.","yandex.com","userscript.zone","translate.google.com","microsofttranslator.com","youdao.com","fanyi.baidu.com","domains.live.com","v.qq.com","v.youku.com","lixian.vip.xunlei.com","iconfont.cn","nimg.ws.126.net","kdocs.cn","help.aliyun.com","service.weibo.com","zhidao.baidu.com","cloud.tencent.com","pc.woozooo.com","play.google.com","whois.chinaz.com","lanjing.jd.com","detail.1688.com",];
            function cleanRedirectLink(a) {
                let hosts = ["dalao.ru", "niao.su", "iao.su", "nicelinks.site", "support.qq.com", locHost];
                for (let h of hosts) {
                    let reg = RegExp(`\\?(?:utm_source=)?${h}$`), result = reg.exec(a.href);
                    if (result) {t.title(a,Q.clRe);a.href = a.href.replace(result[0], "");t.increase();}
                }
                if (locHost === "www.yuque.com" && a.search.includes("fileGuid=")) {t.title(a,Q.clRez);a.search = a.search.replace(/[?&]fileGuid=\w{16}$/, "");t.increase();return true;}
                if (locHost === "www.thosefree.com") {if (a.search.match("\\?from=thosefree\\.com")) {t.title(a,Q.clRez);a.search = "";}}
                if (!(["login", "logout", "signin", "signup", "signout", "auth", "oauth", "translate.google.com", "/images/"].some(k => a.href.includes(k)) || /登录|登入|登出|退出|注册|login|logout|signin|signup|signout/i.test(a.textContent) || excludes.some((s) => a.host.includes(s)))) {
                    let reg = new RegExp("^((?:http|https|\\/|\\%2F)(?:.*?[?&].+?=|.*?[?&]))(" + http_re_str + ")", "i"),
                        result = reg.exec($("<span>" + decodeURIComponent(a.href) + "</span>").text());
                    if (result) {
                        let temp=decodeURIComponent(decodeURIComponent(result[2])).replace(/https?:\/\//, "");
                        if (!decodeURIComponent(locHref).replace(/https?:\/\//, "").includes(temp.split("&")[0])) {
                            if (!/t\d+\.html/i.test(temp)) {
                                let href=decodeURIComponent(decodeURIComponent(t.http(result[2])));
                                t.title(a,Q.clRe);!href.includes("?")&&href.includes("&")||a.host.includes("google.com")?a.href=href.split("&")[0]:a.href=href.replace(/______/g,".");
                            } t.increase();return true;
                    }} else {
                        reg = new RegExp("((?:http|https|\\/|\\%2F)(?:.*[?&].+?=|.*[?&]|.*\\/(?:go|goto|link)\\/))(" + base64_re_str + ")", "i");
                        result = reg.exec(decodeURIComponent(a.href));
                        if (result) {try {let temp=decodeURIComponent(escape(atob(result[2])));if (temp.match("^" + http_re_str + "$")) {t.title(a, '【Base64】');a.href=temp;t.increase();return true;}} catch (err) {}}
                }}
            }
            function addBlank(a) {
                if (Tab) {
                    let result=""==a.href||"_blank"==a.target||a.href==location.origin+"/"||/^#.+/.test(a.attributes.href&&a.attributes.href.nodeValue)||/javascript[\w:;()]+/.test(a.href)||/\/\w+-\d+-\d+\.html|.+page\/\d+|category-\d+_?\d*/.test(a.href)||/[前后後上下首末].+[页頁篇张張章节節部]|^\.*\s*\d+\s*\.*$|^next$|^previous$|^[＜＞]$/i.test(a.innerText)||["prev","next"].some(e=>e==a.attributes.rel&&a.attributes.rel.nodeValue)||["prev","next","nxt"].some(e=>a.className.includes(e))||a.href.endsWith(".user.js");
                    if (!result) a.target="_blank";a.rel="noopener norefferrer";
            }}
        }
    }
});