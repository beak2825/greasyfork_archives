// ==UserScript== 
// @name        Paper Clip (Save pages as XHTML/Markdown/Text)
// @description Edit and save selection as clean XHTML, Markdown or Text file optimized for printing. Hotkey: Command + Shift + S.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.paperclip
// @homepageURL https://greasyfork.org/scripts/465960-paper-clip
// @supportURL  https://greasyfork.org/scripts/465960-paper-clip/feedback
// @copyright   2023 - 2025, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @require     https://unpkg.com/turndown/dist/turndown.js
// @exclude     devtools://*
// @match       file:///*
// @match       *://*/*
// @version     25.01.24
// @run-at      document-end
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5OOPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/465960/Paper%20Clip%20%28Save%20pages%20as%20XHTMLMarkdownText%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465960/Paper%20Clip%20%28Save%20pages%20as%20XHTMLMarkdownText%29.meta.js
// ==/UserScript==

/*

TODO

0) ePUB and HTMLZ

1) Display preview

2) Bookmarklet

3) jsPDF /parallax/jsPDF

4) Remove style="background-image: url('https://torrentfreak.com/images/canada-featured.jpg');"
   https://torrentfreak.com/movie-companies-cannot-use-piracy-notice-scheme-to-facilitate-class-action-230629/
   
5) Save description too for MD and TXT. example: restoreprivacy.com

6) Footnotes for TXT
   * Collect all hyperlinks (array)
   * Scan for text
   NO
   AGAIN
   * For each hyperlink detected, enter an pointer of some sort
   NO
   AGAIN
   * Detect hyperlink
   * Place links into an array
   * Replace each hyperlink by text and a number (i.e. [1])
     * Replace hyperlink
     * Append link to array
   * Extract all links from array as footnotes

FIXME

1) https://vision.gel.ulaval.ca/~klein/duke3d/

2) Replace element-img enclosed in element-a by href of element-a
   NO
   Better use place these as footnotes

3) Rense.com & epubbooks.com

4) Replace element img with attribute alt to element span
   https://datawrapper.dwcdn.net/qBzPR/6/

5) Code (pre) is realized as one line questions/72294299/multiple-top-level-packages-discovered-in-a-flat-layout

*/

// Check whether HTML; otherwise, exit.
//if (!document.contentType == 'text/html')
//if (document.doctype == null) return;

var
  originalBackground, originalColor,
  originalDisplay, originalOutline;

const time = new Date();
const namespace = 'i2p.schimon.paperclip';

// FIXME set hotkey
document.onkeyup = function(e) {
  //if (e.ctrlKey && e.shiftKey && e.which == 49) { // Ctrl + Shift + 1
  if (e.metaKey && e.shiftKey && e.which == 83) { // Command + Shift + S
    console.info('Saving selection to HTML.')
    generateXHTML();
  }
};

// TODO https://community.arm.com/support-forums/f/architectures-and-processors-forum/5814/what-is-difference-between-arm7-and-arm-cortex-m-series/13573#13573
// event listener
// event "click" and "mouseup" are the most sensible, albeit not accurate
// event "mousemove" is the most manipulative (per user), yet (almost) the most accurate
// event "select" seem to work only inside element input
window.addEventListener('click',event => {
//document.addEventListener('click',event => {
  let selection = document.getSelection();
  let btn = document.getElementById(namespace);
  if (!btn && selection.toString().length) {
    btn = createButton(event.pageX, event.pageY);
    // TODO Move "append"s to a function
    btn.append(actionButton('close'));
    btn.append(actionButton('save'));
    btn.append(actionButton('highlight'));
    btn.append(actionButton('edit'));
    btn.append(actionButton('send'));
    document.body.append(btn);
  } else
  if (btn && !selection.toString().length) {
    btn.remove();
  }
}, {passive: true});

// TODO declare variables once
// NOTE consider "mousedown"
// NOTE consider moving this functionality into function createButton()
window.addEventListener('mousemove',function(){
  let selection = document.getSelection();
  let btn = document.getElementById(namespace);
  if (btn && !selection.toString().length) {
    btn.remove();
  }
});

function createButton(x, y) {
  // create element
  let btn = document.createElement(namespace);
  // set content
  btn.id = namespace;
  // btn.textContent = '📎'; // 🖇️ 💾
  // set position
  btn.style.all = 'unset';
  btn.style.position = 'absolute';
  btn.style.left = x + 5 + 'px';
  btn.style.top = y + 'px';
  // set appearance
  btn.style.direction = 'ltr';
  btn.style.fontFamily = 'system-ui'; // cursive sans-serif emoji
  btn.style.background = 'black'; // cornflowerblue, grey, rosybrown
  btn.style.border = 'thin solid white';
  //btn.style.borderWidth = 'thin';
  //btn.style.border = 'solid'; // ridge
  //btn.style.borderColor = 'darkred';
  btn.style.borderRadius = '3px';
  btn.style.padding = '1%';
  //btn.style.marginTop = '100px';
  //btn.style.marginLeft = '10px';
  btn.style.minWidth = '30px';
  btn.style.minHeight = '30px';
  //btn.style.width = '10px';
  //btn.style.height = '10px';
  //btn.style.fontSize = '20px';
  btn.style.zIndex = 10000;
  btn.style.opacity = 0.7;
  // center character
  btn.style.justifyContent = 'center';
  btn.style.alignItems = 'center';
  btn.style.display = 'flex';
  // disable selection marks
  btn.style.outline = 'white'; // none
  btn.style.userSelect = 'none';
  btn.style.cursor = 'default';
  btn.onmouseleave = () => {btn.style.opacity = 0.27;};
  btn.onmouseover = () => {btn.style.opacity = 1;};
  return btn;
}

function actionButton(type) {
  let content = getSelectedText().outerText; // textContent
  content = content.replace(/%0D%0A%0D%0A/g, " ");
  content = removeMultipleWhiteSpace(content);
  let item = document.createElement('span');
  item.id = `${namespace}-${type}`;
  //item.style.borderRadius = '50%';
  item.style.outline = 'none';
  item.style.padding = '3px';
  item.style.margin = '3px';
  //item.style.fontSize = '10px';
  item.style.fontWeight = 'bold';
  item.style.color = 'white';
  item.onmouseleave = () => {resetStyle();};
  switch (type) {
    case 'back':
      item.textContent = '<';
      item.onclick = () => {
        item.parentElement.replaceChildren(
          actionButton('close'),
          actionButton('save'),
          actionButton('highlight'),
          actionButton('edit'),
          actionButton('send')
        )
      };
      break;
    case 'close':
      item.textContent = 'x';
      item.title = 'Double-click to close';
      item.ondblclick = () => {item.parentElement.remove();};
      break;
    case 'delete':
      item.textContent = 'Delete';
      item.title = 'Double-click to delete content';
      item.ondblclick = () => {getSelectedText().remove();};
      item.onmouseenter = () => {drawBorder('darkred', 'rgb(255 182 182)', '2px dashed hotpink');};
      break;
    case 'edit':
      item.textContent = 'Edit';
      //item.style.cursor = 'context-menu';
      item.onclick = () => {
        item.parentElement.replaceChildren(
          actionButton('back'),
          actionButton('delete'),
          actionButton('editable')
        )
      };
      break;
    case 'editable':
      item.onmouseenter = () => {drawBorder('darkblue', 'rgb(200 182 255)', '2px solid blue');};
      if (getSelectedText().contentEditable == 'true') {
        item.textContent = 'Stop Editing';
        item.title = 'Turn off edit mode';
      } else {
        item.textContent = 'Start Editing';
        item.title = 'Turn on edit mode';
      }
      item.onclick = () => {
        let texts = toggleEditeMode();
        item.textContent = texts[0];
        item.title = texts[1];
      }
      break;
    case 'email':
      item.textContent = 'Email';
      item.title = 'Send via Email as reference';
      item.onclick = () => {window.location = `mailto:?subject=Content on ${location.hostname}&body=${document.title}%0D%0A%0D%0A${content}%0D%0A%0D%0A${location.hostname}${location.pathname}`};
      break;
    case 'highlight':
      item.textContent = 'Mark';
      item.title = 'Highlight text';
      //item.onclick = () => {highlightSelection('black', 'khaki');};
      item.onclick = () => {drawBorder('black', 'khaki', 'unset');};
      break;
    case 'irc':
      item.textContent = 'IRC';
      item.title = 'Send via IRC as reference';
      item.onclick = () => {alert('This button will be supported in next update')};
      break;
    case 'markdown':
      item.textContent = 'Markdown';
      item.title = 'Save to Markdown';
      item.onclick = () => {generateMD();}; //TODO URL reference to source URL
      break;
    case 'text':
      item.textContent = 'Text';
      item.title = 'Save to Plain Text';
      item.onclick = () => {generateTXT();};
      break;
    case 'xhtml':
      item.textContent = 'HTML';
      item.title = 'Save to HTML (valid XHTML)';
      item.onclick = () => {generateXHTML();};
      break;
    case 'xmpp':
      item.textContent = 'XMPP';
      item.title = 'Send via Jabber as reference';
      item.onclick = () => {window.location = `xmpp:?subject=Content on ${location.hostname}&body=${document.title}%0D%0A%0D%0A${content}%0D%0A%0D%0A${location.hostname}${location.pathname}`};
      break;
    case 'save':
      item.textContent = 'Save';
      //item.style.cursor = 'context-menu';
      item.onmouseenter = () => {drawBorder('black', 'rgb(250 250 210)', '2px double rosybrown');};
      item.onclick = () => {
      item.parentElement.replaceChildren(
        actionButton('back'),
        actionButton('xhtml'),
        actionButton('markdown'),
        actionButton('text')
        )
      };
      break;
    case 'send':
      item.textContent = 'Send';
      //item.style.cursor = 'context-menu';
      item.onclick = () => {
      item.parentElement.replaceChildren(
        actionButton('back'),
        actionButton('email'),
        actionButton('irc'),
        actionButton('xmpp')
        )
      };
      break;
  }
  return item;
}

function toggleEditeMode() {
  let texts;
  if (getSelectedText().contentEditable == 'true') {
    getSelectedText().contentEditable = 'false';
    texts = ['Continue Editing', 'Edit content'];
  }
  else {
    getSelectedText().contentEditable = 'true';
    texts = ['Stop Editing', 'Turn off edit mode'];
  }
  return texts;
}

// FIXME
function highlightSelection(color, background) {
  let sel = document.getSelection();
  originalColor = sel.style.color;
  originalBackground = sel.style.background;
  //sel.style.background = 'rgb(250 250 210)';
  sel.style.background = background;
  //sel.style.color = 'black'; // DarkRed
  sel.style.color = color;
}

function drawBorder(color, background, outline) {
//function drawBorder(color, background, outline, method) {
  let sel = getSelectedText();
  //if (method == 'exactly') {
  //  let sel = getSelectedText();
  //} else {
  //  let sel = document.getSelection();
  //}
  originalColor = sel.style.color;
  originalOutline = sel.style.outline;
  originalBackground = sel.style.background;
  // Draw border around input without affecting style, layout or spacing
  // /questions/29990319/draw-border-around-input-without-affecting-style-layout-or-spacing
  //sel.style.outline = '3px solid';
  //sel.style.background = 'lightgoldenrodyellow';
  //sel.style.outline = '3px dashed';
  //sel.style.background = 'rgba(250,250,210,0.3)';
  //sel.style.outline = '3px double darkblue';
  //sel.style.background = 'rgba(210,250,250,0.8)';
  sel.style.outline = '2px double rosybrown';
  sel.style.outline = outline;
  //sel.style.background = 'rgba(250,250,210,0.7)';
  sel.style.background = 'rgb(250 250 210)';
  sel.style.background = background;
  sel.style.color = 'black'; // DarkRed
  sel.style.color = color;
}

// TODO remove attribute 'style' of first element after 'body'
// FIXME
// http://gothicrichard.synthasite.com/what-i-fond-on-the-net.php
// https://darknetdiaries.com/episode/65/
function resetStyle() {
  let sel = getSelectedText();
  sel.style.color = originalColor;
  sel.style.outline = originalOutline;
  sel.style.background = originalBackground;
}

function generateTXT() {
  let data = getSelectedText().outerText;
  data = `${data}

Created: ${time.toDateString()} ${time.toLocaleTimeString()}
Source:  ${location.href}
Title:   ${document.title}

Document generated using Paper Clip
https://greasyfork.org/en/scripts/465960-paper-clip
Save selected content into clean HTML, Markdown or Text
`;
  savePage(
    data,
    createFilename('txt'),
    "text/plain"
  );
}

function generateMD() {
  let domParser = new DOMParser();
  let data = domParser.parseFromString('', 'text/html'); // Falkon: TrustedHTML
  data.body.innerHTML = getSelectedText().outerHTML;
  console.log(data)
  let elementsToRemove = [
    'button', 'form', 'frame', 'frameset', 'iframe', 'textarea',
    //'svg', 'input', 'path',
    'script', 'style',
    'select'];
  data = removeMediaElements(data, elementsToRemove);
  let turndownService = new TurndownService();
  data = turndownService.turndown(data);

  let title;
  if (document.title) {
    title = document.title;
  } else {
    title = location.pathname.split('/');
    title = title[title.length-1];
    //title = location.pathname.split('/');
    //title = title[title.length-1];
  }

  data = `# [${title}](${location.href})
${getDescription()}
${data}

---

This page was saved at ${time.toDateString()} ${time.toLocaleTimeString()} from [${location.hostname}](${location.href})
using [Paper Clip](https://greasyfork.org/en/scripts/465960-paper-clip) and converted into Markdown with [Turndown](https://mixmark-io.github.io/turndown/)
`;
  console.log(data)
  savePage(
    data,
    createFilename('md'),
    "text/plain"
  );
}

function generateXHTML() {
  let domParser = new DOMParser();
  let data = domParser.parseFromString('', 'text/html'); // Falkon: TrustedHTML
  // set title
  if (document.title.length > 0) {
    data.title = document.title;
  }
  // set base
  // NOTE do not "set base".
  // TODO Complete links of ./ and / etc. by fetching complete
  //      url and replace href with it (it = complete url)
  base = data.createElement('base');
  base.href = data.head.baseURI; // location.href;
  data.head.append(base);
  const metaTag = [
    'url',
    'date',
    'creator',
    'user-agent',
    //'connection-type',
    'content-type-sourced',
    'charset-sourced'
    //'character-count'
    //'word-count'
  ];
  const metaValue = [
    location.href,
    time,
    namespace,
    navigator.userAgent,
    //navigator.connection.effectiveType,
    document.contentType,
    document.charset
  ];
  for (let i = 0; i < metaTag.length; i++) {
    let meta = document.createElement('meta');
    meta.name = metaTag[i];
    meta.content = metaValue[i];
    data.head.append(meta);
  }
  const metaData = [
    //'content-type',
    'viewport',
    'description',
    'keywords',
    'generator'
  ];
  for (let i = 0; i < metaData.length; i++) {
    let meta = document.createElement('meta');
    meta.name = metaData[i] + '-imported';
       try {
         meta.content = document.querySelector('meta[name="' + metaData[i] + '" i]')
           // .querySelector('meta[http-equiv="' + metaData[i] + '" i]')
           .content;
       }
       catch(err) {
         console.warn(metaData[i] + ': Not found.');
         continue;
       }
    data.head.append(meta);
  }
  if (document.dir == 'rtl') {
    data.dir = 'rtl';
  }
  data.body.innerHTML = getSelectedText().outerHTML;
  data = listMediaElements(data);
  let elementsToRemove = [
    'audio', 'embed', 'img', 'video', 'button',
    'form', 'frame', 'frameset', 'iframe', 'textarea',
    'svg', 'input', 'path',
    'script', 'style',
    'select'];
  data = removeMediaElements(data, elementsToRemove);
  data = removeAttributes(data);
  //data = replaceMediaByLinks(data);
  data = correctLinks(data);
  data = removeEmptyElements(data);
  data = removeCommentNodes(data);
  //data = removeWhitespaceFromNodes(data, ['code', 'pre']);
  //data = replaceCodeAndPre(data);
  //data = setStylesheet(data);
  data = new XMLSerializer().serializeToString(data);
  //data = formatPage(data);
  //data = minify(data);
  //data = removeComments(data);
  data = removeMultipleWhiteSpace(data);
  savePage(
    data,
    createFilename('xhtml'),
    "text/html"
  );
}

// FIXME
// body::-webkit-scrollbar{width:10.666666666666666px;height:10.666666666666666px;}
function setStylesheet(node) {
  let cssStylesheet = document.createElement('style');
  document.head.append(cssStylesheet);
  cssStylesheet.type = 'text/css';
  if (node.querySelector('code') ||
      node.querySelector('pre')) {
    cssStylesheet.textContent = 'code, pre {overflow: auto; display: grid; max-width: 100vw;}';
  }
  return node;
}

// TODO Place plain text inside elements <code> <pre> (eliminate <span>, <br> etc.)
// TODO Eliminate all elements without changing original text layout
function replaceCodeAndPre(node) { // correctCodeElements
  const codeElements = node.getElementsByTagName('code');
  const preElements = node.getElementsByTagName('pre');
  // Replace content of all code elements with their own outerText
  for (let i = 0; i < codeElements.length; i++) {
    const element = codeElements[i];
    element.outerText = element.outerText;
  }
  // Replace content of all pre elements with their own outerText
  for (let i = 0; i < preElements.length; i++) {
    const element = preElements[i];
    element.outerText = element.outerText;
  }
  return node;
}

function replaceMediaByLinks(node) {
  for (const imgElement of node.querySelectorAll('img')) {
    // Create a new <a> element
    const aElement = node.createElement('a');
    aElement.setAttribute.href = imgElement.src;
    // Copy the attributes and contents of the <img> element to the new <a> element
    for (let i = 0, l = imgElement.attributes.length; i < l; i++) {
      const name = imgElement.attributes.item(i).name;
      const value = imgElement.attributes.item(i).value;
      aElement.setAttribute(name, value);
    }
    aElement.textContent = imgElement.src;
    // Replace the <img> element with the new <a> element
    imgElement.parentNode.replaceChild(aElement, imgElement);
  }
  return node;
}

// TODO
// Catch all elements with attribute
// contains URL, and
// starts with / (add hostname), and
// contains / (add hostname with first parent path), and
// validate using URL API
function listMediaElements(node) {
  let unique = []
  const elements = [
    'audio', 'embed', 'img', 'svg', 'video',
    'frame', 'frameset', 'iframe', '[data-source]',
  ];
  // Find element and add its URL as metadata
  for (let i = 0; i < elements.length; i++) {
    for (const element of node.querySelectorAll(elements[i])) {
      const attributes = ['src', 'data-img-url', 'data-source'];
      for (const attribute of attributes) {
        if (element.getAttribute(attribute) &&
            !unique.includes(element.getAttribute(attribute))) {
          let attr = element.getAttribute(attribute)
          unique.push(attr)
          let meta = node.createElement('meta');
          meta.name = `extracted-media-${element.nodeName.toLowerCase()}`; // Was ${elements[i]}
          meta.content = attr;
          node.head.append(meta);
        }
      }
    }
  }
  return node;
}

//Remove graphics, media and scripts
function removeMediaElements(node, elements) {
  /*
  TODO Remove span and preserve its contents
  Movespan content to its parent element/node
  /questions/9848465/js-remove-a-tag-without-deleting-content

  FIXME Couldn't remove "iframe" for
  https://www.dailymail.co.uk/health/article-3460321/How-Big-Pharma-greed-killing-tens-thousands-world-Patients-medicated-given-profitable-drugs-little-proven-benefits-leading-doctors-warn.html
  */
  media = ['audio', 'embed', 'frame', 'frameset', 'iframe', 'img', 'video'];
  for (let i = 0; i < elements.length; i++) {
    for (const element of node.querySelectorAll(elements[i])) {
      if (media.includes(elements[i])) {
        let ele = node.createElement('a');
        //ele.textContent = `Click to view removed HTML <${elements[i]}> media element.`.toUpperCase();

        //ele.textContent = `[HIDDEN MEDIA]`;
        //ele.title = `${elements[i]} media element`;
        //ele.href = element.getAttribute('src');

        //let ele = node.createElement('pre')
        //let ele = node.createElement('code')
        //ele.textContent = `${element.getAttribute('src')}`;
        //ele.title = 'Hidden media';
        element.parentNode.insertBefore(ele, element.nextSibling); // insertAfter
      }
      element.remove();
    }
  }
  return node;
}

// Remove all attributes
function removeAttributes(node) {
  // /questions/1870441/remove-all-attributes
  const removeAttributes = (element) => {
    for (let i = 0; i < element.attributes.length; i++) {
      if (element.attributes[i].name != 'href' &&
          element.attributes[i].name != 'name' &&
          element.attributes[i].name != 'id') {
        element.removeAttribute(element.attributes[i].name);
      }
    }
  };
  for (const element of node.querySelectorAll('body *')) {
    removeAttributes(element);
  }
  return node;
}

// Correct links for offline usage
function correctLinks(node) {
  for (const element of node.querySelectorAll('a')) {
    //if (element.hash) {
    //if (element.hostname + element.pathname == location.hostname + location.pathname) {
    if (element.href.startsWith(element.baseURI + '#')) {
      element.href = element.hash;
    }
  }
  return node;
}

function removeEmptyElements (node) {
  for (const element of node.body.querySelectorAll('*')) {
    //if (/^\s*$/.test(element.outerText)) {
    if (element.tagName.toLowerCase() != 'br' && /^\s*$/.test(element.textContent)) {
      element.remove();
    }
  }
  return node;
}

function removeCommentNodes(node) {
  const nodeIterator = node.createNodeIterator(
    node,  // Starting node, usually the document body
    NodeFilter.SHOW_ALL,  // NodeFilter to show all node types
    null,  
    false  
  );
  let currentNode;
  // Loop through each node in the node iterator
  while (currentNode = nodeIterator.nextNode()) {
    if (currentNode.nodeName == '#comment') {
      currentNode.remove();
      console.log(currentNode.nodeName);
    }
  }
  return node;
}

function removeComments(str) {
  return str.replace(/<!--[\s\S]*?-->/g, '');
}

function removeWhitespaceFromNodes(node, excludedTags) {
  const removeWhitespace = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent.trim();
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !excludedTags.includes(node.tagName.toLowerCase())
    ) {
      for (let i = 0; i < node.childNodes.length; i++) {
        removeWhitespace(node.childNodes[i]);
      }
    }
  };
  removeWhitespace(node);
  return node;
}

function removeMultipleWhiteSpace(str) {
  //return str.replace(/\s+/g, ' ');
  //return str.replace(/(?<!<code>)\s+(?![^<]*<\/code>)/g, " ");
  /*
  return str.replace(/(<(code|pre|code-[^\s]+)[^>]*>.*?<\/\2>)|(\s+)/gs, function(match, p1, p2, p3) {
  if (p1) { // if the match is a code block
    return p1; // return the complete code block as is
  } else { // if the match is whitespace outside of a code block
    return " "; // replace with a single space
  }
  });
  */
  return str.replace(/(<(code|pre)[^>]*>.*?<\/\2>)|(\s+)/gs, function(match, p1, p2, p3) {
    if (p1) { // if the match is a code block
      return p1; // return the complete code block as is
    } else { // if the match is whitespace outside of a code block
      return " "; // replace with a single space
    }
  });
}

// Get parent element of beginning (and end) of selected text
// /questions/32515175/get-parent-element-of-beginning-and-end-of-selected-text
function getSelectedText() {
  var selection = document.getSelection();
  var selectionBegin = selection.anchorNode.parentNode;
  var selectionEnd = selection.focusNode.parentNode;
  var selectionCommon =
    findFirstCommonAncestor
    (
      selectionBegin,
      selectionEnd
    );
  return selectionCommon;
}

// find common parent
// /questions/2453742/whats-the-best-way-to-find-the-first-common-parent-of-two-dom-nodes-in-javascri
function findFirstCommonAncestor(nodeA, nodeB) {
  let range = new Range();
  range.setStart(nodeA, 0);
  range.setEnd(nodeB, 0);
  // There's a compilication, if nodeA is positioned after
  // nodeB in the document, we created a collapsed range.
  // That means the start and end of the range are at the
  // same position. In that case `range.commonAncestorContainer`
  // would likely just be `nodeB.parentNode`.
  if(range.collapsed) {
    // The old switcheroo does the trick.
    range.setStart(nodeB, 0);
    range.setEnd(nodeA, 0);
  }
  return range.commonAncestorContainer;
}

// minify html
// /questions/23284784/javascript-minify-html-regex
// TODO Don't apply on code/pre
function minify( s ){
  return s ? s
    .replace(/\>[\r\n ]+\</g, "><")  // Removes new lines and irrelevant spaces which might affect layout, and are better gone
    .replace(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : ' ')
    .trim()
    : "";
}

// format html
// /questions/3913355/how-to-format-tidy-beautify-in-javascript
// TODO Don't inset span in code/pre
function formatPage(html) {
  var tab = '\t';
  var result = '';
  var indent= '';
  html.split(/>\s*</).forEach(function(element) {
    if (element.match( /^\/\w/ )) {
        indent = indent.substring(tab.length);
    }
    result += indent + '<' + element + '>\r\n';
    if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) { 
      indent += tab;              
    }
  });
  return result.substring(1, result.length-3);
}

function getDescription() {
  let desc;
  if (document.querySelector('meta[name=description]')) {
    desc = '## ' + document.querySelector('meta[name=description]').content + '\n';
  } else
  if (document.querySelector('meta[itemprop=description]')) {
    desc = '## ' + document.querySelector('meta[itemprop=description]').content + '\n';
  } else {
    desc = '';
  }
  return desc;
}

function createFilename(extension) {

  let day, now, timestamp, title, filename;

  day = time
    .toISOString()
    .split('T')[0];

  now = [
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  ];

  for (let i = 0; i < now.length; i++) { 
    if (now[i] < 10) {now[i] = '0' + now[i];}
  }

  timestamp = [
    day,
    now.join('-')
  ];

/*
  address = [
    location.hostname,
    location.pathname.replace(/\//g,'_')
  ]

  filename =
    address.join('') +
    '_' +
    timestamp.join('_') +
    '.html';
*/

  if (document.title) {
    title = document.title;
  } else {
    title = location.pathname.split('/');
    title = title[title.length-1];
  }

  // TODO ‘ ’ ·
  title = title.replace(/[\/?<>\\:*|'"\.,]/g, '');
  title = title.replace(/ /g, '_');
  title = title.replace(/-/g, '_');
  title = title.replace(/__/g, '_');

  filename =
    title + // TODO replace whitespace by underscore
    '_' +
    timestamp.join('_') +
    `.${extension}`;

  return filename.toLowerCase();

}

// export file
// /questions/4545311/download-a-file-by-jquery-ajax
// /questions/43135852/javascript-export-to-text-file
var savePage = (function () {
  var a = document.createElement("a");
  // document.body.appendChild(a);
  // a.style = "display: none";
  return function (fileData, fileName, fileType) {
    var blob = new Blob([fileData], {type: fileType}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());
