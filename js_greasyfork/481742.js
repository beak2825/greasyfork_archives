// ==UserScript==
// @name         武大全自动评教
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  全自动评教，一键评教
// @author       game-loader
// @license MIT
// @source       https://github.com/game-loader
// @match        *://ugsqs.whu.edu.cn/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/481742/%E6%AD%A6%E5%A4%A7%E5%85%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/481742/%E6%AD%A6%E5%A4%A7%E5%85%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to retrieve and store necessary page values
    function retrievePageValues() {
        let hdfaid = document.getElementById('hdfaid').value;
        let kkxy = document.getElementById('kkxy').value;
        let roid = document.getElementById('roid').value;

        // Store these values for later use
        GM_setValue('hdfaid', hdfaid);
        GM_setValue('kkxy', kkxy);
        GM_setValue('roid', roid);
    }

    // Function to construct the POST request URL
    function constructPostRequestUrl() {
        let hdfaid = GM_getValue('hdfaid');
        let kkxy = GM_getValue('kkxy');
        let roid = GM_getValue('roid');

        return `https://ugsqs.whu.edu.cn/getStudentPjPf/${hdfaid}/${kkxy}/${roid}`;
    }

    // Add styles for the floating button
    GM_addStyle(`
        #autoEvaluateButton {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10000;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `);



    function evaluate(item) {
        let dxids, dxvalues;

        if (item.KCLX === '理论课') {
            dxids = [2502, 2484, 2485, 2499, 2500, 2477, 2497, 2478, 2479, 2498, 2480, 2481, 2482, 2496, 2483, 2486, 2501, 2487, 2488, 2489, 2490, 2491];
            dxvalues = [10, 5, 5, 5, 5, 5, 5, 7, 7, 7, 8, 8, 8, 1.2, 3, 2, 3, 3, 3, 3, 3, 3];
        } else if (item.KCLX === '实验课') {
            dxids = [2572, 2571, 2573, 2574, 2575, 2576, 2577, 2578, 2579, 2580, 2581, 2555, 2556, 2557, 2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566];
            dxvalues = [10, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 6, 1.2, 3, 3, 2, 3, 3, 3, 3, 3];
        } else if (item.KCLX === '体育课') {
            dxids = [2507, 2508, 2509, 2510, 2511, 2512, 2513, 2514, 2515, 2516, 2517, 2518, 2519, 2520, 2521, 2522, 2523, 2524, 2525];
            dxvalues = [10, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 1.2, 4, 4, 3, 3, 3, 3, 3];
        }else if(item.KCLX === '外语课'){
            dxids = [2507, 2508, 2509, 2510, 2511, 2512, 2513, 2514, 2515, 2516, 2517, 2518, 2519, 2520, 2521, 2522, 2523, 2524, 2525];
            dxvalues = [10, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 1.2, 4, 4, 3, 3, 3, 3, 3];
        }else{
            return;
        }

        // Randomly choose between 1.2 and 1.6 for the specific dxvalue
        let randomIndex = dxvalues.indexOf(1.2);
        dxvalues[randomIndex] = Math.random() < 0.5 ? 1.2 : 1.6;

        // Calculate zf value based on randomDxValue
        let zf = dxvalues[randomIndex] === 1.2 ? 99.2 : 99.6;

        const data = new URLSearchParams();
        dxids.forEach((dxid, index) => {
            data.append('dxid', dxid);
            data.append('dxvalue', dxvalues[index]);
        });

        // Add sfjft values
        let sfjfts = new Array(dxids.length).fill(1);
        sfjfts[0] = 0;
        sfjfts.forEach(sfjft => data.append('sfjft', sfjft));

        // Add wdid and wdvalue pairs
        let wdids;
        if (item.KCLX === '理论课') {
            wdids=[2492, 2493, 2494, 2495]
        } else if (item.KCLX === '实验课') {
            wdids=[2567,2568,2569,2570];
        } else if (item.KCLX === '体育课') {
            wdids=[2503,2504,2505,2506];
        } else if (item.KCLX === '外语课') {
            wdids=[2503,2504,2505,2506];
        }

        let wdvalues = [0, 0, 0, '很棒'];
        wdids.forEach((wdid, index) => {
            data.append('wdid', wdid);
            data.append('wdvalue', wdvalues[index]);
        });

        // Add remaining data
        data.append('rwid', GM_getValue('hdfaid')); // Assuming you store rwid using GM_setValue somewhere
        data.append('xqid', item.XQID);
        data.append('jsgh', item.GH);
        data.append('kch', item.KCH);
        data.append('bzxh', item.BZXH);
        data.append('jxbdm', item.JXBDM);
        data.append('xsxh', item.XH);
        data.append('zf', zf);
        data.append('pjjgid', ''); // Assuming pjjgid is an empty string as per the example

        // Send POST request
        fetch('https://ugsqs.whu.edu.cn/createStudentPjpf', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(responseData => console.log('Evaluation submitted', responseData))
            .catch(error => console.error('Error submitting evaluation', error));


    }


    function processData(responseData) {
        let data = responseData.aaData;
        console.log(data);
        data.forEach(item => {
            if (item.PJJGID === null) {
                evaluate(item);
            }
        });
    }

    // Function to navigate to the next page
    function goToNextPage() {
        let currentPageIndex = parseInt(GM_getValue('currentPageIndex', 0));
        let nextPageStart = currentPageIndex * 10;
        let recordsPerPage = 10;

        const url = 'https://ugsqs.whu.edu.cn/getStudentPjPf/59/2302000/SCHOOL_ADMIN';
        const data = {
            sEcho: 1,
            iColumns: 6,
            sColumns: '',
            iDisplayStart: nextPageStart,
            iDisplayLength: 10,
            mDataProp_0: 'KCMC',
            mDataProp_1: 'XM',
            mDataProp_2: 'TJSJ',
            mDataProp_3: 'YZ',
            mDataProp_4: 'PJJGID',
            mDataProp_5: '',
            iSortCol_0: 0,
            sSortDir_0: 'asc',
            iSortingCols: 1,
            bSortable_0: false,
            bSortable_1: false,
            bSortable_2: false,
            bSortable_3: false,
            bSortable_4: false,
            bSortable_5: false
        };

        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
                // Include additional headers if necessary
            },
            credentials: 'include' // This ensures cookies are included with the request
        })
            .then(response => response.json())
            .then(responseData => {
            console.log(responseData)
            processData(responseData);
            let totalRecords = responseData.iTotalDisplayRecords;
            hasMorePages = (currentPageIndex * recordsPerPage) < totalRecords;

            if (hasMorePages) {
                GM_setValue('currentPageIndex', currentPageIndex + 1);
            }
            mainEvaluationFunction();
        })
            .catch(error => console.error('Error fetching next page:', error));
    }



    // Main function to manage the evaluation process
    function mainEvaluationFunction() {
        if (hasMorePages) {
            goToNextPage();
        } else {
            console.log("All pages have been processed.");
            // Perform any final actions needed after processing all pages
        }
    }

    retrievePageValues()
    // List all cookies
    GM_cookie.list({}, function(cookies, error) {
        if (!error) {
            console.log('Cookies:', cookies);
        } else {
            console.error('Error listing cookies:', error);
        }
    });
    // Initialize or reset the current page index before starting the process
    GM_setValue('currentPageIndex', 0);
    // Create the start button
    var hasMorePages = true;
    const button = document.createElement('button');
    button.id = 'autoEvaluateButton';
    button.textContent = '执行评教';
    button.addEventListener('click', mainEvaluationFunction);
    document.body.appendChild(button);
})();
