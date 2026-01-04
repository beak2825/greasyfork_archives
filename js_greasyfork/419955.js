// ==UserScript==
// @name         y_method
// @version      0.3.1
// @description  dom取得等の機能追加
// @author       y_kahou
// ==/UserScript==
 
 
const y_method = {
    /**
     * スタイルを追加する
     * @param id {string} - スタイルのID
     * @param css {string} - css本体
     */
    addStyle: function(id, css) {
        let style = document.createElement('style')
        style.id = id
        style.setAttribute('type', 'text/css')
        style.textContent = css
        document.querySelector('head').appendChild(style)
    },
    /**
     * 対象までスクロールせずにクリックする
     * @param selector {string} - 取得対象のセレクタ
     */
    click_: function(element) {
        let x = window.scrollX, y = window.scrollY
        element.click()
        window.scrollTo(x, y)
    },
    /**
     * 対象までスクロールせずにフォーカスする
     * @param selector {string} - 取得対象のセレクタ
     */
    focus_: function(element) {
        let x = window.scrollX, y = window.scrollY
        element.focus()
        window.scrollTo(x, y)
    },
    /**
     * 対象のdomを取得できるまで取得を挑戦する
     * @param selector {string} - 取得対象のセレクタ
     * @param interval {number} - 次の挑戦までの時間ms
     * @param repeat   {number} - 繰り返し回数
     */
    repeatGetElements: function(selector, interval = 500, repeat = 60) {
        return new Promise(function(resolve, reject) {
            let cnt = 0
            let it = setInterval(function() {
                if (++cnt > repeat) {
                    clearInterval(it)
                    reject("Could'n get " + selector)
                }
                let ret = document.querySelectorAll(selector)
                if (ret.length > 0) {
                    clearInterval(it)
                    resolve(ret)
                }
            }, interval)
        })
    },
    /**
     * src込みのvideo要素の取得
     */
    getVideo: async function(selector = 'video') {
        let video
        for (var i = 0; i < 60; i++) {
            video = await repeatGetElements(selector)
            if (video[0].getAttribute('src'))
                break
            await wait(500)
        }
        return video
    },
 
    /**
     * ファイル名に使えない文字を半角から全角へ変換する
     * @param name {string} - ファイル名
     */
    filenameEscape: function(name) {
        const target = ['\\', '/', ':', '*', '?', '"', '<', '>', '|', ]
        const rep = ['＼', '／', '：', '＊', '？', '”', '＜', '＞', '｜', ]
        let ename = name
        for (let i = 0; i < target.length; i++) {
            ename = ename.replaceAll(target[i], rep[i])
        }
        return ename
    },
    
    /**
     * pagetransitionイベントを発火
     * target: document
     * event: pagetransition
     */
    TriggerPagetransition: function() {
        const event = new CustomEvent('pagetransition', { detail: location.href });
        document.dispatchEvent(event);
    },
    /**
     * SPA等のページ遷移をイベントで検知できるようにする
     * target: document
     * event: pagetransition
     */
    DetectPagetransition: function() {
        let agoHref = location.href;
        new MutationObserver(() => {
            if (agoHref != location.href) {
                y_method.TriggerPagetransition();
                agoHref = location.href;
            }
        })
        .observe(document.body, { childList: true, subtree: true ,attributes: true })
    },
    /**
     * 指定のページごとのcssと初期動作関数List
     * @param launcherList [{match, css, run},]
     * @param match url RegExp
     * @param css css text
     * @param run function
     */
    PageLauncher: function(launcherList) {
        document.addEventListener('pagetransition', e => {
            for (const s of document.querySelectorAll('.spa-style')) {
                s.outerHTML = '';
            }
            for (const d of launcherList) {
                if (new RegExp(d.match).test(location.href)) {
                    let style = document.createElement('style')
                    style.className = 'spa-style'
                    style.setAttribute('type', 'text/css')
                    style.textContent = d.css
                    document.head.appendChild(style)
                    if (d.run && typeof d.run === 'function') d.run();
                }
            }
        })
    },
}
 
if (window.jQuery) (function($) {
    /**
     * 対象までスクロールせずにクリックする
     */
    $.fn.click_ = function() {
        y_method.click_(this[0])
        return this
    }
    /**
     * 対象までスクロールせずにフォーカスする
     */
    $.fn.focus_ = function() {
        y_method.focus_(this[0])
        return this
    }
})(window.jQuery);