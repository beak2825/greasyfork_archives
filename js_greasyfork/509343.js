// ==UserScript==
// @name         allSearch
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  all-search(baidu,google)
// @author       You
// @match         *://www.baidu.com/s*
// @match        *://www.google.com/search?q=*
// @match        *://www.google.com.hk/search?q=*
// @match        file:///C:/Users/zf/Desktop/%E7%95%99%E6%95%B0_%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509343/allSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/509343/allSearch.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //baidu跳转google
    if (window.location.href.includes("baidu")) {
        const img = document.createElement("img");
        img.src =
            "data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHklEQVR4nO2Xe1BUVRzHT0CBaGDGUIyI8VqGqUmYVYZK5U1AsbxaYxFwFKV4qjxXab0oqMQjophR0lRgqGmjYkBgiHVWWGqcwF0WkhX / qVCxZBGQe2YxYX / Naosi2z7cC2wzfGe + /+zMOffzuffcs/cgtJzlLEfvABMZk / m + CZO5Ic1k + vvXccIeGRmXPENuywDMzAKSlS7Hu3bLyFTWDZwb2kwW + OwEAhmhpQ7m + G3CmeFdZHzSfRyVA7pUMYbMDusiCS + 3RQefOOLvjDMjRXhbpk7QKsvMBJwR2TdVupm2KPCYE1CEWWkzeoM / +URY6XLMCSxeMHBICzIl90X1UQ2OnxTZH9UP5V6rqYUvoluSaTE3FxoeK3swuIY6 + B3rzSaj3729aPA5DD6iMnfcHP6UGhnD + Aa / hYfPphh + 3NelYQQhUHZsLQ0wY + 9 / r9 + 4lGmcHSYk8wIPyUro3lBKt4KSN6xlh7cG3D3kT + CMSDEZlzytcmwO4yKl8KPxrq9KzVfOwisrNbeASZ / Y + eCcgC + B8DLTNC8QXqsm84KqyfhHIiTV8IqMebwy9CT8rIRiSbn5PxRIZd2SFnqu1XX + 0YIt63D6tt8WBJ5sRTa40UQ2ttFWpYCy4wH0ISCQCTK04HZUiHkIFL2bbAMjz5nOgx91tJVBIv1ZZGgBAhmRPPSHUkDRySpzGLVe8wj + BSv5eLKnEzLEYB7yeBx + tq0IxrxfeiAwwXi9DRlqyHbEVimgfBofWd2BMs8VyFBD8lC9OgGyHVXqMl + qDQAV3bdOJi / 340k0XhDzUL9aAR4KXgqBVBuAw + 5XZdoISNUJTLUj2lIJZDmOyjVekOShe + oEgI9WLZXAXtt7oLfASBd63qAFMA + NqhOYuIBcDHoJYU0v8QUUslQC + e6Dsv / tNppqA1CyVXBDrz + yYb4lEMIMsuVakCmiOI2JhPkB15vT6gROv1fT9NSfEt0CV4iQnIMt185DSU / iKaoFzjKrT2l6AvWJRTFP9TH37aUg8B1seACvKENSO / 1pT5wdVfDcxCI7tstfau9 + Du32NN + LMNHpc1p6YQXk9bJnwR / v3r6Cm3y + l95nAS6Ta1zq3XFd092vYtQLdDrQ / Nq5foo1cFIlvLLs3oO9 + kgQBGFUGdwk1Lj / r / sbvtpV6q7T5DniPKE6eGXTxEeHT / zM1PlImVJK0HJj6oa02X0q / Nv7dZ0fVfXE2b0zUDejjQRjoHbmY + GHZ87yd2g81BMVhEXEnio + zboD7E0EEB3Sqv7Py2Fspia28ukOT4XC9DJtBJQNldROH + jNFR0XpeSf / inKr6Y3wrqqh2X1WXfCW7ncA2Vb366 / 7by6A + xR15wGBTZCio1cpcAXYdzPkT7JFnO0Wkra1C2vHeyfmQtv / 289NrZCssPkHPgyn4tXkL6paEkzTej / 5BZVEvTiH8HeRLXEa448SHL7 / QH8UU / hSElA20pERWovbbf4oK94mCqJTWfawGGlQKWE85oOyAltHK4Or34RURmCT5jtEx8RUyXheb4VnF7unCew2ec76fbtFRZooXLsclpxkOQbrXYnTX2T3wI0x4cvtZNlJ4THV51fMPC5EslO2WKOyHfwB70lvLsbIDCm7tYOdil9UeDniPyStIktYgsiBs7d1xVcMYYtYgtOXIrdgJY6XC7TuORy0s580f6m1L5jQ9FXTsrCJDUzfle / B59rDRAs + Vqu + C2pv + gGpzerubx7d7xiDFrOcpaD9M0 / 220uw + Lr89sAAAAASUVORK5CYII=";
        img.style.width = "35px";
        img.style.height = "35px";
        img.style.marginTop = "17px";
        img.style.marginLeft = "10px";
        img.style.cursor = "pointer";
        const iconPosition = document.querySelector("#form");
        iconPosition.insertAdjacentElement("afterend", img);

        //获取url的查询字符串
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const word = urlParams.get("wd");
        img.addEventListener("click", () => {
            window.location.assign("https://www.google.com/search?q=" + word);
        })
    //google跳转baidu
    } else if (window.location.href.includes("google")) {
        const img = document.createElement("img");
        img.src =
            "data: image / png; base64, iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEjklEQVR4nO1ZXWgcVRQepYggUpK9ZzdatSiI6INCKYgiKog / 4JOWioJSmz13tgnFn9oi9CWoWJ + qVTFFrAoVqVb0yReb7p6zTUorVagmaU0lWLuVVGurTbL5T0buTCeZTuZnZ3N3o5IPLsOwZ8493z0 / 9567hrGEJSxhwRBITwmkH4XkUedJTxr / FQjkTSDZ8g8h6cUg + QazYzlIel8gnxWSu4VZeNRYLDRm + VZAmggiAJLGU835W7zyqeauqwHpe5 / sFGT58UUhIJDfDTb + 4kB62yffHugtpDK0UlPdCYCkY1EEhOSeOdni3YA0HS5P2 + tOQCCNRBJAKnvIfh5NlvoXg0A5AYHfIsNN0vi / O4RCk51d2ZN1JyAkvxOTxDvmyPJfMR7YVQMTrctAcitI6hPIY4BUUMno / qrKpHJ9WEiIHN / sIdsd7YHCfdrNB + SX568qT6aRH5s1DOmFkJB4 / lJd9Eq4p / hr7cY35vavUEeDkNA4763bAvkJgXxUVSX1BJPXzluMVmoSks8EeOpUI9J12gmApM3RMctvJdWZXt95k11OkS6oRRDIu4VZvMb + Lbs / IyR / LJAHLi7cdyDpmQUQYIpJ0BOGJqxcR1eGVTSB / EZVStVhq9Iav1CApI0R1WnGWzg07rI8pouAQO6IKbGfJVYKSL0xOVAK + i5t8l2AvFcg / +IsgirB9F5UooLkUky4 / pqYgEqopKsikLc6Lg + UH0xn + cGQuYZjFmsqMYGMWbgzWmlhzSVGmPxcjBH25pY2Cw / 45wLkyehNjkcTE3AU045ghfSV2qVn5Uy6J + 6s48mdsw1m5w2 + ec7HfVMVAWWkvbJIJ + x + V7WAqlVso2WuRGbDwTQgn67EeI8nvjXW9lxR8TEDudOoCdqsy + MrSHy3BpK2x8huqYn9AnlbVca7w3SOHPYxA3kgRO6nzNPfXFUL47cGTehiz8GBCvKBRlTZVfpUmQXkD1Rf4OQTnVJHbP29chstC2vOkxIAJ77 / bMwduM2oB1LNXdeCpANRBiUlAE5V + 0OYxVU1Nb6pOb9SSP45zphqCIDjiaGgPUILVBw6MTk3Ydpka / MnfVZvadgKgksgjJB6d + HNCTDpEe0EhKR93skzJlt7D52xolANAXD2iHEwiw9pMx6w8LDf3Zt2981Ofuz0sLWuvcda8 + YP9lg4AbZ3XrfR0UCA9 / gnOHpy0J64PDZl3b7lUGQOVEMAHE + 8roWAXZd9yscmpu2J8z3nYpO4WgJCcrceAuo6xad8ZLwOBJCHdBGY11oe6b + QOIS + OPx7QgKkp2UF5CN + 5Rs / Ol5xEk9MzdjvoxPTVvu + kvXql / 32cPMoNAeQevUQkPyaX7naA7wrGASXwKdd0XIRIdSuhUDDs8Xrw26hX6pgI1vRUrR2dpSsv8uTCQjQTMqk1YYupJE2BJe62gwheaehGylZzMVdtegZtMvb8WmFE068zfmjjgadZpzOqX9XQFLevm7P0nrI5e9Qrabq2Ja3dDZksHhjKkv3g0ktanVVi6iuUoRzlzoEyMcB6UNhFu + tieFLWML / GP8AIbvkJsWNB1wAAAAASUVORK5CYII=";
        img.style.zIndex = "1000";
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.marginTop = "5px";
        img.style.marginLeft = "20px";
        img.style.cursor = "pointer";
        img.style.position = "absolute";
        img.style.left = "35%";
        const iconPosition = document.querySelector(".tsf");
        iconPosition.insertAdjacentElement("afterend", img);
        //获取url的查询字符串
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const q = urlParams.get("q");
        img.addEventListener("click", () => {
            window.location.assign("https://www.baidu.com/s?wd=" + q);
        })
    }
})();
