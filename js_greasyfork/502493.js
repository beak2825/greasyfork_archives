// ==UserScript==
// @name         🔥拓展增强🔥妖火黑名单
// @namespace    https://www.dlsite.cn
// @version      0.15
// @description  妖火网黑名单增强
// @author       大郎
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502493/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502493/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%E5%A6%96%E7%81%AB%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(typeof window.addShadowIfWidthGreaterThan200 == 'undefined'){
        window.addShadowIfWidthGreaterThan200 = function (){}
    }

    // 黑名单列表
    const a = [
        { uid: 116379999, uname: 'Leesin' },
        { uid: 222609999, uname: 'Leesin' },
    ];

    const fieldStr = ['速度', '车', '肉'];

    const blackfieldFuzzy = ['感谢分享', "吃肉"];

    let blackfield = ["恭喜","潜水","nb",
           "谢了",
           "谢谢",
           "谢",
           "吃肉",
           "吃肉肉",
          "吃",
           "c",
           "666",
           "6",
           "7",
           "围观",
          "chi",
          "吃",
          "吃吃",
          "吃吃.",
          "吃吃。",
          "吃吃..",
          "吃吃。。",
          "吃了",
          "吃肉",
          "肉",
          "肉肉",
          "来吃肉",
          "吃.",
          "吃。",
          "吃了.",
          "吃了。",
          "吃肉.",
          "吃肉。",
          "吃吃吃",
          "吃吃吃。",
          "来吃肉.",
          "吃肉了",
          "来吃肉。",
          "口乞",
          "吃..",
          "吃。。",
          "吃了..",
          "吃了。。",
          "吃肉..",
          "吃肉。。",
          "来吃肉..",
          "来吃肉。。",
          "口乞了",
          "口乞了.",
          "口乞了。",
          "口乞肉",
          "口乞肉.",
          "口乞肉。",
          "口乞..",
          "口乞。。",
          "chile..",
          "chile。。",
          "7肉..",
          "7肉。。",
          "7了..",
          "7了。。",
          "肉肉肉",
          "肉肉肉.",
          "肉肉肉。",
          "肉肉肉..",
          "肉肉肉。。",
          "先吃肉",
          "先吃肉.",
          "先吃肉。",
          "先吃肉..",
          "先吃肉。。",
          "谢谢分享","感谢楼主","冲","厉害","777","我吃","过","吃吃吃","6","666","66","哦","77","777","来了","看看","先吃","1","打卡",
          "吃咯","食", "发财","牛逼","羡慕","冲冲冲","吃了…","回血","插眼","肉🥩","吃🥩"
        ];

    function isInArray(arr, key) {
        return arr.some(item => item.uid === key || item.uname === key);
    }

    function getTouserid(str){
        var match = /touserid=(\d+)/.exec(str);
        if (match != null && match[1] !== undefined) {
            return parseInt(match[1]);
        }
        return '';
    }

    function filterTList(listElem){
        let tlist = document.querySelectorAll(listElem);
        tlist.forEach((v,k)=>{;
            var match = /\n\s*(.*?)\s*\/\d+/.exec(v.innerText);
            if(match != null && match[1] !== undefined && a.some(item => item.uname === match[1].trim())){
                v.style.display = "none";
            }
            let ttile = v.querySelector('a.topic-link').innerText;
            fieldStr.forEach(field=>{
                if(ttile.includes(field)){
                     v.style.background = "#ffcefe91";
                }
            });
        });
    }
    // 过滤帖子列表
    filterTList(`.listdata`);

    function filterRList(listElem){
        let tlist = document.querySelectorAll(listElem);
        tlist.forEach((v,k)=>{
            var rauthor = v.querySelector('.renick a');
            let uid = getTouserid(rauthor.href);
            let replyContent = v.querySelector('.retext').innerText;
            replyContent = replyContent.replace("回复+1","");
            if(uid && a.some(item => item.uid === uid)){
                v.style.display = "none";
            }else if(blackfieldFuzzy.some(item => replyContent.includes(item)) || blackfield.some(item => replyContent.trim() === item)){
                v.style.display = "none";
            }
        });
    }
    // 过滤回帖列表
    filterRList(`div.reline`);

    let louzhu = document.querySelector('.louzhunicheng a');
    if(louzhu && louzhu.href){
        let uid = getTouserid(louzhu.href);
        if(a.some(item => (uid &&item.uid === uid) || item.uname === louzhu.innerText.trim())){
            document.querySelector('.bbscontent').innerHTML = '<div style="border: 1px dotted red; text-align: center; color: red; font-weight: 700;">插件提醒：已被你加入 黑名单 了</div>';
            let curu = a.find(obj => obj.uid === uid);
            if(curu && louzhu.innerText.trim() != curu.uname){
                curu.uname = louzhu.innerText.trim();
            }
        }
    }

    var originalFunction = window.KL_CallBack;
    window.KL_CallBack = function() {
        originalFunction.apply(this, arguments);
        filterTList(`#KL_show_next_list>.listdata`);
    };


    //var originalFunction2 = window.YH_CallBack;
    //window.YH_CallBack = function() {
    //    originalFunction2.apply(this, arguments);
    //    //debugger;
    //    filterRList(`.recontent>.list-reply`);
    //};

    // 目标容器：.recontent
    const contentContainer = document.querySelector('.recontent');

    // 确保容器存在
    if (contentContainer) {
        // 创建 MutationObserver 实例
        const observer = new MutationObserver(mutationsList => {
            // 处理每个 mutation
            for (const mutation of mutationsList) {
                // 只处理子节点变化（添加/删除）
                if (mutation.type === 'childList') {
                    console.log('内容已变化，调用 filterRList...');
                    filterRList('.recontent>.list-reply');
                    break; // 触发一次即可，避免重复调用
                }
            }
        });

        // 配置观察选项
        const config = {
            childList: true,        // 监听子节点变化
            subtree: true,          // 监听所有后代节点
            attributes: false,      // 不监听属性变化
            characterData: false    // 不监听文本内容变化
        };

        // 开始观察
        observer.observe(contentContainer, config);
    }

})();