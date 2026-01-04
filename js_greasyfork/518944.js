// ==UserScript==
// @name         博客园新闻在线词云
// @name:en      Cnblogs News Scraper and WordCloud Generator
// @description:en Cnblogs News Scraper,WordCloud Generator
// @name:ar      مدونة الأخبار السحابية على الإنترنت
// @description:ar  مكشطة أخبار مدونة، مولد السحابة الكلمية
// @name:bg      Онлайн облак от думи за новини в Cnblogs
// @description:bg  Скрепер за новини от Cnblogs, генератор на облак от думи
// @name:cs      Online slovní oblak zpráv Cnblogs
// @description:cs  Skreper zpráv Cnblogs, generátor slovního oblaku
// @name:da      Cnblogs Nyheder Online Ordfold
// @description:da  Cnblogs Nyhedsskraper, Ordfoldsgenerator
// @name:de      Cnblogs Nachrichten Online-Wortwolke
// @description:de  Cnblogs Nachrichtenscraper, Wortwolkengenerator
// @name:el      Διαδικτυακό σύννεφο λέξεων ειδήσεων Cnblogs
// @description:el  Ξύστης ειδήσεων Cnblogs, Γεννήτρια σύννεφου λέξεων
// @name:eo      Interreta Vortonubo de Novaĵoj de Cnblogs
// @description:eo  Skrapilo de Novaĵoj de Cnblogs, Generilo de Vortonubo
// @name:es      Nube de palabras en línea de noticias de Cnblogs
// @description:es  Raspador de noticias de Cnblogs, Generador de nube de palabras
// @name:fi      Cnblogs-uutisten online-sanapilvi
// @description:fi  Cnblogs-uutiskaavin, sanapilvigeneraattori
// @name:fr      Nuage de mots en ligne des nouvelles de Cnblogs
// @description:fr  Scraper de nouvelles Cnblogs, Générateur de nuage de mots
// @name:fr-CA   Nuage de mots en ligne des nouvelles de Cnblogs
// @description:fr-CA  Grattoir de nouvelles Cnblogs, Générateur de nuage de mots
// @name:he      ענן מילים מקוון של חדשות Cnblogs
// @description:he  מגרד חדשות Cnblogs, מחולל ענן מילים
// @name:hr      Online oblak riječi vijesti Cnblogs
// @description:hr  Skreper vijesti Cnblogs, Generator oblaka riječi
// @name:hu      Cnblogs Hírek Online Szófelhő
// @description:hu  Cnblogs Hírek Kaparó, Szófelhő Generátor
// @name:id      Awan Kata Berita Cnblogs Online
// @description:id  Pengikis Berita Cnblogs, Pembuat Awan Kata
// @name:it      Nuvola di parole online delle notizie di Cnblogs
// @description:it  Scraper di notizie Cnblogs, Generatore di nuvole di parole
// @name:ja      Cnblogsニュースオンライン単語クラウド
// @description:ja  Cnblogsニューススクレーパー、単語クラウドジェネレーター
// @name:ka      Cnblogs სიახლეების ონლაინ სიტყვის ღრუბელი
// @description:ka  Cnblogs სიახლეების სკრაპერი, სიტყვის ღრუბლის გენერატორი
// @name:ko      Cnblogs 뉴스 온라인 워드클라우드
// @description:ko  Cnblogs 뉴스 스크레이퍼, 워드클라우드 생성기
// @name:nb      Cnblogs Nyheter Online Ordsky
// @description:nb  Cnblogs Nyhetsskraper, Ordskygenerator
// @name:nl      Cnblogs Nieuws Online Woordwolk
// @description:nl  Cnblogs Nieuwsscraper, Woordwolkgenerator
// @name:pl      Chmura słów online wiadomości Cnblogs
// @description:pl  Skraper wiadomości Cnblogs, Generator chmury słów
// @name:pt-BR   Nuvem de palavras online de notícias do Cnblogs
// @description:pt-BR  Raspador de notícias do Cnblogs, Gerador de nuvem de palavras
// @name:ro      Nor de cuvinte online al știrilor Cnblogs
// @description:ro  Scraper de știri Cnblogs, Generator de nori de cuvinte
// @name:ru      Онлайн-облако слов новостей Cnblogs
// @description:ru  Скрапер новостей Cnblogs, Генератор облака слов
// @name:sk      Online oblak slov správ Cnblogs
// @description:sk  Skreper správ Cnblogs, Generátor oblaku slov
// @name:sr      Онлајн облак речи вести Cnblogs
// @description:sr  Скрејпер вести Cnblogs, Генератор облака речи
// @name:sv      Cnblogs Nyheter Online Ordmoln
// @description:sv  Cnblogs Nyhetsskrapare, Ordmolnsgenerator
// @name:th      คลาวด์คำออนไลน์ของข่าว Cnblogs
// @description:th  ตัวขูดข่าว Cnblogs, ตัวสร้างคลาวด์คำ
// @name:tr      Cnblogs Haberler Çevrimiçi Kelime Bulutu
// @description:tr  Cnblogs Haber Kazıyıcı, Kelime Bulutu Oluşturucu
// @name:ug      Cnblogs خەۋەرلىرى تور سۆز بۇلۇتى
// @description:ug  Cnblogs خەۋەر قىرگۇچى، سۆز بۇلۇتى ياسىغۇچى
// @name:uk      Онлайн хмара слів новин Cnblogs
// @description:uk  Скрапер новин Cnblogs, Генератор хмари слів
// @name:vi      Đám mây từ trực tuyến của tin tức Cnblogs
// @description:vi  Công cụ cạo tin tức Cnblogs, Trình tạo đám mây từ
// @name:zh      博客园新闻在线词云
// @description:zh  博客园新闻抓取工具，词云生成器
// @name:zh-CN   博客园新闻在线词云
// @description:zh-CN  博客园新闻抓取工具，词云生成器
// @name:zh-HK   博客園新聞線上詞雲
// @description:zh-HK  博客園新聞抓取工具，詞雲生成器
// @name:zh-SG   博客园新闻在线词云
// @description:zh-SG  博客园新闻抓取工具，词云生成器
// @name:zh-TW   博客園新聞線上詞雲
// @description:zh-TW  博客園新聞抓取工具，詞雲生成器
// @namespace    http://tampermonkey.net/
// @version      1.2.2.2
// @description  Scrape news from cnblogs and generate word clouds
// @author       aspen138
// @icon         https://assets.cnblogs.com/favicon.ico
// @match        *://news.cnblogs.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/wordcloud2.js/1.1.2/wordcloud2.min.js
// @require      https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js
// @connect      news.cnblogs.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518944/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%B0%E9%97%BB%E5%9C%A8%E7%BA%BF%E8%AF%8D%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/518944/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%B0%E9%97%BB%E5%9C%A8%E7%BA%BF%E8%AF%8D%E4%BA%91.meta.js
// ==/UserScript==


// Acknowledgement: o1-preview, Gemini 2.5 Flash Preview 04-17, Grok 3




var global_doesConsiderNewsBody = false; //default set "false"

/*-------------------------------预处理一下不纳入词云考虑的词表--------------------------------------------------------------*/
// Function to generate all Arabic numeral combinations of length 1 to 4
function generateArabicNumerals(maxLength) {
    const numerals = new Set();
    for (let len = 1; len <= maxLength; len++) {
        const maxNum = Math.pow(10, len);
        for (let i = 0; i < maxNum; i++) {
            const numStr = i.toString().padStart(len, '0'); // e.g., "0012" for 12
            numerals.add(numStr);
        }
    }
    return numerals;
}

// Function to convert a number to its Chinese reading
function numberToChinese(num) {
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];

    if (num === 0) return '零';

    let str = '';
    let numStr = num.toString();
    let len = numStr.length;

    for (let i = 0; i < len; i++) {
        let digit = parseInt(numStr[i]);
        let unitIdx = len - 1 - i;

        // Add digit if not zero
        if (digit !== 0) {
            str += digits[digit] + units[unitIdx];
        } else if (i < len - 1 && parseInt(numStr[i + 1]) !== 0) {
            // Add zero if next digit is non-zero (e.g., 1001 -> 一千零一)
            str += digits[0];
        }
    }

    // Clean up: remove trailing units, handle special cases
    str = str.replace(/零+$/, ''); // Remove trailing zeros
    str = str.replace(/零{2,}/g, '零'); // Replace multiple zeros with single zero
    if (str.startsWith('一十')) {
        str = str.slice(1); // "一十" -> "十"
    }

    return str;
}

// Generate Chinese number readings for numbers 0 to 9999 with length <= 10
function generateChineseNumbers(maxNum, maxLength) {
    const chineseNums = new Set();
    for (let i = 0; i <= maxNum; i++) {
        const chinese = numberToChinese(i);
        if (chinese.length <= maxLength) {
            chineseNums.add(chinese);
        }
    }
    return chineseNums;
}
// Basic filter for common punctuation/symbols that might slip through or be single chars
const punctuationRegex = /^[.,!?;:"'，。！？；：‘’“”【】（）《》、]$/;
// Initialize custom stop words
const customStopWords = new Set(['的', '是', '和', '有', '在', '了', '中', '等', '与', '一']);

// Add Arabic numerals (length <= 4)
const arabicNumerals = generateArabicNumerals(4);
arabicNumerals.forEach(num => customStopWords.add(num));

// Add Chinese number readings (length <= 10)
const chineseNumbers = generateChineseNumbers(9999, 10);
chineseNumbers.forEach(num => customStopWords.add(num));
/*-------------------------------预处理一下不纳入词云考虑的词表--------------------------------------------------------------*/





function extract_newsIds() {
    // Select the `news_list` container
    const newsList = document.querySelector('#news_list');

    if (newsList) {
        // Find all <a> elements with href matching /n/{news_id}/
        const newsLinks = newsList.querySelectorAll('a[href^="/n/"][href$="/"]');

        // Extract the news_id from each matching link
        const newsIds = Array.from(newsLinks).map(link => {
            const match = link.getAttribute('href').match(/\/n\/(\d+)\//);
            return match ? match[1] : null;
        }).filter(Boolean); // Remove null values
        return newsIds;
    }

};


(function () {
    'use strict';

    // Function to load external scripts dynamically
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Load segmentit script
    loadScript('https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js', function () {
        // Initialize segmentit after the script is loaded
        const segmentit = Segmentit.useDefault(new Segmentit.Segment());

        // Now start your main script
        main(segmentit);
    });

    function main(segmentit) {
        // Updated form HTML with horizontal layout and lower positioning

        const newsIds = extract_newsIds();

        // Assume `newsIds` might be undefined
        const defaultMin = 781100; // Default start news ID
        const defaultMax = 781159; // Default end news ID

        // Calculate min and max, falling back to defaults if newsIds is undefined or empty
        const minNewsId = Array.isArray(newsIds) && newsIds.length > 0 ? Math.min(...newsIds) : defaultMin;
        const maxNewsId = Array.isArray(newsIds) && newsIds.length > 0 ? Math.max(...newsIds) : defaultMax;
        const doesConsiderNewsBody = true; // 是否考虑新闻文本内容


        // var formHtml = `
        // <div id="news-scraper" style="position:fixed; top:50px; right:10px; background-color:#fff; padding:20px; border:1px solid #ccc; z-index:10000; display: flex; flex-direction: column; gap: 5px;">
        //     <h3 style="margin: 0; text-align: center;">News Scraper and WordCloud Generator</h3>
        //     <label style="display: flex; justify-content: space-between; align-items: center;">
        //         Start News ID:
        //         <input type="number" id="start-news-id" value="${minNewsId}" style="margin-left: 10px;" />
        //     </label>
        //     <label style="display: flex; justify-content: space-between; align-items: center;">
        //         End News ID:
        //         <input type="number" id="end-news-id" value="${maxNewsId}" style="margin-left: 10px;" />
        //     </label>
        //     <label style="display: flex; justify-content: space-between; align-items: center;">
        //         Consider News Body:
        //         <input type="checkbox" id="consider-news-body-checkbox" value="${doesConsiderNewsBody}" style="margin-left: 10px;" />
        //     </label>
        //     <button id="start-scraping" style="align-self: center; padding: 5px 10px;">Start Scraping</button>
        //     <div id="scraping-status" style="margin-top: 10px; text-align: center;"></div>
        // </div>
        // `;


        // $('body').append(formHtml);


        var formHtml = `
        <div id="news-scraper" style="position:fixed; top:50px; right:10px; background-color:#fff; padding:20px; border:1px solid #ccc; z-index:10000; display: flex; flex-direction: column;">
            <!-- Title Bar -->
            <div id="panel-title-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; text-align: left; flex-grow: 1; font-size: 1.2em;">News WordCloud</h3>
                <button id="minimize-button" style="background: none; border: none; font-size: 1.5em; cursor: pointer; padding: 0 5px; line-height: 1; color: #333;">-</button>
            </div>

            <!-- Panel Content (This part will be hidden when minimized) -->
            <div id="panel-content" style="display: flex; flex-direction: column; gap: 5px;">
                <label style="display: flex; justify-content: space-between; align-items: center;">
                    Start News ID:
                    <input type="number" id="start-news-id" value="${minNewsId}" style="margin-left: 10px; width: 80px;" />     <!-- Added width -->
                </label>
                <label style="display: flex; justify-content: space-between; align-items: center;">
                    End News ID:
                    <input type="number" id="end-news-id" value="${maxNewsId}" style="margin-left: 10px; width: 80px;" />      <!-- Added width -->
                </label>
                <label style="display: flex; justify-content: space-between; align-items: center;">
                    Consider News Body:
                    <input type="checkbox" id="consider-news-body-checkbox" ${doesConsiderNewsBody} style="margin-left: 10px;" /> <!-- Corrected checkbox value handling -->
                </label>
                <button id="start-scraping" style="align-self: center; padding: 5px 10px; margin-top: 10px;">Start Scraping</button>   <!-- Added margin-top -->
                <div id="scraping-status" style="margin-top: 10px; text-align: center;"></div>
            </div>
        </div>
        `;

        // Append the form HTML to the body
        $('body').append(formHtml);

        // --- Add the CSS for minimization ---
        // It's best to add a style block dynamically or ensure this CSS is in your page's head
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        /* Hide the content section when the panel has the 'minimized' class */
        #news-scraper.minimized #panel-content {
            display: none;
        }
        /* Optional: Adjust padding or remove margin for a tighter minimized look */
        #news-scraper.minimized {
            /* padding-bottom: 10px; /* Example: reduce bottom padding */ */
        }
        #news-scraper.minimized #panel-title-bar {
            margin-bottom: 0; /* Remove margin below title bar when content is hidden */
        }
        `;
        document.head.appendChild(style);


        // --- Add the JavaScript logic for minimization ---
        $(document).ready(function () { // Ensure DOM is ready
            var $panel = $('#news-scraper');
            var $minimizeButton = $('#minimize-button');
            var $panelContent = $('#panel-content');
            var $titleBar = $('#panel-title-bar');

            // Set initial button text
            $minimizeButton.text('-'); // Panel starts expanded

            // Add click listener to the minimize button
            $minimizeButton.on('click', function () {
                // Toggle the 'minimized' class on the main panel
                $panel.toggleClass('minimized');

                // Check if the panel is now minimized
                if ($panel.hasClass('minimized')) {
                    // If minimized: hide content, change button text, adjust margin
                    $panelContent.hide(); // Use jQuery hide/show for potential animation later if desired
                    $minimizeButton.text('+');
                    $titleBar.css('margin-bottom', '0'); // Remove space below title
                } else {
                    // If expanded: show content, change button text, restore margin
                    $panelContent.show(); // Use jQuery hide/show
                    $minimizeButton.text('-');
                    $titleBar.css('margin-bottom', '10px'); // Restore space below title
                }
            });

            // Optional: Make the panel draggable (requires jQuery UI or similar library)
            // If you have jQuery UI loaded:
            /*
            $panel.draggable({
                handle: "#panel-title-bar", // Only drag by the title bar
                cancel: "#minimize-button" // Don't start dragging when clicking the button
            });
            */

            // Note: Existing scraping logic should be attached to #start-scraping button
            // outside of this minimization code block.
        });


        $('#start-scraping').click(function () {
            var startId = parseInt($('#start-news-id').val());
            var endId = parseInt($('#end-news-id').val());
            global_doesConsiderNewsBody = $('#consider-news-body-checkbox').is(':checked');

            // Validate input
            if (endId < startId) {
                alert('End News ID must be greater than or equal to Start News ID');
                return;
            }

            startScraping(startId, endId);
        });

        async function startScraping(startId, endId) {
            var newsIds = [];
            if (startId <= endId) {
                for (var i = startId; i <= endId; i++) {
                    newsIds.push(i);
                }
            } else {
                for (var ii = startId; ii >= endId; ii--) {
                    newsIds.push(ii);
                }
            }
            var totalNews = newsIds.length;
            var newsData = [];
            var completedRequests = 0;

            $('#scraping-status').text('Starting scraping...');

            var concurrencyLimit = 1024; // Adjust this number as needed
            var queue = newsIds.slice(); // Copy of newsIds

            async function worker() {
                while (queue.length > 0) {
                    var newsId = queue.shift();
                    await fetchNews(newsId).then(function (newsInfo) {
                        if (newsInfo) {
                            newsData.push(newsInfo);
                        }
                    });
                    completedRequests++;
                    $('#scraping-status').text('Scraped ' + completedRequests + ' of ' + totalNews);
                }
            }

            var workers = [];
            for (var j = 0; j < concurrencyLimit; j++) {
                workers.push(worker());
            }

            await Promise.all(workers);

            // All done
            processData(newsData);
        }

        // Function to fetch a single news page
        function fetchNews(newsId) {
            return new Promise(function (resolve) {
                var url = 'https://news.cnblogs.com/n/' + newsId + '/';

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function (response) {
                        if (response.status === 200) {
                            var parser = new DOMParser();
                            var doc = parser.parseFromString(response.responseText, 'text/html');

                            var newsInfo = getNewsInfo(doc, newsId, url);
                            resolve(newsInfo);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function (error) {
                        resolve(null);
                    }
                });
            });
        }

        // Function to extract news information from the HTML document
        function getNewsInfo(doc, newsId, url) {
            var title = 'Not Found';
            var time_text = 'Not Found';
            var views = 'Not Found';
            var news_body = 'Not Found';

            var news_title_div = doc.querySelector('#news_title');
            if (news_title_div) {
                var a = news_title_div.querySelector('a');
                if (a) {
                    title = a.textContent.trim();
                }
            }

            var news_info_div = doc.querySelector('#news_info');
            if (news_info_div) {
                var time_span = news_info_div.querySelector('span.time');
                if (time_span) {
                    time_text = time_span.textContent.trim();
                }
                var view_span = news_info_div.querySelector('span.view#News_TotalView');
                if (view_span) {
                    views = view_span.textContent.trim();
                }
            }

            var news_body_div = doc.querySelector('#news_body');
            if (news_body_div) {
                news_body = news_body_div.innerText.trim();
            }

            return {
                news_id: newsId,
                title: title,
                time: time_text,
                views: views,
                news_body: news_body,
                url: url
            };
        }

        // Function to process the scraped data and generate word clouds
        function processData(newsData) {
            // Parse time and extract year_month
            for (var i = 0; i < newsData.length; i++) {
                var item = newsData[i];
                var timeStr = item.time; // e.g., "发布于 2023-09-30 12:34"
                var dateMatch = timeStr.match(/发布于\s+(\d{4}-\d{2}-\d{2})/);
                if (dateMatch) {
                    item.date = dateMatch[1];
                    var dateObj = new Date(item.date);
                    var year = dateObj.getFullYear();
                    var month = dateObj.getMonth() + 1; // Months are 0-based
                    item.year_month = year + '-' + (month < 10 ? '0' + month : month);
                    //console.log("item.year_month : ", item.year_month);
                } else {
                    item.date = null;
                    item.year_month = 'Unknown';
                }
            }

            // Group data by year_month
            var groupedData = {};
            for (var ii = 0; ii < newsData.length; ii++) {
                var my_item = newsData[ii];
                var key = my_item.year_month;
                if (!groupedData[key]) {
                    groupedData[key] = [];
                }
                groupedData[key].push(my_item);
            }

            //console.log("groupedData =", groupedData);

            // For each group, generate word cloud
            for (var my_key in groupedData) {
                var group = groupedData[my_key];
                var textArray = [];
                for (var j = 0; j < group.length; j++) {
                    var myitem = group[j];
                    // Combine title and news_body
                    var text
                    if (global_doesConsiderNewsBody) {
                        text = item.title + ' ' + item.news_body;
                    }
                    else {
                        text = myitem.title;
                    }
                    textArray.push(text);
                }
                var combinedText = textArray.join(' ');

                // Generate word cloud
                generateWordCloud(combinedText, my_key);
            }

            $('#scraping-status').text('All word clouds generated.');
        }

        // Function to generate word cloud using wordcloud2.js
        function generateWordCloud(text, title) {

            //console.log("In `generateWordCloud`, title= ", title);

            // Create a container div
            var container = $('<div></div>').css({
                'border': '1px solid #ccc',
                'margin': '10px',
                'padding': '10px'
            });
            // Add title
            var h3 = $('<h3></h3>').text(title);
            container.append(h3);
            // Create a canvas
            var canvas = $('<canvas></canvas>').attr('width', 500).attr('height', 500);
            container.append(canvas);

            $('#news-scraper').after(container);

            // Generate word cloud
            WordCloud(canvas[0], {
                list: getWordList(text),
                gridSize: 10,
                weightFactor: 5,
                fontFamily: 'Microsoft Yahei, SimHei, Arial, sans-serif',
                color: 'random-dark',
                backgroundColor: '#fff'
            });
        }

        // Function to segment text and generate word frequency list
        function getWordList(text) {
            // Use segmentit to segment Chinese text
            var segments = segmentit.doSegment(text);
            var words = segments.map(function (seg) {
                return seg.w;
            });

            // Count word frequencies
            var freqMap = {};
            words.forEach(function (word) {
                // Filter out empty strings, single characters, punctuation, and optionally custom stop words
                if (word.length > 1 && !punctuationRegex.test(word)
                    && !customStopWords.has(word)
                ) {
                    if (!freqMap[word]) {
                        freqMap[word] = 0;
                    }
                    freqMap[word]++;
                }
            });

            // Convert to list of [word, frequency] pairs
            var wordList = [];
            for (var word in freqMap) {
                wordList.push([word, freqMap[word]]);
            }

            // Sort by frequency
            wordList.sort(function (a, b) {
                return b[1] - a[1];
            });

            return wordList;
        }
    }
})();
