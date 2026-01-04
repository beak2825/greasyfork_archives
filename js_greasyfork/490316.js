// ==UserScript==
// @name         fw
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  对蜂网路由器系统的优化;1.首页显示温度模块及检查CPU内存异常;2.内网主机可单机查看功能;3.防止自动退出登录;5.ping检测日志列表处理...
// @author       005
// @match        *://*/*?PAGE=*
// @match        https://*.ip138.com/*
// @match        https://*.chaziyu.com/*
// @match        https://*.icplishi.com/*
// @match        https://*.ipchaxun.com/*
// @match        https://*.chapangzhan.com/*
// @match        https://*.rdnsdb.com/*
// @match        https://*.123pan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490316/fw.user.js
// @updateURL https://update.greasyfork.org/scripts/490316/fw.meta.js
// ==/UserScript==
// @source       https://moodtracks.cn:8888/fw.js
(function () {
    'use strict';
    const FWVERSION = '0.5.2'
    //=============================================================================================
    //--------------------------------------------配置---------------------------------------------
    //=============================================================================================

    // 1为开启 0为关闭
    //----------------------



    // 时间到期字体更改红色
    const isShowExp = 1


    // 顶部快捷导航
    const isFastNav = 0
    // 常用导航
    const isCommonNav = 0



    // 内网主机
    const isOnIpCheck = 1


    // 流量识别
    const isFlowIdentifi = 1
    // 软件优先级
    const isSoftPro = 1


    // ping检测日志列表
    const isOnPingLog = 1


    // 点击logo跳转事件
    const isOnLogoTo = 0
    // 防止自动退出登录
    const isOnLogin = 1
    // 自动开启ping检测
    const isOnPing = 0
    // 检查脚本更新
    const isCheckFwVer = 0





    // 常用导航列表
    const commonNavData = [
        { page: "index", name: "首页" },
        { page: "port_mapped", name: "端口映射/DMZ" },
        { page: "fw_sysinfo", name: "系统负载" },
        { page: "wan_speed", name: "LAN/WAN流量" },
        { page: "hosts_info", name: "内网主机" },
        { page: "fluid", name: "智能流控" },
        { page: "software", name: "应用软件分流" },
        { page: "basic_safe", name: "基础配置" },
        { page: "ping", name: "Ping检测" },
        { page: "fw_system", name: "系统日志" },
    ]



    //=============================================================================================
    //---------------------------------------------结束--------------------------------------------
    //=============================================================================================










































    // 过滤广告：ip138、查子域名、icp备案查询、ip查询、123盘
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    if (location.host.indexOf("ip138.com") !== -1){
        setTimeout(()=>{
            let lis = document.querySelectorAll("div.bd > div.result3 > ul.navs > li");
            if (lis.length > 0)lis[lis.length - 1]?.remove()
            document.querySelector("#banana")?.remove()
            document.querySelectorAll(".banana").forEach(item=>{item?.remove()})
            document.querySelectorAll(".mod-idc").forEach(item=>{item?.remove()})
            document.querySelectorAll(".banner-outer").forEach(item=>{item?.remove()})
        },0)
    }
    if (location.host.indexOf("chaziyu.com") !== -1){
        document.querySelectorAll(".MODBanana").forEach(item=>{item?.remove()})
    }
    if (location.host.indexOf("icplishi.com") !== -1){
        document.querySelectorAll(".MODBanana").forEach(item=>{item?.remove()})
    }
    if (location.host.indexOf("ipchaxun.com") !== -1){
        document.querySelectorAll(".MODBanana").forEach(item=>{item?.remove()})
        $('.inner:eq(2)').css('display','none')
        $('.inner .banner-outer').css('display','none')
    }
    if (location.host.indexOf("chapangzhan.com") !== -1){
        document.querySelectorAll(".MODBanana").forEach(item=>{item?.remove()})
    }
    if (location.host.indexOf("rdnsdb.com") !== -1){
        document.querySelectorAll(".MODBanana").forEach(item=>{item?.remove()})
    }
    if (location.host.indexOf("123pan.com") !== -1){
        //document.querySelectorAll("div.mfy-main-layout__head").forEach(item=>{item?.remove()})
        setTimeout(()=>{
            console.log(123)
            document.querySelectorAll("div.ant-carousel").forEach(item=>{item?.remove()})
        },100)
    }

    // 收集DNS解析记录
    if ((window.location.host=='site.ip138.com')||(window.location.host=='ipchaxun.com')){
        console.log(window.location.host)
        let isip138 = (window.location.host=='site.ip138.com')? true : false
        setTimeout(()=>{
            let outerHTML = document.documentElement.outerHTML;
            handleHTML(outerHTML, isip138)
        },500)


    }


    function handleHTML(html,isip138=true){
        let resArr = [];
        let website = isip138 ? "site.ip138.com" : "ipchaxun.com";
        let cip = window.location.pathname.split('/',2)[1]
        let data = html;
        if (data) {
            if (data.indexOf("绑定过的域名如下") != -1) {
                let ipshudi = ""; //ip属地
                let arr = []; //历史绑定域名
                let arr1, arr2;
                if (data.indexOf("暂无结果") == -1) {
                    let isp = ''
                    if (isip138) {
                        //ip138
                        ipshudi = data.split("<h3>")[1].split("</h3>")[0];
                        arr1 = data
                            .split("绑定过的域名如下")[1]
                            .split("</span></li>")[1]
                            .split("</ul>")[0]
                            .split('class="date">')
                            .filter((_, index) => index != 0);
                    } else {
                        //ipchaxun
                        let str = data
                        .split("归属地：</span>")[1]
                        .split('class="value">')[1]
                        .split("</span>")[0];
                        isp = data
                            .split("运营商：</span>")[1]
                        try{
                            isp = isp.split('class="value">')[1]
                                .split("</span>")[0];
                            isp = ' '+ isp
                        }catch(e){
                            isp = ''
                        }
                        //console.log(str,isp);
                        ipshudi =
                            str.indexOf("a") != -1
                            ? str
                            .split(">")
                            .map((item) => item.split("<")[0])
                            .join(" ")
                        : str;
                        ipshudi += isp
                        //console.log(ipshudi);
                        arr1 = data
                            .split("绑定过的域名如下")[1]
                            .split('">\n<p>')[1]
                            .split("</div>")[0]
                            .split('class="date">')
                            .filter((_, index) => index != 0);
                    }
                    arr2 = arr1.map((item) => item.split("</a>")[0]);
                    arr2.forEach((item) => {
                        arr.push({
                            domain: item.split('target="_blank">')[1],
                            date: item.split("</span>")[0],
                        });
                    });
                    //console.log("请求成功", arr[0], arr.length, ipshudi);
                } else {
                    let isp = ''
                    if (isip138) {
                        //ip138
                        ipshudi = data.split("<h3>")[1].split("</h3>")[0];
                    } else {
                        //ipchaxun
                        let str = data
                        .split("归属地：</span>")[1]
                        .split('class="value">')[1]
                        .split("</span>")[0];
                        isp = data
                            .split("运营商：</span>")[1]
                        try{
                            isp = isp.split('class="value">')[1]
                                .split("</span>")[0];
                            isp = ' '+ isp
                        }catch(e){
                            isp = ''
                        }
                        //console.log(str,isp);
                        ipshudi =
                            str.indexOf("a") != -1
                            ? str
                            .split(">")
                            .map((item) => item.split("<")[0])
                            .join(" ")
                        : str;
                        ipshudi += isp
                    }
                    //console.log("暂无结果:", cip);
                    //console.log(data.split('暂无结果')[1]);
                }
                resArr.push({
                    ip: cip,
                    ipshudi,
                    domain: arr,
                    website,
                });
                //console.log(resArr);
            } else {
                if (data.indexOf("禁止查询该iP") != -1){
                    resArr.push({
                        ip: cip,
                        ipshudi:'',
                        domain: [{
                            domain: '禁止查询该iP',
                            date: formatDate(new Date()),
                        }],
                        website,
                    });
                    console.log("禁止查询该iP");
                }else{
                    console.log("获取数据失败");
                }
            }
        } else {
            console.log("没有数据");
        }

        let status = sessionStorage.getItem('status')||0
        let ips = localStorage.getItem('ips')?JSON.parse(localStorage.getItem('ips')):[]
        let ipsData = localStorage.getItem('ipsData')?JSON.parse(localStorage.getItem('ipsData')):[]

        if(resArr.length && resArr.length>0){
            if(status==1){
                let isRepeat = false;
                ipsData = ipsData.map(item=>{
                    if(item.ip==resArr[0].ip){
                        isRepeat = true
                        return resArr[0]
                    }else{
                        return item
                    }
                })
                if(!isRepeat)ipsData.push(resArr[0])

                localStorage.setItem('ipsData',JSON.stringify(ipsData))
                console.log('当前存储数据长度：',ipsData.length)
                if(ipsData.length > 20){
                    console.log('上传批量数据,长度为',ipsData.length)
                    request('https://moodtracks.cn:6789/_update_rdns',ipsData,true)
                }

                console.log('循环中,剩余IP数量：',ips.length)
                console.log('当前IP信息：',resArr)
                if(ips.length>0){
                    if(ips.indexOf(cip)!=-1){
                        ips.splice(ips.indexOf(cip),1)
                        localStorage.setItem('ips',JSON.stringify(ips))
                    }

                    if(ips.length>0){
                        setTimeout(()=>{location.href=`https://site.ip138.com/${ips[0]}/`},1000)
                    }else{
                        console.log('没有待查询ip时发送批量数据')
                        if(ipsData.length>0)request('https://moodtracks.cn:6789/_update_rdns',ipsData,true)
                        request('https://moodtracks.cn:6789/get_pending_ips')
                    }
                }else{
                    request('https://moodtracks.cn:6789/get_pending_ips')
                }
            }else{
                if(resArr.length>0){
                    console.log('上传单数据：',resArr);
                    request('https://moodtracks.cn:6789/_update_rdns',resArr)
                }
                if(ipsData.length>0){
                    console.log('上传批量数据,长度为',ipsData.length)
                    request('https://moodtracks.cn:6789/_update_rdns',ipsData,true)
                }
            }
        }else{
            console.log('没有提取信息时发送批量数据')
            if(ipsData.length>0)request('https://moodtracks.cn:6789/_update_rdns',ipsData,true)
        }

        function request(_url,_data=[],_isMulti=false){
            if(isip138){
                // 使用 fetch 发起 POST 请求
                fetch(_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify(_data)
                })
                    .then(response => {
                    // 检查响应状态码是否在 200-299 范围内
                    if (!response.ok) {
                        throw new Error('请求失败，状态码：' + response.status);
                    }
                    // 返回解析后的 JSON 数据
                    return response.json();
                })
                    .then(responseData => {
                    // 处理响应数据
                    console.log(responseData);
                    if(responseData.status==200){
                        console.log('上传成功')
                        document.querySelectorAll('.hd h1')[0].append('ok')
                        let data = responseData.data?JSON.parse(responseData.data):[]
                        if(data.length>0){
                            localStorage.setItem('ips',JSON.stringify(data))
                            console.log('进入下一个ip查询')
                            setTimeout(()=>{location.href=`https://site.ip138.com/${data[0]}/`},1000)
                        }
                    }
                    if(_isMulti&&responseData.status==200){
                        console.log('清空本地存储data')
                        localStorage.setItem('ipsData',JSON.stringify([]))
                    }else if(_isMulti){
                        console.log('上传失败，停止循环')
                        sessionStorage.setItem('status',0)
                    }
                })
                    .catch(error => {
                    // 处理请求过程中的错误
                    console.error('请求过程中发生错误：', error);
                    console.log('上传失败，停止循环')
                    sessionStorage.setItem('status',0)
                });
            }else{
                $.post('https://moodtracks.cn:6789/_update_rdns',{data : JSON.stringify(_data)},(res)=>{
                    console.log(res)
                    if(res.status==200){
                        console.log('上传成功')
                        let data = res.data?JSON.parse(res.data):[]
                        if(data.length>0){
                            localStorage.setItem('ips',JSON.stringify(data))
                            console.log('进入查询下一个ip查询')
                            setTimeout(()=>{location.href=`https://site.ip138.com/${data[0]}/`},1000)
                        }
                    }
                    if(_isMulti&&res.status==200){
                        console.log('清空本地存储data')
                        localStorage.setItem('ipsData',JSON.stringify([]))
                    }else if(_isMulti){
                        console.log('上传失败，停止循环')
                        sessionStorage.setItem('status',0)
                    }
                },"json")
            }
        }

    }



    // fw
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // 消息通知
    const isOnMessage = 0
    const logoToTime = 500;//logo跳转时间（毫秒）
    const isDev = 0;




    // CSS
    {
        var btnCss = `margin-right:24x;
        display:inline-block;
        cursor:pointer;
        margin-left:10px;
        padding:5px 10px;
        background-color:#26A3E9;
        border-radius:4px;
        color:#fff;
        font-size:12px;
         -webkit-user-select: none;
         -moz-user-select: none;
         -ms-user-select: none;
         user-select: none;
         transition: all .2s linear;`
        var inpCss = `background-color: #ffffff;
        color: #666666;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
        text-indent: 10px;
        width: 198px;
        border: 1px solid #dbdfe6;
        padding: 0;
        border-radius: 4px;`
        var selCss = `border: 1px solid #dbdfe6;
        border-radius: 4px;
        height: 28px;
        line-height: 28px;
        text-indent: 10px;
        width: 100px;
        `
    }

    // 导入字体图标库
    // https://fontawesome.p2hp.com/#google_vignette
    if(0)$('head').append($('<link>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' // 替换为你的CSS文件路径
    }));

    // main
    {
        //防止自动退出登录
        if(isOnLogin){ setInterval(() => { i = 1 }, 600000);sessionStorage.setItem('login', '1') }

        //到期时间处理
        if(isShowExp){
            // 请求过滤器
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                if(options.url.indexOf('/get_basic_info.htm')!=-1){
                    //console.log(options)
                    //console.log(options.data)
                    // 保存原始的success回调函数
                    let originalSuccess = options.success;

                    // 修改options.success来添加自定义的回调
                    options.success = function(data, status, jqXHR) {
                        //console.log(data)
                        // 在这里修改响应数据
                        //let modifiedData = data;

                        // 调用原始的success回调函数，传入修改后的数据
                        if (originalSuccess) {
                            originalSuccess(data, status, jqXHR);
                        }

                        try{
                            let currentDate = new Date(new Date().getFullYear()+'-'+String(new Date().getMonth() + 1).padStart(2, '0')+'-'+String(new Date().getDate()).padStart(2, '0')).getTime();//获取当前年月日 2025-02-07
                            if(new Date(data.exp).getTime() < new Date(currentDate).getTime()){
                                $('#nav_ver font').css({'color':'red','font-size':'16px'})
                            }
                        }catch(e){
                            console.log('请求过滤器/get_basic_info.htm',e)
                        }
                    };
                }
            })
        }


        //检查ping检测日志是否开启，如未打开检测将自动开启所有wan
        if(isOnPing){
            const toPingTime = 300;
            setTimeout(()=>{
                $.get('/action/ping_check_log_read.htm',(msg1)=>{
                    //console.log(msg1)
                    if(!msg1||msg1.line && msg1.line.length==0){
                        //开启
                        $.get('/action/wan_line_name_show.htm',(msg2)=>{
                            if(msg2.length>0){
                                const linesArr = []
                                for(let i=0;i<msg2.length;i++){
                                    console.log()
                                    if(msg2[i].id.indexOf('WAN')!=-1)linesArr.push(msg2[i].id)
                                }
                                if(1)
                                    setTimeout(()=>{
                                        $.post('/action/ping_check_log_write.htm', {data : JSON.stringify({
                                            url: 'jd.com',
                                            check_num: 100,
                                            line: linesArr
                                        })}, function (res) {
                                            if (res.state == 1) {
                                                message('success','已开启ping检测')
                                                if (location.search.indexOf("?PAGE=ping") !== -1)location.reload();
                                            }
                                        }, 'json');
                                    },toPingTime)
                            }
                        },'json')
                    }
                },'json');
            },toPingTime)

        }


        //消息
        if(isOnMessage){
            // CSS
            {

            }
            $(".right_t").append(`<div class="fr" style="font-size:22px;margin-right: 10px;position:relative;"><span class="warning_container_entry" style="cursor: pointer;" title="消息">✉</span>
                <div class="warning_container_entry" style="color:#ff5455;position:absolute;top:-7px;right:-2px;font-size:24px;font-weight:bold;cursor: pointer;">·</div>
                <div id="warning_container" style="position:absolute;
                            color:#666;
                            font-size:14px;
                            line-height: normal;
                            top:54px;
                            right: 0;
                            width: 400px;
                            min-height: 400px;
                            background-color: #fff;
                            z-index: 9999;
                            border-radius: 10px;
                            padding-bottom:10px;
                            border: 1px solid #e3e3e3;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);">
                       <div style="padding:10px;border-bottom:1px solid #e5e5e5;font-size:16px;display: flex;justify-content:space-between;align-items:center;">
                           <span>消息通知</span>
                           <span id="warning_close_btn" style="font-weight:bold;font-size:18px;cursor:pointer;" title="关闭">×</span>
                       </div>
                       <ul id="warning_list_container" style="padding:0 20px;">
                           <li><span>通知1</span></li>
                           <li><span>通知2</span></li>
                           <li><span>通知3</span></li>
                       </ul>
                 </div>
            </div>`)


            $("#warning_list_container>li").css({
                borderBottom:"1px solid #e5e5e5",
                padding:"10px 0",
                cursor: "pointer"
            })

            $(".warning_container_entry").click(()=>{
                $("#warning_container").css({
                    display:"block"
                })
            })
            $("#warning_close_btn").click(()=>{
                $("#warning_container").css({
                    display:"none"
                })
            })

        }

        //-----------
        if(0){
            const float_div_css = `
                width: 20px;
                height: 20px;
                background-color:#b7b7b7;
                position: fixed;
                bottom: 60px;
                right: 10px;
                transition: all .2s linear;
                cursor: pointer;
                transform-origin: center center;
                box-sizing: border-box;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            `
            const float_div_div_css = `
                width:0;
                height:0;
                border:1px solid #e3e3e3;
                background-color:#fff;
                position: absolute;
                bottom: 0px;
                right: 31px;
                border-radius: 10px;
                transition: all .2s linear;
                cursor: pointer;
                opacity: 0;
                overflow: hidden;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            `
            $("body").append(`<div id="float_div" style="position: fixed;bottom: 60px;right: 10px;">
                <div id="float_div_div" style="${float_div_div_css}">
                    <ul>
                        <li>
                            <div>名称：</div>
                            <div>
                                <input type="checkbox" name="able" class="input_hide able" value="1" id="test">
				                <label class="slider-v3" for="changeFlowIde"></label>
				            </div>
                        </li>
                    </ul>
                </div>
                <div id="float_div_icon" style="${float_div_css}"><div style="background-color:#b7b7b7;width:100%; height:100%;transform: rotateZ(-45deg);"></div></div>
            </div>`)

            openFloatDiv()
            $("#float_div_div>ul").css({
                border:'1px solid red'
            })

            $("#float_div_div>ul>li").css({
                display:'flex'
            })

            $("#float_div_div>ul>li>div:first-of-type").css({
                border:'1px solid red',
                width:'60px'
            })



            let isOpenDiv = false
            $("#float_div_icon").click(function(){
                if(isOpenDiv){
                    openFloatDiv()
                }else{
                    closeFloatDiv()
                }
                isOpenDiv = !isOpenDiv
            })

            if(0)$("#float_div").hover(function () {
                openFloatDiv()
            }, function () {
                closeFloatDiv()
            })

            function openFloatDiv(){
                $("#float_div_icon").css({
                    transform: "rotateZ(-90deg)"
                })
                $("#float_div_div").css({
                    opacity: "1",
                    width:"300px",
                    height:"400px"
                })
            }
            function closeFloatDiv(){
                $("#float_div_icon").css({
                    transform: "rotateZ(0deg)"
                })
                $("#float_div_div").css({
                    opacity: "0",
                    width:"0px",
                    height:"0px"
                })
            }
        }



        // 快捷导航
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if (isFastNav) {
            $("#nav").css("display","none")
            $('.right_t div:first').after(`<div class="right_nav" id="fast_nav" style="display:flex;user-select: none;width:calc(100% - 680px);height:100%;padding:0;position: relative;transition: all .2s linear;">
                <ul class="fast_nav" style="width:calc(100% - 55px);display:flex;transition: all .2s linear;padding-left:5px;"></ul>
                <div class="close_all_nav" style="min-width: 30px;
                            height: 35px;
                            color:#939393;
                            border: 1px solid rgba(0, 0, 0,0);
                            transition: all 0.2s linear 0s;
                            cursor: pointer;
                            margin-top: 12px;
                            margin-left:5px;
                            border-radius: 10px;
                            position: relative;
                            display: none;
                            justify-content: center;
                            align-items: center;
                            background-color: rgb(255, 255, 255);" title="关闭全部">✖</div>
            </div>`);

            //添加滑块开关
            /*$("#fast_nav").append(`<div id="changeNavBtn" style="position:absolute;top:0;">
                   <input type="checkbox" name="able" class="input_hide able" value="1" id="changeNav">
				   <label class="slider-v3" for="changeNav"></label>
				</div>`)*/

            //初始化快捷导航
            initNav()



            //初始化快捷导航
            function initNav(){
                const actionNav = [location.search,location.pathname+location.search]//当前导航信息
                const navList = {id:location.search,name:main?.nav[1],href:location.pathname+location.search}//所有导航信息
                let navData = JSON.parse(sessionStorage.getItem("fastNavData"))||{actionNav,navList:[]}//初始导航数据
                let curNavIndex = 0//当前导航下标
                let showNavLength = 3//最大显示导航长度
                let fastNavAbbHeight = 0//更多导航高度

                $(document).ready(function() {
                    const screenWidth = $(window).width(); // 页面加载完成时获取屏幕宽度

                    if(1383<screenWidth&&screenWidth<=1504){
                        showNavLength = 4;
                    }else if(1504<screenWidth&&screenWidth<=1618){
                        showNavLength = 5;
                    }else if(1618<screenWidth&&screenWidth<=1735){
                        showNavLength = 6;
                    }else if(1735<screenWidth&&screenWidth<=1845){
                        showNavLength = 7;
                    }else if(1845<screenWidth&&screenWidth<=1979){
                        showNavLength = 8;
                    }else if(1979<screenWidth&&screenWidth<=2099){
                        showNavLength = 9;
                    }else if(2099<screenWidth&&screenWidth<=2218){
                        showNavLength = 10;
                    }else if(2218<screenWidth&&screenWidth<=2340){
                        showNavLength = 11;
                    }else if(screenWidth>=2458){
                        showNavLength = 12;
                    }else{
                        showNavLength = 3;
                    }

                });

                if(navData.navList.length>0){
                    let temp = false
                    for(let i=0;i<navData.navList.length;i++){
                        if(navData.navList[i].id==location.search)break;
                        if(i==navData.navList.length-1)temp=true
                    }
                    if(temp){
                        navData.navList.push(navList)
                    }
                    navData.actionNav=actionNav
                }else{
                    navData.navList=[navList]
                }
                sessionStorage.setItem("fastNavData",JSON.stringify(navData))
                let htmlA = ''
                let htmlB = ''
                navData.navList.forEach((item,index)=>{
                    if(navData.actionNav[0]==item.id)curNavIndex=index;
                    if(index<showNavLength){
                        htmlA+=`<li title="${item.name}"><a href="${item.href}">${item.name}</a><span data-id="${item.id}" title="关闭">×</span></li>`
                    }else{
                        htmlB+=`<li title="${item.name}"><a href="${item.href}">${item.name}</a><span data-id="${item.id}" title="关闭">×</span></li>`
                        //console.log(item)
                    }

                })

                $("ul.fast_nav").html(htmlA)


                $("ul.fast_nav>li").css({
                    marginTop:"10px",
                    marginRight:"5px",
                    width:"120px",
                    fonsSize:"12px",
                    paddingRight:"12px",
                    lineHeight:"42px",
                    display:"flex",
                    justifyContent:"space-between",
                    position:"relative",
                    cursor: "pointer",
                    backgroundColor:"#fff",
                    transition: "all .2s linear",
                    borderRadius:"6px 6px 0 0",
                    border:"1px solid #f1f1f1",
                    borderBottom: "none"
                })
                $("ul.fast_nav>li a").css({
                    padding:"0",
                    paddingLeft:"12px",
                    color: "#666",
                    width:"calc(100% - 22px)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                })
                $("ul.fast_nav>li span").css({
                    position: "absolute",
                    right:"6px",
                    fontSize:"16px",
                    height: "fit-content"
                })

                if(htmlB!=''){
                    $("ul.fast_nav").append(`<li class="fast_nav_more" style="min-width:30px;height:35px;border:1px solid #f1f1f1;transition: all .2s linear;cursor: pointer;margin-top:12px;border-radius:10px;
                                                    position: relative;
                                                    display: flex;
                                                    justify-content: center;
                                                    align-items: center;">
                    <image style="width:12px;transform: rotateZ(90deg);" src="/images/menu_right.png" />

                    <div id="fast_nav_abb" style="width:170px;position: absolute;left:0;top:41px;z-index:9999;background-color:#fff;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);border-radius: 10px;overflow: hidden;opacity: 0;transition: all .2s linear;">
                        <ul class="fast_nav_abbreviate" style="width:100%;display:flex;flex-direction: column;box-sizing: border-box;padding:5px;"></ul>
                    </div>
                </li>`)


                    $("ul.fast_nav_abbreviate").html(htmlB)

                    $("ul.fast_nav_abbreviate>li").css({
                        backgroundColor:"#fff",
                        padding: "0 10px",
                        width: "100%",
                        lineHeight: "40px",
                        boxSizing: "border-box",
                        display: "flex",
                        justifyContent: "space-between",
                        transition: "all .2s linear",
                        borderRadius:"6px",
                    })
                    $("ul.fast_nav_abbreviate>li:not(:last-child)").css({marginBottom:"5px"})
                    $("ul.fast_nav_abbreviate>li>a").css({
                        width:"calc(100% - 22px)",
                    })
                    $("ul.fast_nav_abbreviate>li>span").css({
                        fontSize:"16px",
                    })

                    fastNavAbbHeight = $("#fast_nav_abb").height()//获取更多导航高度
                    $("#fast_nav_abb").css("height","0");
                    $(".close_all_nav").css("display","flex")
                }

                if(htmlB!=''&&curNavIndex>=showNavLength){
                    //当前导航
                    $("ul.fast_nav li").eq(curNavIndex+1).css({backgroundColor:"#f1f1f1"})
                }else{
                    //当前导航
                    $("ul.fast_nav>li").eq(curNavIndex).css({backgroundColor:"#f1f1f1",})
                }


                if(curNavIndex>showNavLength&&0){
                    // 关闭导航按钮
                    $('ul.fast_nav').on('click', 'li>span', function() {
                        closeNav($(this).attr('data-id'),curNavIndex)
                    });
                }else{
                    // 关闭导航按钮
                    $('ul.fast_nav').on('click', 'li>span', function() {
                        closeNav($(this).attr('data-id'),curNavIndex)
                    });
                }

                $('ul.fast_nav').off('click', 'li>span')
                // 关闭导航按钮
                $('ul.fast_nav').on('click', 'li>span', function() {
                    closeNav($(this).attr('data-id'),curNavIndex)
                });

                // 关闭全部导航按钮
                $(".close_all_nav").click(function() {
                    sessionStorage.removeItem("fastNavData")
                    initNav()
                });


                $("ul.fast_nav>li a").eq(curNavIndex).css({color: "#26a3e9"})

                //hover
                $(`ul.fast_nav>li:not(:eq(${curNavIndex<showNavLength?curNavIndex:curNavIndex+1}))`).hover(function () {
                    $(this).css({backgroundColor:"#f1f1f1"})
                }, function () {
                    $(this).css({backgroundColor:"#fff"})
                });
                $(`ul.fast_nav_abbreviate>li:not(:eq(${curNavIndex-showNavLength}))`).hover(function () {
                    $(this).css({backgroundColor:"#f1f1f1"})
                }, function () {
                    $(this).css({backgroundColor:"#fff"})
                });
                $("li.fast_nav_more").hover(function () {
                    $("#fast_nav_abb").css({
                        opacity:"1",
                        height:fastNavAbbHeight+"px",
                    })
                }, function () {
                    $("#fast_nav_abb").css({
                        opacity:"0",
                        height:"0",
                    })
                });
                $(".close_all_nav").hover(function () {
                    $(this).css({
                        color:"#ff7875",
                        backgroundColor:"#fff2f0"
                    })
                }, function () {
                    $(this).css({
                        color:"#939393",
                        backgroundColor:"#fff"
                    })
                });


                $(`ul.fast_nav>li a:not(:eq(${curNavIndex}))`).hover(function () {
                    $(this).css({color: "#26a3e9"})
                }, function () {
                    $(this).css({color: "#666"})
                });

                $("ul.fast_nav>li span").hover(function () {
                    $(this).css({color:"#ff4d4f"})
                }, function () {
                    $(this).css({color:"#666"})
                });

                if(!htmlB)$(".close_all_nav").css("display","none")
                $("a").css("textDecoration","none")
            }

            function closeNav(id,curI){
                let navData = JSON.parse(sessionStorage.getItem("fastNavData"))
                navData.navList = navData.navList.filter(item => item.id!=id);
                sessionStorage.setItem("fastNavData",JSON.stringify(navData))
                if(location.search==id&&navData.navList.length>0){
                    if(navData.navList.length<=curI){
                        location.href = navData.navList[navData.navList.length-1].href
                    }else{
                        location.href = navData.navList[curI].href
                    }
                }else{
                    initNav()
                }
            }

            $(".right").css("overflow","visible")
        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------







        // 常用导航
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if (isCommonNav) {
            let curNavIndex = 9999//当前导航下标
            let commonNavHeight = 0//常用导航高度
            $('body>div.right').append(`
                <div id="common_nav_container" style="width:30px;
                            overflow:hidden;
                            background-color:#fff;
                            position: absolute;
                            top: 60px;left: 179px;
                            z-index: 9999;
                            opacity: 0;
                            display:none;
                            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
                            border-radius:10px;
                            transition: all 0.2s linear 0s;">
                    <ul class="common_nav" style="width:100%;display:flex;flex-direction: column;box-sizing: border-box;padding:5px;border-radius:10px;">
                        ${addCommonNavItem(commonNavData)}
                    </ul>
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:#f1f1f1;opacity: 1;display:block;"></div>
                </div>
                `)

            $("ul.common_nav>li").css({
                backgroundColor:"#fff",
                padding: "0 10px",
                width: "100%",
                lineHeight: "40px",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "space-between",
                transition: "all .2s linear",
                borderRadius:"6px",
                cursor: "pointer",
                userSelect: "none",
                whiteSpace: "nowrap"
            })
            $("ul.common_nav>li:not(:last-child)").css({marginBottom:"5px"})

            //初始化常用导航导航
            $("ul.common_nav>li").eq(curNavIndex).css({backgroundColor:"#f1f1f1",color:"#26a3e9"})
            commonNavHeight = $(`#common_nav_container`).height()
            $(`#common_nav_container`).css({width:"30px",height:"30px",opacity: "1",display:"block"})

            //hover
            $(`#common_nav_container`).hover(function () {
                $(this).children('div').css({opacity:"0",display:"none"})
                $(this).css({width:"170px",height:commonNavHeight})
            }, function () {
                $(this).children('div').css({opacity:"1",display:"block"})
                $(this).css({width:"30px",height:"30px"})
            });
            $(`ul.common_nav>li:not(:eq(${curNavIndex}))`).hover(function () {
                $(this).css({backgroundColor:"#f1f1f1",color:"#26a3e9"})
            }, function () {
                $(this).css({backgroundColor:"#fff",color:"#666"})
            });

            //点击事件
            $('ul.common_nav').on('click', 'li', function() {location.href = `/index.htm?PAGE=${$(this).attr('data-page')}`});

            function addCommonNavItem(data){
                let comNav = ''
                data.forEach((item,index)=>{
                    if(item.page==location.search.split('=')[1])curNavIndex=index;
                    comNav += `<li data-page="${item.page}" title="${item.name}">${item.name}</li>`
                })
                return comNav
            }
        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------







        // 首页
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        let IndexTime = null
        if (location.search.indexOf("?PAGE=index") !== -1) {
            //检查脚本更新
            if(isCheckFwVer)checkVersion(FWVERSION,5000)


            $(document).on({mouseenter: function() { $(this).css({cursor:"pointer",color:"#26a3e9"});},
                            mouseleave: function() { $(this).css({color:"#666"}) } }, '#sn');
            $("#sn").attr("title","点击复制")
            $("#sn").css({cursor:"pointer"})
            $("#sn").click(function () {
                let str = $('#sn').text();
                if (str!== ""){
                    let $temp = $('<input>');
                    $('body').append($temp);
                    $temp.val(str).select();
                    document.execCommand('copy');
                    $temp.remove();
                    message('success', '已复制')
                }
            })



            //添加cpu温度
            IndexTime = null
            $.get('/action/env_check.htm', {}, function (msg) {
                checkCPU()
                // console.log(msg);
                let html = ''
                if (msg.cpu_term < 20 || msg.cpu_term > 85) {
                    html += '<span>CPU温度：&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;<font style="color:#ff0000;">' + msg.cpu_term + ' ℃</font>&nbsp;]<img src="images/warning.png"  title="温度异常，请及时清理设备，检查设备散热问题。" style="margin-left: 5px;width:14px; height:14px;"></span>';

                    $(".box-B10 p:nth(5)").after(`
    <div class="H10"></div>
    <p class="blk_tit"><span class="info_tit"><span class="cpuwendu" style="cursor:pointer;" onclick="(()=>{window.location='/index.htm?PAGE=env_check'})()" title="点击跳转到环境检测">CPU温度</span></span><span class="blk_txt" id="cpu_term"><font style="color:#ff0000;">${msg.cpu_term} ℃</font><img src="images/warning.png"  title="温度异常，请及时清理设备，检查设备散热问题。" style="margin-left: 5px;width:14px; height:14px;">
    </span></p>
                                  `)
                } else {
                    html += '<span>CPU温度：&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;<font style="color:#59CBA0">' + msg.cpu_term + ' ℃</font>&nbsp;]</span>';
                    $(".box-B10 p:nth(5)").after(`
    <div class="H10"></div>
    <p class="blk_tit"><span class="info_tit"><span class="cpuwendu" style="cursor:pointer;" onclick="(()=>{window.location='/index.htm?PAGE=env_check'})()" title="点击跳转到环境检测">CPU温度</span></span><span class="blk_txt" id="cpu_term">${msg.cpu_term} ℃
    </span></p>
                                  `)
                }

                $(".box-B10 p:last-of-type").css("display", "none")

            }, "JSON")

            IndexTime = setInterval(() => {
                checkCPU()
                $.get('/action/env_check.htm', {}, function (msg) {
                    //console.log(msg)
                    if (msg.cpu_term < 20 || msg.cpu_term > 85) {
                        $("#cpu_term").html(`<font style="color:#ff0000;">${msg.cpu_term} ℃</font><img src="images/warning.png"  title="温度异常，请及时清理设备，检查设备散热问题。" style="margin-left: 5px;width:14px; height:14px;">
                    `)
                    } else {
                        $("#cpu_term").html(msg.cpu_term + " ℃")
                    }
                }, "JSON")
            }, 4000)

            function checkCPU(){
                let cpu = $('#cpu').text()
                let mem = $('#mem').text()
                if(cpu.indexOf('%')!=-1){
                    cpu = cpu.split('%',1)[0]
                    if(cpu<0&&cpu>80){
                        $('#cpu').css('color','#ff0000')
                    }
                }
                if(mem.indexOf('%')!=-1){
                    mem = mem.split('%',1)[0]
                    if(mem<0&&mem>80){
                        $('#mem').css('color','#ff0000')
                    }
                }
            }


            $(document).on({mouseenter: function() { $(this).css({cursor:"pointer",color:"#26a3e9"});},
                            mouseleave: function() { $(this).css({color:"#666"}) } }, '.cpuwendu');

            //关闭跳转事件
            $(".col-xs-7").off("click");

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------







        //内网主机
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if (isOnIpCheck&&(location.search.indexOf("?PAGE=hosts_info") !== -1)) {

            let show_connectData = {ip: '', wan: 'all'}

            //下拉列表选择事件
            $(".sel_time,.sel_line").change(()=>{
                $(".handle_flush").click()
            })

            //  隐藏提示
            $(".seitchH-ul>.PPPOE_div>.H20>p").html('')

            // 将键盘事件绑定到document，并检查ESC键
            $(document).on('keydown', function(event) {
                if (event.key === 'Escape' || event.keyCode === 27) {
                    console.log("ESC键被按下");
                    // 关闭连接列表
                    $(".sure").click()
                }else if (event.key === 'r' || event.key === 'R') {
                    console.log('R 键被按下');
                    // 模态框显示的状态下
                    if ($('#modalBack').css('display') === 'block'){
                        // 刷新连接列表
                        $('#lijishuaxinBTN').click()
                    }
                }
            });

            //IP查询
            if(0){
                $("#listModal>.modal-body>.header").after(`
                <div style="margin-bottom:10px;display:flex;padding-left:20px;align-items:center;">
                    <span style="margin-left:10px;">IP/域名查询：</span>
                    <input type="text" id="ipQueryInp2" value="" style="background-color: #ffffff;
                                                                  color: #666;
                                                                  font-size: 14px;
                                                                  height: 25px;
                                                                  line-height: 25px;
                                                                  text-indent: 10px;
                                                                  width: 198px;
                                                                  border: 1px solid #dbdfe6;
                                                                  padding: 0;
                                                                  border-radius: 4px;width:140px;">
                     <div id="ipQueryClear2" style="display:inline-block;font-size:12px;cursor:pointer;color:#666;margin-left:10px;transition:all .2s linear;">清空</div>
                     <div id="ipQueryBtn2" style="${btnCss}padding:2px 15px;margin-left:10px;">查询</div>
                </div>`)

                $("#listModal").css({transform:"translateY(-50px)"})
                $("#listModal>.modal-body>.header").css({position:"relative"})
                $("#listModal>.modal-body>div:nth(2)").css({maxHeight:"450px"})
                $("#listModal>.modal-body>div:nth(2)>.connect_table").css({margin:"0 30px",boxSizing: "border-box",width:"calc(100% - 60px)"})

                //IP/域名查询输入框添加键盘事件
                $('#ipQueryInp2').keydown(function(event) {
                    // 使用 event.key 来判断按键
                    if (event.key === 'Enter') {
                        if($("#ipQueryInp2").val().trim()!=''){window.open(`https://ip138.com/iplookup.php?ip=${$("#ipQueryInp2").val().trim()}&action=2`)
                                                              }else{message('warning','请输入查询IP或域名')}
                    }
                });

                $("#ipQueryClear2").click(()=>{$("#ipQueryInp2").val('')})
                $("#ipQueryBtn2").click(()=>{
                    if($("#ipQueryInp2").val().trim()!=''){window.open(`https://ip138.com/iplookup.php?ip=${$("#ipQueryInp2").val().trim()}&action=2`)}else{message('warning','请输入查询IP或域名')}
                })
            }



            // 原版
            // 内网主机立即刷新按钮
            const lijishuaxinCss = `cursor: pointer;padding: 5px 10px;background-color: #39ade6;border-radius: 4px;color: rgb(255, 255, 255);font-size: 12px;user-select: none;transition: 0.2s linear;`
            $("#listModal>.modal-body>.header").css({
                display:'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            })
            $("#listModal>.modal-body>.header").append(`<div id="wrapper_list_info" style="display:flex;align-items:center;transition:opacity 0.3s;opacity: 0;">
                <!-- <div style="display:flex;flex;lign-items;">
                   <div id="list_prev_btn" style="margin:0 20px;${lijishuaxinCss}">前一个</div><div id="list_next_btn" style="margin:0 20px;${lijishuaxinCss}">后一个</div>
                </div> -->
                <div id="lijishuaxinBTN" style="margin:0 20px;${lijishuaxinCss}" title="R 刷新">立即刷新</div>
            </div>`)

            //hover
            $('#wrapper_list_info').hover(function(){
                $(this).css({
                    opacity: '1'
                })
            },function(){
                $(this).css({
                    opacity: '0'
                })
            })

            //click
            // 前一个
            if(0)$('#list_prev_btn').click(()=>{
                //console.log(show_connectData.ip)
                $('#tblMain>tr').each((index,item)=>{
                    if($(item).find('.ip').text()==show_connectData.ip){
                        console.log(index,item)
                        $(item).find('.conntrack').click()
                        return;
                    }
                })

            })
            // 后一个
            if(0)$('#list_next_btn').click(()=>{
                //console.log(show_connectData.ip)
                $('#tblMain>tr').each((index,item)=>{
                    if($(item).find('.ip').text()==show_connectData.ip){
                        $(item).find('.conntrack').click()
                        return;
                    }
                })

            })
            $('#lijishuaxinBTN').click(()=>{
                //console.log(show_connectData.ip)
                $('#tblMain>tr').each((index,item)=>{
                    if($(item).find('.ip').text()==show_connectData.ip){
                        $(item).find('.conntrack').click()
                        return;
                    }
                })

            })





            // 单机应用查看
            {
                $(".PPPOE_div>.div-tab").prepend(`<span style="margin-right:5px;">单机查看：</span><input type="text" id="ipInp" value="" style="${inpCss}width:130px;" />
                         <div id="searchBtn"  style="${btnCss}"  >查看</div><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;</span>`)

                $("#ipInp").val(localStorage.getItem("ipVal")||'')


            }

            //IP正则
            let ipaddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/;


            //遮罩层CSS
            {
                var maskCss = `background-color:rgba(0,0,0,.3);
                            display:none;
                            position:fixed;
                            width:100%;
                            min-width:1200px;
                            height:100%;
                            top:0;
                            left:0;
                            bottom:0;
                            z-index:99999;
                            transition: all .2s linear;
                            box-sizing: border-box;
                            overflow:auto;
                            `
                var maskGtDiv = `width:1200px;
                                height:calc(100% - 110px);
                                overflow:hidden;
                                margin:55px auto;
                                background-color:#fff;
                                border-radius: 10px;
                                padding:10px 0;
                                box-sizing: border-box;
                                box-shadow: 1px 1px 10px #2f2f2f;`
                var refreshTimeCss = `background-color: #ffffff;
        color: #666666;
        font-size: 13px;
        height: 28px;
        line-height: 28px;
        text-indent: 10px;
        width: 52px;
        border: 1px solid #dbdfe6;
        padding: 0;
        border-radius: 4px;
        margin:0 5px;`
                var listTableWrapperCss = `width:100%;
                                           height:calc(100% - 131px);
                                           margin-top:45px;
                                           border:1px solid #f0f0f0;
                                           border-radius:0 0 10px 10px;
                                           padding-bottom:10px;
                                           overflow: auto;
                                           `
            }
            //添加遮罩层
            {
                $("body").append(`
                <div id="mask" style="${maskCss}">
                     <div style="${maskGtDiv}">
                          <div style="
                                padding:5px 20px;
                                display:flex;
                                justify-content: space-between;
                                align-items:center;
                                border-bottom:1px solid #a5a5a5;
                                ">
                                <span style="font-size:16px;font-weight: bold;">连接列表</span>
                                <div id="colseBtn" style="${btnCss}color:#ff4d4f;background-color:#fff;" title="ESC 关闭">关闭</div>
                           </div>

                             <div style="padding:15px 40px;height:calc(100% - 95px);position: relative;">
                               <ul style="height:31px;line-height:31px;margin-bottom:10px;display: flex;">
                                   <li style="width:80px;">当前 IP： <span id="currentIP" style="font-weight: bold;">-</span></li>
                                   <li>连接数：<span id="conn_num" style="color: #0065ce;font-weight: bold">-</span></li>
                                   <li style="transform: translateX(-58px);">未响应：<span id="Unresponsive" style="color: #ccc;font-weight: bold;">-</span></li>
                                   <li style="position:relative;">
                                       <div style="position:absolute;left:-10px;width:260px;;display: flex;display:none;">
                                           <div style="width:50%;">↑<span>888.86KB</span></div><div>↓<span>888.86KB</span></div>
                                       </div>
                                   </li>
                               </ul>
                               <div style="display:flex;justify-content: space-between">
                                 <div style="display:flex;flex-direction: row;align-items:center;">
                                     <select id="isHide" class="selCss"style="${selCss}width:65px;">
                                         <option value="1">隐藏</option>
                                         <option value="0">只看</option>
                                     </select>
                                     <span style="margin:0 4px;"></span>
                                     <select class="selCss" id="hideType" style="${selCss}margin-right:5px;">
                                         <option value="appstat">连接类型</option>
                                         <option value="pri">优先级</option>
                                         <option value="proto">协议</option>
                                         <option value="sport">源端口</option>
                                         <option value="dport">目的端口</option>
                                         <option value="daddr">目标地址</option>
                                         <option value="wan">外网接口</option>
                                         <option value="status">连接状态</option>
                                     </select><span>：</span>
                                     <input id="hideInp" style="${inpCss}width:130px;margin:0 5px;"/><span id="endInp">-<input id="hideInp2" style="${inpCss}width:130px;margin-left:5px;"/></span>
                                     <div id="resetHideBtn" style="display:inline-block;font-size:12px;cursor:pointer;color:#666;margin-left:10px;transition:all .2s linear;">重置</div>
                                     <div id="okHideBtn" style="${btnCss}">确认</div>

                                 </div>
                              <div>自动刷新：<input type="number" id="refreshTimeInp" style="${refreshTimeCss}"/>秒
                                       <div id="StartStopBtn" style="${btnCss}" title="空格 停止刷新">开始</div>
                                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                       <div id="reloadBtn"  style="${btnCss}" title="R 刷新">立即刷新</div>
                              </div>
                               </div>

                                 <ul id="listTableWrapper" style="${listTableWrapperCss}">
                                   <li style="position:absolute;
                                              width: calc(100% - 77px);
                                              top: 102px;
                                              left: 40px;">
                                     <ul class="listTableHead" style="border-radius: 10px 10px 0 0;overflow:hidden;cursor: pointer;">
                                         <li data-type="appstat">连接类型</li>
                                         <li data-type="pri">优先级</li>
                                         <li data-type="up">上传流量</li>
                                         <li data-type="down">下载流量</li>
                                         <li data-type="proto">协议</li>
                                         <li data-type="sport">源端口</li>
                                         <li data-type="dport">目的端口</li>
                                         <li data-type="daddr">目标地址</li>
                                         <li data-type="wan">外网接口</li>
                                         <li data-type="status">连接状态</li>
                                     </ul>
                                   </li>

                                 </ul>
                                 </div>
                                </div>
                                `)


                //添加排序元素
                $(".listTableHead>li").append(`
                <div style="display:flex;flex-direction: column;margin-left:5px;">
                    <div style="width: 0;height: 0;
                         border-left: 4px solid transparent;
                         border-right: 4px solid transparent;
                         border-bottom: 5px solid #b1b1b1;"></div>
                     <div style="width: 0;height: 0;margin-top:3px;
                         border-top: 5px solid #b1b1b1;
                         border-left: 4px solid transparent;
                         border-right: 4px solid transparent;"></div>
                </div>
                `)



                //CSS-----------------------
                {
                    $("#currentIP").parent().parent().find("li").css({
                        width:"200px",
                        display:"flex",
                        alignItems:"center"
                    });
                    $(".selCss>option").css({
                        border:"1px solid #f0f0f0",
                    })

                    $(".listTableHead>li").css({
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "all .2s linear"
                    })


                    $("#listTableWrapper>li>ul").css({
                        display:"flex"
                    })
                    $("#listTableWrapper>li>ul>li").css({
                        width:"10%",
                        height:"40px",
                        display:"flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderBottom:"1px solid #f0f0f0",
                    })
                    $("#listTableWrapper>li>ul").eq(0).children('li').css({
                        backgroundColor:"#fafafa",
                        fontWeight: "bold",
                        height:"40px"
                    })
                    //hover-------------------
                    //查看按钮hover
                    $("#searchBtn").hover(function(){
                        // 移入
                        $(this).css("background-color","#39ade6")
                    }, function(){
                        // 移出
                        $(this).css("background-color","#26a3e9")
                    });
                    // 遮罩层关闭按钮hover
                    $("#colseBtn").hover(function(){
                        $(this).css("color","#ff7875")
                        $(this).css("background-color","#fff2f0")
                    }, function(){
                        $(this).css("color","#ff4d4f")
                        $(this).css("background-color","#fff")
                    });
                    //按钮hover
                    $("#searchBtn,#reloadBtn,#okHideBtn,#StartStopBtn,#ipQueryBtn1,#ipQueryBtn2").hover(function(){
                        // 移入
                        $(this).css("background-color","#39ade6")
                    }, function(){
                        // 移出
                        $(this).css("background-color","#26a3e9")
                    });
                    //重置、清空hover
                    $("#resetHideBtn,#ipQueryClear1,#ipQueryClear2").hover(function(){
                        $(this).css("color","#39ade6")
                    }, function(){
                        $(this).css("color","#666")
                    });

                    //列表头部排序hover
                    $(".listTableHead>li").hover(function(){
                        // 鼠标移入时的处理逻辑
                        $(this).css("background-color","#efefef")
                    }, function(){
                        // 鼠标移出时的处理逻辑
                        $(this).css("background-color","#fafafa")
                    });

                    //回到顶部按钮hover
                    $("#back-to-top").hover(function(){
                        // 鼠标移入时的处理逻辑
                        $(this).css("background-color","#f0f0f0")
                    }, function(){
                        // 鼠标移出时的处理逻辑
                        $(this).css("background-color","#fff")
                    });
                }
            }
            //ip详情列表样式
            function ipListTableCss(){
                $("#listTableWrapper>li>ul").css({
                    display:"flex"
                })
                $("#listTableWrapper>li>ul>li").css({
                    width:"10%",
                    height:"30px",
                    display:"flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom:"1px solid #f0f0f0",
                })
                $("#listTableWrapper>li>ul>li:first-child").css({ width:"11%", })
                $("#listTableWrapper>li>ul>li:nth-child(2)").css({ width:"9%", })
                $("#listTableWrapper>li:gt(0)>ul").css({
                    transition: "all .2s linear"
                })
                //hover-------------------
                //除第一个li其他选中
                $("#listTableWrapper>li:gt(0)>ul").hover(function(){
                    // 鼠标移入时的处理逻辑
                    if($(this).children().last().text()=="稳定")
                        $(this).css("background-color","#fafafa")
                }, function(){
                    // 鼠标移出时的处理逻辑
                    if($(this).children().last().text()=="稳定")
                        $(this).css("background-color","#fff")
                });
            }



            let timerReload=null;//刷新定时器
            let isStart=false;//是否开始
            let sort={state:0,type:'down'};//排序
            let ipListData=[];//ip详情数据
            //查看按钮点击事件
            $(document).on("click", "#searchBtn",ipDetail);
            //隐藏重置点击事件
            $(document).on("click", "#resetHideBtn", function(){
                $("#hideInp").val('')
                $("#hideInp2").val('')
                sessionStorage.removeItem('hideEntry')

                getIpList()//发起请求
                message('', '已重置')
            });
            //隐藏输入框添加键盘事件
            $('#hideInp').keydown(function(event) {
                // 使用 event.key 来判断按键
                if (event.key === 'Enter') {
                    hideOk();
                }
            });
            //隐藏确认点击事件
            $(document).on("click", "#okHideBtn",hideOk);
            //切换hideType下拉选项事件
            $('#hideType').change(function() {
                let selectedValue = $(this).val();
                //判断筛选类型是否为源端口与目的端口
                if((selectedValue == 'sport') || (selectedValue == 'dport')){
                    $('#endInp').css("display","inline")
                }else{
                    $('#endInp').css("display","none")
                }
            });
            //自动刷新输入框添加键盘事件
            $('#refreshTimeInp').keydown(function(event) {
                // 使用 event.key 来判断按键
                if (event.key === 'Enter') {
                    if($("#refreshTimeInp").val()>0){
                        clearInterval(timerReload)
                        $("#StartStopBtn").text('停止')
                        isStart=true
                        timerReload=setInterval(getIpList,$("#refreshTimeInp").val()*1000)
                    }else{
                        message('warning','大于 0 生效！')
                    }
                }
            });
            //启/停定时按钮
            $(document).on("click", "#StartStopBtn", function(){
                if(isStart){
                    $("#StartStopBtn").text('开始')
                    clearInterval(timerReload)
                    isStart=false
                    message('', '已停止！')
                }else{
                    if($("#refreshTimeInp").val()>0){
                        message('success', '已开始！')
                        $("#StartStopBtn").text('停止')
                        isStart=true
                        timerReload=setInterval(getIpList,$("#refreshTimeInp").val()*1000)
                    }else{
                        message('warning', '大于 0 生效！')
                    }
                }
            });
            //立即刷新按钮
            $(document).on("click", "#reloadBtn", function(){
                getIpList()
                $("#StartStopBtn").text('开始')
                clearInterval(timerReload)
                isStart=false
            });
            //排序点击事件
            $(document).on("click", ".listTableHead>li", function(){
                $(".listTableHead>li>div").each(function() {
                    $(this).children().eq(0).css("border-bottom-color","#b1b1b1");
                    $(this).children().eq(1).css("border-top-color","#b1b1b1");
                })
                if(sort.type==this.dataset.type){
                    if(sort.state<2){
                        sort.state+=1
                    }else{
                        sort.state=0
                    }
                }else{
                    sort.state=1;
                    sort.type=this.dataset.type;
                }

                switch(sort.state){
                    case 1:$(this).children().children().eq(0).css("border-bottom-color","#1677ff");
                        $(this).children().children().eq(1).css("border-top-color","#b1b1b1");break;
                    case 2:$(this).children().children().eq(0).css("border-bottom-color","#b1b1b1");
                        $(this).children().children().eq(1).css("border-top-color","#1677ff");break;
                }
                addIpList()
            });

            // ip详情列表
            function ipDetail(e,a=false){
                getIpList(a);
                //初始显示隐藏组件
                let hideEntryInp = sessionStorage.getItem('hideEntry')?JSON.parse(sessionStorage.getItem('hideEntry')):'';
                if(Object.prototype.toString.call(hideEntryInp) === '[object Object]'){
                    const keys = Object.keys(hideEntryInp);
                    const values = Object.values(hideEntryInp);
                    $("#hideType").val(keys[0])

                    if(keys[0]=='pri'){
                        switch(values[0]){
                            case "1":$('#hideInp').val("最高");break;
                            case "2":$('#hideInp').val("高");break;
                            case "3":$('#hideInp').val("中");break;
                            case "4":$('#hideInp').val("低");break;
                            case "5":$('#hideInp').val("最低");break;
                        }
                    }else{
                        $('#hideInp').val(values[0][0]);
                        if(values[0][1]!=false)$('#hideInp2').val(values[0][1]);
                        $('#isHide').val(hideEntryInp.isHide);
                    }
                }else{
                    $('#hideInp').val('');
                    $('#isHide').val(1);
                }
            }

            // 隐藏确认
            function hideOk(){
                let hideType = $("#hideType").val()
                let hideVal = $("#hideInp").val().trim()
                let hideVal2 = $("#hideInp2").val().trim()
                let isOk = true
                if(hideType=="pri"){
                    if(/^[\u4e00-\u9fa5]{1,2}$/.test(hideVal)){
                        switch(hideVal){
                            case "最高":hideVal="1";break;
                            case "高":hideVal="2";break;
                            case "中":hideVal="3";break;
                            case "低":hideVal="4";break;
                            case "最低":hideVal="5";break;
                            default:isOk = false;
                        }
                    }else{
                        isOk = false;
                    }
                }else if(hideType=="proto"){
                    if(!(/TCP/i.test(hideVal) || /UDP/i.test(hideVal) || /ICMP/i.test(hideVal)))isOk = false;
                }else if(hideType=="sport"||hideType=="dport"){
                    const num = parseInt(hideVal, 10);
                    if(!(!isNaN(num) && num >= 0 && num <= 65535))isOk = false;
                    const num2 = parseInt(hideVal2, 10);
                    if(isOk && (!(!isNaN(num2) && num2 >= 0 && num2 <= 65535))){
                        $("#hideInp2").val(hideVal);
                        hideVal2 = hideVal
                    }
                }else if(hideType=="daddr"){
                    const pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    if(!pattern.test(hideVal))isOk = false;
                }else if(hideType=="wan"){
                    if(!((hideVal.indexOf('wan')!=-1)||(hideVal.indexOf('LAN')!=-1)||(hideVal.indexOf('l2tp')!=-1)||(hideVal.indexOf('pptp')!=-1)))isOk = false;
                }else if(hideType=="status"){
                    if(hideVal=="未响应"){
                        hideVal = 1
                    }else if(hideVal=="稳定"){
                        hideVal = 2
                    }else{
                        isOk = false
                    }
                }else if(hideType=="appstat"){
                    console.log(isOk,hideType,hideVal)
                }
                console.log({[hideType]:[hideVal,hideVal2],isHide:$("#isHide").val()})
                if(isOk&&hideVal){
                    //message('success', 'OK！')
                    let filterVal = []
                    filterVal[0]=hideVal
                    if(hideType=='sport' || hideType=='dport'){
                        filterVal[1]=hideVal2
                    }else{
                        filterVal[1]= false
                    }
                    sessionStorage.setItem('hideEntry',JSON.stringify({[hideType]:filterVal,isHide:$("#isHide").val()}))
                    getIpList()//发起请求
                }else{
                    console.log(isOk,hideType,hideVal)
                    message('warning', '类型与值不匹配！')
                }


                //console.log(isOk,hideType,hideVal)
            }

            // 请求获取ip详情列表
            function getIpList(i){
                let ip = i||$("#ipInp")[0].value
                $("#currentIP").text(ip)
                localStorage.setItem("ipVal",ip)
                //判断输入IP是否正确
                if (ipaddress.test(ip)) {
                    message('', '加载中...')
                    $("#ipInp")[0].value=ip
                    let data = JSON.stringify({ ip, wan: $(".sel_line option:selected").attr("data") })
                    //请求数据
                    $.get('/action/show_connect.htm?false', { data }, function (msg) {
                        //console.log(msg)
                        if (msg.length > 0) {
                            if(Array.isArray(msg[0])){
                                message('','有子数组');
                            }else{
                                let UnresponsiveNum = 0
                                ipListData = msg;
                                $("#conn_num").text(msg.length)
                                msg.forEach(item=>{
                                    if(item.status==1){
                                        UnresponsiveNum++;
                                    }
                                })
                                $("#Unresponsive").text(UnresponsiveNum)
                                addIpList()
                            }
                            $("#mask").css("display","block")

                        } else {
                            //没有查到数据
                            message('warning',"该IP无数据！")
                        }
                    }, "JSON")
                } else {
                    message('error',"IP有误！")
                }
            }

            // 添加ip详情列表数据
            function addIpList(){
                //console.log(sort.state,sort.type);
                $("#listTableWrapper>li:gt(0)").remove()
                let sortData=JSON.parse(JSON.stringify(ipListData));
                let hideEntry = sessionStorage.getItem('hideEntry')?JSON.parse(sessionStorage.getItem('hideEntry')):''
                let hideEntryKey = '';
                if(Object.prototype.toString.call(hideEntry) === '[object Object]'){
                    hideEntryKey = Object.keys(hideEntry)[0];
                }else{
                }
                switch(sort.state){
                    case 1:sortData.sort(function(a,b){return a[sort.type]-b[sort.type]});break;
                    case 2:sortData.sort(function(a,b){return b[sort.type]-a[sort.type]});break;
                }


                let html = ''
                sortData=sort.state==0?ipListData:sortData
                sortData.forEach(function(item,index){
                    if(hideEntryKey){
                        if(hideEntry.isHide==1){
                            if((hideEntryKey == 'sport') || (hideEntryKey == 'dport')){
                                if(item[hideEntryKey]*1>=hideEntry[hideEntryKey][0]*1&&item[hideEntryKey]*1<=hideEntry[hideEntryKey][1]*1)return;
                            }else{
                                if(item[hideEntryKey]==hideEntry[hideEntryKey][0])return;
                            }
                        }else{
                            if((hideEntryKey == 'sport') || (hideEntryKey == 'dport')){
                                if(item[hideEntryKey]*1<hideEntry[hideEntryKey][0]*1||item[hideEntryKey]*1>hideEntry[hideEntryKey][1]*1)return;
                            }else{
                                if(item[hideEntryKey]!=hideEntry[hideEntryKey][0])return;
                            }

                        }
                    }
                    html +=`
                                 <li style="${item.status==1?'background-color:#fff2e8':''}">
                                     <ul>
                                         <li>${item.appstat}</li>
                                         <li>${(function(){
                        switch(item.pri){
                            case "1":return "最高";
                            case "2":return "高";
                            case "3":return "中";
                            case "4":return "低";
                            case "5":return "最低";
                        }
                    })()}</li>
                                         <li>${formatFileSize(item.up)}</li>
                                         <li>${formatFileSize(item.down)}</li>
                                         <li>${item.proto}</li>
                                         <li>${item.sport}</li>
                                         <li>${item.dport}</li>
                                         <li>${item.daddr}</li>
                                         <li>${item.wan}</li>
                                         <li>${item.status==1?"未响应":"稳定"}</li>
                                     </ul>
                                 </li>`

                                })

                if(html=='')html=`<li><div style="height:220px;display: flex;justify-content: center;align-items: center;color:#bfbfbf;flex-direction: column;">
                                              <div style="font-size:30px;">☁</div><div>暂无数据</div>
                                          </div>
                                      </li>`
                $("#listTableWrapper").append(html)
                message('success', '刷新成功！')
                ipListTableCss()
            }




            $(document).ready(function() {
                //返回顶部按钮
                // 绑定到某个元素（如按钮）的点击事件上
                $('#back-to-top').click(function() {
                    // 使用animate()方法来平滑地滚动到页面顶部
                    $('body, html').animate({
                        scrollTop: 0
                    }, 500); // 500是动画的持续时间，以毫秒为单位
                    return false; // 阻止链接的默认行为（如果有的话）
                });

                //手动刷新
                //$(".auto-flush").val(0)

                //初始隐藏组件
                let hideEntryInp = sessionStorage.getItem('hideEntry')?JSON.parse(sessionStorage.getItem('hideEntry')):'';
                if(Object.prototype.toString.call(hideEntryInp) === '[object Object]'){
                    const keys = Object.keys(hideEntryInp);
                    const values = Object.values(hideEntryInp);
                    $("#hideType").val(keys[0])
                    $('#hideInp').val(values[0][0]);
                    if(values[0][1]!=false)$('#hideInp2').val(values[0][1]);
                    $('#isHide').val(hideEntryInp.isHide);
                }else{
                    $('#hideInp').val('');
                    $('#hideInp2').val('');
                    $('#isHide').val(1);

                }
                //判断筛选类型是否为源端口与目的端口
                let selectedValue = $('#hideType').val();
                if((selectedValue == 'sport') || (selectedValue == 'dport')){
                    $('#endInp').css("display","inline")
                }else{
                    $('#endInp').css("display","none")
                }

                $("#mask").attr('tabindex', '0').focus()
                //添加键盘事件
                $("#mask").keydown(function(event) {
                    //console.log(event.keyCode)
                    // 检查是否按下了空格键
                    if ((event.key === ' ' || event.keyCode === 32)&&timerReload) {
                        message('', '已停止！')
                        //停止自动刷新
                        $("#StartStopBtn").text('开始')
                        clearInterval(timerReload)
                        isStart=false
                        // 阻止事件的默认行为
                        event.preventDefault();
                        return false; // 在jQuery中，返回false也会阻止事件冒泡
                    }else if(event.keyCode ===82){//R键
                        //立即刷新
                        $("#reloadBtn").click()
                    }else if(event.keyCode ===84){
                        //回到顶部
                        $('#back-to-top').click()
                    }else if(event.keyCode ===27){
                        $('#colseBtn').click()
                    }
                });
            });

            //遮罩层关闭按钮
            $("#colseBtn").click(function(){
                $("#mask").css("display","none")
                $('#hideInp').val('');
                clearInterval(timerReload)
                isStart=false
                $("#refreshTimeInp").val('')
                $("#StartStopBtn").text('开始')
            })




            let currentIP = ''
            let currentIPData = []
            const ip_btn_css = `border-radius:4px;border:none;cursor:pointer;padding:3px 10px;white-space:nowrap;transition: 0.2s linear;color:#26a3e9;border:1px solid #26a3e9;background-color:#fff;`
            const bound_domain_li_css = `display:flex;width:100%;justify-content:space-between;align-items:center;padding:5px 20px;box-sizing:border-box;color:`
            $('#listModal').append(`<div id="appid_info_wrapper" style="width:380px;height:305px;position: absolute;top:110px;left:50%;transform: translateX(-50%);border-radius: 10px;background-color: #fff;box-shadow: 1px 1px 10px #2f2f2f;overflow: hidden;display:none;">
                                        <div style="line-height:45px;padding-left:18px;border-bottom:1px solid #a5a5a5;display:flex;align-items:center;background-color:#efefef;">
                                            编号：<span id="id_info"></span>
                                        </div>
                                        <div style="width:100%;height:210px;box-sizing:border-box;padding:20px;position:relative;">
                                            <div>名称：<input id="appid_name" style="width:276px;margin:0 5px;padding:5px;border:1px solid #fff;outline:1px solid #fff;border-radius:5px;transition:all 0.2s linear;font-size:16px;" placeholder="暂无"/></div>
                                            <div style="width:100%;display:flex;justify-content:end;margin-top:20px;padding-right:4px;box-sizing:border-box;"><button style="border-radius:4px;cursor:pointer;padding:3px 20px;white-space:nowrap;transition: 0.2s linear;color:#26a3e9;border:1px solid #26a3e9;background-color:#fff;"  id="save_appid_name">保存</button></div>
                                            <div class="appid_name_mask" style="position:absolute;top:18px;left:66px;width:285px;height:36px;line-height:40px;background:#fff;">查询中...</div>
                                        </div>

                                        <div style="width:100%;box-sizing:border-box;height:45px;padding:0 10px;border-top: 1px solid #dadada;margin-top:5px;background-color: #efefef;display: flex;align-items:center;justify-content:space-between;">
                                            <span id="id_update_time"></span><button style="border-radius:4px;border:none;cursor:pointer;padding:3px 20px;white-space:nowrap;" class="ip_info_close_btn B_bg" onclick="(()=>{$('#appid_info_wrapper').hide()})()">关闭</button>
                                        </div>
                                    </div>

                                    <div id="ip_domain_info_wrapper" style="width:600px;height:600px;position: absolute;top:-20px;left:50%;transform: translateX(-50%);border-radius: 10px;background-color: #fff;box-shadow: 1px 1px 10px #2f2f2f;overflow: hidden;display:none;">
                                        <div style="width:100%;height:550px;">
                                            <div style="width:100%;line-height:45px;padding-left:18px;border-bottom:1px solid #a5a5a5;display:flex;align-items:center;background-color:#efefef;">
                                                <div style="width:405px;display:flex;">IP：<span id="ip_info_ip"style="font-weight:bold;display:inline-block;width:130px;" title="点击复制"></span><span id="ip_info_isp"></span></div>
                                                   <button style="margin-right:15px;${ip_btn_css}" class="query_ip_btn">ip138</button><button style="${ip_btn_css}" class="B_bg query_ip_btn">ipchaxun</button></div>
                                            <ul style="width:100%;box-sizing:border-box;height:45px;padding:0 20px;display:flex;align-items:center;" id="custom_name_wrapper">
                                                <li style="width:100%;display:flex;justify-content:space-between;align-items:center;">
                                                    <div style="display:flex;align-items:center;">自定义：<input id="curstom_name_val" style="width:310px;margin:0 10px;padding:5px;color:#4bae4f;border:1px solid #fff;outline:1px solid #fff;border-radius:5px;transition:all 0.2s linear;"/>
                                                        <div id="curstom_name_update"></div></div><div>
                                                            <button style="border-radius:4px;cursor:pointer;padding:3px 20px;white-space:nowrap;transition: 0.2s linear;color:#26a3e9;border:1px solid #26a3e9;background-color:#fff;"  id="save_custom_name">保存</button></div></li>
                                            </ul>
                                            <div style="padding:0 20px;line-height:24px;margin:10px 0;display:flex;justify-content:space-between;"><span>绑定过的域名如下：</span></div>
                                            <ul style="height:390px;overflow: auto;padding-bottom:20px;" id="bound_domain_wrapper"></ul>
                                            </div>
                                        <div style="width:100%;box-sizing:border-box;height:45px;padding:0 10px;border-top: 1px solid #dadada;margin-top:5px;background-color: #efefef;display: flex;align-items:center;justify-content:space-between;">
                                            <span id="ip_info_update"></span><button style="border-radius:4px;border:none;cursor:pointer;padding:3px 20px;white-space:nowrap;" class="ip_info_close_btn B_bg" onclick="(()=>{$('#ip_domain_info_wrapper').hide()})()">关闭</button>
                                        </div>
                                    </div>`)
            //hover
            $('#bound_domain_wrapper').on({mouseenter: function() {$(this).css("background-color","#fafafa")},
                                           mouseleave: function() { $(this).css("background-color","#fff")} }, '.hover_li');
            $('#appid_info_wrapper').on({mouseenter: function() {$(this).css({'color':'#fff',"background-color":"#39ade6"})},
                                         mouseleave: function() { $(this).css({'color':'#26a3e9',"background-color":"#fff"})} }, '#save_appid_name');
            $('#ip_domain_info_wrapper').on({mouseenter: function() {$(this).css({'color':'#fff',"background-color":"#39ade6"})},
                                             mouseleave: function() { $(this).css({'color':'#26a3e9',"background-color":"#fff"})} }, '.query_ip_btn,#save_custom_name');

            $('#curstom_name_val,#appid_name').focus(function(){
                $(this).css('border-color','#26a3e9')
            })
            $('#curstom_name_val,#appid_name').blur(function(){
                $(this).css('border-color','#fff')
            })
            $('#curstom_name_val,#appid_name').hover(function(){
                $(this).css('outline','1px solid #26a3e9')
            },function(){
                $(this).css('outline','1px solid #fff')
            })
            $(document).on({mouseenter: function() { $(this).css({cursor:"pointer",color:"#26a3e9"});},
                            mouseleave: function() { $(this).css({color:"#505459"}) } }, '#ip_info_ip');
            $("#ip_info_ip").click(function () {
                let str = $('#ip_info_ip').text();
                if (str!== ""){
                    let $temp = $('<input>');
                    $('body').append($temp);
                    $temp.val(str).select();
                    document.execCommand('copy');
                    $temp.remove();
                    message('success', '已复制')
                }
            })
            $('.query_ip_btn').on('click',function(){
                //let ip = $(this).parent().find('#ip_info_ip').text()
                let website = ($(this).text().indexOf('ip138')!=-1)? 'site.ip138.com' : 'ipchaxun.com'
                let url = `https://${website}/${currentIP}/`
                website.indexOf('ip138')!=-1? window.open(url, '_blank') : window.open(url, '_blank')
            })
            $('#ip_domain_info_wrapper').on('click','.use_ip_domain',function(){
                $('#curstom_name_val').val($(this).attr('data-domain'))
            })
            $('#save_custom_name').on('click',function(){
                let curstom_name_val = $('#curstom_name_val').val();
                //console.log(currentIPData[0])
                if(curstom_name_val || currentIPData[0]&&currentIPData[0].bound_domain){
                    if (confirm("确定保存吗?")) {
                        let data = [{
                            ip:currentIP,
                            custom_name:curstom_name_val?[{domain:curstom_name_val,date:formatDate(new Date())}]:[],
                            ipshudi:currentIPData[0]?currentIPData[0].ipshudi:'',
                            default_key:curstom_name_val?'custom_name':'bound_domain',
                            website:currentIPData[0]?currentIPData[0].website:''
                        }]
                        $.post('https://moodtracks.cn:6789/_update_rdns',{data : JSON.stringify(data)},(res)=>{
                            if(res.status==200){
                                $('#ip_domain_info_wrapper').hide()
                                message('success','保存成功')
                            }else{
                                message('error','保存失败')
                            }
                            //console.log(data)
                            console.log(res)
                        },"json")
                    }
                }else{
                    message('warning','内容不能为空，需要先查询')
                }
            })


            //添加滑块开关
            $("div.pdg20-LR>div.box-tit").append(`<div style="margin-top:-21px;float:right;">
                   <input type="checkbox" class="input_hide" value="1" id="change_show_domain">
				   <label class="slider-v3" for="change_show_domain"></label>
				</div>`)

            // 滑块开关点击事件
            let change_show_domain = JSON.parse(localStorage.getItem('change_show_domain'))!=null?JSON.parse(localStorage.getItem('change_show_domain')):true;
            $("#change_show_domain")[0].checked = change_show_domain

            $("#change_show_domain").click(function(){
                if($("#change_show_domain")[0].checked){
                    change_show_domain = true
                    JSON.stringify(localStorage.setItem('change_show_domain',true))
                }else{
                    change_show_domain = false
                    JSON.stringify(localStorage.setItem('change_show_domain',false))
                }
            })




            let DNSptrData = []

            let timer;
            function handlerIPs(){
                clearTimeout(timer)
                if(change_show_domain){
                    //if(DNSptrData.length!=0){
                    timer = setTimeout(()=>{
                        let elementsType = $('.self-table.connect_table>tbody tr>td:nth-child(1)')
                        let filteredElementsType = elementsType.toArray().filter(function(item,index) {
                            let $item = $(item);
                            let cid = $item.text()
                            if(cid.indexOf('00') !=-1 && cid != '00000000'){
                                //console.log(cid)
                                $item.text('');
                                $item.append(`<span class="id_info" style="color:#505459;position: relative;cursor: pointer;">${cid}</span>`);
                            }
                        })
                        //console.log(elementsType)
                        let elementsIP = $('.self-table.connect_table>tbody tr>td:nth-child(8)')
                        let filteredElementsIP = elementsIP.toArray().filter(function(item,index) {
                            let $item = $(item);
                            let cip = $item.text()
                            if((cip.indexOf('d')==-1)&&isPublicIPv4(cip)){
                                $item.text('');
                                for(let i=0;i<DNSptrData.length;i++){
                                    if(cip==DNSptrData[i].ip){
                                        let custom_name = DNSptrData[i].custom_name.length?JSON.parse(DNSptrData[i].custom_name):[]
                                        let bound_domain = DNSptrData[i].bound_domain?JSON.parse(DNSptrData[i].bound_domain):[]
                                        let cName = JSON.parse(DNSptrData[i][DNSptrData[i]['default_key']])
                                        let str = ''
                                        $item.text('')
                                        if(cName[0]){
                                            str = cName[0].domain
                                            $item.append(`<span class="ip_info" data-ip="${cip}" style="color:#505459;display:inline-block;max-width:150px;position: relative;cursor: pointer;" title="${cip} ：${str}">${str.length>17?'..'+str.slice(-16):str}${IPStatusHTML(custom_name.length>0,bound_domain.length>0)}</span>`);
                                        }else{
                                            $item.append(`<span class="ip_info" data-ip="${cip}" style="color:#505459;position: relative;cursor: pointer;">${cip}${IPStatusHTML(custom_name.length>0,bound_domain.length>0)}</span>`);
                                        }
                                        //console.log(str,cName)
                                        return true;
                                    }
                                }
                                $item.append(`<span class="ip_info" data-ip="${cip}" style="color:#505459;position: relative;cursor: pointer;">${cip}</span>`);
                            }
                        });
                        let $filteredElementsIP = $(filteredElementsIP);

                        //console.log(filteredElementsIP[0])
                        //console.log($filteredElementsIP)

                        $('.id_info,.ip_info').hover(function(){$(this).css("text-decoration","underline")},function(){$(this).css("text-decoration","none")})
                    },500)
                }
            }

            function IPStatusHTML(a=false,b=false){
                let ulCSS = `position: absolute;top:0;bottom:0;right:-30px;width:25px;height:20px;display: flex;justify-content: center;align-items: center;`
                let liCSS = `width:5px;height:5px;border:1px solid #999;border-radius: 50%;margin-right:2px;`
                let AcheckedCSS = `background: #4bae4f;border-color:#4bae4f;`
                let BcheckedCSS = `background: #999;`
                let html = `<ul style="${ulCSS}"><li style="${liCSS}${a?AcheckedCSS:''}"></li><li style="${liCSS}${b?BcheckedCSS:''}"></li></ul>`
                return html
            }

            //获取域名反查
            function getDNSptr(data){
                let IPs = data.map(item=>item.daddr).filter(item=>item.dport!='53')
                let tempIPs = IPs.filter(item=>(isPublicIPv4(item))&&item.indexOf('d')==-1)
                let newIPs = [...new Set(tempIPs)];

                if(newIPs.length>500)newIPs.length=500

                if(change_show_domain)$.post('https://www.moodtracks.cn:6789/get_rdns',{data : JSON.stringify(newIPs)},(res)=>{
                    if(res.status==200){
                        let data = res.data
                        //console.log(data)
                        DNSptrData = data
                        handlerIPs()
                    }
                },"json")
            }

            //CSS
            const ip_info_css=`position: absolute;bottom:0;left:0;border:1px solid red;width:100px;height:50px;`

            // 点击查看连接类型
            $('#listModal').on('click','.id_info',function(){
                let cid = $(this).text()
                $("#id_info").text(cid)
                $("#id_update_time").text('')
                $("#appid_name").val('')
                $("#save_appid_name").prop("disabled",true)
                $(".appid_name_mask").show()

                $.post('https://www.moodtracks.cn:8888/get_name',{data : JSON.stringify([cid])},(res)=>{
                    if(res.status==200){
                        let data = res.data
                        //console.log(data)
                        if(data.length && data.length > 0){
                            data.forEach(item=>{
                                if(item.id == cid){
                                    $("#appid_name").val(item.current_name)
                                    $("#id_update_time").text("更新时间："+item.update_time)
                                }
                            })
                        }
                        $(".appid_name_mask").hide()
                        $("#save_appid_name").prop("disabled",false)
                    }else{
                        message("warning","请求失败2")
                        console.log("https://www.moodtracks.cn:8888/get_name请求失败")
                    }
                },"json")
                $("#appid_info_wrapper").show()
                $('#ip_domain_info_wrapper').hide()
            })

            $('#listModal').on('click','#save_appid_name',function(){
                //console.log($("#id_info").text(),$("#appid_name").val())

                if (confirm("确定保存吗?")) {
                    $.post('https://www.moodtracks.cn:8888/_update_name',{data : JSON.stringify([{
                        id:$("#id_info").text(),
                        current_name:$("#appid_name").val()
                    }])},(res)=>{
                        if(res.status==200){
                            message("success","保存成功")
                            $("#appid_info_wrapper").hide()
                        }else{
                            message("warning","保存失败2")
                            console.log("https://www.moodtracks.cn:8888/_update_name保存失败2")
                        }
                    },"json")
                }

            })

            $('#listModal').on('click','.ip_info',function(){
                currentIP = $(this).attr('data-ip')
                currentIPData = DNSptrData.filter(item=>item.ip == currentIP)

                $('#ip_info_ip').text(currentIP)
                let html = ''
                if(currentIPData.length>0){
                    $('#ip_info_isp').text(currentIPData[0].ipshudi)

                    let bound_domain_data = currentIPData[0].bound_domain?JSON.parse(currentIPData[0].bound_domain) : []
                    let custom_name_data = currentIPData[0].custom_name?JSON.parse(currentIPData[0].custom_name) : []

                    if(bound_domain_data.length>0){
                        bound_domain_data.forEach(item=>{
                            html += `<li style="${bound_domain_li_css}" class="hover_li"> <div style="display:flex;align-items: center;">
                                      <div style="width:300px;;overflow:auto;margin-right:5px;color:#4bae4f;">${item.domain}</div><div>${item.date}</div></div>
                                       <div><button data-domain="${item.domain}" style="border-radius:4px;border:none;cursor:pointer;padding:3px 8px;white-space:nowrap;" class="use_ip_domain B_bg">使用</button></div> </li>`
                        })
                    }else{
                        html = `<li><div style="height:220px;display: flex;justify-content: center;align-items: center;color:#bfbfbf;flex-direction: column;">
                                                     <div style="font-size:30px;">☁</div><div>暂无数据</div></div> </li>`
                    }

                    if(custom_name_data.length>0){
                        $('#curstom_name_val').val(custom_name_data[0].domain)
                        $('#curstom_name_update').text(custom_name_data[0].date)
                    }else{
                        $('#curstom_name_val').val('')
                        $('#curstom_name_update').text('')
                    }


                    $('#ip_info_update').text('更新时间：'+currentIPData[0].update_time)
                }else{
                    $('#ip_info_isp').text('')
                    html = `<li><div style="height:220px;display: flex;justify-content: center;align-items: center;color:#bfbfbf;flex-direction: column;">
                                                     <div style="font-size:30px;">☁</div><div>暂无数据</div></div> </li>`
                    $('#curstom_name_val').val('')
                    $('#curstom_name_update').text('')
                    $('#ip_info_update').text('')
                }
                $('#bound_domain_wrapper').html(html)

                $('#ip_domain_info_wrapper').show()
                //console.log(currentIP,currentIPData)
            })


            // 点击连接数查看详情
            {
                //setInterval(()=>{ $("#tblMain>tr>.conntrack").off('click'); },100)
                setTimeout(()=>{ $(document).on("click","#tblMain>tr>td.txt",function(){ ipDetail(0,$(this).parent().find('.ip').attr("data")) }) })
                if(0)$(document).on({mouseenter: function() { $(this).css({cursor:"pointer",color:"#26a3e9"});},
                                     mouseleave: function() { $(this).css({color:"#505459"}) } }, '#tblMain>tr>td:first-child');

                //CSS
                $(document).on({mouseenter: function() { $(this).css({cursor:"pointer",color:"#26a3e9"});},
                                mouseleave: function() { $(this).css({color:"#505459"}) } }, '#tblMain>tr>td.txt');
                $(document).on({mouseenter: function() { $(this).css({cursor:"pointer",color:"#26a3e9"});},
                                mouseleave: function() { $(this).css({color:"#505459"}) } }, '.connect_table>.tbody>tr');
                let currentBgc = ''
                $('#listModal').on({mouseenter: function() { currentBgc = $(this).css("background-color");if(change_show_domain)$(this).css("background-color","#b6e0f7")},
                                    mouseleave: function() { if(change_show_domain)$(this).css("background-color",currentBgc) } }, '.self-table.connect_table>tbody tr');


                //排序点击事件
                $('.do_sort_connect').on('click', function() {
                    //console.log('排序点击事件')
                    handlerIPs()
                });
                //上下页点击事件
                $(".page-box:eq(1) .jump-page.next,.page-box:eq(1) .jump-page.prev").click(()=>{
                    //console.log('分页点击事件')
                    handlerIPs()
                })
                //跳转按钮点击事件
                $(".jump_btn_connect").on('click', function() {
                    //console.log('跳转按钮点击事件')
                    handlerIPs()
                });

                //连接列表关闭按钮
                $(".sure").on('click', function() {
                    //console.log('连接列表关闭按钮事件')
                    $('#ip_domain_info_wrapper,#appid_info_wrapper').hide()
                });

                //内网主机列表点击事件
                $("#tblMain").on('click', function() {
                    //console.log('内网主机列表点击事件')
                    $('#ip_domain_info_wrapper,#appid_info_wrapper').hide()
                });

                // 请求过滤器
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    if(options.url.indexOf('/show_connect.htm')!=-1){
                        //console.log(options)
                        //console.log(options.data)
                        try{
                            show_connectData = JSON.parse(decodeURIComponent(options.data.split('=')[1]))
                        }catch(e){
                            console.log('请求过滤器出错：/show_connect.htm',e)
                            show_connectData = {ip: '', wan: 'all'}
                        }
                        // 保存原始的success回调函数
                        let originalSuccess = options.success;

                        // 修改options.success来添加自定义的回调
                        options.success = function(data, status, jqXHR) {
                            //console.log(data)
                            // 在这里修改响应数据
                            //let modifiedData = data;

                            // 调用原始的success回调函数，传入修改后的数据
                            if (originalSuccess) {
                                originalSuccess(data, status, jqXHR);
                            }
                            //console.log(data)
                            if(options.url.indexOf('false')==-1) getDNSptr(data)
                        };
                    }
                })
            }


        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






        // 流控设置
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


        if(0&&$(".sidebar_nav>li").eq(3).find("span").text()=="流控设置")$(".sidebar_nav>li").eq(3).click(()=>{
            location.href = "/index.htm?PAGE=fluid&new=1"
        })

        if (location.search.indexOf("?PAGE=fluid&new=1") !== -1) {
            $(".sidebar_nav>li:nth(3) a:nth(0)").css("color","#484848")
            $(".sidebar_nav>li:nth(3) a:nth(0)").hover(function(){$(this).css("color","#1592d8")},function(){$(this).css("color","#484848")})
            $(".back_center>div.box").html(`
                <div id="intelligent_flow_control" style="width:100%;height:600px;padding:0 20px;">
                    <div class="border-b box-tit"><h4>智能流控</h4></div>
                </div>`)
            $("#intelligent_flow_control")
        }

        // 流量识别
        if (isFlowIdentifi && location.search=="?PAGE=flow_identifi"){
            //添加滑块开关
            $("div.pdg20-LR>div.box-tit").append(`<div style="margin-top:-21px;float:right;">
                   <input type="checkbox" name="able" class="input_hide able" value="1" id="changeFlowIde">
				   <label class="slider-v3" for="changeFlowIde"></label>
				</div>`)
            $("body>div.right").css("overflow","visible")
            $("div.pdg20-LR").css("position","relative")
            $("div.pdg20-LR>div.box-tit>a")?.remove()

            $("div.seitchH-radio").after(`
                <div id="all_identifi" style="width:calc(100% + 2px);position:absolute;background:#fff;left:-1px;top:51px;padding:0 20px;box-sizing:border-box;border:1px solid #cdcdcd;border-top:none;">
                    <div class="H20"/>
                    <ul class="all_identifi" style="display:flex;padding-left:20px;">
                        <li><span>特征库识别：</span><div><input type="checkbox" name="property_able" class="input_hide property_able able" value="1" id="s10">
						        <label class="slider-v3" for="s10"></label></div></li>
                        <li><span>智能识别：</span><div><input type="checkbox" name="property_able" class="input_hide property_able able" value="1" id="s20">
						        <label class="slider-v3" for="s20"></label></div></li>
                        <li><span>智能云识别：</span><div><input type="checkbox" name="property_able" class="input_hide property_able able" value="1" id="s30">
						        <label class="slider-v3" for="s30"></label></div></li>
                        <li><span>客户端识别：</span><div><input type="checkbox" name="property_able" class="input_hide property_able able" value="1" id="s40">
						        <label class="slider-v3" for="s40"></label></div></li>
                    </ul>
                    <div class="H20"/><div class="H20"/>
                    <div class="save_identifi_btn" style="transition: all 0.2s linear 0s;color:#fff;display: inline-block;padding: 3px 15px;border: 1px solid #26a3e9;font-size: 12px;border-radius: 5px;
                         user-select: none;background-color:#26a3e9;margin:0 20px;cursor: pointer;">保存设置</div>
                     <div class="open_identifi_btn" style="transition: all 0.2s linear 0s;color:#666;display: inline-block;cursor: pointer;padding: 3px 15px;border: 1px solid #f0f0f0;font-size: 12px;border-radius: 5px;
                         user-select: none;background-color:#fff;">一键开启</div>
                    <div class="H20"/><div class="H20"/><div class="H20"/><div class="H20"/>
                    <div style="padding-bottom:10px;border-bottom:1px solid #e6e6e6;"><h4 style="margin:0;">自定义识别</h4></div>
                    <div class="H20"/><div style="display:flex;margin-bottom:10px;justify-content:end;">
                        <div class="delAll_identifi_btn" style="transition: all 0.2s linear 0s;color:#ff4d4f;display: inline-block;padding: 3px 15px;border: 1px solid #fff;font-size: 12px;border-radius: 5px;
                         user-select: none;background-color:#fff2f0;cursor: pointer;">删除全部</div>
                        <div class="add_identifi_btn" style="transition: all 0.2s linear 0s;color:#fff;display: inline-block;padding: 3px 15px;border: 1px solid #26a3e9;font-size: 12px;border-radius: 5px;
                         user-select: none;background-color:#26a3e9;margin:0 15px;cursor: pointer;">添加</div>
                         </div>
                    <div id="customize_identifi" style="width:100%;"></div>
                    <div class="H20"/><div class="H20"/>
                </div>
            `)

            // CSS
            {
                $("ul.all_identifi>li").css({
                    display:"flex",
                    justifyContent:"space-between",
                    width:"170px",
                    marginRight:"70px",
                })

                //hover
                $(".save_identifi_btn,.add_identifi_btn").hover(function () { $(this).css({backgroundColor:"#39ade6"}) }, function () { $(this).css({backgroundColor:"#26a3e9"}) });
                $(".delAll_identifi_btn").hover(function () { $(this).css({color:"#ff7875"}) }, function () { $(this).css({color:"#ff4d4f"}) });
                $(".open_identifi_btn").hover(function () { $(this).css({backgroundColor:"#f0f0f0"}) }, function () { $(this).css({backgroundColor:"#fff"}) });
                $(document).on({mouseenter: function() { $(this).css({color:"#79baff"}) },
                                mouseleave: function() { $(this).css({color:"#26a3e9"}) } }, '.edit_customize_identifi');
                $(document).on({mouseenter: function() { $(this).css({color:"#ff7875"}) },
                                mouseleave: function() { $(this).css({color:"#ff4d4f"}) } }, '.del_customize_identifi');
            }

            // 初始化识别状态
            initIdentifiState()

            // 滑块开关点击事件
            let changeFlowIde = JSON.parse(localStorage.getItem('changeFlowIde'))!=null?JSON.parse(localStorage.getItem('changeFlowIde')):true;
            $("#changeFlowIde")[0].checked = changeFlowIde
            $("#all_identifi").css("z-index",changeFlowIde?"1":"-1")
            $("#all_identifi").css("opacity",changeFlowIde?"1":"0")
            changeFlowIde?$("ul.fluid>li:last-child").css("display","block"):''
            $("#changeFlowIde").click(function(){
                if($("#changeFlowIde")[0].checked){
                    $("ul.fluid>li:last-child").css("display","block")
                    initIdentifiState()
                    JSON.stringify(localStorage.setItem('changeFlowIde',true))
                    $("#all_identifi").css("z-index","1")
                    $("#all_identifi").css("opacity","1")
                }else{
                    if($('div.menu>label input[type="radio"]:checked').val()!=='自定义识别')$("ul.fluid>li:last-child").css("display","none");
                    JSON.stringify(localStorage.setItem('changeFlowIde',false))
                    $("#all_identifi").css("z-index","-1")
                    $("#all_identifi").css("opacity","0")
                }
            })

            $(".save_identifi_btn").click(()=>{
                let saveState = 0
                let failRecord = ''
                $.get('/action/code_ident2.htm',{data:JSON.stringify({able:$("#s10").prop('checked')?'1':'0',var:$(".property_cont .var_tip").text(),})},(msg)=>{
                    if (msg.state == 1) { saveState++ }else{ failRecord += '（特征库识别）'; }
                    $.get('/action/auto_ident2.htm',{data:JSON.stringify({able:$("#s20").prop('checked')?'1':'0'})},(msg)=>{
                        if (msg.state == 1) { saveState++ }else{ failRecord += '（流量智能识别）'; }
                        $.get('/action/cloud_ident2.htm',{data:JSON.stringify({able:$("#s30").prop('checked')?'1':'0'})},(msg)=>{
                            if (msg.state == 1) { saveState++ }else{ failRecord += '（智能云识别）'; }
                            $.get('/action/client_ident_write.htm',{data:JSON.stringify({able:$("#s40").prop('checked')?'1':'0'})},(msg)=>{
                                if (msg.state == 1) { saveState++ }else{ failRecord += '（客户端识别）'; }
                                if(saveState==4) {
                                    message('success','保存成功...',true,2000)
                                    setTimeout(()=>{ location.reload() },1000)
                                }
                            }, 'json');
                        }, 'json');
                    }, 'json');
                }, 'json');
                setTimeout(()=>{ if(saveState!==4) {message('warning',failRecord+'保存失败！')} },5000)
            })
            $(".open_identifi_btn").click(()=>{ $("#s10,#s20,#s30,#s40").prop('checked', true) })
            $(".add_identifi_btn").click(()=>{
                //$('#add_edit_mask').css("display","flex")
                // 原版模态框
                showKeyFilterForm()
            })
            $(".delAll_identifi_btn").click(()=>{
                if(confirm("确认删除全部？")){
                    //删除全部
                    $.post('/action/protocol_diy_write.htm',{data : JSON.stringify([])},(msg)=>{ if (msg.state == 1){
                        message('success','删除成功...',true,2000);
                    } }, 'json');
                }
            })
            $(document).on('click','#customize_identifi span.edit_customize_identifi',(e)=>{
                //console.log($(e.currentTarget).attr('data'))
                //$('#add_edit_mask').css("display","flex")
                // 原版模态框
                editKeyFilter($(e.currentTarget).attr('data'))
                //console.log()
            })
            $(document).on('click','#customize_identifi span.del_customize_identifi',(e)=>{
                if(confirm("确认删除？")){
                    data["keyfilterpage"].splice($(e.currentTarget).attr('data'), 1)
                    $.post('/action/protocol_diy_write.htm',{data : JSON.stringify(data["keyfilterpage"])},(msg)=>{ if (msg.state == 1){
                        message('success','删除成功...',true,2000);
                    } }, 'json');
                }
            })

            // 初始化识别状态
            function initIdentifiState(){
                const columns = [
                    {
                        title: '状态',
                        dataIndex: 'able',
                        key: 'able',
                    },
                    {
                        title: '地址范围',
                        dataIndex: 'addrDomain',
                        key: 'addrDomain',
                    },
                    {
                        title: '协议',
                        dataIndex: 'proto',
                        key: 'proto',
                    },
                    {
                        title: '端口',
                        dataIndex: 'port',
                        key: 'port',
                    },
                    {
                        title: '匹配策略',
                        dataIndex: 'martch',
                        key: 'martch',
                    },
                    {
                        title: '关键信息',
                        dataIndex: 'keyInfo',
                        key: 'keyInfo',
                    },
                    {
                        title: '数据类型',
                        dataIndex: 'dataType',
                        key: 'dataType',
                    },
                    {
                        title: '备注',
                        dataIndex: 'note',
                        key: 'note',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                    },
                ]
                const dataSource = []
                $.get('/action/code_ident.htm',(msg)=>{ $("#s10").prop("checked",msg.able==1?true:false); },'json');
                $.get('/action/auto_ident.htm',(msg)=>{ $("#s20").prop("checked",msg.able==1?true:false); },'json');
                $.get('/action/cloud_ident.htm',(msg)=>{ $("#s30").prop("checked",msg.able==1?true:false); },'json');
                $.get('/action/client_ident_read.htm',(msg)=>{ $("#s40").prop("checked",msg.able==1?true:false); },'json');
                $.get('/action/protocol_diy_read.htm',(msg)=>{
                    if(msg.length&&msg.length>0){
                        msg.forEach((item,index)=>{
                            dataSource.push({
                                key:index,
                                able: item.able=='1'?`启用`:"禁用",
                                addrDomain: item.sip+'-'+item.eip,
                                proto: item.proto,
                                port: item.sport+'-'+item.eport,
                                martch: martchConvert(item.martch),
                                keyInfo: item.key.length?(item.key[0]?(item.key.length>1?(item.key[0]+' ...'):item.key[0]):'无'):'-',
                                dataType: dataTypeConvert(item.action),
                                note: item.note,
                                action: `<span class="edit_customize_identifi" data="${index}" style="margin-right:15px;color:#26a3e9;cursor:pointer;user-select:none;transition:all .2s linear;" title="点击编辑">编辑</span>
                                         <span class="del_customize_identifi" data="${index}" style="color:#ff4d4f;cursor:pointer;user-select:none;transition:all .2s linear;" title="点击删除">删除</span>`,
                            })
                        })
                    }
                    table("#customize_identifi", dataSource, columns,false,{isSort:false,height:"40px"})
                },'json');
                function martchConvert(a){
                    if(a=='bin'){return '特征码'}else if(a=='long'){return '特征码长度'}else if(a=='ip'){return 'IP'}else if(a=='none'){return '无'}else{return '-'}
                }
                function dataTypeConvert(a){
                    if(a=='game'){return '游戏'}else if(a=='down'){return '网页下载'}else if(a=='http'){return '网页资源'}else if(a=='p2p'){return 'p2p下载'}else{return '-'}
                }
            }

        }

        // 优先级设置
        if (location.search == "?PAGE=soft_pro") {
            // 一键默认按钮
            if(isSoftPro){

                $("div.div-tab.fl.fc").append(`
            <a class="fl soft_pro_default" style="
                text-decoration: none;
                transition: all .2s linear;
                color:#666;
                display:inline-block;
                padding:3px 15px;
                border:1px solid #f0f0f0;
                font-size:12px;
                border-radius: 5px;
                user-select: none;" href="###">一键默认
                <div class="bottom_line" style="transition: all .2s linear;margin-left:24px;width:0px;height:1px;background-color:#26a3e9;"></div>
                </a>`)

                //hover
                $(".soft_pro_default").hover(function () {
                    $(this).css({backgroundColor:"#f0f0f0"})
                    //$(".bottom_line").css({width: "48px",marginLeft:"0px"})
                }, function () {
                    $(this).css({backgroundColor:"#fff"})
                    //$(".bottom_line").css({width: "0px",marginLeft:"24px"})
                });

                $(".soft_pro_default").click(()=>{
                    $(".game").val('0');
                    $(".pat").val('0');
                    $(".http").val('0');
                    $(".im").val('0');
                    $(".soft").val('0');
                    $(".down").val('0');
                    $(".vio").val('0');
                    $(".unknow").val('0');
                    $(".p2p").val('0');
                })

            }

            // 显示所有
            if(1){
                //添加滑块开关
                $("div.pdg20-LR>div.box-tit").append(`<div style="margin-top:-21px;float:right;">
                   <input type="checkbox" class="input_hide" value="1" id="change_soft_pro">
				   <label class="slider-v3" for="change_soft_pro"></label>
				</div>`)


                // 滑块开关点击事件
                let changeSoftPro = JSON.parse(localStorage.getItem('changeSoftPro'))!=null?JSON.parse(localStorage.getItem('changeSoftPro')):true;
                $("#change_soft_pro")[0].checked = changeSoftPro
                $(".pdg20-LR>ul.fluid>li:last-child").before(`
                      <li class="soft_pro_title" style="display:none;"><div style="padding-bottom:10px;border-bottom:1px solid #e6e6e6;margin-bottom:20px;"><h4 style="margin:0;">端口优先级</h4></div></li>`)
                $(".pdg20-LR>ul.fluid>li.smart_cont tr:last-child>td").css("padding-bottom","80px")
                if(changeSoftPro){
                    $(".soft_pro_title").css("display","block");
                    $(".pdg20-LR>ul.fluid>li").css("display","list-item")
                    $(".seitchH-radio+div.H20").css("display","none")
                    $(".seitchH-radio").css("display","none")
                }
                $("#change_soft_pro").click(function(){
                    if($("#change_soft_pro")[0].checked){
                        JSON.stringify(localStorage.setItem('changeSoftPro',true))
                        $(".seitchH-radio+div.H20").css("display","none")
                        $(".pdg20-LR>ul.fluid>li").css("display","list-item")
                        $(".soft_pro_title").css("display","block");
                        $(".seitchH-radio").css("display","none")
                    }else{
                        JSON.stringify(localStorage.setItem('changeSoftPro',false))
                        $(".seitchH-radio+div.H20").css("display","block");
                        $("ul.fluid>li:not(:first-child)").css("display","none");
                        $(".soft_pro_title").css("display","none");
                        $(".seitchH-radio").css("display","block")
                        if($('div.menu>label input[type="radio"]:checked').val()=='端口优先级'){
                            $('.radio:first-child').click()
                        }
                    }
                })
            }

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






        // 线路分流
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // 应用软件分流
        if (location.search.indexOf("?PAGE=software") !== -1) {
            // 拖拽调整优先级
            if(0)setTimeout(()=>{
                // hover
                let currentBgc = ''
                $(".li1, .li2, .li3").on({mouseenter: function() { currentBgc = $(this).css("background-color");if(true)$(this).css("background-color","#b6e0f7")},
                                          mouseleave: function() { if(true)$(this).css("background-color",currentBgc) } }, 'tbody:first tr');

                $(".li1, .li2, .li3").find("tbody:eq(0) tr td:last-child").each(function() {
                    // 使用 jQuery 的 filter 方法来选择索引大于或等于3的 img 元素
                    $(this).find("img").filter(index => index >= 3).remove(); // 直接移除选中的元素
                });
                $(".li1, .li2, .li3").find("tbody:eq(0) tr td:last-child").append(`
                    <div class="moveTr" style="width:22px;height:14px;padding:2px 0;box-sizing:border-box;position:absolute;top:50%;right:22px;transform:translateY(-50%);display:flex;align-items:center;border:2px solid #0073e1;border-left:none;border-right:none;cursor:move;">
                        <div style="width:100%;height:2px;background:#0073e1;"></div>
                    </div>`)

                $(".li1, .li2, .li3").find("tbody:eq(0) tr td:last-child").css("position","relative")


                const $draggables = $('.moveTr');
                let $draggedElement = null;
                let $draggedElementTop = null;
                let $table = null;
                let offsetY = 0; //鼠标相对于拖拽元素的垂直偏移量
                let $placeholder = $('<div class="placeholder" style="border: 2px dashed #000;"></div>').hide(); // 占位符元素

                $($draggables).on('mousedown', function (e) {
                    // 禁用文本选择
                    $('body').css('user-select', 'none');
                    // 添加占位符到DOM中
                    $('body').append($placeholder);

                    $draggedElement = $(this).parent().parent();
                    $draggedElementTop = $draggedElement.offset().top;
                    $table = $draggedElement.parent().parent();
                    offsetY = e.pageY - $draggedElement.offset().top;//当前元素tr高度

                    currentBgc = $draggedElement.css("background-color")
                    currentBgc = (currentBgc.indexOf('240')==-1)?'#fff':currentBgc

                    $draggedElement.css("background-color",currentBgc)
                    //$draggedElement.parent().css("position","relative")

                    let $hideEle = $('<tr class="currentEle" style="background-color:'+currentBgc+';box-shadow: rgb(47, 47, 47) 1px 1px 10px;position:relative;"></tr>').append($draggedElement.html())
                    $hideEle.find("td:first")//.append(`<div class="tbody_mask" style="position:absolute;bottom:0;left:0;width:${$draggedElement.width()}px;height:${$draggedElement.height()}px;background:#fff;z-index:-1;"></div>`)
                    $draggedElement.parent().append($hideEle)
                    $table.after(`<div class="tr_mask" style="width:${$draggedElement.width()+2}px;height:${$draggedElement.height()}px;background:#fff;margin-top:-${$draggedElement.height()}px;"></div>`)

                    //console.log(e.pageY,$draggedElement.offset().top,$(".currentEle").offset().top)
                    let oldTranslateY = -$(".currentEle").offset().top-offsetY

                    $draggedElement.css({"opacity":".3","border":"2px dashed #0073e1"})

                    $(".currentEle").css('transform','translateY('+ (oldTranslateY + e.pageY) + 'px)');
                    $(".tbody_mask").css("bottom",oldTranslateY + e.pageY)

                    // 开始拖拽时，监听全局的mousemove和mouseup事件
                    $(document).on('mousemove.drag', function (e) {
                        if ($draggedElement) {
                            //let newTranslateY = e.pageY-oldTranslateY
                            let newTranslateY = oldTranslateY + e.pageY
                            const newTop = e.pageY - offsetY;
                            //console.log(e.pageY , offsetY,newTop)
                            //console.log($draggedElement,newTranslateY)

                            $(".currentEle").css('transform','translateY('+ newTranslateY + 'px)');
                            $(".tbody_mask").css("bottom",newTranslateY)

                            // 检查是否与其他拖拽元素重叠，并插入占位符
                            $draggables.parent().parent().not($draggedElement).each(function () {
                                const $this = $(this);
                                const thisTop = $this.offset().top;
                                const thisHeight = $this.outerHeight();
                                $this.css("background-color",(($this.css("background-color").indexOf("240")!=-1)?$this.css("background-color"):"#fff"))

                                console.log($this.find(".note").text(),thisTop,thisHeight)

                                if(0)if(newTop>$draggedElementTop+$draggedElement.outerHeight()+(thisHeight/2)&&thisHeight/2!=0){
                                    console.log(newTop,$draggedElementTop,thisHeight/2)
                                    if(newTop-(thisHeight/2)<thisTop){
                                        console.log($this)
                                        $this.css('transform','translateY('+ ($draggedElement.outerHeight()-1) + 'px)');
                                        /*
                                    if(newTop<$draggedElementTop){
                                        if(newTop+$draggedElement.outerHeight()<$draggedElementTop){
                                            console.log(newTop,thisTop);
                                            $this.css('transform','translateY('- ($draggedElement.outerHeight()-1) + 'px)');
                                        }
                                        //$draggedElement.css('transform','translateY('+ (-$draggedElementTop+thisTop+1) + 'px)');
                                        //return false;
                                    }else{
                                        $this.css('transform','translateY('+ ($draggedElement.outerHeight()-1) + 'px)');
                                        console.log(newTop,$draggedElement.outerHeight(),(thisHeight/2),$draggedElementTop)
                                    }
                                    */
                                    }
                                }
                                if(0)if(newTop+thisHeight>thisTop){
                                    console.log(newTop,thisTop);
                                    $this.css('transform','translateY('+ (-$draggedElement.outerHeight()+1) + 'px)');
                                }

                            });




                        }
                    });

                    $(document).on('mouseup.drag', function (e) {
                        if ($draggedElement) {
                            //console.log(currentBgc)
                            $draggedElement.css({"backgroundColor":currentBgc,"border":"none",'transform':'translateY(0px)',"opacity":"1"})
                            $(".currentEle").css('transform','translateY(0px)');
                            $(".currentEle").remove()
                            $(".tr_mask").remove()
                            // 停止拖拽时，移除全局事件监听器
                            $(document).off('.drag');

                            // 启用文本选择
                            $('body').css('user-select', '');

                            // 隐藏占位符
                            $placeholder.hide();

                            // 重置拖拽元素变量
                            $draggedElement = null;
                        }
                    });

                    // 阻止默认行为和冒泡
                    e.preventDefault();
                    e.stopPropagation();
                });


                /*$("body").mouseup(function(event) {
                    if (event.which === 1) {
                    }
                });*/

                if(0)$(".li1, .li2, .li3").mouseleave(function(){
                    // 当鼠标离开元素时执行的代码
                    console.log("鼠标已离开元素！");
                    // 你可以在这里添加任何你想要的逻辑，比如停止拖拽
                    // 重新启用文本选择
                    $('body').css('user-select', '');
                });

            },1000)

        }

        if(0&&$(".sidebar_nav>li").eq(4).find("span").text()=="线路分流")$(".sidebar_nav>li").eq(4).click(()=>{
            location.href = "/index.htm?PAGE=software&new=1"
        })

        if (location.search.indexOf("?PAGE=software&new=1") !== -1) {
            $(".sidebar_nav>li:nth(4) a:nth(0)").css("color","#484848")
            $(".sidebar_nav>li:nth(4) a:nth(0)").hover(function(){$(this).css("color","#1592d8")},function(){$(this).css("color","#484848")})
            //$(".back_center>div.box").html(``)
        }

        // 协议分流
        if (location.search.indexOf("?PAGE=protocol") !== -1) {
            // 拖拽调整优先级
            if(0)setTimeout(()=>{
                // hover
                let currentBgc = ''
                $("li.PPPOE_div").on({mouseenter: function() { currentBgc = $(this).css("background-color");if(true)$(this).css("background-color","#b6e0f7")},
                                      mouseleave: function() { if(true)$(this).css("background-color",currentBgc) } }, 'tbody:first tr');

                $("li.PPPOE_div").find("tbody:eq(0) tr td:last-child").each(function() {
                    // 使用 jQuery 的 filter 方法来选择索引大于或等于3的 img 元素
                    $(this).find("img").filter(index => index >= 3).remove(); // 直接移除选中的元素
                });
                $("li.PPPOE_div").find("tbody:eq(0) tr td:last-child").append(`
                    <div class="moveTr" style="width:22px;height:14px;padding:2px 0;box-sizing:border-box;position:absolute;top:50%;right:22px;transform:translateY(-50%);display:flex;align-items:center;border:2px solid #0073e1;border-left:none;border-right:none;cursor:move;">
                        <div style="width:100%;height:2px;background:#0073e1;"></div>
                    </div>`)

                $("li.PPPOE_div").find("tbody:eq(0) tr td:last-child").css("position","relative")
                let num = 0
                $("li.PPPOE_div").find("tbody:eq(0) tr").each(function(index){
                    $(this).addClass('priority'+index)
                    $(this).attr('data-priority', index)
                    $(this).attr('data-index', index)
                    $(this).css('transition', 'all .3s linear')
                })


                const $draggables = $('.moveTr');
                let $draggedElement = null;
                let $draggedElementTop = null;
                let $table = null;
                let offsetY = 0; //鼠标相对于拖拽元素的垂直偏移量
                let $placeholder = $('<div class="placeholder" style="border: 2px dashed #000;"></div>').hide(); // 占位符元素
                let moveli = []; //优先级调整暂存
                let tempClass = '';

                $($draggables).on('mousedown', function (e) {
                    // 禁用文本选择
                    $('body').css('user-select', 'none');
                    // 添加占位符到DOM中
                    $('body').append($placeholder);

                    moveli = []
                    tempClass = ''
                    let test1 = 0

                    $draggedElement = $(this).parent().parent();
                    let currentClass = $draggedElement.attr('class');
                    $draggedElementTop = $draggedElement.offset().top;
                    $table = $draggedElement.parent().parent();
                    offsetY = e.pageY - $draggedElement.offset().top;//当前元素tr高度

                    currentBgc = $draggedElement.css("background-color")
                    currentBgc = (currentBgc.indexOf('240')==-1)?'#fff':currentBgc

                    $draggedElement.css("background-color",currentBgc)
                    //$draggedElement.parent().css("position","relative")

                    let $hideEle = $('<tr class="currentEle" style="background-color:'+currentBgc+';box-shadow: rgb(47, 47, 47) 1px 1px 10px;position:relative;"></tr>').append($draggedElement.html())
                    $hideEle.find("td:first")//.append(`<div class="tbody_mask" style="position:absolute;bottom:0;left:0;width:${$draggedElement.width()}px;height:${$draggedElement.height()}px;background:#fff;z-index:-1;"></div>`)
                    $draggedElement.parent().append($hideEle)
                    $table.after(`<div class="tr_mask" style="width:${$draggedElement.width()+2}px;height:${$draggedElement.height()}px;background:#fff;margin-top:-${$draggedElement.height()}px;"></div>`)

                    //console.log(e.pageY,$draggedElement.offset().top,$(".currentEle").offset().top)
                    let oldTranslateY = -$(".currentEle").offset().top-offsetY

                    $draggedElement.css({"opacity":".3","border":"1px dashed #0073e1"})

                    $(".currentEle").css('transform','translateY('+ (oldTranslateY + e.pageY) + 'px)');
                    $(".tbody_mask").css("bottom",oldTranslateY + e.pageY)

                    // 开始拖拽时，监听全局的mousemove和mouseup事件
                    $(document).on('mousemove.drag', function (e) {
                        if ($draggedElement) {
                            //let newTranslateY = e.pageY-oldTranslateY
                            let newTranslateY = oldTranslateY + e.pageY
                            const newTop = e.pageY - offsetY;
                            //console.log(e.pageY , offsetY,newTop)
                            //console.log($draggedElement,newTranslateY)

                            $(".currentEle").css('transform','translateY('+ newTranslateY + 'px)');
                            $(".tbody_mask").css("bottom",newTranslateY)

                            // 检查是否与其他拖拽元素重叠，并插入占位符
                            $draggables.parent().parent().not($draggedElement).each(function () {
                                const $this = $(this);
                                const thisTop = $this.offset().top;
                                const thisHeight = $this.outerHeight();
                                $this.css("background-color",(($this.css("background-color").indexOf("240")!=-1)?$this.css("background-color"):"#fff"))

                                //console.log($this.find(".note").text(),thisTop,thisHeight)
                                //console.log(e.pageY-offsetY) //当前拖动元素的top

                                // 拖动元素与其他元素重叠
                                if(thisTop - (thisHeight/2) < (e.pageY-offsetY) && (thisTop + (thisHeight/2) > (e.pageY-offsetY))){
                                    //console.log($this.find(".note").text(),thisTop,thisHeight,e.pageY)
                                    if(tempClass != $this.attr('class')){
                                        tempClass = $this.attr('class')
                                        console.log($draggedElement.attr('data-index'),$this.attr('data-index'),thisTop)

                                        let test2 = thisTop
                                        if(test1<test2)test1=test2
                                        handlerPri(currentClass,tempClass,$draggedElementTop > thisTop ? 1 : 0,$draggables.parent().parent(),$draggedElement,{test1,test2})
                                    }
                                }

                                if(0)if(newTop>$draggedElementTop+$draggedElement.outerHeight()+(thisHeight/2)&&thisHeight/2!=0){
                                    console.log(newTop,$draggedElementTop,thisHeight/2)
                                    if(newTop-(thisHeight/2)<thisTop){
                                        console.log($this)
                                        $this.css('transform','translateY('+ ($draggedElement.outerHeight()-1) + 'px)');
                                        /*
                                    if(newTop<$draggedElementTop){
                                        if(newTop+$draggedElement.outerHeight()<$draggedElementTop){
                                            console.log(newTop,thisTop);
                                            $this.css('transform','translateY('- ($draggedElement.outerHeight()-1) + 'px)');
                                        }
                                        //$draggedElement.css('transform','translateY('+ (-$draggedElementTop+thisTop+1) + 'px)');
                                        //return false;
                                    }else{
                                        $this.css('transform','translateY('+ ($draggedElement.outerHeight()-1) + 'px)');
                                        console.log(newTop,$draggedElement.outerHeight(),(thisHeight/2),$draggedElementTop)
                                    }
                                    */
                                    }
                                }
                                if(0)if(newTop+thisHeight>thisTop){
                                    console.log(newTop,thisTop);
                                    $this.css('transform','translateY('+ (-$draggedElement.outerHeight()+1) + 'px)');
                                }

                            });




                        }
                    });

                    $(document).on('mouseup.drag', function (e) {
                        if ($draggedElement) {
                            //console.log(currentBgc)
                            //$draggedElement.css({"backgroundColor":currentBgc,"border":"none",'transform':'translateY(0px)',"opacity":"1"})
                            $draggedElement.css({"backgroundColor":currentBgc,"border":"none","opacity":"1"})
                            //$(".currentEle").css('transform','translateY(0px)');
                            $(".currentEle").remove()
                            $(".tr_mask").remove()
                            // 停止拖拽时，移除全局事件监听器
                            $(document).off('.drag');

                            // 启用文本选择
                            $('body').css('user-select', '');

                            // 隐藏占位符
                            $placeholder.hide();

                            // 重置拖拽元素变量
                            $draggedElement = null;
                        }
                    });

                    // 阻止默认行为和冒泡
                    e.preventDefault();
                    e.stopPropagation();
                });

                function handlerPri(_cruCla,_class,_isUp,_allTr,_$draggedElement,_dir_size){
                    console.log(_dir_size)
                    let curH = $('.'+_cruCla).height() + 2
                    let newAllTr = _allTr.filter(index => {
                        let startI = 0
                        let endI = 0
                        if($draggedElement.attr('data-index') - $('.'+_class).attr('data-index') > 0){
                            startI = $('.'+_class).attr('data-index') * 1
                            endI = $draggedElement.attr('data-index') * 1
                            return index >= startI && index < endI
                        }else{
                            startI = $draggedElement.attr('data-index') * 1
                            endI = $('.'+_class).attr('data-index') * 1
                            return index > startI && index <= endI
                        }
                    })
                    newAllTr.each(function (){
                        const $this = $(this);
                        if(_isUp){
                            /*if($this.css('transform').indexOf('translateY(0px)')!=-1){
                                $this.css('transform','translateY('+ curH + 'px)')
                            }else{
                                $this.css('transform','translateY(0px)')
                            }*/

                            $this.attr('data-translateY', curH);
                            $this.css('transform','translateY('+ curH + 'px)')
                        }else{
                            /*if($this.css('transform').indexOf('translateY(0px)')!=-1){
                                $this.css('transform','translateY(-'+ curH + 'px)')
                            }else{
                                $this.css('transform','translateY(0px)')
                            }*/
                            $this.attr('data-translateY', -curH);
                            $this.css('transform','translateY(-'+ curH + 'px)')
                        }


                        //console.log($this[0])
                    })
                    console.log(
                        curH,
                        _class,
                        _isUp?'上':'下',
                        // _allTr
                    )
                    if(_isUp){
                        _$draggedElement.attr('data-translateY',_$draggedElement.attr('data-translateY')? _$draggedElement.attr('data-translateY')-curH : -curH);
                        _$draggedElement.css('transform','translateY('+ _$draggedElement.attr('data-translateY') + 'px)')
                    }else{
                        _$draggedElement.attr('data-translateY',_$draggedElement.attr('data-translateY')? _$draggedElement.attr('data-translateY')-curH : -curH);
                        _$draggedElement.css('transform','translateY('+(-_$draggedElement.attr('data-translateY') + 'px)'))
                    }
                    //console.log(-_$draggedElement.attr('data-translateY'))
                }




                /*$("body").mouseup(function(event) {
                    if (event.which === 1) {
                    }
                });*/

                if(0)$(".li1, .li2, .li3").mouseleave(function(){
                    // 当鼠标离开元素时执行的代码
                    console.log("鼠标已离开元素！");
                    // 你可以在这里添加任何你想要的逻辑，比如停止拖拽
                    // 重新启用文本选择
                    $('body').css('user-select', '');
                });

            },1000)

        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------







        //Ping检测
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if (location.search.indexOf("?PAGE=ping") !== -1) {

            // Ping
            sdPing()

            // 检测日志
            if(isOnPingLog)checkLog()


            function sdPing(){
                let checkPingTimer
                let pingLength = 0
                let isBottom = 1

                if(!$("#isBottom")[0]){
                    $(".result").parent().parent().parent().append(`<tr style="transform: translateY(12px)">
                                <td>置底</td>
                                <td>
                                    <input type="checkbox" name="able" class="input_hide able" value="1" id="isBottom">
				                    <label class="slider-v3" for="isBottom"></label>
				                 </td>
                            </tr>`)

                    $("#isBottom")[0].checked = true

                    $("#isBottom").click(function(){
                        if(this.checked){
                            isBottom = 1
                        }else{
                            isBottom = 0
                        }
                    })
                }else{
                    isBottom = 0
                }

                $.get('/action/ping.htm',function(msg){
                    //console.log(msg)
                    if(msg && msg.if) setTimeout(()=>{$('.if').val(msg.if)},500)
                },"JSON")

                checkPingTimer = setInterval(function(){
                    $.get('/action/ping_result.htm',function(msg){
                        try{
                            if(pingLength == msg.length){
                                //console.log("停止")
                                $(".stop").hide();
                                clearInterval(checkPingTimer);
                            }else{
                                //console.log("正在ping")
                                pingLength==0 || $(".stop").show();
                                $(".result").css("width","100%");
                                $(".result").val(msg);
                            }
                            pingLength = msg.length
                        }catch(e){
                            console.log("错误：",e)
                            clearInterval(checkPingTimer);
                        }
                    });
                },1000);

                // 请求过滤器
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    if(options.url.indexOf('/ping_result.htm')!=-1){
                        //console.log(options)
                        //console.log(options.data)
                        // 保存原始的success回调函数
                        let originalSuccess = options.success;

                        // 修改options.success来添加自定义的回调
                        options.success = function(data, status, jqXHR) {
                            //console.log(data)
                            // 在这里修改响应数据
                            //let modifiedData = data;

                            // 调用原始的success回调函数，传入修改后的数据
                            if (originalSuccess) {
                                originalSuccess(data, status, jqXHR);
                            }

                            if(isBottom){
                                // 或使用平滑滚动动画
                                $('.result').animate({
                                    scrollTop: $('.result').prop('scrollHeight')
                                }, 500); // 500ms为动画时长
                            }

                        };
                    }
                })

            }

            function checkLog(){
                let changeLog = JSON.parse(localStorage.getItem('changeLog'))!=null?JSON.parse(localStorage.getItem('changeLog')):true;
                $("ul.detail-info>li").eq(3).append(`<div id="ping_check_log_wra" style="width:100%;margin:auto;display:block;">
                  <div style="display:flex;justify-content:space-between;align-items: center;">
                     <div style="display:flex;align-items: center;">
                          <select class="sel-nav sel_time" style="width:150px;margin-right:10px;">
                              <option value="0">所有时间</option>
                              <option value="3600">最近1小时</option>
                              <option value="43200">最近12小时</option>
                              <option value="86400">最近24小时</option>
                          </select>
                          <select class="sel-nav sel_line" style="width:150px;"></select>
                     </div>
                     <div>
                          <div id="ref_ping_log" style="${btnCss}">立即刷新</div>
                          <div id="del_ping_log" style="${btnCss}background-color:#ff4d4f;margin-right:10px;">删除</div>
                     </div>
                  </div>
                  <div class="H20 col"></div>
                  <div id="ping_check_log" style="width:100%;"></div>
                </div>`)

                $("#ping_check_log_wra").append(`    <div id="back-to-top" style="
    display:none;
    position: fixed;
    bottom: 80px;
    right: 75px;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 24px;
    background-color: #fff;
    color:#666;
    cursor: pointer;
    transition: all .2s linear;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    user-select: none;
                            " title="回到顶部">↑</div>
                            </div>`)

                //回到顶部按钮
                $("#back-to-top").hover(function(){
                    // 鼠标移入时的处理逻辑
                    $(this).css("background-color","#f0f0f0")
                }, function(){
                    // 鼠标移出时的处理逻辑
                    $(this).css("background-color","#fff")
                });

                $('#back-to-top').click(function() {
                    // 使用animate()方法来平滑地滚动到页面顶部
                    $('body, html').animate({
                        scrollTop: 0
                    }, 500); // 500是动画的持续时间，以毫秒为单位
                    return false; // 阻止链接的默认行为（如果有的话）
                });

                //监听滚动条
                $(window).scroll(function() {
                    if ($(window).scrollTop() > 666) {
                        $("#back-to-top").css("display","block")
                    }else{
                        $("#back-to-top").css("display","none")
                    }
                });

                //获取线路并添加到下拉列表
                $.get('/action/wan_line_name_show.htm',(res)=>{
                    let ele = '<option value="0">所有线路</option>'
                    if(res.length>0){
                        res.forEach(item=>{
                            ele+=`<option value="${lineIdName(item.id)}">${item.name}</option>`
                        })
                    }
                    $(".sel_line").append(ele)
                    function lineIdName(v){
                        let lineName = v + ''
                        if(lineName.indexOf('WAN')!=-1){
                            return lineName.toLowerCase()
                        }else if(lineName.length==4 && lineName[0]=='3'){
                            if(lineName[1]=='0'){
                                // PPTP
                                return 'PPTP' + lineName[3]
                            }else if(lineName[1]=='2'){
                                // L2TP
                                return 'L2TP' + lineName[3]
                            }else if(lineName[1]=='3'){
                                // L2TP扩展
                                return 'L2TP扩展' + lineName[3]
                            }
                        }
                        return v
                    }
                },'json')
                //判断是否启用日志列表
                if(changeLog){
                    $("ul.detail-info>li:nth-child(4)>table").css("display","none")
                    $("#ping_check_log").css("display","block")
                }else{
                    $("ul.detail-info>li:nth-child(4)>table").css("display","table")
                    $("#ping_check_log_wra").css("display","none")
                }

                //添加滑块开关
                $("div.pdg20-LR>div.fc").append(`<div id="changeLogBtn" style="margin-left: auto;display:none;">
                   <input type="checkbox" name="able" class="input_hide able" value="1" id="changeLog">
				   <label class="slider-v3" for="changeLog"></label>
				</div>`)
                $("div.pdg20-LR>div.fc>div.menu>label").click(()=>{
                    $("#changeLogBtn").css("display","none")
                })
                $("div.pdg20-LR>div.fc>div.menu>label").eq(3).off('click')
                $("div.pdg20-LR>div.fc>div.menu>label").eq(3).click(()=>{
                    changeLog = JSON.parse(localStorage.getItem('changeLog'))!=null?JSON.parse(localStorage.getItem('changeLog')):true;
                    $("#changeLogBtn").css("display","block")
                    $("#changeLog")[0].checked = changeLog
                })
                //滑块开关点击事件
                $("#changeLog").click(function(){
                    if($("#changeLog")[0].checked){
                        JSON.stringify(localStorage.setItem('changeLog',true))
                        $("ul.detail-info>li:nth-child(4)>table").css("display","none")
                        $("#ping_check_log_wra").css("display","block")
                    }else{
                        JSON.stringify(localStorage.setItem('changeLog',false))
                        $("ul.detail-info>li:nth-child(4)>table").css("display","table")
                        $("#ping_check_log_wra").css("display","none")
                    }
                    //console.log(localStorage.getItem('changeLog'))
                })

                //下拉列表选择事件
                $(".sel_time,.sel_line").change(refPingLog)
                //刷新按钮
                $("#ref_ping_log").click(refPingLog)
                function refPingLog(){
                    message('', '请求中...')
                    if($(".sel_line").val()=='0'&&$(".sel_time").val()=='0'){
                        getPingLog(true)
                    }else{
                        $.get('/action/get_basic_info.htm',function(msg){
                            let selTimeVal = 0
                            if($(".sel_time").val()!=0){
                                selTimeVal=msg.time-$(".sel_time").val()*1
                            }
                            //console.log(true,selTimeVal,$(".sel_line").val().toLowerCase())
                            getPingLog(true,selTimeVal,$(".sel_line").val())
                        },'json')
                    }
                }

                //删除按钮
                $("#del_ping_log").click(()=>{
                    if (confirm("确定要删除吗？")) {
                        $.get('/action/fwlog_ping_del.htm', {}, function(msg) {
                            if(msg.state == 1){
                                message("success","删除成功...",true,2000);
                                getPingLog()
                            }else{
                                message("error","删除失败，请重试！");
                            }
                        }, 'json');
                    }
                })
                //按钮hover
                $("#ref_ping_log").hover(function () {$(this).css("background-color", "#39ade6")
                                                     }, function () {$(this).css("background-color", "#26a3e9")
                                                                    });
                $("#del_ping_log").hover(function () {$(this).css("background-color", "#ff7875")
                                                     }, function () {$(this).css("background-color", "#ff4d4f")
                                                                    });



                $("div.pdg20-LR>div.fc").css({
                    display:'flex',
                    alignItems: 'center',
                })


                getPingLog()
                function getPingLog(isMsg=false,timeFrame=false,wanLine=false){
                    const columns = [
                        {
                            title: '时间',
                            dataIndex: 'utime',
                            key: 'utime',
                            width:'200px'
                        },
                        {
                            title: '线路',
                            dataIndex: 'line',
                            key: 'line',
                        },
                        {
                            title: '域名/IP',
                            dataIndex: 'domain',
                            key: 'domain',
                        },
                        {
                            title: '发送（个包）',
                            dataIndex: 'sent',
                            key: 'sent',
                        },
                        {
                            title: '接收（个包）',
                            dataIndex: 'accept',
                            key: 'accept',
                        },
                        {
                            title: '最低延迟（ms）',
                            dataIndex: 'lowest',
                            key: 'lowest',
                        },
                        {
                            title: '最高延迟（ms）',
                            dataIndex: 'highest',
                            key: 'highest',
                        },
                        {
                            title: '平均延迟（ms）',
                            dataIndex: 'average',
                            key: 'average',
                        },
                        {
                            title: '丢包率（%）',
                            dataIndex: 'packetloss',
                            key: 'packetloss',
                        },
                    ]
                    const dataSource = []
                    $.get('/action/fwlog_ping.htm',function(msg){
                        if(msg.length>0){
                            if(isMsg)message("success","刷新成功",)
                            //console.log(msg);
                            msg.forEach((item,index) => {
                                if(item.type=='0x7002'){
                                    dataSource.push({
                                        key: index,
                                        utime: item.utime,
                                        line: item.text.match(/(wan\d+(-\d+)*|pptp\d+(-\d+)*|L2TP\d+(-\d+)*)(?=\s|$)/ig)?.[0],
                                        domain: item.text.match(/PING ([^\s]+)/)?.[0].replace(/PING /g, ''),
                                        sent: item.text.match(/发送(\d+(\.\d+)?)个包/g)?.[0].replace(/发送|个包/g, ''),
                                        accept: item.text.match(/收到(\d+(\.\d+)?)个包/g)?.[0].replace(/收到|个包/g, ''),
                                        lowest: item.text.match(/最低延迟(\d+(\.\d+)?)ms/g)?.[0].replace(/最低延迟|ms/g, ''),
                                        highest: item.text.match(/最高延迟(\d+(\.\d+)?)ms/g)?.[0].replace(/最高延迟|ms/g, ''),
                                        average: item.text.match(/,平均延迟(\d+(\.\d+)?)ms/g)?.[0].replace(/,平均延迟|ms/g, ''),
                                        packetloss: item.text.match(/,丢包率为(\d+(\.\d+)?)%/g)?.[0].replace(/,丢包率为|%/g, ''),
                                    })

                                }else{
                                    dataSource.push({
                                        key: index,
                                        utime: item.utime,
                                        line: item.text.indexOf('33')==-1?item.text.match(/(wan\d+|pptp\d+|L2TP\d+)/ig)?.[0]:'L2TP扩展',
                                        domain: item.text.indexOf('33')==-1?item.text.replace(item.text.match(/(wan\d+|pptp\d+|L2TP\d+)/ig)?.[0], '').replace(/！/g, ''):'线路不支持检测',
                                        sent: '9999',
                                        accept: '9999',
                                        lowest: '9999',
                                        highest: '9999',
                                        average: '9999',
                                        packetloss: '9999',
                                    })
                                }
                            });


                            let dataS=dataSource.sort((a,b)=>b.utime-a.utime)
                            if(timeFrame&&timeFrame!=0)dataS=JSON.parse(JSON.stringify(dataS.filter(item => timeFrame<=item.utime)));
                            //console.log(wanLine)
                            if(wanLine&&wanLine!=0)dataS=JSON.parse(JSON.stringify(dataS.filter(item => (item.line.indexOf(wanLine)!=-1))));
                            table("#ping_check_log", dataS, columns,false,{
                                unit:{sent:'个包',accept:'个包',lowest:'ms',highest:'ms',average:'ms',packetloss:'%',},
                                changeVal:{utime:reverse_time},isSort:true,
                                status:{packetloss:{0:(a)=>(a==0),1:(a)=>(a>0&&a<10),2:(a)=>(a>=10)}}
                            })
                        }else if(msg.length==0){
                            if(isMsg)message("warning","暂无数据！")
                            table("#ping_check_log", dataSource, columns,false,{isSort:true,})
                        }
                    },'json')
                }


            }







        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






        //testNewfw
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        if(isOnLogoTo){
            if (window.location.host.indexOf(':') > 0 && !isPrivateIpAddress(window.location.hostname) || isDev == 1) $(".back_logo").css({ "cursor": "pointer" });
            // logo点击事件
            $(".back_logo").click(function () {

                if (window.location.host.indexOf(':') > 0 && !isPrivateIpAddress(window.location.hostname) || isDev == 1) {
                    let str = ''

                    if (window.location.host.split(':').length == 1) {
                        str = window.btoa(window.location.host + ':80' + '*@*' + ($.cookie("NAME") || ''));
                    } else {
                        str = window.btoa(window.location.host + '*@*' + ($.cookie("NAME") || ''));
                    }

                    let $temp = $('<input>');
                    $('body').append($temp);
                    $temp.val(str).select();
                    document.execCommand('copy');
                    $temp.remove();

                    $(".back_logo").html(`
        <div style="
        width:100%;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color:#666;
        font-size:20px;
        background-color:rgba(255, 255, 255,.8);
        user-select: none;
        ">OK</div>
        `);

                    setTimeout(() => {
                        if (isDev == 1) {
                            window.open("http://localhost:5173/login");
                        } else {
                            window.open("http://moodtracks.cn:8887/login");
                        }

                        $(".back_logo").html("");
                    }, logoToTime)
                }

            });
        }



        // ip私有地址正则
        function isPrivateIpAddress(ip) {
            // CIDR格式的私有IP地址段
            var privateRegex = /^(?:(?:10|172\.(?:[1-9]|[1][0-9])|192\.168)\.)/;

            return privateRegex.test(ip);
        }

        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    }









    //流量转换
    function formatFileSize(size) {
        const scale = 1024;
        if (size == "") {
            return "0B";
        } else if (size < scale) {
            return `${size}.00B`;
        } else if (size < scale * scale) {
            return `${(size / scale).toFixed(2)}KB`;
        } else if (size < scale * scale * scale) {
            return `${(size / (scale * scale)).toFixed(2)}MB`;
        } else if (size < scale * scale * scale * scale||size >= scale * scale * scale * scale) {
            return `${(size / (scale * scale * scale)).toFixed(2)}GB`;
        } else {
            return `${size}`;
        }
    }


    //判断是否为公网地址
    function isPublicIPv4(ip) {
        try {
            const octets = ip.split(".");
            const firstOctet = parseInt(octets[0], 10);

            if (firstOctet == 10) return false;
            if (firstOctet == 100) return false;
            if (firstOctet == 127) return false;
            if (firstOctet == 172 && octets[1] >= 16 && octets[1] <= 31) return false;
            if (firstOctet == 192 && octets[1] == 168) return false;
            if (firstOctet >= 224 && firstOctet <= 255) return false;

            return true;
        } catch (error) {
            return false;
        }
    }

    //时间转换
    function reverse_time(time){
        let unixTimestamp = new Date(time*1000);

        let Y = unixTimestamp.getFullYear() + '-';
        let M = (unixTimestamp.getMonth()+1 < 10 ? '0'+(unixTimestamp.getMonth()+1) : unixTimestamp.getMonth()+1) + '-';
        let D = unixTimestamp.getDate() + ' ';
        let h = ((unixTimestamp.getHours()+'').length==1?'0'+unixTimestamp.getHours() :unixTimestamp.getHours())+ ':';
        let m = ((unixTimestamp.getMinutes()+'').length==1?'0'+unixTimestamp.getMinutes() :unixTimestamp.getMinutes())+ ':';
        let s = (unixTimestamp.getSeconds()+'').length==1?'0'+unixTimestamp.getSeconds() :unixTimestamp.getSeconds();
        return Y+M+D+h+m+s;
    }

    // 格式化日期
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并用padStart填充至2位
        const day = String(date.getDate()).padStart(2, "0"); // 用padStart填充至2位

        return `${year}-${month}-${day}`;
    }


    //消息提示
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
        * 消息提示
         * @param {a} a 消息类型，例如：'default','success','warning','error'
         * @param {b} b 消息内容，例如：'这是一条消息提示'
         * @example
         * message('success', '恭喜你，这是一条成功消息')	//@example示例代码
         * @return {Function} 返回数据类型
         */

    _addMessageHTML();
    let timerMessage = null;
    let topPX = 0;
    let arrMes = [];
    /**
        * 消息提示
         * @param {a} a 消息类型，例如：'default','success','warning','error'
         * @param {b} b 消息内容，例如：'这是一条消息提示'
         * @param {c} c 消息结束后是否刷新，例如：true
         * @param {d} d 刷新时间，例如：2000
         * @example
         * message('success', '恭喜你，这是一条成功消息')	//@example示例代码
         * @return {Function} 返回数据类型
         */
    function message(a, b,c=false,d=0) {
        clearTimeout(timerMessage)
        switch (a) {
            case 'success': _success(); break;
            case 'warning': _warning(); break;
            case 'error': _error(); break;
            default: _default();
        }
        $('#pmt_text').text(b)
        $('#prompt').css('opacity', 1)
        $('#prompt').css('top', '20px')
        if(c){
            setTimeout(()=>{
                _closeMessage();
                location.reload()
            },d)
        }else{
            timerMessage = setTimeout(() => {
                _closeMessage();
            }, 3000)
        }


        function _default() {
            $('#prompt').css('color', '#909399')
            $('#prompt').css('border-color', '#ebeef5')
            $('#prompt').css('background-color', '#edf2fc')
            $("#pmt_state").text('i');
            $("#pmt_state").css("background-color", "#909399")
        }

        function _success() {
            $('#prompt').css('color', '#67c23a')
            $('#prompt').css('border-color', '#e1f3d8')
            $('#prompt').css('background-color', '#f0f9eb')
            $("#pmt_state").text('√');
            $("#pmt_state").css("background-color", "#67c23a")
        }

        function _warning() {
            $('#prompt').css('color', '#e6a23c')
            $('#prompt').css('border-color', '#faecd8')
            $('#prompt').css('background-color', '#fdf6ec')
            $("#pmt_state").text('!');
            $("#pmt_state").css("background-color", "#e6a23c")
        }

        function _error() {
            $('#prompt').css('color', '#f56c6c')
            $('#prompt').css('border-color', '#fde2e2')
            $('#prompt').css('background-color', '#fef0f0')
            $("#pmt_state").text('×');
            $("#pmt_state").css("background-color", "#f56c6c")
        }
    }

    //关闭消息提示
    function _closeMessage() {
        topPX -= 48;
        clearTimeout(timerMessage)
        $('#prompt').css('opacity', 0)
        $('#prompt').css('top', '-48px')
    }
    //添加消息提示元素
    function _addMessageHTML() {
        const promptCSS = `
            position: fixed;
    background-color: #edf2fc;
    border-color: #ebeef5;
    color: #909399;
    /* font-size: 12px; */
    width: 380px;
    height: 48px;
    top: -48px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #ebeef5;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    user-select: none;
    opacity: 0;
    transition: all .2s linear;
    z-index: 99999;
            `
            const pmt_stateCSS = `
            display: inline-block;
    font-size: 12px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 50%;
    text-align: center;
    background-color: #909399;
    color: #edf2fc;
    margin-right: 10px;
            `
            const pmt_clearCSS = `
            font-size: 22px;
    color: #c4c5cc;
    cursor: pointer;
    transition: all .1s linear;
            `

            $('body').append(`
    <div id="prompt" style="${promptCSS}">
        <div id="pmt">
            <span id="pmt_state" style="${pmt_stateCSS}">i</span>
            <span id="pmt_text" style="font-size: 14px;">这是一条消息提示</span>
        </div>
        <div id="pmt_clear" style="${pmt_clearCSS}">×</div>
    </div>
    `)
    }
    //关闭消息提示按钮
    $("#pmt_clear").click(() => {
        _closeMessage()
    })




    //表格
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /**
        * 表格
         * @param {a} a DOM,添加到DOM里,例如：'#div','.div'
         * @param {b} b 列表数据，例如：[{key: '1',name: '张三',age: 18,address: '翻斗大街',}]
         * @param {c} c 列表头，例如：[{title: '姓名',dataIndex: 'name',key: 'name',},{title: '年龄',dataIndex: 'age',key: 'age',},{title: '住址',dataIndex: 'address',key: 'address',}]
         * @param {d} d false
         * @param {e} e 其他选项,unit(单位)、changeVal（值转换）、status（状态背景色）,例如：
         * @example
         * table("#ping_check_log", dataSource, columns,false,
                        {
                            unit:{sent:'个包',accept:'个包',lowest:'ms',highest:'ms',average:'ms',packetloss:'%',},
                            changeVal:{utime:reverse_time},
                            status:{packetloss:{0:(a)=>(a==0),1:(a)=>(a>0&&a<10),2:(a)=>(a>10)}}
                        })	//@example示例代码
         * @return {Function} 返回数据类型
         */
    function table(DOM, d, c, isCall = false, o) {
        o={
            unit:o.unit?o.unit:{},
            changeVal:o.changeVal?o.changeVal:{},
            status:o.status?o.status:{},
            isSort:o.isSort?o.isSort:false,
            height:o.height?o.height:'30px',
        }
        !isCall && sessionStorage.setItem('originalD', JSON.stringify(d));
        let sort;//排序
        if(o.isSort){if(!isCall){
            sort={ state: 0, type: '' };
        }else{
            sort = JSON.parse(sessionStorage.getItem('sort'))
        }}
        //sort = JSON.parse(sessionStorage.getItem('sort')) || { state: 0, type: '' };//排序
        if(o.isSort)switch (sort.state) {
            case 1: d.sort(function (a, b) { return a[sort.type] - b[sort.type] }); break;
            case 2: d.sort(function (a, b) { return b[sort.type] - a[sort.type] }); break;
            default: d = JSON.parse(sessionStorage.getItem('originalD')) || d;
                //console.log(JSON.parse(sessionStorage.getItem('originalD')));
        }
        //if(!isCall)console.log(d,sort.state,sort.type)
        const _tableCSS = `width:100%;height:calc(100% - 30px);min-height:240px;border:1px solid #f0f0f0;
                                           border-radius: 0 0 10px 10px;
                                           padding-bottom:10px;
                                           overflow: auto;
                                           box-sizing: border-box;
                                           font-size: 14px;
                                           color:#505459;
                                           margin-top:${o.height};
                                           background-color:#fff;`

                let html = `<div style="width:100%;min-width:800px;height:100%;position:relative;overflow:hidden;border-radius:10px">
                    <ul id="listTableWrapper" style="${_tableCSS}">
                                   <li style="width:100%;position:absolute;top:0;left:0;overflow:hidden;">
                                     <ul class="listTableHead" style="width:100%;height:100%;cursor: pointer;">
                    ${(() => {
                        let el = '';
                        for (let i = 0; i < c.length; i++) {
                            el += `<li data-key="${c[i].key}" data-type="${c[i].dataIndex}">${c[i].title}</li>`;
                        }
                        return el
                    })()}
                    </ul></li>
                        ${(() => {
                            let el = '';
                            if(d.length!=0){
                                for (let i = 0; i < d.length; i++) {
                                    el += `<li><ul>
                                  ${(() => {
                                        let ele = '';
                                        for (let j = 0; j < c.length; j++) {
                                            ele += `<li data-key="${c[j].key}">${(()=>{
                                                let temp
                                                if(c[j].key&&Object.keys(o.changeVal).length>0&&o.changeVal[c[j].key]){
                                                    temp = [c[j].key]?(o.changeVal[c[j].key]?o.changeVal[c[j].key](d[i][c[j].key]):''):d[i][c[j].key]
                                                }else{
                                                    temp = d[i][c[j].key]
                                                }
                                                return (temp==9999)?'-':(temp+(o.unit[c[j].key]?o.unit[c[j].key]:''))
                                            })()}</li>`;
                                        }
                                        return ele
                                    }
                                    )()}
                              </ul></li>`;
                                }
                            }else{
                                el = `<li><div style="height:220px;display: flex;justify-content: center;align-items: center;color:#bfbfbf;flex-direction: column;">
                                              <div style="font-size:30px;">☁</div><div>暂无数据</div>
                                          </div>
                                      </li>`
                            }
                            return el
                        })()}
                    </ul></div>`

                $(DOM).html(html)
    //添加排序元素
    if(o.isSort)$(".listTableHead>li").append(`
                <div style="display:flex;flex-direction: column;margin-left:5px;">
                    <div style="width: 0;height: 0;
                         border-left: 4px solid transparent;
                         border-right: 4px solid transparent;
                         border-bottom: 5px solid #b1b1b1;"></div>
                     <div style="width: 0;height: 0;margin-top:3px;
                         border-top: 5px solid #b1b1b1;
                         border-left: 4px solid transparent;
                         border-right: 4px solid transparent;"></div>
                </div>
                `)

    init()


    //添加样式
    function addTableCss() {
        $(".listTableHead>li").css({
            cursor: o.isSort?"pointer":"auto",
            userSelect: "none",
            transition: "all .2s linear",
        })

        $("#listTableWrapper>li").css({
            height:o.height
        })
        $("#listTableWrapper>li>ul").css({
            display: "flex"
        })

        $("#listTableWrapper>li>ul").eq(0).children('li').css({
            backgroundColor: "#fafafa",
            fontWeight: "bold"
        })

        $("#listTableWrapper>li>ul").css({
            display: "flex",
            height: "100%",
        })

        let allWidthPe=0,allWidthPx=0,allLength=0;
        c.forEach(item=>{
            if(item.width){
                ++allLength;
                if(item.width.indexOf('%')!=-1){
                    allWidthPe+=item.width.replace('%','')*1
                }else{
                    allWidthPx+=item.width.replace('px','')*1
                }
            }
        })
        //console.log((100-allWidthPe)/(c.length-allLength) + '%', allWidthPx+'px',allWidthPe,allWidthPx,allLength)
        $("#listTableWrapper>li>ul>li").css({
            width: `calc(${(100-allWidthPe)/(c.length-allLength) + '%'} - ${allWidthPx+'px'}`,
            width:100/c.length+ '%',
            //width:(100-allWidthPe)/(c.length-allLength) + '%' - allWidthPx+'px',
            width:'12.5%',
            //width:`calc(100% - ${allWidthPx+'px'}）/(c.length-allLength) + '%'`,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
            whiteSpace: "nowrap",

        })
        //$("#listTableWrapper>li>ul>li:nth-child(1)").css({
        //width:'200px',
        //backgroundColor: "#bfa",
        //})
        //自定义列宽
        c.forEach((item,index)=>{
            if(item.width){
                $(`#listTableWrapper>li>ul>li:nth-child(${index+1})`).css({
                    width:'200px',
                })
            }
        })
        $("#listTableWrapper>li:gt(0)>ul").css({
            transition: "all .2s linear"
        })


    }

    //自定义列宽
    function customColW(k,w){}

    // hover-------------------
    function hoverMove() {
        //列表头部移入移出
        if(o.isSort)$(".listTableHead>li").hover(function () {
            // 鼠标移入时的处理逻辑
            $(this).css("background-color", "#efefef")
        }, function () {
            // 鼠标移出时的处理逻辑
            $(this).css("background-color", "#fafafa")
        });

        //列表详情移入移出
        //除第一个li其他选中
        $("#listTableWrapper>li:gt(0)>ul").hover(function () {
            // 鼠标移入时的处理逻辑
            if ($(this).children().last().text() !== "稳定")
                $(this).css("background-color", "#fafafa")
        }, function () {
            // 鼠标移出时的处理逻辑
            if ($(this).children().last().text() !== "稳定")
                $(this).css("background-color", "#fff")
        });


        //关闭hover并添加列表背景色
        d.forEach((item,index)=>{
            for(let key in o.status){
                if (item.hasOwnProperty(key)) {
                    $.each(o.status[key], function(k, vf) {
                        switch(k){
                            case '1':if(vf(item[key])){
                                $(`#listTableWrapper>li:nth-child(${index+2})>ul`).off('mouseenter mouseleave');
                                $(`#listTableWrapper>li:nth-child(${index+2})>ul`).css({
                                    backgroundColor: "#fff2e8",
                                });};break;
                            case '2':if(vf(item[key])){
                                $(`#listTableWrapper>li:nth-child(${index+2})>ul`).off('mouseenter mouseleave');
                                $(`#listTableWrapper>li:nth-child(${index+2})>ul`).css({
                                    backgroundColor: "#ffc2c0",
                                });};break;
                        }
                    });
                }
            }
            //$(`#listTableWrapper>li:nth-child(${index+1})>ul`)
        })
    }

    //排序点击事件
    if(o.isSort)$('.listTableHead>li').off('click.sortEvent')
    if(o.isSort)$('.listTableHead>li').on('click', sortEvent);
    function sortEvent() {
        if (sort.type == this.dataset.type) {
            if (sort.state < 2) {
                sort.state += 1
            } else {
                sort.state = 0
            }
        } else {
            sort.state = 1;
            sort.type = this.dataset.type;
        }


        switch (sort.state) {
            case 1: d.sort(function (a, b) { return a[sort.type] - b[sort.type] }); break;
            case 2: d.sort(function (a, b) { return b[sort.type] - a[sort.type] }); break;
        }

        sessionStorage.setItem('sort', JSON.stringify({ state: sort.state, type: sort.type }))
        changeSortCSS();
        table(DOM, d, c, true, o)
    }



    // 切换排序样式
    function changeSortCSS() {
        $(".listTableHead>li>div").each(function () {
            $(this).children().eq(0).css("border-bottom-color", "#b1b1b1");
            $(this).children().eq(1).css("border-top-color", "#b1b1b1");
        })
        if (sort.state != 0) {
            $(".listTableHead>li").each(function () {
                if ($(this).attr("data-type") == sort.type) {
                    switch (sort.state) {
                        case 1: $(this).children().children().eq(0).css("border-bottom-color", "#1677ff");
                            $(this).children().children().eq(1).css("border-top-color", "#b1b1b1"); break;
                        case 2: $(this).children().children().eq(0).css("border-bottom-color", "#b1b1b1");
                            $(this).children().children().eq(1).css("border-top-color", "#1677ff"); break;
                    }
                }
            })
        }
    }

    // 初始化
    function init() {
        addTableCss();//添加样式
        hoverMove();//添加hover事件
        if(o.isSort)changeSortCSS();//排序样式
    }
}


    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //检查版本
    function checkVersion(curVer,checkTime){
        const curVerArr = curVer.split('.').join('')*1
        //检查更新
        try{
            setTimeout(()=>{
                $.get('http://moodtracks.cn:8888/checkver',{status:'ok'},(res)=>{
                    if(res.version){
                        let newVerArr = res.version.split('.').join('')*1;
                        if(curVerArr<newVerArr){
                            message('','检测到更新，跳转中...')
                            setTimeout(()=>{
                                location.href=res.updateAddress||"https://update.greasyfork.org/scripts/490316/fw.user.js";
                            },3000)
                        }else{
                            console.log('fw脚本目前是最新版本!')
                        }
                    }else{
                        console.log(res)
                    }
                },"json")
            },checkTime)
        }catch(e){
            console.log('fw脚本检查更新失败!'+e)
        }
    }
})();