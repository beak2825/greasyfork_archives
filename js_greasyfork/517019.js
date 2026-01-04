// ==UserScript==
// @name         KHL tlačítko
// @namespace    http://example.com/
// @version      1.0
// @description  Volaný skript pro zobrazení KHL kalendáře s tlačítky
// @match        https://text.khl.ru/text/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517019/KHL%20tla%C4%8D%C3%ADtko.user.js
// @updateURL https://update.greasyfork.org/scripts/517019/KHL%20tla%C4%8D%C3%ADtko.meta.js
// ==/UserScript==

(function() {
    var calendarContent = responseStore['https://en.khl.ru/calendar/'];
    if (calendarContent) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = calendarContent;

        var calendaryContent = tempDiv.querySelector('main.calendary');

        if (calendaryContent) {
            document.body.innerHTML = calendaryContent.outerHTML;

            var gameLinks = document.querySelectorAll('a.card-game__hover-link');

            gameLinks.forEach(function(link) {
                if (link.href.includes('/preview/')) {
                    var href = link.getAttribute('href');
                    var matchID = href.split('/')[3];

                    var buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.justifyContent = 'center';
                    buttonContainer.style.alignItems = 'center';
                    buttonContainer.style.marginTop = '20px';
                    buttonContainer.style.padding = '15px';
                    buttonContainer.style.backgroundColor = '#f8f9fa';
                    buttonContainer.style.border = '1px solid #ddd';
                    buttonContainer.style.borderRadius = '8px';
                    buttonContainer.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

                    var button = document.createElement('button');
                    button.innerHTML = 'Go to Live Game ' + matchID;
                    button.className = 'btn btn-success';

                    button.style.backgroundColor = '#28a745';
                    button.style.color = '#fff';
                    button.style.border = 'none';
                    button.style.borderRadius = '5px';
                    button.style.padding = '10px 20px';
                    button.style.fontSize = '16px';
                    button.style.cursor = 'pointer';

                    button.addEventListener('mouseover', function() {
                        button.style.backgroundColor = '#218838';
                    });
                    button.addEventListener('mouseout', function() {
                        button.style.backgroundColor = '#28a745';
                    });

                    button.addEventListener('click', function() {
                        var liveURL = 'https://text.khl.ru/en/' + matchID + '.html';
                        history.pushState(null, '', liveURL);
                        console.log('Live URL přepnuto na: ' + liveURL);
                    });

                    buttonContainer.appendChild(button);

                    var parentElement = link.closest('.card-game');
                    if (parentElement) {
                        parentElement.parentNode.insertBefore(buttonContainer, parentElement.nextSibling);
                    }
                }
            });
        } else {
            console.error("Element 'main.calendary' nebyl nalezen.");
        }
    } else {
        console.error("Odpověď z 'https://en.khl.ru/calendar/' není k dispozici.");
    }
})();
