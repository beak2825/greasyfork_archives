// ==UserScript==
// @name         Jira assignee
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Set Jira assignee
// @match        https://hp-jira.external.hp.com/secure/RapidBoard.jspa*view=planning*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jira.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524355/Jira%20assignee.user.js
// @updateURL https://update.greasyfork.org/scripts/524355/Jira%20assignee.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const injectCSS = css => {
        let el = document.createElement('style');
        el.type = 'text/css';
        el.innerText = css;
        document.head.appendChild(el);
        return el;
    };

    injectCSS(`.button {margin: 0 5px 5px 5px;appearance: none;border: 2px solid rgba(27, 31, 35, .15);border-radius: 6px;box-shadow: rgba(27, 31, 35, .1) 0 1px 0;box-sizing: border-box;color: #fff;cursor: pointer;display: inline-block;font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";font-size: 13px;font-weight: 600;line-height: 10px;padding: 5px 6px;position: relative;text-align: center;text-decoration: none;user-select: none;-webkit-user-select: none;touch-action: manipulation;vertical-align: middle;white-space: nowrap;}
        .button-green {background-color: #2ea44f;}
        .button-pink {background-color: #EA4C89;}
        #assignee-list-config li {list-style-type: none}
        #assignee-list-config {position: fixed;z-index: 10000000;top: 0px;right: 60px;width: 360px;height: 482px; padding: 30px; background: -webkit-gradient(linear, 0 0, 0 100%, from(#fcfcfc), to(#f2f2f7)) !important}
        #assignee-list-config button {margin: 0 26px;text-align: center;white-space: nowrap;background-color: #f9f9f9 !important;border: 1px solid #ccc !important;box-shadow: inset 0 10px 5px white !important;border-radius: 3px !important;padding: 3px 3px !important; width: 100px}
        #assignee-list-config * {color: black;text-align: left;line-height: normal;font-size: 15px;min-height: 12px;}
        #assignee-list-config textarea { width: 300px;height: 400px;margin: 10px 0;}
        .last-assigned { background: lightblue; }
    `);

    // this config is from backlog's quicker filters in header
    let assignes;
    let assignedTasks = {};

    Promise.all([
        GM.getValue("assignee-config", '{}'),
    ]).then(function(values) {
        let assignesText = values[0];
        assignes = JSON.parse(assignesText);

        GM_registerMenuCommand('Assignees config', function(){
            $("body").append(`<div id="assignee-list-config">
                <li>
                    <span>Please input assignees config: <br>e.g <b>{"email": "display name"}</b></span>
                    <textarea></textarea>
                </li>
                <li>
                    <button id="assignee-list-config-ok">OK</button>
                    <button id="assignee-list-config-cancel">Cancel</button>
                </li>
            </div>`);

            $("#assignee-list-config textarea").val(JSON.stringify(assignes, null, 4));

            $("#assignee-list-config textarea").change(function(){
                $("#assignee-list-config textarea").css("border-color", "");
            })

            $("#assignee-list-config-ok").click(function(){
                try {
                    let newAssignes = JSON.parse($("#assignee-list-config textarea").val());
                    let newAssignesText = JSON.stringify(newAssignes);

                    if (newAssignesText !== assignesText) {
                        assignes = newAssignes;
                        assignesText = newAssignesText;
                        GM.setValue("assignee-config", newAssignesText);

                        // remove old assignee list and add new one
                        $(".assignee-list").remove();
                        addAssignee();
                    }

                    // remove config panel
                    $("#assignee-list-config").remove();
                } catch (e) {
                    $("#assignee-list-config textarea").css("border-color", "red");
                }
            })

            $("#assignee-list-config-cancel").click(function(){
                $("#assignee-list-config").remove();
            })
        });
    })

    function queryUserInfoFromCache(email) {
        let userInfo = localStorage.getItem("assignee_"+email);
        if (!userInfo) {
            fetch('https://hp-jira.external.hp.com/rest/api/2/user/search?username='+email, {
                method: 'GET',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            }).then(response => {
                return response.text();
            }).then(body => {
                if (body.length) {
                    let data = JSON.parse(body)[0]
                    console.log("-----------------", "email set in localStorage", email, data)

                    localStorage.setItem("assignee_"+email, JSON.stringify(data))

                    userInfo = data;
                }
            }).catch(err => console.error(err));
        }

        return JSON.parse(userInfo)
    }

    function assigneeEqual(email, text) {
        let userInfo = queryUserInfoFromCache(email);
        if (userInfo && userInfo.displayName === text) {
            return true
        }

        if (assignes[email]) {
            let emailToName = email.replace("@hp.com", "").replaceAll(".", " ").replace(/[0-9]/g, '');
            text = text.toLowerCase();

            return text.contains(assignes[email].toLowerCase()) || text.contains(emailToName)
        }

        return false;
    }

    function sleep(ms = 0) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addAssignee() {
        while (true) {
            let planned = $(".ghx-sprint-planned");
            if (! planned.length) {
                console.log("-----------------class ghx-sprint-planned not found!");
                await sleep(300)
                continue
            }
            let tasks = planned.find(".js-issue-list").children();
            if (! tasks.length) {
                console.log("-----------------sprint tasks not found!");
                return
            }

            if (_.isEmpty(assignes)) {
                await sleep(300)
                console.log("-----------------assignes not found!");
                return
            }
            // add story point hint
            $(".ghx-stat-total").each(function (index, value) {
                var estimate = $(this).find("aui-badge").text();

                if (value && $(this).parents(".ghx-backlog-container").find(".estimate-count").attr("points") != estimate) {
                    $(this).parents(".ghx-backlog-container").find(".estimate-count").remove();
                    $(this).parents(".ghx-backlog-container").find(".ghx-issue-count").after('<div class="estimate-count" style="font-weight: bold; display: inline; margin-left: 10px;" points="'+estimate+'">Total points: ' + estimate +'</div>');
                }
            })

            let lastAssignIssue = localStorage.getItem("last_assign_issue");

            // add assignee
            tasks.each(function(index, element) {
                let issueId = $(this).attr("data-issue-key");
                if (issueId !== undefined) {
                    if (lastAssignIssue === issueId) {
                        $(this).addClass("last-assigned");
                    }

                    if ($(this).find(".assignee-list").length) {
                        return;
                    }

                    // cut the shadow, and expose this tool to click
                    $(this).find('.m-sortable-trigger').css("height", $(this).find(".ghx-issue-content").height());

                    let assignedTitle = "";

                    let assignedNode = $(this).find('.ghx-estimate');
                    if (assignedNode.length === 1) {
                        assignedTitle = assignedNode.children().first().attr("title").replace("Assignee: ", "");
                    }

                    $(this).append('<div class="assignee-list"></div>');

                    for (const email in assignes) {
                        let btnClass = "button-green";

                        // if has assigned from this tool, or assignee already existed
                        if (
                            assignedTasks[issueId] == email ||
                            assignedTasks[issueId] == undefined && assigneeEqual(email, assignedTitle) && (assignedTasks[issueId] = email)
                        ) {
                            btnClass = "button-pink";
                        }

                        $(this).children(".assignee-list").append('<button class="button '+btnClass+' set-assignee" email="'+email+'">'+assignes[email]+'</button>');
                    }
                    $(this).css("margin-bottom", "7px");
                }
            })

            $(".assignee-list").unbind('click').click(function(e) {
                e.stopPropagation();
            });

            $(".set-assignee").unbind('click').click(function(e) {
                if ($(this).hasClass("button-pink")) {
                    return;
                }

                let issueId = $(this).parent().parent().attr("data-issue-key");
                localStorage.setItem("last_assign_issue", issueId);

                $(this).parents(".ghx-issues").find(".last-assigned").removeClass("last-assigned");
                $(this).parent().parent().addClass("last-assigned");

                // remove color from others
                $(this).parent().find(".button-pink").removeClass("button-pink").addClass("button-green");

                let changingBorderColor = setInterval(function flashText(target) {
                        target.toggleClass("button-green").toggleClass("button-pink");
                }, 160, $(this));

                let responseCode = 204;
                let email = $(this).attr("email");

                fetch('https://hp-jira.external.hp.com/rest/api/2/issue/'+issueId, {
                    method: 'PUT',
                    body: `{"fields": {"assignee": {"name": "`+email+`"}}}`,
                    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                }).then(response => {
                    responseCode = response.status;

                    if (responseCode !== 204) {
                        $(this).addClass("button-green").removeClass("button-pink");
                        alert(`change assignee failed, Response status: ${response.status}`);

                    } else {
                        $(this).removeClass("button-green").addClass("button-pink");

                        assignedTasks[issueId] = email;
                    }

                    clearInterval(changingBorderColor);

                    return response.text();
                }).then(body => {
                    if (responseCode !== 204) {
                        console.log(`---------------------------------issue: ${issueId}, change assignee failed, status code ${responseCode}, response message ${body}`)
                    }
                }).catch(err => console.error(err));
            });

            await sleep(1000)
        }
    }

    addAssignee();

    let avatarColorDict = {
        "C": "#f691b2",
        "L": "#8eb021",
        "Y": "#654982",
    }

    function getLetterCol(firstLetter) {
        if (firstLetter.length > 1) {
            firstLetter = firstLetter[0];
        }

        firstLetter = firstLetter.toUpperCase();
        return avatarColorDict[firstLetter] || "#8eb021";
    }

    // modify workload info
    $(document).on('DOMNodeInserted','#assigned-work-dialog',function() {
        // has not modified and display layer is show
        if (! $('#assigned-work-dialog').hasClass("fixed-by-script") && $("#aui-dialog-close").length) {
            // find out all assignee list boxes
            let sprintName = $("#assigned-work-dialog-title").text().replace("Workload by assignee - ", "");
            let assigneeList;
            $('span[data-fieldname="sprintName"]').each(function() {
                if ($(this).text() === sprintName) {
                    assigneeList = $(this).parents(".ghx-backlog-container").find(".assignee-list");
                }
            })

            if (assigneeList === undefined || ! assigneeList.length) {
                console.log("assigneeList not found, exit")
                return;
            }

            // calculate workload
            let workloadList = {};

            assigneeList.each(function(index, element) {
                let identifier = "Unassigned"

                if ($(element).find(".button-pink").length) {
                    identifier = $(element).find(".button-pink").attr("email");
                }

                let point = parseFloat($(element).siblings(".ghx-issue-content").find(".ghx-estimate aui-badge").text());

                if (!workloadList.hasOwnProperty(identifier)) {
                    workloadList[identifier] = {"point": point, "issues": 1};
                } else {
                    workloadList[identifier].point += point;
                    workloadList[identifier].issues += 1;
                }
            })

            $.each(workloadList, function(email, info) {
                let assigneeRowExist = false

                $("#assigned-work-dialog").find("tbody tr").each(function(index, tr) {
                    let firstTd = $(tr).children().first();
                    let assignee = firstTd.text();

                    // assignee node has two format
                    // <td><span class="ghx-no-avatar">Unassigned</span></td>
                    // <td><img class="ghx-avatar-img" alt="" loading="lazy">assignee name</td>
                    if (assignee !== "Unassigned") {
                        assignee = firstTd.clone().children().remove().end().text();
                    }

                    if (email === "Unassigned" || assigneeEqual(email, assignee)) {
                        assigneeRowExist = true;

                        $('#assigned-work-dialog').addClass("fixed-by-script");

                        let issuesInTable = parseInt($(tr).children().eq(1).text());
                        if (issuesInTable !== info.issues) {
                            $(tr).children().eq(1).text(info.issues);
                            $(tr).children().eq(2).text(info.point);

                            console.log(`change Workload for user: ${email}, issues: ${info.issues}, point: ${info.point}`);
                        }
                        return false;
                    }
                })

                if (!assigneeRowExist) {
                    let userInfo = queryUserInfoFromCache(email);

                    if (!userInfo) {
                        return;
                    }

                    let firstLetter = userInfo.displayName[0];
                    let color = getLetterCol(firstLetter);
                    let image = `<span class="ghx-avatar-img ghx-auto-avatar" style="background-color: ${color}; ">${firstLetter}</span>`;

                    let avatar = userInfo.avatarUrls["48x48"];
                    if (avatar !== "https://hp-jira.external.hp.com/secure/useravatar?avatarId=10122") {
                        image = `<img src="${avatar}" class="ghx-avatar-img" alt="" loading="lazy">`;
                    }


                    $("#assigned-work-dialog").find("tbody").append(`<tr>
                        <td>${image}${userInfo.displayName}</td>
                        <td class="ghx-right">${info.issues}</td>
                        <td class="ghx-right">${info.point}</td>
                    </tr>`);
                }
            })
        }
    })
})();