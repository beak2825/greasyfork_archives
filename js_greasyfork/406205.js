// ==UserScript==
// @name         Enter_login
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为大多数网页添加enter登录的方式
// @author       kakasearch
// @include      *://**/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406205/Enter_login.user.js
// @updateURL https://update.greasyfork.org/scripts/406205/Enter_login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //遍历dom，检查有无登录、login关键词的元素
    let debug = 0
    function info(){
        if(debug){
            const arg = Array.from(arguments);
            arg.unshift(`color: white; background-color:#2274A5`);
            arg.unshift('%c Enter_login:');
            console["info"].apply(console, arg);
        }
    }
    const BFS = {
        nodes: [],
        do (roots) {
            var children = [];
            for (let i = 0;i < roots.length;i++) {
                var root = roots[i];
                if((/登.*录/gi.exec(root.innerText) || /log.*in/gi.exec(root.innerText) || (root.value && /登.*录/gi.exec(root.value) ) ) && root.innerText.replace(/[ \f\n\r\t\v]/g,'').length<=5 && /[?？]/gi.exec(root.innerText) ==null ){
                    this.nodes.push(root);
                }
                // 过滤 text 节点、script 节点
                if (root.childNodes.length) children.push(...root.childNodes);
            }
            if (children.length) {
                this.do(children);
            }
            return this.nodes;
        }
    }
    let login_btn
    let login_nodes = BFS.do(document.body.childNodes)
    info(login_nodes)
    if(login_nodes.length){
        login_btn = login_nodes[login_nodes.length-1]
        info('找到最小登录节点',login_btn)
    }else{
        login_btn = null
        info('无登录节点')
    }

    //给登录按钮添加侦听 login_btn
    if(login_btn){
        document.onkeydown = function(ev){
            var e = ev || event;
            if(e.keyCode ==13){
                info('clicking')
                login_btn.click();
            };
        }
    }

    // Your code here...
})();