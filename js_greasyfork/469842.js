// ==UserScript==
// @name         扫码- -！！！
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  扫码- -!
// @author       DMW
// @match        http://172.20.233.155:7016/iaic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469842/%E6%89%AB%E7%A0%81-%20-%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/469842/%E6%89%AB%E7%A0%81-%20-%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //window.onload = function(){
    setTimeout(function(){
        let url = window.location.pathname;
        //console.log(url);
        if(url == '/iaic/jsp/iaic/common/util/company_List.jsp'||window.location.pathname=='/iaic/jsp/iaic/common/util/gtCompany_List.jsp'){
            saoma();//主函数
        }
        if(url == '/iaic/jsp/lcp/portal/workbench/ls_main.jsp'){
            document.querySelector('#menu').innerHTML +=`<a href = 'http://172.20.233.155:7016/iaic/jsp/iaic/common/util/gtCompany_List.jsp?ywcode=020502' target="_blank">扫个体</a>
                <a href = 'http://172.20.233.155:7016/iaic/jsp/iaic/common/util/company_List.jsp?ywcode=020302' target="_blank">扫企业</a>
                <a href = 'http://172.20.233.155:7016/iaic/jsp/iaic/common/util/company_List.jsp?ywcode=020402' target="_blank">扫合作社</a>`;
        }

    },80);

    var f = true
    ,url_main = ''//window.location.search
    ,num = 0
    ,msg =`查询成功${num}次。`;
    function my_ewmScan(text) {
        var cmd = new L5.Command("com.inspur.iaic.common.dzzz.cmd.EwmCmd");
        cmd.setParameter("qrid", text);
        cmd.execute("phEwmScan");
        if (!cmd.error) {
            var code = cmd.getReturn("code");
            if (code == "200") {
                document.getElementById("content").value = cmd.getReturn("entname");
                document.getElementById("zhucehao").value = cmd.getReturn("uniscid");
                query();
                console.log("查询中");
                //通过判断L5-gen7 子节点数判断查询是否成功，3是查询结束或者初始状态， 5正在查询中
                setTimeout(function(){
                    loading();
                },1000);


            } else {
                if (code == "500") {
                    //L5.Msg.alert("提示",cmd.getReturn("message"));
                    f = false;
                    let count = num;
                    num = 0 ;
                    localStorage.setItem("sid","");
                    localStorage.setItem("sum",(parseInt(localStorage.getItem("sum"))+count));
                    L5.Msg.alert("提示", `验证码过期，本次查询次数:${count}`);
                    return "";
                }
            }
        } else {
            f = false;
            L5.Msg.alert("提示", "查询出错:" + cmd.error);
            return "";
        }

    }
    function loading(){

        let querloading = document.querySelector('#L5-gen7').childNodes.length;
        let count = document.querySelector('#mycount');
        console.log("查询状态：",querloading);
        count.value = `查询成功${num}次。`+`查询中,状态${querloading}`;
        if ((f == true)&&(querloading==3)) {//查询成功
            num++;
            //my_ewmScan(text);
            console.log("查询状态3/5：",querloading,"下一轮查询");
            count.value = `查询成功${num}次。下一轮查询`;
            //document.querySelector('#mybutton').click();
            let text = document.querySelector('#myinput').value;
            my_ewmScan(text);

        }else if((f == true)&&(querloading==5)){
            //console.log('查询中……',querloading);
            //querloading = document.querySelector('#L5-gen7').childNodes.length;
            count.value = `查询成功${num}次。`+`查询中,状态${querloading}`;
            setTimeout(function() {
                loading();
            }, 1000);
        }

    }

    // 	my_ewmScan('67739637');
    function saoma() {
        document.querySelectorAll('td')[4].remove();
        let mytd = document.createElement('td');
        mytd.className = 'FieldLabel';
        mytd.textContent = '验证码';
        document.querySelector('tr').append(mytd);
        let mytdinput = document.createElement('td');
        mytdinput.className = 'FieldInput';
        document.querySelector('tr').append(mytdinput);
        let myinput = document.createElement('input');
        //let parent = document.querySelector('#content').parentNode;//parentNode   parentElement
        let parent = mytdinput;
        //console.log(parent);
        myinput.id = 'myinput';
        if(window.location.search =='?ywcode=020302'){
            myinput.placeholder = '扫企业到这里';
        }else if(window.location.search == '?ywcode=020502'){
            myinput.placeholder = '扫个体到这里';
        }else if(window.location.search == '?ywcode=020402'){
            myinput.placeholder = '扫合作社到这里';
        }


        parent.append(myinput);
        let mybutton = document.createElement('input');
        mybutton.id = 'mybutton';
        mybutton.type = 'button';
        mybutton.style = 'background:#cfdff3;width:90px;margin-left: 10px;margin-right: 50px;';
        mybutton.value = '查到码过期- -!!';
        parent.append(mybutton);
        (mybutton.onclick = function myinputclick() {
            //绑定点击事件
            let text = document.querySelector('#myinput').value;

            if (text.length > 0) {//输入验证码
                localStorage.setItem("sid",text);//sid有验证码数据时自动查询，否则查询输入的结果。验证码过期后clear
                localStorage.setItem("sum",0);//重置计数
                my_ewmScan(text);
            }else{//未输入验证码，检查缓存是否有数据，有则自动查询
                //if(localStorage.length >0){
                let sid = localStorage.getItem("sid");
                if(sid != ""){
                    document.querySelector('#myinput').value = sid;
                    my_ewmScan(document.querySelector('#myinput').value);

                }
            }

        })();

        let mycount = document.createElement('input');
        mycount.id = 'mycount';
        mycount.value = msg;
        mycount.style = 'width:200px';
        parent.append(mycount);
        let suminput = document.createElement('input');
        suminput.id = 'mysumbutton';
        suminput.type = 'button';
        suminput.style = 'background:#cfdff3;width:90px;margin-left: 10px;margin-right: 50px;';
        suminput.value = '计算查询总数';
        parent.append(suminput);
        suminput.onclick = function(){
            L5.Msg.alert("提示", `总计查询次数:${localStorage.getItem("sum")}`);
            /*             for(let i =0;i<=3;i++){
                window.open(url, '_blank')
            } */

        }
        let mytd1 = document.createElement('td');
        mytd1.className = 'FieldInput';
        mytd1.textContent = '多开网页个数：';
        document.querySelector('tr').append(mytd1);
        parent = mytd1;

        let myopeniput = document.createElement('input');
        myopeniput.id = 'myopeniput';
        myopeniput.placeholder = "默认1个";
        myopeniput.style = 'width:40px';
        parent.append(myopeniput);
        let openbutton = document.createElement('input');
        openbutton.id = 'openbutton';
        openbutton.type = 'button';
        openbutton.style = 'background:#cfdff3;width:90px;margin-left: 10px;';
        openbutton.value = '多开';
        parent.append(openbutton);
        openbutton.onclick = function(){
            let url = window.location.href;
            let myopeniput = document.querySelector('#myopeniput').value;
            if(myopeniput == ""){
                myopeniput = 1;
            }
            for(let i =0;i<myopeniput;i++){
                window.open(url, '_blank')
            }

        }

    }


    //  }
})();