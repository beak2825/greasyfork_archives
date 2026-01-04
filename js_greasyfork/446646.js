// ==UserScript==
// @name         链接转换transformation to links
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将网页内容中的链接转换为可点击跳转，免去手动复制
// @author       code200
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/446646/%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2transformation%20to%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/446646/%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2transformation%20to%20links.meta.js
// ==/UserScript==

(function() {
    let exclude=new Map;
    exclude.set('A',1);
    exclude.set('SCRIPT',1);
    const reg=/(^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$)|(http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+)/g;
    const styleStr='style="color: red !important;border-bottom: 1px solid red !important;text-shadow: 0px 2px 10px #000 !important;text-decoration: none !important;"';
    const changeConfig = { attributes: true, childList: true, subtree: true };
    var href=window.location.href;
    GM_registerMenuCommand('已转换：' + (GM_getValue('transformation_count')==undefined?0:GM_getValue('transformation_count')) + '次（点击重置）', () => {
               GM_setValue('transformation_count', 0)
                        history.go(0);
            });
    function getNode(ele){
        var array = ele.childNodes;
        for(var i = 0;i < array.length;i++){
            var childNode = array[i];
            if(childNode.nodeType == 1){
                getNode(childNode);
            }else if(childNode.nodeType == 3){
                var textContent=childNode.textContent;
                if(reg.test(String(textContent))){
                    if(exclude.get(childNode.parentElement.tagName)===1){
                        return;
                    }
                    let newTextContent=textContent.replace(reg,function(arg1,arg2,arg3,arg4){
                        let textContent='<a href="'+arg1+'" '+styleStr+' target="_blank">'+arg1+'</a>'
                        return textContent;
                    })
                    childNode.parentElement.innerHTML=newTextContent;
                    if(GM_getValue('transformation_count')==undefined){
                        GM_setValue('transformation_count', 1);
                    }else{
                        GM_setValue('transformation_count', GM_getValue('transformation_count')+1);
                    }
                }
            }
        }
    }
    console.log(href);
    window.onload = function() {
       setTimeout(()=>{
           var nodes = document.body;
           getNode(nodes);
           setInterval(function () {
               var newHref = window.location.href;
               if (newHref!==href) {
                   href=newHref;
                   setTimeout(()=>{
                       nodes = document.body;
                       getNode(nodes);
                   },500);
               }
           }, 500);
       },2000);
    }
})();