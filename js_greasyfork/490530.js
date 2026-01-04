// ==UserScript==
// @name            Scribd unblur and PDF download
// @description		Unblur scribd.com documents
// @namespace		http://userscripts.org/users/404262
// @author          Tom
// @version         1.2
// @match           http://*.scribd.com/doc/*
// @match           https://*.scribd.com/doc/*
// @match			http://*.scribd.com/document/*
// @match			https://*.scribd.com/document/*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/490530/Scribd%20unblur%20and%20PDF%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/490530/Scribd%20unblur%20and%20PDF%20download.meta.js
// ==/UserScript==


// Style do pokazania całego podglądu
GM_addStyle(".text_layer {	color: inherit !important; text-shadow: none !important; }");
GM_addStyle(".page-blur-promo {	display: none !important; }");
GM_addStyle(".page-blur-promo-overlay:parent {	display: none !important; }");
GM_addStyle(".absimg { opacity: 1.0 !important; }");
GM_addStyle(".page_missing_explanation { display: none !important; }");
GM_addStyle(".promo_div { display: none !important; }");
GM_addStyle(".autogen_class_views_pdfs_page_blur_promo { display: none !important; }");
GM_addStyle(".a { color: black !important; }");

// znalezienie skryptu dynamicznego dodawania stron, i pobieranie ich zawartości
var last = document.querySelector('.outer_page_container').children.length;
var tekst = document.querySelector('.outer_page_container').children[last-1].innerText;

const wyniki = [];
const regex = /contentUrl: "(.*?)"/g;
let match;
while ((match = regex.exec(tekst)) !== null) {
    // Dodaj znalezione wystąpienie do tablicy wyników (bez cudzysłowów)
    wyniki.push(match[1]);
}



// Tworzenie funkcji do wykonania żądania HTTP GET zwracającej promisę
function httpGet(url) {
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error('Nie można pobrać danych. Status: ' + xhr.status));
                }
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    });
}

document.getElementById('outer_page_2').innerHTML = '';

const delayBetweenRequests = 100; // 1 sekunda (1000 milisekund)
wyniki.forEach((link, index) => {
    setTimeout(() => {
        const url = link;
        httpGet(url)
            .then(response => {
            const regex = /callback\(\["(.*?)"\]\);/g;
            const match = regex.exec(response);
            if (match && match.length > 1) {
                let extractedData = match[1];

                // Usuń znaki nowej linii i escape
                extractedData = extractedData.replace(/\n/g, '').replace(/\\/g, '');

                // Dekodowanie encji HTML
                const tempDivElement = document.createElement('div');
                tempDivElement.innerHTML = extractedData;
                const decodedData = tempDivElement.textContent || tempDivElement.innerText || "";

                // Wstawienie danych jako innerHTML elementu
                document.getElementById('outer_page_2').innerHTML += decodedData;
            } else {
                console.error('Nie znaleziono pasującego fragmentu.');
            }
        })
            .catch(error => {
            console.error(error.message);
        });
    }, index * delayBetweenRequests);
});


// Funkcja do dekodowania encji HTML
function decodeEntities(encodedString) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}



function PrintElem(elem)
{
    var mywindow = window.open('https://www.scribd.com/document/', 'PRINT', 'height=400,width=600');
    mywindow.document.innerHTML = "";

    mywindow.document.write('<html><head><title>' + document.title + '</title></head><body>');
    mywindow.document.write(elem);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    return true;
}

// PrintElem(document.getElementById('page9').innerHTML.replaceAll('',',').replaceAll('','.'));