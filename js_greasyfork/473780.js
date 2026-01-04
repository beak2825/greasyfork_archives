// ==UserScript==
// @name         Claude.ai ChatGPT NBME-uWorld Question Analysis Prompt & Paste
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  chat.openai.com and Claude.ai script to prepend a prompt to the text on the clipboard.
// @author       bwhurd
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473780/Claudeai%20ChatGPT%20NBME-uWorld%20Question%20Analysis%20Prompt%20%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/473780/Claudeai%20ChatGPT%20NBME-uWorld%20Question%20Analysis%20Prompt%20%20Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loadCSS = (href) => {
        let link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    };

    loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons");
    loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined");

    function createButton(icon, onClick, tooltipText, id) {
        const button = document.createElement('button');
        button.style.cssText = "position: fixed; top: 60px; right: 20px; width: 30px; height: 30px; border: none; background: none; color: var(--text-secondary); cursor: pointer; z-index: 9999;";
        
        button.innerHTML = icon;
        button.addEventListener('click', onClick);
        button.id = id;

        button.addEventListener('mouseenter', () => {
            button.style.color = "#AB68FD";
        });

        button.addEventListener('mouseleave', () => {
            button.style.color = "var(--text-secondary)";
        });

        if (tooltipText) {
            addTooltip(button, tooltipText);
        }

        return button;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = "position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); padding: 16px; background-color: #333; color: #FFF; border-radius: 4px; max-width: 90%; text-align: center; z-index: 1000; font-size: 14px; opacity: 1; transition: opacity 0.5s ease; box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);";
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3500);
    }

    function addTooltip(element, tooltipText) {
        const tooltip = document.createElement('div');
        tooltip.innerText = tooltipText;
        tooltip.style.cssText = "position: absolute; bottom: 50%; right: 100%; transform: translateX(-10px) translateY(50%); margin-right: 10px; background-color: #2A2B32; color: #ECECF1; border-radius: 5px; padding: 5px; font-size: 12px; text-align: center; white-space: nowrap; visibility: hidden; opacity: 0; transition: opacity 0.3s";
        element.appendChild(tooltip);
        element.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        element.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
    }

    // Create vignettePrompt button using the createButton function
    const vignettePromptButton = createButton('<span class="material-icons-outlined">school</span>', function() {
        // Your button logic here
        showToast("Text copied!");
    }, "Click to modify clipboard", "vignettePrompt");

    document.body.appendChild(vignettePromptButton);

    // Click event for the button
    vignettePromptButton.onclick = function() {
        const prependText = `Respond to this prompt afresh, ignoring previous prompts and responses. Use the example inside the <example></example> XML tags below to guide and format your response. Ensure the hierarchical outline has indents and line breaks and reduces the word count by about 75% while omitting as few details as possible. Follow the example closely to explain how to understand the vignette text inside the <text></text> XML tags to reach the correct answer. Be sure there are no repetitive parts of your response, and if so, simply omit that repeated part of the response leaving that section brief. Follow the example closely to explain how to understand “Your Vignette” in the text inside the <text></text> so a medical student can understand how to reach the correct answer. Do not include any instruction from the example that is enclosed in parenthesis in your response, as the text in parenthesis in the example is additional instruction to guide your response. The incorrect answers section should focus on classic presentation and not relate back to original question just like the example.

<example>
H:
'A 2-month-old boy is brought to the clinic for irritability, poor feeding, and frequent vomiting. Weight is at the 15th percentile, and head circumference is at the 96th percentile. Lung sounds are clear throughout, and heart auscultation reveals no murmurs. The abdomen is soft and nondistended. There is hepatosplenomegaly. Diffusely reduced muscle tone is present in all extremities. Funduscopy reveals white-yellow chorioretinal lesions in both eyes. MRI of the brain shows enlarged ventricles and scattered intracranial calcifications. Which of the following is the most likely cause of this patient's condition?
A. Chromosomal abnormality
B. Intrapartum infection
C. In utero infection
D. Postpartum infection
E. Single gene defect

Correct Answer: 'C. In utero infection'

(text enclosed in parenthesis is instruction for you and should not be included in response)

A:
I. Restated Question (all key clues from the vignette should be included in the restated question, any drugs mentioned in original stem should be in restated question, and the question should ask the same question that makes sense with the original answer choice, and the correct answer should follow immediately with the preceding letter omitted but use identical wording as original text otherwise):
What is the underlying condition in a 2-month-old boy presenting with irritability, poor feeding, vomiting, hepatosplenomegaly, reduced muscle tone, chorioretinal lesions, enlarged ventricles, and intracranial calcifications? In utero infection

II. To reach answer, you must understand (give details of key concept in 40 words or less, avoid repetition from prior sections):
• Recognize increased head circumference and enlarged ventricles indicate increased intracranial pressure.
• Chorioretinal lesions, intracranial calcifications, and hepatosplenomegaly are signs of systemic infection.
• The presentation in a 2-month-old suggests an in utero, rather than postpartum, infection.

III. Confirmational Finding (Pathognomic Finding or Information from question stem that points specifically to the correct answer choice): "enlarged ventricles and scattered intracranial calcifications"

IV. Step-Wise Explanation (Provide a concise, numbered list elucidating the pathophysiological and physiological mechanisms linking clinical symptoms to their underlying conditions. Ensure each point is 7-20 words, with a total of 4-10 points, tailored to the complexity of the topic. Emphasize causal relationships, drawing on reputable sources and medical associations, without direct citations. Use medical terminology appropriately, focusing on pathophysiology and physiology. Specifically point to the question stem before the answer choices, again focusing on the why):
1. Symptoms of irritability, poor feeding, and vomiting indicate a systemic or CNS disorder, likely from a congenital infection.
2. A large head relative to low weight suggests fetal growth restriction due to an immune response redirecting resources, secondary to infection.
3. Hepatosplenomegaly denotes systemic infection, indicative of immune system activation.
4. Decreased muscle tone suggests CNS involvement, potentially from immune-related brain damage.
5. White-yellow chorioretinal lesions, caused by inflammation in the choroid and retina, result in scarring, evident as spots during retinal examination.
6. MRI shows ventriculomegaly and intracranial calcifications, the latter resulting from TORCH infections where immune inflammation leads to brain damage, cell death, and calcification, a healing response that also causes ventriculomegaly by obstructing CSF drainage.
7. The combination of CNS, ocular, systemic symptoms (hepatosplenomegaly), and growth restriction indicates a TORCH infection, characterized by immune-mediated inflammation and tissue damage.

V. Incorrect Answers:
• Chromosomal abnormality: Structural or numerical chromosome anomalies, presenting with developmental delays, distinct facial features, congenital malformations. e.g. Down syndrome, Turner syndrome, and Klinefelter syndrome.
• Intrapartum infection: Acquired during birth, presents w/ respiratory distress, fever, lethargy, or sepsis. Often d/t Group B Streptococcus, E. coli, and herpes simplex virus.
• Postpartum infection: Occurs after birth, affecting neonate or mother. Neonatal presentations include sepsis, pneumonia, meningitis. Maternal postpartum infections involve endometritis, wound infections, urinary tract infections.
• Single gene defect: Results from mutations in a single gene, manifesting as monogenic disorders. e.g. metabolic disorders like phenylketonuria, cystic fibrosis, and sickle cell disease.
</example>

Your Vignette:
<text>`;

        // Try to get the current clipboard content
        navigator.clipboard.readText().then(clipText => {
            // Modify the clipboard content
            navigator.clipboard.writeText(prependText + clipText + `</text>`);
        });
    };

})(); // Closing brace for IIFE