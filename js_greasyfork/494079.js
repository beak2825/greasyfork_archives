// ==UserScript==
// @name         KIIT-Connect Unlocker
// @namespace    https://github.com/rohitaryal/kiitconnect-unlocker
// @version      3.0
// @description  Unlock kiitconnect for free
// @author       rohitaryal
// @match        https://www.kiitconnect.com/academic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiitconnect.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494079/KIIT-Connect%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/494079/KIIT-Connect%20Unlocker.meta.js
// ==/UserScript==

const debugMode = true;

const driveFile = "https://drive.google.com/file/d/";
const driveFolder = "https://drive.google.com/drive/folders/";
const youtubePlaylist = "https://www.kiitconnect.com/player?playlistId=";

const pyqsRegex = /academic\/PYQS\/Content\/PYQS\-(cse|csse|csce|it)\-[1-7]/;
const notesRegex = /academic\/PYQS\/Content\/Notes\-(cse|csse|csce|it)\-[1-7]/;

class Utils {
  constructor() { }
  /*
   * Get all script that doesn't have src attribute
   */
  static getScripts() {
    let scriptElements = document.querySelectorAll("script:not([src])");
    return [...scriptElements];
  }

  /*
   * Copy item to clipboard
   */
  static copy(text) {
    document.body.focus();
    navigator.clipboard.writeText(text);
  }

  /*
   * Logger for debug mode
   */
  static log(text) {
    if (debugMode) {
      console.log(text)
    }
  }

  /*
   * Clone node and remove its junk and replace with new one
   */
  static replaceNode(node) {
    if (!node) {
      throw new Error("Invalid node provided to clone");
    }

    const newNode = node.cloneNode(true);
    node.replaceWith(newNode);

    return newNode;
  }

  /*
   * Re-Serialize the json in our own way (For PYQS)
   */
  static parsePYQ(data) {
    if (typeof data !== 'object') {
      throw new Error(`Expected 'object' but obtained '${typeof data}' while parsing`);
    }

    // Skeleton for subjects pyq, syllabus + some extra detail holder
    let pyqDetails = {
      semester: data.semeseter, // Yes, thats the actual spelling
      branch: data.stream,
      subjects: [],
    };

    pyqDetails.subjects = data.data.semesters[0].subjects.map((subject) => {
      // Skeleton for subject detail holder
      let subDetails = {
        subjectName: subject.name,
        subjectCode: subject.SUBCODE,
        folder: driveFolder + subject.folderId, // Makes an accessable drive folder link
        subjectSyllabus: driveFile + subject.syllabus, // Makes an accessable drive file link
        playlist: [],
        papers: [],
      };

      // Parse individual playlist
      subDetails.playlist = subject.youtubePlaylist.map((playlist) => {
        return {
          id: playlist.id,
          title: playlist.title,
          videoCount: playlist.noOfVides,
          videoLink: `${youtubePlaylist}id&playlist=${playlist.title}`
        };
      });

      // Parse individual pyqs
      subDetails.papers = subject.pyqs.map((paper) => {
        return {
          name: paper.name,
          year: Number(paper.year) || 0,
          solution: driveFile + paper.solution, // Makes an accessable file link
          question: driveFile + paper.Question, // Same
        }
      });

      // Sort papers based on years
      subDetails.papers = subDetails.papers.sort((a, b) => a.year - b.year);

      return subDetails;
    });

    return pyqDetails;
  }

  /*
   * Re-Serialize the json in our own way (For Notes)
   */
  static parseNotes(data) {

  }

  /*
   * Parse script content (For PYQS)
   */
  static parseFromScriptPYQ(scriptContent) {
    // Pre-process and beautufy
    scriptContent = scriptContent.replaceAll(`\\"`, `"`);
    scriptContent = scriptContent.replaceAll(`\\n`, ``);

    const parsableContent = scriptContent.slice(
      scriptContent.indexOf(`self.__next_f.push([1,"1e:`) + 26, // <-- 26 is the length of this
      scriptContent.lastIndexOf(`"])`)                          //     string itself.
    );

    const jsonContent = JSON.parse(parsableContent)[3].children[3];

    return this.parsePYQ(jsonContent);
  }

  /*
   * Parse script content (For Notes)
   */
  static parseFromScriptNotes(scriptContent) {

  }

  /*
   * Replace pyq table + headings with from our own serialized form
   */
  static rewritePYQPage(subjectArray) {
    if (typeof subjectArray !== 'object') {
      throw new Error(`Expected 'object' but obtained '${typeof subjectArray}' while rewriting`);
    }

    // After successful injection head will contain this classlist
    // which is an indicator to stop further injection
    if(document.head.classList.contains("injected")) {
      return;
    }

    Utils.log("Re-writing the pyq page.")

    const parentContainer = [...document.querySelector("main div div").childNodes].slice(1);
    
    for (let i = 0; i < parentContainer.length; i++) {
      let totalRows = parentContainer[i].querySelectorAll("table tbody").length; // Get count of rows
      for (let j = 0; j < subjectArray.length; j++) {
          let totalPapers = subjectArray[j].papers.length;
  
          if (totalRows === totalPapers) {
              let temp = subjectArray[j];
              subjectArray[j] = subjectArray[i];
              subjectArray[i] = temp;
              break;
          }
      }
  }
  

    for (let i = 0; i < subjectArray.length; i++) {
      const subject = subjectArray[i];
      const parent = parentContainer[i];
      const [titleDiv, tableContainer] = parent.childNodes;

      const syllabusButton = titleDiv.querySelector("a");
      syllabusButton.href = subject.subjectSyllabus;

      // New button with folder link
      const folderButton = syllabusButton.cloneNode(true);
      folderButton.innerText = "Open Folder";
      folderButton.href = subject.folder;

      
      // Modify title (middle one is TEXT_NODE)
      const title = titleDiv.childNodes[1];
      title.textContent = subject.subjectName;
      
      // Modify the table
      const tableRows = tableContainer.querySelectorAll("table tbody");

      for (let j = 0; j < tableRows.length; j++) {
        const row = tableRows[j];
        const paper = subject.papers[j];

        const td = row.querySelectorAll("td:not(.hidden)");

        // Year of paper
        td[0].textContent = paper.year;

        // Link to question paper
        let paperAnchor = td[1].querySelector("a");
        paperAnchor = this.replaceNode(paperAnchor);

        paperAnchor.textContent = paper.name;
        paperAnchor.href = paper.question;
        paperAnchor.classList.add("text-cyan-500");
        paperAnchor.classList.remove("text-yellow-500", "cursor-not-allowed");

        // Link to solution paper
        let solutionAnchor = td[2].querySelector("a");

        // Since solution is the last element
        if(!solutionAnchor)
          continue;

        solutionAnchor = this.replaceNode(solutionAnchor);

        if (solutionAnchor.classList.contains("text-gray-400")) {
          solutionAnchor.textContent = "Not Available";
        } else {
          solutionAnchor.classList.add("text-cyan-500");
          solutionAnchor.classList.remove("text-yellow-500", "cursor-not-allowed");

          solutionAnchor.href = paper.solution
        }
      }
    }

    // Mark as succrssful injection
    document.head.classList.add("injected");
  }
}

(function () {
  'use strict';
  // Last script will always contain the paper's JSON
  let scriptContent = Utils.getScripts().at(-1).textContent;


  if (!!location.pathname.match(pyqsRegex)) { // Means we are in 'pyqs' page
    const parsedContent = Utils.parseFromScriptPYQ(scriptContent);

    window.addEventListener('load', function () {
      Utils.log("DOMContent has been loaded");
      this.setInterval(function () {
        try {
          Utils.rewritePYQPage(parsedContent.subjects);
        } catch(e) {
          console.log(e)
        }
      }, 2000)
    });

  } else if (!!location.pathname.match(notesRegex)) { // Means we are in 'notes' page

  }
})();