// ==UserScript==
// @name         TW captcha detektor
// @namespace    http://tampermonkey.net/
// @version      2024-02-29
// @description  tribal wars cz catcha detektor
// @author       LZ
// @match        https://greasyfork.org/en
// @match        *://*.divokekmeny.cz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490211/TW%20captcha%20detektor.user.js
// @updateURL https://update.greasyfork.org/scripts/490211/TW%20captcha%20detektor.meta.js
// ==/UserScript==

(function() {

    var h2Elements = document.getElementsByTagName("h2");
    for (var i = 0; i < h2Elements.length; i++) {
        if (h2Elements[i].textContent === "Zablokovaný požadavek") {
            // Set a timeout to reload the page after 3 seconds
            setTimeout(function() {
                window.location.reload();
            }, 3000);
            break; // Exit the loop once the matching <h2> is found
        }
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // Set the domain attribute to your main domain, prefixed with a dot
        // This makes the cookie accessible across all subdomains of divokekmeny.cz
        document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=.divokekmeny.cz";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    if (window.location.href.includes('https://www.divokekmeny.cz/')) {
        let remainingTime = 60; // Zbývající čas v sekundách

        // Najdeme první div s třídami "right" a "login"
        const targetDiv = document.querySelector('.right.login');

        // Vytvoříme nový div element s ID "refreshTimer" a textem uvnitř
        const newDiv = document.createElement('div');
        newDiv.id = 'refreshTimer';
        newDiv.class = 'worlds-container';
        newDiv.innerText = 'Čekání na přesměrování...';

        // Vložíme nově vytvořený div na začátek nalezeného divu
        if (targetDiv) {
            targetDiv.prepend(newDiv);
        } else {
            console.log('Cílový div nebyl nalezen.');
        }

        var redirectLogin = 'https://www.divokekmeny.cz/page/play/' + getCookie('lastServerCaptcha');

        // Funkce pro aktualizaci zobrazení zbývajícího času
        const updateTimerDisplay = () => {
            document.getElementById('refreshTimer').innerText = `Stránka se přesměruje za ${remainingTime} sekund. ${redirectLogin}`;
            remainingTime -= 1;
            if (remainingTime % 10 === 0) {
                var message = '${remainingTime}s. to login ' + getCookie('lastServerCaptcha');
                publishNotification(message, message);
            }
        };

        // Nastavíme interval pro pravidelnou aktualizaci času
        const countdownInterval = setInterval(() => {
            updateTimerDisplay();
            if (remainingTime <= 0) {
                clearInterval(countdownInterval); // Zastavíme interval, když dosáhneme 0
                window.location.href = redirectLogin;
            }
        }, 1000); // Aktualizace každou sekundu

        // Iniciální aktualizace zobrazení
        updateTimerDisplay();
    } else {

        const server = game_data == null ? null : game_data.world;
        console.log(server);
        const playerName = game_data == null ? null : game_data.player.name
        console.log(playerName);

        function publishNotification(title, body) {
            fetch('https://api.pushbullet.com/v2/pushes', {
                method: 'POST',
                headers: {
                    'Access-Token': 'o.TjbKhueXwz0Y6S7PdBNB4isX8RmkcW6f',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'note',
                    title: title,
                    body: body
                })
            }).then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));

            const webhookUrl = 'https://discord.com/api/webhooks/1218172450710356008/j5uBUYArnFnCJzryewRUGWPv4ie673g7UGc1MLw0Qmy1RMECztihanSFjCnd6b5S8D7i';
            const message = '@everyone Hello, Discord!';

            const data = {
                content: body,
                username: 'Captcha detektor' // Optional: Customize the sender's name
            };

            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.text())
                .then((text) => console.log(text))
                .catch((error) => console.error(error));


        }

        function extractSubdomainFromUrl(url) {
            // This regex now focuses on capturing the subdomain before ".divokekmeny.cz"
            // and makes the rest of the URL after the domain name optional
            // The "?" after "[^\.]+\.divokekmeny\.cz" makes the presence of "/game.php..." optional
            const regex = /https?:\/\/([^\.]+)\.divokekmeny\.cz(?:$|\/|\?)/;
            const match = url.match(regex);

            // If the URL matches the pattern, the subdomain is returned
            if (match && match[1]) {
                return match[1];
            } else {
                return 'No matching subdomain found';
            }
        }

        function handleCaptcha() {
            //var server = extractSubdomainFromUrl(window.location.href);
            localStorage.setItem('lastServerCaptcha', server);
            setCookie('lastServerCaptcha', server, 7); // Sets the cookie to expire in 7 days
            var message = 'Captcha detected ' + server + ' ' + playerName;
            publishNotification(message, message);
            setTimeout(function() {
                var message = 'Reloaded ' + window.location.href;
                publishNotification(message, message);
                location.reload();
            }, 60000); // 60000 milliseconds = 1 minute
        }

        function runScript() {
            // Získání všech elementů <h2> na stránce
            const h2Elements = document.querySelectorAll('h2');
            // Procházení všech <h2> elementů
            h2Elements.forEach((element) => {
                if (element.textContent === 'Ochrana proti Botu. ') {
                    handleCaptcha();
                }
            });
            // Získání všech elementů <div> s třídou "quest"
            const divElements = document.querySelectorAll('div.quest');
            // Procházení všech <div> elementů
            divElements.forEach((element) => {
                const dataTitle = element.getAttribute('data-title');
                if (dataTitle === 'Ochrana proti Botu. ') {
                    handleCaptcha();
                }
            });
        }

        runScript();
        setInterval(runScript, 5000); // Adjust the interval as per your requirement

        if (document.referrer === 'https://www.divokekmeny.cz/') {
            console.log('Referer: ' + document.referrer);
            function readUrls() {
                const urlsJson = localStorage.getItem('urlsList');
                return urlsJson ? JSON.parse(urlsJson) : [];
            }

            function openUrlsInNewWindows() {
                const urls = readUrls(); // Use your existing function to get the URLs
                urls.forEach((url, index) => {
                    // Define window features: width, height, and potentially position (left, top)
                    // Positioning each window slightly offset from the previous one if multiple URLs
                    const windowFeatures = `width=1400,height=1400,left=${100 + index * 300},top=${100 + index * 150}`;
                    window.open(url, `_blank${index}`, windowFeatures);
                    var message = 'Opened ' + url;
                    publishNotification(message, message);
                });
            }

            openUrlsInNewWindows();
        }

        setTimeout(function() {
            window.location.reload();
        }, 21 * 60 * 1000);
    }

})();
