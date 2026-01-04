// ==UserScript==
// @name         号++
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  已弃用!
// @author       大魔王
// @match        http://172.16.96.9/frame/ac/frame.do
// @match        http://172.16.96.9/login/ac/login.do
// @match        https://zwfw.sd.gov.cn/JIS/front/login.do*

// @match        http://172.20.233.155:7016/iaic*
// @match        http://60.216.97.242:8000/sdfda/jsp/dsp/public/login.jsp

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469827/%E5%8F%B7%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/469827/%E5%8F%B7%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        /*1、叫号
  2、叫号登录
  3、综合受理系统登录
  4、一窗通登录
  5、食品受理登录*/

        //*************************初始化************************
        var sussece = "";//叫号成功状态标志
        var count = 0;//循环叫号计数
        var num = 0;//点击Logo显示、隐藏按钮标志（奇数 显示， 偶数隐藏）
        //数据验证
        var defaultId = "",cookieId = "";//默认id
        var username = "",userid = "";//用户信息
        var users = ["02W02S03703402Y0lC0lI0lE","02W02S03703402Y0lC0lJ0lE"];
        var pc = new Array();
        pc["02W02S03703402Y0lC0lI0lE"] ="A21/A22/A20/A24/A23/A1/A2/A3/A4/A5/A6/A7/A8/A9/A10/A11/A12/A13/A14/A18";
        pc["02W02S03703402Y0lC0lJ0lE"]="A14/A1/A2/A3/A4/A5/A6/A7/A8/A9/A10/A11/A12/A13/A18";

        //*************************初始化结束********************

        //**********函数调用*********************************
        //自动填充用户名密码
        var url = window.location.pathname;

        if(url == "/login/ac/login.do"){
            MyLogin(fromCode("02W02S03703402Y0lC0lI0lE"),fromCode("02P02P02P02P02P02P"));//'me'
            // MyLogin(fromCode("02W02S03703402Y0lC0lJ0lE"),fromCode("02P02P02P02P0lI0lI0lI0lI"));
        }else if(url == "/frame/ac/frame.do"){
            ImportCss();//插入css样式
            ImportDiv();//插入div按钮
            SerchId(users,pc);//身份验证
        }else if(url == "/JIS/front/login.do"){
            //政务服务网登录

            //$("#cloud")[0].style.display = "none";
            $("#cloud").remove();
            $("#cloud1").remove();
            var userNames = ["王宇洋","孟凡超","赵邦","侯嘉琳","孙玉杰","安雪","高飞"];
            var userId = ["15588037099","13290205167","17805495755","15192810080","18660903090","18660981692","15554908659"];
            var userPass = ["123456a?","zxc12345","a12345678","123456a?","Aa123456.","ax123456","gf123456"];
            for(var i = 0;i < userNames.length; i++){
                var parent = $("span")[9];
                parent = document.getElementsByTagName("span")[9];
                var span = document.createElement("span");
                span.id = i;
                span.style.color = "#858585";
                span.style.cursor = "pointer";
                span.textContent = "|"+userNames[i]
                //span.textContent = "|我的登录";
                parent.append(span);
                span.onclick = function(){
                if($("#grusername")[0].value==""){
                    $("#grusername").val(userId[this.id]);
                    $("#grpwd").val(userPass[this.id]);
                }else{
                    $("#grusername").val("");
                    $("#grpwd").val("");
                }

            }

            
            }

        }else if(url == "/iaic/jsp/public/login.jsp"||url == "/iaic/"){
            var parents = document.querySelectorAll("table")[2].querySelectorAll("tr")[3];
            //var parent = document.querySelectorAll("body")[0];
            var div = document.createElement("div");
            div.textContent = "填写";
            div.style.marginLeft = "50%";
            div.style.backgroundColor = "deepskyblue";
            div.style.cursor = "pointer";
            parents.append(div);

            L5.Ajax.request({//写到集合里原网页ajax不调用，单独写自动调用很奇怪
                url : L5.webPath + "/command/dispatcher/org.loushang.bsp.security.web.RandomCodeCommand",
                sync : false,
                callback : successHandler
            });

            function successHandler(options,success,response){
                var o = L5.decode(response.responseText);
                document.getElementById("rdmCode").value = o.code;
            }

            // document.getElementById("rdmCode").type="";
            div.onclick = function(){
                if(document.getElementsByName("j_username")[0].value==""){
                    document.getElementsByName("j_username")[0].value = "lyhdwangyuyang";
                    document.getElementsByName("j_password")[0].value = "123456";

                }else{
                    document.getElementsByName("j_username")[0].value = "";
                    document.getElementsByName("j_password")[0].value = "";
                }

            }
        }else if(url == "/sdfda/jsp/dsp/public/login.jsp"){

            var parentsp = document.querySelector("table").querySelectorAll("tr")[5];
            //var parent = document.querySelectorAll("body")[0];
            parentsp = document.querySelector("table").querySelectorAll("tr")[5].querySelectorAll("td")[2];
            var divsp = document.createElement("div");
            divsp.textContent = "填写";
            divsp.style.marginLeft = "50%";
            divsp.style.backgroundColor = "deepskyblue";
            divsp.style.cursor = "pointer";
            parentsp.append(divsp);
            L5.Ajax.request({//写到集合里原网页ajax不调用，单独写自动调用很奇怪
                url : L5.webPath + "/command/dispatcher/org.loushang.bsp.security.web.RandomCodeCommand",
                sync : false,
                callback : successHandler
            });

            function successHandler(options,success,response){
                var o = L5.decode(response.responseText);
                document.getElementById("rdmCode").value = o.code;
            }
            divsp.onclick = function(){

                if(document.getElementById("userId").value == ""){
                    document.getElementById("userId").value = "hedong01";
                    document.getElementById("psd").value = "Sy123456.";
                }else{
                    document.getElementById("userId").value = "";
                    document.getElementById("psd").value = "";
                }
            }
        }else{
            console.log("url error");
        }
        //    SetStyle(id,staus);//设置display属性

        //**********函数调用结束*********************************

        //**********************函数************************************
        function ImportCss(){
            var myCss = document.createElement("style");
            myCss.type = "text/css";
            myCss.innerHTML = ".myDiv1{opacity:0.2 ;display: none;position: fixed;right: 5px;bottom: 50px;z-index: 2247483648;padding: 20px 5px;width: 50px;height: 20px;line-height: 20px;text-align: center;border: 1px solid;border-color: #888;border-radius: 50%;background: #efefef;cursor: pointer;font: 12px/1.5}.myDiv2{display: none;position: fixed;right: 5px;bottom: 120px;z-index: 2247483648;padding: 20px 5px;width: 50px;height: 20px;line-height: 20px;text-align: center;border: 1px solid;border-color: #888;border-radius: 50%;background: #efefef;cursor: pointer;font: 12px/1.5}";
            $("head")[0].appendChild(myCss);
            console.log("插入css");
        }
        function ImportRunText(){//var runText = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("runText");
            var head1 = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("head1");
            $(head1).append("<span>计数: </span><span title='' class='badge' id='runText'>0</span>");
            var runText = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("runText");
            runText.title = "抢号成功数："+getMyCount();
            console.log("插入runText");
        }
        function ImportDiv(){
            var palyDiv = document.createElement("div");
            palyDiv.id = "palyDiv";
            palyDiv.className = "myDiv1";
            palyDiv.textContent = "▶";
            //             palyDiv.style.display = "block";
            palyDiv.value = "paly";//**************RunSotpStats*****************运行(paly)、停止(pause)的状态标志
            var pauseDiv = document.createElement("div");
            pauseDiv.id = "pauseDiv";
            pauseDiv.className = "myDiv1";
            pauseDiv.textContent = "■";
            //             pauseDiv.style.display = "none";
            $("body")[0].appendChild(palyDiv);
            $("body")[0].appendChild(pauseDiv);
            console.log("插入myDiv");
            //****************方法二*******************
            var startDiv = document.createElement("div");
            startDiv.id = "startDiv";
            startDiv.className = "myDiv2";
            startDiv.textContent = "▷";
            startDiv.value = "start";//**************RunSotpStats*****************运行(start)、停止(stop)的状态标志
            //             startDiv.style.display = "block";
            var stopDiv = document.createElement("div");
            stopDiv.id = "stopDiv";
            stopDiv.className = "myDiv2";
            stopDiv.textContent = "□";
            $("body")[0].appendChild(startDiv);
            $("body")[0].appendChild(stopDiv);
            //*************改变透明度
            ChangeTransparency("palyDiv");
            ChangeTransparency("pauseDiv");
            ChangeTransparency("startDiv");
            ChangeTransparency("stopDiv");
            //***********************************

            //paly按钮点击事件
            palyDiv.onclick = function(){
                //                 console.log("抢");
                var successStats = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("skipbtn").disabled;//true跳过按钮不可选，即没有成功叫号,false则相反
                var runText = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("runText");
                var nextOne = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("nextone");
                var RunSotpStats = $("#palyDiv")[0].value;
                ////并将paly按钮隐藏，pause按钮显示
                SetStyle("palyDiv","none");
                SetStyle("pauseDiv","block");
                //先判断是否停止或叫号成功
                if(successStats == true && RunSotpStats == "paly"){
                    nextOne.click();
                    setTimeout(function(){window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementsByClassName("layui-layer-btn1")[0].click();},300);
                    count++;//更新计数器
                    $(runText).text(count);
                    //更新叫号是否成功状态
                    successStats = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("skipbtn").disabled;
                    if(successStats  == false){//跳过按钮可用，即叫号成功
                        //                         if(count  == 2){//测试用例
                        console.log("叫号成功/超过设定次数，自动结束");
                        SetStyle("palyDiv","block");
                        SetStyle("pauseDiv","none");
                        $("#palyDiv")[0].value = "paly";
                        count = 0;//重置计数器
                        $(runText).text(count);
                        setMyCount("add");
                        runText.title = "抢号成功数："+getMyCount();
                        return;
                    }
                    //延时调用自身，完成循环
                    setTimeout(function(){ palyDiv.onclick() },350);
                }else if(RunSotpStats == "pause"){//停止叫号 设置按钮状态等
                    console.log("停止叫号");
                    SetStyle("palyDiv","block");
                    SetStyle("pauseDiv","none");
                    $("#palyDiv")[0].value = "paly";
                    count = 0;//重置计数器
                    return;
                }
            };

            //pause按钮点击事件
            pauseDiv.onclick = function(){
                console.log("停");
                $("#palyDiv")[0].value = "pause";
                SetStyle("palyDiv","block");
                SetStyle("pauseDiv","none");
                count = 0;//重置计数器
                return;
            }
            //start按钮点击事件
            startDiv.onclick = function(){
                SetStyle("startDiv","none");
                SetStyle("stopDiv","block");

                MytiemWaitingRs();//调用重写的《加载等待人数》
            }
            //stop按钮点击事件
            stopDiv.onclick = function(){
                SetStyle("startDiv","block");
                SetStyle("stopDiv","none");
                $("#startDiv")[0].value = "stop";
                count = 0;
                return;
            }
        }


        //加载等待人数，以此判断是否叫号
        function MytiemWaitingRs(){
            $.ajax({
                type:"post",
                url:"http://172.16.96.9/acdeal/windowAccept/tiemWaitingRs.do",
                dataType: "json",
                error:function(){


                },
                success:function(data){

                    //                     console.log(data);
                    var Anum = data['DDnumber'];//综合受理
                    var runText = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("runText");
                    var nextOne = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("nextone");
                    var RunSotpStats = $("#startDiv")[0].value;
                    var successStats = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("skipbtn").disabled;

                    count++;
                    /*                   if(count<=1){//-------------------------------------------------------------------------*******************************************-测试用例
                        Anum = 1;} */
                    if(successStats == true && RunSotpStats == "start"){//disabled属性ture,跳过按钮不可用，即叫号不成功；是否停止叫号
                        $(runText).text(count);
                        if(Anum==0){// 没有等待人数，循环
                            //                             if(count==5){//测试用例
                            //                                 SetStyle("startDiv","block");
                            //                                 SetStyle("stopDiv","none");
                            //                                 $("#startDiv")[0].value = "start";
                            //                                 count = 0;
                            //                                 console.log("测试结束");
                            //                                 return;
                            //                             }
                            setTimeout(function(){MytiemWaitingRs();},300);

                        }else if(Anum>0){
                            console.log("发现待抢号，准备抢号");
                            $(runText).text(count);
                            nextOne.click();
                            setTimeout(function(){window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementsByClassName("layui-layer-btn1")[0].click();},300);
                            successStats = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("skipbtn").disabled;
                            // successStats = false;//-------------------------------------------------------------------------*******************************************测试用例
                            if(successStats == false){//跳过按钮可用，即叫号成功
                                count=0;
                                console.log("抢号成功");
                                SetStyle("startDiv","block");
                                SetStyle("stopDiv","none");
                                $("#startDiv")[0].value = "start";
                                console.log(getMyCount());
                                setMyCount("add");
                                runText.title = "当前抢号成功数："+getMyCount();
                                return;
                            }else{
                                console.log("抢号失败");
                                MytiemWaitingRs();//抢号失败，继续循环
                            }

                        }else{//??????????
                            //                             count=0;
                        }
                    }else if(successStats == false){//跳过按钮可用，即叫号成功
                        console.log("你已经成功叫号了");
                        SetStyle("startDiv","block");
                        SetStyle("stopDiv","none");
                        count=0;
                        $("#startDiv")[0].value = "start";
                        return;
                    }else if(RunSotpStats == "stop"){//停止叫号
                        SetStyle("startDiv","block");
                        SetStyle("stopDiv","none");
                        count=0;
                        $("#startDiv")[0].value = "start";

                    }else{
                        alert("脚本错误");
                    }
                    //                     console.log("抢号次数：",count,"等待人数：",Anum,"是否抢号成功：",!successStats);


                }
            });
        }

        function SetStyle(id,staus){
            if(id){
                $('#'+id+'')[0].style.display = staus;

            }else{
                console.log("获取id失败");
            }
        }

        function GetUser(){//获取登录用户信息
            var ck=window.frames["topFrame"].document.getElementsByTagName("script");
            //         console.log(ck);
            /*             for(var c in ck) {
                console.log(c);
                if(!isNaN(c)) {
                    //             console.info(c+ " - "+ ck[c].innerHTML.replace(/[\n| ]/g,"").substr(0,10));
                    console.info(c+ " - "+ ck[c].innerHTML.replace(/[\n| ]/g,"").substr(2130,30));
                }
            } */
            username = ck[0].innerHTML.replace(/[\n| ]/g,"").substr(2130,3);
            //             console.log(username);
            userid = ck[0].innerHTML.replace(/[\n| ]/g,"").substr(2150,8);
            //             console.log(userid);
            return userid;
        }

        function SerchId(users,pc){
            var logo = window.frames["topFrame1"].document.getElementById("logo");
            logo.style.cursor = "pointer";
            logo.onclick = function(){
                //----数据存储相关
                if(getMyTime()==false){//正常为返回时间，格式：20210907，返回false说明需要初始化time（getMyTime会初始化），count
                    setMyCount();//初始化count
                }


                //-----数据存储相关结束
                var runText = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("runText");//获取计数元素，判断是否插入隐藏
                //获取cookie中的pcName
                var cookies = document.cookie.split(";");
                var n;
                for(n in cookies){
                    if(cookies[n].length==10){
                        var cookieId = cookies[n].substr(7,3);
                    }
                }
                if(cookieId==""){alert("脚本错误");return;}

                //     var printId = prompt("请输入id",defaultId);
                //   if(printId==null||printId==""){printId="0lC";}
                //             printId = toCode(printId);
                //                 console.log(printId);
                userid = GetUser();//获取userid
                userid = toCode(userid);//转换加密格式
                //                 console.log(username,"----",userid);
                for(var i in users){
                    if(userid == users[i]){//id认证成功
                        var pcArr = pc[users[i]].split("/");
                        for(var j in pcArr){
                            if(cookieId == pcArr[j]){//有权限，显示aply

                                //                             defaultId = fromCode(printId);
                                //插入叫号计数
                                if(runText==null){ImportRunText();}
                                //给弹窗默认赋值
                                SetStyle("palyDiv","block");
                                SetStyle("startDiv","block");
                                SetStyle("pauseDiv","none");
                                num++;
                                break;
                            }else if(j == (pcArr.length-1)){//若权限在数组后面位置，不必每遍历一个位置，都提示权限不足(仅当遍历到最后一位，没有权限才提示)
                                SetStyle("palyDiv","none");
                                SetStyle("startDiv","none");

                                alert("权限不足");
                                return;
                            }
                        }
                        break;//查询到权限即退出，不继续遍历
                    }else if(i == (users.length-1)){
                        SetStyle("palyDiv","none");
                        SetStyle("startDiv","none");

                        alert("认证失败");
                        return;
                    }
                }
                //当奇数次点击logo时显示，再次点击隐藏
                if(num%2 == 0){//奇数显示，偶数隐藏
                    SetStyle("palyDiv","none");
                    SetStyle("startDiv","none");
                    SetStyle("pauseDiv","none");
                    SetStyle("stopDiv","none");
                }
            }
        }

        /*         function SerchId(users,pc){
            var logo = window.frames["topFrame1"].document.getElementById("logo");
            logo.onclick = function(){
                var runText = window.frames["mainFrame1"].window.frames["iframe"].contentDocument.getElementById("runText");//获取计数元素

                //获取cookie中的id
                var cookies = document.cookie.split(";");
                var n;
                for(n in cookies){
                    if(cookies[n].length==11||cookies[n].length==10){
                        cookieId = cookies[n].substr(7,3);
                    }
                }
                if(cookieId==""){alert("脚本错误");return;}

                var printId = prompt("请输入id",defaultId);
                if(printId==null||printId==""){printId="0lC";}
                printId = toCode(printId);
                //                 console.log(printId);
                var i;
                for(i in users){

                    if(printId == users[i]){//id认证成功
                        var pcArr = pc[users[i]].split("/");
                        var j;

                        for(j in pcArr){
                            if(pcArr[j] == cookieId){//有权限，显示aply
                                defaultId = fromCode(printId);
                                //插入叫号计数
                                if(runText==null){ImportRunText();}
                                //给弹窗默认赋值
                                SetStyle("palyDiv","block");
                                SetStyle("startDiv","block");
                                //                                 SetStyle("pauseDiv","none");
                                break;
                            }else if(j == (pcArr.length-1)){//若权限在数组后面位置，不必每遍历一个位置，都提示权限不足(仅当遍历到最后一位，没有权限才提示)
                                SetStyle("palyDiv","none");
                                SetStyle("startDiv","none");

                                alert("权限不足");
                                return;
                            }
                        }
                        break;//查询到权限即退出，不继续遍历
                    }else if(i == (users.length-1)){
                        SetStyle("palyDiv","none");
                        SetStyle("startDiv","none");

                        alert("认证失败");
                        return;
                    }
                }
            }
        } */

        function toCode(str){//加密字符串
            //定义密钥，36个字母和数字
            var key = "0l23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var l = key.length;  //获取密钥的长度
            var a = key.split("");  //把密钥字符串转换为字符数组
            var s = "",b, bl, b2, b3;  //定义临时变量
            if(str.length == 0 ||str.length==null||str.length==""){s = "0lC";return s;}
            for (var i = 0; i <str.length; i ++) {  //遍历字符串
                b = str.charCodeAt(i);  //逐个提取每个字符，并获取Unicode编码值
                bl = b % l;  //求Unicode编码值得余数
                b = (b - bl) / l;  //求最大倍数
                b2 = b % l;  //求最大倍数的于是
                b = (b - b2) / l;  //求最大倍数
                b3 = b % l;  //求最大倍数的余数
                s += a[b3] + a[b2] + a[bl];  //根据余数值映射到密钥中对应下标位置的字符
            }
            return s;  //返回这些映射的字符
        }

        function fromCode(str){//加密字符串
            //定义密钥，36个字母和数字
            var key = "0l23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var l = key.length;  //获取密钥的长度
            var b, bl, b2, b3, d = 0, s;  //定义临时变量
            s = new Array(Math.floor(str.length / 3));  //计算加密字符串包含的字符数，并定义数组
            b = s.length;  //获取数组的长度
            for (var i = 0; i < b; i ++) {  //以数组的长度循环次数，遍历加密字符串
                bl = key.indexOf(str.charAt(d));  //截取周期内第一个字符串，计算在密钥中的下标值
                d ++;
                b2 = key.indexOf(str.charAt(d));  //截取周期内第二个字符串，计算在密钥中的下标值
                d ++;
                b3 = key.indexOf(str.charAt(d));  //截取周期内第三个字符串，计算在密钥中的下标值
                d ++;
                s[i] = bl * l * l + b2 * l + b3  //利用下标值，反推被加密字符的Unicode编码值
            }
            b = eval("String.fromCharCode(" + s.join(',') + ")");//用fromCharCode()算出字符串
            return b ;  //返回被解密的字符串
        }

        function MyLogin(username,password){//自动填充用户名密码
            //             var url = window.location.pathname;
            // console.log(url);
            switchLogin(2);
            setTimeout(function(){
                $("#account")[0].value = username;
                $("#password")[0].value = password;
            },300);
        }
        function ChangeTransparency(idname){//改变透明度
            var obig  = document.getElementById(idname);
            bianse(20);
            obig.onmouseover = function()
            {
                bianse(100);
            }
            obig.onmouseout = function()
            {
                bianse(20);
            }
            function bianse(target)
            {
                var alpha=30;
                var speed='';
                clearInterval(timer);
                var timer = null;
                timer=setInterval(function()
                                  {
                    if(target<alpha)
                    {
                        speed=-10;
                    }
                    else{
                        speed=10;
                    }
                    if(alpha==target)
                    {
                        clearInterval(timer)
                    }
                    else{
                        alpha+=speed;
                        obig.style.filter='alpha(opacity='+speed+')';
                        obig.style.opacity=alpha/100;
                    }
                } , 1);
            }  }

        //--------------数据存储相关函数开始---------------------

        function getMyCount(){

            var count = localStorage.count;
            //     console.log(count);
            if(count==undefined||count == ""){//初始化0
                localStorage.count = 0;
                //         console.log(count);
            }else if(count < 0 ){
                console.log("数据获取失败count!");
            }
            return count;
            //localStorage.clear();
        }
        function setMyCount(act){//act为空时,初始化;act=add,++
            if(act == null || act == ""){
                localStorage.count = 0;
            }else if(act == "add"){
                localStorage.count = parseInt(getMyCount()) + 1;
            }else{
                console.log("参数错误");
            }
        }

        function getMyTime(){//获取存储时间，未定义/空/过期则直接初始化
            var time = localStorage.time;
            var today = getToDayYMT();
            //     console.log(time);
            if(time == undefined || time == "" || time < today){//初始化当天时间
                localStorage.time = today;
                return false;//*************返回false，存储数据需要初始化*************
            }else if(time.length != 8){
                console.log("数据获取失败time!!");
            }
            return time;
        }

        function getToDayYMT(){//获取当天时间年月日,格式：20210907
            var date = new Date();
            var today = ""+addZero(date.getFullYear())+(addZero(date.getMonth()+1))+addZero(date.getDate());//addZero()补0
            return today;
        }
        function addZero(att){//补0
            att = att<10?('0'+att):att;
            return att;
        }


        //----------------数据存储相关函数结束-----------------

        //**********************函数结束************************************

    }
})();