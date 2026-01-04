// ==UserScript==
// @name         Enlarge MAL List/Search Thumbnails
// @version      0.4
// @description  Enlarges thumbnails on MAL profile lists and advanceded search results.
// @author       Lexick
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQRDic4ysC1kQAAA+lJREFUWMPtlk1sVFUUx3/n3vvmvU6nnXbESkTCR9DYCCQSFqQiMdEY4zeJuiBhwUISAyaIHzHGaDTxKyzEr6ULNboiRonRhQrRCMhGiDFGA+WjhQ4NVKbtzJuP9969Lt4wlGnBxk03vZv3cu495/7u/5x7cmX1xk8dczjUXG4+DzAPMA8AYNoNIunXudnZ2+enrvkvn2kADkhiiwM8o6YEEuLE4pxDK0GakZUIoiCOHXFiW2uNEqyjZdNaIbMB0Ero7gwQ4OJEDa0VSoR6lNDT5eMZRaUa0YgSjFZU6zG1ekK+y6er00eJECWWchiRMYp8VwBAOYyw1l0dQIlQrcfcvKSHT968j+5chg+/OMoHnx9FCdwzsIRdz24gGxhe2v0Le74/htaKFYvzbNm4knWrF3J9IYtSQq0e8+C2r+jwDXvefYjEWja98B2DQyU6fINty8cVCigl9HYHiMCOzWs4/HuR4XNl3n5mPbmsB0DgGyYrDR69ewXvvXgXgW+oNxLOX6ySJJaebp/+ZQWOD5fIZT2cS5WddRGCw9oU5rVtA1SqEfmcTxRZPE8RxZbe7oBXnlpH4BtGx0Ke2PkNt624jte3DzBWqjF4ZhzP6GYBOtw1qtC07Y2I0IgTisUKtyztBaB4voLWQl8hS1iLuL2/j0V9OQC+/fkkx4ZK3L9hGQt6Oyj0BCiR1qZpwV5dgRn7gBLh1Y8OcmpkAoDndv3E6IUQgCRx9BWy6b91bH64n7P7tvL8lrU4l/pOi6dSRZWSaShmJgDPKIbPTfLy+wdYfEMXB46M0JXLNE8ElWoEQK0e8/fJi8SJpa+QZemi7hmiOSphxESlQRRb/IzGKMHNBOCaJwTI53wOHhnBM5pCPqDRSFIHrTh1drzls/2Nffx18h+efGwV7+y8kyi2l+O5VKW1KxeycEEn2Q6PPwfHKE3WMVpwrg1AAK1TkaxzBBlDEGiSxLXsgW84cWacE2fGWX5TnnsHlnB8qEQ2SG+J1qnM0lTLaMVbO+5AJL2ijzy9l7FSDaMV4FIAh0MpoRxGfL1vECRtHiK0Gsj+w8OcHpmkeKFCWIv54dAQWx9fxfo1N/Lxl38wVJzgx1+HCGsx1XoMwN79gy1VfU9zujjB2dFJfE9dLtKpb0JrHeUwzW8u66Gm3N9yGJEkls6sR5I4+pcX2PTArez+7DcmK+lcWIsRgc5mzyhXoivSq5W0+klL9fZH6SWpL9VCy64ERLDW4lyaorAaE2Q0xihE0kqnmfepsaZSJPYanXCmjVt265rnaAKJkM9lsM7hXLPg2nyvFuuaALMdjumn+T9jzh8k8wDzAPMAcw7wLz7iq04ifbsDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA0LTE3VDE0OjM5OjU2LTA0OjAw6I0f5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wNC0xN1QxNDozOTo1Ni0wNDowMJnQp1gAAAAASUVORK5CYII=
// @run-at       document-idle
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @match        https://myanimelist.net/anime.php?*
// @match        https://myanimelist.net/manga.php?*
// @match        https://myanimelist.net/recommendations.php?s=*
// @match        https://myanimelist.net/anime/genre/*
// @match        https://myanimelist.net/manga/genre/*
// @grant        none
// @namespace https://greasyfork.org/users/248951
// @downloadURL https://update.greasyfork.org/scripts/378074/Enlarge%20MAL%20ListSearch%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/378074/Enlarge%20MAL%20ListSearch%20Thumbnails.meta.js
// ==/UserScript==

var globalWidth = 225;
var imgListLoaded = document.getElementsByClassName("lazyloaded");
var imgListLoad = document.getElementsByClassName("lazyload");
var i, imgSmall, imgLarge;

//Anime/Manga Search

if ((window.location.href.indexOf("https://myanimelist.net/anime.php?") > -1) || (window.location.href.indexOf("https://myanimelist.net/manga.php?") > -1 )){
    for (i = 0; i < imgListLoaded.length; i++) {
        imgSmall = imgListLoaded[i].getAttribute("data-src");
        if(imgSmall.indexOf("images/manga") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/manga/" + (imgSmall.slice(imgSmall.indexOf("images/manga")+13, imgSmall.indexOf(".webp"))) + ".jpg";
        } else if(imgSmall.indexOf("images/anime") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/anime/" + (imgSmall.slice(imgSmall.indexOf("images/anime")+13, imgSmall.indexOf(".webp"))) + ".jpg";
        }
        imgListLoaded[i].setAttribute("srcset", imgLarge);
        imgListLoaded[i].setAttribute("width", globalWidth);
        imgListLoaded[i].setAttribute("height", "auto");
    }
    for (i = 0; i < imgListLoad.length; i++) {
        imgSmall = imgListLoad[i].getAttribute("data-src");
        if(imgSmall.indexOf("images/manga") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/manga/" + (imgSmall.slice(imgSmall.indexOf("images/manga")+13, imgSmall.indexOf(".webp"))) + ".jpg";
        } else if(imgSmall.indexOf("images/anime") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/anime/" + (imgSmall.slice(imgSmall.indexOf("images/anime")+13, imgSmall.indexOf(".webp"))) + ".jpg";
        }
        imgListLoad[i].setAttribute("data-srcset", imgLarge);
        imgListLoad[i].setAttribute("width", globalWidth);
        imgListLoad[i].setAttribute("height", "auto");
    }
}

//Recommendations

if ((window.location.href.indexOf("https://myanimelist.net/recommendations.php?") > -1 )) {
    for (i = 0; i < imgListLoaded.length; i++) {
        imgSmall = imgListLoaded[i].getAttribute("data-src");
        if(imgSmall.indexOf("images/manga") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/manga/" + (imgSmall.slice(imgSmall.indexOf("images/manga")+13, imgSmall.indexOf("t.webp"))) + ".jpg";
        } else if(imgSmall.indexOf("images/anime") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/anime/" + (imgSmall.slice(imgSmall.indexOf("images/anime")+13, imgSmall.indexOf("t.webp"))) + ".jpg";
        }
        imgListLoaded[i].setAttribute("srcset", imgLarge);
        imgListLoaded[i].setAttribute("width", globalWidth);
        imgListLoaded[i].setAttribute("height", "auto");
    }
    for (i = 0; i < imgListLoad.length; i++) {
        imgSmall = imgListLoad[i].getAttribute("data-src");
        if(imgSmall.indexOf("images/manga") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/manga/" + (imgSmall.slice(imgSmall.indexOf("images/manga")+13, imgSmall.indexOf("t.webp"))) + ".jpg";
        } else if(imgSmall.indexOf("images/anime") > -1) {
            imgLarge = "https://cdn.myanimelist.net/images/anime/" + (imgSmall.slice(imgSmall.indexOf("images/anime")+13, imgSmall.indexOf("t.webp"))) + ".jpg";
        }
        imgListLoad[i].setAttribute("data-srcset", imgLarge);
        imgListLoad[i].setAttribute("width", globalWidth);
        imgListLoad[i].setAttribute("height", "auto");
    }
}

//Anime/Manga user lists

var listThumbs = document.getElementsByClassName("hover-info image");

if ((window.location.href.indexOf("https://myanimelist.net/mangalist/") > -1) || (window.location.href.indexOf("https://myanimelist.net/animelist/") > -1 )) {
    for(i = 0; i < listThumbs.length; i++) {
        listThumbs[i].setAttribute("style", "width: 225px; height: auto;");
    }
}

//Anime/Manga genre lists

if ((window.location.href.indexOf("https://myanimelist.net/anime/genre/") > -1) && (document.getElementsByClassName("btn-view-style js-btn-view-style list on").length > 0)) {
    for(i = 0; i < imgListLoaded.length; i++) {
        imgSmall = imgListLoaded[i].getAttribute('data-src');
        imgLarge = "https://cdn.myanimelist.net/" + (imgSmall.slice(imgSmall.indexOf("/images/anime"),imgSmall.indexOf(".webp"))) + ".jpg";
        imgListLoaded[i].width=globalWidth;
        imgListLoaded[i].setAttribute("srcset", imgLarge);
    }
    for(i = 0; i < imgListLoad.length; i++) {
        imgSmall = imgListLoad[i].getAttribute('data-src');
        imgLarge = "https://cdn.myanimelist.net/" + (imgSmall.slice(imgSmall.indexOf("/images/anime"),imgSmall.indexOf(".webp"))) + ".jpg";
        imgListLoad[i].width=globalWidth;
        imgListLoad[i].setAttribute("data-srcset", imgLarge);
    }
}

var imgListMangaGenre = document.getElementsByClassName("picSurround");

if ((window.location.href.indexOf("https://myanimelist.net/manga/genre/") > -1) && (document.getElementsByClassName("btn-view-style js-btn-view-style list on").length > 0)) {
    for(i = 0; i < imgListMangaGenre.length; i++) {
        imgSmall = imgListMangaGenre[i].getElementsByClassName("hoverinfo_trigger")[0].querySelector("img").getAttribute('src');
        imgLarge = "https://cdn.myanimelist.net/" + (imgSmall.slice(imgSmall.indexOf("/images/manga"),imgSmall.indexOf(".webp"))) + ".jpg";
        imgListMangaGenre[i].getElementsByClassName("hoverinfo_trigger")[0].querySelector("img").width=globalWidth;
        imgListMangaGenre[i].getElementsByClassName("hoverinfo_trigger")[0].querySelector("img").setAttribute("srcset", imgLarge);
    }
}