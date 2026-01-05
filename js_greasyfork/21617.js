// ==UserScript==
// @name              DW Link Scanner
// @namespace         http://forum.dirtywarez.com/*
// @description       Checks opened topics for dead links - auto reply, lock & move to trash - removes partly dead links
// @version           2.0
// @license           GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             window.close
// @author            DW Mod Team
// @icon              http://i.imgur.com/FtA1mnc.png
// @require           http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include           http://forum.dirtywarez.com/viewtopic.php*
// @include           http://forum.dirtywarez.com/posting.php*
// @downloadURL https://update.greasyfork.org/scripts/21617/DW%20Link%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/21617/DW%20Link%20Scanner.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var inListings = false; 

function html_exists(html) {
    var htmlString = $('body').html().toString();
    var index = htmlString.indexOf(html);
    if (index !== -1) {
        return true;
    }

    return false;
}

function getDate() {
    var d = Date().split(' ');
    d = ' (' + d[1] + ' ' + d[2] + ', ' + d[3] + ')';
    return d;
}

function getUsername() {
    return $(".dropdown-trigger > .username-coloured").text();
}

function closeTopic() {
    setTimeout(function () {
        window.close();
    }, 3000);
}
 
if (html_exists('./viewforum.php?f=8" itemprop="url"')) {
    console.log("Scanner: Viewing Downloads Section");

    if ( html_exists("./viewforum.php?f=8") ) {
        inListings = true;
        console.log("Scanner: Viewing Topic - Scanner Active");
    } else {
        console.log("Scanner: Not Viewing Topic - Scanner Disabled");
    }
}

var settings = {
    username: getUsername(),
    close_tab_trashed: true, // Close tab after thread is in trashed?
    close_tab_trash: false, // Close tab if thread is in Recycle Bin?
    close_tab_alive: true, // Close tab if all links are alive or some premium and other alive?
    trash_premiumonly: true, // Trash thread if there are only premium links?

    dead_percent: 85, // Percentage before trash
    scan_retry_seconds: 1000, // How many seconds before retry? (1s = 1000)
    scan_retry_total: 30, // How attempts total?
    page_reload_time: 5000 // How many seconds for page reload? (1s = 1000)
};

var scan = {
    scan_retry: 0,
    mod_retry: 0,

    retry: function () {
        if (scan.scan_retry > 0) { 
            console.log("Scanner: Retry #" + scan.scan_retry + "/" + settings.scan_retry_total); 
        }
    
        if (scan.scan_retry <= settings.scan_retry_total) {
            scan.scan_retry++;
            var scan_timeout = setTimeout(function () {
                scan.start();
            }, settings.scan_retry_seconds);
        } else {
            clearTimeout(scan_timeout);
            //topic.close(); // close tab if still no progress
        }
    },

    start: function () {
        var progress = $("#warlc-progressbox").attr('aria-valuenow');

        if (progress == 100) {
            console.log("Scanner: All links progressed");

            var warlc = $("#warlc-progressbox").find('span');
            var alive = $(warlc[0]).text().split(" ")[0];
            var dead = $(warlc[1]).text().split(" ")[0];
            var unresolved = $(warlc[2]).text().split(" ")[0];
            var premium = $(warlc[3]).text().split(" ")[0];

            var total_links = parseInt(alive) + parseInt(dead) + parseInt(unresolved) + parseInt(premium);
            var percentage_dead = parseInt(dead) / total_links * 100;
            var percentage_alive = parseInt(alive) / total_links * 100;
            var percentage_unava = parseInt(unresolved) / total_links * 100;
            var percentage_premium = parseInt(premium) / total_links * 100;

            console.log("Scanner: Total Links: " + total_links);
            console.log("Scanner: Percentage Dead: " + percentage_dead + "%");
            console.log("Scanner: Percentage Alive: " + percentage_alive + "%");
            console.log("Scanner: Percentage Premium: " + percentage_premium + "%");
            console.log("Scanner: Percentage Unavailable: " + percentage_unava + "%");

            if (percentage_alive == 100 && settings.close_tab_alive == true) { // all alive
                console.log("Scanner: All links active, thread will be closed after 3 seconds");
                closeTopic();
            } else {
                if (percentage_dead >= settings.dead_percent) { // >90% dead
                    console.log("Scanner: " + percentage_dead + "% of links are dead. Attempting to dump topic");
                    action.bin("dead");
                } else if (percentage_dead + percentage_premium >= 99 && percentage_alive < 1 && settings.trash_premiumonly == true) { // premium only alive
                    action.bin("premOnlyAlive");
                } else if (percentage_dead > 1) { // some dead
                    action.removeDead();
                } else if (percentage_premium > 1 && percentage_premium < 100 && settings.close_tab_alive == true) { // no dead, some premium
                    closeTopic();
                } else if (percentage_premium == 100 && settings.trash_premiumonly == true) { // all premium
                    action.bin("prem");
                }
            }
        } else { // progress != 100
            if (progress) {
                console.log("Scanner: " + progress + "% of Links progressed");
            } else {
                console.log("Scanner: Progress undefined or loading hasn't started. Check if W.A.R. is active if you are getting this message after retry!");
            }
            scan.retry();
        }
    }
};

var action = {
    bin: function (t) {

        if (inListings) {
            var binLink =  $('ul.post-buttons > li:first > a').attr('href');
                        
          var bin = function() {
                console.log("Scanner: Moving topic to Recycle Bin");

                //$(".post-buttons").children().children()[0].click();
                var request = $.ajax({
                    url: binLink,
                    async: false,
                    type: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                });
                request.done(function (data) {
                    $("<div>", {
                        text: "Thread has been moved to Recycle Bin!",
                        css: {
                            "width": "100%",
                            "position": "fixed",
                            "top": "0",
                            "color": "#fff",
                            "font-weight": "bold",
                            "background": "#353f4b",
                            "font-size": "16px",
                            "text-align": "center",
                            "border": "2px solid #eb9135",
                            "z-index": "99999"
                        }
                    }).appendTo("body");

                    if (settings.close_tab_trashed == true) {
                        closeTopic();
                    }
                }).error(function () {
                    alert("DW Link Scanner: Could not trash the thread");
                });
            };

            var htmlString = $('body').html().toString();

            switch (t) {
                case "dead":
                    var index = htmlString.indexOf("This thread contains dead links and it's moved to Recycle Bin");
                    if (index == -1) {
                        console.log("Scanner: Posting dead links message");
                        $("textarea[name=message]").val("[mod]This thread contains dead links and it's moved to Recycle Bin. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.[/mod]");
                        $("input[name=post]").click();
                    } else {
                        bin();
                    }

                    break;

                case "premOnlyAlive":
                    var index = htmlString.indexOf("This thread contains only premium links alive and it's moved to Recycle Bin.");

                    if (index == -1) {
                        console.log("Scanner: Posting premium only alive message");
                        $("textarea[name=message]").val("[mod]This thread contains only premium links alive and it's moved to Recycle Bin. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.\n\n[size=85][i]* If you post premium links you must also provide free alternatives, otherwise your post will be trashed.\n* Posts with dead free links leaving only premium will also be trashed.[/i][/size][/mod]");
                        $("input[name=post]").click();
                    } else {
                        bin();
                    }
                    
                    break;

                case "prem":
                    var index = htmlString.indexOf("This thread contains only premium links and it's moved to Recycle Bin");
                    if (index == -1) {
                        console.log("Scanner: Posting premium links message");
                        $("textarea[name=message]").val("[mod]This thread contains only premium links and it's moved to Recycle Bin. If you post premium links you must also provide free alternatives, otherwise your post will be trashed.[/mod]");
                        $("input[name=post]").click();
                    } else {
                        bin();
                    }
                    
                    break;

                default:
                    alert("Error");
            }
        }        
    },

    removeDead: function () {
        console.log("Scanner: Dead links found - Attempting to remove dead links");

        var deadlinks = $('a.adead_link, a.obsolete_link').map(function () {
            return this.innerHTML;
        }).toArray();
       
        var editLink = $('a[title="Edit post"]').attr('href');
        //console.log(editLink);

        $("<div>", {
            text: "Dead Link Remover is trying to remove dead links from the thread. Please wait...",
            css: {
                "width": "100%",
                "position": "fixed",
                "top": "0",
                "color": "#fff",
                "font-weight": "bold",
                "background": "#353f4b",
                "font-size": "16px",
                "text-align": "center",
                "border": "2px solid #eb9135",
                "z-index": "99999"
            }
        }).appendTo("body");

        $("<div>", {
            'class': "qedit",
            css: {
                "display": "none"
            }
        }).appendTo('.postbody .content');


        $(".qedit").load(editLink, function() {
            setTimeout(function() {
                deadlinks.forEach(function (part, index, theArray) {
                    var regexstring = deadlinks[index].toString();

                    var url = regexstring;
                    url = url.replace("http://", "");
                    url = url.replace("https://", "");
                    url = url.replace("www.", "");
                    var cleanURL = url.split('/').shift();

                    var text = $("textarea#message").val();
                    if (text.indexOf(deadlinks[index]) > -1) {
                        text = text.replace(regexstring, "~ " + cleanURL + " - Dead link removed ~ " + settings.username + getDate());
                        $("textarea#message").val(text);
                    }
                    $("#edit_reason").first().val("Dead link(s) removed");
                });

                console.log("Scanner: Submitting form");
                $(".panel.bg2 > .inner > .submit-buttons > input[name=post]").click();
            }, 2100); // 2s delay
        });
    },
};

$(function () {
    if (inListings != true) {
        var htmlString = $('body').html().toString();
        var index = htmlString.indexOf('./viewforum.php?f=33" itemprop="url" title="Recycle Bin"'); //in Bin
        
        if (index != -1 && settings.close_tab_trash == true) {
            closeTopic();
        }
        return;
    }
    scan.start();
});