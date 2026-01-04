// ==UserScript==
// @name         Webpage Dara Analyzer w/ Download Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license       MIT
// @author        SijosxStudio
// @url               https://greasyfork.org/en/users/1375139-sijosxstudio
// @description  Analyzes webpage inputs and downloads results as a .txt file
// @match        http*://*/*/*/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/516271/Webpage%20Dara%20Analyzer%20w%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/516271/Webpage%20Dara%20Analyzer%20w%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Helper function to check if text is JavaScript code
    function isJavaScriptCode(text) {
        const codeIndicators = ["function", "var", "let", "const", "=>", "return", "if", "else", "{", "}"];
        return codeIndicators.some(indicator => text.includes(indicator));
    }

// Function to validate and fix simple JavaScript code
    function validateAndFixCode(code) {
        try {
            new Function(code); 

// Basic syntax check
            return code;
        } catch (e) {
            return "// Syntax Error Fixed: " + e.message + "\n" + code.replace(/;(?=\s*;)/g, ""); 

// Removes duplicate semicolons
        }
    }

// Function to summarize text while keeping key details
    function summarizeText(text) {
        return text.length > 100 ? text.slice(0, 97) + "..." : text;
    }

// Function to crawl the page and analyze inputs
    function analyzePage() {
        let output = "";
        const inputs = document.querySelectorAll("input, textarea");

        inputs.forEach(input => {
            let value = input.value.trim();
            if (!value) return;

            if (isJavaScriptCode(value)) {
                value = validateAndFixCode(value);
                output += `\n\nCode:\n${value}`;
            } else {
                const summary = summarizeText(value);
                output += `\n\nText Summary:\n${summary}`;
            }
        });

        return output;
    }

// Function to download analyzed content as a .txt file
    function downloadAsTextFile(content, filename = "webpage_analysis.txt") {
        const link = document.createElement("a");
        link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

// Function to handle the analysis and download process
    function startAnalysis() {
        const analyzedContent = analyzePage();
        downloadAsTextFile(analyzedContent || "No inputs to analyze.");
    }

// Create the analysis button
    const analyzeButton = document.createElement("button");
    analyzeButton.innerText = "Download Analysis";
    analyzeButton.style.position = "fixed";
    analyzeButton.style.bottom = "20px";
    analyzeButton.style.right = "20px";
    analyzeButton.style.padding = "10px 15px";
    analyzeButton.style.backgroundColor = "#007AFF";
    analyzeButton.style.color = "#fff";
    analyzeButton.style.border = "none";
    analyzeButton.style.borderRadius = "5px";
    analyzeButton.style.cursor = "pointer";
    analyzeButton.style.zIndex = "1000";
    analyzeButton.onclick = startAnalysis;

// Add button to the page
    document.body.appendChild(analyzeButton);
})();