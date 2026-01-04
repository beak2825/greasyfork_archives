// ==UserScript==
// @name         Copy uWorld or NBME Questions to ChatGPT for Step 1
// @namespace    http://tampermonkey.net/
// @version      2.2.0.0
// @description  Adds Copy Buttons to uWorld Questions and Explanations + a button to append a ChatGPT prompt.
// @author       PinballDestiny
// @match        *apps.uworld.com/*
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/469110/Copy%20uWorld%20or%20NBME%20Questions%20to%20ChatGPT%20for%20Step%201.user.js
// @updateURL https://update.greasyfork.org/scripts/469110/Copy%20uWorld%20or%20NBME%20Questions%20to%20ChatGPT%20for%20Step%201.meta.js
// ==/UserScript==

// Alt+a to copy all (quesation + explanation)
// Alt+c to copy explanation only
// alt+q to copy question only
// alt+g to copy all with ChatGPT prompt. 
// alt+e to update the chatGPT prompt.

// Alt+t to scroll to question top
// Alt+z to scroll to question bottom
// alt+d PageDown Smoothly
// alt+s PageUp Smoothly

// Alt+w to toggle labs
// Alt+m to switch timed ↔ untimed.


// Normalize Alt/Option key behavior across platforms
(function normalizeAltKey() {
    const originalAddEventListener = document.addEventListener;

    document.addEventListener = function (type, listener, options) {
        if (type === 'keydown') {
            const wrappedListener = function (e) {
                // If on Mac and Option or Command is pressed, simulate Alt
                if (navigator.platform.includes('Mac') && (e.metaKey || e.altKey)) {
                    e.altKey = true;
                }
                listener.call(this, e);
            };
            originalAddEventListener.call(this, type, wrappedListener, options);
        } else {
            originalAddEventListener.call(this, type, listener, options);
        }
    };
})();


const loadCSS = (href) => {
    let link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    document.head.appendChild(link);
};

loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons");
loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined");

// Helper function to create a floating copy button
function createButton(icon, bottom, clickHandler) {
    const button = document.createElement('button');
    button.classList.add('visibility');

    const cssText = "position: fixed; width: 24px; height: 24px; padding: 0; bottom: " + bottom + "; right: 16px; border: none; border-radius: 4px; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: background-color 0.3s, box-shadow 0.3s, opacity 0.3s; cursor: pointer; opacity: 1";
    button.style.cssText = cssText;

    button.innerHTML = icon;

    // Remove the background color and box-shadow styles
    button.style.backgroundColor = "transparent";
    button.style.boxShadow = "none";

    // Restyle the icon to remove the default grey color
    const iconSpans = button.getElementsByTagName("span");
    for (let i = 0; i < iconSpans.length; i++) {
        iconSpans[i].style.backgroundColor = "transparent";
        iconSpans[i].style.color = "#000"; // You can change the color to your preference
    }

    button.addEventListener('click', clickHandler);

    button.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
    });

    button.addEventListener('mouseleave', () => {
        button.style.opacity = '0.1';
    });

    // Fade the button after 2 seconds on page load
    setTimeout(() => {
        button.style.opacity = '0.05';
    }, 3500);

    return button;
}

// Helper function to show a toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;

    toast.style.cssText = `
        position: fixed;
        top: 33%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 16px 24px;
        background-color: #2ecc71;
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 1000);
    }, 3000);
}

// Helper function to bind a hotkey event
function bindHotkey(hotkey, clickHandler) {
    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === hotkey) {
            clickHandler();
        }
    });
}

// Helper function to add a styled tooltip
function addTooltip(element, tooltipText) {
    // Create tooltip div
    const tooltip = document.createElement('div');
    tooltip.innerText = tooltipText;

    // Style the tooltip div
    tooltip.style.cssText = "position: absolute; bottom: 50%; right: 100%; transform: translateX(-10px) translateY(50%); margin-right: 10px; background-color: #7A80A0; color: #F1F1F4; border-radius: 5px; padding: 5px; font-size: 12px; text-align: center; white-space: nowrap; visibility: hidden; opacity: 0; transition: opacity 0.3s";

    // Append the tooltip to the button
    element.appendChild(tooltip);

    // Show and hide tooltip on hover
    element.addEventListener('mouseenter', () => {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    });

    element.addEventListener('mouseleave', () => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    });
}

function getUserscriptManager() {
    try {
        return GM_info.scriptHandler;
    } catch (error) {
        return 'other';
    }
}

// Init/register menu
var menuIDs = [], state = { symbol: ['✔️', '❌'], word: ['ON', 'OFF'] } // initialize menu vars

// Retrieve the state of the checkboxes from GM storage
var includeAnswerWithQuestion = GM_getValue('includeAnswerWithQuestion', true);
var includeAnswerWithExplanation = GM_getValue('includeAnswerWithExplanation', true);

registerMenu() // create browser toolbar menu

function registerMenu() {
    menuIDs = [] // empty to store newly registered cmds for removal while preserving order

    // Add command for "Include answer with Question"
    var mnLabelQuestion = (includeAnswerWithQuestion ? state.symbol[0] : state.symbol[1]) + ' Include answer with Question';
    menuIDs.push(GM_registerMenuCommand(mnLabelQuestion, function() {
        includeAnswerWithQuestion = !includeAnswerWithQuestion; // toggle the state
        GM_setValue('includeAnswerWithQuestion', includeAnswerWithQuestion); // Save the state in GM storage
        for (var i = 0 ; i < menuIDs.length ; i++) GM_unregisterMenuCommand(menuIDs[i]); // remove all cmd's
        registerMenu(); // serve fresh one
    }));

    // Add command for "Include answer with Explanation"
    var mnLabelExplanation = (includeAnswerWithExplanation ? state.symbol[0] : state.symbol[1]) + ' Include answer with Explanation';
    menuIDs.push(GM_registerMenuCommand(mnLabelExplanation, function() {
        includeAnswerWithExplanation = !includeAnswerWithExplanation; // toggle the state
        GM_setValue('includeAnswerWithExplanation', includeAnswerWithExplanation); // Save the state in GM storage
        for (var i = 0 ; i < menuIDs.length ; i++) GM_unregisterMenuCommand(menuIDs[i]); // remove all cmd's
        registerMenu(); // serve fresh one
    }));
}

// CopyExplanationOnly Function
(function copyExplanationOnly() {
    'use strict';

    const button = createButton('<span class="material-icons-outlined">move_down</span>', '202px', () => {
        const explanationDiv = document.getElementById('explanation');
        let explanationText = explanationDiv.innerText;

        // Clean up the formatting
        explanationText = explanationText.replace(/([\s\S]*?\S\)?Subject).*$/s, '$1'); // Remove all text after the first occurrence of "Subject" in the explanation text
        explanationText = explanationText.replace(/^\s+/, ''); // Delete leading line breaks

        // Preserve the line breaks
        explanationText = explanationText.replace(/\n/g, '\r\n');

        // Declare answerToCopy
        let answerToCopy;

        // Get the answer and pre-pend it if includeAnswerWithExplanation option is checked.
        if (includeAnswerWithExplanation) {
            const questionInformationDiv = document.getElementById('questionInformation'); // Get the question and answer
            answerToCopy = questionInformationDiv.innerText;
            answerToCopy = answerToCopy.replace(/.*?(?=Correct answer)/s, ''); // Delete all text before "Correct Answer"
            answerToCopy = answerToCopy.replace(/Incorrect/g, ''); // Omit whether the question was answered correctly
            answerToCopy = answerToCopy.replace(/(Correct answer)\s*\n/g, '$1 '); // If omit answer option is not enabled, keep it
            answerToCopy = answerToCopy.replace(/(\n\s*\d{1,2}%[^]*?$)/, ''); // Find the percentage after the correct answer and delete the text after
            // Adjust line breaks in explanation text
            explanationText = explanationText.replace(/^Explanation(\n){3}/, 'EXPLANATION\r\n');

            // Append explanation text preserving line breaks
            explanationText += answerToCopy + "\n\n" + explanationText;
            explanationText = explanationText.replace(/.*?(?=Correct answer)/s, ''); // Delete all text before "Correct Answer"
        } else {
            answerToCopy = ''; // If omit answer option is not enabled, don't add anything
        }

        const textarea = document.createElement('textarea');
        textarea.value = explanationText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        showToast('Explanation copied successfully!');
    });

    addTooltip(button, "Copy Explanation, alt+c");

    document.body.appendChild(button);
    bindHotkey('c', () => button.click());
})();


// CopyQuestionOnly Function
(function copyQuestionOnly() {
    'use strict';

    const button = createButton('<span class="material-icons-outlined">move_up</span>', '254px', () => {
        const questionInformationDiv = document.getElementById('questionInformation');
        let textToCopy = questionInformationDiv.innerText;

        // Remove the text after the word "Explanation"
        const referencesIndex = textToCopy.indexOf('Explanation');
        if (referencesIndex !== -1) {
            textToCopy = textToCopy.substring(0, referencesIndex);
        }

        // Reformat Question Text
        textToCopy = textToCopy.replace(/([A-G]\.)\s+(\S.*)\s+(\(\d{1,2}%\))/g, '$1 $2 $3'); // Reformat Answer Choices to one line
        textToCopy = textToCopy.replace(/\s*\(\d{1,2}%\)\s*$/gm, ''); // Omit percentage correct
        textToCopy = textToCopy.replace(/Incorrect/g, ''); // Omit whether the question was answered correctly
        if (includeAnswerWithQuestion) {
            textToCopy = textToCopy.replace(/(Correct answer)\s*\n/g, '$1 '); // If omit answer option is not enabled, keep it
        } else {
            textToCopy = textToCopy.replace(/(Correct answer)[\s\S]*/g, ''); // If omit answer option is enabled, remove the answer
        }

        textToCopy = textToCopy.replace(/(\n\s*\d{1,2}%[^]*?$)/, ''); // Find the percentage after the correct answer and delete the text after



        // Preserve the line breaks
        textToCopy = textToCopy.replace(/\n/g, '\r\n');

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        showToast('Q copied successfully!');
    });

    addTooltip(button, "Copy Question, alt+q");

    document.body.appendChild(button);
    bindHotkey('q', () => button.click());
})();

// CopyAll Function
(function copyAll() {
    'use strict';

    const button = createButton('<span class="material-icons-outlined">copy_all</span>', '150px', () => {
        const questionInformationDiv = document.getElementById('questionInformation');
        let textToCopy = questionInformationDiv.innerText;



        // Remove the text after the word "References"
        const referencesIndex = textToCopy.indexOf('References');
        if (referencesIndex !== -1) {
            textToCopy = textToCopy.substring(0, referencesIndex);
        }

        // Store the explanation as a variable
        const explanationIndex = textToCopy.indexOf('Explanation');
        let explanationText = '';

        if (explanationIndex !== -1) {
            explanationText = textToCopy.substring(explanationIndex);
        }

        // Reformat Question Text
        textToCopy = textToCopy.replace(/([A-G]\.)\s+(\S.*)\s+(\(\d{1,2}%\))/g, '$1 $2 $3'); // Reformat Answer Choices to one line
        textToCopy = textToCopy.replace(/\s*\(\d{1,2}%\)\s*$/gm, ''); // Omit percentage correct
        textToCopy = textToCopy.replace(/Incorrect/g, ''); // Omit whether the question was answered correctly
        textToCopy = textToCopy.replace(/(Correct answer)\s*\n/g, '$1 '); // Cleanup the correct answer
        textToCopy = textToCopy.replace(/(\n\s*\d{1,2}%[^]*?$)/, ''); // Delete the junk after the correct answer

        // Preserve the line breaks
        textToCopy = textToCopy.replace(/\n/g, '\r\n');

        // Adjust line breaks in explanation text
        explanationText = explanationText.replace(/^Explanation(\n){3}/, 'EXPLANATION\r\n');

        // Append explanation text preserving line breaks
        textToCopy += "\n\n" + explanationText;

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        showToast('Question and Answer Copied to Clipboard!');
    });

    addTooltip(button, "Copy Question with Explanation, alt+a");

    document.body.appendChild(button);
    bindHotkey('a', () => button.click());
})();

// CopyForGPT Function
(function copyForGPT() {
    'use strict';

    // 🧠 Default prompt text (replace this placeholder with your full prompt content)
    let originalPrompt = `Respond to this prompt afresh, ignoring previous prompts and responses. Use the example provided between the "###" as a guide to format your response. Ensure the hierarchical outline has indents and line breaks and reduces the word count by about 75\% while omitting as few details as possible. Follow the example closely to explain how to understand the vignette given after this example to reach the correct answer. Be sure there are no repetitive parts of your answer, and if so, simply omit that repeated part of the response leaving that section brief. Follow the example closely to explain how to understand “Your Vignette” in the text after the "&&&" so a medical student can understand how to reach the correct answer. Do not include any instruction in parenthesis in your response.\n\nAlso, importantly, for section IV with the incorrect answers:\nFor each incorrect answer option, provide a detailed description of the classical presentation typically seen in medical vignettes. Focus solely on each item independently, mirroring the example provided, which illustrates how each item is classically described. Avoid using negation terms such as "not" and do not mention or hint at the correct answer in any part of your response.\n\n###\nOriginal Question: 'A 2-month-old boy is brought to the clinic for irritability, poor feeding, and frequent vomiting. Weight is at the 15th percentile, and head circumference is at the 96th percentile. Lung sounds are clear throughout, and heart auscultation reveals no murmurs. The abdomen is soft and nondistended. There is hepatosplenomegaly. Diffusely reduced muscle tone is present in all extremities. Funduscopy reveals white-yellow chorioretinal lesions in both eyes. MRI of the brain shows enlarged ventricles and scattered intracranial calcifications. Which of the following is the most likely cause of this patient's condition?\nA. Chromosomal abnormality\nB. Intrapartum infection\nC. In utero infection\nD. Postpartum infection\nE. Single gene defect'\n\nCorrect Answer: 'C. In utero infection'\n\nIdeal Response (text enclosed in parenthesis is instruction for you and should not be included in response):\n\nI. Restated Question (all named drugs and all key clues and all pulled quotes from the vignette should be included in the restated question, and the question should ask the same question that makes sense with the original answer choice, and the correct answer should follow immediately with the preceding letter omitted but use identical wording as original text otherwise):\nWhat is the underlying condition in a 2-month-old boy presenting with irritability, poor feeding, vomiting, hepatosplenomegaly, reduced muscle tone, white-yellow lesions in back of both eyes, enlarged ventricles, and  scattered dense, white spots on brain imaging? In utero infection (Intracranial calcifications and ventriculomegaly from chronic CNS inflammation and impaired CSF drainage; chorioretinal lesions from ocular inflammation and scarring; hepatosplenomegaly from systemic involvement. Suggests TORCH infection acquired in utero.)\n\nII. To reach answer, you must understand (give details of key concept in 40 words or less, avoid repetition from prior sections. Focus on explaining why the clues point to the answer, and why the answer is right here based on the underlying pathophysiology and physiology):\n• Recognize increased head circumference and enlarged ventricles indicate increased intracranial pressure.\n• Chorioretinal lesions, intracranial calcifications, and hepatosplenomegaly are signs of systemic infection.\n• The presentation in a 2-month-old suggests an in utero, rather than postpartum, infection.\n\nIII. Confirmational Finding (Pathognomic Finding or Information from question stem that points specifically to the correct answer choice): "enlarged ventricles and scattered intracranial calcifications"\n\nIV. Step-Wise Explanation (Provide a concise, numbered list elucidating the pathophysiological and physiological mechanisms linking clinical symptoms to their underlying conditions. Ensure each point is 7-20 words, with a total of 4-10 points, tailored to the complexity of the topic. Emphasize causal relationships, drawing on reputable sources and medical associations, without direct citations. Use medical terminology appropriately, focusing on pathophysiology and physiology. Specifically point to the question stem before the answer choices, again focusing on the why):\n1. Symptoms of irritability, poor feeding, and vomiting indicate a systemic or CNS disorder, likely from a congenital infection.\n2. A large head relative to low weight suggests fetal growth restriction due to an immune response redirecting resources, secondary to infection.\n3. Hepatosplenomegaly denotes systemic infection, indicative of immune system activation.\n4. Decreased muscle tone suggests CNS involvement, potentially from immune-related brain damage.\n5. White-yellow chorioretinal lesions, caused by inflammation in the choroid and retina, result in scarring, evident as spots during retinal examination.\n6. MRI shows ventriculomegaly and intracranial calcifications, the latter resulting from TORCH infections where immune inflammation leads to brain damage, cell death, and calcification, a healing response that also causes ventriculomegaly by obstructing CSF drainage.\n7. The combination of CNS, ocular, systemic symptoms (hepatosplenomegaly), and growth restriction indicates a TORCH infection, characterized by immune-mediated inflammation and tissue damage.\n\nV. Incorrect Answers:\n(INSTRUCTIONS: For each incorrect answer option, detail the classical presentation typically associated in medical vignettes for each item independent of the question. Importantly, do not relate the incorrect items back to the question and instead just focus on in each item independently and closely following the examples between the '^^^' below to describe each item in the context of classic board questions.)\n\n^^^\nV. Incorrect Answers Examples:\n• Endometriosis: Ectopic endometrial tissue growth in reproductive-aged individuals. Presents with cyclic pelvic pain, dysmenorrhea, infertility potential, and painful defecation during menstruation.\n• Labetalol: Nonselective β-blocker, α1-antagonist for hypertension, hypertensive emergencies, pheochromocytoma (preoperative), safe in pregnancy. Decreases heart rate and blood pressure, inducing less reflex tachycardia than other β blockers.\n• Fetal congenital malformation: Birth structural abnormalities like ventricular septal defect, spina bifida, cleft lip/palate, clubfoot, congenital diaphragmatic hernia, anencephaly. Associated with abnormal prenatal ultrasound, organ anomalies, genetic counseling, maternal age, environmental factors, genetic disorders, teratogen exposure.\n• Incorrect gestational age: Misestimated pregnancy duration from last menstrual period and ultrasound discrepancy. Affects delivery timing, fetal maturity, growth abnormality risk, prenatal screening accuracy, requires delivery date adjustment.\n• Trisomy 21: Down syndrome from extra 21st chromosome; linked to advanced maternal age, increased nuchal translucency, flattened nasal bridge, epicanthic folds, toe gap, iris white spots, low muscle tone, intellectual disability.\n^^^\n\n###\n\nAgain, remember that the incorrect answers in part V should only provide classic descriptions in a comma separated list of high yield information and not comment on why the answer is incorrect and if applicable the most common causes and top 3 primary indications. Omit parts of sentences that begin with "not..." or "but don't..." or "but doesn't...".\n&&&\n\n`;

    // 🧠 Active slot and prompt text from storage
    let activeSlot = GM_getValue('activePromptSlot', 'slot1');
    let gptPromptTemplate = GM_getValue(activeSlot, activeSlot === 'slot1' ? originalPrompt : '');

    const button = createButton('<img src="https://user-images.githubusercontent.com/57292172/223011977-371c1677-a8f3-4c06-87fb-b774243b0545.svg" width="24" height="24">', '306px', () => {
        const questionInformationDiv = document.getElementById('questionInformation');
        let textToCopy = questionInformationDiv.innerText;

        const explanationIndex = textToCopy.indexOf('Explanation');
        let explanationText = '';
        if (explanationIndex !== -1) {
            explanationText = textToCopy.substring(explanationIndex);
        }

        const preText = gptPromptTemplate.trimEnd() + '\n';


        // Clean up question text
        textToCopy = textToCopy.replace(/([A-G]\.)\s+(\S.*)\s+(\(\d{1,2}%\))/g, '$1 $2 $3');
        textToCopy = textToCopy.replace(/\s*\(\d{1,2}%\)\s*$/gm, '');
        textToCopy = textToCopy.replace(/Incorrect/g, '');
        textToCopy = textToCopy.replace(/(Correct answer)\s*\n/g, '$1 ');
        textToCopy = textToCopy.replace(/(\n\s*\d{1,2}%[^]*?$)/, '');

        const referencesIndex = textToCopy.indexOf('References');
        if (referencesIndex !== -1) {
            textToCopy = textToCopy.substring(0, referencesIndex);
        }

        explanationText = explanationText.replace(/(\n){4}/g, '\n\n');
        textToCopy = preText + textToCopy + "\n\n" + explanationText;
        textToCopy = textToCopy.replace(/\n/g, '\r\n');

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        showToast('GPT Prompt copied to clipboard! Press alt+e to edit and save your own prompt.');
    });

    addTooltip(button, "Copy question and explanation with perfect prompt to paste into ChatGPT, alt+g");
    document.body.appendChild(button);
    bindHotkey('g', () => button.click());

    // 🧰 Prompt Editor UI (Alt+e)
    function openPromptEditor() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            padding: 20px;
            width: 80%;
            max-width: 800px;
            font-family: Arial, sans-serif;
        `;

        const slotBar = document.createElement('div');
        slotBar.style.cssText = 'margin-bottom: 10px; text-align: center;';

        const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
        slots.forEach((slot, index) => {
            const btn = document.createElement('button');
            btn.innerText = `Slot ${index + 1}`;
            btn.style.cssText = `
                margin: 0 4px;
                padding: 6px 12px;
                font-weight: ${slot === activeSlot ? 'bold' : 'normal'};
                background-color: ${slot === activeSlot ? '#2ecc71' : '#f0f0f0'};
                color: ${slot === activeSlot ? 'white' : '#333'};
                border: none;
                border-radius: 6px;
                cursor: pointer;
            `;
            btn.onclick = () => {
                GM_setValue('activePromptSlot', slot);
                activeSlot = slot;
                const stored = GM_getValue(slot, slot === 'slot1' ? originalPrompt : '');
                textarea.value = stored;
                gptPromptTemplate = stored;
                GM_setValue(activeSlot, stored);
                openPromptEditor();  // reload modal for new slot
                document.body.removeChild(modal);
            };
            slotBar.appendChild(btn);
        });

        const textarea = document.createElement('textarea');
        textarea.value = gptPromptTemplate;
        textarea.style.cssText = `
            width: 100%;
            height: 300px;
            resize: vertical;
            font-size: 14px;
            font-family: monospace;
            padding: 12px;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
        `;
        textarea.addEventListener('input', () => {
            gptPromptTemplate = textarea.value;
            GM_setValue(activeSlot, gptPromptTemplate);
        });

        const buttonRow = document.createElement('div');
        buttonRow.style.textAlign = 'right';

        const resetBtn = document.createElement('button');
        resetBtn.innerText = 'Reset Slot 1 to Default';
        resetBtn.style.cssText = 'margin-right: 10px; padding: 6px 16px;';
        resetBtn.onclick = () => {
            if (activeSlot === 'slot1') {
                textarea.value = originalPrompt;
                gptPromptTemplate = originalPrompt;
                GM_setValue('slot1', originalPrompt);
            } else {
                showToast('Reset only applies to Slot 1.');
            }
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Close';
        closeBtn.style.cssText = 'padding: 6px 16px;';
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
        };

        buttonRow.appendChild(resetBtn);
        buttonRow.appendChild(closeBtn);

        modal.appendChild(slotBar);
        modal.appendChild(textarea);
        modal.appendChild(buttonRow);
        document.body.appendChild(modal);
    }

    // 🧷 Alt+e to open the editor
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.code === 'KeyE') {
            e.preventDefault();
            openPromptEditor();
        }
    });

})();



(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.code === 'KeyW') {
            e.preventDefault();

            // Try <i> element for Undock Lab Values
            const undockIcon = document.querySelector('i[title="Undock Lab Values"]');
            if (undockIcon) {
                undockIcon.click();
                return;
            }

            // Else try <a> element for Open Lab Values
            const openLabsLink = document.querySelector('a[aria-label="Open Lab Values"]');
            if (openLabsLink) {
                openLabsLink.click();
            }
        }
    });
})();


// Toggle Timed test with alt+w
(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.code === 'KeyM') {
            e.preventDefault();
            step1();
        }
    });

    function step1() {
        // Step 1: Click the "Edit Test Mode" icon.
        const editIcon = document.querySelector('i[title="Edit Test Mode"]');
        if (editIcon) {
            editIcon.click();
            setTimeout(step2, 500);
        }
    }

    function step2() {
        // Step 2: Toggle the "Timed" slide toggle regardless of on/off state.
        // Locate the mat-slide-toggle whose label includes "Timed".
        const toggles = document.querySelectorAll('mat-slide-toggle');
        let found = false;
        toggles.forEach(toggle => {
            if (toggle.textContent.includes("Timed")) {
                const thumb = toggle.querySelector('.mat-slide-toggle-thumb-container');
                if (thumb) {
                    thumb.click();
                    found = true;
                }
            }
        });
        if (!found) {
            console.log("Timed toggle not found");
        }
        setTimeout(step3, 500);
    }

    function step3() {
        // Step 3: Click the Confirm button.
        const confirmButton = document.querySelector('button[mat-flat-button].confirm-button.ml-2');
        if (confirmButton) {
            confirmButton.click();
        }
        setTimeout(step4, 500);
    }

    function step4() {
        // Step 4: Attempt to click the Submit button repeatedly every 500ms until it is available.
        attemptSubmit();
    }

    function attemptSubmit() {
        // Search for the Submit button within the dialog actions container.
        const dialogActions = document.querySelector('div[mat-dialog-actions], div.mat-dialog-actions');
        if (dialogActions) {
            const buttons = Array.from(dialogActions.getElementsByTagName('button'));
            const submitBtn = buttons.find(btn => btn.textContent.includes('Submit'));
            if (submitBtn) {
                submitBtn.click();
                return;
            }
        }
        setTimeout(attemptSubmit, 500);
    }
})();



// Scrolling
(function () {
    'use strict';

    // CDN links for GSAP 3 and ScrollToPlugin
    const GSAP_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/gsap.min.js';
    const SCROLLTO_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/ScrollToPlugin.min.js';

    // Dynamically load external scripts
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    // Ensure DOM readiness
    function waitForDOM(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Get the container you want to scroll.
    // Fallback to document.body if the targeted element is not found.
    function getScrollableContainer() {
        return document.querySelector('.common-content.any-dialog-docked') || document.body;
    }

    async function initGSAP() {
        try {
            await loadScript(GSAP_CDN);
            await loadScript(SCROLLTO_CDN);
        } catch (err) {
            console.error('Error loading GSAP libraries:', err);
            return;
        }

        if (window.gsap && window.ScrollToPlugin) {
            gsap.registerPlugin(ScrollToPlugin);
            // Optional configuration for autoKill
            ScrollToPlugin.config({ autoKill: true });
            console.log("✅ GSAP and ScrollToPlugin successfully registered.");
        } else {
            console.error("GSAP or ScrollToPlugin failed to load.");
        }
    }

    waitForDOM(async () => {
        await initGSAP();

        // Smooth scrolling utility functions
        function smoothScrollTo(y) {
            const container = getScrollableContainer();
            if (!container) return;
            gsap.to(container, {
                duration: 0.6,
                scrollTo: { y: y },
                ease: 'power4.out'
            });
        }

        function smoothScrollBy(offset) {
            const container = getScrollableContainer();
            if (!container) return;
            smoothScrollTo(container.scrollTop + offset);
        }

        // Attach keydown listener with capture phase for priority
        window.addEventListener('keydown', function (e) {
            // Log detected keys (for debugging)
            console.log('🔑 key event:', e.code, '| Alt:', e.altKey);

            // Ignore inputs to not interfere with typing
            const activeTag = (document.activeElement && document.activeElement.tagName) || '';
            if (activeTag.toLowerCase() === 'input' || activeTag.toLowerCase() === 'textarea') return;

            // Process only if Alt key is held
            if (!e.altKey) return;

            const container = getScrollableContainer();
            if (!container) return;

            switch (e.code) {
                case 'KeyT': // Alt+T: Scroll to top
                    e.preventDefault();
                    console.log('Scrolling to top');
                    smoothScrollTo(0);
                    break;
                case 'KeyZ': // Alt+Z: Scroll to bottom
                    e.preventDefault();
                    console.log('Scrolling to bottom');
                    smoothScrollTo(container.scrollHeight);
                    break;
                case 'KeyS': // Alt+J: Scroll up by 90% of container height
                    e.preventDefault();
                    console.log('Scrolling up');
                    smoothScrollBy(-container.clientHeight * 0.9);
                    break;
                case 'KeyD': // Alt+;: Scroll down by 90% of container height
                    e.preventDefault();
                    console.log('Scrolling down');
                    smoothScrollBy(container.clientHeight * 0.9);
                    break;
                default:
                    break;
            }
        }, true); // useCapture=true to increase listener priority
    });
})();