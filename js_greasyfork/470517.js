// ==UserScript==
// @name         動畫瘋評分顯示
// @namespace    Anong0u0
// @version      0.2.3
// @description  簡單粗暴地為每個動畫封面添加評分顯示，並排序
// @author       Anong0u0
// @match        https://ani.gamer.com.tw/animeList.php*
// @match        https://ani.gamer.com.tw/mygather.php*
// @match        https://ani.gamer.com.tw/*
// @icon         https://i.imgur.com/2aijUa9.png
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470517/%E5%8B%95%E7%95%AB%E7%98%8B%E8%A9%95%E5%88%86%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/470517/%E5%8B%95%E7%95%AB%E7%98%8B%E8%A9%95%E5%88%86%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

const delay = (ms = 0) => {return new Promise((r)=>{setTimeout(r, ms)})}

const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(selectCount != 1) {if((result = document.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
}

let lastRequestTime = 0;
const requests = (method, url, data = null, headers = {}) => {
    return new Promise(async (resolve) => {
        //console.log(`Requesting ${url}`);
        const timeSinceLastRequest = Date.now() - lastRequestTime;
        if (timeSinceLastRequest < 500) {
            //console.log(`Delaying request by ${600 - timeSinceLastRequest}ms`);
            await delay(600 - timeSinceLastRequest); // avoid 429
        }
        lastRequestTime = Date.now();

        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            data: data,
            onload: resolve
        });
    });
};

const ls = localStorage,
    cacheTime = 604800000; // 7 days
let debounceID = 0;
const ratinger = {
    // ls["ratingCache"]["refID"] = [rating, imgID, cacheTimestamp]
    cache: {},
    updateCache: function(){this.cache = this.lsGet("ratingCache") || {}},
    updateLS: function(){
        clearTimeout(debounceID);
        debounceID = setTimeout(()=>{this.lsSet("ratingCache", this.cache)}, 1000);
    },
    get: async function(refID) {
        if(refID in this.cache && Date.now() - this.cache[refID][2] < cacheTime) return this.cache[refID];
        const res = (await requests("get", `https://ani.gamer.com.tw/animeRef.php?sn=${refID}`));
        const rating = JSON.parse(`[${res.responseText.match(/(?<='#acg_review', )[^}]+}/)}]`);
        const avgRating = ([1,2,3,4,5].reduce((adder, score)=>Number(adder) + rating[1][score]*score, 0) / rating[0]).toFixed(4);
        const imgID = res.responseText.match(/(?<=https:\/\/p2\.bahamut\.com\.tw\/B\/ACG\/c\/\d{2}\/)0*([^\.]+)/)[1];
        if(avgRating==Infinity)
        {
            const score = [1,2,3,4,5].reduce((adder, score)=>Number(adder) + rating[1][score]*score, 0),
                total = [1,2,3,4,5].reduce((adder, score)=>Number(adder) + rating[1][score], 0),
                avg = (score/total).toFixed(4);
            this.cache[refID] = [avg, imgID, Date.now()-cacheTime+3600000];
        }
        else this.cache[refID] = [avgRating, imgID, Date.now()];
        this.updateLS();
        return this.cache[refID];
    },
    lsGet: function(key, jsonParse = true) {return jsonParse ? JSON.parse(ls.getItem(key) || "{}") : ls.getItem(key)},
    lsSet: function(key, value, stringify = true) {ls.setItem(key, stringify?JSON.stringify(value):value)}
};
ratinger.updateCache();

(async ()=>
{
    Node.prototype.prependChild = function(element) {return this.insertBefore(element, this.firstChild)}
    const lists = await waitElementLoad("div.theme-list-block", 0, 10, 200)
    for (const list of lists)
    {
        let count = 0
        const label = document.createElement("label")
        label.style="padding-left:1em;"
        label.innerHTML=`<input checked="true" type="checkbox" style="width:1.5em;height:1.5em;">依評分排序`
        list.parentElement.querySelector(".theme-title-block").firstElementChild.append(label)

        let debounceID = 0;
        const observer = new MutationObserver((m)=>{
            if(m.some((e)=>[...e.addedNodes].some((e)=>e.nodeName!="A")))
            {
                // console.log("in update")
                clearTimeout(debounceID)
                debounceID = setTimeout(update, 500)
            }
        })

        const update = async () => {
            observer.disconnect()
            // console.log("start update")
            const elements = [...list.querySelectorAll("a.theme-list-main[href^='animeRef.php?sn=']")]
            const tip = document.createElement("span")
            tip.style="padding-left:1em;"
            tip.innerText = `讀取評分中(${count}/${elements.length})`
            label.insertAdjacentElement("beforebegin", tip)
            for (const element of elements)
            {
                if(element.rating) continue;
                const refID = element.href.match(/(?<=sn=)\d+/g);
                const [avgRating, imgID] = (await ratinger.get(refID)).map((v)=>Number(v));

                const ratingBlock = document.createElement("div")
                ratingBlock.className = "anime-label-block"
                ratingBlock.style = "position: absolute;top: 6px;bottom: unset;width: auto;margin-left: 8px;"
                ratingBlock.innerHTML = `<span class="label-edition color-paid" style="background-color: var(--anime-primary-color);">${avgRating.toFixed(2)}</span>`
                element.querySelector(".theme-img-block").append(ratingBlock)
                element.rating = avgRating
                element.order = count
                tip.innerText = `讀取評分中(${++count}/${elements.length})`
            }
            tip.remove()
            label.onclick = ()=>
            {
                if(label.firstElementChild.checked) elements.sort((a, b)=> a.rating-b.rating).forEach((e)=>{list.prependChild(e)})
                else elements.sort((a, b)=> b.order-a.order).forEach((e)=>{list.prependChild(e)})
            }
            if(label.firstElementChild.checked) label.onclick()
            observer.observe(list, {childList: true, subtree: true})
        }
        await update().then(()=>{observer.observe(list, {childList: true, subtree: true})})
    }

    for(const e of document.querySelectorAll(`a.anime-card-block[href^="animeVideo.php?sn="]`))
    { // homepage timeline anime
        const refID = e.parentElement.parentElement.parentElement.getAttribute("data-animesn")
        const avgRating = Number((await ratinger.get(refID))[0]);
        const ratingBlock = document.createElement("div")
        ratingBlock.className = "anime-label-block"
        ratingBlock.innerHTML = `<span class="label-edition color-paid" style="background-color: var(--anime-primary-color);">${avgRating.toFixed(2)}</span>`;
        if(e.querySelector(".anime-hours-block"))
        {
            ratingBlock.style = "position: absolute;bottom: -2px;right: -40px;"
            e.querySelector(".anime-hours-block").append(ratingBlock)
        }
        else
        {
            ratingBlock.style = "position: absolute;top: 6px;left: 6px;width: auto;"
            e.querySelector(".anime-pic-block").append(ratingBlock)
        }
    };
    // TODO: sort anime by rating (read all page)
})();




