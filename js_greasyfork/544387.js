// ==UserScript==
// @name         Torn City Mail Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds mail buttons to user list and auto-fills recruitment messages
// @author       Rosti
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/messages.php*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544387/Torn%20City%20Mail%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/544387/Torn%20City%20Mail%20Assistant.meta.js
// ==/UserScript==

// Script adds mailing button and autoinserting mail on the compose page when sending mail to people in torn.com for easier recruitment
 
(function() {
    'use strict';

    // Configuration for recruitment message
    const recruitmentConfig = {
        subject: "Recruitment 8* PSF",
        message: `<div class="post unreset">
  <p>
    <span style="font-size: 18px;"
      >Hi all! I am hiring for my 8* Private Security Firm, [HIRING] TERRASEC. We dropped a couple stars recently with
      people leaving, but we're making a push back to 10 stars.&nbsp;</span
    >
  </p>
  <p>&nbsp;&nbsp;</p>
  <p>&nbsp;</p>
  <p>
    <strong><span style="font-size: 18px; color: var(--te-text-color-green);">Positions open!</span></strong>
  </p>
  <p>
    <span style="font-size: 18px;"
      >Paying up to&nbsp; <span style="color: var(--te-text-color-green);">$4m/day</span>, depending on stats and EE
      merits.&nbsp;</span
    >
  </p>
  <p>
    <span style="font-size: 18px;"
      >- I provide rotational trains as well as trains buying (split 50/50 between the two)</span
    >
  </p>
  <p>
    <span style="font-size: 18px;"
      >- Drug users are fine as long as you rehab regularly (before -10). If your faction is warring and you're not able
      to rehab, let me know so I can adjust accordingly.</span
    ><br /><span style="font-size: 18px;"
      >- We're at 8* stars (bounty protection, random weapon, flash grenade bonus, 25% armor set bonus)</span
    >
  </p>
  <p>
    <span style="color: var(--te-text-color-red);"
      ><strong><span style="font-size: 18px;">- Competitive pay!</span></strong></span
    >
  </p>
  <p>
    &nbsp; <br /><span style="font-size: 18px;"
      >Message <a href="/profiles.php?XID=1639937">ham432</a> your stats or apply directly:
      <a href="/joblist.php#/p=corpinfo&amp;userID=1639937" target="_blank" rel="noopener"
        >https://www.torn.com/joblist.php#/p=corpinfo&amp;userID=1639937 &nbsp;
        <img
          src="https://cdn.discordapp.com/emojis/1121328618237349938.webp?size=128&amp;animated=true"
          alt="1121328618237349938.webp?size=128&amp;animated=true"
          width="17"
          height="19" /></a
      ><br /><br />Cheers,<br />Rosti
      <a href="https://cdn.discordapp.com/emojis/1039228249391247390.webp?size=128" target="_blank" rel="noopener"
        ><img
          src="https://cdn.discordapp.com/emojis/1039228249391247390.webp?size=128"
          alt="1039228249391247390.webp?size=128"
          width="23"
          height="23" /></a
    ></span>
  </p>
</div>`
    };

    // Check if we're on the user list page
    if (window.location.href.includes('page.php?sid=UserList')) {
        setupUserListObserver();
    }

    // Check if we're on the messages page
    if (window.location.href.includes('messages.php')) {
        handleMessagesPage();
    }

    // Function to set up observer for user list changes
    function setupUserListObserver() {
        // Initial setup
        addUserListMailButtons();

        // Set up observer to handle pagination and dynamic loading
        const observer = new MutationObserver((mutations) => {
            addUserListMailButtons();
        });

        // Start observing the user list container for changes
        const userListContainer = document.querySelector('.userlist-wrapper');
        if (userListContainer) {
            observer.observe(userListContainer, {
                childList: true,
                subtree: true
            });
        }

        // Also observe the entire document for any changes that might affect the user list
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to add mail buttons to user list
    function addUserListMailButtons() {
        const userItems = document.querySelectorAll('.user-info-list-wrap li[class^="user"]');

        userItems.forEach(userItem => {
            const nameLink = userItem.querySelector('.user.name');
            if (!nameLink) return;

            // Skip if we already added a button
            if (nameLink.parentNode.querySelector('.mail-button')) return;

            // Extract user ID from the href
            const href = nameLink.getAttribute('href');
            const userIdMatch = href.match(/XID=(\d+)/);
            if (!userIdMatch) return;

            const userId = userIdMatch[1];

            // Create mail button
            const mailButton = document.createElement('button');
            mailButton.textContent = 'M';
            mailButton.className = 'mail-button';
            mailButton.style.marginLeft = '8px';
            mailButton.style.padding = '2px 6px';
            mailButton.style.backgroundColor = '#4CAF50';
            mailButton.style.color = 'white';
            mailButton.style.border = 'none';
            mailButton.style.borderRadius = '3px';
            mailButton.style.cursor = 'pointer';
            mailButton.style.fontSize = '12px';
            mailButton.style.fontWeight = 'bold';
            mailButton.style.display = 'inline-block';
            mailButton.style.verticalAlign = 'middle';

            // Add hover effect
            mailButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#45a049';
            });
            mailButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#4CAF50';
            });

            // Add click event - open tab in background
            mailButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const mailUrl = `https://www.torn.com/messages.php#/p=compose&XID=${userId}`;
                GM_openInTab(mailUrl, { active: false });
            });

            // Insert button after the name
            nameLink.parentNode.insertBefore(mailButton, nameLink.nextSibling);
        });
    }

    // Function to handle messages page
    function handleMessagesPage() {
        // Check if we're on the compose page
        if (window.location.hash.includes('p=compose')) {
            const autoInjectEnabled = GM_getValue('autoInjectEnabled', true);

            // Create control buttons
            createControlButtons();

            // Auto-inject if enabled
            if (autoInjectEnabled) {
                setTimeout(() => {
                    injectRecruitmentMessage(true, false); // Auto-inject, respect empty check
                }, 1000); // Delay to ensure page is fully loaded
            }
        }
    }

    // Function to create control buttons
    function createControlButtons() {
        // Check if buttons already exist
        if (document.querySelector('.mail-assistant-controls')) return;

        const formContainer = document.querySelector('.compose-form-wrap');
        if (!formContainer) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mail-assistant-controls';
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.marginBottom = '10px';
        buttonContainer.style.clear = 'both';

        // Create toggle auto-inject button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = GM_getValue('autoInjectEnabled', true) ?
            'Disable Auto-Inject' : 'Enable Auto-Inject';
        toggleButton.className = 'torn-btn';
        toggleButton.style.marginRight = '10px';

        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            const currentState = GM_getValue('autoInjectEnabled', true);
            GM_setValue('autoInjectEnabled', !currentState);
            this.textContent = !currentState ? 'Disable Auto-Inject' : 'Enable Auto-Inject';
            showNotification(`Auto-inject ${!currentState ? 'enabled' : 'disabled'}`);
        });

        // Create manual inject button
        const injectButton = document.createElement('button');
        injectButton.textContent = 'Inject Recruitment Message';
        injectButton.className = 'torn-btn';

        injectButton.addEventListener('click', function(e) {
            e.preventDefault();
            injectRecruitmentMessage(false, true); // Manual inject, force inject regardless of content
        });

        buttonContainer.appendChild(toggleButton);
        buttonContainer.appendChild(injectButton);

        // Insert buttons before the message editor
        const messageEditor = document.getElementById('mailbox-wrapper');
        if (messageEditor) {
            formContainer.insertBefore(buttonContainer, messageEditor);
        }
    }

    // Function to check if the editor is empty
    function isEditorEmpty(editor) {
        if (!editor) return true;

        const content = editor.innerHTML.trim();

        // Check for empty editor patterns
        const emptyPatterns = [
            '', // Empty string
            '<p><br data-mce-bogus="1"></p>', // TinyMCE empty state
            '<p></p>', // Empty paragraph
            '<p><br></p>', // Empty paragraph with break
            '<br>' // Just a break
        ];

        return emptyPatterns.includes(content);
    }

    // Function to inject recruitment message
    function injectRecruitmentMessage(isAutoInject, forceInject = false) {
        // Fill subject only if it's empty
        const subjectField = document.querySelector('.subject');
        if (subjectField && !subjectField.value.trim()) {
            subjectField.value = recruitmentConfig.subject;
        }

        // Fill message body
        const messageEditor = document.querySelector('.editor-content.mce-content-body');
        if (messageEditor) {
            // Check if we should inject (either force inject for manual button, or check if empty for auto-inject)
            const shouldInject = forceInject || (isAutoInject && isEditorEmpty(messageEditor));

            if (shouldInject) {
                // Inject the message
                messageEditor.innerHTML = recruitmentConfig.message;

                // Trigger events to ensure the editor recognizes the change
                const inputEvent = new Event('input', { bubbles: true });
                messageEditor.dispatchEvent(inputEvent);

                const changeEvent = new Event('change', { bubbles: true });
                messageEditor.dispatchEvent(changeEvent);

                // Also try to update the hidden input that TinyMCE uses
                const hiddenInput = document.querySelector('input[name="mce_0"]');
                if (hiddenInput) {
                    hiddenInput.value = recruitmentConfig.message;
                }

                showNotification('Recruitment message injected!');
            } else if (!isAutoInject) {
                // This case shouldn't happen with forceInject=true, but keeping for safety
                showNotification('Message already has content. Not overwriting.');
            }
        } else {
            showNotification('Could not find message editor');
        }
    }

    // Function to show notification
    function showNotification(message) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.mail-assistant-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = 'mail-assistant-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.maxWidth = '300px';

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
})();