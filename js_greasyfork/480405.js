// ==UserScript==
// @name         Duolingo: Type more, tap less
// @description  Replace tapping exercises with full-sentence typing
// @namespace    neobrain
// @author       neobrain
// @match        https://*.duolingo.com/*
// @grant        GM.XMLHTTPRequest
// @grant        GM.log
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/472943.js?version=1239323
// @license      MIT
// @version      0.5
// @downloadURL https://update.greasyfork.org/scripts/480405/Duolingo%3A%20Type%20more%2C%20tap%20less.user.js
// @updateURL https://update.greasyfork.org/scripts/480405/Duolingo%3A%20Type%20more%2C%20tap%20less.meta.js
// ==/UserScript==

middleMan.addHook("*/sessions", {
    requestHandler(request) {
      GM.log("Outgoing request: ", request);
    },
    async responseHandler(request, response, error) {
        GM.log("Incoming response: ", response, error);

        let reduxState;
        try {
          reduxState = JSON.parse(localStorage.getItem("duo.state")).state.redux
        } catch {
          // NOTE: This is now a base64-encoded gz archive

          let str = localStorage.getItem("duo.state");

          const str2 = atob(str.slice(1, -1)); // Remove wrapping quotes
          const ds = new DecompressionStream("gzip");
          let uint8Array = new Uint8Array(str2.split("").map(c => c.charCodeAt(0)));
          let readableStream = new ReadableStream({
              start(controller) {
                  controller.enqueue(uint8Array);
                  controller.close();
              }
          });

          let outstream = readableStream.pipeThrough(ds);

          let result = "";
          const reader = outstream.getReader();
          const decoder = new TextDecoder('utf-8');
          while (true) {
            let value = await reader.read();
            result += decoder.decode(value.value);
            if (value.done) {
              break;
            }
          }

          reduxState = JSON.parse(result).state.redux;
        }
        const learningLanguage = reduxState.user.learningLanguage;
        const fromLanguage = reduxState.user.fromLanguage;

        const data = await response?.json() ?? { errorMessage: error.message };
        for (let challenge of data.challenges) {
            // Speak exercises always use tapping. Turn this into a translate exercise instead
            // Disabled for now since translate exercises won't have voice output :(
            if (false && challenge.type === "speak") {
              GM.log("Patching speak challenge to translate: ", challenge);
              challenge.type = "translate";

              challenge.correctSolutions = [ challenge.solutionTranslation ];
              delete challenge.solutionTranslation;

              challenge.targetLanguage = challenge.grader.langage;
              challenge.sourceLanguage = challenge.grader.langage === learningLanguage ? fromLanguage : learningLanguage;
            }

            // Alternative that turns it into a "listen => translate" exercise. Hard to distinguish from pure listening exercises though!
            if (false && challenge.type === "speak") {
              GM.log("Patching speak challenge to listenTap: ", challenge);
              challenge.type = "listenTap";

              challenge.grader.language = "fr";

              challenge.correctTokens = challenge.tokens;
              challenge.choices = challenge.tokens.filter(a => "tts" in a).map(a => { return { text: a.value, tts: a.tts } });
              challenge.choices.push({ text: "Tap input not available. Switch to keyboard input." });
            }

            // Translate exercises use tapping only when translating to the student language.
            // Trick the frontend into allowing free-form text by swapping the languages
            if (challenge.type === "translate" && challenge.grader.language == fromLanguage) {
                GM.log(`Patching challenge from ${learningLanguage}->${fromLanguage} to ${fromLanguage}->${learningLanguage}:`, challenge);
                challenge.grader.language = learningLanguage;
                challenge.sourceLanguage = fromLanguage;
                // NOTE: The frontend uses challenge.targetLanguage for the "Write this in X" text, so we leave it unchanged
            }
        }
        return Response.json(data);
    }
});
