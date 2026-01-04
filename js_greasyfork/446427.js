// ==UserScript==
// @name         Amgm_Script{Twitter}
// @namespace    twitter.com/Amgm_life
// @version      0.4.1.2-custom-0.12
// @description  HomeTLの自動更新, ユーザー詳細ページでユーザーのメタデータを取得, ツイ時刻を表示
// @author       Amagumo
// @match        https://twitter.com/*
// @icon         https://pbs.twimg.com/profile_images/1432407590688808963/mlJVxYpk.jpg
// @run-at       document-idle
// @grant        none
// @license      Amagumo
// @downloadURL https://update.greasyfork.org/scripts/446427/Amgm_Script%7BTwitter%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/446427/Amgm_Script%7BTwitter%7D.meta.js
// ==/UserScript==

console.log("[Amgm_Script{Twitter}] start: Twitter_TLAutoReload v.0.2.0");
(function () {
    let $header = null;
    const $mark = document.createElement("div"),
        $point = document.createElement("div");

    $mark.classList.add("Amgm_mark");
    $mark.style = `
        width: 40px;
        height: 40px;
        position: relative;
        display: inline-block;`;
    $point.style = `
        width: 12px;
        height: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background-color: #4AF;
        box-shadow: 0 4px 12px #4AF8;`;
    $mark.appendChild($point);

    function changeReloadDisplay() {
        updateMark();
        const $effect = document.createElement("div");
        $effect.style = `
            width: 12px;
            height: 12px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 100%;
            background-color: #FA4;
            opacity: 1;
            transition: 0s;`;
        $mark.insertBefore($effect, $point);
        $point.style.backgroundColor = "#FA4";
        $point.style.transition = "0s";
        setTimeout(() => {
            $effect.style.width = "40px";
            $effect.style.height = "40px";
            $effect.style.opacity = "0";
            $effect.style.backgroundColor = "#4AF";
            $effect.style.transition = ".75s ease-out";
            $point.style.backgroundColor = "#4AF";
            $point.style.transition = ".5s";
            setTimeout(() => {
                $effect.remove();
            }, 1200);
        });
    }

    function updateMark() {
        const _$header = document.querySelector("#react-root main h2");
        if ($header !== _$header && _$header != null) {
            $header = _$header;
        }
        if (!$header.querySelector(".Amgm_mark")) {
            const $span = $header.querySelector(":scope > span");
            if ($span == null) return;
            $header.prepend($mark);
            $header.style = `
                display: flex;
                align-items: center;`;
        }
    }

    function reloadTL(callbackFunc = () => { }) {
        const searchSug = document.getElementById("typeaheadDropdown-6");
        const tweetBtn = document.querySelector('[data-testid="tweetButtonInline"]');
        if ($header != null && !searchSug && tweetBtn.getAttribute("aria-disabled")) {
            console.log("tried reloading");
            try {
                $header.click();
            } catch (e) {
                console.log(e);
            }
            callbackFunc();
        }else{
            console.log("reloading was canseled");
        }
    }

    setInterval(() => (window.scrollY <= 200 && /twitter\.com\/home/.test(location.href) && reloadTL(changeReloadDisplay)), 6000);

    setInterval(updateMark, 200);

    const keyInfo = {
        pressed: new Set()
    };
    const nowURL = location.href;

    let isBoosting = false;
    document.addEventListener("keydown", e => {
        keyInfo.pressed.add(e.keyCode);
        if (keyInfo.pressed.has(16) && keyInfo.pressed.has(17)) {
            if (!isBoosting) {
                isBoosting = true;
                const reload = () => {
                    if (isBoosting) {
                        reloadTL(changeReloadDisplay);
                        setTimeout(reload, 500)
                    }
                }
                reload();
            }
        } else {
            isBoosting = false;
        }
        if (keyInfo.pressed.has(18)){
            if (nowURL.match("home")){
                window.location.href = 'https://twitter.com/notifications';
            }else{
                window.location.href = 'https://twitter.com/home';
            }
        }
    }
    );
    document.addEventListener("keyup", e => {
        keyInfo.pressed.delete(e.keyCode);
        isBoosting = false;
    }
    );
})();

console.log("[Amgm_Script{Twitter}] start: Twitter_getUserAllData v.0.3.0");
window.Amgm_getUserAllData = window.Amgm_getUserAllData ?? { itv: "" };
(async function () {
    //=======オプション========================
    let mainUserId, mainUserDisplayId;
    //mainUserId = "";
    //mainUserDisplayId = "Amgm_min";

    //=========================================

    async function main(getOption, userId, userDisplayId) {
        //
        //displayIdからuserIdを入れる
        if (!userId) {
            userId = (await getUserByDisplayId(userDisplayId)).id;
        }

        console.groupCollapsed("Log");
        const user = await getUserAllData(getOption, userId);
        console.groupEnd("Log");

        console.log("UserAllData:", user);
        return user;
    }


    //定数定義
    //const cookie = document.cookie;
    //const parsedCookie = cookie.split(";").reduce((p, str) => (p[str.trim().split("=")[0]] = str.trim().split("=").slice(1).join("="), p), {});
    //const twitterCsrfToken = parsedCookie["ct0"];
    const requestHeaders = {
        authorization: "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "x-csrf-token": document.cookie.split(";").reduce((p, str) => (p[str.trim().split("=")[0]] = str.trim().split("=").slice(1).join("="), p), {})["ct0"]
    }

    // 以下関数定義群
    class User {
        constructor(id, _user, _result) {
            this.id = id
            this.setData(_user, _result);
            User.list.set(this.id, this);
        }

        static create(_user, _result) {
            const id = _result?.rest_id || _user?.entryId?.match(/user-(.*)/)?.[1];
            if (User.list.has(id)) {
                const user = User.list.get(id);
                if (user.data == null) user.setData(_user, _result);
                return user;
            } else {
                return new User(id, _user, _result);
            }
        }

        setData(_user, _result) {
            this.data = User.parseData(_result || _user?.content?.itemContent?.user_results?.result);
        }

        toString() {
            return `${this.data?.displayName} (@${this.data?.displayId}, userId:${this.data?.userId})`;
        }

        inShort() {
            return {
                type: "User",
                id: this.id,
                message: this.toString()
            };
        }

        export(option = { onlyBasic: true }) {
            const ret = {
                type: "User",
                id: this.id,
                data: {
                    displayName: this.data.displayName,
                    displayId: this.data.displayId
                }
            };

            if (option.onlyBasic) return ret;
            if (option.withTweets) ret.tweets = this.data?.tweets;
            if (option.followings) ret.followings = this.data?.followings;
        }

        toJSONString() {
            const fullExported = new Set();
            return JSON.stringify(this, (key, val) => {
                if (val != null && typeof val === "object" && "inShort" in val) {
                    if (fullExported.has(val))
                        return val.inShort();
                    fullExported.add(val);
                }
                return val;
            });
        }

        withTweetsToJSON(user) {
            let flg = false;
            JSON.stringify(user, (key, value) => {
                let ret;
                if (value instanceof user.constructor) {
                    if (!flg) ret = (flg = true, value);
                    else ret = value.toString();
                } else ret = value;
                //console.log(key, value, ret, flg);
                return ret;
            });
        }

        static parseData(_userResult) {
            const legacyData = _userResult.legacy
                , userData = {};
            if (!legacyData) return null;

            userData.url = `https://twitter.com/intent/user?user_id=${_userResult.rest_id}`;
            userData.userId = _userResult.rest_id;
            userData.displayName = legacyData.name;
            userData.displayId = legacyData.screen_name;
            userData.contents = {
                profile: {
                    bio: legacyData.description,
                    link: legacyData.entities.url?.urls,
                    location: legacyData.location,
                    banner: {
                        url: legacyData.profile_banner_url
                    },
                    icon: {
                        url: legacyData.profile_image_url_https.match(/(.*)_normal(.*)/)?.slice(1).join("")
                    }
                },
                tweets: []
            };
            userData.status = {
                tweetCount: legacyData.statuses_count,
                followingCount: legacyData.friends_count,
                followerCount: legacyData.followers_count,
                favoriteCount: legacyData.favourites_count
            };
            userData.protected = legacyData.protected;
            userData.metadata = {
                createdAt: new Date(legacyData.created_at).toLocaleString(),
                relation: {
                    blocked: legacyData.blocked_by,
                    blocking: legacyData.blocking,
                    can_dm: legacyData.can_dm,
                    can_media_tag: legacyData.can_media_tag,
                    follow_request_sent: legacyData.follow_request_sent,
                    following: legacyData.following,
                    followed: legacyData.followed_by,
                    notifications: legacyData.notifications
                },
                account: {
                    needsPhoneVerification: legacyData.needsPhoneVerification,
                    verified: legacyData.verified
                }
            }
            return userData;
        }

        static list = new Map();
    }

    class Tweet {
        constructor({ id, _tweet, _result }, option = { withTweetData: true }) {
            this.id = id;
            if (option.withTweetData) this.setData({ _tweet, _result }, option);
            else this.dataState = "notget"; //fulfilled: 設定済み, getting: 取得中, notget: (意図的に)設定しない, unavailable: 取得できない
            Tweet.list.set(id, this);
        }

        static create({ _tweet, _result }, option) {
            const id = _result?.rest_id || _tweet?.entryId?.match(/(tweet|tombstone)-(.*)/)?.[2];

            let tweet;
            if (Tweet.list.has(id)) {
                tweet = Tweet.list.get(id);
                if (tweet.data == null) tweet.setData({ _tweet, _result });
            } else {
                tweet = new Tweet({ id, _tweet, _result }, option);
            }
            if (_tweet?.entryId?.match(/(tweet|tombstone)-(.*)/)?.[1] === "tombstone") {
                tweet.type = "TweetUnavailable",
                    tweet.data = {
                        message: "このアカウントの所有者はツイートを表示できるアカウントを制限しているため、このツイートを表示できません。"
                    },
                    tweet.dataState = "unavailable";
            }
            return tweet;
        }

        setData({ _tweet, _result }, option) {
            _result = _result ?? _tweet?.content?.itemContent?.tweet_results?.result ?? _tweet?.item?.itemContent?.tweet_results?.result;
            if (_result == null || _result.legacy == null) (this.dataState = "getting", getTweetById(this.id));
            else this.data = Tweet.parseData(_result, option), this.dataState = "fulfilled";
        }

        toString() {
            return ``;
        }

        static parseData(_tweetResult, option = { withDeepTweetData: false }) {
            const legacyData = _tweetResult.legacy
                , tweetData = {};

            tweetData.url = `https://twitter.com/____/status/${_tweetResult.rest_id}`;
            tweetData.user = User.create(null, _tweetResult.core.user_results.result);
            tweetData.contents = {
                body: legacyData.full_text,
                entities: legacyData.entities
            }
            tweetData.metadata = {
                createdAt: new Date(legacyData.created_at).toLocaleString() + "." + ((BigInt(_tweetResult.rest_id) / 2n ** 22n + 1288834974657n) + "").substr(-3)
            }
            tweetData.favorited = legacyData.favorited;
            tweetData.retweeted = legacyData.retweeted;

            tweetData.status = {
                favoriteCount: legacyData.favoriteCount,
                retweetCount: legacyData.retweetCount,
                quoteRetweetCount: legacyData.quote_count,
                replyCount: legacyData.reply_count
            };

            tweetData.isQuoteRetweet = legacyData.is_quote_status;
            if (tweetData.isQuoteRetweet) {
                if (option.withDeepTweetData) {
                    if (_tweetResult.quoted_status_result)
                        tweetData.quotesFrom = Tweet.create({ _result: _tweetResult.quoted_status_result.result });
                    else if (_tweetResult.quotedRefResult) {
                        tweetData.quotesFrom = Tweet.create({ _result: _tweetResult.quotedRefResult.result });
                    } else {
                        tweetData.quotesFrom = Tweet.create({ _result: { rest_id: legacyData.quoted_status_id_str } });
                    }
                } else {
                    tweetData.quotesFrom = Tweet.create({ _result: { rest_id: legacyData.quoted_status_id_str } }, { withTweetData: false });
                }
            }
            tweetData.lang = legacyData.lang;
            tweetData.source = legacyData.source;

            return tweetData;
        }

        static list = new Map();
    }

    async function getUserAllData(getOption, userId) {
        console.log("[LOG] getUser: start");
        const user = await getUserById(userId);
        console.log("[LOG] getUser: end");
        if (getOption.withFollowings) {
            console.log("[LOG] getFF: start");
            await Promise.all([
                getUserFollowings(userId).then(value => user.data.followings = value),
                getUserFollowers(userId).then(value => user.data.followers = value)
            ]);
            console.log("[LOG] getFF: end");
        }
        if (getOption.withTweets) {
            console.log("[LOG] getTweets: start");
            user.data.contents.tweets = await getUserTweets(userId);
            console.log("[LOG] getTweets: end");
        }
        return user;
    }

    async function getUserFollowings(userId) {
        const responseData = await (await fetch("https://twitter.com/i/api/graphql/-3d6bgUvvpS1za6IxK_Tiw/Following?variables=" + encodeURIComponent(JSON.stringify({
            userId,
            count: 3000,
            withTweetQuoteCount: true,
            includePromotedContent: true,
            withSuperFollowsUserFields: true,
            withUserResults: true,
            withBirdwatchPivots: true,
            withReactionsMetadata: true,
            withReactionsPerspective: true,
            withSuperFollowsTweetFields: true
        })), {
            method: "GET",
            headers: requestHeaders
        })).json();

        if (responseData.errors) throw responseData;

        //Promise.all(promises).then(vs=>console.log("all data gotten. data is ready"));

        if (responseData.data.user.result.__typename == "UserUnavailable") {
            return console.warn("このユーザーのフォロー情報を取得できません：考えられる理由…鍵垢でフォロリクが通っていない"), null;
        }

        return fulfillUserData(responseData.data.user.result.timeline.timeline.instructions.find(v => v.type === "TimelineAddEntries").entries);
    }

    async function getUserFollowers(userId) {
        const responseData = await (await fetch("https://twitter.com/i/api/graphql/OiQ-k9n4O7JXwzXRy17q8w/Followers?variables=" + encodeURIComponent(JSON.stringify({
            userId,
            count: 3000,
            withTweetQuoteCount: true,
            includePromotedContent: true,
            withSuperFollowsUserFields: true,
            withUserResults: true,
            withBirdwatchPivots: true,
            withReactionsMetadata: true,
            withReactionsPerspective: true,
            withSuperFollowsTweetFields: true
        })), {
            method: "GET",
            headers: requestHeaders
        })).json();

        if (responseData.errors) throw responseData;

        //Promise.all(promises).then(vs=>console.log("all data gotten. data is ready"));

        if (responseData.data.user.result.__typename == "UserUnavailable") {
            return console.warn("このユーザーのフォロー情報を取得できません：考えられる理由…鍵垢でフォロリクが通っていない"), null;
        }

        return fulfillUserData(responseData.data.user.result.timeline.timeline.instructions.find(v => v.type === "TimelineAddEntries").entries);
    }

    async function getUserTweets(userId) {
        const responseData = await (await fetch("https://twitter.com/i/api/graphql/5REQtLlz1xHJlVxbHwHYwg/UserTweetsAndReplies?variables=" + encodeURIComponent(JSON.stringify({
            userId,
            count: 1_500,
            withTweetQuoteCount: true,
            includePromotedContent: true,
            withCommunity: true,
            withSuperFollowsUserFields: false,
            withUserResults: true,
            withBirdwatchPivots: false,
            withReactionsMetadata: false,
            withReactionsPerspective: false,
            withSuperFollowsTweetFields: false,
            withVoice: true
        })), {
            method: "GET",
            headers: requestHeaders
        })).json();

        if (responseData.errors) console.error(responseData);

        if (responseData.data.user.result.__typename == "UserUnavailable") {
            return console.warn("このユーザーのフォロー情報を取得できません：考えられる理由…鍵垢でフォロリクが通っていない"), null;
        }

        //Promise.all(promises).then(vs=>console.log("all data gotten. data is ready"));
        return fulfillTweetData(responseData.data.user.result.timeline.timeline.instructions.find(v => v.type === "TimelineAddEntries").entries.filter(v => (/tweet\-/.test(v.entryId) || /homeConversation\-/.test(v.entryId))), userId);
    }

    async function getTweetById(tweetId, returnRaw) {
        const responseData = await (await fetch("https://twitter.com/i/api/graphql/jIP_kjSmfhm3o5QGdKmgEw/TweetDetail?variables=" + encodeURIComponent(JSON.stringify({
            focalTweetId: tweetId,
            with_rux_injections: false,
            includePromotedContent: true,
            withCommunity: true,
            withTweetQuoteCount: true,
            withBirdwatchNotes: false,
            withSuperFollowsUserFields: false,
            withUserResults: true,
            withBirdwatchPivots: false,
            withReactionsMetadata: false,
            withReactionsPerspective: false,
            withSuperFollowsTweetFields: false,
            withVoice: true
        })), {
            method: "GET",
            headers: requestHeaders
        })).json();

        if (responseData.errors) console.error(responseData);

        if (returnRaw)
            return responseData;
        else {
            const tweet = Tweet.create({ _tweet: responseData.data.threaded_conversation_with_injections.instructions.find(v => v.type === "TimelineAddEntries").entries[0] });
            tweet.data.getFrom = "tweetDetail";
            return tweet;
        }
    }

    async function getUserById(userId, returnRaw) {
        const responseData = await (await fetch("https://twitter.com/i/api/graphql/7AJ1plFCAlL1nMTEi30tYw/UserByRestId?variables=" + encodeURIComponent(JSON.stringify({
            userId: userId,
            withSafetyModeUserFields: true,
            withSuperFollowsUserFields: false
        })), {
            method: "GET",
            headers: requestHeaders
        })).json();

        //console.log(responseData);
        if (responseData.errors) console.error(responseData);

        if (returnRaw)
            return responseData;
        else {
            const user = User.create(null, responseData.data.user.result);
            user.data.getFrom = "userDetail";
            return user;
        }
    }

    async function getUserByDisplayId(displayId, returnRaw) {
        const responseData = await (await fetch("https://twitter.com/i/api/graphql/B-dCk4ph5BZ0UReWK590tw/UserByScreenName?variables=" + encodeURIComponent(JSON.stringify({
            screen_name: displayId,
            withSafetyModeUserFields: true,
            withSuperFollowsUserFields: false
        })), {
            method: "GET",
            headers: requestHeaders
        })).json();

        //console.log(responseData);
        if (responseData.errors) console.error(responseData);

        if (returnRaw)
            return responseData;
        else {
            const user = User.create(null, responseData.data.user.result);
            user.data.getFrom = "userDetail";
            return user;
        }
    }

    async function fulfillUserData(_userEntries) {
        //覚書(変数名)
        //_user：TwitterAPIからのレスポンスそのまま
        //user ：parseして見やすくしたuserData

        const users = [],
            promises = [];
        for (let _user of _userEntries) {
            if (!_user.entryId.match(/user-/)) continue;

            const type = _user.content.itemContent.user_results.result.__typename;
            const user = User.create(_user);
            if (type === "User") {
                user.data.getFrom = user.data.getFrom || "userFollowings";
            } else if (type === "UserUnavailable") {
                user.type = "UserUnavailable";
                promises.push(getUserById(user.id).then(res_user => user.data = res_user.data));
            }
            users.push(user);
        }
        return users;
    }

    async function fulfillTweetData(_tweetEntries, userId) {
        const tweetList = new Set();
        for (let _tweet of _tweetEntries) {
            const type = _tweet.entryId.match(/(tweet|homeConversation)/)[0];
            if (type === "tweet")
                tweetList.add(Tweet.create({ _tweet }));
            else if (type === "homeConversation") {
                _tweet.content.items.forEach(__tweet => {
                    tweetList.add(Tweet.create({ _tweet: __tweet }));
                });
            }
        }
        const tweets = Array.from(tweetList).sort((tweet1, tweet2) => -Number(BigInt(tweet1.id) - BigInt(tweet2.id))).filter(tweet => tweet.dataState === "fulfilled" ? tweet.data.user.id === userId : tweet.dataState !== "notget");
        return tweets;
    }

    class View_Object extends HTMLElement {
        constructor() {
            super();
            const $ = {
                shadow: this.attachShadow({ mode: "open" }),
                self: document.createElement("div"),
                wrap: document.createElement("div"),
                wrap_keyValue: document.createElement("div"),
                key: document.createElement("p"),
                value: document.createElement("div"),
                valuesWrap: document.createElement("div"),
                values: null,
                options: document.createElement("div")
            }
            this.expanded = false;
            this.fulfillValues = false;
            this.$ = $;

            $.key.classList.add("key");
            $.value.classList.add("value");
            $.wrap_keyValue.appendChild($.key);
            $.wrap_keyValue.appendChild(document.createTextNode(":"));
            $.wrap_keyValue.appendChild($.value);
            $.wrap_keyValue.classList.add("wrap-keyValue");

            $.options.classList.add("options");

            $.wrap.classList.add("wrap");
            $.wrap.appendChild($.wrap_keyValue);
            $.wrap.appendChild($.options);

            $.valuesWrap.classList.add("values");

            $.shadow.appendChild($.self);
            $.self.setAttribute("id", "self");
            $.self.appendChild($.wrap);
            $.self.appendChild($.valuesWrap);

            this.collapse();

            this.addEventListener("click", e => {
                this.toggleExpand();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });

            const $style = document.createElement("style");
            $.shadow.appendChild($style);
            $style.textContent = `
				:host #self {
					position: relative;
					background-color: white;
					border-radius: 2px;
				}

				.wrap {
					white-space: nowrap;
                    width: 100%;
					padding: 0;
                    display: inline-flex;
                    align-items: flex-start;
				}

                .wrap-keyValue {
					display: inline-flex;
                    margin-right: 12px;
                }

				.key {
					display: inline;
					color: #037e9a;
                    margin: 0;
				}
				.value {
					display: inline-block;
					white-space: nowrap;
					overflow-x: auto;
					margin: 1px 0;
                    margin-left: 4px;
				}
				:host([can-expanded]) .value {
					box-shadow: 0 1px 3px #0002;
                    padding: 0 8px;
                    border-radius: 2px;
				}
				:host([expanded]) .value {
					border: 1px #0001;
					box-shadow: none;
				}
				.value > p {
					margin: 0;
					padding: 0;
					display: inline-block;
				}
				:host([datatype="number"]) .value, :host([datatype="boolean"]) .value, :host([datatype="null"]) .value {
					color: #427;
				}
				:host([datatype="string"]) .value {
					color: #820;
				}
				:host([datatype="object"]) .value, :host([datatype="array"]) .value {
					color: #888;
				}
				:host([datatype="undefined"]) .value {
					color: #AAA;
				}

				:host([datatype="object"][datainstance="user"]) .value {
					border-radius: 8px;
					box-shadow: 0 2px 6px #0002;
					display: inline-flex;
					align-items: center;
				}
				:host([datatype="object"][datainstance="user"]) .value img {
					height: 1.5rem;
					margin: 6px;
				}
				:host([datatype="object"][datainstance="user"]) .value div {}
				:host([datatype="object"][datainstance="user"]) .value .displayName {
					margin: 0;
					margin-bottom: 2px;
					font-size: .8rem;
					color: #000C;
					line-height: 1;
				}
				:host([datatype="object"][datainstance="user"]) .value .displayId {
					margin: 0;
					font-size: .5rem;
					color: #0008;
					line-height: 1;
				}
				:host([datatype="object"][datainstance="user"]) .value[data-following] {
					border-left: solid 2px #2CF8;
				}
				:host([datatype="object"][datainstance="user"]) .value[data-unavailable] {
					border-left: solid 2px #F268;
				}

				.values {
					padding-left:16px;
					overflow-y: auto;
				}

				.button-remove {
					position: absolute;
					top: 0px;
					right: 0px;
					height: 20px;
					width: 20px;
					background-color: #F241;
					border: none;
					border-radius: 100px;
					transition: .2s;
				}
				.button-remove::before, .button-remove::after {
					content: "";
					display: block;
					width: 60%;
					height: 2px;
					position: absolute;
					top: 50%;
					left: 50%;
					background-color: #F24;
					box-shadow: 0 2px 6px #F244;
					border-radius: 10px;
				}
				.button-remove::before {
					transform: translate(-50%, -50%) rotate(45deg);
				}
				.button-remove::after {
					transform: translate(-50%, -50%) rotate(-45deg);
				}

				.button-remove:hover {
					background-color: #F24;
				}
				.button-remove:hover::before, .button-remove:hover::after {
					background-color: white;
				}

                .options {
                    right: 0;
                }

                .options .button-clipboardCopy {
					border: solid 1px #0001;
                    border-radius: 100px;
                    background-color: white;
                    color: #0008;
                    font-size: 10px;
                    padding: 1px 4px;
				}
			`;

            this.valuesExpandCache;
        }

        toggleExpand() {
            if (this.dataType === "object" || this.dataType === "array") {
                if (this.expanded) this.collapse();
                else this.expand()
            }
        }

        setRemoveButton(removedCallback = () => { }) {
            const $button_removeUser = document.createElement("button");
            this.$.self.appendChild($button_removeUser);
            $button_removeUser.classList.add("button-remove");
            $button_removeUser.addEventListener("click", e => {
                this.remove();
                removedCallback(this);
            });
        }

        expand() {
            const $ = this.$;
            if (!this.dataInstance) $.value.style.display = "none";
            $.valuesWrap.style.height = "auto";
            $.valuesWrap.style.visibility = "";

            if (!this.fulfillValues) {
                if (this.dataType === "object" || this.dataType === "array")
                    Object.entries(this.data).forEach(([k, v]) => {
                        const $elem = document.createElement("view-object"),
                            $values = [];
                        $elem.setData(k, v);
                        $.valuesWrap.appendChild($elem);
                        $values.push($elem);
                        $.values = $values;
                    });
                this.fulfillValues = true;
            }
            this.setAttribute("expanded", "");

            // for (let [i, $elem] of ($.values ?? []).entries()) {
            // 	if (this.valuesExpandCache[i]) $elem.expand();
            // }
        }

        collapse() {
            const $ = this.$;
            $.value.style.display = "";
            $.valuesWrap.style.height = "0";
            $.valuesWrap.style.visibility = "hidden";
            this.removeAttribute("expanded");

            // const expandCache = [];
            // for (let $elem of $.values ?? []) {
            // 	expandCache.push($elem.expanded);
            // 	$elem.collapse();
            // }
            // this.valuesExpandCache = expandCache;
        }

        setData(key, data) {
            this.data = data;
            this.key = key;
            this.setAttribute("datatype", Array.isArray(data) ? "array" : data === null ? "null" : typeof data);
            this.collapse();

            this.$.key.textContent = this.key;
            if (this.dataType === "undefined") this.$.value.innerHTML = "<p>undefined</p>";
            else if (this.data === null) this.$.value.innerHTML = "<p>null</p>";
            else if (this.dataType === "object") {
                if (this.data instanceof User) {
                    this.setAttribute("datainstance", "user");
                    const $img = document.createElement("img"),
                        $div = document.createElement("div"),
                        $displayName = document.createElement("p"),
                        $displayId = document.createElement("p");
                    $img.setAttribute("src", data.data.contents.profile.icon.url);
                    $displayName.classList.add("displayName");
                    $displayName.textContent = data.data.displayName;
                    if (data.data.protected) {
                        const $svgParent = document.createElement("div");
                        $svgParent.innerHTML = `<svg style="height: .8rem; width:.8rem; vertical-align: middle"viewBox="0 0 24 24" aria-label="非公開アカウント" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr"><g><path d="M19.75 7.31h-1.88c-.19-3.08-2.746-5.526-5.87-5.526S6.32 4.232 6.13 7.31H4.25C3.01 7.31 2 8.317 2 9.56v10.23c0 1.24 1.01 2.25 2.25 2.25h15.5c1.24 0 2.25-1.01 2.25-2.25V9.56c0-1.242-1.01-2.25-2.25-2.25zm-7 8.377v1.396c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.396c-.764-.3-1.307-1.04-1.307-1.91 0-1.137.92-2.058 2.057-2.058 1.136 0 2.057.92 2.057 2.056 0 .87-.543 1.61-1.307 1.91zM7.648 7.31C7.838 5.06 9.705 3.284 12 3.284s4.163 1.777 4.352 4.023H7.648z"></path></g></svg>`;
                        $displayName.appendChild($svgParent.children[0]);
                    }
                    $displayId.classList.add("displayId");
                    $displayId.textContent = `@${data.data.displayId}`;
                    $div.appendChild($displayName)
                    $div.appendChild($displayId)
                    this.$.value.appendChild($img);
                    this.$.value.appendChild($div);
                    if (data.data.metadata.relation.following) this.$.value.setAttribute("data-following", "");
                    if (data.data.protected) this.$.value.setAttribute("data-protected", "");
                    if (data.type === "UserUnavailable") this.$.value.setAttribute("data-unavailable", "");
                } else this.$.value.innerHTML = `<p>${this.data.toString()}</p>`;
            }
            else if (this.dataType === "array") this.$.value.innerHTML = `<p>Array(${this.data.length})</p>`;
            else if (this.dataType === "string" && /^https?:\/\/(.*)$/.test(this.data)) this.$.value.innerHTML = `<a href="${this.data}" target="_blank" rel="noopener noreferrer">${this.data.match(/^https?:\/\/(.*)$/)[1]}</a>`
            else if (this.dataType === "string") this.$.value.innerHTML = `<p>${this.data.replaceAll("\n", "<br>")}</p>`;
            else this.$.value.innerHTML = `<p>${this.data}</p>`;

            if (this.dataType === "object" || this.dataType === "array") {
                this.$.value.cursor = "pointer";
            }

            if (typeof this.data !== "object" || "toJSON" in this.data || "toJSONString" in this.data) {
                this.appendClipboardButton();
            }
        }

        appendClipboardButton() {
            const $clipboardCopyButton = this.$.options.appendChild(document.createElement("button"));
            $clipboardCopyButton.classList.add("button-clipboardCopy");
            $clipboardCopyButton.setAttribute("state", "isReady");
            $clipboardCopyButton.textContent = "値をコピー"

            $clipboardCopyButton.addEventListener("click", e => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                new Promise(async () => {
                    const copyText = (this.data != null && typeof this.data === "object") ? ("toJSONString" in this.data ? this.data?.toJSONString() : JSON.stringify(this.data)) : this.data;
                    if (navigator.clipboard) {
                        await navigator.clipboard.writeText(copyText);
                    } else {
                        const $copyText = document.appendChild(document.createElement("input"));
                        $copyText.value = copyText;
                        $copyText.select();
                        document.execCommand("copy");
                        $copyText.remove();
                    }
                    $clipboardCopyButton.setAttribute("state", "copied");
                    $clipboardCopyButton.textContent = "コピー済み";
                });
            });
        }

        updateStyle() {

        }

        static get observedAttributes() { return ['datatype', 'expanded', "datainstance"]; }

        attributeChangedCallback(name, prev, val) {
            switch (name) {
                case "datatype":
                    this.dataType = val;
                    if (val === "object" || val === "array") this.setAttribute("can-expanded", "");
                    break;
                case "expanded":
                    this.expanded = val === "";
                    break;
                case "datainstance":
                    this.dataInstance = val;
                    break;
            }
            this.updateStyle();
        }

    }
    window.customElements.define("view-object", View_Object);

    let appendedDsiplayId = null;


    const $wrap = document.createElement("div");
    $wrap.style = `
		background-color: white;
		border-radius: 2px;
		max-width: 80vw;
		padding: 4px 8px;
		box-shadow: 0 8px 24px #0002;
	`;
    $wrap.style.position = "absolute";
    $wrap.style.top = "0";
    $wrap.style.left = "0";
    document.body.appendChild($wrap);

    const observer_$wrap = new MutationObserver((mutationsList, o) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                if ($wrap.children.length === 0) {
                    $wrap.style.display = "none";
                } else {
                    $wrap.style.display = null;
                }
            }
        }
    });
    observer_$wrap.observe($wrap, {
        childList: true
    });

    function appendButton() {
        let userId = mainUserId,
            userDisplayId = mainUserDisplayId,
            currentPageName = location.href.match(/https:\/\/twitter\.com\/([0-9A-Za-z_]+)?\/?/)?.[1];

        if (userId == null && userDisplayId == null) {
            userDisplayId = currentPageName;
            if (/https:\/\/twitter\.com\/.*?\/+/.test(location.href) || userDisplayId == null || userDisplayId == "home" || userDisplayId == "explore" || userDisplayId == "notifications" || userDisplayId == "messages" || userDisplayId == "i") {
                appendedDsiplayId = null;
                return //console.log("ユーザーIDが未入力です。");
            }
        }

        if (appendedDsiplayId === currentPageName) return;

        if (document.querySelector("#Amgm_getUserAllData")) document.querySelector("#Amgm_getUserAllData").remove();

        const $wrap_buttons = document.createElement("div"),
            $button = document.createElement("button"),
            $button_withTweets = document.createElement("button");

        $wrap_buttons.setAttribute("id", "Amgm_getUserAllData");

        $button_withTweets.classList.add("button_getWithTweets");
        $button_withTweets.textContent = "ツイも取得";
        $button.classList.add("button_get");
        $wrap_buttons.setAttribute("data-state", "before");
        $button.textContent = "情報を取得";

        $button.style.width = "0";
        $button.style.opacity = "0";

        setTimeout(() => {
            $button.style.width = "";
            $button.style.opacity = "";
        });

        $button.addEventListener("click", async e => {
            const getOption = {
                withFollowings: true,
                withTweets: false
            };
            getAllProcess(getOption);
        });
        $button_withTweets.addEventListener("click", async e => {
            const getOption = {
                withFollowings: true,
                withTweets: true
            };
            getAllProcess(getOption);
        });

        async function getAllProcess(getOption) {
            $wrap_buttons.setAttribute("data-state", "data-preparing");
            $button.textContent = "取得中…";
            try {
                const user = await main(getOption, userId, userDisplayId);
                $wrap_buttons.setAttribute("data-state", "data-isReady");
                $button.textContent = "取得済み";
                const $user = document.createElement("view-object");
                $user.setData("User", user);
                $user.setRemoveButton(() => {
                    $wrap_buttons.setAttribute("data-state", "before");
                    $button.textContent = "情報を取得";
                });
                $wrap.appendChild($user);
            } catch (e) {
                console.error(e);
                $wrap_buttons.setAttribute("data-state", "error");
                $button.textContent = "取得エラー";
            }
        }
        $wrap_buttons.appendChild($button);
        $wrap_buttons.appendChild($button_withTweets);
        document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1wtj0ep").appendChild($wrap_buttons);
        $wrap_buttons.parentElement.style.zIndex = "1";
        appendedDsiplayId = currentPageName;
    }

    document.head.appendChild(document.createElement("style")).textContent = `
		#Amgm_getUserAllData {
			position: absolute;
			right: 60px;
			top: 110%;
			transform:translateX(50%);
            background-color: white;
            display: flex;
            flex-direction: column;
            border-radius: 20px;
		}
        #Amgm_getUserAllData:hover {
            box-shadow: 0 2px 6px #0002;
            border-radius: 20px 20px 8px 8px;
        }

		#Amgm_getUserAllData .button_get {
            position: relative;
            z-index: 1;
            top: 0;
			border-radius: 100px;
			border: none;
			width: 120px;
			height: 40px;
			font-size: 16px;
			background-color: white;
			box-shadow: 0 2px 6px #0002;
			color: #28F;
			pointer-events: bounding-box;
			cursor: pointer;
			overflow-x: hidden;
			white-space: nowrap;

			transition: .25s;
		}

        #Amgm_getUserAllData .button_getWithTweets {
            position: relative;
            z-index: 0;
            left: 0;
            width: 120px;
			border-radius: 20px;
            border: none;
            height: 40px;
            background-color: white;
            color: transparent;
			transition: .1s;
            margin-top: -40%;
		}

        #Amgm_getUserAllData:hover .button_getWithTweets {
            border-radius: 20px;
			width: 120px;
			font-size: 16px;
			color: #0008;
			pointer-events: bounding-box;
			cursor: pointer;
			overflow-x: hidden;
			white-space: nowrap;
			transition: .25s;
            margin: 4px 0;
        }

        #Amgm_getUserAllData .button_getWithTweets:hover {
            background-color: #00abfd20;
            color: #38f;
        }

		#Amgm_getUserAllData[data-state="before"] .button_get {
			box-shadow: 0 2px 6px #0002;
		}
		#Amgm_getUserAllData[data-state="before"] .button_get:hover {
			background-color: #00abfd20;
			box-shadow: 0 8px 16px #38f4;
		}

		#Amgm_getUserAllData[data-state="data-preparing"] .button_get {
			pointer-events: none;
			box-shadow: none;
			background-color: #0001;
			border-radius: 2px;
			color: #0006;
			font-size: 14px;
		}

		#Amgm_getUserAllData[data-state="data-isReady"] .button_get {
			box-shadow: 0 2px 6px #38f8;
			background-color: #00abfd;
			color: white;
		}
		#Amgm_getUserAllData[data-state="data-isReady"] .button_get:hover {
			background-color: #00abfd80;
			box-shadow: 0 8px 16px #38f4;
		}

        #Amgm_getUserAllData[data-state="error"] .button_get {
			box-shadow: 0 2px 6px #F268;
			background-color: #F26;
			color: white;
		}
		#Amgm_getUserAllData[data-state="error"] .button_get:hover {
			background-color: #F268;
			box-shadow: 0 8px 16px #F264;
		}

	`;

    clearInterval(Amgm_getUserAllData.itv);
    Amgm_getUserAllData.itv = setInterval(appendButton, 1000);
})();

console.log("[Amgm_Script{Twitter}] start: Twitter_tweetMillisecondTime v.0.1.1");
(function () {
    setInterval(setMilliseconds, 1000);
    document.head.appendChild(document.createElement("style")).textContent = `
    .Amgm_setMilliseconds_time {
        position: absolute;
        top: 0;
        right: 5px;
        font-size: 11px;
        transition: .1s;
        opacity: .5;
    }
    article:hover .Amgm_setMilliseconds_time {
        opacity: 1;
    }`;

    const errorArticles = new Set();
    function setMilliseconds() {
        for (let $article of document.querySelectorAll("article")) {
            if ($article.querySelector(".Amgm_setMilliseconds_time") || errorArticles.has($article)) continue;
            if ($article.innerHTML.includes("M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.393-.875-.876V9.967l-7.547 7.546c-.17.17-.395.256-.62.256s-.447-.086-.618-.257c-.342-.342-.342-.896 0-1.237l7.547-7.547h-3.54c-.482 0-.874-.393-.874-.876s.392-.875.875-.875h5.65c.483 0 .875.39.875.874v5.65z")) {
                // const $wrap = $article.closest("section > div > div > div");//プロモーション削除(失敗)
                // $wrap.children[0].remove();
                // $wrap.remove();
                continue;
            }
            const tweetId = $article.querySelector("time")?.closest("a")?.getAttribute("href")?.match(/status\/([0-9]+)/)?.[1]
                ?? [...($article.querySelectorAll("a[href]") || [])].find($a => $a.getAttribute("href")?.match(/status\/([0-9]+)/))?.getAttribute("href")?.match(/status\/([0-9]+)/)[1];
            if (!tweetId) {
                errorArticles.add($article);///console.error($article);
                continue;
            }
            const $time = $article.appendChild(document.createElement("time"));
            $time.textContent = tweetId2time(tweetId);
            $time.classList.add("Amgm_setMilliseconds_time");
            $time.style.color = window.getComputedStyle($article.querySelector(":scope > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div:nth-child(1) > a > div > div:nth-child(1) span")).color;
            $article.appendChild($time);
        }
    }

    function tweetId2time(tweetId) {
        const time = new Date(parseInt(BigInt(tweetId) / 2n ** 22n + 1288834974657n));
        return time.toLocaleString() + "." + ("000" + time.getMilliseconds()).substr(-3);
    }
})();

console.log("[Amgm_Script{Twitter}] slide_sideNavigation v.0.1.2");
(function () {
    const $style = document.head.appendChild(document.createElement("style"));
    $style.textContent = `
    @media screen and (max-width: 500px) {
        header[role="banner"] {
            position: absolute;
            transition: .5s;
        }

        header[role="banner"] > div > div {
            background-color: #CCC2;
            transform: translateX(calc(-100% + 16px));
            transition: .5s;
        }

        header[role="banner"]:hover > div > div {
            transform: translateX(0%);
            background-color: ${window.getComputedStyle(document.body).backgroundColor};
            box-shadow: 4px 4px 8px #0004;
        }

        header[role="banner"]:active > div > div {
            backgroud-color: ${window.getComputedStyle(document.body).backgroundColor};
            transform: translateX(0);
        }

        /*サイドバーのアイコンを若干右に寄せる*/
        header[role="banner"]:not(:hover) > div > div > div > div > div > nav > a > * {
            padding-right: 11px;
        }

        header[role="banner"] > div > div > div > div > div > nav > a > div > div > * {
            transition: .5s;
        }

        header[role="banner"]:not(:hover) > div > div > div > div > div > nav > a > div > div > svg {
            margin-left: 30px;
            opacity: .25;
        }

        /*通知を大きくする*/
        header[role="banner"]:not(:hover) > div > div > div > div > div > nav > a:not([href="/home"]) > div > div > div {
            min-width: 0;
            top: -4px;
            height: 32px;
            border-radius: 0 8px 8px 0;
            padding: 0;
            right: 0;
            width:8px;
        }

        header[role="banner"] > div > div > div > div > div > nav > a > div > div > div > span {
            transition: .5s;
        }
        /*サイドバーのツイートするボタンを隠す*/
        header[role="banner"] > div > div > div > div:nth-child(1) > div:nth-child(3) {
            transform: translateX(-16px);
            transition: .5s;
        }
        header[role="banner"]:hover > div > div > div > div:nth-child(1) > div:nth-child(3) {
            transform: translateX(0px);
        }

        /*ツイートの横幅を広くする*/
        article > div > div > div > div:nth-child(2) > div:nth-child(1),
        article > div > div > div > div:nth-child(1) > div > div {
            flex-basis: 28px;
        }
        article > div > div > div > div:nth-child(2) > div:nth-child(1) [style*="height"],
        article > div > div > div > div:nth-child(2) > div:nth-child(1) [style*="width"] {
            width: 32px !important;
            height: 32px !important;
        }
    }
        /*最新・ホームタブリストを非表示*/
        div[data-testid="primaryColumn"] > div > div > div > nav[role="navigation"] > div > div[data-testid="ScrollSnap-SwipeableList"] > div[role="tablist"] > div[role="presentation"]:nth-child(1) > a[href="/home"]{
            display:none;
        }
        div[data-testid="primaryColumn"] > div > div > div > nav[role="navigation"] > div > div[data-testid="ScrollSnap-SwipeableList"] > div[role="tablist"] > div[role="presentation"]:nth-child(2) > a[href="/home"]{
            width:120px;
            height:60px;
            background:#fdd;
        }
        div[data-testid="primaryColumn"] > div > div > div > nav[role="navigation"] > div > div[data-testid="ScrollSnap-SwipeableList"] > div[role="tablist"] > div[role="presentation"]:nth-child(2) > a[href="/home"]:hover{
            background:#fbb;
        }
        div[data-testid="primaryColumn"] > div > div > div > nav[role="navigation"] > div > div[data-testid="ScrollSnap-SwipeableList"] > div[role="tablist"] > div[role="presentation"]:nth-child(2) > a[href="/home"][aria-selected="true"]{
            display:none;
        }
        /*トピックリストを非表示*/
        div[data-testid="primaryColumn"] > div > div > div > nav[role="navigation"] > div > div[data-testid="ScrollSnap-SwipeableList"] > div[role="tablist"] > div[class="css-1dbjc4n r-4amgru r-13x4u8y r-6b64d0 r-cpa5s6"]{
            display:none;
        }
    @media screen and (max-height: 200px) {
        /*トップのツイートボックスを隠す*/
        [data-page="home"] main > div > div > div > div > div > div:nth-child(2) {
            position: absolute;
            width: 100%;
            top: 48px;
            transform: translateY(calc(-100% + 8px));
            border-bottom: solid 1px #0002;
            transition: .2s;
        }

        [data-page="home"] main > div > div > div > div > div > div:nth-child(2):hover,
        [data-page="home"] main > div > div > div > div > div > div:nth-child(2):focus-within {
            transform: none;
        }
    }`;

})();