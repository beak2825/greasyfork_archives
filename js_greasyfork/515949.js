// ==UserScript==
// @name FFA Foul Language Processor
// @licence MIT
// @author krcanacu & jgonzzz
// @namespace FFA_FL_Script
// @description Enhanced script for detecting and counting occurrences of specific words.
// @match http://vcc-review-caption-alpha.corp.amazon.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @version 2.0.4
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/515949/FFA%20Foul%20Language%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/515949/FFA%20Foul%20Language%20Enhanced.user.js
// ==/UserScript==

(function() {
    LoadFL();
})();

function LoadFL(){

  //Keywords definition
  //              Severe Words          //
  //RoDS = Racial or derogatory slurs
  const RoDSWords = ["nigger", "beaner", "nigga", "coon", "negro", "dyke", "chink", "faggy", "chinky", "faggot", "jap", "fag", "paki", "retard", "retarded", "wog", "queer", "gook", "kike"];

   //Fuckwords = Self explanatory
  const Fuckwords = ["fuck", "fucked", "fucker", "fucking", "fuckin", "motherfuck", "motherfucker", "fuckface"];

  //EuSR = Explicit use of sexual terminology
  const EuSRwords = ["porn", "ho", "pornography", "hoe", "hoes", "porno", "wanker", "masturbate", "masturbation", "jerk off", "hand job", "blowjob", "whore", "hooker", "stripper", "prostitution", "prostitute", "sex worker", "brothel", "pimp"];

  //ERoSV = Explicit references of sexual violence
  const ERoSV = ["sexual assault", "sexual abuse", "rape", "rapist", "raped", "molest", "molested"];

  //RtHD = References to hard drugs
  const RtHDwords = ["LSD", "crack", "meth", "acid", "meth-head", "molly", "methamphetamine", "ecstasy", "heroin", "cocaine", "MDMA", "DMT"];

  //NCSR = Non-comedic sexual reference
  const NCSRwords = ["orgy", "BDSM", "dildo", "vibrator", "lubricant", "orgasm"];

  //               Moderate words        //
  //TenIoS = 10+ Instances of shit, ass, asshole, bitch, piss, etc.
  const TenIoSwords = ["shit", "ass", "asshole", "bitch", "piss"];

  // DiSR = Dick/cock, pussy/cunt, cum in a sexual reference
  const DiSRwords = ["dick", "cock", "pussy", "cunt", "cum"];

  //RtDUwords = References to drugs or drug use
  const RtDUwords = ["weed", "opioids", "marihuana", "opium", "marijuana", "pot", "cannabis", "mary jane", "opioid"];

  //CSR = Comedic sexual reference
  const CSRwords = [""];

  //RtS = References to Suicide
  const RtSWords = ["suicide", "self-harm", "kill myself", "kill herself", "kill himself", "kill yourself"];

  //NErtSV = Non-explicit references to Sexual Violence
  const SErtSV = ["sexual harassment"];

  //MuoSR = Moderate use of sexual references
  const MuoSRWords = ["harlot"];

  // Categories config of threshold and label
  const targetCategories = [
      { words: RoDSWords, threshold: 1, label: "Racial or derogatory slurs" },
      { words: Fuckwords, threshold: 3, label: "3+ instances of fuck" },
      { words: EuSRwords, threshold: 1, label: "Explicit use of sexual terminology" },
      { words: ERoSV, threshold: 1, label: "Explicit references to sexual violence" },
      { words: RtHDwords, threshold: 1, label: "References to hard drugs" },
      { words: NCSRwords, threshold: 1, label: "Non-comedic sexual reference" },
      { words: TenIoSwords, threshold: 10, label: "10+ Instances of shit, ass, asshole, bitch, piss, etc." },
      { words: DiSRwords, threshold: 2, label: "Dick/cock, pussy/cunt, cum in a sexual reference" },
      { words: RtDUwords, threshold: 3, label: "References to drugs or drug use" },
      { words: CSRwords, threshold: 3, label: "Comedic sexual reference" },
      { words: RtSWords, threshold: 3, label: "References to Suicide"},
      { words: MuoSRWords, threshold: 3, label: "Moderate use of Sexual References"}
  ];

  const subTitleDiv = document.getElementById('full-caps');

  if (subTitleDiv) {
      const textNodes = document.createTreeWalker(subTitleDiv, NodeFilter.SHOW_TEXT, null, false);
      let categoryCounts = {};
      let detectedWords = {};

      targetCategories.forEach(category => {
          categoryCounts[category.label] = 0;
          detectedWords[category.label] = new Set();
      });

      while (textNodes.nextNode()) {
          const textContent = textNodes.currentNode.textContent.toLowerCase();
          const lines = textContent.split('\n');
          lines.forEach(line => {
              targetCategories.forEach(category => {
                category.words.forEach(word => {
                    const regex = new RegExp(`\\b${word}(s?|ers|es|s)?\\b`, 'gi');
                    if (regex.test(line)) {
                        categoryCounts[category.label]++;
                        detectedWords[category.label].add(word);
                    }
                });
            });
          });
      }

      let popupContent = '';
      let foulLanguageDetected = false;

      targetCategories.forEach(category => {
          if (categoryCounts[category.label] >= category.threshold) {
              const wordsList = [...detectedWords[category.label]].join(', ');
              popupContent += `${category.label}: ${categoryCounts[category.label]} (${wordsList})<br>`;
              foulLanguageDetected = true; // Mark that foul language was detected
          }
      });

      // If no foul language was detected, add the fallback message
      if (!foulLanguageDetected) {
          popupContent = 'Not enough foul language was found, check the title for NFF content';
      }

      if (popupContent.trim() !== '') {
          const popup = document.createElement('div');
          if (popupContent === 'Not enough foul language was found, check the title for NFF content') {
              popup.innerHTML = popupContent;
          } else {
              popup.innerHTML = `Possible NFF (check for ambiguity):<br>${popupContent}`;
          }

          return(popup);
      }
  }
}