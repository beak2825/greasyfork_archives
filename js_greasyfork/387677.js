// ==UserScript==

// @name         幕布-序号&统计
// @namespace    。。。
// @version      0.3
// @description  显示节点【对应层级】序号、统计子节点数量【忽略无子节点的节点】、BUG【偶尔不知原因的样式错乱】
// @include      https://mubu.com/doc*
// @author       Arno Lee
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/387677/%E5%B9%95%E5%B8%83-%E5%BA%8F%E5%8F%B7%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/387677/%E5%B9%95%E5%B8%83-%E5%BA%8F%E5%8F%B7%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
(function() {
    let nodeIndexMap = new Map(),nodeContenMap = new Map(),nodeChildsMap = new Map();
    function process(step,depth,nodeChilds)
    {
        if(step < depth)
        {
             ++ step;
        }
        let count=0;
        for (var i = 0; i< nodeChilds.length; i++)
        {
            let node = nodeChilds[i];
            if(node.className == "node" || node.className == "node collapsed" || node.className == "node finished collapsed")
            {
               nodeIndexMap.set(node.id,++count);
               nodeContenMap.set(node.id,node.firstChild.lastChild.innerHTML);
               if(node.lastChild.className=="children")
               {
                   nodeChildsMap.set(node.id,node.lastChild.childNodes.length);
               }
            }
            // 排除样式节点
            if(node.className=="content-wrapper")
            {
               continue;
            }
            process(step,depth,node.childNodes);
        }
        -- step;
    }
    window.setTimeout(function() {
        process(1,4,document.getElementsByClassName("node-tree")[0].childNodes);
        nodeIndexMap.forEach(function (value,key) {
            if(nodeContenMap.get(key)!="")
            {
                let ele = document.getElementById(key);
                if(nodeChildsMap.get(key))
                {
                    ele.firstChild.lastChild.innerHTML = '<span style=color:#007aff>('+nodeIndexMap.get(key)+') </span>' + nodeContenMap.get(key)+' <span style=color:#007aff>【'+nodeChildsMap.get(key)+'】</span>';
                }
                else
                {
                    ele.firstChild.lastChild.innerHTML = '<span style=color:#007aff>('+nodeIndexMap.get(key)+') </span>' + nodeContenMap.get(key);
                }
            }
        });
    }, 3000);
})();
