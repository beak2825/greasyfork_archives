// ==UserScript==
// @name         MRCoverageInfo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays MR Coverage information
// @author       Hexmos
// @match        https://gitlab.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476277/MRCoverageInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/476277/MRCoverageInfo.meta.js
// ==/UserScript==

;(async function () {
  "use strict"
  console.log("Starting script")

  const clipboardButton = document.querySelector("button[data-clipboard-text]")
  const branchText = clipboardButton.getAttribute("data-clipboard-text")

  const bodyElement = document.querySelector("body")
  const projectId = bodyElement.getAttribute("data-project-id")

  var coverageMetric = {
    mrTotalCov: 0,
    mrStatementCov: 0,
    mrBranchCov: 0,
    mrLineCov: 0,
    mrFunctionCov: 0,
    masterTotalCov: 0,
    masterStatementCov: 0,
    masterBranchCov: 0,
    masterLineCov: 0,
    masterFunctionCov: 0,
  }

  function formatDifference(diff) {
      console.log("The diff value is",diff)
      if (diff == 0){
          return "0";
      }
      else if(diff<0){
          return diff.toFixed(0);
      }
      else{
          return diff.toFixed(2);
      }
      
  }

  // Define the URL of the JSON file
  const mrjsonURL = `https://gitlab.com/api/v4/projects/${projectId}/jobs/artifacts/${branchText}/raw/testcases/coverage-badges/coverage_summary.json?job=test`
  const masterjsonURL = `https://gitlab.com/api/v4/projects/${projectId}/jobs/artifacts/master/raw/testcases/coverage-badges/coverage_summary.json?job=test`
  try {
    const response = await fetch(mrjsonURL)
    if (response.ok) {
      const coverageJson = await response.json()
      coverageMetric["mrStatementCov"] = coverageJson["Statements"]
      coverageMetric["mrBranchCov"] = coverageJson["Branches"]
      coverageMetric["mrLineCov"] = coverageJson["Lines"]
      coverageMetric["mrFunctionCov"] = coverageJson["Functions"]
    } else {
      console.error("Failed to fetch JSON. Status:", response.status)
    }
  } catch (error) {
    console.error("Error fetching JSON:", error)
  }

  try {
    const response = await fetch(masterjsonURL)
    if (response.ok) {
      const coverageJson = await response.json()
      coverageMetric["masterStatementCov"] = coverageJson["Statements"]
      coverageMetric["masterBranchCov"] = coverageJson["Branches"]
      coverageMetric["masterLineCov"] = coverageJson["Lines"]
      coverageMetric["masterFunctionCov"] = coverageJson["Functions"]
    } else {
      console.error("Failed to fetch JSON. Status:", response.status)
    }
  } catch (error) {
    console.error("Error fetching JSON:", error)
  }

const records = [
  {
    "Coverage Type": "Statement Coverage",
    "Master Coverage": coverageMetric["masterStatementCov"],
    "MR Coverage": coverageMetric["mrStatementCov"],
    Diff: formatDifference((coverageMetric["mrStatementCov"] - coverageMetric["masterStatementCov"])),
  },
  {
    "Coverage Type": "Branch Coverage",
    "Master Coverage": coverageMetric["masterBranchCov"],
    "MR Coverage": coverageMetric["mrBranchCov"],
    Diff: formatDifference((coverageMetric["mrBranchCov"] - coverageMetric["masterBranchCov"])),
  },
  {
    "Coverage Type": "Line Coverage",
    "Master Coverage": coverageMetric["masterLineCov"],
    "MR Coverage": coverageMetric["mrLineCov"],
    Diff: formatDifference((coverageMetric["mrLineCov"] - coverageMetric["masterLineCov"])),
  },
  {
    "Coverage Type": "Function Coverage",
    "Master Coverage": coverageMetric["masterFunctionCov"],
    "MR Coverage": coverageMetric["mrFunctionCov"],
    Diff: formatDifference((coverageMetric["mrFunctionCov"] - coverageMetric["masterFunctionCov"])),
  },
];

  function insertTable(branchText) {
    const table = document.createElement("table")
    table.classList.add("my-custom-table")

    const thead = document.createElement("thead")
    const headerRow = document.createElement("tr")
    const columnNames = [
      "Coverage Type",
      "Diff",
      "Master Coverage",
      "MR Coverage",
    ]

    for (const columnName of columnNames) {
      const th = document.createElement("th")
      th.textContent = columnName
      headerRow.appendChild(th)
    }

    thead.appendChild(headerRow)
    table.appendChild(thead)

    const tbody = document.createElement("tbody")
    for (const record of records) {
      const row = document.createElement("tr")

      for (const columnName of columnNames) {
        const cell = document.createElement(
          columnName === "Coverage Type" ? "th" : "td"
        )
        if (columnName === "MR Coverage" || columnName === "Master Coverage") {
          const img = document.createElement("img")
          if (record[columnName] !== null) {
            cell.textContent = record[columnName] + "%"
          } else {
            cell.textContent = "No coverage information"
          }
        } else if (columnName === "Diff") {
          if (record[columnName] < 0) {
            cell.textContent = record[columnName] + "% ▼"
            cell.style.color = "#D45F48"
          } else if (record[columnName] == 0) {
            cell.textContent = record[columnName] + "% ━"
            cell.style.color = "white"
          } else {
            cell.textContent = record[columnName] + "% ▲"
            cell.style.color = "green"
          }
        } else {
          cell.textContent = record[columnName] || ""
          cell.style.color = "white"
        }

        cell.style.backgroundColor = "#333238"

        row.appendChild(cell)
      }

      tbody.appendChild(row)
    }

    table.appendChild(tbody)

    table.style.borderCollapse = "collapse"
    table.style.width = "100%"
    table.style.border = "#ccc"
    table.style.marginBottom = "20px"
    table.style.marginTop = "20px"

    const tableCells = table.querySelectorAll("td, th")
    for (const cell of tableCells) {
      cell.style.border = "1px solid #3e3d45"
      cell.style.padding = "8px"
      cell.style.textAlign = "center"
    }

    const targetDiv = document.querySelector(
      ".merge-request-details.issuable-details"
    )
    if (targetDiv) {
      targetDiv.insertBefore(table, targetDiv.firstChild)
    }
  }
  insertTable(branchText)
})()
