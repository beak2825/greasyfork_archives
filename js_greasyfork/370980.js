// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Dark theme
// @description  Dark theme
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @match        http://www.7cups.com/*
// @noframes
// @run-at       document-body
// @grant        none
// @version      2.0
// @downloadURL https://update.greasyfork.org/scripts/370980/7%20Cups%20-%20Dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/370980/7%20Cups%20-%20Dark%20theme.meta.js
// ==/UserScript==
(function () {
    var profile = localStorage.getItem('rc_dark')
    if (profile) profile = JSON.parse(profile)
    else profile = [-72, 0.5, -1, true, true, ''] // default dark theme: brightness, contrast, dark, apply, images, useCSS, CSS
    profile[4] = profile[4]? true : false // image contrast - upgrade from v. 1.2
    profile[5] = profile[5]? true : false // useCSS - upgrade from v. 1.3
    if (!profile[6]) profile[6] = '' // CSS - upgrade from v. 1.3

    var darken = function (css, important) { // darken a rule...
        if (css.indexOf('rgb') < 0) return css

        var p0 = 0, p1 = 0
        while (p0 >= 0) {
            p0 = css.indexOf('rgb', p1)
            if (p0 < 0) break
            p1 = css.indexOf(')', p0) + 1
            css = css.substring(0, p0) + adjust(css.substring(p0, p1)) + css.substring(p1)
            }

        return css + (important? ' !important' : '')
        }

    var adjust = function (c) { // adjust rgb or rgba...
        if (c.indexOf('rgb') < 0) return c

        var hasalpha = c.indexOf('rgba') == 0
        c = c.replace('rgb(', '').replace('rgba(', '').replace(')', '')

        var rgb = c.split(',')
        var r = parseInt(rgb[0]),
            g = parseInt(rgb[1]),
            b = parseInt(rgb[2]),
            a = hasalpha? rgb[3] : ''

        // derive YCbCr...
        var y = .299 * r + .587 * g + .114 * b,
            cb = 128  -  .168736 * r - .331264 * g + .5 * b,
            cr = 128 + .5 * r - .418688 * g - .081312 * b

        // darken Y...
        y = choke((profile[2] == -1? 255 : 0) + profile[0] + profile[1] * profile[2] * y)

        // reconstruct rgb...
        if (y == 0) r = g = b = 0
        else if (y == 255) r = g = b = 255
        else {
            r = choke(y + 1.402 * (cr - 128))
            g = choke(y - .344136 * (cb - 128) - .714136 * (cr - 128))
            b = choke(y + 1.772 * (cb - 128))
            }

        if (hasalpha) return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
        else return 'rgb(' + r + ', ' + g + ', ' + b + ')'
        }

    var choke = function (v) {
        if (v < 0) return 0
        if (v > 255) return 255
        return Math.round(v)
        }

    var darkenpage = function () {
        var ss = document.styleSheets, dark = ''

        for (let i = 0; i < ss.length; ++i) {
            let sheet = ss[i]
            var rr
            try {rr = sheet.cssRules} catch (e) {}
            if (!rr) try {rr = sheet.rules} catch (e) {}
            if (!rr) continue
            for (let j = 0; j < rr.length; ++j) {
                let rule = rr[j]
                if (rule.type != 1 || !rule.style) continue
                let style = rule.style
                if (style.color && style.color.indexOf('rgb') >= 0)
                    dark += rule.selectorText + ' {color: ' + darken(style.color, style.getPropertyPriority('color')) + ';} '
                if (style.backgroundColor && style.backgroundColor.indexOf('rgb') >= 0)
                    dark += rule.selectorText + ' {background-color: ' + darken(style.backgroundColor, style.getPropertyPriority('backgroundColor')) + ';} '
                if (style.backgroundImage && style.backgroundImage.indexOf('gradient') >= 0)
                    dark += rule.selectorText + ' {background-image: ' + darken(style.backgroundImage, style.getPropertyPriority('backgroundImage')) + ';} '
                }
            }

        if (profile[4]) dark += 'img, [style*="url"] {opacity: ' + profile[1] + ';} '
        if (profile[5] && profile[6]) dark += profile[6]

        var s = document.createElement('STYLE')
        s.id = 'rc_dark'
        s.textContent = dark
        document.head.appendChild(s)
        }

    var darkenmore = function (dark) {
        if (dark) {
            $('[style*=color]').each(function () {
                if (this.style.color && !this.hasAttribute('data-rc-colorwas')) {
                    this.setAttribute('data-rc-colorwas', this.style.color)
                    this.style.color = adjust(this.style.color)
                    }
                if (this.style.backgroundColor && !this.hasAttribute('data-rc-backgroundwas')) {
                    this.setAttribute('data-rc-backgroundwas', this.style.backgroundColor)
                    this.style.backgroundColor = adjust(this.style.backgroundColor)
                    }
                })
            }
        else {
            $('[data-rc-colorwas], [data-rc-backgroundwas]').each(function () {
                var c = this.getAttribute('data-rc-colorwas'), b = this.getAttribute('data-rc-backgroundwas')
                if (c) this.style.color = c
                if (b) this.style.backgroundColor = b
                })
            }
        }

    var darkenspecial = function (dark) {
        var r0 = 'linear-gradient(to bottom, rgb(119, 200, 246) 0%, rgb(152, 166, 210) 100%)'
        if (dark) {
            $('.main-content-window, #growthPathWell').css('background-image', darken(r0))
            }
        else {
            $('.main-content-window, #growthPathWell').css('background-image', r0)
            }
        }

    var s = document.createElement('STYLE')
        s.id = 'rc_dark_ui'
        s.textContent = '#rc_darkbutton {width: auto; color: #eee; padding: 2px 2px 0 2px; border: 1px solid transparent; border-radius: 4px; cursor: pointer;}'
          + '#rc_darkbutton:hover {border: 1px solid #fff;}'
          + '#rc_darkbutton.rc_on {border: 1px inset #ccc; color: #aaa;}'
          + '#rc_darkbutton.rc_on:hover {border: 1px inset #fff;}'
          + '#rc_theme_table {width: 100%; margin-top: 1ex;}'
          + '#rc_theme_table td:first-child {width: 10em;}'
          + '#rc_theme_table td {vertical-align: middle;}'
          + '#rc_theme_table input[type=range] {width: 100%;}'
          + '#rc_css {width: 100%; min-height: 4em;}'
        document.head.appendChild(s)

    addEventListener('DOMContentLoaded', function () {
        if (profile[3]) darkenmore(true), darkenspecial(true)

        $('#navbar-main ul.navbar-nav:not(.flex-last)').first().prepend(
            '<li id="rc_darkbutton" class="nav-item rc_on" onclick="rc_Dark.apply(null)"'
              + 'data-toggle="tooltip" data-placement="bottom" data-original-title="Click to remove<br/>custom theme" data-html="true">'
              + '<i class="fa fa-2x fa-eye"></i></li>'
            )

        if (!profile[3]) $('#rc_darkbutton')
            .removeClass('rc_on')
            .attr('data-original-title', 'Click to apply<br/>custom theme')

        if (location.pathname.indexOf('editAccount.php') >= 0) {
            let table = '<table id="rc_theme_table"><tbody>'
              + '<tr>'
              + '<td>&nbsp;</td>'
              + '<td><label class="custom-control custom-checkbox" for="rc_invert">'
              + '<input id="rc_invert" class="custom-control-input" type="checkbox" onchange="rc_Dark.slider(this)">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description">Dark theme</span>'
              + '</label></td>'
              + '</tr>'
              + '<tr>'
              + '<td>Brightness: <span id="rc_brightness_value"></span></td>'
              + '<td><input id="rc_brightness" type="range" min="-100" max="100" step="1"onchange="rc_Dark.slider(this)"></td>'
              + '</tr>'
              + '<tr>'
              + '<td>Contrast: <span id="rc_contrast_value"></span></td>'
              + '<td><input id="rc_contrast" type="range" min="0" max="125" step="1" onchange="rc_Dark.slider(this)"></td>'
              + '</tr>'
              + '<tr>'
              + '<td>&nbsp;</td>'
              + '<td><label class="custom-control custom-checkbox" for="rc_image">'
              + '<input id="rc_image" class="custom-control-input" type="checkbox" onchange="rc_Dark.slider(this)">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description">Apply contrast to images</span>'
              + '</label></td>'
              + '</tr>'
              + '<tr>'
              + '<td>&nbsp;</td>'
              + '<td><label class="custom-control custom-checkbox" for="rc_usecss">'
              + '<input id="rc_usecss" class="custom-control-input" type="checkbox" onchange="rc_Dark.slider(this)">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description">Use custom styles</span>'
              + '</label></td>'
              + '</tr>'
              + '<tr>'
              + '<td id="rc_csstd" colspan="2">'
              + 'Custom style rules (CSS):<br/>'
              + '<textarea id="rc_css" rows="5" onkeyup="rc_Dark.slider(this)"></textarea>'
              + '</td>'
              + '</tr>'
              + '</tbody></table>'
            if (location.pathname.indexOf('/listener/') >= 0) $('h6').eq(2).before(
                    '<h6 class="form-section">Dark Theme</h6>'
                    + '<p class="text-help">See the <a href="https://rarelycharlie.github.io/howto/dark#settings">documentation</a> for information about these settings.</p>'
                    + table
                  )
            else if (location.pathname.indexOf('/member/') >= 0) $('h4').eq(3).before(
                    '<h4 class="formDivider">Dark Theme</h4>'
                    + '<p>See the <a href="https://rarelycharlie.github.io/howto/dark#settings">documentation</a> for information about these settings.</p>'
                    + table
                  )
            $('#rc_brightness').attr('value', profile[0] / 3.6)
            $('#rc_brightness_value').text(Math.round(profile[0] / 3.6) + '%')
            $('#rc_contrast').attr('value', profile[1] * 100)
            $('#rc_contrast_value').text(Math.round(profile[1] * 100) + '%')
            $('#rc_invert')[0].checked = profile[2] == -1
            $('#rc_image')[0].checked = profile[4]
            $('#rc_usecss')[0].checked = profile[5] && profile[6]
            if (!profile[5] || !profile[6]) $('#rc_csstd').hide()
            if (profile[6]) $('#rc_css').val(profile[6])
            }

        })

    window.rc_Dark = {
        timer: 0,

        apply: function (dark) {
            var style = $('#rc_dark'), button = $('#rc_darkbutton')
            if (dark === null) dark = style.length == 0
            style.remove()
            if (dark) {
                darkenpage()
                darkenmore(true)
                darkenspecial(true)
                button.addClass('rc_on')
                button.attr('data-original-title', 'Click to remove<br/>custom theme')
                profile[3] = true
                }
            else {
                darkenmore(false)
                darkenspecial(false)
                button.removeClass('rc_on')
                button.attr('data-original-title', 'Click to apply<br/>custom theme')
                profile[3] = false
                }
            localStorage.setItem('rc_dark', JSON.stringify(profile))
            },

        slider: function (inp) {
            if (this.timer) this.timer = clearTimeout(this.timer)

            if (inp.id == 'rc_invert') {
                profile[2] = inp.checked? -1 : 1
                }
            else if (inp.id == 'rc_image') {
                profile[4] = inp.checked
                }
            else if (inp.id == 'rc_usecss') {
                profile[5] = inp.checked
                $('#rc_csstd')[inp.checked? 'show' : 'hide'](500)
                }
            else if (inp.id == 'rc_css') {
                profile[6] = inp.value
                console.log('+++ ' + profile[6])
                }
            else if (inp.id == 'rc_brightness') {
                profile[0] = Math.round(inp.value * 3.6) // true range -360 to +360
                $('#rc_brightness_value').text(Math.round(inp.value) + '%')
                }
            else {
                profile[1] = Math.round(inp.value) / 100 // true range -1 to +1
                $('#rc_contrast_value').text(Math.round(inp.value) + '%')
                }
            localStorage.setItem('rc_dark', JSON.stringify(profile))

            this.timer = setTimeout(function () {
                rc_Dark.apply(true)
                }, 800)
            }
        }

    if (profile[3]) darkenpage()
})()