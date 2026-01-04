// ==UserScript==
// @name         MC To-do list
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Makes a pop-up to-do list on MC
// @author       keumanzo
// @match        https://moderation-central.prime-video.amazon.dev/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      Amazon Internal Use Only
// @downloadURL https://update.greasyfork.org/scripts/535163/MC%20To-do%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/535163/MC%20To-do%20list.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.id = 'checklistContainer';
    checkboxContainer.innerHTML = `
        <div id="fullChecklist" style="
            position: fixed;
            right: 20px;
            bottom: 80px;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
            max-width: 500px;
            max-height: 60vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h2 style="margin: 0;"> ✅ General Steps</h2>
                <button id="minimizeBtn" style="
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                ">−</button>
            </div>
            <div id="checklistContent" style="
                display: flex;
                flex-direction: column;
                gap: 12px;
                font-family: Arial, sans-serif;
            ">
                <!-- Checklist content will be inserted here -->
            </div>
        </div>
        <div id="minimizedChecklist" style="
            display: none;
            position: fixed;
            right: 295px;
            bottom: 18px;
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
            cursor: pointer;
        ">
            <span> ✅ General Steps</span>
            <button id="maximizeBtn" style="
                background: none;
                border: none;
                font-size: 20px;
                margin-left: 10px;
                cursor: pointer;
            ">+</button>
        </div>
    `;

    // Add the container to the page
    document.body.appendChild(checkboxContainer);

    // Add checklist content
    const checklistContent = document.getElementById('checklistContent');
    checklistContent.innerHTML = `
        <div>
            <h3 style="margin: 0 0 10px 0;">1. Initial Setup</h3>
            <div style="margin-left: 20px;">
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb1_1">
                    <label for="cb1_1">Fill Quip BR Moderation Central Title Tracker 2.0</label>
                </div>
                <div>
                    <input type="checkbox" id="cb1_2">
                    <label for="cb1_2">Click on Captions Summary to see detailed information of the Title on EDP</label>
                </div>
            </div>
        </div>

        <div>
            <h3 style="margin: 10px 0 10px 0;">2. Research the Title</h3>
            <div style="margin-left: 20px;">
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb2_1">
                    <label for="cb2_1">Research title on Brazil's Official Website using different/alternative names</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb2_2">
                    <label for="cb2_2">Break down the title by keywords if needed</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb2_3">
                    <label for="cb2_3">Search in English, Portuguese, Spanish (and original language if different)</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb2_4">
                    <label for="cb2_4">If title name and website title don't match, Google both</label>
                </div>
                <div>
                    <input type="checkbox" id="cb2_5">
                    <label for="cb2_5">Choose the latest DOU</label>
                </div>
            </div>
        </div>

        <div>
            <h3 style="margin: 10px 0 10px 0;">3. Validate Title Information</h3>
            <div style="margin-left: 20px;">
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb3_1">
                    <label for="cb3_1">Confirm the following match EDP: (Publication Date, Director, Cast, Production Year)</label>
                </div>
                <div>
                    <input type="checkbox" id="cb3_2">
                    <label for="cb3_2">Search IMDb ID (if available) for additional verification</label>
                </div>
            </div>
        </div>

        <div>
            <h3 style="margin: 10px 0 10px 0;">4. If Information Matches</h3>
            <div style="margin-left: 20px;">
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb4_1">
                    <label for="cb4_1">Fill out the Quip sheet</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb4_2">
                    <label for="cb4_2">Take screenshots from the Official Website (OW)</label>
                </div>
                <div>
                    <input type="checkbox" id="cb4_3">
                    <label for="cb4_3">Document Content Descriptors (CDs)</label>
                </div>
            </div>
        </div>

        <div>
            <h3 style="margin: 10px 0 10px 0;">5. Manual Review in MC</h3>
            <div style="margin-left: 20px;">
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb5_1">
                    <label for="cb5_1">Switch to Manual Review</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb5_2">
                    <label for="cb5_2">Fill page with CDs and correct Rating Value</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb5_3">
                    <label for="cb5_3">Click Summarize</label>
                </div>
                <div style="margin-bottom: 3px;">
                    <input type="checkbox" id="cb5_4">
                    <label for="cb5_4">Change Agency to DJCTQ</label>
                </div>
                <div>
                    <input type="checkbox" id="cb5_5">
                    <label for="cb5_5">Double-check all information</label>
                </div>
            </div>
        </div>
    `;

    // Create special scenarios container
    const specialContainer = document.createElement('div');
    specialContainer.id = 'specialContainer';
    specialContainer.innerHTML = `
        <div id="fullSpecial" style="
            position: fixed;
            right: 540px;
            bottom: 80px;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h2 style="margin: 0;">🚨 Special Scenarios</h2>
                <button id="minimizeSpecialBtn" style="
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                ">−</button>
            </div>
            <div id="specialContent" style="
                display: flex;
                flex-direction: column;
                gap: 15px;
                font-family: Arial, sans-serif;
            ">
                <div>
                    <h3 style="margin: 10px 0 10px 0;">Fully Automated Titles</h3>
                    <div style="margin-left: 20px;">
                        <div style="margin-bottom: 10px;">
                            <input type="checkbox" id="auto1">
                            <label for="auto1">Is it Fully Automated? (Yes/No)</label>
                        </div>
                        <div style="margin-left: 20px;">
                            <div style="margin-bottom: 5px;">
                                     <input type="checkbox" id="auto2">
                                <label for="auto2">If Yes: Check if the title is in BOW</label>
                                <div style="margin-left: 20px; margin-top: 5px;">
                                    <input type="checkbox" id="auto3">
                                    <label for="auto3">If in BOW: Switch to Manual View, select correct Rating and CDs</label>
                                </div>
                                <div style="margin-top: 5px;">
                                    <input type="checkbox" id="auto4">
                                    <label for="auto4">Double-check information and confirm switch to DJCTQ</label>
                                </div>
                                <div style="margin-top: 5px;">
                                    <input type="checkbox" id="auto5">
                                    <label for="auto5">If not in BOW: Submit as "All Ages (AL)"</label>
                                </div>
                                <div style="margin-top: 5px;">
                                    <input type="checkbox" id="auto6">
                                    <label for="auto6">If the title don't have captions, see the entire title in MC and put the appropriates CDS</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style="margin: 10px 0 10px 0;">Sports Content</h3>
                    <div style="margin-left: 20px;">
                        <div style="margin-bottom: 10px;">
                            <input type="checkbox" id="sports1">
                            <label for="sports1">Is it Sports Content? (Yes/No)</label>
                        </div>
                        <div style="margin-left: 20px;">
                            <div style="margin-bottom: 5px;">
                                <label>If Yes:</label>
                            </div>
                            <div style="margin-left: 20px;">
                                <input type="checkbox" id="sports2">
                                <label for="sports2">Check if title is in BOW</label>
                                <div style="margin-left: 20px; margin-top: 5px;">
                                    <input type="checkbox" id="sports3">
                                    <label for="sports3">If in BOW: Manual View → Select Rating and CDs</label>
                                </div>
                                <div style="margin-left: 20px; margin-top: 5px;">
                                    <input type="checkbox" id="sports4">
                                    <label for="sports4">If not in BOW: Switch to Manual Review → Summarize → DJCTQ: EMPTY → Submit</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="minimizedSpecial" style="
            display: none;
            position: fixed;
            right: 477px;
            bottom: 18px;
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
            cursor: pointer;
        ">
            <span>🚨 Special Scenarios</span>
            <button id="maximizeSpecialBtn" style="
                background: none;
                border: none;
                font-size: 20px;
                margin-left: 10px;
                cursor: pointer;
            ">+</button>
        </div>
    `;

    // Add the container to the page
    document.body.appendChild(specialContainer);

        // Create Supra Mode Review container
    const supraContainer = document.createElement('div');
    supraContainer.id = 'supraContainer';
    supraContainer.innerHTML = `
        <div id="fullSupra" style="
            position: fixed;
            right: 1060px;
            bottom: 80px;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h2 style="margin: 0;">🔎 Supra Mode Review</h2>
                <button id="minimizeSupraBtn" style="
                    background: none;
                    border: none;
                    font-size: 16px;
                    cursor: pointer;
                ">−</button>
            </div>
            <div id="supraContent" style="
                display: flex;
                flex-direction: column;
                gap: 12px;
                font-family: Arial, sans-serif;
            ">
                <div style="margin-left: 20px;">
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra1">
                        <label for="supra1">Check if Audio and Captions are available in English</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra2">
                        <label for="supra2">Add notes accordingly</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra3">
                        <label for="supra3">Review Language Predictions</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra4">
                        <label for="supra4">Assign rating and CDs following SOP</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra5">
                        <label for="supra5">Analyze if language should be mitigated or aggravated</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra6">
                        <label for="supra6">If no predictions, review title manually in X1</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra7">
                        <label for="supra7">Pay attention to details and scenes</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra8">
                        <label for="supra8">Check for Mitigating/Aggravating Factors</label>
                    </div>
                    <div style="margin-bottom: 5px;">
                        <input type="checkbox" id="supra9">
                        <label for="supra9">Double-check scenes if necessary</label>
                    </div>
                    <div>
                        <input type="checkbox" id="supra10">
                        <label for="supra10">Calibrate if there are any doubts</label>
                    </div>
                </div>
            </div>
        </div>
        <div id="minimizedSupra" style="
            display: none;
            position: fixed;
            right: 683px;
            bottom: 18px;
            background-color: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
            cursor: pointer;
        ">
            <span>🔎 Supra Mode Review</span>
            <button id="maximizeSupraBtn" style="
                background: none;
                border: none;
                font-size: 20px;
                margin-left: 10px;
                cursor: pointer;
            ">+</button>
        </div>
    `;

    // Add containers to the page
document.body.appendChild(supraContainer);

   // Minimize/Maximize functionality
    const fullChecklist = document.getElementById('fullChecklist');
    const minimizedChecklist = document.getElementById('minimizedChecklist');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const maximizeBtn = document.getElementById('maximizeBtn');

    // Set initial states
    fullChecklist.style.display = 'none';
    minimizedChecklist.style.display = 'block';

    minimizeBtn.addEventListener('click', function() {
        fullChecklist.style.display = 'none';
        minimizedChecklist.style.display = 'block';
    });

    minimizedChecklist.addEventListener('click', function(e) {
        if (e.target !== maximizeBtn) {
            fullChecklist.style.display = 'block';
            minimizedChecklist.style.display = 'none';
        }
    });

    const fullSpecial = document.getElementById('fullSpecial');
    const minimizedSpecial = document.getElementById('minimizedSpecial');
    const minimizeSpecialBtn = document.getElementById('minimizeSpecialBtn');
    const maximizeSpecialBtn = document.getElementById('maximizeSpecialBtn');

    // Set initial states
    fullSpecial.style.display = 'none';
    minimizedSpecial.style.display = 'block';

    minimizeSpecialBtn.addEventListener('click', function() {
        fullSpecial.style.display = 'none';
        minimizedSpecial.style.display = 'block';
    });

    minimizedSpecial.addEventListener('click', function(e) {
        if (e.target !== maximizeSpecialBtn) {
            fullSpecial.style.display = 'block';
            minimizedSpecial.style.display = 'none';
        }
    });

    const fullSupra = document.getElementById('fullSupra');
    const minimizedSupra = document.getElementById('minimizedSupra');
    const minimizeSupraBtn = document.getElementById('minimizeSupraBtn');
    const maximizeSupraBtn = document.getElementById('maximizeSupraBtn');

    // Set initial states
    fullSupra.style.display = 'none';
    minimizedSupra.style.display = 'block';

    minimizeSupraBtn.addEventListener('click', function() {
        fullSupra.style.display = 'none';
        minimizedSupra.style.display = 'block';
    });

    minimizedSupra.addEventListener('click', function(e) {
        if (e.target !== maximizeSupraBtn) {
            fullSupra.style.display = 'block';
            minimizedSupra.style.display = 'none';
        }
    });
});