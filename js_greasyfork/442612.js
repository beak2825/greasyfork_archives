// ==UserScript==
// @name         超星学习视频
// @namespace    渔
// @version      4.23
// @description  视频推荐一倍速，已开多线程，可同时刷多个视频
// @author       渔
// @run-at       document-end
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @icon         https://qlogo4.store.qq.com/qzone/2314766321/2314766321/100?1646073668
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      api.7j112.com
// @connect      tencent-api.7j112.com
// @connect      cx.icodef.com
// @license      https://qq2314766321.lanzoub.com/b00nwb6tc
// @downloadURL https://update.greasyfork.org/scripts/442612/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/442612/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(()=>{
var maxRate = 1, //限制视频最高倍速为32倍，防止倍速过高导致的脚本失去控制（不建议大于一倍速有概率视频会被打回来）
    token = 'GpJibLqPRGVpQWmM' , //
    host = 0 , //为支持部分校园网，服务器提供多条线路，目前有 0：阿里云(默认) 1：腾讯云
    jumpType = 1 , // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式。
    disableMonitor = 1 ,// 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
    disableFace = 1 ;//是否自动解除人脸二维码，0:关闭，1:遇到人脸后10秒解锁。




var hostList = [
    'http://api.7j112.com/',
    'http://tencent-api.7j112.com/'
    ],
    rate = GM_getValue('unrivalrate','1')||1,
    getQueryVariable = (variable) => {
        let q = _l.search.substring(1),
            v = q.split("&"),
            r = false;
        for (let i = 0, l = v.length; i < l; i++) {
            let p = v[i].split("=");
            p[0] == variable && (r = p[1]);
        }
        return r;
    },
    _w = unsafeWindow,
    _d = _w.document,
    _l = _w.location,
    _p = _l.protocol,
    _h = _l.host;
if(parseFloat(rate)==parseInt(rate)){
    rate = parseInt(rate);
}else{
    rate = parseFloat(rate);
}
try{
    _w.top.unrivalReviewMode = GM_getValue('unrivalreview','0')||'0';
    _w.top.unrivalDoWork = GM_getValue('unrivaldowork','0')||'0';
    _w.top.unrivalAutoSubmit = GM_getValue('unrivalautosubmit','0')||'0';
    _w.top.unrivalAutoSave = GM_getValue('unrivalautosave','0')||'0';
}catch(e){}
if(_l.href.indexOf("visit/stucoursemiddle") >0||_l.href.indexOf("mycourse/studentstudy") >0){
    var timmer = setInterval(function(){
        try{
            if(_d.getElementById("uuid")==null){
                return;
            }
            var uuid = _d.getElementById("uuid").value,
                qrcEnc = _d.getElementById("qrcEnc").value,
                courseId = _d.getElementById("fccourseId").value,
                classId = _d.getElementById("fcclazzId").value,
                oidSample = "abcdefttguhhniafunrivvalaffxafcekyu2345678",
                oidSampleLen = oidSample.length,
                oid = "";
            for (var i = 0; i < 32; i++) oid += oidSample.charAt(Math.floor(Math.random() * oidSampleLen));
            var popElements = _d.getElementsByClassName("popDiv wid640 faceCollectQrPop popClass"),
                popVideoElements = _d.getElementsByClassName("popDiv1 wid640 faceCollectQrPopVideo popClass");
            if(popElements.length>0||popVideoElements.length>0){
                var failTimeEs = _d.getElementsByClassName("faceVideoCheckFailCount"),
                    failCount = "0";
                if(failTimeEs.length>0){
                    failCount = failTimeEs[0].innerHTML;
                }
                GM_xmlhttpRequest({
                    method: "post",
                    url: _p+"//mooc1-api.chaoxing.com/qr/updateqrstatus",
                    data: "clazzId="+classId+"&courseId="+courseId+"&uuid="+uuid+"&objectId="+oid+"&qrcEnc="+qrcEnc+"&failCount="+failCount+"&compareResult=0",
                    synchronous: true,
                    headers:  {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function(res){
                        if(res.responseText.indexOf('二维码已失效')>0){
                            _l.reload();
                        }
                        console.log(res.responseText);
                    },
                    onerror : function(err){
                        console.log(err);
                    }
                });
                return;
            }
            var popElementss = _d.getElementsByClassName("popDiv wid640");
            if(popElementss.length<1){
                return;
            }
            var faceElement = _d.getElementById("fcqrimg");
            if(faceElement==null){
                return;
            }
            var knowledgeId = "0",
                knowledgeIdE = _d.getElementById("chapterIdid");
            if(knowledgeIdE!==null){
                knowledgeId = knowledgeIdE.value;
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: _p+"//mooc1-api.chaoxing.com/knowledge/uploadInfo",
                synchronous: true,
                data: "clazzId="+classId+"&courseId="+courseId+"&knowledgeId="+knowledgeId+"&uuid="+uuid+"&qrcEnc="+qrcEnc+"&objectId="+oid,
                headers:  {
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                onload: function(res){
                    if(res.responseText.indexOf('二维码已失效')>0){
                        _l.reload();
                    }
                    console.log(res.responseText);
                },
                onerror : function(err){
                    console.log(err);
                }
            });
        }catch(err){
            console.log(err);
        }
    },4000);
}
if(_l.href.indexOf("knowledge/cards") >0){
    if(_d.documentElement.outerHTML.indexOf('<span style="font-size:18px;margin-top:10px;margin-left:10px;" class="fl">章节未开放！</span>')!=-1&&_l.href.indexOf("ut=s")!=-1){
        _l.href = _l.href.replace("ut=s","ut=t");
        return;
    }
    _w.top.unrivalPageRd = String(Math.random());
    var busyThread = 0,
        getStr = (str, start, end)=> {
            let res = str.substring(str.indexOf(start),str.indexOf(end)).replace(start,'');
            return res ;
        },
        scripts = _d.getElementsByTagName('script'),
        param = null,
        rt='0.9';
    for(let i=0,l=scripts.length;i<l;i++){
        if(scripts[i].innerHTML.indexOf('mArg = "";')!=-1&&scripts[i].innerHTML.indexOf('==UserScript==')==-1){
            param = getStr(scripts[i].innerHTML,'try{\n    mArg = ',';\n}catch(e){');
        }
    }
    if(param==null){
        return;
    }
    _d.getElementsByTagName("html")[0].innerHTML=`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>“渔“助手</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.css" rel="stylesheet">
        <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
        <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <script src="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js"></script>
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;">“渔助手-2022.4.23”&ensp;</h3>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info" id="normalQuery">
                    <div class="panel-heading">任务配置</div>
                    <div class="panel-body">
                        <div>
                            <div style="padding: 0;font-size: 20px;float: left;">视频倍速：</div>
                            <div>
                                <input type="number" id="unrivalRate" style="width: 80px;">
                                &ensp;

                                <a id='updateRateButton' class="btn btn-default">保存</a>
                                &nbsp;|&nbsp;
                                <a id='reviewModeButton' class="btn btn-default">复习模式</a>
                            </div><br>
                            <div style="padding: 0;font-size: 20px;float: left;">章节测试：</div>
                            <a id='autoDoWorkButton' class="btn btn-default">自动答题</a>&nbsp;|&nbsp;
                            <a id='autoSubmitButton' class="btn btn-default">自动提交</a>&nbsp;|&nbsp;
                            <a id='autoSaveButton' class="btn btn-default">自动保存</a>

                        </div>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">任务列表</div>
                    <div class="panel-body" id='joblist'>

                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">运行日志</div>
                    <div class="panel-body">
                        <div id="result" style="overflow:auto;line-height: 30px;">
                            <div id="log">
                                <span style="color: red">[00:00:00]如果此提示不消失，说明页面出现了错误，请联系作者</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info" id='workPanel' style="display: none;height: 1000px;">
                    <div class="panel-heading">章节测试</div>
                    <div class="panel-body" id='workWindow' style="height: 100%;">
                        <iframe id="frame_content" name="frame_content" src="" frameborder="0" scrolling="auto"
                            style="width: 100%;height: 95%;"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
`;
    var logs = {
        "logArry": [],
        "addLog": function(str, color = "black") {
            if (this.logArry.length >= 50) {
                this.logArry.splice(0, 1);
            }
            var nowTime = new Date();
            var nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2);
            var nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2);
            var nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2);
            this.logArry.push("<span style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                nowSec + "] " + str + "</span>");
            let logStr = "";
            for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                logStr += this.logArry[logI] + "<br>";
            }
            _d.getElementById('log').innerHTML = logStr;
            var logElement = _d.getElementById('log');
            logElement.scrollTop = logElement.scrollHeight;
        }
    },
        htmlHook = setInterval(function(){
        if(_d.getElementById('unrivalRate')&&_d.getElementById('updateRateButton')&&_d.getElementById('reviewModeButton')&&_d.getElementById('autoDoWorkButton')&&_d.getElementById('autoSubmitButton')&&_d.getElementById('autoSaveButton')){
            clearInterval(htmlHook);
            _d.getElementById('unrivalRate').value = rate;
            _d.getElementById('updateRateButton').onclick = function(){
                let urate = _d.getElementById('unrivalRate').value;
                if(parseFloat(urate)==parseInt(urate)){
                    urate = parseInt(urate);
                }else{
                    urate = parseFloat(urate);
                }
                if(urate>maxRate){
                    _d.getElementById('unrivalRate').value = rate;
                    logs.addLog('已超过脚本限制最高倍速，修改失败，如有需求请修改脚本代码内限制参数','red');
                    return;
                }
                if(urate>0){
                    GM_setValue('unrivalrate',urate);
                    logs.addLog('视频倍速已更新为'+urate+'倍，将在3秒内生效','green');
                    rate = urate;
                }
            }
            _d.getElementById('reviewModeButton').onclick=function(){
                let reviewButton = _d.getElementById('reviewModeButton');
                if(reviewButton.getAttribute('class')=='btn btn-default'){
                    _d.getElementById('reviewModeButton').setAttribute('class','btn btn-success');
                    logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过','green');
                    GM_setValue('unrivalreview','1');
                    _w.top.unrivalReviewMode = '1';
                }else{
                    _d.getElementById('reviewModeButton').setAttribute('class','btn btn-default');
                    logs.addLog('复习模式已关闭，遇到已完成的视频任务会自动跳过','green');
                    GM_setValue('unrivalreview','0');
                    _w.top.unrivalReviewMode = '0';
                }
            }
            _d.getElementById('autoDoWorkButton').onclick=function(){
                let autoDoWorkButton = _d.getElementById('autoDoWorkButton');
                if(autoDoWorkButton.getAttribute('class')=='btn btn-default'){
                    _d.getElementById('autoDoWorkButton').setAttribute('class','btn btn-success');
                    logs.addLog('自动做章节测试已开启，将会自动做章节测试','green');
                    GM_setValue('unrivaldowork','1');
                    _w.top.unrivalDoWork = '1';
                }else{
                    _d.getElementById('autoDoWorkButton').setAttribute('class','btn btn-default');
                    logs.addLog('自动做章节测试已关闭，将不会自动做章节测试','green');
                    GM_setValue('unrivaldowork','0');
                    _w.top.unrivalDoWork = '0';
                }
            }
            _d.getElementById('autoSubmitButton').onclick=function(){
                let autoSubmitButton = _d.getElementById('autoSubmitButton');
                if(autoSubmitButton.getAttribute('class')=='btn btn-default'){
                    _d.getElementById('autoSubmitButton').setAttribute('class','btn btn-success');
                    logs.addLog('符合提交标准的章节测试将会自动提交','green');
                    GM_setValue('unrivalautosubmit','1');
                    _w.top.unrivalAutoSubmit = '1';
                }else{
                    _d.getElementById('autoSubmitButton').setAttribute('class','btn btn-default');
                    logs.addLog('章节测试将不会自动提交，等待用户操作','green');
                    GM_setValue('unrivalautosubmit','0');
                    _w.top.unrivalAutoSubmit = '0';
                }
            }
            _d.getElementById('autoSaveButton').onclick=function(){
                let autoSaveButton = _d.getElementById('autoSaveButton');
                if(autoSaveButton.getAttribute('class')=='btn btn-default'){
                    _d.getElementById('autoSaveButton').setAttribute('class','btn btn-success');
                    logs.addLog('不符合提交标准的章节测试将会自动保存','green');
                    GM_setValue('unrivalautosave','1');
                    _w.top.unrivalAutoSave = '1';
                }else{
                    _d.getElementById('autoSaveButton').setAttribute('class','btn btn-default');
                    logs.addLog('不符合提交标准的章节测试将不会自动保存，等待用户自己操作','green');
                    GM_setValue('unrivalautosave','0');
                    _w.top.unrivalAutoSave = '0';
                }
            }
        }
    },100);
    try{
        var pageData = JSON.parse(param);
    }catch(e){
        if(jumpType!=2){
            _w.top.jump = true;
            logs.addLog('此页无任务，5秒后自动下一章','green');
        }else{
            logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数','green');
        }
        return;
    }
    var data = pageData['defaults'],
        jobList = [],
        classId = data['clazzId'],
        courseId = data['courseid'],
        chapterId = data['knowledgeid'],
        UID = data['userid'],
        reportUrl = data['reportUrl'],
        ktoken = data['ktoken'];
    for(let i=0,l=pageData['attachments'].length;i<l;i++){
        let item = pageData['attachments'][i];
        if(item['job']!=true||item['isPassed']==true){
            if(_w.top.unrivalReviewMode=='1'&&item['type']=='video'){
                jobList.push(item);
            }else{
                continue;
            }
        }else{
            jobList.push(item);
        }
    }
    var video_getReady=(item)=>{
            let statusUrl = _p+'//'+_h+'/ananas/status/'+item['property']['objectid']+'?k=&flag=normal',
                doubleSpeed = item['property']['doublespeed'];
            busyThread +=1;
            GM_xmlhttpRequest({
                method: "get",
                headers: {
                    'Host': _h,
                    'Referer': _p+'//'+_h+'/ananas/modules/video/index.html?v=2022-0324-1800'
                },
                url: statusUrl,
                onload: function(res) {
                    try{
                        busyThread -=1;
                        let videoInfo = JSON.parse(res.responseText),
                            duration = videoInfo['duration'],
                            dtoken = videoInfo['dtoken'];
                        missionList['m'+item['jobid']]={
                            'type':'video',
                            'dtoken':dtoken,
                            'duration':duration,
                            'objectId':item['property']['objectid'],
                            'otherInfo':item['otherInfo'],
                            'doublespeed':doubleSpeed,
                            'jobid':item['jobid'],
                            'name':item['property']['name'],
                            'done':false,
                            'running':false
                        };
                        _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    `+'[视频]'+item['property']['name']+`
                                </div>
                            </div>`
                    }catch(e){
                    }
                },
                onerror:function(err){
                    console.log(err);
                    logs.addLog('获取视频任务详情错误','red');
                }
            });
        },
        doVideo = (item)=>{
            logs.addLog('开始刷视频：'+item['name']+'，倍速：'+String(rate)+'倍');
            logs.addLog('渔助手','green');
            if(item['doublespeed']==0&&rate!=1&&_w.top.unrivalReviewMode=='0'){
                logs.addLog('qq2314766321！','orange');
            }
            let playTime = 0,
                playsTime = 0,
                isdrag = '0',
                times = 0,
                encUrl = '',
                first = true,
                loop = setInterval(function(){
                    playsTime += rate;
                    playTime = Math.ceil(playsTime);
                    if(times==0||times%60==0||playTime>=item['duration']){
                        if(first){
                            playTime = 0;
                        }
                        if(playTime>=item['duration']){
                            clearInterval(loop);
                            playTime = item['duration'];
                            isdrag = '4';
                        }
                        encUrl = hostList[host]+'chaoXing/v1/getEnc-64568156154.php?classid='+classId+'&playtime='+playTime+'&duration='+item['duration']+'&objectid='+item['objectId']+'&jobid='+item['jobid']+'&uid='+UID;
                        busyThread +=1;
                        let _bold_playTime = playTime;
                        GM_xmlhttpRequest({
                            method: "get",
                            url: encUrl,
                            onload: function(res) {
                                let enc = res.responseText;
                                if(enc.length!=32){
                                    logs.addLog('获取视频enc错误，五秒后重试','red');
                                    logs.addLog('如果反复失败，请尝试在脚本代码内更改服务器线路','red');
                                    logs.addLog(enc,'red');
                                    times=-5;
                                    return;
                                }
                                let reportsUrl = reportUrl+'/'+item['dtoken']+'?clazzId='+classId+'&playingTime='+_bold_playTime+'&duration='+item['duration']+'&clipTime=0_'+item['duration']+'&objectId='+item['objectId']+'&otherInfo='+item['otherInfo']+'&jobid='+item['jobid']+'&userid='+UID+'&isdrag='+isdrag+'&view=pc&enc='+enc+'&rt='+rt+'&dtype=Video';
                                GM_xmlhttpRequest({
                                    method: "get",
                                    url: reportsUrl,
                                    onload: function(res) {
                                        try{
                                            busyThread -=1;
                                            let ispass = JSON.parse(res.responseText);
                                            first = false;
                                            if(ispass['isPassed']&&_w.top.unrivalReviewMode=='0'){
                                                logs.addLog('视频任务已完成','green');
                                                missionList['m'+item['jobid']]['running']=false;
                                                missionList['m'+item['jobid']]['done']=true;
                                                clearInterval(loop);
                                            }else if(isdrag == '4'){
                                                if(_w.top.unrivalReviewMode=='1'){
                                                    logs.addLog('视频已观看完毕','green');
                                                }else{
                                                    logs.addLog('视频已观看完毕，但视频任务未完成','red');
                                                }
                                                missionList['m'+item['jobid']]['running']=false;
                                                missionList['m'+item['jobid']]['done']=true;
                                                try{
                                                    clearInterval(loop);
                                                }catch(e){

                                                }
                                            }else{
                                                logs.addLog(item['name']+'已观看'+_bold_playTime+'秒，剩余大约'+String(item['duration']-_bold_playTime)+'秒');
                                            }
                                        }catch(e){
                                            console.log(e);
                                            if(res.responseText.indexOf('验证码')>=0){
                                                logs.addLog('已被超星风控，请<a href="'+reportsUrl+'" target="_blank">点我处理</a>','red');
                                                missionList['m'+item['jobid']]['running']=false;
                                                clearInterval(loop);
                                                return;
                                            }
                                            if(rt=='0.9'){
                                                if(first){
                                                    logs.addLog('超星返回错误信息，尝试更换参数','orange');
                                                    rt='1';
                                                    times = -3;
                                                }else{
                                                    logs.addLog('超星返回错误信息，十秒后重试(1)','red');
                                                    times = -10;
                                                }
                                                return;
                                            }else{
                                                if(first){
                                                    rt='0.9';
                                                }
                                                logs.addLog('超星返回错误信息，十秒后重试(2)','red');
                                                times = -10;
                                                console.log(res.responseText);
                                                return;
                                            }
                                        }
                                    },
                                    onerror:function(err){
                                        console.log(err);
                                        logs.addLog('观看视频失败','red');
                                        missionList['m'+item['jobid']]['running']=false;
                                        clearInterval(loop);
                                    }
                                });
                            },
                            onerror:function(err){
                                console.log(err);
                                logs.addLog('获取视频enc失败','red');
                                missionList['m'+item['jobid']]['running']=false;
                                clearInterval(loop);
                            }
                        });
                    }
                    times+=1;
                },1000);
                missionList['m'+item['jobid']]['running']=true;
        },
        doDocument=(item)=>{
            missionList['m'+item['jobid']]['running']=true;
            logs.addLog('开始刷文档：'+item['name']);
            setTimeout(function(){
                busyThread += 1;
                GM_xmlhttpRequest({
                    method: "get",
                    url: _p+'//'+_h+'/ananas/job/document?jobid='+item['jobid']+'&knowledgeid='+chapterId+'&courseid='+courseId+'&clazzid='+classId+'&jtoken='+item['jtoken'],
                    onload: function(res) {
                        try{
                            busyThread -= 1;
                            let ispass = JSON.parse(res.responseText);
                            if(ispass['status']){
                                logs.addLog('文档任务已完成','green');
                            }else{
                                logs.addLog('文档已阅读完成，但任务点未完成','red');
                            }
                            missionList['m'+item['jobid']]['running']=false;
                            missionList['m'+item['jobid']]['done']=true;
                        }catch(err){
                            console.log(err);
                            logs.addLog('解析文档内容失败','red');
                            missionList['m'+item['jobid']]['running']=false;
                        }
                    },
                    onerror:function(err){
                        console.log(err);
                        logs.addLog('阅读文档失败','red');
                        missionList['m'+item['jobid']]['running']=false;
                        missionList['m'+item['jobid']]['done']=true;
                    }
                });
            },parseInt(Math.random()*2000+9000,10))
        },
        doWork = (item)=>{
            missionList['m'+item['jobid']]['running']=true;
            logs.addLog('开始刷作业：'+item['name']);
            _d.getElementById('workPanel').style.display = 'block';
            _d.getElementById('frame_content').src=_p+'//'+_h+'/api/work?workId='+item['jobid'].replace('work-','')+'&jobid='+item['jobid']+'&knowledgeid='+chapterId+'&ktoken='+ktoken+'&ut=s&clazzId='+classId+'&enc='+item['enc']+'&courseid='+courseId;
            _w.top.unrivalWorkInfo='';
            setInterval(function(){
                if(_w.top.unrivalWorkInfo!=''){
                    logs.addLog(_w.top.unrivalWorkInfo);
                    _w.top.unrivalWorkInfo='';
                }
            },100);
            let workDoneInterval = setInterval(function(){
                if(_w.top.unrivalWorkDone){
                    _w.top.unrivalWorkDone = false;
                    clearInterval(workDoneInterval);
                    _w.top.unrivalDoneWorkId = '';
                    _d.getElementById('workPanel').style.display = 'none';
                    _d.getElementById('frame_content').src='';
                    setTimeout(function(){
                        missionList['m'+item['jobid']]['running']=false;
                        missionList['m'+item['jobid']]['done']=true;
                    },5000);
                }
            },500);
        },
        missionList = [];
    if(jobList.length<=0){
        if(jumpType!=2){
            _w.top.jump = true;
            logs.addLog('此页无任务，5秒后自动下一章','green');
        }else{
            logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数','green');
        }
        return;
    }
    for(let i=0,l=jobList.length;i<l;i++){
        let item = jobList[i];
        if(item['type']=='video'){
            video_getReady(item);
        }else if(item['type']=='document'){
            missionList['m'+item['jobid']]={
                'type':'document',
                'jtoken':item['jtoken'],
                'jobid':item['jobid'],
                'name':item['property']['name'],
                'done':false,
                'running':false
            };
            _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    `+'[文档]'+item['property']['name']+`
                                </div>
                            </div>`
        }else if(item['type']=='workid'&&_w.top.unrivalDoWork=='1'){
            missionList['m'+item['jobid']]={
                'type':'work',
                'workid':item['property']['workid'],
                'jobid':item['jobid'],
                'name':item['property']['title'],
                'enc':item['enc'],
                'done':false,
                'running':false
            };
            _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    `+'[章节测试]'+item['property']['title']+`
                                </div>
                            </div>`
        }else{
            try{
                let jobName = item['property']['name'];
                if(jobName==undefined){
                    jobName = item['property']['title'];
                }
                _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    `+'已跳过：'+jobName+`
                                </div>
                            </div>`
            }catch(e){
            }
        }
    }
    var loopjob= ()=>{
        let missionli = missionList;
        if(missionli==[]){
            setTimeout(loopjob,500);
            return;
        }
        for(let itemName in missionli){
            if(missionli[itemName]['running']){
                setTimeout(loopjob,500);
                return;
            }
        }
        for(let itemName in missionli){
            if(!missionli[itemName]['done']){
                switch(missionli[itemName]['type']){
                    case 'video':doVideo(missionli[itemName]);
                    break;
                    case 'document':doDocument(missionli[itemName]);
                    break;
                    case 'work':doWork(missionli[itemName]);
                    break;
                }
                setTimeout(loopjob,500);
                return;
            }
        }
        if(busyThread <=0){
            if(jumpType!=2){
                _w.top.jump = true;
                logs.addLog('所有任务已完成，5秒后自动下一章','green');
            }else{
                logs.addLog('所有任务已完成，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数','green');
            }
            clearInterval(loopjob);
        }else{
            setTimeout(loopjob,500);
        }
    }
    var readyCheck = ()=>{
        setTimeout(function(){
            try{
                logs.addLog('修复视频倍数，答题等bug\n联系作者 qq：2314766321','orange');
                if(_w.top.unrivalReviewMode=='1'){
                    logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过','green');
                    _d.getElementById('reviewModeButton').setAttribute('class',['btn btn-default','btn btn-success'][_w.top.unrivalReviewMode]);
                }
                if(_w.top.unrivalDoWork=='1'){
                    logs.addLog('自动做章节测试已开启，将会自动做章节测试','green');
                    _d.getElementById('autoDoWorkButton').setAttribute('class',['btn btn-default','btn btn-success'][_w.top.unrivalDoWork]);
                }
                _d.getElementById('autoSubmitButton').setAttribute('class',['btn btn-default','btn btn-success'][_w.top.unrivalAutoSubmit]);
                _d.getElementById('autoSaveButton').setAttribute('class',['btn btn-default','btn btn-success'][_w.top.unrivalAutoSave]);
            }catch(e){
                console.log(e);
                readyCheck();
                return;
            }
            loopjob();
        },500);
    }
    readyCheck();
}else if(_l.href.indexOf("mycourse/studentstudy") >0){
    _w.unrivalgetTeacherAjax = _w.getTeacherAjax;
    _w.getTeacherAjax=(courseid,classid,cid)=>{
        if(cid==getQueryVariable('chapterId')){
            return;
        }
        _w.top.unrivalPageRd = '';
        _w.unrivalgetTeacherAjax(courseid,classid,cid);
    }
    if(disableMonitor == 1){
        _w.appendChild = _w.Element.prototype.appendChild;
        _w.Element.prototype.appendChild = function(){
            try{
                if(arguments[0].src.indexOf('detect.chaoxing.com')>0){
                    return;
                }
            }catch(e){}
            _w.appendChild.apply(this, arguments);
        };
    }
    classId = getQueryVariable('clazzid')||getQueryVariable('clazzId')||getQueryVariable('classid')||getQueryVariable('classId');
    courseId = getQueryVariable('courseid')||getQueryVariable('courseId');
    _w.jump = false;
    setInterval(function(){
        if(getQueryVariable('mooc2')=='1'){
            let tabs= _d.getElementsByClassName('posCatalog_select');
            for(let i=0,l=tabs.length;i<l;i++){
                let tabId = tabs[i].getAttribute('id');
                if(tabId.indexOf('cur')>=0&&tabs[i].getAttribute('class')=='posCatalog_select'){
                    tabs[i].setAttribute('onclick',"getTeacherAjax('"+courseId+"','"+classId+"','"+tabId.replace('cur','')+"');");
                }
            }
        }else{
            let h4s = _d.getElementsByTagName('h4'),
                h5s = _d.getElementsByTagName('h5');
            for(let i=0,l=h4s.length;i<l;i++){
                if(h4s[i].getAttribute('id').indexOf('cur')>=0){
                    h4s[i].setAttribute('onclick',"getTeacherAjax('"+courseId+"','"+classId+"','"+h4s[i].getAttribute('id').replace('cur','')+"');");
                }
            }
            for(let i=0,l=h5s.length;i<l;i++){
                if(h5s[i].getAttribute('id').indexOf('cur')>=0){
                    h5s[i].setAttribute('onclick',"getTeacherAjax('"+courseId+"','"+classId+"','"+h5s[i].getAttribute('id').replace('cur','')+"');");
                }
            }
        }
    },1000);
    setInterval(function(){
        let but = null;
        if(_w.jump){
            _w.jump = false;
            _w.top.unrivalDoneWorkId = '';
            _w.jjump =(rd)=>{
                if(rd!=_w.top.unrivalPageRd){
                    return;
                }
                try{
                    setTimeout(function(){
                        if(jumpType == 1){
                            if(getQueryVariable('mooc2')=='1'){
                                but = _d.getElementsByClassName('jb_btn jb_btn_92 fs14 prev_next next');
                            }else{
                                but = _d.getElementsByClassName('orientationright');
                            }
                            try{
                                setTimeout(function(){
                                    if(rd!=_w.top.unrivalPageRd){
                                        return;
                                    }
                                    but[0].click();
                                },2000);
                            }catch(e){
                            }
                            return;
                        }
                        if(getQueryVariable('mooc2')=='1'){
                            let ul = _d.getElementsByClassName('prev_ul')[0],
                                lis = ul.getElementsByTagName('li');
                            for(let i=0,l=lis.length;i<l;i++){
                                if(lis[i].getAttribute('class')=='active'){
                                    if(i+1>=l){
                                        break;
                                    }else{
                                        try{
                                            lis[i+1].click();
                                        }catch(e){}
                                        return;
                                    }
                                }
                            }
                            let tabs= _d.getElementsByClassName('posCatalog_select');
                            for(let i=0,l=tabs.length;i<l;i++){
                                if(tabs[i].getAttribute('class')=='posCatalog_select posCatalog_active'){
                                    while(i+1<tabs.length){
                                        let nextTab= tabs[i+1];
                                        if(nextTab.getElementsByClassName('icon_Completed prevTips').length>0&&_w.top.unrivalReviewMode=='0'){
                                            i++;
                                            continue;
                                        }
                                        if(nextTab.id.indexOf('cur')<0){
                                            i++;
                                            continue;
                                        }
                                        let clickF = setInterval(function(){
                                            if(rd!=_w.top.unrivalPageRd){
                                                clearInterval(clickF);
                                                return;
                                            }
                                            nextTab.click();
                                        },2000);
                                        break;
                                    }
                                    break;
                                }
                            }
                        }else{
                            let div = _d.getElementsByClassName('tabtags')[0],
                                spans = div.getElementsByTagName('span');
                                for(let i=0,l=spans.length;i<l;i++){
                                    if(spans[i].getAttribute('class').indexOf('currents')>=0){
                                        if(i+1==l){
                                            break;
                                        }else{
                                            try{
                                                spans[i+1].click();
                                            }catch(e){}
                                            return;
                                        }
                                    }
                                }
                            let tabs= _d.getElementsByTagName('span'),
                                newTabs = [];
                            for(let i=0,l=tabs.length;i<l;i++){
                                if(tabs[i].getAttribute('style')!=null&&tabs[i].getAttribute('style').indexOf('cursor:pointer;height:18px;')>=0){
                                    newTabs.push(tabs[i]);
                                }
                            }
                            tabs = newTabs;
                            for(let i=0,l=tabs.length;i<l;i++){
                                if(tabs[i].parentNode.getAttribute('class')=='currents'){
                                    while(i+1<tabs.length){
                                        let nextTab= tabs[i+1].parentNode;
                                        if(nextTab.getElementsByClassName('roundpoint  blue').length>0&&_w.top.unrivalReviewMode=='0'){
                                            i++;
                                            continue;
                                        }
                                        if(nextTab.id.indexOf('cur')<0){
                                            i++;
                                            continue;
                                        }
                                        let clickF = setInterval(function(){
                                            if(rd!=_w.top.unrivalPageRd){
                                                clearInterval(clickF);
                                                return;
                                            }
                                            nextTab.click();
                                        },2000);
                                        break;
                                    }
                                    break;
                                }
                            }
                        }
                    },2000);
                }catch(e){
                }
            }
            _w.onReadComplete1();
            setTimeout('jjump("'+_w.top.unrivalPageRd+'")',2856);
        }
    },200);
}else if(_l.href.indexOf("work/doHomeWorkNew") >0||_l.href.indexOf("work/selectWorkQuestionYiPiYue") >0||_l.href.indexOf("work/getAllWork") >0){
    if(_l.href.indexOf("work/getAllWork") >0){
        _w.top.unrivalWorkDone = true;
        return;
    }
    if(_d.documentElement.outerHTML.indexOf('<span style="font-size:18px;margin-top:10px;margin-left:10px;" class="fl">不允许作答，章节未开启！</span>')!=-1&&_l.href.indexOf("api=1")!=-1){
        _l.href = _l.href.replace("api=1","api=2");
        return;
    }
    _w.top.unrivalWorkDone = false;
    _w.aalert = _w.alert;
    _w.alert=(msg)=>{
        if(msg=='保存成功'){
            _w.top.unrivalDoneWorkId=getQueryVariable('workId');
            return;
        }
        aalert(msg);
    }
    var submitButtons = _d.getElementsByClassName('Btn_blue_1 marleft10');
    if(submitButtons.length<=0||_w.top.unrivalDoneWorkId==getQueryVariable('workId')){
        _w.top.unrivalDoneWorkId = '';
        _w.top.unrivalWorkDone = true;
        return;
    }
    if(_l.href.indexOf("api=2")!=-1&&_d.getElementById("api").value=="1"){
        _d.getElementById("api").value="2"
    };
    var questionList = [],
        questionsElement = _d.getElementsByClassName('TiMu'),
        types = ['判断题','单选题','多选题'];
    _w.unrivalQuestionNum = questionsElement.length;
    _w.unrivalUnableQuestionNum = 0;
    for(let i=0;i<_w.unrivalQuestionNum;i++){
        let questionElement = questionsElement[i],
            titleE = questionElement.getElementsByClassName('Zy_TItle clearfix')[0].getElementsByClassName('clearfix')[0].innerHTML,
            sample = /(<([^>]+)>)/ig,
            title = titleE.replace(sample, ""),
            type = title.match(/^【(.*?)】|$/)[1],
            question = title.replace('【'+type+'】','').replace(/&nbsp;/g,' '),
            idElements = questionElement.getElementsByTagName('input'),
            questionId = '0';
        for(let z=0,k=idElements.length;z<k;z++){
            try{
                if(idElements[z].getAttribute('name').indexOf('answer')>=0){
                    questionId = idElements[z].getAttribute('name').replace('type','');
                    break;
                }
            }catch(e){
                console.log(e);
                continue;
            }
        }
        if(questionId=='0'||types.indexOf(type)<0||question==''){
            _w.unrivalUnableQuestionNum++;
            continue;
        }
        let optionList = {
            length:0
        };
        if(['单选题','多选题'].indexOf(type)>=0){
            let answersElements = questionElement.getElementsByClassName('Zy_ulTop w-top fl')[0].getElementsByTagName('li');
            for(let x=0,j=answersElements.length;x<j;x++){
                let optionE = answersElements[x].getElementsByClassName('fl after')[0],
                    optionText = optionE.innerHTML.replace(sample, "").replace(/(^\s*)|(\s*$)/g, ""),
                    inputE = answersElements[x].getElementsByClassName('fl before')[0].getElementsByTagName('input')[0],
                    optionId = inputE.getAttribute('name').replace('type',''),
                    optionValue = inputE.value;
                if(optionText==''){
                    break;
                }
                optionList[optionText]={
                    'id':optionId,
                    'value':optionValue
                }
                optionList.length++;
            }
            if(answersElements.length!=optionList.length){
                _w.unrivalUnableQuestionNum++;
                continue;
            }
        }
        questionList.push({
            'question':question,
            'type':type,
            'questionid':questionId,
            'options':optionList
        });
    }
    var nowTime=-3000,
        busyThread = questionList.length;
    for(let i=0,l=questionList.length;i<l;i++){
        nowTime+=3000;
        let qu = questionList[i];
        setTimeout(function(){
            GM_xmlhttpRequest({
                method: "POST",
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Authorization': token,
                },
                url:'http://cx.icodef.com/wyn-nb?v=4',
                data: 'question=' + encodeURIComponent(qu['question']) + '&type=' + {'单选题':'0','多选题':'1','判断题':'3'}[qu['type']],
                onload: function(res) {
                    busyThread-=1;
                    try{
                        let result = JSON.parse(res.responseText);
                        _w.top.unrivalWorkInfo = '题目：'+qu['question']+'：'+result['data'];
                        if(result['code']!=1){
                            _w.unrivalUnableQuestionNum++;
                        }else{
                            switch(qu['type']){
                                case '判断题':(function(){
                                    let answer;
                                    if('正确是对√Tri'.indexOf(result['data'])>=0){
                                        answer = 'true';
                                    }else if('错误否错×Fwr'.indexOf(result['data'])>=0){
                                        answer = 'false';
                                    }else{
                                        return;
                                    }
                                    let choiceEs = _d.getElementsByTagName('input');
                                    for(let u=0,k=choiceEs.length;u<k;u++){
                                        if(choiceEs[u].value==answer&&choiceEs[u].getAttribute('name')==qu['questionid']&&choiceEs[u].getAttribute('type')=='radio'){
                                            if(!choiceEs[u].checked){
                                                choiceEs[u].click();
                                            }
                                            _w.unrivalQuestionNum-=1;
                                            return;
                                        }
                                    }
                                })();
                                break;
                                case '单选题':(function(){
                                    let answerData = result['data'];
                                    for(let option in qu['options']){
                                        if(option==answerData.replace('javascript:void(0);','')){
                                            let choiceEs = _d.getElementsByTagName('input');
                                            for(let y=0,j=choiceEs.length;y<j;y++){
                                                if(choiceEs[y].value==qu['options'][option]['value']&&choiceEs[y].getAttribute('name')==qu['questionid']&&choiceEs[y].getAttribute('type')=='radio'){
                                                    if(!choiceEs[y].checked){
                                                        choiceEs[y].click();
                                                    }
                                                    _w.unrivalQuestionNum-=1;
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                })();
                                break;
                                case '多选题':(function(){
                                    let answerData = result['data'],
                                        hasAnswer = false;
                                    for(let option in qu['options']){
                                        if(answerData.indexOf(option)>=0){
                                            let choiceEs = _d.getElementsByTagName('input');
                                            for(let y=0,j=choiceEs.length;y<j;y++){
                                                if(choiceEs[y].value==qu['options'][option]['value']&&choiceEs[y].getAttribute('name')==qu['questionid']&&choiceEs[y].getAttribute('type')=='checkbox'){
                                                    if(!choiceEs[y].checked){
                                                        choiceEs[y].click();
                                                    }
                                                    hasAnswer = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if(hasAnswer){
                                        _w.unrivalQuestionNum-=1;
                                    }
                                })();
                                break;
                            }
                        }
                    }catch(e){
                        if(res.responseText.length<50){
                            _w.top.unrivalWorkInfo = qu['question']+':'+res.responseText;
                        }
                        console.log(e);
                    }
                },
                onerror:function(err){
                    _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                    console.log(err);
                    busyThread-=1;
                    _w.unrivalUnableQuestionNum++;
                }
            });
        },nowTime)
    }
    var workInterval = setInterval(function(){
        if(busyThread!=0){
            return;
        }
        if(_w.unrivalQuestionNum!=0||_w.unrivalUnableQuestionNum>0){
            clearInterval(workInterval);
            if(_w.top.unrivalAutoSave==1){
                _w.top.unrivalWorkInfo = '不符合提交条件，已自动保存答案'
                setTimeout(function(){
                    _w.top.unrivalDoneWorkId=getQueryVariable('workId');
                    _w.noSubmit();
                },2000);
                return;
            }else{
                _w.top.unrivalWorkInfo = '用户设置为不自动保存答案，请手动提交作业'
                return;
            }
        }
        if(_w.unrivalQuestionNum==0||_w.unrivalUnableQuestionNum<=0){
            clearInterval(workInterval);
            if(_w.top.unrivalAutoSubmit==1){
                _w.top.unrivalDoneWorkId=getQueryVariable('workId');
                _w.top.unrivalWorkInfo = '已提交答案';
                _w.btnblueSubmit();
                setTimeout(function(){
                    _w.submitCheckTimes();
                },parseInt(Math.random()*1000+4000,10));
            }else{
                _w.top.unrivalWorkInfo = '用户设置为不自动提交，请手动提交作业'
                return;
            }
        }
    },1000);
}
})();