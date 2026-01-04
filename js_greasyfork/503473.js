// ==UserScript==
// @name         dataannotation tasks notification
// @namespace    https://github.com/matthewwang16czap/TempermonkeyScripts
// @version      0.2
// @description  Auto login and auto refresh pages to find new available projects.
// @author       Shihanasaku
// @license      MIT
// @match        https://www.dataannotation.tech/*
// @match        https://app.dataannotation.tech/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/503473/dataannotation%20tasks%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/503473/dataannotation%20tasks%20notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // help functions
    const login = (email, password) => {
        document.getElementById("user_email").value = email;
        document.getElementById("user_password").value = password;
        document.querySelector("input.btn").click();
    };
    const get_account = () => {
        let email = GM_getValue("email", '');
        let password = GM_getValue("password", '');
        return [email, password];
    };
    const set_account = (email, password) => {
        GM_setValue("email", email);
        GM_setValue("password", password);
        console.log(get_account());
    };
    const get_tasklogs = () => GM_getValue("tasklogs", []);
    const set_tasklogs = tasklogs => {
        GM_setValue("tasklogs", tasklogs);
        // console.log(get_tasklogs());
    };

    // menu
    let clear_storage = GM_registerMenuCommand("Clear storage", () => set_account('', ''));
    let goto_login = GM_registerMenuCommand("Login your account", () => {
        window.location.href = "https://app.dataannotation.tech/users/sign_in";
    });

    // if it is the login page
    if (window.location.href == "https://app.dataannotation.tech/users/sign_in") {
        // set default tasklogs
        set_tasklogs(['Onboarding Step 1 - Platform Basics', 'Onboarding Step 2 - Getting Paid!', 'Onboarding Step 3 - Practice Quiz!']);

        // if failed login, clear storage of current account
        if (document.querySelector(".alert") && !document.querySelector(".alert").innerText.includes('success')) {
            set_account('', '');
        }
        // if has stored account
        let [email, password] = get_account();
        if (email != '' && password != '') {
            login(email, password);
        }
        // if does not have stored account, wait for record user's account
        else {
            let form = document.querySelector("#new_user");
            let new_div = document.createElement("div");
            new_div.innerHTML = `</br><button style="color:red;">save my account for auto login</button>`;
            new_div.addEventListener("click", () => {
                set_account(document.getElementById("user_email").value, document.getElementById("user_password").value);
                alert("successfully save your account!");
            });
            form.parentNode.appendChild(new_div);
        }
    }

    // set up notifications
    if (window.location.href == "https://app.dataannotation.tech/workers/projects") {
        let tasks = document.getElementsByTagName("table")[1].childNodes[1].childNodes;
        let tasklogs = get_tasklogs();
        let new_tasks_dict = Array.from(tasks).reduce((dict, task) => {
            if (!tasklogs.includes(task.childNodes[0].innerText)) {
                dict[task.childNodes[0].innerText] = task.childNodes[0].querySelector('a').href;
            }
            return dict;
        }, {});
        let new_tasklogs = Array.from(tasks).map(task => task.childNodes[0].innerText);
        // update tasklogs
        set_tasklogs(new_tasklogs);
        // get notified
        if (Object.keys(new_tasks_dict).length != 0) {
            Object.keys(new_tasks_dict).forEach(taskname => {
                GM_notification({
                    text: taskname,
                    title: "DataAnnotation",
                    url: new_tasks_dict[taskname],
                    onclick: (event) => {
                        // The userscript is still running, so don't open example.com
                        // event.preventDefault();
                        // Display an alert message instead
                        // alert('I was clicked!')
                  }
                });
            });
        }
        // set sleep time to refresh (10 mins)
        setTimeout(() => {
          location.reload();
        }, 10*60*1000);
    }
})();