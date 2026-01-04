// ==UserScript==
// @name         Youtube Live Replay Comment Collector
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  利用直播comment寻找直播回放中的热点片段方便剪辑man干活
// @author       yuyuyzl
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/390590/Youtube%20Live%20Replay%20Comment%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/390590/Youtube%20Live%20Replay%20Comment%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(document.getElementsByClassName("ytp-live").length!=0)return;
        var chatID=document.body.innerHTML.match(/"reloadContinuationData":{"continuation":".*?"/g)[2].split('\"')[5];
        var APIKey=document.head.innerHTML.match(/"INNERTUBE_API_KEY":"(.*?)"/)[1];
        //var chatID="op2w0wRjGlBDamdhRFFvTFoySnVTbkJrWTNSQlVITXFKd29ZVlVNeGIzQklWWEozT0hKMmJuTmhaRlF0YVVkd04wTm5FZ3RuWW01S2NHUmpkRUZRY3lBQkABWgUQoI2DAWAEcgIIBHgB"
        console.log(chatID);
        console.log(APIKey);
        var timeStr=document.getElementsByClassName("ytp-time-duration")[0].innerText.split(":");

        console.log(timeStr);
        var videoLengthMs=0;
        for(var s of timeStr){
            videoLengthMs=videoLengthMs*60+(+s);
        }
        videoLengthMs*=1000;
        console.log(videoLengthMs);
        var comments={};
        var requestCount=0,requestDone=0;
        var animateBar=0;
        var node=document.createElement("DIV");
        node.style["pointer-events"]="none";
        document.getElementsByClassName("ytp-progress-bar-container")[0].appendChild(node);
        var btnStart=document.createElement("BUTTON");
        function getChatReplay(chatID,offsetMs,callback){
            requestCount++;
            btnStart.innerText="获取评论数据中...("+requestDone+"/"+requestCount+")";

            GM_xmlhttpRequest({
                method: "POST",
                cache: false,
                data: `{\"context\":{\"client\":{\"hl\":\"zh-CN\",\"gl\":\"US\",\"remoteHost\":\"8.8.8.8\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36,gzip(gfe)\",\"clientName\":\"WEB\",\"clientVersion\":\"2.20230201.01.00\",\"osName\":\"Windows\",\"osVersion\":\"10.0\",\"originalUrl\":\"\",\"screenPixelDensity\":2,\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"\"},\"screenDensityFloat\":2,\"timeZone\":\"Asia/Shanghai\",\"browserName\":\"Chrome\",\"browserVersion\":\"109.0.0.0\",\"acceptHeader\":\"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\",\"deviceExperimentId\":\"\",\"screenWidthPoints\":400,\"screenHeightPoints\":558,\"utcOffsetMinutes\":480,\"userInterfaceTheme\":\"USER_INTERFACE_THEME_LIGHT\",\"connectionType\":\"CONN_CELLULAR_3G\",\"memoryTotalKbytes\":\"8000000\",\"mainAppWebInfo\":{\"graftUrl\":\"\",\"webDisplayMode\":\"WEB_DISPLAY_MODE_BROWSER\",\"isWebNativeShareAvailable\":true}},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true,\"internalExperimentFlags\":[],\"consistencyTokenJars\":[]},\"adSignalsInfo\":{\"params\":[{\"key\":\"dt\",\"value\":\"1675504743539\"},{\"key\":\"flash\",\"value\":\"0\"},{\"key\":\"frm\",\"value\":\"1\"},{\"key\":\"u_tz\",\"value\":\"480\"},{\"key\":\"u_his\",\"value\":\"5\"},{\"key\":\"u_h\",\"value\":\"1080\"},{\"key\":\"u_w\",\"value\":\"1920\"},{\"key\":\"u_ah\",\"value\":\"1040\"},{\"key\":\"u_aw\",\"value\":\"1920\"},{\"key\":\"u_cd\",\"value\":\"24\"},{\"key\":\"bc\",\"value\":\"31\"},{\"key\":\"bih\",\"value\":\"969\"},{\"key\":\"biw\",\"value\":\"1127\"},{\"key\":\"brdim\",\"value\":\"0,0,0,0,1920,0,1920,1040,400,558\"},{\"key\":\"vis\",\"value\":\"1\"},{\"key\":\"wgl\",\"value\":\"true\"},{\"key\":\"ca_type\",\"value\":\"image\"}]}},"continuation":"${chatID}","currentPlayerState":{"playerOffsetMs":"${offsetMs}"}}`,

                url:  "https://www.youtube.com/youtubei/v1/live_chat/get_live_chat_replay?key="+APIKey+"&prettyPrint=false",
                onload:function(data){
                    var responseObj=JSON.parse(data.responseText);
                    //console.log(responseObj.response.continuationContents.liveChatContinuation.actions);
                    var itemsList={};
                    let minTime=2148473647;
                    let maxTime=0;
                    for(var item of responseObj.continuationContents.liveChatContinuation.actions){
                        let itemInner={};
                        let itemArranged={
                            time: +item.replayChatItemAction.videoOffsetTimeMsec,
                            //id: item.replayChatItemAction.actions[0].addChatItemAction.item.liveChatTextMessageRenderer.id,
                            //text: item.replayChatItemAction.actions[0].addChatItemAction.item.liveChatTextMessageRenderer.message.runs[0].text
                        };
                        itemArranged.timehms=Math.floor(itemArranged.time/1000/60/60)+":"+Math.floor(itemArranged.time/1000/60)%60+":"+Math.floor(itemArranged.time/1000)%60;
                        //console.log(item);
                        try{
                        if(item.replayChatItemAction.actions[0].addChatItemAction.item.hasOwnProperty("liveChatPaidMessageRenderer")){
                            //continue;
                            itemInner=item.replayChatItemAction.actions[0].addChatItemAction.item.liveChatPaidMessageRenderer;
                            itemArranged.isPaid=true;
                            itemArranged.amountPaid=itemInner.purchaseAmountText.simpleText;
                        }else if(item.replayChatItemAction.actions[0].addChatItemAction.item.hasOwnProperty("liveChatTextMessageRenderer")){
                            itemInner=item.replayChatItemAction.actions[0].addChatItemAction.item.liveChatTextMessageRenderer;
                            itemArranged.isPaid=false;
                            itemArranged.amountPaid=0;
                        }else continue;
                        }catch(e){continue;}
                        itemArranged.id=itemInner.id;
                        itemArranged.authorName=itemInner.authorName.simpleText;
                        var itemText="";
                        try{
                        for(var run of itemInner.message.runs){
                            if(run.hasOwnProperty("text"))itemText+=run.text;
                            if(run.hasOwnProperty("emoji"))itemText+=run.emoji.emojiId;
                        }
                        }catch(e){continue;}
                        itemArranged.text=itemText;
                        if(itemArranged.isPaid===false){
                            minTime=minTime>itemArranged.time?itemArranged.time:minTime;
                            maxTime=maxTime<itemArranged.time?itemArranged.time:maxTime;
                        }
                        itemsList[itemArranged.id]=itemArranged;
                    }
                    requestDone++;
                    btnStart.innerText="获取评论数据中...("+requestDone+"/"+requestCount+")";
                    callback(itemsList,minTime,maxTime);
                }
            });
        }
        var lock=0;
        var timestart=new Date().getTime();
        function sliceBlankArea(left,right){
            if(requestCount>2000)return;
            var reqTime=Math.round((left+right)/2);
            console.log(left+"-sliceBlankArea-"+right);
            if(right-left>300000){
                sliceBlankArea(left,reqTime);
                sliceBlankArea(reqTime,right);
                return;
            }
            getChatReplay(chatID,reqTime,(data,min,max)=>{
                if(min>reqTime)min=left;
                if(max<reqTime)max=right;
                for(var key in data)comments[key]=data[key];
                console.log("UPDATED COMMENTS, SIZE:"+Object.keys(comments).length);
                console.log("REQCOUNT:"+requestCount)
                if(left<min)sliceBlankArea(left,min);
                if(max<right)sliceBlankArea(max,right);
                if(requestCount===requestDone){
                    clearInterval(animateBar);
                    console.log("sliceBlank DONE, time:"+(new Date().getTime()-timestart)+" REQCOUNT:"+requestCount);
                    console.log(comments);
                    btnStart.disabled=false;
                    btnStart.innerText="导出CSV/TSV文件";
                    btnStart.onclick=function(){
                        function getUrlParam(k) {
                            var regExp = new RegExp('([?]|&)' + k + '=([^&]*)(&|$)');
                            var result = window.location.href.match(regExp);
                            if (result) {
                                return decodeURIComponent(result[2]);
                            } else {
                                return null;
                            }
                        }
                        var sep=confirm("导出为TSV？（是：TSV，否：CSV）")?"\t":",";

                        var csvComments="\ufeffid"+sep+"isPaid"+sep+"author"+sep+"time"+sep+"timehms"+sep+"text"+sep+"amountPaid";
                        for(let commentID in comments){
                            const comment=comments[commentID];
                            csvComments+="\n"+comment.id+sep+comment.isPaid+sep+comment.authorName+sep+comment.time+sep+comment.timehms+sep+comment.text+sep+comment.amountPaid;
                        }
                        console.log(csvComments);
                        var blobContent = new Blob([csvComments], {type: "text/plain;charset=utf-8"});
                        const blobUrl = window.URL.createObjectURL(blobContent)

                        downloadFileByBlob(blobUrl, getUrlParam("v")+'_Comments.'+(sep==="\t"?"tsv":"csv"));

                        function downloadFileByBlob(blobUrl, filename) {
                            const eleLink = document.createElement('a')
                            eleLink.download = filename
                            eleLink.style.display = 'none'
                            eleLink.href = blobUrl
                            document.body.appendChild(eleLink)
                            eleLink.click()
                            document.body.removeChild(eleLink)
                        }
                    }
                    const gradientCount=Math.ceil(videoLengthMs/20000);
                    var commentCount=new Array(gradientCount+1);
                    for(let i=0;i<=gradientCount;i++)commentCount[i]=0;
                    for(let commentID in comments){
                        const comment=comments[commentID];
                        if(comment.isPaid===false)commentCount[Math.round(comment.time*gradientCount/videoLengthMs)]++;
                    }
                    //console.log(commentCount);
                    var countMax=0;
                    var countMin=999999999;
                    for(let i=0;i<=gradientCount;i++){
                        countMax=countMax<commentCount[i]?commentCount[i]:countMax;
                        countMin=countMin>commentCount[i]?commentCount[i]:countMin;
                    }
                    //console.log(countMax+","+countMin);

                    for(let i=0;i<=gradientCount;i++){
                        console.log(commentCount[i])
                        commentCount[i]="rgba(255,255,0,"+((commentCount[i]-countMin)/(countMax-countMin)).toFixed(2)+") "+(i*100/(gradientCount)).toFixed(2)+"%";
                    }
                    //console.log(commentCount);
                    var stylebg="linear-gradient(to right,"+commentCount.slice(0,gradientCount+1).join(",")+")";
                    node.style.background=stylebg;
                    console.log(node.style.background);
                    console.log(stylebg);
                }
            });

        }
        Node.prototype.prependChild = function (newNode){
            this.insertBefore(newNode,this.firstChild);
        }
        
        btnStart.innerText="运行评论热点分析";
        btnStart.style.background= "none";
        btnStart.style.border= "1px solid rgb(5,95,212)";
        btnStart.style.width= "100%";
        btnStart.style.height= "36px";
        btnStart.style.color= "rgb(5,95,212)";
        btnStart.onclick=function(){

            var chatID=document.body.innerHTML.match(/"reloadContinuationData":{"continuation":".*?"/g)[confirm("获取所有评论？（是：所有，否：热门）")?2:1].split('\"')[5];
            btnStart.disabled=true;
            timestart=new Date().getTime();
            node.style.height="100%";
            node.style.width="100%";
            node.style.position="absolute";
            node.style.bottom="0";
            node.style.left="0";
            node.style["z-index"]="32";
            var animateCount=0;
            animateBar=setInterval(function(){
                animateCount=(animateCount+1)%20;
                if(requestCount!==requestDone)node.style.background="rgba(0,255,0,"+(1-animateCount/19)+")";
            },50);
            sliceBlankArea(0,videoLengthMs);
        };
        document.getElementById("secondary-inner").prependChild(btnStart);



    },5000);

})();