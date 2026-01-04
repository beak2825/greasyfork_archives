// ==UserScript==
// @name         CourseHunters
// @namespace    https://greasyfork.org/en/users/153343-indi-cracker
// @version      1.4
// @description  This Script will let you download course from coursehunters.
// @author       Indicracker
// @match        https://coursehunter.net/course/*
// @grant        none

// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js



// @downloadURL https://update.greasyfork.org/scripts/40914/CourseHunters.user.js
// @updateURL https://update.greasyfork.org/scripts/40914/CourseHunters.meta.js
// ==/UserScript==

// UI Elements

const lessonLinkElement = document.querySelectorAll('link[itemprop~=contentUrl]'),
      lessonNameElement = document.querySelectorAll('.lessons-name'),
      body = document.querySelector('body'),
      courseName = document.querySelector('.hero-description');

// Data Container
const lessonLink = [],
      lessonName = [];

(function() {
  'use strict';

  // Init UI
  initUI();
  // Get Course Link and structure Download Data
  getCourseLinks();


  function downloadX(filename, datatype, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:' + datatype + ';charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function createIDM() {
    let list =
      'IF EXIST %PROGRAMFILES(X86)%\n(cd "%ProgramFiles(x86)%\\Internet Download Manager")\nELSE (cd "%ProgramFiles%\\Internet Download Manager")\n';
    for (let i = 0; i < lessonLinkElement.length; i++) {
      list +=
        'IDMan.exe  /n /p "%UserProfile%\\Downloads\\CourseHunter\\' +
        courseName.textContent +
        '" /a /f "' +
        lessonName[i] +
        '.mp4" /d "' +
        encodeURI(lessonLink[i]) +
        '"\n';
    }
    list += 'IDMan.exe /s \n';
    list += 'IDMan.exe';
    var zip = new JSZip();
    zip.file('IDMan.bat', list);
    zip.generateAsync({type: 'blob'}).then(function(content) {
      saveAs(content, courseName.textContent + '.zip');
    });
  }
    function initUI() {
    //append UI
    body.innerHTML += `<div id="downloader-container" style="z-index: 999; width: 450px; height: 160px; color: white; background: linear-gradient(to right, #0984e3, #00cec9); border-radius: 20px; box-shadow: 0px 0px 30px #2c3e50; font-family: sans-serif; position:fixed; bottom: 10px; left: 10px;"> <style>input[type=number]{border-radius: 5px; border: 0;}</style> <div id="downloader-items" style="display: table; float: left;"> <p id="course-p" style="font-size: 15px; margin-top:20px; margin-left: 20px; width: 300px; height: 45px;">Fundamentals of the C Programming Language</p><div style="margin-left: 20px;"> <span for="start">Start:</span> <input style="width: 50px; height: 30px; text-align: center; margin-right: 20px;" type="number" name="start" id="start" value="1" disabled> <span for="end">End:</span> <input style="width: 50px; height: 30px; text-align: center; " type="number" name="end" id="end" value="" disabled> </div></div><div style="display: table; float: left; position: absolute; bottom: 50px; left: 250px;"> <input id="txt" type="checkbox" style=" vertical-align: middle; "> Text <br><input id="idm" type="checkbox" style=" vertical-align: middle;" checked> IDM </div><div style="clear: both;"></div><div class="download-section"style="cursor: pointer; float: right; width: 100px; height: 100px; border-radius: 50%; margin-right: 30px; text-align: center; position: absolute; top: 40px; left: 330px; background: linear-gradient(to right, #ecf0f1, #bdc3c7); box-shadow: 0px 0px 10px #2c3e50;"> <img class="dwn-img" src="https://s31.postimg.cc/ava5xpnrv/ios7-cloud-download-outline.png" style="display: table-cell; margin: 0 auto; width: 50px; margin-top: 25px;"> </div><a href="https://greasyfork.org/en/scripts/40914-coursehunters" target="_blank" style="display: block; font-size: 25px; text-decoration: none; font-family: 'open Sans'; position: absolute; bottom: 10px; left: 20px; box-shadow: 0 0 0 1px;">HELP ?</a> </div>`;
    //UI Elements
    const Course_Name = document.querySelector('#course-p'),
      uiContainer = document.querySelector('#downloader-container'),
      end = document.querySelector('#end');

    Course_Name.textContent = courseName.textContent;
    end.value = lessonLinkElement.length;
  }
    function getCourseLinks() {
    for (let o = 0; o < lessonLinkElement.length; o++) {
      lessonLink.push(lessonLinkElement[o].href);
    }

    for (let n = 0; n < lessonNameElement.length; n++) {
      lessonName.push(lessonNameElement[n].innerHTML.replace('Урок', 'Lesson').replace(/\s/g, '_').replace(':','-'));
    }

    let lessonDownload = lessonLink.map((el, i) => el + '[' + lessonName[i] + '.mp4\n').join(' ');

    console.clear();

    //Download
    let downloadBtn = document.querySelector('.download-section');
    let idm = document.querySelector('#idm');
    let text = document.querySelector('#txt');

    downloadBtn.addEventListener('click', e => {
      if (text.checked && idm.checked) {
        alert(`Choose only one; "TEXT" or "IDM"`);
      } else if(!text.checked && !idm.checked) {
         alert(`Tick "TEXT" or "IDM"`);
      } else {
        text.checked ? downloadX('list.txt', 'text/plain', lessonDownload) : createIDM();
      }
      e.preventDefault();
    });
  }

})();