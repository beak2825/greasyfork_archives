// ==UserScript==
// @name Better Shoutbox
// @namespace https://bs.to/
// @version 0.3
// @description Shoutbox 2.0!
// @author ShafterOne
// @match https://bs.to/home
// @icon https://bs.to/favicon.ico
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/30909/Better%20Shoutbox.user.js
// @updateURL https://update.greasyfork.org/scripts/30909/Better%20Shoutbox.meta.js
// ==/UserScript==

var storange = {
reset(){
GM_setValue('friends', null);
GM_setValue('muted', null);
},
setFriend(name){
var friends = this.getFriends();
if(friends.indexOf(name) == -1){
friends.push(name);
GM_setValue('friends', friends);
}
},
getFriends(){
return GM_getValue('friends') || [];
},
removeFriend(name){
var friends = this.getFriends();
var idx = friends.indexOf(name);
friends.splice(idx,1);
GM_setValue('friends', friends);
},
setMuted(name){
var muted = this.getMutedUsers();
if(muted.indexOf(name) == -1){
muted.push(name);
GM_setValue('muted', muted);
}
sb.updateSbMenu();
},
getMutedUsers(){
return GM_getValue('muted') || [];
},
removeMuted(name){
var muted = this.getMutedUsers();
var idx = muted.indexOf(name);
muted.splice(idx,1);
GM_setValue('muted', muted);
//sb.updateSbMenu();
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
}
};

var sb = {
lastID:1,
myUsername:document.getElementById("navigation")?document.getElementById("navigation").children[0].childNodes[1].innerText:"",
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
console.log(res.responseText);
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
var text = post.text.replace(/((?:www\.|https?)([^\s]+))/, '<a class="truncate" href="$1" target="_blank">$1</a>', "g");
for(var i in this.emojis){
var emo = this.emojis[i];
text = text.split(emo.txt=='<3'?'&lt;3':emo.txt).join(' <img src="'+this.emojiPath+emo.img+'" alt="' + emo.txt + '" title="' + emo.txt + '" class="sb_smiley" />');
}
var addFriend = '<i title="Add Friend" class="fa fa-user-plus add-friend user-option" aria-hidden="true"></i>';
var removeFriend = '<i title="Remove Friend" class="fa fa-minus-circle remove-friend user-option" aria-hidden="true"></i>';
var addOrRemoveFriend = !storange.isFriend(post.user)?addFriend:removeFriend;
var mute = !storange.isFriend(post.user)?'<i title="Mute User" class="fa fa-ban mute-user user-option" aria-hidden="true"></i>':'';
var userOption = post.user!=this.myUsername?'<span class="user-menu" data-user="'+post.user+'">'+addOrRemoveFriend+mute+'</i><span>':'';
var hl = storange.isFriend(post.user)?'class="highlight"':'';
hl = post.user==this.myUsername?'class="highlight-me"':hl;
html += '<dt '+hl+' data-user="'+post.user+'"><a class="'+post.rank+'" href="https://bs.to/user/'+post.user+'">'+post.user+'</a> <time>'+post.time+'</time>'+userOption+'</dt>';
html += '<dd>'+ text+'</dd>';
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


$("head").append ('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
GM_addStyle('.truncate {display: block;white-space: nowrap; width: 75%;overflow:hidden;text-overflow:ellipsis}');
GM_addStyle('.user-menu {float:right; color:#4376c3; padding-right:10px}');
GM_addStyle('#sbPosts .highlight {background-color:#ffdfa4 !important}');
GM_addStyle('#sbPosts .highlight-me {background-color:#77a2f1 !important}');
GM_addStyle('.fa-ban,.remove-friend{ color:#ec6060;padding-left:20px;}');
GM_addStyle('#shoutbox h3{display:inline}');
GM_addStyle('#sb-menu{float:right}');
GM_addStyle('#sb-menu>li{position:relative}');
GM_addStyle('#sb-menu .sub-menu{position:absolute; right:0px; min-width:150px}');
GM_addStyle('#sb-menu .sub-menu li{background:#d4d4d5 !important;padding: 2px 6px; color:#000}');
GM_addStyle('#sb-menu .sub-menu li:hover{background:orange !important;color:#fff}');
GM_addStyle('#sb-menu .sub-menu li .fa{float:right;padding-left:5px;padding-top:3px;cursor:pointer}');
sb.init();