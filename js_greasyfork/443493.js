// ==UserScript==
// @name         XS_Stadium
// @namespace    http://freell.top/
// @version      1.1.0
// @description  XS_Stadium_1.1.0
// @author       Freell
// @match        http://*.koksoft.com/*
// @icon         http://www.freell.top/back/Freell_logo.png
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/443493/XS_Stadium.user.js
// @updateURL https://update.greasyfork.org/scripts/443493/XS_Stadium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cdnum = 1;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let start = function(){
        let btnTodo = document.getElementsByClassName('weui_tabbar')[0];

        // 创建按钮 START
        let btn = document.createElement('a');
        btn.setAttribute("class",'weui_tabbar_item  bg-red');
        btn.innerHTML = '<p id="auto" style="line-height:40px; font-size:18px; color:#fff;text-align: center;">AUTO</p>';
        btn.addEventListener('click', function () {
            index();
        });
        let btn1 = document.createElement('a');
        btn1.setAttribute("class",'weui_tabbar_item  bg-blue');
        btn1.innerHTML = '<p id="getCd" style="width:260px;line-height:40px; font-size:18px; color:#fff;text-align: center;">获取场地信息(打开控制台查看)</p>';
        btn1.addEventListener('click', function () {
            getCd();
        });
        let btn2 = document.createElement('a');
        btn2.setAttribute("class",'weui_tabbar_item  bg-green');
        btn2.innerHTML = '<p id="getCd" style="line-height:40px; font-size:18px; color:#fff;text-align: center;">切换场地(主副场)</p>';
        btn2.addEventListener('click', function () {
            changeCd();
        });
        // 创建按钮

        // 添加按钮 START
        let parent = null;
        if (btnTodo) {
            parent = btnTodo;
            parent.insertBefore(btn, btnTodo.childNodes[4]);
            parent.insertBefore(btn1, btnTodo.childNodes[4]);
            parent.insertBefore(btn2, btnTodo.childNodes[4]);
        }
        // 添加按钮 END

        // 从url中获取wxkey
        var wxkkey = window.document.location.href.toString().split("wxkey=")[1].split("&lxbh")[0];


        //<option value="0">任意</option>
        $("body").append('<div class="backg" style="position: fixed;top: 0;left: 0;width: auto;height: auto;background-color:#72aff9;z-index:999;">'+
                         '<div class="auto_inner" style="margin: 20px 100px 20px 100px;">'+
                         '<textarea id="wxkkey" placeholder="请输入wxkey" disabled="disabled">'+wxkkey+'</textarea>'+
                         '<div class="auto_row" style="display: flex;">'+
                         '<select class="sAY"><option value="Y">主馆羽毛球</option><option value="A">副馆羽毛球</option></select>'+
                         '<select class="sDD"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select>'+
                         '<select class="sSJ">'+
                         '<option value="8:00-8:30">8:00-8:30</option><option value="8:30-9:00">8:30-9:00</option><option value="9:00-9:30">9:00-9:30</option>'+
                         '<option value="9:30-10:00">9:30-10:00</option><option value="10:00-11:00">10:00-11:00</option><option value="11:00-12:00">11:00-12:00</option>'+
                         '<option value="12:00-13:00">12:00-13:00</option><option value="13:00-14:00">13:00-14:00</option><option value="14:00-15:00">14:00-15:00</option>'+
                         '<option value="15:00-16:00">15:00-16:00</option><option value="16:00-17:00">16:00-17:00</option><option value="17:00-18:00">17:00-18:00</option>'+
                         '<option value="18:00-19:00">18:00-19:00</option><option value="19:00-20:00">19:00-20:00</option><option value="20:00-21:00">20:00-21:00</option>'+
                         '</select>'+
                         '</div>'+
                         '</div>'+
                         '<button id="add">增加任务</button>'+
                         '<button id="del">删除任务</button>'+
                         '<button id="cAuto">关闭AUTO</button>'+
                         '<button id="autoStart">开始任务</button>'+
                         '</div>');
        document.querySelector('[id=add]').addEventListener('click', function () {
            addRows();
        });
        document.querySelector('[id=del]').addEventListener('click', function () {
            delRows();
        });
        document.querySelector('[id=cAuto]').addEventListener('click', function () {
            cancelAuto();
        });
        document.querySelector('[id=autoStart]').addEventListener('click', function () {
            autoStart();
        });


    };

    let index = function(){
        $(".backg").show();
    }

    let getCd = function() {
        var nowu = window.document.location.href.toString();
        var nowdate = nowu.split("orderdate=")[1];
        var nowcd = nowu.split("lxbh=")[1].split("&orderdate")[0];
        var wxkkey = nowu.split("wxkey=")[1].split("&lxbh")[0];
        var xhr = new XMLHttpRequest();
        var url = "http://26501.koksoft.com/GetForm.aspx?datatype=viewchangdi4weixinv&pagesize=0&pagenum=0&searchparam=orderdate%3D"+nowdate+"%7Clxbh%3D"+nowcd+"&wxkey="+wxkkey;
        xhr.open('get', url, false);
        xhr.send();
        var responseBody = xhr.responseText;
        var list = eval('('+eval(responseBody)[1]+')')['rows'];
        var times = [];
        for(let i of list){
            times.push(i["timemc"])
        }
        var maxid = 1
        while(true){
            if("cdbh"+String(maxid) in list[0]){
                maxid+=1;
            } else {
                break;
            }
        }
        var cdmc = [];
        for(let i=1;i<maxid;i++){
            cdmc.push(list[0]["cdmc"+String(i)]);
        }
        var result = []
        for(let i=0;i<list.length;i++){
            var temp = [];
            for(let j=1;j<maxid;j++){
                if(list[i]["c"+String(j)]=='u'){
                    temp.push("×已锁定");
                } else if(list[i]["c"+String(j)]=='o'){
                    temp.push("-已预约")
                } else {
                    temp.push("√可预约")
                }
            }
            result.push(temp)
        }
        var s = "时间\t|\t"+cdmc.join("\t|\t");
        for(let i=0;i<times.length;i++){
            s = s+"\n"+times[i]+"\t|\t"+result[i].join("\t|\t");
        }
        console.log(s);
    }

    let changeCd = function() {
        var nowu = window.document.location.href.toString();
        var ucenter = nowu.split("lxbh=")[1].split("&orderdate")[0];
        var uleft = nowu.split(ucenter+"&orderdate")[0];
        var uright = nowu.split("lxbh="+ucenter)[1];
        if(ucenter=='A'){ucenter='Y';}
        else{ucenter='A';}
        window.open(uleft+ucenter+uright,'_self');
    }

    let addRows = function(){
        if(cdnum>=4) {alert("最多四个哦");return;}
        let add_text = '<select class="sAY"><option value="Y">主馆羽毛球</option><option value="A">副馆羽毛球</option></select>'+
            '<select class="sDD"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select>'+
            '<select class="sSJ">'+
            '<option value="8:00-8:30">8:00-8:30</option><option value="8:30-9:00">8:30-9:00</option><option value="9:00-9:30">9:00-9:30</option>'+
            '<option value="9:30-10:00">9:30-10:00</option><option value="10:00-11:00">10:00-11:00</option><option value="11:00-12:00">11:00-12:00</option>'+
            '<option value="12:00-13:00">12:00-13:00</option><option value="13:00-14:00">13:00-14:00</option><option value="14:00-15:00">14:00-15:00</option>'+
            '<option value="15:00-16:00">15:00-16:00</option><option value="16:00-17:00">16:00-17:00</option><option value="17:00-18:00">17:00-18:00</option>'+
            '<option value="18:00-19:00">18:00-19:00</option><option value="19:00-20:00">19:00-20:00</option><option value="20:00-21:00">20:00-21:00</option>'+
            '</select>'
        let autoInner = document.getElementsByClassName('auto_inner')[0];
        var rowNum = document.getElementsByClassName('auto_row').length;
        let brow = document.createElement('div');
        brow.setAttribute("class",'auto_row');
        brow.setAttribute("style",'display: flex;');
        brow.innerHTML = add_text;
        autoInner.insertBefore(brow, autoInner.childNodes[rowNum+1]);
        cdnum++;
    };

    let delRows = function(){
        cdnum--;
        let autoInner = document.getElementsByClassName('auto_inner')[0];
        var rowNum = document.getElementsByClassName('auto_row').length;
        if(rowNum>1){
            autoInner.childNodes[rowNum-1].remove();
        } else {
            alert("已经最少了，不能再少了...");
        }
    };

    let cancelAuto = function(){
        $(".backg").hide();
    }

    let aAuto = function(data){
        var httpa = window.document.location.href.toString().split("http")[1].split(".koksoft.com")[0];
        console.log(data.searchparam);
        $.ajax({
            type: "POST",
            url: "http"+httpa+".koksoft.com/HomefuntionV2json.aspx",
            data: data,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data[0]==true){
                    let autoInner = document.getElementsByClassName('auto_inner')[0];
                    let rowNum = document.getElementsByClassName('auto_row').length;
                    let brow = document.createElement('div');
                    brow.setAttribute("style",'color: red;');
                    brow.innerHTML = "成功预约("+data.searchparam+")";
                } else {
                    console.log("预约失败("+data.searchparam+")");
                }
            }
        });
    }

    let mainAuto = function(data){
        let d = new Date();
        sleep(50).then(() => {
            if(d.getHours()>=8 && d.getMinutes()>=0 && d.getSeconds()>=0){
                aAuto(data);
            } else {
                console.log("未到时间，循环");
                mainAuto(data);
            }
        })
    }

    let autoStart = function(){
        // $("#add").attr("disabled", "disabled");
        // $("#del").attr("disabled", "disabled");
        // $("#cAuto").attr("disabled", "disabled");
        // $("#autoStart").attr("disabled", "disabled");

        var dataList = "";
        let autoInner = document.getElementsByClassName('auto_inner')[0];
        var rowNum = document.getElementsByClassName('auto_row').length;
        let brow = document.createElement('div');
        brow.setAttribute("style",'color: red;');
        brow.innerHTML = "任务开始，8点自动执行，请勿刷新页面";
        autoInner.insertBefore(brow, autoInner.childNodes[rowNum+1]);

        var date = new Date();
        var today = date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+(date.getDate()+1).toString();

        for(let i=0;i<rowNum;i++){
            let nRow = autoInner.childNodes[i+1];
            let AY = nRow.childNodes[0].selectedIndex;
            AY = nRow.childNodes[0][AY].value;
            let DD = nRow.childNodes[1].selectedIndex;
            DD = nRow.childNodes[1][DD].value;
            let SJ = nRow.childNodes[2].selectedIndex;
            SJ = nRow.childNodes[2][SJ].value;
            dataList = dataList + (AY+":"+DD+","+SJ+";");
        }
        let aData = {
            "searchparam": '{"datestring":"'+today+'","cdstring":"'+dataList+'","paytype":"M"}',
            "wxkey": window.document.location.href.toString().split("wxkey=")[1].split("&lxbh")[0],
            "classname": "saasbllclass.CommonFuntion",
            "funname": "MemberOrderfromWx"
        };
        mainAuto(aData);
    }

    start();


})();