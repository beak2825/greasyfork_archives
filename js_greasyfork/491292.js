// ==UserScript==
// @name         NAVAUTO
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Navega aleatoriamente por la web
// @author       Hector Luces
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491292/NAVAUTO.user.js
// @updateURL https://update.greasyfork.org/scripts/491292/NAVAUTO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de sitios web para navegar aleatoriamente
    var sitiosWeb = [
        "http://google.com",
        "http://facebook.com",
        "http://youtube.com",
        "http://baidu.com",
        "http://yahoo.com",
        "http://amazon.com",
        "http://wikipedia.org",
        "http://qq.com",
        "http://twitter.com",
        "http://slashdot.org",
        "http://google.co.in",
        "http://taobao.com",
        "http://live.com",
        "http://sina.com.cn",
        "http://yahoo.co.jp",
        "http://linkedin.com",
        "http://weibo.com",
        "http://ebay.com",
        "http://google.co.jp",
        "http://yandex.ru",
        "http://bing.com",
        "http://vk.com",
        "http://google.de",
        "http://instagram.com",
        "http://t.co",
        "http://msn.com",
        "http://amazon.co.jp",
        "http://tmall.com",
        "http://google.co.uk",
        "http://pinterest.com",
        "http://ask.com",
        "http://reddit.com",
        "http://wordpress.com",
        "http://mail.ru",
        "http://google.fr",
        "http://blogspot.com",
        "http://onclickads.net",
        "http://google.com.br",
        "http://tumblr.com",
        "http://apple.com",
        "http://google.ru",
        "http://aliexpress.com",
        "http://sohu.com",
        "http://microsoft.com",
        "http://imgur.com",
        "http://google.it",
        "http://imdb.com",
        "http://google.es",
        "http://netflix.com",
        "http://gmw.cn",
        "http://amazon.de",
        "http://fc2.com",
        "http://alibaba.com",
        "http://go.com",
        "http://stackoverflow.com",
        "http://ok.ru",
        "http://google.com.mx",
        "http://google.ca",
        "http://amazon.in",
        "http://google.com.hk",
        "http://amazon.co.uk",
        "http://craigslist.org",
        "http://rakuten.co.jp",
        "http://naver.com",
        "http://blogger.com",
        "http://google.com.tr",
        "http://flipkart.com",
        "http://espn.go.com",
        "http://soso.com",
        "http://outbrain.com",
        "http://nicovideo.jp",
        "http://google.co.id",
        "http://cnn.com",
        "http://xinhuanet.com",
        "http://dropbox.com",
        "http://google.co.kr",
        "http://googleusercontent.com",
        "http://github.com",
        "http://ebay.de",
        "http://bbc.co.uk",
        "http://google.pl",
        "http://google.com.au",
        "http://pixnet.net",
        "http://tradeadexchange.com",
        "http://popads.net",
        "http://ebay.co.uk",
        "http://dailymotion.com",
        "http://sogou.com",
        "http://adnetworkperformance.com",
        "http://adobe.com",
        "http://nytimes.com",
        "http://jd.com",
        "http://wikia.com",
        "http://adcash.com",
        "http://booking.com",
        "http://bbc.com",
        "http://coccoc.com",
        "http://dailymail.co.uk",
        "http://indiatimes.com",
        "http://dmm.co.jp",
        "http://chase.com",
        // Agrega más sitios web aquí
    ];

    // Función para obtener un sitio web aleatorio
    function obtenerSitioAleatorio() {
        return sitiosWeb[Math.floor(Math.random() * sitiosWeb.length)];
    }

    // Función para redireccionar a un sitio web aleatorio
    function navegarAleatoriamente() {
        var sitioAleatorio = obtenerSitioAleatorio();
        console.log("Navegando a: " + sitioAleatorio);
        window.location.href = sitioAleatorio;
    }

    // Redireccionar a un sitio web aleatorio después de un tiempo aleatorio
    var tiempoEspera = Math.floor(Math.random() * (30000 - 20000)) + 20000; // Entre 10 y 30 segundos
    console.log("Esperando " + (tiempoEspera / 1000) + " segundos antes de la próxima navegación...");
    setTimeout(navegarAleatoriamente, tiempoEspera);


})();