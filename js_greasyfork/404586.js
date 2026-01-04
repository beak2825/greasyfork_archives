// ==UserScript==
// @name         RabbitMQ Move and Delete on top
// @namespace    https://greasyfork.org/nl/scripts/404586-rabbitmq-move-and-delete-on-top
// @version      0.1
// @description  Put Move and delete on top of an error queue page for easy access
// @author       You
// @include http://*rabbitmq*
// @include https://*rabbitmq*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404586/RabbitMQ%20Move%20and%20Delete%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/404586/RabbitMQ%20Move%20and%20Delete%20on%20top.meta.js
// ==/UserScript==

(function() {
      $(window).on('hashchange', function(e){
      //Fill in destination queue
          setTimeout(function(){
              var queueContainer = document.querySelector('#main h1 b');
              if(!queueContainer || !queueContainer.innerText.endsWith('_error')) return;

              var moveMessagesContainer = $( "h2:contains('Move messages')" );
              var deleteContainer = $( "h2:contains('Delete')" );

              if(!moveMessagesContainer || !deleteContainer) return;

              for(var i = 0; i<5;i++){
                  moveMessagesContainer.parent().prev().insertAfter(moveMessagesContainer.parent())
                  deleteContainer.parent().prev().insertAfter(deleteContainer.parent())
              }

            }, 200);
      });
})();