// ==UserScript==
// @name        Quick opcode filter for M&B mod wiki
// @description Add a small input box in the operations and triggers pages to easily look up, find and filter specific Mount&Blade 1.011 and Warband module system opcodes and triggers.
// @namespace   https://greasyfork.org/users/4813
//
// @match       https://mbcommands.fandom.com/wiki/Operations
// @match       https://antifandom.com/mbcommands/wiki/Operations
//
// @match       https://mbcommands.fandom.com/wiki/Triggers
// @match       https://antifandom.com/mbcommands/wiki/Triggers
//
// @icon        https://static.wikia.nocookie.net/mount26blade20mooders20reference/images/4/4a/Site-favicon.ico/revision/latest
// @version     2025.09.02
// @author      Swyter
// @license     GNU GPLv3
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/543170/Quick%20opcode%20filter%20for%20MB%20mod%20wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/543170/Quick%20opcode%20filter%20for%20MB%20mod%20wiki.meta.js
// ==/UserScript==

/* swy: append our new filter input box HTML element into the page */
search=document.createElement("input")
search.setAttribute("id", "opfilter")
search.setAttribute("type", "text")
search.setAttribute("spellcheck", "false")
search.setAttribute("placeholder", "Filter operations or triggers... :)")
document.documentElement.appendChild(search)

/* swy: append our operation type checkboxes to filter by [cf] or [lhs] badge */
canfail_label=document.createElement("label")
canfail_label.textContent = "conditional (can fail)"
canfail=document.createElement("input")
canfail.setAttribute("id", "opcf")
canfail.setAttribute("type", "checkbox")
canfail_label.prepend(canfail); document.documentElement.appendChild(canfail_label)

lhs_label=document.createElement("label")
lhs_label.textContent = "assignment (left-hand side)"
lhs=document.createElement("input")
lhs.setAttribute("id", "oplhs")
lhs.setAttribute("type", "checkbox")
lhs_label.prepend(lhs); document.documentElement.appendChild(lhs_label)


/* swy: append a new inline CSS stylesheet for our stuff into the page,
        before it loads completely to avoid flicker */
style=document.createElement("style")
style.textContent = `
  .operation[hidden],
  .operation[hidden] + dl,
  h2[hidden], h3[hidden],

  body[opfilter] .mw-parser-output > p:not(.operation),
  body[opfilter] .mw-parser-output > pre,
  body[opfilter] .mw-parser-output > ol,
  body[opfilter] .mw-parser-output > ul,
  body[opfilter] .mw-parser-output > *:not(.operation) + dl,
  body[opfilter] .mw-parser-output > div,
  body[opfilter] .mw-parser-output > table,

  /* swy: on mobile content is inside <section> blocks, go figure */
  body[opfilter] .mw-parser-output section > p:not(.operation),
  body[opfilter] .mw-parser-output section > pre,
  body[opfilter] .mw-parser-output section > ol,
  body[opfilter] .mw-parser-output section > ul,
  body[opfilter] .mw-parser-output section > *:not(.operation) + dl,
  body[opfilter] .mw-parser-output section > div,
  body[opfilter] .mw-parser-output section > table,

  aside.page__right-rail,                    /* swy: get rid of the useless right block cruft from Fandom; usually only shows ads */
  div.main-page-box:has(a[href*=greasyfork]) /* swy: get rid of the tip mentioning this userscript if it's already installed */
  {
    display: none !important; /* swy: hide all the flowing text, explanations and tables while in filter mode */
  }

  input#opfilter
  {
    position: fixed;
    width: calc(100dvw - (20dvw + 20dvw)); /* swy: center it leaving 20% of page width at either side */
    left: calc(20dvw);
    top: calc(100dvh - 20px - 42px);
    box-shadow: 0 0 4px black, 0 0 40px black, 0 0 100px black;
    opacity: .8;
    z-index: 300; /* swy: make it appear when outside of the HTML <body>, the input element gets added to the HTML root */
    font-size: x-large;
    border: none;
    border-radius: 2px;
    padding: 3px;
  }

  input#opfilter:not(:focus)
  {
    opacity: .35; /* swy: fade it out when the input box is not focused */
  }

  label:has(input#opcf), label:has(input#oplhs)
  {
    position: fixed;
    width: calc(100dvw - (20dvw + 20dvw)); /* swy: center it leaving 20% of page width at either side */
    left: calc(100dvw - 20dvw);
    top: calc(100dvh - 20px - 45px);
    text-shadow: 0 0 4px var(--theme-accent-color), 0 0 40px var(--theme-accent-color), 0 0 100px var(--theme-accent-color);
    opacity: .5;
    z-index: 300; /* swy: make it appear when outside of the HTML <body>, the input element gets added to the HTML root */
    padding: 0 5px;
    color: var(--theme-page-text-color);
  }
  label:has(input#oplhs)
  {
    top: calc((100dvh - 20px - 45px) + 20px);
  }

  .main-container, .page
  {
    //overflow-x: auto; /* swy: make it so that the search box stays on the viewport at all times on mobile */
  }

  * { scroll-margin-top: 100px; } /* swy: fix scrolling to an element but getting hidden by the top bar: https://stackoverflow.com/a/59253905/674685 */
`
document.documentElement.appendChild(style)

/* swy: on every new typed input do this */
search.oninput=function(e)
{
  /* swy: hide all the non-operation stuff (text, explanations, ...) when using the search box; make it clean */
  document.body.setAttribute("opfilter", "true")

  /* swy: get a list of every operation, get the search text the user typed, split into words */
  operations  = document.querySelectorAll(".operation");
  search_text = e.target.value

  search_elems = search_text.toLowerCase().split(/\s+/)

  /* swy: go across every operation in the page and show it, if it contains
          *every* word in the filter, or just hide it otherwise */
  for (var op of operations)
  {
    matches_all = true

    for (var el of search_elems)
      if (!op.id.includes(el))
        matches_all = false

    /* swy: if we're filtering by some operation type badge, exclude this op if it doesn't have it, easy */
    if (canfail.checked && !op.classList.contains("can_fail"))
      matches_all = false

    if (lhs.checked && !op.classList.contains("lhs"))
      matches_all = false

    if (matches_all)
      op.removeAttribute("hidden")
    else
      op.setAttribute("hidden", "true")
  }

  /* swy: hide empty headers (with no operation block hanging from it) */
  wiki_content = document.querySelector(".mw-parser-output")
  cur_elem     = wiki_content.lastElementChild
  parent_ctx = 0
  ctx = 0
  /* swy: do this for every element inside the actual wiki content in the page; from bottom to top,
          so that we can get the number of elements before arriving into their header */
  do
  {
    cur_elem_visible = !!cur_elem.offsetParent; /* swy: https://stackoverflow.com/a/21696585/674685 */

    /* swy: on the mobile page the <p> sections next to <h2> are wrapped in <section> blocks,
            so everything inside can be hidden, but the parent <section> still appears as visible
            PS: functions like checkVisibility() still consider a borderless zero-pixel <section> element as visible. webdev'ing being a trainwreck as usual */
    if (cur_elem.nodeName == "SECTION")
      cur_elem_visible = cur_elem.getBoundingClientRect().height > 0;

    /* swy: if we're some kind of header HTML element (note that the visibility doesn't matter) */
    if (cur_elem.nodeName.length == 2 && cur_elem.nodeName[0] == 'H' && cur_elem.nodeName[1] <= '9')
    {
      h_number = +cur_elem.nodeName[1] /* swy: get the header number: 'h3' -> 3 */

      /* swy: if we're an H4 or H3 (smaller headers) and we have visible items, OR
              if we're a H2 (top-most header) and there were visible items since the last H2, show it */
      if ((ctx > 0 && h_number > 2) || (parent_ctx > 0 && h_number == 2))
        cur_elem.removeAttribute("hidden")
      else /* swy: otherwise hide it */
        cur_elem.setAttribute("hidden", "true")

      /* swy: reset the item count that we held since the last top-level header */
      if (h_number == 2)
        parent_ctx = 0

      /* swy: reset the item count that we held since the last smaller header */
      ctx = 0
    }
    /* swy: we're a visible operation block; so increment the count */
    else if(cur_elem_visible)
    {
      ctx++; parent_ctx++
    }
  } while (cur_elem = cur_elem.previousElementSibling);

  /* swy: scroll into the first (visible) operation that matches our search, if any */
  if (first_visible_op = document.querySelector('.operation:not([hidden])'))
      first_visible_op.scrollIntoView();
}

/* swy: trigger a search whenever we click a checkbox, as if we had typed something */
canfail.oninput=function(e) { search.dispatchEvent(new Event("input")) }
    lhs.oninput=function(e) { search.dispatchEvent(new Event("input")) }