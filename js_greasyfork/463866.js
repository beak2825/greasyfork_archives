// ==UserScript==
// @name         Licytacje BW z automatem
// @namespace    http://tampermonkey.net/
// @version      0.1.13
// @description  Koloruje odpowiednio wiersze podczas aukcji itemów które są więcej warte jako "złom" :D
// @author       Varriz
// @match       r20.bloodwars.pl/?a=auction&do=itemlist*
// @match       r20.bloodwars.pl/?a=settings*
// @match       r20.bloodwars.pl/?a=auction&do=watched
// @grant       GM_getValue
// @grant       GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463866/Licytacje%20BW%20z%20automatem.user.js
// @updateURL https://update.greasyfork.org/scripts/463866/Licytacje%20BW%20z%20automatem.meta.js
// ==/UserScript==

//HackTimer
(function(s){var w,f={},o=window,l=console,m=Math,z='postMessage',x='HackTimer.js by turuslan: ',v='Initialisation failed',p=0,r='hasOwnProperty',y=[].slice,b=o.Worker;function d(){do{p=0x7FFFFFFF>p?p+1:0}while(f[r](p));return p}if(!/MSIE 10/i.test(navigator.userAgent)){try{s=o.URL.createObjectURL(new Blob(["var f={},p=postMessage,r='hasOwnProperty';onmessage=function(e){var d=e.data,i=d.i,t=d[r]('t')?d.t:0;switch(d.n){case'a':f[i]=setInterval(function(){p(i)},t);break;case'b':if(f[r](i)){clearInterval(f[i]);delete f[i]}break;case'c':f[i]=setTimeout(function(){p(i);if(f[r](i))delete f[i]},t);break;case'd':if(f[r](i)){clearTimeout(f[i]);delete f[i]}break}}"]))}catch(e){}}if(typeof(b)!=='undefined'){try{w=new b(s);o.setInterval=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2)};w[z]({n:'a',i:i,t:t});return i};o.clearInterval=function(i){if(f[r](i))delete f[i],w[z]({n:'b',i:i})};o.setTimeout=function(c,t){var i=d();f[i]={c:c,p:y.call(arguments,2),t:!0};w[z]({n:'c',i:i,t:t});return i};o.clearTimeout=function(i){if(f[r](i))delete f[i],w[z]({n:'d',i:i})};w.onmessage=function(e){var i=e.data,c,n;if(f[r](i)){n=f[i];c=n.c;if(n[r]('t'))delete f[i]}if(typeof(c)=='string')try{c=new Function(c)}catch(k){l.log(x+'Error parsing callback code string: ',k)}if(typeof(c)=='function')c.apply(o,n.p)};w.onerror=function(e){l.log(e)};l.log(x+'Initialisation succeeded')}catch(e){l.log(x+v);l.error(e)}}else l.log(x+v+' - HTML5 Web Worker is not supported')})('HackTimerWorker.min.js');

// Main function
(function() {
    'use strict';

    var id = location.host.split('.')[0];
    if (location.host.split('.')[2] == 'net') {
        id = id + 'en';
    }

    // --- flaga w GM: czy licytacje złomu są aktywne ---
    function isScrapAuctionsEnabled() {
        return !!GM_getValue(id + 'L_enabled', true);
    }

    // --- helper do włączania/wyłączania inputów w settings ---
    function updateScrapInputsState() {
        var enabled = isScrapAuctionsEnabled();
        ['L_zlomValue', 'L_progValue', 'L_colorValue'].forEach(function (inputId) {
            var el = document.getElementById(inputId);
            if (el) {
                el.disabled = !enabled;
            }
        });
    }

    var a = location.search;

    if (a == '?a=settings') {

        var contentMid = document.getElementById('content-mid');
        console.log(contentMid);
        if (contentMid) {
            var styleAttr = contentMid.getAttribute('style') || '';
            // szukamy min-height: Npx
            var newStyle = styleAttr.replace(/min-height\s*:\s*(\d+)px/i, function (match, numStr) {
                var num = parseInt(numStr, 10);
                if (isNaN(num)) return match;
                var bigger = num + 250;
                return 'min-height: ' + bigger + 'px';
            });

            // jeśli nie było w ogóle min-height w stylu, możesz ew. dopisać:
            if (newStyle === styleAttr) {
                // brak min-height, dopisujemy na końcu
                if (styleAttr && !/;\s*$/.test(styleAttr)) {
                    newStyle += ';';
                }
                newStyle += ' min-height: 400px;';
            }

            contentMid.setAttribute('style', newStyle);
        }

        var div = document.getElementsByClassName('hr720')[0];
        var scrapEnabled = isScrapAuctionsEnabled();

        var opcje = '<br /><br /><span style="color: #fff; text-shadow: 0px -1px 4px white, 0px -2px 10px yellow, 0px -10px 20px #ff8000, 0px -18px 40px red; font: 20px \'BlackJackRegular\'";>LicytacjeMOD made by Varriz</span><br /><br />';

        opcje += '<center><table width="90%" style="text-align: left; margin-top: 5px; font-family: \'Lucida Grande\', \'Lucida Sans Unicode\', Helvetica, Arial;">';

        // nowy checkbox master: Licytacje złomu
        opcje += '<tr><td>' +
                 '<input type="checkbox" id="L_enabled" ' +
                 (scrapEnabled ? 'checked="checked"' : '') +
                 '> Licytacje złomu' +
                 '</td></tr>';

        // pozostałe opcje (będą wyszarzane JS-em)
        opcje += '<tr><td>Ustaw cenę złomu w pr: <input type="text" id="L_zlomValue" value="' + GM_getValue(id + 'L_zlomValue', '100') + '"></td></tr>';
        opcje += '<tr><td>Ustaw próg podświetlania (0.8 -> 80% ceny rynkowej złomu w PLN): <input type="text" id="L_progValue" value="' + GM_getValue(id + 'L_progValue', '0.8') + '"></td></tr>';
        opcje += '<tr><td>Ustaw kolor podświetlania (nazwa po angielsku lub HEX): <input type="text" id="L_colorValue" value="' + GM_getValue(id + 'L_colorValue', 'red') + '"></td></tr>';
        opcje += '</table></center><BR><BR>';
        div.innerHTML += opcje;

        // delegacja change dla L_enabled na kontenerze
        div.addEventListener('change', function (e) {
            var target = e.target;
            if (!target || target.id !== 'L_enabled') return;

            var checked = !!target.checked;
            GM_setValue(id + 'L_enabled', checked);
            updateScrapInputsState();
        }, false);

        // zapis pozostałych ustawień (bez delegacji – zwykłe inputy)
        var zl = document.getElementById('L_zlomValue');
        if (zl) {
            zl.addEventListener('keyup', function () {
                GM_setValue(id + 'L_zlomValue', this.value);
            }, false);
        }

        var pr = document.getElementById('L_progValue');
        if (pr) {
            pr.addEventListener('keyup', function () {
                GM_setValue(id + 'L_progValue', this.value);
            }, false);
        }

        var col = document.getElementById('L_colorValue');
        if (col) {
            col.addEventListener('keyup', function () {
                GM_setValue(id + 'L_colorValue', this.value);
            }, false);
        }

        // na starcie wyszarzamy / odszarzamy inputy zgodnie z flagą
        updateScrapInputsState();

        document.getElementById('content-mid').style.minHeight = '1000px';
    }

    // --- logika licytacji złomu tylko gdy flaga włączona ---
    if (a == '?a=auction&do=itemlist' && isScrapAuctionsEnabled()) {

        var cenaZlomu = parseInt(GM_getValue(id + 'L_zlomValue', '100'));
        var prog = parseFloat(GM_getValue(id + 'L_progValue', '0.8'));
        var color = GM_getValue(id + 'L_colorValue', 'red');

        var rows = document.querySelectorAll(".auctionRow");
        rows.forEach(function (row, i) {
            var span = row.querySelector("td:nth-child(2) > span");
            var itemOnclickText = span.getAttribute('onclick');
            var isWinning = row.querySelector("td:nth-child(1)").innerHTML.indexOf('src="gfx/aubid.gif"') > -1;
            var rowBold = false;
            if (itemOnclickText && !isWinning) {
                var s = itemOnclickText.split("Cena sprzedaży:</b> ");
                if (s.length) {
                    var t = s[1].split(" PLN")[0];
                    span.textContent += " | " + t;

                    var pln = parseFloat(t.replace(/\s/g, ''));
                    var currentOffer = row.querySelector("td:nth-child(4)").innerText.replace(/\s/g, '');

                    if (currentOffer === "-brak-") currentOffer = 48; // trochę mniej niż połowa (50pr)
                    var prGiven = parseFloat(currentOffer);

                    var iloscZlomuZItema = pln / 20000;
                    var wartoscZlomu = iloscZlomuZItema * cenaZlomu;

                    if (wartoscZlomu * prog > prGiven) rowBold = true;
                }

                if (rowBold) {
                    row.style.backgroundColor = color;
                    row.classList.add('cheap');
                }
            }
        });

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }

        function buyTopJunk () {
            var firstJunkBuyBtn = document.querySelector('.cheap td:nth-child(7) img');
            if (firstJunkBuyBtn) {
                firstJunkBuyBtn.click();
                document.getElementById('bidBtn').click();
            } else location.reload();
        }

        let buying = localStorage.getItem("buyingOn");
        var runner;
        function autoBuyerToggle () {
            if (!buying || buying.toString() == "false") {
                localStorage.setItem("buyingOn", "true");
                document.getElementById('autoBuyBtn').value = "Zatrzymaj";
                buyTopJunk();
            }
            else {
                clearTimeout(runner);
                localStorage.setItem("buyingOn", "false");
                document.getElementById('autoBuyBtn').value = "Kupuj";
            }
        }

        // Select the container element
        var filterContainer = document.getElementsByClassName('itemFilterSelectContainer')[0];

        // Create a new button element
        var buyButton = document.createElement('input');

        // Set the attributes for the button
        buyButton.setAttribute('type', 'button');
        buyButton.setAttribute('class', 'button actionButton');
        buyButton.setAttribute('style', 'margin-left: 20px; margin-top: 7px;');
        buyButton.setAttribute('id', 'buyBtn');
        buyButton.setAttribute('value', 'Kup Złom');

        // Append the button to the container
        filterContainer.appendChild(buyButton);

        // Add an event listener to the button
        document.getElementById('buyBtn').addEventListener('click', function () {
            buyTopJunk();
        }, false);

        // Create a new button element
        var autoBuyButton = document.createElement('input');

        // Set the attributes for the button
        autoBuyButton.setAttribute('type', 'button');
        autoBuyButton.setAttribute('class', 'button actionButton');
        autoBuyButton.setAttribute('style', 'margin-left: 20px; margin-top: 7px;');
        autoBuyButton.setAttribute('id', 'autoBuyBtn');
        autoBuyButton.setAttribute('value', 'Kupuj');

        // Append the button to the container
        filterContainer.appendChild(autoBuyButton);

        // Add an event listener to the button
        document.getElementById('autoBuyBtn').addEventListener('click', function () {
            autoBuyerToggle();
        }, false);

        if (buying && buying.toString() == "true") {
            document.getElementById('autoBuyBtn').value = "Zatrzymaj";

            runner = setTimeout(()=> {
                buyTopJunk();
            }, getRandomInt(1500,2500));
        }

    }

    if (a == '?a=auction&do=watched') {

        // Helper function to parse the counter text into seconds
        function parseTimeToSeconds(time) {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        }

        function setLocationSelf() {
            window.location.href = window.location.href;
        }

        function getRandomInteger(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function buyNow(maxPrize) {
            var firstJunkBuyBtn = document.querySelector('tr.auctionRow > td:nth-child(7) > img');
            if (firstJunkBuyBtn) {
                firstJunkBuyBtn.click();
                let inputValue = document.getElementById("off_bid").value;
                if (inputValue && parseInt(inputValue) <= parseInt(maxPrize)) {
                    document.getElementById('bidBtn').click();
                }
                else setLocationSelf();
            } else setLocationSelf();
        }

        // Helper function to trigger buyNow with stored max prize
        function triggerBuyNow(rowId) {
            const maxPrize = GM_getValue(`maxLicytuj_${rowId}`, '');
            if (maxPrize) {
                buyNow(maxPrize); // Trigger the buyNow function with the saved max prize
            }
        }

        // Main function to evaluate each auction row
        function evaluateAuctionRows() {
            const rows = document.querySelectorAll('tr.auctionRow');

            rows.forEach(row => {
                const rowId = row.id;
                const counterSpan = row.querySelector('span[id*="aukcjaLicznik"]');
                const firstCell = row.querySelector('td:first-child');
                const hasImage = firstCell.querySelector('img') !== null;

                // Continue if there's no counter in this row
                if (!counterSpan) return;

                // Get the current counter time in seconds
                const counterTime = parseTimeToSeconds(counterSpan.textContent);

                // Case 0: Refresh the page form time to time
                if (counterTime > parseTimeToSeconds("00:03:40")) {
                    setTimeout(() => setLocationSelf(), getRandomInteger(120000, 180000));
                }

                // Case 1: Refresh the page at 00:03:36 if no image is in the first cell
                if (!hasImage && counterTime === parseTimeToSeconds("00:00:40")) {
                    setLocationSelf();
                }

                // Case 2: No image and counter is less than 00:00:38, call buyNow
                if (!hasImage && counterTime <= parseTimeToSeconds("00:00:33")) {
                    triggerBuyNow(rowId);
                }

                // Case 3: Image present and counter is less than 00:00:38, refresh
                if (hasImage && counterTime <= parseTimeToSeconds("00:00:38")) {
                    setTimeout(() => setLocationSelf(), getRandomInteger(1000, 3000));
                }
            });
        }

        // Add Max Licytuj input fields and set up value saving
        function addMaxLicytujInputs() {
            const auctionTable = document.querySelector('#content-mid > table');
            if (!auctionTable) return;

            const headerRow = auctionTable.querySelector('.tblheader');
            if (headerRow) {
                const maxLicytujHeader = document.createElement('td');
                maxLicytujHeader.textContent = 'Max licytuj';
                maxLicytujHeader.style.width = '100px';
                headerRow.appendChild(maxLicytujHeader);
            }

            const rows = auctionTable.querySelectorAll('tr.auctionRow');
            rows.forEach(row => {
                const rowId = row.id;
                const maxLicytujCell = document.createElement('td');
                const inputField = document.createElement('input');

                inputField.type = 'number';
                inputField.min = 0;
                inputField.placeholder = 'Max licytuj';
                inputField.style.width = '90%';

                const savedValue = GM_getValue(`maxLicytuj_${rowId}`, '');
                if (savedValue) {
                    inputField.value = savedValue;
                }

                inputField.addEventListener('input', () => {
                    GM_setValue(`maxLicytuj_${rowId}`, inputField.value);
                });

                maxLicytujCell.appendChild(inputField);
                row.appendChild(maxLicytujCell);
            });
        }

        // Initialize the script
        function initialize() {
            addMaxLicytujInputs();
            setInterval(() => {
                evaluateAuctionRows();
            }, 1000);
        }

        initialize();
    }
})();
