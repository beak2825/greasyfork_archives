// ==UserScript==
// @name               Tong Li Online: Blurs R-rated Covers
// @name:zh-TW         東立漫遊網：模糊限制級封面
// @description        Blurs the covers of R-rated books on Tong Li Online.
// @description:zh-TW  模糊東立漫遊網限制級書本的封面。
// @icon               https://icons.duckduckgo.com/ip3/www.tongli.com.tw.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.4.0
// @license            MIT
// @match              https://www.tongli.com.tw/
// @match              https://www.tongli.com.tw/index.aspx
// @match              https://www.tongli.com.tw/BooksLst_Srh.aspx
// @match              https://www.tongli.com.tw/GbooksList.aspx
// @match              https://www.tongli.com.tw/GbooksList.aspx?*
// @match              https://www.tongli.com.tw/search3.aspx
// @match              https://www.tongli.com.tw/Search3.aspx
// @match              https://www.tongli.com.tw/BooksList.aspx
// @match              https://www.tongli.com.tw/BooksList.aspx?*
// @match              https://www.tongli.com.tw/webpagebooks.aspx
// @match              https://www.tongli.com.tw/webpagebooks.aspx?*
// @match              https://www.tongli.com.tw/WebPageBooks.aspx
// @match              https://www.tongli.com.tw/WebPageBooks.aspx?*
// @match              https://www.tongli.com.tw/ThemeBL.aspx
// @match              https://www.tongli.com.tw/ThemeBLBooks.aspx
// @match              https://www.tongli.com.tw/ThemeBLBooks.aspx?*
// @match              https://www.tongli.com.tw/ThemeBeautiful.aspx
// @match              https://www.tongli.com.tw/ThemeBeautiful.aspx?*
// @match              https://www.tongli.com.tw/ThemeGL.aspx
// @match              https://www.tongli.com.tw/ThemeGL.aspx?*
// @match              https://www.tongli.com.tw/NovelIndex/
// @match              https://www.tongli.com.tw/NovelDetail.aspx
// @match              https://www.tongli.com.tw/NovelDetail.aspx?*
// @match              https://www.tongli.com.tw/BooksDetail.aspx
// @match              https://www.tongli.com.tw/BooksDetail.aspx?*
// @run-at             document-end
// @grant              none
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @require            https://unpkg.com/uuid-random@1.3.2/uuid-random.min.js
// @require            https://update.greasyfork.org/scripts/482311/1297431/queue.js
// @supportURL         https://greasyfork.org/scripts/482312/feedback
// @downloadURL https://update.greasyfork.org/scripts/482312/Tong%20Li%20Online%3A%20Blurs%20R-rated%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/482312/Tong%20Li%20Online%3A%20Blurs%20R-rated%20Covers.meta.js
// ==/UserScript==

GM.addStyle(`
    .b_package.nsfw img, .owl-item.nsfw > .item img, .comicBox li.nsfw img, .sdBook :is(.hot, .tabbook).nsfw input
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    .b_package.nsfw:hover img, .b_package.nsfw:focus-within img,
    .owl-item.nsfw > .item:hover img, .owl-item.nsfw > .item:focus-within img,
    .comicBox li.nsfw:hover img, .comicBox li.nsfw:focus-within img,
    .sdBook :is(.hot, .tabbook).nsfw:hover input, .sdBook :is(.hot, .tabbook).nsfw:focus-within input
    {
        filter: blur(0px);
    }
`);

const EVENT_KEY = uuid();

async function isNsfw(url, { signal } = {})
{
    try
    {
        const response = await fetch(url, { signal, credentials: "omit" });
        if (response.status === 200)
        {
            const html = await response.text();
            const parser = new DOMParser();
            const page = parser.parseFromString(html, "text/html");

            if (page.getElementById("ContentPlaceHolder1_GradeTxt")?.innerText === "限制級") { return true; }
        }
    }
    catch (e)
    {
        if (typeof e === "string")
        {
            console.debug(e);
        }
        else if ((e instanceof DOMException) && (e.name === "AbortError"))
        {
            console.debug(signal.reason);
        }
        else
        {
            console.error(e);
        }
    }

    return false;
}

const queue = new Queue({ autostart: true, concurrency: 20 });
queue.addEventListener("error", (event) => console.error(event.detail.error));

const pathname = location.pathname.toLowerCase();
if ((pathname === "/bookslst_srh.aspx") || (pathname === "/gbookslist.aspx"))
{
    const serieses = document.querySelectorAll(".b_package");
    for (const series of serieses)
    {
        queue.push(async () =>
        {
            try
            {
                const response = await fetch(series.querySelector("a").href, { credentials: "omit" });
                if (response.status === 200)
                {
                    const html = await response.text();
                    const parser = new DOMParser();
                    const page = parser.parseFromString(html, "text/html");

                    const controller = new AbortController();
                    const signal = controller.signal;

                    const products = page.querySelectorAll(".b_package");
                    for (const product of products)
                    {
                        queue.push(async () =>
                        {
                            if (await isNsfw(product.querySelector("a").href, { signal }))
                            {
                                controller.abort(`Skipping other checks for the series “${series.querySelector(".pk_txt > em").innerText}” since a R-rated book in it was found.`);
                                series.classList.add("nsfw");
                            }
                        });
                    }
                }
            }
            catch (e)
            {
                console.error(e);
            }
        });
    }
}
else if (pathname === "/search3.aspx")
{
    const PageScript = ({ EVENT_KEY }) =>
    {
        const sandbox = document.createElement("iframe");
        sandbox.style.display = "none";
        document.body.appendChild(sandbox);

        sandbox.contentWindow.WebForm_PostBackOptions = WebForm_PostBackOptions;
        sandbox.contentWindow.WebForm_DoPostBackWithOptions = (options) => (new URL(options.actionUrl, location).href);

        const eval = sandbox.contentWindow.eval;
        sandbox.remove();

        window.addEventListener(`${EVENT_KEY}:getProductUrl`, ({ detail }) =>
        {
            const { RETURN_KEY, handler } = JSON.parse(detail);
            window.dispatchEvent(new CustomEvent(RETURN_KEY, { detail: eval(handler) }));
        });
    };

    const scriptWrapper = document.createElement("div");
    scriptWrapper.style.display = "none";
    const shadowRoot = scriptWrapper.attachShadow({ mode: "closed" });
    const script = document.createElement("script");
    script.textContent = `(${PageScript})(${JSON.stringify({ EVENT_KEY })}); //# sourceURL=userscript://page/${encodeURI(GM.info.script.name)}/Bestsellers%20Page.js`;
    shadowRoot.append(script);
    (document.body ?? document.head ?? document.documentElement).append(scriptWrapper);

    const products = document.querySelectorAll(".sdBook :is(.hot, .tabbook)");
    for (const product of products)
    {
        queue.push(async () =>
        {
            const url = await getProductUrl(product.querySelector("input").getAttribute("onclick"));
            if (await isNsfw(url))
            {
                product.classList.add("nsfw");
            }
        });
    }

    function getProductUrl(handler)
    {
        return new Promise((resolve) =>
        {
            const RETURN_KEY = uuid();

            window.addEventListener(RETURN_KEY, ({ detail: url }) =>
            {
                resolve(url);
            }, { once: true });

            window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:getProductUrl`, { detail: JSON.stringify({ RETURN_KEY, handler }) }));
        });
    }
}
else
{
    const products = document.querySelectorAll(".b_package, .owl-item, .comicBox li");
    for (const product of products)
    {
        queue.push(async () =>
        {
            if (await isNsfw(product.querySelector("a").href))
            {
                product.classList.add("nsfw");
            }
        });
    }
}
