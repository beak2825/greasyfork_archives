// ==UserScript==
// @name         知网重定向 — 便于使用机构IP登录下载
// @namespace    cnki_redirector
// @description  将来自知网主站、知网空间、知网编客、知网百科、知网阅读、知网文化、知网法律、知网医院数字图书馆、手机知网等站点的知网文献页重定向至知网主站`kns.cnki.net`，支持获取知网文献无追踪链接。
// @version      5.0
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAB10lEQVQ4jZVSP8hpcRj+nZs6oiPkpFBkoCxnQCeT0rdQyiCZDAwYTOQsBsOR/aRshlMymsSK/JkMysDgz3KOZDmO8t/vDu79fO51b33P9r71vO/7PO+DwKIbfAuw6Ia/IQhCPB6nKEoURfgWRbfkK/l0OrXb7dlsZrPZIpHI2wU/vha322273fp8Pq/X+6+LXgij0Wi32+VyueVymc1m1+v1/zRsNhuCIFQqVSwWUyqVarV6Op1+Hs9xnCiKsOh+Emia/pyi0+mazSaE8HK59Pv9TCbjcDjy+fyL6FAohGEYwzD3+73RaJjN5mq1utlsptOpxWK5Xq/dbhd8vNq63+8ZhjEajbVabbFYGAyGRCJxPB5Pp1MwGOx0Os8Nk8mE4zipVDoYDFarVblcdjqdBEFgGIaiaKVSQRDE5XKBHpAAAHie93g85/PZbrfP53OKotLptEajsVqtrVZLJpPRNO33+w+HAwaABAAAISRJEsfxbDZbr9f1er1Go0EQJJVKDYfDXq9XKpU8Ho9cLn/aKgjCw9lAIFAoFMLh8Gw2e3T2+/2baCgUCp7no9EoSZLRaNRkMkEIWZbFcfyPv/0ijMfjh6HJZFKr1bIsi6KoRCIBfwH5brx/AseDLUJKQoGcAAAAAElFTkSuQmCC
// @author       MkQtS
// @license      MIT
// @homepage     https://github.com/MkQtS/CNKI-Redirect
// @supportURL   https://github.com/MkQtS/CNKI-Redirect/issues
// @run-at       document-end
// @match        *://*.cnki.net/*
// @match        *://*.cnki.com.cn/*
// @exclude      *://kns.cnki.net/kns8/*
// @exclude      *://*.cnki.net/kcms/detail/frame/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/453031/%E7%9F%A5%E7%BD%91%E9%87%8D%E5%AE%9A%E5%90%91%20%E2%80%94%20%E4%BE%BF%E4%BA%8E%E4%BD%BF%E7%94%A8%E6%9C%BA%E6%9E%84IP%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453031/%E7%9F%A5%E7%BD%91%E9%87%8D%E5%AE%9A%E5%90%91%20%E2%80%94%20%E4%BE%BF%E4%BA%8E%E4%BD%BF%E7%94%A8%E6%9C%BA%E6%9E%84IP%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function CNKI_Redirect(currentUrl) {
	'use strict';
	function IdentifyCase(url) {
		const CNKICASES = ['error', 'kcms', 'kcms2', 'bianke', 'mall', 'space', 'urtpweb', 'wap', 'wenhua', 'xuewen', 'common'],
			CNKIREGEXES = [
				/^https?:\/\/[\w\.]+\.cnki\.net\/kcms\/detail\/error/,
				/^https?:\/\/(\w+\.)?(global|kns|oversea|www)\.cnki\.net\/kcms\/detail\/detail\.aspx\?dbcode=\w+&filename=[\w\.]+$/,
				/^https?:\/\/kns\.cnki\.net\/kcms2\/article\/abstract\?/,
				/^https?:\/\/bianke\.cnki\.net\/web\/article\//,
				/^https?:\/\/mall\.cnki\.net\/magazine\/article\//,
				/^https?:\/\/\w+\.cnki\.com\.cn\/article\//,
				/^https?:\/\/\w+\.cnki\.net\/urtpweb\/detail\?/,
				/^https?:\/\/(read|wap)\.cnki\.net\/(((touch\/)?web\/\w+\/article\/)|(\w+-[\w\.]+\.htm))/,
				/^https?:\/\/wh\.cnki\.net\/(m\/)?article\/detail\//,
				/^https?:\/\/xuewen\.cnki\.net\/\w+-[\w\.]+\.htm/,
				/^https?:\/\/([\w\.]+\.)?cnki\.net\/(law|kcms\d?)\/(article\/|detail(\?|\/detail)|doi\/)/
			];
		return CNKICASES[CNKIREGEXES.findIndex(cnkiReg => cnkiReg.test(url.toLowerCase()))] || 'skip';
	}

	const defFileID = { raw: ['clear', 'clear'], target: ['clear', 'clear'] };
	function FetchFileID(plat, url) {
		url = url.toLowerCase();
		let dbcode, filename, fileID = defFileID;
		switch (plat) {
			case 'bianke': {
				let dbinfo = (document.querySelector('.abstract.clearfix > .wrap > .aBtn') || document.querySelector('.articleInfo > .title > .clearfix > strong > a'))?.href.toLowerCase();
				if (dbinfo) {
					dbcode = dbinfo.replace(/^https?:\/\/bianke\.cnki\.net\/z\/download\/article\/[\w\.]+\/(\w+)\/.+$/, '$1').replace(/^https?:\/\/search\.cnki\.com\.cn\/(\w+)\/.+$/, '$1');
					filename = url.replace(/^https?:\/\/bianke\.cnki\.net\/web\/article\/([\w\.]+)\.htm.*$/, '$1');
				}
				break;
			} case 'kns': {
				dbcode = document.getElementById('paramdbname')?.value.replace(/(auto|day|last|temp|total|\d+)/gi, '').replace(/^(\w{4})\w+$/, '$1') || document.getElementById('paramdbcode')?.value;
				filename = document.getElementById('paramfilename')?.value;
				break;
			} case 'mall': {
				dbcode = document.getElementById('articleType')?.value;
				filename = document.getElementById('articleFileName')?.value;
				if (!dbcode || !filename) {
					let downParams = new URLSearchParams(document.getElementsByClassName('articledownload')[0]?.href.toLowerCase().split('?')[1]);
					dbcode = downParams.get('dbtype');
					filename = downParams.get('filename');
				}
				break;
			} case 'space': {
				let fileinfo = url.replace(/^https?:\/\/(\w+)\.cnki\.com\.cn\/article\/([\w\.-]+)\.htm.*$/, '$1-$2').replace(/^\w+-(\w+)(?:(?:-\d+)|(?:total))-([\w\.]+)$/, '$1-$2');
				[dbcode, filename] = fileinfo.split('-');
				break;
			} case 'urtpweb': {
				dbcode = document.getElementById('rescode')?.value;
				filename = document.getElementById('filename')?.value;
				break;
			} case 'wap': {
				dbcode = document.getElementById('a_download')?.dataset.type;
				filename = document.getElementById('a_download')?.dataset.filename;
				if (!dbcode || !filename) {
					let fileinfo = url.replace(/^https?:\/\/\w+\.cnki\.net\/(?:touch\/)?(?:web\/)?(\S+)\.htm.*$/, '$1').replace(/^(\w+)\/article\/(?:\w*-)?([\w\.]+)$/, '$1-$2');
					[dbcode, filename] = fileinfo.split('-');
					const DBLINK = ['conference', 'dissertation', 'journal', 'newspaper', 'huiyi', 'lunwen', 'qikan', 'baozhi'],
						DBREAL = ['CIPD', 'CDMD', 'CJFD', 'CCND', 'CIPD', 'CDMD', 'CJFD', 'CCND'];
					dbcode = DBREAL[DBLINK.indexOf(dbcode)] || dbcode;
				}
				break;
			} case 'wenhua': {
				if (document.getElementById('journalimg') || document.getElementsByClassName('hero-cover-img').length) {
					dbcode = 'CJFD';
					filename = url.replace(/^https?:\/\/wh\.cnki\.net\/(?:m\/)?article\/detail\/([\w\.]+).*$/, '$1');
				}
				break;
			} case 'xuewen': {
				let fileinfo = url.replace(/^https?:\/\/xuewen\.cnki\.net\/(\w+-[\w\.]+)\.htm.*$/, '$1');
				[dbcode, filename] = fileinfo.split('-');
				break;
			} case 'common': {
				dbcode = document.getElementById('paramdbcode')?.value;
				filename = document.getElementById('paramfilename')?.value;
				if (!dbcode || !filename) {
					let trackfile = (document.getElementById('addfavtokpc') || document.getElementById('SnapshotSearchButton'))?.onclick.toString();
					if (trackfile) {
						let fileinfo = trackfile.replace(/^[\S\s]+(?:AddFavToMyCnki|StartSnapShotSearch)\([^')]*'([^']+)'[^')]+'([^']+)'[^)]*\)[\S\s]+$/, '$1-$2');
						[dbcode, filename] = fileinfo.split('-');
					} else {
						let urlParams = new URLSearchParams(url.split('?')[1]);
						dbcode = urlParams.get('dbcode') || urlParams.get('dbname')?.replace(/(auto|day|last|temp|total|\d+)/g, '').replace(/^\w+(\w{4})$/, '$1');
						filename = urlParams.get('filename');
					}
				}
				break;
			}
		}
		if (!dbcode || !filename) {
			console.debug('[CNKI-Redirect] Insufficient file ID. dbcode: %s, filename: %s', dbcode, filename);
		} else if (/^\w+$/.test(dbcode) && /^[\w\.]+$/.test(filename)) {
			fileID = ((dbcode, filename) => {
				let fileIDObj = { raw: [dbcode.toUpperCase(), filename.toUpperCase()] };
				dbcode = fileIDObj.raw[0].replace(/^[A-Z]+_([A-Z]+)$/, '$1');
				filename = fileIDObj.raw[1];
				const cmnDB = ['CCJD', 'CCND', 'CDMD', 'CIPD', 'CJFD', 'CYFD'];
				if (!cmnDB.includes(dbcode)) {
					const oddDB = ['BNJK', 'BSFD', 'CACM', 'CDMH', 'CLKB', 'IPFD'],
						badDB = ['CCVD', 'CISD', 'CLKLP', 'CPVD', 'READ', 'SCOD', 'SCPD', 'SMSD', 'SNAD', 'SOPD'];
					if (oddDB.indexOf(dbcode) === badDB.indexOf(dbcode)) {
						let dbKey = dbcode.replace(/^C(\w)?F(\w)\w*$/, 'to$2$1').replace(/^\w+(\w)$/, '$1');
						const dbKeys = ['D', 'I', 'J', 'M', 'N', 'P', 'Y'],
							key2cmn = ['CDMD', 'CIPD', 'CJFD', 'CDMD', 'CCND', 'CIPD', 'CYFD'];
						dbcode = key2cmn[dbKeys.indexOf(dbKey)] || 'BAD-DB';
					} else {
						const odd2cmn = ['CJFD', 'CYFD', 'CJFD', 'CDMD', 'CDMD', 'CIPD'];
						dbcode = odd2cmn[oddDB.indexOf(dbcode)] || 'BAD-DB';
					}
					console.debug('[CNKI-Redirect] Convert dbcode from %s to %s.', fileIDObj.raw[0], dbcode);
				}
				switch (dbcode) {
					case 'BAD-DB': {
						[dbcode, filename] = defFileID.target;
						console.info('[CNKI-Redirect] The dbcode %s should be abandoned.', fileIDObj.raw[0]);
						break;
					} case 'CDMD': {
						filename = filename.replace(/^([\w\.]+)$/, '$1.NH').replace(/^([\w\.]+?)(\.NH)+$/, '$1.nh');
						break;
					} case 'CJFD': {
						fileIDObj.alter = ['CCJD', filename];
						console.debug('[CNKI-Redirect] Set CCJD as alternate dbcode.');
						break;
					}
				}
				fileIDObj.target = [dbcode, filename];
				return fileIDObj;
			})(dbcode, filename);
		} else {
			console.debug('[CNKI-Redirect] Invalid file ID. dbcode: %s, filename: %s', dbcode, filename);
		}
		return fileID;
	}

	function GenerateKcmsUrl(fileID) { // maybe generate kcms2 link
		let cnkiUrls = ['clear'], dbFiles = [fileID.alter, fileID.target].filter(dbfile => !!dbfile);
		const kcmsHEAD = 'https://kns.cnki.net/kcms/detail/detail.aspx?';
		dbFiles.forEach(dbfile => {
			let fileparam = 'dbcode=' + dbfile[0] + '&filename=' + dbfile[1];
			cnkiUrls.unshift(kcmsHEAD + fileparam);
		});
		return cnkiUrls;
	}

	let situation = IdentifyCase(currentUrl);
	switch (situation) {
		case 'skip': {
			console.log('[CNKI-Redirect] Skipped on ' + currentUrl);
			break;
		} case 'error': {
			let candidates = GM_getValue('candidates') || ['clear'];
			if (candidates[0] !== 'clear') {
				console.log('[CNKI-Redirect] Last target failed, try alternate...');
				let targetUrl = candidates.shift();
				GM_setValue('candidates', candidates);
				window.location.replace(targetUrl);
			} else {
				let storedSrc = GM_getValue('source') || { sourceUrl: 'clear', fileID: defFileID };
				if (storedSrc.sourceUrl !== 'clear') {
					console.log('[CNKI-Redirect] All candidates failed. Go back to original page...');
					GM_setValue('banRedirect', storedSrc.fileID.raw);
					window.location.replace(storedSrc.sourceUrl);
				} else {
					console.log('[CNKI-Redirect] Original page not found, stay here.');
				}
			}
			break;
		} case 'kcms':
		case 'kcms2': {
			let storedSrc = GM_getValue('source') || { sourceUrl: 'clear', fileID: defFileID };
			if (storedSrc.sourceUrl !== 'clear') {
				GM_setValue('candidates', ['clear']);
				GM_setValue('source', { sourceUrl: 'clear', fileID: defFileID });
			}

			let targetArea = document.getElementById('DownLoadParts')?.querySelector('.operate-btn') || document.getElementById('DownLoadParts')?.querySelector('.operate-left');
			if (!targetArea) {
				console.debug('[CNKI-Redirect] buttons area not found.');
			} else {
				let fileID = FetchFileID('kns', currentUrl);
				if (fileID.target[0] !== 'clear') {
					if (situation === 'kcms2') {
						const kcmsBtnText = '🍋 打开KCMS', kcmsBtnTitle = 'KCMS链接不含跟踪参数，但页面可能缺少部分内容';
						let kcmsUrl = GenerateKcmsUrl(fileID)[0];
						const kcmsBtn = `<li class='btn-go2kcms'><a id='go2kcms' href='${kcmsUrl}' target='_blank' title='${kcmsBtnTitle}' style='background-color: #6a8; color: #fff'>${kcmsBtnText}</a></li>`;
						targetArea.insertAdjacentHTML('beforeend', kcmsBtn);
					} else if (fileID.target[0] === 'CDMD') {
						let pdfLink = 'https://pay.cnki.net/zscsdoc/download?flag=cnkispace&plat=cnkispace&filename=' + fileID.target[1] + '&dbtype=CDMD&dtype=pdf';
						const pdfBtn = `<li class='btn-dlpdf'><a target='_blank' name='pdfDown' href='${pdfLink}'><i></i>PDF下载</a></li>`;
						targetArea.insertAdjacentHTML('beforeend', pdfBtn);
					}
				}
				if (storedSrc.sourceUrl !== 'clear') {
					const srcBtn = `\n<li class='btn-go2src'><a id='go2src' title='${storedSrc.sourceUrl}' style='background-color: #9a5; color: #fff'>🥝 打开源页面</a></li>`;
					targetArea.insertAdjacentHTML('beforeend', srcBtn);
					document.getElementById('go2src').addEventListener('click', () => {
						GM_setValue('banRedirect', storedSrc.fileID.raw);
						window.open(storedSrc.sourceUrl, '_blank');
					});
				}
			}
			console.log('[CNKI-Redirect] Ideal case, done.');
			break;
		} default: {
			console.info('[CNKI-Redirect] Rule for %s matched.', situation);
			let fileID = FetchFileID(situation, currentUrl);
			if (fileID.target[0] !== 'clear') {
				console.log('[CNKI-Redirect] Got file ID: dbcode=%s&filename=%s', fileID.target[0], fileID.target[1]);
				let banCheck = GM_getValue('banRedirect') || ['clear', 'clear'];
				if (fileID.raw.toString() === banCheck.toString()) {
					GM_setValue('banRedirect', ['clear', 'clear']);
					console.log('[CNKI-Redirect] Redirect for this file is not allowed. Refresh to try again.');
				} else {
					window.stop();
					GM_setValue('source', { sourceUrl: currentUrl, fileID: fileID });
					let candidates = GenerateKcmsUrl(fileID), targetUrl = candidates.shift();
					GM_setValue('candidates', candidates);
					window.location.replace(targetUrl);
				}
			} else {
				console.log('[CNKI-Redirect] No proper file ID found.');
			}
			break;
		}
	}
})(window.location.href);
