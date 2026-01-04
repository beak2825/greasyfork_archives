// ==UserScript==
// @name        知识星球页面美化-标注哪些是过期星球
// @description 知识星球页面美化，区分哪些是过期的星球,过期星球增加【已过期】标识，并且链接文字改成删除线格式
// @namespace   Violentmonkey Scripts
// @match        *://*.zsxq.com/*
// @grant       none
// @version     1.0
// @author      javajianghu
// @description 2024/12/23 17:54:15
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/521617/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96-%E6%A0%87%E6%B3%A8%E5%93%AA%E4%BA%9B%E6%98%AF%E8%BF%87%E6%9C%9F%E6%98%9F%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/521617/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96-%E6%A0%87%E6%B3%A8%E5%93%AA%E4%BA%9B%E6%98%AF%E8%BF%87%E6%9C%9F%E6%98%9F%E7%90%83.meta.js
// ==/UserScript==
(function () {

       // https://github.com/CoeJoder/waitForKeyElements.js
    function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
        if (typeof waitOnce === "undefined") {
            waitOnce = true;
        }
        if (typeof interval === "undefined") {
            interval = 300;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = -1;
        }
        var targetNodes = (typeof selectorOrFunction === "function")
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

        var targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                var attrAlreadyFound = "data-userscript-alreadyFound";
                var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    var cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    }
                    else {
                        targetNode.setAttribute(attrAlreadyFound, true);
                    }
                }
            });
        }

        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }

    var groupResp;
    update();

    function update(){
      getAllGroups("https://api.zsxq.com/v2/groups");
    }



    function getAllGroups(url){
      fetch(
            url,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json"
              }
            }
      )
      .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败，状态码：' + response.status);
            }
            return response.text();
      })
      .then(data => {
            //console.log(data);
            var resp = JSON.parse(data)
            if(resp.succeeded){
                let now = new Date();
                var resp_data = resp.resp_data;
                // console.log("resp_data",resp_data)
                var groups = resp_data.groups;
                // console.log("groups",groups)
                let endHrefs = [];
                groups.forEach(function (group){
                    if(group.user_specific && group.user_specific.validity && group.user_specific.validity.end_time){
                      var lastDay = new Date(group.user_specific.validity.end_time);
                      var endHref = "/group/" + group.group_id;
                      if(now > lastDay){
                          console.log("星球已过期：",group.name,"lastDay:",lastDay)
                          endHrefs.push(endHref);
                      }
                    }
                });
                if(endHrefs){
                    for (let ahref of endHrefs) {
                      waitForKeyElements('a[href="'+ahref+'"]', (aTag) => {
                           aTag.textContent = '✖[已过期]' + aTag.textContent;
                           // 通过style属性设置text-decoration为line-through来添加删除线样式
                           aTag.style.textDecoration = 'line-through';
                      }, false, 1000, 86400);
                    }
                }

            }else{
                console.log("resp",resp)
            }
       })
      .catch(error => {
            console.error(error);
       });
    }


}());