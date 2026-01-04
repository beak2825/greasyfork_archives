// ==UserScript==
// @name         get_douban_info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  辅助auto-feed脚本获取豆瓣信息
// @author       tomorrow505
// @match        https://passthepopcorn.me/torrents.php?id=238092&torrentid=869948
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @grant        none
// ==/UserScript==

const TIMEOUT = 6000;
function getPoster(doc) {
    try {
        return $('#mainpic img', doc)[0].src.replace(
            /^.+(p\d+).+$/,
            (_, p1) => `https://img9.doubanio.com/view/photo/l_ratio_poster/public/${p1}.jpg`
        );
    } catch (e) {
        return null;
    }
}
 
function getTitles(doc) {
    let isChinese = false;
    const chineseTitle = doc.title.replace(/\(豆瓣\)$/, '').trim();
    const originalTitle = $('#content h1>span[property]', doc).text().replace(chineseTitle, '').trim() || ((isChinese = true), chineseTitle);
    try {
        let akaTitles = $('#info span.pl:contains("又名")', doc)[0].nextSibling.textContent.trim().split(' / ');
        const transTitle = isChinese ? akaTitles.find(e => {return e.match(/[a-z]/i);}) || chineseTitle: chineseTitle;
        const priority = e => {
            if (e === transTitle) {
                return 0;
            }
            if (e.match(/\(港.?台\)/)) {
                return 1;
            }
            if (e.match(/\([港台]\)/)) {
                return 2;
            }
            return 3;
        };
        akaTitles = akaTitles.sort((a, b) => priority(a) - priority(b)).filter(e => e !== transTitle);
        return [{
            chineseTitle: chineseTitle,
            originalTitle: originalTitle,
            translatedTitle: transTitle,
            alsoKnownAsTitles: akaTitles
            }, 
            isChinese
        ];
    } catch (e) {
        return [{
            chineseTitle: chineseTitle,
            originalTitle: originalTitle,
            translatedTitle: chineseTitle,
            alsoKnownAsTitles: []
            },
            isChinese
        ];
    }
}
 
function getYear(doc) {
    return parseInt($('#content>h1>span.year', doc).text().slice(1, -1));
}
 
function getRegions(doc) {
    try {
        return $('#info span.pl:contains("制片国家/地区")', doc)[0].nextSibling.textContent.trim().split(' / ');
    } catch (e) {
        return [];
    }
}
 
function getGenres(doc) {
    try {
        return $('#info span[property="v:genre"]', doc).toArray().map(e => e.innerText.trim());
    } catch (e) {
        return [];
    }
}
 
function getLanguages(doc) {
    try {
        return $('#info span.pl:contains("语言")', doc)[0].nextSibling.textContent.trim().split(' / ');
    } catch (e) {
        return [];
    }
}
 
function getReleaseDates(doc) {
    try {
        return $('#info span[property="v:initialReleaseDate"]', doc).toArray().map(e => e.innerText.trim()).sort((a, b) => new Date(a) - new Date(b));
    } catch (e) {
        return [];
    }
}
 
function getDurations(doc) {
    try {
        return $('span[property="v:runtime"]', doc).text();
    } catch (e) {
        return [];
    }
}
 
function getEpisodeDuration(doc) {
    try {
        return $('#info span.pl:contains("单集片长")', doc)[0].nextSibling.textContent.trim();
    } catch (e) {
        return null;
    }
}
 
function getEpisodeCount(doc) {
    try {
        return parseInt($('#info span.pl:contains("集数")', doc)[0].nextSibling.textContent.trim());
    } catch (e) {
        return null;
    }
}
 
function getTags(doc) {
    return $('div.tags-body>a', doc).toArray().map(e => e.textContent);
}
 
function getDoubanScore(doc) {
    const $interest = $('#interest_sectl', doc);
    const ratingAverage = parseFloat(
      $interest.find('[property="v:average"]').text()
    );
    const ratingVotes = parseInt($interest.find('[property="v:votes"]').text());
    return {
        rating: ratingAverage,
        ratingCount: ratingVotes,
        ratingHistograms: {
            'Douban Users': {
            aggregateRating: ratingAverage,
            demographic: 'Douban Users',
            totalRatings: ratingVotes
        }
      }
    };
}
 
function getDescription(doc) {
    try {
        return Array.from($('#link-report>[property="v:summary"],#link-report>span.all.hidden', doc)[0].childNodes)
            .filter(e => e.nodeType === 3)
            .map(e => e.textContent.trim())
            .join('\n');
    } catch (e) {
        return null;
    }
}
 
function addComma(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
 
function getDirector(doc) {
    try{
        return $('#info span.pl:contains("导演")', doc)[0].nextSibling.nextSibling.textContent.trim().split(' / ');
    } catch (err) {
        return [];
    }
}
 
function getWriters(doc) {
    try{
        return $('#info span.pl:contains("编剧")', doc)[0].nextSibling.nextSibling.textContent.trim().split(' / ');
    } catch (err) {
        return [];
    }
}
 
function getCasts(doc) {
    try{
        return $('#info span.pl:contains("主演")', doc)[0].nextSibling.nextSibling.textContent.trim().split(' / ');
    } catch (err) {
        return [];
    }
}
 
async function getIMDbScore(ID, timeout = TIMEOUT) {
    if (ID) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `http://p.media-imdb.com/static-content/documents/v1/title/tt${ID}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`,
                headers: {
                    referrer: 'http://p.media-imdb.com/'
                },
                timout: timeout,
                onload: x => {
                    try {
                        const e = JSON.parse(x.responseText.slice(16, -1));
                        resolve(e.resource);
                    } catch (e) {
                        console.warn(e);
                        resolve(null);
                    }
                },
                ontimeout: e => {
                    console.warn(e);
                    resolve(null);
                },
                onerror: e => {
                    console.warn(e);
                    resolve(null);
                }
            });
        });
    } else {
        return null;
    }
}
 
async function getIMDbID(doc) {
    try {
        return $('#info span.pl:contains("IMDb:")', doc).parent().text().match(/tt(\d+)/)[1];
    } catch (e) {
      return null;
    }
}
 
async function getCelebrities(doubanid, timeout = TIMEOUT) {
    var awardurl = 'https://movie.douban.com/subject/{a}/celebrities/'.format({'a': doubanid});
    return new Promise(resolve => {
        getDoc(awardurl, null, function(doc){
            const entries = $('#celebrities>div.list-wrapper', doc).toArray().map(e => {
                const [positionChinese, positionForeign] = $(e).find('h2').text().match(/([^ ]*)(?:$| )(.*)/).slice(1, 3);
                const people = $(e).find('li.celebrity').toArray().map(e => {
                    let [nameChinese, nameForeign] = $(e).find('.info>.name').text().match(/([^ ]*)(?:$| )(.*)/).slice(1, 3);
                    if (!nameChinese.match(/[\u4E00-\u9FCC]/)) {
                        nameForeign = nameChinese + ' ' + nameForeign;
                        nameChinese = null;
                    }
                    const [roleChinese, roleForeign, character] = $(e).find('.info>.role').text().match(/([^ ]*)(?:$| )([^(]*)(?:$| )(.*)/).slice(1, 4);
                    return {
                        name: {
                            chs: nameChinese,
                            for: nameForeign
                        },
                        role: {
                            chs: roleChinese,
                            for: roleForeign
                        },
                        character: character.replace(/[()]/g, '')
                    };
                });
                return [
                    positionForeign.toLowerCase(),
                    {
                        position: positionChinese,
                        people: people
                    }
                ];
            });
            console.log(typeof(entries))
            console.log(entries)
            if (entries.length) {
                // jsonCeleb = Object.fromEntries(entries);
                // console.log(jsonCeleb)
                jsonCeleb = entries;
            } else {
                jsonCeleb = null;
            }
            resolve(jsonCeleb);
        });
    });
}
 
async function getAwards(doubanid, timeout = TIMEOUT) {
    var awardurl = 'https://movie.douban.com/subject/{a}/awards/'.format({'a': doubanid});
    return new Promise(resolve => {
        getDoc(awardurl, null, function(doc){
            resolve($('div.awards', doc).toArray().map(function(e){
                const $title = $(e).find('.hd>h2');
                const $awards = $(e).find('.award');
                return {
                    name: $title.find('a').text().trim(),
                    year: parseInt($title.find('.year').text().match(/\d+/)[0]),
                    awards: $awards.toArray().map(e => ({
                        name: $(e).find('li:first-of-type').text().trim(),
                        people: $(e).find('li:nth-of-type(2)').text().split('/').map(e => e.trim())
                    }))
                };
            }));
        });
    })
}
 
async function getInfo(doc) {
    const [titles, isChinese] = getTitles(doc),
        year = getYear(doc),
        regions = getRegions(doc),
        genres = getGenres(doc),
        languages = getLanguages(doc),
        releaseDates = getReleaseDates(doc),
        durations = getDurations(doc),
        episodeDuration = getEpisodeDuration(doc),
        episodeCount = getEpisodeCount(doc),
        tags = getTags(doc),
        DoubanID = raw_info.dburl.match(/subject\/(\d+)/)[1],
        DoubanScore = getDoubanScore(doc),
        poster = getPoster(doc),
        description = getDescription(doc);
        directors = getDirector(doc);
        writers = getWriters(doc);
        casts = getCasts(doc);
 
    let IMDbID, IMDbScore, awards, celebrities;
 
    const concurrentFetches = [];
 
    concurrentFetches.push(
        // IMDb Fetch
        getIMDbID(doc)
        .then(e => {
            IMDbID = e;
            return getIMDbScore(IMDbID);
        })
        .then(e => {
            IMDbScore = e;
            return getAwards(DoubanID);
        })
        .then(e => {
            awards = e;
            return getCelebrities(DoubanID);
        })
        .then(e => {
            celebrities = e;
        })
 
    );
    await Promise.all(concurrentFetches);
    if (IMDbScore && IMDbScore.title) {
        if (isChinese) {
            if (!titles.translatedTitle.includes(IMDbScore.title)) {
                titles.alsoKnownAsTitles.push(titles.translatedTitle);
                const index = titles.alsoKnownAsTitles.indexOf(IMDbScore.title);
                if (index >= 0) {
                    titles.alsoKnownAsTitles.splice(index, 1);
                }
                titles.translatedTitle = IMDbScore.title;
            }
        } else {
            if (!titles.originalTitle.includes(IMDbScore.title) &&titles.alsoKnownAsTitles.indexOf(IMDbScore.title) === -1) {
              titles.alsoKnownAsTitles.push(IMDbScore.title);
            }
        } 
    }
    return {
        poster: poster,
        titles: titles,
        year: year,
        regions: regions,
        genres: genres,
        languages: languages,
        releaseDates: releaseDates,
        durations: durations,
        episodeDuration: episodeDuration,
        episodeCount: episodeCount,
        tags: tags,
        DoubanID: DoubanID,
        DoubanScore: DoubanScore,
        IMDbID: IMDbID,
        IMDbScore: IMDbScore,
        description: description,
        directors: directors,
        writers: writers,
        casts: casts,
        awards: awards,
        celebrities: celebrities
    };
}
 
function formatInfo(info) {
    let temp;
    const infoText = (
        (info.poster ? `[img]${info.poster}[/img]\n\n` : '') +
        '◎译　　名　' + [info.titles.translatedTitle].concat(info.titles.alsoKnownAsTitles).join(' / ') + '\n' +
        '◎片　　名　' + info.titles.originalTitle + '\n' +
        '◎年　　代　' + info.year + '\n' +
        (info.regions.length ? '◎产　　地　' + info.regions.join(' / ') + '\n' : '') +
        (info.genres.length ? '◎类　　别　' + info.genres.join(' / ') + '\n' : '') +
        (info.languages.length ? '◎语　　言　' + info.languages.join(' / ') + '\n' : '') +
        (info.releaseDates.length ? '◎上映日期　' + info.releaseDates.join(' / ') + '\n' : '') +
        ((info.IMDbScore && info.IMDbScore.rating) ? `◎IMDb评分  ${Number(info.IMDbScore.rating).toFixed(1)}/10 from ${addComma(info.IMDbScore.ratingCount)} users\n` : '') +
        (info.IMDbID ? `◎IMDb链接  https://www.imdb.com/title/tt${info.IMDbID}/\n` : '') +
        ((info.DoubanScore && info.DoubanScore.rating) ? `◎豆瓣评分　${info.DoubanScore.rating}/10 from ${addComma(info.DoubanScore.ratingCount)} users\n` : '') +
        (info.DoubanID ? `◎豆瓣链接　https://movie.douban.com/subject/${info.DoubanID}/\n` : '') +
        ((info.durations && info.durations.length) ? '◎片　　长　' + info.durations + '\n' : '') +
        (info.episodeDuration ? '◎单集片长　' + info.episodeDuration + '\n' : '') +
        (info.episodeCount ? '◎集　　数　' + info.episodeCount + '\n' : '') +
        (info.celebrities ? info.celebrities.map(e => {
            const position = e[1].position;
            let title = '◎';
            switch (position.length) {
                case 1:
                    title += '　  ' + position + '　  　';
                    break;
                case 2:
                    title += position.split('').join('　　') + '　';
                    break;
                case 3:
                    title += position.split('').join('  ') + '　';
                    break;
                case 4:
                    title += position + '　';
                    break;
                default:
                    title += position + '\n　　　　　　';
            }
            const people = e[1].people.map((f, i) => {
                const name = f.name.chs ? (f.name.for ? f.name.chs + ' / ' + f.name.for : f.name.chs) : f.name.for;
                return (i > 0 ? '　　　　　　' : '') + name + (f.character ? ` (${f.character})` : '');
            }).join('\n');
            return title + people;
        }).join('\n') + '\n\n' : '') +
        (info.tags.length ? '◎标　　签　' + info.tags.join(' | ') + '\n\n' : '') +
        (info.description ? '◎简　　介　\n' + info.description.replace(/^|\n/g, '\n　　') + '\n\n' : '◎简　　介　\n\n　　暂无相关剧情介绍') +
        (info.awards.length ? '◎获奖情况　\n\n' + info.awards.map(e => {
            const awardName = '　　' + e.name + ' (' + e.year + ')\n';
            const awardItems = e.awards.map(e => '　　' + e.name + (e.people ? ' ' + e.people : '')).join('\n');
            return awardName + awardItems;
        }).join('\n\n') + '\n\n' : '')
        ).trim();
    return infoText;
}
 
getDoc(raw_info.dburl, null, function(doc) {
    const infoGenClickEvent = async e => {
        var data = formatInfo(await getInfo(doc));
        raw_info.descr = data + '\n\n' + raw_info.descr;

        if (!location.href.match(/usercp.php\?action=persona/)){
            if (is_douban_needed && raw_info.descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)){
                raw_info.url = raw_info.descr.match(/http(s*):\/\/www.imdb.com\/title\/tt(\d+)/i)[0] + '/';
            }
            if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}纪录片/i)) {
                raw_info.type = '纪录';
            } else if (raw_info.descr.match(/类[\s\S]{0,5}别[\s\S]{0,30}动画/i)) {
                raw_info.type = '动漫';
            }
            set_jump_href(raw_info, 1);
            jump_str = dictToString(raw_info);
            douban_button.value = '获取成功';
            $('#textarea').val(data);
            GM_setClipboard(douban_info);
 
            tag_aa = forward_r.getElementsByClassName('forward_a');
            for (i = 0; i < tag_aa.length; i++) {
                if (['常用站点', 'PTgen', 'BUG反馈', '简化MI', '脚本设置', '单图转存', '转存PTP'].indexOf(tag_aa[i].textContent) < 0){
                    tag_aa[i].href = decodeURI(tag_aa[i]).split(seperator)[0] + seperator + encodeURI(jump_str);
                }
            }
        } else {
            $('textarea[name="douban_info"]').val(raw_info.descr);
            $('#go_ptgen').prop('value', '获取成功');
        };
    }
    infoGenClickEvent();
});