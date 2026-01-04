// ==UserScript==
// @name         CheatYuan
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  For TiPaiPai Automatic Item Qs Observing
// @author       jiaqiyi
// @match        https://research.zhenguanyu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant    GM_addStyle
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/424806/CheatYuan.user.js
// @updateURL https://update.greasyfork.org/scripts/424806/CheatYuan.meta.js
// ==/UserScript==
GM_addStyle ( `
.__wm {
background-image: none !important;
}
` );

function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}

// 在这里调节页面加载时间
var loading_time = 700;

console.log(GM_getValue('date'));
console.log(GM_getValue('ansCount'));
// 按日期刷新计数
var today = new Date();
let date = today.getDate();
if (!isNaN(GM_getValue('date'))){
    if(date !== GM_getValue('date')){
        // 新的一天
        GM_setValue('ansCount',0);
        GM_setValue('date', date);
    }
}else{
    // 初始化
    GM_setValue('ansCount',0);
    GM_setValue('date', date);
}

// 做题计数
var item_count;
if (!isNaN(GM_getValue('ansCount'))){
    item_count = GM_getValue('ansCount');
}else{
    item_count = 0;
}

AddButton();
plus();

function plus(){
    // 等待页面加载完毕
    waitForKeyElements ("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)", actionFunction);
    // waitForKeyElements("body > div.ng-scope > div > div.research-group.research-border > button:nth-child(9)", actionFunction);
}

function actionFunction () {
    // 整体延后一段时间，避免有的DOM节点没出来，会报错
    setTimeout(function(){
        let src = document.querySelector("body > div.ng-scope > div > div.ng-scope > div.col-md-7 > div.alert.alert-success.ng-scope > div > div:nth-child(2) > div.pull-right.ng-isolate-scope > div > span.label.label-info.ng-binding.ng-scope").textContent;
        var id = document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div.alert.alert-success.ng-scope > div > div.ng-scope > label").textContent;
        // console.log(id);
        document.querySelector("body > button").innerHTML = item_count;
        // 可用
        document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)").click();

        // 有无高质量
        var has_high = document.querySelector("body > div.ng-scope > div > div.ng-scope > div.col-md-5.ng-scope > div:nth-child(3) > div > div.ng-scope > label");
        if (has_high === null){
            document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(2)").click();
        }else{
            document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)").click();
        }

        // 解析
        var has_detail = document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div.alert.alert-success.ng-scope > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > label");
        if (has_detail === null){
            // 没有解析框

            // 检查答案框是否有图片
            let ans_box = document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div.alert.alert-success.ng-scope > div > div:nth-child(2) > div:nth-child(5) > div");
            let has_img = ans_box.getElementsByTagName("img").length;
            if(!has_img){
                // 无图片，进一步判断是否有“解析”字样
                let ans_str = document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div.alert.alert-success.ng-scope > div > div:nth-child(2) > div:nth-child(5) > div > div").textContent;
                if(ans_str.indexOf("解析") != -1 || ans_str.indexOf("解：") != -1){
                    // 解析位置不对
                    document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > span:nth-child(14)").click();
                }else{
                    // 无解析
                        if(src !== "框图" && src !== "口算在线抄写"){
                            document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > span:nth-child(11)").click();}
                }
            }else{
                // 有图片，判断图片大小
                let img = ans_box.getElementsByTagName("img")[0];
                if (img.height <= 200){
                    // 无解析
                        if(src !== "框图" && src !== "口算在线抄写"){
                            document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > span:nth-child(11)").click();}
                }else{
                    // 解析位置不对
                    document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > span:nth-child(14)").click();
                }
            }
        }

        // 正确率字样
        let ans_text = document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div.alert.alert-success.ng-scope > div > div:nth-child(2) > div:nth-child(5) > div:nth-child(1) > div").textContent;
        if(ans_text.indexOf("正确率") != -1){
            // 存在无关文本
            document.querySelector("body > div.ng-scope > div > div.ng-scope > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(7)").click();
        }
    }, loading_time);
}

// 增加按钮
function AddButton() {
    var toTopBtn = document.createElement('button')
    toTopBtn.innerHTML = ""
    toTopBtn.className = "nextButton"
    toTopBtn.onclick = function (e) {
        // 点击保存并下一页
        document.querySelector("body > div.ng-scope > div > div.research-group.research-border > button:nth-child(9)").click();
        waitForKeyElements("body > div.ng-scope > div > div.research-group.research-border > button:nth-child(9)", actionFunction);
        //setTimeout(actionFunction, loading_time);
        count_in();
    }
    var body = document.body
    var style = document.createElement('style')
    style.id = "nextButton-style"
    var css = `.nextButton{
      position: fixed;
    bottom: 25%;
    right: 20%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 15px;
    z-index: 999;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
background-color:LightGreen;
    }`
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    body.appendChild(toTopBtn)
    body.appendChild(style)
}

// 做题计数
function count_in(){
    item_count += 1;
    GM_setValue('ansCount', item_count);
    document.querySelector("body > button").innerHTML = item_count;
}

// 方向右键下一题
document.onkeydown = function(ev){
    ev = ev || window.event;
    if(ev.keyCode == 39 && ev.ctrlKey){
        // automatic
        setInterval(function(){
            let random_delay = Math.round(Math.random() * 1000);
            setTimeout(function(){
                document.querySelector("body > div.ng-scope > div > div.research-group.research-border > button:nth-child(9)").click();
                waitForKeyElements("body > div.ng-scope > div > div.research-group.research-border > button:nth-child(9)", actionFunction);
                count_in();
            }, random_delay)
        }, 8000)
    }
    else if(ev.keyCode == 39){
        ev.preventDefault();
        document.querySelector("body > button").click();
    }
}
