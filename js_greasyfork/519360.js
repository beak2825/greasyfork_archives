// ==UserScript==
// @name         班固米书籍排版优化
// @namespace    https://bgm.tv/user/chiefmagician
// @version      1.5
// @description  强迫症的好朋友
// @author       bgmmajia+ai
// @match        https://bgm.tv/subject/*$
// @match        https://chii.in/subject/*$
// @match        https://bangumi.tv/subject/*$
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/519360/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E4%B9%A6%E7%B1%8D%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519360/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E4%B9%A6%E7%B1%8D%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日期处理
    function convertDates(infobox) {
        infobox.querySelectorAll('li').forEach(li => {
            let content = li.innerHTML;
            const newContent = content.replace(
                /(\d{4})-(\d{2})-(\d{2})\s*\((\d{4})年/g,
                (match, year1, month1, day1, year2) => {
                    const diff = parseInt(year2) - parseInt(year1);
                    const yearText = diff === 0 ? '同年' : diff === 1 ? '翌年' : diff === -1 ? '前年' : `${year2}年`;
                    return `${year1}-${month1}-${day1}(${yearText}`;
                }
            );
            if (newContent !== content) li.innerHTML = newContent;
            if (content.includes('连载开始: ') || content.includes('连载结束: ')) {
                li.innerHTML = li.innerHTML.replace(/连载/g, '');
            }
        });
    }

    // 链接图示
    function replaceLinksWithIcons(links) {
        const platformIcons = {
            "Toomics": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_u5Kkr.jpg",
                altText: "Toomics"
            },
            "Lalatoon": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_CBk5P.jpg",
                altText: "Lalatoon"
            },
            "Toptoon": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_iPp55.jpg",
                altText: "Toptoon"
            },
            "Kakao Webtoon": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_hkxgd.jpg",
                altText: "Kakao Webtoon"
            },
            "Lezhin Comics": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/4f/89/30545_prsn_BiNRd.jpg",
                altText: "Lezhin Comics"
            },
            "Bomtoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/96/f3/33413_prsn_oowNo.jpg",
                altText: "Bomtoon"
            },
            "Beltoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/96/f3/33413_prsn_oowNo.jpg",
                altText: "Beltoon"
            },
            "Pocket Comics": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/60/f7/48556_prsn_nNQVE.jpg",
                altText: "Pocket Comics"
            },
            "Tappytoon": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_eNjPu.jpg",
                altText: "Tappytoon"
            },
            "Tapas": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_A71iQ.jpg",
                altText: "Tapas"
            },
            "Manta": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/63/ae/57430_prsn_ig8Ap.jpg",
                altText: "Manta"
            },
            "Day Comics": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_1dI5F.jpg",
                altText: "Day Comics"
            },
            "Comikey": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_XZvXr.jpg",
                altText: "Comikey"
            },
            "Global Comix": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_787c8.jpg",
                altText: "Global Comix"
            },
            "Instagram": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_2Taw6.jpg",
                altText: "Instagram"
            },
            "Book Walker": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_f22l3.jpg",
                altText: "Book Walker"
            },
            "Manga Plaza": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_b2o4O.jpg",
                altText: "Manga Plaza"
            },
            "Spottoon": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_70Wzc.jpg",
                altText: "Spottoon"
            },
            "LINEマンガ": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/77/72/23698_prsn_Qp369.jpg",
                altText: "LINEマンガ"
            },
            "ピッコマ": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/b3/d9/30686_prsn_CN0BQ.jpg",
                altText: "ピッコマ"
            },
            "めちゃコミ": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_22RRt.jpg",
                altText: "めちゃコミ"
            },
            "シーモア": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/56/9e/38810_prsn_7CGvX.jpg",
                altText: "シーモア"
            },
            "dブック": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_MLylA.jpg",
                altText: "dブック"
            },
            "R-TOON": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/67/6a/70208_prsn_2zHsU.jpg",
                altText: "R-TOON"
            },
            "eBookJapan": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_20etn.jpg",
                altText: "eBookJapan"
            },
            "Line Webtoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/99/7d/30543_prsn_e9HxZ.jpg",
                altText: "Line Webtoon"
            },
            "Naver Webtoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/99/7d/30543_prsn_e9HxZ.jpg",
                altText: "Naver Webtoon"
            },
            "Naver Series": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/2b/87/43925_prsn_Bn3Mq.jpg",
                altText: "Naver Series"
            },
            "Kakaopage": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/32/6e/33420_prsn_EKe8C.jpg",
                altText: "Kakaopage"
            },
            "Comico": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/a4/4a/17523_prsn_Pzh8Q.jpg",
                altText: "Comico"
            },
            "Ridibooks": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/e7/0d/36928_prsn_RP2Pp.jpg",
                altText: "Ridibooks"
            },
            "Bookcube": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/74/ca/37050_prsn_23RHr.jpg",
                altText: "Bookcube"
            },
            "Bufftoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/1b/16/46726_prsn_rVlBy.jpg",
                altText: "Bufftoon"
            },
            "Mrblue": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/6f/64/36788_prsn_30UBY.jpg",
                altText: "Mrblue"
            },
            "Anytoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/61/c9/47662_prsn_7UmFt.jpg",
                altText: "Anytoon"
            },
            "Emanbae": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/e6/82/58391_prsn_b4XhX.jpg",
                altText: "Emanbae"
            },
            "Eccll Toon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/5e/12/62753_prsn_7MIi8.jpg",
                altText: "Eccll Toon"
            },
            "Peanutoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/a2/b1/36157_prsn_Q5523.jpg",
                altText: "Peanutoon"
            },
            "Ktoon": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/21/0d/30542_prsn_5mods.jpg",
                altText: "Ktoon"
            },
            "Onestory": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/02/06/53315_prsn_ZGGMV.jpg",
                altText: "Onestory"
            },
            "Metoon": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_DKKYr.jpg",
                altText: "Metoon"
            },
            "Blice": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/fb/09/57497_prsn_h8Bj5.jpg",
                altText: "Blice"
            },
            "Shortz": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/8e/f2/64952_prsn_9yXGY.jpg",
                altText: "Shortz"
            },
            "Watcha": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/8b/25/54138_prsn_d0Joe.jpg",
                altText: "Watcha"
            },
            "Novelpia": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/f8/98/70144_prsn_0zfJj.jpg",
                altText: "Novelpia"
            },
            "Postype": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/49/bf/66026_prsn_riP4z.jpg",
                altText: "Postype"
            },
            "만화경": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/75/4a/45888_prsn_xTa79.jpg",
                altText: "만화경"
            },
            "Comica": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/25/41/31494_prsn_tA3A9.jpg",
                altText: "Comica"
            },
            "快看": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/1f/de/30891_prsn_AgtLa.jpg",
                altText: "快看"
            },
            "咚漫": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/f5/e0/33415_prsn_9KI94.jpg",
                altText: "咚漫"
            },
            "番茄": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/27/19/55642_prsn_vjnvF.jpg",
                altText: "番茄"
            },
            "哔哩哔哩漫画": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_Ok95W.jpg",
                altText: "哔哩哔哩漫画"
            },
            "PODO漫画": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/2c/b0/66660_prsn_SKJ3N.jpg",
                altText: "PODO漫画"
            },
            "腾讯动漫": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/f8/1d/19120_prsn_MmwtK.jpg",
                altText: "腾讯动漫"
            },
            "东立电子书城": {
                iconUrl: "https://lain.bgm.tv/pic/photo/l/4c/74/670258_2QyfG.jpg",
                altText: "东立电子书城"
            },
            "BanaBana": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/11/7a/70664_prsn_YVr5W.jpg",
                altText: "BanaBana"
            },
            "Mojoin": {
                iconUrl: "https://lain.bgm.tv/r/400/pic/crt/l/83/e9/53432_prsn_X319G.jpg",
                altText: "Mojoin"
            },
        };

        links.forEach(link => {

            const textContent = link.textContent.trim();
            if (textContent.includes("关") || textContent.includes("删") || textContent.includes("下架")) {
                link.style.color = "gray";
                link.style.textDecoration = "line-through";
            }
            if (textContent.includes("R18") || textContent.includes("R19")) {
                link.style.color = "red";
            }

            const platformName = Object.keys(platformIcons).find(name => link.textContent.trim().startsWith(name));
            if (platformName) {
                const {
                    iconUrl,
                    altText
                } = platformIcons[platformName];
                const originalText = link.textContent.trim();

                link.innerHTML = '';

                const img = document.createElement('img');
                img.src = iconUrl;
                img.alt = altText;
                img.style.width = '18px';
                img.style.height = '18px';
                img.style.borderRadius = '10%';
                img.style.verticalAlign = 'middle';

                link.appendChild(img);

                const textSpan = document.createElement('span');
                let languageText = '';
                languageText = (originalText.match(/[\(\[]([^)\]]+)[\)\]]/)?.[1] || '')
                    .replace(/(R15|R18|R19|删|关|已下架|下架|\/|\\)/g, '')
                    .trim() || '';
                const enPlatforms = ["Day Comics", "Tapas"];
                const jpPlatforms = ["ピッコマ", "LINEマンガ", "めちゃコミ", "シーモア", "R-TOON", "eBookJapan", "dブック"];
                const scPlatforms = ["哔哩哔哩漫画", "PODO漫画", "腾讯动漫", "快看", "咚漫", "番茄"];
                const tcPlatforms = ["东立电子书城", "Mojoin"];
                const krPlatforms = ["Naver Webtoon", "Naver Series", "Kakaopage", "Ktoon", "Ridibooks", "Bookcube", "Peanutoon", "Bufftoon", "Mrblue", "Emanbae", "Eccll Toon", "Onestory", "만화경", "Blice", "Shortz", "Watcha", "Novelpia", "Anytoon", "Comica", "Metoon"];
                let platformLanguage = '';
                if (jpPlatforms.includes(platformName)) {
                    platformLanguage = '日';
                } else if (scPlatforms.includes(platformName)) {
                    platformLanguage = '简';
                } else if (tcPlatforms.includes(platformName)) {
                    platformLanguage = '繁';
                } else if (krPlatforms.includes(platformName)) {
                    platformLanguage = '韩';
                } else if (enPlatforms.includes(platformName)) {
                    platformLanguage = '英';
                }

                languageText = languageText || platformLanguage;

                textSpan.textContent = languageText ? `(${languageText})` : '';
                textSpan.style.marginLeft = '5px';
                textSpan.style.fontSize = '14px';

                link.appendChild(textSpan);
            }
        });
    }
    let spans = document.querySelectorAll('li.sub_container > ul > li.sub_group > span.tip');
    spans.forEach(span => {
        if (span.textContent.trim() === '链接:') {
            span.innerHTML = '链接: <br>';
        }
    });

    function main() {
        const infobox = document.querySelector('div.infobox_container > ul#infobox');
        if (infobox) {
            convertDates(infobox);
            const links = infobox.querySelectorAll('a.tag.thumbTipSmall');
            replaceLinksWithIcons(links);
        }
    }

    main();
})();