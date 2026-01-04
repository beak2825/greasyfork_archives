// ==UserScript==
// @name         HN Blacklist
// @author       booleandilemma
// @description  Hide Hacker News submissions from sources you don't want to see
// @homepageURL  https://greasyfork.org/en/scripts/427213-hn-blacklist
// @match        https://news.ycombinator.com/
// @match        https://news.ycombinator.com/news*
// @version      3.3.0
// @grant        GM.getValue
// @grant        GM.setValue
// @license      GPL-3.0
// @namespace https://greasyfork.org/users/777592
// @downloadURL https://update.greasyfork.org/scripts/427213/HN%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/427213/HN%20Blacklist.meta.js
// ==/UserScript==

"use strict";

const UserScriptName = "HN Blacklist";
const UserScriptVersion = "3.3.0";

function getBlacklist(filterText) {
  const blacklist = new Set();

  if (filterText == null) {
    return blacklist;
  }

  const filters = filterText.split("\n");

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i].trim();

    if (filter !== "" && !filter.startsWith("#")) {
      blacklist.add(filter);
    }
  }

  return blacklist;
}

// eslint-disable-next-line no-unused-vars
async function main() {
  const startTime = performance.now();

  const logger = new Logger();

  const pageEngine = new PageEngine(logger);

  const tester = new Tester();
  const pageEngineTester = new PageEngineTests(pageEngine);
  const testResults = tester.runTests(pageEngineTester);

  logger.logInfo(testResults.summaryForLogging);

  /* eslint-disable no-undef */
  const filterText = (await GM.getValue("filters")) ?? "";

  const filterEvenWithTestFailures = await GM.getValue(
    "filterEvenWithTestFailures",
  );

  let reindexSubmissions = await GM.getValue("reindexSubmissions");

  /* We check if reindexSubmissions has never
   * been set before, and if it hasn't, we default it to true.
   */
  if (typeof reindexSubmissions == "undefined") {
    reindexSubmissions = true;
  }

  /* eslint-enable no-undef */

  testResults.filterEvenWithTestFailures = filterEvenWithTestFailures;

  const blacklist = getBlacklist(filterText);

  const blacklister = new Blacklister(pageEngine, blacklist, logger);
  blacklister.warnAboutInvalidBlacklistEntries();

  blacklister.displayUI(
    testResults,
    filterText,
    filterEvenWithTestFailures,
    reindexSubmissions,
  );

  let filterResults;

  if (filterEvenWithTestFailures || testResults.failCount === 0) {
    filterResults = blacklister.filterSubmissions(reindexSubmissions);
  } else {
    filterResults = new FilterResults();
  }

  const timeTaken = Math.floor(performance.now() - startTime);

  blacklister.displayResults(timeTaken, filterResults, testResults);
}

/**
 * This defines an object for orchestrating the high-level filtering logic.
 * It also handles user input and displaying results.
 */
class Blacklister {
  /**
   * Builds a list of entries from user input.
   * @param {PageEngine} pageEngine The page engine is responsible for low-level interaction with HN.
   * @param {set} blacklistInput A set containing the things to filter on.
   * @param {Logger} logger The logger to use.
   */
  constructor(pageEngine, blacklistInput, logger) {
    this.pageEngine = pageEngine;
    this.blacklistEntries = this.buildEntries(blacklistInput);
    this.logger = logger;
  }

  /**
   * Builds a list of entries from user input.
   * @param {set} blacklistInput A set containing the things to filter on.
   * @returns {Entry[]} An array of entries.
   */
  buildEntries(blacklistInput) {
    const entries = [];

    blacklistInput.forEach((input) => {
      if (input != null) {
        entries.push(new Entry(input));
      }
    });

    return entries;
  }

  /**
   * Warns the user about invalid entries.
   */
  warnAboutInvalidBlacklistEntries() {
    this.blacklistEntries.forEach((entry) => {
      if (!entry.isValid) {
        this.logger.logError(
          `"${entry.text}" is an invalid entry and will be skipped. ` +
            `Entries must begin with "source:", "title:", or "user:".`,
        );
      }
    });
  }

  /**
   * Filters out (i.e. deletes) all submissions on the
   * current HN page matching one or more provided entries.
   * After filtering is performed, the page is reindexed.
   * See the reindexSubmissions function of PageEngine for details.
   * @returns {FilterResults} An object containing how many submissions were filtered out.
   */
  filterSubmissions(reindexSubmissions) {
    const topRank = this.pageEngine.getTopRank();

    const validEntries = this.blacklistEntries.filter((e) => e.isValid);

    const submissionsFilteredBySource =
      this.pageEngine.filterSubmissionsBySource(validEntries);
    const submissionsFilteredByTitle =
      this.pageEngine.filterSubmissionsByTitle(validEntries);
    const submissionsFilteredByUser =
      this.pageEngine.filterSubmissionsByUser(validEntries);

    const filterResults = new FilterResults();
    filterResults.submissionsFilteredBySource = submissionsFilteredBySource;
    filterResults.submissionsFilteredByTitle = submissionsFilteredByTitle;
    filterResults.submissionsFilteredByUser = submissionsFilteredByUser;

    if (filterResults.getTotalSubmissionsFilteredOut() > 0) {
      if (reindexSubmissions) {
        this.logger.logInfo("Reindexing submissions");

        this.pageEngine.reindexSubmissions(topRank);
      } else {
        this.logger.logInfo("Skipping reindexing of submissions");
      }
    } else {
      this.logger.logInfo("Nothing filtered");
    }

    return filterResults;
  }

  displayUI(
    testResults,
    filterText,
    filterEvenWithTestFailures,
    reindexSubmissions,
  ) {
    const hnBlacklistTable = document.getElementById("hnBlacklist");

    if (hnBlacklistTable != null) {
      hnBlacklistTable.remove();
    }

    const statsRow = document.createElement("tr");

    let testResultsMessage = `Test Results: ${testResults.testCount - testResults.failCount}/${testResults.testCount} Passed in ${testResults.timeTaken} ms.`;

    if (testResults.failCount > 0) {
      testResultsMessage += " Check the log for details.";
    }

    const stats = `
      <td>
        <table id="hnBlacklist">
          <tbody>
            <tr>
              <td>
                <p style="text-decoration:underline;">
                  <a href="https://greasyfork.org/en/scripts/427213-hn-blacklist">${UserScriptName} ${UserScriptVersion}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <textarea id="filters" style="width:300px;height:150px">${filterText}</textarea>
              </td>
            </tr>
            <tr>
              <td>
                <input id="chkFilterEvenWithTestFailures" type="checkbox">Filter even with test failures</input>
              </td>
            </tr>
            <tr>
              <td>
                <input id="chkReindexSubmissions" type="checkbox" checked>Reindex submissions</input>
              </td>
            </tr>
            <tr>
              <td>
                <button id="btnSaveFilters">Save</button>
              </td>
            </tr>
            <tr>
              <td>
                <p id="filteredResults"></p>
              </td>
            </tr>
            <tr>
              <td id="validityResults"></td>
            </tr>
            <tr>
              <td id="testResults">${testResultsMessage}</td>
            </tr>
            <tr>
              <td id="executionTimeResults"></td>
            </tr>
          </tbody>
          </table>
        </td>`;

    statsRow.innerHTML = stats;

    this.pageEngine.displayResults(statsRow);

    document.getElementById("chkFilterEvenWithTestFailures").checked =
      filterEvenWithTestFailures;

    document.getElementById("chkReindexSubmissions").checked =
      reindexSubmissions;

    document.getElementById("btnSaveFilters").onclick = this.#saveInputsAsync;
  }

  /**
   * Displays results to the user.
   * @param {number} timeTaken The time the script took to execute.
   * @param {FilterResults} filterResults High-level results of what was done.
   * @param {TestResults} testResults A summary of test results.
   */
  displayResults(timeTaken, filterResults, testResults) {
    let entryValidityMessage = "Entry Validity: ";

    if (this.blacklistEntries.length > 0) {
      const invalidEntriesExist = this.blacklistEntries.some((e) => !e.isValid);

      const errorMessage =
        "One or more of your entries is invalid. Check the log for details";
      entryValidityMessage += invalidEntriesExist
        ? errorMessage
        : "All entries valid";
    } else {
      entryValidityMessage += "No entries supplied";
    }

    let filteredMessage = "Filtered: ";

    let submissionsFilteredBySourceMsg = "";

    for (const filteredSubmission of filterResults.submissionsFilteredBySource) {
      submissionsFilteredBySourceMsg +=
        "Title: " + filteredSubmission.title + "\\n";
      submissionsFilteredBySourceMsg +=
        "Source: " + filteredSubmission.source + "\\n\\n";
    }

    let submissionsFilteredByTitleMsg = "";

    for (const filteredSubmission of filterResults.submissionsFilteredByTitle) {
      submissionsFilteredByTitleMsg +=
        "Title: " + filteredSubmission.title + "\\n\\n";
    }

    let submissionsFilteredByUserMsg = "";

    for (const filteredSubmission of filterResults.submissionsFilteredByUser) {
      submissionsFilteredByUserMsg +=
        "Title: " + filteredSubmission.title + "\\n";
      submissionsFilteredByUserMsg +=
        "User: " + filteredSubmission.submitter + "\\n\\n";
    }

    if (testResults.failCount > 0 && !testResults.filterEvenWithTestFailures) {
      filteredMessage += "One or more tests failed - did not try to filter";
    } else if (
      testResults.failCount === 0 ||
      testResults.filterEvenWithTestFailures
    ) {
      if (filterResults.submissionsFilteredBySource.length > 0) {
        filteredMessage += `<a href="#" onclick="alert('${submissionsFilteredBySourceMsg}'); return false;"> ${filterResults.submissionsFilteredBySource.length} by source</a>, `;
      } else {
        filteredMessage += "0 by source, ";
      }

      if (filterResults.submissionsFilteredByTitle.length > 0) {
        filteredMessage += `<a href="#" onclick="alert('${submissionsFilteredByTitleMsg}'); return false;"> ${filterResults.submissionsFilteredByTitle.length} by title</a>, `;
      } else {
        filteredMessage += "0 by title, ";
      }

      if (filterResults.submissionsFilteredByUser.length > 0) {
        filteredMessage += `<a href="#" onclick="alert('${submissionsFilteredByUserMsg}'); return false;"> ${filterResults.submissionsFilteredByUser.length} by user</a>`;
      } else {
        filteredMessage += "0 by user";
      }
    }

    document.getElementById("filteredResults").innerHTML = filteredMessage;
    document.getElementById("validityResults").innerText = entryValidityMessage;
    document.getElementById("executionTimeResults").innerText =
      `Execution Time: ${timeTaken} ms`;
  }

  async #saveInputsAsync() {
    const filtersElement = document.getElementById("filters");

    const filterText = filtersElement.value.trim();

    const chkFilterEvenWithTestFailuresElement = document.getElementById(
      "chkFilterEvenWithTestFailures",
    );

    const chkReindexSubmissionsElement = document.getElementById(
      "chkReindexSubmissions",
    );

    /* eslint-disable no-undef */
    await GM.setValue("filters", filterText);

    await GM.setValue(
      "filterEvenWithTestFailures",
      chkFilterEvenWithTestFailuresElement.checked,
    );

    await GM.setValue(
      "reindexSubmissions",
      chkReindexSubmissionsElement.checked,
    );
    /* eslint-enable no-undef */

    alert("Settings saved! Please refresh the page.");
  }
}

/**
 * An entry for filtering submissions.
 */
class Entry {
  /**
   * Creates an entry.
   * @param {string} input Something the user wants to filter by.
   * It can begin with "source:", "title:", or "user:".
   */
  constructor(input) {
    /**
     * isValid indicates whether or not the entry is valid.
     * @type {boolean}
     * @public
     */
    this.isValid = null;

    /**
     * prefix indicates the type of thing to filter by. It can be "source:", "title:", or "user:".
     * @type {string}
     * @public
     */
    this.prefix = null;

    /**
     * text indicates the value of the source, title, or user to filter by.
     * @type {string}
     * @public
     */
    this.text = null;

    /**
     * starCount indicates the number of stars (asterisks) of the source to filter by.
     * @type {number}
     * @public
     */
    this.starCount = null;

    /**
     * isExclusion indicates whether or not this source should be excluded from blacklisting.
     * @type {boolean}
     * @public
     */
    this.isExclusion = null;

    this.#buildEntry(input);
  }

  /**
   * Determines if the input is valid.
   * @param {string} input Something the user wants to filter by.
   * @param {number} starCount The number of stars in the input.
   * It can begin with "source:", "title:", or "user:".
   * @returns {boolean} A boole indicating whether or not the entry is valid.
   */
  #isValidInput(input, starCount) {
    if (input.startsWith("source:") && this.#isValidSource(input, starCount)) {
      return true;
    }

    if (input.startsWith("title:") && this.#isValidTitle(input)) {
      return true;
    }

    if (input.startsWith("user:") && this.#isValidUser(input)) {
      return true;
    }

    return false;
  }

  #isValidSource(input, starCount) {
    if (this.#getCharCount(input, "!") > 1) {
      return false;
    }

    if (input.includes("!") && input.includes("*")) {
      return false;
    }

    if (input.includes("!") && !input.startsWith("source:!")) {
      return false;
    }

    return this.#hasValidStars(input, starCount);
  }

  #isValidTitle(input) {
    return !input.includes("!") && !input.includes("*");
  }

  #isValidUser(input) {
    return !input.includes("!") && !input.includes("*");
  }

  #hasValidStars(input, starCount) {
    input = input.replace("source:", "");

    switch (starCount) {
      case 0:
        return true;
      case 1:
        return input.startsWith("*") || input.endsWith("*");
      case 2:
        return input.startsWith("*") && input.endsWith("*");
      default:
        return false;
    }
  }

  #getCharCount(input, char) {
    let starCount = 0;

    for (const c of input) {
      if (c === char) {
        starCount++;
      }
    }

    return starCount;
  }

  #isExclusion(input) {
    return input.startsWith("source:!");
  }

  #buildEntry(input) {
    this.starCount = this.#getCharCount(input, "*");
    this.isExclusion = this.#isExclusion(input);
    this.isValid = this.#isValidInput(input, this.starCount);

    if (this.isValid) {
      const prefix = input.substring(0, input.indexOf(":"));
      const text = input.substring(input.indexOf(":") + 1);

      this.prefix = prefix;
      this.text = text;
    } else {
      this.prefix = null;
      this.text = input;
    }
  }
}

/**
 * A high-level summary of the results of what was done.
 */
class FilterResults {
  constructor() {
    /**
     * submissionsFilteredBySource a list of submission infos filtered by source.
     * @type {SubmissionInfo[]}
     * @public
     */
    this.submissionsFilteredBySource = [];

    /**
     * submissionsFilteredByTitle a list of submission infos filtered by title.
     * @type {SubmissionInfo[]}
     * @public
     */
    this.submissionsFilteredByTitle = [];

    /**
     * submissionsFilteredByUser a list of submission infos filtered by user.
     * @type {SubmissionInfo[]}
     * @public
     */
    this.submissionsFilteredByUser = [];
  }

  /**
   * A function for getting the total number of submissions filtered out.
   * @returns {number} The total number of submissions filtered by all categories.
   */
  getTotalSubmissionsFilteredOut() {
    return (
      this.submissionsFilteredBySource.length +
      this.submissionsFilteredByTitle.length +
      this.submissionsFilteredByUser.length
    );
  }
}

class Logger {
  /**
   * Logs an info message to the console.
   * @param {string} message Specifies the message to log.
   */
  logInfo(message) {
    console.info(`${UserScriptName}: ${message}`);
  }

  /**
   * Logs a warning message to the console.
   * @param {string} message Specifies the message to log.
   */
  logWarning(message) {
    console.warn(`${UserScriptName}: ${message}`);
  }

  /**
   * Logs an error message to the console.
   * @param {string} message Specifies the message to log.
   */
  logError(message) {
    console.error(`${UserScriptName}: ${message}`);
  }
}

/**
 * This defines an object for interacting with the HN page itself, at a low-level.
 */
class PageEngine {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Get the thing holding the list of submissions.
   */
  getSubmissionTable() {
    const submissions = this.getSubmissions();

    if (submissions == null || submissions.length === 0) {
      return null;
    }

    return submissions[0].parentElement;
  }

  /**
   * Get the list of submissions.
   */
  getSubmissions() {
    return document.querySelectorAll(".athing");
  }

  /**
   * Updates the specified submission to the specified rank.
   * @param {?object} submission Specifies the HN submission.
   * @param {number} newRank Specifies the new rank to set on the specified submission.
   */
  setRank(submission, newRank) {
    if (submission === null) {
      this.logger.logWarning("submission is null");

      return;
    }

    let titleIndex = 0;

    for (let i = 0; i < submission.childNodes.length; i++) {
      const childNode = submission.childNodes[i];

      if (childNode.className === "title") {
        titleIndex++;
      }

      if (titleIndex === 1) {
        const rank = childNode.innerText;

        if (rank === null) {
          this.logger.logWarning("rank is null");

          return;
        }

        childNode.innerText = `${newRank}.`;

        return;
      }
    }

    this.logger.logWarning(`no rank found: ${JSON.stringify(submission)}`);
  }

  /**
   * Updates the ranks of all of the remaining submissions on the current HN page.
   * This function is intended to be called after the submissions have been filtered.
   * This is because once the submissions are filtered, there is a gap in the rankings.
   * For example, if the 3rd submission is removed, the remaining submissions will have
   * ranks of: 1, 2, 4, 5, etc.
   * This function will correct the remaining submissions to have ranks of: 1, 2, 3, 4, etc.
   * This is accomplished by passing in the top rank on the current HN page _before_
   * any filtering is done. For example, if the current HN page is the first one,
   * the top rank will be "1", and so numbering will start from 1. If the current page
   * is the second one, the top rank will be "31".
   * @param {number} topRank Specifies the top rank to start numbering from.
   */
  reindexSubmissions(topRank) {
    const submissions = this.getSubmissions();

    for (let i = 0; i < submissions.length; i++) {
      this.setRank(submissions[i], topRank + i);
    }
  }

  /**
   * Scans the list of submissions on the current HN page
   * and returns the rank of the first submission in the list.
   * @returns {?number} The rank of the first HN submission.
   */
  getTopRank() {
    const submissions = this.getSubmissions();

    if (submissions == null) {
      this.logger.logWarning("submissions are null");

      return null;
    }

    if (submissions.length === 0) {
      this.logger.logWarning("submissions are empty");

      return null;
    }

    const topRank = this.getRank(submissions[0]);

    return topRank;
  }

  /**
   * Returns the source of the specified titleInfo.
   * @param {?object} titleInfo An element containing the submission headline and source.
   */
  getSource(titleInfo) {
    if (titleInfo === null) {
      this.logger.logWarning("titleInfo is null");

      return null;
    }

    const titleText = titleInfo.innerText;

    const lastParenIndex = titleText.lastIndexOf("(");

    if (lastParenIndex < 0) {
      return null;
    }

    const source = titleText
      .substring(lastParenIndex + 1, titleText.length - 1)
      .trim();

    return source;
  }

  /**
   * Returns the titleText (i.e. headline) of the specified titleInfo.
   * @param {?object} titleInfo An element containing the submission headline and source.
   */
  getTitleText(titleInfo) {
    if (titleInfo === null) {
      this.logger.logWarning("titleInfo is null");

      return null;
    }

    const titleText = titleInfo.innerText;

    const lastParenIndex = titleText.lastIndexOf("(");

    if (lastParenIndex < 0) {
      return titleText;
    }

    return titleText.substring(0, lastParenIndex);
  }

  /**
   * @param {?object} submission Specifies the HN submission.
   * @returns {?number} The "rank" of an HN submission.
   * The rank is defined as the number to the far left of the submission.
   */
  getRank(submission) {
    if (submission === null) {
      this.logger.logWarning("submission is null");
      return null;
    }

    let titleIndex = 0;

    for (let i = 0; i < submission.childNodes.length; i++) {
      const childNode = submission.childNodes[i];

      if (childNode.className === "title") {
        titleIndex++;
      }

      if (titleIndex === 1) {
        const rank = childNode.innerText;

        if (rank === null) {
          this.logger.logWarning("rank is null");

          return null;
        }

        return parseInt(rank.replace(".", "").trim(), 10);
      }
    }

    this.logger.logWarning(`no rank found: ${JSON.stringify(submission)}`);

    return null;
  }

  /**
   * Returns the titleInfo of the specified submission.
   * This is an element containing the headline and the source
   * of the submission.
   * @param {?object} submission Specifies the HN submission.
   */
  getTitleInfo(submission) {
    if (submission === null) {
      this.logger.logWarning("submission is null");

      return null;
    }

    let titleIndex = 0;

    for (let i = 0; i < submission.childNodes.length; i++) {
      const childNode = submission.childNodes[i];

      if (childNode.className === "title") {
        titleIndex++;
      }

      if (titleIndex === 2) {
        return childNode;
      }
    }

    this.logger.logWarning(`no titleInfo found: ${JSON.stringify(submission)}`);

    return null;
  }

  /**
   * Returns the submitter of the specified submission.
   * @param {?object} submission Specifies the HN submission.
   * @returns {?string} the username of the submitter.
   */
  getSubmitter(submission) {
    if (submission === null) {
      this.logger.logWarning("submission is null");

      return null;
    }

    const { nextSibling } = submission;
    if (nextSibling === null) {
      // TODO: this might be a bug
      const rank = this.getRank(submission);
      this.logger.logWarning(`nextSibling is null. rank is: ${rank}`);

      return null;
    }

    const userLink = nextSibling.querySelector(".hnuser");

    if (userLink == null) {
      const rank = this.getRank(submission);
      this.logger.logWarning(`userLink is null. rank is: ${rank}`);

      return null;
    }

    const hrefUser = userLink.getAttribute("href");

    if (hrefUser == null) {
      this.logger.logWarning("hrefUser is null");

      return null;
    }

    return hrefUser.replace("user?id=", "");
  }

  /**
   * Gets a SubmissionInfo object representing the different parts of the specified submission.
   * @param {?object} submission Specifies the HN submission.
   * @returns {?SubmissionInfo} A SubmissionInfo object representing the different parts of the specified submission.
   */
  getSubmissionInfoObject(submission) {
    if (submission === null) {
      return null;
    }

    const titleInfo = this.getTitleInfo(submission);

    const rank = this.getRank(submission);
    const submitter = this.getSubmitter(submission);
    const titleText = this.getTitleText(titleInfo);
    const source = this.getSource(titleInfo);
    const { rowIndex } = submission;

    const submissionInfo = new SubmissionInfo();
    submissionInfo.title = titleText;
    submissionInfo.source = source;
    submissionInfo.submitter = submitter;
    submissionInfo.rank = rank;
    submissionInfo.rowIndex = rowIndex;

    return submissionInfo;
  }

  /**
   * Filters out (i.e. deletes) all submissions on the
   * current HN page with a domain source contained in the specified blacklist.
   * @param {Entry[]} blacklistEntries A list containing entries to filter on.
   * @returns {SubmissionInfo[]} A list of submissions filtered out.
   */
  filterSubmissionsBySource(blacklistEntries) {
    const submissions = this.getSubmissions();

    const submissionTable = this.getSubmissionTable();

    const submissionsFiltered = [];

    function shouldFilter(source, entry) {
      const entryText = entry.text.toLowerCase();

      switch (entry.starCount) {
        case 0:
          return source === entryText;
        case 1:
          if (entryText.endsWith("*")) {
            return source.startsWith(entryText.replace("*", ""));
          }

          return source.endsWith(entryText.replace("*", ""));
        case 2:
          return source.includes(entryText.replaceAll("*", ""));
        default:
          this.logger.logError(`Invalid number of asterisks in ${entryText}`);

          return false;
      }
    }

    const exclusions = new Set();

    blacklistEntries.forEach((entry) => {
      if (entry.isExclusion) {
        exclusions.add(entry.text.toLowerCase().substring(1));
      }
    });

    blacklistEntries.forEach((entry) => {
      if (entry.prefix !== "source" || entry.isExclusion) {
        return;
      }

      for (let i = 0; i < submissions.length; i++) {
        const submissionInfo = this.getSubmissionInfoObject(submissions[i]);

        if (submissionInfo === null) {
          this.logger.logWarning(`submissionInfo is null. rank is ${i}`);

          continue;
        }

        if (submissionInfo.source == null) {
          this.logger.logWarning(`source is null. rank is ${i}`);

          continue;
        }

        if (exclusions.has(submissionInfo.source)) {
          this.logger.logInfo(
            `Source excluded from blacklisting - ${submissionInfo.source}`,
          );

          continue;
        }

        if (shouldFilter.call(this, submissionInfo.source, entry)) {
          this.logger.logInfo(
            `Source blacklisted - removing ${JSON.stringify(submissionInfo)}`,
          );

          // Delete the submission
          submissionTable.deleteRow(submissionInfo.rowIndex);

          // Delete the submission comments link
          submissionTable.deleteRow(submissionInfo.rowIndex);

          // Delete the spacer row after the submission
          submissionTable.deleteRow(submissionInfo.rowIndex);

          submissionsFiltered.push(submissionInfo);
        }
      }
    });

    return submissionsFiltered;
  }

  /**
   * Filters out (i.e. deletes) all submissions on the
   * current HN page with a title substring contained in the specified blacklist.
   * @param {Entry[]} blacklistEntries A list containing entries to filter on.
   * @returns {SubmissionInfo[]} A list of submissions filtered out.
   */
  filterSubmissionsByTitle(blacklistEntries) {
    const submissions = this.getSubmissions();

    const submissionTable = this.getSubmissionTable();

    const submissionsFiltered = [];

    blacklistEntries.forEach((entry) => {
      if (entry.prefix !== "title") {
        return;
      }

      for (let j = 0; j < submissions.length; j++) {
        const submissionInfo = this.getSubmissionInfoObject(submissions[j]);

        if (submissionInfo === null) {
          this.logger.logWarning(`submissionInfo is null. rank is ${i}`);

          continue;
        }

        if (
          submissionInfo.title.toLowerCase().includes(entry.text.toLowerCase())
        ) {
          this.logger.logInfo(
            `Title keyword blacklisted - removing ${JSON.stringify(submissionInfo)}`,
          );

          // Delete the submission
          submissionTable.deleteRow(submissionInfo.rowIndex);

          // Delete the submission comments link
          submissionTable.deleteRow(submissionInfo.rowIndex);

          // Delete the spacer row after the submission
          submissionTable.deleteRow(submissionInfo.rowIndex);

          submissionsFiltered.push(submissionInfo);
        }
      }
    });

    return submissionsFiltered;
  }

  /**
   * Filters out (i.e. deletes) all submissions on the
   * current HN page submitted by the specified user.
   * @param {Entry[]} blacklistEntries A list containing entries to filter on.
   * @returns {SubmissionInfo[]} A list of submissions filtered out.
   */
  filterSubmissionsByUser(blacklistEntries) {
    const submissions = this.getSubmissions();

    const submissionTable = this.getSubmissionTable();

    const submissionsFiltered = [];

    blacklistEntries.forEach((entry) => {
      if (entry.prefix !== "user") {
        return;
      }

      for (let j = 0; j < submissions.length; j++) {
        const submissionInfo = this.getSubmissionInfoObject(submissions[j]);

        if (submissionInfo === null) {
          this.logger.logWarning(`submissionInfo is null. rank is ${i}`);

          continue;
        }

        if (
          submissionInfo.submitter != null &&
          submissionInfo.submitter.toLowerCase() === entry.text.toLowerCase()
        ) {
          this.logger.logInfo(
            `User blacklisted - removing ${JSON.stringify(submissionInfo)}`,
          );

          // Delete the submission
          submissionTable.deleteRow(submissionInfo.rowIndex);

          // Delete the submission comments link
          submissionTable.deleteRow(submissionInfo.rowIndex);

          // Delete the spacer row after the submission
          submissionTable.deleteRow(submissionInfo.rowIndex);

          submissionsFiltered.push(submissionInfo);
        }
      }
    });

    return submissionsFiltered;
  }

  displayResults(resultsRow) {
    const mainTable = document.getElementById("hnmain");

    /*
     * HN adds an extra child to the mainTable,
     * so we have to do this to get the tbody.
     * I'm not sure why HN does this.
     * This assumes the tbody will be the last child.
     */
    const childCount = mainTable.childNodes.length;
    const tbody = mainTable.childNodes[childCount - 1];

    tbody.appendChild(resultsRow);
  }
}

/**
 * An entry for filtering submissions.
 */
class SubmissionInfo {
  // TODO: update all these docus

  /**
   * Creates a submissionInfo.
   */
  constructor() {
    /**
     * prefix indicates the type of thing to filter by. It can be "source:", "title:", or "user:".
     * @type {string}
     * @public
     */
    this.title = null;

    /**
     * prefix indicates the type of thing to filter by. It can be "source:", "title:", or "user:".
     * @type {string}
     * @public
     */
    this.source = null;

    /**
     * prefix indicates the type of thing to filter by. It can be "source:", "title:", or "user:".
     * @type {string}
     * @public
     */
    this.submitter = null;

    /**
     * prefix indicates the type of thing to filter by. It can be "source:", "title:", or "user:".
     * @type {number}
     * @public
     */
    this.rank = null;

    /**
     * prefix indicates the type of thing to filter by. It can be "source:", "title:", or "user:".
     * @type {number}
     * @public
     */
    this.rowIndex = null;
  }
}

/**
 * This class contains several tests for testing the correctness of the PageEngine.
 * As the PageEngine is the closest code in this userscript to HN,
 * it's most susceptible to breaking if the HN developers change something.
 * Therefore, it's good to have tests for all of its functionality.
 */
class PageEngineTests {
  constructor(pageEngine) {
    this.pageEngine = pageEngine;
  }

  test_getSubmissionTable_ableToGetSubmissionTable(tester) {
    // Arrange
    // Act
    let table;

    try {
      table = this.pageEngine.getSubmissionTable();
    } catch {
      // Empty
    }

    // Assert
    if (table == null) {
      tester.failWith({
        message: "Unable to obtain submission table",
      });
    }
  }

  test_getSubmissions_numberOfSubmissionsIsCorrect(tester) {
    // Arrange
    const expectedLength = 30;

    // Act
    const { submissions, result } = this.getSubmissionsWithResult();

    // Assert
    if (submissions == null) {
      tester.failWith(result);
    }

    if (submissions.length !== expectedLength) {
      tester.failWith({
        message: `Submissions length is wrong. expected ${expectedLength}, got ${submissions.length}`,
      });
    }
  }

  test_getRank_ableToGetRank(tester) {
    // Arrange
    const { submissions, result } = this.getSubmissionsWithResult();

    if (submissions == null) {
      tester.failWith(result);
    }

    // Arbitrarily testing the 5th submission.
    if (submissions.length < 5) {
      tester.failWith({
        message: "Submissions length less than 5, can't get a rank",
      });
    }

    // Act
    let firstRankOnPage = null;

    try {
      firstRankOnPage = this.pageEngine.getRank(submissions[0]);
    } catch {
      // Empty
    }

    // Assert
    if (firstRankOnPage == null) {
      tester.failWith({
        message: "First submission rank is null",
      });
    }

    let fifthRank = null;

    try {
      fifthRank = this.pageEngine.getRank(submissions[4]);
    } catch {
      // Empty
    }

    if (fifthRank == null) {
      tester.failWith({
        message: "Fifth submission rank is null",
      });
    }

    /*
     * We offset the rank like this so that this test will work
     * on any submissions page.
     */
    if (fifthRank !== firstRankOnPage + 4) {
      tester.failWith({
        message: "Unable to obtain submission rank",
      });
    }
  }

  test_getTopRank_ableToGetTopRank(tester) {
    // Arrange
    // Act
    let topRank = null;

    try {
      topRank = this.pageEngine.getTopRank();
    } catch {
      // Empty
    }

    // Assert
    if (topRank == null) {
      tester.failWith({
        message: "Unable to get top rank",
      });
    }
  }

  test_getSubmitter_ableToGetSubmitter(tester) {
    // Arrange
    const { submissions, result } = this.getSubmissionsWithResult();

    if (submissions == null) {
      tester.failWith(result);
    }

    // Arbitrarily testing the 5th submission.
    if (submissions.length < 5) {
      tester.failWith({
        message: "Submissions length less than 5, can't get a rank",
      });
    }

    // Act
    let submitter = null;

    try {
      submitter = this.pageEngine.getSubmitter(submissions[4]);
    } catch {
      // Empty
    }

    // Assert
    if (submitter == null || submitter.trim() === "") {
      tester.failWith({
        message: "Couldn't get submitter",
      });
    }
  }

  test_getTitleInfo_ableToGetTitleInfo(tester) {
    // Arrange
    const submissionsAndResult = this.getSubmissionsWithResult();
    const submissions = submissionsAndResult.submissions;

    if (submissions == null) {
      tester.failWith(submissionsAndResult.result);
    }

    // Arbitrarily testing the 5th submission.
    if (submissions.length < 5) {
      tester.failWith({
        message: "Submissions length less than 5, can't get a rank",
      });
    }

    // Act
    const { titleInfo, result } = this.getTitleInfoWithResult(submissions[4]);

    // Assert
    if (titleInfo == null) {
      tester.failWith(result);
    }
  }

  test_getTitleText_ableToGetTitleText(tester) {
    // Arrange
    const submissionsAndResult = this.getSubmissionsWithResult();
    const submissions = submissionsAndResult.submissions;

    if (submissions == null) {
      tester.failWith(submissionsAndResult.result);
    }

    // Arbitrarily testing the 5th submission.
    if (submissions.length < 5) {
      tester.failWith({
        message: "Submissions length less than 5, can't get a rank",
      });
    }

    const { titleInfo, result } = this.getTitleInfoWithResult(submissions[4]);

    if (titleInfo == null) {
      tester.failWith(result);
    }

    // Act
    const titleText = this.pageEngine.getTitleText(titleInfo);

    // Assert
    if (titleText == null || titleText.trim() === "") {
      tester.failWith({
        message: "Unable to get title text on title info",
      });
    }
  }

  test_getSource_ableToGetSource(tester) {
    // Arrange
    const submissionsAndResult = this.getSubmissionsWithResult();
    const submissions = submissionsAndResult.submissions;

    if (submissions == null) {
      tester.failWith(submissionsAndResult.result);
    }

    // Arbitrarily testing the 5th submission.
    if (submissions.length < 5) {
      tester.failWith({
        message: "Submissions length less than 5, can't get a rank",
      });
    }

    const { titleInfo, result } = this.getTitleInfoWithResult(submissions[4]);

    if (titleInfo == null) {
      tester.failWith(result);
    }

    // Act
    const source = this.pageEngine.getSource(titleInfo);

    // Assert
    if (source == null || source.trim() === "") {
      tester.failWith({
        message: "Unable to get source on title info",
      });
    }
  }

  getSubmissionsWithResult() {
    let submissions = null;

    try {
      submissions = this.pageEngine.getSubmissions();
    } catch {
      // Empty
    }

    if (submissions == null) {
      return {
        submissions: null,
        result: {
          message: "Unable to obtain submission",
        },
      };
    }

    return {
      submissions,
      result: null,
    };
  }

  getTitleInfoWithResult(submission) {
    let titleInfo = null;

    try {
      titleInfo = this.pageEngine.getTitleInfo(submission);
    } catch {
      // Empty
    }

    if (titleInfo == null) {
      return {
        titleInfo: null,
        result: {
          message: "Couldn't get title info",
        },
      };
    }

    return {
      titleInfo,
      result: null,
    };
  }
}

class TestResults {
  constructor() {
    this.filterEvenWithTestFailures = null;
    this.failCount = null;
    this.testCount = null;
    this.timeTaken = null;
  }
}

class Tester {
  runTests(testClass) {
    const tests = this.#getTests(Object.getPrototypeOf(testClass));

    const resultsForLogging = [];
    let failCount = 0;

    const startTime = performance.now();

    for (let i = 0; i < tests.length; i++) {
      const testResult = this.#runTest(testClass, tests[i]);

      if (testResult.status !== "passed") {
        failCount++;
      }

      resultsForLogging.push(testResult);
    }

    const timeTaken = Math.floor(performance.now() - startTime);

    const testResults = new TestResults();
    testResults.failCount = failCount;
    testResults.testCount = tests.length;
    testResults.timeTaken = timeTaken;
    testResults.summaryForLogging = this.#getSummaryForLogging(
      resultsForLogging,
      failCount,
      timeTaken,
    );

    return testResults;
  }

  failWith(result) {
    result.status = "failed";

    throw result;
  }

  #getTests(testClass) {
    return Object.getOwnPropertyNames(testClass).filter((p) =>
      p.startsWith("test_"),
    );
  }

  #runTest(testClass, testToRun) {
    try {
      testClass[testToRun](this);
    } catch (error) {
      const result = {
        name: testToRun,
        status: error.status ?? "failed",
        message: error.message,
        stackTrace: error.stack,
      };

      return result;
    }

    const result = {
      name: testToRun,
      status: "passed",
    };

    return result;
  }

  #getSummaryForLogging(results, failCount, timeTaken) {
    const testCount = results.length;

    let summary;

    if (failCount === 0) {
      summary = `Tests Results ${testCount}/${testCount} Passed in ${timeTaken} ms`;
    } else {
      summary = `Tests Results ${testCount - failCount}/${testCount} Passed ${JSON.stringify(results, null, 2)} in ${timeTaken} ms`;
    }

    return summary;
  }
}

main();
