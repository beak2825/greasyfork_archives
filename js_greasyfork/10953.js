// ==UserScript==
// @name        SSC Polskie Znaki Drogowe
// @namespace   http://skyscrapercity.com/
// @description Wyświetla znak drogowy, o którym mowa w treści wiadomości na forum.
// @include     /^https?://www\.skyscrapercity\.com/show(post|thread)\.php.*$/
// @version     1.4.1 (LA02)
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/10953/SSC%20Polskie%20Znaki%20Drogowe.user.js
// @updateURL https://update.greasyfork.org/scripts/10953/SSC%20Polskie%20Znaki%20Drogowe.meta.js
// ==/UserScript==

const reSignCode = /[^A-Za-z0-9_-]([ABCDEFGPRSTUW]T?\-\d+(\/\d+)*[a-z]?)( ["„”](.*?)["„”])?/gi;

////// DATABASE BEGIN ///////
const signIndex = {
    /* Warning signs */
    "A-1": {
        "name":  "niebezpieczny zakręt w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Znak_A-1.svg"
    },
    "A-2": {
        "name":  "niebezpieczny zakręt w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Znak_A-2.svg"
    },
    "A-3": {
        "name":  "niebezpieczne zakręty - pierwszy w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Znak_A-3.svg"
    },
    "A-4": {
        "name":  "niebezpieczne zakręty - pierwszy w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Znak_A-4.svg"
    },
    "A-5": {
        "name": "skrzyżowanie dróg",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/43/Znak_A-5.svg"
    },
    "A-6": {
        "name": "skrzyżowanie z drogą podporządkowaną",
        "image": "@A-6a"
    },
    "A-6x": {
        "name": "skrzyżowanie z drogą podporządkowaną",
        "image": "@A-6a"
    },
    "A-6a": {
        "name": "skrzyżowanie z drogą podporządkowaną występującą po obu stronach",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Znak_A-6a.svg"
    },
    "A-6b": {
        "name": "skrzyżowanie z drogą podporządkowaną występującą po prawej stronie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Znak_A-6b.svg"
    },
    "A-6c": {
        "name": "skrzyżowanie z drogą podporządkowaną występującą po lewej stronie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Znak_A-6c.svg"
    },
    "A-6d": {
        "name": "wlot drogi jednokierunkowej z prawej strony",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Znak_A-6d.svg"
    },
    "A-6e": {
        "name": "wlot drogi jednokierunkowej z lewej strony",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Znak_A-6e.svg"
    },
    "A-7": {
        "name":  "ustąp pierwszeństwa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Znak_A-7.svg"
    },
    "A-8": {
        "name":  "skrzyżowanie o ruchu okrężnym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Znak_A-8.svg"
    },
    "A-9": {
        "name":  "przejazd kolejowy z zaporami",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/56/Znak_A-9.svg"
    },
    "A-10": {
        "name":  "przejazd kolejowy bez zapór",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/14/Znak_A-10.svg"
    },
    "A-11": {
        "name":  "nierówna droga",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Znak_A-11.svg"
    },
    "A-11a": {
        "name":  "próg zwalniający",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/23/Znak_A-11a.svg"
    },
    "A-12": {
        "name":  "zwężenie jezdni",
        "image": "@A-12a"
    },
    "A-12a": {
        "name":  "zwężenie jezdni - dwustronne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/61/Znak_A-12a.svg"
    },
    "A-12b": {
        "name":  "zwężenie jezdni - prawostronne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Znak_A-12b.svg"
    },
    "A-12c": {
        "name":  "zwężenie jezdni - lewostronne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/73/Znak_A-12c.svg"
    },
    "A-13": {
        "name":  "ruchomy most",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Znak_A-13.svg"
    },
    "A-14": {
        "name":  "roboty na drodze",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/28/Znak_A-14.svg"
    },
    "A-15": {
        "name":  "śliska jezdnia",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/39/Znak_A-15.svg"
    },
    "A-16": {
        "name":  "przejście dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/52/Znak_A-16.svg"
    },
    "A-17": {
        "name":  "dzieci",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Znak_A-17.svg"
    },
    "A-18": {
        "name":  "zwierzęta",
        "image": "@A-18a"
    },
    "A-18a": {
        "name":  "zwierzęta gospodarskie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Znak_A-18a.svg"
    },
    "A-18b": {
        "name":  "zwierzęta dzikie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Znak_A-18b.svg"
    },
    "A-19": {
        "name":  "boczny wiatr",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Znak_A-19.svg"
    },
    "A-20": {
        "name":  "odcinek jezdni o ruchu dwukierunkowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Znak_A-20.svg"
    },
    "A-21": {
        "name":  "tramwaj",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Znak_A-21.svg"
    },
    "A-22": {
        "name":  "niebezpieczny zjazd",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/94/Znak_A-22.svg"
    },
    "A-23": {
        "name":  "stromy podjazd",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/60/Znak_A-23.svg"
    },
    "A-24": {
        "name":  "rowerzyści",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Znak_A-24.svg"
    },
    "A-25": {
        "name":  "spadające odłamki skalne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/42/Znak_A-25.svg"
    },
    "A-26": {
        "name":  "lotnisko",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Znak_A-26.svg"
    },
    "A-27": {
        "name":  "nabrzeże lub brzeg rzeki",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/66/Znak_A-27.svg"
    },
    "A-28": {
        "name":  "sypki żwir",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Znak_A-28.svg"
    },
    "A-29": {
        "name":  "sygnały świetlne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Znak_A-29.svg"
    },
    "A-30": {
        "name":  "inne niebezpieczeństwo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/66/Znak_A-30.svg"
    },
    "A-31": {
        "name":  "niebezpieczne pobocze",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/28/Znak_A-31.svg"
    },
    "A-31a": {
        "name":  "niebezpieczne pobocze po lewej stronie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/40/Znak_A-31_lewa.svg"
    },
    "A-32": {
        "name":  "oszronienie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/77/Znak_A-32.svg"
    },
    "A-33": {
        "name":  "zator drogowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/87/Znak_A-33.svg"
    },
    "A-34": {
        "name":  "wypadek drogowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/45/Znak_A-34.svg"
    },

    /* Prohibition signs */
    "B-1": {
        "name": "zakaz ruchu w obu kierunkach",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Znak_B-1.svg"
    },
    "B-1a": {
        "name": "zakaz ruchu w obu kierunkach w określonych godzinach",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Znak_B-1a.png"
    },
    "B-2": {
        "name": "zakaz wjazdu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/16/Znak_B-2.svg"
    },
    "B-3": {
        "name": "zakaz wjazdu pojazdów silnikowych, z wyjątkiem motocykli jednośladowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/Znak_B-3.svg"
    },
    "B-3a": {
        "name": "zakaz wjazdu autobusów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Znak_B-3a.svg"
    },
    "B-4": {
        "name": "zakaz wjazdu motocykli",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Znak_B-4.svg"
    },
    "B-5": {
        "name": "zakaz wjazdu samochodów ciężarowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/76/Znak_B-5.svg"
    },
    "B-5a": {
        "name": "zakaz wjazdu pojazdów i zespołów pojazdów o określonej na znaku masie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/90/Znak_B-5_6ton.svg"
    },
    "B-6": {
        "name": "zakaz wjazdu ciągników rolniczych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/22/Znak_B-6.svg"
    },
    "B-7": {
        "name": "zakaz wjazdu pojazdów silnikowych z przyczepą",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Znak_B-7.svg"
    },
    "B-7a": {
        "name": "zakaz wjazdu pojazdów silnikowych z przyczepą o określonej masie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/39/Znak_B-7_5ton.svg"
    },
    "B-8": {
        "name": "zakaz wjazdu pojazdów zaprzęgowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Znak_B-8.svg"
    },
    "B-9": {
        "name": "zakaz wjazdu rowerów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Znak_B-9.svg"
    },
    "B-10": {
        "name": "zakaz wjazdu motorowerów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Znak_B-10.svg"
    },
    "B-11": {
        "name": "zakaz wjazdu wózków rowerowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Znak_B-11.svg"
    },
    "B-12": {
        "name": "zakaz wjazdu wózków ręcznych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/36/Znak_B-12.svg"
    },
    "B-13": {
        "name": "zakaz wjazdu pojazdów z towarami wybuchowymi lub łatwo zapalnymi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Znak_B-13.svg"
    },
    "B-13a": {
        "name": "zakaz wjazdu pojazdów z towarami niebezpiecznymi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Znak_B-13a.svg"
    },
    "B-14": {
        "name": "zakaz wjazdu pojazdów z towarami, które mogą skazić wodę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/80/Znak_B-14.svg"
    },
    "B-15": {
        "name": "zakaz wjazdu pojazdów o szerokości ponad ...m",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/20/Znak_B-15.svg"
    },
    "B-16": {
        "name": "zakaz wjazdu pojazdów o wysokości ponad ...m",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/65/Znak_B-16.svg"
    },
    "B-17": {
        "name": "zakaz wjazdu pojazdów o długości ponad ...m",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/be/Znak_B-17.svg"
    },
    "B-18": {
        "name": "zakaz wjazdu pojazdów o rzeczywistej masie całkowitej ponad ...t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/92/Znak_B-18.svg"
    },
    "B-19": {
        "name": "zakaz wjazdu pojazdów o nacisku osi większym niż ...t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Znak_B-19.svg"
    },
    "B-20": {
        "name": "stop",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Poland_road_sign_B-20.svg"
    },
    "B-21": {
        "name": "zakaz skręcania w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Znak_B-21.svg"
    },
    "B-22": {
        "name": "zakaz skręcania w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Znak_B-22.svg"
    },
    "B-23": {
        "name": "zakaz zawracania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Znak_B-23.svg"
    },
    "B-24": {
        "name": "koniec zakazu zawracania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/Znak_B-24.svg"
    },
    "B-25": {
        "name": "zakaz wyprzedzania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Znak_B-25.svg"
    },
    "B-26": {
        "name": "zakaz wyprzedzania przez samochody ciężarowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/14/Znak_B-26.svg"
    },
    "B-27": {
        "name": "koniec zakazu wyprzedzania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Znak_B-27.svg"
    },
    "B-28": {
        "name": "koniec zakazu wyprzedzania przez samochody ciężarowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Znak_B-28.svg"
    },
    "B-29": {
        "name": "zakaz używania sygnałów dźwiękowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Znak_B-29.svg"
    },
    "B-30": {
        "name": "koniec zakazu używania sygnałów dźwiękowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Znak_B-30.svg"
    },
    "B-31": {
        "name": "pierwszeństwo dla nadjeżdżających z przeciwka",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/94/Znak_B-31.svg"
    },
    "B-32": {
        "name": "stój – kontrola celna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Znak_B-32.svg"
    },
    "B-32a": {
        "name": "stój – kontrola graniczna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Znak_B-32a.svg"
    },
    "B-32b": {
        "name": "stój – rogatka uszkodzona",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Znak_B-32b.svg"
    },
    "B-32c": {
        "name": "stój – sygnalizacja uszkodzona",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Znak_B-32c.svg"
    },
    "B-32d": {
        "name": "stój – wjazd na prom",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Znak_B-32d.svg"
    },
    "B-32e": {
        "name": "stój – kontrola drogowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Znak_B-32e.svg"
    },
    "B-32f": {
        "name": "stój – pobór opłat",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/38/Znak_B-32f.svg"
    },
    "B-33": {
        "name": "ograniczenie prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Znak_B-33.svg"
    },
    "B-34": {
        "name": "koniec ograniczenia prędkości",
     "B-34": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Znak_B-34.svg"
    },
    "B-35": {
        "name": "zakaz postoju",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Znak_B-35.svg"
    },
    "B-36": {
        "name": "zakaz zatrzymywania się",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Znak_B-36.svg"
     
    },
    "B-37": {
        "name": "zakaz postoju w dni nieparzyste",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Znak_B-37.svg"
    },
    "B-38": {
        "name": "zakaz postoju w dni parzyste",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/27/Znak_B-38.svg"
    },
    "B-39": {
        "name": "strefa ograniczonego postoju",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Znak_B-39.svg",
    },
    "B-40": {
        "name": "koniec strefy ograniczonego postoju",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Znak_B-40.svg"
    },
    "B-41": {
        "name": "zakaz ruchu pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Znak_B-41.svg"
    },
    "B-42": {
        "name": "koniec zakazów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/30/Znak_B-42.svg"
    },
    "B-43": {
        "name": "strefa ograniczonej prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/84/Znak_B-43.svg"
    },
    "B-44": {
        "name": "koniec strefy ograniczonej prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/13/Znak_B-44.svg"
    },
    "B-3/4": {
        "name": "zakaz wjazdu pojazdów silnikowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Znak_B-3-4.svg"
    },
    "B-6/8": {
        "name": "zakaz wjazdu ciągników rolniczych i pojazdów zaprzęgowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Znak_B-6-8.svg"
    },
    "B-6/8/9": {
        "name": "zakaz wjazdu pojazdów innych niż samochodowe (z wyłączeniem motorowerów)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Znak_B-6-8-9.svg"
    },
    "B-9/12": {
        "name": "zakaz wjazdu rowerów i wózków ręcznych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/19/Znak_B-9-12.svg"
    },
    "B-13/14": {
        "name": "zakaz wjazdu pojazdów z towarami wybuchowymi lub łatwo zapalnymi oraz towarami mogącymi skazić wodę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/88/Znak_B-13-14.svg"
    },
    "B-3/4/10": {
        "name": "zakaz wjazdu pojazdów silnikowych, motocykli i motorowerów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Znak_B-3-4-10.svg"
    },
    "C-1": {
        "name": "nakaz jazdy w prawo przed znakiem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/92/Znak_C-1.svg"
    },
    "C-2": {
        "name": "nakaz jazdy w prawo za znakiem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Znak_C-2.svg"
    },
    "C-3": {
        "name": "nakaz jazdy w lewo przed znakiem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Znak_C-3.svg"
    },
    "C-4": {
        "name": "nakaz jazdy w lewo za znakiem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Znak_C-4.svg"
    },
    "C-5": {
        "name": "nakaz jazdy prosto",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Znak_C-5.svg"
    },
    "C-6": {
        "name": "nakaz jazdy prosto lub w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/01/Znak_C-6.svg"
    },
    "C-7": {
        "name": "nakaz jazdy prosto lub w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/be/Znak_C-7.svg"
    },
    "C-8": {
        "name": "nakaz jazdy w prawo lub w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Znak_C-8.svg"
    },
    "C-9": {
        "name": "nakaz jazdy z prawej strony znaku",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Znak_C-9.svg"
    },
    "C-10": {
        "name": "nakaz jazdy z lewej strony znaku",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Znak_C-10.svg"
    },
    "C-11": {
        "name": "nakaz jazdy z prawej lub z lewej strony znaku",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/38/Znak_C-11.svg"
    },
    "C-12": {
        "name": "ruch okrężny",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Znak_C-12.svg"
    },
    "C-13": {
        "name": "droga dla rowerów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/96/Znak_C-13.svg"
    },
    "C-13a": {
        "name": "koniec drogi dla rowerów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Znak_C-13a.svg"
    },
    "C-14": {
        "name": "prędkość minimalna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Znak_C-14.svg"
    },
    "C-15": {
        "name": "koniec prędkości minimalnej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Znak_C-15.svg"
    },
    "C-16": {
        "name": "droga dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/38/Znak_C-16.svg"
    },
    "C-16a": {
        "name": "koniec drogi dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/64/Znak_C-16a.svg"
    },
    "C-17": {
        "name": "nakazany kierunek jazdy dla pojazdów z towarami niebezpiecznymi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Znak_C-17.svg"
    },
    "C-18": {
        "name": "nakaz używania łańcuchów przeciwpoślizgowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Znak_C-18.svg"
    },
    "C-19": {
        "name": "koniec nakazu używania łańcuchów przeciwpoślizgowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/19/Znak_C-19.svg"
    },
    "C-13/16": {
        "name": "droga dla rowerów i pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Znak_C-13-16_r-p.svg"
    },

    "D-1": {
        "name": "droga z pierwszeństwem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Znak_D-1.svg"
    },
    "D-2": {
        "name": "koniec drogi z pierwszeństwem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/15/Znak_D-2.svg"
    },
    "D-3": {
        "name": "droga jednokierunkowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Znak_D-3.svg"
    },
    "D-4a": {
        "name": "droga bez przejazdu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/Znak_D-4a.svg"
    },
    "D-4b": {
        "name": "wjazd na drogę bez przejazdu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/17/Znak_D-4b.svg"
    },
    "D-4c": {
        "name": "wjazd na drogę bez przejazdu z lewej strony",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Znak_D-4c.svg"
    },
    "D-5": {
        "name": "pierwszeństwo na zwężonym odcinku jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Znak_D-5.svg"
    },
    "D-6": {
        "name": "przejście dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/40/Znak_D-6.svg"
    },
    "D-6a": {
        "name": "przejazd dla rowerzystów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Znak_D-6a.svg"
    },
    "D-6b": {
        "name": "przejście dla pieszych i przejazd dla rowerzystów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Znak_D-6b.svg"
    },
    "D-7": {
        "name": "droga ekspresowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Znak_D7.svg"
    },
    "D-8": {
        "name": "koniec drogi ekspresowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Znak_D-8.svg"
    },
    "D-9": {
        "name": "autostrada",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Znak_D9.svg"
    },
    "D-10": {
        "name": "koniec autostrady",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/29/Znak_D-10.svg"
    },
    "D-11": {
        "name": "początek pasa ruchu dla autobusów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Znak_D-11.svg"
    },
    "D-12": {
        "name": "pas ruchu dla autobusów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Znak_D-12.svg"
    },
    "D-13": {
        "name": "początek pasa ruchu powolnego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/27/Znak_D-13.svg"
    },
    "D-13a": {
        "name": "początek pasa ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/36/Znak_D-13a.svg"
    },
    "D-13b": {
        "name": "początek pasa ruchu na jezdni dwukierunkowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/79/Znak_D-13b.svg"
    },
    "D-14": {
        "name": "koniec pasa ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/81/Znak_D-14.svg"
    },
    "D-15": {
        "name": "przystanek autobusowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Znak_D-15.svg"
    },
    "D-16": {
        "name": "przystanek trolejbusowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Znak_D-16.svg"
    },
    "D-17": {
        "name": "przystanek tramwajowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/45/Znak_D-17.svg"
    },
    "D-18": {
        "name": "parking",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Znak_D-18.svg"
    },
    "D-18a": {
        "name": "parking - miejsce zastrzeżone",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Znak_D-18a.svg"
    },
    "D-18b": {
        "name": "parking zadaszony",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Znak_D-18b.svg"
    },
    "D-19": {
        "name": "postój taksówek",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Znak_D-19.svg"
    },
    "D-19a": {
        "name": "postój taksówek bagażowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Znak_D-19a.svg"
    },
    "D-20": {
        "name": "koniec postoju taksówek",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/66/Znak_D-20.svg"
    },
    "D-20a": {
        "name": "koniec postoju taksówek bagażowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Znak_D-20a.svg"
    },
    "D-21": {
        "name": "szpital",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Znak_D-21.svg"
    },
    "D-21a": {
        "name": "policja",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/45/Znak_D-21a.svg"
    },
    "D-22": {
        "name": "punkt opatrunkowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Znak_D-22.svg"
    },
    "D-23": {
        "name": "stacja paliwowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Znak_D-23.svg"
    },
    "D-23a": {
        "name": "stacja paliwowa tylko z gazem do napędu pojazdów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/42/Znak_D-23a.svg"
    },
    "D-24": {
        "name": "telefon",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/27/Znak_D-24.svg"
    },
    "D-25": {
        "name": "poczta",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/81/Znak_D-25.svg"
    },
    "D-26": {
        "name": "stacja obsługi technicznej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Znak_D-26.svg"
    },
    "D-26a": {
        "name": "wulkanizacja",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Znak_D-26a.svg"
    },
    "D-26b": {
        "name": "myjnia",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/97/Znak_D-26b.svg"
    },
    "D-26c": {
        "name": "toaleta publiczna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/07/Znak_D-26c.svg"
    },
    "D-26d": {
        "name": "natrysk",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Znak_D-26d.svg"
    },
    "D-27": {
        "name": "bufet lub kawiarnia",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Znak_D-27.svg"
    },
    "D-28": {
        "name": "restauracja",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Znak_D-28.svg"
    },
    "D-29": {
        "name": "hotel",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/26/Znak_D-29.svg"
    },
    "D-30": {
        "name": "obozowisko",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Znak_D-30.svg"
    },
    "D-31": {
        "name": "obozowisko wyposażone w podłączenia elektryczne dla przyczep kempingowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Znak_D-31.svg"
    },
    "D-32": {
        "name": "pole biwakowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/63/Znak_D-32.svg"
    },
    "D-33": {
        "name": "schronisko młodzieżowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Znak_D-33.svg"
    },
    "D-34": {
        "name": "punkt informacji turystycznej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/29/Znak_D-34.svg"
    },
    "D-34a": {
        "name": "informacja radiowa o ruchu drogowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Znak_D-34a.svg"
    },
    "D-35": {
        "name": "przejście podziemne dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/Znak_D-35.svg"
    },
    "D-35a": {
        "name": "schody ruchome w dół",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Znak_D-35a.svg"
    },
    "D-36": {
        "name": "przejście nadziemne dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Znak_D-36.svg"
    },
    "D-36a": {
        "name": "schody ruchome w górę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Znak_D-36a.svg"
    },
    "D-37": {
        "name": "tunel",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Znak_D-37.svg"
    },
    "D-38": {
        "name": "koniec tunelu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Znak_D-38.svg"
    },
    "D-39": {
        "name": "dopuszczalne prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Znak_D-39._Ograniczenia_pr%C4%99dko%C5%9Bci_w_Polsce_od_2011.svg"
    },
    "D-39a": {
        "name": "opłaty drogowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/86/Znak_D-39a.svg"
    },
    "D-40": {
        "name": "strefa zamieszkania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Znak_D-40.svg"
    },
    "D-41": {
        "name": "koniec strefy zamieszkania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Znak_D-41.svg"
    },
    "D-42": {
        "name": "obszar zabudowany",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/83/Znak_d42.svg"
    },
    "D-43": {
        "name": "koniec obszaru zabudowanego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/95/Znak_d43.svg"
    },
    "D-44": {
        "name": "strefa płatnego parkowania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Znak_D-44.svg"
    },
    "D-45": {
        "name": "koniec strefy płatnego parkowania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Znak_D-45.svg"
    },
    "D-46": {
        "name": "droga wewnętrzna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Znak_D-46.svg"
    },
    "D-47": {
        "name": "koniec drogi wewnętrznej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Znak_D-47.svg"
    },
    "D-48": {
        "name": "zmiana pierwszeństwa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Znak_D-48.svg"
    },
    "D-48a": {
        "name": "zmiana pierwszeństwa z trójkątem wskazujący wlot podporządkowany",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Znak_D-48a.svg"
    },
    "D-49": {
        "name": "pobór opłat",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Znak_D-49.svg"
    },
    "D-50": {
        "name": "zatoka",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Znak_D-50.svg"
    },
    "D-51": {
        "name": "automatyczna kontrola prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/41/Znak_D-51.svg"
    },
    "D-52": {
        "name": "strefa ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Znak_D-52.svg"
    },
    "D-53": {
        "name": "koniec strefy ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Znak_D-53.svg"
    },
    "E-1": {
        "name": "tablica przeddrogowskazowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/98/Znak_E-1.svg"
    },
    "E-1a": {
        "name": "tablica przeddrogowskazowa na autostradzie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Znak_E-1a.svg"
    },
    "E-1b": {
        "name": "tablica przeddrogowskazowa przed wjazdem na autostradę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Znak_E-1b.svg"
    },
    "E-2a": {
        "name": "drogowskaz tablicowy umieszczany obok jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Znak_E-2a.svg"
    },
    "E-2b": {
        "name": "drogowskaz tablicowy umieszczany nad jezdnią",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Znak_E-2b.svg"
    },
    "E-2c": {
        "name": "drogowskaz tablicowy umieszczany obok jezdni na autostradzie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Znak_E-2c.svg"
    },
    "E-2d": {
        "name": "drogowskaz tablicowy umieszczany nad jezdnią na autostradzie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/83/Znak_E-2d.svg"
    },
    "E-2e": {
        "name": "drogowskaz tablicowy umieszczony obok jezdni przed wjazdem na autostradę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Znak_E-2e.svg"
    },
    "E-2f": {
        "name": "drogowskaz tablicowy umieszczany nad jezdnią przed wjazdem na autostradę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Znak_E-2f.svg"
    },
    "E-3": {
        "name": "drogowskaz w kształcie strzały do miejscowości wskazujący numer drogi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/92/Znak_E-3.svg"
    },
    "E-3a": {
        "name": "drogowskaz w kształcie strzały do miejscowości wskazujący numer drogi – wersja z dwiema miejscowościami kierunkowymi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Znak_E-3a.svg"
    },
    "E-4": {
        "name": "drogowskaz w kształcie strzały do miejscowości podający do niej odległość",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Znak_E-4.svg"
    },
    "E-5": {
        "name": "drogowskaz do dzielnicy miasta",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/Znak_E-5.svg"
    },
    "E-5a": {
        "name": "drogowskaz do centrum miasta",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Znak_E-5a.svg"
    },
    "E-6": {
        "name": "drogowskaz do lotniska",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Znak_E-6.svg"
    },
    "E-6a": {
        "name": "drogowskaz do dworca lub stacji kolejowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Znak_E-6a.svg"
    },
    "E-6b": {
        "name": "drogowskaz do dworca autobusowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Znak_E-6b.svg"
    },
    "E-6c": {
        "name": "drogowskaz do przystani promowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Znak_E-6c.svg"
    },
    "E-7": {
        "name": "drogowskaz do przystani wodnej lub żeglugi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Znak_E-7.svg"
    },
    "E-8": {
        "name": "drogowskaz do plaży lub miejsca kąpielowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/df/Znak_E-8.svg"
    },
    "E-9": {
        "name": "drogowskaz do muzeum",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/64/Znak_E-9.svg"
    },
    "E-10": {
        "name": "drogowskaz do zabytku jako dobra kultury",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Znak_E-10.svg"
    },
    "E-11": {
        "name": "drogowskaz do zabytku przyrody",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/08/Znak_E-11.svg"
    },
    "E-12": {
        "name": "drogowskaz do punktu widokowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Znak_E-12.svg"
    },
    "E-12a": {
        "name": "drogowskaz do szlaku rowerowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Znak_E-12a.svg"
    },
    "E-13": {
        "name": "tablica kierunkowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Znak_E-13.svg"
    },
    "E-14": {
        "name": "tablica szlaku drogowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Znak_E-14.svg"
   },
    "E-14a": {
        "name": "tablica szlaku drogowego na autostradzie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/15/Znak_E-14a.svg"
    },
    "E-15": {
        "name": "numer drogi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/df/DK65-PL.svg"
    },
    "E-15a": {
        "name": "numer drogi krajowej o dopuszczalnym nacisku osi pojazdu do 11,5 t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/df/DK65-PL.svg"
    },
    "E-15b": {
        "name": "numer drogi wojewódzkiej o dopuszczalnym nacisku osi pojazdu do 8 t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d6/DW178-PL.svg"
    },
    "E-15c": {
        "name": "numer autostrady",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/60/A4-PL.svg"
    },
    "E-15d": {
        "name": "numer drogi ekspresowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/S14-PL.svg"
    },
    "E-15e": {
        "name": "numer drogi wojewódzkiej o dopuszczalnym nacisku osi pojazdu do 10 t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Znak_E-15e.svg"
    },
    "E-15f": {
        "name": "numer drogi krajowej o dopuszczalnym nacisku osi pojazdu do 10 t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Znak_E-15f.svg"
    },
    "E-15g": {
        "name": "numer drogi krajowej o dopuszczalnym nacisku osi pojazdu do 8 t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Znak_E-15g.svg"
    },
    "E-15h": {
        "name": "numer drogi wojewódzkiej o dopuszczalnym nacisku osi pojazdu do 11,5 t",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/48/Znak_E-15h.svg"
    },
    "E-16": {
        "name": "numer szlaku międzynarodowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2e/E30-PL.svg"
    },
    "E-17": {
        "name": "miejscowość",
        "image":  "@E-17a"
    },
    "E-17a": {
        "name": "miejscowość",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Znak_E-17a.svg"
    },
    "E-18": {
        "name": "koniec miejscowości",
        "image":  "@E-18a"
    },
    "E-18a": {
        "name": "koniec miejscowości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Znak_E-18a.svg"
    },
    "E-19a": {
        "name": "obwodnica",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Znak_E-19a.svg"
    },
    "E-20": {
        "name": "tablica węzła drogowego na autostradzie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Znak_E-20.svg"
    },
    "E-20a": {
        "name": "tablica węzła drogowego na autostradzie z nazwą i oznaczeniem węzła",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Znak_E-20a.svg"
    },
    "E-21": {
        "name": "dzielnica (osiedle)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Znak_E-21.svg"
    },
    "E-22a": {
        "name": "samochodowy szlak turystyczny",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/09/Znak_E-22a.svg"
    },
    "E-22b": {
        "name": "obiekt na samochodowym szlaku turystycznym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Znak_E-22b.svg"
    },
    "E-22c": {
        "name": "informacja o obiektach turystycznych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Znak_E-22c.svg"
    },

    "F-1": {
        "name": "przejście graniczne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Znak_F-1.svg"
    },
    "F-2": {
        "name": "przekraczanie granicy zabronione",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Znak_F-2.svg"
    },
    "F-2a": {
        "name": "granica państwa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Znak_F-2a.svg"
    },
    "F-3": {
        "name": "granica obszaru administracyjnego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Znak_F-3.svg"
    },
    "F-3a": {
        "name": "granica obszaru administracyjnego na granicy powiatu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Znak_F-3a.svg"
    },
    "F-3b": {
        "name": "granica obszaru administracyjnego na granicy gminy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/50/Znak_F-3b.svg"
    },
    "F-3c": {
        "name": "granica obszaru administracyjnego miasta na prawach powiatu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Znak_F-3c.svg"
    },
    "F-4": {
        "name": "nazwa rzeki",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/14/Znak_F-4.svg"
    },
    "F-5": {
        "name": "uprzedzenie o zakazie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/27/Znak_F-5.svg"
    },
    "F-6": {
        "name": "znak uprzedzający umieszczany przed skrzyżowaniem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/07/Znak_F-6.svg"
    },
    "F-6a": {
        "name": "znak uprzedzający umieszczany przed skrzyżowaniem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/07/Znak_F-6a.svg"
    },
    "F-7": {
        "name": "sposób jazdy w związku z zakazem skręcania w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Znak_F-7.svg"
    },
    "F-8": {
        "name": "objazd w związku z zamknięciem drogi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Znak_F-8.svg"
    },
    "F-9": {
        "name": "znak prowadzący na drodze objazdowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Znak_F-9.svg"
    },
    "F-10": {
        "name": "kierunki na pasach ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/58/Znak_F-10.svg"
    },
    "F-11": {
        "name": "kierunki na pasie ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Znak_F-11.svg"
    },
    "F-12": {
        "name": "znak wskazujący przejazd tranzytowy umieszczany przed skrzyżowaniem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Znak_F-12.svg"
    },
    "F-13": {
        "name": "przejazd tranzytowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Znak_F-13.svg"
    },
    "F-14a": {
        "name": "tablica wskaźnikowa na autostradzie umieszczana w odległości 300 m przed pasem wyłączania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Znak_F-14a.svg"
    },
    "F-14b": {
        "name": "tablica wskaźnikowa na autostradzie umieszczana w odległości 200 m przed pasem wyłączania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/05/Znak_F-14b.svg"
    },
    "F-14c": {
        "name": "tablica wskaźnikowa na autostradzie umieszczana w odległości 100 m przed pasem wyłączania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Znak_F-14c.svg"
    },
    "F-15": {
        "name": "niesymetryczny podział jezdni dla przeciwnych kierunków ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Znak_F-15.svg"
    },
    "F-16": {
        "name": "koniec pasa ruchu na jezdni dwukierunkowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Znak_F-16.svg"
    },
    "F-17": {
        "name": "koniec pasa ruchu na jezdni jednokierunkowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/83/Znak_F-17.svg"
    },
    "F-18": {
        "name": "przeciwny kierunek dla określonych pojazdów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Znak_F-18.svg"
    },
    "F-19": {
        "name": "pas ruchu dla określonych pojazdów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/65/Znak_F-19.svg"
    },
    "F-20": {
        "name": "część drogi (pas ruchu) dla określonych pojazdów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/30/Znak_F-20.svg"
    },
    "F-21": {
        "name": "ruch skierowany na sąsiednią jezdnię",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Znak_F-21.svg"
    },
    "F-22": {
        "name": "ograniczenia na pasie ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Znak_F-22.svg"
    },
    "G-1a": {
        "name": "słupek wskaźnikowy z trzema kreskami umieszczany po prawej stronie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Znak_G-1a.svg"
    },
    "G-1b": {
        "name": "słupek wskaźnikowy z dwiema kreskami umieszczany po prawej stronie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Znak_G-1b.svg"
    },
    "G-1c": {
        "name": "słupek wskaźnikowy z jedną kreską umieszczany po prawej stronie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Znak_G-1c.svg"
    },
    "G-1d": {
        "name": "słupek wskaźnikowy z trzema kreskami umieszczany po lewej stronie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/de/Znak_G-1d.svg"
    },
    "G-1e": {
        "name": "słupek wskaźnikowy z dwiema kreskami umieszczany po lewej stronie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Znak_G-1e.svg"
    },
    "G-1f": {
        "name": "słupek wskaźnikowy z jedną kreską umieszczany po lewej stronie jezdni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Znak_G-1f.svg"
    },
    "G-2": {
        "name": "sieć pod napięciem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Znak_G-2.svg"
    },
    "G-3": {
        "name": "krzyż św. Andrzeja przed przejazdem kolejowym jednotorowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Znak_G-3.svg"
    },
    "G-4": {
        "name": "krzyż św. Andrzeja przed przejazdem kolejowym wielotorowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/51/Znak_G-4.svg"
    },
    "P-1": {
        "name": "linia pojedyncza przerywana",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/Znak_P-1.svg"
    },
    "P-1a": {
        "name": "linia pojedyncza przerywana - długa",
        "image": "@P-1" /* TODO: find actual image */
    },
    "P-1b": {
        "name": "linia pojedyncza przerywana - krótka",
        "image": "@P-1" /* TODO: find actual image */
    },
    "P-1c": {
        "name": "linia pojedyncza przerywana - wydzielająca",
        "image": "@P-1" /* TODO: find actual image */
    },
    "P-1d": {
        "name": "linia pojedyncza przerywana - prowadząca wąska",
        "image": "@P-1" /* TODO: find actual image */
    },
    "P-1e": {
        "name": "linia pojedyncza przerywana-prowadząca szeroko",
        "image": "@P-1" /* TODO: find actual image */
    },
    "P-2": {
        "name": "linia pojedyncza ciągła",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/01/Znak_P-2.svg"
    },
    "P-2a": {
        "name": "linia pojedyncza ciągła - wąska",
        "image": "@P-2" /* TODO: find actual image */
    },
    "P-2b": {
        "name": "linia pojedyncza ciągła - szeroka",
        "image": "@P-2" /* TODO: find actual image */
    },
    "P-3": {
        "name": "linia jednostronnie przekraczalna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/af/Znak_P-3.svg"
    },
    "P-3a": {
        "name": "linia jednostronnie przekraczalna - długa",
        "image": "@P-3" /* TODO: find actual image */
    },
    "P-3b": {
        "name": "linia jednostronnie przekraczalna - krótka",
        "image": "@P-3" /* TODO: find actual image */
    },
    "P-4": {
        "name": "linia podwójna ciągła",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Znak_P-4.svg"
    },
    "P-5": {
        "name": "linia podwójna przerywana",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Znak_P-5.svg"
    },
    "P-6": {
        "name": "linia ostrzegawcza",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Znak_P-6.svg"
    },
    "P-6a": {
        "name": "linia ostrzegawcza - naprowadzająca",
        "image": "@P-6" /* TODO: find actual image */
    },
    "P-7": {
        "name": "linia krawędziowa",
        "image": "@P-7a"
    },
    "P-7a": {
        "name": "linia krawędziowa - przerywana szeroka",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Znak_P-7a.svg"
    },
    "P-7b": {
        "name": "linia krawędziowa - ciągła szeroka",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/57/Znak_P-7b.svg"
    },
    "P-7c": {
        "name": "linia krawędziowa - przerywana wąska",
        "image": "@P-7a" /* TODO: find actual image */
    },
    "P-7d": {
        "name": "linia krawędziowa - ciągła wąska",
        "image": "@P-7c" /* TODO: find actual image */
    },
    "P-8": {
        "name": "strzałka kierunkowa",
        "image": "@P-8a"
    },
    "P-8x": {
        "name": "strzałka kierunkowa",
        "image": "@P-8a"
    },
    "P-8a": {
        "name": "strzałka kierunkowa na wprost",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Znak_P-8a.svg"
    },
    "P-8b": {
        "name": "strzałka kierunkowa w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Znak_P-8b.svg"
    },
    "P-8c": {
        "name": "strzałka kierunkowa do zawracania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Znak_P-8c.svg"
    },
    "P-8d": {
        "name": "strzałka kierunkowa w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Znak_P-8d.svg"
    },
    "P-9": {
        "name": "strzałka naprowadzająca",
        "image": "@P-9a"
    },
    "P-9a": {
        "name": "strzałka naprowadzająca w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Znak_P-9.svg"
    },
    "P-9b": {
        "name": "strzałka naprowadzająca w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/34/Znak_P-9b.svg"
    },
    "P-10": {
        "name": "przejście dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Znak_P-10.svg"
    },
    "P-11": {
        "name": "przejazd dla rowerzystów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Znak_P-11.svg"
    },
    "P-12": {
        "name": "linia bezwzględnego zatrzymania - stop",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Znak_P-12.svg"
    },
    "P-13": {
        "name": "linia warunkowego zatrzymania złożona z trójkątów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/39/Znak_P-13.svg"
    },
    "P-14": {
        "name": "linia warunkowego zatrzymania złożona z prostokątów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/00/Znak_P-14.svg"
    },
    "P-15": {
        "name": "trójkąt podporządkowania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/52/Znak_P-15.svg"
    },
    "P-16": {
        "name": "napis stop",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Znak_P-16.svg"
    },
    "P-17": {
        "name": "linia przystankowa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Znak_P-17.svg"
    },
    "P-18": {
        "name": "stanowisko postojowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Znak_P-18.svg"
    },
    "P-19": {
        "name": "linia wyznaczająca pas postojowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Znak_P-19.svg"
    },
    "P-20": {
        "name": "koperta",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Znak_P-20.svg"
    },
    "P-21": {
        "name": "powierzchnia wyłączona",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/64/Znak_P-21.svg"
    },
    "P-22": {
        "name": "BUS",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/64/Znak_P-22.svg"
    },
    "P-23": {
        "name": "rower",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Znak_P-23.svg"
    },
    "P-24": {
        "name": "miejsce dla pojazdu osoby niepełnosprawnej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Znak_P-24.svg"
    },
    "P-25": {
        "name": "próg zwalniający",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Znak_P-25.svg"
    },
    "P-26": {
        "name": "piesi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/58/Znak_P-26.png"
    },
    "P-27": {
        "name": "kierunek i tor ruchu roweru",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Znak_P-27.png"
    },
    "R-1": {
        "name": "szlak rowerowy lokalny",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/70/Znak_R-1.svg"
    },
    "R-1a": {
        "name": "początek (koniec) szlaku rowerowego lokalnego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Znak_R-1a.svg"
    },
    "R-1b": {
        "name": "zmiana kierunku szlaku rowerowego lokalnego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/24/Znak_R-1b.svg"
    },
    "R-2": {
        "name": "szlak rowerowy międzynarodowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/26/Znak_R-2.svg"
    },
    "R-2a": {
        "name": "zmiana kierunku szlaku rowerowego międzynarodowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/46/Znak_R-2a.svg"
    },
    "R-3": {
        "name": "tablica szlaku rowerowego lokalnego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/35/Znak_R-3.svg"
    },
    "R-4": {
        "name": "informacja o szlaku rowerowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Znak_R-4.svg"
    },
    "R-4a": {
        "name": "informacja o rzeczywistym przebiegu szlaku rowerowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/94/Znak_R-4a.svg"
    },
    "R-4b": {
        "name": "zmiana kierunku szlaku rowerowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Znak_R-4b.svg"
    },
    "R-4c": {
        "name": "drogowskaz tablicowy szlaku rowerowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Znak_R-4c.svg"
    },
    "R-4d": {
        "name": "drogowskaz szlaku rowerowego w kształcie strzały podający odległość",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Znak_R-4d.svg"
    },
    "R-4e": {
        "name": "tablica przeddrogowskazowa szlaku rowerowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8f/Znak_R-4e.svg"
    },
    "S-1": {
        "name": "sygnalizator ogólny z sygnałami do kierowania ruchem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Sygnalizator_S-1.svg"
    },
    "S-1a": {
        "name": "sygnalizator z sygnałami dla kierujących rowerem",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Znak_S-1a.png"
    },
    "S-2": {
        "name": "sygnalizator z sygnałem dopuszczającym skręcanie w kierunku wskazanym strzałką",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Sygnalizator_S-2.svg"
    },
    "S-3": {
        "name": "sygnalizator kierunkowy",
        "image": "@S-3c"
    },
    "S-3a": {
        "name": "sygnalizator kierunkowy na wprost i w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Sygnalizator_S-3a.png",
    },
    "S-3b": {
        "name": "sygnalizator kierunkowy na wprost i w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/65/Sygnalizator_S-3b.png"
    },
    "S-3c": {
        "name": "sygnalizator kierunkowy na wprost",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Sygnalizator_S-3.svg"
    },
    "S-3d": {
        "name": "sygnalizator kierunkowy w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/52/Sygnalizator_S-3d.svg"
    },
    "S-3e": {
        "name": "sygnalizator kierunkowy w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Sygnalizator_S-3e.svg"
    },
    "S-3f": {
        "name": "sygnalizator kierunkowy w lewo zezwalający na zawracanie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/59/Sygnalizator_S-3f.png"
    },
    "S-3g": {
        "name": "sygnalizator kierunkowy dla zawracających",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Sygnalizator_S-3g.png"
    },
    "S-3h": {
        "name": "sygnalizator kierunkowy w lewo i w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Sygnalizator_S-3h.png"
    },
    "S-4": {
        "name": "sygnalizator z sygnałami dla pasów ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Sygnalizator_S-4.svg"
    },
    "S-5": {
        "name": "sygnalizator z sygnałami dla pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Sygnalizator_S-5.svg"
    },
    "S-6": {
        "name": "sygnalizator z sygnałami dla rowerzystów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/97/Sygnalizator_S-6.svg"
    },
    "S-7": {
        "name": "sygnalizator z sygnałem nakazującym opuszczenie pasa ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/18/Sygnalizator_S-7.svg"
    },
    "T-1": {
        "name": "tabliczka wskazująca odległość znaku ostrzegawczego od miejsca niebezpiecznego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Znak_T-1.svg"
    },
    "T-1a": {
        "name": "tabliczka wskazująca odległość znaku informacyjnego od początku (końca) drogi lub pasa ruchu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Znak_T-1a.svg"
    },
    "T-1b": {
        "name": "tabliczka wskazująca długość tunelu lub odcinek drogi do końca tunelu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Znak_T-1b.svg"
    },
    "T-2": {
        "name": "tabliczka wskazująca długość odcinka drogi, na którym powtarza się lub występuje niebezpieczeństwo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Znak_T-2.svg"
    },
    "T-3": {
        "name": "tabliczka wskazująca koniec odcinka, na którym powtarza się lub występuje niebezpieczeństwo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Znak_T-3.svg"
    },
    "T-3a": {
        "name": "tabliczka wskazująca koniec miejsca przeznaczonego na postój",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Znak_T-3a.svg"
    },
    "T-4": {
        "name": "tabliczka wskazująca liczbę zakrętów",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/23/Znak_T-4.svg"
    },
    "T-5": {
        "name": "tabliczka wskazująca początek drogi krętej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/59/Znak_T-5.svg"
    },
    "T-6": {
        "name": "tabliczka wskazująca rzeczywisty przebieg drogi z pierwszeństwem przez skrzyżowanie",
        "image": "@T-6a"
    },
    "T-6x": {
        "name": "tabliczka wskazująca rzeczywisty przebieg drogi z pierwszeństwem przez skrzyżowanie",
        "image": "@T-6a"
    },
    "T-6a": {
        "name": "tabliczka wskazująca rzeczywisty przebieg drogi z pierwszeństwem przez skrzyżowanie(umieszczana na drodze z pierwszeństwem)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Znak_T-6a.svg"
    },
    "T-6b": {
        "name": "tabliczka wskazująca układ dróg podporządkowanych (umieszczana na drodze z pierwszeństwem)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/79/Znak_T-6b.svg"
    },
    "T-6c": {
        "name": "tabliczka wskazująca rzeczywisty przebieg drogi z pierwszeństwem przez skrzyżowanie (umieszczana na drodze podporządkowanej)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Znak_T-6c.svg"
    },
    "T-6d": {
        "name": "tabliczka wskazująca prostopadły przebieg drogi z pierwszeństwem przez skrzyżowanie oraz układ dróg podporządkowanych (umieszczana na drodze podporządkowanej)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Znak_T-6d.svg"
    },
    "T-7": {
        "name": "tabliczka wskazująca układ torów i drogi na przejeździe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Znak_T-7.svg"
    },
    "T-8": {
        "name": "tabliczka wskazująca miejsce, w którym ruch pojazdów został skierowany na tory tramwajowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Znak_T-8.svg"
    },
    "T-9": {
        "name": "tabliczka wskazująca rzeczywistą wielkość spadku lub wzniesienia drogi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/be/Znak_T-9.svg"
    },
    "T-10": {
        "name": "tabliczka wskazująca bocznicę kolejową lub tor o podobnym charakterze",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Znak_T-10_poprawny.svg"
    },
    "T-11": {
        "name": "tabliczka wskazująca przeprawę promową",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Znak_T-11.svg"
    },
    "T-12": {
        "name": "tabliczka wskazująca podłużny uskok nawierzchni",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/83/Znak_T-12.svg"
    },
    "T-13": {
        "name": "tabliczka wskazująca odcinek drogi, na którym występują deformacje nawierzchni w postaci kolein",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Znak_T-13.svg"
    },
    "T-14": {
        "name": "tabliczka wskazująca miejsce częstych potrąceń pieszych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Znak_T-14.svg"
    },
    "T-14a": {
        "name": "tabliczka wskazująca miejsce częstych zderzeń z poprzedzającymi pojazdami",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/da/Znak_T-14a.svg"
    },
    "T-14b": {
        "name": "tabliczka wskazująca miejsce częstych zderzeń czołowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Znak_T-14b.svg"
    },
    "T-14c": {
        "name": "tabliczka wskazująca miejsce częstych zderzeń z tramwajami",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/87/Znak_T-14c.svg"
    },
    "T-14d": {
        "name": "tabliczka wskazująca przejazd kolejowy na którym warunki powodują szczególne niebezpieczeństwo powstania wypadków",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Znak_T-14d.svg"
    },
    "T-15": {
        "name": "tabliczka wskazująca miejsce częstych wypadków spowodowanych śliską nawierzchnią jezdni ze względu na opady deszczu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Znak_T-15.svg"
    },
    "T-16": {
        "name": "tabliczka wskazująca miejsce wyjazdu wozów strażackich",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/65/Znak_T-16.svg"
    },
    "T-16a": {
        "name": "tabliczka wskazująca miejsce wyjazdu karetek pogotowia",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Znak_T-16a.svg"
    },
    "T-17": {
        "name": "tabliczka wskazująca granicę państwa",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Znak_T-17.svg"
    },
    "T-18": {
        "name": "tabliczka wskazująca nieoczekiwaną zmianę kierunku ruchu o przebiegu wskazanym na tabliczce",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Znak_T-18.svg"
    },
    "T-18a": {
        "name": ["tabliczka wskazująca nieoczekiwaną zmianę kierunku ruchu o przebiegu najpierw w prawo, a potem w lewo",
                 "tabliczka wskazująca nieoczekiwaną zmianę kierunku ruchu o przebiegu wskazanym na tabliczce",
                 "tabliczka wskazująca nieoczekiwaną zmianę kierunku ruchu"
                 ],
        "image": "@T-18" /* TODO: find actual image */
    },
    "T-18b": {
        "name": "tabliczka wskazująca nieoczekiwaną zmianę kierunku ruchu o przebiegu w lewo",
        "image": "@T-18" /* TODO: find actual image */
    },
    "T-18c": {
        "name": "tabliczka wskazująca nieoczekiwaną zmianę kierunku ruchu o przebiegu w prawo",
        "image": "@T-18" /* TODO: find actual image */
    },
    "T-19": {
        "name": "tabliczka wskazująca na malowanie znaków poziomych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Znak_T-19.svg"
    },
    "T-20": {
        "name": "tabliczka wskazująca długość odcinka jezdni, na którym zakaz obowiązuje",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/77/Znak_T-20.svg"
    },
    "T-21": {
        "name": "tabliczka wskazująca odległość znaku od miejsca, od którego lub w którym zakaz obowiązuje",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Znak_T-21.svg"
    },
    "T-22": {
        "name": "tabliczka wskazująca, że znak nie dotyczy rowerów jednośladowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/72/Znak_T-22.svg"
    },
    "T-23a": {
        "name": "tabliczka wskazująca motocykle",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Znak_T-23a.svg"
    },
    "T-23b": {
        "name": "tabliczka wskazująca samochody ciężarowe, pojazdy specjalne, pojazdy używane do celów specjalnych, o dopuszczalnej masie całkowitej przekraczającej 3,5 t, oraz ciągniki samochodowe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Znak_T-23b.svg"
    },
    "T-23c": {
        "name": "tabliczka wskazująca ciągniki rolnicze i pojazdy wolnobieżne",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c9/Znak_T-23c.svg"
    },
    "T-23d": {
        "name": "tabliczka wskazująca pojazdy silnikowe z przyczepą, z wyjątkiem pojazdów z przyczepą jednoosiową lub naczepą",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Znak_T-23d.svg"
    },
    "T-23e": {
        "name": "tabliczka wskazująca pojazdy z przyczepą kempingową",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Znak_T-23e.svg"
    },
    "T-23f": {
        "name": "tabliczka wskazująca autobusy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/00/Znak_T-23f.svg"
    },
    "T-23g": {
        "name": "tabliczka wskazująca trolejbusy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Znak_T-23g.svg"
    },
    "T-23h": {
        "name": "tabliczka wskazująca pojazdy z towarami niebezpiecznymi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/Znak_T-23h.svg"
    },
    "T-23i": {
        "name": "tabliczka wskazująca pojazdy z towarami wybuchowymi lub łatwopalnymi",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Znak_T-23i.svg"
    },
    "T-23j": {
        "name": "tabliczka wskazująca pojazdy z towarami, które mogą skazić wodę",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/56/Znak_T-23j.svg"
    },
    "T-24": {
        "name": "tabliczka wskazująca, że pozostawiony pojazd zostanie usunięty na koszt właściciela",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Znak_T-24.svg"
    },
    "T-25": {
        "name": "tabliczka wskazująca początek zakazu postoju lub zatrzymywania",
        "image": "@T-25a"
    },
    "T-25a": {
        "name": "tabliczka wskazująca początek zakazu postoju lub zatrzymywania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Znak_T-25a.svg"
    },
    "T-25b": {
        "name": "tabliczka wskazująca kontynuację zakazu postoju lub zatrzymywania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Znak_T-25b.svg"
    },
    "T-25c": {
        "name": "tabliczka wskazująca odwołanie zakazu postoju lub zatrzymywania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/89/Znak_T-25c.svg"
    },
    "T-26": {
        "name": "tabliczka wskazująca, że zakaz postoju lub zatrzymywania dotyczy strony placu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/79/Znak_T-26.svg"
    },
    "T-27": {
        "name": "tabliczka wskazująca, że przejście dla pieszych jest szczególnie uczęszczane przez dzieci",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Znak_T-27.svg"
    },
    "T-28": {
        "name": "tabliczka wskazująca, że za przejazd drogą pobierana jest opłata",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Znak_T-28.svg"
    },
    "T-28a": {
        "name": "tabliczka wskazująca koniec odcinka drogi, za przejazd którym pobierana jest opłata",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Znak_T-28a.svg"
    },
    "T-29": {
        "name": "tabliczka informująca o miejscu przeznaczonym dla pojazdu samochodowego uprawnionej osoby niepełnosprawnej o obniżonej sprawności ruchowej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Znak_T-29.svg"
    },
    "T-30": {
        "name": "tabliczka wskazująca sposób ustawienia pojazdu względem krawędzi jezdni",
        "image": "@T-30a"
    },
    "T-30a": {
        "name": "tabliczka wskazująca postój całego pojazdu na chodniku równolegle do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Znak_T-30.svg"
    },
    "T-30b": {
        "name": "tabliczka wskazująca postój całego pojazdu na chodniku prostopadle do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/16/Znak_T-30b.svg"
    },
    "T-30c": {
        "name": "tabliczka wskazująca postój całego pojazdu na chodniku skośnie do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/46/Znak_T-30c.svg"
    },
    "T-30d": {
        "name": "tabliczka wskazująca postój na chodniku kołami przedniej osi pojazdu prostopadle do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Znak_T-30d.svg"
    },
    "T-30e": {
        "name": "tabliczka wskazująca postój na chodniku kołami przedniej osi pojazdu skośnie do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Znak_T-30e.svg"
    },
    "T-30f": {
        "name": "tabliczka wskazująca postój całego pojazdu na jezdni prostopadle do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Znak_T-30f.svg"
    },
    "T-30g": {
        "name": "tabliczka wskazująca postój całego pojazdu na jezdni skośnie do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/df/Znak_T-30g.svg"
    },
    "T-30h": {
        "name": "tabliczka wskazująca postój na chodniku kołami jednego boku pojazdu równolegle do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/15/Znak_T-30h.svg"
    },
    "T-30i": {
        "name": "tabliczka wskazująca postój całego pojazdu na jezdni równolegle do krawężnika",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Znak_T-30i.svg"
    },
    "T-31": {
        "name": "tabliczka wskazująca kategorię tunelu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/62/Znak_T-31.svg"
    },
    "T-32": {
        "name": "tabliczka wskazująca minimalny odstęp od poprzedzającego pojazdu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Znak_T-32.svg"
    },
    "T-33": {
        "name": "tabliczka wskazująca umieszczenie w zatoce telefonu alarmowego i gaśnicy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Znak_T-33.svg"
    },
    "T-34": {
        "name": "tabliczka wskazująca pobór opłaty elektronicznej za przejazd drogą publiczną",
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/55/Znak_T-34.svg"
    },
    "U-1a": {
        "name": "słupek prowadzący umieszczany samodzielnie na poboczu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8f/U-1a_prawy.svg"
    },
    "U-1b": {
        "name": "słupek prowadzący umieszczony na barierze ochronnej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Slupek3.png"
    },
    "U-1c": {
        "name": "punktowy element odblaskowy umieszczony na barierze ochronnej",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/37/U-1c_%28p%29.png"
    },
    "U-1d": {
        "name": "symbol słuchawki telefonicznej wskazującej kierunek do najbliższego telefonu alarmowego (w lewo)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/U-1d_Polish_road_sign.svg"
    },
    "U-1e": {
        "name": "symbol słuchawki telefonicznej wskazujący kierunek do najbliższego telefonu alarmowego (w prawo)",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2d/U-1e_Polish_road_sign.svg"
    },
    "U-1f": {
        "name": "znak z numerem drogi umieszczany na słupkach prowadzących",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/U-1f.png"
    },
    "U-2": {
        "name": "słupek krawędziowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c0/U-2_Slupek.png"
    },
    "U-3a": {
        "name": "tablica pojedyncza prowadząca w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/U-3a_Polish_road_sign.svg"
    },
    "U-3b": {
        "name": "tablica pojedyncza prowadząca w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e0/U-3b_Polish_road_sign.svg"
    },
    "U-3c": {
        "name": "tablica prowadząca ciągła w prawo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/fc/U-3c_Polish_road_sign.svg"
    },
    "U-3d": {
        "name": "tablica prowadząca ciągła w lewo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/99/U-3d.svg"
    },
    "U-3e": {
        "name": "tablica prowadząca dwustronna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8a/U-3e_Polish_road_sign.svg"
    },
    "U-4a": {
        "name": "tablica rozdzielająca stosowana na autostradach i drogach ekspresowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/04/U-4a.svg"
    },
    "U-4b": {
        "name": ["tablica rozdzielająca stosowana na drogach publicznych",
                 "tablica rozdzielająca stosowana na drogach publicznych, z wyjątkiem autostrad i dróg ekspresowych"],
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2c/U-4b.svg"
    },
    "U-4c": {
        "name": "tablica rozdzielająca stosowana podczas robót drogowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/63/U-4c.svg"
    },
    "U-5a": {
        "name": "słupek przeszkodowy",
        "image": null
    },
    "U-5b": {
        "name": "słupek przeszkodowy zespolony ze znakiem C-9",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cd/U-5b.svg"
    },
    "U-5c": {
        "name": "aktywny słupek przeszkodowy zespolony ze znakiem C-9",
        "image": null
    },
    "U-6a": {
        "name": "tablica kierująca szeroka",
        "image": null
    },
    "U-6b": {
        "name": "tablica kierująca szeroka",
        "image": null
    },
    "U-6c": {
        "name": "tablica kierująca wąska",
        "image": null
    },
    "U-6d": {
        "name": "tablica kierująca wąska",
        "image": null
    },
    "U-7": {
        "name": "znak kilometrowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ac/U-7.svg"
    },
    "U-8": {
        "name": "znak hektometrowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/U-8.svg"
    },
    "U-8": {
        "name": "znak hektometrowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/U-8.svg"
    },
    "U-8": {
        "name": "znak hektometrowy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/U-8.svg"
    },
    "U-9a": {
        "name": "skrajnia pozioma lewa",
        "image": ""
    },
    "U-9b": {
        "name": "U-9a",
        "image": null
    },
    "U-9a": {
        "name": "skrajnia pozioma prawa",
        "image": null
    },
    "U-9c": {
        "name": "skrajnia pionowa",
        "image": null
    },
    "U-10a": {
        "name": "urządzenie bramowe bez elementów uchylnych",
        "image": null
    },
    "U-10b": {
        "name": "urządzenie bramowe z elementami uchylnymi",
        "image": null
    },
    "U-11a": {
        "name": "balustrada",
        "image": null
    },
    "U-11b": {
        "name": "balustrada",
        "image": null
    },
    "U-12a": {
        "name": "ogrodzenie segmentowe",
        "image": null
    },
    "U-12b": {
        "name": "ogrodzenie łańcuchowe",
        "image": null
    },
    "U-12c": {
        "name": "słupek blokujący",
        "image": null
    },
    "U-13a": {
        "name": "rogatka z urządzeniem dzwonkowym i siatką",
        "image": null
    },
    "U-13b": {
        "name": "rogatka bez dodatkowych urządzeń",
        "image": null
    },
    "U-13c": {
        "name": "półrogatka",
        "image": null
    },
    "U-14a": {
        "name": "bariera drogowa stalowa",
        "image": null
    },
    "U-14b": {
        "name": "bariera drogowa betonowa",
        "image": null
    },
    "U-14c": {
        "name": "bariera drogowa stalowo-betonowa",
        "image": null
    },
    "U-14d": {
        "name": "bariera drogowa linowa",
        "image": null
    },
    "U-14e": {
        "name": "bariera drogowa kubaturowa",
        "image": null
    },
    "U-15a": {
        "name": "osłona energochłonna wielosegmentowa",
        "image": null
    },
    "U-15b": {
        "name": "osłona zabezpieczająca w postaci monobloku",
        "image": null
    },
    "U-16a": {
        "name": "liniowy próg zwalniający listwowy",
        "image": null
    },
    "U-16b": {
        "name": "liniowy próg zwalniający płytowy",
        "image": null
    },
    "U-16c": {
        "name": "liniowy próg zwalniający płytowy",
        "image": null
    },
    "U-16d": {
        "name": "liniowy próg zwalniający listwowy",
        "image": null
    },
    "U-17": {
        "name": "próg podrzutowy",
        "image": null
    },
    "U-18a": {
        "name": "lustro drogowe okrągłe",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Golczewo_DW106_kier._Kamień.jpg"
    },
    "U-18d": {
        "name": "lustro drogowe prostokątne",
        "image": null
    },
    "U-19": {
        "name": "osłona przeciwolśnieniowa",
        "image": null
    },
    "U-20a": {
        "name": "zapora drogowa pojedyncza wąska",
        "image": null
    },
    "U-20b": {
        "name": "zapora drogowa pojedyncza szeroka",
        "image": null
    },
    "U-20c": {
        "name": "zapora drogowa podwójna",
        "image": null
    },
    "U-20d": {
        "name": "zapora drogowa potrójna",
        "image": null
    },
    "U-21a": {
        "name": "tablica kierująca",
        "image": null
    },
    "U-21b": {
        "name": "tablica kierująca",
        "image": null
    },
    "U-21c": {
        "name": "tablica kierująca",
        "image": null
    },
    "U-21d": {
        "name": "tablica kierująca",
        "image": null
    },
    "U-21e": {
        "name": "tablica kierująca z elementami odblaskowymi",
        "image": null
    },
    "U-21f": {
        "name": "tablica kierująca z elementami odblaskowymi",
        "image": null
    },
    "U-22": {
        "name": "taśma ostrzegawcza",
        "image": null
    },
    "U-23": {
        "name": "pachołek drogowy",
        "image": null
    },
    "U-24": {
        "name": "tablica uchylna z elementami odblaskowymi",
        "image": null
    },
    "U-25a": {
        "name": "separator ciągły",
        "image": null
    },
    "U-25b": {
        "name": "separator punktowy",
        "image": null
    },
    "U-26": {
        "name": "tablica ostrzegawcza ze znakiem A-14",
        "image": null
    },
    "U-26a": {
        "name": "tablica zamykająca",
        "image": null
    },
    "U-26b": {
        "name": "tablica zamykająca",
        "image": null
    },
    "U-26c": {
        "name": "tablica zamykająca",
        "image": null
    },
    "U-26d": {
        "name": "tablica zamykająca",
        "image": null
    },
    "U-27": {
        "name": "tablica wcześnie ostrzegająca",
        "image": null
    },
    "U-28": {
        "name": "kładka dla pieszych",
        "image": null
    },
    "W-1": {
        "name": "klasa obciążenia mostu o ruchu jednokierunkowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/15/Znak_W-1.svg"
    },
    "W-2": {
        "name": "klasa obciążenia mostu o ruchu dwukierunkowym",
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Znak_W-2.svg"
    },
    "W-3": {
        "name": "klasa obciążenia mostu o ruchu jednokierunkowym dla pojazdów kołowych i gąsienicowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Znak_W-3.svg"
    },
    "W-4": {
        "name": "klasa obciążenia mostu o ruchu dwukierunkowym dla pojazdów kołowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/27/Znak_W-4.svg"
    },
    "W-5": {
        "name": "klasa obciążenia mostu o ruchu dwukierunkowym dla pojazdów gąsienicowych",
        "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Znak_W-5.svg"
    },
    "W-6": {
        "name": "szerokość mostu lub środka przeprawowego",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/33/Znak_W-6.svg"
    },
    "W-7": {
        "name": "wysokość skrajni pionowej na moście lub w tunelu",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Znak_W-7.svg"
    },
    "AT-1": {
        "name": "sygnalizacja świetlna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/32/Znak_AT-1.svg"
    },
    "AT-2": {
        "name": "sygnalizacja świetlna wzbudzana",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/80/Znak_AT-2.svg"
    },
    "AT-3": {
        "name": "niebezpieczny zjazd",
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/15/Znak_AT-3.svg"
    },
    "AT-4": {
        "name": "stromy podjazd",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Znak_AT-4.svg"
    },
    "AT-5": {
        "name": "ruch kolizyjny",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Znak_AT-5.svg"
    },
    "BT-1": {
        "name": "ograniczenie prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Znak_BT-1.svg"
    },
    "BT-2": {
        "name": "koniec ograniczenia prędkości",
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Znak_BT-2.svg"
    },
    "BT-3": {
        "name": "blokada zwrotnicy",
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Znak_BT-3.svg"
    },
    "BT-4": {
        "name": "stop – zwrotnica eksploatowana jednostronnie",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/76/Znak_BT-4.svg"
    },
    "CT-1": {
        "name": "izolator sekcyjny",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Znak_CT-1.svg"
    },
    "CT-2": {
        "name": "granica zasilania",
        "image": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Znak_CT-2.svg"
    },
    "DT-1": {
        "name": "zwrotnica elektryczna lewoskrętna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/6/66/Znak_DT-1.svg"
    },
    "DT-2": {
        "name": "zwrotnica elektryczna prawoskrętna",
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/97/Znak_DT-2.svg"
    }
};

////// DATABASE END ///////

/* New flags */
const PM_DATAFMT_MASK           = 0xFF000000;
const PM_DATAFMT_1_0            = 0x00000000; /**< Data format for versions 1.0 to 1.3 */
const PM_DATAFMT_1_4            = 0x01000000; /**< Data format for version 1.4 */

const PM_POST_MASK              = 0x0000000F;
const PM_POST_SHOW_THUMB_R      = 0x00000001;
const PM_POST_SHOW_THUMB_L      = 0x00000002;
const PM_POST_SHOW_SYMBOL       = 0x00000004;
const PM_POST_SHOW_NAME         = 0x00000008;
const PM_SHOW_HINT              = 0x00000010;
const PM_SHOW_HIGHLIGHT         = 0x00000020;

var presentationMode      = 0;
var resolvedTrafficSigns  = 0;
var potentialTrafficSigns = 0;

var signSpans = [];

////////////////////////////////////////////////////////////////////////////////////////
Document.prototype.showHintFrame = function(trafficSignId) {

  if ((presentationMode & PM_SHOW_HINT) === 0)
    return;

  var hintFrame = document.getElementById("hintFrame");
  hintFrame.style.display = "block";

  var hintFrameImage = document.getElementById("hintFrameImage");
  hintFrameImage.src = getImageForSign(trafficSignId);
};

////////////////////////////////////////////////////////////////////////////////////////
Document.prototype.hideHintFrame = function() {
  if ((presentationMode & PM_SHOW_HINT) === 0)
    return;
  var hintFrame = document.getElementById("hintFrame");
  hintFrame.style.display = "none";
};

////////////////////////////////////////////////////////////////////////////////////////
function getImageForSign(sign) {
  var imgLink;
  if (signIndex[sign] && signIndex[sign].image) {
    imgLink = signIndex[sign].image;
  } else {
    return null;
  }

  if (imgLink.charAt(0) == '@') {
    imgLink = getImageForSign(imgLink.substr(1));
  }
  return imgLink;
}

function getSignName(sign) {
  if (!signIndex[sign] || !signIndex[sign].name) {
    return null;
  } else {
    if (Array.isArray(signIndex[sign].name)) {
      return signIndex[sign].name[0];
    } else {
      return signIndex[sign].name;
    }
  }
}

function getSignNames(sign) {
  if (!signIndex[sign] || !signIndex[sign].name) {
    return [];
  } else {
    if (Array.isArray(signIndex[sign].name)) {
      return signIndex[sign].name;
    } else {
      return [signIndex[sign].name];
    }
  }
}

function stringsSimilar(s1, s2) {
    if (s1) {
        s1 = s1.trim().toUpperCase();
    }
    if (s2) {
        s2 = s2.trim().toUpperCase();
    }
    return s1 === s2;
}

////////////////////////////////////////////////////////////////////////////////////////
function createReplacementFor(replacedElement) {
  var code = "";
  var signCode = replacedElement.code;
  var followingQuotedText = replacedElement.followingQuotedText;
  if (getImageForSign(signCode)) {
    
    caption = getSignName(signCode);
    code = "<span title=\"" + signCode + ": " + caption + "\"";
    if ((presentationMode & PM_SHOW_HINT) !== 0) {
      code += " id=\"trafficSign_" + signSpans.length + "\"";
      signSpans.push(signCode);
    }
    if ((presentationMode & PM_SHOW_HIGHLIGHT) !== 0) {
      code += " style=\"border-bottom: 1px solid #080;\"";
    }
    code += ">";
    var thumbnailCode = " <img src=\""+getImageForSign(signCode)+"\"";
    thumbnailCode += " style=\"max-height: 16px\"";
    thumbnailCode += " alt=\"" + signCode + ": " + caption + "\"";
    thumbnailCode += " title=\"" + signCode + ": " + caption + "\" />";
      
    if ((presentationMode & PM_POST_SHOW_THUMB_L) !== 0) {
      code += thumbnailCode;
    }
    if ((presentationMode & PM_POST_SHOW_SYMBOL) !== 0) {
      code += signCode;
    }
    if ((presentationMode & PM_POST_SHOW_NAME) !== 0) {
      var signNames = getSignNames(signCode);
      var insertName = true;
      for (var ix = 0; ix < signNames.length; ix++) {
        if (stringsSimilar(signNames[ix], followingQuotedText)) {
          insertName = false;
        }
      }
      if (signNames.length > 0) {
        if (insertName) {
            code += ' <span style=\"color: #080\">"' + signNames[0] + '"</span>';
        }
      } else if ((presentationMode & PM_POST_SHOW_SYMBOL) === 0) {
        /* If the sign name is unknown, append symbol information unless this information has been already presented */
        code += signCode;
      }
    }
    if ((presentationMode & PM_POST_SHOW_THUMB_R) !== 0) {
      code += thumbnailCode;
    }
      
    code += "</span>";

    resolvedTrafficSigns++;
  } else {
    code = signCode;
    potentialTrafficSigns++;
  }
  return code;
}

////////////////////////////////////////////////////////////////////////////////////////
function decorateTrafficSigns() {
  var posts = document.querySelectorAll("div[id^=post_message]");

  for (var postIx = 0; postIx < posts.length; postIx++) {
    var post = posts[postIx];

    /* For each found post, look for the symbols */
    var content = post.innerHTML;
    var symbols;
    var tokens = [];
    while ((symbols = reSignCode.exec(content)) !== null) {
      
      var signCode = symbols[1];
      var followingQuotedText = symbols[4];

      content = content.replace(signCode, "##token" + tokens.length + "##");
      //content = content.replace(signCode, "<pre style=\"color: #f00\">" + symbols[4] + "</pre>");
      tokens.push({"code": signCode, "followingQuotedText": followingQuotedText});
    }

    for (var ix=0; ix < tokens.length; ix++) {
      content = content.replace("##token" + ix + "##", createReplacementFor(tokens[ix]));
    }

    post.innerHTML = content;
  }

  var settingsBtn = document.getElementById("tsSettingsButton");
  settingsBtn.innerHTML = "Polskie Znaki Drogowe";

}

////////////////////////////////////////////////////////////////////////////////////////
function createHintFrame() {
  var hintFrame = document.createElement("div");
  hintFrame.setAttribute("id", "hintFrame");
  hintFrame.style.display    = "none";
  hintFrame.style.position   = "fixed";
  hintFrame.style.left       = "0px";
  hintFrame.style.top        = "0px";
  hintFrame.style.background = "none";
  hintFrame.style.overflow   = "hidden";

  var hintFrameImage = document.createElement("img");
  hintFrameImage.setAttribute("id", "hintFrameImage");
  hintFrameImage.style.maxWidth  = "460px";
  hintFrameImage.style.maxHeight = "220px";
  hintFrameImage.src             = "";
  hintFrame.appendChild(hintFrameImage);
  document.body.appendChild(hintFrame);
}

function appendOptions(select, availableOptions, selectedOption) {
  for (var ix=0; ix < availableOptions.length; ix++) {
    var option = availableOptions[ix];
    var optionNode = document.createElement("option");
    optionNode.value = option.value;
    optionNode.innerHTML = option.caption;
    if (option.value == selectedOption) {
      optionNode.setAttribute("selected", "selected");
    }
    select.appendChild(optionNode);
  }
}

function createSettingsMenu() {
  var threadToolsItem = document.querySelector("td#threadtools");
  
  if (!threadToolsItem) {
    console.debug("td#threadtools does not exist, skipping");
    return;
  }
  
  var topMenu = threadToolsItem.parentNode;
  

  var newItemTD = document.createElement("td");
  newItemTD.setAttribute("class", "vbmenu_control");
  newItemTD.setAttribute("id", "trafficSignsSettings");
  
  var tsSettings = document.createElement("dl");
  tsSettings.setAttribute("id", "tsSettings");
  tsSettings.style.display  = "none";
  tsSettings.style.position = "fixed";
  tsSettings.style.overflow = "hidden";
  tsSettings.style.right = 0;
  tsSettings.style.top = 0;
  tsSettings.style.width = 300;
  tsSettings.style.height = 100;
  tsSettings.style.background = "#D1D1E1";
  tsSettings.style.border = "1px solid #0B198C";
  tsSettings.style.padding = "8px";

  var newItemA = document.createElement("a");
  newItemA.setAttribute("id", "tsSettingsButton");
  newItemA.innerHTML = "";
  newItemA.style.cursor = "pointer";
  newItemA.onmousedown = function() {
    var tsModeSelector = document.getElementById("tsModeSelector");

    if (tsSettings.style.display == "none") {
      tsSettings.style.display = "block";
      newItemA.innerHTML = "Polskie Znaki Drogowe: ustawienia";
    } else {
      tsSettings.style.display = "none";
      newItemA.innerHTML = "Polskie Znaki Drogowe";
    }

  };
  newItemTD.appendChild(newItemA);
  
  var tsSettingsRow1a = document.createElement("dt");
  var tsSettingsRow1b = document.createElement("dd");
  tsSettingsRow1a.innerHTML = "Podgląd po wskazaniu";

  var tsSettingsRow2a = document.createElement("dt");
  var tsSettingsRow2b = document.createElement("dd");
  tsSettingsRow2a.innerHTML = "W treści posta";
  
  var tsSettingsRow3a = document.createElement("dt");
  var tsSettingsRow3b = document.createElement("dd");
  tsSettingsRow3a.innerHTML = "Wyróżnienie kodu znaku";
  
  var tsSelHint = document.createElement("select");
  tsSelHint.setAttribute("id", "tsSelHint");
  appendOptions(tsSelHint, [
    {"value": 0, "caption": "Nie pokazuj"},
    {"value": PM_SHOW_HINT, "caption": "Pokazuj"}], presentationMode & PM_SHOW_HINT);
    
  var tsSelCode = document.createElement("select");
  tsSelCode.setAttribute("id", "tsSelCode");
  appendOptions(tsSelCode, [
    {"value": PM_POST_SHOW_SYMBOL, "caption": "Nic nie zmieniaj"},
    {"value": PM_POST_SHOW_THUMB_L | PM_POST_SHOW_SYMBOL, "caption": "Dodaj miniaturę przed kodem"},
    {"value": PM_POST_SHOW_THUMB_R | PM_POST_SHOW_SYMBOL, "caption": "Dodaj miniaturę za kodem"},
    {"value": PM_POST_SHOW_THUMB_R, "caption": "Zastąp kod miniaturą"},
    {"value": PM_POST_SHOW_SYMBOL | PM_POST_SHOW_NAME, "caption": "Dodaj nazwę znaku do kodu"},
    {"value": PM_POST_SHOW_NAME, "caption": "Zastąp kod nazwą znaku"},
    {"value": PM_POST_SHOW_NAME | PM_POST_SHOW_THUMB_L, "caption": "Zastąp kod miniaturą i nazwą znaku"},
    {"value": PM_POST_SHOW_NAME | PM_POST_SHOW_THUMB_R, "caption": "Zastąp kod nazwą znaku i miniaturą"}
  ], presentationMode & PM_POST_MASK);
    
  var tsSelHighlight = document.createElement("select");
  tsSelHighlight.setAttribute("id", "tsSelHighlight");
  appendOptions(tsSelHighlight, [
    {"value": 0, "caption": "Wyłączone"},
    {"value": PM_SHOW_HIGHLIGHT, "caption": "Włączone"}], presentationMode & PM_SHOW_HIGHLIGHT);
    
  
  var tsBtnSave = document.createElement("input");
  tsBtnSave.setAttribute("type", "button");
  tsBtnSave.setAttribute("value", "Zapisz");

  
  tsBtnSave.onclick = function() {
    presentationMode = document.getElementById("tsSelHint").value | document.getElementById("tsSelCode").value | document.getElementById("tsSelHighlight").value;
    presentationMode |= PM_DATAFMT_1_4;
    if (typeof(GM) !== "undefined") {
      GM.setValue("presentationMode", presentationMode).then(
        function(result) {
          location.reload();
        },
        function(err) {
          alert("value not set");
        }
      );
    } else if (typeof(GM_setValue) !== "undefined") {
      GM_setValue("presentationMode", presentationMode);
      location.reload();
    }
  };

  document.body.appendChild(tsSettings);
  tsSettings.appendChild(tsSettingsRow1a);
  tsSettings.appendChild(tsSettingsRow1b);
  tsSettings.appendChild(tsSettingsRow2a);
  tsSettings.appendChild(tsSettingsRow2b);
  tsSettings.appendChild(tsSettingsRow3a);
  tsSettings.appendChild(tsSettingsRow3b);
  tsSettings.appendChild(tsBtnSave);
  
  tsSettingsRow1b.appendChild(tsSelHint);
  tsSettingsRow2b.appendChild(tsSelCode);
  tsSettingsRow3b.appendChild(tsSelHighlight);

  topMenu.appendChild(newItemTD);

}

function enableEvents() {
  for (var ix=0; ix < signSpans.length; ix++) {
    var trafficSignCode = signSpans[ix];
    var elem = document.getElementById("trafficSign_" + ix);
    elem.trafficSignCode = trafficSignCode;
    elem.addEventListener('mouseenter',function(e) {
      document.showHintFrame(this.trafficSignCode);
    }, false);
    elem.addEventListener('mouseout',function(e) {
      document.hideHintFrame();
    }, false);
  }
}

function onStartupReady() {
  if ((presentationMode & PM_DATAFMT_MASK) == PM_DATAFMT_1_0) {
    /* data format migration 1.0 (0x00) to 1.4 (0x01) */
    var newPresentationMode = 0;
    switch (presentationMode) {
      case 2:  newPresentationMode = PM_POST_SHOW_SYMBOL | PM_SHOW_HINT;                        /* Podgląd, kod */
               break;
      case 10: newPresentationMode = PM_POST_SHOW_SYMBOL | PM_SHOW_HINT | PM_SHOW_HIGHLIGHT;    /* Podgląd, kod wyróżniony */
               break;
      case 3:  newPresentationMode = PM_POST_SHOW_SYMBOL | PM_SHOW_HINT | PM_POST_SHOW_THUMB_R; /* Podgląd, kod + miniatura */
               break;
      case 7:  newPresentationMode = PM_SHOW_HINT | PM_POST_SHOW_THUMB_R;                       /* Podgląd, miniatura */
               break;
      case 1:  newPresentationMode = PM_POST_SHOW_SYMBOL | PM_POST_SHOW_THUMB_R;                /* Bez podglądu, kod + miniatura */
               break;
      case 5:  newPresentationMode = PM_POST_SHOW_THUMB_R;                                      /* Bez podglądu, miniatura */
               break;
      default: console.warn("Cannot migrate from presentationMode=" + presentationMode);
               newPresentationMode = PM_POST_SHOW_SYMBOL | PM_SHOW_HINT;
               break;
    }
    presentationMode = newPresentationMode | PM_DATAFMT_1_4;
  }
  createHintFrame();
  createSettingsMenu();
  decorateTrafficSigns();
  enableEvents();
}

if (typeof(GM) !== "undefined") {
  /* Using new API - Greasemonkey, Tampermonkey on Chrome */
    GM.getValue("presentationMode").then(
        function(_presentationMode) {
            presentationMode = parseInt(_presentationMode);
            if (presentationMode === null) {
                presentationMode = PM_DATAFMT_1_4 | PM_POST_SHOW_SYMBOL | PM_SHOW_HINT;
            }
            onStartupReady();
        },
        function(err) {
            presentationMode = PM_DATAFMT_1_4 | PM_POST_SHOW_SYMBOL | PM_SHOW_HINT;
            onStartupReady();
        }
    );

} else if (typeof(GM_getValue) !== "undefined") {
  /* Using old API - Tampermonkey and Violentmonkey on Chrome */
  presentationMode = parseInt(GM_getValue("presentationMode"));
  if (!presentationMode) presentationMode = PM_DATAFMT_1_4 | PM_POST_SHOW_SYMBOL | PM_SHOW_HINT;
  onStartupReady();
}