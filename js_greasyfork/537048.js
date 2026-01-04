// ==UserScript==
// @name         안전신문고 진행상태 상세 표시 및 요약 업데이트
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  나의 안전신고 목록에서 '진행' 상태를 더 명확하게 표시하고, 상단 요약 정보(표, 그래프)도 이에 맞춰 업데이트합니다.
// @author       Gamnamudan
// @match        https://www.safetyreport.go.kr/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      self
// @connect      www.safetyreport.go.kr
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537048/%EC%95%88%EC%A0%84%EC%8B%A0%EB%AC%B8%EA%B3%A0%20%EC%A7%84%ED%96%89%EC%83%81%ED%83%9C%20%EC%83%81%EC%84%B8%20%ED%91%9C%EC%8B%9C%20%EB%B0%8F%20%EC%9A%94%EC%95%BD%20%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/537048/%EC%95%88%EC%A0%84%EC%8B%A0%EB%AC%B8%EA%B3%A0%20%EC%A7%84%ED%96%89%EC%83%81%ED%83%9C%20%EC%83%81%EC%84%B8%20%ED%91%9C%EC%8B%9C%20%EB%B0%8F%20%EC%9A%94%EC%95%BD%20%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .custom-status-box {
            display: inline-block; padding: 2px 8px; font-size: 1.2rem; font-weight: normal;
            line-height: 1.5; text-align: center; white-space: nowrap; vertical-align: baseline;
            border-radius: .25em; min-width: 40px; color: #fff; cursor: help;
        }
        .custom-status-pending-reception { background-color: #f5941f; }
        .custom-status-received-by-agency { background-color: #20a95f; }
        .custom-status-error-fetching { background-color: #e54e53; }
    `);

    function fetchTransferHistory(cNo) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `/api/v1/portal/mypage/mysafereport/trnsfhist/${cNo}`,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve({ cNo, data });
                        } catch (e) {
                            reject({ cNo, error: new Error(`JSON Parse Error for ${cNo}`) });
                        }
                    } else {
                        reject({ cNo, error: new Error(`API Error ${response.status} for ${cNo}`) });
                    }
                },
                onerror: function(error) {
                    reject({ cNo, error: new Error(`Network Error for ${cNo}`) });
                }
            });
        });
    }

    async function updateSingleReportStatus(statusSpan, cNo) {
        return fetchTransferHistory(cNo).then(result => {
            const { data } = result;
            statusSpan.className = '';
            statusSpan.classList.add('custom-status-box');

            const singoHist = data.singoHist || {};
            const trnsfHistList = data.singoTrnsfHistList || [];
            const sendYnC = singoHist.SEND_YN_C;
            const cNowNm = singoHist.C_NOW_NM || '진행';
            const lastTrnsfHist = trnsfHistList.length > 0 ? trnsfHistList[trnsfHistList.length - 1] : {};
            let rcptnInsttNm = (lastTrnsfHist.RCPTN_ALL_INSTT_NM || '').replace('경찰청 ', '');

            if (sendYnC === 'N') {
                statusSpan.textContent = '진행 (접수대기)';
                statusSpan.classList.add('custom-status-pending-reception');
                statusSpan.title = '시스템 처리 중, 아직 기관에 접수되지 않았습니다.';
                statusSpan.dataset.detailedStatus = 'pending';
            } else if (sendYnC === 'S') {
                if (cNowNm.trim() === '진행' && rcptnInsttNm) {
                     statusSpan.textContent = `진행 (기관확인중)`;
                } else {
                    statusSpan.textContent = `${cNowNm}`;
                }
                statusSpan.classList.add('custom-status-received-by-agency');
                statusSpan.title = `처리기관: ${rcptnInsttNm || '확인중'}\n실제상태: ${cNowNm}`;
                statusSpan.dataset.detailedStatus = 'received';
            } else {
                statusSpan.textContent = '진행 (상태확인필요)';
                statusSpan.classList.add('custom-status-error-fetching');
                statusSpan.title = `상태 확인 필요 (sendYnC: ${sendYnC})`;
                statusSpan.dataset.detailedStatus = 'unknown';
            }
            return statusSpan.dataset.detailedStatus;
        }).catch(errorResult => {
            console.error(`Error processing cNo ${errorResult.cNo}:`, errorResult.error);
            statusSpan.className = '';
            statusSpan.classList.add('custom-status-box', 'custom-status-error-fetching');
            statusSpan.textContent = '진행 (상태오류)';
            statusSpan.title = '상태 정보를 가져오는데 실패했습니다.';
            statusSpan.dataset.detailedStatus = 'error';
            return 'error';
        });
    }

    function updateSummaryAndChart(statuses) {
        const totalReportsElement = document.querySelector('p.bbs_info strong');
        if (!totalReportsElement) {
            console.warn("총 신고 건수 요소를 찾을 수 없습니다.");
            return;
        }
        const totalReports = parseInt(totalReportsElement.textContent.trim()) || 0;

        let actualProgressCount = 0;
        statuses.forEach(status => {
            if (status === 'received') {
                actualProgressCount++;
            }
        });

        const summaryTableBody = document.getElementById('tableCntBody');
        const chartContainer = document.getElementById('singoStatisticsChart');

        if (!summaryTableBody || !chartContainer) {
            console.warn("요약 테이블 또는 차트 컨테이너를 찾을 수 없습니다.");
            return;
        }

        const summaryCells = summaryTableBody.querySelectorAll('td');
        if (summaryCells.length < 4) {
            console.warn("요약 테이블 셀이 충분하지 않습니다.");
            return;
        }

        const withdrawnCount = parseInt(summaryCells[2].textContent.trim()) || 0;
        const completedCount = parseInt(summaryCells[3].textContent.trim()) || 0;

        summaryCells[0].textContent = totalReports;
        summaryCells[1].textContent = actualProgressCount;

        const chartListItems = chartContainer.querySelectorAll('ul > li');
        if (chartListItems.length < 12) {
            console.warn("차트 리스트 아이템이 충분하지 않습니다.");
            return;
        }

        const updateChartItem = (baseIndex, count, label) => {
            if (totalReports === 0 && count > 0) {
                 console.warn(`'${label}' 항목 건수는 ${count}이지만, 총 신고 건수가 0입니다. 퍼센티지를 0으로 설정합니다.`);
            }
            const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;

            const countStrong = chartListItems[baseIndex + 1].querySelector('.lst_safe strong');
            if (countStrong) countStrong.textContent = count;

            const barSpan = chartListItems[baseIndex + 2].querySelector('.g_action');
            const percentStrong = chartListItems[baseIndex + 2].querySelector('.g_percent strong');

            if (barSpan) barSpan.style.width = `${Math.round(percentage)}%`;
            if (percentStrong) percentStrong.textContent = Math.round(percentage);
        };

        updateChartItem(0, totalReports, '신고');
        updateChartItem(3, actualProgressCount, '진행');
        updateChartItem(6, withdrawnCount, '취하');
        updateChartItem(9, completedCount, '답변완료');
    }


    async function processPageUpdates() {
        const reportRows = document.querySelectorAll('#table1Body tr');
        if (!reportRows.length) return;

        const promises = [];
        for (const row of reportRows) {
            const statusSpan = row.querySelector('td.bbs_subject span[class*="ico_state_"]');
            const cNoInput = row.querySelector('input[name="cNo"]');

            if (statusSpan && cNoInput && statusSpan.textContent.trim() === '진행' && statusSpan.dataset.statusUpdated !== 'true') {
                statusSpan.dataset.statusUpdated = 'true';
                promises.push(updateSingleReportStatus(statusSpan, cNoInput.value));
            } else if (statusSpan && statusSpan.textContent.trim() !== '진행' && statusSpan.dataset.statusUpdated !== 'true') {
                statusSpan.dataset.statusUpdated = 'true';
                statusSpan.dataset.detailedStatus = 'original';
                 promises.push(Promise.resolve(statusSpan.dataset.detailedStatus));
            } else if (statusSpan && statusSpan.dataset.statusUpdated === 'true' && statusSpan.dataset.detailedStatus){
                promises.push(Promise.resolve(statusSpan.dataset.detailedStatus));
            }
        }

        if (promises.length > 0) {
            Promise.all(promises).then(statuses => {
                updateSummaryAndChart(statuses.filter(s => s));
            }).catch(error => {
                console.error("전체 상태 업데이트 중 오류 발생:", error);
            });
        } else {
             const currentDetailedStatuses = [];
             document.querySelectorAll('#table1Body td.bbs_subject span[data-detailed-status]').forEach(s => {
                 currentDetailedStatuses.push(s.dataset.detailedStatus);
             });
             if(currentDetailedStatuses.length > 0 || document.querySelector('p.bbs_info strong')){
                updateSummaryAndChart(currentDetailedStatuses);
             }
        }
    }

    const targetNode = document.getElementById('content');
    if (targetNode) {
        const observerConfig = { childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            if (document.querySelector('#table1Body tr') || document.querySelector('p.bbs_info strong')) {
                debounce(processPageUpdates, 500)();
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, observerConfig);
        if (document.querySelector('#table1Body tr') || document.querySelector('p.bbs_info strong')) {
             processPageUpdates();
        }
    } else {
        console.warn("Target node for MutationObserver ('content') not found.");
        window.addEventListener('load', () => {
            if (document.querySelector('#table1Body tr') || document.querySelector('p.bbs_info strong')) {
                processPageUpdates();
            }
        });
    }

    let debounceTimer;
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
})();