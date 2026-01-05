
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
// ==UserScript==
// @name        Reddit Overwrite Extended
// @namespace   Reddit
// @description This script is a modification of Reddit Overwrite with an extended exit message expressing dissatisfaction with reddit management and announcing a migration to Voat. It will overwrite your Reddit comment history. To use it, go to Reddit, log in, click on your username, then click on the comments tab, then click on the new OVERWRITE button. If you want to modify the message that is left over your comments, it is on line 88.
// @include     https://*.reddit.com/*
// @include     http://*.reddit.com/*
// @version     1.2.9
// @downloadURL https://update.greasyfork.org/scripts/25089/Reddit%20Overwrite%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/25089/Reddit%20Overwrite%20Extended.meta.js
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
			unsafeWindow.span.innerHTML = "TRYING TO OVERWRITE COMMENT " + (unsafeWindow.deleted + 1) + " OF " + unsafeWindow.num_user_comments;
			var next_thing_id = unsafeWindow.to_delete.pop();
			unsafeWindow.setTimeout(unsafeWindow.overwrite_comment, 2000, next_thing_id, from_delete_all);
		}
		else
		{
			if (unsafeWindow.num_user_comments - unsafeWindow.deleted != 0){
				unsafeWindow.num_user_comments = unsafeWindow.num_user_comments - unsafeWindow.deleted;
				UpdateDeleteAllSpan();
				unsafeWindow.span.innerHTML = "<span>Failed to delete " + unsafeWindow.num_user_comments + " comments</span><br>" + unsafeWindow.span.innerHTML;
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
	edit_textbox.value = "I am deleting all my reddit comments with a script fuck u/spez andSjl57Z%PcE7gov94BZ6^";
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
    alert("Error trying to delete all your comments.\nError: " + e + " Stack:" + e.stack); 
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
		dlink.appendChild(document.createTextNode('OVERWRITE ' + unsafeWindow.num_user_comments + ' visible comment(s) on this page.'));
		unsafeWindow.span.appendChild(dlink);
		document.querySelector("div.content").insertBefore(unsafeWindow.span,document.querySelector("div.content").firstChild);
	} else if (unsafeWindow.span != null) {
		unsafeWindow.span.style.display = 'none';
	}
}

window.addEventListener("DOMContentLoaded",add_delete_links, false);