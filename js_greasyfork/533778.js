// ==UserScript==
// @name         NYC Jobs Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhances NYC Jobs listings by fetching and displaying additional job details
// @author       You
// @match        https://cityjobs.nyc.gov/jobs*
// @icon         https://cityjobs.nyc.gov/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533778/NYC%20Jobs%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/533778/NYC%20Jobs%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add CSS styles
  GM_addStyle(`
        .enhanced-job-details {
            background-color: #f0f7ff;
            border-left: 3px solid #2196F3;
            padding: 8px 12px;
            margin: 8px 0;
            border-radius: 4px;
            font-size: 14px;
        }
        .enhanced-job-details-label {
            font-weight: bold;
            color: #0d47a1;
            margin-right: 5px;
        }
        .enhanced-loading {
            color: #666;
            font-style: italic;
        }
        .enhanced-posted-date {
            color: #d32f2f;
            font-weight: bold;
        }
        .enhanced-error {
            color: #d32f2f;
            font-style: italic;
        }
        .enhanced-fetch-btn {
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 10px;
        }
        .enhanced-fetch-btn:hover {
            background-color: #0d8aee;
        }
    `);

  // Utility function to create an element with specific attributes
  function createElem(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    if (text) el.textContent = text;
    return el;
  }

  // Function to extract posted date from job detail page HTML
  function extractPostedDate(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Look for the "Posted on:" date element
    const dateWidgets = doc.querySelectorAll(".date-widget");
    let postedDate = null;

    for (const widget of Array.from(dateWidgets)) {
      const label = widget.querySelector(".date-label");
      if (
        label &&
        label.textContent &&
        label.textContent.trim() === "Posted on:"
      ) {
        // Get the text following the label
        const dateText =
          widget.textContent?.trim().replace("Posted on:", "").trim() || null;
        postedDate = dateText;
        break;
      }
    }

    return postedDate;
  }

  // Function to extract civil service title from job detail page HTML
  function extractCivilServiceTitle(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Look for the civil service title element
    const civilServiceTitleElem = doc.querySelector(
      ".civil-service-title .attrax-job-information-widget__dynamic-field-value"
    );
    if (civilServiceTitleElem) {
      return civilServiceTitleElem.textContent.trim();
    }

    return null;
  }

  // Function to fetch job details
  async function fetchJobDetails(jobUrl) {
    try {
      // Ensure the URL is absolute
      const fullUrl = jobUrl.startsWith("http")
        ? jobUrl
        : `https://cityjobs.nyc.gov${
            jobUrl.startsWith("/") ? "" : "/"
          }${jobUrl}`;

      // Fetch the job details page
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const html = await response.text();
      return {
        postedDate: extractPostedDate(html),
        civilServiceTitle: extractCivilServiceTitle(html),
        html: html,
      };
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  }

  // Function to extract full description from job detail page HTML
  function extractFullDescription(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Look for the full job description
    const jobDescriptionElement = doc.querySelector(".vacancy-description");
    if (jobDescriptionElement) {
      return jobDescriptionElement.textContent.trim();
    }

    return null;
  }

  // Function to enhance a job listing with fetched details
  async function enhanceJobListing(jobElement) {
    // Check if already enhanced
    if (jobElement.querySelector(".enhanced-job-details")) return;

    // Get job URL
    const titleElement = jobElement.querySelector(
      ".attrax-vacancy-tile__title"
    );
    if (!titleElement) return;

    const jobUrl = titleElement.getAttribute("href");

    // Get salary information
    const salaryElement = jobElement.querySelector(
      ".attrax-vacancy-tile__salary-value"
    );
    const salary = salaryElement ? salaryElement.textContent.trim() : "";

    // Create details container
    const detailsContainer = createElem("div", {
      class: "enhanced-job-details",
    });
    const loadingIndicator = createElem(
      "div",
      { class: "enhanced-loading" },
      "Fetching job details..."
    );
    detailsContainer.appendChild(loadingIndicator);

    // Add container to job listing
    const buttonsElement = jobElement.querySelector(
      ".attrax-vacancy-tile__buttons"
    );
    if (buttonsElement) {
      jobElement.insertBefore(detailsContainer, buttonsElement);
    } else {
      jobElement.appendChild(detailsContainer);
    }

    try {
      // Fetch job details
      const details = await fetchJobDetails(jobUrl);

      // Remove loading indicator
      loadingIndicator.remove();

      // Add posted date
      if (details.postedDate) {
        const postedDateElem = createElem("div");
        const labelElem = createElem(
          "span",
          { class: "enhanced-job-details-label" },
          "Posted on:"
        );
        const valueElem = createElem(
          "span",
          { class: "enhanced-posted-date" },
          ` ${details.postedDate}`
        );
        postedDateElem.appendChild(labelElem);
        postedDateElem.appendChild(valueElem);
        detailsContainer.appendChild(postedDateElem);
      }

      // Add salary if available
      if (salary) {
        const salaryElem = createElem("div");
        const salaryLabelElem = createElem(
          "span",
          { class: "enhanced-job-details-label" },
          "Salary:"
        );
        const salaryValueElem = createElem(
          "span",
          { style: "font-weight: bold; color: #2e7d32;" },
          ` ${salary}`
        );
        salaryElem.appendChild(salaryLabelElem);
        salaryElem.appendChild(salaryValueElem);
        detailsContainer.appendChild(salaryElem);
      }

      // Add civil service title if available
      if (details.civilServiceTitle) {
        const civilServiceElem = createElem("div");
        const civilServiceLabelElem = createElem(
          "span",
          { class: "enhanced-job-details-label" },
          "Civil Service Title:"
        );
        const civilServiceValueElem = createElem(
          "span",
          { style: "color: #0277bd; font-weight: bold;" },
          ` ${details.civilServiceTitle}`
        );
        civilServiceElem.appendChild(civilServiceLabelElem);
        civilServiceElem.appendChild(civilServiceValueElem);
        detailsContainer.appendChild(civilServiceElem);
      }

      // Extract and add full description
      const fullDescription = extractFullDescription(details.html);
      if (fullDescription) {
        // Get the current truncated description
        const currentDescElem = jobElement.querySelector(
          ".attrax-vacancy-tile__description-value"
        );
        if (currentDescElem) {
          // Replace truncated description with full description
          currentDescElem.textContent = fullDescription;

          // Add note about expanded description
          const descNoteElem = createElem(
            "div",
            { style: "margin-top: 5px; font-size: 12px; color: #666;" },
            "* Description has been expanded from job details page"
          );
          detailsContainer.appendChild(descNoteElem);
        }
      }
    } catch (error) {
      loadingIndicator.remove();

      // Add salary if available (even if details fetch failed)
      if (salary) {
        const salaryElem = createElem("div");
        const salaryLabelElem = createElem(
          "span",
          { class: "enhanced-job-details-label" },
          "Salary:"
        );
        const salaryValueElem = createElem(
          "span",
          { style: "font-weight: bold; color: #2e7d32;" },
          ` ${salary}`
        );
        salaryElem.appendChild(salaryLabelElem);
        salaryElem.appendChild(salaryValueElem);
        detailsContainer.appendChild(salaryElem);
      }

      // Show error message
      const errorElem = createElem(
        "div",
        { class: "enhanced-error" },
        `Error fetching job details: ${error.message}`
      );
      detailsContainer.appendChild(errorElem);

      // Add retry button
      const retryBtn = createElem(
        "button",
        { class: "enhanced-fetch-btn" },
        "Retry"
      );
      retryBtn.addEventListener("click", (e) => {
        e.preventDefault();
        detailsContainer.remove();
        enhanceJobListing(jobElement);
      });
      detailsContainer.appendChild(retryBtn);
    }
  }

  // Main function to enhance all job listings
  function enhanceJobListings() {
    const jobListings = document.querySelectorAll(".attrax-vacancy-tile");
    console.log(`Found ${jobListings.length} job listings to enhance`);

    // Process in batches to not overwhelm the server
    const batchSize = 5;
    let processed = 0;

    function processBatch() {
      const batch = Array.from(jobListings).slice(
        processed,
        processed + batchSize
      );
      if (batch.length === 0) return;

      batch.forEach(enhanceJobListing);
      processed += batch.length;

      // Process next batch after a delay
      if (processed < jobListings.length) {
        setTimeout(processBatch, 2000);
      }
    }

    // Start processing
    processBatch();
  }

  // Wait for the page to fully load before enhancing
  window.addEventListener("load", () => {
    // Give a slight delay to ensure all elements are rendered
    setTimeout(enhanceJobListings, 1500);
  });

  // Observe for any dynamically added job listings (for pagination or filtering)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const jobListings = document.querySelectorAll(
          ".attrax-vacancy-tile:not(.enhanced)"
        );
        jobListings.forEach((jobListing) => {
          jobListing.classList.add("enhanced");
          enhanceJobListing(jobListing);
        });
      }
    }
  });

  // Start observing the document body for job listing changes
  observer.observe(document.body, { childList: true, subtree: true });
})();
