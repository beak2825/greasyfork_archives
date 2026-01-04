// ==UserScript==
// @name         Slack file deleter
// @version      0.877.8777
// @description  try to take over the Slackkkkkk!
// @author       me
// @match        https://app.slack.com/client/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/310758
// @downloadURL https://update.greasyfork.org/scripts/389956/Slack%20file%20deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/389956/Slack%20file%20deleter.meta.js
// ==/UserScript==
(function() {


    if (GM_getValue("token") === undefined || GM_getValue("token") === null || GM_getValue("token") === "") {
        GM_setValue("token", prompt("Enter your token."));
    }
    if (GM_getValue("userid") === undefined || GM_getValue("userid") === null || GM_getValue("userid") === "") {
        GM_setValue("userid", prompt("Enter your member ID."));
    }

    var token = GM_getValue("token");
    var userid = GM_getValue("userid");
    var allFiles = [];
    var files = {};
    var status = 0;
    var fcount = 0;
    var page = 1;

    function main() {

        var getFile = GM_xmlhttpRequest({
            method: "GET",
            url: "https://slack.com/api/files.list?token=" + token + "&user=" + userid,
            onload: function(res) {
                var responseOK = JSON.parse(res.responseText).ok;
                if (!responseOK) {
                    GM_setValue("token", "");
                    GM_setValue("userid", "");
                    alert("token/member_id has something wrong");
                } else {
                    createMenu(res.responseText);
                }
            }
        });
    }


    function getFileAll(tsto) {
        var tstot = "";
        if (tsto != undefined) tstot = "&ts_to=" + tsto;
        return new Promise(function(resolve, reject) {
            var getFile = GM_xmlhttpRequest({
                method: "GET",
                url: "https://slack.com/api/files.list?token=" + token + "&user=" + userid + "&page=" + page + "&show_files_hidden_by_limit=true" + tstot,
                onload: async function(res) {
                    var responseOK = JSON.parse(res.responseText).ok;
                    if (!responseOK) {
                        console.log("token/member_id has something wrong");
                        reject("OBJECTION!");
                    } else {
                        var filez = JSON.parse(res.responseText).files;

                        var filecountz = JSON.parse(res.responseText).files.length;
                        JSON.parse(res.responseText).files.forEach(function(file) {
                                allFiles.push(file.id);
                            }

                        );
                        if (filecountz == 100) {
                            page++;
                            await getFileAll(tsto);
                        }

                        resolve();

                    }
                }
            });
        })
    }


    function createMenu(res) {

        var fileListHtml = "";

        files = JSON.parse(res).files;
        files.forEach(function(file) {
                fileListHtml += '<input type="checkbox" name="filecheckbox" value="' + file.id + '"><a href="' + file.url_private + '" target="_blank"><img src="' + file.thumb_64 + '" width="32" height="32"></a> ' + file.name + '@' + timeConverter(file.timestamp) + '<br>';
            }

        );

        var odom = document.createElement("div");
        odom.id = "slack-Menu";
        odom.style.cssText = "position: absolute;" +
            "top: 50px;" +
            "left: 20px;" +
            "z-index:999;" +
            "padding: 10px;" +
            "background: #fff;" +
            "color: black;" +
            "border-radius: 4px;";
        var innerH = "" +
            "<input id='slack-MenuDeleteAll'  type='button' style='background-color:red;color:white' value='Delete All'/>  " +
            "<input id='slack-MenuSelectDelete'  type='button' style='background-color:orange;color:white' value='Delete Selected'/>  " +
            "<input id='slack-MenuIntervalDelete'  type='button' style='background-color:green;color:white' value='Delete By Time'/>  " +
            "<input id='slack-MenuClose' type='button' style='background-color:blue;color:white' value='Close'/><br>" +
            fileListHtml +
            "";
        odom.innerHTML = innerH;
        document.body.appendChild(odom);
        document.querySelector("#slack-MenuDeleteAll").addEventListener("click", trueDeleteAll);
        document.querySelector("#slack-MenuSelectDelete").addEventListener("click", deleteSelected);
        document.querySelector("#slack-MenuIntervalDelete").addEventListener("click", deletefileByTimeInterval);
        document.querySelector("#slack-MenuClose").addEventListener("click", closeMenu);
    }

    function closeMenu() {
        var dioBox = document.querySelector("#slack-Menu");
        if (dioBox) {
            dioBox.parentNode.removeChild(dioBox);
            return;
        }
    }

    function trueDeleteAll() {
        page = 1;

        closeMenu();

        (async function() {
            alert("Deleting...Please Wait...");
            await getFileAll();
            if (0 <= allFiles.length < 40) {
                deleteAll(allFiles);
            } else {
                let c = 0;
                while (c <= allFiles.length - 1) {
                    await deletefileAsync(allFiles[c]);
                    console.info("Progress:" + (((c++) / allFiles.length) * 100).toFixed(2) + "%");
                }
                alert(allFiles.length + " files has been successfully deleted");
            }

        })().then(null, reject => {
            console.error('ERROR: ' + reject);
        });

    }


    function deleteAll(filez) {
        status = filez.length;
        fcount = status;
        filez.forEach(function(file) {
            deletefile(file);
        });
        closeMenu();
    }

    function deleteSelected() {
        var checkboxes = document.getElementsByName('filecheckbox');
        var selected = [];
        status = document.querySelectorAll('input[name="filecheckbox"]:checked').length;
        fcount = status;
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if (checkboxes[i].checked) {
                deletefile(checkboxes[i].value);
            }
        }
        closeMenu();
    }

    function deletefileAsync(fileID) {
        return new Promise(function(resolve, reject) {
            var deleteFile = GM_xmlhttpRequest({
                method: "GET",
                url: "https://slack.com/api/files.delete?token=" + token + "&file=" + fileID,
                onload: function(res) {
                    var responseOK = JSON.parse(res.responseText).ok;
                    if (!responseOK) {
                        alert("something wrong was happened when deleting files");
                        reject("OBJECTION!");
                    }
                    resolve();

                }
            });
        });
    }

    function deletefile(fileID) {
        var deleteFile = GM_xmlhttpRequest({
            method: "GET",
            url: "https://slack.com/api/files.delete?token=" + token + "&file=" + fileID,
            onload: function(res) {
                var responseOK = JSON.parse(res.responseText).ok;
                if (!responseOK) {
                    alert("something wrong was happened when deleting files");
                } else {
                    status--;
                    if (status == 0) {
                        alert(fcount + " files has been successfully deleted");
                    }
                }
            }
        });

    }

    function deletefileByTimeInterval() {
        var days = parseInt(prompt("Delete all files before X days? X∈N"));
        if (isNaN(days)) alert("incorrect number!");
        else {
            var times = timestampNow();
            times -= days * 86400;
            trueDeleteAll(times);
        }
    }

    function timeConverter(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = ("0" + a.getHours()).slice(-2);
        var min = ("0" + a.getMinutes()).slice(-2);
        var sec = ("0" + a.getSeconds()).slice(-2);
        var time = year + ' ' + month + ' ' + date + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    function timestampNow() {
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);
        return timestamp;
    }

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.code === "KeyR") {
            main();
        }
    })
})();