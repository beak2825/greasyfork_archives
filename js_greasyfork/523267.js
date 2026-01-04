// ==UserScript==
// @name         alist beta版的用户开启全部权限
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fetch and Update User information from API
// @author       Your Name
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523267/alist%20beta%E7%89%88%E7%9A%84%E7%94%A8%E6%88%B7%E5%BC%80%E5%90%AF%E5%85%A8%E9%83%A8%E6%9D%83%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/523267/alist%20beta%E7%89%88%E7%9A%84%E7%94%A8%E6%88%B7%E5%BC%80%E5%90%AF%E5%85%A8%E9%83%A8%E6%9D%83%E9%99%90.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create fetch user button
    const fetchUserButton = document.createElement('button');
    fetchUserButton.textContent = '进入alist的管理，用户里admin先点我，在点更新用户信息';
    fetchUserButton.style.position = 'fixed';
    fetchUserButton.style.top = '10px';
    fetchUserButton.style.right = '10px';
    fetchUserButton.style.zIndex = 1000;
    fetchUserButton.style.padding = '10px 15px';
    fetchUserButton.style.backgroundColor = '#28a745';
    fetchUserButton.style.color = '#FFFFFF';
    fetchUserButton.style.border = 'none';
    fetchUserButton.style.borderRadius = '5px';
    fetchUserButton.style.cursor = 'pointer';
    document.body.appendChild(fetchUserButton);

    // Create update user button
    const updateUserButton = document.createElement('button');
    updateUserButton.textContent = '在点更新用户信息';
    updateUserButton.style.position = 'fixed';
    updateUserButton.style.top = '50px';
    updateUserButton.style.right = '10px';
    updateUserButton.style.zIndex = 1000;
    updateUserButton.style.padding = '10px 15px';
    updateUserButton.style.backgroundColor = '#007BFF';
    updateUserButton.style.color = '#FFFFFF';
    updateUserButton.style.border = 'none';
    updateUserButton.style.borderRadius = '5px';
    updateUserButton.style.cursor = 'pointer';
    document.body.appendChild(updateUserButton);

    // Get the id from the current URL path
    function getIdFromUrl() {
        const pathSegments = window.location.pathname.split('/');
        return pathSegments[pathSegments.length - 1]; // Get the last segment which should be the id
    }

    // Fetch user information
    fetchUserButton.addEventListener('click', () => {
        const id = getIdFromUrl(); // Fetch the id from the URL

        if (!id) {
            alert("无法获取 ID，请确保 URL 中包含 'id'。");
            return;
        }

        const fetchUrl = window.location.origin + `/api/admin/user/get?id=${id}`;
        const token = window.localStorage['token'];

        fetch(fetchUrl, {
            method: "GET",
            headers: {
                "authorization": token
            }
        })
        .then(response => {
            console.log("Response Status:", response.status);
            return response.text();
        })
        .then(text => {
            console.log("获取成功:", text);
            try {
                const data = JSON.parse(text);
                if (data.code !== 200) {
                    alert("获取用户信息失败: " + data.message);
                    return;
                }

                // Populate user data for editing
                const userData = data.data;
                const username = prompt("当前用户名: " + userData.username + "\n请输入用户名（不能为空）:", userData.username);

                // Ensure a username is provided
                if (!username || username.trim() === "") {
                    alert("用户名不能为空。请重新提供有效的用户名。");
                    return; // Exit if username is empty
                }

                const password = prompt("当前密码: " + userData.password + "\n请输入新的密码（留空则不修改）:", userData.password);

                // Prepare user update data with permission set to 4095
                const updateData = {
                    id: userData.id,
                    username: username.trim(),  // Use trimmed username
                    password: password !== null && password.trim() !== "" ? password : userData.password,
                    base_path: userData.base_path,
                    role: userData.role,
                    permission: 4095,  // Set permission to 4095 as requested
                    disabled: userData.disabled,
                    sso_id: userData.sso_id
                };

                // Store the update data in the data object for use in updating
                updateUserButton.dataset.updateData = JSON.stringify(updateData);
            } catch (error) {
                console.error("JSON 解析错误:", error);
                alert("获取用户信息失败，返回的数据不是有效的 JSON。请查看控制台以了解更多信息。");
            }
        })
        .catch(error => {
            console.error("获取错误:", error);
            alert("数据获取失败，请查看控制台以获取详情。");
        });
    });

    // Update user information
    updateUserButton.addEventListener('click', () => {
        const updateData = JSON.parse(updateUserButton.dataset.updateData || "{}");
        const updateUrl = window.location.origin + "/api/admin/user/update";
        const token = window.localStorage['token'];

        if (!updateData.username) {
            alert("请先获取用户信息！"); // Ensure there is update data
            return;
        }

        // Send updated data back to the server
        fetch(updateUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify(updateData),
        })
        .then(response => response.json())
        .then(responseData => {
            console.log("更新成功:", responseData);
            alert("用户信息更新成功！请重启alist");
        })
        .catch(error => {
            console.error("更新错误:", error);
            alert("用户信息更新失败，请查看控制台以获取详情。");
        });
    });
})();
