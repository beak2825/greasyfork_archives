// ==UserScript==
// @name         Lucifer's Portal
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Login Portal Hcmus
// @author       Anh Hoàng siêu cấp đẹp trai
// @license      MIT
// @supportURL   https://www.facebook.com/lcf.star
// @match        https://portal2.hcmus.edu.vn/Login.aspx
// @include      https://portal*.hcmus.edu.vn/Login.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371059/Lucifer%27s%20Portal.user.js
// @updateURL https://update.greasyfork.org/scripts/371059/Lucifer%27s%20Portal.meta.js
// ==/UserScript==
function addStyle(css)
{
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}
addStyle('button {  color: white; text-align: center; margin-top: 20px;  line-height: 60px;  font-weight: bold;  padding: 0 40px;  background: salmon;  border: none; white-space: pre;}');
addStyle('button:hover {  background: lightsalmon;}')

var mssv;
var password;
var timeout;
var flagLogin = function()
{
    var body = document.body;
    var textContent = body.textContent || body.innerText;
    return textContent.indexOf("Đăng nhập") > -1;
}
function login() {
    if( mssv == null || mssv == "") return;
    document.getElementsByName("ctl00$ContentPlaceHolder1$txtUsername")[0].value = mssv;
    document.getElementsByName("ctl00$ContentPlaceHolder1$txtPassword")[0].value = password;
    document.getElementsByName("ctl00$ContentPlaceHolder1$btnLogin")[0].click();
}
function reload()
{
    window.location.reload();
}
var change = function()
{
    localStorage.setItem("mssv", mssv = prompt("Nhập mssv nà:",""));
    localStorage.setItem("password", password = prompt("Nhập password nà:",""));
    clearTimeout(timeout);
    if((mssv != null) && (password != null))
    {
        timeout = setTimeout(login,50);
    }
    else
    {
        localStorage.removeItem("mssv");
        localStorage.removeItem("password");
    }
};
var button= document.createElement("button");
button.innerHTML = "Đổi thông tin nà!<br>Made by Lucifer";
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);
button.onclick = change;
document.body.insertBefore(button,document.body.childNodes[0]);

if(window.localStorage.getItem('mssv') === null)
{
    change();
}
else{
    mssv = window.localStorage.getItem('mssv');
    password = window.localStorage.getItem('password');
}
timeout = setTimeout(login,50);
setTimeout(reload,5000);
while(!flagLogin())
{
    reload();
    login();
}