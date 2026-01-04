// ==UserScript==
// @name        空间密码修改工具
// @namespace   http://tampermonkey.net/
// @match       https://gzseduyun.cn/*
// @version     2023.8
// @author      Hzane
// @description 辅助修改初始密码工具
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @require      https://greasyfork.org/scripts/444783-xlsx-full-min/code/xlsxfullmin.js?version=1048986
// @require      https://greasyfork.org/scripts/444781-import-file/code/import_file.js?version=1052250
// @license      GPL-3.0
// @require      https://update.greasyfork.org/scripts/499192/1402326/jquery_360.js
// @require      https://update.greasyfork.org/scripts/507434/1443765/toastrminjs.js
// @resource css https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css
// @grant        GM_getResourceText

// @downloadURL https://update.greasyfork.org/scripts/507444/%E7%A9%BA%E9%97%B4%E5%AF%86%E7%A0%81%E4%BF%AE%E6%94%B9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/507444/%E7%A9%BA%E9%97%B4%E5%AF%86%E7%A0%81%E4%BF%AE%E6%94%B9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

var study_css = ".file {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 20px;right: -5px;top: -5px;}.file:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.file input {position: absolute;font-size: 100px;right: 0;top: 0;opacity: 0;line-height: 100%;text-align: center}.btn {position: relative;display: inline-block;background: #D0EEFF;border: 1px solid #99D3F5;border-radius: 4px;padding: 4px 5px;overflow: hidden;color: #1E88C7;text-decoration: none;text-indent: 0;line-height: 5px;right: -5px;top: -5px;}.btn:hover {background: #AADFFD;border-color: #78C3F3;color: #004974;text-decoration: none;}.egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}.egg_qrcode_box{height:218px;width:218px;position: fixed;top: 400px;left: 5px;padding: 10px;border-radius: 10px;background-color: #fff;box-shadow: 0 0 9px #666777;}.egg_qrcode_title{padding: 5px 0 12px 0;font-size: 18px;text-align: center;color: #d90609;font-weight: bold;letter-spacing: 2px;}.egg_tip{position: fixed;z-index: 999;top: 5px;left: calc(50% - 120px);padding: 0px 20px; line-height: 44px;text-align: center; width: 200px; height: 44px;font-size: 18px;}.egg_tip_success{color: #67c23a; background-color: #f0f9eb;}.egg_tip_warning{color: #E6A23C; background-color: #fdf6ec;}.egg_tip_danger{color: #d90609; background-color: #fef0f0;}.egg_tip_info{color: #909399; background-color: #edf2fc;}";
GM_addStyle(study_css);
//配置
var settings = [];
var ZHtemp = '';
var MMtemp = '';
var jsonData;
var len;
//var pdshifouwancheng = '0';


function closeWin() {
    try {
        window.opener = window;
        var win = window.open("", "_self");
        win.close();
        top.close();
    } catch (e) {
    }

}



//点击账号登录
function drzh() { // 定义名为 drzh 的函数
    jsonData = JSON.parse(GM_getValue('zhPass')); // 获取名为 'zhPass' 的本地存储并将其解析为 JSON 格式的数据，赋值给 jsonData 变量
    len = jsonData.length; // 获取 jsonData 数组的长度，赋值给 len 变量
    console.log(jsonData); // 将 jsonData 打印到控制台中
    var localUrl = window.location.href; // 获取当前页面的 URL，赋值给 localUrl 变量
    if (localUrl == "https://gzseduyun.cn/login") { // 如果当前页面的 URL 是网站的首页，则执行以下代码块
        function writeZH() { // 定义名为 writeZH 的函数
            //document.getElementById('account').setAttribute('value', ZHtemp); // 将 ZHtemp 的值写入账号输入框的 value 属性中
            //document.getElementById('account').value = ZHtemp; // 将 ZHtemp 的值写入账号输入框中
            document.querySelector("#username").setAttribute('value', ZHtemp);
            document.querySelector("#username").value = ZHtemp;
            console.log(ZHtemp); // 将 ZHtemp 打印到控制台中
        };
        function writeMM() { // 定义名为 writeMM 的函数
            console.log(MMtemp); // 将 MMtemp 打印到控制台中
            //document.getElementById('password').setAttribute('value', MMtemp); // 将 MMtemp 的值写入密码输入框的 value 属性中
            //document.getElementById('password').value = MMtemp; // 将 MMtemp 的值写入密码输入框中
            document.querySelector("#password").setAttribute('value', MMtemp);
            document.querySelector("#password").value = MMtemp;
        };

        function ddyzm() {
            var verificationInput = document.querySelector("#verification");
            var confirmButton = document.querySelector("#loginBtn");

            verificationInput.addEventListener("input", function () {
                if (verificationInput.value.length === 4) {
                    confirmButton.click();
                }
            });

        };

        for (var i = 0; i < len; i++) { // 循环 jsonData 数组，从中获取账号和密码信息
            if (!jsonData[i]['成绩'] || jsonData[i]['成绩'] == ' ') { // 如果当前学生没有完成知识竞赛，则执行以下代码块
                ZHtemp = jsonData[i]['账号']; // 获取当前学生的账号信息，赋值给 ZHtemp 变量
                MMtemp = jsonData[i]['密码']; // 获取当前学生的密码信息，赋值给 MMtemp 变量
                GM_setValue('MMtemp1', MMtemp);
                break; // 跳出循环
            }
        };
        //alert(GM_getValue('zhanghaoleixing'));
        // 在页面加载完成后执行点击操作
        if (GM_getValue('zhanghaoleixing') == "学生") {
            window.addEventListener('load', function () {
                var button = document.querySelector("body > div.login_container > form > div > ul > li:nth-child(3)");
                if (button) {
                    button.click();
                }
            });
        } else if (GM_getValue('zhanghaoleixing') == "教师") {
            window.addEventListener('load', function () {
                var button = document.querySelector("body > div.login_container > form > div > ul > li:nth-child(1)");
                if (button) {
                    button.click();
                }
            });
        } else if (GM_getValue('zhanghaoleixing') == "家长") {
            window.addEventListener('load', function () {
                var button = document.querySelector("body > div.login_container > form > div > ul > li:nth-child(2)");
                if (button) {
                    button.click();
                }
            });
        };


        if (i == len) { // 如果所有学生都已完成知识竞赛，则执行以下代码块
            alert("所有账号已操作完毕！"); // 弹出提示框，提示所有学生已完成知识竞赛
            //pdshifouwancheng = "2";
            GM_setValue('pdshifouwancheng', '2');
            GM_deleteValue("zhPass"); // 删除名为 'zhPass' 的本地存储
        } else if (0 < i < len) {
            //pdshifouwancheng = "1";
            GM_setValue('pdshifouwancheng', '1');
        };
        document.onclick = function () { // 当点击页面上的元素时触发以下代码块
            if (event.srcElement.getAttribute('id') == 'username') { // 如果点击的元素是账号输入框，则执行以下代码块
                writeZH(); // 调用 writeZH 函数，将 ZHtemp 的值写入账号输入框中
            } else if (event.srcElement.getAttribute('id') == 'password') { // 如果点击的元素是密码输入框，则执行以下代码块
                writeMM(); // 调用 writeMM 函数，将 MMtemp 的值写入密码输入框中
            } else if (event.srcElement.getAttribute('id') == 'verification') { // 如果点击的元素是提交按钮，则执行以下代码块
                ddyzm()
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

                var saveSettingbtn = document.querySelector("#saveSetting");
                //添加事件监听
                try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
                    saveSettingbtn.addEventListener("click", saveSetting, false);
                } catch (e) {
                    try {// IE8.0及其以下版本
                        saveSettingbtn.attachEvent('onclick', saveSetting);
                    } catch (e) {// 早期浏览器
                        console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
                    }
                };


                //判断账号类型
                const selectElement = document.querySelector('.egg_setting_select');
                selectElement.value = GM_getValue('zhanghaoleixing');
                selectElement.addEventListener('change', function (event) {
                    const selectedValue = event.target.value;

                    if (selectedValue == '学生') {
                        // 执行程序1
                        //zhanghaoleixing="学生"
                        GM_setValue('zhanghaoleixing', '学生');
                        console.log('账号类型:学生');

                    } else if (selectedValue == '教师') {
                        // 执行程序2
                        //zhanghaoleixing="教师"
                        GM_setValue('zhanghaoleixing', '教师');
                        console.log('账号类型:教师');

                    } else if (selectedValue == '家长') {
                        // 执行程序3
                        //zhanghaoleixing='家长'
                        GM_setValue('zhanghaoleixing', '家长');
                        console.log('账号类型:家长');

                    }
                });

                //判断完成情况
                if (GM_getValue('pdshifouwancheng') == "1") {
                    let startButton = document.getElementById("startButton");
                    startButton.innerText = "正在操作";
                    startButton.style.cursor = "default";
                    startButton.setAttribute("disabled", true);
                    var element = document.querySelector("#head_ul > li.drap-menu.nologin > p > a");//点击主页登录按钮
                    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                    let timer = setInterval(() => {//等待二级菜单元素加载完，才执行点击按钮
                        let element = document.querySelector("#head_ul > li.drap-menu.nologin > ul > li:nth-child(1) > a");//点击悬浮登录按钮
                        if (element) {
                            clearInterval(timer)
                            element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        };
                    }, 100);
                }
            }
        }, 800);
    } else if (url.indexOf("https://gzseduyun.cn/etspace/recovery/newPassword?login_name=") != -1) {//改密码页面,注意前面网址包含用户账号


        // 获取密码框元素
        var password1 = document.querySelector("body > div.infofg > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=password]");
        var password2 = document.querySelector("body > div.infofg > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=password]");

        // 模拟用户输入值
        var event = new Event('input', { bubbles: true });
        password1.setAttribute('value', GM_getValue('MMtemp1'));
        password1.dispatchEvent(event);

        password2.setAttribute('value', GM_getValue('MMtemp1'));
        password2.dispatchEvent(event);

        // 点击按钮
        var button = document.querySelector("body > div.infofg > center > button");
        button.click();
        document.onclick = function () { // 当点击页面上的元素时触发以下代码块
            if (event.srcElement.getAttribute('name') == 'pwd') { // 如果点击的元素是密码输入框，则执行以下代码块
                // 将 MMtemp 的值写入密码输入框中
                document.querySelector("body > div.infofg > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=password]").setAttribute('value', GM_getValue('MMtemp1'));
                document.querySelector("body > div.infofg > table > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=password]").value = GM_getValue('MMtemp1');
                console.log(GM_getValue('MMtemp1')); // 将 MMtemp 打印到控制台中
            } else if (event.srcElement.getAttribute('name') == 'surepwd') { // 如果点击的元素是再次输入密码输入框，则执行以下代码块
                // 将 MMtemp 的值写入再次输入密码输入框中
                document.querySelector("body > div.infofg > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=password]").setAttribute('value', GM_getValue('MMtemp1'));
                document.querySelector("body > div.infofg > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=password]").value = GM_getValue('MMtemp1');
                console.log(GM_getValue('MMtemp1')); // 将 MMtemp 打印到控制台中
            } else if (event.srcElement.getAttribute('class') == 'sub') { // 如果点击的元素是提交确定按钮，则执行以下代码块
                console.log("修改提交"); // 将 修改提交 打印到控制台中
            }
        };
        //将网页重定向到个人主页
        location.href = "https://gzseduyun.cn/login";
    } else if (url.indexOf("login") != -1) {
        //初始化点击登录
        drzh();
    } else if (url == "https://gzseduyun.cn/prompt.eula/index") {//用户须知页面
        //document.querySelector("body > div > div.cont > div.sub > p.txt > input[type=checkbox]").click;//记得判断是否已经选中
        //document.querySelector("body > div > div.cont > div.sub > p.btn > input").click;//已经选中时的确定按钮class="on"
        //document.querySelector("body > div > div.cont > div.sub > p.btn > input[type=button]").click;//没选中时的确定按钮class
        // 获取选择框元素
        var checkbox = document.querySelector("body > div > div.cont > div.sub > p.txt > input[type=checkbox]");

        // 判断选择框是否被选中
        if (checkbox.checked) {//选择框被选中
            console.log("选择框已被选中");
            var button = document.querySelector("body > div > div.cont > div.sub > p.btn > input");
            if (button) {
                button.click();
            };
        } else {//选择框未选中
            console.log("选择框未被选中");
            var button1 = document.querySelector("body > div > div.cont > div.sub > p.txt > input[type=checkbox]");//查找选择框
            var button = document.querySelector("body > div > div.cont > div.sub > p.btn > input");//查找确定按钮
            if (button1) {
                button1.click();
            }
            if (button) {
                button.click();
            }
        }


    } else if (url == "https://gzseduyun.cn/ucenter") {//改密码的账号主页
        //document.querySelector("#account_data > a").click;//点击个人主页触摸头像按钮
        //document.querySelector("#logoutBtn").click;//点击退出按钮
        var element = document.querySelector("#account_data > a");//点击悬浮头像按钮
        element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        let timer = setInterval(() => {//等待二级菜单元素加载完，才执行点击按钮
            let element = document.querySelector("#logoutBtn");//点击悬浮退出按钮
            if (element) {
                clearInterval(timer)
                element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            };
        }, 100);
    } else if (url == GM_getValue("zuoyeUrl")) {

    } else if (url == GM_getValue("kejianUrl")) {

    }
});

//判断两次密码输入是否一致
function panduanmimashifouyizhi() {
    // 创建一个MutationObserver对象来监视DOM树的变化
    const observer = new MutationObserver(function (mutationsList) {
        for (let mutation of mutationsList) {
            // 检查是否有新增的子节点，并且节点类型为文本节点
            if (mutation.addedNodes.length && mutation.addedNodes[0].nodeType === Node.TEXT_NODE) {
                const text = mutation.addedNodes[0].textContent.trim();
                // 判断文本内容是否为alert弹窗的内容
                if (text.startsWith("新密码设置成功,请使用新密码登陆")) {
                    // 点击确定按钮
                    window.alert = function () { };
                    break;
                } else {
                    //刷新页面
                    shuaxin();
                    // 点击确定按钮
                    window.alert = function () { };
                    break;
                }
            }
        }
    });

    // 启动MutationObserver对象
    observer.observe(document.body, { childList: true, subtree: true });

    function shuaxin() {
        // 刷新当前网页
        function refreshPage() {
            location.reload();
        }
        // 在页面加载完成后调用刷新函数
        window.addEventListener('load', refreshPage);
    }
};

//等待窗口关闭
function waitingClose(newPage) {
    return new Promise(resolve => {
        let doing = setInterval(function () {
            if (newPage.closed) {
                clearInterval(doing);//停止定时器
                resolve('done');
            }
        }, 1000);
    });
}


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
    baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\" ><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label><B>①</B>下载模板</label><button class=\"file\" id=\"DL_btn\" name=\"0\" style=\"width: 44px;\"\/>下载<\/button><a href=\"\" download=\"账号密码模板.xlsx\" id=\"hf\" style=\"display: none;\"><\/a><\/div><div class=\"egg_setting_item\"><label><B>②<\/B>导入账号<\/label><a href=\"javascript:;\" class=\"file\">导入<input  type=\"file\" id=\"DR_btn\" name=\"1\" \/><\/a><\/div><div class=\"egg_setting_item\"><label>账号类型<\/label><select class=\"egg_setting_select\" name=\"2\"><option value=\"教师\" ${settings[2] === '教师' ? 'selected' : ''}>教师<\/option><option value=\"家长\" ${settings[3] === '家长' ? 'selected' : ''}>家长<\/option><option value=\"学生\" ${settings[4] === '学生' ? 'selected' : ''}>学生<\/option><\/select><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"><label>运行隐藏<\/label><input class=\"egg_setting_switch\" type=\"checkbox\" name=\"7\" ${settings[7] ? 'checked' : ''}><\/div><div id='saveSetting' style=\"color:#d90609;border: solid 2px;justify-content: center;align-items: center;border-radius: 20px;cursor: pointer;margin: 12px 0;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">保存配置<\/label><\/div><a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https:\/\/docs.qq.com\/doc\/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
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
function showTip(title, type = "success", time = 1000) {
    let tipBox = document.createElement("div");
    let baseInfo = "";
    if (type == null) {
        type = "success";
    }
    baseInfo += "<div class='egg_tip egg_tip_" + type + "'>" + title + "</div>";
    tipBox.innerHTML = baseInfo;
    let body = document.getElementsByClassName("header-menu")[0];
    body.append(tipBox);
    if (time == null) {
        time = 1000;
    }
    //经过一定时间后，取消显示提示
    setTimeout(function () {
        tipBox.remove();
    }, time);
}


//保存配置
function saveSetting() {
    // 获取表单元素
    let form = document.getElementById("settingData");
    // 创建 FormData 对象，将表单数据存储到 formData 中
    let formData = new FormData(form);
    // 根据表单数据更新 settings 数组中的值
    settings[0] = (formData.get('0') != null); // 下载模板
    settings[1] = (formData.get('1') != null); // 导入账号
    settings[2] = (formData.get('2') != null); // 教师账号
    settings[3] = (formData.get('3') != null); // 家长账号
    settings[4] = (formData.get('4') != null); // 学生账号
    settings[7] = (formData.get('7') != null); // //运行时是否要隐藏
    // 在控制台输出日志
    console.log("保存配置");
    // 使用 GM_setValue 函数将 settings 数组以 JSON 格式保存到浏览器的存储空间中
    GM_setValue('studySetting', JSON.stringify(settings));
    // 调用 showTip 函数，提示用户保存成功
    showTip("保存成功");
}

//是否显示目录
function showMenu(isShow = true) {
    let items = document.getElementsByClassName("egg_menu");
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = isShow ? "block" : "none";
    }
}



//开始
async function start() {
    //保存配置
    console.log("初始化...")
    saveSetting();
    if (GM_getValue('zhPass')) {
        GM_setValue('pdshifouwancheng', '1');
        let loggedBox = document.querySelector("li.drap-menu.login");//获取文档中 class="drap-menu login" 的元素
        console.log("检查是否登录...")
        let startButton = document.getElementById("startButton");
        startButton.innerText = "正在学习";
        startButton.style.cursor = "default";
        startButton.setAttribute("disabled", true);
        if (settings[7]) {
            showMenu(false);
        };

        //账号类型保存
        const selectElement = document.querySelector('.egg_setting_select');
        const selectedValue = selectElement.value;

        if (selectedValue == '学生') {
            // 执行程序1
            //zhanghaoleixing="学生"
            GM_setValue('zhanghaoleixing', '学生');
            console.log('账号类型:学生');

        } else if (selectedValue == '教师') {
            // 执行程序2
            //zhanghaoleixing="教师"
            GM_setValue('zhanghaoleixing', '教师');
            console.log('账号类型:教师');

        } else if (selectedValue == '家长') {
            // 执行程序3
            //zhanghaoleixing='家长'
            GM_setValue('zhanghaoleixing', '家长');
            console.log('账号类型:家长');

        };


        if (loggedBox) {//登录则执行
            var element = document.querySelector("#head_ul > li.drap-menu.login > p");//点击悬浮头像按钮
            element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            let timer = setInterval(() => {//等待二级菜单元素加载完，才执行点击按钮
                let element = document.querySelector("#head_ul > li.drap-menu.login > ul > li:nth-child(5) > a");//点击悬浮退出按钮
                if (element) {
                    clearInterval(timer)
                    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                };
            }, 100);
            //GM_openInTab('https://gzseduyun.cn/login', { active: true, insert: true, setParent: true })

        } else {//没有登录账号的情况
            //提醒登录账号
            //alert("请先登录账号");
            //GM_openInTab('https://gzseduyun.cn/ucenter', { active: true, insert: true, setParent: true })
        };
        var element = document.querySelector("#head_ul > li.drap-menu.nologin > p > a");//点击主页登录按钮
        element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        let timer = setInterval(() => {//等待二级菜单元素加载完，才执行点击按钮
            let element = document.querySelector("#head_ul > li.drap-menu.nologin > ul > li:nth-child(1) > a");//点击悬浮登录按钮
            if (element) {
                clearInterval(timer)
                element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            };
        }, 100);
        if (pdshifouwancheng == "2") {
            console.log("已完成")
            startButton.innerText = "已完成";
            startButton.style.color = "#c7c7c7";
            if (settings[7]) {
                showMenu()
            }
        }
    } else {
        //提醒导入账号
        alert("请先导入账号");
    };
    return false;//终止事件函数
};




