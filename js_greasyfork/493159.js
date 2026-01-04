// ==UserScript==
// @name        Humoruniv Helper
// @description 웃긴대학(huv.kr)의 블라인드/키워드 필터링 강화, 단축키 추가 및 알림 소리 기능
// @namespace   http://tampermonkey.net/
// @match       *.humoruniv.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @version     1.274
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/493159/Humoruniv%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493159/Humoruniv%20Helper.meta.js
// ==/UserScript==

class Utils {
    static getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    static scrollTo(position) {
        window.scrollTo(0, position);
    }

    static showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            opacity: 0.9;
            z-index: 10000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    static getPageType(url) {
        const urlPatterns = [
            { pattern: '/board/humor/list.html?table=', type: 'list' },
            { pattern: '/board/humor/read.html?table=', type: 'read' },
            { pattern: 'write.html', type: 'write' },
            { pattern: '/user/blind_list', type: 'manage' },
            { pattern: '/user/filter_list', type: 'manage' },
            { pattern: 'memo.html', type: 'memo' },
        ];
        return urlPatterns.find(({ pattern }) => url.includes(pattern))?.type || 'other';
    }

    static getOS() {
        const platform = navigator.platform.toLowerCase();
        if (platform.includes('mac')) return 'Mac';
        if (platform.includes('win')) return 'Windows';
        return 'Other';
    }

    static async fetchHtml(url) {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'text/html; charset=euc-kr'
            }
        });
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('euc-kr');
        return decoder.decode(buffer);
    }
}

class HumorunivHelper {
    constructor() {
        this.url = window.location.href;
        this.pageType = Utils.getPageType(this.url);
        this.os = Utils.getOS();
        this.isMobile = this.url.includes('https://m.hum');
        this.isWrite = this.url.includes('write.html');
        this.isRead = this.pageType === 'read';
        this.pagePos = this.url.lastIndexOf('&pg=');
        this.page = this.pagePos === -1 ? 0 : Number(this.url.substring(this.pagePos + 4));
        this.keydownListenerAdded = false;

        this.init();
    }

    init() {
        if (this.url.includes('&st=') && !this.isRead && window.top === window.self) {
            this.filterContent();
        }
        window.addEventListener('load', () => { // 모든 리소스 로딩이 완료된 후에 설정
            this.setupEventListeners(); // 단축키 리스너를 load 이벤트 후에 설정
            this.initializeFilterPostLoad();
            this.addTampermonkeyMenu(); // load 이벤트에서 한 번만 실행
            this.setupNotification(); // load 이벤트에서 한 번만 실행
        });

        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                setTimeout(() => {
                    this.setupEventListeners(); // 폼 제출 후 다시 설정
                }, 0);
            });
        });
    }

    setupEventListeners() {
        if (window.top === window.self && !this.keydownListenerAdded) {
            window.addEventListener('keydown', this.handleKeyDown.bind(this));
            this.keydownListenerAdded = true; // 리스너가 추가되었음을 표시
        } else {
            window.addEventListener('keydown', (e) => {
                if (!e.ctrlKey) {
                    e.preventDefault();
                    const newEvent = new KeyboardEvent('keydown', { ...e, bubbles: true });
                    window.top.dispatchEvent(newEvent);
                }
            });
        }
    }

    initializeFilterPostLoad() {
        if (this.url.includes('/user/blind_list') && window.top === window.self) {
            this.manageBlindList();
        } else if (this.url.includes('/user/filter_list') && window.top === window.self) {
            this.saveValues('keywords');
        }
    }

    navigatePage(direction) {
        const target = window.top;
        if (direction === 'next') {
            target.location.href = this.pagePos === -1 ? `${this.url}&pg=1` : `${this.url.substring(0, this.pagePos)}&pg=${this.page + 1}`;
        } else {
            target.location.href = this.page === 0 ? window.location.reload(true) : `${this.url.substring(0, this.pagePos)}&pg=${this.page - 1}`;
        }
    }

    handleKeyDown(e) {
        if (e.ctrlKey || this.isWrite || this.isInputElement(document.activeElement, e)) return;

        const actions = {
            'f': () => this.navigateWithSelector("#wrap_preview > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > a", 'next'),
            's': () => this.navigateWithSelector("#wrap_preview > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a", 'prev', this.isRead),
            'e': () => Utils.scrollTo(0),
            'd': () => Utils.scrollTo(document.documentElement.scrollHeight),
            'v': () => window.top.location.href = "javascript:recomm_ok();",
            'w': () => this.navigateToWaitList(),
            'r': () => this.navigateToNotiList(),
            'c': (e) => this.toggleCommentFocus(e)
        };

        if (actions[e.key.toLowerCase()]) {
            actions[e.key.toLowerCase()](e);
        } else if (e.key === "Escape") {
            $(':focus').blur();
        }
    }

    isInputElement(element, event) {
        return ['input', 'textarea', 'select'].includes(element.tagName.toLowerCase()) &&
            !(event.key === 'Escape' || (event.key.toLowerCase() === 'c' && event.altKey));
    }

    navigateWithSelector(selector, direction, isRead) {
        const element = window.top.document.querySelector(selector);
        if (element) {
            element.click();
        } else if (isRead && direction === 'prev') {
            window.top.location.reload(true);
        } else {
            this.navigatePage(direction);
        }
    }

    navigateToWaitList() {
        const waitListUrl = "https://web.humoruniv.com/board/humor/list.html?table=pdswait";
        if (this.url.includes(waitListUrl) && this.page === 0) {
            Utils.getElementByXpath("/html/body/div/div/div[2]/div[2]/div[2]/div[1]/table[2]/tbody/tr[1]/td[2]/a").click();
        } else {
            window.top.location.href = waitListUrl;
        }
    }

    navigateToNotiList() {
        const notiListUrl = "https://web.humoruniv.com/noti/noti_list.html";
        if (this.url.match(notiListUrl)) {
            window.top.document.querySelector("#cnts > div.body_main > table > tbody > tr:nth-child(2) > td:nth-child(2) > a").click();
        } else {
            window.top.location.href = notiListUrl;
        }
    }

    toggleCommentFocus(e) {
        const target = window.top.document;
        const element = target.querySelector("#cmt_wrap_write > table > tbody > tr:nth-child(1) > td.write_cmt > input") || target.querySelector("#sk");
        if (element) {
            target.activeElement === element ? $(':focus').blur() : element.focus();
        }
    }

    saveValues(type) {
        const values = [];
        const target = window.top.document;


        const listN = target.querySelector(this.isMobile ? "#cnts > div.bg2 > span:nth-child(2)" : "#cnts > div.top_title > span").textContent;
        const count = Number(listN.slice(2, -2)) + 2;
        for (let step = 2; step < count; step++) {
            const str = target.querySelector(this.isMobile ? `#cnts > table > tbody > tr:nth-child(${step}) > td:nth-child(1)` : `#cnts > div.body_main > table > tbody > tr:nth-child(${step}) > td:nth-child(2)`).textContent;
            values.push(str.trim());
        }
        GM_setValue(type, values);
        Utils.showToast('저장 목록이 갱신되었습니다.');
    }

    filterContent() {
        const observer = new MutationObserver(() => {
            const nicknames = GM_getValue("nicknames", {});
            const keywords = GM_getValue("keywords", []);
            const target = window.top.document;

            target.querySelectorAll("[id^='title_chk_pdswait']").forEach(id => {
                keywords.some(keyword => id.textContent.includes(keyword)) && id.closest(this.isMobile ? "a" : "tr").remove();
            });

            target.querySelectorAll("span.hu_nick_txt").forEach(span => {
                if (nicknames[span.textContent.trim()]) {
                    span.closest(this.isMobile ? "a" : "tr").parentElement.closest("tr").remove();
                }
            });
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    addTampermonkeyMenu() {
        GM_registerMenuCommand('닉네임 설정', () => {
            const nicknames = GM_getValue('nicknames', {});
            const newNicknames = prompt('필터링할 닉네임을 쉼표로 구분하여 입력하세요:', Object.keys(nicknames).join(', '));
            if (newNicknames !== null) {
                const updatedNicknames = newNicknames.split(',').reduce((acc, nickname) => ({ ...acc, [nickname.trim()]: nicknames[nickname.trim()] || '' }), {});
                GM_setValue('nicknames', updatedNicknames);
                Utils.showToast('닉네임이 업데이트되었습니다!');
            }
        });

        GM_registerMenuCommand('키워드 설정', () => {
            const keywords = GM_getValue('keywords', []);
            const newKeywords = prompt('필터링할 키워드를 쉼표로 구분하여 입력하세요:', keywords.join(', '));
            if (newKeywords !== null) {
                GM_setValue('keywords', newKeywords.split(',').map(k => k.trim()));
                Utils.showToast('키워드가 업데이트되었습니다!');
            }
        });

        GM_registerMenuCommand('알림 볼륨 설정', () => this.showVolumeSlider());
        GM_registerMenuCommand('MP3 업로드', () => this.uploadMP3());
        GM_registerMenuCommand('단축키 안내 보기', () => this.showShortcutGuide());
    }

    uploadMP3() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/mpeg';
        fileInput.style.display = 'none';

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    GM_setValue('notificationMP3', e.target.result);
                    Utils.showToast('MP3 파일이 업로드 및 저장되었습니다.');
                };
                reader.readAsDataURL(file);
            }
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        fileInput.remove();
    }

    showVolumeSlider() {
        const currentVolume = GM_getValue('notificationVolume', 0.5);

        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10000;
            text-align: center;
        `;

        const sliderLabel = document.createElement('label');
        sliderLabel.textContent = `알림 볼륨: ${currentVolume}`;
        sliderLabel.style.display = 'block';
        sliderLabel.style.marginBottom = '10px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.01';
        slider.value = currentVolume;
        slider.style.width = '100%';

        slider.oninput = (e) => {
            sliderLabel.textContent = `알림 볼륨: ${e.target.value}`;
        };

        const saveButton = document.createElement('button');
        saveButton.textContent = '저장';
        saveButton.style.marginTop = '10px';

        saveButton.onclick = () => {
            GM_setValue('notificationVolume', parseFloat(slider.value));
            Utils.showToast('알림 볼륨이 업데이트되었습니다!');
            document.body.removeChild(sliderContainer);
        };

        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(saveButton);

        document.body.appendChild(sliderContainer);
    }

    showShortcutGuide() {
        const guideContent = `
            S: 페이지 ⬅️
            F: 페이지 ➡️
            E: 화면 ⬆️
            D: 화면 ⬇️
            V: 추천
            W: 대기자료
            R: 답글알림
            ${this.os === 'Mac' ? '⌘ + C' : 'Alt + C'}: 답글 입력
        `;
        alert(`단축키 안내:\n${guideContent}`);
    }

    setupNotification() {
        const volume = GM_getValue('notificationVolume', 0.5);
        const mp3DataUrl = GM_getValue('notificationMP3', null);
        const notification = new Audio(mp3DataUrl || "https://t1.daumcdn.net/cfile/tistory/2161694A54A73F4F10");
        notification.volume = volume;

        const previousContent = {
            content1: window.top.document.querySelector("#login_box_mem > dl > dd:nth-child(3) > a").innerHTML.trim(),
            content2: window.top.document.querySelector("#login_box_mem > dl > dd:nth-child(2) > a").innerHTML.trim()
        };

        const checkForUpdates = async () => {
            const url = "https://web.humoruniv.com/board/humor/list.html?table=pdswait";
            try {
                const response = await fetch(url, { credentials: 'include' });
                const buffer = await response.arrayBuffer();
                const decoder = new TextDecoder('euc-kr');
                const html = decoder.decode(buffer);
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const currentContent1 = doc.querySelector("#login_box_mem > dl > dd:nth-child(3) > a").innerHTML.trim();
                const currentContent2 = doc.querySelector("#login_box_mem > dl > dd:nth-child(2) > a").innerHTML.trim();

                if (currentContent1 !== previousContent.content1 || currentContent2 !== previousContent.content2) {
                    notification.play();
                    previousContent.content1 = currentContent1;
                    previousContent.content2 = currentContent2;

                    window.top.document.querySelector("#login_box_mem > dl > dd:nth-child(3) > a").innerHTML = currentContent1;
                    window.top.document.querySelector("#login_box_mem > dl > dd:nth-child(2) > a").innerHTML = currentContent2;
                }
            } catch (error) {
                console.error('Error fetching notification page:', error);
            }
        };

        setInterval(checkForUpdates, 5000);
    }

    manageBlindList() {
        const nicknames = GM_getValue('nicknames', {});
        const rows = document.querySelectorAll('#cnts > div.body_main > table > tbody > tr');

        const saveButton = document.createElement('button');
        saveButton.textContent = '저장';
        saveButton.style.cssText = `
            padding: 5px 10px;
            margin-left: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        `;
        saveButton.onclick = () => {
            GM_setValue('nicknames', nicknames);
            Utils.showToast('모든 닉네임과 값이 저장되었습니다.');
        };
        rows[0].lastElementChild.appendChild(saveButton);

        rows.forEach((row, index) => {
            if (index === 0) return;

            const nicknameCell = row.querySelector('span.hu_nick_txt');
            if (nicknameCell) {
                const nickname = nicknameCell.textContent.trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.value = nicknames[nickname] || '메모를 작성해주세요.';
                nicknames[nickname] = input.value;
                input.style.cssText = `
                    margin-left: 10px;
                    padding: 5px;
                    width: 200px;
                `;
                input.oninput = (e) => {
                    nicknames[nickname] = e.target.value;
                };
                row

.lastElementChild.appendChild(input);
            }
        });

        GM_setValue('nicknames', nicknames);
        Utils.showToast('모든 닉네임과 값이 저장되었습니다.');

        const currentNicknames = Array.from(rows).slice(1).map(row => row.querySelector('span.hu_nick_txt').textContent.trim());
        for (const nickname in nicknames) {
            if (!currentNicknames.includes(nickname)) {
                delete nicknames[nickname];
            }
        }
        GM_setValue('nicknames', nicknames);
    }
}

new HumorunivHelper();