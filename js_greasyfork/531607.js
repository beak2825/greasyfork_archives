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
     
 
async function viewReactions(username) {
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
    const titleElements = wrapper.querySelectorAll('.size--all-xs.color--text-TranslucentSecondary.space--mt-1');
    titleElements.forEach(element => {
      titles.push(element.textContent);
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
          resultWindow.document.write(`
            <style>
              body { font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #f5f5f5; }
              .result-container { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .result-item { border-bottom: 1px solid #ddd; padding: 10px 0; display: flex; }
              .result-item:last-child { border-bottom: none; }
              .reactions { min-width: 100px; }
              .date { min-width: 150px; margin: 0 15px; }
              a { color: #2c7cbc; text-decoration: none; }
              a:hover { text-decoration: underline; }
              h2 { color: #2c7cbc; }
              .title { flex-grow: 1; }
            </style>
            <div class="result-container">
              <h2>Auswertung der Reactions für ${n}</h2>
              ${results.map(x => `
                <div class="result-item">
                  <span class="reactions">L:${x.l} F:${x.f} H:${x.h}${x.h > 2 ? "*" : ""}</span>
                  <span class="date">${x.date}</span>
                  <a href="${x.url}" target="_blank" class="title">${x.title}</a>
                </div>
              `).join('')}
              <h3>Zusammenfassung:</h3>
              <p>${results[results.length-1].date} - ${results[0].date}</p>
              <p>${results.length} Kommentare davon ${results.filter(x => x.l + x.f + x.h > 0).length} mit mindestens einer Reaction</p>
              <p>L:${results.reduce((a,c) => a + c.l, 0)} F:${results.reduce((a,c) => a + c.f, 0)} H:${results.reduce((a,c) => a + c.h, 0)} davon ${results.filter(x => x.h > 2).length} mit * (mindestens 3 Hilfreich-Bewertungen)</p>
            </div>
          `);
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
  resultWindow.document.write(`
    <style>
      body { font-family: Arial, sans-serif; font-size: 14px; color: #333; background-color: #f5f5f5; }
      .result-container { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .result-item { border-bottom: 1px solid #ddd; padding: 10px 0; display: flex; }
      .result-item:last-child { border-bottom: none; }
      .reactions { min-width: 100px; }
      .date { min-width: 150px; margin: 0 15px; }
      a { color: #2c7cbc; text-decoration: none; }
      a:hover { text-decoration: underline; }
      h2 { color: #2c7cbc; }
      .title { flex-grow: 1; }
      .checkbox-container { position: sticky; top: 0; background: white; padding: 10px; border-bottom: 1px solid #ddd; margin-bottom: 15px; }
    </style>
    <div class="result-container">
      <div class="checkbox-container">
        <h2>Auswertung der Reactions für ${n}</h2>
        <label><input type="checkbox" id="reactionsOnly" onclick="toggleReactionsOnly()"> Nur Kommentare mit Reactions anzeigen</label>
      </div>
      <div id="results-list">
        ${results.map(x => `
          <div class="result-item" data-reactions="${x.l+x.f+x.h}">
            <span class="reactions">L:${x.l} F:${x.f} H:${x.h}${x.h > 2 ? "*" : ""}</span>
            <span class="date">${x.date}</span>
            <a href="${x.url}" target="_blank" class="title">${x.title}</a>
          </div>
        `).join('')}
      </div>
      <h3>Zusammenfassung:</h3>
      <p>${results[results.length-1].date} - ${results[0].date}</p>
      <p>${results.length} Kommentare davon ${results.filter(x => x.l + x.f + x.h > 0).length} mit mindestens einer Reaction</p>
      <p>L:${results.reduce((a,c) => a + c.l, 0)} F:${results.reduce((a,c) => a + c.f, 0)} H:${results.reduce((a,c) => a + c.h, 0)} davon ${results.filter(x => x.h > 2).length} mit * (mindestens 3 Hilfreich-Bewertungen)</p>
    </div>
    <script>
      function toggleReactionsOnly() {
        const checkbox = document.getElementById('reactionsOnly');
        const items = document.querySelectorAll('.result-item');
        items.forEach(item => {
          if (checkbox.checked && item.getAttribute('data-reactions') == 0) {
            item.style.display = 'none';
          } else {
            item.style.display = 'flex';
          }
        });
      }
    </script>
  `);
}
