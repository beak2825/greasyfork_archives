// ==UserScript==
// @name         WoD 显示技能骰[中文]
// @namespace    com.dobydigital.userscripts.wod
// @description  Calculates skill rolls, and adds a new table column on the skills page.
// @author       XaeroDegreaz
// @home         https://github.com/XaeroDegreaz/world-of-dungeons-userscripts
// @supportUrl   https://github.com/XaeroDegreaz/world-of-dungeons-userscripts/issues
// @source       https://raw.githubusercontent.com/XaeroDegreaz/world-of-dungeons-userscripts/main/src/display-skill-rolls.user.js
// @match        *://*.world-of-dungeons.org/wod/spiel/hero/skills*
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM.xmlHttpRequest
// @modifier     Christophero
// @version      2023.01.08.1
// @downloadURL https://update.greasyfork.org/scripts/520630/WoD%20%E6%98%BE%E7%A4%BA%E6%8A%80%E8%83%BD%E9%AA%B0%5B%E4%B8%AD%E6%96%87%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/520630/WoD%20%E6%98%BE%E7%A4%BA%E6%8A%80%E8%83%BD%E9%AA%B0%5B%E4%B8%AD%E6%96%87%5D.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const loadHeroAttributes = async () => {
    return await new Promise((resolve) => {
      GM.xmlHttpRequest({
        url: "/wod/spiel/hero/attributes.php",
        synchronous: false,
        onload: (data) => {
          resolve(parseHeroAttributes(data));
        },
      });
    });
  };

  const parseHeroAttributes = (data) => {
    const jq = $(data.responseText);
    const attributesTable = jq.find("table[class=content_table]").first();
    if (!attributesTable.length) {
      console.error("NOPE.", attributesTable);
      return;
    }
    const attributeRows = $(attributesTable).find("tr[class^=row]");
    const rawRows = attributeRows
      .map(function () {
        const cells = $(this).find("> td");
        const attributeName = cells.first().text().trim();
        const valueCell = cells
          .find(":nth-child(2)")
          .contents()
          .filter(function () {
            return this.nodeType == 3;
          })
          .text()
          .trim();
        const effectiveValueCell = cells
          .find(":nth-child(2) > span[class=effective_value]")
          .text()
          .trim()
          .replace(/\D/g, "");
        return { attributeName, valueCell, effectiveValueCell };
      })
      .toArray();
    const retVal = {};
    rawRows.forEach((x) => {
      retVal[x.attributeName] =
        x.effectiveValueCell.length > 0
          ? Number(x.effectiveValueCell)
          : Number(x.valueCell);
    });
    return retVal;
  };

  const parseAttackRolls = (data) => {
    //console.log("ABC",data);
    const jq = $(data);
    const markers = jq
      .find("li")
      .map(function () {
        const match =
          /^(?<rollType>.+)公式为：(?<rollCalculation>.+?)( \((?<modifier>[+\-]\d*%?)\))?$/g.exec(
            $(this).text()
          );
        if (!match) {
          return;
        }
        //console.log( "match",{match} );
        // @ts-ignore
        const { rollType, rollCalculation, modifier } = match.groups;
        //console.log( "meeee",{rollType, rollCalculation, modifier} );
        return { rollType, rollCalculation, modifier };
      })
      .toArray();
    //console.log( {markers} );
    return markers;
  };

  function calculateSkillRoll(
    heroAttributes,
    skillName,
    skillLevel,
    rollCalculation,
    modifier
  ) {
    //console.log(1,{heroAttributes, skillName, skillLevel, rollCalculation, modifier} );
    let replaced = rollCalculation.replaceAll(skillName, skillLevel).trim();
    //console.log(replaced);
    Object.keys(heroAttributes).forEach((key) => {
      replaced = replaced.replaceAll(key, heroAttributes[key]);
    });
    replaced = replaced.replaceAll("×", "*");
    replaced = replaced.replaceAll("÷", "/");
    replaced = replaced.replaceAll("２", "2");
    replaced = replaced.replaceAll("３", "3");
    replaced = replaced.replaceAll("＋", "+");
    console.log({ replaced });
    const roll = eval(replaced);
    const modifierAsNumber = Number(modifier?.replaceAll(/\D/g, ""));
    const modifierAsFraction = modifierAsNumber / 100;
    const rollWithModifier = modifier
      ? modifier.endsWith("%")
        ? modifier.startsWith("+")
          ? roll * (1 + modifierAsFraction)
          : roll * (1 - modifierAsFraction)
        : modifier.startsWith("+")
        ? roll + modifierAsNumber
        : roll - modifierAsNumber
      : roll;
    //console.log( {rollWithModifier} );
    return Math.floor(rollWithModifier);
  }

  const storage = window.localStorage;
  const SKILL_ROLLS_STORAGE_KEY =
    "com.dobydigital.userscripts.wod.displayskillrolls.skillrollslist";
  //console.log(123123,storage);
  function load(key) {
    try {
      const raw = storage?.getItem(key);
      return raw ? JSON.parse(raw) : undefined;
    } catch (e) {
      console.error(
        `Hero Selector Dropdown Userscript: Unable to load key:${key}`,
        e
      );
      return undefined;
    }
  }

  function save(key, value) {
    try {
      storage?.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(
        `Hero Selector Dropdown Userscript: Unable to save key:${key}`,
        e
      );
    }
  }

  function remove(key) {
    try {
      storage?.removeItem(key);
    } catch (e) {
      console.error(
        `Hero Selector Dropdown Userscript: Unable to remove key:${key}`,
        e
      );
    }
  }

  const main = async () => {
    // add button to remove skill roll data
    $('<button class="button clickable">清除技能骰缓存</button>')
      .insertBefore('input[name="hide_all"]')
      .click(function () {
        remove(SKILL_ROLLS_STORAGE_KEY);
        alert("技能骰缓存已清除");
      });

    const contentTable = $("table[class=content_table]");
    const body = $(contentTable).find("> tbody");
    const header = $(body).find("> tr[class=header]");
    $(header).append("<th>Base Rolls</th>");
    const skillRows = $(body).find("tr[class^=row]");
    $(skillRows).each(async function () {
      const a = $(this).find("a");
      //# Re-align the skill name cell so the text doesn't look inconsistent when injecting attack rolls
      $(a).parent().attr("valign", "center");
      $(this).append('<td class="roll_placeholder">-</td>');
    });
    const heroAttributes = await loadHeroAttributes();
    const shortAttributes = heroAttributes;
    const skillRollData = load(SKILL_ROLLS_STORAGE_KEY) || {};
    //console.log( {heroAttributes, shortAttributes, skillRollData} );
    //console.log( {header} );
    // # begin parsing rows
    $(skillRows).each(async function () {
      const row = $(this);
      $(row)
        .find("input[type=image]")
        .click(async function () {
          await renderRollData($(row), skillRollData, shortAttributes);
        });
      await renderRollData($(row), skillRollData, shortAttributes);
    });
  };

  const renderRollData = async (row, skillRollData, shortAttributes) => {
    //console.log( "rendering")
    const a = $(row).find("a");
    const skill = $(a).text();
    const link = $(a).attr("href");
    //console.log( {skill, link} );
    const baseLevel = $(row).find("div[id^=skill_rang_]").text().trim();
    const effectiveLevel = $(row)
      .find("span[id^=skill_eff_rang_]")
      .text()
      .replace(/\D/g, "")
      .trim();
    const skillLevel =
      effectiveLevel.length > 0 ? Number(effectiveLevel) : Number(baseLevel);
    if (!skillLevel) {
      return;
    }

    if (!skillRollData?.[skill]) {
      const skillData = await new Promise((resolve) => {
        GM.xmlHttpRequest({
          url: link,
          synchronous: false,
          onload: (data) => {
            resolve(data.responseText);
          },
        });
      });
      //console.log('qqqq',skillData);
      skillRollData[skill] = parseAttackRolls(skillData);
      save(SKILL_ROLLS_STORAGE_KEY, skillRollData);
    }
    //console.log( "data", skillRollData[skill] );
    if (skillRollData[skill].length === 0) {
      return;
    }
    const formatted = skillRollData[skill].map((x) => {
      return {
        rollType: x.rollType,
        rollValue: calculateSkillRoll(
          shortAttributes,
          skill,
          skillLevel,
          x.rollCalculation,
          x.modifier
        ),
        rollCalculation: x.rollCalculation,
        modifier: x.modifier,
      };
    });
    //console.log( {formatted} );
    $(row)
      .find("td[class=roll_placeholder]")
      .replaceWith(
        `<td class="roll_placeholder"><table width="100%"><tbody>${formatted
          .map((x) => {
            const modifierString = x.modifier ? `<b>(${x.modifier})</b>` : "";
            return `<tr onmouseover="return wodToolTip(this, '<b>${x.rollType}</b>: ${x.rollCalculation} ${modifierString}');">
                            <td align="left">
                                ${x.rollType}
                            </td>
                            <td align="right">
                                ${x.rollValue}
                            </td>
                            <td align="right">
                                <img alt="" border="0" src="/wod/css//skins/skin-8/images/icons/inf.gif">
                            </td>
                        </tr>`;
          })
          .join("")}</tbody></table></td>`
      );
  };

  await main();
})();
