// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Forum inline editor
// @version      4.5
// @description  Forum inline editor to replace popup (v4)
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/forum/*
// @match        https://www.7cups.com/listener/editAccount.php
// @match        https://www.7cups.com/member/editAccount.php
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/36395/7%20Cups%20-%20Forum%20inline%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/36395/7%20Cups%20-%20Forum%20inline%20editor.meta.js
// ==/UserScript==
(() => {
    let RC_ATTEMPT_EDIT = false // Change this to true if you want to try editing posts.

    // add missing Reply buttons...
    $('div[id^=forum-post-]').each(function () {
        if ($('button[data-modal-template^=SC_Forms_Forum_]', this).length) return
        heart = $('button[data-forum-post-heart]', this)
        if (heart.length) {
            threadid = $('button[data-thread-subscribe]').attr('data-thread-subscribe')
            //parentid = this.id.replace(/[^0-9]/g, '')
            parentid = $('a', heart.parent().prev()).attr('href').match(/\d+$/)
            who = $('a[data-usercard]', this).attr('data-usercard')
            heart.parent().append(' <button type="button" data-toggle="tooltip" class="btn btn-primary mb-1 " '
              + 'data-modal-size="large" data-title="Post to this Thread" data-modal-template="SC_Forms_Forum_postNew" '
              + 'data-param=\'{"threadid":"' + threadid + '","parentpost":"' + parentid + '","name":"' + who + '"}\'>'
              + '<i class="fas fa-reply"></i> Reply</button>')
            }
        })

    // hide post to thread if no replies...
    if ($('[id^=forum-post-]').length == 1) $('[data-title="Post to this Thread"]').hide()

    // post to thread button at top...
    var pn = $('button[data-modal-template^=SC_Forms_Forum_postNew]').first()
    if (pn.length) {
        let pm = JSON.parse(pn.attr('data-param'))
        delete pm.name
        let ptt = pn
            .clone()
            .html('<i class="fas fa-plus-circle"></i> Post to Thread')
            .attr('data-title', 'Post to this Thread')
            .attr('data-param', JSON.stringify(pm).replace(/"/g, '\"'))
            .appendTo(pn.parent())
        }

    // add post links...
    var url = $('link[rel=canonical').attr('href')
    if (url) url = url.replace(/\?.*$/, '')
    $('div[id^=forum-post-]').each(function (i) {
        var post = i == 0? '' : '?post=' + this.id.replace(/[^0-9]/g, ''),
            thing = i == 0? 'thread' : 'post'
				if (i == 0) $(this).css('position', 'relative')
        $(this).prepend('<a title="Link to this ' + thing + '" '
          + 'href="' + url + post + '"'
          + '><i class="fa fa-link rc-fa"></i></a>')
        })

    var Signature = {
        me: '',
        sig: {},
        get: function () {
            this.sig = JSON.parse(localStorage.getItem('rc_signature')) || {}
            this.me = window.userInfo.screenName
            return (this.me in this.sig)? this.sig[this.me] : ''
            },
        put: function (s) {
            this.sig[this.me] = s
            localStorage.setItem('rc_signature', JSON.stringify(this.sig))
            }
        }

    if (location.pathname.indexOf('/editAccount.php') > 0) { // settings...
        if ($('input[name="rc-fontfix"]').length) return // don't load twice!

        if (location.pathname.indexOf('/listener/') >= 0) {
            var lbl = $('label:not([class])').filter(function () {return $(this).text() == 'Display Preferences'})
            lbl.next().append('<label class="custom-control custom-checkbox" for="rc-fontfix">'
              + '<input class="custom-control-input" id="rc-fontfix" type="checkbox" value="1">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description">Load extra fonts in forums '
              + '<i class="fa fa-info-circle text-muted" data-toggle="popover" title="" '
              + 'data-content="Loads cursive and novelty fonts in forums. Use this when your web browser does not display these fonts nicely. This setting autosaves without saving changes to your settings."'
              + 'data-original-title="Extra fonts in forums"></i></span>'
              + '</label>'

              + '<label class="custom-control custom-checkbox" for="rc-noscayt">'
              + '<input class="custom-control-input" id="rc-noscayt" type="checkbox" value="1">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description">Use browser&apos;s spellchecker '
              + '<i class="fa fa-info-circle text-muted" data-toggle="popover" title="" '
              + 'data-content="Enables your web browser&apos;s spellchecker in forums and feeds, disabling the external spellchecker. This setting autosaves without saving changes to your settings."'
              + 'data-original-title="Use browser&apos;s spellchecker"></i></span>'
              + '</label>')
            lbl = $('label:not([class])').filter(function () {return $(this).text() == 'Screen Name'})
            lbl.parent().after('<div class="form-group">'
              + '<label for="rc-signature" style="margin-top: 1ex;">Forum signature: '
              + '<i class="fa fa-info-circle text-muted" data-toggle="popover" title="" '
              + 'data-content="Adds a signature to every forum post. This setting autosaves without saving changes to your settings."'
              + 'data-original-title="Forum Signature"></i></label>'
              + '<input id="forum-signature" class="form-control">'
              + '</div>')
            }
        else { // member...
            $('h4').eq(3).before('<h4 class="formDivider">Display Preferences</h4>'
              + '<div class="form-group row">'
              + '<label class="control-label col-xs-12 col-md-3" for="rc-fontfix">Load extra fonts in forums</label>'
              + '<div class="col-xs-12 col-md-9 form-wrap"><label class="custom-control custom-checkbox">'
              + '<input class="custom-control-input" id="rc-fontfix" type="checkbox">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description"></span>'
              + '</label></div>'

              + '<label class="control-label col-xs-12 col-md-3" for="rc-noscayt">Use browser&apos;s spellchecker</label>'
              + '<div class="col-xs-12 col-md-9 form-wrap"><label class="custom-control custom-checkbox">'
              + '<input class="custom-control-input" id="rc-noscayt" type="checkbox">'
              + '<span class="custom-control-indicator"></span>'
              + '<span class="custom-control-description"></span>'
              + '</label></div>'

              + '<label for="rc-signature" class="control-label col-xs-12 col-md-3" style="margin-top: 1ex;">Forum signature</label>'
              + '<div class="col-xs-12 col-md-9 form-wrap">'
              + '<input id="forum-signature" class="form-control input-large">'
              + '</div></div>')
            }
        var sig = $('#forum-signature'), s = Signature.get()
        if (s) sig.val(s)
        sig.on('keyup', function () {Signature.put(sig.val())})
        var chk = $('#rc-fontfix')
        if (localStorage.getItem('rc_fontfix')) chk.prop('checked', true)
        chk.on('change', function () {
            localStorage[this.checked? 'setItem' : 'removeItem']('rc_fontfix', '1')
            })
        chk = $('#rc-noscayt')
        if (localStorage.getItem('rc_noscayt')) chk.prop('checked', true)
        chk.on('change', function () {
            localStorage[this.checked? 'setItem' : 'removeItem']('rc_noscayt', '1')
            })
        return
        }

    // forum...
    if (!window.$.summernote) return // editor must be present
    if ($('#rc-inline-style').length) return // don't load twice!

    // my stylesheet...
    $('body').append('<style id="rc-inline-style">' +
      '#rc-inline {min-height: 8em; border: 1px solid #ccc; margin-bottom: 40px; padding: 1em; box-shadow: 2px 2px 6px #ccc;}' +
      '#rc-inline h3 {height: 1.25em; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}' +
      '#rc-inline h5 {line-height: 1.5em;}' +
      '#rc-edit-icon {color: #0275d8; margin-right: 4px; text-shadow: 1px 1px 2px #8bf;}' +
      '#rc-title {width: 100%; padding-left: 1ex;}' +
      '#rc-editor {display: none; visibility: collapse;}' +
      '#rc-controls {height: 72px;}' +
      '#rc-buttons {display: block; float: right;}' +
      '#rc-buttons button {margin: 0 0 1em 2ex; min-width: 6em; font-size: .9375rem; padding: .5rem 1rem; text-align: center;}' +
      '#rc-warning {color: #a00; height: 24px; transition: opacity 1s; margin-top: 2px;}' +
      '.btn-primary.rc-inactive {color: #ccc; background: #eee;}' +
      '.btn-primary.rc-inactive:hover, .btn-simple.btn-primary.rc-inactive:focus {color: #ccc; background: inherit;}' +
      '.postMessageCopy[contenteditable=true] {padding: 1ex;}' +
      '#rc-charcount {float: left; padding-top: 11px; font-size: 11px; font-weight: bold;}' +
      '.note-frame {border-radius: 0;}' +
      '.note-toolbar {background: linear-gradient(0deg, #9cf, #def);}' +
      '.note-editor.note-frame .note-statusbar .note-resizebar {background-color: #9cf; height: 4px; padding-top: 0;}' +
      '.note-editable {line-height: 1.8125;}' +
      '.note-btn-group .note-btn {font-size: 16px; color: #555; padding: .4rem .65rem .25rem .65rem;}' +
      '.note-toolbar .note-color-all button.dropdown-toggle {padding-left: 0;}' +
      '.note-btn-group .note-btn.note-current-color-button+.dropdown-toggle {width: 26px; padding-left: 0;}' +
      //'.note-btn-group.note-insert button:nth-last-child(2) {border-top-right-radius: 1rem !important; border-bottom-right-radius: 1rem !important;}' +
      '.note-icon-bar:last-child {display: none;}' +
      '.rc-fa {position: absolute; top: 1.25em; right: 1.25em;}' +
      '</style>')

    // redefine toolbar icons...
    $.extend($.summernote.options.icons, {
        'align': 'fa fa-align',
        'alignCenter': 'fa fa-align-center',
        'alignJustify': 'fa fa-align-justify',
        'alignLeft': 'fa fa-align-left',
        'alignRight': 'fa fa-align-right',
        'indent': 'fa fa-indent',
        'outdent': 'fa fa-outdent',
        'arrowsAlt': 'fa fa-arrows-alt',
        'bold': 'fa fa-bold',
        'caret': 'fa fa-caret-down',
        'circle': 'fa fa-circle',
        'close': 'fa fa fa-close',
        'code': 'fa fa-code',
        'eraser': 'fa fa-eraser',
        'font': 'fa fa-font',
        'italic': 'fa fa-italic',
        'link': 'fa fa-link',
        'unlink': 'fa fa-chain-broken',
        'magic': 'fa fa-magic',
        'menuCheck': 'fa fa-check',
        'minus': 'fa fa-minus',
        'orderedlist': 'fa fa-list-ol',
        'pencil': 'fa fa-pencil',
        'picture': 'far fa-image',
        'question': 'fa fa-question',
        'redo': 'fa fa-repeat',
        'square': 'fa fa-square',
        'strikethrough': 'fa fa-strikethrough',
        'subscript': 'fa fa-subscript',
        'superscript': 'fa fa-superscript',
        'table': 'fa fa-table',
        'textHeight': 'fa fa-text-height',
        'trash': 'fa fa-trash',
        'underline': 'fa fa-underline',
        'undo': 'fa fa-undo',
        'unorderedlist': 'fa fa-list-ul',
        'video': 'fas fa-video'
        })

    // sentence case tooltips, key tips...
    {   let lang = $.summernote.options.langInfo
        for (let m in lang) {
            for (let t in lang[m]) {
                lang[m][t] = lang[m][t].replace('Insert ', '')
                lang[m][t] = lang[m][t].replace('Picture', 'Image')
                lang[m][t] = lang[m][t].charAt(0) + lang[m][t].substring(1).toLowerCase()
                }
            }
        lang.image.selectFromFiles = '<b>Either:</b> Upload local image file to Imgur:'
        lang.image.url = '<b>Or:</b> Specify public URL of remote image:'
        }

    // fix button titles after load...
    var fixtitles = () => {
        $('.note-toolbar button').each(function () {
            if ($(this).attr('data-original-title')) $(this).attr('data-original-title', $(this).attr('data-original-title')
                .replace('CTRL', 'Ctrl')
                .replace('SHIFT', 'Shift')
                .replace('ENTER', 'Enter')
                .replace('NUM', 'Num')
                )
            })
        $('i.emoji-picker').parent()
            .attr('data-toggle', 'tooltip')
            .attr('data-placement', 'bottom')
            .attr('data-original-title', 'emoji')
        }

    // some preloads...
    // no preloads!

    // summernote config...
    var snconfig = {
        toolbar: [
            ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['picture', 'link', 'video', 'table', 'hr', 'emoji']],
            ['misc', ['codeview', 'fullscreen']]
            ],
        dialogsInBody: false,
        focus: true,
        }

    // upload image to imgur...
    $.summernote.options.callbacks.onDialogShown = function () { // dialog setup...
        var inp = $('input.note-image-input') // image...
        if (inp.length && inp.attr('multiple')) inp.removeAttr('multiple')
        var s = document.getSelection() // paragraph...
        console.log(s.anchorNode)
        }

    $.summernote.options.callbacks.onBeforeCommand = function () {
        console.log('onBeforeCommand')
        }

    $.summernote.options.callbacks.onImageUpload = async function (files) {
        $('#rc-inline h3').append('<i id="rc-upload-wait" class="fa fa-spin fa-spinner"></i>')
        var data = new FormData()
        data.append('image', files[0])
        var r = await fetch('https://api.imgur.com/3/image/', {
            method: 'POST',
            headers: {Authorization: 'Client-ID c86f922e5ff9e4e'},
            body: data
            })
        // console.log('status' + r.status + ' ' + typeof(r.status))
        if (r.status == 200) {
            r = await r.json()
            $('#rc-editor').summernote('insertImage', r.data.link)
            }
        else {
            // console.log('upload fail ' + r.status)
            r = await r.json()
            // console.log(r)
            warn('Upload failed: ' + (typeof(r.data.error) == 'string'? r.data.error : r.data.error.message))
            }
        $('#rc-upload-wait').remove()
        }


    // classes for indentation and images...
    $.summernote.options.callbacks.onChange = function () {
        $('div.note-editable p').each(function () {
            var m = parseInt(this.style.marginLeft || '0')
            if (m == 0) this.className = ''
            else if (m >= 20 && m <= 25) this.className = "ml-xl-4", this.style.marginLeft = '25px'
            else if (m >= 45) this.className = "ml-xl-5", this.style.marginLeft = '50px'
            })
        $('div.note-editable img').each(function () {
            this.className = ''
            var w = this.style.width
            if (w == '100%') this.className = 'w-100', this.style.width = ''
            else if (w == '50%') this.className = 'w-50', this.style.width = ''
            else if (w == '25%') this.className = 'w-25', this.style.width = ''
            var f = this.style.float
            if (f) this.className = (this.className + ' float-' + f).trim()
            })
         }

    // convert buttons...
    $('button[data-modal-template^=SC_Forms_Forum_]').each(function () {
        var b = $(this),
            m = b.attr('data-modal-template').split('_').pop(),
            who = JSON.parse(b.attr('data-param')).name
        if (['postNew', 'threadNew', (RC_ATTEMPT_EDIT === true? 'postEdit' : 'rc-never')].includes(m)) {
            b.removeAttr('data-modal-template')
            b.addClass('rc-editbutton ' + 'rc-' + m.replace('New', '').replace('postEdit', 'edit'))
            if (who) b.attr('data-title', 'Reply to @' + who)
            else if (b.attr('data-title') == 'Post to this Thread')
                b.html('<i class="fas fa-plus-circle"></i> Post to Thread')
            }
        })

    $('body').on('click', 'button.rc-editbutton', evt => {
        if ($('#rc-editor').length) { // already active
            ($('#rc-inline')[0] || $('#rc-editor')[0]).scrollIntoView()
            scrollBy(0, -12 - $('#navbar-main').outerHeight())
            let isedit = $('#rc-editor')[0].rc_isedit
            if (isedit) scrollBy(0, -120)
            return
            }
        var t = $(evt.target.tagName == 'BUTTON'? evt.target : evt.target.parentNode),
            pm = JSON.parse(t.attr('data-param')),
            thread = pm.threadid || '',
            forum = pm.forumid || '',
            parent = pm.parentpost || '',
            replyto = pm.name || '',
            ispost = t.hasClass('rc-post'),
            isedit = t.hasClass('rc-edit'),
            origin = t.parents('div[id^=forum-post-]'),
            isown = isedit && $('a', origin).first().attr('href') == '/@' + window.userInfo.screenName,
            content = replyto? '<p>@' + replyto + '&nbsp;</p>' : '',
            title = ispost? $('li.breadcrumb-item.active').text() : 'New Thread',
            subtitle = ispost? '<h5>' + (replyto? 'Reply to @' + replyto : 'Post to thread') + '</h5>' : 'Post:<br/>',
            issub = thread && $('.subscribeButton').attr('data-thread-subscribe-set') == '0',
            sublabel = issub? 'Remain subscribed' : 'Subscribe',
            thing = isedit? 'edit' : (replyto? 'reply' : (ispost? 'post' : 'new thread'))
        if (origin.length == 0) {
            console.log('no origin')
            if (thread) origin = $('div[id^=forum-post-]').first()
            else if (forum) origin = t.parent().nextAll('h3')
            origin.css('margin-bottom', '1em')
            }
        origin.addClass('rc-origin')
        s = Signature.get().replace(/</g, '&lt;')
        if (s) content += (content? '' : '<br>')
          + '<p class="rc-hr" style="width: 100%; height: 1px; background-color: #ccc; margin: 0;">&nbsp;</p>'
          + '<p class="rc-sig" style="font-size: 13px; color: #aaa; margin-bottom: 0;'
          + 'position: relative; top: 1ex;">' + s + '</p>'

        if (isedit) { // edit existing post...
            console.log('isedit')
            console.log(origin)
            $('button', origin).hide()
            console.log($('.card-block', origin).length)
            $('div', origin).last().append(
                '<p id="rc-reason"><select>' +
                '<option value="">No specified reason for edit</option>' +
                '<option value="0">Innappropriate language or content</option>' +
                '<option value="1">Unsupportive</option>' +
                '<option value="2">Sharing personal information</option>' +
                '</select></p>' +
                '<div id="rc-buttons">' +
                '<button id="rc-cancelpost" type="button" class="btn btn-primary" title="Cancel this ' + thing + '"><i class="fas fa-trash"></i> Cancel</button>' +
                '<button id="rc-submitpost" type="button" class="btn btn-primary btn-default" title="Save this ' + thing + '"><i class="fas fa-file-upload"></i> Save</button>' +
                '</div>'
                )
            let b = $('.forumPostBottom', origin)
            b.css('position', 'relative')
            b.append('<p id="rc-warning" style="position: absolute; top: -1.67em; right: 1em; color: #a00; margin: 0;"></p>')
            origin.css('box-shadow', '0 0 1ex 0 ' + (isown? '#00a' : '#a00'))
            let copy = $('div[data-id=post-body]', origin)
            copy.attr('id', 'rc-editor')
            copy.attr('form', 'rc-editform')
            copy.prop('contenteditable', true)
            let actionurl = '/apiv2/forum/thread/post'
            origin.append(
                '<form id="rc-editform" action="' + actionurl + '" method="PUT">' +
                '<input type="hidden" name="postID" value="' + origin[0].id.replace('forum-post-', '') + '">' +
                '<input type="hidden" name="postMessage">' +
                '<input type="hidden" name="reason">' +
                '</form>'
                )
            }
        else { // reply or post to thread...
            let actionurl = '/apiv2/forum/thread' + (thread? '/post' : '')
            origin.after(
                '<div id="rc-inline"' +
                (parent? ' style="margin-left: 2em;"' : '') + '>' +
                '<h3><i id="rc-edit-icon" class="fa fa-edit fa-lg" aria-hidden="true"></i>' + title + '</h3>' +
                '<form action="' + actionurl + '" method="POST">' +
                (thread? '<input type="hidden" name="threadID" value="' + thread + '">' : '') +
                (forum? '<input type="hidden" name="forumID" value="' + forum + '">' : '') +
                (ispost? '<input type="hidden" name="parentPost" value="' + parent + '">' : '') +
                '<input type="hidden" name="i" value="' + (ispost? 'post' : 'thread') + '">' +
                '<input type="hidden" name="a" value="add">' +
                (ispost? '' :
                  '<p><label for="rc-title">Thread title:</label><br/><input type="text" id="rc-title" name="threadTitle" autocomplete="off"></p>') +
                '<div>' + subtitle +
                '<textarea id="rc-editor" name="postMessage" class="postMessageCopy"></textarea></div>' +
                '<div id="rc-controls">' +
                '<p id="rc-warning"></p>' +
                '<label class="c-input c-checkbox" title="When subscribed you receive notifications of changes to this thread">' +
                '<input type="checkbox" name="subscribeThread" id="rc-subscribeThread" checked="checked"> ' + sublabel + '</label>' +
                '<div id="rc-buttons">' +
                '<button id="rc-cancelpost" type="button" class="btn btn-primary" title="Cancel this ' + thing + '"><i class="fas fa-trash"></i> Cancel</button>' +
                '<button id="rc-submitpost" type="button" class="btn btn-primary btn-default" title="Send this ' + thing + '"><i class="fas fa-paper-plane"></i> Send</button>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>')
            }

        var ed = $('#rc-editor')[0]
        ed.rc_origin = origin
        ed.rc_ispost = ispost
        ed.rc_isedit = isedit
        ed.rc_isown = isown
        ed.rc_thing = thing
        ed.rc_secure = true
        ed.rc_ischanged = false
        if (!ispost && !isedit) $('#rc-title').focus()

        // set up summernote here...
        var $ed = $('#rc-editor')
        $ed.summernote(snconfig)
        if (content && !isedit) $ed.summernote('code', content)
        if (!ispost) $('#rc-title').focus()

        fixtitles()
			  $('[data-toggle]').each(function () {$(this).attr('data-bs-toggle', $(this).attr('data-toggle'))})

        // initial focus...
        if (!isedit && replyto) {
            var n = $('div.note-editable')[0],
                s = getSelection(),
                r = document.createRange()
            r.setStart(n.firstElementChild.firstChild, replyto.length + 2)
            r.collapse(true)
            s.removeAllRanges()
            s.addRange(r)
            }

        // fix emoji icon...
        $('.emoji-picker-container').parent().addClass('dropdown-toggle')

        $('button.rc-editbutton').addClass('rc-inactive')
            .attr('title', 'Scroll to ' + ed.rc_thing + ' in progress')
        })

    $('body').on('click', '#rc-cancelpost', () => { // cancel...
        var origin = $('.rc-origin'),
            rci = $('#rc-inline')
        if (rci.length) rci.remove() // new or reply
        else { // edit...
            $('#rc-editor').summernote('destroy')
            $('#rc-reason').remove()
            $('#rc-buttons').remove()
            $('#rc-editform').remove()
            $('button', origin).show()
            let copy = $('div[data-id=post-body]', origin)
            copy.removeAttr('id')
            copy.css('margin-top', '0')
            copy.prop('contenteditable', false)
            }
        $('button.rc-editbutton').removeClass('rc-inactive')
            .removeAttr('title')
        origin.removeClass('rc-origin')
        origin.css('box-shadow', '')
        })

    var cap = t => t.charAt(0).toUpperCase() + t.substr(1)

    var cutdown = t => t.replace(/<p>|<\/p>|&nbsp;|<br\s?\/?>|\s/g, ' ')

    var warn = m => {
        var w = $('#rc-warning')
        w.text(m)
        setTimeout(function () {w.css('opacity', '0')}, 6000)
        setTimeout(function () {w.text(''), w.css('opacity', '1')}, 6500)
        }

    var submit = async form => { // apiv2...
        var r = await fetch(form.action, {
            method: form.method,
            body: new URLSearchParams(new FormData(form)),
            cache: 'no-store',
            })
        if (r.status == 200) {
            let data = await r.json()
            location.href = data.url
            }
        else {
            console.log('Refused: ');console.log(r)
            warn('Refused (possibly censored)')
            let m = await r.text()
            // console.log('submit response: ' + r + ' ' + m)
            setTimeout(function () {
                var sp = $('#rc-submitpost')
                sp.text(sp.attr('data-was'))
                $('#rc-buttons button').prop('disabled', false)
                }, 4000)
            }
        }

    $('body').on('click', '#rc-submitpost', async evt => { // send...
        var ed = $('#rc-editor')[0], txt
        ed.textContent = txt = $('div.note-editable').html()
        if (!ed.rc_ispost && !ed.rc_isedit) {
            txt = $('#rc-title').val().trim()
            if (txt == '') {
                warn('You must provide a title')
                $('#rc-title').focus()
                return
                }
            }
        if (ed.rc_isedit) $('#rc-editform input[name=reason]').val($('#rc-reason').val())

        if (ed.rc_secure && txt.match(/src="http:/)) {
            warn('An image is not secure. Specify an https: URL, or send again to override.')
            ed.rc_secure = false
            setTimeout(() => {ed.rc_secure = true}, 4000)
            return
            }

        if (!ed.rc_ischanged && (txt == '' || txt == ed.rc_datawas)) {
            warn(ed.rc_isedit? 'Nothing to save? Save again if you really mean this.' : 'Your ' + ed.rc_thing + ' cannot be empty!')
            ed.rc_ischanged = true
            return
            }
        $('#rc-buttons button').prop('disabled', true)

        var sp = $('#rc-submitpost')
        sp.attr('data-was', sp.text())
        sp.html('<i class="fa fa-lg fa-spinner fa-spin"></i>')

        if (ed.rc_isedit) {
            await submit($('#rc-editform')[0])
            }
        else {
            let s = $('#rc-subscribeThread'), // force subscribe status...
                p = s.prop('checked')? '1' : '0'
            let b = $('button.subscribeButton').first()
            if (b.length) { // existing thread...
                if (b.attr('data-thread-subscribe-set') == p) b.click()
                }
            else { // new thread...
                if (p) localStorage.setItem('rc_subscribe', 'true')
                }
            await submit($('#rc-inline form')[0])
            }
        })

    if (localStorage.getItem('rc_subscribe')) {
        $('button.subscribeButton').first().click()
        localStorage.removeItem('rc_subscribe')
        }

    if (localStorage.getItem('rc_fontfix')) {
        WebFontConfig = {
            google: {families: ['Italianno','Shadows Into Light']},
            active: function () {
                $('span[style*="font-family:cursive"]').css({'font-family': 'Italianno,cursive', 'font-size': '180%'})
                $('span[style*="font-family:fantasy"]').css({'font-family': '"Shadows Into Light",fantasy', 'font-size': '105%'})
                }
            }
        let wf = document.createElement('script'), s0 = document.scripts[0]
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
        wf.async = true
        s0.parentNode.insertBefore(wf, s0)
        }

    if ($('script[src*=greasyfork]').length) setTimeout(function () {toastr.success('Inline editor')}, 100) // for bookmarklet
})();