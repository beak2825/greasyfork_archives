// ==UserScript==
// @name Sugg
// @namespace Sugg Systems
// @description Provides link suggestions based on the current page, similar to youtube
// @match *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @noframes
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version 0.0.1.20190313025650
// @downloadURL https://update.greasyfork.org/scripts/378332/Sugg.user.js
// @updateURL https://update.greasyfork.org/scripts/378332/Sugg.meta.js
// ==/UserScript==


function suggdiv() {
  var div = $('<body>');
  div.css('min-height','100%');
  div.css('width','25%');
  div.css('display','flex');
  div.css('flex-flow','column');
  return div;
}

function suggmagic(history,url,title,cb) {
 $.post('https://sugg.lifelist.pw/',JSON.stringify({history,url,title}),rank=>{
  cb(null,rank);
 }).fail(err=>{
  cb(err);
 });
}

function rankitem2div(item) {
  var div = $('<div>').css('padding','8px');
  var a = $('<a>').attr('href',item.href).text(item.title||item.href);
  div.append(a);
  return div;
}


function main(skipnotacheck) {
 if(!skipnotacheck && location.host==='notabug.io' && location.pathname.startsWith('/t/') && !location.pathname.startsWith('/t/all')) {
  return setTimeout(()=>{
   document.title = $('.title.may-blank').first().text();
   main(true);
  },2000);
 }
 var url = location.toString();
 if(testOmit(url)) {
  return;
 }
 var suggbox = suggdiv();
 jQuery(document.body).css('width','75%').after(suggbox).parent().css({display:'flex','flex-flow':'row'});
 var history=GM_getValue('history','[]')
 history=JSON.parse(history);
 console.log('history',history);
 suggmagic(history,url,document.title,(err,rank)=>{
  if(err) { return console.log('err',err); }
  rank.slice(0,13).forEach(r=>{
   suggbox.append(rankitem2div(r));
  });
 });
 history = history.filter(i=>i!=url);
 history = history.slice(-16);
 history.push(url);
 GM_setValue('history',JSON.stringify(history));
}

main();

function regexlist () {
 return [
/google.com\/recaptcha/,
/imgoat.com\/uploads/,
/phuks.co\/submit/,
/\/sign_in/,
/i\.imgtc\.com/,
/voat.co\/submit/,
/\login\?/,
/voat\.co\/submit/,
/https?:\/\/searx\.me/,
/https?:\/\/greasyfork.org\/en\/script_versions/,
/porn/,
/facebook.com\/./,
/linkedin.com\/./,
/livejasmine.com/,
/voat.co\/messages/,
/button.flattr.com\/./,
/xhamster.com/,
/xvideos.com/,
/xnxx.com/,
/redtube.com/,
/youporn.com/,
/youtube\.com\/embed\//,
/voat\.co\/v\/\w+\/submit/,
/accounts\.google\.com\//,
/platform\.twitter\.com\/widgets\//,
/\/embed\//,
/poal\.co\/messages/,
];
}

function testOmit(url) {
 var tests= regexlist();
 for(var c=0;c<tests.length;++c) {
  if(url.match(tests[c])) {
   return true;
  }
 }
}
