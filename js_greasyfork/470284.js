// ==UserScript==
// @name         湖北汽车工业学院教务系统我的成绩智能汇报
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  湖北汽车工业学院教务系统学生“我的成绩”智能汇报。
// @author       信管201张辉
// @icon           data:image/png;base64,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
// @match        https://eas.wvpn.huat.edu.cn/Grade/GradeQuery.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470284/%E6%B9%96%E5%8C%97%E6%B1%BD%E8%BD%A6%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%91%E7%9A%84%E6%88%90%E7%BB%A9%E6%99%BA%E8%83%BD%E6%B1%87%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/470284/%E6%B9%96%E5%8C%97%E6%B1%BD%E8%BD%A6%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%91%E7%9A%84%E6%88%90%E7%BB%A9%E6%99%BA%E8%83%BD%E6%B1%87%E6%8A%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //document.querySelectorAll("#maincontent div:nth-child(4) table tbody tr")[i]
    var trs = document.querySelectorAll("#maincontent div:nth-child(4) table tbody tr").length
    //挂科课程信息
    var arr = new Array();
    for(var i=1;i<trs-1;i++){
     var courseName = document.querySelectorAll("#maincontent div:nth-child(4) table tbody tr")[i].querySelector("td:nth-child(4)").innerText
     var result = document.querySelectorAll("#maincontent div:nth-child(4) table tbody tr")[i].querySelector("td:nth-child(7)").innerText
     var result1 = document.querySelectorAll("#maincontent div:nth-child(4) table tbody tr")[i].querySelector("td:nth-child(7) span").getElementsByTagName("font").length
     if(result1 == 0){
         result1 = '及格'
     }else{
         result1 = '不及格'
         arr.push(courseName)
     }
     console.log(courseName+" "+result+" "+result1)
    }
    //提示
    if(arr.length > 0){
        //alert("您有"+arr.length+"门课程挂科！详细信息："+arr)
        //获取姓名
        var UserName = document.querySelectorAll("#UserInfo strong")[1].innerText
        //获取时间
        function getTime(){
            var myDate = new Date;
            var year = myDate.getFullYear()
            var month = myDate.getMonth()+1
            if(month < 10) month = "0"+month
            return year+"年"+month+"月"
        }
       //创建遮罩
        var zz = document.createElement("div");
        document.body.appendChild(zz)
        zz.style.position='fixed'
        zz.style.width='100%'
        zz.style.height='100%'
        zz.style.top='0'
        zz.style.left='0'
        zz.style.background='#0000008f'
        zz.onclick=function(){
            zz.style.display='none'
        }
        var arrLength = arr.length
        var box1 = document.createElement("div");
        var T = `${UserName}同志：<br/>&emsp;&emsp;本学期您有<strong style='color:red;font-size: 45px;'>${arrLength}</strong>门课程挂科，分别为${arr}。<br/>`
        var T1 = T.replaceAll(",", "，")
        box1.innerHTML=T1+"<br/><span>特发此证，以资鼓励&emsp;&emsp;&emsp;湖北汽车工业学院<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"+getTime()+"</span>"
        zz.appendChild(box1)
        box1.style.position='fixed'
        box1.style.top='50%'
        box1.style.left='50%'
        box1.style.marginTop='-339.25px'
        box1.style.marginLeft='-480px'
        //box1.style.border='1px solid red'
        box1.style.width='960px'
        box1.style.height='678.5px'
        box1.style.boxSizing='border-box'
        box1.style.background='url(https://ts1.cn.mm.bing.net/th/id/R-C.34d487173d570818905f1fe0bfaabef9?rik=jOOt4fGi3MQdrQ&riu=http%3a%2f%2fi02.c.aliimg.com%2fimg%2fibank%2f2013%2f008%2f388%2f965883800_1600796167.jpg&ehk=jsNFaf0b0PvSA7tfZCp3vgU2gCPx3qceQ05Zsd8fgJQ%3d&risl=&pid=ImgRaw&r=0) no-repeat'
        box1.style.backgroundSize='cover'
        box1.style.backgroundPosition='center'
        box1.style.fontSize='35px'
        box1.style.textAlign='left'
        box1.style.color='#000'
        box1.style.lineHeight='45px'
        box1.style.letterSpacing='2px'
        box1.style.padding='90px'
        box1.style.paddingLeft='110px'
        box1.style.paddingTop='250px'
        box1.style.wordBreak='break-all'
        box1.style.transform='scale(0.65)'
    }
    // Your code here...
})();