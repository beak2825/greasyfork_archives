// ==UserScript==
// @name         아카라이브 썸네일 이미지, 이미지 뷰어, 모두 열기
// @version      1.79
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @description  아카라이브 썸네일 이미지 생성, 이미지 뷰어, 모두 열기 버튼 생성, 그 외 잡다한 기능..
// @author       ChatGPT
// @match        https://arca.live/b/*
// @match        https://arca.live/u/scrap_list*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @namespace    Violentmonkey Scripts

// @downloadURL https://update.greasyfork.org/scripts/492373/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%EC%9D%B4%EB%AF%B8%EC%A7%80%2C%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%B7%B0%EC%96%B4%2C%20%EB%AA%A8%EB%91%90%20%EC%97%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/492373/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%EC%9D%B4%EB%AF%B8%EC%A7%80%2C%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%B7%B0%EC%96%B4%2C%20%EB%AA%A8%EB%91%90%20%EC%97%B4%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config = {
        buttons: true,
        openAllButton: true,
        downAllButton: false,
        sortButton: false,
        compressFiles: true,
        countImages: false,
        downOriginalImage: false,
        downNumber: false,
        controlButtons: false,
        closeButton: false,
        bookmarkButton: false,
        downButton: false,
        thumbnail: true,
        thumbWidth: 100,
        thumbHeight: 62,
        thumbHover: true,
        thumbBlur: true,
        thumbBlurAmount: 2,
        thumbShadow: false,
        thumbForce: false,
        viewer: true,
        viewerShortcut: true,
        viewerOpacity: 0.9,
        viewerType: 1,
        viewerWidth: 70,
        scrollSpeed: 1,
        preloadImage: true,
        preloadCount: 1,
        originalImage: false,
        hideButtons : false,
        viewerCloseButton: false,
        viewerAutoOpenButton: false,
        viewerBookmarkButton: true,
        viewerDownloadButton: true,
        findImage: true,
        autoOpenViewer: false,
        scrapList: true,
        test: false,
        test01: false,
        test02: false,
        test03: false,
        test04: false,
        referenceImageUrls: JSON.stringify([])
    };

    function handleSettings() {
        var descriptions = {
            buttons: '상단 버튼 생성',
            openAllButton: '모두 열기 버튼 생성',
            downAllButton: '모든 이미지 다운로드 버튼 생성',
            sortButton: '현재 게시글 목록 정렬(추천순, 게시일순)',
            compressFiles: '모든 이미지를 압축해서 다운로드',
            countImages: '모든 이미지의 총 개수를 구하고 진행률 표시',
            downOriginalImage: '원본 이미지로 다운로드(체크 해제시 webp저장)',
            downNumber: '게시글 번호를 누르면 해당 게시글 이미지 다운로드',
            controlButtons: '하단 우측 조작 버튼 생성',
            closeButton: '창닫기 버튼 생성',
            bookmarkButton: '스크랩 버튼 생성',
            downButton: '다운로드 버튼 생성',
            thumbnail: '프리뷰 이미지로 썸네일 생성',
            thumbWidth: '썸네일 너비',
            thumbHeight: '썸네일 높이',
            thumbHover: '썸네일에 마우스 올리면 프리뷰 이미지 출력',
            thumbBlur: '썸네일 블러 효과',
            thumbBlurAmount: '썸네일 블러 효과의 정도',
            thumbShadow: '썸네일 그림자 효과',
            thumbForce: '썸네일 강제 생성',
            viewer: '게시글 이미지 클릭시 이미지 뷰어로 열기',
            viewerShortcut: '뷰어 단축키',
            viewerOpacity: '뷰어 배경 투명도',
            viewerType: '뷰어 타입(1: 싱글, 2: 스크롤)',
            viewerWidth: '뷰어 너비(스크롤)',
            scrollSpeed: '휠스크롤, 이미지 드래그 속도 배율(스크롤바 제외)',
            preloadImage: '다음 이미지 미리 다운로드',
            preloadCount: '미리 다운 받을 이미지 개수(0: 전부)',
            originalImage: '원본 이미지 출력',
            hideButtons : '버튼 자동 숨기기',
            viewerCloseButton: '창 닫기 버튼 생성',
            viewerAutoOpenButton: '자동 뷰어 열기 버튼 생성',
            viewerBookmarkButton: '북마크 버튼 생성',
            viewerDownloadButton: '다운로드 버튼 생성',
            findImage: '페이지 이동시 게시글 스크롤 이동(이미지 찾기)',
            autoOpenViewer: '뷰어 자동 열기',
            scrapList: '스크랩한 게시글 채널별, 탭별 필터링',
            test: '실험실',
            test01: '프리뷰 이미지를 다른 이미지로 대체(특정 조건의 썸네일)',
            test02: '프리뷰 이미지를 다른 이미지로 대체(사용자 지정 썸네일)',
            test03: '대체한 프리뷰 이미지를 썸네일에도 적용',
            test04: '게시글 내 특정 조건의 이미지를 숨김처리'
        };

        var mainConfigKeys = Object.keys(descriptions).filter(key =>
            !['openAllButton', 'downAllButton', 'sortButton', 'closeButton', 'bookmarkButton', 'downButton', 'compressFiles', 'countImages', 'downOriginalImage', 'downNumber',
              'thumbWidth', 'thumbHeight', 'thumbHover', 'thumbBlur', 'thumbBlurAmount', 'thumbShadow', 'thumbForce',
              'viewerShortcut', 'viewerOpacity', 'viewerType', 'viewerWidth', 'scrollSpeed', 'preloadImage', 'preloadCount', 'originalImage', 'hideButtons',
              'viewerCloseButton', 'viewerAutoOpenButton', 'viewerBookmarkButton', 'viewerDownloadButton', 'findImage', 'autoOpenViewer', 'test01', 'test02', 'test03', 'test04'].includes(key)
        );

        function saveConfig() {
            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    GM_setValue(key, config[key]);
                }
            }
        }

        function loadConfig() {
            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    config[key] = GM_getValue(key, config[key]);
                }
            }
        }


        function createBaseWindow(id, titleText) {
            var existingWindow = document.getElementById(id);
            if (existingWindow) {
                existingWindow.remove();
            }

            var window = document.createElement('div');
            Object.assign(window.style, {
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '250px', padding: '20px', background: '#ffffff',
                border: '1px solid #cccccc', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                zIndex: '9999', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center'
            });
            window.id = id;

            var title = document.createElement('div');
            Object.assign(title.style, { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' });
            title.innerHTML = titleText;
            window.appendChild(title);

            return window;
        }

        function createConfigInput(key) {
            var configDiv = document.createElement('div');
            Object.assign(configDiv.style, { marginBottom: '5px', display: 'flex', alignItems: 'center' });

            var label = document.createElement('label');
            label.innerHTML = key + ': ';
            Object.assign(label.style, { marginRight: '5px', marginBottom: '3px' });
            label.title = descriptions[key];

            var input = document.createElement('input');
            input.type = (typeof config[key] === 'boolean') ? 'checkbox' : 'text';
            input.value = config[key];
            input.checked = config[key];
            if (input.type === 'text') {
                Object.assign(input.style, { width: '40px', height: '20px', padding: '0 5px' });
            }
            input.addEventListener('input', function(event) {
                config[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            });

            configDiv.appendChild(label);
            configDiv.appendChild(input);

            if (['buttons', 'downAllButton', 'controlButtons', 'downButton', 'thumbnail', 'viewer', 'viewerShortcut', 'test', 'test02'].includes(key)) {
                var settingsIcon = document.createElement('span');
                settingsIcon.innerHTML = key === 'viewerShortcut' ? 'ℹ️' : '⚙️'; // viewerShortcut이면 ℹ️ 아이콘 사용
                Object.assign(settingsIcon.style, { cursor: 'pointer', marginLeft: '3px', marginBottom: '2px' });

                settingsIcon.addEventListener('click', function() {
                    var windowFunctions = {
                        buttons: createButtonsWindow,
                        downAllButton: createDownloadWindow,
                        controlButtons: createControlButtonsWindow,
                        downButton: createDownloadWindow,
                        thumbnail: createThumbnailWindow,
                        viewer: createViewerWindow,
                        viewerShortcut: createShortcutWindow,
                        test: createTestWindow,
                        test02: createFilterWindow
                    };
                    windowFunctions[key] && windowFunctions[key]();
                });

                configDiv.appendChild(settingsIcon);
            }

            return configDiv;
        }

        function createButton(text, color, onClick) {
            var button = document.createElement('button');
            button.innerHTML = text;
            Object.assign(button.style, { border: '1px solid #cccccc', borderRadius: '5px', marginRight: '10px' });
            button.addEventListener('click', onClick);
            button.addEventListener('mouseover', function() {
                button.style.background = color;
                button.style.color = '#ffffff';
            });
            button.addEventListener('mouseout', function() {
                button.style.background = '';
                button.style.color = '#000000';
            });
            return button;
        }

        function createButtonContainer(confirmText, cancelText, onConfirm, onCancel) {
            var buttonContainer = document.createElement('div');
            Object.assign(buttonContainer.style, { display: 'flex', marginTop: '10px' });

            buttonContainer.appendChild(createButton(confirmText, '#007bff', onConfirm));
            buttonContainer.appendChild(createButton(cancelText, '#ff0000', onCancel));

            return buttonContainer;
        }

        function createSettingsWindow() {
            var settingsWindow = createBaseWindow('settingsWindow', 'Settings');

            mainConfigKeys.forEach(function(key) {
                settingsWindow.appendChild(createConfigInput(key));
            });

            var tooltip = document.createElement('div');
            Object.assign(tooltip.style, { fontSize: '12px', marginTop: '5px', marginBottom: '10px', color: 'gray' });
            tooltip.innerHTML = '마우스를 올리면 설명이 나옵니다';
            settingsWindow.appendChild(tooltip);

            settingsWindow.appendChild(createButtonContainer('확인', '취소', function() {
                saveConfig();
                settingsWindow.remove();
                location.reload();
            }, function() {
                settingsWindow.remove();
            }));

            document.body.appendChild(settingsWindow);
        }

        function createSubSettingsWindow(id, title, keys, additionalContent) {
            var subWindow = createBaseWindow(id, title);

            // keys가 있으면 Config 입력들을 추가
            keys.forEach(function(key) {
                subWindow.appendChild(createConfigInput(key));
            });

            // 추가로 받은 내용들을 subWindow에 추가
            if (additionalContent) {
                Object.keys(additionalContent).forEach(function(key) {
                    subWindow.appendChild(additionalContent[key]);
                });
            }

            // 버튼 추가
            subWindow.appendChild(createButtonContainer('확인', '취소', function() {
                saveConfig();
                subWindow.remove();
            }, function() {
                subWindow.remove();
            }));

            document.body.appendChild(subWindow);
        }

        function createButtonsWindow() {
            createSubSettingsWindow('buttonsWindow', 'Buttons', ['openAllButton', 'downAllButton', 'sortButton']);
        }

        function createDownloadWindow() {
            createSubSettingsWindow('downloadSettingsWindow', 'Download', ['compressFiles', 'countImages', 'downOriginalImage', 'downNumber']);
        }

        function createControlButtonsWindow() {
            createSubSettingsWindow('controlButtonsWindow', 'Control Buttons', ['closeButton', 'bookmarkButton', 'downButton']);
        }

        function createThumbnailWindow() {
            createSubSettingsWindow('thumbnailWindow', 'Thumbnail', ['thumbWidth', 'thumbHeight', 'thumbHover', 'thumbBlur', 'thumbBlurAmount', 'thumbShadow', 'thumbForce']);
        }

        function createViewerWindow() {
            createSubSettingsWindow('viewerWindow', 'Viewer', ['viewerShortcut', 'viewerOpacity', 'viewerType', 'viewerWidth', 'scrollSpeed', 'preloadImage', 'preloadCount', 'originalImage', 'hideButtons',
                                                               'viewerCloseButton', 'viewerAutoOpenButton', 'viewerBookmarkButton', 'viewerDownloadButton', 'findImage', 'autoOpenViewer']);
        }

        function createShortcutWindow() {
            var shortcutWindow = createBaseWindow('shortcutWindow', 'Shortcut');

            var tooltip = document.createElement('div');
            Object.assign(tooltip.style, { fontSize: '13px', marginTop: '5px', marginBottom: '25px', textAlign: 'center'});
            tooltip.innerHTML = `
            <b>뷰어 닫기</b> :<br>ESC<br><br>
            <b>전체화면 전환</b> :<br>Spacebar<br><br>
            <b>다음 페이지 이동</b> :<br>↓, →, Z, PgDn<br><br>
            <b>이전 페이지 이동</b> :<br>↑, ←, X, PgUp<br><br>
            <b>첫 페이지 이동</b> :<br>Shift + ↑/←/X, Home<br><br>
            <b>마지막 페이지 이동</b> :<br>Shift + ↓/→/Z, End
            `;

            shortcutWindow.appendChild(tooltip);

            shortcutWindow.appendChild(createButtonContainer('확인', '취소', function() {
                saveConfig();
                shortcutWindow.remove();
            }, function() {
                shortcutWindow.remove();
            }));

            document.body.appendChild(shortcutWindow);
        }

        function createTestWindow() {
            createSubSettingsWindow('testWindow', 'Test', ['test01', 'test02', 'test03', 'test04']);
        }

        function createFilterWindow() {
            var savedLinks = GM_getValue('savedLinks', []);

            // 링크 목록 생성 부분
            var linkListContainer = document.createElement('div');
            linkListContainer.id = 'linkListContainer';
            linkListContainer.style.display = 'flex';
            linkListContainer.style.flexWrap = 'wrap';
            linkListContainer.style.justifyContent = 'center';  // 가로 중앙 정렬
            linkListContainer.style.alignItems = 'center';  // 세로 중앙 정렬
            linkListContainer.style.gap = '10px'; // Adds spacing between items
            linkListContainer.style.marginBottom = '10px';

            savedLinks.forEach(function (link, index) {
                var linkDiv = document.createElement('div');
                linkDiv.style.display = 'flex';
                linkDiv.style.flexDirection = 'column';
                linkDiv.style.alignItems = 'center';
                linkDiv.style.marginTop = '10px';
                linkDiv.style.marginBottom = '10px';
                linkDiv.style.width = '60px'; // Ensure all items have a fixed width to align properly

                // 썸네일 이미지
                var thumbnail = document.createElement('img');
                thumbnail.src = link;
                thumbnail.style.width = '50px';
                thumbnail.style.height = '50px';
                thumbnail.style.objectFit = 'cover';
                thumbnail.style.marginBottom = '5px';

                // 이미지 클릭 시 링크 입력창에 설정
                thumbnail.addEventListener('click', function () {
                    var linkInput = document.querySelector('#linkInput');
                    if (linkInput) {
                        linkInput.value = link;
                    }
                });

                // 삭제 버튼
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.border = '1px solid #cccccc';
                deleteButton.style.borderRadius = '5px';
                deleteButton.style.marginTop = '5px';
                deleteButton.style.fontSize = '12px';
                deleteButton.addEventListener('click', function () {
                    savedLinks.splice(index, 1);
                    GM_setValue('savedLinks', savedLinks);
                    createFilterWindow(); // 링크 삭제 후 새로고침
                });

                linkDiv.appendChild(thumbnail);
                linkDiv.appendChild(deleteButton);
                linkListContainer.appendChild(linkDiv);
            });

            // 링크 추가 입력창과 버튼
            var addLinkContainer = document.createElement('div');
            addLinkContainer.style.display = 'flex';
            addLinkContainer.style.alignItems = 'center';

            var linkInput = document.createElement('input');
            linkInput.type = 'text';
            linkInput.id = 'linkInput';
            linkInput.placeholder = '썸네일 링크 입력';
            linkInput.style.flex = '1';
            linkInput.style.marginRight = '5px';
            linkInput.style.padding = '5px';
            linkInput.style.width = '180px';
            linkInput.style.fontSize = '12px';

            var addLinkButton = document.createElement('button');
            addLinkButton.textContent = 'Add';
            addLinkButton.style.border = '1px solid #cccccc';
            addLinkButton.style.borderRadius = '5px';
            addLinkButton.addEventListener('click', function () {
                var newLink = linkInput.value.trim();
                if (newLink && !savedLinks.includes(newLink)) {
                    savedLinks.push(newLink);
                    GM_setValue('savedLinks', savedLinks);
                    createFilterWindow(); // 새 링크 추가 후 새로고침
                }
            });

            addLinkContainer.appendChild(linkInput);
            addLinkContainer.appendChild(addLinkButton);

            // 툴팁
            var tooltip = document.createElement('div');
            Object.assign(tooltip.style, { fontSize: '12px', marginTop: '5px', marginBottom: '10px', color: 'gray' });
            tooltip.innerHTML = '해당 게시글의 다른 이미지로 대체';

            createSubSettingsWindow('filterWindow', 'Filter', [], {
                linkListContainer: linkListContainer,
                addLinkContainer: addLinkContainer,
                tooltip: tooltip
            });
        }

        loadConfig();

        GM_registerMenuCommand('설정', function() {
            createSettingsWindow();
        });
    }

    function arcaLiveScrapList() {
        const header = document.querySelector('.list-table ');

        // 부모 div (전체 컨테이너)
        var containerDiv = document.createElement('div');
        containerDiv.style.marginBottom = '0.5rem';

        // 페이징 요소의 HTML을 가져옵니다.
        const paginationHTML = document.querySelector('.pagination.justify-content-center');
        const paginationDiv = document.createElement('div');
        paginationDiv.innerHTML = paginationHTML.outerHTML;
        paginationDiv.style.marginBottom = '0.5rem';

        // Create filter div (채널과 탭 필터)
        const filterDiv = document.createElement('div');
        filterDiv.className = 'filterDiv';
        filterDiv.style.display = 'flex';

        // Create channel filter
        const channelFilter = document.createElement('select');
        channelFilter.className = 'form-control select-list-type';
        channelFilter.name = 'sort';
        channelFilter.style.cssText = 'width: auto; height: 2rem; float: left; padding: 0 0 0 .5rem; font-size: .9rem;';
        const defaultChannelOption = document.createElement('option');
        defaultChannelOption.value = '';
        defaultChannelOption.text = '채널 선택';
        channelFilter.appendChild(defaultChannelOption);
        filterDiv.appendChild(channelFilter);

        // Create tab filter
        const tabFilter = document.createElement('select');
        tabFilter.className = 'form-control select-list-type';
        tabFilter.name = 'sort';
        tabFilter.style.cssText = 'width: auto; height: 2rem; float: left; padding: 0 0 0 .5rem; font-size: .9rem;';
        const defaultTabOption = document.createElement('option');
        defaultTabOption.value = '';
        defaultTabOption.text = '탭 선택';
        tabFilter.appendChild(defaultTabOption);
        filterDiv.appendChild(tabFilter);

        // gridContainer에 각 영역 추가
        containerDiv.appendChild(paginationDiv);
        containerDiv.appendChild(filterDiv);

        // 문서의 body에 추가 (혹은 다른 부모 요소에 추가 가능)
        header.parentNode.insertBefore(containerDiv, header);

        // Collect channels and tabs
        const posts = document.querySelectorAll('.vrow.column.filtered, .vrow.column');
        const channelTabMap = {};

        posts.forEach(post => {
            const badges = post.querySelectorAll('.badge');
            if (badges.length >= 2) {
                const channel = badges[0].textContent.trim();
                const tab = badges[1].textContent.trim();
                if (!channelTabMap[channel]) {
                    channelTabMap[channel] = new Set();
                }
                channelTabMap[channel].add(tab);
            }
        });

        // Populate channel filter
        Object.keys(channelTabMap).forEach(channel => {
            const option = document.createElement('option');
            option.value = channel;
            option.text = channel;
            channelFilter.appendChild(option);
        });

        // Update tab filter based on selected channel
        function updateTabFilter() {
            const selectedChannel = channelFilter.value;
            tabFilter.innerHTML = '';
            const defaultTabOption = document.createElement('option');
            defaultTabOption.value = '';
            defaultTabOption.text = '탭 선택';
            tabFilter.appendChild(defaultTabOption);

            if (selectedChannel && channelTabMap[selectedChannel]) {
                channelTabMap[selectedChannel].forEach(tab => {
                    const option = document.createElement('option');
                    option.value = tab;
                    option.text = tab;
                    tabFilter.appendChild(option);
                });
            }

            filterPosts();
        }

        // Filter posts based on selected channel and tab
        function filterPosts() {
            const selectedChannel = channelFilter.value;
            const selectedTab = tabFilter.value;

            posts.forEach(post => {
                const badges = post.querySelectorAll('.badge');
                if (badges.length >= 2) {
                    const postChannel = badges[0].textContent.trim();
                    const postTab = badges[1].textContent.trim();
                    if ((selectedChannel === '' || postChannel === selectedChannel) &&
                        (selectedTab === '' || postTab === selectedTab)) {
                        post.style.display = '';
                    } else {
                        post.style.display = 'none';
                    }
                }
            });
        }

        channelFilter.addEventListener('change', updateTabFilter);
        tabFilter.addEventListener('change', filterPosts);
    }

    function isArticle() {
        return document.querySelector('.article-wrapper') != null
    }

    function arcaLive() {
        // 모두 열기 버튼 생성
        if (config.openAllButton) {
            var openAllButton = document.createElement('a');
            openAllButton.className = 'btn btn-sm btn-primary float-left';
            openAllButton.href = '#';
            openAllButton.innerHTML = '<span class="ion-android-list"></span><span> 모두 열기 </span>';
            openAllButton.style.height = '2rem';

            openAllButton.addEventListener('click', function(event) {
                event.preventDefault();

                // 현재 보이는 게시글만 선택 (display가 'none'이 아닌 경우)
                var posts = document.querySelectorAll('a.vrow.column:not(.notice)');
                var postCount = 0;

                posts.forEach(function(element) {
                    var href = element.getAttribute('href');
                    var computedDisplay = getComputedStyle(element).display; // ✅ 실제 렌더링된 display 값 가져오기
                    console.log(`게시글: ${href}, display 상태: ${computedDisplay}`); // 👀 로그 추가

                    if (href && computedDisplay !== 'none') {
                        postCount++;
                    }
                });

                // 게시글 수를 포함한 메시지
                const confirmMessage = `총 ${postCount}개의 게시글을 한 번에 엽니다.\n계속 진행하시겠습니까?`;

                // 확인 메시지 표시
                if (postCount > 0 && confirm(confirmMessage)) {
                    posts.forEach(function(element) {
                        var href = element.getAttribute('href');
                        var computedDisplay = getComputedStyle(element).display;
                        console.log(`열리는 게시글: ${href}, display 상태: ${computedDisplay}`); // 👀 로그 추가

                        if (href && computedDisplay !== 'none') {
                            window.open(href, '_blank');
                        }
                    });
                } else if (postCount === 0) {
                    alert("현재 필터링된 게시글이 없습니다.");
                }
            });

            var targetElement = document.querySelector('.form-control.select-list-type');
            targetElement.parentNode.insertBefore(openAllButton, targetElement);
        }

        // 이미지와 동영상 다운로드 버튼 생성
        if (config.downAllButton) {
            async function getTotalImages(urls) {
                let totalImages = 0;
                for (const url of urls) {
                    const response = await fetch(url);
                    const html = await response.text();
                    const doc = new DOMParser().parseFromString(html, "text/html");
                    const imageElements = Array.from(doc.querySelectorAll('.article-body img')).filter(img => !img.classList.contains('arca-emoticon'));
                    const gifVideoElements = doc.querySelectorAll('video[data-orig="gif"][data-originalurl]');
                    totalImages += imageElements.length + gifVideoElements.length;
                }
                return totalImages;
            }

            async function downloadMediaSequentially(urls, totalImages, compressFiles) {
                let totalDownloaded = 0;

                // 프로그레스 바 업데이트 함수
                function updateProgressBar(progress) {
                    const progressBar = document.getElementById('progress-bar');
                    progressBar.style.width = progress + '%';
                    progressBar.innerHTML = progress + '%';
                    if (progress === 100) {
                        setTimeout(() => {
                            progressBar.style.backgroundColor = 'orange'; // 100%일 때 배경색을 주황색으로 변경
                        }, 300); // 잠시 딜레이를 주어 애니메이션 완료 후 색상 변경
                    }
                }

                async function downloadFile(url, index, type, requestUrl, zip, title) {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const extension = type === 'img' ? (config.downOriginalImage ? url.split('.').pop().split('?')[0].toLowerCase() : 'webp') : 'gif';
                    const numbersFromUrl = requestUrl.match(/\d+/)[0];
                    const fileIndex = index + 1; // Index를 1 증가시킴
                    // const sanitizedTitle = title.replace(/[^a-zA-Z0-9가-힣\s]/g, '_'); // 파일 이름에 사용할 수 있도록 제목을 정제
                    const numberedFileName = compressFiles ? `${title}_${String(fileIndex).padStart(2, '0')}.${extension}` : `${numbersFromUrl}_${String(fileIndex).padStart(2, '0')}.${extension}`;
                    if (zip) {
                        zip.file(numberedFileName, blob);
                    } else {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = numberedFileName;
                        link.click();
                    }
                }

                async function processNextUrl() {
                    for (let index = 0; index < urls.length; index++) {
                        const url = urls[index];

                        let zip;
                        if (compressFiles) {
                            zip = new JSZip();
                        }
                        const response = await fetch(url);
                        const html = await response.text();
                        const doc = new DOMParser().parseFromString(html, "text/html");

                        const titleElement = doc.querySelector('.title-row .title');
                        let title = '';
                        if (titleElement) {
                            const textNodes = Array.from(titleElement.childNodes)
                                .filter(node => node.nodeType === Node.TEXT_NODE && node.parentElement === titleElement);
                            if (textNodes.length > 0) {
                                title = textNodes.map(node => node.textContent.trim()).join('');
                            }
                        }

                        // arca-emoticon 클래스를 가진 이미지를 제외하고 선택
                        const mediaElements = Array.from(doc.querySelectorAll('.article-body img, .article-body video[data-orig="gif"]')).filter(media => !media.classList.contains('arca-emoticon'));
                        try {
                            if (mediaElements.length > 0) {
                                for (let i = 0; i < mediaElements.length; i++) {
                                    const media = mediaElements[i];
                                    const mediaType = media.tagName.toLowerCase();
                                    const mediaUrl = mediaType === 'img' ? (config.downOriginalImage ? media.getAttribute('src') + "&type=orig&type=orig" : media.getAttribute('src')) : media.getAttribute('data-originalurl');
                                    if (mediaUrl) {
                                        await downloadFile(mediaUrl, i, mediaType, url, zip, title);
                                        totalDownloaded++;
                                        if (config.countImages) {
                                            const progress = Math.round((totalDownloaded / totalImages) * 100);
                                            updateProgressBar(progress);
                                        }
                                    }
                                }
                                if (zip) {
                                    const content = await zip.generateAsync({ type: 'blob' });
                                    const numbersFromUrl = url.match(/\d+/)[0];
                                    const zipFileName = `${numbersFromUrl}.zip`;
                                    const zipLink = document.createElement('a');
                                    zipLink.href = window.URL.createObjectURL(content);
                                    zipLink.download = zipFileName;
                                    zipLink.click();
                                }
                            }
                        } catch (error) {
                            console.error("Error downloading media:", error);
                        }
                    }
                }

                await processNextUrl();
            }

            var downloadMediaButton = document.createElement('a');
            downloadMediaButton.className = 'btn btn-sm btn-success float-left';
            downloadMediaButton.href = '#';
            downloadMediaButton.innerHTML = '<span class="ion-android-download"></span><span> 다운로드 </span>';
            downloadMediaButton.style.position = 'relative'; // 상대 위치 지정

            // 프로그레스 바 스타일을 가진 div 엘리먼트 추가
            var progressBar = document.createElement('div');
            progressBar.id = 'progress-bar'; // ID 추가
            progressBar.style.position = 'absolute'; // 절대 위치 지정
            progressBar.style.bottom = '5%';
            progressBar.style.left = '0';
            progressBar.style.width = '0%'; // 초기 너비는 0%
            progressBar.style.height = '10%';
            progressBar.style.backgroundColor = 'yellow'; // 프로그레스 바 색상
            progressBar.style.borderRadius = 'inherit';
            progressBar.style.transition = 'width 0.3s ease-in-out'; // 프로그레스 바 애니메이션
            downloadMediaButton.appendChild(progressBar); // 프로그레스 바를 버튼에 추가

            downloadMediaButton.addEventListener('click', async function(event) {
                event.preventDefault();
                var mediaUrls = []; // 다운로드할 미디어 URL을 저장할 배열
                document.querySelectorAll('a.vrow.column:not(.notice)').forEach(function(element) {
                    var href = element.getAttribute('href');
                    var classes = element.className.split(' ');

                    if (classes.includes('filtered') || classes.includes('filtered-keyword')) {
                        return; // 해당 조건이 맞으면 다음으로 넘어감
                    }

                    if (href) {
                        mediaUrls.push(href); // 미디어 URL을 배열에 추가
                    }
                });
                const mediaUrlsCount = mediaUrls.length;

                if (config.countImages) {
                    const initialMessage = `총 ${mediaUrlsCount}개의 게시글을 찾았습니다.\n모든 게시글의 이미지를 확인하여 총 개수를 계산합니다.\n계산하는 데 시간이 오래 걸릴 수 있습니다.\n(설정에서 변경 가능)`;
                    alert(initialMessage);

                    const totalImages = await getTotalImages(mediaUrls);
                    const confirmMessage = `다운로드해야 할 이미지의 총 개수는 ${totalImages}개입니다.\n계속해서 다운로드 하시겠습니까?`;
                    if (confirm(confirmMessage)) {
                        progressBar.style.width = '0%'; // 초기 너비는 0%
                        progressBar.style.backgroundColor = 'yellow'; // 프로그레스 바 색상
                        await downloadMediaSequentially(mediaUrls, totalImages, config.compressFiles); // config.compressFiles 변수 전달
                    }
                } else {
                    // 프로그레스 바를 사용하지 않을 경우에는 다운로드 여부를 확인하는 창 띄우기
                    const confirmMessage = `총 ${mediaUrlsCount}개의 게시글을 한 번에 다운로드합니다.\n다운로드를 진행하시겠습니까?`;
                    if (confirm(confirmMessage)) {
                        progressBar.style.width = '0%'; // 초기 너비는 0%
                        progressBar.style.backgroundColor = 'yellow'; // 프로그레스 바 색상
                        await downloadMediaSequentially(mediaUrls, 0, config.compressFiles); // config.compressFiles 변수 전달
                        progressBar.style.width = '100%';
                        progressBar.style.backgroundColor = 'orange'; // 100%일 때 배경색을 주황색으로 변경

                    }
                }
            });

            var targetElement = document.querySelector('.form-control.select-list-type');
            targetElement.parentNode.insertBefore(downloadMediaButton, targetElement);
        }

        if (config.sortButton) {
            const sortButton = document.createElement('a');
            sortButton.className = 'btn btn-sm btn-secondary float-left';
            sortButton.href = '#';
            sortButton.style.height = '2rem';

            let sortKey = 'date';       // 정렬 기준: 등록순 or 추천순
            let sortDirection = 'desc'; // 정렬 방향
            let originalOrder = [];     // 초기 게시글 순서 저장용

            const icon = document.createElement('span');
            icon.className = 'ion-arrow-down-b';
            icon.style.cursor = 'pointer';

            const text = document.createElement('span');
            text.textContent = ' 등록순';
            text.style.cursor = 'default';

            sortButton.appendChild(icon);
            sortButton.appendChild(text);

            // 정렬 실행 함수
            function sortPosts() {
                const container = document.querySelector('a.vrow.column:not(.notice)')?.parentNode;
                if (!container) return;

                let posts = Array.from(document.querySelectorAll('a.vrow.column:not(.notice)'))

                if (posts.length === 0) {
                    alert("현재 필터링된 게시글이 없습니다.");
                    return;
                }

                // 최초 로딩 시 원래 순서 저장
                if (originalOrder.length === 0) {
                    originalOrder = posts.slice();
                }

                let sortedPosts;

                if (sortKey === 'rate') {
                    // 추천순 정렬
                    sortedPosts = posts.slice().sort((a, b) => {
                        const aRate = parseInt(a.querySelector('.vcol.col-rate')?.innerText.trim() || '0', 10);
                        const bRate = parseInt(b.querySelector('.vcol.col-rate')?.innerText.trim() || '0', 10);
                        return sortDirection === 'asc' ? aRate - bRate : bRate - aRate;
                    });
                } else if (sortKey === 'date') {
                    // 등록순 정렬
                    if (sortDirection === 'desc') {
                        sortedPosts = originalOrder.slice();
                    } else {
                        sortedPosts = originalOrder.slice().reverse();
                    }
                }

                // 정렬된 게시글을 container에 다시 삽입
                sortedPosts.forEach(post => container.appendChild(post));
            }

            // 아이콘 클릭 → 방향 토글
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                icon.className = sortDirection === 'asc' ? 'ion-arrow-up-b' : 'ion-arrow-down-b';

                // 정렬 실행
                sortPosts();
            });

            // 버튼 클릭 → 정렬 기준 토글
            sortButton.addEventListener('click', (e) => {
                e.preventDefault();

                if (sortKey === 'date') {
                    sortKey = 'rate';
                    text.textContent = ' 추천순';
                } else {
                    sortKey = 'date';
                    text.textContent = ' 등록순';
                }

                // 정렬 실행
                sortPosts();
            });

            const targetElement = document.querySelector('.form-control.select-list-type');
            targetElement.parentNode.insertBefore(sortButton, targetElement);
        }

        if (config.downNumber) {
            // document.addEventListener("DOMContentLoaded", function() {
            // });
            document.querySelectorAll('.vrow.column:not(.notice) .vcol.col-id').forEach(function(link) {
                link.addEventListener('click', async function(event) {
                    event.preventDefault(); // 기본 동작 방지
                    link.style.color = 'orange'; // 다운로드 시작 시 노란색으로 변경
                    const parentHref = link.closest('.vrow.column').getAttribute('href');
                    await downloadMediaFromUrl(parentHref, config.compressFiles); // compressFiles 변수 전달
                    link.style.color = 'red'; // 다운로드 완료 시 빨간색으로 변경
                });
            });

            async function downloadMediaFromUrl(url, compressFiles) { // compressFiles 변수 추가
                const response = await fetch(url);
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");
                const mediaElements = Array.from(doc.querySelectorAll('.article-body img, .article-body video[data-orig="gif"]')).filter(media => !media.classList.contains('arca-emoticon'));
                let zip;

                const titleElement = doc.querySelector('.title-row .title');
                let title = '';
                if (titleElement) {
                    const textNodes = Array.from(titleElement.childNodes)
                        .filter(node => node.nodeType === Node.TEXT_NODE && node.parentElement === titleElement);
                    if (textNodes.length > 0) {
                        title = textNodes.map(node => node.textContent.trim()).join('');
                    }
                }

                async function downloadFile(mediaUrl, index, type) {
                    const response = await fetch(mediaUrl);
                    const blob = await response.blob();
                    const extension = type === 'img' ? (config.downOriginalImage ? mediaUrl.split('.').pop().split('?')[0].toLowerCase() : 'webp') : 'gif';
                    const fileIndex = index + 1;
                    const numbersFromUrl = url.match(/\d+/)[0];
                    // const sanitizedTitle = title.replace(/[^a-zA-Z0-9가-힣\s]/g, '_'); // 파일 이름에 사용할 수 있도록 제목을 정제
                    const numberedFileName = compressFiles ? `${title}_${String(fileIndex).padStart(2, '0')}.${extension}` : `${numbersFromUrl}_${String(fileIndex).padStart(2, '0')}.${extension}`;
                    if (compressFiles) {
                        zip.file(numberedFileName, blob);
                    } else {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = numberedFileName;
                        link.click();
                    }
                }

                async function processMedia() {
                    for (let i = 0; i < mediaElements.length; i++) {
                        const media = mediaElements[i];
                        const mediaType = media.tagName.toLowerCase();
                        const mediaUrl = mediaType === 'img' ? (config.downOriginalImage ? media.getAttribute('src') + "&type=orig" : media.getAttribute('src')) : media.getAttribute('data-originalurl');
                        if (mediaUrl) {
                            await downloadFile(mediaUrl, i, mediaType);
                        }
                    }
                }

                if (compressFiles) {
                    zip = new JSZip();
                }

                await processMedia();

                if (compressFiles) {
                    const content = await zip.generateAsync({ type: 'blob' });
                    const zipFileName = url.match(/\d+/)[0] + '.zip';
                    const zipLink = document.createElement('a');
                    zipLink.href = window.URL.createObjectURL(content);
                    zipLink.download = zipFileName;
                    zipLink.click();
                }
            }
        }

        if (config.thumbnail) {
            let referenceUrlsCache = null;
            let isFetching = false;
            let fetchCallbacksQueue = [];

            const defaultUrls = JSON.parse(GM_getValue("referenceImageUrls", "[]"));
            const type = "&type=list";

            document.addEventListener("DOMContentLoaded", function() {
                function checkImageLoadable(url) {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                        img.src = url + type;
                    });
                }

                function fetchReferenceImagesFromArcaOnce(callback) {
                    if (referenceUrlsCache !== null) {
                        callback();
                        return;
                    }

                    if (isFetching) {
                        fetchCallbacksQueue.push(callback);
                        return;
                    }

                    isFetching = true;
                    fetchCallbacksQueue.push(callback);

                    checkImageLoadable(defaultUrls[0]).then(isValid => {
                        if (isValid) {
                            referenceUrlsCache = defaultUrls;
                            // console.log("✅ 기본 이미지 사용:", referenceUrlsCache);

                            // ⛔ 저장 안 함 (기본값이니까)

                            isFetching = false;
                            while (fetchCallbacksQueue.length > 0) {
                                const cb = fetchCallbacksQueue.shift();
                                cb();
                            }
                        } else {
                            console.warn("❌ 기본 이미지 실패 → Arca에서 이미지 fetch 시작");

                            fetch("https://arca.live/b/simya/83108093")
                                .then(response => response.text())
                                .then(html => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const images = doc.querySelectorAll('.article-body img');

                                const urls = [];
                                if (images.length >= 4) {
                                    console.log(images[2].src);
                                    console.log(images[3].src);
                                    urls.push(images[2].src);
                                    urls.push(images[3].src);
                                    referenceUrlsCache = urls;

                                    console.log("✅ Arca에서 이미지 가져옴:", urls);

                                    // ✅ Arca에서 정상적으로 가져온 경우에만 저장
                                    GM_setValue("referenceImageUrls", JSON.stringify(referenceUrlsCache));
                                } else {
                                    referenceUrlsCache = defaultUrls;
                                    console.warn("⚠ 이미지 부족 - 기본 이미지 유지");
                                }
                            })
                                .catch(error => {
                                console.error("❌ Arca 페이지 가져오기 실패:", error);
                                referenceUrlsCache = defaultUrls;
                            })
                                .finally(() => {
                                isFetching = false;
                                while (fetchCallbacksQueue.length > 0) {
                                    const cb = fetchCallbacksQueue.shift();
                                    cb();
                                }
                            });
                        }
                    });
                }

                function checkImageSimilarity(img, referenceImgUrl, callback) {
                    const img1 = new Image();
                    const img2 = new Image();

                    let loadedCount = 0;

                    function onBothLoaded() {
                        const canvas1 = document.createElement("canvas");
                        const canvas2 = document.createElement("canvas");

                        const width = 50, height = 50;
                        canvas1.width = width; canvas1.height = height;
                        canvas2.width = width; canvas2.height = height;

                        const ctx1 = canvas1.getContext("2d");
                        const ctx2 = canvas2.getContext("2d");

                        ctx1.drawImage(img1, 0, 0, width, height);
                        ctx2.drawImage(img2, 0, 0, width, height);

                        const data1 = ctx1.getImageData(0, 0, width, height).data;
                        const data2 = ctx2.getImageData(0, 0, width, height).data;

                        let diff = 0;
                        for (let i = 0; i < data1.length; i += 4) {
                            const dr = data1[i] - data2[i];
                            const dg = data1[i + 1] - data2[i + 1];
                            const db = data1[i + 2] - data2[i + 2];
                            diff += Math.abs(dr) + Math.abs(dg) + Math.abs(db);
                        }

                        const avgDiff = diff / (width * height);
                        /*
                        console.log("이미지 비교:", {
                            기준: img1.src,
                            비교대상: img2.src,
                            유사도차이: avgDiff
                        });
                        */
                        callback(avgDiff < 100);
                    }

                    img1.crossOrigin = "anonymous";
                    img2.crossOrigin = "anonymous";

                    img1.onload = () => { if (++loadedCount === 2) onBothLoaded(); };
                    img2.onload = () => { if (++loadedCount === 2) onBothLoaded(); };

                    img1.src = referenceImgUrl + type + type + type;
                    img2.src = img.src + type + type;
                }

                function checkImageSimilarityWithMultiple(img, callback) {
                    if (!referenceUrlsCache || referenceUrlsCache.length < 2) {
                        callback(false); // 아직 캐시가 준비 안 됐으면 비교 못 함
                        return;
                    }

                    let checkedCount = 0;
                    let matched = false;

                    referenceUrlsCache.forEach(referenceUrl => {
                        checkImageSimilarity(img, referenceUrl, function (isSimilar) {
                            checkedCount++;
                            if (isSimilar && !matched) {
                                matched = true;
                                callback(true);
                            }
                            if (checkedCount === referenceUrlsCache.length && !matched) {
                                callback(false);
                            }
                        });
                    });
                }

                function setSecondImg(vrow, img) {
                    var href = vrow.href;

                    fetch(href)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Request failed with status ' + response.status);
                            }
                            return response.text();
                        })
                        .then(responseText => {
                            var parser = new DOMParser();
                            var htmlDoc = parser.parseFromString(responseText, "text/html");
                            var contentDiv = htmlDoc.querySelector('div.fr-view.article-content');
                            if (!contentDiv) {
                                return;
                            }

                            var Tags = contentDiv.querySelectorAll('img, video');
                            var firstTag = null;

                            for (var i = 0; i < Tags.length; i++) {
                                firstTag = Tags[i];

                                if (firstTag.style.width == '2px' && firstTag.style.height == '2px') {
                                    break;
                                } else if (firstTag.tagName.toLowerCase() === 'img') {
                                    if (!(img.src.split("?")[0] === firstTag.src.split("?")[0])) {
                                        break;
                                    }
                                } else if (firstTag.tagName.toLowerCase() === 'video') {
                                    break;
                                }
                            }

                            if (!firstTag) {
                                return;
                            }

                            var videoOriginalSrc = firstTag.getAttribute('data-originalurl');
                            var videoOriginalSrcType = firstTag.getAttribute('data-orig');
                            var videoPosterSrc = firstTag.getAttribute('poster');
                            var changeImgUrl = null;
                            if (firstTag.tagName.toLowerCase() === 'img') {
                                changeImgUrl = firstTag.src + "&type=list";
                            } else if (firstTag.tagName.toLowerCase() === 'video') {
                                if (videoOriginalSrc && !videoOriginalSrcType) {
                                    changeImgUrl = videoOriginalSrc + "&type=list";
                                } else if (videoPosterSrc) {
                                    changeImgUrl = videoPosterSrc + "&type=list";
                                } else {
                                    changeImgUrl = img.src;
                                }
                            }

                            if (config.test03) {
                                img.onload = function () {
                                    img.parentNode.style.border = '2px solid pink';
                                    // img.parentNode.style.boxShadow = 'rgb(255 155 155) 2px 2px 2px';
                                };
                                img.src = changeImgUrl;
                            }

                            var previewImg = vrow.querySelector('.vrow-preview img')
                            previewImg.src = changeImgUrl.replace("&type=list", '');
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                }

                if (config.test && config.test04) {
                    const articleBody = document.querySelector(".article-body");
                    if (!articleBody) {
                    } else {
                        const firstImg = articleBody.querySelector("img");
                        if (!firstImg) {
                        } else {
                            fetchReferenceImagesFromArcaOnce(() => {
                                checkImageSimilarityWithMultiple(firstImg, function (isSimilar) {
                                    if (isSimilar) {
                                        firstImg.style.display = "none";
                                    }
                                });
                            });
                        }
                    }
                }

                const vrows = document.querySelectorAll('a.vrow.column:not(.notice)')
                vrows.forEach(function(vrow) {
                    var vcolId = vrow.querySelector('.vcol.col-id');
                    var vcolTitle = vrow.querySelector('.vcol.col-title');
                    vcolId.style.margin = '0';
                    vcolId.style.height = 'auto';
                    vcolId.style.display = 'flex';
                    vcolId.style.alignItems = 'center'; // 세로 가운데 정렬
                    vcolId.style.justifyContent = 'center'; // 가로 가운데 정렬

                    var vcolThumb = vrow.querySelector('.vcol.col-thumb');
                    if (!vcolThumb) {
                        vcolThumb = document.createElement('span');
                        vcolThumb.className = 'vcol col-thumb';
                        vcolThumb.style.width = config.thumbWidth + 'px';
                        vcolThumb.style.borderRadius = '3px';

                        vrow.querySelector('.vrow-inner').appendChild(vcolThumb);
                        vcolTitle.parentNode.insertBefore(vcolThumb, vcolTitle);
                    }

                    // vrowPreview가 존재할 때만 썸네일을 추가하도록 조건 추가
                    var thumbnailCreated = false;  // 썸네일 생성 여부 플래그
                    function createThumbnail(vrowPreview) {
                        if (thumbnailCreated) return;  // 이미 썸네일이 생성되었으면 더 이상 생성하지 않음

                        var previewImg = vrowPreview.querySelector('img');
                        if (!previewImg) return;

                        vrow.style.height = 'auto';
                        vrow.style.paddingTop = '3.75px';
                        vrow.style.paddingBottom = '3.75px';
                        vcolThumb.style.height = config.thumbHeight + 'px';

                        var thumbImg = vcolThumb.querySelector('img');
                        if (!thumbImg) {
                            thumbImg = document.createElement('img');
                            thumbImg.src = previewImg.src;
                            thumbImg.style.width = '100%';
                            thumbImg.style.height = '100%';
                            thumbImg.style.objectFit = 'cover';
                            if (config.thumbShadow) {
                                thumbImg.onload = function () {
                                    vcolThumb.style.boxShadow = 'rgba(0, 0, 0, 0.4) 2px 2px 2px';
                                }
                            }
                            if (config.test) {
                                if (config.test01) {
                                    fetchReferenceImagesFromArcaOnce(() => {
                                        checkImageSimilarityWithMultiple(thumbImg, function (isSimilar) {
                                            if (isSimilar) {
                                                setSecondImg(vrow, thumbImg);
                                            }
                                        });
                                    });
                                }

                                if (config.test02) {
                                    function removeQueryString(url) {
                                        var parsedUrl = new URL(url);
                                        return parsedUrl.origin + parsedUrl.pathname;
                                    }

                                    var savedLinks = GM_getValue('savedLinks', []);
                                    var cleanSrc = removeQueryString(thumbImg.src);
                                    if (savedLinks.some(link => cleanSrc.includes(removeQueryString(link)))) {
                                        setSecondImg(vrow, thumbImg);
                                        console.log("Filtered Image:", vcolId.querySelector('span').textContent, thumbImg.src);
                                    }
                                }
                            }

                            if (config.thumbBlur) {
                                thumbImg.style.filter = 'blur(' + config.thumbBlurAmount + 'px)';
                                thumbImg.addEventListener('mouseenter', function() {
                                    thumbImg.style.filter = 'none';
                                });
                                thumbImg.addEventListener('mouseleave', function() {
                                    thumbImg.style.filter = 'blur(' + config.thumbBlurAmount + 'px)';
                                });
                            }

                            if (config.thumbHover) {
                                thumbImg.addEventListener('mouseenter', function() {
                                    vrowPreview.style.display = null;
                                });
                                thumbImg.addEventListener('mouseleave', function() {
                                    vrowPreview.style.display = 'none';
                                });
                            }
                            vcolThumb.appendChild(thumbImg);

                            thumbnailCreated = true;  // 썸네일 생성 완료
                        }
                        vrowPreview.style.display = 'none';
                        vrowPreview.style.pointerEvents = 'none';
                        vrowPreview.style.width = '30rem';
                        vrowPreview.style.height = 'auto';
                        vrowPreview.style.top = 'auto';
                        vrowPreview.style.left = (99) + parseFloat(config.thumbWidth) + 'px';
                        previewImg.src = previewImg.src.replace("&type=list", '');
                    }

                    function tryCreateThumbnail(retryCount, vrowPreview) {
                        if (retryCount >= 100 || thumbnailCreated) return;  // 썸네일이 이미 생성되었으면 더 이상 시도하지 않음
                        setTimeout(function() {
                            if (retryCount === 0) createThumbnail(vrowPreview);
                            tryCreateThumbnail(retryCount + 1, vrowPreview);
                        }, 100);
                    }
                    var vrowPreview = vrow.querySelector('.vrow-preview')
                    if (vrowPreview) {
                        tryCreateThumbnail(0, vrowPreview);
                    } else if (!isArticle() && config.thumbForce) {
                        // 썸네일 없으면 내용 검색
                        function putPreview(dest, img) {
                            var div = document.createElement('div')
                            div.className = 'vrow-preview'
                            if (img.src) {
                                if (!img.src.includes('type=list')) {
                                    img.src += (img.src.includes('?') ? '&' : '?') + 'type=list';
                                }
                            }
                            div.appendChild(img)
                            dest.appendChild(div)
                            tryCreateThumbnail(0, div);
                        }

                        function findFrom(url) {
                            fetch(url)
                                .then(res => res.text())
                                .then(html => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');

                                const innerImgs = doc.querySelectorAll(".fr-view.article-content img");

                                if (innerImgs && innerImgs.length > 0) {
                                    putPreview(
                                        vrow,
                                        innerImgs[0]
                                    )
                                } else {
                                    const innerVideos = doc.querySelectorAll(".fr-view.article-content video");
                                    if (innerVideos && innerVideos.length > 0) {
                                        var poster = document.createElement("img")
                                        poster.src = innerVideos[0].poster
                                        putPreview(
                                            vrow,
                                            poster
                                        )
                                    }
                                }
                            });
                        }
                        findFrom(vrow.href)
                    }
                });
            });
        }

        if (config.controlButtons) {
            if ((config.closeButton || config.bookmarkButton || config.downButton)) {
                document.addEventListener('DOMContentLoaded', function () {
                    var articleMenu = document.querySelector('.article-menu.mt-2');
                    var originalScrapButton = articleMenu ? articleMenu.querySelector('.scrap-btn') : null;
                    var originalDownloadButton = articleMenu ? articleMenu.querySelector('#imageToZipBtn') : null;
                    var navControl = document.querySelector('.nav-control');

                    // 새로운 리스트 아이템 요소를 생성하는 함수
                    function createNewItem(iconClass, clickHandler, hoverHandler, leaveHandler) {
                        var newItem = document.createElement('li');
                        newItem.innerHTML = '<span class="' + iconClass + '"></span>';
                        newItem.addEventListener('click', clickHandler);
                        if (hoverHandler) {
                            newItem.addEventListener('mouseenter', hoverHandler);
                        }
                        if (leaveHandler) {
                            newItem.addEventListener('mouseleave', leaveHandler);
                        }
                        return newItem;
                    }

                    // 새로운 아이템을 내비게이션 컨트롤 리스트에 추가하거나 업데이트하는 함수
                    function appendOrUpdateItem(newItem) {
                        if (navControl) {
                            if (navControl.children.length > 0) {
                                navControl.insertBefore(newItem, navControl.firstElementChild);
                            } else {
                                navControl.appendChild(newItem);
                            }
                        } else {
                            console.error('내비게이션 컨트롤 리스트를 찾을 수 없습니다.');
                        }
                    }

                    // 다운로드 버튼 생성
                    if (config.controlButtons && config.downButton) {
                        if (articleMenu) {
                            var downloadButton = createNewItem(
                                'ion-android-download',
                                downloadButtonClickHandler,
                                downloadButtonHoverHandler,
                                downloadButtonLeaveHandler
                            );
                            appendOrUpdateItem(downloadButton);
                        }
                    }

                    // 다운로드 버튼 핸들러
                    function downloadButtonClickHandler() {
                        originalDownloadButton = articleMenu.querySelector('#imageToZipBtn');

                    if (originalDownloadButton) {
                        // 다운로드 버튼 클릭
                        originalDownloadButton.click();

                        var progressChecked = false; // 프로그레스 바가 50% 이상인지 체크하는 변수
                        var intervalId = setInterval(function () {
                            // 다운로드 진행 상태를 추적할 .download-progress 요소 찾기
                            var downloadProgress = originalDownloadButton.querySelector('.download-progress');

                            if (downloadProgress) {
                                // 프로그레스 바가 존재하면 진행 상태의 width 값 확인
                                var width = parseFloat(downloadProgress.style.width);

                                // 50% 이상이면 완료된 것으로 간주
                                if (width >= 50) {
                                    progressChecked = true;
                                }

                                // 프로그레스 바가 진행되면서 다운로드 버튼의 배경색을 조정
                                downloadButton.style.background = `
                                    linear-gradient(to top, green ${width}%, transparent ${width}%),
                                    #3d414d
                                `;

                                // 프로그레스 바가 100%에 도달했을 때
                                if (width >= 100) {
                                    clearInterval(intervalId); // 애니메이션 종료
                                    downloadButton.style.background = `
                                        linear-gradient(to top, green 100%, transparent 100%),
                                        #3d414d
                                    `;
                                }
                            } else {
                                // 프로그레스 바가 사라졌을 때 (프로그레스 바가 없을 때)
                                if (progressChecked) {
                                    // 프로그레스 바가 50% 이상이었다면 완료된 것으로 간주
                                    downloadButton.style.background = `
                                        linear-gradient(to top, green 100%, transparent 100%),
                                        #3d414d
                                    `;
                                } else {
                                    // 프로그레스 바가 50% 미만이었다면 취소로 간주
                                    downloadButton.style.background = `
                                        linear-gradient(to top, green 0%, transparent 0%),
                                        #3d414d
                                    `;
                                }
                                clearInterval(intervalId); // 애니메이션 종료
                            }
                        }, 10); // 10ms마다 확인
                    }

                    }
                    function downloadButtonHoverHandler() {
                        this.style.backgroundColor = 'green';
                    }
                    function downloadButtonLeaveHandler() {
                        this.style.backgroundColor = '';
                    }

                    // 북마크 버튼 생성
                    if (config.controlButtons && config.bookmarkButton) {
                        if (originalScrapButton) {
                            var bookmarkButton = createNewItem(
                                'ion-android-bookmark',
                                bookmarkButtonClickHandler,
                                bookmarkButtonHoverHandler,
                                bookmarkButtonLeaveHandler
                            );
                            appendOrUpdateItem(bookmarkButton);

                            // 북마크 버튼 색상을 업데이트하는 함수
                            function updateButtonColor() {
                                var buttonText = originalScrapButton.querySelector('.result').textContent.trim();
                                bookmarkButton.style.backgroundColor = (buttonText === "스크랩 됨") ? '#007bff' : '';
                            }

                            // 초기 호출 및 MutationObserver 설정
                            updateButtonColor();
                            var observer = new MutationObserver(updateButtonColor);
                            observer.observe(originalScrapButton.querySelector('.result'), { childList: true, subtree: true });
                        }
                    }

                    // 북마크 버튼 핸들러
                    function bookmarkButtonClickHandler() {
                        if (originalScrapButton) {
                            originalScrapButton.click();
                        } else {
                            console.error('원래의 스크랩 버튼을 찾을 수 없습니다.');
                        }
                    }
                    function bookmarkButtonHoverHandler() {
                        this.style.backgroundColor = '#007bff';
                    }
                    function bookmarkButtonLeaveHandler() {
                        var buttonText = originalScrapButton.querySelector('.result').textContent.trim();
                        this.style.backgroundColor = (buttonText === "스크랩 됨") ? '#007bff' : '';
                    }

                    // 닫기 버튼 생성 및 추가
                    if (config.controlButtons && config.closeButton) {
                        var closeButton = createNewItem(
                            'ion-close-round',
                            closeButtonClickHandler,
                            closeButtonHoverHandler,
                            closeButtonLeaveHandler
                        );
                        appendOrUpdateItem(closeButton);
                    }

                    // 닫기 버튼 핸들러
                    function closeButtonClickHandler() {
                        window.close();
                    }
                    function closeButtonHoverHandler() {
                        this.style.backgroundColor = 'red';
                    }
                    function closeButtonLeaveHandler() {
                        this.style.backgroundColor = '';
                    }
                });
            }
        }

/*
        const config = {
            viewer: true,
            viewerWidth: 70,
            viewerType: 1,
            viewerOpacity: 0.9,
            scrollSpeed: 1,
            findImage: true,
            preloadImage: true,
            preloadCount: 3
        };
*/
        if (config.viewer) {
            let currentIndex = 0; // 현재 이미지 인덱스
            let images = []; // 게시글 내 이미지 배열
            let loadedImages = []; // 미리 로드된 이미지 배열
            let viewer = null; // 뷰어 엘리먼트
            let viewContainer = null;
            let leftResizer = null;
            let imageContainer = null; // 뷰어 이미지 컨테이너
            let imageContainerWidth = config.viewerWidth +'%'; // 뷰어 이미지 컨테이너
            let rightResizer = null;
            let scrollbarContainer = null; // 사용자 정의 스크롤바
            let scrollbar = null; // 사용자 정의 스크롤바
            let counter = null; // 이미지 카운터
            let viewerType = (config.viewerType == 2) ? 'scroll' : 'single';
            let scrollSpeed = config.scrollSpeed; // 기본 스크롤 속도 (1x)
            let dragThumb = false;
            let dragImage = false;
            let startTop = 0;
            let startPos = 0;
            let startX = 0;
            let startY = 0;
            let eventTarget = null;
            let isPortrait = false;
            let isMobile = false;
            let debug = false;

            function getImages() {
                const imgElements = Array.from(document.querySelectorAll(".fr-view.article-content img"))
                .filter(img => !img.classList.contains("arca-emoticon"));

                const videoGifElements = Array.from(document.querySelectorAll(".fr-view.article-content video"))
                .filter(video => video.getAttribute("data-orig") === "gif" && video.hasAttribute("data-originalurl"));

                images = [
                    ...imgElements.map(img => {
                        const src = img.src.startsWith("//") ? "https:" + img.src : img.src;
                        return src + (config.originalImage ? "&type=orig" : "");
                    }),
                    ...videoGifElements.map(video => {
                        const src = video.getAttribute("data-originalurl");
                        return src.startsWith("//") ? "https:" + src : src;
                    })
                ];

                const allInteractiveElements = [...imgElements, ...videoGifElements];

                allInteractiveElements.forEach((element, index) => {
                    element.style.cursor = "pointer";
                    element.addEventListener("click", (event) => {
                        event.preventDefault();
                        currentIndex = index;
                        showViewer();
                    });
                });
            }

            function loadImage(img, index) {
                if (index >= images.length) return; // 인덱스 범위 초과 방지

                // 현재 이미지를 로드할 때
                const loadedImg = loadedImages.find(image => image.src === images[index]);

                if (loadedImg) {
                    img.src = loadedImg.src; // 로드된 이미지 사용
                } else {
                    // 새로운 이미지 객체 생성 및 로드
                    const newImg = new Image();
                    newImg.src = images[index];

                    newImg.onload = () => {
                        loadedImages.push(newImg); // 새로운 이미지 캐시에 저장
                        img.src = newImg.src; // 새로운 이미지 적용
                    };
                }

                if (config.preloadImage) {
                    const preloadCount = config.preloadCount == 0 ? images.length : config.preloadCount; // preloadCount가 0일 때는 모든 이미지를 다운로드

                    // 다음 이미지들을 미리 로드 (preloadCount 만큼)
                    for (let i = 1; i <= preloadCount; i++) {
                        const nextIndex = index + i;
                        if (nextIndex < images.length) {
                            const nextImg = loadedImages.find(image => image.src === images[nextIndex]);
                            if (!nextImg) {
                                const newNextImg = new Image();
                                newNextImg.src = images[nextIndex];

                                newNextImg.onload = () => {
                                    loadedImages.push(newNextImg); // 다음 이미지 캐시에 저장
                                };
                            }
                        }
                    }
                }
            }

            function createViewer() {
                isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

                viewer = document.createElement("div");
                viewer.id = "imageViewer";
                viewer.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, ${config.viewerOpacity}); backdrop-filter: blur(2px);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center; z-index: 1036; overflow: hidden;
                `;

                viewContainer = document.createElement("div");
                viewContainer.id = "viewContainer"; // 아이디 추가

                imageContainer = document.createElement("div");
                imageContainer.id = "imageContainer"; // 아이디 추가

                // 왼쪽 크기 조절 막대
                leftResizer = document.createElement("div");
                leftResizer.className = "resizer left";
                leftResizer.style.cssText = `
                    display: none; width: 15px; height: 100%; cursor: ew-resize; background: rgba(255, 255, 255, 0.1);`;

                // 이미지 컨테이너
                imageContainer = document.createElement("div");
                imageContainer.id = "imageContainer";


                // 오른쪽 크기 조절 막대
                rightResizer = document.createElement("div");
                rightResizer.className = "resizer right";
                rightResizer.style.cssText = `
                    display: none; width: 15px; height: 100%; cursor: ew-resize; background: rgba(255, 255, 255, 0.1);`;

                viewContainer.appendChild(leftResizer);
                viewContainer.appendChild(imageContainer);
                viewContainer.appendChild(rightResizer);
                viewer.appendChild(viewContainer);
                document.body.appendChild(viewer);

                createButtons();
                createScrollbar();
                createCounter();

                dragScroll();

                // 뷰어 전체에서 휠 이벤트 허용
                viewContainer.addEventListener("wheel", wheelScroll);

                document.addEventListener("pointerdown", (event) => {
                    if (debug) console.log(event.target.id + ': pointerdown');
                    eventTarget = event.target;
                });

                viewContainer.addEventListener("pointerup", (event) => {
                    if (eventTarget == viewContainer && event.target == viewContainer) {
                        if (debug) console.log('viewContainer: pointerup');
                        closeViewer();
                    }
                });

                imageContainer.addEventListener("click", (event) => {
                    if (debug) console.log('imageContainer: click');
                    event.stopPropagation();
                    if (viewerType !== 'single') return;

                    if (currentIndex < images.length - 1) {
                        currentIndex++;
                        updateViewerImages();
                    } else {
                        closeViewer();  // 마지막 이미지일 경우 닫기
                    }
                });

                if (config.viewerShortcut) {
                    document.addEventListener("keydown", (event) => {
                        if (viewer.style.display === "none") return; // 뷰어가 닫혀있으면 실행하지 않음

                        if (event.key === "Escape") {
                            closeViewer();
                            return;
                        }

                        if (event.key === " ") {
                            console.log("Spacebar");
                            if (!document.fullscreenElement) {
                                viewer.requestFullscreen().catch((err) => {
                                    console.error(`[이미지 뷰어] 전체 화면 전환 실패: ${err.message}`);
                                });
                            } else {
                                document.exitFullscreen().catch((err) => {
                                    console.error(`[이미지 뷰어] 전체 화면 해제 실패: ${err.message}`);
                                });
                            }
                            return;
                        }

                        if (viewerType === 'single') {
                            // 🔹 첫 페이지 이동 (Shift + X, Shift + ←, Shift + ↓ 포함) → 최우선 실행
                            if (event.key === "Home" || (event.shiftKey && ["X", "ArrowLeft", "ArrowUp"].includes(event.key))) {
                                currentIndex = 0;
                                updateViewerImages();
                            }
                            // 🔹 마지막 페이지 이동 (Shift + Z, Shift + →, Shift + ↑ 포함) → 최우선 실행
                            else if (event.key === "End" || (event.shiftKey && ["Z", "ArrowRight", "ArrowDown"].includes(event.key))) {
                                currentIndex = images.length - 1;
                                updateViewerImages();
                            }
                            // 🔹 다음 페이지 이동
                            else if (["ArrowRight", "ArrowDown", "PageDown", "z"].includes(event.key)) {
                                if (currentIndex < images.length - 1) {
                                    currentIndex++;
                                    updateViewerImages();
                                }
                            }
                            // 🔹 이전 페이지 이동
                            else if (["ArrowLeft", "ArrowUp", "PageUp", "x"].includes(event.key)) {
                                if (currentIndex > 0) {
                                    currentIndex--;
                                    updateViewerImages();
                                }
                            }
                        }
                        // 🔹 일반 스크롤 모드
                        else {
                            const maxScroll = imageContainer.scrollHeight - imageContainer.clientHeight;

                            // 최상단으로 이동 (Shift + X, Shift + ↓ 포함) → 최우선 실행
                            if (event.key === "Home" || (event.shiftKey && ["X", "ArrowUp"].includes(event.key))) {
                                imageContainer.scrollTop = 0;
                                event.preventDefault();
                            }
                            // 최하단으로 이동 (Shift + Z, Shift + ↑ 포함) → 최우선 실행
                            else if (event.key === "End" || (event.shiftKey && ["Z", "ArrowDown"].includes(event.key))) {
                                imageContainer.scrollTop = maxScroll;
                                event.preventDefault();
                            }
                            // 아래로 스크롤
                            else if (["ArrowDown", "PageDown", "z"].includes(event.key)) {
                                if (imageContainer.scrollTop < maxScroll) {
                                    imageContainer.scrollTop += 20 * scrollSpeed;
                                    event.preventDefault();
                                }
                            }
                            // 위로 스크롤
                            else if (["ArrowUp", "PageUp", "x"].includes(event.key)) {
                                if (imageContainer.scrollTop > 0) {
                                    imageContainer.scrollTop -= 20 * scrollSpeed;
                                    event.preventDefault();
                                }
                            }

                            // Thumb 및 Counter 동기화
                            requestAnimationFrame(() => {
                                updateScrollIndex();
                                updateScrollbar();
                                updateCounter();
                            });
                        }
                    });
                }
            }

            function createButtons() {
                const buttonContainer = document.createElement("div");
                buttonContainer.id = 'buttonContainer';
                buttonContainer.style.cssText = `
                    position: absolute;
                    bottom: 25px;
                    right: 140px;
                    display: flex;
                    flex-direction: row;
                    gap: 15px;
                    opacity: ${config.hideButtons ? 0 : 1};
                    transition: opacity 0.5s ease-in-out;
                `;

                // 더블클릭 방지
                buttonContainer.addEventListener("dblclick", e => e.preventDefault());

                if (config.hideButtons) {
                  buttonContainer.addEventListener("mouseenter", () => buttonContainer.style.opacity = 1);
                  buttonContainer.addEventListener("mouseleave", () => buttonContainer.style.opacity = 0);
                }

                // 전체 화면 버튼
                const fullscreenButton = document.createElement("button");
                fullscreenButton.id = 'fullscreenButton';
                fullscreenButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                      <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
                    </svg>`;
                fullscreenButton.style.cssText = `
                    background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                    border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    user-select: none;  /* 텍스트 선택 방지 */
                `;
                fullscreenButton.addEventListener("click", () => {
                    if (debug) console.log('fullscreenButton: click');
                    event.stopPropagation();
                    if (isMobile){
                        closeViewer();
                    } else {
                        if (!document.fullscreenElement) {
                            viewer.requestFullscreen().catch((err) => {
                                console.error(`[이미지 뷰어] 전체 화면 전환 실패: ${err.message}`);
                            });
                        } else {
                            document.exitFullscreen().catch((err) => {
                                console.error(`[이미지 뷰어] 전체 화면 해제 실패: ${err.message}`);
                            });
                        }
                    }
                });

                // 전체 화면 변경 감지 이벤트 추가
                document.addEventListener("fullscreenchange", () => {
                    if (document.fullscreenElement) {
                        fullscreenButton.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen-exit" viewBox="0 0 16 16">
                              <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/>
                            </svg>`;

                    } else {
                        fullscreenButton.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
                            </svg>`;
                    }
                });

                // 스크롤 속도 조정 버튼
                const speedButton = document.createElement("button");
                speedButton.id = 'speedButton';
                speedButton.innerHTML = `${scrollSpeed}x`;
                speedButton.style.cssText = `
                    background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                    border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    user-select: none;  /* 텍스트 선택 방지 */
                `;
                speedButton.addEventListener("click", () => {
                    if (debug) console.log('speedButton: click');
                    const speeds = [1, 1.5, 2, 3, 5, 10];
                    const currentIndex = speeds.indexOf(scrollSpeed);
                    scrollSpeed = speeds[(currentIndex + 1) % speeds.length]; // 다음 속도로 변경, 10x 이후 1x로 돌아감
                    speedButton.innerHTML = `${scrollSpeed}x`; // 버튼 텍스트 업데이트
                    config.scrollSpeed = scrollSpeed;
                });

                // 레이아웃 토글 버튼
                const toggleLayoutButton = document.createElement("button");
                toggleLayoutButton.id = 'toggleLayoutButton';
                toggleLayoutButton.innerHTML = viewerType === 'single' ? '1' : '2';; // 버튼 텍스트 동적으로 설정
                toggleLayoutButton.style.cssText = `
                    background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                    border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    user-select: none;  /* 텍스트 선택 방지 */
                `;

                // IntersectionObserver를 활용하여 스크롤된 이미지의 인덱스 추적
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const index = images.indexOf(entry.target);
                            if (index !== -1) {
                                currentIndex = index;
                                console.log("현재 보이는 이미지 인덱스:", currentIndex);
                            }
                        }
                    });
                }, { threshold: 0.5 }); // 이미지가 50% 이상 보일 때 트리거

                images.forEach(image => {
                    if (image instanceof Element) { // image가 DOM 요소인지 확인
                        observer.observe(image);
                    }
                });

                toggleLayoutButton.addEventListener("click", () => {
                    if (debug) console.log('toggleLayoutButton: click');
                    if (viewerType === 'single') {
                        viewerType = 'scroll';
                        config.viewerType = 2;
                    } else {
                        viewerType = 'single';
                        config.viewerType = 1;
                    }

                    toggleLayoutButton.innerHTML = viewerType === 'single' ? '1' : '2'; // 텍스트 업데이트
                    updateViewerImages();
                });

                // 🔹 이전 페이지 버튼
                const prevPageButton = document.createElement("button");
                prevPageButton.id = 'prevPageButton';
                prevPageButton.innerHTML = "←"; // 좌측 화살표 아이콘
                prevPageButton.style.cssText = fullscreenButton.style.cssText;
                prevPageButton.addEventListener("click", () => {
                    if (debug) console.log('prevPageButton: click');
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateViewerImages();
                    }
                });

                function createBookmarkButton() {
                    var articleMenu = document.querySelector('.article-menu.mt-2');
                    var originalScrapButton = articleMenu ? articleMenu.querySelector('.scrap-btn') : null;

                    if (originalScrapButton) {
                        const viewerScrapButton = document.createElement("button");
                        viewerScrapButton.id = 'viewerScrapButton';
                        viewerScrapButton.classList.add('ion-android-bookmark');
                        viewerScrapButton.style.cssText = `
                            background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                            border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                            justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                            user-select: none; font-size: 24px; /* 텍스트 선택 방지 */
                        `;

                        viewerScrapButton.addEventListener("click", () => {
                            originalScrapButton.click();
                        });

                        buttonContainer.appendChild(viewerScrapButton);

                        // 북마크 버튼 색상을 업데이트하는 함수
                        function updateButtonColor() {
                            var buttonText = originalScrapButton.querySelector('.result').textContent.trim();
                            viewerScrapButton.style.backgroundColor = (buttonText === "스크랩 됨") ? '#007bff' : 'rgba(0, 0, 0, 0.5)';
                        }
                        updateButtonColor();

                        var observer = new MutationObserver(updateButtonColor);
                        observer.observe(originalScrapButton.querySelector('.result'), { childList: true, subtree: true });
                    }
                }

                function createDownloadButton() {
                    var articleMenu = document.querySelector('.article-menu.mt-2');
                    var originalDownloadButton = articleMenu ? articleMenu.querySelector('#imageToZipBtn') : null;

                    if (originalDownloadButton) {
                        const viwerDownloadButton = document.createElement("button");
                        viwerDownloadButton.id = 'viwerDownloadButton';
                        viwerDownloadButton.classList.add('ion-android-download');
                        viwerDownloadButton.style.cssText = `
                            background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                            border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                            justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                            user-select: none; font-size: 24px; /* 텍스트 선택 방지 */
                        `;

                        viwerDownloadButton.addEventListener("click", () => {
                            originalDownloadButton.click();

                            var progressChecked = false; // 프로그레스 바가 50% 이상인지 체크하는 변수
                            var intervalId = setInterval(function () {
                                // 다운로드 진행 상태를 추적할 .download-progress 요소 찾기
                                var downloadProgress = originalDownloadButton.querySelector('.download-progress');

                                if (downloadProgress) {
                                    // 프로그레스 바가 존재하면 진행 상태의 width 값 확인
                                    var width = parseFloat(downloadProgress.style.width);

                                    // 50% 이상이면 완료된 것으로 간주
                                    if (width >= 50) {
                                        progressChecked = true;
                                    }

                                    // 프로그레스 바가 진행되면서 다운로드 버튼의 배경색을 조정
                                    viwerDownloadButton.style.background = `
                                    linear-gradient(to top, green ${width}%, transparent ${width}%),
                                    #3d414d
                                `;

                                    // 프로그레스 바가 100%에 도달했을 때
                                    if (width >= 100) {
                                        clearInterval(intervalId); // 애니메이션 종료
                                        viwerDownloadButton.style.background = `
                                        linear-gradient(to top, green 100%, transparent 100%),
                                        #3d414d
                                    `;
                                    }
                                } else {
                                    // 프로그레스 바가 사라졌을 때 (프로그레스 바가 없을 때)
                                    if (progressChecked) {
                                        // 프로그레스 바가 50% 이상이었다면 완료된 것으로 간주
                                        viwerDownloadButton.style.background = `
                                        linear-gradient(to top, green 100%, transparent 100%),
                                        #3d414d
                                    `;
                                    } else {
                                        // 프로그레스 바가 50% 미만이었다면 취소로 간주
                                        viwerDownloadButton.style.background = `
                                        linear-gradient(to top, green 0%, transparent 0%),
                                        #3d414d
                                    `;
                                    }
                                    clearInterval(intervalId); // 애니메이션 종료
                                }
                            }, 10); // 10ms마다 확인
                        });

                        buttonContainer.appendChild(viwerDownloadButton);
                    }
                }

                const viewerCloseButton = document.createElement("button");
                viewerCloseButton.id = 'viewerCloseButton';
                viewerCloseButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-window-x" viewBox="0 0 16 16">
                      <path d="M2.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M4 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                      <path d="M0 4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v4a.5.5 0 0 1-1 0V7H1v5a1 1 0 0 0 1 1h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-2zm1 2h13V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z"/>
                      <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0"/>
                    </svg>`;
                viewerCloseButton.style.cssText = `
                    background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                    border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    user-select: none;  /* 텍스트 선택 방지 */
                `;
                viewerCloseButton.addEventListener("click", () => {
                    window.close();
                });

                const autoOpenButton = document.createElement("button");
                autoOpenButton.id = 'autoOpenButton';

                // "AUTO" 글자 추가
                autoOpenButton.innerHTML = "AUTO";

                autoOpenButton.style.cssText = `
                background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(100, 100, 100, 1);
                border-radius: 50%; padding: 10px; cursor: pointer; display: flex; align-items: center;
                justify-content: center; width: 50px; height: 50px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                user-select: none; font-size: 14px; font-weight: bold; text-transform: uppercase;
                `;

                const updateAutoOpenButton = () => {
                    autoOpenButton.style.background = config.autoOpenViewer
                        ? "rgba(0, 200, 0, 1)" // 활성화 시 초록색 배경
                    : "rgba(0, 0, 0, 0.5)"; // 비활성화 시 기존 배경
                };

                // 초기 상태 설정
                updateAutoOpenButton();

                autoOpenButton.addEventListener("click", () => {
                    config.autoOpenViewer = !config.autoOpenViewer; // 변수 토글
                    GM_setValue("autoOpenViewer", config.autoOpenViewer); // 토글된 값을 저장
                    updateAutoOpenButton(); // UI 업데이트
                });


                // 닫기 버튼
                const closeViewerButton = document.createElement("button");
                closeViewerButton.id = 'closeViewerButton';
                closeViewerButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>`;
                if (isMobile) {
                    closeViewerButton.style.cssText = `
                        background: rgba(0, 0, 0, 0); color: white; border: 0px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%; padding: 0px; cursor: pointer; display: flex; align-items: center;
                        justify-content: center; width: 30px; height: 30px;
                        user-select: none; position: absolute; top: 20px; right: 10px;
                    `;
                } else {
                    closeViewerButton.style.cssText = `
                        background: rgba(0, 0, 0, 0); color: white; border: 1px solid rgba(0, 0, 0, 0);
                        border-radius: 50%; padding: 0px; cursor: pointer; display: flex; align-items: center;
                        justify-content: center; width: 50px; height: 50px;
                        user-select: none; position: absolute; top: 30px; right: 10px;
                    `;
                }

                closeViewerButton.addEventListener("click", () => {
                    closeViewer();
                });

                viewer.appendChild(closeViewerButton);

                if (isMobile) {
                    createBookmarkButton();
                    buttonContainer.appendChild(prevPageButton);
                    buttonContainer.appendChild(toggleLayoutButton);
                    buttonContainer.appendChild(fullscreenButton);
                } else {
                    buttonContainer.appendChild(toggleLayoutButton);
                    buttonContainer.appendChild(speedButton);
                    if (config.viewerCloseButton) {
                        buttonContainer.appendChild(viewerCloseButton);
                    }
                    if (config.viewerAutoOpenButton) {
                        buttonContainer.appendChild(autoOpenButton);
                    }
                    if (config.viewerBookmarkButton) {
                        createBookmarkButton();
                    }
                    if (config.viewerDownloadButton) {
                        createDownloadButton();
                    }
                    buttonContainer.appendChild(fullscreenButton);
                }

                viewer.appendChild(buttonContainer);
            }

            function createScrollbar() {
                if (scrollbarContainer) {
                    scrollbarContainer.remove();
                    scrollbarContainer = null;
                }

                scrollbarContainer = document.createElement("div");
                scrollbarContainer.id = 'scrollbarContainer';

                if (isMobile) {
                    scrollbarContainer.style.cssText = `
                        position: absolute; bottom: 80px; left: 10px; right: 10px;
                        height: 50px; display: flex; justify-content: center; align-items: center; user-select: none;
                    `;
                } else {
                    scrollbarContainer.style.cssText = `
                        position: absolute; right: 10px;
                        width: 50px; height: 80%; display: flex; justify-content: center; align-items: center; user-select: none;
                    `;
                }

                scrollbar = document.createElement("div");
                scrollbar.id = 'scrollbar';

                if (isMobile) {
                    scrollbar.style.cssText = `
                        position: relative; height: 8px; width: 100%; background: rgba(255, 255, 255, 0.3);
                        border-radius: 4px; overflow: hidden; pointer-events: auto; cursor: pointer;
                    `;
                } else {
                    scrollbar.style.cssText = `
                        position: relative; width: 8px; height: 100%; background: rgba(255, 255, 255, 0.3);
                        border-radius: 4px; overflow: hidden; pointer-events: auto; cursor: pointer;
                    `;
                }

                const scrollThumb = document.createElement("div");
                scrollThumb.id = "scrollThumb";

                const thumbSize = (imageContainer.clientHeight / imageContainer.scrollHeight) * 100;

                if (isMobile) {
                    scrollThumb.style.cssText = `
                        height: 100%; width: ${thumbSize}%;
                        background: rgba(255, 255, 255, 0.8); border-radius: 4px; position: absolute; left: 0;
                        cursor: grab;
                    `;
                } else {
                    scrollThumb.style.cssText = `
                        width: 100%; height: ${thumbSize}%;
                        background: rgba(255, 255, 255, 0.8); border-radius: 4px; position: absolute; top: 0;
                        cursor: grab;
                    `;
                }

                scrollbar.appendChild(scrollThumb);
                scrollbarContainer.appendChild(scrollbar);
                viewer.appendChild(scrollbarContainer);

                scrollThumb.addEventListener("pointerdown", (event) => {
                    console.log("scrollThumb: pointerdown");
                    dragThumb = true;
                    scrollThumb.style.cursor = "grabbing";
                    document.body.style.userSelect = "none";
                });

                if (isMobile) {
                    scrollbar.addEventListener("touchstart", (event) => {
                        console.log("scrollbar: touchstart");
                        handleScrollbar(event, scrollbar, scrollThumb);
                    });

                    document.addEventListener("touchmove", (event) => {
                        if (!dragThumb) return;
                        console.log("document: touchmove");
                        // if (scrollbarRect.height === 0 || scrollThumb.offsetHeight === 0) {
                        //     console.log('hi');
                        //     return;
                        // }
                        handleScrollbar(event, scrollbar, scrollThumb);
                    });
                } else {
                    scrollbar.addEventListener("mousedown", (event) => {
                        console.log("scrollbar: mousedown");
                        handleScrollbar(event, scrollbar, scrollThumb);
                    });

                    document.addEventListener("mousemove", (event) => {
                        if (!dragThumb) return;
                        console.log("document: mousemove");
                        // if (scrollbarRect.height === 0 || scrollThumb.offsetHeight === 0) {
                        //     console.log('hi');
                        //     return;
                        // }
                        handleScrollbar(event, scrollbar, scrollThumb);
                    });
                }

                // 📌 **Thumb 드래그 종료 이벤트**
                document.addEventListener("pointerup", () => {
                    if (!dragThumb) return;
                    console.log("document: pointerup");
                    dragThumb = false;
                    scrollThumb.style.cursor = "grab";
                    document.body.style.userSelect = "";
                });
            }

            function handleScrollbar(event, scrollbar, scrollThumb) {
                const scrollbarRect = scrollbar.getBoundingClientRect();
                // 터치 또는 마우스 이벤트에서 좌표를 가져옴
                let clickX = isMobile ? event.touches[0].clientX - scrollbarRect.left : event.clientX - scrollbarRect.left;
                let clickY = isMobile ? event.touches[0].clientY - scrollbarRect.top : event.clientY - scrollbarRect.top;

                let maxPos = isMobile ? scrollbarRect.width - scrollThumb.offsetWidth : scrollbarRect.height - scrollThumb.offsetHeight;
                let newThumbPos = isMobile ? Math.max(0, Math.min(clickX - scrollThumb.offsetWidth / 2, maxPos))
                                           : Math.max(0, Math.min(clickY - scrollThumb.offsetHeight / 2, maxPos));
                let scrollFraction = newThumbPos / maxPos;
                // console.log("scrollThumb.offsetWidth:", scrollThumb.offsetWidth);
                if (viewerType === 'single') {
                    currentIndex = Math.round(scrollFraction * (images.length - 1));
                    updateViewerImages();
                } else {
                    imageContainer.scrollTop = scrollFraction * (imageContainer.scrollHeight - imageContainer.clientHeight);
                    requestAnimationFrame(() => {
                        updateScrollIndex();
                        updateCounter();
                    });
                }
                updateScrollbar();

                dragThumb = true;
                scrollThumb.style.cursor = "grabbing";
                document.body.style.userSelect = "none";

                if (isMobile) {
                    scrollThumb.style.left = `${newThumbPos}px`;
                    // console.log("scrollThumb.style.left:", scrollThumb.style.left, "newThumbPos:", newThumbPos);
                } else {
                    scrollThumb.style.top = `${newThumbPos}px`;
                }
            }

            function updateScrollbar() {
                if (!scrollbar) return;
                const scrollThumb = scrollbar.querySelector("#scrollThumb");

                if (viewerType === 'single') {
                    if (dragThumb) return;

                    const thumbSize = (1 / images.length) * 100;
                    if (isMobile) {
                        scrollThumb.style.width = `${thumbSize}%`;
                        let newLeft = (currentIndex / (images.length - 1)) * (100 - thumbSize);
                        scrollThumb.style.left = `${newLeft}%`;
                    } else {
                        scrollThumb.style.height = `${thumbSize}%`;
                        let newTop = (currentIndex / (images.length - 1)) * (100 - thumbSize);
                        scrollThumb.style.top = `${newTop}%`;
                    }
                } else {
                    // 스크롤 컨테이너 크기와 Thumb 크기 계산 (항상 세로 기준)
                    const containerSize = imageContainer.scrollHeight - imageContainer.clientHeight; // 세로 스크롤 영역
                    const scrollPos = imageContainer.scrollTop; // 현재 세로 스크롤 위치
                    const thumbSize = (imageContainer.clientHeight / imageContainer.scrollHeight) * 100; // Thumb 크기 (%)

                    // Thumb 스타일 업데이트
                    if (isMobile) {
                        // 모바일 환경: 가로로 보이지만 Thumb은 세로 스크롤을 기준으로 계산
                        scrollThumb.style.width = `${thumbSize}%`; // 모바일에서도 크기는 동일
                        if (containerSize > 0) {
                            let newTop = (scrollPos / containerSize) * (100 - thumbSize);
                            scrollThumb.style.left = `${newTop}%`; // 모바일에서는 left로 이동
                        } else {
                            scrollThumb.style.left = `0%`;
                        }
                    } else {
                        // 데스크톱 환경: 세로로 보이고 세로 스크롤을 기준으로 계산
                        scrollThumb.style.height = `${thumbSize}%`; // 데스크톱에서도 크기는 동일
                        if (containerSize > 0) {
                            let newTop = (scrollPos / containerSize) * (100 - thumbSize);
                            scrollThumb.style.top = `${newTop}%`; // 데스크톱에서는 top으로 이동
                        } else {
                            scrollThumb.style.top = `0%`;
                        }
                    }
                }
            }

            function dragScroll() {
                if (isMobile) {
                    // 이미지 컨테이너 드래그 이벤트
                    imageContainer.addEventListener("pointerdown", (event) => {
                        // Thumb 및 Counter 동기화
                        requestAnimationFrame(() => {
                            updateScrollIndex();
                            updateScrollbar();
                            updateCounter(); // Counter 업데이트
                        });
                    });
                } else {
                    let startScrollTop; // 초기 스크롤 위치 저장

                    // 이미지 컨테이너 드래그 이벤트
                    imageContainer.addEventListener("pointerdown", (event) => {
                        if (debug) console.log('imageContainer: pointerdown');
                        if (viewerType !== 'scroll') return; // scroll 모드에서만 동작

                        dragImage = true;
                        startY = event.clientY;
                        startScrollTop = imageContainer.scrollTop;

                        document.body.style.userSelect = "none";
                    });

                    document.addEventListener("pointermove", (event) => {
                        if (!dragImage) return;
                        if (debug) console.log('document: pointermove');

                        // 스크롤 이동 계산 (속도 조정 추가)
                        const deltaY = (startY - event.clientY) * scrollSpeed;
                        imageContainer.scrollTop = startScrollTop + deltaY;

                        // Thumb 및 Counter 동기화
                        requestAnimationFrame(() => {
                            updateScrollIndex();
                            updateScrollbar();
                            updateCounter(); // Counter 업데이트
                        });
                    });

                    document.addEventListener("pointerup", () => {
                        if (!dragImage) return;
                        if (debug) console.log('document: pointerup');

                        dragImage = false;
                        document.body.style.userSelect = "";
                    });
                }

            }

            function wheelScroll(event) {
                event.preventDefault(); // 불필요한 기본 스크롤 방지

                if (viewerType === 'single') {
                    if (event.deltaY > 0 && currentIndex < images.length - 1) {
                        currentIndex++;
                        updateViewerImages();
                    } else if (event.deltaY < 0 && currentIndex > 0) {
                        currentIndex--;
                        updateViewerImages();
                    }

                    // // currentIndex가 업데이트된 후에만 console.log를 한 번 호출하도록 처리
                    // if (event.deltaY !== 0 && (currentIndex > 0 && currentIndex < images.length - 1)) {
                    //     console.log(currentIndex);
                    // }
                } else {
                    const maxScroll = imageContainer.scrollHeight - imageContainer.clientHeight;

                    // 스크롤 제한 조건 추가 (맨 위 또는 맨 아래 도달 시 업데이트 방지)
                    if ((event.deltaY < 0 && imageContainer.scrollTop <= 0) || (event.deltaY > 0 && imageContainer.scrollTop >= maxScroll)) {
                        return;
                    }

                    imageContainer.scrollTop += event.deltaY * scrollSpeed;

                    // Thumb 및 Counter 동기화
                    requestAnimationFrame(() => {
                        updateScrollIndex();
                        updateScrollbar();
                        updateCounter(); // Counter 업데이트
                    });
                    // console.log(currentIndex);
                }
            }

            function createCounter() {
                if (counter) return;

                counter = document.createElement("div");
                counter.id = 'counter';
                counter.style.cssText = `
                    position: absolute; bottom: 35px; right: 55px; color: white;
                    font-size: 14px; background: rgba(0, 0, 0, 0.5); padding: 5px 10px;
                    border-radius: 4px; user-select: none;`;
                viewer.appendChild(counter);
            }

            function updateCounter() {
                if (!counter) return;

                if (viewerType === 'single') {
                    // 현재 이미지 인덱스 + 1 / 전체 이미지 개수
                    counter.textContent = `${currentIndex + 1} / ${images.length}`;
                } else {
                    // 세로 모드에서는 전체 높이에서 현재 스크롤 비율(%) 표시
                    const scrollFraction = imageContainer.scrollTop / (imageContainer.scrollHeight - imageContainer.clientHeight);
                    const scrollPercent = Math.round(scrollFraction * 100);
                    counter.textContent = `${scrollPercent}%`;
                }
            }

            function showViewer() {
                if (!viewer) {
                    createViewer();
                    addResizerFunctionality();
                }
                updateViewerImages();
                viewer.style.display = "flex";
                document.body.style.overflow = "hidden";
            }

            function closeViewer() {
                updateScrollIndex();

                if (viewer) {
                    viewer.style.display = "none";
                }
                document.body.style.overflow = "";

                // 전체화면 상태인지 확인하고 종료
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    document.exitFullscreen();
                }
                // console.log(currentIndex);
            }

            function findImage() {
                if (config.findImage || isMobile) {
                    const targetSrc = images[currentIndex];
                    if (targetSrc) {
                        // 이미지 요소 검사
                        const imgMatch = Array.from(document.querySelectorAll(".fr-view.article-content img"))
                        .find(img => {
                            const src = img.src.startsWith("//") ? "https:" + img.src : img.src;
                            const fullSrc = src + (config.originalImage ? "&type=orig" : "");
                            return fullSrc === targetSrc;
                        });

                        // 비디오 요소 검사
                        const videoMatch = Array.from(document.querySelectorAll(".fr-view.article-content video"))
                        .filter(video => video.getAttribute("data-orig") === "gif")
                        .find(video => {
                            const origUrl = video.getAttribute("data-originalurl");
                            const src = origUrl ? (origUrl.startsWith("//") ? "https:" + origUrl : origUrl) : null;
                            return src === targetSrc;
                        });

                        const targetElement = imgMatch || videoMatch;
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: "instant", block: "center" });
                        }
                    }
                }
            }

            function updateViewerImages() {
                // console.log(currentIndex);
                // console.log(viewerType);
                isPortrait = window.innerHeight > window.innerWidth;

                imageContainer.innerHTML = "";

                viewContainer.style.width = "100%";
                viewContainer.style.height = "100%";
                viewContainer.style.display = "flex";
                viewContainer.style.flexDirection = "row";
                viewContainer.style.justifyContent = "center";
                viewContainer.style.overflow = "hidden";
                viewContainer.style.userSelect = "none";
                viewContainer.style.position = "relative";
                viewContainer.style.objectFit = "contain";
                viewContainer.style.alignItems = "center";

                imageContainer.style.display = "flex";
                imageContainer.style.flexDirection = "column";
                // imageContainer.style.flexDirection = "unset";
                imageContainer.style.overflow = "hidden";
                imageContainer.style.userSelect = "none";
                imageContainer.style.position = "relative";
                imageContainer.style.background = "rgba(255, 255, 255, 0.2)";

                if (viewerType === 'single') {
                    leftResizer.style.display = "none";
                    rightResizer.style.display = "none";

                    const img = document.createElement("img");

                    loadImage(img, currentIndex);
                    img.style.cssText = "width: 100%; height: 100%; pointer-events: none; object-fit: contain;";
                    img.onload = function () {
                        // 이미지의 자연 너비와 높이로 비율 계산
                        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
                        // 브라우저 창의 가로, 세로 길이로 비율 계산
                        const browserAspectRatio = window.innerWidth / window.innerHeight;

                        // 이미지의 비율이 브라우저의 비율보다 큰지 여부를 boolean 변수에 저장
                        const isImageAspectRatioGreater = imageAspectRatio > browserAspectRatio;

                        // console.log("Image Aspect Ratio: " + imageAspectRatio);
                        // console.log("Browser Aspect Ratio: " + browserAspectRatio);
                        // console.log("Is Image Aspect Ratio Greater than Browser's?: " + isImageAspectRatioGreater);

                        // const isImagePortrait = img.naturalHeight > img.naturalWidth;
                        // console.log(img.height);
                        // console.log(img.width);

                        if (isMobile) {
                            imageContainer.style.width = "fit-content";
                            imageContainer.style.height = "fit-content";
                            imageContainer.style.touchAction = "auto";
                            // viewContainer.style.alignItems = "center";
                        } else {
                            // console.log(isPortrait);
                            // console.log(isImagePortrait);
                            if (isImageAspectRatioGreater) {
                                imageContainer.style.width = "100%";
                                imageContainer.style.height = "fit-content";
                            } else {
                                imageContainer.style.width = "fit-content";
                                imageContainer.style.height = "100%";
                                // viewContainer.style.alignItems = "center";
                            }
                        }
                        imageContainer.style.cursor = "pointer";

                        updateScrollbar();
                        updateCounter();

                        findImage();
                    };

                    imageContainer.appendChild(img);
                } else {
                    imageContainer.style.display = "none";
                    imageContainer.style.height = "100%";

                    const promises = images.map((src, index) => {
                        return new Promise((resolve) => {
                            const img = document.createElement("img");
                            img.src = src;
                            img.style.cssText = "width: 100%; height: auto; pointer-events: none;";
                            img.onload = () => {
                                if (index === currentIndex) {
                                    imageContainer.style.display = "flex";
                                    const targetScrollTop = img.offsetTop;
                                    imageContainer.scrollTop = targetScrollTop; // 현재 이미지 위치로 스크롤 이동
                                }
                                resolve(img);
                            };

                            imageContainer.appendChild(img);
                        });
                    });

                    if (isMobile || isPortrait) {
                        if (isMobile){
                            imageContainer.style.overflow = "scroll";
                        }
                        leftResizer.style.display = "none";
                        rightResizer.style.display = "none";
                    } else {
                        leftResizer.style.display = "block";
                        rightResizer.style.display = "block";

                        viewContainer.style.height = "auto";
                        imageContainer.style.width = imageContainerWidth;
                    }

                    Promise.all(promises).then((imgs) => {
                        // if (isMobile || isPortrait) {
                        //     if (isMobile){
                        //         imageContainer.style.overflow = "scroll";
                        //    }
                        //     leftResizer.style.display = "none";
                        //     rightResizer.style.display = "none";
                        // } else {
                        //     leftResizer.style.display = "block";
                        //     rightResizer.style.display = "block";

                        //     viewContainer.style.height = "auto";
                        //     imageContainer.style.width = imageContainerWidth;
                        // }

                        // imageContainer.style.display = "flex";
                        // imageContainer.style.cursor = "grab";

                        // const targetImage = imgs[currentIndex]; // currentIndex에 해당하는 이미지
                        // const targetScrollTop = targetImage.offsetTop; // 이미지의 상단 위치 (스크롤 위치)
                        // imageContainer.scrollTop = targetScrollTop; // 해당 위치로 스크롤 이동

                        updateScrollbar();
                        updateCounter();
                    });
                }
            }

            function updateScrollIndex() {
                if (viewerType === 'single') return; // single 모드는 예외 처리

                const imgs = Array.from(imageContainer.children);
                let maxVisibleHeight = 0;
                let bestIndex = currentIndex;

                imgs.forEach((img, index) => {
                    const rect = img.getBoundingClientRect(); // 화면에서의 위치
                    // console.log(`Image ${index} rect:`, rect); // rect 정보 로그 출력

                    const visibleHeight = Math.min(rect.bottom, imageContainer.clientHeight) - Math.max(rect.top, 0);
                    // console.log(`Image ${index} visible height:`, visibleHeight); // visibleHeight 값 로그 출력

                    if (visibleHeight > maxVisibleHeight) {
                        // console.log(`Image ${index} has the largest visible height so far: ${visibleHeight}`); // 가장 큰 visibleHeight 발견 시 로그 출력
                        maxVisibleHeight = visibleHeight;
                        bestIndex = index;
                    }
                });

                // console.log('Best image index:', bestIndex); // 가장 많이 보이는 이미지 인덱스 로그 출력

                currentIndex = bestIndex;
                // console.log("현재 인덱스 업데이트:", currentIndex);

                findImage();
            }

            function addResizerFunctionality() {
                let isResizing = false;
                let startX;
                let startWidth;
                let isLeftResizer = false;
                let containerParentWidth;

                function startResize(event, resizer) {
                    isResizing = true;
                    startX = event.clientX;
                    startWidth = imageContainer.offsetWidth;
                    containerParentWidth = imageContainer.parentElement.offsetWidth;
                    isLeftResizer = resizer.classList.contains("left");
                    document.addEventListener("pointermove", resize);
                    document.addEventListener("pointerup", stopResize);
                }

                function resize(event) {
                    if (!isResizing) return;
                    let deltaX = event.clientX - startX;
                    let newWidth = startWidth;

                    if (isLeftResizer) {
                        newWidth = startWidth - deltaX; // 왼쪽 리사이저: 오른쪽으로 드래그하면 너비 감소
                    } else {
                        newWidth = startWidth + deltaX; // 오른쪽 리사이저: 왼쪽으로 드래그하면 너비 감소
                    }

                    newWidth = Math.max(100, Math.min(containerParentWidth - 100, newWidth)); // 최소, 최대 크기 제한
                    let newWidthPercent = (newWidth / containerParentWidth) * 100; // 퍼센트 변환
                    imageContainer.style.width = newWidthPercent + "%";
                    imageContainerWidth = imageContainer.style.width;
                    config.viewerWidth = newWidthPercent;
                    // console.log(imageContainer);
                }

                function stopResize() {
                    isResizing = false;
                    updateCounter();
                    updateScrollbar();

                    document.removeEventListener("pointermove", resize);
                    document.removeEventListener("pointerup", stopResize);
                }

                leftResizer.addEventListener("pointerdown", (event) => startResize(event, leftResizer));
                rightResizer.addEventListener("pointerdown", (event) => startResize(event, rightResizer));
            }

            getImages(); // 게시글에서 이미지 목록을 추출

            // images가 존재하고 autoOpenViewer가 true이면 showViewer 실행
            if (images.length > 0 && config.autoOpenViewer) {
                currentIndex = 0; // 첫 번째 이미지를 기본으로 설정
                showViewer();
            }
        }
    }

    handleSettings();

    if (window.location.href.includes('scrap_list')) {
        if (config.scrapList){
            // arcaLiveScrapList();
            setTimeout(arcaLiveScrapList, 0);
        }
    }
    // arcaLive();
    setTimeout(arcaLive, 0);
})();