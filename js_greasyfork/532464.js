// ==UserScript==
// @name         Cardplace Card Grid + Firefox image fix
// @namespace    http://tampermonkey.net/
// @version      2025-04-11
// @description  Добавляет вид сетки на каталог синглов юзера, сохраняет состояние + фиксит путь до картинок так как в фф с этим бывает проблема.
// @author       kaur
// @match        https://cardplace.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardplace.net
// @grant        none
// @license       MIT 
// @downloadURL https://update.greasyfork.org/scripts/532464/Cardplace%20Card%20Grid%20%2B%20Firefox%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/532464/Cardplace%20Card%20Grid%20%2B%20Firefox%20image%20fix.meta.js
// ==/UserScript==


const styleId = 'user-collection-style';


function fixImageSrc(img) {
    let src = $(img).attr('src');
    if (src && src.endsWith('/')) {
        const newSrc = '/upload/' + src.slice(0, -1).substr(src.indexOf('/0/') + 3);
        $(img).attr('src', newSrc);
    }
}

$('img').each(function() {
    fixImageSrc(this);
});

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.tagName === 'IMG') {
                fixImageSrc(node);
            } else if ($(node).find('img').length > 0) {
                $(node).find('img').each(function() {
                    fixImageSrc(this);
                });
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});


const onUserPage = location.hostname.includes('cardplace.net') &&
      location.pathname.match(/^\/store\/single\/user\/\d+/);

if (onUserPage) {
    const css = `
            table.my-collection{ display:block; }
            table.my-collection > tbody{
                display: inline-flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
            }
            table.my-collection .card-row{
                display:inline-flex;
                flex-wrap: wrap;
                width:180px;
                padding:5px;
            }
            table.my-collection .card-row .image-tr:before{
                content:"";
                display:block;
                width:180px;
                height:255px;
                position:absolute;
                border-radius:10px;
            }
            table.my-collection .card-row[data-foil="1"] .image-tr:before{
                background: url(https://cdn.edgecomics.ru/files/1/4386/35320098/original/HQ-foiling-card.png);
                background-size: cover;
                opacity:0.8;
            }
            table.my-collection .card-row > td{
                width:100%;
                display:block;
                padding:0;
                position:relative;
                font-size:11px;
            }
            table.my-collection .card-row .image-tr img{
                width:100%;
                border-radius:10px;
                height:255px;
                margin:0;
            }
            table.my-collection .card-row .rarity-td-value,
            table.my-collection .card-row .type-td-value,
            table.my-collection .card-row .manacost-td-value,
            .th-collection-card,
            .rarity-td,
            .th-collection-manacost,
            .th-collection-card-type,
            .th-collection-lang {
                display:none;
            }
            table.my-collection .card-row > td:nth-child(2){
                height:44px;
                display:flex;
                align-items: center;
                justify-content: center;
            }
            table.my-collection .card-row > td:nth-child(6),
            table.my-collection .card-row > td:nth-child(7),
            table.my-collection .card-row > td:nth-child(8),
            table.my-collection .card-row > td:nth-child(9){
                width:25%;
                float:left;
                height:31px;
                display:flex;
                align-items: center;
                justify-content: center;
            }
            .card-quality{
                background:#fff;
                width:30px;
                height:15px;
                border-radius:10px;
                display:flex;
                align-items: center;
                justify-content: center;
                margin:0!important;
                bottom:10px;
                left:calc(50% - 34px/2);
                border:2px solid #000;
            }
            .lang-td-value{font-size:10px!important;}
            table.my-collection .card-row .card-sale-count:after{content:" шт";}
            table.my-collection > tbody th{ background:transparent; }
        `;

        function enableStyle() {
            if (!document.getElementById(styleId)) {
                $('<style>', { id: styleId, text: css }).appendTo('body');
            }
        }

        function disableStyle() {
            $('#' + styleId).remove();
        }

        function isStyleEnabled() {
            return localStorage.getItem('collectionStyleEnabled') === 'true';
        }

        function toggleStyle() {
            const enabled = isStyleEnabled();
            if (enabled) {
                disableStyle();
                localStorage.setItem('collectionStyleEnabled', 'false');
                toggleBtn.text('🖼️ Сетка');
            } else {
                enableStyle();
                localStorage.setItem('collectionStyleEnabled', 'true');
                toggleBtn.text('📄 Список');
            }
        }

        const toggleBtn = $('<button>')
        .css({
            padding: '4px 8px',
            margin: '5px',
            background: '#eee',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            left: '-30px',
            position: 'relative'
        })
        .text('🖼️ Сетка')
        .on('click', toggleStyle);

        const tryInsertButton = setInterval(() => {
            const control = $('.th-collection-control');
            if (control.length) {
                control.append(toggleBtn);
                clearInterval(tryInsertButton);
                if (isStyleEnabled()) {
                    enableStyle();
                    toggleBtn.text('📄 Список');
                }
            }
        }, 300);
    }
