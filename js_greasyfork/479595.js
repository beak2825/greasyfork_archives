// ==UserScript==
// @name        Kick Emote Picker
// @namespace   maartyl scripts
// @match       https://kick.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      maartyl
// @license     MIT
// @description Adds "Favorites" Emote Picker to Kick chat UI. For sub emotes / 7TV / or anything that can be a text and pasted into message input field. Very BASIC for now.
//
// @downloadURL https://update.greasyfork.org/scripts/479595/Kick%20Emote%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/479595/Kick%20Emote%20Picker.meta.js
// ==/UserScript==


// TODO: ?  Also add NORMAL EMOJI support - no need for image -> needs different rendering, though... Might be Annoying to MIX ...

(function(_root){

  function init() {
    const dumbEmotes = document.getElementsByClassName("quick-emotes-holder")[0];
    const inp = document.getElementById("message-input");

    const externReady = dumbEmotes && inp;

    if (!externReady){
      //TODO: listen changes? repeat if not ready ?
      //TODO: check all present: if not: delay init // ... Might run forever if it never finds it. ~Zero cost, though.

      console.log("maa.init: chat-dom not ready");

      setTimeout(init, 500);
      return;
    }

    dumbEmotes_display = dumbEmotes.style.display; //save KICK defined value to put back after I hid it;

    // --- end of DOM read

    //TODO: UNREGISTER ALL AND RESTART init-loop on chat UNMOUNT --- FUTURE


    const channelName = window.location.pathname.split("/")[1];
    const confName = "confa." + channelName;

    console.log("maa.init", confName);

    const pane = document.createElement("div");
    pane.id = "maa-emote-picker-pane";
    pane.style.display = "flex";
    pane.style.position = "relative";
    pane.style.flexFlow = "wrap-reverse";
    pane.style.gap = "0.2rem";
    pane.style.maxHeight = "50vh";
    pane.style.overflowY = "scroll";
    pane.style.marginBottom = "-0.7rem";

    const confa = document.createElement("textarea");
    confa.value = GM_getValue(confName, "");
    confa.style.backgroundColor = "transparent";
    confa.style.width = "100%";
    confa.style.minHeight = "0.2rem";
    confa.style.height = "0.2rem";
    confa.style.fontFamily = "monospace";
    //confa.style.textWrap = "nowrap"; // - nicer BUT: enables sideways scrollbar - always - annoying. Not worth exploring how to fix.

    confa.style.paddingTop = "0.5rem";  // prevents text being visible normally, when collapsed
    confa.style.paddingLeft = "0.5rem";  // NOT bottom
    confa.style.paddingRight = "0.5rem";
    //confa.style.marginBottom = "-0.5rem";
    //confa.style.marginTop = "-0.5rem";

    pane.appendChild(confa);


    setEditing(false); //= init layout
    insertAfter(pane, dumbEmotes);
    dumbEmotes.style.display = "none";

     //TODO: use DOM observer of direct children + text changes
    inp.addEventListener("input", (event) => {
      // data == the txt _inserted_ - not text overall -- NULL in delete
      // inputType = insertText vs (probably paste / del)

      setEditing("" != inp.innerText);
    });

    confa.addEventListener("change", (event) => {
      //save new value on "lost focus and changed"
      //paddingTop works well to hide text when collapsed -- better than adding extra newline to start
      var v = event.target.value;
      console.log("maa.conf.set.chng", {v, event});
      GM_setValue(confName, v); //auto ingested in change listener
    });

    function setEditing(isEditing){
      if (isEditing){
        //dumbEmotes.style.display = "none";
        //pane.style.display = "flex";
        pane.style.maxHeight = "50vh";
        pane.style.overflowY = "scroll";
      } else {
        //dumbEmotes.style.display = dumbEmotes_display;
        //pane.style.display = "none";
        pane.style.maxHeight = "3rem";
        pane.style.overflowY = "clip"; // clip = no scroll, unlike "hidden"
      }
    }

    function insertEmoteText(emoteName) {
      //console.log("maa.insert", emoteName);
      inp.focus();
      pasteText(inp, emoteName + " "); // useful space - not needed for emote interpreted, but easy to click multiple
    }


    function pushEmotes(emoteList) {
      // clear old
      for (const old of pane.querySelectorAll("img")){
        pane.removeChild(old);
      }

      // push all from parsed list
      for (const e of emoteList) {
        appendEmote(pane, e);
      }
    }
    function appendEmote(parent, emoteObj) {
      //parent is always the pane for now

      //TODO: hover CSS

      const eimg = document.createElement("img");
      //eimg.style.margin = "0.25rem"; // gap instead
      eimg.style.height = "2rem";
      eimg.style.width = "auto"; //for non rectangular
      eimg.style.borderRadius = "4px";
      eimg.style.cursor = "pointer";
      confa.style.backgroundColor = "transparent";

      eimg.alt = emoteObj.emoteName;
      eimg.title = emoteObj.emoteName;
      eimg.src = emoteObj.emoteImgUrl;

      eimg.addEventListener("click", e => {
        insertEmoteText(emoteObj.emoteName);
      });

      parent.appendChild(eimg);
    }

    function ingestConf(txt) {
      // allows conf: either
      // - directly lines
      // - or single URL - points to the list

      txt = txt.trim();

      if (!isValidUrl(txt)){
        pushEmotes(parseEmoteList(txt));
      } else {
        xhr({url:txt})
          .then(x=> x.status == 200 ? x.responseText : "")
          .then(parseEmoteList)
          .then(pushEmotes)
          .catch(console.error);
      }
    }

    GM_addValueChangeListener(confName,  (name, oldValue, newValue, remote) =>{
      //console.log("maa.conf.sub.chng", {name, oldValue, newValue, remote});
      ingestConf(newValue);
      if (remote){
        confa.value = newValue;
      }
    });
    ingestConf(GM_getValue(confName, "")); // ingest saved on init


    function parseEmoteList(txt){
      // normal line:  name img-url
      // external config: just url  (single instead of file)
      //TODO: idea:
      // - external config LIMITED TO CHANNEL:  /nebride url   -> url leads to again another config file
      // -- I hope emote name cannot contain slash - it CAN contain : and ! ...
      // - SILLY: just use different url per channel - I just have to SAVE separately -- each different emotes anyway / 7tv / ...

      // IDEA: commands      //ppl already used to ! -> command - less confusing than "what just some lone f is ?" -- PROBLEM on command CLASH, tho ...
      //  !f name   img-url
      //  !a alias  name
      //  !include  conf-url
      //  name img-url --> !f
      //  lone-url --> !include


      const lines = txt.split("\n");
      return lines.map(l => {
        const parts = /(\S+)\s+(\S+)/.exec(l);
        if (!parts) {
          //TODO: log weird  / err / ...
          console.warn("maa.conf.no-emote-line:", l);
          return null;
        }

        return {
          emoteName: parts[1],
          emoteImgUrl: parts[2],
        }

      })
      //ignore
        .filter(x=>x);
    }


    //end init
  }

  function pasteText(elemTarget, text) {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', text);
    elemTarget.dispatchEvent(new ClipboardEvent('paste', { clipboardData }));
  }

  function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  }

  function xhr(args) {
    return new Promise((onok,onerr) => {
      GM_xmlhttpRequest({
        context: {onok,onerr},
        anonymous:true,
        onload:onok,
        onerror:onerr,
        ...args,
      })
    })
  }

  function isValidUrl(urlString) {
    let url;
		try {
      url = new URL(urlString);
    }
    catch(e) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  init();
})(this)