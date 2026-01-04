// ==UserScript==
// @name         Instagram Deşifre - Gelişmiş Unfollowers Tespiti
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Hedef hesabın takip ettiklerini ve takipçilerini iki ayrı görevle, yavaş ve güvenli bir şekilde tarar, karşılaştırır ve takipten çıkanları bulur. Rate limit'e takılmamak için durdur/devam et özelliğini destekler.
// @author       harbidenfurkan'ın isteği üzerine yapay zeka tarafından geliştirildi.
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/542168/Instagram%20De%C5%9Fifre%20-%20Geli%C5%9Fmi%C5%9F%20Unfollowers%20Tespiti.user.js
// @updateURL https://update.greasyfork.org/scripts/542168/Instagram%20De%C5%9Fifre%20-%20Geli%C5%9Fmi%C5%9F%20Unfollowers%20Tespiti.meta.js
// ==/UserScript==

//                                      PLEASE RESPECT IF MY SCRIPTS USEFUL FOR YOU
//                      DON'T TRY TO COPY PASTE MY SCRIPTS THEN SHARE TO OTHERS LIKE YOU ARE THE CREATOR
//                                               THANKS FOR YOUR SUPPORT

(function() {
    'use strict';

    // --- AYARLAR ---
    const MIN_DELAY_MS = 3000;
    const MAX_DELAY_MS = 6000;
    const BIG_DELAY_MS = 15000;
    const REQUEST_COUNT_FOR_BIG_DELAY = 10;
    const APP_ID = '936619743392459';

    // --- DÜZELTİLMİŞ QUERY HASH'LER ---
    // "Takipçileri Getir" için (Bu zaten çalışıyordu)
    const FOLLOWERS_QUERY_HASH = 'c76146de99bb02f6415203be841dd25a';
    // "Takip Edilenleri Getir" için sizin sağladığınız örnekten alınan, test edilmiş ve çalışan HASH
    const FOLLOWING_QUERY_HASH = '58712303d941c6855d4e888c5f0cd22f';


    // --- ARAYÜZ OLUŞTURMA ---
    GM_addStyle(`
        #desifre-panel {
            position: fixed;
            bottom: 15px;
            right: 15px;
            width: 380px;
            background-color: #1e1e1e;
            border: 1px solid #333;
            border-radius: 12px;
            z-index: 9999;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            transition: all 0.3s ease-in-out;
            overflow: hidden;
        }
        #desifre-panel.minimized {
            width: 50px;
            height: 50px;
            cursor: pointer;
        }
        #desifre-header {
            background-color: #333;
            padding: 10px 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        #desifre-header .title-icon { font-size: 18px; margin-right: 8px; }
        #desifre-body { padding: 15px; }
        #desifre-body.hidden { display: none; }
        #desifre-panel input[type="text"] {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #555;
            background-color: #2a2a2a;
            color: #fff;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
        #desifre-panel button {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 5px;
        }
        .btn-primary { background-color: #0095f6; color: white; }
        .btn-primary:hover { background-color: #007ac1; }
        .btn-secondary { background-color: #555; color: white; }
        .btn-secondary:hover { background-color: #666; }
        .btn-success { background-color: #4CAF50; color: white; }
        .btn-success:hover { background-color: #45a049; }
        .btn-danger { background-color: #f44336; color: white; }
        .btn-danger:hover { background-color: #da190b; }
        .btn-ghost { background-color: transparent; border: 1px solid #555; color: #fff; }
        .btn-ghost:hover { background-color: #333; }
        #desifre-status {
            margin-top: 15px;
            padding: 10px;
            background-color: #2a2a2a;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.5;
            min-height: 50px;
            word-wrap: break-word;
        }
        #desifre-results {
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #333;
            border-radius: 6px;
        }
        #desifre-results ul { list-style: none; padding: 0; margin: 0; }
        #desifre-results li {
            padding: 8px 12px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #desifre-results li:last-child { border-bottom: none; }
        #desifre-results a { color: #0095f6; text-decoration: none; font-weight: 500; }
        .progress-container {
            width: 100%; background-color: #333; border-radius: 6px; margin-top: 10px; overflow: hidden;
        }
        .progress-bar {
            width: 0%; height: 8px; background-color: #4CAF50; transition: width 0.3s;
        }
        .minimize-btn {
            cursor: pointer; font-weight: bold; font-size: 20px;
        }
    `);

    const panel = document.createElement('div');
    panel.id = 'desifre-panel';
    panel.innerHTML = `
        <div id="desifre-header">
            <div><span class="title-icon">🕵️</span><span>Instagram Deşifre</span></div>
            <span class="minimize-btn">-</span>
        </div>
        <div id="desifre-body">
            <input type="text" id="target-username" placeholder="Hedef kullanıcı adı (örn: harbidenfurkan)">
            <div id="controls">
                <button id="fetch-followers-btn" class="btn-primary">1. Takipçileri Getir</button>
                <button id="fetch-following-btn" class="btn-primary">2. Takip Edilenleri Getir</button>
                <button id="compare-btn" class="btn-success">3. Karşılaştır ve Unfollower'ları Bul</button>
                <button id="stop-btn" class="btn-danger" style="display:none;">Durdur</button>
            </div>
            <div id="desifre-status">
                <strong>Durum:</strong><span id="status-text"> Bekliyor...</span>
                <div class="progress-container"><div id="progress-bar" class="progress-bar"></div></div>
            </div>
            <div id="results-container" style="display:none;">
                <p><strong><span id="results-count">0</span> kişi sizi takip etmiyor:</strong> <button id="copy-results-btn" class="btn-ghost">Listeyi Kopyala</button></p>
                <div id="desifre-results"><ul></ul></div>
            </div>
            <button id="reset-btn" class="btn-secondary">Tüm Verileri Sıfırla</button>
        </div>
    `;
    document.body.appendChild(panel);

    const targetUsernameInput = document.getElementById('target-username');
    const fetchFollowersBtn = document.getElementById('fetch-followers-btn');
    const fetchFollowingBtn = document.getElementById('fetch-following-btn');
    const compareBtn = document.getElementById('compare-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress-bar');
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    const resultsList = document.querySelector('#desifre-results ul');
    const copyResultsBtn = document.getElementById('copy-results-btn');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const deşifreBody = document.getElementById('desifre-body');
    const deşifreHeader = document.getElementById('desifre-header');

    let state = { isRunning: false, targetUserId: null, targetUsername: '', currentTask: null };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const randomDelay = () => Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
    const log = (message) => {
        console.log(`[Deşifre] ${message}`);
        statusText.innerHTML = ` ${message}`;
    };
    const updateProgress = (current, total) => {
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
    };
    const showStopButton = (show) => {
        stopBtn.style.display = show ? 'block' : 'none';
        [fetchFollowersBtn, fetchFollowingBtn, compareBtn].forEach(btn => btn.style.display = show ? 'none' : 'block');
    };

    async function getUserId(username) {
        try {
            const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
                headers: { 'x-ig-app-id': APP_ID }
            });
            if (!response.ok) throw new Error(`Kullanıcı profili alınamadı: ${response.status}`);
            const data = await response.json();
            if (data?.data?.user?.id) {
                return data.data.user.id;
            }
            throw new Error('Kullanıcı ID bulunamadı.');
        } catch (error) {
            Swal.fire('Hata!', `"${username}" kullanıcısı bulunamadı veya profil gizli. Lütfen kontrol edin.`, 'error');
            return null;
        }
    }

    async function fetchList(type) {
        if (state.isRunning) return;

        state.targetUsername = targetUsernameInput.value.trim();
        if (!state.targetUsername) {
            Swal.fire('Eksik Bilgi', 'Lütfen bir hedef kullanıcı adı girin.', 'warning');
            return;
        }

        state.isRunning = true;
        state.currentTask = type;
        showStopButton(true);
        log('Başlatılıyor...');

        const cachedUserId = await GM_getValue(`userid_${state.targetUsername}`);
        state.targetUserId = cachedUserId || await getUserId(state.targetUsername);

        if (!state.targetUserId) {
            state.isRunning = false;
            showStopButton(false);
            return;
        }
        if (!cachedUserId) {
            await GM_setValue(`userid_${state.targetUsername}`, state.targetUserId);
        }

        const queryHash = type === 'followers' ? FOLLOWERS_QUERY_HASH : FOLLOWING_QUERY_HASH;
        const storageKey = `${type}_${state.targetUsername}`;

        let userList = await GM_getValue(storageKey, []);
        let nextCursor = await GM_getValue(`${storageKey}_cursor`, null);
        let hasNextPage = true;
        let requestCount = 0;

        if (nextCursor === 'DONE') {
             Swal.fire('Tamamlandı', `Bu görev ('${type}') daha önce tamamlanmış. Sıfırlayıp yeniden başlatabilirsiniz.`, 'info');
             state.isRunning = false;
             showStopButton(false);
             updateProgress(userList.length, userList.length);
             log(`${type.charAt(0).toUpperCase() + type.slice(1)} listesi zaten tam. Toplam: ${userList.length}`);
             return;
        }

        log(`${userList.length} kullanıcıdan devam ediliyor...`);

        while (state.isRunning && hasNextPage) {
            try {
                const variables = {
                    id: state.targetUserId,
                    first: 50
                };
                if (nextCursor) variables.after = nextCursor;
                // 'following' için özel değişkenler gerekebilir, bu hash daha basit bir yapı istiyor olabilir.
                // Şimdilik standart tutuyoruz.
                if (type === 'followers') {
                    variables.include_reel = true;
                    variables.fetch_mutual = true;
                }

                const url = `https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${JSON.stringify(variables)}`;

                const response = await fetch(url); // App ID header'ı olmadan daha stabil çalışabilir.

                if (response.status === 429) throw new Error('RATE_LIMIT');
                if (!response.ok) throw new Error(`API Hatası: ${response.status}`);
                const data = await response.json();
                if (data.status === 'fail') throw new Error(data.message);

                const edge = data?.data?.user?.[type === 'followers' ? 'edge_followed_by' : 'edge_follow'];
                if (!edge) {
                    console.error("Beklenmedik API yanıtı (edge bulunamadı):", data);
                    throw new Error('API yanıtı anlaşılamadı. Veri yapısı değişmiş olabilir.');
                }


                const newUsers = edge.edges.map(e => ({ id: e.node.id, username: e.node.username, full_name: e.node.full_name }));
                userList.push(...newUsers);

                const totalCount = edge.count;
                const pageInfo = edge.page_info;
                hasNextPage = pageInfo.has_next_page;
                nextCursor = pageInfo.end_cursor;

                log(`${userList.length} / ${totalCount} ${type} getirildi.`);
                updateProgress(userList.length, totalCount);

                await GM_setValue(storageKey, userList);
                await GM_setValue(`${storageKey}_cursor`, nextCursor);

                if (!hasNextPage) {
                    log('Tüm liste başarıyla alındı.');
                    await GM_setValue(`${storageKey}_cursor`, 'DONE');
                    break;
                }

                requestCount++;
                let delay = randomDelay();
                if (requestCount % REQUEST_COUNT_FOR_BIG_DELAY === 0) {
                    delay = BIG_DELAY_MS;
                    log(`${REQUEST_COUNT_FOR_BIG_DELAY} istek yapıldı. ${delay / 1000}s bekleniyor...`);
                }
                await sleep(delay);

            } catch (error) {
                const errorMessage = error.message === 'RATE_LIMIT'
                    ? 'Hız Limitine Takıldınız! Instagram istek hızınızı geçici olarak engelledi.<br><br><b>Çözüm:</b> Birkaç saat bekleyin veya <b>farklı bir Instagram hesabıyla giriş yapıp</b> göreve kaldığınız yerden devam edin.'
                    : `Bir hata oluştu: ${error.message}. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.`;

                Swal.fire({ title: 'Hata!', html: errorMessage, icon: 'warning', confirmButtonText: 'Anladım' });
                state.isRunning = false;
                break;
            }
        }

        if (!state.isRunning) log('İşlem durduruldu.');
        else log('Görev tamamlandı!');
        state.isRunning = false;
        showStopButton(false);
    }

    async function compareLists() {
        const username = targetUsernameInput.value.trim();
        if (!username) { Swal.fire('Eksik Bilgi', 'Lütfen bir hedef kullanıcı adı girin.', 'warning'); return; }
        log('Veriler okunuyor...');
        const followers = await GM_getValue(`followers_${username}`, []);
        const following = await GM_getValue(`following_${username}`, []);

        if (followers.length === 0 || following.length === 0) {
            Swal.fire('Veri Eksik', 'Karşılaştırma yapmadan önce her iki listeyi de getirmelisiniz.', 'error');
            return;
        }

        log(`Takipçiler: ${followers.length}, Takip Edilenler: ${following.length}. Karşılaştırılıyor...`);
        const followerUsernames = new Set(followers.map(u => u.username));
        const nonFollowers = following.filter(u => !followerUsernames.has(u.username));

        log(`Sonuç: ${nonFollowers.length} kişi sizi takip etmiyor.`);
        resultsCount.innerText = nonFollowers.length;
        resultsList.innerHTML = '';
        nonFollowers.sort((a, b) => a.username.localeCompare(b.username)).forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${user.full_name || user.username} (<a href="https://www.instagram.com/${user.username}" target="_blank">@${user.username}</a>)</span>`;
            resultsList.appendChild(li);
        });
        resultsContainer.style.display = 'block';
    }

    async function resetData() {
        const username = targetUsernameInput.value.trim();
        if (!username) { Swal.fire('Eksik Bilgi', 'Sıfırlanacak kullanıcı adını girin.', 'warning'); return; }
        Swal.fire({
            title: 'Emin misiniz?',
            text: `"${username}" için kaydedilmiş tüm veriler silinecek! Bu işlem geri alınamaz.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await GM_deleteValue(`followers_${username}`);
                await GM_deleteValue(`following_${username}`);
                await GM_deleteValue(`followers_${username}_cursor`);
                await GM_deleteValue(`following_${username}_cursor`);
                await GM_deleteValue(`userid_${username}`);
                log(`"${username}" için tüm veriler sıfırlandı.`);
                updateProgress(0, 1);
                updateProgress(0, 0);
                resultsContainer.style.display = 'none';
                Swal.fire('Silindi!', 'Veriler başarıyla sıfırlandı.', 'success');
            }
        });
    }

    function copyResultsToClipboard() {
        const listItems = resultsList.querySelectorAll('a');
        if (listItems.length === 0) return;
        const textToCopy = Array.from(listItems).map(a => a.innerText.replace('@', '')).join('\n');
        navigator.clipboard.writeText(textToCopy).then(() => Swal.fire('Kopyalandı!', 'Kullanıcı adları panoya kopyalandı.', 'success'),
            (err) => Swal.fire('Hata', 'Panoya kopyalanamadı: ' + err, 'error'));
    }

    function makeDraggable(panel, header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                panel.style.top = (panel.offsetTop - pos2) + "px";
                panel.style.left = (panel.offsetLeft - pos1) + "px";
            };
        };
    }

    fetchFollowersBtn.addEventListener('click', () => fetchList('followers'));
    fetchFollowingBtn.addEventListener('click', () => fetchList('following'));
    compareBtn.addEventListener('click', compareLists);
    stopBtn.addEventListener('click', () => { state.isRunning = false; });
    resetBtn.addEventListener('click', resetData);
    copyResultsBtn.addEventListener('click', copyResultsToClipboard);
    makeDraggable(panel, deşifreHeader);

    minimizeBtn.addEventListener('click', () => {
        panel.classList.toggle('minimized');
        deşifreBody.classList.toggle('hidden');
        minimizeBtn.innerText = panel.classList.contains('minimized') ? 'O' : '-';
        deşifreHeader.querySelector('.title-icon').style.display = panel.classList.contains('minimized') ? 'none' : 'inline';
        deşifreHeader.querySelector('span:not(.minimize-btn):not(.title-icon)').style.display = panel.classList.contains('minimized') ? 'none' : 'inline';
    });

    log('Panel yüklendi. Lütfen hedef kullanıcı adını girip bir görev seçin.');
})();