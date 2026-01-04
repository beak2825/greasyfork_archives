// ==UserScript==
// @name         usuwanie nie wymaga oceny
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  ehms usuwanie niepotrzebnego
// @author       obci
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8
// @match        https://ehms.pk.edu.pl/standard/?tab=5&sub=8
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2021%2F22L
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2021%2F22Z
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2022%2F23L
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2022%2F23Z
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2023%2F24L
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2023%2F24Z
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2024%2F25L
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2024%2F25Z
// @match        https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=2025%2F26Z
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ehms.pk.edu.pl/standard/?tab=122
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469702/usuwanie%20nie%20wymaga%20oceny.user.js
// @updateURL https://update.greasyfork.org/scripts/469702/usuwanie%20nie%20wymaga%20oceny.meta.js
// ==/UserScript==


if (location.href === "https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8" || location.href === "https://ehms.pk.edu.pl/standard/?tab=5&sub=8"){
  let result = document.querySelector("#myform > div > div > select > option:nth-child(1)").value.replace("/", "%2F");
  result = "https://ehms.pk.edu.pl/standard/index.php?tab=5&sub=8&RokAk=" + result;
     location.href=result;
 }

let dlugosctablicy = document.querySelector("#content > div > div.p-3 > div > table").rows.length - 1;
let tablica = [];
for (let i = 1; i <= dlugosctablicy; i += 1)
{
  let costam = document.querySelector(`#content > div > div.p-3 > div > table > tbody > tr:nth-child(${i}) > td:nth-child(8)`).innerText;

  if (costam == "nie wymaga oceny")
    tablica.push(i);
 }
 tablica.sort(function(a, b){return b-a});
 tablica.forEach(element => {
     document.querySelector(`#content > div > div.p-3 > div > table > tbody > tr:nth-child(${element})`).remove();
 });
