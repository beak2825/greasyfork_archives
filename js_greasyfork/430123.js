// ==UserScript==
// @name        moomoo.io typing text animation
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description just join game and press enter
// @author      BZZZZ
// @include     /^https?\:\/\/(sandbox\.)?moomoo\.io\/([?#]|$)/
// @version     0.3
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/430123/moomooio%20typing%20text%20animation.user.js
// @updateURL https://update.greasyfork.org/scripts/430123/moomooio%20typing%20text%20animation.meta.js
// ==/UserScript==

{
const a=document.createElement('div');
a.setAttribute('onclick',`"use strict";
function string_to_chat_packet(s){
  var l=s.length;
  var buf=new ArrayBuffer(6+l);
  var view=new Uint8Array(buf);
  view[0]=146;
  view[1]=162;
  view[2]=99;
  view[3]=104;
  view[4]=145;
  view[5]=160+l;
  while(l--)view[6+l]=s.charCodeAt(l);
  return buf;
}
var anim=[
  '/',
  '-',
  '\\\\',
  '|'
].map(s=>string_to_chat_packet('typing '+s));
var discard_message=string_to_chat_packet('[message discarded]');
var frame=0;
var frame_count=anim.length;
var chat_style=document.getElementById('chatHolder').style;
var first_send=true;
var message_to_send=false;
var was_chat_active=false;
var old_send=WebSocket.prototype.send;
WebSocket.prototype.send=function(data){
  if(first_send){
    first_send=false;
    window.setInterval(()=>{
      if(message_to_send){
        old_send.call(this,message_to_send);
        message_to_send=false;
        was_chat_active=false;
        return;
      }
      if(chat_style.display=='none'){
        if(was_chat_active)old_send.call(this,discard_message);
        was_chat_active=false;
        return;
      }
      was_chat_active=true;
      if(frame==frame_count)frame=0;
      old_send.call(this,anim[frame++]);
    },560);
  }
  if(
    data instanceof Uint8Array
    &&data.length>6
    &&data[0]==146
    &&data[1]==162
    &&data[2]==99
    &&data[3]==104
    &&data[4]==145
    &&data[5]>160
  ){
    var off=data.byteOffset;
    message_to_send=data.buffer.slice(off,off+data.length);
    return;
  }
  return old_send.call(this,data);
};`);
a.click();
}