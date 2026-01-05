// ==UserScript==
// @name         7 Cups - Forum post dialog
// @namespace    http://tampermonkey.net/
// @description  Fix forum post dialog
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/forum/*
// @match        http://www.7cups.com/forum/*
// @run-at       document-idle
// @grant        none
// @version      2
// @downloadURL https://update.greasyfork.org/scripts/18191/7%20Cups%20-%20Forum%20post%20dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/18191/7%20Cups%20-%20Forum%20post%20dialog.meta.js
// ==/UserScript==
(function() {
    if (window.parent != window) return;

    rc_post_reply = {
        active: false, // only true when a reply/post button has been clicked
		resize: false, // only true while resizing
		observer: null, // Mutation Observer
        cke: null, // the editor
        startX: 0,
        startY: 0,
        startW: 0,
        startH: 0,
        init: function (elem) { // step 2 - when the modal body appears...
            if (!this.active) return;

            var cr = CKEDITOR.replace;
            CKEDITOR.replace = function (h, d) {
                var ed = cr(h, {
                    toolbar: [
                        { name: 'document', items: [ 'Source', '-' ] },
                        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                        { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
                        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                        '/',
                        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
                        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
                        '/',
                        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
                        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                        { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar' ] },
                        ],
                    font_names: '7 Cups/Raleway;Serif/serif;Typewriter/monospace;Cursive/cursive;Novelty/fantasy',
                    extraAllowedContent: '*(*){*}',
                    startupFocus: true,
                    scayt_autoStartup: true
                    });

                    ed.on('instanceReady', function (evt) {
                        evt.editor.filter.addTransformations([
                            [ // group...
                                { // rule...
                                    element: 'blockquote',
                                    left: function(e) {return !e.attributes.foo;},
                                    right: function(e, tools) {e.attributes.style = 'bar';}
                                }
                            ]
                        ]);
                    });

            };

            elem.append('<div id="rc-resizer" title="Resize" onmousedown="rc_post_reply.down(event)" onmouseup="rc_post_reply.move({buttons: 0})"></div>');
			elem.attr('onmousemove', 'rc_post_reply.move(event)');
            $('body').addClass('rc-modal-tweaked');
            $('button[data-forum-modal]').prop('disabled', true);
            setTimeout(function () {$('.modal-dialog').css('opacity', '1');}, 3000); // fallback
            },
        down: function (e) { // resizer mousedown...
            if (e.buttons != 1) return;
			this.resize = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.startW = parseInt(this.cke.style.width);
            this.startH = parseInt(this.cke.style.height);
            window.getSelection().removeAllRanges();
            $('.modal-dialog').addClass('rc-resizing');
            },
        move: function (e) { // resizer mousemove...
			if (!this.resize || this.cke === null) return;
            if (e.buttons == 1) {
                this.cke.style.width = Math.max(this.startW - this.startX + e.clientX, 440) + 'px';
                this.cke.style.height = Math.max(this.startH + this.startY - e.clientY, 80) + 'px';
                }
            else {
                $('.modal-dialog').removeClass('rc-resizing');
				this.resize = false;
                }
            },
		observe: function () { // step 1 - a button was clicked...
			if (!this.observer) this.observer = new MutationObserver(function (mm) {
				for (var i = 0; i < mm.length; ++i) {
					var nn = mm[i].addedNodes, n, j;
					for (j = 0; j < nn.length; ++j) {
						n = nn.item(j);
						if (n && n.className == 'bootbox modal fade') rc_post_reply.init($('div.modal-body'));
						if (n && n.tagName == 'IFRAME' && n.parentNode.className == 'cke_contents cke_reset') rc_post_reply.setup(n);
						}
					nn = mm[i].removedNodes;
					for (j = 0; j < nn.length; ++j) {
						n = nn.item(j);
						if (n && n.className == 'bootbox modal fade') rc_post_reply.quit();
						}
					}
				});
			this.observer.observe(document.body, {childList: true, subtree: true});
			this.active = true;
			},
        setup: function (iframe) { // step 3 - when the iframe appears...
		    this.cke = iframe.parentNode;
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            if (!ts || !ts.forumpost) return;
            this.cke.style.width = Math.max(ts.forumpost[0], 440) + 'px';
            this.cke.style.height = Math.max(ts.forumpost[1], 80) + 'px';
            setTimeout(function () {$('.modal-dialog').css('opacity', '1');}, 0);
            setTimeout(function () {iframe.contentWindow.document.body.focus();}, 1000);
            },
        quit: function () { // when the modal body disappears...
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            ts.forumpost = [parseInt(this.cke.style.width), parseInt(this.cke.style.height)];
            localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
            this.cke = null;
			this.observer.disconnect();
            this.active = false;
            $('button[data-forum-modal]').prop('disabled', false);
			$('body').removeClass('rc-modal-tweaked');
            },
		toString: function () {return 'Object: rc_post_reply';}
        };

    document.getElementById('layout-wrapper').addEventListener('click', function (evt) {
		if (!evt.target || evt.target.tagName != 'BUTTON') return;
        var m = evt.target.getAttribute('data-forum-modal');
        if (m.indexOf('post') === 0 || m.indexOf('thread') === 0) rc_post_reply.observe();
        }, true);

	if (typeof(unsafeWindow) == 'object') unsafeWindow.rc_post_reply = rc_post_reply;

    var png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALHRFWHRDcmVhdGlvbiBUaW1lAFdlZCAxNiBNYXIgMjAxNiAxOTo1Mjo1OCAtMDAwMJtQWjMAAAAHdElNRQfgAxYPNgPzC0RDAAAACXBIWXMAAC4iAAAuIgGq4t2SAAAABGdBTUEAALGPC/xhBQAAADBQTFRFXV1doaGhrKys2dnZ5OTk7u7uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwcKxgAAAAZ0Uk5T//////8As7+kvwAAAD1JREFUeNo1ikENACAQw/ZAAkLIPKCAzL8VOHZLP01TTBmsbXCGgRwIOQjq9CSPE0vyOH3JU4mWPJVa8ki8cJQgcRhnFQ8AAAAASUVORK5CYII=';

	var rc_addStyle = function (css) {
        var s = document.head.appendChild(document.createElement('STYLE'));
		s.setAttribute('type', 'text/css');
		s.textContent = css;
        };

	rc_addStyle('.rc-modal-tweaked .modal-backdrop.in, .cke_resizer {display: none !important;} ' +
      '.rc-modal-tweaked .modal-dialog {opacity: 0; position: fixed !important; bottom: 0 !important; left: 12px; margin-bottom: 12px; box-shadow: 6px 6px 12px rgba(0, 0, 0, .4); width: auto; min-width: 480px;}' +
      '.rc-modal-tweaked .modal-header, .rc-modal-tweaked .modal-body, .rc-modal-tweaked .modal-footer {padding: 2px 15px;}' +
      '.rc-modal-tweaked .modal-body .checkbox {margin: 0;}' +
      '.rc-modal-tweaked .modal {zzzwidth: 80%; zzzheight: 30%; top: auto; right: auto;}' +
      '#rc-resizer {position: absolute; top: 40px; right: 20px; width: 16px; height: 16px; background: url("' + png + '") no-repeat; font-weight: bold; color: #999; text-align: center; cursor: nesw-resize;}' +
      '.modal-dialog.rc-resizing, .modal-dialog.rc-resizing * {cursor: nesw-resize !important; ' +
        '-moz-user-select: none !important; -webkit-user-select: none !important; -ms-user-select: none !important; user-select: none !important;}' +
      'body.rc-modal-tweaked {padding-right: 0 !important; overflow-y: auto !important;}' +
      '.modal-body .cke_contents {height: 300px;}');
})();