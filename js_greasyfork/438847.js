// ==UserScript==
// @name         微博批量删除隐藏助手（适配新版微博）
// @namespace    https://github.com/Meteor8
// @version      5.0
// @description  可指定日期、关键字对微博进行批量删除或设置为仅个人可见，可自动翻页
// @author       Meteora
// @match        *.weibo.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438847/%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E9%9A%90%E8%97%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E9%80%82%E9%85%8D%E6%96%B0%E7%89%88%E5%BE%AE%E5%8D%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438847/%E5%BE%AE%E5%8D%9A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E9%9A%90%E8%97%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E9%80%82%E9%85%8D%E6%96%B0%E7%89%88%E5%BE%AE%E5%8D%9A%EF%BC%89.meta.js
// ==/UserScript==
 
var intervalTime = 1500;    //操作间隔时间ms
var versionSel = 0; //微博版本选择
var keyWord = "";   //关键字
var endFlag = 0;    //尾页标志
var scrollCnt = 0;  //下滑次数
var failCnt = 0;    //失败次数
var failThreshold = 1;  //失败阈值
var dateFrom, dateTo;
var allFailCnt, allSucCnt;
var notComp = 0;  //是否为快转
allSucCnt = allFailCnt = 0
var episodeSucCnt = 0
dateFrom = "0-0-0";
dateTo = "9999-99-99"
var exeSelect=-1;   //操作类型：-1测试，0删除，1隐藏，2取消快转
 
var itemCntLast = 0;
var itemCntNew = 0;
 
function $(elem) {
    return document.querySelector(elem);
}
function $All(elem) {
    return document.querySelectorAll(elem);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
function isDatePart(dateStr) {
    var parts;
    if (dateStr.indexOf("-") > -1) {
        parts = dateStr.split('-');
    } else if (dateStr.indexOf("/") > -1) {
        parts = dateStr.split('/');
    } else {
        return false;
    }
    if (parts.length < 3) {
        return false;
    }
    for (let i = 0; i < 3; i++) {
        if (isNaN(parts[i])) {
            return false;
        }
    }
    let y = parts[0];//年
    let m = parts[1];//月
    let d = parts[2];//日
    if (y > 9999) {
        return false;
    }
    if (m < 1 || m > 12) {
        return false;
    }
    switch (d) {
        case 29:
            if (m == 2) {
                if ((y / 100) * 100 == y && (y / 400) * 400 != y) {
                } else {
                    return false;
                }
            }
            break;
        case 30:
            if (m == 2) {
                return false;
            }
            break;
        case 31:
            if (m == 2 || m == 4 || m == 6 || m == 9 || m == 11) {
                return false;
            }
            break;
        default:
    }
    return true;
}
function dateComp(myDate, setDate){
    var md = new Array();
    var d0 = new Array();
    d0 = setDate.split("-")
    if(myDate[0]=="今" || myDate[myDate.length-1]=="前"){   //今天，10分钟前
        md = (new Date()).toLocaleDateString().split("/")
    }else if(myDate[myDate.length-1]=="日"){    // 1月1日
        md[0] = (new Date()).getFullYear()
        md[1] = myDate.split("月")[0]
        md[2] = myDate.split("月")[1].split("日")[0]
    }else{  //2012-1-15
        md = myDate.split("-")
    }
    for(let i in md) md[i]=parseInt(md[i]);
    for(let i in d0) d0[i]=parseInt(d0[i]);
 
    if(md[0]>d0[0]){
        return 1;
    }else if(md[0]==d0[0]){
        if(md[1]>d0[1]){
            return 1;
        }else if(md[1]==d0[1]){
            if(md[2]>d0[2]){
                return 1;
            }else if(md[2]==d0[2]){
                return 0;
            }
        }
    }
    return -1;
}
 
(function() {
    'use strict';
    window.onload = () => {
        GM_registerMenuCommand('开始运行程序', startBtn);
		/***** =======  Buy-Me-A-Coffee（国内版）  ======= *****/
		const donateWeChatImg = 'https://gitee.com/SolarEclipse/qrcode/raw/master/wx.jpg'; 
		const donateAlipayImg = 'https://gitee.com/SolarEclipse/qrcode/raw/master/ali.jpg'; 
		const afdianLink      = 'https://afdian.com/a/meteora';         // 可选

		// ① 创建右下角“☕ 打赏作者”悬浮按钮
		function createDonateButton () {
			const btn = document.createElement('button');
			btn.textContent = '☕ 打赏作者';
			Object.assign(btn.style, {
				position: 'fixed',
				bottom:  '80px',   // 避开你原本的“开始程序”按钮
				left:   '20px',
				zIndex:  '10000',
				padding: '8px 14px',
				background: '#ffbb00',
				color:  '#000',
				border: 'none',
				borderRadius: '6px',
				cursor: 'pointer',
				boxShadow: '0 2px 8px rgba(0,0,0,.15)'
			});
			btn.onclick = showDonate;
			document.body.appendChild(btn);
		}

		// ② 点击后 / 脚本结束后展示二维码面板
		function showDonate () {
			// 若已存在则先删除，保证只出现一次
			const old = document.getElementById('donate-panel');
			if (old) old.remove();

			const panel = document.createElement('div');
			panel.id = 'donate-panel';
			Object.assign(panel.style, {
				position: 'fixed',
				bottom:  '120px',
				left:   '20px',
				zIndex:  '10001',
				padding: '12px 16px',
				background: '#fff',
				border: '1px solid #ddd',
				borderRadius: '10px',
				boxShadow: '0 4px 12px rgba(0,0,0,.1)',
				textAlign: 'center',
				fontFamily: 'Arial, sans-serif'
			});
			panel.innerHTML = `
				  <div style="display:flex;gap:8px;">
					 <div>
					   <img src="${donateWeChatImg}" referrerpolicy="no-referrer"
							style="width:120px;height:120px;border:1px solid #eee;">
					   <div style="font-size:12px">微信</div>
					 </div>
					 <div>
					   <img src="${donateAlipayImg}" referrerpolicy="no-referrer"
							style="width:120px;height:120px;border:1px solid #eee;">
					   <div style="font-size:12px">支付宝</div>
					 </div>
				  </div>
				<a href="${afdianLink}" target="_blank" style="display:block;margin:6px auto 0;color:#069;text-decoration:none;font-size:13px;">或访问我的爱发电主页 →</a>
				<button id="donate-close" style="margin-top:8px;padding:4px 10px;border:none;border-radius:4px;background:#eee;cursor:pointer;">关闭</button>
			`;
			document.body.appendChild(panel);
			document.getElementById('donate-close').onclick = () => panel.remove();
		}

		// ③ 在脚本加载完就放一个按钮；如果只想“结束时”弹，可以只在 mainLoop 里调用 showDonate()
		createDonateButton();
		// 可选：加入脚本菜单
		GM_registerMenuCommand('☕ 打赏作者', showDonate);
		/***** =======  End Buy-Me-A-Coffee ======= *****/
 
        //扫面页面，滑动到页面最底端
        async function scanPage(){
            var state = false;
            while(!state){
                scrollBy(0, 2000);
                scrollCnt++;
                console.log("*下滑"+scrollCnt)
                await sleep(1000);
                state = $('[node-type="feed_list_page"]') || (scrollCnt>15 && !($('[node-type="lazyload"]')))
            }
            console.log("#到底")
            scrollCnt = 0;
            if(!$('.page.next')){
                endFlag = 1;
                console.log("#尾页");
            }
        }
 
        async function nextPage(){
            $('.page.next').click();
            console.log("*翻页");
            await sleep(5000);
        }
 
        async function exeOp(){
            let allItems = $All('[action-type="feed_list_item"]');
            console.log("#本页共"+allItems.length+"条微博");
            for(let i=0;i<allItems.length;i++){
                let item = allItems[i];
                let content = item.querySelector('[node-type="feed_list_content"]').innerText;
                let wdate = item.querySelector(".S_txt2 > a").getAttribute("title").split(" ")[0]
 
                if(content.indexOf(keyWord)!=-1 && dateComp(wdate,dateFrom)>=0 && dateComp(wdate,dateTo)<=0){
                    item.querySelector('a[action-type="fl_menu"]').click();
                    await sleep(500);
                    if(exeSelect==-1){
                        console.log(wdate);
                        // if(dateComp(wdate,dateFrom)>=0 && dateComp(wdate,dateTo)<=0){
                        //     item.style.color = "blue";
                        // }
                        // item.remove();
                    }else if (exeSelect == 1 && item.getAttribute("action-data") == "cur_visible=0") { // 设为仅个人可见
                        let btntemp = item.querySelector('a[action-type="fl_personalVisible"]') || 
                                      Array.from(item.querySelectorAll('div.woo-box-flex.woo-box-alignCenter.woo-pop-item-main'))
                                          .find(el => el.textContent.includes("转换为自己可见"));
                    
                        if (btntemp) {
                            btntemp.click(); // 点击“设为仅个人可见”
                            await sleep(500);
                    
                            // 点击确认按钮
                            const confirmButton = item.querySelector('a[action-type="ok"]');
                            if (confirmButton) {
                                confirmButton.click();
                                await sleep(intervalTime);
                                console.log("*尝试隐藏" + i);
                            } else {
                                console.error("未找到确认按钮");
                            }
                        } else {
                            console.error("未找到设为仅个人可见的按钮");
                        }
                    }else if(exeSelect==0){ //删除微博
                        const delBtn = item.querySelector('a[action-type="feed_list_delete"]');
                        if(delBtn != null){
                            delBtn.click();
                            await sleep(500);
                            item.querySelector('a[action-type="ok"]').click();
                            await sleep(intervalTime);
                            console.log("*尝试删除"+i);
                        }else{
                            notComp = 1;
                        }
                    }else if(exeSelect==2){ //取消快转
                        const unFastBtn = item.querySelector('a[action-type="feed_list_delete_fast_reported"]');
                        if (unFastBtn != null){
                            unFastBtn.click();
                            await sleep(intervalTime);
                            console.log("*尝试取消快转"+i);
                        }else{
                            notComp = 1;
                        }
                    }
 
                    // 操作失败，否则成功
                    if($('[action-type="ok"]')){
                        if($('[node-type="text"]').innerText.indexOf("繁忙")!=-1 && failCnt<=failThreshold){
                            failCnt++;
                            console.log("#系统繁忙，3s后进行第"+(failCnt+1)+"次尝试"+i);
                            i--;
                            await sleep(3000);
                        }else{
                            failCnt = 0
                            allFailCnt++;
                            console.log("#操作失败"+i)  //打印失败原因
                        }
                        $('[action-type="ok"]').click();
                    }else{
                        if(notComp == 1){
                            notComp = 0;
                        }else{
                            allSucCnt++;
                            episodeSucCnt++;
                            console.log("#操作成功"+i);
                        }
                    }
                }
            }
        }
 
        async function mainLoop(){
            while(1){
                await scanPage();
                await exeOp();
                // await sleep(1000*15);
                if(endFlag) break;
                await nextPage();
            }
            alert("操作执行完毕\n共匹配符合条件微博："+(allSucCnt+allFailCnt)+"条\n其中，操作成功"+allSucCnt+"条，失败"+allFailCnt+"条")
            console.log("#结束")
        }
 
        async function scrollPage(){
            while(scrollCnt < 2){
                scrollBy(0, 2000);
                scrollCnt++;
                console.log("*下滑"+scrollCnt)
                await sleep(1000);
            }
            scrollCnt = 0;
        }
 
        async function exeOpNew(item,i){
            let content = item.querySelector(".detail_wbtext_4CRf9").innerText;
            let wdate = item.querySelector(".head-info_time_6sFQg").getAttribute("title").split(" ")[0]
 
            if(content.indexOf(keyWord)!=-1 && dateComp(wdate,dateFrom)>=0 && dateComp(wdate,dateTo)<=0){
                // item.querySelector('.woo-pop-ctrl > div >i').click();
                // await sleep(500);
                if(exeSelect==-1){
                    console.log(wdate);
                    if(dateComp(wdate,dateFrom)>=0 && dateComp(wdate,dateTo)<=0){
                        item.style.color = "blue";
                    }
                    // item.remove();
                    await sleep(intervalTime);
                }else if (exeSelect == 1 && item.querySelector('.title_wrap_3e__u') == null && item.querySelector('.head_fastbehind_1StRl') == null) { // 设为仅个人可见
                    const ctrlButton = item.querySelector('.woo-pop-ctrl > div > i');
                    if (ctrlButton) {
                        ctrlButton.click(); // 点击弹出菜单
                        await sleep(800);
                
                        // 尝试找到“转换为自己可见”按钮
                        const options = Array.from(item.querySelectorAll('div.woo-pop-wrap-main > div')).slice(-4); // 检索最后几个菜单项
                        const targetButton = options.find(option => option.innerText.trim() === '转换为自己可见');
                
                        if (targetButton) {
                            targetButton.click(); // 点击“转换为自己可见”
                            console.log(`*成功找到并点击隐藏按钮 ${i}`);
                        } else {
                            console.log(`*未找到隐藏按钮 ${i}`);
                        }
                    } else {
                        console.log(`*未找到弹出菜单按钮 ${i}`);
                    }
                
                    await sleep(intervalTime);
                }
                else if (exeSelect == 0 && item.querySelector('.head_fastbehind_1StRl') == null) { // 删除微博
                    const ctrlButton = item.querySelector('.woo-pop-ctrl > div > i');
                    if (ctrlButton) {
                        ctrlButton.click(); // 点击弹出菜单
                        await sleep(800);
                
                        // 动态查找“删除”按钮
                        const options = Array.from(item.querySelectorAll('div.woo-pop-wrap-main > div')).slice(-3); // 检索最后三个菜单项
                        const delBtn = options.find(option => option.innerText.trim() === '删除');
                
                        if (delBtn) {
                            delBtn.click(); // 点击“删除”按钮
                            await sleep(500);
                
                            // 点击确认删除的按钮
                            const confirmButton = document.querySelectorAll(".woo-button-round.woo-dialog-btn")[1];
                            if (confirmButton) {
                                confirmButton.click();
                                await sleep(intervalTime);
                                console.log(`*尝试删除微博 ${i}`);
                            } else {
                                console.error(`*未找到确认删除按钮 ${i}`);
                            }
                        } else {
                            console.log(`*未找到删除按钮 ${i}`);
                            notComp = 1;
                        }
                    } else {
                        console.log(`*未找到弹出菜单按钮 ${i}`);
                        notComp = 1;
                    }
                }                
                else if (exeSelect == 2 && item.querySelector('.head_fastbehind_1StRl') != null) { // 取消快转
                    const ctrlButton = item.querySelector('.woo-pop-ctrl > div > i');
                    if (ctrlButton) {
                        ctrlButton.click(); // 点击弹出菜单
                        await sleep(800);
                
                        // 动态查找“取消快转”按钮
                        const options = Array.from(item.querySelectorAll('div.woo-pop-wrap-main > div')).slice(-3); // 检索最后三个菜单项
                        const unFastBtn = options.find(option => option.innerText.trim() === '取消快转');
                
                        if (unFastBtn) {
                            unFastBtn.click(); // 点击“取消快转”按钮
                            await sleep(500);
                
                            // 点击确认按钮
                            const confirmButton = document.querySelectorAll(".woo-button-round.woo-dialog-btn")[1];
                            if (confirmButton) {
                                confirmButton.click();
                                await sleep(intervalTime);
                                console.log(`*尝试取消快转 ${i}`);
                            } else {
                                console.error(`*未找到确认取消快转按钮 ${i}`);
                            }
                        } else {
                            console.error(`*未找到取消快转按钮 ${i}`);
                            notComp = 1;
                        }
                    } else {
                        console.error(`*未找到弹出菜单按钮 ${i}`);
                        notComp = 1;
                    }
                }
                else if (exeSelect == 3 && item.querySelector('.title_wrap_3e__u') == null && item.querySelector('.head_fastbehind_1StRl') == null) { // 设为仅粉丝可见
                    const ctrlButton = item.querySelector('.woo-pop-ctrl > div > i');
                    if (ctrlButton) {
                        ctrlButton.click(); // 点击弹出菜单
                        await sleep(800);
                
                        // 尝试找到“转换为自己可见”按钮
                        const options = Array.from(item.querySelectorAll('div.woo-pop-wrap-main > div')).slice(-4); // 检索最后几个菜单项
                        const targetButton = options.find(option => option.innerText.trim() === '转换为粉丝可见');
                
                        if (targetButton) {
                            targetButton.click(); // 点击“转换为粉丝可见”
                            console.log(`*成功找到并点击隐藏按钮 ${i}`);
                        } else {
                            console.log(`*未找到隐藏按钮 ${i}`);
                        }
                    } else {
                        console.log(`*未找到弹出菜单按钮 ${i}`);
                    }
                
                    await sleep(intervalTime);
                }
                else if (exeSelect == 4 && item.querySelector('.title_wrap_3e__u') == null && item.querySelector('.head_fastbehind_1StRl') == null) { // 设为仅好友圈可见
                    const ctrlButton = item.querySelector('.woo-pop-ctrl > div > i');
                    if (ctrlButton) {
                        ctrlButton.click(); // 点击弹出菜单
                        await sleep(800);
                
                        // 尝试找到“转换为自己可见”按钮
                        const options = Array.from(item.querySelectorAll('div.woo-pop-wrap-main > div')).slice(-4); // 检索最后几个菜单项
                        const targetButton = options.find(option => option.innerText.trim() === '转换为好友圈可见');
                
                        if (targetButton) {
                            targetButton.click(); // 点击“转换为好友圈可见”
                            console.log(`*成功找到并点击隐藏按钮 ${i}`);
                        } else {
                            console.log(`*未找到隐藏按钮 ${i}`);
                        }
                    } else {
                        console.log(`*未找到弹出菜单按钮 ${i}`);
                    }
                
                    await sleep(intervalTime);
                }
                else{
                    allSucCnt--;
                    episodeSucCnt--;
                }
 
                // 操作失败，否则成功
                if($('[action-type="ok"]')){
                    if($('[node-type="text"]').innerText.indexOf("繁忙")!=-1 && failCnt<=failThreshold){
                        failCnt++;
                        console.log("#系统繁忙，3s后进行第"+(failCnt+1)+"次尝试"+i);
                        i--;
                        await sleep(3000);
                    }else{
                        failCnt = 0
                        allFailCnt++;
                        console.log("#操作失败"+i)  //打印失败原因
                    }
                    $('[action-type="ok"]').click();
                }else{
                    if(notComp == 1){
                        notComp = 0;
                    }else{
                        allSucCnt++;
                        episodeSucCnt++;
                        console.log("#操作成功"+i);
                    }
                }
            }
        }
 
 
 
        async function mainLoopNew(){
            await sleep(1500);
 
            while(!endFlag){
                episodeSucCnt = 0;
                // 获取微博
                let allItems = $All('.vue-recycle-scroller__item-view');
 
                for(let i=0; i<allItems.length; i++){
                    await exeOpNew(allItems[i],i);
                }
 
                // 判断结尾
                if($('.Bottom_text_1kFLe')!=null){
                    endFlag = 1;
                    console.log("#尾页");
                }
 
                // 没有可操作的任务再下滑
                if(episodeSucCnt==0){
                    await scrollPage();
                }
            }
 
            alert("操作执行完毕\n共匹配符合条件微博："+(allSucCnt+allFailCnt)+"条\n其中，操作成功"+allSucCnt+"条，失败"+allFailCnt+"条")
            console.log("#结束")
			showDonate();   // ← 新增这一行
        }
 
        function setUp(){
            exeSelect = -1;
            keyWord;
            dateFrom = "2018-11-15";
            dateTo = "2018-11-15";
            while(1){
                versionSel = prompt("请输入当前微博类型（输入数字）\n【0】旧版微博(已弃用！)\n【1】新版微博")
                if(versionSel=="0" || versionSel=="1" ) break;
                alert("请按提示操作")
            }
            while(1){
                exeSelect = prompt("请输入操作类型（输入数字）\n【0】删除微博（不可恢复，谨慎操作！）\n【1】隐藏微博（设为仅个人可见，推荐）\n【2】取消快转\n【3】仅粉丝可见\n【4】仅好友圈可见")
                if(exeSelect=="0" || exeSelect=="1" || exeSelect=="2" || exeSelect=="3" || exeSelect=="4"|| exeSelect=="-1") break;
                alert("请按提示操作")
            }
            keyWord = prompt("请输入要操作微博的关键字。\n【默认不填为全匹配】\n(功能弃用！建议使用微博自带搜索)");
            while(1){
                dateFrom = prompt("请输入要操作微博的发布日期时间段的【开始日期】（包括当日）。\n【请按格式填写，例：2021-2-29】\n【默认不填为全匹配】\n(功能弃用！建议使用微博自带搜索)");
                if (dateFrom == "") dateFrom = "0000-1-1";
                dateTo = prompt("请输入要操作微博的发布日期时间段的【截至日期】（包括当日）。(建议使用微博自带搜索)\n【请按格式填写，例：2021-2-29】\n【默认不填为全匹配】\n(功能弃用！建议使用微博自带搜索)")
                if (dateTo == "") dateTo = "9999-12-31";
                if(isDatePart(dateFrom) && isDatePart(dateTo) && dateComp(dateFrom,dateTo)<=0) break;
                alert("错误，请重新输入：\n1.请检查开始日期是否小于或等于截止日期\n2.请检查日期格式是否正确")
            }
            // inTim = prompt("设置两次操作间隙时间（单位：秒）\n【间隔过短容易被服务器检测异常，推荐1.5秒】【不填默认为1.5秒】")
        }
        // 创建一个按钮元素
        var button = document.createElement("button");
        button.innerHTML = "🚀 开始程序";
        button.style.position = "fixed";
        button.style.bottom = "20px"; // 距离底部的距离
        button.style.left = "20px"; // 距离左侧的距离
        button.style.zIndex = "9999"; // 确保按钮在最顶层
 
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#3498db";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.fontFamily = "Arial, sans-serif";
        button.style.fontSize = "14px";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
 
 
 
        // 将按钮添加到页面中
        document.body.appendChild(button);
 
        function startBtn(){
            //开始
            var w = confirm("欢迎使用微博删除助手，单击“确认”开始配置删除设置，单击“取消”退出");
            if (w === true) {
                setUp();
                var exeStr = "";
                var verStr = "";
                if(exeSelect=="0"){
                    exeStr = "删除微博"
                }else if(exeSelect=="1"){
                    exeStr = "隐藏微博"
                }else if(exeSelect=="2"){
                    exeStr = "取消快转"
                }else if(exeSelect=="3"){
                    exeStr = "仅粉丝可见"
                }else if(exeSelect=="4"){
                    exeStr = "仅好友圈可见"
                }else{
                    exeStr = "测试"
                }
                if (versionSel=="0"){
                    verStr = "旧版微博";
                }else{
                    verStr = "新版微博";
                }
                var c = confirm("配置完毕。\n【微博版本】："+verStr+"\n【操作类型】："+exeStr+"\n【微博内容包括】："+keyWord+"\n【微博发布日期】：从 "+dateFrom+"(包括) 至 "+dateTo+"(包括) \n单击”确认“开始")
                if(c===true){
                    if (versionSel=="0"){
                        mainLoop();
                    }else{
                        mainLoopNew();
                    }
                }
            }
        }
 
        // 为按钮添加点击事件监听器
        button.addEventListener("click", startBtn);
    };
})();