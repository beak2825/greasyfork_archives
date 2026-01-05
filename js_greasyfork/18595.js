// ==UserScript==
// @name                WME Speeds
// @namespace           https://greasyfork.org/cs/scripts/12402-wme-speeds
// @author              Martin Kolář (based from WME Color Highlights v. 1.98)
// @description         Adds colours to road segments to show their speeds
// @include             https://editor-beta.waze.com/*
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @exclude             https://www.waze.com/user/*editor/*
// @exclude             https://www.waze.com/*/user/*editor/*
// @version             0.4.1
// @grant               none
// @contributor         FZ69617
// @downloadURL https://update.greasyfork.org/scripts/18595/WME%20Speeds.user.js
// @updateURL https://update.greasyfork.org/scripts/18595/WME%20Speeds.meta.js
// ==/UserScript==

(function()
{

// global variables

var wmeSpeedsVersion = '0.4.1';
var wmeSpeedsInit = false;
var wmeSpeedsColors =    ['#ff0000', '#321325', '#540804', '#BA1200', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55'];
var wmeSpeedsColorsMph = ['#ff0000', '#321325', '#702632', '#540804', '#A00027', '#BA1200', '#F15872', '#FA4A48', '#F39C6B', '#A7D3A6', '#ADD2C2', '#CFE795', '#F7EF81', '#BDC4A7', '#95AFBA', '#3F7CAC', '#0A369D', '#001C55', '#000000'];
var wmeSpeedsMaxSpeed = 130;
var wmeSpeedsMaxMphSpeed = 85;
var wmeSpeedsLayer;
var wmeSpeedsOtherDrivableSegments = [8, 20, 117, 115];
var wmeSpeedsNonDrivableSegments = [5, 10, 16, 18, 19];
var wmeSpeedsMiles = false;
var wmeSpeedsKmphToMphRatio = 0.621371192;
var wmeSpeedsInvertSpeedsColors, wmeSpeedsHighlightOneWay, wmeSpeedsTransparentColors, wmeSpeedsNonDrivableSpeedsColors, wmeSpeedsOtherDrivableSpeedsColors, wmeSpeedsUnverified;
var wmeSpeedsChatAddonCounter = 0;

//  language settings
var wmeSpeedsLanguage = 'en';  //  default language
var wmeSpeedsTranslation = [];

//  icons
var wmeSpeedsTabIcon = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNjg3OEY2RjhFMEIxMUU1OTU1MUU5MjA0ODlFQjA1MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNjg3OEY3MDhFMEIxMUU1OTU1MUU5MjA0ODlFQjA1MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA2ODc4RjZEOEUwQjExRTU5NTUxRTkyMDQ4OUVCMDUwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2ODc4RjZFOEUwQjExRTU5NTUxRTkyMDQ4OUVCMDUwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Dhzo6gAABIFJREFUeNqsV2tMU1kQnsWiVhG6Irrro1Br9IcJoMFH1j+AURLEB2CMGBWNIIgmZhMX/W+IupsYV+NzXR9IEE00+KpBjfiE4ApWs/5YHhbqA4EFWhArwg9nTs+9PffS1kthki/33plzZubcM3Nmju7aSNBKIYhliARELMKECOMyJ8KGsCLKEbcQn7Qo/UGDAzMQuxEZiLEane1BXEQcQNT7GxjkRzYasR/xGpE1COPAx2bxuQe4rkE5YEZU8pWPhMCJ5uZzXTO8DdB54c1FWBCT1IKwuAUweVUaRCQkgt5oBF1oKOP3d3WBy26HtvL78KH0KjifV6mnUsw8QSQjavzFAHlZgYgQmaFz4mB63g4wbszUtGx74XmwHT8Kzpp/1KI2xC9iXIgO6PmvihFnGDdlQ+zJUwH9f2tuDtjPDpj7CrEQ4aKPERkjZEEBIl0RCDt3QfThIwEHwE8py6G/uwc6qypENm1tMOKe6AAFXRF9yyvfvBWi/zwMQ6WJS5aC630zOK3VIns+T9MOKQv2cK/cwTZ3HsSeOAnDRaSLdAoUzG2yLBjHDxmZTLl5CgVXrpbCqdNnBigus1yX3588rYDii5eg4Y0NzNNNsHJFCiQtXeLRuW07WLM3idPXIn4N4qkxVkw1Y6ZiINTW1fldIRnfW7CfGSei58FDR6Dszl1PMGMGkW7VYZVMDiwWuVNS030aohWLkOjYcfd2rVu7hvHpSXS+sAi+o3sxORAtcibEJwww/ODhY59O/VdbC+0dnew9MTGePVOWJbMn8UnuR3d0EM8AmcaYTD6NJSWvgLwdO1lMuFwsjaGxsUmWT5s6lT3Dw8fLPFHuRbeZgjBUcTaHhChGvH33TvFN+0t4Xl0N+wr2Diob1LrJtu57k2hV0n7Tqi23y1hG1Lx4yYJvqERb0CUy+j/57iP0ej2kp63yFP2eHoiKipS/29s7FE8iUe5Fdxc50CByPttsihGkTFQophYpnzVzJoSP/5F937xl4UH7yB0LyCe5L91kW8eLg5yg/z8oB0NcnDyC9ppyWk2UapLyzI3r2ZjikssMEuVty1HMId3qwkS1YAy+rJY4X7G2R23J8rjY8AZ6e3uh+WOLu1mYEwMZaDw9LdVTw81mmBgxAVpb26Cz08FOws2ZGyAxIV5h7d/8XfDlgyKo/6ByTEdxs3gaxv51TnPt10r2C4VgzVLo/EwFk2KgG1EiSqiZGG7yopOqYbdUDan57JMk1MlQMzFcRLqc1c9EVh9vVuV+oIP3/YtkJ7B+UzNB9Xwo9Dr/N2g8MSCIDyIuqTuip4jlYjNKnQw1E9TZBLpyL8Yp6zZIf1x0oJ+3SYoLCP2JjxYLBI0aBWExMdoDLjcbWm/f8NaUJiFa/N2MfLblhnkL4eeVqe62PDISgg0G94Y6HOBqamJtefP1UnA8q/TmV4uWtlxsz6+oS/UQ6BVveOu13ozq+en4u5gdAVAf17HA1x3R393wC7+azUac5geHVqJm4W8+dzfXFfDtWLyep6iu5wYuc6iu5ze1Xs+/CTAA2tuMX1dHe2oAAAAASUVORK5CYII=';

//  cs translation
wmeSpeedsTranslation['cs'] = {
  'scriptName': 'WME Speeds',
  'layerName': 'Rychlosti',
  'tabName': 'R',
  'speedsHeadline': 'Barvy segmentů dle rychlostí',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
  'author': 'Autor: <a href="https://www.waze.com/cs/user/editor/martinkolar" target="_blank">martinkolar (4)</a>',
  'version': 'Verze:',
  'invertSpeedsTitle': 'Invertovat barvy rychlostí',
  'invertSpeedsContent': 'Zvýrazní jen segmenty bez rychlosti (červená)',
  'noSpeedsSegmentsTitle': 'Nesjízdné segmenty s rychlostí',
  'noSpeedsSegmentsContent': 'Zvýrazní nesjízdné segmenty s rychlostmi (růžová)',
  'noSpeedsSegmentsOtherTitle': 'Jinak sjízdné segmenty s rychlostí',
  'noSpeedsSegmentsOtherContent': 'Zvýrazní jinak sjízdné segmenty s rychlostmi (růžová)',
  'transparentColorsTitle': 'Průsvitné barvy',
  'transparentColorsContent': 'Průsvitné barvy',
  'unverifiedSegmentsTitle': 'Nepotvrzené rychlosti na segmentech',
  'unverifiedSegmentsContent': 'Zvýrazní nepotvrzené rychlosti na segmentech',
};

//  sk translation
wmeSpeedsTranslation['sk'] = {
  'tabName': 'R',
  'speedsHeadline': 'Farby segmentov podľa rýchlostí',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">České fórum</a>',
  'author': 'Autor: <a href="https://www.waze.com/cs/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
  'version': 'Verzia:',
  'invertSpeedsTitle': 'Invertovať farby rýchlostí',
  'invertSpeedsContent': 'Zvýrazní iba segmenty bez rýchlosti (červená)',
  'noSpeedsSegmentsTitle': 'Nezjazdné segmenty s rýchlosťou',
  'noSpeedsSegmentsContent': 'Zvýrazní nezjazdné segmenty s rýchlosťami (ružová)',
  'noSpeedsSegmentsOtherTitle': 'Inak zjazdné segmenty s rýchlosťou',
  'noSpeedsSegmentsOtherContent': 'Zvýrazní inak zjazdné segmenty s rýchlosťami (ružová)',
  'transparentColorsTitle': 'Priehľadné farby',
  'transparentColorsContent': 'Spriehľadniť farby rýchlostí',
  'unverifiedSegmentsTitle': 'Nepotvrdené rýchlosti na segmentoch',
  'unverifiedSegmentsContent': 'Zvýrazniť nepotvrdené rýchlosti na segmentoch',
  'scriptName': 'WME Speeds',
  'layerName': 'Rýchlosti',
};

//  en translation
wmeSpeedsTranslation['en'] = {
  'tabName': 'S',
  'speedsHeadline': 'Colors by speed',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
  'author': 'Author: <a href="https://www.waze.com/cs/user/editor/martinkolar" target="_blank">martinkolar (CZ)</a>',
  'version': 'Version:',
  'invertSpeedsTitle': 'Invert speed',
  'invertSpeedsContent': 'Highlight segments without set speed (red)',
  'noSpeedsSegmentsTitle': 'Non-drivable segments with speeds',
  'noSpeedsSegmentsContent': 'Highlight non-drivable segments with set speed (pink)',
  'noSpeedsSegmentsOtherTitle': 'Other-drivable segments with speeds',
  'noSpeedsSegmentsOtherContent': 'Highlight other-drivable segments with set speed (pink)',
  'transparentColorsTitle': 'Transparent color',
  'transparentColorsContent': 'Make speed\'s colors transparent',
  'unverifiedSegmentsTitle': 'Highlight unverified segments',
  'unverifiedSegmentsContent': 'Highlight unverified segments',
  'scriptName': 'WME Speeds',
  'layerName': 'Speeds',
};

//  Heb translation
wmeSpeedsTranslation['he'] = {
  'tabName': 'S',
  'speedsHeadline': 'מקרא מהירויות לפי צבעים',
  'forumLink': '<a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">English discussion</a>',
  'author': 'יוצר התוסף: martinkolar (CZ)',
  'version': 'גרסא:',
  'invertSpeedsTitle': 'הפוך מהירות',
  'invertSpeedsContent': 'הדגש מקטעים ללא מהירות מוגדרת (אדום)',
  'noSpeedsSegmentsTitle': 'מקטעים שאינם ניתנים לנהיגה עם מהירות מוגדרת',
  'noSpeedsSegmentsContent': 'הדגש מקטעים שאינם ניתנים לנהיגה עם מהירות מוגדרת (ורוד)',
  'noSpeedsSegmentsOtherTitle': 'אחר- מקטעים המותרים לנהיגה עם מהירות מוגדרת',
  'noSpeedsSegmentsOtherContent': 'הדגש מקטעים המותרים לנהיגה עם מהירות מוגדרת (ורוד)',
  'transparentColorsTitle': 'מצב שקיפות',
  'transparentColorsContent': 'הפעל מצב שקיפות צבעי מהירויות',
  'unverifiedSegmentsTitle': 'הדגש מקטעים לא מאומתים',
  'unverifiedSegmentsContent': 'הדגש מקטעים לא מאומתים',
  'scriptName': 'WME Speeds',
  'layerName': 'מהירויות',
};

//  pl translation
wmeSpeedsTranslation['pl'] = {
  'scriptName': 'WME Speeds',
  'layerName': 'Ograniczenia prękości',
  'tabName': 'P',
  'speedsHeadline': 'Kolory ograniczeń prędkości',
  'forumLink': 'Forum: <a href="https://www.waze.com/forum/viewtopic.php?f=819&t=166497" target="_blank">angielskie</a> | <a href="https://www.waze.com/forum/viewtopic.php?f=22&t=166406" target="_blank">czeskie</a>',
  'author': 'Autor: <a href="https://www.waze.com/cs/user/editor/martinkolar" target="_blank">martinkolar (4)</a>',
  'version': 'Wersja:',
  'invertSpeedsTitle': 'Inwersja kolorów',
  'invertSpeedsContent': 'Zaznacza drogi bez ustawionych ograniczeń prędkości (czerwony)',
  'noSpeedsSegmentsTitle': 'Nieprzejezdne drogi z prędkościami',
  'noSpeedsSegmentsContent': 'Zaznacza nieprzejezdne drogi z ustawionymi ograniczeniami prędkości (różowy)',
  'noSpeedsSegmentsOtherTitle': 'Inne przejezdne drogi z prędkościami',
  'noSpeedsSegmentsOtherContent': 'Zaznacza inne przejezdne drogi z ustawionymi ograniczeniami prędkości (różowy)',
  'transparentColorsTitle': 'Przeźroczyste kolory',
  'transparentColorsContent': 'Przeźroczyste kolory ograniczeń',
  'unverifiedSegmentsTitle': 'Niezweryfikowane prędkości',
  'unverifiedSegmentsContent': 'Wyróżnia segmenty z niezweryfikowanymi ograniczeniami prędkości',
};

/* =========================================================================== */
function highlightSpeedsSegments(event) {
  wmeSpeedsInvertSpeedsColors = getId('_wmeSpeedsInvert').checked;
  wmeSpeedsNonDrivableSpeedsColors = getId('_wmeSpeedsNonDrivable').checked;
  wmeSpeedsOtherDrivableSpeedsColors = getId('_wmeSpeedsOtherDrivable').checked;
  wmeSpeedsTransparentColors = getId('_wmeSpeedsTransparentColors').checked;
  wmeSpeedsUnverified = getId('_wmeSpeedsUnverifed').checked;
  wmeSpeedsHighlightOneWay = false;

  if (wmeSpeedsLayer.getVisibility()) {

    var speedDiv = wmeSpeedsMiles ? 5 : 10;
    var maxSpeed = wmeSpeedsMiles ? wmeSpeedsMaxMphSpeed : wmeSpeedsMaxSpeed;
    var speedsColors = wmeSpeedsMiles ? wmeSpeedsColorsMph : wmeSpeedsColors;
    var speedOpacity = wmeSpeedsTransparentColors ? 0.5 : 1;
    var speedValue = wmeSpeedsMiles ? kmphToMph : function (x) { return x; };

    var features = [];

    for (var seg in Waze.model.segments.objects) {
      var segment = Waze.model.segments.get(seg);

      if (!isOnScreen(segment)) {
        continue;
      }

      var attributes = segment.attributes;
      var roadType = attributes.roadType;

      if ((wmeSpeedsNonDrivableSpeedsColors && wmeSpeedsNonDrivableSegments.indexOf(roadType) != -1) ||
          (wmeSpeedsOtherDrivableSpeedsColors && wmeSpeedsOtherDrivableSegments.indexOf(roadType) != -1)) {
        if (typeof attributes.fwdMaxSpeed == 'number' || typeof attributes.revMaxSpeed == 'number') {
          features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
              strokeColor: "#DC0073",
              strokeWidth: 8,
              strokeOpacity: speedOpacity
            }));
        }
        continue;
      }

      var speed1 = { index: 0, allow: attributes.fwdDirection, unverified: attributes.fwdMaxSpeedUnverified };
      var speed2 = { index: 0, allow: attributes.revDirection, unverified: attributes.revMaxSpeedUnverified };

      if (!speed1.allow && !speed2.allow) {
        continue;
      }

      if (speed1.allow && typeof attributes.fwdMaxSpeed == 'number') {
        speed1.value = speedValue(attributes.fwdMaxSpeed);
        speed1.exact = (speed1.value % speedDiv) === 0;

        if (speed1.value >= maxSpeed) {
          speed1.index = Math.ceil(maxSpeed / speedDiv);
        }
        else {
          speed1.index = Math.ceil(speed1.value / speedDiv);
        }
      }

      if (speed2.allow && typeof attributes.revMaxSpeed == 'number') {
        speed2.value = speedValue(attributes.revMaxSpeed);
        speed2.exact = (speed2.value % speedDiv) === 0;

        if (speed2.value >= maxSpeed) {
          speed2.index = Math.ceil(maxSpeed / speedDiv);
        }
        else {
          speed2.index = Math.ceil(speed2.value / speedDiv);
        }
      }

      speed1.color = speedsColors[speed1.index];
      speed2.color = speedsColors[speed2.index];

      if (!wmeSpeedsInvertSpeedsColors && ((speed1.index === 0  && speed2.index === 0) || (!speed2.allow && speed1.index === 0) || (!speed1.allow && speed2.index === 0))) {
        continue;
      }

      if (wmeSpeedsInvertSpeedsColors && ((speed1.index === 0  && speed2.index === 0) || (!speed2.allow && speed1.index === 0) || (!speed1.allow && speed2.index === 0))) {
        features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
            strokeColor: "#ff0000",
            strokeWidth: 8,
            strokeOpacity: speedOpacity
          }));
        continue;
      }

      if (wmeSpeedsInvertSpeedsColors) {
        continue;
      }

      if (wmeSpeedsHighlightOneWay && ((!attributes.fwdDirection && typeof attributes.fwdMaxSpeed == 'number') || (!attributes.revDirection && typeof attributes.revMaxSpeed == 'number'))) {
        features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
            strokeColor: attributes.fwdDirection ? "#ffffff" : "#999999",
            strokeDashstyle: "15 15",
            strokeWidth: 8,
            strokeOpacity: speedOpacity
          }));
        continue;
      }

      var oneSpeed = null;

      if (speed1.allow && speed2.allow) {
        if (speed1.index === 0 || speed2.index === 0) {
          features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
              strokeColor: "#ff00ff",
              strokeWidth: 8,
              strokeOpacity: speedOpacity
            }));
          continue;
        }

        if ((speed1.index == speed2.index) && (speed1.exact === speed2.exact) &&
            (!wmeSpeedsUnverified || (speed1.unverified === speed2.unverified))) {
          oneSpeed = speed1;
        }
      }
      else if (speed1.allow) {
        oneSpeed = speed1;
      }
      else if (speed2.allow) {
        oneSpeed = speed2;
      }

      if (oneSpeed !== null) {
        if (wmeSpeedsUnverified && oneSpeed.unverified) {
          features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
              strokeColor: oneSpeed.color,
              strokeDashstyle: "1 14",
              strokeLinecap: "round",
              strokeWidth: 8,
              strokeOpacity: speedOpacity
            }));
        }
        else {
          features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
              strokeColor: oneSpeed.color,
              strokeDashstyle: oneSpeed.exact ? "none" : "4 1",
              strokeLinecap: oneSpeed.exact ? "round" : "butt",
              strokeWidth: 8,
              strokeOpacity: speedOpacity
            }));
        }
        continue;
      }

      if ((attributes.fwdDirection && attributes.fwdMaxSpeed == 126) || (attributes.revDirection && attributes.revMaxSpeed == 126)) {
        features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
            strokeColor: "#ff00ff",
            strokeWidth: 8,
            strokeOpacity: speedOpacity
          }));
        continue;
      }

      // draw two speeds

      var speed1Dotted = speed1.allow && wmeSpeedsUnverified && speed1.unverified;
      var speed2Dotted = speed2.allow && wmeSpeedsUnverified && speed2.unverified;

      if (speed1.allow) {
          if (speed1Dotted) {
            features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
                strokeColor: speed1.color,
                strokeDashstyle: speed2Dotted ? "1 14" : "1 29",
                strokeLinecap: "round",
                strokeWidth: 8,
                strokeOpacity: speedOpacity
              }));
          }
          else {
            features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
                strokeColor: speed1.color,
                //strokeDashstyle: speed1.exact ? "15 15" : "4 1 4 1 4 1 0 15",
                //strokeDashstyle: speed1.exact ? "0 8 15 7" : "0 8 4 1 4 1 4 1 0 7",
                strokeDashstyle: speed1.exact ? (speed2Dotted ? "0 8 15 7" : "15 15") : (speed2Dotted ? "0 8 4 1 4 1 4 1 0 7" : "4 1 4 1 4 1 0 15"),
                strokeLinecap: "butt",
                strokeWidth: 8,
                strokeOpacity: speedOpacity
              }));
          }
      }

      if (speed2.allow) {
          if (speed2Dotted) {
            features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
                strokeColor: speed2.color,
                strokeDashstyle: "1 29",
                strokeLinecap: "round",
                strokeWidth: 8,
                strokeOpacity: speedOpacity
              }));
          }
          else {
            features.push(new OpenLayers.Feature.Vector(segment.geometry.clone(), {}, {
                strokeColor: speed2.color,
                //strokeDashstyle: speed2.exact ? "0 15 15 0" : "0 15 4 1 4 1 4 1",
                //strokeDashstyle: speed2.exact ? (speed1Dotted ? "0 8 15 7" : "8 15 7 0") : (speed1Dotted ? "0 8 4 1 4 1 4 1 0 7" : "3 1 4 15 4 1 2 0"),
                strokeDashstyle: speed2.exact ? (speed1Dotted ? "0 8 15 7" : "0 15 15 0") : (speed1Dotted ? "0 8 4 1 4 1 4 1 0 7" : "0 15 4 1 4 1 4 1"),
                strokeLinecap: "butt",
                strokeWidth: 8,
                strokeOpacity: speedOpacity
              }));
          }
      }

    } // end of loop

    wmeSpeedsLayer.removeAllFeatures();
    wmeSpeedsLayer.addFeatures(features);
  }
} // end of function

function makeSpeedsTab() {
  var addon = document.createElement('section');

  addon.innerHTML += '<h3 style="margin-bottom: 5px;">' + fe_t('speedsHeadline') + '</h3>';

  function optionHtml(id, title_t, content_t) {
    return '<label title="' + fe_t(content_t) + '"><input id="' + id + '" type="checkbox"/>' + fe_t(title_t) + '</label><br>';
  }

  addon.innerHTML += optionHtml("_wmeSpeedsInvert", 'invertSpeedsTitle', 'invertSpeedsContent');
  addon.innerHTML += optionHtml("_wmeSpeedsNonDrivable", 'noSpeedsSegmentsTitle', 'noSpeedsSegmentsContent');
  addon.innerHTML += optionHtml("_wmeSpeedsOtherDrivable", 'noSpeedsSegmentsOtherTitle', 'noSpeedsSegmentsOtherContent');
  addon.innerHTML += optionHtml("_wmeSpeedsTransparentColors", 'transparentColorsTitle', 'transparentColorsContent');
  addon.innerHTML += optionHtml("_wmeSpeedsUnverifed", 'unverifiedSegmentsTitle', 'unverifiedSegmentsContent');

  var speedsForTab = wmeSpeedsMiles ? wmeSpeedsColorsMph : wmeSpeedsColors;

  addon.innerHTML += '<div style="margin-top: 10px;"></div>';

  for (i = 1; i < speedsForTab.length; i++) {
    var actualSpeedForTab;
    if ((i+1) == speedsForTab.length) {
      if (wmeSpeedsMiles) {
        actualSpeedForTab = ' &gt; ' + wmeSpeedsMaxMphSpeed + '&nbsp;mph';
      }
      else {
        actualSpeedForTab = ' &gt; ' + wmeSpeedsMaxSpeed + '&nbsp;km/h';
      }
    }
    else if (wmeSpeedsMiles) {
      actualSpeedForTab = (i * 5) + '&nbsp;mph';
    }
    else {
      actualSpeedForTab = (i * 10) + '&nbsp;km/h';
    }

    addon.innerHTML += '<div style="width: 28%; float: left;background-color: ' + speedsForTab[i] + ';padding:2px 0;border-radius:5px;color:' + getContrastColor(speedsForTab[i]) + ';font-size:14px;text-align:center;margin: 0 3px 3px;">' + actualSpeedForTab + '</div>';
  }

  addon.innerHTML += '<p style="font-size:11px;margin-top:15px;clear:both;">' + fe_t('forumLink') + '<br>' + fe_t('author') + '<br>' + fe_t('version') + ' ' + wmeSpeedsVersion + '</p>';

  var userTabs = getId('user-info');
  var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  var tabContent = getElementsByClassName('tab-content', userTabs)[0];

  newtab = document.createElement('li');
  newtab.innerHTML = '<a title="WME Speeds" href="#sidepanel-wme-speeds" data-toggle="tab"><img src="data:image/png;base64,' + wmeSpeedsTabIcon + '" width="16" height="16" style="margin-top: -2px;">&nbsp;' + /*fe_t('tabName') +*/ '</a>';
  navTabs.appendChild(newtab);

  addon.id = "sidepanel-wme-speeds";
  addon.className = "tab-pane";
  tabContent.appendChild(addon);
}

/* helper function */
function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getId(node) {
  return document.getElementById(node);
}

function changeLayer() {
  localStorage.DrawSegmentSpeeds = wmeSpeedsLayer.getVisibility();
    
  if (wmeSpeedsLayer.getVisibility()) {
    highlightSpeedsSegments();
  } else {
    wmeSpeedsLayer.removeAllFeatures();
  }
}

function kmphToMph(kmph) {
  return Math.round(kmph * wmeSpeedsKmphToMphRatio);
}

function fe_t(name, params) { //  function for translation
  if (typeof params === 'object') {
    returnString = wmeSpeedsTranslation[wmeSpeedsLanguage][name];

    for (var i in params) {
      do {
        returnString = returnString.replace('{' + i + '}', params[i]);
      } while (returnString.indexOf('{' + i + '}') !== -1);
    }

    return returnString;
  }
  else {
    return wmeSpeedsTranslation[wmeSpeedsLanguage][name];
  }
}

function isOnScreen(segment) {
  var e = Waze.map.getExtent();
  var eg = e.toGeometry();
  return eg.intersects(segment.geometry);
}

function getContrastColor(hex_color) {
  var r = parseInt(hex_color.substr(1, 2), 16);
  var g = parseInt(hex_color.substr(3, 2), 16);
  var b = parseInt(hex_color.substr(5, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

/* =========================================================================== */
function initialiseSpeedsHighlights() {
  if (wmeSpeedsInit) {
    return ;
  }

  // init shortcuts

  if (typeof(Waze) === 'undefined') {
    console.log("WME Speeds: Waze : NOK");
    setTimeout(initialiseSpeedsHighlights, 500);
    return ;
  }

  if (!Waze.map) {
      window.console.log("WME Speeds: waiting for WME...");
      setTimeout(initialiseSpeedsHighlights, 555);
      return ;
  }

  if (typeof(OpenLayers) === 'undefined') {
    console.log("WME Speeds: OpenLayers : NOK");
    setTimeout(initialiseSpeedsHighlights, 500);
    return ;
  }

  if (wmeSpeedsTranslation[I18n.locale] != null) {
    wmeSpeedsLanguage = I18n.locale;
  }

  userInfo = getId('user-info');
  if (typeof getElementsByClassName('nav-tabs', userInfo)[0] === 'undefined') {
    setTimeout(initialiseSpeedsHighlights, 500);
    return ;
  }

  wmeSpeedsLayer = new OpenLayers.Layer.Vector(fe_t('layerName'), {
    displayInLayerSwitcher: true,
    uniqueName: "__DrawSegmentSpeeds"
  });

  I18n.translations.en.layers.name["__DrawSegmentSpeeds"] = fe_t('scriptName');
  Waze.map.addLayer(wmeSpeedsLayer);

  if (localStorage.DrawSegmentSpeeds) {
    wmeSpeedsLayer.setVisibility(localStorage.DrawSegmentSpeeds == "true");
  } else {
    wmeSpeedsLayer.setVisibility(true);
  }

  // begin periodic updates
  //window.setInterval(highlightSpeedsSegments,333);

  // trigger code when page is fully loaded, to catch any missing bits
  window.addEventListener("load", function(e) {
    var mapProblems = getId('map-problems-explanation');
    if (mapProblems !== null) mapProblems.style.display = "none";
  });

  if (Waze.model.isImperial) {
    wmeSpeedsMiles = true;
  }

  // register some events...
  Waze.map.events.register("zoomend", null, highlightSpeedsSegments);
  Waze.map.events.register("changelayer", null, changeLayer);

  //Waze.map.events.register("movestart", null, highlightSpeedsSegments);
  //Waze.map.events.register("move", null, highlightSpeedsSegments);
  Waze.map.events.register("moveend", null, highlightSpeedsSegments);

  Waze.map.baseLayer.events.register("loadend", null, highlightSpeedsSegments);

  Waze.model.events.register("mergeend", null, highlightSpeedsSegments);

  //Waze.vent.on("operationPending", highlightSpeedsSegments);
  Waze.vent.on("operationDone", highlightSpeedsSegments);

  wmeSpeedsInit = true;

  makeSpeedsTab();

  // restore saved settings
  if (localStorage.WMESpeedsScript) {
    console.log("WME Speeds: Loading Options");
    options = JSON.parse(localStorage.WMESpeedsScript);

    getId('_wmeSpeedsInvert').checked = options[1];
    getId('_wmeSpeedsNonDrivable').checked = options[2];
    getId('_wmeSpeedsOtherDrivable').checked = options[3];
    getId('_wmeSpeedsTransparentColors').checked = options[4];
    getId('_wmeSpeedsUnverifed').checked = options[5];
  }

  // overload the WME exit function
  saveWmeSpeedsOptions = function() {
    if (localStorage) {
      console.log("WME Speeds: Saving Options");
      var options = [];

      // preserve previous options which may get lost after logout
      if (localStorage.WMESpeedsScript) {
        options = JSON.parse(localStorage.WMESpeedsScript);
      }

      options[1] = getId('_wmeSpeedsInvert').checked;
      options[2] = getId('_wmeSpeedsNonDrivable').checked;
      options[3] = getId('_wmeSpeedsOtherDrivable').checked;
      options[4] = getId('_wmeSpeedsTransparentColors').checked;
      options[5] = getId('_wmeSpeedsUnverifed').checked;

      localStorage.WMESpeedsScript = JSON.stringify(options);
    }
  };
  //  save options
  window.addEventListener("beforeunload", saveWmeSpeedsOptions, false);

  getId('_wmeSpeedsInvert').onclick = highlightSpeedsSegments;
  getId('_wmeSpeedsNonDrivable').onclick = highlightSpeedsSegments;
  getId('_wmeSpeedsOtherDrivable').onclick = highlightSpeedsSegments;
  getId('_wmeSpeedsTransparentColors').onclick = highlightSpeedsSegments;
  getId('_wmeSpeedsUnverifed').onclick = highlightSpeedsSegments;

  //initial highlight
  highlightSpeedsSegments();
}

/* engage! =================================================================== */
initialiseSpeedsHighlights();

})();
/* end ======================================================================= */