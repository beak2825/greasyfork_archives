// ==UserScript==
// @name         YouTubeライブ コメント流し
// @namespace    https://midra.me
// @version      2.0.0
// @description  YouTubeライブのチャットを動画上に流すやつ
// @author       Midra
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @compatible   chrome >= 80
// @compatible   safari >= 14.1
// @compatible   firefox >= 80
// @downloadURL https://update.greasyfork.org/scripts/444120/YouTube%E3%83%A9%E3%82%A4%E3%83%96%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%B5%81%E3%81%97.user.js
// @updateURL https://update.greasyfork.org/scripts/444120/YouTube%E3%83%A9%E3%82%A4%E3%83%96%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%B5%81%E3%81%97.meta.js
// ==/UserScript==

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ../../Library/FlowComments/src/constants.ts
/****************************************
 * デフォルト値
 */
const CONFIG = {
    /** フォントファミリー */
    FONT_FAMILY: [
        'Arial',
        '"ＭＳ Ｐゴシック"', 'MS PGothic',
        '"ヒラギノ角ゴシック"', '"Hiragino Sans"',
        // '"游ゴシック体"', 'YuGothic', '"游ゴシック"', '"Yu Gothic"',
        'Gulim', '"Malgun Gothic"',
        '"黑体"', 'SimHei',
        'system-ui', '-apple-system',
        'sans-serif',
    ].join(),
    /** フォントの太さ */
    FONT_WEIGHT: '600',
    /** フォントの拡大率 */
    FONT_SCALE: 0.7,
    /** フォントのY軸のオフセット */
    FONT_OFFSET_Y: 0.15,
    /** テキストの色 */
    TEXT_COLOR: '#fff',
    /** テキストシャドウの色 */
    TEXT_SHADOW_COLOR: '#000',
    /** テキストシャドウのぼかし */
    TEXT_SHADOW_BLUR: 1,
    /** テキスト間の余白（配列形式の場合） */
    TEXT_MARGIN: 0.2,
    /** Canvasのクラス名 */
    CANVAS_CLASSNAME: 'mid-FlowComments',
    /** Canvasの比率 */
    CANVAS_RATIO: 16 / 9,
    /** Canvasの解像度 */
    CANVAS_RESOLUTION: 720,
    /** 解像度のリスト */
    RESOLUTION_LIST: [240, 360, 480, 720],
    /** コメントの表示時間 */
    CMT_DISPLAY_DURATION: 6000,
    /** コメントの最大数（0は無制限） */
    CMT_LIMIT: 0,
    /** 行数 */
    LINES: 11,
    /** 比率の自動調整 */
    AUTO_RESIZE: true,
    /** 解像度の自動調整 */
    AUTO_RESOLUTION: true,
};
/****************************************
 * コメントの種類
 */
var TYPE;
(function (TYPE) {
    TYPE[TYPE["FLOW"] = 0] = "FLOW";
    TYPE[TYPE["TOP"] = 1] = "TOP";
    TYPE[TYPE["BOTTOM"] = 2] = "BOTTOM";
})(TYPE || (TYPE = {}));
const ITEM_DEFAULT_OPTION = {
    position: TYPE.FLOW,
    duration: CONFIG.CMT_DISPLAY_DURATION,
};
const DEFAULT_OPTION = {
    resolution: CONFIG.CANVAS_RESOLUTION,
    lines: CONFIG.LINES,
    limit: CONFIG.CMT_LIMIT,
    autoResize: CONFIG.AUTO_RESIZE,
    autoResolution: CONFIG.AUTO_RESOLUTION,
    smoothRender: false,
};
const DEFAULT_STYLE = {
    fontFamily: CONFIG.FONT_FAMILY,
    fontWeight: CONFIG.FONT_WEIGHT,
    fontScale: 1,
    color: CONFIG.TEXT_COLOR,
    shadowColor: CONFIG.TEXT_SHADOW_COLOR,
    shadowBlur: CONFIG.TEXT_SHADOW_BLUR,
    opacity: 1,
};

;// CONCATENATED MODULE: ../../Library/FlowComments/src/modules/imageCache.ts
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ImageCache_OPTION, _ImageCache_cache;
/****************************************
 * @classdesc 画像キャッシュ管理用
 */
class ImageCache {
    /****************************************
     * キャッシュ追加
     * @param url URL
     * @param img 画像
     */
    static add(url, img) {
        // 削除
        if (__classPrivateFieldGet(this, _a, "f", _ImageCache_OPTION).maxSize < Object.keys(__classPrivateFieldGet(this, _a, "f", _ImageCache_cache)).length) {
            let delCacheUrl;
            Object.keys(__classPrivateFieldGet(this, _a, "f", _ImageCache_cache)).forEach(key => {
                if (delCacheUrl === undefined ||
                    __classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[key].lastUsed < __classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[delCacheUrl].lastUsed) {
                    delCacheUrl = key;
                }
            });
            this.dispose(delCacheUrl);
        }
        // 追加
        __classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[url] = {
            img: img,
            lastUsed: Date.now(),
        };
    }
    /****************************************
     * 画像が存在するか
     * @param url URL
     */
    static has(url) {
        return url !== undefined && __classPrivateFieldGet(this, _a, "f", _ImageCache_cache).hasOwnProperty(url);
    }
    /****************************************
     * 画像を取得
     * @param url URL
     * @returns 画像
     */
    static async get(url) {
        return new Promise(async (resolve, reject) => {
            if (this.has(url)) {
                __classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[url].lastUsed = Date.now();
                resolve(__classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[url].img);
            }
            else {
                try {
                    let img = new Image();
                    img.addEventListener('load', ({ target }) => {
                        if (target instanceof HTMLImageElement) {
                            this.add(target.src, target);
                            resolve(__classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[target.src].img);
                        }
                        else {
                            reject();
                        }
                    });
                    img.addEventListener('error', reject);
                    img.src = url;
                    img = null;
                }
                catch (e) {
                    reject(e);
                }
            }
        });
    }
    /****************************************
     * 画像を解放
     * @param url URL
     */
    static dispose(url) {
        if (url !== undefined && this.has(url)) {
            __classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[url].img.remove();
            delete __classPrivateFieldGet(this, _a, "f", _ImageCache_cache)[url];
        }
    }
}
_a = ImageCache;
/** オプション（デフォルト値） */
_ImageCache_OPTION = { value: {
        maxSize: 50,
    } };
/** キャッシュ */
_ImageCache_cache = { value: {} };

;// CONCATENATED MODULE: ../../Library/FlowComments/src/modules/image.ts

/****************************************
 * @classdesc `FlowComments.Item`用の画像クラス
 */
class image_Image {
    /****************************************
     * コンストラクタ
     * @param url URL
     * @param alt 代替テキスト
     */
    constructor(url, alt) {
        this._url = url;
        this._alt = alt || '';
    }
    get url() { return this._url; }
    get alt() { return this._alt; }
    /****************************************
     * 画像を取得
     */
    async get() {
        try {
            return (await ImageCache.get(this._url));
        }
        catch (e) {
            return this._alt;
        }
    }
}

;// CONCATENATED MODULE: ../../Library/FlowComments/src/modules/util.ts
/****************************************
 * @classdesc ユーティリティ
 */
class Util {
    /****************************************
     * オブジェクトのプロパティからnullとundefinedを除去
     * @param obj オブジェクト
     */
    static filterObject(obj) {
        if (obj !== undefined && obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
            Object.keys(obj).forEach(key => {
                if (obj[key] === undefined || obj[key] === null) {
                    delete obj[key];
                }
                else {
                    this.filterObject(obj[key]);
                }
            });
        }
    }
    /****************************************
     * Canvasにスタイルを適用
     * @param ctx      CanvasRenderingContext2D
     * @param style    スタイル
     * @param fontSize フォントサイズ
     */
    static setStyleToCanvas(ctx, style, fontSize) {
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.font = `${style.fontWeight} ${fontSize * style.fontScale}px ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.shadowColor = style.shadowColor;
        ctx.shadowBlur = fontSize / 16 * style.shadowBlur;
        ctx.globalAlpha = style.opacity;
    }
}

;// CONCATENATED MODULE: ../../Library/FlowComments/src/modules/item.ts


/****************************************
 * @classdesc 流すコメント
 * @example
 * // idを指定する場合
 * const fcItem1 = new FlowCommentsItem('1518633760656605184', 'ｳﾙﾄﾗｿｳｯ')
 * // idを指定しない場合
 * const fcItem2 = new FlowCommentsItem(Symbol(), 'みどらんかわいい！')
 */
class Item {
    /****************************************
     * コンストラクタ
     * @param id       コメントID
     * @param content  コメント本文
     * @param [option] オプション
     * @param [style]  スタイル
     */
    constructor(id, content, option, style) {
        /** 座標 */
        this.position = {
            x: 0,
            y: 0,
            xp: 0,
            offsetY: 0,
        };
        /**
         * 描画サイズ
         * @type {{ width: number; height: number; }}
         */
        this.size = {
            width: 0,
            height: 0,
        };
        /** 実際に流すときの距離 */
        this.scrollWidth = 0;
        /** 行番号 */
        this.line = 0;
        Util.filterObject(option);
        Util.filterObject(style);
        this._id = id;
        this._content = Array.isArray(content) ? content.filter(v => v) : content;
        this._option = { ...ITEM_DEFAULT_OPTION, ...option };
        if (this._option.position === TYPE.FLOW) {
            this._actualDuration = this._option.duration * 1.5;
        }
        else {
            this._actualDuration = this._option.duration;
        }
        this._style = style;
        this._canvas = document.createElement('canvas');
    }
    get id() { return this._id; }
    get content() { return this._content; }
    get style() { return this._style; }
    get option() { return this._option; }
    get actualDuration() { return this._actualDuration; }
    get canvas() { return this._canvas; }
    get top() { return this.position?.y || 0; }
    get bottom() {
        return this.position !== undefined && this.size !== undefined
            ? this.position.y + this.size.height
            : 0;
    }
    get left() { return this.position?.x || 0; }
    get right() {
        return this.position !== undefined && this.size !== undefined
            ? this.position.x + this.size.width
            : 0;
    }
    get rect() {
        return {
            width: this.size?.width || 0,
            height: this.size?.height || 0,
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right,
        };
    }
    dispose() {
        this._canvas?.remove();
    }
}

;// CONCATENATED MODULE: ../../Library/FlowComments/src/modules/main.ts
var main_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Main_instances, main_a, _Main_id_cnt, _Main_updateCommentsStyle, _Main_floor, _Main_initializeComment, _Main_renderComment, _Main_update, _Main_loop;



// import * as PIXI from 'pixi.js'
/****************************************
 * @classdesc コメントを流すやつ
 * @example
 * // 準備
 * const fc = new FlowComments.Main()
 * document.body.appendChild(fc.canvas)
 * fc.start()
 *
 * // コメントを流す(追加する)
 * fc.pushComment(new FlowComments.Item(Symbol(), 'Hello world!'))
 */
class Main {
    /****************************************
     * コンストラクタ
     * @param [option] オプション
     * @param [style]  スタイル
     */
    constructor(option, style) {
        _Main_instances.add(this);
        // 初期化
        this.initialize(option, style);
    }
    get id() { return this._id; }
    get style() { return { ...DEFAULT_STYLE, ...this._style }; }
    get option() { return { ...DEFAULT_OPTION, ...this._option }; }
    get canvas() { return this._canvas; }
    get context2d() { return this._context2d; }
    get comments() { return this._comments; }
    get lineHeight() { return this._canvas instanceof HTMLCanvasElement ? this._canvas.height / this.option.lines : 0; }
    get fontSize() { return this.lineHeight * CONFIG.FONT_SCALE; }
    get isStarted() { return this._animReqId !== undefined; }
    /****************************************
     * 初期化（インスタンス生成時には不要）
     * @param [option] オプション
     * @param [style]  スタイル
     */
    initialize(option, style) {
        var _b, _c;
        this.dispose();
        // ID割り当て
        this._id = __classPrivateFieldSet(_b = Main, main_a, (_c = main_classPrivateFieldGet(_b, main_a, "f", _Main_id_cnt), ++_c), "f", _Main_id_cnt);
        // Canvas生成
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add(CONFIG.CANVAS_CLASSNAME);
        this._canvas.dataset.fcid = this._id.toString();
        // CanvasRenderingContext2D
        this._context2d = this._canvas.getContext('2d');
        // コメント一覧
        this._comments = [];
        // サイズ変更を監視
        this._resizeObs = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if (this._canvas === undefined)
                    return;
                const { width, height } = entry.contentRect;
                // Canvasのサイズ(比率)を自動で調整
                if (this.option.autoResize) {
                    const rect_before = this._canvas.width / this._canvas.height;
                    const rect_resized = width / height;
                    if (0.01 < Math.abs(rect_before - rect_resized)) {
                        this.resizeCanvas();
                    }
                }
                // Canvasの解像度を自動で調整
                if (this.option.autoResolution) {
                    const resolution = CONFIG.RESOLUTION_LIST.find(v => height <= v);
                    if (Number.isFinite(resolution) && this.option.resolution !== resolution) {
                        this.changeOption({ resolution: resolution });
                    }
                }
            });
        });
        this._resizeObs.observe(this._canvas);
        // オプションをセット
        this.changeOption(option);
        // スタイルをセット
        this.changeStyle(style);
    }
    /****************************************
     * オプションを変更
     * @param option オプション
     */
    changeOption(option) {
        Util.filterObject(option);
        this._option = { ...this._option, ...option };
        if (option !== undefined && option !== null) {
            this.resizeCanvas();
        }
    }
    /****************************************
     * スタイルを変更
     * @param [style] スタイル
     */
    changeStyle(style) {
        Util.filterObject(style);
        this._style = { ...this._style, ...style };
        if (style !== undefined && style !== null) {
            main_classPrivateFieldGet(this, _Main_instances, "m", _Main_updateCommentsStyle).call(this);
        }
    }
    /****************************************
     * Canvasをリサイズ
     */
    resizeCanvas() {
        const { width, height } = this._canvas.getBoundingClientRect();
        const { resolution } = this.option;
        const ratio = (width === 0 && height === 0) ? CONFIG.CANVAS_RATIO : (width / height);
        this._canvas.width = resolution * ratio;
        this._canvas.height = resolution;
        // Canvasのスタイルをリセット
        main_classPrivateFieldGet(this, _Main_instances, "m", _Main_updateCommentsStyle).call(this);
    }
    /****************************************
     * Canvasのスタイルをリセット
     */
    resetCanvasStyle() {
        this.changeStyle(DEFAULT_STYLE);
    }
    /****************************************
     * コメントを追加(流す)
     * @param comment コメント
     */
    async pushComment(comment) {
        if (this.isStarted === false ||
            document.visibilityState === 'hidden')
            return;
        //----------------------------------------
        // 画面内に表示するコメントを制限
        //----------------------------------------
        if (0 < this.option.limit && this.option.limit <= this._comments.length) {
            this._comments.splice(0, this._comments.length - this.option.limit)[0];
        }
        //----------------------------------------
        // `FCItem`を初期化
        //----------------------------------------
        await main_classPrivateFieldGet(this, _Main_instances, "m", _Main_initializeComment).call(this, comment);
        //----------------------------------------
        // コメント表示行を計算
        //----------------------------------------
        const spd_pushCmt = comment.scrollWidth / comment.option.duration;
        // [[0, 0], [1, 0], ~ , [10, 0]] ([line, cnt])
        const lines_over = [...Array(this.option.lines)].map((_, i) => [i, 0]);
        this._comments.forEach(cmt => {
            // 残り表示時間
            const leftTime = cmt.option.duration * (1 - cmt.position.xp);
            // コメント追加時に重なる or 重なる予定かどうか
            const isOver = comment.left - spd_pushCmt * leftTime <= 0 ||
                comment.left <= cmt.right;
            if (isOver && cmt.line < this.option.lines) {
                lines_over[cmt.line][1]++;
            }
        });
        // 重なった頻度を元に昇順で並べ替える
        const lines_sort = lines_over.sort(([, cntA], [, cntB]) => cntA - cntB);
        comment.line = lines_sort[0][0];
        comment.position.y = this.lineHeight * comment.line;
        //----------------------------------------
        // コメントを追加
        //----------------------------------------
        this._comments.push(comment);
    }
    /****************************************
     * コメント流しを開始
     */
    start() {
        if (this._animReqId === undefined) {
            this._animReqId = window.requestAnimationFrame(main_classPrivateFieldGet(this, _Main_instances, "m", _Main_loop).bind(this));
        }
    }
    /****************************************
     * コメント流しを停止
     */
    stop() {
        if (this._animReqId !== undefined) {
            window.cancelAnimationFrame(this._animReqId);
            delete this._animReqId;
        }
    }
    /****************************************
     * 解放(初期化してCanvasを削除)
     */
    dispose() {
        this.stop();
        this._canvas?.remove();
        this._resizeObs?.disconnect();
    }
}
main_a = Main, _Main_instances = new WeakSet(), _Main_updateCommentsStyle = function _Main_updateCommentsStyle() {
    // Canvasをリセット
    this._context2d?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    // コメントを再初期化・描画
    this._comments.forEach(cmt => {
        main_classPrivateFieldGet(this, _Main_instances, "m", _Main_initializeComment).call(this, cmt);
        main_classPrivateFieldGet(this, _Main_instances, "m", _Main_renderComment).call(this, cmt);
    });
}, _Main_floor = function _Main_floor(num) {
    return this._option?.smoothRender ? num : (num | 0);
}, _Main_initializeComment = 
/****************************************
 * `FCItem`を初期化
 * @param comment コメント
 */
async function _Main_initializeComment(comment) {
    const ctx = comment.canvas.getContext('2d');
    if (ctx === null)
        return;
    ctx.clearRect(0, 0, comment.canvas.width, comment.canvas.height);
    const style = { ...this.style, ...comment.style };
    const drawFontSize = this.fontSize * style.fontScale;
    const margin = drawFontSize * CONFIG.TEXT_MARGIN;
    // スタイルを適用
    Util.setStyleToCanvas(ctx, style, this.fontSize);
    const aryWidth = [];
    //----------------------------------------
    // サイズを計算
    //----------------------------------------
    for (const cont of comment.content) {
        // 文字列
        if (typeof cont === 'string') {
            aryWidth.push(ctx.measureText(cont).width);
        }
        // 画像
        else if (cont instanceof image_Image) {
            const img = await cont.get();
            if (img instanceof HTMLImageElement) {
                const ratio = img.width / img.height;
                aryWidth.push(drawFontSize * ratio);
            }
            else if (img !== undefined) {
                aryWidth.push(ctx.measureText(img).width);
            }
            else {
                aryWidth.push(1);
            }
        }
    }
    // コメントの各プロパティを計算
    comment.size.width = aryWidth.reduce((a, b) => a + b);
    comment.size.width += margin * (aryWidth.length - 1);
    comment.size.height = this.lineHeight;
    comment.scrollWidth = this._canvas.width + comment.size.width;
    comment.position.x = this._canvas.width - comment.scrollWidth * comment.position.xp;
    comment.position.y = this.lineHeight * comment.line;
    comment.position.offsetY = this.lineHeight / 2 * (1 + CONFIG.FONT_OFFSET_Y);
    // Canvasのサイズを設定
    comment.canvas.width = comment.size.width;
    comment.canvas.height = comment.size.height;
    // スタイルを再適用（上でリセットされる）
    Util.setStyleToCanvas(ctx, style, this.fontSize);
    //----------------------------------------
    // コメントを描画
    //----------------------------------------
    let dx = 0;
    for (let idx = 0; idx < comment.content.length; idx++) {
        if (0 < idx) {
            dx += margin;
        }
        const cont = comment.content[idx];
        // 文字列
        if (typeof cont === 'string') {
            ctx.fillText(cont, main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, dx), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, comment.position.offsetY));
        }
        // 画像
        else if (cont instanceof image_Image) {
            const img = await cont.get();
            if (img instanceof HTMLImageElement) {
                ctx.drawImage(img, main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, dx), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, (comment.size.height - drawFontSize) / 2), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, aryWidth[idx]), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, drawFontSize));
            }
            else if (img !== undefined) {
                ctx.fillText(img, main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, dx), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, comment.position.offsetY));
            }
            else {
                ctx.fillText('', main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, dx), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, comment.position.offsetY));
            }
        }
        dx += aryWidth[idx];
    }
}, _Main_renderComment = function _Main_renderComment(comment) {
    this._context2d?.drawImage(comment.canvas, main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, comment.position.x), main_classPrivateFieldGet(this, _Main_instances, "m", _Main_floor).call(this, comment.position.y));
}, _Main_update = function _Main_update(time) {
    // Canvasをリセット
    this._context2d?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._comments.forEach((cmt, idx, ary) => {
        // コメントを流し始めた時間
        if (cmt.startTime === undefined) {
            cmt.startTime = time;
        }
        // コメントを流し始めて経過した時間
        const elapsedTime = time - cmt.startTime;
        if (elapsedTime <= cmt.actualDuration) {
            // コメントの座標を更新(流すコメント)
            if (cmt.option.position === TYPE.FLOW) {
                cmt.position.xp = elapsedTime / cmt.option.duration;
                cmt.position.x = this._canvas.width - cmt.scrollWidth * cmt.position.xp;
            }
            // コメントを描画
            main_classPrivateFieldGet(this, _Main_instances, "m", _Main_renderComment).call(this, cmt);
        }
        else {
            // 表示時間を超えたら消す
            cmt.dispose();
            ary.splice(idx, 1)[0];
        }
    });
}, _Main_loop = function _Main_loop(time) {
    main_classPrivateFieldGet(this, _Main_instances, "m", _Main_update).call(this, time);
    if (this._animReqId !== undefined) {
        this._animReqId = window.requestAnimationFrame(main_classPrivateFieldGet(this, _Main_instances, "m", _Main_loop).bind(this));
    }
};
/** インスタンスに割り当てられるIDのカウント用 */
_Main_id_cnt = { value: 0 };

;// CONCATENATED MODULE: ../../Library/FlowComments/src/modules/core.ts






;// CONCATENATED MODULE: ../../Library/FlowComments/src/index.ts




;// CONCATENATED MODULE: ./src/constants.ts
/**
 * チャットのタイプ
 */
var CHAT_TYPE;
(function (CHAT_TYPE) {
    /** テキスト */
    CHAT_TYPE[CHAT_TYPE["TEXT"] = 0] = "TEXT";
    /** スーパーチャット */
    CHAT_TYPE[CHAT_TYPE["PAID"] = 1] = "PAID";
    /** スーパーチャット（ステッカー） */
    CHAT_TYPE[CHAT_TYPE["PAID_STICKER"] = 2] = "PAID_STICKER";
    /** メンバーシップ */
    CHAT_TYPE[CHAT_TYPE["MEMBERSHIP"] = 3] = "MEMBERSHIP";
})(CHAT_TYPE || (CHAT_TYPE = {}));
/**
 * チャットのタイプをタグに紐付ける
 */
const PAIR_CHAT_TAGNAME_TYPE = {
    'yt-live-chat-text-message-renderer': CHAT_TYPE.TEXT,
    'yt-live-chat-paid-message-renderer': CHAT_TYPE.PAID,
    'yt-live-chat-paid-sticker-renderer': CHAT_TYPE.PAID_STICKER,
    'yt-live-chat-membership-item-renderer': CHAT_TYPE.MEMBERSHIP,
};
/**
 * 投稿者のタイプ
 */
var AUTHOR_TYPE;
(function (AUTHOR_TYPE) {
    /** 一般ユーザー */
    AUTHOR_TYPE[AUTHOR_TYPE["USER"] = 0] = "USER";
    /** オーナー */
    AUTHOR_TYPE[AUTHOR_TYPE["OWNER"] = 1] = "OWNER";
    /** モデレーター */
    AUTHOR_TYPE[AUTHOR_TYPE["MODERATOR"] = 2] = "MODERATOR";
    /** メンバー */
    AUTHOR_TYPE[AUTHOR_TYPE["MEMBER"] = 3] = "MEMBER";
})(AUTHOR_TYPE || (AUTHOR_TYPE = {}));
/**
 * 投稿者のタイプを`author-type`属性に紐付ける
 */
const PAIR_AUTHOR_ATTR_TYPE = {
    '': AUTHOR_TYPE.USER,
    'owner': AUTHOR_TYPE.OWNER,
    'moderator': AUTHOR_TYPE.MODERATOR,
    'member': AUTHOR_TYPE.MEMBER,
};
/**
 * カラーコード
 */
const COLOR = {
    /** 一般ユーザー */
    USER: '#ffffff',
    /** オーナー */
    OWNER: '#ffd600',
    /** モデレーター */
    MODERATOR: '#5e84f1',
    /** メンバー */
    MEMBER: '#4ae064',
};
/**
 * セレクタ
 */
const SELECTOR = {
    /** 投稿者名 */
    AUTHOR_NAME: '#author-name',
    /** アバター画像 */
    AUTHOR_PHOTO: '#author-photo img',
    /** モデレーターバッジ */
    AUTHOR_BADGE: '#chat-badges img',
    /** スーパーチャット */
    PAID_PURCHASE: '#purchase-amount, #purchase-amount-chip',
    /** テキスト */
    MESSAGE: '#message',
};
const SVG_SETTING = '<svg viewBox="0 0 24 24" style="fill: #fff;"><g class="style-scope yt-icon"><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z" class="style-scope yt-icon"></path></g></svg>';

;// CONCATENATED MODULE: ./src/util/getAuthorTypeFromAttr.ts

/****************************************
 * 属性から投稿者のタイプを取得
 */
/* harmony default export */ var getAuthorTypeFromAttr = ((attr) => {
    const type = PAIR_AUTHOR_ATTR_TYPE[attr || ''];
    return typeof type === 'number' ? type : AUTHOR_TYPE.USER;
});

;// CONCATENATED MODULE: ./src/util/extractChatData.ts


/****************************************
 * ライブチャットのデータを抽出
 */
/* harmony default export */ var extractChatData = ((target) => {
    const authorName = target.querySelector(SELECTOR.AUTHOR_NAME);
    const authorPhoto = target.querySelector(SELECTOR.AUTHOR_PHOTO);
    const authorBadge = target.querySelector(SELECTOR.AUTHOR_BADGE);
    const id = target.id || '';
    const author = {
        type: getAuthorTypeFromAttr(target.getAttribute('author-type')),
        name: authorName?.textContent?.trim() || null,
        photo: authorPhoto?.src || null,
        badge: authorBadge?.src || null,
        badgeAlt: authorBadge?.alt || null,
    };
    const message = target.querySelector(SELECTOR.MESSAGE);
    const items = Array.from(message?.childNodes || []).map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            return {
                type: 'text',
                text: node.textContent || '',
                src: null,
                alt: null,
            };
        }
        else if (node instanceof HTMLImageElement) {
            return {
                type: 'image',
                text: null,
                src: node.src,
                alt: node.alt,
            };
        }
    }).reduce((result, current) => {
        // ['分割された', '文字列', image] → ['分割された文字列', image] (一部省略)
        if (current !== void 0 &&
            (current.text || current.src) !== '') {
            const prev = result[result.length - 1];
            if (prev !== void 0 &&
                prev.type === 'text' &&
                current.type === 'text') {
                prev.text += current.text;
            }
            else {
                result.push(current);
            }
        }
        return result;
    }, []);
    const paid = {
        purchase: target.querySelector(SELECTOR.PAID_PURCHASE)?.textContent?.trim() || null,
        color: target.style.getPropertyValue('--yt-live-chat-paid-message-primary-color') ||
            target.style.getPropertyValue('--yt-live-chat-paid-sticker-chip-background-color') ||
            null,
    };
    return {
        id: id,
        author: author,
        items: items,
        paid: paid,
    };
});

;// CONCATENATED MODULE: ./src/util/getChatTypeFromTagName.ts

/****************************************
 * タグからチャットのタイプを取得
 */
/* harmony default export */ var getChatTypeFromTagName = ((tagName) => {
    const type = PAIR_CHAT_TAGNAME_TYPE[tagName || ''];
    return typeof type === 'number' ? type : null;
});

;// CONCATENATED MODULE: ../../Library/MidConfig/src/types.ts
const isConfigItemData = (data) => {
    if (data instanceof Object) {
        return (Object.keys(data).length === 3 &&
            data.hasOwnProperty('checked') &&
            data.hasOwnProperty('value') &&
            data.hasOwnProperty('default'));
    }
    return false;
};
const isConfigJsonData = (data) => {
    if (data instanceof Object) {
        return (Object.keys(data).length === 2 &&
            data.hasOwnProperty('version') &&
            data.hasOwnProperty('data'));
    }
    return false;
};

;// CONCATENATED MODULE: ../../Library/MidConfig/src/constants.ts
const SVG_CHECKMARK = '<svg class="midconfig-svg-checkmark" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.86 17.997a1.002 1.002 0 0 1-.73-.32l-4.86-5.17a1.001 1.001 0 0 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1.002 1.002 0 0 1-.73.33h-.01Z"></path></svg>';
const SVG_ARROW_DOWN = '<svg class="midconfig-svg-arrow-down" width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.001a1 1 0 0 1-.64-.23l-6-5a1.001 1.001 0 0 1 1.28-1.54l5.36 4.48 5.36-4.32a1 1 0 0 1 1.41.15 1 1 0 0 1-.14 1.46l-6 4.83a1 1 0 0 1-.63.17Z"></path></svg>';
const STYLE = '#midconfig{display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:space-between;width:100%;height:100%;border-radius:10px;background-color:var(--back1);border:1px solid var(--text3);box-shadow:1px 1px 10px -2px var(--text3);overflow:hidden}#midconfig{--accent1: #2389ff;--accent2: #238aff26;--accent-text: #fff;--back1: #fff;--text1: #3c3c3c;--text2: #8a8a8a;--text3: #e0e0e0;--red1: #ff3456;--red2: #ff345626}#midconfig[theme=dark]{--accent1: #298cff;--accent2: #298cff36;--accent-text: #fff;--back1: #333;--text1: #f1f1f1;--text2: #a0a0a0;--text3: #505050}@media(prefers-color-scheme: dark){#midconfig[theme=auto]{--accent1: #298cff;--accent2: #298cff36;--accent-text: #fff;--back1: #333;--text1: #f1f1f1;--text2: #a0a0a0;--text3: #505050}}#midconfig #midconfig,#midconfig *,#midconfig ::after,#midconfig ::before{transition:150ms ease-in-out}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=text],#midconfig .midconfig-select-container>select{padding:0 10px;border:1px solid var(--text3);border-radius:8px;background-color:rgba(0,0,0,0)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-label-container>label>span,#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-header>span,#midconfig .midconfig-tab>.midconfig-tab-item,#midconfig .midconfig-button,#midconfig .midconfig-select-container>select{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}#midconfig ::-webkit-scrollbar{width:7px}#midconfig ::-webkit-scrollbar-track{background-color:rgba(0,0,0,0);margin:1px 0}#midconfig ::-webkit-scrollbar-thumb{background-color:var(--text2);border-radius:3px;border-right:1px solid rgba(0,0,0,0);border-left:1px solid rgba(0,0,0,0);background-clip:padding-box}#midconfig *{scrollbar-width:thin;scrollbar-color:var(--text2) rgba(0,0,0,0)}#midconfig,#midconfig *,#midconfig ::after,#midconfig ::before{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,sans-serif;font-size:14px;font-weight:400;color:var(--text1)}#midconfig :not(input){-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#midconfig svg{display:inline-block;fill:var(--text2);pointer-events:none}#midconfig input{-webkit-appearance:none;-moz-appearance:none;appearance:none}#midconfig input[type=checkbox]{display:none}#midconfig input[type=checkbox]+label{cursor:pointer}#midconfig input[type=checkbox]+label>svg.midconfig-svg-checkmark{width:16px;height:16px;min-width:16px;min-height:16px;margin:2px;border:2px solid var(--text3);border-radius:4px;fill:rgba(0,0,0,0);transition-property:background-color,border}#midconfig input[type=checkbox]:checked+label>svg.midconfig-svg-checkmark{background-color:var(--accent1);border:none;fill:var(--accent-text)}#midconfig .midconfig-select-container{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;position:relative}#midconfig .midconfig-select-container>select{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:100%;height:100%}#midconfig .midconfig-select-container>select:focus{outline:none}#midconfig .midconfig-select-container>svg.midconfig-svg-arrow-down{position:absolute;top:3px;right:3px;width:24px;height:24px;min-width:24px;min-height:24px}#midconfig .midconfig-button-container{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;width:100%}#midconfig .midconfig-button-container__disable>.midconfig-button,#midconfig .midconfig-button-container.midconfig-button-empty>.midconfig-button{opacity:.25;pointer-events:none}#midconfig .midconfig-button{display:inline-block;width:inherit;height:30px;line-height:30px;text-align:center;background-color:var(--back1);border-radius:8px;cursor:pointer}#midconfig .midconfig-button:hover{filter:opacity(0.7)}#midconfig .midconfig-button:hover:active{filter:opacity(0.5)}#midconfig .midconfig-button--solid{color:var(--accent1)}#midconfig .midconfig-button--outline{line-height:28px;color:var(--accent1);border:1px solid var(--accent1)}#midconfig .midconfig-button--outline:hover{color:var(--accent-text);background-color:var(--accent1);filter:none}#midconfig .midconfig-button--outline:hover:active{filter:opacity(0.7)}#midconfig .midconfig-button--fill-alpha{color:var(--accent1);background-color:var(--accent2)}#midconfig .midconfig-button--fill{color:var(--accent-text);background-color:var(--accent1)}#midconfig .midconfig-button--solid-red{color:var(--red1)}#midconfig .midconfig-button--outline-red{line-height:28px;color:var(--red1);border:1px solid var(--red1)}#midconfig .midconfig-button--outline-red:hover{color:#fff;background-color:var(--red1);filter:none}#midconfig .midconfig-button--outline-red:hover:active{filter:opacity(0.7)}#midconfig .midconfig-button--fill-alpha-red{color:var(--red1);background-color:var(--red2)}#midconfig .midconfig-button--fill-red{color:#fff;background-color:var(--red1)}#midconfig>*{width:100%}#midconfig .midconfig-tab{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px;padding:5px 5px 0;border-bottom:1px solid var(--text3)}#midconfig .midconfig-tab>.midconfig-tab-item{display:inline-block;width:inherit;height:30px;line-height:30px;padding:0 0 5px;text-align:center;color:var(--text2);cursor:pointer;box-sizing:content-box}#midconfig .midconfig-tab>.midconfig-tab-item::after{content:"";display:block;position:relative;top:1px;width:100%;height:4px;background-color:var(--accent1);border-radius:2px;opacity:0}#midconfig .midconfig-tab>.midconfig-tab-item__selected{font-weight:600;color:var(--accent1)}#midconfig .midconfig-tab>.midconfig-tab-item__selected::after{opacity:1}#midconfig .midconfig-main{height:100%;padding:10px 8px 10px 10px;overflow-y:scroll}#midconfig .midconfig-main>.midconfig-page-item{display:none}#midconfig .midconfig-main>.midconfig-page-item__selected{display:flex;flex-direction:column;flex-wrap:nowrap;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-header{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;justify-content:space-between;height:30px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-header>svg.midconfig-svg-arrow-down{width:30px;height:inherit;max-width:30px;max-height:30px;min-width:30px;min-height:30px;transform:scale(-1, -1)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-items{display:flex;flex-direction:column;flex-wrap:nowrap;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-items>.midconfig-item>.midconfig-label-container{padding-left:15px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group.midconfig-accordion>.midconfig-group-header{cursor:pointer}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group.midconfig-accordion__close>.midconfig-group-header>svg.midconfig-svg-arrow-down{transform:scale(1, 1)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group.midconfig-accordion__close>.midconfig-group-items{display:none}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;justify-content:space-between;gap:5px;height:30px;overflow:hidden}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item:not(.midconfig-item-checkbox)>*{width:50%;overflow:hidden}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>*{width:100%;height:inherit}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>*>*{width:100%;height:inherit}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-label-container>label{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=text]:focus{outline:none;border-color:var(--accent1)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]{width:30px;height:30px;min-width:30px;min-height:30px;border:none;border-radius:50%;overflow:hidden;cursor:pointer}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-webkit-color-swatch-wrapper{padding:0}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-moz-color-swatch-wrapper{padding:0}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-webkit-color-swatch{border:1px solid var(--text3);border-radius:50%}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-moz-color-swatch{border:1px solid var(--text3);border-radius:50%}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]{width:65%;height:6px;background:linear-gradient(90deg, var(--accent1) var(--range-progress, 0), var(--text3) var(--range-progress, 0));border-radius:3px;transition:none}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:12px;height:12px;background-color:var(--accent1);border-radius:6px;border:none;cursor:ew-resize}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]::-moz-range-thumb{-moz-appearance:none;appearance:none;width:12px;height:12px;background-color:var(--accent1);border-radius:6px;border:none;cursor:ew-resize}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]+input[type=text]{width:35%;padding:0;text-align:center}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item.midconfig-button-container>.midconfig-label-container{width:100%}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item.midconfig-button-container>.midconfig-button{max-width:120px;min-width:90px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item__disable>.midconfig-input-container{opacity:.25;pointer-events:none}#midconfig .midconfig-main>.midconfig-page-item .midconfig-divider{display:block;width:100%;height:1px;background-color:var(--text3);margin:2px 0}#midconfig .midconfig-bottom{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px;padding:5px;border-top:1px solid var(--text3)}';

;// CONCATENATED MODULE: ../../Library/MidConfig/src/util.ts
const escapeHTML = (html) => {
    if (typeof html !== 'string') {
        return html;
    }
    return html.replace(/[&'`"<>]/g, (match) => {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match] || match;
    });
};
const setTextWithTitle = (elem, text) => {
    elem.textContent = text;
    elem.addEventListener('mouseover', ({ target }) => {
        if (target instanceof HTMLElement) {
            if (0 < target.scrollWidth - target.offsetWidth) {
                target.title = target.textContent || '';
            }
            else {
                target.title = '';
            }
        }
    });
};
const fullWidthToHalfWidth = (str) => {
    return str
        .replace('＃', '#')
        .replace(/[ａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
};
const generateUID = (len = 10) => {
    const str = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
    return `${Array.from(Array(len)).map(() => str[Math.random() * str.length | 0]).join('')}-${Date.now()}`;
};
const isColorCode = (hex) => {
    return /^#?[a-fA-F0-9]{6}$/.test(hex);
};

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Item.ts
var Item_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Item_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Item_initData, _Item_uid, _Item_value, _Item_labalContainer, _Item_inputContainer, _Item_inputCheckbox;


class Item_Item extends HTMLElement {
    constructor(initData) {
        super();
        _Item_initData.set(this, void 0);
        _Item_uid.set(this, void 0);
        _Item_value.set(this, void 0);
        _Item_labalContainer.set(this, void 0);
        _Item_inputContainer.set(this, void 0);
        _Item_inputCheckbox.set(this, null);
        Item_classPrivateFieldSet(this, _Item_initData, initData, "f");
        Item_classPrivateFieldSet(this, _Item_uid, `midconfig-${generateUID()}`, "f");
        Item_classPrivateFieldSet(this, _Item_value, initData.default, "f");
        this.classList.add(Item_Item.NAME);
        this.classList.add(this.tagName.toLowerCase());
        Item_classPrivateFieldSet(this, _Item_labalContainer, document.createElement('div'), "f");
        Item_classPrivateFieldGet(this, _Item_labalContainer, "f").classList.add('midconfig-label-container');
        // ラベル
        const label = document.createElement('label');
        const span = document.createElement('span');
        setTextWithTitle(span, initData.label);
        label.appendChild(span);
        Item_classPrivateFieldGet(this, _Item_labalContainer, "f").insertAdjacentElement('beforeend', label);
        // チェックボックス
        if (initData.withCheckBox === true) {
            label.setAttribute('for', Item_classPrivateFieldGet(this, _Item_uid, "f"));
            label.insertAdjacentHTML('afterbegin', SVG_CHECKMARK);
            Item_classPrivateFieldSet(this, _Item_inputCheckbox, document.createElement('input'), "f");
            Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").type = 'checkbox';
            Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").id = Item_classPrivateFieldGet(this, _Item_uid, "f");
            Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked = Boolean(initData.checked);
            if (!this.checked) {
                this.classList.add(`${Item_Item.NAME}__disable`);
            }
            Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").addEventListener('change', () => {
                if (this.checked) {
                    this.classList.remove(`${Item_Item.NAME}__disable`);
                }
                else {
                    this.classList.add(`${Item_Item.NAME}__disable`);
                }
                if (typeof Item_classPrivateFieldGet(this, _Item_initData, "f").onChange === 'function') {
                    Item_classPrivateFieldGet(this, _Item_initData, "f").onChange({
                        target: this,
                        id: Item_classPrivateFieldGet(this, _Item_initData, "f").id,
                        value: null,
                        checked: this.checked,
                    });
                }
            });
            Item_classPrivateFieldGet(this, _Item_labalContainer, "f").insertAdjacentElement('afterbegin', Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f"));
        }
        Item_classPrivateFieldSet(this, _Item_inputContainer, document.createElement('div'), "f");
        Item_classPrivateFieldGet(this, _Item_inputContainer, "f").classList.add('midconfig-input-container');
        this.appendChild(Item_classPrivateFieldGet(this, _Item_labalContainer, "f"));
        this.appendChild(Item_classPrivateFieldGet(this, _Item_inputContainer, "f"));
    }
    get initData() { return Item_classPrivateFieldGet(this, _Item_initData, "f"); }
    get uid() { return Item_classPrivateFieldGet(this, _Item_uid, "f"); }
    get value() { return Item_classPrivateFieldGet(this, _Item_value, "f"); }
    get checked() {
        if (Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f") !== null) {
            return Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked;
        }
        else {
            return null;
        }
    }
    get labalContainer() { return Item_classPrivateFieldGet(this, _Item_labalContainer, "f"); }
    get inputContainer() { return Item_classPrivateFieldGet(this, _Item_inputContainer, "f"); }
    get inputCheckbox() { return Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f"); }
    set checked(data) {
        if (typeof data === 'boolean' &&
            Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f") !== null) {
            if (data === Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked) {
                return;
            }
            Item_classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked = data;
            if (this.checked) {
                this.classList.remove(`${Item_Item.NAME}__disable`);
            }
            else {
                this.classList.add(`${Item_Item.NAME}__disable`);
            }
            if (typeof Item_classPrivateFieldGet(this, _Item_initData, "f").onChange === 'function') {
                Item_classPrivateFieldGet(this, _Item_initData, "f").onChange({
                    target: this,
                    id: Item_classPrivateFieldGet(this, _Item_initData, "f").id,
                    value: null,
                    checked: this.checked,
                });
            }
        }
    }
    set _value(data) {
        if (typeof data === 'string' ||
            typeof data === 'number' ||
            typeof data === 'boolean') {
            if (data === Item_classPrivateFieldGet(this, _Item_value, "f")) {
                return;
            }
            Item_classPrivateFieldSet(this, _Item_value, data, "f");
            if (typeof Item_classPrivateFieldGet(this, _Item_initData, "f").onChange === 'function') {
                Item_classPrivateFieldGet(this, _Item_initData, "f").onChange({
                    target: this,
                    id: Item_classPrivateFieldGet(this, _Item_initData, "f").id,
                    value: Item_classPrivateFieldGet(this, _Item_value, "f"),
                    checked: this.checked,
                });
            }
        }
    }
    getValue() { return this.value; }
    setValue(data) {
        if (typeof data === 'string' ||
            typeof data === 'number' ||
            typeof data === 'boolean') {
            this._value = data;
        }
    }
    getData() {
        return {
            checked: this.checked,
            value: this.value,
            default: Item_classPrivateFieldGet(this, _Item_initData, "f").default,
        };
    }
    setData(data) {
        this.setValue(data.value);
        this.checked = data.checked;
    }
    reset() {
        this.setValue(Item_classPrivateFieldGet(this, _Item_initData, "f").default);
        this.checked = Boolean(Item_classPrivateFieldGet(this, _Item_initData, "f").checked);
    }
}
_Item_initData = new WeakMap(), _Item_uid = new WeakMap(), _Item_value = new WeakMap(), _Item_labalContainer = new WeakMap(), _Item_inputContainer = new WeakMap(), _Item_inputCheckbox = new WeakMap();
Item_Item.NAME = 'midconfig-item';
// customElements.define(Item.NAME, Item)
customElements.constructor.prototype.define.call(customElements, Item_Item.NAME, Item_Item);
/* harmony default export */ var Items_Item = (Item_Item);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Text.ts
var Text_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Text_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Text_inputText;

class Text extends Items_Item {
    constructor(initData, option) {
        super(initData);
        _Text_inputText.set(this, void 0);
        Text_classPrivateFieldSet(this, _Text_inputText, document.createElement('input'), "f");
        Text_classPrivateFieldGet(this, _Text_inputText, "f").type = 'text';
        Text_classPrivateFieldGet(this, _Text_inputText, "f").value = initData.default;
        Text_classPrivateFieldGet(this, _Text_inputText, "f").spellcheck = false;
        Text_classPrivateFieldGet(this, _Text_inputText, "f").setAttribute('autocorrect', 'off');
        if (typeof option?.maxlength === 'number') {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").maxLength = option.maxlength;
        }
        if (typeof option?.minlength === 'number') {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").minLength = option.minlength;
        }
        if (typeof option?.placeholder === 'string') {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").placeholder = option.placeholder;
        }
        else {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").placeholder = initData.default;
        }
        Text_classPrivateFieldGet(this, _Text_inputText, "f").addEventListener('change', () => {
            this.setValue(Text_classPrivateFieldGet(this, _Text_inputText, "f").value);
        });
        this.inputContainer.appendChild(Text_classPrivateFieldGet(this, _Text_inputText, "f"));
    }
    setValue(data) {
        if (typeof data === 'number') {
            data = data.toString();
        }
        if (typeof data === 'string') {
            data = data.trim();
            Text_classPrivateFieldGet(this, _Text_inputText, "f").value = data;
            this._value = data;
        }
    }
}
_Text_inputText = new WeakMap();
// customElements.define('midconfig-item-text', Text)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-text', Text);
/* harmony default export */ var Items_Text = ((/* unused pure expression or super */ null && (Text)));

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/CheckBox.ts

class CheckBox extends Items_Item {
    constructor(initData) {
        initData.withCheckBox = true;
        initData.checked || (initData.checked = initData.default);
        super(initData);
        this.inputContainer.remove();
    }
    get value() { return Boolean(this.inputCheckbox?.checked); }
    setValue(data) {
        if (typeof data === 'boolean' &&
            this.inputCheckbox !== null) {
            this.inputCheckbox.checked = data;
            this._value = data;
        }
    }
}
// customElements.define('midconfig-item-checkbox', CheckBox)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-checkbox', CheckBox);
/* harmony default export */ var Items_CheckBox = (CheckBox);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Color.ts
var Color_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Color_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Color_inputColor, _Color_inputText;


class Color extends Items_Item {
    constructor(initData, option) {
        super(initData);
        _Color_inputColor.set(this, void 0);
        _Color_inputText.set(this, void 0);
        initData.default = initData.default.toUpperCase();
        Color_classPrivateFieldSet(this, _Color_inputColor, document.createElement('input'), "f");
        Color_classPrivateFieldGet(this, _Color_inputColor, "f").type = 'color';
        Color_classPrivateFieldGet(this, _Color_inputColor, "f").value = initData.default;
        Color_classPrivateFieldSet(this, _Color_inputText, document.createElement('input'), "f");
        Color_classPrivateFieldGet(this, _Color_inputText, "f").type = 'text';
        Color_classPrivateFieldGet(this, _Color_inputText, "f").value = initData.default;
        Color_classPrivateFieldGet(this, _Color_inputText, "f").spellcheck = false;
        Color_classPrivateFieldGet(this, _Color_inputText, "f").setAttribute('autocorrect', 'off');
        Color_classPrivateFieldGet(this, _Color_inputText, "f").maxLength = 7;
        Color_classPrivateFieldGet(this, _Color_inputText, "f").minLength = 6;
        if (typeof option?.placeholder === 'string') {
            Color_classPrivateFieldGet(this, _Color_inputText, "f").placeholder = option.placeholder;
        }
        else {
            Color_classPrivateFieldGet(this, _Color_inputText, "f").placeholder = initData.default;
        }
        const changeHandler = ({ target }) => {
            if (target instanceof HTMLInputElement) {
                if (target.value === '') {
                    target.value = this.initData.default;
                }
                target.value = fullWidthToHalfWidth(target.value);
                this.setValue(target.value);
            }
        };
        Color_classPrivateFieldGet(this, _Color_inputColor, "f").addEventListener('change', changeHandler);
        Color_classPrivateFieldGet(this, _Color_inputText, "f").addEventListener('change', changeHandler);
        this.inputContainer.appendChild(Color_classPrivateFieldGet(this, _Color_inputColor, "f"));
        this.inputContainer.appendChild(Color_classPrivateFieldGet(this, _Color_inputText, "f"));
    }
    setValue(data) {
        if (typeof data === 'string') {
            data = data.trim().toUpperCase();
            if (!isColorCode(data)) {
                data = this.initData.default;
            }
            if (!data.startsWith('#')) {
                data = `#${data}`;
            }
            Color_classPrivateFieldGet(this, _Color_inputColor, "f").value = data;
            Color_classPrivateFieldGet(this, _Color_inputText, "f").value = data;
            this._value = data;
        }
    }
}
_Color_inputColor = new WeakMap(), _Color_inputText = new WeakMap();
// customElements.define('midconfig-item-color', Color)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-color', Color);
/* harmony default export */ var Items_Color = (Color);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Range.ts
var Range_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Range_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Range_inputRange, _Range_inputText;


class Range extends Items_Item {
    constructor(initData, option) {
        super(initData);
        _Range_inputRange.set(this, void 0);
        _Range_inputText.set(this, void 0);
        Range_classPrivateFieldSet(this, _Range_inputRange, document.createElement('input'), "f");
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").type = 'range';
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").value = initData.default.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").max = option.max.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").min = option.min.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").step = option.step.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").style.setProperty('--range-progress', `${(initData.default - option.min) / (option.max - option.min) * 100}%`);
        Range_classPrivateFieldSet(this, _Range_inputText, document.createElement('input'), "f");
        Range_classPrivateFieldGet(this, _Range_inputText, "f").type = 'text';
        Range_classPrivateFieldGet(this, _Range_inputText, "f").value = initData.default.toString();
        Range_classPrivateFieldGet(this, _Range_inputText, "f").spellcheck = false;
        Range_classPrivateFieldGet(this, _Range_inputText, "f").setAttribute('autocorrect', 'off');
        Range_classPrivateFieldGet(this, _Range_inputText, "f").maxLength = (option.max + option.step).toString().length;
        if (typeof option.placeholder === 'string') {
            Range_classPrivateFieldGet(this, _Range_inputText, "f").placeholder = option.placeholder;
        }
        else {
            Range_classPrivateFieldGet(this, _Range_inputText, "f").placeholder = initData.default.toString();
        }
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").addEventListener('input', () => {
            Range_classPrivateFieldGet(this, _Range_inputRange, "f").style.setProperty('--range-progress', `${(Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").value) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) / (Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").max) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) * 100}%`);
            Range_classPrivateFieldGet(this, _Range_inputText, "f").value = Range_classPrivateFieldGet(this, _Range_inputRange, "f").value;
        });
        const changeHandler = ({ target }) => {
            if (target instanceof HTMLInputElement) {
                if (target.value === '') {
                    target.value = this.initData.default;
                }
                target.value = fullWidthToHalfWidth(target.value);
                this.setValue(target.value);
            }
        };
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").addEventListener('change', changeHandler);
        Range_classPrivateFieldGet(this, _Range_inputText, "f").addEventListener('change', changeHandler);
        this.inputContainer.appendChild(Range_classPrivateFieldGet(this, _Range_inputRange, "f"));
        this.inputContainer.appendChild(Range_classPrivateFieldGet(this, _Range_inputText, "f"));
    }
    setValue(data) {
        if (typeof data === 'string') {
            data = Number(data);
        }
        if (Number.isNaN(data)) {
            data = this.initData.default;
        }
        if (typeof data === 'number' &&
            data <= Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").max) &&
            Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min) <= data) {
            Range_classPrivateFieldGet(this, _Range_inputRange, "f").value = data.toString();
            Range_classPrivateFieldGet(this, _Range_inputText, "f").value = data.toString();
            Range_classPrivateFieldGet(this, _Range_inputRange, "f").style.setProperty('--range-progress', `${(Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").value) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) / (Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").max) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) * 100}%`);
            this._value = data;
        }
    }
}
_Range_inputRange = new WeakMap(), _Range_inputText = new WeakMap();
// customElements.define('midconfig-item-range', Range)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-range', Range);
/* harmony default export */ var Items_Range = (Range);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Select.ts
var Select_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Select_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Select_select, _Select_options;


class Select extends Items_Item {
    constructor(initData, options) {
        super(initData);
        _Select_select.set(this, void 0);
        _Select_options.set(this, []);
        const selectContainer = document.createElement('div');
        selectContainer.classList.add('midconfig-select-container');
        Select_classPrivateFieldSet(this, _Select_select, document.createElement('select'), "f");
        for (const { text, value } of options) {
            const option = document.createElement('option');
            option.text = text;
            option.value = value;
            if (value === initData.default) {
                option.selected = true;
            }
            Select_classPrivateFieldGet(this, _Select_select, "f").appendChild(option);
            Select_classPrivateFieldGet(this, _Select_options, "f").push(option);
        }
        Select_classPrivateFieldGet(this, _Select_select, "f").addEventListener('change', () => {
            this.setValue(Select_classPrivateFieldGet(this, _Select_select, "f").value);
        });
        selectContainer.appendChild(Select_classPrivateFieldGet(this, _Select_select, "f"));
        selectContainer.insertAdjacentHTML('beforeend', SVG_ARROW_DOWN);
        this.inputContainer.appendChild(selectContainer);
    }
    setValue(data) {
        if (typeof data === 'string') {
            data = data.trim();
            const targetOption = Select_classPrivateFieldGet(this, _Select_options, "f").find(v => v.value === data);
            if (targetOption !== void 0) {
                targetOption.selected = true;
                this._value = data;
            }
        }
    }
}
_Select_select = new WeakMap(), _Select_options = new WeakMap();
// customElements.define('midconfig-item-select', Select)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-select', Select);
/* harmony default export */ var Items_Select = (Select);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Button.ts
var Button_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Button_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Button_initData, _Button_disable, _Button_labalContainer;

class Button extends HTMLElement {
    constructor(initData) {
        super();
        _Button_initData.set(this, void 0);
        _Button_disable.set(this, void 0);
        _Button_labalContainer.set(this, null);
        Button_classPrivateFieldSet(this, _Button_initData, initData, "f");
        this.disable = Boolean(initData.disable);
        this.classList.add('midconfig-item');
        this.classList.add(this.tagName.toLowerCase());
        if (typeof initData.label === 'string') {
            Button_classPrivateFieldSet(this, _Button_labalContainer, document.createElement('div'), "f");
            Button_classPrivateFieldGet(this, _Button_labalContainer, "f").classList.add('midconfig-label-container');
            const label = document.createElement('label');
            const span = document.createElement('span');
            setTextWithTitle(span, initData.label);
            label.appendChild(span);
            Button_classPrivateFieldGet(this, _Button_labalContainer, "f").appendChild(label);
            this.appendChild(Button_classPrivateFieldGet(this, _Button_labalContainer, "f"));
        }
        const button = document.createElement('div');
        button.classList.add('midconfig-button');
        button.classList.add(`midconfig-button--${initData.type}`);
        setTextWithTitle(button, initData.text);
        button.addEventListener('click', () => {
            Button_classPrivateFieldGet(this, _Button_initData, "f").onClick(Button_classPrivateFieldGet(this, _Button_initData, "f").id);
        });
        this.appendChild(button);
    }
    get initData() { return Button_classPrivateFieldGet(this, _Button_initData, "f"); }
    get disable() { return Button_classPrivateFieldGet(this, _Button_disable, "f"); }
    get labalContainer() { return Button_classPrivateFieldGet(this, _Button_labalContainer, "f"); }
    set disable(v) {
        Button_classPrivateFieldSet(this, _Button_disable, Boolean(v), "f");
        if (Button_classPrivateFieldGet(this, _Button_disable, "f")) {
            this.classList.add(`${Button.NAME}__disable`);
        }
        else {
            this.classList.remove(`${Button.NAME}__disable`);
        }
    }
}
_Button_initData = new WeakMap(), _Button_disable = new WeakMap(), _Button_labalContainer = new WeakMap();
Button.NAME = 'midconfig-button-container';
// customElements.define(Button.NAME, Button)
customElements.constructor.prototype.define.call(customElements, Button.NAME, Button);
/* harmony default export */ var Items_Button = (Button);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/ButtonEmpty.ts

class ButtonEmpty extends Items_Button {
    constructor() {
        super({
            id: '',
            text: '',
            type: 'solid',
            // disable: true,
            onClick: () => null,
        });
        this.classList.add('midconfig-button-container');
    }
}
ButtonEmpty.NAME = 'midconfig-button-empty';
// customElements.define(ButtonEmpty.NAME, ButtonEmpty)
customElements.constructor.prototype.define.call(customElements, ButtonEmpty.NAME, ButtonEmpty);
/* harmony default export */ var Items_ButtonEmpty = (ButtonEmpty);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Divider.ts
class Divider extends HTMLElement {
    constructor() {
        super();
        this.classList.add(this.tagName.toLowerCase());
    }
}
Divider.NAME = 'midconfig-divider';
// customElements.define(Divider.NAME, Divider)
customElements.constructor.prototype.define.call(customElements, Divider.NAME, Divider);
/* harmony default export */ var Items_Divider = ((/* unused pure expression or super */ null && (Divider)));

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/Group.ts
var Group_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Group_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Group_initData, _Group_isOpen;



class Group extends HTMLElement {
    constructor(initData) {
        super();
        _Group_initData.set(this, void 0);
        _Group_isOpen.set(this, void 0);
        Group_classPrivateFieldSet(this, _Group_initData, initData, "f");
        Group_classPrivateFieldSet(this, _Group_isOpen, Boolean(initData.isAccordionOpen), "f");
        this.classList.add(Group.NAME);
        // ヘッダー
        const header = document.createElement('div');
        header.classList.add(`${Group.NAME}-header`);
        const span = document.createElement('span');
        setTextWithTitle(span, initData.label);
        header.appendChild(span);
        // アイテム
        const items = document.createElement('div');
        items.classList.add(`${Group.NAME}-items`);
        for (const item of initData.items) {
            items.appendChild(item);
        }
        if (initData.isAccordion) {
            this.classList.add('midconfig-accordion');
            if (!Group_classPrivateFieldGet(this, _Group_isOpen, "f")) {
                this.classList.add('midconfig-accordion__close');
            }
            header.insertAdjacentHTML('beforeend', SVG_ARROW_DOWN);
            header.addEventListener('click', () => Group_classPrivateFieldGet(this, _Group_isOpen, "f") ? this.close() : this.open());
        }
        this.appendChild(header);
        this.appendChild(items);
    }
    get initData() { return Group_classPrivateFieldGet(this, _Group_initData, "f"); }
    get isOpen() { return Group_classPrivateFieldGet(this, _Group_isOpen, "f"); }
    open() {
        Group_classPrivateFieldSet(this, _Group_isOpen, true, "f");
        this.classList.remove('midconfig-accordion__close');
    }
    close() {
        Group_classPrivateFieldSet(this, _Group_isOpen, false, "f");
        this.classList.add('midconfig-accordion__close');
    }
    getData() {
        const data = {};
        Group_classPrivateFieldGet(this, _Group_initData, "f").items.forEach(item => {
            if (item instanceof Items_Item) {
                data[item.initData.id] = item.getData();
            }
        });
        return data;
    }
    setData(values) {
        Object.keys(values).forEach(id => {
            Group_classPrivateFieldGet(this, _Group_initData, "f").items.forEach(item => {
                if (item instanceof Items_Item &&
                    item.initData.id === id) {
                    item.setData(values[id]);
                }
            });
        });
    }
    reset() {
        Group_classPrivateFieldGet(this, _Group_initData, "f").items.forEach(v => v instanceof Items_Item && v.reset());
    }
}
_Group_initData = new WeakMap(), _Group_isOpen = new WeakMap();
Group.NAME = 'midconfig-group';
// customElements.define(Group.NAME, Group)
customElements.constructor.prototype.define.call(customElements, Group.NAME, Group);
/* harmony default export */ var Items_Group = (Group);

;// CONCATENATED MODULE: ../../Library/MidConfig/src/Items/index.ts


// import TextArea from './TextArea'










;// CONCATENATED MODULE: ../../Library/MidConfig/src/index.ts
var src_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var src_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Panel_initData, _Panel_shadowInner, _Panel_tab, _Panel_main, _Panel_bottom;




class Panel extends HTMLElement {
    constructor(initData, isDev) {
        super();
        _Panel_initData.set(this, void 0);
        _Panel_shadowInner.set(this, null);
        _Panel_tab.set(this, void 0);
        _Panel_main.set(this, void 0);
        _Panel_bottom.set(this, void 0);
        src_classPrivateFieldSet(this, _Panel_initData, initData, "f");
        this.classList.add(Panel.NAME);
        src_classPrivateFieldSet(this, _Panel_tab, document.createElement('div'), "f");
        src_classPrivateFieldGet(this, _Panel_tab, "f").classList.add('midconfig-tab');
        src_classPrivateFieldSet(this, _Panel_main, document.createElement('div'), "f");
        src_classPrivateFieldGet(this, _Panel_main, "f").classList.add('midconfig-main');
        src_classPrivateFieldSet(this, _Panel_bottom, document.createElement('div'), "f");
        src_classPrivateFieldGet(this, _Panel_bottom, "f").classList.add('midconfig-bottom');
        initData.tabs.forEach((tab, idx) => {
            const tabItem = document.createElement('div');
            tabItem.classList.add('midconfig-tab-item');
            setTextWithTitle(tabItem, tab.label);
            const pageItem = document.createElement('div');
            pageItem.classList.add('midconfig-page-item');
            tab.child.forEach(item => pageItem.appendChild(item));
            if (idx === 0) {
                tabItem.classList.add('midconfig-tab-item__selected');
                pageItem.classList.add('midconfig-page-item__selected');
            }
            tabItem.addEventListener('click', () => {
                Array.from(src_classPrivateFieldGet(this, _Panel_tab, "f").children).forEach(item => {
                    item.classList.remove('midconfig-tab-item__selected');
                });
                tabItem.classList.add('midconfig-tab-item__selected');
                Array.from(src_classPrivateFieldGet(this, _Panel_main, "f").children).forEach(page => {
                    page.classList.remove('midconfig-page-item__selected');
                });
                pageItem.classList.add('midconfig-page-item__selected');
            });
            src_classPrivateFieldGet(this, _Panel_tab, "f").appendChild(tabItem);
            src_classPrivateFieldGet(this, _Panel_main, "f").appendChild(pageItem);
        });
        initData.buttons.forEach(button => {
            delete button.initData.label;
            button.labalContainer?.remove();
            src_classPrivateFieldGet(this, _Panel_bottom, "f").appendChild(button);
        });
        if (!Boolean(isDev)) {
            src_classPrivateFieldSet(this, _Panel_shadowInner, document.createElement('div'), "f");
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").id = 'midconfig';
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").appendChild(src_classPrivateFieldGet(this, _Panel_tab, "f"));
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").appendChild(src_classPrivateFieldGet(this, _Panel_main, "f"));
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").appendChild(src_classPrivateFieldGet(this, _Panel_bottom, "f"));
            const shadow = this.attachShadow({ mode: 'closed' });
            shadow.appendChild(src_classPrivateFieldGet(this, _Panel_shadowInner, "f"));
            const style = document.createElement('style');
            style.textContent = STYLE;
            shadow.appendChild(style);
        }
        else {
            this.id = 'midconfig';
            this.appendChild(src_classPrivateFieldGet(this, _Panel_tab, "f"));
            this.appendChild(src_classPrivateFieldGet(this, _Panel_main, "f"));
            this.appendChild(src_classPrivateFieldGet(this, _Panel_bottom, "f"));
        }
        this.style.display = isDev ? 'flex' : 'block';
        this.setTheme(initData.theme);
        this.load();
    }
    get initData() { return src_classPrivateFieldGet(this, _Panel_initData, "f"); }
    get key() { return `midconfig-${src_classPrivateFieldGet(this, _Panel_initData, "f").id}`; }
    getJSON() {
        const json = {
            version: src_classPrivateFieldGet(this, _Panel_initData, "f").version,
            data: {},
        };
        src_classPrivateFieldGet(this, _Panel_initData, "f").tabs.forEach(tab => {
            var _a, _b;
            (_a = json.data)[_b = tab.id] || (_a[_b] = {});
            tab.child.forEach(item => {
                if (item instanceof Items_Item ||
                    item instanceof Items_Group) {
                    json.data[tab.id][item.initData.id] = item.getData();
                }
            });
        });
        return json;
    }
    setJSON(json) {
        if (!isConfigJsonData(json)) {
            return false;
        }
        try {
            Object.keys(json.data).forEach(tabId => {
                const targetTab = src_classPrivateFieldGet(this, _Panel_initData, "f").tabs.filter(v => v.id === tabId);
                targetTab.forEach(tab => {
                    Object.keys(json.data[tabId]).forEach(itemId => {
                        const data = json.data[tabId][itemId];
                        const targetItem = tab.child.filter(item => {
                            if (item instanceof Items_Item ||
                                item instanceof Items_Group) {
                                return item.initData.id === itemId;
                            }
                        });
                        targetItem.forEach(item => {
                            if (isConfigItemData(data)) {
                                if (item instanceof Items_Item) {
                                    item.setData(data);
                                }
                            }
                            else {
                                if (item instanceof Items_Group) {
                                    item.setData(data);
                                }
                            }
                        });
                    });
                });
            });
            return true;
        }
        catch (e) {
            console.error(e);
        }
        return false;
    }
    save() {
        try {
            const value = JSON.stringify(this.getJSON());
            Panel.setValue(this.key, value);
        }
        catch (e) {
            console.error(e);
        }
    }
    load() {
        try {
            const value = Panel.getValue(this.key);
            if (typeof value === 'string') {
                this.setJSON(JSON.parse(value));
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    reset() {
        src_classPrivateFieldGet(this, _Panel_initData, "f").tabs.forEach(tab => {
            tab.child.forEach(item => {
                if (item instanceof Items_Item ||
                    item instanceof Items_Group) {
                    item.reset();
                }
            });
        });
        Panel.deleteValue(this.key);
    }
    export() {
        const value = JSON.stringify(this.getJSON());
        window.prompt('エクスポート', value);
    }
    setTheme(theme = 'auto') {
        if (['auto', 'light', 'dark'].includes(theme)) {
            (src_classPrivateFieldGet(this, _Panel_shadowInner, "f") || this).setAttribute('theme', theme);
        }
    }
    static getValue(key) {
        let result;
        let GMGetValue = null;
        try {
            // @ts-ignore
            GMGetValue || (GMGetValue = GM_getValue);
        }
        catch { }
        try {
            // @ts-ignore
            GMGetValue || (GMGetValue = GM && GM.getValue);
        }
        catch { }
        try {
            if (typeof GMGetValue === 'function') {
                result = GMGetValue(key);
            }
            else {
                result = window.localStorage.getItem(key);
            }
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
    static setValue(key, value) {
        let GMSetValue = null;
        try {
            // @ts-ignore
            GMSetValue || (GMSetValue = GM_setValue);
        }
        catch { }
        try {
            // @ts-ignore
            GMSetValue || (GMSetValue = GM && GM.setValue);
        }
        catch { }
        try {
            if (typeof GMSetValue === 'function') {
                GMSetValue(key, value);
            }
            else {
                window.localStorage.setItem(key, value);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    static deleteValue(key) {
        let GMDeleteValue = null;
        try {
            // @ts-ignore
            GMDeleteValue || (GMDeleteValue = GM_deleteValue);
        }
        catch { }
        try {
            // @ts-ignore
            GMDeleteValue || (GMDeleteValue = GM && GM.deleteValue);
        }
        catch { }
        try {
            if (typeof GMDeleteValue === 'function') {
                GMDeleteValue(key);
            }
            else {
                window.localStorage.removeItem(key);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
_Panel_initData = new WeakMap(), _Panel_shadowInner = new WeakMap(), _Panel_tab = new WeakMap(), _Panel_main = new WeakMap(), _Panel_bottom = new WeakMap();
Panel.NAME = 'midconfig-panel';
// customElements.define(Panel.NAME, Panel)
customElements.constructor.prototype.define.call(customElements, Panel.NAME, Panel);


;// CONCATENATED MODULE: ./src/config.ts



/****************************************
 * コメント設定のテンプレート
 */
const commentConfigTemplate = (options) => {
    options = {
        ...{
            color: '#FFFFFF',
            fontScale: 100,
            fontWeight: '600',
            shadowColor: '#000000',
            opacity: 100,
        },
        ...options,
    };
    return [
        new Items_Color({
            id: 'color',
            label: '色 (Hex)',
            default: options.color,
            withCheckBox: true,
        }),
        new Items_Range({
            id: 'fontScale',
            label: 'サイズ (%)',
            default: options.fontScale,
            withCheckBox: true,
        }, {
            max: 150,
            min: 50,
            step: 10,
        }),
        new Items_Select({
            id: 'fontWeight',
            label: '太さ',
            default: options.fontWeight,
            withCheckBox: true,
        }, [
            { text: '太い', value: '800' },
            { text: '普通', value: '600' },
            { text: '細い', value: '400' },
        ]),
        new Items_Color({
            id: 'shadowColor',
            label: '影の色 (Hex)',
            default: options.shadowColor,
            withCheckBox: true,
        }),
        new Items_Range({
            id: 'opacity',
            label: '不透明度 (%)',
            default: options.opacity,
            withCheckBox: true,
        }, {
            max: 100,
            min: 10,
            step: 10,
        }),
    ];
};
/****************************************
 * MidConfigの初期化
 */
const useConfig = (configData, handlers) => {
    const config = new Panel({
        id: 'flowcomments-for-youtube',
        version: 1,
        theme: document.documentElement.getAttribute('dark') !== null ? 'dark' : 'light',
        tabs: [
            {
                id: 'general',
                label: '全般',
                child: [
                    new Items_Select({
                        id: 'resolution',
                        label: '解像度',
                        default: 'auto',
                    }, [
                        { text: '自動', value: 'auto' },
                        { text: '1080p', value: 'r_1080' },
                        { text: '720p', value: 'r_720' },
                        { text: '480p', value: 'r_480' },
                        { text: '360p', value: 'r_360' },
                    ]),
                    new Items_Range({
                        id: 'line',
                        label: '行数',
                        default: 11,
                    }, {
                        max: 50,
                        min: 1,
                        step: 1,
                    }),
                    new Items_CheckBox({
                        id: 'smoothRender',
                        label: 'カクつきを抑える (高負荷)',
                        default: false,
                    }),
                ],
            },
            {
                id: 'comments',
                label: 'コメント',
                child: [
                    new Items_Group({
                        id: 'default',
                        label: 'デフォルト',
                        isAccordion: true,
                        items: commentConfigTemplate({ color: COLOR.USER }),
                    }),
                    new Items_Group({
                        id: 'member',
                        label: 'メンバー',
                        isAccordion: true,
                        items: commentConfigTemplate({ color: COLOR.MEMBER }),
                    }),
                    new Items_Group({
                        id: 'moderator',
                        label: 'モデレーター',
                        isAccordion: true,
                        items: commentConfigTemplate({ color: COLOR.MODERATOR }),
                    }),
                    new Items_Group({
                        id: 'owner',
                        label: 'チャンネル',
                        isAccordion: true,
                        items: commentConfigTemplate({ color: COLOR.OWNER }),
                    }),
                ],
            },
            {
                id: 'filter',
                label: 'フィルタ',
                child: [
                    new Items_Group({
                        id: 'comments',
                        label: '表示するコメント',
                        isAccordion: true,
                        items: [
                            new Items_CheckBox({
                                id: 'normal',
                                label: '通常',
                                default: true,
                            }),
                            new Items_CheckBox({
                                id: 'member',
                                label: 'メンバー',
                                default: true,
                            }),
                            new Items_CheckBox({
                                id: 'moderator',
                                label: 'モデレーター',
                                default: true,
                            }),
                            new Items_CheckBox({
                                id: 'owner',
                                label: 'チャンネル',
                                default: true,
                            }),
                            new Items_CheckBox({
                                id: 'paid',
                                label: 'スーパーチャット',
                                default: true,
                            }),
                        ],
                    }),
                    // new MidConfig.Items.CheckBox({
                    //   id: 'japaneseOnly',
                    //   label: '日本語のコメントのみ (Beta)',
                    //   default: false,
                    // }),
                ],
            },
            {
                id: 'other',
                label: 'その他',
                child: [
                    new Items_Button({
                        id: 'import',
                        type: 'solid',
                        label: '設定をインポートする',
                        text: 'インポート',
                        onClick: () => {
                            const value = window.prompt('インポート');
                            if (value) {
                                let result = false;
                                try {
                                    result = config.setJSON(JSON.parse(value));
                                }
                                catch (e) {
                                    console.error(e);
                                }
                                window.alert(result ? 'インポートしました' : 'インポートに失敗しました');
                            }
                        },
                    }),
                    new Items_Button({
                        id: 'export',
                        type: 'solid',
                        label: '設定をエクスポートする',
                        text: 'エクスポート',
                        onClick: () => {
                            window.prompt('エクスポート', JSON.stringify(config.getJSON()));
                        },
                    }),
                    new Items_Button({
                        id: 'reset',
                        type: 'outline-red',
                        label: '設定をリセットする',
                        text: 'リセット',
                        onClick: () => {
                            if (window.confirm('リセットしますか？')) {
                                config.reset();
                                configData.old = configData.now = config.getJSON();
                                if (typeof handlers?.onApply === 'function') {
                                    handlers.onApply();
                                }
                            }
                        },
                    }),
                ],
            },
        ],
        buttons: [
            new Items_Button({
                id: 'cancel',
                text: 'キャンセル',
                type: 'solid',
                onClick: () => {
                    if (typeof handlers?.onCancel === 'function') {
                        handlers.onCancel();
                    }
                },
            }),
            new Items_ButtonEmpty(),
            new Items_Button({
                id: 'apply',
                text: '適用',
                type: 'fill-alpha',
                onClick: () => {
                    configData.now = config.getJSON();
                    if (typeof handlers?.onApply === 'function') {
                        handlers.onApply();
                    }
                },
            }),
            new Items_Button({
                id: 'save',
                text: '保存',
                type: 'fill',
                onClick: () => {
                    config.save();
                    configData.now = config.getJSON();
                    if (typeof handlers?.onSave === 'function') {
                        handlers.onSave();
                    }
                },
            }),
        ],
    });
    return config;
};
const getFlowCommentsOption = ({ data }) => {
    const option = {};
    const resolution = data['general']['resolution'];
    if (isConfigItemData(resolution)) {
        if (resolution.value === 'auto') {
            option.autoResolution = true;
            option.resolution = void 0;
        }
        else {
            option.autoResolution = false;
            option.resolution = {
                'r_1080': 1080,
                'r_720': 720,
                'r_480': 480,
                'r_360': 360,
            }[resolution.value];
        }
    }
    const line = data['general']['line'];
    if (isConfigItemData(line)) {
        option.lines = line.value;
    }
    const smoothRender = data['general']['smoothRender'];
    if (isConfigItemData(smoothRender)) {
        option.smoothRender = smoothRender.value;
    }
    return option;
};
const getFlowCommentsStyle = ({ data }, name = 'default') => {
    const style = {};
    const configComment = data['comments'][name];
    if (!isConfigItemData(configComment)) {
        if (configComment['color'].checked) {
            style.color = configComment['color'].value;
        }
        else if (name === 'default') {
            style.color = configComment['color'].default;
        }
        if (configComment['fontScale'].checked) {
            style.fontScale = configComment['fontScale'].value * 0.01;
        }
        else if (name === 'default') {
            style.fontScale = configComment['fontScale'].default * 0.01;
        }
        if (configComment['fontWeight'].checked) {
            style.fontWeight = configComment['fontWeight'].value;
        }
        else if (name === 'default') {
            style.fontWeight = configComment['fontWeight'].default;
        }
        if (configComment['shadowColor'].checked) {
            style.shadowColor = configComment['shadowColor'].value;
        }
        else if (name === 'default') {
            style.shadowColor = configComment['shadowColor'].default;
        }
        if (configComment['opacity'].checked) {
            style.opacity = configComment['opacity'].value * 0.01;
        }
        else if (name === 'default') {
            style.opacity = configComment['opacity'].default * 0.01;
        }
    }
    return style;
};
const getFilterComments = ({ data }) => {
    const result = {
        normal: true,
        member: true,
        moderator: true,
        owner: true,
        paid: true,
    };
    const configFilterComments = data['filter']['comments'];
    if (!isConfigItemData(configFilterComments)) {
        result.normal = configFilterComments['normal'].value;
        result.member = configFilterComments['member'].value;
        result.moderator = configFilterComments['moderator'].value;
        result.owner = configFilterComments['owner'].value;
        result.paid = configFilterComments['paid'].value;
    }
    return result;
};

;// CONCATENATED MODULE: ./src/index.ts





//----------------------------------------
// iframe（チャット欄）
//----------------------------------------
if (window !== window.parent) {
    /** 除外するセレクター */
    const exSelector = [
        '#pinned-message',
        '#docked-item',
        '#live-chat-banner',
        '#panel-pages',
        '.yt-live-chat-docked-message',
    ].join();
    /****************************************
     * 監視
     */
    const obs = new MutationObserver(mutationRecord => {
        const data = mutationRecord.map(({ target }) => {
            if (!(target instanceof HTMLElement) ||
                target.closest(exSelector) !== null
            // target.classList.contains('mid-yt-notjp')
            )
                return;
            const type = getChatTypeFromTagName(target.tagName.toLowerCase());
            if (type === null)
                return;
            const extData = extractChatData(target);
            return {
                type: type,
                data: extData,
            };
        }).filter(Boolean);
        // iframeの親Windowにコメントを送信
        if (0 < data.length) {
            window.parent.postMessage({
                mid_chat_data: data
            });
        }
    });
    obs.observe(document.body, { childList: true, subtree: true });
}
//----------------------------------------
// 通常のページ
//----------------------------------------
else {
    let fc = null;
    const configData = {
        old: null,
        now: null,
    };
    const config = useConfig(configData, {
        // キャンセル
        onCancel: () => {
            if (configData.now !== configData.old) {
                configData.now = configData.old;
            }
            if (configData.now !== null) {
                config.setJSON(configData.now);
                fc?.changeOption(getFlowCommentsOption(configData.now));
                fc?.changeStyle(getFlowCommentsStyle(configData.now));
            }
            config.remove();
        },
        // 適用
        onApply: () => {
            if (configData.now !== null) {
                fc?.changeOption(getFlowCommentsOption(configData.now));
                fc?.changeStyle(getFlowCommentsStyle(configData.now));
            }
        },
        // 保存
        onSave: () => {
            if (configData.old !== configData.now) {
                configData.old = configData.now;
            }
            if (configData.now !== null) {
                fc?.changeOption(getFlowCommentsOption(configData.now));
                fc?.changeStyle(getFlowCommentsStyle(configData.now));
            }
            config.remove();
        }
    });
    configData.old = configData.now = config.getJSON();
    // @ts-ignore
    if (typeof GM_registerMenuCommand === 'function') {
        // @ts-ignore
        GM_registerMenuCommand('設定', () => {
            document.body.appendChild(config);
        });
    }
    //----------------------------------------
    // iframe(チャット)からコメントを受け取ったとき
    //----------------------------------------
    window.addEventListener('message', ({ data }) => {
        if (data.mid_chat_data !== void 0) {
            const mid_chat_data = data.mid_chat_data;
            //----------------------------------------
            // コメントエリアを追加
            //----------------------------------------
            if (fc === null) {
                const ytdPlayer = document.getElementById('ytd-player');
                const flowComments = ytdPlayer?.getElementsByClassName(CONFIG.CANVAS_CLASSNAME)[0];
                const videoContainer = ytdPlayer?.getElementsByClassName('html5-video-container')[0];
                if (flowComments === void 0 &&
                    videoContainer instanceof HTMLElement) {
                    fc = new Main();
                    if (configData.now !== null) {
                        fc.changeOption(getFlowCommentsOption(configData.now));
                        fc.changeStyle(getFlowCommentsStyle(configData.now));
                    }
                    videoContainer.insertAdjacentElement('afterend', fc.canvas);
                }
            }
            //----------------------------------------
            // コメントを流す
            //----------------------------------------
            if (fc?.isStarted &&
                mid_chat_data.length < 10) {
                const filterComments = getFilterComments(configData.now);
                const flowCommentsStyles = {
                    member: getFlowCommentsStyle(configData.now, 'member'),
                    moderator: getFlowCommentsStyle(configData.now, 'moderator'),
                    owner: getFlowCommentsStyle(configData.now, 'owner'),
                };
                mid_chat_data.forEach(({ type, data }) => {
                    if (
                    // 通常
                    ((type === CHAT_TYPE.TEXT && data.author.type === AUTHOR_TYPE.USER) &&
                        !filterComments.normal) ||
                        // スーパーチャット
                        ((type === CHAT_TYPE.PAID || type === CHAT_TYPE.PAID_STICKER) &&
                            !filterComments.paid) ||
                        // メンバー
                        (data.author.type === AUTHOR_TYPE.MEMBER &&
                            !filterComments.member) ||
                        // モデレーター
                        (data.author.type === AUTHOR_TYPE.MODERATOR &&
                            !filterComments.moderator) ||
                        // チャンネル
                        (data.author.type === AUTHOR_TYPE.OWNER &&
                            !filterComments.owner))
                        return;
                    const content = [];
                    let style = {};
                    //----------------------------------------
                    // コメントのスタイルを指定
                    //----------------------------------------
                    // スーパーチャット
                    if (type === CHAT_TYPE.PAID ||
                        type === CHAT_TYPE.PAID_STICKER) {
                        style.color = data.paid.color || void 0;
                    }
                    // メンバーシップ
                    else if (type === CHAT_TYPE.MEMBERSHIP) {
                        style = flowCommentsStyles.member;
                        if (style.color === void 0) {
                            style.color = COLOR.MEMBER;
                        }
                    }
                    // メンバー
                    else if (data.author.type === AUTHOR_TYPE.MEMBER) {
                        style = flowCommentsStyles.member;
                        if (style.color === void 0) {
                            style.color = COLOR.MEMBER;
                        }
                    }
                    // モデレーター
                    else if (data.author.type === AUTHOR_TYPE.MODERATOR) {
                        style = flowCommentsStyles.moderator;
                        if (style.color === void 0) {
                            style.color = COLOR.MODERATOR;
                        }
                    }
                    // オーナー
                    else if (data.author.type === AUTHOR_TYPE.OWNER) {
                        style = flowCommentsStyles.owner;
                        if (style.color === void 0) {
                            style.color = COLOR.OWNER;
                        }
                    }
                    //----------------------------------------
                    // コメントの先頭につけるやつ
                    //----------------------------------------
                    // スーパーチャット
                    if ((type === CHAT_TYPE.PAID ||
                        type === CHAT_TYPE.PAID_STICKER) && (data.author.name !== null &&
                        data.paid.purchase !== null)) {
                        content.push(`${data.author.name} [${data.paid.purchase}]`);
                    }
                    // モデレーター
                    else if (data.author.type === AUTHOR_TYPE.MODERATOR &&
                        data.author.name !== null) {
                        content.push(data.author.name || '');
                    }
                    //----------------------------------------
                    // コメント本文を追加
                    //----------------------------------------
                    if (0 < data.items.length &&
                        (type === CHAT_TYPE.TEXT ||
                            type === CHAT_TYPE.MEMBERSHIP)) {
                        if (0 < content.length) {
                            content.push(': ');
                        }
                        // 本文
                        data.items.forEach(item => {
                            if (item.type === 'text' &&
                                item.text !== null) {
                                content.push(item.text);
                            }
                            else if (item.type === 'image' &&
                                item.src !== null) {
                                content.push(new image_Image(item.src));
                            }
                        });
                    }
                    //----------------------------------------
                    // コメントを流す
                    //----------------------------------------
                    fc?.pushComment(new Item(data.id || Symbol(), content, void 0, style));
                });
            }
            else {
                fc?.start();
            }
        }
    });
    //----------------------------------------
    // YouTube内でページが切り替わった時のなんか
    //----------------------------------------
    window.addEventListener('yt-page-data-updated', () => {
        fc?.dispose();
        fc = null;
    });
    //----------------------------------------
    // コンテキストメニューに設定ボタンを追加
    //----------------------------------------
    const obs_menu = new MutationObserver(mutationRecord => {
        for (const { addedNodes } of mutationRecord) {
            for (const added of addedNodes) {
                if (!(added instanceof HTMLElement) ||
                    !added.classList.contains('ytp-popup') ||
                    !added.classList.contains('ytp-contextmenu') ||
                    added.getElementsByClassName('ytp-menuitem-midconfig').length !== 0)
                    continue;
                const panelMenu = added.getElementsByClassName('ytp-panel-menu')[0];
                const menuItem = panelMenu?.lastElementChild?.cloneNode(true);
                if (menuItem instanceof HTMLElement) {
                    menuItem.classList.add('ytp-menuitem-midconfig');
                    const icon = menuItem.getElementsByClassName('ytp-menuitem-icon')[0];
                    if (icon instanceof HTMLElement) {
                        icon.innerHTML = SVG_SETTING;
                    }
                    const label = menuItem.getElementsByClassName('ytp-menuitem-label')[0];
                    if (label instanceof HTMLElement) {
                        label.textContent = 'YouTubeライブ コメント流し 設定';
                    }
                    const content = menuItem.getElementsByClassName('ytp-menuitem-content')[0];
                    if (content instanceof HTMLElement) {
                        content.innerHTML = '';
                    }
                    menuItem.addEventListener('click', () => {
                        document.body.appendChild(config);
                        config.click();
                    });
                    panelMenu.appendChild(menuItem);
                    if (added.firstElementChild instanceof HTMLElement) {
                        added.style.height = `${added.firstElementChild.scrollHeight}px`;
                        added.firstElementChild.style.height = `${added.firstElementChild.scrollHeight}px`;
                    }
                }
            }
        }
    });
    obs_menu.observe(document.body, { childList: true, subtree: true });
    //----------------------------------------
    // CSS
    //----------------------------------------
    const style = `
.${CONFIG.CANVAS_CLASSNAME} {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 11;
  pointer-events: none;
}
.midconfig-panel {
  position: fixed;
  bottom: 18px;
  right: 18px;
  width: ${500}px;
  height: ${500 * (3 / 4)}px;
  z-index: 9999;
}
`;
    document.head.insertAdjacentHTML('beforeend', `<style id="${CONFIG.CANVAS_CLASSNAME}-style">${style}</style>`);
}

/******/ })()
;