// ==UserScript==
// @name         Copy-Text
// @version      1.0
// @description  Merge and copy
// @author       Ep Tien Sinh
// @match        *://69shuba.cx/*/*
// @match        *://www.qidian.com/chapter/*
// @match        *://fanqienovel.com/reader/*
// @match        *://www.ixdzs8.tw/*
// @match        *://www.qimao.com/*/*
// @match        *://www.keleshuba.net/*
// @match        *://www.17k.com/*
// @match        *://www.piaotia.com/*/*/*/*
// @grant        GM_setClipboard
// @grant        GM_download
// @namespace https://greasyfork.org/users/1402485
// @downloadURL https://update.greasyfork.org/scripts/518884/Copy-Text.user.js
// @updateURL https://update.greasyfork.org/scripts/518884/Copy-Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cấu hình cho từng trang bằng cách sử dụng một đối tượng
    var pageConfigs = [
        {
            urlContains: '69shuba.cx/*',
            headerSelector: 'body > div.container > div.mybox > div.txtnav > h1',
            contentSelector: 'body > div.container > div.mybox > div.txtnav',
            trashSelectors: [
                '#txtright',
                'div.contentadv',
                'div.bottom-ad',
                'div.txtinfo.hide720'
                // Thêm các selector 'rác' khác tại đây
            ]
        },
        {
            urlContains: 'www.qidian.com',
            headerSelector: '#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > h1',
            contentSelector: 'div.enable-review',
            trashSelectors: [
                '#reader-content > div > div > div.relative > div > div.text-s-gray-500.mt-4px.text-bo4.flex.items-center.flex-wrap',
                'span.review'
            ]
        },
        {
            urlContains: 'fanqienovel.com',
            headerSelector: 'div.muye-reader-box-header > h1',
            contentSelector: 'div.muye-reader-content'
        },
        {
            urlContains: 'ixdzs8.tw',
            headerSelector: '#page > article > h3',
            contentSelector: '#page > article > section'
        },
        {
            urlContains: 'www.qimao.com',
            headerSelector: '#__layout > div > div.wrapper.reader.reader-layout-theme > div.main > div > div > div > div.chapter-detail-wrap.reader-box > div.chapter-detail-wrap-info > h2',
            contentSelector: '#__layout > div > div.wrapper.reader.reader-layout-theme > div.main > div > div > div > div.chapter-detail-wrap.reader-box > div.chapter-detail-wrap-content > div.show-part > div'
        },
        {
            urlContains: 'www.keleshuba.net',
            headerSelector: '#nr_title',
            contentSelector: '#nr1',
            trashSelectors1: [
                'div[data-ad-slot="1016693305"]'
            ]
        },
        {
            urlContains: 'www.17k.com',
            headerSelector: '#nr_title',
            contentSelector: '#nr1',
            trashSelectors1: [
                'div[data-ad-slot="1016693305"]'
            ]
        },
        {
            urlContains: 'www.piaotia.com',
            headerSelector: '#content > h1',
            contentSelector: '#content',
            trashSelectors1: [
                '#content > div',
                '#content > table'
            ]
        },

        // Thêm cấu hình cho các trang khác tương tự
    ];

    function mergeAndCopy(config) {
        var headerElement = document.querySelector(config.headerSelector);
        var contentElement = document.querySelector(config.contentSelector);

        var trashSelectors = config.trashSelectors || [];
        trashSelectors.forEach(function(selector) {
            var trashElements = document.querySelectorAll(selector);
            trashElements.forEach(function(element) {
                element.remove();
            });
        });

        if (headerElement && contentElement) {
            var headerContent = headerElement.textContent.trim().replace(/\s{2,}/g, '\n');
            var contentHtml = contentElement.innerHTML;

            var contentText = contentHtml.replace(/&nbsp;/g, ' ')
            .replace('(adsbygoogle = window.adsbygoogle || []).push({});', '')
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<p[^>]*>/gi, '')
            .replace(/<[^>]+>/g, '');

            contentText = contentText.trim().replace(/\s{2,}/g, '\n').replace(/\n{3,}/g, '\n\n');

            var lines = contentText.split('\n');
            var headerPattern = headerContent.replace(/第\d+章/, '第\\d+章');
            var headerRegex = new RegExp(headerPattern);

            if (lines.length > 0 && headerRegex.test(lines[0].trim())) {
                lines[0] = lines[0].replace(headerRegex, '').trim();
            }
            contentText = lines.join('\n').trim();

            if (window.location.href.includes('www.qimao.com')) {
                var headerLines = headerContent.split('\n');
                if (headerLines.length > 1) {
                    headerContent = headerLines.join(' ').trim(); // Gộp hai dòng tiêu đề lại
                }
            }

            var mergedContent = headerContent + '\n\n' + contentText + '\n\n';
            var mergedLines = mergedContent.split('\n');
            if (window.location.href.includes('www.piaotia.com')) {
                if (mergedLines.length > 10) {
                    mergedContent = mergedLines.slice(10).join('\n');
                }
            }
            else if (window.location.href.includes('69shuba.cx')) {
                var wrongChapter = /^\d+\.\s*(第\d+章)/;
                var correctChapter = /^第\d+章/;

                var line = mergedLines[0].trim();

                if (wrongChapter.test(line)) {
                    mergedLines[0] = line.replace(wrongChapter, '$1').trim();
                }
                if (mergedLines.length > 2) {
                    var line3 = mergedLines[2].trim();
                    if (correctChapter.test(line3)) {
                        mergedLines.splice(2, 1);
                    }
                }

                mergedContent = mergedLines.join('\n');
            }

            return mergedContent;
        }
        return '';
    }

    function navigate(direction) {
        var buttonTexts = direction === 'next' ? ['下一章', '下一页'] : ['上一章', '上一页'];
        var button = null;

        buttonTexts.some(text => {
            button = Array.from(document.querySelectorAll('a, button, span')).find(el => el.textContent.trim() === text);
            return button !== undefined; // Dừng vòng lặp nếu tìm thấy
        });

        if (button) {
            if (button.tagName.toLowerCase() === 'a') {
                window.location.href = button.href;
            } else {
                button.click();
            }
        }
    }

    function applyPageConfig() {
        var currentUrl = window.location.href;
        var config = pageConfigs.find(function(config) {
            return currentUrl.includes(config.urlContains);
        });

        if (config) {
            return mergeAndCopy(config);
        }
        return '';
    }

    function getCurrentPageConfig() {
        var currentUrl = window.location.href;
        return pageConfigs.find(function(config) {
            return currentUrl.includes(config.urlContains);
        });
    }

    function checkNavigationButtons() {
        var nextTexts = ['下一章', '下一页'];
        var prevTexts = ['上一章', '上一页'];

        var nextButton = null;
        var backButton = null;

        nextTexts.some(text => {
            nextButton = Array.from(document.querySelectorAll('a, button, span')).find(el => el.textContent.trim() === text);
            return nextButton !== undefined;
        });

        prevTexts.some(text => {
            backButton = Array.from(document.querySelectorAll('a, button, span')).find(el => el.textContent.trim() === text);
            return backButton !== undefined;
        });

        if (nextButton) {
            nextButton.style.display = 'block';
        }

        if (backButton) {
            backButton.style.display = 'block';
        }
    }

    function checkNavigationButtonsOnLoad() {
        checkNavigationButtons();
    }

    var autoClickInterval;
    var isCopying = false;
    var copiedChapters = [];

    function startAutoClick() {
        autoClickInterval = setInterval(function() {

            if (!isCopying) {
                isCopying = true;

                var currentPageConfig = getCurrentPageConfig();
                if (currentPageConfig) {
                    var mergedContent = applyPageConfig();

                    if (!copiedChapters.includes(mergedContent)) {
                        appendToClipboard(mergedContent);
                        copiedChapters.push(mergedContent);
                    }
                }

                setTimeout(function() {
                    var nextButtonExists = checkNextButtonExists();

                    if (!nextButtonExists) {
                        // Dừng auto-click nếu không còn chương tiếp theo
                        stopAutoClick();
                        return;
                    }
                    navigate('next');
                    setTimeout(function() {
                        isCopying = false;
                    }, 1000); // Tăng thêm thời gian chờ sau khi chuyển chương để đảm bảo quá trình copy hoàn thành
                }, 800); // Chuyển chương sau 0.8 giây
            }
        }, 1500); // Điều chỉnh thời gian chờ để tránh copy lặp lại (tăng lên 1.5 giây)

        autoClickButton.textContent = 'Stop Auto';
        localStorage.setItem('autoClickRunning', 'true');
    }

    function checkNextButtonExists() {
        var buttonTexts = ['下一章', '下一页']; // Các văn bản cho nút "Next"
        var nextButton = null;

        buttonTexts.some(text => {
            nextButton = Array.from(document.querySelectorAll('a, button, span')).find(el => el.textContent.trim() === text);
            return nextButton !== undefined;
        });
        return nextButton !== undefined;
    }

    function clearClipboardAndStartAutoClick() {
        navigator.clipboard.writeText('').then(function() {
            startAutoClick();
        }, function(err) {
        });
    }

    function appendToClipboard(newContent) {
        navigator.clipboard.readText().then(function(currentContent) {
            const combinedContent = currentContent + newContent;
            navigator.clipboard.writeText(combinedContent).then(function() {
            }, function(err) {
            });
        }, function(err) {
        });
    }

    function stopAutoClick() {
        clearInterval(autoClickInterval);
        autoClickInterval = null;
        autoClickButton.textContent = 'Auto Click';

        localStorage.removeItem('autoClickRunning');

        var headerText = 'clipboard';
        navigator.clipboard.readText().then(clipboardContent => {

            if (clipboardContent) {
                var blob = new Blob([clipboardContent], { type: 'text/plain' });
                let downloadLink = window.URL.createObjectURL(blob);
                let downloadArgs = {
                    url: downloadLink,
                    name: `${headerText}.txt`
                };
                GM_download(downloadArgs);
            }
        }).catch(err => {
        });
    }

    var copyNextButton = createButton('Copy & Next', '50px', '490px', function() {
        var mergedContent = applyPageConfig(); // Lấy nội dung hợp nhất
        GM_setClipboard(mergedContent);
        setTimeout(function() {
            navigate('next');
        }, 1000);
    });
    document.body.appendChild(copyNextButton);

    var autoClickButton = createButton('Auto Click', '50px', '370px', function() {
        if (!autoClickInterval) {
            clearClipboardAndStartAutoClick();
        } else {
            stopAutoClick();
        }
    });
    document.body.appendChild(autoClickButton);

    var nextButton = createButton('Next Chương', '10px', '490px', function() {
        navigate('next');
        checkNavigationButtons();
    });
    document.body.appendChild(nextButton);

    var backButton = createButton('Back Chương', '10px', '370px', function() {
        navigate('back');
        checkNavigationButtons();
    });
    document.body.appendChild(backButton);

    function createButton(text, bottom, left, clickHandler) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.bottom = bottom;
        button.style.left = left;
        button.style.zIndex = '9999';
        button.style.width = '110px';
        button.style.height = '35px';
        button.style.backgroundColor = text.includes('Next') ? 'green' : 'blue';
        button.style.color = 'white';

        button.addEventListener('mousedown', function() {
            button.style.backgroundColor = 'yellow';
            button.style.color = 'black';
        });

        button.addEventListener('mouseup', function() {
            button.style.backgroundColor = text.includes('Next') ? 'green' : 'blue';
            button.style.color = 'white';
        });

        button.addEventListener('click', clickHandler);

        return button;
    }

    if (localStorage.getItem('autoClickRunning') === 'true') {
        startAutoClick();
    }

    function main() {
        checkNavigationButtonsOnLoad();
        applyPageConfig();
    }
    document.addEventListener('DOMContentLoaded', main);
})();
