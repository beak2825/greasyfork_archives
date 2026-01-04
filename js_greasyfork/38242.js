// ==UserScript==
// @name        Twitter timestamp convert
// @namespace   mscststs
// @version      0.2
// @description  convert the time to exact time
// @author       mscststs
// @match        https://twitter.com/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38242/Twitter%20timestamp%20convert.user.js
// @updateURL https://update.greasyfork.org/scripts/38242/Twitter%20timestamp%20convert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatTime(date = new Date(), fmt = 'YYYY-MM-DD HH:mm:ss') {
        date = typeof date === 'string' ? new Date(date) : date;
        date = typeof date === 'number' ? new Date(date) : date;
        const o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds()
        };
        const week = {
            0: '\u65e5',
            1: '\u4e00',
            2: '\u4e8c',
            3: '\u4e09',
            4: '\u56db',
            5: '\u4e94',
            6: '\u516d'
        };
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (`${date.getFullYear()}`).substr(4 - RegExp.$1.length)
            );
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length > 1
                 ? RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468'
                 : '') + week[`${date.getDay()}`]
            );
        }
        for (const k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                    ? o[k]
                    : (`00${o[k]}`).substr((`${o[k]}`).length)
                );
            }
        }
        return fmt;
    };
    (async ()=>{
     await mscststs.wait("div#react-root");
    // 选择需要观察变动的节点
    const targetNode = document.querySelector("div#react-root");

    function setCode(){
        const nodes = [...document.querySelectorAll("time[datetime]")];
        nodes.forEach(node=>{
            if(node.settled){
                return;
            }
            node.settled = true;
            node.innerText = formatTime(new Date(node.dateTime))
            //console.log(node.dateTime,node.innerText)
        })
        // console.log(nodes)
        //console.log(">>>")
    }

    // 观察器的配置（需要观察什么变动）
    const config = { childList: true, subtree: true };

    // 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        setCode()
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
        setCode()
     })()

})();