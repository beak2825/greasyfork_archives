// ==UserScript==
// @name         チケットアシスト
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  リセール・先着販売
// @author       You
// @match        https://*.pia.jp/*
// @match        http://sorry.pia.jp/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539283/%E3%83%81%E3%82%B1%E3%83%83%E3%83%88%E3%82%A2%E3%82%B7%E3%82%B9%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539283/%E3%83%81%E3%82%B1%E3%83%83%E3%83%88%E3%82%A2%E3%82%B7%E3%82%B9%E3%83%88.meta.js
// ==/UserScript==

$(function(){


    let intervalId = null;
    let thisTabId = sessionStorage.getItem('ta_tab_id');
    if (!thisTabId) {
        thisTabId = Math.random().toString(36).substring(2) + Date.now();
        sessionStorage.setItem('ta_tab_id', thisTabId);
    }

    function sendNotification(title, message, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: 'https://t.pia.jp/favicon.ico',
                badge: 'https://t.pia.jp/favicon.ico',
                tag: 'ticket-assistant',
                requireInteraction: true,
                ...options
            });
            
            // 通知クリック時の処理
            notification.onclick = function() {
                window.focus();
                notification.close();
            };
            
            // 5秒後に自動で閉じる
                setTimeout(() => {
                notification.close();
            }, 5000);
            
            return notification;
        }
    }

    // 個別チケット履歴の削除機能
    function deleteTicketHistory(ticketId) {
        try {
            const history = JSON.parse(GM_getValue('ta_ticket_history', '[]'));
            const filteredHistory = history.filter(ticket => ticket.id !== ticketId);
            GM_setValue('ta_ticket_history', JSON.stringify(filteredHistory));
            console.log('チケット履歴を削除しました:', ticketId);
            
            // 履歴モーダルが開いている場合は更新
            if ($('#ta_history_overlay').length > 0) {
                updateTicketHistoryModal(filteredHistory);
            }
        } catch (error) {
            console.error('チケット履歴の削除に失敗しました:', error);
        }
    }

    // チケット履歴の保存・取得機能
    function saveTicketHistory(ticketData) {
        try {
            // チケット情報が全て「不明」の場合は保存しない（エラー画面など）
            const allUnknown = (!ticketData.performanceName || ticketData.performanceName === '不明') &&
                              (!ticketData.performanceDate || ticketData.performanceDate === '不明') &&
                              (!ticketData.venue || ticketData.venue === '不明') &&
                              (!ticketData.ticketName || ticketData.ticketName === '不明');
            
            if (allUnknown) {
                return;
            }
            
            const history = JSON.parse(GM_getValue('ta_ticket_history', '[]'));
            
            // 同じチケット情報（公演名、日時、会場、チケット名）が既に保存されているかチェック
            const existingIndex = history.findIndex(item => {
                return item.performanceName === ticketData.performanceName &&
                       item.performanceDate === ticketData.performanceDate &&
                       item.venue === ticketData.venue &&
                       item.ticketName === ticketData.ticketName &&
                       item.ticketCount === ticketData.ticketCount;
            });
            
            if (existingIndex !== -1) {
                // 既存の履歴を更新（条件やマッチ結果が変わった場合）
                history[existingIndex] = {
                    ...history[existingIndex],
                    ...ticketData,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                };
                console.log('既存のチケット履歴を更新しました:', ticketData.ticketName);
            } else {
                // 新しい履歴を追加
                history.unshift({
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    ...ticketData
                });
                console.log('新しいチケット履歴を保存しました:', ticketData.ticketName);
            }
            
            // 最新100件のみ保持
            if (history.length > 100) {
                history.splice(100);
            }
            
            GM_setValue('ta_ticket_history', JSON.stringify(history));
            
            // 履歴モーダルが表示されている場合は更新
            if ($('#ta_history_overlay').length > 0) {
                updateTicketHistoryModal(history);
            }
        } catch (error) {
            console.error('チケット履歴の保存に失敗:', error);
        }
    }

    function getTicketHistory() {
        try {
            return JSON.parse(GM_getValue('ta_ticket_history', '[]'));
        } catch (error) {
            console.error('チケット履歴の取得に失敗:', error);
            return [];
        }
    }

    function clearTicketHistory() {
        GM_setValue('ta_ticket_history', '[]');
    }

    // 一覧ページ用の条件判定関数
    function checkTicketConditions(ticketInfo, savedData) {
        let conditionsMet = true;
        
        // 公演日の条件チェック
        if (savedData.performance_date && ticketInfo.performanceDate) {
            const dateRegex = new RegExp(savedData.performance_date);
            if (!dateRegex.test(ticketInfo.performanceDate)) {
                conditionsMet = false;
            }
        }
        
        // 会場の条件チェック
        if (savedData.venue && ticketInfo.venue) {
            const venueRegex = new RegExp(savedData.venue);
            if (!venueRegex.test(ticketInfo.venue)) {
                conditionsMet = false;
            }
        }
        
        // チケット枚数の条件チェック
        if (savedData.ticket_count && ticketInfo.ticketCount) {
            const countRegex = new RegExp(savedData.ticket_count);
            if (!countRegex.test(ticketInfo.ticketCount)) {
                conditionsMet = false;
            }
        }
        
        // チケット名称の条件チェック
        if (savedData.ticket_name && ticketInfo.ticketName) {
            const nameRegex = new RegExp(savedData.ticket_name);
            if (!nameRegex.test(ticketInfo.ticketName)) {
                conditionsMet = false;
            }
        }
        
        return conditionsMet;
    }

    function showTicketHistory() {
        const history = getTicketHistory();
        
        if (history.length === 0) {
            alert('チケット履歴がありません');
            return;
        }

        // 既存の履歴モーダルがあれば更新、なければ新規作成
        if ($('#ta_history_overlay').length > 0) {
            updateTicketHistoryModal(history);
            return;
        }

        // 履歴表示モーダルを作成
        const historyModal = $(`
            <div id="ta_history_overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:block;z-index:10002;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <div id="ta_history_content" style="background:#fff;padding:20px;border-radius:8px;max-width:95vw;width:800px;position:relative;margin:10px auto;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10003;">
                    <h2 style="margin-top:0;color:#333;">チケット履歴 (${history.length}件)</h2>
                    <div style="max-height:70vh;overflow-y:auto;">
                ${history.map(ticket => `
                    <div style="border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:10px;background:${ticket.matched ? '#e8f5e8' : '#fff5f5'};">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-weight:bold;color:${ticket.matched ? '#28a745' : '#dc3545'};">
                                    ${ticket.matched ? '✓ 条件合致' : '✗ 条件非合致'}
                                </span>
                                <button class="ta_delete_ticket" data-ticket-id="${ticket.id}" style="background:none;border:none;color:#dc3545;cursor:pointer;font-size:16px;padding:2px 5px;border-radius:3px;" title="このチケットを削除">🗑️</button>
                            </div>
                            <span style="font-size:12px;color:#666;">
                                ${new Date(ticket.timestamp).toLocaleString('ja-JP')}
                            </span>
                        </div>
                                <div style="margin-bottom:5px;"><strong>公演:</strong> ${ticket.performanceName || '不明'}</div>
                                <div style="margin-bottom:5px;"><strong>日時:</strong> ${ticket.performanceDate || '不明'}</div>
                                <div style="margin-bottom:5px;"><strong>会場:</strong> ${ticket.venue || '不明'}</div>
                                <div style="margin-bottom:5px;"><strong>チケット:</strong> ${ticket.ticketName || '不明'}</div>
                                <div style="margin-bottom:5px;"><strong>枚数:</strong> ${ticket.ticketCount || '不明'}</div>
                                <div style="margin-top:10px;padding:8px;background:#f8f9fa;border-radius:4px;font-size:12px;">
                                    <strong>URL:</strong> <a href="${ticket.url}" target="_blank" style="color:#007BFF;">${ticket.url}</a>
                                    <br><strong>ID:</strong> ${ticket.id}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align:center;margin-top:20px;">
                        <button id="ta_history_close" style="background:#6c757d;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;margin-right:10px;">閉じる</button>
                        <button id="ta_history_clear" style="background:#dc3545;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;">履歴削除</button>
                    </div>
                </div>
            </div>
        `);

        // モーダルを表示
        $('body').append(historyModal);
    }

    // 履歴モーダルの内容を更新する関数
    function updateTicketHistoryModal(history) {
        const historyHTML = `
            <h2 style="margin-top:0;color:#333;">チケット履歴 (${history.length}件)</h2>
            <div style="max-height:70vh;overflow-y:auto;">
                ${history.map(ticket => `
                    <div style="border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:10px;background:${ticket.matched ? '#e8f5e8' : '#fff5f5'};">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-weight:bold;color:${ticket.matched ? '#28a745' : '#dc3545'};">
                                    ${ticket.matched ? '✓ 条件合致' : '✗ 条件非合致'}
                                </span>
                                <button class="ta_delete_ticket" data-ticket-id="${ticket.id}" style="background:none;border:none;color:#dc3545;cursor:pointer;font-size:16px;padding:2px 5px;border-radius:3px;" title="このチケットを削除">🗑️</button>
                            </div>
                            <span style="font-size:12px;color:#666;">
                                ${new Date(ticket.timestamp).toLocaleString('ja-JP')}
                            </span>
                        </div>
                        <div style="margin-bottom:5px;"><strong>公演:</strong> ${ticket.performanceName || '不明'}</div>
                        <div style="margin-bottom:5px;"><strong>日時:</strong> ${ticket.performanceDate || '不明'}</div>
                        <div style="margin-bottom:5px;"><strong>会場:</strong> ${ticket.venue || '不明'}</div>
                        <div style="margin-bottom:5px;"><strong>チケット:</strong> ${ticket.ticketName || '不明'}</div>
                        <div style="margin-bottom:5px;"><strong>枚数:</strong> ${ticket.ticketCount || '不明'}</div>
                        <div style="margin-top:10px;padding:8px;background:#f8f9fa;border-radius:4px;font-size:12px;">
                            <strong>URL:</strong> <a href="${ticket.url}" target="_blank" style="color:#007BFF;">${ticket.url}</a>
                            <br><strong>ID:</strong> ${ticket.id}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align:center;margin-top:20px;">
                <button id="ta_history_close" style="background:#6c757d;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;margin-right:10px;">閉じる</button>
                <button id="ta_history_clear" style="background:#dc3545;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;">履歴削除</button>
            </div>
        `;
        
        $('#ta_history_content').html(historyHTML);
    }


    async function getSettings() {
        const data = await GM_getValue('ta_settings', '{}');
        return JSON.parse(data);
    }

    async function saveSettings(data) {
        await GM_setValue('ta_settings', JSON.stringify(data));
    }

    function scheduleReload(savedData) {
        display_title(0);
        let intervalMs = parseFloat(savedData.interval) * 1000;
        if (isNaN(intervalMs) || intervalMs < 100) intervalMs = 1000;
        intervalId = setTimeout(() => {
            window.location.href = savedData.url;
        }, intervalMs);
    }

	function findDetailLink($start){
		let $body = $start.closest('.sl_validTicket_body');
		if ($body.length === 0) {
			$body = $start.closest('.sl_ticketPriceDetail, .sl_ticketPriceDetail_list, .sl_ticketPriceDetailItem, .sl_section, .sl_ticketInfo, .ticketSelect, li');
		}
		if ($body.length === 0) {
			$body = $start.closest('li, div, section, article');
		}

		const selectors = [
			'.sl_resaleArchive_listItem--button a.sl_button',
			'a[href^="/resale/item/detail"], button[href^="/resale/item/detail"]',
			'span.sl_button_text:contains("チケット詳細を見る")',
			'a.sl_button:contains("チケット詳細を見る"), a:contains("チケット詳細を見る"), button:contains("チケット詳細を見る")'
		];

		for (const sel of selectors) {
			let $found = $body.find(sel).first();
			if ($found.length) {
				if ($found.is('span.sl_button_text')) $found = $found.closest('a, button');
				return $found;
			}
		}

		// 最終フォールバック：後続兄弟から探索
		let $fallback = $start.nextAll('a, button, span.sl_button_text').filter(function(){
			return $(this).text().trim().includes('チケット詳細を見る');
		}).first();
		if ($fallback.length && $fallback.is('span.sl_button_text')) {
			$fallback = $fallback.closest('a, button');
		}
		return $fallback;
	}

    async function display_title(i) {
        if(i === 1) {
            if (!document.title.startsWith("🟢リロード停止中｜")) {
                document.title = "🟢リロード停止中｜" + document.title;
            }
        } else {
            if (!document.title.startsWith("🔴")) {
                document.title = "🔴" + document.title;
            }
        }
    }

    async function handleSorryPia() {
        const savedData = await getSettings();
        if (savedData.url) {
            $('body').prepend(`
                <div id="ta_saved_link" style="text-align:center; padding: 20px;">
                    <a href="${savedData.url}" style="font-size: 24px; font-weight: bold; color: #007BFF;" target="_self">
                        保存されたURLへ移動
                    </a>
                </div>
            `);

            const intervalMs = (parseFloat(savedData.interval) * 1000) || 0;
            setTimeout(() => {
                window.location.href = savedData.url;
            }, intervalMs);
        }
    }

    async function startRedirectIfNeeded() {
        const savedData = await getSettings();
        if (intervalId) {
            clearTimeout(intervalId);
            intervalId = null;
        }

        if (!savedData.onoff || savedData.tabId !== thisTabId) return;

        if (savedData.select === 'resale') {
            const hasEmpty = $('div.sl_section.sl_ticketArchiveList--empty').length > 0;
            const hasError = $('p.error_txt.txt_lead').length > 0;
			if (!(hasEmpty || hasError)) {
				let opened = false;
				const namePattern = (savedData.ticket_name || '').trim();
				const countPattern = (savedData.ticket_count || '').trim();
				const performanceDatePattern = (savedData.performance_date || '').trim();
				const venuePattern = (savedData.venue || '').trim();
				
				// いずれかの条件が指定されている場合
				if (namePattern || countPattern || performanceDatePattern || venuePattern) {
					try {
						const nameRegex = namePattern ? new RegExp(namePattern) : null;
						const countRegex = countPattern ? new RegExp(countPattern) : null;
						const performanceDateRegex = performanceDatePattern ? new RegExp(performanceDatePattern) : null;
						const venueRegex = venuePattern ? new RegExp(venuePattern) : null;
						
						$('p.sl_ticketPriceDetail_name').each(function(){
							if (opened) return; // すでにオープン済みならスキップ
							
							const $nameElement = $(this);
							const name = $nameElement.text().trim();
							
							// チケット名の正規表現チェック
							let nameMatch = true;
							if (nameRegex) {
								nameMatch = nameRegex.test(name);
							}
							
							// チケット枚数の正規表現チェック
							let countMatch = true;
							if (countRegex) {
								// 同じコンテナ内のチケット枚数要素を探す
								const $countElement = $nameElement.closest('.sl_ticketPriceDetail').find('p.sl_ticketPriceDetail_num');
								if ($countElement.length > 0) {
									const countText = $countElement.text().trim();
									countMatch = countRegex.test(countText);
								} else {
									countMatch = false; // 枚数要素が見つからない場合はマッチしない
								}
							}
							
							// 公演日の正規表現チェック
							let performanceDateMatch = true;
							if (performanceDateRegex) {
								// 同じコンテナ内の公演日要素を探す
								const $dateElement = $nameElement.closest('.sl_validTicket_body').find('span.sl_date_day--firstHalf');
								if ($dateElement.length > 0) {
									const dateText = $dateElement.text().trim();
									performanceDateMatch = performanceDateRegex.test(dateText);
								} else {
									performanceDateMatch = false; // 公演日要素が見つからない場合はマッチしない
								}
							}
							
							// 会場の正規表現チェック
							let venueMatch = true;
							if (venueRegex) {
								// 同じコンテナ内の会場要素を探す
								const $venueElement = $nameElement.closest('.sl_validTicket_body').find('p.sl_validTicket_map');
								if ($venueElement.length > 0) {
									const venueText = $venueElement.text().trim();
									venueMatch = venueRegex.test(venueText);
								} else {
									venueMatch = false; // 会場要素が見つからない場合はマッチしない
								}
							}
							
							// すべての条件が満たされた場合のみ処理
							if (nameMatch && countMatch && performanceDateMatch && venueMatch) {
								// 近傍コンテナからリンクを探索（構造差異に強くする）
								let $body = $nameElement.closest('.sl_validTicket_body');
								if ($body.length === 0) {
									$body = $nameElement.closest('.sl_ticketPriceDetail, .sl_ticketPriceDetail_list, .sl_ticketPriceDetailItem, .sl_section, .sl_ticketInfo, .ticketSelect, li');
								}
								if ($body.length === 0) {
									$body = $nameElement.closest('li, div, section, article');
								}

								let $link = findDetailLink($nameElement);
								if ($link.length) {
									window.open($link.attr('href'), '_blank');
									opened = true;
								} else {
									console.warn('マッチしたがリンクが見つかりませんでした:', name);
								}
							}
						});
					} catch (e) {
						console.warn('不正な正規表現です:', e);
					}
				}

				// 正規表現未指定時のみ従来の先頭リンクにフォールバック
				if (!opened && !namePattern && !countPattern && !performanceDatePattern && !venuePattern) {
					$('a').each(function() {
						const text = $(this).text().trim();
						if (text === 'チケット詳細を見る') {
							window.open($(this).attr('href'), '_blank');
							opened = true;
							return false; //最初に該当した要素のみ
						}
					});
				}

				if (opened) {
					display_title(1);
					savedData.onoff = false;
					await saveSettings(savedData);
					updateStatus();
					return;
				} else {
					// マッチが無い場合は停止せずリロード継続
					scheduleReload(savedData);
					return;
				}
			} else {
                scheduleReload(savedData);
            }
        } else if (savedData.select === 'firstcome') {
            const $targets = $('button.ticketSelect div.ticketSelect__actionLabel:contains("枚数選択へ")');

            if ($targets.length > 0) {
                display_title(1);
                savedData.onoff = false;
                await saveSettings(savedData);
                return;
            } else {
                scheduleReload(savedData);
            }
        } else if (savedData.select === 'none') {
            // 「なし」モードでは何もしない
            display_title(0);
            return;
        }
    }

    async function handleFirstCome() {
        const savedData = await getSettings();
        if (savedData.select !== 'firstcome') return;

        const $targets = $('button.ticketSelect div.ticketSelect__actionLabel:contains("枚数選択へ")');

        if ($targets.length === 1) {

            $targets.eq(0).closest('button').get(0).scrollIntoView({behavior: 'smooth', block: 'center'});

            $targets.eq(0).click();
        } else if ($targets.length > 1) {

            $targets.each(function(index) {
                const num = index + 1;
                const text = $(this).text().trim();
                if (!/^\d+:/.test(text)) {
                    $(this).text(`${num}: ${text}`);
                }
            });

            $targets.eq(0).closest('button').get(0).scrollIntoView({behavior: 'smooth', block: 'center'});

            $(document).off('keydown.ta_firstcome').on('keydown.ta_firstcome', function(e) {
                const key = e.key;
                if (/^[1-9]$/.test(key)) {
                    const index = parseInt(key, 10) - 1;
                    const currentTargets = $('button.ticketSelect div.ticketSelect__actionLabel:contains("枚数選択へ")');
                    if (index >= 0 && index < currentTargets.length) {
                        currentTargets.eq(index).click();
                    }
                }
            });
        }
    }


    $(document).off('keydown.ta_enter').on('keydown.ta_enter', function(e) {
        if (e.key === 'Enter') {
            // 1️⃣ 「上記の内容に同意する」リンクの2番目をクリック
            const $agreeLinks = $('a:contains("上記の内容に同意する")');

            if ($agreeLinks.length >= 2) {
                const $targetLink = $agreeLinks.eq(1);
                $targetLink.trigger('click');
                return;
            }

        }
    });


    async function updateStatus() {
        const savedData = await getSettings();
        let modeText;
        if (savedData.select === 'firstcome') {
            modeText = '先着';
        } else if (savedData.select === 'none') {
            modeText = 'なし';
        } else {
            modeText = 'リセール';
        }
        const onOffText = savedData.onoff ? 'ON' : 'OFF';
        $('#ta_status').text(`${modeText} | ${onOffText}`);
    }

    async function scrollAgreeButton(){ //同意するボタンまでスクロール

        const savedData = await getSettings();
        if(savedData.select != 'firstcome') return; //先着モードのみ

        setTimeout(() => {
            const $nextAgree = $('a:contains("上記の内容に同意する")').eq(1);
            if ($nextAgree.length) {
                $nextAgree.get(0).scrollIntoView({ behavior: 'instant', block: 'center' });
            }
        }, 100);
    }

    async function resaleGeneral() { //リセールの時に実行 cloak.pia.jp

        const savedData = await getSettings();
        if(savedData.select === 'resale') {

            // リセールチケット一覧ページでの処理
            if (window.location.href.includes('resale/item/list')) {
                // 一覧ページから各チケットの情報を取得
                // 実際のHTML構造に合わせてセレクターを修正
                // より広範囲なセレクタでチケット項目を特定
                const processedTickets = new Set(); // 重複チェック用
                
                $('.sl_resaleArchive_listItem, .sl_resaleItemList_item, .sl_resaleItemList_itemWrapper, div:contains("チケット×")').each(function() {
                    const $item = $(this);
                    
                    // チケット情報を抽出
                    let ticketInfo = {};
                    
                    // パターン1: 従来のセレクター（後方互換性のため）
                    if ($item.find('.sl_resaleArchive_listItem--title').length > 0) {
                        ticketInfo = {
                            performanceName: $item.find('.sl_resaleArchive_listItem--title').text().trim(),
                            performanceDate: $item.find('.sl_resaleArchive_listItem--date').text().trim(),
                            venue: $item.find('.sl_resaleArchive_listItem--venue').text().trim(),
                            ticketName: $item.find('.sl_resaleArchive_listItem--ticket').text().trim(),
                            ticketCount: $item.find('.sl_resaleArchive_listItem--count').text().trim()
                        };
                    } else {
                        // パターン2: 実際のHTML構造に基づく抽出
                        // 各チケット項目は連続するdiv要素として存在
                        const $ticketBlock = $item.closest('div').length ? $item.closest('div') : $item;
                        
                        // より具体的なセレクタで公演名を抽出
                        let extractedPerformanceName = '';
                        
                        // パターン1: h2タグから抽出
                        const $titleElement = $ticketBlock.find('h2').first();
                        if ($titleElement.length) {
                            extractedPerformanceName = $titleElement.text().trim();
                        }
                        
                        // パターン2: ## で始まる行から抽出
                        if (!extractedPerformanceName) {
                            const itemText = $ticketBlock.text();
                            const lines = itemText.split('\n').map(line => line.trim()).filter(line => line);
                            const titleLine = lines.find(line => line.startsWith('##'));
                            if (titleLine) {
                                extractedPerformanceName = titleLine.replace(/^##\s*/, '').trim();
                            }
                        }
                        
                        
                        const itemText = $ticketBlock.text();
                        const lines = itemText.split('\n').map(line => line.trim()).filter(line => line);
                        
                        
                        // 実際の構造に基づく抽出ロジック
                        let performanceName = extractedPerformanceName; // h2タグまたは##行から抽出した公演名を使用
                        let performanceDate = '';
                        let venue = '';
                        let ticketCount = '';
                        let ticketName = '';
                        
                        // 日時と会場の抽出
                        for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            
                            // 日時のパターン: YYYY/MM/DD(曜日) HH:MM 開演
                            if (/^\d{4}\/\d{1,2}\/\d{1,2}\([^)]+\)\s+\d{1,2}:\d{2}\s+開演/.test(line)) {
                                performanceDate = line;
                                // 次の行が会場の可能性が高い
                                if (i + 1 < lines.length) {
                                    venue = lines[i + 1];
                                }
                            }
                            
                            // チケット枚数のパターン: チケット×n枚
                            if (/^チケット×\d+枚$/.test(line)) {
                                // 「チケット×」部分を削除して「n枚」のみを取得
                                const match = line.match(/チケット×(\d+枚)/);
                                if (match) {
                                    ticketCount = match[1]; // 「1枚」「2枚」のみ
                                }
                                // 次の行がチケット名の可能性が高い
                                if (i + 1 < lines.length) {
                                    ticketName = lines[i + 1];
                                }
                            }
                        }
                        
                        ticketInfo = {
                            performanceName: performanceName,
                            performanceDate: performanceDate,
                            venue: venue,
                            ticketName: ticketName,
                            ticketCount: ticketCount
                        };
                    }
                    
                    // チケット情報が取得できた場合のみ処理
                    if (!ticketInfo.performanceName && !ticketInfo.performanceDate && !ticketInfo.venue) {
                        return; // この項目はスキップ
                    }
                    
                    // 重複チェック（同じチケット情報の重複処理を防ぐ）
                    const ticketKey = `${ticketInfo.performanceName}_${ticketInfo.performanceDate}_${ticketInfo.venue}_${ticketInfo.ticketName}_${ticketInfo.ticketCount}`;
                    if (processedTickets.has(ticketKey)) {
                        return; // 既に処理済み
                    }
                    processedTickets.add(ticketKey);
                    
                    // 条件判定
                    if (savedData.performance_date || savedData.venue || 
                        savedData.ticket_count || savedData.ticket_name) {
                        
                        // デバッグ情報を出力
                        console.log('=== チケット情報抽出 ===');
                        console.log('公演名:', ticketInfo.performanceName);
                        console.log('公演日:', ticketInfo.performanceDate);
                        console.log('会場:', ticketInfo.venue);
                        console.log('チケット名:', ticketInfo.ticketName);
                        console.log('枚数:', ticketInfo.ticketCount);
                        
                        const conditionsMet = checkTicketConditions(ticketInfo, savedData);
                        console.log('条件合致:', conditionsMet);
                        
                        // 履歴に保存
                        saveTicketHistory({
                            ...ticketInfo,
                            matched: conditionsMet,
                            action: conditionsMet ? 'purchased' : 'skipped',
                            conditions: {
                                performance_date: savedData.performance_date,
                                venue: savedData.venue,
                                ticket_count: savedData.ticket_count,
                                ticket_name: savedData.ticket_name
                            }
                        });
                        
                        // 条件合致時は購入リンクをクリック
                        if (conditionsMet) {
                            const $purchaseLink = $item.find('a:contains("チケット詳細を見る"), a:contains("購入に進む")').first();
                            if ($purchaseLink.length && $purchaseLink.attr('href')) {
                                window.open($purchaseLink.attr('href'), '_blank');
                            }
                        }
                    }
                });
            }
            
            if (window.location.href.includes('resale/item/detail')) {
                // サイトから情報を取得する関数
                function getSiteInfo() {
                    const info = {};
                    
                    // 公演名称を取得
                    const performanceName = $('th:contains("公演名称")').next('td').find('p').text().trim();
                    if (performanceName) info.performanceName = performanceName;
                    
                    // 公演日を取得
                    const performanceDate = $('th:contains("公演日")').next('td').find('p').text().trim();
                    if (performanceDate) info.performanceDate = performanceDate;
                    
                    // 会場を取得
                    const venue = $('th:contains("会場")').next('td').find('p').text().trim();
                    if (venue) info.venue = venue;
                    
                    // 開場時間は履歴に保存しないため削除
                    
                    // 料金詳細からチケット情報を取得
                    const ticketInfo = $('.sl_ticketDetailTable_title').text().trim();
                    if (ticketInfo) {
                        // チケット名称×n枚の形式から分割（×を除外）
                        const match = ticketInfo.match(/^(.+?)(\d+)枚$/);
                        if (match) {
                            let ticketName = match[1].trim();
                            // ×を削除
                            ticketName = ticketName.replace(/×$/, '');
                            
                            // 整理番号を取得してチケット名に含める
                            const seatNumbers = [];
                            $('.sl_ticketPriceDetail_name').each(function() {
                                const seatNumber = $(this).text().trim();
                                if (seatNumber) {
                                    seatNumbers.push(seatNumber);
                                }
                            });
                            
                            // 整理番号が複数ある場合は結合
                            if (seatNumbers.length > 0) {
                                ticketName += ' ' + seatNumbers.join(' ');
                            }
                            
                            info.ticketName = ticketName;
                            info.ticketCount = match[2] + '枚';
                        }
                    }
                    
                    return info;
                }
                
                // 正規表現による条件判定
                function checkConditions(siteInfo, savedData) {
                    let conditionsMet = true;
                    
                    // 公演日の条件チェック
                    if (savedData.performance_date && siteInfo.performanceDate) {
                        const dateRegex = new RegExp(savedData.performance_date);
                        if (!dateRegex.test(siteInfo.performanceDate)) {
                            conditionsMet = false;
                        }
                    }
                    
                    // 会場の条件チェック
                    if (savedData.venue && siteInfo.venue) {
                        const venueRegex = new RegExp(savedData.venue);
                        if (!venueRegex.test(siteInfo.venue)) {
                            conditionsMet = false;
                        }
                    }
                    
                    // チケット枚数の条件チェック
                    if (savedData.ticket_count && siteInfo.ticketCount) {
                        const countRegex = new RegExp(savedData.ticket_count);
                        if (!countRegex.test(siteInfo.ticketCount)) {
                            conditionsMet = false;
                        }
                    }
                    
                    // チケット名称の条件チェック（整理番号含む）
                    if (savedData.ticket_name && siteInfo.ticketName) {
                        const nameRegex = new RegExp(savedData.ticket_name);
                        if (!nameRegex.test(siteInfo.ticketName)) {
                            conditionsMet = false;
                        }
                    }
                    
                    return conditionsMet;
                }
                
                // 入力されている条件があるかチェック
                const hasConditions = savedData.performance_date || savedData.venue || 
                                    savedData.ticket_count || savedData.ticket_name;
                
                if (hasConditions) {
                    const siteInfo = getSiteInfo();
                    const conditionsMet = checkConditions(siteInfo, savedData);
                    
                    // チケット履歴を保存（条件合致・非合致問わず）
                    saveTicketHistory({
                        ...siteInfo,
                        matched: conditionsMet,
                        action: conditionsMet ? 'purchased' : 'skipped',
                        conditions: {
                            performance_date: savedData.performance_date,
                            venue: savedData.venue,
                            ticket_count: savedData.ticket_count,
                            ticket_name: savedData.ticket_name
                        }
                    });
                    
                    if (conditionsMet) {
                        // 条件に合致した場合、購入ボタンをクリック
            const $purchaseLink = $('a:contains("購入に進む")').first();
            if ($purchaseLink.length) {
                            // ボタンがクリック可能かチェック（disabled属性がない、またはhref属性がある）
                            const isClickable = !$purchaseLink.prop('disabled') && 
                                              !$purchaseLink.hasClass('disabled') && 
                                              $purchaseLink.attr('href') && 
                                              $purchaseLink.attr('href') !== '#';
                            
                            if (isClickable) {
                                // onoffをoffに設定
                                savedData.onoff = false;
                                await saveSettings(savedData);
                                
                                // 取得した情報をconsole.logで出力
                                console.log('=== 条件合致 - 購入実行 ===');
                                if (siteInfo.performanceName) console.log('公演名称:', siteInfo.performanceName);
                                if (siteInfo.performanceDate) console.log('公演日:', siteInfo.performanceDate);
                                if (siteInfo.venue) console.log('会場:', siteInfo.venue);
                                if (siteInfo.openTime) console.log('開場時間:', siteInfo.openTime);
                                if (siteInfo.ticketName) console.log('チケット名称（整理番号含む）:', siteInfo.ticketName);
                                
                                // ブラウザ通知を送信
                                const notificationMessage = `条件合致チケットが見つかりました！\n公演: ${siteInfo.performanceName || '不明'}\n日時: ${siteInfo.performanceDate || '不明'}\n会場: ${siteInfo.venue || '不明'}\nチケット: ${siteInfo.ticketName || '不明'}`;
                                sendNotification('🎫 チケットアシスト', notificationMessage);
                                
                window.open($purchaseLink.attr('href'), '_blank');
            }
                        }
                    }
                } else {
                    // 条件が設定されていない場合は従来通り購入ボタンをクリック
                    const $purchaseLink = $('a:contains("購入に進む")').first();
                    if ($purchaseLink.length) {
                        // ボタンがクリック可能かチェック
                        const isClickable = !$purchaseLink.prop('disabled') && 
                                          !$purchaseLink.hasClass('disabled') && 
                                          $purchaseLink.attr('href') && 
                                          $purchaseLink.attr('href') !== '#';
                        
                        if (isClickable) {
                            // チケット履歴を保存（条件なし）
                            const siteInfo = getSiteInfo();
                            saveTicketHistory({
                                ...siteInfo,
                                matched: true,
                                action: 'purchased',
                                conditions: {}
                            });
                            
                            // ブラウザ通知を送信
                            sendNotification('🎫 チケットアシスト', '購入ページを開きました');
                            
                            window.open($purchaseLink.attr('href'), '_blank');
                        }
                    }
                }
            }

            if (window.location.href.includes('resale/purchase')) {
            const $confirmBtn = $('button:contains("内容を確認する")').first();
            if ($confirmBtn.length) {
                $confirmBtn.trigger('click');
                }
            }


            //同意して購入申し込みを続けます→次へ
            if ($('label[for="add_registration_chk"]').length > 0) {
                $('label[for="add_registration_chk"]').trigger('click');　//申し込みチェックボックス
                $('span.sl_button_text').filter((_, el) => $(el).text().trim() === '次へ').trigger('click');　//次へ
            }


            //リセール購入内容確認
            if (window.location.href.includes('resale/purchase/confirm')) {
                $('label.sl_checkArea_label[for="allSelect"]').trigger('click'); //メールを全て解除
				$('input[type="password"][placeholder="セキュリティコードを入力"]').val(savedData.cvv || '');
                $('label.sl_checkArea_label[for="attentionCheckbox"]').trigger('click');

			//「購入する」をクリック
			if (savedData.purchase) {
				const $purchaseLink = $('a#purchaseConfirmNext:contains("チケットを購入する")').first();
				if ($purchaseLink.length) {
						// ブラウザ通知を送信
						sendNotification('🎫 チケットアシスト', '先着販売で購入を実行しました');
						
					$purchaseLink.get(0).click();
					}
				}
			}
        }
    }

    async function ticket_sale_pia(){

        const savedData = await getSettings();

        if(savedData.select === 'firstcome') {


            //情報をご確認・ご入力ください画面
            setTimeout(() => {
                const $checkbox =$('input[type="checkbox"][value="注意事項を確認し、同意しました。"].formInputCheckBox__input.enq-item');
                const isChecked = $checkbox.prop('checked');
                if($checkbox.length > 0 && isChecked === false) $('label.formInputCheckBox__label').trigger('click');

                const $btn = $('button.button--next:contains("決済引取方法の選択へ進む")')
                if ($btn.length > 0) {
                    $btn.get(0).scrollIntoView({ behavior: 'instant', block: 'center' });
                }
            },100);

            //決済・引取方法の選択
            setTimeout(() => {

                //決済方法：セブンイレブン
                $('span.accordion__icon:contains("セブン-イレブンで支払")').first().click();

                //引取方法：MOALA
                $('span.accordion__icon:contains("MOALAにて受取")').first().click();

                const $btn = $('button.button--next').filter(function() {
                    return $(this).text().trim() === '確認する';
                })
                if ($btn.length > 0) {
                    $btn.get(0).scrollIntoView({ behavior: 'instant', block: 'center' });
                }
            },100);

            //購入内容確認画面
            setTimeout(() => {
                const $btn = $('button.button--next[id="rlsPurchaseButton"]');
                if ($btn.length > 0) {
                    $('label.formInputCheckBox__label[for="allSelect"]').get(0).click() //メール配信解除
                    $btn.get(0).scrollIntoView({ behavior: 'instant', block: 'center' }); //購入するボタンまでスクロール
                    
                    // 購入ボタンをクリック
                    if (savedData.purchase) {
                        setTimeout(() => {
                            // ブラウザ通知を送信
                            sendNotification('🎫 チケットアシスト', '先着販売で購入を実行しました');
                            
                            $btn.get(0).click();
                        }, 500);
                    }
                }
            },100);
            $('label.formInputRadio__label[for="checkIsAgree2"]').trigger('click'); //同意する
        }
    }

    if (location.hostname === "sorry.pia.jp" || $('h2:contains("アクセスが集中しております")').length>0) {
        handleSorryPia();
        return;
    }

    $('body').prepend(`
        <p style="font-family: Arial, sans-serif; font-weight: 700;">
            <span class="TA_setting" style="cursor:pointer; user-select:none; padding-left:30px;">設定</span>
            <span id="ta_status" style="margin-left:30px; cursor:pointer; user-select:none;"></span>
        </p>
    `);

    $('body').append(`
        <div id="ta_modal_overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:none;z-index:9999;overflow-y:auto;-webkit-overflow-scrolling:touch;">
            <div id="ta_modal_content" style="background:#fff;padding:20px;border-radius:8px;max-width:95vw;width:400px;position:relative;margin:10px auto;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10001;">
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 8px; font-weight: bold;">
						<input type="checkbox" id="ta_onoff" style="transform: scale(1.3); margin-right: 10px;"> ON/OFF
					</label>
					<label style="display: block; margin-bottom: 8px; font-weight: bold;">
						<input type="checkbox" id="ta_purchase" style="transform: scale(1.3); margin-right: 10px;"> 購入
					</label>
				</div>
				
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">URL:</label>
					<input type="text" id="ta_url" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
                <div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">モード:</label>
                    <select id="ta_select" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-size:16px;">
                        <option value="none">なし</option>
                        <option value="resale">リセール</option>
                        <option value="firstcome">先着</option>
                    </select>
                </div>
                
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">インターバル(秒):</label>
					<input type="number" id="ta_interval" min="0.1" step="0.1" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">公演日:</label>
					<input type="text" id="ta_performance_date" placeholder="例: 2025/11/24" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">会場:</label>
					<input type="text" id="ta_venue" placeholder="例: 広島" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">チケット枚数:</label>
					<input type="text" id="ta_ticket_count" placeholder="例: 2枚" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">チケット名:</label>
					<input type="text" id="ta_ticket_name" placeholder="例: ^.*(VIP|SS|S).*$" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
				<div style="margin-bottom: 15px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">ぴあパスワード:</label>
					<input type="text" id="ta_pia_password" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
				<div style="margin-bottom: 20px;">
					<label style="display: block; margin-bottom: 5px; font-weight: bold;">CVV:</label>
					<input type="number" id="ta_cvv" min="0" step="1" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;" />
				</div>
				
                <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                    <button id="ta_save" style="background:#007BFF;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;min-width:80px;">保存</button>
                    <button id="ta_cancel" style="padding:10px 20px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff;font-size:14px;min-width:80px;">キャンセル</button>
                    <button id="ta_clear" style="padding:10px 20px;border:1px solid #f00;color:#f00;border-radius:4px;cursor:pointer;background:#fff;font-size:14px;min-width:80px;">クリア</button>
                    <button id="ta_history" style="padding:10px 20px;border:1px solid #28a745;color:#28a745;border-radius:4px;cursor:pointer;background:#fff;font-size:14px;min-width:80px;">履歴</button>
                </div>
            </div>
        </div>
    `);

    $(document).on('click', '.TA_setting', async function() {
        const savedData = await getSettings();
        $('#ta_url').val(savedData.url || location.href);
        $('#ta_onoff').prop('checked', savedData.onoff || false);
		$('#ta_purchase').prop('checked', savedData.purchase !== undefined ? !!savedData.purchase : false);
        $('#ta_select').val(savedData.select || 'none');
		$('#ta_pia_password').val(savedData.pia_password || '');
		$('#ta_cvv').val(savedData.cvv || '');
		$('#ta_ticket_name').val(savedData.ticket_name || '');
		$('#ta_ticket_count').val(savedData.ticket_count || '');
		$('#ta_performance_date').val(savedData.performance_date || '');
		$('#ta_venue').val(savedData.venue || '');
        $('#ta_interval').val(savedData.interval || 3);
	$('#ta_modal_overlay').fadeIn(200);
    });

    // 保存ボタン
    $('#ta_save').on('click', async function() {
        //通知許可
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const thisTabId = await getCurrentTabId();
        const data = {
            url: $('#ta_url').val(),
            onoff: $('#ta_onoff').is(':checked'),
            purchase: $('#ta_purchase').is(':checked'),
            select: $('#ta_select').val(),
            pia_password: $('#ta_pia_password').val() || '',
            cvv: $('#ta_cvv').val() || '',
            ticket_name: $('#ta_ticket_name').val() || '',
            ticket_count: $('#ta_ticket_count').val() || '',
            performance_date: $('#ta_performance_date').val() || '',
            venue: $('#ta_venue').val() || '',
            interval: $('#ta_interval').val() || 3,
            tabId: thisTabId
        };
        await saveSettings(data);
        $('#ta_modal_overlay').fadeOut(200);
        updateStatus();
        startRedirectIfNeeded();
    });

    // キャンセルボタン
    $('#ta_cancel').on('click', function() {
        $('#ta_modal_overlay').fadeOut(200);
    });

    // クリアボタン
    $('#ta_clear').on('click', async function() {
        const current = await getSettings();
        const preserved = {
            pia_password: current.pia_password || '',
            cvv: current.cvv || '',
            ticket_name: '',
            ticket_count: '',
            performance_date: '',
            venue: '',
            interval: 3,
            select: 'none',
            onoff: false,
            purchase: false,
            url: location.href,
            tabId: await getCurrentTabId()
        };
        await saveSettings(preserved);
        $('#ta_modal_overlay').fadeOut(200);
        updateStatus();
        startRedirectIfNeeded();
    });

    $(document).on('click', '#ta_status', async function() {
        const savedData = await getSettings();
        // ON/OFFを切り替え
        savedData.onoff = !savedData.onoff;
        await saveSettings(savedData);
        updateStatus();
        startRedirectIfNeeded();
    });

    $('#ta_save').on('click', async function() {

        //通知許可
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

		const data = {
			url: $('#ta_url').val(),
			onoff: $('#ta_onoff').is(':checked'),
			purchase: $('#ta_purchase').is(':checked'),
			select: $('#ta_select').val(),
			pia_password: $('#ta_pia_password').val() || '',
			cvv: $('#ta_cvv').val() || '',
			ticket_name: $('#ta_ticket_name').val() || '',
			ticket_count: $('#ta_ticket_count').val() || '',
			performance_date: $('#ta_performance_date').val() || '',
			venue: $('#ta_venue').val() || '',
			interval: $('#ta_interval').val() || 3,
			tabId: thisTabId
		};
        await saveSettings(data);
        $('#ta_modal_overlay').fadeOut(200);
        updateStatus();
        startRedirectIfNeeded();

    });

    $('#ta_cancel').on('click', function() {
        $('#ta_modal_overlay').fadeOut(200);
    });

    new MutationObserver(() => scrollAgreeButton())
        .observe(document.body, { childList: true, subtree: true });

	$('#ta_clear').on('click', async function() {
		const current = await getSettings();
		const preserved = {
			pia_password: current.pia_password || '',
			cvv: current.cvv || '',
			ticket_name: '',
			ticket_count: '',
			performance_date: '',
			venue: '',
			select: 'none',
			onoff: false
		};
		await GM_setValue('ta_settings', JSON.stringify(preserved));
		sessionStorage.removeItem('ta_tab_id');
		clearTicketHistory(); // チケット履歴もクリア
		alert('設定とチケット履歴をクリアしました。');
		document.title = "停止中";
		if (intervalId) {
			clearTimeout(intervalId);
			intervalId = null;
		}
		$('#ta_modal_overlay').fadeOut(200);
		updateStatus();
	});

    // 履歴ボタン（動的に生成されるボタンにも対応）
    $(document).on('click', '#ta_history', function() {
        showTicketHistory();
    });

    // 履歴モーダルの閉じる機能（一度だけ設定）
    $(document).on('click', '#ta_history_close', function() {
        $('#ta_history_overlay').remove();
    });

    // 履歴モーダルのオーバーレイクリックで閉じる（一度だけ設定）
    $(document).on('click', '#ta_history_overlay', function(e) {
        if (e.target.id === 'ta_history_overlay') {
            $('#ta_history_overlay').remove();
        }
    });

    // 履歴削除ボタン（一度だけ設定）
    $(document).on('click', '#ta_history_clear', function() {
        if (confirm('チケット履歴をすべて削除しますか？この操作は取り消せません。')) {
            clearTicketHistory();
            alert('チケット履歴を削除しました。');
            $('#ta_history_overlay').remove();
        }
    });

    // 個別チケット削除ボタン（一度だけ設定）
    $(document).on('click', '.ta_delete_ticket', function() {
        const ticketId = parseInt($(this).data('ticket-id'));
        const $ticketElement = $(this).closest('div');
        
        if (confirm('このチケットを削除しますか？\n\nこの操作は取り消せません。')) {
            deleteTicketHistory(ticketId);
            
            // アニメーション付きで削除
            $ticketElement.fadeOut(300, function() {
                $(this).remove();
                
                // 履歴件数を更新
                const remainingTickets = $('.ta_delete_ticket').length;
                $('#ta_history_content h2').text(`チケット履歴 (${remainingTickets}件)`);
            });
        }
	});

	if (location.hostname === "ticket-auth.pia.jp") {
		(async () => {
			const savedData = await getSettings();
			if (savedData.select !== 'none') {
			$('input[type="password"]').val(savedData.pia_password || '').trigger('input').trigger('change');
			$('button:contains("確認する"), button').filter(function() {
				return $(this).text().trim() === 'ログイン';//完全一致のみ
			}).trigger('click');
			}
		})();
	}

    if (location.hostname === "cloak.pia.jp") {
        resaleGeneral();
    }

    if (location.hostname === "ticket-sale.pia.jp") {
        ticket_sale_pia();
    }

    updateStatus();
    startRedirectIfNeeded();
    handleFirstCome();
});
