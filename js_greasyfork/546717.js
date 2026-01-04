// ==UserScript==
// @name        Internet Roadtrip - Marcus Tedus Detectus
// @description Play a sound whenever a Marco pano is detected
// @namespace   me.netux.site/user-scripts/
// @version     1.2.1
// @author      Netux
// @license     MIT
// @match       https://neal.fun/internet-roadtrip/*
// @grant       GM.getValue
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/546717/Internet%20Roadtrip%20-%20Marcus%20Tedus%20Detectus.user.js
// @updateURL https://update.greasyfork.org/scripts/546717/Internet%20Roadtrip%20-%20Marcus%20Tedus%20Detectus.meta.js
// ==/UserScript==

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip - ', '');

  const REGEXP_REGEXP = /^\/(?<source>.*)\/(?<flags>[a-z]*)$/;

  const howler = await IRF.modules.howler;
  const containerVDOM = await IRF.vdom.container;

  const optionPickedSfx = new howler.Howl({
    src: [
      await GM.getValue('optionPickedSfx', 'https://files.catbox.moe/83p4v5.mp3')
    ],
    volume: await GM.getValue('optionPickedVolume', 0.5)
  });
  const optionDetectedSfx = new howler.Howl({
    src: [
      await GM.getValue('optionDetectedSfx', 'https://files.catbox.moe/04idsc.mp3')
    ],
    volume: await GM.getValue('optionDetectedVolume', 0.5)
  });

  const marcusTedusesRegExps = (await GM.getValue('marcusTedusesRegExps', null))
    ?.map((regExpSource) => {
      try {
        const regExpRegExpMatch = REGEXP_REGEXP.exec(regExpSource);
        if (!regExpRegExpMatch) {
          return new RegExp(regExpSource);
        } else {
          return new RegExp(regExpRegExpMatch.groups.source, regExpRegExpMatch.groups.flags);
        }
      } catch (error) {
        console.error(`[${MOD_NAME}] Could not parse Marcus Tedus source '${regExpSource}':`, error);
        return null;
      }
    })
    .filter((regExp) => regExp != null)
    ?? [/Marco.*Tedus/gi];
  const isAMarco = (description) => description != null && marcusTedusesRegExps.some((regExp) => regExp.test(description?.trim()));

  let lastStop = null;
  let lastStopOptions = [];
  let isAlreadyInAMarco = false;
  async function check({ pickedOption, newStop, newOptions }) {
    const newStopIsAMarco = isAMarco(lastStopOptions[pickedOption]?.description);

    if (!isAlreadyInAMarco) {
      if (newStopIsAMarco) {
        if (lastStop) {
          console.info(`[${MOD_NAME}] Last pano before ${lastStopOptions[pickedOption]?.description ?? 'this Marco'}: ${lastStop.pano} ${lastStop.heading}`);
        }

        optionPickedSfx.play();
        isAlreadyInAMarco = true;
      } else if (newOptions.some(({ description }) => isAMarco(description))) {
        optionDetectedSfx.play();
      }
    } else if (!newStopIsAMarco) {
      isAlreadyInAMarco = false;
    }

    lastStop = newStop;
    lastStopOptions = newOptions;
  }

  containerVDOM.state.changeStop = new Proxy(containerVDOM.state.changeStop, {
    apply(ogChangeStop, thisArg, args) {
      if (!containerVDOM.state.isChangingStop) {
        const pickedOption = args[1];
        const newStopPano = args[2];
        const newStopHeading = args[3];
        const newOptions = args[5];

        check({
          pickedOption,
          newStop: {
            pano: newStopPano,
            heading: newStopHeading
          },
          newOptions
        });
      }

      return ogChangeStop.apply(thisArg, args);
    }
  });
})();
