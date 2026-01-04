// ==UserScript==
// @name         Modify Limit Rate Script
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Modify limit_rate directly from the fetched data
// @author       Your Name
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523260/Modify%20Limit%20Rate%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523260/Modify%20Limit%20Rate%20Script.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create modify limit_rate button
    const modifyButton = document.createElement('button');
    modifyButton.textContent = '修改 limit_rate';
    modifyButton.style.position = 'fixed';
    modifyButton.style.top = '10px';
    modifyButton.style.right = '10px';
    modifyButton.style.zIndex = 1000;
    modifyButton.style.padding = '10px 15px';
    modifyButton.style.backgroundColor = '#007BFF';
    modifyButton.style.color = '#FFFFFF';
    modifyButton.style.border = 'none';
    modifyButton.style.borderRadius = '5px';
    modifyButton.style.cursor = 'pointer';
    document.body.appendChild(modifyButton);

    // Get the id from the current URL path
    function getIdFromUrl() {
        const pathSegments = window.location.pathname.split('/'); // Split the path into segments
        return pathSegments[pathSegments.length - 1]; // Get the last segment which should be the id
    }

    // Modify limit_rate button event handler
    modifyButton.addEventListener('click', () => {
        const id = getIdFromUrl(); // Fetch the id from the URL

        if (!id) {
            alert("无法获取 ID，请确保 URL 中包含 'id'。");
            return;
        }

        const fetchUrl = window.location.origin + `/api/admin/storage/get?id=${id}`;
        const token = window.localStorage['token'];

        fetch(fetchUrl, {
            method: "GET",
            headers: {
                "authorization": token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("获取成功:", data);

            // Prompt for limit_rate modification based on current value
            const newLimitRate = prompt("当前 limit_rate: " + data.data.limit_rate + "\n请输入新的 limit_rate 值（留空则不修改）:");

            if (newLimitRate !== null && newLimitRate.trim() !== "") {
                // Update limit_rate in data
                const limitRateValue = parseFloat(newLimitRate);
                data.data.limit_rate = limitRateValue; // Update limit_rate

                // Parse and modify the addition field
                const additionData = JSON.parse(data.data.addition);

                // Update the addition field with the new limit_rate
                additionData.limit_rate = limitRateValue;

                // Remove sensitive information if not necessary
                delete additionData.AccessToken; // Remove if not needed
                delete additionData.refresh_token; // Remove if not needed

                // Update the addition field back to JSON string
                data.data.addition = JSON.stringify(additionData);
            }

            // Confirm before updating
            if (confirm("是否更新 limit_rate 到以下值: " + data.data.limit_rate + "?")) {
                const updateUrl = window.location.origin + "/api/admin/storage/update"; // Assuming the update URL follows this pattern

                // Send updated data back to the server
                fetch(updateUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    },
                    body: JSON.stringify(data.data), // Send the modified data
                })
                .then(response => response.json())
                .then(responseData => {
                    console.log("更新成功:", responseData);
                    alert("limit_rate 更新成功！新值为: " + data.data.limit_rate);
                })
                .catch(error => {
                    console.error("更新错误:", error);
                    alert("limit_rate 更新失败，请查看控制台以获取详情。");
                });
            }
        })
        .catch(error => {
            console.error("获取错误:", error);
            alert("数据获取失败，请查看控制台以获取详情。");
        });
    });
})();

