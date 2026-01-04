// ==UserScript==
// @name         Remind About Saving CATS
// @namespace    http://fprantl.opentext.com/
// @version      0.3
// @description  Shows a red text on the working time entering page, so that people do not forget saving the data after releasing team.
// @author       Ferdinand Prantl <fprantl@opentext.com>
// @match        *://saperp.opentext.net/webgui*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375186/Remind%20About%20Saving%20CATS.user.js
// @updateURL https://update.greasyfork.org/scripts/375186/Remind%20About%20Saving%20CATS.meta.js
// ==/UserScript==

;(function() {
    'use strict'

    function ensureStyle (source) {
      if (source.querySelector('#fprantl-save-reminder-style')) {
        //console.log('CATS saving reminder style found.')
      } else {
        console.log('CATS detected, inserting the reminder style...')
        var style = source.createElement('style')
        style.id = 'fprantl-save-reminder-style'
        var content = [
          '#fprantl-save-reminder {',
          '  margin: 30px;',
          '  color: red;',
          '  animation: fprantl-save-reminder-blinker 3s linear infinite;',
          '}',
          '@keyframes fprantl-save-reminder-blinker {',
          '  50% { opacity: 0; }',
          '}'
        ].join('\n')
        style.appendChild(source.createTextNode(content))
        source.head.appendChild(style)
      }
    }

    function ensureWarning (source, container) {
      if (source.querySelector('#fprantl-save-reminder')) {
        //console.log('CATS saving reminder found.')
      } else {
        console.log('CATS detected, inserting the reminder warning...')
        var warning = source.createElement('div')
        warning.id = 'fprantl-save-reminder'
        warning.innerHTML = [
          '==============================<br>',
          '<span style="margin-left:20%">Klicke auf Save !!!</span>',
          '<br>=============================='
        ].join('\n')
        container = container.firstChild.firstChild.firstChild
        container.appendChild(warning)
      }
    }

    function ensureReminder () {
      var source = document
      var container = source.querySelector('#userarea-scrl')
      if (!container) {
        var frame = document.querySelector('#ITSFRAME1')
        if (frame) {
          source = frame.contentWindow.document
          container = source.querySelector('#userarea-scrl')
        }
      }
      if (container) {
        ensureStyle(source)
        ensureWarning(source, container)
      } else {
        //console.log('CATS not detected, leaving the page intact.')
      }
    }

    setInterval(ensureReminder, 3000)
  })();