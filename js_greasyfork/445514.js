// ==UserScript==
// @name         铜仁智慧党建云-自动学习
// @namespace    http://llmmoe.com/
// @version      1.10beta
// @description  批量登录学习
// @author       llmmoe
// @homepageURL  https://gitee.com/llmmoe/auto-leaning
// @supportURL   https://gitee.com/llmmoe/auto-leaning
// @license      GPL-3.0
// @copyright    2022-2022, AC
// @match        http://www.trzhdj.gov.cn/wz_index.action
// @icon         http://www.trzhdj.gov.cn/favicon.ico
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445514/%E9%93%9C%E4%BB%81%E6%99%BA%E6%85%A7%E5%85%9A%E5%BB%BA%E4%BA%91-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/445514/%E9%93%9C%E4%BB%81%E6%99%BA%E6%85%A7%E5%85%9A%E5%BB%BA%E4%BA%91-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // My code start

    /** ----------------- 脚本配置 start -------------------------*/
    // 默认密码。如果密码为空，则使用默认密码
    let defaultPassword = getCookie('defaultPassword');
    // 延迟的时间(单位:ms)
    let sleepTime = 2000;
    /** ----------------- 脚本配置 end ---------------------------*/

    /** ----------------- 界面 start ---------------------------- */
    const explain = '<h3>=== 你现在使用的是“自动学习”正式版v1.10beta ===</h3><a href="https://gitee.com/llmmoe/auto-leaning" target="_blank">查看最新说明</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://gitee.com/llmmoe/auto-leaning/raw/master/files/template.xlsx" target="_blank">账号导入模板文件(点击下载)</a>';
    const tips = `1、密码测试时，如果错误的密码过多（5次？），将会被服务器认定为恶意登录，须隔<strong>10分钟</strong>后再测试。<br />
    2、记得从<strong>excel表格中</strong>去掉已经错误的账号。<br />
    3、已经导入的账号将会保存到浏览器 Cookie 中，若修改过 Excel 表格，需要重新导入。<br />
    4、如果要中断执行，请刷新页面`;
    let username = '';// 用户真实名
    let score = '';// 用户得分
    /**
    * @class PringMsg 信息输出 UI
    */
    let PrintMsg = {
        myMsgPanel: document.createElement('div'),
        leftPanel: document.createElement('div'),
        switchButton: document.createElement('div'),
        tips: document.createElement('div'),
        content: document.createElement('div'),
        msgTitle: document.createElement('div'),
        msgPanel: document.createElement('div'),
        errorMsgPanel: document.createElement('div'),
        tools: document.createElement('div'),
        checkPasswordButton: document.createElement('button'),
        autoLearningButton: document.createElement('button'),
        testButton: document.createElement('button'),
        fileInput: document.createElement('input'),
        init: function () {
            // 定义边栏
            let style = document.createElement('style');
            let myStyle = `
#left-panel {
    position: absolute;
    border-radius: 4px;
    border: 2px solid rgb(218, 218, 218);
    top: 58px;
    left: 6px;
    overflow: auto;
    display: none;
    width: 60%;
    height:70%;
    overflow: auto;
    background-color: #fff;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: " ";
}

.clearfix:after {
    clear: both;
}

/* 开关 */
.switch-on {
    left: 60%;
}

.switch {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 72px;
    height: 50px;
    width: 22px;
    background: #fff;
}

.switch>.tips {
    left: 30px;
    top: 15px;
    position: absolute;
    width: 75px;
    background: #000;
    opacity: 0.6;
    color: #fff;
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 2px;
    text-align: center;
}

.switch-on:after {
    font-size: 0;
    height: 0;
    display: inline-block;
    line-height: 0;
    margin: 0 5px;
    width: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 4px solid #757575;
    left: 5px;
}

.switch:after {
    content: "";
    position: absolute;
    top: 20px;
}

.switch-off:after {
    font-size: 0;
    height: 0;
    display: inline-block;
    line-height: 0;
    margin: 0 5px;
    width: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid #757575;
    left: 4px;
}

#content {
    margin: auto;
    height: 75%;
}

#msgTitle {
    height: 8%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    text-shadow: 1px 1px 2px grey;
}

#msgPanel, #errorMsgPanel{
    overflow: auto;
    margin-top: 20px;
    width: 50%;
    height: 100%;
    float: left;
}

.tools {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 80px;
    clear: both;
}

.my-button {
    margin-top: 10px;
    background: Green;
}

.my-button-go {
    line-height:15px;
    height: 60px;
    width: 60px;
    -webkit-border-radius: 30px;
    background: Crimson;
}

.my-button-disabled {
    background: DarkGray;
}

#content p#error {
    color: #e60012;
}
    `;
            style.innerHTML = myStyle;
            document.head.appendChild(style);

            // 配置侧边栏
            this.myMsgPanel.id = 'my-message-panel';
            // 配置展开区域
            this.leftPanel.id = 'left-panel';
            this.myMsgPanel.appendChild(this.leftPanel);
            // 配置展开按钮
            this.switchButton.id = 'switch';
            this.switchButton.className = 'switch switch-off';
            this.switchButton.appendChild(this.tips);
            // 配置按钮提示信息
            this.tips.className = 'tips';
            this.tips.style = 'display: none;';
            this.tips.innerHTML = '开挂';
            // 配置内容面板
            this.content.id = 'content';
            this.leftPanel.appendChild(this.content);
            // 配置内容面板标题
            this.msgTitle.id = 'msgTitle';
            this.content.appendChild(this.msgTitle);
            // 配置信息面板
            this.msgPanel.id = 'msgPanel';
            this.content.appendChild(this.msgPanel);
            // 配置错误信息面板
            this.errorMsgPanel.id = 'errorMsgPanel';
            this.content.appendChild(this.errorMsgPanel);
            // 配置工具栏
            this.tools.className = "tools"
            this.leftPanel.append(this.tools);
            // 配置文件输入框
            this.fileInput.type = 'file';
            this.fileInput.accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            this.fileInput.title = '导入Excel';
            this.tools.append(this.fileInput);
            // 密码验证按钮
            this.checkPasswordButton.type = "button";
            this.checkPasswordButton.innerHTML = "验证密码";
            this.checkPasswordButton.className = 'my-button';
            this.checkPasswordButton.title = '用于验证每个用户是否能够正常登录。\n提前核对更改，防止执行时漏掉。';
            this.tools.append(this.checkPasswordButton);
            // 自动学习按钮
            this.autoLearningButton.type = "button";
            this.autoLearningButton.disabled = 'disabled';
            this.autoLearningButton.innerHTML = "开始<br />学习";
            this.autoLearningButton.className = 'my-button my-button-go my-button-disabled';
            this.autoLearningButton.title = '走起！GO！GO！GO？';
            this.tools.append(this.autoLearningButton);

            // 测试按钮
            this.testButton.type = 'button';
            this.testButton.innerHTML = '测试';
            this.tools.append(this.testButton);

            this.myMsgPanel.appendChild(this.switchButton);

            // 设置提示监听
            this.switchButton.addEventListener('mousemove', function (event) {
                PrintMsg.tips.style.display = "block";
                event.preventDefault();
            });
            this.switchButton.addEventListener('mouseout', function (event) {
                event.stopPropagation(); //阻止事件冒泡
                PrintMsg.tips.style.display = "none";
                // return false;     //阻止回调执行
                event.preventDefault(); //阻止默认行为
            });
            // 设置展开按钮监听
            this.switchButton.addEventListener('click', function (event) {
                if (this.className == "switch switch-off") {
                    PrintMsg.panelOn();
                } else {
                    PrintMsg.panelOff();
                }
                event.preventDefault();
            });

            // 设置输出框
            document.body.appendChild(this.myMsgPanel);
            // 显示欢迎信息
            this.addTitle(explain);
        },

        panelOn: function () {
            this.leftPanel.style.display = 'block';
            this.tips.innerHTML = '收起';
            this.switchButton.className = "switch switch-on"
        },

        panelOff: function () {
            this.leftPanel.style.display = 'none';
            this.tips.innerHTML = '开挂';
            this.switchButton.className = "switch switch-off"
        },

        /**
        * 添加输出信息
        * @param string msg 需要输出的信息
        * @returns
        */
        addTitle: function (msg) {
            this.msgTitle.innerHTML += msg;
            // 内容变化时，始终滚动到底部
            this.msgTitle.scrollTop = this.msgTitle.scrollHeight;
        },

        /**
        * 添加输出信息，并且换行
        * @param string msg 需要输出的信息
        * @returns
        */
        addMsg: function (msg) {
            this.msgPanel.innerHTML += '<p>' + msg + '</p>';
            // 内容变化时，始终滚动到底部
            this.msgPanel.scrollTop = this.msgPanel.scrollHeight;
        },

        /**
        * 添加错误信息，并且换行
        * @param string msg 需要输出的错误
        * @returns
        */
        addErrorMsg: function (msg) {
            this.errorMsgPanel.innerHTML += '<p id="error">' + msg + '</p>';
            // 内容变化时，始终滚动到底部
            this.errorMsgPanel.scrollTop = this.errorMsgPanel.scrollHeight;
        }
    }

    // 验证是否准备完成，调整开放按钮的顺序
    let allReadyStatus = 0 || getCookie('allReadyStatus');
    unlockingButton();
    // 从cookie获取登陆账号
    let passport = getCookie('passport');
    if(passport) {
        try{
            passport = JSON.parse(passport);
        } catch(e) {
            console.log(e);
            passport = '';
        }
    }

    // 初始化信息面板
    PrintMsg.init()
    // 界面初始化
    PrintMsg.addMsg(tips);
    let statusStr = '<span style="color:blue">-- 当前保存 ' + Object.keys(passport).length + ' 个用户\n';
    if(allReadyStatus == 1) {
        statusStr += '，且通过密码验证';
    }
    statusStr += ' --</span>' +
        '<p style="color:green">陪伴你度过了 ' + recordUsingDays() + ' 天，学习了 ' + formatNumberToString(getCookie('totalLearningCounter')) + ' 篇文章。</p><p style="color:green">祝您工作愉快、万事顺利！</p>';
    PrintMsg.addMsg(statusStr);
    /** ----------------- 界面end ------------------------------ */

    console.log('defaultPassword: ' + defaultPassword);
    console.log('Passport: ' + getCookie('passport'));

    /**
     * 监听“测试”按钮
     */
    PrintMsg.testButton.onclick = async () => {
        console.log('测试开始！');
        learningReception('2022');
    }

    /**
     * 监听“自动学习”按钮
     */
    PrintMsg.autoLearningButton.onclick = async () => {
        // 锁定 button，防止连续点击
        lockingButton();

        // 用户批量登录
        for (let userid in passport) {
            // 选择密码：如果密码为空，则使用默认密码
            let password = passport[userid] || defaultPassword;
            // 登录
            let loginStatus = await setLogin(userid, password);
            if (loginStatus == false) {
                continue;
            }

            await getBackstageList(userid);
            await getBackstageList(userid, 1);
            await logout();
        }
        PrintMsg.addMsg('学习完成！！！');

        // 解锁 button
        unlockingButton();
    }

    /**
     * 监听“密码验证”按钮
     */
    PrintMsg.checkPasswordButton.onclick = async () => {
        // 锁定 button，防止连续点击
        lockingButton();
        // 如果没用导入账号，则跳过
        if(!passport) {
            unlockingButton();
            return;
        }
        // 是否全部验证通过
        let isAllPassed = true;
        // 计数
        let count = 1;

        for (let userid in passport) {
            PrintMsg.addMsg(count++ + '、')
            // 选择密码：如果密码为空，则使用默认密码
            let password = passport[userid] || defaultPassword;
            let loginStatus = await setLogin(userid, password);
            if (loginStatus == false) {
                isAllPassed = false;
                continue;
            }
            await logout();
        }
        if (isAllPassed) {
            allReadyStatus = 1;
            setCookie('allReadyStatus', 1);
        }

        // 解锁 button
        unlockingButton();
    }

    /**
     * 从 xlsx 文件，导入账号密码
     * @param {object} e
     */
    async function handleFileAsync(e) {
        passport = {};
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        /* data is an ArrayBuffer */
        const workbook = XLSX.read(data);

        const sheetNames = workbook.SheetNames;// 工作表名称集合
        const worksheet = workbook.Sheets[sheetNames[0]];
        // 获取最大行数
        let maxRow = worksheet['!ref'];
        maxRow = maxRow.split(':');
        maxRow = maxRow[1].match(/\d+/g)[0];//选择数字

        for (let i = 2; i <= maxRow; i++) {
            let userId = worksheet['B' + i];
            let password = worksheet['C' + i]
            if(userId && userId.v && userId.v.replace(/\s/g, '')) {//去掉空白登录用户名
                passport[userId.v] = password ? password.v : '';
            }
        }
        defaultPassword = worksheet['D2'].v;
        setCookie('passport', passport);
        setCookie('defaultPassword', defaultPassword);
        let loadPassport = getCookie('passport');
        if(loadPassport && getCookie('defaultPassword')) {
            PrintMsg.addMsg(Object.keys(passport).length + '个账号，导入完成。');
        }
        setCookie('allReadyStatus', 0);
        allReadyStatus = 0;
        lockingStartButton();
    }
    // 添加导入按钮监听
    PrintMsg.fileInput.addEventListener("change", handleFileAsync, false);

    /** ----------------- 以下是自定义类和函数 -------------------- */

    /**
     * 是否准备完毕
     */
    function isAllReady(status) {
        if (status) {
            unlockingStartButton();
        } else {
            lockingStartButton();
        }
    }

    /**
     * 学习首页课程
     * @param {string} name 用户登录名
     */
    function leaningIndex(userid) {
        // 获取课程列表 a 标签
        getBxList(1).then(async tagAList => {
            for (let tagA of tagAList) {
                // 课程状态：0:未学习，1:未评价，2:已完成
                let status = 0;
                // 判断是否已经完成学习：
                // <span>[好评]</span>
                // <span><span style="color:red">[未学]</span></span>
                // <span><span style="color:red">[待评]</span></span>
                let span = tagA.querySelectorAll("span:first-of-type");
                if (span.length == 1) continue;//跳过已经完成的课程
                if (span.length == 2) {
                    if (span[1].innerHTML === "[待评]") status = 1
                }
                // 学习资料 id，用于查找学习课程
                let url = new URL(tagA.href);// 通过 url 获取参数
                let searchParams = new URLSearchParams(url.search);
                let curriculumID = searchParams.get("searchZl.id");
                let learnedID = await getLearnedID(userid, curriculumID);
                console.log(learnedID)
                if (status == 0) {
                    await completeLearning(learnedID);
                    await sleep(sleepTime);
                }
                completeEvaluate(learnedID);
                await sleep(sleepTime);
            }
        });
    }

    /**
     * @TODO 代码仍需优化，已经出现了 Out Of Memery
     * 学习个人后台管理中的当前课程
     * @param string userid 用户登录名，也许在完成评价的时候需要用get传入。2022-04-15：2415.0分
     */
    // async function leaningCurrent(userid, group = 0) {
    //     getBackstageList(group);
    // }

    /**
     * 获取当前用户“未学习”的课程列表
     * @param {int} userid 用户登录名，注意不是电话号码
     * @param {int} group group 0：必修，1：选修
     */
    function getBackstageList(userid, group = 0) {
        getCurriculumList(group).then(list => {
            let tr = list.querySelectorAll("table tbody tr");
            tr.forEach(async item => {
                // 课程状态
                let status = item.querySelector('td:last-of-type span');
                // 课程 ID
                let textID = item.querySelector("td:first-of-type").innerHTML.replace(/\s*/g, "");
                // 完成学习的会显示“笑脸”图片img，没有span标签
                if (status) {
                    status = status.innerHTML.replace(/\s*/g, "")
                    let learnedID = await getLearnedID(userid, textID);
                    if (status == '未学习') {
                        completeLearning(learnedID);
                    }
                    await sleep(sleepTime);
                    completeEvaluate(learnedID, userid);
                }
            });
        });
    }

    /**
     * 设置用户登录，为统一登录显示
     * @param {string} userid
     * @param {string} password
     * @returns {boolean}
     */
    async function setLogin(userid, password) {
        let loginStatus = await login(userid, password);
        if (loginStatus[0] == '1') {
            username = loginStatus[1];// 设置全局可用的真实姓名
            score = loginStatus[2];// 设置全局可用的用户得分
            PrintMsg.addMsg('登录成功: ' + username + ' ' + loginStatus[2] + '分');
            return true;
        } else if (loginStatus[0] == '2') {
            PrintMsg.addMsg('已登录: ' + username + ' ' + score + '分');
            return true;
        } else {
            PrintMsg.addErrorMsg('登录失败。用户名: ' + loginStatus[1] + ' 密码: ' + loginStatus[2]);
            return false;
        }
    }

    /**
     * 登录：不会重复登录。
     * 若未登录，则适用账号密码登录；若已登录，则请求接口，显示登录信息。
     * 服务器的返回信息不统一，若登录失败将只返回提示字符串。
     * 将它改为统一格式：见返回值说明。
     * @param {string} userid     用户名或者手机号
     * @param {string} password   密码
     * @return {[string]} [ string: 登录是否成功 ('0': 失败, '1': 成功:, '2': 已经登录) (将就服务器的返回值),
     *  string: 若成功则为用户的真实姓名，若失败则为登录的用户名,
     *  string: 若成功则为用户的当前分值，若失败则为登录的用户密码 ]
     */
    async function login(userid, password) {
        // 请求登录状态，若已经登录则只显示登录信息
        let loginStatus = await getCurrentUserInf();
        if (loginStatus.data) {
            // 已登录
            loginStatus = loginStatus.data.split('@@');// 分隔符也不统一，真的晕
            loginStatus[0] = '2';
        } else {
            // 登录
            let encodePw = await encodePassword(password);
            loginStatus = await loginRequest(userid, encodePw);
            loginStatus = loginStatus.data.split('_');
            // 登录失败
            if (loginStatus[0] != 'true') {
                loginStatus = ['0', userid, password];
            } else {
                loginStatus[0] = '1';
            }
        }
        return loginStatus;
    }

    /**
     * 退出登录，将直接打印文本提示
     * 服务器响应为跳转到主页
     */
    async function logout() {
        await requestGet('sys_Login_unLogin.action');
        PrintMsg.addMsg('退出登录');
    }


    /**
     * 密码加密
     * @param {string} password 原始密码
     * @return {string} 加密后的密码
     */
    async function encodePassword(password) {
        let code = await requestGet('sys_LoginAjAX_getdesStr.action');
        return getMw(password, code.data.toString());
    }


    /**
     * 发送登录请求
     * 我也是第一次遇到，返回请求状态是用字符串来判断的。
     * 为什么不用 Json ？难道他们不知道有个东西叫 Json？写得太烂了。
     * 不得不再次请求获取账号密码 @_@!!!
     * @param {string} userid         用户登录名
     * @param {string} encodePassword 加密的用户密码
     * @returns {Promise<string>} 登录成功："true_丰国强_2385.0_合格"，登录不成功："用户名或密码错误，请重试。"
     */
    function loginRequest(userid, encodePassword) {
        return requestGet('wz_AjAX_loginAJAX.action', {
            r: Math.random(),
            "currentUser.userid": userid,
            "currentUser.ps": encodePassword
        });
    }

    /**
     * 获取当前用户的账号密码，用于检测用户是否登录。
     * 真的不清楚网站为何将用户的账号密码用明码返回。
     * 登录的 session 状态？用 boolean 值就能表示。
     * @returns {Promise<string>} 成功返回字符串，否则返回 false
     */
    async function getCurrentUserInf() {
        return requestGet('wz_AjAX_checkHasloginAJAX.action', {
            r: Math.random()
        });
    }

    /**
     * 获取学习记录 id
     * 原网站用该接口获取课程状态，判断该用户是否完成了该课程。
     * 请求结果举例：
     * dyId: 174032     // 党员 id
     * pj: ""           // 评价分数： 好评：100
     * sfwc: 1          // 是否完成： 1:完成，0:未学习
     * sfwcSt: "1"      // 是否完成试题？： 1:完成， 0:未学习。完成学习后没有试题的课程会变成1
     * xxjlId: 88763083 // 学习记录 id
     * xxzlId: "940"    // 学习资料 id
     * 我主要用于获取，学习记录 id ，用于完成课程
     * @param {string} userid       用户名，**注意不是电话号码**
     * @param {string} curriculumID   课程 id
     * @return {string} 学习记录 id
     */
    async function getLearnedID(userid, curriculumID) {
        return requestGet('wz_AjAX_getDyxxInfo.action', {
            r: Math.random(),
            userid: userid,
            xxzlId: curriculumID
        }).then(docParameter => {
            // 学习记录ID
            return docParameter.data.xxjlId;
        });
    }

    /**
     * 完成学习
     * @param {string} learnedID
     */
    function completeLearning(learnedID, userid = '') {
        requestGet("wljy_jyAjAX_submitWcxx.action", {
            r: Math.random(),
            xxJlId: learnedID,
            userid: userid
        }).then(response => {
            if (response.data) {
                PrintMsg.addMsg(learnedID + ": 学习完成" + response.data);
            } else {
                PrintMsg.ddl(learnedID + ": 学习出错: " + response.data);
            }
        });
    }

    /**
     * 完成评价
     * @param {string} learnedID 学习记录 id
     * @param {string} userid 用户登录名
     */
    function completeEvaluate(learnedID, userid = '') {
        // TODO: 未完成学习不能，完成评价
        requestGet("wljy_jyAjAX_savePjpf.action", {
            r: Math.random(),
            xxJlId: learnedID,
            pjLx: 1,
            userid: userid
        }).then(response => {
            PrintMsg.addMsg(learnedID + ": 评价完成" + response.data);
        });
    }

    /**
     * 学习网络课程
     * @param {string} year 往前截止的年份，如2020则为2022-2020，默认为运行时的年份
     */
    async function learningReception(year = new Date().getFullYear()) {
        let columnList = [
            {'name': '时政要闻', 'column': '01', 'category': '01'},
            {'name': '综合动态', 'column': '01', 'category': '04'},
            {'name': '视频新闻', 'column': '01', 'category': '06'},
            {'name': '约见部长', 'column': '01', 'category': '08'},
            {'name': '区县快讯', 'column': '01', 'category': '03'},
            {'name': '通知公告', 'column': '01', 'category': '02'},
            {'name': '党建工作', 'column': '02', 'category': '02'},
            {'name': '农村党建', 'column': '02', 'category': '03'},
            {'name': '社区党建', 'column': '02', 'category': '04'},
            {'name': '非公和社会组织', 'column': '02', 'category': '05'},
            {'name': '干部公示', 'column': '03', 'category': '01'},
            {'name': '干部督查', 'column': '03', 'category': '03'},
            {'name': '公务员', 'column': '03', 'category': '05'},
            {'name': '工作动态', 'column': '04', 'category': '04'},
            {'name': '人才政策', 'column': '04', 'category': '01'},
            {'name': '工作动态', 'column': '04', 'category': '03'},
            {'name': '最新动态', 'column': '08', 'category': '01'},
            {'name': '经验交流', 'column': '08', 'category': '02'},
            {'name': '课件中心', 'column': '08', 'category': '04'},
            {'name': '编制工作', 'column': '07', 'category': '01'},
            {'name': '党员微课堂', 'column': '06', 'category': '03'},
            {'name': '组织工作', 'column': '06', 'category': '02'},
            {'name': '乡村振兴', 'column': '06', 'category': '01'},
            {'name': '培训动态', 'column': '11', 'category': '01'},
            {'name': '课程资源', 'column': '11', 'category': '02'},
            {'name': '培训师资', 'column': '11', 'category': '03'},
            {'name': '经验交流', 'column': '11', 'category': '05'},
        ];
        for(let column of columnList) {
            let list = await getReceptionList(column.column, column.category, year);
            for(let item of list) {
                requestGet('/wz_AjAX_wznrXxWc.action', {
                    r: Math.random(),
                    nrId: item.id
                }).then(response => {
                    if(response.data == true) {
                        recordLearning();
                        PrintMsg.addMsg('网络文章' + item.id + ': 学习完成。');
                    }
                });
                await sleep(500);
            }
        }
        PrintMsg.addMsg('网络文章: 学习完成！');
    }

    /**
     * 获取前台文章列表（不用计时，每篇1分，用书卷图标变红色标记是否已经学习，需要登陆才显示）
     * @param {string} column   栏目编码
     * @param {string} category 栏目类别编码
     * @param {string} year     往前截止的年份，如2020则为2022-2020，默认为运行时的年份
     * @returns {[object]} [{status: 是否学习, id: 文章id, year: 文章发布年份, href: 文章链接}]
     */
    async function getReceptionList(column = '01', category = '01', year = new Date().getFullYear()) {
        let result = [];
        let response = await requestReceptionPage(column, category);
        result = result.concat(response.list);
        for(let page = 2; page <= response.totalPages; page++) {
            PrintMsg.addMsg('正在处理' + column + category + '栏目，第' + page + '页，共' + response.totalPages + '页。\n');
            response = await requestReceptionPage(column, category, page, year, true);
            if(response.list.length == 0) break;
            result = result.concat(response.list);
        }
        return result;
    }

    /**
     * 请求前台文章列表页面
     * @param {string} column   栏目编码
     * @param {string} category 栏目类别编码
     * @param {int} page        页码，默认1
     * @param {string} year     往前截止的年份，如2020则为2022-2020，默认为运行时的年份
     * @param {boolean} unread  是否只查找未阅读的项，默认true
     * @returns {object}        [{totalPages: 该分类的总页面, currentPage: 当前页数, list: [{status: 是否学习, id: 文章id, year: 文章发布年份, href: 文章链接}]}]
     */
    async function requestReceptionPage(column = '01', category = '01', page = 1, year = new Date().getFullYear(), unread = true) {
        let response = await requestPostForm('/wz_showEj.action', {
            'curYjWzLm.id': column,
            'curEjWzLm.id': column + category,
            'pageUtil.currentpage': page
        });
        let result = {};
        result.totalPages = response.data.getElementById('totalpagesId').value;
        result.currentPage = page;
        result.list = [];
        let listA = response.data.querySelectorAll('.list_list a');
        for(let tagA of listA) {
            let data = {
                'status': tagA.querySelector('span img').title,
                'year':   tagA.querySelector('span').lastChild.data.replace(/\s*\[*\]*/g, '').split('-')[0],
                'href':   tagA.href
            };
            if(data.year < year) break;
            let id = new URLSearchParams(data.href.split('?')[1]);
            data.id = id.get('curWznr.id');
            if(unread && data.status == '未阅读') {
                result.list.push(data);
            }
        }
        return result;
    }

    /**
     * 获取前台课程列表（所有课程）
     * 但值得注意的是：只有当年的课程，才计算分数，失望。
     * 源网站代码的请求主要用于翻页，没见过这么混乱的翻页，用 form 提交。
     * 前端只是用于弹出 alert (烂)提醒是否是最后一页。
     * 既然是后端翻页，为何不在第一页和最后一页的时候不显示“上一页”或“下一页”？
     * 从而完全不用前端来写这么烂的东西，真的无语。
     *
     * 参数名字为原网站代码名，逻辑比较懵，默认都为1，互不影响，没有层级关系。
     * 切换时，另一个保持默认值即可。
     * 主题id控制必修课的三个小项，栏目id控制其他
     *
     * @param {int} ztid 1: 必修-省市
     *                   6: 必修-政策
     *                   3: 必修-党史
     * @param {int} lmid 1:选修-每日一学
     *                   6: 选修-党建直播
     *                   3: 选修-党史知识，
     *                   1101: 学院资讯-培训动态
     *                   1102: 学院资讯-课程资源
     *                   1103: 学院资讯-培训师资 不用学
     *                   1105: 学院资讯-经验交流
     *
     * @returns {[object]} A标签对象的数组
     */
    async function getBxList(ztid = 1, lmid = 1) {
        let resultListA = [];
        const url = 'wz_showWljyEj.action';
        /**
         * form params:
         * <input type="hidden" name="pageUtil.pagesize"   value="20" id="pageSizeId"/>
         * <input type="hidden" name="pageUtil.totalpages" value="15" id="totalpagesId"/>
         * <input type="hidden" name="wlxyEjLx"            value="3"  id="fyFormId_wlxyEjLx"/>
         * <input type="hidden" name="xxbx"                value="2"  id="xxbxId"/>
         * <input type="hidden" name="searchLm.id"         value="1"  id="searchLmId"/>
         * <input type="hidden" name="searchBxzt.id"       value="1"  id="searchBxztId"/>
         * <input type="text"   name="pageUtil.currentpage" maxlength="3" value="1" id="currentId" onchange="checkCurrent(this)"/>
         * pageUtil.pagesize     应该是每页显示个数，但修改无用，前端也未调用，这是我见过写的最烂的代码
         * pageUtil.totalpages   只是给前端获取总页数，但后端在也在稍后的位置输出了总页数，这是我见过写的最烂的代码
         * wlxyEjLx              作用未知，修改无用，前端也未调用，这是我见过写的最烂的代码
         * xxbx                  作用未知，修改无用，前端也未调用，这是我见过写的最烂的代码
         * searchLm.id           栏目id
         * searchBxzt.id         必修课程id
         * pageUtil.currentpage  跳到某页，用的 onchange()，烂
         */
        let data = {
            "pageUtil.pagesize": 20,
            "pageUtil.totalpages": 15,
            "wlxyEjLx": 3,
            "xxbx": 2,
            "searchLm.id": lmid,
            "searchBxzt.id": ztid,
            "pageUtil.currentpage": 1
        }
        // 第一次请求，获取第一页的链接和总页数（必须）
        await requestPostForm(url, data).then(async response => {
            // 请求课程的总页数
            let totalPage = response.data.getElementById('totalpagesId').value;
            // 因为暂时只会发送一种 post 请求，就是用于翻页获取课程列表
            // 所以在此写成，直接返回到课程列表链接
            let listA = response.data.querySelectorAll(".list_list a");

            resultListA = resultListA.concat(converToArray(listA));
            // 循环请求分页：
            // @TODO 同步？异步？
            for (let i = 2; i <= totalPage; i++) {
                data['pageUtil.currentpage'] = i
                await requestPostForm(url, data).then(response => {
                    resultListA = resultListA.concat(converToArray(response.data.querySelectorAll(".list_list a")));
                });
            }
        });
        return uniqueElements(resultListA);
    }

    /**
     * 后台管理翻页
     * @date 2022-04-15 通过啃这个翻页请求终于搞明白网站的课程分类：
     *                  大类两个（用 url 区分）：
     *                          1、必修课程：wljy_jy_grBxkjList.action
     *                          2、选修课程：wljy_jy_grXxkjList.action
     *                  小类
     *                  必修用主题 id 区分（searchZt.id），可在后台学习的“必修课件”中用下拉列表选择：
     *                          1、searchZt.id = 1，省市要情
     *                          2、searchZt.id = 3，党史学习
     *                          3、searchZt.id = 6，政策法规
     *                          4、searchZt.id = '' 为全部分类
     *                  选修用栏目 id 区分（searchLm.id，可在 url 用 GET 请求）：
     *                          1、searchLm.id = 1，每日一学
     *                          2、searchLm.id = 2，党建直播
     *                          3、searchLm.id = 3，党史知识，无课程
     *                          4、searchLm.id = 4，党内法规，无课程
     *                          5、searchLm.id = 5，经验典型，无课程
     *                          6、searchLm.id = 6，党务问答，无课程
     *                          7、searchLm.id > 6，为每日一学，前10条
     *                          8、searchLm.id > ''，为全部分类
     * @param {int} group     分组，0: 必修，1: 选修
     * @param {int} groupId   分组小类 id ，见上
     * @param {int} year      课程年份
     * @returns {Document}    页面 Document 对象
     */
    async function getCurriculumList(group = 0, groupId = '', year = '') {
        // 用于获取今年的年份
        let date = new Date();
        let url = '';
        let data = {};
        // 请求 url 选择
        if (group == 1) {
            url = 'wljy_jy_grXxkjList.action';
            data = {
                'searchLm.id': groupId,// 栏目ID
                'year': year || date.getFullYear(),// 课程年份，默认为今年
                'pageUtil.currentpage': 1,// 当前页
                'pageUtil.pagesize': 10000,// 每页显示条数
            };
        } else {
            url = 'wljy_jy_grBxkjList.action';
            data = {
                'searchZt.id': groupId,//主题id，空为全部主题的课程
                'year': year || date.getFullYear(),// 课程年份，默认为今年
                'pageUtil.currentpage': 1,// 当前页
                'pageUtil.pagesize': 10000,// 每页显示条数
            };
        }
        let result = await requestPostForm(url, data);
        return result.data;
    }

    /**
     * 发送提交 form 的 post 请求
     * @param {string} url 请求 url
     * @param {object} data 请求参数
     * @param {string} type
     * @returns {Promise<Document>}
     */
    function requestPostForm(url, data = {}, type = 'document') {
        let param = new FormData();
        for (let name in data) {
            param.append(name, data[name]);
        }
        // 无须设置请求头
        // let config= {
        //     headers: {"Content-Type": "multipart/form-data"}
        // }
        return axios({
            method: "post",
            url: url,
            data: param,
            // headers: config,
            responseType: type
        }).catch(error => {
            PrintMsg.addErrorMsg("POST请求发送失败：无法连接网站服务器: " + error);
        });
    }

    /**
     * 发送 get 请求
     * @param {string} url    请求 url
     * @param {object} params 请求参数
     * @returns {Promise<document>}
     */
    function requestGet(url, params = {}, responseType = 'text') {
        return axios({
            method: "get",
            url: url,
            responseType: responseType,
            params: params,
        }).catch(error => {
            PrintMsg.addErrorMsg("GET请求发送失败：无法连接网站服务器: " + error);
        });
    }

    /**
     * 将 NodeList 转为数组
     * @param {NodeList} nodeList
     * @return {[Document]}
     */
    function converToArray(nodeList) {
        let data = [];
        try {
            // 非 IE 浏览器适用
            data = Array.prototype.slice.call(nodeList, 0);
        } catch (exception) {
            nodeList.foreach(i => {
                data.push(nodeList[i]);
            });
        }
        return data;
    }

    /**
     * 去掉数组中的重复项
     * @param {Array} arrayData
     * @returns {Array}
     */
    function uniqueElements(arrayData) {
        let result = [], hash = {};
        for (let i = 0, element; (element = arrayData[i]) != null; i++) {
            if (!hash[element]) {
                result.push(element);
                hash[element] = true;
            }
        }
        return result;
    }

    /**
     * 延迟
     * @param {int} ms 延迟毫秒数，默认1000
     * @returns {Promise<void>}
     */
    function sleep(ms = 1000) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        });
    }

    /**
     * 锁定 start button ，准备
     */
    function lockingStartButton() {
        PrintMsg.autoLearningButton.disabled = 'disabled';
        PrintMsg.autoLearningButton.className += ' my-button-disabled';
    }

    /**
     * 解锁 start button ，准备完毕
     */
    async function unlockingStartButton() {
        await sleep(1000);
        PrintMsg.autoLearningButton.disabled = '';
        PrintMsg.autoLearningButton.className = 'my-button my-button-go';
    }

    /**
     * 锁定 button ，防止连续点击
     */
    function lockingButton() {
        // 密码验证按钮
        PrintMsg.checkPasswordButton.disabled = 'disabled';
        PrintMsg.checkPasswordButton.className += ' my-button-disabled';
        // 开始学习按钮
        lockingStartButton();
    }

    /**
     * 解锁 button ，防止连续点击
     */
    async function unlockingButton() {
        await sleep(1000);
        // 密码验证按钮
        PrintMsg.checkPasswordButton.disabled = '';
        PrintMsg.checkPasswordButton.className = 'my-button';
        if (allReadyStatus == 1) {
            unlockingStartButton();
        } else {
            lockingStartButton();
        }
    }

    /**
     * 设置 cookie
     * @param {string} cookieName 名称
     * @param {string} cookieValue 值
     * @param {int}    exdays 保存天数，默认 10 年
     * @param {string} domain 所属域名，默认 trzhdj.gov.cn
     */
    function setCookie(cookieName, cookieValue, exdays = 3650, domain = 'trzhdj.gov.cn') {
        try {
            domain = (domain ? "domain=" + domain : "") + ";";
            let date = new Date();
            date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + date.toUTCString();
            if(typeof cookieValue == 'object') {
                cookieValue = JSON.stringify(cookieValue);
            }
            document.cookie = cookieName + "=" + cookieValue + "; " + domain + expires + ";path=/";
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 读取 cookie
     * @param {string} cookieName 名称
     * @returns {string} string
     */
    function getCookie(cookieName) {
        let name = cookieName + "=";
        let cookieArray = document.cookie.split(';');
        for (const element of cookieArray) {
            let cookie = element.trim();
            if (cookie.indexOf(name) == 0) return cookie.substring(name.length, cookie.length);
        }
        return "";
    }

    /**
     * 记录学习情况，故意放慢学习速度
     */
    function recordLearning() {
        let totalLearningCounter = getCookie('totalLearningCounter');
        totalLearningCounter ++;
        setCookie('totalLearningCounter', totalLearningCounter);
    }

    /**
     * 记录使用天数
     */
    function recordUsingDays() {
        let usingDate = getCookie('usingDate');
        let now = new Date().getTime();
        if(!usingDate) {
            setCookie('usingDate', now);
            return 0;
        } else {
            return ((now - usingDate) / (24 * 3600000)).toFixed(2);
        }
    }

    /**
     * 将数字转化为带千分位的字符串
     */
    function formatNumberToString(num) {
    if (isNaN(num)) {
        throw new TypeError("num is not a number");
    }
    return ("" + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
}

    // My code end
})();