// ==UserScript==
// @name         Interactive Sidebar Navigator for ChatGPT
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  A user-friendly, interactive sidebar for the ChatGPT official website that does not cover the header, footer, or the scrollbar.
// @description:zh-CN  为ChatGPT官网提供了不遮挡页眉、页脚或滚动条的用户友好、交互性强的侧边栏。
// @license      GPL-3.0-or-later
// @match        https://chat.openai.com/**
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480431/Interactive%20Sidebar%20Navigator%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/480431/Interactive%20Sidebar%20Navigator%20for%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the header and footer heights if known, or estimate
    const headerHeight = '60px'; // Change this value to the actual height of your header
    const footerHeight = '60px'; // Change this value to the actual height of your footer

    // Insert custom styles into the document
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #customSidebar {
            position: fixed;
            top: ${headerHeight};
            bottom: ${footerHeight};
            right: 0;
            width: 250px;
            background-color: #000;
            color: #fff;
            overflow-y: auto;
            overflow-x: hidden;
            transition: transform 0.3s ease-out;
            transform: translateX(250px);
            z-index: 9999;
            box-shadow: -2px 0 5px rgba(0,0,0,0.5);
            padding-bottom: 10px; // Adjusted padding for footer
        }

        #customSidebar div {
            padding: 10px;
            border-bottom: 1px solid #444;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: pointer;
        }

        #customSidebar div.active {
            background-color: #777; // Highlight active item
        }

        /* Tooltip styles */
        .sidebar-tooltip {
            visibility: hidden;
            background-color: #555;
            color: #fff;
            text-align: left;
            border-radius: 5px;
            padding: 5px;
            position: absolute;
            z-index: 10001;
            left: 100%;
            top: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            opacity: 0;
            transition: visibility 0s, opacity 0.5s linear;
        }

        .tooltip {
            visibility: hidden;
            background-color: #555;
            color: #fff;
            text-align: left;
            border-radius: 5px;
            padding: 5px;
            position: absolute;
            z-index: 10001;
            left: 100%;
            margin-left: 10px; // Space between item and tooltip
            white-space: nowrap;
            word-wrap: break-word;
            transition: visibility 0s linear 0.3s, opacity 0.3s linear 0.3s;
            opacity: 0;
            pointer-events: none; // Tooltip should not interfere with mouse events
        }

        .sidebar-item:hover .tooltip {
            visibility: visible;
            opacity: 1;
            transition-delay: 0s;
        }

        .sidebar-tooltip-show {
            visibility: visible;
            opacity: 1;
            transition-delay: 3s; // Delay to show tooltip after 3s of hover
        }
        .sidebar-item:hover::after {
            visibility: visible;
            opacity: 1;
            transition-delay: 0s;
        }

        #tooltipContainer {
            display: none; // Start with the tooltip container not displayed
            position: fixed;
            z-index: 10001;
            pointer-events: none; // Ensure the tooltip does not interfere with mouse events
            transition: opacity 0.3s ease-in-out;
            opacity: 0;
        }

        .visible #tooltipContainer {
            display: block; // Display tooltip container when a tooltip is visible
            opacity: 1;
        }

        #sidebarToggle {
            position: fixed;
            right: 250px;
            top: calc(50% - 20px); // Center toggle vertically, adjusting for its own height
            transform: translateX(100%);
            z-index: 10000;
            cursor: pointer;
            background-color: #444;
            color: #fff;
            border: none;
            width: 30px;
            height: 40px;
            border-radius: 5px 0 0 5px;
            outline: none;
            transition: right 0.3s ease-out, transform 0.3s ease-out;
        }

        .sidebar-icon-bar {
            display: block;
            width: 20px;
            height: 2px;
            background-color: #fff;
            margin: 6px auto;
            transition: background-color 0.3s, transform 0.3s ease-out;
        }

        .toggle-open .top-bar {
            transform: translateY(8px) rotateZ(45deg);
        }

        .toggle-open .middle-bar {
            opacity: 0;
        }

        .toggle-open .bottom-bar {
            transform: translateY(-8px) rotateZ(-45deg);
        }

        body {
            padding-right: 250px; // Make space for the sidebar when it is expanded
        }
        div.sticky.top-0 {
          opacity: 0.3;
        }
    `;

  document.head.appendChild(style);

	let questionAnswerSelector = '.flex-col.gap-1.md\\:gap-3'
	let customSidebarSelector = '#customSidebar > div'
    let questionAnswerLength=2
    let customSidebarLlength=0

  function updateSidebarContent(){
      let elementWithAttribute = document.querySelector(questionAnswerSelector);

      if (elementWithAttribute) {
        sidebar.innerHTML = ''
        console.log('elementWithAttribute exists: update')
      }else{
        console.log('elementWithAttribute not exists')
        // updateSidebarContent()
      }
        const allTextItems = Array.from(document.querySelectorAll(questionAnswerSelector));
        if (allTextItems.length > 0) {
            // observer.disconnect();

            // Populate the sidebar with items
            allTextItems.forEach((item, index) => {
                if (index % 2 === 0) { // Add odd items
                    const div = document.createElement('div');
                    div.textContent = item.textContent.trim() || 'Untitled';
                  // createTooltip(div, div.textContent); // Add tooltip to each item
                    div.setAttribute('title', div.textContent); // Set the title for default browser tooltip



            // Setup mouse events for showing and hiding the tooltip
            let hoverTimeout;
            div.addEventListener('mouseenter', (e) => {
                const rect = div.getBoundingClientRect();
                hoverTimeout = setTimeout(() => {
                    showTooltip(div.textContent, rect.right, rect.top + window.scrollY);
                }, 3000);
            });
            div.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                hideTooltip();
            });

                    div.addEventListener('click', () => {
                        // Scroll to the element on the page
                        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Highlight the active item
                        document.querySelectorAll('#customSidebar div').forEach(d => d.classList.remove('active'));
                        div.classList.add('active');
                    });
                    sidebar.appendChild(div);
                }

            // Adjust sidebar overflow after populating it
            adjustSidebarOverflow();
            });

            // Initially open the sidebar
            sidebar.style.transform = 'translateX(0)';
            toggleButton.classList.add('toggle-open');
            // Adjust the toggle button position
            setToggleButtonPosition();


            const customSidebar = document.getElementById('customSidebar');
            if (customSidebar) {
                const divs = customSidebar.querySelectorAll('div');
                divs.forEach((div, index) => {
                    div.textContent = `${index + 1}: ${div.textContent}`;
                });
            } else {
                console.log('#customSidebar not found');
            }

        }
  }


  // Create a global tooltip container
  const tooltipContainer = document.createElement('div');
  tooltipContainer.id = 'tooltipContainer';
  document.body.appendChild(tooltipContainer);


  // Function to update tooltip content and position
  function showTooltip(text, x, y) {
      tooltipContainer.textContent = text;
      tooltipContainer.style.top = `${y}px`;
      tooltipContainer.style.left = `${x}px`;
      tooltipContainer.classList.add('visible');
  }

  function hideTooltip() {
      tooltipContainer.classList.remove('visible');
  }

    // Create the sidebar element
    const sidebar = document.createElement('div');
    sidebar.id = 'customSidebar';
    document.body.appendChild(sidebar);

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'sidebarToggle';
    toggleButton.innerHTML = `
        <div class="sidebar-icon-bar top-bar"></div>
        <div class="sidebar-icon-bar middle-bar"></div>
        <div class="sidebar-icon-bar bottom-bar"></div>
    `;
    document.body.appendChild(toggleButton);

    // Function to set the correct position of the toggle button
    function setToggleButtonPosition() {
        const isSidebarVisible = sidebar.style.transform === 'translateX(0px)';
        toggleButton.style.right = isSidebarVisible ? '250px' : '0';
        toggleButton.style.transform = `translateX(${isSidebarVisible ? '-100%' : '0'})`;
    }

    // Initial call to set the toggle button position
    setToggleButtonPosition();

    // Toggle functionality
    toggleButton.addEventListener('click', function() {
        const isClosed = sidebar.style.transform.includes('250px');
        sidebar.style.transform = isClosed ? 'translateX(0)' : 'translateX(250px)';
        toggleButton.classList.toggle('toggle-open', isClosed);
        // Wait for the transition to finish before adjusting the toggle button position
        setTimeout(setToggleButtonPosition, 300);
    });


      // Adjust sidebar overflow based on its content height
    function adjustSidebarOverflow() {
        const sidebar = document.getElementById('customSidebar');
        if (sidebar.scrollHeight > sidebar.clientHeight) {
            sidebar.style.overflowY = 'auto';
        } else {
            sidebar.style.overflowY = 'hidden';
        }
    }

  // Observe mutations to the page content
  const observer = new MutationObserver(mutations => {
    questionAnswerLength = document.querySelectorAll(questionAnswerSelector).length/2
    customSidebarLlength = document.querySelectorAll(customSidebarSelector).length
    if (questionAnswerLength == customSidebarLlength){
      console.log(`questionAnswerLength: ${questionAnswerLength} == customSidebarLlength: ${customSidebarLlength}`)
      return
    }
    mutations.forEach(mutation => {
        // Check if the mutation occurs on a form element or its descendants
        let target = mutation.target;
        while (target !== document && target.nodeName !== 'FORM') {
            target = target.parentNode;
        }

        // If the change does not occur on a form element, perform the corresponding action
        if (target.nodeName !== 'FORM') {
            console.log('Performing changes on non-form element');
            console.log('Invoke updateSidebarContent');
            sidebar.innerHTML = '';
            updateSidebarContent();
        }
    });


  });

  // Configuration for the observer
  const config = {
      // attributes: true,       // Listen for attribute changes
      // characterData: true,    // Listen for text content changes
      childList: true,        // Listen for additions/removals of child elements
      subtree: true           // Listen for changes in all descendant nodes
  };


  let checkExist = setInterval(function() {
    // '.flex-col.gap-1.md\\:gap-3'
    // 'div.group.relative.active\\:opacity-90'
     // Find the element to observe (e.g., main content area)
    const observeElement = document.querySelector('main');
    if (observeElement != null) {
      console.log(`observeElement: ${observeElement}`);
      // Start observing mutations
      observer.observe(observeElement, config);
      clearInterval(checkExist);

    }
  }, 1000);


})();
