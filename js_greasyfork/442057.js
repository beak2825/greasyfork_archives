// ==UserScript==
// @name         JVbackup
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  pour backup le saint sanctuaire
// @author       flolep2607
// @match        https://www.jeuxvideo.com/forums/0-51-*.htm
// @match        https://www.jeuxvideo.com/forums/42-51-*.htm
// @icon         https://www.google.com/s2/favicons?domain=jeuxvideo.com
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442057/JVbackup.user.js
// @updateURL https://update.greasyfork.org/scripts/442057/JVbackup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const TIMER_SLEEP=5000;
    const DEBUG=false;
    const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const months=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const regex_code = /[0-9]+\-[0-9]+\-([0-9]+)\-[0-9]+\-[0-9]+\-[0-9]+\-[0-9]+/;
    const SUPPORT = (function () {
        if (!window.DOMParser) return false;
        var parser = new DOMParser();
        try {
            parser.parseFromString('x', 'text/html');
        } catch(err) {
            return false;
        }
        return true;
    })();
    const parser = SUPPORT?new DOMParser():null;

    const textToHTML=(html) => {
        // check for DOMParser support
        if (SUPPORT) {
            //let p =parser.parseFromString(html, 'text/html');
            //console.log(p.querySelectorAll("ul.topic-list > li[class='']"));
            return parser.parseFromString(html, 'text/html');
        }else{
            document.write(html)
            return document;
        }
    };
    const aa_fetch=(url_u)=>{
        return fetch(url_u).then(async u=>[await u.text(),u.url]).then((b)=>{
            //console.log("aa",b[0])
            return scrape(textToHTML(b[0]),b[1]);
        }).catch(r=>console.log(`!!req error:${r} url:${url_u}`));
    }
    const makeGetRequest=url=>{
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    resolve(response.responseText);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }
    let RUNNING=false;
    const farmer= async _=>{
        const checkbox=document.querySelector('#check_scrape');
        checkbox.addEventListener(
            "click",async _=>{
                let interval;
                while(checkbox.checked && !RUNNING){
                    RUNNING=true;
                    let TODO=[];
                    interval=setInterval(_=>{
                        aa_fetch("https://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm");
                    },5000)
                    await makeGetRequest(DEBUG?'http://localhost:3000/api/thread2scrape':'http://jvc.flolep.fr/api/thread2scrape')
                        .then(async json=>{
                        let result=[];
                        json=JSON.parse(json);
                        result.push(...json.data.map(r=>[1,r,1]).filter(u=>!result.map(i=>i[1]).includes(u[1]) && !TODO.map(i=>i[1]).includes(u[1])));
                        while(TODO.length<10&&result.length>0){TODO.push(result.pop())}
                        while(checkbox.checked && TODO.length>=10){
                            console.log(checkbox.checked);
                            TODO = await Promise.allSettled(
                                TODO.map((infos)=>{
                                    const url=`https://www.jeuxvideo.com/forums/42-51-${infos[1]}-${infos[0]}-0-1-0-u.htm`;
                                    //let final_url;
                                    return fetch(url).then(u=>u.text()).then((b)=>{
                                        const tmp=scrape(textToHTML(b),url);
                                        return [tmp[0],infos[1],infos[2]];
                                    }).catch(r=>console.log(`req error:${r} url:${url}`));
                                })).then(r=>{console.log('bunch scraped');return r})
                            TODO=TODO.filter(b=>b).map(r=>r.value);
                            console.log(">>",TODO);
                            TODO=TODO.filter(b=>b&&b[0]>b[2]);
                            while(TODO.length<10&&result.length>0){TODO.push(result.pop())}
                        }
                    });
                    RUNNING=false;
                }
                clearInterval(interval);
            }
        )
    }
    const actualiseur=a=>{
        while(document.querySelector('.bloc-pre-right')){
            const bloc=document.querySelector('.bloc-pre-right');
            //return
            if(bloc){
                bloc.classList.remove('bloc-pre-right');bloc.style='float: right;'
                if(a){
                    bloc.style='position: relative;right: unset;left: unset;top: unset;bottom: unset;overflow: hidden;display: flex;flex-wrap: wrap;justify-content: flex-end;margin-top: auto;flex: 1;'
                }
                bloc.innerHTML=`<div class="btn btn-actu-new-list-forum btn-actualiser-forum" style="float: right;border-color: var(--jv-text-secondary);background: transparent;color: var(--jv-text-secondary);text-transform: uppercase;font-weight: 700;padding: 0;font-size: .625rem;height: 1.75rem;min-width: 6.375rem;line-height: 1.6875rem;border-radius: 0.25rem;">Actualiser</button>`;
                const child=bloc.querySelector('div')
                child.classList.remove('btn-actu-new-list-forum')
                child.classList.remove('btn-actualiser-forum')
                //console.log(child)
                child.addEventListener(
                    "click",_=>{
                        fetch(document.URL).then(r=>r.text())
                            .then(u=>{
                            const data=textToHTML(u);
                            document.body.innerHTML=data.body.innerHTML;
                            scrape(document,document.URL);
                            actualiseur(a);
                        })
                    }
                )
            }
        }
    }
    const uniq_fast = a=> {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
            var item = a[i];
            if(seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out;
    }
    // `https://www.jeuxvideo.com/forums/42-51-${code}-1-0-1-0-ma-tante-est-morte.htm`
    //fetch('https://www.jeuxvideo.com/forums/42-51-49703882-21-0-1-0-qui-n-a-toujours-pas-eu-son-alloc-garantie-jeunes.htm').then(u=>u.text()).then(u=>document.write(u))
    const range = (u, l) => {
        var list = [];
        for (var i = u; i <= l; i++) {
            list.push(i);
        }
        return list;
    }
    if(document.URL.includes('forums/0-51-')){
        actualiseur();
        document.querySelector('div.header__nav.header__nav--primary').innerHTML=""
        document.querySelector('.header__globalWeb').innerHTML='<input id="check_scrape" type="checkbox" ><input id="addon_backup_start" class="xXx" style="width:64px" value="5"><input id="addon_backup_end" class="xXx" style="width:64px" value="20"><input id="addon_backup" class="xXx" style="width:64px" type="button">';
        document.getElementById("addon_backup").addEventListener(
            "click", async _=>{
                //let url="";
                let start=parseInt(document.getElementById("addon_backup_start").value);
                const end=parseInt(document.getElementById("addon_backup_end").value);
                while(start<end){
                    await Promise.allSettled(
                        range(start,(start+10-end)<0?start+10:end).map(i=>{
                            return aa_fetch(`https://www.jeuxvideo.com/forums/0-51-0-1-0-${1+i*25}-0-blabla-18-25-ans.htm`);
                        })
                    );
                    start=(start+10-end)<0?start+10:end;
                    console.log(`part done: ${start}`);
                }
                console.log("alldone");
                //for(let i=parseInt(document.getElementById("addon_backup_start").value);i<parseInt(document.getElementById("addon_backup_end").value);i++){
                //    url=`https://www.jeuxvideo.com/forums/0-51-0-1-0-${1+i*25}-0-blabla-18-25-ans.htm`
                //    aa_fetch(url);
                //}
            }
        );
        farmer();
    }else if(document.URL.includes('forums/42-51-')){
        actualiseur(1);
        document.querySelector('.header__globalWeb').innerHTML='<input id="check_scrape" type="checkbox" ><input id="addon_backup" class="xXx" style="width:64px" type="button">';
        document.getElementById("addon_backup").addEventListener(
            "click", async _=>{

                const DONES=[];
                let last = Date.now();
                let last_tmp;
                const thread_code=regex_code.exec(document.URL)[1];
                var url=`https://www.jeuxvideo.com/forums/42-51-${thread_code}-1-0-1-0-u.htm`;
                var resp=await fetch(url).then(r=>r.text())
                var data=textToHTML(resp);
                var tmp=scrape(data,url,DONES);
                DONES.push(...tmp[1]);
                let end=[...data.querySelectorAll("div.bloc-liste-num-page > span")].map(r=>parseInt(r.innerText)).filter(r=>r).reduce((before,now)=>now>before?now:before);
                console.log(end)
                //let end=parseInt(tmppppp[tmppppp.length-1].innerText);
                if(end>1){
                    var PAGED=2;
                    for(;PAGED<end;PAGED++){
                        await Promise.allSettled(
                            range(PAGED,PAGED+10>end?end:PAGED+10).map(PAGE=>{
                                const zurl=`https://www.jeuxvideo.com/forums/42-51-${thread_code}-${PAGE}-0-1-0-u.htm`
                                return fetch(zurl).then(r=>r.text()).then(resp=>{
                                    let _data=textToHTML(resp);
                                    [..._data.querySelectorAll('div.risibank-image-enhancer-buttons')].forEach(r=>r.remove())
                                    let _tmp=scrape(_data,zurl,DONES);
                                    DONES.push(..._tmp[1]);
                                    return 1
                                }).catch(e=>console.log("pd",e))
                            })
                        ).catch(e=>console.log("pd",e));
                        PAGED+=10
                    }
                }
                document.getElementById("addon_backup").style="width:64px;background-color:green"
                //setTimeout(_=>{
                //    document.getElementById("addon_backup").style="width:64px";
                //},5000)
                while(true){
                    const url=`https://www.jeuxvideo.com/forums/42-51-${thread_code}-${end}-0-1-0-u.htm`;
                    console.log(url)
                    resp=await fetch(url).then(r=>r.text())
                    data=textToHTML(resp);
                    end=[...data.querySelectorAll("div.bloc-liste-num-page > span")].map(r=>parseInt(r.innerText)).filter(r=>r).reduce((before,now)=>now>before?now:before);
                    //tmppppp=data.querySelectorAll("div.bloc-liste-num-page > span");
                    console.log("AAAAAA",end);
                    //end=parseInt(tmppppp[tmppppp.length-1].innerText);
                    [...data.querySelectorAll('div.risibank-image-enhancer-buttons')].forEach(r=>r.remove())
                    tmp=scrape(data,url,DONES);
                    if(tmp && tmp.length>=2){DONES.push(...tmp[1])}
                    last_tmp=Date.now();
                    console.log(`wait: ${last-last_tmp+TIMER_SLEEP} | ${end}`);
                    if(last-last_tmp+TIMER_SLEEP>0){await sleep(last-last_tmp+TIMER_SLEEP);}
                    last = Date.now();
                }
            }
        )
    }
    farmer();
    const scrape=(DOC,URL,banned=[])=>{
        let PAGE=1;
        if(URL.includes('forums/42-51-')){
            //console.log("DOC",DOC.body.innerText);
            const thread_code=parseInt(regex_code.exec(URL)[1]);
            const thread={
                code:thread_code,
                title:DOC.querySelector("#bloc-title-forum").innerText.trim(),
                url:URL
            };
            let USERS=[];
            PAGE=(DOC.querySelector('span.page-active') && DOC.querySelector('span.page-active').nextSibling)?DOC.querySelector('span.page-active').nextSibling.innerText:1;
            const posts=[...DOC.querySelectorAll('div.bloc-message-forum')]
            .map(post=>{
                //console.log(post);
                const date=post.querySelector('div.bloc-date-msg').innerText.trim().split(' ');
                const day=parseInt(date[0]);
                const month=months.indexOf(date[1]);
                const year=parseInt(date[2]);
                const time=date[4].trim().split(':')
                const hours=parseInt(time[0]);
                const minutes=parseInt(time[1]);
                const seconds=parseInt(time[2]);
                //console.log(year,month,day,hours,minutes,seconds);
                let avatar_url=null
                if(post.querySelector('div.bloc-avatar-msg img.user-avatar-msg')) {
                    const img=post.querySelector('div.bloc-avatar-msg img.user-avatar-msg').getAttribute("data-src")||post.querySelector('div.bloc-avatar-msg img.user-avatar-msg').src
                    if(![
                        "https://image.jeuxvideo.com/avatar-sm/default.jpg",
                        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                        null
                    ].includes(img)){
                        avatar_url=img
                    }
                }
                const pseudo=post.querySelector('.bloc-pseudo-msg')?post.querySelector('.bloc-pseudo-msg').innerText.trim():null;
                //console.log(pseudo,post.querySelector('.bloc-pseudo-msg'));
                [...post.querySelectorAll('div.risibank-image-enhancer-buttons')].forEach(r=>r.remove())
                USERS.push({
                    pseudo:pseudo,
                    image:avatar_url
                })
                //console.log(date,year,month,day,time,hours,minutes,seconds,new Date(year,month,day,hours,minutes,seconds).toISOString());
                return {
                    date:new Date(year,month,day,hours,minutes,seconds).toISOString(),//~~((new Date(year,month,day,hours,minutes,seconds)).getTime()/1000),
                    html:post.querySelector('div.bloc-contenu > div.txt-msg').innerHTML.trim(),
                    thread_code:thread_code,
                    id:post.getAttribute("data-id"),
                    pseudo:pseudo,
                }
            }).filter(r=>!banned.includes(r.id))
            USERS=uniq_fast(USERS);
            if(posts.length){
                //console.log(posts);
                GM_xmlhttpRequest({
                    method: "POST",
                    headers:    {
                        "Content-Type": "application/json"
                    },
                    data:JSON.stringify({thread:thread,posts:posts,users:USERS}),
                    url: DEBUG?'http://localhost:3000/api/newposts':"http://jvc.flolep.fr/api/newposts"
                });
                return [PAGE,posts.map(r=>r.id)];
            }else if(DOC.querySelector('div.col-md-12:nth-child(2) > strong:nth-child(1)')){
                const ban=DOC.querySelector('div.col-md-12:nth-child(2) > strong:nth-child(1)').innerHTML.includes('modération')?2:1;
                GM_xmlhttpRequest({
                    method: "POST",
                    headers:    {
                        "Content-Type": "application/json"
                    },
                    data:JSON.stringify({type:ban,code:thread_code}),
                    url: DEBUG?'http://localhost:3000/api/banthread':"http://jvc.flolep.fr/api/banthread"
                });
                return [PAGE,null];
            }
        }else if(URL.includes('forums/0-51-')){
            //console.log(">>>>",URL,DOC.querySelectorAll("li[data-id]"))
            const data=[...DOC.querySelectorAll("li[data-id][class='']")]
            .filter(r=>r && r.getAttribute("data-id")!="63346087")
            .map(thread=>{
                const date_string=thread.querySelector('span.topic-date').innerText.trim();
                //console.log(date_string,thread.querySelector('span.topic-date').innerText.trim())
                let datee;
                if(date_string.includes('/')){
                    datee=(new Date(date_string))/1000
                }else{
                    const now=new Date();
                    datee=~~((now.setHours(...date_string.split(":")))/1000)
                }
                //console.log(">>",thread);
                //console.log("datee",datee)
                return {
                    title:thread.querySelector('a.topic-title').getAttribute('title'),
                    date:datee,
                    responses:parseInt(thread.querySelector('span.topic-count').innerText),
                    code:thread.getAttribute("data-id"),
                    link:`https://api.jeuxvideo.com/forums/42-51-${thread.getAttribute("data-id")}-1-0-1-0-u.htm`
                }});
            //console.log(JSON.stringify(data));
            if(data.length>0){
                GM_xmlhttpRequest({
                    method: "POST",
                    headers:    {
                        "Content-Type": "application/json"
                    },
                    data:JSON.stringify(data),
                    url: DEBUG?'http://localhost:3000/api/newfeed':"http://jvc.flolep.fr/api/newfeed"
                });
            }
            return [PAGE,data.map(r=>r.code)];
        }
    }
    scrape(document,document.URL);
})();