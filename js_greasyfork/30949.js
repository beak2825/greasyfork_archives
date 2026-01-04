// ==UserScript==
// @name         BS-Tool
// @namespace    https://bs.to/
// @version      0.1
// @description  Ultimatives Tool!
// @author       ShafterOne
// @match        https://bs.to/home
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/30949/BS-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/30949/BS-Tool.meta.js
// ==/UserScript==

var storange = {
	prefix:$('#navigation div strong').html()+"_",
	reset(){
		var storange = GM_listValues();
		for(var key in storange){
			GM_deleteValue(storange[key]);
		}
	},
	setState(key,value){
		GM_setValue(this.prefix+key, value);
	},
	getState(key){
		return GM_getValue(this.prefix+key);
	},
	setFriend(name){
		var friends = this.getFriends();
		if(friends.indexOf(name) == -1){
			friends.push(name);
			GM_setValue(this.prefix+'friends', friends);
		}
	},
	getFriends(){
		return GM_getValue(this.prefix+'friends') || [];
	},
	removeFriend(name){
		var friends = this.getFriends();
		var idx = friends.indexOf(name);
		friends.splice(idx,1);
		GM_setValue(this.prefix+'friends', friends);
	},
	setMuted(name){
		var muted = this.getMutedUsers();
		if(muted.indexOf(name) == -1){
			muted.push(name);
			GM_setValue(this.prefix+'muted', muted);
		}
	},
	getMutedUsers(){
		return GM_getValue(this.prefix+'muted') || [];
	},
	removeMuted(name){
		var muted = this.getMutedUsers();
		var idx = muted.indexOf(name);
		muted.splice(idx,1);
		GM_setValue(this.prefix+'muted', muted);
	},
	isMuted(name){
		if(this.getMutedUsers().indexOf(name) != -1){
			return true;
		}
		return false;
	},
	isFriend(name){
		if(this.getFriends().indexOf(name) != -1){
			return true;
		}
		return false;
	},
	getMessages(){
		var messages =  GM_getValue(this.prefix+'messages') || {};
		return messages;
	},
	getMessage(id){
		return this.getMessages()[id];
	},
	setMessage(message){
		var messages = this.getMessages();
		messages[message.id]=message;
		GM_setValue(this.prefix+'messages', messages);
	},
	removeMessage(id){
		var messages = this.getMessage();
		delete messages[id];
		GM_setValue(this.prefix+'messages', messages);
	}
};

var sb = {
	lastID:1,
	myUsername:$('#navigation div strong').html(),
	posts: [],
	renderedPost:[],
	mode:'update',
	buffer:500,
	box: $('#sbPosts'),
	refreshInterval:1500,
	scrollDown:true,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
		'Cookie': document.cookie,
		'Accept': 'application/json, text/javascript, */*; q=0.01',
		'Referer': 'https://bs.to/home',
		'X-Requested-With': 'XMLHttpRequest',
		'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
		'host':'bs.to',
		'Origin':'https://bs.to'
	},
	emojiPath:'/public/img/emojis/',
	emojis:[
	{img:'smiling.png',txt:':)'},
	{img:'grinning.png',txt:':D'},
	{img:'tongue_out.png',txt:':P'},
	{img:'frowning.png',txt:':('},
	{img:'speechless.png',txt:':|'},
	{img:'surprised.png',txt:':O'},
	{img:'angry.png',txt:':!'},
	{img:'lips_sealed.png',txt:':x'},
	{img:'heart.png',txt:'<3'},
	{img:'kiss.png',txt:':*'},
	{img:'poop.png',txt:'*poop*'},
	{img:'thumbs_up.png',txt:'(Y)'},
	],
	init(){
		clearTimeout(Shoutbox.timeout1);
		sb.getPosts();
		sb.updateSbMenu();
		sb.refreshPosts();
		$('#shoutbox form').attr('onsubmit','return null');
		var textbox = $('#sbMsg');
		textbox.attr('onkeydown',null);
		textbox.keypress(function(event){
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == '13'){
				sb.sendMessage();
			}
		});
		$('#sbSubmit').click(function(event) {
			event.preventDefault();
			sb.sendMessage();
		});
	},
	getPosts(){
		var self = this;
		GM_xmlhttpRequest({
			method: "POST",
			data: $.param({last:this.lastID}),
			url: "https://bs.to/ajax/sb-posts.php",
			headers: self.headers,
			onload: function(res) {
				data = JSON.parse(res.responseText);
				self.setPosts(data.posts.reverse());
				self.lastID = data.last>0?data.last:self.lastID;
			}
		});
	},
	sendMessage(){
		var self = this;
		GM_xmlhttpRequest({
			method: "POST",
			data: $.param({last:this.lastID,text:$('#sbMsg').val()}),
			url: "https://bs.to/ajax/sb-send.php",
			headers: self.headers,
			onload: function(res) {
				self.getPosts();
				$('#sbMsg').val('');
			}
		});
	},
	setPosts(posts){
		var startPos = this.getScrollPos();
		for(var idx in posts){
			this.posts.push(posts[idx]);
			if(this.posts.length > this.buffer){
				this.posts.shift();
			}
		}
		if(this.mode=='update'){
			if(this.scrollDown || startPos.sp+50 >= startPos.ms){
				this.updatePosts();
				var newPos = this.getScrollPos();
				this.box.scrollTop(newPos.ms);
				this.scrollDown = false;
			}else{
				this.updatePosts();
				this.box.scrollTop(startPos.sp);
			}
		}else{
			this.renderBox();
		}
	},
	refreshPosts(){
		var self = this;
		setInterval(function() {self.getPosts();}, self.refreshInterval);
	},
	updatePosts(){
		if(this.lastID == 1){
			this.box.html(this.getPostsHtml());
		}else{
			this.box.append(this.getPostsHtml());
		}
		this.attachUserMenuEvents();
	},
	reRenderPosts(){
		this.renderedPost = [];
		this.box.html('');
		this.updatePosts();
	},
	attachUserMenuEvents(){
		$('.user-option').off();
		$('.user-option.add-friend').click(function() {
			var user = $(this).parent().attr('data-user');
			storange.setFriend(user);
			sb.reRenderPosts();
		});
		$('.user-option.remove-friend').click(function() {
			var user = $(this).parent().attr('data-user');
			storange.removeFriend(user);
			sb.reRenderPosts();
		});
		$('.user-option.mute-user').click(function() {
			var user = $(this).parent().attr('data-user');
			storange.setMuted(user);
			sb.updateSbMenu();
			sb.reRenderPosts();
		});
	},
	getScrollPos(){
		var sp = this.box.scrollTop();
		var sh = this.box.prop("scrollHeight");
		var ms = sh-this.box.outerHeight();
		return {sp:sp,sh:sh,ms:ms};
	},

	removeFirstPost(){
		if(this.renderedPost.length > this.buffer){
			this.renderedPost.shift();
			this.box.find('dt')[0].remove();
			this.box.find('dd')[0].remove();
		}
	},
	getPostsHtml(){
		var html = '';
		for(var idx in this.posts){
			var post = this.posts[idx];
			if(!storange.isMuted(post.user) && this.renderedPost.indexOf(post.id) == -1 ){
				var text = post.text.replace(/((?:www\.|https?:\/\/)([^\s]+))/, '<a class="truncate" href="$1" target="_blank">$2</a>', "g");
				for(var i in this.emojis){
					var emo = this.emojis[i];
					text = text.split(emo.txt=='<3'?'&lt;3':emo.txt).join(' <img src="'+this.emojiPath+emo.img+'" alt="' + emo.txt + '" title="' + emo.txt + '" class="sb_smiley" />');
				}
				var addFriend = '<i title="Add Friend" class="fa fa-user-plus add-friend user-option" aria-hidden="true"></i>';
				var removeFriend = '<i title="Remove Friend" class="fa fa-minus-circle remove-friend user-option" aria-hidden="true"></i>';
				var pasteName = '<i onclick="Shoutbox.addSmiley(\'@'+post.user+'\')" class="fa fa-clone user-option" aria-hidden="true"></i>';
				var addOrRemoveFriend = !storange.isFriend(post.user)?addFriend:removeFriend;
				var mute = !storange.isFriend(post.user)?'<i title="Mute User" class="fa fa-ban mute-user user-option" aria-hidden="true"></i>':'';
				var userOption = post.user!=this.myUsername?'<span class="user-menu" data-user="'+post.user+'">'+pasteName+addOrRemoveFriend+mute+'<span>':'';
				var hl = storange.isFriend(post.user)?'class="highlight"':'';
				hl = post.user==this.myUsername?'class="highlight-me"':hl;
				html += '<dt '+hl+'><a  class="'+post.rank+'" href="https://bs.to/user/'+post.user+'">'+post.user+'</a> <time>'+post.time+'</time>'+userOption+'</dt>';
				html += '<dd>'+text+'</dd>';
				this.renderedPost.push(post.id);
				this.removeFirstPost();
			}
		}
		return html;
	},
	updateSbMenu(){
		var header = $('#shoutbox header');
		var html = '<ul id="sb-menu">';
		var muted = storange.getMutedUsers();
		if(header.find('#sb-menu').length){
			header.find('#sb-menu').remove();
		}
		html += this.renderMutedUsers();
		html += '</ul>';
		header.prepend(html);
		this.attachSbMenuEvents();
	},
	attachSbMenuEvents(){
		$("#sb-menu>li").hover(
			function () {
				$(this).find('.sub-menu').removeClass("hidden");
			},
			function () {
				$(this).find('.sub-menu').addClass("hidden");
			}
			);
		$('#sb-menu .reset-mute').click(function() {
			var user = $(this).parent().find('.muted').html();
			storange.removeMuted(user);
			sb.reRenderPosts();
			$(this).parent('li').remove();
			if(!$('.reset-mute').length){
				$('#sb-menu').remove();
			}
		});

	},
	renderMutedUsers(){
		var muted = storange.getMutedUsers();
		if(muted.length){
			var html = '<li><i class="fa fa-ban" aria-hidden="true"></i> Muted<ul id="muted" class="sub-menu hidden">';
			for(var idx in muted){
				html += '<li><span class="muted">'+muted[idx]+'</span> <i class="fa fa-minus-square reset-mute" aria-hidden="true"></i></li>';
			}
			html += '</ul></li>';
			return html;
		}
		return '';
	},
	renderBox(){
		var html = '<section id="shoutbox"><section id="shoutbox"><div><dl id="sbPosts">';
		html += this.getPostsHtml();
		html +='</div></dl></section>';
		return html;
	},
	renderEmojis(){
		var html='<div id="smileys">';
		for(var idx in this.emojis){
			var txt = this.emojiPath+this.emojis[idx].txt;
			html += '<img src="'+this.emojiPath+this.emojis[idx].img+'" data-txt="'+txt+'" title="'+txt+'" class="emoji">';
		}
		html +='</div>';
		return html;
	},
};

var sidebar = {
	messages:[],
	fullSync:false,
	refreshInterval:30000,
	init(){
		this.refreshMessages();
		this.renderSidebar();
	},
	getMessages(page){
		var self = this;
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://bs.to/messages/"+page,
			headers: {
				'Cookie': document.cookie,
			},
			onload: function(res) {
				var html = res.responseText;
				self.extractMessages(res.responseText,page);
			}
		});
	},
	getMessage(id){
		var self = this;
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://bs.to/messages/read:"+id,
			headers: {
				'Cookie': document.cookie,
			},
			onload: function(res) {
				var messageText = $(res.responseText).find('.message-read p').html();
				var message = storange.getMessage(id);
				message.text = messageText;
				message.status = 'read';
				storange.setMessage(message);
				self.showMessageModal(message);
				self.renderMessages();
			}
		});
	},
	sendMessage(){
		var self = this;
		var mm = $('#message-modal');
		var text = mm.find('.message').val();
		var subject = mm.find('.subject').val();
		var receiver = mm.find('.receiver').val();
		GM_xmlhttpRequest({
			method: "POST",
			data: $.param({'newmsg[to]':receiver,'newmsg[subject]':subject,'newmsg[text]':text}),
			url: "https://bs.to/messages/new",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				'Cookie': document.cookie,
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'Referer': 'https://bs.to/messages/new',
				'X-Requested-With': 'XMLHttpRequest',
				'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
				'host':'bs.to',
				'Origin':'https://bs.to'
			},
			onload: function(res) {
				$('#message-modal').iziModal('close');
				this.extractMessages(res.responseText,1);
			}
		});
	},
	extractMessages(html,page){
		var table = $(html).find('table');
		var td = table.find('tr td');
		var next = true;
		table.find('tr').each(function(index) {
			var message = {};
			if(index>0){
				var cols = $(this).find('td');
				message.status =  $(this).attr('class')=='unread'?'unread':'read';
				message.id = $(cols[1]).find('a').attr('href').match(/\d+/)[0];
				message.subject = $(cols[1]).text();
				message.sender =  $(cols[2]).text();
				message.receiver = $(cols[3]).text();
				message.time =   $(cols[4]).text();
				message.type =  message.sender == 'Dir'?'outgoing':'incomming';
				message.archived = false;
				console.log(message.id);
                console.log(storange.getMessage(message.id));
				if(storange.getMessage(message.id)!==undefined && !this.fullSync){
					next=false;
				}
                storange.setMessage(message);
			}
		});
		if(!$(html).find('.pages .current').next('.disabled').length && next){
			this.getMessages(page+1);
		}else{
			this.renderMessages();
		}
	},
	refreshMessages(){
		var self = this;
		self.getMessages(1);
		setInterval(function() {self.getMessages(1);}, self.refreshInterval);
	},
	renderMessages(){
		var messages = storange.getMessages();
		var scrollPos = $('#message-container').scrollTop();
		var keys = Object.keys(messages).sort().reverse();
		var html = '<div id="message-container"><div class="messages">';
		var filter = storange.getState('message_filter');
		var newMessages = 0;
		for(var i=0;i<keys.length;i++){
			var message = messages[keys[i]];
			var sender = '<span class="sender">'+message.sender+'</span>';
			var receiver = '<span class="receiver">'+message.receiver+'</span>';
			var unread = '<i class="fa fa-envelope" aria-hidden="true"></i>';
			var read = '<i class="fa fa-envelope-open" aria-hidden="true"></i>';
			var status = message.status=='read'?read:unread;
			var m = '<div class="message '+message.status+'" data-id="'+message.id+'"><div class="message-details '+message.type+'">';
			m += message.type == 'incomming'?'<span>Von: </span>'+sender:'<span>An: </span>'+receiver;
			m += '<span class="status">'+status+'</span><span class="time">'+message.time+'</span></div>';
			m += '<div class="subject">'+message.subject+'</div></div>';
			html += filter==message.status?m:'';
			html += filter==message.type?m:'';
			html += filter===''?m:'';
			newMessages += message.type== 'incomming' && message.status == 'unread'? 1 : 0;
		}
		html += '</div></div>';
		$('#sb-content').html(html);
		$('#sidebar .header #new-messages').html(newMessages);
		if(newMessages===0){
			$('#sidebar .header #new-messages').hide();
			$('#sidebar #unread').addClass('no-messages');
		}else{
			$('#sidebar .header #new-messages').fadeIn();
			$('#sidebar #unread').removeClass('no-messages');
		}
		$('#message-container').scrollTop(scrollPos);
		this.attachMessageEvents();
	},

	renderNavigation(){
		var filter = storange.getState('message_filter');
		var content = storange.getState('content');
		var mode =`
		<select id="message-filter">
		<option value="incomming" `+(filter=='incomming'?'selected':'')+`>Posteingang</option>
		<option value="outgoing" `+(filter=='outgoing'?'selected':'')+`>Gesendet</option>
		<option value="unread" `+(filter=='unread'?'selected':'')+`>Ungelesen</option>
		<option value="" `+(filter===''?'selected':'')+`>Alle</option>
		</select>`;
		var nav =`
		<ul class="nav">
		<li data-content="settings" class="menu-item `+(content == 'settings'?'active':'')+`"><i class="fa fa-cogs" aria-hidden="true"></i></li>
		<li data-content="user-online" class="menu-item `+(content == 'user-online'?'active':'')+`"><i class="fa fa-users" aria-hidden="true"></i></li>
		<li data-content="friends" class="menu-item `+(content == 'friends'?'active':'')+`"><i class="fa fa-address-book" aria-hidden="true"></i></li>
		<li data-content="messages" class="menu-item `+(content == 'messages'?'active':'')+`"><i class="fa fa-envelope" aria-hidden="true"></i></li>
		<li id="filter" style="`+(content != 'messages'?'display:none':'')+`">`+mode+`</li>
		</ul>
		<span id="unread"><span id="new-messages"></span><i class="fa fa-envelope" aria-hidden="true"></i></span>`;
		$('#sidebar .header').html(nav);

	},
	renderContent(){
		var content = storange.getState('content');
		$('#sidebar #filter').hide();
		if(content == 'messages'){
			this.renderMessages();
			$('#sidebar #filter').show();
		}
	},
	renderSidebar(){
		var html='<div id="sidebar" class="left"><div class="header"></div><div id="sb-content"></div>';
		$('#sidebar').remove();
		$('body').prepend(html);
		this.renderNavigation();
		this.renderContent();
		this.attachNavigationEvents();
	},
	showMessageModal(message){
		var modal =  `<div id="message-modal" class="iziModal">
		<div class="content-wrapper">`+message.text+`</div>
		</div>`;
		var messageInputs=`
		<label>EmpfÃ¤nger:</label>
		<input type="text" class="receiver" placeholder="EmpfÃ¤nger" name="newmsg[to]" value="`+(message.sender||'')+`">
		<label>Betreff:</label><input type="text" class="subject" placeholder="Betreff" value="`+(message.subject||'')+`" name="newmsg[subject]">
		<label>Nachricht:</label>
		<textarea class="message" name="newmsg[text]"></textarea>
		<button class="btn-submit" id="send-message" >Absenden</button>
		`;
		$('#message-modal').iziModal('close');
		$('#message-modal').remove();
		$('.iziModal-overlay').remove();
		$('body').prepend(modal);

		$("#message-modal").iziModal({
			title: message.subject+' <i class="fa fa-reply" aria-hidden="true"></i>',
			subtitle: message.sender,
			headerColor: '#88A0B9',
			width: '50%',
		});
		$('#message-modal').iziModal('open');
		$('#message-modal .iziModal-header-title').click(function() {
			$('#message-modal .content-wrapper').html(messageInputs);
			$('#send-message').click(function() {
				sidebar.sendMessage();
			});
		});
	},
	attachNavigationEvents(){
		$( "#message-filter" ).change(function() {
			var value = $(this).val();
			storange.setState('message_filter',value);
			sidebar.renderMessages();
		});
		$( "#sidebar .menu-item" ).click(function() {
			var value = $(this).attr('data-content');
			storange.setState('content',value);
			$( "#sidebar .menu-item" ).removeClass('active');
			$(this).addClass('active');
			sidebar.renderContent();
		});
	},
	attachMessageEvents(){
		$( "#sidebar .messages .subject").click(function() {
			var id = $(this).parent().attr('data-id');
			var message = storange.getMessage(id);
			if( message.text !== undefined){
				sidebar.showMessageModal(message);
			}else{
				sidebar.getMessage(id);
			}
		});
	},
};


$("head").append ('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
$("head").append ('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.4.2/js/iziModal.min.js"></script>');
$("head").append ('<link href="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.4.2/css/iziModal.min.css" rel="stylesheet" type="text/css">');
GM_addStyle(`
	.truncate {
		display: block;
		white-space: nowrap;
		width: 75%;
		overflow: hidden;
		text-overflow: ellipsis
	}
	.user-menu {
		display:none;
		float: right;
		color: #4376c3;
		padding-right: 10px
	}
	.user-menu .user-option{
		padding-right:10px
	}

	#sbPosts dt:hover .user-menu{
		display:inherit;
	}
	#sbPosts .highlight {
		background-color: #ffdfa4 !important
	}
	#sbPosts .highlight-me {
		background-color: #77a2f1 !important
	}
	.fa-ban,
	.remove-friend {
		color: #ec6060;
		padding-left: 20px;
	}
	#shoutbox h3 {
		display: inline
	}
	#sb-menu {
		float: right
	}
	#sb-menu>li {
		position: relative
	}
	#sb-menu .sub-menu {
		position: absolute;
		right: 0px;
		min-width: 150px
	}
	#sb-menu .sub-menu li {
		background: #d4d4d5 !important;
		padding: 2px 6px;
		color: #000
	}
	#sb-menu .sub-menu li:hover {
		background: orange !important;
		color: #fff
	}
	#sb-menu .sub-menu li .fa {
		float: right;
		padding-left: 5px;
		padding-top: 3px;
		cursor: pointer
	}`);

//styles sidebar
GM_addStyle(`
	#sidebar.left{
		width: 350px;
		position: fixed;
		background: #cfcfcf;
		height:34px;
		top: 150px;
		padding:10px 0;
		overflow:hidden;
		left: -265px;
		opacity: .5;
		z-index:9999;
		box-shadow: 0px 0px 6px 0px #000;
	}

	#sidebar #message-filter{
		display: none;
	}

	#sidebar.left:hover #message-filter{
		display:block;
	}

	#sidebar.left:hover,.left.always-visible{
		left:0px;
		height:auto;
		opacity: 1;
		transition: opacity 0.6s;
	}
	#sidebar.left:hover #unread{
		right:10px;
	}

	#sidebar .header{
		padding: 0px 10px 10px 10px;
		position: relative;
	}
	#sidebar #unread {
		position: absolute;
		font-size: 40px;
		color: #fbab34;
		right: 30px;
		top: -13px;
	}
	#sidebar #unread.no-messages{
		color:#fff;
	}
	#sidebar .nav>li{
		display:inline-block; alert( "Handler for .change() called." );
		font-size:25px;
		color:#094b85;
		margin-right:10px;
		vertical-align: middle;
	}
	#sidebar .nav .menu-item{
		cursor:pointer;reset();

	}
	#sidebar .nav li.active{
		color:#fbab34;
	}
	#sidebar.right{
		border-radius: 5px 0 0 5px;
	}
	#sidebar.left{
		border-radius: 0 5px 5px 0;

	}
	#message-container{
		height:calc(100vh - 350px);
		background: #fff;
		overflow: hidden;
		overflow-y: scroll;
	}
	#message-container .time {
		float: right;
	}
	#message-container .status {
		float: right;
		padding-left: 10px
	}
	#message-container .message-details {
		background: #aec2e1;
		padding: 5px
	}
	#message-container .subject {
		padding: 5px;
		cursor:pointer;
	}
	#message-container .unread .fa {
		color: orange
	}
	#message-container .read .fa {
		color: #fff
	}
	#message-container .message {
		border: 1px solid #ccc;
		border-radius: 5px;
		margin: 7px;
		overflow: hidden;
	}
	#message-container .message:hover {
		box-shadow: 0px 0px 6px 0px #adadad;
	}
	.iziModal-content{
		height:70vh;
	}
	.iziModal-content .content-wrapper{
		padding:15px;
	}
	#message-modal .iziModal-header-title{
		cursor:pointer;
	}
	#message-modal .receiver,#message-modal .subject{
		width:70%;
		margin-bottom:15px;
	}
	#message-modal .message{
		width:100%;
		height:calc(70vh - 270px);
		box-sizing: border-box;
		margin-bottom:15px;
	}
	#message-modal .btn-submit{
		padding: 12px;font-size: 20px;
	}
	#new-messages{
		font-size: 15px;
		font-weight: bold;
		color: white;
		background: #F44336;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: inline-block;
		text-align: center;
		position: absolute;
		right: -8px;
		top: 7px;
	}
	`);
storange.reset();

sb.init();
sidebar.init();
