// ==UserScript==
// @name         Image Downloader
// @name:zh-CN   图片下载器
// @name:zh-TW   图片下载器
// @name:ja   画像ダウンローダー
// @name:ko   이미지 다운로더
// @name:de   Image Downloader
// @name:es   Image Downloader
// @name:eo   Image Downloader
// @name:fr   Image Downloader
// @name:it   Image Downloader
// @name:ru   Image Downloader
// @name:vi   Image Downloader
// @name:pt-BR   Image Downloader
// @name:id   Image Downloader
// @name:ar   Image Downloader
// @name:bg   Image Downloader
// @name:cs   Image Downloader
// @name:tr   Image Downloader
// @name:el   Image Downloader
// @name:hu   Image Downloader
// @name:th   Image Downloader
// @namespace       http://tampermonkey.net/
// @description     Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:zh-CN   可以在绝大多数网站提取并批量下载图片。抓取能力大提升！现在可以抓取，H5游戏素材（4399），图库网站（千库网、包图网），漫画网站（腾讯漫画、b站漫画），文库网站（道客巴巴、豆丁），以及其他右键失效或者图片不能另存的网站，用脚本均可以提取并下载。额外功能：zip下载/自动大图。详细见脚本描述(目前适合chrome/firefox+tampermonkey，其他组合多少有问题）
// @description:zh-TW   可以在绝大多数网站提取并批量下载图片。抓取能力大提升！现在可以抓取，H5游戏素材（4399），图库网站（千库网、包图网），漫画网站（腾讯漫画、b站漫画），文库网站（道客巴巴、豆丁），以及其他右键失效或者图片不能另存的网站，用脚本均可以提取并下载。额外功能：zip下载/自动大图。详细见脚本描述(目前适合chrome/firefox+tampermonkey，其他组合多少有问题）
// @description:ja      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:ko      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:de      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:es      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:eo      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:fr      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:it      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:ru      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:vi      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:pt-BR   Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:id      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:ar      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:bg      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:cs      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:tr      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:el      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:hu      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @description:th      Images can be extracted and batch downloaded from most websites. Especially for websites the right click fails or image can not save. Extra features: zip download / auto-enlarge image. See the script description at info page (suitable for chrome/firefox+tampermonkey)
// @version         2.90
// @author          桃源隐叟-The hide oldman in taoyuan mountain
// @connect  *
// @connect  *://*/*
// @grant   GM_openInTab
// @grant   GM_registerMenuCommand
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @grant   GM_xmlhttpRequest
// @grant   GM_download
// @require https://unpkg.com/hotkeys-js@3.9.4/dist/hotkeys.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at  document-end
// @match   *://*/*
// @include *
// @match   https://www.bilibili.com/
// @match   https://588ku.com/
// @homepageURL https://github.com/taoyuancun123/modifyText/blob/master/modifyText.js
// @supportURL  https://greasyfork.org/zh-CN/scripts/419894/feedback
// @run-at      document-start
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/419894/Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/419894/Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var lang = navigator.appName == "Netscape" ? navigator.language : navigator.userLanguage;
    var langSet;
    var localization = {
        zh: {
            selectAll: "全选",
            downloadBtn: "下载",
            downloadMenuText: "打开脚本(Alt+w)",
            zipDownloadBtn: "zip下载",
            selectAlert:"请至少选中一张图片。",
            fetchTip:"准备抓取canvas图片",
            fetchCount1:`抓取canvas图片第`,
            fetchCount2:'张',
            fetchDoneTip1:"已选(0/",
            fetchDoneTip1Type2:"已选(",
            fetchDoneTip2:")张图片",
            regRulePlace:"输入待替换正则",
            regReplacePlace:"输入替换它的字符串或者函数",
            zipOptionDesc:"勾选使用zip下载后，会请求跨域权限，否则zip下载基本下载不到图片。",
            zipCheckText:"使用zip下载",
            downloadUrlFile:"下载图片地址",
            moreSetting:"更多设置",
            autoBitImgModule:"自动大图设置模块",
            defaultSettingRule:"设置默认规则",
            exportCustomRule:"导出自定规则",
            importCustomRule:"导入自定规则",
            fold:"收起",
            inputFilenameTip:"输入文件名",
            extraGrab:"强力抓取"
        },
        en: {
            selectAll: "selectAll",
            downloadBtn: "download",
            downloadMenuText: "Open(Alt+w)",
            zipDownloadBtn: "zip Download",
            selectAlert:"Please at last select one image.",
            fetchTip:"Ready to fetch canvas image.",
            fetchCount1:`Fetch the`,
            fetchCount2:' canvas image.',
            fetchDoneTip1:"(0/",
            fetchDoneTip1Type2:"(",
            fetchDoneTip2:") Images selected",
            regRulePlace:"enter reg express",
            regReplacePlace:"enter replace string or function",
            zipOptionDesc:"when zip option checked,will request cors right,otherwise zipDownload can not get pics",
            zipCheckText:"Use ZipDownload",
            downloadUrlFile:"Download Imgs Url",
            moreSetting:"More Setting",
            autoBitImgModule:"AutoBigImageModule",
            defaultSettingRule:"SetDefaultRule",
            exportCustomRule:"exportCustomRule",
            importCustomRule:"importCustomRule",
            fold:"fold",
            inputFilenameTip:"input filename",
            extraGrab:"Extra Grab"
        }
    }

    if (lang.toLowerCase().includes("zh-")) {
        langSet = localization.zh;
    } else {
        langSet = localization.en;
    }

    const autoBigImage={
        bigImageArray:[],
        defaultRules:[
            {originReg:/(?<=(.+sinaimg\.(?:cn|com)\/))([\w\.]+)(?=(\/.+))/i,replacement:"large",tip:"for weib.com"},
            {originReg:/(?<=(.+alicdn\.(?:cn|com)\/.+\.(jpg|jpeg|gif|png|bmp|webp)))_.+/i,replacement:"",tip:"for alibaba web"},
            {originReg:/(.+alicdn\.(?:cn|com)\/.+)(\.\d+x\d+)(\.(jpg|jpeg|gif|png|bmp|webp)).*/i,replacement:(match,p1,p2,p3)=>p1+p3,tip:"for 1688"},
            {originReg:/(?<=(.+360buyimg\.(?:cn|com)\/))(\w+\/)(?=(.+\.(jpg|jpeg|gif|png|bmp|webp)))/i,replacement:"n0/",tip:"for jd"},
            {originReg:/(?<=(.+hdslb\.(?:cn|com)\/.+\.(jpg|jpeg|gif|png|bmp|webp)))@.+/i,replacement:"",tip:"for bilibili"},
            {originReg:/th(\.wallhaven\.cc\/)(?!full).+\/(\w{2}\/)([\w\.]+)(\.jpg)/i,replacement:(match,p1,p2,p3)=>"w"+p1+"full/"+p2+"wallhaven-"+p3+".jpg",tip:"for wallhaven"},
            {originReg:/th(\.wallhaven\.cc\/)(?!full).+\/(\w{2}\/)([\w\.]+)(\.jpg)/i,replacement:(match,p1,p2,p3)=>"w"+p1+"full/"+p2+"wallhaven-"+p3+".png",tip:"for wallhaven"},
            {originReg:/(.*\.twimg\.\w+\/.+\&name=*)(.*)/i,replacement:(match,p1,p2,p3)=>p1+"orig",tip:"for twitter"},
            {originReg:/(shonenjump\.com\/.*\/)poster_thumb(\/.*)/,replacement:'$1poster$2',tip:"for www.shonenjump.com"},
            {originReg:/(qzone\.qq\.com.*!!\/.*)$/,replacement:'$1/0',tip:"for Qzone"},
            {originReg:/(.*wordpress\.com.*)(\?w=\d+)$/,replacement:'$1',tip:"for wordpress"},

        ],
        defaultRulesChecked:[
        ],
        userRules:[],
        userRulesChecked:[],
        replace(originImgUrls){
            let that=this;
            that.bigImageArray=[];
            let tempArray=Array.from(new Set(originImgUrls)).filter(item=>item&&item);
            that.setRulesChecked();
            //console.log(that.bigImageArray);

            tempArray.forEach(replaceByReg);
            function replaceByReg(urlStr,urlIndex){
                //if(!urlStr)return;
                if(urlStr.includes("data:image/")){
                    that.bigImageArray.push(urlStr);
                    return;
                }
                that.defaultRules.forEach((rule,ruleIndex)=>{
                    if(that.defaultRulesChecked[ruleIndex]!=="checked"){
                        that.bigImageArray.push(urlStr);
                        return;
                    }

                    let bigImage=urlStr.replace(rule.originReg,rule.replacement);
                    if(bigImage!==urlStr){
                        that.bigImageArray.push(urlStr);
                        that.bigImageArray.push(bigImage);
                    }else{
                        that.bigImageArray.push(urlStr);
                    }
                })
                that.userRules.forEach((rule,ruleIndex)=>{
                    if(that.userRulesChecked[ruleIndex]!=="checked"){
                        that.bigImageArray.push(urlStr);
                        return;
                    }

                    let bigImage=urlStr.replace(rule.originReg,rule.replacement);
                    if(bigImage!==urlStr){
                        that.bigImageArray.push(urlStr);
                        that.bigImageArray.push(bigImage);
                    }else{
                        that.bigImageArray.push(urlStr);
                    }
                })
            }
        },
        getBigImageArray(originImgUrls){
            this.replace(originImgUrls);
            let uniqueArray=Array.from(new Set(this.bigImageArray));
            return uniqueArray;
        },
        showDefaultRules(){
            let that=this;
            let defaultContainer=document.body.querySelector(".tyc-set-domain-default");
            that.setRulesChecked();

            this.defaultRules.forEach((v,i)=>{
                let rulesHtml=`<div class="tyc-set-replacerule">
                            <input type="checkbox" name="active" class="tyc-default-active" ${that.defaultRulesChecked[i]}>
                            <input type="text" name="regrule" placeholder="${langSet.regRulePlace}" class="tyc-search-title" value="${v.originReg}">
                            <input type="text" name="replace" placeholder="${langSet.regReplacePlace}" class="tyc-search-url" value="${v.replacement}">
                            <span class="tyc-default-tip">${v.tip}</span>
                    </div>
                `
                defaultContainer.insertAdjacentHTML("beforeend",rulesHtml);
            })
        },//showDefaultRules
        showRules(containerName,rulesType,checkType,checkClassName){
            let that=this;
            let Container=document.body.querySelector("."+containerName);
            that.setRulesChecked();
            that.setCustomRules();
            //console.log(that.userRules);
            //console.log(that);

            that[rulesType].forEach((v,i)=>{
                //console.log(that[checkType])
                let rulesHtml=`<div class="tyc-set-replacerule">
                            <input type="checkbox" name="active" class="${checkClassName}" ${that[checkType][i]}>
                            <input type="text" name="regrule" placeholder="${langSet.regRulePlace}" class="tyc-search-title" value="${v.originReg}">
                            <input type="text" name="replace" placeholder="${langSet.regReplacePlace}" class="tyc-search-url" value="${v.replacement}">
                            <span class="tyc-default-tip">${v.tip}</span>
                    </div>
                `
                Container.insertAdjacentHTML("beforeend",rulesHtml);
            })
        },
        onclickShowDefaultBtn(){
            let defaultContainer=document.body.querySelector(".tyc-set-domain-default");
            if(defaultContainer.style.display==="none"||defaultContainer.style.display===''){
                defaultContainer.style.display="flex";
            }else{
                defaultContainer.style.display="none";
            }
        },
        oncheckChange(){
            let checks=document.body.querySelectorAll(".tyc-default-active");
            this.defaultRulesChecked=[];

            checks.forEach((v,i)=>{
                if(v.checked){
                    this.defaultRulesChecked.push("checked");
                }else{
                    this.defaultRulesChecked.push("");
                }
            })

            GM_setValue("defaultRulesChecked",this.defaultRulesChecked);
        },
        oncheckChangeCustom(){
            let checks=document.body.querySelectorAll(".tyc-custom-active");
            this.userRulesChecked=[];

            checks.forEach((v,i)=>{
                if(v.checked){
                    this.userRulesChecked.push("checked");
                }else{
                    this.userRulesChecked.push("");
                }
            })

            GM_setValue("userRulesChecked",this.userRulesChecked);
        },
        setRulesChecked(){
            if(GM_getValue("defaultRulesChecked")){
                this.defaultRulesChecked=GM_getValue("defaultRulesChecked");

                if(this.defaultRulesChecked.length<this.defaultRules.length){
                    let delta=this.defaultRules.length-this.defaultRulesChecked.length;
                    for(let i=0;i<delta;i++){
                        this.defaultRulesChecked.push("checked");
                    }
                }

            }else{
                this.defaultRules.forEach(v=>{
                    this.defaultRulesChecked.push("checked");
                })
                GM_setValue("defaultRulesChecked",this.defaultRulesChecked);
            }

            if(GM_getValue("userRulesChecked")&&GM_getValue("userRulesChecked").length>0){
                this.userRulesChecked=GM_getValue("userRulesChecked");
            }else{
                this.userRules.forEach(v=>{
                    this.userRulesChecked.push("checked");
                })
                GM_setValue("userRulesChecked",this.userRulesChecked);
            }
        },
        getCustomRules(event){
            let that=autoBigImage;
            let file=document.querySelector("#tycfileElem").files[0];
            let fileReader=new FileReader();
            fileReader.onload=(e)=>{
                let result=e.target.result;
                that.userRules=eval(result);

                GM_deleteValue("userRulesChecked")
                that.setRulesChecked();
                GM_setValue("userRules",result);
                //console.log(GM_getValue('userRules'));
                document.body.querySelector(".tyc-set-domain-custom").innerHTML="";
                that.showRules("tyc-set-domain-custom","userRules","userRulesChecked","tyc-custom-active");
            }
            fileReader.readAsText(file,'GB2312');
        },
        setCustomRules(){
            if(GM_getValue("userRules")){
                try {
                    this.userRules=eval(GM_getValue("userRules"));
                } catch (error) {
                    GM_setValue("userRules","");
                }

            }
        },
        exportCustomRules(){

        }
    }

    var preImgSrcs=[];
    let originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');



    var domainName=document.domain.split(".");
    var downloadFileName;

    var shortCutString="alt+W";
    if(GM_getValue("shortCutString")!=undefined){
        shortCutString=GM_getValue("shortCutString");
    }


    GM_registerMenuCommand(langSet.downloadMenuText, wrapper);


    hotkeys(shortCutString, shortcutFunction);

    if (GM_getValue("extra-grab-check")){
        extraGrab();
    }else{

    }

    function extraGrab(){
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            get: function() {
              return originalSrcDescriptor.get.call(this);
            },
            set: function(value) {
              if(!preImgSrcs.includes(value)){
                  preImgSrcs.push(value);
              }

              originalSrcDescriptor.set.call(this, value);
            }
        });
    }

    function shortcutFunction(){
        let container=document.querySelector(".tyc-image-container");
        if(container!=null){
            try {
                document.querySelector(".tyc-image-container").remove();
            } catch {
            }
        }
        else{
            wrapper();
        }
    }

    function wrapper() {
        downloadFileName=domainName[domainName.length-2];
        var timeStamp=new Date().getTime().toString();
        downloadFileName=downloadFileName+timeStamp.substring(7,timeStamp.length);

        try {
            document.querySelector(".tyc-image-container").remove();
        } catch {
        }
        var imgUrls = [];
        var bodyStr = document.body.innerHTML;
        var imgSelected = [];
        var zipImgSelected = [];
        var imgWaitDownload = [];
        var zipImgWaitDownload = [];
        var widthFilter = { min: 0, max: 3000 };
        var heightFilter = { min: 0, max: 3000 };
        var filteredImgUrls = [];
        var zipFilteredImgUrls = [];
        try{
            var zipFolder = new JSZip();
            var zipSubFoler = zipFolder.folder('pics');
        }
        catch{

        }

        var fetchTip='';

        try {
            let imgEles = document.getElementsByTagName("img");
            let canvasEles=document.getElementsByTagName("canvas");
            //console.log(canvasEles);

            for (let i = 0; i < imgEles.length; i++) {
                ////console.log(imgEles[i].src);
                if (!imgUrls.includes(imgEles[i].src)) {
                    imgUrls.push(imgEles[i].src);
                }/* else if (!imgUrls.includes(imgEles[i].srcset)) {
                    imgUrls.push(imgEles[i].srcset);
                }*/

                if(imgEles[i].srcset!==''){
                    let srcArr=imgEles[i].srcset.split(",");

                    let srcUrl=srcArr[0].match(/\S+/gi)[0];
                    for(let k=0;k<srcArr.length-1;k++){
                        //srcArr[k].match(/\S+/gi),正则的结果一个数组，0是url，1是清晰度
                        //所以用清晰度，选出最清晰的那张
                        if(parseInt(srcArr[k].match(/\S+/gi)[1])>parseInt(srcArr[k+1].match(/\S+/gi)[1])){
                            srcUrl=srcArr[k].match(/\S+/gi)[0];
                            break;
                        }else{
                            srcUrl=srcArr[k+1].match(/\S+/gi)[0];
                        }
                    }

                    //将imgurls 中不包含的srcurl 加入到数组中
                    if(!imgUrls.includes(srcUrl)){
                        imgUrls.push(srcUrl);
                    }
                }
            }

            for(let i=0;i<preImgSrcs.length;i++){
                if (!imgUrls.includes(preImgSrcs[i])) {
                    imgUrls.push(preImgSrcs[i]);
                }
            }

            let imgRegs = bodyStr.match(/(?<=background-image:\s*url\()(\S+)(?=\))/g);

            try{
                for (let i = 0; i < imgRegs.length; i++) {
                    ////console.log(imgRegs[i]);
                    if(imgRegs[i].includes('&quot;')){
                        imgUrls.push(imgRegs[i].replace(/&quot;/g, ""));
                    }else if(imgRegs[i].includes("'")){
                        imgUrls.push(imgRegs[i].replace(/'/g, ""));
                    }
                }
            }catch(e){
                console.log(e);
            }




            if (window.location.href.includes("hathitrust.org")) {
                let imgs = document.querySelectorAll(".image img");
                if (imgs.length > 0) {
                    let canvas = document.createElement("canvas");
                    imgUrls = [];
                    for (let pi = 0; pi < imgs.length; pi++) {
                        canvas.width = imgs[pi].width;
                        canvas.height = imgs[pi].height;
                        canvas.getContext("2d").drawImage(imgs[pi], 0, 0);
                        imgUrls.push(canvas.toDataURL("image/png"));
                    }

                    document.querySelector(".select-all").style = "position:relative;width:15px;height:15px;"
                } else {

                }
            }

            if(window.location.href.toString().includes("manga.bilibili.com/")){
                let iframeCanvas=`<iframe style="display:none;" id="tyc-insert-iframe"></iframe>`;
                if(document.getElementById("tyc-insert-iframe")==null){
                    document.body.insertAdjacentHTML("afterbegin",iframeCanvas);
                    document.getElementById("tyc-insert-iframe").contentDocument.body.insertAdjacentHTML("afterbegin",`<canvas id="tyc-insert-canvas"></canvas>`);
                    document.body.getElementsByTagName('canvas')[0].__proto__.toBlob=document.getElementById("tyc-insert-iframe").contentDocument.getElementById("tyc-insert-canvas").__proto__.toBlob;
                }

            }

            let oldLength=imgUrls.length;
            if(canvasEles.length>0){
                //console.log(canvasEles);
                fetchTip=langSet.fetchTip;
                var completeFlag=0;
                for(let j=0;j<canvasEles.length;j++){
                    canvasEles[j].toBlob(blobCallback);
                    function blobCallback(blob){
                        //console.log(blob);
                        let oFileReader = new FileReader();
                        oFileReader.onloadend = function (e) {
                            let base64 = e.target.result;
                            if (base64.includes("data:image")) {
                                if (!imgUrls.includes(base64)) {
                                    //imgUrls.push(base64);
                                    imgUrls[oldLength+j]=base64;
                                    //console.log(base64);
                                }
                                completeFlag++;
                                document.querySelector(".num-tip").innerText=`${langSet.fetchCount1} ${completeFlag}/${canvasEles.length} ${langSet.fetchCount2}`;
                                if(completeFlag===canvasEles.length){
                                    clean();
                                    init();
                                }
                            }
                        };

                        oFileReader.readAsDataURL(blob);
                    }
                }
            }else{
                fetchTip=`${langSet.fetchDoneTip1}${imgUrls.length}${langSet.fetchDoneTip2}`;
            }

        } catch(e) {
            //alert("error");
            console.log(e);
        }

        let imgContainer = `<style>
        .tyc-image-container{
            color:black;
            position:fixed;
            top:0px;
            left:10%;
            width:80vw;
            z-index:2147483645;
            background-color: #dedede;
            border: 1px solid #aaa;
            overflow:scroll;height:100%;
        }

        .tyc-image-container button{
            border:1px solid #aaa;
            border-radius:5px;
            height:32px;line-height:32px;
            margin:0px;padding:0 5px;
        }

        .tyc-image-container button:hover{
            background-color: #f50;
            color: #fff;
        }

        .control-section{
            width:80vw;
            z-index:2147483646;
            position:fixed;
            top:0px;
            left:10%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height:40px;
            background:#eee;border:1px solid #aaa;border-radius:2px;
        }

        .control-section-sub{
            display: flex;
            margin-bottom: 5px;
        }

        .tyc-normal-section{
            display: flex;
            align-items: center;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: normal;
            justify-content: flex-start;
            font-size:10px;
        }

        .tyc-normal-section *{
            padding-top:2px;
        }

        .btn-download{
            border:1px solid #aaa;border-radius:5px;
            height:32px;line-height:32px;
            margin:0px;padding:0 5px;
        }
        .btn-zipDownload{
            border:1px solid #aaa;border-radius:5px;
            height:32px;line-height:32px;
            margin:0px;padding:0 5px;
        }
        .btn-close{
            font-size:20px;position:absolute;
            right:30px;top:4px;
            height:32px;line-height:32px;
            margin:0px;
            border-radius:10px;border:1px solid #aaa;
            width:30px;
        }

        .tyc-image-wrapper{
            margin-top:82px;display:flex;justify-content:center;
            align-items:center;flex-wrap:wrap;
        }

        .tyc-input-checkbox{
            background-color: initial;
            cursor: default;
            appearance: auto;
            box-sizing: border-box;
            margin: 3px 3px 3px 4px;
            padding: initial;
            border: initial;
        }

        .tyc-extend-set{
            padding: 10px;
            border-top: 1px solid rgba(100,100,100,0.1);
        }

        .tyc-extend-set{
            display: none;
            align-items: stretch;
            flex-direction: column;
            justify-content: flex-start;
            flex-wrap: nowrap;
            padding: 5px;
            width: auto;
        }

        .tyc-extend-set-container{
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: flex-start;
            flex-wrap: nowrap;
            align-content: normal;
            border: 1px solid rgba(100,100,100,0.5);
            padding: 5px;
            margin-bottom: 5px;
        }

        .tyc-autobigimg-set{
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: flex-start;
            flex-wrap: nowrap;
            align-content: normal;
            border: 1px solid rgba(100,100,100,0.5);
            padding: 5px;
        }

        .tyc-set-domain{
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: flex-start;
            flex-wrap: nowrap;
            align-content: normal;
            margin: 5px;
            padding: 5px;
            border: 1px solid rgba(100,100,100,0.3);
            width: 95%;
            max-height: 150px;
            overflow: scroll;
        }

        .tyc-abi-title{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            width: 100%;
        }

        .tyc-abi-domain-title{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 95%;
            border-bottom: 1px solid #ddd;
        }
        .tyc-set-replacerule{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 3px;
            flex-wrap: wrap;
        }

        .tyc-set-replacerule *,.tyc-set-replacerule button{
            margin-left: 5px;
        }

        .tyc-set-domain-default{
            height: 200px;
            overflow: scroll;
            display: none;
        }
    </style>
    <div class="tyc-image-container">
        <div class="control-section">
            <div class="control-section-sub tyc-normal-section">
                <input class="select-all tyc-input-checkbox" type="checkbox" name="select-all" value="select-all">${langSet.selectAll}
                <button class="btn-download" style="margin-left:5px;">${langSet.downloadBtn}</button>
                <button class="btn-zipDownload" style="margin-left:5px;">${langSet.zipDownloadBtn}</button>
                <span style="margin-left:10px;" class="num-tip">${langSet.fetchDoneTip1}${imgUrls.length}${langSet.fetchDoneTip2}</span>
                <input type="text" class="tyc-file-name" style="height:15px;width:80px;margin-left:25px;font-size:10px;" value="${downloadFileName}">
                <input type="text" class="shortCutString" style="height:15px;width:80px;margin-left:25px;font-size:10px;" value="${shortCutString}">-ShortCut
                <button cstyle="margin-left:10px;" class="btn-close" >X</button>
            </div>


            <div style="line-height:12px;" class="control-section-sub tyc-normal-section">
                <div style="float:left;display:block;">
                <input type="checkbox" class="width-check img-check tyc-input-checkbox" name="width-check" value="width-check">Width:
                <input type="text" class="width-value-min" size="1" style="height:15px;width:50px;"
                    min="0" max="9999" value="0">-
                    <input type="text" class="width-value-max" size="1" style="height:15px;width:50px;"
                    min="0" max="9999" value="3000">
                </div>

                <div style="float:left;margin-left:30px;display:block;">
                    <input type="checkbox" class="height-check img-check tyc-input-checkbox" name="height-check" value="height-check">Height:
                    <input type="text" class="height-value-min" size="1" style="height:15px;width:50px;"
                        min="0" max="9999" value="0">-
                        <input type="text" class="height-value-max" size="1" style="height:15px;width:50px;"
                        min="0" max="9999" value="3000">
                </div>

                <div style="float:left;margin-left:30px;display:block;" class="tyc-extra-grab">
                    <input type="checkbox" class="extra-grab-check img-check tyc-input-checkbox" name="extra-grab-check" value="extra-grab-check">
                    <span>${langSet.extraGrab}</span>
                </div>

                <div style="float:left;margin-left:30px;display:block;" class="tyc-download-url">
                    <button class="tyc-download-url-btn">${langSet.downloadUrlFile}</button>
                </div>


                <div style="float:left;margin-left:30px;display:block;" class="tyc-extend-btn">
                    <span>${langSet.moreSetting} </span>
                    <span style="top: 3px;position: relative;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </span>
                </div>
            </div>
            <div class="tyc-extend-set control-section-sub">
                <div class="tyc-autobigimg-set tyc-extend-set-container">
                    <div class="tyc-abi-title">
                        <div>
                            ${langSet.autoBitImgModule}
                        </div>
                        <div>
                            <button class="tyc-default-rule-show">${langSet.defaultSettingRule}</button>
                        </div>

                        <div>
                        <button>${langSet.exportCustomRule}</button>
                    </div>

                        <div>
                            <input type="file" id="tycfileElem" multiple accept="text/plain" style="display:none">
                            <button id="tyc-file-select">${langSet.importCustomRule}</button>
                        </div>

                    </div>
                    <div class="tyc-set-domain tyc-set-domain-custom">
                    </div>
                    <div class="tyc-set-domain tyc-set-domain-default">
                    </div>
                </div>

            </div>
        </div>
        <div class="tyc-image-wrapper" >
        </div>
    </div>`

        let showBigImage = `
        <div class="show-big-image" style="position:fixed;left:30%;top:30%;z-index:2147483647;">
        </div>
    `

        let searchButton=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>`;

        document.body.insertAdjacentHTML("afterbegin", imgContainer);
        autoBigImage.showDefaultRules();
        autoBigImage.showRules("tyc-set-domain-custom","userRules","userRulesChecked","tyc-custom-active");

        document.querySelector(".tyc-image-wrapper").style=`margin-top:${document.querySelector(".control-section").clientHeight}px`;

        document.body.onclick = (e) => {
            //console.log(e);
            let ePath=e.path || (e.composedPath && e.composedPath());
            if ((e.target.nodeName == "IMG" && e.target.className === "tyc-image-preview")) {
                let imagePreview = ePath.find((ele) => ele.classList[0] === "tyc-image-preview");
                let currentImgIndex = parseInt(imagePreview.dataset.value);


                let container = ePath.find((ele) => ele.className === `tyc-img-item-container-${currentImgIndex}`);
                let infoContainer=container.getElementsByClassName("tyc-image-info-container")[0];

                if (imgSelected.includes(currentImgIndex)) {
                    imgSelected.splice(imgSelected.indexOf(currentImgIndex), 1);
                    container.style.border = "1px solid #99d";
                    infoContainer.style.backgroundColor='rgba(100,100,100,0.6)';
                } else {
                    imgSelected.push(currentImgIndex);
                    container.style.border = "1px solid #f50";
                    infoContainer.style.backgroundColor='rgba(88, 158, 255, 0.8)';

                }

                zipImgSelected=imgSelected;

                document.querySelector(".num-tip").innerText = `${langSet.fetchDoneTip1Type2}${imgSelected.length}/${imgUrls.length}${langSet.fetchDoneTip2}`;
                imgWaitDownload=transIndexToLink(filteredImgUrls,imgSelected);
                zipImgWaitDownload=transIndexToLink(zipFilteredImgUrls,zipImgSelected);
                zipImgWaitDownload=cutoffNotBase64Img(zipImgWaitDownload);


            } else if (e.target.parentElement.className === "show-big-image") {
                try {
                    document.querySelector(".show-big-image").remove();
                }
                catch
                {

                }

            } else if (e.target.classList[1] == "bi-download" || ePath.find(isDownload) != undefined) {
                let imgContainer = ePath.find(
                    (ele) => {
                        try {
                            //console.log(ele);
                            return ele.className.includes("tyc-img-item-container");
                        }
                        catch {
                        }

                    }
                )
                let path = imgContainer.getElementsByTagName("img")[0].src;
                let filename;
                if (path.indexOf("/") > 0)//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
                {
                    filename = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
                }
                else {
                    filename = path;
                }
                //console.log("download start" + path + " " + filename);
                //GM_download(path, "pic");
                let saveFileName=document.querySelector(".tyc-file-name").value||"pic";
                saveAs(path,saveFileName);
            } else if (e.target.classList[1] == "bi-arrows-fullscreen" || ePath.find(isSelect) != undefined) {
                let imgContainer = ePath.find(
                    (ele) => {
                        try {
                            //console.log(ele);
                            return ele.className.includes("tyc-img-item-container");
                        }
                        catch {
                        }
                    }
                )
                let path = imgContainer.getElementsByTagName("img")[0].src;

                try {
                    let container = document.querySelector(".show-big-image");
                    if (container.getElementsByTagName("img")[0].src === path) {
                        container.remove();
                        return;
                    } else {
                        container.remove();
                    }
                }
                catch {

                }
                document.body.insertAdjacentHTML("beforeend", showBigImage);

                let showItem = `<img src="${path}"/>`

                document.querySelector(".show-big-image").insertAdjacentHTML("beforeend", showItem);

                let tempImg = document.querySelector(".show-big-image img");

                let dWidth = (window.innerWidth - tempImg.width) / 2;
                let dHeight = (window.innerHeight - tempImg.height) / 2;

                document.querySelector(".show-big-image").style.left = dWidth + "px";
                document.querySelector(".show-big-image").style.top = dHeight + "px";

                if(tempImg.width>window.innerWidth || tempImg.height>window.innerHeight){
                    document.querySelector(".show-big-image").style.overflow="scroll";
                    if(tempImg.width>window.innerWidth){
                        document.querySelector(".show-big-image").style.left="0px";
                        document.querySelector(".show-big-image").style.width=window.innerWidth+"px";
                    }
                    if(tempImg.height>window.innerHeight){
                        document.querySelector(".show-big-image").style.top="0px";
                        document.querySelector(".show-big-image").style.height=window.innerHeight+"px";
                    }

                }

            }
        }

        document.querySelector(".btn-close").onclick = (e) => {
            document.querySelector(".tyc-image-container").remove();
        }

        document.querySelector(".btn-download").onclick = async (e) => {
            if (imgWaitDownload.length >= 1) {
                //console.log(imgWaitDownload);
/*                 imgWaitDownload.forEach(async (img, index) => {
                    //let filename = `pic-${index}.jpg`;
                    //filename=filename.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
                    //await GM_download(img, `pic-${index}`);

                }); */
                function sleep(){
                    return new Promise((resolve,reject)=>{
                        setTimeout(() => {
                            resolve(1);
                        }, 200);
                    })
                }
                for(let i=0;i<imgWaitDownload.length;i++){
                    await sleep();
                    let saveFileName=document.querySelector(".tyc-file-name").value||"pic";
                    console.log(`${saveFileName}-${i}`);
                    saveAs(imgWaitDownload[i],`${saveFileName}-${i}`);
                }
            } else {
                alert(`${langSet.selectAlert}`);
            }
        }

        document.querySelector(".btn-zipDownload").onclick = (e) => {
            //console.log(zipImgWaitDownload);
            try {
                if (zipImgWaitDownload.length >= 1) {
                    //console.log(zipImgWaitDownload);
                    zipImgWaitDownload.forEach(async (img, index) => {
                        let fileExt = img.substring(img.indexOf("image/") + 6, img.indexOf(";"))
                        fileExt=fileExt.includes("svg")?"svg":fileExt;
                        let saveFileName=document.querySelector(".tyc-file-name").value||"pic";
                        let filename = `${saveFileName}-${index}.${fileExt}`;
                        zipSubFoler.file(filename, img.split(",")[1], { base64: true });
                    });

                    zipFolder.generateAsync({ type: "blob" })
                        .then(function (content) {
                            // see FileSaver.js
                            let saveFileName=document.querySelector(".tyc-file-name").value||"pic";
                            saveAs(content, `${saveFileName}.zip`);
                            zipFolder.remove("pics");
                            zipSubFoler = zipFolder.folder('pics');
                        });

                } else {
                    alert(`${langSet.selectAlert}`);
                }
            } catch (error) {
                //console.log(error);
            }


        }

        document.body.onchange = (e) => {
            if (e.target.className.includes("width-check")) {
                GM_setValue('width-check', e.target.checked);
            }
            if (e.target.className.includes("height-check")) {
                GM_setValue('height-check', e.target.checked);
            }

            if (e.target.className.includes("extra-grab-check")) {
                GM_setValue('extra-grab-check', e.target.checked);
                if (document.querySelector(".extra-grab-check").checked) {
                    //fetchBase64ImgsThenPushToZipArray();
                }
            }

            if(e.target.className.includes("tyc-default-active")){
                autoBigImage.oncheckChange();
            }

            if(e.target.className.includes("tyc-custom-active")){
                autoBigImage.oncheckChangeCustom();
            }

            if (e.target.nodeName === "INPUT" && e.target.type === "text" && e.target.className.includes("value")) {
                GM_setValue(e.target.className, e.target.value);
            }

            if (e.target.nodeName === "INPUT" && e.target.type === "text" && e.target.className.includes("shortCutString")) {
                GM_setValue(e.target.className, e.target.value);
                hotkeys(e.target.value, wrapper);
            }

            (e.target.className.includes("width-check") || e.target.className.includes("height-check") ||

                (e.target.nodeName === "INPUT" && e.target.type === "text" && e.target.className.includes("value")))
                && (clean(), init());

        }

        document.querySelector(".select-all").onchange = (e) => {
            if (document.querySelector(".select-all").checked) {
                imgWaitDownload = filteredImgUrls;
                zipImgWaitDownload=cutoffNotBase64Img(zipFilteredImgUrls);
            } else {
                imgWaitDownload=transIndexToLink(filteredImgUrls,imgSelected);
                zipImgWaitDownload=transIndexToLink(zipFilteredImgUrls,zipImgSelected);
            }

            document.querySelector(".num-tip").innerText = `${langSet.fetchDoneTip1Type2}${imgWaitDownload.length}/${filteredImgUrls.length}${langSet.fetchDoneTip2}`;
        }

        document.querySelector(".tyc-extend-btn").onclick=e=>{
            if(document.querySelector(".tyc-extend-btn").classList.contains("extend-open")){
                document.querySelector(".tyc-extend-btn").classList.remove("extend-open");
                document.querySelector(".tyc-extend-set").style.display="none";
                document.querySelector(".tyc-extend-btn").style.color="black";
                document.querySelector(".tyc-extend-btn").innerHTML=`<span>${langSet.moreSetting}</span>
                <span style="top: 3px;position: relative;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </span> `
                ;
            }else{
                document.querySelector(".tyc-extend-btn").classList.add("extend-open");
                document.querySelector(".tyc-extend-set").style.display="flex";
                document.querySelector(".tyc-extend-btn").style.color="#f50";
                document.querySelector(".tyc-extend-btn").innerHTML=`<span>${langSet.fold} </span>
                <span style="top: 3px;position: relative;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708l6-6z"/>
                    <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                    </svg>
                </span> `

            }
        }

        document.querySelector(".tyc-default-rule-show").onclick=autoBigImage.onclickShowDefaultBtn;

        document.querySelector("#tyc-file-select").onclick=e=>{
            document.querySelector("#tycfileElem").click();
        }

        document.querySelector("#tycfileElem").onchange=autoBigImage.getCustomRules;

        document.querySelector(".tyc-download-url-btn").onclick=e=>{
            let blob=new Blob([imgWaitDownload.join("\n")],{ type: "text/plain", endings: "native" });
            saveAs(blob,"urls.txt");
        }


        init();
        function init() {
            filteredImgUrls = imgUrls;
            filteredImgUrls=autoBigImage.getBigImageArray(filteredImgUrls);
            getSavedValue();
            if (document.querySelector(".width-check").checked) {
                filteredImgUrls = filteredImgUrls.filter(filterByWidth);
            }

            if (document.querySelector(".height-check").checked) {
                filteredImgUrls = filteredImgUrls.filter(filterByHeight);
            }


            zipFilteredImgUrls = filteredImgUrls;
            
            fetchBase64ImgsThenPushToZipArray();
            
            showImage(filteredImgUrls);
        }

        function clean() {
            imgWaitDownload = [];
            imgSelected = [];
            document.querySelector(".num-tip").innerText = `${langSet.fetchDoneTip1Type2}${imgSelected.length}/${imgUrls.length}${langSet.fetchDoneTip2}`;
            document.querySelector(".tyc-image-wrapper").innerHTML = "";
        }

        function isDownload(ele) {
            return ele.className == "download-direct";
        }

        function isSelect(ele) {
            return ele.className == "fullscreen-image";
        }

        function transIndexToLink(WholeImgs,selectedImgs) {
            let transedImgs=[];
            selectedImgs.forEach((imgIndex, index) => {
                transedImgs.push(WholeImgs[imgIndex]);
            });
            return transedImgs;
        }

        function showImage(filtedImgUrls) {
            filtedImgUrls.forEach((img, index) => {
                if (window.location.href.includes("huaban.com")) {
                    if (img.includes("/webp")) {
                        img = img.replace(/\/webp/g, "/png");
                    }
                }
                let insertImg = `<div class="tyc-img-item-container-${index}" style="text-align:center;font-size:0px;
    margin:5px;border:1px solid #99d;border-radius:3px;
    ">
    <img class="tyc-image-preview" src="${img}"/ style="width:auto;height:200px;" data-value="${index}"></div>`
                document.querySelector(".tyc-image-wrapper").insertAdjacentHTML("beforeend", insertImg);
                let naturalW = document.querySelector(`.tyc-img-item-container-${index} .tyc-image-preview`).naturalWidth;
                let naturalH = document.querySelector(`.tyc-img-item-container-${index} .tyc-image-preview`).naturalHeight;

                let imgInfoContainer = `
            <div class="tyc-image-info-container" style="font-size:0px;background-color:rgba(100,100,100,0.6);height:30px;position:relative;">


    </div>
            `;

                let thisImgContainer = document.querySelector(`.tyc-img-item-container-${index}`);
                let imgContainerWidth = thisImgContainer.getBoundingClientRect().width;
                let imgInfo = `
            <span style="font-size:16px;position:absolute;left:calc(50% - 80px);top:7px;">${naturalW}X${naturalH}</span>
            `;


                /*
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16" style="position:absolute;top:5px;right:5px;">
          <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
        </svg>*/

                let downAndFullBtn = `
    <span style="position:absolute;right:calc(50% - 30px);top:2px;border:1px solid #333;
    width:26px;height:26px;border-radius:20px;" class="fullscreen-image" data-value="${index}">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-fullscreen" viewBox="0 0 16 16"  style="position:absolute;top:4px;right:4px;width:18px;height:18px;" data-value="${index}">
        <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
    </svg>
    </span>
    <span style="position:absolute;right:calc(50% - 60px);top:2px;border:1px solid #333;
    width:26px;height:26px;border-radius:20px;
    " class="download-direct">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16" style="position:absolute;top:5px;right:5px;">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
    </svg>
    </span>

    `;

                let downloadBtn = `
            <span style="position:absolute;right:calc(50% - 15px);top:2px;border:1px solid #333;
    width:26px;height:26px;border-radius:20px;
    " class="download-direct">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16" style="position:absolute;top:5px;right:5px;">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
    </svg>
    </span>
            `
                thisImgContainer.insertAdjacentHTML("beforeend", imgInfoContainer);

                let thisImgInfoContainer = thisImgContainer.querySelector("div");

                let rectWidth = parseInt(thisImgContainer.getBoundingClientRect().width);

                if (rectWidth > 120) {
                    thisImgInfoContainer.insertAdjacentHTML("beforeend", imgInfo);
                    thisImgInfoContainer.insertAdjacentHTML("beforeend", downAndFullBtn);
                } else if (rectWidth <= 120 && rectWidth >= 50) {
                    thisImgInfoContainer.insertAdjacentHTML("beforeend", downAndFullBtn);
                    thisImgInfoContainer.getElementsByClassName("fullscreen-image")[0].style.right = "50%";
                    thisImgInfoContainer.getElementsByClassName("download-direct")[0].style.right = "calc(50% - 30px)";
                } else {
                    thisImgInfoContainer.insertAdjacentHTML("beforeend", downloadBtn);
                }
                ////console.log(img);
            });
        }

        function filterByWidth(src) {
            let tempImg = new Image();
            tempImg.src = src;
            if (tempImg.width >= parseInt(document.querySelector(".width-value-min").value)
                && tempImg.width <= parseInt(document.querySelector(".width-value-max").value)) {
                return src;
            }
        }

        function filterByHeight(src) {
            let tempImg = new Image();
            tempImg.src = src;
            if (tempImg.height >= parseInt(document.querySelector(".height-value-min").value)
                && tempImg.height <= parseInt(document.querySelector(".height-value-max").value)) {
                return src;
            }
        }

        function getSavedValue() {
            if(GM_getValue("width-check")!=undefined){
                //console.log(GM_getValue("width-check"));
                (document.querySelector(".width-check").checked = GM_getValue("width-check"));
            }

            if(GM_getValue("height-check")!=undefined){
                (document.querySelector(".height-check").checked = GM_getValue("height-check"));
            }

            if(GM_getValue("extra-grab-check")!=undefined){
                (document.querySelector(".extra-grab-check").checked = GM_getValue("extra-grab-check"));
            }

            GM_getValue("width-value-min") && (document.querySelector(".width-value-min").value = GM_getValue("width-value-min"));
            GM_getValue("width-value-max") && (document.querySelector(".width-value-max").value = GM_getValue("width-value-max"));
            GM_getValue("height-value-min") && (document.querySelector(".height-value-min").value = GM_getValue("height-value-min"));
            GM_getValue("height-value-max") && (document.querySelector(".height-value-max").value = GM_getValue("height-value-max"));
            GM_getValue("shortCutString") && (document.querySelector(".shortCutString").value = GM_getValue("shortCutString"));
        }

        function fetchBase64ImgsThenPushToZipArray() {
            zipFilteredImgUrls.forEach((imgUrl, urlIndex) => {
                if (imgUrl.includes("data:image")) {
                    return;
                }

/*                 fetch(imgUrl,{
                    method: "get",
                    mode: 'cors'
                }).then(response=>{
                    if (!response.ok) {
                        throw new Error('Network response was not OK');
                      }
                      return response.blob();
                    }).then(myBlob=>{
                    var blob = myBlob
                        let oFileReader = new FileReader();
                        oFileReader.onloadend = function (e) {
                            let base64 = e.target.result;
                            //console.log("》》", base64)

                            if (base64.includes("data:image")) {
                                zipFilteredImgUrls[urlIndex] = base64;
                                //zipImgWaitDownload.push(base64);
                            }
                        };
                        oFileReader.readAsDataURL(blob);
                })
                .catch((error)=>{ */
                try {
                    let host=window.location.origin+"/";
                    GM_xmlhttpRequest({
                        method: "get",
                        url: imgUrl,
                        headers: {referer: host},
                        responseType: "blob",
                        onload: function (r) {
                            var blob = r.response;
                            let oFileReader = new FileReader();
                            oFileReader.onloadend = function (e) {
                                let base64 = e.target.result;
                                if (base64.startsWith("data:image")) {
                                    zipFilteredImgUrls[urlIndex] = base64;
                                    //zipImgWaitDownload.push(base64);
                                }
                            };
                            oFileReader.readAsDataURL(blob);
                        }
                    });
                } catch (error) {

                }

                //})
            })
        }

        function cutoffNotBase64Img(imgsUrlArray) {
            let resultArr = [];
            imgsUrlArray.forEach((imgUrl, urlIndex) => {
                if (imgUrl.startsWith("data:image")&&imgUrl.includes("base64")) {
                    resultArr.push(imgUrl);
                }
            }
            );
            return resultArr;
        }
    //下面这个括号是wrapper的括号
    }
})();