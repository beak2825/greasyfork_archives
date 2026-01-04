// ==UserScript==
// @name         Tapd Diff工具
// @license      MIT
// @version      1.5
// @description  在TAPD中执行Diff操作
// @author       Liuyutong
// @match        https://tapd.woa.com/*
// @grant        GM_xmlhttpRequest
// @namespace   https://greasyfork.org/users/1156129
// @downloadURL https://update.greasyfork.org/scripts/473567/Tapd%20Diff%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/473567/Tapd%20Diff%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var username = 'P4_Test';
    var password = '35440159-8C14-A5D6-0593-AD2F54D844BB';

    var text1 = document.createTextNode('表格：');
    var text2 = document.createTextNode(' 版本：');
    var text3 = document.createTextNode(' 与 ');

    var span1 = document.createElement('span');
    var span2 = document.createElement('span');
    var span3 = document.createElement('span');

    span1.appendChild(text1);
    span2.appendChild(text2);
    span3.appendChild(text3);

    var selectElement = document.createElement('select');
    selectElement.id = 'commitSelect';
    selectElement.style.width = 'inherit';
    selectElement.style.position = 'relative';
    selectElement.style.top = '50%';
    selectElement.style.transform = 'translateY(50%)';

    var firstDropdown = document.createElement('select');
    firstDropdown.style.width = 'inherit';
    firstDropdown.style.position = 'relative';
    firstDropdown.style.top = '50%';
    firstDropdown.style.transform = 'translateY(50%)';

    var secondDropdown = document.createElement('select');
    secondDropdown.style.width = 'inherit';
    secondDropdown.style.position = 'relative';
    secondDropdown.style.top = '50%';
    secondDropdown.style.transform = 'translateY(50%)';

    var ulElement = document.querySelector('ul#g_tab');

    var button = document.createElement('button');
    button.textContent = '对比';
    button.style.width = 'inherit';
    button.style.position = 'relative';
    button.style.top = '50%';
    button.style.transform = 'translateY(50%)';
    button.addEventListener('click', function() {
        var selectedFileName = selectElement.value;
        console.log('Selected File:', selectedFileName);
        console.log('TapdDiff://' + selectedFileName + ',' + firstDropdown.value + ',' + secondDropdown.value);
        window.location.href = 'TapdDiff://' + selectedFileName + ',' + firstDropdown.value + ',' + secondDropdown.value;

    });
    var buttonCompareAll = document.createElement('button');
    buttonCompareAll.textContent = '对比所有';
    buttonCompareAll.style.width = 'inherit';
    buttonCompareAll.style.position = 'relative';
    buttonCompareAll.style.top = '50%';
    buttonCompareAll.style.transform = 'translateY(50%)';
    buttonCompareAll.addEventListener('click', function() {

        // 获取所有子选项
        var options = firstDropdown.querySelectorAll("option");

        // 遍历所有子选项
        var command = ""
        command = command + 'TapdDiff://DiffAllChangeInStory' + decodeURIComponent(selectElement.value)
        for (var i = options.length - 2; i >= 0; i--) {
              if (options[i].text.startsWith('#')) {
                  command = command + ',' + options[i].value
              }
        }

        var selectedFileName = selectElement.value;
        console.log('command:', command);
        window.location.href = command

    });


    function updateDropdowns() {
        if (selectElement && 'value' in selectElement) {
            var selectedFile = selectElement.value.split("/").pop();
        }

        var fileVersions = [];
        const regex = /#(\d+)/;

        responseData.data.forEach(function(commit) {
            Object.keys(commit.file_sort).forEach(function(key) {
                if (key.includes('.xlsx')) {
                    var fileName = key.split('/').pop().split('.').slice(0, -1).join('.');
                    if (fileName === selectedFile) {
                        fileVersions.push(regex.exec(key)[0]);
                    }
                }
            });
        });

        fileVersions.sort(function(a, b) {
            return parseInt(a.split('#')[0]) - parseInt(b.split('#')[0]);
        });

        var minVersion = 1;
        if (fileVersions.length > 0) {
            minVersion = '#' + Math.max(1, parseInt(fileVersions.slice(-1)[0].split('#')[1]) - 1);
        }

        firstDropdown.innerHTML = '';
        secondDropdown.innerHTML = '';

        var newOption = document.createElement('option');
        newOption.value = 'New';
        newOption.textContent = 'P4最新版本';
        firstDropdown.appendChild(newOption);
        secondDropdown.appendChild(newOption.cloneNode(true));

        fileVersions.forEach(function(version) {
            var option = document.createElement('option');
            option.value = version;
            option.textContent = version;
            firstDropdown.appendChild(option);
            secondDropdown.appendChild(option.cloneNode(true));
        });

        var originalOption = document.createElement('option');
        originalOption.value = minVersion;
        originalOption.textContent = 'Story原始版本';
        firstDropdown.appendChild(originalOption);
        secondDropdown.appendChild(originalOption.cloneNode(true));
    }

    selectElement.addEventListener('change', updateDropdowns);
    function onResponse(response){
        responseData = JSON.parse(response.responseText);
        console.log(responseData);
        if (responseData.data.length > 0) {
            selectElement.innerHTML = '';
            responseData.data.forEach(function(commit) {
                Object.keys(commit.file_sort).forEach(function(key) {
                    if (key.includes('.xlsx')) {
                        var file = key.split('/').pop().split('.').slice(0, -1).join('.');
                        var filefullpath = key.split(' ')[0].split('.')[0];
                        var optionValue = filefullpath;
                        var optionText = file + '.xlsx';

                        var existingOption = Array.from(selectElement.options).find(function(option) {
                            return option.textContent === optionText;
                        });

                        if (!existingOption) {
                            var option = document.createElement('option');
                            option.value = optionValue;
                            option.textContent = optionText;
                            selectElement.appendChild(option);
                        }
                        ulElement.appendChild(selectElement);
                        ulElement.appendChild(firstDropdown);
                        ulElement.appendChild(secondDropdown);
                        ulElement.appendChild(button);
                        ulElement.appendChild(buttonCompareAll);

                        selectElement.parentNode.insertBefore(span1, selectElement);
                        firstDropdown.parentNode.insertBefore(span2, firstDropdown);
                        secondDropdown.parentNode.insertBefore(span3, secondDropdown);

                        updateDropdowns();
                    }
                });
            });
        }
    }
    function makeAPIRequest() {

        var currentURL = window.location.href;
        var typeList = ['story','bug'];
        var url = 'http://apiv2.tapd.woa.com/code_commit_infos?workspace_id=20358902&type=story&object_id=' + currentURL.substring(currentURL.lastIndexOf('/') + 1) + '&tab_type=P4';
        console.log(url);
        GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        },
        onload: function(response) {
            onResponse(response);
        }
        });

        url = 'http://apiv2.tapd.woa.com/code_commit_infos?workspace_id=20358902&type=bug&object_id=' + currentURL.match(/bug_id=(\d+)/)[1] + '&tab_type=P4';
        console.log(url);
        GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        },
        onload: function(response) {
            onResponse(response);
        }
        });
    }

    var responseData;
    makeAPIRequest();
})();