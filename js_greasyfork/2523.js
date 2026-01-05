// ==UserScript==
// @name Fanfou Forward Without Mentioning Myself
// @version 1.0.5
// @author HackMyBrain
// @description 饭否上转发消息时避免at到自己
// @include http://fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2523/Fanfou%20Forward%20Without%20Mentioning%20Myself.user.js
// @updateURL https://update.greasyfork.org/scripts/2523/Fanfou%20Forward%20Without%20Mentioning%20Myself.meta.js
// ==/UserScript==


(function (){
    var mylink = document.querySelector('#navigation ul > li:nth-of-type(2) > a'); //获取"我的空间"元素,用于后续判断消息中的超链接
    try{
        var fw_textarea = document.getElementById('PopupForm').getElementsByTagName('textarea')[0];
    } catch(err) {
        return;
    }
    
    var fwReplacer = function (e){
        if ( e.target.tagName.toLowerCase() === 'a' && e.target.className === 'repost' ){
            var text = e.target.getAttribute('text');
            var fw_nickname = text.match(/@\S+/)[0]; // 获取被直接转发的饭er的昵称
            var content = e.target.parentElement.parentElement.getElementsByClassName('content')[0];
            var context_text = ' ';
            var content_child;
            for(var i = 0; i < content.childNodes.length; i++){
                content_child = content.childNodes[i];
                if ( content_child.nodeType === 3 || content_child.tagName.toLowerCase() === 'strong' || content_child.className === 'former' || content_child.className === 'nickquery' || ( !!content_child.href && content_child.href.indexOf('http://fanfou.com/q/') === 0 ) ) {
                    if ( content_child.className === 'former' && content_child.href === mylink.href ) { // 消息中at到自己的部分
                        context_text += content_child.textContent + '\n';
                    } else { // 普通文本、at不到的人、at得到的别人
                        context_text += content_child.textContent;
                    }
                } else if ( content_child.getAttribute('rel') === 'nofollow' ){ // 消息中夹带的超链接
                    context_text += content_child.getAttribute('title');
                }
            }
            // context_text = context_text.replace(/^\x20{2}/, '\x20'); // 带有图片的消息, content_child 中的 text 节点开头有多余的空格(饭否本身的问题), 应去掉
            setTimeout(function(){
                if ( e.target.parentElement.querySelectorAll(".delete, a[href*='/photo.del/'][class='post_act']").length != 0 ) {  
                //通过检测是否有删除按钮, 判断所直接转发的是否自己的消息. a[href*='/photo.del/'][class='post_act'] 是自己相册页面的删除按钮
                    fw_textarea.value = ('转' + fw_nickname + '\n' + context_text).replace(/\n\x20/g,'\n');
                } else {
                    fw_textarea.value = ('转' + fw_nickname + context_text).replace(/\n\x20/g,'\n');
                }
            },30);
            setTimeout(function(){fw_textarea.setSelectionRange(0,0)}, 60); // 光标定位到消息框开头
        }
    }
    
    document.addEventListener('click', fwReplacer, false);
})();