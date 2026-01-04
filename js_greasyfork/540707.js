// ==UserScript==
// @name         Yooo wtf
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Navigate quiz questions with answers (Educational purposes only)
// @author       You
// @match        https://docs.google.com/forms/*
// @match        https://forms.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540707/Yooo%20wtf.user.js
// @updateURL https://update.greasyfork.org/scripts/540707/Yooo%20wtf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your quiz data
    const quizData = {
  "seo_quiz": {
    "title": "SEO Quiz Questions & Answers",
    "total_questions": 30,
    "questions": [
      {
        "id": 1,
        "question": "A competitor's page ranks high with text and video content. What should an SEO professional recommend?",
        "type": "multiple_choice",
        "options": [
          "Include diverse content types like video",
          "Focus only on text content",
          "Optimize title tags and headings",
          "Ignore competitor content strategies"
        ],
        "correct_answers": ["a", "c"],
        "correct_options": [
          "Include diverse content types like video",
          "Optimize title tags and headings"
        ]
      },
      {
        "id": 2,
        "question": "Which HTTP status code should be used during scheduled server maintenance?",
        "type": "single_choice",
        "options": [
          "301",
          "200",
          "503",
          "404"
        ],
        "correct_answer": "c",
        "correct_option": "503"
      },
      {
        "id": 3,
        "question": "Which metrics can be used to forecast SEO value?",
        "type": "multiple_choice",
        "options": [
          "Keyword rankings",
          "Organic traffic",
          "Revenue tied to SEO",
          "Social media followers"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Keyword rankings",
          "Organic traffic",
          "Revenue tied to SEO"
        ]
      },
      {
        "id": 4,
        "question": "Your website has a backlink profile with links from low-authority sites. Based on the lesson, why might this be problematic?",
        "type": "single_choice",
        "options": [
          "It improves site indexing",
          "It reduces social media visibility",
          "It risks penalties from algorithms like Penguin",
          "It increases page load time"
        ],
        "correct_answer": "c",
        "correct_option": "It risks penalties from algorithms like Penguin"
      },
      {
        "id": 5,
        "question": "Which of the following are factors Google considers when analyzing backlinks?",
        "type": "multiple_choice",
        "options": [
          "Relevance of the linking site",
          "Placement of the link on the page",
          "Quality of the linking site",
          "Number of social media followers"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Relevance of the linking site",
          "Placement of the link on the page",
          "Quality of the linking site"
        ]
      },
      {
        "id": 6,
        "question": "What is a potential consequence of chaining redirects (e.g., Page A → Page B → Page C)?",
        "type": "single_choice",
        "options": [
          "Increased link authority",
          "Loss of authority with each redirect",
          "Faster page indexing",
          "Improved user experience"
        ],
        "correct_answer": "b",
        "correct_option": "Loss of authority with each redirect"
      },
      {
        "id": 7,
        "question": "Which factors should be analyzed for competitors' pages?",
        "type": "multiple_choice",
        "options": [
          "Server response time",
          "Title tag optimization",
          "Content quality",
          "Domain authority"
        ],
        "correct_answers": ["a", "b", "c", "d"],
        "correct_options": [
          "Server response time",
          "Title tag optimization",
          "Content quality",
          "Domain authority"
        ]
      },
      {
        "id": 8,
        "question": "Which strategies contribute to an effective off-site SEO plan?",
        "type": "multiple_choice",
        "options": [
          "Building natural backlinks",
          "Increasing brand visibility via social media",
          "Purchasing links from low-authority sites",
          "Regularly editing the backlink profile"
        ],
        "correct_answers": ["a", "b", "d"],
        "correct_options": [
          "Building natural backlinks",
          "Increasing brand visibility via social media",
          "Regularly editing the backlink profile"
        ]
      },
      {
        "id": 9,
        "question": "A Google Trends graph for 'wedding ideas' shows peak times of search are in fall and winter. Why should a site redesign avoid these periods?",
        "type": "single_choice",
        "options": [
          "To reduce server load",
          "To allow new pages to index before peak traffic",
          "To increase social media engagement",
          "To avoid keyword competition"
        ],
        "correct_answer": "b",
        "correct_option": "To allow new pages to index before peak traffic"
      },
      {
        "id": 10,
        "question": "Which of the following are quick wins for an SEO campaign?",
        "type": "multiple_choice",
        "options": [
          "Adding alt text to images",
          "Setting up Google Webmaster Tools",
          "Conducting a full technical audit",
          "Optimizing XML sitemap"
        ],
        "correct_answers": ["a", "b", "d"],
        "correct_options": [
          "Adding alt text to images",
          "Setting up Google Webmaster Tools",
          "Optimizing XML sitemap"
        ]
      },
      {
        "id": 11,
        "question": "What is the risk of using excessive keyword-rich anchor text in backlinks?",
        "type": "single_choice",
        "options": [
          "It improves link diversity",
          "It may appear unnatural and trigger penalties",
          "It reduces social media engagement",
          "It slows page indexing"
        ],
        "correct_answer": "b",
        "correct_option": "It may appear unnatural and trigger penalties"
      },
      {
        "id": 12,
        "question": "A site has no pages matching a high-value keyword. What should be done?",
        "type": "multiple_choice",
        "options": [
          "Recommend a new page for the keyword",
          "Make small changes to an existing page",
          "Ignore the keyword",
          "Include the keyword in the keyword map"
        ],
        "correct_answers": ["a", "d"],
        "correct_options": [
          "Recommend a new page for the keyword",
          "Include the keyword in the keyword map"
        ]
      },
      {
        "id": 13,
        "question": "Why is benchmarking data important for KPIs?",
        "type": "single_choice",
        "options": [
          "It reduces server costs",
          "It simplifies keyword research",
          "It increases social media followers",
          "It allows comparison of performance before and after SEO efforts"
        ],
        "correct_answer": "d",
        "correct_option": "It allows comparison of performance before and after SEO efforts"
      },
      {
        "id": 14,
        "question": "What is the primary goal of keyword research in SEO?",
        "type": "single_choice",
        "options": [
          "To optimize website design",
          "To understand user search behavior and target relevant terms",
          "To increase social media engagement",
          "To improve server performance"
        ],
        "correct_answer": "b",
        "correct_option": "To understand user search behavior and target relevant terms"
      },
      {
        "id": 15,
        "question": "Why is it important to avoid using similar keywords on multiple pages?",
        "type": "single_choice",
        "options": [
          "It improves page load speed",
          "It prevents pages from competing with each other",
          "It reduces search volume",
          "It increases bounce rates"
        ],
        "correct_answer": "b",
        "correct_option": "It prevents pages from competing with each other"
      },
      {
        "id": 16,
        "question": "Which elements can be included in an XML sitemap?",
        "type": "multiple_choice",
        "options": [
          "Page update frequency",
          "Page priority",
          "Last modified date",
          "Meta description text"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Page update frequency",
          "Page priority",
          "Last modified date"
        ]
      },
      {
        "id": 17,
        "question": "A page with a 'product no longer available' message returning a 200 status code. Why is this problematic?",
        "type": "single_choice",
        "options": [
          "It improves page indexing",
          "It is seen as duplicate or thin content",
          "It enhances user experience",
          "It increases crawl frequency"
        ],
        "correct_answer": "b",
        "correct_option": "It is seen as duplicate or thin content"
      },
      {
        "id": 18,
        "question": "Which of the following is most important when choosing anchor text for a backlink?",
        "type": "single_choice",
        "options": [
          "Using exact match keywords",
          "Being natural and relevant to the content",
          "Making the anchor text as long as possible",
          "Avoiding brand mentions"
        ],
        "correct_answer": "b",
        "correct_option": "Being natural and relevant to the content"
      },
      {
        "id": 19,
        "question": "A client's site has overly broad keywords like 'shoes' everywhere. What should you do?",
        "type": "single_choice",
        "options": [
          "Ignore the issue",
          "Recommend specific, less competitive keywords",
          "Increase keyword density",
          "Remove all keywords"
        ],
        "correct_answer": "b",
        "correct_option": "Recommend specific, less competitive keywords"
      },
      {
        "id": 20,
        "question": "How should an SEO professional handle a spammy backlink to avoid penalties?",
        "type": "single_choice",
        "options": [
          "Ignore it to maintain link diversity",
          "Request its removal or use the Link Disavow Tool",
          "Add it to the site's footer",
          "Promote it on social media"
        ],
        "correct_answer": "b",
        "correct_option": "Request its removal or use the Link Disavow Tool"
      },
      {
        "id": 21,
        "question": "What is a characteristic of long-tail keywords?",
        "type": "single_choice",
        "options": [
          "High competition and broad focus",
          "Low search volume and high specificity",
          "Used only in navigational queries",
          "Difficult to convert users"
        ],
        "correct_answer": "b",
        "correct_option": "Low search volume and high specificity"
      },
      {
        "id": 22,
        "question": "Which of the following are common SEO KPIs to track?",
        "type": "multiple_choice",
        "options": [
          "Organic traffic",
          "Backlinks",
          "Click-through rate",
          "Server uptime"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Organic traffic",
          "Backlinks",
          "Click-through rate"
        ]
      },
      {
        "id": 23,
        "question": "Which of the following are steps in competitive keyword analysis?",
        "type": "multiple_choice",
        "options": [
          "Select keywords based on relevancy and intent",
          "Identify top competitors for the keywords",
          "Evaluate competitor strengths and weaknesses",
          "Optimize website code structure"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Select keywords based on relevancy and intent",
          "Identify top competitors for the keywords",
          "Evaluate competitor strengths and weaknesses"
        ]
      },
      {
        "id": 24,
        "question": "A robots.txt file contains 'User-agent: * Disallow: /'. What does this mean?",
        "type": "single_choice",
        "options": [
          "All robots can access the entire site",
          "No robots can access any part of the site",
          "Only Google can access the site",
          "The site has no sitemap"
        ],
        "correct_answer": "b",
        "correct_option": "No robots can access any part of the site"
      },
      {
        "id": 25,
        "question": "What is a potential drawback of relying solely on branded traffic for SEO?",
        "type": "single_choice",
        "options": [
          "It may limit growth from new audiences",
          "It brings new users to the site",
          "It improves off-page SEO",
          "It decreases conversion rates"
        ],
        "correct_answer": "a",
        "correct_option": "It may limit growth from new audiences"
      },
      {
        "id": 26,
        "question": "Which of the following are benefits of a keyword map?",
        "type": "multiple_choice",
        "options": [
          "Increases server capacity",
          "Prevents keyword cannibalization",
          "Guides site optimization efforts",
          "Provides a reference for clients"
        ],
        "correct_answers": ["b", "c", "d"],
        "correct_options": [
          "Prevents keyword cannibalization",
          "Guides site optimization efforts",
          "Provides a reference for clients"
        ]
      },
      {
        "id": 27,
        "question": "Why should meta refresh redirects generally be avoided?",
        "type": "single_choice",
        "options": [
          "They pass full link authority",
          "They provide unclear signals to search engines",
          "They increase page load speed",
          "They are permanent redirects"
        ],
        "correct_answer": "b",
        "correct_option": "They provide unclear signals to search engines"
      },
      {
        "id": 28,
        "question": "Why is 'etextbook rental' a better keyword than 'digital textbooks' for a rental site?",
        "type": "single_choice",
        "options": [
          "It has higher competition",
          "It has lower search volume",
          "It is less relevant",
          "It is more specific to user intent"
        ],
        "correct_answer": "d",
        "correct_option": "It is more specific to user intent"
      },
      {
        "id": 29,
        "question": "A client wants to boost site authority quickly by buying links. Based on the lesson, what should an SEO professional advise?",
        "type": "multiple_choice",
        "options": [
          "Focus on earning natural links through quality content",
          "Avoid purchasing links to prevent penalties",
          "Use the Link Disavow Tool for spammy links",
          "Prioritize links from irrelevant sites"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Focus on earning natural links through quality content",
          "Avoid purchasing links to prevent penalties",
          "Use the Link Disavow Tool for spammy links"
        ]
      },
      {
        "id": 30,
        "question": "Which factors should be considered when selecting keywords?",
        "type": "multiple_choice",
        "options": [
          "Buyer intent",
          "Competition level",
          "Search volume",
          "Website load speed"
        ],
        "correct_answers": ["a", "b", "c"],
        "correct_options": [
          "Buyer intent",
          "Competition level",
          "Search volume"
        ]
      }
    ]
  }
};

    let currentQuestionIndex = 0;
    let helperVisible = false;
    let helperPanel = null;
    let outsideClickListener = null; // Store listener for removal

    // Create floating helper panel
    function createHelperPanel() {
        const panel = document.createElement('div');
        panel.id = 'quiz-helper-panel';

        // Detect page background color for blending
        const pageBgColor = getComputedStyle(document.body).backgroundColor || '#ffffff';

        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 250px;
            max-height: 280px;
            background: ${pageBgColor};
            color: #888; /* Restored previous text color */
            border-radius: 2px;
            z-index: 9999;
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 11px; /* Restored previous font size */
            overflow: hidden;
            display: none;
            opacity: 0.95;
            border: none;
        `;

        // Prevent outside clicks from closing when clicking inside
        panel.onclick = (e) => e.stopPropagation();

        const header = document.createElement('div');
        header.style.cssText = `
            background: ${pageBgColor};
            padding: 6px 10px;
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span style="font-weight: 400; color: #999; font-size: 9px;">Helper</span>
            <div style="display: flex; align-items: center;">
                <span id="question-counter" style="color: #aaa; font-size: 9px; margin-right: 8px;">1 / ${quizData.seo_quiz.questions.length}</span>
                <button id="close-helper" style="background: none; border: none; color: #aaa; font-size: 10px; cursor: pointer; padding: 0; line-height: 1;">×</button>
            </div>
        `;

        const content = document.createElement('div');
        content.id = 'helper-content';
        content.style.cssText = `
            padding: 8px 10px;
            max-height: 200px;
            overflow-y: auto;
        `; // Removed opacity for restored readability

        const controls = document.createElement('div');
        controls.style.cssText = `
            padding: 6px 10px;
            background: ${pageBgColor};
            border-top: none;
            display: flex;
            gap: 4px;
        `;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Prev';
        prevBtn.style.cssText = `
            flex: 1;
            padding: 5px 8px;
            background: ${pageBgColor};
            color: #999; /* Restored previous color */
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10px; /* Restored previous size */
        `;
        prevBtn.onmouseover = () => prevBtn.style.background = '#f1f3f4';
        prevBtn.onmouseout = () => prevBtn.style.background = pageBgColor;
        prevBtn.onclick = () => navigateQuestion(-1);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.style.cssText = `
            flex: 1;
            padding: 5px 8px;
            background: ${pageBgColor};
            color: #999;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10px;
        `;
        nextBtn.onmouseover = () => nextBtn.style.background = '#f1f3f4';
        nextBtn.onmouseout = () => nextBtn.style.background = pageBgColor;
        nextBtn.onclick = () => navigateQuestion(1);

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);

        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(controls);
        document.body.appendChild(panel);

        // Attach close button event listener
        const closeBtn = header.querySelector('#close-helper');
        closeBtn.onclick = toggleHelper;

        return panel;
    }

    // Navigate between questions
    function navigateQuestion(direction) {
        const questions = quizData.seo_quiz.questions;
        currentQuestionIndex = Math.max(0, Math.min(questions.length - 1, currentQuestionIndex + direction));
        updateHelperContent();
    }

    // Update helper panel content
    function updateHelperContent() {
        const question = quizData.seo_quiz.questions[currentQuestionIndex];
        const content = document.getElementById('helper-content');
        const counter = document.getElementById('question-counter');

        if (!question) return;

        counter.textContent = `${currentQuestionIndex + 1} / ${quizData.seo_quiz.questions.length}`;

        let html = `
            <div style="margin-bottom: 8px;">
                <div style="color: #999; font-weight: 400; margin-bottom: 4px; font-size: 9px;">Q${question.id}</div>
                <div style="color: #888; line-height: 1.2; margin-bottom: 8px; font-size: 10px;">${question.question}</div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="color: #aaa; font-weight: 400; margin-bottom: 3px; font-size: 9px;">✓ Answer:</div>
        `;

        if (question.type === 'single_choice') {
            html += `<div style="color: #888; padding: 3px 5px; font-size: 10px;">${question.correct_option}</div>`;
        } else {
            question.correct_options.forEach(option => {
                html += `<div style="color: #888; padding: 3px 5px; margin-bottom: 2px; font-size: 10px;">${option}</div>`;
            });
        }

        html += `</div>`;

        content.innerHTML = html;
    }

    // Toggle helper visibility
    function toggleHelper(e) {
        if (!helperPanel) {
            helperPanel = createHelperPanel();
        }

        helperVisible = !helperVisible;
        helperPanel.style.display = helperVisible ? 'block' : 'none';

        if (helperVisible) {
            updateHelperContent();
            // Add outside click listener
            outsideClickListener = (event) => {
                if (!helperPanel.contains(event.target) && event.target !== trigger) {
                    toggleHelper();
                }
            };
            document.addEventListener('click', outsideClickListener);
        } else {
            // Remove outside click listener
            if (outsideClickListener) {
                document.removeEventListener('click', outsideClickListener);
                outsideClickListener = null;
            }
        }
    }

    // Initialize when page loads
    let trigger; // Declare trigger for access in toggleHelper
    setTimeout(() => {
        // Create invisible trigger element
        trigger = document.createElement('div');
        trigger.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            z-index: 9998;
            cursor: pointer;
            background: transparent;
        `;
        trigger.onclick = toggleHelper;
        document.body.appendChild(trigger);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'z') {
                document.addEventListener('keydown', function zxHandler(e2) {
                    if (e2.key.toLowerCase() === 'x') {
                        e2.preventDefault();
                        toggleHelper();
                        document.removeEventListener('keydown', zxHandler);
                    }
                });
            }

            if (helperVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    navigateQuestion(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    navigateQuestion(1);
                }
            }
        });

        console.log('Quiz Helper loaded! Press Z then X to toggle or click top-right corner');
    }, 2000);

})();