// ==UserScript==
// @name 饭否-手机版同时回复多人
// @version 0.9
// @author HackMyBrain
// @description 解决 m.fanfou.com 上回复消息时默认只能回复该消息中单个人的问题
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2530/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E5%90%8C%E6%97%B6%E5%9B%9E%E5%A4%8D%E5%A4%9A%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/2530/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E5%90%8C%E6%97%B6%E5%9B%9E%E5%A4%8D%E5%A4%9A%E4%BA%BA.meta.js
// ==/UserScript==


(function (){
    var my_link = document.querySelector('a[accesskey="1"]').href;
    var textarea = document.getElementsByTagName('textarea')[0];

    function clearDuplicate(attr, NodeList, SingleNode) {
        var arr = [].slice.call(NodeList);
        if ( SingleNode != undefined ) {
            arr.unshift(SingleNode);
        }
        for(var i=0; i < arr.length; i++){
            for(var j=i+1; j < arr.length; j++) {
                if( arr[i][attr] === arr[j][attr] ) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }
    
    function saveNicknames(e) {
        if( !e.altKey && /^http\:\/\/m\.fanfou\.com\/msg\.reply\//i.test(e.target.href) ){
            var re_anchor = e.target;
            var target_post = re_anchor.parentElement.parentElement;
            var formers = target_post.getElementsByClassName('former');
            if(formers.length > 0) {
                var author = target_post.querySelector('a.p');
                if ( !author ) {
                    if ( /^\/mentions($|\/)/.test(location.pathname) ) {
                        author = target_post.firstElementChild;
                    }
                    else if ( /^\/statuses\//.test(location.pathname) ) {
                        author = document.querySelector('b > a');
                    }
                    else {
                        author = document.createElement('a');
                        author.href = location.pathname.match(/\/[^\/]+/)[0];
                        author.innerHTML = document.title.replace(/饭否 \| /,'');
                    }
                }
                var toBeReplied = clearDuplicate('href', formers, author);
                var nicknames = [];
                for(var i = 0; i < toBeReplied.length; i++){
                    if( toBeReplied[i].href != my_link ){
                        nicknames.push('@' + toBeReplied[i].innerHTML);
                    }
                }
                nicknames = nicknames.join(' ') + ' ';
                sessionStorage.setItem('_reply_helper_nicknames_', nicknames);
            }
        }
    }
    
    function outputNicknames() {
        textarea.value = sessionStorage.getItem('_reply_helper_nicknames_');
        sessionStorage.removeItem('_reply_helper_nicknames_');
    }
    
    document.addEventListener('click', saveNicknames, false);
    if ( /\/msg\.reply\//i.test(location.href) ) {
        if ( !!sessionStorage.getItem('_reply_helper_nicknames_') ) {
            outputNicknames();
        }
        textarea.focus();
        var len = textarea.value.length;
        textarea.setSelectionRange(len, len);
    }
})();