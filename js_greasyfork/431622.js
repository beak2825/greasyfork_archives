// ==UserScript==
// @name         zhihu timeline remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎timeline本地黑名单
// @author       You
// @match        https://www.zhihu.com/follow
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431622/zhihu%20timeline%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/431622/zhihu%20timeline%20remove.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zhihuids = localStorage.getItem("zhihuids");
    if(!zhihuids){
        localStorage.setItem("zhihuids",JSON.stringify(new Array()));
        zhihuids = "[]";
    }
    zhihuids = JSON.parse(zhihuids);


    window.jQuery360 = $.noConflict(true);

    function removecb(){
    jQuery360("div.Feed").dblclick(function(){
        //alert(this);
        var dataextra = JSON.parse(jQuery360(this).attr("data-za-extra-module"));

        //var result = prompt("hide:"+dataextra["card"]["content"]["token"],"yes");
        //console.log(result);
       // if(result == "yes"){
            //jQuery360(this).remove();
        var cctoken = dataextra["card"]["content"]["token"];
        if(zhihuids.indexOf(cctoken)==-1){
            zhihuids.push(cctoken);
            localStorage.setItem("zhihuids",JSON.stringify(zhihuids));
            jQuery360(this).parent().remove();
        }
       // }
    })
    setTimeout(function(){
    jQuery360("div.Feed").each(function(){
        //console.log(jQuery360(element).children().attr("data-za-extra-module"));
        //console.log(jQuery360(this))
        //console.log(jQuery360(this).attr("data-za-extra-module"));
        var tmpid = JSON.parse(jQuery360(this).attr("data-za-extra-module"))["card"]["content"]["token"];
        if(zhihuids.indexOf(tmpid)>=0){
            jQuery360(this).parent().remove();
        }
        //console.log(jQuery360(this).children().attr("data-za-extra-module"))
    }
                              );
    },3000);
    }
    const targetNode = document.body;

// 观察器的配置（需要观察什么变动）
    const config = { /* attributes: true,*/ childList: true /*, subtree: true */ };

// 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            //console.log(mutation);
            if (mutation.type === 'childList') {
                //console.log('A child node has been added or removed.');
                if(mutation.addedNodes.length > 0){
                    removecb();
                }

            }
          /*  else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }*/
        }
    };

// 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
    observer.observe(targetNode, config);

    // Your code here...
})();