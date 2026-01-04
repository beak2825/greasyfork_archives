// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Wiki editing
// @description  Custom wiki editor etc.
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @match        https://www.7cups.com/wiki/*
// @match        https://www.7cups.com/wiki.php?*
// @run-at       document-start
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/368148/7%20Cups%20-%20Wiki%20editing.user.js
// @updateURL https://update.greasyfork.org/scripts/368148/7%20Cups%20-%20Wiki%20editing.meta.js
// ==/UserScript==
(function () {
    var quotestyle = 'margin-left: 2em; border-left: 2px solid #0275d8; padding-left: 1ex;'

    var ckconfig = {
        customConfig: '',
        title: '',
        startupFocus: true,
        skin: 'moonocolor,https://www.webtrix.be/moonocolor/js/ckeditor-4.6.0/skins/moonocolor/',
        toolbar: [
            {name: 'clipboard', items: [ 'Source', '-', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']},
            {name: 'links', items: [ 'Link', 'Unlink', 'Anchor']},
            '/',
            {name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']},
            {name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']},
            '/',
            {name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ]},
            {name: 'colors', items: [ 'TextColor', 'BGColor']},
            {name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar']},
            ],
        stylesSet: [
            {name: 'Box', element: 'div',
              styles: {background: '#eee', padding: '1ex', border: '1px solid #999', 'border-radius': '6px'}},
            {name: 'Marker', element: 'span',
              styles: {'background-color': 'Yellow'}},
            {name: 'Red button', element: 'button', attributes: {type: 'button', class: 'btn btn-danger'},
              styles: {'font-weight': 'bold', cursor: 'default', color: 'white', background: '#d9534f', border: 'none'}}
            ],
        removeButtons: '',
        removePlugins: '',
        floatSpaceDockedOffsetX: -15,
        zzzextraPlugins: 'sourcedialog',
        font_names: '7 Cups/Raleway;Serif/serif;Typewriter/monospace;Cursive/cursive;Novelty/fantasy',
        fontSize_sizes: '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16 [normal]/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px',
        extraAllowedContent: '',
        scayt_autoStartup: true
        }

    var s = document.createElement('STYLE')
    s.textContent = 'div[data-role=wiki] {display: none;}'
      + '#rc-cat-label {position: absolute; top: 1ex; color: #aaa; letter-spacing: 2px;}'
      + '#rc-card {padding: 1em;}'
      + '#rc-title, #rc-body {padding: 2px;}'
      + '#rc-buttons {margin: 24px 0 24px 0;}'
      + '#rc-buttons button.active {background: #9df; color: #00f;}'
      + '#rc-buttons button[disabled] {color: #999;}'
      + '#rc-meta {border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;}'
      + '#rc-meta select {width: 100%; max-width: 100%;}'
      + '#rc-meta table {border-collapse: separate; border-spacing: .5ex;}'
      + '#rc-meta td:last-child {border: 1px solid transparent;}'
      + '#rc-meta td:last-child[contenteditable], #rc-meta td:last-child[data-rc-select] {border: 1px solid #ccc;}'
      + '#rc-cat {position: relative;}'
      + '#rc-cat[data-rc-select] {cursor: pointer;}'
      + '#rc-privacy {display: inline-block; margin-left: 1ex;}'
      + 'i.fa-eye {color: #0bf;}'
      + 'i.fa-eye-slash {color: #f70;}'
      + '#rc-private-area {letter-spacing: 2px; border-top: 2px solid #aaa;}'
      + '#rc-private-area i {display: block; margin-right: 8px;}'
      + '#rc-warning {min-height: 1em; color: #a00;}'
      + 'a[data-rc-href] {color: #00a;}'
      + '#rc-history.disabled {color: #ccc;}'
      + 'div.cke_top {background: linear-gradient(to bottom, #93e1ff, #1e90fe);}'
      + 'div[data-role=version-title] {font-style: italic;}'
      + 'div[data-role=history] strong {font-weight: normal;}'
      + 'div[data-role=history].bg-faded {background-color: initial;}'
      + 'div[data-role=history] {border-bottom: 1px solid #ccc; border-left: 2px solid transparent;}'
      + 'div[data-role=history].rc-this, div[data-role=history].rc-this:hover '
        +'{border-left: 2px solid #0c0; background-color: #cfc !important; cursor: text !important;}'
      + 'span[data-role=wiki-updatedAt] {display: block;}'
    document.head.appendChild(s)

    addEventListener('DOMContentLoaded', function () {
        // fix broken profile images...
        $('img').on('error', function() {
            if (this.src.indexOf('/memberImages/') > 0) {
                this.src = this.src.replace('/memberImages/', '/listenerImages/')
                }
            })

        // fix profile image rounding...
        $('img').on('load', function() {
            this.style.borderRadius = this.src.indexOf('/memberImages/') > 0? '15%' : '50%'
            this.style.opacity = '1'
            this.style.height = '50px'
            var a = $('span[data-role=wiki-author]'), n = a.text().trim()
            a.html('<a href="/@' + n + '">' + n + '</a>')
            })

        // temporarily hide profile image while loading...
        $('div[data-role=history]').on('click', function () {
            $('span[data-role=wiki-author]').prev().css('opacity', '0')
            })

        // identify current history entry...
        var d = $('div[data-role=history]')
        if (d.length) {
            d.on('click', function () {
                $('div[data-role=history]').removeClass('rc-this')
                $(this).addClass('rc-this')
                })
            setTimeout(function () {d.first().click()}, 0)
            }
        if (d.length > 1) $('div[data-role=version-title]', d.last()).text('Initial version')

        // discover listener-only categories...
        var forlisteners = [], t0 = '', t1 = '', private = false
        $('div.left-hand-content li').each(function () {
            var a = $('a', this), id = a.attr('data-id')
            if (!id) return
            if (!private && !$(this).attr('data-parent-cat')) {
                t1 = a.text().trim()
                if (t0 > t1) {
                    private = true
                    $(this).before('<li id="rc-private-area" class="list-group-item flex-nowrap"><i class="fa fa-eye-slash fa-fw"></i> LISTENER-ONLY</li>')
                    }
                else t0 = t1
                }
            forlisteners[id] = private
            })

        // label category page and bail out...
        var tec = $('a#tag-edit-category')
        if (tec.length > 0) {
            console.log('+++ tec ' + tec.attr('data-id') + ' ' + (forlisteners[64]? 'true' : 'false'))
            var p = $('h2.edit-title').parent()
            p.css('position', 'relative')
            p.prepend('<div id="rc-cat-label">' + (forlisteners[tec.attr('data-id')]? 'LISTENER ' : '') + 'CATEGORY</div>')
            $('div[data-role=wiki]').css('display', 'initial')
            return
            }

        var newarticle = $('input#title').length == 1

        // bail out on read-only page...
        if ($('div.edit-chorum').length == 0 && !newarticle) {
            $('div[data-role=wiki]').css('display', 'initial')
            return
            }

        // replace backlevel editor...
        $('.richtext').removeClass('richtext')
        delete window.CKEDITOR
        $('head').append('<script src="https://cdn.ckeditor.com/4.9.2/full-all/ckeditor.js"></script>')

        // set up my UI...
        $('div[data-role=wiki]').parent().prepend(
            '<div id="rc-card" class="card card-shadow">'
            + '<h2 id="rc-title"></h2>'
            + '<div id="rc-body"></div>'
            + '</div>'
            + '<div id="rc-meta"><table><tbody>'
            + '<tr><td>Category:</td><td id="rc-cat"></td></tr>'
            + '<tr><td>Tags:</td><td id="rc-tags"></td></tr>'
            + '<tr><td></td><td id="rc-history"></td></tr>'
            + '</tbody></table></div>'
            + '<p id="rc-warning"></p>'
            + '<div id="rc-buttons">'
            + '<button id="rc-editbutton" class="btn btn-primary" title="Edit article">Edit</button> '
            + '<button id="rc-savebutton" class="btn btn-primary" disabled title="Save changes">Save</button> '
            + '</div>'
            )

        // fetch content from old UI...
        var fetch = function () {
            $('#rc-title').text($('#chorum-heading').text())
            $('#rc-body').html($('div[data-role=wiki] .edit-message').html())

            var th = $('#chorum-tags').html()
            $('#rc-tags').html(th || '<i style="color: #aaa;">not tagged</i>')
            $('#rc-tags a').each(function () {
                this.setAttribute('title', 'Wiki articles tagged ' + this.textContent)
                })
            $('#rc-history').html(
                '<a href="/wiki/history/' + $('#wikiId').val() + '" title="Article history">History</a>'
                + '<i id="rc-privacy" class="fa"></i>'
                )

            var poll = setInterval(function () { // display category eventually...
                var c = $('select[name=category] option:checked')
                if (c.length) {
                    let r = $('#rc-cat'), id = c.val()
                    r.attr('data-id', id)
                    if (id) r.text(c.text().replace(/^\s+/, ''))
                    let privacy = $('#rc-privacy'), private = forlisteners[id]
                    privacy.addClass(private? 'fa-eye-slash' : 'fa-eye')
                    privacy.attr('title', private? 'Article is in a listener-only category' : 'Article is in a public category')
                    clearInterval(poll)
                    }
                }, 100)
            }
        if (!newarticle) fetch()

        // switch edit mode on and off...
        var editmode = function (activate) {
            var edit = $('#rc-editbutton'), save = $('#rc-savebutton'), cathead = $('a[data-role=create-category]').parent()
                title = $('#rc-title'), body = $('#rc-body'), cat = $('#rc-cat'), tags = $('#rc-tags'), hist = $('#rc-history')
            if (activate) {
                title.attr('contenteditable', 'true')
                body.attr('contenteditable', 'true')
                cat.attr('data-rc-select', 'true')
                tags.attr('contenteditable', 'true')

                if (CKEDITOR.instances['rc-body']) body[0].focus()
                else {
                    CKEDITOR.disableAutoInline = true
                    ckconfig.floatSpaceDockedOffsetY = $('#rc-body').offset().top - $('#rc-body').parent().offset().top
                    CKEDITOR.inline(body[0], ckconfig)
                    }

                tags.html($('#chorum-tags').text())
                hist.html('History')
                hist.addClass('disabled')

                cat.attr('title', 'To change the category, select a category from the sidebar')
                edit.attr('title', 'Click again to cancel')
                save.prop('disabled', false)

                $('a[data-role=edit-category]').each(function () { // convert sidebar...
                    var a = $(this)
                    a.attr('data-rc-href', a.attr('href'))
                    a.attr('href', 'javascript:void(0)')
                    a.attr('title', 'Move article here')
                    a.parent().parent().css('background', '#ddd')
                    })
                cathead.hide()
                cathead.first().after('<h5>Move article to:</h5>')

                edit.addClass('active')
                }
            else { // deactivate...
                title.removeAttr('contenteditable')
                body.removeAttr('contenteditable')
                cat.removeAttr('data-rc-select')
                tags.removeAttr('contenteditable')
                hist.removeClass('disabled')

                CKEDITOR.instances['rc-body'].destroy()

                cat.removeAttr('title')
                edit.attr('title', 'Edit article')
                $('#rc-savebutton').prop('disabled', true)

                $('a[data-role=edit-category]').each(function () { // restore sidebar...
                    var a = $(this)
                    a.attr('href', a.attr('data-rc-href'))
                    a.removeAttr('data-rc-href')
                    a.parent().parent().css('background', 'transparent')
                    })
                cathead.first().next('h5').remove()
                cathead.show()

                fetch()
                edit.removeClass('active')
                }
            }

        // my edit button...
        $('body').on('click', '#rc-editbutton', function () {
            if (!$('#rc-editbutton').hasClass('active')) editmode(true)
            else { // deactivate edit mode...
                toastr.success(
                    '<br/><br/><button type="button" id="rc-canceledit" class="btn clear">Yes</button>'
                      + ' &nbsp; <button type="button" id="rc-retainedit" class="btn clear">No</button>',
                    'Really cancel edit mode?',
                    {positionClass: 'toast-top-center', allowHtml: true, preventDuplicates: true}
                    )
                }
            })

        if (newarticle) { // grrrr...poll for editor...
            var poll = setInterval(function () {
                if (window.CKEDITOR) {
                    clearTimeout(poll)
                    $('#rc-editbutton').click()
                    }
                }, 100)
            }

        // cancel edit mode...
        $('body').on('click', '#rc-canceledit', function () {editmode(false)})

        // eat toast...
        $('body').on('click', '#rc-retainedit', function () {toastr.clear()})

        // category choice from sidebar...
        $('body').on('click', 'a[data-rc-href]', function () {
            var c = $('#rc-cat')
            c.attr('data-id', $(this).attr('data-id'))
            c.text($(this).text())
            catclose()
            })

        // my save button...
        $('body').on('click', '#rc-savebutton', function () {
            $('#rc-warning').text('')
            $.ajax({
                url: '/api/wiki/id/' + $('#wikiId').val() + '/',
                method: "POST",
                dataType: "jsonp",
                data: {
                    title: $('#rc-title').text(),
                    category: $('#rc-cat').attr('data-id'),
                    entryId: $('div.edit-btn>input.entryId').val(),
                    message: $('#rc-body').html(),
                    senderId: $('#senderId').val(),
                    senderType: $('#senderType').val(),
                    sort: undefined,
                    status: 'active',
                    type: 'Wiki',
                    tags: $('#rc-tags').text().trim().replace(/^#/, '').replace(/\s*#/g, ',')
                    },
                success: function (r) {
                    if (r.error) {
                        let d = r.details
                        $('#rc-warning').text(r.error || d.message || d.title || d.categoryTitle)
                        }
                    else location.href = '/wiki/' + r.data.chorum.title + '/'
                    }
                })
            })

        // prevent rich text in title...
        $('#rc-title').on('keydown', function () {
            $(this).html(this.text())
            })

        // keyboard shortcuts...
        $('body').on('keydown', function (ev) {
            if (ev.repeat || !ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) return
            var k = ev.key.toUpperCase(), mine = false
            if (k == 'E') $('#rc-editbutton').click(), mine = true
            if (k == 'S') $('#rc-savebutton').click(), mine = true
            if (mine) ev.stopPropagation(), ev.preventDefault()
            })

        // double-click...
        $('#rc-title, #rc-body, #rc-cat, #rc-tags').on('dblclick', function () {
            $('#rc-editbutton').click()
            var target = $(this)
            setTimeout(function () {target.focus()}, 1000) // grrr...timing...
            })

        })

    })()