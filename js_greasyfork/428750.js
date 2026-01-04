// ==UserScript==
// @name        Waarschuwing bij verlaten parent van rubric op Blackboard
// @description Waarschuwing als je wegnavigeert van de pagina waarvan je de bijbehorende rubric open hebt staan - saxion.nl
// @namespace   userscripts.saxion.nl
// @match       https://leren.saxion.nl/webapps/assignment/gradeAssignmentRedirector
// @grant       none
// @version     1.0
// @author      Jan Willem B
// @downloadURL https://update.greasyfork.org/scripts/428750/Waarschuwing%20bij%20verlaten%20parent%20van%20rubric%20op%20Blackboard.user.js
// @updateURL https://update.greasyfork.org/scripts/428750/Waarschuwing%20bij%20verlaten%20parent%20van%20rubric%20op%20Blackboard.meta.js
// ==/UserScript==

init()

function init() {

  if (!window.rubricGradingService) {
    setTimeout(init, 500);
    return;
  } else {
    window.rubricGradingService.openRubricWindow = (title, url, w, h) => {
      var lpix = (screen.width / 2) - (w / 2);
      var remote = window.open(url, title, 'width=' + w + ',height=' + h + ',resizable=yes,scrollbars=yes,status=no,top=20,left=' + lpix );
      if (remote) {
        remote.focus();
        if (!remote.opener) {
          remote.opener = self;
        }

        // vanaf hier is toegevoegde code (de rest is standaard blackboard code)
        window.addEventListener('beforeunload', (event) => {
          if (remote && !remote.closed) {
            event.preventDefault();
            event.returnValue = "Rubric staat nog open! Weet je het zeker?";
          }
        });      
      }
    };
  }
}
