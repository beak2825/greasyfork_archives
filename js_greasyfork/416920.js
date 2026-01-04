// ==UserScript==
// @name        重生之我是细语微博
// @namespace   Violentmonkey Scripts
// @match       http://zijingbt.njuftp.org/talk.html*
// @match       http://zijingbt.njuftp.org/bet*.html*
// @grant       none
// @version     1.4
// @author      LadderOperator
// @description 2020/11/27 下午7:01:24
// @downloadURL https://update.greasyfork.org/scripts/416920/%E9%87%8D%E7%94%9F%E4%B9%8B%E6%88%91%E6%98%AF%E7%BB%86%E8%AF%AD%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/416920/%E9%87%8D%E7%94%9F%E4%B9%8B%E6%88%91%E6%98%AF%E7%BB%86%E8%AF%AD%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

/*插入CSS*/
const style = document.createElement("style");
style.innerHTML = 

`
/* ----- 重生之我是细语微博 ----- */	

td.talk_body > div.talk:hover{
	margin:10px 0px 0px 0px;
	background-color:rgba(255, 255, 255, 1.0);
	padding:20px 30px;
	border-radius:3px;
	box-shadow:0 0 2px rgba(0,0,0,0.3);
	transition:background-color ease-in-out 0.2s;

}

td.talk_body > div.talk{
	margin:10px 0px 0px 0px;
	background-color:rgba(255, 255, 255, 0.8);
	padding:20px 30px;
	border-radius:3px;
	box-shadow:0 0 2px rgba(0,0,0,0.3);
    transition:background-color ease-in-out 0.2s;

}

td.talk_body{
    padding:0px;
    margin:0px;
    border:none;
}

div.talk_reply{
	background-color:#c8c8c838;
	border:none;
	margin:10px 0px;
	padding:10px
}

td.talk_body_reply {
	background:none;
	border-bottom:#630360 dotted 1px;
}

table.talk_table_reply, tr.talk_body_reply {
	background:none!important;
}

td.talk_body_reply > div.talk{
	word-break:break-all;
}

td.main_table_torrent, table.bet_table_admin{
	background:none;
}

td.top_state, #tdClientTrigger, tr.top_navbar{
	display:none;
}

table.top_bar:hover{
	width:100%;
	height:50px;
	margin:0px;
	padding-left:20%;
	padding-right:80%;
	background-color:rgba(255,255,255,0.9);
	border-radius:0px;
	box-shadow:0 0 3px 0px rgba(0,0,0,0.3);
	z-index:1;
	position:relative;
	border-top:2px solid #630360;
	transition:background-color ease-in-out 0.2s;
	position:fixed;
	top:0;
}

table.top_bar{
	width:100%;
	height:50px;
	margin:0px;
	padding-left:20%;
	padding-right:80%;
	background-color:rgba(255,255,255,0.8);
	border-radius:0px;
	box-shadow:0 0 3px 0px rgba(0,0,0,0.3);
	z-index:1;
	position:relative;
	border-top:2px solid #630360;
	transition:background-color ease-in-out 0.2s;
	position:fixed;
	top:0;
}

body {
	margin:100px 0px 0px 0px;
}

td.talk_table_left_top, table.bet_table, table.betoption {
    background:none;
}

table.talk_table tr.talk_table, tr.talk_body{
	background:none;
}

div.static_header span{
	color:#630360 !important;
	text-align:right !important;
    font-weight:normal !important;
    font-size:18px !important;

    padding:3px;

}

div.static_header:before{
    content:"📢"
}

div.static_header {
	text-align:left !important;
	padding:10px;
}

p.talk_tag_hot{
	font-size:20px;
	color:#630360 !important;
}

div.talk_tag_hot{
	background-color:rgba(255,255,255,0.8);
	padding:10px;
	border-radius:3px;
	border-top:none;
	box-shadow:0 0 3px 0px rgba(0,0,0,0.3)
}

div.talk_rt {
	background-color:#63036021;
}

td.talk_table_right {
	background-color:rgba(255,255,255,0.8);
	border-left: 10px #CCCCFF solid;
	padding:5px;
}

td.talk_table_left_bottom {
	margin:0px !important;
	padding:5px;
}

div.talk_table_post{
	background-color:rgb(255,255,255);
	border-radius:3px;
	padding:10px;
  box-shadow:0 0 3px 0px rgba(0,0,0,0.3);
}

table.top_header, table.navbar, table.talk_table, table.talk_table_post, table.talk_table_right, table.talk_table_posted{
	background:none!important;
}

div.talk_table_post tr{
	background:none!important;
}

div.talk_table_post *{
	margin:2px;
}

div.talk_reply_form input{
	float:right;
}

td.talk_table_count #talk_left{
	float:left;
}

a.talk_reply:before, td.bet p.bettitle > a:before{
	content:"💬"
}

a.talk_delete:before{
	content:"❌"
}

a.talk_time:before{
	content:"⏰"
}

a.talk_rt:before{
	content:"🚀"
}

a.talk_link:before{
	content:"🔗"
}

a.talk_link_short:before{
	content:"🔗"
}

a.top_logout:before{
	content:"💨"
}

span.talk_channel:before{
	content:"📍"
}

#tdMessageTrigger img{
	display:none;
}

#tdMessageTrigger:before{
	content:"📧"
}

#tdToolTrigger img{
	display:none;
}

#tdToolTrigger:before{
	content:"🔧"
}

#tdTalkTrigger:before{
	content:"📻"
}

#tdBetTrigger:before{
  content:"🌿"
}

input[type=button], input[type=submit] {
	color:white;
	border:none;
	padding: 5px;
	border-radius:3px;
	background-color: #630360;
  box-shadow:0 0 3px 0px rgba(0,0,0,0.3);
	transition:background-color ease-in-out 0.2s;
}

input[type=button]:hover, input[type=submit]:hover {
	color:white;
	border:none;
	padding: 5px;
	border-radius:3px;
	background-color: #8d0688;
  box-shadow:0 0 3px 0px rgba(0,0,0,0.3);
	transition:background-color ease-in-out 0.2s;
}

div.talk_table_posted {
	border-top:none;
	padding:10px 0px;
	width:100%;
	margin-left:0px!important;
	margin-right: 0px!important;
}

table.talk_table_posted {
	width:100%;
}

div.talk_reply_history, div.talk_reply_to_talk{
  margin:5px 0px;
}

a.talk_tag, a.talk_torrent_link {
    border: purple solid 1px;
    padding: 2px;
    border-radius: 8px;
    margin: 0px 3px!important;
}
img.insertedImg {
  max-width:100%!important;
}

#tdBetTrigger{
    text-align: left;
    padding: 5px 8px 5px 8px;
    border-top-style: none;
    border-bottom-style: none;
    border-color: transparent;
    border-radius: 0.5em;
    background-color: transparent;
    transition: all 0.5s;
    -moz-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
}

#tdBetTrigger:hover{
    text-align: left;
    padding: 5px 8px 5px 8px;
    border-top-style: none;
    border-bottom-style: none;
    border-color: transparent;
    background-color: rgb(222,227,231);
    border-radius: 0.5em;
    transition: all 0.5s;
    -moz-transition: all 0.5s;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
}

#tdBetTrigger a {
    color: purple;
    text-decoration: none;
}

#tdBetTrigger a:hover {
    text-decoration: underline;
}

tr.bet_header {
  border-radius:5px;
}

tr.betoptioned > td.betoption:before{
  content:"🍺"
}

span.red:before{
  content:"🚩"
}

span.blue:before{
  content:"💰"
}

td.bet > p.bettitle{
  font-size:16px;
  color:purple;
}

tr.betheader > th.bettime:first-child{
    border-radius: 3px 0px 0px 0px;
}

tr.betheader > td.bettime:last-child{
    border-radius: 0px 3px 0px 0px;
}

td.bet:hover {
	margin:10px 0px 0px 0px;
	background-color:rgba(255, 255, 255, 1.0);
	padding:20px 30px;
	border-radius:0px 0px 3px 3px;
	box-shadow:0 0 2px rgba(0,0,0,0.3);
	transition:background-color ease-in-out 0.2s;

}

td.bet {
	margin:10px 0px 0px 0px;
	background-color:rgba(255, 255, 255, 0.8);
	padding:20px 30px;
	border-radius:0px 0px 3px 3px;
	box-shadow:0 0 2px rgba(0,0,0,0.3);
  transition:background-color ease-in-out 0.2s;

}

tr.betheader {
  background-color: rgba(255,255,255,0.8);
	box-shadow:0 0 2px rgba(0,0,0,0.3);
  border: hidden!important;
}

`;

document.body.appendChild(style);


/*替换嵌入图片链接*/

function showImg(){
  var link_list = document.querySelectorAll("a.talk_link")

  link_list.forEach(function(e){
    const pattern = /(http(s?):)([/|.|\w|\s|\-|\%])*\.(?:jpg|gif|png)$/g;

    if (e.className != "talk_link_short" && pattern.test(e.href)) {
      var img = document.createElement("img")
      img.src = e.href
      img.className = "insertedImg"
      e.parentNode.insertBefore(img, e)
      e.parentNode.removeChild(e)
    }else{
      var short_link = document.createElement("a")
      short_link.href = e.href
      short_link.className = "talk_link_short"
      short_link.text = "查看链接"
      e.parentNode.insertBefore(short_link, e)
      e.parentNode.removeChild(e)
    }

  })
  
}

showImg();

window.setInterval(showImg, 1000)

/*增加菠菜*/

var top_bar = document.querySelector("table.top_bar tr.top_bar")
var bet = document.createElement("td")
var bet_link = document.createElement("a")

bet.className = "top_trigger"
bet.id = "tdBetTrigger"
bet_link.className = "top_bet"
bet_link.href = "/bet.html"
bet_link.text = "菠菜"

bet.append(bet_link)
top_bar.append(bet)