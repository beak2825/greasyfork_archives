// ==UserScript==
// @name        12ft Redirect
// @namespace   https://hectoralvf.com
// @description Redirects articles from various websites to 12ft.io URL with the current page URL appended.
// @version     1.0.1
// @grant       none
// @author      Héctor Álvarez
// @license     MIT
//
// MEDIOS NACIONALES
// @match       *://*.elpais.com/*
// @match       *://*.lavozdegalicia.es/*
// @match       *://*.elmundo.es/*
// @match       *://*.lavanguardia.com/*
// @match       *://*.eldiario.es/*
// @match       *://*.expansion.com/*
// @match       *://*.elconfidencial.com/*
// @match       *://*.elespanol.com/*
// @match       *://*.abc.es/*
// @match       *://*.elcorreo.com/*
// @match       *://*.lne.es/*
// @match       *://*.farodevigo.es/*
// @match       *://*.larazon.es/*
// @match       *://*.elcorreogallego.es/*
// @match       *://*.laopinioncoruna.es/*
// @match       *://*.cincodias.com/*
// @match       *://*cincodias.elpais.com/*
// @match       *://*.eleconomista.es/*
// @match       *://*.eleconomista.com/*
//
// MEDIOS INTERNACIONALES
// @match       *://*.adweek.com/*
// @match       *://*.ambito.com/*
// @match       *://*.americanbanker.com/*
// @match       *://*.baltimoresun.com/*
// @match       *://*.barrons.com/*
// @match       *://*.bloomberg.com/*
// @match       *://*.bloombergquint.com/*
// @match       *://*.bostonglobe.com/*
// @match       *://*.brisbanetimes.com.au/*
// @match       *://*.businessinsider.com/*
// @match       *://*.caixinglobal.com/*
// @match       *://*.centralwesterndaily.com.au/*
// @match       *://*.cen.acs.org/*
// @match       *://*.chicagotribune.com/*
// @match       *://*.corriere.it/*
// @match       *://*.chicagobusiness.com/*
// @match       *://*.dailypress.com/*
// @match       *://*.groene.nl/*
// @match       *://*.demorgen.be/*
// @match       *://*.denverpost.com/*
// @match       *://*.speld.nl/*
// @match       *://*.tijd.be/*
// @match       *://*.volkskrant.nl/*
// @match       *://*.df.cl/*
// @match       *://*.editorialedomani.it/*
// @match       *://*.dynamed.com/*
// @match       *://*.elmercurio.com/*
// @match       *://*.elperiodico.com/*
// @match       *://*.elu24.ee/*
// @match       *://*.britannica.com/*
// @match       *://*.estadao.com.br/*
// @match       *://*.examiner.com.au/*
// @match       *://*.fnlondon.com/*
// @match       *://*.financialpost.com/*
// @match       *://*.ft.com/*
// @match       *://*.firstthings.com/*
// @match       *://*.foreignpolicy.com/*
// @match       *://*.fortune.com/*
// @match       *://*.genomeweb.com/*
// @match       *://*.glassdoor.com/*
// @match       *://*.globes.co.il/*
// @match       *://*.grubstreet.com/*
// @match       *://*.haaretz.com/*
// @match       *://*.haaretz.co.il/*
// @match       *://*.harpers.org/*
// @match       *://*.courant.com/*
// @match       *://*.hbr.org/*
// @match       *://*.hbrchina.org/*
// @match       *://*.heraldsun.com.au/*
// @match       *://*.fd.nl/*
// @match       *://*.historyextra.com/*
// @match       *://*.humo.be/*
// @match       *://*.ilmanifesto.it/*
// @match       *://*.ilmessaggero.it/*
// @match       *://*.inc.com/*
// @match       *://*.interest.co.nz/*
// @match       *://*.investorschronicle.co.uk/*
// @match       *://*.lanacion.com.ar/*
// @match       *://*.repubblica.it/*
// @match       *://*.lastampa.it/*
// @match       *://*.latercera.com/*
// @match       *://*.lavoixdunord.fr/*
// @match       *://*.lecho.be/*
// @match       *://*.ledevoir.com/*
// @match       *://*.leparisien.fr/*
// @match       *://*.lesechos.fr/*
// @match       *://*.loebclassics.com/*
// @match       *://*.lrb.co.uk/*
// @match       *://*.labusinessjournal.com/*
// @match       *://*.latimes.com/*
// @match       *://*.medium.com/*
// @match       *://*.medscape.com/*
// @match       *://*.mexiconewsdaily.com/*
// @match       *://*.sloanreview.mit.edu/*
// @match       *://*.technologyreview.com/*
// @match       *://*.mv-voice.com/*
// @match       *://*.nationalgeographic.com/*
// @match       *://*.nationalpost.com/*
// @match       *://*.nzz.ch/*
// @match       *://*.newstatesman.com/*
// @match       *://*.nydailynews.com/*
// @match       *://*.nymag.com/*
// @match       *://*.nzherald.co.nz/*
// @match       *://*.nrc.nl/*
// @match       *://*.ntnews.com.au/*
// @match       *://*.ocregister.com/*
// @match       *://*.orlandosentinel.com/*
// @match       *://*.paloaltoonline.com/*
// @match       *://*.parool.nl/*
// @match       *://*.postimees.ee/*
// @match       *://*.qz.com/*
// @match       *://*.quora.com/*
// @match       *://*.gelocal.it/*
// @match       *://*.republic.ru/*
// @match       *://*.reuters.com/*
// @match       *://*.sandiegouniontribune.com/*
// @match       *://*.sfchronicle.com/*
// @match       *://*.scientificamerican.com/*
// @match       *://*.seekingalpha.com/*
// @match       *://*.slate.com/*
// @match       *://*.sofrep.com/*
// @match       *://*.startribune.com/*
// @match       *://*.statista.com/*
// @match       *://*.stuff.co.nz/*
// @match       *://*.sueddeutsche.de/*
// @match       *://*.scmp.com/*
// @match       *://*.sun-sentinel.com/*
// @match       *://*.techinasia.com/*
// @match       *://*.telegraaf.nl/*
// @match       *://*.time.com/*
// @match       *://*.adelaidenow.com.au/*
// @match       *://*.theadvocate.com.au/*
// @match       *://*.theage.com.au/*
// @match       *://*.the-american-interest.com/*
// @match       *://*.theathletic.com/*
// @match       *://*.theathletic.co.uk/*
// @match       *://*.theatlantic.com/*
// @match       *://*.afr.com/*
// @match       *://*.theaustralian.com.au/*
// @match       *://*.bizjournals.com/*
// @match       *://*.canberratimes.com.au/*
// @match       *://*.thecourier.com.au/*
// @match       *://*.couriermail.com.au/*
// @match       *://*.thecut.com/*
// @match       *://*.dailytelegraph.com.au/*
// @match       *://*.thediplomat.com/*
// @match       *://*.economist.com/*
// @match       *://*.theglobeandmail.com/*
// @match       *://*.theherald.com.au/*
// @match       *://*.thehindu.com/*
// @match       *://*.irishtimes.com/*
// @match       *://*.japantimes.co.jp/*
// @match       *://*.kansascity.com/*
// @match       *://*.themarker.com/*
// @match       *://*.mercurynews.com/*
// @match       *://*.themercury.com.au/*
// @match       *://*.mcall.com/*
// @match       *://*.thenation.com/*
// @match       *://*.thenational.scot/*
// @match       *://*.news-gazette.com/*
// @match       *://*.newyorker.com/*
// @match       *://*.nytimes.com/*
// @match       *://*.theolivepress.es/*
// @match       *://*.inquirer.com/*
// @match       *://*.thesaturdaypaper.com.au/*
// @match       *://*.seattletimes.com/*
// @match       *://*.spectator.com.au/*
// @match       *://*.spectator.co.uk/*
// @match       *://*.spectator.us/*
// @match       *://*.smh.com.au/*
// @match       *://*.telegraph.co.uk/*
// @match       *://*.thestar.com/*
// @match       *://*.wsj.com/*
// @match       *://*.washingtonpost.com/*
// @match       *://*.thewrap.com/*
// @match       *://*.the-tls.co.uk/*
// @match       *://*.towardsdatascience.com/*
// @match       *://*.trouw.nl/*
// @match       *://*.vanityfair.com/*
// @match       *://*.vn.nl/*
// @match       *://*.vulture.com/*
// @match       *://*.journalnow.com/*
// @match       *://*.wired.com/*
// @downloadURL https://update.greasyfork.org/scripts/490836/12ft%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/490836/12ft%20Redirect.meta.js
// ==/UserScript==

(function() {
  // Create button on every page
  var floatingButton = document.createElement("button");
  floatingButton.style.position = "fixed";
  floatingButton.style.bottom = "10px";
  floatingButton.style.right = "10px";
  floatingButton.style.zIndex = "9999";
  floatingButton.style.backgroundColor = "white";
  floatingButton.style.borderRadius = "50px";
  floatingButton.style.padding = "10px 20px";
  floatingButton.style.color = "#666";
  floatingButton.style.fontSize = "14px";
  floatingButton.style.fontFamily = "Roboto, sans-serif";
  floatingButton.style.cursor = "pointer";
  floatingButton.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";  // Apply faint shadow
  floatingButton.style.border = "none";  // Remove border
  floatingButton.textContent = "\u{1F517} 12ft.io";

  document.body.appendChild(floatingButton);

  // Redirect to 12ft.io when button is clicked
  floatingButton.addEventListener("click", function() {
    var currentURL = window.location.href;
    var redirectURL = "https://12ft.io/" + currentURL;
    window.location.href = redirectURL;
  });
})();