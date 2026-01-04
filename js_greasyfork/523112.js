// ==UserScript==
// @name         Douyin UserData Exporter Debug_v4.0
// @namespace    http://tampermonkey.net/
// @version      v4.0_20240107
// @description  capture statistics of an author
// @author       qmcc
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/523112/Douyin%20UserData%20Exporter%20Debug_v40.user.js
// @updateURL https://update.greasyfork.org/scripts/523112/Douyin%20UserData%20Exporter%20Debug_v40.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const posts = [];
    let hasMore = true;
    const author = {};

    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    setInterval(() => {
        if (hasMore) {
            console.log('Scrolling to bottom');
            scrollToBottom();
        }

    }, 100);

    function parseHasMore(response) {
        if (response.has_more === 1) {
            hasMore = true;
        } else {
            hasMore = false;
        }
    }

    function parsePost(aweme) {
        // 视频信息统计
        // title: 视频标题
        const post = {};
        post.title = aweme.desc;
        // createDatetime: 发布日期
        post.createDatetime = new Date(aweme.create_time * 1000);
        // likeCount: 点赞数
        post.likeCount = aweme.statistics.digg_count;
        // shareCount: 转发数
        post.shareCount = aweme.statistics.share_count;
        // commentCount: 评论数
        post.commentCount = aweme.statistics.comment_count;
        // collectCount: 收藏数
        post.collectCount = aweme.statistics.collect_count;
        // duration: 时长
        post.duration = aweme.duration / 1000;
        posts.push(post);
    }



    function parseAuthor(profile) {
        // 作者信息收集
        // 用户主页
        author.url = window.location.href

        // nickname: 昵称
        author.nickname = profile.user.nickname
        // id: 抖音号
        author.id = profile.user.unique_id || profile.user.short_id;
        // favoratedCount: 获赞数
        author.favoratedCount = profile.user.total_favorited;
        // followerCount: 粉丝数
        author.followerCount = profile.user.follower_count;
        // followingCount: 关注数
        author.followingCount = profile.user.following_count;
        // favoritingCount: 喜欢数
        author.favoritingCount = profile.user.favoriting_count;
        // gender: 性别
        author.gender = profile.user.gender === 1 ? '男' : profile.user.gender === 2 ? '女' : undefined;
        // age: 年龄
        author.age = profile.user.user_age > 0 ? profile.user.user_age : null;
        // ipLocation: IP属地
        author.ipLocation = profile.user.ip_location ? profile.user.ip_location.replace('IP属地：', '') : undefined;
        // province: 省份
        author.province = profile.user.province;
        // city: 城市
        author.city = profile.user.city;
        // postCount: 发布视频数
        author.postCount = profile.user.aweme_count;
        // hasShop: 是否有橱窗
        author.hasShop = profile.user.with_fusion_shop_entry;
        // hasLiveCommerce: 是否有直播带货？
        author.hasLiveCommerce = profile.user.live_commerce;
        // signature: 个性签名
        author.signature = profile.user.signature;
        // withCommerceEnterpriseTabEntry
        author.withCommerceEnterpriseTabEntry = profile.user.with_commerce_enterprise_tab_entry;
        // withCommerceEntry
        author.withCommerceEntry = profile.user.with_commerce_entry;
        // withNewGoods
        author.withNewGoods = profile.user.with_new_goods;
        // youtubeChannelId
        author.youtubeChannelId = profile.user.youtube_channel_id;
        // youtubeChannelTitle
        author.youtubeChannelTitle = profile.user.youtube_channel_title;
        // showFavoriteList: 是否展示喜欢列表
        author.showFavoriteList = profile.user.show_favorite_list;
        // showSubscription: 是否展示关注列表
        author.showSubscription = profile.user.show_subscription;
        // isActivityUser: 是否活跃用户
        author.isActivityUser = profile.user.is_activity_user;
        // isBan: 是否被封禁
        author.isBan = profile.user.is_ban;
        // isBlock: 是否被拉黑
        author.isBlock = profile.user.is_block;
        // isBlocked
        author.isBlocked = profile.user.is_blocked;
        // isEffectArtist: 是否是特效艺术家
        author.isEffectArtist = profile.user.is_effect_artist;
        // isGovMediaVip: 是否是政府媒体VIP
        author.isGovMediaVip = profile.user.is_gov_media_vip;
        // isMixUser: 是否是混合用户
        author.isMixUser = profile.user.is_mix_user;
        // isNotShow: 是否不展示
        author.isNotShow = profile.user.is_not_show;
        // isSeriesUser: 是否是系列用户
        author.isSeriesUser = profile.user.is_series_user;
        // isSharingProfileUser: 是否是分享资料用户
        author.isSharingProfileUser = profile.user.is_sharing_profile_user;
        // isStar: 是否是明星
        author.isStar = profile.user.is_star;
        // isoCountryCode: 国家代码
        author.isoCountryCode = profile.user.iso_country_code;
        // customVerify: 自定义认证
        author.customVerify = profile.user.custom_verify;
        // hasMcn: 是否有MCN机构
        author.hasMcn = (profile.user.account_info_url && profile.user.account_info_url.includes('mcn')) || false;
        // groupChatCount: 群聊数量
        author.groupChatCount = 0;
        if (profile.user.card_entries) {
            const groupChatEntry = profile.user.card_entries.find(entry => entry.sub_title && entry.sub_title.includes('群聊'));
            if (groupChatEntry) {
                const match = groupChatEntry.sub_title.match(/(\d+)个群聊/);
                if (match) {
                    author.groupChatCount = parseInt(match[1]);
                }
            }
        }
    }

    let dataFrame = [];

    function clearDataFrame() {
        dataFrame = [];
    }

    function addEntryToDataFrame(header, content) {
        // if content is string, replace newline with space
        if (typeof content === 'string') {
            content = content.replace(/\n/g, ' ');
            content = content.replace(/\t/g, ' ');
        }
        dataFrame.push({header, content});
    }

    function addAuthorToDataFrame() {
        addEntryToDataFrame('用户主页', author.url);
        addEntryToDataFrame('ID (抖音号)', author.id);
        addEntryToDataFrame('Nickname (昵称)', author.nickname);
        addEntryToDataFrame('Favorated (获赞数)', author.favoratedCount);
        addEntryToDataFrame('Follower (粉丝数)', author.followerCount);
        addEntryToDataFrame('Following (关注数)', author.followingCount);
        addEntryToDataFrame('Favoriting (喜欢数)', author.favoritingCount);
        addEntryToDataFrame('Gender (性别)', author.gender);
        addEntryToDataFrame('Age (年龄)', author.age);
        addEntryToDataFrame('IP Location (IP属地)', author.ipLocation);
        addEntryToDataFrame('Province (省份)', author.province);
        addEntryToDataFrame('City (城市)', author.city);
        addEntryToDataFrame('Post Count (发布视频数)', author.postCount);
        addEntryToDataFrame('Has Shop (是否有橱窗)', author.hasShop);
        addEntryToDataFrame('Has Live Commerce (是否有直播带货)', author.hasLiveCommerce);
        addEntryToDataFrame('Signature (个性签名)', author.signature);
        addEntryToDataFrame('With Commerce Enterprise Tab Entry', author.withCommerceEnterpriseTabEntry);
        addEntryToDataFrame('With Commerce Entry', author.withCommerceEntry);
        addEntryToDataFrame('With New Goods', author.withNewGoods);
        addEntryToDataFrame('Youtube Channel ID', author.youtubeChannelId);
        addEntryToDataFrame('Youtube Channel Title', author.youtubeChannelTitle);
        addEntryToDataFrame('Show Favorite List (是否展示喜欢列表)', author.showFavoriteList);
        addEntryToDataFrame('Show Subscription (是否展示关注列表)', author.showSubscription);
        addEntryToDataFrame('Is Activity User (是否活跃用户)', author.isActivityUser);
        addEntryToDataFrame('Is Ban (是否被封禁)', author.isBan);
        addEntryToDataFrame('Is Block (是否被拉黑)', author.isBlock);
        addEntryToDataFrame('Is Blocked', author.isBlocked);
        addEntryToDataFrame('Is Effect Artist (是否是特效艺术家)', author.isEffectArtist);
        addEntryToDataFrame('Is Gov Media VIP (是否是政府媒体VIP)', author.isGovMediaVip);
        addEntryToDataFrame('Is Mix User (是否是混合用户)', author.isMixUser);
        addEntryToDataFrame('Is Not Show (是否不展示)', author.isNotShow);
        addEntryToDataFrame('Is Series User (是否是系列用户)', author.isSeriesUser);
        addEntryToDataFrame('Is Sharing Profile User (是否是分享资料用户)', author.isSharingProfileUser);
        addEntryToDataFrame('Is Star (是否是明星)', author.isStar);
        addEntryToDataFrame('ISO Country Code (国家代码)', author.isoCountryCode);
        addEntryToDataFrame('Custom Verify (自定义认证)', author.customVerify);
        addEntryToDataFrame('Has MCN (是否有MCN机构)', author.hasMcn);
        addEntryToDataFrame('Group Chat Count (群聊数量)', author.groupChatCount);
    }

    function addPostToDataFrame(title, post) {
        addEntryToDataFrame(title + '-Datetime (发布日期)', post.createDatetime.toLocaleDateString());
        addEntryToDataFrame(title + '-Like (点赞数)', post.likeCount);
        addEntryToDataFrame(title + '-Share (转发数)', post.shareCount);
        addEntryToDataFrame(title + '-Comment (评论数)', post.commentCount);
        addEntryToDataFrame(title + '-Collect (收藏数)', post.collectCount);
    }

    function getStatistics() {
        clearDataFrame();
    
        // 作者信息
        addAuthorToDataFrame();
    
        // 视频平均长度
        const averageDuration = posts.reduce((acc, post) => acc + post.duration, 0) / posts.length;
        addEntryToDataFrame('Average Duration (平均时长)', averageDuration);
    
        // 视频中位数长度
        const durations = posts.map(post => post.duration);
        durations.sort((a, b) => a - b);
        const medianDuration = durations[Math.floor(durations.length / 2)];
        addEntryToDataFrame('Median Duration (中位数时长)', medianDuration);
    
        // 视频前10%长度
        const percentile10Duration = durations[Math.floor(durations.length * 0.9)];
        addEntryToDataFrame('10% Duration (前10%时长)', percentile10Duration);
    
        // 视频后10%长度
        const percentile90Duration = durations[Math.floor(durations.length * 0.1)];
        addEntryToDataFrame('90% Duration (后10%时长)', percentile90Duration);
    
        // 最近一周发布的视频数量
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const lastWeekPostsCount = posts.filter(post => post.createDatetime > oneWeekAgo).length;
        addEntryToDataFrame('Last Week Posts Count (最近一周发布数)', lastWeekPostsCount);
    
        // ————— 重点：在每次 sort() 前，都拷贝一份 posts —————
    
    // 1) Top3热门视频
    let top3HotPosts = [...posts]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 3);

    // 如果只有 1 或 2 条，就补空对象
    while (top3HotPosts.length < 3) {
        top3HotPosts.push({
            title: '',                       // 标题缺省
            createDatetime: new Date(0),     // 发布日期缺省
            likeCount: 0,
            shareCount: 0,
            commentCount: 0,
            collectCount: 0,
            duration: 0                      // 时长缺省
        });
    }

    top3HotPosts.forEach((post, index) => {
        addPostToDataFrame(`Hot${index + 1}`, post);
    });


    // 2) Latest3最新视频
    let latest3Posts = [...posts]
        .sort((a, b) => b.createDatetime - a.createDatetime)
        .slice(0, 3);

    while (latest3Posts.length < 3) {
        latest3Posts.push({
            title: '',                       
            createDatetime: new Date(0),
            likeCount: 0,
            shareCount: 0,
            commentCount: 0,
            collectCount: 0,
            duration: 0
        });
    }

    latest3Posts.forEach((post, index) => {
        addPostToDataFrame(`Latest${index + 1}`, post);
    });


    // 3) Oldest3最早视频
    let oldest3Posts = [...posts]
        .sort((a, b) => a.createDatetime - b.createDatetime)
        .slice(0, 3);

    while (oldest3Posts.length < 3) {
        oldest3Posts.push({
            title: '',                       
            createDatetime: new Date(0),
            likeCount: 0,
            shareCount: 0,
            commentCount: 0,
            collectCount: 0,
            duration: 0
        });
    }

    oldest3Posts.forEach((post, index) => {
        addPostToDataFrame(`Oldest${index + 1}`, post);
    });
    
    
        // 生成表头
        const headers = dataFrame.map(entry => entry.header);
    
        // 生成内容
        const content = dataFrame.map(entry => entry.content);
    
        // 返回二维数组 [headersRow, contentRow]
        return [headers, content];
    }
    
    



    function writeHeadersToClipboard() {
        // Excel tab-separated format
        const headers = getStatistics()[0];
        const text = headers.join('\t');
        navigator.clipboard.writeText(text);
        alert('表头已复制到剪贴板');
    }

    function writeContentToClipboard() {
        // Excel tab-separated format
        const content = getStatistics()[1];
        const text = content.join('\t');
        navigator.clipboard.writeText(text);
        if (hasMore) {
            alert('内容已复制到剪贴板，还有更多数据，请继续滚动页面');
        } else {
            alert('内容已复制到剪贴板，数据已全部加载完毕');
        }
    }

    console.log('Douyin Crawler is running');

    function findDivByInnerText(text) {
        return Array.from(document.querySelectorAll('div')).find(div => div.innerText === text);
    }

    setInterval(() => {
        const feedback = findDivByInnerText('意见反馈');
        if (feedback) {
            const newFeedback = feedback.cloneNode(true);
            newFeedback.innerText = '复制内容';
            newFeedback.onclick = writeContentToClipboard;
            feedback.parentNode.appendChild(newFeedback);
            feedback.remove();
        }
        const faq = findDivByInnerText('常见问题');
        if (faq) {
            const newFaq = faq.cloneNode(true);
            newFaq.innerText = '复制表头';
            newFaq.onclick = writeHeadersToClipboard;
            faq.parentNode.appendChild(newFaq);
            faq.remove();
        }
    }, 1000);

    function convertToCSV(headers, content) {
        // Combine headers and content into a CSV string
        const csvRows = [ content.join(',')+"\n"];
        return csvRows.join('\n');
    }

    function downloadCSV(filename, csvContent) {
        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportDataToCSV() {
        const [headers, content] = getStatistics();
        const csvContent = convertToCSV(headers, content);
        downloadCSV('douyin_user_data.csv', csvContent);
        alert('CSV 文件已生成并下载！');
    }

    // 增加一个按钮，用于触发 CSV 导出
    function createExportButton() {
        const button = document.createElement('button');
        button.textContent = '导出为 CSV';
        button.style.position = 'fixed';
        button.style.bottom = '772px';
        button.style.right = '227px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000';
        button.addEventListener('click', exportDataToCSV);
        document.body.appendChild(button);
    }

    // 调用按钮创建函数
    createExportButton();




    // Hijack XMLHttpRequest
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && url.includes('/post')) {
                const response = JSON.parse(this.responseText);
                parseHasMore(response);
                const awemeList = response.aweme_list;
                awemeList.forEach(aweme => {
                    parsePost(aweme);
                });
                console.log('Posts:', posts);
            } else if (this.readyState === 4 && url.includes('/profile/other')) {
                const response = JSON.parse(this.responseText);
                parseAuthor(response);
                console.log('Author:', author);
            }
        }, false);
        open.call(this, method, url, async, user, pass);
    };


})();