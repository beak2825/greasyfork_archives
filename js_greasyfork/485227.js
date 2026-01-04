// ==UserScript==
// @name         自动登录openId
// @namespace    http://tampermonkey.net/
// @version      2024-01-12
// @description  用于自动登录openid
// @author       l
// @match        https://login.netease.com/accounts/login/?uid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netease.com
// @match        https://login.netease.com/connect/authorize?*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.3.1/sha.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/485227/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95openId.user.js
// @updateURL https://update.greasyfork.org/scripts/485227/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95openId.meta.js
// ==/UserScript==

(function() {

    // googke auth key https://km.netease.com/v4/detail/blog/211904
    var jjlGoogleKey='';

     // 邮箱类型 mesg/corp
    var type='corp';

    // 是否自动点击登录按钮false-补充将军令 true-补充将军令并登录（需要写账号密码）
    var autoClicks = false;
    // 邮箱前缀
    var account='';
    // 密码
    var pwd ='';

    // 获取url不带参数
    var urlWithoutParams = window.location.origin + window.location.pathname;
    console.log(urlWithoutParams);

    // 是否点击登录按钮
    var conditions;

    if('mesg'===type){
        conditions={
            "mesg.corp域登录": {
            "check":true,
            "autoClick":autoClicks
        },
        "mesg.corp域+将军令": {
            "check":true,
            "autoClick":autoClicks,
             "jjl":true
        }
        };
      }
     else if('corp'===type){
        conditions={
        "CORP邮箱帐户登录": {
            "check":true,
            "autoClick":autoClicks
        },
        "CORP邮箱及将军令登录": {
            "check":true,
            "autoClick":autoClicks,
            "jjl":true
        }
        }
     }else {
       console.log("没匹配网址");
      return;
     }

    let verify =checkVerify(autoClicks,account,pwd);
    console.log("verify");
    if(verify){
         return;
    }


     if(urlWithoutParams.includes('accounts/login')){
          // 获取列表项
         var listItems = document.querySelectorAll("#wrap > div.container-fluid > div.row-fluid > div > div > div > div > ul > li");
             // 遍历列表项
         for (var i = 0; i < listItems.length; i++) {
             var innerHTML = listItems[i].querySelector('a').innerHTML.trim();
             // 检查条件并模拟点击
             if (conditions[innerHTML]&&conditions[innerHTML].check) {
                 // 执行相应的操作
                 listItems[i].querySelector('a').click();
                 document.getElementsByClassName("tab-pane  active")[0].querySelector('input[placeholder="帐号"]').value=account;
                 document.getElementsByClassName("tab-pane  active")[0].querySelector('input[placeholder="密码"]').value=pwd;

                 if(conditions[innerHTML].jjl){
                    document.getElementsByClassName("tab-pane  active")[0].querySelector('input[placeholder="将军令"]').value=getGoogleAuth(jjlGoogleKey,'');
                 }

                  //console.log("Found matching text: " + conditions[innerHTML].autoClick);
                 if(conditions[innerHTML].autoClick){
                     // https://login.netease.com/accounts/login/
                     document.getElementsByClassName("tab-pane  active")[0].querySelector('button[type="submit"]').click();
                     document.getElementsByClassName('confirm_btn')[0].click();
                 }
                  break;
             }
         }
     }
    else if (urlWithoutParams.includes('connect/authorize')){
        // 打开选项框
        var groupa =document.getElementsByClassName("oidc-active")[0].getElementsByClassName('control-group')[0];
        groupa.className = 'control-group open';
        var typeList = document.querySelector('div.control-group.open > ul').getElementsByClassName("am_item");
        for (var j = 0; j < typeList.length; j++) {
            var inner = typeList[j].innerHTML.trim();
            if (conditions[inner]&&conditions[inner].check){
                typeList[j].click();
                 if(conditions[inner].jjl){
                    document.getElementsByClassName("oidc-active")[0].querySelector('input[placeholder="将军令"]').value=getGoogleAuth(jjlGoogleKey,'');
                 }
              if(conditions[inner].autoClick){
                  // console.log("autoClick"+conditions[inner].autoClick);
                  document.getElementsByClassName("oidc-active")[0].querySelector('input[placeholder="帐号"]').value=account;
                  document.getElementsByClassName("oidc-active")[0].querySelector('input[placeholder="密码"]').value=pwd;

                  document.getElementsByClassName("oidc-active")[0].querySelector('input.login-submit').click();
                  document.getElementsByClassName('confirm_btn')[0].click();
                  break;
              }
            }
            // console.log(inner);
        }

    }


function getCookie (key) {
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var value = parts.slice(1).join('=');
        try {
          var foundKey = parts[0];
          jar[foundKey] = value;
          if (key === foundKey) {
            break;
          }
        } catch (e) {}
      }
      return key ? jar[key] : jar;
    }

function setCookie(name, value, days) {
        console.log("getCookie"+getCookie(name));
        var cookieValue = getCookie(name);
    if (cookieValue !== undefined && cookieValue !== null && cookieValue !== "") {
        // 执行当cookie存在且不为空时的操作
        console.log("Cookie存在且不为空，数值为: " + cookieValue);
        return; // 如果存在特定名称的 cookie，则直接返回
    }
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  } else {
    expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT"; // 设置一个较远的过期日期
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}





function areNullOrEmpty(...strings) {
  for (let str of strings) {
    if (str === null || str === undefined || str.trim() === '') {
      return true; // 如果任何一个字符串为空或为null，立即返回true
    }
  }
  return false; // 如果所有字符串都不为空且不为null，返回false
}

    function checkVerify(autoClicks,account,pwd){
    if(autoClicks){
        if(areNullOrEmpty(account,pwd)){
         alert("自动登录，账号密码不能为空，account is null or pwd is null！");
            return true;
        }
        return false;
     }
     return false;
    }
 /**
 *补全将军令
 */
function getGoogleAuth(secretBase32, period) {
    let stepSeconds = Number.isInteger(Number(period)) && Number(period) > 0 ? Number(period) : 30;
    let tokenLength = 6;

    function decToHex(dec) {
        return dec.toString(16);
    }

    function hexToDec(hex) {
        return parseInt(hex, 16);
    }

    function base32ToHex(base32) {
        let base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = base32.split('')
            .map(char => {
                let val = base32chars.indexOf(char.toUpperCase());
                if (val < 0) {
                    throw new Error("Illegal Base32 character: " + char);
                }
                return val;
            })
            .map(val => val.toString(2).padStart(5, '0'))
            .join('');

        return bits.match(/.{4}/g)
            .map(chunk => parseInt(chunk, 2).toString(16))
            .join('');
    }

    if (secretBase32.length < 16) {
        throw new Error("Secret minimum length is 16, but was only" + secretBase32.length);
    }

    let secretHex = base32ToHex(secretBase32);
    if (secretHex.length % 2 !== 0) {
        secretHex += '0';
    }
    let counter = Math.floor(Date.now() / 1000 / stepSeconds);
    let counterHex = decToHex(counter);

    let shaObj=new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey(secretHex, "HEX");
    shaObj.update(counterHex.padStart(16, "0"));
    let hmac = shaObj.getHMAC("HEX");
    let offset = hexToDec(hmac.slice(-1));
    return String(hexToDec(hmac.substr(offset * 2, 8)) & hexToDec('7fffffff')).toString().slice(-tokenLength);
}



})();