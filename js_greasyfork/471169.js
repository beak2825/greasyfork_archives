// ==UserScript==
// @name         Advanced Search Recruit
// @namespace    zero.advancedrecruit.torn
// @version      0.2
// @description  Filters advanced search and pastes message automatically
// @author       -zero [2669774]
// @match        https://www.torn.com/page.php*
// @match        https://www.torn.com/messages.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471169/Advanced%20Search%20Recruit.user.js
// @updateURL https://update.greasyfork.org/scripts/471169/Advanced%20Search%20Recruit.meta.js
// ==/UserScript==

const messageTitle = "Hello";
const message = "Hello";


const url = window.location.href;

const jobtitles = ["General", "Manager", "Casino president", "Brain surgeon", "Principal", "Federal judge"];

function check() {
    console.log("Recruit");
    if ($(".expander").length == 0) {
        setTimeout(check, 500);
        return;

    }

    $('.user-info-list-wrap > li').each(
        function () {
            var main = $(this);

            $('#iconTray > li', $(this)).each(function () {
                var icon = parseInt($(this).attr('id').split('_')[0].replace('icon', ''));
                // console.log(icon);

                if (icon > 20 && icon < 27) {
                    // console.log(icon);
                    var title = $(this).attr("title");
                    var found = false;

                    for (var jtitle of jobtitles) {
                        console.log(title + " . " + '<br>' + jtitle);
                        console.log(title.includes('<br>' + jtitle));
                        if (title.includes('<br>' + jtitle)) {
                            found = true;
                            return;
                        }
                    }

                    if (!found){
                        $(main).remove();
                    }
                }
            });


        }
    );
}

function paste() {
    var iframe = document.getElementById('mailcompose_ifr');
    if (iframe) {
        $(".subject").attr("value", messageTitle);
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        innerDoc.querySelector("#tinymce").innerHTML = message;
    }
    else{
        setTimeout(paste, 300);
    }

}

function run() {
    const api = "###PDA-APIKEY###";
    // console.log('here');
    insert();
    // console.log('here2');
    if (localStorage.advSetting && localStorage.advSetting == "Disabled"){
        return;

    }
    
    if (api){
        if (url.includes("p=compose")) {
            paste();
        }
        else if (url.includes("sid=UserList")) {
            check();
        }
    }
}

function insert(){
    // alert("inserting");
    if ($(".expander").length == 0) {
        setTimeout(insert, 500);
        return;

    }

    if (localStorage.advSetting){
        const butn = `<button id="advSetting" class="torn-btn">${localStorage.advSetting}</button>`;
        $('.content-title').append(butn);

        $('#advSetting').on('click', function(){
            if (localStorage.advSetting == "Enabled"){
                localStorage.advSetting = "Disabled";
                $('#advSetting').text("Disabled");
            }
            else if (localStorage.advSetting == "Disabled"){
                localStorage.advSetting = "Enabled";
                $('#advSetting').text("Enabled");
            }

        });

    }
    else{
        localStorage.advSetting = "Enabled";
        insert();
    }
}
// console.log('start');
run();

$(window).on('hashchange', function (e) {
    run();
});
