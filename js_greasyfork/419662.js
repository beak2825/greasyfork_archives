// ==UserScript==
// @name         Easybytez DDL
// @namespace    StephenP
// @version      1.3.5
// @description  Scarica automaticamente i files da easybytez, usando un account premium.
// @author       StephenP
// @match        http://www.easybytez.com/*
// @grant        GM.xmlHttpRequest
// @connect      ddlnewhit.ezyro.com
// @connect      webhitspar.ezyro.com
// @connect      ddlhitgame.ezyro.com
// @connect      ddlgames.great-site.net
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=your.email.here@example.com&item_name=Donazione+Greasy+Fork
// @downloadURL https://update.greasyfork.org/scripts/419662/Easybytez%20DDL.user.js
// @updateURL https://update.greasyfork.org/scripts/419662/Easybytez%20DDL.meta.js
// ==/UserScript==
var server=['http://ddlnewhit.ezyro.com/easy.php',
            'http://webhitspar.ezyro.com/easy.php',
            'http://ddlhitgame.ezyro.com/easy.php',
            'http://ddlgames.great-site.net/easy.php'];
var i=0;
(function () {
  var infobox=setupInfobox();
  getLink(infobox);
})();
function setupInfobox(){
  var infobox=document.createElement("DIV");
  infobox.style.position="fixed";
  infobox.style.bottom="2em";
  infobox.style.right="2em";
  infobox.style.zIndex="9999";
  infobox.style.backgroundColor="rgba(0,0,0,0.5)";
  infobox.style.borderRadius="5px";
  infobox.style.padding="1em";
  infobox.style.color="white";
  infobox.style.boxShadow="5px 5px 5px grey";
  infobox.style.textAlign="left";
  document.body.appendChild(infobox);
  return infobox;
}
function getLink(infobox){
  var link;
  var urllist=document.location.href.substring(0,document.location.href.indexOf("/",document.location.href.indexOf("/",8)+1));
  if(urllist.length<10){
    urllist=document.location.href;
  }
  infobox.innerHTML+="Ottenendo il link dal generatore n."+(i+1)+": ";
  GM.xmlHttpRequest({
    method: "POST",
    url: server[i],
    data: "urllist="+urllist,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(response) {
      try{
        var a=response.responseText.lastIndexOf('http:');
        var b=response.responseText.indexOf('<',a);
        if((a!=-1)&&(b!=-1)){
          var link=response.responseText.substring(a,b);
          if((!link.includes('//dcrypt.it'))&&(response.responseText.includes('//dcrypt.it'))){
            infobox.innerHTML+="ok.<br>Download avviato.";
            setTimeout(function(){infobox.style.display="none";},5000);
            window.open(link,"_self");
          }
          else{
            serverDown(infobox);
          }
        }
        else{
          serverDown(infobox);
        }
      }
      catch(err){
        serverDown(infobox);
      }
    },
    onerror: function(response){
      serverDown(infobox);
    }
  });
}
function serverDown(infobox){
  i++;
  infobox.innerHTML+="fallito.<br>";
  if(i<server.length){
    getLink(infobox);
  }
  else{
    alert("<Nessun server disponibile per la generazione di link premium.");
    infobox.style.display="none";
  }
}