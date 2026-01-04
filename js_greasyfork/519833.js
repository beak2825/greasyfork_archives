// ==UserScript==
// @name         Twitter Enhancement
// @description  Remove promoted tweets and ads from Twitter feed
// @name:ar      تحسين تويتر
// @description:ar  إزالة التغريدات المروجة والإعلانات من تغذية تويتر
// @name:bg      Подобрение за Туитър
// @description:bg  Премахване на промотирани туитове и реклами от емисията на Туитър
// @name:cs      Vylepšení Twitteru
// @description:cs  Odstranění propagovaných tweetů a reklam z feedu Twitteru
// @name:da      Twitter Forbedring
// @description:da  Fjern promoverede tweets og annoncer fra Twitter-feedet
// @name:de      Twitter Verbesserung
// @description:de  Entfernt beworbene Tweets und Werbung aus dem Twitter-Feed
// @name:el      Βελτίωση Twitter
// @description:el  Αφαίρεση προωθούμενων tweets και διαφημίσεων από τη ροή του Twitter
// @name:en      Twitter Enhancement
// @description:en  Remove promoted tweets and ads from Twitter feed
// @name:eo      Twitter Plibonigo
// @description:eo  Forigi promociitajn tvitajn kaj reklamojn el la Twitter-fluo
// @name:es      Mejora de Twitter
// @description:es  Elimina tweets promocionados y anuncios del feed de Twitter
// @name:fi      Twitterin Parannus
// @description:fi  Poista mainostetut twiitit ja mainokset Twitter-syötteestä
// @name:fr      Amélioration de Twitter
// @description:fr  Supprime les tweets sponsorisés et les publicités du fil Twitter
// @name:fr-CA   Amélioration de Twitter
// @description:fr-CA  Supprime les tweets commandités et les annonces du fil Twitter
// @name:he      שיפור טוויטר
// @description:he  הסרת ציוצים מקודמים ופרסומות מהפיד של טוויטר
// @name:hr      Poboljšanje Twittera
// @description:hr  Uklanjanje promoviranih tvitova i oglasa iz Twitter feeda
// @name:hu      Twitter Fejlesztés
// @description:hu  Eltávolítja a promótált tweeteket és hirdetéseket a Twitter hírfolyamból
// @name:id      Peningkatan Twitter
// @description:id  Hapus tweet yang dipromosikan dan iklan dari umpan Twitter
// @name:it      Miglioramento Twitter
// @description:it  Rimuove i tweet promossi e gli annunci dal feed di Twitter
// @name:ja      Twitter強化
// @description:ja  Twitterフィードからプロモーションツイートと広告を削除
// @name:ka      Twitter-ის გაუმჯობესება
// @description:ka  წაშლის პრომოუშენ თვითებსა და რეკლამებს Twitter-ის ნაკადიდან
// @name:ko      트위터 개선
// @description:ko  트위터 피드에서 홍보 트윗과 광고 제거
// @name:nb      Twitter Forbedring
// @description:nb  Fjern promoverte tweets og annonser fra Twitter-feeden
// @name:nl      Twitter Verbetering
// @description:nl  Verwijder gepromote tweets en advertenties uit de Twitter-feed
// @name:pl      Ulepszenie Twittera
// @description:pl  Usuwa promowane tweety i reklamy z feedu Twittera
// @name:pt-BR   Melhoria no Twitter
// @description:pt-BR  Remove tweets promovidos e anúncios do feed do Twitter
// @name:ro      Îmbunătățire Twitter
// @description:ro  Elimină tweet-urile promovate și reclamele din fluxul Twitter
// @name:ru      Улучшение Twitter
// @description:ru  Удаляет продвигаемые твиты и рекламу из ленты Twitter
// @name:sk      Vylepšenie Twitteru
// @description:sk  Odstráni propagované tweety a reklamy z feedu Twitteru
// @name:sr      Побољшање Твитера
// @description:sr  Уклања промовисане твитове и огласе из Твитер фида
// @name:sv      Twitter Förbättring
// @description:sv  Ta bort sponsrade tweets och annonser från Twitter-flödet
// @name:th      การปรับปรุง Twitter
// @description:th  ลบโพสต์ที่ได้รับการโปรโมทและโฆษณาออกจากฟีด Twitter
// @name:tr      Twitter Geliştirme
// @description:tr  Twitter akışından tanıtılan tweetleri ve reklamları kaldır
// @name:ug      Twitter ياخشىلاش
// @description:ug  Twitter ئېقىمىدىن تەشۋىق قىلىنغان تىۋىتلار ۋە ئېلانلارنى چىقىرىۋېتىش
// @name:uk      Покращення Twitter
// @description:uk  Видаляє просувані твіти та рекламу зі стрічки Twitter
// @name:vi      Cải tiến Twitter
// @description:vi  Xóa các tweet được quảng bá và quảng cáo khỏi nguồn cấp dữ liệu Twitter
// @name:zh      Twitter增强
// @description:zh  从Twitter feed中移除推广推文和广告
// @name:zh-CN   Twitter增强
// @description:zh-CN  从Twitter feed中移除推广推文和广告
// @name:zh-HK   Twitter增強
// @description:zh-HK  從Twitter feed中移除推廣貼文同廣告
// @name:zh-SG   Twitter增强
// @description:zh-SG  从Twitter feed中移除推广推文和广告
// @name:zh-TW   Twitter增強
// @description:zh-TW  從Twitter動態消息中移除推廣貼文與廣告
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @author       aspen138
// @match        *://twitter.com/*
// @match        *://x.com/*
// @grant        none
// @license      MIT
// @grant        GM_addStyle
// @icon         https://about.twitter.com/etc/designs/about2-twitter/public/img/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/519833/Twitter%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/519833/Twitter%20Enhancement.meta.js
// ==/UserScript==


// Twitter Ad Remover
(function() {
    function hideAd(node) {
        if (
            !node ||
            node.nodeName !== "DIV" ||
            node.getAttribute("data-testid") !== "cellInnerDiv"
        ) {
            return;
        }

        const adArticle = node.querySelector("div[data-testid='placementTracking'] > article");
        if (!adArticle) {
            return;
        }

        node.style.cssText += "display: none;";
    }

    // Observe for newly added nodes and hide ads in them
    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(hideAd);
        });

        // Hide the sidebar ad
        const sidebarAd = document.querySelector("#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > main > div > div > div > div.css-175oi2r.r-aqfbo4.r-10f7w94.r-1hycxz > div > div.css-175oi2r.r-1hycxz.r-gtdqiz > div > div > div > div:nth-child(3) > div > aside");
        if (sidebarAd) {
            sidebarAd.style.display = 'none';
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial pass to hide existing ads
    document.querySelectorAll("div[data-testid='cellInnerDiv']").forEach(hideAd);

    function removePromotedTweets(node) {
        node = node || document.body;
        const tweets = node.querySelectorAll('article[data-testid="tweet"]');

        tweets.forEach((tweet) => {
            const adLabel = tweet.querySelector('div[dir="ltr"] > span');
            if (adLabel && (adLabel.textContent === 'Promoted' || adLabel.textContent === 'Ad')) {
                tweet.remove();
            }
        });
    }

    // Initial removal of promoted tweets
    removePromotedTweets();

    // Observe the DOM for changes and remove newly added promoted tweets
    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    removePromotedTweets(node);
                }
            });
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();



// I can understand summarizing a user's profile. But what's the point of summarizing a tweet that's not even very long????
// hide Grok xAI "explain this post"
(function() {
    'use strict';

    // Inject a <style> tag with display: none !important for the specific SVG elements
    const style = document.createElement('style');
    style.innerHTML = 'button[aria-label="Grok actions"] { display: none !important; }';
    document.head.appendChild(style);

    // Select all specific SVG elements based on their class names
    const svgElements = document.querySelectorAll('button[aria-label="Grok actions"]');

    // Hide each matched SVG element
    svgElements.forEach(svg => {
        svg.style.display = 'none';
    });
})();