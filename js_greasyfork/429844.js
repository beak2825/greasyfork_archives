// ==UserScript==
// @name         Bilibili Anime HK Macau TW
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetch bilibili anime for HK Macau TW
// @author       You
// @match        https://www.bilibili.com/anime/*
// @match        https://www.bilibili.com/v/anime/*
// @match        https://www.bilibili.com/anime/?hkmotw
// @require      https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/429844/Bilibili%20Anime%20HK%20Macau%20TW.user.js
// @updateURL https://update.greasyfork.org/scripts/429844/Bilibili%20Anime%20HK%20Macau%20TW.meta.js
// ==/UserScript==
(function $$() {
    'use strict';

    if (!document || !document.documentElement) window.requestAnimationFrame($$)

    function addStyle(styleText) {
        const styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.textContent = styleText;
        document.documentElement.appendChild(styleNode);
        return styleNode;
    }

    let fetch = window.fetch;

    let $ = window.$;
    if (!$) return;

    function last(arr) {
        return arr[arr.length - 1]
    }

    /*
    function appendNextTo(elm){
        if(!elm || !elm.parentNode) return;
        elm.parentNode.insertBefore(, elm.nextSibling)
    }*/

    let dk = {}

    function getTyped(obj, key, type) {

        if (!obj) return null;
        let p = obj;
        for (const s of key.split('.')) {
            if (!p[s]) return null;
            p = p[s];
        }
        if (type == 'array') return Symbol.iterator in p ? p : null;
        return typeof p == type ? p : null;
    }

    function onReady() {

        setInterval(function() {

            if (!dk.crumb_item && document.querySelector('#app .bangumi-home-crumb li.crumb-item')) {

                let lastli = last(document.querySelectorAll('#app .bangumi-home-crumb li.crumb-item'));

                let menuli = $(lastli).clone().insertAfter(lastli)[0];
                dk.crumb_item = menuli;

                $(menuli.querySelector('a[href]'))
                    .attr('href', '//www.bilibili.com/anime/?hkmotw')
                    .text('港澳台');


            }

        }, 400)


    }



    if (document.readyState != 'loading') {
        onReady();
    } else {
        window.addEventListener("DOMContentLoaded", onReady, false);
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let _fTime = -1;

    let _fetchJson_mutex=Promise.resolve();

    function fetchJson(url, opts) {

        return new Promise(resolve=>{

            if (opts === undefined) {
                opts = {
                    method: 'GET',
                    //mode: 'no-cors',
                    cache: 'default',
                    redirect: "follow",
                }
            }

            _fetchJson_mutex=_fetchJson_mutex.then(()=>new Promise(mutex_resolve=>{

                setTimeout(async function(){

                    let w1 = performance.now();
                    let res_1 = await fetch(url, opts);
                    let w2 = performance.now();
                    _fTime = w2 - w1;
                    let rObj_1 = null;

                    if (res_1.status >= 200 && res_1.status < 300) {
                        rObj_1 = await res_1.json();
                    } else {
                        throw new Error(res_1.statusText);
                    }

                    resolve(rObj_1)

                },7)

                setTimeout(mutex_resolve,30);

            }))

        })



    }


    function sPad(x, n, char) {
        let m = n - x.length;
        if (m > 0) return new Array(m)
            .fill(char)
            .join('') + x;
        return x;
    }
    let toDate = (dt) => {

        let yyyy = dt.getFullYear();
        let mm = sPad((dt.getMonth() + 1) + '', 2, '0');
        let dd = sPad(dt.getDate() + '', 2, '0');

        return `${yyyy}-${mm}-${dd}`

    }

    let to_hhmmss=(date)=>{


        let hh = sPad(date.getHours() + '', 2, '0');
        let min = sPad(date.getMinutes() + '', 2, '0');
        let ss = sPad(date.getSeconds() + '', 2, '0');

        return `${hh}:${min}:${ss}`;

    }


    let nearestDate = (second) => {


        // 2 pm

        // 2pm  6pm  10pm 2am 6am 10am


        let aDate = new Date(second * 1000);

        let bDate = new Date(toDate(aDate) + ' 00:00:00');
        let cDate = new Date(+bDate + 86400000);
        bDate = new Date(+bDate + 50400000);
        cDate = new Date(+cDate + 50400000);
        let dDate = (aDate - bDate < cDate - aDate) ? bDate : cDate;


        return (+dDate) / 1000;

    }

    function sDate(date) {

        return `${toDate(date)} ${to_hhmmss(date)}`;



    }

    function dDate(date) {

        return Math.round(+date / 1000);
    }


    function deHTML(x) {
        deHTML.vDom = deHTML.vDom || $("<vdom></vdom>")[0];
        deHTML.vDom.innerHTML = x;

        return (deHTML.vDom.textContent || '')
            .trim();


    }

    function vdEntry_getTitle(vdEntry, title) {

        let zTitle = null;
        let _region = null;
        if (title.length > 0) zTitle = {
            aTitle: title.replace(/[\(（][僅仅][限限]([\u4E00-\u9FFF]+)[地地][區区][\)）]/, (_, a) => {
                    _region = a;
                    return '';
                })
                .trim(),
            region: _region
        };

        return zTitle;

    }

    function filterDetailedResults(obj) {

        function isValid(vEntry) {


            let zTitle = vEntry.__ztitle;

            if (!zTitle) return false;
            if (vEntry.season_id > 0) {} else {
                return false;
            }

            let ep_id = getTyped(vEntry, 'eps', 'array') ? last(vEntry.eps).id : 0;
            if (!ep_id) return false;

            return true;
        }


        let vlist = getTyped(obj, 'data.result', 'array')
        if (vlist) {


            for (const vEntry of vlist) {

                let zTitle = vdEntry_getTitle(vEntry, deHTML(vEntry.title));

                if (zTitle) {

                    let ep_size_1 = vEntry.ep_size > 0 ? vEntry.ep_size : 0;
                    let ep_size_2 = getTyped(vEntry, 'eps', 'array') ? vEntry.eps.length : 0;

                    if (ep_size_1 == ep_size_2) zTitle.ep_size = ep_size_1;

                }

                vEntry.__ztitle = zTitle;
                vEntry.__isValid = isValid(vEntry);

            }

            return vlist;


        }

        return null;


    }


    function cmp(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
    }

    function equals(a, b) {

        return a && b && typeof a == typeof b && ('length' in a ? a.join('|') == b.join('|') : a == b)
    }


    function getExtraction(str) {

        str = str.trim();
        let a1 = /^(今天)(\d+)\:(\d+)(更新)$/.exec(str)
        if (a1) {

            return {
                txt: [a1[1], a1[4]],
                result: sPad(a1[2] + '', 2, '0') + ':' + a1[3]
            };
        }


        let a2 = /^(昨天)(\d+)\:(\d+)(更新)$/.exec(str)
        if (a2) {

            return {
                txt: [a2[1], a2[4]],
                result: sPad(a2[2] + '', 2, '0') + ':' + a2[3]
            };
        }

        return null;
    }

    function jLoop(arr, reversed, f) {
        if (!reversed) {
            for (let vIdx = 0; vIdx <= arr.length - 1; vIdx++) {
                f(arr[vIdx])
            }
        } else {
            for (let vIdx = arr.length - 1; vIdx >= 0; vIdx--) {
                f(arr[vIdx])

            }
        }
    }

    function generate_xhr_results(resultObject,xhr){


        let szText = JSON.stringify(resultObject);

        var blob = new Blob(
            [szText], // Blob parts.
            {
                type: "text/plain;charset=utf-8"
            }
        );

        let szURL = URL.createObjectURL(blob);

        console.log(szURL)

        xhr._open_args[1] = szURL;
        xhr.abort();
        xhr.open(...xhr._open_args);
        xhr.send(...xhr._send_args);


    }

    async function letsgo(xhr) {


        var original_url = () => `https://bangumi.bilibili.com/api/timeline_v2_global?`;


        var detailed_url = (page) => `https://api.bilibili.com/x/web-interface/search/type?context=&search_type=media_bangumi&page=${page}&order=&keyword=%E5%83%85%E9%99%90%20%E5%9C%B0%E5%8D%80&category_id=&__refresh__=true&_extra=&highlight=1&single_column=0`;

        var timeorder_url = (page, pagesize) => `https://api.bilibili.com/pgc/season/index/result?season_version=1&spoken_language_type=1&area=-1&is_finish=-1&copyright=-1&season_status=-1&season_month=-1&year=-1&style_id=-1&order=0&st=1&sort=0&page=1&season_type=1&pagesize=${pagesize}&type=1`;

        let pms0_1 = fetchJson(timeorder_url(1, 240));
        let pms0_0 = fetchJson(original_url());

        let rObj_1 = await pms0_1;
        console.log(`fetch-1`, rObj_1)

        let orderedList_full = getTyped(rObj_1, 'data.list', 'array');


        if (!orderedList_full || orderedList_full.length == 0) {

            xhr.send(...xhr._send_args);
            return;
        }



        let pm_lastupdate_fix = ()=>new Promise(resolve => {

            pms0_0.then(rObj_0 => {

                console.log(`fetch-0`, rObj_0)
                let vResults_0 = getTyped(rObj_0, 'result', 'array');


                for (const vEntry of orderedList_full) {

                    let r = vResults_0.filter(ti_entry => ti_entry.season_id == vEntry.season_id)[0];

                    if (r) {

                        vEntry.lastupdate = r.lastupdate;
                        vEntry.lastupdate_at = r.lastupdate_at;

                    }

                }

                console.log('vResults_0', vResults_0)


            }).then(() => {

                let _temp = null;
                let _split = null;
                jLoop(orderedList_full, false, vEntry => {

                    if (vEntry.lastupdate > 0) {


                        _temp = {
                            lastupdate: vEntry.lastupdate
                        };

                        let mmss;
                        if (mmss = getExtraction(vEntry.order)) {
                            let split0 = vEntry.lastupdate_at.split(` ${mmss.result}:`)
                            if (split0.length == 2 && split0[0].length == 10 && split0[1].length == 2) {
                                _temp.timestr_order = mmss.txt
                                _temp.lastupdate_at_split = split0;
                            }
                        }



                    } else if (_temp) vEntry.__beforeitem_lastupdate = _temp;

                })

                _temp = null;

                jLoop(orderedList_full, true, vEntry => {

                    if (vEntry.lastupdate > 0) {


                        _temp = {
                            lastupdate: vEntry.lastupdate
                        };

                        let mmss;
                        if (mmss = getExtraction(vEntry.order)) {
                            let split0 = vEntry.lastupdate_at.split(` ${mmss.result}:`)
                            if (split0.length == 2 && split0[0].length == 10 && split0[1].length == 2) {
                                _temp.timestr_order = mmss.txt
                                _temp.lastupdate_at_split = split0;
                            }
                        }



                    } else if (_temp) vEntry.__afteritem_lastupdate = _temp;

                })

                console.log('orderedList_full', orderedList_full)



                for (const vEntry of orderedList_full) {
                    //decending order of update time



                    if (vEntry.lastupdate) continue;

                    let kDate = null;

                    if (vEntry.order) {
                        let mmss = getExtraction(vEntry.order);
                        if (vEntry.__beforeitem_lastupdate && vEntry.__afteritem_lastupdate && vEntry.order) {

                            let last_at_equal = equals(vEntry.__beforeitem_lastupdate.lastupdate_at_split, vEntry.__afteritem_lastupdate.lastupdate_at_split);


                            if (last_at_equal && equals(vEntry.__beforeitem_lastupdate.timestr_order, vEntry.__afteritem_lastupdate.timestr_order)) {

                                if (mmss) {
                                    kDate = new Date(vEntry.__beforeitem_lastupdate.lastupdate_at_split.join(` ${mmss.result}:`))
                                }

                            } else if (!last_at_equal && getExtraction(vEntry.order) && equals(getExtraction(vEntry.order)
                                    .txt, vEntry.__beforeitem_lastupdate.timestr_order)) {

                                if (mmss) {
                                    kDate = new Date(vEntry.__beforeitem_lastupdate.lastupdate_at_split.join(` ${mmss.result}:`))
                                }

                            } else if (!last_at_equal && getExtraction(vEntry.order) && equals(getExtraction(vEntry.order)
                                    .txt, vEntry.__afteritem_lastupdate.timestr_order)) {

                                if (mmss) {
                                    kDate = new Date(vEntry.__afteritem_lastupdate.lastupdate_at_split.join(` ${mmss.result}:`))
                                }

                            } else if (vEntry.__beforeitem_lastupdate.lastupdate > 0 && vEntry.__afteritem_lastupdate.lastupdate > 0) {
                                let dtt;
                                let earliest = vEntry.__afteritem_lastupdate.lastupdate
                                let latest = vEntry.__beforeitem_lastupdate.lastupdate
                                if (dtt = vEntry.order.match(/^(\d+)月(\d+)日更新$/)) {

                                    let d1 = (+new Date(new Date()
                                        .getFullYear() + `-${sPad(dtt[1],2,'0')}-${dtt[2]}`)) / 1000 + 1;

                                    let d2 = d1 + 24 * 60 * 60;
                                    if (d1 > 0 && d2 > 0) {
                                        earliest = earliest > d1 ? earliest : d1;
                                        latest = latest < d2 ? latest : d2;
                                    }
                                }


                                let _dDate = Math.round((earliest + latest) / 2);
                                kDate = new Date(_dDate * 1000);
                                if (dDate(kDate) != _dDate) kDate = null;


                            }


                        } else if ((vEntry.__beforeitem_lastupdate || vEntry.__afteritem_lastupdate) && vEntry.order) {

                            if (vEntry.__beforeitem_lastupdate && getExtraction(vEntry.order) && equals(getExtraction(vEntry.order)
                                    .txt, vEntry.__beforeitem_lastupdate.timestr_order)) {

                                if (mmss) {
                                    kDate = new Date(vEntry.__beforeitem_lastupdate.lastupdate_at_split.join(` ${mmss.result}:`))
                                }

                            } else if (vEntry.__afteritem_lastupdate && getExtraction(vEntry.order) && equals(getExtraction(vEntry.order)
                                    .txt, vEntry.__afteritem_lastupdate.timestr_order)) {

                                if (mmss) {
                                    kDate = new Date(vEntry.__afteritem_lastupdate.lastupdate_at_split.join(` ${mmss.result}:`))
                                }

                            }


                        }

                    }

                    if (kDate) {

                        vEntry.lastupdate = dDate(kDate)
                        vEntry.lastupdate_at = sDate(kDate)

                    }




                }


                console.log('orderedList_full', orderedList_full)




            }).then(() => {


                resolve();



            })


        })




        let seasons_id_ordered = orderedList_full.map(vEntry => {

            if (vEntry.season_id > 0) {} else return -1;

            let zTitle = vdEntry_getTitle(vEntry, vEntry.title);

            if (zTitle && zTitle.region) return vEntry.season_id;

            return -1;

        })

        let displayedCount = seasons_id_ordered.filter(s => s > 0).length;
        if (!displayedCount) {
            xhr.send(...xhr._send_args);
            return;
        }



        console.log('orderedList', orderedList_full.filter(vEntry => seasons_id_ordered.includes(vEntry.season_id)))

        let details_vlist = [];

        let detailed_page_max = 8;


        let pms_2 = [];

        let pms_additional = [];
        let details_not_found = [];

        function pm_additionalInfo(vdEntry){

            return new Promise(resolve=>{

                    (async ()=>{


                        let res_pm=fetchJson(`https://api.bilibili.com/x/space/arc/search?mid=11783021&ps=80&tid=13&pn=1&keyword=${encodeURIComponent(vdEntry.__ztitle.aTitle)}&order=pubdate&jsonp=jsonp`)
                        details_not_found.push(vdEntry)

                        let res= await res_pm;
                        resolve(res);

                    })();





                })

        }



        function detailP(rObj_2, detailed_page){

            if(detailed_page == 1 ) {

                console.log(`fetch-2p${detailed_page}-${_fTime}`, rObj_2)
                let page_max = getTyped(rObj_2, 'data.numPages', 'number')
                if (page_max > 0 && page_max < detailed_page_max) detailed_page_max = page_max

            };


            let filtered_results=filterDetailedResults(rObj_2).filter(vEntry => vEntry.__isValid)


            for (const vdEntry of filtered_results) {

                if ('__idx_ordered' in vdEntry) continue;
                vdEntry.__idx_ordered = seasons_id_ordered.indexOf(vdEntry.season_id);
                if (vdEntry.__idx_ordered >= 0) continue;


                if (!vdEntry.eps || !vdEntry.eps.length || !vdEntry.__ztitle || !vdEntry.__ztitle.aTitle) continue;
                let coverimg = last(vdEntry.eps).cover
                if (!coverimg) continue;


                pms_additional.push(pm_additionalInfo(vdEntry));





            }


            details_vlist.push(...filtered_results)
            console.log(detailed_page, details_vlist.length , displayedCount)

            return {original: rObj_2, filtered:filtered_results };
        }




        async function load_detailed_pages(pageFrom, pageTo){
            for (let detailed_page = pageFrom; detailed_page <= pageTo ; detailed_page++) {
                let pm = fetchJson(detailed_url(detailed_page)).then(res=>detailP(res,detailed_page))
                pms_2.push(pm)
            }
        }


        let dp_pageMax1=Math.ceil(displayedCount / 20)

        let rObj_2s;
        await load_detailed_pages(1, dp_pageMax1)
        rObj_2s = await Promise.all(pms_2)
        let max_page2 = Math.ceil(pms_2.length / rObj_2s.map(res=>res.filtered.length).reduce((a, b) => a + b, 0) * displayedCount);
        let max_page_final = Math.min(max_page2, detailed_page_max)

        if (rObj_2s.length===dp_pageMax1 && max_page_final>dp_pageMax1){
            await load_detailed_pages(dp_pageMax1+1, max_page_final)
            rObj_2s = await Promise.all(pms_2)
        }


        console.log('obatined details', details_vlist)
        console.log('details_not_found', details_not_found)


        await pm_lastupdate_fix();


        console.log('orderedList_full', orderedList_full)



        let time_orders = orderedList_full.map((entry, i) => {
                return {
                    season_id: entry.season_id,
                    order: entry.lastupdate + (i / orderedList_full.length) * 0.45
                }
            })
            .filter(entry => entry.season_id > 0 && entry.order > 0);

        console.log('time_orders', time_orders)

        if (details_not_found.length > 0) {


            let rObj_4s = await Promise.all(pms_additional);


            let i = 0;
            for (const vdEntry of details_not_found) {



                if (!vdEntry || !vdEntry.eps || !vdEntry.eps.length || !vdEntry.__ztitle || !vdEntry.__ztitle.aTitle) continue;
                let coverimg = last(vdEntry.eps).cover
                if (!coverimg) continue;
                let rObj_4 = rObj_4s[i];
                i++;

                let rRes_4 = getTyped(rObj_4, 'data.list.vlist', 'array');

                let allcovers = vdEntry.eps.map(
                    s => (s.cover || '').replace(/i\d.hdslb.com/, 'i0.hdslb.com')
                    ).filter(cover => typeof cover == 'string' && cover.length > 0);

                let subRes = rRes_4.filter(s => allcovers.includes(s.pic.replace(/i\d.hdslb.com/, 'i0.hdslb.com')));
                if (subRes.length == 0) continue;


                if (subRes[0].pic.replace(/i\d.hdslb.com/, 'i0.hdslb.com') == coverimg.replace(/i\d.hdslb.com/, 'i0.hdslb.com')) {} else continue;



                console.log('found-2b', vdEntry, subRes[0], subRes)

                time_orders.push({ season_id: vdEntry.season_id, order: subRes[0].created + 0.5 });

            }



        }


        time_orders = time_orders.sort((a, b) => b.order - a.order);

        console.log("time_orders", time_orders)
        //console.log("time_orders_k", time_orders.filter(s=>s.order-Math.floor(s.order)!=0.5).map(s=> ({season_id:s.season_id, k: to_hhmmss(new Date(Math.floor(s.order)*1000)).substr(3)})).sort((a,b)=>a.k.localeCompare(b.k)))

        let sortIdx = time_orders.map(s => s.season_id)

        let tnRes =[];

        if (details_vlist) {

            let vDate_fake = new Date;
            for (const vEntry of details_vlist) {



                let zTitle = vEntry.__ztitle

                let ep_id = last(vEntry.eps).id;

                let pic = last(vEntry.eps).cover //:vEntry.cover


                let _sort_order = seasons_id_ordered.indexOf(vEntry.season_id);

                let _time_order = time_orders.filter(s=>s.season_id == vEntry.season_id)[0];


                let orderedResult = null;
                let lastupdate = 0, lastupdate_at ='';

                if (_sort_order >= 0) {
                    orderedResult = orderedList_full[_sort_order];

                    if(orderedResult){
                        lastupdate=orderedResult.lastupdate
                        lastupdate_at=orderedResult.lastupdate_at
                    }

                }

                if(!lastupdate && _time_order){
                    lastupdate= Math.floor(_time_order.order)
                    console.log(vEntry.season_id, lastupdate, sDate(new Date( lastupdate * 1000 )) )

                    lastupdate_at = sDate(new Date( lastupdate * 1000 ))
                }


                tnRes.push({
                    "area": "日本",
                    "arealimit": 328,
                    "attention": 0,
                    "bangumi_id": 0,
                    "bgmcount": `${zTitle.ep_size||''}`,
                    "cover": `${pic}`,
                    "danmaku_count": 0,
                    "ep_id": ep_id,
                    "favorites": 0,
                    "is_finish": (orderedResult ? orderedResult.is_finish : 0),
                    "lastupdate": (lastupdate ? lastupdate : dDate(vDate_fake)), //1627095601,
                    "lastupdate_at": (lastupdate_at ? lastupdate_at : sDate(vDate_fake)), //"2021-07-24 11:00:01",
                    "new": (lastupdate ? lastupdate > Math.round(Date.now() / 1000 - 60 * 60 * 24) : false),
                    "play_count": 0,
                    "pub_time": "",
                    "season_id": vEntry.season_id,
                    "season_status": 13,
                    "spid": 0,
                    "square_cover": `${pic}`,
                    "title": `${zTitle.aTitle} 【${zTitle.region}】`,
                    "viewRank": 0,
                    "weekday": -1,
                    _sort_order:sortIdx.indexOf(vEntry.season_id)
                })
            }

        }



        console.log('tnRes', [...tnRes])

        tnRes = tnRes.filter(vEntry => vEntry._sort_order >= 0);
        console.log('unsorted', [...tnRes])
        tnRes = tnRes.sort((a, b) => cmp(a._sort_order, b._sort_order));

        console.log('sorted', tnRes)


        xhr._set_anime = true;

        let resultObject = {
            "code": 0,
            "message": "success",
            "result": tnRes
        };

        generate_xhr_results(resultObject, xhr)



    }


    if (location.search == '?hkmotw') {

        const hKey_fetch = 'mkjmtmvhwtyt'

        if (!XMLHttpRequest.prototype.open[hKey_fetch]) {

            XMLHttpRequest.prototype.open = (function(_open) {

                return function open() {

                    if (arguments[1] === "https://bangumi.bilibili.com/api/timeline_v2_global?") {

                        console.log(204)
                        this._set_anime = arguments[1];
                        //Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get.call(this))

                        this._open_args = [...arguments];
                        return _open.apply(this, arguments);
                    }
                    //console.log(arguments)
                    return _open.apply(this, arguments)
                }

            })(XMLHttpRequest.prototype.open)
            XMLHttpRequest.prototype.open[hKey_fetch] = true;


            XMLHttpRequest.prototype.send = (function(_send) {

                return function send() {

                    if (this._set_anime === "https://bangumi.bilibili.com/api/timeline_v2_global?") {

                        console.log(205)
                        this._send_args = [...arguments];
                        letsgo(this);
                        return;
                    }
                    return _send.apply(this, arguments)
                }

            })(XMLHttpRequest.prototype.send)
            XMLHttpRequest.prototype.send[hKey_fetch] = true;

        }




    }

    addStyle(`
    .timeline-box .timeline-item .preview img[src][lazy="loaded"], .timeline-box .timeline-item .preview img[src]:not([lazy]){
    background: black;
    object-fit: contain;
    filter: saturate(1.8) contrast(0.6) brightness(1.2);
    }
    `)


    // Your code here...
})();