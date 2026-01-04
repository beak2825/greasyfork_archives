// ==UserScript==
// @name         一楼一风
// @license      一楼一风
// @namespace    http://tampermonkey.net/
// @version      1.1.15
// @description  加速浏览
// @author       You
// @match        *haofeng.fun*
// @match        *ccfeng.xyz*
// @match        *nnfeng.xyz*
// @match        *16bian.xyz*
// @match        *16chun.xyz*
// @match        *16kang.xyz*
// @match        *16nian.xyz*
// @match        *16piao.xyz*
// @match        *16ruan.xyz*
// @match        *16tang.xyz*
// @match        *16xuan.xyz*
// @match        *mei16.xyz*
// @match        *wan6.xyz*
// @match        *che16.xyz*
// @match        *tui16.xyz*
// @match        *lai16.xyz*
// @match        *pao16.xyz*

// @run-at       document-start
// @connect      https://bx1r8xwh6pn51.cfc-execute.bj.baidubce.com*
// @connect      https://bx1r8xwh6pn51.cfc-execute.bj.baidubce.com/test2
// @connect      bx1r8xwh6pn51.cfc-execute.bj.baidubce.com

// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/453947/%E4%B8%80%E6%A5%BC%E4%B8%80%E9%A3%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/453947/%E4%B8%80%E6%A5%BC%E4%B8%80%E9%A3%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // @grant        none
    // Your code here...

    function addXMLRequestCallback(callback){
        // 是一个劫持的函数
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
        // 判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // 如果不存在则在xmlhttprequest函数下创建一个回调列表
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // 获取旧xml的send函数，并对其进行劫持
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // 循环回调xml内的回调函数
                // call the native send()
                oldSend.apply(this, arguments);
            // 由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
            }
        }
    }

    // e.g.
    addXMLRequestCallback( function( xhr ) {
            // 调用劫持函数，填入一个function的回调函数
            // 回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
            xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                if(xhr.responseURL.indexOf("api/show") != -1){
                    let jsonData  = JSON.parse(xhr.responseText);  // 格式换成 json
                    jsonData['id'] = getUrlParams()['id'];
                    dataStr = JSON.stringify(jsonData);

                    // console.log(xhr);
                    console.log(window.location.href);
                    if(jsonData['is_see']){
                        //
                        console.log('当前是登录状态');
                        // console.log( xhr.responseURL );
                        // console.log("XXXXXXXXXXXXXX:", JSON.parse(xhr.responseText)['city']);
                        console.log("responseText", JSON.parse(xhr.responseText) );
                        // 发送数据
                        sendData(dataStr);
                    }else{
                        //
                        console.log('未登录的信息：');
                        console.log( xhr.responseURL );
                        console.log("XXXXXXXXXXXXXX:", JSON.parse(xhr.responseText)['city']);
                        console.log("responseText", JSON.parse(xhr.responseText) );
                        writeSeeHTML();
                        document.querySelector("#seeMesage").addEventListener('click', function () {
                            alert('功能还没开发好，如需查看联系方式，可以联系QQ 876152540');
                        });
                    };

                };

            }
        });

    });

    // Your code here...
    function sendData(dataStr){
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://bx1r8xwh6pn51.cfc-execute.bj.baidubce.com/test2',
            data:dataStr,
            cookie:document.cookie,
            onload: function(res){
                if(res.status === 200){
                    console.log('准备开始,等待返回结果....');
                    dataJSon = JSON.parse(res.response);
                    console.log(dataJSon['rusult']);
                    writeHtml(dataJSon['rusult']);
                }else{
                    console.log('send 数据失败'+'返回代码：'+String(res.status))
                    console.log(res)
                }
            },
            onerror : function(err){
                console.log('send 数据遇到错误')
                console.log(err)
            }
        });
    };

    // 获取网址中的参数 信息ID
    function getUrlParams() {
        let url = window.location.href
        // 通过 ? 分割获取后面的参数字符串
        let urlStr = url.split('?')[1]
        // 创建空对象存储参数
        let obj = {};
        // 再通过 & 将每一个参数单独分割出来
        let paramsArr = urlStr.split('&')
        for(let i = 0,len = paramsArr.length;i < len;i++){
            // 再通过 = 将每一个参数分割为 key:value 的形式
            let arr = paramsArr[i].split('=')
            obj[arr[0]] = arr[1];
        }
        return obj
    };

    // ---------------

    //  添加网页元素(将写入结果反馈到页面)
    function writeHtml(rusult){
        //
        // window.onload = function(rusult){
            //
            let small =document.createElement("small");
            htmlStr = `
                <svg data-v-73b7ef61="" data-v-291d59e3="" aria-hidden="true" class="svg-icon" style="fill: rgb(153, 153, 153);">
                    <use data-v-73b7ef61="" xlink:href="#icon-browse"></use>
                </svg>
            `;
            // var rusult = "成功响应数据：5条";
            // 提取数字
            var num2 = rusult.replace(/[^\d]/g, " "); //num2 : 2021
            htmlStr = htmlStr + 'write:'+num2;
            small.innerHTML = htmlStr;
            document.querySelector("div.text-secondary").append(small);
        // };
    };

    function writeSeeHTML(){
        //  
        seeHTML = `
            <div id="seeMesage"  style="color: red;background-color: gold">
                <a>免登录显示联系方式</a>
            </div>
        `;

        const lianxiElement = document.evaluate("//span[contains(., '联系方式')]", document, null, XPathResult.ANY_TYPE).iterateNext();
        const hh  = lianxiElement.parentNode
        hh.innerHTML = hh.innerHTML + seeHTML;
    };



    //------------
    //=========================================超链接在新窗口打开=============================================================
        // 插入元素脚本
    function writeEle(){
        let hrefItemElements = document.querySelectorAll(".C-InfoCard");
        for (let hrefItemN =0;hrefItemN < hrefItemElements.length;hrefItemN++)
        { 
            let hrefItemss = hrefItemElements[hrefItemN];
            let hrefItemssTwo = hrefItemss.parentNode.parentNode.parentNode.parentNode
            let hrefItems = hrefItemssTwo.querySelectorAll("a");
            for (let ii=0;ii<hrefItems.length;ii++){
                hrefItems[ii].setAttribute("target","_blank"); 
                // console.log(hrefItems[ii].href);
            };
        };    
          
    };
    //writeEle();


    // 将超链接修改为在新窗口打开
    if(window.location.href.indexOf("home")!=-1 || window.location.href.indexOf("lists")!=-1 ){
        try{
            jiankong()
        }catch(err){
            console.log('err');
        };
        // console.log('超链接在新窗口页打开');
        // window.onload = function(){
            //  这里是插入代码
            var num = 0;
            function loopIput(){
    
                num++;
                // console.log(num);
                try{
                    //  这里是插入代码
                    writeEle();
                    //  这里是插入代码完成。         
                    console.log('插入元素完成');
                    if(document.querySelector(".C-InfoCard")){
                        console.log('找到超链接数量：' + String(document.querySelectorAll(".C-InfoCard").length));
                        clearInterval(t);
                        jiankong(); //持续监控元素 
                    };
                    All
                }catch(err){
                    console.log(err.message);
                };
                console.log('这是第：',num,'次运行函数插入');
                if(num>30){
                    clearInterval(t);
                };
            };
            var t = setInterval(loopIput,1000); // 每隔1秒检查一次 运行一次函数，直到运行成功,若果运行30次还没成功，则终止
        // };
    };



    function jiankong(){
        //  页面改变就运行插入-----------------------------------------------------
        // js监听页面元素是否变化
        // 选择需要观察变动的节点
        const pele = document.querySelector(".C-InfoCard");
        // console.log(pele);
        const targetNode = pele.parentNode.parentNode.parentNode.parentNode.parentNode;
        // 观察器的配置（需要观察什么变动）
        const config = { attributes: true, childList: true, subtree: true };
        // 当观察到变动时执行的回调函数
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('元素变化了');
                    writeEle();
                }
                // else if (mutation.type === 'attributes') {
                //     console.log('The ' + mutation.attributeName + ' 属性变化了attribute was modified.');
                // }
            }
        };
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);
        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
        // 之后，可停止观察
        // observer.disconnect();
        //  页面改变就运行插入-----------------------------------------------------
    };
    


    //=========================================超链接在新窗口打开=============================================================

    // 列表中的所有超链接在新页面中打开


})();

