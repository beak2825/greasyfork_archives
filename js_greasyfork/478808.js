// ==UserScript==
// @name         goodgoodstudy
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  day day up
// @author       machine learning engineer
// @run-at       document-end
// @match       *://learning.hzrs.hangzhou.gov.cn/*
// @match       *://course.hzrs.hangzhou.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/478808/goodgoodstudy.user.js
// @updateURL https://update.greasyfork.org/scripts/478808/goodgoodstudy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log(unsafeWindow.location.href);
    if (unsafeWindow.PopWinTime){
        // never pop up the check window
        unsafeWindow.PopWinTime = 15000;
        console.log('PopWinTime=',unsafeWindow.PopWinTime);
    }
    var iframe = document.querySelector('frame');
    if (iframe){
        console.log('contentDocument',iframe.contentDocument);
        if (iframe.contentDocument){
            var iiframe = iframe.contentDocument.querySelector('frame');
            console.log('iiframe',iiframe);
        }
        console.log('iframe',iframe);
    }
    var video = document.querySelector('video');
    if (video){
        console.log(video.muted);
        video.muted = true;
        video.play();
        console.log('video',video);
    }

    // get class id list
    function getClassList() {
        let clist = document.querySelectorAll('div.info p.name');
        let id_list = [];
        clist.foreach((x) => {id_list.push(x.firstChild.href.match(/\d+/g)[0]);});
        return id_list;
    }

    // 获取页面数量
    function getPpCount() {
        return new Promise((resolve, reject) => {
            let url = 'https://learning.hzrs.hangzhou.gov.cn/study/index.php?act=studyCourseList';
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    let is_login = doc.querySelector("div.page");
                    let learntList = doc.querySelector("div.page span.text");
                    if (learntList != null){
                        console.log('get learn', learntList);
                        let pnum1 = learntList.textContent.match(/\d+/g)[0];
                        if (pnum1){
                            let pnum = parseInt(pnum1);
                            console.log('共有' + pnum + '页');
                            resolve(pnum);
                        }
                    } else if (!is_login) {
                        console.log('未学习任何课程!');
                    } else {
                        reject(new Error('未找到已学课程，请确认已登录'));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });

        });
    }

    function getLearned(pageIndex) {
        return new Promise((resolve, reject) => {
            let url = 'https://learning.hzrs.hangzhou.gov.cn/study/index.php?act=studyCourseList&offset=' + pageIndex;
            // console.log('get learn', url);
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    // console.log('get learn', doc);
                    let td = doc.querySelectorAll('tr.listTd');
                    let scores = [];
                    let lid = [];
                    for (const x of td){
                        lid.push(x.children[0].firstChild.href.match(/\d+/g)[0]);
                        scores.push(parseFloat(x.children[3].textContent));
                    }
                    console.log(lid, scores);
                    resolve({courses: lid, scores: scores});
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function getCourseDuration(cid){
        return new Promise((resolve, reject) => {
            let url = 'https://learning.hzrs.hangzhou.gov.cn/course/index.php?act=detail&courseid=' + cid;
            console.log('课程链接', url);
            let courseInfo = {};
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    let tbody = doc.querySelector('table.courseTable tbody');
                    // console.log('课程信息', cid, tbody);
                    let title = tbody.children[0].children[2].textContent;
                    let ctype = tbody.children[3];
                    let dur = tbody.children[4].children[1].textContent.match(/\d+/g)[0];
                    let score = tbody.children[4].children[3].textContent.match(/[-+]?\d*\.?\d+/)[0];
                    courseInfo = {
                        courseid: cid,
                        duration: parseInt(dur),
                        score: parseFloat(score),
                        ctype: ctype,
                        coursetitle: title
                    };
                    // console.log('课程信息', courseInfo);
                    resolve(courseInfo);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }


    let courseList = [];
    async function learnOne(courseInfo) {
        let courseId = courseInfo.courseid;
        let duration = courseInfo.duration;
        let coursetitle = courseInfo.coursetitle;
        let delay = 12000;
        console.log('开始学习',courseId, coursetitle, duration + '分钟');
        if ( duration === undefined){
            return;
        }
        // return;
        window.open("/study/container.htm?courseid="+courseId+"&coursetitle="+coursetitle+"&delay="+delay,"k","location=0,resizable=1");
        localStorage.setItem('courseid', courseId);

    }

    // 采集当前页面的所有未学过的相关课程
    function collectRelatedCourses(learnedInfo) {
        // let rCourses = document.querySelectorAll('div.all-course li.item-box > a');
        // for (const x of rCourses){
        //     let cid = x.href.match(/\d+/g)[0];
        //     if(learnedInfo.courses.length <= 0 || !learnedInfo.courses.includes(cid)){
        //         courseList.push(cid);
        //     }
        // }

        console.log('开始收集本页面未学课程：' + window.location.href);
        const infoCourses = document.querySelectorAll('div.all-course li.item-box div.info');
        for (const info of infoCourses){
            const cid = info.children[1].firstChild.href.match(/\d+/g)[0];
            // mark this course as learnt
            if (learnedInfo.courses.length > 0 && learnedInfo.courses.includes(cid)){
                info.children[0].firstChild.textContent += '(已学)';
                info.children[0].firstChild.style.color = 'green';
            } else {
                // 只学习：
                // 1)【行业公需】的所有课程，
                // 2) 专业课程】和 【一般公需】的工学课程
                const cate = info.children[0].textContent;
                let is_gongxu = cate.indexOf('行业公需') != -1;
                let is_gongxue = cate.indexOf('工学') != -1
                if (is_gongxu || is_gongxue){
                    courseList.push(cid);
                }
            }
            // const cate = info.children[0].textContent;
            // let is_gongxu = cate.indexOf('行业公需') != -1;
            // let is_gongxue = cate.indexOf('工学') != -1
            // if (!is_gongxu && !is_gongxue){
            //     continue;
            // }

            // if (cate.indexOf('公需课程') != -1 && cate.indexOf('工学') == -1){
            //     continue;
            // }
            // if (info.children[3].textContent.indexOf('专业课程') == -1){
            //     continue;
            // }

            // if(learnedInfo.courses.length <= 0 || !learnedInfo.courses.includes(cid)){
            //     courseList.push(cid);
            // }
        }

        console.log('totally related courses to learn', courseList.length);
    }

    function getTime(seconds){
        let dt = new Date();
        if (seconds){
            const ts = dt.getTime();
            const ft = ts + seconds*60*1000;
            dt = new Date(ft);
        }
        const year = dt.getFullYear();
        const mon = dt.getMonth() + 1;
        const day = dt.getDate();
        const hour = dt.getHours();
        const minute = dt.getMinutes();
        const second = dt.getSeconds(); // 秒
        const dstr = `${year}-${mon}-${day} ${hour}:${minute}:${second}`;
        // console.log('当前时间：', dstr);
        return dstr;
    }


    // let learnedInfo;
    async function autoLearn(){
        if (courseList.length < 1){
            window.confirm('没有可学课程或相关课程已学完');
            return;
        }
        console.log('begin learning');

        let newLearnNum = 0;
        let newLearnScores = 0;
        for (let i = 0; i < courseList.length; i++){
            const info = await getCourseDuration(courseList[i]);
            if (info == null){
                console.log('无法获取课程信息',courseList[i]);
                break;
            }

            learnOne(info);
            // 每个课程播放页面打开时间
            const dur = info.duration + Math.min(5,0.2*info.duration);
            const tinfo = getTime(dur);
            const linfo = '-正在学习【'+ info.coursetitle +'('+info.courseid + ')('+ info.score + '学时)】,预计' + tinfo + '完成';
            document.querySelector('div#learningInfo').firstChild.textContent = linfo;
            await new Promise((resolve, reject) => setTimeout(resolve,dur *1000*60));
            newLearnNum++;
            newLearnScores += info.score;
            const newLearnInfo = '=>本轮共'+courseList.length+'个相关课程，已学'+newLearnNum + '个课程'+newLearnScores+'个学时';
            document.querySelector('div#tolearnInfo').firstChild.textContent = newLearnInfo;

            // in case another tab also open learning
            if (localStorage.getItem('courseid') != courseList[i]){
                document.querySelector('div#learningInfo').firstChild.textContent = '=>课程学习已中断';
                console.log('课程已被中断');
                break;
            }
        }
    }
    function pinInfo(id,info){
        let body = document.querySelector('div.cont');
        if (body){
            let div = document.createElement("div");
            div.setAttribute('id',id);
            div.setAttribute('style','text-align:left;' +
                             'font-size: 22px;' +
                             'color:red');
            let p = document.createElement("p");
            p.textContent = "-" + info;
            div.appendChild(p);
            body.insertBefore(div, body.firstChild);
        } else {
            console.log('未找到元素 div.cont');
        }

    }

    function addButton() {
        let new_btn = document.createElement("button");
        new_btn.setAttribute("class","primary-btn btn");
        new_btn.innerText = "机器学习";
        new_btn.onclick = autoLearn;
        const ele = document.querySelector("div.btnPos, span.line");
        if (ele != null){
            ele.prepend(new_btn);
        }
    }

    if (unsafeWindow.location.href.indexOf('learning.hzrs.hangzhou.gov.cn/course/index.php') != -1){
        console.log('win href',window.location.href);
        console.log('UNSAFE win href',unsafeWindow.location.href);
        getPpCount().then(pNum => {
            let pagePromises = [];
            for(let i =1; i <= pNum; i++){
                pagePromises.push(getLearned(i));
            }
            return Promise.all(pagePromises);

        }).then((learnt) => {
            // 汇总已学课程
            const merged = {
                courses: [].concat(...learnt.map(obj => obj.courses)),
                scores: [].concat(...learnt.map(obj => obj.scores))
            };
            console.log('已学'+merged.courses.length+'个课程，总学分:'+merged.scores.reduce((a,b)=>{return a+b;}));

            if (window.location.href.indexOf('act=detail&courseid=') != -1){
                const cid = unsafeWindow.location.href.match(/\d+/g)[0];
                console.log('本页面课程id', cid);

                if (cid && !merged.courses.includes(cid)){
                    courseList.push(cid);
                } else {
                    let btn = document.querySelector('button.primary-btn.btn');
                    if (btn != null){
                        btn.textContent = '课程已学';
                        btn.disabled = true;
                    }
                }
            }

            collectRelatedCourses(merged);
            if (courseList.length > 0){
                pinInfo('learningInfo','机器学习未开始！');
                pinInfo('tolearnInfo','本页面共有'+courseList.length+'个未学习课程，已学0个课程0个学时');
                pinInfo('learntInfo', '已学'+merged.courses.length+'个课程，总学分:'+merged.scores.reduce((a,b)=>{return a+b;}));
                addButton();
            }
        }).catch(err => { console.error('获取课程失败', err);});
    }
    if (window.location.href.indexOf('learning.hzrs.hangzhou.gov.cn/study/container.htm?courseid=') != -1)
    {
        console.log('course href',window.location.href);
        window.confirm = function(msg){return false;};
        unsafeWindow.confirm = function(msg){return false;};
    }
    console.log('ready to learn!');
    // unsafeWindow.confirm = function(msg){return false;}
    // unsafeWindow.confirm('aa');


})();