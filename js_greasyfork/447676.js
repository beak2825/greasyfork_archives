// ==UserScript==
// @name               国开新平台自动登录
// @namespace          https://iam.pt.ouchn.cn/
// @version            1.2.5
// @description        国开统一认证管理系统自动识别验证码登录
// @author             delfino
// @match              https://iam.pt.ouchn.cn/am/UI/Login*
// @license            MIT
// @require            https://unpkg.com/tesseract.js@v2.1.5/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/447676/%E5%9B%BD%E5%BC%80%E6%96%B0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447676/%E5%9B%BD%E5%BC%80%E6%96%B0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
// "use strict";

const delay = 2000;
const captcha_regex = /[A-Za-z0-9]/g;
const salt="delete";
let usr=localStorage.getItem("username")
let pwd=localStorage.getItem("password")
if (null==usr || usr.length<1){usr="username"}
if (null==pwd || pwd.length<1){pwd="password"}
const username=strDec(usr,salt,"","")
const password=strDec(pwd,salt,"","")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function react_input(component, value) {
  let last_value = component.value;
  component.value = value;
  let event = new Event("input", {bubbles: true});
  event.simulated = true;
  let tracker = component._valueTracker;
  if (tracker) {
    tracker.setValue(last_value);
  }
  component.dispatchEvent(event);
}

async function recognize() {
  var img=new Image();
  img.src="https://iam.pt.ouchn.cn/am/validate.code"
  let result = "";
  await Tesseract.recognize(img.src, "eng")
      .then(({ data: { text } }) => {
          if(text){
              result = text.match(captcha_regex).join("");
          }else{
              location.reload();
          }
      });
  console.log("Recognized: " + result);
  return result;
}
function funcLogin(){
    let usr=document.getElementById("loginName").value;
    let pwd=document.getElementById("password").value;
    localStorage.setItem("username",strEnc(usr,salt,"",""));
    localStorage.setItem("password",strEnc(pwd,salt,"",""));
}

async function solve() {
  if (document.getElementById("validateCode")) {
    let n=1
    let siv=setInterval(function(){
        react_input(document.getElementById("validateCode"), "正在识别验证码 "+n);
        ++n;
    },1000)
    try{
      console.time("Elapsed time")
      let result = await recognize();
      console.timeEnd("Elapsed time")
      clearInterval(siv);
      if (result.length!=4) {location.reload()}
      react_input(document.getElementById("loginName"),username);
      react_input(document.getElementById("password"),password);
      react_input(document.getElementById("validateCode"), result);
      console.log("Submitting: " + result);
    }catch(e){
        console.log(e);
        react_input(document.getElementById("validateCode"), "出错了，刷新吧 :(");
    }
  }
}

console.log("Starting recognization...")
document.getElementById("button").addEventListener("mousedown",funcLogin,true)
solve().then();
