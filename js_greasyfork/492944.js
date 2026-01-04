// ==UserScript==
// @name        CCAU - Navigation Bar
// @namespace   CCAU Suite
// @description Automate course copies
// @match       https://*.instructure.com/courses/*
// @version     0.1.0
// @author      Abendsonnenschein
// @icon        https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @grant       none
// @license     AGPL-3.-or-later
// @downloadURL https://update.greasyfork.org/scripts/492944/CCAU%20-%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/492944/CCAU%20-%20Navigation%20Bar.meta.js
// ==/UserScript==
(()=>{var u="https://raw.githubusercontent.com/Abendsonnenschein/CCAU-Navbar/main/data.json",i="https://se.instructure.com";function s(t){console.log("[CCAU] "+t)}function l(t,e){let o=document.querySelector(".right-of-crumbs"),n=document.createElement("a");n.id="ccau_navbar",n.textContent=t.name,n.setAttribute("title",t.help),n.classList.add("btn"),n.setAttribute("tabindex","0"),n.addEventListener("click",e,!1),o?.insertAdjacentElement("beforebegin",n)}function m(t){let e=document.getElementById("ccau_navbar");if(!e){s("Button not found");return}e.textContent=t.name,e.setAttribute("title",t.help)}function c(){return window.location.href.match(/courses\/(\d+)/)?.[1]??"NO_COURSE_ID"}function d(t){let e=c();window.location.href=`${i}/courses/${e}/${t}`}function a(){let t=c(),e=localStorage.getItem(`ccau_${t}_task`);return Number(e)}function p(t){let e=c();localStorage.setItem(`ccau_${e}_task`,t.toString())}function h(){let e=Date.now(),o=Number(localStorage.getItem("ccau_task_ts"))??0;e-o<864e5||fetch(u).then(n=>n.json()).then(n=>{localStorage.setItem("ccau_task",JSON.stringify(n)),localStorage.setItem("ccau_task_ts",e.toString())})}function f(){h();let t=localStorage.getItem("ccau_task")??"[]";return JSON.parse(t).tasks}function _(){if(!document.querySelector("#global_nav_accounts_link")){s("Only admins can use this script");return}let t=f(),e=a()??0,o=t[e];l(o,()=>b(t))}function b(t){let e=a()??0,o=t[e],n=(e+1)%t.length,r=t[n];p(n),m(r),o.path!==r.path&&d(o.path)}_();})();
