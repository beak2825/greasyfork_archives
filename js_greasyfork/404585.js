// ==UserScript==
// @name         RabbitMQ Auto Destination queue for errorqueues
// @namespace    https://greasyfork.org/nl/scripts/404585-rabbitmq-auto-destination-queue-for-errorqueues
// @version      0.3
// @description  Fills in the destination queue for an errorqueue
// @author       You
// @include http://*rabbitmq*
// @include https://*rabbitmq*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404585/RabbitMQ%20Auto%20Destination%20queue%20for%20errorqueues.user.js
// @updateURL https://update.greasyfork.org/scripts/404585/RabbitMQ%20Auto%20Destination%20queue%20for%20errorqueues.meta.js
// ==/UserScript==

 var styleSheet = "" +
        "[name='dest-queue']{width:500px !important;}" +
        "";

(function() {
        'use strict';

        //Set stylesheet
        var s = document.createElement('style');
        s.type = "text/css";
        s.innerHTML = styleSheet;
        (document.head || document.documentElement).appendChild(s);


        //Fill in destination queue
        $(window).on('hashchange', function(e){
          setTimeout(function(){
                var queueContainer = document.querySelector('#main h1 b');
                var destinationTextBox = document.querySelector("[name='dest-queue']");

                if(!queueContainer || !destinationTextBox) return;

                var queueName = queueContainer.innerText;
                if(!queueName.endsWith('_error')) return;

                destinationTextBox.value = queueName.substring(0, queueName.length - 6);
            }, 200);
        });
})();
