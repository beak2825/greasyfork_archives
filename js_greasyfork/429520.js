// ==UserScript==
// @name         PriceReader
// @namespace    http://tampermonkey.net/
// @description  依檬定制脚本
// @version      0.2
// @author       You
// @include      *://p.zwjhl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429520/PriceReader.user.js
// @updateURL https://update.greasyfork.org/scripts/429520/PriceReader.meta.js
// ==/UserScript==


    function formatDate(now) {
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    return [year,month,date,year+"-"+month+"-"+date]; //year+"-"+month+"-"+date
}

(function (console) {
    console.save = function (data, filename) {
        let MIME_TYPE = "text/json";
        if (!data) return;
        if (!filename) filename = "console.json";
        if (typeof data === "object") data = JSON.stringify(data, null, 4);

        let blob = new Blob([data], { tyoe: MIME_TYPE });
        // 创建事件
        let e = document.createEvent("MouseEvent");
        // 创建一个a链接
        let a = document.createElement("a");
        // 设置a链接下载文件的名称
        a.download = filename;
        // 创建下载的URL对象（blob或者file）
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(":");
        // 初始化事件
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // 触发事件
        a.dispatchEvent(e);
    }
})(console)

function myFunc(){
    window.document;
    var list = flotChart.data;
    console.log(list);
    var listData = '\n' + "Time" + "              " + "Price" + '\n';
    var minn618=9999999,minn1111=9999999;
    var time618,time1111;

    var date,operatedTime;
    for(let i = 0; i < list.length; i++){
            //统计618期间的最低价
            date = new Date(list[i][0]);
            operatedTime = formatDate(date);

            if(operatedTime[0] === 2021 && operatedTime[1] === 6 && Number(operatedTime[2]) >= Number(11) && Number(operatedTime[2]) <= Number(25) )
            {
                if(minn618>Number(list[i][1]))
                {
                    minn618=Number(list[i][1]);
                    time618=operatedTime[3];
                }
            }
            //统计双十一期间的最低价

            if(operatedTime[0] === 2020 && operatedTime[1] === 11 && Number(operatedTime[2]) >= Number(4) && Number(operatedTime[2]) <= Number(18) )
            {
                if(minn1111>Number(list[i][1]))
                {
                    minn1111=Number(list[i][1]);
                    time1111=operatedTime[3];
                }
            }
    }

    var fileName = document.querySelector('h1').textContent.slice(25,200);
    console.save((minn618+"  "+minn1111),(fileName + '.txt'));
}
setTimeout(()=>{console.log("5");
               myFunc();
               },200);
