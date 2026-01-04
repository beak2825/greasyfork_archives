// ==UserScript==
// @name Interpals Conversations Delete All Button
// @description Provides a convenience button to delete all conversations.
// @version 1
// @author Ouahib El Hanchi
// @include /^https?://www\.interpals\.net/pm\.php.*$/
// @run-at document-end
// @require http://code.jquery.com/jquery-latest.js
// @grant none
// @namespace https://greasyfork.org/users/346080
// @downloadURL https://update.greasyfork.org/scripts/389448/Interpals%20Conversations%20Delete%20All%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/389448/Interpals%20Conversations%20Delete%20All%20Button.meta.js
// ==/UserScript==

// Helpers ====================================================================

function delete_thread(thread_id, should_block_user=false) {
  console.log("Deleting thread id: " + thread_id);

  $.ajax({
    type : "POST",
    url : "/pm.php",
    data : {
      action : "delete_thread",
      thread : thread_id,
      block_user : should_block_user
    },
    dataType : "json"
  }).done(function(data) {
    if (data.success) {
      $("#thread_" + thread_id).remove();
      console.log("Thread(" + thread_id + "): Deleted successfully.");
    } else {
      if (data.error) {
        console_log("Thread(" + thread_id + "): " + data.error);
      } else {
        console.log("Thread(" + thread_id + "): Delete failed.");
      }
    }
  }).fail(function(data) {
    console.log("Thread(" + thread_id + "): Delete failed.");
  });
}

// ----------------------------------------------------------------------------

function delete_threads(event)
{  
  if(!confirm("Delete all conversations?")) {
    return;
  }
  
  var threads = document.querySelectorAll(".pm_thread");

  if(!threads || !threads.length) {
    console.log("There are no conversations.");
    return false;
  }
  
  threads.forEach(function(element) {
    var thread_id = element.getAttribute("id").replace("thread_", "");
    delete_thread(thread_id);
  });
}

// Entry-point ================================================================

function main()
{
    $("#controls").prepend(`
      <div style="border-left: 1px solid #ccc; float: right; line-height: 31px; padding: 0 5px;">
        <a id="delete-conversations" href="pm.php">
          <i class="fa fa-times fa-1"></i>
          Delete all conversations
        </a>
      </div>
    `);
    $("#delete-conversations").click(delete_threads);
}

// ----------------------------------------------------------------------------

main();

// END ========================================================================