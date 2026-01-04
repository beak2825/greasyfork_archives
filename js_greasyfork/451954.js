// ==UserScript==
// @name         AutoIt forum helper
// @namespace    V@no
// @version      1.0.1
// @description  Copy code blocks to clipboard
// @author       V@no
// @license      MIT
// @match        https://www.autoitscript.com/forum/*
// @icon         https://www.autoitscript.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/451954/AutoIt%20forum%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451954/AutoIt%20forum%20helper.meta.js
// ==/UserScript==

if (document.readyState === 'complete')
  init();
else
  document.addEventListener("DOMContentLoaded", init);


function init()
{

  "use strict";
  //replace link on logo to main website
  const elLogo = document.getElementById("elLogo");
  if (elLogo)
    elLogo.href = elLogo.href.replace(/\/forum\/$/, "");

  //homepage link to navbar
  let ul = document.querySelector('.ipsNavBar_primary > ul');
  if (ul)
  {
    const li = ul.querySelector('[data-role="navBarItem"]:nth-last-child(2)').cloneNode(true);
    li.id = "toHomePage";
    li.dataset.navapp = "homepage";
    li.firstElementChild.href = "/";
    li.firstElementChild.dataset.naveitemId = "toHomePage";
    li.firstElementChild.firstChild.textContent = "Home page";
    ul.appendChild(li);
  }
  //homepage link to mobile navbar
  ul = document.querySelector('#elMobileDrawer ul.ipsDrawer_list');
  if (ul)
  {
    const li = ul.lastElementChild.cloneNode(true);
    li.firstElementChild.href = "/";
    li.firstElementChild.textContent = "Home page";
    ul.appendChild(li);
  }
  
  //add "copy" button to all "code" blocks
  let button = document.createElement("button");
  button.className = "copyButton";
  button.textContent = "copy";
  button.setAttribute("type", "button");
  for(let i = 0, code = document.querySelectorAll("pre.ipsCode"); i < code.length; i++)
  {
    let buttons = code[i].previousElementSibling;

    //are there existing expand/popup buttons?
    if (!buttons || !buttons.matches(".geshiCodeTop"))
    {
      buttons = document.createElement("div");
      buttons.className = "geshiCodeTop";
      if (code[i].style.display)
        buttons.style.display = code[i].style.display;

      code[i].parentNode.insertBefore(buttons, code[i]);
    }
    button = button.cloneNode(true);
    button.onclick = geshiCopy;
    buttons.appendChild(button);
  }//for

  //add custom styles
  const style = document.createElement("style");
  style.textContent = `
.copyButton
{
  margin-left: 4px;
}
.copyTooltip
{
  transform: scale(0);
  opacity: 0;
  z-index: 5150;
  transition: all .05s, transform .1s, opacity 1s;
  white-space: nowrap;
}
.copyTooltip.show
{
  transform: scale(1);
  opacity: 1;
  transition: all .05s, transform .1s, opacity 0s;
}
.copyText
{
  position: absolute;
  top: ${-Number.MAX_VALUE}px;
}
pre.ipsCode
{
  transition: color 0.1s, background-color .1s, filter .1s;
}
pre.ipsCode.copied
{
  background-color: transparent;
  filter: invert(0.5);
}
`;
  document.getElementsByTagName("head")[0].appendChild(style);

  const textarea = document.createElement('textarea');
  textarea.className = "copyText";
  document.body.appendChild(textarea);

  const tooltip = (function()
  {
    const node = document.createElement("div");
    node.className = "ipsTooltip ipsTooltip_bottom copyTooltip";
    node.textContent = "Copied to clipboard";
    document.body.appendChild(node);

    window.addEventListener("mousedown", function(e)
    {
      if (!e.target.matches("button.copyButton"))
        tooltip.hide();
    });

    node.addEventListener("transitionend", function()
    {
      if (node.classList.contains("show"))
        return;

      node.style.left = null;
      node.style.top = null;
    });
    let timer;
    return {
      show: function(button)
      {
        clearTimeout(timer);
        const rect = button.getBoundingClientRect(),
              x = rect.x - rect.width / 2 + window.pageXOffset - 7,//- rect.left,
              y = rect.y + rect.height + window.pageYOffset + 7;// - rect.top;

        node.style.left = x + "px";
        node.style.top = y + "px";
        node.classList.add("show");
        timer = setTimeout(tooltip.hide, 60000); //auto hide tooltip in 1 minute

        //flash code block
        const elCode = button.parentNode.nextSibling;
        const ontransitionend = elCode.ontransitionend;
        elCode.ontransitionend = function()
        {
          elCode.ontransitionend = ontransitionend;
          elCode.classList.remove("copied");
        };
        elCode.classList.add("copied");
      },
      hide: function()
      {
        node.classList.remove("show");
      }
    };//return
  })(); //tooltip

  //naming scheme for geshi_expand_popup.js
  function geshiCopy(e)
  {
    const button = e.target;
    const elCode = button.parentNode.nextSibling;
    if (!elCode.matches("pre.ipsCode")) //only copy text from "code" blocks
      return;

    let text = "";
    const sel = window.getSelection(),
          ranges = [];

    //copy only selected text
    if ( sel.rangeCount > 0 )
    {
//      const range = document.createRange();
      for (let i = 0; i < sel.rangeCount; i++)
      {
        //backup original selection ranges
        ranges.push(sel.getRangeAt(i).cloneRange());
/*
        //only copy selected text in current code block, ignore everything else
        range.selectNodeContents(elCode);
        const selRange = sel.getRangeAt(i);
        if (selRange.compareBoundaryPoints(range.START_TO_END, range) == 1 && selRange.compareBoundaryPoints(range.END_TO_START, range) == -1) {
          if (selRange.compareBoundaryPoints(range.START_TO_START, range) == 1) {
            range.setStart(selRange.startContainer, selRange.startOffset);
          }
          if (selRange.compareBoundaryPoints(range.END_TO_END, range) == -1) {
            range.setEnd(selRange.endContainer, selRange.endOffset);
          }
          sel.removeAllRanges();
          sel.addRange(range); //this will properly convert <br> into newline
          text += sel.toString();
          ranges.push(range);
        }
*/
      }
    }

    if (text === "")
      text = elCode.textContent;

    textarea.value = text.replace(/\xa0/g, " "); //replace &nbsp; with a space
    textarea.select();
    document.execCommand('copy');
    button.focus();

    //restore selection
    sel.removeAllRanges();
    for(let i = 0; i < ranges.length; i++)
      sel.addRange(ranges[i]);

    //show tooltip
    tooltip.show(button);
  }//geshiCopy()
}//init()