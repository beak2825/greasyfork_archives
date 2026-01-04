// ==UserScript==
// @name    微信读书
// @icon    https://weread.qq.com/favicon.ico
// @namespace    https://greasyfork.org/users/878514
// @version    20250405
// @description    经典阅读器：宽屏显示，更改浅色模式背景色，开启沉浸式阅读、自动阅读和挂机模式，平滑滚动，空格翻页，调整页脚按钮，隐藏滚动条；双栏阅读器：更改浅色模式背景颜色，开启沉浸式阅读、自动阅读模式，空格翻页，屏幕常亮，配置持久化；
// @author    Velens
// @match    https://weread.qq.com/web/reader/*
// @require    https://code.jquery.com/jquery-3.6.0.min.js
// @license    MIT
// @grant    GM_addStyle
// @grant    GM_registerMenuCommand
// @grant    GM_setValue
// @grant    GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/440339/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/440339/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.meta.js
// ==/UserScript==


/* globals jQuery, $, waitForKeyElements */
const widths = [{titlew:"满列",width:"100%",align_items:"flex-end",margin_left:"45.5%"},{titlew:"宽列",width:"80%",align_items:"center",margin_left:"41.5%"},{titlew:"默认",width:"",align_items:"flex-start",margin_left:""}];
const footers = [{titlet:"隐藏",padding:"20px"},{titlet:"显示",padding:"40px"},{titlet:"默认",padding:""}];
const scrollbars = [{titles:"滚动条：显示",displays:"auto"},{titles:"滚动条：隐藏",displays:"none"},{titles:"滚动条：默认",displays:"auto"}];
const colors = [{titlec:"豆沙绿",RGB:"#C7EDCC"},{titlec:"杏仁黄",RGB:"#FAF9DE"},{titlec:"秋叶褐",RGB:"#FFF2E2"},{titlec:"胭脂红",RGB:"#FDE6E0"},{titlec:"海天蓝",RGB:"#DCE2F1"},{titlec:"葛巾紫",RGB:"#E9EBFE"},{titlec:"极光灰",RGB:"#EAEAEF"},{titlec:"青草绿",RGB:"#E3EDCD"},{titlec:"银河白",RGB:"#FFFFFF"}];
const screenLocks = ["锁定","常亮"];
const spacePages = ["开启","关闭"];
const playAutos = ["自动阅读：模式一","自动阅读：模式二","自动阅读：关闭"],playAutos1 = ["自动阅读：开启","自动阅读：关闭"];
const scrollTops = ["阅读模式：沉浸式","阅读模式：默认"];
let iw = GM_getValue("numw",0);
let io = GM_getValue("numo",0);
let is = GM_getValue("nums",0);
let ic = GM_getValue("numc",0);
let il = GM_getValue("numl",0);
let iSpace = GM_getValue("numSpace",0);
let iFlagp = GM_getValue("numFlagp",0),flagp = GM_getValue("flagp",true);
let flagt = GM_getValue("flagt",true);
var timeoutID,timePlay,timeStop,timeClick;
var flagPlay = false,flagBOT = false;
let timeStopmin = GM_getValue("timeStopmin",0);
var readerControls = document.getElementsByClassName("readerControls");
var readerTopBar = document.getElementsByClassName("readerTopBar");

if (document.querySelector(".wr_horizontalReader")){
    GM_registerMenuCommand("背景色：" + colors[ic].titlec,color);
    GM_addStyle(`.wr_whiteTheme .wr_horizontalReader .readerChapterContent,.wr_whiteTheme .readerControls_fontSize, .wr_whiteTheme .readerControls_item {background-color: ${colors[ic].RGB};}`);
    if(colors[ic].titlec != "银河白"){GM_addStyle(`.wr_whiteTheme .wr_horizontalReader .wr_horizontalReader_app_content .readerTopBar,.wr_whiteTheme .wr_horizontalReader .readerChapterContent_container {background: linear-gradient(#0000000d,#0000000d),${colors[ic].RGB};}`);};
    if(colors[ic].titlec != "银河白"){GM_addStyle(`.readerChapterContent {color: #000000CC !important;}`);};
    function color(){
        timeoutID = GM_getValue("timeoutID");
        clearTimeout(timeoutID);
        if(ic < colors.length-1){ic++;}
        else{ic = 0;}
        GM_setValue("numc",ic);
        GM_addStyle(`.wr_whiteTheme .wr_horizontalReader .readerChapterContent,.wr_whiteTheme .readerControls_fontSize, .wr_whiteTheme .readerControls_item {background-color: ${colors[ic].RGB};}`);
        GM_addStyle(`.wr_whiteTheme .wr_horizontalReader .wr_horizontalReader_app_content .readerTopBar,.wr_whiteTheme .wr_horizontalReader .readerChapterContent_container {background-image: linear-gradient(#0000000d,#0000000d);background-color: ${colors[ic].RGB};background-blend-mode: multiply;}`);
        timeoutID = setTimeout(() => location.reload(),10000);
        GM_setValue("timeoutID",timeoutID);
    };

    GM_registerMenuCommand("空格翻页：" + spacePages[iSpace],spacePage);
    function spacePage(){
        if(iSpace < spacePages.length-1){iSpace++;}
        else{iSpace = 0;}
        GM_setValue("numSpace",iSpace);
        location.reload();
    }
    function nextPage () {
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            keyCode: 39
        });
        document.dispatchEvent(event);
    };
    if(iSpace == 0){
        $(document).keydown(function(event){
            if(event.keyCode == 32){
                nextPage ();}
        })};

    if(flagp){
        GM_registerMenuCommand(playAutos1[0],playAuto1);
        $(window).on('load', function () {
            var buttonRead = "<button title='播放' class='readerControls_item readPlay'></button><button title='暂停' class='readerControls_item readStop'></button>"
            $('.readerControls').append(buttonRead);
            var iconPlay = "<span class='iconRead iconPlay'>播放</span>";
            var iconStop = "<span class='iconRead iconStop'>暂停</span>";
            $('.readPlay').append(iconPlay);
            $('.readStop').append(iconStop);
            GM_addStyle(`.iconRead{opacity:0.7;font-size: 12px;color:#fff}`);
            GM_addStyle(`.wr_whiteTheme .iconRead{color:#000;}`);
            $(".iconRead").mouseenter(function () {$(this).css("opacity", "1");});
            $(".iconRead").mouseleave(function () {$(this).css("opacity", ".7");});

            let timePagedown = GM_getValue("timePagedown",20000);
            $('.readPlay').attr('title', "间隔：" + timePagedown + "（双击修改）");
            $('.readStop').attr('title', "时长：" + timeStopmin + "（双击修改）");
            let wakeLock = null;
            const requestWakeLock = async ()=>{
                try {wakeLock = await navigator.wakeLock.request('screen');}
                catch (err) {console.log(`${err.name}, ${err.message}`);}}

            $('.readPlay').click(function () {
                clearTimeout(timeClick);
                timeClick = setTimeout(function(){
                    flagPlay = true;
                    GM_addStyle(`.readPlay{box-shadow: 0 0 5px 2px rgba(0,255,0,1) !important;}`);
                    if(flagt){readerTopBar[0].style.opacity = 0;GM_addStyle(`.readerControls{opacity:0;}`);};
                    clearInterval(timePlay);
                    clearTimeout(timeStop);
                    timePlay = setInterval(nextPage, timePagedown);
                    if(timeStopmin != 0){timeStop = setTimeout(() => $('.readStop').click(),timeStopmin*60000);};
                    if(il != 0){requestWakeLock();};
                },250);
            });

            $('.readPlay').dblclick(function () {
                clearTimeout(timeClick);
                let timePagedown1 = timePagedown;
                timePagedown = prompt("请输入翻页间隔（毫秒）（默认：20000）", timePagedown);
                if(timePagedown != null && /^\d+$/.test(timePagedown)){
                    if(timePagedown < 1000){timePagedown = 1000;}
                    $('.readPlay').attr('title', "间隔：" + timePagedown + "（双击修改）");
                    if(timePagedown != timePagedown1 && flagPlay){
                        clearInterval(timePlay);
                        timePlay = setInterval(nextPage, timePagedown);}
                    GM_setValue("timePagedown",timePagedown);}
                else{timePagedown = GM_getValue("timePagedown");}
            })

            $('.readStop').click(function () {
                flagPlay = false;
                GM_addStyle(`.readPlay{box-shadow: 0 4px 20px rgba(0,0,0,.03) !important;}`);
                clearInterval(timePlay);
                if(wakeLock != null){wakeLock.release().then(() => {wakeLock = null});};
            })

            $('.readStop').dblclick(function () {
                timeStopmin = prompt("请输入暂停时长（分钟）（默认：0，不自动暂停）", timeStopmin);
                if(timeStopmin != null && /^\d+$/.test(timeStopmin)){
                    $('.readStop').attr('title', "时长：" + timeStopmin + "（双击修改）");
                    GM_setValue("timeStopmin",timeStopmin);}
                else{timeStopmin = GM_getValue("timeStopmin");}
            })

            $(document).keydown(function(event){
                if(event.keyCode == 96){
                    if(!flagPlay) {$('.readPlay').click();}
                    else {$('.readStop').click();}}
            });
        })
    }else{GM_registerMenuCommand(playAutos1[1],playAuto1);}
    function playAuto1(){
        flagp = !flagp;
        GM_setValue("flagp",flagp);
        location.reload();
    };

    if(flagp){
        GM_registerMenuCommand("屏幕状态：" + screenLocks[il],screenLock);
        function screenLock(){
            if(il < screenLocks.length-1){il++;}
            else{il = 0;}
            GM_setValue("numl",il);
            location.reload();
        };}

    if(flagt){
        GM_registerMenuCommand(scrollTops[0],scrollTop);
        setTimeout(function(){
            readerTopBar[0].style.opacity = 0;
            readerControls[0].style.opacity = 0;
            readerTopBar[0].addEventListener('mouseenter', function(){ readerTopBar[0].style.opacity = 1});
            readerTopBar[0].addEventListener('mouseleave', function(){ readerTopBar[0].style.opacity = 0});
            readerControls[0].addEventListener('mouseenter', function(){ readerControls[0].style.opacity = 1});
            readerControls[0].addEventListener('mouseleave', function(){ readerControls[0].style.opacity = 0});
        },10000);
    }
    else{GM_registerMenuCommand(scrollTops[1],scrollTop);}
    function scrollTop(){
        flagt = !flagt;
        GM_setValue("flagt",flagt);
        location.reload();
    }

}else{
    GM_addStyle(`.reader-font-control-panel-wrapper .font-panel-content-arrow {display: none;}`);
    GM_addStyle(`.wr_whiteTheme .reader-font-control-panel-wrapper .font-panel-content-arrow {display: none;}`);

    GM_registerMenuCommand("宽度：" + widths[iw].titlew,width)
    if(widths[iw].titlew != "默认"){
        GM_addStyle(`.readerContent .app_content, .readerTopBar {max-width: ${widths[iw].width};}`);
        GM_addStyle(`.readerControls {align-items: ${widths[iw].align_items};}`);
        GM_addStyle(`.readerControls {margin-left: ${widths[iw].margin_left};}`);}
    function width(){
        if(iw < widths.length-1){iw++;}
        else{iw = 0;}
        GM_setValue("numw",iw);
        location.reload();
    };

    GM_registerMenuCommand("页脚：" + footers[io].titlet,Footer);
    if(footers[io].titlet != "默认"){
        GM_addStyle(`.readerFooter {padding: ${footers[io].padding};}`);
        GM_addStyle(".readerFooter_button {font-weight: 600;}");}
    if(footers[io].titlet == "隐藏"){
        GM_addStyle(` .readerFooter_button {background-color: #1C1C1D;}`);
        GM_addStyle(`.wr_whiteTheme .readerFooter_button {background-color: ${colors[ic].RGB};}`);}
    function Footer(){
        if(io < footers.length-1){io++;}
        else{io = 0;}
        GM_setValue("numo",io);
        location.reload();
    };

    GM_registerMenuCommand(scrollbars[is].titles,scrollbar);
    GM_addStyle(`body::-webkit-scrollbar {display: ${scrollbars[is].displays};}`);
    if(scrollbars[is].titles == "滚动条：显示"){
        if(widths[iw].titlew != "满列"){GM_addStyle(`body.wr_whiteTheme::-webkit-scrollbar {background-image: linear-gradient(#0000000d,#0000000d);background-color: ${colors[ic].RGB};background-blend-mode: multiply;}`);}
        else{
            GM_addStyle(`body::-webkit-scrollbar {background-color: #1c1c1d;}`);
            GM_addStyle(`body.wr_whiteTheme::-webkit-scrollbar {background-color: ${colors[ic].RGB};}`);}
        GM_addStyle(`body::-webkit-scrollbar {width:6px;}`);
        GM_addStyle(`body::-webkit-scrollbar-thumb {border-radius: 10px;box-shadow: inset 0 0 6px rgba(255, 255, 255, .4);}`);
        GM_addStyle(`body.wr_whiteTheme::-webkit-scrollbar-thumb {border-radius: 10px;box-shadow: inset 0 0 6px rgba(0, 0, 0, .2);}`);}
    function scrollbar(){
        if(is < scrollbars.length-1){is++;}
        else{is = 0;}
        GM_setValue("nums",is);
        location.reload();
    };

    GM_registerMenuCommand("背景色：" + colors[ic].titlec,color);
    GM_addStyle(`.wr_whiteTheme .readerContent .app_content, .wr_whiteTheme .readerTopBar, .wr_whiteTheme .readerControls_fontSize, .wr_whiteTheme .readerControls_item {background-color: ${colors[ic].RGB};}`);
    if(widths[iw].titlew != "满列" && colors[ic].titlec != "银河白"){GM_addStyle(`.wr_page_reader.wr_whiteTheme {background: linear-gradient(#0000000d,#0000000d),${colors[ic].RGB};}`);};
    if(colors[ic].titlec != "银河白"){GM_addStyle(`.readerChapterContent {color: #000000CC !important;}`);};
    function color(){
        timeoutID = GM_getValue("timeoutID");
        clearTimeout(timeoutID);
        if(ic < colors.length-1){ic++;}
        else{ic = 0;}
        GM_setValue("numc",ic);
        GM_addStyle(`.wr_whiteTheme .readerContent .app_content, .wr_whiteTheme .readerTopBar, .wr_whiteTheme .readerControls_fontSize, .wr_whiteTheme .readerControls_item {background-color: ${colors[ic].RGB};}`);
        if(scrollbars[is].titles == "滚动条：显示"){GM_addStyle(`body.wr_whiteTheme::-webkit-scrollbar {background-color: ${colors[ic].RGB};}`);}
        if(widths[iw].titlew != "满列"){GM_addStyle(`.wr_page_reader.wr_whiteTheme {background-image: linear-gradient(#0000000d,#0000000d);background-color: ${colors[ic].RGB};background-blend-mode: multiply;}`);};
        if(footers[io].titlet == "隐藏"){
            GM_addStyle(`.wr_whiteTheme .readerFooter_button {background-color: ${colors[ic].RGB};}`);}
        if(iFlagp != 2){GM_addStyle(`.wr_whiteTheme .autoReads{background-color:${colors[ic].RGB};}`)};
        timeoutID = setTimeout(() => location.reload(),10000);
        GM_setValue("timeoutID",timeoutID);
    };

    if(iFlagp != 2){
        GM_registerMenuCommand("屏幕状态：" + screenLocks[il],screenLock);
        function screenLock(){
            if(il < screenLocks.length-1){il++;}
            else{il = 0;}
            GM_setValue("numl",il);
            location.reload();
        };}

    function nextPage () {
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            keyCode: 39
        });
        document.dispatchEvent(event);
    };
    $(document).keydown(function(event){
        if(event.keyCode == 32){
            var totalTop = $(document).scrollTop();
            var scrollHeight = $(document).height() - $(window).height() - 10;
            if (totalTop >= scrollHeight){nextPage ();}}
    })
    GM_registerMenuCommand(playAutos[iFlagp],playAuto);
    if(iFlagp != 2){
        $(window).on('load', function () {
            var classRead = document.createElement("div");
            classRead.className = "autoRead";
            GM_addStyle(`.autoRead{width:48px;position:fixed;bottom:48px;z-index:5;margin-right:548px;right:50%;margin-right:${widths[iw].margin_left};}`);
            document.body.append(classRead);
            var buttonRead = "<button title='播放' class='autoReads readPlay'></button><button title='暂停' class='autoReads readStop'></button><button title='倍数' class='autoReads readSpeed'></button><button title='翻页' class='autoReads readPage'></button></button><button title='挂机' class='autoReads readBOT'></button>";
            GM_addStyle(`.autoReads{width:48px;height:48px;border-radius:24px;margin-top:24px;box-shadow: 0 8px 32px rgba(0,25,104,.1);background-color:#1C1C1D;}`);
            GM_addStyle(`.wr_whiteTheme .autoReads{background-color:${colors[ic].RGB};}`);
            $('.autoRead').append(buttonRead);
            var iconPlay = "<span class='iconRead iconPlay'>播放</span>";
            var iconStop = "<span class='iconRead iconStop'>暂停</span>";
            var iconSpeed = "<span class='iconRead iconSpeed'>倍速</span>";
            var iconPage = "<span class='iconRead iconPage'>翻页</span>";
            var iconBOT = "<span class='iconRead iconBOT'>挂机</span>";
            GM_addStyle(`.iconRead{opacity:0.7;width:48px;height:48px;display:inline-block;line-height:48px;text-align:center;color:#fff}`);
            GM_addStyle(`.wr_whiteTheme .iconRead{color:#000;}`);
            $('.readPlay').append(iconPlay);
            $('.readStop').append(iconStop);
            $('.readSpeed').append(iconSpeed);
            $('.readPage').append(iconPage);
            $('.readBOT').append(iconBOT);
            $(".iconRead").mouseenter(function () {$(this).css("opacity", "1");});
            $(".iconRead").mouseleave(function () {$(this).css("opacity", ".7");});
            if(flagt){
                classRead.addEventListener('mouseenter', function(){ classRead.style.opacity = 1});
                classRead.addEventListener('mouseleave', function(){ classRead.style.opacity = 0});
                setTimeout(() => GM_addStyle(`.autoRead{opacity:0;}`),10000);}

            var timePage,timeBOT,numPlay=0;
            let ynumDown = GM_getValue("ynumDown",1);
            let timeMillisec = GM_getValue("timeMillisec",20);
            let flagPage = GM_getValue("flagPage",true);
            let timePagesec = GM_getValue("timePagesec",10000);
            let timeTopsec = GM_getValue("timeTopsec",0);
            $('.iconPlay').attr('title', "停留：" + timeTopsec + "（双击修改）");
            if(iFlagp == 0){$('.iconSpeed').attr('title', "步长：" + ynumDown);}
            if(iFlagp == 1){$('.iconSpeed').attr('title', "步长，间隔：" + ynumDown + "，" + timeMillisec);}
            $('.iconStop').attr('title', "时长：" + timeStopmin + "（双击修改）");
            $('.iconPage').attr('title', "间隔：" + timePagesec + "（双击修改）");
            if(flagPage){GM_addStyle(`.readPage{box-shadow: 0 0 5px 2px rgba(0,255,0,1);}`);};
            let wakeLock = null;
            const requestWakeLock = async ()=>{
                try {wakeLock = await navigator.wakeLock.request('screen');}
                catch (err) {console.log(`${err.name}, ${err.message}`);}}

            const autoPlay = async function () {
                if(iFlagp == 0){timePlay = window.requestAnimationFrame(autoPlay);}
                if(flagBOT){window.scrollBy(0,1);}
                else{window.scrollBy(0,ynumDown);};
                var totalTop = $(document).scrollTop();
                var scrollHeight = $(document).height() - $(window).height() - 10;
                if(totalTop <= 10 && timeTopsec != 0){
                    ynumDown = 0;
                    setTimeout(function(){ynumDown = GM_getValue("ynumDown");}, timeTopsec);};
                if(totalTop >= scrollHeight){
                    if(numPlay<1){
                        numPlay++;
                        if(flagPage){timePage = setTimeout(() => nextPage (),timePagesec);};
                        if(flagBOT){timeBOT = setTimeout(() => window.scrollTo(0, 0),10000);};
                    }}
                else{
                    if(numPlay>0){
                        numPlay=0;
                        clearTimeout(timePage);
                        clearTimeout(timeBOT);
                    }}
            }

            $('.readPlay').click(function () {
                clearTimeout(timeClick);
                timeClick = setTimeout(function(){
                    flagPlay = true;
                    flagBOT = false;
                    if(flagt){
                        GM_addStyle(`.autoRead{opacity:0;}`);
                        readerControls[0].style.opacity = 0;};
                    GM_addStyle(`.readBOT{box-shadow: 0 8px 32px rgba(0,25,104,.1);}`);
                    GM_addStyle(`.readPlay{box-shadow: 0 0 5px 2px rgba(0,255,0,1);}`);
                    clearTimeout(timeBOT);
                    clearTimeout(timeStop);
                    if(iFlagp == 0){
                        cancelAnimationFrame(timePlay);
                        autoPlay();}
                    if(iFlagp == 1){
                        clearInterval(timePlay);
                        timePlay = setInterval(autoPlay, timeMillisec);}
                    if(timeStopmin != 0){timeStop = setTimeout(() => $('.readStop').click(),timeStopmin*60000);};
                    if(il != 0){requestWakeLock();};
                },250);
            });

            $('.readPlay').dblclick(function () {
                clearTimeout(timeClick);
                timeTopsec = prompt("请输入翻页停留（毫秒）（默认：0，不停留）", timeTopsec);
                if(timeTopsec != null && /^\d+$/.test(timeTopsec)){
                    $('.iconPlay').attr('title', "停留：" + timeTopsec + "（双击修改）");
                    GM_setValue("timeTopsec",timeTopsec);}
                else{timeTopsec = GM_getValue("timeTopsec");}
            })

            $('.readStop').click(function () {
                flagPlay = false;
                flagBOT = false;
                numPlay=0;
                GM_addStyle(`.readPlay,.readBOT{box-shadow: 0 8px 32px rgba(0,25,104,.1);}`);
                if(iFlagp == 0){cancelAnimationFrame(timePlay);}
                if(iFlagp == 1){clearInterval(timePlay);}
                clearTimeout(timeStop);
                clearTimeout(timePage);
                clearTimeout(timeBOT);
                if(wakeLock != null){wakeLock.release().then(() => {wakeLock = null});};
            })

            $('.readStop').dblclick(function () {
                timeStopmin = prompt("请输入暂停时长（分钟）（默认：0，不自动暂停）", timeStopmin);
                if(timeStopmin != null && /^\d+$/.test(timeStopmin)){
                    $('.iconStop').attr('title', "时长：" + timeStopmin + "（双击修改）");
                    GM_setValue("timeStopmin",timeStopmin);}
                else{timeStopmin = GM_getValue("timeStopmin");}
            })

            $('.readSpeed').click(function () {
                if(!flagBOT){
                    if(iFlagp == 0){
                        ynumDown = prompt("请输入滚动步长（像素）（默认：1）", ynumDown);
                        if(ynumDown != null && $.isNumeric(ynumDown)){
                            $('.iconSpeed').attr('title', "步长：" + ynumDown);
                            GM_setValue("ynumDown",ynumDown);}
                        else{ynumDown = GM_getValue("ynumDown");}}
                    if(iFlagp == 1){
                        var speedVal = prompt('请输入滚动步长（像素），调用间隔（毫秒）（默认：1,20）', ynumDown + "," + timeMillisec);
                        if(speedVal != null){
                            var speedValsplit = speedVal.split(/[,|\uff0c]/,2)
                            let timeMillisec1 = timeMillisec;
                            ynumDown = speedValsplit[0];
                            timeMillisec = speedValsplit[1];
                            if(!$.isNumeric(ynumDown)){ynumDown = GM_getValue("ynumDown");};
                            if(!$.isNumeric(timeMillisec)){timeMillisec = GM_getValue("timeMillisec");};
                            if(timeMillisec != timeMillisec1 && flagPlay){
                                clearInterval(timePlay);
                                timePlay = setInterval(autoPlay, timeMillisec);}
                            $('.iconSpeed').attr('title', "步长，间隔：" + ynumDown + "，" + timeMillisec);
                            GM_setValue("ynumDown",ynumDown);
                            GM_setValue("timeMillisec",timeMillisec);}}
                }})

            $('.readPage').click(function () {
                if(!flagBOT){
                    clearTimeout(timeClick);
                    timeClick = setTimeout(function(){
                        if(!flagPage){
                            flagPage = true;
                            numPlay=0;
                            GM_addStyle(`.readPage{box-shadow: 0 0 5px 2px rgba(0,255,0,1);}`);}
                        else{
                            flagPage = false;
                            clearTimeout(timePage);
                            GM_addStyle(`.readPage{box-shadow: 0 8px 32px rgba(0,25,104,.1);}`);}
                        GM_setValue("flagPage",flagPage);
                    },250);}
                //else{alert("当前为挂机模式，已关闭自动翻页");}
            })

            $('.readPage').dblclick(function () {
                if(!flagBOT){
                    clearTimeout(timeClick);
                    timePagesec = prompt("请输入翻页间隔（毫秒）（默认：10000）", timePagesec);
                    if(timePagesec != null && /^\d+$/.test(timePagesec)){
                        if(timePagesec < 1000){timePagesec = 1000;}
                        $('.iconPage').attr('title', "间隔：" + timePagesec + "（双击修改）");
                        GM_setValue("timePagesec",timePagesec);}
                    else{timePagesec = GM_getValue("timePagesec");}
                    //else{alert("当前为挂机模式，已关闭自动翻页");}
                }})

            $('.readBOT').click(function () {
                flagBOT = true;
                flagPlay = false;
                flagPage = false;
                numPlay=0;
                if(flagt){readerControls[0].style.opacity = 0;};
                GM_addStyle(`.autoReads{box-shadow: 0 8px 32px rgba(0,25,104,.1);}`);
                GM_addStyle(`.readBOT{box-shadow: 0 0 5px 2px rgba(0,255,0,1);}`);
                clearTimeout(timePage);
                clearTimeout(timeStop);
                if(iFlagp == 0){
                    cancelAnimationFrame(timePlay);
                    autoPlay();}
                if(iFlagp == 1){
                    clearInterval(timePlay);
                    timePlay = setInterval(autoPlay, 20);}
                if(timeStopmin != 0){timeStop = setTimeout(() => $('.readStop').click(),timeStopmin*60000);};
                if(il != 0){requestWakeLock();};
                GM_setValue("flagPage",flagPage);
            })

            $(document).keydown(function(event){
                if(event.keyCode == 96){
                    if(!flagPlay && !flagBOT) {$('.readPlay').click();}
                    else {$('.readStop').click();}}
            });

        })
    }
    function playAuto(){
        if(iFlagp < playAutos.length-1){iFlagp++;}
        else{iFlagp = 0;}
        GM_setValue("numFlagp",iFlagp);
        location.reload();
    };

    if(flagt){
        GM_registerMenuCommand(scrollTops[0],scrollTop);
        $(window).scroll(function(){
            var scroll = $(this).scrollTop();
            var paddingtop = $(".navBarOffset").css("padding-top"),lineheight;
            if (document.querySelector(".readerHeaderButton")){
                lineheight = $(".readerHeaderButton").css("line-height");}
            else{lineheight = 0}
            var scrollTop = parseFloat(paddingtop) + parseFloat(lineheight);
            if(scroll <= scrollTop){
                // 顶部显示
                readerTopBar[0].style.opacity = 1;
                //readerControls[0].style.opacity = 1;
            }else{
                // 下滑隐藏
                readerTopBar[0].style.opacity = 0;
                if(!flagPlay && !flagBOT){
                    readerControls[0].style.opacity = 0;
                    if(iFlagp != 2){GM_addStyle(`.autoRead{opacity:0;}`)}}
            }
            readerTopBar[0].addEventListener('mouseenter', function(){ readerTopBar[0].style.opacity = 1});
            readerTopBar[0].addEventListener('mouseleave', function(){ if(scroll <= scrollTop){ readerTopBar[0].style.opacity = 1}else{ readerTopBar[0].style.opacity = 0}});
            readerControls[0].addEventListener('mouseenter', function(){ readerControls[0].style.opacity = 1});
            readerControls[0].addEventListener('mouseleave', function(){ readerControls[0].style.opacity = 0});
        });
    }
    else{GM_registerMenuCommand(scrollTops[1],scrollTop);}
    function scrollTop(){
        flagt = !flagt;
        GM_setValue("flagt",flagt);
        location.reload();
    };}
