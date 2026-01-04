// ==UserScript==
// @name         Telegram Dark
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Telegram Dark Theme
// @author       BeknAlyb
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399786/Telegram%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/399786/Telegram%20Dark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var animStopFlag = 0;

    function stopTextAnim() {

        if(animStopFlag >= 1){
            animStopFlag = 2;
            sendBtnColorAnim();
            startFish();
        }
        else{
            stopFish();
            animStopFlag = 1;
        }
    }

    function addCss(css) {
        var head, style, linkF1, linkF2, linkF3, divTopPanel;
        var button;

        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }

        divTopPanel = document.getElementsByClassName('tg_head_split');
        if (!divTopPanel[0]) { return; }

        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);

        button = document.createElement('div');
        button.className = 'stopAnimButton';
        button.addEventListener("click", stopTextAnim);
        divTopPanel[0].appendChild(button);

        linkF1 = document.createElement('link');
        linkF1.href = 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@500&display=swap';
        linkF1.rel = 'stylesheet';
        head.appendChild(linkF1);

        linkF2 = document.createElement('link');
        linkF2.href = 'https://fonts.googleapis.com/css2?family=Neucha&display=swap';
        linkF2.rel = 'stylesheet';
        head.appendChild(linkF2);

        linkF3 = document.createElement('link');
        linkF3.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        linkF3.rel = 'stylesheet';
        head.appendChild(linkF3);

        //Just stopping animation
        stopTextAnim();
    }

//Typing animation

    var messageTextArea;
    messageTextArea = document.getElementsByClassName('composer_rich_textarea')[0];
    //messageTextArea.addEventListener("input", inputAnimation);

    function inputAnimation(e){

        //console.log('Message: ' + messageTextArea.textContent);
    }


//Send button animation below
    var sendBtnText = null;
    var int2 = 150;
    var int3 = 255;
    var addInt2, addInt3 = null;
    var multiplier = 0;
    var animate;

    function init() {

        sendBtnText = document.getElementsByClassName('im_submit');
        sendBtnText[0].style.color = 'rgb(0, 150, 255)';
        sendBtnText[0].style.textShadow = '0 0 2px rgb(0, 190, 255)';

        sendBtnColorAnim();
    }

    function mouseut(){
        sendBtnText[0].style.color = 'rgb(0, 150, 255)';
        sendBtnText[0].style.textShadow = '0 0 2px rgb(0, 50, 60)';
    };

    function mousever(){
        sendBtnText[0].style.color = 'rgb(133, 205, 255)';
        sendBtnText[0].style.textShadow = '0 0 2px rgb(0, 190, 255)';
    }

    function sendBtnColorAnim() {

        multiplier += 0.5;

        if(int2 <= 60 && int3 <= 102){
            multiplier = 0.5;
            addInt2 = 1;
            addInt3 = 2;
        }
        else if(int2 >= 150 && int3 >= 255){
            multiplier = 0.5;
            addInt2 = -1;
            addInt3 = -2;
        }
        else{

        }

        int2 += addInt2 * multiplier;
        int3 += addInt3 * multiplier;

        sendBtnText[0].style.color = 'rgb(' + 0 + ', ' + parseInt(int2) + ', ' + parseInt(int3) + ')';
        sendBtnText[0].style.textShadow = '0 0 2px rgb(0, ' + parseInt(int2) + ', ' + parseInt(int3)*0.9 + ')';

        animate = setTimeout(sendBtnColorAnim,50);

        if(animStopFlag == 1) {
            sendBtnText[0].style.color = 'rgb(0, 150, 255)';
            sendBtnText[0].style.textShadow = '0 0 2px rgb(0, 50, 60)';

            sendBtnText[0].addEventListener("mouseover", mousever);
            sendBtnText[0].addEventListener("mouseout", mouseut);

            int2 = 150;
            int3 = 255;
            multiplier = 0;

            clearTimeout(animate);
        }
        else if(animStopFlag == 2){
            sendBtnText[0].removeEventListener("mouseover", mousever);
            sendBtnText[0].removeEventListener("mouseout", mouseut);
            animStopFlag = 0;
        }
    }

    window.onload = init;



var mask = document.getElementsByClassName('im_history_selected_wrap')[0];
var mask1 = document.getElementsByClassName('im_history_col_wrap')[0];

var isAnimate = 1;
var canvasW = 0, canvasH = 0;
var canvas = document.createElement('canvas');
var canvasContext = canvas.getContext('2d');

var positionInfo = mask1.getBoundingClientRect();
var posheight = positionInfo.height;
var poswidth = positionInfo.width;

canvas.width = poswidth;
canvas.height = window.innerHeight - positionInfo.bottom + 8;
canvas.className = 'aquarium';
canvas.disabled = true;

mask1.insertBefore(canvas, mask);

canvasW = canvas.width;
canvasH = canvas.height;

var fishBox = [];
var fishImages = [];

var moveX = 2;
var moveY = 0;

var img1 = new fishType('https://img.icons8.com/plasticine/100/000000/fish.png', true);
var img2 = new fishType('https://img.icons8.com/color/64/000000/fish-food.png', true);
var img3 = new fishType('https://img.icons8.com/color/96/000000/clown-fish.png', true);
var img4 = new fishType('https://img.icons8.com/officel/80/000000/clown-fish.png', true);
var img5 = new fishType('https://img.icons8.com/office/40/000000/fish-food.png', true);
var img6 = new fishType('https://img.icons8.com/color/96/000000/jellyfish.png', true);
var img7 = new fishType('https://img.icons8.com/color/48/000000/bubble.png', true);

function fish (x, y, type, flip, speed, scale){
  this.x = x;
  this.y = y;
  this.type = type;
  this.flip = flip;
  this.speed = speed;
  this.scale = scale;
}

function fishType(url, push){
  var img1 = document.createElement('img');
  img1.src = url;

  if(push){
  	fishImages.push(img1);
  }
}

function spawnBubble(){

	var hFlip = 1;
  var fishX = -250;
  var fishType = 6;
  var fishY = getRandom(0, canvasW - 60);
  var speed = getRandom(1, 3);

	var bubble = new fish(
    fishX,
    fishY,
    fishType,
    hFlip,
    speed,
    Math.random() * (0.5 - 0.15) + 0.15
  );

  if(isAnimate && !document.hidden){
    fishBox.push(bubble);
  }
  setTimeout(spawnBubble, getRandom(500, 5000));
}

function spawnFish(){

  var hFlip = 1;
  var fishX = -250;
  var fishType = getRandom(1, getRandom(4, getRandom(4, 5)));
  var fishY = getRandom(0, canvasW - 60);
  var speed = getRandom(1, 3);

  if(getRandom(1, 10) >= 5 && fishType != 5){
    hFlip = -1;
    fishX = canvasW;
  }
  else if(fishType == 5) speed = getRandom(1, 3)*0.5;

	var fish1 = new fish(
    fishX,
    fishY,
    fishType,
    hFlip,
    speed,
    Math.random() * (1.1 - 0.9) + 0.9
  );

	if(isAnimate && !document.hidden){
  	fishBox.push(fish1);
  }
  setTimeout(spawnFish, getRandom(2000, 15000));
}

function animateFish(){

  drawFish();

	if(isAnimate) requestAnimationFrame(animateFish);
}

function drawFish(){

	canvasContext.clearRect(0, 0, canvasW, canvasH);

	for(var i = 0; i < fishBox.length; i+=1){

        var speed = fishBox[i].speed;
        var x = fishBox[i].x;
        canvasContext.save();

        if(fishBox[i].type >= 5){

          canvasContext.globalAlpha = 0.6;

          canvasContext.translate(
              fishBox[i].y + Math.sin(x/(100/speed))*10 + fishImages[fishBox[i].type].width / 2,
              -x + canvasH - fishImages[fishBox[i].type].height/ 2
          );

          canvasContext.rotate(Math.cos(x/(100/speed))*2*(Math.PI/180));
        }

        else{
          canvasContext.translate(
              x*speed + fishImages[fishBox[i].type].width / 2,
              fishBox[i].y + Math.sin(x/(70/speed))*10*speed + fishImages[fishBox[i].type].height/ 2
          );

          canvasContext.rotate(Math.cos(x/(70/speed))*3*speed*(Math.PI/180));
        }

        canvasContext.scale(fishBox[i].flip, 1);

        canvasContext.drawImage(
            fishImages[fishBox[i].type],
            fishImages[fishBox[i].type].width / -2,
            fishImages[fishBox[i].type].height/ -2,
            fishImages[fishBox[i].type].width*fishBox[i].scale,
            fishImages[fishBox[i].type].height*fishBox[i].scale
        );
        canvasContext.restore();
        fishBox[i].x += speed*fishBox[i].flip;
    }
    for(var i = 0; i < fishBox.length; i+=1){
        if(fishBox[i].x*fishBox[i].flip > 1000 || fishBox[i].x < -300) fishBox.splice(i, 1);
    }
}


function stopFish(){
   isAnimate = 0;
}

function startFish(){
   isAnimate = 1;
   animateFish();
}
function getRandom (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

spawnFish();
spawnBubble();
animateFish();


    addCss (`

body
{
    background: #333;
}

body.non_osx
{
/*  font: 11px/18px 'Press Start 2P', sans-serif, Actor, Helvetica;
    letter-spacing: 0.5px; */

/*  font: 13px/18px 'Neucha', cursive, Actor, Helvetica;
    letter-spacing: 0.5px; */

    font: 12px/18px 'Montserrat Alternates', sans-serif, Actor, Helvetica;
}

.im_history_message_wrap{
   z-index: 1;
}

.aquarium{
   position: absolute;
}

.stopAnimButton {
    margin-top: -48px;
    margin-right: 104px;
    position: relative;
    float: right;
    width: 53px;
    height: inherit;
    background: #1d1d1d;
    background-image: url("https://img.icons8.com/office/40/000000/whole-fish.png");
    background-repeat: no-repeat;
    background-position: center;
    color: white;
    display: block;
}

.stopAnimButton:hover {
    background: #141617;
    color: white;
    cursor: pointer;
    background-image: url("https://img.icons8.com/office/40/000000/no-fish.png");
    background-repeat: no-repeat;
    background-position: center;
}

a {
    color: #7eaad1;
    text-decoration: none;
}

.im_dialogs_scrollable_wrap a.im_dialog:hover,.im_dialogs_scrollable_wrap a.im_dialog_selected
{
    border-radius:0;
    background:#27292b
}

.im_dialogs_scrollable_wrap .active a.im_dialog
{
    border-radius:0;
    background-color:#41525f
}
.im_dialogs_scrollable_wrap .active a.im_dialog:hover,.im_dialogs_scrollable_wrap .active a.im_dialog_selected
{
    background-color:#41525f
}

a.im_dialog:hover .im_short_message_text, a.im_dialog_selected .im_short_message_text{
    color: #999;
}

.im_dialogs_col .nano > .nano-pane > .nano-slider {

  background: rgb(60, 60, 60);
}

a.tg_checkbox, p.tg_checkbox {
    color: white;
}

.composer_rich_textarea, .composer_textarea
{
    box-shadow: 0 1px 0 0 #afafaf;
}
.composer_rich_textarea:focus, .composer_textarea:focus
{
    box-shadow: 0 2px 0 0 #afafaf;
}

a.im_dialog .im_dialog_chat_from_wrap,a.im_dialog .im_short_message_media, a.im_dialog .im_short_message_service
{
    color: #808080;
}

.im_history_col .nano > .nano-pane > .nano-slider,
.contacts_modal_col .nano > .nano-pane > .nano-slider,
.sessions_modal_col .nano > .nano-pane > .nano-slider,
.stickerset_modal_col .nano > .nano-pane > .nano-slider,
.im_dialogs_modal_col .nano > .nano-pane > .nano-slider {
  background: #484848;
}

.im_history_col .nano > .nano-pane,
.contacts_modal_col .nano > .nano-pane,
.sessions_modal_col .nano > .nano-pane,
.stickerset_modal_col .nano > .nano-pane,
.im_dialogs_modal_col .nano > .nano-pane {
  background: #333;
}

.stickerset_modal_sticker_wrap:hover {
    background: #333;
}

.im_send_panel_wrap {
    max-width: 640px;
    padding-bottom: 40px;
}

.im_send_form {
    max-width: 470px;
    left: 68px;
    right: 72px;
}

.btn-primary {
    color: #fff;
    background-color: #2e404e;
    border-radius: 3px;
}

.btn-md-primary, .btn-md-primary:focus, .btn-md-primary:hover {
    color: #b5ddff;

}

.btn-md:hover {
    background: #52606f;
}

/*.im_submit {
    color: rgb(0, 149, 255);
    text-shadow: 0 0 2px #00c0ff;
} */

.im_submit:hover {
    color: #8ed0ff;
    background: #3589c500;
}

.im_edit_panel_wrap {
    padding: 0px 0 60px;
    margin: 0 24px 0 12px;
}

.im_message_selected .im_message_outer_wrap, .md_modal_head, .md_modal_head_simple,
.stickerset_actions_wrap, .im_message_unread_split
{
    background: #1515156b;
    opacity: 1;
}

.dropdown.open .tg_head_btn,
.tg_head_btn:hover {
  color: #fff;
  text-decoration: none;
  background: #141617;
}

.im_history_select_active .im_message_outer_wrap:hover {
  background: #1515156b;
}

.im_message_author
{
   color: #499dd9;
}

.im_message_reply
{
   padding-left: 12px;
   padding-top: 2px;
   padding-bottom: 2px;
   padding-right: 0;
}

.im_message_reply_border {
    background: #7eaad1;
    height: 38px;
    width: 2px;
    position: absolute;
    margin-left: -12px;
    margin-top: -1px;
}

.im_message_reply_author {
    font-weight: 700;
    color: #7eaad1;
    line-height: 16px;
    margin-bottom: 3px;
}

.im_message_wrap {
    max-width: 660px;
    padding: 0 0px 0 0px;
    margin: 0 20px;
    margin-top: 0px;
    margin-right: 60px;
    margin-bottom: 0px;
    margin-left: 40px;
    position: static;
}

.im_message_focus_active .im_message_outer_wrap {
   background-color:rgb(0, 0, 0);
   animation-name:im_message_focus_fade;
   -webkit-animation-timing-function:ease-in;
   animation-timing-function:ease-out;
   animation-duration:4s
}

@keyframes im_message_focus_fade{
   from{
      background-color:#333b42
   }
   to{
      background-color:rgba(242,246,250,0)
   }
}

.im_send_dropbox_wrap {
    background: #1d1d1d;
    display:none;
    padding:17px 10px 0;
    border:1px dashed #999;
    overflow:hidden;
    text-align:center;
    color:#999;
    position:absolute;
}

@media (min-width: 900px) {
  .im_message_wrap {
    position: relative;
  }
  .im_message_selected .icon-select-tick,
  .im_history_selectable .im_message_outer_wrap:hover .icon-select-tick {
    position: absolute;
    width: 26px;
    height: 26px;
    margin: 9px 0 0 590px;
    display: block;
    background-image: url(../img/icons/IconsetW.png);
    background-repeat: no-repeat;
    background-position: -9px -481px;
    opacity: 0.5;
  }
  .is_2x .im_message_selected .icon-select-tick,
  .is_2x .im_history_selectable .im_message_outer_wrap:hover .icon-select-tick {
    background-image: url(../img/icons/IconsetW_2x.png);
    background-size: 42px 1171px;
  }
  .im_message_selected .icon-select-tick {
    opacity: 1 !important;
  }
  .im_grouped_short .icon-select-tick,
  .im_grouped_short .im_message_outer_wrap:hover .icon-select-tick {
    margin-top: -2px;
  }
  .im_message_fwd .icon-select-tick,
  .im_message_outer_wrap:hover .im_message_fwd .icon-select-tick {
    margin-top: 10px;
  }
  .im_grouped_fwd .icon-select-tick,
  .im_grouped_fwd .im_message_outer_wrap:hover .icon-select-tick {
    margin-top: 7px;
  }
  .im_grouped .icon-select-tick,
  .im_grouped .im_message_outer_wrap:hover .icon-select-tick {
    margin-top: 7px;
  }
  .im_grouped_fwd_short .icon-select-tick,
  .im_grouped_fwd_short .im_message_outer_wrap:hover .icon-select-tick {
    margin-top: -5px;
  }
}

.im_history_typing {
    font-size: 11px;
    color: #999;
    max-width: 556px;
    margin: 0 35px;
    padding: 13px 81px 8px 85px;
}

.audio_player_seek_slider .tg_slider_track {
    margin: 7px 0;
    background: rgba(65, 73, 78, 0.5);
    height: 4px;
    border-radius: 0;
}

.audio_player_volume_slider .tg_slider_track {
    margin: 7px 0;
    background: rgba(79, 86, 90, 0.5);
    height: 4px;
}

.im_dialogs_search_field {
    font-size: 12px;
    line-height: normal;
    border: 1px solid #333333;
    border-radius: 5px;
    padding: 6px 26px 6px 30px;
    margin: 0;
    background-color: #333333;
    background-image: url(../img/icons/IconsetW.png);
    background-repeat: no-repeat;
    background-position: -6px -205px;
}

.im_dialogs_scrollable_wrap a.im_dialog_searchpeer,
.im_dialogs_scrollable_wrap a.im_dialog_searchpeer:hover,
.im_dialogs_scrollable_wrap a.im_dialog_searchpeer_selected {

    background: #306288;
}

.modal-content {
    position: relative;
    background-color: #22292d;
    background-clip: padding-box;
    border-radius: 5px;
    outline: 0;
}

.confirm_modal_description {
    text-align: center;
    padding: 20px 0;
    font-size: 14px;
    line-height: 160%;
    color: aliceblue;
}

.tg_head_split, .im_page_wrap,Femo
.im_send_form, .stickerset_modal_stickers_list,
.md_modal_body
{

    background-color: #222;
    color: #f1efeb; !important;
    border: none;
    box-shadow: none;

}

.im_bottom_panel_wrap{
   position: relative;
}

.im_history_pinned_wrap {
    padding: 7px 10px 7px 20px;
    border-bottom: 1px solid #7d7d7d;
}

.reply_markup_button {
    color: #e6e6e6;
    display: block;
    width: 100%;
    background: #47545f;
    height: 30px;
    font-size: 13px;
    margin: 0;
    padding: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.reply_markup_button:focus, .reply_markup_button:hover {
    color: #ffffff;
    background: #637b90;
}

.im_record_bg {
    background-color: #00000000;
    width: 40px;
    height: 40px;
}

a.composer_emoji_btn:hover {
    background-color: #3b3f4273;
    border-radius: 3px;
}

.tg_head_peer_title_wrap, .tg_head_btn
{
     background-color: #1d1d1d;
}

.im_dialog_peer
{
    color: white !important;
}

.badge
{
    color: #ddd !important;
    background-color: #444 !important;
}

.im_dialogs_col_wrap
{
    border-right: 2px solid #111 !important;
}

`);

})();
