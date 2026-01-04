// ==UserScript==
// @name         hitsz 疫情打卡
// @namespace    http://tampermonkey.net/
// @version      0.2.1 新版特性：支持修改所有信息
// @description  记得在代码里写上学号和密码
// @author       YZH 身体不适请及时上报，本插件仅用于健康的同学快速上报（@初版作者LDT ）
// @match        *http://xgsm.hitsz.edu.cn/zhxy-xgzs/xg_mobile/shsj/loginChange*
// @match        *https://sso.hitsz.edu.cn:7002/cas/login?service=http%3A%2F%2Fxgsm.hitsz.edu.cn%2Fzhxy-xgzs%2Fcommon%2FcasLogin%3Fparams%3DL3hnX21vYmlsZS94c0hvbWU%3D*
// @match        *http://xgsm.hitsz.edu.cn/zhxy-xgzs/xg_mobile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423467/hitsz%20%E7%96%AB%E6%83%85%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/423467/hitsz%20%E7%96%AB%E6%83%85%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

let yourStudentId = '20S051060';
let yourPassword = 'SZzs19970908';
let graduating = '0';
let internship = '0';
let oversea = '0';
let province = '440000';
let city = '440300';
let district = '440305';
let detailAddress = '平山村355栋';
let status = '05';
let memo = '';
let temperature1 = '36';
let temperature2 = '5';
let healthStatus = '01';


// 关闭窗口的函数
let close = function() {
    window.location.href = 'about:blank';
    window.close();
}

let newButtonThePageElements = function () {
    // 判断最新上报的表是否是今天写的，今天已经提交过了的话就关闭页面
    let lastTimeToUploadDate = document.querySelectorAll('.content2')[0].querySelector('div[style="font-size: 0.9rem;color: #333333;"]').innerText;
    lastTimeToUploadDate = lastTimeToUploadDate.slice(lastTimeToUploadDate.indexOf('：')+1, );
    lastTimeToUploadDate = lastTimeToUploadDate.split('-'); // 最后是这样的数组 ["2021", "03", "11"]
    let today = new Date();
    let today_date = today.getDate();
    console.log(today_date);
    console.log(Number(lastTimeToUploadDate[lastTimeToUploadDate.length-1]));
    // 比较一下最近填表日期是否今天
    // if(today_date !== Number(lastTimeToUploadDate[lastTimeToUploadDate.length-1])) {
    (function() {
        document.querySelector('.right_btn').click();
    })();
    // } else {
    //      console.log('今天你已经填过表啦~');
    //      close();
    // }
}

// 如果有每日疫情上报，那就在第一个页面，然后执行
if(document.querySelector('button[onclick="tongyishenfen()"]') !== null) {
    (function() {
        let button1 = document.querySelector('button[onclick="tongyishenfen()"]');
        console.log('button1');
        button1.click();
        // Your code here...
    })();
}

// 如果有用户名按钮，那就是登录页面，自动登录
if(document.querySelector('#username') !== null) {
    (function() {
        let username = document.querySelector('#username');
        let password = document.querySelector('#password');
        username.value = yourStudentId;
        password.value = yourPassword;
        document.querySelector('.login_box_landing_btn').click();
        // Your code here...
    })();
}

// 如果有每日上报按钮，那就是登录后页面，点每日上报
if(document.querySelector('#mrsb') !== null) {
    (function() {
        document.querySelector('#mrsb').click();
    })();
}

// 如果新增按钮，点新增
if(document.querySelector('.content_title') && document.querySelector('.content_title').innerHTML === '每日上报信息'
   && document.querySelector('#sffwwhhb')=== null) {

   setTimeout( newButtonThePageElements, 1000);
}

// 油猴好像在后面留一个斜杠，就能匹配该域名不同端口，和位置的url了

if(document.querySelector('#sffwwhhb')!== null) {
    (function() {
        // document.querySelector('#sffwwhhb').click();
        document.querySelector('#sffwwhhb').setAttribute('data-action', graduating);
        document.querySelector('#sfjdwhhbry').setAttribute('data-action', internship);
        document.querySelector('#dqszd1').click();
        document.querySelector('#dqszdsheng').setAttribute('data-action', province);
        document.querySelector('#dqszdshi').setAttribute('data-action', city);
        document.querySelector('#dqszdqu').setAttribute('data-action', district);
        document.querySelector('#gnxxdz').value = detailAddress;
        document.querySelector('#dqztm').setAttribute('data-action', district);
        if(memo != '')
            document.querySelector('#dqztbz').value = memo;
        document.querySelector('#tw').value = temperature1;
        document.querySelector('#tw1').value = temperature2;
        document.querySelector('#stzkm').setAttribute('data-action', healthStatus);
        document.querySelector('#txfscheckbox').checked = true;


        // 应该成功不了提交时不看这个value值！
        // document.querySelector('#sffwwhhb').value = "毕业生班";
        // 它提交是依靠这个自定义属性，'1'是毕业生班，'0'是非毕业生班
        // 点击提交按钮
        // document.querySelectorAll('.right_btn')[2].click();
        // 等一秒后关闭窗口
        // setTimeout(close, 1000);
    })();
}

console.log('祝看到此条的你天天开心，学业顺利，身体健康！');

