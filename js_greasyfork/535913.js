// ==UserScript==

// @name           bulk whitelist checker (geometry dash)
// @name:ru        масс проверка вайтлиста (geometry dash)

// @description    checks whether gd allows the songs on the page or not!! the extension that used to do this randomly stopped working, so, uh, now you can do that again
// @description:ru проверяет все песни на странице на использование в гд!!

// @namespace      https://twitter.com/cvsilly_?mx=1

// @icon           data:image/octet-stream;base64,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
// @icon64         data:image/octet-stream;base64,UklGRhQHAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSBYBAAABcFTbTl3dGS4QgYz4iAymNRAFaMABDphiohLyvrTNNRARE4D7k9TD+hjdjioJ0cVOv3iaBirmN1uJIcMfHPJc7v7wKA9VD3g8kYeHnOU2OT2q3CQeWG9RD603iAfXS+Lh5UI+43nZG044t6pT2kZ20vKvs4w/4rTya/DMH8WJ5cuY2pdTJ0C4FDCuBpxcjuTkWdi0stWDzYytd7Y52BZfpzO2frBZZavCpokt4yQDjKsByqUAuBKAxtQBoDDJFwbPwk/h0V8YLBN/C0v5h4OjYXcyrLRVGAr2JZ7gqkaruK6xDtypkSrulTiCu8uMsQoetAgt4dEynpoFj8t8YilCSrurC8ImbdeaJgTPWq2vtVa3qhn3A1ZQOCDYBQAAMBoAnQEqQABAAD6JMpFHpSKhoTP8yVigEQlsALEfBMG3xnmqWZ/AeLPpUjowott35gPOI9NH+u3y30AOk88mbNGOwL/M+Gvkh9LyhiTN9+aAZN/1/GXpLJmH7K+cf83/z/sC/yz+v/9DsJftz7HH7cM8RQPKe459C9xeoayUeO9eoRsAvGGkRWuIAU9rk/ulUCYUC367fIqizFDJMrSE2Y6ucBPV5RuVnJYu/w6COMce2cHU5v4rcUm49rrt5ssFP352imO/SiOd9CyEj2Z4oI/rZ8Ud23eQHAAA/q1Lw7S2mqSVQLZN9DGsgLxRnCB/Aln03/LzaHwHtTIeD/uBZUsxh5qQSGuIV7upXM2B35uNc1c/7/5nHxGLm3sQ+yqbxfsWfyQG7jULP6hyf/84g/2f9UUoAWjt56esz+3vBQKu8Ad4SdEO++W4nJxkO3uUnj8U92igucJpgQVqIevtOC5GOkZqs/Laa9vs6cAIjELTGdlZcf75/PZ4apbOmuvsdqZGrsj/I3vNblLDLqjw64Lda6Y8/siOEUNCePgcK/yR+yH+P3c5FMrxVT5FT0Gjmr8FUx63BOXIGZHmJEs+YaSWEeL6P0o1tWtKabXv2kmvvXGviSLbeZW2DQFEu3APG/AHvJdeIpXoqjp7xtEQ7yr6vZfLIt2mLGNzVOXFSVpURCmK93lTatzbO4B1sf56W99AQ1ZwqhPb27KhhPhWv6hdQb+4MB1Ztonr0CmDpWOpn/N109vwcWG+yhoXu/w8FufaGKELNyf+V9u+18auF7QrjIHV/1oxe25hs2soXAbG8/cYCpIofk9dNAcMyvBSM+UpTMDde1oml0PPzK9380AcUOIRB7TCMFso4jzZ7s7/uoNW9Ns7iEYIgwK/02S+lTlEFXyw6vaBtOXfjHf2G91R5BGXl4O+lQCCp7dMQRsh4h1F0RkKtFgXz3SwJaIns30LOFREbp2+8fIVevCUum2bcDeDcyYXKWSO7Zs/RZ/su5rhf/YNxtNqcls3uCGGejJEScv9Olqiiah3LLVhLy+qbW+WLP6a4AsFlRwMdUHnlMVDchBsv2HVgECY6oiLbYSAXmqIgvg6V3ovKFrg4DR1IHhJxNv5RSCoHtrqDXVZ1HqbiXNnFZz2Xgew5+9ijeZbtdUoSaAHOfmFbrf/dMndMg8cdbEElKzM5lUiL4Rp9JRsMXVm4LTY5MIRXktX2cy8OF4ytQA9ZYG39TCl49hqTfC2Sg63zfQqcaLu04n2qF86i44yHpBg17bvv9nNUXZhL7WDMLOEIaebJMSdxVCady9GFC509etDEfw0nH42o3NlqsA6HJmUNFagBlpr+RGUaIg9LTliHVIoqOWa9JNL5AUj5e1cEgxCrnxeDI+dcahjieoKkAxpbPAAf65DqLRRsFP6/z0mUNXjst8qiiiK+x7Ctv6fQPYZSREzGD8gMiJ/NjtmG/o6/sjxm1pW+OO5vof14g6hFnp1oGsxzK2HdD5kZuMJw7nrW5barkq+FisoOy6mbnOyjllvfwjGhOpOZt/aAgdD3oCOwzmy333GBSD24xV9kFV3SBi8jvSnnbzkFpRBoFoFn9RtN3WKHy3a0M1AFs3omRmXQL3Hx8PswvdxwrXba3HHZ3uaJ/f0X+6HKivIgT0AIZRQPzHaGyMgwXh8GQYwXF4aF3psg+3bL17kBul81dkTugxjyPeO1NdXksfbM/LTfCeFG2TWHX5eBn0VpI8rNM5v/ZIPUgpGHTIIuiqyhVlRx0w5mYWmpUYY3kcwKQNSIIoKrAMLOXWMHr6LBGPMLp6uGqsKlYhAP1suNDv0QaYfoDdflgq3uLBl+Yo/Hv0deGqMVMgV3Sng3R935C2CttYzizNmOWlwufroL1XGbbCBA4JXOTyGgJcc0OANnXYMMQw9N0h8f3xSZTof17UI/RpNjRs6C6n9L+TnNp8HagUnf/aPliERQutcDtSkZQvdD/K94+7yvFPdFHO6QAA=

// @version        v0.1
// @match          *://*.newgrounds.com/*
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @antifeature    KILLSYOU

// @downloadURL https://update.greasyfork.org/scripts/535913/bulk%20whitelist%20checker%20%28geometry%20dash%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535913/bulk%20whitelist%20checker%20%28geometry%20dash%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        a[href*='/audio/listen/'] h4 {color: gray}
        a[href*='/audio/listen/'] h4 mark {color: inherit; background-color: transparent}
    `);

    ///////////////////////////////////

    // check all of the unloaded songs too
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                queuesongs();
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    ///////////////////////////////////

    function queuesongs() {
        const links = [...document.querySelectorAll("a[href*='/audio/listen/']:not([data-song-checked])")];

        links.forEach((link, index) => {
            const match = link.href.match(/\/listen\/(\d+)/);
            if (match) {
                link.setAttribute('data-song-checked', 'processing');
                const delay = 400 + Math.random() * 800;
                setTimeout(() => {checksong(link, match[1])}, index * delay);
            }
        });
    }

    async function checksong(elem, songID) {
        let title = elem.querySelector("h4");
        if (!title) return;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.boomlings.com/database/getGJSongInfo.php",
            data: `secret=Wmfd2893gb7&songID=${songID}`,
            headers: {"Content-Type": "application/x-www-form-urlencoded", "User-Agent": ""},

            onload: function(res) {
                console.log(`${songID} ~ `, res.responseText);
                const isValid = res.responseText.trim() !== "-1" && res.responseText.trim() !== "-2";
                const color = isValid ? "lime" : "red";

                elem.setAttribute('data-song-checked', 'complete');

                title.style.cssText = `color: ${color} !important`;
                title.querySelectorAll('mark').forEach(mark => {mark.style.cssText = `color: ${color} !important; background-color: transparent !important`});
            },
            onerror: function(err) {
                elem.setAttribute('data-song-checked', 'error');
                title.style.cssText = 'color: gray !important';
                title.querySelectorAll('mark').forEach(mark => {mark.style.cssText = 'color: gray !important; background-color: transparent !important'});
            }
        });
    }; queuesongs();

})();