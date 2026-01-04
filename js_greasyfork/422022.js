// ==UserScript==
// @name        Print personsbook.com Course List
// @namespace   Violentmonkey Scripts
// @match       *://www.personsbook.com/udemy-courses*
// @grant       none
// @version     1.5.3
// @author      gogvale
// @description Logs to console a markdown with a list of course names of the current personsbook.com post
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/422022/Print%20personsbookcom%20Course%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/422022/Print%20personsbookcom%20Course%20List.meta.js
// ==/UserScript==

courseList = [...document.querySelectorAll('p>span')]
  .map(e=>e.textContent)
  .map(e=>/^—+/.test(e) ? null : e)
  .map(e=>/daily/i.test(e) ? null : e)
  .map(e=>/^http/.test(e) ? null : e)
  .map(e=>/^Get Followers/.test(e) ? null : e)
  .map(e=>/^How to get paid udemy courses/i.test(e) ? null : e)
  .map(e=>/^World Persons and Online Courses Daily/i.test(e) ? null : e)
  .map(e=>/Sign up now/i.test(e) ? null : e)
  //.map(e=>/[^\x20-\x7E]+/.test(e)?  null : e)
  .filter(e=>e);
date = document.querySelector("h1.post-title>a").textContent.split(" – ")[1]

courseList = [...new Set(courseList)].sort().map(e=>"- "+e) .join('\n')
string = `**Cursos gratis del día (${date})**\n${document.URL}\n` + "```markdown\n"+courseList+"\n```";

console.log(string);
