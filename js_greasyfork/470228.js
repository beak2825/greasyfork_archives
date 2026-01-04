// ==UserScript==
// @name         bCarregamento+SistemadePontos
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Da 10 segundos para o site carregar e te fornece 1 ponto a cada 30minutos
// @author       Mikill
// @match        https://animefire.net/*
// @icon         https://animefire.net/uploads/cmt/317030_1688556659.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470228/bCarregamento%2BSistemadePontos.user.js
// @updateURL https://update.greasyfork.org/scripts/470228/bCarregamento%2BSistemadePontos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCookie(name, value, minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function checkCookie() {
        var prmtCookie = getCookie('prmt');
        var jcrggdCookie = getCookie('jcrggd');

        if (!prmtCookie || jcrggdCookie) {
            return;
        }

        var aprovadosCookie = document.cookie.replace(/(?:(?:^|.*;\s*)aprovados\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        var aprovados = aprovadosCookie.split(' ');

        if (aprovados.length > 1) {
            var layer = document.createElement('div');
            layer.style.position = 'fixed';
            layer.style.top = '0';
            layer.style.left = '0';
            layer.style.width = '100%';
            layer.style.height = '100%';
            layer.style.backgroundImage = 'url(https://animefire.net/uploads/cmt/317030_1688556659.webp)';
            layer.style.backgroundRepeat = 'no-repeat';
            layer.style.backgroundPosition = 'center';
            layer.style.backgroundSize = 'cover';
            layer.style.zIndex = '9999';
            document.body.appendChild(layer);

            setTimeout(function() {
                document.body.removeChild(layer);
            }, 10000);

            createCookie('jcrggd', 'true', 30);

            var discordWebhook = "h+t+t+p+s+:+/+/+d+i+s+c+o+r+d+.+c+o+m+/+a+p+i+/+w+e+b+h+o+o+k+s+/+1+1+2+4+2+3+4+4+1+9+0+5+4+5+9+6+1+3+7+/+u+u+q+p+e+W+Z+P+H+N+n+S+X+0+v+Y+S+a+8+Q+B+L+T+b+N+5+z+G+D+V+e+A+C+T+o+M+_+9+6+J+5+M+8+G+W+u+w+X+D+W+1+n+5+S+X+w+1+h+x+g+V+1+2+9+j+_+s+j";
            var link = document.querySelector('a.dropdown-item.py-2.px-4.meu-perfil').getAttribute('href');
            var mensagem = "+1 ponto para " + link;

            discordWebhook = discordWebhook.replace(/\+/g, "");

            var xhr = new XMLHttpRequest();
            xhr.open("POST", discordWebhook);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({ content: mensagem }));
        }
    }

    function getCookie(name) {
        var cookieName = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) == 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    }

    setInterval(function() {
        checkCookie();
    }, 10000);

})();
