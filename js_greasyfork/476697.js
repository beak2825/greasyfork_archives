// ==UserScript==
// @name         BBS自动打开帖子
// @namespace    http://lth6268.cn/
// @version      0.1.1
// @author       lth6268
// @match        *://www.tt1069.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js
// @description:zh-cn
// @description tt1069.com辅助脚本
// @downloadURL https://update.greasyfork.org/scripts/476697/BBS%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/476697/BBS%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var idName = "normalthread";
    
    var ul = document.getElementById("thread_types");
    //var liObj = document.createElement("li");
    var btnAll = document.createElement("input");
    var btnToday = document.createElement("input");
    var btnYesterday = document.createElement("input");
    var btnID = document.createElement("input");

    btnAll.id = "btn";
    btnAll.type = "button";
    btnAll.value = "打开本页全部帖子";
    btnAll.setAttribute("style","float: left;margin-right: 5px;padding: 4px 8px 3px;height: 27px;border: 1px solid #CDCDCD;background: #FFF;white-space: nowrap;color: #333;text-decoration: none;")
    
    btnToday.id = "btn";
    btnToday.type = "button";
    btnToday.value = "打开本页今日帖子";
    btnToday.setAttribute("style","float: left;margin-right: 5px;padding: 4px 8px 3px;height: 27px;border: 1px solid #CDCDCD;background: #FFF;white-space: nowrap;color: #333;text-decoration: none;")

    btnYesterday.id = "btn";
    btnYesterday.type = "button";
    btnYesterday.value = "打开本页昨日帖子";
    btnYesterday.setAttribute("style","float: left;margin-right: 5px;padding: 4px 8px 3px;height: 27px;border: 1px solid #CDCDCD;background: #FFF;white-space: nowrap;color: #333;text-decoration: none;")

    btnID.id = "btn";
    btnID.type = "button";
    btnID.value = "打开指定ID区间帖子";
    btnID.setAttribute("style","float: left;margin-right: 5px;padding: 4px 8px 3px;height: 27px;border: 1px solid #CDCDCD;background: #FFF;white-space: nowrap;color: #333;text-decoration: none;")


    //liObj.setAttribute("style","float: left;padding-bottom: 5px;list-style: none;");

    var btns = [btnAll,btnToday,btnYesterday,btnID];

    for(var i=0;i<btns.length;i++){
        var liObj = document.createElement("li");

        liObj.appendChild(btns[i]);

        ul.appendChild(liObj);
    }

    // liObj.appendChild(btnAll);
    // liObj.appendChild(btnToday);
    // liObj.appendChild(btnYesterday);
    // liObj.appendChild(btnID);

    //ul.appendChild(liObj);

    //TAG：添加序号
    var myTable = document.getElementsByTagName("table");
    for(var i=0;i<myTable.length;i++){
        //console.log("tbod ID=" + i);

        var table = myTable[i];

        if(table.getAttribute("summary") != null){
            var id = 1;
            //console.log(table.getAttribute("summary").indexOf("forum_85")!=-1);
            //console.log(table.getAttribute("summary"));
            if(table.getAttribute("summary").indexOf("forum_")!=-1){
                var tbody = table.getElementsByTagName("tbody");
                
                for(var j=0;j<tbody.length;j++){
                    var nowTbody = tbody[j];
                    
                    if(nowTbody.getAttribute("id") != null){
                        //console.log(nowTbody.getAttribute("id").indexOf(idName)!=-1);
                        //console.log(nowTbody.getAttribute("id"));
                        
                        if(nowTbody.getAttribute("id").indexOf(idName)!=-1){
                            var myTr = nowTbody.getElementsByTagName("tr");
                            var tr = myTr[0];

                            var myTh = tr.getElementsByTagName("th");
                            var th = myTh[0];

                            var myEm = th.getElementsByTagName("em");
                            var em = myEm[0];

                            var myA = em.getElementsByTagName("a");

                            for(var k=0;k<myA.length;k++){
                                var a = myA[k];
                                if(a.getAttribute("class") == null){
                                    console.log(a.firstChild.nodeValue);
                                    a.firstChild.nodeValue = a.firstChild.nodeValue + " | ID:" + (id);
                                    th.setAttribute("idTag",id)
                                    id+=1;
                                }
                            }        
                        }
                    }
                }
            }
        }
    }

    //TAG:打开本页
    btnAll.onclick = function openAll(){
        var mymessage=confirm("确认打开本页全部帖子吗？");
        if(mymessage == true){
            var myTable = document.getElementsByTagName("table");
            //console.log("table = " + myTable.length);
            //console.log(1);
            for(var i=0;i<myTable.length;i++){
                //console.log("tbod ID=" + i);

                var table = myTable[i];

                if(table.getAttribute("summary") != null){
                    //console.log(table.getAttribute("summary").indexOf("forum_85")!=-1);
                    //console.log(table.getAttribute("summary"));
                    if(table.getAttribute("summary").indexOf("forum_")!=-1){
                        var tbody = table.getElementsByTagName("tbody");
                        
                        for(var j=0;j<tbody.length;j++){
                            var nowTbody = tbody[j];
                            
                            if(nowTbody.getAttribute("id") != null){
                                //console.log(nowTbody.getAttribute("id").indexOf(idName)!=-1);
                                //console.log(nowTbody.getAttribute("id"));
                                
                                if(nowTbody.getAttribute("id").indexOf(idName)!=-1){
                                    var myTr = nowTbody.getElementsByTagName("tr");
                                    var tr = myTr[0];

                                    var myTh = tr.getElementsByTagName("th");
                                    var th = myTh[0];

                                    var myA = th.getElementsByTagName("a");

                                    for(var k=0;k<myA.length;k++){
                                        var a = myA[k];
                                        if(a.getAttribute("onclick") != null){
                                            var link = a.getAttribute("href");
                                            var newLink = "https://tt1069.com/bbs/" + link;
                                            console.log(a.firstChild.nodeValue);
                                            console.log(newLink);

                                            window.open(newLink);
                                        }
                                    }        
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    //TAG:打开今日
    btnToday.onclick = function openToday(){
        var mymessage=confirm("确认打开本页今日帖子吗？");
        if(mymessage == true){
            var today = getToday();
            
            var myTable = document.getElementsByTagName("table");
            //console.log("table = " + myTable.length);
            //console.log(1);
            for(var i=0;i<myTable.length;i++){
                //console.log("tbod ID=" + i);

                var table = myTable[i];

                if(table.getAttribute("summary") != null){
                    //console.log(table.getAttribute("summary").indexOf("forum_85")!=-1);
                    //console.log(table.getAttribute("summary"));
                    if(table.getAttribute("summary").indexOf("forum_")!=-1){
                        var tbody = table.getElementsByTagName("tbody");
                        
                        for(var j=0;j<tbody.length;j++){
                            var nowTbody = tbody[j];
                            
                            if(nowTbody.getAttribute("id") != null){
                                //console.log(nowTbody.getAttribute("id").indexOf(idName)!=-1);
                                //console.log(nowTbody.getAttribute("id"));
                                
                                if(nowTbody.getAttribute("id").indexOf(idName)!=-1){
                                    var myTr = nowTbody.getElementsByTagName("tr");
                                    var tr = myTr[0];

                                    var myTh = tr.getElementsByTagName("th");
                                    var th = myTh[0];

                                    var myA = th.getElementsByTagName("a");

                                    var myTd = tr.getElementsByTagName("td");
                                    
                                    for(var k=0;k<myTd.length;k++){
                                        var td = myTd[k];
                                        if(td.getAttribute("class") == "by"){
                                            var mySpan = td.getElementsByTagName("span");
                                            
                                            for(var l=0;l<mySpan.length;l++){
                                                var span = mySpan[l];
                                                
                                                //console.log(span.firstChild.nodeValue);
                                                if(span.firstChild.nodeValue.indexOf(today)!=-1)
                                                for(var m=0;m<myA.length;m++){
                                                    var a = myA[m];
                                                    if(a.getAttribute("onclick") != null){
                                                        var link = a.getAttribute("href");
                                                        var newLink = "https://tt1069.com/bbs/" + link;
                                                        console.log(a.firstChild.nodeValue);
                                                        console.log(newLink);

                                                        window.open(newLink);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }        

    //TAG:打开昨日
    btnYesterday.onclick = function openYesterday(){
        var mymessage=confirm("确认打开本页昨日帖子吗？");
        if(mymessage == true){
            var yesterday = getYesterday()

            var myTable = document.getElementsByTagName("table");
            //console.log("table = " + myTable.length);
            //console.log(1);
            for(var i=0;i<myTable.length;i++){
                //console.log("tbod ID=" + i);

                var table = myTable[i];

                if(table.getAttribute("summary") != null){
                    //console.log(table.getAttribute("summary").indexOf("forum_85")!=-1);
                    //console.log(table.getAttribute("summary"));
                    if(table.getAttribute("summary").indexOf("forum_")!=-1){
                        var tbody = table.getElementsByTagName("tbody");
                        
                        for(var j=0;j<tbody.length;j++){
                            var nowTbody = tbody[j];
                            
                            if(nowTbody.getAttribute("id") != null){
                                //console.log(nowTbody.getAttribute("id").indexOf(idName)!=-1);
                                //console.log(nowTbody.getAttribute("id"));
                                
                                if(nowTbody.getAttribute("id").indexOf(idName)!=-1){
                                    var myTr = nowTbody.getElementsByTagName("tr");
                                    var tr = myTr[0];

                                    var myTh = tr.getElementsByTagName("th");
                                    var th = myTh[0];

                                    var myA = th.getElementsByTagName("a");

                                    var myTd = tr.getElementsByTagName("td");

                                    for(var k=0;k<myTd.length;k++){
                                        var td = myTd[k];
                                        if(td.getAttribute("class") == "by"){
                                            var mySpan = td.getElementsByTagName("span");
                                            
                                            for(var l=0;l<mySpan.length;l++){
                                                var span = mySpan[l];

                                                //console.log(span.firstChild.nodeValue);
                                                if(span.firstChild.nodeValue.indexOf(yesterday)!=-1){
                                                    for(var m=0;m<myA.length;m++){
                                                        var a = myA[m];
                                                        if(a.getAttribute("onclick") != null){
                                                            var link = a.getAttribute("href");
                                                            var newLink = "https://tt1069.com/bbs/" + link;
                                                            console.log(a.firstChild.nodeValue);
                                                            console.log(newLink);

                                                            window.open(newLink);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } 

    //TAG:打开ID
    btnID.onclick = function openAll(){
        var mymessage=confirm("确认打开本页指定ID区间内的帖子吗？");
        if(mymessage == true){
            var personStart = prompt("请输入ID起始值",1);
            var personEnd = prompt("请输入ID结束值");

            var idStart = parseInt(personStart);
            var idEnd = parseInt(personEnd);

            var myTable = document.getElementsByTagName("table");
            //console.log("table = " + myTable.length);
            //console.log(1);
            for(var i=0;i<myTable.length;i++){
                //console.log("tbod ID=" + i);

                var table = myTable[i];

                if(table.getAttribute("summary") != null){
                    var id = 1;
                    //console.log(table.getAttribute("summary").indexOf("forum_85")!=-1);
                    //console.log(table.getAttribute("summary"));
                    if(table.getAttribute("summary").indexOf("forum_")!=-1){
                        var tbody = table.getElementsByTagName("tbody");
                        
                        for(var j=0;j<tbody.length;j++){
                            var nowTbody = tbody[j];
                            
                            if(nowTbody.getAttribute("id") != null){
                                //console.log(nowTbody.getAttribute("id").indexOf(idName)!=-1);
                                //console.log(nowTbody.getAttribute("id"));
                                
                                if(nowTbody.getAttribute("id").indexOf(idName)!=-1){
                                    var myTr = nowTbody.getElementsByTagName("tr");
                                    var tr = myTr[0];

                                    var myTh = tr.getElementsByTagName("th");
                                    var th = myTh[0];

                                    var myA = th.getElementsByTagName("a");

                                    for(var k=0;k<myA.length;k++){
                                        var a = myA[k];
                                        if(a.getAttribute("onclick") != null && parseInt(th.getAttribute("idTag")) >= idStart && parseInt(th.getAttribute("idTag")) <= idEnd){
                                            var link = a.getAttribute("href");
                                            var newLink = "https://tt1069.com/bbs/" + link;
                                            console.log(a.firstChild.nodeValue);
                                            console.log(newLink);

                                            window.open(newLink);
                                        }
                                    }        
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    function getYesterday(){
        var date = new Date(),
            year = date.getFullYear(), //获取完整的年份(4位)
            month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
            strDate = date.getDate() - 1 // 获取当前日(1-31)
        if (month < 10) month = `${month}` // 如果月份是个位数，在前面补0
        if (strDate < 10) strDate = `${strDate}` // 如果日是个位数，在前面补0
        
        console.log(`${year}-${month}-${strDate}`);

        return `${year}-${month}-${strDate}`;
    }

    function getToday(){
        var date = new Date(),
            year = date.getFullYear(), //获取完整的年份(4位)
            month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
            strDate = date.getDate() // 获取当前日(1-31)
        if (month < 10) month = `${month}` // 如果月份是个位数，在前面补0
        if (strDate < 10) strDate = `${strDate}` // 如果日是个位数，在前面补0
        
        console.log(`${year}-${month}-${strDate}`);

        return `${year}-${month}-${strDate}`;
    }

})();