// ==UserScript==
// @name 饭否-手机版输入框字数限制提醒
// @author HackMyBrain
// @version 1.0.1
// @description m.fanfou.com 上在 消息/私信框 中输入时实时显示剩余字数限制(Presto-based Opera Classic for Android不能完整实现此功能, 必须让焦点离开输入框才能更新字数提醒); 发送超过140字的消息时弹出确认框.
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2528/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%BE%93%E5%85%A5%E6%A1%86%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/2528/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%BE%93%E5%85%A5%E6%A1%86%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==


(function(){

    var textarea = document.getElementsByTagName('textarea')[0];
    if ( ! textarea ) return;
    
    var form = document.getElementsByTagName('form')[0];
    var elem_show_len = document.createElement('p');
    elem_show_len.style.display = 'inline !important';
    elem_show_len.innerHTML = '允许继续输入字数: ';
    
    var len;
    
    function showLength() {
        if ( len == textarea.value.length ) {
            return;
        } else {
            len = textarea.value.length;
            if ( /\d+/.test(elem_show_len.innerHTML) ) {
                elem_show_len.innerHTML = elem_show_len.innerHTML.replace(/-?\d+/, 140 - len);           
            } else {
                elem_show_len.innerHTML += 140 - len;                
            }
            if ( len > 140 ) {
                elem_show_len.style.color = 'red';
            } else {
                elem_show_len.style.color = null;
            }
        }
    }

    form.appendChild(elem_show_len);
    
    textarea.addEventListener('input', showLength, false);
    
    form.addEventListener('submit', function(e){
        if (textarea.value.length > 140) {
            showLength();
            if ( ! confirm('消息字数已超过140，是否仍要发送？') ) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }, false);
    
    setTimeout(function(){
        showLength();  
    }, 500);

})();