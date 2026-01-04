// ==UserScript==
// @name         Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!!
// @author       You
// @match        https://tl.rulate.ru/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432406/Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/432406/Downloader.meta.js
// ==/UserScript==

void async function(){

Window.prototype.q = function (s) { return this.document.querySelector(s) };
Window.prototype.qq = function (s) { return [...this.document.querySelectorAll(s)] };
Element.prototype.q = function (s) { return this.querySelector(s) };
Element.prototype.qq = function (s) { return [...this.querySelectorAll(s)] };

cache = await caches.open('epub');

// закешировать главы
async function cacheChapters() {
    qq('.chapter .content-text')
        .map(e => {
            let id = e.closest('[id*=scroll_chap]').id.match(/\d+/)[0];
            e = unwrap(e.cloneNode(true));
            cache.put(`/${id}`, new Response(e.outerHTML));
            console.log(id, e);
            return {e, id}
        });
}
// кешировать при подрузке новых глав
onheightchange(cacheChapters);

// оглавление: показать закешированные главы
style = document.createElement('style');
style.innerHTML = `td[before]::before {content: attr(before);}`;
document.head.append(style);
let a = qq('.chapter_row')
    .map(async e => {
        if (await cache.match('/' + e.dataset.id)) {
            e.q('td').setAttribute('before', 'В кэше')
        }
    });

async function generateHTML() {
    header = unwrap(q('#Info').cloneNode(true))
    header.qq(':scope>.btn-toolbar, :scope>h3, :scope>h3+*, .post')
        .map(e=>e.remove())
    title = unwrap(q('h1').cloneNode(true));

    chaps = qq('.chapter_row')
        .map(async e => {
            let id = e.dataset.id;
            let r = await cache.match('/'+id);
            let t = await (r && r.text());
            let name = e.q('.t a').innerHTML;
            return {id, e, r, t, name};
        });
    chaps = await Promise.all(chaps)

    // осторожно, среди meta есть name="csrf-token"
    // его ни в коем случае не сохранять!
    allowedMetas = ['charset', 'name="description"', 'name="keywords"',
        'property="og:locale"', 'property="og:title"',
        'property="og:description"', 'property="og:image"',
        'property="ranobe:description"']
    metas = qq(allowedMetas.map(e=>`meta[${e}]`).join(','))

    html = ``;
    html += `<html>\n<head>\n`;
    metas.map(e=>html += '\t'+e.outerHTML+'\n');
    html += `<title>${title.innerHTML}</title>`
    html += `</head>\n<body>\n\n`;
    html += `${title.outerHTML}\n\n`;
    html += `${header.outerHTML}\n\n`;
    chaps.map(({id, e, r, t, name}) => {
        t = t || `Часть не была закеширована`;
        html += `<h2>${name}</h2>\n${t}\n\n`;
    })
    html += `\n\n</body>`;
    // всё равно где-то иногда вылезает
    if (html.includes('csrf_token')) {
        alert('В html содержится csrf_token! Это нехорошо!');
        html = '';
        throw 0;
    }
    return html;
}

if (q('#Info')) {
    html = '';
    q('#header-logo').onclick = function(e) {
        e.preventDefault();
        if (!html) alert('ещё не собралось, подожди');
        if (!chaps.every(e=>e.t))
            if (!confirm(`закешировано только ${
                    chaps.filter(e=>e.t).length
                } из ${
                    chaps.length
                } частей.\nВсё равно скачать?`))
                    return;
        download(`${q('h1').innerText}.html`, html);
    }
    html = await generateHTML();
}


// очищает содержимое от ненужного
function unwrap(el) {
    let badStyle = [
        'color:#000000;',
        'background-color:#FFFFFF;',
        'font-size:12pt;',
        'background-color:#FFFFFF;',
        'font-size:11pt;',
        'margin-left:0cm;margin-right:0cm;text-align:justify;',
    ]
    for (let b of badStyle) {
        for (let e of el.qq(`span[style="${b}"]`)) {
            if (e.childNodes.length == 1) {
                e.replaceWith(e.childNodes[0]);
            }
        }
    }
    let badTags = ['script', 'form'];
    for (let tag of badTags) {
        el.qq(tag).map(e=>e.remove());
    }
    // изменить ссылки на абсолютные
    el.qq('img').map(e=>e.src = e.src);
    el.qq('a').map(e=>e.href = e.href);
    el.qq('.slick').map(e=>{
        let img = e.q('[tabindex="0"] img') || e.q('img');
        e.replaceWith(img);
        img.style.cssText = '';
    })
    return el;
}

function download(name, file) {
    if (file.includes('csrf_token')) {
        alert('В html содержится csrf_token! Это нехорошо!');
        html = '';
        throw 0;
    }
    let blob = new Blob([file], {type: 'text/html'});
    let a = document.createElement('a');
    let url = URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
//     document.body.appendChild(a);
    a.click();
}

function onheightchange(f) {
    new ResizeObserver(entries => {
        for (let e of entries) {
            if (e.target == document.body) f();
        }
    }).observe(document.body);
}

}();