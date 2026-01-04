// ==UserScript==
// @name         MWI-Equipment-Diff
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Make life easier
// @author       BKN46
// @match        https://*.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537282/MWI-Equipment-Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/537282/MWI-Equipment-Diff.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  let selfData = {};
 
  const colors = {
    info: 'rgb(0, 108, 158)',
    smaller: 'rgb(199, 21, 21)',
    greater: 'rgb(23, 151, 12)',
  };
  let equipmentToDiff = {};
  const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh");
  let isZH = isZHInGameSetting;
 
  function transZH(zh) {
    if (isZH) return zh;
    return {
      "战斗风格": "Combat Style",
      "伤害类型": "Damage Type",
      "自动攻击伤害": "Auto Attack Damage",
      "攻击速度": "Attack Speed",
      "攻击间隔": "Attack Interval",
      "暴击率": "Critical Rate",
      "暴击伤害": "Critical Damage",
      "技能急速": "Ability Haste",
      "施法速度": "Cast Speed",
 
      "刺击精准度": "Stab Accuracy",
      "刺击伤害": "Stab Damage",
      "斩击精准度": "Slash Accuracy",
      "斩击伤害": "Slash Damage",
      "钝击精准度": "Smash Accuracy",
      "钝击伤害": "Smash Damage",
      "远程精准度": "Ranged Accuracy",
      "远程伤害": "Ranged Damage",
      "魔法精准度": "Magic Accuracy",
      "魔法伤害": "Magic Damage",
 
      "物理增幅": "Physical Amplify",
      "火系增幅": "Fire Amplify",
      "水系增幅": "Water Amplify",
      "自然系增幅": "Nature Amplify",
      "护甲穿透": "Armor Penetration",
      "火系穿透": "Fire Penetration",
      "水系穿透": "Water Penetration",
      "自然系穿透": "Nature Penetration",
    }[zh] || zh;
  }
 
  function parseEquipmentModal(element) {
    const equipmentDetail = {};
    const detailLines = element.querySelectorAll('.EquipmentStatsText_stat__27Sus');
    for (const line of detailLines) {
      if (line.querySelector('.EquipmentStatsText_uniqueStat__2xvqX')) continue;
      const data = line.textContent.split(':');
      if (data.length === 2) {
        const key = data[0].trim();
        const value = data[1].split('(')[0].trim();
        if (value === 'N/A') continue;
        equipmentDetail[key] = value;
      }
    }
 
    if (!element.querySelector('.diff-tooltip')) {
      const diffTooltip = document.createElement('div');
      diffTooltip.className = 'diff-tooltip';
      diffTooltip.textContent = isZH ? '按\'d\'来添加作为对比对象' : 'Press "d" to add to quick diff';
      diffTooltip.style = `color: ${colors.info}; font-weight: bold;`;
      element.appendChild(diffTooltip);
 
      if (equipmentToDiff.data) {
        const diffRemoveTooltip = document.createElement('div');
        diffRemoveTooltip.className = 'diff-remove-tooltip';
        diffRemoveTooltip.textContent = isZH ? '按\'r\'来移除当前对比' : 'Press "r" to remove present quick diff';
        diffRemoveTooltip.style = `color: ${colors.info}; font-weight: bold;`;
        element.appendChild(diffRemoveTooltip);
      }
    }
    
    return equipmentDetail;
  }
 
 
  // #region Diff Modal
  function addDiffToModal(element, data, price) {
    if (element.querySelector('.diff-value') || element.querySelector('.diff-header')) return;
    const parentArea = element.querySelector('.EquipmentStatsText_equipmentStatsText__djKBS');
    const TextArea = parentArea.firstChild;
 
    const diffMap = {};
    const detailLines = element.querySelectorAll('.EquipmentStatsText_stat__27Sus');
    for (const line of detailLines) {
      const key = line.textContent.split(':')[0].trim();
      const valueElement = line.querySelectorAll('span')[1];
      const diffSpan = document.createElement('span');
      diffSpan.className = 'diff-value';
      if (key in equipmentToDiff.data) {
        const diffValue = equipmentToDiff.data[key];
        if (data[key] === diffValue) {
          continue;
        }
        const diff = strDiff(diffValue, data[key]);
        diffMap[key] = diff;
        diffSpan.textContent = ` (${diff})`;
        let color = colors.info;
        if (data[key].endsWith('s')) {
          color = diff.startsWith('-') ? colors.greater : colors.smaller;
        } else {
          color = diff.startsWith('-') ? colors.smaller : colors.greater;
        }
        diffSpan.style = `color: ${color}; font-weight: bold;`;
        valueElement.appendChild(diffSpan);
      } else if (valueElement) {
        diffSpan.textContent = ` (${valueElement.textContent})`;
        // diffMap[key] = valueElement.textContent.startsWith('-') ? valueElement.textContent.replace('-', '') : `-${valueElement.textContent}`;
        diffMap[key] = valueElement.textContent;
        const color = valueElement.textContent.startsWith('-') ? colors.smaller: colors.greater;
        diffSpan.style = `color: ${color}; font-weight: bold;`;
        valueElement.appendChild(diffSpan);
      } else { // special ability on equipment
        // diffSpan.textContent = ` (N/A)`;
        // diffSpan.style = `color: ${colors.smaller}; font-weight: bold;`;
        // line.appendChild(diffSpan);
      }
    }
    for (const key in equipmentToDiff.data) {
      if (!(key in data)) {
        const newLine = document.createElement('div');
        newLine.className = 'EquipmentStatsText_stat__27Sus';
 
        const keySpan = document.createElement('span');
        keySpan.textContent = `${key}: `;
        newLine.appendChild(keySpan);
 
        const valueSpan = document.createElement('span');
        valueSpan.textContent = 'N/A';
        newLine.appendChild(valueSpan);
 
        const diffSpan = document.createElement('span');
        diffSpan.className = 'diff-value';
        let diffValue = '';
        if (equipmentToDiff.data[key].startsWith('-')) {
          diffValue = equipmentToDiff.data[key].replace('-', '+');
        } else if (equipmentToDiff.data[key].startsWith('+')) {
          diffValue = equipmentToDiff.data[key].replace('+', '-');
        } else {
          diffValue = `-${equipmentToDiff.data[key]}`;
        }
        diffSpan.textContent = ` (${diffValue})`;
        diffMap[key] = diffValue;
 
        const color = equipmentToDiff.data[key].startsWith('-') ? colors.greater : colors.smaller;
        diffSpan.style = `color: ${color}; font-weight: bold;`;
        valueSpan.appendChild(diffSpan);
        TextArea.appendChild(newLine);
      }
    }
 
    // #region Diff header
    if (equipmentToDiff.name) {
      const newLine = document.createElement('div');
      newLine.className = 'diff-header';
      newLine.style = 'display: flex; grid-gap: 6px; gap: 6px; justify-content: space-between;'
 
      const keySpan = document.createElement('span');
      keySpan.textContent = isZH ? '对比对象: ' : 'Compares to: ';  
      keySpan.style = `color: ${colors.info}; font-weight: bold;`;
      newLine.appendChild(keySpan);
  
      const diffTitle = document.createElement('span');
      diffTitle.textContent = equipmentToDiff.name;
      diffTitle.style = `color: ${colors.info}; font-weight: bold;`;
      newLine.appendChild(diffTitle);
      parentArea.insertBefore(newLine, TextArea);
    }
    if (price >= 0 && equipmentToDiff.price >= 0) {
      const newLine = document.createElement('div');
      newLine.className = 'diff-header';
      newLine.style = 'display: flex; grid-gap: 6px; gap: 6px; justify-content: space-between;'
 
      const keySpan = document.createElement('span');
      keySpan.textContent = isZH ? `价格差: ` : `Price diff: `;  
      keySpan.style = `color: ${colors.info}; font-weight: bold;`;
      newLine.appendChild(keySpan);
  
      const priceSpan = document.createElement('span');
      priceSpan.className = 'diff-price';
      const priceDiff = priceParse(price - equipmentToDiff.price);
      priceSpan.textContent = `${priceDiff}`;
      const priceColor = priceDiff.startsWith('-') ? colors.greater : colors.smaller;
      priceSpan.style = `color: ${priceColor}; font-weight: bold;`;
      newLine.appendChild(priceSpan);
 
      parentArea.insertBefore(newLine, TextArea);
    }
    // #region DPS diff
    if (Object.keys(diffMap).length > 0) {
      const newLine = document.createElement('div');
      newLine.className = 'diff-header';
      newLine.style = 'display: flex; grid-gap: 6px; gap: 6px; justify-content: space-between;'
 
      const keySpan = document.createElement('span');
      keySpan.textContent = isZH ? `粗略DPS变化: ` : `Rough DPS diff: `;  
      keySpan.style = `color: ${colors.info}; font-weight: bold;`;
      newLine.appendChild(keySpan);
 
      const selfType = getSelfStyleTrans();
      const originStyle = equipmentToDiff.data[transZH('战斗风格')];
      const targetStyle = data[transZH('战斗风格')];
      if ((originStyle || targetStyle) && (targetStyle != selfType || originStyle != selfType)) {
        const diffValue = document.createElement('span');
        diffValue.textContent = isZH ? '[战斗风格不一致]' : '[Different combat style]';
        diffValue.style = `color: ${colors.info}; font-weight: bold;`;
        newLine.appendChild(diffValue);
        parentArea.insertBefore(newLine, TextArea);
        return;
      }
 
      let dpsCompare = 0;
      try {
        dpsCompare = getDPSCompare(diffMap);
        const diffValue = document.createElement('span');
        diffValue.textContent = dpsCompare * 100 > 0 ? `+${(dpsCompare * 100).toFixed(3)}%` : `${(dpsCompare * 100).toFixed(3)}%`;
        const color = dpsCompare > 0 ? colors.greater : colors.smaller;
        diffValue.style = `color: ${color}; font-weight: bold;`;
        newLine.appendChild(diffValue);
      } catch (error) {
        const diffValue = document.createElement('span');
        diffValue.textContent = isZH ? '[计算过程发生错误]' : '[Error]';
        diffValue.style = `color: ${colors.info}; font-weight: bold;`;
        console.error('Equipment Diff: Error calculating DPS diff:', error);
        newLine.appendChild(diffValue);
      }
      parentArea.insertBefore(newLine, TextArea);
 
      if (dpsCompare > 0 && price >= 0 && equipmentToDiff.price >= 0 && (price - equipmentToDiff.price) > 0) {
        const priceLine = document.createElement('div');
        priceLine.className = 'diff-header';
        priceLine.style = 'display: flex; grid-gap: 6px; gap: 6px; justify-content: space-between;'
        const priceKeySpan = document.createElement('span');
        priceKeySpan.textContent = isZH ? `每10M价格DPS提升: ` : `DPS% per 10M coin: `;  
        priceKeySpan.style = `color: ${colors.info}; font-weight: bold;`;
        priceLine.appendChild(priceKeySpan);
        const dpsPriceSpan = document.createElement('span');
        dpsPriceSpan.className = 'diff-price';
        const dpsPerMil = (dpsCompare * 100) / ((price - equipmentToDiff.price) / 1e6) * 10;
        dpsPriceSpan.textContent = dpsPerMil > 0 ? `+${dpsPerMil.toFixed(5)}%` : `${dpsPerMil.toFixed(5)}%`;
        const priceColor = dpsPerMil > 0 ? colors.greater : colors.smaller;
        dpsPriceSpan.style = `color: ${priceColor}; font-weight: bold;`;
        priceLine.appendChild(dpsPriceSpan);
        parentArea.insertBefore(priceLine, TextArea);
      }
    }
  }
 
  function strDiff(s1, s2) {
    if (s1 === s2) return '';
    if (!s1 || !s2) return s1 || s2;
    let postfix = '';
    let isNeg = false;
    if (s1.endsWith('%')) postfix = '%';
    if (s1.startsWith('-')) isNeg = true;
    const proc = (t) => parseFloat(t.replace('%', '').replace(',', '').replace(' ', '').replace('+', '').replace('_', ''));
    const diff = proc(s2) - proc(s1);
    if (isNaN(diff)) return s1;
    if (diff === 0) return '';
    if (diff > 0) return `${isNeg ? '-' : '+'}${parseFloat(diff.toFixed(3))}${postfix}`;
    return `${isNeg ? '+' : '-'}${parseFloat(Math.abs(diff).toFixed(3))}${postfix}`;
  }
 
  function hookWS() {
    const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
    const oriGet = dataProperty.get;
 
    dataProperty.get = hookedGet;
    Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
 
    function hookedGet() {
        const socket = this.currentTarget;
        if (!(socket instanceof WebSocket)) {
            return oriGet.call(this);
        }
        if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
            return oriGet.call(this);
        }
 
        const message = oriGet.call(this);
        Object.defineProperty(this, "data", { value: message }); // Anti-loop
 
        try {
            return handleMessage(message);
        } catch (error) {
            console.log("Error in handleMessage:", error);
            return message;
        }
    }
  }
  hookWS();
 
  function handleMessage(message) {
    if (typeof message !== "string") {
        return message;
    }
    try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage && parsedMessage.type === "init_character_data") {
            selfData = parsedMessage;
        }
    } catch (error) {
        console.log("Error parsing message:", error);
    }
    return message;
  }
 
  function parsePrice(costText) {
    if (costText.endsWith('M')) {
      return parseFloat(costText.replace('M', '').replace(',', '')) * 1e6
    } else if (costText.endsWith('k')) {
      return parseFloat(costText.replace('k', '').replace(',', '')) * 1e3
    } else if (costText.endsWith('K')) {
      return parseFloat(costText.replace('K', '').replace(',', '')) * 1e3
    } else if (costText.endsWith('B')) {
      return parseFloat(costText.replace('B', '').replace(',', '')) * 1e9
    } else if (costText.endsWith('T')) {
      return parseFloat(costText.replace('T', '').replace(',', '')) * 1e12
    } else {
      return parseFloat(costText.replace(',', ''))
    }
  }
 
  function priceParse(priceNum) {
    const isNegative = priceNum < 0;
    const absValue = Math.abs(priceNum);
    let result;
    
    if (absValue >= 1e10) {
      result = parseFloat((absValue / 1e9).toFixed(3)) + 'B';
    } else if (absValue >= 1e7) {
      result = parseFloat((absValue / 1e6).toFixed(3)) + 'M';
    } else if (absValue >= 1e4) {
      result = parseFloat((absValue / 1e3).toFixed(3)) + 'K';
    } else {
      result = parseFloat(absValue.toFixed(3));
    }
    
    return isNegative ? '-' + result : '+' + result;
  }
 
  function getMWIToolsPrice(modal) {
    const enhancedPriceText = isZH ? '总成本' : 'Total cost';
    let costNodes = Array.from(modal.querySelectorAll('*')).filter(el => {
      if (!el.textContent || !el.textContent.includes(enhancedPriceText)) return false;
      return Array.from(el.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
    });
    if (costNodes.length > 0) {
      const node = costNodes[0];
      const costText = node.textContent.replace(enhancedPriceText, '').trim();
      return parsePrice(costText);
    }
 
    const normalPriceText = isZH ? '日均价' : 'Daily average price';
    costNodes = Array.from(modal.querySelectorAll('*')).filter(el => {
      if (!el.textContent || !el.textContent.includes(normalPriceText)) return false;
      return Array.from(el.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
    });
    if (costNodes.length > 0) {
      const node = costNodes[0];
      const costText = node.textContent.split('/')[0].split(' ')[1].trim();
      return parsePrice(costText);
    }
 
    return -1;
  }
 
  function getSelfStyleTrans() {
    const combatStyle = selfData?.combatUnit.combatDetails.combatStats.combatStyleHrids[0];
    return {
      '/combat_styles/stab': isZH ? '刺击' : 'Stab',
      '/combat_styles/slash': isZH ? '斩击' : 'Slash',
      '/combat_styles/smash': isZH ? '钝击' : 'Smash',
      '/combat_styles/ranged': isZH ? '远程' : 'Ranged',
      '/combat_styles/magic': isZH ? '魔法' : 'Magic',
    }[combatStyle] || combatStyle;
  }
 
  setInterval(() => {
    const modals = document.querySelectorAll('.MuiPopper-root');
    if (!modals) return;
    // compatibility with chat-enhance addon
    let equipmentDetail = null;
    let modal = null;
    for (const modal_ of modals) {
      equipmentDetail = modal_.querySelector('.ItemTooltipText_equipmentDetail__3sIHT');
      if (equipmentDetail) {
        modal = modal_;
        break
      };
    }
    if (!equipmentDetail) return;
 
    const equipmentName = modal.querySelector('.ItemTooltipText_name__2JAHA').textContent.trim();  
    const equipmentData = parseEquipmentModal(equipmentDetail);
 
    const price = getMWIToolsPrice(modal);
 
    if (equipmentToDiff.data) {
      addDiffToModal(equipmentDetail, equipmentData, price);
    }
 
    document.onkeydown = (event) => {
      if (event.key === 'd') {
        // event.preventDefault();
        console.log(`Added to quick diff: ${equipmentName}`);
        equipmentToDiff = {
          data: equipmentData,
          name: equipmentName,
          price: price,
        };
        equipmentDetail.querySelector('.diff-tooltip').textContent = isZH ? '已添加作为对比' : 'Added to quick diff';
      } else if (event.key === 'r') {
        // event.preventDefault();
        console.log(`Removed from quick diff: ${equipmentName}`);
        equipmentToDiff = {};
        equipmentDetail.querySelector('.diff-tooltip').textContent = isZH ? '已移除对比' : 'Removed from quick diff';
      }
    };
 
  }, 500)
 
  // #region DPS Caculator
  const monsterStatusMap = {
    50: {evasion: 80, resistence: 14},
    80: {evasion: 130, resistence: 18},
    100: {evasion: 170, resistence: 30},
    120: {evasion: 250, resistence: 40},
    140: {evasion: 300, resistence: 80},
    200: {evasion: 400, resistence: 100},
  }
  const abilityDamgeMap = {
    50: {ratio: 0.66, flat: 12},
    80: {ratio: 0.69, flat: 13},
    100: {ratio: 0.735, flat: 14.5},
    120: {ratio: 0.78, flat: 16},
    140: {ratio: 0.825, flat: 17.5},
    200: {ratio: 0.87, flat: 19},
  }
 
  function chooseBelow(level, map) {
    const keys = Object.keys(map).map(Number).filter(k => k <= level);
    if (keys.length === 0) return null;
    const maxKey = Math.max(...keys);
    return map[maxKey];
  }
 
  function getDamageBase(combatStyle, skillLevel, atkAcc, atkAmp, dmgAmp, dmgPen, critAmp, critDmg) {
    const isMagic = combatStyle === "/combat_styles/magic";
    const abilityFlatDmg = isMagic ? chooseBelow(skillLevel, abilityDamgeMap)?.flat : 0;
    const abilityRatioDmg = isMagic ? chooseBelow(skillLevel, abilityDamgeMap)?.ratio + 1 : 1;
    const enemyEvasion = chooseBelow(skillLevel, monsterStatusMap)?.evasion || 80;
    const enemyResistence = chooseBelow(skillLevel, monsterStatusMap)?.resistence || 80;
 
    const accuracy = (10+skillLevel)*(1+atkAcc)
    const hitRate = Math.pow(accuracy, 1.4) / (Math.pow(accuracy, 1.4) + Math.pow(enemyEvasion, 1.4));
    const critRate = combatStyle == "/combat_styles/ranged" ? hitRate * 0.3 + critAmp : critAmp;
 
    const baseDmg = (10+skillLevel) * (1+atkAmp);
    const minDmg = (1+dmgAmp) * (1+abilityFlatDmg);
    const maxDmg = (1+dmgAmp) * (abilityRatioDmg*baseDmg + abilityFlatDmg);
    const estDmg = (minDmg + maxDmg) / 2 * (1-critRate) + maxDmg * critRate * (1+critDmg);
    const actDmg = estDmg * (100 / (100 + (enemyResistence / ( 1 + dmgPen))))
  
    return actDmg * hitRate;
  }
 
  function getSkillLevel(skillName, map) {
    for (const skill of map) {
      if (skill.skillHrid === skillName) {
        return skill.level;
      }
    }
    return -1
  }
 
  function getDPSCompare(diffMap) {
    const combatDetails = selfData?.combatUnit.combatDetails;
    const combatStyle = combatDetails.combatStats.combatStyleHrids[0];
    const damageType = combatDetails.combatStats.damageType;
 
    function getValueFromDiffMap(key) {
      const k = transZH(key);
      if (!diffMap || !diffMap[k]) return 0;
      const s = diffMap[k].replace(',', '').replace(' ', '').replace('+', '').replace('_', '')
      if (s.endsWith('%')) {
        return parseFloat(s.replace('%', '')) / 100;
      } else if (s.endsWith('s')) {
        return parseFloat(s.replace('s', '')) * 1000000000;
      } else {
        return parseFloat(s);
      }
    }
 
    let atkSkillLevel = getSkillLevel('/skills/attack', selfData.characterSkills);
    let dmgSkillLevel = getSkillLevel('/skills/power', selfData.characterSkills);
    let originalAmp = {
      atkAcc: 0,
      atkAmp: 0,
      dmgAmp: combatDetails.combatStats.physicalAmplify || 0,
      dmgPen: combatDetails.combatStats.armorPenetration || 0,
      autoDmg: combatDetails.combatStats.autoAttackDamage || 0,
      autoSpeed: combatDetails.combatStats.attackInterval || 3500000000,
      abilitySpeed: (100 + (combatDetails.combatStats.abilityHaste || 0))/100 * (1+(combatDetails.combatStats.castSpeed || 0)) / 2,
      critAmp: combatDetails.combatStats.criticalRate || 0,
      critDmg: combatDetails.combatStats.criticalDamage || 0,
      speedFactor: (1+(combatDetails.combatStats.attackSpeed || 0)) * (1 + atkSkillLevel / 2000) / combatDetails.combatStats.attackInterval,
    }
    let targetAmp = {
      atkAcc: 0,
      atkAmp: 0,
      dmgAmp: originalAmp.dmgAmp + getValueFromDiffMap('物理增幅'),
      dmgPen: originalAmp.dmgPen + getValueFromDiffMap('护甲穿透'),
      autoDmg: originalAmp.autoDmg + getValueFromDiffMap('自动攻击伤害'),
      autoSpeed: originalAmp.autoSpeed + getValueFromDiffMap('攻击间隔') * 1000000000,
      abilitySpeed: (100 + (combatDetails.combatStats.abilityHaste || 0) + getValueFromDiffMap('技能急速'))/100 * (1+(combatDetails.combatStats.castSpeed || 0)+getValueFromDiffMap('施法速度')) / 2,
      critAmp: originalAmp.critAmp + getValueFromDiffMap('暴击率'),
      critDmg: originalAmp.critDmg + getValueFromDiffMap('暴击伤害'),
      speedFactor: 0,
      otherAmp: 0,
    }
    originalAmp.otherAmp = 1 + originalAmp.autoDmg;
    targetAmp.otherAmp = 1 + targetAmp.autoDmg;
    targetAmp.speedFactor = (1+(combatDetails.combatStats.attackSpeed || 0)+getValueFromDiffMap('攻击速度')) * (1 + atkSkillLevel / 2000) / targetAmp.autoSpeed;
 
    switch (combatStyle) {
      case "/combat_styles/stab":
        originalAmp.atkAcc = combatDetails.stabAccuracyRating / (10 + atkSkillLevel) - 1;
        originalAmp.atkAmp = combatDetails.stabMaxDamage / (10 + dmgSkillLevel) - 1;
        targetAmp.atkAcc = originalAmp.atkAcc + getValueFromDiffMap('刺击精准度');
        targetAmp.atkAmp = originalAmp.atkAmp + getValueFromDiffMap('刺击伤害');
        break;
      case "/combat_styles/slash":
        originalAmp.atkAcc = combatDetails.slashAccuracyRating / (10 + atkSkillLevel) - 1;
        originalAmp.atkAmp = combatDetails.slashMaxDamage / (10 + dmgSkillLevel) - 1;
        targetAmp.atkAcc = originalAmp.atkAcc + getValueFromDiffMap('斩击精准度');
        targetAmp.atkAmp = originalAmp.atkAmp + getValueFromDiffMap('斩击伤害');
        break;
      case "/combat_styles/smash":
        originalAmp.atkAcc = combatDetails.smashAccuracyRating / (10 + atkSkillLevel) - 1;
        originalAmp.atkAmp = combatDetails.smashMaxDamage / (10 + dmgSkillLevel) - 1;
        targetAmp.atkAcc = originalAmp.atkAcc + getValueFromDiffMap('钝击精准度');
        targetAmp.atkAmp = originalAmp.atkAmp + getValueFromDiffMap('钝击伤害');
        break;
      case "/combat_styles/ranged":
        atkSkillLevel = getSkillLevel('/skills/ranged', selfData.characterSkills);
        dmgSkillLevel = atkSkillLevel;
        originalAmp.atkAcc = combatDetails.rangedAccuracyRating / (10 + atkSkillLevel) - 1;
        originalAmp.atkAmp = combatDetails.rangedMaxDamage / (10 + dmgSkillLevel) - 1;
        targetAmp.atkAcc = originalAmp.atkAcc + getValueFromDiffMap('远程精准度');
        targetAmp.atkAmp = originalAmp.atkAmp + getValueFromDiffMap('远程伤害');
        break;
      case "/combat_styles/magic":
        atkSkillLevel = getSkillLevel('/skills/magic', selfData.characterSkills);
        dmgSkillLevel = atkSkillLevel;
        originalAmp.atkAcc = combatDetails.magicAccuracyRating / (10 + atkSkillLevel) - 1;
        originalAmp.atkAmp = combatDetails.magicMaxDamage / (10 + dmgSkillLevel) - 1;
        originalAmp.speedFactor = originalAmp.abilitySpeed;
        targetAmp.atkAcc = originalAmp.atkAcc + getValueFromDiffMap('魔法精准度');
        targetAmp.atkAmp = originalAmp.atkAmp + getValueFromDiffMap('魔法伤害');
        targetAmp.speedFactor = targetAmp.abilitySpeed;
        switch (damageType) {
          case '/damage_types/fire':
            originalAmp.dmgAmp = combatDetails.combatStats.fireAmplify || 0;
            originalAmp.dmgPen = combatDetails.combatStats.firePenetration || 0;
            targetAmp.dmgAmp = originalAmp.dmgAmp + getValueFromDiffMap('火系增幅');
            targetAmp.dmgPen = originalAmp.dmgPen + getValueFromDiffMap('火系穿透');
            break;
          case '/damage_types/water':
            originalAmp.dmgAmp = combatDetails.combatStats.waterAmplify || 0;
            originalAmp.dmgPen = combatDetails.combatStats.waterPenetration || 0;
            targetAmp.dmgAmp = originalAmp.dmgAmp + getValueFromDiffMap('水系增幅');
            targetAmp.dmgPen = originalAmp.dmgPen + getValueFromDiffMap('水系穿透');
            break;
          case '/damage_types/nature':
            originalAmp.dmgAmp = combatDetails.combatStats.natureAmplify || 0;
            originalAmp.dmgPen = combatDetails.combatStats.naturePenetration || 0;
            targetAmp.dmgAmp = originalAmp.dmgAmp + getValueFromDiffMap('自然系增幅');
            targetAmp.dmgPen = originalAmp.dmgPen + getValueFromDiffMap('自然系穿透');
            break;
          default:
            console.warn(`Equipment Diff: Unknown damge style: ${damageType}`);
            return 0;
        }
        break;
      default:
        console.warn(`Equipment Diff: Unknown combat style: ${combatStyle}`);
        return 0;
    }
 
    const originalDamage = getDamageBase(combatStyle, atkSkillLevel, originalAmp.atkAcc, originalAmp.atkAmp, originalAmp.dmgAmp, originalAmp.dmgPen, originalAmp.critAmp, originalAmp.critDmg);
    const targetDamage = getDamageBase(combatStyle, atkSkillLevel, targetAmp.atkAcc, targetAmp.atkAmp, targetAmp.dmgAmp, targetAmp.dmgPen, targetAmp.critAmp, targetAmp.critDmg);
 
    const diffRatio = (targetDamage / originalDamage) * (targetAmp.otherAmp / originalAmp.otherAmp) * (targetAmp.speedFactor / originalAmp.speedFactor) - 1;
    return diffRatio
  }
 
})();