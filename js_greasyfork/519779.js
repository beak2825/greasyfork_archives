// ==UserScript==
// @name        超星学习通泛雅刷视频软件，打开即用，后台刷课————全网最牛逼的后台挂视频脚本，🐂🐂🐂🐂🐂🐂🐂没有之一，你用了不吃亏不上当，快来快来看一看
// @description 超星学习通视频后台挂机，手机可用❤️❤️❤️请看下方使用说明❤️❤️❤️
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @author       李硕
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @icon        https://scriptcat.org/api/v2/resource/image/4SZfPriSlLHYLZDn
// @run-at       document-end
// @connect      sso.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      fystat-ans.chaoxing.com
// @connect      api.dbask.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @compatible firefox
// @compatible chrome
// @compatible edge
// @compatible Safari
// @compatible Opera
// @compatible Maxthon
// @compatible AdGuard
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://update.greasyfork.org/scripts/518483/1489073/md5%E5%BA%93-666.js
// @require https://greasyfork.org/scripts/456170-hacktimerjs/code/hacktimerjs.js?version=1125728
// @downloadURL https://update.greasyfork.org/scripts/519779/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%B3%9B%E9%9B%85%E5%88%B7%E8%A7%86%E9%A2%91%E8%BD%AF%E4%BB%B6%EF%BC%8C%E6%89%93%E5%BC%80%E5%8D%B3%E7%94%A8%EF%BC%8C%E5%90%8E%E5%8F%B0%E5%88%B7%E8%AF%BE%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E5%85%A8%E7%BD%91%E6%9C%80%E7%89%9B%E9%80%BC%E7%9A%84%E5%90%8E%E5%8F%B0%E6%8C%82%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%8C%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%E6%B2%A1%E6%9C%89%E4%B9%8B%E4%B8%80%EF%BC%8C%E4%BD%A0%E7%94%A8%E4%BA%86%E4%B8%8D%E5%90%83%E4%BA%8F%E4%B8%8D%E4%B8%8A%E5%BD%93%EF%BC%8C%E5%BF%AB%E6%9D%A5%E5%BF%AB%E6%9D%A5%E7%9C%8B%E4%B8%80%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519779/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%B3%9B%E9%9B%85%E5%88%B7%E8%A7%86%E9%A2%91%E8%BD%AF%E4%BB%B6%EF%BC%8C%E6%89%93%E5%BC%80%E5%8D%B3%E7%94%A8%EF%BC%8C%E5%90%8E%E5%8F%B0%E5%88%B7%E8%AF%BE%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E5%85%A8%E7%BD%91%E6%9C%80%E7%89%9B%E9%80%BC%E7%9A%84%E5%90%8E%E5%8F%B0%E6%8C%82%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%8C%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%F0%9F%90%82%E6%B2%A1%E6%9C%89%E4%B9%8B%E4%B8%80%EF%BC%8C%E4%BD%A0%E7%94%A8%E4%BA%86%E4%B8%8D%E5%90%83%E4%BA%8F%E4%B8%8D%E4%B8%8A%E5%BD%93%EF%BC%8C%E5%BF%AB%E6%9D%A5%E5%BF%AB%E6%9D%A5%E7%9C%8B%E4%B8%80%E7%9C%8B.meta.js
// ==/UserScript==
//点击课程后的弹窗
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
!!(function(){
    const $w = unsafeWindow,
        $l = $w.location.href,
        $d = $w.document,
        $version = GM_info.script.version.replaceAll('.',''),
        $s = Object.fromEntries(new URLSearchParams($w.location.search)),
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        entrance = () => {
    let classId = encodeURIComponent($s['clazzid'] || $s['classid'] || $s['classId'] || $s['ClassId']),
        courseId = encodeURIComponent($s['courseid'] || $s['courseId']),
        cpi = encodeURIComponent($s['cpi'] || ''),
        courseName = encodeURIComponent($d.title.replace('-首页', ''));

    $w.location.href = 'https://i.chaoxing.com/base/settings?classid=' + classId + '&courseid=' + courseId + '&cpi=' + cpi + '&coursename=' + courseName;
};
        $uid = getCookie('UID')||getCookie('_uid'),

        request = (data) => {
            return new Promise((success,fail)=>{
                if(data.method == undefined){
                    data.method = 'get';
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
                    <p class="fl fs18 colorDeep">李硕提示你:该课程可以进行刷视频</p>
                </div>
                <div class="het60"></div>
                <div class="course-content-dialog">
                    <ul class="course-details" tabindex="3" style="overflow: auto visible; outline: none;">
                        <li>
                            <div class="right-box">
                                <div class="text-box">
                                    <p class="text1"> 欢迎使用李硕专刷视频脚本，祝您生活愉快!!!
                                    <div>
                                    <span class="blue-text">如有问题可点击刷视频界面或者学习通个人空间主页里的“遇到问题点击“ 按钮  </div>
                                    </p>
                                    <div>
                                    <span class="blue-text">💕💕我的好朋友们，让我们一起加油吧！！！ ❤️❤️</div>
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div style="height: 70px;"></div>
                    <div class="bottom-div" style="">
                        <div class="start-study" id="fuckme">开始刷课</div>
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

})();

(function() {
    'use strict';
    var $=unsafeWindow.$,courseList,cpi,layui,layer,form,clazzid,uid,ua_str=str_z("32"),script_info=GM_info.script;
    //请求封装
    function requests(url,data="",type="get"){
        return new Promise((resolve, reject) => {
           var headers = {
    "host": "mooc1-1.chaoxing.com",
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 11; M3121K1AB Build/SKQ1.211006.001) (device:M3121K1AB) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_" + ua_str,
    "Sec-Fetch-Site": "same-origin",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"

};

          GM_xmlhttpRequest({
    url: url,
    data: data,
    headers: headers,
    method: type,
    onload: function (xhr) {
        try {
            let obj = $.parseJSON(xhr.responseText) || {};
            if (obj.error) {
                layer.msg("请输入验证码");
                layer.open({
                    type: 1,
                     area: ['420px', '240px'], // 宽高
                    content: ' 验*证*',
                    title: "【*官*方*验*证】请输入",
                    skin: 'layui-layer-rim', // 加上边框
                    success: function () {
                        $("#code_btn").on('click', function () {
                            let code = $(".code_input").val();
                            if (code.length !== 4) {
                                layer.msg("不得不说李硕真的是泰酷辣");
                            } else {
                                 console.log(verifyUrl);
                                window.open(verifyUrl);
                                layer.closeAll(); // 关闭所有layer弹窗
                                let verifyUrl = obj.verify_path + "&ucode=" + code;
                            }
                        });
                    }
                });
            } else {
                resolve(obj);
            }
        } catch (err) {
            resolve(xhr.responseText);
        }
    }
});
            ////////////
        })
    }
    //////////////////////////////////////
     function dateFormat(fmt, date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const formatMap = {
        "Y": date.getFullYear(),
        "m": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "M": date.getMinutes(),
        "S": date.getSeconds()
    };

    const formattedDate = fmt.replace(/(Y+|m+|d+|H+|M+|S+)/g, (match) => {
        const key = match[0];
        const value = formatMap[key].toString();
        return match.length === 1 ? value : value.padStart(match.length, '0');
    });

    return formattedDate;
}
    /////////////////////////////////////
   function sleep(time) {
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            resolve();
            clearTimeout(timer); // 清除定时器以释放资源
        }, time);
    });
}


  
    /////////////////////////////////////////////////////////
 //刷文档的代码
   async function document_s(jobid, knowledgeId, courseid, clazzid, jtoken) {
    // 构建请求 URL
    const url = `https://mooc1-2.chaoxing.com/ananas/job/document?jobid=${jobid}&knowledgeid=${knowledgeId}&courseid=${courseid}&clazzid=${clazzid}&jtoken=${jtoken}&_dc=${Date.now()}`;

    try {
        // 发送请求并获取响应
        const response = await requests(url);

        // 检查响应状态
        if (response.status === true) {
            add_log(`文档 - ${response.msg}`);
        } else {
            console.log(url);
            add_log(`文档 - ${response.msg}`, "err");
        }
    } catch (error) {
        console.error("请求失败:", error);
        add_log("文档 - 请求失败", "err");
    }
}

// 示例调用
// document_s(12345, 67890, 11111, 22222, 'your_jtoken');
  ///////////////////////////////////////////////////////////////////
    //刷视频用的代码
  async function video_s(objectId, knowledgeId, cpi, clazzid, jobid, uid, otherInfo, rt = "0.9", module) {
    console.log("开始");

    // 构建请求 URL
    const url = `https://mooc1-1.chaoxing.com/ananas/status/${objectId}?k=&flag=normal&`;
    const obj = await requests(url);
    console.log(obj);

    // 获取视频信息
    const { duration, dtoken } = obj;
    const clipTime = `0_${duration}`;
    const ztype = obj;

    // 添加进度条
  $("#app2").append('<div id="jdf" style="width:500px" lay-filter="demo" class="layui-progress layui-progress-big" lay-showPercent="true">当前视频进度<div id="jd"  lay-percent="0%"class="layui-progress-bar layui-bg-green"></div></div>');
    let speed = parseFloat($("#speed").val()) || 1;
    let num = 0;

    for (let playingTime = 0; playingTime <= duration; playingTime += Math.floor(speed)) {
        speed = parseFloat($("#speed").val()) || 1;
        const progress = (playingTime / duration) * 100;
        $("#jd").css("width", `${progress}%`).attr("lay-percent", `${Math.floor(progress)}%`);
        add_log(`视频挂机ing... ${playingTime} - ${duration}s`);
        console.log($("#speed").val() || 1, playingTime);

        await sleep(1000);

        if (num % Math.floor(60 / speed) === 0) {
            add_log("视频进度提交(每60s提交一次)");
            const req = await video_p(clazzid, uid, jobid, objectId, playingTime, duration, cpi, dtoken, otherInfo, rt, module);
            if (req && $("#pattern").val() !== "2") {
                add_log("当前视频已完成,不得不说李硕真的是泰酷辣，李硕正在跳转下一个");
                break;
            }
        }

        num++;
    }

    let req = await video_p(clazzid, uid, jobid, objectId, duration, duration, cpi, dtoken, otherInfo, rt, module);
    console.log(123, req);

    while (!req && $("#pattern").val() !== "2") {
        req = await video_p(clazzid, uid, jobid, objectId, duration, duration, cpi, dtoken, otherInfo, rt, module);
        add_log("进度提交中...不得不说李硕真的是泰酷辣");
        await sleep(1000);
    }
        if(req){
            add_log("当前视频已完成,李硕正在跳转下一个，不得不说李硕真的是泰酷辣");
        }
        $("#jdf").remove();
    }
     function add_log(text,type="succ"){
        if($("#log").find("div").length>12){
            $("#log").find("div")[0].remove()
        }
        let date = new Date();
        if(type==="succ"){
            $("#log").append('<div>'+dateFormat("YYYY-mm-dd HH:MM", date)+"  "+text+'</div>');
        }else{
            $("#log").append('<div style="color:red;">'+dateFormat("YYYY-mm-dd HH:MM", date)+"  "+text+'</div>');
        }
    }
     function str_z(len = 32) {
    const chars = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
    let result = '';

    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }

    return result;
}
    async function video_p(clazzid, uid, jobid, objectId, playingTime, duration, cpi, dtoken, otherInfo, rt, module) {
    // 获取加密字符串
    const enc = get_enc(clazzid, uid, jobid, objectId, playingTime, duration);

    // 确定媒体类型
    const type = module.includes('audio') ? "Audio" : "Video";

    // 构建请求 URL
    const url = `https://mooc1-api.chaoxing.com/multimedia/log/a/${cpi}/${dtoken}?otherInfo=${otherInfo}&playingTime=${playingTime}&duration=${duration}&akid=null&jobid=${jobid}&clipTime=0_${duration}&clazzId=${clazzid}&objectId=${objectId}&userid=${uid}&isdrag=4&enc=${enc}&rt=${rt}&dtype=${type}&view=json`;

    try {
        // 发送请求并获取响应
        const response = await requests(url);
        console.log(url);

        // 检查响应中的 isPassed 字段
        if (response.isPassed === undefined) {
            add_log("进度保存失败！请联系李硕反馈", "err");
            return false;
        }

        return response.isPassed;
    } catch (error) {
        console.error("请求失败:", error);
        add_log("进度保存失败！请求失败，请联系李硕反馈", "err");
        return false;
    }
}
    //章节
   async function task(workId, courseId, clazzId, knowledgeId, jobId, enc, cpi) {
    // 构建请求 URL
    const baseUrl = "https://mooc1-api.chaoxing.com/work/phone/work";
    const queryParams = new URLSearchParams({
        workId: workId,
        courseId: courseId,
        clazzId: clazzId,
        knowledgeId: knowledgeId,
        jobId: jobId,
        enc: enc,
        cpi: cpi
    });
    const url = `${baseUrl}?${queryParams.toString()}`;

    try {
        // 发送请求并获取响应
        const response = await requests(url);
        console.log("请求 URL:", url);
        console.log("响应数据:", response);

        // 这里可以添加更多的处理逻辑，如果需要的话
    } catch (error) {
        console.error("请求失败:", error);
        // 可以在这里添加错误处理逻辑，例如记录日志等
    }
}

     //学习次数
    async function log_s(courseid,clazzid,cpi){
        let url = "https://mooc1-2.chaoxing.com/visit/stucoursemiddle?courseid="+courseid+"&clazzid="+clazzid+"&vc=1&cpi="+cpi;
        let obj=await requests(url);
        url="https://fystat-ans.chaoxing.com/log/setlog"+obj.split("/log/setlog")[1].split('">')[0];
        obj=await requests(url);
        console.log(url);
        if(obj=="'success'"){
            add_log("李硕提示你成功增加学习次数");
        }
    }
    /////////////////////////////////////////
    async function know_start(courseStartData) {
    // 用于存储课程知识点数据
    const courseKnowData = {};

    for (const courseData of courseStartData) {
        add_log(`正在获取【${courseData[0]}】课程任务点`);

        // 是否启用调试模式
        const debug = false;

        // 构建请求 URL
        const url = `https://mooc1-api.chaoxing.com/gas/clazz?id=${courseData[2]}&personid=${courseData[3]}&fields=id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isthirdaq,isfiled,information,discuss,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,hiddenwrongset,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,jobcount,expandreadstate,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,jobcount,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))&view=json`;

        try {
            // 发送请求并获取响应
            const response = await requests(url);

            // 调试输出
            if (debug) {
                console.log(response);
            }

            // 处理知识点数据
            const knowledgeData = response.data[0].course.data[0].knowledge.data;
            for (const value of knowledgeData) {
                if (value.parentnodeid === 0) {
                    courseKnowData[value.id] = [];
                } else {
                    if (courseKnowData[value.parentnodeid] === undefined) {
                        courseKnowData[value.parentnodeid] = [];
                    }
                    courseKnowData[value.parentnodeid].push(value);
                }
            }

            // 获取所有知识点 ID
            const knowlistId = [];
            for (const keys in courseKnowData) {
                for (const ids in courseKnowData[keys]) {
                    knowlistId.push(courseKnowData[keys][ids].id);
                }
            }

            // 构建请求数据
            const data = `courseid=${courseData[1]}&clazzid=${courseData[2]}&cpi=${courseData[3]}&nodes=${knowlistId.join(",")}&time=${(new Date()).valueOf()}&userid=${uid}&view=json`;
            $("#pattern").val() === "2" ? add_log("李硕提示你已选择复习模式，开始补时长") : add_log("正在过滤已完成和未解锁的任务点..");

            // 筛选未完成知识点
            const obj = await requests("https://mooc1-api.chaoxing.com/job/myjobsnodesmap", data, "post");
            if (debug) {
                console.log(obj);
            }

            const unfinishlist = knowledgeData.filter(function (value) {
                return (value.jobcount !== 0 && obj[value.id].unfinishcount !== 0) || $("#pattern").val() === "2";
            });

            if (debug) {
                console.log(unfinishlist);
            }

            const unfinishlists = unfinishlist.map(function (value) {
                return value.id;
            });

            // 开始处理未完成的任务点
            add_log("start 李硕要开整了！");
            for (const val of knowlistId) {
                if (!unfinishlists.includes(val)) {
                    continue;
                }

                add_log("李硕正在打开任务点中的视频，不得不说李硕真的是泰酷辣，");
                const url = `https://mooc1-api.chaoxing.com/gas/knowledge?id=${val}&courseid=${courseData[1]}&fields=id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)&view=json`;
                const obj = await requests(url);
                await sleep(1000);

                const cardData = obj.data[0].card.data.map(function (value) {
                    try {
                        return [value.cardorder, value.knowledgeid, $(value.description).find("iframe").attr("module")];
                    } catch (err) {
                        add_log("module不存在!", "err");
                        return [];
                    }
                });

                log_s(courseData[1], courseData[2], courseData[3]);

                for (const cardData1 of cardData) {
                    const url = `https://mooc1-api.chaoxing.com/knowledge/cards?clazzid=${courseData[2]}&courseid=${courseData[1]}&knowledgeid=${cardData1[1]}&num=${cardData1[0]}&isPhone=0&control=true&cpi=${courseData[3]}`;
                    const text = await requests(url);
                    console.log(url);
                    await sleep(1000);

                    let result_json;
                    try {
                        result_json = $.parseJSON("{" + text.split("mArg = {")[1].split("};")[0] + "}").attachments;
                    } catch (err) {
                        add_log("不出意外的话章节未开放");
                        break;
                    }

                    console.log(result_json);
                    if (debug) {
                        console.log(result_json);
                    }

                    for(let val1 of result_json){
                        debug&&console.log(val1);
                        let objectid,enc,workid,streamName,vdoid,jtoken,jobid,workenc,module;

                        switch(val1.type){
                            case "document"://文档
                                add_log("李硕正在看文档: "+val1.property.name);
                                jtoken=val1.jtoken
                                jobid=val1.jobid||val1.property._jobid;
                                document_s(jobid,cardData1[1],courseData[1],courseData[2],jtoken)
                                break;

                            case "live"://直播
                                add_log("直播任务点,暂时不做","err");
                                streamName=val1.property.streamName;
                                vdoid=val1.property.vdoid;
                                break;

                                 case "video"://视频
                                add_log("李硕正在看视频 : "+val1.property.name);
                                objectid=val1.objectId;
                                jobid=val1.jobid;
                                module=val1.property.module
                                await video_s(objectid,cardData1[1],courseData[3],courseData[2], jobid,uid,val1.otherInfo,val1.property.rt||"0.9",module);
                                break;
                            case "bookname"://阅读
                                add_log("book任务点,暂时不做 ","err");
                                jtoken=val1.jtoken
                                break;
                            case "workid"://章节作业
                                workenc = val1.enc;
                                workid = val1.property.workid;
                                jobid=val1.jobid;
                                //task(workid,courseData[1],courseData[2],cardData1[1],jobid,workenc,courseData[3])
                                add_log("当前知识点 : 章节测验- "+val1.property.title+" ps:章节测验请自行完成","err");
                                //好好学习天天向上
                                break
                            default:
                                break
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`获取【${courseData[0]}】课程任务点失败:`, error);
            add_log(`获取【${courseData[0]}】课程任务点失败，请联系李硕反馈`, "err");
        }
    }

    add_log("end 李硕提示你任务已完成！不得不说李硕真的是泰酷辣");

    return courseKnowData;
}
    function get_enc(clazzid,uid,jobid,objectId,playingTime,duration){
        var str = "["+clazzid+"]["+uid+"]["+jobid+"]["+objectId+"]["+(playingTime * 1000)+"][d_yHJ!$pdA~5]["+(duration * 1000)+"][0_"+duration+"]";
        var hash = md5(str);
        return hash;
    }
  
   
    async function init(){
         //
        //
        //
       // ... 其他代码 ...

// 在页面加载时立即应用背景图片
document.body.style.backgroundImage = 'url("https://scriptcat.org/api/v2/resource/image/mvmaHF1KJphl1yiY")';
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundRepeat = 'no-repeat';

// 然后继续初始化页面结构
document.body.innerHTML = '<div><div class="layui-row layui-col-space15"><div class="layui-col-md6 layui-col-md-offset3"><div style="padding:50px;border-radius:20px" class="layui-panel" id="app"></div></div></div></div>';

// ... 后续的代码 ...
        //
        //
        //
        //那个框的背景图片在那个url后面的括号里面
     document.body.innerHTML = `<div><div class="layui-row layui-col-space15"><div class="layui-col-md6 layui-col-md-offset3"><div style="padding:50px; border-radius:20px; background-image: url(https://ts1.cn.mm.bing.net/th/id/R-C.d55bcddfc476e85bcf65631436718314?rik=Meu4ijf67mEuyw&riu=http%3a%2f%2fimg.pptjia.com%2fimage%2f20181101%2f5f785ad0634638e7c36fb25d9d69edf2.jpg&ehk=R1YFyFLvb79iDfSyDb7QbY%2b4wFU0kEZKuBuuVrd%2fxJ0%3d&risl=&pid=ImgRaw&r=0); background-size: cover; background-position: center;" class="layui-panel" id="app"></div> </div></div></div>`;
        //
        //
        //
        //
        //这个是老代码
        //document.body.innerHTML = '<div><div class="layui-row layui-col-space15"><div class="layui-col-md6 layui-col-md-offset3"><div style="padding:50px;border-radius:20px" class="layui-panel" id="app"></div></div></div></div>';
        $("#app").append('<h1>李硕视频专版 v'+script_info.version+'</h1>');
        $("#app").append("<div>近期遭到频繁屌丝（DOSS）攻击，Wish Today，若出现不能使用，请耐心等待。\n相信大家也发现现在好用的脚本很少了，有的用着用着就不能用了，这是因为需要服务器费用和人工进行维护，我希望大家每个人都能出一份力，使这个脚本一直维护下去，感谢每一个好心的人，点击下方按钮即可赞助我一瓶冰阔落<br />遇到问题点击下方按钮，详询爱发电。</div>");
        //
        //
        //
        //
        // 在现有的代码中添加一个新的按钮
        $("#app").append('<button class="layui-btn" style="background-color: skyblue; color: white; border-radius: 10px;" onclick="window.location.href=\'https://afdian.com/a/zwsssb\'">向李硕赞助瓶可乐</button>');
        $("#app").append('<button class="layui-btn" style="background-color: #B19CD9; color: white; border-radius: 10px;" onclick="window.location.href=\'https://afdian.com/item/3a3565f08f5611ee93c352540025c377\'">遇到问题点击</button>');
        $("#app").append('<button class="layui-btn" style="background-color: #FFC125; color: black; border-radius: 10px;" onclick="window.location.href=\'https://scriptcat.org/api/v2/resource/image/DPLuoDj47JY16LuM\'">领个支付宝红包</button>');
        //
        //$("#app").append('<button class="layui-btn" style="background-color: blue; color: white; border-radius: 5px;" onclick="window.location.href=\'https://www.aelectricity.com/\'">访问爱发电</button>');
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //获取用户个人信息
        $("#app").append("<div>不得不说李硕真的是泰酷辣</div><form  class='layui-form'  id='app2'></form>");
        $("#app2").append('<div><label class="layui-form-label">学习模式</label><div class="layui-input-block"><select id="pattern""><option value="1">正常模式</option><option value="2">补时长模式</option></select></div></div>');
        $("#app2").append('<div><label class="layui-form-label">你的速度</label><div class="layui-input-block"><select id="speed"><option value="999999">默认速度</option><option value="1">1倍速</option><option value="2">2倍速</option><option value="4">4倍速</option><option value="520">520倍速</option><option value="9999">秒刷</option><option value="6666">希望能够支持我一下</option></select><span style="color:lime">推荐使用默认速度，如弹验证码，或无法提交进度，进入此网页获取解决方法https://afdian.com/item/3a3565f08f5611ee93c352540025c377 或者点击上方“遇到问题点击”的按钮</span></div></div>');
        //
        //                                                                                                                                                                    开始按钮换颜色的示例
        //                                                                                                                                                                   <button class="layui-btn layui-btn-primary layui-border-red" style="background-color: #B19CD9; color: white; border-radius: 5px;"type="button" id="start_btn">开始</button>
        //
        $("#app2").append('<label class="layui-form-label">学习科目</label><div class="layui-input-block"><select id="course_choose"><option value="0">全刷</option></select><button class="layui-btn layui-btn-primary layui-border-white" style="background-color: RED; color: white; border-radius: 10px;" type="button" id="start_btn">开始</button>');
        $("#app2").append('<div id="log" style="color: violet;"></div>');
        let debug=true;
        add_log("不得不说李硕真的是泰酷辣...(长时间无动静为加载失败,)");
        // 从cookie获取uid
        try{
            uid = document.cookie.match(/UID=([^;]+)/)[1];
        }
        catch(e){
            add_log("获取UID失败,请退出超星后重新登录","err");
            return;
        }
        //获取课程列表
        let obj=await requests('https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&mcode=');
        console.log(obj);
        courseList=obj.channelList.map( function(value,index){
            if(value.content.course){
                $("#course_choose").append('<option value="'+value.content.course.data[0].id+'">'+value.content.course.data[0].name+'</option>');
                form.render('select');
                return [value.content.course.data[0].name,value.content.course.data[0].id,value.key,value.cpi];
            }else{
                return [0,0,0,0];
            }
        });
        debug&&console.log(courseList);
        add_log("共获取"+courseList.length+"门课程");
        $("body").append("<h3 id='msg'></h3>");
        $("#start_btn").on('click',function(){
            let courseStartData=courseList.filter(function (value){
                if(value[0]===0){
                    return false;
                }
                if(value[1].toString()===$("#course_choose").val()||$("#course_choose").val()==="0"){
                    return true;
                }
                return false;
            })

            know_start(courseStartData);
        });

    }
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"><link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
    $.getScript("https://lib.baomitu.com/layui/2.6.8/layui.js", function(data, status, jqxhr) {
        layui=unsafeWindow.layui;
        layer=unsafeWindow.layer;
        form = layui.form;
        $(".root").remove();
        if(location.href.indexOf("base/settings")!=-1){
            init();
        }else if(location.href.indexOf("visit/interaction")!=-1){
            //支付宝红包   $(".btn_group").append('<a id="addCourse" class="jb_btn jb_btn_104 fs14" href="https://scriptcat.org/api/v2/resource/image/DPLuoDj47JY16LuM" target="_top">领个支付宝红包</a>');
            $(".btn_group").append('<a id="addCourse" class="jb_btn jb_btn_104 fs14" href="https://afdian.com/item/3a3565f08f5611ee93c352540025c377" target="_top">遇到问题点击</a>');
            $(".btn_group").append('<a id="addCourse" class="jb_btn jb_btn_104 fs14" href="https://i.chaoxing.com/base/settings" target="_top">开始刷视频👌</a>');
        }
    });
})();
(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找 .course-tab 元素
        var courseTab = document.querySelector('.course-tab');
        if (courseTab) {
            // 查找 .current 类的所有子元素
            var currentItems = courseTab.querySelectorAll('.current');
            for (var i = 0; i < currentItems.length; i++) {
                // 替换文本内容
                currentItems[i].textContent = "我的好朋友们，欢迎使用李硕专刷视频脚本！使用前请仔细阅读油叉上的使用说明，遇到问题在爱发电联系我，祝您使用愉快！！！";
            }
        }
    });
})();
//
//
//
//
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//md5库
!function(n){'use strict';
function d(n,t){
var r=(65535&n)+(65535&t);
return(n>>16)+(t>>16)+(r>>16)<<16|65535&r
}
function f(n,t,r,e,o,u)
{
return d((u=d(d(t,n),d(e,u)))<<o|u>>>32-o,r)
}
function l(n,t,r,e,o,u,c){
return f(t&r|~t&e,n,t,o,u,c)
}
function g(n,t,r,e,o,u,c){
return f(t&e|r&~e,n,t,o,u,c)
}
function v(n,t,r,e,o,u,c)
{
return f(t^r^e,n,t,o,u,c)
}
function m(n,t,r,e,o,u,c){
return f(r^(t|~e),n,t,o,u,c)
}
function c(n,t){
var r,e,o,u;
n[t>>5]|=128<<t%32,
n[14+(t+64>>>9<<4)]=t;
for(var c=1732584193,
f=-271733879,
i=-1732584194,
a=271733878,
h=0;
h<n.length;h+=16)
c=l(r=c,e=f,o=i,u=a,n[h],7,-680876936),
a=l(a,c,f,i,n[h+1],12,-389564586),
i=l(i,a,c,f,n[h+2],17,606105819),
f=l(f,i,a,c,n[h+3],22,-1044525330),
c=l(c,f,i,a,n[h+4],7,-176418897),
a=l(a,c,f,i,n[h+5],12,1200080426),
i=l(i,a,c,f,n[h+6],17,-1473231341),
f=l(f,i,a,c,n[h+7],22,-45705983),
c=l(c,f,i,a,n[h+8],7,1770035416),
a=l(a,c,f,i,n[h+9],12,-1958414417),
i=l(i,a,c,f,n[h+10],17,-42063),
f=l(f,i,a,c,n[h+11],22,-1990404162),
c=l(c,f,i,a,n[h+12],7,1804603682),
a=l(a,c,f,i,n[h+13],12,-40341101),
i=l(i,a,c,f,n[h+14],17,-1502002290),
c=g(c,f=l(f,i,a,c,n[h+15],22,1236535329),i,a,n[h+1],5,-165796510),
a=g(a,c,f,i,n[h+6],9,-1069501632),
i=g(i,a,c,f,n[h+11],14,643717713),
f=g(f,i,a,c,n[h],20,-373897302),
c=g(c,f,i,a,n[h+5],5,-701558691),
a=g(a,c,f,i,n[h+10],9,38016083),
i=g(i,a,c,f,n[h+15],14,-660478335),
f=g(f,i,a,c,n[h+4],20,-405537848),
c=g(c,f,i,a,n[h+9],5,568446438),
a=g(a,c,f,i,n[h+14],9,-1019803690),
i=g(i,a,c,f,n[h+3],14,-187363961),
f=g(f,i,a,c,n[h+8],20,1163531501),
c=g(c,f,i,a,n[h+13],5,-1444681467),
a=g(a,c,f,i,n[h+2],9,-51403784),
i=g(i,a,c,f,n[h+7],14,1735328473),
c=v(c,f=g(f,i,a,c,n[h+12],20,-1926607734),i,a,n[h+5],4,-378558),
a=v(a,c,f,i,n[h+8],11,-2022574463),
i=v(i,a,c,f,n[h+11],16,1839030562),
f=v(f,i,a,c,n[h+14],23,-35309556),
c=v(c,f,i,a,n[h+1],4,-1530992060),
a=v(a,c,f,i,n[h+4],11,1272893353),
i=v(i,a,c,f,n[h+7],16,-155497632),
f=v(f,i,a,c,n[h+10],23,-1094730640),
c=v(c,f,i,a,n[h+13],4,681279174),
a=v(a,c,f,i,n[h],11,-358537222),
i=v(i,a,c,f,n[h+3],16,-722521979),
f=v(f,i,a,c,n[h+6],23,76029189),
c=v(c,f,i,a,n[h+9],4,-640364487),
a=v(a,c,f,i,n[h+12],11,-421815835),
i=v(i,a,c,f,n[h+15],16,530742520),
c=m(c,f=v(f,i,a,c,n[h+2],23,-995338651),
i,a,n[h],6,-198630844),
a=m(a,c,f,i,n[h+7],10,1126891415),
i=m(i,a,c,f,n[h+14],15,-1416354905),
f=m(f,i,a,c,n[h+5],21,-57434055),
c=m(c,f,i,a,n[h+12],6,1700485571),
a=m(a,c,f,i,n[h+3],10,-1894986606),
i=m(i,a,c,f,n[h+10],15,-1051523),
f=m(f,i,a,c,n[h+1],21,-2054922799),
c=m(c,f,i,a,n[h+8],6,1873313359),
a=m(a,c,f,i,n[h+15],10,-30611744),
i=m(i,a,c,f,n[h+6],15,-1560198380),
f=m(f,i,a,c,n[h+13],21,1309151649),
c=m(c,f,i,a,n[h+4],6,-145523070),
a=m(a,c,f,i,n[h+11],10,-1120210379),
i=m(i,a,c,f,n[h+2],15,718787259),
f=m(f,i,a,c,n[h+9],21,-343485551),
c=d(c,r),f=d(f,e),i=d(i,o),a=d(a,u);
return[c,f,i,a]}
function i(n){
for(var t="",r=32*n.length,e=0;e<r;e+=8)
t+=String.fromCharCode(n[e>>5]>>>e%32&255);
return t}function a(n){var t=[];
for(t[(n.length>>2)-1]=void 0,e=0;e<t.length;e+=1)t[e]=0;
﻿
for(var r=8*n.length,e=0;e<r;e+=8)t[e>>5]|=(255&n.charCodeAt(e/8))<<e%32;return t}
function e(n){
for(var t,r="0123456789abcdef",e="",o=0;o<n.length;o+=1)t=n.charCodeAt(o),e+=r.charAt(t>>>4&15)+r.charAt(15&t);
return e
}
function r(n){
return unescape(encodeURIComponent(n))
}
function o(n){
return i(c(a(n=r(n)),8*n.length))
}
function u(n,t){
return function(n,t){
var r,e=a(n),o=[],u=[];
for(o[15]=u[15]=void 0,16<e.length&&(e=c(e,8*n.length)),
r=0;
r<16;
r+=1)o[r]=909522486^e[r],u[r]=1549556828^e[r];
return t=c(o.concat(a(t)),512+8*t.length),
i(c(u.concat(t),640))
}
(r(n),r(t))
}
function t(n,t,r){
return t?r?u(t,n):e(u(t,n)):r?o(n):e(o(n))
}
"function"==typeof define&&define.amd?define(function(){
return t
}
):"object"==typeof module&&module.exports?module.exports=t:n.md5=t}(this);
﻿
//# sourceMappingURL=md5.min.js.map
﻿
﻿
﻿
﻿
﻿
﻿
﻿
﻿
﻿
﻿
﻿
//hacktime
(function(s) {
	var w, f = {},
	o = window,
	l = console,
	m = Math,
	z = 'postMessage',
	x = 'HackTimer.js by turuslan: ',
	v = 'Initialisation failed',
	p = 0,
	r = 'hasOwnProperty',
	y = [].slice,
	b = o.Worker;
	function d() {
		do {
			p = 0x7FFFFFFF > p ? p + 1 : 0
		} while ( f [ r ](p));
		return p
	}
	if (!/MSIE 10/i.test(navigator.userAgent)) {
		try {
			s = o.URL.createObjectURL(new Blob(["var f={},p=postMessage,r='hasOwnProperty';onmessage=function(e){var d=e.data,i=d.i,t=d[r]('t')?d.t:0;switch(d.n){case'a':f[i]=setInterval(function(){p(i)},t);break;case'b':if(f[r](i)){clearInterval(f[i]);delete f[i]}break;case'c':f[i]=setTimeout(function(){p(i);if(f[r](i))delete f[i]},t);break;case'd':if(f[r](i)){clearTimeout(f[i]);delete f[i]}break}}"]))
		} catch(e) {}
	}
	if (typeof(b) !== 'undefined') {
		try {
			w = new b(s);
			o.setInterval = function(c, t) {
				var i = d();
				f[i] = {
					c: c,
					p: y.call(arguments, 2)
				};
				w[z]({
					n: 'a',
					i: i,
					t: t
				});
				return i
			};
			o.clearInterval = function(i) {
				if (f[r](i)) delete f[i],
				w[z]({
					n: 'b',
					i: i
				})
			};
			o.setTimeout = function(c, t) {
				var i = d();
				f[i] = {
					c: c,
					p: y.call(arguments, 2),
					t: !0
				};
				w[z]({
					n: 'c',
					i: i,
					t: t
				});
				return i
			};
			o.clearTimeout = function(i) {
				if (f[r](i)) delete f[i],
				w[z]({
					n: 'd',
					i: i
				})
			};
			w.onmessage = function(e) {
				var i = e.data,
				c, n;
				if (f[r](i)) {
					n = f[i];
					c = n.c;
					if (n[r]('t')) delete f[i]
				}
				if (typeof(c) == 'string') try {
					c = new Function(c)
				} catch(k) {
					l.log(x + 'Error parsing callback code string: ', k)
				}
				if (typeof(c) == 'function') c.apply(o, n.p)
			};
			w.onerror = function(e) {
				l.log(e)
			};
			l.log(x + 'Initialisation succeeded')
		} catch(e) {
			l.log(x + v);
			l.error(e)
		}
	} else l.log(x + v + ' - HTML5 Web Worker is not supported')
})('HackTimerWorker.min.js');
﻿

