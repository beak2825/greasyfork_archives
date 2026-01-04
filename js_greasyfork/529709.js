// ==UserScript==
// @name         YouTube Timestamp Navigator & Unarchived Video Replacer
// @namespace    YouTube Timestamp Navigator & Unarchived Video Replacer
// @version      1.0
// @description  유튜브 타임스탬프 생성, 탐색 및 언아카이브 영상 대체 기능 제공
// @author       Hess
// @match        https://www.youtube.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529709/YouTube%20Timestamp%20Navigator%20%20Unarchived%20Video%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/529709/YouTube%20Timestamp%20Navigator%20%20Unarchived%20Video%20Replacer.meta.js
// ==/UserScript==
// https://greasyfork.org/ko/scripts/529709-youtube-timestamp-navigator-unarchived-video-replacer
(function() {
    'use strict';

    if (!GM_getValue("unarchived_videos", null)) {
        GM_setValue("unarchived_videos", {});
    }

    let currentTime;
    let video = null;
    const initializeVideoElement = () => {
        video = document.querySelector("video");
        currentTime = video.currentTime;
    };
    window.addEventListener("load", initializeVideoElement);

    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        return `${h ? `${h}:` : ''}${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    };

    // 키 동작 매핑 객체 생성
    const keyHandlers = {
        keydown: {
            "p": () => toggleTimestampWindow(),
            "[": () => {
                const lowerTime = findRange(parseTimestamps(timestampText), currentTime).lower;
                if (lowerTime !== null) video.currentTime = lowerTime;
            },
            "]": () => {
                const upperTime = findRange(parseTimestamps(timestampText), currentTime).upper;
                if (upperTime !== null) video.currentTime = upperTime;
            },
            "'": () => {
                addTimestampButton.click();
                timestampText = timestampInput.value;
            },
            ";": () => {
                if (!isTimestampWindowOn) return;
                event.preventDefault();
                event.stopPropagation();
                (document.activeElement !== timestampInput ? timestampInput.focus() : timestampInput.blur());
            },
        },
    };

    const shouldIgnoreKeyEvent = (event) => {
        if (event.repeat || !event.isTrusted) return true;
        const activeElement = document.activeElement;
        const isTextInput = (
            activeElement.tagName.toLowerCase() === "textarea" ||
            (activeElement.tagName.toLowerCase() === "input" &&
             ["text", "password", "email", "search", "tel", "url", "number", "date", "time"].includes(activeElement.type)) ||
            activeElement.isContentEditable
        );
        return isTextInput && ![";", "'"].includes(event.key); // ;와 '는 타임스탬프 창에서 허용
    };

    const handleKeyEvent = (event) => {
        initializeVideoElement();
        if (shouldIgnoreKeyEvent(event)) return;
        // 입력창에 포커스가 있을 때도 ;랑 ' 키는 허용
        if (isTimestampWindowOn && (document.activeElement === timestampInput || document.activeElement === timestampInput2)) {
            if (event.key === ";") {
                event.preventDefault();
                if (document.activeElement !== timestampInput) {timestampInput.focus(); return;}
                else timestampInput.blur();
                return;
            }
            if (event.key === "'") {event.preventDefault(); addTimestampButton.click(); timestampText = timestampInput.value; return;}
        }
        // 이것 이외에 텍스트 입력창에 포커스가 있으면 키 입력 무시
        if (document.activeElement === timestampInput || document.activeElement === timestampInput2) return;
        keyHandlers.keydown?.[event.key]?.(event);
    };
    window.addEventListener("keydown", handleKeyEvent);

    // 포커싱 확인을 위해 빼둠
    let timestampWindow, timestampInput, timestampInput2, addTimestampButton;
    let timestampText = "";
    let isTimestampWindowOn= false;

    function toggleTimestampWindow() {
        if (!isTimestampWindowOn) {
            timestampWindow = document.createElement("div");
            timestampWindow.id = "timestampWindow";
            Object.assign(timestampWindow.style, {
                position: "fixed",
                top: "50%",
                left: "90%",
                transform: "translate(-70%, -50%)",
                width: "340px",
                height: "360px",
                backgroundColor: "rgba(50, 50, 50, 0.6)",
                border: "2px solid rgba(200, 200, 200, 0.6)",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                zIndex: "1000",
                display: "flex",
                flexDirection: "column",
            });

            // 상단 버튼 바(topBar) 생성
            const topBar = document.createElement("div");
            Object.assign(topBar.style, {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px"
            });

            // 변경: 아이콘들을 담을 iconGroup 컨테이너
            const iconGroup = document.createElement("div");
            Object.assign(iconGroup.style, {
                display: "flex",
                gap: "6px",
                alignItems: "center"
            });

            // 일반 주소 타임스탬프 버튼
            const currentTimestampButton = document.createElement("button");
            currentTimestampButton.textContent = "🔗";
            currentTimestampButton.style.cssText = "background-color: #ADD8E6; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;";
            currentTimestampButton.style.fontSize = `12px`;
            currentTimestampButton.style.display = "flex";
            currentTimestampButton.style.justifyContent = "center";
            currentTimestampButton.style.alignItems = "center";
            currentTimestampButton.onclick = () => copyTimestamp();

            // 입력한 시간 타임스탬프 버튼
            const customTimestampButton = document.createElement("button");
            customTimestampButton.textContent = "🕒";
            customTimestampButton.style.cssText = "background-color: #ADD8E6; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;";
            customTimestampButton.style.fontSize = `12px`;
            customTimestampButton.style.display = "flex";
            customTimestampButton.style.justifyContent = "center";
            customTimestampButton.style.alignItems = "center";
            customTimestampButton.onclick = () => {
                let time = parseTimeToSeconds(timestampInput2.value);
                if (time === null || time < 0 || time > video.duration) {
                    time = Math.floor(video.currentTime);
                }
                copyTimestamp(time);
            };

            // 타임스탬프 입력 필드
            timestampInput2 = document.createElement("input"); // 한 줄 입력창
            timestampInput2.id = "timestampInput2";
            timestampInput2.type = "text";
            timestampInput2.placeholder = "";
            timestampInput2.style.cssText = "width: 50px; text-align: center; background: rgba(255, 255, 255, 0.7); border: none; border-radius: 5px; font-size: 14px;";
            timestampInput2.onmousedown = (e) => e.stopPropagation(); // 드래그 방지
            timestampInput2.tabIndex = 0; // 문서의 자연스러운 순서에 따라 포커스를 받습니다.
            Object.assign(timestampInput2.style, {
                border: "1px solid lightgray", // 테두리 스타일 추가
            });
            // 포커스 시 스타일 적용
            timestampInput2.addEventListener("focus", () => {
                Object.assign(timestampInput2.style, {
                    outline: "1px auto -webkit-focus-ring-color", // 기본 포커싱 테두리 설정
                });
            });
            // 포커스 해제 시 기본 스타일로 복원 (outline 제거)
            timestampInput2.addEventListener("blur", () => {
                timestampInput2.style.outline = "";
            });

            // 맨 아래에 현재 시간 추가 버튼
            addTimestampButton = document.createElement("button");
            addTimestampButton.textContent = "📝";
            addTimestampButton.style.cssText = "background-color: pink; color: white; border: none; border-radius: 0%; width: 24px; height: 24px; cursor: pointer;";
            addTimestampButton.style.fontSize = `12px`;
            addTimestampButton.style.display = "flex";
            addTimestampButton.style.justifyContent = "center";
            addTimestampButton.style.alignItems = "center";
            addTimestampButton.onclick = () => {
                const currentTimeText = formatTime(video.currentTime);
                const fullText = timestampInput.value; // 입력창 전체 텍스트
                const cursorPosition = timestampInput.selectionStart; // 커서 위치 가져오기
                const textBeforeCursor = fullText.slice(0, cursorPosition);
                const textAfterCursor = fullText.slice(cursorPosition);

                const linesBeforeCursor = textBeforeCursor.split("\n"); // 커서 이전의 줄
                const allLines = fullText.split("\n"); // 전체 줄

                const isCursorAtLastLine = linesBeforeCursor.length === allLines.length; // 커서가 마지막 줄에 있는지 확인
                const isLastLineEmptyOrWhitespace = allLines[allLines.length - 1].trim() === ""; // 마지막 줄이 비어있거나 여백만 있는지 확인
                const isFullTextEmptyOrWhitespace = fullText.trim() === ""; // 전체 텍스트가 비어있거나 여백만 있는지 확인

                if ((isCursorAtLastLine && isLastLineEmptyOrWhitespace) || isFullTextEmptyOrWhitespace) {
                    // 전체 텍스트가 비어있거나 마지막 줄이 여백인 경우, 엔터 없이 타임스탬프 삽입
                    timestampInput.value = allLines.slice(0, -1).join("\n") + `${isFullTextEmptyOrWhitespace ? '' : '\n'}${currentTimeText}`;
                } else {
                    // 그렇지 않으면 엔터 포함하여 타임스탬프 추가
                    timestampInput.value += `\n${currentTimeText}`;
                }
                timestampInput.scrollTop = timestampInput.scrollHeight; // 스크롤을 맨 아래로 이동
                timestampText = timestampInput.value; // 입력된 텍스트 저장
            };

            // 홀로덱스로 이동 버튼
            const goToHolodexPageButton = document.createElement("button");
            goToHolodexPageButton.style.cssText = `
    background-color: #A2CC66;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("https://i.namu.wiki/i/3yNJVcRTjZqJ7B-FuiE4alfJ3ELyYe3fzQ0oKwUuuPeAQxyyX4e2lKEhV9_lU1PyhZ48FKwQzN_OWSw39rNVMxZ9UtdhKXAP16SZFomjEjVVu5hKvahFD8cSUWQA9KrbjU-QFHIgXQkI6Z_VH5oKhw.svg");
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center;
`;

            if (window.location.href.includes('youtube.com') && !window.location.href.includes('/embed/')) {
                // 유튜브 페이지: 버튼은 기본(holodex) 아이콘 사용
                goToHolodexPageButton.style.backgroundImage = 'url("https://i.namu.wiki/i/3yNJVcRTjZqJ7B-FuiE4alfJ3ELyYe3fzQ0oKwUuuPeAQxyyX4e2lKEhV9_lU1PyhZ48FKwQzN_OWSw39rNVMxZ9UtdhKXAP16SZFomjEjVVu5hKvahFD8cSUWQA9KrbjU-QFHIgXQkI6Z_VH5oKhw.svg")';
                goToHolodexPageButton.onclick = () => {
                    const videoId = extractYouTubeVideoId(window.location.href);
                    const holodexUrl = videoId ? 'https://holodex.net/watch/' + videoId : 'https://holodex.net';
                    window.open(holodexUrl, '_blank');
                };
            } else if (window.location.href.includes('holodex.net')) {
                // holodex 페이지: 버튼을 보이게 하고, 아이콘은 유튜브 아이콘으로 변경
                goToHolodexPageButton.style.backgroundImage = 'url("https://www.google.com/s2/favicons?sz=64&domain=youtube.com")';
                goToHolodexPageButton.onclick = () => {
                    const urlInputElement = document.getElementById("urlInput");
                    const urlInputValue = urlInputElement ? normalizeYouTubeURL(urlInputElement.value) : "";
                    const videoId = extractYouTubeVideoId(urlInputValue);
                    if (videoId) {
                        const youtubeEmbedUrl = 'https://www.youtube.com/embed/' + videoId;
                        const currentHolodexUrl = 'https://holodex.net/watch/' + extractYouTubeVideoId(location.href);
                        GM_setValue(currentHolodexUrl, youtubeEmbedUrl);
                        location.href = youtubeEmbedUrl;
                    }
                };
            } else {
                // 삭제: 원래 youtube.com이 아닌 경우 버튼 숨김 처리
                goToHolodexPageButton.style.display = 'none';
            }

            // 버튼 컨테이너에 요소 추가
            iconGroup.appendChild(currentTimestampButton);
            iconGroup.appendChild(customTimestampButton);
            iconGroup.appendChild(timestampInput2);
            iconGroup.appendChild(addTimestampButton);
            iconGroup.appendChild(goToHolodexPageButton);

            // topBar 왼쪽에 iconGroup 추가
            topBar.appendChild(iconGroup);

            // 닫기 버튼
            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            Object.assign(closeButton.style, {
                position: "absolute",
                top: "11px",
                right: "10px",
                color: "white",
                backgroundColor: "red",
                border: "none",
                fontSize: "17px",
                padding: "2px 4px",
                cursor: "pointer"
            });
            closeButton.onclick = () => timestampWindow.remove();

            // topBar 오른쪽에 closeButton 추가
            topBar.appendChild(closeButton);

            // timestampWindow에 topBar 추가
            timestampWindow.appendChild(topBar);

            // 변경: 텍스트 영역을 감싸는 컨테이너 (flex)
            const textContainer = document.createElement("div");
            Object.assign(textContainer.style, {
                flex: "1",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
            });

            // 추가: textarea 요소 생성 (timestampInput)
            timestampInput = document.createElement("textarea");

            // textarea 생성 (기존 timestampInput)
            timestampInput.id = "timestampInput";
            timestampInput.onmousedown = (e) => e.stopPropagation(); // 드래그 방지
            Object.assign(timestampInput.style, {
                flex: "1",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                color: "#000",
                fontWeight: "bold",
                border: "none",
                resize: "none",
                fontSize: "14px",
                padding: "12px", // 좌우 패딩을 넉넉하게
                borderRadius: "4px"
            });
            timestampInput.placeholder = "여기에 텍스트를 입력하세요.";
            timestampInput.value = timestampText;
            timestampInput.addEventListener("input", () => {
                timestampText = timestampInput.value;
            });

            // 하단에 URL 입력창 추가 (한 줄짜리 input)
            const urlInput = document.createElement("input");
            urlInput.id = "urlInput";
            urlInput.onmousedown = (e) => e.stopPropagation(); // 드래그 방지
            urlInput.type = "text";
            const savedYoutubeEmbedUrl = GM_getValue('https://holodex.net/watch/' + extractYouTubeVideoId(location.href));
            // 변경: 값이 있으면 그 값을, 없으면 비움
            urlInput.value = savedYoutubeEmbedUrl ? savedYoutubeEmbedUrl : "";
            urlInput.placeholder = "URL을 입력하세요...";
            urlInput.style.cssText = "padding: 8px; border: 1px solid lightgray; border-radius: 4px; font-size: 14px;";

            // textContainer에 텍스트 영역과 URL 입력창 추가
            textContainer.appendChild(timestampInput);
            textContainer.appendChild(urlInput);

            // 타임스탬프 창에 textContainer 추가
            timestampWindow.appendChild(textContainer);

            // 드래그 기능 추가
            let isDragging = false, startX, startY, startLeft, startTop;
            timestampWindow.onmousedown = (e) => {
                isDragging = true;
                ({ clientX: startX, clientY: startY } = e);
                ({ left: startLeft, top: startTop } = window.getComputedStyle(timestampWindow));
                document.onmousemove = ({ clientX, clientY }) => {
                    if (isDragging) {
                        timestampWindow.style.left = `${parseInt(startLeft) + clientX - startX}px`;
                        timestampWindow.style.top = `${parseInt(startTop) + clientY - startY}px`;
                    }
                };
                document.onmouseup = () => {
                    isDragging = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
            document.body.appendChild(timestampWindow);
        } else {
            timestampWindow.remove();
        }
        isTimestampWindowOn = !isTimestampWindowOn;
    }

    // 타임스탬프 추출 함수, 초 단위로 저장
    function parseTimestamps(inputText) {
        const regex = /\b(?:\d{1,2}:)?\d{1,2}:\d{2}\b/g;
        const matches = inputText.match(regex) || [];

        return matches.map(time => {
            const parts = time.split(':').map(Number).reverse();
            let seconds = parts[0] || 0;
            let minutes = parts[1] || 0;
            let hours = parts[2] || 0;
            return seconds + minutes * 60 + hours * 3600;
        });
    }

    // 현재 시간의 lower, upper 타임스탬프로 이동
    function findRange(timestamps, inputValue) {
        const sortedTimestamps = timestamps.filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a - b);
        inputValue = Math.floor(inputValue);
        const index = sortedTimestamps.indexOf(inputValue);
        if (index !== -1) sortedTimestamps.splice(index, 1);

        for (let i = 0; i < sortedTimestamps.length; i++) {
            if (inputValue < sortedTimestamps[i]) {
                return {lower: i > 0 ? sortedTimestamps[i - 1] : null, upper: sortedTimestamps[i]};
            }
            if (inputValue === sortedTimestamps[i] && i < sortedTimestamps.length - 1) {
                return {lower: sortedTimestamps[i], upper: sortedTimestamps[i + 1]};
            }
        }
        return {lower: sortedTimestamps[sortedTimestamps.length - 1], upper: null};
    }

    // 유튜브 주소 정규화
    function normalizeYouTubeURL(url, timestamp = null) {
        try {
            const urlObj = new URL(url);
            let videoId = "";
            let timeParam = "";

            // 1. 단축 URL (youtu.be)
            if (urlObj.hostname === "youtu.be") videoId = urlObj.pathname.substring(1);
            // 2. Shorts, Embed, Live, 기본 watch URL 처리
            else if (urlObj.hostname.includes("youtube.com")) {
                const pathParts = urlObj.pathname.split("/");
                if (pathParts.includes("shorts") || pathParts.includes("embed") || pathParts.includes("live")) videoId = pathParts[pathParts.length - 1];
                else if (urlObj.pathname === "/watch") videoId = urlObj.searchParams.get("v");
            }

            // 유효한 videoId가 없으면 반환 불가
            if (!videoId) return null;

            // 3. 특정 시간 시작 옵션 유지
            if (urlObj.searchParams.has("t")) timeParam = `&t=${urlObj.searchParams.get("t")}`;
            else if (urlObj.searchParams.has("start")) timeParam = `&t=${urlObj.searchParams.get("start")}`;

            // 4. 타임스탬프가 있으면 그걸로 시작 시간 설정
            if (timestamp !== null) timeParam = `&t=${timestamp}`;

            // 5. 최종 변환된 URL 반환 (재생목록 정보 제거)
            return `https://www.youtube.com/watch?v=${videoId}${timeParam}`;
        } catch (e) {
            return null; // 잘못된 URL 입력 시
        }
    }

    function extractYouTubeVideoId(url) {
        try {
            const urlObj = new URL(url);
            let videoId = "";

            // 1. 단축 URL (youtu.be)
            if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.substring(1);
            }
            // 2. Shorts, Embed, Live, 기본 watch URL 처리
            else if (urlObj.hostname.includes("youtube.com")) {
                const pathParts = urlObj.pathname.split("/");
                if (pathParts.includes("shorts") || pathParts.includes("embed") || pathParts.includes("live")) {
                    videoId = pathParts[pathParts.length - 1];
                } else if (urlObj.pathname === "/watch") {
                    videoId = urlObj.searchParams.get("v");
                }
            }
            // 유효한 videoId가 없으면 null 반환
            return videoId ? videoId : null;
        } catch (e) {
            return null; // 잘못된 URL 입력 시
        }
    }

    function copyTimestamp(time = null) {
        const url = normalizeYouTubeURL(location.href, time);
        if (url) {
            navigator.clipboard.writeText(url).then(() => {
                console.log(`Copied: ${url}`);
            }).catch(err => console.error("Failed to copy", err));
        }
    }

    // 입력된 다양한 타임스탬프를 초로 변환
    function parseTimeToSeconds(input) {
        if (!input) return null;

        // 숫자만 입력된 경우 (정수 또는 소수)
        if (/^\d+(\.\d+)?$/.test(input)) return Math.floor(parseFloat(input));

        // h, m, s 형식 (예: "1h2m3s", "2h", "45m30s")
        const hmsRegex = /^(\d+)h(?:\s*(\d+)m)?(?:\s*(\d+)s)?$|^(\d+)m(?:\s*(\d+)s)?$|^(\d+)s$/;
        const hmsMatch = input.match(hmsRegex);
        if (hmsMatch) {
            return (parseInt(hmsMatch[1] || 0, 10) * 3600) +
                (parseInt(hmsMatch[2] || hmsMatch[4] || 0, 10) * 60) +
                (parseInt(hmsMatch[3] || hmsMatch[5] || hmsMatch[6] || 0, 10));
        }

        // hh:mm:ss 또는 mm:ss 형식 (예: "1:02:03", "02:03")
        const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
        const timeMatch = input.match(timeRegex);
        if (timeMatch) {
            const hours = timeMatch[3] ? parseInt(timeMatch[1], 10) : 0;
            const minutes = timeMatch[3] ? parseInt(timeMatch[2], 10) : parseInt(timeMatch[1], 10);
            const seconds = parseInt(timeMatch[3] || timeMatch[2], 10);
            return hours * 3600 + minutes * 60 + seconds;
        }
        return null;
    }
})();
