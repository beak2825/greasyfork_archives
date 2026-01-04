// ==UserScript==
// @name Streaming - Tolbek + Clones Widescreen (USw) v.93
// @namespace toblek.com
// @version 1.930.0
// @description Pour les variantes du site TOBLEK-like (Streaming): Utilisez toute la taille des fenêtres pour moins de défilement
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.moacloud/*
// @match *://*.pigraz.com/*
// @match *://*.soponov.com/*
// @match *://*.bradza.com/*
// @match *://*.udriz.com/*
// @match *://*.gomdax.com/*
// @match *://*.yakwad.com/*
// @match *://*.prifaz.com/*
// @match *://*.yarkam.com/*
// @match *://*.iramiv.com/*
// @match *://*.fimior.com/*
// @match *://*.daykaz.com/*
// @match *://*.bovriz.com/*
// @match *://*.boomycloud/*
// @match *://*.tomacloud.com/*
// @match *://*.cldmax.com/*
// @match *://*.toblek.com/*
// @match *://*.vistrov.com/*
// @match *://*.narmid.com/*
// @match *://*.slatok.com/*
// @match *://*.komrav.com/*
// @match *://*.sopror.com/*
// @match *://*.vokorn.com/*
// @match *://*.dabzov.com/*
// @match *://*.zambod.com/*
// @match *://*.ovoob.com/*
// @match *://*.baflox.com/*
// @match *://*.rizlov.com/*
// @match *://*.skimox.com/*
// @match *://*.brodok.com/*
// @match *://*.toswi.com/*
// @match *://*.brikoz.com/*
// @match *://*.avbip.com/*
// @match *://*.zinroz.com/*
// @match *://*.vadrom.com/*
// @match *://*.ladrov.com/*
// @match *://*.zivbod.com/*
// @match *://*.wavmiv.com/*
// @match *://*.voldim.com/*
// @match *://*.sevrim.com/*
// @match *://*.nakrab.com/*
// @match *://*.maxtrab.com/*
// @match *://*.fridmax.com/*
// @match *://*.mivpak.com/*
// @match *://*.alkiom.com/*
// @match *://*.trodak.com/*
// @match *://*.podvix.com/*
// @match *://*.ozpov.com/*
// @match *://*.zodrop.com/*
// @match *://*.padlim.com/*
// @match *://*.opkap.com/*
// @match *://*.batkip.com/*
// @match *://*.lekrom.com/*
// @match *://*.lofroz.com/*
// @match *://*.roplim.com/*
// @match *://*.plokim.com/*
// @match *://*.zaltav.com/*
// @match *://*.mokrof.com/*
// @match *://*.fosrak.com/*
// @match *://*.krosov.com/*
// @match *://*.izorp.com/*
// @match *://*.tartog.com/*
// @match *://*.ofziv.com/*
// @match *://*.saftim.com/*
// @match *://*.fevloz.com/*
// @match *://*.ziprov.com/*
// @match *://*.kikraz.com/*
// @match *://*.drovoo.com/*
// @match *://*.kejrop.com/*
// @match *://*.chotrom.com/*
// @match *://*.dorcho.com/*
// @match *://*.imzod.com/*
// @match *://*.borbok.com/*
// @match *://*.sodpak.com/*
// @match *://*.lamdop.com/*
// @match *://*.rivbip.com/*
// @match *://*.azrov.com/*
// @match *://*.blorog.com/*
// @match *://*.didraf.com/*
// @match *://*.viabak.com/*
// @match *://*.kradax.com/*
// @match *://*.quepom.com/*
// @match *://*.zodrok.com/*
// @match *://*.balvoz.com/*
// @match *://*.movbor.com/*
// @match *://*.faskap.com/*
// @match *://*.aksolv.com/*
// @match *://*.vifip.com/*
// @match *://*.lizdi.com/*
// @match *://*.fianzax.com/*
// @match *://*.tiviob.com/*
// @match *://*.parlif.com/*
// @match *://*.vrewal.com/*
// @match *://*.brafzo.com/*
// @match *://*.todrak.com/*
// @match *://*.yavdi.com/*
// @match *://*.zadriv.com/*
// @match *://*.ovgap.com/*
// @match *://*.sorbod.com/*
// @match *://*.trochox.com/*
// @match *://*.xodop.com/*
// @match *://*.ravkom.com/*
// @match *://*.pavdo.com/*
// @match *://*.tetriv.com/*
// @match *://*.zirkad.com/*
// @match *://*.grozov.com/*
// @match *://*.yalkaz.com/*
// @match *://*.droskop.com/*
// @match *://*.nokrom.com/*
// @match *://*.bigbov.com/*
// @match *://*.xadrop.com/*
// @match *://*.zadrip.com/*
// @match *://*.friloz.com/*
// @match *://*.azkov.com/*
// @match *://*.diprak.com/*
// @match *://*.rodzop.com/*
// @match *://*.yortom.com/*
// @match *://*.smitav.com/*
// @match *://*.fotrov.com/*
// @match *://*.kibriv.com/*
// @match *://*.ivrab.com/*
// @match *://*.dofroz.com/*
// @match *://*.fedzak.com/*
// @match *://*.govrad.com/*
// @match *://*.badzap.com/*
// @match *://*.lotriz.com/*
// @match *://*.edkoz.com/*
// @match *://*.topkiv.com/*
// @match *://*.kedarp.com/*
// @match *://*.abokav.com/*
// @match *://*.lokarn.com/*
// @match *://*.apirv.com/*
// @match *://*.rodkov.com/*
// @match *://*.bremob.com/*
// @match *://*.urmaz.com/*
// @match *://*.farliz.com/*
// @match *://*.faljam.com/*
// @match *://*.mobzax.com/*
// @match *://*.nozgap.com/*
// @match *://*.zostaz.com/*
// @match *://*.domgrav.com/*
// @match *://*.malgrim.com/*
// @match *://*.idvram.com/*
// @match *://*.karvaz.com/*
// @match *://*.lomiox.com/*
// @match *://*.vredap.com/*
// @match *://*.biapoz.com/*
// @match *://*.kambad.com/*
// @match *://*.pimtip.com/*
// @match *://*.awdrip.com/*
// @match *://*.dolorv.com/*
// @match *://*.bazrof.com/*
// @match *://*.sakmiz.com/*
// @match *://*.sapraz.com/*
// @match *://*.titrov.com/*
// @match *://*.doksov.com/*
// @match *://*.sibrav.com/*
// @match *://*.movpom.com/*
// @match *://*.pokoli.com/*
// @match *://*.veksab.com/*
// @match *://*.staklam.com/*
// @match *://*.vizvop.com/*
// @match *://*.ikfroz.com/*
// @match *://*.votark.com/*
// @match *://*.obivap.com/*
// @match *://*.alrav.com/*
// @match *://*.odvib.com/*
// @match *://*.instov.com/*
// @match *://*.dubraz.com/*
// @match *://*.toktav.com/*
// @match *://*.dromoy.com/*
// @match *://*.gabanov.com/*
// @match *://*.valdap.com/*
// @match *://*.zorbov.com/*
// @match *://*.dopriv.com/*
// @match *://*.rogzov.com/*
// @match *://*.fakoda.com/*
// @match *://*.prokiz.com/*
// @match *://*.noprak.com/*
// @match *://*.madroy.com/*
// @match *://*.batiav.com/*
// @match *://*.lakrof.com/*
// @match *://*.bramtiv.com/*
// @match *://*.gofram.com/*
// @match *://*.azmip.com/*
// @match *://*.idivov.com/*
// @match *://*.frimiv.com/*
// @match *://*.kobiom.com/*
// @match *://*.vogfo.com/*
// @match *://*.okmaz.com/*
// @match *://*.rolbob.com/*
// @match *://*.dapwop.com/*
// @match *://*.trifak.com/*
// @match *://*.dozbob.com/*
// @match *://*.robluv.com/*
// @match *://*.drikpo.com/*
// @match *://*.pradav.com/*
// @match *://*.morzid.com/*
// @match *://*.kolrag.com/*
// @match *://*.akroov.com/*
// @match *://*.folmiv.com/*
// @match *://*.yakriv.com/*
// @match *://*.savrod.com/*
// @match *://*.fusov.com/*
// @match *://*.lajma.com/*
// @match *://*.kidraz.com/*
// @match *://*.seyav.com/*
// @match *://*.xabriv.com/*
// @match *://*.brimav.com/*
// @match *://*.epzir.com/*
// @match *://*.yisera.com/*
// @match *://*.vadbak.com/*
// @match *://*.adivak.com/*
// @match *://*.pilkol.com/*
// @match *://*.brozlo.com/*
// @match *://*.padolmi.com/*
// @match *://*.edmiv.com/*
// @match *://*.niztal.com/*
// @match *://*.rodorm.com/*
// @match *://*.okrami.com/*
// @match *://*.yepmiv.com/*
// @match *://*.ilmiv.com/*
// @match *://*.robrov.com/*
// @match *://*.albrad.com/*
// @match *://*.dipdri.com/*
// @match *://*.driviv.com/*
// @match *://*.deksov.com/*
// @match *://*.fonzir.com/*
// @match *://*.govioz.com/*
// @match *://*.ipdro.com/*
// @match *://*.kanrak.com/*
// @match *://*.moovbob.com/*
// @match *://*.nodrav.com/*
// @match *://*.ralzom.com/*
// @match *://*.ritrom.com/*
// @match *://*.tokrav.com/*
// @match *://*.tosnov.com/*
// @match *://*.vorviz.com/*
// @match *://*.wifrad.com/*
// @match *://*.xerov.com/*
// @match *://*.zakmav.com/*
// @match *://*.zavzip.com/*
// @match *://*.zinzov.com/*
// @match https://moacloud.com/file/*
// @match https://moacloud.com/iframe/*
// @downloadURL https://update.greasyfork.org/scripts/426851/Streaming%20-%20Tolbek%20%2B%20Clones%20Widescreen%20%28USw%29%20v93.user.js
// @updateURL https://update.greasyfork.org/scripts/426851/Streaming%20-%20Tolbek%20%2B%20Clones%20Widescreen%20%28USw%29%20v93.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "moacloud" || location.hostname.endsWith(".moacloud")) || (location.hostname === "pigraz.com" || location.hostname.endsWith(".pigraz.com")) || (location.hostname === "soponov.com" || location.hostname.endsWith(".soponov.com")) || (location.hostname === "bradza.com" || location.hostname.endsWith(".bradza.com")) || (location.hostname === "udriz.com" || location.hostname.endsWith(".udriz.com")) || (location.hostname === "gomdax.com" || location.hostname.endsWith(".gomdax.com")) || (location.hostname === "yakwad.com" || location.hostname.endsWith(".yakwad.com")) || (location.hostname === "prifaz.com" || location.hostname.endsWith(".prifaz.com")) || (location.hostname === "yarkam.com" || location.hostname.endsWith(".yarkam.com")) || (location.hostname === "iramiv.com" || location.hostname.endsWith(".iramiv.com")) || (location.hostname === "fimior.com" || location.hostname.endsWith(".fimior.com")) || (location.hostname === "daykaz.com" || location.hostname.endsWith(".daykaz.com")) || (location.hostname === "bovriz.com" || location.hostname.endsWith(".bovriz.com")) || (location.hostname === "boomycloud" || location.hostname.endsWith(".boomycloud")) || (location.hostname === "tomacloud.com" || location.hostname.endsWith(".tomacloud.com")) || (location.hostname === "cldmax.com" || location.hostname.endsWith(".cldmax.com")) || (location.hostname === "toblek.com" || location.hostname.endsWith(".toblek.com")) || (location.hostname === "vistrov.com" || location.hostname.endsWith(".vistrov.com")) || (location.hostname === "narmid.com" || location.hostname.endsWith(".narmid.com")) || (location.hostname === "slatok.com" || location.hostname.endsWith(".slatok.com")) || (location.hostname === "komrav.com" || location.hostname.endsWith(".komrav.com")) || (location.hostname === "sopror.com" || location.hostname.endsWith(".sopror.com")) || (location.hostname === "vokorn.com" || location.hostname.endsWith(".vokorn.com")) || (location.hostname === "dabzov.com" || location.hostname.endsWith(".dabzov.com")) || (location.hostname === "zambod.com" || location.hostname.endsWith(".zambod.com")) || (location.hostname === "ovoob.com" || location.hostname.endsWith(".ovoob.com")) || (location.hostname === "baflox.com" || location.hostname.endsWith(".baflox.com")) || (location.hostname === "rizlov.com" || location.hostname.endsWith(".rizlov.com")) || (location.hostname === "skimox.com" || location.hostname.endsWith(".skimox.com")) || (location.hostname === "brodok.com" || location.hostname.endsWith(".brodok.com")) || (location.hostname === "toswi.com" || location.hostname.endsWith(".toswi.com")) || (location.hostname === "brikoz.com" || location.hostname.endsWith(".brikoz.com")) || (location.hostname === "avbip.com" || location.hostname.endsWith(".avbip.com")) || (location.hostname === "zinroz.com" || location.hostname.endsWith(".zinroz.com")) || (location.hostname === "vadrom.com" || location.hostname.endsWith(".vadrom.com")) || (location.hostname === "ladrov.com" || location.hostname.endsWith(".ladrov.com")) || (location.hostname === "zivbod.com" || location.hostname.endsWith(".zivbod.com")) || (location.hostname === "wavmiv.com" || location.hostname.endsWith(".wavmiv.com")) || (location.hostname === "voldim.com" || location.hostname.endsWith(".voldim.com")) || (location.hostname === "sevrim.com" || location.hostname.endsWith(".sevrim.com")) || (location.hostname === "nakrab.com" || location.hostname.endsWith(".nakrab.com")) || (location.hostname === "maxtrab.com" || location.hostname.endsWith(".maxtrab.com")) || (location.hostname === "fridmax.com" || location.hostname.endsWith(".fridmax.com")) || (location.hostname === "mivpak.com" || location.hostname.endsWith(".mivpak.com")) || (location.hostname === "alkiom.com" || location.hostname.endsWith(".alkiom.com")) || (location.hostname === "trodak.com" || location.hostname.endsWith(".trodak.com")) || (location.hostname === "podvix.com" || location.hostname.endsWith(".podvix.com")) || (location.hostname === "ozpov.com" || location.hostname.endsWith(".ozpov.com")) || (location.hostname === "zodrop.com" || location.hostname.endsWith(".zodrop.com")) || (location.hostname === "padlim.com" || location.hostname.endsWith(".padlim.com")) || (location.hostname === "opkap.com" || location.hostname.endsWith(".opkap.com")) || (location.hostname === "batkip.com" || location.hostname.endsWith(".batkip.com")) || (location.hostname === "lekrom.com" || location.hostname.endsWith(".lekrom.com")) || (location.hostname === "lofroz.com" || location.hostname.endsWith(".lofroz.com")) || (location.hostname === "roplim.com" || location.hostname.endsWith(".roplim.com")) || (location.hostname === "plokim.com" || location.hostname.endsWith(".plokim.com")) || (location.hostname === "zaltav.com" || location.hostname.endsWith(".zaltav.com")) || (location.hostname === "mokrof.com" || location.hostname.endsWith(".mokrof.com")) || (location.hostname === "fosrak.com" || location.hostname.endsWith(".fosrak.com")) || (location.hostname === "krosov.com" || location.hostname.endsWith(".krosov.com")) || (location.hostname === "izorp.com" || location.hostname.endsWith(".izorp.com")) || (location.hostname === "tartog.com" || location.hostname.endsWith(".tartog.com")) || (location.hostname === "ofziv.com" || location.hostname.endsWith(".ofziv.com")) || (location.hostname === "saftim.com" || location.hostname.endsWith(".saftim.com")) || (location.hostname === "fevloz.com" || location.hostname.endsWith(".fevloz.com")) || (location.hostname === "ziprov.com" || location.hostname.endsWith(".ziprov.com")) || (location.hostname === "kikraz.com" || location.hostname.endsWith(".kikraz.com")) || (location.hostname === "drovoo.com" || location.hostname.endsWith(".drovoo.com")) || (location.hostname === "kejrop.com" || location.hostname.endsWith(".kejrop.com")) || (location.hostname === "chotrom.com" || location.hostname.endsWith(".chotrom.com")) || (location.hostname === "dorcho.com" || location.hostname.endsWith(".dorcho.com")) || (location.hostname === "imzod.com" || location.hostname.endsWith(".imzod.com")) || (location.hostname === "borbok.com" || location.hostname.endsWith(".borbok.com")) || (location.hostname === "sodpak.com" || location.hostname.endsWith(".sodpak.com")) || (location.hostname === "lamdop.com" || location.hostname.endsWith(".lamdop.com")) || (location.hostname === "rivbip.com" || location.hostname.endsWith(".rivbip.com")) || (location.hostname === "azrov.com" || location.hostname.endsWith(".azrov.com")) || (location.hostname === "blorog.com" || location.hostname.endsWith(".blorog.com")) || (location.hostname === "didraf.com" || location.hostname.endsWith(".didraf.com")) || (location.hostname === "viabak.com" || location.hostname.endsWith(".viabak.com")) || (location.hostname === "kradax.com" || location.hostname.endsWith(".kradax.com")) || (location.hostname === "quepom.com" || location.hostname.endsWith(".quepom.com")) || (location.hostname === "zodrok.com" || location.hostname.endsWith(".zodrok.com")) || (location.hostname === "balvoz.com" || location.hostname.endsWith(".balvoz.com")) || (location.hostname === "movbor.com" || location.hostname.endsWith(".movbor.com")) || (location.hostname === "faskap.com" || location.hostname.endsWith(".faskap.com")) || (location.hostname === "aksolv.com" || location.hostname.endsWith(".aksolv.com")) || (location.hostname === "vifip.com" || location.hostname.endsWith(".vifip.com")) || (location.hostname === "lizdi.com" || location.hostname.endsWith(".lizdi.com")) || (location.hostname === "fianzax.com" || location.hostname.endsWith(".fianzax.com")) || (location.hostname === "tiviob.com" || location.hostname.endsWith(".tiviob.com")) || (location.hostname === "parlif.com" || location.hostname.endsWith(".parlif.com")) || (location.hostname === "vrewal.com" || location.hostname.endsWith(".vrewal.com")) || (location.hostname === "brafzo.com" || location.hostname.endsWith(".brafzo.com")) || (location.hostname === "todrak.com" || location.hostname.endsWith(".todrak.com")) || (location.hostname === "yavdi.com" || location.hostname.endsWith(".yavdi.com")) || (location.hostname === "zadriv.com" || location.hostname.endsWith(".zadriv.com")) || (location.hostname === "ovgap.com" || location.hostname.endsWith(".ovgap.com")) || (location.hostname === "sorbod.com" || location.hostname.endsWith(".sorbod.com")) || (location.hostname === "trochox.com" || location.hostname.endsWith(".trochox.com")) || (location.hostname === "xodop.com" || location.hostname.endsWith(".xodop.com")) || (location.hostname === "ravkom.com" || location.hostname.endsWith(".ravkom.com")) || (location.hostname === "pavdo.com" || location.hostname.endsWith(".pavdo.com")) || (location.hostname === "tetriv.com" || location.hostname.endsWith(".tetriv.com")) || (location.hostname === "zirkad.com" || location.hostname.endsWith(".zirkad.com")) || (location.hostname === "grozov.com" || location.hostname.endsWith(".grozov.com")) || (location.hostname === "yalkaz.com" || location.hostname.endsWith(".yalkaz.com")) || (location.hostname === "droskop.com" || location.hostname.endsWith(".droskop.com")) || (location.hostname === "nokrom.com" || location.hostname.endsWith(".nokrom.com")) || (location.hostname === "bigbov.com" || location.hostname.endsWith(".bigbov.com")) || (location.hostname === "xadrop.com" || location.hostname.endsWith(".xadrop.com")) || (location.hostname === "zadrip.com" || location.hostname.endsWith(".zadrip.com")) || (location.hostname === "friloz.com" || location.hostname.endsWith(".friloz.com")) || (location.hostname === "azkov.com" || location.hostname.endsWith(".azkov.com")) || (location.hostname === "diprak.com" || location.hostname.endsWith(".diprak.com")) || (location.hostname === "rodzop.com" || location.hostname.endsWith(".rodzop.com")) || (location.hostname === "yortom.com" || location.hostname.endsWith(".yortom.com")) || (location.hostname === "smitav.com" || location.hostname.endsWith(".smitav.com")) || (location.hostname === "fotrov.com" || location.hostname.endsWith(".fotrov.com")) || (location.hostname === "kibriv.com" || location.hostname.endsWith(".kibriv.com")) || (location.hostname === "ivrab.com" || location.hostname.endsWith(".ivrab.com")) || (location.hostname === "dofroz.com" || location.hostname.endsWith(".dofroz.com")) || (location.hostname === "fedzak.com" || location.hostname.endsWith(".fedzak.com")) || (location.hostname === "govrad.com" || location.hostname.endsWith(".govrad.com")) || (location.hostname === "badzap.com" || location.hostname.endsWith(".badzap.com")) || (location.hostname === "lotriz.com" || location.hostname.endsWith(".lotriz.com")) || (location.hostname === "edkoz.com" || location.hostname.endsWith(".edkoz.com")) || (location.hostname === "topkiv.com" || location.hostname.endsWith(".topkiv.com")) || (location.hostname === "kedarp.com" || location.hostname.endsWith(".kedarp.com")) || (location.hostname === "abokav.com" || location.hostname.endsWith(".abokav.com")) || (location.hostname === "lokarn.com" || location.hostname.endsWith(".lokarn.com")) || (location.hostname === "apirv.com" || location.hostname.endsWith(".apirv.com")) || (location.hostname === "rodkov.com" || location.hostname.endsWith(".rodkov.com")) || (location.hostname === "bremob.com" || location.hostname.endsWith(".bremob.com")) || (location.hostname === "urmaz.com" || location.hostname.endsWith(".urmaz.com")) || (location.hostname === "farliz.com" || location.hostname.endsWith(".farliz.com")) || (location.hostname === "faljam.com" || location.hostname.endsWith(".faljam.com")) || (location.hostname === "mobzax.com" || location.hostname.endsWith(".mobzax.com")) || (location.hostname === "nozgap.com" || location.hostname.endsWith(".nozgap.com")) || (location.hostname === "zostaz.com" || location.hostname.endsWith(".zostaz.com")) || (location.hostname === "domgrav.com" || location.hostname.endsWith(".domgrav.com")) || (location.hostname === "malgrim.com" || location.hostname.endsWith(".malgrim.com")) || (location.hostname === "idvram.com" || location.hostname.endsWith(".idvram.com")) || (location.hostname === "karvaz.com" || location.hostname.endsWith(".karvaz.com")) || (location.hostname === "lomiox.com" || location.hostname.endsWith(".lomiox.com")) || (location.hostname === "vredap.com" || location.hostname.endsWith(".vredap.com")) || (location.hostname === "biapoz.com" || location.hostname.endsWith(".biapoz.com")) || (location.hostname === "kambad.com" || location.hostname.endsWith(".kambad.com")) || (location.hostname === "pimtip.com" || location.hostname.endsWith(".pimtip.com")) || (location.hostname === "awdrip.com" || location.hostname.endsWith(".awdrip.com")) || (location.hostname === "dolorv.com" || location.hostname.endsWith(".dolorv.com")) || (location.hostname === "bazrof.com" || location.hostname.endsWith(".bazrof.com")) || (location.hostname === "sakmiz.com" || location.hostname.endsWith(".sakmiz.com")) || (location.hostname === "sapraz.com" || location.hostname.endsWith(".sapraz.com")) || (location.hostname === "titrov.com" || location.hostname.endsWith(".titrov.com")) || (location.hostname === "doksov.com" || location.hostname.endsWith(".doksov.com")) || (location.hostname === "sibrav.com" || location.hostname.endsWith(".sibrav.com")) || (location.hostname === "movpom.com" || location.hostname.endsWith(".movpom.com")) || (location.hostname === "pokoli.com" || location.hostname.endsWith(".pokoli.com")) || (location.hostname === "veksab.com" || location.hostname.endsWith(".veksab.com")) || (location.hostname === "staklam.com" || location.hostname.endsWith(".staklam.com")) || (location.hostname === "vizvop.com" || location.hostname.endsWith(".vizvop.com")) || (location.hostname === "ikfroz.com" || location.hostname.endsWith(".ikfroz.com")) || (location.hostname === "votark.com" || location.hostname.endsWith(".votark.com")) || (location.hostname === "obivap.com" || location.hostname.endsWith(".obivap.com")) || (location.hostname === "alrav.com" || location.hostname.endsWith(".alrav.com")) || (location.hostname === "odvib.com" || location.hostname.endsWith(".odvib.com")) || (location.hostname === "instov.com" || location.hostname.endsWith(".instov.com")) || (location.hostname === "dubraz.com" || location.hostname.endsWith(".dubraz.com")) || (location.hostname === "toktav.com" || location.hostname.endsWith(".toktav.com")) || (location.hostname === "dromoy.com" || location.hostname.endsWith(".dromoy.com")) || (location.hostname === "gabanov.com" || location.hostname.endsWith(".gabanov.com")) || (location.hostname === "valdap.com" || location.hostname.endsWith(".valdap.com")) || (location.hostname === "zorbov.com" || location.hostname.endsWith(".zorbov.com")) || (location.hostname === "dopriv.com" || location.hostname.endsWith(".dopriv.com")) || (location.hostname === "rogzov.com" || location.hostname.endsWith(".rogzov.com")) || (location.hostname === "fakoda.com" || location.hostname.endsWith(".fakoda.com")) || (location.hostname === "prokiz.com" || location.hostname.endsWith(".prokiz.com")) || (location.hostname === "noprak.com" || location.hostname.endsWith(".noprak.com")) || (location.hostname === "madroy.com" || location.hostname.endsWith(".madroy.com")) || (location.hostname === "batiav.com" || location.hostname.endsWith(".batiav.com")) || (location.hostname === "lakrof.com" || location.hostname.endsWith(".lakrof.com")) || (location.hostname === "iramiv.com" || location.hostname.endsWith(".iramiv.com")) || (location.hostname === "bramtiv.com" || location.hostname.endsWith(".bramtiv.com")) || (location.hostname === "gofram.com" || location.hostname.endsWith(".gofram.com")) || (location.hostname === "azmip.com" || location.hostname.endsWith(".azmip.com")) || (location.hostname === "idivov.com" || location.hostname.endsWith(".idivov.com")) || (location.hostname === "frimiv.com" || location.hostname.endsWith(".frimiv.com")) || (location.hostname === "kobiom.com" || location.hostname.endsWith(".kobiom.com")) || (location.hostname === "vogfo.com" || location.hostname.endsWith(".vogfo.com")) || (location.hostname === "yarkam.com" || location.hostname.endsWith(".yarkam.com")) || (location.hostname === "okmaz.com" || location.hostname.endsWith(".okmaz.com")) || (location.hostname === "rolbob.com" || location.hostname.endsWith(".rolbob.com")) || (location.hostname === "dapwop.com" || location.hostname.endsWith(".dapwop.com")) || (location.hostname === "trifak.com" || location.hostname.endsWith(".trifak.com")) || (location.hostname === "dozbob.com" || location.hostname.endsWith(".dozbob.com")) || (location.hostname === "robluv.com" || location.hostname.endsWith(".robluv.com")) || (location.hostname === "drikpo.com" || location.hostname.endsWith(".drikpo.com")) || (location.hostname === "pradav.com" || location.hostname.endsWith(".pradav.com")) || (location.hostname === "morzid.com" || location.hostname.endsWith(".morzid.com")) || (location.hostname === "kolrag.com" || location.hostname.endsWith(".kolrag.com")) || (location.hostname === "akroov.com" || location.hostname.endsWith(".akroov.com")) || (location.hostname === "folmiv.com" || location.hostname.endsWith(".folmiv.com")) || (location.hostname === "yakriv.com" || location.hostname.endsWith(".yakriv.com")) || (location.hostname === "savrod.com" || location.hostname.endsWith(".savrod.com")) || (location.hostname === "fusov.com" || location.hostname.endsWith(".fusov.com")) || (location.hostname === "fimior.com" || location.hostname.endsWith(".fimior.com")) || (location.hostname === "lajma.com" || location.hostname.endsWith(".lajma.com")) || (location.hostname === "kidraz.com" || location.hostname.endsWith(".kidraz.com")) || (location.hostname === "seyav.com" || location.hostname.endsWith(".seyav.com")) || (location.hostname === "xabriv.com" || location.hostname.endsWith(".xabriv.com")) || (location.hostname === "brimav.com" || location.hostname.endsWith(".brimav.com")) || (location.hostname === "epzir.com" || location.hostname.endsWith(".epzir.com")) || (location.hostname === "yisera.com" || location.hostname.endsWith(".yisera.com")) || (location.hostname === "vadbak.com" || location.hostname.endsWith(".vadbak.com")) || (location.hostname === "adivak.com" || location.hostname.endsWith(".adivak.com")) || (location.hostname === "pilkol.com" || location.hostname.endsWith(".pilkol.com")) || (location.hostname === "brozlo.com" || location.hostname.endsWith(".brozlo.com")) || (location.hostname === "padolmi.com" || location.hostname.endsWith(".padolmi.com")) || (location.hostname === "edmiv.com" || location.hostname.endsWith(".edmiv.com")) || (location.hostname === "niztal.com" || location.hostname.endsWith(".niztal.com")) || (location.hostname === "rodorm.com" || location.hostname.endsWith(".rodorm.com")) || (location.hostname === "okrami.com" || location.hostname.endsWith(".okrami.com")) || (location.hostname === "yepmiv.com" || location.hostname.endsWith(".yepmiv.com")) || (location.hostname === "ilmiv.com" || location.hostname.endsWith(".ilmiv.com")) || (location.hostname === "robrov.com" || location.hostname.endsWith(".robrov.com")) || (location.hostname === "albrad.com" || location.hostname.endsWith(".albrad.com")) || (location.hostname === "dipdri.com" || location.hostname.endsWith(".dipdri.com")) || (location.hostname === "driviv.com" || location.hostname.endsWith(".driviv.com")) || (location.hostname === "deksov.com" || location.hostname.endsWith(".deksov.com")) || (location.hostname === "fonzir.com" || location.hostname.endsWith(".fonzir.com")) || (location.hostname === "govioz.com" || location.hostname.endsWith(".govioz.com")) || (location.hostname === "ipdro.com" || location.hostname.endsWith(".ipdro.com")) || (location.hostname === "kanrak.com" || location.hostname.endsWith(".kanrak.com")) || (location.hostname === "moovbob.com" || location.hostname.endsWith(".moovbob.com")) || (location.hostname === "nodrav.com" || location.hostname.endsWith(".nodrav.com")) || (location.hostname === "ralzom.com" || location.hostname.endsWith(".ralzom.com")) || (location.hostname === "ritrom.com" || location.hostname.endsWith(".ritrom.com")) || (location.hostname === "tokrav.com" || location.hostname.endsWith(".tokrav.com")) || (location.hostname === "tosnov.com" || location.hostname.endsWith(".tosnov.com")) || (location.hostname === "vorviz.com" || location.hostname.endsWith(".vorviz.com")) || (location.hostname === "wifrad.com" || location.hostname.endsWith(".wifrad.com")) || (location.hostname === "xerov.com" || location.hostname.endsWith(".xerov.com")) || (location.hostname === "zakmav.com" || location.hostname.endsWith(".zakmav.com")) || (location.hostname === "zavzip.com" || location.hostname.endsWith(".zavzip.com")) || (location.hostname === "zinzov.com" || location.hostname.endsWith(".zinzov.com"))) {
  css += `

  /* ==== 0- Stream - Tolbek + Clones Widescreen (USw) v.93 (new93) ==== */

  /* LAST VERSION UPDATE (Stop auto UPDATE on Userstyles.org) - 20230727.18.24 */
  /* NEW VERSION UPDATE USW- 20230727.18.24 */

  /* PAYPAL: nathandeeran / Nathan Deeran - sebastiencrohez / Sebastien Crohez
  https://www.paypal.com/donate/?hosted_button_id=GFLJQNQTL7BP2
  === */


  /* LINKS ===========
  Tolbek (MOVED): http://toblek.com/toblekk/ ,
  CLONES (some...):
  Galtro: http://galtro.com/m6grt87v4v8d7s/
  wobno : http://wobno.com/02v1i4kl87fdscvsd/
  komiav : http://komiav.com/ml0ml545g4fsd87/ 

  CLONES PB (need more tweaks):
  radego: http://radego.com/rradego/
  bofiaz: http://bofiaz.com/lmop87vv5d4c8df7/
  tamdor: http://tamdor.com/mb1g2kl1k5j87df/
  limpod: http://limpod.com/lmml05215vh78s/
  yisera: http://yisera.com/qs31mloi4u70v21cx8g7/

  ================== */


  /* (new91) SUPP */

  #pop-content ,
  .column1[style="background-color:#202020;"] #animated-banner,
  #animated-banner,
  .fadeIn ,
  .sticky1 .column10 > center > b ,
  .columnSEARCH.sticky2 + .row .column1 > center:last-of-type[style*="background: #00ff894d"] ,
  .row .column1>center:last-of-type[style*="background: #00ff894d"] ,

  b[style^="background:red;"] ,
  .row>div[style*="background: red;"] ,
  body>center>a[href="https://andrules.net"] ,
  .vjs-text-track-display , 
  .vjs-user-inactive .vjs-big-play-button ,
  .afs_ads ,
  body>center link[href^="https://fonts.googleapis.com/"] + a ,
  #ja-footer ,
  .ja-box-ct.clearfix>div>center ,
  .ja-box-ct.clearfix>center ,
  #ja-container #ja-contentwrap .contentpaneopen:last-of-type tr + tr td p:first-of-type + p ,
  #ja-container #ja-contentwrap .contentpaneopen:last-of-type tr + tr td p:first-of-type + p +p + p ,
  .column5.navWrap3>center>a[href^="http://www.leelastyle.com/"] ,
  .home.blog .container ,
  .home.blog .container #header ,
  .home.blog #copyright ,
  .home.blog[_adv_already_used="true"] #header ,
  .home.blog[_adv_already_used="true"] #header +.container  ,
  .home.blog #header ,
  [_adv_already_used="true"] #header +.container  ,
  #bd>br ,
  #bd>center ,
  #bd>a img#myDiv ,
  #bd>a ,
  #footer1.bottomdiv.hide ,
  #footer>center {
      display: none !important;
      z-index: -2147483647 !important;
      visibility: hidden !important;
      opacity: 0 !important;
  }

  /* (new59) POPUP - "Faire Don" / "SITE DEVIENT XXX CHERCHE NOM DANS BLOG" */
  #footer.bottomdiv {
      display: inline-block !important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
  /*     z-index: 0 !important; */
  }

  #footer.bottomdiv>div[style*="position:absolute; background-color:black"] ,
  #footer.bottomdiv>div[style*="position:absolute; background-color:#000000b0"] {
      display: none !important;
  }
  #footer.bottomdiv>div:not([style*="position:absolute; background-color:black"]) + .content .columnEnglobe1 .column3:before  ,
  .content .columnEnglobe1 .column3A:before ,
  #footer.bottomdiv > div:not([style^="position:absolute; background-color:#333;"]) + .content .columnEnglobe1 .column3:before {
      content: "🚧" !important;
      position: absolute !important;
      display: inline-block;
      height: 21px !important;
      width: 21px !important;
      top: -1px !important;
      left: -1px !important;
      padding: 0px;
      border-radius: 3px;
      font-size: 14px !important;
      text-align: center !important;
      visibility: visible !important;
  background-color: red !important;
  }
  /* .column3A > div ,
  .columnEnglobe1[style="z-index:99999999"] .column3A ,
  .columnEnglobe1[style="z-index:99999999"] , */
  #footer.bottomdiv>div[style*="position:absolute; background-color:black"]  + div.content ,
  #footer.bottomdiv>div[style*="position:absolute; background-color:#000000b0"]  + div.content {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      top: 0.5vh !important;
      left: 8.1% !important;
      margin: 0 !important;
      border-radius: 3px !important;
      overflow: hidden !important;
      z-index: 99999999 !important;
  border: 1px solid red !important;
  }
  #footer.bottomdiv>div[style*="position:absolute; background-color:black"]  + div.content:hover ,
  #footer.bottomdiv>div[style*="position:absolute; background-color:#000000b0"]  + div.content:hover {
      position: fixed !important;
      display: inline-block !important;
      top: 0 !important;
      left: 8.1% !important;
      margin: 0 !important;
      z-index: 99999999 !important;
      overflow: visible !important;
  border: 1px solid aqua !important;
  }
  #footer.bottomdiv>div[style*="position:absolute; background-color:black"]  + div.content  .columnEnglobe1 ,
  #footer.bottomdiv>div[style*="position:absolute; background-color:#000000b0"]  + div.content  .columnEnglobe1 {
      position: absolute;
      width: 500px;
      right: 20px;
      top: 0 !important;
      left: 0 !important;
      margin: 0 0 0 0 !important;
      padding: 6px 9px 6px 6px;
      border-radius: 5px;
      transform: translateY(0%) !important;
      color: black;
      box-shadow: unset !important;
  background: red !important;
  }


  /* (new50) WIDESCREEN - PLAYER PAGE */

  .column1 {
      float: left;
      width: 100% !important;
      padding: 0px 5px !important;
  border: none !important;
  /* border-right: 1px solid #da052e33; */
  /* border: 1px solid green !important; */
  }

  /* (new40) OLD SITES - COMMENTS WRITE */
  /* .column1>iframe[name="myiFrame"] */
  body>center:before {
      content: "+ 💬" !important;
      position: fixed !important;
      display: inline-block !important;
      width: 60px;
      height: 20px !important;
      left: 0 !important;
      top: 0px !important;
      font-size: 15px !important;
      z-index: 50000 !important;
  color: gold !important;
  background: red !important;
  border: 1px solid red !important;
  }
  .column1>iframe[name="myiFrame"] {
      position: absolute !important;
      width: 60px;
      height: 25px !important;
      top: 33px !important;
      padding: 0px;
      overflow: hidden !important;
      z-index: 50000 !important;
      opacity: 0.3 !important;
  border: 1px solid red !important;
  }
  .column1>iframe[name="myiFrame"]:hover {
      position: absolute !important;
      width: 379px;
      height: 400px !important;
      padding: 0 10px;
      opacity: 1 !important;
  border: 1px solid red !important;
  }



  /* (new75) COR FLOAT - IN PLAYER PAGE */

  .column1 > p:first-of-type ~ p[style^="text-align: "] + p[style^="text-align: left;"] + p + p, .article-content > p:first-of-type ~ p {
      display: block;
      float: left;
      clear: none;
      width: 51.4% !important;
      max-height: 323px;
      min-height: 323px;
      margin-bottom: 5px;
      margin-left: 5px;
      padding: 0;
  /* border: 1px solid yellow !important; */
  }
  br + #dernieajouts.couleur1 {
      display: inline-block;
      height: 42.78vh !important;
      width: 100% !important;
  top: 57vh !important;
      margin-top: 0px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      transition-duration: 2s;
  /* opacity: 0.2 !important; */
  background: black !important;
  /* border: 1px solid lime !important; */
  }

  /* (new32) CHANGE DE NOM et DEVIENT .... */
  #footer.bottomdiv > div[style^="position:absolute; background-color:#333;"] + .content  {
      position: absolute !important;
      display: inline-block !important;
      height: 200px !important;
      width: 100px !important;
      min-width: 500px !important;
      max-width: 500px !important;
      left: 500px !important;
      right: 0 !important;
      top: 222px!important;
      visibility: visible !important;
  }


  /* (new37) VISITED */
  .column1 #hann p span a ,
  .contentpaneopen>tbody>tr>td>fieldset>div>b>a ,
  .jclist>li>a ,
  #hann p span a ,
  a {
  fill: peru !important;
      color: peru !important;
  }
  .column1 #hann p spana:visited ,
  .contentpaneopen>tbody>tr>td>fieldset>div>b>a:visited ,
  .jclist>li>a:visited ,
  #hann p span a:visited ,
  a:visited {
      color: red !important;
  }

  /* COLOR */
  html>body ,
  .content  ,
  body.bd .main ,
  .column2 ,
  .column1 ,
  .column6 ,
  #dernieajouts.couleur1 ,
  #ja-container .main ,
  #ja-container.wrap.ja-r1 ,
  body.bd #ja-wrapper ,
  body#bd {
      background: #333 !important;
      color: gray !important;
  }
  #rt-navigation2 ,
  #ja-container + #ja-topsl.wrap .main ,
  #skaar ,
  .ja-box-ct.clearfix ,
  #ja-topsl .ja-moduletable, #ja-botsl .ja-moduletable ,
  #ja-topsl.wrap .main.clearfix .ja-box.column.ja-box-left ,
  .column1 > iframe:last-of-type ~ #dernieajouts ,
  .contentpaneopen:last-of-type p ,
  .ja-content-main.clearfix ,
  body#bd.fs3.FF .ja-content-main.clearfix > div:not(#pilot),
  #comments-list > div ,
  #comments .even, 
  #comments .odd ,
  #jc .rbox ,
  #ja-current-content > div:last-of-type:not(.ja-content-main):not(.ja-content-bottom) ,
  .jclist > li ,
  #jc ,
  .article-content > p:first-of-type ~ p ,
  #ja-content.ja-box-br ,
  div.ja-box-tr, 
  div.ja-box-bl {
      background: #222 !important;
      color: gray !important;
  }
  .menutop li.root:hover > .item span, .menutop li.root.active > .item span, 
  .rt-splitmenu .menutop li:hover > .item span, .rt-splitmenu .menutop li.active > .item span, 
  .menutop li.root.f-mainparent-itemfocus > .item span {
      background-image: none !important;
  }
  #rt-navigation2 ,
  #rt-navigation {
      border-bottom: 1px solid red !important;
      border-top: none !important;
      box-shadow: none;
  }
  #rt-navigation .menutop a, #rt-subnavigation .rt-splitmenu .rt-menubar li > a, .rt-splitmenu .rt-menubar li.parent > a, .rt-splitmenu .rt-menubar .nolink, #rt-navigation .menutop .nolink, #rt-main-container .module-content ul.menu > li > a {
      color: peru;
      text-shadow: none ;
  }
  .rt-navborder {
      background: none;
      border-top: none;
  }
  .jcl_comment {
      color: gray !important;
  }


  /* COLOR - INVERT */
  .jclistdsfdfq>li>img ,
  .ja-box-ct.clearfix>div>img ,
  ul.jclist img {
      filter: invert(.8);
  }



  /* (new47) WIDESCREEN */
  body{
      margin: 0 !important;
  }
  #zt-mainbody .zt-wrapper ,
  .content  ,
  body.bd .main {
      width: 100% !important;
      max-width: 100% !important;
  }
  /* (new64) */
  .content {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100vw !important;
      max-width: 100vw !important;
  }
  /* (new50) TOP NAV */
  .column9.sticky1 {
      display: inline;
  }

  /* (new50) DERIERS AJOUTS */
  .column9 {
      position: fixed;
      float: left;
      width: 100%;
      max-width: 9% !important;
      left: 10%;
      top: 0.2vh !important;
      margin: 0 auto auto;
      padding: 0 3px !important;
      transform: translate(0%, 0px) !important;
      z-index: 99;
  /* border: 1px solid aqua  !important; */
  }
  .column9  center .column10 {
      float: left;
      width: 100% !important;
      padding: 0 !important;
  }
  .column9  center .column10 > center > b {
      padding: 0 !important;
      font-size: 0.8em !important;
  }

  /* (new50) PAGER AFFICHE */
  .column17 {
      position: fixed;
      float: left;
      width: 100%;
      max-width: 20% !important;
      left: 10%;
      top: 0.3vh !important;
      margin: 0 auto auto;
      padding: 0 3px !important;
      transform: translate(0%, 0px) !important;
      z-index: 99;
  border: 1px solid green  !important;
  }
  .column17  center .column18 {
      float: left;
      width: 100% !important;
      padding: 0 !important;
  }
  .column17  center .column18 > center > b {
      padding: 0 !important;
      font-size: 0.8em !important;
  }


  /* (new12) START - WIDESCREEN - TREYIM / YISERA - PB */
  /* SUPP */
  #rt-copyright ,
  #zt-middle>div>div>div>center ,
  #zt-middle>div>div>div>center>img{
      display: none !important;
  }
  /* .rt-container #rt-main-column .rt-grid-9 , */
  #rt-transition >.rt-container #rt-main-container #rt-body-surround> .rt-container .rt-container ,
  #rt-transition >.rt-container #rt-main-container #rt-body-surround> .rt-container ,
  #rt-transition >.rt-container{
      width: 100%;
      background: #222 !important;
  }
  .rt-container #rt-main-column .rt-grid-9{
      width: 100%;
      background: transparent !important;
  }
  #rt-transition >.rt-container #rt-main-container #rt-body-surround> .rt-container .rt-container >.rt-grid-9{
      width: 1400px !important;
      margin-right: 0px !important;
      border: 1px solid red !important;
  }
  #rt-transition >.rt-container #rt-main-container #rt-body-surround> .rt-container .rt-container >.rt-grid-9  .module-surround > .module-content>div:not(.clear){
      width: 99% !important;
      margin-left: 10px !important;
      padding: 5px !important;
      border: 1px solid red !important;
  }



  #zt-frame {
      background: #222 ;
      padding: 0 ;
  }
  #rt-top-surround #rt-top-surround2 #rt-header ,
  #zt-header .zt-wrapper ,
  #zt-header {
  position: absolute !important;
  display: inline-block !important;
  float: none !important;
      height: 31px !important;
      top: 0;
      width: 100px !important;
      padding: 0 !important;
      z-index: 5000 !important;
  border: 1px solid red !important;
  }
  .rt-grid-12.rt-alpha.rt-omega>a>img {
      height: 30px !important;
      left: -2px !important;
      top: 0 !important;
  }

  /*new88COR) */
  #rt-top-surround #rt-top-surround2 #rt-header .rt-container .rt-grid-12.rt-alpha.rt-omega>center ,
  #rt-top-surround #rt-top-surround2 #rt-header .rt-container .rt-grid-12.rt-alpha.rt-omega ,
  #rt-top-surround #rt-top-surround2 #rt-header .rt-container ,
  #zt-header .zt-wrapper .zt-wrapper-inner #zt-header-inner ,
  #zt-header .zt-wrapper .zt-wrapper-inner  {
      height: 30px !important;
      padding: 0 !important;
  }
  #rt-top-surround #rt-top-surround2 #rt-header .rt-container ,
  #rt-top-surround #rt-top-surround2 #rt-header .rt-container .rt-grid-12.rt-alpha.rt-omega>center .rt-block.logo-block >form ,
  #rt-top-surround #rt-top-surround2 #rt-header .rt-container .rt-grid-12.rt-alpha.rt-omega>center .rt-block.logo-block {
      height: 30px !important;
      margin: 0 !important;
      padding: 0 !important;
  }
  #rt-top-surround #rt-top-surround2 #rt-header  .rt-container .rt-grid-12.rt-alpha.rt-omega ,
  #rt-top-surround #rt-top-surround2 #rt-header  .rt-container {
      width: 667px !important;
      min-height: 30px !important;
      max-height: 30px !important;
      margin: 0 !important;
      padding: 0 !important;
  }
  #rt-top-surround #rt-top-surround2 #rt-header  .rt-container .rt-grid-12.rt-alpha.rt-omega  .rt-block.logo-block>form {
      height: 30px;
      margin-left: 100px;
      padding: 0;
      text-align: left;
  }
  #rt-top-surround #rt-top-surround2 #rt-header  .rt-container .rt-grid-12.rt-alpha.rt-omega  .rt-block.logo-block>form .search {
      height: 30px;
      padding: 0;
      text-align: left;
  }
  #rt-top-surround #rt-top-surround2 #rt-header  .rt-container .rt-grid-12.rt-alpha.rt-omega  .rt-block.logo-block>form .search #mod_search_searchword {
      width: 510px;
      height: 30px;
      padding: 0;
      text-align: left;
  }
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ul.menutop.level1 li a span:first-of-type ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ul.menutop.level1 li a ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ul.menutop.level1 li ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ul.menutop.level1 ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container ,
  .accent-overlay-dark #rt-navigation #rt-navigation2 ,
  .accent-overlay-dark #rt-navigation {
      height: 30px;
  }
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ul.menutop.level1 li a  {
      padding-top: 0;
      padding-left: 5px ;
      padding-right: 5px ;
  }
  .accent-overlay-dark #rt-navigation #rt-navigation2 .rt-container .rt-grid-12.rt-alpha.rt-omega .rt-block.menu-block .rt-fusionmenu .nopill .rt-menubar ul.menutop.level1 li a span:first-of-type {
      line-height: 20px;
      padding: 0 !important;
  }
  #rt-main-container .sidebar-right {
      width: 480px !important;
      background: #222 !important;
  border: 1px solid red !important;
  }
  #rt-main-container .sidebar-right .module-content>div:not(.clear) {
      position: relative;
      top: -20px;
      width: 480px !important;
      left: -40px;
      padding-left: 1px;
      padding-right: 5px;
  background: #222 !important;
  }
  .sidebar-right .module-content>div:not(.clear) {
      position: relative;
      max-width: 467px !important;
      top: -25px;
      left: -12px !important;
      padding-left: 1px;
      padding-right: 5px;
      border-radius: 3px;
  border: 1px solid red !important;
  }
  #zt-header {
      float: left;
      height: 30px;
      margin: 0;
      padding: 0 0 0 10px;
      width: 100% !important;
  }
  #zt-header  .zt-wrapper {
      width: 100% !important;
  }
  #zt-mainmenu {
      float: left;
      height: 30px;
      margin: 0;
      padding: 0 0 0 10px;
      width: 70% !important;
  }
  #zt-mainmenu-inner {
      height: 30px;
      width: 100%;
      margin: 0;
      padding: 0 ;
  }
  #zt-mainmenu-inner #menusys_moo {
      float: left;
      width: 100%;
      height: 30px;
      margin: 0;
      padding: 0;
  }
  #zt-mainmenu-inner #menusys_moo  li a span ,
  #zt-mainmenu-inner #menusys_moo  li a ,
  #zt-mainmenu-inner #menusys_moo  li {
      line-height: 30px;
      height: 30px;
  }
  #zt-wrapper-inner #seaarchoose {
      line-height: 30px !important;
      height: 30px !important;
      width: 210px !important;
  background-image: none !important;
  }
  #zt-wrapper-inner #seaarchoose form {
      height: 30px;
  }
  #zt-wrapper-inner #seaarchoose form .inputbox {
      top: 7px;
      width: 600px;
  }

  #zt-container-right #zt-middle>div:first-of-type>div >div {
      top: 0px;
      width: 100% !important;
  }
  #skaar>p>span ,
  #zt-middle>div>div>div> #naha span {
      display: inline-block;
      width: 32.8%;
      margin: 5px 2px 2px 0;
      border-radius: 5px;
  border: 1px solid gray;
  }
  #zt-right-inner>div  {
      position: relative;
      width: 524px !important;
      top: 7px;
      left: 30px;
      padding-left: 20px;
      border-radius: 2px;
  background-color: black;
  border: 1px solid red;
  }
  #zt-right-inner>div  ul.jclist li {
      margin-left: 15px !important;
  }
  /* (new12) END - WIDESCREEN - TREYIM - PB */

  #ja-header .main.clearfix {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      height: 31px !important;
      width: 200px !important;
      top: 0;
      padding: 0 !important;
      z-index: 5000 !important;
  border: 1px solid red !important;
  }

  body.bd.body-subnav.fs3.com_content  #ja-wrapper a#Top + #ja-header + #ja-mainnav .main.clearfix {
      width: 100% !important;
      height: 31px !important;
  }
  #ja-subnav {
      height: auto !important;
  }


  #jasdl-mainnav  li  a ,
  #jasdl-mainnav  li {
      height: 30px !important;
      line-height: 39px !important;
  }
  #ja-wrapper #Top + #ja-header + #ja-mainnav {
      width: 99.9% !important;
      bottom: 0;
      height: 30px;
      position: absolute;
      top: 0 !important;
      z-index: 15 !important;
  /* border: 1px solid aqua !important; */
  }

  #ja-right.column.sidebar {
      width: 16% !important;
  /* border: 1px solid red !important; */
  }
  .ja-colswrap {
      margin-right: 0px !important;
      padding-left: 0 !important;
  }
  /* SIDEBAR - TOLBEK */
  .column2 {
      float: left;
      padding: 10px;
      width: 23%;
  }
  /* SIDEBAR - GALTRO */
  #ja-containerwrap-c #ja-colwrap {
      width: 23%;
  }
  #ja-container #ja-colwrap>div:first-of-type ,
  .ja-box-ct.clearfix>div {
      width: 435px !important;
      left: 0px !important;
  border-left: 1px solid #dcdcdc;
  }

  #ja-right .ja-colswrap #ja-right1.ja-col.column  #Mod32.ja-moduletable.moduletable  .ja-box-ct.clearfix>div {
      position: relative;
      width: 387px !important;
      right: 0px !important;
      top: -26px;
  border-left: 1px solid #dcdcdc;
  }

  ul.jclist {
      height: 800px !important;
      padding: 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  /* border: 1px solid blue !important; */
  }

  .jclist>li {
  float: left !important;
      width: 45% !important;
      height: 103px !important;
      margin-bottom: 3px !important;
      padding: 3px !important;
      border-radius: 3px !important;
  border: 1px solid gray !important;
  overflow: hidden !important;
  }
  .jcl_comment {
      height: 77px !important;
      line-height: 12px !important;
  overflow: hidden !important;
  }
  #ja-mainbody {
      width: 83% !important;
  }
  #ja-content-bottom div.ja-moduletable#Mod23 {
      width: 100% !important;
  }
  #ja-content-bottom div.ja-moduletable#Mod23 .ja-box-ct.clearfix>div {
      width: 100% !important;
  }
  #ja-main .inner {
      padding: 0px;
      width: 95%!important;
  }

  /* (new14) LIST CONTAINER - AKK */
  .contentpane>tbody>tr:nth-child(2) td  #akk {
      width: 100% !important;
  }

  /* (new38) OLD ...- FILMS LIST - ITEM*/
  #polo p span ,
  #akik p span ,
  .column1 #hann  {
      width: 32.8% !important;
      height: 25px !important;
      line-height: 15px !important;
      display: inline-block !important;
  border-radius: 5px !important;
  margin: 5px 2px 2px 0px !important;
  border: 1px solid gray !important;
  }
  /* (new47) SEARCH */
  .row .column1[style^="background-color:"]  > b ~ #hann {
      width: 49% !important;
      height: 35px !important;
      line-height: 15px !important;
      display: inline-block !important;
      border-radius: 5px !important;
      margin: 5px 2px 2px 0px !important;
  /* border: 1px solid aqua !important; */
  }

  /* (new50) */
  .row .column1[style^="background-color:"] > b ~ p:not([style="text-align: left;"]) {
      position: relative;
      left: 0px  !important;
      top: -4px !important;
      margin: 0 9px 0 0 !important;
      padding: 5px;
      border-radius: 0px !important;
      text-align: center;
      font-family: Arial !important;
  color: #168a5d;
  box-shadow: 0 4px 6px 0 rgba(18, 18, 18, 0.67) !important;
  /* box-shadow: 0 4px 6px 0 rgba(249, 0, 0, 0.96) !important; */
  background-color: #111 !important;
  /* border: 1px solid #168a5d; */
  border: transparent !important;
  border-right: 1px solid #333 !important;
  }

  /* (new38) OLD */
  .column1 #hann p span a , 
  .column1 #hann p span {
      display: inline-block !important;
      width: 100% !important;
      height: 25px !important;
      line-height: 15px !important;
      margin: 0px !important;
      padding: 2px !important;
      border-radius: 5px !important;
  border: none !important;
  }
  #hann>p>span>a>font {
      position: absolute !important;
      display: inline-block !important;
      width: 16px !important;
      height: 15px !important;
      line-height: 10px !important;
      padding: 1px !important;
      margin: 0 0 0 5px !important;
      font-size: 7px  !important;
      border-radius: 3px !important;
      opacity: 0.5 !important;
  color: gold !important;
  border: 1px solid red !important;
  }

  .contentpane>tbody>tr>td>ul>br {
      display: none;
  }
  .contentpane>tbody>tr>td>ul>center {
      float: left !important;
      clear: none !important;
      height: 75px !important;
      width: 690px !important;
      margin: 0 !important;
      padding: 5px 8px !important;
  /* border: 1px solid red !important; */
  }
  #ja-navhelper {
      position: absolute !important;
      bottom: -25px !important;
      z-index: 5000 !important;
  }

  /* (new75) TOLBEK - PAGINATION - == */
  .row .column1>center:last-of-type:not([style*="background: #66ff9a"]) ,
  .row .column1>center:last-of-type:not([style*="background: #00ff894d"]) ,
  .columnSEARCH.sticky2 + .row .column1>center:last-of-type {
      display: inline-block !important;
      flex-wrap: wrap;
      justify-content: center;
  }
  /* (new75) PUB - ZALTAV 
  https://zaltav.com/dv0sqxm12xo/home/zaltav
  === */
  .row .column1>center:last-of-type[style*="background: #66ff9a"] {
      display: none  !important;
  }

  /* (new50) PAGINATION - TOP RIGHT*/
  .column1>br + center[style="display:flex; flex-wrap:wrap; justify-content:center"] {
      position: fixed !important;
      display: inline-block !important;
      height: 30px !important;
      width: 100% !important;
      min-width: 20% !important;
      max-width: 20% !important;
      left: unset !important;
      right: 19% !important;
      top: 0vh !important;
      text-align: center !important;
      transform: translateX(0%) !important;
      z-index: 99;
  /* border: 1px solid aqua !important; */
  }

  /* (new50) SEARCH PAGINATION */
  .row .column1[style^="background-color:"]  > b ~ #hann + br +br + center > a ,
  .row .column1>center:last-of-type a ,
  .columnSEARCH.sticky2 + .row .column1>center:last-of-type  a {
      position: relative;
      height: 20px !important;
      top: -1px !important;
      margin-right: 5px;
      padding: 3px !important;
      border-radius: 2px;
      font-style: normal !important;
      overflow-wrap: break-word;
  color: #606260;
  background-color: #222 !important;
  border: 1px solid #606260;
  }

  .column1 > br + center[style="display:flex; flex-wrap:wrap; justify-content:center"] svg ,
  .row .column1[style^="background-color:"]  > b ~ #hann + br +br + center > a  svg ,
  .row .column1>center:last-of-type a img ,
  .columnSEARCH.sticky2 + .row .column1>center:last-of-type  a img {
      height: 20px !important;
      position: relative;
      top: 3px !important;
  }

  /* (new3) FILM */
  #ja-container.wrap.ja-r1 {
      top: 60px !important;
  }
  .article-section {
      float: left !important;
      clear: right !important;
  }
  .article-content {
      float: left !important;
      clear: left !important;
      width: 69% !important;
      height: 750px !important;
  border: 1px solid gray !important;
  }
  .article-content>p:first-of-type {
      float: left !important;
      clear: none !important;
      width: 25% !important;
      height: 720px !important;
      margin-bottom: -10px;
      margin-left: 5px;
      padding: 3px;
  /* border: 1px solid blue !important; */
  }
  .article-content>p:first-of-type img  {
      width: 100% !important;
  }
  /* COR FLOAT */
  .column1 > p:first-of-type ~ p[style^="text-align: " ] + p[style^="text-align: left;"] +p + p ,
  .article-content>p:first-of-type ~ p {
      display: block !important;
      float: left !important;
      width: 71% !important;
      margin-left: 5px !important;
      margin-bottom: -10px !important;
      padding: 3px !important;
  /* border: 1px solid red !important; */
  }
  /* .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"] + p + p ,  */
  .article-content > p:first-of-type +p  + p + p {
      display: none !important;
  }
  /* .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"] + p + p,  */
  .article-content > p:first-of-type +p  + p + p + p {
      height: 330px;
      text-align: center;
      width: 669px;
  /* border: 1px solid yellow !important; */
  }
  /* (new12) PLAYER some videos Botidou */
  .article-content > p:first-of-type + p + p + span.allvideos +  iframe{
      margin-left: 5px;
      margin-top: 15px;
  /* border: 1px dotted yellow !important; */
  }

  /* (new37) GALTRO - PLAYER -  PB SOME VIDEO BINMIR AFZOR */
  /* (new37) */
  /* .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"] + p[style^="text-align: center"] + p[style^="text-align: center"]+ p[style^="text-align: center"] , */

  /* .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"]  + iframe  , */
  .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"]  + p[style="text-align: center;"] + p[style="text-align: center; "] ,
  .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"] + p + p {
      display: inline-block !important;
      clear: none !important;
      width: 73% !important;
      max-height: 323px !important;
      min-height: 323px !important;
      margin-left: 5px !important;
      margin-bottom: 5px !important;
      padding: 0px !important;
  /* border: 1px solid red !important; */
  }

  /* (new52) PLAYER CONTAINER */
  .column1 > p:first-of-type ~ p[style^="text-align: "] + p[style^="text-align: left;"] + p + p, .article-content > p:first-of-type ~ p{
      display: inline-block !important;
      clear: none !important;
      width: 50.38% !important;
      max-height: 50vh !important;
      min-height: 50vh !important;
      margin: 0.5vh 0 0 0!important;
      padding: 0px !important;
  /* border: 1px solid aqua !important; */
  }



  /* (new63) tomacloud / MOACLOUD - PLAYER  */
  .column1>p>iframe {
      position: absolute;
      display: inline-block;
      max-height: 49.8vh !important;
      min-height: 49.8vh !important;
      width: 963px !important;
      top: 0px;
      left: 0px;
      z-index: 5000;
  background-color: #333 !important;
  /* border: 1px solid aqua !important; */
  }
  .jw-logo.jw-logo-top-right.jw-hide.jw-reset ,
  .jwplayer.jw-flag-user-inactive.jw-state-playing:not(.jw-flag-media-audio):not(.jw-flag-casting) .jw-logo-top-right {
      display: none !important;
  }
  .video{
      height: 100%  !important;
      max-height: 100% !important;
      min-height: 100% !important;
      margin: 0px !important;
  border: none !important; 
  /* border: 1px solid aqua  !important; */
  }
  #myElement {
  /*     min-height: 50vh !important; */
  /* border: 1px dashed yellow  !important; */
  }
  /* (new67) Boomycloud ? / TOMACLOUD / MOACLOUD */
  #myElement:not(.jw-flag-fullscreen) > .jw-aspect.jw-reset  {
  /*     max-height: 314px !important; */
  height: 100% !important;
      min-width: 900px !important;
      max-width: 900px !important;
      padding-top: 56.25% !important;
  }
  #myElement:not(.jw-flag-fullscreen).jwplayer.jw-reset{
      height: auto !important;
      min-height: 99vh !important;
      max-height: 99vh !important;
      width: 100% !important;
      min-width: 900px !important;
      max-width: 900px !important;
  /*     padding-top: 56.25% !important; */
  /* border: 1px solid yellow !important; */
  }
  /* .jw-aspect ,
  #myElement .jw-wrapper.jw-reset .jw-aspect ,
  .jwplayer.jw-flag-aspect-mode .jw-aspect */
  #myElement:not(.jw-flag-fullscreen)  .jw-wrapper.jw-reset .jw-aspect.jw-reset  ,
  #myElement:not(.jw-flag-fullscreen) > .jw-aspect.jw-reset  {
      padding-top: 47.25% !important;
  }
  .jw-media.jw-reset {
      width: 961px !important;
  }
  #myElement:not(.jw-flag-fullscreen) .jw-media.jw-reset{
      width: 100% !important;
  }

  /* (new30) tomacloud / MOACLOUD - PLAYER - FULL SCREEN */
  .afs_ads.ad-placement{
     display: none !important;
  }

  #myElement.jw-flag-fullscreen .jw-media.jw-reset ,
  #myElement.jw-flag-fullscreen .jw-overlays.jw-reset ,
  #myElement.jw-flag-fullscreen .jw-wrapper ,
  #myElement.jw-flag-fullscreen {
      max-height: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }

  /* ===== */
  .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"]  + iframe  {
      position: relative !important;
      display: inline-block !important;
      clear: none !important;
      width: 45% !important;
      min-height: 323px !important;
      margin-left: 5px !important;
      margin-bottom: -5px !important;
      top: 13px !important;
      padding: 0px !important;
  background-color: #333 !important;
  border: 1px solid yellow !important;
  }

  /* (new12) */
  #navWrapEND4 + br + br ,
  #navWrapEND4 + br ,
  #navWrapEND4 ,
  #top5 ,
  #top4 ,
  .column1>center ,
  .column1>br{
      display: none !important;
  }
  .column1 > center:first-of-type {
      display: inline-block !important;
      height: 10px !important;
      margin-top: 5px !important;
  }
  /* (new50) */
  /* .column1 > center:first-of-type > b {
      display: inline-block;
      position: absolute;
      height: 34px !important;
      width: 1005px !important;
      top: 36px !important;
      left: 20px !important;
      padding-bottom: 5px !important;
      padding-top: 5px !important;
  border-bottom: 1px solid #818181;
  border-top: 1px solid #818181;
  background-color: #222 !important;
  } */

  /* COR FLOAT */
  /* (new50) A L'AFFICHE / DERNIERS AJOUTS - TOP TITTLE */
  .column7 {
      position: fixed;
      display: block !important;
      float: left;
      margin-top: 0px;
      left: 0;
      top: 0;
      width: 100%;
      z-index: 99;
  }

  /* COR FLOAT */
  .column7.column7 center:first-of-type > b  ,
  .column5.navWrap3 + .column1 > center:first-of-type > b {
      position: fixed;
      display: block !important;
      float: left;
      width: 100%;
      max-width: 80% !important;
      height: 30px  !important;
      line-height: 30px  !important;
      left: 8% !important;
      top: 3.2vh !important;
      margin: 0 !important;
      padding: 0 3px !important;
      border-radius:  0 0 5px 5px !important;
      transform: translate(0%, 0px) !important;
      z-index: 99;
  background-color: #232323 !important;
  /* background: #111 !important; */
  border: 1px solid red  !important;
  border-top: transparent !important;
      border-top: 1px solid #4c4c4c !important;
  }

  .column1>div[style*="background: linear-gradient"] {
      position: absolute !important;
      width: 106px !important;
      top: 36px !important;
      margin-top: 0 !important;
      padding: 7px;
      white-space: nowrap !important;
      overflow: hidden !important;
  background: rgba(0, 0, 0, 0) linear-gradient(to right, #38638b, #a6afa3) repeat scroll 0 0;
  border: 1px solid #20557c;
  }
  .column1>div[style*="background: linear-gradient"]:hover {
      width: auto !important;
  }

  .article-content>p:first-of-type ~ p > span {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      text-decoration: underline;
  }
  a[onclick^="window.location.href='"] img {
      border: medium none;
      border-radius: 3px;
      height: 344px !important;
  }
  .jwplayer {
      position: relative;
      height: 100%;
      min-height: 300px !important;
      width: 100%;
      -moz-user-select: none;
      background-color: #000;
      box-sizing: border-box;
      font-size: 16px;
  }

  /* COR FLOAT */
  /* (new30) */
  .article-content>p>strong>span>img ,
  .article-content>p:first-of-type ~ p>span  strong img  {
      display: block !important;
      float: left !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      text-decoration: underline;
  filter: invert(.8);

  }

  /* (new13) SEARCH */
  #ja-header + #ja-mainnav + #ja-topsl.wrap  .main {
      position: absolute !important;
      display: inline-block !important;
      width: 400px !important;
      height: 30px !important;
      line-height: 30px;
      max-width: 400px !important;
      top: 0px !important;
      right: 30px !important;
      padding: 0 !important;
      z-index: 5000 !important;
  background: red !important;
  }
  #ja-topsl .main .main-inner1.clearfix {
      display: inline-block !important;
      width: 400px !important;
      max-width: 400px !important;
      height: 30px !important;
      line-height: 30px;
      padding-left: 2px;
      padding-top: 0;
  }
  #ja-topsl .main .main-inner1.clearfix .ja-box.column.ja-box-full {
      display: inline-block !important;
      width: 400px !important;
      max-width: 400px !important;
      min-height: 30px !important;
      line-height: 30px;
  }
  #ja-topsl .main .main-inner1.clearfix .ja-box.column.ja-box-full #Mod18.ja-moduletable.moduletable  .ja-box-ct.clearfix ,
  #ja-topsl .main .main-inner1.clearfix .ja-box.column.ja-box-full #Mod18.ja-moduletable.moduletable {
      height: 28px;
      margin-bottom: 0;
      margin-right: 0;
  }
  #ja-topsl .main .main-inner1.clearfix .ja-box.column.ja-box-full #Mod18.ja-moduletable.moduletable .ja-box-ct.clearfix>center {
      display: inline-block !important;
      height: 30px;
      width: 100%;
      opacity: 1 !important;
      visibility: visible !important;
      z-index: 500000 !important;
  border: 1px solid red !important;
  }
  #ja-topsl .main .main-inner1.clearfix .ja-box.column.ja-box-full #Mod18.ja-moduletable.moduletable .ja-box-ct.clearfix>center>div {
      position: relative;
      height: 30px;
      width: 100% !important;
      top: -4px !important;
  }
   #ja-topsl .main .main-inner1.clearfix .ja-box.column.ja-box-full #Mod18.ja-moduletable.moduletable .ja-box-ct.clearfix>center>div form.search{
      height: 30px;
      width: 100% !important;
  }

  .bd.body-subnav.fs3.com_search .contentpaneopen {
      display: inline-block !important;
      width: 100% !important;
  border: 1px solid red !important;
  }

  form#searchForm {
      position: absolute !important;
      display: inline-block !important;
      width: 72% !important;
      height: 36px !important;
      overflow: hidden;
  border-bottom: 1px solid aqua !important;
  }

  /* SEARCH - TOLBEK - GALTRO */
  .rightlayout.wide.fs3 form#searchForm {
      position: absolute !important;
      display: inline-block !important;
      width: 72% !important;
      left: 5px !important;
      overflow: hidden;
  border-bottom: 1px solid green !important;
  }
  .rightlayout.wide.fs3 form#searchForm table.contentpaneopen ,
  form#searchForm table.contentpaneopen {
      display: inline-block !important;
      float: none !important;
      height: 35px !important;
      min-width: 100% !important;
      padding: 5px !important;
  border: 1px solid gray!important;
  }
  .rightlayout.wide.fs3 form#searchForm + table.contentpaneopen ,
  .bd.body-subnav.fs3.com_search form#searchForm + div .contentpaneopen {
      display: inline-block !important;
      float: none !important;
      height: auto !important;
      min-width: 100% !important;
      margin-top: 50px !important;
      padding: 5px !important;
  }
  /* SERACH - GALTRO - INTRO */
  .rightlayout.wide.fs3 form#searchForm table.searchintro tbody ,
  .rightlayout.wide.fs3 form#searchForm table.searchintro {
      display: inline-block !important;
      float: none !important;
      height: 30px !important;
      min-width: 100% !important;
      padding: 5px !important;
  background: #333 ;
  }
  /* COR FLOAT */
  .searchintro > tbody > tr {
      position: relative;
      display: block;
      float: left !important;
      height: 30px;
      width: 50% !important;
      margin-left: 0px !important;
      margin-right: 25px !important;
      padding: 0px 5px 0 5px !important;
      color: gold;
      text-align: right !important;
  }
  /* COR FLOAT */
  .searchintro > tbody > tr:last-of-type{
      position: relative;
      display: block;
      float: right !important;
      height: 30px;
      width: 45% !important;
      margin-left: -5px !important;
      margin-right: 25px !important;
      padding: 0px 5px 0 5px !important;
      color: gold;
      text-align: left !important;
  /*     background: red ; */
  }
  table.searchintro td {
      display: inline-block !important;
      width: 100% !important;
      padding: 0px !important;
  }
  .searchintro>tbody>tr>td>br{
      display: none !important;
  }
  /* COR FLOAT */
  /* COMMENTS */
  /* #ja-current-content>div:last-of-type , */
  #jc {
      display: block !important;
      float: right !important;
      clear: right !important;
      width: 27% !important;
      margin-left: 5px !important;
      padding: 3px !important;
  border: 1px solid red !important;
  }
  /* COR FLOAT */
  #jc>img ,
  #comments>img {
      display: block !important;
      float: left !important;
      clear: right !important;
      width: 95% !important;
      margin-left: 10px !important;
      filter: invert(.8);
  border: 1px solid red !important;
  }
  #comments {
      width: 100%;
      height: 366px !important;
      margin: 0;
      padding: 0;
      text-align: left;
      text-decoration: none;
      text-indent: 0;
      text-transform: none;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  /* COR FLOAT */
  #comments .even, 
  #comments .odd {
      display: block !important;
      float: left !important;
      width: 50% !important;
      margin-bottom: 3px !important;
      overflow: hidden !important;
  border-radius: 5px !important;
  }
  #comments .comment-box {
      height: 77px !important;
      overflow: hidden !important;
  }

  #comments-form {
      opacity: 0.3;
  }
  #comments-form:hover {
      opacity: 1 !important;
  }

  /* (new13) */
  #ja-header, 
  #ja-container, 
  #ja-topsl, 
  #ja-footer {
      clear: both;
      margin: 0 auto;
      width: 99% !important;
  }
  #ja-header.wrap {
      height: 32px !important;
      background: #202020 none repeat scroll 0 0;
      position: relative;
      z-index: 101;
      border-bottom: 3px solid #2fafcb;
  }
  #ja-header {
      position: absolute !important;
      float: none !important;
      width: 150px !important;
      line-height: normal;
      height: 32px !important;
      z-index: 101 !important;
  }
  #ja-header  .main.clearfix>h1 {
      position: relative;
      height: 30px !important;
      line-height: normal;
      top: 0 !important;
  }

  h1.logo-text a {
      position: absolute;
      height: 30px !important;
      width: 257px !important;
      top: 3px !important;
      left: 10px;
      color: #cccccc;
      text-decoration: none;
  }
  .main.clearfix>h1>a>span>img ,
  h1.logo-text a img {
      height: 32px !important;
  }
  .accessibility + #ja-wrapper #ja-headerwrap #ja-header {
      width: 99% !important;
  /* border: 1px solid violet !important; */
  }
  .accessibility + #ja-wrapper #ja-headerwrap #ja-header #ja-mainnavwrap #ja-mainnav {
      position: absolute;
      height: 30px;
      bottom: 0;
      left: 152px !important;
      top: 0 !important;
  }
  #ja-search {
      position: absolute;
      width: 164px;
      height: 22px;
      right: 5px;
      top: 3px !important;
      font-size: 12px;
  }
  #ja-containerwrap-c {
      margin-top: -29px !important;
  }
  #ja-content.ja-box-br {
      clear: both;
      float: left;
      width: 100%;
      min-height: 33px;
      padding: 0;
      margin-bottom: 0px !important;
      overflow: hidden;
  border-bottom: 3px solid #2fafcb;
  }
  div.ja-box-tr ,
  div.ja-box-bl {
      min-height: 33px !important;
      margin-top: 28px !important;
  }
  div.ja-box-tl {
      margin-top: -20px !important;
      padding: 0px 5px !important;
  }

  .ja-box-tl.clearfix>center>img ,
  .ja-box-tl.clearfix>br {
      display: none !important;
  }

  #ja-usertoolswrap {
      display: block;
      clear: both;
      margin-bottom: 0 !important;
      padding: 0;
      font-size: 11px;
  }

  /* (new3) CLONES TYPE 1 - GALTRO - FILM PLAYER */
  /* #ja-current-content>div:last-of-type:not(.ja-content-main) , */
  .article-content + .article_separator {
      display: none !important;
  }
  #ja-current-content>span:not(.article_separator) {
      float: left !important;
      clear: none !important;
  border: 1px solid tomato !important;
  }

  #ja-usertoolswrap + #ja-current-content .article-content {
      float: left;
      clear: both !important;
      height: 695px;
      width: 65% !important;
  border: 1px solid gray;
  }
  /* (new47) GALTRO - AFF + PLAYER */
  .column1 > p[style="text-align: center;"]:not(:empty) {
      float: left;
      clear: both !important;
      height: 695px;
  border: 1px solid gray;
  }
  /* (new47) */
  .column1 > p[style="text-align: center;"]:first-of-type {
      clear: none !important;
      float: left !important;
      width: 25% !important;
      min-height: 465px !important;
      max-height: 465px !important;
      margin-top: -5px !important;
      margin-bottom: -10px;
      margin-left: 5px;
      padding: 3px;
  }
  .column1>p>img {
    max-height: 455px !important;
      object-fit: contain !important;
  }

  /* (new40) */
  .column1 > p:first-of-type ~ p:not(:empty) {
      float: left !important;
      clear: none !important;
      width: 965px !important;
      margin-bottom: -5px !important;
      margin-left: 5px;
      padding: 3px;
  /*     border: 1px solid red; */
  }
  .column1>pfirst-of-type img {
      width: 100% !important;
  }
  .column1 > p:first-of-type ~ p[style^="text-align: center"] {
  display: none !important;
      height: 30px !important;
  }
  /* (new 42) for PLAYER VISIBLE with AGE +15 :
  https://zaniob.com/tecjhvm1/b/zaniob/11080973
  ==== */
  .column1 > p:first-of-type + p + p + center  + p:empty + p + p{
  display: inline-block !important;
      height: 0px !important;
      border: none !important;
      padding: 0 !important;
  }
  .column1 > p:first-of-type ~ p[style^="text-align: center"] img{
      height: 15px;
      margin-top: -6px;
      max-width: 100% !important;
      text-decoration: none;
  }

  /* (new52) RESUME */
  .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"] {
      height: 30px !important;
      background: #222 !important;
      border: 1px solid blue !important;
  }
  .column1 > p:first-of-type ~ p[style^="text-align: center"] + p[style^="text-align: left;"] {
      position: relative !important;
      float: right  !important;
      height: 49.8vh !important;
      line-height: 18px !important;
      width: 23% !important;
      top: 0  !important;
      margin: 0px 0  0 0  !important;
      padding: 10px !important;
      font-size: 18px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
      z-index: 500 !important;
  box-shadow: 0 4px 6px 0 rgba(18, 18, 18, 0.67) !important;
  /* box-shadow: 0 4px 6px 0 rgba(249, 0, 0, 0.96) !important; */
  background-color: #111 !important;
  /* border: 1px solid #168a5d; */
  border: transparent !important;
  border-left: 1px solid #333 !important;
  }
  /* COR FLOAT */
  #ja-current-content>div:last-of-type:not(.ja-content-main):not(.ja-content-bottom) {
      display: block !important;
      float: right!important;
      clear: none !important;
      width: 480px !important;
      top: 0 !important;
      padding: 3px !important;
  border: 1px solid red !important;
  }
  /* (new75) */
  #dernieajouts.couleur1 {
  position: fixed !important;
      display: inline-block !important;
  width: 100vw !important;
  height: 93vh  !important;
      margin-top: 0px !important;
  top: 6.5vh !important;
  left: 0 !important;
  padding: 0 0 0 15px !important;
  overflow: hidden !important;
  overflow-y: auto !important;
      transition-duration: 0s !important;
  /* border: 1px solid aqua  !important; */
  }


  #dernieajouts.couleur1 #navWrap {
    display: none !important;
  }

  /* (new11) PB some videos APOLONA */
  #ja-container #ja-contentwrap .contentpaneopen:last-of-type tr + tr td p:first-of-type + p + p + span + iframe  {
      margin-top: 20px !important;
  /* border: 1px solid tomato !important; */
  }

  /* (new50) RIGHT PANEL - IN PLAYER PAGE */
  #column7.column7 ~ .content .row .column5.navWrap3 + .column1 + .column2 ,
  #column7.column7.sticky ~ .content .row .column5.navWrap3 + .column1 + .column2 ,
  .column1 + .column2  {
      position: absolute  !important;
      display: inline-block !important;
      float: none !important;
      width: 5.5% !important;
      height: 3vh !important;
      margin: 0 0 0 0 !important;
      top: 0vh !important;
      right:  0% !important;
      padding: 0px  !important;
      overflow: hidden !important;
      overflow-x: hidden;
      overflow-y: hidden !important;
      z-index: 5000 !important;
  background: #333 !important;
  border: 1px solid #222  !important;
  border: 1px solid aqua  !important;
  }
  /* HOVER */
  #column7.column7 ~ .content .row .column5.navWrap3 + .column1 + .column2:hover ,
  #column7.column7.sticky ~ .content .row .column5.navWrap3 + .column1 + .column2:hover ,
  .column1 + .column2:hover  {
      position: absolute  !important;
      display: inline-block !important;
      float: none !important;
      width: 21.5% !important;
      height: 95vh !important;
      margin: 0 0 0 0 !important;
      right:  0% !important;
      top: 0vh !important;
      padding: 5px  !important;
      overflow: hidden !important;
      overflow-x: hidden;
      overflow-y: auto !important;
      z-index: 5000 !important;
  background: #333 !important;
  border: 1px solid #222  !important;
  border: 1px solid aqua  !important;
  }

  /* .column1 + .column2 #dernierescritiques.couleur1 */

  /* (new50) TOLBEK - FAST MENU - === */
  #column12.column12 {
      position: fixed !important;
      display: inline-block !important;
      height: 35px !important;
      width: 100% !important;
      min-width: 10% !important;
      max-width: 10% !important;
      left: unset !important;
      right: 0 !important;
      bottom: -1vh !important;
      text-align: right !important;
      transform: translateX(0%) !important;
      z-index: 99;
  /* border: 1px solid aqua !important; */
  }
  /* (new52) MENU BOTTOM - IN PLAYER - DISPLAY NONE */
  #column12.column12 > b{
      display: none !important;
      height: 35px !important;
  }
  #column12>b>center {
      height: 39px !important;
      text-align: right !important;
  }
  #column12>b>center i {
      position: relative;
      display: inline-block !important;
      height: 49px;
      top: -24px !important;
      margin-left: -120px !important;
      padding: 0px 20px !important;
      border-radius: 20px 20px 0 0 !important;
      font-size: 15px !important;
      opacity: 0.5 !important;
      transform: scale(0.6) !important;
      transform-origin: bottom right !important;
  color: white;
  background-color: black !important;
  }
  #column12>b>center i.menubasfixenglobe {
      top: -33px !important;
  }

  /* (new37) TOLBEK - LAST CRITIQUES - SIDEBAR - ITEM*/
  .column1 + .column2 {
      float: left;
      height: 870px !important;
      width: 25.5% !important;
      margin-top: -27px !important;
      padding: 0px;
      overflow: hidden !important;
      overflow-y: auto !important;
  }
  .column2 .couleur1 b#navWrap1 {
      margin-top: 0 !important;
      padding: 0 !important;
  background-color: #333 !important;
  }


  .column2 #hann {
      float: left !important;
      width: 50% !important;
      height: 103px !important;
      margin-bottom: 3px !important;
      padding: 3px !important;
      border-radius: 3px !important;
      overflow: hidden !important;
  border: 1px solid red !important;
  }
  .column2 #hann p {
      display: inline-block !important;
      width: 100% !important;
      height: 98px !important;
      margin: 0px !important;
      padding: 0px !important;
      border-radius: 3px !important;
  overflow: hidden !important;
  /* border: 1px solid yellow !important; */
  }

  .column2 #hann p > span  a ,
  .column2 #hann p > span  {
      display: inline-block !important;
      width: 100% !important;
      height: 95px !important;
      line-height: 15px !important;
      margin: 0px !important;
      padding: 0px !important;
      border-radius: 3px !important;
      overflow: hidden !important;
  /* border: 1px solid green !important; */
  }

  .column2 #hann > p > span > a > span > b {
      display: inline-block !important;
      width: 100% !important;
      line-height: 14px !important;
      font-size: 14px !important;
  color: gray !important;
  }

  .column2 #hann>p>span>a>span.flotte{
      float: left !important;
      margin: 0 !important;
      max-width: 8%;
      border-radius: 5px;
  border: none !important;
  /* border: 1px solid blue !important; */
  }

  .column2 #hann>p>span>a>span.flotte img {
      height: 12px;
      width: 12px;
      position: relative;
      top: 0 !important;
  }
  .column2 #hann>p>span>a>span:not(.flotte) {
      float: right !important;
      width: 90% !important;
      height: 92px !important;
      margin: 0px !important;
      padding: 5px !important;
      border-radius: 3px !important;
      overflow: hidden !important;
  border: 1px solid green !important;
  }
  /* (new37) NEW RIGHT PANEL */
  .trend_unity {
      padding: 2px !important;
  border-bottom: 1px solid red !important;
  }
  .trend_title {
      color: peru !important;
  }

  /* ==== CLONES TYPE 2 - TROZAN - 
  http://trozam.com/pvkeztorxj222tjwaboi6uolfjhwdkitf5ig3k1awi1a/
  =====  */
  #ja-topsl.wrap .main.clearfix .ja-box.column.ja-box-left {
      width: 75% !important;
  }
  #ja-topsl.wrap .main.clearfix .ja-box.column.ja-box-right {
      width: 25% !important;
  }

  #ja-container + #ja-topsl.wrap .main {
      display: inline-block !important;
      width: 100% !important;
      max-width: 100% !important;
  }
  body#bd.fs3.FF #ja-mainnav .main.clearfix {
      display: inline-block !important;
      width: 100% !important;
      max-width: 100% !important;
      position: relative;
  }
  body#bd.fs3.FF #ja-header {
      float: right !important;
      max-height: 30px !important;
      width: 100% !important;
      line-height: normal;
      z-index: 100 !important;
  border: 1px solid tomato !important;
  }
  .ja-headermask {
      display: none !important;
  }
  body#bd.fs3.FF #ja-header .inner.clearfix>a>img {
      position: relative;
      width: 88px !important;
      left: -10px;
      top: 0 !important;
  }


  body#bd.fs3.FF #ja-header .main {
      min-width: 99.98% !important;
      max-width: 99.9% !important;
      height: 30px !important;
      margin: 0;
      padding: 0;
  border: 1px solid green !important;
  } 
  .ja-megamenu {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      min-width: 50% !important;
      max-width: 50% !important;
      height: 30px !important;
      margin-left: 20% !important;
      padding: 0;
      z-index: 200 !important;
  /* border: 1px solid red; */
  }
  .ja-megamenu .megamenu.level0 {
      border-right: 1px solid #666666;
      float: left;
      margin: 0;
      padding: 0;
  }

  body#bd.fs3.FF #ja-wrapper #Top + #ja-header + #ja-mainnav {
      position: absolute;
      width: 70% !important;
      height: 30px;
      bottom: 0;
      left: 15% !important;
      top: 0px !important;
      z-index: 200 !important;
  /* border: 1px solid aqua; */
  }


  /* FILM */

  #ja-mainbody {
      float: left;
      width: 76% !important;
  }

  body#bd.fs3.FF #ja-container.wrap.ja-r1 .main.clearfix  {
      position: relative;
      min-width: 100% !important;
      max-width: 100% !important;
      top: -27px !important;
  /* border: 1px solid aqua !important; */
  }

  /* body#bd.fs3.FF #ja-container.wrap.ja-r1 .main.clearfix #ja-mainbody[style="width:80%"]  #ja-main .inner */

  .contentpaneopen:last-of-type {
      float: left !important;
      height: 720px !important;
      width: 77% !important;
  border: 1px solid gray;
  }
  /* COR FLOAT */
  .contentpaneopen:last-of-type p {
      display: block;
      clear: none;
      float: left !important;
      width: 72% !important;
      margin-bottom: -10px;
      margin-left: 5px;
      padding: 3px;
  border: 1px solid red;
  }
  /* COR FLOAT */
  .contentpaneopen>tbody>tr>td>p:first-of-type {
      display: block;
      clear: none;
      float: left !important;
      width: 24% !important;
      height: 636px !important;
      margin-bottom: -10px;
      margin-left: 5px;
      padding: 3px;
  }
  .contentpaneopen>tbody>tr>td>p:first-of-type>img {
      width: 249px;
  }
  /* (new14) PILOT / POLO / BISS */
  body#bd.fs3.FF .ja-content-main.clearfix>div:not(#pilot):not(#polo):not(#biss) {
      position: relative;
      width: 26% !important;
      float: right !important;
      height: 844px !important;
      left: 0;
      margin-bottom: 30px;
      margin-left: 0px !important;
      padding: 0px !important;
      margin-right: -50px !important;
      top: -27px !important;
      overflow: visible !important;
  background-color: #e2e2e2;
  }
  /* (new14) POLO / BISS */
  body#bd.fs3.FF .ja-content-main.clearfix>div#biss  ,
  body#bd.fs3.FF .ja-content-main.clearfix>div#polo {
      padding: 0px !important;
      width: 100% !important;
  }
  body#bd.fs3.FF .ja-content-main.clearfix>div#biss + div[style="position:relative; top:-30px"]  ,
  body#bd.fs3.FF .ja-content-main.clearfix>div#polo + div[style="position:relative; top:-30px"] {
      display: inline-block !important;
      float: none !important;
      min-width: 80% !important;
      max-height: 40px !important;
      top: 0 !important;
      right: 0 !important;
      left: -200px !important;
  /* background: red !important; */
  }

  body#bd.fs3.FF #ja-main .inner {
      padding: 0;
      width: 100% !important;
  }

  .contentpaneopen:last-of-type +span +div #jc {
      min-width: 82% !important;
      margin-right: 58px !important;
      padding: 3px;
  border: 1px solid red;
  }

  #ja-right {
      min-width: 24% !important;
  }

  .jamod-content.ja-box-ct.clearfix>div {
      position: relative !important;
      top: 0;
  background-color: #444444;
  }

  #pilot {
      width: 100% !important;
  }
  .ja-content-main.clearfix>#pilot + div {
      float: left !important;
      min-width: 99% !important;
      max-height: 35px !important;
      margin-right: 50px !important;
      top: 0 !important;
      left: -53px !important;
  }

  /* (new6) TOLBEK - LOGO */
  .logo {
      position: fixed;
      top: 4px;
      left: 25px  !important;
      border-radius: 2px;
      transform: scale(0.6) !important;
      transform-origin: left top 0 !important;
      z-index: 9999;
  border: 1px solid red !important;
  }
  /* SEARCH - TROZAM/GALTRO */
  body.fs3 #ja-search {
      position: absolute;
      right: 75px !important;
      top: 3px !important;
      width: 164px;
      height: 22px ;
      font-size: 12px;
  /* background: aqua !important; */
  }
  /* (new50) SEARCH - GALTRO */
  .barremenu {
      position: fixed !important;
      height: 30px;
      width: 100%;
      top: 0px !important;
      border-radius: 2px;
      z-index: 1 !important;
  /* background-color: #4c4c4c; */
  background-color: #111 !important;
  }

  /* (new52) TOP NAV - ITEMS */
  .column4 {
      position: fixed !important;
      float: none  !important;
      height: 30px !important;
      width: 33% !important;
      left: 7% !important;
      top: 0 !important;
      margin: 0 !important;
      z-index: 5000 !important;
  /* background: green !important; */
  }
  .column4 > nav {
      position: absolute !important;
      height: 30px !important;
      left: 0px !important;
      top: 0px !important;
  /* border: 1px solid aqua  !important; */
  }
  .column4 > nav > ul {
      height: 30px !important;
      margin: 0 !important;
      text-align: center;
  }
  .column4 > nav > ul .drop-down ,
  .column4 > nav > ul li {
      display: inline-block;
  }
  .column4 > nav > ul li a {
      position: relative  !important;
      display: inline-block !important;
      height: 25px !important;
      padding: 0 10px !important;
      margin: 0 0 0 0 !important;
      top: 0px !important;
      font-size: 14px;
      text-decoration: none;
      text-transform: uppercase;
  color: white;
  }
  .column4 > nav > ul .drop-down .drop-down__button {
      display: inline-block;
      height: 25px !important;
      line-height: 25px !important;
      margin: 2px 0 0 0 !important;
      padding: 0 11px;
      border-radius: 4px;
      text-align: left;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #7b7b7b;
  background: #111 !important;
  }


  /* (new52) A L'AFFICHE - PAGINATION */
  .row .column1 > br + center[style="display:flex; flex-wrap:wrap; justify-content:center"] ,
  .row .column1[style^="background-color:"] > br + center[style="display:flex; flex-wrap:wrap; justify-content:center"] {
      position: fixed !important;
      display: inline-block;
      height: auto !important;
      width: 100%;
      max-width: 40% !important;
      min-width: 40% !important;
      left: unset;
      right: 18% !important;
      top: 0vh;
      padding: 1px 2px 3px 2px  !important;
      text-align: center;
      transform: translateX(0%);
      z-index: 99;
  background-color: #111 !important;
  /* border: 1px solid #ccc; */
  /* border: 1px solid tomato !important; */
  }
  /* .row .column1[style^="background-color:"]  > b ~ #hann + br +br + center {
      width: 100% !important;
      height: auto !important;
      line-height: 15px !important;
      display: inline-block !important;
      border-radius: 5px !important;
      margin: 0px 2px 2px 0px !important;
  background: #111 !important;
  border: 1px dotted aqua !important;
  } */

  /* (new50) SEARCH FORM */
  .column5.navWrap3 {
      position: fixed;
      float: right;
      height: 30px;
      width: 150px !important;
      left: 82.5% !important;
      top: 0 !important;
      margin: 0 0 0 0 !important;
      padding: 2px !important;
      z-index: 5 !important;
  /* background: yellow !important; */
  }
  /* (new47) */
  .search {
      display: inline-block !important;
  }

  /* (new12) STICKY SEARCH SUPP */
  .columnSEARCH.sticky2 {
      display: none !important;
  }
  .column6 {
      float: left;
      width: 100%;
  background-color: red !important;
  margin-top: -53px !important;

  }

  .column5.navWrap3 #mod_search_searchword {
      border: 1px solid #979797;
      left: 0px !important;
      padding: 2px 5px !important;
  }

  body#bd.fs3.FF .ja-content-main.clearfix > div:not(#pilot)#page{
      position: relative;
      float: none !important;
      height: auto !important;
      width: 99% !important;
      top: 0px !important;
      left: 0;
      margin-bottom: 0px !important;
      margin-right: 0px !important;
      padding: 0px 5px !important;
      overflow: visible;
  background-color: #e2e2e2;
  border-color: #005c8a;
  /* background: yellow !important; */
  }
  body#bd.fs3.FF .ja-navhelper.wrap{
      display: none !important;
  }


  /* ==== END ==== */
  `;
}
if (location.href.startsWith("https://tomacloud.com/file/") || location.href.startsWith("https://tomacloud.com/iframe/") || location.href.startsWith("https://moacloud.com/file/") || location.href.startsWith("https://moacloud.com/iframe/") || location.href.startsWith("https://cldmax.com/file/") || location.href.startsWith("https://cldmax.com/iframe/")) {
  css += `
  /* CLDMAX - TOMACLOUD - MOACLOUD - File / Iframe (new86) = START - URL PREF - ==== */

  .main_file {
      width: 900px !important;
      margin-bottom: auto !important;
      margin-left: auto;
      margin-right: auto;

  }

  .name_file {
      display: flex;
      float: left;
      width: 880px !important;
      padding: 8px 10px 5px 10px !important;

    font-size: 30px;
  background: #251b26 !important;
  border: 1px solid #9a45ff;
  }
  .video {
      width: 900px !important;
      height: 100%;
      max-height: 100%;
      min-height: 100%;
      margin: 0;
  border: 1px solid #9a45ff !important;
  }

  #myElement.jwplayer:not(.jw-flag-fullscreen) {
      height: auto !important;
      min-height: 99vh !important;
      max-height: 99vh !important;
      max-width: 900px !important;
      min-width: 900px !important;
  /* border: 1px dotted aqua  !important; */
  }
  #myElement:not(.jw-flag-fullscreen) {
      max-width: 900px !important;
      min-width: 900px !important;
  }

  /* (new78) BUTTON - SHOW on TOMACLOUD / MOACLOUD */
  #myElement.jwplayer:not(.jw-flag-fullscreen) + script + a ,
  .video > a {
  /* position: fixed !important; */
  /* display: inline-block !important; */
  /* height: 4vh !important; */
  /* bottom: 3vh !important; */
  /* margin: -4vh 0 0 0 !important; */
  z-index: 500000 !important;
  transform: scale(0.6) !important;
  /* border: 1px dotted aqua  !important; */
  }
  .video > a .buttonshow_on {
      padding: 0px 13px !important;
  }
  .video:hover #myElement.jwplayer:not(.jw-flag-fullscreen) + script + a , 
  .video:hover #myElement ~ a {
      position: fixed;
      bottom: 0vh !important;
      z-index: 50000000 !important;
      display: inline-block !important;
      left: 373px;
      opacity: 0.5 !important;
  }

  #myElement:not(.jw-flag-fullscreen)  .jw-wrapper.jw-reset .jw-aspect.jw-reset  ,
  #myElement:not(.jw-flag-fullscreen) > .jw-aspect.jw-reset  {
      padding-top: 47.25% !important;
  background: #111 !important;
  }
  .video:hover #myElement.jwplayer:not(.jw-flag-fullscreen) + script + a , 
  .video:hover #myElement ~ a {
      position: fixed;
      bottom: 0vh !important;
      z-index: 50000000 !important;
      display: inline-block !important;
      left: 373px;
      opacity: 0.5 !important;
  }
  /* (new67) START - URL PREF - TOMACLOUD / MOACLOUD FILE ==== */
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
