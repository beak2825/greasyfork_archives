// ==UserScript==
// @name         touchActionEx
// @version      0.3
// @description  簡単なタッチ操作のイベントを追加します
// @author       y_kahou
// ==/UserScript==
 
function addTap(ele, {interval = 200} = {}) {
    // すでにtapかdoubletapを設定していたら何もしない
    if (ele.getAttribute('tap') != null || ele.getAttribute('doubletap') != null)
        return
    ele.setAttribute('tap','')
    
    ele.addEventListener('touchstart', e => {
        if (e.targetTouches.length > 1) {
            ele.dataset.tap = 0
            return
        }
        ele.dataset.tap = 1
        let to = setTimeout(() => {
            ele.dataset.tap = 0
            ele.dispatchEvent(new CustomEvent('hold', {detail: {touch: e.targetTouches[0]}}))
        }, interval)
        ele.dataset.tap_to = to
    })
    ele.addEventListener('touchmove', e => {
        if (ele.dataset.tap == 0)
            return
        ele.dispatchEvent(new Event('subfocus'))
        ele.dataset.tap = 0
        clearTimeout(ele.dataset.tap_to)
    })
    ele.addEventListener('touchend', e => {
        if (ele.dataset.tap == 0)
            return
        ele.dataset.tap = 0
        clearTimeout(ele.dataset.tap_to)
        ele.dispatchEvent(new CustomEvent('tap', {detail: {touch: e.changedTouches[0]}}))
        e.preventDefault()
    })
}
function addDoubletap(ele, {interval = 200} = {}) {
    // すでにtapかdoubletapを設定していたら何もしない
    if (ele.getAttribute('tap') != null || ele.getAttribute('doubletap') != null)
        return
    ele.setAttribute('doubletap', '')
    
    ele.addEventListener('touchstart', e => {
        if (e.targetTouches.length > 1) {
            ele.dataset.tap = 0
            return
        }
        ele.dataset.tap = 1
        let to = setTimeout(() => {
            ele.dataset.tap = 0
            ele.dispatchEvent(new CustomEvent('hold', {detail: {touch: e.targetTouches[0]}}))
        }, interval)
        ele.dataset.tap_to = to
    })
    ele.addEventListener('touchmove', e => {
        if (ele.dataset.tap == 0)
            return
        ele.dispatchEvent(new Event('subfocus'))
        ele.dataset.tap = 0
        clearTimeout(ele.dataset.tap_to)
    })
    ele.addEventListener('touchend', e => {
        if (ele.dataset.tap == 0)
            return
        ele.dataset.tap = 0
        clearTimeout(ele.dataset.tap_to)
        let event = new CustomEvent('temp', {detail: {touch: e.changedTouches[0]}})
        ele.dispatchEvent(event)
        e.preventDefault()
    })
    ele.addEventListener('temp', e => {
        if (ele.dataset.dbltap == 1) {
            ele.dataset.dbltap = 0
            clearTimeout(ele.dataset.dbltap_to)
            ele.dispatchEvent(new CustomEvent('doubletap', {detail: e.detail}))
        } else {
            ele.dataset.dbltap = 1
            var to = setTimeout(() => {
                ele.dataset.dbltap = 0
                ele.dispatchEvent(new CustomEvent('tap', {detail: e.detail}))
            }, interval)
            ele.dataset.dbltap_to = to
        }
    })
}
function addSwipe(ele, {min_dist = 50} = {}) {
    // すでにswipeかswipe_wayを設定していたら何もしない
    if (ele.getAttribute('swipe') != null || ele.getAttribute('swipe_way') != null)
        return
    ele.setAttribute('swipe','')
    
    ele.addEventListener('touchstart', e => {
        if (e.touches.length > 1) {
            ele.dataset.start_point = ''
            return
        }
        var x = Math.floor(e.touches[0].screenX)
        var y = Math.floor(e.touches[0].screenY)
        ele.dataset.start_point = `${x},${y}`
    })
    ele.addEventListener('touchmove', e => {
        if (e.touches.length > 1) {
            ele.dataset.start_point = ''
            return
        }
    })
    ele.addEventListener('touchend', e => {
        if (e.changedTouches.length > 1)
            return
        var p = ele.dataset.start_point
        if (!p)
            return
        var x1 = Number(p.split(',')[0])
        var y1 = Number(p.split(',')[1])
        var x2 = Math.floor(e.changedTouches[0].screenX)
        var y2 = Math.floor(e.changedTouches[0].screenY)
        var ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
        if (ang < 0) ang += 360
        var dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        if (min_dist < dist) {
            var dt = {
                from: { x: x1, y: y1 },
                dest: { x: x2, y: y2 },
                angle: ang, distance: dist
            }
            ele.dispatchEvent(new CustomEvent('swipe', {detail: dt}))
        }
    })
}
function addSwipeWay(ele, {range = 90, min_dist = 50} = {}) {
    // すでにswipe_wayを設定していたら何もしない
    if (ele.getAttribute('swipe_way') != null)
        return
    // swipe未設定なら設定
    if (ele.getAttribute('swipe') == null) {
        addSwipe(ele, min_dist)
    }
    ele.removeAttribute('swipe')
    ele.setAttribute('swipe_way', '')
    
    ele.addEventListener('swipe', e => {
        const ways = ['right', 'down', 'left', 'up']
        let ang = e.detail.angle
        let dist = e.detail.distance
        for (var i in ways) {
            var ang_ = (i==0 && 270<ang ? ang-360 : ang)
            if (Math.abs(90 * i - ang_) <= range / 2) {
                ele.dispatchEvent(new CustomEvent('swipe' + ways[i], { detail: e.detail}))
                break
            }
        }
    })
    
}
