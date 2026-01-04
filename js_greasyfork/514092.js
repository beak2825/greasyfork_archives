// ==UserScript==
// @name         Boss直聘活跃度显示
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Boss直聘显示活跃时间，鼠标点击顶部导航栏栏即可显示出全部职位活跃度:
// @author       Winlam
// @match        https://www.zhipin.com/web/geek/job*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514092/Boss%E7%9B%B4%E8%81%98%E6%B4%BB%E8%B7%83%E5%BA%A6%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/514092/Boss%E7%9B%B4%E8%81%98%E6%B4%BB%E8%B7%83%E5%BA%A6%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let styles = document.createElement("style");
    styles.textContent=`
    #wl_action_button{    width: 25px;
    height: 25px;
    background: #4c9696;
    border-radius: 50%;
    box-shadow: 1px 1px 2px 1px #ffffff;cursor: pointer;}
        #wl_tagsbar{    display: flex;align-items: end;
            position: absolute;
    color: #fff;
    top: 32%;
    margin-left: 15px;
    text-shadow: 1px 1px 7px #fdfdfd;
        }
        .w_active{ /*职位链接标签 是否已经设置过*/
            padding-bottom: 10px !important;
            height:auto !important;
        }
        .acvt,.wl_juli{ /*默认*/
            padding: 3px 8px;
            background: #f8f8f8;
            width: fit-content;
            border-radius: 8px;
            margin-top: 9px;
                font-size: 14px;
        }
        .wl_juli{padding:0;}
        .acvt-new{ /*日*/
            background: #6dd0d0;
        }
        .acvt-online{
            background: #e5f4e3;
            color: #40b14f;
        }
    `;
    document.head.appendChild(styles);

    let bossactive = {}; //encryptJobId:活跃字
    let mlinkdata = new Map();//joblist api链接:对应的数据数组
    let flag_doing = true;
    let headerbar,tags,currentLat,currentLon,action_button,showtags;
//     let headerbar = document.querySelector("#header");
//     let tags = document.createElement("div");
//     tags.id="wl_tagsbar";
//     headerbar.prepend(tags);

    function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; //千米
    return distance;
}
    function getjuli(lat,log){
        return new Promise(function(res,rej){
        let distance = 0;
        if(currentLat==null||currentLon==null){
            res(distance);
        }
        if (navigator.geolocation) {
            if(!currentLat && !currentLon){
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        currentLat = position.coords.latitude; // 获取纬度
                        currentLon = position.coords.longitude; // 获取经度

                        // 你可以在这里调用计算距离的函数
                        distance = haversineDistance(currentLat, currentLon, lat, log);
                        res(distance);
                    },
                    (error) => {
                        console.error('获取位置失败', error);
                    },
                    {
                        enableHighAccuracy: true, // 使能高精度定位
                        timeout: 5000, // 超时时间
                        maximumAge: 0 // 不使用缓存
                    }
                );
            }
            //console.log(currentLat, currentLon, lat, log);
            distance = haversineDistance(currentLat, currentLon, lat, log);
            res(distance);
        } else {
            console.log("浏览器不支持地理位置服务。");
        }
            res(distance);
            })
    }
    function refresh_tags(text){
        //if(!text){return;}
        if(!headerbar){
            headerbar = document.querySelector("#header");
        }
        if(!tags){
            tags = document.createElement("div");
            tags.id="wl_tagsbar";
            action_button = document.createElement("div");
            action_button.id="wl_action_button";
            tags.prepend(action_button);
            showtags = document.createElement("div");
            showtags.id="wl_showtags";
            tags.append(showtags);

            headerbar.prepend(tags);
        }
        let wl_showtags = document.querySelector("#wl_showtags");
        if(wl_showtags){
            wl_showtags.innerHTML = text;
        }
    }
    //从网络中获得列表数组
    function getlinks() {
        let data = window.performance
        .getEntries()
        .filter((item) => item.name.includes("/search/joblist.json?")).map((item) => item.name);
        return data[data.length - 1];
    }
    //ul 工作列表 job-list-box
    function sortlist(ul){
        refresh_tags("排序中...")
        // 给定的顺序
        var order = ["在线","刚刚活跃","今日活跃","本周活跃", "3日内活跃","本月活跃","2月内活跃","3月内活跃","4月内活跃","5月内活跃","半年前活跃",""];

        var orderMap = order.reduce((acc, item, index) => {
            acc[item] = index;
            return acc;
        }, {});

        var liElements = Array.from(ul.children);

        // 对 <li> 元素进行排序
        liElements.sort((a, b) => {
            // 获取每个 <li> 内的 .acvt 元素
            let a_acvt = a.querySelector(".acvt");
            let b_acvt = b.querySelector(".acvt");

            // 获取文本内容，如果 .acvt 元素不存在则使用空字符串
            let a_text = a_acvt ? a_acvt.innerText : "";
            let b_text = b_acvt ? b_acvt.innerText : "";

            return orderMap[a_text] - orderMap[b_text];
        });

        // 清空 <ul> 内容
        ul.innerHTML = '排序中...';
        //ul = document.querySelector(".job-list-box");
        setTimeout(function(){
            ul.innerHTML = '';
            liElements.forEach((li,index) => {
                ul.appendChild(li);
                refresh_tags("排序中("+(index+1)+"/"+(liElements.length)+")");
            });
            //推荐
            if(window.location.pathname=='/web/geek/job-recommend'){
                document.querySelector(`.rec-job-list>.active`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            refresh_tags("排序已完成");
        },1000)
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /*通过iframe获取页面*/
    async function iframefun_get(url){
        return new Promise((resolve,reject)=>{
            let bossact_iframe = document.querySelector(".bossact_iframe");
            if(bossact_iframe==undefined || bossact_iframe==null){ //不存在-创建
                bossact_iframe = document.createElement('iframe');
            }
            bossact_iframe.id = 'bossact_iframe';
            bossact_iframe.style.display = 'none';
            bossact_iframe.src = url;
            document.body.appendChild(bossact_iframe);
            bossact_iframe.onload = function() {
                try {
                    const iframeDocument = bossact_iframe.contentDocument || bossact_iframe.contentWindow.document;
                    const targetElement = iframeDocument.querySelector(".boss-active-time") || iframeDocument.querySelector(".boss-online-tag");
                    let latlog = iframeDocument.querySelector(".job-location-map[data-lat]");
                    if (targetElement) {
                        resolve({targetElement,latlog});
                    } else {
                        resolve(false)
                    }
                } catch (error) {
                    resolve(false)
                }
            };
        })
    }
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;

            // 清除之前的定时器
            clearTimeout(timeout);

            // 设定新的定时器
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    async function render_datas(jobas_main) {
        refresh_tags("开始处理列表...");
        let jobas_index = 0;
        for (const jobas of jobas_main) {
            let hasacvt = jobas.querySelector(".acvt");
            let hasacvts = jobas.querySelectorAll(".acvt");
            if(hasacvts.length>1){
                hasacvts[hasacvts.length-1].remove();
            }

            //是否已经w_active
            if (!jobas.classList.contains("w_active") && !hasacvt) {
                try {
                    refresh_tags(jobas.innerText+"-处理中("+(jobas_index+1)+"/"+(jobas_main.length)+")");
                    let parsedUrl = new URL(jobas.href);
                    // 获取不带参数的 URL
                    let urlWithoutParams = parsedUrl.origin + parsedUrl.pathname;
                    let response = await fetch(urlWithoutParams);
                    let html = await response.text();
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, "text/html");
                    let activetime_dom = doc.querySelector(".boss-active-time") || doc.querySelector(".boss-online-tag");
                    let latlog = doc.querySelector(".job-location-map[data-lat]")||null;
                    if(activetime_dom==undefined || activetime_dom==null){
                        console.log("超时，继续寻找")
                        let againb = await iframefun_get(urlWithoutParams);
                        activetime_dom = againb?.activetime_dom;
                        latlog = againb?.latlog;
                        console.log("ok",activetime_dom)
                    }

                    if (activetime_dom) {
                        let acvt = document.createElement("div");
                        acvt.className="acvt";
                        if(activetime_dom.innerHTML.indexOf("刚") !=-1){
                            acvt.classList.add("acvt-new")
                        }else if(activetime_dom.innerHTML.indexOf("在线") !=-1){
                            acvt.classList.add("acvt-online")
                        }
                        acvt.innerText = activetime_dom.innerHTML;
                        let juli_dom = document.createElement("div");
                        //创建距离
                        if(latlog){
                            let latlog_text = latlog.dataset.lat.split(",");
                            let juli = await getjuli(latlog_text[1]||0,latlog_text[0]||0);
                            if(juli!=0){
                            juli_dom.className="wl_juli";
                            juli_dom.innerText="直线距离:"+juli.toFixed(2)+"km";
                            }
                        }

                        //首页的
                        if(jobas.classList.contains("job-name") && jobas.parentNode.parentNode.classList.contains("job-info")){
                            jobas.parentNode.parentNode.append(acvt);
                            jobas.parentNode.parentNode.append(juli_dom);
                        }else{
                            jobas.append(acvt);
                            jobas.append(juli_dom);
                        }

                        let parts = parsedUrl.pathname.split('/');
                        let encryptJobId = parts[2].split('.')[0];
                        bossactive[encryptJobId] = activetime_dom.innerHTML;

                        jobas.classList.add("w_active");
                        jobas.classList.add("jobas_mouseenter");

                        refresh_tags(jobas.innerText+"-完成");
                    }
                } catch (err) {
                    refresh_tags(jobas.innerText+"-处理失败");
                    console.log('Failed to fetch page: ', err);
                }
            }

            jobas_index++;
        }
    }

    function render_all(selector,ul){
        let jobas_main = Array.from(document.querySelectorAll(selector));
        render_datas(jobas_main).then(() => {
            refresh_tags('所有项目处理完成');
            console.log('所有项目处理完成');
            sortlist(ul);

            //推荐
            if(window.location.pathname=='/web/geek/job-recommend'){
                document.querySelector(`.rec-job-list>.active`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(function(){
                refresh_tags("");
            },5000);
            flag_doing = true;
        });
    }

    function mouse_addactivetime(){
        console.log("mouse_addactivetime");
        let jobas_main = Array.from(document.querySelectorAll(`a[href^="/job_detail/"]:not(.jobas_mouseenter_begin):not(.w_active)`));

        jobas_main.forEach((item)=>{
            item.classList.add("jobas_mouseenter_begin");
            let debouncedResize = debounce(async function(event){
                item.classList.add("jobas_mouseenter");
                let jobas = event.target;
                let hasacvt = jobas.querySelector(".acvt");
                let hasacvts = jobas.querySelectorAll(".acvt");
                if(hasacvts.length>1){
                    hasacvts[hasacvts.length-1].remove();
                }

                if (!jobas.classList.contains("w_active") && !hasacvt) {
                    try {
                        refresh_tags(jobas.innerText+"-处理中");
                        let parsedUrl = new URL(jobas.href);
                        // 获取不带参数的 URL
                        let urlWithoutParams = parsedUrl.origin + parsedUrl.pathname;
                        let response = await fetch(urlWithoutParams);
                        let html = await response.text();
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(html, "text/html");
                        let activetime_dom = doc.querySelector(".boss-active-time") || doc.querySelector(".boss-online-tag");
                        let latlog = doc.querySelector(".job-location-map[data-lat]")||null;
                        if(activetime_dom==undefined || activetime_dom==null){
                            console.log("超时，继续寻找")
                            let againb = await iframefun_get(urlWithoutParams);
                            activetime_dom = againb?.activetime_dom;
                            latlog = againb?.latlog;
                            console.log("ok",activetime_dom)
                        }

                        if (activetime_dom) {
                            let acvt = document.createElement("div");
                            acvt.className="acvt";
                            if(activetime_dom.innerHTML.indexOf("刚") !=-1){
                                acvt.classList.add("acvt-new")
                            }else if(activetime_dom.innerHTML.indexOf("在线") !=-1){
                                acvt.classList.add("acvt-online")
                            }
                            acvt.innerText = activetime_dom.innerHTML;
                            let juli_dom = document.createElement("div");
                            //创建距离
                            if(latlog){
                                let latlog_text = latlog.dataset.lat.split(",");
                                let juli = await getjuli(latlog_text[1]||0,latlog_text[0]||0);
                                if(juli!=0){
                                juli_dom.className="wl_juli";
                                juli_dom.innerText="直线距离:"+juli.toFixed(2)+"km";
                                }
                            }

                            //首页的
                            if(jobas.classList.contains("job-name") && jobas.parentNode.parentNode.classList.contains("job-info")){
                                jobas.parentNode.parentNode.append(acvt);
                                jobas.parentNode.parentNode.append(juli_dom);
                            }else{
                                jobas.append(acvt);
                                jobas.append(juli_dom);
                            }

                            let parts = parsedUrl.pathname.split('/');
                            let encryptJobId = parts[2].split('.')[0];
                            bossactive[encryptJobId] = activetime_dom.innerHTML;

                            jobas.classList.add("w_active");
                            jobas.classList.add("jobas_mouseenter");

                            refresh_tags(jobas.innerText+"-完成");
                        }
                    } catch (err) {
                        refresh_tags(jobas.innerText+"-处理失败");
                        console.log('Failed to fetch page: ', err);
                    }
                }
            }, 300);
            item.addEventListener('mouseenter',debouncedResize);
        })
    }

    //     setTimeout(function(){
    //         flag_doing = false;
    //         //搜索
    //         if(window.location.pathname=='/web/geek/job'){
    //             //搜索
    //             render_all(`.job-list-box a[href^="/job_detail/"]:not(.jobas_mouseenter):not(.w_active)`,document.querySelector('.job-list-box'));
    //             //历史记录
    //             render_all(`.history-job-list a[href^="/job_detail/"]:not(.jobas_mouseenter):not(.w_active)`,document.querySelector('.history-job-list'));
    //         }

    //         //推荐
    //         if(window.location.pathname=='/web/geek/job-recommend'){
    //             render_all(`.rec-job-list a[href^="/job_detail/"]:not(.jobas_mouseenter):not(.w_active)`,document.querySelector('.rec-job-list'));
    //         }
    //     },3000)

    setTimeout(async function(){
        let testlolat = await getjuli(0,0);
        console.log(testlolat);
        refresh_tags("Boss直聘活跃度显示已完成准备");
        setTimeout(function(){
            refresh_tags("");
        },3000);
        document.querySelector("#wl_action_button").addEventListener('click',function(event){
            event.stopPropagation();
            if(!flag_doing){
                refresh_tags("Boss直聘活跃度显示已在运行中");
                return;
            }
            flag_doing = false;
            //搜索
            if(window.location.pathname=='/web/geek/job'){
                //搜索
                render_all(`.job-list-box a[href^="/job_detail/"]:not(.jobas_mouseenter):not(.w_active)`,document.querySelector('.job-list-box'));
                //历史记录
                render_all(`.history-job-list a[href^="/job_detail/"]:not(.jobas_mouseenter):not(.w_active)`,document.querySelector('.history-job-list'));
            }

            //推荐
            if(window.location.pathname=='/web/geek/job-recommend'){
                render_all(`.rec-job-list a[href^="/job_detail/"]:not(.jobas_mouseenter):not(.w_active)`,document.querySelector('.rec-job-list'));
            }
        })
        mouse_addactivetime();
    },2000)

    let debouncedResize = debounce(mouse_addactivetime,300);
    document.addEventListener('click',debouncedResize);
    //mouse_addactivetime();
})();