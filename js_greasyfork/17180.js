// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         chatango
// @version      0.05
// @description  Restore Chatango "Legacy Flash version" style on new "HTML5 version" group pages
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAvVBMVEUAAAAAdNIAKEsAN2QAg+8Af+kAeN0AN2UAGC8AguwAe98Ae+EAedwAOmgAO2sAMV0AhO8Ah/T///8Agu8Af+4AgO8Ai/sWifBfqvQFg+/w9v7r9P3n7/1ztfYAiPZpsPUkkfEcjfALhu/8/f/c6/zP5fzG3/uv1PqSxvh6uvb2+f7t9f7l7/3W6fy/3fun0PmezPiDvPZss/Vkr/VXqfRRpfNBnvIulfERiO8AfO4Aj/+42vqgzfiMwfc6mvLajLTdAAAAEHRSTlMAuRxcycnIWxna0cfGYUgwU9BTuQAAAURJREFUeNrt1dlOg1AQgOFTl7prOzOncEDWUqB2X23d3v+xtBYzsVcwvTLyX5EQPgIZBtU6shqogRooAyCRJkIxQFbwlk3nIQkBWiewyw20CNAfA+h5K28MsCABgHEPxhvSZKYwjLA6oJfw9Kx3UuTCkqoDNIGM9lQK79UBND3waH+48tZYHbCGYFPxNKRbAuARbL7urwOIKADiBILiJVqhhYI5eIW8mIPMmZEAmEGy+b6xGcFcAGDoQH+LiFu7+zXTkq+xD92+FVuLAeQk2gcmB3BHLsAkRhGA2k6drpMGBqU7kUwURoZQtNJ4huo/Uw38C6BddHiiXTLVKLo6IK4b5VI/nZz9EjoXqlIsMHCc0DlVQoEBocCAUGBAKjAgFRiQCgzIhHOfAanAgEy48RmQCU2fAVGXzRcGZMLtnTquh3tVrk8m9NAGg5m0uAAAAABJRU5ErkJggg==
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @include      https://chatango.com
// @include      /^(https?:)?\/\/([^\.\/]+\.)+chatango\.com\/*.*/
// @connect      chatango.com
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/17180/chatango.user.js
// @updateURL https://update.greasyfork.org/scripts/17180/chatango.meta.js
// ==/UserScript==
/*
 v0.01: this script only works on group pages
        hide ad, facebook buton, and help link under logo
        make zebra stripes for each line (like flash)
        make line height small (like flash)
        make thumb image small (like flash)
        show profile popup info on thumb hover (like flash)
 v0.02: minor update style, c_username cannot be float for moderators
 v0.03: added downloadURL and updateURL
        edit name and icon
 v0.04: fix font size on profile-popup user html
 v0.05: UserScript header update
        new xml parser that fix some bugs on empty documents
        small fix on mousemove that shows console errors
*/
//
!(function(){
 // set styles
 function US_addStyleEx(css, id)
 {
  var dad, obj;
  dad = document.getElementsByTagName('head')[0];
  dad || (dad = document);
  if(id && (obj = document.getElementById(id)))
  {
   obj.innerHTML = css;
  }
  else
  {
   obj = document.createElement('style');
   id && obj.setAttribute('id', id);
   obj.setAttribute('type', 'text/css');
   obj.innerHTML = css;
   dad.appendChild(obj);
  }
 }
 US_addStyleEx(`
  .ad_cell,.fb-like,.logo_links{display:none!important}
  .msg .user-thumb{width:22px!important;height:22px!important}
  .msg .msg-date{float:right!important}
  .msg .c_username{padding-right:5px}
  .msg .video-thumb img{width:105px!important;height:76px!important}
  .msg .video-thumb .video-play-icon{left:30px!important;top:16px!important}
  div#OM div.msg:nth-child(2n+0){background-color:#FFFFFF}
  div#OM div.msg:nth-child(2n+1){background-color:#F1F1F1}
  .profile-popup>font+font font{font-size:1em}
 `,'ch-mini');
 //
 function cP(){return 'http://'}
 function cA(){return 'chatango.com'}
 function cH(a){a=a.toLowerCase();var b=a[0],c=(1<a.length)?a[1]:a[0];return -1!='-_'.indexOf(b)||-1!='-_'.indexOf(c)?'/sp/sp'+a:'/'+b+'/'+c+'/'+a}
 function uP(a){return cA()+'/profileimg'+cH(a)}
 function fE(a){var r;return(r=a.match(/thumb-image-([^\s$]+)/i))&&r[1]?r[1]:null}
 function sC(a){
  a=a.replace(/<(script|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');
  a=a.replace(/<link(?:.|\s)*>/igm,'').replace(/<!--(?:.|\s)*-->/gm,'').replace(/<\?(?:.|\s)*\?>/,'');
  a=a.replace(/^(?:\r\n|\r|\n)+|(?:\r\n|\r|\n)+$/g,'');
  a=a.replace(/((\r\n|\r|\n)\2)\2+/gm,'<br>').replace(/\r\n|\r|\n/gm,'<br>');
  return a
 }
 var kX='text/xml',kE='parsererror',kH='<?xml version="1.0" ?>',kM='<mod/>';
 function hX1(a,b){return a.parseFromString(b,kX)}
 function hXE(a){var b=new DOMParser(),c=hX1(b,kE).getElementsByTagName(kE)[0].namespaceURI,d=hX1(b,a);return(d.getElementsByTagNameNS(c,kE).length>0)?hX1(b,kH+kM):d}
 //
 $(document).on('mouseenter','.msg .user-thumb',function(e){
  var u=fE(this.className);
  GM_xmlhttpRequest({method:'GET',url:cP()+'ust.'+uP(u)+'/mod1.xml',onload:function(o){
   var a,b,r=hXE(o.responseText); // new DOMParser().parseFromString(o.responseText, 'text/xml');
   a=(a=r.querySelector('a'))?a.innerHTML:null;
   b=(b=r.querySelector('b'))?b.innerHTML:null;
   if(!a&&b)
   {
    var y=b.substr(0,4),m=b.substr(5,2),d=b.substr(8,2),t=new Date();
    a=t.getFullYear()-y-((t.getMonth()-(m-1)<0||(t.getMonth()-(m-1)===0&&t.getDate()<d))?1:0);
   }
   var age=a?a:null,
       ago=(b=r.querySelector('d'))?b.innerHTML:null,
       sex=(b=r.querySelector('s'))?b.innerHTML:null,
       loc=(b=r.querySelector('l'))?b.innerHTML:null,
       lat=(b?b.getAttribute('lat'):null),
       lon=(b?b.getAttribute('lon'):null);
   var line=(b=r.querySelector('body'))?decodeURIComponent(b.innerHTML):null;
   html=line!=null?sC(line):'';
   line=line!=null?'':(loc!=null?'<br>':'')+'<font color="#666666">About me: ?</font> ';
   loc=loc!=null?'<br>'+loc:'<br><font color="#666666">Location: ?</font> ';
   age=age!=null?' '+age+', ':'<font color="#666666"> Age?,</font> ';
   sex=sex=='M'?'Male,':sex=='F'?'Female,':'<font color="#666666"> Gender?,</font> ';
   $('#ProfilePopUp').remove();
   var y=(e.pageY+180)>window.innerHeight?'bottom:'+(window.innerHeight-e.pageY)+'px;':'top:'+e.pageY+'px;';
   $('body').append('\
 <div class="sdlg-main-cbdr-cpbg profile-popup" id="ProfilePopUp" style="position:absolute;left:20px;'+y+'width:400px;min-height:60px;max-height:180px;padding:6px;cursor:pointer">\
  <div style="float:left;margin-right:4px"><div class="user-thumb thumb-image-'+u+'" style="width:50px;height:50px"></div></div>\
  <font face="_sans" size="2em" style="float:left;min-width:200px;min-height:50px"><b><u>Click to chat to</u></b> <b>'+u.charAt(0).toUpperCase()+u.substring(1).toLowerCase()+'</b><br>'+sex+age+loc+line+'</font>\
  <font face="_sans" size="2em" style="float:left;min-width:200px;margin-top:10px">'+html+'</font>\
 </div>\
 ' );
  }})
 });
 //
 $(document).on('mousemove','body',function(e){
  if(e.target.className.match&&!e.target.className.match(/(?:user-thumb)|(?:profile-popup)/)&&!$(e.target).parents('.profile-popup').length>0)
   $('#ProfilePopUp').remove();
 });
 //
 $(document).on('mouseleave','#ProfilePopUp',function(e){
  $('#ProfilePopUp').remove();
 });
 //
 $(document).on('click','#ProfilePopUp, #ProfilePopUp *',function(e){
  var u=fE($('#ProfilePopUp .user-thumb').attr('class'));
  window.open(cP()+u+'.'+cA(),'_blank');
  e.preventDefault();
  return false
 });
 //
})();
