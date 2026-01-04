// ==UserScript==
// @name        [루시퍼홍] 카카오맵 톡보내기
// @namespace   Violentmonkey Scripts
// @match       https://m.map.kakao.com/*
// @grant       none
// @version     3.4
// @description 2024. 8. 8. 오전 10:25:00
// @downloadURL https://update.greasyfork.org/scripts/502738/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A7%B5%20%ED%86%A1%EB%B3%B4%EB%82%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502738/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%B9%B4%EC%B9%B4%EC%98%A4%EB%A7%B5%20%ED%86%A1%EB%B3%B4%EB%82%B4%EA%B8%B0.meta.js
// ==/UserScript==

function loadKakaoSDK(callback) {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.onload = callback;
    document.head.appendChild(script);
}

function initializeKakao() {
    if (!Kakao.isInitialized()) {
        Kakao.init('f8b22dd04c1cb7675e00b57f1ddad9e8'); // Replace with your JavaScript Key
        console.log('Kakao initialized:', Kakao.isInitialized()); // Check if initialization was successful
    } else {
        console.log('Kakao is already initialized.');
    }
}

// Function to ensure access token is valid
/*
async function ensureValidAccessToken() {
    try {
        let accessToken = Kakao.Auth.getAccessToken();

        if (!accessToken) {
            console.log('No access token found, attempting to log in.');
            await loginWithKakao();
        } else {
            // 토큰이 유효한지 체크
            Kakao.Auth.getStatus((status) => {
                if (status === Kakao.Auth.Status.AUTHENTICATED) {
                    console.log('Access token is valid:', accessToken);
                } else {
                    console.log('Access token is invalid, logging out and in again.');
                    Kakao.Auth.logout(() => {
                        loginWithKakao(); // 로그아웃 후 재로그인 시도
                    });
                }
            });
        }
    } catch (error) {
        console.error('Failed to ensure valid access token:', error);
        // 오류 발생 시 로그아웃 후 재로그인 시도
        Kakao.Auth.logout(() => {
            loginWithKakao();
        });
    }
}
*/
async function ensureValidAccessToken() {
    try {
        let accessToken = Kakao.Auth.getAccessToken();

        if (!accessToken) {
            console.log('No access token found, attempting to log in.');
            await loginWithKakao();
        } else {
            // 토큰의 유효성을 검사하기 위해 간단히 API 요청을 시도하여 유효하지 않은 경우 로그아웃 후 다시 로그인합니다.
            Kakao.API.request({
                url: '/v1/user/access_token_info',
                success: function(response) {
                    console.log('Access token is valid:', accessToken);
                },
                fail: function(error) {
                    console.log('Access token is invalid, logging out and in again:', error);
                    Kakao.Auth.logout(() => {
                        loginWithKakao(); // 로그아웃 후 재로그인 시도
                    });
                }
            });
        }
    } catch (error) {
        console.error('Failed to ensure valid access token:', error);
        // 오류 발생 시 로그아웃 후 재로그인 시도
        Kakao.Auth.logout(() => {
            loginWithKakao();
        });
    }
}


// Function to log in with Kakao
async function loginWithKakao() {
    return new Promise((resolve, reject) => {
        console.log('Attempting Kakao login...');
        Kakao.Auth.login({
            scope: 'talk_message', // Add the required scope here
            success: function(authObj) {
                console.log('Login successful:', authObj);
                resolve(authObj);
            },
            fail: function(err) {
                console.error('Login failed:', err);
                alert('Failed to log in.');
                reject(err);
            }
        });
    });
}

// Function to inject custom CSS
function injectCustomCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .map_area .tooltip_map .link_btn:not(:first-child) {
            height: auto !important;
        }
        .link_tit_tooltip {
            display: block;
            text-align: center;
            width: 100%;
            border: none !important; /* Remove border */
        }
        .tit_tooltip {
            display: inline-block;
            text-align: center;
            border: none !important; /* Remove border */
            font-size: 14px; /* Initial font size */
            white-space: nowrap; /* Prevent text from wrapping */
            font-weight: bold; /* Make text bold */
            overflow: hidden; /* Hide overflow */
            text-overflow: ellipsis; /* Add ellipsis */
            max-width: 160px; /* Adjust max width */
        }
        .link_btn {
            cursor: pointer;
            width: 92%; /* Ensure button spans 92% width */
            background-color: #fff; /* Button background color */
            color: #000; /* Button text color */
            padding: 5px; /* Button padding */
            border: 1px solid #ccc; /* Button border */
            border-radius: 5px; /* Button border radius */
            text-align: center;
            display: block;
            font-size: 12px; /* Button font size */
            font-weight: bold;
            text-decoration: none;
            margin: 5px 0; /* Button margin */
        }
        .ico_roadview,
        .ico_route,
        .ico_send_message {
            color: #000; /* Icon text color */
        }
        .inner_tooltip {
            max-width: 300px; /* Adjust max-width */
            word-wrap: break-word; /* Break long words */
            padding: 10px; /* Add padding to inner_tooltip */
            box-sizing: border-box; /* Ensure padding is included in the width */
        }
        .inner_tooltip table {
            width: 100%;
            table-layout: fixed; /* Fix table layout */
            word-wrap: break-word; /* Break long words */
        }
        .inner_tooltip td {
            font-size: 12px; /* Smaller font size for content */
            word-wrap: break-word; /* Break long words */
            white-space: pre-line; /* Preserve spaces and line breaks */
        }
    `;
    document.head.append(style);
}

// 메시지 전송 버튼 생성
function addSendMessageButton(innerTooltip, placename) {
    // Remove existing 톡보내기 button if present
    const existingSendMessageBtn = innerTooltip.querySelector('.link_send_message');
    if (existingSendMessageBtn) {
        existingSendMessageBtn.remove();
    }

    const sendMessageBtn = document.createElement('a');
    sendMessageBtn.href = 'javascript:;';
    sendMessageBtn.target = '_blank';
    sendMessageBtn.classList.add('link_btn', 'link_send_message');
    sendMessageBtn.innerHTML = '<span class="ico_send_message">톡보내기</span>';
    sendMessageBtn.style.display = 'block';
    sendMessageBtn.style.width = '92%';
    sendMessageBtn.style.padding = '5px';
    sendMessageBtn.style.border = '1px solid #ccc';
    sendMessageBtn.style.borderRadius = '5px';
    sendMessageBtn.style.backgroundColor = '#fff';
    sendMessageBtn.style.margin = '5px 0';
    sendMessageBtn.style.lineHeight = 'normal';
    sendMessageBtn.style.verticalAlign = 'middle';
    sendMessageBtn.style.fontSize = '12px';





    const handleButtonClick = async () => {
        console.log('톡보내기 버튼이 클릭됨');
        const combinedInfoElement = innerTooltip.querySelector("td.combined_info");
        let textToSend = combinedInfoElement ? combinedInfoElement.innerHTML : "No text found";

        // Remove <br> tags and replace with \n for line breaks
        textToSend = textToSend.replace(/<br>/g, '\n');

        console.log('Button clicked, text to send:', textToSend);
        const currentUrl = window.location.href; // Get the current URL

        try {
            console.log('Checking Kakao login status...');
            await ensureValidAccessToken();  // 토큰 유효성 체크 및 갱신
            console.log('Sending message...');
            await sendMessageToMyChat(textToSend, currentUrl);  // 메시지 전송
        } catch (error) {
            console.error('Error during login or sending message:', error);
        }
    };

    sendMessageBtn.addEventListener('click', handleButtonClick);
    sendMessageBtn.addEventListener('touchend', handleButtonClick);

    return sendMessageBtn;
}

// 스타일 버튼 함수
function styleButton(button) {
    button.style.display = 'block';
    button.style.width = '92%';
    button.style.padding = '5px';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#fff';
    button.style.margin = '5px 0';
    button.style.lineHeight = 'normal';
    button.style.verticalAlign = 'middle';
    button.style.fontSize = '12px';
}

// Function to fetch and insert information into the tooltip
function fetchAndInsertInfo(tooltip) {
    const dataId = tooltip.getAttribute('data-id');
    const placename = tooltip.getAttribute('data-title')

console.log(dataId, placename)
    if (!dataId || !placename) {
        console.log('Data ID or placename not found, using default.');
        insertDefaultInfo(tooltip, placename);
        return;
    }

    fetch(`https://luciferhong.duckdns.org:8888/proxy/${dataId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.realestateDanjiInfo) {
                throw new Error('Missing realestateDanjiInfo');
            }

            // Sort the 구성면적 values in ascending order and add m² symbol
            const sortedArea = data.realestateDanjiInfo.typeList
                .map(type => parseInt(type))
                .sort((a, b) => a - b)
                .map(type => `${type}m²`);

            const combinedInfo = `${truncateText(data.basicInfo.placenamefull, 30)}
주소: ${data.basicInfo.address.newaddr.newaddrfull} (${data.basicInfo.address.region.fullname})
준공년월: ${data.realestateDanjiInfo.buildDate}
총 세대수: ${data.realestateDanjiInfo.houseCnt}
총 동수: ${data.realestateDanjiInfo.dongCnt}
구성면적: ${sortedArea[0]} ~ ${sortedArea[sortedArea.length - 1]}`;

            const innerTooltip = tooltip.querySelector('.inner_tooltip');
            if (innerTooltip) {
                // Remove existing tit_tooltip if present
                const existingTitTooltip = innerTooltip.querySelector('.tit_tooltip');
                let titTooltipContent = '';
                if (existingTitTooltip) {
                    titTooltipContent = existingTitTooltip.parentNode.outerHTML;
                    existingTitTooltip.parentNode.remove();
                }

                // Create a table to hold the tooltip content
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.tableLayout = 'fixed'; // Fix table layout

                // Create the first row for tit_tooltip
                const tr1 = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.classList.add('tit_tooltip');
                td1.style.textAlign = 'center'; // Center-align text
                td1.innerHTML = titTooltipContent;
                tr1.appendChild(td1);

                // Create the second row for combined_info
                const tr2 = document.createElement('tr');
                const td2 = document.createElement('td');
                td2.classList.add('combined_info');
                td2.innerHTML = combinedInfo.replace(/\n/g, '<br>'); // Replace newline with <br> for display
                td2.style.textAlign = 'center'; // Center-align text
                tr2.appendChild(td2);

                // Create individual rows for each button
                const roadViewBtn = innerTooltip.querySelector('.link_btn.link_roadview');
                const routeBtn = innerTooltip.querySelector('.link_btn.link_route');

                styleButton(roadViewBtn);
                styleButton(routeBtn);

                const tr3 = document.createElement('tr');
                const td3 = document.createElement('td');
                td3.style.textAlign = 'center';
                td3.appendChild(roadViewBtn);
                tr3.appendChild(td3);

                const tr4 = document.createElement('tr');
                const td4 = document.createElement('td');
                td4.style.textAlign = 'center';
                td4.appendChild(routeBtn);
                tr4.appendChild(td4);

                const tr5 = document.createElement('tr');
                const td5 = document.createElement('td');
                td5.style.textAlign = 'center';
                const sendMessageBtn = addSendMessageButton(innerTooltip, placename);
                td5.appendChild(sendMessageBtn);
                tr5.appendChild(td5);

                // Append all rows to the table
                table.appendChild(tr1);
                table.appendChild(tr2);
                table.appendChild(tr3);
                table.appendChild(tr4);
                table.appendChild(tr5);

                // Clear the innerTooltip and append the table
                innerTooltip.innerHTML = '';
                innerTooltip.appendChild(table);

                console.log('Tooltip updated with new content.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            insertDefaultInfo(tooltip, placename);
        });
}

// 기본 정보를 삽입하는 함수
function insertDefaultInfo(tooltip, placename) {
    const innerTooltip = tooltip.querySelector('.inner_tooltip');
    if (innerTooltip) {
        // 기존 tit_tooltip이 존재하면 제거
        const existingTitTooltip = innerTooltip.querySelector('.tit_tooltip');
        let titTooltipContent = '';
        if (existingTitTooltip) {
            titTooltipContent = existingTitTooltip.parentNode.outerHTML;
            existingTitTooltip.parentNode.remove();
        }

        // 툴팁 내용을 보관할 테이블 생성
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.tableLayout = 'fixed'; // 고정된 테이블 레이아웃

        // tit_tooltip을 위한 첫 번째 행 생성
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.classList.add('tit_tooltip');
        td1.style.textAlign = 'center'; // 텍스트를 가운데 정렬
        td1.innerHTML = titTooltipContent;
        tr1.appendChild(td1);

        // placename을 표시하는 두 번째 행 생성
        const tr2 = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.classList.add('combined_info');
        td2.innerHTML = placename || 'Unknown place'; // placename이 있으면 표시하고, 없으면 Unknown place
        td2.style.textAlign = 'center'; // 텍스트를 가운데 정렬
        tr2.appendChild(td2);

        // 각각의 버튼을 위한 행 생성
        const roadViewBtn = innerTooltip.querySelector('.link_btn.link_roadview');
        const routeBtn = innerTooltip.querySelector('.link_btn.link_route');

        styleButton(roadViewBtn);
        styleButton(routeBtn);

        const tr3 = document.createElement('tr');
        const td3 = document.createElement('td');
        td3.style.textAlign = 'center';
        td3.appendChild(roadViewBtn);
        tr3.appendChild(td3);

        const tr4 = document.createElement('tr');
        const td4 = document.createElement('td');
        td4.style.textAlign = 'center';
        td4.appendChild(routeBtn);
        tr4.appendChild(td4);

        const tr5 = document.createElement('tr');
        const td5 = document.createElement('td');
        td5.style.textAlign = 'center';
        const sendMessageBtn = addSendMessageButton(innerTooltip, placename);
        td5.appendChild(sendMessageBtn);
        tr5.appendChild(td5);

        // 모든 행을 테이블에 추가
        table.appendChild(tr1);
        table.appendChild(tr2);
        table.appendChild(tr3);
        table.appendChild(tr4);
        table.appendChild(tr5);

        // innerTooltip을 초기화하고 테이블을 추가
        innerTooltip.innerHTML = '';
        innerTooltip.appendChild(table);

        console.log('Tooltip updated with default content.');
    }
}

// 텍스트를 자르는 함수
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

async function sendMessageToMyChat(text, url) {
    try {
        if (text) {
            console.log('Sending message with text:', text);
            console.log('Current URL:', url);
            Kakao.API.request({
                url: '/v2/api/talk/memo/default/send',
                data: {
                    template_object: {
                        object_type: 'text',
                        text: text,
                        link: {
                            web_url: url,
                            mobile_web_url: url
                        }
                    }
                },
                success: function(response) {
                    console.log('Message sent successfully:', response);
                },
                fail: function(error) {
                    console.log('Failed to send message:', error);
                    alert('Failed to send message.');
                }
            });
        } else {
            alert('No text found to send.');
        }
    } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message.');
    }
}

// Function to detect the appearance of the tooltip and trigger info fetch
function detectTooltipAndFetchInfo() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.tooltip_map.default_info.no_marker') || node.querySelector('.tooltip_map.default_info.no_marker')) {
                            const tooltip = node.matches('.tooltip_map.default_info.no_marker') ? node : node.querySelector('.tooltip_map.default_info.no_marker');
                            console.log('Tooltip detected:', tooltip);
                            fetchAndInsertInfo(tooltip);
                        }
                    }
                });
            }
        });
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document.body, config);
}

// Start observing the document after a short delay to ensure all elements are loaded
setTimeout(() => {
    loadKakaoSDK(() => {
        initializeKakao();

        // Inject custom CSS to override existing styles
        injectCustomCSS();

        // Detect tooltips and fetch info
        detectTooltipAndFetchInfo();
    });
}, 1000); // Adjust the delay as necessary
