// CSS rules for coronabuddy
let darkModeSet = false;
let darkModeEnabled = false;
let darkModeInjected = false;

let darkCSS = /*css*/ `
::selection {
  background: #B4D5FE;
}

::-moz-selection {
  background: #B4D5FE;
}

blockquote {
  border: 1px solid linen !important;
}

html:not(root) body {
  background-color: #121212 !important;
}

html:not(root) div {
  border: 0px !important;
}

html:not(root) p {
  color: white !important;
}

#af-wrapper a {
  color: lime !important;
  outline: 0;
}

#af-wrapper small .profile-link {
  /* This fixes a critical bug with the forum addon that seems to allow arbitrarily long user names without truncation, breaking UX */
  display: inline-block !important;
  vertical-align: bottom !important;
  max-width: 5vw !important;
  max-height: 2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#af-wrapper .forum-description {
  color: linen;
}

#af-wrapper #forum-header {
  background-color: #006600 !important;
}

#af-wrapper #forum-navigation a {
  border-color: green !important;
}

#af-wrapper .pages > strong {
  background-color: rgba(50, 255, 50, 0.6) !important;
  color: linen !important;
}

#af-wrapper #profile-content {
  background-color: #232323 !important;
  color: linen !important;
}

#af-wrapper #profile-layer {
  background-color: #232323 !important;
}

#af-wrapper #profile-navigation {
  /* Override random !important in the WP CSS */
  background-color: green !important;
}

#af-wrapper #profile-navigation a.active {
  /* Override random !important in the WP CSS */
  background-color: #006600 !important;
}

#af-wrapper .button-normal {
  /* Override random !important in the WP CSS */
  background-color: #006600 !important;
  border: 0px;
}

#af-wrapper .content-element:nth-child(2n):not(.topic-sticky) {
  background-color: #121212 !important;
}

#af-wrapper .topic-sticky {
  background-color: #121212 !important;
  border-left: none !important;
  border-right: none !important;
  border-top: none !important;
}

#af-wrapper .topic-sticky .fa-comments {
  color: tomato !important;
}

#af-wrapper .topic-sticky .topic-name > a {
  color: #d6203b !important;
  font-weight: 700 !important;
}

#af-wrapper .editor-row-subject {
  background-color: black !important;
  color: gray !important;
}

#af-wrapper .editor-row-subject > span > input {
  background-color: #232323 !important;
  color: linen !important;
}


#af-wrapper .forum-post-menu a {
  color: green !important;
}

#af-wrapper .pages {
  background-color: #232323 !important;
  border-color: gray !important;
  border: 1px solid gray !important;
}

#af-wrapper .pages > a {
  border-right: 1px solid gray !important;
  border-left: 1px solid gray !important;
  color: lime !important;
}

#af-wrapper .pages a:hover {
  background-color: lime !important;
  color: black !important;
}

#af-wrapper .pages strong {
  border-right: none;
  color: black !important;
}

#af-wrapper .post-author .topic-author {
  color: red !important;
  font-weight: 900;
  font-size: 1.1em;
  -webkit-text-stroke: 1px black !important;
}

#af-wrapper .post-message > blockquote::after {
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(249, 249, 249, .4)) !important;
}

#af-wrapper .post-element {
  border: 2px gray solid !important;
}

#af-wrapper .title-element {
  background-color: #006600 !important;
}

#af-wrapper .topic-sticky .topic-poster {
  border-left: 0px;
  background: none !important;
}

#af-wrapper .unread {
  color: lime !important;
}

#forum-breadcrumbs > span > a > span {
  color: linen;
}

#forum-search {
  background-color: #232323 !important;
}

#poll-panel {
  background-color: #000000 !important;
  color: linen !important;
}

#read-unread {
  display: none !important;
}

.avatar {
  border: none !important;
}

.background-contrast {
  background-color: #232323 !important;
}

.content-container {
  background-color: #232323 !important;
  border-color: black !important;
}

.dark .site-container {
  background-color: #121212 !important;
}

.editor-row {
  background-color: #121212 !important;
}

.forum {
  border-bottom: 0px !important;
}

.forum-editor-button {
  border: none !important;
}

.forum-poster {
  border-left: 0px !important;
}

.forum-post-date:after {
  content: '';
  width: 40vw !important;
  height: 1px !important;
  display: block;
  position: absolute;
  border-bottom: 1px solid gray !important;
}

.forum-post-header {
  border-color: gray !important;
}

.footer-widgets {
  background-color: #232323;
}

.mce-container-body {
  background-color: #121212 !important;
}

.poll-result-numbers {
  color: linen !important;
}

.poll-result-total {
  color: linen !important;
}

.post-counter {
  color: linen;
}

.post-element {
  background-color: #232323 !important;
}

.post-wrapper {
  background-color: #121212 !important;
  color: linen !important;
  border: 0px !important;
  border-right: 1px gray solid !important;
}

.quotetitle {
  color: linen;
}

.reaction.up:hover {
  color: lime !important;
}

.reaction.up > .reaction-icon {
  color: lime !important;
}

.reaction.up > .reaction-icon.reaction-inactive {
  color: gray !important;
}

.reaction.up > .reaction-number {
  color: lime !important;
}

.reaction.down:hover {
  color: red !important;
}

.reaction.down > .reaction-icon {
  color: red !important;
}

.reaction.down > .reaction-icon.reaction-inactive {
  color: gray !important;
}
.reaction.down > .reaction-number {
  color: red !important;
}

.spoiler-head {
  background-color: black !important;
  border: 1px solid linen !important;
}

.topic {
  border-bottom: 0px !important;
}

.topic-poster {
  border-left: 0px !important;
}
`;

GM.getValue("darkmodeEnabled", false).then((value) => {
  if (value === true) {
    darkModeEnabled = true;
    const OBSERVER = new MutationObserver(parseNodes);

    OBSERVER.observe(document, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    function parseNodes(mutations) {
      if (darkModeEnabled && document.head && darkModeSet === false) {
        darkModeSet = true;
        document.head.lastChild.after(
          templateDOMElement({
            tag: "style",
            innerHTML: darkCSS,
            id: "coronaBuddyDarkMode__selector",
            classList: "",
            style: "",
          })
        );
      }
      // sloppy injection fix for iframes
      try {
        if (
          document.querySelector("#message_ifr") &&
          document.querySelector("#message_ifr").contentWindow.document.body &&
          !darkModeInjected &&
          darkModeEnabled
        ) {
          document.head.lastChild.after(
            templateDOMElement({
              tag: "style",
              innerHTML: darkCSS,
              id: "coronaBuddyDarkMode__selector",
              classList: "",
              style: "",
            })
          );

          console.log("Injected darkmode.");
          darkModeInjected = true;
          document
            .querySelector("#message_ifr")
            .contentWindow.document.head.querySelector("style").innerHTML +=
            "body {background-color: #121212 !important; color: white !important;} blockquote {border: 1px solid linen !important;}";
        }
      } catch (error) {
        console.log(error);
      }
    }
  } else {
  }
});

let popupCSS = /*css*/ `
@import url('https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap');

.popup {
  position: relative;
  }
  
  .popup__banner {
    background-color: $black;
    height: 2.5em;
    margin-top: 2em;
    box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  }
  
  .popup__banner--text {
    color: lime !important;
    font-size: 0.8em;
    font-family: 'Press Start 2P', cursive;
    text-align: center;
  }
  
  .popup__textarea {
    color: lime !important;
    background-color: black !important;
    font-size: 1.1em;
    padding: 0.5em 0.5em 0.5em 0.5em;
    width: 60%;
    height: 20em;
    resize: none;
    margin-bottom: 0.3em;
    margin-top: 1em;
  }
  
  .popup__textarea:focus {
   outline: none;
  }
  
  .popup__button {
    background-color: rgb(45, 45, 45);
    width: 50%;
    height: 3em;
    border: 0px solid lime !important;
    font-size: 1em;
    display: block;
    margin: 0 auto;
    border: none;
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
    transition: border 0.3s;
  
  }
  
  .popup__button:focus {
      outline: none;
  }
  
  .popup__button:hover {
      border: 4px solid lime !important;
      transition: border 0.3s;
  }
  
  .popup__button:active {
      background-color: lime !important;
  
  }
  
  .popup__button--invert {
    background-color: lime !important;
    color: $black !important;
  }
  
  .popup__button--black {
    background-color: rgb(45, 45, 45);
  }
  
  .popup__button--center {
    display: block;
    text-align: center;
  }
  
  .popup__button--text {
    color: lime !important;
    font-weight: 500;
    font-family: 'Press Start 2P', cursive;
    margin: 0;
    font-size: 0.5em;
    &:active {
      color: $black !important;
    }
  }
  
  .popup__button--save {
    margin-bottom: 0.5em;
  }
  
  .popup__button--clear {
  }
  
  .popup__notification {
    color: $red;
    font-weight: 700;
    margin-top: 0.5em;
  }
  
  .popup__darkmode {
    margin-top: 1em;
    text-align: center;
  }
  
  .popup__darkmode--text {
    display: inline-block;
    color: lime !important;
    font-size: 0.6em;
    font-family: 'Press Start 2P', cursive;
    margin-right: 0.5em;
  }
  
  .popup__darkmode--checkbox {
    display: inline-block;
    height: 0.8em;
    width: 0.8em;
    background-color: #555;
    border-radius: 0.1em;
    margin-bottom: -0.08em;
    user-select: none;
  }
  
  .popup__darkmode--checkbox--check:after {
    content: '✓';
    position: absolute;
    color: lime !important;
    font-size: 0.6em;
    font-weight: 900;
    margin-left: -0.42em;
    margin-top: 0.1em;
  }
`;

window.addEventListener("DOMContentLoaded", function () {
  document.head.lastChild.after(
    templateDOMElement({
      tag: "style",
      innerHTML: popupCSS,
      id: "coronaBuddyPopup__selector",
      classList: "",
      style: "",
    })
  );
});
