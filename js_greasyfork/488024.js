// ==UserScript==
// @name         Sukebetter-JS
// @version      0.61
// @description  An elegant tool to enjoy fc2hub/nyaa.si resources.
// @license      Apache-2.0
// @author       inewhero
// @grant        GM_xmlhttpRequest
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEU0lEQVR4nO2b34sbVRTHL6ylq/+AVXySCuIvRFvxB1qqCFWbnDOp8TU+9cUXxT/gnhMqpfYXK4hGn6yIulhxrRZFEMUH8Wf/CqkKzc65s9X60pGTzZbsNslOMnd+JMwXDoTJ5P745J577zlzx5hKlSpVqlSptIr32RvCmt0dBfbJKOCmQPtFNf2s1/S7uLm8YOZNcfPkjQJcc0inBfmCAP/nkONxpvcI0u8O+ZSgPRi37KKZVYVoHxKkdx1QuF3HE9iqIHXCut1jZkWubp8Q5G88dH64AX/tGvyYKavWgiO3OOQzgnQ1MwibgZy7HNjbTJkUYfsFTy4wscs4tI2i+2/iw50dgvRmAQC2jA5a0tWoEAh/HLQ3OaAvCodwzehzXaFyhyDAPxTf+c0mQN/lBiM+3NnhkL8sutOj3YTP5eImUoY5YVsYtJQphCjgZuGdTGwZrSaX6/bWgpbIKY26a027yzsIAfrQd2MF+F9B/kiAPtbPGbjI+963zc43BKQrIbYf3KhDP+s1z3VcFbCPegMh2cQOK9cBR17JwEW+8hZFOv8Q9N/qXA+cOlnU5SVqFQ2lZxyEIL+dCkLcsovrgc1sg9DVLtWOU3qZpQwaljcIrS/g56YG4ZBOzwsIh3xiahCCfGFuQAD/NhWEuLm84HtdLxKE9mWq7Lg02ndkOEyLcI04bNjbJwYRBvz0vIGIgJ+aGIQDPjRvIFydg4lBCFIrVaXAP0mdXuk9pAH6Z1oQ/d9qGa86oJ9Twm/lCwL4x8EskW5xNSyeHAR1B7fHWmYaGFOBcClcIwropa3laXQ5CGN7ENQdjE6v3QP8cq7JmjDFZCnAR4aWOQBjPIjhEPr3HMt1sgxrdncK14iiwN4zDsZoEKMhaJladq7LZ5xyQyVAf0fQvndY2Wtg7xego1uvO+DXw4D3DvuNa9g7Bfhi7hsqH1tsAf5r1MiIDyztTHJNpWUo2DRtcUi/miKDLhkzMhK1IeVIGABxvPAwXJD+jGrtuyet389I2PhD7LOlSMzIGDfJdiT0RkN3lNsllgC/46cxyWH4hdBzz7dMWoUB7/XVoA03cXV7Vx7usGGjluPC0/miI2PInOF7JPQM6LwXCCoH/LjXxq3DuBjV7H29Cowxq4F9wPdI6D3gQX7E+JRD+sA7DKQrAnxWkD5NcuxwcqP3TEaHxVb9NzYjA74U1V672WQhV7fPF97BhC4xVRJmEjnkN4ruaAI7ZbJWrMEY8NkSdHaUreR2wi7W89XI35fQJb7N/dx2fGBppyB9UhoIQJ/lfrxwUw6x4DmjNzECnSzFqw1uPb+Z/9IKfMkhgymT1pp2V16H0vt1nMlsn+BD+gqBHtfJbhTQeQnsw2ZWFNbtnn5W2oPLUFdDaY1HzKwqbtlFzQ7phKZ5wyQJ4f49v2h6TZCfSZ1UKaPi5vKCptX1RTadZPXpU++pGvChqM779btSrACVKlWqVKmSGaX/AeRFIB8LAoWuAAAAAElFTkSuQmCC
// @match        *://fc2hub.com/*
// @match        *://sukebei.nyaa.si/*
// @match        *://javball.com/*
// @match        *://ovabee.com/*
// @match        *://cnxx.me/*
// @match        *://ai18.pics/*
// @match        *://porn4f.com/*
// @match        *://idol69.net/*
// @match        *://cnpics.org/*
// @match        *://cosplay18.pics/*
// @match        *://pig69.com/*
// @match        *://imgair.net/*
// @match        *://cloudgallery.net/*
// @match        *://imgxkhm.buzz/*
// @match        *://pixlev.store/*
// @match        *://4fuk.me/*
// @match        *://555fap.com/*
// @match        *://kin8-av.com/*
// @match        *://javsunday.com/*
// @match        *://hentaipig.com/*
// @match        *://hentaicovid.com/*
// @connect      sukebei.nyaa.si
// @connect      javball.com
// @connect      ovabee.com
// @connect      cnxx.me
// @connect      ai18.pics
// @connect      porn4f.com
// @connect      idol69.net
// @connect      cnpics.org
// @connect      cosplay18.pics
// @connect      pig69.com
// @connect      imgair.net
// @connect      cloudgallery.net
// @connect      imgxkhm.buzz
// @connect      pixlev.store
// @connect      4fuk.me
// @connect      555fap.com
// @connect      kin8-av.com
// @connect      javsunday.com
// @connect      hentaipig.com
// @connect      hentaicovid.com
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1263683
// @downloadURL https://update.greasyfork.org/scripts/488024/Sukebetter-JS.user.js
// @updateURL https://update.greasyfork.org/scripts/488024/Sukebetter-JS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //sukebei.nyaa.si ad remove
    if (window.location.origin=='https://sukebei.nyaa.si') {
        let fcscripts = document.getElementsByTagName('script');
        for (let i = 0; i < fcscripts.length; i++) {
            if (fcscripts[i].attributes.src) {
                if (fcscripts[i].attributes.src.value.search(/min/i) == -1){
                    console.log('remove ad scripts: ' + fcscripts[i].attributes.src.value);
                    fcscripts[i].remove();
                }
            }
            else if (fcscripts[i].text) {
                if (fcscripts[i].text.search(/adConfig/i) != -1){
                    console.log('remove ad scripts: ' + fcscripts[i].text.value);
                    fcscripts[i].remove();
                }
            }
        }
        document.getElementById('e71bf691-4eb4-453f-8f11-6f40280c18f6').remove();
        console.log('* Banner ad is removed.');
        let wrapper_elements = document.getElementsByClassName('exo_wrapper');
        setTimeout(function() {
            while (wrapper_elements.length > 0){
                document.querySelector("body > style").remove();
                wrapper_elements[0].parentNode.removeChild(wrapper_elements[0]);
                console.log('* Toast ad is removed.');
            }
        }, 2000);

        //sukebei.nyaa.si stat
        if (!window.location.pathname.includes('view')){
            const thead = document.querySelector('body > div > div > div.table-responsive > table > thead');
            if (thead) {
                const newTh = document.createElement('th');
                newTh.style.width = 'auto';
                newTh.textContent = 'Top%';
                thead.querySelector('tr').appendChild(newTh);
            }

            const data = [];
            for (let i = 1; i <= 75; i++) {
                const selector = `body > div > div > div.table-responsive > table > tbody > tr:nth-child(${i}) > td:nth-child(8)`;
                const cell = document.querySelector(selector);
                if (cell) {
                    const value = parseInt(cell.textContent.trim(), 10);
                    if (!isNaN(value)) {
                        data.push(value);
                    }
                }
            }
            const average = data.reduce((sum, value) => sum + value, 0) / data.length;
            const variance = data.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / data.length;
            const stdDev = Math.sqrt(variance);

            const topPercentages = data.map(value => {
                let count = 0;
                data.forEach(v => {
                    if (v <= value) count++;
                });
                return (100-(count / data.length) * 100).toFixed(1);
            });

            for (let i = 1; i <= 75; i++) {
                const rowSelector = `body > div > div > div.table-responsive > table > tbody > tr:nth-child(${i})`;
                const row = document.querySelector(rowSelector);
                if (row) {
                    const cell = row.querySelector('td:nth-child(8)');
                    const value = parseInt(cell.textContent.trim(), 10);

                    if (value > average + stdDev) {
                        cell.style.backgroundColor = 'pink';
                    }
                    const newCell = document.createElement('td');
                    newCell.className = 'text-center';
                    newCell.textContent = topPercentages[i - 1] + '%';
                    row.appendChild(newCell);
                }
            }

            const statsDiv = document.createElement('div');
            statsDiv.style.position = 'fixed';
            statsDiv.style.right = '0px';
            statsDiv.style.top = '0px';
            statsDiv.style.zIndex = 1000;
            statsDiv.style.backgroundColor = 'white';
            statsDiv.style.border = '1px solid black';
            statsDiv.style.padding = '10px';
            statsDiv.style.font = '13px Arial';
            statsDiv.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';
            statsDiv.innerHTML = `
        <strong>M ± SD</strong><br>
        ${average.toFixed(2)} ± ${stdDev.toFixed(2)}<br>
        `;
            document.body.appendChild(statsDiv);
        }

        //sukebei.nyaa.si/view advance
        if (window.location.pathname.includes('view')) {

            //quick magnet button
            let magnet_addr = document.querySelector("body > div > div.panel.panel-success > div.panel-footer.clearfix > a.card-footer-item").href;
            let qMagnetButton = document.createElement('button');
            qMagnetButton.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD4UlEQVR4nO2bXagVVRSAtykVJJqWSUUPveRDgQ9R96WsHoJL1ztrnWhALLOiBF976AeCvdZcr1cUgvS+CFEhaHWVXqOwlOhJorIQ6iVETFEkZ+251yLLkX3tXI/Hzvyd45xzZ/YHGw6cNbN+9tpr7zmzjlIOR9+Ybmy5O96ob1V1xCBtFqRLBuh4ODKxTNUNATpskOPZ4ek1qm4I6rUC/LNB+jD2pxb22x7HIHNuWC+Jn9CLVB0JG/S8IF80SL+Fvl6u6oZB2lvJYjnj6XsM8PaoEaxLkptuBKsF6MfKFUsB+tjOqj0LiBesUnVDkA81UzsC/WSS7Omnd9wWa32TqmMADASvCvC/gnzMBkLVLQCCdHCuCKJ+TFWluEnmAGRfKvOquEllA4C9dcwFAOdZBhjgz5sGi8dDZckNDJHHT115zOU9SSe3Xss5HA5HaYjHQwI8KUi7UwfwZIj60RupwwDtCjF4+MZ4+z8I0Kmr5/P0Ici/q5wI8Ol8OuikKgtB+imPcXbk1ZH3/kV0FCZq6LsEgpcMBpuSR0UDkJXKBkA8HjLI76YVt+oGAK4UqLTiVtkAmIxKXQDQZUDslgC6GhC7IohuF4i72WncNojuHBAP1EFIbHfXf0pjFS/oKAf0z5xcjpeb9sfPvOlvbVJlYYCjpuIzvl6c5Zne9gRmvf/MyJZ789cAMqosBOlkU/H50bH7E+S+acqFEKzPfv/ghQIZcKJnDubp8QsberiTnAF+o2WGvsuyDKyMIP9QIABfq7IQ4Mk5xUBjneSi0fGVrctFgCbS7m3fLBfZAg3yzp472gnj6edaZzalyentNkM/ENx6x3Vya/WdBvijgs7b3oFnVVmEIxPLBOmvpvJoNHgwOaXps2uMBY4EeEqAaXYg7zdI00WdF+A///C3LVVlIkgHWlL70yTZ2Nc3C/L7xWc3bf3zflU2xtNrWgrQpbDBj6RdI6CfEaTvex4E4MfL8TphNxCgb7O2swrqBwzSawZJdz/7JVb/dqKGfkiA/r46E7RL5aTL1L9oGylVPxGgsWsNo80lBiBQ/Sb2pxbaNGytBwb5naRnhFa6qPxfDUzDxHnQtwvy0bbZ+STpOaFJwZk/Wvq2l4bxx1cYoCNtBeqE7RdMOgLnr/h0xOpSg8gZXy82wPuuN5x+EeTXL8DYfe3X5Nzu9mXJqr4jSBsF6GwHJ361p0CDtMMgv5VtvdNZ8YIX1Xwi9PVyAd5qkKWLSi+CND6v/1Z3blgvEQxeMUBfCtCFDE7PGOAvxKOX7bWqSsTD791i3ygL0AYD9KYgb7Nj9jPQBvudlem3nQ6Hqg+XAfS+Sf7v62oBAAAAAElFTkSuQmCC)';
            qMagnetButton.style.backgroundSize = 'contain';
            qMagnetButton.style.border = 'none';
            qMagnetButton.style.position = 'fixed';
            qMagnetButton.style.backgroundColor = 'transparent';
            qMagnetButton.style.backgroundRepeat = 'no-repeat';
            qMagnetButton.style.backgroundPosition = 'center';
            qMagnetButton.style.width = '50px';
            qMagnetButton.style.height = '50px';
            qMagnetButton.style.bottom = '450px';
            qMagnetButton.style.right = '50px';
            qMagnetButton.style.zIndex = '9999';
            qMagnetButton.addEventListener('click', function() {
                window.location.href = magnet_addr;
            });
            document.body.appendChild(qMagnetButton);

            //to top button
            let scrollToTopButton = document.createElement('button');
            scrollToTopButton.style.backgroundImage = 'url(data:image/png;base64,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)';
            scrollToTopButton.style.backgroundSize = 'contain';
            scrollToTopButton.style.border = 'none';
            scrollToTopButton.style.position = 'fixed';
            scrollToTopButton.style.backgroundColor = 'transparent';
            scrollToTopButton.style.backgroundRepeat = 'no-repeat';
            scrollToTopButton.style.backgroundPosition = 'center';
            scrollToTopButton.style.width = '50px';
            scrollToTopButton.style.height = '50px';
            scrollToTopButton.style.bottom = '300px';
            scrollToTopButton.style.right = '50px';
            scrollToTopButton.style.zIndex = '9999';
            scrollToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            document.body.appendChild(scrollToTopButton);

            //sukebei.nyaa.si thumbnails detect
            let thumbs = [];
            let detail_elements = document.getElementById('torrent-description').innerHTML;
            let thumb_regex = /<a href="([^"]+\_s.jpg)"[^>]*>/g;
            let thumb_addr;
            while ((thumb_addr = thumb_regex.exec(detail_elements)) != null) {
                thumbs.push(thumb_addr[1]);
            }

            //picture async load
            let thumb_parent = document.querySelector('#torrent-description > hr:nth-child(4) + p');
            thumbs.forEach(url => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: function(response) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response.responseText, 'text/html');
                        let realimg = doc.getElementsByTagName('meta')['twitter:image:src'].content;
                        let real_thumb = document.createElement('img');
                        real_thumb.src = realimg;
                        console.log('fetch thumb: ' + realimg);
                        thumb_parent.innerHTML = '';
                        thumb_parent.appendChild(real_thumb);
                    },
                    onerror: function(error) {
                        console.error('GET error: ', error);
                    }
                });
            });
        }
    }

    //fc2hub advance
    else if (window.location.origin=='https://fc2hub.com') {

        //modify .stretched-link::after via head
        let sl_style = document.createElement('style');
        sl_style.innerHTML='.stretched-link::after{position:static}';
        document.head.appendChild(sl_style);

        //get fc2 article code
        let hubcol = document.querySelector('.col-sm-12');
        let hubrow = hubcol.children[hubcol.childElementCount-2];
        let hubcards = hubrow.getElementsByClassName('card-title');
        let fc2code = [];
        for (let i = 0; i < hubcards.length; i++) {
            fc2code[i] = hubcards[i].innerText;
        }
        fc2code.forEach((code, index) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://sukebei.nyaa.si/?f=2&c=0_0&q=' + code,
                responseType: "blob",
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    let nyaa_addr = doc.querySelector('.table-responsive').childNodes[1].children[1].children[0].children[1].children[0].href;
                    nyaa_addr = nyaa_addr.replace(/https:\/\/fc2hub\.com/, 'https://sukebei.nyaa.si');
                    console.log('Nyaa.si included ' + code +' at: ' + nyaa_addr);

                    //add sukebei.nyaa.si <a> button
                    if (nyaa_addr != '') {
                        let nyaaButton = document.createElement('a');
                        nyaaButton.innerText = 'Nyaa';
                        nyaaButton.href = nyaa_addr;
                        nyaaButton.target = '_blank';
                        nyaaButton.className = 'btn btn-primary stretched-link';
                        hubcards[index].parentElement.appendChild(nyaaButton);
                    }
                },

                onerror: function(error) {
                    console.error('GET error: ', error);
                }
            });
        });

        //picture beds ad remove
    } else {
        let realimg = [];

        //uhaha servers
        if (document.getElementById('uhaha') != undefined) {
            let uhaha_realimg = document.querySelector("body > div.main-content-box > script:nth-child(3)").text;
            let uhaha_regex = /https:(.)+?jpg/g;
            realimg = uhaha_regex.exec(uhaha_realimg)[0];
        } else {

            //others
            realimg = document.getElementsByTagName('meta')['twitter:image:src'].content;
        }
        window.open(realimg,'_self');
    }

})();
