// ==UserScript==
// @name         天梯工时查询
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  联通内部天梯工时查询使用
// @author       fankq、zhengxd
// @match        https://devops.chinaunicom.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unicom.local
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492290/%E5%A4%A9%E6%A2%AF%E5%B7%A5%E6%97%B6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/492290/%E5%A4%A9%E6%A2%AF%E5%B7%A5%E6%97%B6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function getTtUserId(){
        let cookie = document.cookie.split(';') || [];
        let ttUserId = ''
        cookie.forEach(ele => {
            if(ele.indexOf('ttUserId=') > -1) {
                ttUserId = ele
            }
        })
        return !!ttUserId ? ttUserId.substr(ttUserId.indexOf('ttUserId=') + 9) : ''
    }
    function mess(res) {
        let data = JSON.parse(res.data || '{}')
        if(data.type == 'getUserWorkTime') {
            userVerify(3, data.query);
        } else if(data.type == 'getAllWorkTime') {
            userVerify(4, data.query);
        } else if(data.type == 'getAllVersionWorkTime') {
            userVerify(5, data.query);
        } else if(data.type =='getUser'){
            targetWindow.postMessage(JSON.stringify({
                type: 'getUser',
                data: name+ '+' + ttUserId
            }), '*');
        } else if(data.type == 'queryListByParams') {
            queryListByParams()
        } else if(data.type == 'queryWorkBenchDetails'){
            queryWorkBenchDetails(data.query)
        } else if(data.type == 'getNewXJWorkTime'){
            userVerify(6, data.query);
        } else if(data.type == 'getZTInfoList') {
            getZTInfoList(data.ids)
        }
    }

    function watchObs(){
        // antd-pro-pages-menu-nav-components-iframe-com-index-iframe-container
        // 选择要观察的目标节点
        const targetNode = document.querySelector('.antd-pro-pages-menu-nav-components-iframe-com-index-iframe-container');

        if(!targetNode) {
            console.log('观察的目标节点未出现')
            setTimeout(()=>{
                watchObs();
            }, 1000)
            return
        }

        // 配置观察选项
        const config = { attributes: true, childList: true, subtree: true };
        var tm1 = null, tm2 = null;
        var para3, x2, txt3, para5, txt5;

        function setButtonText(ifTarget, srcStr){
            tm1 = setTimeout(()=>{
                console.log(srcStr)
                para3=document.createElement("div"); //首先创建一个元素
                para3.id = "un-submit-code";
                txt3=document.createTextNode("未提交代码："); //再创建一个文本节点
                para3.appendChild(txt3);//往这元素后边添加这个文本节点，就是让这个p标签里有字
                para3.style.position = 'absolute';
                para3.style.top = '0';
                para3.style.left = '80px'; //200
                para3.style.background = '#ffffff';
                para3.style.padding = '5px 10px';
                para3.style.color = 'red';
                para3.style.display = 'none';
                x2= ifTarget.contentDocument.getElementById('root_pms'); //找到现在有的元素，就是要加在哪个元素后边 root_pms
                x2.appendChild(para3);//往id=“div1”的块元素内加新建的节点

                para5=document.createElement("div"); //首先创建一个元素
                para5.id = "un-submit-code-reflush";
                txt5=document.createTextNode("刷新"); //再创建一个文本节点
                para5.appendChild(txt5);//往这元素后边添加这个文本节点，就是让这个p标签里有字
                para5.style.position = 'absolute';
                para5.style.top = '0px';
                para5.style.left = '10px';
                para5.style.background = '#40a9ff';
                para5.style.padding = '5px 10px';
                para5.style.color = '#fff';
                para5.style.cursor = 'pointer';
                para5.style.borderRadius = '4px';
                para5.addEventListener('click',function() {
                    let nodes = document.querySelector('iframe#iframeId');
                    let ischangenodeList = nodes.contentDocument.querySelectorAll('td[ischangenode="isChangeNode"]') || [];
                    ischangenodeList.forEach(ele=>{
                        ele.style.color = '';
                        ele.style.fontWeight = '';
                    });
                    let changeNodeTimeList = nodes.contentDocument.querySelectorAll('.changeNodeTime') || [];
                    changeNodeTimeList.forEach(ele=>{
                        ele.remove();
                    });
                    nodes.contentDocument.getElementById('un-submit-code').innerText ='未提交代码：'
                    nodes.contentDocument.getElementById('un-submit-code').style.display = 'none'
                    init(nodes);
                });
                x2.appendChild(para5);//往id=“div1”的块元素内加新建的节点

                init(ifTarget);
            }, 3000)
        }

        // 当观察到变动时执行的回调函数
        const callback = function(mutationsList, observer) {
            clearTimeout(tm1);
            clearTimeout(tm2);
            let mutation = mutationsList[mutationsList.length - 1]
            if (mutation.type === 'attributes' || mutation.type === 'childList') {
                let srcStr = '', ifTarget = '';
                if(mutation.type === 'childList') {
                    ifTarget = mutation.target.querySelector('iframe#iframeId')
                    srcStr = ifTarget.src;
                }
                if(mutation.type === 'attributes') {
                    srcStr = mutation.target.src;
                    ifTarget = mutation.target
                }
                // console.log('mutation.type ', mutation.type)
                // console.log('mutation.src ', srcStr)
                if(srcStr == 'https://devops.chinaunicom.cn/pm_oms/#/myList' && mutation.type === 'attributes') {
                    ifTarget.onload = function(){
                        setButtonText(ifTarget, srcStr)
                    }
                } else if(srcStr == 'https://devops.chinaunicom.cn/pm_oms/#/myList' && mutation.type === 'childList') {
                    setButtonText(ifTarget, srcStr)
                }
            }
        };
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
    }


    var ttUserId = getTtUserId();
    // var taskList = [];
    let that = this
    var targetWindow = null;
    var iframeTimer = null

    function removeIframe(res){
        let data = JSON.parse(res.data || '{}')
        if(data.type == 'removeIframe') {
            document.getElementById('cxgsId').remove();
            window.removeEventListener('message', removeIframe, false);
        }
    }

    function startScript(){
        setTimeout(()=>{
            watchObs();
        }, 2000)

        setTimeout(()=>{
            if(document.getElementById('my-times-id')){
                return
            }
            var para=document.createElement("div"); //首先创建一个元素
            var x=document.getElementById('root'); //找到现在有的元素，就是要加在哪个元素后边 root_pms
            para.id = "my-times-id";
            var txt=document.createTextNode("查询工时"); //再创建一个文本节点
            para.appendChild(txt);//往这元素后边添加这个文本节点，就是让这个p标签里有字
            para.style.position = 'absolute';
            para.style.top = '10px';
            para.style.left = '290px';
            para.style.background = '#40a9ff';
            para.style.padding = '5px 10px';
            para.style.color = '#fff';
            para.style.cursor = 'pointer';
            para.style.borderRadius = '4px';
            para.style.zIndex = '9999';
            para.addEventListener('click',() => {
                if(document.getElementById('cxgsId')) return;
                // queryTimes();
                userVerify(2);
                window.addEventListener("message", removeIframe);
            })
            x.appendChild(para);//往id=“div1”的块元素内加新建的节点

            /**
            var para2=document.createElement("div"); //首先创建一个元素
            para2.id = "my-times-id-close";
            var txt2=document.createTextNode("关闭"); //再创建一个文本节点
            para2.appendChild(txt2);//往这元素后边添加这个文本节点，就是让这个p标签里有字
            para2.style.position = 'absolute';
            para2.style.top = '10px';
            para2.style.left = '390px';
            para2.style.background = '#40a9ff';
            para2.style.padding = '5px 10px';
            para2.style.color = '#fff';
            para2.style.cursor = 'pointer';
            para2.style.borderRadius = '4px';
            para2.style.zIndex = '9999';
            para2.addEventListener('click',() => {
                removeIframe();
            })
            x.appendChild(para2);//往id=“div1”的块元素内加新建的节点
            */

            var para4=document.createElement("div"); //首先创建一个元素
            para4.id = "my-times-id-new";
            var txt4=document.createTextNode("查询工时新版"); //再创建一个文本节点
            para4.appendChild(txt4);//往这元素后边添加这个文本节点，就是让这个p标签里有字
            para4.style.position = 'absolute';
            para4.style.top = '10px';
            para4.style.left = '375px'; //'460px';
            para4.style.background = '#40a9ff';
            para4.style.padding = '5px 10px';
            para4.style.color = '#fff';
            para4.style.cursor = 'pointer';
            para4.style.borderRadius = '4px';
            para4.style.zIndex = '9999';
            para4.addEventListener('click',() => {
                targetWindow = window.open('http://172.23.32.23:8080/#/userWorkingHours', '_blank'); //https://alitily.com/dist/#/userWorkingHours // http://172.23.32.23:8080/#/userWorkingHours
                window.removeEventListener('message', mess, false);
                window.addEventListener("message", mess);
            })
            x.appendChild(para4);//往id=“div1”的块元素内加新建的节点


            // 初始化未提交代码分支
            // init();
        },3000)
    }

    var initTimer = null

    function urlHasChange(event) {
        clearTimeout(initTimer);
        initTimer = setTimeout(()=>{
            console.log('浏览器历史记录改变,新的URL为:', document.location.href);
            if(document.location.hash != '#/login') {
                // window.removeEventListener('popstate', urlHasChange, false);
                startScript()
            } else {
                document.getElementById('my-times-id') && document.getElementById('my-times-id').remove();
                document.getElementById('my-times-id-close') && document.getElementById('my-times-id-close').remove();
                document.getElementById('my-times-id-new') && document.getElementById('my-times-id-new').remove();
            }
        }, 1000)
    }

    console.log('浏览器当前URL为:', document.location.href);
    if(document.location.hash != '#/login') {
        window.removeEventListener('popstate', urlHasChange, false);
        window.addEventListener('popstate', urlHasChange);
        startScript();
    }else {
        window.removeEventListener('popstate', urlHasChange, false);
        window.addEventListener('popstate', urlHasChange);
    }


    function alertDialog(datas){
        let dom2 = document.getElementById('root'); // document.getElementById('root_pms')
        let iframe = document.createElement("iframe");
        iframe.id = 'cxgsId'
        iframe.style.width = '350px';
        iframe.style.height = '600px';
        iframe.style.position = 'absolute';
        let top = (window.innerHeight - 600 )/2;
        let left = ((window.innerWidth - 350 ) - (window.screen.width - window.innerWidth ))/2;
        iframe.style.top = top + 'px';
        iframe.style.left = left + 'px';
        iframe.style.background = '#fff';
        dom2.appendChild(iframe);
        iframe.src = 'https://alitily.com/dist/workTime.html';
        iframe.onload = function() {
            iframe.contentWindow.postMessage(JSON.stringify(datas),'*');
            //setTimeout(()=>{
            //    window.postMessage(JSON.stringify(datas),'*');
            //}, 2000)
        }
    };

    function queryTimes(name, type, loginName, query, _target){
        let bodyStr = '{"requestParams":{"normalQuery":{"headPerson":"'+name+ '+' + ttUserId+ '"}},"page":{"pageNo":1,"pageSize":40}}'
        if(type == 4 || type == 5 || type == 6) {
            bodyStr = query
        }
        fetch('https://devops.chinaunicom.cn/pm/workbenchContr/queryWorkBenchList', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow"
            },
            body: bodyStr,
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            let data = res;
            if(type == '1'){
                filterTask(data.data, loginName, name, _target)
            } else if(type == '2') {
                alertDialog(data.data)
            } else if(type == '3') {
                targetWindow.postMessage(JSON.stringify({
                    type: 'userWorkTime',
                    data: data.data
                }), '*');
            } else if(type ==4) {
                targetWindow.postMessage(JSON.stringify({
                    type: 'allWorkTime',
                    data: data.data
                }), '*');
            } else if(type == 5) {
                targetWindow.postMessage(JSON.stringify({
                    type: 'allVersionWorkTime',
                    data: data.data
                }), '*');
            } else if(type == 6) {
                targetWindow.postMessage(JSON.stringify({
                    type: 'newXJWorkTime',
                    data: data.data
                }), '*');
            }
        });
    }

    function userVerify(type, query, _target){
        fetch('https://devops.chinaunicom.cn/platform_portal/api/v1/commonDomain/portalRedirect/space/userVerify', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow",
                "Access-Control-Allow-Origin": "*"
            },
            body: '{}',
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            ttUserId = res.data.user.id;
            queryTimes(res.data.user.name, type, res.data.user.loginName, query, _target)
        });
    }

    function init(_target){
        userVerify(1, undefined, _target)
    }

    function filterTask(taskList, loginName, name, _target){
        var taskingList = taskList.filter(ele=>{return !ele["实际完成时间"]});
        taskingList.pop()
        if(taskingList.length > 0) {
            var ids = taskingList.map(ele=>{ return ele._id })
            ids.forEach(ele => {
                getSubmitCode(ele, loginName, name, _target)
            });
        }
    }

    function getSubmitCode(_id, loginName, name, _target){
        fetch('https://devops.chinaunicom.cn/pm/workbenchContr/queryWorkBenchDetails', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow",
                "Access-Control-Allow-Origin": "*"
            },
            body: '{"requestData": {"_id": "'+ _id +'", "type": "2"}}',
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            if(res.data && res.data.record){
                let list = res.data.record.filter(ele => {
                    return new Date(ele.time) >= new Date(dateFormat(new Date(res.data["计划开始时间"]), 'yyyy-MM-dd')) && (ele.user == loginName || ele.user+'_si' == loginName || ele.user == name.trim());
                })
                if(list.length == 0) {
                    if(_target.contentDocument.getElementById('un-submit-code')) {
                        _target.contentDocument.getElementById('un-submit-code').style.display='block'
                        _target.contentDocument.getElementById('un-submit-code').innerText = _target.contentDocument.getElementById('un-submit-code').innerText + res.data.itemId + '；'
                    }
                    if(_target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)')){
                        _target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)').setAttribute('ischangenode', 'isChangeNode');
                        _target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)').style.color = 'red';
                        _target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)').style.fontWeight = '900';
                    }
                }
            }
            if(_target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)')){
                let time1 = res.data["计划开始时间"] ? dateFormat(new Date(res.data["计划开始时间"]), 'MM-dd') : ''
                let time2 = dateFormat(new Date(res.data["计划完成时间"]), 'MM-dd')
                let time3 = dateFormat(new Date(res.data["计划完成时间"]), 'yyyy-MM-dd') // res.data["计划完成时间"].slice(0, 10)
                let time4 = res.data["实际开始时间"] ? dateFormat(new Date(res.data["实际开始时间"]), 'MM-dd') : ''
                if(dateFormat(new Date()) == time3) {
                    _target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)').innerHTML += '<span  class="changeNodeTime" style="color: red">-今日到期<span>'
                } else if(new Date(res.data["计划完成时间"]).getTime() < new Date().getTime()) {
                    _target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)').innerHTML += '<span  class="changeNodeTime" style="color: red">-超期未关<span>'
                }
                let str = ''
                if(time1) {
                    str = '<div class="changeNodeTime" style="color: #333;font-weight:700; font-size: 11px">' +time1 + '~' + time2+' 工时：'+res.data["评估基准工时"]+'</div>'
                } else { // 方案
                    str = time4 ? '<div class="changeNodeTime" style="color: #333;font-weight:700; font-size: 11px">' +time4 + '~' + time2+' 工时：'+res.data["评估基准工时"]+'</div>' : '<div  class="changeNodeTime" style="color: #333;font-weight:700; font-size: 11px">'+time2+' 工时：'+res.data["评估基准工时"]+'</div>'
                }
                _target.contentDocument.querySelector('tr[data-row-key="'+res.data._id+'"] td:nth-child(2)').innerHTML += str
                _target.contentDocument.querySelector('.ant-table-content colgroup col:nth-child(2)').style.width = '200px'
            }
        });

    }

    function dateFormat(date, format) {
        format = format ? format : 'yyyy-MM-dd'
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return format;
    }

    function queryListByParams(){
        // /pm/version/queryListByParams
        fetch('https://devops.chinaunicom.cn/pm/version/queryListByParams', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow",
                "Access-Control-Allow-Origin": "*"
            },
            body: '{}',
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            targetWindow.postMessage(JSON.stringify({
                type: 'queryListByParams',
                data: res.data.data || []
            }), '*');
        })
    }

    function queryWorkBenchDetails(query){
        if(!query.id) return
        let params = {
            "requestData": {
                "_id": query.id,
                "type": "1"
            }
        }
        // /pm/workbenchContr/queryWorkBenchDetails
        fetch('https://devops.chinaunicom.cn/pm/workbenchContr/queryWorkBenchDetails', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(params),
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            targetWindow.postMessage(JSON.stringify({
                type: 'queryWorkBenchDetails',
                data: res.data || {}
            }), '*');
        })
    }

    function querySystemList(ids){
        let bodyStr = '{"requestParams":{"normalQuery":{"itemType":["7-1"],"itemId":"'+ids+'","state":["6085056005ce5e00011a3ccc"]},"versionQuery":{},"selfQuery":[]},"page":{"pageNo":1,"pageSize":20}}'
        fetch('https://devops.chinaunicom.cn/pm/workbenchContr/queryWorkBenchList', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow"
            },
            body: bodyStr,
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            targetWindow.postMessage(JSON.stringify({
                type: 'getZTInfoList',
                data: {
                    type: 'success',
                    data: res.data
                }
            }), '*');
        });
    }

    function getZTInfoList(ids){
        console.log('getZTInfoList');
        let text = document.getElementsByClassName('antd-pro-components-topbar-component-swicth-switchFont')[0].textContent
        if(text != '公众中台_总体') {
            targetWindow.postMessage(JSON.stringify({
                type: 'getZTInfoList',
                data: {
                    type: 'error',
                    message: '请切换到公众中台_总体'
                }
            }), '*');
        } else {
            querySystemList(ids)
        }
    }

    function getLcdpAccessToken(){
        let bodyStr = ''
        fetch('https://devops.chinaunicom.cn/uniportal/uims/v1/low/user/token', {
            headers: {
                "Accept": "*/*",
                "Cookie": "sessionId=34bebd863160476f8d1eea90b1f; uuid=42682; ttUserId=6f65750ff3264b2d8fe6a329b33e6d91; defaultApp=true; defaultAccount=false; jeesite.session.id=YjY2Mjk4NWItNWU4Ni00MDE1LWFlYWEtNWJjNjFlYmNmMjFj; accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc1Jvb3QiOiIwIiwicmVmcmVzaFRpbWUiOjE4MCwiaXNzIjoiY3Vzb2Z0d2FyZSIsIm1vYmlsZSI6IjE1NjU2MDAxODYzIiwiamVlc2l0ZS5zZXNzaW9uLmlkIjoiWWpZMk1qazROV0l0TldVNE5pMDBNREUxTFdGbFlXRXROV0pqTmpGbFltTm1NakZqIiwidXNlck5hbWUiOiJmYW5rcSIsImFjY2Vzc1Rva2VuIjoiNjVmMDRlMmQ5ODU5NDVkZjhiYmFhYzQ4ZmRiMjk2ZmUiLCJ0dFVzZXJJZCI6IjZmNjU3NTBmZjMyNjRiMmQ4ZmU2YTMyOWIzM2U2ZDkxIiwiaXNFbmFibGVDb25zb2xlIjoiMSIsImlkIjoiNmY2NTc1MGZmMzI2NGIyZDhmZTZhMzI5YjMzZTZkOTEiLCJleHAiOjE3NDAxMjQyNDUsImVtYWlsIjoiZmFua3FAc2ktdGVjaC5jb20uY24iLCJpc0VuYWJsZVByb2dyYW0iOiIxIn0.ck7qi54U63jyZaGFCWVVUGSs1Qzyb6SI36NZRWUXx3GZHJcWUhsjiCMsYOEjqw1daNzWjXAm3nV1L5paplUW5A; UNIPORTAL-SESSION=NmZlNWJlNDQtYWJmYS00Mzk2LTgwNGItNzZkYWU2NGNjOTZl; JSESSIONID=F6CFBC62BD6B5D2EB91281F695137D34; lcdpAccessToken=4ec120ac-8ef9-47ed-85de-c4e5b1c884d1",
            }
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            console.log('getLcdpAccessToken ', res)
            querySystemList();
        });
    }

    function appSwitch() {
        // 9a5d48ddc6f94a869b112dd5e7e12b28 公众
        // 3546b760e4246c492d33a17e4dfe4f3 总体
        // https://devops.chinaunicom.cn/tgportalheader/uniportal/v1/app/switch
        let bodyStr = '{"projectId": "3546b760e4246c492d33a17e4dfe4f3"}'

        fetch('https://devops.chinaunicom.cn/tgportalheader/uniportal/v1/app/switch', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "paramsToken": "allow"
            },
            body: bodyStr,
            mode: "cors",
            xhrFields: {
                withCredentials: true
            },
            credentials: "include"
        }).then((res)=> {
            return res.json();
        }).then((res)=> {
            getLcdpAccessToken()
        });
    }

    // getLcdpAccessToken();
    //setTimeout(()=>{
     //   appSwitch();
    //}, 5000)

})();