// ==UserScript==
// @name         关键词搜索
// @namespace    http://tampermonkey.net/
// @version      2.1.6
// @description  根据关键词搜索视频
// @author       xgm
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/hashtag/*
// @match        https://www.douyin.com/video/*
// @match        https://www.xiaohongshu.com/search_result*
// @match        https://www.xiaohongshu.com/user/profile/*
// @match        https://www.xiaohongshu.com/explore*
// @match        https://www.xiaohongshu.com/website-login/error*
// @match        https://www.kuaishou.com/search/video*
// @match        https://haokan.baidu.com/web/search/page*
// @match        https://s.weibo.com/video*
// @match        https://weibo.com/tv/show*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/498341/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/498341/%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义css
    let div_css = `
        .cyOperate{
            width: 500px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-10%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
         button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .stop_btn {
          width: 150px;
          height: 35px;
          position: fixed;
          top:200px;
          right:200px;

          z-index: 999999999;
        }
        .stop_btn button {
           font-size:26px;
           color:#fff;
           background-color: red;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 10px 10px;
        }
        .keyword {
           margin:20px 0;
        }
        .title {
           font-size:16px;
           font-weight:500;
           color:blue;
        }
        .h1_content{
        font-size:22px;
        font-weight:bold;
        display:none;
        }
        .version{
          margin-bottom:20px;
        }
        .mode_type,.team_type {
          display:flex;
          align-items:center;
          align-self: center;
          padding:5px 0;
          margin:10px 0 5px 0;
        }
        .xhsTag_type,.xhsCate_type,.dyTag_type,.anchorCate_type {
          display:none;
          align-items:center;
          align-self: center;
          padding-bottom:10px;
        }
        .tags_list,.xhsTags_list,.xhsCates_list,.dyTags_list,.anchorCates_list {
        display:flex;
        flex-wrap: wrap;
        }
        .tags,.xhs_tags,.xhs_cates,.dy_tags,.anchor_tags {
        border:1px solid #333;
        padding:5px 15px;
        border-radius:5px;
        cursor:pointer;
        margin:0 10px 5px 0;
        }
        .active_tag {
         background-color:#0096db;
         color:white;
         padding:5px 15px;
         border-radius:5px;
         cursor:pointer;
         margin-right:15px;
         border:none;
        }
        .isVisible {
         display:inline;
        }
        .visible_text {
        cursor:pointer;
        position: absolute;
        right:6px;
        top:6px;
        font-weight:bold;
        font-size:20px;
        color:#0096db;
        }
        .update_btn {
        color:#0096db;
        margin-left:10px;
        font-weight:bold;
        cursor:pointer;
        }
        .tag_title {
        width:110px;
        }
        select {
        height:32px;
        width:120px;
        font-size:18px;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="cyOperate">
        <div class="h1_content"><span id="content_text"></span>将在<span id="countdown">60</span> 秒后重新加载</div>
        <span class="visible_text">收起</span>
        <div class="isVisible">
        <div class="team_type"><div >团队：</div><select id="teamSelect"></select></div>
        <div class="mode_type"><div class="tag_title">当前模式：</div><div class="tags_list"></div></div>
        <div class="dyTag_type">抖音搜索筛选：<div class="dyTags_list"></div></div>
        <div class="xhsTag_type">小红书搜索筛选：<div class="xhsTags_list"></div></div>
        <div class="xhsCate_type">小红书标签抓取：<div class="xhsCates_list"></div></div>
        <div class="anchorCate_type">是否筛选带货视频：<div class="anchorCates_list"></div></div>
        <div class="">限制日期为：<input class="cyInp" type="number" id="date_time" />年内</div>
        <div class="">每个关键词抓取总数：<input class="cyInp" type="number" id="total" /></div>
        <div class="">最低点赞数：<input class="cyInp" type="number" id="like_count" /></div>
        <div class="">最低视频时长：<input class="cyInp" type="number" id="dura" />秒</div>
        </div>
        <div class="h2_content">当前抓取数：<span class="numbers">0</span></div>
        <div class="keyword">当前关键词：<span id="keyword_text">当前暂无关键词</span></div>
        <div class="version">版本号：<span class="version_id"></span></div>
        <div><span>操作人名字：</span><input class="cyInp" type="text" id="operator" /></div>
        <div class="phone_item"><span>当前登录手机号：</span><input class="cyInp" type="text" id="xhsPhone" /></div>
        <div><span>设备标识：</span><input class="cyInp" type="text" id="myInput"/></div>
            <div class="cyBtn">
                <button>搜索</button>
            </div>
        </div>
        <div class="stop_btn"><button>停止脚本</button></div>
        <div class="cyloading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
    `
    $("body").append(div);
    let rex = window.location.href;
    // apiHost https://api.test.cyek.com/
    var apiHost = "https://api.oa.cyek.com/";
    const version = "1.7.1"
    // 查找抖音数据id
    function searchData(object, data) {
        for (var key in object) {
            if (object[key] == object[data]){
                // console.log(key)
                return key
            };
            for(var i in object[key]){
                // console.log(i);
                if(i == data){
                    return key;
                }
            }
        }
    }
    //请求方法
    function req(url,data,sucFun,specialFun){
        let xhr; // 保存 GM_xmlhttpRequest 返回的对象
        // 设置超时时间，比如5秒
        let timeout = setTimeout(()=> {
            // 请求超时处理
            xhr.abort(); // 中断请求
            console.log("请求超时");
            req(url,data,sucFun,specialFun)
        }, 120000);
        xhr = GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    clearTimeout(timeout);
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    console.log(json,'json');
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        countdown(json?.message||"1002",()=> req(url,data,sucFun,specialFun),60)
                    }else{
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }else{
                            countdown(json?.message||"未知错误",()=> req(url,data,sucFun,specialFun),60)
                        }
                    }
                }else{
                    clearTimeout(timeout);
                    countdown("req请求错误",()=> req(url,data,sucFun,specialFun),60)
                    console.log("req请求错误")
                }
            },
            onerror: function(response) {
                console.log("请求失败,重新请求");
                clearTimeout(timeout);
                countdown("发起请求失败",()=> req(url,data,sucFun,specialFun),60)
            }

        });
    }
    // {name:'C',value:3},{name:'B1',value:8},{name:'B2',value:9},{name:'B3',value:7},{name:'E',value:6},
    const tagsArr = [{name:'A',value:1},{name:'B',value:2},{name:'G',value:10},{name:'GG',value:11},{name:'JJ',value:12},{name:'DD',value:13},{name:'DJ',value:14}];//模式列表
    const xhsTagsArr = [{name:'综合',value:0},{name:'最新',value:1}, {name:'最热',value:2}];//小红书搜索条件
    const dyTagsArr = [{name:'综合排序',value:0},{name:'最新发布',value:2}, {name:'最多点赞',value:1}];//抖音搜索条件
    const xhsCatesArr = [{name:'否',value:0},{name:'是',value:1}];//小红书标签
    const anchorArr = [{name:'否',value:0},{name:'是',value:1}];//抖音强效验标签
    let mode_type = Number(localStorage.getItem('mode_type')||1);//模式
    let total = Number(localStorage.getItem('total')||40);//总数
    let like_count =Number(localStorage.getItem('like_count')||0);//点赞
    let offsetTime = Number(localStorage.getItem('date_time')||10);//时间
    let dura = Number(localStorage.getItem('dura')||0);//视频时长
    let is_stop = Number(localStorage.getItem('is_stop')||0);//是否停止
    let xhsTagType = Number(localStorage.getItem('xhsTagType')||0);//小红书搜索条件
    let xhsCateType = Number(localStorage.getItem('xhsCateType')||0);//小红书标签搜索
    let dyTagType = Number(localStorage.getItem('dyTagType')||0);//抖音搜索
    let isVisible = Number(localStorage.getItem('isVisible')||0);//面版是否收起
    let isAnchor = Number(localStorage.getItem('isAnchor')||0);//是否开启强校验
    let teamId = Number(localStorage.getItem('teamId')||0);//团队
    //收起/展开
    const isVisibleDom = document.querySelector(".isVisible")
    const visible_text = document.querySelector(".visible_text")
     visible_text.addEventListener('click', function() {
         if(visible_text.innerText == "展开"){
             isVisibleDom.style.display = "inline"
             visible_text.innerText = "收起"
             localStorage.setItem('isVisible',0);
         }else{
             isVisibleDom.style.display = "none"
             visible_text.innerText = "展开"
             localStorage.setItem('isVisible',1);
         }
    })
    visible_text.innerText =isVisible? "展开":"收起"
    isVisibleDom.style.display =isVisible?"none": "inline"
     //收起/展开结束

    //下拉框元素
    const setCateDom = (className,arr,cateType)=>{
        const tagContainer = document.querySelector(className);
        arr.forEach(item => {
            const newTag = document.createElement('option');
            newTag.value = item.value
            newTag.innerText = item.label;
            tagContainer.appendChild(newTag);
        });
        tagContainer.value = Number(teamId)
    }
    function getCateList(dom,cateType){
        // 发起 GET 请求
        GM_xmlhttpRequest({
            method: "GET",
            url:apiHost+"getTeamList",
            onload: function(response) {
                const arr = JSON.parse(response.responseText)?.result
                console.log(arr,'arr')
                if(arr.length>0){
                    // cateTypeObj[cateType] = arr[0]?.value
                    setCateDom(dom,arr,cateType)
                }
            }
        });
    }
    getCateList("#teamSelect",'teamId')
    const getSelect = (dom,cateType)=>{
        // 获取下拉框元素
        let ele = document.getElementById(dom);
        // 为下拉框添加change事件监听器
        ele.addEventListener('change', function(event) {
            // 获取选中的值
            teamId = ele.value;
            localStorage.setItem(cateType,teamId);//cateTypeObj
            // 执行回调函数的逻辑
            console.log('Selected value:', teamId);
            // 例如，可以在这里根据选中的值进行相应的操作
        });
    }
    getSelect('teamSelect','teamId')
    //下拉框元素结束

    //标签生成
    const setTagDom = (className,tagClassName,arr,type)=>{
        const tagContainer = document.querySelector(className);
        arr.forEach(item => {
            const newTag = document.createElement('span');
            newTag.classList.add(tagClassName);
            newTag.innerText = item.name;
            if(type ==item.value) {
                newTag.classList.add('active_tag');
            }
            tagContainer.appendChild(newTag);
        });
    }
    //生成模式标签
    setTagDom('.tags_list','tags',tagsArr,mode_type)//执行
    document.querySelectorAll('.tags').forEach(tag => {//tag点击事件
        tag.addEventListener('click', function() {
            var tags = document.querySelectorAll('.tags');
            tags.forEach(tag => {
                tag.classList.remove('active_tag');
            });
            this.classList.add('active_tag');
            const data = tagsArr.find(e=>e.name ==this.innerText)
            localStorage.setItem('mode_type',data.value);
            mode_type = Number(data.value)
            // 在这里添加点击tag后的操作
            console.log('Tag clicked: ' + data.value);
        });
    });
    //模式选择标签结束

    //小红书搜索模式选择
    setTagDom('.xhsTags_list','xhs_tags',xhsTagsArr,xhsTagType)//执行
    document.querySelectorAll('.xhs_tags').forEach(tag => {//tag点击事件
        tag.addEventListener('click', function() {
            var tags = document.querySelectorAll('.xhs_tags');
            tags.forEach(tag => {
                tag.classList.remove('active_tag');
            });
            this.classList.add('active_tag');
            const data = xhsTagsArr.find(e=>e.name ==this.innerText)
            localStorage.setItem('xhsTagType',data.value);
            xhsTagType = Number(data.value)
            // 在这里添加点击tag后的操作
            console.log('Tag xhsTagType: ' + data.value);
        });
    });
    //小红书搜索模式选择结束

    //小红书标签选择
    setTagDom('.xhsCates_list','xhs_cates',xhsCatesArr,xhsCateType)//执行
    document.querySelectorAll('.xhs_cates').forEach(tag => {//tag点击事件
        tag.addEventListener('click', function() {
            var tags = document.querySelectorAll('.xhs_cates');
            tags.forEach(tag => {
                tag.classList.remove('active_tag');
            });
            this.classList.add('active_tag');
            const data = xhsCatesArr.find(e=>e.name ==this.innerText)
            localStorage.setItem('xhsCateType',data.value);
            xhsCateType = Number(data.value)
            // 在这里添加点击tag后的操作
            console.log('Tag xhsCateType: ' + data.value);
        });
    });
    //小红书标签选择结束

    //抖音标签开始
    setTagDom('.dyTags_list','dy_tags',dyTagsArr,dyTagType)//执行
    document.querySelectorAll('.dy_tags').forEach(tag => {//tag点击事件
        tag.addEventListener('click', function() {
            var tags = document.querySelectorAll('.dy_tags');
            tags.forEach(tag => {
                tag.classList.remove('active_tag');
            });
            this.classList.add('active_tag');
            const data = dyTagsArr.find(e=>e.name ==this.innerText)
            localStorage.setItem('dyTagType',data.value);
            dyTagType = Number(data.value)
            // 在这里添加点击tag后的操作
            console.log('Tag dyTagType: ' + data.value);
        });
    });

    //抖音标签结束

    //强校验开始
    setTagDom('.anchorCates_list','anchor_tags',anchorArr,isAnchor)//执行
    document.querySelectorAll('.anchor_tags').forEach(tag => {//tag点击事件
        tag.addEventListener('click', function() {
            var tags = document.querySelectorAll('.anchor_tags');
            tags.forEach(tag => {
                tag.classList.remove('active_tag');
            });
            this.classList.add('active_tag');
            const data = anchorArr.find(e=>e.name ==this.innerText)
            localStorage.setItem('isAnchor',data.value);
            isAnchor = Number(data.value)
            // 在这里添加点击tag后的操作
            console.log('Tag isAnchor: ' + data.value);
        });
    });
    //强校验开始

    //停止脚本名stop_btn
    const stopBtn = document.querySelector('.stop_btn button')
    stopBtn.addEventListener('click', function() {
        onStop(()=>{
            localStorage.setItem('is_stop',1);
            is_stop = 1
            stoppingHtml()
        })
    });
    //页面即将关闭
    window.addEventListener('beforeunload', (event) => {
        if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null || rex.match(/https:\/\/www.xiaohongshu.com\/search_result\/*/) != null ){
            if(is_stop)onStop()
        }
    });
    //修改按钮文字
    const stoppingHtml = ()=>{
        stopBtn.innerHTML="正在停止"
    }
    //停止脚本
    const onStop = (callback)=>{
        const device = localStorage.getItem('device_id');
        const login_phone = localStorage.getItem('phone');//手机
        const handle_name = localStorage.getItem('operator');//操作人
        const platform_name = localStorage.getItem('platform_name');
        const dataType = {
            "小红书":4,
            "抖音":1
        }
        req(apiHost+"/spider/browser/signoutKeyword",{device,login_phone,handle_name,type:mode_type,p_id:dataType[platform_name]},function(res){
            callback&& callback()
        })
    }
    const onSetForm = (type)=>{
        if(is_stop)onStop()
        //时间输入
        const date_time = document.getElementById('date_time');//时间
        const totals = document.getElementById('total');//总数
        const like_counts = document.getElementById('like_count');//点赞数
        const duras = document.getElementById('dura');//视频时长
        const input = document.getElementById('myInput')
        offsetTime =Number(date_time.value)
        total = Number(totals.value)
        like_count = Number(like_counts.value)
        dura = Number(duras.value)
        localStorage.setItem('date_time',offsetTime)
        localStorage.setItem('total', total)
        localStorage.setItem('like_count', like_count)
        localStorage.setItem('dura', dura)
        console.log(offsetTime,total,like_count,mode_type,dura,dyTagType,'123123')
    }

    function getDay() {//获取当日时间
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        let day = ('0' + currentDate.getDate()).slice(-2);
        let hours = ('0' + currentDate.getHours()).slice(-2);
        let minutes = ('0' + currentDate.getMinutes()).slice(-2);
        let seconds = ('0' + currentDate.getSeconds()).slice(-2);
        let formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return formattedDateTime
    }
    //获取cookie
    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    //读取面板信息
    const setDeviceId = ()=>{//设备标识
        const device_id = localStorage.getItem('device_id');
        const keyword = localStorage.getItem('keyword');
        const phone = localStorage.getItem('phone');//手机
        const operator = localStorage.getItem('operator');//操作人
        const totals = localStorage.getItem('total');//操作人
        // 获取input元素
        const input = document.getElementById('myInput')
        if(device_id) {input.value = device_id}// 读取localStorage中的数据
        if(keyword) {document.getElementById('keyword_text').innerHTML =keyword||""}
        document.getElementById('total').value =total||40
        document.getElementById('like_count').value =like_count||0
        document.getElementById('dura').value =dura||0
        if(offsetTime)document.getElementById('date_time').value =offsetTime
        if(phone)document.getElementById('xhsPhone').value =phone
        if(operator)document.getElementById('operator').value =operator
        document.querySelector(".version_id").innerHTML = version;
    }
    //设置当前抓取量
    const setPageNum = (num=0)=>{//当前已抓取数量
        if(num)localStorage.setItem('numbers',num)
        const numbers = localStorage.getItem('numbers');
        document.querySelector(".numbers").innerText = numbers||num;
    }
    //清除cookie
    function clearCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
    }
    //倒计时
    let intervals
    const countdown = (text,callback,time=60)=>{
        clearInterval(intervals); // 清除之前的计时器
        var countdownTimer = time;
        intervals = setInterval(function() {
            document.querySelector(".h1_content").style.display = "flex";
            document.getElementById("content_text").innerText =text;
            document.getElementById("countdown").innerText = countdownTimer;
            countdownTimer--;
            if (countdownTimer < 0) {
                clearInterval(intervals);
                document.querySelector(".h1_content").style.display = "none";
                clearCookies()
                if(callback) {
                    callback()
                }else{
                    window.location.reload();
                }
            }
        }, 1000);
    }
    //抓取上报
    const comeKeyword = (callback)=>{
        const device = localStorage.getItem('device_id');
        const login_phone = localStorage.getItem('phone');//手机
        const handle_name = localStorage.getItem('operator');//操作人
        const platform_name = localStorage.getItem('platform_name');
        const dataType = {
            "小红书":4,
            "抖音":1
        }
        req(apiHost+"/spider/browser/comeKeyword",{device,login_phone,handle_name,type:mode_type,p_id:dataType[platform_name]},function(res){
            callback()
        })
    }
    //日志上报
    const getError =(type,fail_page,sec_uid,search_nil_item,text,callback,ids)=>{
        const device = localStorage.getItem('device_id');
        const keyword = localStorage.getItem('keyword');
        const platform_name = localStorage.getItem('platform_name');
        const id = localStorage.getItem('id');
        const phone = localStorage.getItem('phone');//手机
        const operator = localStorage.getItem('operator');//操作人
        req("https://spider.oa.cyek.com/keywordReport",{type,keyword,id,device,fail_page,sec_uid,search_nil_item,version:version,platform_name,phone,operator,ids,mode_type},function(res){
            if(type !=1 &&text) countdown(text);
            if(type ==1){
                comeKeyword(()=>{
                    callback&&callback()
                })
            }else{
                callback&&callback()
            }
            console.log(`==============日志上传完成==============`)
        })
    }
    //抓取注册接口
    const getRegKeyword = (p_id,callback)=>{
        const device = localStorage.getItem('device_id');
        const login_phone = localStorage.getItem('phone');//手机
        const handle_name = localStorage.getItem('operator');//操作人
        req(apiHost+"/spider/browser/regKeyword",{device,handle_name,login_phone,type:mode_type,p_id},function(res){
           localStorage.setItem('is_stop',0);
            is_stop = 0
           callback()
        })
    }
//获取时间
    const getNinety = (time,callBack,errorback)=>{
        const now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDate = now.getDate();
        let currentHours = now.getHours();
        let currentMinutes = now.getMinutes();
        let currentSeconds = now.getSeconds();
        let currentMilliseconds = now.getMilliseconds();
        // 将偏移量转换为月数
        let monthsOffset = Math.floor(offsetTime) * 12 + Math.round((offsetTime % 1) * 12);
        // 应用偏移量到目标日期
        let targetDate = new Date(currentYear, currentMonth - monthsOffset, currentDate, currentHours, currentMinutes, currentSeconds, currentMilliseconds);
        let ninetyDaysAgo = targetDate.getTime();
        // 只抓小于天的视频
        if (time * 1000 < ninetyDaysAgo) {
            console.log(time * 1000, ninetyDaysAgo, "时间戳大于");
            errorback&& errorback()
        } else {
            //console.log(time * 1000, ninetyDaysAgo, "进入抓取列表");
            callBack()
        }
    }
    //获取时间
    const getNextYear = () => {
        const now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDate = now.getDate();
        let currentHours = now.getHours();
        let currentMinutes = now.getMinutes();
        let currentSeconds = now.getSeconds();
        let currentMilliseconds = now.getMilliseconds();
        // 将偏移量转换为月数
        let monthsOffset = Math.floor(offsetTime) * 12 + Math.round((offsetTime % 1) * 12);
        // 应用偏移量到目标日期
        let targetDate = new Date(currentYear, currentMonth - monthsOffset, currentDate, currentHours, currentMinutes, currentSeconds, currentMilliseconds);
        return targetDate.getTime();
    }
    //请求小红书无水印视频
    function getXhsInfo(noteId,sec_uid,xsec_token,callback){
       alert("此方法已失效")
    }
     //抖音视频发文
    if(rex.match(/https:\/\/www.douyin.com\/video\/*/)){
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        if(!isKeyword)return
        const token = localStorage.getItem("token");
        $(".cyloading").show()
       const originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function() {
                const self = this;
                // 监听readystatechange事件，当readyState变为4时获取响应
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/aweme\/detail\/*/) != null) {
                            // 在获取到响应后执行你的操作
                            const json = JSON?.parse(self?.response||"null");
                            const detail = json?.aweme_detail
                            if(json){
                                const data = {
                                    ukey:"sec_uid",
                                    uvalue:detail?.author?.sec_uid,
                                    title:detail?.desc,
                                    desc:detail?.desc,
                                    outside_video_id:detail?.aweme_id,
                                    type:detail?.media_type?detail?.media_type==4?1:2:0,
                                    collect_count:detail?.statistics?.collect_count,
                                    comment_count:detail?.statistics?.comment_count ,
                                    digg_count:detail?.statistics?.digg_count,
                                    share_count:detail?.statistics?.share_count,
                                    cate:JSON.stringify(detail?.video_tag),
                                    tag:JSON.stringify(detail?.text_extra),
                                    cover:detail?.video.cover?.url_list?.[0],
                                    cover_list:JSON.stringify(detail?.video?.cover?.url_list),
                                    cover_width:detail?.video?.cover?.width,
                                    cover_height:detail?.video?.cover?.height,
                                    play_addr:JSON.stringify(detail?.video.play_addr),
                                    bit_rate:JSON.stringify(detail?.video.bit_rate),
                                    video_dura:Math.round(Number(detail?.video?.duration/1000)) ||Math.round(Number(detail?.duration/1000)),
                                    video_width:detail?.video.play_addr.width,
                                    video_height:detail?.video.play_addr.height,
                                    goods_info:detail?.anchor_info?.extra||JSON.stringify([]),
                                    video_size:detail?.video.play_addr.data_size,
                                    post_time:detail?.create_time,
                                    images:JSON.stringify(detail?.images),
                                    is_top:detail?.is_top
                                }
                                console.log(data,'data')
                                return
                                let saveUid = {
                                    "platform_id":1,
                                    "app_type": "tools_" + 1,
                                    "app_id": "1",
                                    "sign": "1",
                                    "sec_uid":detail?.author?.sec_uid,
                                    "access_token": token,
                                    "result": JSON.stringify([data])
                                }
                                req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                                    console.log('发文信息获取完毕，关闭页面')
                                    setTimeout(()=>{
                                        window.close()
                                        $(".cyloading").hide()
                                    },3000)
                                })
                                }else{
                                    setTimeout(()=>{
                                        window.close()
                                    },3000)
                                }
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
      countdown("页面重新加载",()=>window.close())
    }
    //用户页
    if(rex.match(/https:\/\/www.douyin.com\/user\/*/) != null){
        window.onload = function() {//是否私密账号
            console.log(document.getElementsByClassName("wc0JjzHZ").length>0,"是否私密账号")
            if(document.getElementsByClassName("wc0JjzHZ").length>0)return window.close()
        }
        document.querySelector(".cyBtn").style.display = 'none';
        document.querySelector(".phone_item").style.display = 'none';
        setDeviceId()
        setPageNum()
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        if(!isKeyword)return
        console.log("页面加载成功")
        const keyword = localStorage.getItem('keyword');
        const search_keyword_id = urlParams.get('id');
        const num = urlParams.get('num');
        if(Number(num)) total = num
        const wid = urlParams.get('wid');
        const sec_uid = unsafeWindow.location.pathname.split("/")[2]
        const token = localStorage.getItem("token");
        $(".cyloading").show()
        $(".stop_btn").show()
        let interval
        let i = 0
        let link_list = []
        let all_list = []
        function tabClick(){
            console.log("服务异常点击")
            // 找到要点击的页面元素
            var elementToClick = document.querySelector('.NLLHhkaY');
            // 创建一个点击事件
            var clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: false,
                view: unsafeWindow
            });
            elementToClick.dispatchEvent(clickEvent);
        }
        const onScroll=()=> {
            console.log("开始滚动")
            var div = document.querySelector(".IhmVuo1S");
            var divHeight = div?.getBoundingClientRect()?.height;
            interval = setInterval(()=> {
                if(document.getElementsByClassName("o5yEfo2D").length>0){
                    $(".cyloading").hide()
                    return alert("请登录抖音账号再抓取")
                }
                if(document.getElementsByClassName("B_mbw29p").length <= 0) {
                    div.scrollBy(divHeight * i, divHeight * (i+1));
                    console.log(divHeight * i, divHeight * (i+1))
                    i++
                } else {
                    console.log('stop')
                    if(document.getElementsByClassName("NLLHhkaY").length > 0)setTimeout(()=>tabClick(),5000)
                    document.querySelectorAll(".B_mbw29p")[0]?.scrollIntoViewIfNeeded()
                    clearInterval(interval);
                    return
                }
            }, 5000);
        };
        let nextYear = getNextYear();
        let originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self.responseURL.match(/https:\/\/www-hj.douyin.com\/aweme\/v1\/web\/aweme\/post\/*/) != null) {
                        // 在获取到响应后执行你的操作
                       // if(!self?.response) return window.location.reload()
                        var json = JSON.parse(self?.response||"{}");
                        let aweme_list = json?.aweme_list
                       if(Array.isArray(aweme_list)&&aweme_list.length>0) all_list = all_list.concat(aweme_list.filter(e=>e?.media_type==4&&e?.create_time * 1000>nextYear&&e?.statistics?.digg_count>=like_count&&(Math.round(Number(e?.video?.duration/1000)) ||Math.round(Number(e?.duration/1000)))>=dura))
                        if(json.has_more) {//有数据
                            if(all_list.length>=36){
                                clearInterval(interval);
                                const sliceArr = all_list.splice(0,36)
                                getResult(sliceArr,()=>{
                                    // all_list.splice(0,36)
                                    console.log("还剩下",all_list.length)
                                    if(link_list.length>= total) {//抓取足够数量
                                        getSearchResult()
                                    }else{
                                        onScroll()
                                    }
                                })
                            }else{
                                console.log(i,"i")
                                if(i==0) onScroll()
                            }
                        }else{
                            clearInterval(interval);
                            if(json.has_more == 0) {
                                if(all_list?.length>0){
                                    console.log("最终还剩下",all_list.length)
                                    getResult(all_list,()=>{
                                        getSearchResult()
                                    })
                                }else{
                                    getSearchResult()
                                }
                            }else{
                                countdown("抖音获取数据失败",()=>window.close(),1200)
                            }
                        }
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
        function getResult(list,callback){
            let videoList = list.map(e=>(
                {
                    ukey:"sec_uid",
                    uvalue:e?.author?.sec_uid,
                    title:e?.desc,
                    desc:e?.desc,
                    outside_video_id:e?.aweme_id,
                    type:e?.media_type?e?.media_type==4?1:2:0,
                    collect_count:e?.statistics?.collect_count,
                    comment_count:e?.statistics?.comment_count ,
                    digg_count:e?.statistics?.digg_count,
                    share_count:e?.statistics?.share_count,
                    cate:JSON.stringify(e?.video_tag),
                    tag:JSON.stringify(e?.text_extra),
                    cover:e?.video.cover?.url_list[0],
                    cover_list:JSON.stringify(e?.video?.cover?.url_list),
                    cover_width:e?.video?.cover.width,
                    cover_height:e?.video.cover.height,
                    play_addr:JSON.stringify(e?.video.play_addr),
                    bit_rate:JSON.stringify(e?.video.bit_rate),
                    video_dura:Math.round(Number(e?.video?.duration/1000)) ||Math.round(Number(e?.duration/1000)),
                    video_width:e?.video.play_addr.width,
                    video_height:e?.video.play_addr.height,
                    video_size:e?.video.play_addr.data_size,
                    post_time:e?.create_time,
                    images:JSON.stringify(e?.images),
                    is_top:e?.is_top
                }
            ))
            link_list = link_list.concat(videoList)
            setPageNum(link_list.length+1)
            console.log(videoList,'aweme_list')
            let saveUid = {
                "platform_id":1,
                "app_type": "tools_" + 1,
                "app_id": "1",
                "sign": "1",
                "sec_uid":videoList[0].uvalue,
                "access_token": token,
                "result": JSON.stringify(videoList)
            }
            req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                console.log('发文信息上传完毕',videoList.length)
                callback()
            })
        }
        const getSearchResult = ()=>{
            const newArr = link_list.map(e=>({outside_video_id:e.outside_video_id,sec_uid:e.uvalue,type:e?.type}))
            let urlData = {
                search_keyword_id,
                platform_id: 4,
                type:mode_type,
                result: JSON.stringify(newArr),
            }
            console.log(link_list,'aweme_list')
            req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                console.log(`总共${link_list.length}条数据信息抓取完毕`)
                // 数据处理结束
                // 调用接口拿到下一个 keyword
                  // 调用接口拿到下一个 keyword
             getError(1,link_list.length,'','','',()=>{
                 link_list = []
                 i=0
                 localStorage.removeItem("numbers")
                 setPageNum(0)
                 window.close()
             })
            })
        }
        return
        //以下是用户信息同步功能 暂时不用
            let user;
            // 拦截响应
          //  const originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function() {
                var self = this;
                // 监听readystatechange事件，当readyState变为4时获取响应
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/user\/profile\/other\/*/) != null) {
                            // 在获取到响应后执行你的操作
                            var json = JSON.parse(self.response);
                            let user = json.user
                            let account_tag,cert;
                            // 判断抖音达人账号类别
                            if(user?.is_ban == true){
                                account_tag = "封禁号"
                            }else if(user?.is_ban == undefined){
                                account_tag = "注销号"
                            }else if(user?.enterprise_verify_reason != ""){
                                account_tag = "蓝v"
                                cert =user?.enterprise_verify_reason
                            }else if(user?.custom_verify != ""){
                                account_tag = "黄v"
                                cert =user?.user?.custom_verify
                            }

                            // 检测达人是否可以绑定
                            var dataBind = {
                                "app_type": "tools_"+1,
                                "app_id": 1,
                                "sign": 1,
                                "access_token": token,
                                "sec_uid": sec_uid,
                                "platform_id": 1,
                                "link": window.location.href,
                                "author_id":  user?.uid,
                                "nick": user?.nickname,
                                "account": user?.unique_id,
                                "avatar": user?.avatar_300x300.url_list[0],
                                "desc": user?.signatur,
                                "like_count": user?.total_favorited,
                                "fans_count": user?.mplatform_followers_count,
                                "video_count": user?.aweme_count,
                                "cate_str": '',
                                "sex": user?.basic_info?.gender == 0 ? 1 : 2,
                                "diy":{
                                    "short_id": user?.short_id,
                                    "location": user?.ip_location ? user?.ip_location?.split("：")[1] : "",
                                    "cert":cert||"",
                                },
                                "v": "5.5.2",
                                "account_tag": account_tag
                            }
                            req(apiHost+"/spider/browser/syncInfo",dataBind,function(response){
                                console.log('用户信息获取完毕',dataBind)
                                setTimeout(function() {
                                    window.close()
                                    $(".cyloading").hide()
                                }, 3000);
                                // getWorkData()
                            })
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
        countdown("页面刷新倒计时",()=>window.location.reload())
        function getWorkData(){
            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                sec_user_id: sec_uid,
             //   max_cursor: dy_max_cursor,
                locate_query: false,
                show_live_replay_strategy: 1,
                count: 18,
                publish_video_strategy_type: 2,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 2560,
                screen_height: 1440,
                browser_language: "zh-CN",
                browser_platform: "Win32",
                browser_name: "Chrome",
                browser_version: "114.0.0.0",
                browser_online: true,
                engine_name: "Blink",
                engine_version: "114.0.0.0",
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 6.95,
                effective_type: "4g",
                round_trip_time: 100,
             //   webid: decode.app.odin.user_unique_id,
            }

            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/aweme/post/",
                data: dataVideo,
                timeout: 100000, // 设置超时时间为100000毫秒（100秒）
                headers: {
                    Accept: "application/json, text/plain, */*"
                },
                beforeSend: function(res,settings){
                    Object.freeze(settings);
                },
                success: function (res) {
                    if(!res?.aweme_list){
                        getError(2,1,sec_uid,'发文数据获取失败',"发文数据获取失败")
                        $(".cyloading").hide()
                        return
                    }
                    // 定义数组来接收数据
                    let videoData = res.aweme_list
                    videoData = videoData.map(e=>({
                        ukey:"sec_uid",
                        uvalue:sec_uid,
                        title:e?.desc,
                        desc:e?.desc,
                        outside_video_id:e?.aweme_id,
                        type:e?.media_type?e.media_type ==4?1:2:'',
                        collect_count:e?.statistics?.collect_count,
                        comment_count:e?.statistics?.comment_count ,
                        digg_count:e?.statistics?.digg_count,
                        share_count:e?.statistics?.share_count,
                        cate:JSON.stringify(e?.video_tag),
                        tag:JSON.stringify(e?.text_extra),
                        cover:e?.video.cover?.url_list[0],
                        cover_list:JSON.stringify(e?.video.cover?.url_list),
                        cover_width:e?.video?.cover.width,
                        cover_height:e?.video.cover.height,
                        play_addr:JSON.stringify(e?.video.play_addr),
                        bit_rate:JSON.stringify(e.video.bit_rate),
                        video_dura:e?.music?.video_duration ||Math.round(Number(e.duration/1000)),
                        video_width:e.video.play_addr.width,
                        video_height:e.video.play_addr.height,
                        video_size:e.video.play_addr.data_size,
                        post_time:e?.create_time,
                        images:JSON.stringify(e?.images),
                        is_top:e.is_top
                    }))
                    console.log(videoData,"video2")
                    let saveUid = {
                        "platform_id":1,
                        "app_type": "tools_" + 1,
                        "app_id": "1",
                        "sign": "1",
                        "sec_uid":sec_uid,
                        "access_token": token,
                        "result": JSON.stringify(videoData)
                    }
                    req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                        console.log('发文信息获取完毕，关闭页面')
                        setTimeout(function() {
                             isKeyword && window.close()
                            $(".cyloading").hide()
                        }, 4000);
                    })
                },
                error: function(fail, textStatus, errorThrown){
                    $(".cyloading").hide()
                     // 请求失败或超时的回调函数
                    if (textStatus === 'timeout') {
                        getError(2,1,sec_uid,'请求超时',"请求超时")
                    } else {
                        getError(2,1,sec_uid,'发文数据获取失败',"发文数据获取失败")
                    }
                }
            });
        }
    }else if(rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) != null){
        document.querySelector(".cyBtn").style.display = 'none';
        document.querySelector(".xhsTag_type").style.display = 'flex';
        document.querySelector(".xhsCate_type").style.display = 'flex';
        setPageNum()
        setDeviceId()
        // 获取小红书数据
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        let xhs_secUid = window.location.pathname.split("/")
        let sec_uid = xhs_secUid[xhs_secUid.length - 1];
        const isKeyword = urlParams.get('type');
        const search_keyword_id = urlParams.get('search_keyword_id');
        const isUserType= urlParams.get('userType');//是否抓取用户主页视频
        if(!isKeyword)return
        $(".cyloading").show()
        $(".stop_btn").show()
        window.onload = function() {
            let user = unsafeWindow?.__INITIAL_STATE__?.user.userPageData?._rawValue
              console.log('页面加载完毕！',user,sec_uid);
            let userData = {
                target_user_id: sec_uid
            }
            if(typeof(user) != "undefined" && user !== null && Object.keys(user).length != 0){
                console.log("window拿到用户接口")
                user.basic_info = user.basicInfo
                redInfo(user)
            }else{
            return countdown("获取不到用户信息，请刷新重试",()=>window.location.reload())
            }
            //同步用户信息
            function redInfo(user){
                // 粉丝数
                let fansCount = user.interactions[1].count.replace("+","")
                let fans_count;
                // console.log(fansCount)
                if(fansCount.indexOf("k") != -1){
                    fans_count = fansCount.replace("k","")*1000
                }else if(fansCount.indexOf("万") != -1){
                    fans_count = fansCount.replace("万","")*10000
                }else{
                    fans_count = fansCount
                }
                // 抖音author_id
                let author_id = xhs_secUid[xhs_secUid.length - 1];
                // 昵称
                let nick = user.basic_info.nickname;
                // account号
                let account = user.basic_info.redId;
                // 分类
                let cate = "";
                // 获赞数
                let like_count_num = "";
                // 位置
                let location = user.basic_info.ipLocation;
                // 头像
                let avatar = user.basic_info.imageb;
                // 简介
                let desc = user.basic_info.desc;
                // 获赞数
                let likeCount = user.interactions[2].count.replace("+","")
                if(likeCount.indexOf("k") != -1){
                    like_count_num = likeCount.replace("k","")*1000
                }else if(likeCount.indexOf("w") != -1){
                    like_count_num = likeCount.replace("w","")*10000
                }else{
                    like_count_num = likeCount
                }
                // 作品数
                let video_count = "";
                // 平台id
                let platform_id = 4;
                // 性别
                let sex = user.basic_info.gender == 0 ? 1 : 2;
                let account_tag, cert;
                let userType = user?.verifyInfo?.redOfficialVerifyType
                // 要搜索的字段名称和文本
                let field = 'name';
                let searchText = /博主/; // 正则表达式，匹配含有'an'的文本
                let certName = user?.tags?.find(e=>e?.tagType=="profession"&&searchText.test(e[field]))?.name
                if(userType == 2){
                    account_tag = "蓝v"
                    cert = nick
                }else if(userType == 1){
                    account_tag = "红v"
                    cert = nick
                }else if(certName){
                    account_tag = "定向博主"
                    cert = certName ||""
                }
                // 自定义字段
                let diy = {
                    "location": location,
                    "cert":cert||"",
                    "userType":userType
                };
                var dataBind = {
                    "app_type": "tools_"+platform_id,
                    "app_id": 1,
                    "sign": 1,
                    "sec_uid": sec_uid,
                    "platform_id": platform_id,
                    "link": window.location.href,
                    "author_id": author_id,
                    "nick": nick,
                    "account": account,
                    "avatar": avatar,
                    "desc": desc,
                    "like_count": like_count_num,
                    "fans_count": fans_count,
                    "video_count": video_count,
                    "cate_str": cate,
                    "sex": sex,
                    "diy": diy,
                    "account_tag":account_tag||"",
                    "v": version
                }
                req(apiHost+"/spider/browser/syncInfo",dataBind,function(response){
                    console.log('用户信息同步完毕',dataBind)
                    setTimeout(function() {
                        if(isUserType){
                            getDom()
                        }else{
                            window.close()
                            $(".cyloading").hide()
                        }
                    }, 5000);
                })
            }
           //获取用户主页视频
            let videoElement = [];
            let aweme_list = []
            let interval
            let i = 0
            function getDom() {
                var parentElement = document.getElementById('userPostedFeeds');
                var childElements = parentElement.getElementsByTagName('section');

                for (var i = 0; i < childElements.length; i++) {
                    var spanElements = childElements[i].querySelector('span.play-icon');
                    if (!!spanElements) {
                        const href =childElements[i].querySelectorAll('div > a')[1].href;
                        // 使用URLSearchParams对象解析链接中的参数
                        let params = new URLSearchParams(href.split('?')[1]);
                        // 获取xsec_token的值
                        let xsec_token = params.get("xsec_token");
                        const url = childElements[i].querySelectorAll('div > a')[0].href//lastMatchingElement.href
                        const startIndex = url.indexOf("explore/") + "explore/".length;
                        const endIndex = url.length;
                        const note_id = url.slice(startIndex, endIndex);
                        videoElement.push({note_id,xsec_token})
                    }
                }
                console.log(videoElement,'videoElement')
                if(videoElement.length>0) {
                    moreData(videoElement,0,()=>{
                        //数据处理完毕 开始滚动
                        getSearchResult(()=>{
                            onScroll()
                        })
                    })
                    // 返回或者继续其他操作
                }else{
                    onScroll()
                   // getError(2,1,sec_uid,'无法找到相关视频',"无法找到相关视频")
                }

            }
            let stop = 0
            const onScroll=()=> {
                var div = document.querySelector(".feeds-container");
                var divHeight = div?.getBoundingClientRect()?.height||0;
                interval = setInterval(()=> {
                     stop++
                    console.log(stop,'stop')
                    if(stop<10) {
                        window.scrollTo(divHeight * i, divHeight * (i+1));
                        console.log(divHeight * i, divHeight * (i+1))
                        i++
                    } else {
                        console.log('stop')
                        document.querySelectorAll(".end-container")[0]?.scrollIntoViewIfNeeded()
                        clearInterval(interval);
                        stop = 0
                        getSearchResult()
                    }
                }, 3000);
            };
            // 拦截响应
            let originalSend = XMLHttpRequest.prototype.send;
            let isScroll = false
            let all_list = []
            XMLHttpRequest.prototype.send = function() {
                let self = this;
                // 监听readystatechange事件，当readyState变为4时获取响应
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        if (self.responseURL.match(/https:\/\/edith.xiaohongshu.com\/api\/sns\/web\/v1\/user_posted\/*/) != null) {
                            stop = 0
                            if(!self?.response) return
                            // 在获取到响应后执行你的操作
                            let json = JSON.parse(self.response);
                            let data = json?.data?.notes;
                            console.log(all_list.length,'all_list')
                            //过滤不是视频的数据/和点赞数小于min_liked_count
                            if(Array.isArray(data)&&data.length>0) all_list = all_list.concat(data.filter(item =>item?.type=="video"&&item?.user?.user_id&&item?.interact_info?.liked_count>=like_count))
                            if(Array.isArray(data) && json?.data?.has_more){
                                console.log(all_list.length,'all_list',like_count,total)
                                if(all_list.length>0 && !isScroll){
                                    console.log("拿满了")
                                    isScroll = true
                                    clearInterval(interval);
                                    const sliceArr = all_list.splice(0,40)
                                    moreData(sliceArr,0,()=>{
                                        isScroll =false
                                        getSearchResult(()=>{
                                            onScroll(); // 继续滚动
                                        })
                                    })
                                }else{
                                    if(all_list.length==0) onScroll()
                                }
                            }else{
                                clearInterval(interval);
                                console.log("拉到底了has_more",json?.data?.has_more)
                                if(all_list.length>0) {
                                    moreData(all_list,0,()=>{
                                       if(aweme_list.length>0){
                                           getSearchResult()
                                       }else{
                                           getError(2,aweme_list.length,'','搜索未找到满足条件的数据:'+self.response)
                                           window.close()
                                       }
                                    })
                                }else if(aweme_list.length>0){
                                    getSearchResult()
                                }else{
                                    if(json?.code == -1 ||json?.msg=="网页版搜索次数已达今日上限，可以去小红书App继续搜索"){
                                        getError(4,aweme_list.length,'','网页版搜索次数已达今日上限，可以去小红书App继续搜索:'+self.response)
                                        countdown("小红书搜索数据失败",()=>window.close(),43200)
                                        return
                                    }
                                    //小红书账号失效
                                    if(json?.code == 104) return alert("小红书账号异常")
                                    if(document.getElementsByClassName("search-empty-text").length>0||document.getElementsByClassName("search-empty-wrapper").length>0){
                                        console.log("关闭")
                                        window.close()
                                    }else{
                                        console.log(json,'json')
                                        getError(4,aweme_list.length,"小红书搜索数据异常data"+self.response)
                                        window.close()
                                    }
                                }
                            }
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
            //拿取下一条数据
            const moreData = (arr,index,callback)=>{
                let batchList = arr.slice(index, index +1);
                //处理这一条数据
                if (batchList.length>0 ||index < arr.length){
                    console.log(`${index+1}条数据截取`,getDay())
                    getResData(arr,index,callback)
                }else{//所有数据同步完毕
                    callback()
                }
            }
            const getResData = (arr,index,callback)=>{
                if(aweme_list.some(e=>e?.note_id==arr[index]?.note_id)){//相同的跳过
                    moreData(arr,index+1,callback)
                }else{
                    localStorage.setItem('xhsIsHandle',1)//是否需要数据处理
                    window.open("https://www.xiaohongshu.com/explore/"+arr[index]?.note_id+`?xsec_token=${arr[index]?.xsec_token}&xsec_source=pc_search&type=keyword&userType=1`)
                    document.onvisibilitychange=()=>{
                        if(!document.hidden){
                            let dataPass = localStorage.getItem("xhsIsPass")
                            if(!document.hidden){
                                const isStop = localStorage.getItem('is_stop');//是否关闭脚本
                                if(Number(isStop)) {
                                    stoppingHtml()
                                    getSearchResult()
                                }else{
                                    if(Number(dataPass)) {
                                        setPageNum(aweme_list.length+1)
                                        aweme_list.push(arr[index])
                                        moreData(arr,index+1,callback)
                                    }else{
                                        //不合规的跳过
                                        moreData(arr,index+1,callback)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //最终数据提交
            const getSearchResult = (callback)=>{
                isScroll = false
                clearInterval(interval);
                console.log("数据提交",aweme_list.length)
                if(aweme_list.length<=0 &&!callback)return window.close()
                const newArr = aweme_list.map(e=>({outside_video_id:e?.note_id,sec_uid:sec_uid,type:1}))
                let urlData = {
                    search_keyword_id,
                    keyword:'',
                    platform_id: 4,
                    type:mode_type,
                    result: JSON.stringify(newArr),
                }
                console.log(aweme_list.length,'aweme_list')
                req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                    console.log(`总共${aweme_list.length}条数据信息抓取完毕`)
                    // 数据处理结束
                    console.log(`==============${unsafeWindow.location.search}链接抓取完毕==============`,getDay())
                    // 调用接口拿到下一个 keyword
                    getError(1,aweme_list.length,'','','',()=>{
                        if(callback){
                            aweme_list = []
                            callback()
                        }else{
                            i=0
                            localStorage.removeItem("numbers")
                            setPageNum(0)
                            window.close()
                        }
                    },JSON.stringify(aweme_list.map(e=>({outside_video_id:e?.note_id,title:e?.display_title}))))
                })
            }
            };
       if(!isUserType) countdown("页面刷新倒计时",()=>window.location.reload())
    }
//抖音标签页
if(rex.match(/https:\/\/www.douyin.com\/hashtag\/*/) != null){
    setDeviceId()
    document.querySelector(".phone_item").style.display = 'none';
    const urlParams = new URLSearchParams(unsafeWindow.location.search);
    const isKeyword = urlParams.get('type');
    const search_keyword_id = urlParams.get('id');
    const num = urlParams.get('num');
    if(Number(num)) total = num
    if(!isKeyword)return
   // $(".cyloading").show()
    const token = localStorage.getItem("token");
    let interval
    let i = 0
    let link_list = []
    let all_list = []
    function tabClick(){
        console.log("服务异常点击")
        // 找到要点击的页面元素
        var elementToClick = document.querySelector('.NLLHhkaY');
        // 创建一个点击事件
        var clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: false,
            view: unsafeWindow
        });
        elementToClick.dispatchEvent(clickEvent);
    }
    const onScroll=()=> {
        console.log("开始滚动")
        var div = document.querySelector(".K0lNPshL").nextElementSibling;
        var divHeight = div?.getBoundingClientRect()?.height;
        interval = setInterval(()=> {
            if(document.getElementsByClassName("B_mbw29p").length <= 0) {
                div.scrollTo(divHeight * i, divHeight * (i+1));
                console.log(divHeight * i, divHeight * (i+1))
                i++
            } else {
                console.log('stop')
                if(document.getElementsByClassName("NLLHhkaY").length > 0)setTimeout(()=>tabClick(),5000)
                document.querySelectorAll(".B_mbw29p")[0]?.scrollIntoViewIfNeeded()
                clearInterval(interval);
                return
            }
        },5000);
    };
    let originalSend = XMLHttpRequest.prototype.send;
    let nextYear = getNextYear();
    XMLHttpRequest.prototype.send = function() {
        var self = this;
        // 监听readystatechange事件，当readyState变为4时获取响应
        this.onreadystatechange = function() {
            if (self.readyState === 4) {
                if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/challenge\/aweme\/*/) != null) {
                    // 在获取到响应后执行你的操作
                    if(!self?.response) return window.location.reload()
                    var json = JSON.parse(self.response);
                    let aweme_list = json?.aweme_list;
                    if(Array.isArray(aweme_list)&&aweme_list.length>0) all_list = all_list.concat(aweme_list.filter(e=>e?.media_type==4&&e?.create_time * 1000>nextYear&&e?.statistics?.digg_count>=like_count&&(Math.round(Number(e?.video?.duration/1000)) ||Math.round(Number(e?.duration/1000)))>=dura))
                    if(json.has_more) {//有数据
                        console.log(all_list.length,'all_list.length')
                        if(all_list.length>=36){
                            clearInterval(interval);
                            const sliceArr = all_list.splice(0,36)
                            getResult(sliceArr,()=>{
                                console.log("还剩下",all_list.length)
                                if(link_list.length>= total) {//抓取足够数量
                                    getSearchResult()
                                }else{
                                    onScroll()
                                }
                            })
                        }else{
                            console.log(i,"i")
                            if(i==0) onScroll()
                        }
                    }else{
                        clearInterval(interval);
                        if(json.has_more == 0) {
                            if(all_list?.length>0){
                                console.log("最终还剩下",all_list.length)
                                getResult(all_list,()=>{
                                    getSearchResult()
                                })
                            }else{
                                getSearchResult()
                            }
                        }else{
                            countdown("抖音获取数据失败",()=>window.close(),1200)
                        }
                    }
                }
            }
        };
        // 调用原始的send方法
        originalSend.apply(this, arguments);
    };
    function getResult(list,callback){
        let videoList = list.map(e=>(
            {
                ukey:"sec_uid",
                uvalue:e?.author?.sec_uid,
                title:e?.desc,
                desc:e?.desc,
                outside_video_id:e?.aweme_id,
                type:e?.media_type?e?.media_type==4?1:2:0,
                collect_count:e?.statistics?.collect_count,
                comment_count:e?.statistics?.comment_count ,
                digg_count:e?.statistics?.digg_count,
                share_count:e?.statistics?.share_count,
                cate:JSON.stringify(e?.video_tag),
                tag:JSON.stringify(e?.text_extra),
                cover:e?.video.cover?.url_list[0],
                cover_list:JSON.stringify(e?.video?.cover?.url_list),
                cover_width:e?.video?.cover.width,
                cover_height:e?.video.cover.height,
                play_addr:JSON.stringify(e?.video.play_addr),
                bit_rate:JSON.stringify(e?.video.bit_rate),
                video_dura:Math.round(Number(e?.video?.duration/1000)) ||Math.round(Number(e?.duration/1000)),
                video_width:e?.video.play_addr.width,
                video_height:e?.video.play_addr.height,
                video_size:e?.video.play_addr.data_size,
                post_time:e?.create_time,
                images:JSON.stringify(e?.images),
                is_top:e?.is_top
            }
        ))
        link_list = link_list.concat(videoList)
        setPageNum(link_list.length+1)
        console.log(videoList,'aweme_list')
        let saveUid = {
            "platform_id":1,
            "app_type": "tools_" + 1,
            "app_id": "1",
            "sign": "1",
            "sec_uid":videoList[0].uvalue,
            "access_token": token,
            "result": JSON.stringify(videoList)
        }
        req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
            console.log('发文信息上传完毕',videoList.length)
            callback()
        })
    }
    const getSearchResult = ()=>{
        const newArr = link_list.map(e=>({outside_video_id:e.outside_video_id,sec_uid:e.uvalue,type:e?.type}))
        let urlData = {
            search_keyword_id,
            platform_id: 4,
            type:mode_type,
            result: JSON.stringify(newArr),
        }
        console.log(link_list,'aweme_list')
        req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
            console.log(`总共${link_list.length}条数据信息抓取完毕`)
            // 数据处理结束
            // 调用接口拿到下一个 keyword
             getError(1,link_list.length,'','','',()=>{
                 link_list = []
                 i=0
                 localStorage.removeItem("numbers")
                 setPageNum(0)
                 window.close()
             })
        })
    }
}
//搜索页
    if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null){
        setDeviceId()
        document.querySelector(".phone_item").style.display = 'none';
        document.querySelector(".dyTag_type").style.display = 'flex';
        document.querySelector(".anchorCate_type").style.display = 'flex';
        // 获取抖音json数据
        const jsonScript = document.querySelector('script.STREAM_RENDER_DATA[type="application/json"]');
        const jsonContent = jsonScript?.textContent||"{}";
        const decodeObj = JSON.parse(jsonContent);
        let text = $("#RENDER_DATA").text();
        let decode = JSON.parse(decodeURIComponent(text));
        console.log(decode,'decode');
        const browser_name = decode?.app?.browserInfo?.browser|| decodeObj?.value?.browserInfo?.browser
        const browser_version = decode?.app?.browserInfo?.browser_version|| decodeObj?.value?.browserInfo?.browser_version
        const webid = decode?.app?.odin?.user_unique_id||decodeObj?.value?.odin?.user_unique_id
        let dyCookie = getCookie("msToken")
        let dyoffset = 0
        let linkArr = []
        let need_filter_settings = 1
        let search_id
        let keyword
        let search_keyword_id
        function getDyData(){
            let searchParams = Number(dyTagType)? {
                sort_type:dyTagType,
                publish_time: 0
            }:{};
            $(".cyloading").show()
            $(".stop_btn").show()
            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                search_channel: "aweme_video_web",
                enable_history: 1,
                ...searchParams,
                keyword: keyword,
                search_source:"normal_search",
                is_filter_search:0,
                query_correct_type: 1,
                from_group_id: "",
                offset: dyoffset,
                count:10,
                need_filter_settings: 1,
                list_type: "single",
                update_version_code: 170400,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 1920,
                screen_height: 1080,
                search_id: search_id,
                browser_language: "zh-CN",
                browser_platform: "Win32",
                browser_name,
                browser_version,
                browser_online: true,
                engine_name: "Blink",
                engine_version: browser_version,
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 10,
                effective_type: "4g",
                round_trip_time: 100,
                webid,
                // msToken: "",
                // "X-Bogus": "DFSzswVORDtANt/ltTElNl9WX7rs",
            }
            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/search/item/",
                data: dataVideo,
                dataType: "json",
                 timeout: 100000, // 设置超时时间为10000毫秒（10秒）
                error: function(fail,textStatus, errorThrown){
                    $(".cyloading").hide()
                     // 请求失败或超时的回调函数
                    if (textStatus === 'timeout') {
                        getError(4,0,'','搜索请求超时',"请求超时")
                        console.log('请求超时！');
                    }else{
                        getError(4,0,'','搜索请求失败',"请求失败")
                        countdown("搜索请求失败",()=> getDyData(),1200)
                    }
                },
                success: function (res) {
                    console.log(res)
                    dyoffset+=10
                    need_filter_settings = 0
                    search_id = res.log_pb.impr_id
                    if(res?.data == undefined ||(res?.data?.length == 0 && res?.search_nil_info?.is_load_more != "is_load_more"||res?.search_nil_info?.search_nil_type=="verify_check")){
                        getError(4,0,'','搜索接口出错data:'+JSON.stringify(res.data))
                        //如果还有数据
                        if(linkArr.length>0) saveSearch()
                        countdown("抖音搜索数据获取失败",()=> getKeyword(),4800)
                        return
                    }else{
                        let filterArr = []
                        if(Array.isArray(res?.data)&&res?.data.length>0) {//数据处理
                            res.data.forEach((item,index)=>{
                                if(linkArr.some(e=>e?.aweme_info?.aweme_id == item.aweme_info.aweme_id)) {//有重复
                                    console.log("有重复跳过")
                                }else{
                                    let nextYear = getNextYear();
                                    console.log(nextYear,item.aweme_info?.create_time,like_count,"信息",offsetTime)//e?.aweme_info?.anchor_info?.type==3?JSON.parse(e?.aweme_info?.anchor_info?.extra)?.[0]?.product_id
                                    if (item.aweme_info?.create_time * 1000>nextYear&&
                                        item?.aweme_info?.statistics?.digg_count>=like_count&&
                                        item?.aweme_info?.aweme_type==0&&
                                        (Math.round(Number(item?.aweme_info?.video?.duration/1000)) || Math.round(Number(item?.aweme_info?.duration/1000)))>=dura&&
                                        (isAnchor?item?.aweme_info?.anchor_info?.type==3&&JSON.parse(item?.aweme_info?.anchor_info?.extra)?.[0]?.product_id:1)) {
                                        filterArr.push(item)
                                    } else {
                                        console.log(item.aweme_info?.create_time * 1000,
                                                    nextYear+"年前的数据丢弃,点赞数"+item?.aweme_info?.statistics?.digg_count,
                                                    "视频类型"+item?.aweme_info?.aweme_type,"视频时长："+Math.round(Number(item?.aweme_info?.video?.duration/1000))||Math.round(Number(item?.aweme_info?.duration/1000))
                                                    ,getDay(),'是否强校验：'+isAnchor+item?.aweme_info?.anchor_info?.type);
                                    }
                                }
                            })
                        }
                        if(filterArr.length>0 ){//如果有数据开始处理
                            moreData(filterArr,0)//获取发文
                        }else{
                            if(res?.data?.has_more) {//还有下一页数据
                                countdown("准备抓取下一波数据",()=> getDyData(),10)
                            }else{//没有数据了
                                if(linkArr.length>0) {//有数据直接提交
                                    saveSearch()
                                }else{
                                    getError(2,linkArr.length,'','搜索未找到满足条件的数据:'+JSON.stringify(res))
                                    dyoffset = 0
                                    need_filter_settings = 1
                                    search_id = null
                                    localStorage.removeItem("numbers")
                                    setPageNum(0)
                                    linkArr = []
                                    keyword = ''
                                    search_keyword_id= ''
                                    return getKeyword()
                                }
                            }
                        }
                    }
                }
            });
        }
        //处理数据
        const moreData = (arr,index)=>{
            let batchList = arr.slice(index, index +1);
            console.log(batchList,11111)
            if(linkArr.length>=total) {
                saveSearch()
                return
            }
            // 如果还有数据需要处理
            if (batchList.length>0 ||index < arr.length){
                console.log(`${index+1}条数据截取${getDay()}`)
                getResData(arr,index)
            }else{//获取下一波数据
                if(linkArr.length < total){//不满足继续抓
                    countdown("准备抓取下一波数据",()=> getDyData(),10)
                }else{//满足了 提交
                  saveSearch()
                }
            }
        }
        //数据处理
        const getResData = (videoData,i)=>{
            const data =
                  {
                      ukey:"sec_uid",
                      uvalue:videoData[i]?.aweme_info?.author?.sec_uid,
                      title:videoData[i]?.aweme_info?.desc,
                      desc:videoData[i]?.aweme_info?.desc,
                      outside_video_id:videoData[i]?.aweme_info?.aweme_id,
                      type:videoData[i]?.aweme_info?.aweme_type==0?1:2,
                      collect_count:videoData[i]?.aweme_info?.statistics?.collect_count,
                      comment_count:videoData[i]?.aweme_info?.statistics?.comment_count ,
                      digg_count:videoData[i]?.aweme_info?.statistics?.digg_count,
                      share_count:videoData[i]?.aweme_info?.statistics?.share_count,
                      cate:JSON.stringify(videoData[i]?.aweme_info?.video_tag),
                      tag:JSON.stringify(videoData[i]?.aweme_info?.text_extra),
                      cover:videoData[i]?.aweme_info?.video.cover?.url_list?.[0]||"",
                      cover_list:JSON.stringify(videoData[i]?.aweme_info?.video?.cover?.url_list),
                      cover_width:videoData[i]?.aweme_info?.video?.cover.width,
                      cover_height:videoData[i]?.aweme_info?.video.cover.height,
                      play_addr:JSON.stringify(videoData[i]?.aweme_info?.video.play_addr),
                      bit_rate:JSON.stringify(videoData[i]?.aweme_info?.video.bit_rate),
                      video_dura:Math.round(Number(videoData[i]?.aweme_info?.video?.duration/1000)) ||Math.round(Number(videoData[i]?.aweme_info?.duration/1000)),
                      video_width:videoData[i]?.aweme_info?.video.play_addr.width,
                      video_height:videoData[i]?.aweme_info?.video.play_addr.height,
                      goods_info:videoData[i]?.aweme_info?.anchor_info?.extra||JSON.stringify([]),
                      video_size:videoData[i]?.aweme_info?.video.play_addr.data_size,
                      post_time:videoData[i]?.aweme_info?.create_time,
                      images:JSON.stringify(videoData[i]?.aweme_info?.images),
                      is_top:videoData[i]?.aweme_info?.is_top
                  }
            let saveUid = {
                "platform_id":1,
                "app_type": "tools_" + 1,
                "app_id": "1",
                "sign": "1",
                "sec_uid":videoData[i]?.aweme_info?.author?.sec_uid,
                "access_token": localStorage.getItem("token"),
                "result": JSON.stringify([data])
            }
            console.log("正在请求发文接口")
            req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                console.log('单条发文信息上传完毕',data,getDay())
                setTimeout(()=>{
                    setPageNum(linkArr.length+1)
                    linkArr.push(videoData[i])
                    moreData(videoData,i+1)
                },500)
            })
        }
        const saveSearch= ()=>{
            const newArr = linkArr.map(e=>({outside_video_id:e.aweme_info.aweme_id,sec_uid:e.aweme_info.author.sec_uid,type:e?.type,
                                            g_name:e?.aweme_info?.anchor_info?.type==3?JSON.parse(e?.aweme_info?.anchor_info?.extra)?.[0]?.title:'',
                                            g_id:e?.aweme_info?.anchor_info?.type==3?JSON.parse(e?.aweme_info?.anchor_info?.extra)?.[0]?.product_id:''
                                           }))
            console.log(newArr,'linkArr')
            loopData(1)//循环上传数据
            async function loopData(i){
                if(newArr.length>0){
                    let slcieArr = newArr.splice(0,20)
                    console.log(slcieArr,slcieArr.length,'slcieArr')
                    setResultData(slcieArr,i)
                }else{
                    console.log(`==============${keyword}关键词抓取完毕==============`,getDay())
                    // 数据处理结束
                    // 调用接口拿到下一个 keyword
                    await getError(1,linkArr.length,'','','',()=>{
                        dyoffset = 0
                        need_filter_settings = 1
                        search_id = null
                        localStorage.removeItem("numbers")
                        setPageNum(0)
                        linkArr = []
                        keyword = ''
                        search_keyword_id= ''
                        if(is_stop){
                            window.location.reload()
                        }else{
                            getKeyword()
                        }
                    },JSON.stringify(linkArr.map(e=>({outside_video_id:e?.aweme_info?.aweme_id,title:e?.aweme_info?.desc}))))
                }
                function setResultData(arr,i){
                    let urlData = {
                        search_keyword_id,
                        keyword,
                        platform_id: 1,
                        type:mode_type,
                        result: JSON.stringify(arr),
                    }
                    req(apiHost+"spider/browser/saveSearchKeywordResult",urlData, function(res){
                       countdown(`正在上传${i?`第${i}波`:'全部'}数据，请勿关闭`,()=> {
                            loopData(i+1)
                        },2)
                    })
                }
            }
        }
        let errIndex = 0
        //获取用户发文
        function getUserInfo(from_user,desc,aweme_id,callback) {
            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                search_channel: "aweme_personal_home_video",
                search_source: "normal_search",
                search_scene:" douyin_search",
                sort_type: 0,
                publish_time: 0,
                is_filter_search: 0,
                query_correct_type: 1,
                keyword:desc,
                search_id: '',
                offset: 0,
                count: 10,
                from_user,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 1920,
                screen_height: 1080,
                browser_language: "zh-CN",
                browser_platform:" Win32",
                browser_name,
                browser_version,
                browser_online: true,
                engine_name: "Blink",
                engine_version: browser_version,
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 6,
                device_memory: 8,
                platform:" PC",
                downlink: 10,
                effective_type:"4g",
                round_trip_time: 50,
                webid,
            }
            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/home/search/item/",
                data: dataVideo,
                dataType: "json",
                timeout: 100000, // 设置超时时间为10000毫秒（10秒）
                error: function(fail,textStatus, errorThrown){
                    $(".cyloading").hide()
                    // 请求失败或超时的回调函数
                    if (textStatus === 'timeout') {
                        $(".cyloading").hide()
                        getError(4,0,'',"抖音用户主页搜索数据超时")
                        countdown("抖音用户主页搜索数据超时",()=> getUserInfo(from_user,desc,aweme_id,callback),320)
                    }
                },
                success: function (res) {
                    if(res?.aweme_list) {
                        let datas = res?.aweme_list||[]
                        datas = datas.filter(e=>e.item.aweme_id == aweme_id)
                        console.log(aweme_id,'aweme_id')
                        if(datas.length>0){
                            callback(datas)
                        }else{
                            if(errIndex>=2){
                                errIndex = 0
                                getError(2,0,'',"抖音用户主页数据无法匹配到相应数据"+JSON.stringify(res))
                                return callback([])
                            }
                            errIndex++
                            countdown("发文无法匹配到相应数据",()=> getUserInfo(from_user,desc,aweme_id,callback),10)
                        }
                        console.log(datas,'datas',getDay())
                    }else{
                        if(errIndex>=2){
                            errIndex = 0
                             getError(2,0,'',"抖音用户主页搜索数据获取失败"+JSON.stringify(res))
                            return callback([])
                        }
                        errIndex++
                        countdown("发文数据获取异常",()=> getUserInfo(from_user,desc,aweme_id,callback),10)
                    }
                }})
        }
        //链接跳转
        const islink = (keywords,id,num)=>{
            let pattern = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
            if(Number(num)) {
                localStorage.setItem('total', num)
                document.getElementById('total').value =num
                total = num
            }
            if(pattern.test(keywords)){//是否链接
                window.open(`${keywords}?type=keyword&id=${id}&num=${num}`)
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        const isStop = localStorage.getItem('is_stop');
                    if(Number(isStop)){
                        stoppingHtml()
                        window.location.reload()
                    }else{
                        getKeyword()
                    }
                   }
                }
            }else{
                keyword = keywords
                search_keyword_id =id
                getDyData()
            }
        }
        //获取关键字
        function getKeyword(){
            if(!mode_type) return alert("请选择模式")
            if(navigator.userAgent.indexOf("Chrome") == -1)return alert("目前只支持谷歌浏览器")
            let searchKeyword = {
                type:Number(mode_type),
                platform_id: 1,
                project_id:15,
                team_id:teamId,
                version
            }
            clearInterval(intervals); // 清除之前的计时器
            req(apiHost+"spider/browser/getSearchKeyword",searchKeyword,function(res){
                const {keyword,id,num} = res?.result||{}
                if(keyword){
                    console.log(`==============开始进行${keyword}关键词抓取==============`,getDay())
                    localStorage.setItem('keyword', keyword)
                    localStorage.setItem('id', id)
                    document.getElementById('keyword_text').innerHTML =keyword||""
                    islink(keyword,id,num)
                }else{
                    localStorage.removeItem("keyword")
                    localStorage.removeItem("id")
                    if(res.result.version == version){
                        countdown("关键词数据",()=>getKeyword())
                    }else{
                      $(".cyloading").hide()
                      window.location.reload()
                  }

                }
            })
        }
        // 抓取达人
        $(".cyBtn button").click(function(){
            // 获取input元素
            var input = document.getElementById('myInput')
            // 读取localStorage中的数据
            const device_id = localStorage.getItem('device_id');
            const operator = document.getElementById('operator');//操作人
            onSetForm()
            if(operator.value){localStorage.setItem('operator', operator.value)}else{return alert("请输入操作人名字")}
            if(device_id||input.value) {
                if(input?.value&&input?.value!=device_id) localStorage.setItem('device_id', input?.value)
                localStorage.setItem('platform_name',"抖音")
                if(is_stop){
                    onStop(()=>{
                        getRegKeyword(1,()=>{
                            getKeyword()
                        })
                    })
                }else{
                    getRegKeyword(1,()=>{
                        getKeyword()
                    })
                }
            }else{
                return alert("请输入设备标识")
            }
        })

    }else if(rex.match(/https:\/\/www.xiaohongshu.com\/search_result\/*/) != null){
        let times
        times = setInterval(()=> {
            window.location.reload()
            console.log("倒计时")
        }, 10000);
        window.addEventListener('load', function() {
            clearInterval(times)
            setDeviceId()
            document.querySelector(".xhsTag_type").style.display = 'flex';
            document.querySelector(".xhsCate_type").style.display = 'flex';
            let xhsIsHandle = localStorage.getItem('xhsIsHandle')
            if(Number(xhsIsHandle)){
                getXhsVideoInfo()
            }else{
                localStorage.removeItem("numbers")//置空计数
                setPageNum(0)
            }
            const urlParams = new URLSearchParams(unsafeWindow.location.search);
            const isKeyword = urlParams.get('type');
            const keyword = urlParams.get('keyword');
            const search_keyword_id = urlParams.get('search_keyword_id');
            const num = urlParams.get('num');
            if(Number(num)) total = num
            const dataType= {
                "video":1,
                "normal":2
            }
            let all_list = []
            let aweme_list = [];
            let scrollHeight = document.body.scrollHeight;
            let i = 0;
            let isShow =false
            console.log("页面加载完毕",urlParams.get('keyword'),xhsCateType)
            if(isKeyword!="keyword") return
            $(".cyloading").show()
            function tabClick(){//点击视频标签
                console.log("点击")
                // 找到要点击的页面元素
                var elementToClick = document.querySelector('#video_note');
                // 创建一个点击事件
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: false,
                    view: unsafeWindow
                });
                elementToClick.dispatchEvent(clickEvent);
                if(!xhsTagType){
                    isShow =true
                }else{
                    setTimeout(()=>{
                        simulateClick()
                    },3000)
                }
            }
            function simulateClick(){
                // 触发点击事件
                document.querySelectorAll(".dropdown-items")[2].querySelectorAll("li")[xhsTagType||0].click()
                isShow =true
            }
            tabClick()//模拟页面搜索
            //滚动列表
             let interval
             let stop = 0
             let tagIndex = 0
             const onScroll=()=> {
                 var div = document.querySelector(".feeds-container");
                 var divHeight = div?.getBoundingClientRect()?.height||0;
                 interval = setInterval(()=> {
                     if(document.getElementsByClassName("end-container").length <= 0) {
                         window.scrollTo(divHeight * i, divHeight * (i+1));
                         console.log(divHeight * i, divHeight * (i+1))
                         i++
                     } else {
                         stop++
                         console.log('stop')
                         document.querySelectorAll(".end-container")[0]?.scrollIntoViewIfNeeded()
                         clearInterval(interval);
                         if(stop>10){
                             stop = 0
                             getSearchResult()
                         }
                     }
                 }, 3000);
             };
            // 拦截响应
            let originalSend = XMLHttpRequest.prototype.send;
            let isScroll = false
            XMLHttpRequest.prototype.send = function() {
                var self = this;
                // 监听readystatechange事件，当readyState变为4时获取响应
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        if (self.responseURL == "https://edith.xiaohongshu.com/api/sns/web/v1/search/notes") {
                            if(!isShow)return
                            stop = 0
                            // 在获取到响应后执行你的操作
                            var json = JSON.parse(self.response);
                            var data = json?.data?.items;
                            console.log(all_list.length,'all_list')
                            //过滤不是视频的数据/和点赞数小于min_liked_count
                            if(Array.isArray(data)&&data.length>0) all_list = all_list.concat(data.filter(item => item.model_type == 'note'&& item?.note_card?.type=="video"&&item?.note_card?.user?.user_id&&item.note_card?.interact_info?.liked_count>=like_count))
                            if(Array.isArray(data) && json?.data?.has_more){
                                console.log(all_list.length,'all_list',like_count,total)
                                if(all_list.length>0 && !isScroll){
                                    console.log("拿满了")
                                    isScroll = true
                                    clearInterval(interval);
                                    const sliceArr = all_list.splice(0,40)
                                    moreData(sliceArr,0,()=>{
                                        isScroll =false
                                        if(aweme_list.length<total){//如果数据不够
                                            onScroll(); // 继续滚动
                                        }else{
                                            getSearchResult()
                                        }
                                    })
                                }else{
                                    if(all_list.length==0) onScroll()
                                }
                            }else{
                                clearInterval(interval);
                                console.log("拉到底了has_more",json?.data?.has_more)
                                if(all_list.length>0) {
                                    moreData(all_list,0,()=>{
                                       if(aweme_list.length>0){
                                           getSearchResult()
                                       }else{
                                           getError(2,aweme_list.length,'','搜索未找到满足条件的数据:'+self.response)
                                           window.close()
                                       }
                                    })
                                }else if(aweme_list.length>0){
                                    getSearchResult()
                                }else{
                                    if(json?.code == -1 ||json?.msg=="网页版搜索次数已达今日上限，可以去小红书App继续搜索"){
                                        getError(4,aweme_list.length,'','网页版搜索次数已达今日上限，可以去小红书App继续搜索:'+self.response)
                                        countdown("小红书搜索数据失败",()=>window.close(),43200)
                                        return
                                    }
                                    //小红书账号失效
                                    if(json?.code == 104) return window.location.reload()
                                    if(document.getElementsByClassName("search-empty-text").length>0||document.getElementsByClassName("search-empty-wrapper").length>0){
                                        console.log("关闭")
                                        window.close()
                                    }else{
                                        console.log(json,'json')
                                        getError(4,aweme_list.length,"小红书搜索数据异常data"+self.response)
                                        window.close()
                                    }
                                }
                            }
                        }
                    }
                };
                // 调用原始的send方法
                originalSend.apply(this, arguments);
            };
            const moreData = (arr,index,callback)=>{
                let batchList = arr.slice(index, index +1);
                // 如果还有数据需要处理
                if(aweme_list.length>=total) {
                    getSearchResult()
                    return
                }
                if (batchList.length>0 ||index < arr.length){
                   console.log(`${index+1}条数据截取`,getDay())
                    getResData(arr,index,callback)
                }else{//所有数据同步完毕
                   callback()
                }
            }
            const getResData = (videoData,index,callback)=>{//获取无水印视频数据
                if(aweme_list.some(e=>e.id==videoData[index]?.id)){//相同的跳过
                    moreData(videoData,index+1,callback)
                }else{
                    localStorage.setItem('xhsIsHandle',1)//是否需要数据处理
                    window.open("https://www.xiaohongshu.com/search_result/"+videoData[index]?.id+`?xsec_token=${videoData[index]?.xsec_token}&xsec_source=pc_search&type=keyword`)
                    document.onvisibilitychange=()=>{
                        if(!document.hidden){
                            let dataPass = localStorage.getItem("xhsIsPass")
                            if(!document.hidden){
                                const isStop = localStorage.getItem('is_stop');//是否关闭脚本
                                if(Number(isStop)) {
                                    stoppingHtml()
                                    getSearchResult()
                                }else{
                                    if(Number(dataPass)) {
                                        setPageNum(aweme_list.length+1)
                                        aweme_list.push(videoData[index])
                                        moreData(videoData,index+1,callback)
                                    }else{
                                        //不合规的跳过
                                        moreData(videoData,index+1,callback)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //标签选择
            let xhsTagClick = (callback)=>{
                const cateDom = document.querySelector(".reds-sticky .content-container")?.children
                console.log("切换标签",tagIndex,xhsCateType,aweme_list.length,cateDom,cateDom?.length>0)
                if(xhsCateType&&aweme_list.length<total&&cateDom&&cateDom.length>0){//数据不够  有标签
                    tagIndex++
                    if(tagIndex<cateDom.length) {
                        clearInterval(interval);
                        console.log(tagIndex,'次数')
                        i=0
                        cateDom[tagIndex].click()
                        onScroll()
                    }else{
                        console.log("切换标签结束")
                        callback()
                    }
                }else{
                    callback()
                }
            }
            //最终数据提交
            const getSearchResult = ()=>{
                isScroll = false
                clearInterval(interval);
                xhsTagClick(()=>{
                    if(aweme_list.length<=0)return window.close()
                    const newArr = aweme_list.map(e=>({outside_video_id:e.id,sec_uid:e.note_card?.user.user_id,type:dataType[e?.note_card?.type]||0}))
                    let urlData = {
                        search_keyword_id,
                        keyword,
                        platform_id: 4,
                        type:mode_type,
                        result: JSON.stringify(newArr),
                    }
                    console.log(aweme_list,'aweme_list')
                    req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                        console.log(`总共${aweme_list.length}条数据信息抓取完毕`)
                        // 数据处理结束
                        console.log(`==============${keyword}关键词抓取完毕==============`,getDay())
                        // 调用接口拿到下一个 keyword
                        getError(1,aweme_list.length,'','','',()=>{
                            aweme_list = []
                            i=0
                            localStorage.removeItem("numbers")
                            setPageNum(0)
                            window.close()
                        },JSON.stringify(aweme_list.map(e=>({outside_video_id:e.id,title:e.note_card?.display_title,tag:tagIndex}))))
                    })
                })
            }
            })
        const sendList = (keyword,id,num=0)=>{
            let pattern = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
            let searchString = "user/profile";//是否是用户主页信息
            if (keyword.indexOf(searchString) !== -1) {//是否用户主页链接
                console.log("链接中存在'user/profile'");
                window.open(keyword+`?type=keyword&userType=1&search_keyword_id=${id}`)
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        const isStop = localStorage.getItem('is_stop');
                        if(Number(isStop)){
                            stoppingHtml()
                            window.location.reload()
                        }else{
                            getKeyword()
                        }
                    }
                }
            }else if(pattern.test(keyword)){//是否视频详情页链接
                localStorage.setItem('xhsIsHandle',1)//是否需要数据处理
                const regex = /explore\/(\w+)\?xsec_token=(\w+)/
                const match = keyword.match(regex)
                if(!match[1]||!match[2]) return alert("链接读取失败")
                window.open(`${keyword}&search_keyword_id=${id}&xsec_source=pc_search&type=keyword`)
               // window.open(`${keyword}&type=keyword&search_keyword_id=${id}&num=${num}`)
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        const isStop = localStorage.getItem('is_stop');
                        if(Number(isStop)){
                            stoppingHtml()
                            window.location.reload()
                        }else{
                            getKeyword()
                        }
                    }
                }
            }else{//是否关键字
                const keywords = encodeURIComponent(encodeURIComponent(keyword))
                window.open(`https://www.xiaohongshu.com/search_result?keyword=${keywords}&source=web_search_result_notes&type=keyword&search_keyword_id=${id}&num=${num}`)
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        const isStop = localStorage.getItem('is_stop');
                        if(Number(isStop)){
                            stoppingHtml()
                            window.location.reload()
                        }else{getKeyword()}
                    }
                }
            }

        }
        function getKeyword(){
             $(".cyloading").show()
             $(".stop_btn").show()
            if(navigator.userAgent.indexOf("Chrome") == -1)return alert("目前只支持谷歌浏览器")
            if(!mode_type) return alert("请选择模式")
            let searchKeyword = {
                type:Number(mode_type),
                platform_id: 4,
                project_id:15,
                version,
                team_id:teamId,
            }
            req(apiHost+"spider/browser/getSearchKeyword",searchKeyword,function(res){
                const {keyword,id,num} = res?.result ||{}
                if(keyword){
                    console.log(`==============开始进行${keyword}关键词抓取==============`)
                    localStorage.setItem('keyword',keyword)
                    localStorage.setItem('id', id)
                    document.getElementById('keyword_text').innerHTML =keyword||""
                    if(num) {
                        localStorage.setItem('total', num)
                        total = num
                    }
                    sendList(keyword,id,num)
                }else{
                    localStorage.removeItem("keyword")
                    localStorage.removeItem("id")
                    if(res.result.version == version){
                        countdown("关键词数据",()=>getKeyword())
                    }else{
                        $(".cyloading").hide()
                        window.location.reload()
                    }
                }
            })
        }

        // 抓取达人
        $(".cyBtn button").click(function(){
            // 获取input元素
            var input = document.getElementById('myInput')
            // 读取localStorage中的数据
            const device_id = localStorage.getItem('device_id');
            const phone = document.getElementById('xhsPhone');//手机
            const operator = document.getElementById('operator');//操作人
            if(phone.value){localStorage.setItem('phone', phone.value)}else{return alert("请输入当前登录手机号")}
            if(operator.value){localStorage.setItem('operator', operator.value)}else{return alert("请输入操作人名字")}
            onSetForm()
            if(device_id||input.value) {
                if(input?.value&&input?.value!=device_id) localStorage.setItem('device_id', input?.value)
                localStorage.setItem('platform_name',"小红书")
                if(is_stop){
                    onStop(()=>{
                        getRegKeyword(4,()=>{
                            getKeyword()
                        })
                    })
                }else{
                    getRegKeyword(4,()=>{
                        getKeyword()
                    })
                }

            }else{
                return alert("请输入设备标识")
            }
        })

     }
    if(rex.match(/https:\/\/www.xiaohongshu.com\/explore\/*/)){
       getXhsVideoInfo()
    }
    function getXhsVideoInfo (callback){
        localStorage.setItem('xhsIsHandle',0)//取消数据处理
        document.querySelector(".cyBtn").style.display = 'none';
        document.querySelector(".xhsTag_type").style.display = 'flex';
        document.querySelector(".xhsCate_type").style.display = 'flex';
        setPageNum()
        setDeviceId()
        // 获取小红书数据
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        let xhs_secUid = window.location.pathname.split("/")
        const search_keyword_id = urlParams.get('search_keyword_id');
        let sec_uid = xhs_secUid[xhs_secUid.length - 1];
        const isKeyword = urlParams.get('type');
        let videoInfo = unsafeWindow.__INITIAL_STATE__.note.noteDetailMap[sec_uid]?.note
        let originUrl = urlParams.get('originalUrl');
        let xsec_token = urlParams.get('xsec_token')
        const isUserType= urlParams.get('userType');//是否抓取用户主页视频
        if(originUrl) return countdown("页面即将",()=>window.close(),600)
        if(!xsec_token) return
        const fc = (e)=>{
            if(callback){
                return callback(e)
            }else{
                localStorage.setItem('xhsIsPass', e)
                return window.close()
            }
        }
        if(!videoInfo&&JSON.stringify(videoInfo)=="{}") {
            return fc(0)
        }
        //if(!isKeyword)return
        $(".cyloading").show()
        $(".stop_btn").show()
            let url = videoInfo?.video?.media?.stream?.h264[0]?.masterUrl
            if(!url) fc(0)
            const urlObj = new URL(url)
            console.log(url,urlObj?.origin,'url')
            if (urlObj?.origin) {
                url = urlObj?.origin+"/"+videoInfo?.video?.consumer?.originVideoKey;
            }else{
                return alert("视频链接失效，请联系技术人员")
            }
            console.log(url,'video')
            let datas = {
                ukey:"sec_uid",
                uvalue:videoInfo?.user.userId,
                title:videoInfo?.title,
                desc:videoInfo?.desc,
                outside_video_id:videoInfo?.noteId,
                type:videoInfo?.type=="video"?1:2,
                collect_count:videoInfo?.interactInfo?.collectedCount,
                comment_count:videoInfo?.interactInfo?.commentCount,
                digg_count:videoInfo?.interactInfo?.likedCount,
                share_count:videoInfo?.interactInfo?.shareCount,
                cate:JSON.stringify([]),
                tag:JSON.stringify(videoInfo?.tagList),
                cover:videoInfo?.imageList?.[0].urlDefault,
                cover_list:JSON.stringify(videoInfo?.imageList.map(e=>({height:e.height,width:e.width,url_default:e.urlDefault,url_pre:e.urlPre}))),
                cover_width:videoInfo?.imageList?.[0]?.width,
                cover_height:videoInfo?.imageList?.[0]?.height,
                play_addr:url||"",
                bit_rate:0,
                video_dura:videoInfo?.video?.capa?.duration,
                video_width:videoInfo?.video?.media?.stream?.h264[0]?.width,
                video_height:videoInfo?.video?.media?.stream?.h264[0]?.height,
                video_size:videoInfo?.video?.media?.stream?.h264[0]?.size,
                post_time:videoInfo?.lastUpdateTime?videoInfo?.lastUpdateTime/1000:"",
                images:JSON.stringify(videoInfo?.imageList.map(e=>({fileId:e.fileId,traceId:e.traceId,height:e.height,width:e.width,url:e.urlDefault,original:e.urlDefault,latitude:null,longitude:null,sticker:null}))),
                is_top:''
            }
        let saveUid = {
            "platform_id":4,
            "app_type": "tools_" + 4,
            "app_id": "1",
            "sign": "1",
            "sec_uid":datas.uvalue,
            "access_token": localStorage.getItem("token"),
            "result": JSON.stringify([datas])
        }
            //视频时长不达标跳过
            if(Number(datas?.video_dura)<dura) fc(0)
            getNinety(datas?.post_time,()=>{//只拿时间合规
                req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                    console.log('单条发文信息上传完毕',datas.uvalue,getDay())
                    if(isUserType) return setTimeout(()=>{window.close()},5000)
                    window.open("https://www.xiaohongshu.com/user/profile/"+datas.uvalue+`?type=keyword&wid=${datas.outside_video_id}`)
                    document.onvisibilitychange=()=>{
                        if(!document.hidden){
                            if(search_keyword_id){
                                const newArr = [datas].map(e=>({outside_video_id:e.outside_video_id,sec_uid:e.uvalue,type:e.type}))
                                let urlData = {
                                    search_keyword_id,
                                    platform_id: 4,
                                    type:mode_type,
                                    result: JSON.stringify(newArr),
                                }
                                req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                                    setTimeout(()=>{
                                        window.close()
                                    },10000)
                                })
                            }else{fc(1)}
                        }
                    }
                })
            },
                      ()=>{//不合规的跳过
                fc(0)
            })
        countdown("页面刷新倒计时",()=>window.location.reload())
    }
    if(rex.match(/https:\/\/www.xiaohongshu.com\/website-login\/error\/*/)){
        countdown("小红书网络出错",()=>window.close(),1800)
    }
    if(rex.match(/https:\/\/s.weibo.com\/video\/*/) != null){//微博
        setDeviceId()
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        const keyword = urlParams.get('keyword');
        const search_keyword_id = urlParams.get('search_keyword_id');
        const num = urlParams.get('num');
        if(Number(num)) total = Number(num)
        if(isKeyword=="keyword") {
        document.querySelector(".cyBtn").style.display = 'none';
        $(".cyloading").show()
        let all_list = []
        let aweme_list = unsafeWindow.app2.$children;
        if(aweme_list.length>0){
            if(document.querySelector('.no-result'))return countdown("搜索不到数据",()=>window.close(),10)
            saveData(0)
        }
        function saveData(num){//数据处理
            if(num>aweme_list.length){//下一页
               return nextClick()
            }
            if(aweme_list[num]?.$options?.propsData?.options?.address){//链接 跳转视频页
                const url = aweme_list[num]?.$options?.propsData?.options?.address;
                console.log(url,'url')
                var fid = url.match(/fid=(\d+:\d+)/)?.[1];
                if(!fid) return saveData(num+1)
                const device = localStorage.getItem('device_id');//设备标识
                const login_phone = localStorage.getItem('phone');//手机
                const handle_name = localStorage.getItem('operator');//操作人
                const platform_name = localStorage.getItem('platform_name');//平台
                window.open(`https://weibo.com/tv/show/${fid}?from=old_pc_videoshow&type=keyword&search_keyword_id=${search_keyword_id}&device=${device}&login_phone=${login_phone}&handle_name=${handle_name}&platform_name=${platform_name}`)
                document.onvisibilitychange=()=>{
                    if(!document.hidden){
                        const numbers = localStorage.getItem('numbers');
                        if(Number(numbers)+1 == total){
                            window.close()
                        }else{
                            setPageNum(Number(numbers)+1)
                            setTimeout(()=>{
                                saveData(num+1)
                            },3000)
                        }
                    }
                }
            }else{//没有链接下一个
                saveData(num+1)
            }

        }
            function nextClick(){//点击下一页标签
                console.log("点击")
                // 找到要点击的页面元素
                var elementToClick = document.querySelector('.next');
                if(elementToClick == null) return window.close()
                // 创建一个点击事件
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: false,
                    view: unsafeWindow
                });
                elementToClick.dispatchEvent(clickEvent);
            }
        }
        const sendList = (keyword,id,num=0)=>{
            const keywords = encodeURIComponent(keyword)
            window.open(`https://s.weibo.com/video?q=${keywords}&typeall=1&hasvideo=1&tw=video&type=keyword&search_keyword_id=${id}&num=${num}`)
            document.onvisibilitychange=()=>{
                if(!document.hidden){
                    const isStop = localStorage.getItem('is_stop');
                    if(Number(isStop)){
                        stoppingHtml()
                        window.location.reload()
                    }else{getKeyword()}

                }
            }
        }
        function getKeyword(){
            $(".cyloading").show()
            $(".stop_btn").show()
            localStorage.removeItem("numbers")
            setPageNum(0)
            if(navigator.userAgent.indexOf("Chrome") == -1)return alert("目前只支持谷歌浏览器")
            if(!mode_type) return alert("请选择模式")
            let searchKeyword = {
                type:Number(mode_type),
                platform_id: 15,
                project_id:15,
                version,
                team_id:teamId,
            }
            req(apiHost+"spider/browser/getSearchKeyword",searchKeyword,function(res){
                const {keyword,id,num} = res?.result ||{}
                if(keyword){
                    console.log(`==============开始进行${keyword}关键词抓取==============`)
                    localStorage.setItem('keyword',keyword)
                    localStorage.setItem('id', id)
                    document.getElementById('keyword_text').innerHTML =keyword||""
                    if(num) {
                        localStorage.setItem('total', num)
                        total = num
                    }
                    sendList(keyword,id,num)
                }else{
                    localStorage.removeItem("keyword")
                    localStorage.removeItem("id")
                    if(res.result.version == version){
                        countdown("关键词数据",()=>getKeyword())
                    }else{
                        $(".cyloading").hide()
                        window.location.reload()
                    }
                }
            })
        }

        // 抓取达人
        $(".cyBtn button").click(function(){
            // 获取input元素
            var input = document.getElementById('myInput')
            // 读取localStorage中的数据
            const device_id = localStorage.getItem('device_id');
            const phone = document.getElementById('xhsPhone');//手机
            const operator = document.getElementById('operator');//操作人
            if(phone.value){localStorage.setItem('phone', phone.value)}else{return alert("请输入当前登录手机号")}
            if(operator.value){localStorage.setItem('operator', operator.value)}else{return alert("请输入操作人名字")}
            onSetForm()
            if(device_id||input.value) {
                if(input?.value&&input?.value!=device_id) localStorage.setItem('device_id', input?.value)
                localStorage.setItem('platform_name',"微博")
                if(is_stop){
                    onStop(()=>{
                        getRegKeyword(15,()=>{
                            getKeyword()
                        })
                    })
                }else{
                    getRegKeyword(15,()=>{
                        getKeyword()
                    })
                }

            }else{
                return alert("请输入设备标识")
            }
        })
    }
    if(rex.match(/https:\/\/weibo.com\/tv\/show\/*/)!=null){
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        const search_keyword_id = urlParams.get('search_keyword_id');
        const device = urlParams.get('device');//设备标识
        const phone = urlParams.get('login_phone');//手机
        const operator = urlParams.get('handle_name');//操作人
        const platform_name = urlParams.get('platform_name');//平台
        localStorage.setItem('device_id', device)
        localStorage.setItem('phone', phone)
        localStorage.setItem('operator', operator)
        localStorage.setItem('platform_name', platform_name)
        if(!isKeyword)return
        // 拦截响应
        let originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self.responseURL.match(/https:\/\/weibo.com\/tv\/api\/component\/*/) != null) {
                        // 在获取到响应后执行你的操作
                        let json = JSON.parse(self.response);
                        let data = json?.data?.Component_Play_Playinfo;
                        if(!data?.urls) return window.close()
                        console.log(data?.urls)
                        const addr = Object.values(data?.urls);
                        let videoData = {
                            ukey:"sec_uid",
                            uvalue:data?.user.id,
                            title:data?.title,
                            desc:data?.text,
                            outside_video_id:data?.id.split(':')[1],
                            type:data?.object_type=="video"?1:2,
                            collect_count:'',
                            comment_count:data?.comments_count,
                            digg_count:data?.attitudes_count,
                            share_count:Number(data?.reposts_count),
                            cate:JSON.stringify([]),
                            tag:JSON.stringify(data?.topics||[]),
                            cover:"https:"+data?.cover_image,
                            cover_list:JSON.stringify([]),
                            cover_width:0,
                            cover_height:0,
                            play_addr:"https:"+addr[addr.length - 1]||"",
                            bit_rate:0,
                            video_dura:Math.round(data?.duration_time),
                            video_width:0,
                            video_height:0,
                            video_size:0,
                            post_time:data?.real_date,
                            images:JSON.stringify([]),
                            is_top:''
                        }
                        let saveUid = {
                            "platform_id": 15,
                            "app_type": "tools_" + 15,
                            "app_id": "1",
                            "sign": "1",
                            "sec_uid":videoData.uvalue,
                            "access_token":localStorage.getItem("token"),
                            "result": JSON.stringify([videoData])
                        }
                        //视频时长不达标/点赞数不达标跳过
                        if(Number(videoData?.video_dura)<dura||Number(videoData?.digg_count)<like_count) return window.close()
                        getNinety(videoData?.post_time,()=>{//只拿时间合规
                            req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                                console.log('单条发文信息上传完毕',videoData.uvalue,getDay())
                                getUserInfo(data?.reward?.user,()=>{
                                    const newArr = [videoData].map(e=>({outside_video_id:e.outside_video_id,sec_uid:e.uvalue,type:e.type}))
                                    let urlData = {
                                        search_keyword_id:search_keyword_id,
                                        platform_id: 15,
                                        type:mode_type,
                                        result: JSON.stringify(newArr),
                                    }
                                    req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                                        console.log(`总共${videoData.length}条数据信息抓取完毕`)
                                        // 调用接口拿到下一个 keyword
                                        getError(1,1,'','','',()=>{
                                            window.close()
                                        },JSON.stringify([videoData].map(e=>({outside_video_id:e.outside_video_id,title:e.title}))))
                                    })
                                })
                            })
                        },
                                  ()=>{//不合规的跳过
                            window.close()
                        })
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
        countdown("页面刷新倒计时",()=>window.location.reload())
     }//微博同步信息
    function getUserInfo(data,callback) {
        // 抖音author_id
        let author_id = data?.id;
        // 昵称
        let nick =data?.screen_name;
        // account号
        let account = '';
        // 分类
        let cate = "";
        // 位置
        let location = data.location;
        // 头像
        let avatar = data.avatar_hd;
        // 简介
        let desc = data.description;

        // 作品数
        let video_count = data?.statuses_count;
        // 平台id
        let platform_id = 15;
        // 性别
        let sex = data?.gender?data?.gender == "f" ? 2 : 1:0;
        let account_tag, cert;
        if(data?.verified&&data?.verified_reason){
            account_tag = ""
            cert = data?.verified_reason
        }
        // 自定义字段
        let diy = {
            "location": location,
            "cert":cert||"",
        };
        var dataBind = {
            "app_type": "tools_"+platform_id,
            "app_id": 1,
            "sign": 1,
            "sec_uid": data?.id,
            "platform_id": platform_id,
            "link": `https://weibo.com/u/${data?.id}`,
            "author_id": author_id,
            "nick": nick,
            "account": account,
            "avatar": avatar,
            "desc": desc,
            "like_count": data?.status_total_counter?.like_cnt,
            "fans_count": data?.followers_count,
            "video_count": video_count,
            "cate_str": cate,
            "sex": sex,
            "diy": diy,
            "account_tag":account_tag||"",
            "v": version
        }
        req(apiHost+"/spider/browser/syncInfo",dataBind,function(response){
            console.log('用户信息同步完毕',dataBind)
            callback()
        })
    }

    //好看视频
    if(rex.match(/https:\/\/haokan.baidu.com\/web\/search\/page\/*/)!=null){
        let originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            let self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    console.log(self.responseURL,'self.responseURL')
                    if (self.responseURL.match(/https:\/\/haokan.baidu.com\/haokan\/ui-search\/pc\/search\/video\/*/) != null) {//https://haokan.baidu.com/haokan/ui-search/pc/search/video
                        // 在获取到响应后执行你的操作
                        let json = JSON.parse(self.response);
                        let data = json
                        console.log(data)
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
    }

    // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })

    dragInfo(100,0)
})();