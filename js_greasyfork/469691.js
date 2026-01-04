// ==UserScript==
// @name         getshopname
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  获取敦煌商铺名称
// @author       You
// @match        https://www.dhgate.com/*
// @match        https://www.aliexpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        unsafewindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @license      Apache 2
// @downloadURL https://update.greasyfork.org/scripts/469691/getshopname.user.js
// @updateURL https://update.greasyfork.org/scripts/469691/getshopname.meta.js
// ==/UserScript==

(function () {
    addBox();addStyle();addButton();

    if(location.host.includes('aliexpress')){
        aliexpressMethod();
    }else  if(location.host.includes('dhgate')){
        dhgateMethod();
    }

})();

function addBox() {
    var tipHtmlStr = '<div id="wqy2-import-container" class="wqy2-panel wqy2-panel-import">' +
        '<div class="wqy2-panel-header">' +
        '</div>' +
        '<div id="wqy2-panel-import-content" class="wqy2-panel-import-content">' +
        '<textarea style="margin: 0px;height: 98%;width: 351px;"></textarea>' +
        '</div>' +
        '</div>';
    $("body").append(tipHtmlStr);
}

function addButton(){
    $("body").append('<aside id="btn-wqy2-start"><ul><li><a href="#" class="wqy2-addtolist-btn" >开始采集店铺名称</a></li></ul></aside>');
    $("body").append('<aside id="btn-wqy2-show"><ul><li><a href="#" class="wqy2-show-btn" >展示采集结果</a></li></ul></aside>');
    $("body").append('<aside id="btn-wqy2-creal"><ul><li><a href="#" class="wqy2-creal-btn" >清除采集结果</a></li></ul></aside>');

}
function aliexpressMethod() {
    function startCrawlName() {
        GM_setValue(tasktimeKey, (new Date()).getTime())
        window.scrollTo(0, document.body.scrollHeight);
        var namelist= GM_getValue(namelistkey, []);
        var curhtml = '';
        var els = $('a.store-name,div.store-name a,div.seller-title a,span.cards--store--A2ezoRc a')
        if (els.length == 0) {
            GM_setValue(taskKey, false)
            // endTask()
            return;
        }
        for (let i = 0; i < els.length; i++) {
            const element = els[i];
            var sname = element.innerText;
            if (!namelist.includes(sname)) {
                namelist.push(sname);
               // curhtml += sname + '\n';
            }
        }
        GM_setValue(namelistkey, namelist)
        // var ss=  GM_getValue(namelistkey)
        // console.log(ss);
        nextPage();
    }

    function continueTask() {
        window.scrollTo(0, document.body.scrollHeight);
        var namelist = GM_getValue(namelistkey, []);
        var curhtml = '';
        var els = $('a.store-name,div.store-name a,div.seller-title a,span.cards--store--A2ezoRc a')
        if (els.length == 0) {
            GM_setValue(taskKey, false)
            endTask()
            return;
        }
        for (let i = 0; i < els.length; i++) {
            const element = els[i];
            var sname = element.innerText;
            if (!namelist.includes(sname)) {
                namelist.push(sname);
          //      curhtml += sname + '\n';
            }
        }
        //$("#wqy2-import-container textarea").val(curhtml)
        GM_setValue(namelistkey, namelist)
        // var ss=  GM_getValue(namelistkey)
        // console.log(ss);
        //debugger;
        nextPage();
    }
    function nextPage() {
        //$("ul[class^='pagination']")
        if (Number($("ul[class^='pagination'] li[class*='pagination--isActive']").text()) > 100) {
            //todo:展示结果
            GM_setValue(taskKey, false)
            return;
        } else {
            var lasttime = GM_getValue(tasktimeKey, 0)
            if (lasttime == 0) {
                GM_setValue(tasktimeKey, (new Date()).getTime())
            }
            GM_setValue(taskKey, true)

            $("ul[class^='pagination'] li[class*='pagination--isActive']").next().click()
            var lasttime = GM_getValue(tasktimeKey, 0)
            if (lasttime == 0 || new Date() - lasttime < 60000) {
                  setTimeout(function () {
                    window.scrollTo(0, document.body.scrollHeight);
                    setTimeout(function () {
                        continueTask();
                    },5000);

            }, 5000)
            } else {
                setTimeout(function () {
                    GM_setValue(tasktimeKey, (new Date()).getTime())
                    continueTask();
                }, 60000)
            }

        }
    }

    function endTask() {
        var namelist = GM_getValue(namelistkey, []);
        var curhtml = '';
        for (let i = 0; i < namelist.length; i++) {
            const element = namelist[i];
            curhtml += element + '\n';
        }
        $("#wqy2-import-container textarea").val(curhtml)
        $("#wqy2-import-container").show()
    }

    function showresult() {
        var namelist = GM_getValue(namelistkey, []);
        namelist = namelist.filter(function (item, index) {
            return namelist.indexOf(item) === index;  // 因为indexOf 只能查找到第一个
        });

        var curhtml = '';
        for (let i = 0; i < namelist.length; i++) {
            const element = namelist[i];
            curhtml += element + '\n';
        }
        $("#wqy2-import-container textarea").val(curhtml)
        $("#wqy2-import-container").show()
    }

    function crealresult() {
        GM_deleteValue(namelistkey)
        GM_setValue(taskKey, false)
        showresult()
    }
    var namelistkey = 'aliexpressNamelist'
    var taskKey = 'aliexpressCrawltask'
    var tasktimeKey = 'aliexpressCrawltasktime'
    $('#btn-wqy2-start').click(startCrawlName);
    $('#btn-wqy2-show').click(showresult);
    $('#btn-wqy2-creal').click(crealresult);

    // var crawltask = GM_getValue(taskKey, false)
    // if (crawltask) {
    //     var lasttime = GM_getValue(tasktimeKey, '')
    //     if (lasttime == '' || new Date() - lasttime < 60000) {
    //         continueTask();
    //     } else {
    //         setTimeout(function () {
    //             GM_setValue(tasktimeKey, new Date())
    //             continueTask();
    //         }, 60000)
    //     }

    // }


}

function dhgateMethod(){

    function startCrawlName(){
        var namelist=[];
        var curhtml = '';
        var els=$('a.store-name,div.store-name a,div.seller-title a,span.cards--store--A2ezoRc a')
        if(els.length==0){
            GM_setValue(taskKey, false)
            // endTask()
            return;
        }
        for (let i = 0; i < els.length; i++) {
            const element = els[i];
           var sname= element.innerText;
           if(!namelist.includes(sname)){
            namelist.push(sname);
            curhtml+=sname+'\n';
           }
        }
        GM_setValue(namelistkey, namelist)
        // var ss=  GM_getValue(namelistkey)
        // console.log(ss);
        nextPage();
    }

    function continueTask(){
        var namelist= GM_getValue(namelistkey,[]);
        var curhtml = '';
        var els=$('a.store-name,div.store-name a,div.seller-title a,span.cards--store--A2ezoRc a')
        if(els.length==0){
            GM_setValue(taskKey, false)
            endTask()
            return;
        }
        for (let i = 0; i < els.length; i++) {
            const element = els[i];
           var sname= element.innerText;
           if(!namelist.includes(sname)){
            namelist.push(sname);
            curhtml+=sname+'\n';
           }
        }
        GM_setValue(namelistkey, namelist)
        // var ss=  GM_getValue(namelistkey)
        // console.log(ss);
        debugger;
        nextPage();
    }
    function nextPage(){
       if(Number($('.pagelist b').text())>100){
        //todo:展示结果
        GM_setValue(taskKey, false)
        return;
       }else{
        GM_setValue(taskKey, true)
        var nexturl=$('.pagelist b').next().attr('href');
        console.log(nexturl)
        if(nexturl!=''&&nexturl!=null&&nexturl!=undefined)
        window.document.location.href=nexturl;
        else{
            $('.pagelist b').next().click()
        }
       }
    }

    function endTask(){
        var namelist= GM_getValue(namelistkey,[]);
        var curhtml = '';
        for (let i = 0; i < namelist.length; i++) {
            const element = namelist[i];
            curhtml+=element+'\n';
        }
          $("#wqy2-import-container textarea").val(curhtml)
          $("#wqy2-import-container").show()
    }

    function showresult(){
        var namelist= GM_getValue(namelistkey,[]);
        namelist = namelist.filter(function(item,index){
            return namelist.indexOf(item) === index;  // 因为indexOf 只能查找到第一个
         });

        var curhtml = '';
        for (let i = 0; i < namelist.length; i++) {
            const element = namelist[i];
            curhtml+=element+'\n';
        }
          $("#wqy2-import-container textarea").val(curhtml)
          $("#wqy2-import-container").show()
    }

    function crealresult(){
        GM_deleteValue(namelistkey)
        showresult()
    }
    var namelistkey='dhgateNamelist'
    var taskKey='dhgateCrawltask'
    $('#btn-wqy2-start').click(startCrawlName);
    $('#btn-wqy2-show').click(showresult);
    $('#btn-wqy2-creal').click(crealresult);
    var crawltask= GM_getValue(taskKey, false)
    if(crawltask){
     continueTask();
    }
}

function addStyle(){
    let css=`.wqy2-panel {
        display:none;
        width: 290px;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
    }

    .wqy2-panel-import-content {
        padding: 20px;
        text-align: center;
        height: 500px;
        overflow: auto;
    }

    .wqy2-panel-import {
        position: fixed;
        top: 300px;
        right: 10px;
        z-index: 9999;
        width: 400px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 20px;
        border-radius: 4px;

    }

    #btn-wqy2-start{
        z-index:999 !important;
        position: fixed;
        top: 160px;
        right: 170px;
      }

      #btn-wqy2-start ul li{
        list-style:none;
      }

      #btn-wqy2-start .wqy2-addtolist-btn{
        background-color: #3fd31a;
        width: 154px;
        height: 30px;
        border: none;
        border-radius: 4px;
        top: 13px;
        position: absolute;
        z-index: 9999;
        cursor: pointer;
        font-size: 18px;
        text-align: center;
        font-weight: 800;
        color: white;

      }
      #btn-wqy2-show{
        z-index:999 !important;
        position: fixed;
        top: 195px;
        right: 170px;
      }

      #btn-wqy2-show ul li{
        list-style:none;
      }

      #btn-wqy2-show .wqy2-show-btn{
        background-color: #1ab1d3;
        width: 154px;
        height: 30px;
        border: none;
        border-radius: 4px;
        top: 13px;
        position: absolute;
        z-index: 9999;
        cursor: pointer;
        font-size: 18px;
        text-align: center;
        font-weight: 800;
        color: white;

      }
      #btn-wqy2-creal{
        z-index:999 !important;
        position: fixed;
        top: 230px;
        right: 170px;
      }

      #btn-wqy2-creal ul li{
        list-style:none;
      }

      #btn-wqy2-creal .wqy2-creal-btn{
        background-color: #d31a1a;
        width: 154px;
        height: 30px;
        border: none;
        border-radius: 4px;
        top: 13px;
        position: absolute;
        z-index: 9999;
        cursor: pointer;
        font-size: 18px;
        text-align: center;
        font-weight: 800;
        color: white;

      }

    `
    GM_addStyle(css)
}

