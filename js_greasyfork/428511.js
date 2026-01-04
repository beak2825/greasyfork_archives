// ==UserScript==
// @name         [WoD] Display Skill Rolls
// @namespace    com.dobydigital.userscripts.wod
// @version      2021.06.27.8
// @description  Calculates skill rolls, and adds a new table column on the skills page.
// @author       XaeroDegreaz
// @home         https://github.com/XaeroDegreaz/world-of-dungeons-userscripts
// @supportUrl   https://github.com/XaeroDegreaz/world-of-dungeons-userscripts/issues
// @source       https://raw.githubusercontent.com/XaeroDegreaz/world-of-dungeons-userscripts/main/src/display-skill-rolls.user.js
// @match        *://*.world-of-dungeons.net/wod/spiel/hero/skills*
// @icon         http://info.world-of-dungeons.net/wod/css/WOD.gif
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428511/%5BWoD%5D%20Display%20Skill%20Rolls.user.js
// @updateURL https://update.greasyfork.org/scripts/428511/%5BWoD%5D%20Display%20Skill%20Rolls.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const attributeShortNames = {
    Strength: 'st',
    Constitution: 'co',
    Intelligence: 'in',
    Dexterity: 'dx',
    Charisma: 'ch',
    Agility: 'ag',
    Perception: 'pe',
    Willpower: 'wi'
  }

  const attributesToShortName = ( heroAttributes ) => {
    const obj = {};
    Object.keys( heroAttributes ).forEach( key => {
      obj[attributeShortNames[key]] = heroAttributes[key]
    } );
    return obj;
  }

  const loadHeroAttributes = async () => {
    return await new Promise( resolve => {
      GM.xmlHttpRequest( {
        url: '/wod/spiel/hero/attributes.php',
        synchronous: false,
        onload: ( data ) => {
          resolve( parseHeroAttributes( data ) );
        }
      } );
    } );
  }

  const parseHeroAttributes = ( data ) => {
    const jq = $( data.responseText );
    const attributesTable = jq.find( 'table[class=content_table]' ).first();
    if ( !attributesTable.length )
    {
      console.error( 'NOPE.', attributesTable );
      return;
    }
    const attributeRows = $( attributesTable ).find( 'tr[class^=row]' )
    const rawRows = attributeRows
      .map( function () {
        const cells = $( this ).find( '> td' );
        const attributeName = cells
          .first()
          .text()
          .trim();
        const valueCell = cells
          .find( ':nth-child(2)' )
          .contents()
          .filter( function () {
            return this.nodeType == 3;
          } )
          .text()
          .trim();
        const effectiveValueCell = cells
          .find( ':nth-child(2) > span[class=effective_value]' )
          .text()
          .trim()
          .replace( /\D/g, '' );
        return {attributeName, valueCell, effectiveValueCell};
      } )
      .toArray();
    const retVal = {};
    rawRows.forEach( x => {
      retVal[x.attributeName] = x.effectiveValueCell.length > 0 ? Number( x.effectiveValueCell ) : Number( x.valueCell );
    } );
    return retVal;
  }

  const parseAttackRolls = ( data ) => {
    const jq = $( data );
    const markers = jq.find( 'li' ).map( function () {
      const match = /^The (?<rollType>.+)roll is: (?<rollCalculation>.+?)( \((?<modifier>[+\-]\d*%?)\))?$/g.exec( $( this ).text() );
      if ( !match )
      {
        return;
      }
      //console.log( {match} );
      // @ts-ignore
      const {rollType, rollCalculation, modifier} = match.groups;
      //console.log( {rollType, rollCalculation, modifier} );
      return {rollType, rollCalculation, modifier};
    } ).toArray();
    //console.log( {markers} );
    return markers;
  }

  function calculateSkillRoll( heroAttributes, skillName, skillLevel, rollCalculation, modifier )
  {
    //console.log( {heroAttributes, skillName, skillLevel, rollCalculation, modifier} );
    let replaced = rollCalculation.replaceAll( skillName, skillLevel ).trim();
    Object.keys( heroAttributes ).forEach( key => {
      replaced = replaced.replaceAll( key, heroAttributes[key] );
    } )
    replaced = replaced.replaceAll( 'x', '*' );
    //console.log( {replaced} );
    const roll = eval( replaced );
    const modifierAsNumber = Number( modifier?.replaceAll( /\D/g, '' ) );
    const modifierAsFraction = modifierAsNumber / 100;
    const rollWithModifier = modifier
                             ? modifier.endsWith( '%' )
                               ? modifier.startsWith( '+' )
                                 ? roll * (1 + modifierAsFraction)
                                 : roll * (1 - modifierAsFraction)
                               : modifier.startsWith( '+' )
                                 ? roll + modifierAsNumber
                                 : roll - modifierAsNumber
                             : roll
    //console.log( {rollWithModifier} );
    return Math.floor( rollWithModifier );
  }

  const storage = window.localStorage;
  const SKILL_ROLLS_STORAGE_KEY = 'com.dobydigital.userscripts.wod.displayskillrolls.skillrollslist';

  function load( key )
  {
    try
    {
      const raw = storage?.getItem( key );
      return raw ? JSON.parse( raw ) : undefined;
    }
    catch ( e )
    {
      console.error( `Hero Selector Dropdown Userscript: Unable to load key:${key}`, e );
      return undefined;
    }
  }

  function save( key, value )
  {
    try
    {
      storage?.setItem( key, JSON.stringify( value ) );
    }
    catch ( e )
    {
      console.error( `Hero Selector Dropdown Userscript: Unable to save key:${key}`, e );
    }
  }

  const main = async () => {
    const contentTable = $( 'table[class=content_table]' );
    const body = $( contentTable ).find( '> tbody' );
    const header = $( body ).find( '> tr[class=header]' );
    $( header ).append( '<th>Base Rolls</th>' );
    const skillRows = $( body ).find( 'tr[class^=row]' );
    $( skillRows )
      .each( async function () {
        const a = $( this ).find( 'a' );
        //# Re-align the skill name cell so the text doesn't look inconsistent when injecting attack rolls
        $( a ).parent().attr( 'valign', 'center' );
        $( this ).append( '<td class="roll_placeholder">-</td>' )
      } );
    const heroAttributes = await loadHeroAttributes();
    const shortAttributes = attributesToShortName( heroAttributes );
    const skillRollData = load( SKILL_ROLLS_STORAGE_KEY ) || {};
    //console.log( {heroAttributes, shortAttributes} );
    //console.log( {header} );
    // # begin parsing rows
    $( skillRows )
      .each( async function () {
        const row = $( this );
        $( row )
          .find( 'input[type=image]' )
          .click( async function () {
            await renderRollData( $( row ), skillRollData, shortAttributes );
          } );
        await renderRollData( $( row ), skillRollData, shortAttributes )
      } );
  }

  const renderRollData = async ( row, skillRollData, shortAttributes ) => {
    //console.log( "rendering" )
    const a = $( row ).find( 'a' );
    const skill = $( a ).text();
    const link = $( a ).attr( 'href' );
    //console.log( {skill, link} );
    const baseLevel = $( row ).find( 'div[id^=skill_rang_]' ).text().trim();
    const effectiveLevel = $( row ).find( 'span[id^=skill_eff_rang_]' ).text().replace( /\D/g, '' ).trim();
    const skillLevel = effectiveLevel.length > 0 ? Number( effectiveLevel ) : Number( baseLevel );
    if ( !skillLevel )
    {
      return;
    }

    if ( !skillRollData?.[skill] )
    {
      const skillData = await new Promise( resolve => {
        GM.xmlHttpRequest( {
          url: link,
          synchronous: false,
          onload: ( data ) => {
            resolve( data.responseText );
          }
        } );
      } );
      skillRollData[skill] = parseAttackRolls( skillData );
      save( SKILL_ROLLS_STORAGE_KEY, skillRollData );
    }
    //console.log( "data", skillRollData[skill] );
    if ( skillRollData[skill].length === 0 )
    {
      return;
    }
    const formatted = skillRollData[skill].map( x => {
      return {
        rollType: x.rollType,
        rollValue: calculateSkillRoll( shortAttributes, skill, skillLevel, x.rollCalculation, x.modifier ),
        rollCalculation: x.rollCalculation,
        modifier: x.modifier
      };
    } );
    //console.log( {formatted} );
    $( row )
      .find( 'td[class=roll_placeholder]' )
      .replaceWith( `<td class="roll_placeholder"><table width="100%"><tbody>${
        formatted
          .map( x => {
            const modifierString = x.modifier ? `<b>(${x.modifier})</b>` : '';
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
          } )
          .join( '' )
      }</tbody></table></td>` );
  }

  await main();
})();
