// ==UserScript==
// @name         Advanced OpenSearch Calculator Tool
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      Amazon
// @description  An advanced calculator tool that opens in a new window and loads JSON data
// @author       Abraham_Carrillo
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      instancestaticjson.s3.us-east-1.amazonaws.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/517022/Advanced%20OpenSearch%20Calculator%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/517022/Advanced%20OpenSearch%20Calculator%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let menuDiv = null;
    const Url = 'https://instancestaticjson.s3.us-east-1.amazonaws.com/instance_types_static.json';

    // Function to show the menu UI
    function showMenu() {
        if (!menuDiv) {
            menuDiv = document.createElement('div');
            menuDiv.style.position = 'fixed';
            menuDiv.style.top = '150px';
            menuDiv.style.right = '150px';
            menuDiv.style.backgroundColor = '#fff';
            menuDiv.style.padding = '10px';
            menuDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            menuDiv.innerHTML = `
                <h5>Advanced Calculator</h5>
                 <br>
                <button type="button" style="background: darkcyan;color:white;" btn-primary" id="calcNow">Search Operations  </button>
                <p>
                <button type="button" style="background:#eb7134;color:white;margin-top: 5%;" btn-primary">Storage requirements  </button>
                 <p>
                <button type="button" style="background: darkgreen;color:white;margin-top: 5%;" btn-primary">IOPS Calculator</button>
                <p>
                <button type="button" style="background: darkblue;color:white;margin-top: 5%;" btn-primary">Throughput Calculator</button>
            `;

            document.body.appendChild(menuDiv);
        }
        document.getElementById("calcNow").addEventListener("click", window.showCalculator);

        menuDiv.style.display = 'block';
    }

    // Function to hide the menu UI
    function hideMenu() {
        if (menuDiv) {
            menuDiv.style.display = 'none';
        }
    }


    // Function to get the HTML content for the calculator window
    function getCalculatorHTML() {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Advanced Calculator</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                select, input, button { margin: 10px 0; }
            </style>
        </head>
        <body>
            <h3>AWS OPERATIONS</h3>
            <b>Instance type:</b>
            <form id="myForm">
                <select id="selectInstance">
                    <option value="">Choose an instance</option>
                </select>
                <p>Total CPUs: <span id="selectedinstanceType"></span></p>
            </form>
            <b>Number of nodes:</b>
            <input type="number" id="num2" placeholder="NODES #">
            <br>
            <button onclick="calculate()">Calculate</button>
            <p id="result"></p>
            <p id="result2"></p>
            <p id="result3"></p>
            <p id="result4"></p>
            <p id="result5"></p>
            <p id="result6"></p>
            <p>
            <button onclick="hello(num2, cpuresponse, searchopsxmin, writeopsxmin)" type="button" style="background: black;color:white;display:none;" btn-primary" id="wordingb">Get wording</button>
            <script>
                let instanceData;
                let cpuresponse;
                var num2 = parseFloat(document.getElementById('num2').value);
                var searchops = ((cpuresponse * 3)/2)+1;
                var writeops = cpuresponse;
                var searchopsxsec = (num2 * searchops);
                var searchopsxmin = searchopsxsec*60;
                var writeopsxsec = num2 * writeops;
                var writeopsxmin = writeopsxsec*60;

                function populateInstanceTypes(data) {
                    instanceData = data;
                    const selectElement = document.getElementById('selectInstance');
                    for (const family of data.families) {
                        for (const type of family.types) {
                            const option = new Option(type.typeName, JSON.stringify(type));
                            selectElement.add(option);
                        }
                    }
                }

                document.getElementById('selectInstance').addEventListener('change', function(event) {
                    const selectedType = JSON.parse(this.value);
                    cpuresponse = selectedType.cpu.cores;
                    document.getElementById('selectedinstanceType').textContent = cpuresponse;
                });

                function calculate() {
                num2 = parseFloat(document.getElementById('num2').value);
                searchops = ((cpuresponse * 3)/2)+1;
                writeops = cpuresponse;
                searchopsxsec = (num2 * searchops);
                searchopsxmin = searchopsxsec*60;
                writeopsxsec = num2 * writeops;
                writeopsxmin = writeopsxsec*60;
                document.getElementById('result').textContent = 'Search Operations per node: ' + searchops;
                document.getElementById('result2').textContent = 'Write Operations per node: ' + writeops;
                document.getElementById('result3').textContent = 'Search Operations per second: ' + searchopsxsec;
                document.getElementById('result4').textContent = 'Search Operations per minute: ' + searchopsxmin;
                document.getElementById('result5').textContent = 'Write Operations per second: ' + writeopsxsec;
                document.getElementById('result6').textContent = 'Write Operations per minute: ' + writeopsxmin;

                getWording(cpuresponse, searchopsxmin);
                mybutton();
                }

                function hello(var1, var2, var3, var4){
                window.alert('Use the following formula to calculate maximum active threads for search requests:\\nint ((# of available_processors * 3) / 2) + 1\\n\\nUse the following formula to calculate maximum active threads for write requests:\\nint (# of available_processors)\\n\\nTherefore\\nFor an OpenSearch Service cluster with ' + var1 + ' nodes and ' + var2 +'vCPUs, you can then perform a maximum of ' + var3 + ' search operations x minute\\n\\nFor an OpenSearch Service cluster with ' + var1 + ' and ' + var2 + ' vCPUs, you can then perform a maximum of ' + var4 + ' write operations x minute:');
                }

                function getWording(var1, var2){
                console.log("For an OpenSearch Service cluster with " + var1 + " nodes, you can then perform a maximum of " + var2 + " search operations:");
                }

                function mybutton() {
                document.getElementById("wordingb").style.display = 'block';
                }


            </script>
        </body>
        </html>
        `;
    }


    // Function to show the calculator UI in a new window
    window.showCalculator = function () {
        const newWindow = window.open('', 'Advanced Calculator', 'width=400,height=600');
        newWindow.document.write(getCalculatorHTML());
        newWindow.document.close();

        // Load JSON data in the new window
        GM_xmlhttpRequest({
            method: "GET",
            url: Url,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    newWindow.populateInstanceTypes(data);
                } else {
                    console.error("Failed to load instance data");
                }
            },
            onerror: function(error) {
                console.error("Error loading instance data:", error);
            }
        });
    };

    // Define the keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === '8') {
            showMenu();
        } else if (event.ctrlKey && event.key === '9') {
            hideMenu();
        }
    });
})();
