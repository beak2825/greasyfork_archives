// ==UserScript==
// @name         IoTTalk Delete Device
// @namespace    Fractalism
// @version      1.1.2
// @description  Delete multiple devices in IoTTalk using regular expressions
// @author       Fractalism
// @match        http*://*.iottalk.tw/list_all
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404694/IoTTalk%20Delete%20Device.user.js
// @updateURL https://update.greasyfork.org/scripts/404694/IoTTalk%20Delete%20Device.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // make find-and-delete UI
    (function CreateUI() {
        var MainUI = document.createElement('div');
        document.body.appendChild(MainUI);

        MainUI.id = 'main-UI';
        MainUI.innerHTML = `
            <form action='javascript:void(0)'>
                <span>Find and delete</span><br>
                <input type='text' id='d_name-input'><br>
                <div id='search-div'>
                    <button id='search-btn'>Search</button>
                    <button id='hint-message' disabled><b>?</b></button>
                </div>
                <div id='delete-div' style='display:none'>
                    <button id='delete-btn'>Delete</button>
                    <button id='cancel-btn'>Cancel</button>
                </div>
                <div id='param-div'>
                    <label><input type='checkbox' id='case_sensitive'><small>Case-sensitive search</small></label><br>
                    <label><input type='checkbox' id='no_project' checked><small>Match unused devices only</small></label>
                </div>
            </form>
	`;

        MainUI.style.position = 'fixed';
        MainUI.style.top = '20px'; // pixels
        MainUI.style.right = '20px'; // pixels
        MainUI.style.backgroundColor = 'white';
        MainUI.style.border = '1px black solid';
        MainUI.style.padding = '5px 15px 5px 15px';
        MainUI.style.borderRadius = '10px';

        var d_name_Input = document.getElementById('d_name-input');
        d_name_Input.onkeydown = function () {
            if (!(event.which == 13 || event.keyCode == 13)) {
                switch_display(1);
            }
        }

        var SearchDiv = document.getElementById('search-div');
        SearchDiv.style.position = 'relative'; // to position HintButton correctly
        SearchDiv.style.width = d_name_Input.clientWidth;

        var DeleteDiv = document.getElementById('delete-div');
        DeleteDiv.style.position = 'relative';

        var ParamsDiv = document.getElementById('param-div');

        var SearchButton = document.getElementById('search-btn');
        SearchButton.onclick = function () {
            var params = {
                case_sensitive: document.getElementById('case_sensitive').checked,
                no_project: document.getElementById('no_project').checked,
            }
            find_devices(params);
            switch_display(2);
            d_name_Input.focus();
        };

        var DeleteButton = document.getElementById('delete-btn');
        DeleteButton.onclick = function () {
            var confirm = delete_devices();
            if (confirm) {
                switch_display(1);
            }
        };

        var CancelButton = document.getElementById('cancel-btn');
        CancelButton.onclick = function () {
            window.device_matches = [];
            switch_display(1);
        }

        var HintButton = document.getElementById('hint-message');
        HintButton.style.position = 'absolute';
        //HintButton.style.bottom = '10px';
        HintButton.style.right = '0px';
        HintButton.style.width = '1.5em';
        HintButton.style.height = '1.5em';
        HintButton.style.border = '1.5px black solid';
        HintButton.style.borderRadius = '50%';
        HintButton.style.color = 'black';
        HintButton.style.backgroundColor = 'white';
        HintButton.style.padding = '0px';
        HintButton.title = `Hint:\n> Type part of the d_name or use a regex, check the console for results.\n> Search empty string to get all devices on the server.\n> Right click on an <a> element in a match and select "Scroll into view" to see the device on the webpage.`;

        var my_style = document.createElement('style');
        my_style.innerHTML = `
		div#main-UI * {text-align: center; margin: 5px 0px 5px 0px;}
		div#main-UI * {font-family: Arial, Helvetica, sans-serif;}
        div#main-UI div {margin: 0px auto 0px auto; padding: 0px 0px 0px 0px;}
        div#main-UI input[type=checkbox] {margin: 5px 5px 5px 5px;}
        div#main-UI #param-div {text-align: left;}
	`; // apply to everything inside div

        document.head.appendChild(my_style);


        // switch to display certain buttons
        // mode: 1=search mode, 2=delete mode
        function switch_display(mode) {
            switch (mode) {
                case 1:
                    SearchDiv.style.display = 'block';
                    DeleteDiv.style.display = 'none';
                    ParamsDiv.style.display = 'block';
                    break;
                case 2:
                    SearchDiv.style.display = 'none';
                    DeleteDiv.style.display = 'block';
                    ParamsDiv.style.display = 'none';
                    break;
                default:
            }
        }
    })();



    // modify send_delete function for one-by-one deletions without refreshing page
    window.send_delete = send_delete_single;

    function send_delete_single(url) {
        $.ajax({
            url: url,
            type: 'DELETE',
            success: (result) => alert(`Device with MAC address ${url.substr(1)} deleted successfully.`),
            error: (jqXHR, textStatus, errorThrown) => alert(`Error deleting ${url.substr(1)}\ntextStatus: ${textStatus}\nerrorThrown: ${errorThrown}`)
        });
        event.preventDefault(); // don't scroll to top after deleting
    }

    // for batch deletions (send output to console instead)
    function send_delete_batch(url) {
        $.ajax({
            url: url,
            type: 'DELETE',
            success: (result) => console.log(`Device with MAC address ${url.substr(1)} deleted successfully.`),
            error: (jqXHR, textStatus, errorThrown) => console.log(`Error deleting ${url.substr(1)}\ntextStatus: ${textStatus}\nerrorThrown: ${errorThrown}`)
        });
        event.preventDefault();
    }



    // find devices with d_name matching input regex
    function find_devices(params) {
        console.clear();
        var d_name = document.getElementById('d_name-input').value;
        console.log('Search d_name: ' + d_name);
        var index, node, matches = [],
            skipped = [];
        for ([index, node] of window.relevantNodes.entries()) {
            if (node.nodeType == node.TEXT_NODE && node.nodeValue.search(RegExp(`d_name: .*${d_name}`, params.case_sensitive ? '' : 'i')) != -1) {
                if (params.no_project && node.nodeValue.trim().search(/project:$/) != -1 && (node.nextSibling.getAttribute('onclick') && node.nextSibling.getAttribute('onclick').indexOf('open_project(') != -1)) {
                    skipped.push([node, window.relevantNodes[index - 1]]);
                } else {
                    matches.push([node, window.relevantNodes[index - 1]]); // text node and link to delete device
                }
            }
        }
        console.log(`Found ${matches.length+skipped.length} devices (${matches.length} matched, ${skipped.length} skipped)`);
        console.groupCollapsed(`Matched devices (${matches.length})`);
        for (let i = 0; i < matches.length; ++i) {
            let d_name, dm_name;
            let lines = matches[i][0].nodeValue.split('\n');
            for (let line of lines) {
                if (line.search('d_name:') != -1) d_name = line.trim();
                if (line.search('dm_name:') != -1) dm_name = line.trim();
            }
            console.log(`Match ${i+1}:\n   ${d_name}\n   ${dm_name}\n`, matches[i][1]);
        };
        console.groupEnd();
        console.groupCollapsed(`Skipped devices (${skipped.length})`);
        for (let i = 0; i < skipped.length; ++i) {
            let d_name, dm_name;
            let lines = skipped[i][0].nodeValue.split('\n');
            for (let line of lines) {
                if (line.search('d_name:') != -1) d_name = line.trim();
                if (line.search('dm_name:') != -1) dm_name = line.trim();
            }
            console.log(`Skip ${i+1}:\n   ${d_name}\n   ${dm_name}\n`, skipped[i][1]);
        }
        console.groupEnd();
        window.device_matches = matches;
    }

    function delete_devices() {
        var matches = window.device_matches;
        if (!confirm(`Delete all ${matches.length} matched devices?`)) return false;
        window.send_delete = send_delete_batch;
        var index, match;
        for ([index, match] of matches.entries()) {
            console.log(`Deleting match ${index+1}`);
            match[1].onclick();
        }
        window.send_delete = send_delete_single;
        return true;
    }

    // get all relevant nodes only once at start
    (function collect_nodes() {
        var relevantNodes = [];
        var walker = document.createTreeWalker(document.body.firstElementChild, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, function my_filter(node) {
            if (node.nodeType == node.TEXT_NODE && node.nodeValue.indexOf('d_name:') != -1 || node.nodeType == node.ELEMENT_NODE && node.nodeName == "A" && node.innerText == "Delete") {
                return NodeFilter.FILTER_ACCEPT;
            } else {
                return NodeFilter.FILTER_SKIP;
            }
        });
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeName == "HR") break; // scan device part, skip DF-module part
            relevantNodes.push(node);
        }
        window.relevantNodes = relevantNodes;
    })();
})();
