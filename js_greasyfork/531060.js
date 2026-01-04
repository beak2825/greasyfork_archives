function showCommentPopup(commentID) {
    let popup = document.getElementById('commentPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'commentPopup';
        popup.style.position = 'fixed';
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '12px';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '6px';
        popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        popup.style.zIndex = '9999';
        popup.style.maxWidth = '600px';
        popup.style.maxHeight = '400px';
        popup.style.overflow = 'auto';
        popup.style.display = 'none';
        document.body.appendChild(popup);
    }

    const fetchDealTitle = async (threadId) => {
        const query = `query getThread($filter: IDFilter!) { thread(threadId: $filter) { title } }`;
        try {
            const response = await fetch("https://www.mydealz.de/graphql", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ query, variables: { filter: { eq: threadId } } })
            });
            const result = await response.json();
            return result.data?.thread?.title || "Titel nicht verfügbar";
        } catch (e) {
            return "Titel konnte nicht geladen werden";
        }
    };

    async function fetchSingleComment(commentId) {
        const response = await fetch('https://www.mydealz.de/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                query: `query comment($id: ID!) { comment(id: $id) { preparedHtmlContent createdAtTs url user { username } } }`,
                variables: { id: commentId }
            })
        });
        return response.json();
    }

    async function loadAndShowComment() {
        try {
            popup.style.display = 'block';
            popup.innerHTML = '<em>Lade Kommentar...</em>';

            const commentResponse = await fetchSingleComment(commentID);
            const commentData = commentResponse.data.comment;
            const threadId = commentData.url.match(/-(\d+)#/)[1];
            const threadTitle = (await fetchDealTitle(threadId)).substring(0, 60);

            const commentDate = new Date(commentData.createdAtTs * 1000)
                .toLocaleString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                .replace(',', '');

            popup.innerHTML = `
                <div style="position:relative;">
                    <div style="background:#4CAF50; color:#fff; margin:-12px -12px 12px -12px; padding:8px 12px; border-radius:5px 5px 0 0;">
                        <button onclick="document.getElementById('commentPopup').style.display='none'" 
                                style="position:absolute; top:6px; right:12px; background:none; border:0; color:#fff; cursor:pointer; font-size:16px">
                            ×
                        </button>
                        <div style="font-size:14px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">
                            ${threadTitle}
                        </div>
                    </div>
                    
                    <div style="margin:0 8px;">
                        <div style="font-weight:bold; margin-bottom:8px; font-size:14px;">
                            @${commentData.user.username} am ${commentDate}
                        </div>
                        <div style="font-size:14px; line-height:1.4; margin-bottom:15px">
                            ${commentData.preparedHtmlContent}
                        </div>
                        <div style="text-align:right;">
                            <button onclick="window.open('${commentData.url}'); document.getElementById('commentPopup').style.display='none'"
                                    style="padding:6px 12px; background:#4CAF50; color:#fff; border:none; border-radius:4px; cursor:pointer">
                                Zum Kommentar
                            </button>
                        </div>
                    </div>
                </div>`;

            // Zentrierte Positionierung
            popup.style.left = `${(window.innerWidth - popup.offsetWidth)/2}px`;
            popup.style.top = `${(window.innerHeight - popup.offsetHeight)/2}px`;

        } catch (e) {
            popup.innerHTML = `<div style="color:#d00; padding:12px">Fehler: ${e.message}</div>`;
            popup.style.display = 'block';
        }
    }

    loadAndShowComment();

    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target)) popup.style.display = 'none';
    }, {once: true});
}
