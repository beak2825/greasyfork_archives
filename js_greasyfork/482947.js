// ==UserScript==
// @name         dc-fetch series
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  시리즈 게시글 목차 불러오기
// @author       You
// @match        https://gall.dcinside.com/board/view*
// @match        https://gall.dcinside.com/mgallery/board/view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482947/dc-fetch%20series.user.js
// @updateURL https://update.greasyfork.org/scripts/482947/dc-fetch%20series.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const CACHE_VALID_TIME = 3 * 3600 * 1000

    async function getCached(key)
    {
        const value = await GM.getValue(key);
        if(!value) return null;
        const parsed = JSON.parse(value);
        if(Date.now() - parsed.time >= CACHE_VALID_TIME) return null;
        return parsed.value;
    }

    async function setCached(key, value, forced = false)
    {
        const cached = getCached(key);
        if(!forced && JSON.stringify(value) === JSON.stringify(cached)) return cached;
        await GM.setValue(key, JSON.stringify({ value, time: Date.now() }));
        return value;
    }

    async function invalidateCached(key)
    {
        await GM.setValue(key, JSON.stringify({ value: null, time: -Infinity }));
    }

    function extractQueryString(href) // without ?
    {
        if(href.includes('?')) href = href.slice(href.indexOf('?') + 1)
        if(href.includes('#')) href = href.slice(0, href.indexOf('#'))
        return href;
    }

    function parseQueryString(str)
    {
        const pairs = extractQueryString(str).split('&').map(v => v.split('='))
        const map = new Map();

        for(let [key, value] of pairs){
            if(key.endsWith('[]')){
                key = key.slice(0, -2);
                value = value.split(',');
            }

            if(map.has(key)){
                const old = map.get(key)
                if(Array.isArray(old))
                    map.set(key, old.concat(value))
                else
                    map.set(key, [].concat(old, value))
            }else{
                map.set(key, value)
            }
        }

        return map;
    }

    async function fetchDom(uri)
    {
        const key = 'fetch|' + uri;
        let text = await getCached(key);
        if(text === null){
            console.log('fetch ' + uri);
            const res = await fetch(uri);
            text = await res.text();
            await setCached(key, text);
        }else{
            console.log('fetch ' + uri + ' from cache');
        }
        return new DOMParser().parseFromString(text, 'text/html');
    }

    async function search(id, keyword, is_mgallery = false)
    {
        const uri = `https://gall.dcinside.com/${is_mgallery ? 'mgallery/' : '' }board/lists`;
        const qs = `?id=${id}&s_type=search_subject_memo&s_keyword=${encodeURIComponent(keyword).replace(/%/g, '.')}`;
        const dom = await fetchDom(`${uri}${qs}`);
        console.log(dom);
        const search_list = dom.getElementById('kakao_seach_list');
        const trs = Array.from(search_list.getElementsByTagName('tr'));
        return trs.map(tr => {
            try{
                const $ = selector => tr.querySelector(selector)
                const text = element => element.innerText.trim()
                return {
                    no: +text($('.gall_num')),
                    uri: $('a').href,
                    title: text($('.gall_tit')),
                    gall_title: text($('.gall_name')),
                    date: text($('.gall_date'))
                }
            }catch(e){
                // console.error(dom, e)
                return null;
            }
        }).filter(article => article);
    }

    function parseTitle(title)
    {
        title = title.trim()
        if(title.match(/^.{0,4}\)/))
           title = title.split(')').slice(1).join(')');
        const matched = title.match(/(\d+)화/)
        if(matched !== null) {
            let comment = title.slice(matched.index + matched[0].length).trim()
            while(comment.startsWith('(') && comment.endsWith(')')){
                comment = comment.slice(1, -1).trim()
            }
            return {
                keyword: title.slice(0, matched.index).trim(),
                series_no: +matched[1].trim(),
                comment
            }
        } else {
            return {
                keyword: title,
                series_no: 1,
                comment: ''
            }
        }
    }

    function normalize(title)
    {
        return title.replace(/[[\]{}()~?!*&^%$#@+_":><';|\\ ,]/g, '')
    }

    function str_distance(a, b)
    {
        if(a === b) return 0;
        function make_pairs(str)
        {
            return Array(str.length-1).fill(null).map((_, i) => str.slice(i, i+2))
        }
        const a_pairs = make_pairs(a);
        const a_set = new Set(a_pairs);
        const b_pairs = make_pairs(b)
        const b_set = new Set(b_pairs);
        let distance = 1;

        b_pairs.forEach(pair => {
            if(!a_set.has(pair)) {
                ++distance
            }
        });

        a_pairs.forEach(pair => {
            if(!b_set.has(pair)) {
                ++distance
            }
        });

        return distance;
    }

    const query = parseQueryString(location.search)
    if(!query.has('id') || !query.has('no')) return;
    const id = query.get('id');
    const no = query.get('no');
    const title = document.getElementsByClassName('title_subject')[0].innerText;
    const {keyword, series_no, comment} = parseTitle(title);

    const search_result = await search(id, keyword, location.pathname.startsWith('/mgallery'));
    const normalized_keyword = normalize(keyword);
    const related = search_result
        .map(result => {
            return {
                ...result,
                ...parseTitle(result.title)
            }
        })
        .filter(article => {
            const article_qs = parseQueryString(article.uri)
            // if(article_qs.get('id') !== id) return false;
            return str_distance(normalize(article.keyword), normalized_keyword) <= 4
        })

    console.log('keyword', keyword);
    console.log('related', related);

    const series_article_sorted = related
        .concat({series_no, title, uri: location.href})
        .sort((a, b) => b.series_no - a.series_no);

    function is_same_article_uri(a, b) {
        if(typeof a !== 'string' || typeof b !== 'string') return false;
        const a_content_qs = parseQueryString(a);
        const b_content_qs = parseQueryString(b);
        return a_content_qs.get('id') === b_content_qs.get('id') && a_content_qs.get('no') === b_content_qs.get('no')
    }

    function series_content_assertion(dom) {
        const content = dom.getElementsByClassName('write_div')[0];
        if(content.innerHTML.length < 30) throw new Error('낚시(너무 짧음)');
        const series = dom.getElementsByClassName('dc_series')[0];
        if(!series) throw new Error('시리즈 없음');
    }

    async function getFail(uri)
    {
        const key = 'fail|' + uri;
        return await getCached(key);
    }


    async function setFail(uri, message)
    {
        const key = 'fail|' + uri;
        return await setCached(key, message);
    }

    async function getSeries(series_last_article)
    {
        const key = 'series|' + series_last_article.uri;
        const value = await getCached(key);

        if(value) return new DOMParser().parseFromString(value, 'text/html').body.children[0];

        const dom = await fetchDom(series_last_article.uri);
        series_content_assertion(dom);

        const series = dom.getElementsByClassName('dc_series')[0];
        const series_content = Array.from(series.children)

        const last_article_series_element = series_content.at(-2).cloneNode(true);
        last_article_series_element.href = series_last_article.uri;
        last_article_series_element.innerText = '· ' + series_last_article.title

        series.append(last_article_series_element)
        series.append(series_content.at(-1).cloneNode(true));

        await setCached(key, series.outerHTML)

        return series;
    }

    async function invalidate(uri)
    {
        await invalidateCached('fail|' + uri);
        await invalidateCached('series|' + uri);
    }

    // series_article_sorted.forEach(article => invalidate(article.uri));

    for(const series_last_article of series_article_sorted) {
        try{
            const lastFail = await getFail(series_last_article.uri);
            if(lastFail) throw { message: lastFail };

            const series = await getSeries(series_last_article);
            const series_content = Array.from(series.children)

            const content_self = series_content.filter(content => {
                if(typeof content.href !== 'string') return false;
                const content_qs = parseQueryString(content.href);
                return is_same_article_uri(content.href, location.href);
            });

            /*
            if(!is_same_article_uri(series_last_article.uri, location.href) && content_self.length === 0)
                throw new Error('자기 자신이 없음');
            */
            content_self.forEach(content => {
                content.style.fontWeight = 'bold';
            });

            const local_series = document.getElementsByClassName('dc_series')[0];
            const content = document.getElementsByClassName('write_div')[0];
            if(!local_series){
                content.prepend(series);
            }else{
                local_series.style.display = 'none';
                local_series.parentNode.insertBefore(series, local_series);
            }
            content.append(series.cloneNode(true))
            console.log('성공: ', series_last_article.uri);
            break;
        }catch(e){
            console.log('실패: ', series_last_article.uri, e);
            await setFail(series_last_article.uri, e.message);
        }
    }
})();