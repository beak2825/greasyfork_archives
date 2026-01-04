// ==UserScript==
// @name         综合业务系统优化
// @namespace    http://tampermonkey.net/
// @version      0.139
// @description
// @author       大魔王
// @run-at       document-end
// @match        http://172.20.233.155:7016/iaic/*
// @grant        none
// @description 自动登录等

// @downloadURL https://update.greasyfork.org/scripts/469412/%E7%BB%BC%E5%90%88%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469412/%E7%BB%BC%E5%90%88%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    1、登录填充账号密码，并自动登录
    2、跳过首页进入业务系统
    3、点击【信息服务】，自动展开【信息查询】-【综合查询】；单独点击【综合查询】时，单独打开网页 http://172.20.233.155:7016/iaic/jsp/iaic/xxcx/zhcx/zhcx_cx.jsp?entcat=0
    4、点击【行政许可】，自动展开【辅助功能】-【外网数据删除】-【外网企业数据删除】
    5、【综合查询】优化回车自动搜索，跳过确认框，返回保存数据，【企业列表优化】
    6、首次进入系统或F5刷新后自动展开【行政许可】-【私营登记】-【网上登记预审】
    v0.131 2023年6月21日09:28:38 更改自动登录：账号密码不写死，使用localStrong存储，动态新增、删除
    v0.134 2023年6月29日15:07:15 localStrong存储格式改动
    v0.135 2023年8月15日15:38:25 ①输入去空格②修改密码
    v0.136 2023年8月18日10:04:35 鼠标放置名称上可预览账号密码
    v0.138 2024年1月17日14:16:18 修复添加用户时，用户名/密码为空可以正常添加的bug
    v0.139 2024年1月29日16:43:41 ispwd/addUser/dele/Revise修改
    */

    /*初始化
    localStorage.setItem("uData",(`[{"uname":"高一帆","uid":"lyhdgaoyifan","upwd":"Gyf013579"},{"uname":"陈国静","uid":"lyhdchenguojing","upwd":"Aa190816"},{"uname":"孟凡芹","uid":"lyhdmengfanqin","upwd":"Mfq13562925856"},{"uname":"王宇洋","uid":"lyhdwangyuyang","upwd":"123456Aa?"}]`) )
    */
    window.onload = function(){
        let url = window.location.pathname
        ,url_综合查询 = "http://172.20.233.155:7016/iaic/jsp/iaic/xxcx/zhcx/zhcx_cx.jsp?entcat=0"
        ,综合业务系统登录1 = '/iaic/jsp/public/login.jsp'
        ,综合业务系统登录2 = '/iaic/'
        ,综合业务系统 = '/iaic/jsp/lcp/portal/workbench/ls_main.jsp'
        ,首页 = "/iaic/jsp/lcp/portal/workbench/index.jsp"
        ,综合查询 = "/iaic/jsp/iaic/xxcx/zhcx/zhcx_cx.jsp"
        ,企业列表 = "/iaic/jsp/iaic/xxcx/zhcx/zhcx_show.jsp"

        if( 综合业务系统登录1 == url || 综合业务系统登录2 == url){
            setRdmCode();
            myZongheLogin();


        }
        if(首页 == url){
            document.getElementsByClassName('hbtn4')[0].click();
        }
        if( 综合业务系统 == url){
            //console.log(url);
            //6、首次进入系统或F5刷新后自动展开【行政许可】-【私营登记】-【网上登记预审】
            setTimeout(function(){
                let xingZhengXuKe = document.querySelectorAll('a')[0];
                xingZhengXuKe.click();
                /*                 let siYingDengJi = document.getElementsByClassName('l-tree-node-anchor')[2];
                siYingDengJi.click();
                let wangShangDengJiYuShen = document.getElementsByClassName('l-tree-node-anchor')[21];
                wangShangDengJiYuShen.click(); */
                getTag("私营登记").click();
                getTag("网上登记预审").click();


            },300);




            setTimeout(function(){
                //点击【信息服务】，自动展开【信息查询】-【综合查询】
                let xinXiFuWu = document.querySelectorAll('a')[2];
                xinXiFuWu.onclick = function(){
                    topclick(this);
                    /*                     let xinXiChaXun = document.getElementsByClassName('l-tree-node-el l-unselectable left1 l-tree-node-collapsed ')[0];
                    xinXiChaXun.click();
                    let zongHeChaXun = document.getElementsByClassName('l-tree-node-el l-tree-node-leaf l-unselectable left2')[12];
                    zongHeChaXun.click(); */
                    getTag("信息查询").click();
                    getTag("综合查询").click();
                    zongHeChaXun.onclick = function(){//单独点击【综合查询】跳转单独网页
                        //window.opener=null;
                        //window.open(url_综合查询, "_blank").close();
                        //window.open("", "_self");
                        //window.close();
                        xinXiFuWu.onclick();
                    }
                }
                //点击【行政许可】，自动展开【辅助功能】-【外网数据删除】-【外网企业数据删除】
                let xingZhengXuKe = document.querySelectorAll('a')[0];
                xingZhengXuKe.onclick = function(){
                    topclick(this);
                    xingZhengXuKe.click();
                    /*                     let fuZhuGongNeng = document.getElementsByClassName('l-tree-node-anchor')[7];
                    fuZhuGongNeng.click();
                    let shuJuShanChu = document.getElementsByClassName('l-tree-node-anchor')[8];
                    shuJuShanChu.click();
                    let qiYeShanChu = document.getElementsByClassName('l-tree-node-anchor')[9];
                    qiYeShanChu.click(); */
                    getTag("辅助功能").click();
                    getTag("外网数据删除").click();
                    getTag("外网企业数据删除").click();
                }
            },500);

            function getTag(name){//根据按钮名字查询
                let taglist = document.querySelectorAll('.l-tree-node-anchor');
                for(let i =0;i<taglist.length;i++){
                    if(taglist[i].textContent == name){
                        console.log(taglist[i].textContent,"下标为",i);
                        return taglist[i];
                    }
                }
            }
        }
        if(综合查询 == url){//综合查询 优化
            //console.log(url);
            setTimeout(function(){
                /*                 let entname = document.querySelector('#entname');
                console.log(entname);
                entname.onclick = function(){
                    console.log('点击');
                }
                */
                document.onkeydown = function (e) { // 回车提交表单
                    // 兼容FF和IE和Opera
                    let theEvent = window.event || e;
                    let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                    if (code == 13) {
                        //按下enert，调用系统自带的查询函数
                        //query();
                        document.querySelector('button').click();
                        setTimeout(function(){document.querySelector('#L5-gen77').click();},100);

                    }
                }
            },500);
        }
        if( 企业列表 == url){
            //console.log(url);
            setTimeout(function(){
                let fanhui = document.querySelector('#L5-gen18');
                let xinXiFuWu = window.parent.document.querySelectorAll('a')[2];

                fanhui.onclick = function(){
                    xinXiFuWu.onclick();//调用信息服务点击事件
                }
            },200);

        }

        function setRdmCode(){
            L5.Ajax.request({//写到集合里原网页ajax不调用，单独写自动调用很奇怪
                url : L5.webPath + "/command/dispatcher/org.loushang.bsp.security.web.RandomCodeCommand",
                sync : false,
                callback : successHandler
            });

            function successHandler(options,success,response){
                let o = L5.decode(response.responseText);
                document.getElementById("rdmCode").value = o.code;
            }
        }

        function myZongheLogin(){
            var storage=window.localStorage;
            document.getElementsByName("j_password")[0].type = 'text';
            let uData = [{}];
            reload();
            function reload(){//初始化函数
                let oldData = JSON.parse(storage.getItem("uData"));
                let parent = document.getElementsByTagName("div")[0];
                if(oldData){

                    for(let i=0;i<oldData.length;i++){
                        /*                     console.log(`登录名：`,oldData[i][0].uid);
                    console.log(`密码：`,oldData[i][0].upwd); */
                        let newUser = cyEle(oldData[i]);
                        parent.append(newUser);
                        parent.append(cyEle());
                        newUser.onclick=function(){
                            document.getElementsByName("j_username")[0].value = oldData[i].uid;
                            document.getElementsByName("j_password")[0].value = oldData[i].upwd;
                            //调用综合业务系统自带的登录函数
                            doLogin();
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
                add.onclick = function(){
                    addUser();
                }
                del.onclick= function(){
                    dele();
                }
                revise.onclick= function(){
                    Revise();
                }
                updata.onclick = function(){
                    let updataUrl = 'https://greasyfork.org/zh-CN/scripts/469412-%E7%BB%BC%E5%90%88%E4%B8%9A%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96';
                    window.open(updataUrl,'_blank');
                }

            }

            function addUser(){

                let uname,uid,upwd1,upwd2;
                let oldData = JSON.parse(storage.getItem("uData"));
                if(!oldData){//初始化
                    oldData = [];
                }
                console.log(oldData);
                uname = prompt(`请输入用户姓名`,"").trim();
                let judgeFn = new RegExp(/\s+/g);
                if (judgeFn.test(uname)) {
                    alert("内容包含有空格!");
                    return;
                }
                if(!uname) return;
                //检查是否重复添加
                for(let i=0;i<oldData.length;i++){
                    if(uname===oldData[i].uname){
                        alert(`【${uname}】已经添加`);
                        return;
                    }
                }
                uid=prompt(`${uname}请输入你的登录名`,"").trim();
                if (judgeFn.test(uid)) {
                    alert("内容包含有空格!");
                    return;
                }
                if(!uid) return;
                upwd1 = isPwd(uname,uid);
                while(upwd1==false){
                    upwd1 = isPwd(uname,uid);
                }

                console.log(uname,uid,upwd1);
                let newData = {//增加
                    uname:uname,
                    uid: uid,
                    upwd: upwd1

                };
                oldData.push(newData);
                console.log(oldData);
                //保存
                storage.setItem("uData",JSON.stringify(oldData));
                alert(`添加用户【${uname}】成功~~`);
                //重载数据
                location.reload();
            }

            function dele(){
                let oldData,dname,dpwd,isFind;
                isFind = false;
                oldData = JSON.parse(storage.getItem("uData"));
                //console.log(oldData[0][0].uname);
                console.log(typeof oldData[0]);
                dname=prompt(`请输入要删除的用户名字`,"").trim();
                if(!dname) return;

                //判断是否有这个账号
                for(let i=0;i<oldData.length;i++){
                    if(dname===oldData[i].uname){
                        isFind = true;
                        dpwd = prompt(`请输入密码确认删除`,"").trim();
                        if(!dpwd) return;

                        //判断密码是否正确
                        if(dpwd===oldData[i].upwd){
                            //删除
                            //let deStr = oldData[i][0];
                            console.log(oldData, `删除该条记录：`,oldData[i]);

                            oldData.splice(i,1)
                            uData = oldData;
                            storage.setItem("uData",JSON.stringify(uData));
                            alert(`删除用户【${dname}】成功~~`);
                            location.reload();
                        }else{
                            alert(`密码错误！！！`);
                        }

                        break;
                    }
                }
                if(!isFind){
                    alert(`未查询到用户【${dname}】`);
                }



            }
            function Revise(){
                let pname,oldPwd,newpwd,newPwd,oldData,oldUid,isFind;
                oldData = JSON.parse(storage.getItem("uData"));
                pname = prompt(`请输入要修改的账号用户名`,"").trim();
                let judgeFn = new RegExp(/\s+/g);
                if (judgeFn.test(pname)) {
                    alert("内容包含有空格!");
                    return;
                }
                if (!pname) return;
                //oldPwd = prompt(`请输入原密码`,"").trim();
                console.log(typeof oldData);
                //判断是否有这个账号
                for(let i=0;i<oldData.length;i++){
                    if(pname===oldData[i].uname){
                        isFind = true;
                        oldUid = oldData[i].uid;
                        oldPwd = prompt(`请输入原密码`,"").trim();
                        if(!oldPwd) return;
                        //判断密码是否正确
                        console.log(oldData[i],oldData[i].upwd);
                        if(oldPwd===oldData[i].upwd){
                            //输入两次新密码
                            newpwd = isPwd(pname,oldData[i].uid);
                            while(newpwd==false){
                                newpwd = isPwd(pname,oldData[i].uid);
                            }
                            oldData[i].upwd = newpwd;
                            storage.setItem("uData",JSON.stringify(oldData));
                            alert(`修改用户【${pname}】成功~~`);
                            location.reload();
                        }else{
                            alert(`原密码错误！！！`);
                        }

                        break;
                    }
                }
                if(!isFind){
                    alert(`未查询到用户${pname}`);
                }


            }
            function cyEle(types){//创建元素
                //let type = types.uname;
                let span = document.createElement("span");
                if(!types){

                    span.style="color: #858585;";
                    span.textContent = " | ";
                }else{
                    span.style="color: #858585;";
                    //span.style="color: #858585;font-size: 16px;";
                    if("string"==(typeof types)){
                        span.textContent = `${types}`;
                    }
                    if("object"==(typeof types)){
                        span.textContent = `${types.uname}`;
                        span.title = `${types.uid}【${types.upwd}】`;
                    }

                    span.onmouseover = function(){//绑定移入事件    持续性用onmousemove
                        this.style.fontWeight = "Bold";
                        this.style.color = 'rgb(232 23 23)';
                        this.style.cursor = "pointer";
                        this.style.backgroundColor= 'rgb(222 222 222)';
                        if("object"==(typeof types)){
                            document.getElementsByName("j_username")[0].value = types.uid;
                            document.getElementsByName("j_password")[0].value = types.upwd;
                        }

                    }
                    span.onmouseout = function(){//绑定移出事件
                        this.style.fontWeight = '';
                        this.style.color = '#858585';
                        this.style.cursor = "pointer";
                        this.style.backgroundColor= 'rgb(255 255 255)';
                        if("object"==(typeof types)){
                            document.getElementsByName("j_username")[0].value = '';
                            document.getElementsByName("j_password")[0].value = '';
                        }
                    }

                }
                //console.log('cyEle调用',type);
                return span;
            }


            function isPwd(uname,uid){
                let upwd1,upwd2;
                let judgeFn = new RegExp(/\s+/g);
                upwd1=prompt(`${uname}[${uid}]请输入你的密码`,"").trim();
                if (judgeFn.test(upwd1)) {
                    alert("内容包含有空格!");
                    return false;
                }
                if(!upwd1) return false;
                upwd2=prompt(`${uname}[${uid}]请[再次]输入你的密码`,"").trim();
                if (judgeFn.test(upwd2)) {
                    alert("内容包含有空格!");
                    return false;
                }
                if(!upwd2) return false;
                if(upwd1!=upwd2){
                    alert("两次密码不一致,请重新输入!");
                    return false;
                    //isPwd(uname,uid);
                }else{
                    return upwd1;
                }

            }
        }

    }
})();