// ==UserScript==
// @name 饭否-解决Opera Mobile Classic转发消息漏字问题
// @version 1.0.3
// @author HackMyBrain
// @description 解决 Opera Mobile Classic for Android 在 m.fanfou.com 上转发消息时在某些情况下缺字的问题
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2526/%E9%A5%AD%E5%90%A6-%E8%A7%A3%E5%86%B3Opera%20Mobile%20Classic%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E6%BC%8F%E5%AD%97%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/2526/%E9%A5%AD%E5%90%A6-%E8%A7%A3%E5%86%B3Opera%20Mobile%20Classic%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E6%BC%8F%E5%AD%97%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==


(function (){
    //获取目标消息内容并保存
    function saveFWContent(e){
        if ( /\/msg\.forward\//.test(e.target.href) && e.target.innerHTML == '转发' ){
            var target_post, author;
            var post_content, postChildNode;
            if ( /^\/photo\//.test(location.pathname) ) {
                author = document.querySelector('h2 > a').textContent;
                target_post = document.querySelector('span.t').parentElement.firstChild.textContent;
                post_content = author + ' ' + target_post;
            }
            else {
                target_post = e.target.parentElement.parentElement;
                if ( /^\/statuses\//.test(location.pathname) ) { // 消息 statuses 页
                    author = document.querySelector('b > a');
                    post_content = '';
                    postChildNode = author.parentElement;
                    // author = document.querySelector('b > a').textContent;
                    // target_post = document.querySelector('b > a').parentElement.textContent;
                    // post_content = target_post;
                }
                else { // 首页、别人的空间页、自己的 mentions 页
                    post_content = ( target_post.getElementsByClassName('p').length != 0 || /^\/mentions($|\/)/.test(location.pathname) )? '' : document.title.replace(/饭否 \| /,'') + ' ';
                    // 在单一饭er消息页上需要在获取的消息内容开头补充昵称（昵称从 document.tilte 获取）
                    postChildNode = target_post.firstChild;
                }
                while ( postChildNode.className != 'stamp' && postChildNode.className != 't') {
                    console.log(postChildNode.data.textContent)
                    post_content += (!postChildNode.title)? postChildNode.textContent : postChildNode.title;
                    postChildNode = postChildNode.nextSibling;
                }
                var mystery_space = new RegExp(decodeURIComponent('%C2%A0'), g); // statuses 页面的消息中如果有图片, 会有一个神秘空格导致at不到
                post_content = post_content.replace(mystery_space, '\x20');
            }
            var mes_content = '转@' + post_content;
            sessionStorage.setItem('_fw_fixer_', mes_content);
        } 
        // e.preventDefault();
    }
    
    //私信框填入消息内容 & 光标定位于私信框开端(光标定位在Opera Mobile Classic下不成功)
    function fillFWContent() {
        if ( /\/msg\.forward\//.test(location.pathname) && !! sessionStorage.getItem('_fw_fixer_') ) {
            var textarea = document.getElementsByTagName('textarea')[0];
            textarea.value = ' ' + sessionStorage.getItem('_fw_fixer_'); //填写消息内容并在开头自动添加空格
            sessionStorage.removeItem('_fw_fixer_');
            textarea.focus();
            textarea.setSelectionRange(0,0); //光标定位于输入框开端
        }
    }

    document.addEventListener('click', saveFWContent, false);
    fillFWContent();
})();