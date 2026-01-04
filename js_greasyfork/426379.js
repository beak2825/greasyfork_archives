// ==UserScript==
// @name         Pikabu UI++
// @namespace    pikabuUIPlusPlus
// @version      1.60
// @description  Улучшение интерфейса
// @author       Array
// @license      CC-BY-SA-4.0
// @match        *://pikabu.ru/*
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/426379/Pikabu%20UI%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/426379/Pikabu%20UI%2B%2B.meta.js
// ==/UserScript==

// simbols source http://myhomeinet.ru/smilegenerator/page-274.html
// colors source https://www.w3schools.com/colors/colors_names.asp
// special thanks:
// @nazarpunk
// @moretraher2020
(function() {
    `use strict`;

    const DATA_LIFETIME = 604800000;
    const DATABASE = `db`;
    const DATABASE_VERSION = `1`;

    const EXP_VALUES = [3, 5, 8];
    const EXP_ICO = [`❊`, `•`, `︿`, `︽`, `⁂`, `★`];

    const NOTE_VALUES = [`#добро`, `#интересно`, `#осторожно`, `#неприемлемо`],
          NOTE_ICO = [`❤`, `♞`, `⚠`, `✖`],
          NOTE_COLORS = [`LimeGreen`, `DodgerBlue`, `OrangeRed`, `Violet`];

    const SUBS_VALUES = [40, 900, 4000, 9000],
          SUBS_ICO = [``, `◔`, `◑`, `◕`, `◉`];

    const BAN_ICO = [``, `ϟ`, `†`];
    const GENDER_ICO = [``, `♂`, `♀`];


    // ************************ ENTRY POINT *************************

    let MAKE_OLD_HEADER = GM_getValue(`MAKE_OLD_HEADER`, 1);
    let MAKE_ANSWER_TOP = GM_getValue(`MAKE_ANSWER_TOP`, 0);
    let MUTE_WATERMARK = GM_getValue(`MUTE_WATERMARK`, 1);
    let MINIFY_AUTHOR_PANEL = GM_getValue(`MINIFY_AUTHOR_PANEL`, 0);

    let SHOW_AUTHOR_LIKE = GM_getValue(`SHOW_AUTHOR_LIKE`, 0);
    let SHOW_SHORT_POST_DESIGN = GM_getValue(`SHOW_SHORT_POST_DESIGN`, 0);
    let SHOW_EMOTIONS = GM_getValue(`SHOW_EMOTIONS`, 1);
    let SHOW_COMMUNITY_DESCRIPTION = GM_getValue(`SHOW_COMMUNITY_DESCRIPTION`, 1);

    let SHOW_HIDDEN_LIKES = GM_getValue(`SHOW_HIDDEN_LIKES`, 1);
    let SHOW_HIDDEN_COMMENT_LIKES = GM_getValue(`SHOW_HIDDEN_COMMENT_LIKES`, 1);

    let SHOW_EXP = GM_getValue(`SHOW_EXP`, 1);
    let SHOW_NOTE = GM_getValue(`SHOW_NOTE`, 1);
    let SHOW_RATE = GM_getValue(`SHOW_RATE`, 1);
    let SHOW_SUBS = GM_getValue(`SHOW_SUBS`, 1);
    let SHOW_BAN = GM_getValue(`SHOW_BAN`, 1);
    let SHOW_GENDER = GM_getValue(`SHOW_GENDER`, 0);

    const ENABLED_QUICK_NOTES = () => SHOW_EXP || SHOW_NOTE || SHOW_RATE || SHOW_SUBS || SHOW_BAN || SHOW_GENDER;

    let SHOW_QUICK_NOTE_0 = GM_getValue(`SHOW_QUICK_NOTE_0`, 1);
    let SHOW_QUICK_NOTE_1 = GM_getValue(`SHOW_QUICK_NOTE_1`, 1);
    let SHOW_QUICK_NOTE_2 = GM_getValue(`SHOW_QUICK_NOTE_2`, 1);
    let SHOW_QUICK_NOTE_3 = GM_getValue(`SHOW_QUICK_NOTE_3`, 1);

    const SHOW_QUICK_NOTE_VALUES = [SHOW_QUICK_NOTE_0, SHOW_QUICK_NOTE_1, SHOW_QUICK_NOTE_2, SHOW_QUICK_NOTE_3];

    let AUTOBAN = GM_getValue(`AUTOBAN`, 0);


    let database = new Map();

    let loadingComments = new Map();
    let loadingOrder = [];
    let updateOrder = [];
    let intersectionItems = [];
    let loadingComment = null;


    let userpageRendered = false;


    // ************************ INIT *************************

    addCustomCSS();

    loadDatabase();


    document.addEventListener("DOMContentLoaded", () => {

        checkUserPage();

        checkSettingsPage();

        renderAnswerTop();

    }, {once: true});


    // ************************ EVENTS *************************

    // Intersections
    const intersector = new IntersectionObserver(entries =>
    {
        for (const entry of entries) {
            if (entry.isIntersecting)
            {
                intersectionItems.push(entry.target);


                if(answer != undefined && entry.target.classList.contains(`story-comments__top-trigger`))
                {
                    sectionTopTrigger.classList.toggle(`answer-trigger__place-holder`, false);

                    commentsRoot.prepend(answer);

                    sectionDownTrigger.classList.toggle(`answer-trigger__place-holder`, true);
                }

                if(answer != undefined && entry.target.classList.contains(`story-comments__down-trigger`))
                {
                    sectionDownTrigger.classList.toggle(`answer-trigger__place-holder`, false);

                    comments.appendChild(answer);

                    sectionTopTrigger.classList.toggle(`answer-trigger__place-holder`, true);

                }
            }
            else
            {
                const index = intersectionItems.indexOf(entry.target);
                if (index > -1) {
                    intersectionItems.splice(index, 1);
                }
            }
        }

    }, { threshold: 0 });


    // Ajax listener
    !function(send) {
        XMLHttpRequest.prototype.send = function(body) {
            send.call(this, body);

            if(body?.includes(`note`))
            {
                checkUserPage();
            }
        };
    }(XMLHttpRequest.prototype.send);


    // Mutation listener
    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // watermark
                if (MUTE_WATERMARK && node.dataset?.watermarked == 1)
                {
                    node.remove();
                }

                // header
                if (node.classList.contains(`header__main`))
                {
                    renderHeader(node);
                    setTimeout(() => { renderHeader(node); }, 50);
                }

                // posts
                if (node.classList.contains(`story`))
                {
                    renderPost(node);

                    checkPostReady(node);
                }

                // comments
                if (node.classList.contains(`comment__header`))
                {
                    renderComment(node.parentElement.parentElement);

                    checkCommentReady(node);
                }

            }
        }
    }).observe(document.body, {childList: true, subtree: true});


    // Visbility listener
    document.addEventListener("visibilitychange", function() {
        if(!document.hidden)
        {
            loadDatabase();

            nextLoading();
        }
    });


    // ************************ DATABASE *************************

    function loadDatabase()
    {
        let jobject = JSON.parse(GM_getValue(DATABASE, `{}`));

        database = new Map(Object.entries(jobject));

        let ver = GM_getValue(`version`, ``);
        if(ver != DATABASE_VERSION)
        {
            GM_setValue(`version`, DATABASE_VERSION);
            database = new Map();
        }
    }

    function saveDatabase()
    {
        let json = JSON.stringify(Object.fromEntries(database.entries()));
        GM_setValue(DATABASE, json);
    }

    function resetDatabase()
    {
        GM_setValue(DATABASE, `{}`);
    }


    // ************************ BASEMENT *************************

    function checkUserPage()
    {
        let url = window.location.href;
        let key = url.split(`@`)[1];

        if(url.includes(`@`) && !userpageRendered)
        {
            userpageRendered = true;
            renderUserpageTools();
        }

        if(database.has(key))
        {
            database.get(key).timestamp = 0;

            saveDatabase();

            updateUser(key);
        }
    }

    function checkSettingsPage()
    {
        let url = window.location.href;

        if(url.includes(`settings`)) renderSettings();
    }

    function checkPostReady(node)
    {
        if(!ENABLED_QUICK_NOTES()) return;

        let post = node?.querySelector(`.story__user-link`);

        if(post == null)
        {
            setTimeout(() => { checkPostReady(node) }, 50);
            return;
        }

        let userName = post.getAttribute(`data-name`);

        // check author-panel
        let panel = node?.querySelector(`.story__author-panel`);

        if(MINIFY_AUTHOR_PANEL && panel != null)
        {
            renderPostAuthor(node, post, userName);
            panel.remove();
        }

        checkUsername(userName, post);
    }

    function renderPostAuthor(node, userLink, userName)
    {
        let container = node.querySelector(`.story__community`);

        // move data
        let creationTime = container.querySelector(`.story__creation-date`);

        container.prepend(creationTime);

        // resize avatar
        let avatar = userLink.querySelector(`.avatar`);
        avatar.classList.toggle(`avatar_medium`, false);
        avatar.classList.toggle(`avatar_small`, true);

        // add text
        userLink.append(userName);

        // move elements
        let subContainer = document.createElement(`div`);
        subContainer.classList.add(`story__user`);
        subContainer.classList.add(`user`);
        node.querySelector(`.story__header`).prepend(subContainer);

        subContainer.prepend(container);

        container.prepend(userLink);

        container.classList.toggle(`story__community`, false);
        container.classList.toggle(`story__community_after-author-panel`, false);
        container.classList.toggle(`story__user-info`, true);
    }

    function checkCommentReady(node)
    {
        if(!ENABLED_QUICK_NOTES()) return;

        let commentBase = node.querySelector(`.comment__user`);
        let comment = commentBase?.querySelector(`.user__nick`);

        if(comment == null)
        {
            setTimeout(() => { checkCommentReady(node) }, 50);
            return;
        }

        let userName = commentBase.getAttribute(`data-name`);

        checkUsername(userName, comment);
    }

    function checkUsername(userName, holder)
    {
        if(userName == `DELETED` || userName == `Аноним`) return;

        // check is raw
        if(holder?.textContent.trim() == userName)
        {
            holder.dataset.name = userName;

            intersector.observe(holder);

            addComment(holder, userName);
        }
    }


    function updateUser(requestedUser)
    {
        if(!ENABLED_QUICK_NOTES()) return;

        // comemet usernames
        document.querySelectorAll(`.comment__user`).forEach((commentBase) => {

            let comment = commentBase.querySelector(`.user__nick`);

            let userName = commentBase.getAttribute(`data-name`);


            if(requestedUser == userName)
            {
                addComment(comment, userName);
            }

        });

        //post usernames
        document.querySelectorAll(`.story__user-link`).forEach((post) => {

            let userName = post.getAttribute(`data-name`);

            if(requestedUser == userName)
            {
                addComment(post, userName);
            }
        });

        if(loadingComment == null)
        {
            nextLoading();
        }
    }


    function addComment(comment, userName)
    {
        if(database.has(userName))
        {
            let date = new Date();
            let data = database.get(userName);

            renderUsername(userName, comment, data);

            // update data
            if(date.getTime() > (data.timestamp + DATA_LIFETIME))
            {
                if(loadingComments.has(userName))
                {
                    loadingComments.get(userName).push(comment);
                }
                else
                {
                    loadingComments.set(userName, [comment]);
                    updateOrder.push(userName);
                }
            }
        }
        else
        {
            //request data
            if(loadingComments.has(userName))
            {
                loadingComments.get(userName).push(comment);
            }
            else
            {
                loadingComments.set(userName, [comment]);

                loadingOrder.push(userName);

                nextLoading();
            }
        }

    }


    // ************************ LOADING  *************************

    function nextLoading()
    {
        //find intersection
        let intersectionUsername = null;
        for(const intersected of intersectionItems)
        {
            if(intersected?.dataset?.name == null) continue;

            if(loadingOrder.includes(intersected.dataset.name))
            {
                intersectionUsername = intersected.dataset.name;

                const index = loadingOrder.indexOf(intersectionUsername);
                if (index > -1) {
                    loadingOrder.splice(index, 1);
                }
                break;
            }

            if(updateOrder.includes(intersected.dataset.name))
            {
                intersectionUsername = intersected.dataset.name;

                const index = updateOrder.indexOf(intersectionUsername);
                if (index > -1) {
                    updateOrder.splice(index, 1);
                }
                break;
            }
        }


        if(loadingComment == null && intersectionUsername != null)
        {
            loadingComment = intersectionUsername;

            loadData(loadingComment);
        }
        else if(loadingComment == null && loadingOrder.length > 0)
        {
            loadingComment = loadingOrder.shift();

            loadData(loadingComment);
        }
        else if(loadingComment == null && updateOrder.length > 0)
        {
            // update expired data
            loadingComment = updateOrder.shift();

            loadData(loadingComment);
        }

    }

    function loadData(userName)
    {
        const body = new FormData();
        body.set(`action`, `get_short_profile`);
        body.set(`user_name`, userName);

        fetch(`/ajax/user_info.php`, {
            method: `post`,
            body  : body
        })
            .then(r => r.json())
            .then(result => {
            let data = parseData(result.data.html);

            if(data == null)
            {
                nextLoading();
                return;
            }

            if(document.hidden)
            {
                loadingOrder.push(loadingComment);
                loadingComment = null;

                return;
            }

            database.set(userName, data);

            saveDatabase();

            let comments = loadingComments.get(userName);
            loadingComments.delete(userName);

            if(comments != null)
            {
                for (let comment of comments)
                {
                    renderUsername(userName, comment, data);
                    intersector.unobserve(comment);
                }
            }


            loadingComment = null;

            setTimeout(() => {nextLoading();}, 100 + 400 * Math.random());
        });
    }


    // ************************ CLICKS  *************************

    let clickTimeout = false;
    function clickUserNote(e)
    {
        if(clickTimeout) return;

        clickTimeout = true;

        let note = e.target.getAttribute(`data-note`);
        let uid = e.target.getAttribute(`data-uid`);

        let url = window.location.href;
        let userName = url.split(`@`)[1];

        let data = database.get(userName);

        let message = ``;
        let mtype = `-`;
        if(data.note != (parseInt(note)+1))
        {
            message = NOTE_VALUES[note];
            mtype = `+`;
        }

        let textarea = document.querySelector(`.page-profile`).querySelector(`.profile-note__textarea`).value = message;
        let textdiv = document.querySelector(`.page-profile`).querySelector(`.profile-note__text`).textContent = message;

        const body = new FormData();
        body.set(`action`, `note`+mtype);
        body.set(`id`, uid);
        body.set(`message`, message);

        fetch(`/ajax/users_actions.php`, {
            method: `post`,
            body  : body
        })
            .then(result => {

            data.timestamp = 0;

            updateUser(userName);

            clickTimeout = false;

            applyAutoban(uid, (parseInt(note) == 3));
        });
    }


    function clickQuicknote(e)
    {
        if(clickTimeout) return;

        let note = e.target.getAttribute(`data-note`);
        let uid = e.target.getAttribute(`data-uid`);

        let comment = e.target?.parentElement?.parentElement?.querySelector(`.comment__user`);
        let userName = comment?.getAttribute(`data-name`);

        if(!database.has(userName)) return;

        clickTimeout = true;

        let refTool = e.target.parentElement?.querySelector(`a`);
        let ref = refTool?.getAttribute(`href`);

        let data = database.get(userName);

        let message = ``;
        let mtype = `-`;
        if(data.note != (parseInt(note)+1))
        {
            message = NOTE_VALUES[note]+` `+ref;
            mtype = `+`;
        }

        const body = new FormData();
        body.set(`action`, `note`+mtype);
        body.set(`id`, uid);
        body.set(`message`, message);

        fetch(`/ajax/users_actions.php`, {
            method: `post`,
            body  : body
        })
            .then(result => {

            data.timestamp = 0;

            updateUser(userName);

            clickTimeout = false;

            applyAutoban(uid, (parseInt(note) == 3));
        });
    }

    function applyAutoban(uid, isBan)
    {
        if(!AUTOBAN) return;

        const body = new FormData();
        body.set(`action`, isBan ? `ignore_in_comments` : `unignore_in_comments`);
        body.set(`id`, uid);

        fetch(`/ajax/ignore_actions.php`, {
            method: `post`,
            body  : body
        });
    }

    // ************************ PARSING  *************************

    function smartSlice(text, start, end)
    {
        let strIndex = text.indexOf(start);
        let endIndex = text.indexOf(end, strIndex + start.length + 1);

        return text.slice(strIndex+start.length, endIndex);
    }

    function parseData(html)
    {
        if(html == undefined || html == null) return null;

        let data = new Object();

        let regions = html.split(`information`);

        // ban
        let banStat = 0;
        if(regions[0].includes(`ban-status`))
        {
            banStat = 1;

            if(regions[0].includes(`навсегда`)) banStat = 2;
        }

        // note
        let noteStat = 0;
        if(regions[1].includes(`profile__note`))
        {
            let subRegions = regions[1].split(`profile__note-inner`);
            regions[1] = subRegions[0];

            for (let i = 0; i < NOTE_VALUES.length; i++)
            {
                if(subRegions[1].includes(NOTE_VALUES[i]))
                {
                    noteStat = i + 1;
                }
            }
        }

        // gender
        let genderStat = 0;
        if(regions[1].includes(`шник`)) genderStat = 1;

        if(regions[1].includes(`шница`)) genderStat = 2;


        //exp
        let expStat = 0;
        let expSource =	smartSlice(regions[1], `<span>`, `</div>`);

        let y = expSource.includes(`лет`) || expSource.includes(`год`);
        let m = expSource.includes(`месяц`);

        if(y || m)
        {
            if(y)
            {
                let years = parseInt(expSource);

                expStat = 2 + EXP_VALUES.length;
                for (let i = EXP_VALUES.length - 1; i >= 0; i--)
                {
                    if(years < EXP_VALUES[i])
                    {
                        expStat = 2 + i;
                    }
                }
            }
            else
            {
                expStat = 1;
            }
        }

        let digitalRegions = regions[1].split(`profile__digital`);

        //rate
        let rateStat = 0;

        let rateRaw = smartSlice(digitalRegions[1], `<b>`, `</b>`);

        if(rateRaw.includes(`К`))
        {
            rateStat = rateRaw.replace(`-`, `▽`);
        }
        else
        {
            rateStat = (Math.round(rateRaw/1000) + `K`).replace(`-`, `▽`);
        }

        if(rateStat.includes(`NaN`))
        {
            rateStat = `--`;
        }

        // subs
        let subsStat = 0;
        let rawSubs = smartSlice(digitalRegions[3], `<b>`, `</b>`);

        if(rawSubs.includes(`К`))
        {
            subsStat = 4;
        }
        else if(rawSubs > SUBS_VALUES[0])
        {
            subsStat = SUBS_VALUES.length;
            for (let i = SUBS_VALUES.length - 1; i > 0 ; i--)
            {
                if(rawSubs < SUBS_VALUES[i])
                {
                    subsStat = i;
                }
            }
        }

        // timestamp
        let date = new Date();
        data.timestamp = date.getTime();

        data.exp = expStat;
        data.note = noteStat;
        data.rate = rateStat;
        data.subs = subsStat;
        data.ban = banStat;
        data.gender = genderStat;

        return data;
    }

    // ************************ CSS  *************************

    function addCustomCSS()
    {
        let styles = ``;
        for (let i = 0; i < NOTE_COLORS.length; i++)
        {
            styles += `.`+NOTE_COLORS[i]+`_note {background-color: `+NOTE_COLORS[i]+`;}`;
        }

        styles += `.userpage__forced-on {opacity: 1 !important; visibility: visible !important;}`;
        styles += `.userpage-note-tools {margin-left: 15px !important; margin-top: 4px !important;}`;
        styles += `.userpage-note-tool {font-size: 18px !important; padding: 12px !important; padding-left: 12px !important; padding-right: 12px !important;}`;

        styles += `.header-old {background-color: var(--color--header__bg) !important; --color--header__bg: var(--color-primary-700) !important; color: #f9f9fb !important; --color-primary-100: var(--color-primary-500); --color-primary-800:#f9f9fb; --color-primary-200: var(--color-primary-400)}`;
        styles += `.header-black-old {--color-primary-800:var(--color-primary-900)}`;
        styles += `.header-item-old {--color-primary-700:var(--color-primary-900) !important;}`;
        styles += `.header-item-button-old {--color-primary-700:var(--color-primary-900) !important;}`;

        styles += `.settings__forced-off {opacity: 0 !important; visibility: hidden !important; max-height: 1px !important;}`;
        styles += `.answer-trigger {opacity: 0 !important; visibility: hidden !important; padding: 0px; border: 0px;  max-height: 0px; transition: none !important;}`;
        styles += `.answer-trigger__place-holder {opacity: 0 !important; visibility: hidden !important; padding: 0px; border: 0px;  height: 113px !important; max-height: 113px !important;}`;

        styles += `.nsfw-blur {filter: blur(0px); object-position: 200% 200%; object-fit: none;}`;

        let styleSheet = document.createElement(`style`);
        styleSheet.type = `text/css`;
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // ************************ RENDERING  *************************

    function renderUsername(userName, comment, data)
    {
        if(comment == null) return;

        let exp = ``;
        if(SHOW_EXP)
        {
            exp = EXP_ICO[data.exp] + ` `;
        }

        let note = ``;
        if(SHOW_NOTE && data.note > 0)
        {
            note = NOTE_ICO[data.note - 1] + ` `;

            let noteEl = comment?.parentElement?.parentElement?.querySelector(`.avatar__note`);

            if(noteEl == null || noteEl == undefined)
            {
                let avatar = comment?.parentElement?.parentElement?.querySelector(`.avatar`);

                noteEl = document.createElement(`span`);
                noteEl.classList.add(`avatar__note`);

                avatar.appendChild(noteEl);
            }

            // remove prev
            for (let i = 0; i < NOTE_COLORS.length; i++)
            {
                noteEl.classList.toggle(NOTE_COLORS[i]+`_note`, false);
            }

            noteEl.classList.add(NOTE_COLORS[data.note - 1]+`_note`);

        }
        if(SHOW_NOTE && data.note == 0)
        {
            let noteEl = comment?.parentElement?.parentElement?.querySelector(`.avatar__note`);

            if(noteEl != null && noteEl != undefined && noteEl.classList.length > 1)
            {
                noteEl.remove();
            }
        }

        let rate = ``;
        if(SHOW_RATE)
        {
            rate = data.rate + ` `;
        }

        let subs = ``;
        if(SHOW_SUBS)
        {
            subs = SUBS_ICO[data.subs] + ` `;
        }

        let ban = ``;
        if(SHOW_BAN && data.ban > 0)
        {
            ban = ` `+BAN_ICO[data.ban];
        }

        let gender = ``;
        if(SHOW_GENDER && data.gender > 0)
        {
            gender = ` `+GENDER_ICO[data.gender];
        }

        if(comment.childNodes.length > 1)
        {
            for (let i = 0; i < comment.childNodes.length; i++)
            {
                if(comment.childNodes[i].textContent.trim() == userName)
                {
                    comment.childNodes[i].textContent = exp + note + rate + subs + userName + ban + gender;
                }
            }
        }
        else
        {
            comment.textContent = exp + note + rate + subs + userName + ban + gender;
        }

    }

    function renderComment(comment)
    {
        let tools = comment.querySelector(`.comment__tools`);
        let authorLike = comment.querySelector(`.comment__author-like`);
        let rating = comment.querySelector(`.comment__rating-count`);
        let ratingUp = comment.querySelector(`.comment__rating-up`);
        let ratingDown = comment.querySelector(`.comment__rating-down`);

        renderAuthorLikes(authorLike);

        renderCommunityDescription();

        if(tools == null || rating == null || ratingUp == null || ratingDown == null)
        {
            setTimeout(() => { renderComment(comment); }, 50);
            return;
        }


        let meta = comment.getAttribute(`data-meta`);

        if(!comment.hasAttribute(`data-quicknote`) && (meta != null) && !meta.includes(`ua`))
        {
            comment.setAttribute(`data-quicknote`, 1);

            let uid = smartSlice(meta, `aid=`, `;`);

            renderCommentTools(tools, uid);
        }


        if(meta != null && meta.includes(`avh`))
        {
           let rawRating;

           let metaSplit = meta.split(`avh=`);

           if(metaSplit[1].includes(`;`))
           {
               rawRating = smartSlice(meta, `avh=`, `;`);
           }
           else
           {
               rawRating = metaSplit[1];
           }

           renderCommentLikes(rating, ratingUp, ratingDown, rawRating, comment.dataset.id, comment.dataset.authorId);
        }

    }

    function renderCommentTools(tools, uid)
    {
        if(!ENABLED_QUICK_NOTES()) return;

        for (let i = 0; i < NOTE_VALUES.length; i++)
        {
            if(!SHOW_QUICK_NOTE_VALUES[i]) continue;

            let tool = document.createElement(`div`);
            tool.classList.add(`comment__tool`);
            tool.classList.add(`hint`);

            tool.setAttribute(`aria-label`, `Отметить как `+NOTE_VALUES[i]);
            tool.setAttribute(`data-note`, i);
            tool.setAttribute(`data-uid`, uid);

            tool.textContent = NOTE_ICO[i];

            tool.addEventListener(`click`, clickQuicknote);

            tools.appendChild(tool);
        }
    }

    function renderCommunityDescription()
    {
        if(SHOW_COMMUNITY_DESCRIPTION) return;

        let page = document.querySelector(`.page-story`);

        page?.querySelectorAll(`.section-group`).forEach((section) => {

            let item = section.querySelector(`.community-comments`);

            if(item != null)
            {
                section.remove();
            }
        });
    }

    function renderAuthorLikes(like)
    {
        if(SHOW_AUTHOR_LIKE) return;

        like?.remove();
    }

    function renderCommentLikes(rating, ratingUp, ratingDown, raw, id, aid)
    {
        if(!SHOW_HIDDEN_COMMENT_LIKES) return;

        let dataMetaRating = raw.split(`:`);

        let storyId = id;
        let autorId = aid;
        let key = 253537024;
        let storySeed = (storyId % 99) + 1;
        let autorSeed = (autorId % 98);

        function restore(x)
        {
             return -x/storySeed - key - autorSeed / storySeed;
        }

        let plus = restore(dataMetaRating[0]);
        let minus = restore(dataMetaRating[1]);
        let resultRating = Math.round(plus - minus);

        if(resultRating > 100000 || resultRating < -100000) resultRating = 0;

        if(resultRating > 0) resultRating = `+`+resultRating;

        rating?.childNodes[0]?.remove();
        rating.textContent = resultRating;
        rating.setAttribute(`aria-label`, Math.round(plus)+` плюсов, `+Math.round(minus)+` минусов`);
        rating.dataset.originRating = resultRating;

        ratingUp.addEventListener(`click`, onChangeCommentRating);
        ratingDown.addEventListener(`click`, onChangeCommentRating);

    }

    function onChangeCommentRating(e)
    {
        let comment = e.target.parentNode;

        let rating = comment.querySelector(`.comment__rating-count`);
        let ratingUp = comment.querySelector(`.comment__rating-up`);
        let ratingDown = comment.querySelector(`.comment__rating-down`);

        setTimeout(() =>
        {
            let plus = ratingUp.classList.contains(`comment__rating-up_active`);
            let minus = ratingDown.classList.contains(`comment__rating-down_active`);

            let result = parseInt(rating.dataset.originRating) + (plus - minus);

            if(result > 0) result = `+`+result;

            rating.textContent = result;
        }, 50);

    }

    function renderUserpageTools()
    {
        if(!ENABLED_QUICK_NOTES()) return;

        let isUser = document.querySelector(`.page-profile`)?.querySelector(`.background`)?.hasAttribute(`data-editable`);

        if(isUser == true) return;

        let uid = document.querySelector(`.page-profile`).querySelector(`.section-group`).getAttribute(`data-user-id`);

        let root = document.querySelector(`.main__inner`);
        let panel = document.querySelector(`.feed-panel`);

        let tools = document.createElement(`div`);
        tools.classList.add(`comment__tools`);
        tools.classList.add(`userpage__forced-on`);
        tools.classList.add(`userpage-note-tools`);
        root.insertBefore(tools, panel);

        for (let i = 0; i < NOTE_VALUES.length; i++)
        {
            if(!SHOW_QUICK_NOTE_VALUES[i]) continue;

            let tool = document.createElement(`div`);
            tool.classList.add(`comment__tool`);
            tool.classList.add(`hint`);
            tool.classList.add(`userpage-note-tool`);

            tool.setAttribute(`aria-label`, `Отметить как `+NOTE_VALUES[i]);
            tool.setAttribute(`data-note`, i);
            tool.setAttribute(`data-uid`, uid);

            tool.textContent = NOTE_ICO[i];

            tool.addEventListener(`click`, clickUserNote);

            tools.appendChild(tool);
        }
    }

    function renderPost(article)
    {
        let rating = article.querySelector(`.story__rating-count`);
        let emotions = article.querySelector(`.story__emotions`);

        if(rating == null || emotions == null)
        {
            setTimeout(() => { renderPost(article); }, 50);
            return;
        }

        //

        if (SHOW_HIDDEN_LIKES && rating?.firstChild?.tagName == `SPAN`) {

            rating.removeChild(rating?.firstChild);

            let dataMetaRating = article.getAttribute(`data-meta-rating`).split(`:`);

            let storyId = article.getAttribute(`data-story-id`);
            let autorId = article.getAttribute(`data-author-id`);
            let key = 253537024;
            let storySeed = (storyId % 99) + 1;
            let autorSeed = (autorId % 98);

            function restore(x)
            {
                 return -x/storySeed - key - autorSeed / storySeed;
            }

            let resultRating = Math.round(restore(dataMetaRating[0]) - restore(dataMetaRating[1]));

            if(resultRating > 100000 || resultRating < -100000) resultRating = 0;

            rating.textContent = resultRating;
        }


        if(!SHOW_EMOTIONS)
        {
            emotions?.remove();
        }


        if(!SHOW_SHORT_POST_DESIGN)
        {
            article.classList.toggle(`story_short`, false);

            let bg = article.querySelector(`.icon--ui__bg-story-short`);

            bg?.remove();
        }
    }

    function renderHeader(header)
    {
        if(header == undefined) header = document.querySelector(`.header__main`);

        header.classList.toggle(`header-old`, MAKE_OLD_HEADER);

        header.querySelector(`.icon--ui__logo-text`).childNodes[0].classList.toggle(`header-old`, MAKE_OLD_HEADER);

        header.querySelector(`.header-menu__subs-counter`).classList.toggle(`header-black-old`, MAKE_OLD_HEADER);

        header.querySelectorAll(`.header-menu__item`).forEach(item => {

            item.classList.toggle(`header-item-button-old`, MAKE_OLD_HEADER);
        });

        header.querySelectorAll(`.header-right-menu__item`).forEach(item => {

            item.classList.toggle(`header-item-old`, MAKE_OLD_HEADER);
        });

    }

    let commentsRoot;
    let comments;
    let answer;
    let sectionTopTrigger;
    let sectionDownTrigger;
    function renderAnswerTop()
    {
        if(!MAKE_ANSWER_TOP) return;


        setTimeout(() =>
        {
            commentsRoot = document.querySelector(`.story-comments`);
            comments = commentsRoot?.querySelector(`.story-comments__all`);

            if(comments == null || comments.scrollHeight < window.screen.height) return;


            comments.querySelectorAll(`section`).forEach(item => {
                if(item.dataset?.role == `answer`)
                {
                    answer = item;
                }
            });



            sectionTopTrigger = document.createElement(`section`);
            sectionTopTrigger.classList.add(`story-comments__top-trigger`);
            sectionTopTrigger.classList.add(`answer-trigger`);
            comments.prepend(sectionTopTrigger);
            intersector.observe(sectionTopTrigger);

            sectionDownTrigger = document.createElement(`section`);
            sectionDownTrigger.classList.add(`story-comments__down-trigger`);
            sectionDownTrigger.classList.add(`answer-trigger`);
            comments.append(sectionDownTrigger);
            intersector.observe(sectionDownTrigger);

        }, 50);
    }

    // ************************ SETTINGS  *************************

    function renderSettings()
    {

        let enableUISection = false;

        let header = document.querySelector(`.feed-panel`).querySelector(`.menu`);

        let items = [];
        header.querySelectorAll(`.menu__item`).forEach(item => {
            items.push(item);
            item.addEventListener(`click`, (e) => {
                if(enableUISection)
                {
                    settingItem.classList.toggle(`menu__item_current`, false);

                    settings?.remove();

                    if(settingsOld != null)
                    {
                        settingsContainer.appendChild(settingsOld);
                        setTimeout(() => e.target.classList.toggle(`menu__item_current`, true), 100);
                    }

                    enableUISection= false;
                }
            });
        });

        let settingsContainer = document.querySelector(`.settings`);
        let settings;
        let settingsOld;

        let settingItem = document.createElement(`a`);
        settingItem.classList.add(`menu__item`);
        settingItem.classList.add(`menu__item_route`);
        settingItem.textContent = `UI++`;
        header.appendChild(settingItem);

        settingItem.addEventListener(`click`, () => {

            enableUISection = true;

            items.forEach(item => {item.classList.toggle(`menu__item_current`, false);});

            settingItem.classList.toggle(`menu__item_current`, true);

            settingsOld = settingsContainer.querySelector(`.settings-main`)
                        || settingsContainer.querySelector(`.settings-security`)
                        || settingsContainer.querySelector(`.settings-save`)
                        || settingsContainer.querySelector(`.settings-notifications`);

            settingsOld?.remove();

            settings = document.createElement(`div`);
            settings.classList.add(`settings-main`);
            settingsContainer.appendChild(settings);

            let sectionGroup = document.createElement(`div`);
            sectionGroup.classList.add(`section-group`);
            settings.appendChild(sectionGroup);

            let sectionHeader = document.createElement(`section`);
            sectionHeader.classList.add(`section_gray`);
            sectionGroup.appendChild(sectionHeader);

            let h = document.createElement(`h4`);
            h.textContent = `Настройки сторонего скрипта Pikabu UI++`;
            sectionHeader.appendChild(h);

            let sectionBody = document.createElement(`section`);
            //sectionBody.classList.add(`section`);
            sectionBody.classList.add(`section_padding_none`);
            sectionGroup.appendChild(sectionBody);

            let options = document.createElement(`div`);
            options.classList.add(`settings-main__options`);
            sectionBody.appendChild(options);

            const addLine = (tittle, desc) => {
                let line = document.createElement(`h4`);
                line.classList.add(`settings-main__sub-header`);
                line.textContent = tittle;
                options.appendChild(line);

                if(desc != undefined) line.insertAdjacentHTML(`beforeend`,`<i class="fa fa-question-circle hint" aria-label="`+desc+`"></i>`);

                return line;
            };

            let quickNoteElements = [];

            const addCheckbox = (tittle, current, name, desc) => {
                let op = document.createElement(`div`);
                op.classList.add(`settings-main__option`);
                options.appendChild(op);

                let l = document.createElement(`label`);
                op.appendChild(l);

                let checkbox = document.createElement(`span`);
                checkbox.classList.add(`checkbox`);
                checkbox.classList.add(`checkbox_switch`);
                checkbox.classList.toggle(`checkbox_checked`, current);
                checkbox.setAttribute(`tabindex`, `0`);
                checkbox.setAttribute(`unselectable`, `on`);
                l.appendChild(checkbox);

                checkbox.addEventListener(`click`, () => {
                    let value = !GM_getValue(name, 1);
                    GM_setValue(name, value);
                    eval(name+` = value;`);
                    checkbox.classList.toggle(`checkbox_checked`, value);

                    let hideQuickNote = !ENABLED_QUICK_NOTES();
                    for(const el of quickNoteElements)
                    {
                        el.classList.toggle(`settings__forced-off`, hideQuickNote);
                    }

                    if(name == `MAKE_OLD_HEADER`)
                    {
                        MAKE_OLD_HEADER = value;

                        renderHeader();
                    }
                });

                l.insertAdjacentHTML(`beforeend`, tittle);

                if(desc != undefined) l.insertAdjacentHTML(`beforeend`,`<i class="fa fa-question-circle hint" aria-label="`+desc+`"></i>`);

                return op;
            };

            // design

            addLine(`Внешний вид`);
            addCheckbox(`Вернуть старый дизайн шапки `, MAKE_OLD_HEADER, `MAKE_OLD_HEADER`, `Часть цветов может не совпадать, а некоторые анимации не работать. Получилось что получилось.`);
            addCheckbox(`Дублировать блок написания комментария в начало поста `, MAKE_ANSWER_TOP, `MAKE_ANSWER_TOP`);

            addLine(`Отображение стандартной информации`);
            addCheckbox(`Показывать лайки автора в его посте `, SHOW_AUTHOR_LIKE, `SHOW_AUTHOR_LIKE`);
            addCheckbox(`Показывать дизайн коротких постов `, SHOW_SHORT_POST_DESIGN, `SHOW_SHORT_POST_DESIGN`);
            addCheckbox(`Показывать эмоции у постов `, SHOW_EMOTIONS, `SHOW_EMOTIONS`);
            addCheckbox(`Показывать описание сообщества при открытии поста `, SHOW_COMMUNITY_DESCRIPTION, `SHOW_COMMUNITY_DESCRIPTION`);
            addCheckbox(`Уменьшить заголовок постов избранных авторов `, MINIFY_AUTHOR_PANEL, `MINIFY_AUTHOR_PANEL`);

            addLine(`Отображение скрытой информации`);
            addCheckbox(`Показывать оценку свежих постов `, SHOW_HIDDEN_LIKES, `SHOW_HIDDEN_LIKES`);
            addCheckbox(`Показывать оценку свежих комментариев `, SHOW_HIDDEN_COMMENT_LIKES, `SHOW_HIDDEN_COMMENT_LIKES`, `Оценка обновляется с небольшой задержкой.`);

            addLine(`Прочий функционал`);
            addCheckbox(`Убрать вотермарку pikabu.ru при копировании изображений `, MUTE_WATERMARK, `MUTE_WATERMARK`);

            addLine(`Дополнительная информация рядом с никнеймом `, `Данная функция отправляет множество запросов к серверу пикабу (на каждого пользователя по запросу), так что потенциально может замедлить работу сайта. Для отключения необходимо снять все пункты (блок умных заметок исчезнет).`);


            let noteDesc = ``;
            for(let i = 0; i < 4; i++) noteDesc += `<br>  `+NOTE_ICO[i]+` - `+NOTE_VALUES[i];

            addCheckbox(`Показывать дату регистрации `, SHOW_EXP, `SHOW_EXP`, EXP_ICO[0]+` - Менее месяца<br>`+EXP_ICO[1]+` - 1 год<br>`+EXP_ICO[2]+` - Более 1 года<br>`+EXP_ICO[3]+` - Более `+EXP_VALUES[0]+` лет<br>`+EXP_ICO[4]+` - Более `+EXP_VALUES[1]+` лет<br>`+EXP_ICO[5]+` - Более `+EXP_VALUES[2]+` лет`);
            addCheckbox(`Показывать значок умной заметки `, SHOW_NOTE, `SHOW_NOTE`, `Оставьте в заметке пользователя один из хэштегов чтобы показывать специальный маркер, а также изменить цвет заметки: `+noteDesc);
            addCheckbox(`Показывать рейтинг `, SHOW_RATE, `SHOW_RATE`);
            addCheckbox(`Показывать подписчиков `, SHOW_SUBS, `SHOW_SUBS`, SUBS_ICO[1]+` - Более `+SUBS_VALUES[0]+` подписчиков<br>`+SUBS_ICO[2]+` - Более `+SUBS_VALUES[1]+` подписчиков<br>`+SUBS_ICO[3]+` - Более `+SUBS_VALUES[2]+` подписчиков<br>`+SUBS_ICO[4]+` - Более `+SUBS_VALUES[3]+` подписчиков`);
            addCheckbox(`Показывать бан `, SHOW_BAN, `SHOW_BAN`, BAN_ICO[1]+` - Временныый бан<br>`+BAN_ICO[2]+` - Вечный бан` );
            addCheckbox(`Показывать пол `, SHOW_GENDER, `SHOW_GENDER`, GENDER_ICO[1]+` - Пикабушник<br>`+GENDER_ICO[2]+` - Пикабушница` );

            quickNoteElements.push(addLine(`Умные заметки `, `Рядом с комментариями и на странице пользователя будут кнопки для быстрого добавления заметки с хэштегом. Кнопки рядом с комментариями также сохраняют ссылку на комментарий. Нажатие на кнопку срабатывает сразу, однако иконка обновится с небольшой задержкой из-за очереди загрузки. <br>ОСТОРОЖНО: При добавлении хэтега через кнопку, предыдущая заметка полностью удаляется.`));

            quickNoteElements.push(addCheckbox(`Показывать кнопку #добро `, SHOW_QUICK_NOTE_0, `SHOW_QUICK_NOTE_0`));
            quickNoteElements.push(addCheckbox(`Показывать кнопку #интересно `, SHOW_QUICK_NOTE_1, `SHOW_QUICK_NOTE_1`));
            quickNoteElements.push(addCheckbox(`Показывать кнопку #осторожно `, SHOW_QUICK_NOTE_2, `SHOW_QUICK_NOTE_2`));
            quickNoteElements.push(addCheckbox(`Показывать кнопку #неприемлемый `, SHOW_QUICK_NOTE_3, `SHOW_QUICK_NOTE_3`));
            quickNoteElements.push(addCheckbox(`Автоматический бан #неприемлемого `, AUTOBAN, `AUTOBAN`, `При добавлении хэштега #неприемлемый автоматически скрываются комментарии пользователя. Если убрать хэштег, то комментарии снова будут показываться. Работает только при добавлении хэштегов через кнопки быстрого добавления.` ));

            let sectionBottom = document.createElement(`section`);
            sectionBottom.classList.add(`section_gray`);
            sectionBottom.classList.add(`section_center`);
            sectionGroup.appendChild(sectionBottom);

            let buttonClear = document.createElement(`button`);
            buttonClear.classList.add(`button_danger`);
            buttonClear.textContent = `УДАЛИТЬ КЭШИРОВАННЫЕ ДАННЫЕ`;
            sectionBottom.appendChild(buttonClear);


            buttonClear.addEventListener(`click`, () => {
                resetDatabase();
            });

            let hideQuickNote = !ENABLED_QUICK_NOTES();
            for(const el of quickNoteElements)
            {
                el.classList.toggle(`settings__forced-off`, hideQuickNote);
            }

        });

    }

})();