// ==UserScript==
// @name         AutoTool_DownloadASMR
// @namespace    https://github.com/XiaoLinXiaoZhu/AutoTools/tree/main/ASMRTools
// @version      0.3
// @description  XLXZ's 自动下载ASMRGAY中的压缩包的小工具，未来可能会增加更多功能
// @author       XLXZ
// @match        https://www.asmrgay.com/*
// @match        https://cczhhz.asmr.icu/*
// @match        https://www.asmr.pw/*
// @grant        none
// @require
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484096/AutoTool_DownloadASMR.user.js
// @updateURL https://update.greasyfork.org/scripts/484096/AutoTool_DownloadASMR.meta.js
// ==/UserScript==


var shutdown;
var emptyTimes;


//主程序
window.onload=function(){
    shutdown =0;
    emptyTimes = 0;
};


function getEndingNumber(str) {
    // 正则表达式匹配结尾的1到3位数字
    var match = str.match(/\d{1,3}$/);

    // 如果找到匹配项，则返回数字部分
    return match ? parseInt(match[0], 10) : null;
  }


function tryNextUrl(){
    var currentUrl = window.location.href;
    console.log("=====Now Url is : " + currentUrl);
    var newUrl = currentUrl.slice(0, -4);
    var match = getEndingNumber(newUrl)
    console.log("=====Now Match Url is : " + newUrl);
    console.log("=====Now Match is : " + match);
    if (match) {
        // 提取出数字部分，并转换为整数
        var numberPart = parseInt(match, 10);

        if(numberPart>=9){
            newUrl = newUrl.slice(0, -2);
        }
        else newUrl = newUrl.slice(0, -1);

        numberPart ++;

        newUrl = newUrl + numberPart + '.rar';
        console.log("=====Next Url is :" + newUrl);
        window.location.href = newUrl;
    }
}

function tryPartUrl(){
    var currentUrl = window.location.href;
    var newUrl = currentUrl.slice(0, -3);
    newUrl += 'part1' + '.exe';
    window.open(newUrl, '_top');
}

// 设置延时3秒后执行
setTimeout(function() {
    // 获取class包含"hope-button"的所有元素
    //alert("match url");

    function checkButton() {




        var currentUrl = window.location.href;  //获取当前url并分析结尾
        var lastThreeChars = currentUrl.slice(-3);
        console.log("analying url,end with :"+lastThreeChars);

        if(lastThreeChars != "zip" && lastThreeChars != "exe" && lastThreeChars != "rar"){
            console.log(lastThreeChars + "This is a normal page,stop running");
            clearInterval(intervalId); // 停止定时器
        }


        console.log('getting');
        var test = document.querySelector("#root > div.hope-c-PJLV.hope-c-PJLV-iicyfOA-css > div > div > div > div:nth-child(3) > div > a");
        if(!test){
            test = document.querySelector("#root > div.hope-c-PJLV.hope-c-PJLV-iicyfOA-css > div > div > div > div:nth-child(3) > div > a");
        }

        if(!test && lastThreeChars == "zip"){
            if(emptyTimes > 3){               //如果没有get到且最后为zip，那么可能是加载失误或者文件分part
                tryPartUrl();
            }
            else{
                emptyTimes++;
            }
        }

        if (test && lastThreeChars == "zip") {
            console.log(test);         //如果get到了且最后为zip，那么这个就是文件的末尾
            var js = test.href;
            window.location.href = js;
            console.log(js);
            alert("已开始下载")
            shutdown = 1;
            clearInterval(intervalId); // 防止继续无谓的检查，一旦条件满足就停止定时器
        }

        if(lastThreeChars == "exe" || lastThreeChars == "rar"){
            console.log("===== part mod now!");
            if(!test){
                console.log("===== didn't get the button,try times:"+emptyTimes);
                if(emptyTimes > 3){                 //如果没有get到，那么可能是加载失误或者文件到了结尾
                    shutdown = 1;
                }
                else{
                    emptyTimes++;
                }
            }
            else{
                js = test.href;
                window.open(js, '_blank');
                //window.location.href = js;
                //console.log(js);

                console.log("尝试打开下一页面");
                tryNextUrl();
            }
        }
      }

      // 设置每1500毫秒（即1.5秒）执行一次checkBoolValue函数
      var intervalId = setInterval(checkButton, 1500);
}, 2000); // 延迟2秒（2000毫秒）


setTimeout(function() {
    function checkBoolValue() {

        var currentUrl = window.location.href;//获取当前url并分析结尾
        var lastThreeChars = currentUrl.slice(-3);

        if(lastThreeChars != "zip" && lastThreeChars != "exe" && lastThreeChars != "rar"){
            console.log(lastThreeChars + "This is a normal page,stop detect ShutDown");
            clearInterval(intervalId); // 停止定时器
        }
        if (shutdown == 1) {
            window.open("about:blank", "_top").close();
            alert("关闭页面……")
            clearInterval(intervalId); // 防止继续无谓的检查，一旦条件满足就停止定时器
        } else {
          console.log("shutdown == 0");
        }
      }

      // 设置每2000毫秒（即2秒）执行一次checkBoolValue函数
      var intervalId = setInterval(checkBoolValue, 2000);
}, 18000); // 延迟18秒

