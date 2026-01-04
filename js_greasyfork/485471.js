// ==UserScript==
// @name         blank badge view
// @description  NEEDS CODE INJECTOR TO RUN- https://greasyfork.org/en/scripts/446636-code-injector-starblast-io
// @version      1.2
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/926687-m4tr1x
// @match        https://starblast.io/
// @icon       https://cdn.upload.systems/uploads/pMm90TX9.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485471/blank%20badge%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/485471/blank%20badge%20view.meta.js
// ==/UserScript==
 
 
const modName = "SendFiveEmotes";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");
 
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
 
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("src didn't change");
    prevSrc = src;
  }

if (blankbadge === "true") {
                src = src.replace(
                    /,\s*"blank"\s*!==\s*this\.custom\.badge/
                    , ',"blank"'
                );
                src = src.replace(
                    /default:t.fillStyle="hsl\(200,50%,20%\)"/
                    , 'case"blank":t.fillStyle="hsla(50, 100%, 70%, 0)";break;default:t.fillStyle="hsl(200,50%,20%)"'
                );
                src = src.replace(
                    /default:t.fillStyle="hsl\(50,100%,70%\)"/
                    , 'case"star":t.fillStyle="hsl(50,100%,70%)",t.fillText("S",e/2,i/2);break;case"blank":t.fillStyle="hsla(50, 100%, 70%, 0)";break;default:t.fillStyle="hsl(50,100%,70%)"'
                );
            }
log(`Mod injected`);
  return src;
}
 
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
  try {
    return injector(sbCode);
  } catch (error) {
    alert(`${modName} failed to load; error:` + error);
    throw error;
  }
});
log(`Mod loaded`);