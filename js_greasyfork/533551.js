// ==UserScript==
// @name        8chan.moe Penis Grabber
// @namespace   gock
// @match       https://8chan.moe/*
// @match       https://8chan.se/*
// @grant       none
// @version     0.01
// @author      gock
// @license     MIT
// @description love from /vyt/ <3
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533551/8chanmoe%20Penis%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/533551/8chanmoe%20Penis%20Grabber.meta.js
// ==/UserScript==



//copied and modified from thread.js to close qr after posting (closes on error too?)
function closeQrAfterPosting()
{
  window.addEventListener("load", () => {
    //clobbers
    thread.replyCallback.stop = function() {

      thread.replyButton.value = thread.originalButtonText;

      qr.setQRReplyText(thread.originalButtonText);

      thread.replyButton.disabled = false;
      qr.setQRReplyEnabled(true);
      qr.removeQr();
    };
  });
}


//move qr button to above everything else so you just need to press tab once
function moveReplyButton()
{
  document.addEventListener("DOMContentLoaded", () => {
    const qrButton = document.getElementById("quick-reply").childNodes[2].childNodes[13];
    const target = document.getElementById("qrFilesBody");
    const parent = document.getElementById("quick-reply").childNodes[2];
    parent.insertBefore(qrButton, target);
  });
}

//move qr button to above everything else so you just need to press tab once
function moveThreadInfo()
{
  document.addEventListener("DOMContentLoaded", () => {
    const threadInfo = document.getElementById("postCount").parentNode;
    const target = document.getElementById("navOptionsSpan");
    const parent = document.getElementById("dynamicHeaderThread");
    parent.insertBefore(threadInfo, target);

    document.getElementById("fileCount").setAttribute("title", "files");
    document.getElementById("idCount").setAttribute("title", "IDs");
    document.getElementById("postCount").setAttribute("title", "Posts");

    var style = document.createElement("style");
    style.textContent = `
    .threadInfo {
      color: var(--text-color);
      user-select: none;
    }
    .threadInfo::before {
      content: "[";
      color: var(--navbar-text-color);
      padding-right: 5px;
    }
    .threadInfo::after {
      content: "]";
      color: var(--navbar-text-color);
      padding-left: 5px;
      padding-right: 3px;
    }

    .threadInfo #postCount::before {
      content: "" ;
    }
    .threadInfo #idCount::before {
      content: "/" ;
      color: var(--navbar-text-color);
      padding-left: 5px;
      padding-right: 5px;
    }
    .threadInfo #fileCount::before {
      content: "/" ;
      color: var(--navbar-text-color);
      padding-left: 5px;
      padding-right: 5px;
    }
    `;

    document.head.appendChild(style);
  });
}

//counterpart to posting.markPostAsYou()
function unmarkPostAsYou(id, obj)
{
  var post = obj || document.getElementById(+id);
  if (!post) return;

  var author = post.querySelector(".linkName");
  if (!author) return;

  author.classList.remove("youName");
}

//counterpart to api.addYou()
function removeYou(boardUri, postId) //(string, int)
{
  var yous = JSON.parse(localStorage[boardUri + "-yous"] || "[]");
  var index = yous.indexOf(postId);
  var indexPosting = posting.yous.indexOf(postId);
  if (index === -1 || indexPosting === -1) {
    console.log("tried to remove nonexistant (you)");
    return;
  }
  yous.splice(index, 1);
  posting.yous.splice(indexPosting, 1); //in place
  localStorage.setItem(boardUri + "-yous", JSON.stringify(yous));
}


//fixes clicking on IDs to highlight them
//also adds nicknames
function fixClickOnId()
{
  new MutationObserver((_, observer) => {
    const scriptTag = document.querySelector("script[src*='multiboardMenu.js']");
    if (scriptTag) {
      observer.disconnect();

      //copypaste and modified
      posting.processIdLabel = function(label) {
        if (label === undefined)
          return;

        var id = label.innerText;
        var array = posting.idsRelation[id] || [];
        var cell = label.parentNode.parentNode.parentNode;

        //add nickname   probably best to untie this from this method

        //end nickname

        if (cell.parentNode.className === 'inlineQuote'
            || cell.parentNode.className === 'quoteTooltip') {
        } else {
          posting.idsRelation[id] = array;
          //bad performance ?
          if (array.indexOf(cell) === -1) {
            array.push(cell);
          }
        }

        label.onmouseover = function() {
          label.innerText = id + ' (' + array.length + ')';
        }

        label.onmouseout = function() {
          label.innerText = id;
        }

        label.onclick = function() {
          var index = posting.highLightedIds.indexOf(id);
          //window.location.hash = '_'; // whats the point?

          if (index > -1) {
            posting.highLightedIds.splice(index, 1);
          } else {
            posting.highLightedIds.push(id);
          }

          for (var i = 0; i < array.length; i++) {
            var cellToChange = array[i];

            if (cellToChange.className === 'innerOP') {
              continue;
            }

            if (index > -1) { /*? 'innerPost' : 'markedPost';*/
              cellToChange.classList.remove("markedPost");
            }

            if (index === -1) { /*? 'innerPost' : 'markedPost';*/
              cellToChange.classList.add("markedPost");
            }
          }

        };

      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          document.querySelectorAll(".linkSelf").forEach(e => posting.parseExistingPost(e, true, false, true, true));
        });
      } else {
        document.querySelectorAll(".linkSelf").forEach(e => posting.parseExistingPost(e, true, false, true, true));

      }
    }
  }).observe(document.documentElement, {childList: true, subtree:true });
}


function addWatcherShortcut()
{
  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "w") {
        //copypasted from watcher.processOP
          var op = document.querySelector(".opHead.title");
          var checkBox = op.getElementsByClassName('deletionCheckBox')[0];

          var nameParts = checkBox.name.split('-');

          var board = nameParts[0];
          var thread = nameParts[1];

          var storedWatchedData = watcher.getStoredWatchedData();

          var boardThreads = storedWatchedData[board] || {};

          if (boardThreads[thread]) {
            return;
          }

          var subject = op.getElementsByClassName('labelSubject');
          var message = op.getElementsByClassName('divMessage')[0];

          var label = (subject.length ? subject[0].innerText : null)
              || message.innerHTML.replace(/(<([^>]+)>)/ig, "").substr(0, 16).trim();

          if (!label.length) {
            label = null;
          } else {
            label = label.replace(/[<>"']/g, function(match) {
              return api.htmlReplaceTable[match]
            });
          }

          boardThreads[thread] = {
            lastSeen : new Date().getTime(),
            lastReplied : new Date().getTime(),
            label : label
          };

          storedWatchedData[board] = boardThreads;

          localStorage.watchedData = JSON.stringify(storedWatchedData);

          watcher.addWatchedCell(board, thread, boardThreads[thread]);
      }
    });
  });

}


function keepWatcherOpen()
{
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("watchedMenu").style.display = "flex";
  });
}


function toggleYou(post)
{
  if (posting.yous.indexOf(parseInt(post.postInfo.post)) === -1) {
    //not you
    api.addYou(post.postInfo.board, parseInt(post.postInfo.post));
    posting.markPostAsYou(post.postInfo.post, document.getElementById(post.postInfo.post));
  } else {
    //you
    removeYou(post.postInfo.board, parseInt(post.postInfo.post));
    unmarkPostAsYou(post.postInfo.post, document.getElementById(post.postInfo.post));
  }

  reloadPosts(true, true, false, false, false, true);
}


function showNickname(cell)
{
  var id = cell.querySelector(".title").querySelector(".spanId").querySelector(".labelId").innerText;
  //cell is innerPost


  let board = cell.parentNode.getAttribute("data-boarduri");
  //this is requiered as inlinequotes dont have a parent with data-boarduri
  //recursively searching until you reach an element with data-boarduri doesn't
  //work either because it isn't placed in the document when this is called
  //also hover quote things are placed at the very bottom as a child of body
  if (board === null) {
    board = window.location.pathname.split("/")[1];
  }


  var title = cell.querySelector(".title");
  let nicknames= JSON.parse(localStorage.PG_nicknames || null);
  if (nicknames !== null) {
    if (nicknames[board] !== undefined) {
      if (nicknames[board][id] !== undefined) {
        let nickname = nicknames[board][id];
        let currentNickElement = title.querySelector(".nickname");

        if (currentNickElement == undefined) {
          var nickElement = document.createElement("span");
          nickElement.className = "nickname";
          nickElement.innerHTML = nickname + " ";

          title.insertBefore(nickElement, title.querySelector(".labelCreated"));
        } else if (currentNickElement.innerHTML !== nickname + " ") {
          currentNickElement.innerHTML = nickname + " ";
        }
      }
    }
  }
}


function addNickname(post)
{

  var board = post.postInfo.board.toString();
  var id = post.postInfo.id.toString();
  var name = prompt("Enter Nickname").toString();
  //if cancelled
  if (name === null) {
    return;
  }

  var nicknames = JSON.parse(localStorage.PG_nicknames || "{}");

  if (nicknames[board] === undefined) {
    nicknames[board] = {};
  }

  nicknames[board][id] = name;
  localStorage.setItem("PG_nicknames", JSON.stringify(nicknames));

  //only Nicknames
  reloadPosts(true, true, true, false, true);
}

//modified to spaghetti mode + number signs after quotelinks
function overwriteParseExistingPost()
{
  new MutationObserver((_, observer) => {
    const scriptTag = document.querySelector("script[src*='multiboardMenu.js']");
    if (scriptTag) {
      observer.disconnect();

      posting.parseExistingPost = function(linkSelf, noExtras, noModify, noTooltips, onlyIds, onlyNicknames, onlyTooltips, onlyPG_hideButton) {
        if (posting.postCellTemplate.template.contains(linkSelf)) {
          return;
        }
        var innerPost = linkSelf.parentNode.parentNode;
        var postInfo = api.parsePostLink(linkSelf.href);
        posting.getExtraInfo(innerPost, postInfo);

        var ret = {};
        ret.postInfo = postInfo;
        ret.linkSelf = linkSelf;
        ret.innerPost = innerPost;
        ret.files = innerPost.getElementsByClassName('panelUploads')[0];
        ret.message = innerPost.getElementsByClassName("divMessage")[0];

        //used to apply the ID fix to posts already loaded at the start
        //new posts have it already applied
        if (onlyIds) {
          posting.processIdLabel(ret.innerPost.getElementsByClassName("labelId")[0]);
          return;
        }

        if (onlyNicknames) {
          showNickname(ret.innerPost);
          return;
        }

        if (onlyTooltips) {
          posting.addExternalExtras(ret, noTooltips, onlyTooltips);
          return;
        }

        //this "onlyxyz" shit is stupid. replace with enums or something

        //new
        if (PG_settings.addHideButton)
          addPG_hideButton(ret.innerPost);
        //end new

        showNickname(ret.innerPost);

        //quotelink # link thing
        //ret.innerPost.querySelectorAll(".quoteLink, .panelBacklinks>a").forEach((e) => {
        ret.innerPost.querySelectorAll(".quoteLink").forEach((e) => {
          let linkTarget = e.getAttribute("href");
          let noSign = document.createElement("a");
          noSign.setAttribute("href", linkTarget);
          noSign.setAttribute("class", "numberSign");
          noSign.innerText = "#";
          let spacer = document.createTextNode(" ");
          e.after(spacer);
          spacer.after(noSign);

        });

        if (noModify)
          return;

        //cache a clone of the node with alt before it gets additional backlinks
        if (typeof tooltips !== "undefined" && !noTooltips) {
          tooltips.addToKnownPostsForBackLinks(innerPost);
          tooltips.postCache[linkSelf.href] = innerPost.cloneNode(true);
        }

        //update with local times
        var labelCreated = innerPost.getElementsByClassName('labelCreated')[0];
        if (posting.localTime) {
          posting.setLocalTime(labelCreated);
        }

        if (posting.relativeTime) {
          posting.addRelativeTime(labelCreated);
        }

        //thumbnail hovering/hiding
        if (typeof thumbs !== "undefined") {
          Array.from(innerPost.getElementsByClassName('uploadCell'))
            .forEach((cell) => thumbs.processUploadCell(cell));
        }

        if (typeof embed !== "undefined") {
          Array.from(ret.message.getElementsByTagName("a"))
            .forEach((embedLink) => embed.processLinkForEmbed(embedLink));
        }

        if (typeof hiding !== "undefined") {
          hiding.hideIfHidden(ret, hiding.checkFilterHiding(linkSelf));
        }

        if (!noExtras)
          posting.addExternalExtras(ret, noTooltips, onlyTooltips);



        return ret;
      };
    }
  }).observe(document.documentElement, {childList: true, subtree:true });
}


function addPG_hideButton(innerPost)
{
  if (innerPost.parentNode.classList.contains("inlineQuote"))
    return;

  postInfo = innerPost.getElementsByClassName("postInfo")[0];
  if (postInfo === undefined) {
    return; //OP
  }

  let linkSelf = postInfo.getElementsByClassName("linkSelf")[0];

  var PG_hideButton = document.createElement("span");
  PG_hideButton.innerText = "[−]"; //minus sign
  PG_hideButton.classList.add("glowOnHover");
  PG_hideButton.addEventListener("click", function () {
    hiding.hidePost(linkSelf);
  });

  //try to position the [-] after the checkbox but before everything else
  //breaks on new posts because of the fucked up overwriteParseExistingPost()
  //the hide button (no smoking sign) is created after this function is called
  //postInfo.insertBefore(PG_hideButton, postInfo.getElementsByClassName("hideButton")[0]);
  //if (postInfo.getElementsByClassName("deletionCheckBox")[0] === undefined) {
    //no deletioncheckbox > inline
  //  postInfo.insertBefore(PG_hideButton, postInfo.getElementsByClassName("hideButton")[0]);
  //} else {
  //  //yes deletioncheckbox > not inline
  //  postInfo.getElementsByClassName("deletionCheckBox")[0].after(PG_hideButton);
  //}
  // I give up. I hate the checkbox anyway
  postInfo.prepend(PG_hideButton);
}

//modified to spaghetti mode + remove you class after you unmark as you
function overwriteAddExternalExtras()
{
  new MutationObserver((_, observer) => {
    const scriptTag = document.querySelector("script[src*='multiboardMenu.js']");
    if (scriptTag) {
      observer.disconnect();
      posting.addExternalExtras = function(ret, noTooltips, onlyTooltips) {
        var innerPost = ret.innerPost;
        var linkSelf = ret.linkSelf;
        var postInfo = ret.postInfo;

        if (!onlyTooltips) {

        posting.processIdLabel(innerPost.getElementsByClassName("labelId")[0]);

        //(You)s
        if (posting.yous && posting.yous.indexOf(+postInfo.post) !== -1) {
          posting.markPostAsYou(postInfo.post, innerPost);
        }

        //load posting menu, hiding menu, and watcher
        //TODO: coalesce files?
        if (typeof postingMenu !== "undefined") {
          interfaceUtils.addMenuDropdown(ret, "Post Menu",
            "extraMenuButton", postingMenu.buildMenu);
        }

        if (typeof hiding !== "undefined") {
          interfaceUtils.addMenuDropdown(ret, "Hide",
            "hideButton", hiding.buildMenu);
        }

        if (typeof watcher !== "undefined") {
          if (postInfo.op)
            watcher.processOP(innerPost);
        }

        if (typeof qr !== "undefined") {
          var linkQuote = innerPost.getElementsByClassName('linkQuote')[0];

          linkQuote.onclick = function() {
            qr.showQr(linkQuote.href.match(/#q(\d+)/)[1]);
          };
        }

        }//endif !onlytooltips

        if (typeof tooltips !== "undefined") {
          Array.from(innerPost.getElementsByClassName('quoteLink'))
            .forEach((quote) => {
              var target = api.parsePostLink(quote.href);
              tooltips.processQuote(quote, false, noTooltips);

              if (!posting.yous) {
                return;
              }

              if (api.boardUri === target.board && posting.yous.indexOf(+target.post) !== -1) {
                quote.classList.add("you");
              } else {
                quote.classList.remove("you");
              }

            });
        }
      };
    }
  }).observe(document.documentElement, {childList: true, subtree:true });
}

//modified for number signs on backlinks
function overwriteAddBackLink()
{
    new MutationObserver((_, observer) => {
      const scriptTag = document.querySelector("script[src*='hiding.js']");
      if (scriptTag) {
        observer.disconnect();

        tooltips.addBackLink = function(quote, quoteTarget, containerPost) {

          var knownBoard = tooltips.knownPosts[quoteTarget.board];

          if (!knownBoard)
            return;

          var knownBackLink = knownBoard[quoteTarget.post];

          if (!knownBackLink)
            return;

          var sourceBoard = containerPost.dataset.boarduri;
          var sourcePost = containerPost.id;

          var sourceId = sourceBoard + '_' + sourcePost;

          if (knownBackLink.added.indexOf(sourceId) > -1) {
            return;
          } else {
            knownBackLink.added.push(sourceId);
          }

          var text = '>>';

          if (sourceBoard != quoteTarget.board) {
            text += '/' + containerPost.dataset.boarduri + '/';
          }

          text += sourcePost;

          var backLink = document.createElement('a');
          backLink.innerText = text;

          backLink.href = '/' + sourceBoard + '/res/' + quoteTarget.thread + '.html#'
              + sourcePost;

          var backLinkNoSign = document.createElement("a");

          backLinkNoSign.setAttribute("href", backLink.href);
          backLinkNoSign.setAttribute("class", "numberSign");
          backLinkNoSign.innerText = "#";
          var spacer = document.createTextNode(" ");

          knownBackLink.container.appendChild(backLink);
          knownBackLink.container.appendChild(spacer.cloneNode(true));
          knownBackLink.container.appendChild(backLinkNoSign);
          knownBackLink.container.appendChild(spacer.cloneNode(true));

          tooltips.processQuote(backLink, true);

          var dupe = backLink.cloneNode(true);
          var dupe2 = backLinkNoSign.cloneNode(true);
          knownBackLink.altContainer.appendChild(dupe);
          knownBackLink.altContainer.appendChild(spacer.cloneNode(true));
          knownBackLink.altContainer.appendChild(dupe2);
          knownBackLink.altContainer.appendChild(spacer.cloneNode(true));

          tooltips.processQuote(dupe, true);

        };
     }
  }).observe(document.documentElement, {childList: true, subtree:true });
}

//fix recursive backlinks + remove X from inlines
function overwriteAddInlineClick()
{
  new MutationObserver((_, observer) => {
    const scriptTag = document.querySelector("script[src*='hiding.js']");
    if (scriptTag) {
      observer.disconnect();

      tooltips.addInlineClick = function(quote, innerPost, isBacklink, quoteTarget, sourceId) {

        quote.addEventListener("click", function(e) {
            if (!tooltips.inlineReplies)
              return;

            e.preventDefault();
            var replyPreview = Array.from(innerPost.children)
              .find((a) => a.className === "replyPreview");
            var divMessage = innerPost.getElementsByClassName("divMessage")[0];

            if (tooltips.loadingPreviews[quoteTarget.quoteUrl] ||
            tooltips.quoteAlreadyAdded(quoteTarget.quoteUrl, innerPost))
              return;

            var placeHolder = document.createElement("div");
            placeHolder.style.whiteSpace = "normal";
            placeHolder.className = "inlineQuote";
            tooltips.loadTooltip(placeHolder, quoteTarget.quoteUrl, true, true);
            placeHolder.append

            if (!placeHolder.getElementsByClassName("linkSelf"))
              return;

            if (!PG_settings["removeXFromInlines"]) {
              var close = document.createElement("A");
              close.innerText = "X";
              close.onclick = function() {
                placeHolder.remove();
              }
              close.style.className = "closeInline";
              placeHolder.getElementsByClassName("postInfo")[0].prepend(close);
            }



            Array.from(placeHolder.getElementsByClassName("quoteLink"))
              .forEach((a) => tooltips.processQuote(a, false, true));

            //for some bizzaro reason they only processQuote()'d the bottom backlinks
            //new
            if (!tooltips.bottomBacklinks) {
              var stla = placeHolder.getElementsByClassName("panelBacklinks")[0]
              Array.from(stla.children)
              //Array.from(stla.querySelectorAll("a:not(.numberSign)"))
                .forEach((a) => tooltips.processQuote(a, true));
              Array.from(stla.getElementsByClassName("numberSign"))
              //Array.from(stla.querySelectorAll("a:not(.numberSign)"))
                .forEach((a) => stla.insertBefore(document.createTextNode(" "), a));
            }
            //end new

            if (tooltips.bottomBacklinks) {
              var alts = placeHolder.getElementsByClassName("altBacklinks")[0].firstChild
              Array.from(alts.children)
                .forEach((a) => tooltips.processQuote(a, true));
            }

            if (isBacklink) {
              //innerPost.append(placeHolder);
              //new
              if (!tooltips.bottomBacklinks) {
                // cant be bothered to troubleshoot
                if (innerPost === innerPost.getElementsByClassName("divMessage")[0].parentNode)
                  innerPost.insertBefore(placeHolder, innerPost.getElementsByClassName("divMessage")[0]);
                //innerPost.getElementsByClassName("panelUploads")[0].after(placeHolder);
              } else {
              //end new
                replyPreview.append(placeHolder);
              }
            } else {
              quote.insertAdjacentElement("afterEnd", placeHolder);
            }

          //broken?
          //false when opening, undefined when closing
            tooltips.removeIfExists();

            if (!quote.classList.contains("PG_quoteLinkClicked")) {
              //new
              quote.classList.add("PG_quoteLinkClicked");
              //end new

              //new
              quote.addEventListener("click", function() {
                placeHolder.remove();
                quote.classList.remove("PG_quoteLinkClicked");
              },{"once": true});
              //end new
            }
        })
      }
    }
  }).observe(document.documentElement, {childList: true, subtree:true });
}

//changed to fix recusive inlining
function overwriteAddLoadedTooltip()
{
  new MutationObserver((_, observer) => {
    const scriptTag = document.querySelector("script[src*='hiding.js']");
    if (scriptTag) {
      observer.disconnect();

      //add tooltip dynamic content: backlinks, link underlining, (you)s
      tooltips.addLoadedTooltip = function(htmlContents, tooltip, quoteUrl, replyId, isInline) {
        var quoteTarget = api.parsePostLink(quoteUrl);
        var board = quoteTarget.board;
        var thread = +quoteTarget.thread;
        var post = +quoteTarget.post;

        if (!htmlContents) {
          tooltip.innerText = 'Not found'; //TODO delete and disable hover?
          return;
        }

        Array.from(htmlContents.getElementsByClassName("inlineQuote")).forEach((q) => q.remove())

        var deletionCheckBox = htmlContents.getElementsByClassName('deletionCheckBox')[0];
        if (deletionCheckBox) {
          deletionCheckBox.remove();
        }

        // obtain the latest backlinks from the actual post
        // this has to be done now since backlinks change
        if (board === api.boardUri && thread === api.threadId) {
          var backContainer = tooltips.knownPosts[board][post ? post : thread];
          if (backContainer) {
            var contentBack = htmlContents.getElementsByClassName("panelBacklinks");
            Array.from(backContainer.container.children).forEach((backlink) => {
               Array.from(contentBack).forEach((panel) => {
                 panel.append(backlink.cloneNode(true));
               })
            });
          }
        }

        //new
        var altBacklinks = document.createElement("div");
        altBacklinks.setAttribute("class", "altBacklinks");
        altBacklinks.appendChild(htmlContents.getElementsByClassName("panelBacklinks")[0].cloneNode(true));
        htmlContents.appendChild(altBacklinks);

        var replyPreview = document.createElement("div");
        replyPreview.setAttribute("class", "replyPreview");
        htmlContents.appendChild(replyPreview);
        //end new


        tooltips.addReplyUnderline(htmlContents, board, replyId);

        //TODO move to HTML/node caching
        var yous = localStorage.getItem(board + "-yous");
        if (yous !== null && JSON.parse(yous).find((a) => a == post) !== undefined) {
          posting.markPostAsYou(undefined, htmlContents);
        }

        htmlContents.className = 'innerPost'; //for innerOPs
        if (tooltip.firstChild) {
          tooltip.firstChild.remove();
        }

        //new

        //end new

        tooltip.append(htmlContents); //htmlcontents is originally not complete hence recursion etc not working

        if (isInline) {
          posting.parseExistingPost(tooltip.getElementsByClassName('linkSelf')[0], false, false, true);
        } else {
          tooltips.checkHeight(tooltip);
        }
      }
    }
  }).observe(document.documentElement, {childList: true, subtree:true });
}


function buildMenu()
{
  new MutationObserver((_, observer) => {
  const scriptTag = document.querySelector("script[src*='posting.js']");
  if (scriptTag) {
    observer.disconnect();
    //clobbers. this is used to create the hide and triangle button and their menus
    postingMenu.buildMenu = function(post, extraMenu) {
      var hasFiles = post.files && post.files.children.length > 0;

      var menuCallbacks = [];

      menuCallbacks.push(
        {
          name: "Change Nickname",
          callback: () => { addNickname(post); }
        }
      );

      menuCallbacks.push(
        {
          name: "Toggle You",
          callback: () => { toggleYou(post); }
        }
      );

      menuCallbacks.push(
        {name: 'Report'
        ,callback: function() {
          postingMenu.showReport2(post.postInfo.board, post.postInfo.thread,
            post.postInfo.post);
          }
        }
      );

      menuCallbacks.push(
        {name: 'Delete Post'
        ,callback: function() {
          postingMenu.deleteSinglePost(post.postInfo.board, post.postInfo.thread,
            post.postInfo.post, null, null, null, post.innerPost);
          }
        }
      );

      if (postingMenu.loggedIn && (postingMenu.globalRole < 4
        || postingMenu.moddedBoards.indexOf(post.postInfo.board) >= 0)) {

        postingMenu.setExtraMenuMod(post, menuCallbacks, hasFiles);
      }

      return menuCallbacks;
    };
  }
  }).observe(document.documentElement, {childList: true, subtree:true });
}


function reloadPosts(noExtras = true, noModify = false, noTooltips = true, onlyIds = false, onlyNicknames = false, onlyTooltips = false, onlyPG_hideButton = false)
{
  runWhenDomLoaded(function(){
    document.querySelectorAll(".linkSelf").forEach(e => posting.parseExistingPost(e, noExtras, noModify, noTooltips, onlyIds, onlyNicknames, onlyTooltips, onlyPG_hideButton));
  });
}


function addSettings()
{
  function capitalise(s)
  {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function createCheckboxDiv(settingName, description)
  {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "PG_checkbox" + capitalise(settingName));
    if (PG_settings[settingName]){
      checkbox.setAttribute("checked", "");
    }

    let label = document.createElement("label");
    label.setAttribute("class", "small");
    label.htmlFor = "PG_checkbox" + capitalise(settingName);
    label.innerText = description;

    let div = document.createElement("div");
    div.append(checkbox, label);
    return div;
  }

  document.addEventListener("DOMContentLoaded", () => {
    let settings = [
      {
        "name": "moveReplyButton",
        "description": "Move Reply Button to Above Everything Else"
      },
      {
        "name": "keepWatcherOpen",
        "description": "Open Threadwatcher on Load"
      },
      {
        "name": "closeQrAfterPosting",
        "description": "Close Quick Reply after Posting"
      },
      {
        "name": "moveThreadInfo",
        "description": "Move Thread Info to Header (posts/IDs/files)"
      },
      {
        "name": "addWatcherShortcut",
        "description": "Add \"Add to Threadwatcher\" Shortcut Key (w)"
      },
      {
        "name": "removeXFromInlines",
        "description": "Remove \"Remove\" Button (X) from Inlines (You can click on the quotelink)"
      },
      {
        "name": "addHideButton",
        "description": "Add a \"Hide this post\" Button"
      },
      {
        "name": "removeCheckbox",
        "description": "Remove Checkbox"
      }
    ];

    var settingsDiv = document.createElement("div");
    settingsDiv.setAttribute("id", "PG_checkboxes");

    var button = document.createElement("button");
    button.innerText = "Save";
    button.addEventListener("click", function () {
      settings.forEach(function(e) {
        PG_settings[e.name] = document.getElementById("PG_checkbox" + capitalise(e.name)).checked ? true : false;
      });

      localStorage.setItem("PG_settings", JSON.stringify(PG_settings));
    });

    var name = document.createElement("span");
    name.innerText = "Weanus Settings　⸜(* ॑꒳ ॑*  )⸝⋆*";

    // I learn about Element.prepend() and .append() at the end. figures
    settings.forEach(function(e) {
      settingsDiv.appendChild(createCheckboxDiv(e.name, e.description));
    });

    document.getElementById("settings-TG9jYWwgVGltZX").parentNode.parentNode.prepend(
      name,
      settingsDiv,
      button,
      document.createElement("hr")
    );
  });
}


function fixAltBacklinkCSS()
{
  runWhenDomLoaded(function() {
    if (tooltips.bottomBacklinks) {
      applyCSS(`
      .altBacklinks > .panelBacklinks {
        display: block !important;
      }
      .title > .panelBacklinks {
        display: none !important;
      }
      `);
    }
  });
}


function removeCheckbox()
{
  runWhenDomLoaded(function() {
    applyCSS(`
      .deletionCheckBox {
        display: none;
      }
    `);
  });
}


function addCSS()
{
  runWhenDomLoaded(function() {
    applyCSS(`
      .innerPost:has(.youName) {
        border-left: solid var(--link-hover-color);
        }
      .innerPost:has(.quoteLink.you) {
        border-left: dashed var(--link-hover-color);
      }
      .unhideButton {
        font-size: 90%;
      }
      .hideButton, .extraMenuButton {
        user-select: none;
      }
      .nickname {
        color: var(--link-hover-color);
        font-weight: bold;
      }
      .numberSign {
        text-decoration: none !important;
      }
      .altBacklinks {
        background-color: rgba(0, 0, 0, 0) !important;
      }
      a.quoteLink{
        color: var(--link-color);
      }
      #quick-reply table {
        width: 100%;
      }

      .postInfo .coloredIcon {
        top: 2px;
      }

      .inlineQuote {
        margin: 10px;
      }

      .PG_quoteLinkClicked {
        text-decoration-style: dashed !important;
      }
    `);
  });
}


function applyCSS(css)
{
  var style = document.createElement("style");
  style.textContent = css;

  document.head.appendChild(style);
}


function runWhenDomLoaded (f)
{
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      f();
    });
  } else {
    f();
  }
}


/*main ===========================*/

const settingsName = "PG_settings";
const PG_settings = JSON.parse(localStorage.getItem(settingsName));

if (PG_settings === null) {
  var settings = {};
  settings["closeQrAfterPosting"] = true;
  settings["moveReplyButton"]     = true;
  settings["moveThreadInfo"]      = true;
  settings["keepWatcherOpen"]     = true;
  settings["addWatcherShortcut"]  = true;
  settings["removeXFromInlines"]  = true;
  settings["addHideButton"]       = true;
  settings["removeCheckbox"]      = true;
  localStorage.setItem(settingsName, JSON.stringify(settings));
  console.log("Initialised settings at localStorage.PG_settings");
  PG_settings = JSON.parse(localStorage.getItem(settingsName));
}

overwriteParseExistingPost();
overwriteAddExternalExtras();
overwriteAddBackLink();
overwriteAddInlineClick();
overwriteAddLoadedTooltip();

fixClickOnId();
fixAltBacklinkCSS();

buildMenu();
//reload ids to apply id fix
reloadPosts(true, true, true, true);
//reload nicknames to make them show (combine with above later, perhaps, I cant be arsed)
//reloadPosts(true, true, true, false, true);
//initialise posts. honestly I'm spagghing myself noModify is enough. I'll fix everything later...
reloadPosts(false, true, false);

addCSS();

addSettings();

if (PG_settings.closeQrAfterPosting)
  closeQrAfterPosting();
if (PG_settings.moveReplyButton)
  moveReplyButton();
if (PG_settings.moveThreadInfo)
  moveThreadInfo();
if (PG_settings.keepWatcherOpen)
  keepWatcherOpen();
if (PG_settings.addWatcherShortcut)
  addWatcherShortcut();
if (PG_settings.removeCheckbox)
  removeCheckbox();