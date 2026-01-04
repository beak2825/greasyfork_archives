// ==UserScript==
// @name   张浩挂视频专版PLUS——超星学习通学银在线  继续教育 各地人社培训网，后台挂视频，全网最好用的脚本，可边打游戏边刷课。自动跳转章节，真正的挂机刷视频
// @description  超星学习通视频后台挂机，文档自动完成，不得不说张浩真的是泰酷辣，如有问题联系QQ:1472683669。最终解释权归张浩所有。emm……………………………………………………………………………………………………但我还是希望你们能赞助我一瓶冰阔落，点击http://m.weibo.cn/status/4899535849525350?   这个链接就可以扫码给我了，我相信使用这个脚本的都是我的朋友❤️❤️❤️请看下方使用说明❤️❤️❤️
// @namespace    http://tampermonkey.net/
// @version     1.2.9
// @author       张浩
// @run-at       document-end
// @storageName  张浩
// @match        *://*/*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
//👇👇👇👇👇👇👇👇请将脚本提示的代码填入下面空白中，一行一个，按Ctrl+S保存👇👇👇👇👇👇👇👇
 
 
 
 
//👆👆👆👆👆👆👆👆请将脚本提示的代码填入上面空白中，一行一个，按Ctrl+S保存👆👆👆👆👆👆👆👆
// @connect      mooc1.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      stat2-ans.chaoxing.com
// @connect      passport2.chaoxing.com
//----------------------------------------
// @connect      mooc1.hnust.edu.cn
// @connect      stat2-ans.hnust.edu.cn
// @connect      passport2.hnust.edu.cn
//----------------------------------------
// @connect      mooc1.hnsyu.net
// @connect      stat2-ans.hnsyu.net
// @connect      passport2.hnsyu.net
//----------------------------------------
// @connect      mooc1.gdhkmooc.com
// @connect      stat2-ans.gdhkmooc.com
// @connect      passport2.gdhkmooc.com
//----------------------------------------
// @connect      mooc1.zut.edu.cn
// @connect      stat2-ans.zut.edu.cn
// @connect      passport2.zut.edu.cn
//----------------------------------------
// @connect      mooc1.wljx.hfut.edu.cn
// @connect      stat2-ans.wljx.hfut.edu.cn
// @connect      passport2.wljx.hfut.edu.cn
//----------------------------------------
// @connect      mooc1.hncj.edu.cn
// @connect      stat2-ans.hncj.edu.cn
// @connect      passport2.hncj.edu.cn
//----------------------------------------
// @connect      mooc1.qutjxjy.cn
// @connect      stat2-ans.qutjxjy.cn
// @connect      passport2.qutjxjy.cn
//----------------------------------------
// @connect      mooc1.jxjyzx.xust.edu.cn
// @connect      stat2-ans.jxjyzx.xust.edu.cn
// @connect      passport2.jxjyzx.xust.edu.cn
//----------------------------------------
// @connect      mooc1.xueyinonline.com
// @connect      stat2-ans.xueyinonline.com
// @connect      passport2.xueyinonline.com
//----------------------------------------
// @connect      mooc1.xynu.edu.cn
// @connect      stat2-ans.xynu.edu.cn
// @connect      passport2.xynu.edu.cn
// @connect      api.axetk.cn
// @license      GPL-3.0-or-later
// @compatible firefox
// @compatible chrome
// @compatible edge
// @compatible Safari
// @compatible Opera
// @compatible Maxthon
// @compatible AdGuard
// @contributionURL http://m.weibo.cn/status/4899535849525350?
// @contributionAmount 一瓶冰阔落
// @downloadURL https://update.greasyfork.org/scripts/475721/%E5%BC%A0%E6%B5%A9%E6%8C%82%E8%A7%86%E9%A2%91%E4%B8%93%E7%89%88PLUS%E2%80%94%E2%80%94%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E9%93%B6%E5%9C%A8%E7%BA%BF%20%20%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%E5%90%84%E5%9C%B0%E4%BA%BA%E7%A4%BE%E5%9F%B9%E8%AE%AD%E7%BD%91%EF%BC%8C%E5%90%8E%E5%8F%B0%E6%8C%82%E8%A7%86%E9%A2%91%EF%BC%8C%E5%85%A8%E7%BD%91%E6%9C%80%E5%A5%BD%E7%94%A8%E7%9A%84%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%8F%AF%E8%BE%B9%E6%89%93%E6%B8%B8%E6%88%8F%E8%BE%B9%E5%88%B7%E8%AF%BE%E3%80%82%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%AB%A0%E8%8A%82%EF%BC%8C%E7%9C%9F%E6%AD%A3%E7%9A%84%E6%8C%82%E6%9C%BA%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/475721/%E5%BC%A0%E6%B5%A9%E6%8C%82%E8%A7%86%E9%A2%91%E4%B8%93%E7%89%88PLUS%E2%80%94%E2%80%94%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E9%93%B6%E5%9C%A8%E7%BA%BF%20%20%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%E5%90%84%E5%9C%B0%E4%BA%BA%E7%A4%BE%E5%9F%B9%E8%AE%AD%E7%BD%91%EF%BC%8C%E5%90%8E%E5%8F%B0%E6%8C%82%E8%A7%86%E9%A2%91%EF%BC%8C%E5%85%A8%E7%BD%91%E6%9C%80%E5%A5%BD%E7%94%A8%E7%9A%84%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%8F%AF%E8%BE%B9%E6%89%93%E6%B8%B8%E6%88%8F%E8%BE%B9%E5%88%B7%E8%AF%BE%E3%80%82%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%AB%A0%E8%8A%82%EF%BC%8C%E7%9C%9F%E6%AD%A3%E7%9A%84%E6%8C%82%E6%9C%BA%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
!!(function(){
    const $w = unsafeWindow,
        $l = $w.location.href,
        $d = $w.document,
        $version = GM_info.script.version.replaceAll('.',''),
        $s = Object.fromEntries(new URLSearchParams($w.location.search)),
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        entrance = (host)=>{
            let classId =$s['clazzid']||$s['classid']||$s['classId']||$s['classId'],
                courseId = $s['courseid']||$s['courseId'],
                cpi=$s['cpi']||'',
                courseName = $d.title.replace('-首页','');
            $w.location.href = host + '/shenchanranCx?classid='+classId+'&courseid='+courseId+'&cpi='+cpi+'&coursename='+courseName;
        },
        $uid = getCookie('UID')||getCookie('_uid'),
        randomString = (l=32)=> {  
            let t = "abcdef1234567890",
                a = t.length,
                n = "";
            for (let i = 0; i < l; i++) n += t.charAt(Math.floor(Math.random() * a));
            if(['',false,null,undefined,NaN,-1].includes(n)){
                n = '';
                for (let i = 0; i < l; i++) 
                    n += t[Math.floor(Math.random() * 16)];
            }
            return n
        },
        $n = function(min,max){
            if(arguments.length==1){
                max = min+1;
                if(min>1){
                    min = min-1
                }
            }else if(arguments.length==0){
                min = 4;
                max = 6;
            }
            return parseInt(Math.random()*(max-min+1)+min,10)*1000; 
        },
        jsonpRequest = (url)=>{
            return new Promise((success,fail)=>{
                let sid = "jsonp"+randomString(16),
                    s = $d.createElement('script');
                s.id = sid;
                s.src = $w.location.protocol+"//"+url;
                $d.getElementsByTagName('body')[0].appendChild(s);
                s = $d.getElementById(sid);
                const checkResult = () => {
                    if ($w.jsonpValue) {
                        let result = $w.jsonpValue;
                        $w.jsonpValue = false;
                        success(result);
                    } else if (Date.now() - startTime >= 6000) {
                        success(false);
                    } else {
                        setTimeout(checkResult, 100);
                    }
                },
                    startTime = Date.now();
                setTimeout(()=>{
                    checkResult();
                },100);
                setTimeout(()=>{
                    s.remove();
                },6200);
            });
        },
        sleep = (interval)=>{
            return new Promise((success,fail)=>{
                setTimeout(success,interval);
            });
        },
        hostList = [
            'api.axetk.cn/jsonp/'
        ],
        handleImgs = (s) => {
            let imgEs = s.match(/(<img([^>]*)>)/);
            if (imgEs) {
                for (let j = 0, k = imgEs.length; j < k; j++) {
                    let urls = imgEs[j].match(/http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/),url;
                    if (urls) {
                        url = urls[0].replace(/http[s]?:\/\//, '');
                        s = s.replaceAll(imgEs[j], url);
                    }
                }
            }
            return s;
        },
        trim = (s) => {
            return handleImgs(s).replaceAll('javascript:void(0);', '').replaceAll("&nbsp;", '').replaceAll("，", ',').replaceAll("。", '.').replaceAll("：", ':').replaceAll("；",';').replaceAll("？", '?').replaceAll("（", '(').replaceAll("）", ')').replaceAll("“", '"').replaceAll("”", '"').replaceAll("！", '!').replaceAll("-", ' ').replace(/(<([^>]+)>)/ig, '').replace(/^\s+/ig, '').replace(/\s+$/ig, '');
        },
        request = (data) => {
            return new Promise((success,fail)=>{
                if(data.method == undefined){
                    data.method = 'get';
                }
                if(data.timeout == undefined){
                    data.timeout = 10000;
                }
                data.onload = function(res) {
                    if(res.responseText.includes('<title>用户登录</title>')){
                        alert('登录状态失效，请重新登陆超星');
                        $w.location.href = $w.location.protocol+'//'+$w.location.host.replace(/mooc(.*?)\./ig,'passport2.')+'/login?fid=&newversion=true&refer='+encodeURIComponent($w.location.href);
                        return;
                    }
                    success(res);
                }
                data.onerror= function(e) {
                    let host = data.url.match(/^http(s)?:\/\/(.*?)\//)[0].replace(/^http(s)?:\/\//,'').replace('\/','');
                    if(typeof e == 'object'&&e.error.includes('Refused to connect to')){
                        $w.logs.addLog('<br><font color="red">刚刚有一个跨域请求发送失败</font><br>👇请编辑脚本代码，将下方蓝色代码填入脚本指定空白中👇<br><h4><font color="blue">// @connect      '+host+'</font></h4>👆请编辑脚本代码，将上面蓝色代码填入脚本指定空白中👆<br>别忘了保存并刷新页面哦');
                        $w.wait = true;
                    }else if(typeof e == 'string'&&e.includes('permission')){
                        $w.logs.addLog('<br><font color="red">刚刚有一个跨域请求发送失败</font><br>👇请编辑脚本代码，将下方蓝色代码填入脚本指定空白中👇<br><h4><font color="blue">// @connect      '+host+'</font></h4>👆请编辑脚本代码，将上面蓝色代码填入脚本指定空白中👆<br>别忘了保存并刷新页面哦');
                        $w.wait = true;
                    }
                    try{$w.logs.addLog('请求错误','red');}catch(e){}
                    if(!$l.includes('chaoxing.com')){
                        let classId = $s['clazzid']||$s['classid']||$s['classId']||$s['classId'],
                            courseId = $s['courseid']||$s['courseId'];
                        if(confirm('检测到您使用的是学校定制学习通，可能会出现使用问题\n可以尝试切换到学习通官方页面（需要重新登陆），是否切换？')){
                            $w.location.href = 'http://passport2.chaoxing.com/login?refer=http%3A%2F%2Fmooc1.chaoxing.com%2Fvisit%2Fstucoursemiddle%3Fcourseid%3D'+courseId+'%26clazzid%3D'+classId+'%26vc%3D1%26ismooc2%3D1%26v%3D2%26r%3D1&newversion=true&_blank=0';
                        }
                    }
                    console.log(e);
                    success(false);
                }
                data.ontimeout= function() {
                    success(false);
                }
                GM_xmlhttpRequest(data);
            });
        }
    if($l.includes('/mycourse/stu?')){
        let $ = $w.jQuery||$w.$,
            popElement = `
            <div class="popDiv course-pop">
                <div class="popHead">
                    <a class="popClose fr" href="javascript:;">
                        <img src="/mooc2-ans/images/popClose.png" class="closecoursepop" style="display: none;">
                    </a>
                    <p class="fl fs18 colorDeep">张浩提示你:该课程可一键刷课</p>
                </div>
                <div class="het60"></div>
                <div class="course-content-dialog">
                    <ul class="course-details" tabindex="3" style="overflow: auto visible; outline: none;">
                        <li>
                            <div class="right-box">
                                <div class="text-box">
                                    <p class="text1">点击张浩最帅跳转到刷课页面，不得不说张浩真的是太酷了，别忘记请他喝一瓶冰可乐。联系QQ:1472683669 或加群566385726获取刷课口令。安装脚本的时候看使用说明了吗？没有的话我，我都想给你一脚🦶                  <div>安能摧眉折腰事权贵 使我不得开心颜！</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div style="height: 70px;"></div>
                    <div class="bottom-div" style="">
                        <div class="start-study" id="fuckme">张浩最帅</div>
                        &ensp;&ensp;&ensp;
                        <div class="start-study" id="fuckyou">取消</div>
                    </div>
                </div>
            </div>`;
        setTimeout(()=>{
            $(".coursenoticepop").empty();
            $(".coursenoticepop").html(popElement);
            $("#fuckme").click(function(){
                entrance($w.ServerHost.mooc1Domain.replace('https://','http://'))
            });
            $("#fuckyou").click(()=>{
                $(".closecoursepop").hide();
                $(".coursenoticepop").hide(); 
            });
            $(".closecoursepop").show();
            $(".coursenoticepop").show(); 
        },1000);
    }
    else if($l.includes('mycourse/studentcourse?')&&!$l.includes('ans')){
        setTimeout(()=>{
            if(confirm('刷课吗？')){
                entrance("http://"+$w.location.host);
            }
        },1000);
    }
    else if($l.includes('shenchanranCx')&&!$l.includes('passport2')){
        $w.wait = false;
        if(!$version||$version==''||$version==undefined){
            alert('请关闭其他同类型脚本，否则此脚本无法正常运行');
        }
        try{
            $w.checkConcurrency.push(6);
        }catch{
            $w.checkConcurrency = [6]
        }
        if($w.checkConcurrency.length!=1){
            if(parseInt('1'+''+$version)<=GM_getValue('nowVersion',0)){
                alert('请勿多开脚本，请检查您开启的脚本数量');
                return;
            }
        }
        GM_setValue('nowVersion',String(parseInt('1'+''+$version)));
        $d.getElementsByTagName('body')[0].innerHTML='加载中。。。';
        let host = false,
            beisu = 31,
            vgqtlv = 85,
            checkIframe = function(iframe){
                return new Promise((success,fail)=>{
                    iframe.onload = function(){
                        success();
                    }
                })
            }
        async function main(){
            for(let i=0,l=hostList.length;i<l;i++){
                let testHost = hostList[i],
                    checkResult = await jsonpRequest(testHost+'status/?ran='+String(Date.now())+'&version='+$version);
                if(!checkResult){
                    continue;
                }else if(checkResult=='true'){
                    host = testHost;
                    break;
                }else if(checkResult=='false'){
                    alert('服务器暂停服务，请耐心等待恢复');
                    return;
                }else if(checkResult.includes('stopshow')){
                    $d.body.innerHTML=checkResult;
                    return;
                }
            }
            if(!host){
                alert('所有服务器均不可用，请稍后刷新重试或尝试更换网络\n中国移动宽带/校园网建议更换网络');
                return;
            }
            $d.getElementsByTagName('html')[0].innerHTML=`
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>超星刷课工具</title>
    <!-- boot4 -->
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://lib.sinaapp.com/js/bootstrap/4.0.0/css/bootstrap.min.css" />
    <link href="https://i.mooc.chaoxing.com/layui/css/modules/layer/default/layer.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</head>
<style>
    /* title */
    @font-face {
        font-family: "阿里妈妈方圆体 VF Regular";
        src: url("//at.alicdn.com/wf/webfont/bb6sz9d6E2UG/zkh0i2ziCDKY.woff2") format("woff2"),
            url("//at.alicdn.com/wf/webfont/bb6sz9d6E2UG/tJ8Zk24AFUoT.woff") format("woff");
        font-display: swap;
    }

    #courseName {
        font-weight: 900;
        font-family: "阿里妈妈方圆体 VF Regular";
        color: #409eff;
        animation: bounce;
        animation-duration: 2s;
    }

    .tit-margin {
        margin: 15px 0px;
    }

    #courseName:hover {
        color: #306fae;
        animation: shakeX;
        animation-duration: 2s;
        cursor: pointer;
        transition: .2s;
    }

    .title-weight {
        font-weight: bold;
    }

    /* button */
    .btn {
        border-radius: 11px;
    }

    .btn-outline-success:hover {
        background-color: #b9dfa6;
    }

    .btn-outline-primary:hover {
        background-color: #409eff;
    }

    /* card */
    .card {
        border-radius: 4px;
        /* border: 1px solid #EBEEF5; */
        background-color: #FFF;
        overflow: hidden;
        transition: .3s;
    }

    .card:hover {
        transform: translateY(-1%);
        box-shadow: 1px 1px 10px 2px #CCC;
    }

    .start {
        margin-left: 11px;
    }
</style>
<body>
    <div class="container-fluid">
        <div class="row tit-margin">
            <div class="col-12 text-center text-monospace">
                <h1 id="courseName">课程名</h1>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-6">
                <div class="card" style="margin-top: 10px">
                    <div class="card-body">
                        <div>
                            <div class="title-weight" style="padding: 0; font-size: 20px; float: left;">
                                任务设置：
                                <a id="doVideo" class="btn btn-light">视频任务</a>
                                <a id="doWork" class="btn btn-light"></a>
                                <a id="doDocument" class="btn btn-light">文档任务</a>
                            </div>
                            <br /><br /><br />
                            <div class="title-weight" style="padding: 0; font-size: 20px; float: left">
                                章节测试：<a id="autoSubmit" class="btn btn-light">自动提交</a>
                                &nbsp;&nbsp;总开关：<a id="start" class="btn btn-outline-success">点我启动</a>
<a id='start_new' class="btn btn-info"></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card" style="margin-top: 10px">
                    <div class="card-body">
                        <h5 class="card-title title-weight">脚本配置</h5>
                        <form style="margin-top: 25px;">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="exampleInputEmail1">设备标识码</label>
                                    <div class="form-inline">
                                        <input type="text" class="form-control" id="tokenInput" 
                                            value="" />&ensp;
                       
                                    </div>
                                    <small class="form-text text-muted">设备标识码会自动获取</small>
                                </div>
                                <div class="form-group col-md-6">
                                   
                               
                                    <small class="form-text text-muted">安能摧眉折腰事权贵，使我不得开心颜！</small>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="exampleInputPassword1">刷课口令</label>
                                    <input type="number" class="form-control" id="beisuInput" />
                                    <small class="form-text text-muted">请联系QQ：1472683669 获取刷课口令，初始值无法正常运行</small>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="exampleInputPassword1">校对值</label>
                                    <input type="number" class="form-control" id="vgqtlv" />
                                    <small class="form-text text-muted">请不要更改校对值</small>
                                </div>
                            </div>
                            <a class="btn btn-outline-primary" id="saveConfig">保存</a>
                            <small class="form-text text-muted">保存后会实时生效</small>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card" style="margin-top: 10px">
                    <div class="card-body">
                        <h5 class="card-title title-weight">任务</h5>
                        <div class="panel-heading">
                            任务数量&#8194;:&#8194;共有
                            <span id="totalNum">-</span>任务，剩余<span id="leftNum">-</span>任务
                        </div>
                    </div>
                </div>
                <div class="card" style="margin-top: 10px">
                    <div class="card-body">
                        <h5 class="card-title title-weight">任务日志</h5>
                        <div id="result" style="overflow: auto; line-height: 30px">
                            <div id="log">
                                <span style="color: red">[00:00:00]如果此提示不消失，说明页面出现了错误，请反馈</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card" style="margin-top: 10px">
                    <div class="card-body" >
                        <iframe id="frame_content" srcdoc="" frameborder="0" scrolling="auto"
                            style="width: 100%;height: auto;"></iframe>
                    </div>
                </div>
            </div>
            <iframe style="width:0;height:0" src="http://log.axetk.cn/api/"></iframe>
        </div>
    </div>
    <div id="detail" style="display: none"></div>
</body>
</html>`;
            await sleep(100);
            let tkToken = GM_getValue('shenchanranToken','66666666666666666666666666666666'),
            reg = /^[0-9a-z]{32}$/ig;
            $w.left = 1;
            if(['66666666666666666666666666666666','',null,undefined,false].includes(tkToken)||!reg.test(tkToken)){
                tkToken = randomString();
                GM_setValue('shenchanranToken',tkToken); 
            }
            jsonpRequest(host+'checkLeft/?c=t&token='+tkToken);
            $w.logs = {
                "logArry": [],
                "addLog": function(str, color = "black") {
                    if (this.logArry.length >= 10) {
                        this.logArry.splice(0, 1);
                    }
                    let nowTime = new Date(),
                        nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2),
                        nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2),
                        nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2),
                        logElement = $d.getElementById('log'),
                        logStr = "";
                    this.logArry.push("<span style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                        nowSec + "] " + str + "</span>");
                    for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                        logStr += this.logArry[logI] + "<br>";
                    }
                    $d.getElementById('log').innerHTML = logStr;
                    logElement.scrollTop = logElement.scrollHeight;
                }
            };
            $w.tkLeft = (left)=>{
                $w.left = left;
                GM_setValue('tkLeft',left);
                $d.getElementById('ugyvciuu').value=left;
                $d.getElementById('payButton').setAttribute("href","https://tk.axetk.cn/?token="+tkToken);
                $d.getElementById('bindQQ').setAttribute("href","https://tk.axetk.cn/bind/?token="+tkToken);
            }
            $w.chuangguan = false;
            let tkc = ()=>{
                setTimeout(()=>{
                    let token = GM_getValue('shenchanranToken',false);
                    if(token){
                        jsonpRequest(host+'checkLeft/?token='+token);
                    }
                    tkc();
                },30000);
            }
            tkc();
            $w.logs.addLog('脚本初始化成功','green');
            $d.getElementById('courseName').innerHTML = decodeURIComponent($s['coursename']);
            let s1 = $d.createElement('script'),
                s2 = $d.createElement('script'),
                s3 = $d.createElement('script'),
                s4 = $d.createElement('script'),
                head=$d.head;
            s1.src = 'https://i.mooc.chaoxing.com/layui/layui.js';
            s2.src = 'https://mobilelearn.chaoxing.com/xinfanya/js/jquery.min.js';
            s3.src = 'https://i.mooc.chaoxing.com/layui/lay/modules/layer.js';
            s4.src = 'https://sharewh1.xuexi365.com/res/plugin/forword/js/md5.js';
            $w.logs.addLog('组件加载中');
            do{
                head.appendChild(s1);
                await sleep(100);
            }while(!(typeof $w.layui));
            do{
                head.appendChild(s2);
                await sleep(100);
            }while(!(typeof $w.jquery));
            do{
                head.appendChild(s3);
                await sleep(100);
            }while(!(typeof $w.layer));
            do{
                head.appendChild(s4);
                await sleep(100);
            }while(!(typeof $w.hex_md5));
            $w.logs.addLog('加载成功','green');
            let doVideoButton = $d.getElementById('doVideo'),
                doDocumentButton = $d.getElementById('doDocument'),
                doWorkButton = $d.getElementById('doWork'),
                autoSubmitButton = $d.getElementById('autoSubmit'),
                saveConfigButton = $d.getElementById('saveConfig'),
                /*newTokenButton = $d.getElementById('newToken'),*/
                startButton = $d.getElementById('start'),
                startNewButton = $d.getElementById('start_new');
            doVideoButton.onclick=function(){
                if($w.chuangguan){
                    $w.logs.addLog('闯关模式下禁止操作','red');
                    return;
                }
                let s = doVideoButton.getAttribute('class').includes('light');
                GM_setValue('doVideo',(()=>{return s&&((()=>{doVideoButton.setAttribute('class','btn btn-primary');$w.logs.addLog('将会处理视频任务','green');return true;})())||((()=>{doVideoButton.setAttribute('class','btn btn-light');$w.logs.addLog('将不会处理视频任务','red');return false;})())})());
            }
            doDocumentButton.onclick=function(){
                if($w.chuangguan){
                    $w.logs.addLog('闯关模式下禁止操作','red');
                    return;
                }
                let s = doDocumentButton.getAttribute('class').includes('light');
                GM_setValue('doDocument',(()=>{return s&&((()=>{doDocumentButton.setAttribute('class','btn btn-primary');$w.logs.addLog('将会处理文档任务','green');return true;})())||((()=>{doDocumentButton.setAttribute('class','btn btn-light');$w.logs.addLog('将不会处理文档任务','red');return false;})())})());
            }
            doWorkButton.onclick=function(){
                if($w.chuangguan&&GM_getValue('doWork',false)){
                    $w.logs.addLog('闯关模式下禁止操作','red');
                    return;
                }
                let s = doWorkButton.getAttribute('class').includes('light');
                GM_setValue('doWork',(()=>{return s&&((()=>{doWorkButton.setAttribute('class','btn btn-primary');$w.logs.addLog('将会处理章节测试任务','green');return true;})())||((()=>{doWorkButton.setAttribute('class','btn btn-light');$w.logs.addLog('将不会处理章节测试任务','red');return false;})())})());
            }
            autoSubmitButton.onclick=function(){
                if($w.chuangguan){
                    $w.logs.addLog('闯关模式下禁止操作','red');
                    return;
                }
                let s = autoSubmitButton.getAttribute('class').includes('light');
                GM_setValue('autoSubmit',(()=>{return s&&((()=>{autoSubmitButton.setAttribute('class','btn btn-primary');$w.logs.addLog('正确率超过'+vgqtlv+'%的章节测试将会自动提交','green');return true;})())||((()=>{autoSubmitButton.setAttribute('class','btn btn-light');$w.logs.addLog('章节测试将不会自动提交','red');return false;})())})());
            }
            saveConfigButton.onclick=function(){
                let stkToken = $d.getElementById('tokenInput').value,
                    reg = /^[0-9a-z]{32}$/ig,
                    sbeisu = $d.getElementById('beisuInput').value,
                    svgqtlv = $d.getElementById('vgqtlv').value;
                if(!reg.test(stkToken)){
                    $w.layer.alert('token格式不符');
                    $d.getElementById('tokenInput').value = tkToken;
                }else if(sbeisu<0.5||sbeisu>32){
                    $w.layer.alert('返回值必须在在0.5-32之间');
                }else if(svgqtlv<0||svgqtlv>100){
                    $w.layer.alert('正确率必须在0-100之间');
                }else{
                    beisu = sbeisu;
                    vgqtlv = svgqtlv
                    if(GM_getValue('tkLeft',0)>0&&tkToken!=stkToken){
                        $w.layer.alert('<br>原token：'+tkToken);
                    }else{
                        $w.layer.alert('配置保存成功，已实时生效');
                    }
                    tkToken = stkToken;
                    GM_setValue('shenchanranToken',tkToken);
                    jsonpRequest(host+'checkLeft/?token='+tkToken);
                }
            }
            startButton.onclick=function(){
                startButton.setAttribute('class','btn btn-light');
                startButton.innerHTML = startNewButton.innerHTML = '任务已启动';
                startButton.onclick = startNewButton.onclick = ()=>{
                    $w.layer.alert('如需停止任务，请刷新页面');
                }
                startButton.id = startNewButton.id = "abaaba";
                start();
                $w.logs.addLog('开始查询任务');
            }
            startNewButton.onclick=function(){
                $w.layer.alert('<br>建议调低答题正确率<br>遇到无法作答的题型与任务点将会自动终止');
                GM_setValue('doVideo',true);
                GM_setValue('doDocument',true);
                GM_setValue('doWork',true);
                $w.logs.addLog('视频、文档、章节测试任务已开启，如需重置，请刷新页面','green');
                startNewButton.setAttribute('class','btn btn-light');
                startNewButton.innerHTML = startButton.innerHTML = '';
                startButton.onclick = startNewButton.onclick = ()=>{
                    $w.layer.alert('如需停止任务，请刷新页面');
                }
                startButton.id = startNewButton.id = "abaaba";
                start();
                $w.chuangguan = true;
                $w.logs.addLog('开始查询任务');
            }
            doVideoButton.setAttribute('class',['btn btn-light','btn btn-primary'][GM_getValue('doVideo',1)+0]);
            doDocumentButton.setAttribute('class',['btn btn-light','btn btn-primary'][GM_getValue('doDocument',1)+0]);
            doWorkButton.setAttribute('class',['btn btn-light','btn btn-primary'][GM_getValue('doWork',1)+0]);
            autoSubmitButton.setAttribute('class',['btn btn-light','btn btn-primary'][GM_getValue('autoSubmit',1)+0]);
            $d.getElementById('tokenInput').value = tkToken;
            $d.getElementById('beisuInput').value = beisu;
            $d.getElementById('vgqtlv').value = vgqtlv;
        }
        async function start(){
            while(1){
                if(!$w.wait){
                    break;
                }
                await sleep(500);
            }
            const classId = $s['clazzid']||$s['classid']||$s['classId']||$s['classId'],
                courseId = $s['courseid']||$s['courseId'],
                cpi=$s['cpi'],
                logs=$w.logs,
                $siteHost = $w.location.protocol+"//"+$w.location.host,
                $fid = getCookie('fid')||'666',
                audiofile ='data:audio/ogg;base64,T2dnUwACAAAAAAAAAABwRPFFAAAAAGFtEqwBHgF2b3JiaXMAAAAAAUAfAAAAAAAAUHgAAAAAAACZAU9nZ1MAAAAAAAAAAAAAcETxRQEAAAA7J4IBDP8F////////////tQN2b3JiaXMvAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAxNDAxMjIgKFR1cnBha8OkcsOkamlpbikGAAAAJQAAAEVOQ09ERVI9U291bmQgU3R1ZGlvLCBsaWJWb3JiaXMgMS4zLjEbAAAAQUxCVU0gQVJUSVNUPUFkdmVudHVyZSBMYW5kFAAAAEFMQlVNPUFkdmVudHVyZSBMYW5kIQAAAEVOQ09ESU5HIEFQUExJQ0FUSU9OPVNvdW5kIFN0dWRpbxUAAABBUlRJU1Q9QWR2ZW50dXJlIExhbmQjAAAAVElUTEU9RW1wdHkgTG9vcCBGb3IgSlMgUGVyZm9ybWFuY2UBBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MAAAAlAAAAAAAAcETxRQIAAADTrXQwJmt0bGlramxtbHNnb21tbXFzcGtpbmtwcW5zbnVvb2tsdHBta3BlZhbry4DtM3VQAWLUQPUmXo6f2t47/VrSXPrn8ma9e/AsTi3jqbB04Sw1zdUPa1fjBMs6ownQ4fOi7NHbj7EzW18kEcPik1/Hkf6eyyMbbw0MVludxzOcVjQa0tFB03Y3O32eBHsYvVfM2gBiF0vOUGLD1pagBBgAQIxhIGX9+b9y/2nv4/t7D9itr/186PC/E6ve0ZkxrzRb3FpXyv7J9NScZvTM1XbpHSd+Ju08SmIxLbasFJ1T6vnXiRtuqyhS3kmftQgl8tfnGzZLV/1YpYeM+Q6/cNjATi4Vt+3pAGIWvsZgLmYRoMQY9cQ8tT4w9Lvcr++VI4fNwX/fvj3rvN9EuAhnY/OP+CuO9jXMmpysCOMpwj1HBLeq35i+xyq60Nw7d6yBpaSaBDP3jOFoFN/x7/IEcapdaY2sww2nRCfm01ZD+6vEZZJ1DGIXPs6g29Iri4EYY162vvt+VKqlfzH11bP7Z33Xf6S89kRuzB/j5y/PkZOYo3S+5Jm4RvMrpEbbhLmhIaF9rVXiuUxUvHQLPVIveiyU24DGNLhIScNs9cUVfepmowzVOEnm0hDeXAdBN2IXvmTsDHEAxFgB2ooJm4floR8vJ57Y7P377PaW+GvEvSfzdnpqXFlZgjQkZUiMZPw9XnUTwquoN/oWnM29dRtD8cddNHbriDk06c9rSg4SbA2P0ctYSrAO6xeUKJTguQHVnOsW8IVKPT+hYhe+5rFe0VrKAn6M2vHJyT8nr+tDW/u+2cqlY/Lf01fq/85y7Ph7625oxu5CwuLr8dP8ROByyJ0ynbiFw360xxCM0smHfWxuwERtV8yvw+XlnjtWunqGpNh0CZd8NIE0aejlNXRk9+rTBl4XyamwBINdAqgAkWo/Lcfefr48/3H8eNduPV1ei3pQKaZwe+9mQkNnHFZ60vYOjdLfiku5C77tKvu/yWu5yLe206/LF54LvPrPlI8DEbZH5fIn6p72c5aGOumB6KazRYybsEeUAZp4GpTDDWIXvs6Yuh8xd0ACCCId96Oz1g8n5sPTPOOdzY90G8f7zNyaZ7wysba77LWDalPj0Q+3xCXGpZk3nr1GwYv8fbBzZSQfVff5/KvKVnfkizXG6Oj2tDhEbUmIexVn4W90k4QOoa7BA9SDETmTzxhiF77G0O3KBIgxyon3NVPff/3z6I/Dr+WZo+Sffmtr7bUnabprN7LWupJjOXyIqxfq2bzHeG/P+r21Lhk1zy1OGg5lEUne6kB92BzzjU/TTkYUkI9qBfop6DzmDd4UfCN/CGtO8bqvzHfi3Q5iFr7GMHJhIxdpbWNKIwHEmBirTWr/fv/4i8e7L3/dObaz+Soqwfx+/9FIvWbJicnORaLbmDyWxs3usrdwerPppjbD8MlYdOSrBJBnyG+Fv74wYPGhhxwpcpNHKqb6OmwuBIfBdT57kMINGfcpyHHhbX4KYhi+xrDd8DwPiH5MZpnvxLNDH68+7zP7j7m1Pqo1ee3Q49p8G4lVLbL5l+hK7FMPiSPL6OYwyymXkTftNF7HYlctgdsZ90F2oebPv3PJtfue942usdsE4bzeYH5hPY7WFKt8pgm7FmIXvs4gvroAEBOAel4+hCvf3/pnmcprH66dXb69vr3PjGufU9ee9FbnoBPeTYxk2siW9VPD4gf+wje4XE/VTUIgSGZOphQvYco4Mf/qcy0nHRdJ9wFSKmlsyt+tbbm0YHPO7ed5ifVhveYQm+4RTGIXvsbQB/xgtqZAjL7WhCZnHTqetn+/iZ+v21Xn/6+OW8OPkHg8fsz7dyX3h5yecQLrdpnos0RnoO89KZm/5T5CeSFao4DEhQfp+S1IdED7bPGmvL8Kbsz7wLXXx/pGHaahaxB/ya/X4jNG9gZmF0vt4Yu83igoAPwEMLFq9XQzGr3W7tFbd188TU0d5a0frZ0/M3X60sbP0TsneFsLy5OJ5ErSdOP3I20lZaasMvMl6d1Pt9FmExGTftf4zEnKoci+zzKityAgwEqmCfiVnHxoOtR1EDzKKdghXhc+ZNh4tU0AYgwW07i0dfPjQ0f+7W/X2Tnd+sBk7w6vHNo5bjHHnXUzL+yWtR/NTXmaZ0za0uNpVrVctp78reWr55Z8sfl8fXjlxnQk/a6FCCRe5aG0ejw5PqYw5ioa1vapzdtH2f04mWufu2IWvsagDxxYy0GgAsToo/WL882ntybTfjF74unM1bYH/ybTh6+GJV1cpSSHiTPLOnVoddbsfGA5iXv9sMHtqnswpu+iG3cEbKTUdfE061k1Rl8EBHEjLT287bR5LAqC//MULwTHvZxUxjJp88zWZYciYha+zmCuWpu9gxgTQDiJkz9sEqe3jtx5krA5/v+TdHd7X85+kLN7k9bJ5WVf642s9rqy6jS0vPX/O+q35dI7HPK9oVaWzId535hFksfK1DMS5dEh+6z6VKkrxF3+ylydtOjP7jt/e9Nw/Tm7Q83EKE/yAF4WPmTY/NmmPDAAgBgZL+HfX38fsrexy++SL2++llkbxs8yXvdxzz0NQ9jUPb16cfGumzvRknbtYtQjfZJfSqwcTK3dvHiSXwtnv6RTHo2zkKaMGQIMYy3peexdJ/rrkfHZIuO599bwVVbWqYYrYwliFr7OoG10t7QBMUbFw8TpA1Pre2baL5/PePvi6egSnTzrdd1oYWXdfA6BWUiIx3Ui2SOrhC/u96m/xtR5sxXiLuOwBkZgtuBljCKqwFLdqbC5iHL2dF4p6fRlCylFo0rhMTAok2kQ/LAFAWIYvmQwF010EBsgpsad/b4bU7Pf1Yfr/Xa+GG7XWqLse7eepFy273Y2Yl5qu5Ln3tVhL5lbmxjJrJ9f1sNwRveWDM/vy7Q6FbMukSjmD33JHjlvV9fs36BrTpQeyeKp5mNxSogzLV6nCGIXvs6Qi7T0tEdMAHG+YmLn/INc+v+h3f+6sqmTNn9WB28J24/T06tR2sS69cxwM5gJ1UTu/Ai8sLy/soMv6xHdOMPmP8NwM3Lu80xRO8X1nNXoxmG7f7TnYsTG1hLfPXtbriyW07e6wsace9pnYhe+zpzt2bQSwMUYrcKfil90LneuPHjsZkuaL+P4uq584t7pMO2PV1885W+NUchIEj3654qU0M92w3adIFzXHs2OxEmvoPDKARXcs8ZYMaQ9zFb3LOk0o0FwIeuMHzZYHtI9ZGhJS7JU6KRiF0vGoBffEUgA0Td8S7R8mezr+cVb4lbv5/vxaPtyb74trRzMU0+6F8s5e/29d5QMNoPbdPIyEgOReDj8jLDw8jzU0vv6/k9aJTLKj9odBdavRh3L86Pq3m2TOhkVh4jIhH4TLn39ctoU/08W6QYJYhdLzrDqoyyl6wUVIMagCXNn9er2D7t9j9hVpUWGXa+JrX8f2Kje6R1jojVJnGifyV+bj0npjj/ZO98EWoh7bKLswwfm3lJ2R3w73LHZ9Kqx3qZsn/bTQCI9b937t59x0kHCnKGXwsEQDY9IQGBZXApiF77OkAZuPG6ABBDjYshIX32ml18cSX///cvHO+fd16ZYSzz4JNH30vjK6XROfmgdE/ekGM1U2e8CtWzG8LNTdtQOXnQsw9/BHNsm/YvNe7heFyhILNy28v6Mrpy+MDJFk3pEua1ZJQ/09HpVCWIXS2SIkT9OgASEGGNMdlRtj7227Vi/i35pnp9/T1hPuC0HNqmrOJW8fMhyZl4ZJ3bUMqXpO2Pr/Vn8Moans/2xvVsmi9HF66OxZfl4eNTSYQ/m3+0LeSen6QjRplcJe96c+bCgazQz9lfYUEk6xq43j2ZeF+k9GlVGcIQKENUiqTYPvP5xM13K/OJX99bkZp/68tC4+9vWeujzdcvksKJ6op7e4uwfA525rJWXqx+Gbl59twPfke7nPYuLIdJSL5cHFou8hbxHC8KIwb7WGizRZNSnlTe40pFFa/o7DlchHmIXS0bFVwesjAYAKkDUlcejqT2Hrk18fTLr9Uuzamy99bZ1uH/UVjSRhtibu+21YLds6Yh+01l7MddlWXaMVM6e7f1ek2/i++9eMx3vj+/XHXswvGh8BaRH5p6dernxNr/HVHkoHyD648Opbr/aHxvizuSOAGIWvu6hr1IuaP+oAH7siPlh8ixN/4e+j215uD2mvO838fj16cnH6QfXV/abfffCXlt217th7Cc9eZ0fs4ksfmc7Oksnn3xdI0gFB0DFUcOzs/WzWUrBler2Top6FSwso5LFIbgTmX6Kkj1aZ+EOY2JWXIZh4002su/QeRUgRk3K/CY8uDd/6ElK/+OWyY32eHX6Rxr7XU0zle5d3E0zS05iwpoyrAhDvkjGcrnkcH4dpI6IKRPDt1L9DeLtRigRfjxx2AuDCQ4hnDVMOhfEmNXo7co2p3R1mQ2GXMaLDmIXvmRYumh6HYgxitTp6dpD/zz5Noa0R5M3r22daZ3zdHfp7X7qSXQVkJroprmsVcYp63GYVC4gGcXtY3hMkdt04/vhOfmiYycT6S84gQ+fXIbqv21+tNqrMpBsuakRd3kHwXOPTCaROGgGYldcjmG1AZEakwRQAaJ3KtF3Zsf+x7Kx/G+f2q+T7Xre//sp/G7T/R5TjHbeHfr2MZ4bZPPCCj/zmjkP1aq/jBjMsTmb4DbKj779hakKmSqWC2gpyoXi1eLsZD42o23vTstInaZWnekYvHADYhZLxnC9G0gHCSABVABhxvzn3Hwm9hObD1mM9BdHDk1fuXtzZWjtaUifrLI7ulkcrPoMi7EkwjDhdtPNttjrWG3WUiTxRZGcsI1JUkWi5ChCwmF/wqdeMo5lni5XmTU+/fjHT7GC8I72AA2Cj33dSafDvAFiF77OIDa1so0DUAEqQFxM4/bZVau5/Xz69uPbZYvtV2dNnv9JHLmb6LFunJi9Q+q4r9TpDywug2FQdhon1obW6dSy5roF6VjAMn51H/fDzOFkVIPqI+GHUXbYVF5LI2Mfx5STjc5qJIGGzrNnC0cOYhe+zrDBb04REywBALECDITunL//bdv6z6eTYB1tvdtr9puyVr680TehpqTb6Y6bivRPmaIk0dX9kdGTQ+KXK93TlVc2wMeyZy+QiLXflyi7Genmb4ltc5cjn/ztvAk7ezkHC56Ps67mIXZQZ2IXvs6gGUUrQIwxj3w+s//Vex/Yavfysc/9z93uV90nt83+4uP5xN4E3bA9fl2mi5OW0pGKtJyvUUzgp5Ry3SetNTyG91kl1Knli15bRHvk9+Ha/CaDKmcbvw410H5ZRq59wjbR3B4UKFojYhdLxlCuhw5PBYgx1N4TWV26n3b61g/77sbyz8zbp/+Wmbp3J7xl4SYYJyluGn2OvIXLuSWfkVSY2ZGQs7pfmD2mSU3yi2X09NOesxKGeh6i8niN1oMwcBd989JdBpofHyhYU4lggQcVyzvwaj+Xc2IXvu6x8fc+sOsTRD9mHzoz94ZbtUyv+m0X5GTtpF3b1tZazQhfSlP/+KS+hgxEk7CGrbkhqeW0F2RFz5p53OyxyOkyqB2tHpn9FV5Js7puV1NIMV3HWYDuXXYW1I2b5gAnWowBT2dnUwAAAEsAAAAAAABwRPFFAwAAAKvJe/AmamtuZ3lvb2lxbGt0cHZscXFsbW1rb2pqamxvamtqampvaG9ra2tiF77G4NfYCqgAUZ2Iz/LTg/TnV4bXXsw/LemNWT++vNi5Tdpu6c7Jas2Suv7zJCl9POMyHvddZRCZb+TnI5lHZDlcNjvnz9IpQ53vl/aGXP35sFMmqYYsv+slcJroYUdxnp5OcUcSP4lzYhi+znAXclFuEUQ/js14yTKR7mLcSdv/lbeHdk5P+5l3X037ou9T46StYd3oeMzdw3gYJY8UBJ6W4+EG7ZF54jBdnTioi4TjrFHMtO1lt7kr9NOv3WWOLmTR7guDlti1emYXJZ0aaPZDbwJiF77G0NrAgX8NiDHGcHLmVz9bvr7zo+8D3Xfvw49P03H64GRbsk3YysSvON6coHEN7U9xH7GHTpa0YPp8PMzbRD8Wlfj1o+nBe0XekLi2b/e0+ttMOj6CkjGPB0OKepoj9a67yK+XHEpLPAR5jmIXvsawmFCgEWMUdsdT+eed9aejv/eTCel+OTnx7GA8+ds4lNgbPOn50tAPyO8zpDnT5Y+JXyQ9H0l1SyUWdYkcHo73XcIp7RSMTTkgXmD+vKPqg3LaFjVUftV5cllGASshRns8yABiF0vuYWO33ABFwAAQUAESgK/3HT+/8/DOrW23/3m73DPzueVXn3nr3T3TK7vTVw/p7RByb/qlO6jFXnInaSx3+06utkvq+IiYoh3xRJmrYVI2lqQm2jsdZ5Hh/Vm3W8GEGg3r++JBbyK9QT5EGkI7didS8APEh+kYYhe+xrDbZNEwmRATQOzIgXdu+ny57cuP5//2Hx/X6Z7+Npayi7c3up3RqaRd1id+djvGnrRIZy9EnmQbt3H1j2NHBDGFEmopRJhwqXV40H51zzoWlzdryBNvuVC5qZAPcDRcBziO5D2mYw64rNqDYhe+zvgy60tkAJAAonpcWHvf/Vg/7fdp9/r27iu2v7qv3j2rlIuZ+nN3Mg6r2H9NfRVDZzSMdZXoUexVdDY9hL4JPN2X1afhm66Dvswywm6eJOuSuyfo3JN49BE9DRslZx85fYs0PKotUqfnmXoJYlZcjqFrkzwQYzR3ws7q6Medflt7rdLbuz6zf09n88nm/cevLpLx4CQp65fS1G4Zet92Yf5558AHzNpAo+36crks2Scs1EgIXDpKXA2P1vYDEhJyZ5jBQmnPmf1yHfA7CU003TifT1gZYhdLxnBy2Y2PhJgAYjdlSR2++L39463dgytn5mgyx27+99B7UoPR/dg9Tcrl1Uk3Tk42+bH4eveVbv8UibI+fZiwxo5F4WanuFbOmcVIt0NPEuEc8JokPWOl8zLZlnVOF61L4Zj3qdalSK81zXHaUg5iF77GsI/RMwBijE2f+fu4Xk9SD11Jc3f2pv3Ox4286oT3X5ujWflHjyA6eQ4izSDfA7+xT09JGF/LeXqn7vOzRYv4kxP0PTuNUmY9R5iTBNXh1jv4zNvMrgGhfMJ8562zFOOeY+jzDZJ4qTtiF77GMG8GGogxeuBde2Djocmn7enf5zeX097q/tm91GNM98bxV3Wy9nIn5NenDq302vUpzN5x53r1Npe8YSPXb1NfJeL6FPzVvBlPm0xfnXrScYGuroctyfFaMDwd0WV2nSVTRKsLchr9BGIXS8acGcaLdkAFKDogVsvPsFz6k/ZLm6vy0JVfp+ntn4xGT64mbG7Jy+m4vxMTY90w17i82Xk63pZj/7A68d44TyQlYa6yehxzUWw7z6JfN8mXxrOb/WYU3D7zv8BPUYDOezpIZnuPWcFMnWX2ndC/rqgFYhe+ZLih6h1AjHFCc8ql9Qd+fXp1xlcbVz/uWrZ3z/an0rWLH7NO/+ZJPY83o41XpvtYQIxJ6cRqQku/iNPNSdFzbnLC8IyoytW2hpnStUrqlWdeBGOde4tvJOHMexNWd3A25VNvcl7DZQyn1HWbCGIXS8Z4m/TN3IMBoMMAAOJkMU/eH/Twp87lV+++/7j18ysvEgePqTMSy3k2OmIc3qt2YdczHg0Tae7PLec19u4q9t9u6e7axFH7udbGyRp0t7cFtOudtbtmGTZJ0Q52LDWMHK7Baero1deDCserZEVPjcyGbhFiV1zEsO71nU1SFsQY17zmg2nzJz/c54jt3fGMT7vn+8axa2fP5HLNfFyfH7lHyZbET18sdmLC6QS1yYWdsGdUK32JJg1Cr0ZRGAm1xHNbIZm7qdvayVVw58du19x7MCkabjWN7hAX+fORvDRiF77OOKMvujWwMTFGzd8bR34l1tNYUi4fOZh19YGV5djDB9OB5Os3QVdpfm1rQNgONLxOz++9jvK1LW9a1thCjORyi6ukDzzFyOeH6L1LDVHTAhW8deDZI+1z5innRwakHMmsG5zH+5xnPJxaaFi2AmIXS8bog/3KAySACo7olTfmaX993b1t+vOP/x7Znzz88NGTzYdbPekJq5Vc2E6enHsi/QlxWE+ed89ezk+vJ9xGO4mnCc0cxT3P4ZFfHePZRd3yaasEQRb2zKkk0V90O6VaqjRJaPUExNdBjHqAYAUfYhY+xpiZZ7g3SiHGKLWSuy/ma+neH3qe9dPn04ffbNN2Z77+ffNs6RkfOB24HzSxsHhzyBSusXATd2PhMHehZYuf16AJvmMsawu95ijusWbuWVIVWIdim43hmKqHjGR4QgSpgMUp3oMm3BcAYhe+zbBIm7cUhSbGOK5VPd/y+ovP+4dHV68MP62bae5Z+v9qdbRz88W9Q+bGtAFHWnM/wPMTZUMg+ljKU5xE57MjSukp/NMDE+egMXlHKpZkOGAFj65VXhofqvp+tUUbP9yUyGl4CPe9/xsRAV4XPmSY80vBFkg6ECN+6fatj+ktf2Y9pt3qf2dSU+mN+bvbh/bGL9udFH3i5sN6MTA+fdZpZ2HTe/tZ94dzh6KzoNsxsZBCNBHx7DjXRLSWy+ECAYirTFOWNLV54GWoGA5lg/w+rTNeyFn0sAJiVlyGYUSpb2l7CWKMmqiwny695TFNytNb9zlvD13at0tY0490df7KJU6C1QkdIvHfJQWXeZHGIhmzx57cy30S+9BnY3EeYgBoxbAxpPMhMKy+cbXEviOKpeNlMlbMj+ZbOFovrMRmvnoDO2IWvs6YlD6bA3EAcIi+xJRblvT/X/v7J7HX+/CxL3bsZvz4vX66aRz+cWvMfg+/fEgYvkPsdHo7lfc6WknPy89mpuSs/WhRQUdfLus06wVhIbRACIyOkzzlfjYfyDVdRx6MfPmgj/qGEsJWjglhEGIXvsZg841MgBjjziTt4NH2yZ/5/Uv95j02lz/tXtOJLYlJRs+f7KQanovsvAXCFHI4SNgJueCncec5JnGBKCcfXjDXyN+N4uiw5eSOOSOvYH+x83VhwUXAgRhSZuHzjkfmNkkzTBJJ8AFeF8kZbGmVsQ7EGGswTn+f2NofOv7h5/MrZzbbj6U9fjBx8zxbNruXUUuHm0vpZbJ4zdlxkAT38oMu7Fp2dd4p7jUkVEmYeRGp1g4hIerlGstp6EHmg7VPvV1teS7ZpAKWnj74bNDg4GMCYhe+xmBdMyLxiDFSfUajPCP+91ry+/lkql1i65NDT85S+977lLpYy1ZGLpVitvJL6DmqhD/xS7HkNyxRzRXjyxdyyDVsbHHUY+Gnz3KJtEdT2tNyrJ+T4Ps5cXhVdApLd7Z1gB7Mk4hwUmIXvsZgvPEiCRD92IzJ8PRO3uWf3189/OTHkXTpXkn75OrrvY+nyX1NWHrWoxuO58w7oqzEt/BCwi+PYcJsnR/PRbp4hnkk8XT+ioYnFakgadInUbSHWfgdM6dzf3LOh+gSNgSHeAmYj3mNJ2IXvsYwWJ2lDjAAgAoQfZ711sGPq6sPE9XyQ1/+fhuunc5lQi2LHJbb9KTD9OnVfmy7mcTtvJ0wJEgx5XAuc9R798y3hTpt+UwqdkRDho510cr+h8Z52zI+b3Y3TgeohAPamrIoSvB1P4gH/yUtAmIXvs4wOPKIMwwx8H25aKdLrYcH0rz8/26aL7bPvPrr0Omo/+atkyF+d/tUD266biQki1epc7WKYXvBgIuxyKI+k7397btaypHbb7uJ2MKor5TDuS3Wq5Lz3kpdWZOsZcWJ3M2oQ1hy521iF77OeFVaAcQYJ4fUxPqX4QS73w9ce3zLP7+w9J/x4OedS89Sx+tGTxxLEixx6oelc/4g2SNaEstlSf+ugrnZXxftuhRXf6lkVw8mYHP7TnCPotNdZJCS9+XLxDJ7g26O4Q+0i6SqkrwNn2YYy+1hk5TeDRbEGKOzpLaHvurX9+B9Hb50cOnelV/Hfv68/my0Nopd41TGKHuNCRkK3iT/pY+LS2+Lnm8r82YIgP1TgCaJXNAl1BkhmTa6D4dKP5xBu5np3pybllg9O/CmufrkLEXs3BdiV1yGB4m31UjQYoxxtu0/T8o95dWf59hwdO1wytTzvDqbOW7f2y/tf5yfN2nmn7kgwdxSq/dvz7kOzzgewJ624Kw3+jvE/UONYW3Ba3PY5CutzqId+pISk8gdNkW+ud03M9umZRexupsdYhi+xmCb+gNEdRwR9NZjIrn0Wh7bv58e3JsRQrh8/qt7cWkYP0n3pN6pGIOb8qLjJn4qhB39Poz+o07aGv2U9v/xx0ws2mP+Qf7zVwTVyuPk00q7FjlxyiM99ieW8jLDWq8CrboBhFVvAGKXOTUM7wjAeABQAaIoukp7JfX2Zp+/z+8cfXH00lSOo94ncTVhdNZXG4v26OoOe3VLRxfBmjww4yBy99207ExIHKrX5bc4cnAz6l5OeTY2u94UNCUxCo5iT+tm4GBeT+EGSkgdzhDN8SpKlx5XAWJX3Iahsll0k+SrCaijrhlB7vw71Xcirbl5/KftWtvduDKxk/JtNQ9tNMuhiuNZ4nLUIJ2A1tlIoleXj02lu4uGnQnPnq+VS9b8Y4PV2+TKI4Ua57IFr3nkBeu1Olc4aHGXquStAy0AYhe+xvgBUW0dARUgxjZ3WW6nT58PpbMcbYfTDrd2n3SCdS0xaU6eue3uxW7rkf6rRbZ0h9CTWvXlTOZIrv691k9p2nVzC0fnQ7hLgilKNSi4XfBjuyb5gcyLt/OQtrpVEFkaRaLnsfJm+7OJ4w9IXhc+xphmbrjwlkrEGKlxrM3RrRd/7l669c+DnT/j6amPaxcpsxiGdppM+jEP08dLvBKNay0VrzVE0PEXLO8M64G73rVfsD1CUBTemmIbxgyGSn3K5nX8N0PmTJwORTsZYxileTYxBD0eu/piFr7GcJ+m1CHGmOPq1o/uL0ueva07mfohGs+v/Fkqpl2bMTG+PXlyaR1OVQ4vcveT1XXGKQl0GHGe+8xDOPNb59mSjBAu5TIfQ46/sYbWg4sNAyuxt6/bwwumjgP1K944XIU7Zq+wtxTSTWIXvsZQLjYwv4AYY6IN2T58H7XrSe3//Z/eTG5b23m6Y00c7eF4zDardWAbvINwuqDjUMNlJWcfkzCNi6c4Ct7LfKBf5U2k58tM2ffrMGAQxe+mDKMwBg2Doe8fjiHuPgaE8PaVQ7A8V0w+T2dnUwAAAHEAAAAAAABwRPFFBAAAAHza/+smcG5tbmlqa3JtbGtza3BxbnBubG9ub25saHBsbG14b25xbnBsamtiF77OsNyGdAkkgJgAoiQOW2d8ejnjhbH/4M7rXF7ueDh57ddor6rWJtYOlhNLJWf0M4wwaqlz3jSupNO1bliNtr+23uinBZVJmIthKOweF7mp37d9chq5EgMt9whLYYsNotue+rnUi98fTw0PTeoIXhc+ZPSN8MUXQAWIEdp1y9cfr6y/70nG/MCt07m27UdGhIk7l6vdWqP0JAzLvzuLYaznpA6C9uFt/70N0RiQWaETUxI55b4IeIbLii3tfLzK/E0ix1NoO3kPyaq7SUtElLFzkujlHvPHp7cPIQNiVlyOwYg7zaKgAsQE0Drt6f3H8fTkLcvb6Mw23dHerx62/BPXX4t7j0/jTetJzV88EfHTzMJc11fNmEdlY/eH0cwm9QZqdvdqeRp6kdi4URcdTSzxUSIa14PZrPZ1PrXbUBFhZk5JDEchU5IJYha+xqAvFS1LQIzRT9uL8XzNOPx9+/vw/d5Pk08eWL3U/t18s7aTmrTrmO/zqYS2fvvb+qRh6jhuysnka1AySCr/61H/SlzQyTFdBn/QWKy8kYTXJQrv+PhMtordr5exmILUY2QOq/G12Ga5+yNiGL5k6DdzMUxUgOjX+tO4XNq8nManZ8xK/+vpfynnPWdtfCjx0P027KoeeOpmGebcwD7mMrsCRp0E4SKGJoH24ASz6YsLtudqRhv88co4PI0eSVSFA++RF8wtYp0qKXbAj3F56gt2+6NiF77OcNlHMfwCYoyJlkjb6fLvQxMPXX51QxM36+3jMfYyKbaPac1k8s2tSc/Foauf/BUtUu/x9JSnp5iY+p7qp5uuzu0YBAt1D3JCLIkae5OFe0t5FV1OLofNDYtn6p66fZaexTU927IcYha+ZDgtAMQ4AIC2PDv8lkzy4HgGR19JF9P98L7Jl6eG9FltHWzV93LTMPW2+Fq1rE+1pFMaIPzc8zYMHYk3kxbX78nJOi9Mw25C2Xd6sJlo2Q5T1zCGKhed7/YNj6ez3Pj3OpNRi+ZCqQNiF77NuMVUBl4LEAcAECvks9s/H/812sw4M+2s59bnR7Z2fZn1+cqlQ518M2mIaRIWNxKx38pIxHQXmroTg4zGerqaYuq8u20e0f2HpAPctg4XfSO7o+ZkwHfe5s/T3XdeMvYS+JFEg7gOonq8jtgjcQFiF77OYPCXOOiBGGNXY3vfObjU+/D68fvL7+2J37Vz78jFp9GTk2W+c2ssHAZv1zs4R6YTL4y32Zd58OZMjQ6HX1IkXNh2iBm/OVX1uOTiN3073soFmILnvJnWdR38OVznaFdkDUYShOdXMh0DYhe+xnA/NrgGxBiznm1K3/0/3Yntd+TxRe+WazOX97WYdwy7w2K1JGoAFeTTQXIT9VKm1AtHsp/ja6rLuCEAGVtcf10X81XcqUYv7VJnajd5xXsKsQ7FelRcXgDEcSrhGafEq8Rj09rnUWgJYha+9KAbTXQg+jFVc7hZZj09/PC2F0/7Xfni4SNT9hpmdi4N3YPko93m7JVCysxgerQDdDk85+J4HUfulufGvkQzdlAndHlrBWY4i7r2gG+eTxCejP8r0OpegxKFOtjMK4XVY9DlsJU89AFiF0vGUIkom4QJEkCMHsydy2f/dw/ufz585e62vZnJWw+dpjtJpLlVyUnr2Y4vJ12eTMntzV7jw/SGjnZ8v4gg2xvxlAT9OQ8z99z0oLmcmz8LFlbhSf6xh0OH60yuwk6hjS1FH+qKwRWWgmROeDML6eIAYhe+ZLB4SCYgxhh0YrrPh6MX8vz71a1na8+MWXY+f7pVU167/GOne2ChAw+MWSzgLtAtJF04XfK+stBjuN8HDqsLU7mid95k58NYFnAZqcGZXXNWxpuGS+30yVKF8B41nn/6dLTlbCY8EARiGEvGnL92VoAKUAGixPodujXr6dToasfu6st3f7fp7/HO9xNOj9X6eTPmfbYc+mnMV0NnLCFVPJ1PPlkx9A7T+cQcG8dX+bFRXNo256U+alBRi/Ci9bCnQN60pFHS7oQQP1QkqbaBXeQfUrly5IcAYhdLxnC/2prOYTABEKMl+6FsyPVrkx+v9zzc7++55fr0wWvSnXyicduk7XJyVonshrH0G9M9K2E0t+kNyW1PzBP7Qz2yJ2PD6ndVg/eYQDJ+icNhDFj2uYT0uHrmBGaPLdz9Z92PyRcIWJipP3axHwFeFz5kWG+yid4AFSDGodptc9Wu3F6OHOo+nzH71tAv75+nf26q/J6YSjlpu7oZJtusRfK8p910iQa+Kh+MucYtNFOfbJ4zkC0EZ/dNkr34RoMLFxViN6J/HtSlc75007iFcK4fVuvnwzawOtqNAV4XvmSIzaX4BCpAjCQDlk6sZ7Ybs/8kv+j+935G/6th0jzr3z0JfUMi7k729Mj57qe1VdNR2Hq3/5IEvZWDolQyzWOal6TfTjGGoUq2x14zcodRZjrB4/nG4hGHXnBb/YUNmZd2vQNCTrvnej/hDyJiF77G8EPkrEEgxgowWWtpNs737x+ftrHvs+1r0+aB72vXpma+Hf+bk7ujeatdM3GyzM1lpL8HCY6nboF+myjDGwppOv+ZkxM/KXIbyG3JzkEypsoYM0ODWdCNJilBwHJ7RxDV27eDo+2hY7QKBWIXvsawSLoZjUSMFUCccCjN4ZNn/60+Xvp9v4+9vfVpbOODdE8+7iaMu+EqyljD3IgfYihvghBQ1s+BdRJi6m4WkAvjIKjUOpcdRXLFuhPzXJ14tDakHTscls4ibKl82CYn+N60+k0qiKNnF2IWvsYwtUWahpIqQIxzHYU05w9tW3a/sj1UszZ/d3cmDZc929MnaY5Ze9rBk8Np9/jlNSFISAxyx6fBnaOlCaNkn2h5b7mUC/XoMLVTIiWqMAVhM1gkEm0Vd9PfqzB7rCkNVeXiIIRhdRhwuyjaDmIYS86waNvIGANFjOphCInLOuvxhfzfPXzkvGevPo/reMrmPCUl5XuwbNHF12tVLM678mhJW3h7KuSMJxe/4MjoKe76aH5P+2jdcnt+P+BIHIyFPinq2cy33F68qr3a+h1sYuueYzSFh6QoqkABYha+xmit36DXTFSAGIPPzc/r97aurk+ePZv92355myfftgf7p50kqXkymZiwOdR/opOc75Wsx2XyIYx6ffpuFDPf0YSKLJD7AFgKAfqsomsdSqBhOPK4ZYmb/8YSXzCHfVtE5YeBNLXnTB+HTQokYhe+ZOjyo9OhAsQowdj9c+zh2Vcv/rFcfnj21onpH/0mpz7NtrHr7jxedPCDyDDuEeX9jjlamrfclnoT2dE8MH/qvpPo9gbf+OlantMK4YlGRq4QjgfrzKfORun1aa8ooJ5uYeQtw2HbM72jPg9iF77GMN6WeuqZoALE2NZiTr38d0a/qS82bwWJl+3tmt38z+7nO6O2ccI4N9+jtk+tk/XEF+N03HN2M5kKFX2og6NNv5W7hJ82kgc3+Hlo0rNLVOQxkxSD+9qHcvNDnIgg6HrGcsfM/y2mqRliGL7GsC2br9EOxBgxR2nofy2lfZi//vDl/v3eWd5F888QXlpn+9HbKZqPgoRfduo8+OqIVVhTWyo6/iJiwP7T/zeSYNLU3ZpoiG0UctTq25aWaYeMz16WjFmtC3C7lOavVoQ5+nCKAl4X6RmN0Sz6QI8VoAIgB+2DpR2ekX62jT7t81h32vb5kfnLYbtpjm2tadu4ur0+e6KG796NkU72xjaBuNF+VKnZTgCWbOKUsmfnt3Upylqjt+SnEOlGlLIuFC9SerMQwzLKbefXeB4T8walOI/crABiF77G0IaXUI3OJMZYZ8llmO+8vOhs/OzD13bt5cV/j6+bufflTrq9cSYM9n4VYlF4saMcgrAagv7eAaZh02FqzxdXObCNEbaswwBe7q2RMFHM94onIRhCnMjCr6Pols7k2LbLnvMtOvCHxAhiF77OMM2hmUCMUdRvm/o7pTf5Kc2n2Wu7156/XYuj5fTB3lWn51DQh+ca+vKWfJZEzhnCwJdgLg+xnCQ9ji6g4rzkGruUcPbl0zep7NCPr4EQjt6lU7iKubx3T4NyuZFT3QiVvBj+OudVvgReFz5kaMv1KwAVIEaMVt3VF6lfz9ePX5l8vBqPSs/fq1F3dubzmaP71sl4qhPd3W/rraSuxBCtXFdfCIUtvG7OvVFBpGfhMruM+Xn+4KC8Ixl8rnuPJfApfMyI+f5E8TrsnMSt7ARx5YU0Mac3YhdLxpBt0SUtbnEECWAAAHFlfO9Yh5SvfNZ/T79a/W2fT/qeTp30Tdr07Tvl5k0eTnf9/iqvxeQikt+edI7qEO7WaOhps1baNwTZTww/pPOkG2Q9adV7gVCrSqL13Sd+vNxUh7MwY3FOApT9gLTXkMiwTh04+C0BXhc+ZFicy0vGoiDG6CUnE8m/9tsufTmj/dqY8dXh49tfezGZfHou/XtHN5cOvn7l2cLfvWJvznq2naD0Byy0OG0kz47uhgmBHSwsiE5TBnny2cgpSQs670BCqn+vfFhgaz54KrLyGZNzA7Zy8cIKYldchsESMKubmBD9WKtFrBMf548v+v8zmW5v7RXjmqlGyrbE3mFz8iY5/rQtFqI19Nf4QWWK2LYo1S3/xh3DGeqU7gpeBE3Bm2quOWvd77KZEhBd5D2+dcKBcSvulXrgnQUxsD4FRAwTQ2FyVCtiF77GICtLK8FDBbQKUAFGYUif4rbjtdT8/Pb58/B2s9/0vt0Da0v/k7XE7bPpIXHSKYlhuLkk+bPnYVCfXuvttho32tuQtF+LMukdaWYygB/YVKZ0CixFNNGLmyc94TpPzoYOriZ14yDtTJlFntiVA2IXS8YwtdK6GAGxUkDU0Gm9faeXqbtTnUvtU+rmg9OXb0frlcs3j0Z5jK+uluTvTFu3XLgQbbyFMEj+JyE+zv0eLgENJS9FzZluDxhwv6aYk/4U72PKTpDD459uRLx32ISYKASV1DolZVFOpQMTYhe+ZNyZAAwAIMamt3YmfsY2Y8I+P36/dvng88/ux56bns7bYR/PnwY9WFzir1E2lhRLiPObFG/71rNoMRLy9q7Ty/caZ/20bw9NhB2JIj8Tl6RHiXz2DsJ6HY8k6RXVKFAe21mv4tPGeSg67JH0M2IXvs6YG7RKWRWbgBhjOROk+Xm+P+PnxPUtfX/nlAdvbHb7PBsm36ecdJ7Nl3ToKV2KdOnrFOU1quvRFSos9wnN3nFOQA/ncW/xzDQ9vBw59ParWKW6uQd2FUUeyEaBbJRItcawRsLc92Y5MmIWvuahbXKm2UCMau+MljRpvri0tn/r9S/f6TG/Uv+8t+iBbjW2q3XifJe+J7zRGDTdHW4pTbyRT7uLpL1KwzJPXAhri/wpirS1nTANjkL2zo5aO4WVST6dvw1GkT/dFfkmIB37F4h6pgRiF77G0PZ2OBBjrLm+NI2Zp/8eeW53/esHDyf6dJ8u/3TFbs/opyeWZTi85vb6XsdBBgfPPNs5a7v1NdAqZ+R2FehymkM9m+atn2kz3xsOwxZmdHGVEBzE5if5uu4D2M67mGykwklRvOUbBk9nZ1MAAACXAAAAAAAAcETxRQUAAADt8vzOJmZsa2tsa2tua3FtbW5xampua2xvb250anpubW9wbG9ub25ya2hxYhi+xuCHkFOTqADRb7ravTSf2US/X5/Y6GPNf9L6+671Vr9oej3dMZLfKR2NtVTQZJw/xmEENU1LsQnBPrDpOTmncGOkj01rZqE6wekhZPo1qho6GJwEKZNzArlcs40FvLlzxqwAXhfJGSdcEUAFiJG8zEx2Pr02sWZx8+Vr/3/Uh+dTl35cRVI6fePocI9oW6arPX9bz/ZGDCsvAzLWh2MN03PCwAEXhIa3Q9teXig8zppusR/5ZnM3Sq/hUxQNN6vTsNQn1Tii7qLtH6LO6VEFYha+9BA/CqmBChBjzGcH5vT1+ztvV/vduX78yYvf+5N73cvT9kmZYZEZ3d7I7M1imJoYVoIlDozLXmNOAqR+qMKnWEnPpRZ8donmQzK6upqYNoQZKR8kVy3TUH+lG/i6bko9ZYpDSNxc+ARiFz7OA459gIsOYoyi0B5VOhped1P7yoS/99v+vP/BYH+ydzrj9OeJxHWSnL2DTDFKuWc85CqJkjIn5UPgWPc9M72U5S+TjHvzXSEiSYmSxYcC+1TsTdsOj6+ptNozwzj3hyBRgKKmcIpWAGIXvmSw5Ng9oALEqEnf3+nON69MpvycmZhx/PJecvfpkG6vJsdmTztLsjssyd7WRv/anuT1wXTtLTVRmtQhwscqCntRhhs/lTuDOsl4jDodyQPbRPygqTw3CYM3OXFWro9W4SWnAzuRQrjXYGJWXMRgsJ45G1AbIFYA5qqT9/XL8/8/fbW/df+L/fCw+UB8Or8xW5o4+X7jI24bGPpUNJLJxNrKFc9cmhuleS/HdCmVu1ox2B6nncfeJqgQiteRKQNw5Mh3OlWgxc4kKhZB2P64VhfyeI4MYhi+7mFxpTcwC9GPchZt88HPVfKiku9+vPb9QJ2/8tLYOvZr/6Z0J7b2hsvDCFk3wrrbGrput8Yx54SQZWLCmncywHuH3ZtYdDqZ+Kn7fcLP53Tm752j2HWdL5w6tjyHytQRS0KciTfK9BNiF77GsBpanzQQYyR5sbPEk813l23m45k/0z3b7E5//LGaTyQvwnBrPA7ngbuZ03/lggT+ln9uVs7t+zcpeac6hOJeXbKDW/NTUgvY1DyngumnuURkcTqoB4wa3czUz3XgKCCPH0Ke9BUKfkYTGV4XPmS4G7BQU4BYAaKnJnvqYtnS27379VcPvbOmn1/7kewNzZKanF+ttR4tz2Spn5WyK5hQrCXjFmWUjzqafrvJryOptwrv2yFtdMJxqJNf368uECVRoIUSPEdrl2+fiee2MpocbGWy4NxtYhdL5mFLhMh21ogVIAHUbtfmif2nW5ZTc+vzF7aPU88eDte+0z546EolfuT5xEiVbukqhW1CN1Q6P9nQthg72SsRTI97PzuFeDNrN2Wt4RWHgJwhRCdiIUMuLEDyCs7TxEqdq+DVSa1mTwXRiRSumwFiF77GsF/2eECMsa3tJKw9r7w/e3X31X//+cGMh7Z+/fraq83fzfwzX70yGcM61mD7MS99528Su9KGSTqFTg+KzCaGSI/D0ZxjstW9e2Q073C8h1NXp75oucgtnEZMTFop3FNLNqOATrbRZyICYhZ7iaGU+kNAjHHcEnL57M+9xORXD+1/3Jnv/rv0XGnHf/e1naDXRzvZbkBf5nEu152E5SBPP3hW9DLc1D5NNxTN4srfp/ChwiaEHJeukjqKxxdXjQmTMK2AX/Noi/zxJq9mGoHq4gkFmUqRBGIYS8bgatqmASpAjEa1xKeD8W599W7L7e+tnenPt4enNvfl6PlS2ufps3/STeYh0ZtM3E1Od0jWpH7FeAQdx/WXTrxGw5FKuHDT708m+ktwR6yCLxeQR8OSdLQRBer9GMIzuZwb11/TJNYKjXkAYhdL7gdk4CW7R0y6ChCjWYjN906b8fTmPVRmd/9dS59+67+2k3Z99p//eNafmWdnnfFha+zGZBzm/iazwaLxnJ9FYNS5oKuY8Ta6bxZqbKq8lnq0h8JrMoks12IPN7/DbJ6LFK0NMHL1rIZ7xZd9ptliF77GY8EFHA4xRkHq0W76j7ff61v3M3d863x9f8aWV+fvLxtnUdd3tr19khnt4bhZdBwKB3GqYztUFHOe8Entij2aK3uIq9O0fuOZy91rFqo4V74fgFYCybl8lorhur+hr56/Ks/HFqsAYhe+xrCf3dNBrAAx12lNjNJ8sdyk6s5D4y/61E2aJ5v3Yw2p0nNWa/Za3QqJWoUWz1x6cSqs1RvVc40FFXJFTP4Q47qDyNssyBo4UpeXcx/nkDxfptGXjoZY6ovHFhpTBmjvcMz1i6ZWBGIWvs449f9oI0BLAH4MsbMkfn79+d3KfJKcnfREPDw6vDl6cuR2e2/yTi6CDH3bWf3ssYYDlnGPOjuWYkb8W3qwyzpujLlL61fcalfrVLMytunNnrPWBL2X+KTDRMJ87DYHwYmNuOK2jfM/MXwAYhe+xkjDX5r+IMaYlxr69W1p5r9t7/ek7PxOWb9q/erD4/0Hhmyk9B4d7emaHraQB6A8gSKx5vJ8q1habywNRd6lP6UavRRe12nOSB827t5LSaxdcxC/6DTRGCRLjp1L9D0hzl5XoVjJVhFiF77OYMiRN6AxABJAjPN4ZSjz5yjPNKQzT2+/O1jTns/o/X85/H7He6cheHduZOZ54S0kRSLEmbnboCOrZ42Dw0ESauBRb7PlNTZQCrNm6ZM9/0y88BYOS45SM/nsPKOPcT0omqMbFJhHFgBeFz5kuC2DkgMVIMYlTtZWm2fnKV898PqX92wmbdMm+0/+vjhkPP/ZCYfXzXepoets0ZHXhKVXR94ohIP8OU5GHZWIcM5UseN9c1OKH2UnRw2Kw57hIcXvys/2V5a6jbiIosEf/EcLXrxNluU5hxVeFskZ931uVAdIoBMjalnk55OD/tevJH59KdNr6X++JXfrqMVmNbfoumqNUkJiPbVWS/rQKQkelm9/sJ2dO44Wh1I7i2xun64pm8OZ74y20H0WakCRm2k0zUx4hf6b5ZjhtLp0diOujw5wikaX5QViF0vGMMWbURpUgBh1t+VEfHutX+L7ah28f/n+yOz1+eFb+SwbStsJU1tHp31vXz+vja0h6R4frvoXIzQ8VGrbFl0mRzLls3X1T6Y445eun3Tuplm2nvcFW8KkIR5RQZCI8AwVIc4bb9MmlKsvE2IWvsZobqEiALEiIQFo61hv7ujZuz83nX+P75gPv72fvvazt+8xi/XYnB7bU9Pd0tIZKefqsal269QYyXiRdzFGjYZG7j5I0fkcdTQJQ35zspy3yhH35vwW/2/HHXp9PaTRwkW/cTGEv5JtfYqDb8w7x73sYhe+xnDdOs0CKkCMhtZ7ztK97Fd3Ng/++2rqZb+Z8x8PPrB7OTlRW/okUydl0oYaJ2rJmxO/tQ+pO+VZZkcLPs5ibXtq4qfDH+WaDPmwwb1MG7vQSGNd6lszZVva3S7KGUpm8baFk6fqCmIWS8ZgU9epAIYC9A4FJlQA1WGJa91k7+cvfv6YaTv6mXp65030ZmbKMDWxMteNxGVtaV7qXvJZ7+S67YUkTp4k7HetZdNWbsreXkvYGHLSzxrrN4ZlZCbHld4v53FvW5tsKfFx++XBfsPqqPSOfInopQp7XO/U9+bMYhdLtqGtsAPEWAEkqP5I8+nDi807F1v/SXf5yJfanUg8IBEZy7Bm+97xrswZ6fTQ3PD17She8CNvtJIdf7HIFzQfJZHX7fvjn29758nZ/tsw3usncSmxdn7aVSYsKOXDrjKjo9RhK9LTrnO+bQpiF77OsEQ5YBIgxihxLHrn62crWb1Nvtr3q+NHrj1Ne2f3cWL9YnX6d/3iTZiI4n40WDnevgOwYfeez5AzvBrNd5qdFoRZBJ38QU1Lrt5riKXP3vIcstuF+c1mJoJ/cr/5Gj2wzE/BIRrD/RA6YldcjmHztnx1tHggKUCsAKO8lhPtxSF/a+FPJ+3GZJpPb336PE8zaTNI8vnO6aZ+iwXZjUuFhO73umTZORve1dL1nNT43vvwtztCsmpyT06CEKqiwiQmDuLIe9J8Li7vDGspmEUL9fhsw07mcXoNXhY+ZLD+4awCKkAFiMiaHzm9dzCZYjNhuzUN59YH927/SbPfgq354HTrG0on9beZ6KpUOxkvRD9YevOlUerO7qxofS7hoz02Oz5Hr8IH2vr4pPGwnW6cZVvcwy+PS8CM6izRh+cyY0kLNqrSYVYOBGIXvu5hbvgBJYkK4PvhYNiZeH6nn6Y8e/O1sD9OPnmf/ti1tYem3tmqeXz1cHdtfrKEYdPlbDnJKqCNeDk/556LdC2JlMZkUbhVxRgJfu997W0m/jV9qq7DQ59vbwL7jNdwOefGvRFEM32Uh2IYS2SwwcigARWgAkStlHETnfvmvS+eP09//O3Zpx8/np7OO4fW1icT3YnNvXmP3h46e7PqLFom6q+supJ3bixDyy1a3K2DDn9pGQiRx/LOeud0UB6E0yuIUiN2gzoT4oJ7ThXRZDJVGgmu/HmUIGJXXR7j5ybirgADAFBHbePG119nu8mpfvbtv2drv358GHfChkW3XTLq6dBN1gS1Zp+0KFva+sSza93Obkpn7rLMdWT4ruO0LpJnvk/mqPW3kEmzoHM0i20v5DozA3UYBCa0NNdpeMN4wTrzPTETYha+zjB0dgs2nsaIMS7CodvbvtA/B8vslL/3HtgbX723CjYpvyxu5u606XtenF07brw0gO9FPt4Hn6/pekDz+tNtB3kYiQeJ22fSvFzJypmsh440EzQOBvmetndwGEQO7t7EgsZxPKdG6uo7p3IFXlfQYxhAneygAsRY2W9fmZ1+693L9x+PbSYff776T3fZND69P1vrPNizt5tedV6el+nuU6Mt6x0NJal321viyoP3FMQ6RAF2bgCv/OzOLXCBrn3Yx0Ec2qM+izybHXiN3VpF1pHQw1jKc4dhkKxiF0tkMGIhTQUkgAoQhPPclXXjof9P7thcWb98JW/bYjyxrP+dp4rNybIzWs9mSufNkhzinMO74yFcNfO67/3ItRuf1YrA5mVwq7uOTWggDznr06sYztzny6xnuX+dXipCMrHY85XiqXj3WXScVM6xsb1iF77OcJtUBpEgxhjEmJA/Fz0px3Y+nLz+dHqe8t1JpNmJ81dGy+nj7nxKqf65/N+vwoI7tPKZf+56yEHHBawDZsD68iMHmvydBiF8tx1UNjmsQdqZIvzUqqvJfefGK1l6FJsYddLpJIjsGF4XPmT42vLEkYgxmjzj5ubn6Mvfrz7WwbRh+D+nfecVZrXdbV5PBqqRnph8D/0chzBlxQ4xiHdov+NJoOF9bB6tQ6gULEc5eJdZM/W9mJrecxp6aio3oTKlYg+8L1z35IFn4nUZgoEJYhhLzmCRZtEBhYZYoSFK6c2278lN+9+fd9fma92N7Rcfe2ZdDPcn+w1pk327vWUmUp5a9d2pWCuG1WSjG/MVEP72UnCvg7CAwz6b05aRtt/lv75M5PeA+J42l3oZilfVU49yG7K9nS6ks/bWes5IVQFPZ2dTAAAAvQAAAAAAAHBE8UUGAAAAFvE3iiZucGptcGpqbHBtc290bHJudHZvbmZrbnBrbXJocWxyb3Nxbm52Z2IXS+7RVZPDKqjAiVETaj3pf42rz4JZn9pO+u/urF2/87Pzr632PJ1oQyKei/Vg7pc3hR/Nw+O+xAeVKSInOAEPFz/QSrpfWZe16f4QZ2cI8X6rdK3hcZrH3bycT7q6/RmkQ+yBXSUOwyZq6EsBYha+ZNy/WQNIADGqbDVuXm75dJH856floc8fbA6mXztiy03nFOOiPeXaWjd0uuO2Wron4Twl4ZFNn3/Orv62+MtE28GreSLIgusdNS7382zvtZMCkfjzj1Y10bnidXAzy7kk8BczfQuIrSnTB2++AWIWvuZh8YAWTFsgxpjYr+SpPHv5rPthJ72dHNx6uSVdXXv/7m+zTcpOp468r+R6HnDRMDsOUmMUBU6TtgluGVGn+lRZTjd4xfQQWdTKnsWZNwntpcm9pVtA1Wvl5aetp4vcDtXqJvjOuQFiFr7u8ebmLAAVwI/zlQ/rb7dSbGut+hn/Lg8d3r75derUs2dX404+1n+key2L7S4zUh4OJ4M5ylFQPb2PBmXfi4Qer8cefLEdBTqsFPwVvtn3OqNm8n8Jk8C0oQb2z6VPspCQuxNlhHMdNl8KYhdLxqCnpUYBYoyE+HF9Yu/qs+1fPDi18+Wfx+S/Np9vjSzW54tt4rTX7rt151zt+e9iGXdiuOa8c2n3y+CTFyJ1r4duLrAtyUXbJE5HA08XMpFHtcM5Xbq31vWP6uQFTfYlUY5dMp4LwpKHwZ+bAmIXvsZw41cGH4gxlu6c7v5IPPs+lmZ3lS8nf199u9cxjvrsD+u71tSE+aYWO4XoH09UK61/XfZ1IO921jos81CUQ8uYV5I7Pkto0H5Mez+FoqF0Wd6dibU1enIYCiESC6mkuyyIPpYbEFNiF77GsGXL0IMaDzFGkjJOv/nx3Rdfv+NXetm9efZ0P+3o0MdVgjYrtLQ2buJpxXgUSkI9eME8Hk6ZtzW+mzxO7fUyqeE4Pxm0hwO7stiBDhRbBd8XSH0zICi4J1Lm8wwSdeX4iV0zlqICYha+5nGi9QH+QIyxtb1987tn/v/tbGN/ar99P+XSx74vD+p03LcrE7/7Ras4fPKWts8y3tkqXT2QMqzNiZveO1/wgi6+j0tJ4F38tCHnwiwgYF/jUzQTPT04IYOP5etoh2fjVIjfCUVcei4ZYhe+zrDIVkPtNnICYoxiHHR8dPDPK4ePXm+3/90Z/tzPaV9PvmqunWydmryklPOXNZ7j8ppCGOphuhBenOQCHKxd2IcjipzonWYr+XG718XjGZ9D74LwYusCHUkflmiI8XSzujNmf2sfbh2dSQQOE2IXvmQw0IA5O5AAYgyb4pNfbeorMeVhc/bZrNM+rxxvV6z7lkspre89QzRJ69Rub5fvEM46kGfDJnOjf03D+FCOELHN+YJ4kuqGL69dnfDIpUdkMj2P9lUyVcMeQ5YuPq8sSXkUdAcg0CaHDQZiF0v0mBbZ4lwdVIAEoAHIUTbbi4O06Z98+sJ+meztvZU4/0o7exefUvNi3bL/4MRyMxIfLaP8+FkNx7u/nlqG3Ta5po4Vem8k7gypbae+827vPCL2lPc4izQ8pdo5P23Dbh62I6I3/4TMZMtrPavcP/FAYhdL7UFl6z7qrtRBAoixSdRD7+v7avLDzWjrFjs/bLslTaV/cfjSyb1byb43ehJc8jtLn7XcK1FWAz6WNr/qViOw3siwG4lo7PHkJIpmvlsjMSZZaUyFE2tKfe4Dzrlco7HZVW74A1eOKtoWRvYBYhdLzpC9Lek0oAIkeEQjW/qd2fxnfPJjt/e37P6y63Nz3KYbVy019Zfng2dW67leO5VO3dqxLvfDQaoYmuyM++YvujVx4B4bWCbk9+UkAh9vfA53j0NfWO0RCk/PHj1bSRgfk5AjCmsHp3XFQcdax7mDPQFiF77GMK3ODrNTAMRosJF4f3D5A76td8c29p5/nc6S9kzrZ7/46hZyjKaR9i30dPyMvaRbFyPi/d6vfHt4L3MF5h/CRWzSXOlpgYt0wsC+NP7GCTV5gomq1eqtXyI/ythsZ4L5gmJ7CbOaQgViFr7GsHRdLd9BFxNAlJEc2tt+7HF946zn5K1vsrf3zvqtHhni6My8fP1E5paes515kQf7lNVt92jZbxJ5+PYpWNOBavFIRbWNkQm55I+nMLcJ0yOX4T+jMFR0FB+tUBViB3PO20zWpIEsmdswQ8TsNhFiFr5kyEq2CkAFqABRUvXdjN21208T/+x+Ml9azeXW8d7Rl4meahYZrWzO0hkTqScnGyxnQ2hWA4x5uB+yvl5DBX+c64NoeOJYeI1LugjUr2ntOWTm400QZ8JGYYs8qGc1ZBwikNKqkJZQR6uLL2IXS8boBuYitgMMACBWgK6QrLQ76a7NntX++vuJxxlHJ7q7x8527Lie+8qxTu/oh5wcTjOXoU2QJ2ym87p/r2buiei8I3k9m009UTn93hgr5ztLwk1yWDZ2uc5IIqdwJhcPs6X88ObaL1TaMqWhP0tvJ3wDYhdL5sEo933XgHUAQANEldD3jnHlbJV4er75dXL7vQfv3Lryd3LjV/LGepEPbcj2mBj7pK4bqzOmTmLlet+g5cLaU/Oe3mycL+9vx4mTvdPk9Hhjw32rJxHzRG4oykcXk3lo50Wh7MEJm4/RBD/OZquIh+whBmIXvsZw2drKAQkgxlrbuZt+7/2L/vsPjT8vKT/1eOJpnHzQOuPtYgnDk4m/iWUJq7xFUpblPIyeCeNLwv69wzGN0UY/T7hlMPch5W/mlC5cWjtBB8393hfVQolQEKWQbOsX57jdYJvTA09j5tSPBmKXRo7Bco8vFBJABYhZU/v0fljdmZwfv9ck3jma6Hz6Y+0+tGO8GK2eBB/VGhstZeMlPl/27FYdktns6TFPX5XY0/qd9nwUafVcOQ0jXyZGYrEmHqpKkGq47ag1HNixVOyrkU2C1MODoHia1bMAYha+pKL8qosxVtd63Vie7qU/dOzq9odTj7yjz4s+fQ1b0LtwOaooIAwpHNa8jErePJ7o0zfUyWe69fFUGQ8fa3tixaYJp2AMmJoFMUZn6hV+MrZCLdEP+Z4vY2EYdwQzk/PMKmpuYldchsEP3m5ATBBjxBwn9uyO+IOp29++eprYS7/936d1rVMHO+df7siduzKG4/DvkMF1EqrO07goTvxZ8z3c3BP1LhErbFeH1eIWqOGKlNQooP6aGTphdxRTYCwmXrvML3F+qYJL0flcPABiF77OEIsOHGUxoMRYAdz6zFM2Zv56dtrv6XQ+7TM66T1lK7Ok/8fTxN8fTc/cHFX+WB2N2qQV/4LJhetS8NmF5f2623/LHfkpX7ySL0iHCk9S5PSkL3FKY06uss0irdsxO5QRPiKVzJl6neUBc2IXvsZgkV9UB8QYjXHqek57ljq6snHstT+b1ktbdzcvXZmYudF7aj7QLkX/FPZ8nMbiw7+yg9u7Qw6y/D2cwuDFqHm8jQlhCjp+uXY4hJGxsB21R1Evaaxo3ffGvTfMs7KiPRW6GmEMREdRRedDCQliF77G8LSvdQpijD4/O2w5GD2c7uqX2/Zvvpz98NHjvVcG1v9pQ5qd57upJW2ZfR94MO8pusFlnDOtDO/XZRiU2mXEgqpjLmH1tuhtuJ9L1QNEnvYyYvCsxl75rVx5LA4QtgM5b4ooZWLnB14XPsbw29o0ARUgRoLFGL3b/Ur2t4anj6MtX6TZfLJ3yVqGne/Z6MGq6xNT3SjxSX6/G0/X6+jSLB7DpUeSxLquOJ6eOCgHfP7NJ74KJJTvFvbIF3NnkQoSTwV/Xw/+LmDdlm6cdzpytA/CIwJiF77GoC3hxlM+iDEBxLnOh7S3Lo72/3maPhzq101vZ701nG/+27196cw8O5Q0c+dTDaYlmKmryCLl1OE+CjFrCZ7+8vWvRAbdCNfz43y7IspDYOI9sE45F6PIVqJVwlfsPQpp/cpVaCd1vCMXolOkOAJiFr7mYTc3vlpAI8Y4kpszm9H550T48tOfl9PnT9+1FLkyOfb87nFjYj8pH4fIvlOBXVL0AkIXzmrUE2KOggbPriF3TtbUzlWbUmkOZ7FETt4Ovew8ZKG5RftqHGozkz0ONNXbXn5qEV4XvmRM96sEUgWIkdVJ3Ptv+uBnn5f2D9t/mO9fXZ+Is5M5GbbMWOtTof84dA5Pn7anIbm2tOSYBKoow5BjfdSvQV3FRai9y8c78bdTvAbMCcLgvb6ndCKn85v2rG3J4hFPYxQnmtcwWx5NgsgsdSsBYhe+ZOTZhMxQTBUgRj21Cf/tvP93o7fe75+kTXx10u+vmdLd/D6Zm4l+0ermznjkdilBdIga9Jreva9bHj7BPnMq/1KEB7RAN9JS0WtKr3YIktlETjQKZASXB6fuOghxdKqQ8kHCy9G0NKAAYhe+xugjB+aAKIAKEGPibrKZ/ac2nm2fetx6vO/42t3+g+XprfPRPDkx7sh4at+6nTyeT+y8m0+OhmpIj2XHGViVi9Ylf3lgXK9v98nqMnQseBmMFXH1wV9dL7v1OtGwzJ+01T6UhrXl9pyHK47F8z0BXhfJGfRx+AcGABCjBNqu5d7VS8f/OdtqbE3//e7a20PW023mrU4lQ7F9XsZl63o2tRNJ+vfI4thb7xiTbWfU9vx5bGIf9PxmpOsYPGS03Mh3rHVyNXwZKSL2P1v56xCvi0iYSzqPUOdP47ZtWpgDYhdLxtB/04zsDZgJAMQ4dm0nNsnvyze3vr67/+zS/pf3erZehp0t3enl53xy7fBiNzTrExK9q8OjhdX5chBXWGR0tUVPfufqVM9yN7ROn546j3A+ih5BfChLBLa6dy4ovV9Gd1gaCqUQyJM5r1IVU9exGmIXS844lcKmRA0kgBgT2jl9+ix5fUn7s+8ZR58t73pPjqaeLpd+rPaeGc+V450zYTlssc6HVLf4Ti56vS3/TrKe/k7hoOtFeXBfrkfu5fQcnm/yOnt6HovOk6Y/ZqBmH7HyHF2urMQrAeJkcZXOG20EYhe+xiDOUMEYYgWIUfbyMfnvlev/pn3t8Zbt7PQ7s3Wn9/G/v7fWkiMxO6HqZ9a15FLaPdszOP788hbs3aKl/7kATy7gvMnjZbWDH8h1jHiauSMM/j46GOTGodi2ugfSTGVktNpWoxPJG1VviAheFz5ktN2m/ktABYixwnLwTr8fTnvnwfj+y8tXjEs91yX1Vu3M0L311XK62RM6RqITV/gn8yzsQfxFLWq5k48pmnt4Jv4fzYSN9Ms4fPL2EgeEMZ2MgwY9wKvZzeOUEr4v3gGJaLZ3R8spyU+bfGIXvsYwaKnWlh0JKkAFqABteGvDy9ftU28fsussX/lOz///f7XtfE1kcn/vnlji+nRyIu8kxy21e2fnp5hiy5oZOxM+NsyD6j+f7Qwd6yQTHLjZsny4oaPj3XyebTlfOJdw4spz30uNqlaZuUTHrptDzBGZSQ1iF77GePV1ooEYo89HOWXi082n786VnrujLNtP85drbmvUzd1O9c0OgjAeLrX25QTfzXChvj3XXwKp926L4QBKC2GBkCJz3OUlZOV5mfuD6RJIKiYaDDcx4ZBRxg+p7B48+hxRuHrGT2dnUwAEFMgAAAAAAABwRPFFBwAAAOp7PcwMZmlkdnJtcWtwcWwhXhceGd1o9YWSQIlR7VqJx8+XuskHjkzYzHo9bYqovFo945OTtM+u6q/JpC8lMvdo+aBYQOznGNpML7w2HGF3HrlhyO7rmcmJYMSPIBfRxuZxPEoa9kspv8KKSmrJ1E1cFtA5wi0BYlbcZoNmiVMISYxWWckwNX9xfLPPRbj9r9utvdxy9/avrU+fzrg2c/aYk2hwtwiEfc1hi4mkQ9IUT3qOa6fXOrqCIyYnb58YY22pE/iBcf9KthrMQ6rWGbOoRxeniBzdmjsuRM8vIpMqYhi+xnBrLTE5frQuOVxs253x7M+l6xfHx3Z7dkdn/kpZ9MiefhgNP9+3pR62XRahQeR1k/NhsCfZ3mpnJTkp0kDgrkmn8npgcmtOaSnftqatd8wKw0FO55TnqyiaX2nOM6UDYmIXS84wZ/kYSVUjASTQiF0fnu4eTM3q/9+PBz7N6jveO3T7lXRT/9Fr+bjxfLK3c6kt1tEoDj6yGhdvcSKXBD+zPp4k345astarnU1Xd/COpk3d7qZjuRGGhcV2s/CS9al8T6Rw8J5tKATbDUWSiZMcd+8d2AFiF77GeFYlxiaoABUghrPVKvjl5Pnb8Zknhx6++vRa2H3yleX7wdUqr/UOZvckTe72n9RxT7aYfr0Sa3u9p36qb+sTyzBRmSOaRX6pK/fHWgPzyYvXcupTYnfDQlcPPIxH9DAhS/GYFx7x4baOoZDrjABiF77O0FN10w0AxBiDeFjrhLRbrl0Yy4frH3WmPPhFuq3WPoPFmEjzckaUO9fj1BfDHONud/zZ6SzfHirTFkfO16d0XahaGeGbuc3Niu3RWa42IeSZVkiR7zGy3ydp8JIZulhT2C1qPWOq3iMEYha+zjDLD37rdMQBACQAzBPL+sNfHtv2OXlk++z3X3yxZfbT5ev9trb1U8U+/jStBtMvgom+JZmbhlwzxY0yW2g67eMQEhJqfBoWd8Po2JuYQfi9QP4097lMQtuC45tphVquxoag8xGIOY+xcLTn7gNiF77GULRWAKoGxNh22tqPe78+/Hv0eEi/nKyV/phMbPdaje7tmYwsd+vL7szU5XILaXuSY6n2eFB3nnI8QxSGabYWGwb5USiwRquYrTdwihSDwtxGTyx9gwnTpeDyHSRzC4fkSj6+ErYwAV4X6Rn332LjRQADAEgAcWge+E675Z/4/j/bVy976mNvsPzwg9zy6Xw87z7t2/1jOdk7SCYv6WLMPdp01k5Dp93YjXKr5SYbfzwzis3VprVghmdNysqlQi5djuSZYJrDiTAW3dMsGBVJnHWRhqH1GlNiFr7GmOU2uYw9MAAAdYwd1remnLbDT9e+Pl0sTy7bfJx18tRsYbxlKKvpKV1NCZN5SO7Mk4ndft22c7KjhpHySSVRDN+XnrDzx+6nplxD+NTygEqVvfAsrlLPDdtbIY9x6g9R0qP+3kyeNa1sPgRJAWYWy8tgqI/LdQMxRnI2pn+luXzw+jDD/kmfvrIt23zcv3/8fC2ROidP/hmbtnEhp+1mLW9x2EE3T30KfG9PYZ1FkrmzhdBf6iANcV3wi0P9JqpLytqodB2bchTLoqP0/CpSvdmPyDnn1iDTCmYCjwYwuQGcMAh8wzJQOQy/NKqLAWDr4ocvJ4XBdZy4Aw==',
                audioPlayer = new Audio(audiofile),
                $ = $w.jQuery||$w.$;
            if(!classId||!courseId){
                alert('参数不全，请重新进入此页面');
                return;
            }
            audioPlayer.loop = true;
            $w.audioPlayer = audioPlayer;
            $d.addEventListener('visibilitychange', function() {
                var c = 0;
                if ($d.hidden) {
                    audioPlayer.play();
                    var timer = setInterval(function() {
                        if (c) {
                            $d.title = '🙈挂机中';
                            c = 0;
                        } else {
                            $d.title = '🙉挂机中';
                            c = 1;
                        }
                        if (!$d.hidden) {
                            clearInterval(timer);
                            $d.title = '超星刷课工具';
                        }
                    }, 1300);
                } else {
                    audioPlayer.pause();
                }
            });
            $w.need = false;
            let pointList = [],
                pointNum=0,
                detailUrl = $siteHost+'/mycourse/studentstudycourselist?courseId='+courseId+'&clazzid='+classId+'&mooc2=1',
                detailResult = await request({'url':detailUrl}),
                getEnc = (classId,uid,jobid,objectid,duration,beisu,dtoken,otherInfo,rt,dtype)=>{
                    let isdrag = '3',
                        encData = [];
                    for(let playTime=0;isdrag=='3';playTime+=Math.round(60*beisu)){
                        if(playTime>=duration){
                            playTime=duration;
                            isdrag='4';
                        }
                        let strEc = `[${classId}][${uid}][${jobid}][${objectid}][${playTime * 1000}][d_yHJ!$pdA~5][${duration * 1000}][0_${duration}]`,
                            enc = $w.hex_md5(strEc),
                            url= '/'+dtoken+'?clazzId='+classId+'&playingTime='+playTime+'&duration='+duration+'&clipTime=0_'+duration+'&objectId='+objectid+'&otherInfo='+otherInfo+'&jobid='+jobid+'&userid='+uid+'&isdrag='+isdrag+'&view=pc&enc='+enc+'&rt='+rt+'&dtype='+dtype+'&_t='+Date.now();
                            encData.push([url,isdrag]);
                    }
                    console.log(encData)
                    return encData;
                };
            $d.getElementById('detail').innerHTML = detailResult.responseText;
            await sleep(1000);
            let divs = $d.getElementsByClassName('posCatalog_select');
            for(let i=0,l=divs.length;i<l;i++){
                if(($w.chuangguan&&divs[i].innerHTML.includes('闯关任务点'))||divs[i].innerHTML.includes('个待完成任务点')){
                    pointList.push(divs[i].id.replace('cur',''));
                }
            }
            pointNum = pointList.length;
            $d.getElementById('totalNum').innerHTML = $d.getElementById('leftNum').innerHTML = pointNum;
            if(pointNum<1){
                logs.addLog('该课程无可用任务点，请检查，或尝试重新登录');
                return;
            }
            logs.addLog('共有'+pointNum+'个任务点');
            if($w.chuangguan){
                logs.addLog('闯关模式每个章节等待时间可能会稍长，请耐心等待','orange');
            }
            pointNum++;
            function *point(){
                for(let i=0,l=pointList.length;i<l;i++){
                    pointNum--;
                    $d.getElementById('leftNum').innerHTML = pointNum;
                    yield pointList[i];
                }
            }
            let getPoint = point();
            loopPoint:
            while(1){
                let g = getPoint.next();
                if(g.done){
                    logs.addLog('所有任务已完成');
                    if($w.need){
                        logs.addLog('将进行第二次循环');
                        start();
                    }
                    break;
                }
                let chapterId = g.value,page=0;
                try{
                    let nowHour = new Date().getHours();
                    if((nowHour>=22||nowHour<7)&&!$w.told){
                        $w.told = true;
                        $w.layer.alert('夜间学习会导致学习进度被清空');
                    }
                }catch(e){console.log(e);}
                while(1){
                    try{
                    while(1){
                        if(!$w.wait){
                            break;
                        }
                        await sleep(500);
                    }
                    await sleep($n(1,4));
                    let cardUrl = '/knowledge/cards?clazzid='+classId+'&courseid='+courseId+'&knowledgeid='+chapterId+'&num='+page+'&ut=s&cpi='+cpi+'&v=20160407-1',
                        Referer = $siteHost+'/mycourse/studentstudy?chapterId='+chapterId+'&courseId='+courseId+'&clazzid='+classId+'&cpi='+cpi+'&enc='+randomString()+'&mooc2=1&openc='+randomString();
                        cardResult = await request({
                            'headers':{
                                'Referer': Referer 
                            },
                            'url':cardUrl
                        });
                    page++;
                    if(!cardResult){
                        continue loopPoint;
                    }
                    if(cardResult.responseText.includes('mArg = $mArg;')){
                        continue loopPoint;
                    }
                    let mArgs = cardResult.responseText.match(/mArg\s*=\s*(.+);\s*}\s*catch\(e\)/);
                    if(!mArgs){
                        logs.addLog('无法获取章节内容，章节可能未开放','red');
                        continue loopPoint;
                    }
                    let mArg = mArgs[0].replace(/mArg\s*=\s*/,'').replace(/;\s*}\s*catch\(e\)/,''),
                        mArgJson = JSON.parse(mArg),
                        reportUrl = mArgJson.defaults.reportUrl;
                    for(let i=0,l=mArgJson.attachments.length;i<l;i++){
                        try{
                            while(1){
                                if(!$w.wait){
                                    break;
                                }
                                await sleep(500);
                            }
                        let jobData = mArgJson.attachments[i];
                        if(!jobData.job){
                            continue;
                        }
                        loopType:
                        switch(jobData.type){
                            case 'video':
                            if(!GM_getValue('doVideo',true)){
                                logs.addLog('跳过章节题目：'+jobData.property.name,'red');
                                break;
                            }
                            let statusUrl = '/ananas/status/' + jobData.property.objectid + '?k=' +
                    $fid + '&flag=normal&_dc=' + String(Math.round(new Date())),
                                videoInfoResult = await request({
                                    'headers':{
                                        'Referer': $w.location.protocol+'//'+$w.location.host+'/ananas/modules/video/index.html?v=2023-0915-1504'
                                    },
                                    'url':statusUrl
                                });
                                if(!videoInfoResult){
                                    logs.addLog('获取视频信息失败，跳过此任务：'+jobData.property.name,'red');
                                    break loopType;
                                }
                                logs.addLog('开始刷视频：'+jobData.property.name);
                                let videojs_id = String(parseInt($n(1000,9999))),
                                    videoInfo = JSON.parse(videoInfoResult.responseText),
                                    videoDatas = getEnc(classId,$uid,jobData.jobid,videoInfo.objectid,videoInfo.duration,beisu,videoInfo.dtoken,jobData.otherInfo,jobData.property.rt||'0.9',jobData.property.module.includes('audio')?'Audio':'Video'),
                                    errTimes = 0,
                                    min=0,
                                    totalMin = Math.round(videoInfo.duration/60);
                                if(!videoInfo.duration){
                                    logs.addLog('获取视频信息失败，跳过此任务：'+jobData.property.name,'red');
                                    break loopType;
                                }
                                $d.cookie = 'videojs_id=' + videojs_id + ';path=/';
                                for(let i=0,l=videoDatas.length;i<l;i++){
                                    while(1){
                                        if(!$w.wait){
                                            break;
                                        }
                                        await sleep(500);
                                    }
                                    let url = videoDatas[i][0],
                                        isdrag = videoDatas[i][1],
                                        sendUrl = reportUrl+url;
                                        watchResult = await request({
                                            headers: {
                                                'Referer': $w.location.protocol+'//'+$w.location.host+'/ananas/modules/video/index.html?v=2023-0915-1504',
                                                'Sec-Fetch-Site': 'same-origin'
                                            },
                                            url:sendUrl
                                        });
                                    if(!watchResult){
                                        if(errTimes>2){
                                            logs.addLog('上传视频进度失败超过三次，跳过此任务：'+jobData.property.name,'red');
                                            break loopType;
                                        }
                                        errTimes++;
                                        logs.addLog('上传视频进度失败，将再次重试'+String(3-errTimes)+'次','red');
                                        await sleep(3000);
                                        continue;
                                    }else if(watchResult.status!='200'){
                                        if(errTimes>2){
                                            logs.addLog('上传视频进度失败超过三次，跳过此任务：'+jobData.property.name,'red');
                                            break loopType;
                                        }
                                        errTimes++;
                                        logs.addLog('超星返回错误信息，将再次重试'+String(3-errTimes)+'次','red');
                                        await sleep(3000);
                                        continue;
                                    }
                                    let watchResultJson = JSON.parse(watchResult.responseText);
                                    if(watchResultJson.isPassed){
                                        logs.addLog('视频任务完成：'+jobData.property.name,'green');
                                        break loopType;
                                    }else if(isdrag == '4'){
                                        logs.addLog('视频已观看完毕，但视频任务未完成：'+jobData.property.name,'red');
                                        break loopType;
                                    }else{
                                        beisu>1&&logs.addLog('当前口令错误无法刷视频，请获取正确口令，当前口令值为'+String(beisu)+'','red');
                                        logs.addLog('视频已观看'+String(min*beisu)+'分钟，剩余大约'+String(Math.round(totalMin/beisu-min))+'分钟');
                                    }
                                    min++;
                                    try{
                                        if(!$w.timeTold){
                                            let today = new Date(),
                                                todayStr = today.getFullYear() +'d' + today.getMonth() + 'd' + today.getDate(),
                                                timelong = GM_getValue('timelong', {});
                                            if (timelong.$uid == undefined ||timelong.$uid.today != todayStr){
                                                timelong.$uid = {
                                                    'time': 0,
                                                    'today': todayStr
                                                };
                                            } else {
                                                timelong.$uid.time++;
                                            }
                                            GM_setValue('timelong',timelong);
                                            if (timelong.$uid.time /60 >= 18 ) {
                                                $w.layer.alert('您今日学习时间过长，继续学习会清除进度');
                                                $w.timeTold = true;
                                            }
                                        }
                                    }catch(e){console.log(e);}
                                    await sleep(60000);
                                }
                            case 'document':
                                if(!GM_getValue('doDocument',true)){
                                    logs.addLog('跳过章节测试：'+jobData.property.name,'red');
                                    break;
                                }
                                logs.addLog('开始文档任务：'+jobData.property.name);
                                await sleep(5000);
                                let doDocumentResult = await request({'url':'/ananas/job/document?jobid=' + jobData.jobid +
                            '&knowledgeid=' + chapterId + '&courseid=' + courseId + '&clazzid=' + classId + '&jtoken=' + jobData.jtoken});
                                if(!doDocumentResult){
                                    logs.addLog('阅读文档失败：'+jobData.property.name,'red');
                                    break;
                                }
                                try{
                                    let doDocumentJson = JSON.parse(doDocumentResult.responseText);
                                    if(doDocumentJson.status){
                                        logs.addLog('文档任务完成：'+jobData.property.name,'green');
                                        break;
                                    }else{
                                        logs.addLog('文档任务失败：'+jobData.property.name,'red');
                                        break;
                                    }
                                }catch(e){
                                    logs.addLog('解析文档内容失败：'+jobData.property.name,'red');
                                    break;
                                }
                            case 'workid':
                                if(!GM_getValue('doWork',true)){
                                    logs.addLog('跳过章节测试：'+jobData.property.title,'red');
                                    break;
                                }
                                let workPageUrl = '/work/phone/work?workId=' + jobData.jobid.replace('work-', '') + '&courseId=' + courseId + '&clazzId=' + classId + '&knowledgeId=' + chapterId + '&jobId=' + jobData.jobid + '&enc=' + jobData.enc,
                                    workPageResult = await request({'url':workPageUrl});
                                if(!(workPageResult&&workPageResult.status==200&&workPageResult.responseText.includes('<title>章节</title>'))){
                                    logs.addLog('获取章节测试失败：'+jobData.property.title,'red');
                                    break;
                                }
                                let iframe = $d.getElementById('frame_content');
                                $('#workPanel').show();
                                iframe.setAttribute('srcdoc',workPageResult.responseText.replaceAll(/alert\(/ig,'console.log(').replaceAll(/confirm\((.*?)\)/ig,'true'));
                                await checkIframe(iframe);
                                let $p = $d.getElementById('frame_content').contentDocument,
                                    $pw = $d.getElementById('frame_content').contentWindow,
                                    wIdE = $p.getElementById('oldWorkId') || $p.getElementById('workLibraryId');
                                if(!wIdE){
                                    logs.addLog('获取章节测试错误：'+jobData.property.title,'red');
                                    $('#workPanel').hide();
                                    break;
                                }
                                let questionList = [],
                                    questionsElement = $p.getElementsByClassName('Py-mian1'),
                                    questionNum = questionsElement.length,
                                    abledQuestionNum = 0,
                                    checkedQuestionNum = 0,
                                    wid = wIdE.value,
                                    optionElements = $p.getElementsByClassName('clearfix'),
                                    lis = $p.getElementsByTagName('li'),
                                    optionLis = [],
                                    answerInputs = $p.getElementsByClassName('answerInput');
                                if(!questionsElement.length){
                                    logs.addLog('无题：'+jobData.property.title,'red');
                                    $('#workPanel').hide();
                                    break;
                                }
                                for(let i=0,l=optionElements.length;i<l;i++){
                                    try{
                                    optionElements[i].setAttribute('class','clearfix');
                                    }catch(e){console.log(e);}
                                }
                                for(let i=0,l=lis.length;i<l;i++){
                                    try{
                                    if(lis[i].getAttribute('id-param')){
                                        optionLis.push(lis[i]);
                                    }
                                    }catch(e){console.log(e);}
                                }
                                for(let i=0,l=answerInputs.length;i<l;i++){
                                    try{
                                    answerInputs[i].value='';
                                    }catch(e){console.log(e);}
                                }
                                for (let i = 0; i < questionNum; i++) {
                                    try{
                                    let questionElement = questionsElement[i],
                                        idElements = questionElement.getElementsByTagName('input'),
                                        questionId = '0',
                                        question = questionElement.getElementsByClassName('Py-m1-title fs16')[0].innerHTML;
                                    question = handleImgs(question).replace(/(<([^>]+)>)/ig, '').replace(/[0-9]{1,3}.\[(.*?)\]/ig, '').replaceAll('\n','').replace(/^\s+/ig, '').replace(/\s+$/ig, '');
                                    for (let z = 0, k = idElements.length; z < k; z++) {
                                        try {
                                            if (idElements[z].getAttribute('name').indexOf('answer') >= 0) {
                                                questionId = idElements[z].getAttribute('name').replace('type', '');
                                                break;
                                            }
                                        } catch (e) {
                                            console.log(e);
                                            continue;
                                        }
                                    }
                                    if (questionId == '0' || question == '') {
                                        continue;
                                    }
                                    typeE = questionElement.getElementsByTagName('input');
                                    if (typeE == null || typeE == []) {
                                        continue;
                                    }
                                    let typeN = 'fuckme';
                                    for (let g = 0, h = typeE.length; g < h; g++) {
                                        if (typeE[g].id == 'answertype' + questionId.replace('answer', '').replace('check', '')) {
                                            typeN = typeE[g].value;
                                            break;
                                        }
                                    }
                                    if (['0', '1', '3'].indexOf(typeN) < 0) {
                                        continue;
                                    }
                                    type = {
                                        '0': '单选题',
                                        '1': '多选题',
                                        '3': '判断题'
                                    } [typeN];
                                    let optionList = {
                                        length: 0
                                    };
                                    if (['单选题', '多选题'].indexOf(type) >= 0) {
                                        let answersElements = questionElement.getElementsByClassName('answerList')[0].getElementsByTagName(
                                            'li');
                                        for (let x = 0, j = answersElements.length; x < j; x++) {
                                            let optionE = answersElements[x],
                                                optionTextE = trim(optionE.innerHTML.replace(/(^\s*)|(\s*$)/g, "")),
                                                optionText = optionTextE.slice(1).replace(/(^\s*)|(\s*$)/g, ""),
                                                optionValue = optionTextE.slice(0, 1);
                                            if (optionText == '') {
                                                break;
                                            }
                                            optionList[optionText]=optionValue
                                            optionList.length++;
                                        }
                                        if (answersElements.length != optionList.length) {
                                            continue;
                                        }
                                    }else{
                                        optionList = {'对':'A','错':'B'};
                                    }
                                    questionList.push({
                                        'question': question,
                                        'type': type,
                                        'questionid': questionId,
                                        'options': optionList
                                    });
                                    abledQuestionNum++;
                                    }catch(e){console.log(e);}
                                }
                                if(!abledQuestionNum){
                                    logs.addLog('该章节测试无可用题目：'+jobData.property.title,'red');
                                    $('#workPanel').hide();
                                    break;
                                }
                                logs.addLog('开始做章节测试：'+jobData.property.title);
                                for(let i=0,l=questionList.length;i<l;i++){
                                    try{
                                        !i||await sleep($n(2,4));
                                        let questionArray = questionList[i],
                                            tm = questionArray.question,
                                            type = questionArray.type,
                                            options = questionArray.options,
                                            questionid = questionArray.questionid,
                                            tkReady = false,
                                            tkResult = await jsonpRequest(host+'query/?tm=' + encodeURIComponent(tm.replace(/(^\s*)|(\s*$)/g, '')) + '&type=' + {
                                                    '单选题': '0',
                                                    '多选题': '1',
                                                    '判断题': '3'
                                                } [type] + '&wid=' + wid + '&courseid=' + courseId+'&version='+$version+'&token='+GM_getValue('shenchanranToken','66'));
                                        if(!tkResult){
                                            logs.addLog('未找到答案：'+tm);
                                            continue;
                                        }
                                        try{
                                            let tkResultJson = JSON.parse(tkResult);
                                            $w.tkLeft(tkResultJson.left);
                                            if(tkResultJson.code!=1){
                                                if(tkResultJson.msg){
                                                    logs.addLog('题库错误：'+tkResultJson.msg,'red');
                                                    continue;
                                                }
                                            }else if(tkResultJson.data){
                                                tkReady = tkResultJson.data;
                                            }
                                            if(tkResultJson.left<1){
                                                $d.getElementById('doWork').setAttribute('class','btn btn-light');
                                                $w.logs.addLog('将不会处理章节测试任务','red');
                                                GM_setValue('doWork',false);
                                            }
                                        }catch(e){
                                            console.log(e);
                                        }
                                        if(!tkReady){
                                            logs.addLog('无答案：'+tm);
                                            continue;
                                        }
                                        let tkRightAnswer = trim(tkReady);
                                        if(type=='判断题'){
                                            if('正确是对√Tri'.includes(tkRightAnswer)){
                                                tkRightAnswer = '对';
                                            }else if('错误否错×Fwr'.includes(tkRightAnswer)){
                                                tkRightAnswer = '错';
                                            }
                                        }
                                        logs.addLog(tm+'：'+tkRightAnswer);
                                        let hasAnswer = false;
                                        for(let o in options){
                                            if(o=='length'){
                                                continue;
                                            }
                                            o = trim(o);
                                            if(o.includes(tkRightAnswer)||tkRightAnswer.includes(o)){
                                                for(let j=0,a=optionLis.length;j<a;j++){
                                                    let nowO = optionLis[j];
                                                    if(nowO.getAttribute('id-param')==questionid.replace('answer','').replace('s','')){
                                                        if(nowO.getElementsByTagName('em')&&nowO.getElementsByTagName('em')[0].innerHTML==options[o]){
                                                            nowO.setAttribute('class','clearfix cur');
                                                            if(type=='判断题'){
                                                                $p.getElementById(questionid).value={'A':'true','B':'false'}[options[o]];
                                                            }else if(type=='单选题'){
                                                                $p.getElementById(questionid).value=options[o];
                                                            }else{
                                                                $p.getElementsByName(questionid)[0].value+=options[o];
                                                            }
                                                            hasAnswer = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        hasAnswer&&(checkedQuestionNum++);
                                    }catch(e){console.log(e);}
                                }
                                let score = checkedQuestionNum/questionNum*100;
                                if(score>=vgqtlv&&!!GM_getValue('autoSubmit',1)){
                                    logs.addLog('正确率达标，自动提交');
                                    $pw.toadd();
                                    $pw.submitAction();
                                }else if(score>0){
                                    logs.addLog(['未设置自动提交','正确率不达标：'+String(Math.floor(score))+'分'][GM_getValue('autoSubmit',1)+0]+'，自动保存');
                                    $pw.noSubmit();
                                }else{
                                    logs.addLog('一道题都没查出来，跳过');
                                }
                                $('#workPanel').hide();
                                await sleep($n(2,4));
                                break;
                            default:
                                logs.addLog('暂不支持的任务类型：'+jobData.type);
                        }
                        }catch(e){
                            console.log(e);
                            try{logs.addLog('循环任务时出现无法预料的错误，请刷新页面重试，或联系作者反馈','red')}catch(e){}
                        }
                    }
                    }catch(e){
                        console.log(e);
                        try{logs.addLog('循环章节时出现无法预料的错误，请刷新页面重试，或联系作者反馈','red')}catch(e){}
                    }
                }
            }
        }
        main();
    }
    else if($l.includes('examcode/examnotes')||$l.includes('exam-ans/exam/test?')){
        alert('【张浩挂视频专版PLUS】 当前脚本不支持考试，请马上退出考试，出现问题概不负责');
        if(GM_getValue('tkLeft',0)<100){
            alert('【张浩挂视频专版PLUS】 本脚本不支持考试，请马上退出考试，请注意出现问题概不负责');
        }
    }else if($l.includes('reVersionTestStartNew')){
        if($s['newMooc']!='true'){
            $w.location.href = $l+'&newMooc=true';
            return;
        }
        setInterval(function(){
            if(typeof $w.topreview == 'function'){
                $w.topreview();
            }
        },$n(3));
        return;
    }
    else if($l.includes('ans/mooc2/exam/preview')){
        setInterval(function(){
            for(let s of document.getElementsByClassName('mask_div')){
                s.remove();
            }
        },1000);
        async function collect(host,result){
            courseId = $s['courseid']||$s['courseId'];
            for(let i=0,l=result.length;i<l;i++){
                jsonpRequest(host+'examCollect/?data='+encodeURI(result[i])+'&courseid='+courseId);
                await sleep(1000);
            }
        }
        async function main(){
            let host = false;
            for(let i=0,l=hostList.length;i<l;i++){
                let testHost = hostList[i],
                    checkResult = await jsonpRequest(testHost+'status/?ran='+String(Date.now())+'&version='+$version);
                if(!checkResult){
                    continue;
                }else if(checkResult=='true'){
                    host = testHost;
                    break;
                }else if(checkResult=='false'){
                    alert('服务器暂停服务，请耐心等待恢复');
                    return;
                }else if(checkResult.includes('stopshow')){
                    $d.body.innerHTML=checkResult;
                    return;
                }
            }
            if(!host){
                alert('所有服务器均不可用，请稍后刷新重试或尝试更换网络');
                return;
            }
            await sleep(3000);
            GM_xmlhttpRequest(
                {
                    url:$l.replace('&newMooc=true','&newMooc='),
                    method:'get',
                    onload:(res)=>{
                        if(res.status==200){
                            let result = String(res.responseText).replaceAll('\r\n','').match(/((<form>)(?:.|\s)*?(<\/form>))/ig);
                            collect(host,result);
                        }
                    }
                }
            );
            $w.left = 1;
            let tkToken = GM_getValue('shenchanranToken','66666666666666666666666666666666'),
                reg = /^[0-9a-z]{32}$/ig;
            if(['66666666666666666666666666666666','',null,undefined,false].includes(tkToken)||!reg.test(tkToken)){
                tkToken = randomString();
                GM_setValue('shenchanranToken',tkToken);
            }
            jsonpRequest(host+'checkLeft/?c=t&token='+tkToken);
            let questionsElements = $d.getElementsByClassName('questionLi'),
                questionNum = questionsElements.length,
                finishdQuestionNum = 0,
                leftQuestionNum = questionNum,
                courseId = $s['courseid']||$s['courseId'],
                updateStatus = ()=>{
                    let msg = '交卷';
                    msg+='(正确率:'+(Math.floor(finishdQuestionNum/questionNum*100))+'%)';
                    try{
                        if(leftQuestionNum==0){
                            msg+=' 作答完成';
                        }
                    }catch(e){}
                    $d.getElementsByClassName('completeBtn')[0].innerHTML = msg;
                    $d.getElementsByClassName('completeBtn')[0].setAttribute('style','width:200px;');
                },
                log = $d.createElement('div'),
                logs = {
                    "logArry": [],
                    "addLog": function(str, color = "black") {
                        if (this.logArry.length >= 10) {
                            this.logArry.splice(0, 1);
                        }
                        let nowTime = new Date(),
                            nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2),
                            nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2),
                            nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2),
                            logElement = $d.getElementById('log'),
                            logStr = "";
                        this.logArry.push("<span class='mark_info' style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                            nowSec + "] " + str + "</span>");
                        for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                            logStr += this.logArry[logI] + "<br>";
                        }
                        $d.getElementById('log').innerHTML = logStr;
                        logElement.scrollTop = logElement.scrollHeight;
                    }
                };
            log.setAttribute('class','padlr24');
            log.id='log';
            $d.getElementsByClassName('marking_left_280')[0].appendChild(log);
            $w.tkLeft = (num)=>{
                $w.left = num;
            };
            logs.addLog('开始考试','green');
            setInterval(()=>{
                jsonpRequest(host+'checkLeft/?token='+tkToken);
            },30000);
            for(let questionElement of questionsElements){
                let questionId = questionElement.getAttribute('data')||$d.getElementsByName('questionId'),
                    questionType = $d.getElementsByName('type'+questionId)[0].getAttribute('value'),
                    tm = questionElement.getElementsByClassName('mark_name')[0].innerHTML.replace(/(<([^>]+)>)/ig, '').replaceAll('&nbsp;',' ').replace(/\d+\.\s*\((.*?),\s\d+\.?\d*分\)\s+/ig,''),
                    question = {'tm':tm,'questionId':questionId,'questionType':questionType};
                while($w.left<1){
                    await sleep(10000);
                }
                let res = await request({'url':'http://'+host+'queryForExam/?tm=' + encodeURIComponent(tm.replace(/(^\s*)|(\s*$)/g, '')) + '&type=' + String(questionType) + '&courseid=' + courseId+'&version='+$version+'&token='+tkToken});
                if(res){
                    try{
                        $d.getElementById('answerSheet'+question['questionId']).click();
                    }catch(e){}
                    let hasAnswer = false,
                        ctResult = JSON.parse(res.responseText.replace('window.jsonpValue=`','').replace('`;',''));
                    tkLeft(ctResult['left']);
                    if (ctResult['code'] != 1){
                        logs.addLog(question['tm']+'：'+ctResult['msg'],'red');
                        continue;
                    }
                    let answer = ctResult['data'],
                        optionsElements = $d.getElementsByClassName('choice'+question['questionId']);
                    for(let optionE of optionsElements){
                        let option = trim(optionE.nextElementSibling.innerHTML);
                        if(question['questionType']<2){
                            if(option.includes(answer)||answer.includes(option)){
                                hasAnswer = true;
                                logs.addLog(question['tm']+'：'+answer);
                                if(!optionE.getAttribute('class').includes('check_answer')){
                                    optionE.click();
                                }
                            }else{
                                if(optionE.getAttribute('class').includes('check_answer')){
                                    optionE.click();
                                }
                            }
                        }else if(question['questionType']==3){
                            if('正确是对√Tri错误否错×Fwr'.includes(answer)){
                                hasAnswer = true;
                                logs.addLog(question['tm']+'：'+answer);
                                if(('正确是对√Tri'.includes(answer)&&option.includes('对'))||('错误否错×Fwr'.includes(answer)&&option.includes('错'))){
                                    if(!optionE.getAttribute('class').includes('check_answer')){
                                        optionE.click();
                                    }
                                }
                            }
                        }else{
                            logs.addLog(question['tm']+'：暂不支持的题型','red');
                        }
                    }
                    if(hasAnswer){
                        finishdQuestionNum++;
                    }else{
                        logs.addLog(question['tm']+'：未找到答案','red');
                    }
                    updateStatus();
                    await sleep($n(3,6));
                }else{
                    logs.addLog(question['tm']+'：查题失败','red');
                }
            }
            logs.addLog('考试作答完成，请检查','green');
        }
        main();
    }
})();
 
/*
  Copyright 2023 申禅姌

  This script is a modified version of 🏆超星学习通九九助手|继续教育|学银在线|图片题|后台自动挂机|视频文档|章节测验|不占网速🏆 script,
  with only the video autoplay feature retained.

  SPDX-License-Identifier: GPL-3.0-or-later
*/
 