// ==UserScript==
// @name         蜜柑计划番剧列表页面加载番组计划的评分
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Display ratings of bangumi from bgm.tv
// @author       植树淡季
// @match        https://mikanani.me/
// @match        https://mikanime.tv/
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464623/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E7%95%AA%E5%89%A7%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E7%9A%84%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/464623/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E7%95%AA%E5%89%A7%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E7%9A%84%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function extractBangumiID(anchorElement) {
		const href = anchorElement.getAttribute('href');
		const matchResult = href.match(/\/Home\/Bangumi\/(\d+)/);

		return matchResult ? matchResult[1] : null;
	}

	function displayRating(element, rating) {
		const ratingElement = document.createElement('div');

        ratingElement.className = 'rating-display'; // 添加类名
		const ratingNumber = parseFloat(rating);

		if (ratingNumber > 8) {
			ratingElement.style.fontWeight = 'bold';
			ratingElement.style.color = 'red';
			ratingElement.style.fontSize = '2.5em';
		} else if (ratingNumber > 6) {
			ratingElement.style.fontWeight = 'bold';
			ratingElement.style.color = 'blue';
			ratingElement.style.fontSize = '2.5em';
		} else {
            ratingElement.style.color = 'green';
			ratingElement.style.fontSize = '2em';
		}

		ratingElement.textContent = `评分: ${rating}`;
		element.parentElement.insertBefore(ratingElement, element);
	}

	function getRatingFromBgmTV(url, callback) {
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			onload: function(response) {
				const parser = new DOMParser();
				const doc = parser.parseFromString(response.responseText, 'text/html');
				const ratingElement = doc.querySelector('span.number[property="v:average"]');

				if (ratingElement) {
					const rating = ratingElement.textContent;
					callback(rating);
				} else {
					//  console.error('Cannot find the rating element.');
				}
			}
		});
	}

	function findBgmTVLink(doc, retries, callback) {
		const linkElement = doc.querySelector('a.w-other-c[target="_blank"][href^="https://bgm.tv"]');

		if (linkElement) {
			const href = linkElement.getAttribute('href');
			callback(href);
		} else {
			if (retries > 0) {
				// console.warn('Cannot find the bgm.tv link element. Retrying...');
				setTimeout(() => {
					findBgmTVLink(doc, retries - 1, callback);
				}, 100);
			} else {
				// console.error('Cannot find the bgm.tv link element after 5 retries.');
			}
		}
	}

	function processBangumiEntry(entry) {
		return new Promise((resolve, reject) => {
            // 检查是否已经存在评分元素，如果存在则忽略此条目
            if (entry.querySelector('div.rating-display')) {
                resolve();
                return;
            }
			function processEntryWithRetries(retries) {
				const anchorElement = entry.querySelector('a[href^="/Home/Bangumi/"][target="_blank"]');

				if (anchorElement) {
					const bangumiID = extractBangumiID(anchorElement);
					if (bangumiID) {
                        if(bangumiID=='3028'){
                            console.log("1");
                        }
						const url = `https://`+window.location.host+`/Home/Bangumi/${bangumiID}`;

						GM_xmlhttpRequest({
							method: 'GET',
							url: url,
							onload: function(response) {
								const parser = new DOMParser();
								const doc = parser.parseFromString(response.responseText, 'text/html');

								findBgmTVLink(doc, 5, function(bgmTVUrl) {
									getRatingFromBgmTV(bgmTVUrl, function(rating) {
										displayRating(anchorElement, rating);
										resolve();
									});
								});
							},
							onerror: function() {
								reject();
							},
							ontimeout: function() {
								reject();
							}
						});
					} else {
						 console.log('Cannot extract bangumiID from the anchor element.');
						reject();
					}
				} else {
					if (retries > 0) {
						 console.log('Cannot find the anchor element. Retrying...');
						setTimeout(() => {
							processEntryWithRetries(retries - 1);
						}, 100);
					} else {
						 console.log('Cannot find the anchor element after 5 retries.');
						reject();
					}
				}
			}

			processEntryWithRetries(5);
		});


	}

	function addRetryButton() {
        const retryButton = document.createElement('button');
        retryButton.textContent = '重试加载评分';
        retryButton.style.position = 'sticky';
        retryButton.style.top = '10px';
        retryButton.style.right = '10px';
        retryButton.style.zIndex = '1000';
        retryButton.addEventListener('click', () => {
            main();
        });

        // 寻找指定的容器元素
        const container = document.querySelector('#sk-data-nav > div');

        if (container) {
            // 添加按钮到指定的容器元素
            container.appendChild(retryButton);
        } else {
            // 如果找不到指定的容器，将按钮添加到 body 元素中
            document.body.appendChild(retryButton);
        }
    }



	async function main() {
		const xpath = '//*[@id="sk-body"]/div/div/ul/li';
		const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		let totalCount = 0;
		let successCount = 0;
		let failCount = 0;

		const promises = [];

		for (let i = 0; i < result.snapshotLength; i++) {
			totalCount++;
			const bangumiEntry = result.snapshotItem(i);
			promises.push(processBangumiEntry(bangumiEntry));
		}

		const results = await Promise.allSettled(promises);

		results.forEach((result) => {
			if (result.status === 'fulfilled') {
				successCount++;
			} else {
				failCount++;
			}
		});

		alert(`已成功处理 ${successCount} 个，失败 ${failCount} 个，总数 ${totalCount}`);
	}


	addRetryButton();
	main();

})();