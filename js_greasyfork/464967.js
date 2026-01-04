// ==UserScript==
// @name         巴哈嵌入推特推文
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=abz093764953
// @version      1.01
// @description  ㄐㄐ
// @author       Xiu修
// @match        http://*/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBEQACEQEDEQH/xAAbAAEBAQADAQEAAAAAAAAAAAABAAIEBQcGA//EADMQAAIBAgQDBQUJAQAAAAAAAAABAgMRBAUhMQYSQRMUYXGBJFGRobEiIzNTYnKC0dIV/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAEEAgUGA//EACsRAQACAQIEBQQCAwAAAAAAAAABAgMEEQUSITEiUWGB0ROh4fAjsRRxkf/aAAwDAQACEQMRAD8A9lArgQQgEJQEBAQAAgQAEJIBAAIBCUBAQAAoAAFK+wCEICAgkgQEBAQF0AAMwVkShpECAgEJAHAxWd5Zg6zo4nG0oVFvG92vO2xYx6XNkjmrWdlbJq8GOeW1o3culiaNegq9GrTnRavzxknG3meNqWrblmOr2rkravPWd4fopKUU4tNNXTXUxZxO5AgKwGEEK4GkEvm+OauIoZdha+FnKm6WJUnKPTR2+ZsuGVpfLat47w1fFbXpirak7bSxkvGGFxEI0sythq607S33cv8APrp4mWp4Zek74usff8sNNxTHeNsvSft+HZZ/mPd8hxOKwVWE5cqUJ05KVrtK68rlbS4OfUVpeFrV5+TT2vjn9l5dvq93udQ5Rz8loV8ZmFHCUYwqc0+bs60n2d0r3klvZIr6m1MeOb26f67rGmpbJkilevpPb3eq0ozjCKqT55Jayta78jlZmN+jr6xMR1bMUgkFwhkBAQl0nF8cW8nnLCJTUXetTcFJShbXTw0enuLugnH9aIv7T6qHEoyfQmae8ejzVHTOWSSWyAgPpOAsPKrnUq1vs0KMm34vRfK/wNbxW8Rg5fOW04TSbZ+byj+3odmc66RAFyQXXUAAgG+gQGrxau14oEvNM/ybMcFiKtavTdWi3fvFOCUWv1JLRnTaTVYclYrWdp8nK6vSZsVptaN48/nZ0xdUjGMpyUYRcpSdlFK7b9yEzERvJETPSHp/C2Uf8jLVCql3iq+eq10fSPp9bnL63U/Xy7x2js6vQab/AB8W0957u4uU11lskDAAACvqAoDjY+ljKlL2DFQoVF+ZT54v+j1xWxxP8kbx6Ts8c1csx/HbafWN3xmbZLxNjantT73FO8VCrFRX8Xb6G50+q0WOPB4fafy0Wo0muyT4/F7xt/zo4+G4PzarJKrClh49XOom/hG5634np69t5/fV504XqLT4oiPf4fVZFw7hMpkqt+3xNvxZK3L+1dPqanVa7Jn8Pavl8txpNBj0/i728/h3qZRX0wAkD2AyA2AAECAluBS3QQuoSebQCvcAbAtwCwEBAQAmBqIQXsEsyAwr3JYtrYhkUwJsA9QF+AAgACbAoy8AG4A2gAB9QJMBuAXAQIAAGBMBewGbaAJIiA9AIDIH/9k=
// @grant        none
// @license BSD
// @include      https://forum.gamer.com.tw/C.php?*
// @include      https://forum.gamer.com.tw/Co.php?*

// @downloadURL https://update.greasyfork.org/scripts/464967/%E5%B7%B4%E5%93%88%E5%B5%8C%E5%85%A5%E6%8E%A8%E7%89%B9%E6%8E%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/464967/%E5%B7%B4%E5%93%88%E5%B5%8C%E5%85%A5%E6%8E%A8%E7%89%B9%E6%8E%A8%E6%96%87.meta.js
// ==/UserScript==

// 引入推特JS腳本
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://platform.twitter.com/widgets.js";
document.documentElement.appendChild(script);

// 選擇需要擷取推特網址的區塊
const articleContents = document.querySelectorAll('.c-article__content');

// 推特網址的正則表達式
const twitterRegex = /https?:\/\/twitter\.com\/\w+\/status\/\d+(\?s=\d+)?/g;

// 對每個區塊進行推特網址擷取
articleContents.forEach(function(articleContent) {
    // 取得所有推特網址
    const twitterUrls = articleContent.innerHTML.match(twitterRegex);

    console.log("擷取了:");
    console.log(twitterUrls);

    twitterUrls.forEach(function(elem) {
        // 建立 Twitter 引用元素
        const twitterQuote = document.createElement('blockquote');
        twitterQuote.classList.add('twitter-tweet');

        // 建立 Twitter 引用中的 URL 元素
        const tweetLink = document.createElement('a');
        tweetLink.href = elem;

        // 將 URL 元素加入 Twitter 引用元素
        twitterQuote.appendChild(tweetLink);

        // 將 Twitter 引用元素加入文章內容區塊
        articleContent.appendChild(twitterQuote);
    });
});