// ==UserScript==
// @name         Pixiv Downloader
// @name:en      Pixiv Downloader (Illustration/Manga)
// @name:ja      Pixiv Downloader (イラスト/漫画)
// @name:zh-cn   Pixiv Downloader (插画/漫画)
// @name:vi      Pixiv Downloader (Hình minh họa/Truyện tranh)
// @namespace    http://tampermonkey.net/
// @version      2.3.1

// @description  Tải xuống hình ảnh và truyện tranh từ Pixiv
// @description:en Download illustrations and manga from Pixiv
// @description:ja Pixivからイラストと漫画をダウンロード
// @description:zh-cn 从Pixiv下载插画和漫画
// @description:vi Tải xuống hình minh họa và truyện tranh từ Pixiv
// @match        https://www.pixiv.net/*/artworks/*
// @match        https://www.pixiv.net/users/*
// @author       RenjiYuusei
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-end
// @connect      pixiv.net
// @connect      pximg.net
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/519859/Pixiv%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/519859/Pixiv%20Downloader.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Configuration
	const CONFIG = {
		CACHE_DURATION: 24 * 60 * 60 * 1000,
		MAX_CONCURRENT: 5, // Tăng số lượng tải xuống đồng thời
		NOTIFY_DURATION: 3000,
		RETRY_ATTEMPTS: 5, // Tăng số lần thử lại
		RETRY_DELAY: 1000,
		CHUNK_SIZE: 10, // Tăng số lượng ảnh tải xuống cùng lúc
		BATCH_SIZE: 50, // Tăng số lượng artwork tải xuống trong chế độ batch
		DOWNLOAD_FORMATS: ['jpg', 'png', 'gif', 'ugoira'], // Hỗ trợ nhiều định dạng
	};

	// Cache và styles
	const cache = new Map();
	GM_addStyle(`
        .pd-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        .pd-status, .pd-progress {
            background: rgba(33, 33, 33, 0.95);
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-top: 12px;
            display: none;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }
        .pd-progress {
            width: 300px;
            height: 30px;
            background: #444;
            padding: 4px;
        }
        .pd-progress .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #2196F3, #00BCD4);
            border-radius: 6px;
            transition: width 0.4s ease;
        }
        .pd-batch-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c2c2c;
            color: #fff;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            z-index: 10000;
            width: 600px;
        }
        .pd-batch-dialog h3 {
            color: #fff;
            margin-bottom: 15px;
        }
        .pd-batch-dialog p {
            color: #ddd;
            margin-bottom: 10px;
        }
        .pd-batch-dialog textarea {
            width: 100%;
            height: 250px;
            margin: 12px 0;
            padding: 10px;
            border: 2px solid #444;
            border-radius: 6px;
            font-size: 14px;
            background: #333;
            color: #fff;
        }
        .pd-batch-dialog button {
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 12px;
            font-size: 14px;
            transition: background 0.3s;
        }
        .pd-batch-dialog button:hover {
            background: #1976D2;
        }
        .pd-settings-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2c2c2c;
            color: #fff;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            z-index: 10000;
            width: 500px;
        }
        .pd-settings-dialog h3 {
            color: #fff;
            margin-bottom: 15px;
        }
        .pd-settings-item {
            margin: 15px 0;
        }
        .pd-settings-item label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #fff;
        }
        .pd-settings-item small {
            color: #aaa;
            display: block;
            margin-top: 5px;
        }
        .pd-settings-item input[type="text"],
        .pd-settings-item select {
            width: 100%;
            padding: 8px;
            border: 2px solid #444;
            border-radius: 6px;
            background: #333;
            color: #fff;
        }
        .pd-settings-item select option {
            background: #333;
            color: #fff;
        }
    `);

	// Utilities
	const utils = {
		sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),

		retry: async (fn, attempts = CONFIG.RETRY_ATTEMPTS) => {
			for (let i = 0; i < attempts; i++) {
				try {
					return await fn();
				} catch (err) {
					if (i === attempts - 1) throw err;
					await utils.sleep(CONFIG.RETRY_DELAY * (i + 1));
				}
			}
		},

		fetch: async (url, opts = {}) => {
			const cached = cache.get(url);
			if (cached?.timestamp > Date.now() - CONFIG.CACHE_DURATION) {
				return cached.data;
			}

			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: opts.method || 'GET',
					url,
					responseType: opts.responseType || 'json',
					headers: {
						Referer: 'https://www.pixiv.net/',
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
					},
					withCredentials: false,
					onload: res => {
						if (res.status === 200) {
							const data = opts.responseType === 'blob' ? res.response : JSON.parse(res.responseText);
							cache.set(url, { data, timestamp: Date.now() });
							resolve(data);
						} else reject(new Error(`HTTP ${res.status}: ${res.statusText}`));
					},
					onerror: reject,
					ontimeout: () => reject(new Error('Request timed out')),
					timeout: 30000,
				});
			});
		},

		extractId: input => {
			const match = input.match(/artworks\/(\d+)/) || input.match(/^(\d+)$/);
			return match ? match[1] : null;
		},

		ui: {
			container: null,
			init: () => {
				utils.ui.container = document.createElement('div');
				utils.ui.container.className = 'pd-container';
				document.body.appendChild(utils.ui.container);
				utils.ui.status.init();
				utils.ui.progress.init();
			},

			notify: (msg, type = 'info') =>
				GM_notification({
					text: msg,
					title: 'Pixiv Downloader',
					timeout: CONFIG.NOTIFY_DURATION,
				}),

			status: {
				el: null,
				init: () => {
					utils.ui.status.el = document.createElement('div');
					utils.ui.status.el.className = 'pd-status';
					utils.ui.container.appendChild(utils.ui.status.el);
				},
				show: msg => {
					utils.ui.status.el.textContent = msg;
					utils.ui.status.el.style.display = 'block';
				},
				hide: () => (utils.ui.status.el.style.display = 'none'),
			},

			progress: {
				el: null,
				bar: null,
				init: () => {
					const container = document.createElement('div');
					container.className = 'pd-progress';
					const bar = document.createElement('div');
					bar.className = 'progress-bar';
					container.appendChild(bar);
					utils.ui.container.appendChild(container);
					utils.ui.progress.el = container;
					utils.ui.progress.bar = bar;
				},
				update: pct => {
					utils.ui.progress.el.style.display = 'block';
					utils.ui.progress.bar.style.width = `${pct}%`;
				},
				hide: () => (utils.ui.progress.el.style.display = 'none'),
			},

			showSettingsDialog: () => {
				const dialog = document.createElement('div');
				dialog.className = 'pd-settings-dialog';
				dialog.innerHTML = `
                    <h3>Settings</h3>
                    <div class="pd-settings-item">
                        <label>Filename Format:</label>
                        <input type="text" id="filenameFormat" value="${GM_getValue('filenameFormat', '{artist} - {title} ({id})_{idx}')}">
                        <small>Available tags: {artist}, {title}, {id}, {idx}, {ext}</small>
                    </div>
                    <div>
                        <button class="save">Save</button>
                        <button class="cancel">Cancel</button>
                    </div>
                `;

				document.body.appendChild(dialog);

				const saveBtn = dialog.querySelector('.save');
				const cancelBtn = dialog.querySelector('.cancel');

				saveBtn.addEventListener('click', () => {
					const format = dialog.querySelector('#filenameFormat').value;
					GM_setValue('filenameFormat', format);
					utils.ui.notify('Settings saved!');
					dialog.remove();
				});

				cancelBtn.addEventListener('click', () => dialog.remove());
			},

			showBatchDialog: () => {
				const dialog = document.createElement('div');
				dialog.className = 'pd-batch-dialog';
				dialog.innerHTML = `
                    <h3>Batch Download</h3>
                    <p>Enter the ID or URL of the artwork (one link per line):</p>
                    <textarea placeholder="Example:&#13;&#10;8229272&#13;&#10;https://www.pixiv.net/en/artworks/12345678"></textarea>
                    <div>
                        <button class="download">Download</button>
                        <button class="cancel">Cancel</button>
                    </div>
                    <div class="pd-batch-status"></div>
                `;

				document.body.appendChild(dialog);

				const textarea = dialog.querySelector('textarea');
				const downloadBtn = dialog.querySelector('.download');
				const cancelBtn = dialog.querySelector('.cancel');

				downloadBtn.addEventListener('click', async () => {
					const links = textarea.value.split('\n').filter(Boolean);
					const ids = links.map(link => utils.extractId(link.trim())).filter(Boolean);

					if (ids.length === 0) {
						utils.ui.notify('Invalid ID!', 'error');
						return;
					}

					dialog.remove();
					await app.batchDownloadByIds(ids);
				});

				cancelBtn.addEventListener('click', () => dialog.remove());
			},
		},
	};

	// Main application
	const app = {
		async getIllustData(id) {
			const data = await utils.retry(() => utils.fetch(`https://www.pixiv.net/ajax/illust/${id}`));
			return data.body;
		},

		getFilename(data, idx = 0) {
			const format = GM_getValue('filenameFormat', '{artist} - {title} ({id})_{idx}');
			const sanitize = str => str.replace(/[<>:"/\\|?*]/g, '_').trim();
			return format.replace('{artist}', sanitize(data.userName)).replace('{title}', sanitize(data.title)).replace('{id}', data.id).replace('{idx}', String(idx).padStart(3, '0')).replace('{ext}', data.urls.original.split('.').pop());
		},

		async downloadSingle(url, filename) {
			const blob = await utils.retry(() => utils.fetch(url, { responseType: 'blob' }));
			saveAs(blob, filename);
		},

		async downloadChunk(tasks) {
			return Promise.all(tasks.map(task => task()));
		},

		async download(illust) {
			let completed = 0;
			const total = illust.pageCount;

			const downloadTasks = Array.from({ length: total }, (_, i) => async () => {
				const url = illust.urls.original.replace('_p0', `_p${i}`);
				const blob = await utils.retry(() => utils.fetch(url, { responseType: 'blob' }));

				completed++;
				utils.ui.status.show(`Downloading: ${completed}/${total}`);
				utils.ui.progress.update((completed / total) * 100);

				const filename = `${app.getFilename(illust, i)}`;
				saveAs(blob, filename);
			});

			for (let i = 0; i < downloadTasks.length; i += CONFIG.CHUNK_SIZE) {
				const chunk = downloadTasks.slice(i, i + CONFIG.CHUNK_SIZE);
				await app.downloadChunk(chunk).catch(err => {
					utils.ui.notify(`Error: ${err.message}`, 'error');
					throw err;
				});
				await utils.sleep(500);
			}

			utils.ui.notify('Download completed!', 'success');
			utils.ui.status.hide();
			utils.ui.progress.hide();
		},

		async batchDownloadByIds(ids) {
			let completed = 0;
			const total = ids.length;
			const failedIds = [];

			utils.ui.status.show(`Batch download started: 0/${total}`);

			for (const id of ids) {
				try {
					const illust = await app.getIllustData(id);
					
					for (let i = 0; i < illust.pageCount; i++) {
						const url = illust.urls.original.replace('_p0', `_p${i}`);
						const blob = await utils.retry(() => utils.fetch(url, { responseType: 'blob' }));
						const filename = `${app.getFilename(illust, i)}`;
						saveAs(blob, filename);
					}

					completed++;
					utils.ui.status.show(`Batch download progress: ${completed}/${total}`);
				} catch (err) {
					console.error(`Error downloading ${id}:`, err);
					utils.ui.notify(`Error downloading artwork ${id}: ${err.message}`, 'error');
					failedIds.push(id);
				}
				await utils.sleep(1000);
			}

			if (failedIds.length > 0) {
				console.log('Failed downloads:', failedIds);
				utils.ui.notify(`Some downloads failed. Check console for details.`, 'warning');
			}

			utils.ui.notify(`Batch download completed! Downloaded ${completed} artworks`, 'success');
			utils.ui.status.hide();
		},

		init() {
			utils.ui.init();

			// Single artwork download
			GM_registerMenuCommand('Download Artwork', async () => {
				try {
					utils.ui.status.show('Loading data...');
					const illust = await app.getIllustData(location.pathname.split('/').pop());
					await app.download(illust);
				} catch (err) {
					utils.ui.notify(`Error: ${err.message}`, 'error');
					utils.ui.status.hide();
					utils.ui.progress.hide();
				}
			});

			// Batch download
			GM_registerMenuCommand('Batch Download', () => {
				utils.ui.showBatchDialog();
			});

			// Settings
			GM_registerMenuCommand('Settings', () => {
				utils.ui.showSettingsDialog();
			});
		},
	};

	// Start
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => app.init());
	} else {
		app.init();
	}
})();

