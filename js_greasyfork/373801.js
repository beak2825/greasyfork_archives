// ==UserScript==
// @name         MVOT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  do not spread, use by your own risk!
// @author       You
// @match        http://oa.mobvista.com:6060/seeyon/collaboration/collaboration.do?method=newColl&from=templateNewColl*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373801/MVOT.user.js
// @updateURL https://update.greasyfork.org/scripts/373801/MVOT.meta.js
// ==/UserScript==

(function() {
    'use strict';


    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var NineThirty = new Date();
    NineThirty.setHours(9);
    NineThirty.setMinutes(30);
    NineThirty.setSeconds(0);

    var Ten = new Date();
    Ten.setHours(10);
    Ten.setMinutes(0);
    Ten.setSeconds(0);

    var Nineteen = new Date();
    Nineteen.setHours(19);
    Nineteen.setMinutes(0);
    Nineteen.setSeconds(0);


    var NineteenteenThirty = new Date();
    NineteenteenThirty.setHours(19);
    NineteenteenThirty.setMinutes(30);
    NineteenteenThirty.setSeconds(0);


    function getTime(str)
    {
        var ss = str.split(":");
        var t = new Date();
        t.setHours(parseInt(ss[0]));
        t.setMinutes(parseInt(ss[1]));
        t.setSeconds(0);

        return t;
    }

    var str="[[{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'1','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''}],[{'name':'2','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''},{'name':'3','team':'工作日</br>[上班]-签到：09:36<br/>[下班]-签退：19:51<br/>','val':'','color':'','bgColor':''},{'name':'4','team':'工作日</br>[上班]-签到：09:07<br/>[下班]-签退：19:05<br/>','val':'','color':'','bgColor':''},{'name':'5','team':'工作日</br>[上班]-签到：09:12<br/>[下班]-签退：19:03<br/>','val':'','color':'','bgColor':''},{'name':'6','team':'工作日</br>[上班]-签到：09:16<br/>[下班]-签退：20:31<br/>','val':'','color':'','bgColor':''},{'name':'7','team':'工作日</br>[上班]-签到：09:24<br/>[下班]-签退：20:43<br/>','val':'','color':'','bgColor':''},{'name':'8','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''}],[{'name':'9','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''},{'name':'10','team':'工作日</br>[上班]-签到：09:20<br/>[下班]-签退：19:08<br/>','val':'','color':'','bgColor':''},{'name':'11','team':'工作日</br>[上班]-签到：09:13<br/>[下班]-签退：21:41<br/>','val':'','color':'','bgColor':''},{'name':'12','team':'工作日</br>[上班]-签到：10:12<br/>[下班]-签退：21:11<br/>','val':'','color':'','bgColor':''},{'name':'13','team':'工作日</br>[上班]-签到：10:06<br/>[下班]-签退：21:38<br/>','val':'','color':'','bgColor':''},{'name':'14','team':'工作日</br>[上班]-签到：10:06<br/>[下班]-签退：19:37<br/>','val':'','color':'','bgColor':''},{'name':'15','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''}],[{'name':'16','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''},{'name':'17','team':'工作日</br>[上班]-签到：09:27<br/>[下班]-签退：21:36<br/>','val':'','color':'','bgColor':''},{'name':'18','team':'工作日</br>[上班]-签到：10:07<br/>[下班]-签退：19:21<br/>','val':'','color':'','bgColor':''},{'name':'19','team':'工作日</br>[上班]-签到：10:20<br/>[下班]-签退：22:03<br/>','val':'','color':'','bgColor':''},{'name':'20','team':'工作日</br>[上班]-签到：09:27<br/>[下班]-签退：21:32<br/>','val':'','color':'','bgColor':''},{'name':'21','team':'工作日</br>[上班]-签到：08:43<br/>[下班]-签退：19:17<br/>','val':'','color':'','bgColor':''},{'name':'22','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''}],[{'name':'23','team':'周末</br>[上班]-无考勤<br/>[下班]-无考勤<br/>','val':'','color':'','bgColor':''},{'name':'24','team':'工作日</br>[上班]-<font color=red>缺勤</font><br/>[下班]-<font color=\"red\">缺勤</font><br/>','val':'','color':'','bgColor':''},{'name':'25','team':'工作日</br>[上班]-签到：10:13<br/>[下班]-签退：22:06<br/>','val':'','color':'','bgColor':''},{'name':'26','team':'工作日</br>[上班]-签到：09:07<br/>[下班]-签退：09:07<br/>','val':'','color':'','bgColor':'yellow'},{'name':'27','team':'工作日</br>[上班]-无考勤数据<br/>[下班]-无考勤数据<br/>','val':'','color':'','bgColor':''},{'name':'28','team':'工作日</br>[上班]-无考勤数据<br/>[下班]-无考勤数据<br/>','val':'','color':'','bgColor':''},{'name':'29','team':'工作日</br>[上班]-无考勤数据<br/>[下班]-无考勤数据<br/>','val':'','color':'','bgColor':''}],[{'name':'30','team':'工作日</br>[上班]-无考勤数据<br/>[下班]-无考勤数据<br/>','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''},{'name':'','team':'','val':'','color':'','bgColor':''}]]"

    str = str.replace(/"/g, "").replace(/'/g, '"');

    var total = 0;

    //getOTs(str);
    //return;

    function getOTs(str)
    {
        var ots = [];
        var myJson = JSON.parse(str);
        for (var i = 0; i < myJson.length; i++)
        {
            for (var j = 0; j < myJson[i].length; j++)
            {
                var item = myJson[i][j];
                // 			console.log(item)
                if (item.team && item.team.indexOf("签到") >=0)
                {
                    // 				console.log(item.team);
                    var ss = item.team.split("br");
                    // 				console.log(ss);
                    var start = getTime(ss[1].split("：")[1]);
                    var end = getTime(ss[2].split("：")[1]);
                    var offset = 0;
                    if (start < NineThirty)
                        start = NineThirty;
                    if (start > Ten)
                        offset = 30 * 60 * 1000;

                    start = new Date(start.getTime() + 9 * 60 * 60 * 1000 + offset);
                    var overTime = end.getTime() - start.getTime();
                    if (start < NineteenteenThirty)
                        overTime -= NineteenteenThirty.getTime() - Math.max(Nineteen.getTime(), start.getTime());
                    overTime = Math.floor(overTime / (60 * 60 * 1000));
                    if (overTime >= 1)
                    {
                        total += overTime;
                        start.setDate(parseInt(item.name));
                        end.setDate(parseInt(item.name));
                        var ot = [start.Format("yyyy-MM-dd hh:mm"), end.Format("yyyy-MM-dd hh:mm")];
                        console.log("overtime " + ot[0] + "," + ot[1] + "," + overTime + "," + ss[0]);
                        ots.push(ot);
                    }
                }
            }
        }
        console.log("total ovetime:" + total);
        return ots;
    }

    var ots;

    var curUserID;


    function fetchData(userID)
    {
        var t = new Date();
        var arg = [t.Format("yyyy"), t.Format("MM"), userID];
        console.log(JSON.stringify(arg));

        var formData = new FormData();
        formData.append("managerMethod", "PersonageKqShow");
        formData.append("arguments", JSON.stringify(arg));

        var rnd = Math.ceil(Math.random() * 10000);
        fetch("http://oa.mobvista.com:6060/seeyon/ajax.do?method=ajaxAction&managerName=personageKqManage&rnd=" + rnd, {"credentials":"include","headers":{},"referrer":"http://oa.mobvista.com:6060/seeyon/personageKqController.do?method=listPersonageKq&_resourceCode=KQpersonage","referrerPolicy":"no-referrer-when-downgrade","body":formData,"method":"POST","mode":"cors"}).then(function(res){
            return res.json();
        }).then(function(data){
            data = data.split("content:")[1];
            data = data.replace(/"/g, "").replace(/'/g, '"');
            // 	console.log(data);
            ots = getOTs(data.substring(0, data.length - 2));
            console.log(ots);

            //alert("数据获取成功! " + t.Format("M") + "月总计加班时间：" + total + "小时");
        });
    }

    var timer;

    var index = 0;
    var checked = [];

    function ohYes() {
        var subject = document.getElementById("subject");
        if (!subject)
            return;

        if (subject.value.indexOf("加班申请") < 0)
        {
            clearInterval(timer);
            return;

        }


        var iframe = document.getElementById('zwIframe');
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

        if (!curUserID)
        {
            curUserID = innerDoc.getElementById("field0002_span");

            if (curUserID)
            {
                console.log(curUserID);

                fetchData(eval('(' + curUserID.getAttribute("fieldval") +')').value);
            }
        }

        if (! ots)
        {
            return;
        }

        console.log("check");
        var table = innerDoc.getElementsByClassName("xdRepeatingTable msoUcTable")[0];

                clearInterval(timer);
        for (var i = 0; i < ots.length; i++)
        {

            var cells = table.rows[1].getElementsByClassName("validate xdRichTextBox comp");
            if (cells.length <= 0)
                break;

            cells[0].value = ots[i][0];
            cells[1].value = ots[i][1];

            cells[1].focus();
            cells[0].focus();

            if (i == 0)
            {
                cells[0].click();
            }
            if (i == ots.length - 1)
            {
                console.log("all set!");
                var t = new Date();
                alert("数据获取成功! " + t.Format("M") + "月总计加班时间：" + total + "小时");
                break;
            }
            else
            {
                innerDoc.getElementById("addImg").click();
            }
        }

//         for (var i = table.rows.length - 1; i >= 0; i--)
//         {
//             if (index >= ots.length)
//             {
//                 console.log("all set!");
//                 alert("all set!");
//                 clearInterval(timer);
//                 break;
//             }

//             var cells = table.rows[i].getElementsByClassName("validate xdRichTextBox comp");
//             if (cells.length > 0 && checked.indexOf(cells[0]) < 0)
//             {
//                 cells[0].value = ots[index][0];
//                 cells[1].value = ots[index][1];

//                 cells[1].focus();
//                 cells[0].focus();

//                 checked.push(cells[0]);

//                 index++;
//             }
//         }
    }


    timer = setInterval(ohYes, 1000);
    // Your code here...
})();