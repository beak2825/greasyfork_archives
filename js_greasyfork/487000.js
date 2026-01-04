// MIT License

// Copyright (c) 2024 Sharad Raj Singh Maurya

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// ==UserScript==
// @name        Social Internship - Automater
// @namespace   https://sharadcodes.github.io
// @author      sharadcodes
// @description Fills data automatically in the form
// @include     https://online.dsvv.ac.in/student/ToliProgramData*
// @supportURL  https://github.com/sharadcodes/UserScripts/issues
// @version     1.0.0
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/487000/Social%20Internship%20-%20Automater.user.js
// @updateURL https://update.greasyfork.org/scripts/487000/Social%20Internship%20-%20Automater.meta.js
// ==/UserScript==

window.onload = function() {
  document.querySelector("#SCHOLARNO").value = 9999999;
  document.querySelector("#DOB").value = "2000-01-01";
  document.querySelector("#parm_footer > button").click();
  setTimeout(()=>{
    document.querySelector("#ProgramDate").value = "2024-01-01";
    document.querySelector("#ProgramPlace").value = "Program Place Address Here";
    document.querySelector("#ProOrgMobileNo").value = 1234567890;
    document.querySelector("#ProgramOrganizer").value = 'Shri A';
    document.querySelector("#Programachievement").value = 'Excellent';
  },1000)
}