// ==UserScript==
// @name         中原iLearning 2.0 頁面體驗增強
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在中原iLearning 2.0 課程頁依種類分類課程段落，提供新分頁開啟PDF教材的功能，提供下載影片的功能
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKHzzACd78xkoffM3LIH0MD+N9Qcjf/QALof1ICuH9TguivUrOpL2A4nA+gE0k/YnLI/2ODOT9ywAAAAAAAAAACh88wAne/NuKH3z9iyB9NQ/jfUdI4D0AC6H9Y4rh/X5Lor1vjqS9g2JwPoFNZP2rCyP9vczk/fEZJb1AmOV9QYqfvMAJ3zzdCh98/8sgfTgP431HySA9AAuiPWWK4f1/y6K9ck6kvYNicD6BTWT9rYsj/b/M5T3zzt68yI0dfIxLXrzACd883QoffP/LIH04D+N9R8kgPQAL4j1liuH9f8uivXJOpL1DYnA+gU1k/a2LY/2/zOU9880dfJNMnPySSp38gAnfPN0KH7z/yyC9eBAjvYfJID1AC+I9ZYrh/X/Lov1yTuT9g2JwPoFNZP2ti2P9v8zlPfPO3rzPDt68y8uevIAKHzzdCl98P8ugO7iQovtIRt57wAviPWYK4f1/y6L9cs8k/YOf7v6BTST9rcsj/b/M5T3zzt69BU/fPQQRWyrAFV0oHpTa4//R1l1+EJFTKlET2FXMIj0xCuH9f8ui/XnPpX2QUCY9y8wkPbWLI/2/zOU975mjdgedoy3LpKNiB9hXl2ZT0xM/0VCQ/80MjT/Ky00+S1foP0th/P9LIn1/y6M9eoujvbmLI72/y+Q9vQ7mPdpkJ++G3mEnnxqb33QWlxl9UtLUP9BQEP/NTQ3/ygnKf8qMT7TOYHZczKN960vjPXcL4723jCQ9r84lfZhV6b4CHR8jwB9hpwGZmx8PFVaaZlFS1rfOzxF+y8uMf8rKS3/NDI1nVBCNhBMqv8GRZj2GUaa9xtLnvcLxOH8AH+6+QAAAAAAAAAAAG1mXQB+c2MDV1VWIUVER1g3NjmNLSwwtSkoLM00MzaVVFNUHzc2OQDHxcIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAClpaYA4uLiAFZVWAY6Oj0TODY6JFVUVhUFBAkAw8LCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADhAAAA4QAAACEAAAAhAAAAIQAAACEAAAAgAAAAAAAAAAAAAACAAQAA4B8AAPwfAAD//wAA//8AAA==
// @match        *://ilearning.cycu.edu.tw/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529037/%E4%B8%AD%E5%8E%9FiLearning%2020%20%E9%A0%81%E9%9D%A2%E9%AB%94%E9%A9%97%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529037/%E4%B8%AD%E5%8E%9FiLearning%2020%20%E9%A0%81%E9%9D%A2%E9%AB%94%E9%A9%97%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        "討論區": {
            "title": "討論區",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/forum/1744246650/monologo?filtericon=1"
        },
        "作業": {
            "title": "作業",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/assign/1744246650/monologo?filtericon=1"
        },
        "檔案": {
            "title": "檔案",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/resource/1757814017/monologo"
        },
        "PDF Annotation": {
            "title": "PDF檔",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/pdfannotator/1744246650/monologo?filtericon=1"
        },
        "超級影片": {
            "title": "影片檔",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/supervideo/1744246650/monologo?filtericon=1"
        },
        "網址": {
            "title": "網址",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/url/1757814017/monologo?filtericon=1"
        },
        "回饋單": {
            "title": "問卷",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/feedback/1744246650/monologo?filtericon=1"
        },
        "頁面": {
            "title": "文章",
            "logo": "https://ilearning.cycu.edu.tw/theme/image.php/boost_union/page/1757814017/monologo?filtericon=1"
        }
    };

    const order = ["頁面", "討論區", "作業", "PDF Annotation", "檔案", "超級影片", "網址", "回饋單"];

    function extractFullUrl() {
        const scripts = document.scripts;
        for (let script of scripts) {
            const match = script.textContent.match(/"fullurl":\s*"([^"]+)"/);
            if (match) {
                return match[1].replace(/\\/g, ''); // 去除反斜線
            }
        }
        return null;
    }

    function createDownloadButton(fullUrl) {
        const button = document.createElement('button');
        button.id = 'pdf-download-btn';
        button.title = '下載 PDF';
        button.innerHTML = '➜'; // 下載符號
        button.onclick = function () {
            window.open(fullUrl, '_blank');
        };

        Object.assign(button.style, {
            position: 'fixed',
            bottom: '8rem',
            right: '2rem',
            width: '36px',
            height: '36px',
            backgroundColor: 'orange',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '26px',
            padding: '0 0 2px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'rotate(90deg)'
        });

        document.body.appendChild(button);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days = 30) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    function getMoremenu() {
        const ul = document.querySelector('ul.nav.more-nav.nav-tabs');
        if (ul) {
            const li = document.createElement('li');
            li.className = 'nav-item';

            const a = document.createElement('a');
            a.className = 'nav-link';
            a.setAttribute('role', 'menuitem');
            a.setAttribute('style', 'color:#FF359A !important;');
            a.textContent = '★精簡化';
            a.onclick = showMenu;

            li.appendChild(a);
            ul.appendChild(li);
        }
    }

    function getItems() {
        const result = {};

        // 取得課程 ID（從網址中抓取 ?id= 後的數字）
        const courseIdMatch = window.location.href.match(/course\/view\.php\?id=(\d+)/);
        const courseId = courseIdMatch ? courseIdMatch[1] : null;

        if (!courseId) return result;

        let sections = [];
        let main_section = {};

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.includes(`${courseId}/staticState`)) {
                try {
                    const json = JSON.parse(sessionStorage.getItem(key));
                    if (json) {
                        if (Array.isArray(json.section)) {
                            sections = json.section;
                            for (const sec of json.section) {
                                main_section[sec.id] = sec.parentsectionid || sec.id;
                            }
                        }
                        console.log(main_section);
                        if (Array.isArray(json.cm)) {
                            for (const item of json.cm) {

                                // 跳過子單元
                                if (item.modname === "子單元") continue;

                                // 處理子單元歸位
                                item.sectionid = main_section[item.sectionid];
                                item.sectionnumber = item.sectionnumber = sections.findIndex(section => section.id === item.sectionid);

                                const mod = item.modname;
                                if (!result[mod]) result[mod] = [];
                                result[mod].push(item);
                            }
                        }

                        console.log(result);

                    }
                } catch (e) {
                    console.error('JSON 解析錯誤:', e);
                }
            }
        }

        // 按照指定順序排序
        const sortedResult = {};
        for (const mod of order) {
            if (result[mod]) {
                sortedResult[mod] = result[mod];
            }
        }

        // 添加未在order中定義的類型
        for (const mod in result) {
            if (!sortedResult[mod]) {
                sortedResult[mod] = result[mod];
            }
        }

        // 按照周次排序
        for (const mod in sortedResult) {
            if (mod === "討論區") {
                sortedResult[mod].sort((a, b) => {
                    if (a.sectionnumber === b.sectionnumber) {
                        return b.id - a.id;
                    }
                    if (a.sectionnumber === Math.min(...sortedResult[mod].map(i => i.sectionnumber))) return -1;
                    if (b.sectionnumber === Math.min(...sortedResult[mod].map(i => i.sectionnumber))) return 1;
                    return b.sectionnumber - a.sectionnumber;
                });
            } else {
                sortedResult[mod].sort((a, b) => b.sectionnumber - a.sectionnumber);
            }
        }

        return { items: sortedResult, sections };
    }

    function showMenu() {
        const original = document.querySelector('ul.weeks');
        const side = document.querySelector('#menuside');

        if (original) {
            original.style.display = 'none';

            const data = getItems();
            const items = data.items;
            const sections = data.sections;
            let container = null;
            if (side) {
                container = side;
                container.innerHTML = "";
            }
            else {

                container = document.createElement('ul');
                container.className = 'weeks';
                container.id = 'menuside';
                container.setAttribute('data-for', 'course_sectionlist');

            }

            // 添加排序選擇器
            const sortContainer = document.createElement('div');
            sortContainer.className = 'mb-3';
            sortContainer.innerHTML = `
                <select class="form-select" id="week-sort-order">
                    <option value="desc">降序</option>
                    <option value="asc">升序</option>
                </select>
            `;

            // 設置默認值
            const savedOrder = getCookie('weekSortOrder') || 'desc';
            sortContainer.querySelector('#week-sort-order').value = savedOrder;

            // 監聽變化
            sortContainer.querySelector('#week-sort-order').addEventListener('change', function () {
                setCookie('weekSortOrder', this.value);
                sortContainer.innerHTML = "";
                showMenu(); // 重新渲染
            });


            let sectionNum = 1;

            // 獲取當前周次
            const currentWeekSection = sections.find(s => s.current);

            for (const modname in items) {
                const section = document.createElement('li');
                section.className = 'section course-section main clearfix';
                section.id = `side-section-${sectionNum}`;

                // 按照選擇的排序方式處理周次
                const weekItems = {};
                for (const item of items[modname]) {
                    if (!weekItems[item.sectionnumber]) {
                        weekItems[item.sectionnumber] = [];
                    }
                    weekItems[item.sectionnumber].push(item);
                }
                console.log(items)
                console.log(weekItems)



                // 獲取所有周次並排序
                let weekNumbers = Object.keys(weekItems).map(Number);

                // 第0周始終置頂
                const week0 = weekNumbers.includes(0) ? [0] : [];
                const otherWeeks = weekNumbers.filter(w => w !== 0);

                // 按照選擇的排序方式排序
                const sortOrder = getCookie('weekSortOrder') || 'asc';
                if (sortOrder === 'asc') {
                    otherWeeks.sort((a, b) => a - b);
                } else {
                    otherWeeks.sort((a, b) => b - a);
                }

                // 將當前周次提前
                let sortedWeeks = week0;
                if (currentWeekSection && otherWeeks.includes(currentWeekSection.sectionnumber)) {
                    sortedWeeks.push(currentWeekSection.sectionnumber);
                    sortedWeeks = sortedWeeks.concat(otherWeeks.filter(w => w !== currentWeekSection.sectionnumber));
                } else {
                    sortedWeeks = sortedWeeks.concat(otherWeeks);
                }

                let sectionHTML = `
                <div class="section-item">
                    <div class="course-section-header d-flex">
                        <div class="d-flex align-items-center position-relative">
                            <a role="button" class="btn btn-icon me-3 icons-collapse-expand justify-content-center collapsed" aria-expanded="false" href="#side-coursecontentcollapse${sectionNum}" data-for="sectiontoggler" data-toggle="collapse">
                                <span class="expanded-icon icon-no-margin p-2" title="展延">
                                    <i class="icon fa fa-chevron-down fa-fw" aria-hidden="true"></i>
                                    <span class="sr-only">展延</span>
                                </span>
                                <span class="collapsed-icon icon-no-margin p-2" title="展延">
                                    <span class="dir-rtl-hide"><i class="icon fa fa-chevron-right fa-fw" aria-hidden="true"></i></span>
                                    <span class="dir-ltr-hide"><i class="icon fa fa-chevron-left fa-fw" aria-hidden="true"></i></span>
                                    <span class="sr-only">展延</span>
                                </span>
                            </a>
                            <h3 class="h4 sectionname course-content-item d-flex align-self-stretch align-items-center mb-0" id="side-sectionid-${sectionNum}-title">
                                ${config[modname]?.title || modname}
                            </h3>
                        </div>
                    </div>
                    <div id="side-coursecontentcollapse${sectionNum}" class="content course-content-item-content collapse">
                        <div class="my-3" data-for="sectioninfo">
                            <div class="section_availability"></div>
                        </div>
                        <ul class="section m-0 p-0 img-text d-block" data-for="cmlist">`;

                for (const week of sortedWeeks) {
                    const weekItemsList = weekItems[week];
                    if (!weekItemsList) continue;

                    let weekTitle = `第${week}週`;
                    if (week === 0) {
                        weekTitle = "公告";
                    }

                    // 添加當前周標記
                    let currentBadge = "";
                    let currentCSS = "";
                    if (currentWeekSection.id == weekItemsList[0].sectionid) {
                        currentBadge = '<span class="badge rounded-pill bg-primary text-white order-1 ms-2">本週</span>';
                        currentCSS = "course-content current";
                    }

                    sectionHTML += `
                    <li class="activity activity-wrapper pdfannotator modtype_pdfannotator hasinfo" data-indexed="true">
                        <div class="week-title fw-bold fs-5 mb-2">${weekTitle}${currentBadge}</div><div class="${currentCSS}">`;

                    for (const item of weekItemsList) {
                        // 確定圖標
                        let logoUrl = config[modname]?.logo;
                        if (modname === "PDF Annotation") {
                            logoUrl = config["PDF Annotation"].logo;
                        }

                        sectionHTML += `<div class="activity-item focus-control mb-2">
                                        <div class="activity-grid">
                                            <div class="activity-icon activityiconcontainer smaller communication courseicon align-self-start me-2">
                                                ${logoUrl ? `<img src="${logoUrl}" class="activityicon">` : ''}
                                            </div>
                                            <div class="activity-name-area activity-instance d-flex flex-column me-2">
                                                <div class="activitytitle modtype_pdfannotator position-relative align-self-start">
                                                    <div class="activityname">
                                                        <a href="${item.url}" class="aalink stretched-link">
                                                            <span class="instancename">${item.name}</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                    }

                    sectionHTML += `</div></li>`;
                }

                sectionHTML += `</ul>
                    </div>
                </div>`;

                section.innerHTML = sectionHTML;
                container.appendChild(section);
                sectionNum++;
            }

            original.parentNode.insertBefore(container, original.nextSibling);
            original.parentNode.insertBefore(sortContainer, original.nextSibling);
        }
    }

    function handleVideoPage() {
        // 查找MP4連結
        const mp4Regex = /https:\/\/[^"]+\.mp4/g;
        let mp4Url = null;
        let doc = document.documentElement.innerHTML;
        const match = doc.match(mp4Regex);
        if (match && match.length > 0) {
            mp4Url = match[0];
        }

        if (mp4Url) {
            // 創建下載按鈕
            const button = document.createElement('button');
            button.id = 'video-download-btn';
            button.title = '下載影片';
            button.innerHTML = '➜';
            button.onclick = function () {
                const link = document.createElement('a');
                link.href = mp4Url;
                link.download = '';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (confirm('停留此頁面將降低下載速率，是否離開此頁面？')) {
                    window.location.href = 'https://ilearning.cycu.edu.tw/my/courses.php';
                } else {
                }
            };

            Object.assign(button.style, {
                position: 'fixed',
                bottom: '8rem',
                right: '2rem',
                width: '36px',
                height: '36px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                fontSize: '26px',
                padding: '0 0 2px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                transform: 'rotate(90deg)'
            });

            document.body.appendChild(button);
        }
    }

    function init() {
        const url = window.location.href;

        if (/^https:\/\/ilearning\.cycu\.edu\.tw\/mod\/pdfannotator\//.test(url)) {
            const fullUrl = extractFullUrl();
            if (fullUrl) {
                createDownloadButton(fullUrl);
            }
        } else if (/^https:\/\/ilearning\.cycu\.edu\.tw\/(mod\/supervideo\/|mod\/resource\/)/.test(url)) {
            console.log("找尋影片網址中...");
            handleVideoPage();
        } else if (/^https:\/\/ilearning\.cycu\.edu\.tw\/course\//.test(url)) {
            console.log("找尋影片網址中...");
            getMoremenu();
        }
    }

    window.addEventListener('load', init);
})();