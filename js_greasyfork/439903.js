// ==UserScript==
// @name            简单封装一些信息
// @version         1.0.6
// @description     无
// @match           bilibili
// @author          Pronax
// ==/UserScript==

var ROOM_INFO_API = {
    ROOM_PLAY_INFO: undefined,
    ROOM_USER_INFO: undefined,
    FANS_MEDAL_INFO: undefined,
    getRid: async function () {
        if (!this.ROOM_PLAY_INFO) {
            await this.fetchPlayInfo(this.getTempRid());
        }
        return this.ROOM_PLAY_INFO.room_id;
    },
    getUid: async function () {
        if (!this.ROOM_PLAY_INFO) {
            await this.fetchPlayInfo(this.getTempRid());
        }
        return this.ROOM_PLAY_INFO.uid;
    },
    getDanmuLength: async function () {
        if (!this.ROOM_USER_INFO) {
            await this.fetchUserInfo(this.getTempRid());
        }
        return this.ROOM_USER_INFO.property.danmu.length;
    },
    getFansMedalInfo: async function () {
        if (!this.ROOM_USER_INFO) {
            let uid = await ROOM_INFO_API.getUid();
            await this.fetchMedalInfo(uid);
        }
        return this.ROOM_USER_INFO.my_fans_medal;
    },
    getTempRid: function () {
        switch (true) {
            // 真实roomid
            case typeof (__NEPTUNE_IS_MY_WAIFU__) != 'undefined':
                return __NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.room_id;
            case document.querySelector("#iframe-popup-area>iframe") != null:
                return document.querySelector("#iframe-popup-area>iframe").src.match(/roomid=(\d+)/)[1];
            // 下面的都是短位rid
            case location.href.match(/live.bilibili.com(\/blanc)?\/(\d+)/) != null:
                return location.href.match(/live.bilibili.com(\/blanc)?\/(\d+)/)[2];
            case document.querySelector("#player-ctnr iframe"):
                return document.querySelector("#player-ctnr iframe").src.match(/blanc\/(\d+)/)[1];
            case typeof (__initialState) != 'undefined' && __initialState["live-non-revenue-player"].length == 1:
                return __initialState["live-non-revenue-player"][0].defaultRoomId;
            default:
                alert("无法获得RID，请反馈给插件开发者");
        }
    },
    fetchPlayInfo: async function (rid) {
        return new Promise((resolve, reject) => {
            fetch(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${rid}`, {
                credentials: 'include',
            })
                .then(res => res.json())
                .then(json => {
                    this.ROOM_PLAY_INFO = json.data;
                    resolve();
                });
        });
    },
    fetchUserInfo: async function (rid) {
        return new Promise((resolve, reject) => {
            fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${rid}`, {
                credentials: 'include',
            })
                .then(res => res.json())
                .then(json => {
                    this.ROOM_USER_INFO = json.data;
                    resolve();
                });
        });
    },
    fetchMedalInfo: async function (uid) {
        return new Promise((resolve, reject) => {
            fetch(`https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/fans_medal_info?target_id=${uid}`, {
                credentials: 'include',
            })
                .then(res => res.json())
                .then(json => {
                    this.ROOM_USER_INFO = json.data;
                    resolve();
                });
        });
    }
};