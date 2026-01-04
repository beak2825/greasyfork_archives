// ==UserScript==
// @name         屏蔽游民引战狗
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  引战狗滚出游民
// @author       cinemachine
// @match        www.gamersky.com/news/*
// @icon         https://www.google.com/s2/favicons?domain=gamersky.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429452/%E5%B1%8F%E8%94%BD%E6%B8%B8%E6%B0%91%E5%BC%95%E6%88%98%E7%8B%97.user.js
// @updateURL https://update.greasyfork.org/scripts/429452/%E5%B1%8F%E8%94%BD%E6%B8%B8%E6%B0%91%E5%BC%95%E6%88%98%E7%8B%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //要屏蔽用户的ID写在这里
    const banID = ["4769237","3374855"];
    // Your code here...
    var node = document.querySelector(".cmt_list_cont");

    var config = { attributes: false, childList: true, subtree: true };

    // 当观察到突变时执行的回调函数
    var callback = function(mutationsList) {


        mutationsList.forEach(function(item,index){
            //console.log(item.addedNodes);
            if (item.type == 'childList')
            {
                for(var i = item.addedNodes.length - 1; i >= 0; i-- )
                {
                   if(item.addedNodes[i].className === "cmt_cont")
                   {
                       var name = item.addedNodes[i].querySelector(".uname");
                       if(name != null)
                       {
                           var id = name.getAttribute("uid");
                           if(banID.indexOf(id) != -1)
                           {
                               item.addedNodes[i].remove(i);
                               continue;
                           }
                           var reply = item.addedNodes[i].querySelector(".cmt_list");
                           if(reply != null)
                           {
                               for(var j = reply.childNodes.length - 1; j >= 0; j--)
                               {
                                   var rname = reply.childNodes[j].querySelector(".uname");
                                   var rid = rname.getAttribute("uid");
                                   if(banID.indexOf(rid) != -1)
                                   {
                                       reply.childNodes[j].remove(j);
                                   }
                               }
                           }
                       }
                   }
                   else if(item.addedNodes[i].className === "cmt_reply_con")
                   {
                       var u = item.addedNodes[i].querySelector(".userlink");
                       var uid = u.getAttribute("uid");
                       if(banID.indexOf(uid) != -1)
                       {
                            item.addedNodes[i].remove(i);
                       }


                   }
                }
            }
        });
    };

    // 创建一个链接到回调函数的观察者实例
    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(node, config);


})();