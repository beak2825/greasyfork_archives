// ==UserScript==
// @name         아브자막 다운로더
// @namespace    아브자막 다운로더
// @version      1.71
// @description  아브자막 다운로더 도우미
// @author       DandyClubs
// @include      /avjamak\.(net|com)/
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @connect      *
// @grant    	 GM_xmlhttpRequest
// @grant        window.close
// @grant    	 GM_addStyle
// @grant    	 GM_openInTab
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446353/%EC%95%84%EB%B8%8C%EC%9E%90%EB%A7%89%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/446353/%EC%95%84%EB%B8%8C%EC%9E%90%EB%A7%89%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.meta.js
// ==/UserScript==

(function() { var css = document.createElement('link'); css.href = 'https://use.fontawesome.com/releases/v5.15.4/css/all.css'; css.rel = 'stylesheet'; css.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild(css); })();

GM_addStyle (`

.IconSet {
    position: absolute;
    visibility: hidden;    
}

.OnOff, .OpenIcon, .NextPage {
    cursor: pointer;
    color: dodgerblue !important;
    font-size: 1.5rem;
    z-index: 999;
}
`);

const PageURL = window.location !== window.parent.location ? document.referrer : document.location.href;

var filename, i, LinkUrl
var OnOff = GM_getValue("OnOff", 'On')

Start()

$( document ).ready(function() {
    if(!/wr_id/.test(PageURL) && /jamakbos|jamakuser|bigsub|jamak_sujung|jamakfreer/.test(PageURL)){
        MakeIcon()
    }
})



async function Start(){

    if(!/wr_id/.test(PageURL) && /jamakbos|jamakuser|bigsub|jamak_sujung|jamakfreer/.test(PageURL)){
        document.querySelector('.panel-heading').insertAdjacentHTML('beforeend', '<div class="IconSet"></>')
        document.querySelector('.IconSet').insertAdjacentHTML('beforeend', '<i class="OnOff fas fa-power-off"></>')
        document.querySelector('.IconSet').insertAdjacentHTML('beforeend', '&nbsp;&nbsp;<i class="OpenIcon fas fa-external-link-alt"></>')
        document.querySelector('.IconSet').insertAdjacentHTML('beforeend', '&nbsp;&nbsp;<i class="NextPage fas fa-arrow-circle-right"></>')
        document.querySelector('.panel-heading').style.setProperty('position', 'relative')

        document.querySelector('.OnOff').addEventListener("click", function(event) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            if(OnOff == 'On'){
                document.querySelector('.OnOff').style.setProperty('color', 'Gray', 'important');
                document.querySelector('.OpenIcon').style.visibility = "hidden"
                OnOff = GM_setValue("OnOff", 'Off')
                OnOff = GM_getValue("OnOff")
            }
            else{
                document.querySelector('.OnOff').style.setProperty('color', 'dodgerblue', 'important');
                document.querySelector('.OpenIcon').style.visibility = "visible"
                OnOff = GM_setValue("OnOff", 'On')
                OnOff = GM_getValue("OnOff")
            }
        })

        document.querySelector('.OpenIcon').addEventListener("click", function(event) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            OpenLinks(LinkDB)
        })

        document.querySelector('i.NextPage').addEventListener("click", function(event) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            var pageNumber = document.location.href.match(/(.*page=)(\d+)/) ? Number(document.location.href.match(/(.*page=)(\d+)/)[2]) + 1 : '&page=2'
            var PreURL = document.location.href.match(/(.*page=)(\d+)/) ? document.location.href.match(/(.*page=)(\d+)/)[1] : document.location.href
            window.location = PreURL + pageNumber
        })


        window.addEventListener("resize", function(e) {
            MakeIcon()
        })
        /*
        window.addEventListener('scroll', function () {
            if(inViewport(document.querySelector('.panel-heading'))){
                MakeIcon()
            }
        }, {
            passive: true
        })
*/
        var Linksitems = document.querySelectorAll('div.list-container > div.list-row > div.list-item > h2 > a')
        let filtered = [...Linksitems].filter(n => n.textContent.length >= 4)
        var LinkDB = []
        if(/jamakbos|jamakuser|bigsub/.test(PageURL)){
            for (i = 0; i < filtered.length; i++) {
                var last = [...filtered[i].closest('div.list-item').querySelectorAll('.list-details.text-muted .pull-right')].pop()
                MP = last && last.textContent.match(/(\d+)/) ? Number(last.textContent.match(/(\d+)/).pop()) : ''
                if(!MP || MP <=1){
                    //console.log(filtered[i])
                    LinkDB.push(filtered[i])
                }
            }
            console.log(LinkDB)
        }
        else {
            LinkDB = Linksitems
        }
    }
    else if(/wr_id/.test(PageURL) && /jamakbos|jamakuser|bigsub|jamak_sujung|jamakfreer/.test(PageURL) && OnOff == 'On'){

        var links = document.querySelectorAll('a[href*="download.php"]')
        var MP = document.querySelector('.fa.fa-bell.red') ? document.querySelector('.fa.fa-bell.red').closest('a.list-group-item').querySelector('b').textContent : ''

        const getUriWithParam = (baseUrl, params) => {
            //console.log(baseUrl)
            const Url = new URL(baseUrl);
            const urlParams = new URLSearchParams(Url.search);
            for (const key in params) {
                if (params[key] !== undefined) {
                    urlParams.set(key, params[key]);
                }
            }
            Url.search = urlParams.toString();
            return Url.toString();
        };


        for (var i = 0; i < links.length; ++i) {
            links[i].href = await getUriWithParam(links[i].href, {ds: "1"})
            links[i].href = await getUriWithParam(links[i].href, {js: "on"})
        }

        links = document.querySelectorAll('a[href*="download.php"]')

        if(!links?.length){
            await sleep(5000)
            window.close()
        }
        else{
            for (var j = 0; j < links.length; ++j) {
                if(!MP){
                    DownloadFile(links[j].href, links[j])
                }
                else if( MP > 0){
                    DownloadFile(links[j].href, links[j])
                }
                else{
                    await sleep(5000)
                    window.close()
                }
            }
        }
    }
}

function MakeIcon() {
    document.querySelector(".IconSet").style.visibility = "visible"
    if(OnOff == 'On'){
        document.querySelector('.OnOff').style.setProperty('color', 'dodgerblue', 'important');
        document.querySelector('.OpenIcon').style.visibility = "visible"
    }
    else{
        document.querySelector('.OnOff').style.setProperty('color', 'Gray', 'important');
        document.querySelector('.OpenIcon').style.visibility = "hidden"
    }
    let TitlePostion = getOffset(document.querySelector('.panel-heading'))
    let IconPostion = getOffset(document.querySelector(".IconSet"))

    $('.IconSet').css({
        "top": 10
        ,"left": '95%'
    })
}

function DownloadFile(url, target) {
    target.querySelector('i.fa').classList.remove('fa-download')
    target.querySelector('i.fa').classList.add('fa-spinner')
    target.querySelector('i.fa').style.setProperty('color', 'White', 'important');

    fetch(url,{
        credentials: 'include',
    })
        .then(async res => {
        var disposition = await res.headers.get('Content-Disposition')
        console.log(disposition)
        target.querySelector('i.fa').style.setProperty('color', 'Orange', 'important');
        if(typeof disposition !== 'undefined' && disposition !== null){
            filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1].replace("utf-8''", '').replace(/['"]/g, '').replace(/\+/g, '%20')
            filename = decodeURIComponent(filename)
            //console.log(filename)
            return res.blob()
        }
    })
        .then(async blob => {
        await saveAs(blob, filename)
        target.querySelector('i.fa').classList.remove('fa-spinner')
        target.querySelector('i.fa').classList.add('fa-check-square')
        await sleep(10000)
        window.close()
    })
        .catch((error) => {
        console.error('Downloading Error', error);
    });
}

function inViewport (element) {
    if (!element) return false;
    if (1 !== element.nodeType) return false;

    var html = document.documentElement;
    var rect = element.getBoundingClientRect();

    return !!rect &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.left <= html.clientWidth &&
        rect.top <= html.clientHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        width: rect.width,
        height: rect.height
    };
}

async function OpenLinks(LinkDB){
    document.querySelector('.OpenIcon').style.setProperty("color", "Orange", "important")
    for (var i = 0; i < LinkDB.length; i++) {
        LinkUrl = LinkDB[i].href
        console.log(LinkUrl)
        await GM_openInTab( LinkUrl , { active: false, insert: true } )
        await sleep(100)
    }
}

addJS_Node (null, null, overrideSelectNativeJS_Functions)

function overrideSelectNativeJS_Functions () {
    window.confirm = function alert (message) { return true; }
}

function addJS_Node (text, s_URL, funcToRun) {
    var D = document;
    var scriptNode = D.createElement ('script');
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}