// ==UserScript==
// @name         班固米韩漫维基助手测试版
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  韩漫维基人的好朋友
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/520405/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%9F%A9%E6%BC%AB%E7%BB%B4%E5%9F%BA%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520405/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%9F%A9%E6%BC%AB%E7%BB%B4%E5%9F%BA%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // 提交关联数据
        window.addEventListener('load', async () => {
        const pendingFormData = localStorage.getItem('pendingFormData');
        if (!pendingFormData) return;

        const currentUrl = window.location.href;
        const match = currentUrl.match(/\/subject\/(\d+)/);

        if (match) {
            const subjectId = match[1];
            const relatedUrl = `${window.location.origin}/subject/${subjectId}/add_related/person`;

            try {
                const response = await fetch(relatedUrl, {
                    method: 'POST',
                    body: pendingFormData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                if (response.ok) {
                    console.log('关联数据已成功提交');
                    localStorage.removeItem('pendingFormData');
                    location.reload();
                } else {
                    console.error('关联数据提交失败:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('提交关联数据时出错:', error);
            }
        }
    });

    // 定位
    const targetContainer1 = document.querySelector('table.settings small');
    const targetContainer2 = document.querySelector('tbody tr td[valign="top"][width="70"]');

    const originalMenuInner = document.querySelector('.menu_inner');
    if (originalMenuInner) {
        const newMenuInner = document.createElement('div');
        newMenuInner.className = 'menu_inner';
        newMenuInner.setAttribute('align', 'left');

        const syncContainer = document.createElement('div');
        syncContainer.style.marginTop = '20px';
        syncContainer.style.borderTop = '1px solid #ccc';
        syncContainer.style.paddingTop = '10px';

        const syncTitle = document.createElement('div');
        syncTitle.textContent = '同步关联人物？';
        syncTitle.style.fontWeight = 'bold';
        syncContainer.appendChild(syncTitle);

        const syncContent = document.createElement('div');
        syncContent.style.marginTop = '5px';
        syncContainer.appendChild(syncContent);

        newMenuInner.appendChild(syncContainer);
        const currentUrl = window.location.href;
        if (window.location.href.includes('/edit_detail') || window.location.href.includes('new_subject/1')) {
            originalMenuInner.parentNode.appendChild(newMenuInner, originalMenuInner.nextSibling);
            }

        const originalSubmitButton = document.querySelector('.inputBtn[name="submit"]');
        if (originalSubmitButton) {
            const originalOnClick = originalSubmitButton.onclick;
            originalSubmitButton.onclick = async function(event) {
                if (typeof originalOnClick === 'function') {
                    originalOnClick.call(this, event);
                }
                const submitSuccess = await handleSaveButtonClick();
                if (submitSuccess) {
                    console.log('关联数据已保存');
                }
            };
        }

        document.addEventListener('click', async function(event) {
            const target = event.target;

            if (target.matches('.inputBtn[name="submit"]') && Array.from(document.querySelectorAll('.inputBtn[name="submit"]')).indexOf(target) === 1) {
                event.preventDefault();
                const originalOnClick2 = target.onclick;
                if (typeof originalOnClick2 === 'function') {
                    originalOnClick2.call(target, event);
                }

                const submitSuccess = await handleSaveButtonClick();
                if (submitSuccess) {
                    console.log('关联数据已保存');
                }
            }
        });

        // 插入 "Naver系"、"Kakao系"、"Kidari系"、"修饰关联"
        if (!targetContainer1) {
            console.error('插入位置错误');
        } else {
            targetContainer1.innerHTML += `
            <a href="javascript:void(0)" class="l" onclick="handleNaverEntry()">[Naver系]</a>
            <a href="javascript:void(0)" class="l" onclick="handleKakaoEntry()">[Kakao系]</a>
            <a href="javascript:void(0)" class="l" onclick="handleKidariEntry()">[Kidari系]</a>
            <a href="javascript:void(0)" class="l" onclick="fixedEntry()">[修饰关联]</a>
        `;
        }

        if (!targetContainer2) {
            console.error('插入位置错误');
        } else {
            targetContainer2.innerHTML += `
            <a href="javascript:void(0)" class="l" onclick="MUEntry()">🔎</a>
        `;
        }

        // 通用函数
        window.handleEntry = function(type) {
            if (nowmode === "normal") {
                NormaltoWCODE();
                createEntry(type);
                WCODEtoNormal();
            } else if (nowmode === "wcode") {
                createEntry(type);
                WCODEtoNormal();
            }
        };

        // 通用替换函数及平台模组配置
        window.createEntry = function(type) {
            const infoboxTextarea = document.querySelector('#infobox_wcode textarea[name="subject_infobox"]');
            if (infoboxTextarea) {
                let content = infoboxTextarea.value;

                content = AliasField(content);
                content = addEndField(content);

                switch (type) {
                    case "naver":
                        content = UpdateContent(content, {
                            links: [
                                "[Naver Webtoon|]",
                                "[咚漫|]",
                                "[Line Webtoon(繁)|]",
                                "[LINEマンガ|]",
                                "[Line Webtoon(英)|]"
                            ],
                            magazine: "Naver Webtoon",
                            isNewSubject: true
                        });
                        break;
                    case "kakao":
                        content = UpdateContent(content, {
                            links: [
                                "[Kakaopage|]",
                                "[Kakao Webtoon(韩)|]",
                                "[PODO漫画|]",
                                "[Kakao Webtoon(繁)(关)|]",
                                "[ピッコマ|]",
                                "[Tapas(英)|]"
                            ],
                            magazine: "Kakao Webtoon/Kakaopage",
                            publisher: "카카오웹툰스튜디오",
                            isNewSubject: true
                        });
                        break;
                    case "kidari":
                        content = UpdateContent(content, {
                            links: [
                                "[Bomtoon(韩)|]",
                                "[Lezhin Comics(韩)|]",
                                "[XX漫画|]",
                                "[Bomtoon(繁)|]",
                                "[Beltoon(日)|]",
                                "[Lezhin Comics(日)|]",
                                "[Lezhin Comics(英)|]"
                            ],
                            magazine: "Bomtoon/Lezhin Comics",
                            publisher: "키다리스튜디오",
                            isNewSubject: true
                        });
                        break;
                }

                infoboxTextarea.value = content;
            }
        };

        window.handleNaverEntry = () => handleEntry("naver");
        window.handleKakaoEntry = () => handleEntry("kakao");
        window.handleKidariEntry = () => handleEntry("kidari");

        window.createEntry = function(type) {
            const infoboxTextarea = document.querySelector('#infobox_wcode textarea[name="subject_infobox"]');
            if (infoboxTextarea) {
                let content = infoboxTextarea.value;

                content = AliasField(content);
                content = addEndField(content);

                switch (type) {
                    case 'naver':
                        content = UpdateContent(content, {
                            links: [
                                '[Naver Webtoon|]',
                                '[咚漫|]',
                                '[Line Webtoon(繁)|]',
                                '[LINEマンガ|]',
                                '[Line Webtoon(英)|]'
                            ],
                            magazine: 'Naver Webtoon',
                            isNewSubject: true
                        });
                        break;
                    case 'kakao':
                        content = UpdateContent(content, {
                            links: [
                                '[Kakaopage|]',
                                '[Kakao Webtoon(韩)|]',
                                '[PODO漫画|]',
                                '[Kakao Webtoon(繁)(关)|]',
                                '[ピッコマ|]',
                                '[Tapas(英)|]'
                            ],
                            magazine: 'Kakao Webtoon/Kakaopage',
                            publisher: '카카오웹툰스튜디오',
                            isNewSubject: true
                        });
                        break;
                    case 'kidari':
                        content = UpdateContent(content, {
                            links: [
                                '[Bomtoon(韩)|]',
                                '[Lezhin Comics(韩)|]',
                                '[XX漫画|]',
                                '[Bomtoon(繁)|]',
                                '[Beltoon(日)|]',
                                '[Lezhin Comics(日)|]',
                                '[Lezhin Comics(英)|]'
                            ],
                            magazine: 'Bomtoon/Lezhin Comics',
                            publisher: '키다리스튜디오',
                            isNewSubject: true
                        });
                        break;
                }

                infoboxTextarea.value = content;
            }
        };

        //别名函数
        function AliasField(content) {
            const aliasStart = content.indexOf("别名={");
            const aliasEnd = content.indexOf("}", aliasStart);
            if (aliasStart !== -1 && aliasEnd !== -1) {
                let aliasContent = content.substring(aliasStart + 5, aliasEnd).trim();
                const expectedAliasPairs = [
                    "[台版|]",
                    "[日版|]",
                    "[美版|]"
                ];

                let existingAliasPairs = aliasContent
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                expectedAliasPairs.forEach(pair => {
                    if (!existingAliasPairs.some(existing => existing.startsWith(pair.split("|")[0]))) {
                        existingAliasPairs.push(pair);
                    }
                });

                const currentUnofficialCount = existingAliasPairs.filter(pair => pair.startsWith("[非官方|]")).length;
                if (currentUnofficialCount === 0) {
                    existingAliasPairs.push("[非官方|]\n[非官方|]\n[非官方|]");
                } else if (currentUnofficialCount === 1) {
                    existingAliasPairs.push("[非官方|]\n[非官方|]");
                } else if (currentUnofficialCount === 2) {
                    existingAliasPairs.push("[非官方|]");
                }

                aliasContent = existingAliasPairs.join("\n") + "\n";
                content = content.substring(0, aliasStart + 5) + aliasContent + content.substring(aliasEnd);
            }
            return content;
        }

        //开始+结束函数
        function addEndField(content) {
            if (content.indexOf("|结束=") === -1 && content.indexOf("|连载结束=") === -1) {
                const start = content.indexOf("|开始=");
                const startAlternate = content.indexOf("|连载开始=");
                if (start !== -1 || startAlternate !== -1) {
                    const newLinkContent = `|结束= \n|备注= \n`;
                    const nextLineStart = content.indexOf("\n", start !== -1 ? start : startAlternate);
                    content = content.slice(0, nextLineStart) + "\n" + newLinkContent + content.slice(nextLineStart);
                } else {
                    const otherIndex = content.indexOf("|其他=");
                    if (otherIndex !== -1) {
                        const newLinkContent = `|开始= \n|结束= \n|备注= \n`;
                        const nextLineStart = content.indexOf("\n", otherIndex) + 1;
                        content = content.slice(0, nextLineStart) + newLinkContent + content.slice(nextLineStart);
                    }
                }
            }
            return content;
        }

        // 更新平台模组函数
        function UpdateContent(content, options) {
            const {
                links = [],
                    magazine = "",
                    publisher = "",
                    isNewSubject = false
            } = options;

            if (links.length > 0) {
                const linkStart = content.indexOf("|链接={");
                if (linkStart === -1) {
                    const linkEnd = content.indexOf("}}");
                    if (linkEnd !== -1) {
                        const newLinkContent = `|链接={\n${links.join("\n")}\n}\n`;
                        content = content.slice(0, linkEnd) + newLinkContent + content.slice(linkEnd);
                    }
                }
            }

            if (isNewSubject && window.location.pathname.includes("/new_subject/1")) {
                const updateField = (field, value) => {
                    const fieldStart = content.indexOf(`|${field}=`);
                    if (fieldStart !== -1) {
                        const fieldEnd = content.indexOf("\n", fieldStart);
                        content = content.substring(0, fieldStart) + `|${field}= ${value}` + content.substring(fieldEnd);
                    }
                };

                if (magazine) updateField("连载杂志", magazine);
                if (publisher) updateField("出版社", publisher);
            }

            return content;
        }

        // "修饰关联"处理函数
        window.fixedEntry = function() {
            function modifyText() {
                // "非官方1-9"数字清除
                for (let i = 1; i <= 9; i++) {
                    document.querySelectorAll(`input[value="非官方${i}"]`).forEach(input => {
                        input.value = "非官方";
                    });
                }

                document.querySelectorAll('input').forEach(input => {
                    // 清除不可见字符
                    input.value = input.value.replace(/[\u200B-\u200D\uFEFF]/g, '');
                });

                handle2Entry();
            }

            modifyText();
        };

        function handle2Entry() {
            if (nowmode === "normal") {
                NormaltoWCODE();
                processInfobox();
                handleLinkMatching();
                WCODEtoNormal();
            } else if (nowmode === "wcode") {
                processInfobox();
                handleLinkMatching();

            }
        };

        function processInfobox() {
            const infoboxTextarea = document.querySelector('#infobox_wcode textarea[name="subject_infobox"]');
            if (infoboxTextarea) {
                let infoboxContent = infoboxTextarea.value;

                const publisherMatch = infoboxContent.match(/\|出版社=([^\n]+)/);
                if (publisherMatch) {
                    let values = publisherMatch[1].trim().split(/、|,/);
                    let updatedValues = [];
                    values.forEach(value => {
                        value = value.trim();
                        let PublisherName = '';
                        let PublisherID = '';

                        if (/(블뤼엔)/i.test(value)) {
                            PublisherName = '블뤼엔(투유드림)';
                            PublisherID = '46725';
                        } else if (/(투유드림|^Toyou's\s*Dream$|^ToyouDream$)/i.test(value)) {
                            PublisherName = '투유드림';
                            PublisherID = '46725';
                        } else if (/(디씨씨|^DCCENT|^DCC\s*webtoon)/i.test(value)) {
                            PublisherName = '디씨씨이엔티';
                            PublisherID = '52011';
                        } else if (/(키다리|^Kidari)/i.test(value)) {
                            PublisherName = '키다리스튜디오';
                            PublisherID = '44919';
                        } else if (/(다산북스|다산코믹스|^Dasan)/i.test(value)) {
                            PublisherName = '다산북스';
                            PublisherID = '46574';
                        } else if (/(^재담|^Jaedam|재담미디어)/i.test(value)) {
                            PublisherName = '재담미디어';
                            PublisherID = '46572';
                        } else if (/(오렌지디|^Orange\s*D$)/i.test(value)) {
                            PublisherName = '오렌지디';
                            PublisherID = '46508';
                        } else if (/(씨엔씨|^CNC\s*Revolution$|^C&C|^C＆C)/i.test(value)) {
                            PublisherName = '씨엔씨레볼루션';
                            PublisherID = '46345';
                        } else if (/(누룩코믹스|^투니드|^Tooneed)/i.test(value)) {
                            PublisherName = '투니드엔터테인먼트';
                            PublisherID = '46575';
                        } else if (/(JHS$|제이에이치에스|^JHS)/i.test(value)) {
                            PublisherName = '스튜디오JHS';
                            PublisherID = '46582';
                        } else if (/(^Rok\s*Media$|로크미디어)/i.test(value)) {
                            PublisherName = '로크미디어';
                            PublisherID = '48174';
                        } else if (/(^Ant\s*Studio$|엔트\s*스튜디오)/i.test(value)) {
                            PublisherName = 'AntStudio';
                            PublisherID = '48119';
                        } else if (/(^M\s*Story\s*Hub$|엠스토리허브)/i.test(value)) {
                            PublisherName = '엠스토리허브';
                            PublisherID = '46699';
                        } else if (/(^JC\s*미디어$|^JC\s*Media$|^작가\s*컴퍼니$|^Jakga\s*Company$)/i.test(value)) {
                            PublisherName = 'JC미디어';
                            PublisherID = '46698';
                        } else if (/(^앤드비)/i.test(value)) {
                            PublisherName = '앤드비(학산문화사)';
                            PublisherID = '46048';
                        } else if (/(학산\s*문화사|^Haksan|鹤山文化|鶴山文化)/i.test(value)) {
                            PublisherName = '학산문화사';
                            PublisherID = '46048';
                        } else if (/(^비숲)/i.test(value)) {
                            PublisherName = '비숲(서울미디어코믹스)';
                            PublisherID = '46047';
                        } else if (/(서울\s*미디어|^Seoul\s*Media|서울문화사)/i.test(value)) {
                            PublisherName = '서울미디어코믹스';
                            PublisherID = '46047';
                        } else if (/(^Label\s*ICE)/i.test(value)) {
                            PublisherName = 'Label ICE(REDICE STUDIO)';
                            PublisherID = '43505';
                        } else if (/(^Label\s*RED)/i.test(value)) {
                            PublisherName = 'Label RED(REDICE STUDIO)';
                            PublisherID = '43505';
                        } else if (/(^RED\s*ICE|레드아이스|RED\s*ICE$)/i.test(value)) {
                            PublisherName = 'REDICE STUDIO';
                            PublisherID = '43505';
                        } else if (/(대원씨아이|^大元C|^Daewon)/i.test(value)) {
                            PublisherName = '대원씨아이';
                            PublisherID = '42382';
                        } else if (/(^영컴|^YOUNG\s*COM)/i.test(value)) {
                            PublisherName = '영컴';
                            PublisherID = '70196';
                        } else if (/(문학동네)/i.test(value)) {
                            PublisherName = '문학동네';
                            PublisherID = '70060';
                        } else if (/(패러그래프|^Paragraph$)/i.test(value)) {
                            PublisherName = '패러그래프';
                            PublisherID = '52508';
                        } else if (/(울트라\s*미디어|^Ultra\s*Media$)/i.test(value)) {
                            PublisherName = '울트라미디어';
                            PublisherID = '56288';
                        } else if (/(와이낫미|^WHY\s*NOT\s*ME$|^WNM\s*WEBTOON)/i.test(value)) {
                            PublisherName = '와이낫미';
                            PublisherID = '51960';
                        } else if (/(크릭앤리버|^Creek\s*&\s*River|^Creek\s*and\s*River)/i.test(value)) {
                            PublisherName = '크릭앤리버';
                            PublisherID = '52191';
                        } else if (/(^이코믹스|^ECOMIX)/i.test(value)) {
                            PublisherName = '이코믹스';
                            PublisherID = '51866';
                        } else if (/(^LICO|LICO$|^리코)/i.test(value)) {
                            PublisherName = 'LICO';
                            PublisherID = '41421';
                        } else if (/(^ELIMONA|^엘리모나)/i.test(value)) {
                            PublisherName = 'ELIMONA(YLAB)';
                            PublisherID = '40086';
                        } else if (/(^와이랩|^YLAB|YLAB$)/i.test(value)) {
                            PublisherName = 'YLAB';
                            PublisherID = '40086';
                        } else if (/(^디앤씨웹툰|^D&C\s*WEBTOON|^D＆C\s*WEBTOON)/i.test(value)) {
                            PublisherName = '디앤씨웹툰비즈';
                            PublisherID = '43725';
                        } else if (/(^디앤씨|^D&C|^D＆C)/i.test(value)) {
                            PublisherName = '디앤씨미디어';
                            PublisherID = '58751';
                        } else if (/(^슈퍼코믹스|^Super\s*comix)/i.test(value)) {
                            PublisherName = '슈퍼코믹스스튜디오';
                            PublisherID = '44841';
                        } else if (/(KW\s*BOOKS|KW\s*북스|케이더블유북스|캐롯툰)/i.test(value)) {
                            PublisherName = 'KWBOOKS';
                            PublisherID = '45502';
                        } else if (/(^MAJOR$)/i.test(value)) {
                            PublisherName = 'MAJOR(박태준 만화회사)';
                            PublisherID = '45226';
                        } else if (/(^박태준|더그림엔터|^박만사|^PTJ\s*COMICS)/i.test(value)) {
                            PublisherName = '박태준 만화회사';
                            PublisherID = '45226';
                        } else if (/(고렘팩토리|Golem\s*Factory)/i.test(value)) {
                            PublisherName = '고렘팩토리';
                            PublisherID = '48175';
                        } else if (/(^YJ\s*코믹스|^YJ\s*Comics)/i.test(value)) {
                            PublisherName = 'YJ코믹스';
                            PublisherID = '48176';
                        } else if (/(^스튜디오\s*389|^Studio\s*389)/i.test(value)) {
                            PublisherName = '스튜디오389';
                            PublisherID = '56874';
                        } else if (/(^유주얼\s*미디어|^U-Jewel|^UJewel)/i.test(value)) {
                            PublisherName = '유주얼미디어';
                            PublisherID = '52884';
                        } else if (/(^인타임|^Intime|^In-Time)/i.test(value)) {
                            PublisherName = '인타임';
                            PublisherID = '52441';
                        } else if (/(^판시아|^FANSIA)/i.test(value)) {
                            PublisherName = '판시아';
                            PublisherID = '52437';
                        } else if (/(^블루픽|^Blue\s*Pic)/i.test(value)) {
                            PublisherName = '블루픽';
                            PublisherID = '57001';
                        } else if (/(^크랙\s*웹툰|^크랙엔\s*터테인먼트)/i.test(value)) {
                            PublisherName = '크랙웹툰';
                            PublisherID = '57101';
                        } else if (/(^지티이엔티|^GTENT)/i.test(value)) {
                            PublisherName = '지티이엔티';
                            PublisherID = '57449';
                        } else if (/(^필연\s*매니지먼트|^Feelyeon)/i.test(value)) {
                            PublisherName = '필연매니지먼트';
                            PublisherID = '57448';
                        } else if (/(^드림툰|^Dreamtoon)/i.test(value)) {
                            PublisherName = '드림툰';
                            PublisherID = '57157';
                        } else if (/(^케나즈|케나즈$|^KENAZ|KENAZ$)/i.test(value)) {
                            PublisherName = '케나즈';
                            PublisherID = '52427';
                        } else if (/(^비브로스팀|^VBros\s*Team)/i.test(value)) {
                            PublisherName = '비브로스팀';
                            PublisherID = '52188';
                        } else if (/(^스토리숲|^Story\s*Soop|^Story\s*Forest)/i.test(value)) {
                            PublisherName = '스토리숲';
                            PublisherID = '48963';
                        } else if (/(^테라핀|^코핀|^Copin|^Terapin)/i.test(value)) {
                            PublisherName = '테라핀';
                            PublisherID = '48539';
                        } else if (/(^다온|^DAON)/i.test(value)) {
                            PublisherName = '다온';
                            PublisherID = '48524';
                        } else if (/(^ab\s*Entertainmen|^ab\s*엔터테인먼트는)/i.test(value)) {
                            PublisherName = 'ab Entertainmen';
                            PublisherID = '51897';
                        } else if (/(^위즈덤\s*하우스|^Wisdom\s*House|^예담출판사)/i.test(value)) {
                            PublisherName = '위즈덤하우스';
                            PublisherID = '51961';
                        } else if (/(^마루\s*코믹스|^Maru\s*Comics)/i.test(value)) {
                            PublisherName = '마루코믹스';
                            PublisherID = '52184';
                        } else if (/(^툰플러스|^Toon\s*Plus)/i.test(value)) {
                            PublisherName = '툰플러스';
                            PublisherID = '52104';
                        } else if (/(^콘텐츠랩블루|CONTENTS\s*LAB)/i.test(value)) {
                            PublisherName = '콘텐츠랩블루';
                            PublisherID = '51972';
                        } else if (/(^JQ\s*코믹스|^JQ\s*Comics|제이큐코믹스)/i.test(value)) {
                            PublisherName = 'JQ코믹스';
                            PublisherID = '57841';
                        } else {
                            PublisherName = value;
                        }

                        updatedValues.push(PublisherName);

                        if (PublisherID && !syncContent.querySelector(`#syncPublisher-${PublisherID}`)) {
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.value = PublisherID;
                            checkbox.id = `syncPublisher-${PublisherID}`;
                            checkbox.checked = true;
                            checkbox.dataset.type = 'publisher';
                            const label = document.createElement('label');
                            label.textContent = PublisherName;
                            label.setAttribute('for', `syncPublisher-${PublisherID}`);
                            syncContent.appendChild(checkbox);
                            syncContent.appendChild(label);
                            syncContent.appendChild(document.createElement('br'));
                        }
                    });
                    infoboxContent = infoboxContent.replace(/\|出版社=[^\n]+/, `|出版社= ${updatedValues.join('、')}`);
                    infoboxTextarea.value = infoboxContent;
                }

                const magazineMatch = infoboxContent.match(/\|连载杂志=([^\n]+)/);
                if (magazineMatch) {
                    let values = magazineMatch[1].trim().split(/、|,/);
                    let updatedValues = [];
                    values.forEach(value => {
                        value = value.trim();
                        let MagazineName = '';
                        let MagazineID = '';

                        if (/(^Naver\s*Webtoon)/i.test(value)) {
                            MagazineName = 'Naver Webtoon';
                            MagazineID = '30543';
                        } else if (/^Lezhin(?: Comics?|comics?)?$/i.test(value)) {
                            MagazineName = 'Lezhin Comics';
                            MagazineID = '30545';
                        } else if (/(^Bomtoon)/i.test(value)) {
                            MagazineName = 'Bomtoon';
                            MagazineID = '33413';
                        } else if (/^Kakao\s*Webtoon/i.test(value)) {
                            MagazineName = 'Kakao Webtoon';
                            MagazineID = '12900';
                        } else if (/(^Kakaopage)/i.test(value)) {
                            MagazineName = 'Kakaopage';
                            MagazineID = '33420';
                        } else if (/^Ridi(?: books?|books?)?$/i.test(value)) {
                            MagazineName = 'Ridibooks';
                            MagazineID = '36928';
                        } else if (/(^Comico)/i.test(value)) {
                            MagazineName = 'Comico';
                            MagazineID = '17523';
                        } else if (/^Pocket\s*Comics/i.test(value)) {
                            MagazineName = 'Pocket Comics EN';
                            MagazineID = '48556';
                        } else if (/\bMr\.?\s?Blue\b(?!\.\w+)/gi.test(value)) {
                            MagazineName = 'Mrblue';
                            MagazineID = '36788';
                        } else if (/(^Ktoon$)/i.test(value)) {
                            MagazineName = 'Ktoon';
                            MagazineID = '30542';
                        } else if (/^Book\s*cube/i.test(value)) {
                            MagazineName = 'Bookcube';
                            MagazineID = '37050';
                        } else if (/(^Toptoon)/i.test(value)) {
                            MagazineName = 'Toptoon';
                            MagazineID = '33418';
                        } else if (/(^Toomics)/i.test(value)) {
                            MagazineName = 'Toomics';
                            MagazineID = '33416';
                        } else if (/^Buff\s*toon/i.test(value)) {
                            MagazineName = 'Bufftoon';
                            MagazineID = '46726';
                        } else if (/^Fox\s*toon/i.test(value)) {
                            MagazineName = 'Foxtoon';
                            MagazineID = '57503';
                        } else if (/^Peanu\s*toon/i.test(value)) {
                            MagazineName = 'Peanutoon';
                            MagazineID = '36157';
                        } else if (/(^Comica)/i.test(value)) {
                            MagazineName = 'Comica';
                            MagazineID = '31494';
                        } else if (/(^Onestory)/i.test(value)) {
                            MagazineName = 'Onestory';
                            MagazineID = '53315';
                        } else if (/(^Manta)/i.test(value)) {
                            MagazineName = 'Manta';
                            MagazineID = '57430';
                        } else if (/(^Tapas)/i.test(value)) {
                            MagazineName = 'Tapas';
                            MagazineID = '46777';
                        } else if (/(^manhwakyung$|^만화경$)/i.test(value)) {
                            MagazineName = '만화경';
                            MagazineID = '45888';
                        } else if (/(^Emanbae$)/i.test(value)) {
                            MagazineName = 'Emanbae';
                            MagazineID = '58391';
                        } else if (/^Eccll\s*Toon$/i.test(value)) {
                            MagazineName = 'Eccll Toon';
                            MagazineID = '62753';
                        } else if (/(^Postype$|^포스타입$)/i.test(value)) {
                            MagazineName = 'Postype';
                            MagazineID = '66026';
                        } else if (/(^ピッコマ$)/i.test(value)) {
                            MagazineName = 'ピッコマ';
                            MagazineID = '30686';
                        } else if (/^Line\s*マンガ$/i.test(value)) {
                            MagazineName = 'LINEマンガ';
                            MagazineID = '23698';
                        } else if (/^Naver\s*Series$/i.test(value)) {
                            MagazineName = 'Naver Series';
                            MagazineID = '43925';
                        } else if (/^Any\s*toon$/i.test(value)) {
                            MagazineName = 'Anytoon';
                            MagazineID = '47662';
                        } else if (/^Novelpia/i.test(value)) {
                            MagazineName = 'Novelpia';
                            MagazineID = '70144';
                        } else if (/^Watcha(?: Webtoon?|Webtoon?)?$/i.test(value)) {
                            MagazineName = 'Watcha';
                            MagazineID = '54138';
                        } else if (/^Blice(?: Webtoon?|Webtoon?)?$/i.test(value)) {
                            MagazineName = 'Blice';
                            MagazineID = '57497';
                        } else if (/(^Shortz$|^재담쇼츠$)/i.test(value)) {
                            MagazineName = 'Shortz';
                            MagazineID = '64952';
                        } else if (/^일요신문$/i.test(value)) {
                            MagazineName = '일요신문';
                            MagazineID = '64672';
                        } else if (/^Line\s*Webtoon$/i.test(value)) {
                            MagazineName = 'Line Webtoon';
                            MagazineID = '30546';
                        } else if (/(^Line\s*Webtoon\s*TW$)/i.test(value)) {
                            MagazineName = 'Line Webtoon TW';
                            MagazineID = '30546';
                        } else if (/(^Line\s*Webtoon\s*EN$)/i.test(value)) {
                            MagazineName = 'Line Webtoon EN';
                            MagazineID = '30546';
                        } else if (/(^Line\s*Webtoon\s*ES$)/i.test(value)) {
                            MagazineName = 'Line Webtoon ES';
                            MagazineID = '30546';
                        } else if (/(^Line\s*Webtoon\s*FR$)/i.test(value)) {
                            MagazineName = 'Line Webtoon FR';
                            MagazineID = '30546';
                        } else if (/(^Line\s*Webtoon\s*TH$)/i.test(value)) {
                            MagazineName = 'Line Webtoon TH';
                            MagazineID = '30546';
                        } else if (/(^Line\s*Webtoon\s*ID$)/i.test(value)) {
                            MagazineName = 'Line Webtoon ID';
                            MagazineID = '30546';
                        } else {
                            MagazineName = value;
                        }

                        updatedValues.push(MagazineName);

                        if (MagazineID && !syncContent.querySelector(`#syncMagazine-${MagazineID}`)) {
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.value = MagazineID;
                            checkbox.id = `syncMagazine-${MagazineID}`;
                            checkbox.checked = true;
                            checkbox.dataset.type = 'magazine';
                            const label = document.createElement('label');
                            label.textContent = MagazineName;
                            label.setAttribute('for', `syncMagazine-${MagazineID}`);
                            syncContent.appendChild(checkbox);
                            syncContent.appendChild(label);
                            syncContent.appendChild(document.createElement('br'));
                        }
                    });
                    infoboxContent = infoboxContent.replace(/\|连载杂志=[^\n]+/, `|连载杂志= ${updatedValues.join('、')}`);
                    infoboxTextarea.value = infoboxContent;
                }
            }
        }

        function handleLinkMatching() {
            const infoboxTextarea = document.querySelector('#infobox_wcode textarea[name="subject_infobox"]');
            if (!infoboxTextarea) return;

            let content = infoboxTextarea.value;
            const linkStart = content.indexOf("|链接={");
            const linkEnd = content.indexOf("}", linkStart);
            if (linkStart === -1 || linkEnd === -1) return;

            const linkContent = content.slice(linkStart + "|链接={".length, linkEnd).trim();
            const keyValueMapping = {
                "Naver Webtoon": "comic.naver.com",
                "Naver Series": "series.naver.com",
                "LINEマンガ": "manga.line.me",
                "Line Webtoon(繁)": "www.webtoons.com/zh-hant",
                "Line Webtoon(英)": "www.webtoons.com/en",
                "Toptoon(韩)": "toptoon.com",
                "Toptoon(繁)": "www.toptoon.net",
                "Toptoon(日)": "toptoon.jp",
                "Day Comics(英)": "daycomics.com",
                "Lezhin Comics(韩)": "www.lezhin.com/ko",
                "Lezhin Comics(日)": "www.lezhin.jp/ja",
                "Lezhin Comics(英)": "www.lezhinus.com/en",
                "Toomics(韩)": "www.toomics.com",
                "Toomics(简)": "toomics.com/sc",
                "Toomics(繁)": "toomics.com/tc",
                "Toomics(日)": "toomics.com/ja",
                "Toomics(英)": "toomics.com/en",
                "Comico(韩)": "www.comico.kr",
                "Comico(日)": "www.comico.jp",
                "Ridibooks": "ridibooks.com",
                "ピッコマ": "jp.piccoma.com",
                "Manta(英)": "manta.net/en",
                "めちゃコミ": "mechacomic.jp",
                "シーモア": "www.cmoa.jp",
                "Bookcube": "www.bookcube.com",
                "Peanutoon": "www.peanutoon.com",
                "만화경(关)": "www.manhwakyung.com",
                "Postype(韩)": "www.postype.com",
                "Comica(关)": "www.comica.com",
            };

            const mapLink = (pair) => {
                const matchWithoutPipe = pair.match(/^\[([^\]|]+)\]$/);
                if (matchWithoutPipe) {
                    const value = matchWithoutPipe[1].trim();
                    const mappedKey = Object.entries(keyValueMapping).find(([, url]) => value.includes(url))?.[0];
                    return mappedKey ? `[${mappedKey}|${value}]` : `[${value}]`;
                }
                return pair;
            };

            const newLinkContent = linkContent.split("\n").map(mapLink).join("\n");
            content = content.slice(0, linkStart + "|链接={".length) + "\n" + newLinkContent + "\n" + content.slice(linkEnd);

            infoboxTextarea.value = content;
        }

        // 开启MU搜索页函数
        window.MUEntry = function() {
            const menuInnerLink = document.querySelector('div.menu_inner a.avatar');
            if (menuInnerLink) {
                const selectors = [
                    'tbody tr td input[name="subject_title"]',
                    '#infobox_normal input.inputtext.prop',
                    '#infobox_normal input.inputtext.prop.multiSubVal'
                ];

                let titleText = null;
                for (const selector of selectors) {
                    titleText = document.querySelector(selector)?.value.trim();
                    if (titleText) break;
                }
                if (titleText) {
                    const searchURL = `https://www.mangaupdates.com/site/search/result?search=${encodeURIComponent(titleText)}`;
                    window.open(searchURL, '_blank');
                } else {
                    alert('未找到标题文字');
                }
            } else {
                alert('未找到目标元素');
            }
        };

        async function handleSaveButtonClick() {
            const form = document.querySelector('form[name="add_related"]');
            const formhashInput = document.querySelector('input[name="formhash"]');
            const formhash = formhashInput ? formhashInput.value : '';

            const checkboxes = syncContent.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                return false;
            }

            const formData = new URLSearchParams();
            formData.append('formhash', formhash);
            formData.append('submit', '保存关联数据');
            formData.append('editSummary', '');

            let existingInfoArr = await getExistingInfoArr();

            const newInfoArr = [];
            existingInfoArr.forEach((info, index) => {
                newInfoArr.push({
                    prsnPos: info.prsnPos,
                    prsn_id: info.prsn_id,
                    appear_eps: info.appear_eps
                });
            });

            newInfoArr.forEach((info, index) => {
                formData.append(`infoArr[${index}][prsnPos]`, info.prsnPos);
                formData.append(`infoArr[${index}][appear_eps]`, info.appear_eps);
                formData.append(`infoArr[${index}][prsn_id]`, info.prsn_id);
            });

            checkboxes.forEach((checkbox, index) => {
                const prsnPos = checkbox.dataset.type === 'publisher' ? '2004' : '2005';
                formData.append(`infoArr[n${index}][prsnPos]`, prsnPos);
                formData.append(`infoArr[n${index}][appear_eps]`, '');
                formData.append(`infoArr[n${index}][prsn_id]`, checkbox.value);
            });

            localStorage.setItem('pendingFormData', formData.toString());
            return true;
        }

        async function getExistingInfoArr() {
            try {
                const response = await fetch(window.location.pathname.replace('/edit_detail', '/add_related/person'));
                if (response.ok) {
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const form = doc.querySelector('form[name="add_related"]');

                    let infoArr = [];
                    if (form) {
                        const infoArrInputs = form.querySelectorAll('[name^="infoArr"]');
                        infoArrInputs.forEach(input => {
                            const match = input.name.match(/^infoArr\[(\d+)\]\[(\w+)\]$/);
                            if (match) {
                                const index = match[1];
                                const key = match[2];
                                const value = input.value;

                                if (!infoArr[index]) {
                                    infoArr[index] = {};
                                }
                                infoArr[index][key] = value;
                            }
                        });
                    }
                    return infoArr;
                }
                return [];
            } catch (error) {
                alert('数据获取出错:', error);
                return [];
            }
        }

        //下拉选单函数
        function addDropdownToField(targetLabel, options) {
            function createDropdown(inputElement, isReplaceMode = false) {

                const existingDropdown = document.getElementById('custom-dropdown');
                if (existingDropdown) {
                    existingDropdown.remove();
                }

                const dropdown = document.createElement('ul');
                dropdown.id = 'custom-dropdown';
                dropdown.style.position = 'absolute';
                dropdown.style.border = '1px solid #ccc';
                dropdown.style.color = '#155724';
                dropdown.style.background = '#D4EDDA';
                dropdown.style.zIndex = '1000';
                dropdown.style.listStyle = 'none';
                dropdown.style.margin = '0';
                dropdown.style.padding = '0';
                dropdown.style.width = inputElement.offsetWidth + 'px';

                const rect = inputElement.getBoundingClientRect();
                dropdown.style.top = rect.bottom + window.scrollY + 'px';
                dropdown.style.left = rect.left + window.scrollX + 'px';

                options.forEach(option => {
                    const item = document.createElement('li');
                    item.textContent = option;
                    item.style.padding = '5px';
                    item.style.cursor = 'pointer';

                    item.addEventListener('click', () => {
                        if (isReplaceMode) {
                            inputElement.value = option;
                        } else {
                            inputElement.value += (inputElement.value ? '' : '') + option;
                        }
                        dropdown.remove();
                    });

                    item.addEventListener('mouseover', () => {
                        item.style.color = '#155724';
                        item.style.background = '#f0f0f0';
                    });
                    item.addEventListener('mouseout', () => {
                        item.style.color = '#155724';
                        item.style.background = '#D4EDDA';
                    });

                    dropdown.appendChild(item);
                });

                document.body.appendChild(dropdown);

                function handleDocumentClick(event) {
                    if (
                        !dropdown.contains(event.target) &&
                        event.target !== inputElement
                    ) {
                        dropdown.remove();
                        document.removeEventListener('click', handleDocumentClick);
                    }
                }

                document.addEventListener('click', handleDocumentClick);
            }

            const observer = new MutationObserver(() => {
                const inputs = document.querySelectorAll('input.inputtext.id');

                inputs.forEach(input => {
                    if (input.value === targetLabel) {
                        const targetInput = input.nextElementSibling;

                        if (targetInput && !targetInput.dataset.dropdownBound) {
                            targetInput.dataset.dropdownBound = true;

                            const isReplaceMode = replaceModeFields.includes(targetLabel);

                            targetInput.addEventListener('focus', () => {
                                createDropdown(targetInput, isReplaceMode);
                            });
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // 配置下拉选单
        const replaceModeFields = ["备注"];
        addDropdownToField("备注", ["本作有成人版本", "本作有无修正版本"]);
        addDropdownToField("话数", ["序章", "后记", "外传", "特别篇", "尾声", "杂篇"]);
    }
})();