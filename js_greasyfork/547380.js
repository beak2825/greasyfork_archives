// ==UserScript==
// @name            Jut.su OtherAnime
// @name:en         Jut.su OtherAnime
// @name:ru         Jut.su OtherAnime
// @namespace       jut.suCustomPlayer
// @version         1.0
// @description     Заменяет стандартный плеер jut.su на внешний, фильмы поддерживаются только из под выбора другого источника где серии..., иногда выбор серий жопится из-за корявого распределения серий и сезонов на самом сайте
// @description:ru  Заменяет стандартный плеер jut.su на внешний, фильмы поддерживаются только из под выбора другого источника где серии..., иногда выбор серий жопится из-за корявого распределения серий и сезонов на самом сайте
// @description:en     It replaces the standard jut.su player with an external one, movies are supported only from the choice of another source where the episodes..., sometimes the choice of episodes is assimilated due to the clumsy distribution of episodes and seasons on the site itself
// @author          nab
// @match           *://jut.su/*/episode*
// @match           *://jut.su/*/*/episode*
// @run-at          document-end
// @license         MIT
// @grant           GM.xmlHttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547380/Jutsu%20OtherAnime.user.js
// @updateURL https://update.greasyfork.org/scripts/547380/Jutsu%20OtherAnime.meta.js
// ==/UserScript==
// RHJ1 emhubyBza GxlbSBuYWh 1aiBhZG1p bmlzdHJhY2 lqdSBkYW5ub 2dvIHNhanRh
class JutsuOtherAnime {
	style() {
		if (!document.getElementById('jutso-tab-need-plus-style')) {
			const style = document.createElement('style');
			style.id = 'jutso-tab-need-plus-style';
			style.textContent = `.tab_need_plus{display:none!important;}`;
			document.head.appendChild(style);
		}
	}
	insertPanelButton(results, title, episode) {
		let panelBtn = document.getElementById('jutso-source-panel-btn');
		if (panelBtn) panelBtn.remove();
		let resetBtn = document.getElementById('jutso-source-reset-btn');
		if (resetBtn) resetBtn.remove();
		panelBtn = document.createElement('button');
		panelBtn.id = 'jutso-source-panel-btn';
		panelBtn.textContent = 'Это не то что я хочу (выбрать другой источник)';
		panelBtn.style = 'margin:18px 0 0 0;display:block;padding:10px 0;background:#c00;color:#fff;border:none;border-radius:6px;font-size:16px;cursor:pointer;max-width:400px;width:100%;';
		panelBtn.onclick = () => {
			this.createSourceSelector(results, title, episode, (chosen) => {
				let videoUrl = 'https:' + chosen.link;
				if (chosen.type === 'anime-serial' && episode) {
					videoUrl += `?episode=${episode}`;
				}
				this.replacePlayer(videoUrl);
				this.showNotification('Плеер заменён!');
			});
		};
		resetBtn = document.createElement('button');
		resetBtn.id = 'jutso-source-reset-btn';
		resetBtn.textContent = 'Сбросить выбор источника для этого аниме';
		resetBtn.style = 'margin:8px 0 0 0;display:block;padding:8px 0;background:#444;color:#fff;border:none;border-radius:6px;font-size:15px;cursor:pointer;max-width:400px;width:100%;';
		resetBtn.onclick = () => {
			this.saveSource(title, '');
			this.showNotification('Выбор источника сброшен');
			setTimeout(() => location.reload(), 300);
		};
		const postMedia = document.querySelector('.post_media');
		if (postMedia && postMedia.parentNode) {
			postMedia.parentNode.insertBefore(panelBtn, postMedia.nextSibling);
			postMedia.parentNode.insertBefore(resetBtn, panelBtn.nextSibling);
		} else {
			document.body.appendChild(panelBtn);
			document.body.appendChild(resetBtn);
		}
	}
	storageKey(title) {
		return 'jutsoSource_' + title.toLowerCase().replace(/[^a-z0-9]/gi, '');
	}

	saveSource(title, id) {
		localStorage.setItem(this.storageKey(title), id);
	}

	getSavedSource(title) {
		return localStorage.getItem(this.storageKey(title));
	}

	createSourceSelector(sources, currentTitle, episode, onSelect) {
		let oldModal = document.getElementById('jutso-source-modal');
		if (oldModal) oldModal.remove();
		const groups = {};
		sources.forEach(src => {
			const key = src.title || 'Без названия';
			if (!groups[key]) groups[key] = [];
			groups[key].push(src);
		});

        const modal = document.createElement('div');
		modal.id = 'jutso-source-modal';
		modal.style = `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;`;

        const panel = document.createElement('div');
		panel.id = 'jutso-source-panel';
		panel.style = `background:#222;color:#fff;padding:24px 32px;border-radius:16px;max-width:900px;width:100%;box-shadow:0 2px 32px #000a;display:flex;flex-direction:column;gap:18px;max-height:90vh;overflow-y:auto;position:relative;`;
		panel.innerHTML = `<div style="font-size:22px;font-weight:bold;margin-bottom:12px;">Выберите источник плеера</div>`;
		const grid = document.createElement('div');
		grid.style = 'display:grid;grid-template-columns:1fr 1fr;gap:20px;';
		Object.entries(groups).forEach(([title, arr]) => {
			const cell = document.createElement('div');
			cell.style = 'display:flex;flex-direction:column;align-items:flex-start;gap:10px;background:#181818;border-radius:10px;padding:12px 10px;';

            const preview = document.createElement('img');
			preview.src = arr[0].screenshots?.[0] || '';
			preview.style = 'width:140px;height:80px;object-fit:cover;border-radius:8px;background:#333;margin-bottom:6px;';
			cell.appendChild(preview);

            const info = document.createElement('div');
			info.style = 'font-size:17px;font-weight:bold;margin-bottom:4px;';
			info.textContent = title;
			cell.appendChild(info);

			const meta = document.createElement('div');
			meta.style = 'font-size:15px;color:#ccc;margin-bottom:4px;';
			let metaText = '';
			if (arr[0].last_season) metaText += `Сезон: ${arr[0].last_season} | `;
			if (!arr[0].episodes_count || arr[0].episodes_count === 1) {
				metaText += 'Фильм';
			} else {
				metaText += `Серий: ${arr[0].episodes_count}`;
			}
			metaText += ` | Год: ${arr[0].year || '?'}`;
			meta.innerHTML = metaText;
			cell.appendChild(meta);

            const trList = document.createElement('div');
			trList.className = 'jutso-tr-list';
			trList.style = 'display:flex;flex-direction:row;gap:8px;margin-top:8px;flex-wrap:wrap;';
			arr.forEach(src => {
				const trBtn = document.createElement('button');
				trBtn.textContent = src.translation?.title || 'Озвучка неизвестна';
				trBtn.style = 'padding:7px 10px;background:#333;color:#fff;border:none;border-radius:6px;font-size:15px;cursor:pointer;transition:background 0.2s;';
				trBtn.onmouseenter = () => trBtn.style.background = '#444';
				trBtn.onmouseleave = () => trBtn.style.background = '#333';
				trBtn.onclick = () => {
					this.saveSource(currentTitle, src.id);
					modal.remove();

                    setTimeout(() => location.reload(), 300);
				};
				trList.appendChild(trBtn);
			});
			cell.appendChild(trList);
			grid.appendChild(cell);
		});
		panel.appendChild(grid);

        const closeBtn = document.createElement('button');
		closeBtn.textContent = 'Закрыть';
		closeBtn.style = 'position:absolute;top:18px;right:24px;padding:10px 0 10px 0;background:#c00;color:#fff;border:none;border-radius:8px;font-size:18px;cursor:pointer;min-width:120px;';
		closeBtn.onclick = () => modal.remove();
		panel.appendChild(closeBtn);
		modal.appendChild(panel);

        modal.addEventListener('mousedown', (e) => {
			if (e.target === modal) modal.remove();
		});
		document.body.appendChild(modal);
	}
	apiUrl = 'https://api.andb.workers.dev/search';
	selectors = {
		player: '#my-player',
		allEpisodesLink: 'a:contains("список всех серий")',
		infoBlock: '.under_video_additional'
	};

	$(selector, context = document) {
		return context.querySelector(selector);
	}

	getEpisodeNumber() {
		const urlMatch = window.location.pathname.match(/episode-(\d+)/);
		if (urlMatch) return urlMatch[1];
		const titleMatch = document.title.match(/(\d+)\s*серия/);
		return titleMatch ? titleMatch[1] : '';
	}

	getSeasonNumber() {
		const match = window.location.pathname.match(/season-(\d+)/);
		if (match) return Number(match[1]);
		return null;
	}

	async request(details) {
		return new Promise((resolve, reject) => {
			GM.xmlHttpRequest({
				method: 'GET',
				responseType: 'json',
				anonymous: true,
				headers: { origin: 'https://amove.my.to' },
				...details,
				onload(responseObject) {
					resolve(responseObject);
				},
				onerror(responseObject) {
					reject(responseObject);
				},
			});
		});
	}

	async fetchPage(url) {
		return new Promise((resolve, reject) => {
			(GM.xmlHttpRequest || GM.xmlhttpRequest)({
				method: 'GET',
				url,
				onload: (response) => resolve(response.responseText),
				onerror: reject
			});
		});
	}

	extractOriginalTitle(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const infoBlock = doc.querySelector(this.selectors.infoBlock);
		if (!infoBlock) return null;
		const match = infoBlock.innerHTML.match(/Оригинальное название:\s*<b>(.*?)<\/b>/);
		return match ? match[1] : null;
	}

	async getAnimeTitle() {
		const allEpisodesLink = Array.from(document.querySelectorAll('a'))
			.find(a => a.textContent.includes('список всех серий'));
		if (!allEpisodesLink) return null;
		const url = allEpisodesLink.href;
		try {
			const html = await this.fetchPage(url);
			return this.extractOriginalTitle(html) || null;
		} catch {
			return null;
		}
	}

	async findAnime(title) {
		try {
			let url = `${this.apiUrl}?title=${encodeURIComponent(title)}`;
			const response = await this.request({ url });
			const results = response.response?.results || [];
			if (response.status !== 200 || !results.length) return null;
			const season = this.getSeasonNumber();
			let filteredResults = results;
			if (season) filteredResults = results.filter(a => a.last_season == season);
			let anime = filteredResults
				.filter(a => a.title_orig.toLowerCase().replace(/[ ,:'`]/g, '') ===
					title.toLowerCase().replace(/[ ,:'`]/g, ''))
				.sort((a, b) => b.episodes_count - a.episodes_count)[0];
			if (!anime && filteredResults.length) anime = filteredResults[0];
			if (!anime && results.length) anime = results[0];
			return anime || null;
		} catch {
			return null;
		}
	}

	showNotification(msg, color = '#222') {
		const style = {
			position: 'fixed',
			top: '20px',
			right: '20px',
			zIndex: 99999,
			background: color,
			color: '#fff',
			padding: '12px 20px',
			borderRadius: '8px',
			fontSize: '18px',
			boxShadow: '0 2px 8px #0003',
			transition: 'opacity 0.3s'
		};
		let notify = this.$('#jutso-notify') || Object.assign(document.createElement('div'), {
			id: 'jutso-notify',
			style: Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')
		});
		notify.style.background = color;
		notify.textContent = msg;
		notify.style.opacity = '1';
		document.body.appendChild(notify);
		setTimeout(() => notify.style.opacity = '0', 3000);
	}

	replacePlayer(src) {
		const player = this.$(this.selectors.player);
		if (!player) return false;
		const iframe = Object.assign(document.createElement('iframe'), {
			src,
			allow: 'fullscreen',
			style: 'width:100%;height:480px;border:none;background:#000'
		});
		player.replaceWith(iframe);
		return true;
	}

	async mainReplace() {
		if (!this.$(this.selectors.player)) return;
		this.showNotification('Ищем серию...');
		const title = await this.getAnimeTitle();
		const episode = this.getEpisodeNumber();
		if (!title) {
			this.showNotification('Не удалось определить название аниме', '#c00');
			return;
		}
		let url = `${this.apiUrl}?title=${encodeURIComponent(title)}`;
		const response = await this.request({ url });
		const results = response.response?.results || [];
		if (response.status !== 200 || !results.length) {
			this.showNotification('Не найден внешний плеер', '#c00');
			return;
		}
		const savedId = this.getSavedSource(title);
		let anime = null;
		if (savedId) {
			anime = results.find(a => a.id === savedId);
		}
		if (!anime) {
			const season = this.getSeasonNumber();
			let filteredResults = results;
			if (season) filteredResults = results.filter(a => a.last_season == season);
			anime = filteredResults
				.filter(a => a.title_orig.toLowerCase().replace(/[ ,:'`]/g, '') ===
					title.toLowerCase().replace(/[ ,:'`]/g, ''))
				.sort((a, b) => b.episodes_count - a.episodes_count)[0];
			if (!anime && filteredResults.length) anime = filteredResults[0];
			if (!anime && results.length) anime = results[0];
		}
		if (!anime?.link) {
			this.showNotification('Не найден внешний плеер', '#c00');
			return;
		}

		let videoUrl = 'https:' + anime.link;
		if (anime.type === 'anime-serial' && episode) {
			videoUrl += `?episode=${episode}`;
		}
		if (this.replacePlayer(videoUrl)) {
			this.showNotification('Плеер заменён!');
		} else {
			this.showNotification('Ошибка замены плеера', '#c00');
		}

		this.insertPanelButton(results, title, episode);
	}
}

const jutso = new JutsuOtherAnime();
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		jutso.style();
		jutso.mainReplace();
	});
} else {
	jutso.style();
	setTimeout(() => jutso.mainReplace(), 1000);
}