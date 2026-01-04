// ==UserScript==
// @name         AutoFortRegistration
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @license MIT
// @description  Auto Registration on small forts and setting position
// @author       Serhii T
// @include http*://*.the-west.*/game.php*
// @include http*://*.the-west.*.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546908/AutoFortRegistration.user.js
// @updateURL https://update.greasyfork.org/scripts/546908/AutoFortRegistration.meta.js
// ==/UserScript==

(function AutoFortRegistration() {
  const DEFENCE_SIDE = 0;
  const ATTACK_SIDE = 1;
  const SMALL_FORT_TYPE = 0;

  const COORDINATES = {
    adventurer: [
      178, 179, 180,
      212, 213, 214,
      246, 247, 248
    ],
    duelist: [
      193, 194, 195,
      227, 228, 229,
      261, 262, 263
    ],
    soldier: [
      450, 451, 452,
      484, 485, 486,
      518, 519, 520
    ],
    worker: [
      465, 466, 467,
      499, 500, 501,
      533, 534, 535
    ],
    walls : [
      215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, // top wall
      487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, // bottom wall
      281, 315, 349, 383, 417, // left wall
      296, 330, 364, 398, 432  // right wall
    ],
    tankPositions: [
      178, 212, 246, // adventurer tower
      195, 229, 263, // duelist tower
      450, 484, 518, // soldier tower
      467, 501, 535  // worker tower
    ]
  }

  const ATTACK_COORDINATES = {
    corners: [
      0, 782, 815, 33
    ],
    cornersGroup: [
      // top-left
      0, 1, 2,
      34, 35, 36,
      68, 69, 70,

      // bottom-left
      714, 715, 716,
      748, 749, 750,
      782, 783, 784,

      // bottom-right
      745, 746, 747,
      779, 780, 781,
      813, 814, 815,

      // top-right
      31, 32, 33,
      65, 66, 67,
      99, 100, 101,
    ],
  };

  async function init(preferAttack) {
    // own array to store joined forts in this session
    Character.joinedForts = Character.joinedForts || [];
    const activeForts = await getActiveForts();

    const notJoinedForts = activeForts.filter(fortId => !Character.joinedForts.includes(fortId));
    console.log('AutoFortRegistration: notJoinedForts', notJoinedForts);

    for (let i = 0; i < notJoinedForts.length; i++) {
      await GameMap.AjaxAsync.wait(2000);

      const fortId = notJoinedForts[i].id;
      const fortType = await getFortType(notJoinedForts[i].x, notJoinedForts[i].y);
      const canRegister = fortType === SMALL_FORT_TYPE && await canRegisterOnFort(fortId);
      console.log('AutoFortRegistration: fortId', fortId, 'fortType', fortType, 'canRegister', canRegister);

      if (canRegister) {
        const isAttack = (preferAttack && !canRegister.mustDefend) || canRegister.mustAttack;
        console.log('AutoFortRegistration: registering on fort', fortId);
        const isRegistrationSuccess = await registerOnFort(fortId, isAttack);

        if (isRegistrationSuccess) {
          console.log('AutoFortRegistration: Registration Successful!');
          Character.joinedForts.push(fortId);
          await GameMap.AjaxAsync.wait(2000);
          await findAndSetPosition(fortId, isAttack);
        }
      }
    }
  }

  async function findAndSetPosition(fortId, isAttack) {
    const occupiedPositions = await getOccupiedPositions(fortId);

    const positions = isAttack ? getAttackPositions(occupiedPositions) : await getDefencePositions(occupiedPositions);
    const randomPosition = getRandomArrayItem(positions);
    await setPosition(fortId, randomPosition);
  }

  function getAttackPositions(occupiedPositions) {
    const cornersPositions = ATTACK_COORDINATES.corners.filter(position => !occupiedPositions.includes(position));
    console.log('AutoFortRegistration: cornersPositions', cornersPositions);
    if (cornersPositions.length > 0) {
      return cornersPositions;
    }

    const cornersGroupPositions = ATTACK_COORDINATES.cornersGroup.filter(position => !occupiedPositions.includes(position));
    console.log('AutoFortRegistration: cornersGroupPositions', cornersGroupPositions);
    if (cornersGroupPositions.length > 0) {
      return cornersGroupPositions;
    }

    return [];
  }

  async function getDefencePositions(occupiedPositions) {
    // try to set position on the tower of your class
    const classTowerPositions = (await getPositionsByRole(COORDINATES[Character.charClass]))
      .filter(pos => !occupiedPositions.includes(pos));
    console.log('AutoFortRegistration: classTowerPositions', classTowerPositions);
    if (classTowerPositions.length > 0) {
      return classTowerPositions;
    }

    // if all positions on your class tower are occupied, try to set position on any tower
    const allTowers = [].concat(
      COORDINATES['adventurer'],
      COORDINATES['duelist'],
      COORDINATES['soldier'],
      COORDINATES['worker']
    );
    const towersPositions = (await getPositionsByRole(allTowers))
      .filter(pos => !occupiedPositions.includes(pos));
    console.log('AutoFortRegistration: towersPositions', towersPositions);
    if (towersPositions.length > 0) {
      return towersPositions;
    }

    // if all tower positions are occupied, try to set position on walls
    const wallPositions = (await getPositionsByRole(COORDINATES['walls']))
      .filter(pos => !occupiedPositions.includes(pos));
    console.log('AutoFortRegistration: wallPositions', wallPositions);
    if (wallPositions.length > 0) {
      return wallPositions;
    }

    // if all walls and towers are occupied, fuck it, set position on any spot
    return await getPositionsByRole([...allTowers, ...COORDINATES['walls']]);
  }

  async function setPosition(fortId, position) {
    const data = {
      command: 'set_pos',
      fort_id: fortId,
      selfpos: position,
      selftarget: position
    };
    await GameMap.AjaxAsync.remoteCall('fort_battlepage', 'updatechars', data);
  }

  async function getOccupiedPositions(fortId) {
    const resp = await GameMap.AjaxAsync.remoteCallMode('fort_battlepage', 'index', {fort_id: fortId});

    return resp.playerlist.filter(player => player.name !== Character.name).map(player => player.idx);
  }

  async function getFortType(x, y) {
    const resp = await GameMap.AjaxAsync.remoteCallMode('fort', 'display', {x, y});

    return resp.data.type;
  }

  async function registerOnFort(fortId, isAttack) {
    const side = isAttack ? ATTACK_SIDE : DEFENCE_SIDE;
    const resp = await GameMap.AjaxAsync.remoteCall('fort_battlepage', 'joinBattle', {fort_id: fortId, side: side});

    return !!resp.success;
  }

  async function canRegisterOnFort(fortId) {
    const resp = await GameMap.AjaxAsync.remoteCallMode('fort_battlepage', 'index', {fort_id: fortId});

    // mustAttack or mustDefend be true means you have only one option
    const { couldJoin, joined, mustAttack, mustDefend } = resp;
    if (joined === true) return false; // already joined
    return couldJoin ? ({ mustAttack, mustDefend }) : false;
  }

  async function getActiveForts() {
    const resp = await GameMap.AjaxAsync.remoteCall('fort_overview', '', {
      offset: 0,
    });

    if (resp.js) {
      return resp.js
        .filter(data => data[3] === true) // is under attack
        .map(data => ({
          id: data[0],
          x: data[1],
          y: data[2],
          underAttack: data[3],
          attacker: data[4],
          attackerTown: data[5],
        }));
    } else {
      return [];
    }
  }

  function getRandomArrayItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function getPositionsByRole(positions) {
    const canTank = await isTank();
    const excludedPositions = !canTank ? COORDINATES['tankPositions'] : [];
    return positions.filter(position => !excludedPositions.includes(position));
  }

  // if it has skill 'health' more than half of all skills
  async function isTank() {
    const cachedSkills = sessionStorage.getItem('CharacterSkills');
    if (cachedSkills) {
      CharacterSkills.usedSkills = JSON.parse(cachedSkills).usedSkills;
      CharacterSkills.usedAttributes = JSON.parse(cachedSkills).usedAttributes;
    }
    if (CharacterSkills.usedSkills === 0 || CharacterSkills.usedAttributes === 0) {
      const resp = await GameMap.AjaxAsync.remoteCallMode('skill', 'overview', {});
      CharacterSkills.usedSkills = resp.usedSkills;
      CharacterSkills.usedAttributes = resp.usedAttributes;
      sessionStorage.setItem('CharacterSkills', JSON.stringify({
        usedSkills: CharacterSkills.usedSkills,
        usedAttributes: CharacterSkills.usedAttributes
      }));
    }
    return CharacterSkills.getSkill("health").points - CharacterSkills.usedAttributes > CharacterSkills.usedSkills / 2
  }

  const AutoFortRegistration = {
    init: init
  }

  if (typeof GameMap !== 'undefined') {
    GameMap.AutoFortRegistration = AutoFortRegistration;
  }
})()
