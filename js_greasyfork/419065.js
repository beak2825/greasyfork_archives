// ==UserScript==
// @name         jQuery touch action Ex
// @version      0.3.1
// @description  簡単なタッチ操作のイベントを追加します
// @author       y_kahou
// ==/UserScript==
 
if (window.jQuery) (function($) {
    'use strict';
    
    // 通常のタップ
    $.fn.tap = function(interval = 200) {
        // すでにtapまたはdoubletapを設定していたら何もしない
        if ($(this).prop('tap') || $(this).prop('doubletap'))
            return $(this)
        $(this).attr('tap','')
        
        return $(this).on({
            touchstart: function(e) {
                if (e.targetTouches.length > 1) {
                    $(this).data('tap', false)
                    return
                }
                $(this).data('tap', true)
                var to = setTimeout(() => {
                    $(this).data('tap', false)
                    $(this).trigger('hold')
                }, interval)
                $(this).data('tap_to', to)
            },
            touchmove: function(e) {
                if (!$(this).data('tap'))
                    return
                $(this).trigger('subfocus')
                $(this).data('tap', false)
                clearTimeout($(this).data('tap_to'))
            },
            touchend: function(e) {
                if (!$(this).data('tap'))
                    return
                $(this).data('tap', false)
                clearTimeout($(this).data('tap_to'))
                e.type = 'tap'
                e.touches = e.changedTouches
                e.changedTouches = void(0)
                $(this).trigger(e)
                e.preventDefault()
            }
        })
    }
    
    // ダブルタップを考慮したタップとダブルタップ
    $.fn.doubletap = function(interval = 200) {
        // すでにtapまたはdoubletapを設定していたら何もしない
        if ($(this).prop('tap') || $(this).prop('doubletap'))
            return $(this)
        $(this).attr('doubletap','')
        
        return $(this).on({
            touchstart: function(e) {
                if (e.targetTouches.length > 1) {
                    $(this).data('tap', false)
                    return
                }
                $(this).data('tap', true)
                var to = setTimeout(() => {
                    $(this).data('tap', false)
                    $(this).trigger('hold')
                }, interval)
                $(this).data('tap_to', to)
            },
            touchmove: function(e) {
                if (!$(this).data('tap'))
                    return
                $(this).trigger('subfocus')
                $(this).data('tap', false)
                clearTimeout($(this).data('tap_to'))
            },
            touchend: function(e) {
                if (!$(this).data('tap'))
                    return
                $(this).data('tap', false)
                clearTimeout($(this).data('tap_to'))
                e.type = 'temp'
                $(this).trigger(e)
                e.preventDefault()
            },
            temp: function(e) {
                e.touches = e.changedTouches
                e.changedTouches = void(0)
                if ($(this).data('dbltap')) {
                    $(this).data('dbltap', false)
                    clearTimeout($(this).data('dbltap_to'))
                    e.type = 'doubletap'
                    $(this).trigger(e)
                } else {
                    $(this).data('dbltap', true)
                    var to = setTimeout(() => {
                        $(this).data('dbltap', false)
                        e.type = 'tap'
                        $(this).trigger(e)
                    }, interval)
                    $(this).data('dbltap_to', to)
                }
            }
        })
    }
    
    $.fn.swipe = function(min_dist = 50) {
        // すでにswipeを設定していたら何もしない
        if ($(this).prop('swipe'))
            return $(this)
        $(this).attr('swipe','')
        
        return $(this).on({
            touchstart: function(e) {
                if (e.touches.length > 1) {
                    $(this).data('start_point', '')
                    return
                }
                var x = Math.floor(e.touches[0].screenX)
                var y = Math.floor(e.touches[0].screenY)
                $(this).data('start_point', `${x},${y}`)
            },
            touchmove: function(e) {
                if (e.touches.length > 1) {
                    $(this).data('start_point', '')
                    return
                }
            },
            touchend: function(e) {
                if (e.changedTouches.length > 1)
                    return
                var p = $(this).data('start_point')
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
                    let from = { x: x1, y: y1 }
                    let dest = { x: x2, y: y2 }
                    $(this).trigger('swipe', [ang, dist, from, dest])
                }
            }
        })
    }
    
    // 4方向のスワイプ判定
    $.fn.swipe_way = function({min_dist = 50, range = 90} = {}) {
        // すでにswipe_wayを設定していたら何もしない
        if ($(this).prop('swipe_way'))
            return $(this)
        
        // swipe未設定なら設定
        if (!$(this).prop('swipe')) {
            $(this).swipe(min_dist)
        }
        $(this).removeAttr('swipe')
        $(this).attr('swipe_way','')
        
        return $(this).on('swipe', function(e, ang, dist, from, dest) {
            const ways = ['right', 'down', 'left', 'up']
            for (var i in ways) {
                var ang_ = (i==0 && 270<ang ? ang-360 : ang)
                if (Math.abs(90 * i - ang_) <= range / 2) {
                    $(this).trigger('swipe' + ways[i], [ang, dist, from, dest])
                    break
                }
            }
        })
    }
})(window.jQuery);

