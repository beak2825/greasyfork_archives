// ==UserScript==
// @name         pyAnywhere clickable file paths
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  subj
// @author       Alex R
// @license      none
// @match        https://*.pythonanywhere.com/user/*/tasks_tab/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pythonanywhere.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512253/pyAnywhere%20clickable%20file%20paths.user.js
// @updateURL https://update.greasyfork.org/scripts/512253/pyAnywhere%20clickable%20file%20paths.meta.js
// ==/UserScript==
console.log("py")
let allTasks;
const suffix = "?edit";
const fileNameRE = /python3\.10(.*\.py)/;
const origin = "https://eu.pythonanywhere.com/user/alexdiscordbot/files/";
const notFound = setInterval(()=>{
    allTasks = Array.from(document.querySelectorAll(".wide-column.scheduled_tasks_command"));
    if (allTasks.length !== 0){
        clearInterval(notFound);
        allTasks.push(document.querySelector(".always_on_task_command"));
        main();
    }
}, 100);
function main(){
    allTasks.forEach(task=>{
        let filePath = task.textContent.match(fileNameRE)[1];
        console.log(filePath, filePath.startsWith(" mysite"));
        let newFilePath = filePath;
        if (filePath.startsWith(" mysite")) newFilePath = "/home/alexdiscordbot/" + filePath.trim();
        console.log("newFilePath", newFilePath)
        task.textContent = task.textContent.replace(filePath, "");
        let a = document.createElement("a");
        a.innerHTML = newFilePath;
        a.href = origin + newFilePath.trim() + suffix;
        task.appendChild(a);
    });
}
const loadedInterval = setInterval(()=>{
    const timeSpan = document.querySelector("#id_server_time");
    if (!timeSpan) return;
    const timeArr = timeSpan.textContent.split(":");
    document.querySelector("#id_scheduled_tasks_table > div > form > input:nth-child(2)").value = timeArr[0];
    document.querySelector("#id_scheduled_tasks_table > div > form > input:nth-child(3)").value = parseInt(timeArr[1]) + 1;
    clearInterval(loadedInterval);
}, 100);
