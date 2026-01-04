// ==UserScript==
// @icon          https://www.reddit.com/favicon.ico
// @name          Reddit comment collector
// @author        grefork
// @description   gether all comments from a reddit post
// @match         *://www.reddit.com/r/*/comments/*
// @version       1.4.1
// @namespace     grefork
// @require       http://code.jquery.com/jquery-3.4.1.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/413982/Reddit%20comment%20collector.user.js
// @updateURL https://update.greasyfork.org/scripts/413982/Reddit%20comment%20collector.meta.js
// ==/UserScript==
{
    const commentClass = "._1qeIAgB0cPwnLhDF9XSiJM";
    const insertClass = "._1r4smTyOEZFO91uFIdWW6T";
    const init = async () => {
    try {
      if($(insertClass).get().length ==0) throw new Error('Wait for loading')

      function getComments() {
          if ($("#commentList").get().length > 0)
              return
          const textList = $(commentClass)
          var commentList = [];
          for (var i=0;i<textList.length;i++) {
              if(textList[i].textContent.includes("http"))
                  continue;
              var splitted = textList[i].textContent.split(/[.?!。]+/);
              console.log(splitted)
              for (var j=0; j<splitted.length; j++){
                  if(splitted[j].length > 5 && !commentList.includes(splitted[j]))
                      commentList.push(splitted[j].trim());
              }
          }
          var textarea = document.createElement("textarea");
          textarea.id = "commentList";
          textarea.value = commentList.join("\n");
          textarea.style.cssText = "width:100%;height:200px"
          $(insertClass).get()[0].appendChild(textarea);
      }

      var button = document.createElement("button");
      button.innerText = "LOAD COMMENT";
      button.style.cssText = "background-color:#327bb3;padding:5px"
      button.onclick = getComments
      $(insertClass).get()[0].appendChild(button);

    } catch (_) {
      setTimeout(init, 1000);
    }
  };
  init();
}