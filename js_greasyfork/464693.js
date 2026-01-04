// ==UserScript==
// @name         Letterboxd Enhancer 中文增强显示与搜索：集合啦！数字难民
// @namespace    http://tampermonkey.net/
// @version      0.5.10
// @connect        *
// @description  Letterboxd全局TMDB中文标题搜索 / 查询bt、字幕源是否存在 / 电影详情页增加显示：电影中文标题｜导演中文名｜中文简介｜演员头像列表（中日韩演员显示中文名）｜豆瓣ID图标｜IMDB电影宽高比、底片格式
// @thanks       Catspinner bimzcy Rhilip LeLobster
// @author       estost
// @match        https://letterboxd.com/film/*
// @match        https://letterboxd.com/*
// @match        https://letterboxd.com*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://letterboxd.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/464693/Letterboxd%20Enhancer%20%E4%B8%AD%E6%96%87%E5%A2%9E%E5%BC%BA%E6%98%BE%E7%A4%BA%E4%B8%8E%E6%90%9C%E7%B4%A2%EF%BC%9A%E9%9B%86%E5%90%88%E5%95%A6%EF%BC%81%E6%95%B0%E5%AD%97%E9%9A%BE%E6%B0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/464693/Letterboxd%20Enhancer%20%E4%B8%AD%E6%96%87%E5%A2%9E%E5%BC%BA%E6%98%BE%E7%A4%BA%E4%B8%8E%E6%90%9C%E7%B4%A2%EF%BC%9A%E9%9B%86%E5%90%88%E5%95%A6%EF%BC%81%E6%95%B0%E5%AD%97%E9%9A%BE%E6%B0%91.meta.js
// ==/UserScript==


// 设置横向滚动条的样式
GM_addStyle(`
  /* 滚动条整体样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 6px;
    background-color: #14181c;
  }
  /* 滑道样式 */
  ::-webkit-scrollbar-track:horizontal {
    background-color: #14181c;
  }
  /* 滑块样式 */
  ::-webkit-scrollbar-thumb:horizontal:hover {
    background-color: #242c34;
    border-radius: 5px;
\`);
`);

// 设置竖向滚动条的样式
GM_addStyle(`
  /* 滚动条整体样式 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #202830;
  }
  /* 滑道样式 */
  ::-webkit-scrollbar-track:vertical {
    background-color: #202830;
  }
  /* 滑块样式 */
  ::-webkit-scrollbar-thumb:vertical {
    background-color: #14181c;
    border-radius: 5px;
  }
`);


// 默认显示details菜单
var currentUrl = window.location.href;
if (currentUrl.startsWith('https://letterboxd.com/film/') && currentUrl.indexOf('/details') === -1
    && currentUrl.indexOf('/members/') === -1 && currentUrl.indexOf('/fans/') === -1
    && currentUrl.indexOf('/crew/') === -1 && currentUrl.indexOf('/genres/') === -1
    && currentUrl.indexOf('/crew/') === -1 && currentUrl.indexOf('/releases/') === -1
    && currentUrl.indexOf('/likes/') === -1 && currentUrl.indexOf('/reviews/') === -1
    && currentUrl.indexOf('/lists/') === -1 && currentUrl.indexOf('/activity/') === -1
    && currentUrl.indexOf('/similar/') === -1) {
    window.location.replace(currentUrl + 'details/');
}

var tmdb_api = GM_getValue('tmdb_api', 'default_api');

if (tmdb_api.length <= 30) {
    var api = prompt('请输入 TMDB API:');
    if (api !== null && api.length > 30) {
        GM_setValue('tmdb_api', api);
        tmdb_api = GM_getValue('tmdb_api', 'default_api');
        alert('TMDB API设置成功！');
    }
}

$(document).ready(function () {

    // 获取imdb/tmdb id/原始标题/电影年份
    var imdb_nb = '';

    try {
        imdb_nb = [...document.querySelectorAll(".micro-button")].find(a => a.href.includes("imdb")).href.split("/tt")[1].split("/")[0];
    } catch (error) {
        imdb_nb = null;
    }
    var imdb_id = 'tt' + imdb_nb
    var tmdb_id = [...document.querySelectorAll(".micro-button")].find(a => a.href.includes("themoviedb")).href.split(/\/(movie|tv)\//)[2].split("/")[0].split("/")[0];
    var imdb_link = `https://www.imdb.com/title/${imdb_id}/`
    var has_imdb_button = imdb_id.length > 0;
    // 从 Letterboxd 中已有的数组 filmData 中获取电影的标题和年份
    // var filmTitle01 = filmData['name']
    // filmTitle01 = filmTitle01.replace(/[\/\\#,+()$~%.":*?<>{}!&]/g, '');
    // var filmYear01 = filmData['releaseYear']
    var film_title = $('h1.headline-1.filmtitle span.name.js-widont.prettify').text().replace(/[\/\\#,‘’+()$~%.":*?<>{}!&]/g, '').replace(/\xa0/g, ' ');

    var film_year = $('div.releaseyear a[href*="films/year/"]').text();
    var originalTitle = $('#featured-film-header').not('#chi_title').find('em').text().replace(/[\/\\#,‘’+()$~%.":*?<>{}!&]/g, '');

    var film_language_a = $('div#tab-details span:contains("Language")').parent('h3').next('div').find('a');
    var film_Country_a = $('div#tab-details h3:contains("Country"), h3:contains("Countries")').next('div').find('a');
    var film_Country_first = film_Country_a.first().text();
    console.log(film_Country_first);

    var global_douban_title = "";
    var main_tmdb_zh_title = '';

    var cast_url = `https://api.themoviedb.org/3/movie/${tmdb_id}/credits?api_key=${tmdb_api}`


    console.log(`IMDB ID: ${imdb_id}`)
    console.log(`TMDB ID: ${tmdb_id}`)
    console.log(`英文标题: ${film_title}`)
    console.log(`原始标题: ${originalTitle}`)
    console.log(`电影年份: ${film_year}`)

    function hasJapanese(str) {
        var regExp = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\uFF65-\uFF9F]/g;
        return regExp.test(str);
    }

    function hasChinese(str) {
        var regExp = /[\u4E00-\u9FA5\u4E00-\u9FFF]/g;
        return regExp.test(str);
    }

    function getZhName(also_known_as) {

        // 判断是不是简体中文字符
        function isSimpChinese(char) {
            return /^[\u4E00-\u9FA5]+$/.test(char);
        }

        // 判断是不是繁体中文字符
        function isTradChinese(char) {
            return /^[\u4E00-\u9FFF]+$/.test(char);
        }

        // 判断是不是日文汉字
        function isJapaneseKanji(char) {
            return /^[\u4E00-\u9FFF\u3400-\u4DBF]+$/.test(char);
        }

        // 判断是不是日文平假名
        function isHiragana(char) {
            return /^[\u3040-\u309F]+$/.test(char);
        }

        // 判断是不是日文片假名
        function isKatakana(char) {
            return /^[\u30A0-\u30FF]+$/.test(char);
        }

        function isHangul(char) {
            const unicode = char.charCodeAt(0);
            return unicode >= 0xAC00 && unicode <= 0xD7AF;
        }

        const weights = {
            "汉": {"simp": 10, "trad": 8, "jap": 7},
            "ひらがな": {"jap": 2},
            "カタカナ": {"jap": -2},
            "kor": {"kor": -3}
        };

        let maxWeight = 0;
        let zhjaName = "";
        let minStrokeNames = []; // 记录权重相同且笔画最少的名字
        let minStrokeCount = Number.MAX_SAFE_INTEGER; // 记录当前权重相同名字中笔画最少的名字的笔画数

        let isAllNonChineseJapanese = true; // 新增变量，记录是否所有名字都不含汉字和平假名

        for (let i = 0; i < also_known_as.length; i++) {
            const name = also_known_as[i];
            let weight = 0;

            if (/（豆瓣）$/.test(name))
                return name.replace('（豆瓣）', '');

            let isNonChineseJapanese = true; // 新增变量，记录当前名字是否不含汉字和平假名

            for (let j = 0; j < name.length; j++) {
                let char = name[j];

                if (isSimpChinese(char)) {
                    weight += weights["汉"]["simp"] || 0;
                    isNonChineseJapanese = false;
                } else if (isTradChinese(char)) {
                    weight += weights["汉"]["trad"] || 0;
                    isNonChineseJapanese = false;
                } else if (isJapaneseKanji(char)) {
                    weight += weights["汉"]["jap"] || 0;
                    isNonChineseJapanese = false;
                } else if (isHiragana(char)) {
                    weight += weights["ひらがな"]["jap"] || 0;
                    isNonChineseJapanese = false;
                } else if (isKatakana(char)) {
                    weight += weights["カタカナ"]["jap"] || 0;
                    isNonChineseJapanese = false;
                } else if (isHangul(char)) {
                    weight += weights["kor"]["kor"] || 0;
                }
            }

            if (isNonChineseJapanese) {
                continue; // 如果当前名字不含汉字和平假名，则继续循环下一个名字
            } else {
                isAllNonChineseJapanese = false; // 反之，记录当前名字为包含汉字和平假名的名字
            }

            if (weight > maxWeight) {
                maxWeight = weight;
                zhjaName = name;
            }
        }

        if (isAllNonChineseJapanese) {
            return ""; // 如果所有名字都不含汉字和平假名，则返回 null
        }

        let return_name = zhjaName || '';
        return return_name.replace('（dorama.info）', '').replace('（旧芸名）', '').replace('（本名）', '');
    }


    $(document).ready(function () {
        $('#userpanel').css('margin-top', '-30px');
    });

    // 获取导演中文名
    function getDirectorAndAKA(tmdb_id) {
        return new Promise((resolve, reject) => {
            $.getJSON(`https://api.themoviedb.org/3/movie/${tmdb_id}/credits?api_key=${tmdb_api}`, function (data) {
                const crew = data.crew;
                let director = null;

                // 找到第一位导演信息
                for (let i = 0; i < crew.length; i++) {
                    if (crew[i].job === 'Director') {
                        director = crew[i];
                        break;
                    }
                }

                if (director !== null) {
                    // 获取导演的 AKA 信息
                    $.getJSON(`https://api.themoviedb.org/3/person/${director.id}?api_key=${tmdb_api}`,
                        function (data) {
                            console.log(`导演aka: ${data.also_known_as}`)
                            resolve(data.also_known_as);
                            // resolve(`${director.name} (${data.also_known_as.join(', ')})`);
                        });
                } else {
                    reject('未找到导演信息！');
                }
            });
        });
    };

    function getDoubanDirZh(dir_en_txt) {
        console.log("IMDb Scout Mod (getDoubanDirZh): Started.");
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: "GET",
                timeout: 10000,
                url: 'https://www.google.com/search?q="' + dir_en_txt + '" site:https://m.douban.com/movie/celebrity/',
                headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"},
                onload: function (response) {
                    const result = String(response.responseText);
                    console.log(`Google搜索豆瓣条目: ${result}`)

                    if (result.match("m.douban.com/movie/celebrity/")) {
                        const regex = /<a\s+[^>]*href="(https:\/\/m.douban.com\/movie\/celebrity\/[^"]+)"/;
                        resolve(result);
                    } else {
                        return
                        // const douban_id = "00000000";
                        // resolve(douban_id);
                    }
                },
                onerror: function () {
                    GM.notification("Request Error.", "IMDb Scout Mod (getDoubanDirZh)");
                    console.log("IMDb Scout Mod (getDoubanDirZh): Request Error.");
                    resolve("00000000");
                },
                onabort: function () {
                    console.log("IMDb Scout Mod (getDoubanDirZh): Request Aborted.");
                    resolve("00000000");
                },
                ontimeout: function () {
                    console.log("IMDb Scout Mod (getDoubanDirZh): Request Timeout.");
                    resolve("00000000");
                }
            });
        });
    }

    async function printDirectorAndAKA(tmdb_id) {
        try {
            const director_aka = await getDirectorAndAKA(tmdb_id);
            console.log(director_aka);

            var dir_en = $('#featured-film-header p').children('a:first').find('.prettify');
            var dir_en_txt = dir_en.text();

            var dir_zh_txt = getZhName(director_aka).replace(' ', '');

            if (!dir_zh_txt) {
                douban_data_dir = await getDoubanDirZh(dir_en_txt);
                console.log(`导演搜索html：：${douban_data_dir}`)

                const spanText = $(douban_data_dir).find("div.VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf span").text().trim().split('简介：')[0];

                // 包含中文和英文名字的正则表达式
                const nameRegex = /[\u4e00-\u9fa5a-zA-Z]+·[\u4e00-\u9fa5a-zA-Z]+/g;
                const matches = spanText.match(nameRegex);

                const fullName = matches[0];
                const cleanedName = fullName.replace(/[a-zA-Z-]/g, '');
                console.log(`豆瓣导演中文名：：${cleanedName}`);

                dir_zh_txt = `[${cleanedName}]`;
                if (dir_zh_txt.length > 15) {
                    dir_zh_txt = '';
                }


            }


            dir_en.css({'font-weight': '300'});
            var dir_en_txt = dir_en.text();
            dir_en.text(`${dir_zh_txt} ${dir_en_txt}`);

        } catch (error) {
            console.error(error);
        }
    };
    printDirectorAndAKA(tmdb_id);


    GM_addStyle(`
    #overview-content header {
    border-bottom: 1px solid #456;
    margin-bottom: 15px;
}
    #overview-content header ul {
    margin-bottom: -1px;
    overflow: hidden;
}
    #overview-content header ul li {
    float: left;
    font-size: 1rem;
    letter-spacing: .075em;
    line-height: 1;
    margin: 0 15px 0 0;
    text-transform: uppercase;
}
    #overview-content header ul li a {
    cursor: pointer;
    color: #00e054;
    display: block;
    padding: 0 0 5px;
}
    #overview-content header ul li.selected a {
    border-bottom: 1px solid #fff;
    color: #fff;
}
  `);

    // 重构tmdb/imdb ID 图标
    $(document).ready(function refactorTmdbImdbIcons() {

        // 给 时长 db 元素设置ID
        $('div#tabbed-content').next().attr('id', 'runtime_url');

        // 移除简介底部留白
        $('.truncate').children('p').css('margin-bottom', '0');

        // 将 时长 db 元素移动到电影标题下面
        let runtime_bd_url = $('p#runtime_url');
        let year_title_dir = $('section#featured-film-header');
        $('section#featured-film-header').css('margin-bottom', '0');
        $('span.block-flag-wrapper').css('top', '-2px').css('margin-left', '-8px');
        runtime_bd_url.insertAfter(year_title_dir);

        // 将类型放到detail中
        let genres = $('#tab-genres a[href*="/films/genre/"]').first().parent().parent();
        genres = genres.prop('outerHTML');
        if (genres) {
            $('#tab-details').prepend(`
        <h3><span>Genre</span></h3>
        ${genres}`);
        }

        // 删除tmdb按钮边框
        $('#runtime_url').find('[data-track-action="TMDb"]').attr('id', 'tmdb_button').css('border',
            'none').text(tmdb_id);

        // 创建tmdb图标
        $(document).ready(function () {
            const brandSpan = $('<span class="brand"><svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="margin: 0 4px -4.5px 4px;">' +
                '<defs><clipPath id="maskID1655656042540"><path d="M12,24 C2.372583,24 0,21.627417 0,12 C0,2.372583 2.372583,0 12,0 C21.627417,0 24,2.372583 24,12 C24,21.627417 21.627417,24 12,24 Z"></path></clipPath></defs><title></title><desc>Amazon</desc>' +
                '<image clip-path="url(#maskID1655656042540)" width="24" height="24" xlink:href="data:image/webp;base64,UklGRhwCAABXRUJQVlA4TBACAAAvH8AHAN/kKpJsV9k598VfCgdowL8EvOR479hwG0lW7MwC+7B+IsrfUSIKQvbN9dwGYNs2AGmnJ1M9pu75/4TkhE4C8x8n3UYQQTAylCACgRLkhF' +
                'mDQBFEEAwgBYIJBJtamGpqSgWZlEM55IEcCCEJHelbOuWoo4IotJ+FVVNzTrXb09LT9fXy/JWBmHZ+3h3q1uLUAmgNC5Y0wYIbIbRGCG5YaI0u1vLTz3rJ1kfrd4M1GCP5D87kSP6TMzmCIzmTMziSIzhTX1DvuY25voik3VNFwI0KcRMTC5YDztSuAjQkrZkysRYWbGBTmJhYhYhVCXEBGin0BoSIaMFGWvWGCChREIw0oiF' +
                'ARBSgnlK9ASFKFLFS0H8lQqBLFQLQRaAKATz2i2nMwfP/d3k87PeTlSkDJAEAy0hTj20ba9u2d8dY27Zt67nVdY5NRP8ngEiTQ7hSISfLpBIxAEAEMIRZ5m9tTXVVZUV5WWlJcVFhQX5ejpsJlPHz8nh3fX56uL+1ubo8Nz0xFo0MemAaVF3/8XR/e3lxfLS7s762tDA7NZ5Ihf4cMBUv++uVXTwVHHYiNFmfb+ySqeCIiwbS' +
                'NLyzS6RC/3aYCkCB7+eHm6uzk4O97Y2VxfmZydFYeMgHE/R8f11jU3NLa1t7R2dXd09vX/9ArldAMIVUWp2e4wzAaALAzFmsNiFCsIRoYVoibQw="></image><path d="M12,23.5 C21.2262746,23.5 23.5,21.2262746 23.5,12 C23.5,2.77372538 21.2262746,0.5 12,0.5 C2.77372538,0.5 0.5,2' +
                '.77372538 0.5,12 C0.5,21.2262746 2.77372538,23.5 12,23.5 Z" class="overlay" stroke-opacity="0.35" stroke="#000000" fill="rgba(0,0,0,0)"></path></svg></span>');
            $('#tmdb_button').before(brandSpan);
        });

        // 删除imdb按钮边框
        $('#runtime_url').find('[data-track-action="IMDb"]').attr('id', 'imdb_button').css('text-transform',
            'none').css('border', 'none').text(imdb_id);

        var new_href = "";

        // 移动imdb按钮
        $(document).ready(function () {
            // 获取 #imdb_button 元素
            const imdbButton = $('#imdb_button');
            // 从父元素中删除 #imdb_button 元素
            imdbButton.detach();
            // 将 #imdb_button 元素插入到 #tmdb_button 元素的后面
            imdbButton.insertAfter('#tmdb_button');
            new_href = imdbButton.attr("href").replace('http://', 'https://').replace('/maindetails', '/');
            imdbButton.attr("href", new_href);
        });

        // 创建imdb图标
        $(document).ready(function () {
            const brandSpan = $(`<span class="brand"><svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="margin: 0 4px -4.5px 4px;">
                <defs><clipPath id="maskID1655656042540"><path d="M12,24 C2.372583,24 0,21.627417 0,12 C0,2.372583 2.372583,0 12,0 C21.627417,0 24,2.372583 24,12 C24,21.627417 21.627417,24 12,24 Z"></path></clipPath></defs><title></title><desc>Amazon</desc>
                <image clip-path="url(#maskID1655656042540)" width="24" height="24" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAahJREFUWMNj+HpU4v9AYoZRB4w6YNQBow4YdQC6wKIm/v+u5mz/w1w5/h+aIwxmg3CiH+f
                /pzvE4HwQvrJaBIXvZsH2vyqJ5//nw+L/c8K5wGLdBbykOaAxg+c/AwPDfwlhpv9ruwXBbBDmZGf4f2SuMJwPwicWIviCvIxw9vI2gf9mOqxgdhLQ4VRxAAh35vHidMD2yYL/WZgh7AnFfHAHgEJudacAGH85Ik6eA9hYIQaDghQUEtgcsGuq0H8uDkYMB7CzIdQ3Z/KQ5wB1eWYwzQE0TEuRhSgHmGpDHBDjxfnf34EdzPa1
                YyfPAYYaLP8lRZjAbG9bdpJCIMmfE4xBbB9bMh1gBHSArSEbmA1K3bgcAIsemjgAlJhA7L4iXqwOqE3lgbMnliCiIBYYBaEuHJRFAcgBrdkQi9f3CmJ1AAwzMTH8PzpfGB4CrCwIucpEbsIOOLlI+P/0Kr7/Cxv5/99aLwpmr+4S+H9llQiY/Xi7GJgG4SfbReFsEJ4BxCD9IHPWdAuAxQ4DC7OpFXz/p5Tz/f9wUHy0Lhh1w
                KgDRh0w6oDB5wAAnyEaXz1l5ZIAAAAASUVORK5CYII="></image><path style="cursor: pointer;" d="M12,23.5 C21.2262746,23.5 23.5,21.2262746 23.5,12 C23.5,2.77372538 21.2262746,0.5 12,0.5 C2.77372538,0.5 0.5,2.77372538 0.5,12 C0.5,21.2262746 2.77372538,23.5 12,23.5 Z" class="ov
                erlay" stroke-opacity="0.35" stroke="#000000" fill="rgba(0,0,0,0)"></path></svg></span>`);
            $('#imdb_button').before(brandSpan);

            brandSpan.on('click', function (event) {
                // 创建临时文本区域
                var tempTextArea = $('<textarea>').val(new_href);
                // 将临时文本区域添加到页面中
                $('body').append(tempTextArea);
                // 选中文本
                tempTextArea.select();
                // 复制选中的文本
                document.execCommand('copy');
                // 从文档中移除临时文本区域
                tempTextArea.remove();
            });
        });
    });


    //////  查找tmdb中文信息并判断是否为tv电视剧  ///// 创建中文简介 ///// 创建演员列表 /////

    var tmdb_ori_title = '';
    var match_title = originalTitle || film_title;
    console.log(`要与tmdb标题匹配的标题：：${match_title}`)

    function tmdbapi_get_movie() {
        return new Promise(resolve => {
            $.getJSON(
                "https://api.themoviedb.org/3/movie/" + tmdb_id + "?api_key=" + tmdb_api + "&language=zh-CN",
                function (tmdb_zh_data) {
                    console.log(tmdb_zh_data);
                    let tmdb_zh_overview = tmdb_zh_data.overview;
                    let tmdb_zh_title = tmdb_zh_data.title;
                    let tmdb_ori_title = tmdb_zh_data.original_title.replace(/[\/\\#,‘’+()$~%.":*?<>{}!&]/g, '');

                    console.log(`tmdbapi用movie获取的标题：：${tmdb_ori_title}`)


                    const chineseRegex = /[\u4e00-\u9fa5]/;
                    if (!chineseRegex.test(tmdb_zh_title)) {
                        tmdb_zh_title = '';
                    }
                    console.log(tmdb_zh_data)
                    console.log(tmdb_zh_overview)
                    console.log(tmdb_zh_title)

                    if (tmdb_ori_title.match(match_title)) {
                        console.log('影片是movie条目')
                    }


                    resolve({tmdb_zh_overview, tmdb_zh_title, tmdb_ori_title});
                }
            ).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(`请求失败：${textStatus}, ${errorThrown}`);

                cast_url = `https://api.themoviedb.org/3/tv/${tmdb_id}/credits?api_key=${tmdb_api}`;
                $.getJSON(
                    "https://api.themoviedb.org/3/tv/" + tmdb_id + "?api_key=" + tmdb_api + "&language=zh-CN",
                    function (tmdb_zh_data) {
                        console.log(tmdb_zh_data);
                        let tmdb_zh_overview = tmdb_zh_data.overview;
                        let tmdb_zh_title = tmdb_zh_data.name;
                        let tmdb_ori_title = tmdb_zh_data.original_name.replace(/[\/\\#,‘’+()$~%.":*?<>{}!&]/g, '');

                        console.log(`tmdbapi用tv获取的标题：：${tmdb_ori_title}`)

                        const chineseRegex = /[\u4e00-\u9fa5]/;
                        if (!chineseRegex.test(tmdb_zh_title)) {
                            tmdb_zh_title = '';
                        }
                        console.log(tmdb_zh_data)
                        console.log(tmdb_zh_overview)
                        console.log(tmdb_zh_title)

                        if (tmdb_ori_title.match(match_title)) {
                            console.log('影片是tv条目')
                        }

                        resolve({tmdb_zh_overview, tmdb_zh_title, tmdb_ori_title});
                    }
                );

            });
        });
    }

    function tmdbapi_get_tv() {
        return new Promise(resolve => {
            $.getJSON(
                "https://api.themoviedb.org/3/tv/" + tmdb_id + "?api_key=" + tmdb_api + "&language=zh-CN",
                function (tmdb_tv_zh_data) {
                    console.log(tmdb_tv_zh_data);
                    let tmdb_zh_overview = tmdb_tv_zh_data.overview;
                    let tmdb_zh_title = tmdb_tv_zh_data.name;

                    const chineseRegex = /[\u4e00-\u9fa5]/;
                    if (!chineseRegex.test(tmdb_zh_title)) {
                        tmdb_zh_title = '';
                    }
                    console.log(tmdb_tv_zh_data)
                    console.log(tmdb_zh_overview)
                    console.log(tmdb_zh_title)

                    resolve({tmdb_zh_overview, tmdb_zh_title});
                }
            );
        });
    }

    // 创建tmdb中文简介栏
    function createTmdbZhOverview(tmdb_zh_overview) {
        var en_condenseable = $('div.review.body-text.-prose.-hero.prettify').find('div.condenseable');

        var tmdb_en_overview = '';
        var tmdb_en_overview_300 = '';
        var tmdb_zh_overview_140 = tmdb_zh_overview.substring(0, 140);
        console.log(tmdb_zh_overview_140);

        // 判断页面原英文简介是否折叠
        if (en_condenseable.length) {
            tmdb_en_overview = $('.truncate.condenseable').find('p').text().replace('×', '');
            console.log(tmdb_en_overview);
            tmdb_en_overview_300 = tmdb_en_overview.substring(0, 300);
            console.log(`原英文简介折叠了：${tmdb_en_overview_300}`);
        } else {
            const en_truncate = $('.review.body-text.-prose.-hero.prettify .truncate p');
            tmdb_en_overview_300 = en_truncate.text();
            console.log(`原英文简介没有折叠：${tmdb_en_overview_300}`)
        }

        // 创建选项卡和内容的HTML
        const tabbedContentHtml = `
        <div id="overview-content">
            <header>
                <ul class="tabs">
                    <li class="view-tab active selected" data-tab="tab-overview-en"><a>Overview</a></li>
                    <li class="view-tab" data-tab="tab-overview-zh"><a>剧情简介</a></li>
                </ul>
            </header>
            
            <div class="tab-content review body-text -prose -hero prettify" id="tab-overview-en" >
                <div class="ov-en-seable" style="display: none; width: 390px; opacity: 1;">
                    <p id="en_overview_fulltxt">${tmdb_en_overview}<span class="ov-en-condense-less" style="cursor:pointer;color: #def;white-space: nowrap;">×</span>
                    </p>
                </div>
                <div class="ov-en-sed" style="">
                   <p id="en_overview_truntxt">${tmdb_en_overview_300}</p>
                </div>
            </div>
            
            <div class="tab-content review body-text -prose -hero prettify" id="tab-overview-zh" style="display: none;">
                <div class="ov-zh-seable" style="display: none; width: 390px; opacity: 1;">
                    <p id="zh_overview_fulltxt">${tmdb_zh_overview}<span class="ov-zh-condense-less" style="cursor:pointer;color: #def;white-space: nowrap;">×</span>
                    </p>
                </div>
                <div class="ov-zh-sed" style="">
                   <p id="zh_overview_truntxt">${tmdb_zh_overview_140}</p>
                </div>
            </div>
            
        </div>
       
    `;
        $('.section.col-10.col-main section').hide();

        // 在＃tabbed-content div之前插入选项卡内容
        $('#tabbed-content').before(tabbedContentHtml);

        // 判断原英文简介是否折叠 并创建…more 按键
        if (en_condenseable.length) {
            $('#en_overview_truntxt').append(`<span class="ov-en-condense-more" 
            style="cursor:pointer; color: #def;white-space: nowrap;">…more</span>`);
        }

        // 判断tmdb中文简介长度是否大于140 并创建 …more 按键
        if ((tmdb_zh_overview.length > 140)) {
            $('#zh_overview_truntxt').append(`<span class="ov-zh-condense-more" 
            style="cursor:pointer; color: #def;white-space: nowrap;">…更多</span>`);
        }
        //  判断tagline是否存在 并新建
        const en_tagline = $('.review.body-text.-prose.-hero.prettify h4.tagline');

        if (en_tagline.length) {
            $('.ov-en-seable').prepend(en_tagline);
            $('.ov-en-sed').prepend(en_tagline);
        }

        function overviewPanelInteraction() {
            // 处理标签页点击
            $('.view-tab').click(function () {

                // 获取要显示的内容的ID
                const tabId = $(this).data('tab');
                // 隐藏所有内容块
                $('.tab-content').hide();
                // 显示所选的内容块
                $('#' + tabId).show();
                // 更新活动选项卡的样式
                $('.view-tab').removeClass('selected');
                $(this).addClass('selected');
            });

            // 显示更多英文简介
            $('.ov-en-condense-more').click(function () {

                $('.ov-en-sed').hide();
                $('.ov-en-seable').show();
            });
            // 隐藏更多英文简介
            $('.ov-en-condense-less').click(function () {

                $('.ov-en-seable').hide();
                $('.ov-en-sed').show();
            });

            // 显示更多中文简介
            $('.ov-zh-condense-more').click(function () {

                $('.ov-zh-sed').hide();
                $('.ov-zh-seable').show();
            });
            // 隐藏更多中文简介
            $('.ov-zh-condense-less').click(function () {

                $('.ov-zh-seable').hide();
                $('.ov-zh-sed').show();
            });
        };
        overviewPanelInteraction();

    }

    async function tmdbapi_get() {
        var get_movie_data = await tmdbapi_get_movie();
        var re_tmdb_zh_overview = get_movie_data.tmdb_zh_overview;
        var re_tmdb_zh_title = get_movie_data.tmdb_zh_title;
        var re_tmdb_ori_title = get_movie_data.tmdb_ori_title;

        if (!re_tmdb_ori_title.match(match_title)) {
            console.log('开始搜索tv条目')
            get_movie_data = await tmdbapi_get_tv();
            re_tmdb_zh_overview = get_movie_data.tmdb_zh_overview;
            re_tmdb_zh_title = get_movie_data.tmdb_zh_title;
            cast_url = `https://api.themoviedb.org/3/tv/${tmdb_id}/credits?api_key=${tmdb_api}`;
        }
        console.log(`tmabapi搜索到的简介：：${re_tmdb_zh_overview}`)
        console.log(`tmabapi搜索到的中文标题：${re_tmdb_zh_title}`)
        console.log(`tmabapi搜索到的原始标题：${re_tmdb_ori_title}`)

        main_tmdb_zh_title = re_tmdb_zh_title;

        createTmdbZhOverview(re_tmdb_zh_overview);

        ///// 从tmdb获取演员列表 /////
        window.onload = function () {

            // 获取页面原本的演员链接
            let actorLinks = $('.cast-list').find('a').filter(function () {
                return this.hasAttribute('href') && $(this).attr('href').indexOf('actor') !== -1;
            });

            let actorArray = actorLinks.map(function () {
                return $(this).attr('href');
            }).get();
            console.log(`tmdb演员列表: ${actorArray}`)


            GM_xmlhttpRequest({
                method: 'GET',
                url: cast_url,
                onload: response => {
                    const data = JSON.parse(response.responseText);

                    // 生成演职人员表格
                    const table = $('<table>').css({
                        'display': 'inline-block',
                        'white-space': 'nowrap'
                    });

                    const tbody = $('<tbody>').css({
                        'display': 'flex',
                        'flex-wrap': 'nowrap',
                        'padding': '0',
                        'margin': '0',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'height': '120px',
                        'overflow-x': 'auto',
                        'scroll-behavior': 'smooth'
                    });

                    async function getZhJaName(cast_order, cast_id) {
                        return new Promise((resolve, reject) => {
                            var zhja_name = '';

                            if (film_language_a.attr('href').indexOf('chinese') !== -1 || film_language_a.attr('href').indexOf('cantonese') !== -1 || film_language_a.attr('href').indexOf('korean') !== -1 || film_language_a.attr('href').indexOf('japanese') !== -1) {
                                console.log('电影是中日韩电影');
                                if (cast_order < 10) {
                                    $.getJSON("https://api.themoviedb.org/3/person/" + cast_id + "?api_key=" + tmdb_api + "&language=en-US", function (data) {
                                        console.log(data);
                                        var also_known_as = data.also_known_as;

                                        var zhja_name = getZhName(also_known_as);

                                        resolve(zhja_name);

                                    });
                                } else {
                                    resolve(zhja_name);
                                }
                            } else {
                                resolve(zhja_name);
                            }
                        });
                    };

                    data.cast.forEach(async item => {
                        const td = $('<td>').css({
                            'padding': '5px',
                            'width': '90px',
                            'text-align': 'center'
                        });

                        tbody.append(td);

                        console.log(JSON.stringify(item));

                        const cast_id = item.id;
                        const cast_order = item.order;
                        const cast_character = item.character;

                        let zhja_re = await getZhJaName(cast_order, cast_id);
                        let zhja_name = zhja_re.replace(' ', '');

                        console.log(`第 ${cast_order} 位演员的名字为：${zhja_name}`);


                        var castShowName = zhja_name ? zhja_name : item.name;

                        console.log(`castShowName: ${castShowName}`)


                        const name = $('<p class="tooltip">').text(castShowName).attr('title', cast_character).css({
                            'cursor': 'pointer',
                            'text-align': 'center',
                            'margin-top': '8px',
                            'font-size': '10px',
                            'text-overflow': 'ellipsis',
                            'white-space': 'nowrap',
                            'overflow': 'hidden',
                            'max-width': '100px'
                        });

                        const actorName = item.name
                            .normalize('NFD')                   // 将字符串中的带变音符号的字符转换为等效的基本字符和单独的变音符号
                            .replace(/\p{Diacritic}/gu, '')     // 删除所有的单独变音符号
                            .replace(/\s+/g, '-')             // 将剩余空格替换成短横线
                            .toLowerCase();                   // 全部小写

                        // 在原本的演员url数组中查找匹配的url
                        const actorUrl = actorArray.filter(function (item) {
                            return item.includes(actorName);
                        });


                        // 如果item.profile_path不存在，则根据gender判断应该使用什么图片链接
                        // 如果gender为1，使用female图片链接，否则使用默认值
                        // 如果gender为2，使用male图片链接，否则使用默认值
                        const gender = item.gender;
                        const imageUrl = (item.profile_path)
                            ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                            : (gender === 1)
                                ? 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-36-user-female-grey-d9222f16ec16a33ed5e2c9bbdca07a4c48db14008bbebbabced8f8ed1fa2ad59.svg'
                                : (gender === 2)
                                    ? 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                                    : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg';

                        const image = imageUrl
                            ? $('<a>').attr({
                                'href': actorUrl,
                                'target': '_blank'
                            }).append(
                                $('<img>').attr('src', imageUrl).css({
                                    'overflow': 'hidden',
                                    'width': '70px',
                                    'margin-top': '-5px',
                                    'filter': 'grayscale(100%)'
                                }))
                            : '';

                        const circleWrapper = $('<div>').css({
                            'width': '70px',
                            'height': '70px',
                            'border-radius': '50%',
                            'overflow': 'hidden',
                            'position': 'relative',
                            'margin': '0 10px',
                            'transition': 'transform 0.2s' // 添加动画效果
                        }).hover( // 鼠标悬停时放大circleWrapper和字标签
                            function () {
                                $(this).css({
                                    'transform': 'scale(1.1)'
                                }).find('p').css({
                                    'transform': 'scale(1.1)'
                                });
                            },
                            function () {
                                $(this).css({
                                    'transform': 'scale(1.0)'
                                }).find('p').css({
                                    'transform': 'scale(1.0)'
                                });
                            }
                        );

                        const imgWrapper = $('<div>').css({
                            'position': 'relative'
                        });

                        circleWrapper.append(image);
                        imgWrapper.append(circleWrapper).append(name);

                        td.append(imgWrapper);

                    });

                    table.append(tbody);

                    // 将表格插入到页面
                    let activityFriends = $('.activity-from-friends').find('.section-heading');
                    let activityMore = $('.activity-from-friends').find('.all-link');

                    let popularReview = $('#popular-reviews').find('.section-heading');
                    let reviewMore = $('#popular-reviews').find('.all-link');

                    let popularLists = $('#film-popular-lists').find('.section-heading');
                    let ListMore = $('#film-popular-lists').find('.all-link');

                    GM_addStyle(".moreytxtCss { position: static; float: right; color: #678 !important; }")


                    const castTableDiv = $('<div>').attr('id', 'cast-list-table').css('margin', '0 0 20px 0');

                    if (activityFriends.length > 0) {
                        activityFriends.before(castTableDiv);
                        activityMore.addClass("moreytxtCss").appendTo(activityFriends);
                        console.log('activityFriends 存在')
                    } else if (popularReview.length > 0) {
                        popularReview.before(castTableDiv);
                        reviewMore.addClass("moreytxtCss").appendTo(popularReview);
                        console.log('popularReview 存在')
                    } else if (popularLists.length > 0) {
                        popularLists.before(castTableDiv);
                        ListMore.addClass("moreytxtCss").appendTo(popularLists);
                        console.log('popularLists 存在')
                    }

                    castTableDiv.append($('<h3>').addClass('section-heading').text('Cast List'), $('<div>').css({'overflow-x': 'auto'}).append(table));

                },
                onerror: error => {
                    console.error(`构造演员列表失败 ${tmdb_id}: ${error}`);
                }
            });
        };
    }

    tmdbapi_get()

    //构建 imdb Technical 表格
    // 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
    function page_parser(responseText) {
        // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
        // responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
        // responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
        return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    function getDoc(url, meta, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText);
                    callback(doc, responseDetail, meta);
                }
            }
        });
    }

    function createTechnicalTable(imdb_link) {
        // 在tabbed-content上创建 technical_sp div
        $('div#tabbed-content').prepend(`
            <section id='loading_technical' style="border: none">Loading Technical...</section>
            <div class="tabbed-content-block column-block" style="display: inline-flex;margin: -15px 0 -5px 0;"
                 id="technical_sp"></div>
            `);

        // 构建要添加的元素
        let technical_multi_data = [ /** {name, link || `${imdb_link}`, text} */];

        // 创建imdb technical 标签
        function technical_specifications(data) {

            technical_multi_data.push(data);

            let technical_sp = $('#technical_sp');
            let technical_html = '';

            for (let i = 0; i < technical_multi_data.length; i++) {
                let technical_data = technical_multi_data[i];

                // 将 technical_data['data'] 字符串按照竖线分隔，并去重生成字符串数组
                let links = [...new Set(technical_data['data'].split('|'))]
                    .map((str, index) => {
                        // 如果字符串长度大于 14，且包含 8mm、16mm、35mm、65mm，则将其替换为其中的一个子串
                        if (str.length > 14 && /(8 mm|16 mm|35 mm|65 mm)/.test(str)) {
                            str = str.replace(/.*(8 mm|16 mm|35 mm|65 mm).*/, '$1');
                        }
                        // 生成链接 HTML 元素
                        let style = '';
                        if (index === 0) {
                            style = 'margin-left: 6.5em';
                        }
                        return `<a href="${technical_data['link']}" class="text-slug tooltip" style="margin: 0 0 6px 4.5px;${style}">${str.trim()}</a>`;
                    });

                technical_html += `
              <div style="padding-right: 2.5em;position: relative;">
                <h3 style="width: 8em;position: absolute;">
                  <span>${technical_data['name']}</span>
                </h3>
                <div class="text-sluglist" style="margin-left: 0;width: 14.5em;float: left;">
                  <p style="display: flex;flex-wrap: wrap;flex-direction: row-reverse;padding-left: 2em;">${links.join('')}</p>
                </div>
                <div style="content: '';display: block;clear: both;"></div>
              </div>
            `;
            }

            technical_sp.html(technical_html);
            technical_sp.show();
            $("#loading_technical").hide();

        }

        let technical_link = `${imdb_link}technical/?ref_=tt_spec_sm`

        if (has_imdb_button) {
            getDoc(technical_link, null, function (doc) {
                // 判断是不是新版界面
                let new_another = $('script#__NEXT_DATA__', doc);
                let is_new = new_another.length > 0;

                try {
                    // 从网页中获取的部分信息，要区分是否新版页面
                    if (is_new) {
                        if ($("li.ipc-metadata-list__item:contains('Aspect ratio')", doc).length > 0) {
                            technical_specifications({
                                name: 'Aspect',
                                link: imdb_link + 'technical/?ref_=tt_spec_sm',
                                data: $("li.ipc-metadata-list__item:contains('Aspect ratio')", doc).text().replace(/^Aspect ratio/, '')
                                    .replace(/\([^)]*\)/g, '').replace(/:\s*1/g, ': 1|').replace(' / ', '').replace(/\|([^|]*)$/, '$1')
                            });
                        }
                        if ($("li.ipc-metadata-list__item:contains('Negative Format')", doc).length > 0) {
                            technical_specifications({
                                name: 'Negative',
                                link: imdb_link + 'technical/?ref_=tt_spec_sm',
                                data: $("li.ipc-metadata-list__item:contains('Negative Format')", doc).text().replace(/^Negative Format/, '')
                                    .replace(/\([^)]*\)/g, '').replace(/ mm/g, " mm|").replace("Codex", "Codex|").replace("Video", "Video|")
                                    .replace("Redcode RAW", "Redcode|RAW|").replace("HDCAM", "HDCAM|").replace("Digital", "Digital|").replace(/\|([^|]*)$/, '$1')
                            });
                        }
                    } else { // 旧版代码
                        if ($("div.txt-block:contains('Aspect Ratio:')", doc).text().length > 0) {
                            technical_specifications({
                                name: 'Aspect',
                                link: imdb_link + 'technical?ref_=tt_dt_spec',
                                data: $("div.txt-block:contains('Aspect Ratio:')", doc).text().trim().replace(/\n/g, '').replace(/^Aspect Ratio:/, '')
                                    .replace(/\([^)]*\)/g, '').replace(/:\s*1/g, ': 1|').replace(/\|([^|]*)$/, '$1')

                            });
                        }
                        if ($("div.txt-block:contains('Negative Format:')", doc).text().length > 0) {
                            technical_specifications({
                                name: 'Negative',
                                link: imdb_link + 'technical?ref_=tt_dt_spec',
                                data: $("div.txt-block:contains('Negative Format:')", doc).text().trim().replace(/\n/g, '').replace(/^Negative Format:/, '')
                                    .replace(/\([^)]*\)/g, '').replace(/ mm/g, " mm|").replace("Codex", "Codex|").replace("Video", "Video|")
                                    .replace("Redcode RAW", "Redcode|RAW|").replace("HDCAM", "HDCAM|").replace(/\|([^|]*)$/, '$1')
                            });
                        }
                    }
                } catch (e) {
                    // throw e;
                }
                ;
            });

        }

        // 超时隐藏 loading technical
        setTimeout(function () {
            // 检查 #technical_sp 元素下是否有 a 标签
            if (!document.querySelector("#technical_sp a")) {
                $("#loading_technical").hide();
            }
        }, 5000);
    };

    createTechnicalTable(imdb_link);

    // 折叠aka title
    function akaTtitleFold() {

        const aka_title = $('#tab-details .text-indentedlist');
        const alternative_title = aka_title.find('p').text().replace(/\s{2,}/g, '');
        console.log(`aka标题：${alternative_title}`)
        const alternative_title_30 = alternative_title.substring(0, 60);
        const alternativeTitleFold = `
            <div>
                <div class="aka-title-seable" style="display: none;">
                    <p>${alternative_title}<span class="aka-title-less" style="cursor:pointer;color: #def;white-space: nowrap;">×</span></p>
                </div>
                <div class="aka-title-sed" style="">
                   <p>${alternative_title_30}<span class="aka-title-more" style="cursor:pointer; color: #def;white-space: nowrap;">…</span></p>
                </div>
            </div>
    `;

        // 判断页面原英文简介是否折叠
        if (alternative_title.length > 60) {

            aka_title.find('p').hide();
            aka_title.append(alternativeTitleFold);

            $('.aka-title-more').click(function () {
                $('.aka-title-sed').hide();
                $('.aka-title-seable').show();
            });
            $('.aka-title-less').click(function () {
                $('.aka-title-seable').hide();
                $('.aka-title-sed').show();
            });
        }
    }

    akaTtitleFold();


    ////// 豆瓣相关操作 豆瓣ID图标 豆瓣中文标题 bt/字幕 搜索栏 /////

    $(document).ready(function createDoubanASO() {
        // 查找豆瓣id方法
        function getDoubanID0(movie_id) {
            return new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: "GET",
                    timeout: 6000,
                    url: "https://movie.douban.com/j/subject_suggest?q=tt" + movie_id,
                    headers: {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0"},
                    onload: function (response) {
                        const data = JSON.parse(response.responseText)[0];
                        if (String(response.responseText).match(movie_id)) {
                            const douban_id = data.id;
                            resolve(data);
                        } else {
                            const douban_id = "00000000";
                            resolve("00000000");

                        }
                    },
                    onerror: function () {
                        GM.notification("Request Error.", "IMDb Scout Mod (getDoubanID0)");
                        console.log("IMDb Scout Mod (getDoubanID0): Request Error.");
                        resolve("00000000");
                    },
                    onabort: function () {
                        console.log("IMDb Scout Mod (getDoubanID0): Request Aborted.");
                        resolve("00000000");
                    },
                    ontimeout: function () {
                        console.log("IMDb Scout Mod (getDoubanID0): Request Timeout.");
                        resolve("00000000");
                    }
                });
            });
        }

        function getDoubanID1(movie_id) {
            console.log("IMDb Scout Mod (getDoubanID1): Started.");
            return new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: "GET",
                    timeout: 8000,
                    url: "https://www.douban.com/search?cat=1002&q=tt" + movie_id,
                    headers: {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0"},
                    onload: function (response) {
                        const parser = new DOMParser();
                        const result = parser.parseFromString(response.responseText, "text/html");
                        if ($(result).find('[onclick*=' + movie_id + ']').length) {
                            // 获取 href 属性值
                            const x = $(result).find('[onclick*=' + movie_id + ']').attr('href');
                            // 获取 a 标签的文本内容
                            const a = $(result).find('[onclick*=' + movie_id + ']').text();
                            if (x.match(/subject%2F(\d+)/)) {
                                const y = x.match(/subject%2F(\d+)/)[1];
                                const z = a + '|' + y
                                console.log(z)
                                resolve(z);
                            } else {
                                resolve("00000000");
                            }
                        } else {
                            resolve("00000000");
                        }
                    },
                    onerror: function () {
                        GM.notification("Request Error.", "IMDb Scout Mod (getDoubanID1)");
                        console.log("IMDb Scout Mod (getDoubanID1): Request Error.");
                        resolve("00000000");
                    },
                    onabort: function () {
                        console.log("IMDb Scout Mod (getDoubanID1): Request Aborted.");
                        resolve("00000000");
                    },
                    ontimeout: function () {
                        console.log("IMDb Scout Mod (getDoubanID1): Request Timeout.");
                        resolve("00000000");
                    }
                });
            });
        }

        function getDoubanID2(movie_id) {
            console.log("IMDb Scout Mod (getDoubanID2): Started.");
            return new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: "GET",
                    timeout: 8000,
                    url: 'https://query.wikidata.org/sparql?format=json&query=SELECT * WHERE {?s wdt:P345 "tt' + movie_id + '". OPTIONAL { ?s wdt:P4529 ?Douban_film_ID. }}',
                    headers: {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0"},
                    onload: function (response) {
                        const result = JSON.parse(response.responseText);
                        if (result.results.bindings[0] != undefined) {
                            if (result.results.bindings[0].Douban_film_ID != undefined) {
                                const douban_id = result.results.bindings[0].Douban_film_ID.value;
                                resolve(douban_id);
                            } else {
                                resolve("00000000");
                            }
                        } else {
                            const douban_id = "00000000";
                            resolve(douban_id);
                        }
                    },
                    onerror: function () {
                        GM.notification("Request Error.", "IMDb Scout Mod (getDoubanID2)");
                        console.log("IMDb Scout Mod (getDoubanID2): Request Error.");
                        resolve("00000000");
                    },
                    onabort: function () {
                        console.log("IMDb Scout Mod (getDoubanID2): Request Aborted.");
                        resolve("00000000");
                    },
                    ontimeout: function () {
                        console.log("IMDb Scout Mod (getDoubanID2): Request Timeout.");
                        resolve("00000000");
                    }
                });
            });
        }

        function getDoubanID3(movie_id) {
            console.log("IMDb Scout Mod (getDoubanID3): Started.");
            let searchTitle = originalTitle || film_title;
            console.log(`搜索标题：${searchTitle}`)
            return new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: "GET",
                    timeout: 10000,
                    url: 'https://www.google.com/search?q="' + searchTitle + ' ' + film_year + '" site:https://movie.douban.com/subject/',
                    //url: 'https://search.douban.com/movie/subject_search?search_text=' + searchTitle + '+' + film_year + '&cat=1002',
                    headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"},
                    onload: function (response) {
                        let result = String(response.responseText);

                        if (!originalTitle && !result.match(film_year)) {
                            result = '未找到符合';
                        }

                        if (result.match('未找到符合')) {
                            result = '未找到符合';
                        }

                        if (result.match('的片单 - 豆瓣电影')) {
                            result = '未找到符合';
                        }

                        console.log(`Google搜索豆瓣条目3: ${result}`)

                        //movie.douban.com/subject/
                        //m.douban.com/movie/subject/
                        if (result.match("movie.douban.com/subject/")) {
                            const regex = /<a\s+[^>]*href="(https:\/\/movie.douban.com\/subject\/[^"]+)"/;
                            const match = result.match(regex);
                            const href = match ? match[1] : null; // 获取匹配到的 href 属性值
                            const x = href.split("movie.douban.com/subject/")[1];
                            const y = x.split("/")[0];
                            const douban_id = y;
                            resolve({douban_id, result});
                        } else {
                            const douban_id = "00000000";
                            resolve({douban_id, result});
                        }
                    },
                    onerror: function () {
                        GM.notification("Request Error.", "IMDb Scout Mod (getDoubanID3)");
                        console.log("IMDb Scout Mod (getDoubanID3): Request Error.");
                        resolve("00000000");
                    },
                    onabort: function () {
                        console.log("IMDb Scout Mod (getDoubanID3): Request Aborted.");
                        resolve("00000000");
                    },
                    ontimeout: function () {
                        console.log("IMDb Scout Mod (getDoubanID3): Request Timeout.");
                        resolve("00000000");
                    }
                });
            });
        }

        function getDoubanID4(movie_id) {
            console.log("IMDb Scout Mod (getDoubanID4): Started.");
            let searchTitle = originalTitle || film_title;
            console.log(`搜索标题：${searchTitle}`)
            return new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: "GET",
                    timeout: 10000,
                    url: 'https://www.google.com/search?q="' + searchTitle + ' ' + film_year + '" site:https://m.douban.com/movie/subject/',
                    //url: 'https://search.douban.com/movie/subject_search?search_text=' + searchTitle + '+' + film_year + '&cat=1002',
                    headers: {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"},
                    onload: function (response) {
                        let result = String(response.responseText);

                        if (!originalTitle && !result.match(film_year)) {
                            result = '未找到符合';
                        }

                        if (result.match('未找到符合')) {
                            result = '未找到符合';
                        }

                        if (result.match('的片单 - 豆瓣电影')) {
                            result = '未找到符合';
                        }

                        console.log(`Google搜索豆瓣条目4: ${result}`)

                        //movie.douban.com/subject/
                        //m.douban.com/movie/subject/
                        if (result.match("m.douban.com/movie/subject/")) {
                            const regex = /<a\s+[^>]*href="(https:\/\/m.douban.com\/movie\/subject\/[^"]+)"/;
                            const match = result.match(regex);
                            const href = match ? match[1] : null; // 获取匹配到的 href 属性值
                            const x = href.split("m.douban.com/movie/subject/")[1];
                            const y = x.split("/")[0];
                            const douban_id = y;
                            resolve({douban_id, result});
                        } else {
                            const douban_id = "00000000";
                            resolve(result);
                        }
                    },
                    onerror: function () {
                        GM.notification("Request Error.", "IMDb Scout Mod (getDoubanID4)");
                        console.log("IMDb Scout Mod (getDoubanID4): Request Error.");
                        resolve("00000000");
                    },
                    onabort: function () {
                        console.log("IMDb Scout Mod (getDoubanID4): Request Aborted.");
                        resolve("00000000");
                    },
                    ontimeout: function () {
                        console.log("IMDb Scout Mod (getDoubanID4): Request Timeout.");
                        resolve("00000000");
                    }
                });
            });
        }

        // 创建豆瓣按钮
        function createDoubanButton(douban_url, douban_id) {
            // 创建豆瓣id按钮
            const doubanButton = $(`<a href="${douban_url}" class="micro-button track-event" style="border: none" data-track-action="Douban" id="douban_button">${douban_id}</a>`);

            if ($('#imdb_button').length > 0) {   // 如果存在#imdb_button，则在它后面插入doubanButton
                $('#imdb_button').after(doubanButton);
            } else {   // 否则在#tmdb_button后面插入doubanButton
                $('#tmdb_button').after(doubanButton);
            }

            // 创建豆瓣图标
            const brandSpan = $('<span class="brand"><svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="margin: 0 4px -4.5px 4px;">' +
                '<defs><clipPath id="maskID1655656042540"><path d="M12,24 C2.372583,24 0,21.627417 0,12 C0,2.372583 2.372583,0 12,0 C21.627417,0 24,2.372583 24,12 C24,21.627417 21.627417,24 12,24 Z"></path></clipPath></defs><title></title><desc>Amazon</desc>' +
                '<image clip-path="url(#maskID1655656042540)" width="24" height="24" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABhElEQVRYhe2Wv0tCURTHPz600EVe8AYTKUHUodDZQSGMksYamrOhrfG15ZhjW0v' +
                'NDTY0RAbW4F+QGJLiUPjrgVD4F9ik+St9mnUd/E7v3nvO+X645zzeM6DKEeASsPG/qgFRA6pcFWDehpAEmgPYJIHmABh7N97UDCuy40/M3j9LrMZ9XXvCb0A4gAFVbooEEH4DfUPY0vNxGp9tbSommdoL/vPgwLPZvYFO5etFrjM3YxXe9+3iUVzTAXitF4il4mMB+JfXdQEIb8EcQNcMeBU3sbA6VmGv4p4egEdxcTomgF4J' +
                'b8HIb0HyIMGWewOAUqNC8GJnaMH00R0Oqx2Ah8IT21d7Q+NHtiCRvW0DOKx2Fo0L5OvFgbEexdU2b+WO0sgWJAuPXeuIZ/PH2N6z3tyJAMqNKlkt12ESHgLwfZbVcpQb1d8DANznU+3nkDOAxWTui7GYzIScgYE5w9Q3hM2zD12Jk8pwstS1Fv4aCgeY/xPOBEBNoL8mIXEIaALMK0hEvwAFElrDSCjZkwAAAABJRU5ErkJgg' +
                'g=="></image><path d="M12,23.5 C21.2262746,23.5 23.5,21.2262746 23.5,12 C23.5,2.77372538 21.2262746,0.5 12,0.5 C2.77372538,0.5 0.5,2.77372538 0.5,12 C0.5,21.2262746 2.77372538,23.5 12,23.5 Z" class="overlay" stroke-opacity="0.35" stroke="#00' +
                '0000" fill="rgba(0,0,0,0)"></path></svg></span>');
            $('#douban_button').before(brandSpan);
        }

        // 判断是否华语电影并添加标题
        function addDoubanTitle(tmdb_zh_title, douban_title) {

            if (tmdb_zh_title) {
                douban_title = tmdb_zh_title;
            } else if (hasJapanese(douban_title)) {
                douban_title = "";
            } else if (!hasChinese(douban_title)) {
                douban_title = "";
            } else if (douban_title) {
                douban_title = `[${douban_title}]`;
            }

            // 如果 a 元素的 href 属性不包含 'chinese'，则执行指定步骤
            if (film_language_a.attr('href').indexOf('chinese') === -1 && film_language_a.attr('href').indexOf('cantonese') === -1) {
                if (film_language_a.attr('href').indexOf('japanese') === -1) {
                    $('section#featured-film-header').find("small").after(`<em id="chi_title" style="margin-left: 4px"></em>`);
                    $("#chi_title").text(douban_title)
                    console.log('电影不是华语/日语电影 添加中文标题')
                } else if (hasJapanese(originalTitle)) {
                    $('section#featured-film-header').find("small").after(`<em id="chi_title" style="margin-left: 4px"></em>`);
                    $("#chi_title").text(douban_title)
                    console.log('电影含假名 添加中文标题')
                } else if (!originalTitle) {
                    $('section#featured-film-header').find("small").after(`<em id="chi_title" style="margin-left: 4px"></em>`);
                    $("#chi_title").text(douban_title)
                    console.log('电影含英文 添加中文标题')
                } else {
                    console.log('电影是汉字标题 不添加中文标题')
                }
            } else {
                console.log('电影是华语电影 不添加中文标题')
            }
        }

        // 创建 bt 字幕 搜索栏
        function searchBars(imdb_nb, douban_id, film_title, film_year) {

            // 判断imdb豆瓣id是否存在
            if (!imdb_nb) {
                imdb_nb = film_title;
                let notimdbnb = 'imdb_id 不存在';
                console.log(notimdbnb)
            }
            if (!douban_id) {
                douban_id = film_title;
                let notdoubanid = 'douban_id 不存在';
                console.log(notdoubanid)
            }

            GM_addStyle(`
  .search-bar-btsub > .service.missing > .atag-btsub > .site-img {
    filter: grayscale(100%) brightness(50%);
  }
  .search-bar-btsub > .service.error > .atag-btsub> .site-img {
    filter: grayscale(100%) brightness(50%);
  }
  .search-bar-btsub > .service.logged_out > .atag-btsub> .site-img {
    filter: grayscale(100%) brightness(50%);
  }
`);

            // 内部使用的状态值
            const valid_states = [
                'found',
                'missing',
                'logged_out',
                'error'
            ];

            // 替换搜索URL中的占位符
            function replaceSearchUrlParams(site, imdb_nb, douban_id, film_title, film_year) {
                var search_url = site['searchUrl'];
                var s = search_url.replace(/%tt%/g, 'tt' + imdb_nb)
                    .replace(/%nott%/g, imdb_nb)
                    .replace(/%doubanId%/g, douban_id)
                    .replace(/%s_title%/g, film_title)
                    .replace(/%db_title%/g, global_douban_title)
                    .replace(/%s_year%/g, film_year)
                    .replace(/---/g, '-');
                console.log(`替换后的搜索url：${s}`)
                return s;
            }

            // 检查是否添加链接到某个站点
            async function maybeAddLink(elem, site_name, search_url, site, movie_id) {
                console.log('Testing... ', site_name)

                // 对每个站点进行连接速率限制
                var set_rate = ('rateLimit' in site) ? site['rateLimit'] : 200;
                var rate = set_rate
                var domain = search_url.split('/')[2];
                var now = (new Date()) * 1;
                var lastLoaded = window.localStorage[domain + '_lastLoaded'];
                if (!lastLoaded) {
                    lastLoaded = now - 50000;
                } else {
                    lastLoaded = parseInt(lastLoaded);
                }
                // 如果在限制之内，则延迟请求
                if (now - lastLoaded < rate) {
                    window.setTimeout(maybeAddLink.bind(undefined, elem, site['name'], search_url, site, movie_id), rate);
                    return;
                } else {
                    window.localStorage[domain + '_lastLoaded'] = (new Date()) * 1;
                }

                var success_match = ('positiveMatch' in site) ? site['positiveMatch'] : false;
                var target = search_url;
                if ('goToUrl' in site) {
                    target = await replaceSearchUrlParams({
                        'searchUrl': site['goToUrl'],
                        'spaceEncode': ('spaceEncode' in site) ? site['spaceEncode'] : '+'
                    }, movie_id);
                }
                // 检查tmdb/tvdb转换
                if (search_url.indexOf('=00000000') > -1 || search_url.indexOf('=undefined') > -1) {
                    addLink(elem, site_name, target, site, 'error');
                    return;
                }

                // 请求头
                let reqHeader = {};

                // 使用GET方法检查结果
                GM.xmlHttpRequest({
                    method: 'GET',
                    headers: reqHeader,
                    timeout: 30000,
                    url: search_url,
                    onload: function (response) {
                        // 判断是否登出、404或空白响应等情况，并按照不同状态添加链接
                        if (response.responseHeaders.indexOf('efresh: 0; url') > -1 || response.status > 499 || (response.status > 399 && !site.ignore404) || (response.responseText == "" && !site.ignoreEmpty)) {
                            addLink(elem, site_name, target, site, 'logged_out');
                        } else if (site['positiveMatch'] && site['loggedOutRegex'] && String(response.responseText).match(site['loggedOutRegex'])) {
                            addLink(elem, site_name, target, site, 'logged_out');
                        } else if (String(response.responseText).match(site['matchRegex']) ? !(success_match) : success_match) {
                            addLink(elem, site_name, target, site, 'missing');
                        } else if (site['loggedOutRegex'] && String(response.responseText).match(site['loggedOutRegex'])) {
                            addLink(elem, site_name, target, site, 'logged_out');
                        } else {
                            addLink(elem, site_name, target, site, 'found');
                        }
                    },
                    onerror: function () {
                        addLink(elem, site_name, target, site, 'error');
                        console.log("Letterboxd Scout Mod (GET-Request Error. Site): " + site_name);
                    },
                    onabort: function () {
                        addLink(elem, site_name, target, site, 'error');
                        console.log("Letterboxd Scout Mod (GET-Request aborted. Site): " + site_name);
                    },
                    ontimeout: function () {
                        addLink(elem, site_name, target, site, 'error');
                        console.log("Letterboxd Scout Mod (GET-Request timed out. Site): " + site_name);
                    }
                });
                return elem
            }

            // 添加链接到DOM中
            function addLink(elem, site_name, target, site, state) {
                // 状态值应该是valid_states数组中定义的值
                if (!valid_states.includes(state)) {
                    console.log("Unknown state: " + state);
                }
                elem.classList.add(state)
            }

            // 站点列表
            const sites = [
                {
                    'name': 'BT4G',
                    'icon': 'data:image/webp;base64,UklGRvQCAABXRUJQVlA4TOgCAAAvH8AHEEfFqG0kSTV78Se1IHZxzOuqkrq6OTBu20aSZq/+m9oiduuYVzJjMW7bRpJmr/6b2iJ265hXMmMxqm1byfkfhi8GATwGQ7cOlPJiBHBX2LZtk+7NvgFA+gNewA84ADPAli5tjBCQA8xRFUkpCbAwESlSAItUpNTEBI/WWjBh7w0TRhVFIWXvDROkuA5GPmdFuSlGGdXGmJ7ncfqcVnFJF6nETYmw92Z2s9YC8DIxmJAUe2+krLWQ4nP+RaCs3XuTPdkeupB4/vu+bnYHgOb//7zP2b7vW0sdgwTbtk07+rZ/bBRj27Zt23bybdu/XN0M323CuRH9V+RIStTsoN7wESSAv9MzMVQyoWAancMiAQDjT83K/OdYAY+MImwGCX52TFkde7NluVw0JbGko9u+wPFWW2W8gI9ygMXJ0Pqi/t2N6/POmkKUA5xfOZaQz7qxfHUx0FZRxCeGvrqjxOtzY8NNDe2dAx1iYmhHpwrZ0tRIf3FRS0d3s4gYikKpVsmuBxvjcH1DsohJDDyjw7KrzgqBsAaEZBQ5vPS614dTBUxeIWAktg8C3oXeJB4Z5wEa1d0u3+ZEaS4Xmbw6m2d/oa6YjwzOvtHJbxcGpchAyqlcp1wfTZbkggRNY6f2Pe7tydJcCeQCFwVJ74I3sL/YWhkfm4/WYkq+28LKp/vzztoyNAAyNC6DHj9O9BajjsU9866gXvV4nIU6FlT0mtwGPdzlZBXkxwqYCGNB6ti2O4L994c1ZbUVApRU1Dxm8UUjRllXQ0ttohAEfCyBt1tAfZOK0se2fT8iAdlZQ3ltPdQUlgziklzu6/q9T0e1No9b99DXOjCIB6BjDXDNp9T4BPq7CyJpxrfxdZnOYZc/YLnd5QOX7fZ88z/n4yeHTm5M5oc7eLS7wGkz3Tzzj/URTJEkJS3zS1U9NDQ149qvmWmp8b9JbDKRcHPz3kgufrPXwCBW3jt59y8AsDh0GgVh4d7+KwA=',
                    'searchUrl': 'https://bt4gprx.com/search?q=%s_title% %s_year%&orderby=size&p=1',
                    'loggedOutRegex': /Cloudflare|Ray ID/,
                    'ignore404': true,
                    'spaceEncode': ' ',
                    'matchRegex': /did not match any/
                },
                {
                    'name': 'RuT',
                    'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAB+UExURUxpcewYPjVL7jJO6+MfRCOQpDhD8wDNY7EzdTdN6OcbPuQeROYeQQDOYzVN6dooQQDWXwDSXQXVXwDQYTZN6gDPY+MfRADOYgDRZOccQgDXXiFe7jdN6OgdPukaQwDNYwDTZTdN6QDNYzdN6PsLOBpU/+MfRDdN6ADNY+MfRFL0/qQAAAAndFJOUwA/hEv9BSv9A/wr7b3svhWZFC7IqtzUtIWsSRnra435d3Jj0VJohJbObYsAAAGvSURBVDjLfVOLkoIwEFughVKegqg8FHycbf//B2+3Leo5eqvM4CQm2VAAPowQ8N8IOOb/4wEzEsR3vNoZc/xMEDggesNM/11B5oibrHpnCJC7PO/7HSOcmdPfVTi31ggZZnFK8bYuhkeQYDvM5MELfFlQBe7GwVmeWaHsFHgDqPV+gyLeJBhl5rww60rQxQUbNBQxj9PoxuhuJ1eFg5617hZpQx5/0mnEMth9DcFh0Uky61ZaB1kqVVYZCx5bkEKCnzqgLdBBpSqUgS1WOMLeEoYT7RmEihjb8dkSNIlGvENZlt2gRJg45RYnJJy33sH0t2oZSEHZi4To/4TjFE3VHLqkjh2o0jRVJQcYCocjo0OnRDehZyg1xUALzJ5AMBK6zXY1iNDg0haEOJyuWe/51eW8ukOxGQ4PF0uhGFYgRAH6ImfvIT13bdvWsdvj7FA8LuCrKpbNGOP4KkJPsF2RfNEAnNeANsPLUBkDMiMq0XPSGJ4P9KJ1DXg0I1tQOk2vIWzOpKNDZRWm88h5HF5V+Xr4D2RABFX6Bymi6MOLF6lQkBUI/ob53zx+vg508wvG0Dc0OR2vqAAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==',
                    'searchUrl': 'https://rutracker.org/forum/tracker.php?f=100,101,103,1105,1114,1213,1235,124,1247,1278,1280,1281,1327,1363,1389,1391,140,1453,1457,1467,1468,1469,1475,1543,1576,1577,1666,1670,187,1900,1908,1936,194,1950,2076,208,2082,209,2090,2091,2092,2093,2107,2109,2110,2112,212,2123,2139,2159,2160,2163,2164,2166,2168,2169,2176,2177,2178,2198,2199,22,2200,2201,2220,2221,2258,2323,2339,2343,2365,2380,2459,249,2491,251,2535,2538,2540,294,312,313,33,352,376,4,484,500,505,511,521,539,549,552,56,572,599,656,671,672,7,709,752,821,822,851,863,876,877,893,905,921,93,930,934,941,97,979,98&nm=%s_title%',
                    'loggedOutRegex': /Введите ваше имя/,
                    'matchRegex': 'Не найдено'
                },
                {
                    'name': '1337x',
                    'icon': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3' +
                        'd3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPjEzMzd4PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTEiIHBvaW50cz0iMCAwIDEyOCAwIDEy' +
                        'OCAxMjggMCAxMjgiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IjEzMzd4Ij4KICAgIC' +
                        'AgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICA8ZyBpZD0iMTAyNOW5s+a7keWchuinkuefqeW9' +
                        'ouiSmeeJiCI+PC9nPgogICAgICAgICAgICA8ZyBpZD0ibG9nbyIgbWFzaz0idXJsKCNtYXNrLTIpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4yODcwMDAsIC0wLjEyMDAwMCkiIGlkPSLot6' +
                        '/lvoQiPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9IiNGRjkwMTAiIHBvaW50cz0iNS4zMzM1MDMzNiAwLjE5ODA0NTIwOSA0NS44MDYxMDIgMC4xOTgwNDUyMDkgNjUuMTg5NTMwNCAzOC44NDEwMTI5IDg1LjkyNzc1ODUgMC4xOTgwNDUyMDkg' +
                        'MTI1LjAzNzM5NiAwLjE5ODA0NTIwOSA5NC4wODkyMDIgNjIuNTg3MTE2NSAxMjggMTI3Ljk0MjAzNiA4NC45MDc1NzggMTI4IDY0Ljc1Njk3MzkgODkuNTgxNjQ0NiA0NS40NjMzMjEzIDEyOCAwIDEyNy44ODY0ODYgMzcuOTc5Mjc3NiA2Mi41MDAxNjk4Ij48L3' +
                        'BvbHlnb24+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI2LjUwMDIwNzIsODIuMjE1MzI4OSBDMjYuNTAwMjA3Miw4Mi4yMTUzMjg5IDY0LjY1NDk1NTgsNzguODk0NDQ4OCAxMDAuNTI4NTgxLDQ5LjYxMDMyNDkgTDEyNS4wNDU1NTcsMC4yMDUyOTA3' +
                        'NjYgTDg1LjkyNzc1ODUsMC4yMDA0NjAzOTUgTDY1LjIwNTg1MzMsMzguMjI3NTU1OCBMNDUuODg3NzE2NCwwIEw1LjI3MjI5MjU0LDAgTDM3Ljc5MTU2NDQsNjIuMTkxMDI2MSBMMjYuNTAwMjA3Miw4Mi4yMTUzMjg5IFoiIGZpbGw9IiNGRjlEMkIiPjwvcGF0aD' +
                        '4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
                    'searchUrl': 'https://1337x.to/category-search/%s_title%+%s_year%/Movies/1/',
                    'matchRegex': /No results were returned/
                },
                {
                    'name': 'Blu-ray',
                    'icon': 'data:image/webp;base64,UklGRooBAABXRUJQVlA4TH0BAAAvH8AHEIfCoG0jSekuf7p77zQ0HDeSpEhV+1z/vWQ+aEi0bduG7tj/740YRZIUKTme+BeABWRgBAn3biCk/0xHIUDmh0ABKADFe0RQsSDB8z2HnIm0kWkcYkpMFBgKoCIKHswCYsYxwbGgJ2KIicYGsvVkAPN9j2AjBFIzHWrSKdOOTTTlCP8O8pAfmchA9XgZq01NAID5scdfALGRJEVS9zMzMzPz//HV8NH77872zs54ENH/CSCi4K3RqKyN9YGI6N8ho/sncsjqKEDm6MmdMgSfhJlPS7xNxWeSNRVm5mdLWDIqbr/b7TxtSveCQlx7BAC7wqUQKdRQrGe7Fu6StAsvY8JPkq2T88NVFm8GSSIXvzDM8wj08vAcKlfi6b8kDaD/vC7wWpIa0AMOBM6A5Wzbwlui4pLwnqItHLP4muLq+/PjYoPFqaag43hinMtvUdSmQuweRGMTLTxAtj7FytFvC6U+lCQP5PI4on+Xw/0TEQVvjaqmjPWBiAAA',
                    'searchUrl': 'https://www.blu-ray.com/search/?quicksearch=1&quicksearch_country=all&quicksearch_keyword=%tt%&section=theatrical',
                    'matchRegex': /return any results/,
                    'inSecondSearchBar': true,
                    'both': true
                },
                {
                    'name': 'Caps-A-Holic',
                    'icon': 'data:image/webp;base64,UklGRm4HAABXRUJQVlA4TGIHAAAvH8AHEE2obduGDaVtZiL6H88h8Y5dKGjbyDF/sLd+QlHcto2j/UcN8uzlDmraNoLMH+Vh6HTf0P+Af8oKbfqL/V8kKvv+AoA9BaBj27YiyTnv/f8jIqlXZzO3JWaW5sAMljxZ6PcUtDQJZvC0ZDFZzMxScxdEBvx4' +
                        'T5jVQ6Bj27ZqWxlz7X3k2XfFXSKH1CIKSRmIyLUE/Ah312dXz95rUpYkSZFkmXvSMvOe8PE7vf8/vC/BGzN0V2W4HNu2Tdvqz7Zt24q+Iiv7mRWyDFYBrNRGaCt65rfNMwFACGBJTMjigIK47QVrPel532ND1JfpnfamH/4fu4evXwP/AKfVodxgUes++/Bp4g6H/+vfN7SgXrWE4w/+Spk' +
                        'ffRnz4vs/v9z2qM7Nn7ueAcY35hsKmLTJQ10BYZEuzIyGMmDWTTzC69PK6M7VmE8zj68etG97hsuLZ//et5FMW+LvZYfsBEsn0RJlQhCTuQ0HElzyUhZnaP9wTviX5bv+uDMj/nq3dbkBtphZoe8iI0Ikixgiw7A0A26IRIAiIghl7d+D/Ki6+C/F/XkrWaalb2ntuQb8YxQCMgyVBMERM8' +
                        'zmmBgqEUMVCiSsXkpoh8COrAv+L3cWrL47V2UDQZDgUOASsYSAGgayDSBAgYJAiCWryUIaDuV48JFfP2qP/5dD7ol3bux1xIESCMiCQy0QGhaEwWYpllAhGKoIhMmyofNQjgcSPcvJqxl/7oCn/7GyrA1jkLmK0TgCkCyoiS6CiCSGeEaPkaFI7BG7ANrJmMUX5N60LC2T/Hqz5m7O9eO2Q' +
                        'oH/AIBD4W+nY5oFxnN4CITLAOJQLBAqSW3zjEUasrIjdoSMbjQ/EGu2cNdqassNuXSnNjdsO51Lr3udGuA5ALByOeeP/g2Lg1oo8EFQeDRYREiywej6YTzYuKLv0lw2s50xWH9suVmtYZisL0NfpjaGOpeV08d51x577r2vshUIHIX8fH5jNo6qbFikA0CBV/NqyNosZJn3Zbtk/1w2HW0r' +
                        'R4eP/ihtm4yujoFBVFHHDXUsjYa+dqMJ231vJpAMfIC/MlbWL7K8IiIkxJAEKSAU6ap4sR27qV62NG2qInSTk2nzy/HJd4dudYMMliVZ6IbBBqEKVUK1wI3Kix+/FAGPet/JX1/e/EzjCYunmMy7SBdakQWN4uDBdCqlPMDHY4Z/jEv/RTyu2pc3inxcRi/Ix3/KKKJiG6vIAKoQ8CJIwjj' +
                        'TD8wrDzjXmuRclqFAAMBTDDFgKV3auG/bE5SrL4Yae+ja6yNkjV0Wr97el1/trBaKZzeb364dUrPUIc28GAQSl7lliBk1kdOf+IrDQ78R3l9cDYJLTOYSlxliMnOUYPP5f4T4qdYY7TIEAN6FbLHErtHShTFybzzNgSIQAJe5hZTsFgWETmZ+OTtAASFAAEAsJDSt3otcE+gu1cPK2/j0z6' +
                        'GHP4wefulmz9Gjv7syjUcpVjJeJDSEDgeDzAVHXPBKcKzwn06YkXcV+ZYWCCBFEjTxbtqsTNENfr/2v+mdZZ4z82Y+3Xv4V/Infx3tmiEj1qarrcUKI3RoiqW4xS04xFLX+nHY178wQ+rjbyYmpb3RdUcvNNAkNqlSxtqKvhXYx7+jfFGK4yV10l1UuoyKfPifBd38UKglgJTwNOmwFMNSx' +
                        'rHhfPvtsgLAfPPRpw++OE6U267fHZJllDJ1jDp60Bfj0Lr1DR9/fUjPxfxWl6KR8cT8vyG7rQyd4CVkRihFe5AiCemIwldDDbF+GA0Agu03OLmtoD07TYgiEXukBi2wWVZjIRpx982v8puLTGU2bvsnbCuSBUcEAUiF1kJAW2Cx4Rq8Ku4BqQCAvfDb5frDB7fXvt7l9C02FC6lop+62oNZ' +
                        '+uMmSKZNdGckqipV2VKJCBRBEIlJXCElGDHy9q322OsrJoEwAAB4P30q+xafsW9xelEoSjat1mTjhs02FIutqBETIFGIBVVFDNGPBAkAxBEnEJh28KzOy0A2AAAAHH3zh/1bP3h9yT9Pn/lCqvVuyGC0PJgQoUtIqAUihsSQsiB+Cn1X9CMAAC5xZEy8o/PZa1yGYUX8C1A8eFFdnFZl4DS' +
                        'UpsmBcci1cUlsmygEKIExYEMCI+WmCgUigag4RZUDJuc8VhWQAvhv3VCY6dFt7xpNHjHUQV3UISD0EwjAbGYYEgKBEKCEgFKnsYg4QKUDyYD/PwUhXeWHzd2puqg2zSJACEGUzRE3BnWeoQ4tIkQgKm0D58+AAyACCF0C8MPJ+WLtTvXPf0xf879kQ6IoRQAAxA2zGYKQiBSRreA1ePQNvA' +
                        'F+AwFg6UNP9/5Hvv6x4owLllX/9Zq8mrreDAkTABiCBEkg1pX/n8Pgo+Lq+zABfAACwAaBg9e8Na/fNY2Cc/KYtXWlurKN7Oge56mwlvZvJfP1t9TbD5LBV6QHb8AbIAcIB2wcGAEuP3zx/43i6t8frhh2mBZF25bIY54hR1cJ+WS5859WCUASEAo4vcA3YAqYBN69vGq/aBUK2Cg=',
                    'searchUrl': 'https://caps-a-holic.com/index.php?s=%s_title%',
                    'matchRegex': /No results for/,
                    'showByDefault': false
                },
                {
                    'name': 'Shooter',
                    'icon': 'data:image/webp;base64,UklGRgYDAABXRUJQVlA4TPoCAAAvD8ADEIcGuY0kR1LU9O6e9t+hs0F/5V9fT3WGG3AjSZKtVO/+G5CQkbAVP7AJDU/+sdsFOZIkRVIsk/4KrRD8XQ3goLsqA25t26qVfc6V/z8OmVsH7hGpRETkNOFlUAMtMAjdCngl4O6cu08AUB1wwAECBrQASf0CDIliIXiaJELE3smYEqJI6JaHlJCI+O/+FZW7U7qFEO9dEvIlNouuUmRMFEUE4KqISEMRBMSUtmLdF52/x9/nNITFdTtHxQ+1A1ARs4NtAdG2AHyH1NZubQpKAYMIBCJCiFAMgIhQixiWDeA3TWwKCIE4O4AUYxQhAigxqgpCBDNDY7B2ewhUUW1nqirR6jBWz7/rb5bKni02nuRosNr/fv2sdvtBey0GDDw7ovh//kQEGxiNUGWke63ucBPa8c9cLA12tiXrF3P3Qld9423VcX0/7c7/0fny9drzgK1n9Qe/nWn4khJRJBEESH63ubTZ0ai10LQJU90NiksJ8FdToUngDylTWhAHnAJAEAACGEAlIwAcAaUAdJFdjPJat2ONbB98EKaRDiYtQBRSSbOhqgNdNXhFphkLwkJpBnS9Mq7LRRfTdNddx8NThUdHFippM6vleiy4rr9PN5/vm4/f/fjzz3Pj9n6+GN+b3TsufvrbHn6+3qfI4+/6PQBE27ZNNztObdu2bSu1bSO1bdtOX23b1j+1HxHR/8Tfb3XVySMdG/j/k515Nnn69WZ0dwmg4ahJVWN8ajmYpDl4cYUnE+seXar/7GIAT8LaNBs7PjSvNNm8mQUWObZjrByH6bxSWrbEPOFNkRR0q8R+PleYn/tQkrkoN1k6o+hljy1k6SCnRiGJMO0G5sqeD0rEXLXViwtbXMipq33fmzfGwgb8rIr4Tg9yHNHL2EqWT9SRkBEn23uSIzkP9NfbUhXTcMXAgn4nShTR/IFjG+XhEIuY3HVnZtBKHbDdOrGkZNiuZ6VA8eXUA6hpGwl15HSZ8QlEjDYC0H+v3b0+v++OTsnJwic=',
                    'searchUrl': 'https://assrt.net/sub/?searchword=%db_title%',
                    'loggedOutRegex': /Cloudflare|Ray ID/,
                    'matchRegex': /找到0条匹配/,
                    'inSecondSearchBar': true,
                    'both': true
                },
                {
                    'name': 'Zimuku',
                    'icon': 'data:image/webp;base64,UklGRtgAAABXRUJQVlA4TMwAAAAvH8AHEFegoG0bJirngu8uDQVt2zDpNhDjD/MraNuGcfnDGMyrEADQJoD8EdJJI4D/tgDw/99ZmGgFBz7Ih4jw2+9VCG4jSXKbL3iAt3UJIIWrhXYpElAJgIxA+9JVCahQX5GMIKL/E2Ce+zlJJcnlJTN5S5JwkI/kSlvgYto5CHV9GkEwD3XMqorpCwH9Ag4Ywy+QAi/dv3MDGiZQBgvAcIAx6kO4/oMbysgflDGTKqavY1ZNzKGzAN/naklAmrcuOh+Jee7H9C4umQE=',
                    'searchUrl': 'https://srtku.com/search?q=%tt%',
                    'loggedOutRegex': /Cloudflare|Ray ID/,
                    'matchRegex': /搜索不到相关字幕/,
                    'inSecondSearchBar': true,
                    'both': true
                },
                {
                    'name': 'SubHD',
                    'icon': 'data:image/webp;base64,UklGRuACAABXRUJQVlA4TNMCAAAvH8AHEK8lIZJt16p6P6IFTOFfRoYf7tljw0EbSY7kCxCe+lO9tDPTcBtJciRFHRPPpvPfFCq+9LcJR5IkRZI3LEus79P3XywzHl9XQCmEgrCNIDQESUEQthFqGv7fEcJ1RShsUdMgnDfXh9AgkAah4SwqgiCUGNpo' +
                        'ELYQGuoUmO3UNJwvwlnsoomwxXWzKzXXS6GK8P9hK9dFSY1t6tTU7LAfkoaGsB9N/t9U7EobDZqzUpjQ0BAENAT+ESnQnU3CNz7QmCFTpF/6bBMs4z0Bn2iUx1I2dngHwtYzftFY3Pi9wJGGNEpijBzBqaHD/kdR+kLcYVmzd7sUaTQeEl3TX6r3+2nEOU5tedOK/8bP4cjVHC3mVDoEP2f' +
                        'b4e6TbpayOi5/z+vY8vXtVv46gr8Pno2HF9Lb791//d8fkChJsmlb01fPtm3bNq5tzLVt28azbX7hWr3Ovn8Q0f8JEPu/V487++urSlQLq+qHuiZefhfnj+256nNu2yf2ezxLPc0b/235M6aej/w2nuksPhWRr3mzkfdZpFV5+oPze7bsOH493kFb5XsuC10D+4KLaazg21ulwfPguD2F6N' +
                        'sJkrwSwNzNh3YuBYALbLKD3AawMU5Vk88CWJJKuobJOQDBamasBRBKemvJKQAPLXrr5MmT4aS2mVwCsOp+uuHeWE5CYS7bezUi3a2hlOgBw1yy62aqQ1kRSz0TaAOwIsShkqnGXtm20IZF0aSiyUVV08Ku/l8IAEdJc50PZtIJAMtJbR/Zvm7dhmSLps4BFpKhbrIBwB1bQgCwnHRPkfMAV' +
                        'kQYifsAHCGTH0jsYgD+6w8e3rQQQFAkefEzx6Z358Mx4Ibac37KKNGorX5k9T2lz0W+ZBLVmGun9+8+djkkQ2nmFxGZdvBwRkTkV693A38N+Tud703+zF+hb1qyfctueS3OP9496hmsqS5WLa6uGex+8v6H2AEA',
                    'searchUrl': 'https://subhd.tv/d/%doubanId%',
                    'loggedOutRegex': /Cloudflare|Ray ID/,
                    'matchRegex': /上线时间表/,
                    'inSecondSearchBar': true,
                    'both': true
                },
                {
                    'name': 'R3SUB',
                    'icon': 'data:image/webp;base64,UklGRooCAABXRUJQVlA4TH4CAAAvH8AHEDfloG0jQUoys6d//oCHBsS2jSTJOdHVu/dAbNtIkiS6+t78811WkWQ1aoIgjGAA/x8ISJcvKNRPvdRPHVSnCgyLEEIQiIVNpY1gU9Mi2vx+f8175k5os+/xoKkA8d5zqLAJFhC6E26z0DgswPL//xfA3KNY' +
                        '3Ox72gQw73FYDIx9zHsq7XTTe6Zg5iYzd4Tjfb7Mzrwzd/bOSQ1iAXPH4p29Y9nPl8MEcFiIhmBT2fcYyuHdOeymO3tf9AGE4Xjv2fccBnNHHCrA0h03bSwG8n2/CdHG4gZ87xHAAoLmfb8EMe8JQhBKGyGkUo3KkLBt2/G2sr+rtvt9aWrb9mzbtu2t+2Z1Rq07yQ9do7cR/Vfktm0jIT3' +
                        'uOo+wLMsXiI+LJaKxcfEBn/XfBD8G+hMsy6jAb/kw1BcwJRBvSnycKXExphgXkObxOI7HTrOd3MRwm0m3nUyCrH3guu7ru22nXzy6vLUAgMIdF1efHLuzqxggb6Mk/Wvs+CLpcSXQ5eplZ8M76cNAEtAsST9qOC9Ju4FL0tx2jkp64wVaQzgnSfuBnROzf1ZxQNJ4SRiquCBpvAvIaeqvJv' +
                        'uqNLM3Iwzda78ufrvSQoi996dnnw1BGNZdm1/4frMnNQTvps9znw6Xh+FXTf49SZPDQFlfUxock/S2KAz1nJWkQ7Dm9+zUiRSOSFoaDJooaOCiJF0frTgj6WFW0EQ/a8DeJkkz63M3TErSx7qaV4sTW5Ib3kt/92RA8xN3+WFvl+aM3Bh7eqoRvJtPH8w5/vzWvvYkIHP5XzgeJwVSHZtgc' +
                        '5NsO5OVMda4zP+1eS7Mc2WeS/Ncr0BfCOor0cQvJrivWA==',
                    'searchUrl': 'https://r3sub.com/search.php?s=%tt%',
                    'loggedOutRegex': /Cloudflare|Ray ID/,
                    'matchRegex': /查無資料/,
                    'inSecondSearchBar': true,
                    'both': true
                },
                {
                    'name': 'OpenSubtitles',
                    'icon': 'data:image/webp;base64,UklGRnYCAABXRUJQVlA4TGoCAAAvH8AHEJ/DuJEkJ9MzeJO/iJQ3zAXBuG0jR5a84WL/uErvy7htI0eWvOFi/7hK78sgkqRGLQD/ArIAhGADAZ+j2rZtGGTq4R1KKPmVvEp+JYeSqWQoiUAHNKysAFZW85wAVgArQFppAdJa1gIATGNIyyqt0bOsJS2r63kA0oa0S1oAwP2+0gKkdb8vK8CyFgCgprSGPcB+nqYxWJX7QYbMalnLPKftOPSS1T/3sxrV1/F8X3v/H6TbtmZIUtyy7ai2HW2V29a4beN2v/+fmajEPEFE/xW4baM0O2Z8hBDC63G7nDDF6XJ7vEIIMfZVSqJQKnUiOFeaBCZLc0F0lkoFJEtfY0J8kkX0khOIvHIf2OdrBBNkL4rkp/CWSYluUiFywy1gizcRKLIbkix7PUkpQ4hIGYevIDNARhZ8iEsZQUjKpMcNm7hdduVyAACKS3/pggH+maWlJekHNOdfuSHJm6GYHkvsXpDk3XkrAGBkhx8NpebfeRDV3BE/5pRSx+wAgOAuj1t8AHLfuZcCsM7DrDaKagOAZZ7lodH/zlGg+4q9MOSENeiEd3kZw8ANewydumcOTfQ9P8eBPW7GjFQlJZoI3D7FgTnybnp4ADolQ0Xv/gkLD+8kN2pxv1UhPrix8UI+FC0mdLoWyTXTKv1alWYqvG436QgbvIwZKUvWASwZnEvyJ0dhRI6sApDvPNaKcz/0c50tJAEgvcrfRQA+9cY/yvBefPu4HVdq6p3sgEbHyj1JPm7H9IFOL0ny4ldfDHBaupd+f8/S0oLfB8Bp/17bfxf235X9d2n/Xf+Hf0H/VxwwxaH/KwI=',
                    'searchUrl': 'https://www.opensubtitles.org/zh/search/sublanguageid-chi,zht,zhe,eng/imdbid-%nott%/sort-5/asc-0',
                    'loggedOutRegex': /Guru Meditation/,
                    'matchRegex': /div itemscope/,
                    'positiveMatch': true,
                    'inSecondSearchBar': true,
                    'both': true
                }
            ]

            // 创建一个用于显示站点链接的元素
            const PTSectionFactory = async (name, link, icon, site) => {
                const section = $('<p style="margin:0;padding: 8px;"></p>').addClass('service');
                const img = $('<img class="site-img"/>').css({'height': '18px', 'width': '18px'});
                const linkElem = $('<a class="atag-btsub"></a>').attr({
                    'target': '_blank',
                    'rel': 'nofollow noopener noreferrer'
                });
                linkElem.append(img);
                linkElem.attr({'href': link, 'title': name});
                img.attr('src', icon);
                section.append(linkElem);
                // 检查是否添加链接到该站点
                await maybeAddLink(section[0], name, link, site, imdb_nb);
                return section[0];
            };

            // 构建搜索栏
            $('ul.js-actions-panel').append(`<li style="padding: 0;"><div class="search-bar-btsub" 
id="search_bar01" style="display: flex;flex-wrap: wrap;justify-content: center;padding: 0 25px;">
<tr id="search_bar01"></tr></div></li>`)

            // 添加站点链接到页面中
            sites.forEach(async (site) => {
                const link = replaceSearchUrlParams(site, imdb_nb, douban_id, film_title, film_year)
                const toAppend = await PTSectionFactory(site.name, link, site.icon, site)

                $('#search_bar01').append(toAppend)
            })
        }

        function generateFilmFileName(film_year, douban_title, film_title, imdb_nb, tmdb_id) {

            GM_addStyle(`
        .fn-action-item {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            padding: 10px 8px !important;
        }
        .editInput {
            -webkit-appearance: none;
            -moz-appearance: none;
            background: transparent;
            background-clip: border-box;
            background-color: #2c3440;
            border: none;
            border-radius: 2px;
            box-shadow: none;
            box-sizing: border-box;
            color: #89a;
            display: block;
            font-family: inherit;
            font-size: .84615385rem;
            line-height: 1;
            margin: 4px 2px;
            padding: 4px 4px 3px;
            text-align: left;
            width: calc(4em + 10px);
        }
        .fn-button {
            font-size: .5rem;
            font-weight: 400;
            letter-spacing: 0;
            margin: 5px 2px 5px 4px;
            padding: 4px 4px 3px;
        }
        `)

            let re_douban_title = douban_title.replace(/[\/\\#,，。、：？！+()$~%.":*?<>{}!&]/g, '');

            if (hasJapanese(douban_title)) {
                re_douban_title = null
            }


            let re_film_title = re_douban_title || film_title;

            re_film_title = re_film_title.replace(/\s+/g, '.');

            let re_tmdb_id = `{tmdb-${tmdb_id}}`;
            let re_imdb_id = `tt${imdb_nb}`;
            if (!imdb_nb) {
                re_imdb_id = null
            }
            let re_film_id = re_imdb_id || re_tmdb_id;

            // 创建新的动作项
            var newActionItem = $('<li class="fn-action-item">');

            $('ul.js-actions-panel').append(newActionItem);

            var qualitySelect = $('<select class="editInput">').appendTo(newActionItem);

            // 创建下拉列表框 qualitySelect，并添加到新的动作项中
            function optionQuality() {
                $('<option>').val('').text('*Quality').appendTo(qualitySelect);
                $('<option>').val('REMUX-2K').text('RE-2K').appendTo(qualitySelect);
                $('<option>').val('REMUX-4K').text('RE-4K').appendTo(qualitySelect);
                $('<option>').val('WEB-2K').text('WEB-2K').appendTo(qualitySelect);
                $('<option>').val('WEB-4K').text('WEB-4K').appendTo(qualitySelect);
                $('<option>').val('GP-2K').text('GP-2K').appendTo(qualitySelect);
                $('<option>').val('GP-720p').text('GP-720p').appendTo(qualitySelect);
                $('<option>').val('WiKi-2K').text('WiKi-2K').appendTo(qualitySelect);
                $('<option>').val('CMCT-2K').text('CMCT-2K').appendTo(qualitySelect);
                $('<option>').val('REMUX-PAL-DVD9').text('RE-PA-D9').appendTo(qualitySelect);
                $('<option>').val('REMUX-PAL-DVD5').text('RE-PA-D5').appendTo(qualitySelect);
                $('<option>').val('REMUX-NTSC-DVD9').text('RE-NT-D9').appendTo(qualitySelect);
                $('<option>').val('REMUX-NTSC-DVD5').text('RE-NT-D5').appendTo(qualitySelect);
            };

            var editionSelect = $('<select class="editInput">').appendTo(newActionItem);

            // 创建下拉列表框 editionSelect，并添加到容器中
            function optionLabel() {
                $('<option>').val('').text('*Label').appendTo(editionSelect);
                $('<option>').val('@Anime').text('@Anime').appendTo(editionSelect);
                $('<option>').val('01 Distribution').text('01 Distribution').appendTo(editionSelect);
                $('<option>').val('101 Films').text('101 Films').appendTo(editionSelect);
                $('<option>').val('2 Entertain Video').text('2 Entertain Video').appendTo(editionSelect);
                $('<option>').val('20th Century Fox').text('20th Century Fox').appendTo(editionSelect);
                $('<option>').val('35 mm').text('35 mm').appendTo(editionSelect);
                $('<option>').val('3L Film').text('3L Film').appendTo(editionSelect);
                $('<option>').val('84 Entertainment').text('84 Entertainment').appendTo(editionSelect);
                $('<option>').val('88 Films').text('88 Films').appendTo(editionSelect);
                $('<option>').val('A Contracorriente').text('A Contracorriente Films').appendTo(editionSelect);
                $('<option>').val('AB Vidéo').text('AB Vidéo').appendTo(editionSelect);
                $('<option>').val('Accentus').text('Accentus').appendTo(editionSelect);
                $('<option>').val('Acorn Media').text('Acorn Media').appendTo(editionSelect);
                $('<option>').val('A-film').text('A-film').appendTo(editionSelect);
                $('<option>').val('AGFA').text('AGFA').appendTo(editionSelect);
                $('<option>').val('Alamode Film').text('Alamode Film').appendTo(editionSelect);
                $('<option>').val('Alive').text('Alive').appendTo(editionSelect);
                $('<option>').val('Alliance').text('Alliance').appendTo(editionSelect);
                $('<option>').val('Amazon').text('Amazon').appendTo(editionSelect);
                $('<option>').val('AMZN CBR').text('AMZN CBR').appendTo(editionSelect);
                $('<option>').val('AMZN VBR V1').text('AMZN VBR V1').appendTo(editionSelect);
                $('<option>').val('AMZN VBR V2').text('AMZN VBR V2').appendTo(editionSelect);
                $('<option>').val('Anime Ltd').text('Anime Ltd').appendTo(editionSelect);
                $('<option>').val('Aniplex').text('Aniplex').appendTo(editionSelect);
                $('<option>').val('Another World').text('Another World').appendTo(editionSelect);
                $('<option>').val('Apple TV+').text('Apple TV+').appendTo(editionSelect);
                $('<option>').val('Arrow').text('Arrow').appendTo(editionSelect);
                $('<option>').val('Arthaus').text('Arthaus').appendTo(editionSelect);
                $('<option>').val('Artificial Eye').text('Artificial Eye').appendTo(editionSelect);
                $('<option>').val('Ascot Elite Home').text('Ascot Elite Home').appendTo(editionSelect);
                $('<option>').val('Asylum').text('Asylum').appendTo(editionSelect);
                $('<option>').val('Atlantic Film').text('Atlantic Film').appendTo(editionSelect);
                $('<option>').val('Aurum').text('Aurum').appendTo(editionSelect);
                $('<option>').val('AV Visionen').text('AV Visionen').appendTo(editionSelect);
                $('<option>').val('Avex Trax').text('Avex Trax').appendTo(editionSelect);
                $('<option>').val('Bandai Namco').text('Bandai Namco').appendTo(editionSelect);
                $('<option>').val('Bandai Visual').text('Bandai Visual').appendTo(editionSelect);
                $('<option>').val('BBC').text('BBC').appendTo(editionSelect);
                $('<option>').val('Bel Air').text('Bel Air').appendTo(editionSelect);
                $('<option>').val('Berliner Philharmoniker').text('Berliner Philharmoniker').appendTo(editionSelect);
                $('<option>').val('BFI Player').text('BFI Player').appendTo(editionSelect);
                $('<option>').val('BFI').text('BFI').appendTo(editionSelect);
                $('<option>').val('bilibili').text('bilibili').appendTo(editionSelect);
                $('<option>').val('Bit Wel').text('Bit Wel').appendTo(editionSelect);
                $('<option>').val('Blue Underground').text('Blue Underground').appendTo(editionSelect);
                $('<option>').val('Bonton Film').text('Bonton Film').appendTo(editionSelect);
                $('<option>').val('BQHL Editions').text('BQHL Editions').appendTo(editionSelect);
                $('<option>').val('Busch Media').text('Busch Media Group').appendTo(editionSelect);
                $('<option>').val('C MAJOR').text('C MAJOR').appendTo(editionSelect);
                $('<option>').val('California Filmes').text('California Filmes').appendTo(editionSelect);
                $('<option>').val('Cameo').text('Cameo').appendTo(editionSelect);
                $('<option>').val('Canal+').text('Canal+').appendTo(editionSelect);
                $('<option>').val('Capelight Pictures').text('Capelight Pictures').appendTo(editionSelect);
                $('<option>').val('Cargo Records').text('Cargo Records').appendTo(editionSelect);
                $('<option>').val('Carlotta Films').text('Carlotta Films').appendTo(editionSelect);
                $('<option>').val('Carmen Film').text('Carmen Film').appendTo(editionSelect);
                $('<option>').val('CATCHPLAY+').text('CATCHPLAY+').appendTo(editionSelect);
                $('<option>').val('CathayPlay').text('CathayPlay').appendTo(editionSelect);
                $('<option>').val('CG Entertainment').text('CG Entertainment').appendTo(editionSelect);
                $('<option>').val('Cinedigm').text('Cinedigm').appendTo(editionSelect);
                $('<option>').val('Cinestrange Extreme').text('Cinestrange Extreme').appendTo(editionSelect);
                $('<option>').val('CJ Entertainment').text('CJ Entertainment').appendTo(editionSelect);
                $('<option>').val('Claudio Records').text('Claudio Records').appendTo(editionSelect);
                $('<option>').val('Cleopatra').text('Cleopatra').appendTo(editionSelect);
                $('<option>').val('CMV Laservision').text('CMV Laservision').appendTo(editionSelect);
                $('<option>').val('Code Red').text('Code Red').appendTo(editionSelect);
                $('<option>').val('Cohen Media').text('Cohen Media Group').appendTo(editionSelect);
                $('<option>').val('Columbia TriStar').text('Columbia TriStar').appendTo(editionSelect);
                $('<option>').val('Concorde Video').text('Concorde Video').appendTo(editionSelect);
                $('<option>').val('Condor').text('Condor').appendTo(editionSelect);
                $('<option>').val('Constantin Film').text('Constantin Film').appendTo(editionSelect);
                $('<option>').val('CP Digital').text('CP Digital').appendTo(editionSelect);
                $('<option>').val('Crave').text('Crave').appendTo(editionSelect);
                $('<option>').val('Criterion').text('Criterion').appendTo(editionSelect);
                $('<option>').val('Crunchyroll').text('Crunchyroll, LLC').appendTo(editionSelect);
                $('<option>').val('Dark Force').text('Dark Force').appendTo(editionSelect);
                $('<option>').val('Dazzler Media').text('Dazzler Media').appendTo(editionSelect);
                $('<option>').val('Decca').text('Decca').appendTo(editionSelect);
                $('<option>').val('Deutsche Grammophon').text('Deutsche Grammophon').appendTo(editionSelect);
                $('<option>').val('Discotek Media').text('Discotek Media').appendTo(editionSelect);
                $('<option>').val('Disney').text('Disney').appendTo(editionSelect);
                $('<option>').val('Disney+').text('Disney+').appendTo(editionSelect);
                $('<option>').val('Divisa').text('Divisa').appendTo(editionSelect);
                $('<option>').val('DreamWorks').text('DreamWorks').appendTo(editionSelect);
                $('<option>').val('DTP  AG').text('DTP  AG').appendTo(editionSelect);
                $('<option>').val('Dutch FilmWorks').text('Dutch FilmWorks').appendTo(editionSelect);
                $('<option>').val('Dybex').text('Dybex').appendTo(editionSelect);
                $('<option>').val('Dynamic').text('Dynamic').appendTo(editionSelect);
                $('<option>').val('Dynit').text('Dynit').appendTo(editionSelect);
                $('<option>').val('Eagle').text('Eagle').appendTo(editionSelect);
                $('<option>').val('Eagle Pictures').text('Eagle Pictures').appendTo(editionSelect);
                $('<option>').val('Eagle Rock').text('Eagle Rock').appendTo(editionSelect);
                $('<option>').val('Eagle Vision Media').text('Eagle Vision Media').appendTo(editionSelect);
                $('<option>').val('Earmusic').text('Earmusic').appendTo(editionSelect);
                $('<option>').val('Echo Bridge').text('Echo Bridge').appendTo(editionSelect);
                $('<option>').val('Edel Germany').text('Edel Germany GmbH').appendTo(editionSelect);
                $('<option>').val('Edel records').text('Edel records').appendTo(editionSelect);
                $('<option>').val('Edition Filmmuseum').text('Edition Filmmuseum').appendTo(editionSelect);
                $('<option>').val('ELEA-Media').text('ELEA-Media').appendTo(editionSelect);
                $('<option>').val('Elephant Films').text('Elephant Films').appendTo(editionSelect);
                $('<option>').val('ELTA TV').text('ELTA TV').appendTo(editionSelect);
                $('<option>').val('EMI').text('EMI').appendTo(editionSelect);
                $('<option>').val('Emon').text('Emon').appendTo(editionSelect);
                $('<option>').val('eOne').text('eOne').appendTo(editionSelect);
                $('<option>').val('ESC Editions').text('ESC Editions').appendTo(editionSelect);
                $('<option>').val('Eureka').text('Eureka').appendTo(editionSelect);
                $('<option>').val('Euro Video').text('Euro Video').appendTo(editionSelect);
                $('<option>').val('EuroArts').text('EuroArts').appendTo(editionSelect);
                $('<option>').val('EuropaCorp').text('EuropaCorp').appendTo(editionSelect);
                $('<option>').val('Excel').text('Excel').appendTo(editionSelect);
                $('<option>').val('Explosive Media').text('Explosive Media').appendTo(editionSelect);
                $('<option>').val('Fabulous Films').text('Fabulous Films').appendTo(editionSelect);
                $('<option>').val('Film Movement').text('Film Movement').appendTo(editionSelect);
                $('<option>').val('FilmConfect Home').text('FilmConfect Home').appendTo(editionSelect);
                $('<option>').val('Filmjuwelen').text('Filmjuwelen').appendTo(editionSelect);
                $('<option>').val('FilmRise').text('FilmRise').appendTo(editionSelect);
                $('<option>').val('Flicker Alley').text('Flicker Alley').appendTo(editionSelect);
                $('<option>').val('Fox Pathe Europa').text('Fox Pathe Europa').appendTo(editionSelect);
                $('<option>').val('FTD').text('France tv distribution').appendTo(editionSelect);
                $('<option>').val('Fremantle Home').text('Fremantle Home').appendTo(editionSelect);
                $('<option>').val('FriDay').text('friDay影音').appendTo(editionSelect);
                $('<option>').val('Frontiers Records').text('Frontiers Records').appendTo(editionSelect);
                $('<option>').val('FS Film Oy').text('FS Film Oy').appendTo(editionSelect);
                $('<option>').val('Full Moon Features').text('Full Moon Features').appendTo(editionSelect);
                $('<option>').val('FUNimation').text('FUNimation').appendTo(editionSelect);
                $('<option>').val('Future Film').text('Future Film').appendTo(editionSelect);
                $('<option>').val('Gaga Communications').text('Gaga Communications').appendTo(editionSelect);
                $('<option>').val('GagaOOLala').text('GagaOOLala').appendTo(editionSelect);
                $('<option>').val('Gaumont').text('Gaumont').appendTo(editionSelect);
                $('<option>').val('Geneon Universal').text('Geneon Universal').appendTo(editionSelect);
                $('<option>').val('Giloo').text('Giloo紀實影音').appendTo(editionSelect);
                $('<option>').val('Google Play').text('Google Play').appendTo(editionSelect);
                $('<option>').val('GP+').text('GP+').appendTo(editionSelect);
                $('<option>').val('Gravitas Ventures').text('Gravitas Ventures').appendTo(editionSelect);
                $('<option>').val('Great Movies').text('Great Movies').appendTo(editionSelect);
                $('<option>').val('Grindhouse').text('Grindhouse').appendTo(editionSelect);
                $('<option>').val('Hami Video').text('Hami Video').appendTo(editionSelect);
                $('<option>').val('Hanabee').text('Hanabee').appendTo(editionSelect);
                $('<option>').val('HanseSound').text('HanseSound').appendTo(editionSelect);
                $('<option>').val('Happinet').text('Happinet').appendTo(editionSelect);
                $('<option>').val('HBO').text('HBO').appendTo(editionSelect);
                $('<option>').val('HBO GO').text('HBO GO').appendTo(editionSelect);
                $('<option>').val('HBO Max').text('HBO Max').appendTo(editionSelect);
                $('<option>').val('Hotstar').text('Hotstar').appendTo(editionSelect);
                $('<option>').val('HPM').text('HPM').appendTo(editionSelect);
                $('<option>').val('Hulu').text('Hulu').appendTo(editionSelect);
                $('<option>').val('i-catcher').text('i-catcher').appendTo(editionSelect);
                $('<option>').val('Icon Film').text('Icon Film').appendTo(editionSelect);
                $('<option>').val('Image').text('Image').appendTo(editionSelect);
                $('<option>').val('Imagem Filmes').text('Imagem Filmes').appendTo(editionSelect);
                $('<option>').val('Imperial Cinepix').text('Imperial Cinepix').appendTo(editionSelect);
                $('<option>').val('Imprint').text('Imprint').appendTo(editionSelect);
                $('<option>').val('in Video').text('in Video').appendTo(editionSelect);
                $('<option>').val('Indie Rights').text('Indie Rights').appendTo(editionSelect);
                $('<option>').val('Inked Pictures').text('Inked Pictures').appendTo(editionSelect);
                $('<option>').val('Inside Out Music').text('Inside Out Music').appendTo(editionSelect);
                $('<option>').val('InterCom').text('InterCom').appendTo(editionSelect);
                $('<option>').val('Intercontinental Video').text('Intercontinental Video').appendTo(editionSelect);
                $('<option>').val('Intergroove').text('Intergroove').appendTo(editionSelect);
                $('<option>').val('iTunes').text('iTunes').appendTo(editionSelect);
                $('<option>').val('IVC').text('IVC').appendTo(editionSelect);
                $('<option>').val('Just Bridge').text('Just Bridge').appendTo(editionSelect);
                $('<option>').val('Kadokawa').text('Kadokawa').appendTo(editionSelect);
                $('<option>').val('Kaleidoscope').text('Kaleidoscope').appendTo(editionSelect);
                $('<option>').val('Kanopy').text('Kanopy').appendTo(editionSelect);
                $('<option>').val('Kaze').text('Kaze').appendTo(editionSelect);
                $('<option>').val('KD MEDIA').text('KD MEDIA').appendTo(editionSelect);
                $('<option>').val('King Records').text('King Records').appendTo(editionSelect);
                $('<option>').val('Kino Lorber').text('Kino Lorber').appendTo(editionSelect);
                $('<option>').val('Kinokuniya').text('Kinokuniya').appendTo(editionSelect);
                $('<option>').val('KINOSTREAM').text('KINOSTREAM').appendTo(editionSelect);
                $('<option>').val('Kinowelt Home').text('Kinowelt Home').appendTo(editionSelect);
                $('<option>').val('KKTV').text('KKTV').appendTo(editionSelect);
                $('<option>').val('Koba Films').text('Koba Films').appendTo(editionSelect);
                $('<option>').val('Koch Entertainment').text('Koch Entertainment').appendTo(editionSelect);
                $('<option>').val('Koch Media').text('Koch Media').appendTo(editionSelect);
                $('<option>').val('Kscope').text('Kscope').appendTo(editionSelect);
                $('<option>').val('KSM').text('KSM').appendTo(editionSelect);
                $('<option>').val('Le chat qui fume').text('Le chat qui fume').appendTo(editionSelect);
                $('<option>').val('Leonine Films').text('Leonine Films').appendTo(editionSelect);
                $('<option>').val('Lighthouse Home').text('Lighthouse Home').appendTo(editionSelect);
                $('<option>').val('LINE TV').text('LINE TV').appendTo(editionSelect);
                $('<option>').val('Lionsgate Films').text('Lionsgate Films').appendTo(editionSelect);
                $('<option>').val('LiTV').text('LiTV').appendTo(editionSelect);
                $('<option>').val('Lizard Cinema Trade').text('Lizard Cinema Trade').appendTo(editionSelect);
                $('<option>').val('Llamentol').text('Llamentol').appendTo(editionSelect);
                $('<option>').val('LSO Live').text('LSO Live').appendTo(editionSelect);
                $('<option>').val('Lucky Red').text('Lucky Red').appendTo(editionSelect);
                $('<option>').val('M6 Video').text('M6 Video').appendTo(editionSelect);
                $('<option>').val('Madman').text('Madman').appendTo(editionSelect);
                $('<option>').val('Magic Box').text('Magic Box').appendTo(editionSelect);
                $('<option>').val('Magnolia Pictures').text('Magnolia Pictures').appendTo(editionSelect);
                $('<option>').val('Manga Home').text('Manga Home').appendTo(editionSelect);
                $('<option>').val('Maple Studios').text('Maple Studios').appendTo(editionSelect);
                $('<option>').val('Media Factory').text('Media Factory').appendTo(editionSelect);
                $('<option>').val('Medusa').text('Medusa').appendTo(editionSelect);
                $('<option>').val('Mercury').text('Mercury').appendTo(editionSelect);
                $('<option>').val('MGM').text('Metro-Goldwyn-Mayer').appendTo(editionSelect);
                $('<option>').val('Metropolitan').text('Metropolitan').appendTo(editionSelect);
                $('<option>').val('Microsoft Store').text('Microsoft Store').appendTo(editionSelect);
                $('<option>').val('Midnight Factory').text('Midnight Factory').appendTo(editionSelect);
                $('<option>').val('Mill Creek').text('Mill Creek').appendTo(editionSelect);
                $('<option>').val('Momentum Pictures').text('Momentum Pictures').appendTo(editionSelect);
                $('<option>').val('Mondo Home').text('Mondo Home').appendTo(editionSelect);
                $('<option>').val('Mondo Macabro').text('Mondo Macabro').appendTo(editionSelect);
                $('<option>').val('Mongrel Media').text('Mongrel Media').appendTo(editionSelect);
                $('<option>').val('MoviesAnywhere').text('MoviesAnywhere').appendTo(editionSelect);
                $('<option>').val('MPI Media').text('MPI Media').appendTo(editionSelect);
                $('<option>').val('MUBI').text('MUBI').appendTo(editionSelect);
                $('<option>').val('MVD Visual').text('MVD Visual').appendTo(editionSelect);
                $('<option>').val('MVM Films').text('MVM Films').appendTo(editionSelect);
                $('<option>').val('myVideo').text('myVideo').appendTo(editionSelect);
                $('<option>').val('Nameless Media').text('Nameless Media').appendTo(editionSelect);
                $('<option>').val('Naxos').text('Naxos').appendTo(editionSelect);
                $('<option>').val('NBCUniversal  Japan').text('NBCUniversal  Japan').appendTo(editionSelect);
                $('<option>').val('Netflix').text('Netflix').appendTo(editionSelect);
                $('<option>').val('Network').text('Network').appendTo(editionSelect);
                $('<option>').val('New Disc').text('New Disc').appendTo(editionSelect);
                $('<option>').val('New Line Cinema').text('New Line Cinema').appendTo(editionSelect);
                $('<option>').val('Nipponart').text('Nipponart').appendTo(editionSelect);
                $('<option>').val('Njutafilms').text('Njutafilms').appendTo(editionSelect);
                $('<option>').val('Noble').text('Noble').appendTo(editionSelect);
                $('<option>').val('Nordisk Film').text('Nordisk Film').appendTo(editionSelect);
                $('<option>').val('Notorious Pictures').text('Notorious Pictures').appendTo(editionSelect);
                $('<option>').val('Nova Media').text('Nova Media').appendTo(editionSelect);
                $('<option>').val('NSM Records').text('NSM Records').appendTo(editionSelect);
                $('<option>').val('Nuclear Blast').text('Nuclear Blast').appendTo(editionSelect);
                $('<option>').val('Odeon').text('Odeon').appendTo(editionSelect);
                $('<option>').val('Olive Films').text('Olive Films').appendTo(editionSelect);
                $('<option>').val('OnScreen Films').text('OnScreen Films').appendTo(editionSelect);
                $('<option>').val('Optimum Home').text('Optimum Home').appendTo(editionSelect);
                $('<option>').val('Opus Arte').text('Opus Arte').appendTo(editionSelect);
                $('<option>').val('Pan Vision').text('Pan Vision').appendTo(editionSelect);
                $('<option>').val('Panegyric').text('Panegyric').appendTo(editionSelect);
                $('<option>').val('Panorama').text('Panorama').appendTo(editionSelect);
                $('<option>').val('Paradise').text('Paradise').appendTo(editionSelect);
                $('<option>').val('Paramount +').text('Paramount +').appendTo(editionSelect);
                $('<option>').val('Paramount Pictures').text('Paramount Pictures').appendTo(editionSelect);
                $('<option>').val('Paris Filmes').text('Paris Filmes').appendTo(editionSelect);
                $('<option>').val('Parlophone').text('Parlophone').appendTo(editionSelect);
                $('<option>').val('Pathe Distribution').text('Pathe Distribution').appendTo(editionSelect);
                $('<option>').val('PBS').text('PBS').appendTo(editionSelect);
                $('<option>').val('PBS').text('PBS').appendTo(editionSelect);
                $('<option>').val('Peacock').text('Peacock').appendTo(editionSelect);
                $('<option>').val('peppermint').text('peppermint').appendTo(editionSelect);
                $('<option>').val('Phase 4 Films').text('Phase 4 Films').appendTo(editionSelect);
                $('<option>').val('Pinnacle Films').text('Pinnacle Films').appendTo(editionSelect);
                $('<option>').val('Plain').text('Plain').appendTo(editionSelect);
                $('<option>').val('Plex').text('Plex').appendTo(editionSelect);
                $('<option>').val('Polyband & Toppic').text('Polyband & Toppic').appendTo(editionSelect);
                $('<option>').val('Polydor').text('Polydor').appendTo(editionSelect);
                $('<option>').val('Pony Canyon').text('Pony Canyon').appendTo(editionSelect);
                $('<option>').val('Potemkine').text('Potemkine').appendTo(editionSelect);
                $('<option>').val('Powerhouse Films').text('Powerhouse Films').appendTo(editionSelect);
                $('<option>').val('Pro Video').text('Pro Video').appendTo(editionSelect);
                $('<option>').val('Pulp Video').text('Pulp Video').appendTo(editionSelect);
                $('<option>').val('Quality Films').text('Quality Films').appendTo(editionSelect);
                $('<option>').val('Radiance Films').text('Radiance Films').appendTo(editionSelect);
                $('<option>').val('Reel').text('Reel').appendTo(editionSelect);
                $('<option>').val('Resen').text('Resen').appendTo(editionSelect);
                $('<option>').val('Rhino Music').text('Rhino Music').appendTo(editionSelect);
                $('<option>').val('Right Stuf').text('Right Stuf').appendTo(editionSelect);
                $('<option>').val('Rimini Editions').text('Rimini Editions').appendTo(editionSelect);
                $('<option>').val('RLJE Films').text('RLJE Films').appendTo(editionSelect);
                $('<option>').val('Roadshow').text('Roadshow').appendTo(editionSelect);
                $('<option>').val('Roku').text('Roku').appendTo(editionSelect);
                $('<option>').val('Rough Trade').text('Rough Trade').appendTo(editionSelect);
                $('<option>').val('Sandrew Metronome').text('Sandrew Metronome').appendTo(editionSelect);
                $('<option>').val('Scanbox').text('Scanbox').appendTo(editionSelect);
                $('<option>').val('SchröderMedia').text('SchröderMedia').appendTo(editionSelect);
                $('<option>').val('Scorpion Releasing').text('Scorpion Releasing').appendTo(editionSelect);
                $('<option>').val('Screen Media').text('Screen Media').appendTo(editionSelect);
                $('<option>').val('Second Sight').text('Second Sight').appendTo(editionSelect);
                $('<option>').val('Select Video').text('Select Video').appendTo(editionSelect);
                $('<option>').val('Selecta Vision').text('Selecta Vision').appendTo(editionSelect);
                $('<option>').val('Sentai Filmworks').text('Sentai Filmworks').appendTo(editionSelect);
                $('<option>').val('Seven7').text('Seven7').appendTo(editionSelect);
                $('<option>').val('Severin Films').text('Severin Films').appendTo(editionSelect);
                $('<option>').val('SF Studios').text('SF Studios').appendTo(editionSelect);
                $('<option>').val('Shochiku').text('Shochiku').appendTo(editionSelect);
                $('<option>').val('Shock').text('Shock').appendTo(editionSelect);
                $('<option>').val('Shout Factory').text('Shout Factory').appendTo(editionSelect);
                $('<option>').val('Sidonis Calysta').text('Sidonis Calysta').appendTo(editionSelect);
                $('<option>').val('Signature').text('Signature').appendTo(editionSelect);
                $('<option>').val('SkyShowtime').text('SkyShowtime').appendTo(editionSelect);
                $('<option>').val('SM Life Design').text('SM Life Design').appendTo(editionSelect);
                $('<option>').val('Sono Luminus').text('Sono Luminus').appendTo(editionSelect);
                $('<option>').val('Sony Music').text('Sony Music').appendTo(editionSelect);
                $('<option>').val('Sony Pictures').text('Sony Pictures').appendTo(editionSelect);
                $('<option>').val('Soul Media').text('Soul Media').appendTo(editionSelect);
                $('<option>').val('Soulfood Music').text('Soulfood Music').appendTo(editionSelect);
                $('<option>').val('Spectrum').text('Spectrum').appendTo(editionSelect);
                $('<option>').val('Splendid').text('Splendid').appendTo(editionSelect);
                $('<option>').val('Splendid Film').text('Splendid Film').appendTo(editionSelect);
                $('<option>').val('SRS Cinema').text('SRS Cinema').appendTo(editionSelect);
                $('<option>').val('Stan').text('Stan').appendTo(editionSelect);
                $('<option>').val('Star Media').text('Star Media').appendTo(editionSelect);
                $('<option>').val('Star+').text('Star+').appendTo(editionSelect);
                $('<option>').val('Starz').text('Starz').appendTo(editionSelect);
                $('<option>').val('Studio Canal').text('Studio Canal').appendTo(editionSelect);
                $('<option>').val('Studio Hamburg').text('Studio Hamburg').appendTo(editionSelect);
                $('<option>').val('Studio S').text('Studio S').appendTo(editionSelect);
                $('<option>').val('Summit Home').text('Summit Home').appendTo(editionSelect);
                $('<option>').val('Sunfilm').text('Sunfilm').appendTo(editionSelect);
                $('<option>').val('Surround Records').text('Surround Records').appendTo(editionSelect);
                $('<option>').val('Svensk Filmindustri').text('Svensk Filmindustri').appendTo(editionSelect);
                $('<option>').val('Synapse Films').text('Synapse Films').appendTo(editionSelect);
                $('<option>').val('Tacet Records').text('Tacet Records').appendTo(editionSelect);
                $('<option>').val('TakeOne').text('TakeOne').appendTo(editionSelect);
                $('<option>').val('TF1 Vidéo').text('TF1 Vidéo').appendTo(editionSelect);
                $('<option>').val('Third Window Films').text('Third Window Films').appendTo(editionSelect);
                $('<option>').val('Tiberius Film').text('Tiberius Film').appendTo(editionSelect);
                $('<option>').val('Tobis Film').text('Tobis Film').appendTo(editionSelect);
                $('<option>').val('Toei Video').text('Toei Video').appendTo(editionSelect);
                $('<option>').val('Toho').text('Toho').appendTo(editionSelect);
                $('<option>').val('Transmission Films').text('Transmission Films').appendTo(editionSelect);
                $('<option>').val('Troma').text('Troma').appendTo(editionSelect);
                $('<option>').val('Tubi TV').text('Tubi TV').appendTo(editionSelect);
                $('<option>').val('Turbine Medien').text('Turbine Medien').appendTo(editionSelect);
                $('<option>').val('Twilight Time').text('Twilight Time').appendTo(editionSelect);
                $('<option>').val('Umbrella').text('Umbrella').appendTo(editionSelect);
                $('<option>').val('U-NEXT').text('U-NEXT').appendTo(editionSelect);
                $('<option>').val('Unitel').text('Unitel').appendTo(editionSelect);
                $('<option>').val('Universal Music').text('Universal Music').appendTo(editionSelect);
                $('<option>').val('Universal Sony Pictures').text('Universal Sony Pictures').appendTo(editionSelect);
                $('<option>').val('Universal Studios').text('Universal Studios').appendTo(editionSelect);
                $('<option>').val('Universum Film').text('Universum Film').appendTo(editionSelect);
                $('<option>').val('VAP').text('VAP').appendTo(editionSelect);
                $('<option>').val('VCI').text('VCI').appendTo(editionSelect);
                $('<option>').val('Versátil Home').text('Versátil Home').appendTo(editionSelect);
                $('<option>').val('Vértice 360º').text('Vértice 360º').appendTo(editionSelect);
                $('<option>').val('Via Vision').text('Via Vision').appendTo(editionSelect);
                $('<option>').val('Vicol').text('Vicol').appendTo(editionSelect);
                $('<option>').val('Video Service').text('Video Service Corp.').appendTo(editionSelect);
                $('<option>').val('Videomax').text('Videomax').appendTo(editionSelect);
                $('<option>').val('Vidol TV').text('Vidol TV').appendTo(editionSelect);
                $('<option>').val('Vimeo').text('Vimeo').appendTo(editionSelect);
                $('<option>').val('Vinegar Syndrome').text('Vinegar Syndrome').appendTo(editionSelect);
                $('<option>').val('Vivendi Visual').text('Vivendi Visual').appendTo(editionSelect);
                $('<option>').val('Viz Pictures').text('Viz Pictures').appendTo(editionSelect);
                $('<option>').val('Vudu').text('Vudu').appendTo(editionSelect);
                $('<option>').val('VVS Films').text('VVS Films').appendTo(editionSelect);
                $('<option>').val('VZ Handels').text('VZ Handels').appendTo(editionSelect);
                $('<option>').val('Warner Bros.').text('Warner Bros.').appendTo(editionSelect);
                $('<option>').val('Warner Music').text('Warner Music').appendTo(editionSelect);
                $('<option>').val('Well Go USA').text('Well Go USA').appendTo(editionSelect);
                $('<option>').val('WeTV').text('WeTV').appendTo(editionSelect);
                $('<option>').val('White Pearl Movies').text('White Pearl Movies').appendTo(editionSelect);
                $('<option>').val('Wicked-Vision Media').text('Wicked-Vision Media').appendTo(editionSelect);
                $('<option>').val('Wild Side Video').text('Wild Side Video').appendTo(editionSelect);
                $('<option>').val('WVG Medien').text('WVG Medien').appendTo(editionSelect);
                $('<option>').val('WWE Home Video').text('WWE Home Video').appendTo(editionSelect);
                $('<option>').val('X Rated Kult').text('X Rated Kult').appendTo(editionSelect);
                $('<option>').val('Yahoo TV').text('Yahoo TV').appendTo(editionSelect);
                $('<option>').val('Zima').text('Zima').appendTo(editionSelect);
                $('<option>').val('iQIYI').text('爱奇艺').appendTo(editionSelect);
                $('<option>').val('Deltamac').text('得利影視').appendTo(editionSelect);
                $('<option>').val('Ani Gamer').text('動畫瘋').appendTo(editionSelect);
                $('<option>').val('PTSPlus').text('公視+').appendTo(editionSelect);
                $('<option>').val('Kam & Ronson').text('千勣企業').appendTo(editionSelect);
                $('<option>').val('4gTV').text('四季線上').appendTo(editionSelect);
                $('<option>').val('TouchTTV').text('台視TouchTTV').appendTo(editionSelect);
                $('<option>').val('Tencent').text('腾讯').appendTo(editionSelect);
                $('<option>').val('CN Entertainment').text('香港華娛').appendTo(editionSelect);
                $('<option>').val('Shanghai Epic').text('新索音乐').appendTo(editionSelect);
                $('<option>').val('YOUKU').text('优酷').appendTo(editionSelect);
            };

            optionQuality()
            optionLabel()

            // 创建输入框 editionInput，并添加到容器中
            var editionInput = $('<input class="editInput">').attr('placeholder', 'Other').appendTo(newActionItem);

            // 当下拉列表框的选项改变时，将其值赋给输入框；当输入框的值改变时，将下拉列表框选中该值
            editionSelect.on('change', function () {
                var optionValue = $(this).val();
                editionInput.val(optionValue);
            });
            editionInput.on('input', function () {
                var inputValue = $(this).val();
                editionSelect.find('option').prop('selected', false).filter(function () {
                    return $(this).text() === inputValue;
                }).prop('selected', true);
            });

            // 创建确认按钮，并添加到新的动作项中
            var confirmBtn = $('<button class="button fn-button">').text('sbt.').appendTo(newActionItem);

            // 创建 p 标签，并添加到新的动作项中
            var resultText = $('<a style="cursor: pointer;padding-top: 4px;">').appendTo(newActionItem);

            // 点击确认按钮时的处理函数
            confirmBtn.on('click', function () {
                // 获取选择的值
                var quality = qualitySelect.val();
                var edition = editionInput.val();

                // 检查是否选择了值
                if (!quality || !edition) {
                    return;
                }

                // 构建字符串
                var result = `[${film_year}-${re_film_title}] ${re_film_id} [${quality}] {edition-${edition}}`;
                // 在 p 标签中显示结果
                resultText.text(result);
            });
            // 复制文件名
            resultText.on('click', function (event) {
                // 创建临时文本区域
                var tempTextArea = $('<textarea>').val($(this).text());
                // 将临时文本区域添加到页面中
                $('body').append(tempTextArea);
                // 选中文本
                tempTextArea.select();
                // 复制选中的文本
                document.execCommand('copy');
                // 从文档中移除临时文本区域
                tempTextArea.remove();
            });
        }


        // 查找豆瓣信息 构成相关标签
        async function processScanResult(scanResult) {

            const imdbID = imdb_nb
            // 调用 getDoubanID0 获取豆瓣 ID
            let douban_data = await getDoubanID0(imdbID);

            const douban_data_str = JSON.stringify(douban_data);

            // 判断豆瓣api是否找到条目
            if (douban_data_str.length > 12) {

                // 豆瓣api找到找到条目
                // 构造豆瓣相关标签
                let douban_title = douban_data.title;
                global_douban_title = douban_title
                let douban_id = douban_data.id;
                let douban_url = `https://movie.douban.com/subject/${douban_id}/`
                console.log(`豆瓣信息: ${douban_data_str}`);
                console.log(`豆瓣标题: ${douban_title}`);
                console.log(`豆瓣id: ${douban_id}`);
                console.log(`豆瓣链接: ${douban_url}`);


                // 创建豆瓣按钮
                if (douban_id !== undefined && !douban_id.match('\\?from=rec')) {
                    createDoubanButton(douban_url, douban_id);
                }

                // 添加中文标题
                addDoubanTitle(main_tmdb_zh_title, douban_title);

                // 创建搜索栏
                searchBars(imdb_nb, douban_id, film_title, film_year);

                // 生成电影文件名
                generateFilmFileName(film_year, douban_title, film_title, imdb_nb, tmdb_id);


            } else {

                // 豆瓣api没找到找到条目
                // 如果 getDoubanID0 返回默认值，则继续调用 getDoubanID1 获取豆瓣 ID
                if (douban_data === '00000000') {
                    douban_data = await getDoubanID1(imdbID);
                }

                // 如果 getDoubanID1 返回默认值，则继续调用 getDoubanID2 获取豆瓣 ID
                if (douban_data === '00000000') {
                    // douban_data = await getDoubanID2(imdbID);
                } else {
                    function getDoubanID1_getinfo() {
                        const douban_id = douban_data.split('|')[1].trim();

                        console.log(`getDoubanID2找到的豆瓣id: ${douban_id}`)
                        let douban_url = `https://movie.douban.com/subject/${douban_id}/`;

                        // 创建豆瓣按钮
                        if (douban_id !== undefined && !douban_id.match('\\?from=rec')) {
                            createDoubanButton(douban_url, douban_id);
                        }

                        // 创建搜索栏
                        searchBars(imdb_nb, douban_id, film_title, film_year);

                        generateFilmFileName(film_year, douban_title, film_title, imdb_nb, tmdb_id);

                        // 添加中文标题
                        addDoubanTitle(main_tmdb_zh_title, douban_title);
                    };
                    let douban_title = douban_data.split('|')[0].trim();
                    console.log(douban_title)
                    if (douban_title.length > 14 && douban_title.indexOf(' ') > -1) {
                        douban_title = douban_title.substr(0, douban_title.indexOf(' ')).trim();
                        console.log(douban_title)
                        getDoubanID1_getinfo();
                    } else {
                        getDoubanID1_getinfo();
                    }
                }

                // 如果 getDoubanID2 返回默认值，则继续调用 getDoubanID3 获取豆瓣 ID
                if (douban_data === '00000000') {
                    douban_data = await getDoubanID3(imdbID);
                    // 构造豆瓣相关标签
                    let douban_id = douban_data.douban_id;
                    let serch_douban_html = douban_data.result;

                    // 如果 getDoubanID3 未找到符合 ，则继续调用 getDoubanID4 获取豆瓣 ID
                    if (serch_douban_html.match("未找到符合")) {
                        douban_data4 = await getDoubanID4(imdbID);
                        douban_id = douban_data4.douban_id;
                        serch_douban_html = douban_data4.result;
                    }

                    const regex = /<h3\s+class="LC20lb MBeuO DKV0Md"[^>]*>(.*?)<\/h3>/i;
                    const match = serch_douban_html && serch_douban_html.match(regex);
                    let douban_title = '';
                    if (match) {
                        // .replace('- 电影- 豆瓣', '').replace('- 电视剧- 豆瓣', '')
                        let titleWithSuffix = match[1];
                        titleWithSuffix = titleWithSuffix.split("- ")[0];
                        if (titleWithSuffix.match(/[\u4e00-\u9fa5]/)) {  // 判断是否含有中文字符
                            douban_title = titleWithSuffix;
                        }
                    }

                    const douban_url = `https://movie.douban.com/subject/${douban_id}/`
                    console.log(`豆瓣 ID: ${douban_id}`);
                    console.log(`豆瓣 ID: ${douban_url}`);
                    // 创建豆瓣按钮
                    if (douban_id !== undefined && !douban_id.match('\\?from=rec')) {
                        createDoubanButton(douban_url, douban_id);
                    }
                    // 添加中文标题
                    addDoubanTitle(main_tmdb_zh_title, douban_title);
                    // 创建搜索栏
                    searchBars(imdb_nb, douban_id, film_title, film_year);

                    generateFilmFileName(film_year, douban_title, film_title, imdb_nb, tmdb_id);

                }
            }
        }

        processScanResult(imdb_nb);

    });


});

// 创建导演aka修改按钮
$(document).ready(function () {
    var dir_href = $('aside.sidebar p.text-link.text-footer a').first().attr('href');
    $('aside.sidebar p.text-link.text-footer')
        .append(`
\t\t\t\t\t\t<a style="text-transform: none;" id="dir_aka_edit" href="${dir_href}edit?active_nav_item=alternative_names&language=zh-CN"
class="micro-button">ed.AKA</a>`)
});

// 创建tmdb中文搜索栏
$(document).ready(function createTMDBChiSearchBOX() {

    GM_addStyle(` 
    .search-box-radius {
      border-radius: 20px !important;
    }
    .search-box {
      border-radius: 30px;
      position: fixed;
      top: 72px;
      right: 72px;
      width: 300px;
      padding: 5px;
      background-color: #202830;
      border: none;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: border-radius 0.3s ease-out; opacity 0.3s ease-out, visibility 0s linear 0.3s, filter 0.3s ease-out;
      filter: blur(10px);
    }
    
    .search-box.show {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.3s ease-in, visibility 0s linear 0s, filter 0.3s ease-in;
      filter: blur(0);
    }
    .search-box.hide {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-out, visibility 0s linear 0.3s, filter 0.3s ease-out;
      filter: blur(10px);
    }

    .search-results-fold {
        overflow-y: auto;
        height: 0px;
        transition: height 0.5s ease-out;
    }
    .search-results-unfold {
        margin-bottom: 5px;
        height: 400px;
    }  
    #tmdb-search-container input[type='text'] {
      display: block;
      height: 18px;
      line-height: 1.30769231;
      font-size: 1em;
      background-color: #456;
      padding: 6px 30px 6px 15px;
      border-radius: 15px;
      border: none;
      box-shadow: none;
      width: -webkit-fill-available;
      margin: 10px;
    }
    .chi-search-info {
      color: #678;
    }
    .chi-search-info:hover {
      color: #99AABB;
    }
    @media (max-width: 768px) {
      #tmdb-search-box {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: calc(80vw);
        height: 80vh;
      }
  `);

    // tmdb中文搜索 按键图标
    function createChiSearchIcno() {
        let imgChinese = 'data:image/webp;base64,UklGRjICAABXRUJQVlA4TCYCAAAvH8AHEGfDtm0jSZzZja7/Hi+8/BtH14PjRpIUKbpn+e78d+c' +
            '8wh+Ww7ZtJInObgl7d/1Xdy38sdvYtlXl7/vdQzdogJRCKYcGiMktdne4VYCRFABccV6eTs/DbOvPfzXOMqF6vZGYUBFWIepAYmzx0LSIR9+qvp' +
            '8/hiUvg4gMPnVwFC+SA4QFAwLcKu5Kq/hwYQEAgQ9+BwcCYAIIAEB54iRxcMYzKuKDX6Vf3ZAUZJRUk6o+0oqCefrXp13/LaYzN804nXs6s+7Q3' +
            '1f51F7W+Gz2dDK39e79c7/fHz3GNS2urOKRSlLE9Z+37uJNTmrX1+sxAQRJkk1b/fy+n23r2779bdv2/jdw5t57/g4i+j8BAFyx95EF2l4YeY+5' +
            'oB5+UvvnIYC7af7j1B2cLf5ryxmh5a3ei9CMNV4WLS3tAwjYKG5b2gIAj43tNZKv57fivoIu+Sg8SHJmhWy7oPlxlVwxyBS0l0iDZF5fk+Jcj66' +
            'IIXHx49t6Ugh+UXtC+Zug9iGnEqd9o5LfILncBwDOXQ0B4DlHpqEGab8DAM5c2aE8D2t4UeD0Qv2hxoVbRb6k1tE7s4M1PayaJWnVMBuLOs1wum' +
            'lmrJgU3LD8lDOZn5aGHbB5PyVNdaQ6xOtC9U7Ap7TTkMaeAbjOJsm9XzeAmzkpeyzx/e5hYJvicP9D9wvlK7xJpEGdb4Bv3UTruA+Av6av5od4k' +
            'mmtT+3NWt6bWm9lTgAA';
        let engSearch = $('nav.main-nav').find('li.js-nav-search-toggle');
        let chiSearch = $(`<li class="navitem"><a id="chi-search" href="#" class="chi-replace" style="background:none">
 <img src="${imgChinese}" style="height: 20px;margin-top: 4px;}"> </a></li>`);
        engSearch.after(chiSearch);
    };
    createChiSearchIcno();

    // tmdb中文搜索框
    function tmdbChiSearch() {
        // 获取指定<a>标签和整个页面
        const searchAnchor = $('a#chi-search');
        const page = $('body');

        // 创建TMDB搜索框，并设置样式
        const searchBox = $(
            '<div id="tmdb-search-box" class="search-box">' +
            '<div id="tmdb-search-container" style="height: 100%;">' +
            '<input type="text" style="color: #9ab;" placeholder="按回车搜索...">' +
            '<div id="tmdb-results" class="search-results-fold"></div>' +
            '</div>' +
            '</div>'
        ).appendTo(page);

        // 点击<a>标签显示/隐藏搜索框
        searchAnchor.click(function () {
            searchBox.toggleClass('show');

            if (searchBox.hasClass('show')) {
                searchBox.removeClass('hide');
                searchBox.css('opacity', '0');
                searchBox.css('visibility', 'hidden');
                setTimeout(function () {
                    searchBox.css('opacity', '');
                    searchBox.css('visibility', '');
                }, 0);
            } else {
                searchBox.addClass('hide');
                setTimeout(function () {
                    searchBox.removeClass('show');
                    searchBox.removeClass('hide');
                    searchBox.css('opacity', '');
                    searchBox.css('visibility', '');
                }, 300);
            }
        });

        // 监听输入框的回车事件；调用TMDB API搜索电影/电视剧
        searchBox.find('input').keydown(function (event) {
            if (event.keyCode === 13) { // 当用户按下回车键
                event.preventDefault();
                const keywords = $(this).val();
                searchBox.addClass('search-box-radius');
                $('#tmdb-results').addClass('search-results-unfold');

                // 匹配电影标题和年份的正则表达式
                var titlePattern = /^(.+?)(?:\s(\d{4}))?$/;

                // 格式化输入的搜索关键词
                var match = keywords.match(titlePattern);
                var kw_title = match[1];
                var kw_year = match[2] || "";

                // 输出结果
                console.log("tmdb搜索电影标题：" + kw_title);
                console.log("tmdb搜索发行年份：" + kw_year);

                searchTMDB(kw_title, kw_year);
            }
        });


        // 利用TMDB API搜索电影/电视剧
        function searchTMDB(kw_title, kw_year) {
            // 用输入的关键词调用TMDB API搜索电影/电视剧

            //https://api.themoviedb.org/3/search/movie?api_key=<YOUR_API_KEY>&query=<MOVIE_NAME>&year=<YEAR>
            //https://api.themoviedb.org/3/search/multi?api_key=${tmdb_api}&language=zh-CN&query=${encodeURIComponent(kw_title)}
            const tmdbApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_api}&language=zh-CN&query=${encodeURIComponent(kw_title)}&primary_release_year=${kw_year}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: tmdbApiUrl,
                onload: function (response) {
                    const searchResults = JSON.parse(response.responseText).results;
                    const chiSearchResultList = $('#tmdb-results').empty();
                    // 显示搜索结果
                    searchResults.forEach(function (result) {
                        console.log(result)
                        const tmdbId = result.id; // TMDB ID
                        const zhTitle = result.title || result.name; // 中文标题
                        const orTitle = result.original_title || result.original_name; // 英文标题
                        const releaseYear = result.release_date.slice(0, 4); //发行年份
                        const orLanguage = result.original_language // 原始语言

                        const posterUrl = 'https://image.tmdb.org/t/p/w92' + result.poster_path; // 海报缩略图

                        const genre_dict = {
                            28: '动作',
                            12: '冒险',
                            16: '动画',
                            35: '喜剧',
                            80: '犯罪',
                            99: '纪录',
                            18: '剧情',
                            10751: '家庭',
                            14: '奇幻',
                            36: '历史',
                            27: '恐怖',
                            10402: '音乐',
                            9648: '悬疑',
                            10749: '爱情',
                            878: '科幻',
                            10770: '电视电影',
                            53: '惊悚',
                            10752: '战争',
                            37: '西部'
                        }; // 类型id字典

                        // 取前三个类型id转换成中文类型
                        const movie_genre_ids = result.genre_ids.slice(0, 3);
                        const chiGenres = movie_genre_ids.map(genre_id => {
                            if (genre_dict[genre_id]) {
                                return genre_dict[genre_id];
                            }
                        }).join('/');

                        const moreChiInfo = releaseYear + "/" + chiGenres // 整合年份/国家/类型 信息


                        const chiSearchlistItem = $(`<div data-tmdb-id="${tmdbId}">`).css({
                            'height': '125px',
                            'border-bottom': '1px solid #303840',
                            'overflow': 'hidden',
                            'position': 'relative',
                        });

                        const chiSearchPoster = $(`<img src="${posterUrl}">`).css({
                            'display': 'inline-block',
                            'height': '105px',
                            'width': '70px',
                            'border-radius': '6px',
                            'transition': 'transform 0.2s'
                        }).hover( // 鼠标悬停时放大和阴影
                            function () {
                                $(this).css({
                                    'transform': 'scale(1.05)',
                                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.3)'
                                }).find('p').css({
                                    'transform': 'scale(1.05)',
                                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.3)'
                                });
                            },
                            function () {
                                $(this).css({
                                    'transform': 'scale(1.0)',
                                    'box-shadow': 'none'
                                }).find('p').css({
                                    'transform': 'scale(1.0)',
                                    'box-shadow': 'none'
                                });
                            }
                        );


                        const chiSearchLink = $(`<a href="https://letterboxd.com/tmdb/${tmdbId}/"></a>`).css({
                            'display': 'flex',
                            'height': '105px',
                            'margin': '10px',
                            'width': '280px',
                        });

                        const chiSearchZhTitle = $(`<div>${zhTitle}</div>`).css({
                            "font-size": "1.2em",
                            "color": "#99AABB",
                            "margin": "4px 5px",
                            'display': '-webkit-box',
                            '-webkit-box-orient': 'vertical',
                            '-webkit-line-clamp': '2',
                            'overflow': 'hidden',
                            'text-overflow': 'ellipsis'
                        });

                        const chiSearchOrTitle = $(`<div>${orTitle}</div>`).css({
                            'font-size': '13px',
                            'margin': '2.5px 5px',
                            'overflow': 'hidden',
                            'display': '-webkit-box',
                            '-webkit-box-orient': 'vertical',
                            '-webkit-line-clamp': '2',
                            'overflow': 'hidden',
                            'text-overflow': 'ellipsis'
                        });

                        const chiSearchMoreChiInfo = $(`<div>${moreChiInfo}</div>`).css({
                            'font-size': '13px',
                            'margin': '2.5px 5px',
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "display": "-webkit-box",
                            "-webkit-line-clamp": 2,
                            "-webkit-box-orient": "vertical"
                        });


                        const chiSearchInfo = $(`<div class="chi-search-info"></div>`).css({
                            'display': 'inline-block',
                            'display': 'flex',
                            'justify-content': 'center',
                            'flex-direction': 'center',
                            'flex-direction': 'column',
                            'align-items': 'flex-start',
                            'height': '105px',
                            'margin': '5px'
                        });


                        chiSearchResultList.append(chiSearchlistItem);
                        chiSearchlistItem.append(chiSearchLink);
                        chiSearchLink.append(chiSearchPoster).append(chiSearchInfo);

                        if (orLanguage === 'zh') {
                            chiSearchInfo.append(chiSearchZhTitle).append(chiSearchMoreChiInfo);
                        } else {
                            chiSearchInfo.append(chiSearchZhTitle).append(chiSearchOrTitle).append(chiSearchMoreChiInfo);
                        }
                    });
                },
            });
        }


    };
    tmdbChiSearch();

});

// 修复releases显示
$(document).ready(function () {

    GM_addStyle(`
    .release-display-all {
    display: block !important;
}
  `);

    $('#tab-releases .release-table-group').addClass('release-display-all');
    $("#tab-releases .release-table-group .header .smenu-wrapper").addClass('release-display-all');

    $('#tab-releases-by-country .release-table-group').addClass('release-display-all');
    $("#tab-releases-by-country .release-table-group .header .smenu-wrapper").addClass('release-display-all');

});


