// ==UserScript==
// @name         posts
// @namespace    http://tampermonkey.net/
// @version      2024-09-81
// @description  remove spam posts and other users
// @author       You
// @match        https://saidit.net/s/all/new*
// @match        https://saidit.net/s/all/top*
// @match        https://saidit.net/s/all/hot*
// @match        https://saidit.net/s/all*
// @match        https://saidit.net/new/*
// @match        https://saidit.net/insightful/*
// @match        https://saidit.net/fun/*
// @match        https://saidit.net/top/*
// @match        https://saidit.net/
// @match        https://saidit.net/?count*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=saidit.net
// @grant        none
// @license      AGPL 3.1
// @downloadURL https://update.greasyfork.org/scripts/506662/posts.user.js
// @updateURL https://update.greasyfork.org/scripts/506662/posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.entries(document.querySelectorAll("p.title:not(.may-blank)")).reduce(function(res, item) {
        let title = item[1].innerText;
        let author = item[1].parentNode.parentNode.querySelector(".author").innerText;
        let domain = item[1].parentNode.parentNode.querySelector(".domain").childNodes[0].getAttribute("href");

        if(title.indexOf(" ") < 0) {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(domain.indexOf(".moe") >= 0) {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(domain.indexOf("pomf2.lain.la") >= 0) {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(domain.indexOf("john1126.com") >= 0) {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Priyanka112") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sonilovelyseo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Urvashi1107") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "gxhzjbg") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sofihayat") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jaksy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "fabricodryclean") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Anastasia") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "james208") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "aumglobal") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "cakesncaksshop") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rohannsharma13") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kousalya") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bat42") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "egizsolution") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "henryjack6952") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Aladinlegaspiseo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "nehanp") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "SarahTylor") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "satgurueducation") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jalahi7325") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zabaru") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bayanprof12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zimahete") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ShellyCampbell") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bayanprof12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Jamesdvdd") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Lynxbuildinhg") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Kiransharma00") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rayan") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "tevasve") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "aniket") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "emman04") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "whatamireallydoing") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "michaeljackson8076") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "IPTVTrends") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mijixeb739") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "loop1414") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "KhandelwalA") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Brayden_765") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Doglas1") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Poonamdr1726") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Angelika_76") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "thomasmartink") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Kimbarly12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "XTREAM4U") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "peter1309") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ClonifyNow") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sanjogi456") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "vandddsane123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Seraphina29") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kunjrajput") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "allegientsky") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jenniferd") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "SamCorp") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "gannaantolikbezega ") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bobmorrison") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "marketingmavens") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "NorAisyahhh") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "taskpr") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kusdv8oij") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Savemoney") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "appdevelopersinida") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "incognito0432") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "abisha") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "shawnphilliptraining") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "radoboy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "saidthemost") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ljena") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "homeiateam") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ex5mrn1okshy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rekiyadesigns") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "JobHuntMode") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zeivia") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "simonharris") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jc4710875") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ibtonystark") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "searozer") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "lefeve") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mixagripflu") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sedebbbb") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "yahahmaa") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sivassk") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "teenpatti") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "joshschumann") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Jayakumar24") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "purvituvar") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "pbwDDD60897") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Techomsystem01") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "fusionbodyart") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "junesmith") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Roslinmathew") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Speechactors") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sdfsdfasdaasf") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ArunPandit") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Infiapp") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "WoodyWoodPecker") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "BABU") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Apptunixdubai") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "aceson03") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Amirr010") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "risingarc") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Kritirai") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sofiamurphy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "fafelevi") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "keegen") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "elinafft24") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ibmohit") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sox15345") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ryeeeeeee") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "keesetrian") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ysrj1987") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Eternal-iptv") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "BarackObama") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sabita") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "43g4w") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "liyanitseo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Velvet_bloom") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "devcnailo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "degraff") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ekd11296") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "naromanadinaho") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ekd11296") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "degraff") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "gary85k") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "John_Edwin") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "theshutterstudio") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "elihurrellfasion") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kathrynvaughn") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Elanor") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "tomasmartikn") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "6vqejpuyxo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "hokerdanial") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "hajafo2945") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "olescampeoneos") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "anaradomanis") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "helmsjoe926") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "elinafft24") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "james208") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zksdaxkubmwm") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "parejonean") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rekha12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "eyt71876") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ds164") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "arriazapharof") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "yix72274") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mmm321") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "samsulak00077w") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bungkusindomie") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Naru") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ieh00231") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "theautocops") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Cadyce") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "keya") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "HellishHermit") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "cokigur") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "doginventer") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "xodop51861") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "wdoth") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "AEOR") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mauricekhan") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Seamus") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "menasmith") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "MOSTAFA15050") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "carn0ld03") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jeromelightson") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "drmth") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "cbdth") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "RoidedGoon") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kwm03098") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sucklat") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "xoenix") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "amansingh01") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Betty") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "joshuawilliamgu") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Dishan1") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Rubert1234") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Questionable") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bibirmanis") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Cancelthis") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Dune1032") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "RR10110") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "UBERGheist") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Neha27") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "cat2606") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "roerade") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "smithsofia") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zyxzevn") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ellenasmith") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Eiysys") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Velma") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kera") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rdx0047") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "banikol") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "oaysjsf") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Chop_Chop") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "j42690015") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kocikoci") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Happyme") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Captain_Codpiece") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "American_Muskrat") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "falguni56") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Johnsonrio") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ruperttaylor") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Samantha") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ellywilson") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Funcity") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Wanttoeatchicken") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "aysrtd") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bheryt") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "chandershekhar") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "michelwilson2680") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sdfd33") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Ace31") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "laragreenway90") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "DRSAHANA") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sanfkj55s") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "promptedify") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "HostingSeeker") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Singoo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "medesignoklahoma") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "hootsellbalthazarpi") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "colincoelho76534") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "yokth") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "FuckYouReddit_666") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "thehomelessromantic") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "revelation") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "redpo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mink") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jcjkkkk") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "MATHEWkaran") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "blackvoodoowhitesnow") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Hyperlink9") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "airlineskelpdesk") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Gravi") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Flint") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "salvia_div") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "step2gen") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "vesinhazclear") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "finnfoster") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "meerajogii") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rossjelly") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "curominds") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "freequalifiedleads") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "InkoHoreca") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "HibikiBlack") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "TheCatholicState") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Praveendadri") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rishishrama1") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "noshore4me") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mageleven") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "P-38lightning") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "neolib") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "x0x7") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "JasonCarswell") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "fledixinfotech") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jayak") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "siddhii") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rockyrock") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "drkhera") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "johnsmith315") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Poohads") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jihad") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "IkeConn") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "detty") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Amandas") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jimmie_jim_bob") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "fernaddis") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "viteplan") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Aday") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Rastafoo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Rox_89") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "comfysnail") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ZephirAWT") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ajckc") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "monkeymart") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Inventcolabs") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "fsaesswf") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "hairtattoo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "[deleted]") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "liya91") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "astroera") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Globalasyucareherbal") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "colourcubz") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "corvidsindia") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Brewdabier") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Myocarditis-Man") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "theautocops12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "froissart_se") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "netsoftmlmsoftware") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "nylalopez") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Imtiaz") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "promlmsoftware") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Nectarbits") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "GlobalAyucare") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "lunavaleria26") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "stocknews83") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "tyranicaloverlord") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "TheMagicFlute") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "alimtedaduae") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "carolelyze") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "justinsaran") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Healingmoments") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sinisterstore") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bellyjane") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Mcheetah") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "PragmaticStoicism") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "TheStandingResident") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "FAb12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "devangshah") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "madazzahatter808") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "LarrySwinger2") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Bytefaze") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rrr10110") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jessicascott") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Zoomergroid") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "i5joints") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bejer48179") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "MarkShirley") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "monika") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "laravelwizard") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "gannaantolikbezega") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "poojabestverma") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zaein") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "IMissPorn") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ShoahKahn") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "emasum123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "donkeykongmaster") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "karin1212") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "RRR_10110") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "infogentech") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "obotzcanada") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "marcomega19") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "nimbusdefenceacademy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "imathscanada") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "nimbussias") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Ankita0911") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Keri10") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Wrenchit23") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "tekkiwebsolutions") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "mander2000") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Abhi2302") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Trupeer") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "netabbb") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Rajeeshi") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "send_nasty_stuff") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jaibhamb") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "EasyCarRemoval") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Ajaibhamb") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ucmasusa") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Sanaellie") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Jacksparrow6") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "MarkJefferson") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rubi22") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "greyone") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ID10T") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Airhub") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "lionG") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Scientoligist") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Scientologist") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Rumagent") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "clairemiller069") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "listostrom") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "commercialnoida") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "canuck3157") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "thomastheglassexpert") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "GrayppleDesign") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "acruxconsult") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "devendra44") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "calvintheo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jazib") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "laurareed") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Tom9152") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "perfume12") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Johnsilla") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Entropick") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "OzwinEVCG") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "dishanttomar") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "DRONEWAY") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "successmantra") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "rubberbiscuit") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "palakmd") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "stevealan") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sarataskin") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bward") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "brucewayne1329") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Marks") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "georgiamill") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "lmd5pstarmail") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "carls") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "TINXXXM") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bitcot") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "IronPlane") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "securityandcabling") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "RealCheekClapper") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Marion") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "quickassignment01 ") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Marrie") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Jan_Schmitt") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Drewski") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "wolfswen123456789") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "dassahs") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "julia") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "TimothyMcFuck") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "syenapp") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "sagartech") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "josephinesaro568") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "josephprince") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Kavya007") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jasonvanof") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "DconRenovations") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Peopleheart") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "techmindsgroup") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Manpreet2302") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "finbuzz") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "atlassteelco") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Jack_Jackyyy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "uncledavespices") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "gloomy_bear") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Afzalkhan1") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "JohnsSand") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "abmiddleeast") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "blockwoods") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "happylimousine") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "delicious6216") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Ateena") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Monney") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "PG3000") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "happypanda") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "iamonlyoneman") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "adlermeyer01") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "amaanyaar") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "aliceshaw") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "bibek21") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "devdigo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "grap3juis") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Smalls") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Zomvi") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "wiixy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "krplus") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "SoCo") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "yenigirisadresi") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "DRtbAhrAoLyf2") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "QueenBread") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Annairdrie") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "SEWINGMACHINESHOP") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "partjd") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "nikki") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "frankielc") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Richard_Parker") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Nintendogirl2") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jet199") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "myleneco14") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "abellaarora01") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "anuragpandey") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "helens") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "zobguv") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "anuragpandey") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "religon") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "M1GarandDad") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "jadin") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Melissa") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "TurkishDelight") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ercsprivatelimited") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kirsiya") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "HugodeCrevellier") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "pavingcotswold") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "emilyshoviv04") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "POLARBEAR") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "salmakhan") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "addwebsolutions") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Jiminy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "roopantaran") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "kudoist") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Zomb") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "BenitoGreen99") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "H3v8") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "SoylentGreenEnergy") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "qwsaed") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "DesktopHut") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "RedditButt") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "palestineshirts") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Canbot") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Chipit") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Maurer") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "stoptheearth") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "ChenabGourmet") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "antares") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "JoshSwag") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "unclesnr") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "proximityfactor") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "Nasser") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        } else if(author == "job123") {
            item[1].parentNode.parentNode.remove();
            return false;
        }


        return true;
    }, true);

})();