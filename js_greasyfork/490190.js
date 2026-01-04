// ==UserScript==
// @name        Wolfery Text Emotes
// @namespace   https://shinyuu.net
// @match       https://wolfery.com/*
// @grant       none
// @version     1.0
// @author      Shinyuu Wolfy
// @description Adds a whole bunch of useful texte emotes.
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/490190/Wolfery%20Text%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/490190/Wolfery%20Text%20Emotes.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function fixPronouns(char, msg) {
  const about = char.about;
  const matches = about.match(/.*`pronouns: (\w+)\/(\w+)`.*/);
  if (!matches) {
    return msg;
  }
  return msg.replaceAll('their', matches[2]);
}

waitForElm('.console-editor').then(async () => {
  COMMANDS = {
    applaud: `gives a round of applause.`,
    blush: `blushes.`,
    bounce: `bounces around.`,
    bow: `bows deeply.`,
    burp: `burps loudly.`,
    cackle: `throws back their head, cackling with insane glee!`,
    chuckle: `chuckles politely.`,
    clap: `claps their hands together, showing approval.`,
    cough: `coughs loudly.`,
    cry: `starts sobbing, and then bursts into tears.`,
    curtsey: `curtseys gracefully.`,
    dance: `spins around in a fiery dance.`,
    daydream: `looks absent-minded, staring through people.`,
    fart: `rrrrrrrrips a stinky one.`,
    frown: `frowns.`,
    gasp: `gasps in astonishment.`,
    giggle: `giggles.`,
    glare: `glares around with a heavy gaze.`,
    grin: `grins, showing their teeth.`,
    groan: `groans loudly.`,
    grovel: `grovels in the dirt.`,
    growl: `growls angrily, like a fierce animal.`,
    hmm: `hmms, pondering.`,
    peer: `peers around, squinting their eyes.`,
    point: `points in all directions, seemingly confused.`,
    ponder: `sinks into their own thoughts.`,
    puke: `pukes their breakfast out.`,
    purr: `purrs contendly.`,
    scream: `screams loudly!`,
    shake: `shakes their head.`,
    shiver: `shivers uncomfortably.`,
    shrug: `shrugs, without elaborating further.`,
    sigh: `sighs loudly.`,
    smirk: `smirks. They think a whole lot about themselves.`,
    smile: `smiles happily.`,
    snap: `snaps their fingers.`,
    snarl: `snarls like a cornered, vicious animal.`,
    sneeze: `sneezes.`,
    snicker: `snickers softly.`,
    snore: `snores loudly.`,
    spit: `spits over their shoulder.`,
    stare: `stares at the sky.`,
    sulk: `sulks in the corner.`,
    tackle: `starts running around in a desperate attempt to tackle the air.`,
    twiddle: `patiently twiggles their thumbs.`,
    wave: `waves happily.`,
    whine: `whiles pitifully about the whole thing.`,
    whistle: `whistles appreciatively.`,
    wag: `wags their tail.`,
    wiggle: `wiggles their bottom.`,
    wink: `winks suggestively.`,
  };

  for (const [key, value] of Object.entries(COMMANDS)) {
    app.getModule('cmd').addCmd({
      key: key,
      value: async (ctx) => {
        await ctx.char.call('pose', { msg: fixPronouns(ctx.char, value) });
      }
    });
  };
});