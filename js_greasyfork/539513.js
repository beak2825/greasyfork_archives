// ==UserScript==
// @name         哔哩哔哩 评论分享永久链接
// @version      2025.06.15
// @description  每条评论都会显示该评论的永久链接，可以用于分享评论给他人或者自行保留以后免翻页回看。默认左击新窗口打开，右击菜单复制链接。
// @namespace    https://greasyfork.org/users/159546
// @author       LEORChn
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bilibili.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/539513/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%E8%AF%84%E8%AE%BA%E5%88%86%E4%BA%AB%E6%B0%B8%E4%B9%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/539513/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%E8%AF%84%E8%AE%BA%E5%88%86%E4%BA%AB%E6%B0%B8%E4%B9%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(()=>{
    setInterval(()=>{
        if(!location.pathname.startsWith('/video/')) return;
        $$("#commentapp > bili-comments").shadow("#feed > bili-comment-thread-renderer").shadow("#comment")
            .shadow("bili-comment-action-buttons-renderer:not([leorchn-comment-permalink])").forEach(e=>{
            var j = e.getRootNode().host.__data;
            if(!j || !j.rpid) return;
            var a = ct('a', '永久链接');
            a.href = location.origin + location.pathname + '#reply' + j.rpid;
            a.target = '_blank';
            var div = ct('div');
            div.style.cssText = 'text-align: right; flex: 1; padding-right: 1em;';
            div.appendChild(a);
            e.shadowRoot.insertBefore(div, e.shadowRoot.querySelector('#more'));
            e.setAttribute('leorchn-comment-permalink', '');
        });
    }, 1e3);
    function ct(e, t){
        var a;
        if(e){
            a = document.createElement(e);
            if(t !== void 0) a[e == 'input'? 'value': 'innerText'] = t;
        }else{
            a = document.createTextNode(t);
        }
        return a;
    }
    function $$(e){
        return factory(document.querySelectorAll(e));
        function factory(e){
            e = Array.from(e);
            e.shadow = shadow;
            e.has = has;
            return e;
        }
        function shadow(e){ // 将数组中的每个元素都替换为该元素的阴影空间中符合要求的子元素。如果甚至无法在阴影空间中找到符合要求的子元素，原元素会自然消亡
            return factory(this.map(elem=>{
                return factory(elem.shadowRoot.querySelectorAll(e));
            }).flat());
        }
        function has(e){ // 确保数组中的每个元素都有符合相应条件的子元素，如果某个元素没有任何符合要求的子元素则被筛选掉
            return factory(this.filter(elem=>{
                return elem.querySelectorAll(e).length;
            }));
        }
        function is(e){ // alias: any // 将数组中的每个元素替换为该元素的多个符合要求的子元素。如果甚至无法找到符合要求的子元素，原元素会自然消亡
            return factory(this.map(elem=>{
                return factory(elem.querySelectorAll(e));
            }).flat());
        }
    }
})();
