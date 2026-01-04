// ==UserScript==
// @name         MyDealz Comment Viewer
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Zeigt die letzten Kommentare eines Benutzers an
// @author       MD928835
// @license      MIT
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Globale Funktion definieren
    window.viewUserComments = async function(username) {
        // SessionStorage für Kommentare leeren
        sessionStorage.removeItem('mydealz_comments');
 
        const fetchDealTitle = async (threadId) => {
            const query = `
            query getThread($filter: IDFilter!) {
                thread(threadId: $filter) {
                    title
                }
            }`;
 
            try {
                const response = await fetch("https://www.mydealz.de/graphql", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query,
                        variables: { filter: { eq: threadId } }
                    })
                });
 
                const result = await response.json();
                return result.data.thread.title || "Titel nicht verfügbar";
            } catch (error) {
                console.error(`Fehler beim Abrufen des Titels für threadId ${threadId}:`, error);
                return "Titel nicht verfügbar";
            }
        };
 
        try {
            // Profilseite abrufen
            const response = await fetch(`https://www.mydealz.de/profile/${username}?page=1`);
            if (!response.ok) throw new Error(`HTTP Fehler! Status: ${response.status}`);
            const html = await response.text();
 
            // Kommentar- und Thread-IDs extrahieren
            const pattern = /href=https:\/\/www\.mydealz\.de\/.*?-(\d+)#(?:comment|reply)-(\d+)/g;
            const matches_raw = [...html.matchAll(pattern)];
            const ids = matches_raw.map(match => ({
                threadId: match[1],
                commentId: match[2],
                url: match[0].replace('href=', '')
            }));

            // Mutable und isMuted Status abfragen
            const query = `query userProfile($username: String) {
                user(username: $username) {
                    mutable isMuted
                }
            }`;
            
            const userDataResponse = await fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables: { username }
                })
            });
            
            const userData = await userDataResponse.json();
            const { mutable, isMuted } = userData.data.user;

 
            // Parallelisierte Anfragen für Kommentare und Titel
            const fetchPromises = ids.map(async ({ threadId, commentId, url }) => {
                const commentQuery = `
                query comment($id: ID!) {
                    comment(id: $id) {
                        preparedHtmlContent
                        createdAt
                        createdAtTs
                    }
                }`;
 
                try {
                    const [commentResponse, title] = await Promise.all([
                        fetch("https://www.mydealz.de/graphql", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                query: commentQuery,
                                variables: { id: commentId }
                            })
                        }).then(res => res.json()),
                        fetchDealTitle(threadId)
                    ]);
 
                    const commentData = commentResponse?.data?.comment;
                    if (commentData) {
                        const comment = commentData.preparedHtmlContent.replace(/<img[^>]*>/g, '');
                        const date = new Date(commentData.createdAtTs * 1000)
                            .toLocaleString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                            .replace(',', '');
 
                        return {
                            html: `<div class="comment-card" style="background-color:white;padding:1rem;margin:0.75rem 0;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);"><span title="${date}">${commentData.createdAt}</span> <b>${title}</b><br>${comment}<br><svg width="15px" height="16px" class="icon icon--comment" style="vertical-align: middle"><use xlink:href="/assets/img/ico_632f5.svg#comment"></use></svg> <a href='${url}' target='_blank'>Zum Kommentar</a></div>`,
                            title,
                            comment,
                            dealId: threadId,
                            commentId
                        };
                    }
                } catch (error) {
                    console.error(`Fehler bei der Verarbeitung von commentId ${commentId}:`, error);
                    return null;
                }
            });
 
            const pageResults = (await Promise.all(fetchPromises)).filter(r => r);
 
            // Ergebnisse sicher in sessionStorage speichern
            sessionStorage.setItem('mydealz_comments', JSON.stringify(pageResults));
 
            // Popup anzeigen
            const resultWindow = window.open("", "Results", "width=1000,height=700,location=no,menubar=no,toolbar=no,status=no,titlebar=no");
            if (resultWindow) {
                resultWindow.document.write(`
<html>
<head>
  <title>${username}s letzte Kommentare</title>
  <style>
    body { margin: 0; padding: 0; background: #00a000; font-family: Arial, sans-serif; }
    .header { background: #00a000; height: 56px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; position: relative; }
    .logo { height: 40px; position: absolute; left: 20px; }
    .sort-options { text-align: center; padding: 10px; }
    .comments-container { margin: 20px; }
    .comment-card { background-color: white; padding: 1rem; margin: 0.75rem 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  </style>
  <script>
    function sortComments(type) {
      let comments = JSON.parse(sessionStorage.getItem('mydealz_comments'));
      if (type === 'all') {
        comments.sort((a, b) => b.commentId - a.commentId);
      } else {
        comments.sort((a, b) => b.dealId === a.dealId ? b.commentId - a.commentId : b.dealId - a.dealId);
      }
      document.getElementById('comments-container').innerHTML = comments.map(r => r.html).join('');
    }
  </script>
</head>
<body>
  <div class="header">
    <img src="https://www.mydealz.de/assets/img/logo/default-light_d4b86.svg" class="logo">
    <a href="https://www.mydealz.de/profile/${username}" style="color:white;text-decoration:none" target="_blank">${username}s letzte ${pageResults.length} Kommentare</a>
  </div>
 
  <div class="sort-options">
    Kommentare sortieren nach
    <label><input type="radio" name="sort" checked onclick="sortComments('all')"> alle chronologisch</label>
    <label><input type="radio" name="sort" onclick="sortComments('deal')"> beitragschronologisch</label>
  </div>
 
  <div id="comments-container" class="comments-container">
    ${pageResults.map(r => r.html).join('')}
  </div>

  <script>
// Mute-Funktionalität
let mutable = ${mutable};
let isMuted = ${isMuted};
const username = "${username}";
const muteBtn = document.getElementById('muteBtn');
const muteText = document.getElementById('muteText');
const muteIcon = document.getElementById('muteIcon');
muteBtn.addEventListener('click', function() {
const endpoint = isMuted ? "/profile/" + username + "/unmute" : "/profile/" + username + "/mute";

fetch(endpoint, {
  method: 'POST',
  headers: {
    'X-Request-Type': 'application/vnd.pepper.v1+json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Pepper-Txn': 'user.profile.overview',
    'X-XSRF-TOKEN': document.cookie.split('xsrf_t=')[1]?.split(';')[0]?.replace(/"/g, '')
  }
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    isMuted = !isMuted;
    muteText.textContent = username + ' ' + (isMuted ? 'nicht mehr stumm schalten' : 'stumm schalten');
    muteIcon.setAttribute('xlink:href', '/assets/img/ico_632f5.svg#' + (isMuted ? 'mute' : 'unmute'));
  }
})
.catch(error => console.error('Fehler:', error));
});
</script>
</body>
</html>`);
                resultWindow.document.close();
                resultWindow.focus();
            } else {
                alert("Popup blockiert!");
            }
        } catch (error) {
            console.error("Fehler:", error);
            alert(`Fehler: ${error.message}`);
        }
    };
})();

