// ==UserScript==
// @name          BetterMeldesystem
// @namespace     https://admincalls-de.knuddels.de/ac/ac_login.pl
// @version       1.1.6
// @description   Modifiziert die Darstellung vom Meldesystem
// @author        Rho
// @license       Proprietary
// @match         https://admincalls-de.knuddels.de/ac/ac_getcase.pl*
// @match         https://admincalls-de.knuddels.de/ac/ac_overview.pl*
// @match         https://admincalls-de.knuddels.de/ac/ac_search.pl*
// @match         https://admincalls-de.knuddels.de/ac/ac_viewcase.pl*
// @grant         GM_xmlhttpRequest
// @connect       admincalls-de.knuddels.de
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/505773/BetterMeldesystem.user.js
// @updateURL https://update.greasyfork.org/scripts/505773/BetterMeldesystem.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function autoReloadPage() {
        setInterval(function() {
            location.reload();
        }, 50000);
    }
 
    if (window.location.href.includes("ac_getcase.pl")) {
        autoReloadPage();
    }
 
    function clickAllRelevantLinks() {
        let links = document.querySelectorAll('a[onclick*="borderize(this,0)"], a[onclick*="borderize(this,1)"]');
        links.forEach(function(link, index) {
            setTimeout(function() {
                link.click();
            }, index * 500);
        });
    }
 
    if (window.location.href.includes("ac_overview.pl") || window.location.href.includes("ac_search.pl")) {
        const headerRow = $('table tr').first();
        if (headerRow.length && !headerRow.find('th:contains("Accountnamen")').length) {
            headerRow.append('<th>Accountnamen</th>');
        }
 
        $('table tbody tr').each(function(index) {
            const row = $(this);
            const link = row.find('a.blind').attr('href');
 
            if (link) {
                const caseId = link.match(/id=(\d+)/)[1];
 
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://admincalls-de.knuddels.de/ac/' + link,
                    onload: function(response) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
 
                        let meldender = '';
                        let gemeldeter = '';
 
                        const meldenderAlt = doc.querySelector('h3 div[style*="float:left"] span[style*="color: #060"]');
                        const gemeldeterAlt = doc.querySelector('h3 div[style*="float:left"] span[style*="color: #900"]');
 
                        if (meldenderAlt && gemeldeterAlt) {
                            meldender = meldenderAlt.textContent.trim();
                            gemeldeter = gemeldeterAlt.textContent.trim();
                        }
 
                        if (!meldender || !gemeldeter) {
                            const contentText = doc.body.textContent;
                            const meldenderMatch = contentText.match(/Meldende\(r\):\s*([^\n]+)/);
                            const gemeldeterMatch = contentText.match(/Gemeldete\(r\):\s*([^\n]+)/);
 
                            if (meldenderMatch) {
                                meldender = meldenderMatch[1].trim();
                            }
                            if (gemeldeterMatch) {
                                gemeldeter = gemeldeterMatch[1].trim();
                            }
                        }
 
                        const backgroundColor = (index % 2 === 0) ? '#DDDDDD' : '#EEEEEE';
 
                        if (!row.find('td.nicknamen-column').length) {
                            row.append('<td class="nicknamen-column" style="background-color:' + backgroundColor + '"><span style="color: #060; font-weight: bold;">' + (meldender || 'Unbekannt') + '</span><br><span style="color: #900; font-weight: bold;">' + (gemeldeter || 'Unbekannt') + '</span></td>');
                        }
                    }
                });
            }
        });
    }
 
    function getMeldenderName() {
        let meldenderElement = document.querySelector('h3 div span[style*="font-weight:bold; color: #060"]');
        if (meldenderElement) {
            return meldenderElement.textContent.trim();
        }
        return null;
    }
 
    function highlightMeldenderInChat(meldenderName) {
        if (!meldenderName) return;
 
        let chatLines = document.querySelectorAll('#log0 p, #log1 p');
        chatLines.forEach(function(line) {
            let lineText = line.textContent.trim();
 
            if (lineText.includes("direkt an") || lineText.includes("Messenger --> Messenger")) {
                return;
            }
 
            const regex = new RegExp(`^${meldenderName}\\s*:`, 'i');
            if (regex.test(lineText)) {
                line.style.backgroundColor = '#fff9b1';
            }
        });
    }
 
    function clickBewertungLink() {
        let bewertungLink = document.querySelector('a[href="javascript:showInputs()"]');
        if (bewertungLink) {
            bewertungLink.click();
        }
    }
 
    function checkTypeconfirmCheckbox() {
        let checkbox = document.querySelector('input[type="checkbox"][name="typeconfirm"]');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
    }
 
    function enlargeCommentBoxIfRelevant() {
        const commentTextarea = document.getElementById("comment");
        if (commentTextarea) {
            commentTextarea.setAttribute("rows", "10");
        }
 
        const relevantHeaders = Array.from(document.querySelectorAll('h3')).find(h3 => {
            const divs = h3.querySelectorAll('div');
            return (
                divs.length >= 2 &&
                (divs[1].textContent.trim().startsWith('Extremistische Aussage melden') ||
                    divs[1].textContent.trim().startsWith('Alter / Geschlecht melden'))
            );
        });
 
        if (relevantHeaders && commentTextarea) {
            commentTextarea.setAttribute("rows", "30");
        }
    }
 
    function openVerlaengernInNewTab(url) {
        const newTab = window.open(url, '_blank');
        if (newTab) {
            setTimeout(() => {
                newTab.close();
            }, 100);
        }
    }
 
    function addVerlaengernLink() {
        if (window.location.href.includes("ac_viewcase.pl")) {
            const naviDiv = document.getElementById('navi');
            if (naviDiv) {
                const currentUrl = window.location.href;
                const verlaengernUrl = currentUrl.replace('ac_viewcase.pl', 'ac_needmoretime.pl');
                const verlaengernLink = document.createElement('a');
                verlaengernLink.href = verlaengernUrl;
                verlaengernLink.textContent = 'Verlängern';
 
                verlaengernLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    openVerlaengernInNewTab(verlaengernUrl);
                });
 
                naviDiv.appendChild(document.createTextNode(' | '));
                naviDiv.appendChild(verlaengernLink);
 
                setInterval(() => {
                    if (!document.body.innerText.includes('Meldung bereits bewertet') &&
                        !document.body.innerText.includes('Du hast nicht die erforderlichen Rechte, diese Meldung zu bearbeiten')) {
                        openVerlaengernInNewTab(verlaengernUrl);
                    }
                }, 300000);
            }
        }
    }
 
    function removeToplisteLink() {
        const naviDiv = document.getElementById('navi');
        if (naviDiv) {
            const toplisteLink = naviDiv.querySelector('a[href*="ac_admintoplist.pl"]');
            if (toplisteLink) {
                toplisteLink.previousSibling.remove();
                toplisteLink.remove();
            }
        }
    }
 
    function separateContentSections() {
        const contentDivs = document.querySelectorAll('.content-type-section');
        contentDivs.forEach(function(contentDiv) {
            const chatContent = [];
            const profileContent = [];
            const photoContent = [];
 
            const elements = contentDiv.querySelectorAll('p, img:not(:is([src*="knuddelscom.de"], [src*="knuddels.biz"], [src*="chat.knuddels.de"], [src*="api-de.knuddels.de"], [src*="knuddels-wiki.de"]))');
 
            elements.forEach(function(element) {
                const text = element.textContent ? element.textContent.trim().toLowerCase() : '';
                if (text.startsWith('profil-')) {
                    profileContent.push(element);
                } else if (contentDiv.querySelector('h4') && contentDiv.querySelector('h4').textContent.includes('Foto')) {
                    photoContent.push(element);
                } else {
                    chatContent.push(element);
                }
            });
 
            contentDiv.innerHTML = '';
 
            if (chatContent.length > 0) {
                const chatHeader = document.createElement('h4');
                chatHeader.textContent = 'Chatinhalte';
                contentDiv.appendChild(chatHeader);
                chatContent.forEach(element => contentDiv.appendChild(element));
            }
 
            if (profileContent.length > 0) {
                const profileHeader = document.createElement('h4');
                profileHeader.textContent = 'Profil';
                contentDiv.appendChild(profileHeader);
                profileContent.forEach(element => contentDiv.appendChild(element));
            }
 
            if (photoContent.length > 0) {
                const photoHeader = document.createElement('h4');
                photoHeader.textContent = 'Foto';
                contentDiv.appendChild(photoHeader);
                photoContent.forEach(element => contentDiv.appendChild(element));
            }
        });
    }
 
    window.addEventListener('load', function() {
        if (window.location.href.includes("ac_getcase.pl")) {
            autoReloadPage();
        }
 
        clickAllRelevantLinks();
        let meldenderName = getMeldenderName();
        highlightMeldenderInChat(meldenderName);
        clickBewertungLink();
        checkTypeconfirmCheckbox();
        enlargeCommentBoxIfRelevant();
        addVerlaengernLink();
        removeToplisteLink();
        separateContentSections();
    });
})();