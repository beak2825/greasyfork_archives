// ==UserScript==
// @name         Copy Amboss Questions to ChatGPT for Step 1
// @namespace    http://tampermonkey.net/
// @version      1.0.1.4
// @description  Add copy buttons to amboss.com to copy to ChatGPT
// @author       PinballDestiny
// @match        https://*.amboss.com/*
// @grant        none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/469114/Copy%20Amboss%20Questions%20to%20ChatGPT%20for%20Step%201.user.js
// @updateURL https://update.greasyfork.org/scripts/469114/Copy%20Amboss%20Questions%20to%20ChatGPT%20for%20Step%201.meta.js
// ==/UserScript==

const loadCSS = (href) => {
    let link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    document.head.appendChild(link);
};

loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons");
loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined");
loadCSS("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");




(function () {
    "use strict";


    // Common helper functions
    const utils = {
        createStyle: function (cssText) {
            const styleElement = document.createElement("style");
            styleElement.type = "text/css";
            styleElement.appendChild(document.createTextNode(cssText.replace(/\n/g, "")));
            return styleElement;
        },
    };

    const tooltipStyle = utils.createStyle(`
        .fixed-tooltip { position: absolute; bottom: 20px; right: calc(100% + 2em); transform: translateX(-100%); background: #333; color: #fff; padding: 5px 10px; border-radius: 4px; opacity: 0; transition: opacity 0.3s; pointer-events: none; font-family: 'Open Sans', sans-serif; z-index: 9999; }
        .fixed-tooltip.visible {opacity: 0;}
        #explanationTooltipClass {margin-left:-20px!important;}
        #tooltipAltC { margin-left:-25px!important; top: 0px!important; z-index: 9999 !important; opacity: 0 !important; background-color: #2A2B32 !important; pointer-events: auto !important; position: relative; }
        #tooltipAltC::before, #tooltipAltC::after { z-index: 9998 !important; opacity: 0 !important; }
        #tooltipAltC * { opacity: 0 !important; }
#tooltipAltG {
    margin-left: 0px!important; /* Remove any unnecessary margin */
    top: 50%; /* Vertically center the tooltip relative to the button */
    left: calc(200% + 150px)!important; /* Position the tooltip directly to the right of the button */
    transform: translateY(-50%); /* Vertically center the tooltip */
    z-index: 9999 !important;
    opacity: 0 !important;
    background-color: #2A2B32 !important;
    pointer-events: auto !important;
    position: absolute; /* Position relative to the button */
    white-space: nowrap; /* Prevent line breaks in the tooltip */
}
#tooltipAltG::before, #tooltipAltG::after {
    z-index: 9998 !important;
    opacity: 0 !important;
}
#tooltipAltG * {
    opacity: 0 !important;
}
        `);
    document.head.appendChild(tooltipStyle);

    function addTooltip(button, tooltipText, left, top, id) {
        const tooltip = document.createElement("div");
        tooltip.innerText = tooltipText;
        tooltip.id = id;
        tooltip.style.cssText = "all: unset; position: absolute; top: " + top + "; left: " + left + "px; transform: translateX(-100%) translateY(-5px); background-color: #2A2B32; color: #ECECF1; border-radius: 5px; padding: 5px; font-size: 12px; text-align: center; white-space: nowrap; visibility: hidden; opacity: 0; transition: opacity 0.3s; font-family: 'Open Sans', sans-serif; z-index: 9999;";
        button.appendChild(tooltip);

        button.addEventListener("mouseenter", () => {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "0";
        });
        button.addEventListener("mouseleave", () => {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
        });
    }



    const removeToolTips = (element) => {
        let tooltips = element.querySelectorAll("div");
        tooltips.forEach((tooltip) => tooltip.remove());
    };

    const getPlainText = (element, removeLinks = false) => {
        let clone = element.cloneNode(true);
        let anchors = clone.querySelectorAll("a");
        anchors.forEach((a) => {
            const textNode = document.createTextNode(a.textContent);
            a.parentNode.replaceChild(textNode, a);
        });
        if (removeLinks) {
            let styles = clone.querySelectorAll("style");
            styles.forEach((style) => style.remove());
        }
        removeToolTips(clone);
        return clone.innerText;
    };

    const isVisible = (element) => {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };

    const showNotification = (message) => {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.style.cssText = `
        position: fixed;
        bottom: 10vh;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1em;
        border-radius: 8px;
        font-size: 11px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s, bottom 0.3s;
    `;
        document.body.appendChild(notification);
        setTimeout(() => (notification.style.opacity = '1'), 100);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    };

    // Function for Script 1
    const addButtonToElements = () => {
        const elements = document.querySelectorAll('[class^="explanationContent--"]');

        elements.forEach((element) => {
            if (!element.querySelector(".copy-button")) {
                const button = document.createElement("div");
                button.style.cssText =
                    "width: 100%; text-align: right; height: 32px; margin-left: 0px; margin-top: 8px; border-radius: 50%; display: block; opacity: 1; transition: opacity 0.3s; font-size: 16px; cursor: pointer;";
                button.innerHTML = "copy_all";
                button.className = "material-icons-outlined copy-button";

                button.addEventListener("click", async () => {
                    try {
                        await navigator.clipboard.writeText(
                            getPlainText(element, false, true).replace(/\s*copy_all\s*/g, "")
                        );
                        showNotification("Explanation copied!");
                    } catch (err) {
                        console.error("Failed to copy text: ", err);
                    }
                });

                element.appendChild(button);
                addTooltip(button, "Copy this item's explanation.", null, null, "explanationTooltipClass");
            }
        });
    };

    // Functions for Script 2
    // Functions for Script 2
    const extractContent = () => {
        // Select elements with class containing questionContent, answerContent, and explanationContent
        const questionContent = document.querySelector('[class*="questionContent"]');
        const answerContents = document.querySelectorAll('[class*="answerContent"]');
        const explanationContents = document.querySelectorAll('[class*="explanationContent"]');

        let combinedText = "";

        // Add question content
        if (questionContent) {
            combinedText += getPlainText(questionContent, true, true).trim() + "\n\n";
        }

        // Add answer content
        answerContents.forEach((answerContent) => {
            let answerContentText = getPlainText(answerContent, true, true).trim();
            if (answerContentText) {
                combinedText += answerContentText + "\n\n";
            }
        });

        // Add explanation content
        explanationContents.forEach((explanationContent) => {
            if (isVisible(explanationContent)) {
                combinedText += getPlainText(explanationContent, true, true).replace(/\s*copy_all\s*/g, "").trim() + "\n\n";
            }
        });

        combinedText = combinedText.replace(/\n{3,}/g, "\n\n");

        return combinedText.trim(); // Trim any trailing newlines
    };






    const addButton = () => {
        const questionContent = document.querySelector('[class^="questionContent--"]');

        if (questionContent && !questionContent.querySelector(".copy-button")) {
            const button = document.createElement("div");
            button.style.cssText =
                "width: 16px; height: 16px; border-radius: 50%; background-color: rgba(0, 0, 0, 0); position: absolute; bottom: 0; right: 0; cursor: pointer;";
            button.classList.add("copy-button");

            button.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(
                        extractContent().replace(/\s*copy_all\s*/g, "")
                    );
                    showNotification("Single Explanation copied!");
                } catch (err) {
                    console.error("Failed to copy text: ", err);
                }
            });

            questionContent.style.position = "relative";
            questionContent.appendChild(button);
            addTooltip(button, "Copy Explanation");
        }
    };

    // Keyboard event for Alt + C
    document.addEventListener("keydown", async function (event) {
        if (event.altKey && event.key === "c") {
            try {
                await navigator.clipboard.writeText(
                    extractContent().replace(/\s*copy_all\s*/g, "")
                );
                showNotification("Question + Expanded Explanations Copied!");
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        }
    });

    // Keyboard event for Alt + G
    document.addEventListener("keydown", async function (event) {
        if (event.altKey && event.key === "g") {
            try {
                const content = extractContent()
                .replace(/\s*copy_all\s*/g, "")
                .replace(/Copy Application/gi, "");
                const modifiedContent = content
                .replace(/copy explanation\./gi, "")
                .replace(/Copy Application/gi, "");
                await navigator.clipboard.writeText(preText + modifiedContent);
                showNotification("GPT Prompt and content copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        }
    });


    function createMaterialIconButton(iconContent, tooltipText, position, clickHandler, tooltipPosition, tooltipId, isSvg = false) {
        const button = document.createElement("span");

        // If using an SVG, insert the SVG content; otherwise, use Material Icons text
        if (isSvg) {
            button.innerHTML = iconContent; // iconContent contains the full SVG string
        } else {
            button.innerHTML = iconContent; // iconContent contains Material Icons text
            button.className = "material-icons-outlined";
        }

        // Common styles for both SVG and Material Icons
        button.style.cssText = `font-size: 24px; cursor: pointer; opacity: 0.6; transition: opacity 0.3s;`;

        button.onmouseover = () => {
            button.style.opacity = "1";
        };
        button.onmouseout = () => {
            button.style.opacity = "0.35";
        };
        button.onclick = clickHandler;

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `position: fixed; bottom: ${position.bottom}; right: ${position.right}; display: inline-block; opacity: 1; transition: opacity 0.3s; z-index: 9999;`;

        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.cssText = "position: relative; display: inline-block;";

        buttonWrapper.appendChild(button);
        buttonContainer.appendChild(buttonWrapper);
        document.body.appendChild(buttonContainer);

        addTooltip(buttonWrapper, tooltipText, tooltipPosition.left, tooltipPosition.top, tooltipId);

        return button;
    }

    // Now, using this function to create the Alt+G button with the SVG icon
    const svgIcon = `
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 21V2.352A3.451 3.451 0 0 0 9.5 2a3.5 3.5 0 0 0-3.261 2.238A3.5 3.5 0 0 0 4.04 8.015a3.518 3.518 0 0 0-.766 1.128c-.042.1-.064.209-.1.313a3.34 3.34 0 0 0-.106.344 3.463 3.463 0 0 0 .02 1.468A4.017 4.017 0 0 0 2.3 12.5l-.015.036a3.861 3.861 0 0 0-.216.779A3.968 3.968 0 0 0 2 14c.003.24.027.48.072.716a4 4 0 0 0 .235.832c.006.014.015.027.021.041a3.85 3.85 0 0 0 .417.727c.105.146.219.285.342.415.072.076.148.146.225.216.1.091.205.179.315.26.11.081.2.14.308.2.02.013.039.028.059.04v.053a3.506 3.506 0 0 0 3.03 3.469 3.426 3.426 0 0 0 4.154.577A.972.972 0 0 1 11 21Zm10.934-7.68a3.956 3.956 0 0 0-.215-.779l-.017-.038a4.016 4.016 0 0 0-.79-1.235 3.417 3.417 0 0 0 .017-1.468 3.387 3.387 0 0 0-.1-.333c-.034-.108-.057-.22-.1-.324a3.517 3.517 0 0 0-.766-1.128 3.5 3.5 0 0 0-2.202-3.777A3.5 3.5 0 0 0 14.5 2a3.451 3.451 0 0 0-1.5.352V21a.972.972 0 0 1-.184.546 3.426 3.426 0 0 0 4.154-.577A3.506 3.506 0 0 0 20 17.5v-.049c.02-.012.039-.027.059-.04.106-.064.208-.13.308-.2s.214-.169.315-.26c.077-.07.153-.14.225-.216a4.007 4.007 0 0 0 .459-.588c.115-.176.215-.361.3-.554.006-.014.015-.027.021-.041.087-.213.156-.434.205-.659.013-.057.024-.115.035-.173.046-.237.07-.478.073-.72a3.948 3.948 0 0 0-.066-.68Z"/>
    </svg>
`;
    // Fullscreen Toggle
    /**
 * This function retrieves elements starting with a certain class.
 * @param {string} classStart - The class prefix to look for in the document
 * @return {Array} - An array of elements that match the class prefix
 */
    // Utility function to get elements by class name that starts with a specific string
    function getElementsByClassStart(classNamePrefix) {
        return Array.from(document.querySelectorAll(`[class*="${classNamePrefix}"]`));
    }

    /**
 * This function toggles the visibility of a set of elements.
 * @param {Array} elements - The elements to hide/show
 */
    function toggleVisibility(elements) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].style.display !== 'none') {
                elements[i].style.display = 'none';
            } else {
                elements[i].style.display = '';
            }
        }
    }

    /**
 * This function moves a set of elements to the top.
 * @param {Array} elements - The elements to move to top
 */
    function moveToTop(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.top = '0';
        }
    }


    document.addEventListener('keydown', function(event) {
        // If the 'F' key is pressed along with the 'Alt' key
        if (event.key === 'h' || event.key === 'H') {
            if (event.altKey) {
                // Call the handler function
                fullscreenButtonClickHandler();
            }
        }
    });
    /**
 * This function is the callback function for the fullscreen button click event.
 * It toggles fullscreen mode by adding/removing CSS rules to elements with class containing "body".
 */


    function fullscreenButtonClickHandler() {
        var bodyElements = getElementsByClassStart('body');

        // Loop through all the elements with class "body"
        bodyElements.forEach(function (element) {
            // Toggle the 'fullscreen' class on and off
            if (element.classList.contains('fullscreen-mode')) {
                // Remove fullscreen mode
                element.style.position = '';
                element.style.top = '';
                element.style.left = '';
                element.style.width = '';
                element.style.zIndex = '';
                element.classList.remove('fullscreen-mode');
            } else {
                // Apply fullscreen mode
                element.style.position = 'fixed';
                element.style.top = '0';
                element.style.left = '0';
                element.style.width = '100%';
                element.style.zIndex = '1000';
                element.classList.add('fullscreen-mode');
            }
        });
    }

    // Create Fullscreen button
    // Create Fullscreen button
    const fullscreenButton = createMaterialIconButton(
        "fullscreen",
        "Toggle Header (Alt+H)",
        { bottom: "160px", right: "24px" }, // This initial value will be overridden below
        fullscreenButtonClickHandler,
        { left: "-50%", top: "-100%" },
        "tooltipFullscreen"
    );

    // Modify the button container styles to position it 24px from the bottom and center it
    fullscreenButton.parentElement.style.position = "fixed";
    fullscreenButton.parentElement.style.bottom = "148PX";
    fullscreenButton.parentElement.style.left = "10px";

    fullscreenButton.parentElement.style.zIndex = "9999"; // Ensure it's on top of other elements

    // Fade Fullscreen button after 3500ms
    setTimeout(() => {
        fullscreenButton.style.transition = "opacity 1s";
        fullscreenButton.style.opacity = "0.2";
    }, 3500);





    // Function to create an image button
    function createImageButton(src, tooltipText, position, clickHandler, tooltipPosition, tooltipId) {
        const button = document.createElement("img");
        button.src = src;
        button.style.cssText = `width: 16px; height: 16px; opacity: 0.6; transition: opacity 0.3s;`;

        button.onmouseover = () => {
            button.style.opacity = "1";
        };
        button.onmouseout = () => {
            button.style.opacity = "0.15";
        };
        button.onclick = clickHandler;

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `position: fixed; bottom: ${position.bottom}; right: ${position.right}; display: inline-block; opacity: 1; transition: opacity 0.3s; z-index: 9999;`;

        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.cssText = "position: relative; display: inline-block;";

        buttonWrapper.appendChild(button);
        buttonContainer.appendChild(buttonWrapper);
        document.body.appendChild(buttonContainer);

        addTooltip(buttonWrapper, tooltipText, tooltipPosition.left, tooltipPosition.top, tooltipId);

        return button;
    }
    const preText = "Respond to this prompt afresh, ignoring previous prompts and responses. Use the example provided between the \”###\” as a guide to format your response. Ensure the hierarchical outline has indents and line breaks and reduces the word count by about 75% while omitting as few details as possible. Follow the example closely to explain how to understand the vignette given after this example to reach the correct answer. Be sure there are no repetitive parts of your answer, and if so, simply omit that repeated part of the response leaving that section brief. Follow the example closely to explain how to understand \”Your Vignette\” in the text after the \”&&&\” so a medical student can understand how to reach the correct answer. Do not include any instruction in parenthesis in your response.\n\nAlso, importantly, for section IV with the incorrect answers:\nFor each incorrect answer option, provide a detailed description of the classical presentation typically seen in medical vignettes. Focus solely on each item independently, mirroring the example provided, which illustrates how each item is classically described. Avoid using negation terms such as \”not\” and do not mention or hint at the correct answer in any part of your response.\n\n###\nOriginal Question: 'A 2-month-old boy is brought to the clinic for irritability, poor feeding, and frequent vomiting. Weight is at the 15th percentile, and head circumference is at the 96th percentile. Lung sounds are clear throughout, and heart auscultation reveals no murmurs. The abdomen is soft and nondistended. There is hepatosplenomegaly. Diffusely reduced muscle tone is present in all extremities. Funduscopy reveals white-yellow chorioretinal lesions in both eyes. MRI of the brain shows enlarged ventricles and scattered intracranial calcifications. Which of the following is the most likely cause of this patient's condition?\nA. Chromosomal abnormality\nB. Intrapartum infection\nC. In utero infection\nD. Postpartum infection\nE. Single gene defect'\n\nCorrect Answer: 'C. In utero infection'\n\nIdeal Response (text enclosed in parenthesis is instruction for you and should not be included in response):\n\nI. Restated Question (all named drugs and all key clues and all pulled quotes from the vignette should be included in the restated question, and the question should ask the same question that makes sense with the original answer choice, and the correct answer should follow immediately with the preceding letter omitted but use identical wording as original text otherwise, then a succinct explanation should follow in parentheses like the example below):\nWhat is the underlying condition in a 2-month-old boy presenting with irritability, poor feeding, vomiting, hepatosplenomegaly, reduced muscle tone, white-yellow lesions in back of both eyes, enlarged ventricles, and  scattered dense, white spots on brain imaging? In utero infection (Intracranial calcifications and ventriculomegaly from chronic CNS inflammation and impaired CSF drainage; chorioretinal lesions from ocular inflammation and scarring; hepatosplenomegaly from systemic involvement. Suggests TORCH infection acquired in utero.)\n\nII. To reach answer, you must understand (give details of key concept in 40 words or less, avoid repetition from prior sections. Focus on explaining why the clues point to the answer, and why the answer is right here based on the underlying pathophysiology and physiology):\n\n• Increased head circumference and enlarged ventricles indicate increased intracranial pressure.\n\n• Chorioretinal lesions, intracranial calcifications, and hepatosplenomegaly are signs of systemic infection.\n\n• The presentation in a 2-month-old suggests an in utero, rather than postpartum, infection.\n\nIII. Confirmational Finding (Pathognomic Finding or Information from question stem that points specifically to the correct answer choice): \”enlarged ventricles and scattered intracranial calcifications\”\n\nIV. Step-Wise Explanation (Provide a concise, numbered list elucidating the pathophysiological and physiological mechanisms linking clinical symptoms to their underlying conditions. Ensure each point is 7-20 words, with a total of 4-10 points, tailored to the complexity of the topic. Emphasize causal relationships, drawing on reputable sources and medical associations, without direct citations. Use medical terminology appropriately, focusing on pathophysiology and physiology. Specifically point to the question stem before the answer choices, again focusing on the why):\n1. Symptoms of irritability, poor feeding, and vomiting indicate a systemic or CNS disorder, likely from a congenital infection.\n2. A large head relative to low weight suggests fetal growth restriction due to an immune response redirecting resources, secondary to infection.\n3. Hepatosplenomegaly denotes systemic infection, indicative of immune system activation.\n4. Decreased muscle tone suggests CNS involvement, potentially from immune-related brain damage.\n5. White-yellow chorioretinal lesions, caused by inflammation in the choroid and retina, result in scarring, evident as spots during retinal examination.\n6. MRI shows ventriculomegaly and intracranial calcifications, the latter resulting from TORCH infections where immune inflammation leads to brain damage, cell death, and calcification, a healing response that also causes ventriculomegaly by obstructing CSF drainage.\n7. The combination of CNS, ocular, systemic symptoms (hepatosplenomegaly), and growth restriction indicates a TORCH infection, characterized by immune-mediated inflammation and tissue damage.\n\nV. Incorrect Answers:\n(INSTRUCTIONS: For each incorrect answer option, detail the classical presentation typically associated in medical vignettes for each item independent of the question. Importantly, do not relate the incorrect items back to the question and instead just focus on in each item independently and closely following the examples between the '^^^' below to describe each item in the context of classic board questions.)\n\n^^^\nV. Incorrect Answers Examples:\n\n• Endometriosis: Ectopic endometrial tissue growth in reproductive-aged individuals. Presents with cyclic pelvic pain, dysmenorrhea, infertility potential, and painful defecation during menstruation.\n\n• Labetalol: Nonselective β-blocker, α1-antagonist for hypertension, hypertensive emergencies, pheochromocytoma (preoperative), safe in pregnancy. Decreases heart rate and blood pressure, inducing less reflex tachycardia than other β blockers.\n\n• Fetal congenital malformation: Birth structural abnormalities like ventricular septal defect, spina bifida, cleft lip/palate, clubfoot, congenital diaphragmatic hernia, anencephaly. Associated with abnormal prenatal ultrasound, organ anomalies, genetic counseling, maternal age, environmental factors, genetic disorders, teratogen exposure.\n\n• Incorrect gestational age: Misestimated pregnancy duration from last menstrual period and ultrasound discrepancy. Affects delivery timing, fetal maturity, growth abnormality risk, prenatal screening accuracy, requires delivery date adjustment.\n\n• Trisomy 21: Down syndrome from extra 21st chromosome; linked to advanced maternal age, increased nuchal translucency, flattened nasal bridge, epicanthic folds, toe gap, iris white spots, low muscle tone, intellectual disability.\n^^^\n\n###\n\nAgain, remember that the incorrect answers in part V should only provide classic descriptions in a comma separated list of high yield information and not comment on why the answer is incorrect and if applicable the most common causes and top 3 primary indications. Omit parts of sentences that begin with \”not...\” or \”but don't...\” or \”but doesn't...\”.\n\n&&&\n\n";
    // Create Alt+G button using SVG content
    // Create Alt+G (Copy with Chat-GPT Prompt) button
    const altGButton = createMaterialIconButton(
        svgIcon, // Pass SVG content
        "Copy with Chat-GPT Prompt (Alt+G)",
        { bottom: "24px", left: "24px" }, // 24px from the bottom and left edges
        async () => {
            try {
                const content = extractContent().replace(/\s*copy_all\s*/g, "").replace(/Copy Application/gi, "");
                const modifiedContent = content.replace(/copy explanation\./gi, "").replace(/Copy Application/gi, "");
                await navigator.clipboard.writeText(preText + modifiedContent);
                showNotification("GPT Prompt and content copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        },
        { left: "-50%", top: "-100%" },
        "tooltipAltG",
        true // This flag indicates that the content is SVG
    );

    // Set the button's position to be 24px from the bottom and 24px from the left
    altGButton.parentElement.style.position = "fixed";
    altGButton.parentElement.style.bottom = "48px"; // 24px from the bottom
    altGButton.parentElement.style.left = "10px"; // 24px from the left edge
    altGButton.parentElement.style.zIndex = "9999"; // Ensure it's on top of other elements

    // Fade Alt+G button after 3500ms
    setTimeout(() => {
        altGButton.style.transition = "opacity 1s";
        altGButton.style.opacity = "0.1";
    }, 3500);



    // Create Alt+C (Copy All) button
    const altCButton = createMaterialIconButton(
        "copy_all",
        "Copy All Content (Alt+C)",
        { bottom: "24px", left: "24px" }, // 24px from the bottom and right edges
        async () => {
            try {
                await navigator.clipboard.writeText(extractContent().replace(/\s*copy_all\s*/g, ""));
                showNotification("Question + Explanations Copied!");
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        },
        { left: "50%", top: "-100%" },
        "tooltipAltC"
    );

    // Set button's position to be 24px from bottom and 24px from right
    altCButton.parentElement.style.position = "fixed";
    altCButton.parentElement.style.bottom = "96px"; // Same height as fullscreen button
    altCButton.parentElement.style.left = "10px"; // 24px from the right edge
    altCButton.parentElement.style.zIndex = "9999"; // Ensure it's on top of other elements

    // Fade Alt+C button after 3500ms
    setTimeout(() => {
        altCButton.style.transition = "opacity 1s";
        altCButton.style.opacity = "0.1";
    }, 3500);


    // Call the functions
    addButtonToElements();
    addButton();

    // Observe the document body for changes
    new MutationObserver(() => {
        addButtonToElements();
        addButton();
    }).observe(document.body, {
        childList: true,
        subtree: true,
    });
})();