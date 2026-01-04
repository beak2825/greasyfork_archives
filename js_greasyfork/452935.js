

    // ==UserScript==
    // @name         Starblast.io send five emotes
    // @description  A mod to let you use 5 emotes on starblast.io
    // @version      0.2
    // @author       Pixelmelt
    // @license      MIT
    // @namespace    https://greasyfork.org/en/users/226344
    // @match        https://starblast.io/
    // @icon         https://cdn.upload.systems/uploads/DDPfEofl.png
    // @run-at       document-start
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452935/Starblastio%20send%20five%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/452935/Starblastio%20send%20five%20emotes.meta.js
    // ==/UserScript==
     
    const modName = "SendFiveEmotes";
     
    const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");
     
     
    function runner() {
      if(localStorage.getItem("emoteamnt") == null){
        localStorage.setItem("emoteamnt", 9);
      }
     
      window.module.exports.settings.parameters.emoteamnt = {
        name:`Chat emotes amount`,
        value: parseInt(localStorage.emoteamnt.replace(`"`,``)),
        type: "range",
        min: 1,
        max: 9,
        stored: true
      }
     
      log(`Mod ran`);
    }
    function injector(sbCode) {
      let src = sbCode;
      let prevSrc = src;
     
      function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
      }
      // Add sus
      src = src.replace(`say(this.phrase),this.phrase.length>=4&&this.hide(),Math.random()<.01)return`,`.say(this.phrase),this.phrase.length>=${localStorage.getItem("emoteamnt")}&& this.hide(),Math.random()<.01)return`);
      checkSrcChange();
     
      log(`Mod injected`);
      return src;
    }
    if(!window.sbCodeRunners) window.sbCodeRunners = [];
    window.sbCodeRunners.push(() => {
      try {
        return runner();
      } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
      }
    });
    if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
    window.sbCodeInjectors.push((sbCode) => {
      try {
        return injector(sbCode);
      } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
      }
    });
    log(`Mod loaded`);

