// ==UserScript==
// @name                （重新修改版）喜马拉雅音频地址提取工具 - 12redcircle
// @namespace           cyou.12redcircle.xmly-radio-extractor
// @match               https://www.ximalaya.com/**
// @require             https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @require             https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// @require             https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.slim.min.js
// @require             https://cdn.jsdelivr.net/npm/sodajs@0.4.10/dist/soda.min.js
// @grant               GM_addStyle
// @grant               GM_setClipboard
// @grant               GM_setValue
// @grant               GM_getValue
// @version             20240230
// @author              12redcircle
// @description         提取喜马拉雅网页上专辑和音频的播放链接
// @contributionURL     （见下方脚本的  正文注释，也有）    https://greasyfork.org/zh-CN/scripts/485347-重新修改版-喜马拉雅音频地址提取工具-12redcircle
// @license             WTFPL
// @downloadURL https://update.greasyfork.org/scripts/485347/%EF%BC%88%E9%87%8D%E6%96%B0%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E9%9F%B3%E9%A2%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20-%2012redcircle.user.js
// @updateURL https://update.greasyfork.org/scripts/485347/%EF%BC%88%E9%87%8D%E6%96%B0%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E9%9F%B3%E9%A2%91%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20-%2012redcircle.meta.js
// ==/UserScript==
//
//
//
//
//
//
(async function () {
    'use strict';
    class Side_Helper {
        /**
         * 获取接口签名，header 中的 xm-sign
         * @returns
         */
        static getSign() {
            const secretKey = this.SECRET_KEY;
            const serverTime = window.XM_SERVER_CLOCK || 0;
            const clientTime = Date.now();
            const random = (t) => ~~(Math.random() * t);
            return `${md5(`${secretKey}${serverTime}`)}(${random(100)})${serverTime}(${random(100)})${clientTime}`;
        }
        /**
         * 获取服务器时间（无需xm-sign）
         * 备用方法，如果获取不到 window.XM_SERVER_CLOCK, serverTime = await getServerTime()
         * @returns 一个时间字符串
         */
        static async getServerTime() {
            return await fetch('https://www.ximalaya.com/revision/time')
                .then(res => res.text());
        }
        /**
         * 获取专辑播放列表
         * 注意：请在专辑界面调用
         * @param {*} albumId 专辑id
         * @param {*} pageNum 分页
         * @returns
         */
        static async getAlbumTrackList(albumId, pageNum) {
            const response = await fetch(`https://www.ximalaya.com/revision/album/v1/getTracksList?albumId=${albumId}&pageNum=${pageNum}&pageSize=100&sort=0`, {
                'credentials': 'include',
                'headers': {
                    'xm-sign': this.getSign(),
                },
                'method': 'GET',
                'mode': 'cors',
            });
            return response.json();
        }
        /**
         * 获取播放url列表（需要cookie，无需xm-sign）
         * 在任何界面均可调用
         * https://www.ximalaya.com/sound/${trackId}
         * @param {*} trackId 音轨id
         * @returns
         */
        static async getTrackList(trackId) {
            const response = await fetch(`https://mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo/${Date.now()}?device=web&trackId=${trackId}&trackQualityLevel=1`, {
                'credentials': 'include',
                'method': 'GET',
                'mode': 'cors',
            });
            return response.json();
        }
        /**
         * 获取播放url列表中的第一个直链
         * @param {*} playList
         * @returns
         */
        static getDownloadURL(playUrlList) {
            if (playUrlList && playUrlList.length) {
                const url = playUrlList[0].url;
                return decrypt(url);
            }
            return false;
            function decrypt(t) {
                return CryptoJS.AES.decrypt({
                    ciphertext: CryptoJS.enc.Base64url.parse(t),
                }, CryptoJS.enc.Hex.parse('aaad3e4fd540b0f79dca95606e72bf93'), {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7,
                })
                    .toString(CryptoJS.enc.Utf8);
            }
        }
        /*************** 对链接的操作 *******************/
        static isAlbumView() {
            return location.href.includes('/album/');
        }
        static isTrackView() {
            return location.href.includes('/sound/') || location.href.includes('/youshengshu/');
        }
        static getId(href) {
            return href.substring(href.lastIndexOf('/') + 1);
        }
        // 监听网页地址变化
        static pageViewChange$(callback) {
            let lastUrl = location.href;
            const observer = new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    callback();
                }
            });
            observer.observe(document, {
                subtree: true,
                childList: true,
            });
            callback();
        }
        /*************** 数据逻辑 *******************/
        static async getAlbumViewData(albumId) {
            const albumList = [];
            let pageNum = 1;
            while (1) {
                const { data, } = await this.getAlbumTrackList(albumId, pageNum);
                const _albumList = data.tracks;
                if (_albumList.length === 0) {
                    break;
                }
                albumList.push(..._albumList);
                pageNum++;
            }
            return albumList.map(function (album) {
                return {
                    title: album.title,
                    index: album.index,
                    trackId: Side_Helper.getId(album.url),
                };
            });
        }
        static async getTrackViewData____新增延迟(trackId) {
            const { trackInfo, } = await this.getTrackList(trackId);
            const title = trackInfo.title;
            const url = this.getDownloadURL(trackInfo.playUrlList);
            const _delay_延迟秒数 = 0.5;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        title,
                        url,
                        trackId,
                    });
                }, _delay_延迟秒数 * 1000);
            });
        }
        /*************** UI交互窗口 *******************/
        static addDragBehavior(selector) {
            const Drag = document.querySelector(selector);
            Drag.onmousedown = function (event) {
                const ev = event || window.event;
                ev === null || ev === void 0 ? void 0 : ev.stopPropagation();
                const disX = ev.clientX - Drag.offsetLeft;
                const disY = ev.clientY - Drag.offsetTop;
                Drag.onmousemove = function (event) {
                    const ev = event || window.event;
                    const left = ev.clientX - disX;
                    const top = ev.clientY - disY;
                    Drag.style.left = left + 'px';
                    Drag.style.top = top + 'px';
                };
            };
            Drag.onmouseup = function () {
                Drag.onmousemove = null;
            };
        }
        ;
    }
    /*************** 基础 *******************/
    Side_Helper.SECRET_KEY = 'himalaya-'; // 证书生成秘钥
    class QuickFn_Helper {
        static shuffle_打乱洗牌_Array(arr) {
            return arr
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            // return arr.sort((newV, oldV)=>{
            //   return Math.random() - 1 / 2;
            // });
        }
    }
    class Logic_Helper {
        static _0_init_Base() {
            $(document.body)
                .append(`
          <div id="${this.APPID}"></div>`);
            GM_addStyle(`
          #__xmdownload__community__ {
            position: fixed;
            top: 0;
            line-height: 1.6;
            padding: 10px 20px;
            background-color: #dcdcdc;
            z-index: 20220923;
            min-height: 100px;
            max-height: 80vh;
            overflow: auto;
            background-color: rgba(240, 223, 175, 0.9);
            border: 2px solid black;
            box-shadow: 5px 5px 5px #000000;
          }
      
          #__xmdownload__community__:hover {
            cursor: move;
            user-select: none;
          }
      
          #__xmdownload__community__ .albumView table {
            width: 100%;
          }
      
          #__xmdownload__community__ .albumView table th{
            text-align: left;
          }
      
          #__xmdownload__community__ .albumView table td{
            min-width: 80px;
            max-width: 300px;
          }
  `);
            Side_Helper.addDragBehavior(`#${this.APPID}`);
        }
        static _1_bind_event() {
            const _is_支持点击切换 = true;
            /**
             * TIP    在这里，就是【点击事件】的绑定。
             */
            $(`#${this.APPID}`)
                .on('click', '.download_hook', async function (item) {
                if (_is_支持点击切换) {
                    const title = item.target.dataset.title;
                    Logic_Helper._2_2_3_1_保存最新播放____且需要注意_不会保存羊皮卷的(title);
                    alert('即将切换');
                    window.location.reload();
                }
                else {
                    const trackId = item.target.dataset.trackId;
                    const { url, } = await Side_Helper.getTrackViewData____新增延迟(trackId);
                    if (url) {
                        window.open(url, '_blank');
                    }
                    else {
                        alert(`获取下载链接失败，可能是因为【你正在尝试获取会员专享音频，但你目前不是会员】`);
                    }
                }
            });
            $(`#${this.APPID}`)
                .on('click', '.get_link_hook', async function (item) {
                if (_is_支持点击切换) {
                    const title = item.target.dataset.title;
                    Logic_Helper._2_2_3_1_保存最新播放____且需要注意_不会保存羊皮卷的(title);
                    alert('即将切换');
                    window.location.reload();
                }
                else {
                    const trackId = item.target.dataset.trackId;
                    const { url, } = await Side_Helper.getTrackViewData____新增延迟(trackId);
                    if (url) {
                        GM_setClipboard(url, 'text/plain');
                    }
                    else {
                        alert(`获取下载链接失败，可能是因为【你正在尝试获取会员专享音频，但你目前不是会员】`);
                    }
                }
            });
            /**
             * TIP 复制，所有的一整个【单子地址】。
             */
            $(`#${this.APPID}`)
                .on('click', '.copy_all_link', async function (item) {
                const new_arr = [];
                //
                const _start_自然排序从1开始 = 243;
                const _num = 10;
                const _重新裁剪的_arr = Logic_Helper._data_arr.slice(_start_自然排序从1开始 - 1, _start_自然排序从1开始 - 1 + _num);
                console.log(_重新裁剪的_arr, Logic_Helper._data_arr);
                //
                for (const o of _重新裁剪的_arr) {
                    const { url, } = await Side_Helper.getTrackViewData____新增延迟(o.trackId);
                    new_arr.push({
                        title: o.title, // 指定，一个JSON字段先后的顺序
                        url,
                    });
                }
                const _str = JSON.stringify(new_arr, null, 2);
                if (_str) {
                    GM_setClipboard(_str, 'text/plain');
                    console.log('视频地址', _str);
                }
                else {
                    alert(`获取下载链接失败，可能是因为【你正在尝试获取会员专享音频，但你目前不是会员】`);
                }
            });
        }
        static _2_1_render() {
            const albumViewTpl = `
        <div class="albumView">
          <div class="copy_all_link">复制全部</div>

          <table>
            <thead>
            <th>序号</th>
            <th>标题（点击标题打开音频）</th>
            <th></th>
            </thead>
            <tbody>
            <tr soda-repeat="item in data">
              <td>{{item.index}}</td>
              <td><a class="download_hook" data-track-id="{{item.trackId}}"
                     data-title="{{item.title}}">{{item.title}}</a></td>
              <td><a class="get_link_hook" data-track-id="{{item.trackId}}"
                     data-title="{{item.title}}">复制链接</a></td>
            </tr>
            </tbody>
          </table>
        </div>
      `;
            const trackViewTpl = `
        <div class="copy_all_link">复制全部</div>

        <div class="trackView">
          <a class="download_hook" data-track-id="{{data.trackId}}" target="_blank"
             data-title="{{item.title}}">{{data.title}}（点击打开音频）</a>
          <a class="get_link_hook" data-track-id="{{item.trackId}}"
             data-title="{{item.title}}">复制链接</a>
        </div>
      `;
            const loadingViewTpl = `
    正在为你获取音频列表……
  `;
            Side_Helper.pageViewChange$(async function () {
                $(`#${Logic_Helper.APPID}`)
                    .html(soda(loadingViewTpl, {}))
                    .show();
                if (Side_Helper.isAlbumView()) {
                    const albumId = Side_Helper.getId(location.href);
                    const albumData = await Side_Helper.getAlbumViewData(albumId);
                    Logic_Helper._data_arr = [...albumData]; // TIP 自己添加
                    $(`#${Logic_Helper.APPID}`)
                        .html(soda(albumViewTpl, {
                        data: albumData,
                    }));
                }
                else if (Side_Helper.isTrackView()) {
                    const trackId = Side_Helper.getId(location.href);
                    const trackData = await Side_Helper.getTrackViewData____新增延迟(trackId);
                    Logic_Helper._data_arr = [trackData]; // TIP 自己添加
                    $(`#${Logic_Helper.APPID}`)
                        .html(soda(trackViewTpl, {
                        data: trackData,
                    }));
                }
                else {
                    $(`#${Logic_Helper.APPID}`).hide();
                }
                Logic_Helper._2_2_add_video();
            });
        }
        static _2_2_add_video() {
            // const _节目_开始条目_title = `话说汉朝祸起萧墙026-王莽窃权`;
            const _节目_开始条目_title = this._2_2_4_读取最新播放();
            let _is_find = false;
            let _筛选过后_节目_arr = Logic_Helper._data_arr.filter(o => {
                if (o.title === _节目_开始条目_title) {
                    _is_find = true;
                }
                return _is_find;
            });
            if (_筛选过后_节目_arr.length == 0) {
                _筛选过后_节目_arr = Logic_Helper._data_arr; // 如果没筛到；则取一个全量。
            }
            this._total_play列表 = Logic_Helper._羊皮卷_arr.map((o, index) => {
                const result = [o];
                //
                const _play_item = _筛选过后_节目_arr[index];
                if (_play_item) {
                    result.push(_play_item);
                }
                //
                return result;
            }).flat(9).map((o, index) => {
                return Object.assign(Object.assign({}, o), { index });
            });
            console.log(this._total_play列表);
            $(`#${Logic_Helper.APPID}`).prepend(`
        <div>
          <div>
            视频播放器
            <video
                id="${this._video_id}"
                controls
            >
              <source src="" type="video/mp4">
              Your browser does not support HTML5 video.
            </video>
          </div>
          <div>
            上次播放到：<span id="${this._yesterday_playing_id}"></span>
          </div>
          <div>
            当前正在播放：<span id="${this._now_playing_id}"></span>
          </div>
        </div>
      `);
            Logic_Helper._更换_当前正在播放的项____会改变_再次读取值时_全局变量(0);
            // this._cur_play_item = this._total_play列表[0];
            this._2_2_1_准备预备一个视频(this._cur_play_item);
        }
        static _更换_当前正在播放的项____会改变_再次读取值时_全局变量(_新播放的_index___如果是基于老的需要加1) {
            const all_list = Logic_Helper._total_play列表;
            // 切换到下一个。
            Logic_Helper._cur_play_item = all_list[(_新播放的_index___如果是基于老的需要加1) % all_list.length];
        }
        static async _2_2_1_准备预备一个视频(item) {
            const v_jDom = $(`#${this._video_id}`);
            const v_NativeDom = v_jDom[0];
            const { url, } = await Side_Helper.getTrackViewData____新增延迟(item.trackId);
            v_NativeDom.src = url;
            // await v_dom.play();
            await Logic_Helper._2_2_2_渲染标题_等等();
            /**
             * 参考资料：
             *        jquery event fires twice - Stack Overflow    https://stackoverflow.com/a/21511788/6264260
             */
            function _fixBug_jQuery_事件触发两次(fn) {
                return function (e) {
                    fn(e);
                    e.stopPropagation(); // 修复
                    return false; // 修复
                };
            }
            /**
             * TIP 放完后，进入下一个。
             */
            v_jDom.on('ended', _fixBug_jQuery_事件触发两次(async function (e) {
                console.log('ended事件。');
                const old_item = Logic_Helper._cur_play_item;
                Logic_Helper._更换_当前正在播放的项____会改变_再次读取值时_全局变量(old_item.index + 1);
                const { url, } = await Side_Helper.getTrackViewData____新增延迟(Logic_Helper._cur_play_item.trackId);
                v_NativeDom.src = url;
                await v_NativeDom.play();
            }));
            v_jDom.on('play', _fixBug_jQuery_事件触发两次(async function (e) {
                /**
                 * WARN 最终原因找到了。为什么会【重复两遍】
                 *        原因：
                 *                【拖动一次】    也会触发一次【play事件】。    然后，再进入【ended】。    然后，再播放【一个新的视频】，又会触发一次【play事件】。
                 *                所以，也就是说：
                 *                        当前视频
                 *                            【   非羊皮卷】，则会  清除2次  定时器。
                 *                            【   是羊皮卷】，则会  设置2次  定时器；    第2次，就把  第1次  顶掉了。
                 */
                console.log('play事件。' + v_NativeDom.currentTime);
                const _title = Logic_Helper._cur_play_item.title;
                Logic_Helper._2_2_3_1_保存最新播放____且需要注意_不会保存羊皮卷的(_title);
                //
                Logic_Helper._2_2_3_2_在最新播放时_设置音量_设置播放速度(v_jDom, _title);
                //
                await Logic_Helper._2_2_2_渲染标题_等等();
            }));
        }
        static async _2_2_2_渲染标题_等等() {
            const now_playing_jDom = $(`#${this._now_playing_id}`);
            /**
             * TIP 显示，当前正在播放的。
             */
            now_playing_jDom.text(Logic_Helper._cur_play_item.title);
            //
            //
            //
            const yesterday_playing_jDom = $(`#${this._yesterday_playing_id}`);
            /**
             * TIP 显示，当前正在播放的。
             */
            yesterday_playing_jDom.text(this._2_2_4_读取最新播放());
        }
        static _2_2_3_1_保存最新播放____且需要注意_不会保存羊皮卷的(title) {
            /**
             * TIP 记录，最新的一个播放条目。
             */
            const _is_in羊皮卷 = Logic_Helper._羊皮卷_arr.find(o => {
                return o.title === title;
            });
            if (!_is_in羊皮卷) {
                GM_setValue(Logic_Helper._本地记录_play_key, title);
            }
        }
        static _2_2_3_2_在最新播放时_设置音量_设置播放速度(jVideoDom, title) {
            /**
             * 参考资料：
             *    javascript - How to get a DOM Element from a jQuery selector? - Stack Overflow    https://stackoverflow.com/a/1677910/6264260
             */
            const videoRawDom = jVideoDom.get(0);
            const _is_in羊皮卷 = Logic_Helper._羊皮卷_arr.find(o => {
                return o.title === title;
            });
            console.log('设置前音量', videoRawDom === null || videoRawDom === void 0 ? void 0 : videoRawDom.volume);
            if (_is_in羊皮卷) {
                console.log('play视频种类：羊皮卷');
                // videoRawDom!!.volume = 60 / 100;
                videoRawDom.volume = 40 / 100;
                /**
                 * 2倍播放速度
                 * 参考资料：
                 *        javascript - How to change the playing speed of videos in HTML5? - Stack Overflow    https://stackoverflow.com/a/3027957/6264260
                 */
                const intv = window.setInterval(() => {
                    console.log('速度加快');
                    videoRawDom.playbackRate = 1.5; // 加快
                    const timeout = window.setTimeout(() => {
                        console.log('速度减慢');
                        videoRawDom.playbackRate = 0.75; // 减慢
                    }, 3000);
                    this.__播放速度切换_两种定时器_arr.push({ value: timeout, type: 'timeout' });
                }, 5000);
                this.__播放速度切换_两种定时器_arr.push({ value: intv, type: 'interval' });
            }
            else {
                console.log('play视频种类：其它视频');
                videoRawDom.volume = 100 / 100;
                //
                (() => {
                    this.__播放速度切换_两种定时器_arr.forEach(o => {
                        switch (o.type) {
                            case 'timeout':
                                clearTimeout(o.value);
                                break;
                            case 'interval':
                                clearInterval(o.value);
                                break;
                            default:
                                alert('似乎不该有这个？');
                                break;
                        }
                    });
                    this.__播放速度切换_两种定时器_arr = []; // 进行一个，列表的清空。
                    videoRawDom.playbackRate = 1.0; // 恢复速度
                })();
            }
            console.log('设置后音量', videoRawDom === null || videoRawDom === void 0 ? void 0 : videoRawDom.volume);
        }
        static _2_2_4_读取最新播放() {
            return GM_getValue(this._本地记录_play_key, '"null"');
        }
    }
    Logic_Helper.APPID = `__xmdownload__community__`;
    Logic_Helper._data_arr = [];
    Logic_Helper._video_id = `video_player`;
    Logic_Helper._now_playing_id = `now_playing`;
    Logic_Helper._yesterday_playing_id = `yesterday_playing`;
    Logic_Helper._cur_play_item = null;
    Logic_Helper._本地记录_play_key = '本地记录__播放到的条目';
    Logic_Helper._羊皮卷_arr = QuickFn_Helper.shuffle_打乱洗牌_Array([
        //
        { trackId: '369304745', title: '1羊皮卷第一卷' },
        { trackId: '369304834', title: '2羊皮卷第二卷' },
        { trackId: '369600008', title: '3羊皮卷第三卷' },
        { trackId: '369600032', title: '04羊皮卷第四卷' },
        { trackId: '369700985', title: '05羊皮卷第五卷' },
        { trackId: '369701098', title: '06羊皮卷第六卷' },
        { trackId: '369926478', title: '07羊皮卷第七卷' },
        { trackId: '369926492', title: '08羊皮卷第八卷' },
        { trackId: '369926506', title: '09羊皮卷第九卷' },
        { trackId: '369926510', title: '10羊皮卷第十卷' },
    ]);
    Logic_Helper.__播放速度切换_两种定时器_arr = [];
    Logic_Helper._0_init_Base();
    Logic_Helper._1_bind_event();
    Logic_Helper._2_1_render();
})();
