// ==UserScript==
// @name        Add Broadcast Group
// @namespace   http://zipwhip.com/
// @version     0.2
// @description Try to take over the world!
// @author      Pradeep
// @match       https://app.zipwhip.com/
// @grant       none
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/404101/Add%20Broadcast%20Group.user.js
// @updateURL https://update.greasyfork.org/scripts/404101/Add%20Broadcast%20Group.meta.js
// ==/UserScript==

console.log ("Before ready");

$ (document).ready(function () {
    console.log ("Inside Ready");

    setTimeout(function() {
$(".zw-default-div-style.main-menu-panel").append (` <div id="broadcastButton" class="zk-hover menu-item_container" tabindex="0">

    <div data-testid="MENU_ITEM_BROADCAST_ICON" class="menu-item_icon">
        <button class="zk-button zk-button-transparent zk-hover-icon" tabindex="-1" type="button">
            <div>
                <svg viewBox="0 0 24 24" width="24" height="24" class="zk-action-icon-iconElement">
                    <path fill="transparent" d="M8.5 2h7v4h-7z"></path>
                    <path fill="transparent" d="M4.5 4.5h15v17h-15z"></path>
                    <path d="M12 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h3l5 4V4l-5 4m9.5 4c0 1.71-.96 3.26-2.5 4V8c1.53.75 2.5 2.3 2.5 4z"></path>
                </svg>
            </div>
        </button>
    </div>
    <div data-testid="MENU_ITEM_Templates_LABEL" class="zk-styled-text-base zk-styled-text-primary menu-item_itemLabel">PradeepBroadcast</div>
</div>`
                  );


function broadcastClickFunction() {
    console.log("Inside Broadcast Button Click");
    $(".zw-default-div-style.main-content-container").empty();
    $(".zw-default-div-style.main-content-container").append (` <iframe width="100%" height="100%" src="https://zipwhipbroadcast.azurewebsites.net/" frameborder="0"
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                  );


}
$("#broadcastButton").click (broadcastClickFunction);



    },2000);


});






