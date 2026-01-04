// ==UserScript==
// @name         pom.moe Updated
// @namespace    http://tampermonkey.net/
// @version      2025-11-04
// @description  Fixes various issues with the site, such as no character images, outdated banners, and 50/50 indicators not working properly
// @author       Idy
// @match        https://pom.moe/warp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504585/pommoe%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/504585/pommoe%20Updated.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHARACTER_BANNER_NAME = "Ripples Rejoined";
    const CHARACTER_BANNER_IMAGE = "https://i.postimg.cc/43nVgY7m/Star-Rail-UPo-D86j-YRV.png";
    const LIGHTCONE_BANNER_NAME = "Brilliant Fixation";
    const LIGHTCONE_BANNER_IMAGE = "https://i.postimg.cc/FK134Ydt/Star-Rail-VTa-Cfsa-Ofx.png";

    const standardBanner = [
        "Bailu", "Bronya", "Clara", "Gepard", "Himeko", "Welt", "Yanqing",
        "But the Battle Isn't Over", "In the Name of the World", "Moment of Victory",
        "Night on the Milky Way", "Sleep Like the Dead", "Something Irreplaceable",
        "Time Waits for No One"
    ];

    const images = [
        { src: '/images/characters-mini/aventurine.png', newSrc: 'https://i.postimg.cc/PqWHXrB2/aventurine.png' },
        { src: '/images/characters-mini/jade.png', newSrc: 'https://i.postimg.cc/2jGzLw0m/jade.png' },
        { src: '/images/characters-mini/yunli.png', newSrc: 'https://i.postimg.cc/RFs4yC6h/yunli.png' },
        { src: '/images/characters-mini/jiaoqiu.png', newSrc: 'https://i.postimg.cc/SKZcT8rM/jiaoqiu.png' },
        { src: '/images/characters-mini/feixiao.png', newSrc: 'https://i.postimg.cc/nchQJBhr/feixiao.png' },
        { src: '/images/characters-mini/lingsha.png', newSrc: 'https://i.postimg.cc/3wqWFf61/lingsha.png' },
        { src: '/images/characters-mini/rappa.png', newSrc: 'https://i.postimg.cc/P58bDKs9/rappa.png' },
        { src: '/images/characters-mini/sunday.png', newSrc: 'https://i.postimg.cc/0NLCdtQp/sunday.webp' },
        { src: '/images/characters-mini/fugue.png', newSrc: 'https://i.postimg.cc/G3MrqcQy/fugue.webp' },
        { src: '/images/characters-mini/the-herta.png', newSrc: 'https://i.postimg.cc/XXL2drPw/theherta.webp' },
        { src: '/images/characters-mini/aglaea.png', newSrc: 'https://i.postimg.cc/9FywLyB3/aglaea.webp' },
        { src: '/images/characters-mini/tribbie.png', newSrc: 'https://i.postimg.cc/1zVfxcwk/tribbie.webp' },
        { src: '/images/characters-mini/mydei.png', newSrc: 'https://cdn.starrailstation.com/assets/d65549800df726accd4553ad7380abec44f29ce4c7d40fb9f4fc49b7269a8c00.webp' },
        { src: '/images/characters-mini/castorice.png', newSrc: 'https://cdn.starrailstation.com/assets/c5672716925ad2ab406feeb1d8be27f7fb240060d9f1eb6ad328d76c0a903bc0.webp' },
        { src: '/images/characters-mini/anaxa.png', newSrc: 'https://cdn.starrailstation.com/assets/994c6cd6d95f7112bc7b49f649017f61afa2cddc1bc5f7f7bdcf9399e24d18e9.webp' },
        { src: '/images/characters-mini/hyacine.png', newSrc: 'https://cdn.starrailstation.com/assets/44dd4e9fefd25de2dd7d985f98eafa1cd5b1a6b15c7f973f854640d2938d34b4.webp' },
        { src: '/images/characters-mini/cipher.png', newSrc: 'https://cdn.starrailstation.com/assets/4474b2dd1e4d821a865142b361ce7544d50b2cae2fb9aeba17c6058e32f5d99a.webp' },
        { src: '/images/characters-mini/phainon.png', newSrc: 'https://cdn.starrailstation.com/assets/09c5efa5b81ea10086b46fb9deb50c932edccd7d23442a8f80128861ec0879ce.webp' },
        { src: '/images/characters-mini/hysilens.png', newSrc: 'https://cdn.starrailstation.com/assets/4e8065b7522f8cda1716509f92379689ea387e50917a88acd9e20ec4e545b5e4.webp' },
        { src: '/images/characters-mini/cerydra.png', newSrc: 'https://cdn.starrailstation.com/assets/ff7541d50a2561c365590897ea3f30f1d32786b255292e0a92b833b37917bd76.webp' },
        { src: '/images/characters-mini/evernight.png', newSrc: 'https://cdn.starrailstation.com/assets/5c0100b27287637fc47492e675d2ed601ab5a2ce4e4c2331674f4bbdc4c01a47.webp' },
        { src: '/images/characters-mini/dan-heng-permasor-terrae.png', newSrc: 'https://cdn.starrailstation.com/assets/81b3318d84bb62b0db867d6b1e500a5c22f4ff63fa5854cab139f9f2384d0338.webp' },
        { src: '/images/characters-mini/cyrene.png', newSrc: 'https://cdn.starrailstation.com/assets/0c3faaeca564b95add2054e74ad765a8162dcabe3cc49cf9710613950c50ae2d.webp' },
        { src: '/images/lightcones/dance-at-sunset.png', newSrc: 'https://i.postimg.cc/1XdkP3C7/Dance-at-Sunset.webp' },
        { src: '/images/lightcones/those-many-springs.png', newSrc: 'https://i.postimg.cc/44FkpWfv/Those-Many-Springs.webp' },
        { src: '/images/lightcones/i-venture-forth-to-hunt.png', newSrc: 'https://i.postimg.cc/BnHr9sxN/I-Venture-Forth-To-Hunt.webp' },
        { src: '/images/lightcones/scent-alone-stays-true.png', newSrc: 'https://i.postimg.cc/MTKNQQgr/Scent-Alone-Stays-True.webp' },
        { src: '/images/lightcones/ninjutsu-inscription-dazzling-evilbreaker.png', newSrc: 'https://i.postimg.cc/5yDRTkyZ/Ninjutsu-Inscription-Dazzling-Evilbreaker.webp' },
        { src: '/images/lightcones/a-grounded-ascent.png', newSrc: 'https://i.postimg.cc/DybDLFYF/A-Grounded-Ascent.webp' },
        { src: '/images/lightcones/long-road-leads-home.png', newSrc: 'https://i.postimg.cc/ncBxZvxv/Long-Roads-Lead-Home.webp' },
        { src: '/images/lightcones/into-the-unreachable-veil.png', newSrc: 'https://i.postimg.cc/ykNLPVq2/Into-The-Unreachable-Veil.webp' },
        { src: '/images/lightcones/time-woven-into-gold.png', newSrc: 'https://i.postimg.cc/XJZpd5vz/Time-Woven-Into-Gold.webp' },
        { src: '/images/lightcones/if-time-were-a-flower.png', newSrc: 'https://i.postimg.cc/FHB7nndb/If-Time-Were-a-Flower.webp' },
        { src: '/images/lightcones/flame-of-blood-blaze-my-path.png', newSrc: 'https://cdn.starrailstation.com/assets/5bffdcf33abc58f6c3259ae14eb621b2e0980c451fad8dd86267865b2ef1a553.webp' },
        { src: '/images/lightcones/make-farewells-more-beautiful.png', newSrc: 'https://cdn.starrailstation.com/assets/220ea6d5e8342336b6e419410f8697d37cc6fef51f66e313669efc8e68dd46e0.webp' },
        { src: '/images/lightcones/life-should-be-cast-to-flames.png', newSrc: 'https://cdn.starrailstation.com/assets/79148009a8bc6360ec184f9e2c2bc1106dd9073694d00e3dbfbb4bc5a1f7490e.webp' },
        { src: '/images/lightcones/long-may-rainbows-adorn-the-sky.png', newSrc: 'https://cdn.starrailstation.com/assets/d9995352f5b67a6d317bcfe9c0ae3c730e8a415eb60f990649eecba47b3abb5d.webp' },
        { src: '/images/lightcones/lies-dance-on-the-breeze.png', newSrc: 'https://cdn.starrailstation.com/assets/6858d59142d1febd90a9a68f0f1922366ff327418b3ebfbdf807cf09aa289626.webp' },
        { src: '/images/lightcones/thus-burns-the-dawn.png', newSrc: 'https://cdn.starrailstation.com/assets/1b3f8ff34cb38317186463bc59e405a90115b99d6bef2a1b597bb127b35f5f70.webp' },
        { src: '/images/lightcones/why-does-the-ocean-sing.png', newSrc: 'https://cdn.starrailstation.com/assets/950dd8d128b9766b8f338b2873a49a90e4ec4a08907ac51961f1a53f2a249d05.webp' },
        { src: '/images/lightcones/epoch-etched-in-golden-blood.png', newSrc: 'https://cdn.starrailstation.com/assets/bc06f5734d76f4ff1f371f35e18c4c04a4ebcab955f3cca199972147c5c8579c.webp' },
        { src: '/images/lightcones/to-evernights-stars.png', newSrc: 'https://cdn.starrailstation.com/assets/f8cf76621fd24d122621898517f12f7a799359124f7334165a5356cf88b745bf.webp' },
        { src: '/images/lightcones/though-worlds-apart.png', newSrc: 'https://cdn.starrailstation.com/assets/cccf6239b853547e3da5083d51d65359c4273827cc2ccc749323c96023cb72b8.webp' },
        { src: '/images/lightcones/this-love-forever.png', newSrc: 'https://cdn.starrailstation.com/assets/ca047ebfdc9d10240c3b7553d2cced8e430ca3d0c37e8aaf8dfc13628a0ea8c6.webp' },
    ];

    let isGuaranteed = false;

    function fixCharacterNames(node, selector, regex, replacer) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            node.querySelectorAll(selector).forEach(el => {
                el.textContent = el.textContent.replace(regex, replacer);
            });
        }
    }

    function updateCharacterImages(images) {
        images.forEach(({ src, newSrc }) => {
            const img = document.querySelector(`img[src="${src}"]`);
            if (img) {
                img.src = newSrc;
                img.width = 64;
                img.height = 64;
            }
        });
    }

    function updateBanner(characterBannerName, LCBannerName, characterBannerImage, lightconeBannerImage) {
        const bannerText = document.querySelector('p.text-sm.leading-none.text-white\\/80');
        if (bannerText) {
            bannerText.textContent = `Current: ${characterBannerName}`;
        }

        const LCbannerText = document.querySelectorAll('p.text-sm.leading-none.text-white\\/80')[1];
        if (LCbannerText) {
            LCbannerText.textContent = `Current: ${LCBannerName}`;
        }

        const characterBannerImageElement = document.querySelector('img.image.border-right.absolute.z-0.h-full.w-auto.select-none.object-cover.svelte-1j5mbf4');
        if (characterBannerImageElement) {
            characterBannerImageElement.src = characterBannerImage;
            characterBannerImageElement.style.objectPosition = '80% center top';
        }

        const lightconeBannerImageElement = document.querySelector('img.image.border-right.absolute.z-0.h-full.w-auto.select-none.object-cover.svelte-1j5mbf4[style*="object-position: 70% 8%;"]');
        if (lightconeBannerImageElement) {
            lightconeBannerImageElement.src = lightconeBannerImage;
        }
    }

    function updateCharacterBackgrounds() {
        const bannerElement = document.querySelector('.flex.flex-wrap');
        if (!bannerElement) return;

        const characterElements = bannerElement.querySelectorAll('div.inline-flex');
        let guaranteedState = false;

        characterElements.forEach((element, index) => {
            const characterName = element.querySelector('span.text-base')?.textContent.trim();

            if (!characterName) return;

            if (standardBanner.includes(characterName)) {
                element.style.backgroundColor = 'rgb(31 41 55 / var(--tw-bg-opacity))';
                guaranteedState = true;
            } else {
                if (guaranteedState) {
                    element.style.backgroundColor = 'rgb(31 41 55 / var(--tw-bg-opacity))';
                } else {
                    element.style.backgroundColor = '#fbcd7433';
                }
                guaranteedState = false;
            }

            if (index === 0 && !standardBanner.includes(characterName)) {
                element.style.backgroundColor = '#fbcd7433';
            }
        });
    }


    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        fixCharacterNames(node, '.inline-flex span', /(character|lightcone)\.([a-zA-Z-]+)/g, (_, type, match) => {
                            return match.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        });

                        updateCharacterImages(images);
                        updateBanner(CHARACTER_BANNER_NAME, LIGHTCONE_BANNER_NAME, CHARACTER_BANNER_IMAGE, LIGHTCONE_BANNER_IMAGE);
                        updateCharacterBackgrounds();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();