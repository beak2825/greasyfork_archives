// ==UserScript==
// @name         显示WatchaPedia评分
// @namespace    https://bgm.tv/user/chiefmagician
// @version      0.1.0
// @description  Fetch ratings data from Watcha API and display on Bangumi pages
// @author       Rrrrrrr
// @include     /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/subject\/(\d+)$/
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      pedia.watcha.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/536400/%E6%98%BE%E7%A4%BAWatchaPedia%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/536400/%E6%98%BE%E7%A4%BAWatchaPedia%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ratingDiv = $("div[rel='v:rating']");
    if (!ratingDiv.length) return;

    let dataFetched = false, originalRatingData = null, originalRankedText = null;

    $("a[href^='/subject/'][href*='/stats']").on("click", function(e) {
        e.preventDefault();
        const sctitleElement = document.querySelector('h1.nameSingle a[title]');
        if (!sctitleElement) {
            alert("无法获取页面标题");
            return;
        }

        const rateEmo = $(".rateEmo");
        const rankedElement = $("small.grey:contains('Bangumi Book Ranked:')");
        if (rankedElement.length && !originalRankedText) {
            originalRankedText = rankedElement.closest("div").html();
        }

        const sctitle = sctitleElement.textContent.trim();
        const years = [
            [...document.querySelectorAll('li')].find(li => li.textContent.includes('开始:'))?.textContent.match(/\d{4}/)?.[0],
            [...document.querySelectorAll('li')].find(li => li.textContent.includes('发售日:'))?.textContent.match(/\d{4}/)?.[0],
            [...document.querySelectorAll('li')].find(li => li.textContent.includes('上映日:'))?.textContent.match(/\d{4}/)?.[0]
        ].filter(Boolean);
        const scyear = Math.min(...years.map(Number));

        const headers = {
            "x-frograms-app-code": "Galaxy",
            "x-frograms-client": "Galaxy-Web-App",
            "x-frograms-version": "2.1.0",
        };

        if (!dataFetched) {
            const ratingBox = $("div[rel='v:rating']");
            originalRatingData = {
                average: ratingBox.find(".global_score .number").text(),
                voteCount: ratingBox.find(".chart_desc small span[property='v:votes']").text(),
                chartItems: [],
                descriptionText: $("div.global_rating .global_score .description").text(),
            };

            $(".horizontalChart li").each(function() {
                const chartItem = $(this);
                originalRatingData.chartItems.push({
                    label: chartItem.find(".label").text(),
                    count: chartItem.find(".count").text(),
                    percentage: chartItem.find(".count").css("height"),
                    dataOriginalTitle: chartItem.find(".textTip").attr("data-original-title"),
                    backgroundColor: chartItem.find(".count-background").css("background-color")
                });
            });

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://pedia.watcha.com/api/searches?query=${encodeURIComponent(sctitle)}`,
                headers: headers,
                onload: function(response) {
                    if (response.status !== 200) {
                        console.error(`API请求失败，状态码: ${response.status}`);
                        return;
                    }
                    const data = JSON.parse(response.responseText);
                    console.log(data);
                    const sanitizeTitle = title => title.replace(/\s+/g, '');
                    const findMatchingItem = (items, title) => items?.find(item =>
                        sanitizeTitle(item.title) === sanitizeTitle(title) &&
                        (items.filter(i => sanitizeTitle(i.title) === sanitizeTitle(title)).length === 1 || item.year === scyear)
                    );
                    const matchingWebtoon = [data.result?.webtoons, data.result?.top_results]
                        .map(items => findMatchingItem(items, sctitle))
                        .find(result => result);
                    if (!matchingWebtoon) {
                        alert("未找到匹配的条目");
                        return;
                    }
                    const code = matchingWebtoon.code;

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://pedia.watcha.com/api/contents/${code}`,
                        headers: headers,
                        onload: function(response) {
                            if (response.status !== 200) {
                                console.error(`API请求失败，状态码: ${response.status}`);
                                return;
                            }

                            const contentData = JSON.parse(response.responseText);
                            console.log(contentData);
                            const {
                                ratings_avg,
                                ratings_count,
                                ratings_distribution
                            } = contentData.result;

                            GM_setValue("watchaRatings", {
                                ratings_avg,
                                ratings_count,
                                ratings_distribution,
                            });

                            if (ratings_avg && ratings_count) {
                                rateEmo.html('<img src="/pic/photo/l/4c/74/670258_B24dc.jpg" width="34" height="33" style="border-radius: 2px;"/>');

                                if (rankedElement.length) {
                                    rankedElement.text('Watcha Pedia Rating');
                                    rankedElement.next().remove();
                                }

                                const ratingBox = $("div[rel='v:rating']");
                                ratingBox.find(".global_score .number").text(ratings_avg.toFixed(1));

                                const ratingDescriptions = {};
                                $("input[name='rating']").each(function() {
                                    const value = $(this).val();
                                    const title = $(this).attr('title');
                                    const description = title.split(' ')[0];
                                    ratingDescriptions[value] = description;
                                });

                                const ratingValue = ratings_avg.toFixed(0);
                                const descriptionText = ratingDescriptions[ratingValue] || "未评分";
                                $("div.global_rating .global_score .description")
                                    .text(descriptionText)
                                    .css("cursor", "pointer")
                                    .off("click")
                                    .on("click", function(event) {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        window.open(`https://pedia.watcha.com/ko-KR/contents/${code}`, "_blank");
                                    });

                                const voteCount = ratingBox.find(".chart_desc small span[property='v:votes']");
                                voteCount.text(ratings_count);

                                const totalVotes = Object.values(ratings_distribution).reduce((sum, count) => sum + count, 0);
                                const chartItems = $(".horizontalChart li");
                                const maxPercentage = Math.max(...Object.values(ratings_distribution).map(count => (count / totalVotes) * 100));

                                Object.entries(ratings_distribution).reverse().forEach(([rating, count], index) => {
                                    if (index < chartItems.length) {
                                        const chartItem = $(chartItems[index]);
                                        const percentage = (count / ratings_count) * 100;
                                        const normalizedHeight = (percentage / maxPercentage) * 100;
                                        const finalHeight = Math.min(normalizedHeight, 100);
                                        chartItem.find(".count").css("height", `${finalHeight}%`).text(`(${count})`);
                                        chartItem.find(".textTip").attr("data-original-title", `${percentage.toFixed(2)}% (${count}人)`);
                                        chartItem.find(".label").text(rating);
                                    }
                                });
                                dataFetched = true;
                            } else {
                                alert("无法获取有效的评分数据");
                            }
                        },
                        onerror: function() {
                            alert("内容API请求失败");
                        }
                    });
                },
                onerror: function() {
                    alert("API请求失败");
                }
            });
        } else {
            const ratingBox = $("div[rel='v:rating']");
            ratingBox.find(".global_score .number").text(originalRatingData.average);
            ratingBox.find(".chart_desc small span[property='v:votes']").text(originalRatingData.voteCount);
            $(".horizontalChart li").each(function(index) {
                const chartItem = $(this);
                const data = originalRatingData.chartItems[index];
                if (data) {
                    chartItem.find(".label").text(data.label)
                        .siblings(".count")
                        .text(data.count)
                        .css("height", data.percentage);
                    chartItem.find(".textTip").attr("data-original-title", data.dataOriginalTitle);
                    chartItem.find(".count-background").css("background-color", data.backgroundColor);
                }
            });
            $("div.global_rating .global_score .description")
                .text(originalRatingData.descriptionText)
                .css("cursor", "pointer")
                .off("click");
            dataFetched = false;
            rateEmo.empty();
            if (originalRankedText) {
                $("small.grey:contains('Watcha Pedia Rating')")
                    .closest("div")
                    .html(originalRankedText);
            }
        }
    });
})();