// ==UserScript==
// @name               Kobo e-Books Update Checker
// @name:zh-TW         Kobo 電子書更新檢查器
// @description        Checks if updates were available for the e-books you own.
// @description:zh-TW  檢查你購買的電子書是否有更新檔提供。
// @icon               https://icons.duckduckgo.com/ip3/www.kobo.com.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.8.0
// @license            MIT
// @match              https://www.kobo.com/*/*/library/books
// @match              https://www.kobo.com/*/*/library/books?*
// @match              https://www.kobo.com/*/*/library/Books
// @match              https://www.kobo.com/*/*/library/Books?*
// @match              https://www.kobo.com/*/*/library/archive
// @match              https://www.kobo.com/*/*/library/archive?*
// @run-at             document-end
// @grant              GM.setClipboard
// @require            https://update.greasyfork.org/scripts/483122/1303118/style-shims.js
// @require            https://unpkg.com/typesafe-i18n@5.26.2/dist/i18n.object.min.js
// @require            https://update.greasyfork.org/scripts/482311/1297431/queue.js
// @supportURL         https://greasyfork.org/scripts/482410/feedback
// @downloadURL https://update.greasyfork.org/scripts/482410/Kobo%20e-Books%20Update%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/482410/Kobo%20e-Books%20Update%20Checker.meta.js
// ==/UserScript==

const LL = (function()
{
    const translations =
    {
        en: {
            HEADER: {
                MESSAGE: "Message",
            },
            BUTTON: {
                OKAY: "Okay",
                CHECK_PAGE: "Check Update for Page",
                CHECKING_PAGE: "Checking Update...",
                CHECK_SINGLE: "Check Update",
                COPY_OUTDATED: "Copy Outdated Books",
            },
            STATUS: {
                PENDING: "Pending...",
                CHECKING: "Checking...",
                LATEST: "Latest",
                OUTDATED: "Outdated",
                PREVIEW: "Preview",
                SKIPPED: "Skipped",
                FAILED: "Failed",
            },
            ERROR: {
                UNLISTED: "This book was unlisted, there’s no way to check update for this type of books at the moment.",
                PARSING: "Failed to parse the latest product ID, please contact the developer for further investigations.",
                UNKNOWN: "Unknown error, please contact the developer for further investigations.",
            },
            MESSAGE: {
                FINISHED_CHECKING_PAGE: "Finished checking all books for this page.\n\nLatest: {latest}\nOutdated: {outdated}\nSkipped: {skipped}\nFailed: {failed}",
                NO_BOOKS_BEEN_CHECKED: "No books have been checked.",
                NO_BOOKS_WERE_OUTDATED: "No books were outdated.",
                COPIED_BOOKS: "Copied {0} book{{s}} into the clipboard.",
            },
        },
        zh: {
            HEADER: {
                MESSAGE: "訊息",
            },
            BUTTON: {
                OKAY: "確定",
                CHECK_PAGE: "為本頁檢查更新",
                CHECKING_PAGE: "正在檢查更新…",
                CHECK_SINGLE: "檢查更新",
                COPY_OUTDATED: "複製過時書籍",
            },
            STATUS: {
                PENDING: "等待中…",
                CHECKING: "檢查中…",
                LATEST: "最新",
                OUTDATED: "過時",
                PREVIEW: "預覽",
                SKIPPED: "已略過",
                FAILED: "檢查失敗",
            },
            ERROR: {
                UNLISTED: "該書已下架，目前尚未有方法為這類書籍檢查更新。",
                PARSING: "無法解析最新的產品編號，請聯絡開發者以進一步調查。",
                UNKNOWN: "未知錯誤，請聯絡開發者以進一步調查。",
            },
            MESSAGE: {
                FINISHED_CHECKING_PAGE: "完成檢查本頁的書籍。\n\n最新：{latest}\n過時：{outdated}\n已略過：{skipped}\n檢查失敗：{failed}",
                NO_BOOKS_BEEN_CHECKED: "沒有已檢查的書籍。",
                NO_BOOKS_WERE_OUTDATED: "沒有過時的書籍。",
                COPIED_BOOKS: "已複製 {0} 本書到剪貼簿。",
            },
        },
    };

    let locale = location.pathname.match(/\/[a-z]{2}\/([a-z]{2})\//)?.[1] ?? "en";
    if (!Object.keys(translations).includes(locale))
    {
        console.warn("No translations available for this locale.")
        locale = "en";
    }

    return i18nObject(locale, translations[locale]);
})();

GM.addStyle(`
    .library-container .update-container
    {
        text-align: right;
    }

    .library-container .update-controls
    {
        min-width: 13rem;
        width: auto;
    }

    .library-container .update-button
    {
        border-radius: 20px;
        min-width: 0;
        max-width: 100%;
        width: auto;
        overflow: hidden;
        background-color: #eee;
        color: #000;
        font-size: 1.6rem;
        font-family: "Rakuten Sans UI", "Trebuchet MS", Trebuchet, Arial, Helvetica, sans-serif;
        font-weight: 400;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        white-space: nowrap;
        transition: background-color .3s ease-in-out, color .15s ease-in-out 0s;
    }

    .library-container .update-button:not(:first-child)
    {
        margin-left: 5px;
    }

    .library-container .update-button:not(:last-child)
    {
        margin-right: 5px;
    }

    .library-container .update-button::before
    {
        position: absolute;
        top: calc(50% - 30px);
        border-radius: 80px;
        width: calc(100% - 30px);
        height: 60px;
        background-color: rgba(0, 0, 0, .1);
        content: "";
        opacity: 0;
        transform: scale(0);
    }

    .library-container .update-button:disabled
    {
        background-color: "#dcdcdc";
        color: rgba(0,0,0,.42);
        pointer-events: none;
    }

    .library-container .update-button:hover
    {
        background-color: rgba(0, 0, 0, .04);
    }

    .library-container .update-button:focus::before
    {
        opacity: 1;
        transform: scale(1);
    }

    .library-container .update-button:active
    {
        background-color: #000;
        color: #fff;
    }

    @media (max-width: 568px)
    {
        .library-container .secondary-controls
        {
            margin-right: 18px;
        }

        .library-container .update-container
        {
            margin-bottom: 1.5rem;
            width: 100%;
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        .library-container .update-controls
        {
            margin-right: 0;
            width: 100%;
            white-space: break-spaces;
        }

        .library-container .update-button
        {
            margin-left: 0 !important;
            margin-right: 0 !important;
            width: 100%;
            text-align: center;
        }

        .library-container .update-button:not(:first-child)
        {
            margin-top: 8px;
        }

        .library-container .library-content.grid .more-actions:not(.open)
        {
            width: fit-content;
            transform: translateY(35px);
        }
    }

    .item-wrapper.book[data-check-status=outdated] .product-field.item-status
    {
        background: #FE8484;
    }

    .item-wrapper.book[data-check-status=skipped] .product-field.item-status
    {
        background: #B5B5B5;
    }

    .item-wrapper.book[data-check-status=failed] .product-field.item-status
    {
        background: #FFA700;
    }

    .item-wrapper.book:is([data-check-status=skipped], [data-check-status=failed]) .product-field.item-status a
    {
        text-decoration-line: underline;
        cursor: help;
    }
`);

function showModal(message)
{
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.addEventListener("click", (event) => ((event.target === modal) && closeModal()));

    const modalContent = document.createElement("div");
    modalContent.id = "modal-content";
    modalContent.classList.add("library-modal");

    const modalContainer = document.createElement("div");

    const closeWrapper = document.createElement("div");
    closeWrapper.classList.add("wrapper");

    const closeButton = document.createElement("button");
    closeButton.classList.add("modal-x", "close");
    closeButton.addEventListener("click", closeModal);

    const actionWrapper = document.createElement("div");
    actionWrapper.classList.add("wrapper");

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");

    const actionHeader = document.createElement("h2");
    actionHeader.classList.add("confirm");
    actionHeader.textContent = LL.HEADER.MESSAGE();

    const actionMessage = document.createElement("p");
    actionMessage.style = "display: inline-block; text-align: left;";
    actionMessage.innerHTML = String(message).replaceAll("\n", "<br />");

    const actionButtons = document.createElement("div");
    actionButtons.classList.add("cta");
    actionButtons.style = "display: block;";

    const okayButton = document.createElement("button");
    okayButton.classList.add("primary-button", "okay");
    okayButton.textContent = LL.BUTTON.OKAY();
    okayButton.addEventListener("click", closeModal);

    closeWrapper.append(closeButton);
    actionButtons.append(okayButton);
    actionContainer.append(actionHeader, actionMessage, actionButtons);
    actionWrapper.append(actionContainer);
    modalContainer.append(closeWrapper, actionWrapper);
    modalContent.append(modalContainer);
    modal.append(modalContent);
    document.body.append(modal);

    document.body.classList.add("show-modal");

    function closeModal()
    {
        if (document.querySelectorAll("#modal").length > 1)
        {
            modal.remove()
        }
        else
        {
            document.body.classList.remove("show-modal");
            setTimeout(() => modal.remove(), 250);
        }
    }
}

const Status =
{
    PENDING: "pending",
    CHECKING: "checking",
    LATEST: "latest",
    OUTDATED: "outdated",
    SKIPPED: "skipped",
    FAILED: "failed",
};

const queue = new Queue({ autostart: true, concurrency: 6 });
queue.addEventListener("error", (event) =>
{
    console.error(event.detail.error);
    showModal(LL.ERROR.UNKNOWN());
});

const observer = new MutationObserver((records) =>
{
    console.log(records);
    init();
});

observer.observe(document.getElementById("library-grid"), { childList: true });

init();

function init()
{
    const books = Array.from(document.querySelectorAll(".item-wrapper.book"));
    for (const book of books)
    {
        const actions = book.querySelector(".item-info + .item-bar .library-actions-list");

        const actionContainer = document.createElement("li");
        actionContainer.classList.add("library-actions-list-item");

        const action = document.createElement("button");
        action.classList.add("library-action");
        action.textContent = LL.BUTTON.CHECK_SINGLE();
        action.addEventListener("click", () => checkUpdate(book));

        actionContainer.appendChild(action);
        actions.appendChild(actionContainer);
    }

    const secondaryControls = document.querySelector(".secondary-controls");

    const updateContainer = document.createElement("div");
    updateContainer.classList.add("update-container");

    const updateControls = document.createElement("div");
    updateControls.classList.add("update-controls");

    const checkButton = document.createElement("button");
    checkButton.classList.add("update-button");
    checkButton.textContent = LL.BUTTON.CHECK_PAGE();
    checkButton.addEventListener("click", () => checkUpdateForBooks(books));

    const copyButton = document.createElement("button");
    copyButton.classList.add("update-button");
    copyButton.textContent = LL.BUTTON.COPY_OUTDATED();
    copyButton.addEventListener("click", () =>
    {
        if (!books.some((book) => book.dataset.checkStatus))
        {
            showModal(LL.MESSAGE.NO_BOOKS_BEEN_CHECKED());
            return;
        }

        const outdated = books.filter((book) => (book.dataset.checkStatus === Status.OUTDATED));
        if (outdated.length > 0)
        {
            GM.setClipboard(outdated.map(getBookTitle).join("\n"));
            showModal(LL.MESSAGE.COPIED_BOOKS(outdated.length));
        }
        else
        {
            showModal(LL.MESSAGE.NO_BOOKS_WERE_OUTDATED());
        }
    });

    updateControls.append(checkButton, copyButton);
    updateContainer.appendChild(updateControls);
    secondaryControls.insertBefore(updateContainer, secondaryControls.firstChild);

    function checkUpdateForBooks(books)
    {
        checkButton.disabled = true;
        checkButton.textContent = LL.BUTTON.CHECKING_PAGE();

        queue.addEventListener("end", () =>
        {
            let latest = 0;
            let outdated = 0;
            let skipped = 0;
            let failed = 0;

            for (const book of books)
            {
                switch (book.dataset.checkStatus)
                {
                    case Status.LATEST:
                        latest++;
                        break;
                    case Status.OUTDATED:
                        outdated++;
                        break;
                    case Status.SKIPPED:
                        skipped++
                        break;
                    case Status.FAILED:
                        failed++;
                        break;
                }
            }

            showModal(LL.MESSAGE.FINISHED_CHECKING_PAGE({ latest, outdated, skipped, failed }));

            checkButton.disabled = false;
            checkButton.textContent = LL.BUTTON.CHECK_PAGE();
        }, { once: true });

        books.forEach(checkUpdate);
    }
}

function getBookTitle(book)
{
    return book.querySelector(".product-field.title").innerText;
}

function getCurrentProductId(book)
{
    const config = JSON.parse(book.querySelector(".library-action:is(.mark-as-finished, .remove-from-archive)").dataset.koboGizmoConfig);
    return config.productId;
}

function getStorePageUrl(book)
{
    const titleUrl = book.querySelector(".product-field.title a").href;
    if (titleUrl.startsWith("https://www.kobo.com/")) { return titleUrl; }

    const config = JSON.parse(book.querySelector(".library-action:is(.mark-as-finished, .remove-from-archive)").dataset.koboGizmoConfig);
    const imageUrl = config.imageUrl;
    const productCode = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
    return `${location.href.substring(0, location.href.indexOf("/library"))}/ebook/${productCode}`;
}

async function getLatestProductId(book)
{
    const response = await fetch(getStorePageUrl(book), { credentials: "same-origin" });
    if (!response.ok)
    {
        if (response.status === 404)
        {
            throw new Error(LL.ERROR.UNLISTED());
        }

        throw new Error(LL.ERROR.UNKNOWN());
    }

    const html = await response.text();
    const parser = new DOMParser();
    const page = parser.parseFromString(html, "text/html");

    const itemId = page.querySelector("#ratItemId");
    if (itemId) { return itemId.value; }

    const config = page.querySelector(".item-detail");
    if (config) { return JSON.parse(config.dataset.koboGizmoConfig).productId; }

    throw new Error(LL.ERROR.PARSING());
}

function checkUpdate(book)
{
    const message = book.querySelector(".product-field.item-status");

    book.dataset.checkStatus = Status.PENDING;
    message.replaceChildren(LL.STATUS.PENDING());

    queue.push(async () =>
    {
        book.dataset.checkStatus = Status.CHECKING;
        message.textContent = LL.STATUS.CHECKING();

        if (book.dataset.koboGizmo === "PreviewLibraryItem")
        {
            book.dataset.checkStatus = Status.SKIPPED;

            message.classList.remove("buy-now");
            message.replaceChildren(LL.STATUS.PREVIEW());
            return;
        }

        try
        {
            const currentId = getCurrentProductId(book);
            const latestId = await getLatestProductId(book);
            console.debug(`${getBookTitle(book)}\n  Current: ${currentId}\n  Latest : ${latestId}`);

            if (currentId === latestId)
            {
                book.dataset.checkStatus = Status.LATEST;
                message.replaceChildren(LL.STATUS.LATEST());
            }
            else
            {
                book.dataset.checkStatus = Status.OUTDATED;
                message.replaceChildren(LL.STATUS.OUTDATED());
            }
        }
        catch (e)
        {
            book.dataset.checkStatus = Status.FAILED;

            const link = document.createElement("a");
            link.textContent = LL.STATUS.FAILED();
            link.addEventListener("click", (event) => showModal(e.message));

            message.replaceChildren(link);

            // throw e;
        }
    });
}
