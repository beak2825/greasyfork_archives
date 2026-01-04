// ==UserScript==
// @name         FlowComments
// @namespace    https://midra.me
// @version      1.0.6
// @description  コメントを流すやつ
// @author       Midra
// @license      MIT
// @grant        none
// @compatible   chrome >= 84
// @compatible   safari >= 15
// @compatible   firefox >= 90
// ==/UserScript==

// @ts-check

'use strict'

/**
 * `FlowComments`のスタイル
 * @typedef  {object} FlowCommentsStyle
 * @property {string} [fontFamily]  フォント
 * @property {string} [fontWeight]  フォントの太さ
 * @property {number} [fontScale]   拡大率
 * @property {string} [color]       フォントカラー
 * @property {string} [shadowColor] シャドウの色
 * @property {number} [shadowBlur]  シャドウのぼかし
 * @property {number} [opacity]     透明度
 */

/**
 * `FlowCommentsItem`のオプション
 * @typedef  {object} FlowCommentsItemOption
 * @property {number} [position] 表示位置
 * @property {number} [duration] 表示時間
 */

/**
 * `FlowComments`のオプション
 * @typedef  {object}  FlowCommentsOption
 * @property {number}  [resolution]     解像度
 * @property {number}  [lines]          行数
 * @property {number}  [limit]          画面内に表示するコメントの最大数
 * @property {boolean} [autoResize]     サイズ(比率)を自動で調整
 * @property {boolean} [autoResolution] 解像度を自動で調整
 * @property {boolean} [smoothRender]   カクつきを抑える（負荷高いかも）
 */

/****************************************
 * デフォルト値
 */
const FLOWCMT_CONFIG = Object.freeze({
  /** フォントファミリー */
  FONT_FAMILY: [
    'Arial',
    '"ヒラギノ角ゴシック"', '"Hiragino Sans"',
    '"游ゴシック体"', 'YuGothic', '"游ゴシック"', '"Yu Gothic"',
    'Gulim', '"Malgun Gothic"',
    '"黑体"', 'SimHei',
    'system-ui', '-apple-system',
    'sans-serif',
  ].join(),

  /** フォントの太さ */
  FONT_WEIGHT: /Android/.test(window.navigator.userAgent) ? '700' : '600',

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
})

/****************************************
 * コメントの種類
 */
const FLOWCMT_TYPE = Object.freeze({
  // 流す
  FLOW: 0,
  // 上部に固定
  TOP: 1,
  // 下部に固定
  BOTTOM: 2,
})

/****************************************
 * @type {FlowCommentsItemOption}
 */
const FLOWCMTITEM_DEFAULT_OPTION = Object.freeze({
  position: FLOWCMT_TYPE.FLOW,
  duration: FLOWCMT_CONFIG.CMT_DISPLAY_DURATION,
})

/****************************************
 * @type {FlowCommentsOption}
 */
const FLOWCMT_DEFAULT_OPTION = Object.freeze({
  resolution: FLOWCMT_CONFIG.CANVAS_RESOLUTION,
  lines: FLOWCMT_CONFIG.LINES,
  limit: FLOWCMT_CONFIG.CMT_LIMIT,
  autoResize: FLOWCMT_CONFIG.AUTO_RESIZE,
  autoResolution: FLOWCMT_CONFIG.AUTO_RESOLUTION,
  smoothRender: false,
})

/****************************************
 * @type {FlowCommentsStyle}
 */
const FLOWCMT_DEFAULT_STYLE = Object.freeze({
  fontFamily: FLOWCMT_CONFIG.FONT_FAMILY,
  fontWeight: FLOWCMT_CONFIG.FONT_WEIGHT,
  fontScale: 1,
  color: FLOWCMT_CONFIG.TEXT_COLOR,
  shadowColor: FLOWCMT_CONFIG.TEXT_SHADOW_COLOR,
  shadowBlur: FLOWCMT_CONFIG.TEXT_SHADOW_BLUR,
  opacity: 1,
})

/****************************************
 * @classdesc ユーティリティ
 */
class FlowCommentsUtil {
  /****************************************
   * オブジェクトのプロパティからnullとundefinedを除去
   * @param {object} obj オブジェクト
   */
  static filterObject(obj) {
    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== undefined && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key]
        } else {
          this.filterObject(obj[key])
        }
      })
    }
  }

  /****************************************
   * Canvasにスタイルを適用
   * @param {CanvasRenderingContext2D} ctx        CanvasRenderingContext2D
   * @param {FlowCommentsStyle}        style      スタイル
   * @param {number}                   resolution 解像度
   * @param {number}                   fontSize   フォントサイズ
   */
  static setStyleToCanvas(ctx, style, resolution, fontSize) {
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    ctx.font = `${style.fontWeight} ${fontSize * style.fontScale}px ${style.fontFamily}`
    ctx.fillStyle = style.color
    ctx.shadowColor = style.shadowColor
    ctx.shadowBlur = resolution / 400 * style.shadowBlur
    ctx.globalAlpha = style.opacity
  }
}

/****************************************
 * @classdesc 画像キャッシュ管理用
 */
class FlowCommentsImageCache {
  /**
   * オプション（デフォルト値）
   */
  static #OPTION = {
    maxSize: 50,
  }
  /**
   * キャッシュ
   * @type {{ [url: string]: { img: HTMLImageElement; lastUsed: number; }; }}
   */
  static #cache = {}

  /****************************************
   * キャッシュ追加
   * @param {string}           url URL
   * @param {HTMLImageElement} img 画像
   */
  static add(url, img) {
    // 削除
    if (this.#OPTION.maxSize < Object.keys(this.#cache).length) {
      let delCacheUrl
      Object.keys(this.#cache).forEach(key => {
        if (
          delCacheUrl === undefined ||
          this.#cache[key].lastUsed < this.#cache[delCacheUrl].lastUsed
        ) {
          delCacheUrl = key
        }
      })
      this.dispose(delCacheUrl)
    }

    // 追加
    this.#cache[url] = {
      img: img,
      lastUsed: Date.now(),
    }
  }

  /****************************************
   * 画像が存在するか
   * @param {string} url URL
   */
  static has(url) {
    return this.#cache.hasOwnProperty(url)
  }

  /****************************************
   * 画像を取得
   * @param {string} url URL
   * @returns {Promise<HTMLImageElement>} 画像
   */
  static async get(url) {
    return new Promise(async (resolve, reject) => {
      if (this.has(url)) {
        this.#cache[url].lastUsed = Date.now()
        resolve(this.#cache[url].img)
      } else {
        try {
          let img = new Image()
          img.addEventListener('load', ({ target }) => {
            if (target instanceof HTMLImageElement) {
              this.add(target.src, target)
              resolve(this.#cache[target.src].img)
            } else {
              reject()
            }
          })
          img.addEventListener('error', reject)
          img.src = url
          img = null
        } catch (e) {
          reject(e)
        }
      }
    })
  }

  /****************************************
   * 画像を解放
   * @param {string} url URL
   */
  static dispose(url) {
    if (this.has(url)) {
      this.#cache[url].img.remove()
      delete this.#cache[url]
    }
  }
}

/****************************************
 * @classdesc `FlowCommentsItem`用の画像クラス
 */
class FlowCommentsImage {
  /**
   * URL
   * @type {string}
   */
  #url
  /**
   * 代替テキスト
   * @type {string}
   */
  #alt

  /****************************************
   * コンストラクタ
   * @param {string} url   URL
   * @param {string} [alt] 代替テキスト
   */
  constructor(url, alt) {
    this.#url = url
    this.#alt = alt
  }

  get url() { return this.#url }
  get alt() { return this.#alt }

  /****************************************
   * 画像を取得
   * @returns {Promise<HTMLImageElement | string>}
   */
  async get() {
    try {
      return (await FlowCommentsImageCache.get(this.#url))
    } catch (e) {
      return this.#alt
    }
  }
}

/****************************************
 * @classdesc 流すコメント
 * @example
 * // idを指定する場合
 * const fcItem1 = new FlowCommentsItem('1518633760656605184', 'ｳﾙﾄﾗｿｳｯ')
 * // idを指定しない場合
 * const fcItem2 = new FlowCommentsItem(Symbol(), 'みどらんかわいい！')
 */
class FlowCommentsItem {
  /**
   * コメントID
   * @type {string | number | symbol}
   */
  #id
  /**
   * コメント本文
   * @type {Array<string | FlowCommentsImage>}
   */
  #content
  /**
   * オプション
   * @type {FlowCommentsItemOption}
   */
  #option
  /**
   * スタイル
   * @type {FlowCommentsStyle}
   */
  #style
  /**
   * 実際の表示時間
   * @type {number}
   */
  #actualDuration
  /**
   * コメント単体を描画したCanvas
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * 座標
   * @type {{ x: number; y: number; xp: number; offsetY: number; }}
   */
  position = {
    x: 0,
    y: 0,
    xp: 0,
    offsetY: 0,
  }
  /**
   * 描画サイズ
   * @type {{ width: number; height: number; }}
   */
  size = {
    width: 0,
    height: 0,
  }
  /**
   * 実際に流すときの距離
   * @type {number}
   */
  scrollWidth = 0
  /**
   * 行番号
   * @type {number}
   */
  line = 0
  /**
   * コメントを流し始めた時間
   * @type {number}
   */
  startTime = null

  /****************************************
   * コンストラクタ
   * @param {string | number | symbol}          id       コメントID
   * @param {Array<string | FlowCommentsImage>} content  コメント本文
   * @param {FlowCommentsItemOption}            [option] オプション
   * @param {FlowCommentsStyle}                 [style]  スタイル
   */
  constructor(id, content, option, style) {
    FlowCommentsUtil.filterObject(option)
    FlowCommentsUtil.filterObject(style)
    this.#id = id
    this.#content = Array.isArray(content) ? content.filter(v => v) : content
    this.#style = style
    this.#option = { ...FLOWCMTITEM_DEFAULT_OPTION, ...option }
    if (this.#option.position === FLOWCMT_TYPE.FLOW) {
      this.#actualDuration = this.#option.duration * 1.5
    }
    this.#canvas = document.createElement('canvas')
  }

  get id() { return this.#id }
  get content() { return this.#content }
  get style() { return this.#style }
  get option() { return this.#option }
  get actualDuration() { return this.#actualDuration }
  get canvas() { return this.#canvas }

  get top() { return this.position.y }
  get bottom() { return this.position.y + this.size.height }
  get left() { return this.position.x }
  get right() { return this.position.x + this.size.width }

  get rect() {
    return {
      width: this.size.width,
      height: this.size.height,
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right,
    }
  }

  dispose() {
    this.#canvas.remove()

    this.#id = null
    this.#content = null
    this.#style = null
    this.#option = null
    this.#actualDuration = null
    this.#canvas = null

    Object.keys(this).forEach(k => delete this[k])
  }
}

/****************************************
 * @classdesc コメントを流すやつ
 * @example
 * // 準備
 * const fc = new FlowComments()
 * document.body.appendChild(fc.canvas)
 * fc.start()
 * 
 * // コメントを流す(追加する)
 * fc.pushComment(new FlowCommentsItem(Symbol(), 'Hello world!'))
 */
class FlowComments {
  /**
   * インスタンスに割り当てられるIDのカウント用
   * @type {number}
   */
  static #id_cnt = 0

  /**
   * インスタンスに割り当てられるID
   * @type {number}
   */
  #id
  /**
   * `requestAnimationFrame`の`requestID`
   * @type {number}
   */
  #animReqId = null
  /**
   * Canvas
   * @type {HTMLCanvasElement}
   */
  #canvas
  /**
   * CanvasRenderingContext2D
   * @type {CanvasRenderingContext2D}
   */
  #context2d
  /**
   * 現在表示中のコメント
   * @type {Array<FlowCommentsItem>}
   */
  #comments
  /**
   * オプション
   * @type {FlowCommentsOption}
   */
  #option
  /**
   * スタイル
   * @type {FlowCommentsStyle}
   */
  #style
  /**
   * @type {ResizeObserver}
   */
  #resizeObs

  /****************************************
   * コンストラクタ
   * @param {FlowCommentsOption} [option] オプション
   * @param {FlowCommentsStyle}  [style]  スタイル
   */
  constructor(option, style) {
    // 初期化
    this.initialize(option, style)
  }

  get id() { return this.#id }
  get style() { return { ...FLOWCMT_DEFAULT_STYLE, ...this.#style } }
  get option() { return { ...FLOWCMT_DEFAULT_OPTION, ...this.#option } }
  get canvas() { return this.#canvas }
  get context2d() { return this.#context2d }
  get comments() { return this.#comments }

  get lineHeight() { return this.#canvas.height / this.option.lines }
  get fontSize() { return this.lineHeight * FLOWCMT_CONFIG.FONT_SCALE }

  get isStarted() { return this.#animReqId !== null }

  /****************************************
   * 初期化（インスタンス生成時には不要）
   * @param {FlowCommentsOption} [option] オプション
   * @param {FlowCommentsStyle}  [style]  スタイル
   */
  initialize(option, style) {
    this.dispose()

    // ID割り当て
    this.#id = ++FlowComments.#id_cnt

    // Canvas生成
    this.#canvas = document.createElement('canvas')
    this.#canvas.classList.add(FLOWCMT_CONFIG.CANVAS_CLASSNAME)
    this.#canvas.dataset.fcid = this.#id.toString()

    // CanvasRenderingContext2D
    this.#context2d = this.#canvas.getContext('2d')

    // コメント一覧
    this.#comments = []

    // サイズ変更を監視
    this.#resizeObs = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const { width, height } = entry.contentRect

        // Canvasのサイズ(比率)を自動で調整
        if (this.option.autoResize) {
          const rect_before = this.#canvas.width / this.#canvas.height
          const rect_resized = width / height
          if (0.01 < Math.abs(rect_before - rect_resized)) {
            this.resizeCanvas()
          }
        }

        // Canvasの解像度を自動で調整
        if (this.option.autoResolution) {
          const resolution = FLOWCMT_CONFIG.RESOLUTION_LIST.find(v => height <= v)
          if (Number.isFinite(resolution) && this.option.resolution !== resolution) {
            this.changeOption({ resolution: resolution })
          }
        }
      })
    })
    this.#resizeObs.observe(this.#canvas)

    // オプションをセット
    this.changeOption(option)
    // スタイルをセット
    this.changeStyle(style)
  }

  /****************************************
   * オプションを変更
   * @param {FlowCommentsOption} option オプション
   */
  changeOption(option) {
    FlowCommentsUtil.filterObject(option)
    this.#option = { ...this.#option, ...option }
    if (option !== undefined && option !== null) {
      this.resizeCanvas()
    }
  }

  /****************************************
   * スタイルを変更
   * @param {FlowCommentsStyle} [style] スタイル
   */
  changeStyle(style) {
    FlowCommentsUtil.filterObject(style)
    this.#style = { ...this.#style, ...style }
    if (style !== undefined && style !== null) {
      this.#updateCanvasStyle()
    }
  }

  /****************************************
   * Canvasをリサイズ
   */
  resizeCanvas() {
    // Canvasをリサイズ
    const { width, height } = this.#canvas.getBoundingClientRect()
    const { resolution } = this.option
    const ratio = (width === 0 && height === 0) ? FLOWCMT_CONFIG.CANVAS_RATIO : (width / height)
    this.#canvas.width = resolution * ratio
    this.#canvas.height = resolution

    // Canvasのスタイルをリセット
    this.#updateCanvasStyle()
  }

  /****************************************
   * Canvasのスタイルを更新
   */
  #updateCanvasStyle() {
    // スタイルを適用
    FlowCommentsUtil.setStyleToCanvas(
      this.#context2d, this.style, this.option.resolution, this.fontSize
    )

    // Canvasをリセット
    this.#context2d.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    // コメントの各プロパティを再計算・描画
    this.#comments.forEach(cmt => {
      this.#generateCommentsItemCanvas(cmt)
      this.#renderComment(cmt)
    })
  }

  /****************************************
   * Canvasのスタイルをリセット
   */
  resetCanvasStyle() {
    this.changeStyle(FLOWCMT_DEFAULT_STYLE)
  }

  /****************************************
   * 端数処理
   * @param {number} num
   */
  #floor(num) {
    return this.#option.smoothRender ? num : (num | 0)
  }

  /****************************************
   * コメントの単体のCanvasを生成
   * @param {FlowCommentsItem} comment コメント
   */
  async #generateCommentsItemCanvas(comment) {
    const ctx = comment.canvas.getContext('2d')
    ctx.clearRect(0, 0, comment.canvas.width, comment.canvas.height)

    const style = { ...this.style, ...comment.style }
    const drawFontSize = this.fontSize * style.fontScale
    const margin = drawFontSize * FLOWCMT_CONFIG.TEXT_MARGIN

    // スタイルを適用
    FlowCommentsUtil.setStyleToCanvas(
      ctx, style, this.option.resolution, this.fontSize
    )

    /** @type {Array<number>} */
    const aryWidth = []

    //----------------------------------------
    // サイズを計算
    //----------------------------------------
    for (const cont of comment.content) {
      // 文字列
      if (typeof cont === 'string') {
        aryWidth.push(ctx.measureText(cont).width)
      }
      // 画像
      else if (cont instanceof FlowCommentsImage) {
        const img = await cont.get()
        if (img instanceof HTMLImageElement) {
          const ratio = img.width / img.height
          aryWidth.push(drawFontSize * ratio)
        } else if (img !== undefined) {
          aryWidth.push(ctx.measureText(img).width)
        } else {
          aryWidth.push(1)
        }
      }
    }

    // コメントの各プロパティを計算
    comment.size.width = aryWidth.reduce((a, b) => a + b)
    comment.size.width += margin * (aryWidth.length - 1)
    comment.size.height = this.lineHeight
    comment.scrollWidth = this.#canvas.width + comment.size.width
    comment.position.x = this.#canvas.width - comment.scrollWidth * comment.position.xp
    comment.position.y = this.lineHeight * comment.line
    comment.position.offsetY = this.lineHeight / 2 * (1 + FLOWCMT_CONFIG.FONT_OFFSET_Y)

    // Canvasのサイズを設定
    comment.canvas.width = comment.size.width
    comment.canvas.height = comment.size.height

    // スタイルを再適用（上でリセットされる）
    FlowCommentsUtil.setStyleToCanvas(
      ctx, style, this.option.resolution, this.fontSize
    )

    //----------------------------------------
    // コメントを描画
    //----------------------------------------
    let dx = 0
    for (let idx = 0; idx < comment.content.length; idx++) {
      if (0 < idx) {
        dx += margin
      }
      const cont = comment.content[idx]
      // 文字列
      if (typeof cont === 'string') {
        ctx.fillText(
          cont,
          this.#floor(dx), this.#floor(comment.position.offsetY)
        )
      }
      // 画像
      else if (cont instanceof FlowCommentsImage) {
        const img = await cont.get()
        if (img instanceof HTMLImageElement) {
          ctx.drawImage(
            img,
            this.#floor(dx), this.#floor((comment.size.height - drawFontSize) / 2),
            this.#floor(aryWidth[idx]), this.#floor(drawFontSize)
          )
        } else if (img !== undefined) {
          ctx.fillText(
            img,
            this.#floor(dx), this.#floor(comment.position.offsetY)
          )
        } else {
          ctx.fillText(
            '',
            this.#floor(dx), this.#floor(comment.position.offsetY)
          )
        }
      }
      dx += aryWidth[idx]
    }
  }

  /****************************************
   * コメントを追加(流す)
   * @param {FlowCommentsItem} comment コメント
   */
  async pushComment(comment) {
    if (this.#animReqId === null || document.visibilityState === 'hidden') return

    //----------------------------------------
    // 画面内に表示するコメントを制限
    //----------------------------------------
    if (0 < this.option.limit && this.option.limit <= this.#comments.length) {
      this.#comments.splice(0, this.#comments.length - this.option.limit)[0]
    }

    //----------------------------------------
    // コメントの各プロパティを計算
    //----------------------------------------
    await this.#generateCommentsItemCanvas(comment)

    //----------------------------------------
    // コメント表示行を計算
    //----------------------------------------
    const spd_pushCmt = comment.scrollWidth / comment.option.duration

    // [[0, 0], [1, 0], ~ , [10, 0]] ([line, cnt])
    const lines_over = [...Array(this.option.lines)].map((_, i) => [i, 0])

    this.#comments.forEach(cmt => {
      // 残り表示時間
      const leftTime = cmt.option.duration * (1 - cmt.position.xp)
      // コメント追加時に重なる or 重なる予定かどうか
      const isOver =
        comment.left - spd_pushCmt * leftTime <= 0 ||
        comment.left <= cmt.right
      if (isOver && cmt.line < this.option.lines) {
        lines_over[cmt.line][1]++
      }
    })

    // 重なった頻度を元に昇順で並べ替える
    const lines_sort = lines_over.sort(([, cntA], [, cntB]) => cntA - cntB)

    comment.line = lines_sort[0][0]
    comment.position.y = this.lineHeight * comment.line

    //----------------------------------------
    // コメントを追加
    //----------------------------------------
    this.#comments.push(comment)
  }

  /****************************************
   * テキストを描画
   * @param {FlowCommentsItem} comment コメント
   */
  #renderComment(comment) {
    this.#context2d.drawImage(
      comment.canvas,
      this.#floor(comment.position.x), this.#floor(comment.position.y)
    )
  }

  /****************************************
   * ループ中に実行される処理
   * @param {number} time 時間
   */
  #update(time) {
    // Canvasをリセット
    this.#context2d.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    this.#comments.forEach((cmt, idx, ary) => {
      // コメントを流し始めた時間
      if (cmt.startTime === null) {
        cmt.startTime = time
      }

      // コメントを流し始めて経過した時間
      const elapsedTime = time - cmt.startTime

      if (elapsedTime <= cmt.actualDuration) {
        // コメントの座標を更新(流すコメント)
        if (cmt.option.position === FLOWCMT_TYPE.FLOW) {
          cmt.position.xp = elapsedTime / cmt.option.duration
          cmt.position.x = this.#canvas.width - cmt.scrollWidth * cmt.position.xp
        }
        // コメントを描画
        this.#renderComment(cmt)
      } else {
        // 表示時間を超えたら消す
        cmt.dispose()
        ary.splice(idx, 1)[0]
      }
    })
  }

  /****************************************
   * ループ処理
   * @param {number} time 時間
   */
  #loop(time) {
    this.#update(time)
    if (this.#animReqId !== null) {
      this.#animReqId = window.requestAnimationFrame(this.#loop.bind(this))
    }
  }

  /****************************************
   * コメント流しを開始
   */
  start() {
    if (this.#animReqId === null) {
      this.#animReqId = window.requestAnimationFrame(this.#loop.bind(this))
    }
  }

  /****************************************
   * コメント流しを停止
   */
  stop() {
    if (this.#animReqId !== null) {
      window.cancelAnimationFrame(this.#animReqId)
      this.#animReqId = null
    }
  }

  /****************************************
   * 解放(初期化してCanvasを削除)
   */
  dispose() {
    this.stop()

    this.#canvas?.remove()
    this.#resizeObs?.disconnect()

    this.#id = null
    this.#animReqId = null
    this.#canvas = null
    this.#context2d = null
    this.#comments = null
    this.#style = null
    this.#option = null
    this.#resizeObs = null

    Object.keys(this).forEach(k => delete this[k])
  }
}