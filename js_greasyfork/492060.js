// ==UserScript==
// @name         粉雪科技开发助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  开发工具,自用
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fenxuekeji.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/492060/%E7%B2%89%E9%9B%AA%E7%A7%91%E6%8A%80%E5%BC%80%E5%8F%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492060/%E7%B2%89%E9%9B%AA%E7%A7%91%E6%8A%80%E5%BC%80%E5%8F%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


// 粉雪科技开发助手
$(function(){
    // 注册右键菜单
    let autoFillFormMenu = GM_registerMenuCommand ("自动填写‘商务合作表单’", function(){
        // 删除所有的右键菜单
        // GM_unregisterMenuCommand(autoFillFormMenu);
    });

    const autoFillForm = function(){
        console.group('自动填写表单');
        // 世界五百强随机30个
        let fortune500 = [
            '沃尔玛', '中国石油化工集团', '荷兰皇家壳牌石油公司', '中国石油天然气集团', '国家电网公司', '沙特阿美公司', '大众汽车', '英国石油公司', '丰田汽车', '伯克希尔哈撒韦公司', '苹果公司', '麦克森公司', '中国建筑工程公司', '中国工商银行', '中国农业银行', '中国银行', '中国建设银行', '中国平安保险', '中国人寿保险', '中国移动', '中国联通', '中国电信', '中国中铁', '中国中车', '中国中冶', '中国中化', '中国中煤', '中国中电', '中国中石油', '中国中海油', '中国中航工业'
        ];
        let randomCompany = fortune500[Math.floor(Math.random() * fortune500.length)];
        $('#companyId').val(randomCompany);
        // 常见假名字 20个
        let fakeName = [
            '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二', '李十三', '赵十四', '钱十五', '孙十六', '周十七', '吴十八', '郑十九', '王二十', '李二十一', '赵二十二'
        ];
        let randomName = fakeName[Math.floor(Math.random() * fakeName.length)];
        randomName = randomName.substr(0, 6);
        $('#usernameId').val(randomName);
        let randomMobile = '13' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        $('#mobileId').val(randomMobile);
        // 国内主流邮箱域名
        let mailArray = ['qq', '163', '126', 'sina', 'sohu', 'gmail', 'outlook', 'yahoo', 'hotmail'];
        let randomMail = Math.random().toString(36).substr(2) + '@' + mailArray[Math.floor(Math.random() * mailArray.length)] + '.com';
        $('#mailId').val(randomMail);
        let cooperArray = ['广告合作', '内容合作', '商务合作', '技术合作', '其他合作'];
        let randomCooper = cooperArray[Math.floor(Math.random() * cooperArray.length)];
        $('#cooperId').val(randomCooper);
        console.table({
            '公司名称': randomCompany,
            '姓名': randomName,
            '手机号': randomMobile,
            '邮箱': randomMail,
            '合作类型': randomCooper

        });
        console.groupEnd();

    }

    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了 Ctrl 和 Shift 键，并且按下的键是字母 *
        if (event.shiftKey && event.key === 'Z') {
            autoFillForm()
        }
    });


});

