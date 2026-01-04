// ==UserScript==
// @name               Make New PDF417 Barcode
// @namespace    http://tampermonkey.net/
// @version           1.3
// @description    PDF417 Data Collection Form
// @license            MIT
// @match             *://*/*
// @author            SijosxStudio
// @url                   https://greasyfork.org/en/users/1375139-sijosxstudio
// @grant              none

// @downloadURL https://update.greasyfork.org/scripts/515447/Make%20New%20PDF417%20Barcode.user.js
// @updateURL https://update.greasyfork.org/scripts/515447/Make%20New%20PDF417%20Barcode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the form HTML
    const formHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF417 Data Collection</title>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            form {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            label {
                display: block;
                margin-bottom: 10px;
            }
            input[type="text"] {
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            button {
                padding: 10px 15px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #218838;
            }
        </style>
    </head>
    <body>

    <h1>PDF417 Data Entry</h1>
    <form id="pdf417Form">
        <label for="dlNumber">Enter DL#: (DAQ)</label>
        <input type="text" id="dlNumber" required>

        <label for="familyName">Enter Family Name (DCS):</label>
        <input type="text" id="familyName" required>

        <label for="familyNameTruncation">Enter Family Name Truncation (DDE):</label>
        <input type="text" id="familyNameTruncation" required>

        <label for="firstNames">Enter First Names (DAC):</label>
        <input type="text" id="firstNames" required>

        <label for="firstNamesTruncation">Enter First Names Truncation (DDF):</label>
        <input type="text" id="firstNamesTruncation" required>

        <label for="middleNames">Enter Middle Names (DAD):</label>
        <input type="text" id="middleNames">

        <label for="middleNamesTruncation">Enter Middle Names Truncation (DDG):</label>
        <input type="text" id="middleNamesTruncation">

        <label for="classCode">Enter Virginia Specific Class (DCA):</label>
        <input type="text" id="classCode">

        <label for="restrictions">Enter Virginia Specific Restrictions (DCB):</label>
        <input type="text" id="restrictions">

        <label for="endorsements">Enter Virginia Specific Endorsements (DCD):</label>
        <input type="text" id="endorsements">

        <label for="issueDate">Enter Issue Date (DBD):</label>
        <input type="text" id="issueDate" required>

        <label for="dateOfBirth">Enter Date of Birth (DBB):</label>
        <input type="text" id="dateOfBirth" required>

        <label for="expirationDate">Enter Expiration Date (DBA):</label>
        <input type="text" id="expirationDate" required>

        <label for="sex">Enter Sex (DBC):</label>
        <input type="text" id="sex" required>

        <label for="height">Enter Height (DAU):</label>
        <input type="text" id="height" required>

        <label for="eyes">Enter Eyes (DAY):</label>
        <input type="text" id="eyes">

        <label for="address">Enter Address (DAG):</label>
        <input type="text" id="address">

        <label for="city">Enter City (DAI):</label>
        <input type="text" id="city">

        <label for="state">Enter State (DAJ):</label>
        <input type="text" id="state">

        <label for="zip">Enter Zip Code (DAK):</label>
        <input type="text" id="zip">

        <label for="documentDiscriminator">Enter Document Discriminator (DCF):</label>
        <input type="text" id="documentDiscriminator">

        <label for="country">Enter Country/Territory of Issuance (DCG):</label>
        <input type="text" id="country">

        <label for="suffix">Enter Suffix (Optional, DCU):</label>
        <input type="text" id="suffix">

        <label for="inventoryControlNumber">Enter Inventory Control Number (Optional, DCK):</label>
        <input type="text" id="inventoryControlNumber">

        <label for="complianceType">Enter Compliance Type (Optional, DDA):</label>
        <input type="text" id="complianceType">

        <label for="cardRevisionDate">Enter Card Revision Date (Optional, DDB):</label>
        <input type="text" id="cardRevisionDate">

        <label for="hazMatEndorsementExpiry">Enter HazMat Endorsement Expiry Date (Optional, DDC):</label>
        <input type="text" id="hazMatEndorsementExpiry">

        <label for="limitedDurationDocumentIndicator">Enter Limited Duration Document Indicator (Optional, DDD):</label>
        <input type="text" id="limitedDurationDocumentIndicator">

        <label for="courtRestrictionCodes">Enter Court Restriction Code(s) (Optional, ZVA):</label>
        <input type="text" id="courtRestrictionCodes">

        <button type="submit">Generate PDF417 Data</button>
    </form>

    <pre id="output"></pre>

    <script>
        document.getElementById('pdf417Form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            // Collect data from form fields
            const data = [];
            data.push(\`@LFRSCR\`); // Compliance indicator
            data.push(\`ANSI 636000100002\`); // File type, IIN, etc.
            
            // Required fields
            data.push(\`DAQ\${document.getElementById('dlNumber').value}\`);
            data.push(\`DCS\${document.getElementById('familyName').value}\`);
            data.push(\`DDE\${document.getElementById('familyNameTruncation').value}\`);
            data.push(\`DAC\${document.getElementById('firstNames').value}\`);
            data.push(\`DDF\${document.getElementById('firstNamesTruncation').value}\`);
            data.push(\`DBD\${document.getElementById('issueDate').value}\`);
            data.push(\`DBB\${document.getElementById('dateOfBirth').value}\`);
            data.push(\`DBA\${document.getElementById('expirationDate').value}\`);
            data.push(\`DBC\${document.getElementById('sex').value}\`);
            data.push(\`DAU\${document.getElementById('height').value}\`);

            // Optional fields
            const optionalFields = ['middleNames', 'middleNamesTruncation', 'classCode', 'restrictions', 'endorsements', 'eyes', 'address', 'city', 'state', 'zip', 'documentDiscriminator', 'country', 'suffix', 'inventoryControlNumber', 'complianceType', 'cardRevisionDate', 'hazMatEndorsementExpiry', 'limitedDurationDocumentIndicator', 'courtRestrictionCodes'];
            optionalFields.forEach(field => {
                const element = document.getElementById(field);
                if (element && element.value) {
                    data.push(\`\${element.id.toUpperCase().substring(0, 3)}\${element.value}\`);
                }
            });

            // Display the output data
            document.getElementById('output').textContent = data.join("\\n");
        });
    </script>
    </body>
    </html>`;

    // Inject the form HTML into the page
    document.body.innerHTML = formHTML;
})();