// ==UserScript==
// @name  饭否-给自己的消息添加转发按钮
// @version    1.1.0
// @author    HackMyBrain
// @description    （自从饭否官方原生支持转发自己的功能后此脚本不再适用。）在 fanfou.com 和 m.fanfou.com 添加转发自己消息的按钮, 除了支持 timeline 和「我的空间」的页面, 也支持自己相册中的图片页面、自己或别人的收藏页面、消息搜索结果页面. 其中转发自己相册图片的功能不支持 m.fanfou.com. 
// @include    http://fanfou.com/*
// @include    http://m.fanfou.com/*
// @exclude    http://fanfou.com/privatemsg
// @exclude    http://fanfou.com/privatemsg/*
// @exclude    http://m.fanfou.com/privatemsg
// @exclude    http://m.fanfou.com/privatemsg/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2531/%E9%A5%AD%E5%90%A6-%E7%BB%99%E8%87%AA%E5%B7%B1%E7%9A%84%E6%B6%88%E6%81%AF%E6%B7%BB%E5%8A%A0%E8%BD%AC%E5%8F%91%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/2531/%E9%A5%AD%E5%90%A6-%E7%BB%99%E8%87%AA%E5%B7%B1%E7%9A%84%E6%B6%88%E6%81%AF%E6%B7%BB%E5%8A%A0%E8%BD%AC%E5%8F%91%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function (){

    function addFWAnchorsMobile(start) {
        var del_span, fav_span, fw_span, fw_link;
        var del_anchors = document.querySelectorAll("a[href*='/msg.del/']");
        for(var i = start; i < del_anchors.length; i++){
            del_span = del_anchors[i].parentElement;
            fav_span = del_span.previousSibling.previousSibling;
            fw_link = del_anchors[i].href.replace(/\.del/i,'.forward');
            fw_span = del_span.cloneNode(true);
            fw_span.childNodes[0].href = fw_link;
            fw_span.childNodes[0].innerHTML = '转发';
            fw_span.childNodes[0].setAttribute('target', '_blank');
            var space = document.createTextNode(' ');
            del_span.parentElement.insertBefore(space, fav_span);
            del_span.parentElement.insertBefore(fw_span, space);
            mod_count = del_anchors.length;
        }
    };


    function addFWAnchorsDesktop() {
    
        var my_nickname = document.querySelector('#avatar img') || document.querySelector('.avatar > img');
        if (!!my_nickname) my_nickname = my_nickname.alt;
        
        var del_anchors = document.querySelectorAll("[class='op'] > a:last-child[href*='.del/']");

        
        var my_post, my_post_nickname, my_post_op, my_post_content, my_post_text, my_post_id;
        
        for (var i = 0, i_max = del_anchors.length; i < i_max; i++) {
            my_post_op = del_anchors[i].parentElement;
            my_post = my_post_op.parentElement;
            my_post_nickname = (!!my_post.querySelector('.author'))? my_post.querySelector('.author').innerHTML : my_nickname;
            my_post_id = my_post_op.querySelector("a[href*='/favorite.']").href.replace(/.+\//g, '');
            my_post_content = my_post.querySelector('.content');
            my_post_text = '';
            for (var j = 0, j_max = my_post_content.childNodes.length; j < j_max; j++) {
                my_post_text = my_post_text + ( my_post_content.childNodes[j].title || my_post_content.childNodes[j].textContent );
            }
            var fw_anchor = document.createElement('a');
            fw_anchor.href = '/home?status=' + encodeURIComponent( '转@' + my_post_nickname  + '+' + my_post_text ) + '&repost_status_id=' + my_post_id;
            fw_anchor.setAttribute('ffid', my_post_id);
            fw_anchor.setAttribute('text', '转@' + my_post_nickname + ' ' + my_post_text);
            fw_anchor.className = 'repost';
            fw_anchor.title  = '转发';
            fw_anchor.innerHTML  = '转发';
            my_post_op.appendChild(fw_anchor);
        }
        
    };
    
    function addFWAnchorsSearchresultsDesktop() {
        var checksearch = setInterval(function(){
            if (location.hash.indexOf('#search?q=') === 0) {
                if ( !!document.getElementById('save-search-link') ) {
                    addFWAnchorsDesktop();
                    clearInterval(checksearch);
                }
            }
        }, 300)
    };
    
    var pagi_href;
    function delayAddFWAnchorsDesktop () {
        if ( location.hostname == 'fanfou.com' ) {
            if (pagi_href != pagi.href) {
                pagi_href = pagi.href;
                addFWAnchorsDesktop();
                return pagi_href;
            } 
            else if ( location.hostname == 'm.fanfou.com' ) {
                setTimeout(delayAddFWAnchorsDesktop, 700);
            }
        }
    };    
    

    if ( location.hostname == 'fanfou.com' ) {
        addFWAnchorsDesktop();
        addFWAnchorsSearchresultsDesktop();
        window.addEventListener('hashchange', addFWAnchorsSearchresultsDesktop, false);
        
        var pagi = document.getElementById('pagination-more');
        if (!pagi) return false;
        
        pagi.addEventListener('click', function() {
            pagi_href = pagi.href;
            setTimeout(delayAddFWAnchorsDesktop, 700);
        }, false);
        
        var noti = document.getElementById('timeline-notification');
        noti.addEventListener('mouseup', function() {
            addFWAnchorsDesktop();
        }, false);
    }
    else if ( location.hostname == 'm.fanfou.com' ) {
        var mod_count = 0;
        addFWAnchorsMobile(mod_count);
        // 兼容免刷新翻页脚本
        var pagi = document.querySelector('[accesskey="6"]');
        if (pagi) {
            if ( !! window.MutationObserver ) { // for FF、Cr
                var observer = new MutationObserver(function(mutations){
                    mutations.forEach(function(){
                        addFWAnchorsMobile(mod_count);
                    });
                });
                var observer_config = {
                    'attributes' : true,
                    'attributeFilter' : ['href']
                };
                observer.observe(pagi, observer_config);
            }
            else {
                pagi.addEventListener('DOMAttrModified', function(e){ 
                    if ( 'attrChange' in event && event.attrName == 'href' ) {      
                        addFWAnchorsMobile(mod_count);
                    }
                }, false);                
            }
        }
    }
    
})();