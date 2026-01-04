// ==UserScript==
// @name         b站辅助（时长/集数/倍速/单集循环）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  更好地使用bilibili（b站）！统计分集视频和视频合集的时长和集数（已看时长、未看时长、总时长、集数..）；增强倍速功能，最高16倍速；单集循环快捷键..。  
// @author       eleky
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440792/b%E7%AB%99%E8%BE%85%E5%8A%A9%EF%BC%88%E6%97%B6%E9%95%BF%E9%9B%86%E6%95%B0%E5%80%8D%E9%80%9F%E5%8D%95%E9%9B%86%E5%BE%AA%E7%8E%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440792/b%E7%AB%99%E8%BE%85%E5%8A%A9%EF%BC%88%E6%97%B6%E9%95%BF%E9%9B%86%E6%95%B0%E5%80%8D%E9%80%9F%E5%8D%95%E9%9B%86%E5%BE%AA%E7%8E%AF%EF%BC%89.meta.js
// ==/UserScript==
 
/*
### 功能
1. 统计视频已看时长、正在观看的这一集的时长、未看时长、总时长，显示到右侧。按“j”或“J”键。
2. 统计视频已看集数、正在看的集数、未看集数、总集数，显示到右侧。按“j”或“J”键。
3. 视频倍速播放及快捷键，按“，”或“<”速度减0.25，按“。”或“<”速度加0.25。b站自带的倍速调整会失效。
4. 设置单集循环，按“k”或“K”键。
*/
 
window.onload = function () {
    console.log("b站辅助（时长/集数/倍速/单集循环）...");
    var jq = document.createElement('script');
    jq.setAttribute('type', 'text/javascript');
    jq.src = "https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
    var rate = 1;
    var stop = 1;
    var videoSelector = "bwp-video"; // 视频元素选择器
    var keyMap = {
        forward0_25: '.', // 速度增加 0.25x
        back0_25: ',', // 速度减少 0.25x
        rate1: '1', // 设为 1x
        rate3: '3', // 设为 3x
        stats_key: 'j',
        stats_key2: 'J',
        select_repeat: 'k',
        select_repeat2: 'K',
    };
    var el = document.querySelector(videoSelector) || document.querySelector('video');
 
    window.addEventListener('keydown', (e) => {
        // console.log("e.key ",e.key);
        if (e.key === keyMap.rate1) {
            rate = 1;
        } else if (e.key === keyMap.rate3) {
            rate = 3;
        } else if (e.key === keyMap.forward0_25 && rate < 16) {
            rate += 0.25;
        } else if (e.key === keyMap.back0_25 && rate > 0.25) {
            rate -= 0.25;
        } else if (e.key === keyMap.stats_key || e.key === keyMap.stats_key2) {
            stats(); // 统计集数和时长
            // showVideoInfo("stats");
            return;
        } else if (e.key === keyMap.select_repeat || e.key === keyMap.select_repeat2) {
            select_repeat(); // 选中洗脑循环
            // showVideoInfo("repeat");
            return;
        } else {
            return;
        }
        setVideoRate();
        showVideoInfo("X" + rate);
    })
 
    // window.onkeydown = function(ev){
    //     console.log(ev.keyCode);
    // }
 
    function setVideoRate() {
        if (el) {
            el.playbackRate = rate;
        }
    }
 
    function showVideoInfo(info) { //显示倍速
        //找到显示位置
        var position = document.getElementsByClassName("bpx-player-video-area")[0];
 
        //获取标签
        var tag = document.getElementById("mytag");
        var isNull = tag === null;
 
        //没有创建过这个标签就创建
        if (isNull) {
            //创建显示标签
            tag = document.createElement("div");
            tag.setAttribute("id", "mytag");
            tag.style = '\n' +
                '    width: 50px;\n' +
                '    height: 28px;\n' +
                '    background-color: #666666;\n' +
                '    position: absolute;\n' +
                '    top: 50%;\n' +
                '    left: 50%;\n' +
                '    transform: translate(-50%, -50%);\n' +
                '    border-radius: 2px;\n' +
                '    z-index: 99999999;\n' +
                '    text-align: center;\n' +
                '    line-height: 28px;\n' +
                '    font-size: 14px;\n' +
                '    color: #fff;\n' +
                '    ';
        }
        $("#mytag").css("display", "block");
 
        //写入html
        tag.innerHTML = info;
 
        //数据添加到面板
        if (isNull) {
            position.after(tag);
        }
 
        //定时消失
        sleep(1000).then(() => {
            $("#mytag").css("display", "none");
        })
 
    }
 
    // function select_repeat() { // 原写法，没用
    //     //$(".bilibili-player-iconfont .bilibili-player-iconfont-setting").trigger('mouseover');
    //     $(".bilibili-player-video-btn-setting").trigger('mouseover'); //使循环播放按钮出现
    //     $(".bilibili-player-video-btn-setting").trigger('mouseout'); //使循环播放按钮消失
    //     //let setting = document.querySelector(".bilibili-player-iconfont .bilibili-player-iconfont-setting");
    //     //setting.click();
    //     $(".bilibili-player-video-btn-setting-left-repeat .bui-switch-input").trigger('click'); //真实选中洗脑循环
    //     $(".bilibili-player-video-btn-setting-left-repeat .bui-switch-input").attr('checked', true); //只是看起来选中了
 
    //     // var a = document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-setting")[0];
    //     // // 不通过鼠标，自动 mouseover 事件。其他事件也类推。
    //     // var ev = new Event("mouseover");
    //     // a.dispatchEvent(ev);
    // }
 
    //获取设置列表
    function select_repeat() {
        var setting_btn = document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-setting")[0];
        var setting_list = setting_btn.getElementsByClassName("bpx-player-ctrl-setting-box")[0];
        var setting_repeat = setting_list.getElementsByTagName("input")[1];
        // 此时setting_repeat = <input class="bui-switch-input" type="checkbox" aria-label="洗脑循环">
        // var ev_click = new Event("click");// 这么写没用
        // setting_repeat.dispatchEvent(ev_click);
        setting_repeat.click();
    }
 
 
    function stats() {
 
        let nodeList;
        try {
            //获取视频列表节点
            nodeList = getVideoList();
            // console.log("已获取视频列表节点");
        } catch (e) {
            console.log("没有视频列表，不是视频选集");
            show2(); //单集视频显示时长
            clearInterval(stop);
            return;
        }

        //sleep(10000).then(() => {
        //获取当前观看索引
        let index = getCurrentLookVideoIndex(nodeList);
        // console.log("当前观看索引：" + index);
        //全部视频个数
        let all_num = nodeList.length;
        // console.log("全部视频个数：" + all_num);
        //已看视频个数
        let looked = index;
        // console.log("已看视频个数：" + looked);
        //未看视频个数
        let number = all_num - index - 1;
        // console.log("未看视频个数：" + number);
 
        //获取视频全部时间的数组
        let allTime = getTimeArray(nodeList, 0, nodeList.length);
        // console.log("视频全部时间的数组：" + allTime);
        //所有时间数组，格式 [h,m]
        let all_time_arr = format(allTime);
        // console.log("所有时间数组，格式 [h,m,s]：" + all_time_arr);
 
        //获取已观看的视频时间数组
        let looked_time = getTimeArray(nodeList, 0, index);
        // console.log("已观看的视频时间数组：" + looked_time);
        //已看时间数组，格式 [h,m]
        let looked_time_arr = format(looked_time);
        // console.log("已看时间数组，格式 [h,m,s]：" + looked_time_arr);
 
        //获取正在观看的视频时间数组
        let looking_time = getTimeArray(nodeList, index, index + 1);
        // console.log("正在观看的视频时间数组：" + looking_time);
        //正在观看时间数组，格式 [h,m]
        let looking_time_arr = format(looking_time);
        // console.log("正在观看时间数组，格式 [h,m,s]：" + looking_time_arr);
 
        //获取未观看的视频时间数组
        let timeArray = getTimeArray(nodeList, index + 1, nodeList.length);
        // console.log("未观看的视频时间数组：" + timeArray);
        //未看时间数组，格式 [h,m]
        let undone_time_arr = format(timeArray);
        // console.log("未看时间数组，格式 [h,m,s]：" + undone_time_arr);
 
        //显示到网页
        // console.log("begin 显示到网页");
        show(looked_time_arr, looking_time_arr, undone_time_arr, all_time_arr, looked, number, all_num);
        // console.log("end 显示到网页");
        //})
 
    }
 
    //单集视频显示时长
    function show2() {
        //获取总时长
        let time_box = document.getElementsByClassName('bpx-player-ctrl-time-duration')[0];
        let time_num = time_box.innerHTML;
 
        //console.log("显示到网页：" + time_num);
 
        //找到显示位置
        let plain = document.getElementById("danmukuBox");
        let data_tag = document.getElementById("data_tag");
        let isNull = data_tag === null;
 
        //没有创建过这个标签就创建
        if (isNull) {
            //创建
            data_tag = document.createElement("div");
            //console.log(data_tag)
            //id赋值，用于下次更新查找
            data_tag.setAttribute("id", "data_tag");
            data_tag.setAttribute("width", "100%");
        }
 
        //写入html 
        data_tag.innerHTML = "<div>总时长：" + time_num + "</div>";
 
        //数据添加到面板
        if (isNull) {
            plain.after(data_tag);
        }
 
    }
 
    //获取视频索引列表
    function getVideoList() {
        let list_box = document.getElementsByClassName('video-pod__list')[0];
        return list_box.childNodes;
    }
 
    //获取到当前观看视频的索引
    function getCurrentLookVideoIndex(nodeList) {
        let index = null;
        for (let i = 0; i < nodeList.length; i++) {
            //当前观看的视频
            let current = nodeList[i];
            //延迟之后获取class值
 
            let class_name = current.className;
            let dataScrolled = current.getAttribute('data-scrolled');
 
            //当前观看
            if (class_name.includes('active')||dataScrolled=='true') {
                //console.log(class_name)  //类名
                index = i;
                console.log("当前视频索引："+index)
                break;
            }
            //循环结束时还没有获取到索引(正常不会之前，前面就跳出了)
            if (i === nodeList.length - 1) {
                console.log("未获取当前视频索引")
            }
 
        }
        return index;
    }
 
    //获取到时间时间字符串
    function getTimeArray(nodeList, start_index, end_index) {
        let parent_array = [];
        for (let i = start_index; i < end_index; i++) {
            // nodeList[i]代表列表中的每一个li
            let div = nodeList[i].getElementsByClassName("duration");
            //每个视频的时长
            let duration = div[0].innerHTML;
            // console.log(duration);   //格式：'09:29'
 
            //添加到数组
            let child_array = duration.split(":");
            if (child_array.length < 3) {
                //数组首部添加0
                child_array.unshift('0');
            }
            parent_array.push(child_array);
 
        }
        return parent_array;
    }
 
    //计算时间/格式化
    function format(timeArray) {
 
        //console.log("视频列表长度："+timeArray.length);  //如果为0没有数据，就出错了
 
        let h = 0,
            m = 0,
            s = 0;
        for (let i = 0; i < timeArray.length; i++) {
            h += Number(timeArray[i][0]);
            m += Number(timeArray[i][1]);
            s += Number(timeArray[i][2]);
        }
 
        //将秒转换为分钟
        let temp1 = s / 60;
        let m1 = Math.floor(temp1);
        m += m1;
 
        //小于一分钟的转换为秒
        let s2 = ('0.' + String(temp1).split('.')[1]) * 60;
 
        //分钟转换为小时
        let temp = m / 60;
        let h1 = Math.floor(temp);
 
        //小于一小时的转换为分钟
        let m2 = ('0.' + String(temp).split('.')[1]) * 60;
 
 
        //最终结果
        h += h1;
        s = Math.floor(s2);
        m = Math.floor(m2);
 
        //分钟出现NaN,原因是因为没有分钟，全是小时，直接赋值
        if (isNaN(m)) {
            m = "0";
        }
        //同理
        if (isNaN(s)) {
            s = "0";
        }
 
        //console.log("小时："+h);
        //console.log("分钟："+m);
        //console.log("秒："+s);
 
        return [h, m, s];
 
    }
 
    //在评论上显示
    function show(looked_time_arr, looking_time_arr, undone_time_arr, all_time_arr, looked, number, all_num) {
        //找到显示面板
        let plain = document.getElementById("danmukuBox");
 
        let data_tag = document.getElementById("data_tag");
 
        let isNull = data_tag === null;
 
        //没有创建过这个标签就创建
        if (isNull) {
            //创建
            data_tag = document.createElement("table");
            //console.log(data_tag)
 
            //id赋值，用于下次更新查找
            data_tag.setAttribute("id", "data_tag");
            data_tag.setAttribute("class", "multi-page-v1 small-mode");
            data_tag.setAttribute("width", "100%");
 
        }
 
        //写入html
        data_tag.innerHTML = "<tr><th></th><th>已看</th><th>正在</th><th>未看</th><th>全部</th></tr>" + show_Str();
 
        //数据添加到面板
        if (isNull) {
            plain.after(data_tag);
        }
 
        $("#data_tag th,#data_tag td").css("width", "20%");
        $("#data_tag th,#data_tag td").css("padding", "5px");
        $("#data_tag th,#data_tag td").css("text-align", "center");
 
        function show_Str() {
            let looked_time = looked_time_arr.join(':');
            let looking_time = looking_time_arr.join(':');
            let undone_time = undone_time_arr.join(':');
            let all_time = all_time_arr.join(':');
            let l1 = "<tr><td>集数</td><td>" + looked + "</td><td>" + 1 + "</td><td>" + number + "</td><td>" + all_num + "</td></tr>";
            let l2 = "<tr><td>时长</td><td>" + looked_time + "</td><td>" + looking_time + "</td><td>" + undone_time + "</td><td>" + all_time + "</td></tr>";
 
            return l1 + l2;
        }
    }
 
    //跳过充电鸣谢
    function pass() {
        let jumpButton = '.bilibili-player-electric-panel-jump';
        setInterval(() => {
            if ($(jumpButton).length > 0) {
                $(jumpButton).trigger('click')
            }
        }, 200)
    }
 
    //延时函数
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
 
};