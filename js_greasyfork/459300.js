// ==UserScript==
// @name        anime1
// @author      YieldRay
// @namespace   https://488848.xyz/
// @version     1.0
// @description No Description...
// @license     MIT
// @noframes
// @match       *://example.net/*
// @require     https://cdn.jsdelivr.net/npm/simpledragger@0.1.3/dist/simpledragger.js
// @require     https://greasyfork.org/scripts/459299-gm-fetch-by-mitchellmebane/code/GM_fetch%20(bymitchellmebane).js?version=1144795
// @resource    text https://d1zquzjgwo9yb.cloudfront.net/
// @connect     d1zquzjgwo9yb.cloudfront.net anime1.me
// @grant       unsafeWindow
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459300/anime1.user.js
// @updateURL https://update.greasyfork.org/scripts/459300/anime1.meta.js
// ==/UserScript==

document.head.querySelector("style[type='text/css']").innerHTML = "";
//! init window
const { html, render } = simpledragger;
const win = new simpledragger.Window("Anime1", { left: "", right: "0px" });
win.z(99999);

class Anime1ME {
    _fetch;
    constructor(fetchProvider = fetch) {
        this._fetch = fetchProvider;
    }
    async all() {
        const res = await this._fetch("https://d1zquzjgwo9yb.cloudfront.net/");
        return await res.json();
    }
    async cat(id) {
        const res = await this._fetch("https://anime1.me/?cat=" + id);
        const u = new URL(res.url);
        const [season, name] = u.pathname.slice(1).split("/").slice(1).map(unsafeWindow.decodeURIComponent);
        const html = await res.text();
        const result = [];
        for (const re of html.matchAll(/data-apireq="(.[^"]+)"/g)) {
            const encoded = re[1];
            const decoded = JSON.parse(decodeURIComponent(encoded));
            result.push({ encoded, decoded });
        }
        return {
            name,
            season,
            data: result.sort((a, b) => a.decoded.t - b.decoded.t),
        };
    }
    async video(encoded) {
        const res = await this._fetch("https://v.anime1.me/api", {
            method: "POST",
            headers: {
                referer: "https://anime1.me/",
                "content-type": "application/x-www-form-urlencoded",
            },
            body: "d=" + encoded,
        });
        //! this is polyfill behavior
        const cookies = res.headers.map["set-cookie"];
        cookies.forEach((c) => {
            console.log(c);
            // document.cookie = c.split(";")[0];
            document.cookie = c.split(";").slice(0, 5).join(";");
            //! this step bring the cookie cross origin
        });
        const cookie = cookies.map((c) => c.split(";")[0]).join(";");
        const json = await res.json();
        if ("success" in json && json.success === false) {
            throw new Error(json.errors);
        }
        return { ...json, cookie };
    }

    async table(season = "2023年冬季新番") {
        const res = await this._fetch("https://anime1.me/" + season);
        const html = await res.text();
        const m = html.match(/<table.*?>.+?<\/table>/s);
        if (m === null) throw new Error("Unable to parse the table");
        const table = m[0];
        return table;
    }
}

function division(arr, length = 10) {
    let index = 0;
    let out = [];
    while (index < arr.length) {
        const begin = index + 1;
        index += length;
        const end = index;
        out.push({
            begin,
            end,
            data: arr.slice(begin, end + 1),
        });
    }
    return out;
}

//! init api & data
const api = new Anime1ME(GM_fetch);
const dataArray = division(JSON.parse(GM_getResourceText("text")));

function renderTable(dataArrayIndex = 0) {
    console.log(dataArrayIndex);
    if (dataArrayIndex < 0) return alert("没有了");
    if (dataArrayIndex >= dataArray.length) return alert("没有了");
    const { begin, end, data } = dataArray[dataArrayIndex];
    // console.log(dataArray[dataArrayIndex]);
    const h = html`
        <table>
            <caption>
                ${begin}-${end} 当前是第${dataArrayIndex + 1}页
            </caption>
            <thead>
                <tr>
                    <th>名称</th>
                    <th>状态</th>
                    <th>年份</th>
                    <th>季度</th>
                    <th>来源</th>
                </tr>
            </thead>

            <tbody>
                ${data.map(
                    ([cat, name, status, year, season, source]) => html`
                        <tr @click=${() => renderCat(cat)} style="cursor:pointer">
                            <td>${name}</td>
                            <td>${status}</td>
                            <td>${year}</td>
                            <td>${season}</td>
                            <td>${source}</td>
                        </tr>
                    `
                )}
            </tbody>
        </table>
        <div style="display:flex; justify-content:space-between;">
            <button @click=${() => renderTable(dataArrayIndex - 1)}>上一页</button>
            <button @click=${() => renderTable(dataArrayIndex + 1)}>下一页</button>
        </div>
        <center>
            <button @click=${() => renderTable(Number($all_input.value) - 1)}>转至</button>
            第<input
                id="$all_input"
                type="number"
                style="width:4em;height:1.5em"
                .value=${String(dataArrayIndex + 1)}
            />页 共${dataArray.length}页
        </center>
    `;
    render(h, $all_table);
}

async function renderCat(cat) {
    $all.open = false;
    $cat.open = true;
    render(html`<blockquote>正在加载中。。。</blockquote>`, $cat_list);

    const { name, season, data } = await api.cat(cat);
    $cat.querySelector("summary").innerHTML = `当前 <strong>${name} ${season}</strong>`;
    render(
        html`${data.map(
            ({ encoded, decoded }) => html`<button @click=${() => play(encoded)}>（集数:${decoded.e}）</button>`
        )}`,
        $cat_list
    );
}

async function play(encoded) {
    $cat.open = false;
    $player.open = true;
    render(html`<blockquote>正在加载中。。。</blockquote>`, $player_out);

    const { s, cookie } = await api.video(encoded);

    render(
        html`
            <i>点击任意一个播放</i>
            <br />
            ${s.map(({ type, src }) => html` <a href="${src}" target="_blank">${type} ${src}</a> `)}
            <br />
            <!--
            <video crossorigin="use-credentials" controls preload="none">
                ${s.map(({ type, src }) => {
                return html` <source src="${src}" type="${type}" /> `;
            })}
            </video>
            -->
        `,
        $player_out
    );
}

async function main() {
    // const table = await api.table();
    // win.html(`${table}`);
    win.render(html`
        <aside style="font-size:12px">
            <details open id="$all">
                <summary>所有</summary>
                <div id="$all_table"></div>
            </details>

            <details id="$cat">
                <summary>当前</summary>
                <div id="$cat_list"></div>
            </details>

            <details id="$player">
                <summary>播放</summary>
                <div id="$player_out"></div>
            </details>
        </aside>
    `);
    renderTable();
}

main();
