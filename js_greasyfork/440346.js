// ==UserScript==
// @name         智业运维端工具
// @namespace    https://op.health.dev.zoenet.cn/*
// @version      0.5.5
// @description  非常的人性化
// @author       edit by WJY on 2022.01.06 #去除input缓存数据
// @match        https://op.health.dev.zoenet.cn/*
// @match        http://172.16.34.113:6030/*
// @icon         https://img.zoenet.cn/zoehealthfs/business/common/img/20211015/df870b0038ac4d6aac7c9038ea2850d5.png
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/440346/%E6%99%BA%E4%B8%9A%E8%BF%90%E7%BB%B4%E7%AB%AF%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/440346/%E6%99%BA%E4%B8%9A%E8%BF%90%E7%BB%B4%E7%AB%AF%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    //自动跳转无需验证码登录页
    let regLofin = /login/;
    let regDoPsw = /doPasswordTimeDelayLogin/;
    let regIp1 = /172\.16\.34\.113/;
    let regIp2 = /op\.health\.dev\.zoenet\.cn/;
    let nowIp = '';
    let nowHref = location.href;
    if(regLofin.test(nowHref) && !regDoPsw.test(nowHref)){
        location.href = 'https://op.health.dev.zoenet.cn/#/login?actionType=doPasswordTimeDelayLogin';
    }
    if(regIp1.test(location.href)){
        nowIp = 'http://172.16.34.113:6030';
    }else{
        nowIp = 'https://op.health.dev.zoenet.cn/#';
    }
 
    //获取所有路径
    getAllPath();
    let pathList = [];
 
    var btnStyle = "border: 0;"+
                   "color: #fff;"+
                   "background:linear-gradient(to right,#F5A586, #EB547B);"+
                   "border-radius: 4px;"+
                   "padding:5px 10px;"+
                   "font-weight:bolder;"+
                   "letter-spacing:2px;"+
                   "box-shadow: 5px 5px 3px #E6E6E6;"+
                   "margin-right:20px";
    var inputStyle = "box-shadow: 5px 5px 3px #E6E6E6;"+
                     "border:1px solid #EB547B;"+
                     "padding:3px;"+
                     "margin:0 10px 10px 0";
    var toolBox ="<div id='tooBox'style='padding-left:225px;position:relative'>"+
                     "<a id='hidden' onclick='hidden'>展开</a>"+
                     "<a id='delete' onclick='deleteNode' style='margin-left:15px'>重置</a>"+
                     "<div id='btnBox' style='display:none'>"+
                     "<div style='margin-bottom:10px'>"+
                       "<p style='line-height:20px;font-weight:bolder;letter-spacing:2px;font-size:12px'>#注意：具体使用规则以文档为主，建议使用谷歌浏览器，避免兼容性bug</p>"+
                       "<p style='line-height:20px;font-weight:bolder;letter-spacing:2px;;font-size:12px;margin-bottom:10px'>#文档链接：<a onclick='window.open(`https://egxz8i.yuque.com/egxz8i/kso0yg/mgp8ap`)'>https://egxz8i.yuque.com/egxz8i/kso0yg/mgp8ap</a></p>"+
                       "<button id='showJumpBtn' onclick='showJumpArea' style='" + btnStyle + "'>快速跳转</button>"+
                       "<button id='showWechatBtn' onclick='showWechatArea' style='"+ btnStyle +"'>微首页</button>"+
                       "<button id='showMsgBtn' onclick='showMsgArea' style='" + btnStyle + "'>短信</button>"+
                       "<button id='showTokenBtn' onclick='showTokenArea' style='" + btnStyle + "'>token</button>"+
                       "<button id='showOrgCodeBtn' onclick='showOrgCodeArea' style='" + btnStyle + "'>orgCode</button>"+
                       "<button id='showAppCodeBtn' onclick='showAppCodeArea' style='" + btnStyle + "'>appCode</button>"+
                     "</div>"+
                     "<!--快速跳转页面区域-->"+
                     "<div id='jumpArea' style='display:none;'>"+
                       "<input onkeydown='goToPage' autocomplete='off' id='jumpInput' type='text' placeholder='请输入二级/三级标题' style='" + inputStyle + "'/>"+
                       //"<button id='jumpBtn' onclick='goToPage' style='border: 0;color: #fff;background: #3B86FF;border-radius: 4px;padding:4px 6px'>跳转</button>"+
                     "</div>"+
 
                     "<!--微首页页面区域-->"+
                     "<div id='wechatArea' style='display:none'>"+
                       "<input id='appCodeInput' type='text' placeholder='appCode' style='" + inputStyle + "'/>"+
                       "<input id='orgCodeInput' type='text' placeholder='orgCode' style='" + inputStyle + "'/>"+
                       "<input id='zoneCodeInput' type='text' placeholder='zoneCode' style='" + inputStyle + "'/>"+
                       "<button id='wechatBtn' onclick='goToWechat' style='" + btnStyle + "'>跳转</button>"+
                     "</div>"+
 
                     "<!--短信页面区域-->"+
                     "<div id='msgArea' style='display:none'>"+
                       "<div>"+
                         "<input onkeydown='getMsg' autocomplete='off' id='msgInput' type='text' maxlength='11' placeholder='请输入手机号' style='" + inputStyle + "'/>"+
                       "</div>"+
                     "</div>"+
 
                     "<!--token页面区域-->"+
                     "<div id='tokenArea' style='display:none'>"+
                       "<div>"+
                         "<input id='tokenPhone' type='text' maxlength='11' placeholder='请输入手机号' style='" + inputStyle + "'/>"+
                         "<input id='tokenAppCode' type='text' placeholder='请输入appCode' style='" + inputStyle + "'/>"+
                         "<button id='tokenBtn' onclick='getToken' style='" + btnStyle + "'>开发库</button>"+
                         "<button id='tokenTestBtn' onclick='getTestToken' style='" + btnStyle + "'>测试库</button>"+
                       "</div>"+
                     "</div>"+
 
                     "<!--orgCode页面区域-->"+
                     "<div id='orgCodeArea' style='display:none'>"+
                       "<div>"+
                         "<input id='orgCode' autocomplete='off' onkeydown='getOrgCode' type='text' placeholder='orgCode/机构名' style='" + inputStyle + "'/>"+
                       "</div>"+
                     "</div>"+
 
                     "<!--appCode页面区域-->"+
                     "<div id='appCodeArea' style='display:none'>"+
                       "<div>"+
                         "<input id='appCode' onkeydown='getAppCode' type='text' placeholder='appCode/机构名' style='" + inputStyle + "'/>"+
                       "</div>"+
                     "</div>"+
                   "</div>"+
 
                   "<!--弹窗-->"+
                   "<div id='message' style='border-radius:8px;padding:10px 30px;background-color:#708090;opacity:0;position:absolute;top:10px;right:50%;transform:translate(50%,0);z-index:9999;color:#fff;display:flex;align-items:center;justify-content:center;letter-spacing:2px'>测试了</div>"+
                 "</div>";
 
    try{
        console.log(document.body)
        document.body.insertAdjacentHTML('afterbegin',toolBox);
    }catch(err){
        console.log(err)
    }
 
    //隐藏展示操作设置
    document.getElementById('hidden').onclick = hiddenBox;
 
    //删除节点操作设置
    document.getElementById('delete').onclick = deleteNode;
 
    //快速跳转操作设置
    document.getElementById('showJumpBtn').onclick = showJumpArea;
    document.getElementById('jumpInput').onkeydown = goToPage;
    //document.getElementById('jumpBtn').onclick = goToPage;
 
    //微首页操作设置
    document.getElementById('showWechatBtn').onclick = showWechatArea;
    document.getElementById('wechatBtn').onclick = goToWechat;
 
    //短信操作设置
    document.getElementById('showMsgBtn').onclick = showMsgArea;
    document.getElementById('msgInput').onkeydown = getMsg;
 
    //获取token操作设置
    document.getElementById('showTokenBtn').onclick = showTokenBtn;
    document.getElementById('tokenBtn').onclick = getToken;
    document.getElementById('tokenTestBtn').onclick = getTestToken;
 
 
    //获取orgCode操作设置
    document.getElementById('showOrgCodeBtn').onclick = showOrgCodeBtn;
    document.getElementById('orgCode').onkeydown = getOrgCode;
 
    //获取appCode操作设置
    document.getElementById('showAppCodeBtn').onclick = showAppCodeBtn;
    document.getElementById('appCode').onkeydown = getAppCode;
 
    //按钮初始化
    showMessage('脚本初始化完成');
 
    //隐藏按钮区域
    function hiddenBox(){
        let btnBox = document.getElementById('btnBox');
        let hidden = document.getElementById('hidden');
        if(btnBox.style.display == 'none'){
            btnBox.style.display = 'block';
            hidden.innerText = '收起';
        }else{
            btnBox.style.display = 'none';
            hidden.innerText = '展开';
        }
    };
 
    //展示快速跳转区域
    function showJumpArea(){
        let jumpArea = document.getElementById('jumpArea');
        if(jumpArea.style.display == 'none'){
            jumpArea.style.display = 'block';
        }else{
            jumpArea.style.display = 'none';
        }
    };
 
    //展示微首页区域
    function showWechatArea(){
        let wechatArea = document.getElementById('wechatArea');
        if(wechatArea.style.display == 'none'){
            wechatArea.style.display = 'block';
        }else{
            wechatArea.style.display = 'none';
        }
    };
 
    //展示短信区域
    function showMsgArea(){
        let msgArea = document.getElementById('msgArea');
 
        if(msgArea.style.display == 'none'){
            msgArea.style.display = 'block';
        }else{
            msgArea.style.display = 'none';
        }
    };
 
    //展示获取token区域
    function showTokenBtn(){
        let tokenArea = document.getElementById('tokenArea');
 
        if(tokenArea.style.display == 'none'){
            tokenArea.style.display = 'block';
        }else{
            tokenArea.style.display = 'none';
        }
    };
    //展示orgCode区域
    function showOrgCodeBtn(){
        let orgCodeArea = document.getElementById('orgCodeArea');
 
        if(orgCodeArea.style.display == 'none'){
            orgCodeArea.style.display = 'block';
        }else{
            orgCodeArea.style.display = 'none';
        }
    };
    //展示orgCode区域
    function showAppCodeBtn(){
        let appCodeArea = document.getElementById('appCodeArea');
 
        if(appCodeArea.style.display == 'none'){
            appCodeArea.style.display = 'block';
        }else{
            appCodeArea.style.display = 'none';
        }
    };
    //获取appCode 或 机构名
    function getAppCode(e){
        let evt = window.event || e;
        if (evt.keyCode == 13){
            let value = document.getElementById('appCode').value;
            let params = '';
            let regName = /[\u4e00-\u9fa5]/;
            let regCode = /^[^\u4e00-\u9fa5]*$/;
            if(regName.test(value)){
                params = 'appName=' + value;
            }
            if(regCode.test(value)){
                params = 'appCode=' + value;
            }
            GM_xmlhttpRequest({
                method: 'GET',
                url: `http://172.16.36.93/dict/queryByParam?${params}`,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                    'Accept': 'application/json',
                },
                onload:function(res){
                    if(res.status === 200){
                        let data = JSON.parse(res.responseText);
                        if(data){
                            let appBox = "<div id='appBox' style='padding:10px 0;max-height:150px;overflow:auto'></div>";
                            document.getElementById('appCodeArea').insertAdjacentHTML('beforeend',appBox);
 
                            data.forEach(item => {
                                let appItem = "<div class='delNode'>"+
                                                "<span style='font-weight:bold;letter-spacing:2px'>" + item.appName + "：</span>"+
                                                "<input value='" + item.appCode +"' onclick='this.select();document.execCommand(`copy`);showMessage(`复制成功!`)' style='width:150px;box-shadow: 5px 5px 3px #E6E6E6;border:1px solid #EB547B;padding:3px;margin:10px'/>"+
                                              "</div>";
                                document.getElementById('appBox').insertAdjacentHTML('beforeend',appItem);
                            })
                        }else{
                            showMessage('查无数据');
                        }
 
                    }
                }
            });
        }
    };
 
    //获取orgCode 或 机构名
    function getOrgCode(e){
        let evt = window.event || e;
        if (evt.keyCode == 13){
            let value = document.getElementById('orgCode').value;
            let params = '';
            let regName = /[\u4e00-\u9fa5]/;
            let regCode = /^[^\u4e00-\u9fa5]*$/;
            if(regName.test(value)){
                params = 'name=' + value;
            }
            if(regCode.test(value)){
                params = 'orgCode=' + value;
            }
            GM_xmlhttpRequest({
                method: 'GET',
                url: `http://172.16.36.93/org/queryByParam?${params}`,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                    'Accept': 'application/json',
                },
                onload:function(res){
                    if(res.status === 200){
                        let data = JSON.parse(res.responseText);
                        if(data){
                            let orgBox = "<div id='orgBox' style='padding:10px 0;max-height:150px;overflow:auto'></div>";
                            document.getElementById('orgCodeArea').insertAdjacentHTML('beforeend',orgBox);
 
                            data.forEach(item => {
                                let orgItem = "<div class='delNode'>"+
                                                "<span style='font-weight:bold;letter-spacing:2px'>" + item.orgName + "：</span>"+
                                                "<input value='" + item.orgCode +"' onclick='this.select();document.execCommand(`copy`);showMessage(`复制成功!`)' style='width:150px;box-shadow: 5px 5px 3px #E6E6E6;border:1px solid #EB547B;padding:3px;margin:10px'/>"+
                                              "</div>";
                                document.getElementById('orgBox').insertAdjacentHTML('beforeend',orgItem);
                            })
                        }else{
                            showMessage('查无数据');
                        }
 
                    }
                }
            });
        }
    };
 
    //获取测试库token
    function getTestToken(){
        getToken(1);
    };
 
    //获取token
    function getToken(type){
        console.log(type)
        let phone = document.getElementById('tokenPhone').value;
        let appCode = document.getElementById('tokenAppCode').value;
        let url = `http://172.16.36.93/user/getTokenByPhone?phone=${phone}&appCode=${appCode}`;
        if(type === 1){
            url = url + '&test=1';
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/json',
            },
            onload:function(res){
                if(res.status === 200){
                    let data = JSON.parse(res.responseText)[0];
                    if(data){
                        let token = "<div class='delNode'>"+
                            "<span style='font-weight:bold;letter-spacing:2px'>" + data.loginTime + "：</span>"+
                            "<input value='" + data.token +"' onclick='this.select();document.execCommand(`copy`);showMessage(`复制成功!`)' style='width:300px;box-shadow: 5px 5px 3px #E6E6E6;border:1px solid #EB547B;padding:3px;margin:10px'/>"+
                            "</div>";
                        document.getElementById('tokenArea').insertAdjacentHTML('beforeend',token);
                    }else{
                        showMessage('查无数据');
                    }
 
                }
            }
        });
    };
 
    //获取短信
    function getMsg(e){
        let evt = window.event || e;
        if (evt.keyCode == 13){
            let phone = document.getElementById('msgInput').value;
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://172.16.36.93/msg/getCodeByPhone?phone=' + phone,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                    'Accept': 'application/json',
                },
                onload:function(res){
                    if(res.status === 200){
                        let list = JSON.parse(res.responseText);
                        if(list.length == 0){
                            showMessage('我没找到数据哇！');
                        }else{
                            let msgList = [];
                            list.forEach(item => {
                                if(item.content.indexOf('验证码') != -1){
                                    let obj = {};
                                    obj.name = item.content.substring(item.content.indexOf('【') + 1,item.content.indexOf('】'));
                                    obj.time = item.time;
                                    if(item.content.indexOf('验证码是') != -1){
                                        obj.code = item.content.substring(item.content.indexOf('验证码是') + 4,item.content.indexOf('验证码') + 10);
                                    }else{
                                        obj.code = item.content.substring(item.content.indexOf('验证码') + 3,item.content.indexOf('验证码') + 9);
                                    }
                                    msgList.push(obj);
                                }
                            })
                            if(msgList.length == 0){
                                showMessage('我没找到数据哇！');
                                return false;
                            }
                            msgList.forEach(item => {
                                let msg = "<div class='delNode'>"+
                                    "<span style='font-weight:bold;letter-spacing:2px'>" + item.name + "：</span>"+
                                    "<input value='" + item.code +"' onclick='this.select();document.execCommand(`copy`);showMessage(`复制成功!`)' style='width:60px;box-shadow: 5px 5px 3px #E6E6E6;border:1px solid #EB547B;padding:3px;margin:10px'/>"+
                                    "<span style='font-weight:bold;letter-spacing:2px'>" + item.time + "</span>"
                                    "</div>";
                                document.getElementById('msgArea').insertAdjacentHTML('beforeend',msg);
                            })
                        }
                    }
                }
            });
        }
    };
 
    //跳转微首页
    function goToWechat(){
        let appCode = document.getElementById('appCodeInput').value;
        let orgCode = document.getElementById('orgCodeInput').value;
        let zoneCode = document.getElementById('zoneCodeInput').value;
        window.open(`https://health.dev.zoenet.cn/medical/internet-hospital/hospital-micro-homepage?orgCode=${orgCode}&zoneCode=${zoneCode}&zoneName=&platformSingleHospital=1&appCode=${appCode}`);
    };
 
    //获取所有路径
    function getAllPath(){
        console.log('进来了')
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://172.16.36.93/user/getMenu',
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/json',
            },
            onload:function(res){
                console.log(res)
                if(res.status === 200){
                    let data = JSON.parse(res.responseText);
                    console.log(data)
                    data.forEach(item => {
                        let obj = {
                            name:'',
                            url:'',
                        }
                        if(item.children.length == 0){
                            obj.name = item.resourceName;
                            if(item.clientUrl.indexOf('\/') == -1 || item.clientUrl.indexOf('\/') != 0){
                                obj.url = '/' + item.clientUrl;
 
                            }else{
                                obj.url = item.clientUrl;
 
                            }
                            pathList.push(obj)
                        }
                    })
                }
            }
        });
    };
    //快速跳转
    function goToPage(e){
        let evt = window.event || e;
        if (evt.keyCode == 13){
            let value = document.getElementById('jumpInput').value;
            let urlList = pathList;
            let resultList = [];
            urlList.forEach(item => {
                if(item.name.indexOf(value) != -1 && value != ''){
                    resultList.push(item)
                }
            })
            if(resultList.length === 0 && value != ''){
                showMessage('查找异常')
            }else if(resultList.length === 1){
                location.href = nowIp + resultList[0].url;
                location.reload();
            }else{
                let urlNode = "<div id='urlBox' style='margin-top:10px;display:flex;flex-wrap:wrap'></div>";
                if(document.getElementById('urlBox')){
                    document.getElementById('urlBox').innerHTML = "";
                }
                document.getElementById('jumpArea').insertAdjacentHTML('beforeend',urlNode);
                resultList.forEach(item => {
                    let url = "<div class='jump-url' style='cursor:pointer;margin:10px;color:blue' onclick='location.href = `" + nowIp + item.url + "`'>" + item.name + "</div>";
                    document.getElementById('urlBox').insertAdjacentHTML('beforeend',url);
                })
            }
        }
    };
    //重置 - 删除节点
    function deleteNode(){
        let delNodeList = Object.values(document.getElementsByClassName('delNode'));
        delNodeList.forEach(item => {
            item.remove();
        })
        document.getElementById('jumpArea').style.display = 'none';
        document.getElementById('wechatArea').style.display = 'none';
        document.getElementById('msgArea').style.display = 'none';
        document.getElementById('tokenArea').style.display = 'none';
        document.getElementById('orgCodeArea').style.display = 'none';
        document.getElementById('appCodeArea').style.display = 'none';
        //document.getElementById('btnBox').style.display = 'none';
        //document.getElementById('hidden').innerText = '展开';
    };
    //展示弹窗
    function showMessage(value){
        let message = document.getElementById('message');
 
        message.style.opacity = '0.5';
        message.innerHTML = value;
 
        setTimeout(() => {
            message.style.opacity = '0';
        },2000)
    };
})();
 
 
 
 
 