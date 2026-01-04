// ==UserScript==
// @name         联通内网-法治在沃，自动刷积分
// @namespace    https://gitee.com/zouyongs/js-liantongdangxiao
// @version      2.2
// @description  在UI界面点击开始以自动刷积分。通过联通OA进入法治在沃首页，点击开始即可。
// @author       Zouys
// @match        http://lawplatform.unicom.local/unitework/pf/*.do
// @icon         http://aiportal.unicom.local/portal/v1/assets/images/icon/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476149/%E8%81%94%E9%80%9A%E5%86%85%E7%BD%91-%E6%B3%95%E6%B2%BB%E5%9C%A8%E6%B2%83%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/476149/%E8%81%94%E9%80%9A%E5%86%85%E7%BD%91-%E6%B3%95%E6%B2%BB%E5%9C%A8%E6%B2%83%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    //http://lawplatform.unicom.local/law/tpfLike/toLike.do
    window.onload = function () {
        let show = 0
        let showWindow = document.createElement('button')
        showWindow.style.width = '60px'
        showWindow.style.height = '40px'
        showWindow.innerText = '开刷！'
        showWindow.style.position = 'fixed'
        showWindow.style.left = '0px'
        showWindow.style.top = '150px'
        showWindow.style.zIndex = '111'
        showWindow.addEventListener('click', ()=>{
            fuc_show()
        })
        function fuc_show() {
            let myWindow=document.getElementById('mywin')
          // let is_show=document.querySelector('#myWindow')
          show++
          if (show == 1) {
            myWindow.style.display = 'block'
    
          }
          else {
            show = 0
            myWindow.style.display = 'none'
          }
        }
        document.body.appendChild(showWindow)
        let myWindow = document.createElement('div')
        myWindow.id = 'mywin'
        myWindow.style.width = '300px'
        myWindow.style.height = '400px'
        myWindow.style.backgroundColor = '#efefef'
        myWindow.style.position = 'fixed'
        myWindow.style.left = '50px'
        myWindow.style.top = '150px'
        myWindow.style.zIndex = '111'
        myWindow.style.display = 'none'
        myWindow.innerHTML = `<button id="btn-begining">开始</button>
睡眠时间：<input id="sleeptime" value="3" style="display: inline-block;width: 40px;"> 秒
<br>捕获条数：<div id="c-total"  style="display: inline-block;width: 20px;color: #f5083f;">36</div>
<br><div>日志信息：</div>
<div style="width:90%;margin: auto auto;border-radius: 10px;position: relative;border: 1px solid grey;height: 200px;margin-top: 0px;">

<ul id="ul" style=" overflow-x: auto;white-space: nowrap;margin:0px 0px 0px 0px; overflow: auto;height:100%;">
</ul>
当前进度：
<div id="myProgress" style="width: 0%; height: 20px; background-color: green; position: relative; bottom: 0;">
        
    </div>
    <div id="progrssNum" style="display: flex;justify-content: center;position: relative; top: -20px;">0%</div>
</div>`
    document.body.appendChild(myWindow)
    var readyCheck=true
    var arrAll = getID();
    document.getElementById('c-total').innerText=arrAll.length || 0
    
    var myUl=document.getElementById('ul')
       //进度条
     var myProgress=document.getElementById('myProgress')
     var myProgressNum=document.getElementById('progrssNum')

    var list=document.createElement('li')
    list.innerHTML=`等待开始...`
    myUl.appendChild(list)
    document.getElementById('btn-begining').addEventListener('click', () => {
        if(readyCheck==true)
        {
            readyCheck=false
            myProgress.style.width=`0%`
            myProgressNum.innerText=`0%`
            doMain(document.getElementById('sleeptime').value * 1000 || 3000).then(v=>{
                readyCheck=true
            })
        }
        else{
            alert('请等待本次操作完成~')
        }
      })

        // 设置全局cookie
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    //签到
    $.ajax({
        url: 'http://lawplatform.unicom.local/law/TpfAttendance/sgin.do',  // 请求的URL地址
        type: 'POST',  // 请求的方式（GET、POST等）
        dataType: 'json',  // 响应的数据类型（json、xml等）
        success: function (data) {
            // 请求成功时的回调函数，data参数包含相应的数据
            console.log(data.msg)
            let mylist=document.createElement('li')
            mylist.innerHTML= data.msg==='积分+10'?`签到成功~积分+10`:`${data.msg}` || ``
            myUl.appendChild(mylist)
        },
        error: function (xhr, status, error) {
            // 请求失败时的回调函数，xhr参数包含XMLHttpRequest对象，status参数包含错误状态，error参数包含错误信息
            console.log('请求失败：' + status + ' - ' + error);
        }
    });
    async function sleep(time) {
        return await new Promise((resolve) => {
            console.log('睡眠'+time/1000+'s') 
            var list=document.createElement('li')
            list.innerHTML=`睡眠${time/1000}s...`
            myUl.appendChild(list)
            setTimeout(resolve, time)
        });
    }
    var index = 0;
    //获取首页30个文章id
    function getID() {
        var arr;
        var as = document.querySelectorAll('li');
        var ps = document.querySelectorAll('p');
        var needArr=[];
        arr = Array.from(as);
        for(var i of arr){if(i && i.innerHTML && i.innerHTML.split('opendetail')[1] ){
        // console.log(i.innerHTML.split('opendetail')[1].split('(\'')[1].split('\')')[0])
        needArr.push(i.innerHTML.split('opendetail')[1].split('(\'')[1].split('\')')[0])
        }}
        var arrp = Array.from(ps);
        for(var j of arrp){if(j && j.outerHTML && j.outerHTML.split('opendetail')[1] ){
        // console.log(j.outerHTML.split('opendetail')[1].split('(\'')[1].split('\')')[0])
        needArr.push(j.outerHTML.split('opendetail')[1].split('(\'')[1].split('\')')[0])
        }}
        //去重
        return [...new Set(needArr)];
    }
    //每3s发送一次点赞请求v
    
    async function sendResPre3s(id) {
        let mylist=document.createElement('li')
        let listring
           await $.ajax({
                url: 'http://lawplatform.unicom.local/law/tpfLike/toLike.do',  // 请求的URL地址
                type: 'POST',  // 请求的方式（GET、POST等）
                dataType: 'json',  // 响应的数据类型（json、xml等）
                data: {
                    infoId: id
                },
                success: function (data) {
                    // 请求成功时的回调函数，data参数包含相应的数据
                    console.log(++index + '   点赞-- ' + data.status + ' id=', id)   
                    listring=`第${index}  点赞=>${data.status} `
                },
                error: function (xhr, status, error) {
                    // 请求失败时的回调函数，xhr参数包含XMLHttpRequest对象，status参数包含错误状态，error参数包含错误信息
                    console.log('请求失败：' + status + ' - ' + error);
                    listring=`点赞请求失败`
                }
            });
        //完整浏览文章
        //浏览积分
        // var url = "http://lawplatform.unicom.local/law/tpfIntegralDetail/addBrowseIntegral.do"
        var url="http://lawplatform.unicom.local/law/tpfIntegralDetail/addBrowseIntegralDetail.do"
        await  $.ajax({
            url: url,
            type: "POST",
            data: {
                infoId: id
            },
            success: function (data) {
                console.log('浏览--' + data.massege + '  id=', id)
                listring+=`      浏览=>${data.massege}  id=${id}`
                
            }
        });
        mylist.innerHTML=listring
        myUl.appendChild(mylist)
        let pgr=Math.round(index/arrAll.length *100)
        console.log('pgr:'+pgr)
        myProgress.style.width=`${pgr}%`
        myProgressNum.innerText=`${pgr}%`
    }
    async function doMain(ms) {
        index=0
        //主运行代码
        for (var i of arrAll) {
                await sendResPre3s(i);
                await sleep(ms);
        }
    }
    }
})();