// ==UserScript==
// @name        Toonio OldSchool
// @version     0.1.4
// @author      nab aka Vika4ernaya
// @description toonio now look like toonator
// @grant       GM_addStyle
// @run-at      document-start
// @match       *://toonio.ru/*
// @namespace https://greasyfork.org/users/228105
// @downloadURL https://update.greasyfork.org/scripts/513621/Toonio%20OldSchool.user.js
// @updateURL https://update.greasyfork.org/scripts/513621/Toonio%20OldSchool.meta.js
// ==/UserScript==

(function() {
let css = `@import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900 !important;1,100..900&display=swap');
@font-face {
    font-family: 'ToonatorFont';
    src: url('https://cdn.glitch.global/9de5210a-3306-4433-ae52-011b56d8a529/toonator-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
.author_data [data-tip]:has([data-timestamp]) span{
  font-size: 8pt !important;
}
.author_data [data-tip]:has([data-timestamp]),
.comms_section .title .author_data .author{
  margin: 0 !important;
}
.container{
  padding: 0 !important;
}
body{
  background: #fff !important;
}

#comments .comment{
  margin-bottom: 10px !important;
}
.chats_list{
  overflow-y: scroll !important;
}
.messages{
  overflow-y: scroll !important;
}
.content.divided_pm{
  grid-template-columns: [chats] auto [chat] auto !important;
  grid-gap: 5px !important;
  padding: 0 !important;
  height: 95% !important;
}
.mini_chat .new_count{
  height: max-content !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
}
.block_section.chat .messages .comment.unseen::before{
  position: absolute !important;
  top: 25px !important;
  right: 5px !important;
  font-family: "Font Awesome 6 Pro" !important;
  content: "\f070" !important;
}
.mini_chat .chat_message{
  margin: 0 !important;
  font: 10pt Arial !important;
}
.block_section.chat .messages .comment{
  position: relative !important;
  background: unset !important;
  padding: 5px !important;
  grid-gap: 5px !important;
}
.block_section.chat .messages .comment:nth-child(2n){
  background: #eeeeee !important;
}
.block_section.chat{
  width: 680px !important;
}
.block_section.chat .title{
  border-bottom: 1px solid #cccccc !important;
  margin-bottom: 16px !important;
}

.content.divided_pm .block_section.ch{
  width: 320px !important;
}
.mini_chat:has(.marker) .chat_date{
  right: 18px !important;
}
.mini_chat .chat_date {
  position: absolute !important;
  top: 0 !important;
  right: 5px !important;
}
.mini_chat .chat_name .username{
  font-family: ToonatorFont !important;
}
.mini_chat{
  grid-template-columns: auto [marker] 1fr auto !important;
  position: relative !important;
  grid-gap: 5px !important;
  padding: 5px !important;
  align-items: unset !important;
}
.content.divided.prof:has(.block_section.u_info){
  grid-template-columns: [comms] auto [toons] auto !important;
}
.content.divided.prof:has(.block_section.u_info) > .comms_section{
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.mini_chat:nth-child(2n) {
  background: #eeeeee !important;
}
.mini_chat.selected{
  background-color: #ddd !important;
}
.mini_chat{
  background: unset !important;
}
.n_container{
  padding: 5px !important;
}
.notification:nth-child(2n) {
  background: #eeeeee !important;
}
.notification,
.n_container .notification_content{
  font: 10pt Arial !important;
  position: relative !important;
}

.n_container .notification_content [data-timestamp]{
  position: absolute !important;
  font-size: 8pt !important;
  top: 0 !important;
  right: 0 !important;
}
.notification{
  grid-gap: 5px !important;
  padding: 5px !important;
  border: 0 !important;
  margin: 0 !important;
  align-items: unset !important;
}
.minitoon_dad{
  width: 100px !important;
}
.categories > * > *{
  padding: 0 !important;
}
.categories > *{
padding: 2px !important;
}
.categories{
  top: 22px !important;
}
.block_section:has(.mini_award){
  margin-top: -20px !important;
}
.block_section:has(.mini_award)::before{
  display: inline-block !important;
  content: "." !important;
  font-size: 0 !important;
  background: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/lines.png) 0px -30px !important;
  height: 10px !important;
  width: 310px !important;
  margin: 5px auto !important;
  margin-top: 20px !important;
}
.content.divided.prof .u_info .sub_holder{
  text-align: left !important;
}
.content.divided.prof .u_info .choose a:not([href*="/pm/"]),
.content.divided.prof .u_info .choose a[href*="/pm/"] > button,
.content.divided.prof .u_info .choose .far,
.content.divided.prof .u_info .choose .fas {
  display: none !important;
}
.content.divided.prof .u_info .choose a[href*="/pm/"]::before{
  content: "Написать сообщения" !important;
  color: blue !important;
}
.content.divided.prof .u_info .choose{
  margin-top: 0em !important;
  display: inline-block !important;
}
.content.divided.prof .u_info .choose *{
  display: inline-block !important;
  width: 100% !important;
  text-align: left !important;
  padding: 0 !important;
  background-color: unset !important;
  color: var(--outline-dark) !important;
  font-family: ToonatorFont !important;
  font-size: 12pt !important;
  margin-top: 0 !important;
}
.content.divided.prof .u_info .choose a[href*="/pm/"]:hover,
.content.divided.prof .u_info #sub:hover{
  text-decoration: underline !important;
}
.content.divided.prof .u_info .nochoice #sub{
  display: none !important;
}
.content.divided.prof .u_info #sub{
  color: blue !important;
}
.content.divided.prof .u_info #sub_counter::after{
  content: " подписчиков" !important;
}
.content.divided.prof .u_info .subscribe{
  display: flex !important;
  flex-direction: column !important;
  align-items:baseline !important;
  padding: 0 !important;
  width: max-content !important;
  min-height: max-content !important;
  border: 0 !important;
  gap: 0 !important;
}
.comment .likes{
  font-size: 10pt !important;
}
.comment_data .c_text{
  margin: 0 !important;
  font: 10pt Arial !important;
}
#comment_form:hover{
  height: unset !important;
  width: unset !important;
  overflow: unset !important;
}

#comment_form:hover::before{
content: "" !important;
}
#comment_form::before{
  position: absolute !important;
  text-align: right !important;
  font-family: ToonatorFont, "Comic Sans MS" !important;
  font-size: 12pt !important;
  content: "Добавить комментарий" !important;
  color: blue !important;
  right: 0 !important;
  bottom: 0 !important;
}
#comment_form:hover > form{
  height: unset !important;
  width: unset !important;
  overflow: unset !important;
}
#comment_form > form{
  transition: ease-in-out .2s !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
}
#comment_form::after{
  text-align: left !important;
  font-family: ToonatorFont, "Comic Sans MS" !important;
  font-size: 12pt !important;
content: "Последние комментарии" !important;
}
#comment_form{
  position: relative !important;
  border-bottom: 1px solid #cccccc !important;
  margin-bottom: 28px !important;
}
.comment_author > img{
  position: absolute !important;
}
.comment_author:has(img) > a{
margin-left: 30px !important;
margin-bottom: 10px !important;
}

.comment_author{
  display: flex !important;
  justify-content:space-between !important;
  font-size: 10pt !important;
}
.title > h1,
.title{
  padding: 0 !important;
  min-height: 0 !important;
}
.block_section > .title{
  margin-bottom: 5px !important;
}
.title > div > .nav{
padding: 5px !important;
}
.block_section:has(.mini_award) .title *:not(span),
.block_section:has(.mini_award) .title{
  min-height: max-content !important;
  padding: 0 !important;
}
[class="block_section"] [href*="/top/"] > *{
  background: unset !important;
}
[class="container filled"]:has(.mini_award){
  padding: 0 !important;
  padding-bottom: 10px !important;
}
[class="container filled"] > .mini_award{
  transform: scale(.70) !important;
  width: 70px !important;
  height: 70px !important;
}
.comms_section > .block_section:has(#vk_groups, #ytplayer),
.toons_section > .block_section:has(.toony){
  display: none !important;
}
.block_section .goodplace{
  padding: 0 !important;
}
.goodplace .toon{
  margin: 0 !important;
}
.comms_section:has(#vk_groups){
  height: max-content !important;
  display: flex !important;
  flex-direction: column-reverse !important;
}



.container.filled.watch:has(.player){
  overflow:visible !important;
  padding: 10px 10px 10px 10px !important;
  background-image: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/Untitled.png) !important;
  background-repeat:no-repeat !important;
  background-size: 670px 380px !important;
  background-position: 5px 5px !important;
}

.content.divided.watch:has(#comment_form) .container.filled.watch:has(.player){
  overflow:visible !important;
  padding: 10px 10px 10px 10px !important;
  background-image: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/Untitled.png) !important;
  background-repeat:no-repeat !important;
  background-size: 600px 342px !important;
  background-position: 5px 5px !important;
}
.container.filled.watch:has(.player) h1 .tag{
  background: unset !important;
  color: #888888 !important;
  background: #eeeeee !important;
  border-radius: 3px !important;
  padding: 1px 5px !important;
  margin: 1px !important;
  vertical-align: bottom !important;
  transition: 0.5s background, 0.5s color !important;
}
.container.filled.watch:has(.player) h1 .tag:hover{
  color: black !important;
  background: #e2f594 !important;
}
.container.filled.watch:has(.player) h1{
  font-family: ToonatorFont !important;
  font-size: 18px !important;
  font-weight: bolder !important;
}

.container.filled.watch:has(.player) .info .music{
  margin: 0 !important;
}
.container.filled.watch:has(.player) *:not(.fa, .fas, .far, .fab, h1){
  font-family: ToonatorFont !important;
  font-size: 15px !important;
}
*:not(.fa, .fas, .far, .fab, [data-timestamp]){
  font-family: Arial !important;
  transition: unset !important;
}
[class*="menu"] [class="label"],
.dropdown [class="label"]{
  display: unset !important;
  font-family: ToonatorFont !important;
}
.custom_icon {
  display: none !important;
}
.border.hor{
  border: none !important;
  background: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/lines.png) 0px -60px !important;
  height: 10px !important;
  width: 310px !important;
  margin: 5px auto !important;
}

.comms_section:has(.author_data) .block_section:has(.description) > [class="container filled left"]{
  display: flex !important;
  flex-direction: column-reverse !important;
}
.container .continue .continfo > *{
  margin: 0 !important;
}
.container .continue{
  align-items:flex-start !important;
  display: flex !important;
  grid-gap: 5px !important;
}
.container .continue .minitoon{
  width: 130px !important;
}
.container .continues,
.block_section:has(.continue) .title>*,
.block_section:has(.continue) .title{
  padding: 0 !important;
}
.block_section:has(.continue) .title::after{
  display: inline-block !important;
  content: "." !important;
  font-size: 0 !important;
  background: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/lines.png) 0px -30px !important;
  height: 10px !important;
  width: 310px !important;
  margin: 5px auto !important;
}
.mini_comment:nth-child(2n){
  background: #eeeeee !important;
}
.mini_comment{
  align-items: unset !important;
  grid-gap: 5px !important;
  font: 10pt Arial !important;
  padding: 5px !important;
  min-height: 40px !important;
  border: none !important;
  margin: 0 !important;
}
.continue{
  border: none !important;
  padding: 0 !important;
}


.toon .author_data{
  padding: 5px !important;
}
.toon .toon_data .name {
  padding: 5px !important;
  min-height: 25px !important;
}

.author_data .last_seen [data-timestamp],
.author_data .last_seen{
  font-size: 12pt !important;
}

.pagination > .cur {
  border: 1px solid #888888 !important;
  border-radius: 5px !important;
  color: black !important;
  background: #eeeeee !important;
}
.pagination > *{
  border: unset !important;
  text-decoration: none !important;
  border-radius: 5px !important;
  color: #555555 !important;
  width: 35px !important;
  padding: 5px 0 2px 0 !important;
  list-style: none !important;
  margin: 1px 5px !important;
  font-family: ToonatorFont !important;
  font-size: 11pt !important;
  font-weight: bold !important;
}
[class="block_section u_info"] .nav,
.toon_actions > .nav{
  font-family: ToonatorFont !important;
  font-size: 12pt !important;
  margin: 0 !important;
}
.dropdown .categories > * > *,
.dropdown .categories > *{
  font-family: ToonatorFont !important;
}
.dropdown .categories .fas,
.dropdown .categories .far{
  display: none !important;
}
.dropdown .categories{
  border-radius: 6px !important;
  border: 1px solid #cccccc !important;
}
.header .right > div > a:not(.draw_btn),
.header .right > a:not(.draw_btn),
.header .center > a:not(.draw_btn),
.header .center > div > a:not(.draw_btn){
  padding: 5px !important;
}
.header a.menu:not(.sel):hover, .header a.logo:not(.sel):hover, .header a.item:not(.sel):hover {
  background-color: unset !important;
}
.title, .header, .footer_section, .categories.notifications {
  background: white !important;
  backdrop-filter: unset !important;
}
body > .header{
  gap: 10px !important;
  position: relative !important;
  width: 1000px !important;
  margin: auto !important;
  height: 45px !important;
  border-bottom: 1px solid #cccccc !important;
  padding: 0 !important;
}
body > .content{
  padding-top: 0 !important;
  width: 1000px !important;
}
[class="block_section u_info"]:nth-child(2){
  margin-top: -1.5em !important;
}
.block_section.u_info{
  margin-bottom: 0 !important;
}
[class="block_section u_info"] [class="title title_bro"]:has(.subscribe){
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
[class="block_section u_info"] [class="title title_bro"]:has(.subscribe)::after {
  display: inline-block !important;
  content: "." !important;
  font-size: 0 !important;
  background: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/lines.png) 0px -60px !important;
  height: 10px !important;
  width: 310px !important;
  margin: 5px auto !important;
}
[class="title u_info_header"] a:has([class="avatar"]){
  width: auto !important;
  grid-row: avatar !important;
}
.u_info .avatar {
  height: 100px !important;
  width: auto !important;
}
[class="title u_info_header"] > [class="username user"]{
  grid-row: name !important;
}
[class="title u_info_header"] > h3{
  grid-row: status !important;
  text-align: left !important;
  font-size: 12pt !important;
  margin-top: 10px !important;
  font-family: ToonatorFont !important;
}
[class="title u_info_header"]{
  padding-bottom: 0 !important;
  display: grid !important;
  grid-template-rows: [name] auto [avatar] auto [status] auto !important;
}
.content.divided{
  font: 10pt Arial !important;
  margin-top: 5px !important;
  grid-gap: 0 !important;
  grid-template-columns: [toons] auto [comms] auto !important;
}
.description {
  font-family: 'Exo 2', sans-serif !important;
  font-size: 11pt !important;
  word-wrap: break-word !important;
}
.toons_section{
  width: 680px !important;
  float: left !important;
}
.block_section{
  margin-bottom: 10px !important;
}
.comms_section{
  width: 320px !important;
  float: left !important;
}
.watch > .toons_section {
  width: 610px !important;
}
.watch > .comms_section{
  width: 350px !important;
  margin-left: 20px !important;
}
.footer_section [style="margin-left: 1em"]{
  margin-left: 3px !important;
}
.footer_section > *{
  display: inline-block !important;
  width: max-content !important;
  text-align: left !important;
}
.footer_section{
  display: inline-block !important;
  border-top: 1px solid #cccccc !important;
  width: 1000px !important;
  padding: 0 !important;
  text-align: center !important;
  font-size: 8pt !important;
}
.footer_section .social > *{
  margin-right: 1em;
}
.footer_section .social [href*="bsky"] span{
  display: none;
}
.footer_section .social [href*="bsky"]::before {
  content: "bsky" !important;
}
.footer_section .social [href*="vk"]::before{
  content: "Вконтакте" !important;
}
.footer_section .social [href*="vk"] span{
  display: none !important;
}
.footer_section .social [href*="youtube"]::before{
  content: "Ютуб" !important;
}
.footer_section .social [href*="youtube"] span{
  display: none !important;
}
.header .menu:not(.pm, .notify, [href="/balance"]) .label{
  margin-left: 0 !important;
}
.goodplace .toon .toon_data .preview{
  width: 300px !important;
  height: 168.5px !important;
}
.toon .toon_data .preview{
  width: 200px !important;
}
.toons{
  display: unset !important;
  width: 100px !important;
}
.toons_section > * > *:not([class="container filled watch"], .wnd, .pagination > *){
  padding: 0 !important;
}

[class="toon"]{
  background-color: #eeeeee !important;
}
.toon{
  display: inline-block !important;
  width: 210px !important;
  margin: 3px !important;
  padding: 5px 0 5px 0 !important;
  border: none !important;
  border-radius: 6px !important;
}
.goodplace .toon{
  width: 320px !important;
}
.toon_data .name {
  padding: 8.5px 0 !important;
  height: auto !important;
}
.toon_data .name a{
  font-size: 12px !important;
  font-weight: bold !important;
  color: #555555 !important;
}
.toon > *{
  font-size: 8pt !important;
  height: 18px !important;
}
.toon .toon_data{
  display: flex !important;
  flex-direction:column-reverse !important;
  height: auto !important;
  align-items: center !important;
}
.header #menu {
  grid-gap: 0 !important;
}
.block_section:has(.uhoh),
.header .menu [class*=""]:not(.fa-bell),
.header .menu:not([href="/balance"], .notify, .pm) [class*="far"],
.header .search{
  display: none !important;
}
.header > .left > .logo{
  font-size: 0 !important;
}

.userinfo > .description{
  grid-row: description !important;
}

.userinfo:has(.description) > *:not(.description){
  font: 10pt Arial !important;
  margin: 0 !important;
}
.level_progress,
.userinfo:has(.description) > *:not(.description) .far{
  display: none !important;
}

.userinfo:has(.description)::after {
  display: inline-block !important;
  content: "" !important;
  background: url(https://raw.githubusercontent.com/NoT0BoT/MooMoo.io-MooMod/master/lines.png) 0px -70px !important;
  height: 10px !important;
  width: 310px !important;
  margin-top: 10px !important;
}
.userinfo{
  display: grid !important;
  grid-template-rows: repeat(999, auto) [description] !important;
  padding: 0px !important;
  padding-top: 0 !important;
}
.userinfo > br{
  display:  none !important;
}
.title a,
.title h1{
  font-family: ToonatorFont !important;
}

.comms_section > :nth-child(1) > *{
  padding: 0px !important;
}
.comms_section:has(#vk_groups, #ytplayer) > *:nth-child(3) > *{
  padding: 0 !important;
  font: 10pt Arial !important;
}
.draw_btn{
  border: none !important;
  background: url(https://i.imgur.com/e9f3eRO.png) -7px -86px !important;
  width: 130px !important;
  height: 22px !important;
  padding: 5px 0px !important;
  background-clip:content-box !important;
  font-size: 0 !important;
}
.draw_btn:hover{
background: url(https://i.imgur.com/LGL2vsE.gif) -4px -43px !important;
  background-clip:content-box !important;
}
.header > .left > .logo::before{
  content: "" !important;
  display: inline-block !important;
  width: 95px !important;
  height: 40px !important;
  background-position: -10px 5px !important;
  background-repeat: no-repeat !important;
  background-image: url("https://i.imgur.com/K1WclXl.png") !important;
}

*{
  box-shadow: unset !important;
  --border-radius: 0px !important;
  --border-radius-small: 0px !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
