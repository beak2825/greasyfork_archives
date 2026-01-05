// ==UserScript==
// @name        Reddit Overwrite
// @namespace   Reddit
// @description Overwrites your Reddit comments to protect people from stalking, doxxing, and profiling you. Also, Reddit does not truly delete anything, but since they don't keep versions this better protects you. To use it, login to Reddit, click your username, go to comments, click on the OVERWRITE button. It is MUCH more efficient if you use RES and scroll to your oldest comment. If you are migrating accounts, you can move your subs by going to reddit.com/subreddits, and copying the link on the right.
// @include     https://*.reddit.com/*
// @include     http://*.reddit.com/*
// @version     1.4.4
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/27889/Reddit%20Overwrite.user.js
// @updateURL https://update.greasyfork.org/scripts/27889/Reddit%20Overwrite.meta.js
// ==/UserScript==


unsafeWindow.to_delete = [];
unsafeWindow.num_user_comments = 0;
unsafeWindow.deleted = 0;
unsafeWindow.span = '';
unsafeWindow.user = '';


unsafeWindow.delete_comment = function(thing_id, from_delete_all)
{
 try{
	var thing = document.querySelector("input[name='thing_id'][value='" + thing_id + "']");


	var status = thing.parentNode.querySelector("div.usertext-edit > div.bottom-area > div.usertext-buttons > span.status").innerHTML;

	var error = false;
	if ((status.indexOf("error") != -1) || (status.indexOf("submitting") != -1)){
		error = true;
	} else {
//		var del_form = thing.parentNode.parentNode.querySelector("ul.buttons > li > form.del-button");
//		unsafeWindow.toggle(del_form.querySelector("span.main > a"));
//		del_form.querySelector("span.error > a.yes").click();
		unsafeWindow.deleted++;
	}

	if (from_delete_all){
		if (unsafeWindow.to_delete.length != 0)
		{
			unsafeWindow.span.innerHTML = "OVERWRITING COMMENT " + (unsafeWindow.deleted + 1) + " OF " + unsafeWindow.num_user_comments;
			var next_thing_id = unsafeWindow.to_delete.pop();
			unsafeWindow.setTimeout(unsafeWindow.overwrite_comment, 2000, next_thing_id, from_delete_all);
		}
		else
		{
			if (unsafeWindow.num_user_comments - unsafeWindow.deleted != 0){
				unsafeWindow.num_user_comments = unsafeWindow.num_user_comments - unsafeWindow.deleted;
				UpdateDeleteAllSpan();
				unsafeWindow.span.innerHTML = "<span>Failed to overwrite " + unsafeWindow.num_user_comments + " comments</span><br>" + unsafeWindow.span.innerHTML;
			} else
				unsafeWindow.span.style.display = 'none';

		}
	} else {
		if (error)
			alert("Failed to overwrite your comment. Overwrite aborted.");
		else
			unsafeWindow.num_user_comments--;
		UpdateDeleteAllSpan();
	}
	return (error ? -1 : 0);
 }catch(er){
	alert(er);
	if (from_delete_all) unsafeWindow.location.reload();
	return -99;
 }
}

unsafeWindow.overwrite_comment = function(thing_id, from_delete_all)
{
 try{
	var edit_form = document.querySelector("input[name='thing_id'][value='" + thing_id + "']").parentNode;

	edit_form.querySelector("div.usertext-edit > div.bottom-area > div.usertext-buttons > button.cancel").click();


	var edit_btn = edit_form.parentNode.querySelector("ul > li > a.edit-usertext");
	if (edit_btn) edit_btn.click();
	var edit_textbox = edit_form.querySelector("div.usertext-edit > div > textarea");
	var repl_str = '';
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz><.-,+!#$%^&*();:[]~";
//	for(var x = 0; x < edit_textbox.value.length; x++){
//		if (edit_textbox.value.substr(x,1) == '\n'){
//			repl_str += '\n';
//		}else{
//			var rnum = Math.floor(Math.random() * chars.length);
//			repl_str += chars.charAt(rnum, 1);
//		}
//	}
        var sumting = '^^^^^^^^^^^^^^^^' + Math.random();
        var sumtingtr = sumting.substring(0,22);

        var sumting2 = '' + Math.random();
        var sumtingtr2 = sumting2.substring(2,7);


	edit_textbox.value = "[deleted]";

    edit_form.querySelector("div.usertext-edit > div.bottom-area > div.usertext-buttons > button.save").click();
	unsafeWindow.setTimeout(unsafeWindow.delete_comment, 2000, thing_id, from_delete_all);
	return 0;
 }catch(e){
	alert("Error interacting with overwrite form: " + e); 
	return -99;
 }
};


unsafeWindow.delete_all = function()
{
 try{
	unsafeWindow.num_user_comments = 0;
	unsafeWindow.deleted = 0;
	unsafeWindow.to_delete = [];
	var comments = document.querySelectorAll("a.author");
	
    for (var i = 0; i < comments.length; i++)
	{
		if (comments[i].innerHTML != unsafeWindow.user) continue;
		var thing_id = comments[i].parentNode.parentNode.querySelector("form.usertext > input[name='thing_id']").value;
		if (unsafeWindow.to_delete.indexOf(thing_id) == -1){
			unsafeWindow.to_delete.push(thing_id);
			unsafeWindow.num_user_comments++;
		}
	}
     
	unsafeWindow.span.innerHTML = "TRYING TO Overwrite COMMENT 1 OF " + unsafeWindow.num_user_comments;
	var next_thing_id = unsafeWindow.to_delete.pop();
	unsafeWindow.overwrite_comment(next_thing_id, true);
 } catch(e){
    alert("YOU ARE MOST LIKELY NOT ON THE COMMENTS TAB! /n/n Error trying to delete all your comments.\nError: " + e + " Stack:" + e.stack); 
	unsafeWindow.location.reload()
 }
};

function add_delete_links(ev)
{
	unsafeWindow.user = document.querySelector("span.user > a:not(.login-required)").innerHTML;
	if (!unsafeWindow.user){return;}
	var comments = document.querySelectorAll("a.author");
	unsafeWindow.num_user_comments = 0;
	for (var i = 0; i < comments.length; i++)
	{
		if (comments[i].innerHTML != unsafeWindow.user) continue;
	 try{
		var main_parent = comments[i].parentNode.parentNode;
		var thing_id = main_parent.querySelector("form > input[name='thing_id']").value;
		var list = main_parent.querySelector("ul.flat-list");
		if (list.querySelector("li.secure_delete")) continue;
		unsafeWindow.num_user_comments++;

		var addedlink = document.createElement("li");
		addedlink.setAttribute('class', 'secure_delete');
		var dlink = document.createElement("a");
		dlink.setAttribute('class','bylink secure_delete');
		dlink.setAttribute('onClick','javascript:var ret = overwrite_comment("' + thing_id + '", false);');
		dlink.setAttribute('href', 'javascript:void(0)');
//		dlink.appendChild(document.createTextNode('SECURE DELETE'));
		addedlink.appendChild(dlink);
		main_parent.querySelector("ul.flat-list").appendChild(addedlink);
	 }catch(e){}
	}

	unsafeWindow.span = document.createElement("span");
	unsafeWindow.span.setAttribute('class', 'nextprev secure_delete_all');
	UpdateDeleteAllSpan();
	
}

function UpdateDeleteAllSpan()
{
	if (unsafeWindow.num_user_comments){
		unsafeWindow.span.innerHTML = "";
		var dlink = document.createElement("a");
		dlink.setAttribute('class','bylink');
		dlink.setAttribute('onClick','javascript:return delete_all()');
		dlink.setAttribute('href', 'javascript:void(0)');
		dlink.appendChild(document.createTextNode('OVERWRITE ALL visible comment(s) on this page - MAKE SURE YOU ARE ON THE COMMENTS TAB.  It is also HIGHLY recommended to use Reddit Enhancement Suite with the Never Ending Reddit feature to extend the comments as far down as possible.'));
		unsafeWindow.span.appendChild(dlink);
		document.querySelector("div.content").insertBefore(unsafeWindow.span,document.querySelector("div.content").firstChild);
	} else if (unsafeWindow.span != null) {
		unsafeWindow.span.style.display = 'none';
	}
}

window.addEventListener("DOMContentLoaded",add_delete_links, false);
