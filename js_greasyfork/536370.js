// ==UserScript==
// @name         Bangumi Forum Enhance Alpha(Revision)
// @version      1.6.20
// @description  I know your (black) history!
// @copyright gyakkun
// @include     /^https?:\/\/(((fast\.)?bgm\.tv)|chii\.in|bangumi\.tv)\/(group|subject)\/topic\/*/
// @include     /^https?:\/\/(((fast\.)?bgm\.tv)|chii\.in|bangumi\.tv)\/(ep|person|character|blog)\/*/
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/536370/Bangumi%20Forum%20Enhance%20Alpha%28Revision%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536370/Bangumi%20Forum%20Enhance%20Alpha%28Revision%29.meta.js
// ==/UserScript==

(function () {
    const INDEXED_DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    const SPACE_TYPE = document.location.pathname.split("/")[1]
    const BA_FEH_API_URL = "https://bgm.nyamori.moe/forum-enhance/query"
    const BA_FEH_CACHE_PREFIX = "ba_feh_" + SPACE_TYPE + "_" // + username
    const DOLLARS_API_URL = "https://bgmchat.ry.mk/api/users/"
    const FACE_KEY_GIF_MAPPING = {
        "0": "44",
        "140": "101",
        "80": "41",
        "54": "15",
        "85": "46",
        "104": "65",
        "88": "49",
        "62": "23",
        "79": "40",
        "53": "14",
        "122": "83",
        "92": "53",
        "118": "79",
        "141": "102",
        "90": "51",
        "76": "37",
        "60": "21",
        "128": "89",
        "47": "08",
        "68": "29",
        "137": "98",
        "132": "93"
    }
    const SPACE_ACTION_BUTTON_WORDING = {
        "group": "小组",
        "subject": "条目",
        "ep": "章节",
        "character": "角色",
        "person": "人物",
        "blog": "日志",
        "dollars": "Dollars"
    };
    const SPACE_TOPIC_URL = {
        "group": "group/topic",
        "subject": "subject/topic",
        "ep": "ep",
        "character": "character",
        "person": "person",
        "blog": "blog"
    };
    const SHOULD_DRAW_TOPIC_STAT = SPACE_TYPE === 'blog' || SPACE_TOPIC_URL[SPACE_TYPE].endsWith("topic")
    const SHOULD_DRAW_LIKES_STAT = SPACE_TYPE !== 'blog' && SPACE_TYPE.length % 3 != 0

    attachActionButton()
    registerOnClickEvent()
    addStyleForTopPost()
    purgeCache()

    // 混沌指数等级描述
    function getEvilLevelDescription(percentage) {
        if (percentage <= 5) return "LV1 纯良班友";
        if (percentage <= 10) return "LV2 友善班友";
        if (percentage <= 20) return "LV3 普通班友";
        if (percentage <= 30) return "LV4 轻度混沌";
        if (percentage <= 40) return "LV5 中度混沌";
        if (percentage <= 60) return "LV6 重度混沌";
        if (percentage <= 80) return "LV7 邪恶势力";
        if (percentage <= 120) return "LV8 极度邪恶";
        if (percentage <= 200) return "LV9 罪大恶极";
        return "LV MAX 纯纯的逆天";
    }

    // 社区等级描述
    function getActivityLevelDescription(level) {
        if (level <= 1) return "潜水";
        if (level <= 3) return "萍水相逢";
        if (level <= 5) return "偶有见闻";
        if (level <= 10) return "相结同好";
        if (level <= 15) return "小有名气";
        if (level <= 20) return "知名人士";
        if (level <= 30) return "班固米明星";
        if (level <= 45) return "班固米大明星";
        if (level <= 60) return "班固米社区传说";
        return "MAX 班固米守护者";
    }

    // 活跃等级描述
    function getActiveLevelDescription(activeScore) {
        if (activeScore <= 30) return "D级";
        if (activeScore <= 100) return "C级";
        if (activeScore <= 200) return "B级";
        if (activeScore <= 500) return "A级";
        if (activeScore <= 1000) return "S级";
        if (activeScore <= 2000) return "SS级";
        if (activeScore <= 3000) return "SSS级";
        if (activeScore <= 5000) return "SSSS级";
        return "SSSSS级";
    }

    // 指导原则描述
    function getGuidelineDescription(rate) {
        if (rate <= 0.50) return "遵纪守法";
        if (rate <= 1.00) return "束身自好";
        if (rate <= 2.00) return "我行我素";
        if (rate <= 3.00) return "雷区蹦迪";
        if (rate <= 5.00) return "恣意妄为";
        if (rate <= 10.00) return "无法无天";
        return "永久封禁预定";
    }

    // Dollars等级描述
    function getDollarsLevelDescription(level) {
        if (level <= 1) return "萌芽";
        if (level <= 3) return "水花";
        if (level <= 5) return "海浪";
        if (level <= 10) return "旋风";
        if (level <= 15) return "磐岩";
        if (level <= 20) return "极光";
        if (level <= 30) return "星漩";
        if (level <= 45) return "宇宙";
        if (level <= 60) return "冰冷的房间";
        return "大自然的怀抱";
    }

    // 计算Dollars等级
    function calculateDollarsLevel(messageCount) {
        if (messageCount < 100) return 0;
        if (messageCount <= 1000) return Math.floor(messageCount / 100);
        return 10 + Math.floor((messageCount - 1000) / 1000);
    }

    // 计算混沌指数
    function calculateEvilIndex(likeStat) {
        // 将likeStat对象转换为数组形式
        const likesData = Object.entries(likeStat || {}).map(([key, value]) => ({
            value: parseInt(key),
            num: value
        }));

        let evilLike141 = likesData.find(item => item.value === 141);//102问号
        let evilLike118 = likesData.find(item => item.value === 118);//79流汗疑问
        let evilLike80 = likesData.find(item => item.value === 80);//41爱心眼笑
        let evilLike0 = likesData.find(item => item.value === 0);//44还不错
        let evilLike79 = likesData.find(item => item.value === 79);//40爱心眼亲亲
        let evilLike122 = likesData.find(item => item.value === 122);//83星星眼
        let evilLike140 = likesData.find(item => item.value === 140);//101星星眼

        let evilCount141 = evilLike141 ? evilLike141.num : 0;
        let evilCount118 = evilLike118 ? evilLike118.num : 0;
        let evilCount80 = evilLike80 ? evilLike80.num : 0;
        let evilCount0 = evilLike0 ? evilLike0.num : 0;
        let evilCount79 = evilLike79 ? evilLike79.num : 0;
        let evilCount122 = evilLike122 ? evilLike122.num : 0;
        let evilCount140 = evilLike140 ? evilLike140.num : 0;

        // 计算公式：141和118的总和减去其他标号的加权值
        let totalEvilCount = (evilCount141 + evilCount118) - (evilCount80 * 0.03) - (evilCount0 * 0.02) - (evilCount79 * 0.03) - (evilCount122 * 0.01) - (evilCount140 * 0.01);

        // 确保最小值不低于0
        totalEvilCount = Math.max(0, Math.floor(totalEvilCount));

        // 计算所有非141和非118贴贴的总和
        let otherLikesSum = likesData.reduce((sum, item) => {
            return (item.value !== 141 && item.value !== 118) ? sum + item.num : sum;
        }, 0);

        // 如果除了141和118没有其他贴贴，则按1计算
        if (otherLikesSum === 0) {
            otherLikesSum = 1;
        }

        // 计算百分比（可以超过100%）
        let evilPercentage = Math.round(
            (
                totalEvilCount > otherLikesSum
                ? (1.5 * totalEvilCount) / (otherLikesSum + 0.5 * totalEvilCount)
                : totalEvilCount / otherLikesSum
            ) * (
                (totalEvilCount < 100 && totalEvilCount > 0)
                ? (otherLikesSum < 200 ? totalEvilCount * 2 : 100 + totalEvilCount)
                : 200
            )
        );

        return {
            percentage: evilPercentage,
            description: getEvilLevelDescription(evilPercentage)
        };
    }

    // 计算社区等级
    function calculateCommunityLevel(stats) {
        const postTotal = stats.postStat?.total || 0;
        const topicTotal = stats.topicStat?.total || 0;

        // 计算likeStat中所有值的总和
        const likeTotal = Object.values(stats.likeStat || {}).reduce((sum, val) => sum + val, 0);

        // 计算等级
        const level = (postTotal * 1 + topicTotal * 3 + likeTotal * 3) / 1000;

        return {
            level: Math.floor(level),
            description: getActivityLevelDescription(level)
        };
    }

    // 计算活跃等级
    function calculateActiveLevel(stats) {
        const r7d = stats.postStat?.r7d || 0;
        const r30d = stats.postStat?.r30d || 0;
        const activeScore = r7d * 4 + r30d;
        return {
            score: activeScore,
            description: getActiveLevelDescription(activeScore)
        };
    }

    // 计算指导原则（违规率）
    function calculateGuideline(stats) {
        const adminDeleted = stats.postStat?.adminDeleted || 0;
        const collapsed = stats.postStat?.collapsed || 0;

        const violationScore = adminDeleted * 3 + collapsed;
        const postTotal = stats.postStat?.total || 1; // 避免除以0

        const violationRate = violationScore < 20 ? (violationScore / postTotal) * (5 * violationScore) : (violationScore / postTotal) * 100;

        return {
            rate: violationRate.toFixed(2),
            score: violationScore,
            description: getGuidelineDescription(violationRate)
        };
    }

    function getPostDivList() {
        return $("div[id^='post_'")
    }

    function getUsernameAndPidOfPostDiv(postDiv) {
        return {
            username: postDiv.attr("data-item-user"),
            postId: parseInt(postDiv.attr("id").substring("post_".length))
        }
    }

    function getAllUsernameSet() {
        var set = {}
        getPostDivList().each(function () { set[$(this).attr("data-item-user")] = null })
        if (SPACE_TYPE === 'blog') set[getBlogAuthorUsername()] = null
        return set
    }

    function drawWrapper(username, postId, userStatObj, currentSpaceType, dollarsData = null) {
        if (currentSpaceType === 'dollars') {
            // Dollars统计专用显示
            const messageCount = dollarsData?.stats?.message_count || 0;
            const avgMessages = dollarsData?.stats?.average_messages_per_day || 0;
            const dollarsLevel = calculateDollarsLevel(messageCount);

            return `
                <div id="ba-feh-wrapper-${postId}-${username}" class="subject_tag_section" style="margin: 1em; width: 90%;">
                    <div>
                        ${drawSwitchButtons(username, postId, currentSpaceType)}
                        <div id="ba-feh-user-levels-${postId}-${username}">
                            <span class="tip" style="font-size: 1.2em;">Dollars等级:</span>
                            <small class="grey" style="font-size: 1.2em;">${dollarsLevel}级 (${messageCount}) - ${getDollarsLevelDescription(dollarsLevel)}</small>
                            <br/>
                            <span class="tip" style="font-size: 1.2em;">Dollars活跃:</span>
                            <small class="grey" style="font-size: 1.2em;">${Math.floor(avgMessages)}</small>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 常规统计显示
            const communityLevel = calculateCommunityLevel(userStatObj || {});
            const evilIndex = calculateEvilIndex(userStatObj?.likeStat || {});
            const activeLevel = calculateActiveLevel(userStatObj || {});
            const guideline = calculateGuideline(userStatObj || {});

            const postTotal = userStatObj?.postStat?.total || 0;
            const topicTotal = userStatObj?.topicStat?.total || 0;
            const likeTotal = Object.values(userStatObj?.likeStat || {}).reduce((sum, val) => sum + val, 0);

            return `
                <div id="ba-feh-wrapper-${postId}-${username}" class="subject_tag_section" style="margin: 1em; width: 90%;">
                    <div>
                        ${drawSwitchButtons(username, postId, currentSpaceType)}
                        <div id="ba-feh-user-levels-${postId}-${username}">
                            <span class="tip" style="font-size: 1.2em;">混沌指数:</span>
                            <small class="grey" style="font-size: 1.2em;">${evilIndex.percentage}% (${(userStatObj?.likeStat?.[141] || 0) + (userStatObj?.likeStat?.[118] || 0)}/${likeTotal}) - ${evilIndex.description}</small>
                            <br/>
                            <span class="tip" style="font-size: 1.2em;">社区等级:</span>
                            <small class="grey" style="font-size: 1.2em;">${communityLevel.level}级 (${postTotal}+${topicTotal}×3+${likeTotal}×3=${postTotal + (topicTotal * 3) + (likeTotal * 3)}) - ${communityLevel.description}</small>
                            <br/>
                            <span class="tip" style="font-size: 1.2em;">活跃分数:</span>
                            <small class="grey" style="font-size: 1.2em;">${activeLevel.score} (${userStatObj?.postStat?.r7d || 0}×4+${userStatObj?.postStat?.r30d || 0}=${activeLevel.score}) - ${activeLevel.description}</small>
                            <br/>
                            <span class="tip" style="font-size: 1.2em;">指导原则:</span>
                            <small class="grey" style="font-size: 1.2em;">${guideline.rate}% (${guideline.score}/${postTotal}) - ${guideline.description}</small>
                            ${dollarsData ? `
                            <br/>
                            <span class="tip" style="font-size: 1.2em;">Dollars等级:</span>
                            <small class="grey" style="font-size: 1.2em;">${calculateDollarsLevel(dollarsData.stats.message_count)}级 (${dollarsData.stats.message_count}) - ${getDollarsLevelDescription(calculateDollarsLevel(dollarsData.stats.message_count))}</small>
                            <br/>
                            <span class="tip" style="font-size: 1.2em;">Dollars活跃:</span>
                            <small class="grey" style="font-size: 1.2em;">${Math.floor(dollarsData.stats.average_messages_per_day)}</small>
                            ` : ""}
                        </div>
                        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ddd;">
                        <div id="ba-feh-post-stat-${postId}-${username}">
                            <span class="tip">帖子统计:</span>
                            ${drawPostStatData(userStatObj?.postStat || {})}
                        </div>
                        ${currentSpaceType !== 'blog' && currentSpaceType.length % 3 != 0 ? `
                            <div id="ba-feh-topic-stat-${postId}-${username}">
                                <span class="tip">主题统计:</span>
                                ${drawTopicStatData(userStatObj?.topicStat || {})}
                            </div>
                        ` : ""}
                        ${currentSpaceType !== 'blog' && currentSpaceType.length % 3 != 0 ? `
                            <div id="ba-feh-like-stat-${postId}-${username}">
                                <span class="tip">收到贴贴:</span>
                                ${drawFaceGrid(userStatObj?.likeStat || {})}
                            </div>
                            <div id="ba-feh-like-rev-stat-${postId}-${username}">
                                <span class="tip">送出贴贴:</span>
                                ${drawFaceGrid(userStatObj?.likeRevStat || {})}
                            </div>
                        ` : ""}
                        <div id="ba-feh-space-stat-${postId}-${username}">
                            <span class="tip">空间统计:</span>
                            ${drawSpaceStatSection(userStatObj?.spaceStat || [], currentSpaceType)}
                        </div>
                        <div id="ba-feh-recent-activities-${postId}-${username}">
                            ${currentSpaceType !== 'blog' && SPACE_TOPIC_URL[currentSpaceType] && SPACE_TOPIC_URL[currentSpaceType].endsWith("topic") ? `
                                <span class="tip">最近发表:</span>
                                ${drawRecentTopicSection(userStatObj?.recentActivities?.topic || [], currentSpaceType)}
                                <br/>
                            ` : ""}
                            <span class="tip">最近回复:</span>
                            ${drawRecentPostSection(userStatObj?.recentActivities?.post || [], currentSpaceType)}
                            ${currentSpaceType !== 'blog' && currentSpaceType.length % 3 != 0 ? `
                                <br/>
                                <span class="tip">最近送出贴贴:</span>
                                ${drawRecentLikeRevSection(userStatObj?.recentActivities?.likeRev || [], currentSpaceType)}
                            ` : ""}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function drawSwitchButtons(username, postId, currentSpaceType) {
        const types = ["group", "subject", "ep", "character", "person", "blog", "dollars"];
        let buttons = "";

        types.forEach(type => {
            if (type === currentSpaceType) {
                buttons += `<span style="background: transparent; border: none; padding: 2px 4px; font-weight: bold;">${SPACE_ACTION_BUTTON_WORDING[type]}</span>`;
            } else {
                buttons += `<a href="javascript:void(0);" class="ba-feh-switch-btn" data-username="${username}" data-postid="${postId}" data-type="${type}" style="background: transparent; border: none; padding: 2px 4px; font-weight: normal; text-decoration: none;">${SPACE_ACTION_BUTTON_WORDING[type]}</a>`;
            }
            if (type !== "dollars") {
                buttons += " | ";
            }
        });

        return `<div style="text-align: center; margin-bottom: 10px; background: transparent; border: none;">${buttons}</div>`;
    }

    function drawActionButton(username, postId) {
        return `
        <div class="action">
            <a href="javascript:void(0);" class="icon" title="${SPACE_ACTION_BUTTON_WORDING[SPACE_TYPE]}">
                <span data-dropped="false" class="ico" id="ba-feh-action-btn-${postId}-${username}" style="text-indent: 0px">▼</span><span class="title">${SPACE_ACTION_BUTTON_WORDING[SPACE_TYPE]}</span>
            </a>
        </div>
        `
    }

    function drawRecentPostSection(recentPostObjList, spaceType) {
        if (recentPostObjList.length == 0) {
            return `<span>N/A</span>`
        }
        let inner = ""
        for (let p of recentPostObjList) {
            inner += drawRecentPost(p, spaceType)
        }
        return `
            <div class="subject_tag_section">
                ${inner}
            </div>
        `
    }

    function drawRecentTopicSection(recentTopicObjList, spaceType) {
        if (recentTopicObjList.length == 0) {
            return `<span>N/A</span>`
        }
        let inner = ""
        for (let t of recentTopicObjList) {
            inner += drawRecentTopic(t, spaceType)
        }
        return `
            <div class="subject_tag_section">
                ${inner}
            </div>
        `
    }

    function drawSpaceStatSection(spaceStatObjList, spaceType) {
        if (spaceStatObjList.length == 0) {
            return `<span>N/A</span>`
        }
        let inner = ""
        for (let s of spaceStatObjList) {
            inner += drawSpaceStatData(s, spaceType)
        }
        return `
            <div class="subject_tag_section">
                ${inner}
            </div>
        `
    }

    function drawRecentLikeRevSection(recentLikeRevObjList, spaceType) {
        if (recentLikeRevObjList.length == 0) {
            return `<span>N/A</span>`
        }
        let inner = ""
        for (let t of recentLikeRevObjList) {
            inner += drawRecentLikeRev(t, spaceType)
        }
        return `
            <div class="subject_tag_section">
                ${inner}
            </div>
        `
    }

    function drawRecentPost(postBriefObj, spaceType) {
        const topicUrl = SPACE_TOPIC_URL[spaceType] || SPACE_TOPIC_URL[SPACE_TYPE];
        return `<a class="l inner" target="_blank"
                 rel="nofollow external noopener noreferrer"
                 href="/${topicUrl}/${postBriefObj.mid}#post_${postBriefObj.pid}"
                 title="${postBriefObj.spaceDisplayName || ""}"
        >
        ${postBriefObj.title} <small class="grey">${formatDateline(postBriefObj.dateline)}</small></a>`
    }

    function drawRecentTopic(topicBriefObj, spaceType) {
        const topicUrl = SPACE_TOPIC_URL[spaceType] || SPACE_TOPIC_URL[SPACE_TYPE];
        return `<a class="l inner" target="_blank"
                 rel="nofollow external noopener noreferrer"
                 href="/${topicUrl}/${topicBriefObj.id}"
                 title="${topicBriefObj.spaceDisplayName || ""}"
        >
        ${topicBriefObj.title} <small class="grey">${formatDateline(topicBriefObj.dateline)}</small></a>`
    }

    function drawRecentLikeRev(likeRevBrief, spaceType) {
        const topicUrl = SPACE_TOPIC_URL[spaceType] || SPACE_TOPIC_URL[SPACE_TYPE];
        let likeRevObjListHtml = ""
        for (let l of likeRevBrief.likeRevList) {
            likeRevObjListHtml += `
                <a target="_blank" rel="nofollow external noopener noreferrer"
                   href="/${topicUrl}/${likeRevBrief.mid}#post_${l.pid}">
                    <img style="width: 18px;height: 18px;" src="/img/smiles/tv/${FACE_KEY_GIF_MAPPING[l.faceKey]}.gif"></img>
                </a>
            `
        }
        return `<p><a class="l inner" target="_blank" rel="nofollow external noopener noreferrer"
                        href="/${topicUrl}/${likeRevBrief.mid}"
                        title="${likeRevBrief.spaceDisplayName || ""}"
                        >
                        ${likeRevBrief.title}
                        <small class="grey">
                        ${formatDateline(likeRevBrief.dateline)}
                        </small>
                </a><small class="grey">:</small>${likeRevObjListHtml}</p>`
    }

    function drawSpaceStatData(spaceStatObj, spaceType) {
        let { name, displayName, topic, post, like, likeRev } = spaceStatObj
        let isNameTooLong = displayName.length > 10
        displayName = displayName.substring(0, Math.min(10, displayName.length))
        if (isNameTooLong) displayName += "..."
        let topicDrawing = drawTopicStatData(topic || {})
        let postDrawing = drawPostStatData(post || {})
        let likeRevDrawing = drawLikeStatData(likeRev || {})
        let likeDrawing = drawLikeStatData(like || {})
        let spacePath = ""
        switch (spaceType) {
            case "blog": spacePath = "user"; break
            case "ep": spacePath = "subject"; break
            default: spacePath = spaceType
        }
        return `
            <div>
                <a href="/${spacePath}/${name}" class="l" target="_blank" rel="nofollow external noopener noreferrer">${displayName}</a>
                <span class="tip">帖子:</span>
                    ${postDrawing}
                ${spaceType !== 'blog' && SPACE_TOPIC_URL[spaceType] && SPACE_TOPIC_URL[spaceType].endsWith("topic") ? `
                    <span class="tip">主题:</span>
                    ${topicDrawing}
                ` : ""}
                ${spaceType !== 'blog' && spaceType.length % 3 != 0 ? `
                    <span class="tip">送出贴贴:</span>
                    ${likeRevDrawing}
                    <span class="tip">收到贴贴:</span>
                    ${likeDrawing}
                ` : ""}
            </div>
        `
    }

    function drawPostStatData(postStatObj) {
        return `
            <small class="grey">
                ${postStatObj.total || 0}(T)
                ${postStatObj.r7d > 0 ? `/<span>${postStatObj.r7d}(7d)</span>` : ""}
                ${postStatObj.r30d > 0 ? `/<span>${postStatObj.r30d}(30d)</span>` : ""}
                ${postStatObj.deleted > 0 ? `/<span style="color: red;">${postStatObj.deleted}(D)</span>` : ""}
                ${postStatObj.adminDeleted > 0 ? `/<span style="color: yellowgreen;">${postStatObj.adminDeleted}(AD)</span>` : ""}
                ${postStatObj.violative > 0 ? `/<span style="color: rgb(50, 255, 245);">${postStatObj.violative}(V)</span>` : ""}
                ${postStatObj.collapsed > 0 ? `/<span style="color: rgb(89, 116, 252);">${postStatObj.collapsed}(F)</span>` : ""}
            </small>
        `
    }

    function drawTopicStatData(topicStatObj) {
        return `
            <small class="grey">
                ${topicStatObj.total || 0}(T)
                ${topicStatObj.r7d > 0 ? `/<span>${topicStatObj.r7d}(7d)</span>` : ""}
                ${topicStatObj.r30d > 0 ? `/<span>${topicStatObj.r30d}(30d)</span>` : ""}
                ${topicStatObj.deleted > 0 ? `/<span style="color: red;">${topicStatObj.deleted}(D)</span>` : ""}
                ${topicStatObj.silent > 0 ? `/<span style="color: rgb(255, 145, 0);;">${topicStatObj.silent}(S)</span>` : ""}
                ${topicStatObj.closed > 0 ? `/<span style="color: rgb(164, 75, 253);">${topicStatObj.closed}(C)</span>` : ""}
                ${topicStatObj.reopen > 0 ? `/<span style="color: rgb(53, 188, 134);">${topicStatObj.reopen}(R)</span>` : ""}
            </small>
        `
    }

    function drawLikeStatData(likeStatForSpaceObj) {
        return `
            <small class="grey">
                ${likeStatForSpaceObj.total || 0}(T)
            </small>
        `
    }

    function drawFaceGrid(faceMap) {
        let extracted = extractSortedListOfFace(faceMap)
        if (extracted.length == 0) {
            return `<span>N/A</span>`
        }
        let inner = ""
        for (let p of extracted) {
            let faceKey = p[0]
            let faceCount = p[1]
            let facePicValue = FACE_KEY_GIF_MAPPING[faceKey]
            inner += `
                <a class="item" data-like-value="${faceKey}">
                    <span class="emoji" style="background-image: url('/img/smiles/tv/${facePicValue}.gif');"></span>
                    <span class="num">${faceCount}</span>
                </a>
            `
        }
        return `
            <div class="likes_grid" style="float: none;">
                ${inner}
            </div>
            `
    }

    function extractSortedListOfFace(faceMap) {
        let res = [] // 2d arr
        for (let key in faceMap) {
            res.push([key, faceMap[key]])
        }
        res = res.sort((a, b) => b[1] - a[1])
        return res
    }

    function attachActionButton() {
        console.debug(`[BA_FEH] attaching action button`)
        getPostDivList().each(function () {
            let { username, postId } = getUsernameAndPidOfPostDiv($(this))
            $(this).find("div.post_actions.re_info > div:nth-child(1)").first().after(
                drawActionButton(username, postId)
            )
        })
        if (SPACE_TYPE === 'blog') {
            let username = getBlogAuthorUsername()
            let postId = "n" + window.location.pathname.split("/")[2]
            let reInfoSmallSelector = "#columnA > div.re_info > small"
            let topReInfoSelector = "#columnA > div.re_info"
            $(topReInfoSelector).addClass("post_actions")
            $(reInfoSmallSelector).after(drawActionButton(username, postId))
        }
    }

    function getBlogAuthorUsername() {
        let authorAvatarSelecter = "#pageHeader > h1 > span > a.avatar.l"
        let username = $(authorAvatarSelecter).attr("href").split("/")[2]
        return username
    }

    function registerOnClickEvent() {
        $(document).on("click", "span[id^='ba-feh-action-btn-'", function() {
            let that = $(this)
            let pid = that.attr("id").split("-")[4]
            let username = that.attr("id").split("-")[5]
            handleClickEvent(that, pid, username, SPACE_TYPE);
        });

        // 注册切换按钮事件
        $(document).on("click", ".ba-feh-switch-btn", async function() {
            let btn = $(this);
            let username = btn.data("username");
            let postId = btn.data("postid");
            let targetType = btn.data("type");

            // 显示加载状态
            let wrapper = $(`#ba-feh-wrapper-${postId}-${username}`);
            wrapper.find(`#ba-feh-user-levels-${postId}-${username}`).html('<span>加载中...</span>');

            try {
                let userStatObj, dollarsData;

                if (targetType === 'dollars') {
                    // 获取Dollars数据
                    dollarsData = await getDollarsData(username);
                    userStatObj = { postStat: {}, topicStat: {}, likeStat: {}, spaceStat: [], recentActivities: { post: [], topic: [], likeRev: [] } };
                } else {
                    // 获取常规统计数据
                    userStatObj = await getUserStatObj(username, targetType);
                }

                let newContent = drawWrapper(username, postId, userStatObj, targetType, dollarsData);
                wrapper.replaceWith(newContent);

                // 更新按钮状态
                $(`#ba-feh-action-btn-${postId}-${username}`).html("▲").attr("data-dropped", "true");
            } catch (error) {
                console.error("[BA_FEH] Error switching type:", error);
                wrapper.find(`#ba-feh-user-levels-${postId}-${username}`).html('<span>加载失败</span>');
            }
        });
    }

    async function handleClickEvent(that, pid, username, currentType) {
        if (that.attr("data-dropped") === "false") {
            that.html("*")
            if ($(`#ba-feh-wrapper-${pid}-${username}`).length > 0) {
                $(`#ba-feh-wrapper-${pid}-${username}`).show()
            } else {
                let userStatObj, dollarsData;

                if (currentType === 'dollars') {
                    // 获取Dollars数据
                    dollarsData = await getDollarsData(username);
                    userStatObj = { postStat: {}, topicStat: {}, likeStat: {}, spaceStat: [], recentActivities: { post: [], topic: [], likeRev: [] } };
                } else {
                    // 获取常规统计数据
                    userStatObj = await getUserStatObj(username, currentType)
                }

                let baFehWrapper = drawWrapper(username, pid, userStatObj, currentType, dollarsData)
                if ($("#likes_grid_" + pid).length > 0) {
                    $("#likes_grid_" + pid).after(baFehWrapper)
                } else if ($(`#post_${pid} > div.inner > div > div.message`).length > 0) {
                    $(`#post_${pid} > div.inner > div > div.message`).append(baFehWrapper)
                } else if ($(`#post_${pid} > div.inner > div.cmt_sub_content`).length > 0) {
                    $(`#post_${pid} > div.inner > div.cmt_sub_content`).after(baFehWrapper)
                } else if (SPACE_TYPE === 'blog' && pid.startsWith("n")) {
                    $("#viewEntry").after(baFehWrapper)
                } else {
                    console.error(`[BA_FEH] No element to mount ba_feh wrapper for postId-${pid}!`)
                }
            }
            that.html("▲")
            that.attr("data-dropped", "true")
        } else {
            that.html("▼")
            that.attr("data-dropped", "false")
            $(`#ba-feh-wrapper-${pid}-${username}`).hide()
        }
    }

    async function getDollarsData(username) {
        const cacheKey = `ba_feh_dollars_${username}`;

        // 检查缓存
        if (!!INDEXED_DB) {
            try {
                let cachedData = await getIndexedDBManager().getItem(cacheKey);
                if (cachedData && !isDollarsCacheExpired(cachedData)) {
                    return cachedData.data;
                }
            } catch (e) {
                console.warn("[BA_FEH] Failed to get Dollars data from IndexedDB:", e);
            }
        } else if (!!sessionStorage[cacheKey]) {
            try {
                let cachedObj = JSON.parse(sessionStorage[cacheKey]);
                if (!isDollarsCacheExpired(cachedObj)) {
                    return cachedObj.data;
                }
            } catch (e) {
                console.warn("[BA_FEH] Failed to parse Dollars data from sessionStorage:", e);
            }
        }

        // 获取新数据
        try {
            const response = await fetch(`${DOLLARS_API_URL}${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data && data.status && data.data) {
                if (!data.data.stats) {
                    data.data.stats = {
                        message_count: 0,
                        average_messages_per_day: 0
                    };
                }

                // 缓存数据（1小时过期）
                const cacheObj = {
                    data: data.data,
                    timestamp: new Date().valueOf(),
                    expiredAt: new Date().valueOf() + 3600000 // 1小时
                };

                try {
                    if (!!INDEXED_DB) {
                        await getIndexedDBManager().setItem(cacheKey, cacheObj);
                    } else {
                        sessionStorage[cacheKey] = JSON.stringify(cacheObj);
                    }
                } catch (e) {
                    console.warn("[BA_FEH] Failed to cache Dollars data:", e);
                }

                return data.data;
            } else {
                console.warn(`[BA_FEH] No valid data returned for Dollars user: ${username}`);
                return {
                    stats: {
                        message_count: 0,
                        average_messages_per_day: 0
                    }
                };
            }
        } catch (error) {
            console.error(`[BA_FEH] Error fetching Dollars data for ${username}:`, error);
            return {
                stats: {
                    message_count: 0,
                    average_messages_per_day: 0
                    }
                };
            }
        }

        function isDollarsCacheExpired(cacheObj) {
            return new Date().valueOf() > (cacheObj.expiredAt || 0);
        }

        async function getUserStatObj(username, spaceType = SPACE_TYPE) {
            const cachePrefix = "ba_feh_" + spaceType + "_";
            const ck = `${cachePrefix}${username}`;

            if (await areYouCached(username, spaceType)) {
                return (await getCacheByUsername(username, spaceType))
            }

            let allUsernameSet = getAllUsernameSet()
            for (let un in allUsernameSet) {
                if (await areYouCached(un, spaceType)){delete allUsernameSet[un]}
            }
            let usernameListToFetch = Object.keys(allUsernameSet)
            console.debug(`[BA_FEH] Fetching: ${JSON.stringify(usernameListToFetch)}`)
            let fetched = await fetch(BA_FEH_API_URL, {
                body: JSON.stringify({ users: usernameListToFetch, type: spaceType }),
                method: "POST"
            }).then(d => d.json())
                .catch(e => console.error("[BA_FEH] Exception when fetching data: " + e, e))
            for (let u in fetched) {
                await storeInCache(u, fetched[u], spaceType)
            }
            return await getCacheByUsername(username, spaceType)
        }

        async function storeInCache(username, userStatObj, spaceType = SPACE_TYPE) {
            const cachePrefix = "ba_feh_" + spaceType + "_";
            let ck = `${cachePrefix}${username}`
            if (!!INDEXED_DB) {
                await getIndexedDBManager().setItem(ck, userStatObj)
            } else {
                sessionStorage[ck] = JSON.stringify(userStatObj)
            }
        }

        async function areYouCached(username, spaceType = SPACE_TYPE) {
            const cachePrefix = "ba_feh_" + spaceType + "_";
            let ck = `${cachePrefix}${username}`
            if (!!INDEXED_DB) {
                let statObj = (await getIndexedDBManager().getItem(ck))
                if (!!!statObj) return false
                return !isUserStatCacheExpired(statObj)
            } else if (!!sessionStorage[ck]) {
                let statObj = JSON.parse(sessionStorage[ck])
                return !isUserStatCacheExpired(statObj)
            }
            return false
        }

        function isUserStatCacheExpired(userStatObj) {
            if ((new Date().valueOf()) > (userStatObj?._meta?.expiredAt ?? (new Date().valueOf()))) {
                return true
            }
            return false
        }

        async function getCacheByUsername(username, spaceType = SPACE_TYPE) {
            const cachePrefix = "ba_feh_" + spaceType + "_";
            let ck = `${cachePrefix}${username}`
            if (!!INDEXED_DB) {
                return (await getIndexedDBManager().getItem(ck))
            }
            return JSON.parse(sessionStorage[ck])
        }

        function formatDateline(dateline /* epoch seconds */) {
            let msWithOffset = 1000 * (dateline - new Date().getTimezoneOffset(/* minutes */) * 60)
            let d = new Date(msWithOffset)
            let [year, month, day] = d.toISOString().split("T")[0].split("-")
            return `${year.substring(2)}${month}${day}`
        }

        // Thank you https://juejin.cn/post/7228480373306818619
        function getIndexedDBManager() {
            const DATA_BASE_NAME = 'BA_FEH'
            const TABLE_NAME = 'CACHE'
            const UNIQ_KEY = 'BA_FEH_CACHE_KEY'

            let dataBase = null
            function getDataBase() {
                if (dataBase) {
                    return dataBase
                }
                return new Promise(resolve => {
                    const request = indexedDB.open(DATA_BASE_NAME)
                    request.onupgradeneeded = e => {
                        const db = e.target.result
                        if (!db.objectStoreNames.contains(TABLE_NAME)) {
                            db.createObjectStore(TABLE_NAME, { keyPath: UNIQ_KEY })
                        }
                    }
                    request.onsuccess = e => {
                        const db = e.target.result
                        dataBase = db
                        resolve(db)
                    }
                })
            }
            return {
                async setItem(key, value) {
                    const dataBase = await getDataBase()
                    return new Promise(resolve => {
                        const request = dataBase.transaction(TABLE_NAME, 'readwrite')
                            .objectStore(TABLE_NAME)
                            .put({ data: value, [UNIQ_KEY]: key })
                        request.onsuccess = resolve('success')
                    })
                },
                async getItem(key) {
                    const dataBase = await getDataBase()
                    return new Promise(resolve => {
                        const request = dataBase.transaction(TABLE_NAME)
                            .objectStore(TABLE_NAME)
                            .get(key)
                        request.onsuccess = () => {
                            resolve(request.result?.data)
                        }
                    })
                },
                async deleteItem(key) {
                    const dataBase = await getDataBase()
                    return new Promise(resolve => {
                        const request = dataBase.transaction(TABLE_NAME, 'readwrite')
                            .objectStore(TABLE_NAME)
                            .delete(key)
                        request.onsuccess = () => {
                            resolve(request.result === undefined)
                        }
                    })
                },
                async keys() {
                    const keys = {} // use as set
                    const dataBase = await getDataBase()
                    return new Promise(resolve => {
                        const request = dataBase.transaction(TABLE_NAME)
                            .objectStore(TABLE_NAME)
                            .openCursor()

                        request.onsuccess = () => {
                            const cursor = request.result;
                            if (cursor) {
                                cursor.continue()
                                keys[cursor.value[UNIQ_KEY]] = true
                            } else {
                                resolve(keys)
                            }
                        }
                    })
                }
            }
        }

        async function purgeCache() {
            if (!INDEXED_DB) return
            let timing = new Date().valueOf()
            let dbMgr = getIndexedDBManager()
            let keys = await dbMgr.keys()
            let ctr = 0
            let deleted = []

            console.debug("[BA_FEH] Keys before purging cache: " + JSON.stringify(Object.keys(keys)))

            for (let k in keys) {
                let statObj = await dbMgr.getItem(k)
                if (!statObj) continue
                if (isUserStatCacheExpired(statObj) || isDollarsCacheExpired(statObj)) {
                    await dbMgr.deleteItem(k)
                    ctr++
                    deleted.push(k)
                }
            }
            timing = (new Date().valueOf()) - timing
            console.debug(`[BA_FEH] The following expired cache keys has been removed in db: ${JSON.stringify(deleted)}`)
            console.log(`[BA_FEH] Timing for purging cache: ${timing}ms. ${ctr} rows deleted`)
        }

        function addStyleForTopPost() {
            let topPostStyle = document.createElement('style');
            topPostStyle.innerHTML = `
                .postTopic div[id^='ba-feh-wrapper-'] {
                    float: right;
                }
                .ba-feh-switch-btn {
                    color: #666;
                    text-decoration: none;
                }
                .ba-feh-switch-btn:hover {
                    color: #000;
                }
            `
            document.head.appendChild(topPostStyle);
        }
    })();