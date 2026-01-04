// ==UserScript==
// @name         KhanHack
// @namespace    https://greasyfork.org/users/783447
// @version      7.1
// @description  Khan Academy Answer Hack
// @author       Logzilla6
// @match        https://*.khanacademy.org/*
// @icon         https://i.ibb.co/K5g1KMq/Untitled-drawing-3.png
// @downloadURL https://update.greasyfork.org/scripts/427964/KhanHack.user.js
// @updateURL https://update.greasyfork.org/scripts/427964/KhanHack.meta.js
// ==/UserScript==

//ALL FOLLOWING CODE IS UNDER THE KHANHACK TRADEMARK. UNAUTHORIZED DISTRIBUTION CAN/WILL RESULT IN LEGAL ACTION

//Note that KhanHack™ is an independent initiative and is not affiliated with or endorsed by Khan Academy. We respect the work of Khan Academy and its mission to provide free education, but KhanHack™ operates separately with its own unique goals.

let answerQueue = [];
let currentAnswerIndex = 0;
let isGhostMode = false;
let waitForData = false;

const createMenu = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap');

        #khanhack-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            height: 420px;
            background-color: #123576;
            border: 3px solid #07152e;
            border-radius: 16px;
            padding: 0;
            color: white;
            font-family: 'Noto Sans', sans-serif;
            z-index: 99999;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-size: 14px;
            opacity: 1;
        }

        #khanhack-menu.ghost-active {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #khanhack-menu.ghost-active:hover {
            opacity: 1;
        }

        #khanhack-menu.minimized {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
            padding: 0;
            justify-content: center;
            align-items: center;
            opacity: 0.8;
            border: 2px solid #07152e;
        }

        #khanhack-menu.minimized:hover {
            opacity: 1;
            transform: scale(1.05);
        }

        /* Header Section */
        .kh-header {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background-color: rgba(7, 21, 46, 0.3);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .kh-header-title {
            font-weight: 700;
            font-size: 18px;
            letter-spacing: 0.5px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-grow: 1;
        }

        .kh-controls {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .kh-icon-btn {
            width: 24px;
            height: 24px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .kh-icon-btn:hover {
            opacity: 1;
        }

        .kh-content {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.3) transparent;
        }

        .kh-content::-webkit-scrollbar {
            width: 6px;
        }

        .kh-content::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.3);
            border-radius: 3px;
        }

        .kh-placeholder {
            text-align: center;
            color: rgba(255,255,255,0.6);
            margin-top: 50%;
            transform: translateY(-50%);
            font-style: italic;
        }

        .kh-card {
            background: #f0f0f0;
            color: #1a1a1a;
            padding: 12px;
            border-radius: 8px;
            border-left: 5px solid #2967d9;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            word-wrap: break-word;
            font-weight: 500;
            font-size: 15px;
            animation: fadeIn 0.3s ease;
            margin-bottom: 8px;
            cursor: pointer;
            transition: transform 0.1s;
        }

        .kh-card:active {
            transform: scale(0.98);
        }

        .kh-card img {
            max-width: 100%;
            border-radius: 4px;
            margin-top: 5px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .kh-footer {
            padding: 10px 15px;
            background-color: rgba(7, 21, 46, 0.5);
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .kh-nav-btn {
            background: #2967d9;
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: background 0.2s;
        }

        .kh-nav-btn:hover {
            background: #3b7ced;
        }

        .kh-nav-btn:disabled {
            background: #1e3a6e;
            color: #aaa;
            cursor: not-allowed;
        }

        .kh-status {
            font-size: 12px;
            color: rgba(255,255,255,0.7);
        }

        .kh-toggle {
            display: none;
            width: 24px;
            height: 24px;
            filter: brightness(0) invert(1);
        }

        .kh-settings-view {
            display: none;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            padding-top: 20px;
            animation: fadeIn 0.3s ease;
        }

        .kh-setting-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
        }

        .kh-beta-tag {
            background: #2967d9;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }

        .kh-toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }

        .kh-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .kh-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #07152e;
            transition: .4s;
            border-radius: 20px;
            border: 1px solid white;
        }

        .kh-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .kh-slider {
            background-color: #2967d9;
        }

        input:checked + .kh-slider:before {
            transform: translateX(20px);
        }

        #khanhack-menu.minimized .kh-header,
        #khanhack-menu.minimized .kh-content,
        #khanhack-menu.minimized .kh-footer {
            display: none;
        }

        #khanhack-menu.minimized .kh-toggle {
            display: block;
        }

        .kh-hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'khanhack-menu';

    const toggleIcon = document.createElement('img');
    toggleIcon.src = 'https://i.ibb.co/RpqPcR1/hamburger.png';
    toggleIcon.className = 'kh-toggle';

    const header = document.createElement('div');
    header.className = 'kh-header';

    const discordIcon = document.createElement('img');
    discordIcon.src = 'https://i.ibb.co/grF973h/discord.png';
    discordIcon.className = 'kh-icon-btn';
    discordIcon.style.marginRight = '10px';
    discordIcon.onclick = () => window.open('https://discord.gg/7xWK5n9Zbp', '_blank');

    const title = document.createElement('div');
    title.id = 'kh-title-text';
    title.className = 'kh-header-title';
    title.innerText = 'KhanHack';

    const controls = document.createElement('div');
    controls.className = 'kh-controls';

    const settingsIcon = document.createElement('img');
    settingsIcon.src = 'https://i.ibb.co/q0QVKGG/gearicon.png';
    settingsIcon.className = 'kh-icon-btn';
    settingsIcon.title = 'Settings';

    const collapseBtn = document.createElement('span');
    collapseBtn.innerHTML = '&#8722;';
    collapseBtn.className = 'kh-icon-btn';
    collapseBtn.style.fontSize = '24px';
    collapseBtn.style.lineHeight = '20px';
    collapseBtn.style.fontWeight = 'bold';
    collapseBtn.style.textAlign = 'center';
    collapseBtn.title = 'Minimize';
    collapseBtn.onclick = (e) => {
        e.stopPropagation();
        toggleMenu();
    };

    controls.appendChild(settingsIcon);
    controls.appendChild(collapseBtn);

    header.appendChild(discordIcon);
    header.appendChild(title);
    header.appendChild(controls);

    const content = document.createElement('div');
    content.className = 'kh-content';

    const answerView = document.createElement('div');
    answerView.id = 'kh-answer-view';

    const placeholder = document.createElement('div');
    placeholder.className = 'kh-placeholder';
    placeholder.id = 'kh-placeholder-text';
    placeholder.innerText = 'Waiting for questions...';

    const contentBox = document.createElement('div');
    contentBox.id = 'kh-content-box';

    answerView.appendChild(placeholder);
    answerView.appendChild(contentBox);

    const settingsView = document.createElement('div');
    settingsView.className = 'kh-settings-view';
    settingsView.id = 'kh-settings-view';

    const ghostItem = document.createElement('div');
    ghostItem.className = 'kh-setting-item';

    const ghostLabel = document.createElement('span');
    ghostLabel.innerText = "Ghost Mode:";

    const ghostSwitch = document.createElement('label');
    ghostSwitch.className = 'kh-toggle-switch';
    const ghostInput = document.createElement('input');
    ghostInput.type = 'checkbox';
    ghostInput.onchange = (e) => toggleGhostMode(e.target.checked);
    const ghostSlider = document.createElement('span');
    ghostSlider.className = 'kh-slider';

    ghostSwitch.appendChild(ghostInput);
    ghostSwitch.appendChild(ghostSlider);
    ghostItem.appendChild(ghostLabel);
    ghostItem.appendChild(ghostSwitch);

    const autoAnsItem = document.createElement('div');
    autoAnsItem.className = 'kh-setting-item';
    autoAnsItem.innerHTML = 'Auto Answer <span class="kh-beta-tag">BETA</span>';

    const pointFarmerItem = document.createElement('div');
    pointFarmerItem.className = 'kh-setting-item';
    pointFarmerItem.innerHTML = 'Point Farmer <span class="kh-beta-tag">BETA</span>';

    const versionText = document.createElement('div');
    versionText.style.marginTop = 'auto';
    versionText.style.opacity = '0.5';
    versionText.style.fontSize = '12px';
    versionText.innerText = 'KhanHack™ | 7.1';

    settingsView.appendChild(ghostItem);
    settingsView.appendChild(autoAnsItem);
    settingsView.appendChild(pointFarmerItem);
    settingsView.appendChild(versionText);

    content.appendChild(answerView);
    content.appendChild(settingsView);

    const footer = document.createElement('div');
    footer.className = 'kh-footer';
    footer.id = 'kh-footer';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'kh-nav-btn';
    prevBtn.innerText = '◄ Prev';
    prevBtn.id = 'kh-prev-btn';
    prevBtn.onclick = () => navigateAnswer(-1);

    const statusText = document.createElement('span');
    statusText.className = 'kh-status';
    statusText.id = 'kh-status-text';
    statusText.innerText = '0 / 0';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'kh-nav-btn';
    nextBtn.innerText = 'Next ►';
    nextBtn.id = 'kh-next-btn';
    nextBtn.onclick = () => navigateAnswer(1);

    footer.appendChild(prevBtn);
    footer.appendChild(statusText);
    footer.appendChild(nextBtn);

    menu.appendChild(toggleIcon);
    menu.appendChild(header);
    menu.appendChild(content);
    menu.appendChild(footer);
    document.body.appendChild(menu);

    let isMinimized = false;
    let isSettingsOpen = false;

    settingsIcon.onclick = () => {
        isSettingsOpen = !isSettingsOpen;
        if (isSettingsOpen) {
            answerView.classList.add('kh-hidden');
            footer.classList.add('kh-hidden');
            settingsView.style.display = 'flex';
            title.innerText = "Settings";
            discordIcon.classList.add('kh-hidden');
            settingsIcon.style.opacity = '1';
        } else {
            answerView.classList.remove('kh-hidden');
            footer.classList.remove('kh-hidden');
            settingsView.style.display = 'none';
            title.innerText = "KhanHack";
            discordIcon.classList.remove('kh-hidden');
        }
    };

    const toggleMenu = () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
            menu.classList.add('minimized');
        } else {
            menu.classList.remove('minimized');
        }
    };

    const toggleGhostMode = (active) => {
        isGhostMode = active;
        if (active) {
            menu.classList.add('ghost-active');
        } else {
            menu.classList.remove('ghost-active');
        }
    };

    menu.addEventListener('click', (e) => {
        if (isMinimized) toggleMenu();
    });

    updateNavState();
};

const updateMenuContent = () => {
    const contentBox = document.getElementById('kh-content-box');
    const placeholder = document.getElementById('kh-placeholder-text');

    if (answerQueue.length === 0) {
        if(placeholder) placeholder.style.display = 'block';
        return;
    }

    if(placeholder) placeholder.style.display = 'none';

    contentBox.innerHTML = '';

    const currentAnsArray = answerQueue[currentAnswerIndex];

    if (currentAnsArray && Array.isArray(currentAnsArray)) {
        currentAnsArray.forEach(rawAns => {
            const currentAns = String(rawAns);

            const card = document.createElement('div');
            card.className = 'kh-card';

            if (currentAns.startsWith('[Image]')) {
                const parts = currentAns.match(/\[Image\] (.*)\((.*)\)/);
                if (parts) {
                    if (parts[1].trim()) {
                        const textP = document.createElement('div');
                        textP.innerText = parts[1].trim();
                        card.appendChild(textP);
                    }
                    const img = document.createElement('img');
                    img.src = parts[2];
                    card.appendChild(img);
                } else {
                    card.innerText = currentAns;
                }
            } else {
                card.innerText = currentAns;
            }

            card.title = "Click to copy";
            card.onclick = () => {
                navigator.clipboard.writeText(currentAns.replace(/\[Image\] .*/, 'Image copied'));

                const originalBg = card.style.backgroundColor;
                card.style.backgroundColor = '#d1e7dd';

                setTimeout(() => {
                    card.style.backgroundColor = originalBg;
                }, 200);
            };

            contentBox.appendChild(card);
        });
    }

    updateNavState();
};

const updateNavState = () => {
    const prevBtn = document.getElementById('kh-prev-btn');
    const nextBtn = document.getElementById('kh-next-btn');
    const statusText = document.getElementById('kh-status-text');

    if (prevBtn && nextBtn && statusText) {
        statusText.innerText = `${answerQueue.length > 0 ? currentAnswerIndex + 1 : 0} / ${answerQueue.length}`;

        prevBtn.disabled = currentAnswerIndex <= 0;
        nextBtn.disabled = currentAnswerIndex >= answerQueue.length - 1;
    }
};

const navigateAnswer = (direction) => {
    const newIndex = currentAnswerIndex + direction;
    if (newIndex >= 0 && newIndex < answerQueue.length) {
        currentAnswerIndex = newIndex;
        updateMenuContent();
    }
};

const addAnswerToQueue = (answerGroup) => {
    answerQueue.push(answerGroup);

    if (answerQueue.length === 1) {
        currentAnswerIndex = 0;
        updateMenuContent();
        waitForData = false;
    } else if (waitForData) {
        navigateAnswer(1);
        waitForData = false;
    } else {
        updateNavState();
    }
};

const setupAutoAdvance = () => {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const testId = target.getAttribute('data-testid');
        const ariaLabel = target.getAttribute('aria-label');
        const text = target.innerText || '';
        if (
            testId === 'exercise-next-question-button' ||
            (ariaLabel && ariaLabel.includes('Next question')) ||
            text.includes('Next question')
        ) {
            setTimeout(() => {
                navigateAnswer(1);
            }, 200);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            waitForData = true;
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        createMenu();
        setupAutoAdvance();
    });
} else {
    createMenu();
    setupAutoAdvance();
}

let originalJson = JSON.parse;

JSON.parse = function (jsonString) {
    let parsedData = originalJson(jsonString);

    try {
        if (parsedData.data) {
            let assessmentItem = parsedData.data.assessmentItemById || parsedData.data.assessmentItemByProblemNumber;

            if (assessmentItem && assessmentItem.item) {
                let itemData = JSON.parse(assessmentItem.item.itemData);
                let hasGradedWidget = Object.values(itemData.question.widgets).some(widget => widget.graded === true);

                if (hasGradedWidget) {
                    const currentItemAnswers = [];

                    for (let widgetKey in itemData.question.widgets) {
                        let widget = itemData.question.widgets[widgetKey];

                        if (widgetHandlers[widget.type]) {
                            const answer = widgetHandlers[widget.type](widget);
                            if (answer !== undefined && answer !== null) {
                                if (Array.isArray(answer)) {
                                    currentItemAnswers.push(...answer);
                                } else {
                                    currentItemAnswers.push(answer);
                                }
                            }
                        }
                    }

                    if (currentItemAnswers.length > 0) {
                         addAnswerToQueue(currentItemAnswers);
                    }
                }
            }
        }
    } catch (error) {
    }

    return parsedData;
};

const cleanLatex = (text) => {
    if (typeof text !== 'string') return text;
    return text
        .replace(/\\begin{align}/g, '\\begin{aligned}')
        .replace(/\\end{align}/g, '\\end{aligned}')
        .replace(/\$/g, '');
};

const widgetHandlers = {
    "numeric-input": (w) => w.options.answers[0].value,

    "input-number": (w) => w.options.value,

    "dropdown": (w) => w.options.choices.find(c => c.correct)?.content,

    "expression": (w) => cleanLatex(w.options.answerForms[0].value),

    "matcher": (w) => cleanLatex(w.options.right),

    "grapher": (w) => w.options.correct.coords.join(' | '),

    "interactive-graph": (w) => {
        return w.options.correct.coords
            .filter(c => c !== undefined)
            .join(' | ');
    },

    "categorizer": (w) => {
        return w.options.values
            .map(v => w.options.categories[v])
            .join(", ");
    },

    "matrix": (w) => w.options.answers.join(' | '),

    "label-image": (w) => {
        const markers = w.options.markers;
        return markers
            .filter(m => m.answers)
            .map((m, i) => {
                const label = m.label ? m.label.replace('Point ', '').replace(/\./g, '').trim() : '';
                const cleanAns = cleanLatex(m.answers.toString());
                return label ? `${label}: ${cleanAns}` : cleanAns;
            })
            .join(" | ");
    },

    "radio": (w) => {
        const choices = w.options.choices;
        const isNone = choices.some(c => c.isNoneOfTheAbove && c.correct);
        if (isNone) return "None of the above";

        return choices
            .filter(c => c.correct)
            .flatMap(c => {
                const content = c.content;
                const imageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);

                if (imageMatch) {
                    let text = imageMatch[1];
                    let url = imageMatch[2];

                    if (url.includes('web+graphie')) {
                        url = url.replace('web+graphie:', 'https:') + '.svg';
                    }

                    const result = [`[Image] (${url})`];
                    if (text && text.trim().length > 0) {
                        result.push(text.trim());
                    }
                    return result;
                }

                return cleanLatex(content);
            });
    }
};