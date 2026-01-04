// ==UserScript==
// @name        azusa_partner_wall
// @namespace   https://greasyfork.org/users/1396048-moeruotaku
// @version     2025.03.14.98
// @description add wall to azusa
// @author      moeruotaku
// @license     MIT
// @match       https://azusa.wiki/torrents.php*
// @match       https://zimiao.icu/torrents.php*
// @icon        https://bgm.tv/img/favicon.ico
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/529611/azusa_partner_wall.user.js
// @updateURL https://update.greasyfork.org/scripts/529611/azusa_partner_wall.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let table = document.querySelector('.torrents');
    if (!table) return;

    unsafeWindow = unsafeWindow ?? window;

    let cn = 'azusa_partner_wall_card'; // class namme
    let loading = 'https://s3.bmp.ovh/imgs/2025/03/14/8cf23d2cdb203b6f.gif';

    let buttons = document.querySelector('.azusa_partner_wall_buttons');
    if (!buttons) (buttons = table.parentNode.insertBefore(document.createElement('div'), table)).style['margin-bottom'] = '4px';
    buttons.innerHTML = `
<div style="display: inline-block; padding: 4px; color: #FFFFFF; border: 1px solid #CCCCCC; font-weight: bold; cursor: pointer" onclick="window.azusa_partner_wall_set_view('table')">列表</div>
<div style="display: inline-block; padding: 4px; color: #FFFFFF; border: 1px solid #CCCCCC; font-weight: bold; cursor: pointer" onclick="window.azusa_partner_wall_set_view('cards')">卡片</div>
<div name="azusa_partner_info" style="display: inline-block; font-size: 8pt; filter: opacity(0.2)"></div>
`;

    let cards = document.querySelector(`.${cn}s`);
    if (!cards) (cards = table.parentNode.insertBefore(document.createElement('div'), table)).className = `${cn}s`;
    cards.innerHTML = `<img src="${loading}" />`;

    let load_settings = () => JSON.parse(localStorage.getItem('azusa_partner') || '{}');
    let save_settings = (k, v) => localStorage.setItem('azusa_partner', JSON.stringify({ ...load_settings(), [k]: v }));

    (unsafeWindow.azusa_partner_wall_set_view = (view) => {
        buttons.children[0].style['background-color'] = view === 'table' ? '#FF9718' : '#CCCCCC';
        buttons.children[1].style['background-color'] = view === 'cards' ? '#FF9718' : '#CCCCCC';
        table.style.display = view === 'table' ? 'table' : 'none';
        cards.style.display = view === 'cards' ? 'flex' : 'none';
        save_settings('last_view', view);
    })(load_settings().last_view || 'table');

    if (!unsafeWindow.azusa_partner_wall_css) unsafeWindow.azusa_partner_wall_css = new CSSStyleSheet();
    if (!document.adoptedStyleSheets.includes(unsafeWindow.azusa_partner_wall_css)) document.adoptedStyleSheets.push(unsafeWindow.azusa_partner_wall_css);

    unsafeWindow.azusa_partner_callback = (data, info) => {
        document.querySelector('div[name=azusa_partner_info]').innerHTML = info;
        if (!data?.bgm_a2b?.version) return;
        let count = Math.floor(table.parentNode.clientWidth / 220);
        let card_width = Math.floor(table.parentNode.clientWidth / count) - 16;
        let card_height = Math.round(card_width * 1.5);

        let cat_names = { 402: 'Comic', 403: 'Light Novel', 404: 'Game', 407: 'CG', 409: 'Music' };
        let cat_colors = { 402: '#E195A3', 403: '#E49ACB', 404: '#AA96EB', 407: '#E7BC8F', 409: '#90C0EB' };

        unsafeWindow.azusa_partner_wall_css.replaceSync(`
#nexus-preview {
    border: 1px solid #000000;
}

.${cn}s {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.${cn} {
    display: flex;
    flex-direction: column;
    width: ${card_width}px;
    margin: 8px;
    overflow: hidden;
    background-color: #F5F5F5;
    border-radius: 8px;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.32), 0 3px 6px 0 rgba(0, 0, 0, 0.24), 0 5px 12px 4px rgba(0, 0, 0, 0.18);
}

.${cn}:hover {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.64), 0 3px 6px 0 rgba(0, 0, 0, 0.48), 0 5px 12px 4px rgba(0, 0, 0, 0.36);
    transform: translateY(-4px);
}

.${cn}_cover {
    position: relative;
}

.${cn}_cover:hover .${cn}_mask_middle span {
    display: initial;
}

.${cn}_image {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: ${card_height}px;
    overflow: hidden;
    background-color: #CCCCCC;
    background-image: url('${loading}');
    background-position: center;
    background-repeat: no-repeat;
}

.${cn}_image img {
    width: auto;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.${cn}_mask {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.${cn}_mask_top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    pointer-events: auto;
}

.${cn}_mask_top_left {
    display: flex;
    flex-wrap: wrap;
    line-height: 1;
}

.${cn}_mask_top_left > div{
    background: rgba(255, 255, 255, 0.75);
}

.${cn}_mask_top_right {
    width: 24px;
    height: 24px;
    padding: 4px;
    text-align: center;
    font-size: 18px;
    color: #E800A4 !important;
    background-color: rgba(255, 255, 255, 0.75);
    border: 2px solid #E800A4;
    border-radius: 50%;
}

.${cn}_mask_middle {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-end;
    pointer-events: auto;
}

.${cn}_mask_middle span {
    display: none;
    padding: 0 4px;
    margin: 4px;
    color: #000000;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid #CCCCCC;
    border-radius: 2px;
}

.${cn}_mask_bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: calc(100% - 8px);
    padding: 4px;
    background-color: rgba(0, 0, 0, 0.5);
}

.${cn}_mask_bottom span {
    border-radius: 2px !important;
}

.${cn}_title {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 2px;
    text-align: center;
}

.${cn}_footer {
    display: flex;
    justify-content: space-evenly;
    font-family: auto;
    white-space: nowrap;
}
`);

        let rows = Array.from(table.children[0].children);

        // ['类型', '封面', '标题', '评论数', '存活时间', '大小', '种子数/下载数/完成数']
        let headers = Array.from(rows[0].children).map((e) => e.children.length > 0 ? Array.from(e.children).map((e) => (e.children.length > 0 ? e.children[0].title : e.innerText)).join('/') : e.innerText);

        let bodies = rows.slice(1).map((tr) => {
            let o = {};
            Array.from(tr.children).forEach((td, i) => {
                if (false);
                else if (headers[i] === '类型') o.cat = td.querySelector('a')?.href?.replace(/^.*cat=([^&]+).*$/, '$1');
                else if (headers[i] === '封面') o.cover = td.querySelector('img')?.src;
                else if (headers[i] === '标题') {
                    o.href = td.querySelector('a')?.href || '#';

                    o.process = td.querySelector('td>div:last-child');
                    if (!o.process || o.process.getAttribute('name') === 'tags' || o.process.tagName === 'SPAN') o.process = undefined;

                    o.bgm_tags = td.querySelector('div[name=tags]');
                    o.bgm_tags = o.bgm_tags ? o.bgm_tags.innerText.split('|').filter((e) => e.length) : [];

                    o.bgm_score = td.querySelector('td[name=score]');
                    o.bgm_score = o.bgm_score ? `<a class="${cn}_mask_top_right" href="${o.bgm_score.querySelector('a')?.href || '#'}" title="评分">${o.bgm_score.innerText === 'N/A' ? '-' : o.bgm_score.innerText}</a>` : '';

                    let titles = Array.from(td.querySelector('td').childNodes);
                    let ai = titles.findIndex((e) => e.tagName === 'A');
                    let ii = titles.slice(ai).findIndex((e) => e.tagName === 'IMG');
                    let bi = titles.findIndex((e) => e.tagName === 'BR');
                    o.pins = titles.slice(0, ai).map((e) => e.outerHTML);
                    o.title = titles.slice(ai)[0].outerHTML;
                    o.free = ii !== -1 ? titles.slice(ai + ii, ai + ii + 3).map((e) => e.outerHTML).join('') : '';
                    o.tags = titles.slice(bi).filter((e) => e.tagName === 'SPAN').map((e) => e.outerHTML).join('');
                    o.info = titles.slice(bi).find((e) => e.nodeType === 3)?.textContent ?? '';
                    o.buttons = Array.from(td.querySelector('td:last-child').querySelectorAll('a')).map((e) => e.outerHTML).join('');
                } else if (headers[i] === '评论数') o.comment = td.innerHTML;
                else if (headers[i] === '存活时间') o.datetime = td.innerHTML.replace(/<br>/g, '');
                else if (headers[i] === '大小') o.size = td.innerText.replace(/\n/g, ' ');
                else if (headers[i] === '种子数/下载数/完成数') o.pt = td.innerHTML.replace(/<\/?b>/g, '').split(' / ').map((e, i) => e.replace(/(<a href="[^"]+">)?([0-9]+)(<\/a>)?/, `$1<span style="color: ${['green', 'red', 'black'][i]}">${['↑', '↓', '✓'][i]}$2<span>$3`)).join('');
                return td.innerHTML;
            });
            return o;
        });

        cards.innerHTML = '';

        bodies.forEach((body, i) => {
            cards.appendChild(document.createElement('div')).outerHTML = `
<div class="${cn}">
    <div class="${cn}_cover">
        <a class="${cn}_image" href="${body.href}">${body.cover ? `<img class="nexus-lazy-load preview" src="${body.cover}" />` : `<div style="width: ${card_width}px; height: ${card_height}px"></div>`}</a>
        <div class="${cn}_mask">
            <div class="${cn}_mask_top">
                <div class="${cn}_mask_top_left"><div>${body.free}</div><div>${body.pins.join('')}</div></div>
                ${body.bgm_score}
            </div>
            <a class="${cn}_mask_middle" href="${body.href}">${body.bgm_tags.map((e) => `<span>${e}</span>`).join('')}</a>
            <div class="${cn}_mask_bottom"><a href="torrents.php?cat=${body.cat}"><span style="background-color:${cat_colors[body.cat] ?? '#CCCCCC'};color:#FFFFFF;border-radius:0;font-size:12px;margin:0 4px 0 0;padding:1px 2px;pointer-events:auto">${cat_names[body.cat] ?? ''}</span></a>${body.tags}</div>
        </div>
    </div>
    <div class="${cn}_title">
        ${body.title}
        ${body.info ? `<div style="color: #555555; font-size: 8pt">${body.info}</div>` : ''}
    </div>
    ${body.process?.outerHTML ?? '<div style="padding: 1px; margin-top: 2px; border: 1px solid #F5F5F5"><div style="width: 100%; height: 2px; background-color: #AAAAAA"></div></div>'}
    <div class="${cn}_footer">
        <span style="color: blue">${body.size}</span>${body.datetime}${body.buttons}${body.pt}
    </div>
</div>
`;
            if (i < bodies.length - 1 && !body.pins.length !== !bodies[i + 1].pins.length) cards.appendChild(document.createElement('div')).outerHTML = `<div style="margin: 32px 0; width: 100%; height: 2px; background-color: #AAAAAA"></div>`;
        });
    };
})();
