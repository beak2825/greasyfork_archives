// ==UserScript==
// @name         rfc toc
// @namespace    http://yurenchen.com/
// @version      0.4
// @description  rfc add toc sidebar
// @author       yurenchen
// @match        https://tools.ietf.org/html/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27913/rfc%20toc.user.js
// @updateURL https://update.greasyfork.org/scripts/27913/rfc%20toc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function appendScript(url,cb){
        var e=document.createElement('script');
        e.src=url;
        e.onload=cb;
        document.body.appendChild(e);
    }
    function appendCss(url){
        var e=document.createElement('link');
        e.rel="stylesheet";
        e.href=url;
        document.body.appendChild(e);
    }
    function appendTag(tag, prop){
        var e=document.createElement(tag);
        for(var k in prop){
            if(typeof(k)=="string" )//&& typeof(prop[k])=="string")
                e[k]=prop[k];
            console.log(k,prop[k]);
        }
        document.body.appendChild(e);
        return e;
    }
    //加载资源文件
    /*
    appendCss("http://note.yurenchen.com/usr/themes/chen/zTreeStyle.css");
    appendScript("http://note.yurenchen.com/usr/themes/chen/jquery-1.4.4.min.js");
    appendScript("http://note.yurenchen.com/usr/themes/chen/jquery.ztree.core-3.5.js");
    appendScript("http://note.yurenchen.com/usr/themes/chen/ztree_toc.js");
    */
    /*
    appendCss("https://raw.githubusercontent.com/yurenchen000/i5ting_ztree_toc/master/css/zTreeStyle/zTreeStyle.css");
    appendScript("https://raw.githubusercontent.com/yurenchen000/i5ting_ztree_toc/master/js/jquery-1.4.4.min.js");
    appendScript("https://raw.githubusercontent.com/yurenchen000/i5ting_ztree_toc/master/js/jquery.ztree.core-3.5.js");
    appendScript("https://raw.githubusercontent.com/yurenchen000/i5ting_ztree_toc/master/src/ztree_toc.js");
    */

    /*
        //cdn remove 'nosniff' and fix 'mime type' from https://raw.githack.com/
    appendScript("https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/js/jquery-1.4.4.min.js", load_cb1);
    function load_cb1(){
        appendScript("https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/js/jquery.ztree.core-3.5.js", load_cb2);
    }
    function load_cb2(){
        appendScript("https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/src/ztree_toc.js", load_cb3);
    }
    function load_cb3(){
        init_toc();
    }
    appendCss("https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/css/zTreeStyle/zTreeStyle.css");
    */
/*
    var url_jq   ='https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/js/jquery-1.4.4.min.js';
    var url_ztree='https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/js/jquery.ztree.core-3.5.js';
    var url_toc  ='https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/src/ztree_toc.js';
    var url_css  ='https://rawcdn.githack.com/yurenchen000/i5ting_ztree_toc/master/css/zTreeStyle/zTreeStyle.css';
*/

    //var domain = 'https://rawcdn.githack.com';
    //var domain = 'https://cdn.rawgit.com';
    var domain = 'https://rawgit.com';
    var url_jq   = domain+'/yurenchen000/i5ting_ztree_toc/master/js/jquery-1.4.4.min.js';
    var url_ztree= domain+'/yurenchen000/i5ting_ztree_toc/master/js/jquery.ztree.core-3.5.js';
    var url_toc  = domain+'/yurenchen000/i5ting_ztree_toc/master/src/ztree_toc.js';
    var url_css  = domain+'/yurenchen000/i5ting_ztree_toc/master/css/zTreeStyle/zTreeStyle.css';

    //cdn remove 'nosniff' and fix 'mime type' from https://raw.githack.com/
    appendScript(url_jq, load_cb1);
    function load_cb1(){
        appendScript(url_ztree, load_cb2);
    }
    function load_cb2(){
        appendScript(url_toc, load_cb3);
    }
    function load_cb3(){
        init_toc();
    }

    appendTag('div', {id:'tree',innerHTML:'&nbsp; TOC loading...&nbsp;', style:'position: fixed; top:0px; right:0px; border:1px solid gray; height:100%;'});
    appendCss(url_css);

    appendTag('style',{innerHTML:'#tree a:hover { text-decoration: underline; color: green;} #tree a {text-decoration: none;} #tree a.curSelectedNode {color: red; text-decoration: underline;}',onload:window.style_load_ok});
    function style_load_ok(){
        console.log('style_load_ok ...');
    }


    //生成目录树
    function init_toc(){
        //生成目录树
        $('#tree').ztree_toc({
            _header_nodes:[{ id:1, pId:0, name:"Table of Content",open:true, url:'#legend', target: "_self" }],
            debug: false,
            is_auto_number: false,
            refresh_scroll_time: 10,
            scroll_selector: window,
            documment_selector:'div.content',
            ztreeStyle: {
                //width:'262px',
                overflow: 'auto',
                'z-index': 10
            }
        });

        //滚动同步, 内容滚动时, TOC 当前章节 滚入视野
        window.onscroll=function(){
            //var top=document.body.scrollTop||window.scrollTop||window.scrollY||window.pageYoffset;
            if(typeof debug_offset != 'undefined')document.title=[top, $(window).scrollTop()];
            var o=$('#tree .curSelectedNode')[0];
            if(o)o.scrollIntoViewIfNeeded();
            //console.log('onscroll:'+[top, tree.style.position, $(window).scrollTop()]);
        };
        window.onscroll();
    }

    window.onload=function(){
        adjust_spacer_height();
    };
    window.onresize=function(){
        adjust_spacer_height();
    };
    function adjust_spacer_height(){
        var last=$(':header:last')[0];
        if(!last)return;
        var lack_len = document.body.clientHeight- (document.body.offsetHeight - last.offsetTop) + 10;
        spacer.style.height=lack_len+'px';
    }

    //阻止 TOC 滚动时 body 被滚动
    //http://stackoverflow.com/questions/5802467/prevent-scrolling-of-parent-element
    //http://stackoverflow.com/questions/4326845/how-can-i-determine-the-direction-of-a-jquery-scroll-event
    var lastScrollTop = 0;
    tree.onscroll=function(e){
        e.stopPropagation();
        e.preventDefault();
        e.cancelBubble= true;
        e.returnValue = false;

        var scrollTop = $(this).scrollTop();
        var pad=2;
        if (scrollTop > lastScrollTop){//down
            if(tree.scrollTop + tree.offsetHeight + 10 >= tree.scrollHeight)
                tree.scrollTop=tree.scrollHeight - tree.offsetHeight - pad;
        } else {//up
            if(tree.scrollTop <= 10)
                tree.scrollTop=pad;
        }
        lastScrollTop = scrollTop;
        return false;
    };

})();