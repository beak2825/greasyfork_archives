// ==UserScript==
// @name         Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a quick Archive.today(Archive.ph) lookup button
// @author       Eric
// @license MIT
// @match       *://*.zaobao.com.sg/*
// @match       *://*.zaobao.com/*
// @match       *://*.adelaidenow.com.au/*
// @match       *://*.adweek.com/*
// @match       *://*.afr.com/*
// @match       *://*.ambito/*
// @match       *://*.ampproject.org/*
// @match       *://*.baltimoresun.com/*
// @match       *://*.barrons.com/*
// @match       *://*.bizjournals.com/*
// @match       *://*.bloomberg.com/*
// @match       *://*.bloombergquint.com/*
// @match       *://*.bostonglobe.com/*
// @match       *://*.brisbanetimes.com.au/*
// @match       *://*.britannica.com/*
// @match       *://*.businessinsider.com/*
// @match       *://*.caixinglobal.com/*
// @match       *://*.cen.acs.org/*
// @match       *://*.centralwesterndaily.com.au/*
// @match       *://*.chicagobusiness.com/*
// @match       *://*.chicagotribune.com/*
// @match       *://*.corriere.it/*
// @match       *://*.courant.com/*
// @match       *://*.couriermail.com.au/*
// @match       *://*.dailypress.com/*
// @match       *://*.dailytelegraph.com.au/*
// @match       *://*.delfi.ee/*
// @match       *://*.demorgen.be/*
// @match       *://*.denverpost.com/*
// @match       *://*.df.cl/*
// @match       *://*.dynamed.com/*
// @match       *://*.economist.com/*
// @match       *://*.elmercurio.com/*
// @match       *://*.elmundo.es/*
// @match       *://*.elu24.ee/*
// @match       *://*.entreprenal.com/*
// @match       *://*.examiner.com.au/*
// @match       *://*.expansion.com/*
// @match       *://*.fd.nl/*
// @match       *://*.financialpost.com/*
// @match       *://*.fnlondon.com/*
// @match       *://*.foreignpolicy.com/*
// @match       *://*.fortune.com/*
// @match       *://*.ft.com/*
// @match       *://*.gelocal.it/*
// @match       *://*.genomeweb.com/*
// @match       *://*.glassdoor.com/*
// @match       *://*.globes.co.il/*
// @match       *://*.groene.nl/*
// @match       *://*.haaretz.co.il/*
// @match       *://*.haaretz.com/*
// @match       *://*.harpers.org/*
// @match       *://*.hbr.org/*
// @match       *://*.hbrchina.org/*
// @match       *://*.heraldsun.com.au/*
// @match       *://*.historyextra.com/*
// @match       *://*.humo.be/*
// @match       *://*.ilmanifesto.it/*
// @match       *://*.inc.com/*
// @match       *://*.inquirer.com/*
// @match       *://*.interest.co.nz/*
// @match       *://*.investorschronicle.co.uk/*
// @match       *://*.irishtimes.com/*
// @match       *://*.japantimes.co.jp/*
// @match       *://*.journalnow.com/*
// @match       *://*.kansascity.com/*
// @match       *://*.labusinessjournal.com/*
// @match       *://*.lanacion.com.ar/*
// @match       *://*.lastampa.it/*
// @match       *://*.latercera.com/*
// @match       *://*.latimes.com/*
// @match       *://*.lavoixdunord.fr/*
// @match       *://*.lecho.be/*
// @match       *://*.leparisien.fr/*
// @match       *://*.lesechos.fr/*
// @match       *://*.loebclassics.com/*
// @match       *://*.lrb.co.uk/*
// @match       *://*.mcall.com/*
// @match       *://*.medium.com/*
// @match       *://*.medscape.com/*
// @match       *://*.mercurynews.com/*
// @match       *://*.mv-voice.com/*
// @match       *://*.nationalpost.com/*
// @match       *://*.netdna-ssl.com/*
// @match       *://*.news-gazette.com/*
// @match       *://*.newstatesman.com/*
// @match       *://*.newyorker.com/*
// @match       *://*.nrc.nl/*
// @match       *://*.ntnews.com.au/*
// @match       *://*.nydailynews.com/*
// @match       *://*.nymag.com/*
// @match       *://*.nytimes.com/*
// @match       *://*.nzherald.co.nz/*
// @match       *://*.nzz.ch/*
// @match       *://*.ocregister.com/*
// @match       *://*.orlandosentinel.com/*
// @match       *://*.outbrain.com/*
// @match       *://*.paloaltoonline.com/*
// @match       *://*.parool.nl/*
// @match       *://*.piano.io/*
// @match       *://*.poool.fr/*
// @match       *://*.postimees.ee/*
// @match       *://*.qiota.com/*
// @match       *://*.qz.com/*
// @match       *://*.repubblica.it/*
// @match       *://*.republic.ru/*
// @match       *://*.reuters.com/*
// @match       *://*.sandiegouniontribune.com/*
// @match       *://*.scientificamerican.com/*
// @match       *://*.scmp.com/*
// @match       *://*.seattletimes.com/*
// @match       *://*.seekingalpha.com/*
// @match       *://*.slate.com/*
// @match       *://*.smh.com.au/*
// @match       *://*.sofrep.com/*
// @match       *://*.spectator.co.uk/*
// @match       *://*.spectator.com.au/*
// @match       *://*.spectator.us/*
// @match       *://*.speld.nl/*
// @match       *://*.startribune.com/*
// @match       *://*.statista.com/*
// @match       *://*.stuff.co.nz/*
// @match       *://*.sueddeutsche.de/*
// @match       *://*.sun-sentinel.com/*
// @match       *://*.techinasia.com/*
// @match       *://*.technologyreview.com/*
// @match       *://*.telegraaf.nl/*
// @match       *://*.telegraph.co.uk/*
// @match       *://*.the-tls.co.uk/*
// @match       *://*.theadvocate.com.au/*
// @match       *://*.theage.com.au/*
// @match       *://*.theathletic.co.uk/*
// @match       *://*.theathletic.com/*
// @match       *://*.theatlantic.com/*
// @match       *://*.theaustralian.com.au/*
// @match       *://*.thediplomat.com/*
// @match       *://*.theglobeandmail.com/*
// @match       *://*.theherald.com.au/*
// @match       *://*.thehindu.com/*
// @match       *://*.themarker.com/*
// @match       *://*.themercury.com.au/*
// @match       *://*.thenation.com/*
// @match       *://*.thenational.scot/*
// @match       *://*.theolivepress.es/*
// @match       *://*.thesaturdaypaper.com.au/*
// @match       *://*.thestar.com/*
// @match       *://*.thewrap.com/*
// @match       *://*.tijd.be/*
// @match       *://*.time.com/*
// @match       *://*.tinypass.com/*
// @match       *://*.towardsdatascience.com/*
// @match       *://*.trouw.nl/*
// @match       *://*.vanityfair.com/*
// @match       *://*.vn.nl/*
// @match       *://*.volkskrant.nl/*
// @match       *://*.washingtonpost.com/*
// @match       *://*.wired.com/*
// @match       *://*.wsj.com/*
// @match       *://*.zeit.de/*
// @match       *://*.usatoday.com/*
// @match       *://*.time.com/*
// @match       *://*.theatlantic.com/*
// @match       *://*.americanbanker.com/*
// @match       *://*.japantimes.co.jp/*
// @match       *://*.wsj.com/*
// @match       *://*.cnbc.com/*
// @match       *://*.financialpost.com/*
// @match       *://*.wired.com/*
// @match       *://*.seekingalpha.com/*
// @match       *://*.ipolitics.ca/*
// @match       *://*.discovermagazine.com/*
// @match       *://*.faz.net/*
// @match       *://*.rp-online.de/*
// @match       *://*.spiegel.de/*
// @match       *://*.tagesspiegel.de/*
// @match       *://*.welt.de/*
// @match       *://*.wz.de/*
// @match       *://*.rp.pl/*
// @match       *://*.wyborcza.pl/*
// @match       *://*.tagesanzeiger.ch/*
// @match       *://*.elpais.com/*
// @match       *://*.english.elpais.com/*
// @match       *://*.insight.kontan.co.id/*
// @match       *://*.inkl.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537795/Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/537795/Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openArchiveLookup(url) {
        const archiveUrl = `https://archive.ph/${encodeURIComponent(url)}`;
        window.open(archiveUrl, '_blank');
    }

    function createLookupButton() {
        const button = document.createElement('button');
        button.textContent = 'Paywall';
        button.style.position = 'fixed';
        button.style.bottom = '70px';
        button.style.right = '10px';
        button.style.backgroundColor = '#222';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.padding = '10px 12px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000';
        button.style.fontSize = '14px';
        button.style.opacity = '0.85';

        button.addEventListener('click', () => {
            openArchiveLookup(window.location.href);
        });

        document.body.appendChild(button);
    }

    createLookupButton();
})();
