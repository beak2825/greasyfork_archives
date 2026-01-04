// ==UserScript==
// @name         TLY自动填验证码签到
// @namespace    TLY自动签到
// @version      0.2
// @description  TLY自动填验证码签到,使用梦远API接口
// @author       cgbsmy
// @match        https://tly70.com/modules/index.php
// @match        http://tly70.com/modules/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tly70.com
// @license      GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456776/TLY%E8%87%AA%E5%8A%A8%E5%A1%AB%E9%AA%8C%E8%AF%81%E7%A0%81%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/456776/TLY%E8%87%AA%E5%8A%A8%E5%A1%AB%E9%AA%8C%E8%AF%81%E7%A0%81%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

function urlencode (str){
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function drawBase64Image (img){
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL('image/');
    return dataURL;
}
if(document.querySelector("body > div.wrapper > div > section.content > div:nth-child(2) > div:nth-child(3) > div > div.box-body > p:nth-child(2) > button").innerText!="不能签到"){
    let image = new Image();
    image.src = '/other/captcha.php';
    image.crossOrigin = '*';
    var base64;
    image.onload = function(){
        base64 = drawBase64Image(image);
        var xml = new XMLHttpRequest();
        xml.open("POST", "https://www.youwk.cn/code/ocr");
        xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    //    xml.setRequestHeader("Authorization","APPCODE deda91003cd14a9ba321b9749d7b1239");
        xml.onreadystatechange=function(){
            if(xml.readyState==4){
                if(xml.status==200){
                    var obj = JSON.parse(xml.responseText);
                    console.log(xml.responseText);
                    document.getElementsByTagName("input")[0].value = obj.data.code_data;
                    document.getElementsByTagName("input")[1].click();
                }
            }
        }
        xml.send('key=rBGHNzUvO6s6QrrYd9LqMTtJuHUxsT&img='+urlencode(base64.slice(22)));
    }
}