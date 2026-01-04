// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Smart links <<<<<<<<<<<<<<<<<<<<<
// @description  1-click access to commonly used pages
// @version      0.2
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @noframes
// @run-at       document-body
// @grant        none
// jshint        ignore: start
// @downloadURL https://update.greasyfork.org/scripts/378285/7%20Cups%20-%20Smart%20links%20%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C.user.js
// @updateURL https://update.greasyfork.org/scripts/378285/7%20Cups%20-%20Smart%20links%20%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C%3C.meta.js
// ==/UserScript==
var debug = false // display status and count in link titles

if (location.pathname == '/notes.php') return

var Links = {
    cap: 20,
    chaticon: String.fromCodePoint(0x1f5e8),
    me: '',

    blocked: function () {
        return ['/listener/', '/member/', '/login.php', '/notes.php'].indexOf(location.pathname) >= 0
        },
    get data () {
        return this.me? JSON.parse(localStorage.getItem('rc_smartlinks_' + this.me)) || {} : {}
        },
    set data (ss) {
        localStorage.setItem('rc_smartlinks_' + this.me, JSON.stringify(ss))
        },
    display: function () {
        var vv = this.settings, size = vv[0], forget = vv[1]

        // organize...
        var ss = this.data, aa = [] // [{path, title, count, status}]
        for (let s in ss) aa.push({
            path: s,
            title: ss[s].title,
            count: ss[s].count,
            status: ss[s].status,
            rem: ss[s].rem,
            rank: parseFloat(ss[s].count) + 100 * parseInt(ss[s].status)
            })
        aa.sort((a, b) => parseFloat(b.rank) - parseFloat(a.rank))
        while (aa.length > 2 * size) aa.pop()
        ss = {}
        for (let a of aa) {
            a.count = (a.count - forget / 1000).toFixed(2) // forget
            if (a.count > 0) {
                ss[a.path] = {title: a.title, count: a.count, status: a.status}
                if (a.rem) ss[a.path].rem = a.rem
                }
            }
        this.data = ss

        // show...
        var cb = $('#rc-smartpop .card-block'), smart = 0, total = 0
        cb.empty()
        var i = 0
        while (smart < size && i < aa.length) {
            let a = aa[i++]
            if (a.status || a.count > 2) {
                let s = 'link' // source
                if (a.status & 2) s = 'star'
                else if (a.status & 1) s = 'thumb-tack'
                let t = '' // type
                if (a.path.startsWith('/forum/')) t = 'quote-left'
                else if (a.path.startsWith('/wiki/')) t = 'edit'
                else if (!a.path.startsWith('/')) t = 'external-link'
                else if (a.path.indexOf('/conversation.php?') > 0) {
                    if (a.title.startsWith('*')) {
                        a.title = a.title.substring(1)
                        t = 'comments-o'
                        }
                    else t = 'comment-o'
                    }
                let r = a.rem || a.title
                if (debug) r += ' (' + a.status + ': ' + a.count + ')'
                cb.append(
                    '<p>' +
                    '<i class="fa fa-' + s + ' rc-linkicon"></i> ' +
                    (t? '<i class="fa fa-' + t + '"></i> ' : '') +
                    '<a href="' + a.path + '" title="' + r + '">' + a.title + '</a>' +
                    '</p>'
                    )
                if (a.status == 0) smart++
                total++
                }
            }
        if (total == 0) cb.append('<p style="color: #bbb; letter-spacing: 2px; margin: 0; text-align: center;">No links to display</p>')
        },
    formsetup: function (title, url, rem, capture, size, forget) {
        var f = null
        var s = (n, v) => {
            var i = $('#rc-smart' + n)
            i.val(v || '')
            i[v === false? 'hide' : 'show']()
            i.parent()[v === false? 'hide' : 'show']()
            if (!f && v !== false) f = i
            }
        s('title', title), s('url', url), s('rem', rem)
        $('#rc-smartcapture')[capture? 'show' : 'hide']().css('opacity', capture? '1' : '0')
        $('#rc-smartset')[size === false? 'hide' : 'show']()
        $('#rc-smartform input').prop('disabled', false)
        if (size !== false) { // settings...
            f = $('#rc-smartsize').val(size)
            $('#rc-smartforget').val(forget)
            }
        return f
        },
    record: function () { // record current page...
        // storage... {path: {title, count, status, [rem]}} status: 1 pinned, 2 starred

        var p = this.url, s = this.settings
        if (s.here == p) return // ignore reload
        s.here = p
        this.settings = s

        var ss = this.data
        if (p in ss && (ss[p].status & 2)) { // autoclear star...
            ss[p].status &= ~2
            this.data = ss
            }

        var t = this.title
        if (document.title != t) document.title = t

        if (this.blocked()) return

        var update = () => { // wait for name, update title...
            var t = ChatSession.otherUser.screenName
            if (t) {
                let ss = this.data,
                    r = ChatSession.roomType? '*' : ''
                ss[p].title = r + t
                this.data = ss
                }
            else setTimeout(update, 200)
            }
        if (t == 'Connect') t = '', setTimeout(update, 200)

        if (p in ss) {
            ss[p].count = Math.min(parseFloat(ss[p].count) + 1, this.cap)
            ss[p].status &= ~2
            console.log('+++ status now: ' + ss[p].status)
            if ('rem' in ss[p]) delete ss[p].rem
            }
        else ss[p] = {title: t, count: 1, status: 0}

        Links.data = ss
        },
    remove: function (p) {
        var ss = this.data
        delete ss[p]
        this.data = ss
        },
    get settings () { // [size, forget]
        return this.me? JSON.parse(localStorage.getItem('rc_smartset_' + this.me)) || [10, 10] : [10, 10]
        },
    set settings (s) { // [size, forget]
        if (s) localStorage.setItem('rc_smartset_' + this.me, JSON.stringify(s))
        },
    get status () { // current page status...
        var ss = this.data, p = this.url
        return p in ss? ss[p].status : 0
        },
    get title () { // current page title...
        var p = this.url, ss = this.data
        if (p in ss) return ss[p].title
        var t = document.title
        t = t.replace(/\s*[|-]\s*7\s*Cups\s*(?:of\s*Tea\s*|Forum)?$/, '')
        t = t.replace(/Page \d+ of \d+: /, '')
        t = t.replace(/\s*(Page \d+ of \d+)\s*$/, '')
        return t
        },
    tooltip: function (status) { // set tooltips...
        $('#rc-smartpop .rc-smartbar .fa-thumb-tack').prop('title', (status & 1)? 'Unpin this page' : 'Pin this page')
        $('#rc-smartpop .rc-smartbar .fa-star').prop('title', (status & 2)? 'Clear this page\'s star' : 'Star this page')
        },
    get url () { // current page url...
        return location.pathname + location.search
        }
    }

addEventListener('DOMContentLoaded', function () {
    Links.me = window.userInfo && window.userInfo.screenName
    if (!Links.me) return

    $('head').append('<style id="rc-smartlinkstyle">' +
      '#rc-smartpop {width: 320px; min-height: 80px; position: fixed; top: 60px; left: 20px; opacity: .95; z-index: 9999; display: none; box-shadow: 0 4px 20px rgba(0, 0, 0, .6)}' +
      '#rc-smartpop .card-header {padding: 0 0 8px 0;}' +
      '#rc-smartpop .card-header h5 {margin: 1ex 0 0 0; text-align: center; font-size: 18px; font-weight: 500;}' +
      '#rc-smartpop .card-block {border: 1px solid transparent; border-width: 1px 0;}' +
      '#rc-smartpop .card-block p {overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: .9em;}' +
      '#rc-smartpop .card-block p {margin: 0 0 2px 0; color: #0275d8; font-size: 14px; line-height: 18px;}' +
      '#rc-smartpop .card-footer {text-align: center; font-size: 22px; background-color: transparent;}' +
      '#rc-smartpop p > .fa:first-child {display: inline-block; width: 16px; margin-right: 4px;}' +
      '#rc-smartpop p.rc-smarton, p.rc-smarton a {background-color: #fcd; color: #eef; position: relative; text-shadow: none;}' +
      '#rc-smartpop p.rc-smarton::after {content: "Remove"; display: inline-block; position: absolute; left: 8em; color: #a00;}' +
      '#rc-smartpop .fa-plus {color: #0a0;}' +
      '#rc-smartpop .fa-minus {color: #a00;}' +
      '#rc-smartpop .fa-link {color: #07d;}' +
      '#rc-smartpop .fa-thumb-tack {color: #fa0; transform: rotate(17deg);}' +
      '#rc-smartpop .card-block .fa-thumb-tack {color: #07d;}' +
      '#rc-smartpop .fa-star {color: #f44; transform: rotate(-7deg);}' +
      '#rc-smartpop .fa-pencil {color: #830;}' +
      '#rc-smartpop .fa-cog {color: #667;}' +
      '#rc-smartpop .fa-quote-left {color: #fff; font-size: 14px; text-shadow: 1px 0 0 #07d, 0 1px 0 #07d, -1px 0 0 #07d, 0 -1px 0 #07d;}' +
      '#rc-smartpop .card-footer .fa {display: inline-block; width: 24px; height: 24px; margin: 0 6px; cursor: pointer;}' +
      '#rc-smartpop .card-footer .fa.disabled {cursor: default; color: #ddd;}' +
      '#rc-smartpop .card-footer h6 {color: inherit; text-align: center; margin: 0; height: 16px; line-height: 16px;}' +
      '#rc-smartpop .card-footer h6 + label {margin: 0;}' +
      '#rc-smartpop .rc-buttons {margin: 1ex 0 0 0; text-align: right;}' +
      '#rc-smartpop button {display: inline-block; margin: 0 0 0 1ex; padding: 4px 16px; font-size: inherit; min-width: 4em;}' +
      '#rc-smartcapture {text-align: center; margin: 1ex 0 -1ex 0;}' +
      '#rc-smartpop label {display: block; width: 100%; max-width: 280px;}' +
      '#rc-smartpop input[type=text] {width: 100%; max-width: 280px;}' +
      '#rc-smartpop #rc-smartform {display: none; overflow: hidden; text-align: left; font-size: 14px;}' +
      '#rc-smartpop #rc-smartform label {margin: 1ex 0 0 0;}' +
      '#rc-smartpop #rc-smartform .fa {margin: 0; cursor: default;}' +
      '#rc-smartpop p.rc-smarton .fa-quote-left {color: #fff; text-shadow: none;}' +
      '#rc-smartpop p.rc-smarton .fa:first-child {cursor: pointer;}' +
      '#rc-smartform table {border-collapse: separate; border-spacing: 1ex; margin-left: -1ex;}' +
      '#rc-smartform td {vertical-align: baseline;}' +
      '.rc-xbl, .rc-xtr {display: inline-block; width: 10px; height: 10px; border: 1px solid #000; position: relative;}' +
      '.rc-xbl {top: 4px; border-width: 1px 1px 0 0;}' +
      '.rc-xtr {top: -5px; left: -1px; border-width: 0 0 1px 1px; margin-right: 4px;}' +
      'a.rc-deadlink {cursor: crosshair;}' +
      '</style>')

    var status = Links.status
    $('body').append('<div id="rc-smartpop" class="card card-shadow">' +
      '<div class="card-header pb-2">' +
      '<h5 class="card-title">Smart Links</h5></div>' +
      '<div class="card-block"></div>' +
      '<div class="card-footer rc-smartbar">' +
        '<i class="fa fa-thumb-tack" title></i>' +
        '<i class="fa fa-star" title></i>' +
        '<i class="fa fa-pencil" title="Edit this page\'s title"></i>' +
        '<i class="fa fa-link" title="Capture a link in this page"></i>' +
        '<i class="fa fa-plus" title="Add any link"></i>' +
        '<i class="fa fa-minus" title="Remove any link"></i>' +
        '<i class="fa fa-cog" title="Settings"></i>' +
        '</div>' +
      '<div class="card-footer" id="rc-smartform">' +
        '<h6></h6>' +
        '<p id="rc-smartcapture"><span class="rc-xbl"></span><span class="rc-xtr"></span>Click the link to capture it.</p>' +
        '<label>Title:<br><input id="rc-smarttitle" type="text"></label>' +
        '<label>URL:<br><input id="rc-smarturl" type="text"></label>' +
        '<label>Reminder:<br><input id="rc-smartrem" type="text"></label>' +
        '<table id="rc-smartset"><tbody>' +
        '<tr><td><label title="Maximum number of smart links. No effect on pinned and starred links.">Smart links shown:</label></td><td><input id="rc-smartsize" type="number" max="100" min="4" step="1"></td></tr>' +
        '<tr><td><label title="Percentage rate. Zero disables learning new smart links.">Forgetfulness:</label></td><td><input id="rc-smartforget" type="number" max="100" min="0" step="10"></td></tr>' +
        '<tr><td colspan="2"><label title="Deletes all smart, pinned and starred links, clearing the menu completely."><input type="checkbox" id="rc-smartclear"> Delete all link data</label></td></tr>' +
        '</tbody></table>' +
        '<p class="rc-buttons"><button type="button" class="btn btn-outline btn-primary" id="rc-smartcancel">Cancel</button>' +
        '<button type="button" class="btn btn-outline btn-primary" id="rc-smartok">OK</button></p>' +
        '</div>' +
      '</div>')
    Links.tooltip(status)

    var popped = false, locked = false, popwait = 0, dropwait = 0, removable = false
    $('.navbar-brand').on('mouseover', function () {
        if (popwait) popwait = clearTimeout(popwait)
        if (!popped) popwait = setTimeout(() => {$('#rc-smartpop').show(), popped = true}, 400)
        })
    $('#rc-smartpop').on('mouseleave', function () {
        if (locked) return
        if (dropwait) dropwait = clearTimeout(dropwait)
        if (popped) dropwait = setTimeout(() => {$('#rc-smartpop').hide(), popped = false}, 800)
        })
    $('#rc-smartpop').on('mouseover', function () {
        if (dropwait) dropwait = clearTimeout(dropwait)
        })

    $('#rc-smartpop .rc-smartbar').on('click', '.fa', function () {
        locked = true
        var c = $(this).attr('class'), f = null
        $('#rc-smartform h6').html('<i class="' + c + '"></i> ' + $(this).attr('title'))
        if (c.includes('thumb')) {
            let ss = Links.data, p = Links.url
            if (ss[p] && (ss[p].status & 1)) {
                ss[p].status &= ~1
                Links.data = ss
                Links.display()
                locked = false
                return
                }
            else f = Links.formsetup(Links.title, false, false, false, false, false)
            }
        else if (c.includes('star')) {
            let ss = Links.data, p = Links.url
            if (ss[p] && (ss[p].status & 2)) {
                ss[p].status &= ~2
                Links.data = ss
                Links.display()
                locked = false
                return
                }
            else f = Links.formsetup(false, false, '', false, false, false)
            }
        else if (c.includes('pencil')) {
            f = Links.formsetup(Links.title, false, false, false, false, false)
            }
        else if (c.includes('link')) {
            f = Links.formsetup($(this).text(), $(this).attr('href'), '', true, false, false)
            $('#rc-smartform input').prop('disabled', true)
            $('a[href]').not('#rc-smartpop a').addClass('rc-deadlink')
            $('body').on('click', '.rc-deadlink', function () {
                event.preventDefault()
                $('body').off('click', '.rc-deadlink')
                $('a.rc-deadlink').removeClass('rc-deadlink')
                var a = $(this)
                $('#rc-smarttitle').val(a.text().replace(/\s+/g, ' ').trim())
                $('#rc-smarturl').val(a.attr('href'))
                $('#rc-smartform input').prop('disabled', false)
                $('#rc-smartcapture').css('opacity', '0')
                $('#rc-smartrem').focus()
                })
            }
        else if (c.includes('plus')) {
            f = Links.formsetup('', '', false, false, false, false)
            }
        else if (c.includes('minus')) {
            removable = !removable
            $('#rc-smartform').hide()
            $('#rc-smartpop .card-block').css('border-color', removable? 'red' : 'transparent')
            return
            }
        else if (c.includes('cog')) {
            let s = Links.settings
            f = Links.formsetup(false, false, false, false, s[0], s[1])
            }
        if (f) $('#rc-smartform').show(200, () => {f.focus()})
        })

    $('#rc-smartok').on('click', function () {
        $('body').off('click', '.rc-deadlink')
        var c = $('#rc-smartform h6 .fa').attr('class'),
            ss = Links.data,
            u = $('#rc-smarturl').val().trim(),
            t = $('#rc-smarttitle').val().trim(),
            r = $('#rc-smartrem').val().trim()
        if (u.startsWith('https://www.7cups.com')) u = u.substring(21)
        if (c.includes('thumb')) {
            if (t == '') t = Links.title
            u = Links.url
            if (u in ss) ss[u].title = t, ss[u].status |= 1
            else ss[u] = {title: t, count: 1, status: 1}
            Links.tooltip(ss[u].status)
            }
        else if (c.includes('star')) {
            u = Links.url
            if (!(u in ss)) ss[u] = {title: Links.title, count: 1, status: 2}
            ss[u].status |= 2
            if (r) ss[u].rem = r
            Links.tooltip(ss[u].status)
            }
        else if (c.includes('pencil')) {
            if (t == '') return
            u = Links.url
            if (u in ss) ss[u].title = t
            else ss[u] = {title: t, count: 1, status: 0}
            document.title = t
            }
        else if (c.includes('link')) {
            if (t == '' || u == '') return
            let s = r? 2 : 1
            if (u in ss) ss[u].title = t, ss[u].status |= s
            else ss[u] = {title: t, count: 1, status: s}
            if (r) ss[u].rem = r
            }
        else if (c.includes('plus')) {
            if (u == '' || t == '') return
            ss[u] = {title: t, count: 1, status: 1}
            }
        else if (c.includes('cog')) {
            if ($('#rc-smartclear').prop('checked')) ss = {}
            Links.settings = [parseInt($('#rc-smartsize').val()), parseInt($('#rc-smartforget').val())]
            }
        Links.data = ss
        Links.display()
        $('#rc-smartform').hide(200, () => {locked = false})
        })

    $('#rc-smartform').on('keypress', function () {
        if (event.keyCode == 13) {
            if (event.target.id == 'rc-smartcancel') $('#rc-smartcancel').click()
            else $('#rc-smartok').click()
            }
        })

    $('#rc-smartcancel').on('click', function () {
        $('#rc-smartform').hide(200)
        $('body').off('click', '.rc-deadlink')
        $('a[href]').not('#rc-smartpop a').removeClass('rc-deadlink')
        locked = false
        })

    // removal...
    var canremove = true
    $('#rc-smartpop .card-block').on('mouseover', 'p', function () {
        if (removable && canremove) $(this).addClass('rc-smarton')
        })

    $('#rc-smartpop .card-block').on('mouseleave', 'p', function () {
        $(this).removeClass('rc-smarton')
        })

    $('#rc-smartpop .card-block').on('click', 'p.rc-smarton', function () {
        removable = false
        $('#rc-smartpop .card-block').css('border-color', 'transparent')
        var p = $(this)
        p.removeClass('rc-smarton').css('opacity', '0')
        setTimeout(() => {
            Links.remove($('a', p).attr('href'))
            Links.display()
            }, 400)
        setTimeout(() => {canremove = true, locked = false}, 1000)
        event.preventDefault()
        })

    Links.record()
    Links.display()
    })