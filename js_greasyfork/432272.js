// ==UserScript==
// @name         Google Play Redeem
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fake Google Play Card Redeem
// @author       Unknown name (:
// @match        https://play.google.com/store
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// Please donate Bitcoin: 12umH9ZYJZhf51Jw4qBHUpTYW7xukMQs1f
// @downloadURL https://update.greasyfork.org/scripts/432272/Google%20Play%20Redeem.user.js
// @updateURL https://update.greasyfork.org/scripts/432272/Google%20Play%20Redeem.meta.js
// ==/UserScript==
(function() {
    'use strict';
    loop();

    function loop() {
        const observer = new MutationObserver((mutations, obs) => {
            const hello = document.getElementsByClassName('LkLjZd ScJHi nMZKrb mgVrBf xjAeve');
            if (hello.length > 0) {

                function sleep(time) {
                    return new Promise((resolve) => setTimeout(resolve, time));
                }

                document.body.getElementsByClassName("LkLjZd ScJHi nMZKrb mgVrBf xjAeve")[1].addEventListener("click", function() {

                    var cardValue = document.body.getElementsByClassName("whsOnd zHQkBf")[0].getAttribute("data-initial-value");
                    var cashAmount = "$25";
                    if (cardValue[3] == '0') {
                        cashAmount = "$50";
                    } else if (cardValue[3] == '1') {
                        cashAmount = "$100";
                    } else if (cardValue[3] == '2') {
                        cashAmount = "$200";
                    } else if (cardValue[3] == '3') {
                        cashAmount = "$300";
                    } else if (cardValue[3] == '4') {
                        cashAmount = "$400";
                    } else if (cardValue[3] == '5') {
                        cashAmount = "$500";
                    }


                    document.body.getElementsByClassName("g3VIld LhXUod t89eC Up8vH J9Nfi iWO5td")[0].innerHTML = '<div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div><div jsname="r4nke" class="R6Lfte tOrNgd qRUolc gZccZc"><div jsname="YASyvd" class="PNenzf" role="heading" aria-level="1" id="dwrFZd0"><div class="MSFxAb"><img src="//www.gstatic.com/android/market_images/web/play_prism_160px.png" class="T75of CTjLKc undefined" aria-hidden="true" data-iml="176407.30000001192"></div><div class="IguNCd"><div>Redeem Code<div class="TedqDf">basketbal23@gmail.com</div></div></div></div><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="OllbWe" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb   " jsaction="click:DJ6zke" data-id="IbE0S" jslog="72813; 1:889; track:click; mutable:true">Cancel</button>  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  ">Redeem</button></div></div></div><span jsslot="" jsname="bN97Pc" class="PbnGhe oJeWuf fb0g6 Pq2lFf" jsaction="Vws5Ae:.CLIENT"><div jscontroller="vgigk" jsaction="WL7cse:aj0Jcf;" jslog="72811; 1:880; track:impression;" class="f5jHzb"><div class="rFrNMe XyrYJf zKHdkd CDELXb" jscontroller="pxq3x" jsaction="clickonly:KjsqPd; focus:Jt1EX; blur:fpfTEe; input:Lg5SV" jsshadow="" jsname="YPqjbf"><div class="aCsJod oJeWuf"><div class="aXBtI Wic03c"><div class="Xb9hP"><img src="https://i.imgur.com/XWflLem.gif" data-iml="552584.099999994" style="width: 59px;margin-right: 23px;margin-top: -18px;"><input type="text" class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="off" tabindex="0" aria-label="Enter gift card or promo code" maxlength="175" jslog="72815; 1:888; track:click; mutable:true" data-initial-value="afdsafdsafdsafdsafdsa" badinput="false" dir="ltr"><div jsname="LwH6nd" class="ndJi5d snByac" aria-hidden="true">Enter gift card or promo code</div></div><div class="i9lrp mIZh1c"></div><div jsname="XmnwAc" class="OabDMe cXrdqd Y2Zypf" style="transform-origin: 231.5px center;"></div></div></div><div class="LXRPh"><div jsname="ty6ygf" class="ovnfwe Is7Fhb"></div></div></div><div class="TedqDf O9PNUb">By clicking Redeem, you agree to the Gift Card &amp; Promotional Code <a class="MAc20b" target="_blank" href="https://play.google.com/intl/en_us/about/redeem-terms.html"></a>, as applicable.</div></div></span><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="XfpsVe J9fJmf" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb   " jsaction="click:DJ6zke" data-id="IbE0S" jslog="72813; 1:889; track:click; mutable:true">Cancel</button>  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  " data-id="EBS5u" jslog="72812; 1:882; track:click; mutable:true">Redeem</button></div></div><div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div>';

                    document.body.getElementsByClassName("whsOnd zHQkBf")[0].setAttribute("placeholder", cardValue);
                    sleep(1500).then(() => {

                        document.body.getElementsByClassName("g3VIld LhXUod t89eC Up8vH J9Nfi iWO5td")[0].innerHTML = '<div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div><div jsname="r4nke" class="R6Lfte tOrNgd qRUolc gZccZc"><div jsname="YASyvd" class="PNenzf" role="heading" aria-level="1" id="dwrFZd0"><div class="MSFxAb"><img src="//www.gstatic.com/android/market_images/web/play_prism_160px.png" class="T75of CTjLKc undefined" aria-hidden="true" data-iml="2584.199999988079"></div><div class="IguNCd"><div>Redeem Code<div class="TedqDf">basketbal23@gmail.com</div></div></div></div><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="OllbWe" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb   " jsaction="click:DJ6zke" data-id="IbE0S" jslog="72813; 1:889; track:click; mutable:true">Cancel</button>  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  " jsaction="click:DJ6zke" data-id="EBS5u" jslog="72812; 1:882; track:click; mutable:true">Redeem</button></div></div></div><span jsslot="" jsname="bN97Pc" class="PbnGhe oJeWuf fb0g6 Pq2lFf" jsaction="Vws5Ae:.CLIENT"><div jscontroller="vgigk" jsaction="WL7cse:aj0Jcf;" jslog="72811; 1:880; track:impression;" class="f5jHzb"><div class="rFrNMe XyrYJf zKHdkd" jscontroller="pxq3x" jsaction="clickonly:KjsqPd; focus:Jt1EX; blur:fpfTEe; input:Lg5SV" jsshadow="" jsname="YPqjbf"><div class="aCsJod oJeWuf"><div class="aXBtI Wic03c"><div class="Xb9hP"><input type="text" class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="off" tabindex="0" aria-label="Enter gift card or promo code" maxlength="175" jslog="72815; 1:888; track:click; mutable:true" data-initial-value=""><div jsname="LwH6nd" class="ndJi5d snByac" aria-hidden="true" style="font-weight: 900;color: black;">You are redeeming to account: *******al23@gmail.com</div></div><div class="i9lrp mIZh1c"></div><div jsname="XmnwAc" class="OabDMe cXrdqd Y2Zypf" style="transform-origin: 122.5px center;"></div></div></div><div class="LXRPh"><div jsname="ty6ygf" class="ovnfwe Is7Fhb"></div></div></div><div class="TedqDf O9PNUb">By clicking Redeem, you agree to the Gift Card &amp; Promotional Code <a class="MAc20b" target="_blank" href="https://play.google.com/intl/en_us/about/redeem-terms.html">Terms and Conditions</a>, as applicable.</div></div></span><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="XfpsVe J9fJmf" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb   " jsaction="click:DJ6zke" data-id="IbE0S" jslog="72813; 1:889; track:click; mutable:true">Cancel</button>  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  ">Confirm</button></div></div><div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div>';
                        document.body.getElementsByClassName("LkLjZd ScJHi nMZKrb mgVrBf xjAeve")[1].addEventListener("click", function() {
                            document.body.getElementsByClassName("g3VIld LhXUod t89eC Up8vH J9Nfi iWO5td")[0].innerHTML = '<div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div><div jsname="r4nke" class="R6Lfte tOrNgd qRUolc gZccZc"><div jsname="YASyvd" class="PNenzf" role="heading" aria-level="1" id="dwrFZd0"><div class="MSFxAb"><img src="//www.gstatic.com/android/market_images/web/play_prism_160px.png" class="T75of CTjLKc undefined" aria-hidden="true" data-iml="2584.199999988079"></div><div class="IguNCd"><div>Redeem Code<div class="TedqDf">basketbal23@gmail.com</div></div></div></div><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="OllbWe" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb   " jsaction="click:DJ6zke" data-id="IbE0S" jslog="72813; 1:889; track:click; mutable:true">Cancel</button>  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  " jsaction="click:DJ6zke" data-id="EBS5u" jslog="72812; 1:882; track:click; mutable:true">Redeem</button></div></div></div><span jsslot="" jsname="bN97Pc" class="PbnGhe oJeWuf fb0g6 Pq2lFf" jsaction="Vws5Ae:.CLIENT"><div jscontroller="vgigk" jsaction="WL7cse:aj0Jcf;" jslog="72811; 1:880; track:impression;" class="f5jHzb"><div class="rFrNMe XyrYJf zKHdkd" jscontroller="pxq3x" jsaction="clickonly:KjsqPd; focus:Jt1EX; blur:fpfTEe; input:Lg5SV" jsshadow="" jsname="YPqjbf"><div class="aCsJod oJeWuf"><div class="aXBtI Wic03c"><div class="Xb9hP"><img src="https://i.imgur.com/XWflLem.gif" data-iml="552584.099999994" style="width: 59px;margin-right: 23px;margin-top: -18px;"></img><input type="text" class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="off" tabindex="0" aria-label="Enter gift card or promo code" maxlength="175" jslog="72815; 1:888; track:click; mutable:true" data-initial-value=""><div jsname="LwH6nd" class="ndJi5d snByac" aria-hidden="true" style="font-weight: 900;color: black; margin-left:65px;">You are redeeming to account: *******al23@gmail.com</div></div><div class="i9lrp mIZh1c"></div><div jsname="XmnwAc" class="OabDMe cXrdqd Y2Zypf" style="transform-origin: 122.5px center;"></div></div></div><div class="LXRPh"><div jsname="ty6ygf" class="ovnfwe Is7Fhb"></div></div></div><div class="TedqDf O9PNUb">By clicking Redeem, you agree to the Gift Card &amp; Promotional Code <a class="MAc20b" target="_blank" href="https://play.google.com/intl/en_us/about/redeem-terms.html">Terms and Conditions</a>, as applicable.</div></div></span><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="XfpsVe J9fJmf" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  ">Ok</button></div></div><div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div>';
                            sleep(1500).then(() => {
                                document.body.getElementsByClassName("g3VIld LhXUod t89eC Up8vH J9Nfi iWO5td")[0].innerHTML = '<div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div><div jsname="r4nke" class="R6Lfte tOrNgd qRUolc gZccZc"><div jsname="YASyvd" class="PNenzf" role="heading" aria-level="1" id="dwrFZd0"><div class="MSFxAb"><img src="//www.gstatic.com/android/market_images/web/play_prism_160px.png" class="T75of CTjLKc undefined" aria-hidden="true"></div><div class="IguNCd"><div>Redeem Code<div class="TedqDf">basketbal23@gmail.com</div></div></div></div><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="OllbWe" jsname="c6xFrd"><div class="dIodBf"><button class="LkLjZd ScJHi  nMZKrb   " jsaction="click:DJ6zke" data-id="IbE0S" jslog="72813; 1:889; track:click; mutable:true">Cancel</button>  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  " jsaction="click:DJ6zke" data-id="EBS5u" jslog="72812; 1:882; track:click; mutable:true">Redeem</button></div></div></div><span jsslot="" jsname="bN97Pc" class="PbnGhe oJeWuf fb0g6 Pq2lFf" jsaction="Vws5Ae:.CLIENT"><div jscontroller="vgigk" jsaction="WL7cse:aj0Jcf;" jslog="72811; 1:880; track:impression;" class="f5jHzb"><div class="rFrNMe XyrYJf zKHdkd" jscontroller="pxq3x" jsaction="clickonly:KjsqPd; focus:Jt1EX; blur:fpfTEe; input:Lg5SV" jsshadow="" jsname="YPqjbf"><div class="aCsJod oJeWuf"><div class="aXBtI Wic03c"><div class="Xb9hP"><input type="text" class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="off" tabindex="0" aria-label="Enter gift card or promo code" maxlength="175" jslog="72815; 1:888; track:click; mutable:true" data-initial-value="" badinput="false"><div jsname="LwH6nd" class="ndJi5d snByac" aria-hidden="true" style="font-weight: 900;margin-left: 84px;color: black;">$500 has been added to your balance</div></div><div class="i9lrp mIZh1c"></div><div jsname="XmnwAc" class="OabDMe cXrdqd Y2Zypf"></div></div></div><div class="LXRPh"><div jsname="ty6ygf" class="ovnfwe Is7Fhb"></div></div></div><div class="TedqDf O9PNUb" style="color: transparent;">By clicking Redeem, you agree to the Gift Card &amp; Promotional Code <a class="MAc20b" target="_blank" href="https://play.google.com/intl/en_us/about/redeem-terms.html" style="color: transparent;" disabled="">Terms and Conditions</a>, as applicable.</div></div></span><div jsaction="ih4XEb:DJ6zke;JIbuQc:npT2md" class="XfpsVe J9fJmf" jsname="c6xFrd"><div class="dIodBf">  <button class="LkLjZd ScJHi  nMZKrb mgVrBf xjAeve  ">Ok</button></div></div><div tabindex="0" aria-hidden="true" class="pw1uU" jsaction="focus:.CLIENT"></div>';
                                document.body.getElementsByClassName("ndJi5d snByac")[0].innerHTML = cashAmount + " has been added to your balance";
                                var mainElement = document.getElementsByClassName("llhEMd bYEzqc iWO5td")[0];
                                document.body.getElementsByClassName("LkLjZd ScJHi nMZKrb mgVrBf xjAeve")[1].addEventListener("click", function() {
                                    mainElement.remove();
                                    loop();
                                });
                            });
                        });
                    });
                });
                obs.disconnect();
                return;
            }

        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
})();