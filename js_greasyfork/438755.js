// ==UserScript==
// @name         WME Fix UR Interface
// @namespace    https://greasyfork.org/en/users/668704-phuz
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version      1.13
// @description  Fix the UR Interface that Waze devs changed :(
// @author       phuz
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_fetch
// @grant        GM_addStyle

/* global OpenLayers */
/* global W */
/* global WazeWrap */
/* global $ */
/* global I18n */
/* global _ */
/* global MutationObserver */

// @downloadURL https://update.greasyfork.org/scripts/438755/WME%20Fix%20UR%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/438755/WME%20Fix%20UR%20Interface.meta.js
// ==/UserScript==

var reportID;
var conversationLength;
const timer = ms => new Promise(res => setTimeout(res, ms))
const pmIcon = 'data:image/png;base64,R0lGODlhDgAMAPcAANaGh6dLTs9obK5cXrpkZ9JydqtfYbZnaqhtb/Kjpverrcudn//b3P/n6LNQVZ9KT9l2e85zeL9zd35MT/+ip8mBheSZnZJkZ59ydb2Mj//AxP/BxbmMj/jAw//KzeO2uf7R1P/a3P/d35IxOMZlbMdocNZ1fMRvdslyesZ0eqZhZsBxd859hP+xt/ess6t6ft2ssIlQVuiLldqJkvyirKd0ebB9gphucqR6fv/Bx8SXnMqdor2UmMCXm//N0v/q7KZTXc1tealocJhpb/+yvP+2wP/EzP/N1K9baP+vvNSSnKx3f82YoMyXn//s7//x85ldZ7N0f7N1gLh5hLd5hLV5g6p4gf/e5P/h5qllcqFnc9CMmeScqqVcbadeb8SSnf/M1//x9NaPof/j6v/r8P/v9P/o8P/q8f/67//47v/37f/16v/37//59P/w5v/t4//28f/o3P/z7cmroP/x7P/39P/s5v/v6v/08f/e1v/q5f/o49Stpv/n4+KimfHMxv/i3v/w7olKQ7B7df/Qyv/Z1PbTz//19IBhX/jMya+Qjv/j4bVxboljYoVrav/m5cJ4d7ZwcOi4uP/Qz66QkP/09P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJYALAAAAAAOAAwAAAi4AC1JybJlChMdPHrsaEIFygdFGHyUCVOpTps2dQ6BgHGhUQYyHRj0sbMH0KJHITzEUOGCxQkDg/JAGtAAwIMcK4DQkEFEgyA/AQRAKOCgBQokSYKUIMCIUAQKI0yQMJJCSJEZFiYVuhNJwYEEEjZUQLRA0h81a+LMeSNHD59ECBxx+AEnDRs2aNzgCUTH0IQvXbhccXIGyxMRY8wcsfHCkhgvS2qAUYIBR5UoWqxY2ryZ0pAbnEMHBAA7';

(function () {
    'use strict';
    //Bootstrap
    function bootstrap(tries = 1) {
        if (W && W.loginManager && W.map && W.loginManager.user && W.model
            && W.model.states && W.model.states.getObjectArray().length && WazeWrap && WazeWrap.Ready) {
            setTimeout(function () {
                //loadObserver();
                fixClosures();
            }, 500);
        } else if (tries < 1000) {
            setTimeout(function () { bootstrap(++tries); }, 200);
        }
    }

    //thanks to dBsooner for providing the proper CSS for saving vertical space with the action buttons
    function injectCss() {
        $('<style = type="text/css">'
            + '#panel-container .mapUpdateRequest.panel .problem-edit .actions .controls-container label[for|="state"] { height: 22px; width: 162px; line-height: 26px; margin-bottom: 6px; }'
            + '#panel-container .mapUpdateRequest.panel .problem-edit[data-state="open"] .actions .controls-container label[for="state-solved"]  { display: inline-block; }'
            + '#panel-container .mapUpdateRequest.panel .problem-edit[data-state="open"] .actions .controls-container label[for|="state-not-identified"] { display: inline-block; }'
            + '#panel-container .mapUpdateRequest.panel .problem-edit[data-state="solved"] .actions .controls-container label[for|="state-open"], '
            + '#panel-container .mapUpdateRequest.panel .problem-edit[data-state="not-identified"] .actions .controls-container label[for|="state-open"] { display: inline-block !important; }'
            + '#panel-container .mapUpdateRequest.panel .problem-edit[data-state="not-identified"] .actions .controls-container label[for|="state-not-identified"], '
            + '#panel-container .mapUpdateRequest.panel .problem-edit[data-state="not-identified"] .actions .controls-container label[for|="state-solved"] { display: none !important; }'
            + '</style>').appendTo('head');
    }

    function loadObserver() {
        const element = document.getElementById("panel-container");
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const { target } = mutation;
                if (mutation.attributeName === 'class') {
                    let intervalID = setInterval(function () {
                        if (document.getElementsByClassName("comment-list")[0]) {
                            let commentList = document.getElementsByClassName("comment-list");
                            $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .content .conversation-view .comment-list').hide();
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container').css('text-align', 'center');
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container label[for=state-solved]').css('width', '135px');
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container label[for=state-solved]').css('margin', '2px');
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container label[for=state-solved]').text("Solved");
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container label[for=state-not-identified]').css('width', '135px');
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container label[for=state-not-identified]').css('margin', '2px');
                            $('#panel-container .mapUpdateRequest .actions .section .content .controls-container label[for=state-not-identified]').text("Not Identified");
                            const shadowDOMstyle = document.createElement('style');
                            shadowDOMstyle.innerHTML = '.wz-button.md { height: 30px !important; width: 60px !important; padding: 0px 6px !important; }';
                            $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .new-comment-form .send-button')[0].shadowRoot.appendChild(shadowDOMstyle.cloneNode(true));
                            $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .new-comment-form .new-comment-follow').css('height', '34px');
                            $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .new-comment-form .new-comment-follow').css('line-height', '34px');
                            $('wz-button.send-button').css('margin', '0px');
                            $('wz-button.send-button').css('padding', '2px');

                            clearInterval(intervalID);
                            injectCss();

                            if (!document.getElementById("phuzReportComments")) {
                                buildTheComments();
                                $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .new-comment-form .send-button').on('click', () => { appendNewComment(); });
                            }

                        }
                    }, 50);
                }
            });
        });
        observer.observe(element, { subtree: true, childList: true, attributes: true });
    }

    function fixClosures() {
        const element = document.getElementById("edit-panel");
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (document.getElementById("segment-edit-closures")) {
                    $('#segment-edit-closures .closures .closures-list').css('display', 'inline');
                }
            });
        });
        observer.observe(element, { subtree: true, childList: true, attributes: true });
    }

    function buildTheComments() {
        let reports = document.getElementsByClassName("map-problem");
        //for (let i = 0; i < reports.length; i++) {
            //if (reports[i].classList.contains("marker-selected")) {
                reportID = W.map.getLayerByName('update_requests').features.filter((feature) => feature.attributes.wazeFeature.isSelected)[0].attributes.wazeFeature.id; //(reports[i].getAttribute("data-id"));
                var newDiv = document.createElement("div");
                newDiv.id = "phuzReportComments";
                if (document.getElementById("phuzReportComments")) {
                    //document.getElementById("phuzReportComments").remove();
                }
                $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .content .conversation-view').prepend(newDiv);
                document.getElementById("phuzReportComments").style = "width: 100%";
                //document.getElementsByClassName("conversation-view")[0].prepend(newDiv);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.waze.com/Descartes/app/MapProblems/UpdateRequests?ids=" + reportID,
                    onload: function (response) {
                        let result = JSON.parse(response.responseText);
                        let divHTML = "<table id=tblURConversation border=0 cellpadding=1 cellspacing=2 style='table-layout: fixed; width: 100%'>";
                        let commentUser;
                        conversationLength = result.updateRequestSessions.objects[0].comments.length;
                        for (let i = 0; i < conversationLength; i++) {
                            if (result.updateRequestSessions.objects[0].comments[i].userID == -1) {
                                commentUser = "<font color=#26bae8>Reporter</font>";
                            } else {
                                for (let j = 0; j < result.users.objects.length; j++) {
                                    if (result.updateRequestSessions.objects[0].comments[i].userID == result.users.objects[j].id) {
                                        commentUser = "<a href='https://www.waze.com/forum/user_message_redirect.php?username=" + result.users.objects[j].userName + "' target='_blank'><img src='" + pmIcon + "'></a> " + result.users.objects[j].userName + "(" + (result.users.objects[j].rank + 1) + ")";
                                    }
                                }
                            }
                            divHTML += "<tr><td><b>" + commentUser + "</b></td><td align=right style='font-size: 11px;'>" + moment(new Date(result.updateRequestSessions.objects[0].comments[i].createdOn)).format('lll') + "</td></tr>";
                            divHTML += "<tr style='background: #FFFFFF;border: 1px double #E6E6E6;border-radius: 1ex; '><td colspan=2 style='word-wrap:break-word !important;'>" + result.updateRequestSessions.objects[0].comments[i].text + "</td></tr>";
                        }
                        divHTML += "</tbody></table>";
                        document.getElementById("phuzReportComments").innerHTML = divHTML;
                    }
                });
            //}
        //}
    }

    function appendNewComment() {
        let tblHTML = "";
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.waze.com/Descartes/app/MapProblems/UpdateRequests?ids=" + reportID,
            onload: async function (response) {
                let result = JSON.parse(response.responseText);
                let commentUser;
                let resultLength = result.updateRequestSessions.objects[0].comments.length;
                //Remove the "No Comments" text if comments are present
                if (resultLength > 0) {
                    $('#panel-container .mapUpdateRequest .panel--YPJyS .container--A1GTr .problem-data .conversation .content .conversation-view .no-comments').hide();
                }
                let lastCommentIndex = resultLength - 1;
                if (resultLength > conversationLength) {
                    if (result.updateRequestSessions.objects[0].comments[lastCommentIndex].userID == -1) {
                        commentUser = "<font color=#26bae8>Reporter</font>";
                    } else {
                        for (let j = 0; j < result.users.objects.length; j++) {
                            if (result.updateRequestSessions.objects[0].comments[lastCommentIndex].userID == result.users.objects[j].id) {
                                commentUser = "<a href='https://www.waze.com/forum/user_message_redirect.php?username=" + result.users.objects[j].userName + "' target='_blank'><img src='" + pmIcon + "'></a> " + result.users.objects[j].userName + "(" + (result.users.objects[j].rank + 1) + ")";
                            }
                        }
                    }
                    tblHTML += "<tr><td><b>" + commentUser + "</b></td><td align=right style='font-size: 11px;'>" + moment(new Date(result.updateRequestSessions.objects[0].comments[lastCommentIndex].createdOn)).format('lll') + "</td></tr>";
                    tblHTML += "<tr style='background: #FFFFFF;border: 1px double #E6E6E6;border-radius: 1ex; '><td colspan=2>" + result.updateRequestSessions.objects[0].comments[lastCommentIndex].text + "</td></tr>";
                    $('#tblURConversation').append(tblHTML);
                    conversationLength = resultLength;
                } else {
                    await timer(50);
                    appendNewComment();
                }
            }
        });
    }

    bootstrap();
    loadObserver();

})();