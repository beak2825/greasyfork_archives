// ==UserScript==
// @name        青骄课堂学习 
// @namespace   http://tampermonkey.net/
// @match       https://www.2-class.com/
// @version     2022.05
// @author      Hzane
// @description 青骄课堂辅助工具，看视频、答题
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @resource      https://gitee.com/hezane/monkey/raw/master/xlsx.full.min.js
// @resource      https://gitee.com/hezane/monkey/raw/master/import_file.js
// @downloadURL https://update.greasyfork.org/scripts/444750/%E9%9D%92%E9%AA%84%E8%AF%BE%E5%A0%82%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/444750/%E9%9D%92%E9%AA%84%E8%AF%BE%E5%A0%82%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
var study_css = ".file {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px;right: -5px;top: -5px;}.file:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.file input {position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;line-height: 100%;text-align: center}.btn {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 5px;right: -5px;top: -5px;}.btn:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);
GM_getResourceURL()

function closeWin() {
    try {
         window.opener = window;
         var win = window.open("","_self");
         win.close();
         top.close();
    } catch (e) {
        }

}

$(document).ready(function () {
    let url = window.location.href;
     //if (url == "https://www.xuexi.cn" || url == "https://www.xuexi.cn/" || url == "https://www.xuexi.cn/index.html") {
    if (url == "https://www.2-class.com" || url == "https://www.2-class.com/" || url == "https://www.2-class.com/index.html") {
        let ready = setInterval(function () {
            //if (document.getElementsByClassName("text-wrap")[0]) {  
            if (document.getElementsByClassName("web-header-box")[0]) {
                clearInterval(ready);//停止定时器
                //初始化设置
                initSetting();
                //创建"开始学习"按钮
                createStartButton();
            }
        }, 800);
    } else {
    }
});


//初始化配置
function initSetting() {
    try {
        let settingTemp = JSON.parse(GM_getValue('studySetting'));
        if (settingTemp != null) {
            settings = settingTemp;
        } else {
            settings = [true, true, true, true, true, true, true, false];
        }
    } catch (e) {
        //没有则直接初始化
        settings = [true, true, true, true, true, true, true, false];
    }
}


//创建“开始学习”按钮和配置
function createStartButton() {
    let base = document.createElement("div");
    var baseInfo = "";
    baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\"><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label><B>①<\/B>下载模板<\/label><input class=\"btn\"  type=\"button\" name=\"0\" value=\"点击下载\" " + (settings[0] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label><B>②<\/B>导入账号<\/label>					<a href=\"javascript:;\" class=\"file\">选择文件<input  type=\"file\" name=\"1\" \/>	<\/a>			<\/div>				<div class=\"egg_setting_item\">					<label>激活账号<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"6\" " + (settings[6] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频+答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"2\" " + (settings[2] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>知识竞赛<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"5\" " + (settings[5] ? 'checked' : '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\"" + (settings[7] ? 'checked' : '') + "/></div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
    //baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\"><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label>新闻<\/label><input class=\"egg_setting_switch\" type=\"checkbox\" name=\"0\" " + (settings[0] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"1\" " + (settings[1] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每日答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"6\" " + (settings[6] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每周答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"2\" " + (settings[2] ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>专项练习<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"5\" " + (settings[5] ? 'checked' : '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\"" + (settings[7] ? 'checked' : '') + "/></div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
    base.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(base)
    let startButton = document.createElement("button");
    startButton.setAttribute("id", "startButton");
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
}