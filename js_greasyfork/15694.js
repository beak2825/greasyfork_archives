
// ==UserScript==
// @name         根据时间计算餐补
// @namespace    http://wiki.sankuai.com/pages/viewpage.action?pageId=355202639
// @version      0.5.1
// @description  根据时间计算餐补的User Script，适用于美团考勤系统。增加了一个按钮用于高亮日期。
// @author       好心人(包括但不限于吕欣^_^)
// @match        http://kq.sankuai.info/node/tm*
// @icon         http://kq.sankuai.info/static/image/logo.ico?cd0a9a2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15694/%E6%A0%B9%E6%8D%AE%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E9%A4%90%E8%A1%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/15694/%E6%A0%B9%E6%8D%AE%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E9%A4%90%E8%A1%A5.meta.js
// ==/UserScript==
 
function a() {
    console.log("Start Computing")
    var dates=[];
    var eles=[];
    if (document.querySelectorAll('html /deep/ .com-panel').length == 0) {
        console.log("com-panel not load");
        return setTimeout(a, 100);
    } else {
        Array.prototype.slice.call(document.querySelectorAll('html /deep/ .com-panel')).forEach(
            // document.querySelectorAll('html /deep/ .com-panel').array().forEach(
            function(item)
            {
                var date=item.querySelector('.com-t-day').innerText;
                if(date.indexOf('/')!=-1)
                    return;
                if(hasClass(item.children[1], 'com-delay-rest'))
                    // 不包括休息日加班
                    return;
                item=item.querySelector('.com-f-time');

                var endTime=item.children[1].innerText;
                endTime=endTime&&parseInt(endTime.split(":")[0]);
                var startTime=item.children[0].innerText; // 适用于早上忘记打卡只有晚上下班的一次刷卡记录的情况，哇咔咔
                startTime=startTime&&parseInt(startTime.split(":")[0]);

                if(endTime>=20 || startTime>=20) {
                    dates.push(date);
                    eles.push(item);
                }
            }
        );
        month = document.querySelector('html /deep/ h3').innerHTML;
        window.canbuInfo = month + dates.join(',') + "共" + dates.length + "天," + (dates.length*18) + "元";
        window.eles = eles;
        insertTip(dates.length);
    }
}
function clickbtn() {
    document.querySelector("html /deep/ button#btn-prev").addEventListener('click', function() {setTimeout(a, 1000);});
    document.querySelector("html /deep/ button#btn-next").addEventListener('click', function() {setTimeout(a, 1000);});
    console.log("add click function succeed");
}
function checkbtn() {
    btn = document.querySelector("html /deep/ button#btn-prev");
    if(btn == null) {
        console.log("wait for button");
        return setTimeout(checkbtn, 10);
    }
    else {
        clickbtn();
    }
}

function insertTip(days) {
    var node = document.createElement('p');
    node.className = "ka-info-detail kq-info-rest"
    node.innerHTML = "餐补<span> "+days+" </span>天，共<span> "+days*18+" </span>元。<button id='btnHighlight'>高亮餐补</button>"
    var prevNode = document.querySelector("html /deep/ p.ka-info-detail.kq-info-bad");
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    
    document.querySelector("html /deep/ button#btnHighlight").addEventListener('click', highlight, false);
}

function highlight() {
    Array.prototype.slice.call(window.eles).forEach(
        function(item)
        {
            item.style.webkitBoxShadow="0 0 3px 3px red"
        }
    );
    confirm(window.canbuInfo);
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
setTimeout(a, 10);
setTimeout(checkbtn, 10);