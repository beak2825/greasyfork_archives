// ==UserScript==
// @name MyDealz Reactions Viewer 2025
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Zeigt die Reaktionen auf Kommentare eines Benutzers an
// @author MD928835
// @license MIT
// @match https://www.mydealz.de/profile/*
// @downloadURL https://update.greasyfork.org/scripts/528578/MyDealz%20Reactions%20Viewer%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/528578/MyDealz%20Reactions%20Viewer%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createProgressDialog(username, maxPages) {
      const dialog = document.createElement('div');
      dialog.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:9999; background:white; padding:20px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.3); width:450px;';
      
      dialog.innerHTML = `
        <h2 style="margin-top:0; border-bottom:1px solid #ddd; padding-bottom:10px;">Analysiere Kommentare von ${username}</h2>
        <div style="margin:10px 0;">
          <div id="progressText">Untersuche Aktivitätsseite auf Kommentare (1/${maxPages})</div>
          <div style="background:#eee; height:20px; border-radius:4px; margin:10px 0;">
            <div id="progressBar" style="background:#4CAF50; height:100%; width:0; border-radius:4px;"></div>
          </div>
          <div id="progressDetails" style="font-family:monospace; min-height:20px;"></div>
        </div>
        <div style="text-align:right; margin-top:15px;">
          <button id="cancelButton" style="background-color:#5cb85c; border:1px solid #4cae4c; color:white; padding:6px 12px; border-radius:4px; cursor:pointer;">Auswertung abbrechen</button>
        </div>
      `;
      
      document.body.appendChild(dialog);
      
      document.getElementById('cancelButton').addEventListener('click', () => {
        dialog.remove();
        window.stop();
        location.reload(true);
        return false;
      });
      
      let currentPageDots = 0;
      
      return {
        dialog,
        updateProgress: (currentPage) => {
          const percent = Math.min(((currentPage) / (maxPages + 1)) * 100, 100);
          document.getElementById('progressBar').style.width = `${percent}%`;
          document.getElementById('progressText').textContent = `Untersuche Aktivitätsseite auf Kommentare (${currentPage}/${maxPages})`;
          // Zurücksetzen der Punkte bei neuer Seite
          document.getElementById('progressDetails').textContent = '';
          currentPageDots = 0;
        },
        addProgressDetail: (type) => {
          if (currentPageDots >= 20) return; // Maximal 20 Punkte pro Seite
          
          const details = document.getElementById('progressDetails');
          details.textContent += type === 'wait' ? 'W' : '.';
          currentPageDots++;
        }
      };
    }

    // Funktion global verfügbar machen
    window.viewReactions = async function(username) {
      function checkPopups() {
        const popup = window.open(null, '_blank', 'width=100,height=100');
        if (!popup || popup.closed) {
          alert("Bitte PopUps für diese Seite erlauben und erneut versuchen.");
          return false;
        }
        popup.close();
        return true;
      }
      
      if (!checkPopups()) return;
      
      let stopProcessing = false;
      const YEAR_IN_MS = 365 * 864e5;
      const n = username;
      let p = 0;
      const results = [];
      
      async function fetchWithRetry(url, options, maxRetries = 5) {
        for (let i = 0; i < maxRetries; i++) {
          if (stopProcessing) return null;
          try {
            const response = await fetch(url, options);
            if (response.status === 429) {
              progressUI.addProgressDetail('wait');
              if (i === maxRetries - 1) {
                alert("Der Server ist zur Zeit überlastet. Bitte später erneut versuchen.");
                progressUI.dialog.remove();
                window.stop();
                location.reload(true);
                return null;
              }
              await new Promise(t => setTimeout(t, 5000));
              continue;
            }
            return response;
          } catch (e) {
            if (i === maxRetries - 1) {
              progressUI.dialog.remove();
              throw e;
            }
          }
        }
        return null;
      }
      
      const firstPageResponse = await fetchWithRetry(`https://www.mydealz.de/profile/${n}?page=1`);
      if (!firstPageResponse) return;
      const firstPageHtml = await firstPageResponse.text();
      
      if (p === 0) {
        const match = firstPageHtml.match(/window\.__INITIAL_STATE__.*?"lastPage":(\d+)/);
        p = match ? parseInt(match[1]) : 1;
      }
      
      const progressUI = createProgressDialog(username, p);
      
      for (let i = 1; i <= p; i++) {
        if (stopProcessing) break;
        
        const pageResponse = i === 1 ? 
          { text: () => firstPageHtml } : 
          await fetchWithRetry(`https://www.mydealz.de/profile/${n}?page=${i}`);
        
        if (!pageResponse) break;
        const pageText = await pageResponse.text();
        progressUI.updateProgress(i);
        
        const matches = [...pageText.matchAll(/href=(https:\/\/www\.mydealz\.de\/.*?-(\d+)#(?:comment|reply)-(\d+))/g)];
        const wrapper = document.createElement('div');
        wrapper.innerHTML = pageText;
        
        const titles = [];
        wrapper.querySelectorAll('.userHtml').forEach(e => {
          if (e.textContent.includes('kommentiert')) {
            const strong = e.querySelector('strong');
            if (strong) titles.push(strong.textContent);
          }
        });
        
        for (let j = 0; j < matches.length; j++) {
          if (stopProcessing) break;
          
          const match = matches[j];
          try {
            const reactionsResponse = await fetchWithRetry("https://www.mydealz.de/graphql", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `query commentReactions($commentId:ID!){commentReactions(commentId:$commentId){counts{type count}}}`,
                variables: { commentId: match[3] }
              })
            });
            
            if (!reactionsResponse) break;
            progressUI.addProgressDetail('comment');
            
            const reactionsData = await reactionsResponse.json();
            const counts = reactionsData.data.commentReactions.counts;
            const likes = counts.find(x => x.type === "LIKE")?.count || 0;
            const funny = counts.find(x => x.type === "FUNNY")?.count || 0;
            const helpful = counts.find(x => x.type === "HELPFUL")?.count || 0;
            
            const commentDateResponse = await fetchWithRetry("https://www.mydealz.de/graphql", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: 'query comment($id:ID!){comment(id:$id){createdAt}}',
                variables: { id: match[3] }
              })
            });
            
            if (!commentDateResponse) break;
            
            const createdAt = (await commentDateResponse.json()).data.comment.createdAt;
            
            if (new Date(createdAt).getTime() < Date.now() - YEAR_IN_MS) {
              progressUI.dialog.remove();
              const resultWindow = window.open("", "", "width=800,height=600");
              resultWindow.document.write(`<style>.hidden{display:none;}.comment-line{line-height:1;}</style><script>function toggleReactionsOnly(){const c=document.getElementById('reactionsOnly');Array.from(document.getElementsByClassName('comment-line')).forEach(e=>{e.classList.toggle('hidden',c.checked&&e.getAttribute('data-reactions')==0);})}</script><pre><div style="position:sticky;top:0;background:white;padding:5px;border-bottom:1px solid #ccc">Auswertung der Reactions für ${n}<label><input type="checkbox" id="reactionsOnly" onclick="toggleReactionsOnly()"> Nur Kommentare mit Reactions anzeigen</label></div>${results.map(x=>`<div class="comment-line" data-reactions="${x.l+x.f+x.h}"><a href="${x.url}" target="_blank">${x.url}</a>${x.isReply?' ':''}  L:${x.l} F:${x.f} H:${x.h}${x.h>2?"*":""} ${x.date} ${x.title}</div>`).join('')}\n\nZusammenfassung:\n${results[results.length-1].date} - ${results[0].date}\n${results.length} Kommentare davon ${results.filter(x=>x.l+x.f+x.h>0).length} mit mindestens einer Reaction\nL:${results.reduce((a,c)=>a+c.l,0)} F:${results.reduce((a,c)=>a+c.f,0)} H:${results.reduce((a,c)=>a+c.h,0)} davon ${results.filter(x=>x.h>2).length} mit * (mindestens 3 Hilfreich-Bewertungen)</pre>`);
              return;
            }
            
            const elementType = match[1].includes('#reply-') ? 'reply' : 'comment';
            const url = `https://www.mydealz.de/${match[2]}#${elementType}-${match[3]}`;
            
            results.push({
              url: url,
              id: match[3],
              l: likes,
              f: funny,
              h: helpful,
              date: createdAt,
              title: titles[j] || '',
              isReply: elementType === 'reply'
            });
            
          } catch (e) {
            if (e.response?.status === 429) {
              await new Promise(resolve => setTimeout(resolve, 5000));
              j--;
              continue;
            }
            console.error(e);
          }
        }
        
        if (i < p) await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      progressUI.dialog.remove();
      const resultWindow = window.open("", "", "width=800,height=600");
      resultWindow.document.write(`<style>.hidden{display:none;}.comment-line{line-height:1;}</style><script>function toggleReactionsOnly(){const c=document.getElementById('reactionsOnly');Array.from(document.getElementsByClassName('comment-line')).forEach(e=>{e.classList.toggle('hidden',c.checked&&e.getAttribute('data-reactions')==0);})}</script><pre><div style="position:sticky;top:0;background:white;padding:5px;border-bottom:1px solid #ccc">Auswertung der Reactions für ${n}<label><input type="checkbox" id="reactionsOnly" onclick="toggleReactionsOnly()"> Nur Kommentare mit Reactions anzeigen</label></div>${results.map(x=>`<div class="comment-line" data-reactions="${x.l+x.f+x.h}"><a href="${x.url}" target="_blank">${x.url}</a>${x.isReply?' ':''}  L:${x.l} F:${x.f} H:${x.h}${x.h>2?"*":""} ${x.date} ${x.title}</div>`).join('')}\n\nZusammenfassung:\n${results[results.length-1].date} - ${results[0].date}\n${results.length} Kommentare davon ${results.filter(x=>x.l+x.f+x.h>0).length} mit mindestens einer Reaction\nL:${results.reduce((a,c)=>a+c.l,0)} F:${results.reduce((a,c)=>a+c.f,0)} H:${results.reduce((a,c)=>a+c.h,0)} davon ${results.filter(x=>x.h>2).length} mit * (mindestens 3 Hilfreich-Bewertungen)</pre>`);
    };

    // Füge Button zur Profilseite hinzu, aber nur wenn wir auf einer Profilseite sind
    if (window.location.pathname.startsWith('/profile/')) {
      const username = window.location.pathname.split('/')[2];
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'margin-top:10px;';
      
      const button = document.createElement('button');
      button.id = 'showReactionsButton';
      button.textContent = 'Reactions anzeigen';
      button.style.cssText = 'background-color:#5cb85c; border:1px solid #4cae4c; color:white; padding:6px 12px; border-radius:4px; cursor:pointer;';
      
      buttonContainer.appendChild(button);
      
      const targetElement = document.querySelector('.userProfile-header');
      if (targetElement) {
        targetElement.appendChild(buttonContainer);
      }
      
      document.getElementById('showReactionsButton')?.addEventListener('click', () => {
        window.viewReactions(username);
      });
    }
})();
