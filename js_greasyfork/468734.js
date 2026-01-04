// ==UserScript==
// @name     kbin enhancement script
// @description Few small changes to the kbin UI while they still develop some features. Based on https://greasyfork.org/en/scripts/468612-kbin-enhancement-script/code
// @namespace social.kbin.Deref
// @license MIT
// @version  1.9
// @grant    none
// @run-at document-end
// @match  https://fedia.io/*
// @match  https://kbin.social/*
// @downloadURL https://update.greasyfork.org/scripts/468734/kbin%20enhancement%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/468734/kbin%20enhancement%20script.meta.js
// ==/UserScript==


(function(){
  const version = "1.9";

  const style = document.createElement('style');
  style.textContent = `
    .entry figure {overflow: hidden}
    .comment .badge {padding:.25rem;margin-left:5px}
    #kes-version-dialog {position: fixed; width: 100vw; height: 100vh; top: 0; left: 0; display: flex; align-items: center; justify-content: center; background-color: rgba(0,0,0,.3); z-index: 9999999}
    .kes-version-dialog-content {background: #ddd; color: #444; position: relative; padding: 40px}
		.kes-expand {grid-gap: 0; padding-left:55px}
    .kes-blur {filter: blur(4px); transition-duration: 0.5s}
		.kes-blur-large {filter: blur(15px)}
    .kes-blur:hover {filter: none}
  `;
  document.head.appendChild(style);


  const allSettings = [
    {name: "Show domains", value:"show-domains"},
    {name: "Show collapse comment", value:"show-collapse"},
    {name: "Show collapse replies", value:"show-collapse-replies"},
    {name: "Replies start collapsed", value:"start-collapse-replies", default: "false"},
    {name: "Move comment box to top", value:"comment-box-top"},
    {name: "Reply box improvements", value:"comment-cancel"},
    {name: "Hide known NSFW domains", value:"nsfw-hide"},
    {name: "Blur known NSFW domains", value:"nsfw-blur"},
    {name: "Hide random sidebar posts", value:"hide-random"},
    {name: "Add OP tag", value:"op-tag"}
  ];

  allSettings.forEach(setting => {
    if (setting.default === "false" && localStorage.getItem("setting-" + setting.value) === null) {
      localStorage.setItem("setting-" + setting.value, "false");
    }
  });

  function getSetting(setting) {
    let value = localStorage.getItem("setting-" + setting);
    if (value === null)
      value = "true";
    return value === "true";
  }
  function setSetting(setting, value) {
    localStorage.setItem("setting-" + setting, value);
    location.reload();
  }


  function addDomain(link) {
    const parts = link.title.split("@");
    if (parts[2] !== location.hostname && !link.innerText.includes("@" + parts[2])) {
      const textNode = document.createTextNode("@" + parts[2]);
      const newSpan = document.createElement("span");
      newSpan.appendChild(textNode);
      newSpan.style.fontWeight = "normal";

      link.appendChild(newSpan);
    }
  }
  function addDomains() {
    document.querySelectorAll(".magazine-inline, .user-inline").forEach(link => {
      addDomain(link);
    });


    const config = { childList: true };
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        mutation.addedNodes.forEach(container => {
        	container.querySelectorAll(".magazine-inline, .user-inline").forEach(link => {
            addDomain(link);
          });
        });
      }
    };

    const observer = new MutationObserver(callback);
    const content = document.querySelector("div#content > div");
    if (content)
    	observer.observe(content, config);
  }


  function getComments(comment, allComments) {
    const id = comment.id.split('-')[2];

    allComments.push(comment);
    const subComments = comment.parentElement.querySelectorAll('blockquote[data-subject-parent-value="'+id+'"]');
    subComments.forEach(blockquote => { getComments(blockquote, allComments); });
  }
  function getCollapsos(comment, allCollapsos) {
    const id = comment.id.split('-')[2];

    if (comment.classList.contains('kes-expand'))
    	allCollapsos.push(comment);

    const subComments = comment.parentElement.querySelectorAll('blockquote[data-subject-parent-value="'+id+'"]');
    subComments.forEach(blockquote => { getCollapsos(blockquote, allCollapsos); });
  }
  function removeAllCollapsos(blockquote) {
    // Just remove all these for now, don't want to figure out how to do this cleanly right now.
    const allCollapsos = [];
    getCollapsos(blockquote, allCollapsos);
    allCollapsos.forEach(comment => { comment.remove() });
  }
  function expandComment(blockquote) {
    const allComments = [];
    getComments(blockquote, allComments);
    allComments.forEach(comment => { comment.style.display="" });

    removeAllCollapsos(blockquote);
  }
  function collapseComment(blockquote) {
    const id = blockquote.id.split('-')[2];
    let commentLevel = "1";
    blockquote.classList.forEach(classItem => {
    	if (classItem.includes("comment-level"))
        commentLevel = classItem.split("--")[1];
    });

    const allComments = [];
    getComments(blockquote, allComments);
    allComments.forEach(comment => { comment.style.display="none" });

    const username = blockquote.querySelector("header a").innerText;
    const time = blockquote.querySelector("header time").innerText;

    const newBlockquote = document.createElement('blockquote');
    newBlockquote.className = 'kes-expand section comment entry-comment comment-level--' + commentLevel;
    newBlockquote.dataset.subjectParentValue = id;
    newBlockquote.innerHTML = '<header><a href="javascript:;">' + username + ', ' + time + ' [+]</a></header>';
    newBlockquote.querySelector('a').addEventListener("click", () => {expandComment(blockquote)});
    blockquote.parentNode.insertBefore(newBlockquote, blockquote);
  }
  function getTotalReplyCount(blockquote) {
    const allComments = [];
    getComments(blockquote, allComments);
    return allComments.length - 1;
  }

  function addCollapseLinks() {
    if (location.pathname.startsWith('/m')) {
      const comments = document.querySelectorAll("blockquote.comment");
      comments.forEach(blockquote => {
      	const menu = blockquote.querySelector("header");
        if (!menu.innerText.includes('[-]')) {
          const newA = document.createElement('a');
          newA.href = "javascript:;";
          newA.className = "kes-collapse";
          newA.innerHTML = '[-]';
          menu.appendChild(newA);
        }
      });

      document.querySelectorAll(".kes-collapse").forEach(link => {link.addEventListener("click", () => {
        const blockquote = link.closest("blockquote.comment");
        collapseComment(blockquote);
      })});
    }
  }

  function getAllReplies(blockquote) {
    const allComments = [];
    getComments(blockquote, allComments);
    allComments.splice(allComments.indexOf(blockquote), 1);
    return allComments;
  }


  function toggleReplies(blockquote, display) {
    const id = blockquote.id.split('-')[2];
    const allReplies = getAllReplies(blockquote);

    let anyHidden = false;
    allReplies.forEach(reply => {
      if (reply.style.display == 'none')
        anyHidden = true;
    });

    allReplies.forEach(comment => { comment.style.display = anyHidden ? '' : 'none' });

    removeAllCollapsos(blockquote);
  }

  function addCollapseRepliesLinks() {
    if (location.pathname.startsWith('/m')) {
      const comments = document.querySelectorAll("blockquote.comment-level--1");
      comments.forEach(blockquote => {
        const id = blockquote.id.split('-')[2];
        const subComments = blockquote.parentElement.querySelectorAll('blockquote[data-subject-parent-value="'+id+'"]');

        if (subComments.length > 0) {
          const menu = blockquote.querySelector("footer menu");
          const newLi = document.createElement('li');
          newLi.innerHTML = '<a href="javascript:;" class="kes-collapse-replies">toggle replies ('+getTotalReplyCount(blockquote)+')</a>';
          menu.appendChild(newLi);
        }
      });

      document.querySelectorAll(".kes-collapse-replies").forEach(link => {link.addEventListener("click", () => {
        const blockquote = link.closest("blockquote.comment");

        toggleReplies(blockquote);
      })});
    }
  }
  function collapseAllReplies() {
    const comments = document.querySelectorAll("blockquote.comment-level--2");
    comments.forEach(blockquote => {
      collapseComment(blockquote);
    });
  }


  function moveCommentBox() {
    const commentAdd = document.querySelector('#comment-add');
    if (commentAdd)
    	commentAdd.parentNode.insertBefore(commentAdd, document.querySelector('#comments'));
  }


  function removeReplyBox(container) {
    container.innerHTML = '';
    container.style = '';
  }
  function addCommentCancelButton(container) {
    const list = container.querySelector('div.actions ul');

    const newLi = document.createElement('li');
    newLi.innerHTML = '<div><button class="btn btn__primary">Cancel</button></div>';
    list.appendChild(newLi);
    newLi.querySelector('button').addEventListener("click", () => { removeReplyBox(container) });
  }
  function fixMarkdownButtons(form) {
    const formActionSplit = form.action.split('/');
    const newId = 'entry_comment_body_' + formActionSplit[formActionSplit.length-1];

    form.querySelector('#entry_comment_body').id = newId;
    form.querySelector('markdown-toolbar').setAttribute('for', newId);
  }
  function observeReplyAdded() {
    const config = { childList: true };
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        const container = mutation.target;
        const form = container.querySelector('form.comment-add');

        if (form !== null) {
          fixMarkdownButtons(form);
          addCommentCancelButton(container);
        }
      }
    };

    const observer = new MutationObserver(callback);
    document.querySelectorAll('blockquote.comment footer div.js-container').forEach(container => { observer.observe(container, config) })
  }


  // Thanks u/le__el
  function addBlur(container) {
    container.querySelectorAll("img").forEach(el => {
        el.classList.add('kes-blur');
    });
    container.querySelectorAll("figure img").forEach(el => {
        el.classList.add('kes-blur-large');
    });
  }
  const nsfwDomains = [
    "lemmynsfw.com",
    "redgifs.com"
  ];
  function hideNSFW() {
    document.querySelectorAll("article").forEach(article => {
      const magazineInline = article.querySelector(".magazine-inline");
      if (article.querySelector("small.danger") !== null
         || nsfwDomains.includes(article.querySelector(".entry__domain a").innerText)
         || ( magazineInline && nsfwDomains.includes(magazineInline.title.split('@')[2]) )
         ) {
        if (getSetting("nsfw-hide")) {
      		article.remove();
        } else {
          addBlur(article);
        }
      }
    });
  }

  function hideRandom() {
    const posts = document.querySelector('#sidebar section.posts');
    if (posts)
      posts.style = "display:none;";

    const entries = document.querySelector('#sidebar section.entries');
    if (entries)
      entries.style = "display:none;";
  }

  function addOPTag() {
    document.querySelectorAll('blockquote.author > header').forEach(header => {
    	const opTag = document.createElement('small');
      opTag.className = "badge kbin-bg";
      opTag.innerText = "OP";
      header.appendChild(opTag);
    });
  }


  function generateSettingDiv(settingDisplay, setting) {
    const settingValue = getSetting(setting);
    const newDiv = document.createElement('div');
    newDiv.className = "row";
    newDiv.innerHTML = `<span>${settingDisplay}:</span>
      <div>
        <a class="kes-setting-yes link-muted ${settingValue ? 'active' : ''}" href="javascript:;" data-setting="${setting}">
          Yes
        </a>
        |
        <a class="kes-setting-no link-muted ${settingValue ? '' : 'active'}" href="javascript:;" data-setting="${setting}">
          No
        </a>
      </div>`;

    return newDiv;
  }
  function addHTMLSettings() {
    const settingsList = document.querySelector(".settings-list");

    const header = document.createElement('strong');
    header.textContent = "kbin enhancement script";
    settingsList.appendChild(header);

    allSettings.forEach(setting => { settingsList.appendChild(generateSettingDiv(setting.name, setting.value)) });

    document.querySelectorAll(".kes-setting-yes").forEach(link => { link.addEventListener("click", () => {setSetting(link.dataset.setting, true) })});
    document.querySelectorAll(".kes-setting-no").forEach(link => { link.addEventListener("click", () => {setSetting(link.dataset.setting, false) })});
  }

  addHTMLSettings();
  if (getSetting("show-domains"))
    addDomains();
  if (getSetting("show-collapse"))
    addCollapseLinks();
  if (getSetting("show-collapse-replies"))
    addCollapseRepliesLinks();
  if (getSetting("start-collapse-replies"))
    collapseAllReplies();
  if (getSetting("comment-box-top"))
    moveCommentBox();
  if (getSetting("comment-cancel"))
    observeReplyAdded();
  if (getSetting("nsfw-blur") || getSetting("nsfw-hide"))
    hideNSFW();
  if (getSetting("hide-random"))
    hideRandom();
  if (getSetting("op-tag"))
    addOPTag();




  if (localStorage.getItem("setting-changelog-version") != version) {
    const message = `<strong>kbin enhancement script version: ${version}</strong><br>
			Thanks for downloading! You can always toggle on and off features in the kbin sidebar settings.<br>Recent changes:
			<ul>
        <li>OP tag in comments</li>
        <li>Hide random sidebar</li>
				<li>Fixed infinite scroll not showing domains</li>
        <li>Additional NSFW protection</li>
				<li>Fixed markdown buttons and added "Cancel" when replying</li>
        <li>Bug Fixes</li>
			</ul>
		`


    const versionDiv = document.createElement('div');
    versionDiv.id = 'kes-version-dialog';
    versionDiv.innerHTML = '<div class="kes-version-dialog-content">'+message+'<br><button>Close</button></div>';
    document.body.appendChild(versionDiv);

    document.querySelector('#kes-version-dialog button').addEventListener("click", () => {
      document.querySelector('#kes-version-dialog').remove();
      localStorage.setItem("setting-changelog-version", version);
    });
  }
})();