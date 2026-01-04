// ==UserScript==
// @name         HRBCU-GenshinStart!
// @namespace    http://yuluoxk.cn/
// @version      1.21
// @description  原神，启动！
// @license      MIT
// @author       Yuluoxk
// @match        https://cas.bnu.edu.cn/*
// @match        https://onevpn.bnu.edu.cn/*
// @match        https://onevpn.bnu.edu.cn/users/sign_in
// @match        http://jw.hrbcu.edu.cn/jwglxt/xtgl/login_slogin.html
// @match        https://jw.webvpn.hrbcu.edu.cn/jwglxt/xtgl/login_slogin.html
// @downloadURL https://update.greasyfork.org/scripts/475160/HRBCU-GenshinStart%21.user.js
// @updateURL https://update.greasyfork.org/scripts/475160/HRBCU-GenshinStart%21.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 获取当前页面的 URL
  let currentUrl = window.location.href;
  let casLogin = /^https:\/\/cas\.bnu\.edu\.cn\/.*/;
  let casLoginWebvpn = /^https:\/\/onevpn\.bnu\.edu\.cn\/.*/;
  let LoginJW = /^http:\/\/jw\.hrbcu\.edu\.cn\/jwglxt\/xtgl\/login_slogin\.html.*/;
  let LoginJWWebvpn = /^https:\/\/jw\.webvpn\.hrbcu\.edu\.cn\/jwglxt\/xtgl\/login_slogin\.html.*/;
  if (casLogin.test(currentUrl) || casLoginWebvpn.test(currentUrl)) {
    //原神启动画面
    function createHtmlCssString() {
      let html = `
    <div class="content" id="startup_company">
    <img src="https://yuluoxk.cn/genshin/company.jpg" />
</div>
<div class="content" id="startup_game">
    <img src="https://yuluoxk.cn/genshin/game.jpg" />
    <div id="startup_game_g">
        抵制不良游戏, 拒绝盗版游戏, 注意自我保护, 谨防受骗上当, 适度游戏益脑, 沉迷游戏伤身, 合理安排时间, 享受健康生活。<br>
        审批文号: 国新出审[2020]1407号 ISBN 978-7-498-07852-0 出版单位: 华东师范大学电子音像出版社有限公司<br>
        著作权人: 上海米哈游天命科技有限公司<br>
        本公司积极履行《网络游戏行业防沉迷自律公约》<br>
    </div>
</div>
<div class="content" id="startup_warning">
    <div id="startup_warning_main">
        <h1>警告: 游戏前详阅</h1>
        <img src="https://yuluoxk.cn/genshin/warning_line.jpg" />
        <p>
            有极少数的人在观看一些视觉影像时可能会突然癫痫发作, 这些影像包括电子游戏中出现的闪光或图形。 在<br>
            进行电子游戏时, 这些人可能会出现癫痫症状。 甚至连不具有癫痫史的人, 也可能在进行电子游戏时, 出现类<br>
            似癫痫症状。 如果您或您的家人有癫痫史, 请在进行游戏之前先与医生咨询。 如果您在游玩电子游戏时出现<br>
            以下症状, 包括眼睛疼痛、 视觉异常、 偏头痛、 痉挛或意识障碍 (诸如昏迷) 等, 请立即中止游戏, 并且请您于<br>
            再次进行本游戏之前咨询您的医生。<br><br>
            除上述症状外, 当您感到头痛、 头晕眼花、 恶心想吐或类似晕车症状时, 以及当身体的某些部位感到不舒服或<br>
            疼痛时, 请立即中止游戏。 若在中止游戏后, 症状仍没有减退, 请立即寻求医生的诊疗。<br>
        </p>
    </div>
</div>
    `;
      let css = `
    @font-face {
font-family: genshin-font;
src: url("https://yuluoxk.cn/genshin/font.ttf");
}

html, body {
width: 100%;
height: 100%;
margin: 0;
user-select: none;
}
.main {
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
}

#settings_brand {
text-align: center;
}
#settings_brand_start {
margin: 0 0 0 10px;
}
#settings_brand_start * {
vertical-align: middle;
}
#settings_brand p {
text-align: left;
margin: 10px 0 0 20px;
font-size: 12px;
}
#settings_brand p a {
color: #fff;
}

#settings {
display: inline-flex;
}
#settings .part {
flex: 1;
margin-right: 10px;
}
#settings .part h1 {
font-size: 26px;
margin: 25px 0 10px 15px;
}
#settings .part .item {
position: relative;
height: 50px;
background-color: #424242;
border-radius: 8px;
margin-bottom: 10px;
}
#settings .part .item span {
position: absolute;
left: 15px;
top: 50%;
transform: translateY(-50%);
font-size: 15px;
}
#settings .part .item select, #settings .part .item input, #settings .part .item label {
position: absolute;
right: 15px;
top: 50%;
transform: translateY(-50%);
}
#settings .part .item select, #settings .part .item input {
outline: none;
border: none;
font-size: 15px;
background-color: #757575;
color: #fff;
border-radius: 4px;
height: 24px;
}
#settings_time_timestamp {
width: calc(100% - 76px);
}

#startup {
background-color: #FEFEFE;
color: #000;
}
/* #startup_timer {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
height: 80px;
width: 80px;
background-color: #fff;
box-shadow: 0 10px 20px rgba(0 0 0 / .1);
border: 1px solid #bbb;
border-radius: 10px;
} */
#startup_timer_tn {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
font-size: 64px;
font-weight: bolder;
}
#startup_timestamp {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
white-space: nowrap;
text-align: center;
}
#startup_timestamp h1 {
font-size: 48px;
margin: 0 0 12px 0;
}
#startup_timestamp p {
font-size: 36px;
margin: 0;
}

#startup .content {
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
opacity: 0;
transition: opacity 1s;
}
#startup_game_g {
opacity: 0;
transition: opacity 1s;
}

#startup_company img, #startup_game img {
position: absolute;
left: 50%;
transform: translate(-50%, -50%);
}
#startup_company img {
top: 50%;
height: 160px;
}
#startup_game img {
top: calc(50% - 20px);
height: 260px;
}
#startup_game_g {
position: absolute;
bottom: 10px;
left: 0;
width: 100%;
text-align: center;
color: #636363;
font-size: 20px;
font-family: genshin-font;
line-height: 30px;
}
#startup_warning_main {
position: absolute;
top: 50%;
transform: translateY(-50%);
width: 100%;
text-align: center;
font-family: genshin-font;
}
#startup_warning_main h1 {
color: #2F2F2F;
font-weight: normal;
font-size: 36px;
margin: 0 0 10px 0;
}
#startup_warning_main img {
height: 25px;
}
#startup_warning_main p {
color: #636363;
font-size: 24px;
line-height: 34px;
margin: 4px 0 0 0;
}

#readyStartup {
background-color: #fff;
width: fit-content;
white-space: nowrap;
}
#readyStartup img {
height: 400px;
box-shadow: 0 0 2px 0 #bbb;
margin-top: 2px;
}
#readyStartup img:first-child {
margin-right: 5px;
}
#container {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
#startup_company, #startup_game, #startup_warning {
  display: none;
}
#startup .content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s;
}
  `;
      html = `<style>${css}</style>` + html;
      return html;
    }

    //启动函数
    function startupContent(page) {
      let t = 1000; //时间间隔
      //MIHOYO
      if (page.company) {
        setTimeout(() => {
          document.getElementById("startup_company").style.display = "block";
          document.getElementById("startup_company").style.opacity = "1";
        }, t);
        t += 3000;
        setTimeout(() => {
          document.getElementById("startup_company").style.display = "none";
        }, t);
      }
      //原神
      if (page.game) {
        setTimeout(() => {
          document.getElementById("startup_game").style.display = "block";
          document.getElementById("startup_game").style.opacity = "1";
        }, t);
        t += 500;
        setTimeout(() => {
          document.getElementById("startup_game_g").style.opacity = "1";
        }, t);
        t += 4000;
        setTimeout(() => {
          document.getElementById("startup_game").style.display = "none";
        }, t);
      }
      //健康游戏忠告
      if (page.warning) {
        setTimeout(() => {
          document.getElementById("startup_warning").style.display = "block";
          document.getElementById("startup_warning").style.opacity = "1";
        }, t);
        setTimeout(() => {
          document.getElementById("container").style.display = "none";
        }, t + 3000);
      }
    }
    startupContent({ company: true, game: true, warning: true });
    let containerElement = document.createElement("div");
    containerElement.id = "container";
    document.body.appendChild(containerElement);

    let htmlCssString = createHtmlCssString();
    containerElement.innerHTML = htmlCssString;

    // 修改登录框上的标题为空
    document.querySelector(".title p").innerHTML = "";
    // 移除顶部logo
    document.querySelector(".toplogo").remove();

    // 背景
    // 创建一个新的div元素作为背景
    var div = document.createElement("div");
    // 添加样式
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.zIndex = "-1";
    div.style.backgroundImage = "url(https://kanosaikou.cn/genshin-light.gif)";
    div.style.backgroundSize = "cover";
    div.style.backgroundPosition = "center";
    // 添加
    document.body.appendChild(div);

    var loginPage = document.querySelector(".login-page");
    var loginContainer = document.querySelector(".login-container");

    // 分离登录框
    loginPage.parentNode.insertBefore(loginContainer, loginPage);
    loginPage.parentNode.removeChild(loginPage);

    //引入css
    var style = document.createElement("style");
    style.textContent = `
body {
  cursor: url(https://yuluoxk.cn/genshin/cursor.ico), auto;
  }

@font-face {
  font-family: "HYWenHei 85W";
  src: url("https://yuluoxk.cn/genshin/genshin.ttf");
  }
/* 游客登录 */
#fk-login {
font-size: 0px !important;
}
#fk-login::before {
font-size: 14px !important;
content: "来自异世界的旅者登录";
font-family: "HYWenHei 85W";
}
/* 游客登录界面 */
p.user-login-text {
font-size: 0px !important;
}
p.user-login-text::before {
font-size: 10px !important;
content: "提瓦特大陆用户登录";
font-family: "HYWenHei 85W";
}
a.botlink.user-login {
font-size: 0px !important;
}
a.botlink.user-login::before {
font-size: 14px !important;
content: "支持异世界的旅者登录，首次登陆后将拥有临时账号，来自提瓦特大陆的用户请切回账号登录";
font-family: "HYWenHei 85W";
}
/* 登录按钮 */
#dl {
font-size: 0px !important;
background-color: RGB(57, 59, 64);
}
#dl:after {
font-size: 16px;
width: 100%;
font-weight: 400;
content: "进入游戏";
font-family: "HYWenHei 85W";
background-color: RGB(57, 59, 64);
color: RGB(244, 216, 168);
}
/* 输入框前的图标隐藏 */
.input-group-addon {
display: none;
}
/* 	输入框 */
input.form-control.pwd-input {
width: 330px;
height: 30px;
}
input.form-control.user-input {
width: 330px;
height: 30px;
}
/* 输入框上的大标题 */
.title p:after {
font-size: 18px;
font-weight: 600;
content: "HUCHOYO";
border: 0px !important;
height: 50px !important;
text-align: center;
color: RGB(244, 216, 168);
font-family: "HYWenHei 85W";
}

/* 忘记密码 */
a[class="forget-pwd"]:after {
font-size: 14px;
content: "忘记密码？";
font-family: "HYWenHei 85W";
color: RGB(244, 216, 168);
}
a[class="forget-pwd"] {
font-size: 0px !important;
}
label[for="rember"]::before {
border-radius: 7.5px;
}

.login-info {
justify-content: space-between;
align-items: center;
}

.forget-pwd {
margin-top: 15em;
}
.login-container {
width: 380px;
height: 400px;
/* padding: 15px 26px 0px; */
border-radius: 4px;
color: #ffffff;
background: RGB(252, 255, 255);
opacity: 1;
margin: auto;
bottom: 0;
z-index: 666;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}
.login-container .title {
background: RGB(252, 255, 255);
}

.login-container .title p {
color: #ffffff;
}
/* 把文字隐藏 */
.login-footer {
display: none;
}
`;

    document.head.appendChild(style);
  } else if (currentUrl === "https://webvpn.hrbcu.edu.cn/users/sign_in") {
    //原神启动画面
    function createHtmlCssString() {
      let html = `
  <div class="content" id="startup_company">
  <img src="https://yuluoxk.cn/genshin/company.jpg" />
</div>
<div class="content" id="startup_game">
  <img src="https://yuluoxk.cn/genshin/game.jpg" />
  <div id="startup_game_g">
      抵制不良游戏, 拒绝盗版游戏, 注意自我保护, 谨防受骗上当, 适度游戏益脑, 沉迷游戏伤身, 合理安排时间, 享受健康生活。<br>
      审批文号: 国新出审[2020]1407号 ISBN 978-7-498-07852-0 出版单位: 华东师范大学电子音像出版社有限公司<br>
      著作权人: 上海米哈游天命科技有限公司<br>
      本公司积极履行《网络游戏行业防沉迷自律公约》<br>
  </div>
</div>
<div class="content" id="startup_warning">
  <div id="startup_warning_main">
      <h1>警告: 游戏前详阅</h1>
      <img src="https://yuluoxk.cn/genshin/warning_line.jpg" />
      <p>
          有极少数的人在观看一些视觉影像时可能会突然癫痫发作, 这些影像包括电子游戏中出现的闪光或图形。 在<br>
          进行电子游戏时, 这些人可能会出现癫痫症状。 甚至连不具有癫痫史的人, 也可能在进行电子游戏时, 出现类<br>
          似癫痫症状。 如果您或您的家人有癫痫史, 请在进行游戏之前先与医生咨询。 如果您在游玩电子游戏时出现<br>
          以下症状, 包括眼睛疼痛、 视觉异常、 偏头痛、 痉挛或意识障碍 (诸如昏迷) 等, 请立即中止游戏, 并且请您于<br>
          再次进行本游戏之前咨询您的医生。<br><br>
          除上述症状外, 当您感到头痛、 头晕眼花、 恶心想吐或类似晕车症状时, 以及当身体的某些部位感到不舒服或<br>
          疼痛时, 请立即中止游戏。 若在中止游戏后, 症状仍没有减退, 请立即寻求医生的诊疗。<br>
      </p>
  </div>
</div>
  `;
      let css = `
  @font-face {
font-family: genshin-font;
src: url("https://yuluoxk.cn/genshin/font.ttf");
}

html, body {
width: 100%;
height: 100%;
margin: 0;
user-select: none;
}
.main {
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
}

#settings_brand {
text-align: center;
}
#settings_brand_start {
margin: 0 0 0 10px;
}
#settings_brand_start * {
vertical-align: middle;
}
#settings_brand p {
text-align: left;
margin: 10px 0 0 20px;
font-size: 12px;
}
#settings_brand p a {
color: #fff;
}

#settings {
display: inline-flex;
}
#settings .part {
flex: 1;
margin-right: 10px;
}
#settings .part h1 {
font-size: 26px;
margin: 25px 0 10px 15px;
}
#settings .part .item {
position: relative;
height: 50px;
background-color: #424242;
border-radius: 8px;
margin-bottom: 10px;
}
#settings .part .item span {
position: absolute;
left: 15px;
top: 50%;
transform: translateY(-50%);
font-size: 15px;
}
#settings .part .item select, #settings .part .item input, #settings .part .item label {
position: absolute;
right: 15px;
top: 50%;
transform: translateY(-50%);
}
#settings .part .item select, #settings .part .item input {
outline: none;
border: none;
font-size: 15px;
background-color: #757575;
color: #fff;
border-radius: 4px;
height: 24px;
}
#settings_time_timestamp {
width: calc(100% - 76px);
}

#startup {
background-color: #FEFEFE;
color: #000;
}
/* #startup_timer {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
height: 80px;
width: 80px;
background-color: #fff;
box-shadow: 0 10px 20px rgba(0 0 0 / .1);
border: 1px solid #bbb;
border-radius: 10px;
} */
#startup_timer_tn {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
font-size: 64px;
font-weight: bolder;
}
#startup_timestamp {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
white-space: nowrap;
text-align: center;
}
#startup_timestamp h1 {
font-size: 48px;
margin: 0 0 12px 0;
}
#startup_timestamp p {
font-size: 36px;
margin: 0;
}

#startup .content {
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
opacity: 0;
transition: opacity 1s;
}
#startup_game_g {
opacity: 0;
transition: opacity 1s;
}

#startup_company img, #startup_game img {
position: absolute;
left: 50%;
transform: translate(-50%, -50%);
}
#startup_company img {
top: 50%;
height: 160px;
}
#startup_game img {
top: calc(50% - 20px);
height: 260px;
}
#startup_game_g {
position: absolute;
bottom: 10px;
left: 0;
width: 100%;
text-align: center;
color: #636363;
font-size: 20px;
font-family: genshin-font;
line-height: 30px;
}
#startup_warning_main {
position: absolute;
top: 50%;
transform: translateY(-50%);
width: 100%;
text-align: center;
font-family: genshin-font;
}
#startup_warning_main h1 {
color: #2F2F2F;
font-weight: normal;
font-size: 36px;
margin: 0 0 10px 0;
}
#startup_warning_main img {
height: 25px;
}
#startup_warning_main p {
color: #636363;
font-size: 24px;
line-height: 34px;
margin: 4px 0 0 0;
}

#readyStartup {
background-color: #fff;
width: fit-content;
white-space: nowrap;
}
#readyStartup img {
height: 400px;
box-shadow: 0 0 2px 0 #bbb;
margin-top: 2px;
}
#readyStartup img:first-child {
margin-right: 5px;
}
#container {
background-color: white;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 9999;
}
#startup_company, #startup_game, #startup_warning {
display: none;
}
#startup .content {
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
opacity: 0;
transition: opacity 1s;
}
body {
    cursor: url(https://yuluoxk.cn/genshin/cursor.ico), auto;
}
@font-face {
    font-family: "HYWenHei 85W";
    src: url("https://yuluoxk.cn/genshin/genshin.ttf");
}
body.login {
	padding: 0;
	margin: 0;
	background: url(https://kanosaikou.cn/genshin-light.gif);
	background-size: cover;
	background-attachment: fixed
}
.org_title {
	display: none;
}
.notice.col-md-6.col-xs-12.hidden-xs.hidden-sm {
	display: none;
}
.logo {
	display: none;
}
.links {
	display: none;
}
.login-form.col-md-4.col-md-offset-1.col-sm-12.col-xs-12 {
	width: 380px;
	height: 400px;
	/* padding: 15px 26px 0px; */
	border-radius: 4px;
	color: #ffffff;
	background: RGB(252, 255, 255);
	opacity: 1;
	margin: auto;
	bottom: 0;
	z-index: 666;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

h3:after {
	font-size: 18px;
	font-weight: 600;
	content: "HUC WEBVPN HOYO";
	border: 0px !important;
	height: 50px !important;
	text-align: center;
	color: RGB(244, 216, 168);
	font-family: "HYWenHei 85W";
	display: block;
	margin: 0 auto;
}
.input-group-addon {
	display: none;
}
input#user_login.form-control {
	width: 350px;
	height: 50px;
}
input#user_password.form-control {
	width: 350px;
	height: 50px;
}
.btn {
	font-size: 18px;
	width: 100%;
	font-weight: 400;
	font-family: "HYWenHei 85W";
	background-color: RGB(57, 59, 64);
	color: RGB(244, 216, 168);
}
.login-btn input[type="submit"] {
	width: 100%;
}
body.login .login-form input[type="submit"] {
	background: RGB(57, 59, 64);
	width: 100%;
}
body.login .login-form .login-btn input[type="submit"] {
	width: 350px;
	height: 50px;
}
.col-md-offset-6 {
	margin-left: 0%;
}
body.login .login-form .login-btn input[type="submit"]:active {
	background-color: RGB(57, 59, 64)!important;
}
.panel {
	display: none;
}
.external_signin_links a[href="/users/auth/cas"]::before {
	content: "使用HUCHOYO账号登陆";
	font-size: 14px;
	font-family: "HYWenHei 85W";
	color: RGB(244, 216, 168);
}
`;
      html = `<style>${css}</style>` + html;
      return html;
    }

    //启动函数
    function startupContent(page) {
      let t = 1000; //时间间隔
      //MIHOYO
      if (page.company) {
        setTimeout(() => {
          document.getElementById("startup_company").style.display = "block";
          document.getElementById("startup_company").style.opacity = "1";
        }, t);
        t += 3000;
        setTimeout(() => {
          document.getElementById("startup_company").style.display = "none";
        }, t);
      }
      //原神
      if (page.game) {
        setTimeout(() => {
          document.getElementById("startup_game").style.display = "block";
          document.getElementById("startup_game").style.opacity = "1";
        }, t);
        t += 500;
        setTimeout(() => {
          document.getElementById("startup_game_g").style.opacity = "1";
        }, t);
        t += 4000;
        setTimeout(() => {
          document.getElementById("startup_game").style.display = "none";
        }, t);
      }
      //健康游戏忠告
      if (page.warning) {
        setTimeout(() => {
          document.getElementById("startup_warning").style.display = "block";
          document.getElementById("startup_warning").style.opacity = "1";
        }, t);
        setTimeout(() => {
          document.getElementById("container").style.display = "none";
        }, t + 3000);
      }
    }
    startupContent({ company: true, game: true, warning: true });
    let containerElement = document.createElement("div");
    containerElement.id = "container";
    document.body.appendChild(containerElement);

    let htmlCssString = createHtmlCssString();
    containerElement.innerHTML = htmlCssString;

    // 以下为vpn页面代码
    // 修改登录框标题
    let heading = document.querySelector("h3");
    heading.textContent = "";
    // 修改cas登录文字
    let linkElement = document.querySelector(
      '.external_signin_links a[href="/users/auth/cas"]'
    );
    if (linkElement) {
      linkElement.textContent = "";
    }
    // 修改登录按钮文字
    let inputElement = document.querySelector(
      '.login-btn input[type="submit"]'
    );
    if (inputElement) {
      inputElement.value = "进 入 游 戏";
    }
  } else if (LoginJW.test(currentUrl)||LoginJWWebvpn.test(currentUrl) ) {

  }
  else{

  }
})();
