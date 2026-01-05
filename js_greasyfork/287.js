// ==UserScript==
// @name       Tieba Quick Post
// @version    1.0.1
// @description  Press Ctrl + Enter to post a thread / comment on Tieba.
// @match      http://tieba.baidu.com/*
// @author     864907600cc
// @namespace https://greasyfork.org/users/141
// @downloadURL https://update.greasyfork.org/scripts/287/Tieba%20Quick%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/287/Tieba%20Quick%20Post.meta.js
// ==/UserScript==

var node,button;
function add_event(){
    node=document.getElementById('ueditor_replace'),button=document.getElementsByClassName('poster_submit')[0];
    node.onfocus=function(){
        node.onkeydown=post_t;
    }
    node.onblur=function(){
        node.onkeydown=false;
    }
}
function post_t(event){
    if (event.ctrlKey==1&&event.keyCode==13) button.click();
}

if(document.getElementById('ueditor_replace'))add_event();
else {
	var editor_wait=window.setInterval(function(){
		if(document.getElementById('ueditor_replace')){
			window.clearInterval(editor_wait);
			add_event();
		}
	},100)
}