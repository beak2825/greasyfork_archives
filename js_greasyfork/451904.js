// ==UserScript==
// @name            Facebook Ads Blocker
// @name:it         Blocco Annunci Facebook
// @namespace       https://greasyfork.org/
// @version         1.3.4
// @description     Remove sponsored posts from Facebook /September 2022/
// @description:it  Rimuove post sponsorizzati e pubblicità da Facebook /Settembre 2022/
// @author          deviato
// @match           https://www.facebook.com/*
// @icon            https://www.google.com/s2/favicons?domain=www.facebook.com
// @grant           none
// @run-at          document-end
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/451904/Facebook%20Ads%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/451904/Facebook%20Ads%20Blocker.meta.js
// ==/UserScript==
var i18n=['Babestua','Bersponsor','Chartered','Commandité','Disponsori','Ditaja','Được tài trợ','Geborg','Gesponsert','Gesponsord','Giisponsoran','Hirdetés','La maalgeliyey','May Sponsor','Noddwyd','Oñepatrosinapyre','Paeroniet','Patrocinado','Patrocinat','Publicidad','Reklamo','Sponsitud','Sponsor dəstəkli','Sponsore','Sponsored','Sponsoreret','Sponsorisé','Sponsorizzata','Sponsorizzato','Sponsorlu','Sponsoroitu','Sponsorowane','Sponsrad','Sponzorirano','Sponzorováno','Spunsurizatu','Stuðlað','Urraithe','Yatiyanaka','Χορηγούμενη','Χορηγούμενον','Демеушілік көрсеткен','Ивээн тэтгэсэн','Реклама','Рэклама','Спонзорирано','Спонсорирано','إعلان مُموَّل','پاڵپشتیکراو','تعاون کردہ','تمويل شوي','دارای پشتیبانی مالی','ⵉⴷⵍ','የተከፈለበት ማስታወቂያ','प्रायोजितः |','प्रायोजित','পৃষ্ঠপোষকতা কৰা','সৌজন্যে','ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ','ପ୍ରଯୋଜିତ','స్పాన్సర్ చేసినవి','സ്പോൺസർ ചെയ്തത്','අනුග්‍රහය දක්වන ලද','ได้รับการสนับสนุน','ໄດ້ຮັບການສະໜັບສະໜູນ','បានឧបត្ថម្ភ','広告','贊助','赞助内容',
].map(e=>e.toLocaleLowerCase());
var sug='Contenuto suggerito per te'; //Change with your localized text for "Suggested Posts"

(function() {
if(window.top!=window.self) return;
var obs=new MutationObserver(function(mutations){
  mutations.forEach(function(mutation){
    if(mutation.type==='childList') {
      var it=mutation.addedNodes[0];
      if(it&&it.nodeType===1&&it.querySelector('div')){
        //console.log('>feed'); console.log(it);
        //Search for suggested post (20div+span)
        var ls=it.querySelector("div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>div>span");
        if(ls) {
          //console.log('ls:'+ls.textContent);
          if(ls.textContent==sug) {
            //it.style.opacity=0.2;
            it.parentNode.removeChild(it);
            snt++;
            lg.innerHTML="Blocked Ads: "+cnt+" • Suggested: "+snt;
            console.log('Removed suggested post');
          }
        }
        //Search for ads
        var ln=it.querySelector("div span span span span a[role=link][href='#']");
        if(ln) {
          //console.log('ln->a'); console.log(ln);
          var spn=ln.querySelector('span>span');
          /*var svg=ln.getElementsByTagName('svg');
          if(svg) {
            var sw=svg[0].clientWidth+parseInt(svg[0].style.marginRight);*/
          if(spn) {
            var sw=spn.clientWidth;
            //console.log('sw:'+sw);
            if(sw>40&&sw<100) {
              //console.log(ln);
              //it.style.opacity=0.2;
              it.parentNode.removeChild(it);
              cnt++;
              lg.innerHTML="Blocked Ads: "+cnt+" • Suggested: "+snt;
              console.log('Removed sponsored post');
            }
          }
        }
      }
    }
  });
});
var lg;
var cnt=0; var snt=0;
var tm;
var tgt=document.querySelector('#ssrb_feed_start');
if(tgt) watch();
else {
  tm=setInterval(function(){
    tgt=document.querySelector('#ssrb_feed_start');
    if(tgt) {
      console.log('found');
      clearInterval(tm);
      watch();
    }
  },2000);
}
function watch(){
  tgt=tgt.parentNode.querySelector('div');
  //console.log('tgt:');console.log(tgt);
  obs.observe(tgt,{characterData:true,attributes:true,childList:true,subtree:true});
  lg=document.querySelector('div[role=complementary]>div>div');
  var it=document.createElement('span');
  it.style.cssText="margin:5px 15px -18px;padding:3px 5px 0;border:1px solid #ccc;width:fit-content";
  lg.insertBefore(it,lg.firstChild);
  lg=it;
  var rig=document.querySelector('div[role=complementary]>div>div>div>div>div>span>div');
  if(rig!=null) {
    var txt=rig.querySelector('h3').textContent.toLocaleLowerCase();
    if(i18n.indexOf(txt)>=0) {
      //console.log(rig);
      //rig.parentNode.style.opacity=0.2;
      rig.parentNode.style.display="none";
      cnt++;
      lg.innerHTML="Blocked Ads: "+cnt+" • Suggested: "+snt;
      console.log('Removed Right Ad');
    }
  }
}
})();