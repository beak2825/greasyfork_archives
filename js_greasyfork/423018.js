// ==UserScript==
// @name         hitsz 疫情打卡
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  记得在代码里写上学号和密码
// @author       ldt 身体不适请及时上报，本插件仅用于健康的同学快速上报
// @match        *http://xgsm.hitsz.edu.cn/zhxy-xgzs/xg_mobile/shsj/loginChange*
// @match        *https://sso.hitsz.edu.cn:7002/cas/login?service=http%3A%2F%2Fxgsm.hitsz.edu.cn%2Fzhxy-xgzs%2Fcommon%2FcasLogin%3Fparams%3DL3hnX21vYmlsZS94c0hvbWU%3D*
// @match        *https://sso.hitsz.edu.cn:7002/cas/*
// @match        *http://xgsm.hitsz.edu.cn/zhxy-xgzs/xg_mobile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423018/hitsz%20%E7%96%AB%E6%83%85%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/423018/hitsz%20%E7%96%AB%E6%83%85%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

// 窗口关闭时间
let closeTime = 10;


let yourStudentId = localStorage.getItem('yourStudentId');
let yourPassword = localStorage.getItem('yourPassword');
let AboutToGraduate = localStorage.getItem('AboutToGraduate');


let myCardCss = `width:250px;height:250px;
           position:fixed;
           top:100px; right:50px;
           border-radius: 48px;
           background: #8aff9d;
           box-shadow:  25px 25px 50px #6cc77a,-25px -25px 50px #a8ffc0;
    `;

// 页面加载完成后弹出浮动窗口，看到今日数据
window.onload = function(){
    // 如果不是登录页面，则弹出使用卡片
    if(document.querySelector('#username') === null && AboutToGraduate!== null) {
        makeDiv();
    }
}


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
    if(today_date !== Number(lastTimeToUploadDate[lastTimeToUploadDate.length-1])) {
        (function() {
            document.querySelector('.right_btn').click();
        })();
    } else {
         console.log('今天你已经填过表啦~');
         setTimeout(close, closeTime*1000);
    }
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
     yourStudentId = localStorage.getItem("yourStudentId");
     yourPassword = localStorage.getItem("yourPassword");
     // 判断你是不是没设置过 名字和密码
     if(yourStudentId === null || yourPassword === null) {
         alert('务必填入正确的密码和学号，不然会很麻烦...');
         firstUse();
      } else{
          editInfo();
        (function() {
            let username = document.querySelector('#username');
            let password = document.querySelector('#password');
            username.value = yourStudentId;
            password.value = yourPassword;
            document.querySelector('.login_box_landing_btn').click();
            // Your code here...
        })();
     }
}

// 如果有每日上报按钮，那就是登录后页面，点每日上报
if(document.querySelector('#mrsb') !== null) {

    if(AboutToGraduate === null) {
        firstUse_SecondPage();
    } else {
        // 直接用id里的名字赋值
        let xm = document.querySelector('#xm');
        if(xm !== null) {
            localStorage.setItem("yourName", xm.innerHTML);
        }
        (function() {
        document.querySelector('#mrsb').click();
        })();
    }
}

// 如果新增按钮，点新增
if(document.querySelector('.content_title') && document.querySelector('.content_title').innerHTML === '每日上报信息'
   && document.querySelector('#sffwwhhb')=== null) {

   setTimeout( newButtonThePageElements, 1000);
}

// 油猴好像在后面留一个斜杠，就能匹配该域名不同端口，和位置的url了

if(document.querySelector('#sffwwhhb')!== null) {
    (function() {
        let graduate_input = document.querySelector('#sffwwhhb');

        // 好像也能这么改? 不行...
        /*graduate_input.click();

        let a = document.querySelector('.weui-picker__content');
        a.setAttribute("style","transform: translate3d(0px, 102px, 0px); transition: all 0.3s ease 0s;");
        document.querySelector('#weui-picker-confirm').click(); */


        document.querySelector('#txfscheckbox').checked = "checked";
        // 应该成功不了提交时不看这个value值！
        // document.querySelector('#sffwwhhb').value = "毕业生班";
        // 它提交是依靠这个自定义属性，'1'是毕业生班，'0'是非毕业生班
        document.querySelector('#sffwwhhb').setAttribute('data-action', AboutToGraduate+'');



        // 点击提交按钮
        document.querySelectorAll('.right_btn')[2].click();
        // 将使用天数加一
        localStorage.setItem("useday",localStorage.getItem("useday")*1+1);
        // 等closeTime秒后关闭窗口
        setTimeout(close, closeTime*1000);
    })();
}


console.log('祝看到此条的你天天开心，学业顺利，身体健康！');


// 设置个浮动窗口，提升使用该服务的天数名字(以后可能提供有用的信息)
let makeDiv = function(){
    // 得到使用时间
    if(localStorage.getItem("useday") === null) {
       localStorage.setItem("useday","1");
    }
    // 每次成功签到一次，再加一，这里只读取
    let useday = localStorage.getItem("useday");
    // 得到用户姓名
    let yourName = localStorage.getItem("yourName");
    // 关闭时间


    // 先设置一个卡片
    let mydiv = document.createElement("div");
    let bodyElement = document.querySelector('body');
    bodyElement.appendChild(mydiv);
    // setAttribute 可以批量设置属性/CSS样式
    mydiv.setAttribute("style", myCardCss);

    // 在卡片里放你的名字和其它信息
    mydiv.innerHTML = `
      <div id="card_myname">亲爱的${yourName}同学</div>
      <div id="card_useday">你已经使用本签到脚本 <b>${useday} 天</b></div>
      <div id="card_closeTime"><b>${closeTime}</b>秒后关闭页面</b></div>
      <img src="https://gitee.com/mung-bean-soup/picture_host/raw/master/img/image-20210330183747079.png"
           style="height:80px; width:80px ;margin: 17px 86px; border-radius: 25px;" />
      `;
    // <div id="card_id">${yourStudentId}</div>

    let card_myname = document.querySelector('#card_myname');
    //let card_id = document.querySelector('#card_id');
    let card_useday = document.querySelector('#card_useday');
    let card_closeTime = document.querySelector('#card_closeTime');
    card_myname.setAttribute("style", "margin: 30px 0 0 25px;font-size: 25px;font-weight: bold;")
    //card_id.setAttribute("style", "margin: -5px 0 0 25px;font-size: 15px;font-weight: bold;")
    card_useday.setAttribute("style", "margin: 10px 0 0 25px;font-size: 15px;")
    card_closeTime.setAttribute("style", "margin: 0px 0 0 25px;font-size: 15px;")
    // 修改显示的时间
    setInterval(ChangeTime ,1000);

}

function ChangeTime (){
    let card_time = document.querySelector('#card_closeTime b');
    card_time.innerHTML = card_time.innerHTML*1-1;
}

// 第一次使用时调用的函数
function firstUse(){
    // 先设置一个卡片
    let mydiv = document.createElement("div");
    let bodyElement = document.querySelector('body');
    bodyElement.appendChild(mydiv);
    // setAttribute 可以批量设置属性/CSS样式
    mydiv.setAttribute("style",myCardCss);

    // 在卡片里放你的名字和其它信息
    mydiv.innerHTML = `
      <div id="first_text1">很高兴遇见你~</div>
      <div id="first_text2">第一次使用需要填入学号和密码,用于自动登录</div>
      <form id="my_form" >
            学号: <input type="text" name="yourStudentId" placeholder="请在此输入登录的学号"/> </br>
            密码: <input type="text" name="yourPassword" placeholder="请在此输入登录的密码"/> </br>
      </form>
      <button id="confirm_button">确认</button>
      `;
    let first_text1 = document.querySelector('#first_text1');
    let first_text2 = document.querySelector('#first_text2');
    let my_form = document.querySelector('#my_form');
    let confirm_button = document.querySelector('#confirm_button');
    let yourStudentId;
    let yourPassword;

    first_text1.setAttribute("style", "margin: 30px 0 0 25px;font-size: 25px;font-weight: bold;");
    first_text2.setAttribute("style", "margin: 5px 0 0 25px;font-size: 15px;font-weight: bold;");
    my_form.setAttribute("style", "margin: 15px 0 0 25px;");
    confirm_button.setAttribute("style", `
          margin: 7px 0 0 77px;
          transition-duration: 0.4s;
          padding: 0;
          text-align: center;
          background-color: white;
          color: black;
          border: 2px solid #4CAF50;
          border-radius:5px;
          width: 100px;
          height: 40px;
           `);
    confirm_button.addEventListener('click', storageInfo);
}
// 保存填入的信息
function storageInfo(){
    let my_form = document.querySelector('#my_form');
    let myFormData = new FormData(my_form);

    localStorage.setItem('yourStudentId', myFormData.get('yourStudentId'));
    localStorage.setItem('yourPassword', myFormData.get('yourPassword'));

    if(myFormData.get('yourStudentId') === null || myFormData.get('yourPassword') === null){
         alert('请输入正确字符');
    } else {
         // 刷新下页面，然后自动登录
         location.reload();
    }
}





// 第一次使用时调用的函数
function firstUse_SecondPage(){
    // 先设置一个卡片
    let mydiv = document.createElement("div");
    let bodyElement = document.querySelector('body');
    bodyElement.appendChild(mydiv);
    // setAttribute 可以批量设置属性/CSS样式
    mydiv.setAttribute("style",myCardCss);

    // 在卡片里放你的名字和其它信息
    mydiv.innerHTML = `
      <div id="first_text1">很高兴遇见你~</div>
      <div id="first_text2">第一次使用需要填入是否为毕业生，便于自动填表</div>
      <form id="my_form" >
            是否为毕业生班: 是 <input type="radio"  name="AboutToGraduate" checked="checked" value=1 />
                            否 <input type="radio"  name="AboutToGraduate" value=0 /> </br>
      </form>
      <button id="confirm_button">确认</button>
      `;

    let first_text1 = document.querySelector('#first_text1');
    let first_text2 = document.querySelector('#first_text2');
    first_text1.setAttribute("style", "margin: 30px 0 0 25px;font-size: 25px;font-weight: bold;");
    first_text2.setAttribute("style", "margin: 5px 0 0 25px;font-size: 15px;font-weight: bold;");

    let my_form = document.querySelector('#my_form');
    let confirm_button = document.querySelector('#confirm_button');

    my_form.setAttribute("style", "margin: 15px 0 0 25px;");
    confirm_button.setAttribute("style", `
          margin: 7px 0 0 77px;
          transition-duration: 0.4s;
          padding: 0;
          text-align: center;
          background-color: white;
          color: black;
          border: 2px solid #4CAF50;
          border-radius:5px;
          width: 100px;
          height: 40px;
           `);
    confirm_button.addEventListener('click', storageInfo2);
}

// 保存填入的信息
function storageInfo2(){
    console.log('调用成功')
    let my_form = document.querySelector('#my_form');
    let myFormData = new FormData(my_form);

    let chk = document.querySelector("#my_form :checked");
    localStorage.setItem('AboutToGraduate', chk.getAttribute('value'));

    if( chk.getAttribute('value') === null) {
         alert('请选择选项');
    } else {
         // 刷新下页面，然后自动登录
         location.reload();
    }
}

// 修改登入的信息, 一个修改按钮，按下之后唤醒修改卡片
function editInfo() {
    console.log('这是修改按钮')
    // 先设置一个卡片
    let mydiv = document.createElement("div");
    let bodyElement = document.querySelector('body');
    bodyElement.appendChild(mydiv);
    // setAttribute 可以批量设置属性/CSS样式
    mydiv.setAttribute("style",myCardCss);

    // 在卡片里放你的名字和其它信息
    mydiv.innerHTML = `
      <button id="edit_button">修改已录入的学号和密码</button>
      `;

    let edit_button = document.querySelector('#edit_button');

    edit_button.setAttribute("style", `
          margin: 90px 0 0 45px;
          transition-duration: 0.4s;
          padding: 0;
          text-align: center;
          background-color: white;
          color: black;
          border: 2px solid #4CAF50;
          border-radius:5px;
          width: 160px;
          height: 70px;
           `);
    edit_button.addEventListener('click', firstUse);

}
