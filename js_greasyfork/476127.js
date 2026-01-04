// ==UserScript==
// @name         Nozomi infinite scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds support for infinite scrolling on Nozomi.la
// @author       BicHD
// @match        https://*nozomi.la/*
// @icon         https://j.gold-usergeneratedcontent.net/apple-icon-180x180.png
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476127/Nozomi%20infinite%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/476127/Nozomi%20infinite%20scroll.meta.js
// ==/UserScript==

var page_number = Number(window.location.pathname.replace(/.+-(\d+)\.html/,"$1")) || Number(window.location.hash.substr(1)) || 1
var posts = [] // Use the posts array
const tns_per_page = 64
const popular = window.location.pathname.toLocaleLowerCase().includes("popular") ? "-Popular" : "";
const post_urls = /search(?:-Popular)?\.html/.test(window.location.pathname) ? new URL(window.location.href).searchParams.get("q").split(" ").reduce((urls, str) => {
    urls[str] = `https://j.nozomi.la/nozomi/${popular ? "popular/" : ""}${str.startsWith("-") ? str.slice(1) : str}${popular}.nozomi`;
    return urls;
}, {})
: { index: `https://n.nozomi.la/index${popular}.nozomi`};

async function get_json(post_id) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `//j.gold-usergeneratedcontent.net/post/${post_id.length < 3 ? post_id : (post_id.toString().replace(/^(.*(..)(.))/, '$3/$2/$1'))}.json`,
            headers: {'origin': "https://nozomi.la", 'referer': 'https://nozomi.la/'},
            onload: r => {
                try {
                    if (r.status === 404) {
                        // console.log(`Post not found (404): ${r.response}`);
                        return resolve(null);
                    }

                    if (r.status !== 200 || !r.responseHeaders.toLowerCase().includes("content-type:application/json")) {
                        return reject(new Error(`Invalid response or not JSON: ${r.response}`));
                    }
                    const postData = JSON.parse(r.responseText);
                    posts.push(postData);
                    resolve(postData);
                } catch(e) { reject(e); }
            },
            onerror: e => reject(e)
        });
    });
}

async function scroll_handler() {
    let scrollTop = (typeof pageYOffset != "undefined") ? pageYOffset : document.documentElement.scrollTop
    if (!(document.documentElement.scrollHeight - scrollTop - document.documentElement.clientHeight < 58 && document.querySelector('#loader-content.hidden'))) return
    document.getElementById('loader-content').classList.remove('hidden')
    page_number += 1

    if (Object.keys(post_urls).length == 1 && Object.keys(post_urls) == "index" && !Object.values(post_urls)[0].includes("/nozomi/")) {
        let start_byte = (page_number - 1) * tns_per_page * 4;
        let end_byte = start_byte + tns_per_page * 4 - 1;

        await get_post_range(post_urls.index, start_byte, end_byte)
    } else {
        let jsonPromises = [];
        trim_array(stored_postids).forEach(post_id => {
            jsonPromises.push(get_json(post_id))
        })

        await Promise.all(jsonPromises);
    }

    posts_to_page(posts)

    posts = []
    document.getElementById('loader-content').classList.add('hidden')
}

async function get_post_range(url, start_byte, end_byte) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: {'Range': `bytes=${start_byte}-${end_byte}`,'origin': "https://nozomi.la"},
            responseType: 'arraybuffer',
            onload: async function(response) {
                if (response.status < 200 || response.status >= 300) {
                    document.getElementById('loader-content').classList.add('hidden')
                    document.removeEventListener("scrollend", scroll_handler)
                    resolve();
                    return;
                }

                let view = new DataView(response.response);
                let jsonPromises = [];
                for (let i = 0; i < view.byteLength / 4; i++) {
                    let post_id = view.getUint32(i * 4, false /* big-endian */)
                    jsonPromises.push(get_json(post_id));
                }

                await Promise.all(jsonPromises);
                resolve();
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
}

function posts_to_page(posts) {
    posts.forEach(post => {
        var c = document.querySelector(".content")
        if (c) {
            var s = c.clientWidth;

            var n = Math.ceil(6.0*s/1000.0);
            var w = ((s - (10.0*n + 10.0) - 0.5) / n) - 2.0;

            var divs = document.querySelectorAll(".thumbnail-div");
            for (var i = 0; i < divs.length; i++) {
                var div = divs[i];
                div.style.width=(w+"px");
                div.style.height=(w+"px");
            }
        }
        document.querySelector("#thumbnail-divs > .thumbnail-div:last-child").insertAdjacentHTML('afterend',`<div class="thumbnail-div" style="width: ${w}px; height: ${w}px;"><a href="/post/${post.postid}.html"><img class="tag-list-img" src="//qtn.gold-usergeneratedcontent.net/${post.imageurls[0].dataid.replace(/^.*(..)(.)$/, '$2/$1/')}${post.imageurls[0].dataid}.${post.imageurls[0].type}.webp" title="" style=""></a></div>`);
    });
}

function trim_array(array) {
    let retval = array.slice();

    retval.splice(0, (page_number-1)*tns_per_page);
    retval.splice(tns_per_page);

    return retval;
};

document.addEventListener("scrollend", scroll_handler);