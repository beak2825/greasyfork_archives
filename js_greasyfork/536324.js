// ==UserScript==
// @name         NAMER SA Activity Quick Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Adds SA Activity Shortcuts to SFDC - Enhanced with buttons in reports and optimized UI
// @author       zellest
// @match        https://aws-crm.lightning.force.com/*
// @match        https://*.my.salesforce.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=force.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536324/NAMER%20SA%20Activity%20Quick%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/536324/NAMER%20SA%20Activity%20Quick%20Buttons.meta.js
// ==/UserScript==
/* global $ */

/**
 * G01	GenAI WL Launched w Verified Outcome	Opportunity Status = Launched (on date x)
Products contains at least 1 of the GenAI services	Activity date > x
SA Type = SA
Tags = 1 tag, must be "G1 2025 ---"
Activity = "Validation of Business Outcome after Launch [Management]"

G02	EBA Participation		Comes from another system

G02	Find One		Type = Opportunity
SA Type = "SA"
Subject contains  "FindOne-Mig"
Activity type in below list

G03	Security and Resilience Engagements	Only 1:1 engagements count (not 1:many)
Make sure you have a description in opportunity.	Task has a description
Tag contains G3 2025
SA Type = SA

G04	Partner Solutions	Opp's Co-Sell Origination Source = Amazon-originated
A partner is attached to the opportunity.
The opportunity is launched	SA Type=SA
Tag contains G4 2025
 Activity = Partner Solution Engagement [Architecture]

 G05	New New Workloads	Status = launched	Activity exists
SA Type = Anything

 */

(function () {
  'use strict';
  const quickButtonConfigs = [
    {
      category: "G1 - Launched Tech Attached Opportunities with Outcomes",
      buttons: [
        {
          name: 'Add G1 Activity before Launch',
          kpi: 'G1 - Tech Activity during Tech Val Stage',
          purposeDescription: `
<table>
<tr><td><b>AGS Goal KPI</b></td><td>50% of launched GenAI/ML & Data tech-attached opportunities with measurable 
outcomes</td></tr>
<tr><td><b>SA Type</b></td><td>SA</td></tr>
<tr><td><b>SA Activity Type</b></td><td>Any</td></tr>
<tr><td><b>Activity Subject</b></td><td>Description of technical validation activity</td></tr>
<tr><td><b>Opportunity Stage during Activity</b></td><td>Technical Validation</td></tr>
<tr><td><b>Required Tags</b></td><td>At least one "G1 2025" activity tag</td></tr>
`,
          saType: 'SA',
          subject: '',
          subject_placeholder: 'Description of technical validation activities',
          activity: 'Validation of Business Outcome after Launch [Management]',
          description: '',
          description_placeholder: 'Details of the validation activities and planned business outcomes',
          tagOptions: ["G1 2025 - Advanced Policy Goals", "G1 2025 - Enhanced Public Value", "G1 2025 - Generated Revenue", "G1 2025 - Improved Accessibility and Equity", "G1 2025 - Improved citizen/constituent experience", "G1 2025 - Improved Customer Satisfaction", "G1 2025 - Improved Efficiency", "G1 2025 - Mitigated Risk", "G1 2025 - Promoted Environmental Stewardship", "G1 2025 - Reduced Cost", "G1 2025 - Strengthened Security and Resilience"]
        },
        {
          name: 'Add G1 Activity after Launch',
          kpi: 'G1 - Validation After Launch',
          purposeDescription: `
<table>
<tr><td><b>AGS Goal KPI</b></td><td>50% of launched GenAI/ML & Data tech-attached opportunities with measurable 
outcomes</td></tr>
<tr><td><b>SA Type</b></td><td>SA</td></tr>
<tr><td><b>SA Activity Type</b></td><td>Validation of Business Outcome after Launch [Management]</td></tr>
<tr><td><b>Activity Subject</b></td><td>Description of customer's business outcome achievement</td></tr>
<tr><td><b>Opportunity Stage during Activity</b></td><td>Launched</td></tr>
<tr><td><b>Required Tags</b></td><td>At least one "G1 2025" activity tag but not the ones with 'without outcomes'</td></tr>
</table>
`,
          saType: 'SA',
          subject: '',
          subject_placeholder: 'Description of outcome validation activity',
          activity: 'Validation of Business Outcome after Launch [Management]',
          description_placeholder: 'Details of the validation activities and planned business outcomes',
          description: '',
          tagOptions: ["G1 2025 - Advanced Policy Goals", "G1 2025 - Enhanced Public Value", "G1 2025 - Generated Revenue", "G1 2025 - Improved Accessibility and Equity", "G1 2025 - Improved citizen/constituent experience", "G1 2025 - Improved Customer Satisfaction", "G1 2025 - Improved Efficiency", "G1 2025 - Mitigated Risk", "G1 2025 - Promoted Environmental Stewardship", "G1 2025 - Reduced Cost", "G1 2025 - Strengthened Security and Resilience"]
        }
      ]
    },
    {
      category: "G2 - FindOne Migration",
      buttons: [
        {
          name: 'Add G2 Activity',
          kpi: 'G2 - Revenue Realization',
          purposeDescription: `<table>
 <tr><td><b>AGS Goal KPI</b></td><td>Track customer migrations based on realized revenue against forecasted spend from MAP 2.0 large migrations (ARR > $500k)</td></tr>
 <tr><td><b>SA Type</b></td><td>SA</td></tr>
 <tr><td><b>SA Activity Type</b></td><td>Tech-celerate Migration [Architecture]</td></tr>
 <tr><td><b>Activity Subject</b></td><td>Find One-Mig</td></tr>
 <tr><td><b>Required Tags</b></td><td>(no specific requirements) Migration spend must be tagged according to MAP tagging requirements to register MAP spend</td></tr>
 </table>
  `, saType: 'SA',
          subject: 'FindOne-Mig',
          activity: 'Tech-celerate Migration [Architecture]',
          description: '',
          subject_placeholder: 'FindOne-Mig',
          description_placeholder: 'Details about the migration activity'
        }
      ]
    },
    {
      category: "G3 - Security and Resilience",
      buttons: [
        {
          name: 'Add G3 Activity',
          kpi: 'G3 - Security and Resilience',
          purposeDescription: `
  <table>
 <tr><td><b>AGS Goal KPI</b></td><td>Drive XX "qualified security/resilience" engagements performed for customers</td></tr>
 <tr><td><b>SA Type</b></td><td>SA or CSM</td></tr>
 <tr><td><b>SA Activity Type</b></td><td>Any appropriate SA Type and Activity related to security/resilience engagements</td></tr>
 <tr><td><b>Activity Subject</b></td><td>Description of the security/resilience engagement performed</td></tr>
 <tr><td><b>Opportunity Stage during Activity</b></td><td>Any stage (not limited to launched opportunities)</td></tr>
 <tr><td><b>Required Tags</b></td><td>G3 2025 tag for the specific qualified engagement performed (e.g., "G3 2025 - Security Health Improvement Program")</td></tr>
 </table>
  `, saType: 'SA',
          activity: 'Account Planning [Management]',
          description: '',
          subject: '',
          subject_placeholder: 'Description of the security/resilience engagement performed',
          description_placeholder: 'Detailed information about the security/resilience activity',
          tagOptions: [
            "G3 2025 - AWS Partner engagement focused on Security or Resiliency - SSR",
            "G3 2025 - AWS Professional Services engagement focused on Security or Resiliency - SSR",
            "G3 2025 - AWS Well-Architected Framework Review (WAFR) - SSR",
            "G3 2025 - Business Impact Analysis (BIA) - SSR",
            "G3 2025 - Customer Chaos GameDay - SSR",
            "G3 2025 - Customer Reliability Profiles - SSR",
            "G3 2025 - Customer School of Resilience (C-SoR) - SSR",
            "G3 2025 - Cyber Resilience Lab (CRL) - SSR",
            "G3 2025 - Driving Resilience: Planning - Execution - Testing (DrPET) - SSR",
            "G3 2025 - ReSCO - SSR",
            "G3 2025 - Resilience Core Program (RCP) - SSR",
            "G3 2025 - Resilience Maturity Assessment (RMA) - SSR",
            "G3 2025 - Security & Compliance Visibility Review (SCVR) - SSR",
            "G3 2025 - Security Foundations Catalyst (SFC) - SSR",
            "G3 2025 - Security Health Improvement Program (SHIP) - SSR",
            "G3 2025 - Security Improvement Program (SIP) - SSR",
            "G3 2025 - Security Journeys - SSR",
            "G3 2025 - Simulated Conditions Response and Management (SCRaM) - SSR",
            "G3 2025 - Threat Modelling - SSR",
            "G3 2025 - TorchLight - SSR"
          ]
        }
      ]
    },
    {
      category: "G4 - Partner Adoption",
      buttons: [
        {
          name: 'Add G4 Activity',
          kpi: 'G4 - Partner Solutions Adoption',
          purposeDescription: `
  <table>
 <tr><td><b>AGS Goal KPI</b></td><td>Drive XX "AWS Originated" launched opportunities with a SA/CSM activity and partner solution</td></tr>
 <tr><td><b>SA Type</b></td><td>SA or CSM</td></tr>
 <tr><td><b>SA Activity Type</b></td><td>"Partner Solution Engagement [Architecture]"</td></tr>
 <tr><td><b>Activity Subject</b></td><td>Description of the partner solution engagement</td></tr>
 <tr><td><b>Opportunity Stage during Activity</b></td><td>Any stage, but must be launched to count towards the goal</td></tr>
 <tr><td><b>Required Tags</b></td><td>No specific tags mentioned, but the opportunity must be AWS Originated and have a partner attached</td></tr>
 </table>
 
 <strong>Additional requirements:</strong>
 <ul style="list-style-type: disc;">  
 <li>The opportunity must have a valid estimated value (not $0, $1, or other placeholders)</li>
 <li>The opportunity products should be listed and accurate</li>
 <li>The opportunity must be launched in 2025 to count towards the goal</li>
 </ul>
  `, saType: 'SA',
          activity: 'Partner Solution Engagement [Architecture]',
          subject: '',
          description: '',
          subject_placeholder: 'Description of the partner solution engagement',
          description_placeholder: 'Details about the partner solution, including partner name, solution components, and use case if available'
        }
      ]
    },
    {
      category: "Other Activities",
      buttons: [
        {
          name: 'Add GenAI Pathway Reference Activity',
          purposeDescription: `
Tagging usage of the <a href="https://w.amazon.com/bin/view/AWS/AGSTech/NAMERTechOrg/Industry-Pathways/GenAI/">NAMER GenAI Pathway wiki</a>. Once this activity is added, request a phonetool icon for being a 'NAMER GenAI Pathway Adopter'`,
          title: 'Click to add an activity for researching use cases or resources in the NAMER GenAI Pathway wiki',
          saType: 'SA',
          activity: 'Account Planning [Management]',
          subject: 'Researched the #namer-genai-pathway wiki',
          description: '',
          subject_placeholder: 'Researched the #namer-genai-pathway wiki',
          description_placeholder: 'Which pathways did you use and how did they help?'
        }
      ]
    }
  ];

  // Create container for our buttons if it doesn't exist
  /* function createButtonContainer() {
    const existingContainer = document.getElementById('tampermonkey_button_container');
    if (existingContainer) return existingContainer;

    const container = document.createElement('div');
    container.id = 'tampermonkey_button_container';
    container.style.padding = '10px';
    container.style.marginBottom = '10px';
    container.style.borderBottom = '1px solid #ddd';

    // Find a good place to insert our container
    const targetElement = document.querySelector('.panel-header');
    if (targetElement) {
      targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
    } else {
      document.querySelector('.slds-utility-panel__body').prepend(container);
    }

    return existingContainer;
  } */

  // Static variable to store selected tags
  const selectedTagsTracker = {
    tags: [],
    addTag: function (tag) {
      if (tag && !this.tags.includes(tag)) {
        this.tags.push(tag);
        console.log('Added tag to tracker:', tag);
        console.log('Current tags:', this.tags);
      }
    },
    removeTag: function (tag) {
      const index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
        console.log('Removed tag from tracker:', tag);
        console.log('Current tags:', this.tags);
      }
    },
    reset: function () {
      this.tags = [];
      console.log('Reset tags tracker');
    },
    getTagsString: function () {
      return this.tags.join(', ');
    }
  };

  // Modal management functions
  function createDefinitionModal(content, title) {
    // Remove any existing modal
    const existingModal = document.getElementById('definition_modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'definition_modal';
    modal.className = 'slds-modal slds-fade-in-open';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9005';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid #dddbda';
    modal.style.borderRadius = '4px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    modal.style.width = '800px'; // Increased width from 600px
    modal.style.maxWidth = '90vw';
    modal.style.maxHeight = '80vh';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.overflow = 'hidden';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.cursor = 'default';

    // Create modal header
    const header = document.createElement('div');
    header.className = 'slds-modal__header';
    header.style.padding = '1rem';
    header.style.borderBottom = '1px solid #dddbda';
    header.style.backgroundColor = '#f3f2f2';
    header.style.cursor = 'move'; // Indicate draggable area
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    // Create title
    const titleElement = document.createElement('h2');
    titleElement.className = 'slds-text-heading_medium';
    titleElement.textContent = title || 'Goal Definition';
    titleElement.style.fontWeight = 'bold';
    titleElement.style.fontSize = '1.1rem'; // Reduced text size
    header.appendChild(titleElement);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'slds-button slds-button_icon';
    closeButton.innerHTML = '&times;';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.lineHeight = '1rem';
    closeButton.style.padding = '0';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => modal.remove();
    header.appendChild(closeButton);

    // Create modal body
    const body = document.createElement('div');
    body.className = 'slds-modal__content';
    body.style.padding = '1.5rem';
    body.style.overflowY = 'auto';
    body.style.maxHeight = 'calc(80vh - 120px)';
    body.style.lineHeight = '1.5';

    // Add CSS for tables in the modal
    const tableStyles = document.createElement('style');
    tableStyles.textContent = `
      #definition_modal table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }
      #definition_modal td, #definition_modal th {
        padding: 12px 16px;
        text-align: left;
        border: 1px solid #dddbda;
      }
      #definition_modal tr td:first-child {
        background-color: #f3f2f2;
        font-weight: bold;
        width: 200px;
        vertical-align: top;
      }
    `;
    document.head.appendChild(tableStyles);

    // Set content - handle HTML if present
    body.innerHTML = content;

    // Add the elements to the modal
    modal.appendChild(header);
    modal.appendChild(body);

    // Add modal to the body
    document.body.appendChild(modal);

    // Add overlay behind modal
    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'modal_backdrop';
    modalBackdrop.className = 'slds-backdrop slds-backdrop_open';
    modalBackdrop.style.position = 'fixed';
    modalBackdrop.style.top = '0';
    modalBackdrop.style.left = '0';
    modalBackdrop.style.right = '0';
    modalBackdrop.style.bottom = '0';
    modalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    modalBackdrop.style.zIndex = '9000';
    modalBackdrop.onclick = () => {
      modal.remove();
      modalBackdrop.remove();
      document.head.removeChild(tableStyles);
    };
    document.body.appendChild(modalBackdrop);

    // Update close button to also remove backdrop
    closeButton.onclick = () => {
      modal.remove();
      modalBackdrop.remove();
      document.head.removeChild(tableStyles);
    };

    // Make the modal draggable
    makeDraggable(modal, header);

    return modal;
  }

  // Function to make an element draggable
  function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (handle) {
      // If a handle is provided, the handle is what initiates the drag
      handle.onmousedown = dragMouseDown;
    } else {
      // Otherwise, the element itself initiates the drag
      element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // Call a function whenever the cursor moves
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Set the element's new position
      const rect = element.getBoundingClientRect();
      element.style.top = (rect.top - pos2) + "px";
      element.style.left = (rect.left - pos1) + "px";
      element.style.transform = 'none'; // Remove the initial centering transform
    }

    function closeDragElement() {
      // Stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // Create a button with the given configuration
  function createButton(config) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.margin = '0 5px 5px 0'; // Adjusted margins
    buttonContainer.style.flexGrow = '1';
    buttonContainer.style.minWidth = '120px';

    const button = document.createElement('button');
    button.textContent = config.name;

    // If it has activity options, show a dropdown
    if (config.activityOptions && config.activityOptions.length > 0) {
      button.addEventListener('click', (event) => showActivityDropdown(event, config));
    }
    // If it has tag options, show a tag dropdown
    else if (config.tagOptions && config.tagOptions.length > 0) {
      button.addEventListener('click', (event) => showTagDropdown(event, config));
    }
    else {
      button.addEventListener('click', () => applyValues(config));
    }
    if (config.title) {
      button.title = config.title;
    }

    // Base styling for main button
    button.style.backgroundColor = 'white';
    button.style.border = '1px solid #0070d2';
    button.style.borderRadius = '4px';
    button.style.padding = '6px 8px';
    button.style.fontSize = '0.8rem';
    button.style.color = '#0070d2';
    button.style.fontWeight = '400';
    button.style.cursor = 'pointer';
    button.style.textAlign = 'center';
    button.style.transition = 'background-color 0.2s ease';

    // Hover effect
    button.onmouseover = function () {
      this.style.backgroundColor = '#f4f6f9';
    };
    button.onmouseout = function () {
      this.style.backgroundColor = 'white';
    };

    // If this configuration has a purpose description, add a "Show Definition" button
    if (config.purposeDescription && config.purposeDescription.trim()) {
      // Create a wrapper for button and info icon to create a button group
      const buttonWrapper = document.createElement('div');
      buttonWrapper.style.display = 'flex';
      buttonWrapper.style.flexDirection = 'row';
      buttonWrapper.style.alignItems = 'stretch'; // Make children stretch to same height
      buttonWrapper.style.justifyContent = 'center';
      buttonWrapper.style.borderRadius = '4px'; // Same as button border radius
      buttonWrapper.style.overflow = 'hidden'; // Prevent child buttons from spilling out
      buttonWrapper.style.width = '100%';

      // Style the main button for left side of the group
      button.style.borderRadius = '4px 0 0 4px'; // Round only left corners
      button.style.borderRight = 'none'; // No border between buttons
      button.style.position = 'relative'; // For proper z-index stacking
      button.style.zIndex = '1'; // Ensure it's above any neighboring elements
      button.style.flexGrow = '1'; // Let the main button take most of the space

      const showDefButton = document.createElement('button');
      showDefButton.title = 'Show Definition';
      showDefButton.innerHTML = 'ⓘ'; // Info icon

      // Style the info button for right side of the group with inverse colors
      showDefButton.style.height = 'auto'; // Match button height
      showDefButton.style.width = '24px'; // Fixed width
      showDefButton.style.padding = '0';
      showDefButton.style.borderRadius = '0 4px 4px 0'; // Round only right corners
      showDefButton.style.backgroundColor = 'white'; // Inverse of brand button
      showDefButton.style.border = '1px solid #0070d2'; // Same border color
      showDefButton.style.borderLeft = 'none'; // No left border to connect to main button
      showDefButton.style.color = '#0070d2'; // Brand blue color for the icon
      showDefButton.style.position = 'relative'; // For proper z-index stacking
      showDefButton.style.marginLeft = '-1px'; // Ensure buttons touch by overlapping borders
      showDefButton.style.zIndex = '0'; // Behind the main button
      showDefButton.style.fontSize = '14px';
      showDefButton.style.fontWeight = 'bold';
      showDefButton.style.cursor = 'pointer';

      // Hover effect for info button
      showDefButton.onmouseover = function () {
        this.style.backgroundColor = '#f4f6f9';
      };
      showDefButton.onmouseout = function () {
        this.style.backgroundColor = 'white';
      };

      showDefButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        // Use the kpi value for the modal header if available, otherwise use the button name
        const modalTitle = config.kpi || config.name;
        createDefinitionModal(config.purposeDescription, modalTitle + ' - Definition');
      });

      // Add both elements to the wrapper
      buttonWrapper.appendChild(button);
      buttonWrapper.appendChild(showDefButton);

      // Add the wrapper to the container
      buttonContainer.appendChild(buttonWrapper);
    } else {
      // If no definition, just add the button directly
      button.style.width = '100%';
      buttonContainer.appendChild(button);
    }

    return buttonContainer;
  }

  // Function to show dropdown of activity options
  function showActivityDropdown(event, config) {
    // Prevent event bubbling
    event.stopPropagation();

    // Remove any existing dropdown
    const existingDropdown = document.getElementById('activity_dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.id = 'activity_dropdown';
    dropdown.className = 'slds-dropdown slds-dropdown_left';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '9002';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #dddbda';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 2px 3px 0 rgba(0, 0, 0, 0.16)';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';

    // Create dropdown list
    const dropdownList = document.createElement('ul');
    dropdownList.className = 'slds-dropdown__list';
    dropdownList.setAttribute('role', 'menu');

    // Add dropdown items
    config.activityOptions.forEach(activity => {
      const item = document.createElement('li');
      item.className = 'slds-dropdown__item';
      item.setAttribute('role', 'presentation');

      const anchor = document.createElement('a');
      anchor.setAttribute('role', 'menuitem');
      anchor.setAttribute('tabindex', '0');
      anchor.className = 'slds-truncate';
      anchor.style.padding = '0.5rem 0.75rem';
      anchor.style.display = 'block';
      anchor.textContent = activity;

      // When clicking on an option, apply values with the selected activity
      anchor.addEventListener('click', () => {
        const newConfig = { ...config, activity: activity };
        applyValues(newConfig);
        dropdown.remove();
      });

      item.appendChild(anchor);
      dropdownList.appendChild(item);
    });

    dropdown.appendChild(dropdownList);

    // Position dropdown under the button
    const rect = event.target.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    // Calculate dropdown width and height (approximate)
    const dropdownWidth = 250;
    const dropdownMaxHeight = 500; // Max height, actual may be less

    // Default position below the button
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    // Check for right edge overflow
    if (left + dropdownWidth > viewportWidth) {
      left = Math.max(5, viewportWidth - dropdownWidth - 10);
    }

    // Check for bottom edge overflow
    if (top + dropdownMaxHeight > viewportHeight + window.scrollY) {
      // Position above the button if there's not enough space below
      top = Math.max(5 + window.scrollY, rect.top + window.scrollY - dropdownMaxHeight - 5);
    }

    // Apply calculated position
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;

    // Add dropdown to page
    document.body.appendChild(dropdown);

    // Close dropdown when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== event.target) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 0);
  }

  // Function to show dropdown of tag options
  function showTagDropdown(event, config) {
    // Prevent event bubbling
    event.stopPropagation();

    // Remove any existing dropdown
    const existingDropdown = document.getElementById('tag_dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.id = 'tag_dropdown';
    dropdown.className = 'slds-dropdown slds-dropdown_left';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '9002';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #dddbda';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 2px 3px 0 rgba(0, 0, 0, 0.16)';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.width = '350px';

    // Create dropdown list
    const dropdownList = document.createElement('ul');
    dropdownList.className = 'slds-dropdown__list';
    dropdownList.setAttribute('role', 'menu');

    // Add dropdown items
    config.tagOptions.forEach(tag => {
      const item = document.createElement('li');
      item.className = 'slds-dropdown__item';
      item.setAttribute('role', 'presentation');

      const anchor = document.createElement('a');
      anchor.setAttribute('role', 'menuitem');
      anchor.setAttribute('tabindex', '0');
      anchor.className = 'slds-truncate';
      anchor.style.padding = '0.5rem 0.75rem';
      anchor.style.display = 'block';
      anchor.textContent = tag;

      // When clicking on an option, apply values with the selected tag
      anchor.addEventListener('click', () => {
        const newConfig = { ...config, tag: tag };
        applyValues(newConfig);
        dropdown.remove();
      });

      item.appendChild(anchor);
      dropdownList.appendChild(item);
    });

    dropdown.appendChild(dropdownList);

    // Position dropdown under the button
    const rect = event.target.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    // Calculate dropdown width and height (approximate)
    const dropdownWidth = 250;
    const dropdownMaxHeight = 500; // Max height, actual may be less

    // Default position below the button
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    // Check for right edge overflow
    if (left + dropdownWidth > viewportWidth) {
      left = Math.max(5, viewportWidth - dropdownWidth - 10);
    }

    // Check for bottom edge overflow
    if (top + dropdownMaxHeight > viewportHeight + window.scrollY) {
      // Position above the button if there's not enough space below
      top = Math.max(5 + window.scrollY, rect.top + window.scrollY - dropdownMaxHeight - 5);
    }

    // Apply calculated position
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;

    // Add dropdown to page
    document.body.appendChild(dropdown);

    // Close dropdown when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== event.target) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 0);
  }
  // Set the SA Type value
  async function setSAType(value) {
    try {
      // Find the SA Type combobox button and click it
      const saTypeButton = document.querySelector('lightning-combobox[c-btsedittasklwc_btsedittasklwc] button[aria-label="SA Type"]');
      if (!saTypeButton) throw new Error('SA Type button not found');

      saTypeButton.click();

      // Wait for dropdown to appear
      await waitForElement(document, 'div[part="dropdown overlay"][aria-label="SA Type"] lightning-base-combobox-item');

      // Find the option with the matching text
      const options = document.querySelectorAll('div[part="dropdown overlay"][aria-label="SA Type"] lightning-base-combobox-item');
      let found = false;

      for (const option of options) {
        const optionText = option.textContent ? option.textContent.trim() : option.innerText.trim();
        if (optionText === value) {
          option.click();
          found = true;
          break;
        }
      }

      if (!found) {
        console.warn(`SA Type value "${value}" not found in dropdown`);
      }

      return found;
    } catch (error) {
      console.error('Error setting SA Type:', error);
      return false;
    }
  }

  // Set the SA Type value
  async function setSAType2(value) {
    try {
      // Find the SA Type combobox button and click it
      const saTypeForAttribute = await getForAttributeFromLabel('SA Type');
      console.log('found saTypeForAttribute', saTypeForAttribute);
      //if (!saTypeButton) throw new Error('SA Type button not found');
      if (saTypeForAttribute) {
        const saTypeInput = document.getElementById(saTypeForAttribute);
        const dropdown = document.getElementById(saTypeInput.getAttribute('aria-controls'));
        if (dropdown) {
          console.log('found dropdown', dropdown);
          for (const item of dropdown.querySelectorAll('lightning-base-combobox-item')) {
            if (item.getAttribute('data-value') === value) {
              item.click();
              item.setAttribute('aria-selected', 'true');
              item.setAttribute('aria-checked', 'true');
              return true;
            }
            else {
              item.setAttribute('aria-selected', 'false');
              item.setAttribute('aria-checked', 'false');
            }
          }

        }
      }
    } catch (error) {
      console.error('Error setting SA Type:', error);
      return false;
    }
  }

  // Set the Activity value
  async function setActivity(value) {
    try {
      let activityInput = document.querySelector('input[placeholder="Search for SA Activity..."]');
      console.log('activityInput', activityInput);
      if (value && activityInput) {
        const success = await setInputValue(activityInput, value, false, `li[data-id="${value}"]`);
        if (success) {
          console.log('success setting activity to', value);
          return true;
        }
        else {
          console.log('failed to set activity to', value);
        }
      }
      else if (!value && activityInput) {
        try {
          await setInputValue(activityInput, value, true);
          return true;
        }
        catch (error) {
          console.error('Error setting activity input:', error);
        }
      }
      else {
        console.log('no activity input found');
      }
      return false;
    }
    catch (error) {
      console.error('Error setting Activity:', error);
      return false;
    }
  }

  // Function to set the Description field
  async function setDescriptionFieldValue(value) {
    try {
      console.log('Setting Description field to:', value);

      // Try to find the description textarea
      let descriptionTextarea = document.querySelector('textarea[name="description"]');

      // If not found by name, try other common attributes
      if (!descriptionTextarea) {
        descriptionTextarea = document.querySelector('textarea[id*="description"]');
      }

      // If still not found, try to find by label
      if (!descriptionTextarea) {
        const descriptionLabels = Array.from(document.querySelectorAll('label')).filter(label =>
          (label.textContent && label.textContent.includes('Description')) ||
          (label.innerText && label.innerText.includes('Description'))
        );

        if (descriptionLabels.length > 0) {
          const descriptionId = descriptionLabels[0].getAttribute('for');
          if (descriptionId) {
            descriptionTextarea = document.getElementById(descriptionId);
          }

          if (!descriptionTextarea) {
            const container = descriptionLabels[0].closest('.slds-form-element');
            if (container) {
              descriptionTextarea = container.querySelector('textarea');
            }
          }
        }
      }

      if (!descriptionTextarea) {
        console.warn('Description textarea not found');
        return false;
      }

      // Use the property setter to avoid form submission
      const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
      ).set;
      nativeTextareaValueSetter.call(descriptionTextarea, value);

      // Create and dispatch input event
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true
      });
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true
      });
      descriptionTextarea.dispatchEvent(changeEvent);

      console.log('Successfully set Description field to:', value);
      return true;
    } catch (error) {
      console.error('Error setting Description field:', error);
      return false;
    }
  }

  function showAlert(message, header, clear = false, messageId = null) {
    try {
      // Remove any existing tags alert
      if (messageId) {
        const existingAlert = document.getElementById('message_alert' + messageId);
        if (existingAlert && clear) {
          existingAlert.remove();
        }
      }



      // Create alert message with message
      if (message) {
        let alertMessage = '<span style="font-weight: bold;">' + header + ':</span><br/>';
        alertMessage += message;
        // Create temporary alert element
        const alertMessageElement = document.createElement('div');
        alertMessageElement.id = 'message_alert' + messageId;
        alertMessageElement.style.position = 'fixed';
        alertMessageElement.style.bottom = '90px';
        alertMessageElement.style.left = '40px';
        alertMessageElement.style.zIndex = '9999';
        alertMessageElement.style.padding = '12px 20px';
        alertMessageElement.style.borderRadius = '4px';
        alertMessageElement.style.backgroundColor = '#006dcc'; // Salesforce blue
        alertMessageElement.style.color = 'white';
        alertMessageElement.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
        alertMessageElement.style.fontFamily = 'Salesforce Sans, Arial, sans-serif';
        alertMessageElement.style.fontSize = '0.875rem';
        alertMessageElement.style.maxWidth = '80%';
        alertMessageElement.style.transition = 'opacity 0.5s';
        alertMessageElement.style.opacity = '0';

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0 5px';
        closeButton.onclick = function () {
          alertMessageElement.remove();
        };

        alertMessageElement.innerHTML = alertMessage;
        alertMessageElement.appendChild(closeButton);

        // Add to the document
        document.body.appendChild(alertMessageElement);

        // Fade in
        setTimeout(() => {
          alertMessageElement.style.opacity = '1';
        }, 10);

        // Auto-remove after 5 seconds
        setTimeout(() => {
          alertMessageElement.style.opacity = '0';
          setTimeout(() => {
            if (alertMessageElement.parentNode) {
              alertMessageElement.parentNode.removeChild(alertMessageElement);
            }
          }, 500); // Remove after fade out completes
        }, 5000);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating alert message:', error);
      return false;
    }
  }

  // Function to create and update a label showing the currently selected tags
  function updateTagsLabel(clear = false) {
    try {
      // Remove any existing tags alert
      const existingAlert = document.getElementById('selected_tags_alert');
      if (existingAlert) {
        existingAlert.remove();
      }

      if (clear) {
        selectedTagsTracker.reset();
        return;
      }

      // Get tags from the tracker or try to find them in the DOM as backup
      let tagNames = [];

      // If the tracker has tags, use those
      if (selectedTagsTracker.tags.length > 0) {
        tagNames = [...selectedTagsTracker.tags];
      } else {
        // Fallback to finding tags in the DOM
        const tagPills = document.querySelectorAll('span.slds-pill__label');
        console.log('tagPills from DOM', tagPills);

        if (tagPills && tagPills.length > 0) {
          tagNames = Array.from(tagPills).map(pill => {
            const pillText = pill ? (pill.textContent ? pill.textContent.trim() : pill.innerText.trim()) : '';
            if (pillText && !selectedTagsTracker.tags.includes(pillText)) {
              selectedTagsTracker.addTag(pillText);
            }
            return pillText;
          }).filter(Boolean);
        }
      }

      if (tagNames.length > 0) {
        // Create alert message with selected tags
        let alertMessage = '<span style="font-weight: bold;">Selected Tags:</span><br/>';
        alertMessage += tagNames.join('<br/>');

        // Create temporary alert element
        const tagsAlert = document.createElement('div');
        tagsAlert.id = 'selected_tags_alert';
        tagsAlert.style.position = 'fixed';
        tagsAlert.style.bottom = '90px';
        tagsAlert.style.left = '40px';
        tagsAlert.style.zIndex = '9999';
        tagsAlert.style.padding = '12px 20px';
        tagsAlert.style.borderRadius = '4px';
        tagsAlert.style.backgroundColor = '#006dcc'; // Salesforce blue
        tagsAlert.style.color = 'white';
        tagsAlert.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
        tagsAlert.style.fontFamily = 'Salesforce Sans, Arial, sans-serif';
        tagsAlert.style.fontSize = '0.875rem';
        tagsAlert.style.maxWidth = '80%';
        tagsAlert.style.transition = 'opacity 0.5s';
        tagsAlert.style.opacity = '0';

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0 5px';
        closeButton.onclick = function () {
          tagsAlert.remove();
        };

        tagsAlert.innerHTML = alertMessage;
        tagsAlert.appendChild(closeButton);

        // Add to the document
        document.body.appendChild(tagsAlert);

        // Fade in
        setTimeout(() => {
          tagsAlert.style.opacity = '1';
        }, 10);

        // Auto-remove after 5 seconds
        setTimeout(() => {
          tagsAlert.style.opacity = '0';
          setTimeout(() => {
            if (tagsAlert.parentNode) {
              tagsAlert.parentNode.removeChild(tagsAlert);
            }
          }, 500); // Remove after fade out completes
        }, 5000);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating tags alert:', error);
      return false;
    }
  }

  // Add a tag
  async function addTag(value) {
    try {
      // Find the "Add tags" button and click it
      const addTagsButton = Array.from(document.querySelectorAll('lightning-button button'))
        .find(button => button.textContent.trim() === 'Add tags');
      console.log('addTagsButton', addTagsButton);

      if (!addTagsButton) return false;
      addTagsButton.click();

      const addButtons = document.querySelector('.slds-is-open').querySelectorAll('input[type="checkbox"]')
      addButtons.forEach(addButton => {
        console.log('addButton', addButton.value);
        addButton.addEventListener('click', () => {
          console.log('tag add button clicked');
          setTimeout(() => {
            updateTagsLabel();
          }, 500);
        });
      });

      let tagItem = await waitForElement(document, `lightning-input[data-id="${value}"] lightning-primitive-input-checkbox-button`);
      if (tagItem) {
        tagItem.shadowRoot.children[0].children[0].click();
        tagItem.shadowRoot.children[0].children[0].checked = true;

        // Add the tag to our tracker
        selectedTagsTracker.addTag(value);

        // Click the Save button
        setTimeout(async () => {
          let buttons = document.querySelectorAll('button');
          // Update the tags label after adding tags
          updateTagsLabel();
          for (let button of buttons) {
            if (button.textContent.trim() === 'Back' || button.innerText.trim() === 'Back') {
              button.click();
              break;
            }
          }

        }, 500);
      }
      if (!tagItem) {
        console.warn(`Tag "${value}" not found in search results`);
        // Close the modal by clicking the cancel button
        let buttons = document.querySelectorAll('button');
        for (let button of buttons) {
          if (button.textContent.trim() === 'Back' || button.innerText.trim() === 'Back') {
            button.click();
            break;
          }
        }
        return false;
      }

      // Click the Save button


      return true;
    } catch (error) {
      console.error('Error adding tag:', error);
      return false;
    }
  }

  // Function to clear all form fields before setting new values
  async function clearFormFields() {
    try {
      console.log('Clearing all form fields...');
      clearInterval(interval);
      // Clear all pill tags by clicking remove buttons
      /*  const pillRemoveButtons = document.querySelectorAll('.slds-pill__remove button');
      console.log('pillRemoveButtons', pillRemoveButtons);
      for (const removeButton of pillRemoveButtons) {
        try {
          removeButton.click();
          console.log('Clicked tag remove button');
          setTimeout(()=>{}, 100); // Small delay between clicks
          updateTagsLabel();  
          
          } catch (err) {
          console.error('Error clicking pill remove button:', err);
        }
      } */

      // Update the tags label after clearing tags
      //updateTagsLabel();

      /* // Clear SA Type by setting to empty/default
      const saTypeButton = document.querySelector('button[aria-label="SA Type"][role="combobox"]');
      if (saTypeButton) {
        try {
          // Click to open dropdown
          saTypeButton.click();
          // Wait for dropdown
          await new Promise(resolve => setTimeout(resolve, 300));
          // Select the first (empty/default) option if available
          const defaultOption = document.querySelector('lightning-base-combobox-item:first-child');
          if (defaultOption) {
            defaultOption.click();
            console.log('Reset SA Type to default');
          }
        } catch (err) {
          console.error('Error resetting SA Type:', err);
        }
      } */

      updateTagsLabel(true);

      // Clear Activity input
      const activityInput = document.querySelector('lightning-input[data-id="saActivityInput"] input');
      if (activityInput) {
        try {
          setInputValue(activityInput, '', true);
          console.log('Cleared Activity input');
        } catch (err) {
          console.error('Error clearing Activity input:', err);
        }
      }

      // Clear Subject field
      const subjectLabels = Array.from(document.querySelectorAll('label')).filter(label =>
        (label.textContent && label.textContent.includes('Subject')) ||
        (label.innerText && label.innerText.includes('Subject'))
      );
      if (subjectLabels.length > 0) {
        const subjectId = subjectLabels[0].getAttribute('for');
        if (subjectId) {
          const subjectInput = document.getElementById(subjectId);
          if (subjectInput) {
            setInputValue(subjectInput, '', true);
            console.log('Cleared Subject input');
          }
        }
      }

      // Clear Description field
      const descriptionTextarea = document.querySelector('textarea[id*="description"]');
      if (descriptionTextarea) {
        try {
          const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
          ).set;
          nativeTextareaValueSetter.call(descriptionTextarea, '');
          descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
          descriptionTextarea.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('Cleared Description textarea');
        } catch (err) {
          console.error('Error clearing Description textarea:', err);
        }
      }

      console.log('Finished clearing all form fields');
      return true;
    } catch (error) {
      console.error('Error in clearFormFields:', error);
      return false;
    }
  }

  // Function to show an overlay message on the New SA/CSM Activity panel
  function showPanelOverlayMessage(message, durationMs = 5000) {
    try {
      // Remove any existing overlay
      const existingOverlay = document.getElementById('panel_overlay_message');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Find the panel element
      const panel = document.querySelector('.slds-utility-panel');
      if (!panel) {
        console.warn('Panel not found, cannot show overlay message');
        return false;
      }

      // Get panel dimensions and position
      const panelRect = panel.getBoundingClientRect();

      // Create overlay element
      const overlay = document.createElement('div');
      overlay.id = 'panel_overlay_message';
      overlay.style.position = 'absolute';
      overlay.style.top = `${panelRect.top}px`;
      overlay.style.left = `${panelRect.left}px`;
      overlay.style.width = `${panelRect.width}px`;
      overlay.style.height = `${panelRect.height}px`;
      overlay.style.backgroundColor = 'rgba(0, 109, 204, 0.9)'; // Salesforce blue with opacity
      overlay.style.color = 'white';
      overlay.style.zIndex = '9999';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.padding = '20px';
      overlay.style.textAlign = 'center';
      overlay.style.fontFamily = 'Salesforce Sans, Arial, sans-serif';
      overlay.style.transition = 'opacity 0.3s';
      overlay.style.opacity = '0';
      overlay.style.borderRadius = '4px';

      // Create message element
      const messageElement = document.createElement('div');
      messageElement.style.fontSize = '16px';
      messageElement.style.fontWeight = 'bold';
      messageElement.style.marginBottom = '15px';
      messageElement.style.lineHeight = '1.5';
      messageElement.innerHTML = message;

      // Create close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'OK';
      closeButton.style.marginTop = '15px';
      closeButton.style.padding = '8px 16px';
      closeButton.style.backgroundColor = 'white';
      closeButton.style.color = '#006dcc';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.fontWeight = 'bold';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = function () {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      };

      // Add elements to overlay
      overlay.appendChild(messageElement);
      overlay.appendChild(closeButton);

      // Add overlay to the document
      document.body.appendChild(overlay);

      // Fade in
      setTimeout(() => {
        overlay.style.opacity = '1';
      }, 10);

      // Auto-remove after specified duration
      if (durationMs > 0) {
        setTimeout(() => {
          if (overlay && document.body.contains(overlay)) {
            overlay.style.opacity = '0';
            setTimeout(() => {
              if (overlay && document.body.contains(overlay)) {
                overlay.remove();
              }
            }, 300);
          }
        }, durationMs);
      }

      return true;
    } catch (error) {
      console.error('Error showing panel overlay message:', error);
      return false;
    }
  }

  // Start setup when the page loads
  window.addEventListener('load', function () {
    console.log('Page loaded, initializing SA Activity Quick Buttons');
    checkCurrentPage();

    // Notification on page load has been disabled as requested
  });

  // Function to show a notification modal with the given message
  function showNotificationModal(title, message, autoHide = true, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = '#1589ee';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    notification.style.zIndex = '9999';
    notification.style.fontFamily = 'Salesforce Sans, Arial, sans-serif';
    notification.style.fontSize = '16px';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '400px';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    notification.style.opacity = '0';

    const titleElement = document.createElement('div');
    titleElement.textContent = title;
    titleElement.style.fontWeight = 'bold';
    titleElement.style.fontSize = '18px';
    titleElement.style.marginBottom = '10px';

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '15px';
    messageElement.style.lineHeight = '1.4';

    const button = document.createElement('button');
    button.textContent = 'OK';
    button.style.backgroundColor = 'white';
    button.style.color = '#1589ee';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '8px 16px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.fontSize = '14px';

    button.onclick = function () {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    };

    notification.appendChild(titleElement);
    notification.appendChild(messageElement);
    notification.appendChild(button);

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);

    // Auto-hide if specified
    if (autoHide) {
      setTimeout(() => {
        if (!notification.parentNode) return;
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 500);
      }, duration);
    }

    // Return the notification element so it can be updated or removed
    return notification;
  }

  // Apply all values from a configuration
  async function applyValues(config) {
    // Reset the tags tracker when starting a new activity
    selectedTagsTracker.reset();

    // First check if we need to click the "Create New" button
    await clickCreateNewButtonIfExists();

    // Prompt user for additional details
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Create dialog for user input
    const dialogOverlay = document.createElement('div');
    dialogOverlay.style.position = 'fixed';
    dialogOverlay.style.top = '0';
    dialogOverlay.style.left = '0';
    dialogOverlay.style.width = '100%';
    dialogOverlay.style.height = '100%';
    dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogOverlay.style.display = 'flex';
    dialogOverlay.style.justifyContent = 'center';
    dialogOverlay.style.alignItems = 'center';
    dialogOverlay.style.zIndex = '9050';

    const dialogBox = document.createElement('div');
    dialogBox.style.backgroundColor = 'white';
    dialogBox.style.padding = '20px';
    dialogBox.style.borderRadius = '8px';
    dialogBox.style.width = '500px';
    dialogBox.style.maxWidth = '90%';
    dialogBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dialogBox.style.fontFamily = 'Salesforce Sans, Arial, sans-serif';

    // Create dialog content
    const dialogTitle = document.createElement('h2');
    dialogTitle.textContent = `Add ${config.name}`;
    dialogTitle.style.fontSize = '1.25rem';
    dialogTitle.style.fontWeight = 'bold';
    dialogTitle.style.marginBottom = '16px';
    dialogTitle.style.color = '#16325c';

    const formEl = document.createElement('form');
    formEl.style.display = 'flex';
    formEl.style.flexDirection = 'column';
    formEl.style.gap = '16px';

    // Subject field
    const subjectGroup = document.createElement('div');
    subjectGroup.style.display = 'flex';
    subjectGroup.style.flexDirection = 'column';

    const subjectLabel = document.createElement('label');
    subjectLabel.textContent = 'Subject:';
    subjectLabel.style.marginBottom = '4px';
    subjectLabel.style.fontWeight = 'bold';

    const subjectInput = document.createElement('input');
    subjectInput.type = 'text';
    subjectInput.value = config.subject || '';
    // Use subject_placeholder if available, otherwise use a generic placeholder
    subjectInput.placeholder = config.subject_placeholder || 'Enter a subject for the activity';
    subjectInput.style.padding = '8px';
    subjectInput.style.border = '1px solid #dddbda';
    subjectInput.style.borderRadius = '4px';

    subjectGroup.appendChild(subjectLabel);
    subjectGroup.appendChild(subjectInput);

    // Description field
    const descGroup = document.createElement('div');
    descGroup.style.display = 'flex';
    descGroup.style.flexDirection = 'column';

    const descLabel = document.createElement('label');
    descLabel.textContent = 'Description:';
    descLabel.style.marginBottom = '4px';
    descLabel.style.fontWeight = 'bold';

    const descInput = document.createElement('textarea');
    descInput.value = config.description || '';
    // Use description_placeholder if available, otherwise use a generic placeholder
    descInput.placeholder = config.description_placeholder || 'Enter a description for the activity';
    descInput.style.padding = '8px';
    descInput.style.border = '1px solid #dddbda';
    descInput.style.borderRadius = '4px';
    descInput.style.minHeight = '100px';
    descInput.style.resize = 'vertical';

    descGroup.appendChild(descLabel);
    descGroup.appendChild(descInput);

    // Date field
    const dateGroup = document.createElement('div');
    dateGroup.style.display = 'flex';
    dateGroup.style.flexDirection = 'column';

    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Date:';
    dateLabel.style.marginBottom = '4px';
    dateLabel.style.fontWeight = 'bold';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = today;
    dateInput.style.padding = '8px';
    dateInput.style.border = '1px solid #dddbda';
    dateInput.style.borderRadius = '4px';

    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(dateInput);

    // Button group
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.justifyContent = 'flex-end';
    buttonGroup.style.gap = '10px';
    buttonGroup.style.marginTop = '16px';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.type = 'button';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.border = '1px solid #dddbda';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.backgroundColor = '#f4f6f9';
    cancelButton.style.cursor = 'pointer';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Continue';
    submitButton.type = 'submit';
    submitButton.style.padding = '8px 16px';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '4px';
    submitButton.style.backgroundColor = '#0070d2';
    submitButton.style.color = 'white';
    submitButton.style.fontWeight = 'bold';
    submitButton.style.cursor = 'pointer';

    buttonGroup.appendChild(cancelButton);
    buttonGroup.appendChild(submitButton);

    // Construct form
    formEl.appendChild(subjectGroup);
    formEl.appendChild(descGroup);
    formEl.appendChild(dateGroup);
    formEl.appendChild(buttonGroup);

    // Construct dialog
    dialogBox.appendChild(dialogTitle);
    dialogBox.appendChild(formEl);
    dialogOverlay.appendChild(dialogBox);

    // Return a promise that resolves when the form is submitted
    return new Promise((resolve, reject) => {
      // Add dialog to page
      document.body.appendChild(dialogOverlay);

      // Cancel button handler
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(dialogOverlay);
        reject(new Error('User cancelled'));
      });

      // Form submit handler
      formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get user inputs
        const userSubject = subjectInput.value;
        const userDesc = descInput.value;
        const userDate = dateInput.value;

        // Remove dialog
        document.body.removeChild(dialogOverlay);

        // Create a new config with user values
        const updatedConfig = { ...config };
        if (userSubject) updatedConfig.subject = userSubject;
        if (userDesc) updatedConfig.description = userDesc;

        // Show notification that we're applying values
        const fillingNotification = showNotificationModal(
          "Filling Form Values",
          "Values are being applied to the form. Please wait...",
          false // Don't auto-hide
        );
        clickCreateNewButtonIfExists().then(() => {
          // Process values
          applyValuesInternal(updatedConfig, userDate, fillingNotification)
            .then(resolve)
            .catch(reject);
        })
      });

      // Focus the first input
      subjectInput.focus();
    });
  }

  async function clickCreateNewButtonIfExists() {
    try {

      let createNewButton = document.querySelectorAll('button.slds-button.slds-button_brand');
      // If we found the button, click it and wait a moment
      for (let button of createNewButton) {
        if (button.textContent.trim() === 'Create New' || button.innerText.trim() === 'Create New') {
          console.log('Found "Create New" button in internal function, clicking it first');
          button.click();
          // Wait a bit for any panels to open
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error trying to find and click "Create New" button in internal function:', error);
      // Continue with the flow even if this fails
    }
  }

  // Internal function that does the actual value application
  async function applyValuesInternal(config, userDate, notification) {
    try {
      // First check for the "Create New" button and click it if found

      // Now find and click the "New SA/CSM Activity" button
      const newActivityButton = await findButtonWithText('New SA/CSM Activity');
      if (!newActivityButton) {
        if (notification && notification.parentNode) {
          const messageElement = notification.querySelector('div:nth-child(2)');
          if (messageElement) {
            messageElement.textContent = 'Error: New SA/CSM Activity button not found';
            notification.style.backgroundColor = '#c23934'; // Red for error
          }
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 500);
          }, 3000);
        }
        return;
      }

      // Check if there's an existing panel already open
      const panelTitle = document.querySelector('h2.panelTitle[title="New SA/CSM Activity"]');
      if (panelTitle) {
        console.log('Found existing SA/CSM Activity panel, making sure it\'s visible');
        // Find the ancestor panel
        const panel = panelTitle.closest('.slds-utility-panel');
        if (panel && !panel.classList.contains('slds-is-open')) {
          // If we can't find the panel container, click the button anyway
          newActivityButton.click();
          console.log('Clicked New SA/CSM Activity button');
        }
      } else {

        // No existing panel found, click the button to open a new one
        newActivityButton.click();
        console.log('Clicked New SA/CSM Activity button');
      }
      await clickCreateNewButtonIfExists();
      let buttons = document.querySelectorAll('lightning-button button');
      for (let button of buttons) {
        if (button.textContent.trim() === 'Add tags' || button.innerText.trim() === 'Add tags') {
          button.addEventListener('click', () => {
            setTimeout(async () => {
              const addButtons = document.querySelector('.slds-is-open').querySelectorAll('input[type="checkbox"]')
              addButtons.forEach(addButton => {
                console.log('addButton', addButton.value);
                addButton.addEventListener('click', () => {
                  console.log('tag add button clicked');
                  setTimeout(() => {
                    updateTagsLabel();
                  }, 500);
                });
              });
            }, 500);
          });
        }
      }

      setTimeout(async () => {
        console.log('Loaded panel and form');

        // Update notification
        if (notification && notification.parentNode) {
          const messageElement = notification.querySelector('div:nth-child(2)');
          if (messageElement) {
            messageElement.textContent = 'Filling form values...';
          }
        }

        // Clear all existing values first
        await clearFormFields();

        // Set values in sequence
        await setSAType(config.saType);

        await setActivity(config.activity);

        // If subject is defined in the config, set it
        if (config.subject) {
          setSubjectValue(config.subject);
        }

        // If description is defined in the config, set it
        if (config.description) {
          setDescriptionFieldValue(config.description);
        }

        if (config.tag) {
          await addTag(config.tag);
        }

        // Set the Related To field to "Opportunity" if it's not already
        await setRelatedToOpportunity(config.opportunityName ? config.opportunityName : null);

        // Set the date field if provided
        if (userDate) {
          await setDateField(userDate);
        }

        // Update notification to success
        if (notification && notification.parentNode) {
          const titleElement = notification.querySelector('div:first-child');
          const messageElement = notification.querySelector('div:nth-child(2)');
          if (titleElement && messageElement) {
            titleElement.textContent = 'Values Applied';
            messageElement.textContent = 'Form values have been filled successfully.';
            notification.style.backgroundColor = '#04844b'; // Green for success
          }

          // Auto-hide after a short delay
          setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 500);
          }, 1500);
        }

        // Show confirmation dialog with summary and option to create
        await showConfirmationDialog(config);

      }, 1000);

      console.log('start listening for tag click');
      interval = setInterval(async () => {
        listenForTagClick();
      }, 1000);

    } catch (error) {
      console.error('Error applying values:', error);

      // Update notification to show error
      if (notification && notification.parentNode) {
        const titleElement = notification.querySelector('div:first-child');
        const messageElement = notification.querySelector('div:nth-child(2)');
        if (titleElement && messageElement) {
          titleElement.textContent = 'Error';
          messageElement.textContent = 'Error: ' + error.message;
          notification.style.backgroundColor = '#c23934'; // Red for error
        }

        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 500);
        }, 3000);
      }
    }
  }

  // Function to set the date field
  async function setDateField(dateValue) {
    try {
      let labelElement = null;
      // Find the Date label
      const dateLabels = Array.from(document.querySelectorAll('lightning-datepicker'));
      for (const datepicker of dateLabels) {
        console.log('datepicker', datepicker);
        //let label = datepicker.querySelector('label');
        labelElement = (datepicker.shadowRoot?.children[0]?.children[0]?.innerText == '*Date') ? datepicker.shadowRoot?.children[0]?.children[0] : null;
        if (labelElement) {
          console.log('Date label found', labelElement);
          break;
        }
      }

      if (!labelElement) {
        console.warn('Date label not found');
        return false;
      }

      // Get the "for" attribute to find the input
      const dateId = labelElement.getAttribute('for');
      if (!dateId) {
        console.warn('Date label has no "for" attribute');
        return false;
      }

      // Find the date input by ID
      const dateInput = document.getElementById(dateId);
      if (!dateInput) {
        console.warn('Date input not found');
        return false;
      }

      // Format date if needed (from YYYY-MM-DD to whatever format the input accepts)
      // Set the value
      const success = await setInputValue(dateInput, dateValue, false, null, 'date');
      if (success) {
        console.log(`Set Date field to "${dateValue}"`);
        return true;
      } else {
        console.warn('Failed to set Date field');
        return false;
      }
    } catch (error) {
      console.error('Error setting Date field:', error);
      return false;
    }
  }

  // Function to show confirmation dialog with summary and create button
  async function showConfirmationDialog(config) {
    return new Promise((resolve, reject) => {
      try {
        // Gather current values from the form for display
        const currentSubject = document.querySelector('input[id*="subject"]')?.value || config.subject || 'Not set';
        const currentActivity = document.querySelector('input[placeholder="Search for SA Activity..."]')?.value || config.activity || 'Not set';

        // Get tags from the tracker instead of DOM elements
        const tags = selectedTagsTracker.tags.length > 0
          ? selectedTagsTracker.getTagsString()
          : (config.tag ? config.tag : 'None');

        // Get date value from the form
        let activityDate = 'Not set';
        let dateLabelElement = null;
        const dateLabels = Array.from(document.querySelectorAll('lightning-datepicker'));
        for (const datepicker of dateLabels) {
          console.log('datepicker', datepicker);
          //let label = datepicker.querySelector('label');
          dateLabelElement = (datepicker.shadowRoot?.children[0]?.children[0]?.innerText == '*Date') ? datepicker.shadowRoot?.children[0]?.children[0] : null;
          if (dateLabelElement) {
            console.log('Date label found', dateLabelElement);
            break;
          }
        }
        if (dateLabelElement) {
          const dateId = dateLabelElement.getAttribute('for');
          if (dateId) {
            const dateInput = document.getElementById(dateId);
            if (dateInput && dateInput.value) {
              activityDate = formatDateForInput(dateInput.value);
            }
          }
        }

        // Create dialog overlay
        const dialogOverlay = document.createElement('div');
        dialogOverlay.style.position = 'fixed';
        dialogOverlay.style.top = '0';
        dialogOverlay.style.left = '0';
        dialogOverlay.style.width = '100%';
        dialogOverlay.style.height = '100%';
        dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        dialogOverlay.style.display = 'flex';
        dialogOverlay.style.justifyContent = 'center';
        dialogOverlay.style.alignItems = 'center';
        dialogOverlay.style.zIndex = '9050';

        // Create dialog box
        const dialogBox = document.createElement('div');
        dialogBox.style.backgroundColor = 'white';
        dialogBox.style.padding = '20px';
        dialogBox.style.borderRadius = '8px';
        dialogBox.style.width = '500px';
        dialogBox.style.maxWidth = '90%';
        dialogBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialogBox.style.fontFamily = 'Salesforce Sans, Arial, sans-serif';

        // Create dialog content
        const dialogTitle = document.createElement('h2');
        dialogTitle.textContent = 'Confirm Activity Creation';
        dialogTitle.style.fontSize = '1.25rem';
        dialogTitle.style.fontWeight = 'bold';
        dialogTitle.style.marginBottom = '16px';
        dialogTitle.style.color = '#16325c';

        // Create summary content
        const summaryContainer = document.createElement('div');
        summaryContainer.style.marginBottom = '20px';

        const summaryTable = document.createElement('table');
        summaryTable.style.width = '100%';
        summaryTable.style.borderCollapse = 'collapse';
        summaryTable.style.marginBottom = '16px';

        // Add table rows for each field
        const rows = [
          { label: 'Activity Type', value: config.saType || 'Not set' },
          { label: 'Activity', value: currentActivity },
          { label: 'Subject', value: currentSubject },
          { label: 'Date', value: activityDate },
          { label: 'Tags', value: tags }
        ];

        rows.forEach(row => {
          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid #dddbda';

          const tdLabel = document.createElement('td');
          tdLabel.textContent = row.label;
          tdLabel.style.padding = '8px';
          tdLabel.style.fontWeight = 'bold';
          tdLabel.style.width = '30%';

          const tdValue = document.createElement('td');
          tdValue.textContent = row.value;
          tdValue.style.padding = '8px';

          tr.appendChild(tdLabel);
          tr.appendChild(tdValue);
          summaryTable.appendChild(tr);
        });

        summaryContainer.appendChild(summaryTable);

        // Add confirmation message
        const confirmMsg = document.createElement('p');
        confirmMsg.textContent = 'Would you like to create this activity now?';
        confirmMsg.style.marginBottom = '16px';

        // Button group
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.justifyContent = 'flex-end';
        buttonGroup.style.gap = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.border = '1px solid #dddbda';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.backgroundColor = '#f4f6f9';
        cancelButton.style.cursor = 'pointer';

        const createButton = document.createElement('button');
        createButton.textContent = 'Create Activity';
        createButton.style.padding = '8px 16px';
        createButton.style.border = 'none';
        createButton.style.borderRadius = '4px';
        createButton.style.backgroundColor = '#04844b'; // Green for confirmation
        createButton.style.color = 'white';
        createButton.style.fontWeight = 'bold';
        createButton.style.cursor = 'pointer';

        buttonGroup.appendChild(cancelButton);
        buttonGroup.appendChild(createButton);

        // Assemble dialog
        dialogBox.appendChild(dialogTitle);
        dialogBox.appendChild(summaryContainer);
        dialogBox.appendChild(confirmMsg);
        dialogBox.appendChild(buttonGroup);
        dialogOverlay.appendChild(dialogBox);

        // Add event handlers
        cancelButton.addEventListener('click', () => {
          document.body.removeChild(dialogOverlay);
          resolve(false);
        });

        createButton.addEventListener('click', () => {
          document.body.removeChild(dialogOverlay);

          // Find and click the Create button
          const createActivityButton = Array.from(document.querySelectorAll('button')).find(
            button => (button.textContent && button.textContent.trim() === 'Create') ||
              (button.innerText && button.innerText.trim() === 'Create')
          );

          if (createActivityButton) {
            createActivityButton.click();
            console.log('Clicked Create button to finalize activity');
            resolve(true);
          } else {
            console.warn('Create button not found');
            resolve(false);
          }
        });

        // Add dialog to the page
        document.body.appendChild(dialogOverlay);

      } catch (error) {
        console.error('Error showing confirmation dialog:', error);
        reject(error);
      }
    });
  }

  // Function to get the Opportunity name from the page
  async function getOpportunityNameFromPage() {
    try {
      if (!window.location.href.toLowerCase().includes('opportunity/')) {
        console.log('Not on Opportunity page, cannot get Opportunity name');
        return null;
      }
      // Find the div with the specific data attribute
      if (window.location.href.toLowerCase().includes('opportunity/')) {

        const opportunityNameContainer = await waitForElement(document, '.slds-page-header__title[name="primaryField"] lightning-formatted-text');
        if (!opportunityNameContainer) {
          console.log('Opportunity name container not found');
          return null;
        }

        // Look for the text elements inside, first try lightning-formatted-text
        const formattedText = opportunityNameContainer?.innerText;

        return formattedText;
      }
    } catch (error) {
      console.error('Error getting Opportunity name:', error);
      return null;
    }

  }

  async function getForAttributeFromLabel(labelText, backUpLabelText) {
    const labels = Array.from(document.querySelectorAll('label'));
    for (let label of labels) {
      if (label.classList.contains('slds-form-element__label')) {
        if ((label.textContent && label.textContent.includes(labelText)) || ((label.innerText && label.innerText.includes(labelText)))
        ||(label.textContent && label.textContent.includes(backUpLabelText)) || ((label.innerText && label.innerText.includes(backUpLabelText)))) {
          return label.getAttribute('for');
        }
      }

    }
    return null;
  }

  let opportunityNameInterval = null;
  // Updated setRelatedToOpportunity function to use the opportunity name from the page
  async function setRelatedToOpportunity(opportunityName = null) {
    let cameFromReport = (window.location.href.toLowerCase().includes('report/')||window.location.href.toLowerCase().includes('reports/'))&&opportunityName!=null;
    try {
      let success = false;
      if (!opportunityName) {
        opportunityName = await getOpportunityNameFromPage();
      }

      console.log('Setting Related To field to Opportunity...');

      // Find the "Related To" label by text content
      const relatedToLabels = Array.from(document.querySelectorAll('label')).filter(label => {
        return (label.textContent && label.textContent.includes('Related To')) ||
          (label.innerText && label.innerText.includes('Related To'));
      });

      if (relatedToLabels.length === 0) {
        console.warn('Related To label not found');
        return false;
      }

      console.log('Found Related To label:', relatedToLabels[0]);

      // Get the "for" attribute which points to the input or button ID
      const forAttribute = relatedToLabels[0].getAttribute('for');
      if (!forAttribute) {
        console.warn('Related To label has no "for" attribute');
        return false;
      }

      const opportunityInput = document.getElementById(forAttribute);
      if (opportunityInput) {
        opportunityInput.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Found Opportunity input by label "for" attribute:', forAttribute);
        // Find the option with the matching text
        const option = document.querySelector('lightning-base-combobox-item[data-value="Opportunity"]');
        if (option) {
          option.click();
          //success = await setInputValue(opportunityInput, 'Opportunity', false, 'lightning-base-combobox-item[data-value="Opportunity"]');
        }
      }

      // Find the Opportunity lookup input field
      const opportunityForAttribute = await getForAttributeFromLabel('Opportunity',"Account");
      if (opportunityForAttribute) {
        const opportunityInput = document.getElementById(opportunityForAttribute);
        if (opportunityInput && opportunityName && (!opportunityInput.value || cameFromReport)) {
          console.log('Found Opportunity input by label "for" attribute:', opportunityForAttribute);

          success = await setInputValue(opportunityInput, opportunityName, true);
          opportunityNameInterval = setInterval(() => {
            ///wait for the option to appear
            let clickableOpp = document.querySelectorAll('span.slds-media__body');
            console.log('Found clickable Opportunities:', clickableOpp);
            for (const oppNameOption of clickableOpp) {
              if ((oppNameOption.textContent && oppNameOption.textContent.includes(opportunityName)) ||
                (oppNameOption.innerText && oppNameOption.innerText.includes(opportunityName))) {
                console.log('Found clickable Opportunity:', oppNameOption);
                oppNameOption.parentElement.parentElement.click();
                success = true;
                setTimeout(() => {
                  clearInterval(opportunityNameInterval);
                }, 800);
                break;
              }
            }

          }, 1000);
        }
      }


      return success;
    } catch (error) {
      console.error('Error setting Related To field:', error);
      return false;
    }
  }

  // Function to set the Subject field with a custom value
  async function setSubjectValue(value) {
    try {
      // Find the Subject label
      const subjectLabels = Array.from(document.querySelectorAll('label')).filter(label =>
        (label.textContent && label.textContent.includes('Subject')) || (label.innerText && label.innerText.includes('Subject'))
      );

      if (subjectLabels.length === 0) {
        console.log('Subject label not found');
        return false;
      }

      // Find the associated input
      let subjectInput = null;

      // Method 1: Try to find by label's 'for' attribute
      const subjectId = subjectLabels[0].getAttribute('for');
      if (subjectId) {
        subjectInput = document.getElementById(subjectId);
      }

      // Method 2: Find in the same container as the label
      if (!subjectInput) {
        const container = subjectLabels[0].closest('.slds-form-element');
        if (container) {
          subjectInput = container.querySelector('input');
        }
      }

      // Method 3: Find in siblings or nearby elements
      if (!subjectInput) {
        // Find all inputs that follow this label in the DOM
        const allInputs = document.querySelectorAll('input');
        let labelIndex = -1;

        // Find the index of our label among all labels
        const allLabels = document.querySelectorAll('label');
        for (let i = 0; i < allLabels.length; i++) {
          if (allLabels[i] === subjectLabels[0]) {
            labelIndex = i;
            break;
          }
        }

        // If we found the label, try to find a corresponding input
        if (labelIndex >= 0 && labelIndex < allInputs.length) {
          // Try the input at the same index, or the next few inputs
          for (let i = 0; i < 3; i++) {
            if (labelIndex + i < allInputs.length) {
              subjectInput = allInputs[labelIndex + i];
              break;
            }
          }
        }
      }

      if (!subjectInput) {
        console.log('Subject input not found');
        return false;
      }

      // Set the subject text
      const success = await setInputValue(subjectInput, value);

      if (success) {
        console.log(`Set Subject field to "${value}"`);
        return true;
      } else {
        console.log('Failed to set Subject field');
        return false;
      }
    } catch (error) {
      console.error('Error setting Subject field:', error);
      return false;
    }
  }

  function checkForText(element, text) {
    // Check if the current element's text matches
    if (element.textContent && element.textContent.trim() === text) {
      return true;
    }
    if (element.innerText && element.innerText.trim() === text) {
      return true;
    }

    // Recursively check all descendant nodes
    if (element.children && element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        if (checkForText(element.children[i], text)) {
          return true;
        }
      }
    }

    // Check shadow DOM if present
    if (element.shadowRoot) {
      for (let i = 0; i < element.shadowRoot.children.length; i++) {
        if (checkForText(element.shadowRoot.children[i], text)) {
          return true;
        }
      }
    }

    return false;
  }

  // Function to format a date as MMM DD, YYYY (e.g., May 22, 2025)
  function formatDateForInput(dateString) {
    try {
      // Parse the input date string (expected format: YYYY-MM-DD)
      const dateParts = dateString.split('-');
      if (dateParts.length !== 3) {
        console.warn('Invalid date format, expected YYYY-MM-DD but got:', dateString);
        return dateString; // Return original if invalid
      }

      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
      const day = parseInt(dateParts[2]);

      const date = new Date(year, month, day);

      // Format the date as MMM DD, YYYY
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original on error
    }
  }

  // Wait for an element matching the selector to appear
  function waitForElement(rootElement, selector, maxAttempts = 20, interval = 500) {
    return new Promise((resolve, reject) => {
      let currentAttempt = 0;
      function checkForElement() {
        const element = rootElement.querySelector(selector);

        if (element) {
          resolve(element);
          return;
        }
        currentAttempt++;
        if (currentAttempt >= maxAttempts) {
          reject(new Error(`Element ${selector} not found after ${maxAttempts} attempts`));
          return;
        }
        setTimeout(checkForElement, interval);
      }
      checkForElement();
    });
  }

  // Wait for an element matching the selector to disappear
  function waitForElementToDisappear(rootElement, selector, maxAttempts = 20, interval = 500) {
    return new Promise((resolve) => {
      let currentAttempt = 0;

      // First check if the element doesn't exist at all
      if (!rootElement.querySelector(selector)) {
        console.log(`Element ${selector} already absent, no need to wait`);
        return resolve(true);
      }

      function checkForElement() {
        const element = rootElement.querySelector(selector);

        // Element no longer in the DOM, spinner has disappeared
        if (!element) {
          console.log(`Element ${selector} has disappeared after ${currentAttempt} attempts`);
          return resolve(true);
        }

        currentAttempt++;
        if (currentAttempt >= maxAttempts) {
          console.warn(`Element ${selector} still present after ${maxAttempts} attempts, continuing anyway`);
          return resolve(false);
        }

        // Element still present, check again after interval
        setTimeout(checkForElement, interval);
      }

      // Start checking
      checkForElement();
    });
  }



  // Helper function to set input value and trigger necessary events
  async function setInputValue(input, value, stopPropagation = false, thenClickOptionAtSelector = null, inputType = null) {
    if (!input) return false;

    try {
      console.log('Setting input value to:' + value, input);

      // Handle button or non-input elements
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
        input.setAttribute('data-value', value);
        if (input.children && input.children.length > 0) {
          input.children[0].innerText = value;
          input.children[0].textContent = value;
        }
        else {
          input.innerText = value;
          input.textContent = value;
        }
        console.log('Set text content of element to:' + value, input);
        input.click();

        if (stopPropagation) {
          return true;
        }

        if (thenClickOptionAtSelector) {
          console.log('Clicking input and waiting for option to appear:', thenClickOptionAtSelector);
          return new Promise(resolve => {
            setTimeout(async () => {
              const option = await waitForElement(document, thenClickOptionAtSelector, 20, 300);
              if (option) {
                console.log('Found option to click:', option);
                option.click();
                resolve(true);
              } else {
                resolve(false);
              }
            }, 1000);
          });
        }
        return true;
      }

      // Handle input elements and textareas
      if (input instanceof HTMLTextAreaElement) {
        const nativeValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype, "value"
        ).set;
        nativeValueSetter.call(input, value);
      } else {
        const nativeValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, "value"
        ).set;
        nativeValueSetter.call(input, value);
      }

      if (input instanceof HTMLInputElement && inputType == 'date') {
        input.value = formatDateForInput(value);
        try { input.innerText = formatDateForInput(value); }
        catch (error) {
          console.error('Error setting innerText for date input:', error);
        }
      }

      // Dispatch input event
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(inputEvent);

      // Also dispatch change event
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(changeEvent);

      console.log('Set input value to:' + value, input);

      // Handle clicking an option if needed
      if (thenClickOptionAtSelector) {
        console.log('Waiting for option to appear:', thenClickOptionAtSelector);
        return new Promise(resolve => {
          setTimeout(async () => {
            const option = await waitForElement(document, thenClickOptionAtSelector, 20, 300);
            if (option) {
              console.log('Found option to click:', option);
              option.click();
              resolve(true);
            } else {
              resolve(false);
            }
          }, 1000);
        });
      }

      return true;
    } catch (err) {
      console.error('Error setting input value:', err);
      return false;
    }
  }

  // Function to find "New SA/CSM Activity" button
  async function findButtonWithText(text) {
    try {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent && btn.textContent.includes(text) || btn.innerText && btn.innerText.includes(text)) {
          return btn;
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding New SA/CSM Activity button:', error);
      return null;
    }
  }

  async function findElementWithTextDescendant(type, text, parent = null) {
    try {
      console.log('finding element with text', text, 'of type', type, 'in parent', parent);
      const buttons = (parent || document).querySelectorAll(type);
      for (const btn of buttons) {
        for (const child of btn.children) {
          if ((child.textContent && child.textContent == text) || (child.innerText && child.innerText == text)) {
            return child;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding New SA/CSM Activity button:', error);
      return null;
    }
  }

  // Function to set the SA Activity input value
  /**async function setSAActivity(value) {
    try {
      console.log('Starting SA Activity selection...');

      // Find the input with placeholder "Search for SA Activity..."
      let saActivityInput = await waitForElement(document, `input[placeholder="Search for SA Activity..."]`, 20, 300);

      if (!saActivityInput) {
        console.log('SA Activity input not found');
        return false;
      }
      saActivityInput.focus();
      saActivityInput.value = value;
      const activityListItem = await waitForElement(document, `li[data-id="${value}"]`, 20, 300);
      console.log('Activity list item found:', activityListItem);
      activityListItem.dispatchEvent(new Event('click', { bubbles: true, cancelable: false }));
      setTimeout(async () => {
        let saActivityInputChanged = await waitForElement(document, `input[value="${value}"]`, 20, 300);
        if (saActivityInputChanged) {
          console.log('SA Activity input changed to:', value);
          return true;
        }
      }, 1000);**/
  /**
            console.log('Set SA Activity input to "Account Planning [Management]"');

            try {
              // Wait for the activity option to appear
              const activityOption = await waitForElement(document, 'li[data-id="Account Planning [Management]"]', 20, 200);
          console.log('Found option containing Account Planning [Management]:', activityOption.tagName);

              // Click the activity option
              activityOption.click();
              console.log('Clicked on element containing Account Planning [Management]:', activityOption.tagName);
              return true;
            } catch (error) {
              console.error('Error waiting for Account Planning [Management] option:', error);
              return false;
            }
      */
  /*} catch (error) {
      console.error('Error setting SA Activity:', error);
      return false;
    }
}*/

  async function setDynamicOption(value, selectorForInput, selectorForListItem) {
    try {
      console.log('Starting selection of dynamic option...');

      // Find the input with placeholder "Search for SA Activity..."
      let input = await waitForElement(document, selectorForInput, 10, 300);
      console.log('found input element for dynamic option', input);
      if (!input) {
        console.log('Input not found');
        return false;
      }
      input.focus();
      if (input.getAttribute('type') === 'button' || input instanceof HTMLButtonElement) {
        input.click();
      }
      else if (input instanceof HTMLInputElement) {
        input.value = value;
      }
      const listItem = await waitForElement(document, selectorForListItem, 10, 300);
      if (!listItem) {
        console.log('List item not found');
        return false;
      }
      console.log('List item found with value ' + value + ':', listItem);
      listItem.dispatchEvent(new Event('click', { bubbles: true, cancelable: false }));
      setTimeout(async () => {
        console.log('waiting for input to change to ', value);
        let inputChanged = input.value === value || input.innerText === value;
        if (inputChanged) {
          console.log('Input changed to:', value);
          return true;
        }
      }, 500);

    } catch (error) {
      console.error('Error setting option:', error);
      return false;
    }
  }


  async function setValueForInputElement(value, selectorForInput) {
    try {
      console.log('Starting selection of dynamic option...');

      // Find the input with placeholder "Search for SA Activity..."
      let input = await waitForElement(document, selectorForInput, 10, 300);
      /* console.log('found input element for dynamic option', input);
      if (!input) {
        console.log('Input not found');
        return false;
      }
      input.focus();
      if (input.getAttribute('type') === 'button' || input instanceof HTMLButtonElement) {
        input.click();
      }
      else  */

      if (input && input instanceof HTMLInputElement) {
        input.value = value;
      }
      return true;

    } catch (error) {
      console.error('Error setting option:', error);
      return false;
    }
  }

  // Function to find and select the SA type in the dropdown
  async function selectSAType() {
    try {
      console.log('Starting SA Type selection...');

      // Direct approach - look for all comboboxes
      const comboboxButtons = document.querySelectorAll('button[role="combobox"]');
      let saTypeButton = null;

      // Find the SA Type combobox button
      for (const btn of comboboxButtons) {
        if (btn.closest('[aria-label="SA Type"]') ||
          (btn.parentElement &&
            btn.parentElement.parentElement &&
            elementContainsText(btn.parentElement.parentElement, 'SA Type'))) {
          saTypeButton = btn;
          break;
        }
      }

      if (!saTypeButton) {
        console.log('SA Type dropdown button not found, trying alternate approaches...');

        // Try looking for the label and then finding a nearby button
        const saTypeLabels = Array.from(document.querySelectorAll('label')).filter(label =>
          (label.textContent && label.textContent.includes('SA Type')) || (label.innerText && label.innerText.includes('SA Type'))
        );

        if (saTypeLabels.length > 0) {
          const saTypeContainer = saTypeLabels[0].closest('.slds-form-element');
          if (saTypeContainer) {
            saTypeButton = saTypeContainer.querySelector('button[role="combobox"]');
          }
        }
      }

      if (!saTypeButton) {
        console.log('SA Type dropdown button not found after multiple attempts');
        return false;
      }

      // Get dropdown ID from button
      const dropdownId = saTypeButton.getAttribute('aria-controls');
      if (!dropdownId) {
        console.log('Could not find dropdown ID from SA Type button');
        return false;
      }

      // Open the dropdown by clicking the button
      console.log('Found SA Type dropdown button, clicking it...');
      saTypeButton.click();

      try {
        // Wait for the dropdown to appear
        const SATypeDropDown = await waitForElement(document, `div[role="listbox"][aria-label="SA Type"][id="${dropdownId}"]`, 20, 300);

        // Find the SA option in the dropdown
        const SAOption = await waitForElement(SATypeDropDown, 'lightning-base-combobox-item[data-value="SA"]', 20, 300);

        if (SAOption) {
          // Click the option
          SAOption.click();
          console.log('Clicked on element for SA option:', SAOption.tagName);
          return true;
        } else {
          console.log('SA option not found in dropdown');
          return false;
        }
      } catch (error) {
        console.error('Error waiting for SA Type dropdown:', error);
        return false;
      }
    } catch (error) {
      console.error('Error selecting SA Type:', error);
      return false;
    }
  }

  // Global interval for tag button event listener
  let interval = null;

  async function listenForTagClick() {

    const addTagsButton = Array.from(document.querySelectorAll('lightning-button button'))
      .find(button => button.textContent.trim() === 'Add tags');
    console.log('addTagsButton', addTagsButton);
    addTagsButton.addEventListener('click', () => {
      console.log('addTagsButton clicked');
      setTimeout(() => {
        const addButtons = document.querySelector('.slds-is-open').querySelectorAll('input[type="checkbox"]')
        addButtons.forEach(addButton => {
          console.log('addButton', addButton.value);
          addButton.addEventListener('click', (event) => {
            console.log('tag add button clicked');

            // Update the tag tracker
            const checkbox = event.target;
            const tagValue = checkbox.value || checkbox.closest('[data-id]')?.getAttribute('data-id');

            if (tagValue) {
              if (checkbox.checked) {
                selectedTagsTracker.addTag(tagValue);
              } else {
                selectedTagsTracker.removeTag(tagValue);
              }
            }

            setTimeout(() => {
              updateTagsLabel();
            }, 500);
          });
        });
      }, 500);
    });

  }

  /* // Updates the description field with the pathway tag and selects SA type
  async function addNamerResearchActivity() {
    let success = false;
    // First select the SA Type
    // Find the description textarea
    const descriptionField = document.querySelector('textarea[id*="description"]');
    if (descriptionField) {
      // Safely update the value without triggering form submission
      try {
        // Get the current value
        const currentValue = descriptionField.value;
        const tagToAdd = '#namer-genai-pathway';

        // Only add the tag if it's not already there
        if (!currentValue.includes(tagToAdd)) {
          // Update the value directly
          const newValue = currentValue + (currentValue.length > 0 ? ' ' : '') + tagToAdd;

          // Use the property setter to avoid form submission
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
          ).set;

          nativeInputValueSetter.call(descriptionField, newValue);

          // Create and dispatch a more controlled input event
          const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true
          });

          descriptionField.dispatchEvent(inputEvent);
          success = true;
        } else {
          // Tag already exists
          success = true;
        }
      } catch (err) {
        console.error('Error updating description field:', err);
      }
    } else {
      console.log('Description field not found');
    }
    // Set Subject field (do this early in case other fields depend on it)
    try {
      await setSubjectValue("Researched use cases in the #namer-genai-pathways wiki.");
    } catch (err) {
      console.error('Error setting Subject field:', err);
    }

    // Check and set Opportunity field if blank
    try {
      await setOpportunityField();
    } catch (err) {
      console.error('Error setting Opportunity field:', err);
    }
    let saTypeSuccess = false;
    let activitySuccess = false;
    try {
      saTypeSuccess = await selectSAType();
      if (!saTypeSuccess) {
        console.error('Failed to select SA Type');
      }
    } catch (err) {
      console.error('Error selecting SA type:', err);
    }

    // Wait for a moment after SA Type selection before trying SA Activity
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Then select SA Activity only if SA Type was successful
    if (saTypeSuccess) {
      try {
        activitySuccess = await setActivity("Account Planning [Management]");
        if (!activitySuccess) {
          console.error('Failed to select SA Activity');
        }
      } catch (err) {
        console.error('Error setting SA Activity:', err);
      }
    }

    // set the focus on the create button
    const createButton = document.querySelector('button[text()="Create"]');
    if (createButton) {
      createButton.focus();
    }

    return success;
  }
 */
  // Function to set the Opportunity field if it's blank
  async function setOpportunityField() {
    try {
      // Find the Opportunity field label
      const opportunityLabels = Array.from(document.querySelectorAll('label')).filter(label =>
        label.innerText && label.innerText.includes('Opportunity')
      );

      if (opportunityLabels.length === 0) {
        console.log('Opportunity label not found');
        return false;
      }

      // Find the associated input
      let opportunityInput = null;
      const opportunityId = opportunityLabels[0].getAttribute('for');

      if (opportunityId) {
        opportunityInput = document.getElementById(opportunityId);
      }

      if (!opportunityInput) {
        const container = opportunityLabels[0].closest('.slds-form-element');
        if (container) {
          opportunityInput = container.querySelector('input');
        }
      }

      if (!opportunityInput) {
        console.log('Opportunity input not found');
        return false;
      }

      // Check if the field is blank
      if (opportunityInput.value && opportunityInput.value.trim() !== '') {
        opportunityInput.focus();
        console.log('Opportunity field already has a value:', opportunityInput.value);
        return true; // Field is not blank, no need to update
      }

      // Get the Opportunity Name from the page
      const opportunityName = await getOpportunityNameFromPage();
      if (!opportunityName) {
        console.log('No Opportunity Name found to populate field');
        return false;
      }

      // Set the opportunity name in the input field
      const success = await setInputValue(opportunityInput, opportunityName, false, "lightning-base-combobox-item[data-value='" + opportunityName + "']");

      if (success) {
        console.log('Set Opportunity field to:', opportunityName);

        // Some lookup fields require selecting from a dropdown after setting value
        // Wait a moment for the dropdown to appear
        /*try {
          setTimeout(async () => {
            // Look for dropdown items matching our opportunity name
            const dropdownItem = await waitForElement(document, 'span[text()="' + opportunityName + '"]', 20, 300);
            if (dropdownItem) {
              dropdownItem.focus();
              dropdownItem.click();
              console.log('Selected matching Opportunity from dropdown');
              return true;
            }
            else {
              console.log('No dropdown items found for Opportunity selection');
            }
          }, 500);
        } catch (err) {
          console.log('No dropdown appeared for Opportunity selection');
        }*/

        return success;
      } else {
        console.log('Failed to set Opportunity field');
        return false;
      }
    } catch (error) {
      console.error('Error setting Opportunity field:', error);
      return false;
    }
  }

  // Function to handle the button click
  function handleGenAIPathwayButtonClick(event) {
    // Prevent any form submission or default behaviors
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    // Find and click the New SA/CSM Activity button
    const newActivityButton = findButtonWithText('New SA/CSM Activity');
    if (newActivityButton) {
      // Click the button to open the panel
      newActivityButton.click();
      console.log('Clicked New SA/CSM Activity button');

      // Wait for the panel to open and form to load
      setTimeout(function () {
        // Now update all form fields
        addNamerResearchActivity().then(success => {
          // Update button state based on result
          if (success) {
            button.innerText = 'NAMER GenAI Pathway reference added to description';
            setTimeout(() => {
              button.disabled = false;
              button.innerText = 'Add NAMER GenAI Pathway Research Activity';
            }, 1500);
          } else {
            button.innerText = 'Form not found, try again';
            setTimeout(() => {
              button.disabled = false;
              button.innerText = 'Add NAMER GenAI Pathway Research Activity';
            }, 2000);
          }
        });
      }, 1000); // 1 second delay for form to load
    } else {
      console.log('New SA/CSM Activity button not found');
      button.innerText = 'Error: Activity button not found';
      setTimeout(() => {
        button.disabled = false;
        button.innerText = 'Add NAMER GenAI Pathway Research Activity';
      }, 1000);
    }

    return false;
  }

  // Function to create a GenAI Pathway button
  function createGenAIPathwayButton() {
    const button = document.createElement('button');
    button.id = 'namer-genai-pathway-btn';
    button.className = 'slds-button slds-button_brand';
    button.style.minWidth = '240px';
    button.innerText = 'Add NAMER GenAI Pathway Research Activity';

    // Add click event listener
    button.addEventListener('click', handleGenAIPathwayButtonClick);

    return button;
  }

  // Function to create or find tampermonkey button container in activity tab
  async function createButtonContainer() {
    try {
      if (window.location.href.toLowerCase().includes('report/')||window.location.href.toLowerCase().includes('reports/')) {
        console.log('Not on this page');
        return null;
      }
      console.log('Starting to create button container...');

      // First check if container already exists
      const existingContainer = document.getElementById('tampermonkey_button_container');
      if (existingContainer) {
        console.log('Found existing button container, reusing it');
        
        // Check if there are multiple containers with the same class and remove duplicates
        const allContainers = document.querySelectorAll('.tampermonkey_button_container');
        if (allContainers.length > 1) {
          console.log('Found multiple button containers, removing duplicates');
          // Keep the first one, remove others
          for (let i = 1; i < allContainers.length; i++) {
            allContainers[i].remove();
          }
        }
        
        return existingContainer;
      }

      // Try different selectors in order of preference
      const selectors = [
        '.oneAppNavContainer',
        'div[data-aura-class="navexStandardManager"]',
        '.slds-utility-panel',
        '.flexipageComponent',
        '.oneContent',
        'body' // Fallback to body if nothing else works
      ];

      let navContainer = null;
      for (const selector of selectors) {
        console.log(`Trying to find container with selector: ${selector}`);
        navContainer = document.querySelector(selector);
        if (navContainer) {
          console.log(`Found container using selector: ${selector}`);
          break;
        }
      }

      // If no container found using selectors, create a floating container
      if (!navContainer) {
        console.warn('No suitable container found, creating floating container');
        navContainer = document.body;
      }

      // Create container
      let tampermonkeyContainer = document.createElement('div');
      tampermonkeyContainer.id = 'tampermonkey_button_container';
      tampermonkeyContainer.className = 'slds-m-top_small slds-m-bottom_small slds-p-around_small tampermonkey_button_container';

      // Apply the exact styles provided by the user
      tampermonkeyContainer.style.zIndex = '9000';
      tampermonkeyContainer.style.backgroundColor = 'rgb(248, 248, 248)';
      tampermonkeyContainer.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 4px 8px';
      tampermonkeyContainer.style.borderRadius = '4px';
      tampermonkeyContainer.style.border = '2px solid rgb(0, 112, 210)';
      tampermonkeyContainer.style.padding = '10px';
      tampermonkeyContainer.style.display = 'flex';
      tampermonkeyContainer.style.flexFlow = 'wrap';
      tampermonkeyContainer.style.gap = '10px';
      tampermonkeyContainer.style.justifyContent = 'flex-start';
      tampermonkeyContainer.style.alignItems = 'center';
      tampermonkeyContainer.style.margin = '20px';
      tampermonkeyContainer.style.alignContent = 'center';

      // Add a close button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'relative';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.color = '#0070d2';
      closeButton.style.fontSize = '16px';
      closeButton.style.fontWeight = 'bold';
      closeButton.style.cursor = 'pointer';
      closeButton.style.zIndex = '9001';
      closeButton.title = 'Hide SA Activity Buttons';
      closeButton.onclick = function () {
        tampermonkeyContainer.style.display = 'none';
        // Create a small icon to show it again
        const showButton = document.createElement('button');
        showButton.innerHTML = '⊕';
        showButton.title = 'Show SA Activity Buttons';
        showButton.style.position = 'relative';
        showButton.style.top = '10px';
        showButton.style.right = '10px';
        showButton.style.width = '24px';
        showButton.style.height = '24px';
        showButton.style.borderRadius = '50%';
        showButton.style.backgroundColor = '#0070d2';
        showButton.style.color = 'white';
        showButton.style.border = 'none';
        showButton.style.zIndex = '9001';
        showButton.style.cursor = 'pointer';
        showButton.style.fontSize = '16px';
        showButton.style.lineHeight = '1';
        showButton.style.fontWeight = 'bold';
        showButton.onclick = function () {
          tampermonkeyContainer.style.display = 'flex';
          this.remove();
        };
        document.body.appendChild(showButton);
      };
      tampermonkeyContainer.appendChild(closeButton);

      // Add a title
      const titleEl = document.createElement('div');
      titleEl.style.width = '100%';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.fontSize = '1rem';
      titleEl.style.color = '#0070d2';
      titleEl.style.marginBottom = '10px';
      titleEl.style.borderBottom = '1px solid #dddbda';
      titleEl.style.paddingBottom = '5px';
      titleEl.textContent = 'SA Activity Quick Buttons';
      tampermonkeyContainer.appendChild(titleEl);
      setTimeout(() => {
        // Add to the container
        navContainer = document.querySelector('.mainContentMark');
        if(!window.location.href.toLowerCase().includes('report/')&&!window.location.href.toLowerCase().includes('reports/')&&!navContainer.querySelector('.tampermonkey_button_container')) {
          navContainer ? navContainer.insertBefore(tampermonkeyContainer, navContainer.firstChild) : document.body.appendChild(tampermonkeyContainer);
        }
        window.scrollTo(0, 0);
      }, 1000);

      console.log('Created tampermonkey button container successfully');

      return tampermonkeyContainer;
    } catch (error) {
      console.error('Error creating button container:', error);

      // Last resort - create a floating container on the body
      try {
        const emergencyContainer = document.createElement('div');
        emergencyContainer.id = 'tampermonkey_button_container_emergency';
        emergencyContainer.style.position = navContainer ? 'relative' : 'fixed';
        emergencyContainer.style.top = '100px';
        emergencyContainer.style.left = '10px';
        emergencyContainer.style.width = 'calc(100% - 20px)';
        emergencyContainer.style.maxHeight = '80vh';
        emergencyContainer.style.overflowY = 'auto';
        emergencyContainer.style.backgroundColor = '#f3f2f2';
        emergencyContainer.style.padding = '10px';
        emergencyContainer.style.zIndex = '9999';
        emergencyContainer.style.border = '1px solid red';
        emergencyContainer.style.borderRadius = '4px';
        emergencyContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        emergencyContainer.style.display = 'flex';
        emergencyContainer.style.flexWrap = 'wrap';
        emergencyContainer.style.gap = '10px';

        document.body.appendChild(emergencyContainer);
        console.log('Created emergency button container');
        return emergencyContainer;
      } catch (finalError) {
        console.error('Failed to create emergency container:', finalError);
        return null;
      }
    }

  }

  // Creates a category section containing buttons (no longer collapsible)
  function createCategorySection(category, buttons) {
    const sectionContainer = document.createElement('div');

    // Apply the exact styles provided by the user
    sectionContainer.style.backgroundColor = 'white';
    sectionContainer.style.border = '1px solid rgb(221, 219, 218)';
    sectionContainer.style.borderRadius = '4px';
    sectionContainer.style.margin = '0px';
    // width, min-width, max-width, and flex-grow commented out as per user's style
    // sectionContainer.style.width = '300px';
    // sectionContainer.style.minWidth = '250px';
    // sectionContainer.style.maxWidth = '350px';
    // sectionContainer.style.flexGrow = '1';
    sectionContainer.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 1px 3px';
    sectionContainer.style.display = 'flex';
    sectionContainer.style.flexDirection = 'column';

    // Simple category header (no toggle functionality)
    const sectionHeader = document.createElement('div');
    sectionHeader.style.backgroundColor = '#e3f3ff'; // Lighter blue background
    sectionHeader.style.borderBottom = '1px solid #dddbda';
    sectionHeader.style.padding = '6px 12px'; // Reduced padding
    sectionHeader.style.borderRadius = '4px 4px 0 0';

    // Category title
    const categoryTitle = document.createElement('span');
    categoryTitle.textContent = category;
    categoryTitle.style.fontWeight = 'bold';
    categoryTitle.style.fontSize = '0.85rem'; // Smaller font
    categoryTitle.style.color = '#16325c';

    // Add title to header
    sectionHeader.appendChild(categoryTitle);
    sectionContainer.appendChild(sectionHeader);

    // Button container for all buttons in this category
    const buttonContainer = document.createElement('div');
    buttonContainer.style.padding = '10px';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.justifyContent = 'flex-start';
    buttonContainer.style.alignItems = 'flex-start';
    buttonContainer.style.minHeight = '50px';
    buttonContainer.style.width = '100%';

    // Add all buttons to the container
    buttons.forEach(buttonConfig => {
      buttonContainer.appendChild(createButton(buttonConfig));
    });

    sectionContainer.appendChild(buttonContainer);

    return sectionContainer;
  }

  // Track the last report URL we processed and monitoring attempts
  let lastReportUrl = '';
  let reportMonitorAttempts = 0;
  let reportMonitorActive = false;
  const MAX_REPORT_MONITOR_ATTEMPTS = 30; // Try for up to ~5 minutes (30 * 10 seconds)

  // Dedicated monitor function for report pages that keeps trying to enhance
  async function monitorReportPage() {
    if (!window.location.href.toLowerCase().includes('report/')&&!window.location.href.toLowerCase().includes('reports/')) {
      reportMonitorActive = false;
      return; // Stop monitoring if we navigated away
    }

    // Reset monitoring counter when URL changes to a new report
    const currentUrl = window.location.href;
    if (currentUrl !== lastReportUrl) {
      lastReportUrl = currentUrl;
      reportMonitorAttempts = 0;
    }

    // Don't keep trying forever
    if (reportMonitorAttempts >= MAX_REPORT_MONITOR_ATTEMPTS) {
      console.log('Giving up on enhancing report page after maximum attempts');
      reportMonitorActive = false;
      return;
    }

    // Check for loading indicators
    const spinner = document.querySelector('.slds-spinner, .loading-spinner, .reportPage-loading');
    const isLoading = spinner && spinner.offsetParent !== null;

    if (isLoading) {
      console.log('Report is still loading, waiting for completion...');
    } else {
      let reportHeadersTable = await getReportTable(true);
      let reportTable = await getReportTable();

      if (!reportHeadersTable || !reportTable) {
        console.log('No report table found, will try again later');
        return;
      }

      let tableRows = reportTable.querySelectorAll('tr');
      if (tableRows.length === 0) {
        console.log('No table rows found in report table');
        return;
      }
      let needsEnhancement = tableRows.length > 0; // Only enhance if there are rows

      // Sample a few rows to check if buttons are already added
      const samplesToCheck = Math.min(5, tableRows.length);
      for (let i = 0; i < samplesToCheck; i++) {
        if (tableRows[i]?.querySelector('.sa-activity-dropdown-btn')) {
          needsEnhancement = false;
          break;
        }
      }

      if (needsEnhancement) {
        console.log('Found report table that needs enhancement');
        enhanceReportPage();
      } else if (tableRows.length === 0) {
        console.log('Report table found but has no data rows yet');
      } else {
        console.log('Report table is already fully enhanced');
      }

      reportMonitorAttempts++;
    }


    // Schedule next check if still monitoring
    if (reportMonitorAttempts < MAX_REPORT_MONITOR_ATTEMPTS) {
      setTimeout(monitorReportPage, 10000); // Check every 10 seconds
    } else {
      reportMonitorActive = false;
    }
  }

  // Function to handle specific URL patterns
  function checkCurrentPage() {
    console.log('Checking current page');

    if (window.location.href.toLowerCase().includes('report/')||window.location.href.toLowerCase().includes('reports/')) {
      // Check if the button container is on the page
      const buttonContainer = document.getElementById('tampermonkey_button_container');
      if (buttonContainer) {
        console.log('Button container found on page');
        // Remove the button container
        buttonContainer.remove();
        // Scroll to the top of the screen
        window.scrollTo(0, 0);
      }

      // Update the last report URL
      lastReportUrl = window.location.href;

      // Call the function to enhance report page with quickbuttons
      enhanceReportPage();

      // Start persistent monitoring for report table if not already active
      if (!reportMonitorActive) {
        reportMonitorActive = true;
        reportMonitorAttempts = 0;
        console.log('Starting persistent report monitoring');
        setTimeout(monitorReportPage, 3000); // First check after 3 seconds
      }

      return;
    }
    else {
      let checkForContainer = document.getElementById('tampermonkey_button_container');
      if (checkForContainer && checkForContainer.childElementCount > 1) { return; }
    }

    // Create button container and add categorized quick buttons
    createButtonContainer().then(container => {
      if (container) {
        // Clear existing buttons if any
        container.innerHTML = '';

        // Add each category as a collapsible section
        quickButtonConfigs.forEach(categoryConfig => {
          const categorySection = createCategorySection(categoryConfig.category, categoryConfig.buttons);
          container.appendChild(categorySection);
        });
        //scroll to the top of the screen
        window.scrollTo(0, 0);
        console.log('Added categorized quick buttons to container');
      }
    }).catch(error => {
      console.error('Error creating button container:', error);
    });
  }

  // Function to enhance report pages with quick action buttons
  async function enhanceReportPage() {
    console.log('Enhancing report page with SA activity buttons');

    try {
      // Check if the report content is still loading (spinner visible)
      const spinner = document.querySelector('.slds-spinner, .loading-spinner, .reportPage-loading');
      if (spinner && spinner.offsetParent !== null) { // Spinner is visible
        console.log('Report is still loading (spinner visible), will try again later');
        return;
      }



      let reportHeadersTable = await getReportTable(true);
      let reportTable = await getReportTable();

      if (!reportHeadersTable || !reportTable) {
        console.log('No report table found, will try again later');
        return;
      }
      let tableHeaderRows = reportHeadersTable.querySelectorAll('tr');
      let tableRows = reportTable.querySelectorAll('tr');

      let opportunityNameIndex = 0;
      for (let row of tableHeaderRows) {
        let cells = row.querySelectorAll('th');
        if (cells.length === 0) {
          console.log('No cells found in table row');
          continue;
        }
        for (let tableCell of cells) {
          let cell = tableCell.querySelector('.lightning-table-cell-measure-header-value');
          if(!cell) cell = (tableCell.getAttribute('class').indexOf('lightning-table-cell-measure-header-value')>-1)?tableCell:null;
          if(!cell) continue;
          let cellText = cell.textContent ? cell.textContent.trim() : (cell.innerText ? cell.innerText.trim() : '');
          console.log(`Found header at index ${opportunityNameIndex}:`, cellText);
          if (cellText.indexOf('Opportunity Name')==-1) {
          
            opportunityNameIndex++;
          }
          else {
            console.log('Found Opportunity Name column at index', opportunityNameIndex);
            break;
          }
        }
      }


      // Process each row to add activity buttons
      for (let rowIndex = 1; rowIndex < tableRows.length; rowIndex++) {
        const row = tableRows[rowIndex];
        const cells = row.querySelectorAll('td');
        if (cells.length <= opportunityNameIndex) {
          return; // Skip rows without enough cells
        }
        const oppNameCell = cells[opportunityNameIndex - 1];


        // Get opportunity name value (will be used when creating activities)
        const opportunityNameText = oppNameCell.querySelector('.wave-table-cell-text').getAttribute('data-tooltip');
        const activityButtonContainer = oppNameCell.querySelector('.sa-activity-btn-container')
        if (!opportunityNameText || activityButtonContainer) {
          return; // Skip rows without an opportunity name
        }

        // Create dropdown button container for styling
        const btnContainer = document.createElement('span');
        btnContainer.className = 'sa-activity-btn-container';
        btnContainer.style.display = 'inline-block';
        btnContainer.style.marginLeft = '8px';
        btnContainer.style.position = 'relative';
        btnContainer.style.verticalAlign = 'middle';

        // Create dropdown button
        const dropdownBtn = document.createElement('button');
        dropdownBtn.className = 'sa-activity-dropdown-btn slds-button slds-button_brand slds-button_icon-border-filled';
        dropdownBtn.setAttribute('data-opportunity', opportunityNameText);
        dropdownBtn.setAttribute('data-row', rowIndex);
        dropdownBtn.innerHTML = '+ Activity';
        dropdownBtn.title = 'Add SA/CSM Activity to ' + opportunityNameText;
        dropdownBtn.style.fontSize = '0.75rem';
        dropdownBtn.style.lineHeight = '1.25rem';
        dropdownBtn.style.padding = '1px 8px';
        dropdownBtn.style.color = 'white';
        dropdownBtn.style.backgroundColor = '#0070d2';
        dropdownBtn.style.border = '1px solid #0070d2';
        dropdownBtn.style.borderRadius = '4px';
        dropdownBtn.style.whiteSpace = 'nowrap';
        dropdownBtn.style.fontWeight = 'normal';
        dropdownBtn.style.width = '200px';

        // Add hover effect
        dropdownBtn.onmouseover = function () {
          this.style.backgroundColor = '#005fb2';
          this.style.borderColor = '#005fb2';
        };
        dropdownBtn.onmouseout = function () {
          this.style.backgroundColor = '#0070d2';
          this.style.borderColor = '#0070d2';
        };

        // Add click event to show dropdown menu
        dropdownBtn.addEventListener('click', function (event) {
          event.stopPropagation();
          event.preventDefault();
          showReportActivityDropdown(event, this.getAttribute('data-opportunity'));
        });

        // Add the button to the container, then add container to the cell
        btnContainer.appendChild(dropdownBtn);
        oppNameCell.appendChild(btnContainer);
      };

      console.log('Enhanced report table with SA activity buttons');

      // Add a global click handler to close any open dropdowns when clicking elsewhere
      document.addEventListener('click', closeAllReportDropdowns);

      // Add a scroll handler to close dropdowns when scrolling the table
      reportTable.closest('.slds-scrollable_x, .slds-scrollable_y')?.addEventListener('scroll', closeAllReportDropdowns);
      window.addEventListener('scroll', closeAllReportDropdowns);

    } catch (error) {
      console.error('Error enhancing report page:', error);
    }
  }

  // Function to close all report dropdowns
  function closeAllReportDropdowns() {
    const dropdown = document.getElementById('report_activity_dropdown');
    if (dropdown) dropdown.remove();

    const submenu = document.getElementById('report_submenu');
    if (submenu) submenu.remove();
  }

  // Function to show activity dropdown menu in reports
  function showReportActivityDropdown(event, opportunityName) {
    // Prevent event bubbling
    event.stopPropagation();

    // Remove any existing dropdowns
    closeAllReportDropdowns();

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.id = 'report_activity_dropdown';
    dropdown.className = 'slds-dropdown slds-dropdown_left';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '9100';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #dddbda';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    dropdown.style.maxHeight = '500px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.minWidth = '460px';

    // Create dropdown header
    const header = document.createElement('div');
    header.className = 'slds-dropdown__header';
    header.style.padding = '8px 12px';
    header.style.borderBottom = '1px solid #dddbda';
    header.style.backgroundColor = '#f3f2f2';
    header.style.fontSize = '0.85rem';
    header.style.fontWeight = 'bold';
    header.textContent = 'Add SA Activity to ' + opportunityName;

    dropdown.appendChild(header);

    // Loop through all categories and buttons
    quickButtonConfigs.forEach(category => {
      // Create category header
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'slds-dropdown__item--category';
      categoryHeader.style.padding = '8px 12px';
      categoryHeader.style.fontSize = '0.75rem';
      categoryHeader.style.fontWeight = 'bold';
      categoryHeader.style.color = '#706e6b';
      categoryHeader.style.textTransform = 'uppercase';
      categoryHeader.style.backgroundColor = '#f3f2f2';
      categoryHeader.style.borderBottom = '1px solid #dddbda';
      categoryHeader.style.borderTop = '1px solid #dddbda';

      categoryHeader.textContent = category.category;

      dropdown.appendChild(categoryHeader);

      // Add buttons from this category
      category.buttons.forEach(buttonConfig => {
        const item = document.createElement('div');
        item.className = 'slds-dropdown__item';
        item.setAttribute('role', 'presentation');
        item.style.padding = '8px 12px';
        item.style.borderBottom = '1px solid #f4f6f9';
        item.style.cursor = 'pointer';

        // Create button display
        const link = document.createElement('a');
        link.setAttribute('role', 'menuitem');
        link.className = 'slds-truncate';
        link.style.display = 'flex';
        link.marginLeft="-5px"
        link.style.justifyContent = 'space-between';
        link.style.alignItems = 'center';
        link.style.width = '100%';
        link.style.color = '#16325c';

        // Button name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = buttonConfig.name;
        link.appendChild(nameSpan);

        // For buttons with tag options or activity options, add arrow indicator
        if (buttonConfig.tagOptions || buttonConfig.activityOptions) {
          const arrowSpan = document.createElement('span');
          arrowSpan.innerHTML = '&rsaquo;';
          arrowSpan.style.fontSize = '1.2rem';
          arrowSpan.style.fontWeight = 'bold';
          link.appendChild(arrowSpan);

          // Add event listener for hover to show submenu
          item.addEventListener('mouseenter', (subEvent) => {
            showReportSubmenu(subEvent, buttonConfig, opportunityName);
          });
        } else {
          // Standard button - direct click
          link.addEventListener('click', () => {
            // Close the dropdown
            dropdown.remove();

            // Execute the activity creation with this opportunity name
            applyActivityToOpportunity(buttonConfig, opportunityName);
          });
        }

        item.appendChild(link);
        dropdown.appendChild(item);
      });
    });

    // Position dropdown
    const rect = event.target.getBoundingClientRect();

    // Get viewport dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    // Calculate dropdown width and height (approximate)
    const dropdownWidth = 250;
    const dropdownMaxHeight = 500; // Max height, actual may be less

    // Default position below the button
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    // Check for right edge overflow
    if (left + dropdownWidth > viewportWidth) {
      left = Math.max(5, viewportWidth - dropdownWidth - 10);
    }

    // Check for bottom edge overflow
    if (top + dropdownMaxHeight > viewportHeight + window.scrollY) {
      // Position above the button if there's not enough space below
      top = Math.max(5 + window.scrollY, rect.top + window.scrollY - dropdownMaxHeight - 5);
    }

    // Apply calculated position
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;

    // Add dropdown to page
    document.body.appendChild(dropdown);

    // Close dropdown when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && e.target !== event.target) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      });
    }, 0);
  }

  // Function to show submenu for tag options or activity options
  function showReportSubmenu(event, buttonConfig, opportunityName) {
    // Remove any existing submenu
    const existingSubmenu = document.getElementById('report_submenu');
    if (existingSubmenu) {
      existingSubmenu.remove();
    }

    // Create submenu container
    const submenu = document.createElement('div');
    submenu.id = 'report_submenu';
    submenu.className = 'slds-dropdown slds-dropdown_submenu slds-dropdown_right';
    submenu.style.position = 'absolute';
    submenu.style.zIndex = '9101';
    submenu.style.backgroundColor = 'white';
    submenu.style.border = '1px solid #dddbda';
    submenu.style.borderRadius = '4px';
    submenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    submenu.style.maxHeight = '400px';
    submenu.style.overflowY = 'auto';
    submenu.style.minWidth = '280px';
    submenu.style.marginLeft = "-5px"

    // Create submenu header
    const header = document.createElement('div');
    header.className = 'slds-dropdown__header';
    header.style.padding = '8px 12px';
    header.style.borderBottom = '1px solid #dddbda';
    header.style.backgroundColor = '#f3f2f2';
    header.style.fontSize = '0.85rem';
    header.style.fontWeight = 'bold';

    // Set appropriate header text
    if (buttonConfig.tagOptions) {
      header.textContent = 'Tag';
    } else if (buttonConfig.activityOptions) {
      header.textContent = 'Activity';
    }

    submenu.appendChild(header);

    // Add options to submenu
    const optionsList = buttonConfig.tagOptions || buttonConfig.activityOptions || [];

    optionsList.forEach(option => {
      const item = document.createElement('div');
      item.className = 'slds-dropdown__item';
      item.setAttribute('role', 'presentation');
      item.style.padding = '8px 12px';
      item.style.borderBottom = '1px solid #f4f6f9';
      item.style.cursor = 'pointer';
      item.style.hoverBackgroundColor = '#f4f6f9';
      item.style.marginLeft = "-5px"
      const link = document.createElement('a');
      link.setAttribute('role', 'menuitem');
      link.className = 'slds-truncate';
      link.style.display = 'block';
      link.style.width = '100%';
      link.style.color = '#16325c';
      link.textContent = option;

      // Add hover effect
      item.onmouseover = function () {
        this.style.backgroundColor = '#f4f6f9';
      };
      item.onmouseout = function () {
        this.style.backgroundColor = 'white';
      };

      // Add click handler
      link.addEventListener('click', () => {
        // Remove dropdowns
        submenu.remove();
        const mainDropdown = document.getElementById('report_activity_dropdown');
        if (mainDropdown) mainDropdown.remove();

        // Create new config with the selected option
        let newConfig = { ...buttonConfig };

        if (buttonConfig.tagOptions) {
          newConfig.tag = option;
        } else if (buttonConfig.activityOptions) {
          newConfig.activity = option;
        }

        // Apply the activity with this configuration
        applyActivityToOpportunity(newConfig, opportunityName);
      });

      item.appendChild(link);
      submenu.appendChild(item);
    });

    // Position submenu next to the parent menu item
    const rect = event.target.getBoundingClientRect();
    submenu.style.top = `${rect.top + window.scrollY}px`;
    submenu.style.left = `${rect.right + window.scrollX + 5}px`;

    // Make sure the submenu fits on screen
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (rect.right + 285 > viewportWidth) {
      submenu.style.left = `${rect.left + window.scrollX - 285}px`;
    }

    // Add submenu to page
    document.body.appendChild(submenu);

    // Remove submenu when mouse leaves both the item and submenu
    event.target.addEventListener('mouseleave', function handleMouseLeave(e) {
      // Check if mouse moved to submenu
      const submenuRect = submenu.getBoundingClientRect();
      if (e.clientX < submenuRect.left || e.clientX > submenuRect.right ||
        e.clientY < submenuRect.top || e.clientY > submenuRect.bottom) {

        // Add a small delay to prevent flicker
        setTimeout(() => {
          // Only remove if mouse is not over submenu
          if (!isMouseOverElement(submenu, e)) {
            submenu.remove();
            event.target.removeEventListener('mouseleave', handleMouseLeave);
          }
        }, 300);
      }
    });

    // Also handle mouse leaving submenu
    submenu.addEventListener('mouseleave', function (e) {
      setTimeout(() => {
        // Only remove if mouse is not over parent item and not over submenu
        if (!isMouseOverElement(event.target, e) && !isMouseOverElement(submenu, e)) {
          submenu.remove();
        }
      }, 300);
    });
  }

  // Helper function to check if mouse is over an element
  function isMouseOverElement(element, mouseEvent) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const mouseX = mouseEvent.clientX;
    const mouseY = mouseEvent.clientY;

    return (mouseX >= rect.left && mouseX <= rect.right &&
      mouseY >= rect.top && mouseY <= rect.bottom);
  }

  async function getReportTable(headers = false) {
    let reportTable = null;
    let containers = document.getElementsByTagName("iframe");
    if (containers.length == 0) { return null; }

    for (let container of containers) {
      if (container.getAttribute('data-aura-class') === 'reportsReportBuilder') {
        let contentWindow = container.contentWindow;
        if (!contentWindow) { return null; }

        let iframeDocument = contentWindow.document;
        if (!iframeDocument) { return null; }

        let tables = iframeDocument.getElementsByTagName('table');
        if (!headers && tables.length > 0) {
          for (let table of tables) {
            if (table.getAttribute('class').indexOf('data-grid-full-table')>-1) {
              return table;
            }
          }
        }
        for (let table2 of tables) {
          if (headers && table2.querySelector('.wave-table-cell-measure-header-text[data-tooltip="Opportunity Name"]')) {
            return table2;
          }

        }

      }
    }


    return null;
  }

  // Function to apply an activity using a specific opportunity name
  function applyActivityToOpportunity(config, opportunityName) {
    // Store the opportunity name for later use
    const storedOpportunityName = opportunityName;


    config.opportunityName = storedOpportunityName;

    // Call the normal apply values function
    applyValues(config)
      .then(result => {
        console.log('Activity added successfully for', storedOpportunityName);
      })
      .catch(error => {
        console.error('Error adding activity:', error);
        // Show error notification
        showNotificationModal(
          "Error Adding Activity",
          "Failed to add activity for " + storedOpportunityName + ": " + error.message,
          true,
          5000
        );
      })
  }

  // Listen for page URL changes (for Single Page Apps like Salesforce)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('URL changed, checking for buttons');
      checkCurrentPage();
    }
  }).observe(document, { subtree: true, childList: true });

  // Periodically check if buttons need to be refreshed
  setInterval(async () => {
      if (window.location.href.toLowerCase().includes('report/')||window.location.href.toLowerCase().includes('reports/')) {
        console.log('Report page found, checking for buttons');
      // For report pages, check if we need to enhance the table
      // (It might have loaded after the page itself)
      // Find the report table
      let reportHeadersTable = await getReportTable(true);
      let reportTable = await getReportTable();

      if (!reportHeadersTable || !reportTable) {
        console.log('No report table found, will try again later');
        return;
      }
      let tableHeaderRows = reportHeadersTable.querySelectorAll('tr');
      let tableRows = reportTable.querySelectorAll('tr');

      let opportunityNameIndex = 0;
      for (let row of tableHeaderRows) {
        let cells = row.querySelectorAll('th');
        if (cells.length === 0) {
          console.log('No cells found in table row');
          continue;
        }
        for (let tableCell of cells) {
          let cell = tableCell.querySelector('.lightning-table-cell-measure-header-value');
          if(!cell) cell = (tableCell.getAttribute('class').indexOf('lightning-table-cell-measure-header-value')>-1)?tableCell:null;
          if(!cell) continue;
          let cellText = cell.textContent ? cell.textContent.trim() : (cell.innerText ? cell.innerText.trim() : '');
          console.log(`Found header at index ${opportunityNameIndex}:`, cellText);
          if (cellText.indexOf('Opportunity Name')==-1) {
            opportunityNameIndex++;
          }
          else {
            console.log('Found Opportunity Name column at index', opportunityNameIndex);
            break;
          }
        }
      }

      let buttonsAdded = true;
      // Process each row to add activity buttons
      for (let rowIndex = 2; rowIndex < tableRows.length; rowIndex++) {
        let row = tableRows[rowIndex];
        const cells = row.querySelectorAll('td');
        if (cells.length <= opportunityNameIndex) {
          return; // Skip rows without enough cells
        }
        const oppNameCell = cells[opportunityNameIndex - 1];



        if (!oppNameCell.querySelector('.sa-activity-dropdown-btn')) {
          buttonsAdded = false;
          break;
        }
      }

      if (!buttonsAdded) {
        console.log('Report table found but activity buttons not added yet, enhancing now');
        enhanceReportPage();
      }


      // Also check if new rows were added to the table (pagination, etc.)
      /* if (tableHeaderRows.length > 0) {
        let hasUnenhancedRows = false;

        // Check last 10 rows or all rows if less than 10
        const startIndex = Math.max(0, tableHeaderRows.length - 10);
        for (let i = startIndex; i < tableHeaderRows.length; i++) {
          if (tableHeaderRows[i] && !tableHeaderRows[i].querySelector('.sa-activity-dropdown-btn')) {
            hasUnenhancedRows = true;
            break;
          }
        }

        if (hasUnenhancedRows) {
          console.log('Found new unenhanced rows in report table, enhancing now');
          enhanceReportPage();
        }
      } */
    }
    else {
      // For non-report pages, check for the button container
      checkCurrentPage();
    }
  }, 3000); // Check every 3 seconds
})();