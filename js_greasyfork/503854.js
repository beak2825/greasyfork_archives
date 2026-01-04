// ==UserScript==
// @name         Melon Ticket API Logger
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Log 'summary' with realSeatCntlk >= 1 in formatted output or display '잔여 좌석이 없습니다' message from Melon Ticket API calls after the page is fully loaded
// @author       Your Name
// @match        https://ticket.melon.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503854/Melon%20Ticket%20API%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/503854/Melon%20Ticket%20API%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Melon Ticket API Logger Script Initialized');

    window.addEventListener('load', function() {
        console.log('Page fully loaded');

        // 기존 fetch를 백업
        const originalFetch = window.fetch;

        // fetch 함수를 오버라이드하여 요청을 감시
        window.fetch = async function() {
            const response = await originalFetch.apply(this, arguments);
            const url = arguments[0];

            // 특정 API 호출을 감지
            if (url.includes('/tktapi/product/block/summary.json')) {
                // 응답 데이터 처리
                const clonedResponse = response.clone();
                const responseData = await clonedResponse.text(); // 응답을 텍스트로 변환

                console.log("API Response:", responseData.interlockTypeCode); // 응답 데이터 확인

                // JSONP 콜백 함수 처리
                const jsonpCallbackMatch = /getBlockSummaryCountCallBack\(([^)]+)\)/.exec(responseData);
                if (jsonpCallbackMatch) {
                    const jsonData = jsonpCallbackMatch[1];
                    try {
                        // JSON 데이터의 양 끝에 불필요한 문자 제거
                        const cleanedJsonData = jsonData.trim();
                        // JSON 데이터가 너무 클 경우를 대비하여
                        if (cleanedJsonData.endsWith(';')) {
                            cleanedJsonData = cleanedJsonData.slice(0, -1); // ; 제거
                        }
                        // JSON 데이터가 유효한지 확인
                        if (/^[\[{]/.test(cleanedJsonData)) {
                            const parsedData = JSON.parse(cleanedJsonData);

                            // `summary` 배열이 있는지 확인
                            if (Array.isArray(parsedData.summary)) {
                                const filteredData = parsedData.summary.filter(item => item.realSeatCntlk > 0);

                                // 결과를 포맷팅하여 단일 console.log로 출력
                                if (filteredData.length > 0) {
                                    const result = filteredData.map(item => `${item.floorNo} ${item.floorName} ${item.areaNo} ${item.areaName} ${item.realSeatCntlk} 석`).join('\n');
                                    console.log(`잔여 좌석:\n${result}`);
                                } else {
                                    console.log('잔여 좌석이 없습니다');
                                }
                            } else {
                                console.error('응답 데이터에 summary 배열이 없습니다.');
                            }
                        } else {
                            console.error('응답 데이터가 유효한 JSON이 아닙니다.');
                        }
                    } catch (e) {
                        console.error('Failed to parse JSON data:', e);
                    }
                } else {
                    console.error('Failed to extract JSONP callback data.');
                }
            }

            return response;
        };

        // XMLHttpRequest 감시
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const url = xhr.responseURL;
                    if (url.includes('/tktapi/product/block/summary.json')) {
                        // 응답 데이터 처리
                        const responseData = xhr.responseText;

                        console.log("API Response:", responseData.interlockTypeCode); // 응답 데이터 확인

                        // JSONP 콜백 함수 처리
                        const jsonpCallbackMatch = /getBlockSummaryCountCallBack\(([^)]+)\)/.exec(responseData);
                        if (jsonpCallbackMatch) {
                            const jsonData = jsonpCallbackMatch[1];
                            try {
                                // JSON 데이터의 양 끝에 불필요한 문자 제거
                                const cleanedJsonData = jsonData.trim();
                                // JSON 데이터가 너무 클 경우를 대비하여
                                if (cleanedJsonData.endsWith(';')) {
                                    cleanedJsonData = cleanedJsonData.slice(0, -1); // ; 제거
                                }
                                // JSON 데이터가 유효한지 확인
                                if (/^[\[{]/.test(cleanedJsonData)) {
                                    const parsedData = JSON.parse(cleanedJsonData);

                                    // `summary` 배열이 있는지 확인
                                    if (Array.isArray(parsedData.summary)) {
                                        const filteredData = parsedData.summary.filter(item => item.realSeatCntlk > 0);

                                        // 결과를 포맷팅하여 단일 console.log로 출력
                                        if (filteredData.length > 0) {
                                            const result = filteredData.map(item => `${item.floorNo} ${item.floorName} ${item.areaNo} ${item.areaName} ${item.realSeatCntlk} 석`).join('\n');
                                            console.log(`잔여 좌석:\n${result}`);
                                        } else {
                                            console.log('잔여 좌석이 없습니다');
                                        }
                                    } else {
                                        console.error('응답 데이터에 summary 배열이 없습니다.');
                                    }
                                } else {
                                    console.error('응답 데이터가 유효한 JSON이 아닙니다.');
                                }
                            } catch (e) {
                                console.error('Failed to parse JSON data:', e);
                            }
                        } else {
                            console.error('Failed to extract JSONP callback data.');
                        }
                    }
                }
            });
            return xhr;
        };
    });
})();
