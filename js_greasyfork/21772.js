// ==UserScript==
// @name         Freshdesk Monitor
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Alerts you if the responder of the ticket you are viewing changes, there is a new ticket or one updates, and auto-refreshes the ticket page. New ticket and updated ticket notifications only work when you have a ticket list open in a tab
// @author       Adrian Bradfield
// @match        https://*.freshdesk.com/*
// @grant        unsafeWindow
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/21772/Freshdesk%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/21772/Freshdesk%20Monitor.meta.js
// ==/UserScript==

/*
Created by Adrian Bradfield at Pastel UK & Ireland
Suppliers of accounting software
Visit: http://pastel.co.uk for more information
*/

(function() {
    // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    // var notification = new Notification("TFS Notifications started.");
      console.log("TFS Notification previously granted permission.");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        // var notification = new Notification("TFS Notifications started.");
          console.log("TFS Notification just granted permission.");
      }
      else{
          console.log("TFS Notification was denied permission to notify.");
      }
    });

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}
    function notify(title, text, highlight){
        //GM_notification({title: title, text: text, highlight: highlight, timeout: 0, image: "https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/5003361067/logo/PASTEL%20AltMed.jpg?AWSAccessKeyId=AKIAJ2JSYZ7O3I4JO6DA&Expires=1472024111&Signature=k3vIkf0S7S%2BvHYsHqbuHPg5pd5c%3D"});
        var _not = new Notification(title, {body: text, noscreen: !highlight, icon: "http://pastel.co.uk/files/4514/6528/6850/Pastel-Logo-280.png"});
    }
    //Uncomment this code to test notifications
    /*unsafeWindow.$J("body").append("<button id='notification_allow'>Test Notifications</button>");
    unsafeWindow.$J("#notification_allow").click(function(){
        notify("Test Notification", "This is to check that notifications are being displayed as intended");
    });*/

    var fd_monitor_curpath;
    var fd_monitor_original;
    window.setInterval(function(){

        //Auto refresh pages
        if(window.location.pathname.startsWith("/helpdesk/tickets")){
            console.log("Running");
            var refreshAlert = unsafeWindow.$J("#index_refresh_alert");
            if(refreshAlert.is(":visible")){
                var updates = refreshAlert.children("#update_message").first().attr("data-count");
                var newt = refreshAlert.children("#new_ticket_message").first();
                if(updates){
                    var results = [];
                    unsafeWindow.$J("table.tickets tr").each(function(row){
                        if(unsafeWindow.$J( this ).html().indexOf("source-detailed-auto-refresh") >= 0){
                            results.push(unsafeWindow.$J( this ));
                        }
                    });
                    for(var i = 0; i < results.length; i++){
                        notify("Updated Ticket", results[i].find(".ticket-description-tip").text().substring(5), false);
                    }
                }
                if(newt.is(":visible")){
                    var string = 'New ticket has been submitted';
                    notify("New Tickets", string, false);
                }
                //notify("Freshdesk", "New or updated ticket", false);
                refreshAlert.click();//Re-enable after analysis
            }
            //Ticket links to create new tab
            var links = unsafeWindow.$J("h3.ticket-description-tip>a");
            links.attr("target", "_blank");
            links.removeAttr("data-pjax");
        }
        //Monitor for Agent Changes
        if(window.location.pathname.startsWith("/helpdesk/tickets/")){
            if(window.location.pathname != fd_monitor_curpath){
                fd_monitor_original = dom_helper_data.helpdesk_ticket.responder_name;
                fd_monitor_curpath = window.location.pathname;
                console.log("this tickets agent is: " + fd_monitor_original);
            }
            unsafeWindow.$J.ajax({url: window.location, success: function(result){
                var nodes = unsafeWindow.$J.parseHTML(result);

                var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;

                var match;
                while (match = re.exec(result)) {
                    if(match[1].indexOf("dom_helper_data = {") > -1){
                        re= /"responder_name":"([\s\S]*?)"/gm;
                        var responder_name = re.exec(match[1]);
                        if(fd_monitor_original != responder_name[1]){
                            notify("AGENT CHANGED", "This ticket has been claimed by "+responder_name[1]+"! Do not respond!", true)
                            //alert("This ticket has now been assigned to " + responder_name[1]);
                            fd_monitor_original = responder_name[1];
                        }
                        break;
                    }
                }
            }});
        }
    }, 5000);
})();