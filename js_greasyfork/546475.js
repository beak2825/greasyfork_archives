// ==UserScript==
// @name         Job Application Auto-Filler - WorkDay
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Auto-fill job application forms on WorkDay by first adding all sections, then filling them.
// @author       hacker09
// @match        https://*.myworkday.com/*
// @icon         https://i.imgur.com/3R9QyLR.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546475/Job%20Application%20Auto-Filler%20-%20WorkDay.user.js
// @updateURL https://update.greasyfork.org/scripts/546475/Job%20Application%20Auto-Filler%20-%20WorkDay.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Configuration - Your actual data.
  const formData = {
    jobs: [
      { //Newest job first
        title: "Senior Software Developer",
        company: "Tech Solutions Inc.",
        location: "San Francisco",
        startMonth: "01",
        startYear: "2022",
        currentlyWork: true, //Set to 'true' for a current job
        endMonth: "", //Leave empty if currently working here
        endYear: "", //Leave empty if currently working here
        summary: "• Led a team of 5 developers in creating a new e-commerce platform.\n\n• Wrote high-quality, scalable code using React and Node.js.\n\n• Optimized application performance, resulting in a 30% reduction in load times."
      },
      { //Older job
        title: "IT Support Intern",
        company: "Global Innovations LLC.",
        location: "New York",
        startMonth: "06",
        startYear: "2021",
        currentlyWork: false,
        endMonth: "12",
        endYear: "2021",
        summary: "• Provided technical assistance to over 200 employees.\n\n• Managed user accounts and system permissions.\n\n• Documented and resolved IT support tickets efficiently."
      }
    ],
    education: [
      { //Most recent education first
        schoolName: "State University",
        degree: "BS", //Use abbreviations like BS, MS, PhD, or GED
        fieldOfStudy: "Computer Science",
        startYear: "2018",
        endYear: "2022"
      },
      { //Older education
        schoolName: "Community College",
        degree: "GED",
        fieldOfStudy: "Information Technology",
        startYear: "2016",
        endYear: "2018"
      }
    ],
    skills: "JavaScript, React, Node.js, HTML, CSS, SQL, Python, Project Management, Team Leadership, Agile Methodologies, AWS, Docker", //Workday parses skills as individual keywords, strips formatting, splits combined terms, and alphabetizes them for standardized search and matching. Proper skill list organized into categories
    languages: [
      {
        name: "English",
        isNative: false,
        listeningproficiency: "3 - Intermediate",
        readingproficiency: "3 - Intermediate",
        speakingproficiency: "2 - Classroom Study",
        writingproficiency: "2 - Classroom Study"
      },
      {
        name: "Spanish",
        isNative: false,
        listeningproficiency: "3 - Intermediate",
        readingproficiency: "3 - Intermediate",
        speakingproficiency: "2 - Classroom Study",
        writingproficiency: "2 - Classroom Study"
      }
    ]
  };

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function fillInputField(element, value) {
    if (!element) return;
    element.focus();
    await delay(100);
    element.value = value;
    element.dispatchEvent(new Event('input', {
      bubbles: true
    }));
    element.dispatchEvent(new Event('change', {
      bubbles: true
    }));
    element.blur();
    await delay(100);
  }

  async function fillDegreeField(element, value) {
    if (!element) return;
    element.focus();
    element.select();
    element.click(); //Click to open dropdown
    await delay(500);

    //Type value to filter options
    element.value = '';
    for (let char of value) {
      element.value += char;
      element.dispatchEvent(new KeyboardEvent('keydown', {
        key: char,
        bubbles: true
      }));
      element.dispatchEvent(new KeyboardEvent('keypress', {
        key: char,
        bubbles: true
      }));
      element.dispatchEvent(new Event('input', {
        bubbles: true
      }));
      element.dispatchEvent(new KeyboardEvent('keyup', {
        key: char,
        bubbles: true
      }));
      await delay(100);
    }

    //Press Enter to filter/search
    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true
    }));
    element.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true
    }));
    await delay(500); //was 1000

    //Find and click matching option - (Exclude already selected items)
    const dropdownOptions = document.querySelectorAll('[data-automation-id="promptOption"]');

    for (const option of dropdownOptions) {
      const optionText = (option.textContent || option.dataset.automationLabel || '').trim();

      //Skip if this is a selected item (pill)
      const parentContainer = option.closest('[data-automation-id="selectedItem"]');
      if (parentContainer) {
        continue;
      }

      if (optionText === value || optionText.toLowerCase() === value.toLowerCase()) {
        const clickTarget = option.closest('[role="option"]') || option.parentElement.closest('[role="option"]') || option;

        //Try clicking the radio button inside
        const radioBtn = clickTarget.querySelector('input[type="radio"]') || clickTarget.querySelector('[data-automation-id="radioBtn"]');
        if (radioBtn) {
          radioBtn.click();
          radioBtn.dispatchEvent(new Event('change', {
            bubbles: true
          }));
        } else {
          clickTarget.click();
        }
        await delay(500);
        return;
      }
    }
  }

  async function fillDateFields(monthElement, yearElement, month, year) {
    if (monthElement && month) {
      monthElement.click();
      monthElement.focus();
      await delay(100);
      monthElement.select();
      monthElement.value = '';
      for (let char of month) {
        monthElement.value += char;
        monthElement.dispatchEvent(new KeyboardEvent('keydown', {
          key: char,
          code: `Digit${char}`,
          bubbles: true
        }));
        monthElement.dispatchEvent(new KeyboardEvent('keypress', {
          key: char,
          code: `Digit${char}`,
          bubbles: true
        }));
        monthElement.dispatchEvent(new Event('input', {
          bubbles: true
        }));
        monthElement.dispatchEvent(new KeyboardEvent('keyup', {
          key: char,
          code: `Digit${char}`,
          bubbles: true
        }));
        await delay(100);
      }
      monthElement.dispatchEvent(new Event('change', {
        bubbles: true
      }));
      await delay(100);
    }

    if (yearElement && year) {
      yearElement.click();
      yearElement.focus();
      await delay(100);
      yearElement.select();
      yearElement.value = '';
      for (let char of year) {
        yearElement.value += char;
        yearElement.dispatchEvent(new KeyboardEvent('keydown', {
          key: char,
          code: `Digit${char}`,
          bubbles: true
        }));
        yearElement.dispatchEvent(new KeyboardEvent('keypress', {
          key: char,
          code: `Digit${char}`,
          bubbles: true
        }));
        yearElement.dispatchEvent(new Event('input', {
          bubbles: true
        }));
        yearElement.dispatchEvent(new KeyboardEvent('keyup', {
          key: char,
          code: `Digit${char}`,
          bubbles: true
        }));
        await delay(100);
      }
      yearElement.dispatchEvent(new Event('change', {
        bubbles: true
      }));
      yearElement.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        bubbles: true
      }));
      await delay(100);
    }
  }

  async function selectDropdownOption(triggerElement, valueToSelect) {
    if (!triggerElement || !valueToSelect) return;
    triggerElement.click();
    await delay(500); //was 1000
    const options = document.querySelectorAll('[data-automation-id="promptOption"]');
    for (const option of options) {
      const optionText = (option.textContent || option.dataset.automationLabel || '').trim();
      if (optionText.toLowerCase() === valueToSelect.toLowerCase()) {
        option.closest('[role="option"]')?.click();
        await delay(500);
        return;
      }
    }
    document.body.click(); //Click away to close dropdown if no match found
    await delay(200);
  }

  //Click all "Add" buttons first
  async function addSections() {
    const addBtns = document.querySelectorAll('[data-automation-id="panelSetAddButton"]');
    if (addBtns.length === 0) return;

    //Add job sections (assumes 1 is already visible)
    for (let i = 1; i < formData.jobs.length; i++) {
      addBtns[0]?.click(); //Assumes first add button is for jobs
      await delay(500); //was 1500
    }

    //Add education sections (assumes 1 is already visible)
    for (let i = 1; i < formData.education.length; i++) {
      addBtns[1]?.click(); //Assumes second add button is for education
      await delay(500); //was 1500
    }

    //Add language sections (assumes it starts with 0)
    const lastAddBtn = addBtns[addBtns.length - 1];
    for (let i = 0; i < formData.languages.length; i++) {
      lastAddBtn?.click(); //Assumes last add button is for languages
      await delay(500); //was 1500
    }
  }

  async function fillJobSection() {
    for (let i = 0; i < formData.jobs.length; i++) {
      const job = formData.jobs[i];
      const titleInputs = document.querySelectorAll('input[id*="jobHistoryTitle"]');
      await fillInputField(titleInputs[i], job.title);
      const companyInputs = document.querySelectorAll('input[id*="jobHistoryCompany"]');
      await fillInputField(companyInputs[i], job.company);
      const locationInputs = document.querySelectorAll('input[id*="jobHistoryLocation"]');
      await fillInputField(locationInputs[i], job.location);
      const allMonthInputs = document.querySelectorAll('input[id*="dateSectionMonth"]');
      const allYearInputs = document.querySelectorAll('input[id*="dateSectionYear"]');
      await fillDateFields(allMonthInputs[i * 2], allYearInputs[i * 2], job.startMonth, job.startYear);
      const currentlyWorkInputs = document.querySelectorAll('input[id*="currentlyWorkHere"]');
      if (currentlyWorkInputs[i] && job.currentlyWork) {
        if (!currentlyWorkInputs[i].checked) currentlyWorkInputs[i].click();
      }
      if (!job.currentlyWork) {
        await fillDateFields(allMonthInputs[i * 2 + 1], allYearInputs[i * 2 + 1], job.endMonth, job.endYear);
      }
      const summaryTextareas = document.querySelectorAll('textarea[id*="jobSummary"]');
      await fillInputField(summaryTextareas[i], job.summary);
    }
  }

  async function fillEducationSection() {
    for (let i = 0; i < formData.education.length; i++) {
      const edu = formData.education[i];

      //Always query inputs fresh inside loop
      const schoolInputs = document.querySelectorAll('input[id*="schoolName"]');
      const degreeInputs = document.querySelectorAll('input[id*="schoolDegrees"]');
      const fieldInputs = document.querySelectorAll('input[id*="fieldOfStudy"]');
      const allYearInputs = document.querySelectorAll('input[id*="dateSectionYear"]');

      await fillInputField(schoolInputs[i], edu.schoolName);
      await fillDegreeField(degreeInputs[i], edu.degree);
      await delay(500);
      await fillInputField(fieldInputs[i], edu.fieldOfStudy);
      await delay(500);

      //Fill years immediately, using proper offsets after job entries
      const jobCount = formData.jobs.length;
      const eduStartIndex = jobCount * 2 + i * 2;
      const eduEndIndex = eduStartIndex + 1;

      await fillDateFields(null, allYearInputs[eduStartIndex], '', edu.startYear);
      await fillDateFields(null, allYearInputs[eduEndIndex], '', edu.endYear);
    }
  }

  async function fillSkillsSection() {
    const skillsTextarea = document.querySelector('textarea[id*="skills"]');
    await fillInputField(skillsTextarea, formData.skills);
  }

  async function fillLanguagesSection() {
    for (let i = 0; i < formData.languages.length; i++) {
      const lang = formData.languages[i];

      //Select language name
      const langSelectWidgets = document.querySelectorAll('[data-automation-id="selectWidget"][id*="languages"]');
      await selectDropdownOption(langSelectWidgets[i], lang.name);

      //Check "native language" if applicable
      const nativeCheckboxes = document.querySelectorAll('input[id*="myNativeLanguage"]');
      if (nativeCheckboxes[i] && lang.isNative && !nativeCheckboxes[i].checked) {
        nativeCheckboxes[i].click();
      }

      //Select proficiency levels
      const allProficiencyTriggers = document.querySelectorAll('[data-automation-id="selectWidget"][id*="langProficiencies"]');
      const proficiencyTriggersForCurrentLang = Array.from(allProficiencyTriggers).slice(i * 4, i * 4 + 4);

      if (proficiencyTriggersForCurrentLang.length >= 4) {
        await selectDropdownOption(proficiencyTriggersForCurrentLang[0], lang.listeningproficiency);
        await selectDropdownOption(proficiencyTriggersForCurrentLang[1], lang.readingproficiency);
        await selectDropdownOption(proficiencyTriggersForCurrentLang[2], lang.speakingproficiency);
        await selectDropdownOption(proficiencyTriggersForCurrentLang[3], lang.writingproficiency);
      }
    }
  }

  async function handleThreePostFillQuestions() {
    //Click Next to proceed to questions
    document.querySelector('[title="Next"]').click();

    //Wait for the "legal right to work" question to appear
    await new Promise(resolve => {
      const checkForQuestion = () => {
        if (document.body.textContent.includes('Do you have the legal')) {
          resolve();
        } else {
          setTimeout(checkForQuestion, 1500);
        }
      };
      checkForQuestion();
    });

    //Get all 3 dropdowns
    const dropdowns = [...document.querySelectorAll('li[role="presentation"]:nth-child(1) div[id*="dropDownSelectList"]')].filter(el => /-.*-/.test(el.id));

    //Question 1: Yes
    dropdowns[0].click();
    //await delay(500); //was enabled
    let options = document.querySelectorAll('[data-automation-activepopup="true"] [role="option"]');
    for(let option of options) {
      if(option.textContent.trim() === 'Yes') {
        option.click();
        break;
      }
      await delay(1500);
    }

    //Question 2: No
    dropdowns[1].click();
    //await delay(500); //was enabled
    options = document.querySelectorAll('[data-automation-activepopup="true"] [role="option"]');
    for(let option of options) {
      if(option.textContent.trim() === 'No') {
        option.click();
        break;
      }
      await delay(1500);
    }

    //Question 3: Legal - Yes
    dropdowns[2].click();
    //await delay(500); //was enabled
    options = document.querySelectorAll('[data-automation-activepopup="true"] [role="option"]');
    for(let option of options) {
      if(option.textContent.trim() === 'Yes') {
        option.click();
        break;
      }
      await delay(1500);
    }

    //Click Next again
    document.querySelector('[title="Next"]').click();
  }

  async function handleFinalHistoryQuestion() {
    //Wait for the criminal history question to appear
    await new Promise(resolve => {
      const checkForQuestion = () => {
        if (document.body.textContent.includes('guilty')) {
          resolve();
        } else {
          setTimeout(checkForQuestion, 1500);
        }
      };
      checkForQuestion();
    });

    //Find and click the dropdown
    document.querySelectorAll('div[id*="dropDownSelectList"]')[1].click();
    //Select "No"
    const options = document.querySelectorAll('[data-automation-activepopup="true"] [role="option"]');
    for(let option of options) {
      if(option.textContent.trim() === 'No') {
        option.click();
        break;
      }
      await delay(1500);
    }

    //Click Next
    document.querySelector('[title="Next"]').click();
  }

  //NEW main function to orchestrate adding and then filling
  async function runAutoFiller() {
    const triggerBtn = document.getElementById('workday-autofill-btn');
    if (!triggerBtn) return;

    console.log("Starting form auto-fill...");
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Filling...';

    console.log("Phase 1: Adding all necessary sections.");
    await addSections();
    console.log("Phase 2: Populating data into sections.");
    await fillJobSection();
    await fillEducationSection();
    await fillSkillsSection();
    await fillLanguagesSection();
    console.log("Phase3: Populating data for the last 3 questions.");
    await handleThreePostFillQuestions();
    console.log("Phase 4: Populating data for the last question.");
    await handleFinalHistoryQuestion();

    triggerBtn.disabled = false;
    triggerBtn.textContent = 'Auto-Fill Form';
    console.log("Form auto-fill completed!");
  }

  function handlePageChange() {
    if (location.pathname.includes('/apply/') && !document.getElementById('workday-autofill-btn')) {
      document.body.insertAdjacentHTML('beforeend',"<button id='workday-autofill-btn' style='position:fixed;top:10px;right:10px;z-index:9999;background-color:#007bff;color:white;border:none;padding:10px;border-radius:5px;cursor:pointer;'>Auto-Fill Form</button>");document.getElementById('workday-autofill-btn').addEventListener('click',runAutoFiller);
    } else if (!location.pathname.includes('/apply/') && document.getElementById('workday-autofill-btn')) {
      document.getElementById('workday-autofill-btn').remove();
    }
  }

  //Initial check when the script loads
  handlePageChange();

  //Use a MutationObserver to detect page changes in the SPA
  new MutationObserver(handlePageChange).observe(document.body, {
    childList: true,
    subtree: true
  });
})();