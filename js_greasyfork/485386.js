// ==UserScript==
// @name         Return Pikabu minus
// @version      0.6.2
// @namespace    pikabu-return-minus.pyxiion.ru
// @description  Возвращает минусы на Pikabu, а также фильтрацию по рейтингу.
// @author       PyXiion
// @match        *://pikabu.ru/*
// @connect      api.pikabu.ru
// @connect      pikabu.ru
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @require      https://greasyfork.org/scripts/452219-md5-%E5%87%BD%E6%95%B0/code/MD5%20%E5%87%BD%E6%95%B0.js?version=1099124
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485386/Return%20Pikabu%20minus.user.js
// @updateURL https://update.greasyfork.org/scripts/485386/Return%20Pikabu%20minus.meta.js
// ==/UserScript==
class HttpRequest {
    constructor(url) {
        this.url = url;
        this.httpMethod = "POST";
        this.headers = new Map();
        this.timeout = 15000;
    }
    addHeader(key, value) {
        this.headers.set(key, value);
        return this;
    }
    setHttpMethod(httpMethod) {
        this.httpMethod = httpMethod;
        return this;
    }
    // virtual
    getData() {
        return {};
    }
    execute(callback) {
        const details = {
            url: this.url,
            method: this.httpMethod,
            headers: Object.fromEntries(this.headers),
            data: JSON.stringify(this.getData()),
            timeout: this.timeout,
            responseType: "json",
            onerror: callback.onError,
            onload: callback.onSuccess,
            // TODO: ontimeout
        };
        details.anonymous = true;
        GM.xmlHttpRequest(details);
    }
    executeAsync() {
        return new Promise((resolve, reject) => {
            this.execute({
                onError: reject,
                onSuccess: resolve,
            });
        });
    }
}
//#endregion
//#region Pikabu API
var Pikabu;
(function (Pikabu) {
    const DOMAIN = "https://api.pikabu.ru/";
    const API_V1 = DOMAIN + "v1/";
    const API_KEY = "kmq4!2cPl)peZ";
    class API {
        static getDeviceId() {
            return "0";
        }
    }
    API.USER_AGENT = "ru.pikabu.android/1.21.15 (SM-N975F Android 7.1.2)";
    API.COOKIE = "unqKms867=aba48a160c; rm5bH=8c68fbfe3dc5e5f5b23a9ec1a8f784f8";
    class Request extends HttpRequest {
        constructor(domain, controller, params) {
            super(domain + controller);
            this.controller = controller;
            this.params = params;
            this.setHttpMethod("GET");
            this.addHeader("DeviceId", API.getDeviceId());
            this.addHeader("User-Agent", API.USER_AGENT);
            this.addHeader("Cookie", API.COOKIE);
            this.addHeader("Content-Type", "application/json");
        }
        setParam(key, value) {
            this.params[key] = value;
        }
        static getHash(data, controller, ms) {
            const join = Object.values(data).sort().join(",");
            const toHash = [API_KEY, controller, ms, join].join(",");
            const hashed = MD5(toHash);
            return btoa(hashed);
        }
        getData() {
            const ms = Date.now();
            const data = {
                new_sort: 1,
                ...this.params,
            };
            return {
                ...data,
                id: "iws",
                hash: Request.getHash(data, this.controller, ms),
                token: ms,
            };
        }
        async executeAsync() {
            const response = await super.executeAsync();
            const data = response.response;
            if (!("response" in data)) {
                throw new Error(data?.error?.message ?? "Unknown error");
            }
            return data.response;
        }
    }
    class PostRequest extends Request {
        constructor(controller, params) {
            super(API_V1, controller, params);
            this.setHttpMethod("POST");
        }
    }
    class RatingObject {
    }
    Pikabu.RatingObject = RatingObject;
    class Post extends RatingObject {
        constructor(payload) {
            super();
            this.videos = [];
            this.id = payload.story_id;
            this.pluses = payload.story_pluses ?? 0;
            this.minuses = payload.story_minuses ?? 0;
            this.rating = payload.story_digs ?? (this.pluses - this.minuses);
            this.parseData(payload.story_data);
        }
        parseData(dataArr) {
            for (let data of dataArr) {
                if (data.type.includes('v')) { // v means video (maybe)
                    data = data.data;
                    let urls = [];
                    let extensions = ['mp4', 'webm', 'av1'];
                    for (let ext of extensions) {
                        if (ext in data && data[ext].url) {
                            urls.push(data[ext].url);
                        }
                    }
                    this.videos.push(urls);
                }
            }
        }
    }
    Pikabu.Post = Post;
    class Comment extends RatingObject {
        constructor(payload) {
            super();
            this.id = payload.comment_id;
            this.parentId = payload.parent_id;
            this.rating = payload.comment_rating ?? 0;
            this.pluses = payload.comment_pluses ?? 0;
            this.minuses = payload.comment_minuses ?? 0;
        }
    }
    Pikabu.Comment = Comment;
    class StoryData {
        constructor(payload) {
            this.story = "story" in payload ? new Post(payload.story) : null;
        }
    }
    Pikabu.StoryData = StoryData;
    class CommentsData extends StoryData {
        constructor(payload) {
            super(payload);
            this.selectedCommentId = 0;
            this.comments = payload.comments.map((x) => new Comment(x));
        }
    }
    Pikabu.CommentsData = CommentsData;
    let DataService;
    (function (DataService) {
        async function fetchStory(storyId, commentsPage) {
            const params = {
                story_id: storyId,
                page: commentsPage,
            };
            try {
                const request = new PostRequest("story.get", params);
                const payload = (await request.executeAsync());
                const commentsData = new CommentsData(payload);
                return commentsData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        }
        DataService.fetchStory = fetchStory;
    })(DataService = Pikabu.DataService || (Pikabu.DataService = {}));
})(Pikabu || (Pikabu = {}));
//#endregion
let enableFilters = null;
const shouldProcessComments = window.location.href.includes("/story/");
const config = {
    debug: false,
    minStoryRating: 100,
    summary: true,
    filteringPageRegex: "^https?:\\/\\/pikabu.ru\\/(|best|companies)$",
    ratingBar: false,
    ratingBarComments: false,
    minRatesCountToShowRatingBar: 10,
    minusesPattern: null,
    minusesCommentPattern: null,
    ownCommentPattern: null,
    unrollCommentariesAutomatically: false,
    videoDownloadButtons: true,
    showBlockAuthorForeverButton: true,
    update() {
        config.debug = GM_config.get("debug").valueOf();
        config.minStoryRating = GM_config.get("minStoryRating").valueOf();
        config.summary = GM_config.get("summary").valueOf();
        config.filteringPageRegex = GM_config.get("filteringPageRegex").valueOf();
        config.ratingBar = GM_config.get("ratingBar").valueOf();
        config.ratingBarComments = GM_config.get("ratingBarComments").valueOf();
        config.minRatesCountToShowRatingBar = GM_config.get("minRatesCountToShowRatingBar").valueOf();
        function makeEval(args, str, defaultFunc) {
            try {
                return new Function(args, "return " + str);
            }
            catch {
                return defaultFunc;
            }
        }
        config.minusesPattern = makeEval("story", GM_config.get("minusesPattern").valueOf().replace("%d", "story.minuses"), (story) => story.minuses);
        config.minusesCommentPattern = makeEval("comment", GM_config.get("minusesCommentPattern").valueOf().replace("%d", "comment.minuses"), (comment) => comment.minuses);
        config.ownCommentPattern = makeEval("comment", GM_config.get("ownCommentPattern").valueOf(), (comment) => (comment.pluses == 0 && comment.minuses == 0) ? 0 : `${comment.pluses}/${comment.minuses}`);
        config.unrollCommentariesAutomatically = GM_config.get("unrollCommentariesAutomatically").valueOf();
        config.videoDownloadButtons = GM_config.get("videoDownloadButtons").valueOf();
        config.showBlockAuthorForeverButton = GM_config.get("showBlockAuthorForeverButton").valueOf();
        enableFilters = new RegExp(config.filteringPageRegex).test(window.location.href);
    },
    formatMinuses(story) {
        return config.minusesPattern(story).toString();
    },
    formatCommentMinuses(comment) {
        return config.minusesCommentPattern(comment).toString();
    },
    formatOwnRating(comment) {
        return config.ownCommentPattern(comment).toString();
    },
};
let isConfigInit = false;
GM_config.init({
    id: "prm",
    title: (() => {
        const div = document.createElement('div');
        const p1 = document.createElement('p');
        p1.textContent = "Return Pikabu minus";
        const links = [];
        function addLink(text, url) {
            const link = document.createElement('a');
            link.href = url;
            link.textContent = text;
            links.push(link);
        }
        addLink("Телеграм", "https://t.me/return_pikabu");
        addLink("GitHub", "https://github.com/PyXiion/Pikabu-Return-Minus");
        div.append(p1, ...links);
        return div;
    })(),
    fields: {
        // ОБЩИЕ НАСТРОЙКИ
        summary: {
            section: [
                "Общие настройки",
            ],
            type: "checkbox",
            default: config.summary,
            label: "Отображение суммарного рейтинга у постов и комментариев.",
        },
        minRatesCountToShowRatingBar: {
            type: "int",
            default: config.minRatesCountToShowRatingBar,
            label: "Минимальное количество оценок у поста или комментария для отображения соотношения плюсов и минусов. " +
                "Установите на 0, чтобы всегда показывать.",
        },
        // НАСТРОЙКИ ПОСТОВ
        minStoryRating: {
            section: [
                "Настройки постов",
            ],
            type: "int",
            default: config.minStoryRating,
            label: "Посты с рейтингом ниже указанного будут удаляться из ленты. Вы сможете увидеть удалённые посты в списке просмотренных.",
        },
        ratingBar: {
            type: "checkbox",
            default: config.ratingBar,
            label: "Отображение соотношения плюсов и минусов у постов. При отсутствии оценок у поста будет показано соотношение 1:1.",
        },
        showBlockAuthorForeverButton: {
            type: "checkbox",
            default: config.showBlockAuthorForeverButton,
            label: "Отображение кнопки, которая блокирует автора поста навсегда. То есть добавляет в игнор-лист. " +
                "Вы должны быть авторизированы на сайте, иначе кнопка работать не будет.",
        },
        videoDownloadButtons: {
            type: "checkbox",
            label: "Добавляет ко всем видео в постах ссылки на источники, если их возможно найти.",
            default: config.videoDownloadButtons,
        },
        // НАСТРОЙКИ КОММЕНТАРИЕВ
        ratingBarComments: {
            section: [
                "Настройки комментариев",
            ],
            type: "checkbox",
            default: config.ratingBarComments,
            label: "Отображение соотношения плюсов и минусов у комментариев.",
        },
        unrollCommentariesAutomatically: {
            type: "checkbox",
            default: config.unrollCommentariesAutomatically,
            label: "Раскрывать все комментарии автоматически. Не рекомендую использовать со слабым интернетом."
        },
        // БОЛЕЕ СЛОЖНЫЕ НАСТРОЙКИ
        filteringPageRegex: {
            section: ["Продвинутые настройки"],
            type: "text",
            label: "Страницы, на которых работает фильтрация по рейтингу (регулярное выражение).",
            default: config.filteringPageRegex,
        },
        minusesPattern: {
            type: "text",
            default: "story.minuses",
            label: "Шаблон отображения минусов у постов (JS). Пример: `story.minuses * 5000`. story: {id, rating, pluses, minuses}. Внутри может выполняться любой код, поэтому используйте с осторожностью.\n" +
                "Шаблоны гарантированно работают только на Tampermonkey.",
        },
        minusesCommentPattern: {
            type: "text",
            default: "comment.minuses",
            label: "Шаблон отображения минусов у комментариев (JS). Пример: `comment.minuses * 5000`. comment: {id, rating, pluses, minuses}.",
        },
        ownCommentPattern: {
            type: "text",
            default: "comment.pluses == 0 && comment.minuses == 0 ? 0 : comment.pluses == comment.minuses ? `+${comment.pluses} / -${comment.minuses}` : comment.pluses == 0 ? `-${comment.minuses}` : comment.minuses == 0 ? `+${comment.pluses}` : `+${comment.pluses} / ${comment.rating} / -${comment.minuses}`",
            label: "Шаблон отображения рейтинга у ВАШИХ комментариев (JS). Пример: `comment.minuses * 5000`. comment: {id, rating, pluses, minuses}.",
        },
        debug: {
            type: "checkbox",
            label: "Включить дополнительные логи в консоли. Для разработки и отладки.",
            default: config.debug
        },
    },
    events: {
        init() {
            isConfigInit = true;
        },
        save() {
            config.update();
        },
    },
    css: `
  #prm .config_header p { margin: 0; }
  #prm .config_header a { 
    font-size: medium; 
    margin: 0 10px;
  }
  #prm input { margin-right: 10px; }
  #prm input[type=text] {
    border: 1px solid #cccccc;
    border-radius: 10px;
    background: #ffffff !important;
    outline: none;
    height: 100%;
   font-family: Tahoma;
  }
  #prm .config_var { 
    margin: 10px 0;
    display: flex
  }
  #prm .config_var .field_label {
    padding-top: 4px;
  }
  `
});
const logPrefix = "[RPM]";
function info(...args) {
    if (config.debug) {
        console.info(logPrefix, ...args);
    }
}
function warn(...args) {
    if (config.debug) {
        console.warn(logPrefix, ...args);
    }
}
function error(...args) {
    if (config.debug) {
        console.error(logPrefix, ...args);
    }
}
const waitConfig = new Promise((resolve) => {
    let isInit = () => setTimeout(() => (isConfigInit ? resolve() : isInit()), 1);
    isInit();
});
const supportMenuCommands = GM.registerMenuCommand !== undefined;
GM.registerMenuCommand("Открыть настройки", () => {
    info("Открыты настройки.");
    GM_config.open();
});
function addCss(css) {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    // is added to the end of the body because it must override some of the original styles
    document.body.appendChild(styleSheet);
    info("Добавлен CSS");
}
class CommentData {
    constructor(data) {
        this.id = data.id;
        this.rating = data.rating;
        this.pluses = data.pluses;
        this.minuses = data.minuses;
    }
}
// Variables
const cachedComments = new Map();
let oldInterface = null;
const cachedPostVideos = new Map();
const blockIconTemplate = (function () {
    const div = document.createElement("div");
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon--ui__save"><use xlink:href="#icon--ui__ban"></use></svg>`;
    return div.firstChild;
})();
// Functions
async function blockAuthorForever(button, authorId) {
    button.disabled = true;
    // const fetch = unsafeWindow.fetch;
    try {
        await fetch(`https://pikabu.ru/ajax/ignore_actions.php?authors=${authorId}&story_id=0&period=forever&action=add_rule`, {
            method: "POST",
        });
        button.remove();
        info("Автор с ID", authorId, "заблокирован");
    }
    catch {
        button.disabled = false;
        error("Не получилось заблокировать автора с ID", authorId, ", возможно отсутствует Интернет-соединение");
    }
}
function addBlockButton(story) {
    const saveButton = story.querySelector(".story__save");
    if (saveButton === null) {
        warn("Failed to add a block button to", story);
        return;
    }
    const button = document.createElement("button");
    button.classList.add("rpm-block-author", "hint");
    button.setAttribute("aria-label", "Заблокировать автора навсегда");
    button.appendChild(blockIconTemplate.cloneNode(true));
    const authorId = parseInt(story.getAttribute("data-author-id"));
    button.addEventListener("click", () => {
        blockAuthorForever(button, authorId);
    });
    saveButton.parentElement.insertBefore(button, saveButton);
}
function processComment(comment) {
    const commentElem = document.getElementById(`comment_${comment.id}`);
    if (commentElem === null) {
        if (comment instanceof Pikabu.Comment)
            cachedComments[comment.id] = new CommentData(comment);
        return;
    }
    const userElem = commentElem.querySelector(".comment__user");
    if (userElem.hasAttribute("data-own") &&
        userElem.getAttribute("data-own") === "true") {
        const textRatingElem = commentElem.querySelector(".comment__rating-count");
        textRatingElem.innerText = config.formatOwnRating(comment);
        return;
    }
    const ratingDown = commentElem.querySelector(".comment__rating-down");
    const minusesText = document.createElement("div");
    minusesText.classList.add("comment__rating-count");
    ratingDown.prepend(minusesText);
    minusesText.textContent = config.formatCommentMinuses(comment);
    if (config.summary) {
        const summary = document.createElement("div");
        summary.classList.add("comment__rating-count", "rpm-summary");
        summary.textContent = comment.rating.toString();
        ratingDown.parentElement.insertBefore(summary, ratingDown);
    }
    const totalRates = comment.pluses + comment.minuses;
    if (config.ratingBarComments &&
        totalRates >= config.minRatesCountToShowRatingBar) {
        let ratio = 0.5;
        if (totalRates > 0)
            ratio = comment.pluses / totalRates;
        addRatingBar(commentElem, ratio);
    }
}
async function processStoryComments(storyId, storyData, page) {
    for (const comment of storyData.comments) {
        processComment(comment);
    }
    if (storyData.comments.length >= 100) {
        storyData = await Pikabu.DataService.fetchStory(storyId, page + 1);
        await processStoryComments(storyId, storyData, page + 1);
    }
}
function addRatingBar(story, ratio) {
    const block = story.querySelector(".story__rating-block, .comment__body, .story__emotions");
    if (block !== null) {
        const bar = document.createElement("div");
        const inner = document.createElement("div");
        bar.append(inner);
        bar.classList.add("rpm-rating-bar");
        inner.classList.add("rpm-rating-bar-inner");
        inner.style.height = (ratio * 100).toFixed(1) + "%";
        block.prepend(bar);
    }
    else {
        // TODO mobile
    }
}
function processOldStory(story, storyData) {
    let ratingElem = story.querySelector(".story__footer-rating > div");
    let isMobile = false;
    if (ratingElem !== null) {
        // mobile
        isMobile = true;
    }
    else {
        // pc
        ratingElem = story.querySelector(".story__left .story__rating-block");
    }
    if (ratingElem === null) {
        return false;
    }
    oldInterface = true;
    let ratingDown = ratingElem.querySelector(".story__rating-minus, .story__rating-down");
    if (isMobile) {
        const buttonMinus = document.createElement("button");
        buttonMinus.classList.add("story__rating-minus");
        buttonMinus.innerHTML = `
    <span class="story__rating-rpm-count">${storyData.story.minuses}</span>
    <span type="button" class="tool story__rating-down" data-role="rating-down">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon--ui__rating-down icon--ui__rating-down_story">
        <use xlink:href="#icon--ui__rating-down"></use>
      </svg>
    </span>`;
        ratingDown.replaceWith(buttonMinus);
        ratingDown = buttonMinus;
    }
    else {
        const minusesCounter = document.createElement("div");
        minusesCounter.classList.add("story__rating-count");
        minusesCounter.textContent = config.formatMinuses(storyData.story);
        ratingDown.prepend(minusesCounter);
    }
    if (config.summary) {
        const summary = document.createElement("div");
        if (isMobile)
            summary.classList.add("story__rating-rpm-count", "rpm-summary");
        else
            summary.classList.add("story__rating-count");
        summary.textContent = storyData.story.rating.toString();
        ratingDown.parentElement.insertBefore(summary, ratingDown);
    }
    const totalRates = storyData.story.pluses + storyData.story.minuses;
    if (config.ratingBar && totalRates >= config.minRatesCountToShowRatingBar) {
        let ratio = 0.5;
        if (totalRates > 0)
            ratio = storyData.story.pluses / totalRates;
        addRatingBar(story, ratio);
    }
    processStoryComments(storyData.story.id, storyData, 1);
    return true;
}
async function processStory(story, processComments) {
    // Block author button
    if (config.showBlockAuthorForeverButton) {
        addBlockButton(story);
    }
    const storyId = parseInt(story.getAttribute("data-story-id"));
    // get story data
    const storyData = await Pikabu.DataService.fetchStory(storyId, 1);
    // delete the story if its ratings < the min rating
    if (enableFilters &&
        storyData.story.rating < config.minStoryRating) {
        story.remove();
        info("Удалил пост", story, "по фильтру рейтинга:", `storyData.story.rating < config.minStoryRating = ${storyData.story.rating} < ${config.minStoryRating} = true`);
        return;
    }
    // videos
    if (config.videoDownloadButtons)
        processPostVideos(story, storyData);
    // determine post style
    if (oldInterface === true) {
        processOldStory(story, storyData);
        return;
    }
    const ratingElem = story.querySelector(".story__rating");
    if (ratingElem === null) {
        if (oldInterface === null && !processOldStory(story, storyData)) {
            warn("У поста нет элементов рейтинга.", story);
        }
        return;
    }
    oldInterface = false;
    const ratingDown = ratingElem.querySelector(".story__rating-down");
    const minusesText = document.createElement("div");
    minusesText.classList.add("story__rating-rpm-count");
    ratingDown.prepend(minusesText);
    minusesText.textContent = config.formatMinuses(storyData.story);
    if (config.summary) {
        const summary = document.createElement("div");
        summary.classList.add("story__rating-rpm-count", "rpm-summary");
        summary.textContent = storyData.story.rating.toString();
        ratingElem.insertBefore(summary, ratingDown);
    }
    if (shouldProcessComments) {
        await processStoryComments(storyData.story.id, storyData, 1);
    }
}
async function processStories(stories) {
    for (const story of stories) {
        processStory(story, false);
    }
}
function processCached(commentElem) {
    const commentId = parseInt(commentElem.getAttribute("data-id"));
    if (commentId in cachedComments) {
        processComment(cachedComments[commentId]);
        delete cachedComments[commentId];
    }
}
function processPostVideos(story, storyData) {
    function getPostPlayers() {
        return Array.from(story.querySelectorAll('.story-block_type_video'));
    }
    function createUrl(text, url) {
        const urlElem = document.createElement('a');
        urlElem.target = '_blank';
        urlElem.textContent = text;
        urlElem.href = url;
        return urlElem;
    }
    function addUrlToPlayer(videoBlock, urls) {
        const player = videoBlock.querySelector('.player');
        // to check video origin
        const dataType = player.getAttribute("data-type");
        const urlListElem = document.createElement('p');
        urlListElem.classList.add('rpm-video-list');
        // if it's a pikabu video
        if (dataType == "video-file") {
            for (const url of urls) {
                const extension = '.' + url.split('.').pop();
                urlListElem.appendChild(createUrl(extension, url));
            }
        }
        else {
            // try get video url
            const dataSource = player.getAttribute('data-source');
            if (dataSource)
                urlListElem.appendChild(createUrl('Источник', dataSource));
        }
        if (urlListElem.hasChildNodes())
            videoBlock.parentElement.insertBefore(urlListElem, videoBlock.nextSibling);
        else
            urlListElem.remove();
    }
    const playerElements = getPostPlayers();
    for (const i in storyData.story.videos) {
        const player = playerElements[i];
        const videoUrls = storyData.story.videos[i];
        addUrlToPlayer(player, videoUrls);
    }
}
function addVideoDownloadButtons(postId, url) {
    const videoControls = Array.from(document.querySelectorAll(`.story[data-story-id="${postId}"] .player__controls`));
    function addButton(link, videoControls) {
        const a = document.createElement("a");
        a.classList.add("rpm-download-video-button");
        const name = link.split("/").pop(); // "https://example/com/some_cool_video.mp4" -> "some_cool_video.mp4"
        const extension = name.split(".").slice(1).join("."); // "some_cool_video.mp4" -> "mp4" (and "video.av1.mp4" -> "av1.mp4")
        a.href = link;
        a.download = name;
        a.textContent = extension;
        // add link to controls
        videoControls.append(a);
    }
    const videos = cachedPostVideos[postId];
    for (const i in videoControls) {
        for (const url of videos[i]) {
            addButton(url, videoControls[i]);
        }
    }
}
function unrollComments(button) {
    info('Раскручиваю ' + button.querySelector('span').textContent);
    button.click();
    setTimeout(() => {
        if (document.body.contains(button)) {
            unrollComments(button);
        }
    }, 500);
}
function mutationsListener(mutationList, observer) {
    for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement))
                continue;
            if (node.matches(".comment__header")) {
                const commentElem = node.closest(".comment");
                processCached(commentElem);
            }
            else if (node.matches("article.story")) {
                const storyElem = node;
                processStory(storyElem, false);
            }
            else if (node.matches(".comment__more") && config.unrollCommentariesAutomatically) {
                const button = node;
                unrollComments(button);
            }
        }
    }
}
var observer = null;
function addSettingsOpenButton() {
    let block = 
    // mobile version
    document.querySelector('.footer__links .accordion')
        // else PC version
        ?? document.querySelector(".sidebar .sidebar__inner");
    if (block === null) {
        console.error("[RPM] Не удалось найти место для создания кнопки открытия настроек.");
        return;
    }
    const button = document.createElement('button');
    button.innerText = "Открыть настройки Return Pikabu minus";
    button.classList.add('rpm-open-settings-button');
    button.addEventListener('click', () => {
        button.disabled = true;
        GM_config.open();
        button.disabled = false;
    });
    block.appendChild(button);
}
async function main() {
    await waitConfig;
    config.update(); // Just in case.
    addCss(`.story__rating-up {
    margin-right: 5px !important;
  }
  .prm-minuses {
    padding-left: 7px !important;
    margin: 0px !important;
  }
  .story__rating-down {
    margin-left: 0 !important;
  }
  .story__rating-count {
    margin: 7px 0 7px;
  }
  .rpm-summary-comment {
    margin-right: 8px;
  }
  .comment__rating-down .comment__rating-count {
    margin-right: 8px;
  }
  .comment__rating-down {
    padding: 2px 8px;
  }
  .story__footer .story__rating-rpm-count {
    font-size: 13px;
    color: var(--color-black-700);
    margin: auto 7px auto 7px;
    line-height: 0;
    display: block;
  }
  .story__footer .rpm-summary,
  .comment .rpm-summary {
    margin: auto 9px auto 0px;
    font-weight: 500;
  }
  .comment__rating-rpm-count {
    padding: 2px 8px;
    flex-shrink: 0;
    margin-left: auto;
  }
  .rpm-rating-bar {
    width: 5px;
    background: var(--color-danger-800);
    height: 90%;
    position: absolute;
    right: -9.5px;
    top: 5%;
    border-radius: 5px;
  }
  .rpm-rating-bar-inner {
    background: var(--color-primary-700);    /* width: 99%; */
    border-radius: 5px;
  }
  .comment__body {
    position: relative;
  }
  .comment .rpm-rating-bar {
    height: 70px;
    top: 15px;
    left: -10px;
  }  /* old mobile interface */
  .story__footer-rating .story__rating-minus {
    background-color:var(--color-black-300);
    border-radius:8px;
    overflow:hidden;
    padding:0;
    display:flex;
    align-items:center  ;
  }
  .story__footer-rating .story__rating-down {
    display:flex;
    align-items:center;
    justify-content:center;
    padding-left:2px  ;
  }
  .rpm-download-video-button {
    color: var(--color-bright-900);
    font-size: 125%;
    margin-left: 3px;
  }
  .rpm-block-author {
    overflow:hidden;
    margin-right:24px;
    cursor:pointer;
    display:flex;
    align-items:center;
    padding:0;
    background:0 0  
  }
  .rpm-block-author:hover * {
    fill: var(--color-danger-800);
  }
  .story__footer-tools-inner .rpm-block-author {
    overflow: visible;
    margin-right: auto;
    margin-left:8px;
    transform: scale(1.3);
  }
  .rpm-open-settings-button {
    margin-top: 10px;
    text-align: center;
    width: 100%;
    font-size: 0.9em;
  }
  
  .rpm-video-list {
    text-align: center;
  }
  .rpm-video-list a {
    margin: 0 5px;
  }

  #prm {
    border-radius: 10px;
  }
  @media only screen and (max-width: 768px)  {
    #prm {
      left: 2.5% !important;
      width: 100% !important;
    }
  } `);
    // process static posts
    processStories(document.querySelectorAll("article.story"));
    observer = new MutationObserver(mutationsListener);
    observer.observe(document.querySelector(".app__content, .main__inner"), {
        childList: true,
        subtree: true,
    });
    if (!supportMenuCommands)
        addSettingsOpenButton();
}
window.addEventListener("load", main);
