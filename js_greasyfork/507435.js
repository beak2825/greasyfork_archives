// ==UserScript==
// @name        空间辅助
// @namespace   http://tampermonkey.net/
// @match       https://gzseduyun.cn/inner_mfs/saas/homepage/1001289/index.html
// @version     2023.7.9
// @author      Hzane
// @description 评论/点赞/留言/分享文章
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @require      https://greasyfork.org/scripts/444783-xlsx-full-min/code/xlsxfullmin.js?version=1048986
// @require      https://greasyfork.org/scripts/444781-import-file/code/import_file.js?version=1052250
// @license      GPL-3.0
// @require      https://update.greasyfork.org/scripts/499192/1402326/jquery_360.js
// @require      https://update.greasyfork.org/scripts/507434/1443765/toastrminjs.js
// @resource css https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css
// @grant        GM_getResourceText

// @downloadURL https://update.greasyfork.org/scripts/507435/%E7%A9%BA%E9%97%B4%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/507435/%E7%A9%BA%E9%97%B4%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

var study_css = ".file {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px;right: -5px;top: -5px;}.file:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.file input {position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;line-height: 100%;text-align: center}.btn {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 5px;right: -5px;top: -5px;}.btn:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}.egg_qrcode_box{height:218px;width:218px;position: fixed;top: 400px;left: 5px;padding: 10px;border-radius: 10px;background-color: #fff;box-shadow: 0 0 9px #666777;}.egg_qrcode_title{padding: 5px 0 12px 0;font-size: 18px;text-align: center;color: #d90609;font-weight: bold;letter-spacing: 2px;}.egg_tip{position: fixed;z-index: 999;top: 5px;left: calc(50% - 120px);padding: 0px 20px; line-height: 44px;text-align: center; width: 200px; height: 44px;font-size: 18px;}.egg_tip_success{color: #67c23a; background-color: #f0f9eb;}.egg_tip_warning{color: #E6A23C; background-color: #fdf6ec;}.egg_tip_danger{color: #d90609; background-color: #fef0f0;}.egg_tip_info{color: #909399; background-color: #edf2fc;}";
GM_addStyle(study_css);




function closeWin() {
    try {
        window.opener = window;
        var win = window.open("", "_self");
        win.close();
        top.close();
    } catch (e) {
    }

}



$(document).ready(function () {
    let url = window.location.href;
    //if (url == "https://www.xuexi.cn" || url == "https://www.xuexi.cn/" || url == "https://www.xuexi.cn/index.html") {
    if (url == "https://gzseduyun.cn/inner_mfs/saas/homepage/1001289/index.html") {
        //showTip(`欢迎使用!\n当前版本: ${version}`, 'green');
        let ready = setInterval(function () {
            if (document.getElementsByClassName("content")[0]) {
                clearInterval(ready);//停止定时器
                //初始化设置
                initSetting();
                //创建"开始学习"按钮
                createStartButton();
                //初始化点击登录
                drzh();
                var saveSettingbtn = document.querySelector("#saveSetting");
                //添加事件监听
                try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
                    saveSettingbtn.addEventListener("click",saveSetting,false);
                }catch(e){
                    try{// IE8.0及其以下版本
                        saveSettingbtn.attachEvent('onclick',saveSetting);
                    }catch(e){// 早期浏览器
                        console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
                    }
                }
            }
        }, 800);
    } else if (url == "https://gzseduyun.cn/login"){

    }
});


//初始化配置
function initSetting(){
    try{
        let settingTemp = JSON.parse(GM_getValue('studySetting'));
        if(settingTemp != null){
            settings = settingTemp;
        }else{
            settings = [true,true,true,true,true,true,true,false];
        }
    }catch(e){
        //没有则直接初始化
        settings = [true,true,true,true,true,true,true,false];
    }
}

//创建“开始学习”按钮和配置
function createStartButton() {
    let base = document.createElement("div");
    var baseInfo = "";
    baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\" ><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label><B>①<\/B>下载模板<\/label><button class=\"file\" id=\"DL_btn\" name=\"0\" style=\"width: 44px;\"\/>下载<\/button><a href=\"\" download=\"账号密码模板.xlsx\" id=\"hf\" style=\"display: none;\"><\/a>				<\/div>				<div class=\"egg_setting_item\">					<label><B>②<\/B>导入账号<\/label>					<a href=\"javascript:;\" class=\"file\">导入<input  type=\"file\" id=\"DR_btn\" name=\"1\" \/>	<\/a>			<\/div>				<div class=\"egg_setting_item\">					<label>激活账号<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"2\" "+ (settings[2] ? 'checked': '') +"\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频+习题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"3\" " + (settings[3] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>知识竞赛<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"4\" "+ (settings[4] ? 'checked': '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\""+ (settings[7] ? 'checked': '') + "/></div><div id='saveSetting' style=\"color:#d90609;border: solid 2px;justify-content: center;align-items: center;border-radius: 20px;cursor: pointer;margin: 12px 0;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">保存配置<\/label><\/div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
    //baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\"><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label><B>①<\/B>下载模板<\/label><button class=\"btn\" id=\"DL_btn\" name=\"0\"\/>点击下载<\/button><a href=\"\" download=\"账号密码模板.xlsx\" id=\"hf\"><\/a>				<\/div>				<div class=\"egg_setting_item\">					<label><B>②<\/B>导入账号<\/label>					<a href=\"javascript:;\" class=\"file\">选择文件<input  type=\"file\" id=\"DR_btn\" name=\"1\" \/>	<\/a>			<\/div>				<div class=\"egg_setting_item\">					<label>激活账号<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"6\" " + (settings[6] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频+习题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"2\" " + (settings[2] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>知识竞赛<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"5\" " + (settings[5] ? 'checked' : '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\"" + (settings[7] ? 'checked' : '') + "/></div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
    base.innerHTML = baseInfo;
    //let body = document.getElementsByTagName("header")[0];//getElementsByTagName() 方法可返回带有指定标签名的对象的集合getElementsByClassName
    let body = document.getElementsByClassName("header-menu")[0];
    body.append(base)//append() 方法在被选元素的结尾（仍然在内部）插入指定内容//将建立的div块插入到body后面
    let startButton = document.createElement("button");//在div块中加载一个按钮
    startButton.setAttribute("id", "startButton");//setAttribute() 方法添加指定的属性，并为其赋指定的值
    startButton.innerText = "开始学习";
    startButton.className = "egg_study_btn egg_menu";
    //添加事件监听
    try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click", start, false);
    } catch (e) {
        try {// IE8.0及其以下版本
            startButton.attachEvent('onclick', start);
        } catch (e) {// 早期浏览器
            console.log("不学习何以青骄error: 开始学习按钮绑定事件失败")
        }
    }
    //插入节点
    body.append(startButton)
    DL_btn.addEventListener("click", function () { downloadExl() }, false);
    DR_btn.addEventListener('change', function () { importFile(this) }, false);

}

//显示提示
function showTip(title,type = "success",time = 1000){
    let tipBox = document.createElement("div");
    let baseInfo="";
    if(type == null){
        type = "success";
    }
    baseInfo += "<div class='egg_tip egg_tip_" + type + "'>" + title + "</div>";
    tipBox.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(tipBox);
    if(time == null){
        time = 1000;
    }
    //经过一定时间后，取消显示提示
    setTimeout(function(){
        tipBox.remove();
    },time);
}

//保存配置
function saveSetting(){
    // 获取表单元素
    let form = document.getElementById("settingData");
    // 创建 FormData 对象，将表单数据存储到 formData 中
    let formData = new FormData(form);
    // 根据表单数据更新 settings 数组中的值
    settings[0] = (formData.get('0') != null); // 下载模板
    settings[1] = (formData.get('1') != null); // 导入账号
    settings[2] = (formData.get('2') != null); // 激活账号
    settings[3] = (formData.get('3') != null); // 视频+习题
    settings[4] = (formData.get('4') != null); // 知识竞赛
    settings[7] = (formData.get('7') != null); // 运行隐藏
    // 在控制台输出日志
    console.log("保存配置");
    // 使用 GM_setValue 函数将 settings 数组以 JSON 格式保存到浏览器的存储空间中
    GM_setValue('studySetting',JSON.stringify(settings));
    // 调用 showTip 函数，提示用户保存成功
    showTip("保存成功");
}

//是否显示目录
function showMenu(isShow = true){
    let items = document.getElementsByClassName("egg_menu");
    for(let i = 0;i < items.length; i++){
        items[i].style.display = isShow ? "block":"none";
    }
}

var ZHtemp = '';
var MMtemp = '';
var jsonData;
var len;

//点击账号登录
function drzh() { // 定义名为 drzh 的函数
    jsonData = JSON.parse(GM_getValue('zhPass')); // 获取名为 'zhPass' 的本地存储并将其解析为 JSON 格式的数据，赋值给 jsonData 变量
    len = jsonData.length; // 获取 jsonData 数组的长度，赋值给 len 变量
    console.log(jsonData); // 将 jsonData 打印到控制台中
    var localUrl = window.location.href; // 获取当前页面的 URL，赋值给 localUrl 变量
    if (localUrl == "https://gzseduyun.cn/login" || url == "https://www.gzseduyun.cn/login") { // 如果当前页面的 URL 是“2课堂”网站的首页，则执行以下代码块
        function writeZH() { // 定义名为 writeZH 的函数
            document.getElementById('account').setAttribute('value', ZHtemp); // 将 ZHtemp 的值写入账号输入框的 value 属性中
            document.getElementById('account').value = ZHtemp; // 将 ZHtemp 的值写入账号输入框中
            console.log(ZHtemp); // 将 ZHtemp 打印到控制台中
        }
        function writeMM() { // 定义名为 writeMM 的函数
            console.log(MMtemp); // 将 MMtemp 打印到控制台中
            document.getElementById('password').setAttribute('value', MMtemp); // 将 MMtemp 的值写入密码输入框的 value 属性中
            document.getElementById('password').value = MMtemp; // 将 MMtemp 的值写入密码输入框中
        }
        for (var i = 0; i < len; i++) { // 循环 jsonData 数组，从中获取账号和密码信息
            if (!jsonData[i]['成绩'] || jsonData[i]['成绩'] == ' ') { // 如果当前学生没有完成知识竞赛，则执行以下代码块
                ZHtemp = jsonData[i]['账号']; // 获取当前学生的账号信息，赋值给 ZHtemp 变量
                MMtemp = jsonData[i]['密码']; // 获取当前学生的密码信息，赋值给 MMtemp 变量
                break; // 跳出循环
            }
        }
        if (i == len) { // 如果所有学生都已完成知识竞赛，则执行以下代码块
            alert("所有账号已操作完毕！"); // 弹出提示框，提示所有学生已完成知识竞赛
            GM_deleteValue("zhPass"); // 删除名为 'zhPass' 的本地存储
        }
        document.onclick = function () { // 当点击页面上的元素时触发以下代码块
            if (event.srcElement.getAttribute('id') == 'account') { // 如果点击的元素是账号输入框，则执行以下代码块
                writeZH(); // 调用 writeZH 函数，将 ZHtemp 的值写入账号输入框中
            } else if (event.srcElement.getAttribute('id') == 'password') { // 如果点击的元素是密码输入框，则执行以下代码块
                writeMM(); // 调用 writeMM 函数，将 MMtemp 的值写入密码输入框中
            } else if (event.srcElement.getAttribute('type') == 'submit') { // 如果点击的元素是提交按钮，则执行以下代码块
                for (var i = 0; i < len; i++) { // 循环 jsonData 数组，从中获取当前学生的信息
                    if (jsonData[i]['账号'] == ZHtemp) { // 如果当前学生的账号信息与 ZHtemp 变量相同，则执行以下代码块
                        jsonData[i]['成绩'] = '100'; // 将当前学生的成绩设置为 100 分
                        GM_setValue('zhPass', JSON.stringify(jsonData)); // 将 jsonData 数组转换为 JSON 格式的字符串并存储到名为 'zhPass' 的本地存储中
                    }
                }
            }
        }
    }
}



//开始
async function start() {
    //保存配置
    console.log("初始化...")
    saveSetting();
    let loggedBox = document.querySelectorAll(".head-pic")[0];
    console.log("检查是否登录...")
    if (loggedBox) {
        let startButton = document.getElementById("startButton");
        startButton.innerText = "正在学习";
        startButton.style.cursor = "default";
        startButton.setAttribute("disabled", true);
        if (settings[7]) {
            showMenu(false);
        }
        let taskProgress = null;
        let continueToDo = true;
        let tasks = [false, false, false, false, false]
        while (continueToDo) {
            //查询今天还有什么任务没做完
            console.log("检查今天还有什么任务没做完")
            taskProgress = await getToday();
            if (taskProgress != null) {
                console.log("开始学习")


                if (tasks[0] && tasks[1] && tasks[2] && tasks[3] && tasks[4]) {
                    //如果检查都做完了，就不用继续了
                    continueToDo = false;
                }
            } else {
                alert("发生意外错误")
                continueToDo = false;
            }
            console.log("continueToDo : " + continueToDo)
        }
        console.log("已完成")
        startButton.innerText = "已完成";
        startButton.style.color = "#c7c7c7";
        if (settings[7]) {
            showMenu()
        }
    } else {
        //提醒登录
        alert("请先登录");
    }
    return false;
}

//开始
async function start() {
    //保存配置
    console.log("初始化...")
    saveSetting();
    if (GM_getValue('zhPass')) {
        let startButton = document.getElementById("startButton");
        startButton.innerText = "正在学习";
        startButton.style.cursor = "default";
        startButton.setAttribute("disabled", true);
        if (settings[7]) {
            showMenu(false);
        }
        let loggedBox = document.querySelectorAll(".head-pic")[0];//获取文档中 class="head-pic" 的所有元素，取第一个
        console.log("检查是否登录...")
        if (loggedBox) {//登录则执行
            GM_openInTab('https://www.2-class.com/admin/student_course', { active: true, insert: true, setParent: true })

        } else {
            document.querySelector('[type="submit"]').click()

        }
        xuex()

        console.log("已完成")
        startButton.innerText = "已完成";
        startButton.style.color = "#c7c7c7";
        if (settings[7]) {
            showMenu()
        }
    } else {
        //提醒导入账号
        alert("请先导入账号");
    }
    return false;//终止事件函数
}




