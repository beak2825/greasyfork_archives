// ==UserScript==
// @name AdGuard Extra 
// @name:be AdGuard Extra 
// @name:cs AdGuard Extra 
// @name:da AdGuard Extra 
// @name:de AdGuard Extra 
// @name:es AdGuard Extra 
// @name:fi AdGuard Extra 
// @name:fr AdGuard Extra 
// @name:he AdGuard Extra 
// @name:hr AdGuard Extra 
// @name:hu AdGuard Extra 
// @name:id AdGuard Extra 
// @name:it AdGuard Extra 
// @name:ja AdGuard Extra 
// @name:ko AdGuard Extra 
// @name:lt AdGuard Extra 
// @name:nl AdGuard Extra 
// @name:no AdGuard Extra 
// @name:pl AdGuard Extra 
// @name:pt-PT AdGuard Extra 
// @name:pt AdGuard Extra 
// @name:ro AdGuard Extra 
// @name:ru AdGuard Extra 
// @name:sk AdGuard Extra 
// @name:sl Uporabi AdGuard Extra 
// @name:sr AdGuard ekstra 
// @name:tr AdGuard Extra 
// @name:uk AdGuard Extra 
// @name:vi AdGuard Extra 
// @name:zh-TW AdGuard Extra 
// @name:zh AdGuard Extra 
// @namespace    adguard
// @version      1.0.440.1
// @description This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser. 
// @description:be AdGuard Extra прызначаны для вырашэння складаных выпадкаў, калі звычайных правілаў блакавання рэкламы недастаткова. 
// @description:cs AdGuard Extra má za úkol řešit složité případy, když běžná pravidla pro blokování reklam nestačí. 
// @description:da AdGuard Extra er designet til at løse komplicerede tilfælde, hvor alm. adblockingregler ikke er nok. 
// @description:de AdGuard Extra wurde entwickelt, um komplexe Fälle zu lösen, wenn normalen Regeln zum Sperren von Werbung nicht ausreichen. 
// @description:es AdGuard Extra está diseñado para resolver casos complicados cuando las reglas regulares para bloqueo de anuncios no son suficientes. 
// @description:fi AdGuard Extra on suunniteltu ratkaisemaan monimutkaisia tapauksia kun tavalliset mainosten estosäännöt eivät riitä. 
// @description:fr AdGuard Extra est conçu pour résoudre les cas complexes lorsque les règles de blocage des publicités ne suffisent pas. 
// @description:he AdGuard Extra מתוכנן לפתור מקרים מורכבים בהם כללים רגילים של חסימת פרסומות אינם מספיקים. 
// @description:hr AdGuard Extra je dizajniran za rješavanje kompleksnih slučajeva kada opća pravila blokade oglasa nisu dovoljna. 
// @description:hu Az AdGuard Extra olyan bonyolultabb esetek megoldására szolgál, amikor a hagyományos hirdetésblokkolási szabályok nem elegendőek. 
// @description:id AdGuard Extra dirancang untuk menyelesaikan kasus rumit saat aturan pemblokiran iklan biasa tidak cukup. 
// @description:it AdGuard Extra è progettato per risolvere casi complicati in cui le normali regole di blocca-annunci non sono sufficienti. 
// @description:ja AdGuard Extraは、通常の広告ブロックルールが十分ではない複雑なケースを解決するために設計されています。 
// @description:ko AdGuard Extra는 일반적인 광고 차단 규칙이 충분하지 않은 복잡한 문제를 해결하도록 설계되었습니다. 
// @description:lt AdGuard Extra yra skirtas išspręsti sudėtingesnius atvejus, kai nepakanka įprastų skelbimų blokavimo taisyklių. 
// @description:nl AdGuard Extra is bedoeld om ingewikkelde gevallen op te lossen wanneer de standaard advertentie blokkeringsregels niet voldoende blijken. 
// @description:no AdGuard Extra er utformet for å løse kompliserte saker der vanlige blokkeringsoppføringer ikke strekker til. 
// @description:pl AdGuard Extra jest przeznaczony do rozwiązywania skomplikowanych przypadków, gdy zwykłe reguły blokowania reklam nie wystarczą. 
// @description:pt-PT O AdGuard Extra é indicado para resolver casos complicados onde as regras regulares de bloqueio de anúncios não são suficientes. 
// @description:pt O AdGuard Extra é indicado para resolver casos complicados onde as regras regulares de bloqueio de anúncios não são suficientes. 
// @description:ro AdGuard Extra este creeat să rezolve cazuri complexe când regulile uzuale de blocat reclame sunt insuficiente. 
// @description:ru AdGuard Extra предназначен для решения более сложных задач, когда обычных правил блокировки рекламы недостаточно. 
// @description:sk AdGuard Extra má za úlohu riešiť zložité prípady, keď bežné pravidlá blokovania reklám nestačia. 
// @description:sl AdGuard Extra naj bi rešil zapletene primere, ko običajna pravila za zaviranje oglasov niso dovolj. 
// @description:sr AdGuard Extra bi trebalo da reši komplikovane slučajeve u kojima standardna pravila blokiranja reklama nisu dovoljna. 
// @description:tr AdGuard Extra, normal reklam engelleme kurallarının yeterli olmadığı karmaşık durumları çözmek için tasarlanmıştır. 
// @description:uk AdGuard Extra призначений для вирішення складних завдань, коли звичайних правил для блокування реклами недостатньо. 
// @description:vi AdGuard Extra được thiết kế để giải quyết các vấn đề khi mà các quy tắc chặn quảng cáo thông thường chưa đủ. 
// @description:zh-TW 當常規的廣告封鎖規則不夠時，AdGuard Extra 旨在解決複雜的情況。 
// @description:zh AdGuard Extra 旨在解决常规的广告拦截规则无能为力的复杂情况。 
// @homepageURL  https://adguard.com/
// @author       AdGuard
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @exclude *://mil.ru/*
// @exclude *wikipedia.org*
// @exclude *icloud.com*
// @exclude *hangouts.google.com*
// @exclude *www.facebook.com/plugins/*
// @exclude *www.facebook.com/v*/plugins*
// @exclude *disqus.com/embed/comments*
// @exclude *vk.com/widget*
// @exclude *twitter.com/intent/*
// @exclude *www.youtube.com/embed/*
// @exclude *player.vimeo.com*
// @exclude *coub.com/embed*
// @exclude *staticxx.facebook.com/connect/xd_arbiter/*
// @exclude *vk.com/q_frame*
// @exclude *tpc.googlesyndication.com*
// @exclude *syndication.twitter.com*
// @exclude *platform.twitter.com*
// @exclude *tutosdeath.blogspot.com*
// @exclude *notifications.google.com*
// @exclude *google.com/recaptcha/*
// @exclude *bizmania.ru/*
// @downloadURL https://update.greasyfork.org/scripts/436539/AdGuard%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/436539/AdGuard%20Extra.meta.js
// ==/UserScript==
