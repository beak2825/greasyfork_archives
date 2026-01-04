// ==UserScript==
// @name         Universal Website Utility
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A large script filled with custom functions I'd use in multiple different sites. It's used side by side with Image Board Enhancer as most functions are probably implemented better by it. The only exception to that is gelbooru, which has some errors when resizing the images; I implemented my own resizing based on their concept.
// @author       RatCheese1608
// @match        *://danbooru.donmai.us/posts?tags=*&z=*
// @match        *://danbooru.donmai.us/posts/*
// @match        *://gelbooru.com/index.php?page=post*&id=*
// @match        *://rule34.xxx/index.php?page=post*
// @match        *://nhentai.net/g/*/
// @match        *://exhentai.org/g/*
// @match        *://iqdb.org/?url=*
// @match        *://app.prodia.com/*
// @match        *://realbooru.com/*
// @match        *://www.tokyomotion.net/*
// @match        *://www.xasiat.com/videos/*/*
// @match        *://pmvhaven.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prodia.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xasiat.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gelbooru.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqdb.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tokyomotion.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pmvhaven.com
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491805/Universal%20Website%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/491805/Universal%20Website%20Utility.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var site = window.location;
    var host = site.host;
    var alr_rs = 0;

    function expand(obj) {
        var keys = Object.keys(obj);
        keys.forEach((cv, i)=> {
            var key = keys[i],
                subkeys = key.split(/,\s?/),
                goal = obj[key];
            delete obj[key];
            subkeys.forEach(function (key){obj[key]=goal;})
        })
        return obj;
    }

    function byXPath(xp) {
        return document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    const observerConfig = {childList: true, subtree: true};

    const comments = expand({
        "danbooru.donmai.us, rule34.xxx":()=>{return false},
        "gelbooru.com": ()=> {
            document.querySelector('a#showCommentBox').click();
        },
    })

    const edit_tags = expand({
        "danbooru.donmai.us":()=>{return false},
        "gelbooru.com": ()=> {
            document.querySelector('a.showEditBox').click();
        },
        "rule34.xxx": ()=> {
            setTimeout(()=>unsafeWindow.toggleEditForm(),250);
        }
    })

    const favorite = expand({
        "danbooru.donmai.us":()=>{return false},
        "gelbooru.com": id =>{
            unsafeWindow.post_vote(id, 'up');
            unsafeWindow.addFav(id);
        },
        "rule34.xxx": id =>{
            let notice = document.querySelector('div#notice');
            notice.style.cssText = `position:fixed; top:5px; left:50%; transform:translate(-50%,0);
            display:block; opacity:1; padding:3px; height:auto; width:30vw; text-align:center;
            background:yellow;`
            unsafeWindow.post_vote(id, 'up');
            unsafeWindow.addFav(id);
            let fade = setInterval(()=>{
                if(notice.textContent!='') {
                    if(notice.style.opacity<=0) {
                        notice.style.display='none'
                        clearInterval(fade);
                    }
                    notice.style.opacity-=1/62.5;
                }
            },40)
        }
    })

    const unfavorite = expand({
        "danbooru.donmai.us":'',
        "gelbooru.com, rule34.xxx": id =>{
            let del_fav=document.createElement('a');
            del_fav.href="index.php?page=favorites&s=delete&id="+id;
            del_fav.click();
        },
    })

    const get_art = expand({
        "danbooru.donmai.us, rule34.xxx":()=>{return false},
        "gelbooru.com, realbooru.com": ()=> {
            return document.querySelector('#image');
        },
    })

    const get_id = expand({
        "danbooru.donmai.us": ()=>{return false},
        "gelbooru.com, rule34.xxx, realbooru.com": ()=> {
            return site.href.match(/id=(\d+)/i)[1]
        },
    })

    const scrollView = expand({
        "danbooru.donmai.us, rule34.xxx": ()=>{return false},
        "gelbooru.com, realbooru.com": (art)=> {
            reSize(art);
            art.scrollIntoView();
        },
    })

    function reSize (art) {
        var is_video = false;
        // video resize
        if (!art) {
            art = document.querySelector("#gelcomVideoPlayer");
            is_video = true;
        }
        // true function
        let rs = ()=>{
            let ratio = art.width/art.height;
            art.classList.remove("fit-width");
            art.classList.add("resized-by-you");
            art.style.width = 'auto';
            art.style.height = window.innerHeight+'px';
            if (ratio>1 && window.innerWidth/ratio <= window.innerHeight) {
                art.style.height = 'auto';
                art.style.width = window.innerWidth+'px';
            }
            setTimeout(()=>{art.scrollIntoView()}, 500);
        }
        // triggers
        if (alr_rs) rs();
        else {
            let obs = new MutationObserver((MutationList, observer)=>{
                if (is_video || (art.width>0 && art.height>0)) {
                    observer.disconnect();
                    alr_rs = 1;
                    rs();
                }
            })
            obs.observe(document.body, observerConfig);
            setTimeout(obs.disconnect,5000);
        }
        return art;
    }

    function pageShorts(id,art) {
        console.log("Shortcuts ready")
        document.addEventListener('keypress', e => {
            e = e || window.event;
            let focusElm = document.activeElement.tagName;
            console.log(focusElm);
            if (['TEXTAREA','INPUT'].find(e=>e==focusElm)) return;
            console.log(e.key);
            switch(e.key) {
                case 'f':
                        console.log("Favorite")
                        favorite[host](id);
                    break;
                case 'F':
                    if (!e.shiftKey) break;
                        console.log("unFavorite")
                        unfavorite[host](id);
                    break;
                case 'e':
                    edit_tags[host]();
                    break;
                case 'c':
                    comments[host]();
                    break;
                case ']':
                    scrollView[host](art);
                    break;
                case '[':
                    reSize(art);
                    break;
            }
        });
    }

    const utility = expand({
        "danbooru.donmai.us": () => {return false },
        "gelbooru.com, realbooru.com": () => {
            let id = get_id[host]()
            let art = get_art[host]()
            art = reSize(art);
            pageShorts(id,art);
        },
        "rule34.xxx": () => {
            let queryValue = new URLSearchParams(window.location.search);
            if (queryValue.get('s')=='list') {
                document.querySelector('div.sidebar').style.marginTop='5em';
                document.querySelector('div.content').style.marginTop='5em';
                let tagSearch = document.querySelector('div.tag-search');
                tagSearch.style.cssText=`
                    position: absolute;
                    margin-top: -5em !important;
                    width: 95%;
                `;
            } else if (queryValue.get('s')=='view') {
                let id = get_id[host]()
                let art = get_art[host]()
                pageShorts(id,art);

                // set video volume and loop settings
                let observer = new MutationObserver((mutationList, observer)=>{
                    let video = document.querySelector('video');
                    if (video && video.src && video.hasAttribute('loop')) {
                        observer.disconnect();
                        video.removeAttribute('loop');
                        video.volume='1';
                    }
                })
                observer.observe(document.body, observerConfig);
                setTimeout(observer.disconnect,10000);

                // allow copypaste of tags and immediate add
                let taggy = document.querySelectorAll("li.tag span");
                let tagBox = document.querySelector("input[name='tags']");
                taggy.forEach((elem)=>{
                    let funnyValue = elem.parentNode.children[1].textContent.trim().replaceAll(/\s/gm,"_");
                    elem.addEventListener("mouseenter", (e)=>{e.target.style.color="red"});
                    elem.addEventListener("mouseleave", (e)=>{e.target.style.color=""});
                    elem.addEventListener("contextmenu", (e)=>{
                        e.preventDefault();
                        navigator.clipboard.writeText(funnyValue);
                        e.target.style.color="blue";
                    });
                    elem.addEventListener("click", (e)=>{
                        tagBox.value = (tagBox.value + " "+funnyValue).trim();
                        e.target.style.color="indigo";
                    });
                });

                // remove last tag in input
                let tagSidebar = document.querySelector("ul#tag-sidebar");
                let i_remover = document.createElement("h6");
                i_remover.appendChild(document.createTextNode("Delete"));
                let l_remover = document.createElement("li")
                l_remover.appendChild(i_remover);
                tagSidebar.insertBefore(l_remover, tagSidebar.firstChild);
                i_remover.addEventListener("selectstart", (e) => e.preventDefault());
                i_remover.addEventListener("mouseenter", (e)=>{e.target.style.color="magenta"});
                i_remover.addEventListener("mouseleave", (e)=>{e.target.style.color=""});
                i_remover.addEventListener("click", (e)=> {
                    console.log(tagBox);
                    tagBox.value = tagBox.value.trim().replace(/\S*$/gm, "").trim();
                    e.target.style.color="violet";
                    setTimeout(()=>{e.target.style.color="magenta";}, 500);
                });
            }
        },
        'nhentai.net': () => {
            let jp_title = document.querySelector('h2.title span.pretty');
            if (!jp_title) jp_title = document.querySelector("h1.title span.pretty");
            jp_title = jp_title.textContent;
            let redirect = document.createElement('a');
            let chp_lang = byXPath("//div[contains(text(),'Languages')]//a[not(contains(@href,'translated'))][1]/span[@class='name']");
            // let chp_lang = document.querySelector('#tags > div:nth-child(6) > span > a:nth-child(2) > span.name');
            redirect.href = 'https://exhentai.org/?f_search="'+jp_title+'"';
            if (chp_lang.textContent != 'japanese') redirect.href += ' language:'+chp_lang.textContent+'$';
            redirect.classList = 'btn btn-secondary';
            redirect.append(document.createTextNode("Exhentai"));
            redirect.target='_blank';
            redirect.style.cssText = `margin: 0; min-width: 100px; text-align: center; background-color: dodgerblue`
            document.querySelector('.buttons').insertAdjacentElement('afterend',redirect);
        },
        'exhentai.org': ()=>{
            let jp_title = byXPath("//div[@id='gd2']/h1[string-length(text()) > 0][last()]").textContent;
            jp_title = jp_title.replace(/\[.*?\]|\(.*?\)|\{.*?\}/gm,'').trim();
            let redirect = document.querySelector('p.g2.gsp').cloneNode(true);
            byXPath("//a[@id='renamelink']/parent::p").insertAdjacentElement('afterend',redirect);
            redirect = redirect.childNodes[2];
            redirect.href = 'https://nhentai.net/search/?q="'+jp_title+'"';
            let chp_lang = byXPath("//div[@id='taglist']//a[contains(@id,'language') and not((contains(@id,'translated')))]");
            if (chp_lang) redirect.href += ' language:'+chp_lang.textContent;
            redirect.textContent = 'Open in Nhentai'
            redirect.target='_blank';
            redirect.onclick='';
            redirect.style.cssText = `margin: 0; min-width: 100px; text-align: center`
        },
        'iqdb.org': () => {
            console.log('ran')
            let imageLink = decodeURIComponent(new URLSearchParams(window.location.search).get("url"));
            let openImage = new Image();
            let sendImage = document.createElement('a');
            sendImage.textContent = '<= Send to ImgOps =>';
            sendImage.href = 'https://imgops.com/'+imageLink;
            sendImage.target = '_blank';
            openImage.src = imageLink;
            document.querySelector('div.flow').insertAdjacentElement('afterend',sendImage);
            sendImage.insertAdjacentElement('afterend',openImage);
        },
        'app.prodia.com': () => {
            console.log('ran')
            document.querySelector('#app > div > div.results-section.mint-card > div.results').style.gridTemplateColumns='1fr 1fr 1fr 1fr';
        },
        'www.tokyomotion.net': () => {
            console.log('ran');
            document.querySelector('#fluid_video_wrapper_vjsplayer').style.height='75vh';
            document.querySelector('#fluid_video_wrapper_vjsplayer').style.width='auto';
            document.querySelector('#flash').style.height='75vh';
        },
        'www.xasiat.com': () => {
            let observer = new MutationObserver((mutationList, observer)=>{
                let video = document.querySelector('#kt_player video');
                if (video.src) {
                    observer.disconnect();
                    console.log('Loaded');
                    let menu = document.querySelector('div.tabs-menu > ul');
                    let download = menu.lastElementChild.cloneNode(true);
                    menu.appendChild(download);
                    download = menu.lastElementChild.firstElementChild;
                    download.textContent = 'Download Video';
                    download.style.backgroundColor = 'DarkGreen';
                    let name = document.querySelector('div.headline > h1').textContent;
                    download.href=video.src;
                    download.setAttribute('id','download-button');
                    download.setAttribute('target','_blank');
                    // download.setAttribute('download', name+'.mp4');
                }
            })
            observer.observe(document.body, observerConfig);
        },
        'pmvhaven.com': () => {
            console.log("script ran");
            // script variables
            let loaded = 0;
            let original = new Array();
            let videoContainer;

            // operational functions
            function fetchVids() {
                let videos = new Array();
                if (videoContainer && videoContainer.children.length > 0) {
                    videos = Array.from(videoContainer.children);
                    let length = videos.length;
                    if (length > loaded) {
                        let newVids = videos.slice(loaded);
                        original.push(...newVids);
                        loaded = length;
                    }
                }
                return videos;
            }

            function sortVids() {
                if (videoContainer && videoContainer.children.length > 0) {
                    let videos = fetchVids();
                    videos.sort((a, b)=>{
                        function parseNumber(str) {
                            const units = { k: 1e3, m: 1e6, b: 1e9 };
                            const match = str.replace(/,/g, '').trim().toLowerCase().match(/^([\d.]+)([kmb])?$/);
                            if (!match) return NaN;
                            const num = parseFloat(match[1]);
                            return match[2] ? num * units[match[2]] : num;
                        }

                        let viewsA = parseNumber(a.querySelector("span.mr-3").firstChild.nodeValue);
                        let viewsB = parseNumber(b.querySelector("span.mr-3").firstChild.nodeValue);

                        return viewsB-viewsA;
                    });
                    videos.forEach(video => videoContainer.insertBefore(video, videoContainer.lastElementChild));
                }
            }

            // minor aliases
            function defaultOrder() {
                fetchVids();
                endObsrv.disconnect();
                original.forEach(video => videoContainer.insertBefore(video, videoContainer.lastElementChild));
            }

            function bestOrder() {
                sortVids();
                endObsrv.observe(videoContainer.lastElementChild);
            }

            // buttons
            let sortDefault = document.createElement("a");
            sortDefault.append(document.createTextNode("Default"));
            sortDefault.addEventListener ("mouseenter", e=>e.target.style.color="Chartreuse");
            sortDefault.addEventListener ("mouseleave", e=>e.target.style.color="");
            sortDefault.addEventListener ("click", (e)=>{
                e.target.style.color="violet";
                defaultOrder();
            });

            let sortBest = document.createElement("a");
            sortBest.append(document.createTextNode("Best"));
            sortBest.addEventListener ("mouseenter", e=>e.target.style.color="Chartreuse");
            sortBest.addEventListener ("mouseleave", e=>e.target.style.color="");
            sortBest.addEventListener ("click", (e)=>{
                e.target.style.color="violet";
                bestOrder();
            });

            // infinite load obesrver
            const endObsrv = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    console.log("Looking for something!");
                    if (entry.isIntersecting) {
                        console.log('Reaching bottom! Default time');
                        defaultOrder();
                        bestOrder();
                    }
                });
            }, {
                root: null, // viewport
                rootMargin: '300px',
                threshold: 1.0 // fire only when fully visible
            });

            // loading variables after page loads
            const rowObserv = new MutationObserver(()=> {
                let buttonsRow = document.querySelector("div.subheader div.v-container");
                videoContainer = document.querySelector("div.v-row.mt-0");
                if (videoContainer && videoContainer.children.length > 0 ) {
                    rowObserv.disconnect();
                    let btnClass = buttonsRow.lastElementChild.querySelector("button").getAttribute("class");
                    sortDefault.setAttribute("class",btnClass);
                    sortBest.setAttribute("class",btnClass);
                    console.log(videoContainer.lastElementChild);
                    buttonsRow.lastElementChild.append(sortDefault, sortBest);
                }
            });

            rowObserv.observe(document.body, { childList: true, subtree: true });
        },
    });
    // console.log(host);
    window.addEventListener("DOMContentLoaded", ()=>{
        utility[host]();
    }, false);
})();