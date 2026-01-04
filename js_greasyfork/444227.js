// ==UserScript==
// @name         arcalive 이미지 미리보기
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  arcalive 게시글의 이미지를 미리보여줍니다.
// @author       You
// @match        https://arca.live/b/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/444227/arcalive%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444227/arcalive%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==
//'use strict';
const pose = '날짜'; // 어디에다 이미지를 붙일지 선택 ! [제목, 날짜 중에서]

function imageFetchAndAttatch(vrow) // 이미지 페칭해서 붙임.
{
    let a=fetch(vrow.href)
        .then(response=>response.text())
        .then(html=>{
        var parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    })
        .then(html=>{
        let image = html.querySelector('.article-content img')
        if (image)
        {
            const aspectRatio = image.height/image.width;
            image.width = 100;
            image.height = aspectRatio * image.width;
            vrow.querySelector('.col-time')?.prepend(image);
        }
    })
}
function moveImageWithMark(vrow, image){
    const brTag=document.createElement('span');

    let dest;
    switch (pose)
    {
        case '제목':
            dest = vrow.querySelector('.title');
            dest.append(brTag, image);
            dest.prepend(mark);
            break;
        case '날짜':
            dest = vrow.querySelector('.col-time');
            dest.prepend(image);
            image.append(brTag);
            break;
    }
}

(function() {
    const vrows=document.querySelectorAll('.vrow:not(.notice)');

    for (const vrow of vrows)
    {
        const vrowPrev = vrow.querySelector('.vrow-preview');
        if (vrowPrev)
        {
            const image = vrowPrev.children[0];
            image.width =100; // 혹시나 이미지크기가 이상할경우대비 100px로.

            moveImageWithMark(vrow, image);
            vrowPrev.style.display = 'none';
        }
        else
        {
            imageFetchAndAttatch(vrow);
        }

    }
        const articles=document.querySelectorAll('.article-list a.vrow.column');
        articles.forEach(article=>{article.style='height: auto !important'});

        // 이상현상제거
        const vrowBottoms = document.querySelectorAll('.vrow-bottom');
        for (const vrowBottom of vrowBottoms)
        {
            for (const v of vrowBottom.children)
            {
                v.style.display='flex';
                v.style['align-items']='center';
                v.style['flex-direction']='column';
                v.style['justify-content']='center';
                v.style['align-content']='center';
            }
        }

}
    )();