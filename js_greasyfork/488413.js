// ==UserScript==
// @name         Add Dropdown and Confirm Button to Job Listings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a dropdown list of jobs with checkboxes and a confirm button to the job title.
// @author       LangLink-Floyd
// @match        https://langlinking.s.xtrf.eu/vendors/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488413/Add%20Dropdown%20and%20Confirm%20Button%20to%20Job%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/488413/Add%20Dropdown%20and%20Confirm%20Button%20to%20Job%20Listings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let jobsData = [];
    const dropdownContent = document.createElement('div');

    async function fetchData() {
        const response = await fetch("https://langlinking.s.xtrf.eu/vendors/jobs?statuses=IN_PROGRESS,IN_PROGRESS_AWAITING_CORRECTIONS,PENDING");
        jobsData = await response.json();
        populateDropdown(); // No need to pass jobsData as it's accessible in the outer scope
    }

    function createDropdownContainer() {
        // 创建下拉列表的容器
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown-container';
        dropdownContainer.style.marginLeft = '20px';
        dropdownContainer.style.display = 'inline-block';

        dropdownContent.className = 'dropdown-content';
        dropdownContent.style.display = 'none';
        dropdownContent.style.position = 'absolute';
        dropdownContainer.style.marginLeft = '60%';
        dropdownContent.style.overflowY = 'auto';
        dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdownContent.style.zIndex = '1';
        dropdownContent.style.maxHeight = '100px';
        dropdownContent.style.backgroundColor = 'white';

        // 创建触发下拉的按钮
        const dropdownButton = document.createElement('button');
        dropdownButton.textContent = 'Select Jobs';
        dropdownButton.onclick = function () {
            dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
        };

        // 将下拉内容和按钮添加到容器中
        dropdownContainer.appendChild(dropdownButton);
        dropdownContainer.appendChild(dropdownContent);

        return dropdownContainer;
    }

    function populateDropdown() {
        // 填充下拉内容，仅当jobsData非空时执行
        if (jobsData.length > 0) {
            jobsData.forEach(job => {
                const checkboxLabel = document.createElement('label');
                checkboxLabel.style.display = 'block';
                checkboxLabel.style.padding = '10px';
                checkboxLabel.style.cursor = 'pointer';
                checkboxLabel.style.backgroundColor = 'white';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = job.id;
                checkbox.style.marginRight = '5px';

                const textNode = document.createTextNode(job.overview.idNumber);

                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(textNode);
                dropdownContent.appendChild(checkboxLabel);
            });
        }
    }

    function initializeUI() {
        const dropdownContainer = createDropdownContainer();

        // 创建确认按钮
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm Selection';
        confirmButton.style.marginLeft = '10px';
        confirmButton.style.position = 'absolute';
        confirmButton.style.display = 'inline-block';
        confirmButton.addEventListener('click', () => confirmSelection());

        // 尝试找到<header>元素并追加下拉列表和确认按钮
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.appendChild(dropdownContainer);
            headerElement.appendChild(confirmButton);
        } else {
            console.error('Could not find the header element.');
            // 作为后备方案，可以选择添加到body或其他元素
            document.body.appendChild(dropdownContainer);
            document.body.appendChild(confirmButton);
        }
    }

    function confirmSelection() {
        const selectedJobIds = Array.from(dropdownContent.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        console.log('Selected job IDs:', selectedJobIds);
        // 在这里实现发送PUT请求的逻辑
    }

    function waitForHeader() {
        const observer = new MutationObserver((mutations, obs) => {
            const header = document.querySelector('header');
            if (header) {
                initializeUI();
                obs.disconnect(); // Stop observing once we have found and processed the header
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Call fetchData to start the process
    fetchData();

    // Use waitForHeader to delay UI initialization until the header is available
    waitForHeader();
})();
