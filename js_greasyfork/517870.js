// ==UserScript==
// @name         班固米韩漫维基助手
// @namespace    http://tampermonkey.net/
// @version      3.2.4
// @description  韩漫维基人的好朋友
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @exclude     /subject/\d+/add_related/.*/
// @exclude     /(person|character)\/(\d+|new)(\/.*)?/
// @grant        none
// @run-at        document-body
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/517870/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%9F%A9%E6%BC%AB%E7%BB%B4%E5%9F%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/517870/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%9F%A9%E6%BC%AB%E7%BB%B4%E5%9F%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const textarea = document.querySelector('textarea[name="subject_summary"]');
        if (!textarea) return;
        const container = document.createElement('div');
        container.style.position = 'relative';
        textarea.parentNode.insertBefore(container, textarea);
        container.appendChild(textarea);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '-37px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        const formatButton = document.createElement('button');
        formatButton.innerHTML = '⚙️';
        formatButton.style.cursor = 'pointer';
        formatButton.style.border = 'none';
        formatButton.style.background = 'transparent';
        formatButton.title = "格式化文本";
        formatButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            let text = textarea.value;
            text = text.replace(/[!]/g, '！');
            text = text.replace(/[?]/g, '？');
            text = text.replace(/,/g, '，');
            text = text.replace(/[:]/g, '：');
            text = text.replace(/\.{3}/g, '…');
            text = text.replace(/(\n\n——[^\n]+)/g, '<<NEWLINE>>$1<<NEWLINE>>');
            text = text.replace(/(?<![a-zA-Z])\s+(?![a-zA-Z])/g, '');
            text = text.replace(/<<NEWLINE>>/g, '\n\n').trim();
            textarea.value = text;
        });
        const addButton = document.createElement('button');
        addButton.innerHTML = '📝';
        addButton.style.cursor = 'pointer';
        addButton.style.border = 'none';
        addButton.style.background = 'transparent';
        addButton.title = "新增平台";
        const menu = document.createElement('div');
        menu.style.display = 'none';
        menu.style.position = 'absolute';
        menu.style.borderRadius = '8px';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '5px';
        menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        menu.style.maxHeight = '250px';
        menu.style.overflowY = 'auto';
        const options = [
            "Line Webtoon TW",
            "Line Webtoon TW(R18)",
            "Kakao Webtoon TW(已关停)",
            "Kakao Webtoon TW(R18)(已关停)",
            "Bomtoon TW",
            "Bomtoon TW(R18)",
            "Bomtoon TW(R18)(无修)",
            "Toptoon TW(R18)",
            "Toomics SC",
            "Toomics TC",
            "PODO(已关停)",
            "快看漫画",
            "快看漫画(已下架)",
            "哔哩哔哩漫画",
            "咚漫",
            "腾讯动漫",
            "腾讯动漫(已下架)",
            "Pocket Comics TW(已关停)",
            "番茄",
            "爱奇艺叭嗒"
        ];
        options.forEach((optionText) => {
            const option = document.createElement('button');
            option.innerHTML = optionText;
            option.style.display = 'block';
            option.style.margin = '3px 0';
            option.style.padding = '5px 8px';
            option.style.cursor = 'pointer';
            option.style.border = '1px solid #ddd';
            option.style.borderRadius = '4px';
            option.style.width = '100%';
            option.style.transition = 'background 0.3s ease';
            option.addEventListener('mouseover', function() {
                option.style.background = '#e0e0e0';
            });
            option.addEventListener('mouseout', function() {
                option.style.background = '';
            });
            option.addEventListener('click', function() {
                let text = textarea.value;
                text += `\n\n——${optionText}`;
                textarea.value = text;
                menu.style.display = 'none';
            });
            menu.appendChild(option);
        });
        addButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            const buttonRect = addButton.getBoundingClientRect();
            menu.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
            menu.style.left = `${buttonRect.left + window.scrollX}px`;
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });
        window.addEventListener('click', function() {
            menu.style.display = 'none';
        });
        buttonContainer.appendChild(formatButton);
        buttonContainer.appendChild(addButton);
        container.appendChild(buttonContainer);
        document.body.appendChild(menu);
    });

    // 定位
    const targetContainer1 = document.querySelector('table.settings small a[onclick="WCODEtoNormal()"]');
    const targetContainer2 = document.querySelector('tbody tr td[valign="top"][width="70"]');

    // 插入 "Naver系"、"Kakao系"、"Kidari系"、"内容修饰"
    if (!targetContainer1) {
        return;
    }
    targetContainer1.insertAdjacentHTML('afterend', `
            <a href="javascript:void(0)" onclick="handleNaverEntry()" class="l">[Naver系]</a>
            <a href="javascript:void(0)" onclick="handleKakaoEntry()" class="l">[Kakao系]</a>
            <a href="javascript:void(0)" onclick="handleKidariEntry()" class="l">[Kidari系]</a>
            <a href="javascript:void(0)" onclick="fixedEntry()" class="l">[内容修饰]</a>
        `);
    if (!targetContainer2) {
        return;
    }
    targetContainer2.innerHTML += `
            <a href="javascript:void(0)" class="l" onclick="MUEntry()">🔎</a>
        `;

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
                            "[Kakao Webtoon(韩)|]\n[]",
                            "[ピッコマ|]\n[]",
                            "[Tapas(英)|]\n[]"
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
            const linkStart = content.search(/\|链接=\{\s*}/);
            if (linkStart !== -1) {
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
                input.value = input.value.replace(/[\u200B-\u200D\uFEFF]/g, '');
                input.value = input.value.replace(/ +\((?![0-9中上下])/g, '(');
                input.value = input.value.replace(
                    /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/g,
                    (m, y, mth, d) => `${y}-${mth.padStart(2, '0')}-${d.padStart(2, '0')}`
                );
                input.value = input.value.replace(
                    /(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/g,
                    (m, y, mth, d) => `${y}-${mth.padStart(2, '0')}-${d.padStart(2, '0')}`
                );
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
            WCODEtoNormal();
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
                    } else if (/(^M\s*Story\s*Hub|엠스토리허브)/i.test(value)) {
                        PublisherName = '엠스토리허브';
                        PublisherID = '46699';
                    } else if (/(^JC\s*미디어$|^JC\s*Media$|^작가\s*컴퍼니$|^Jakga\s*Company$)/i.test(value)) {
                        PublisherName = 'JC미디어';
                        PublisherID = '46698';
                    } else if (/(^앤드비)/i.test(value)) {
                        PublisherName = '앤드비(학산문화사)';
                        PublisherID = '46048';
                    } else if (/(^학산|^Haksan|鹤山文化|鶴山文化)/i.test(value)) {
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
                    } else if (/(^RED\s*SEVEN)/i.test(value)) {
                        PublisherName = 'RED SEVEN(REDICE STUDIO)';
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
                    } else if (/(^ab\s*Entertainment|^ab\s*엔터테인먼트는)/i.test(value)) {
                        PublisherName = 'ab Entertainment';
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
                    } else if (/(^연담|Yeondam)/i.test(value)) {
                        PublisherName = '연담';
                        PublisherID = '45552';
                    } else if (/(^소이\s*미디어|^SOY\s*MEDIA|^SOI\s*MEDIA)/i.test(value)) {
                        PublisherName = '소이미디어';
                        PublisherID = '53468';
                    } else if (/(^소미\s*미디어|^Somy\s*Media)/i.test(value)) {
                        PublisherName = '소미미디어';
                        PublisherID = '70350';
                    } else if (/(^북극여우|^Polarfox)/i.test(value)) {
                        PublisherName = '북극여우';
                        PublisherID = '48777';
                    } else if (/(^스토리위즈|^storywiz)/i.test(value)) {
                        PublisherName = '스토리위즈';
                        PublisherID = '51865';
                    } else if (/(^문피아|^Munpia)/i.test(value)) {
                        PublisherName = 'Munpia';
                        PublisherID = '39735';
                    } else if (/(^ソラジマ|^SORAJIMA)/i.test(value)) {
                        PublisherName = 'SORAJIMA';
                        PublisherID = '49467';
                    } else if (/(^레드독|^Red\s*Dog)/i.test(value)) {
                        PublisherName = 'Red Dog Culture House';
                        PublisherID = '46507';
                    } else if (/(^에이템포|^A\s*tempo|^A\s*:\s*tempo)/i.test(value)) {
                        PublisherName = '에이템포미디어';
                        PublisherID = '57174';
                    } else if (/(^스르륵코믹스|^Surreuk)/i.test(value)) {
                        PublisherName = '스르륵코믹스';
                        PublisherID = '52438';
                    } else if (/(^책\s*끝을\s*접다$)/i.test(value)) {
                        PublisherName = '책끝을접다';
                        PublisherID = '63728';
                    } else if (/(카카오웹툰\s*스튜디오)/i.test(value)) {
                        PublisherName = '카카오웹툰스튜디오';
                    } else {
                        PublisherName = value;
                    }

                    updatedValues.push(PublisherName);
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
                    } else if (/^Kakao\s*Webtoon$/i.test(value)) {
                        MagazineName = 'Kakao Webtoon';
                        MagazineID = '12900';
                    } else if (/(^Kakaopage$)/i.test(value)) {
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
            "Kakaopage": "page.kakao.com",
            "Kakao Webtoon(韩)": "webtoon.kakao.com",
            "PODO漫画(关)": "pdt.tencentac.com",
            "Kakao Webtoon(繁)": "tw.kakaowebtoon.com",
            "ピッコマ": "jp.piccoma.com",
            "ピッコマ": "piccoma.com",
            "Tapas(英)": "tapas.io",
            "Toptoon(韩)": "toptoon.com",
            "Toptoon(繁)": "www.toptoon.net",
            "Toptoon(日)": "toptoon.jp",
            "Day Comics(英)": "daycomics.com",
            "Mrblue(韩)": "www.mrblue.com",
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
            "Manta(英)": "manta.net/en",
            "Tappytoon(英)": "www.tappytoon.com/en",
            "Manga Plaza(英)": "mangaplaza.com",
            "めちゃコミ": "mechacomic.jp",
            "シーモア": "www.cmoa.jp",
            "Bookcube": "www.bookcube.com",
            "Peanutoon(关)": "www.peanutoon.com",
            "만화경(关)": "www.manhwakyung.com",
            "Postype(韩)": "www.postype.com",
            "Comica(关)": "www.comica.com",
            "咚漫": "www.dongmanmanhua.cn",
            "快看漫画": "www.kuaikanmanhua.com",
            "哔哩哔哩漫画": "manga.bilibili.com",
            "腾讯动漫": "ac.qq.com",
            "爱奇艺叭嗒": "www.iqiyi.com",
            "番茄小说": "fanqienovel.com",
            "CCC創作集": "www.creative-comic.tw",
            "MOJOIN": "mojoin.com",
            "Pocket Comics(英)(关)": "pocketcomics.com",
            "Bufftoon(关)": "bufftoon.plaync.com",
            "Novelpia(韩)": "novelpia.com",
            "Munpia(韩)": "novel.munpia.com",
            "Wuxiaworld(英)": "www.wuxiaworld.com",
            "Bomtoon(韩)": "www.bomtoon.com",
            "Bomtoon(繁)": "www.bomtoon.tw",
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
})();