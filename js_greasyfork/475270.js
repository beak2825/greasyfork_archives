// ==UserScript==
// @name         服务台辅助脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  服务台辅助补单
// @author       You
// @match        https://itsm.yimidida.com/*
// @icon         https://itsm.yimidida.com/assets_min/images/logo_mini.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475270/%E6%9C%8D%E5%8A%A1%E5%8F%B0%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475270/%E6%9C%8D%E5%8A%A1%E5%8F%B0%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const li = document.createElement('li');
    li.addEventListener('click', (event)=>{
        window.parent.Addtabs.add({
            id : '21',
            title : _i18n('new_incident_ticket'),
            content : "",
            url : getRootPath() + "/event/addEvent.html",
            ajax : $(this).attr('ajax') ? true : false
        });

        document.getElementById('ifr_21').contentWindow.document.addEventListener('readystatechange', ()=>{
            console.log("事件加载")
        })
        setTimeout(() => {
            //
            document.querySelector('iframe[name=ifr_21]').contentWindow.document.getElementById('dealGroupId_ztree_4_a').click();
            //
            document.querySelector('iframe[name=ifr_21]').contentWindow.document.getElementById("serviceType_ztree_3_a").click();
            setTimeout(()=>{document.querySelector('iframe[name=ifr_21]').contentWindow.document.getElementById('dealOperator_ztree_3_a').click();},100);

            const printBtn = document.createElement('button');
printBtn.className  = 'anniu2 confirmBtn';
printBtn.style = "background-color: #00CC00;";
            printBtn.innerText = "打印机快捷补单";
printBtn.onclick = ()=>{
  document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incContent").value = "打印机问题";

    document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incType_ztree_2_a").click();
    //document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incClass_ztree_454_a").click();

    document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incClass_ztree_598_switch").click();
    setTimeout(()=>{
        document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incClass_ztree_606_switch").click();
        document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incClass_ztree_609_a").click();
        document.querySelector('iframe[name=ifr_21]').contentWindow.fastAddOrder();
        setTimeout(()=>{ document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#incSolution").value = "已调试正常";
                       document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#fastAddOrderModal > .wangEditor-txt").appendChild(document.createElement('p').innerText = "已调试正常");
                       }, 50)
    },100)
}
document.querySelector('iframe[name=ifr_21]').contentWindow.document.querySelector("#main-container > div > div > div > div.tabbable > div.col-xs-12.addfooter").appendChild(printBtn);

            //添加三级事件修改dom高度
            document.getElementById('ifr_21').contentDocument.querySelector("#incClass_select_btn").addEventListener('click',()=>{document.getElementById('ifr_21').contentDocument.getElementById('incClass_ztree').setAttribute('style', 'max-height: 800px !important');})
            document.getElementById('ifr_21').contentDocument.querySelector("#E696B0E5BBBAE4BA8BE4BBB6E5B7A5E58D95 > div:nth-child(3) > div:nth-child(6) > div").addEventListener('click', ()=>{ document.getElementById('ifr_21').contentDocument.getElementById('incClass_ztree').setAttribute('style', 'max-height: 800px !important'); })
            //dealGroupId_ztree
            document.getElementById('ifr_21').contentDocument.querySelector("#E696B0E5BBBAE4BA8BE4BBB6E5B7A5E58D95 > div:nth-child(4) > div:nth-child(4) > div").addEventListener('click', ()=>{
              document.getElementById('ifr_21').contentDocument.querySelector("#dealGroupId_ztree").setAttribute('style', 'max-height: 800px !important');
            })


        }, 1298);

    })
    li.style = "cursor: pointer;";
    const a = document.createElement('a');
    a.innerText = '快速补单';
    a.style="display:block;";
    a.type = 1;
    li.appendChild(a);
    $("#nav").append(li);
    /*const btn = document.createElement('a');

btn.className = "anniu2 confirmBtn";
    btn.style = "algin:center;";
btn.innerText = "切换问题类型";
btn.onclick = ()=>{
    $(".active > iframe")[0].querySelector("#incEditForm").getFormVal().incType==='100'?$(".active > iframe")[0].querySelector("#incType_ztree_2_a").click():$(".active > iframe")[0].querySelector("#incType_ztree_3_a").click();
}
$('#nav').append(btn);*/
    // 如果权限已经被授予，创建并显示通知
    const li2 = document.createElement('li');
    li2.addEventListener('click', (event)=>{
      document.title += "-监控"
      const  interval = setInterval(()=>{
        fetch("https://itsm.yimidida.com/filterconditionAction/incidentFiltercondition", {
        "headers": {
          "accept": "text/plain, */*; q=0.01",
          "accept-language": "zh-CN,zh;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://itsm.yimidida.com/myOrder.html?flag=100012593&&geogIds=&&countType=INCIDENT:0,CHANGE:0,PROBLEM:0,SERVERREQ:0,KNOWLEDGE:0,RELEASE:0,TASK:0&tabId=tab_grid1",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "id=100012593&flowCodes=INCIDENT&isOrder=1&limit=50&start=0&luceneKey=&bingDate=&endDate=&geogId=&sortorder=",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      }).then(res=>res.json()).then(data=>{
          if(data.root.length > 0){
            document.title = "新工单" + data.root.length.toString();
            fetch("http://localhost:3000", {
              method: "POST",
              body: JSON.stringify({
                count: data.root.length,
                element_minutes: data.root.map(e=>e.consumedTime)
              }),
              headers: { "Content-Type": "application/json" }
            })
          } else {
            document.title = "ITSM-监控"
          }
        });
      }, 60000)
    });
    li2.style = "cursor: pointer;";
    const a2 = document.createElement('a');
    a2.innerText = '监控工单';
    a2.style="display:block;";
    a2.type = 1;
    li2.appendChild(a2);
    $("#nav").append(li2);

})();