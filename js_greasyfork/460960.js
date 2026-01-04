// ==UserScript==
// @name         🦁超星学习通AIIT全自动小助手🐑🐑
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  超星全自动刷课，支持章节、作业、考试等多项任务点。
// @author       阿宽
// @run-at       document-end
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @connect      121.62.16.77
// @connect      cx.icodef.com
// @connect      sso.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      mooc1.chaoxing.com
// @connect      fystat-ans.chaoxing.com
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  ads
// @require https://greasyfork.org/scripts/455606-layx-js/code/layxjs.js?version=1122546
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
// @require      https://cdn.jsdelivr.net/gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @resource  layxcss https://greasyfork.org/scripts/455605-layx/code/layx.user.css
// @resource  ttf https://www.forestpolice.org/ttf/2.0/table.json
// @downloadURL https://update.greasyfork.org/scripts/460960/%F0%9F%A6%81%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9AAIIT%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B0%8F%E5%8A%A9%E6%89%8B%F0%9F%90%91%F0%9F%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/460960/%F0%9F%A6%81%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9AAIIT%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B0%8F%E5%8A%A9%E6%89%8B%F0%9F%90%91%F0%9F%90%91.meta.js
// ==/UserScript==
// 默认配置
var defaultConfig = {
    // 默认请求头
    ua: 'Dalvik/2.1.0 (Linux; U; Android 12; M2102K1AC Build/SKQ1.211006.001) (schild:1b39227c6f3c3b7d95c59ad476567cdb) (device:M2102K1AC) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_6.1.0_android_phone_906_100 (@Kalimdor)_cc0454aaa3b7439daf7cebe7e43f62ba',
    // 公共间隔
    interval: 3000,
    // 答案模糊匹配率。0-1之间，越大越严格
    matchRate: 0.8,
    // 答案正确率,满足此正确率则提交，否则自动提交失效
    autoSubmitRate: 0.9,
    // 是否开启自动提交
    autoSubmit: true,
    // 是否开启自动答题
    autoAnswer: true,
    // api接口
    api:'http://121.62.16.77:996/',
    // 是否开启自动播放视频
    autoPlayVideo: true,
    // 是否开启调试模式(正常用户不用理会这个参数)
    debugger: true,
    script_info : GM_info.script,
},_self = unsafeWindow,top = _self;
function log(msg) {
    if (defaultConfig.debugger) {
        console.log(msg);
    }
}
(function () {
    'use strict';
    // 工具类
    var utils = {
        // 通知消息
        notify: function (level, msg) {
            let data={
                level: level,
                msg: msg
            }
            return JSON.stringify(data);
        },
        // 章节递归排序
        sortData: function (data) {
            let arr = [];
            data.forEach(item=>{
                if(item.parentnodeid == 0){
                    arr.push(item);
                }else{
                    data.forEach(item2=>{
                        if(item2.id == item.parentnodeid){
                            if(item2.children){
                                item2.children.push(item);
                            }else{
                                item2.children = [];
                                item2.children.push(item);
                            }
                        }
                    })
                }
            })
            return arr;
        },
        // 转一维数组
        toOneArray: function (arr) {
            let newArr = [];
            arr.forEach(item=>{
                newArr.push(item);
                if(item.children){
                    newArr = newArr.concat(this.toOneArray(item.children));
                }
            })
            return newArr;
        },
        // 睡眠
        sleep: function (time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        // 获取url参数
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        // 生成url参数
        toQueryString: function (obj) {
            return obj ? Object.keys(obj).sort().map(function (key) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    return val.sort().map(function (val2) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                    }).join('&');
                }
                return encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&') : '';
            return obj ? Object.keys(obj).sort().map(function (key) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    return val.sort().map(function (val2) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                    }).join('&');
                }
                return encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&') : '';
        },
        // input中获取参数
        getInputParam: function (name) {
            let input = document.getElementsByName(name)[0];
            if (input) {
                return input.value;
            }
            return null;
        },
        // 获取视频enc
        getVideoEnc: function (clazzid,uid,jobid,objectId,playingTime,duration) {
            return md5( "["+clazzid+"]["+uid+"]["+jobid+"]["+objectId+"]["+(playingTime * 1000)+"][d_yHJ!$pdA~5]["+(duration * 1000)+"][0_"+duration+"]");
        },
        // 伪造userAgent
        getUserAgent: function () {
        },
        random_str: function(len=32) {
            let $chars = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
            let maxPos = $chars.length;
            let str = '';
            for (let i = 0; i < len; i++) {
                str += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        } ,
        // 获取当前时间戳
        getTimestamp: function() {
            return new Date().getTime();
        }
        // 去除html
        ,removeHtml: function(html) {
            html = html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, '');
            html = html.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            // 将所有br转换为换行
            html = html.replace(/<br\s*\/?>/g, '\n');
            html = html.replace(/(^\s*)|(\s*$)/g, '');
            html = html.replace(/(^\n*)|(\n*$)/g, '');
            return html;
        },
        // 修改默认配置
        setConfig: function(config) {
            for (var key in config) {
                defaultConfig[key] = config[key];
                GM_setValue(key, config[key]);
            }
        }
        // 根据时间缓存数据
        ,cache: function(key, value, time) {
            var cache = GM_getValue(key);
            if (cache) {
                if (cache.time + time > utils.getTimestamp()) {
                    return cache.value;
                }
            }
            GM_setValue(key, {value: value, time: utils.getTimestamp()});
            return value;
        },
        // 匹配选项索引
        matchIndex: function(options,answer) {
            var matchArr=[];
            for(var i=0;i<answer.length;i++){
                for(var j=0;j<options.length;j++){
                    if(answer[i]==options[j]){
                        matchArr.push(j);
                    }
                }
            }
            return matchArr;
        }
        // 字符串相似度计算
        ,similarity: function(s, t) {
            var l = s.length > t.length ? s.length : t.length;
            var n = s.length;
            var m = t.length;
            var d = [];
            var i;
            var j;
            var s_i;
            var t_j;
            var cost;
            if (n == 0) return m;
            if (m == 0) return n;
            for (i = 0; i <= n; i++) {
                d[i] = [];
                d[i][0] = i;
            }
            for (j = 0; j <= m; j++) {
                d[0][j] = j;
            }
            for (i = 1; i <= n; i++) {
                s_i = s.charAt(i - 1);
                for (j = 1; j <= m; j++) {
                    t_j = t.charAt(j - 1);
                    if (s_i == t_j) {
                        cost = 0;
                    } else {
                        cost = 1;
                    }
                    d[i][j] = this.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            }
            return (1 - d[n][m] / l).toFixed(2);
        }
        // 获取最小值
        ,min: function() {
            var min = arguments[0];
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] < min) {
                    min = arguments[i];
                }
            }
            return min;
        }
        // 获取最大值
        ,max: function() {
            var max = arguments[0];
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] > max) {
                    max = arguments[i];
                }
            }
            return max;
        }
        // 模糊匹配选项索引
        ,fuzzyMatchIndex: function(options,answer) {
            //由于无匹配项，选择最相似答案
            var matchArr=[];
            for(var i=0;i<answer.length;i++){
                var max=0;
                var index=0;
                for(var j=0;j<options.length;j++){
                    var similarity=utils.similarity(answer[i],options[j]);
                    console.log(similarity);
                    if(similarity>max){
                        max=similarity;
                        index=j;
                    }
                }
                if(max>defaultConfig.matchRate){
                    matchArr.push(index);
                }
            }
            return matchArr;
        }
        // 字符串判断
        ,strContain: function(str,arr) {
            for(var i=0;i<arr.length;i++){
                if(str.indexOf(arr[i])>-1){
                    return true;
                }
            }
            return false;
        }
    };
    // 协议封装
    var api = {
        // 监控验证码
        monitorVerify: function (responseText) {
            return new Promise((resolve, reject) => {
                // 判断responseText是否是json
                try {
                    let obj = JSON.parse(responseText);
                    let divHtml='<img src="'+obj.verify_png_path+'"/> <input type="text" class="code_input" placeholder="请输入图中的验证码" /><button id="code_btn">验证</button>';
                        // layx.html('verify','Hello Layx!',divHtml);
                        layx.prompt(divHtml,"请输入验证码",function(id,value,textarea, button, event){
                            let url=obj.verify_path+"&ucode="+value;
                            window.open(url);
                        });
                    } catch (error) {
                        window.open("https://mooc1-api.chaoxing.com/antispiderShowVerify.ac?app=1&ucode=ckfx");
                    }
            });
        },
        // 默认请求
        async defaultRequest(url, method, data={},ua=defaultConfig.ua) {
            try {
              const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                  url,
                  method,
                  headers: {
                    'User-Agent': ua,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Sec-Fetch-Site': 'same-origin',
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                  },
                  data: utils.toQueryString(data),
                  onload(response) {
                    resolve(response);
                  },
                  onerror(response) {
                    reject(response);
                  },
                });
              });
              if (response.responseText!=null&&response.responseText.indexOf('输入验证码') !== -1) {
                await this.monitorVerify(response.responseText);
                return await this.defaultRequest(url, method, data);
              }
              return response;
            } catch (err) {
              return Promise.reject(err);
            }
        },
        // 获取课程列表
        getCourseList:async function () {
            let result = await api.defaultRequest("https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&mcode=", 'GET');
            return JSON.parse(result.responseText);
        },
        // 获取课程章节
        getCourseChapter:async function (courseId,classId) {
            let result = await api.defaultRequest("https://mooc1-api.chaoxing.com/gas/clazz?id="+classId+"&personid="+courseId+"&fields=id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isfiled,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,jobcount,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,jobcount,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))&view=json", 'GET');
            return JSON.parse(result.responseText);
        },
        // 获取章节列表
        // nodes: 一维数组，每个元素为章节id
        getChapterList:async function (courseid,clazzid,nodes,userid,cpi) {
            let data={
                "view":"json",
                "nodes":nodes,
                "clazzid":clazzid,
                "userid":userid,
                "cpi":cpi,
                "courseid":courseid,
                "time":(new Date()).valueOf()
            }
            let result = await api.defaultRequest("https://mooc1-api.chaoxing.com/job/myjobsnodesmap", 'post',data);
            return JSON.parse(result.responseText);
        },
        // 获取课程配置
        getCourseConfig:async function (courseId,classId,cpi) {
            let result = await api.defaultRequest("https://mooc1-api.chaoxing.com/course/phone/get-course-setting?clazzId="+classId+"&courseId="+courseId+"&cpi="+cpi, 'GET');
            return JSON.parse(result.responseText);
        },
        // 获取单个章节信息
        getChapterInfo:async function (id,courseid) {
            let data={
                "id":id,
                "courseid":courseid,
                "fields":"id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)",
                "view":"json",
            }
            let url = "https://mooc1-api.chaoxing.com/gas/knowledge?"+utils.toQueryString(data);
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        // 获取单个章节详情
        getChapterDetail:async function (courseid,clazzid,knowledgeid,num,cpi) {
            let url = "https://mooc1-api.chaoxing.com/knowledge/cards?clazzid="+clazzid+"&courseid="+courseid+"&knowledgeid="+knowledgeid+"&num="+num+"&isPhone=1&control=true&cpi="+cpi;
            let result = await api.defaultRequest(url, 'get');
            return result.responseText;
        },
        // 上传学习记录
        uploadStudyLog:async function (courseid,clazzid,knowledgeid,cpi) {
            // 取当前域名
            let url = `${location.origin}/mooc2-ans/mycourse/studentcourse?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ut=s&t=${utils.getTimestamp()}`

            let text=await this.defaultRequest(url,'get',{},navigator.userAgent);
            let match = text.responseText.match(/encode=([\w]+)/);
            log(match);

            if (match) {
                const encode = match[1];
                let url = `https://fystat-ans.chaoxing.com/log/setlog?personid=${cpi}&courseId=${courseid}&classId=${clazzid}&encode=${encode}&chapterId=${knowledgeid}`;
                let result = await api.defaultRequest(url, 'get',{},navigator.userAgent);
                return result.responseText;
            }
            return false;

        },
        // 文档学习
        docStudy:async function (jobid,knowledgeid,courseid,clazzid,jtoken) {
            let url = "https://mooc1-api.chaoxing.com/ananas/job/document?jobid="+jobid+"&knowledgeid="+knowledgeid+"&courseid="+courseid+"&clazzid="+clazzid+"&jtoken="+jtoken+"&_dc="+new Date().valueOf();
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        // 视频学习
        videoStudy:async function (data,cpi,dtoken) {
            let url = "https://mooc1-api.chaoxing.com/multimedia/log/a/"+cpi+"/"+dtoken+"?"+utils.toQueryString(data);
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        // 视频配置获取
        getVideoConfig:async function (objectId) {
            let url = "https://mooc1-1.chaoxing.com/ananas/status/"+objectId+"?k=&flag=normal&";
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        // 解锁章节
        unlockChapter:async function (courseid,clazzid,knowledgeid,userid,cpi) {
            let url = `https://mooc1-api.chaoxing.com/job/submitstudy?node=${knowledgeid}&userid=${userid}&clazzid=${clazzid}&courseid=${courseid}&personid=${cpi}&view=json`;
            log(url);
            let result = await api.defaultRequest(url, 'get');
            return result.status;
        }
    };
    // 接口封装
    var ServerApi = {
        // 搜索
        search:function (data) {
            /**
             * 如果你想请求我们的接口，请以下面的格式发送请求
             * 请求地址：看默认配置
             * 请求方式：POST
             * 请求参数：
             * param type int 0:单选题 (必填) 1:多选题 2:判断题 等等（与超星一致）
             * param question string 题目 (必填)
             * param options array 选项 (必填) json字符串 ["选项1","选项2"]
             * param workType string 测验类型 (必填) zj:章节测验 zy:作业 ks:考试
             * param courseId string 课程id (必填)
             *
             * header:
             * v string 脚本版本号 (必填)
             * referer string 当前答题页面地址 (必填)
             * Content-Type string application/json (必填)
             *
             * ps:以上参数必填，否则会无法搜索到题目，另外不保证题库质量，不保证对接稳定性
             */
            data.key=defaultConfig.kami||'';
            $(".layx_status").html("阿宽提醒：正在搜索答案");
            var url = defaultConfig.api + 'answer?z='+data.workType+'&t='+data.type;
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'post',
                    url: url,
                    data: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'v': defaultConfig.script_info.version,
                        'referer': location.href,
                        't': utils.getTimestamp()
                    },
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (response) {
                        reject(response);
                    },
                    ontimeout: function (response) {
                        reject(response);
                    }
                });
            });
        },
         // 公告3

        // 公告3

        get_msg: function(){
            //var url = '';
            return new Promise(function(resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'get',
                    url: url,
                    headers: {
                        'referer': location.href,
                    },
                    onload: function(response) {
                        try {
                            let reqData=JSON.parse(response.responseText);
                            resolve(reqData.msg);
                        } catch (e) {
                            resolve(defaultConfig.notice);
                        }
                    },
                    onerror: function() {
                        resolve(defaultConfig.notice);
                    }
                });
            });
        }
        // 第三方搜题接口
        ,searchOther:function (data) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'post',
                    url: defaultConfig.otherApi,
                    data: 'question=' + encodeURIComponent(data.question),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    onload: function (response) {
                        try
                        {
                            var res = JSON.parse(response.responseText);
                            if (res.code == 1) {
                                let data=res.data;
                                // 去除javascript:void(0);
                                data=data.replace(/javascript:void\(0\);/g,'');
                                // 去除前后空格
                                data=data.replace(/(^\s*)|(\s*$)/g, "");
                                // 去除前后换行
                                data=data.replace(/(^\n*)|(\n*$)/g, "");
                                if(utils.strContain(data,["叛逆","公众号","李恒雅","一之"])){
                                    resolve([]);
                                }else{
                                    resolve(data.split("#"));
                                }
                            } else {
                                reject([]);
                            }
                        }
                        catch (e)
                        {
                            reject([]);
                        }
                    },
                    onerror: function () {
                        reject([]);
                    },
                    ontimeout: function () {
                        reject([]);
                    }
                });
            });
        }
        // 秘钥验证
        ,checkKey:function (key) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: 'post',
                    url: defaultConfig.api + 'key',
                    data: 'key=' + key,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    },
                    onload: function (response) {
                        try
                        {
                            var res = JSON.parse(response.responseText);
                            if (res.code == 200) {
                                resolve(res.data);
                            } else {
                                reject(res.msg);
                            }
                        }
                        catch (e)
                        {
                            reject("秘钥验证失败");
                        }
                    },
                    onerror: function () {
                        reject("秘钥验证失败");
                    },
                    ontimeout: function () {
                        reject("秘钥验证超时");
                    }
                });
            });
        }
    }
    // 页面操作函数
    var page = {
        // 页面初始化
        init:async function () {
            GM_addStyle(GM_getResourceText("layxcss"));
            switch (location.pathname) {
                case '/exam-ans/exam/test/reVersionTestStartNew':
                case '/exam/test/reVersionTestStartNew':
                    if(location.href.includes('newMooc=true')){
                        await this.layx("ks");
                        layx.setSize('ks',{
                            width: 350,
                            height: 500
                        })
                        this.layx_status_msg("阿宽提醒：初始化完成");
                        let reqData=page.getQuestion("3");
                        this.layx_status_msg("阿宽提醒：自动答题中.....");
                        defaultConfig.loop=setInterval(function(){
                            page.startAsk(reqData);
                        },defaultConfig.interval);
                        break;
                    }else{
                        let url=location.href;
                        // 如果url中没有newMooc=false,则添加
                        if(!url.includes('newMooc=false')){
                            url=url+'&newMooc=true';
                        }else{
                            url=url.replace('newMooc=false','newMooc=true');
                        }
                        // 跳转到新版考试
                        location.href=url;
                        break;
                        }
                // 课程页面主页
                case '/mycourse/stu':
                    await this.layx();
                    this.layx_log("阿宽提醒：初始化完成","info");
                    this.mainTask();
                    break;
                case '/work/doHomeWorkNew':
                           // 判断是否包含
                    if(document.body.innerHTML.indexOf("阿宽提醒：此作业已被老师")!=-1){
                        window.parent.postMessage(utils.notify("error","阿宽提醒：作业已被删除"), '*');
                    }
                    // 判断是章节还是旧版作业
                    if(location.href.includes('oldWorkId')){
                        page.decode();
                        await page.layx("zj",{
                            closeMenu:false,
                            // 最大化
                            maxMenu:true,
                        });
                        layx.setTitle('zj','🔥超星学习通AIIT全自动小助手-作业答题界面(本窗口禁止关闭)');
                        // closeMenu:false
                        // await utils.sleep(5000);
                        //
                        defaultConfig.workinx=0;
                        defaultConfig.succ=0;
                        defaultConfig.fail=0;
                        layx.setSize('zj',{
                            width: 600,
                            height: 300
                        })
                        // layx_log 隐藏
                        $("#layx_log").hide();
                        if(defaultConfig.autoAnswer)
                        {
                            this.layx_status_msg("阿宽提醒：正在自动答题中");
                            defaultConfig.loop=setInterval(function(){
                                page.startChapter();
                            },defaultConfig.interval);
                        }
                    }else{
                        layx.msg('阿宽提醒：不支持旧版作业',{dialogIcon:'help'});
                    }
                    break;
                case '/work/selectWorkQuestionYiPiYue':
                    window.parent.postMessage(utils.notify("success","阿宽提醒：作业已完成"), '*');
                case '/mooc2/work/dowork':
                    // 新版作业
                    await this.layx('zy');
                    this.layx_status_msg("阿宽提醒：初始化完成");
                    $("#layx_log").hide();
                    defaultConfig.workinx=0;
                    defaultConfig.succ=0;
                    defaultConfig.fail=0;
                    layx.setSize('zy',{
                        width: 600,
                        height: 300
                    });
                    if(defaultConfig.autoAnswer)
                    {
                        this.layx_status_msg("阿宽提醒：正在自动答题中");
                        defaultConfig.loop=setInterval(function(){
                            page.startWork();
                        },defaultConfig.interval);
                    }
                    break;
            }
        },
        // layx主弹窗
        layx: async function (id="abcde",option={}) {
            let configs={
                position:'lb',
                width:300,
                height:500,
               //  storeStatus: true,
                borderRadius: "20px",
                skin: 'asphalt',
                opacity: 1,
                maxMenu: false,
                statusBar: "<div id='layx_status_msg'>阿宽提醒：助手正在初始化</div>",
                style:layx.multiLine(function(){
                   /*
                   #layx_div{
                       background-color: #F5F7FA;
                       color: #000;
                       height: 100%;
                       width: 100%;
                       overflow: auto;
                   }
                   #layx_msg{
                       background-color: #fff;
                       padding: 20px;
                       border-bottom: 1px solid #ccc;
                       border-radius: 5px;
                       margin: 10px;
                   }
                   #layx_log{
                       height: 60%;
                       padding: 15px;
                       color: red;
                   }
                   #layx_content{
                       height: 5%;
                   }
                   .layx_success{
                       color: #67C23A;
                       font-weight: bold;
                   }
                   .layx_error{
                       color: #F56C6C;
                       font-weight: bold;
                   }
                   .layx_info{
                       color: black;
                       font-weight: bold;
                   }
                   #layx_status_msg{
                       color: #EE3B3B;
                       font-weight: bold;
                   }
                   */
                })
            };
            // 如果option不为空合并
            if(option){
                configs=Object.assign(configs,option);
            }
            // 公告缓存十分钟
            var notice = '<img src="https://hashx.cn/i/2023/03/01/nuor3u.jpg" alt="公告" height="200"<div style="top:1" id="layx_div" ><div id="layx_msg" style="text-align:center;">\t📰本脚本仅供ATTT学习研究，请勿使用于非法用途！📰</div> <div id="layx_msg" style="text-align:center;">\t🧧阿宽主页地址：https://bl7c.cn/iDWxa🧧</div>'
            var notice1 = '🐑🐑超星学习通AIIT全自动小助手🐑🐑';
            // layx的html
           let htmlStr = `<div id="layx_div"><div id="layx_msg">${notice}</div><div id="layx_content"></div><div id="layx_log">运行日志:</div></div>`;
            layx.html(id,'🦁超星学习通AIIT全自动小助手🐑🐑',htmlStr,configs)
        },
        // layx_log 日志框写入 等级 level 内容 msg
        layx_log: function(msg,level="info"){
            let log = document.getElementById("layx_log");
            // 判断layx_log元素最多容纳多少行
            let maxLine = Math.floor(log.offsetHeight/20);
             // 判断layx_log长度，超过20行则删除第一行
            if(log.children.length>maxLine){
                log.removeChild(log.children[0]);
            }
            // 取当前时间
            let time = new Date().toLocaleTimeString();
            let str="<p>"+time+"  "+"<span class='"+"layx_"+level+"'>"+msg+"</span></p>";
            log.innerHTML+=str;
        },
        // layx_status_msg 状态栏写入
        layx_status_msg: function(msg){
            let log = document.getElementById("layx_status_msg");
            log.innerHTML=msg;
        },
        // 主任务
        mainTask: async function () {
            // 获取课程配置
            let pz={};
            pz.courseid = utils.getUrlParam("courseid"),
            pz.clazzid = utils.getUrlParam("clazzid"),
            pz.cpi = utils.getUrlParam("cpi"),
            pz.userid = utils.getInputParam("userId");
            let data = await api.getCourseChapter(pz.courseid,pz.clazzid);
            let courseData=data.data[0].course.data[0];
            let chapterData=utils.toOneArray(utils.sortData(courseData.knowledge.data));
            let statusTask=false;//默认非闯关模式
            // 判断是否为闯关模式 格局chapterData中的status判断
            for (let i = 0; i < chapterData.length; i++) {
                if(chapterData[i].status=="task"){
                    statusTask=true;
                    this.layx_log("阿宽提醒：检测到为闯关模式，将以闯关形式完成任务","info");
                    break;
                }
            }


            let chapterInfo=await api.getChapterList(pz.courseid,pz.clazzid,chapterData.map(
                (item)=>{
                    return item.id;
                }
            ).join(","),pz.userid , pz.cpi);
            let unfinishcount = Object.values(chapterInfo).reduce((total, current) => {
                return total + current.unfinishcount;
              }, 0);
            this.layx_log(`[${courseData['name']}-${courseData['teacherfactor']}]阿宽获取到${chapterData.length}个章节，共计${courseData.jobcount}个任务,待完成${unfinishcount}个任务`,"info");
            // chapterData遍历
            for (let i = 0; i < chapterData.length; i++) {
                if(unfinishcount==0){
                    break;
                }
                if(statusTask){
                    let unlock=await api.unlockChapter(pz.courseid,pz.clazzid,chapterData[i].id,pz.userid,pz.cpi);
                }
                let setlog=await api.uploadStudyLog(pz.courseid,pz.clazzid,chapterData[i].id,pz.cpi);

                setlog&&this.layx_log("阿宽提醒：上传学习日志成功","success");

                let item = chapterData[i];
                log(item);
                this.layx_log(`阿宽提醒：开始完成章节[${item.label}${item.name}]`,"info");
                if(chapterInfo[item.id].unfinishcount==0){
                    this.layx_log("阿宽提醒：章节已完成，跳过","success");
                    await utils.sleep(defaultConfig.interval);
                    continue;
                }
                let chapterOne=await api.getChapterInfo(item.id,pz.courseid);
                for(let item3 of chapterOne.data[0].card.data){
                    let chapterDetail=await api.getChapterDetail(pz.courseid,pz.clazzid,item3.knowledgeid,item3.cardorder,pz.cpi);
                    if(chapterDetail.indexOf("阿宽提醒：章节未开放")!= -1){
                        this.layx_log("阿宽提醒：章节未开放异常(一般都是章节作业正确率不够，自行完成作业后继续)","error");
                        await utils.sleep(defaultConfig.interval);
                        continue;
                    }
                    let regex = /mArg\s*=\s*({.*?});/;
                    let match = regex.exec(chapterDetail);
                    if (match) {
                        let jsonStr = match[1];
                        let mArg = JSON.parse(jsonStr);
                        let taskDefaultConfig = mArg.defaults;
                        for(let task of mArg.attachments){
                            if(!task.type){
                                continue;
                            }
                            await this.finishTask(task,item3,pz,taskDefaultConfig);
                            await utils.sleep(defaultConfig.interval);
                        }
                    }
                    await utils.sleep(defaultConfig.interval);
                }
                // break;
                // 延时
                await utils.sleep(defaultConfig.interval);
            }
            this.layx_status_msg("阿宽提醒：任务已全部完成")
            // 任务全部完成
            this.layx_log("阿宽提醒：章节全部完成(若仍有知识点未完成请刷新页面)","success")
        },
        // 完成任务
        finishTask: async function (task,item3,pz,taskDefaultConfig) {
            return new Promise(async (resolve, reject) => {
                this.layx_status_msg(`正在完成[${task.property.name||task.property.title}]`);
                this.layx_log("["+(task.property.name||task.property.title)+"]阿宽提醒：开始完成任务","info");
                log(task);
                log(item3);
                switch (task.type) {
                    case "video":
                        let videoData=await api.getVideoConfig(task.objectId);
                        let videoStatus = await this.finishVideo(task,videoData,pz);
                        if(videoStatus==true){
                            this.layx_log("["+task.property.name+"]阿宽提醒：视频已完成","success");
                        }else{
                            this.layx_log("["+task.property.name+"]阿宽提醒：视频异常跳过,正常情况无视即可","error");
                        }
                        resolve();
                        break;
                    case "document":
                        let result = await api.docStudy(task.property.jobid,item3.knowledgeid,pz.courseid,pz.clazzid,task.jtoken);
                        result.status?this.layx_log("["+task.property.name+"]阿宽提醒：文档已完成","success"):this.layx_log("["+task.property.name+"]阿宽提醒：文档异常(正常不用理会)","error");
                        resolve();
                        break;
                    case "workid":
                        let url =`https://mooc1.chaoxing.com/api/work?api=1&workId=${task.jobid.replace('work-', '')}&jobid=${task.property.jobid||""}&needRedirect=true&knowledgeid=${item3.knowledgeid}&ktoken=${taskDefaultConfig.ktoken}&cpi=${taskDefaultConfig.cpi}&ut=s&clazzId=${taskDefaultConfig.clazzId}&type=&enc=${task.enc}&utenc=undefined&courseid=${taskDefaultConfig.courseid}`;
                        log(url);
                        layx.iframe('workiframe', '超星学习通ATTT小助手-章节作业答题界面（禁止关闭-答题结束自动关闭）', url,{
                            event:{
                                onload:{
                                    after: function (layxWindow, winform) {
                                        log(winform);
                                    }
                                }
                            }
                        })
                            await this.finishWork();
                            // 关闭窗口
                            layx.destroy('workiframe');
                            resolve();
                            break;
                    default:
                        this.layx_log("阿宽提醒：未知任务类型"+task.type,"error");
                        resolve();
                        break;
                }
            });
        },
        // 完成视频
        finishVideo: async function (task,videoData,pz) {
            return new Promise(async (resolve, reject) => {
                let data ={
                    "otherInfo": task.otherInfo.replace(/&cour.*$/,""),
                    "courseId": pz.courseid,
                    "playingTime": "0",
                    "duration": videoData.duration,
                    "akid": "null",
                    "jobid": task.property.jobid||task.property._jobid,//
                    "clipTime": "0_"+videoData.duration,
                    "clazzId": pz.clazzid,
                    "objectId": videoData.objectid,
                    "userid": pz.userid,
                    "isdrag": "3",
                    "enc": "",
                    "rt": task.property.rt||"0.9",
                    "dtype": task.property.module.includes('audio')?'Audio':'Video',
                    "view": "json"
                }
                let time = 0,result;
                const intervalTime = 60000; // 每60秒更新一次进度
                while (true) {
                    data.isdrag = time < data.duration ? 3 : 4;
                    data.playingTime = time >= data.duration ? data.duration : time;
                    this.layx_status_msg("阿宽提醒：当前进度:" + data.playingTime + "/" + data.duration + "s  " + "每60秒会更新一次进度");
                    data.enc = utils.getVideoEnc(data.clazzId, data.userid, data.jobid, data.objectId, data.playingTime, data.duration);
                    result = await api.videoStudy(data, pz.cpi, videoData.dtoken);
                    log(data.objectId,result);
                    if(time >= data.duration || result.isPassed==true){
                        break;
                    }
                    time += 60;
                    await utils.sleep(intervalTime);
                }
                resolve(result.isPassed);
            });
        },
        // 完成作业
        finishWork: async function () {
            return new Promise(async (resolve, reject) => {
                _self.addEventListener('message', function(event) {
                    console.log(event.data);
                    let res=JSON.parse(event.data);
                    if(res.level=="success"){
                        page.layx_log("阿宽提醒：作业已完成","success");
                        resolve();
                    }else{
                        page.layx_log(res.msg,"error");
                        resolve();
                    }
                });
            });
        },
        // 请求合并
        requestMerge: function (data) {
            data.id=_self["uid"];
            var promiseArr = [];
            promiseArr.push(
                // search 修改成功返回的数据
                ServerApi.search(data).then(function (response) {
                    try {
                        let result = JSON.parse(response.responseText);
                        switch (result.code) {
                            case 200:
                                return result.data.answer;
                            case 401:
                                return result.msg;
                            case 403:
                                return "频率过快，请稍后再试";
                            case 404:
                                return "参数错误";
                            case 500:
                                return "服务器错误";
                            default:
                                log(result);
                                page.getScore2(result.data);
                                return result.msg;
                        }
                    }
                    catch (e){
                        return "请求异常";
                    }
                })
                .catch(function (error){
                    switch (error.status) {
                        case 403:
                            $(".layx_status").html("请求被拒绝,等待重试");
                            let msg;
                            try {
                                msg=JSON.parse(error.responseText).msg;
                            }
                            catch (e) {
                                msg="请求频率过快,请稍后重试";
                            }
                            $("#layx_msg").html(msg);
                            break;
                        case 404:
                            $(".layx_status").html("请求地址错误,任务结束");
                            // 删除定时器
                            clearInterval(defaultConfig.loop);
                            break;
                        default:
                            $(".layx_status").html("请求错误,等待重试");
                            break;
                    }
                })
            );
            if(defaultConfig.otherApi){
                promiseArr.push(ServerApi.searchOther(data).catch(function (e) {return [];}));
            }
            return Promise.all(promiseArr);
        },
        // 清空所有选中答案以及答案框
        clear: function() {
            // 清空所有选中答案
            $(".answerBg, .textDIV, .eidtDiv").each(function(){
                ($(this).find(".check_answer").length|| $(this).find(".check_answer_dx").length)&&$(this).click();
            });
            $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(){
                _self.UE.getEditor($(this).attr('name')).ready(function() {
                    this.setContent("");
                });
            });
        },
        // 清空当前题目
        clearCurrent: function(item) {
                // 清空所有选中答案
                $(item).find(".answerBg, .textDIV, .eidtDiv").each(function(){
                    ($(this).find(".check_answer").length|| $(this).find(".check_answer_dx").length)&&$(this).click();
                });
                $(item).find(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(){
                    _self.UE.getEditor($(this).attr('name')).ready(function() {
                        this.setContent("");
                    });
                });
                $(item).find(':radio, :checkbox').prop('checked', false);
                $(item).find('textarea').each(function(){
                    _self.UE.getEditor($(this).attr('name')).ready(function() {
                        this.setContent("");
                    });
                });
        },
        /**
         * 解密字体
         * 作者wyn
         * 原地址:https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=2303&highlight=%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86
         */
        decode: function() {
            var $tip = $('style:contains(font-cxsecret)');
            if (!$tip.length) return;
            var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
            font = Typr.parse(this.base64ToUint8Array(font))[0];
            var table = JSON.parse(GM_getResourceText('ttf'));
            var match = {};
            for (var i = 19968; i < 40870; i++) { // 中文[19968, 40869]
                $tip = Typr.U.codeToGlyph(font, i);
                if (!$tip) continue;
                $tip = Typr.U.glyphToPath(font, $tip);
                $tip = md5(JSON.stringify($tip)).slice(24); // 8位即可区分
                match[i] = table[$tip];
            }
            // 替换加密字体
            $('.font-cxsecret').html(function (index, html) {
                $.each(match, function (key, value) {
                    key = String.fromCharCode(key);
                    key = new RegExp(key, 'g');
                    value = String.fromCharCode(value);
                    html = html.replace(key, value);
                });
                return html;
            }).removeClass('font-cxsecret'); // 移除字体加密
        },
        base64ToUint8Array(base64) {
            var data = window.atob(base64);
            var buffer = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        },
        // 获取题目数据
        getQuestion: function(type,html='') {
            String.prototype.cl = function () {
                return this.replace(/[0-9]{1,3}.\s/ig, '').replace(/(^\s*)|(\s*$)/g, "").replace(/^【.*?】\s*/, '').replace(/\[(.*?)\]\s*/, '').replace(/\s*（\d+\.\d+分）$/, '');
            };
            let questionHtml,questionText,questionType,questionTypeId,optionHtml,tokenHtml,workType,optionText,index;
            switch (type) {
                case '1':
                    // 章节
                    workType="zj"
                    questionHtml = $(html).find(".clearfix .fontLabel");
                    questionText=utils.removeHtml(questionHtml[0].innerHTML).cl();
                    questionTypeId=$(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml=$(html).find('ul:eq(0) li .after');
                    tokenHtml=html.innerHTML;
                    optionText = [];
                    optionHtml.each(function (index, item) {
                        optionText.push(utils.removeHtml(item.innerHTML));
                    });
                    break;
                case '2':
                    // 作业
                    workType="zy"
                    questionHtml = $(html).find(".mark_name");
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(','').replace(')','').split(',')[0];
                    questionTypeId=$(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml = $(html).find(".answer_p");
                    tokenHtml =  html.innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    break;
                case '3':
                    // 考试
                    workType="ks"
                    questionHtml = document.getElementsByClassName('mark_name colorDeep');
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(','').replace(')','').split(',')[0];
                    questionTypeId=$("input[name^=type]:eq(1)").val();
                    optionHtml = document.getElementsByClassName('answer_p');
                    tokenHtml = document.getElementsByClassName('mark_table')[0].innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    if(!defaultConfig.hidden){
                        let layx_content = document.getElementById('layx_content');
                        layx_content.innerHTML = '<div class="question_content"><span class="question_type">' + questionType + '</span>' + questionText + '</div><div class="option"></div><div class="answer">阿宽正在为你获取答案中..</div>';
                        let option = document.getElementsByClassName('option')[0];
                        for (let i = 0; i < optionText.length; i++) {
                            option.innerHTML += '<div class="option_item">' + String.fromCharCode(65 + i) + '、' + optionText[i] + '</div>';
                        }
                        let answer = document.getElementsByClassName('answer')[0];
                        answer.innerHTML = '阿宽正在为你获取答案中...';
                    }
                    break;
            }
            return {
                "question": questionText,
                "options": optionText,
                "type": questionTypeId,
                "questionData": tokenHtml,
                "workType": workType
            }
        },
        // 考试答案填写
        setAnswer: function(type,options,answer) {
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clear();
                    // 获取匹配选项
                    var matchArr=utils.matchIndex(options,answer);
                    for(var i=0;i<matchArr.length;i++){
                        $(".answerBg").eq(matchArr[i]).click();
                        // 将匹配的选项标绿
                        $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                    }
                    return matchArr.length>0;
                case '3':// 判断
                    answer=answer[0];
                    answer&&this.clear();
                    $(".answerBg").each(function(){
                        if($(this).find(".num_option").attr("data")=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    return ($(".answerBg").find(".check_answer").length>0|| $(".answerBg").find(".check_answer_dx").length>0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    // 填空数和答案对比
                    var blankNum=$(".answerBg, .textDIV, .eidtDiv").find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    this.clear();
                    $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function(index){
                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;
                default:
                    return false;
            }
        },
        // 作业答案填写
        setWorkAnswer: function(type,options,answer,inx) {
            let item = $(".questionLi").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clearCurrent(item);
                    // 获取匹配选项
                    var matchArr=utils.matchIndex(options,answer);
                    for(var i=0;i<matchArr.length;i++){
                        item.find(".answerBg").eq(matchArr[i]).click();
                        // 将匹配的选项标绿
                        $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                    }
                    return matchArr.length>0;
                case '3':// 判断
                    answer=answer[0];
                    answer&&this.clearCurrent(item);
                    item.find(".answerBg").each(function(){
                        if($(this).find(".num_option").attr("data")=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    return ($(".answerBg").find(".check_answer").length>0|| $(".answerBg").find(".check_answer_dx").length>0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    // 填空数和答案对比
                    var blankNum=item.find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function(index){
                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;
                default:
                    return false;
            }
        },
        // 章节答案填写
        setChapterAnswer: function(type,options,answer,inx) {
            let item = $(".TiMu").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    // 获取匹配选项
                    page.clearCurrent(item);
                    var matchArr=utils.matchIndex(options,answer);
                    if(matchArr.length>0){
                        for(var i=0;i<matchArr.length;i++){
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            // 将匹配的选项标绿
                            $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                        }
                        return true;
                    }
                    else{
                        // 无匹配
                        matchArr=utils.fuzzyMatchIndex(options,answer);
                        for(var i=0;i<matchArr.length;i++){
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            // 将匹配的选项标绿
                            $(".option_item").eq(matchArr[i]).css("color","green").css("font-weight","bold");
                        }
                        return matchArr.length>0;
                    }
                case '3':// 判断
                    answer=answer[0];
                    answer&&page.clearCurrent(item);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').each(function(){
                        if($(this).val()=="true"){
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        }else{
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    // item中的radio或checkbox是否有选中
                    return item.find('ul:eq(0) li :radio,:checkbox,textarea').is(':checked');
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    // 填空数和答案对比
                    var blankNum=item.find('textarea').length;
                    if(blankNum!=answer.length){
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function(index){
                        _self.UE.getEditor($(this).attr('name')).ready(function() {
                            this.setContent(answer[index]);
                        });
                    });
                    return true;
                default:
                    return false;
            }
        },
        // 开始考试答题
        startAsk: async function(data) {
            let answer,answerArr,pd=false;
            answer = document.getElementsByClassName('answer')[0];
            answerArr = await page.requestMerge(data);
            // 遍历数组
            for (let i = 0; i < answerArr.length; i++) {
                let item = answerArr[i];
                // 如果为[]或者字符串则跳过
                if(item.length == 0||typeof(item)=="string"){
                    continue;
                }
                pd=page.setAnswer(data.type,data.options,item);
                if(pd){
                    answer.innerHTML = '答案：' + item.join('<br />');
                    answer.style.color = 'green';
                    break;
                }
            }
            if(!pd){
                answer.innerHTML = answerArr[0]||'暂无答案-联系阿宽';
                this.layx_status_msg("答案匹配失败,等待切换");
            }else{
                this.layx_status_msg("已答题,等待切换");
            }
            // 清除定时器
            clearInterval(defaultConfig.loop);
            // 自动切换
            setTimeout(() => {
                $('.nextDiv .jb_btn:contains("下一题")').click();
            }, defaultConfig.interval);
        },
        // 开始作业答题
        startWork: async function() {
            let layx_content = document.getElementById('layx_content');
            let questionList=document.getElementsByClassName('questionLi');
            let inx=defaultConfig.workinx;
            if(defaultConfig.workinx==0){
                // layx_content 加table
                layx_content.innerHTML = '<table id="qlist" class="table table-bordered"><thead><tr><th>题号</th><th>题目</th><th>答案</th><th>阿宽</th></tr></thead><tbody></tbody></table>';
                // 表格内容左对齐
                $("#qlist").css("text-align","left");
                // 表格第一列宽度
                $("#qlist").find("th").eq(0).css("width","10%");
                // 表格第二列宽度
                $("#qlist").find("th").eq(1).css("width","50%");
                // 表格第三列宽度
                $("#qlist").find("th").eq(2).css("width","30%");
                $("#qlist").find("th").eq(2).css("width","10%");
                // 表格每行高度
                $("#qlist").find("tr").css("height","30px");
            }
            else if(defaultConfig.workinx>=questionList.length){
                // 删除定时器
                this.layx_status_msg(`答题完成 - 已答${defaultConfig.succ}题,未答${defaultConfig.fail}题`);
                clearInterval(defaultConfig.loop);
                return;
            }
            layx.setTitle("main",`答题进度:${inx+1}/${questionList.length} 成功${defaultConfig.succ}题 失败${defaultConfig.fail}题`);
            async function startWorkTask(workinx){
                let questionDiv =  questionList[workinx];
                let data = page.getQuestion("2",questionDiv);
                // 获取#qlist 的 tbody
                let tbody = document.getElementById('qlist').getElementsByTagName('tbody')[0];
                let tr = document.createElement('tr');
                // tr下边框
                $(tr).css("border-bottom","1px solid #ddd");
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                td1.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'questionLi\')['+workinx+'].scrollIntoView();">'+(workinx+1)+'</a>';
                td2.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'questionLi\')['+workinx+'].scrollIntoView();">'+data.question+'</a>';
                let answerArr = await page.requestMerge(data);
                let pd=false;
                // 遍历数组
                for (let i = 0; i < answerArr.length; i++) {
                    let item = answerArr[i];
                    // 如果为[]或者字符串则跳过
                    if(item.length == 0||typeof(item)=="string"){
                        continue;
                    }
                    pd=page.setWorkAnswer(data.type,data.options,item,inx);
                    if(pd){
                        td3.innerHTML = item.join('<br />');
                        td3.style.color = 'green';
                        defaultConfig.succ++;
                        break;
                    }
                }
                if(!pd){
                    td3.innerHTML = answerArr[0]||'暂无答案-联系阿宽';
                     //增加一个重试按钮
                     let aBtn = document.createElement("a");
                     aBtn.innerHTML = "重试并且-Call阿宽";
                     aBtn.style.color = "blue";
                     aBtn.style.marginLeft = "10px";
                     aBtn.onclick = function(){
                         startWorkTask(workinx);
                     }
                     //鼠标光标
                     aBtn.style.cursor = "pointer";
                     td3.appendChild(aBtn);
                     $(tr).css("color","red");
                     $(".layx_status").html("答案匹配失败,等待切换");
                }
                pd&&page.layx_status_msg("已答题,等待切换");
                 // tr数量
                 let trNum=tbody.getElementsByTagName("tr").length;
                 // 如果trNum大于workinx则替换对应td
                 tr.appendChild(td1);
                 tr.appendChild(td2);
                 tr.appendChild(td3);
                 if(trNum>workinx){
                     tbody.replaceChild(tr,tbody.getElementsByTagName("tr")[workinx]);
                 }else{
                     tbody.appendChild(tr);
                 }
            }
            await startWorkTask(defaultConfig.workinx);
            defaultConfig.workinx++;
        },
        // 开始章节答题
        startChapter: async function() {
            let layx_content = document.getElementById('layx_content');
            let questionList=document.getElementsByClassName('TiMu');
            let inx=defaultConfig.workinx;
            if(defaultConfig.workinx==0){
                layx_content.innerHTML = '<table id="qlist" class="table table-bordered"><thead><tr><th>题号</th><th>题目</th><th>答案</th><th>阿宽</th></tr></thead><tbody></tbody></table>';
                $("#qlist").css("text-align","left");
                $("#qlist").find("th").eq(0).css("width","10%");
                $("#qlist").find("th").eq(1).css("width","50%");
                $("#qlist").find("th").eq(2).css("width","30%");
                $("#qlist").find("th").eq(3).css("width","10%");
                $("#qlist").find("tr").css("height","30px");
            }
            else if(defaultConfig.workinx>=questionList.length){
                this.layx_status_msg(`答题完成 - 已答${defaultConfig.succ}题,未答${defaultConfig.fail}题   ${defaultConfig.autoSubmit?"【准备自动提交】":"【未开启自动提交，请手动操作】"}`);
                let z=defaultConfig.succ/questionList.length;
                if(defaultConfig.autoSubmit){
                    let btnOffset,
                    mouse = document.createEvent('MouseEvents');
                    if(z>=defaultConfig.autoSubmitRate){
                        if ($('#confirmSubWin:visible').length) {
                            btnOffset = $('a[onclick="noSubmit();"]').offset() || {top: 0, left: 0},
                            btnOffset = [btnOffset.left + Math.ceil(Math.random() * 46), btnOffset.top + Math.ceil(Math.random() * 26)];
                            mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, btnOffset[0], btnOffset[1], false, false, false, false, 0, null);
                            _self.event = $.extend(true, {}, mouse);
                            delete _self.event.isTrusted;
                            _self.form1submit();
                        } else {
                            btnOffset = $('.Btn_blue_1')[0].click();
                        }
                        setTimeout(submitThis, Math.ceil(defaultConfig.interval * Math.random()) * 2);
                    }else{
                        if(tempSave){
                            return;
                        }
                        var a = "402588557,402588558,402588559,";
                        $("#answerwqbid").val(a);
                        $("#pyFlag").val("1");
                        setMultiChoiceAnswer()
                        setConnLineAnswer();
                        setSortQuesAnswer();
                        setCompoundQuesAnswer();
                        setProceduralQuesAnswer();
                        setBType();
                        tempSave=true;
                        $("#tempsave").text('阿宽正在暂存...');
                        if ($(".oralTestQue").length > 0) {
                            setOralTestAnswer();
                            var checkOralTest = setInterval(function () {
                                if(	$(".oralTestQue").length == oralTestEndNum) {
                                    clearInterval(checkOralTest)
                                    saveWork()
                                }
                            },1000);
                        } else {
                            saveWork()
                        }
                        window.parent.postMessage(utils.notify("error","正确率不够，阿宽已帮你暂存"), '*');
                    }
                }
                clearInterval(defaultConfig.loop);
                return;
            }
            this.layx_status_msg("阿宽提醒：答题进度:"+(inx+1)+"/"+questionList.length+"  成功"+defaultConfig.succ+"题"+"  失败"+defaultConfig.fail+"题");
            async function startWorkTask(workinx){
                let questionDiv =  questionList[workinx];
                let data = page.getQuestion("1",questionDiv);
                let tbody = document.getElementById('qlist').getElementsByTagName('tbody')[0];
                let tr = document.createElement('tr');
                $(tr).css("border-bottom","1px solid #ddd");
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                td1.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'TiMu\')['+workinx+'].scrollIntoView();">'+(workinx+1)+'</a>';
                td2.innerHTML = '<a href="javascript:void(0)" onclick="document.getElementsByClassName(\'TiMu\')['+workinx+'].scrollIntoView();">'+data.question+'</a>';
                let answerArr = await page.requestMerge(data);
                let pd=false;
                // 遍历数组
                for (let i = 0; i < answerArr.length; i++) {
                    let item = answerArr[i];
                    // 如果为[]或者字符串则跳过
                    if(item==undefined||item.length == 0||typeof(item)=="string"){
                        continue;
                    }
                    pd=page.setChapterAnswer(data.type,data.options,item,inx);
                    if(pd){
                        td3.innerHTML = item.join('<br />');
                        td3.style.color = 'green';
                        defaultConfig.succ++;
                        break;
                    }
                }
                if(!pd){
                    td3.innerHTML = answerArr[0]||'暂无答案-联系阿宽';
                    //增加一个重试按钮
                    let aBtn = document.createElement("a");
                    aBtn.innerHTML = "重试并且-Call阿宽";
                    aBtn.style.color = "blue";
                    aBtn.style.marginLeft = "10px";
                    aBtn.onclick = function(){
                        startWorkTask(workinx);
                    }
                    //鼠标光标
                    aBtn.style.cursor = "pointer";
                    td3.appendChild(aBtn);
                    page.layx_status_msg("答案匹配失败,等待切换");
                }else{
                    page.layx_status_msg("已答题,等待切换");
                }
                // tr数量
                let trNum=tbody.getElementsByTagName("tr").length;
                // 如果trNum大于workinx则替换对应td
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                if(trNum>workinx){
                    tbody.replaceChild(tr,tbody.getElementsByTagName("tr")[workinx]);
                }else{
                    tbody.appendChild(tr);
                }
            }
            startWorkTask(defaultConfig.workinx);
            defaultConfig.workinx++;
        },
        // 获取作业分数
        getScore2: function(data) {
            if(data.url==undefined){
                return;
            }
            let url=data.url
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    let html = response.responseText;
                    let document1,questionList,questionListHtml;
                    document1 = new DOMParser().parseFromString(html, "text/html");
                    questionList = document1.getElementsByClassName('Py-mian1');
                    questionListHtml = [];
                    for (let i = 0; i < questionList.length; i++) {
                        if(i===0){
                            continue;
                        }
                        let questionTitle = utils.removeHtml(questionList[i].getElementsByClassName('Py-m1-title')[0].innerHTML);
                        let questionType = questionTitle.match(/\[(.*?)\]/)[1];
                        if(questionType==="单选题"||questionType==="多选题"){
                            // 正则去除开头[单选题]
                            questionTitle = questionTitle.replace(/[0-9]{1,3}.\s/ig, '').replace(/(^\s*)|(\s*$)/g, "").replace(/^【.*?】\s*/, '').replace(/\[(.*?)\]\s*/, '').replace(/\s*（\d+\.\d+分）$/, '');
                            let optionHtml=$(questionList[i]).find('ul.answerList li.clearfix');
                            let optionText = [];
                            optionHtml.each(function (index, item) {
                                let abcd=String.fromCharCode(65 + index)+".";
                                let optionTemp=utils.removeHtml(item.innerHTML);
                                if(optionTemp.indexOf(abcd)==0){
                                    optionTemp=optionTemp.replace(abcd,"").trim();
                                }
                                optionText.push(optionTemp);
                            });
                            questionListHtml.push({
                                "question":questionTitle,
                                "type":defaultConfig.types[questionType],
                                "options":optionText,
                                "questionData":questionList[i].innerHTML
                            })
                        }
                    }
                    let postData={
                        "questionList":questionListHtml,
                        "url":url
                    }
                    log(postData);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: data.url1,
                        data:JSON.stringify(postData),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function(resonse) {
                            let succ="ok";
                        }
                    });
                }
            });
        },
    };
    // 初始化
    page.init();
}
)();
