// ==UserScript==
// @name           Reddit - Add Removeddit link
// @description    Adds a link to the Removeddit version of the page
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        0.1.0
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiAAABYgAWToQQYAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAF3SURBVDhP1ZI/SAJhGMZN3WpKOAgsKGiIoKWg0K2LXIJWj6DAhpAgKMiW7irBqziHbhYE12sLGtWGKHBx0kHcQrBJXNIz9e35vvsQoj841g9+fHy8z/PyHZzrXzANNbgKF2ASHsOhOYGTUIb3cBSq4hyKa3Ey2GsMeMRvvzALd+AVvIPbcAb+yAq8hBehUOgxnU5TtVol27ap3W5TpVKhVCpFsiw/IHMusstwgOHxeDZM07T7/T5Rr0vUfacBvR7uHWIzwzBayK+zDm8KktFo9FXEifaXiHbnxAXEZKKtqcHSSCTygs6nBYuWZfEhR1eIzjbFBdzsYcma8xKQyWQInXmn6jCeSCQ6fDoEqqqyzxhzqgK/368Xi0UeKJfLpGka5fN5yuVyrEClUonPCoUCSZLE/oMvjGBwqut6q16vU6PRoGw2yxc0m02q1WoUj8fffD5fjGWdyvdMeL3ew2AweKsoynM4HH4KBAKW2+0+wExyIn8Hl+sDt5ENCrpr91QAAAAASUVORK5CYII=
// @icon64         data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2029%2025%22%3E%3Cg%20transform=%22translate(1%201)%22%20stroke-width=%221.1%22%20fill-rule=%22evenodd%22%20fill=%22none%22%3E%3Ccircle%20stroke=%22#000%22%20cx=%222.7%22%20r=%222.7%22%20cy=%2210.7%22%20fill=%22#fff%22/%3E%3Ccircle%20stroke=%22#000%22%20cx=%2224.7%22%20r=%222.7%22%20cy=%2210.7%22%20fill=%22#fff%22/%3E%3Cpath%20stroke-linejoin=%22round%22%20stroke=%22#000%22%20stroke-linecap=%22round%22%20d=%22M21.23%201.35L15.83.08l-2%207.28%22/%3E%3Ccircle%20stroke=%22#000%22%20cx=%2223.13%22%20r=%222.13%22%20cy=%222.13%22%20fill=%22#fff%22/%3E%3Cellipse%20cy=%2214.99%22%20rx=%2212.24%22%20ry=%227.99%22%20stroke=%22#000%22%20cx=%2213.24%22%20fill=%22#fff%22/%3E%3Cg%20transform=%22translate(8%2012)%22%3E%3Ccircle%20stroke=%22#FF4500%22%20cx=%221%22%20r=%221.43%22%20cy=%221.43%22%20fill=%22#FF4500%22/%3E%3Ccircle%20stroke=%22#FF4500%22%20cx=%2210%22%20r=%221.43%22%20cy=%221.43%22%20fill=%22#FF4500%22/%3E%3Cpath%20stroke=%22#000%22%20d=%22M1.5%206.23C2.58%207.3%204.3%207.5%205.73%207.5m4.24-1.27C8.9%207.3%207.17%207.5%205.77%207.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E
// @match          *://*.reddit.com/r/*/comments/*
// @grant          none
// @run-at         document-end
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @require        https://greasyfork.org/scripts/7602-mutation-observer/code/mutation-observer.js
// @downloadURL https://update.greasyfork.org/scripts/370257/Reddit%20-%20Add%20Removeddit%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/370257/Reddit%20-%20Add%20Removeddit%20link.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, laxbreak: true */
/* global jQuery, MutationSummary */

/**

==== 0.1.0 (19.06.2018) ====
* Initial version

*/

; ($ => {
  'use strict'

  // --------------------------------------------------------------------------

  const ICON_SRC = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAArrAAAK6wGCiw1aAAACUUlEQVR4nKXTzUsicQDG8brscQ8xf0D3WHIYXwohROoanVuiUxKEWRK/DLHQymMvFBKEUgp6iohgT+HBiqLCxd4IkyE6NTbjWHpb47u3hWX2tB2e4/OB5/C0AW2fyafKfwEfHx/t7+/vHdVqtWN/f/+73W7/pSiKZrPZfiqK8uPw8NCr63pHo9H42mq12i3A/f29IxgMsrCwgBCC+fl5ZmZmmJqaYnJyktnZWaanp/H5fKWHhwfZAgQCAXZ3dzk4OCCfz7O3t0cqlWJ7e5tkMsny8jLRaBQhBLIsYwE2NzeP+vr6GBkZwefzMTo6yvDwMIODg3g8HrxeLwMDAzidToaGho4sQL1el+bm5ri8vMQwDMrlMoVCgWw2SyKRYGlpCb/fT1dXF7VaTbIAtVpNCoVCXF9fY5omqqpycXFBJpNhZWWFcDhMIBDA5XLx8vJiBRqNhiSE4OrqCtM0eXx8pFAokMvlWF1dZXFx8Q/w/PxsBarVqhSJRCiVStTrdSqVCvl8nmw2y9raGrFYDL/fT09PD6+vr1bAMAxJCEGxWETTNMrlMicnJ+RyOba2tojH4wgh6OzsxDCMf0+IxWIUi0Xe3t5QVZWzszPS6TQbGxtEo1HGxsZwu91ommYFms2mFIlEOD09Rdd1np6eOD4+JpPJkEgkiMfjBINBHA4Huq5bgUqlIoXDYW5vb9F1HVVVOT8/Z2dnh/X1dYQQTExM0Nvbi2maVqDVan25u7sb7+7upr+/H0VRsNlsOJ1O3G43drsdWZZLNzc335rNpvUL/5vfJEHErF14LfAAAAAadEVYdEF1dGhvcgBVbGVhZCBTeXN0ZW1zLCBJbmMuyR0+dgAAAABJRU5ErkJggg==`

  const url = new URL(location.href)
  url.host = 'www.removeddit.com'

  const observer = new MutationSummary({
    callback(summaries) {
      $(summaries.shift().added)
        .children()
        .append(`
          <li style="padding-left: 1px; padding-top: 2px;">
            <a href="${url}">
              <img src="${ICON_SRC}">
            </a>
          </li>
        `)
    },
    rootNode: document.body,
    queries: [
      { element: '#NREFloat' }
    ]
  })

})(jQuery)

jQuery.noConflict(true)
