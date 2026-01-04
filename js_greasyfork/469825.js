// ==UserScript==
// @name         政务服务网优化
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  政务服务网优化!
// @author       大魔王
// @match        http*://zwfw.sd.gov.cn/JIS/front/login.do?*
// @match        http*://218.57.139.23:10010/*
// @match        http*://tysfrz.isdapp.shandong.gov.cn/jis-web/login*
// @match        http*://218.57.139.18:10000/nameregister/goMain*
// @run-at       document-end
// @match        http*://yct.amr.shandong.gov.cn/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/469825/%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469825/%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*
    1、登陆
    2、企业信息列表跳过【电子营业执照扫码办理】
    3、核名关闭弹窗
    4、UI改版后电子签名颜色修改
    5、禁用前三行点击，增加点击公司名复制（无字号个体***不复制）
    6、2023年11月1日14:51:14 发起变更/备案/注销业务时，记住代码身份证，方式发起失败重新输入
    7、2023年12月27日16:07:10 重新支持自动登录
    8、v0.41 2024年1月17日14:08:23 修复添加用户时，用户名/密码为空可以正常添加的bug
    9、v0.42 2024年1月25日10:27:47 已经登录账号，点击退出登录后再登录，会跳转账号信息界面，这里跳转到正常登录页面
    */
    window.onload = function () {
        //政务服务网登录   个人工作台 "/psout/jsp/gcloud/iaicweb/homepage/apply_manage.jsp"
        var url = window.location.pathname;


        if ("/JIS/front/login.do" == url || "/jis-web/login" == url) {
            //已经登录账号，点击退出登录后再登录，会跳转账号信息界面，这里跳转一下

            if(window.location.search ==""){
                console.log("跳转");
                setTimeout(function(){
                    window.location.href = 'https://tysfrz.isdapp.shandong.gov.cn/jis-web/login?appMark=scjdqykbyctxt&userType=1&backUrl=https://yct.amr.shandong.gov.cn/psout/jsp/gcloud/pubservice/network/ssologin.jsp?gotourl=null';
                },30);

            }
            console.log("快捷登录");
            //myLogin();//网站更新，已不匹配
            //myLogin1();//账号密码写死的
            myLogin2();//账号密码自己动态添加

        }
        if ("/psout/jsp/gcloud/iaicweb/homepage/apply_manage.jsp" == url) {//个人工作台
            console.log("个人工作台");
            var floatTag = document.getElementById('float');
            //console.log(document.getElementById('float').style.length);
            if (floatTag.style.length == 20) {//长度20说明float弹窗没有display属性，说明没有被隐藏，执行自带的方法关闭；21说明关闭成功
                closeFloat();
                console.log("关闭float浮动弹窗");
            }
            notClickAndCopy();//禁用前三行点击，增加点击公司名复制（无字号个体***不复制）


        }
        if ("/iaicweb/jsp/gcloud/iaicweb/qydj/step_one.jsp" == url || "/iaicweb/jsp/gcloud/iaicweb/qydj/jyzxStepOne.jsp" == url) {//企业信息列表跳过【电子营业执照扫码办理】
            //input失去焦点事件
            $('#regno')[0].onblur = function () {
                if ($('#regno').val() != '') {
                    sessionStorage.setItem('regno', $('#regno').val());
                }
            }
            $('#ceno')[0].onblur = function () {

                if ($('#ceno').val() != '') {
                    sessionStorage.setItem('ceno', $('#ceno').val());
                }

            }
            if ($("input[name='inputType']")[0]) {
                $("input[name='inputType']")[1].click();
            }
            console.log("变更/注销业务，跳过【电子营业执照扫码办理】");
            saveRegnoCeno();
        }
        if ("nameregister" == (url.split("/"))[1]) {//分割一下
            if (!$('#zxzysx')[0].checked) {
                $('#zxzysx').click();//未被选中时选中【已阅知上述材料】按钮
            }
            $('#agreezysx').click();//关闭弹窗
            console.log("核名系统，关闭提示弹窗");
        }
        if ("/iaicweb/jsp/gcloud/iaicweb/qydj/qydj_tjsp.jsp" == url) {//UI改版后全程电子化不明显，通过修改sta1的css属性来解决
            ImportCss();

        }

        function saveRegnoCeno() {//变更、注销时，记住输入的代码和身份证号，添加一键后悔按钮
            let regno = document.querySelector('#regno');
            let ceno = document.querySelector('#ceno');
            let button1 = document.createElement('button');
            let button_next = $('.btn-primary');
            button1.id = 'button1';
            button1.className = 'btn btn-primary';
            button1.style = "margin-right: 20px;margin-left: -20px;"
            button1.textContent = '系统抽风发起业务失败时点我';
            button_next.parent().prepend(button1);
            //button_next[1].addeventlistener('click',function(){alert(1)});

            document.querySelector('#button1').onclick = function () {

                if ($('#regno').val() == sessionStorage.getItem('regno')) {
                    $('#regno').focus().select();
                    $('#regno').val('');
                    $('#ceno').focus().select();
                    $('#ceno').val('');

                } else {
                    $('#regno').focus().select();
                    $('#regno').val(sessionStorage.getItem('regno'));
                    $('#ceno').focus().select();
                    $('#ceno').val(sessionStorage.getItem('ceno'));

                }

                if (sessionStorage.getItem('regno') == null || sessionStorage.getItem('regno') == "" || sessionStorage.length == 0) {
                    return;
                }
                //$('.btn-primary')[1].click();

            }

        }
        function ImportCss() {
            var myCss = document.createElement("style");
            myCss.type = "text/css";
            myCss.innerHTML = ".sta1{border-radius: 5px;background-color: #00ab5b;color: #f7f0f0;}";
            $("head")[0].appendChild(myCss);
            console.log("插入css，优化电子签名显示");
        }

        function myLogin() {//网站已更新，不匹配
            //$("#cloud")[0].style.display = "none";
            $("#cloud").remove();
            $("#cloud1").remove();
            $("#grloginform").css('margin-top', '0');
            $('#per_agreement').attr('checked', true);//协议自动勾选
            var userNames = ["王宇洋", "孟凡超", "赵邦", "侯嘉琳", "孙玉杰", "安雪", "高飞", "高冠英", "薛俊鹏"];
            var userId = ["17853461263", "13290205167", "17805495755", "15192810080", "18660903090", "18660981692", "15554908659", "15253983305", "15666155266"];
            var userPass = ["123456a?", "zxc12345", "a12345678", "123456a?", "Aa123456.", "ax123456", "gf123456", "Hedong19?", "mima12345."];
            for (var i = 0; i < userNames.length; i++) {
                var parent = $("span")[10];
                parent = document.getElementsByTagName("span")[10];
                var span = document.createElement("span");
                span.id = i;
                span.style.color = "#858585";
                span.style.cursor = "pointer";
                span.title = userId[i];
                span.textContent = userNames[i]
                //span.textContent = "|我的登录";


                //添加分割线,多次使用
                var span2 = document.createElement("span");
                span2.style = "color: #858585;";
                span2.textContent = " | ";

                parent.append(span2);
                parent.append(span);

                span.onclick = function () {//绑定点击事件
                    if ($("#grusername")[0].value == "") {
                        $("#grusername").val(userId[this.id]);
                        $("#grpwd").val(userPass[this.id]);
                    } else {
                        $("#grusername").val("");
                        $("#grpwd").val("");
                    }
                    $('#per_agreement').attr('checked', true);//协议自动勾选

                }
                span.onmouseover = function () {//绑定移入事件    持续性用onmousemove
                    //console.log("移入");
                    this.style.fontWeight = "Bold";
                    this.style.color = 'rgb(232 23 23)';
                    this.style.backgroundColor = 'rgb(222 222 222)';
                    //this.style = 'font-weight:bold;color:rgb(232 23 23);';

                }
                span.onmouseout = function () {//绑定移出事件
                    //console.log("移出");
                    this.style.fontWeight = '';
                    this.style.color = '#858585';
                    this.style.backgroundColor = 'rgb(255 255 255)';
                    //this.style = 'font-weight:500;color:#858585;';
                }


            }
        }
        function myLogin1() {//
            let input = new Event('input');//vue框架无法直接赋值
            let change = new Event('change');
            let parent = document.querySelectorAll('.ant-form-item-children')[10];
            if (!parent) {
                setTimeout(myLogin1, 200);
                return;
            }
            let name = document.querySelectorAll('#name')[1];
            let password = document.querySelectorAll('#password')[1];
            $("#cloud1").remove();

            var userNames = ["王宇洋", "孟凡超", "赵邦", "侯嘉琳", "孙玉杰", "安雪", "高飞", "高冠英", "薛俊鹏"];
            var userId = ["17853461263", "13290205167", "17805495755", "15192810080", "18660903090", "18660981692", "15554908659", "15253983305", "15666155266"];
            var userPass = ["123456a?", "zxc12345", "a12345678", "123456a?", "Aa123456.", "ax123456", "gf123456", "Hedong19?", "mima12345."];
            for (var i = 0; i < userNames.length; i++) {

                //parent = document.getElementsByTagName("span")[10];
                //parent = document.querySelectorAll('.ant-form-item-children')[10];
                var span = document.createElement("span");
                span.id = i;
                span.style.color = "#858585";
                span.style.cursor = "pointer";
                span.title = userId[i];
                span.textContent = userNames[i]
                //span.textContent = "|我的登录";


                //添加分割线,多次使用
                var span2 = document.createElement("span");
                span2.style = "color: #858585;";
                span2.textContent = " | ";

                parent.appendChild(span2);
                parent.append(span);

                span.onclick = function () {//绑定点击事件  
                    if (name.value == "") {
                        name.value = userId[this.id];
                        name.dispatchEvent(input);
                        password.value = userPass[this.id];
                        password.dispatchEvent(input);
                    } else {
                        name.value = '';
                        name.dispatchEvent(input);
                        password.value = '';
                        password.dispatchEvent(input);

                    }
                    //遍历协议自动勾选          
                    let checkboxArray = document.querySelectorAll('.ant-checkbox-input');
                    for (let i = 0; i < checkboxArray.length; i++) {
                        checkboxArray[i].checked = true;
                        checkboxArray[i].dispatchEvent(change);
                    }

                }
                span.onmouseover = function () {//绑定移入事件    持续性用onmousemove
                    //console.log("移入");
                    this.style.fontWeight = "Bold";
                    this.style.color = 'rgb(232 23 23)';
                    this.style.backgroundColor = 'rgb(222 222 222)';
                    //this.style = 'font-weight:bold;color:rgb(232 23 23);';                   
                }
                span.onmouseout = function () {//绑定移出事件
                    //console.log("移出");
                    this.style.fontWeight = '';
                    this.style.color = '#858585';
                    this.style.backgroundColor = 'rgb(255 255 255)';
                    //this.style = 'font-weight:500;color:#858585;';
                }


            }
        }
        function myLogin2() {//动态添加版本
            let storage = window.localStorage;
            let uData = [{}];
            let input = new Event('input');//vue框架无法直接赋值
            let change = new Event('change');
            let parent = document.querySelectorAll('.ant-form-item-children')[10];
            if (!parent) {
                setTimeout(myLogin2, 200);
                return;
            }
            let name = document.querySelectorAll('#name')[1];
            let password = document.querySelectorAll('#password')[1];
            $("#cloud1").remove();
            reload();
            function reload() {//初始化函数
                let oldData = JSON.parse(storage.getItem("uData"));
                //let parent = document.getElementsByTagName("div")[0];
                if (oldData) {

                    for (let i = 0; i < oldData.length; i++) {
                        /*                     console.log(`登录名：`,oldData[i][0].uid);
                    console.log(`密码：`,oldData[i][0].upwd); */
                        let newUser = cyEle(oldData[i]);
                        parent.append(newUser);
                        parent.append(cyEle());
                        newUser.onclick = function () {
                      
                            if (name.value == "") {
                                name.value = oldData[i].uid;
                                name.dispatchEvent(input);
                                password.value = oldData[i].upwd;
                                password.dispatchEvent(input);
                            } else {
                                name.value = '';
                                name.dispatchEvent(input);
                                password.value = '';
                                password.dispatchEvent(input);

                            }
                            //遍历协议自动勾选          
                            let checkboxArray = document.querySelectorAll('.ant-checkbox-input');
                            for (let i = 0; i < checkboxArray.length; i++) {
                                checkboxArray[i].checked = true;
                                checkboxArray[i].dispatchEvent(change);
                            }
                        }

                    }
                }

                let add = cyEle(" + ");
                let del = cyEle(" - ");
                let revise = cyEle(" * ");
                let updata = cyEle(" updata ");

                parent.append(add);
                parent.append(cyEle());
                parent.append(del);
                parent.append(cyEle());
                parent.append(revise);
                parent.append(cyEle());
                parent.append(updata);
                add.onclick = function () {
                    addUser();
                }
                del.onclick = function () {
                    dele();
                }
                revise.onclick = function () {
                    Revise();
                }
                updata.onclick = function () {
                    let updataUrl = 'https://greasyfork.org/zh-CN/scripts/469825-%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E7%BD%91%E4%BC%98%E5%8C%96';
                    window.open(updataUrl, '_blank');
                }

            }
            function addUser() {

                let uname, uid, upwd1, upwd2;
                let oldData = JSON.parse(storage.getItem("uData"));
                console.log(oldData);
                uname = prompt(`请输入用户姓名`, "").trim();
                let judgeFn = new RegExp(/\s+/g);
                if (judgeFn.test(uname)) {
                    alert("内容包含有空格!");
                    return;
                }
                console.log(uname != null && uname != "");
                if (uname != null && uname != "") {

                    if (oldData && oldData.length > 0) {
                        //检查是否重复添加
                        for (let i = 0; i < oldData.length; i++) {
                            if (uname === oldData[i].uname) {
                                alert(`【${uname}】已经添加`);
                                return;
                            }
                        }
                    }
                    uid = prompt(`${uname}请输入你的登录名`, "").trim();
                    if (judgeFn.test(uid)) {
                        alert("内容包含有空格!");
                        return;
                    }

                    if (uid != null && uid != "") {

                        upwd1 = isPwd(uname, uid);
                        while (upwd1 == false) {
                            upwd1 = isPwd(uname, uid);
                        }

                    }else{
                        return;
                    }

                } else {
                    return;
                }
                console.log(uname, uid, upwd1);
                //新增

                if (oldData && oldData.length > 0) {

                    oldData[oldData.length] = {//增加
                        uname: uname,
                        uid: uid,
                        upwd: upwd1

                    };
                    uData = oldData;
                    console.log('add');
                } else {//初始化
                    uData[0] = {
                        uname: uname,
                        uid: uid,
                        upwd: upwd1

                    };
                    console.log('初始化');
                }

                console.log(uData);
                //保存
                storage.setItem("uData", JSON.stringify(uData));
                alert(`添加用户【${uname}】成功~~`);
                //重载数据
                location.reload();
            }

            function dele() {
                let oldData, dname, dpwd, isFind;
                isFind = false;
                oldData = JSON.parse(storage.getItem("uData"));
                //console.log(oldData[0][0].uname);
                console.log(typeof oldData[0]);
                dname = prompt(`请输入要删除的用户名字`, "").trim();
                if (dname != null && dname != "") {
                    //判断是否有这个账号
                    for (let i = 0; i < oldData.length; i++) {
                        if (dname === oldData[i].uname) {
                            isFind = true;
                            dpwd = prompt(`请输入密码确认删除`, "").trim();
                            if (dpwd != null && dpwd != "") {
                                //判断密码是否正确
                                if (dpwd === oldData[i].upwd) {
                                    //删除
                                    //let deStr = oldData[i][0];
                                    console.log(`删除该条记录：`, oldData.splice(i, 1));
                                    uData = oldData;
                                    storage.setItem("uData", JSON.stringify(uData));
                                    alert(`删除用户【${dname}】成功~~`);
                                    location.reload();
                                } else {
                                    alert(`密码错误！！！`);
                                }
                            }
                        }
                    }
                    if (!isFind) {
                        alert(`未查询到用户${dname}`);
                    }


                } else {
                    return;
                }
            }
            function Revise() {
                let pname, oldPwd, newpwd, newPwd, oldData, oldUid, isFind;
                oldData = JSON.parse(storage.getItem("uData"));
                pname = prompt(`请输入要修改的账号用户名`, "").trim();
                let judgeFn = new RegExp(/\s+/g);
                if (judgeFn.test(pname)) {
                    alert("内容包含有空格!");
                    return;
                }
                if (pname != null && pname != "") {
                    //oldPwd = prompt(`请输入原密码`,"").trim();
                    console.log(typeof oldData);
                    //判断是否有这个账号
                    for (let i = 0; i < oldData.length; i++) {
                        if (pname === oldData[i].uname) {
                            isFind = true;
                            oldUid = oldData[i].uid;
                            oldPwd = prompt(`请输入原密码`, "").trim();
                            if (oldPwd != null && oldPwd != "") {
                                //判断密码是否正确
                                console.log(oldData[i], oldData[i].upwd);
                                if (oldPwd === oldData[i].upwd) {
                                    //输入两次新密码
                                    newpwd = isPwd(pname, oldData[i].uid)

                                    while (newpwd == false) {
                                        newpwd = isPwd(pname, oldData[i].uid)
                                    }
                                    //let deStr = oldData[i][0];
                                    console.log(`修改该条记录：`, oldData.splice(i, 1));
                                    oldData[oldData.length] = {//增加
                                        uname: pname,
                                        uid: oldUid,
                                        upwd: newpwd

                                    };
                                    uData = oldData;
                                    storage.setItem("uData", JSON.stringify(uData));
                                    alert(`修改用户【${pname}】成功~~`);
                                    location.reload();
                                } else {
                                    alert(`原密码错误！！！`);
                                }
                            }
                        }
                    }
                    if (!isFind) {
                        alert(`未查询到用户${pname}`);
                    }

                } else {
                    return;
                }
            }
            function cyEle(types) {//创建元素
                //let type = types.uname;
                let span = document.createElement("span");
                if (!types) {

                    span.style = "color: #858585;";
                    span.textContent = " | ";
                } else {
                    span.style = "color: #858585;";
                    //span.style="color: #858585;font-size: 16px;";
                    if ("string" == (typeof types)) {
                        span.textContent = `${types}`;
                    }
                    if ("object" == (typeof types)) {
                        span.textContent = `${types.uname}`;
                        span.title = `${types.uid}【${types.upwd}】`;
                    }

                    span.onmouseover = function () {//绑定移入事件    持续性用onmousemove
                        this.style.fontWeight = "Bold";
                        this.style.color = 'rgb(232 23 23)';
                        this.style.cursor = "pointer";
                        this.style.backgroundColor = 'rgb(222 222 222)';
                        

                    }
                    span.onmouseout = function () {//绑定移出事件
                        this.style.fontWeight = '';
                        this.style.color = '#858585';
                        this.style.cursor = "pointer";
                        this.style.backgroundColor = 'rgb(255 255 255)';
                        
                    }

                }
                //console.log('cyEle调用',type);
                return span;
            }
            function isPwd(uname, uid) {
                let upwd1, upwd2;
                let judgeFn = new RegExp(/\s+/g);
                upwd1 = prompt(`${uname}[${uid}]请输入你的密码`, "").trim();
                if (judgeFn.test(upwd1)) {
                    alert("内容包含有空格!");
                    return false;
                }
                if (upwd1 != null && upwd1 != "") {

                    upwd2 = prompt(`${uname}[${uid}]请再次输入你的密码`, "").trim();
                    if (upwd2 != null && upwd2 != "") {

                        if (upwd1 != upwd2) {
                            alert("两次密码不一致,请重新输入!");
                            return false;
                            //isPwd(uname,uid);
                        } else {
                            return upwd1;
                        }

                    }
                    return true;
                }else{
                    return false;
                }

            }
        }

        //禁用前三行点击，增加点击公司名复制（无字号个体***不复制）
        function notClickAndCopy() {
            //window.frames["mainContent"].document.querySelector("font").textContent = `dmw:点击企业名称可复制到剪贴板`;
            //window.frames["mainContent"].document.querySelector("font").style.textDecoration = 'line-through';
            let font = window.frames["mainContent"].document.querySelector("font");
            let text = font.textContent;
            let changeTxt = window.frames["mainContent"].document.querySelector("[data-field='ENTNAME']");
            changeTxt.textContent = changeTxt.textContent + '(单击可复制)';
            //font.innerHTML = "<p><del>"+text+"</del>&nbsp;dmw:点击企业名称可复制到剪贴板<b>aaa</b></p>"
            font.innerHTML = "<b><a href='https://greasyfork.org/zh-CN/scripts/469825-%E6%94%BF%E5%8A%A1%E6%9C%8D%E5%8A%A1%E7%BD%91%E4%BC%98%E5%8C%96'target='blank'>更新脚本</a></b>&nbsp;dmw:点击企业名称可复制到剪贴板</p>"
            //let iframe = document.getElementById('mainContent');
            //let ifm = window.frames["mainContent"].document.querySelectorAll('tr');
            //console.log(ifm.length);
            let addscript = document.createElement("script");
            //addscript.type = "script";
            addscript.innerHTML = `
        //表格加载回调
        function tableDrawCallback(){
            setHeight1();
            $(".table>tbody>tr").each(function (e) {
                $(this).find("td:eq(0)").css({"display":"none"});
                if(!($("#djyw").is(":visible")||$("#blzt").is(":visible"))){
                    $(this).find("td:eq(2)").css({"display":"none"});
                    $(this).find("td:eq(4)").css({"display":"none"});
                    $("#jdts").css({"display":"none"});
                }else{
                    $("#jdts").css({"display":"display"});
                    var openo = $(this).find("td:eq(0)").text();
                    var state = $(this).find("td:eq(4)").text();

                    for(var i=1;i<=3;i++){
                        $(this).find("td:eq("+i+")").on("click", function(e) {
                            if(showOriginalYw){
                                return;
                            }
                            var a = "";
                            if(state.indexOf("已驳回")>=0){
                                G3.alert("提示","您所申报的业务已被登记机关驳回，请点击【查看驳回通知书】按钮进行查看！");
                                return;
                            }
                            if(isQd){
                                if(state.indexOf("已退回")>=0){
                                    G3.alert("提示","您所申报的业务已被登记机关退回，请点击【已退回】查看具体意见。若您需要再次申报，可点击【继续办理】按钮对填报的信息进行修改后再次申报；或者删除本次业务后，重新申报。");
                                    return;
                                }
                                if(state.indexOf("已办结")>=0){
                                    G3.alert("提示","您所申报的业务已办结。您可以点击【查看文书】按钮查看与本次业务相关的通知书。");
                                    return;
                                }

                                //a = G3.webPath+"jsp/gcloud/iaicweb/indexList/process/process.jsp?OPENO="+openo;
                                //G3.showModalDialog("办理进度",a,{width:800,height:400},function(d,c){});

                            }else{
                                //a = G3.webPath+"jsp/gcloud/iaicweb/indexList/process/process_sd_2021.jsp?OPENO="+openo;
                                // G3.showModalDialog("办理进度",a,{width:"90%",height:"50%"},function(d,c){});
                            }

                        });
                    }
                }

            });
            $(".table>tbody>tr>td").on("click", function(e) {;
                                                             $(this).parents("tr").addClass("selected");

                                                             let widthevent = this.offsetWidth

                                                             if(widthevent>300 && widthevent <=328){
                                                             str = this.textContent;

                                                             if (Array.from(str)[0] === '*') {
                                                                 console.log("无字号个体");

                                                             }else{
                                                                     let copyevent = document.querySelector("#applyNo");
                                                                     copyevent.setAttribute("value",str)
                                                                     copyevent.select(); // 选择对象
                                                                     document.execCommand("Copy"); // 执行浏览器复制命令
                                                                     layer.msg("【"+str+"】复制成功。");
                                                                     copyevent.setAttribute("value","")
                                                                 }
                                                             }


                                                             // $(this)元素是td，可以根据td调用jQuery的find等方法查找其他信息……
                                                            });
            $("[data-toggle='popover']").each(function() {
                var element = $(this);
                element.popover({
                    trigger: 'manual',
                    html: true,
                    placement: 'left',
                    content: function() {
                        return $(element[0].outerHTML);
                    }
                }).on("mouseenter", function() {
                    var _this = this;
                    $(this).popover("show");
                    $(this).siblings(".popover").on("mouseleave", function() {
                        $(_this).popover('hide');
                    });
                }).on("mouseleave", function() {
                    var _this = this;
                    setTimeout(function() {
                        if(!$(".popover:hover").length) {
                            $(_this).popover("hide")
                        }
                    }, 100);
                });

            });
        }
             `

            window.frames["mainContent"].document.querySelector("body").appendChild(addscript);
            console.log("插入点击复制公司名，禁用点击弹窗script");
            window.frames["mainContent"].document.querySelector(".sxxx-str").click();//点击一次【材料提交】，确保插入的script生效，有可能卡的时候更卡


        }





    }
})();