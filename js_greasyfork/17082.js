// ==UserScript==
// @name Login HCMUS Portal
// @description Tu dong dang nhap HCMUS Portal
// @include http://portal*.hcmus.edu.vn/Login.aspx*
// @version 0.0.1.20160215032714
// @namespace https://greasyfork.org/users/14513
// @downloadURL https://update.greasyfork.org/scripts/17082/Login%20HCMUS%20Portal.user.js
// @updateURL https://update.greasyfork.org/scripts/17082/Login%20HCMUS%20Portal.meta.js
// ==/UserScript==
var mssv;
var password;
var timeout;
change = function()
{
    localStorage.setItem("mssv", mssv = prompt("MSSV", ""));
    localStorage.setItem("password", password = prompt("Password", ""));
    clearTimeout(timeout);
    if(mssv != null && password != null)
        timeout = setTimeout(run,600);
    else
    {
        localStorage.removeItem("mssv");
        localStorage.removeItem("password");
    }
};
function login() {
    if( mssv == null || mssv == "") return;
    document.getElementsByName("ctl00$ContentPlaceHolder1$txtUsername")[0].value = mssv;
    document.getElementsByName("ctl00$ContentPlaceHolder1$txtPassword")[0].value = password;
    document.getElementsByName("ctl00$ContentPlaceHolder1$btnLogin")[0].click();
}
isLogin = function(){
var body = document.body;
var textContent = body.textContent || body.innerText;
return textContent.indexOf("Đăng nhập") > -1;
}
var button= document.createElement("button");
button.innerHTML = "Change Info";
button.onclick = change;
document.body.insertBefore(button,document.body.childNodes[0]);

if(window.localStorage.getItem('mssv') === null){
    change();
}
else{
    mssv = window.localStorage.getItem('mssv');
    password = window.localStorage.getItem('password');
}
timeout = setTimeout(login,600);
setTimeout(function(){
window.location.reload();
},5000);
if(!isLogin()) window.location.reload();