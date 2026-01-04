// ==UserScript==
// @name        AO3 Fix double-spaced paragraphs and text walls
// @description Eliminate gaps from empty/whitespace paragraphs & leading/trailing <br>. Smart split walls of text into spaced paragraphs. Also get rid of justified text.
// @author      C89sd
// @version     1.6
// @include     /^https:\/\/archiveofourown\.org\/(?:collections\/[^\/]+\/)?(:?works|chapters)\/\d+(?:\/chapters\/\d+)?\/?(?:\?.*)?$/
// @namespace    https://greasyfork.org/users/1376767
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/534532/AO3%20Fix%20double-spaced%20paragraphs%20and%20text%20walls.user.js
// @updateURL https://update.greasyfork.org/scripts/534532/AO3%20Fix%20double-spaced%20paragraphs%20and%20text%20walls.meta.js
// ==/UserScript==

'use strict';

// Testing:
// https://archiveofourown.org/works/63851347                     empty <p>
// https://archiveofourown.org/works/13439460                     leading <br>
// https://archiveofourown.org/works/5191202?view_full_work=true  formatting
// https://archiveofourown.org/works/44688217/chapters/112432564  split inner <br>

const workskin = document.getElementById('workskin');
if (!workskin) return;

// Remove justified text
const js = workskin.querySelectorAll('[align="justify"]');
for (const j of js) {
  j.align = '';
}

const IS_EMPTY = /^\s*$/;
const STARTS_WITH_EM_DASH = /^[\u2013\u2014-]/;
const PRESERVE_BREAK_AFTER = /^(IMG|VIDEO|AUDIO|SOURCE|TRACK|IFRAME|CODE)$/;
function getLastRecursiveChild(el) { return el.lastElementChild ? getLastRecursiveChild(el.lastElementChild) : el; }

// Remove gaps in paragraphs
const ps  = workskin.querySelectorAll('p');
for (const p of ps) {
  // p.innerHTML = "abc;<br>123<br><em>def;</em><em>cde;</em>gdh";
  // console.log(p.innerHTML)

  // Remove gaps from empty paragraphs
  if (IS_EMPTY.test(p.textContent)) { p.remove(); continue; }

  // Remove gaps from leading/trailing <br> nodes or empties
  let n;
  while ((n = p.firstChild) && (n.tagName === 'BR' || (n.nodeType === 3 && IS_EMPTY.test(n.textContent)))) { // TEXT_NODE (3)
    n.remove();
  }
  while ((n = p.lastChild) && (n.tagName === 'BR' || (n.nodeType === 3 && IS_EMPTY.test(n.textContent)))) { // TEXT_NODE (3)
    n.remove();
  }

  // Fast-fail, early rejection if there are no inner <br>,
  //   like this but non recursive: `if (!p.querySelector('br')) continue;`
  let hasBr = false;
  for (let n = p.firstChild; n; n = n.nextSibling) {
    if (n.tagName === 'BR') { hasBr = true; break; }
  }
  if (!hasBr) continue;

  // Assume it's a quote with intended <br> line returns if its parent style is centered.
  const textAlign = getComputedStyle(p).textAlign;
  if (textAlign === 'center' || textAlign == 'right' || textAlign == 'end') continue;

  // Assume it's a quote if the last sentence starts with a dash.
  if (STARTS_WITH_EM_DASH.test(p.lastChild.textContent)) continue;

  // Assume it's a quote if the last sentence is a link
  if (getLastRecursiveChild(p).tagName === 'A') continue;

  // Split inner <br>:
  // Create a new <p> behind you and shovel nodes into it as you walk.
  // Create a new <p> when encountering a <br> to create a gap.
  {
    let node = p.firstChild;
    let newp;
    let createnewp = true;
    while (node) {
      let next  = node.nextSibling;
      let next2 = next?.nextSibling;

      let shovel  = false;
      let shovel2 = false;

      // It is plausible that the writer intended this <br> as a line return to this adjacent element.
      // Keep it by shoveling both at the same time in the new <p>.
      if      (next && node.tagName === 'BR' && PRESERVE_BREAK_AFTER.test(next.tagName)) { shovel = true; shovel2 = true; }
      else if (next && PRESERVE_BREAK_AFTER.test(node.tagName) && next.tagName === 'BR') { shovel = true; shovel2 = true; }

      // Hit a <br>, delete it and request a new split to create a gap.
      else if (node.tagName === 'BR') { p.removeChild(node); createnewp = true;     node = next; continue; }

      // Text-like node (txt,em,i,strong,...), belongs inline while there isn't a <br>. Shovel it in the new <p>.
      else { shovel = true; }


      if (createnewp) {
        createnewp = false;
        // Create a new <p> before the current node, creates a gap.
        newp = document.createElement('p');

          // // NOTE: Moving nodes into this new <p> adds the standard amount of vertical spacing,
          // // but we can't be 100% sure that the <br> wasn't on purpose. To mark a difference visually,
          // // we can set a slightly lower margin that will still be readable.
          // newp.style.margin    = '0.8em auto';

        p.insertBefore(newp, node); // Insert behind
      }

      if (shovel)  { shovel  = false; newp.appendChild(node); }
      if (shovel2) { shovel2 = false; newp.appendChild(next); next = next2; }
      node = next;
    }
  }
}