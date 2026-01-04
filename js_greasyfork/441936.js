// ==UserScript==
// @name        Tinder: show teasers (deblur)
// @name:it     Tinder: mostra i teasers (rimuove la sfocatura)
// @description Show the last people who liked you for free: this script deblurs the photos of the teasers, revealing the people who liked you. This script only allows you to see those photos: you can't directly access the profiles like you would do with a paid account.
// @description:it Mostra gratis le ultime persone che hanno apprezzato il tuo profilo: questo script toglie la sfocatura dalle foto dei teasers, rivelando le persone a cui sei piaciuto/a. Questo script permette solo di vedere le foto: non puoi accedere direttamente ai profili come faresti con un account a pagamento.
// @namespace   StephenP
// @author      StephenP
// @match       https://tinder.com/*
// @grant       none
// @version     1.0.0.1
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @icon  data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAM1BMVEUAAAAaDg9FExc+IiSHJC5mRUazNEa9RkD/PHflSV//RG+Va237ZF7/b1m0g4bXnaL/xMh03AoiAAAAAXRSTlMAQObYZgAAALRJREFUKM91kIkSwyAIRBO8gGDi/39twSu2HdcZXfeJ13GswmMjxC3YINwR3BBG1pxxTdpghJcSZu5D19y6WiJk0sZzL4ree+0AIJqP1EoiuOsKFlKE5mMF7iqqxxELubt5y89Qqm4g8sOfBp42KY4EyvC20wSJpv+reJaK9wyRrzPGrSCJJGj+bA/Uu4egeTZS/Xh58kmXZ8k5S7KXj78SU+5N9X672OKuNVcy0p9c1cmcfwCutQ25ADm5EQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/441936/Tinder%3A%20show%20teasers%20%28deblur%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441936/Tinder%3A%20show%20teasers%20%28deblur%29.meta.js
// ==/UserScript==
(function(){
  setInterval(check,2000);
})();

function check(){
  if((document.location.href.includes('/app/likes-you'))||(document.location.href.includes('/app/gold-home'))){
    var cards=document.querySelectorAll('.Expand.enterAnimationContainer');
    for (let i = 0; i < cards.length; ++i) {
      if(cards[i].children[0].style.backgroundImage.includes("images-ssl")){
        deblur(cards);
        break;
      }
    }
  }
}

async function deblur(cards) {
  console.log("Deblurring photos...");
  const teasers = await fetch("https://api.gotinder.com/v2/fast-match/teasers", { "headers": { "X-Auth-Token": localStorage.getItem('TinderWeb/APIToken') }}).then(res => res.json()).then(res => res.data.results);
  for (let i = 0; i < cards.length; ++i) {
    
    const teaser = teasers[i];
    const teaserDiv = cards[i].children[0];
    
    const picture = teaser.user.photos[0].processedFiles[1].url;
    
    teaserDiv.style.backgroundImage = "url(\""+picture+"\")";
  }
  console.log("Deblurring photos: done!");
}