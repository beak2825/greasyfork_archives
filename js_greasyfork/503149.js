// ==UserScript==
// @name         Remove Cookies
// @description  The companion script for Bypass Paywalls.
// @author       Joe Fang (https://github.com/MinecraftFuns)
// @namespace    https://github.com/CodeMaintainer/EternityGreek/
// @supportURL   https://github.com/CodeMaintainer/EternityGreek/issues
// @icon         https://cdn.jsdelivr.net/gh/CodeMaintainer/EternityGreek@0.0.1/assets/remove-cookies-icon-32.png
// @run-at       document-start
// @version      0.0.0
// @match        *://*.adweek.com/*
// @match        *://*.ad.nl/*
// @match        *://*.americanbanker.com/*
// @match        *://*.ambito.com/*
// @match        *://*.baltimoresun.com/*
// @match        *://*.barrons.com/*
// @match        *://*.bloombergquint.com/*
// @match        *://*.bloomberg.com/*
// @match        *://*.bndestem.nl/*
// @match        *://*.bostonglobe.com/*
// @match        *://*.bd.nl/*
// @match        *://*.brisbanetimes.com.au/*
// @match        *://*.businessinsider.com/*
// @match        *://*.caixinglobal.com/*
// @match        *://*.centralwesterndaily.com.au/*
// @match        *://*.acs.org/*
// @match        *://*.chicagotribune.com/*
// @match        *://*.corriere.it/*
// @match        *://*.chicagobusiness.com/*
// @match        *://*.dailypress.com/*
// @match        *://*.gelderlander.nl/*
// @match        *://*.groene.nl/*
// @match        *://*.destentor.nl/*
// @match        *://*.speld.nl/*
// @match        *://*.tijd.be/*
// @match        *://*.volkskrant.nl/*
// @match        *://*.demorgen.be/*
// @match        *://*.denverpost.com/*
// @match        *://*.df.cl/*
// @match        *://*.editorialedomani.it/*
// @match        *://*.dynamed.com/*
// @match        *://*.ed.nl/*
// @match        *://*.elmercurio.com/*
// @match        *://*.elpais.com/*
// @match        *://*.elperiodico.com/*
// @match        *://*.elu24.ee/*
// @match        *://*.britannica.com/*
// @match        *://*.estadao.com.br/*
// @match        *://*.examiner.com.au/*
// @match        *://*.expansion.com/*
// @match        *://*.fnlondon.com/*
// @match        *://*.financialpost.com/*
// @match        *://*.ft.com/*
// @match        *://*.firstthings.com/*
// @match        *://*.foreignpolicy.com/*
// @match        *://*.fortune.com/*
// @match        *://*.genomeweb.com/*
// @match        *://*.glassdoor.com/*
// @match        *://*.globes.co.il/*
// @match        *://*.grubstreet.com/*
// @match        *://*.haaretz.co.il/*
// @match        *://*.haaretz.com/*
// @match        *://*.handelsblatt.com/*
// @match        *://*.harpers.org/*
// @match        *://*.courant.com/*
// @match        *://*.hbr.org/*
// @match        *://*.heraldsun.com.au/*
// @match        *://*.fd.nl/*
// @match        *://*.historyextra.com/*
// @match        *://*.humo.be/*
// @match        *://*.ilmanifesto.it/*
// @match        *://*.inc.com/*
// @match        *://*.interest.co.nz/*
// @match        *://*.investorschronicle.co.uk/*
// @match        *://*.lecho.be/*
// @match        *://*.labusinessjournal.com/*
// @match        *://*.lanacion.com.ar/*
// @match        *://*.repubblica.it/*
// @match        *://*.lastampa.it/*
// @match        *://*.latercera.com/*
// @match        *://*.lavoixdunord.fr/*
// @match        *://*.ledevoir.com/*
// @match        *://*.leparisien.fr/*
// @match        *://*.lesechos.fr/*
// @match        *://*.loebclassics.com/*
// @match        *://*.lrb.co.uk/*
// @match        *://*.latimes.com/*
// @match        *://*.mit.edu/*
// @match        *://*.technologyreview.com/*
// @match        *://*.medium.com/*
// @match        *://*.medscape.com/*
// @match        *://*.mexiconewsdaily.com/*
// @match        *://*.mv-voice.com/*
// @match        *://*.nationalgeographic.com/*
// @match        *://*.nydailynews.com/*
// @match        *://*.nrc.nl/*
// @match        *://*.ntnews.com.au/*
// @match        *://*.nationalpost.com/*
// @match        *://*.nzz.ch/*
// @match        *://*.nymag.com/*
// @match        *://*.nzherald.co.nz/*
// @match        *://*.ocregister.com/*
// @match        *://*.orlandosentinel.com/*
// @match        *://*.pzc.nl/*
// @match        *://*.paloaltoonline.com/*
// @match        *://*.parool.nl/*
// @match        *://*.postimees.ee/*
// @match        *://*.qz.com/*
// @match        *://*.quora.com/*
// @match        *://*.gelocal.it/*
// @match        *://*.republic.ru/*
// @match        *://*.reuters.com/*
// @match        *://*.sandiegouniontribune.com/*
// @match        *://*.sfchronicle.com/*
// @match        *://*.scientificamerican.com/*
// @match        *://*.seekingalpha.com/*
// @match        *://*.slate.com/*
// @match        *://*.sofrep.com/*
// @match        *://*.statista.com/*
// @match        *://*.startribune.com/*
// @match        *://*.stuff.co.nz/*
// @match        *://*.sun-sentinel.com/*
// @match        *://*.techinasia.com/*
// @match        *://*.telegraaf.nl/*
// @match        *://*.adelaidenow.com.au/*
// @match        *://*.theadvocate.com.au/*
// @match        *://*.theage.com.au/*
// @match        *://*.the-american-interest.com/*
// @match        *://*.theathletic.com/*
// @match        *://*.theathletic.co.uk/*
// @match        *://*.theatlantic.com/*
// @match        *://*.afr.com/*
// @match        *://*.theaustralian.com.au/*
// @match        *://*.bizjournals.com/*
// @match        *://*.canberratimes.com.au/*
// @match        *://*.thecourier.com.au/*
// @match        *://*.couriermail.com.au/*
// @match        *://*.thecut.com/*
// @match        *://*.dailytelegraph.com.au/*
// @match        *://*.thediplomat.com/*
// @match        *://*.economist.com/*
// @match        *://*.theglobeandmail.com/*
// @match        *://*.theherald.com.au/*
// @match        *://*.thehindu.com/*
// @match        *://*.irishtimes.com/*
// @match        *://*.kansascity.com/*
// @match        *://*.mercurynews.com/*
// @match        *://*.themercury.com.au/*
// @match        *://*.mcall.com/*
// @match        *://*.thenation.com/*
// @match        *://*.thenational.scot/*
// @match        *://*.newstatesman.com/*
// @match        *://*.nytimes.com/*
// @match        *://*.newyorker.com/*
// @match        *://*.news-gazette.com/*
// @match        *://*.theolivepress.es/*
// @match        *://*.inquirer.com/*
// @match        *://*.thesaturdaypaper.com.au/*
// @match        *://*.seattletimes.com/*
// @match        *://*.spectator.com.au/*
// @match        *://*.spectator.co.uk/*
// @match        *://*.smh.com.au/*
// @match        *://*.telegraph.co.uk/*
// @match        *://*.thestar.com/*
// @match        *://*.wsj.com/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.thewrap.com/*
// @match        *://*.themarker.com/*
// @match        *://*.the-tls.co.uk/*
// @match        *://*.towardsdatascience.com/*
// @match        *://*.trouw.nl/*
// @match        *://*.tubantia.nl/*
// @match        *://*.vanityfair.com/*
// @match        *://*.vn.nl/*
// @match        *://*.vulture.com/*
// @match        *://*.journalnow.com/*
// @match        *://*.wired.com/*
// @match        *://*.worldpoliticsreview.com/*
// @match        *://*.zeit.de/*
// @downloadURL https://update.greasyfork.org/scripts/503149/Remove%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/503149/Remove%20Cookies.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Function to delete all cookies
    const deleteAllCookies = () => {
        const cookies = document.cookie.split(";");

        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos === -1 ? cookie : cookie.substring(0, eqPos);
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    };

    // Execute the function to delete cookies
    deleteAllCookies();
    console.log("All cookies have been cleaned.");
})();
