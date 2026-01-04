// ==UserScript==
// @name         Download Replace Filename + to Space
// @namespace    Download Replace Filename + to Space
// @version      1.4
// @description   Download Replace Filename + to Space. Thanks!
// @author       DandyClubs
// @match        *://*/bbs/board.php*
// @exclude      /cineaste\.co\.kr/
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @connect      *
// @grant		 GM_xmlhttpRequest
// @grant		 GM_addStyle
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/446386/Download%20Replace%20Filename%20%2B%20to%20Space.user.js
// @updateURL https://update.greasyfork.org/scripts/446386/Download%20Replace%20Filename%20%2B%20to%20Space.meta.js
// ==/UserScript==

GM_addStyle (`

.view-btn {
    margin: 0px 0px 5px;
}
a:visited * {
    color: rgb(255, 152, 0) !important;
}
.list-board .list-body li a:visited {
    color: rgb(255, 152, 0) !important;
}

.list-board .list-body .wr-subject .item-subject{
    font-size: var(--SetFontSize, 1rem)
}
.list-board .list-body li>div {
    height: 32px;
    line-height: 32px;
}

.comment-media .media .media-content {
    padding: 5px 5px 5px 5px;
    font-size: var(--SetFontSize, 1rem)
}

.comment-media .media .media-heading {
    padding: 5px 5px 5px 5px;
}
`);



const PageURL = window.location !== window.parent.location ? document.referrer : document.location.href;

var filename, links, DonwLoadIcon, GetDPI, DefaultFontSize

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "interactive") {
        console.log('Download Replace Filename + to Space Start!')
        SetFontSize()
    }
    else if (event.target.readyState === "complete") {
        Start()
        addJS_Node (null, null, overrideSelectNativeJS_Functions)
        if(/avsubs\.co\.kr\/bbs\/board\.php.*wr_id/.test(PageURL)){
            //목록 글쓰기 버튼 위치 변경
            var listwrite = document.querySelector('div.view-btn.text-right')
            if(listwrite){
                //listwrite.remove()
                document.querySelector("div.view-wrap").insertAdjacentHTML('beforebegin', listwrite.outerHTML)
            }
        }
    }
});

function getDefaultFontSize(){
    const element = document.createElement('div')
    element.style.width = '1rem';
    element.style.display = 'none';
    document.body.append(element);

    const widthMatch = window
    .getComputedStyle(element)
    .getPropertyValue('width')
    .match(/\d+/);

    element.remove();

    if (!widthMatch || widthMatch.length < 1) {
        return null;
    }

    const result = Number(widthMatch[0]);
    return !isNaN(result) ? result : null;
};

async function Start(){
    links = document.querySelectorAll('a[href*="download.php"]')
    if(links?.length > 0){          

        for (var i = 0; i < links.length; ++i) {
            links[i].href = await getUriWithParam(links[i].href, {ds: "1"})
            links[i].href = await getUriWithParam(links[i].href, {js: "on"})

            links[i].addEventListener("click", async function(event) {
                let Target = event.target.tagName === 'A' ? event.target : event.target.closest('a[href*="download.php"]')
                Target.href = await getUriWithParam(Target.href, {ds: "1"})
                Target.href = await getUriWithParam(Target.href, {js: "on"})
                event.preventDefault()
                event.stopPropagation()
                event.stopImmediatePropagation()
                console.log(Target)
                DownloadFile(Target.href, Target)
            })
        }
    }
}

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



function getUriWithParam(baseUrl, params) {
    console.log(baseUrl)
    try {
        const Url = new URL(baseUrl)
        const urlParams = new URLSearchParams(Url.search);
        for (const key in params) {
            if (params[key] !== undefined) {
                urlParams.set(key, params[key]);
            }
        }
        Url.search = urlParams.toString();
        return Url.toString()
    } catch (err) {
        console.log(err)
    }
};


function SetFontSize(node) {
    node = node || document
    GetDPI = window.devicePixelRatio
    DefaultFontSize = getDefaultFontSize()
    console.log('GetDPI: ', GetDPI, 'DefaultFontSize: ', DefaultFontSize)
    if(node.querySelector('.list-board .list-body .wr-subject .item-subject')){
        try {
            var FontHeigh = parseFloat(window.getComputedStyle(node.querySelector('.list-board .list-body .wr-subject .item-subject')).fontSize)
            console.log(FontHeigh)
            if(FontHeigh <= 12){
                document.documentElement.style.setProperty('--SetFontSize', Math.min(Number((16/DefaultFontSize).toFixed(2)), Number(((1/(GetDPI/1.5))*(16/FontHeigh)).toFixed(2)), Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)), 1.2) + 'rem')
            }
            else{
                document.documentElement.style.setProperty('--SetFontSize', Math.min(Number((16/DefaultFontSize).toFixed(2)), Number(((1/(GetDPI/1.5))*(16/FontHeigh)).toFixed(2)), Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)), 1) + 'rem')
            }
        } catch (err) {
            console.log(err)
        }
    }
}

function getDirectInnerText(element) {
    let childNodes = element.childNodes;
    let result = ''

    for (let i = 0; i < childNodes.length; i++) {
        //console.log('nodeType: ', childNodes[i], childNodes[i].nodeType, childNodes[i].tagName )
        if (childNodes[i].tagName === 'span' || childNodes[i].nodeType == 3) {
            result += childNodes[i].data ? childNodes[i].data : childNodes[i].textContent;
        }
    }

    return result;
}

function DownloadFile(url, target) {
    DonwLoadIcon = target.querySelector('i.fa.fa-download, i.fa.fa-spinner, i.fa.fa-check-square')
    DonwLoadIcon.classList.remove('fa-download')
    DonwLoadIcon.classList.add('fa-spinner')
    DonwLoadIcon.style.setProperty('color', 'White', 'important')
    fetch(url,{
        credentials: 'include',
    })
        .then(async res => {
        var disposition = await res.headers.get('Content-Disposition')
        console.log(disposition)
        DonwLoadIcon.style.setProperty('color', 'Orange', 'important')
        if(typeof disposition !== 'undefined' && disposition !== null){
            filename = getDirectInnerText(target) ? getDirectInnerText(target).match(/(.*)\s\(\d+/)[1].trim() : ''
            console.log(filename)
            return res.blob()
        }
    })
        .then(async blob => {
        await saveAs(blob, filename)
        DonwLoadIcon.classList.remove('fa-spinner')
        DonwLoadIcon.classList.add('fa-check-square')

    })
        .catch((error) => {
        console.log('Downloading Error', error);
    });
}


