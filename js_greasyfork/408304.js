// ==UserScript==
// @name        Nya爬
// @icon        https://static.nyahentai.pw/img/favicon.ico
// @namespace   https://zh.bughentai.com
// @namespace   https://zh.foxhentai.com
// @match       https://zh.*hentai.com/group/*
// @match       https://zh.*hentai.com/artist/*
// @match       https://zh.*hentai.com/page/*
// @match       https://zh.*hentai.com/parody/*
// @match       https://zh.*hentai.com/tag/*
// @match       https://zh.*hentai.com/character/*
// @match       https://zh.*hentai.com/category/*
// @match       https://zh.*hentai.com/language/*
// @grant       none
// @version     1.0.2
// @author      0772Boy
// @description 导出Nyahentai本子为txt，在例如https://zh.bughentai.com/group/*页面生效，点击图片下方的文字激活（“Nya爬”开头）
// @downloadURL https://update.greasyfork.org/scripts/408304/Nya%E7%88%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/408304/Nya%E7%88%AC.meta.js
// ==/UserScript==
var C1=document.getElementsByClassName('gallery');
var i, ii, s, a, a0, a1;
for (i=0; i<C1.length; i++) {
  var C2=C1[i].getElementsByClassName('cover');
  a=C2[0].href;
  var C2=C1[i].getElementsByClassName('caption');
  s=i+1;
  if (s < 10){
      s = '0'+s
  }
  a0="var getlist = function(){var u,x,y,z,t0,t1,t2,t3,t4;u='"+a+"';x=u.indexOf('/g/');t4=u.substring(x+3);$.ajax({type:'get',url:u,success:function(body,heads,status){x=body.indexOf('<title>');y=body.indexOf('</title>');t0=body.substring(x+7,y);x=body.indexOf('<div>共 ');y=body.indexOf(' 頁</div>');t1=body.substring(x+7,y);x=body.indexOf('data-src=&quot;');y=body.indexOf('/cover.');t2=body.substring(x+10,y+1);t3=body.substring(y+7,y+10);t2=t2.replace('t1.', 'i0.');t2=t2.replace('://t', '://i');t2=t2.replace('t.', 'i.');z=t0+' By 0772Boy';for (i=1; i<t1; i++) {z=z+'\\n'+t2+i+'.'+t3;}var element = document.createElement('a');element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(z));element.setAttribute('download', t4+'.txt');element.style.display = 'none';document.body.appendChild(element);element.click();document.body.removeChild(element);}});};getlist();"
  C2[0].innerHTML = '<a href="javascript:void(0);" onclick="'+a0+'" alt="猫爬架'+s+'ヽ(ﾟ∀ﾟ)ﾒ(ﾟ∀ﾟ)ﾉ ">Nya爬 » ' + C2[0].innerHTML + '</a>';
}
var getlist = function (u) {
  var x,y,z,t0,t1,t2,t3,t4;
  x=u.indexOf('/g/');
  t4=u.substring(x+3);
  $.ajax({
      type:'get',
      url:u,
      success:function(body,heads,status){
        x=body.indexOf('<title>');
        y=body.indexOf('&raquo;');
        t0=body.substring(x+7,y);
        x=body.indexOf('<div>共 ');
        y=body.indexOf(' 頁</div>');
        t1=body.substring(x+7,y);
        x=body.indexOf('data-src="');
        y=body.indexOf('/cover.');
        t2=body.substring(x+10,y+1);
        t3=body.substring(y+7,y+10);
        t2=t2.replace('://t', '://i');
        t2=t2.replace('t1.', 'i0.');
        t2=t2.replace('t.', 'i.');
        z=t0+' By 0772Boy';
        for (i=1; i<t1; i++) {
          z=z+'\n'+t2+i+'.'+t3;
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(z));
        element.setAttribute('download', t4+'.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
  });
};