// ==UserScript==
// @name         YouTube Music 界面翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于使用其他语言时尽可能采用中文界面
// @author       Code Hz
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468589/YouTube%20Music%20%E7%95%8C%E9%9D%A2%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/468589/YouTube%20Music%20%E7%95%8C%E9%9D%A2%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MAPPINGS = {
        more: '更多',
        FEmusic_home: '首页',
        FEmusic_explore: '探索',
        FEmusic_library_landing: '媒体库',
        FEmusic_new_releases: '新发行',
        FEmusic_charts: '排行榜',
        FEmusic_moods_and_genres: '心情与流派',
        FEmusic_new_releases_albums: '新专辑与单曲',
        FEmusic_library_privately_owned_landing: '上传的内容',
        FEmusic_liked_playlists: '播放列表',
        FEmusic_liked_videos: '歌曲',
        FEmusic_liked_albums: '专辑',
        FEmusic_library_corpus_track_artists: '音乐人',
        FEmusic_library_privately_owned_tracks: '歌曲',
        FEmusic_library_privately_owned_releases: '专辑',
        FEmusic_library_privately_owned_artists: '音乐人',
        MUSIC_SHUFFLE: '随机播放',
        MIX: '收听电台',
        QUEUE_PLAY_NEXT: '接下来播放',
        INSERT_AFTER_CURRENT_VIDEO: '接下来播放该专辑',
        ADD_TO_REMOTE_QUEUE: '添加到队列',
        INSERT_AT_END: '专辑已添加到队列中',
        ADD_TO_PLAYLIST: '添加到播放列表',
        ARTIST: '转到音乐人页面',
        ALBUM: '转到专辑页面',
        SHARE: '分享',
        FLAG: '举报',
        EDIT: '编辑播放列表',
        DELETE: '删除播放列表',
        DEFAULT_ICON$LIBRARY_SAVED: '从媒体库中移除专辑',
        DEFAULT_ICON$LIBRARY_ADD: '将专辑添加到媒体库',
        TOGGLED_ICON$LIBRARY_SAVED: '从媒体库中移除专辑',
        TOGGLED_ICON$LIBRARY_ADD: '将专辑添加到媒体库',
        DEFAULT_ICON$UNFAVORITE: '从顶过的歌曲中移除',
        DEFAULT_ICON$FAVORITE: '添加到顶过的歌曲',
        TOGGLED_ICON$UNFAVORITE: '从顶过的歌曲中移除',
        TOGGLED_ICON$FAVORITE: '添加到顶过的歌曲',
        DEFAULT_ICON$SUBSCRIBE: '退订',
        TOGGLED_ICON$SUBSCRIBE: '订阅',
        CLOUD_UPLOAD: '上传音乐',
        WATCH_HISTORY: '历史记录',
        SETTINGS: '设置',
        PRIVACY_INFO: '条款及隐私权政策',
        HELP: '帮助',
        FEEDBACK: '发送反馈',
    };
    let setMessage;
    Object.defineProperty(unsafeWindow, 'setMessage', {
        set(value) { setMessage = value; },
        get() {
            return (orig) =>
            setMessage({
                ...orig,
                "ADD_EXISTING_SONG_TO_PLAYLIST": "播放列表中似乎已存在此歌曲。",
                "ADD_TO_PLAYLIST": "添加到播放列表",
                "ADVERTISEMENT": "广告",
                "ADVERTISEMENT_LABEL": "视频将在广告结束后播放",
                "ALBUM": "专辑",
                "ALL_PLAYLISTS": "所有播放列表",
                "ARE_YOU_SURE": "确定要这么做吗？",
                "AUDIO": "音频",
                "AUDIOBOOK": "有声图书",
                "AUDIODRAMA": "节目",
                "AUTOPLAY": "自动播放",
                "AUTOPLAY_DESCRIPTION": "系统会在播放队列末尾添加类似歌曲",
                "AUTOPLAY_DESCRIPTION_CONTENT": "将类似的内容添加到队列末尾",
                "AUTOPLAY_DISABLED_HEADER": "自动播放功能已关闭",
                "AUTOPLAY_ENABLED_HEADER": "自动播放功能已开启",
                "AUTOPLAY_MEALBAR_MESSAGE": "此设置会控制歌曲、专辑和播放列表的自动播放",
                "AUTOPLAY_MEALBAR_MESSAGE_TRACKS": "此设置会控制曲目、专辑和播放列表的自动播放",
                "AUTOPLAY_MEALBAR_TITLE": "现已停用自动播放功能",
                "AV_SWITCH_SONG_NOT_AVAILABLE": "无法播放纯音频",
                "AV_SWITCH_VIDEO_NOT_AVAILABLE": "无法切换成视频",
                "BACK": "返回",
                "CANCEL": "取消",
                "CAPTIONS_OFF": "字幕",
                "CAPTIONS_ON": "字幕 • 已开启",
                "CAPTIONS_UNAVAILABLE": "字幕 • 无",
                "CHANGED_ACCOUNT_DIALOG_TEXT": "请刷新页面以登录到您所切换到的帐号。",
                "CHANGED_GOOGLE_ACCOUNT": "已更改 Google 帐号",
                "CLEAR_SEARCH_BUTTON_TITLE": "清除",
                "CLOSE_MINI_PLAYER": "关闭迷你播放器",
                "CLOSE_PLAYER_PAGE": "关闭播放器页面",
                "COLLABORATE": "协作",
                "CONCURRENT_STREAM_MESSAGE": "您的帐号已在其他设备上登录，要改为在此设备上欣赏吗？",
                "CONCURRENT_STREAM_TITLE": "此设备上欣赏？",
                "CONNECT_TO_A_DEVICE": "连接到设备",
                "CONTINUE": "继续",
                "DESCRIPTION": "说明",
                "DISCONNECT": "断开连接",
                "DISLIKE": "踩",
                "DISMISS": "关闭",
                "DONE": "完成",
                "DROP_FILES_TO_UPLOAD_TO_YTM": "将文件拖到此处，即可将其上传到 YouTube Music",
                "ENTER_FULL_SCREEN": "进入全屏模式",
                "EP": "迷你专辑",
                "ERROR": "糟糕，出了点问题。",
                "ERROR_PLAYBACK": "内容无法观看。请播放其他内容。",
                "ERROR_UPLOADING_IMAGE": "上传图片时出错。",
                "EXIT_FULL_SCREEN": "退出全屏模式",
                "FAILED_UPLOADS": {
                    "case1": "1 首歌曲上传失败",
                    "other": "# 首歌曲上传失败"
                },
                "FAST_FORWARD_30_SECONDS": "快进 30 秒",
                "GENERAL": "常规",
                "GOT_IT": "知道了",
                "GO_TO_LIBRARY": "转到媒体库",
                "HOME": "首页",
                "LEARN_MORE": "了解详情",
                "LIKE": "赞",
                "LIST_SEPARATOR_PUNCTUATION": "、",
                "LIVE": "直播",
                "LIVE_SEEK_SLIDER_VALUE": "离直播结束还有 ${live_time_differential}",
                "LYRICS_NOT_AVAILABLE": "没有歌词",
                "MINI_PLAYER_IDENTIFIER": "播放器",
                "MORE_ACTIONS": "更多操作",
                "MORE_PLAYER_CONTROLS": "更多播放器控件",
                "MUTE": "静音",
                "MY_PLAYLISTS": "我的播放列表",
                "NEW_PLAYLIST": "新建播放列表",
                "NEW_RECOMMENDATIONS": "有新推荐内容",
                "NEXT": "下一个",
                "NEXT_SONG": "下一首",
                "NEXT_TRACK": "下一首",
                "NOT_NOW": "以后再说",
                "NUM_FAILED_TO_UPLOAD": {
                    "case1": "1 首歌曲上传失败",
                    "other": "# 首歌曲上传失败"
                },
                "NUM_MULTI_SELECTED": {
                    "case1": "已选择 1 项",
                    "other": "已选择 # 项"
                },
                "OPEN_AVATAR_MENU": "打开头像菜单",
                "OPEN_MINI_PLAYER": "打开迷你播放器",
                "OPEN_PLAYER_PAGE": "打开播放器页面",
                "PAID_PROMOTION": "包含付费宣传内容",
                "PAUSE": "暂停",
                "PAUSE_ITEM_LABEL": "暂停“${item_title}”",
                "PLAY": "播放",
                "PLAYBACK_RATE": "播放速度",
                "PLAYBACK_SPEED": "播放速度",
                "PLAYER_BAR_IDENTIFIER": "播放器控制栏",
                "PLAYER_LIVE_INDICATOR_LABEL": "跳转到直播状态。",
                "PLAYLIST_DELETED": "已删除播放列表",
                "PLAYLIST_IMAGE_UPLOAD_SUCCESS": "播放列表图片上传成功。",
                "PLAY_ITEM_LABEL": "播放“${item_title}”",
                "PREVIOUS": "上一个",
                "PREVIOUS_SONG": "上一首",
                "PREVIOUS_TRACK": "上一首",
                "PRIVACY": "隐私设置",
                "PRIVATE": "私享",
                "PUBLIC": "公开",
                "QUEUE": "队列",
                "REFRESH": "刷新",
                "REMOVE_HISTORICAL_SUGGESTION": "移除",
                "REMOVE_HISTORICAL_SUGGESTION_ARIA_HINT": "按 Shift + Delete 或 Enter/Return 可移除历史建议",
                "REPEAT_ALL": "循环播放全部",
                "REPEAT_DISABLED": "重复播放已停用",
                "REPEAT_OFF": "循环播放功能已关闭",
                "REPEAT_ONE": "单曲循环",
                "REQUIRED": "必填",
                "REWIND_10_SECONDS": "快退 10 秒",
                "SAVE": "保存",
                "SAVE_TO_PLAYLIST": "保存到播放列表",
                "SEARCH_BUTTON_TITLE": "启动搜索",
                "SEARCH_PLACEHOLDER": "搜索",
                "SEARCH_PLACEHOLDER_BAUHAUS": "搜索歌曲、专辑、音乐人、播客",
                "SEEK_SLIDER": "进度滑块",
                "SEEK_SLIDER_VALUE": "当前位置：${duration}；总长度：${time_progress}",
                "SEE_DETAILS": "查看详情",
                "SEND_FEEDBACK": "发送反馈",
                "SETTINGS": "设置",
                "SHOW_ALL": "显示全部",
                "SHUFFLE": "随机播放",
                "SIGN_BACK_IN": "重新登录",
                "SIGN_IN": "登录",
                "SIGN_IN_DIALOG_TEXT": "您的 Google 帐号已在其他标签页退出登录。请登录以继续操作。",
                "SINGLE": "单曲",
                "SONG": "歌曲",
                "SONGS_UPLOADING_WONT_PROCESS": "系统将不会处理目前正在上传的歌曲。",
                "SONG_COUNT": {
                    "case1": "1 首歌曲",
                    "other": "# 首歌曲"
                },
                "SPEED_025": "0.25 倍",
                "SPEED_050": "0.5 倍",
                "SPEED_075": "0.75 倍",
                "SPEED_100": "正常",
                "SPEED_125": "1.25 倍",
                "SPEED_150": "1.5 倍",
                "SPEED_175": "1.75 倍",
                "SPEED_200": "2.0 倍",
                "STARTING_MIX": "Starting mix",
                "STARTING_RADIO": "正在启动电台",
                "START_PLAYBACK": "开始播放",
                "STATS_FOR_NERDS": "详细统计信息",
                "STOP": "停止",
                "STOP_UPLOADING": "停止上传？",
                "SUCCESSFUL_UPLOADS": {
                    "case1": "已上传 1 首歌曲",
                    "other": "已上传 # 首歌曲"
                },
                "SUPPORTED_FILE_TYPES_FOR_UPLOAD": "支持的文件类型：.mp3、.m4a、.ogg、.flac、.wma",
                "SWITCH": "切换",
                "SWITCH_ACCOUNTS": "切换帐号",
                "SWITCH_ACCOUNTS_TO_UPLOAD": "切换帐号以上传内容",
                "TITLE": "标题",
                "UNLISTED": "不公开",
                "UPLOADING_NUM_OF_TOTAL": "正在上传第 ${current} 个，共 ${total} 个",
                "UPLOADS_FAILED": "上传失败",
                "UPLOADS_PROCESSING": "正在处理上传的内容",
                "UPLOAD_DUPLICATES": "重复内容 - 您的音乐库中已有相应内容",
                "UPLOAD_FILE_SIZE_EXCEEDED": "文件大小超出限制 - 无法上传大小超过 300MB 的文件",
                "UPLOAD_INELIGIBLE_ACCOUNT": "您所登录的帐号无法上传内容。如需上传音乐，请切换至您的个人 Google 帐号。",
                "UPLOAD_INVALID_FILE_FORMAT": "文件格式无效 - 仅可上传 MP3、M4A、OGG、FLAC 或 WMA 文件",
                "UPLOAD_LIMIT_REACHED": "已上传 10 万首歌曲 - 请先删除一些歌曲，才能继续上传",
                "UPLOAD_SOMETHING_WRONG": "出了点问题 - 请重新尝试上传",
                "VIDEO": "视频",
                "VOLUME": "音量",
                "YES_STOP": "是，停止",
            });
        },
        enumerable: false,
        configurable: false,
    });
    let ytcfg;
    Object.defineProperty(unsafeWindow, 'ytcfg', {
        set(value) {
            console.log("here", value);
            if (!ytcfg) {
                ytcfg = {
                    ...value,
                    set(obj) {
                        console.log({obj});
                        filtercfg(obj);
                        value.set(obj);
                    }
                }
            } else {
                ytcfg = value;
            }
        },
        get() {
            return ytcfg;
        },
        enumerable: false,
        configurable: false,
    });
    let fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (req, ...res) => {
        if ('url' in req) {
            let matched = req.url.match(/^https:\/\/music.youtube.com\/youtubei\/v1(\/(?:browse|guide|next))/);
            if (matched) {
                return fetch(req, ...res).then((res) => hookResponse(res, matched[1]));
            }
            /*
            matched = req.url.match(/^https:\/\/music.youtube.com\/youtubei\/v1(\/(?:account\/account_menu|account\/get_setting))/);
            if (matched) {
                const chunks = [];
                debugger;
                for await (const chunk of req.body) {
                    console.log(chunk);
                    chunks.push(chunk);
                }
                req.body = chunks.join('');
            }*/
        }
        return fetch(req, ...res);
    }
    let Request = unsafeWindow.Request;
    unsafeWindow.Request = class MyRequest extends Request {
        constructor(url, init) {
            console.log(url, init);
            const matched = url.match(/youtubei\/v1(\/(?:account\/account_menu|account\/get_setting))/);
            if (matched) {
                console.log('matched', matched[1]);
                const parsed = JSON.parse(init.body);
                parsed.context.client.hl = 'zh-CN';
                init.body = JSON.stringify(parsed);
            }
            super(url, init)
        }
    };
    async function hookResponse(res, path) {
        if (!res.ok) {
            return res;
        }
        return {
            ...res,
            async text() {
                const data = await res.text();
                try {
                    return translateData(data, path);
                } catch(e) {
                    debugger;
                    return data;
                }
            }
        }
    }
    function filtercfg(input) {
        console.log(input);
        if ("YTMUSIC_INITIAL_DATA" in input) {
            try {
                input.YTMUSIC_INITIAL_DATA.forEach(processInitialData);
            } catch (e) {
                console.error(e);
            }
        }
    }
    function processInitialData(data) {
        data.data = translateData(data.data, data.path);
    }
    function translateData(data, path) {
        const parsed = JSON.parse(data);
        console.log(path, parsed);
        if (path === '/guide') {
            parsed.items.forEach(translateGuideItem);
        } else if (path === '/browse') {
            translateBrowse(parsed);
        } else if (path === '/next') {
            translateNext(parsed);
        } else if (path === '/account/account_menu') {
            translateAccountMenu(parsed);
        }
        return JSON.stringify(parsed);
    }

    function translateGuideItem(item) {
        if ('pivotBarRenderer' in item) {
            translatePivotBarRenderer(item.pivotBarRenderer);
        }
    }
    function translatePivotBarRenderer(item) {
        item.items.forEach(translatePivotBarItemRenderer);
    }
    function translatePivotBarItemRenderer(item) {
        item = item.pivotBarItemRenderer;
        if (!item) return;
        translate(item.pivotIdentifier, objRunsLens(item, 'title'));
    }
    function translateBrowse(item) {
        if ('contents' in item) {
            translateBrowseContent(item.contents);
        }
        if ('continuationContents' in item) {
            translateContinuationContents(item.continuationContents);
        }
    }
    function translateBrowseContent(content) {
        try {
            if ('singleColumnBrowseResultsRenderer' in content) {
                translateSingleColumnBrowseResultsRenderer(content.singleColumnBrowseResultsRenderer);
            } else if ('sectionListRenderer' in content) {
                translateSectionListRenderer(content.sectionListRenderer);
            } else if ('gridRenderer' in content) {
                content.gridRenderer.items.forEach(translateBrowseContent);
            } else if ('musicNavigationButtonRenderer' in content) {
                translateMusicNavigationButtonRenderer(content.musicNavigationButtonRenderer);
            } else if ('musicCarouselShelfRenderer' in content) {
                translateMusicCarouselShelfRenderer(content.musicCarouselShelfRenderer);
            } else if ('musicCarouselShelfBasicHeaderRenderer' in content) {
                translateMusicCarouselShelfBasicHeaderRenderer(content.musicCarouselShelfBasicHeaderRenderer);
            } else if ('musicTwoRowItemRenderer' in content) {
                translateMusicTwoRowItemRenderer(content.musicTwoRowItemRenderer);
            } else if ('menuRenderer' in content) {
                content.menuRenderer.items.forEach(translateBrowseContent);
            } else if ('menuNavigationItemRenderer' in content) {
                translateMenuNavigationItemRenderer(content.menuNavigationItemRenderer);
            } else if ('menuServiceItemRenderer' in content) {
                translateMenuServiceItemRenderer(content.menuServiceItemRenderer);
            } else if ('toggleMenuServiceItemRenderer' in content) {
                translateToggleMenuServiceItemRenderer(content.toggleMenuServiceItemRenderer);
            } else if ('musicResponsiveListItemRenderer' in content) {
                translateMusicResponsiveListItemRenderer(content.musicResponsiveListItemRenderer);
            } else if ('singleColumnMusicWatchNextResultsRenderer' in content) {
                translateBrowseContent(content.singleColumnMusicWatchNextResultsRenderer)
            } else if ('tabbedRenderer' in content) {
                translateBrowseContent(content.tabbedRenderer);
            } else if ('watchNextTabbedResultsRenderer' in content) {
                translateWatchNextTabbedResultsRenderer(content.watchNextTabbedResultsRenderer);
            } else if ('tabRenderer' in content) {
                translateTabRenderer(content.tabRenderer);
            } else if ('musicQueueRenderer' in content) {
                translateBrowseContent(content.musicQueueRenderer.content);
            } else if ('playlistPanelRenderer' in content) {
                translatePlaylistPanelRenderer(content.playlistPanelRenderer);
            } else if ('playlistPanelVideoRenderer' in content) {
                translatePlaylistPanelVideoRenderer(content.playlistPanelVideoRenderer);
            } else if ('multiPageMenuRenderer' in content) {
                translateMultiPageMenuRenderer(content.multiPageMenuRenderer);
            } else if ('activeAccountHeaderRenderer' in content) {
                translateActiveAccountHeaderRenderer(content.activeAccountHeaderRenderer);
            } else if ('multiPageMenuSectionRenderer' in content) {
                translateMultiPageMenuSectionRenderer(content.multiPageMenuSectionRenderer);
            } else if ('compactLinkRenderer' in content) {
                translateCompactLinkRenderer(content.compactLinkRenderer);
            } else if ('musicSideAlignedItemRenderer' in content) {
                translateMusicSideAlignedItemRenderer(content.musicSideAlignedItemRenderer);
            } else if ('chipCloudRenderer' in content) {
                translateChipCloudRenderer(content.chipCloudRenderer);
            } else if ('chipCloudChipRenderer' in content) {
                translateChipCloudChipRenderer(content.chipCloudChipRenderer);
            } else if ('musicSortFilterButtonRenderer' in content) {
                translateMusicSortFilterButtonRenderer(content.musicSortFilterButtonRenderer);
            }
        } catch (e) {
            debugger;
            console.error(e);
        }
    }
    function translateContinuationContents(contents) {
        if ('sectionListContinuation' in contents) {
            contents.sectionListContinuation.contents.forEach(translateBrowseContent);
        }
    }
    function translateSingleColumnBrowseResultsRenderer(renderer) {
        renderer.tabs.forEach(translateBrowseContent);
    }
    function translateSectionListRenderer(renderer) {
        renderer.contents?.forEach(translateBrowseContent);
        if ('header' in renderer) {
            translateBrowseContent(renderer.header);
        }
    }
    function translateTabRenderer(renderer) {
        const content = renderer.content;
        if (content){
            translateBrowseContent(content);
        }
        if (renderer.tabIdentifier) {
            translate(renderer.tabIdentifier, objLens(renderer, 'title'));
        }
    }
    function translateMusicNavigationButtonRenderer(renderer) {
        translate(renderer.clickCommand.browseEndpoint.browseId, objRunsLens(renderer, 'buttonText'));
    }
    function translateMusicCarouselShelfRenderer(renderer) {
        translateBrowseContent(renderer.header);
        renderer.contents.forEach(translateBrowseContent);
    }
    function translateMusicCarouselShelfBasicHeaderRenderer(renderer) {
        const node = renderer.title.runs[0];
        if (node && node.navigationEndpoint) {
            translate(node.navigationEndpoint.browseEndpoint.browseId, objLens(renderer, 'text'));
        } else {
            console.log(renderer)
        }
        if ('moreContentButton' in renderer) {
            translate('more', objRunsLens(renderer.moreContentButton, 'text'));
        }
    }
    function translateMusicTwoRowItemRenderer(renderer) {
        translateBrowseContent(renderer.menu);
        const id = renderer.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId;
        if (id === 'VLLM') {
            renderer.title.runs[0].text = '您顶过的内容';
            renderer.subtitle = runs('自动播放列表');
        }
    }
    function translateMenuNavigationItemRenderer(renderer) {
        translate(renderer.icon.iconType, objRunsLens(renderer, 'text'));
    }
    function translateMenuServiceItemRenderer(renderer) {
        translate(renderer.icon.iconType, objRunsLens(renderer, 'text'));
        translateServiceEndpoint(renderer.serviceEndpoint);
    }
    function translateServiceEndpoint(endpoint) {
        if ('queueAddEndpoint' in endpoint) {
            translateQueueAddEndpoint(endpoint.queueAddEndpoint);
        }
    }
    function translateQueueAddEndpoint(action) {
        const queueInsertPosition = action.queueInsertPosition;
        for (const command of action.commands) {
            if ('addToToastAction' in command) {
                const renderer = command.addToToastAction.item.notificationTextRenderer;
                translate(queueInsertPosition, objRunsLens(renderer, 'successResponseText'))
            }
        }
    }
    function translateToggleMenuServiceItemRenderer(renderer) {
        translate('DEFAULT_ICON$' + renderer.defaultIcon.iconType, objRunsLens(renderer, 'defaultText'));
        translate('TOGGLED_ICON$' + renderer.toggledIcon.iconType, objRunsLens(renderer, 'toggledText'));
    }
    function translateMusicResponsiveListItemRenderer(renderer) {
        translateBrowseContent(renderer.menu);
    }
    function translateNext(res) {
        translateBrowseContent(res.contents);
    }
    function translateWatchNextTabbedResultsRenderer(renderer) {
        if (renderer.tabs.length === 3) {
            if ('content' in renderer.tabs[0]) {
                renderer.tabs[0].tabRenderer.title = '接下来播放';
                translateBrowseContent(renderer.tabs[0].content);
            }
            renderer.tabs[1].tabRenderer.title = '歌词';
            renderer.tabs[2].tabRenderer.title = '相关内容';
        }
    }
    function translatePlaylistPanelRenderer(renderer) {
        renderer.contents.forEach(translateBrowseContent);
    }
    function translatePlaylistPanelVideoRenderer(renderer) {
        translateBrowseContent(renderer.menu);
    }
    function translateAccountMenu(res) {
        res.actions.forEach(translateAccountMenuAction);
    }
    function translateAccountMenuAction(action) {
        if ('openPopupAction' in action) {
            translateOpenPopupAction(action.openPopupAction);
        }
    }
    function translateOpenPopupAction(popupaction) {
        if ('popup' in popupaction) {
            translateBrowseContent(popupaction.popup);
        }
    }
    function translateMultiPageMenuRenderer(renderer) {
        if ('header' in renderer) {
            translateBrowseContent(renderer.header);
        }
        if ('sections' in renderer) {
            renderer.sections.forEach(translateBrowseContent);
        }
    }
    function translateActiveAccountHeaderRenderer(renderer) {
        renderer.manageAccountTitle.runs[0].text = '管理您的 Google 帐号';
    }
    function translateMultiPageMenuSectionRenderer(renderer) {
        renderer.items.forEach(translateBrowseContent);
    }
    function translateCompactLinkRenderer(renderer) {
        translate(renderer.icon.iconType, objRunsLens(renderer, 'text'));
    }
    function translateMusicSideAlignedItemRenderer(renderer) {
        renderer.startItems?.forEach(translateBrowseContent);
        renderer.endItems?.forEach(translateBrowseContent);
    }
    function translateChipCloudRenderer(renderer) {
        renderer.chips?.forEach(translateBrowseContent);
    }
    function translateChipCloudChipRenderer(renderer) {
        const id = renderer.navigationEndpoint?.commandExecutorCommand?.commands?.[0]?.browseEndpoint?.browseId;
        if (id) {
            translate(id, objRunsLens(renderer, 'text'));
        }
    }
    function translateMusicSortFilterButtonRenderer(renderer) {
        const orig = renderer.title.runs[0].text;
        if ('menu' in renderer) {
            const menu = renderer.menu;
            if ('musicMultiSelectMenuRenderer' in menu) {
                const content = menu.musicMultiSelectMenuRenderer;
                for (const option of content.options) {
                    if ('musicMultiSelectMenuItemRenderer' in option) {
                        const [match, text] = translateMusicMultiSelectMenuItemRenderer(option.musicMultiSelectMenuItemRenderer);
                        if (orig === match) {
                            renderer.title = runs(text);
                        }
                    }
                }
            }
        }
    }
    function translateMusicMultiSelectMenuItemRenderer(renderer) {
        const key = atob(decodeURIComponent(renderer.formItemEntityKey));
        const orig = renderer.title.runs[0].text;
        let target = orig;
        if (key.includes('SortSpec_Type_ADDED_OR_PLAYED_TIMESTAMP_SortSpec_Order_DESCENDING')) {
            target = '近期活动';
        } else if (key.includes('SortSpec_Type_ADDED_TIMESTAMP_SortSpec_Order_DESCENDING')) {
            target = '最新添加';
        } else if (key.includes('SortSpec_Type_PLAYED_TIMESTAMP_SortSpec_Order_DESCENDING')) {
            target = '最近播放';
        }
        renderer.title = runs(target);
        return [orig, target];
    }
    function translate(id, lens) {
        const matched = MAPPINGS[id];
        if (matched) lens.set(matched);
        else console.log('unmatched', id, '=', lens.get())
    }
    function objLens(obj, key) {
        return {
            get() { return obj[key]; },
            set(value) { return (obj[key] = value); },
        }
    }
    function objRunsLens(obj, key) {
        return {
            get() { return obj[key].runs.map(x => x.text).join(''); },
            set(value) { return (obj[key] = runs(value)); },
        }
    }
    function runs(...arr) {
        return { runs: arr.map(text => ({text})) };
    }
    console.log("inject done");
})();