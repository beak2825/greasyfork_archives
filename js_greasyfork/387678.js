// ==UserScript==

// @name         幕布-展开全部
// @namespace    ...
// @version      0.1
// @description  展开所有节点
// @include      https://mubu.com/doc*
// @author       Arno Lee
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/387678/%E5%B9%95%E5%B8%83-%E5%B1%95%E5%BC%80%E5%85%A8%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/387678/%E5%B9%95%E5%B8%83-%E5%B1%95%E5%BC%80%E5%85%A8%E9%83%A8.meta.js
// ==/UserScript==

(function() {
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
            // 排除样式节点
            if(node.className=="content-wrapper")
            {
               continue;
            }
            // 展开子节点
            if(node.className=="node collapsed")
            {
               node.className="node";
            }
            process(step,depth,node.childNodes);
        }
        -- step;
    }
    window.setTimeout(function() {
        process(1,4,document.getElementsByClassName("node-tree")[0].childNodes);
    }, 3000);
})();
