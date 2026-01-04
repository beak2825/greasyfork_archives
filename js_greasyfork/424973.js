// ==UserScript==
// @name        gj :: locate
// @description Select and copy error message from InterSystems IRIS Management Portal
// @namespace   https://georgejames.com
// @include     *://*/csp/sys/op/UtilSysAppErrors.csp*
// @include     *://*/csp/sys/op/%25CSP.UI.Portal.ProcessDetails.zen*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @version     3
// @grant       GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/424973/gj%20%3A%3A%20locate.user.js
// @updateURL https://update.greasyfork.org/scripts/424973/gj%20%3A%3A%20locate.meta.js
// ==/UserScript==

/* This userscript selects and copies to the clipboard error messages that are presented
 * in various places in the InterSystems IRIS Management Portal.  Each error message
 * occurence is labelled with a clickable gj::locate link.  The error message is copied 
 * to the user's clipboard along with a unique fingerprint suffix that can be recognised
 * when the gj::locate command is invoked in VS Code.
 */
 

//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true)


$(document).ready(function() {

  const locateButton = '<a href="gj::locate" title="Copy to clipboard (in VS Code click on the gj::locate caption in the status bar to go to the location of this error)">gj::locate</a>'
  const fingerprint = ' // gj::locate // baac5822-7a65-43d5-80d5-10897c2e650b'

  
	// Add our link to column 8 which contains the Details hyperlink
  $(".DetailTable td:nth-child(8)").each(function (index) {
    const actions = $(this).html()
    $(this).html( `${locateButton} &nbsp;${actions}` )
		$(this).addClass('gj-errorLine')
  })

  
  // Older versions of Cache have the Details link in column 7
  $(".DetailTable td:nth-child(7)").each(function (index) {
    const actions = $(this).html()
		if (actions.includes('Details')) {
    $(this).html( `${locateButton} &nbsp;${actions}` )
			$(this).addClass('gj-errorLine')
  	}
  })


  // On clicking our button copy add our fingerprint and to the clipboard
  $(".gj-errorLine a").click(function(element) {
    element.preventDefault()
    const errorMessage = $(this).parent().parent().children().eq(2).html()
    const errorMessageEnhanced = errorMessage + fingerprint
    GM.setClipboard(decodeEntities(errorMessageEnhanced))
    $.notify.defaults({ position: "right bottom", autoHideDelay: 6000 })
    $.notify('Copied to clipboard (in VS Code  click on the gj::locate caption in the status bar to go to the location of this error)', 'info')
    
  })
  

 	// Add gj::locate button adjacent to the source location in the Process Details page
  $("#meterValue_27").each(function (index) {
    const content = $(this).html()
    $(this).html( `<span>${content}</span> &nbsp;${locateButton}` )
		$(this).addClass('gj-sourceLocation')
  })

  
 $(".gj-sourceLocation a").click(function(element) {
    element.preventDefault()
    const errorMessage = $(this).parent().children().eq(0).text()
    const errorMessageEnhanced = errorMessage + fingerprint
    GM.setClipboard(decodeEntities(errorMessageEnhanced))
    $.notify.defaults({ position: "right bottom", autoHideDelay: 6000 })
    $.notify('Copied to clipboard (in VS Code  click on the gj::locate caption in the status bar to go to the location of this error)', 'info')
 })
  
})


/* Translate strings like &lt;SYNTAX&gt; to <SYNTAX> by writing the string to a <div> element
 * using .innerHTML() and then reading it using .textContent
 * Strip any script or html tags to prevent code injection
 */
var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div')

  function decodeHTMLEntities(str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
      element.innerHTML = str
      str = element.textContent
      element.textContent = ''
    }

    return str
  }

  return decodeHTMLEntities
})()
