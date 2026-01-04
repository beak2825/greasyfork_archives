// ==UserScript==
// @name         InfoComplete
// @namespace    https://openuserjs.org/users/The_Stubbs
// @version      9.3.3
// @description  InfoCompte script for OGame
// @author       Vulca, benneb & now The Stubbs (+ AstralCodex)
// @license      MIT
// @match        https://*.ogame.gameforge.com/game/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/486658/InfoComplete.user.js
// @updateURL https://update.greasyfork.org/scripts/486658/InfoComplete.meta.js
// ==/UserScript==

// Modules

(async() => {
	const Classes = (function(){
		class Body {
			static get_costs_defences_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.units.defences ){
						const technology = technologies[ id ];
						if( technology ){
							result += Unit.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_costs_ships_statics_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.units.ships.statics ){
						const technology = technologies[ id ];
						if( technology ){
							result += Unit.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
		}
		class Positions {
			static get_costs_mines_from( positions, rates ){
				let result = 0;
				for( const coordinates in positions ){
					const position = positions[ coordinates ];
					const technologies = position.planet.technologies;
					result += Planet.get_costs_mines_from( technologies, rates );
				}
				return result;
			}
			static get_productions_upgraded_from( data, rates ){
				const positions = data.game.player.positions;
				const researches = data.game.player.researches;
				const initial_planet_count = Object.values( positions ).length;
				const upgraded_planet_count = Math.ceil( researches[124].upgraded * .5 ) + 1;
				let result = 0;
				for( const coordinates in positions ){
					const position = positions[ coordinates ];
					result += Planet.get_productions_upgraded_from( data, position, rates );
				}
				return result / initial_planet_count * upgraded_planet_count;
			}
		}
		class Position {
			static bonuses = {
				metal: [1.35, 1.23, 1.17, 1],
				crystal: [1.4, 1.3, 1.2, 1]
			}
			static get_metal_production_bonus( value ){
				const i = Math.min( 3, Math.abs( value - 8 ) );
				return Position.bonuses.metal[ i ];
			}
			static get_crystal_production_bonus( value ){
				const i = Math.min( 3, value - 1 );
				return Position.bonuses.crystal[ i ];
			}
		}
		class Researches {
			static get_costs_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.researches ){
						const technology = technologies[ id ];
						if( technology ){
							result += Upgradable.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_costs_upgrade_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.researches ){
						const technology = technologies[ id ];
						if( technology ){
							result += Upgradable.get_costs_upgrade_from( id, technology, rates );
						}
					}
				}
				return result;
			}
		}
		class Technologies {
			static costs = {
				1: {
					metal: 60,
					crystal: 15,
					deuterium: 0,
					coefficient: 1.5
				},
				2: {
					metal: 48,
					crystal: 24,
					deuterium: 0,
					coefficient: 1.6
				},
				3: {
					metal: 225,
					crystal: 75,
					deuterium: 0,
					coefficient: 1.5
				},
				4: {
					metal: 75,
					crystal: 30,
					deuterium: 0,
					coefficient: 1.5
				},
				12: {
					metal: 900,
					crystal: 360,
					deuterium: 180,
					coefficient: 1.8
				},
				14: {
					metal: 400,
					crystal: 120,
					deuterium: 200,
					coefficient: 2
				},
				15: {
					metal: 1_000_000,
					crystal: 500_000,
					deuterium: 100_000,
					coefficient: 2
				},
				21: {
					metal: 400,
					crystal: 200,
					deuterium: 100,
					coefficient: 2
				},
				22: {
					metal: 1_000,
					crystal: 0,
					deuterium: 0,
					coefficient: 2
				},
				23: {
					metal: 1_000,
					crystal: 500,
					deuterium: 0,
					coefficient: 2
				},
				24: {
					metal: 1_000,
					crystal: 1_000,
					deuterium: 0,
					coefficient: 2
				},
				31: {
					metal: 200,
					crystal: 400,
					deuterium: 200,
					coefficient: 2
				},
				33: {
					metal: 0,
					crystal: 50_000,
					deuterium: 100_000,
					coefficient: 2
				},
				34: {
					metal: 20_000,
					crystal: 40_000,
					deuterium: 0,
					coefficient: 2
				},
				36: {
					metal: 200,
					crystal: 0,
					deuterium: 50,
					coefficient: 5
				},
				41: {
					metal: 20_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 2
				},
				42: {
					metal: 20_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 2
				},
				43: {
					metal: 2_000_000,
					crystal: 4_000_000,
					deuterium: 2_000_000,
					coefficient: 2
				},
				44: {
					metal: 20_000,
					crystal: 20_000,
					deuterium: 1_000,
					coefficient: 2
				},
				106: {
					metal: 200,
					crystal: 1_000,
					deuterium: 200,
					coefficient: 2
				},
				108: {
					metal: 0,
					crystal: 400,
					deuterium: 600,
					coefficient: 2
				},
				109: {
					metal: 800,
					crystal: 200,
					deuterium: 0,
					coefficient: 2
				},
				110: {
					metal: 200,
					crystal: 600,
					deuterium: 0,
					coefficient: 2
				},
				111: {
					metal: 1_000,
					crystal: 0,
					deuterium: 0,
					coefficient: 2
				},
				113: {
					metal: 0,
					crystal: 800,
					deuterium: 400,
					coefficient: 2
				},
				114: {
					metal: 0,
					crystal: 4_000,
					deuterium: 2_000,
					coefficient: 2
				},
				115: {
					metal: 400,
					crystal: 0,
					deuterium: 600,
					coefficient: 2
				},
				117: {
					metal: 2_000,
					crystal: 4_000,
					deuterium: 600,
					coefficient: 2
				},
				118: {
					metal: 10_000,
					crystal: 20_000,
					deuterium: 6_000,
					coefficient: 2
				},
				120: {
					metal: 200,
					crystal: 100,
					deuterium: 0,
					coefficient: 2
				},
				121: {
					metal: 1_000,
					crystal: 300,
					deuterium: 100,
					coefficient: 2
				},
				122: {
					metal: 2_000,
					crystal: 4_000,
					deuterium: 1_000,
					coefficient: 2
				},
				123: {
					metal: 240_000,
					crystal: 400_000,
					deuterium: 160_000,
					coefficient: 2
				},
				124: {
					metal: 4_000,
					crystal: 8_000,
					deuterium: 4_000,
					coefficient: 1.75
				},
				199: {
					metal: 0,
					crystal: 0,
					deuterium: 0,
					coefficient: 3
				},
				202: {
					metal: 2_000,
					crystal: 2_000,
					deuterium: 0
				},
				203: {
					metal: 6_000,
					crystal: 6_000,
					deuterium: 0
				},
				204: {
					metal: 3_000,
					crystal: 1_000,
					deuterium: 0
				},
				205: {
					metal: 6_000,
					crystal: 4_000,
					deuterium: 0
				},
				206: {
					metal: 20_000,
					crystal: 7_000,
					deuterium: 2_000
				},
				207: {
					metal: 45_000,
					crystal: 15_000,
					deuterium: 0
				},
				208: {
					metal: 10_000,
					crystal: 20_000,
					deuterium: 10_000
				},
				209: {
					metal: 10_000,
					crystal: 6_000,
					deuterium: 2_000
				},
				210: {
					metal: 0,
					crystal: 1_000,
					deuterium: 0
				},
				211: {
					metal: 50_000,
					crystal: 25_000,
					deuterium: 15_000
				},
				212: {
					metal: 0,
					crystal: 2_000,
					deuterium: 500
				},
				213: {
					metal: 60_000,
					crystal: 50_000,
					deuterium: 15_000
				},
				214: {
					metal: 5_000_000,
					crystal: 4_000_000,
					deuterium: 1_000_000
				},
				215: {
					metal: 30_000,
					crystal: 40_000,
					deuterium: 15_000
				},
				217: {
					metal: 2_000,
					crystal: 2_000,
					deuterium: 1_000
				},
				218: {
					metal: 85_000,
					crystal: 55_000,
					deuterium: 20_000
				},
				219: {
					metal: 8_000,
					crystal: 15_000,
					deuterium: 8_000
				},
				401: {
					metal: 2_000,
					crystal: 0,
					deuterium: 0
				},
				402: {
					metal: 1_500,
					crystal: 500,
					deuterium: 0
				},
				403: {
					metal: 6_000,
					crystal: 2_000,
					deuterium: 0
				},
				404: {
					metal: 20_000,
					crystal: 15_000,
					deuterium: 2_000
				},
				405: {
					metal: 5_000,
					crystal: 3_000,
					deuterium: 0
				},
				406: {
					metal: 50_000,
					crystal: 50_000,
					deuterium: 30_000
				},
				407: {
					metal: 10_000,
					crystal: 10_000,
					deuterium: 0
				},
				408: {
					metal: 50_000,
					crystal: 50_000,
					deuterium: 0
				},
				502: {
					metal: 8_000,
					crystal: 0,
					deuterium: 2_000
				},
				503: {
					metal: 12_500,
					crystal: 2_500,
					deuterium: 10_000
				},
				11_101: {
					metal: 7,
					crystal: 2,
					deuterium: 0,
					coefficient: 1.2
				},
				11_102: {
					metal: 5,
					crystal: 2,
					deuterium: 0,
					coefficient: 1.23
				},
				11_103: {
					metal: 20_000,
					crystal: 25_000,
					deuterium: 10_000,
					coefficient: 1.3
				},
				11_104: {
					metal: 5_000,
					crystal: 3_200,
					deuterium: 1_500,
					coefficient: 1.7
				},
				11_105: {
					metal: 50_000,
					crystal: 40_000,
					deuterium: 50_000,
					coefficient: 1.7
				},
				11_106: {
					metal: 9_000,
					crystal: 6_000,
					deuterium: 3_000,
					coefficient: 1.5
				},
				11_107: {
					metal: 25_000,
					crystal: 13_000,
					deuterium: 7_000,
					coefficient: 1.09
				},
				11_108: {
					metal: 50_000,
					crystal: 25_000,
					deuterium: 15_000,
					coefficient: 1.5
				},
				11_109: {
					metal: 75_000,
					crystal: 20_000,
					deuterium: 25_000,
					coefficient: 1.09
				},
				11_110: {
					metal: 150_000,
					crystal: 30_000,
					deuterium: 15_000,
					coefficient: 1.12
				},
				11_111: {
					metal: 80_000,
					crystal: 35_000,
					deuterium: 60_000,
					coefficient: 1.5
				},
				11_112: {
					metal: 250_000,
					crystal: 125_000,
					deuterium: 125_000,
					coefficient: 1.2
				},
				11_201: {
					metal: 5_000,
					crystal: 2_500,
					deuterium: 500,
					coefficient: 1.3
				},
				11_202: {
					metal: 7_000,
					crystal: 10_000,
					deuterium: 5_000,
					coefficient: 1.5
				},
				11_203: {
					metal: 15_000,
					crystal: 10_000,
					deuterium: 5_000,
					coefficient: 1.3
				},
				11_204: {
					metal: 20_000,
					crystal: 15_000,
					deuterium: 7_500,
					coefficient: 1.3
				},
				11_205: {
					metal: 25_000,
					crystal: 20_000,
					deuterium: 10_000,
					coefficient: 1.2
				},
				11_206: {
					metal: 35_000,
					crystal: 25_000,
					deuterium: 15_000,
					coefficient: 1.5
				},
				11_207: {
					metal: 70_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 1.3
				},
				11_208: {
					metal: 80_000,
					crystal: 50_000,
					deuterium: 20_000,
					coefficient: 1.5
				},
				11_209: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				11_210: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				11_211: {
					metal: 120_000,
					crystal: 30_000,
					deuterium: 25_000,
					coefficient: 1.5
				},
				11_212: {
					metal: 100_000,
					crystal: 40_000,
					deuterium: 30_000,
					coefficient: 1.3
				},
				11_213: {
					metal: 200_000,
					crystal: 100_000,
					deuterium: 100_000,
					coefficient: 1.3
				},
				11_214: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				11_215: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				11_216: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				11_217: {
					metal: 300_000,
					crystal: 180_000,
					deuterium: 120_000,
					coefficient: 1.5
				},
				11_218: {
					metal: 500_000,
					crystal: 300_000,
					deuterium: 200_000,
					coefficient: 1.3
				},
				12_101: {
					metal: 9,
					crystal: 3,
					deuterium: 0,
					coefficient: 1.2
				},
				12_102: {
					metal: 7,
					crystal: 2,
					deuterium: 0,
					coefficient: 1.2
				},
				12_103: {
					metal: 40_000,
					crystal: 10_000,
					deuterium: 15_000,
					coefficient: 1.3
				},
				12_104: {
					metal: 5_000,
					crystal: 3_800,
					deuterium: 1_000,
					coefficient: 1.7
				},
				12_105: {
					metal: 50_000,
					crystal: 40_000,
					deuterium: 50_000,
					coefficient: 1.65
				},
				12_106: {
					metal: 10_000,
					crystal: 8_000,
					deuterium: 1_000,
					coefficient: 1.4
				},
				12_107: {
					metal: 20_000,
					crystal: 15_000,
					deuterium: 10_000,
					coefficient: 1.2
				},
				12_108: {
					metal: 50_000,
					crystal: 35_000,
					deuterium: 15_000,
					coefficient: 1.5
				},
				12_109: {
					metal: 85_000,
					crystal: 44_000,
					deuterium: 25_000,
					coefficient: 1.4
				},
				12_110: {
					metal: 120_000,
					crystal: 50_000,
					deuterium: 20_000,
					coefficient: 1.4
				},
				12_111: {
					metal: 250_000,
					crystal: 150_000,
					deuterium: 100_000,
					coefficient: 1.8
				},
				12_112: {
					metal: 250_000,
					crystal: 125_000,
					deuterium: 125_000,
					coefficient: 1.5
				},
				12_201: {
					metal: 10_000,
					crystal: 6_000,
					deuterium: 1_000,
					coefficient: 1.5
				},
				12_202: {
					metal: 7_500,
					crystal: 12_500,
					deuterium: 5_000,
					coefficient: 1.5
				},
				12_203: {
					metal: 15_000,
					crystal: 10_000,
					deuterium: 5_000,
					coefficient: 1.5
				},
				12_204: {
					metal: 20_000,
					crystal: 15_000,
					deuterium: 7_500,
					coefficient: 1.3
				},
				12_205: {
					metal: 25_000,
					crystal: 20_000,
					deuterium: 10_000,
					coefficient: 1.5
				},
				12_206: {
					metal: 50_000,
					crystal: 50_000,
					deuterium: 20_000,
					coefficient: 1.5
				},
				12_207: {
					metal: 70_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 1.5
				},
				12_208: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				12_209: {
					metal: 75_000,
					crystal: 55_000,
					deuterium: 25_000,
					coefficient: 1.5
				},
				12_210: {
					metal: 85_000,
					crystal: 40_000,
					deuterium: 35_000,
					coefficient: 1.5
				},
				12_211: {
					metal: 120_000,
					crystal: 30_000,
					deuterium: 25_000,
					coefficient: 1.5
				},
				12_212: {
					metal: 100_000,
					crystal: 40_000,
					deuterium: 30_000,
					coefficient: 1.5
				},
				12_213: {
					metal: 200_000,
					crystal: 100_000,
					deuterium: 100_000,
					coefficient: 1.2
				},
				12_214: {
					metal: 220_000,
					crystal: 110_000,
					deuterium: 110_000,
					coefficient: 1.3
				},
				12_215: {
					metal: 240_000,
					crystal: 120_000,
					deuterium: 120_000,
					coefficient: 1.3
				},
				12_216: {
					metal: 250_000,
					crystal: 250_000,
					deuterium: 250_000,
					coefficient: 1.4
				},
				12_217: {
					metal: 500_000,
					crystal: 300_000,
					deuterium: 200_000,
					coefficient: 1.5
				},
				12_218: {
					metal: 300_000,
					crystal: 180_000,
					deuterium: 120_000,
					coefficient: 1.7
				},
				13_101: {
					metal: 6,
					crystal: 2,
					deuterium: 0,
					coefficient: 1.21
				},
				13_102: {
					metal: 5,
					crystal: 2,
					deuterium: 0,
					coefficient: 1.18
				},
				13_103: {
					metal: 30_000,
					crystal: 20_000,
					deuterium: 10_000,
					coefficient: 1.3
				},
				13_104: {
					metal: 5_000,
					crystal: 3_800,
					deuterium: 1_000,
					coefficient: 1.8
				},
				13_105: {
					metal: 50_000,
					crystal: 40_000,
					deuterium: 50_000,
					coefficient: 1.8
				},
				13_106: {
					metal: 7_500,
					crystal: 7_000,
					deuterium: 1_000,
					coefficient: 1.3
				},
				13_107: {
					metal: 35_000,
					crystal: 15_000,
					deuterium: 10_000,
					coefficient: 1.5
				},
				13_108: {
					metal: 50_000,
					crystal: 20_000,
					deuterium: 30_000,
					coefficient: 1.07
				},
				13_109: {
					metal: 100_000,
					crystal: 10_000,
					deuterium: 3_000,
					coefficient: 1.14
				},
				13_110: {
					metal: 100_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 1.5
				},
				13_111: {
					metal: 55_000,
					crystal: 50_000,
					deuterium: 30_000,
					coefficient: 1.5
				},
				13_112: {
					metal: 250_000,
					crystal: 125_000,
					deuterium: 125_000,
					coefficient: 1.4
				},
				13_201: {
					metal: 10_000,
					crystal: 6_000,
					deuterium: 1_000,
					coefficient: 1.5
				},
				13_202: {
					metal: 7_500,
					crystal: 12_500,
					deuterium: 5_000,
					coefficient: 1.3
				},
				13_203: {
					metal: 15_000,
					crystal: 10_000,
					deuterium: 5_000,
					coefficient: 1.5
				},
				13_204: {
					metal: 20_000,
					crystal: 15_000,
					deuterium: 7_500,
					coefficient: 1.3
				},
				13_205: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				13_206: {
					metal: 50_000,
					crystal: 50_000,
					deuterium: 20_000,
					coefficient: 1.5
				},
				13_207: {
					metal: 70_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 1.3
				},
				13_208: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				13_209: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				13_210: {
					metal: 85_000,
					crystal: 40_000,
					deuterium: 35_000,
					coefficient: 1.2
				},
				13_211: {
					metal: 120_000,
					crystal: 30_000,
					deuterium: 25_000,
					coefficient: 1.3
				},
				13_212: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				13_213: {
					metal: 200_000,
					crystal: 100_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				13_214: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				13_215: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				13_216: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				13_217: {
					metal: 500_000,
					crystal: 300_000,
					deuterium: 200_000,
					coefficient: 1.5
				},
				13_218: {
					metal: 300_000,
					crystal: 180_000,
					deuterium: 120_000,
					coefficient: 1.7
				},
				14_101: {
					metal: 4,
					crystal: 3,
					deuterium: 0,
					coefficient: 1.21
				},
				14_102: {
					metal: 6,
					crystal: 3,
					deuterium: 0,
					coefficient: 1.21
				},
				14_103: {
					metal: 20_000,
					crystal: 20_000,
					deuterium: 30_000,
					coefficient: 1.3
				},
				14_104: {
					metal: 7_500,
					crystal: 5_000,
					deuterium: 800,
					coefficient: 1.8
				},
				14_105: {
					metal: 60_000,
					crystal: 30_000,
					deuterium: 50_000,
					coefficient: 1.8
				},
				14_106: {
					metal: 8_500,
					crystal: 5_000,
					deuterium: 3_000,
					coefficient: 1.25
				},
				14_107: {
					metal: 15_000,
					crystal: 15_000,
					deuterium: 20_000,
					coefficient: 1.2
				},
				14_108: {
					metal: 75_000,
					crystal: 25_000,
					deuterium: 30_000,
					coefficient: 1.05
				},
				14_109: {
					metal: 87_500,
					crystal: 25_000,
					deuterium: 30_000,
					coefficient: 1.2
				},
				14_110: {
					metal: 150_000,
					crystal: 30_000,
					deuterium: 30_000,
					coefficient: 1.5
				},
				14_111: {
					metal: 75_000,
					crystal: 50_000,
					deuterium: 55_000,
					coefficient: 1.2
				},
				14_112: {
					metal: 500_000,
					crystal: 250_000,
					deuterium: 250_000,
					coefficient: 1.4
				},
				14_201: {
					metal: 10_000,
					crystal: 6_000,
					deuterium: 1_000,
					coefficient: 1.5
				},
				14_202: {
					metal: 7_500,
					crystal: 12_500,
					deuterium: 5_000,
					coefficient: 1.5
				},
				14_203: {
					metal: 15_000,
					crystal: 10_000,
					deuterium: 5_000,
					coefficient: 1.5
				},
				14_204: {
					metal: 20_000,
					crystal: 15_000,
					deuterium: 7_500,
					coefficient: 1.5
				},
				14_205: {
					metal: 25_000,
					crystal: 20_000,
					deuterium: 10_000,
					coefficient: 1.5
				},
				14_206: {
					metal: 50_000,
					crystal: 50_000,
					deuterium: 20_000,
					coefficient: 1.3
				},
				14_207: {
					metal: 70_000,
					crystal: 40_000,
					deuterium: 20_000,
					coefficient: 1.5
				},
				14_208: {
					metal: 80_000,
					crystal: 50_000,
					deuterium: 20_000,
					coefficient: 1.2
				},
				14_209: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				14_210: {
					metal: 85_000,
					crystal: 40_000,
					deuterium: 35_000,
					coefficient: 1.2
				},
				14_211: {
					metal: 120_000,
					crystal: 30_000,
					deuterium: 25_000,
					coefficient: 1.5
				},
				14_212: {
					metal: 100_000,
					crystal: 40_000,
					deuterium: 30_000,
					coefficient: 1.5
				},
				14_213: {
					metal: 200_000,
					crystal: 100_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				14_214: {
					metal: 160_000,
					crystal: 120_000,
					deuterium: 50_000,
					coefficient: 1.5
				},
				14_215: {
					metal: 240_000,
					crystal: 120_000,
					deuterium: 120_000,
					coefficient: 1.5
				},
				14_216: {
					metal: 320_000,
					crystal: 240_000,
					deuterium: 100_000,
					coefficient: 1.5
				},
				14_217: {
					metal: 500_000,
					crystal: 300_000,
					deuterium: 200_000,
					coefficient: 1.5
				},
				14_218: {
					metal: 300_000,
					crystal: 180_000,
					deuterium: 120_000,
					coefficient: 1.7
				}
			}
			static ids = {
				miniatures: {
					'https://gf2.geo.gfsrv.net/cdnd9/60555c3c87b9eb3b5ddf76780b5712.jpg': 202,
					'https://gf3.geo.gfsrv.net/cdn23/9e24203ce8e9723008272d51786780.jpg': 202,
					'https://gf1.geo.gfsrv.net/cdn34/fdbcc505474e3e108d10a3ed4a19f4.jpg': 203,
					'https://gf1.geo.gfsrv.net/cdn0c/f38c9fcab7e958698a7f8013b3cc3e.jpg': 203,
					'https://gf2.geo.gfsrv.net/cdnd2/9ed5c1b6aea28fa51f84cdb8cb1e7e.jpg': 204,
					'https://gf1.geo.gfsrv.net/cdncb/9091972f8d216eb9ab0b01b31065ff.jpg': 204,
					'https://gf1.geo.gfsrv.net/cdnf1/8266a2cbae5ad630c5fedbdf270f3e.jpg': 205,
					'https://gf1.geo.gfsrv.net/cdn66/a5931e3e4a1609da1bfe4ea7984758.jpg': 205,
					'https://gf2.geo.gfsrv.net/cdn45/b7ee4f9d556a0f39dae8d2133e05b7.jpg': 206,
					'https://gf2.geo.gfsrv.net/cdn11/26d5b34d33384155d541f8e3a56bd0.jpg': 206,
					'https://gf1.geo.gfsrv.net/cdn32/3f4a081f4d15662bed33473db53d5b.jpg': 207,
					'https://gf3.geo.gfsrv.net/cdn54/04ae451ca1bbf437b04dcb1689e7ac.jpg': 207,
					'https://gf1.geo.gfsrv.net/cdn6f/41a21e4253d2231f8937ddef1ba43e.jpg': 208,
					'https://gf2.geo.gfsrv.net/cdn4b/875d71d6af78f83966b16fc806f398.jpg': 208,
					'https://gf1.geo.gfsrv.net/cdn07/6246eb3d7fa67414f6b818fa79dd9b.jpg': 209,
					'https://gf3.geo.gfsrv.net/cdn20/6bf35a0f61e69a466a0a4691a8e089.jpg': 209,
					'https://gf3.geo.gfsrv.net/cdnb5/347821e80cafc52aec04f27c3a2a4d.jpg': 210,
					'https://gf2.geo.gfsrv.net/cdn19/4b46516da39af486f25103faacaeae.jpg': 210,
					'https://gf1.geo.gfsrv.net/cdnca/4d55a520aed09d0c43e7b962f33e27.jpg': 211,
					'https://gf1.geo.gfsrv.net/cdn35/da0705b3be831864ffa2b5a91d630d.jpg': 211,
					'https://gf2.geo.gfsrv.net/cdnda/665c65072887153d44a6684ec276e9.jpg': 212,
					'https://gf2.geo.gfsrv.net/cdnd3/5f3ca7e91fc0a9b1ee014c3c01ea41.jpg': 212,
					'https://gf3.geo.gfsrv.net/cdn2a/c2b9fedc9c93ef22f2739c49fbac52.jpg': 213,
					'https://gf3.geo.gfsrv.net/cdn82/6ba84c9dfcfff57452dcaf77d8f722.jpg': 213,
					'https://gf3.geo.gfsrv.net/cdn84/155e9e24fc1d34ed4660de8d428f45.jpg': 214,
					'https://gf1.geo.gfsrv.net/cdnfb/6be8cd7c88e3c5510e8a9d8ca64daa.jpg': 214,
					'https://gf3.geo.gfsrv.net/cdn5a/24f511ec14a71e2d83fd750aa0dee2.jpg': 215,
					'https://gf3.geo.gfsrv.net/cdn50/07f6bd1320f406d474639b7f1f499c.jpg': 215,
					'https://gf3.geo.gfsrv.net/cdn26/28e8d79a5b489dc795cc47f3adf165.jpg': 217,
					'https://gf1.geo.gfsrv.net/cdnf3/a31e24320e2814bc93a4ebef8f55b4.jpg': 217,
					'https://gf1.geo.gfsrv.net/cdn39/12d016c8bb0d71e053b901560c17cc.jpg': 218,
					'https://gf3.geo.gfsrv.net/cdn87/1febaddff40e056ce9bf0c1ac930f8.jpg': 218,
					'https://gf3.geo.gfsrv.net/cdne2/b8d8d18f2baf674acedb7504c7cc83.jpg': 219,
					'https://gf2.geo.gfsrv.net/cdn72/56a8934f9a63b45d1294eea63767e5.jpg': 219,
					'https://gf1.geo.gfsrv.net/cdn93/4c4fbd313bc449e16f5212f23d6311.jpg': 401,
					'https://gf2.geo.gfsrv.net/cdnaf/b5d139528cdf1233e61bd58184e1c5.jpg': 401,
					'https://gf2.geo.gfsrv.net/cdn19/68e11c389f7f62134def76575b27e5.jpg': 402,
					'https://gf2.geo.gfsrv.net/cdn7d/34b3f95bf2d4e3355fed09a3e1877e.jpg': 402,
					'https://gf2.geo.gfsrv.net/cdnae/3adede7d38b3ecfc7457375a4cd2a5.jpg': 403,
					'https://gf2.geo.gfsrv.net/cdnd4/9d88c2d9b8e5872bef32a7f8659695.jpg': 403,
					'https://gf2.geo.gfsrv.net/cdndb/2e7227f88e3601612093ee2e9101e0.jpg': 404,
					'https://gf3.geo.gfsrv.net/cdn2c/0fc6c29d06858b5b9ca0b0a4d1532e.jpg': 404,
					'https://gf1.geo.gfsrv.net/cdn01/2add2bd4bf0cbcf07f779bf85d43cc.jpg': 405,
					'https://gf2.geo.gfsrv.net/cdn11/4dd51eeb4ab03af617828169bffd5b.jpg': 405,
					'https://gf1.geo.gfsrv.net/cdn0c/ceed170b2583498228e9ab6b087af1.jpg': 406,
					'https://gf1.geo.gfsrv.net/cdn07/ea3e0adf01fb3cf64e1938a7c55dfb.jpg': 406,
					'https://gf1.geo.gfsrv.net/cdn93/58390eb6945e04861c99eb311366cc.jpg': 407,
					'https://gf2.geo.gfsrv.net/cdna9/4d20894a828929ff5a61f62c757149.jpg': 407,
					'https://gf1.geo.gfsrv.net/cdn95/1c77121b235b5a9e9591c7c78883d3.jpg': 408,
					'https://gf2.geo.gfsrv.net/cdnda/533c32ff26f4db6857e3e41c09d443.jpg': 408,
					'https://gf2.geo.gfsrv.net/cdnd1/fb4e438cabd12ef1b0500a0f41abc1.jpg': 502,
					'https://gf2.geo.gfsrv.net/cdn7a/40a392214240328e42014108815526.jpg': 502,
					'https://gf2.geo.gfsrv.net/cdn47/36221e9493458b9fcc776bf350983e.jpg': 503,
					'https://gf2.geo.gfsrv.net/cdn19/2cf0473c0bb2e5cf3135358ccc4edf.jpg': 503
				},
				moon: {
					buildings: [4, 12, 14, 21, 22, 23, 24, 41, 42, 43]
				},
				planet: {
					buildings: [4, 12, 14, 15, 21, 22, 23, 24, 31, 33, 34, 36, 44],
					lifeforms: {
						all: [
							11101, 11102, 11103, 11104, 11105, 11106, 11107, 11108, 11109, 11110, 11111, 11112,
							11201, 11202, 11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 11213, 11214, 11215, 11216, 11217, 11218,
							12101, 12102, 12103, 12104, 12105, 12106, 12107, 12108, 12109, 12110, 12111, 12112,
							12201, 12202, 12203, 12204, 12205, 12206, 12207, 12208, 12209, 12210, 12211, 12212, 12213, 12214, 12215, 12216, 12217, 12218,
							13101, 13102, 13103, 13104, 13105, 13106, 13107, 13108, 13109, 13110, 13111, 13112,
							13201, 13202, 13203, 13204, 13205, 13206, 13207, 13208, 13209, 13210, 13211, 13212, 13213, 13214, 13215, 13216, 13217, 13218,
							14101, 14102, 14103, 14104, 14105, 14106, 14107, 14108, 14109, 14110, 14111, 14112,
							14201, 14202, 14203, 14204, 14205, 14206, 14207, 14208, 14209, 14210, 14211, 14212, 14213, 14214, 14215, 14216, 14217, 14218
						],
						buildings: [
							11101, 11102, 11103, 11104, 11105, 11106, 11107, 11108, 11109, 11110, 11111, 11112,
							12101, 12102, 12103, 12104, 12105, 12106, 12107, 12108, 12109, 12110, 12111, 12112,
							13101, 13102, 13103, 13104, 13105, 13106, 13107, 13108, 13109, 13110, 13111, 13112,
							14101, 14102, 14103, 14104, 14105, 14106, 14107, 14108, 14109, 14110, 14111, 14112
						],
						researches: [
							11201, 11202, 11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 11213, 11214, 11215, 11216, 11217, 11218,
							12201, 12202, 12203, 12204, 12205, 12206, 12207, 12208, 12209, 12210, 12211, 12212, 12213, 12214, 12215, 12216, 12217, 12218,
							13201, 13202, 13203, 13204, 13205, 13206, 13207, 13208, 13209, 13210, 13211, 13212, 13213, 13214, 13215, 13216, 13217, 13218,
							14201, 14202, 14203, 14204, 14205, 14206, 14207, 14208, 14209, 14210, 14211, 14212, 14213, 14214, 14215, 14216, 14217, 14218
						]
					},
					mines: [1, 2, 3]
				},
				researches: [106, 108, 109, 110, 111, 113, 114, 115, 117, 118, 120, 121, 122, 123, 124, 199],
				units: {
					all: [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 217, 218, 219, 401, 402, 403, 404, 405, 406, 407, 408, 502, 503],
					defences: [401, 402, 403, 404, 405, 406, 407, 408, 502, 503],
					ships: {
						all: [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 217, 218, 219],
						statics: [212, 217]
					}
				}
			}
		}
		class Temperatures {
			static get_deuterium_production_bonus( value ){
				return 1.44 - .004 * value;
			}
		}
		class Unit {
			static get_costs_from( id, technology, rates ){
				let result = 0;
				if( technology?.value ){
					const cost = Technologies.costs[ id ];
					result += cost.metal * technology.value / rates.metal;
					result += cost.crystal * technology.value / rates.crystal;
					result += cost.deuterium * technology.value / rates.deuterium;
				}
				return result;
			}
			static get_costs_upgrade_from( id, technology, rates ){
				let result = 0;
				if( technology?.upgrade ){
					const cost = Technologies.costs[ id ];
					result += cost.metal * technology.upgrade / rates.metal;
					result += cost.crystal * technology.upgrade / rates.crystal;
					result += cost.deuterium * technology.upgrade / rates.deuterium;
				}
				return result;
			}
		}
		class Upgradable {
			static get_costs_from( id, technology, rates ){
				let result = 0;
				if( technology?.value ){
					const cost = Technologies.costs[ id ];
					for( let i = 1; i <= technology.value; i++ ){
						result += this.get_costs_level_from( i, cost, rates );
					}
				}
				return result;
			}
			static get_costs_upgrade_from( id, technology, rates ){
				let result = 0;
				if( technology?.upgrade ){
					const cost = Technologies.costs[ id ];
					for( let i = technology.value + 1; i <= technology.upgraded; i++ ){
						result += this.get_costs_level_from( i, cost, rates );
					}
				}
				return result;
			}
			static get_costs_level_from( value, cost, rates ){
				let result = 0;
				result += Math.floor( cost.metal * cost.coefficient ** ( value - 1 ) ) / rates.metal;
				result += Math.floor( cost.crystal * cost.coefficient ** ( value - 1 ) ) / rates.crystal;
				result += Math.floor( cost.deuterium * cost.coefficient ** ( value - 1 ) ) / rates.deuterium;
				return result;
			}
		}
		class Moon extends Body {
			static get_costs_buildings_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.moon.buildings ){
						const technology = technologies[ id ];
						if( technology ){
							result += Upgradable.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_costs_upgrades_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.moon.buildings ){
						const technology = technologies[ id ];
						if( technology?.upgrade ){
							result += Upgradable.get_costs_upgrade_from( id, technology, rates );
						}
					}
					for( const id of Technologies.ids.units.all ){
						const technology = technologies[ id ];
						if( technology?.upgrade ){
							result += Unit.get_costs_upgrade_from( id, technology, rates );
						}
					}
				}
				return result;
			}
		}
		class Planet extends Body {
			static get_costs_buildings_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.planet.buildings ){
						const technology = technologies[ id ];
						if( technology ){
							result += Upgradable.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_costs_lifeforms_buildings_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.planet.lifeforms.buildings ){
						const technology = technologies[ id ];
						if( technology ){
							result += Lifeform.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_costs_lifeforms_researches_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.planet.lifeforms.researches ){
						const technology = technologies[ id ];
						if( technology ){
							result += Lifeform.get_costs_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_costs_mines_from( technologies, rates ){
				const metal = Planet.get_costs_mines_metal_from( technologies, rates );
				const crystal = Planet.get_costs_mines_crystal_from( technologies, rates );
				const deuterium = Planet.get_costs_mines_deuterium_from( technologies, rates );
				return metal + crystal + deuterium;
			}
			static get_costs_mines_metal_from( technologies, rates ){
				const id = 1;
				const technology = technologies?.[ id ];
				return technology ? Upgradable.get_costs_from( id, technology, rates ) : 0;
			}
			static get_costs_mines_crystal_from( technologies, rates ){
				const id = 2;
				const technology = technologies?.[ id ];
				return technology ? Upgradable.get_costs_from( id, technology, rates ) : 0;
			}
			static get_costs_mines_deuterium_from( technologies, rates ){
				const id = 3;
				const technology = technologies?.[ id ];
				return technology ? Upgradable.get_costs_from( id, technology, rates ) : 0;
			}
			static get_costs_upgrades_from( technologies, rates ){
				let result = 0;
				if( technologies ){
					for( const id of Technologies.ids.planet.buildings ){
						const technology = technologies[ id ];
						if( technology?.upgrade ){
							result += Upgradable.get_costs_upgrade_from( id, technology, rates );
						}
					}
					for( const id of Technologies.ids.planet.mines ){
						const technology = technologies[ id ];
						if( technology?.upgrade ){
							result += Upgradable.get_costs_upgrade_from( id, technology, rates );
						}
					}
					for( const id of Technologies.ids.planet.lifeforms.all ){
						const technology = technologies[ id ];
						if( technology?.upgrade ){
							result += Lifeform.get_costs_upgrade_from( id, technology, rates );
						}
					}
					for( const id of Technologies.ids.units.all ){
						const technology = technologies[ id ];
						if( technology?.upgrade ){
							result += Unit.get_costs_upgrade_from( id, technology, rates );
						}
					}
				}
				return result;
			}
			static get_productions_upgraded_from( data, position, rates ){
				const mines = Planet.get_productions_upgraded_mines_from( data, position, rates );
				const crawlers = Planet.get_productions_upgraded_crawlers_from( data, position, mines );
				const plasma = Planet.get_productions_upgraded_plasma_from( data, mines );
				const classes = Planet.get_productions_classes_from( data, mines );
				const officers = Planet.get_productions_officers_from( data, mines );
				return mines.total + crawlers + plasma + classes + officers;
			}
			static get_productions_upgraded_mines_from( data, position, rates ){
				const metal = Planet.get_productions_upgraded_mines_metal_from( data, position, rates );
				const crystal = Planet.get_productions_upgraded_mines_crystal_from( data, position, rates );
				const deuterium = Planet.get_productions_upgraded_mines_deuterium_from( data, position, rates );
				const total = metal + crystal + deuterium;
				return {
					metal,
					crystal,
					deuterium,
					total
				};
			}
			static get_productions_upgraded_mines_metal_from( data, position, rates ){
				const speed = data.game.universe.speed;
				const level = position.planet.technologies[1].upgraded;
				const bonus = Position.get_metal_production_bonus( position.location );
				return Math.round( 30 * level * 1.1 ** level * bonus * speed ) / rates.metal;
			}
			static get_productions_upgraded_mines_crystal_from( data, position, rates ){
				const speed = data.game.universe.speed;
				const level = position.planet.technologies[2].upgraded;
				const bonus = Position.get_crystal_production_bonus( position.location );
				return Math.round( 20 * level * 1.1 ** level * bonus * speed ) / rates.crystal;
			}
			static get_productions_upgraded_mines_deuterium_from( data, position, rates ){
				const speed = data.game.universe.speed;
				const level = position.planet.technologies[3].upgraded;
				const temperature = position.planet.temperatures.max;
				const bonus = Temperatures.get_deuterium_production_bonus( temperature );
				return Math.round( 10 * level * 1.1 ** level * bonus * speed ) / rates.deuterium;
			}
			static get_productions_upgraded_crawlers_from( data, position, productions ){
				const bonus = data.game.player.class === 'miner' ? 1.5 : 1;
				const factor = bonus;
				const count = position.planet.technologies[217].upgraded;
				return productions.total * Math.min( .5, .02 * bonus * factor * count );
			}
			static get_productions_upgraded_plasma_from( data, productions ){
				const level = data.game.player.researches[122].upgraded;
				const metal = productions.metal * .01 * level;
				const crystal = productions.crystal * .0066 * level;
				const deuterium = productions.deuterium * .0033 * level;
				return metal + crystal + deuterium;
			}
			static get_productions_classes_from( data, productions ){
				const player = data.game.player;
				const miner_bonus = player.class === 'miner' ? .25 : 0;
				const trader_bonus = player?.alliance?.class === 'trader' ? .05 : 0;
				return productions.total * ( miner_bonus + trader_bonus );
			}
			static get_productions_officers_from( data, productions ){
				const officers = data.game.player.officers;
				let bonus = officers.geologist ? .1 : 0;
				bonus += officers.all ? .02 : 0;
				return productions.total * bonus;
			}
		}
		class Lifeform extends Upgradable {
			static get_costs_level_from( value, cost, rates ){
				let result = 0;
				result += Math.floor( cost.metal * cost.coefficient ** ( value - 1 ) * value ) / rates.metal;
				result += Math.floor( cost.crystal * cost.coefficient ** ( value - 1 ) * value ) / rates.crystal;
				result += Math.floor( cost.deuterium * cost.coefficient ** ( value - 1 ) * value ) / rates.deuterium;
				return result;
			}
		}
		return {
			moon: Moon,
			planet: Planet,
			positions: Positions,
			researches: Researches,
			technologies: Technologies,
			upgradable: Upgradable
		};
	})();
	const Colors = (function(){
		return {
			defaults: {
				main: '#6f9fc8',
				mines: '#eb782d',
				planets_buildings: '#9c3d00',
				moons_buildings: '#83919c',
				lifeforms_buildings: '#6c56a3',
				lifeforms_researches: '#95559f',
				researches: '#0077b6',
				defences: '#16bd05',
				ships: '#e30613',
				crawlers: '#eb782d',
				metal: '#a9a9a9',
				crystal: '#8dceec',
				deuterium: '#6cc6a3'
			},
			user: {
				mines: '#eb782d',
				planets_buildings: '#9c3d00',
				moons_buildings: '#83919c',
				lifeforms_buildings: '#6c56a3',
				lifeforms_researches: '#95559f',
				researches: '#0077b6',
				defences: '#16bd05',
				ships: '#e30613',
				metal: '#a9a9a9',
				crystal: '#8dceec',
				deuterium: '#6cc6a3'
			}
		};
	})();
	const Components = (function(){
		const Chart = (function(){
			function get_html_from( data ){
				const slices = get_html_slices_from( data );
				return `<svg viewBox="0 0 100 100" transform="rotate(-90)">${ slices }</svg>`;
			}
			function get_html_slices_from( data ){
				let	rotation = 0;
				let result = '';
				for( const key in data ){
					const { percent, color } = data[ key ];
					result += get_html_slice_from( percent, color, rotation );
					rotation += percent;
				}
				return result;
			}
			function get_html_slice_from( percent, color, rotation ){
				const offset = 2 * Math.PI * 25;
				return `<circle cx=50 cy=50 r=25
								fill=transparent
								stroke=${ color }
								stroke-width=50
								stroke-dasharray="${ percent * offset } ${ offset }"
								transform="rotate( ${ rotation * 360 } 50 50 )"/>`;
			}
			return {
				get_html_from
			}
		})();
		const Energy = (function(){
			function init_from( data ){
				const positions = data.game.player.positions;
				for( const coordinates in positions ){
					const planet = positions[ coordinates ].planet;
					if( planet.id && planet.resources?.energy < 0 ){
						const element = document.querySelector( `#planet-${ planet.id } .planet-name` );
						element.classList.add( 'ic_energy-warning' );
					}
				}
			}
			return {
				init_from
			};
		})();
		const Highscores = (function(){
			function init_from( data ){
				set_gaps_from( data );
				get_highscores();
			}
			function set_gaps_from( data ){
				const points = data.game.universe.highscores[ currentCategory ][ currentType ].player.points;
				for( const element of document.querySelectorAll( '#ranks tbody tr:not( .myrank ) .score' ) ){
					const value = Types.get_number_from( element.firstChild.textContent );
					const difference = value - points;
					let content = difference > 0 ? '+' : '';
					content += Types.get_string_number_full_from( difference );
					element.title = content;
					element.classList.add( 'tooltipRight' );
				}
			}
			async function get_highscores(){
				const selector = '#stat_list_content';
				await Scraper.element_has_changed( selector );
				await Scraper.element_has_changed( selector );
				const storage = Storage.get();
				const scraper = await Scraper.get();
				const data = Data.get_from( storage, scraper );
				Storage.set_from( data );
				Highscores.init_from( data );
			}
			return {
				init_from
			};
		})();
		const Menu = (function(){
			function init(){
				set_html();
			}
			function set_html(){
				const result = `<li id="ic_menu-button">
									<span class="menu_icon">
										<div class="tooltipRight">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960">
											<path fill="currentColor" d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Z"/>
										</svg>
										</div>
									</span>
									<a class="menubutton" href="${ Translation.support_link }" target="_blank">
										<span class="textlabel">InfoCompte ${ GM_info.script.version }</span>
									</a>
								</li>`;
				document.querySelector( '#menuTable' ).innerHTML += result;
			}
			return {
				init
			};
		})();
		const Overview = (function(){
			const Panels = (function(){
				const Account = (function(){
					function get_html_from( data ){
						const { points, percents, positions, chart } = get_data_from( data );
						return `<div id="ic_account-points-panel" class="ic_panel" data-state="expanded">
									<h3 class="ic_panel_title"><span></span>${ Translation.points_repartition }</h3>
									<div class="ic_panel_main">
										<table>
											<tr>
												<th>${ Translation.mines }</th>
												<td>${ points.planets.mines.all } — <span class="ic_percent">${ percents.planets.mines.all }</span></td>
											</tr>
											<tr>
												<th>${ Translation.planets_buildings }</th>
												<td>${ points.planets.buildings } — <span class="ic_percent">${ percents.planets.buildings }</span></td>
											</tr>
											<tr>
												<th>${ Translation.moons_buildings }</th>
												<td>${ points.moons.buildings } — <span class="ic_percent">${ percents.moons.buildings }</span></td>
											</tr>
											<tr>
												<th>${ Translation.lifeforms_buildings }</th>
												<td>${ points.planets.lifeforms.buildings } — <span class="ic_percent">${ percents.planets.lifeforms.buildings }</span></td>
											</tr>
											<tr>
												<th>${ Translation.lifeforms_researches }</th>
												<td>${ points.planets.lifeforms.researches } — <span class="ic_percent">${ percents.planets.lifeforms.researches }</span></td>
											</tr>
											<tr>
												<th>${ Translation.researches }</th>
												<td>${ points.researches } — <span class="ic_percent">${ percents.researches }</span></td>
											</tr>
											<tr>
												<th>${ Translation.ships }</th>
												<td>${ points.units.ships.all } — <span class="ic_percent">${ percents.units.ships.all }</span></td>
											</tr>
											<tr>
												<th>${ Translation.defences }</th>
												<td>${ points.units.defences } — <span class="ic_percent">${ percents.units.defences }</span></td>
											</tr>
											<tr>
												<th>${ Translation.indestructibles }</th>
												<td>
													<div>${ points.indestructibles } — <span class="ic_percent">${ percents.indestructibles }</span></div>
													<div>- ${ positions.if_destroyed } ${ Translation.if_destroyed }</div>
												</td>
											</tr>
											<tr>
												<th>${ Translation.upgrades }</th>
												<td>
													<div>${ points.upgrades } — <span class="ic_percent">${ percents.upgrades }</span></div>
													<div>+ ${ positions.when_finished } ${ Translation.when_finished }</div>
												</td>
											</tr>
										</table>
										${ Chart.get_html_from( chart ) }
									</div>
								</div>`;
					}
					function get_data_from( data ){
						const { points, percents } = data.game.player;
						return {
							points: get_data_points_from( points ),
							percents: get_data_percents_from( percents ),
							positions: get_data_positions_from( data ),
							chart: get_data_chart_from( data )
						};
					}
					function get_data_points_from( data ){
						const result = {};
						for( const key in data ){
							const value = data[ key ];
							if( Types.are_objects( value ) ){
								result[ key ] = get_data_points_from( value );
							}else{
								result[ key ] = Types.get_string_number_truncated_from( value );
							}
						}
						return result;
					}
					function get_data_percents_from( data ){
						const result = {};
						for( const key in data ){
							const value = data[ key ];
							if( Types.are_objects( value ) ){
								result[ key ] = get_data_percents_from( value );
							}else{
								result[ key ] = Types.get_percent_from( value );
							}
						}
						return result;
					}
					function get_data_positions_from( data ){
						const positions = data.game.universe.highscores?.[1][0].player.positions;
						const result = {
							if_destroyed: 0,
							when_finished: 0
						};
						if( positions ){
							result.if_destroyed = positions.if_destroyed - positions.current;
							result.when_finished = positions.current - positions.when_finished;
						}
						return result;
					}
					function get_data_chart_from( data ){
						const percents = data.game.player.percents;
						const colors = data.script.colors.user;
						return {
							mines: {
								percent: percents.planets.mines.all,
								color: colors.mines
							},
							planets_buildings: {
								percent: percents.planets.buildings,
								color: colors.planets_buildings
							},
							moons_buildings: {
								percent: percents.moons.buildings,
								color: colors.moons_buildings
							},
							lifeforms_buildings: {
								percent: percents.planets.lifeforms.buildings,
								color: colors.lifeforms_buildings
							},
							lifeforms_researches: {
								percent: percents.planets.lifeforms.researches,
								color: colors.lifeforms_researches
							},
							researches: {
								percent: percents.researches,
								color: colors.researches
							},
							ships: {
								percent: percents.units.ships.all,
								color: colors.ships
							},
							defences: {
								percent: percents.units.defences,
								color: colors.defences
							}
						};
					}
					return {
						get_html_from
					};
				})();
				const Positions = (function(){
					function get_html_from( data ){
						const rows = get_html_rows_from( get_data_from( data ) );
						return `<div id="ic_positions-points-panel" class="ic_panel" data-state="collapsed">
								<h3 class="ic_panel_title"><span></span>${ Translation.planets_points_repartition }</h3>
								<div class="ic_panel_main">
									<table>
										${ rows }
									</table>
								</div>
							</div>`;
					}
					function get_html_rows_from( positions ){
						let result = '';
						for( const coordinates in positions ){
							const position = positions[ coordinates ];
							result += `<tr>
										<th>${ coordinates }</th>
										<td>${ get_html_cells_names_from( position ) }</td>
										<td>${ get_html_cells_mines_from( position ) }</td>
										<td>${ get_html_cells_buildings_from( position ) }</td>
										<td>${ get_html_cells_lifeforms_buildings_from( position ) }</td>
										<td>${ get_html_cells_lifeforms_researches_from( position ) }</td>
										<td>${ get_html_cells_defences_from( position ) }</td>
										<td>${ get_html_cells_all_from( position ) }</td>
									</tr>`;
						}
						return result;
					}
					function get_html_cells_names_from( position ){
						const { moon, planet } = position;
						let result = `<div>${ planet.name }</div>`;
						result += moon ? `<div>${ moon.name }</div>` : '';
						return result;
					}
					function get_html_cells_mines_from( position ){
						const result = get_html_span_from( position.planet.points.mines.all );
						return `<div>${ result }</div>`;
					}
					function get_html_cells_buildings_from( position ){
						const { moon, planet } = position;
						let result = `<div>${ get_html_span_from( planet.points.buildings ) }</div>`;
						result += moon ? `<div>${ get_html_span_from( moon.points.buildings ) }</div>` : '';
						return result;
					}
					function get_html_cells_lifeforms_buildings_from( position ){
						const result = get_html_span_from( position.planet.points.lifeforms.buildings );
						return `<div>${ result }</div>`;
					}
					function get_html_cells_lifeforms_researches_from( position ){
						const result = get_html_span_from( position.planet.points.lifeforms.researches );
						return `<div>${ result }</div>`;
					}
					function get_html_cells_defences_from( position ){
						const { moon, planet } = position;
						let result = `<div>${ get_html_span_from( planet.points.units.defences ) }</div>`;
						result += moon ? `<div>${ get_html_span_from( moon.points.units.defences ) }</div>` : '';
						return result;
					}
					function get_html_cells_all_from( position ){
						const { moon, planet } = position;
						let result = `<div>
										${ get_html_span_from( planet.points.statics ) }
										 —
										<span class="ic_percent">${ planet.percent }</span>
									</div>`;
						if( moon ){
							result +=`<div>
										${ get_html_span_from( moon.points.statics ) }
										 —
										<span class="ic_percent">${ moon.percent }</span>
									</div>`;
						}
						return result;
					}
					function get_html_span_from( points ){
						return `<span class="tooltipRight" title="${ points.full }">${ points.compact }</span>`;
					}
					function get_data_from( data ){
						const player = data.game.player;
						const positions = player.positions;
						const points = player.points.positions;
						const percents = player.percents.positions;
						const result = {};
						for( const coordinates in positions ){
							const { moon, planet } = positions[ coordinates ];
							const position = result[ coordinates ] = {
								planet: {
									name: planet.name || Translation.planet,
									points: get_data_points_from( points[ coordinates ].planet ),
									percent: Types.get_percent_from( percents[ coordinates ].planet.statics )
								}
							};
							if( moon ){
								position.moon = {
									name: moon.name || Translation.moon,
									points: get_data_points_from( points[ coordinates ].moon ),
									percent: Types.get_percent_from( percents[ coordinates ].moon.statics )
								};
							}
						}
						return result;
					}
					function get_data_points_from( data ){
						const result = {};
						for( const key in data ){
							const value = data[ key ];
							if( Types.are_objects( value ) ){
								result[ key ] = get_data_points_from( value );
							}else{
								result[ key ] = {
									full: Types.get_string_number_truncated_from( value ),
									compact: Types.get_string_number_compact_from( value )
								}
							}
						}
						return result;
					}
					return {
						get_html_from
					};
				})();
				const Productions = (function(){
					function get_html_from( data ){
                        console.log("hi")
                        console.log(data.game.player.productions)
						const { basic, mines, lifeforms, bonuses, crawlers, classes, plasma, total, rates } = get_data_from( data );
						return `<div id="ic_productions-panel" class="ic_panel" data-state="collapsed">
									<h3 class="ic_panel_title"><span></span>${ Translation.daily_productions }</h3>
									<div class="ic_panel_main">
										<table>
											<tr>
												<th></th>
												<th>${ Translation.metal}</th>
												<th>${ Translation.crystal}</th>
												<th>${ Translation.deuterium}</th>
												<th><abbr title="${ Translation.deuterium_equivalent } ( ${ rates.metal }/${ rates.crystal }/${ rates.deuterium } )">${ Translation.total } (DSU)</abbr></th>
											</tr>
                                            <tr>
                                                <th>${ Translation.basic }</th>
                                                <td>${ basic.metal } </td>
                                                <td>${ basic.crystal }</td>
                                                <td>${ basic.deuterium }</td>
                                                <td>${ basic.all }</td>
											<tr>
												<th>${ Translation.mines }</th>
												<td>${ mines.metal}</td>
												<td>${ mines.crystal}</td>
												<td>${ mines.deuterium }</td>
												<td>${ mines.all}</td>
											</tr>
											<tr>
												<th>${ Translation.lifeforms }</th>
												<td>${ lifeforms.metal }</td>
												<td>${ lifeforms.crystal }</td>
												<td>${ lifeforms.deuterium }</td>
												<td>${ lifeforms.all }</td>
											</tr>
                                            <tr>
                                                <th>${ Translation[217] }</th>
                                                <td>${ crawlers.metal }</td>
                                                <td>${ crawlers.crystal }</td>
                                                <td>${ crawlers.deuterium }</td>
                                                <td>${ crawlers.all }</td>
                                            <tr>
												<th>${ Translation[122] }</th>
												<td>${ plasma.metal }</td>
												<td>${ plasma.crystal }</td>
												<td>${ plasma.deuterium }</td>
												<td>${ plasma.all }</td>
											</tr>
											<tr>
												<th>${ Translation.objects } & ${ Translation.officers }</th>
												<td>${ bonuses.metal }</td>
												<td>${ bonuses.crystal }</td>
												<td>${ bonuses.deuterium }</td>
												<td>${ bonuses.all }</td>
											</tr>
                                            <tr>
												<th>${ Translation.classes }</th>
												<td>${ classes.metal }</td>
												<td>${ classes.crystal }</td>
												<td>${ classes.deuterium }</td>
												<td>${ classes.all }</td>
											</tr>
                                            <tr style="border-bottom:1px solid black">
                                                <th></th>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
											<tr>
												<th>${ Translation.total }</th>
												<td>${ total.metal }</td>
												<td>${ total.crystal }</td>
												<td>${ total.deuterium }</td>
												<td>${ total.all }</td>
											</tr>
										</table>
									</div>
								</div>`;
					}
					function get_data_from( data ){
						const productions = data.game.player.productions;
						const rates = data.script.rates;
						const result = {};
						for( const key in productions ){
							const value = productions[ key ];
							result[ key ] = {
								all: Types.get_string_number_truncated_from( value.metal * 24 / rates.metal + value.crystal * 24 / rates.crystal + value.deuterium * 24 / rates.deuterium ),
								metal: Types.get_string_number_truncated_from( value.metal * 24 ),
								crystal: Types.get_string_number_truncated_from( value.crystal * 24 ),
								deuterium: Types.get_string_number_truncated_from( value.deuterium * 24 )
							}
						}
						result.rates = {
							metal: Types.get_string_number_full_from( parseFloat( rates.metal ) ),
							crystal: Types.get_string_number_full_from( parseFloat( rates.crystal ) ),
							deuterium: Types.get_string_number_full_from( parseFloat( rates.deuterium ) )
						};
                        console.log("HELLO!")
                        console.log(result)
						return result;
					}
					return {
						get_html_from
					};
				})();
				const Amortizations = (function(){
					const Tables = (function(){
						const Mines = (function(){
							function get_next_rentabilities(){
								const data = Storage.get()
								const positions = data.game.player.positions;
								const results = {};
								for( const coordinates in positions ){
									const position = positions[ coordinates ];
									const technologies = position.planet.technologies;
									const result = results[ position.planet.name ] = {};
									for( let i = 1; i < 4; i++ ){
										result[ i ] = {
											level: technologies[ i ].upgraded + 1,
											rentability: Types.get_duration_from( get_next_rentability_from( data, position, i ) )
										};
									}
								}
								return results;
							}
							function get_next_rentability_from( data, position, id ){
								const technology = position.planet.technologies[ id ];
								const rates = data.script.rates;
								// save inital values before manual upgrade
								const initial_production = Classes.planet.get_productions_upgraded_from( data, position, rates );
								const initial_value = technology.value;
								const initial_upgrade = technology.upgrade;
								const initial_upgraded = technology.upgraded;
								// set manual upgrade
								technology.value = technology.upgraded;
								technology.upgrade = 1;
								technology.upgraded = technology.value + 1;
								// compute needed values
								const upgrade_cost = Classes.upgradable.get_costs_upgrade_from( id, technology, rates );
								const upgraded_production = Classes.planet.get_productions_upgraded_from( data, position, rates );
								// restore initial values
								technology.value = initial_value;
								technology.upgrade = initial_upgrade;
								technology.upgraded = initial_upgraded;
								// return result
								const production_gains = upgraded_production - initial_production;
								return upgrade_cost / production_gains;
							}
							function get_html_from( data ){
								let result = '';
								if( data ){
									result = `<table id="ic_amortizations-tables_mines">
												<caption>${ Translation.mines }</caption>
												<tbody>${ get_html_rows_from( data ) }</tbody>
											</table>`;
								}
								return result;
							}
							function get_html_rows_from( data ){
								let result = '';
								for( const key in data ){
									const { 1: metal, 2: crystal, 3: deuterium } = data[ key ];
									result += `<tr>
												<th>${ key }</th>
												<td>
													<div>${ Translation.metal } ${ metal.level }</div>
													<div>${ metal.rentability }</div>
												</td>
												<td>
													<div>${ Translation.crystal } ${ crystal.level }</div>
													<div>${ crystal.rentability }</div>
												</td>
												<td>
													<div>${ Translation.deuterium } ${ deuterium.level }</div>
													<div>${ deuterium.rentability }</div>
												</td>
											</tr>`;
								}
								return result;
							}
							return {
								get_next_rentabilities,
								get_next_rentability_from,
								get_html_from
							};
						})();
						const Researches = (function(){
							const Astrophysics = (function(){
								function get_next_rentabilities(){
									const data = Storage.get();
									const technology = data.game.player.researches[124];
									const result = {};
									for( let i = 0; i < 3; i++ ){
										const rentability = get_next_rentability_from( data );
										technology.value = Math.ceil( technology.value * .5 ) * 2 + 1;
										technology.upgraded = technology.value;
										const level = `${ technology.upgraded - 1 }/${ technology.upgraded }`;
										result[ level ] = Types.get_duration_from( rentability );
									}
									return result;
								}
								function get_next_rentability_from( data ){
									const positions = data.game.player.positions;
									const technology = data.game.player.researches[124];
									const rates = data.script.rates;
									// save inital values before manual upgrade
									const initial_production = Classes.positions.get_productions_upgraded_from( data, rates );
									const initial_planet_count = Object.values( positions ).length;
									const initial_value = technology.value;
									const initial_upgrade = technology.upgrade;
									const initial_upgraded = technology.upgraded;
									// set manual upgrade
									technology.upgraded = Math.round( technology.value * .5 ) * 2 + 1;
									technology.value = Math.max( 0, technology.upgraded - 2 );
									technology.upgrade = technology.upgraded - technology.value;
									// compute needed values
									const upgrade_cost = Classes.upgradable.get_costs_upgrade_from( 124, technology, rates );
									const mines_cost = Classes.positions.get_costs_mines_from( positions, rates ) / initial_planet_count;
									const upgraded_production = Classes.positions.get_productions_upgraded_from( data, rates );
									// restore initial values
									technology.value = initial_value;
									technology.upgrade = initial_upgrade;
									technology.upgraded = initial_upgraded;
									// return result
									return ( upgrade_cost + mines_cost  ) / ( upgraded_production - initial_production );
								}
								function get_html_from( data ){
									let result = `<th>${ Translation[124] }</th>`;
									for( const key in data ){
										const value =  data[ key ];
										result += `<td><div>${ key }</div><div>${ value }</div></td>`;
									}
									return result;
								}
								return {
									get_next_rentabilities,
									get_next_rentability_from,
									get_html_from
								};
							})();
							const Plasma = (function(){
								function get_next_rentabilities(){
									const data = Storage.get();
									const technology = data.game.player.researches[122];
									const result = {};
									for( let i = 0; i < 3; i++ ){
										const rentability = get_next_rentability_from( data );
										const level = technology.upgraded += 1;
										result[ level ] = Types.get_duration_from( rentability );
									}
									return result;
								}
								function get_next_rentability_from( data ){
									const positions = data.game.player.positions;
									const technology = data.game.player.researches[122];
									const rates = data.script.rates;
									// save inital values before manual upgrade
									const initial_production = Classes.positions.get_productions_upgraded_from( data, rates );
									const initial_value = technology.value;
									const initial_upgrade = technology.upgrade;
									const initial_upgraded = technology.upgraded;
									// set manual upgrade
									technology.value = technology.upgraded;
									technology.upgrade = 1;
									technology.upgraded = technology.value + 1;
									// compute needed values
									const upgrade_cost = Classes.upgradable.get_costs_upgrade_from( 122, technology, rates );
									const upgraded_production = Classes.positions.get_productions_upgraded_from( data, rates );
									// restore initial values
									technology.value = initial_value;
									technology.upgrade = initial_upgrade;
									technology.upgraded = initial_upgraded;
									// return result
									return upgrade_cost / ( upgraded_production - initial_production );
								}
								function get_html_from( data ){
									let result = `<th>${ Translation[122] }</th>`;
									for( const key in data ){
										const value =  data[ key ];
										result += `<td><div>${ key }</div><div>${ value }</div></td>`;
									}
									return result;
								}
								return {
									get_next_rentabilities,
									get_next_rentability_from,
									get_html_from
								};
							})();
							function get_next_rentabilities(){
								return {
									122: Plasma.get_next_rentabilities(),
									124: Astrophysics.get_next_rentabilities()
								};
							}
							function get_html_from( data ){
								let result = '';
								if( data ){
									result = `<table id="ic_amortizations-tables_researches">
												<caption>${ Translation.researches }</caption>
												<tbody>${ Plasma.get_html_from( data[122] ) }</tbody>
												<tbody>${ Astrophysics.get_html_from( data[124] ) }</tbody>
											</table>`;
								}
								return result;
							}
							return {
								astrophysics: Astrophysics,
								plasma: Plasma,
								get_next_rentabilities,
								get_html_from
							};
						})();
						const Queue = (function(){
							function get_next_rentabilities(){
								const data = Storage.get()
								const positions = data.game.player.positions;
								const researches = data.game.player.researches;
								const results = [];
								for( let i = 0; i < 50; i++ ){
									const rentabilities = get_next_rentabilities_from( data );
									const result = get_next_rentability_from( rentabilities );
									if( result.technology === 122 ){
										const technology = researches[122];
										technology.value = technology.upgraded;
										technology.upgraded = technology.value + 1;
										technology.upgrade = 1;
										result.title = `${ Translation[122] } ${ technology.upgraded }`;
									}else if( result.technology === 124 ){
										const technology = researches[124];
										technology.value = Math.ceil( technology.value * .5 ) * 2 + 1;
										technology.upgraded = technology.value;
										result.title = `${ Translation[124] } ${ technology.upgraded - 1 }/${ technology.upgraded }`;
									}else{
										const position = positions[ result.coordinates ];
										const technology = position.planet.technologies[ result.technology ];
										technology.value = technology.upgraded;
										technology.upgraded = technology.value + 1;
										technology.upgrade = 1;
										result.planet = positions[ result.coordinates ].planet.name;
										result.title = `${ Translation[ result.technology ] } ${ technology.upgraded }`;
									}
									results.push( result );
								}
								return results;
							}
							function get_next_rentabilities_from( data ){
								const positions = data.game.player.positions;
								const result = [];
								result[0] = {
									technology: 122,
									rentability: Researches.plasma.get_next_rentability_from( data )
								};
								result[1] = {
									technology: 124,
									rentability: Researches.astrophysics.get_next_rentability_from( data )
								};
								for( const coordinates in positions ){
									const position = positions[ coordinates ];
									for( let i = 1; i < 4; i++ ){
										result.push( {
											technology: i,
											rentability: Mines.get_next_rentability_from( data, position, i ),
											coordinates
										} );
									}
								}
								return result;
							}
							function get_next_rentability_from( data ){
								const result = {};
								result.rentability = Infinity;
								for( const element of data ){
									if( result.rentability > element.rentability ){
										result.rentability = element.rentability;
										result.technology = element.technology;
										result.coordinates = element.coordinates;
									}
								}
								return result;
							}
							function get_html_from( data ){
								let result = '';
								let i = 1;
								if( data ){
									for( const element of data ){
										result += `<tr>
														<th>${ i++ }.</th>
														<td>${ element.planet || '' }</td>
														<td class="ic_technology-${ element.technology }">
															<div>${ element.title }</div>
															<div>${ Types.get_duration_from( element.rentability ) }</div>
														</td>
													</tr>`;
									}
									result = `<table id="ic_amortizations-tables_queue">
												<caption>${ Translation.queue }</caption>
												<tbody>${ result }</tbody>
											</table>`;
								}
								return result;
							}
							return {
								get_next_rentabilities,
								get_html_from
							};
						})();
						function get_data(){
							return {
								mines: Mines.get_next_rentabilities(),
								researches: Researches.get_next_rentabilities(),
								queue: Queue.get_next_rentabilities()
							};
						}
						function get_html_from( data ){
							let result = Mines.get_html_from( data?.mines );
							result += Researches.get_html_from( data?.researches );
							result += Queue.get_html_from( data?.queue );
							return result;
						}
						function set_html_from( data ){
							const element = document.querySelector( '#ic_amortizations-tables' );
							let result = Mines.get_html_from( data.mines );
							result += Researches.get_html_from( data.researches );
							result += Queue.get_html_from( data.queue );
							element.innerHTML = result;
						}
						return {
							get_data,
							get_html_from,
							set_html_from
						};
					})();
					function get_html_from( data ){
						const tables = Tables.get_html_from( data.script.amortizations );
						return `<div id="ic_amortizations-panel" class="ic_panel" data-state="collapsed">
									<h3 class="ic_panel_title"><span></span>${ Translation.amortizations }</h3>
									<div class="ic_panel_main">
										<div id="ic_amortizations-tables">${ tables }</div>
										<button class="btn_blue">${ Translation.recalculate }</button>
									</div>
								</div>`;
					}
					function set_events(){
						const element = document.querySelector( '#ic_amortizations-panel button' );
						element.addEventListener( 'click', function( event ){
							event.preventDefault();
							try{
								const data = Storage.get();
								const result = Tables.get_data();
								data.script.amortizations = result
								Tables.set_html_from( result );
								Storage.set_from( data );
							}catch( error ){
								alert( Translation.data_alert );
							}
						} );
					}
					return {
						get_html_from,
						set_events
					};
				})();
				const Exports = (function(){
					const Texts = (function(){
						const Empire = (function(){
							function get_from( data ){
								return get_sections_title_from( `${ Translation.empire_of } ${ data.game.player.name } ${ Translation.on } ${ data.game.universe.name }.${ data.game.universe.language }` )
									 + get_sections_classes_from( data )
									 + get_sections_lifeforms_levels_from( data )
									 + get_sections_points_from( data )
									 + get_sections_production_from( data )
									 + get_sections_temperatures_from( data )
									 + get_sections_planets_fields_from( data )
									 + get_sections_planets_buildings_from( data )
									 + get_sections_moons_buildings_from( data )
									 + get_sections_lifeforms_buildings_from( data )
									 + get_sections_lifeforms_researches_from( data )
									 + get_sections_researches_from( data )
									 + get_sections_ships_from( data )
									 + get_sections_planets_defences_from( data )
									 + get_sections_moons_defences_from( data );
							}
							function get_sections_points_from( data ){
								const points = data.game.player.points;
								const percents = data.game.player.percents;
								const mines_points = Types.get_string_number_truncated_from( points.planets.mines.all );
								const mines_percent = Types.get_percent_from( percents.planets.mines.all );
								const planets_buildings_points = Types.get_string_number_truncated_from( points.planets.buildings );
								const planets_buildings_percent = Types.get_percent_from( percents.planets.buildings );
								const moons_buildings_points = Types.get_string_number_truncated_from( points.moons.buildings );
								const moons_buildings_percent = Types.get_percent_from( percents.moons.buildings );
								const lifeforms_buildings_points = Types.get_string_number_truncated_from( points.planets.lifeforms.buildings );
								const lifeforms_buildings_percent = Types.get_percent_from( percents.planets.lifeforms.buildings );
								const lifeforms_researches_points = Types.get_string_number_truncated_from( points.planets.lifeforms.researches );
								const lifeforms_researches_percent = Types.get_percent_from( percents.planets.lifeforms.researches );
								const researches_points = Types.get_string_number_truncated_from( points.researches );
								const researches_percent = Types.get_percent_from( percents.researches );
								const ships_points = Types.get_string_number_truncated_from( points.units.ships.all );
								const ships_percent = Types.get_percent_from( percents.units.ships.all );
								const defences_points = Types.get_string_number_truncated_from( points.units.defences );
								const defences_percent = Types.get_percent_from( percents.units.defences );
								const total_points = Types.get_string_number_truncated_from( points.total );
								const indestructibles_percent = Types.get_percent_from( percents.indestructibles );
								const indestructibles_suffix = `${ indestructibles_percent } ${ Translation.indestructibles.toLowerCase() }`;
								return get_sections_block( Translation.points_repartition, [
									[ Translation.mines, mines_points, null, mines_percent ],
									[ Translation.planets_buildings, planets_buildings_points, null, planets_buildings_percent ],
									[ Translation.moons_buildings, moons_buildings_points, null, moons_buildings_percent ],
									[ Translation.lifeforms_buildings, lifeforms_buildings_points, null, lifeforms_buildings_percent ],
									[ Translation.lifeforms_researches, lifeforms_researches_points, null, lifeforms_researches_percent ],
									[ Translation.researches, researches_points, null, researches_percent ],
									[ Translation.ships, ships_points, null, ships_percent ],
									[ Translation.defences, defences_points, null, defences_percent ],
									[ Translation.total, total_points, null, indestructibles_suffix ]
								] );
							}
							function get_sections_production_from( data ){
								const total = data.game.player.productions.total;
								const metal = Types.get_string_number_truncated_from( total.metal * 24 );
								const crystal = Types.get_string_number_truncated_from( total.crystal * 24 );
								const deuterium = Types.get_string_number_truncated_from( total.deuterium * 24 );
								return get_sections_block( Translation.daily_productions, [
									[ Translation.metal, metal ],
									[ Translation.crystal, crystal ],
									[  Translation.deuterium, deuterium ]
								] );
							}
							function get_sections_temperatures_from( data ){
								const positions = data.game.player.positions;
								const values = [];
								for( const coordinates in positions ){
									const temperature = positions[ coordinates ].planet.temperatures.max;
									values.push( temperature );
								}
								const rows = {
									'': {
										values
									}
								};
								return get_sections_inline( Translation.temperatures_maximum, rows, 0, get_average_from );
							}
							function get_sections_researches_from( data ){
								const researches = data.game.player.researches;
								const rows = [];
								for( const key in researches ){
									const research = researches[ key ];
									const row = [ Translation[ key ] ];
									if( research.upgrade ){
										row.push( research.upgraded, 'gold' );
									}else{
										row.push( research.value );
									}
									rows.push( row );
								}
								return get_sections_block( Translation.researches, rows );
							}
							function get_sections_ships_from( data ){
								const positions = data.game.player.positions;
								const values = {};
								const upgraded = {};
								const rows = [];
								for( const coordinates in positions ){
									const { planet, moon } = positions[ coordinates ];
									const ids = Classes.technologies.ids.units.ships.all;
									for( const key of ids ){
										const technology = planet.technologies[ key ];
										if( technology ){
											values[ key ] ||= 0;
											values[ key ] += technology.upgraded;
											upgraded[ key ] += technology.upgrade ? true : false;
										}
									}
									if( moon ){
										for( const key of ids ){
											const technology = moon.technologies[ key ];
											if( technology ){
												values[ key ] ||= 0;
												values[ key ] += technology.upgraded;
												upgraded[ key ] += technology.upgrade ? true : false;
											}
										}
									}
								}
								for( const key in values ){
									let value = values[ key ];
									if( value ){
										const row = [];
										row[0] = Translation[ key ];
										row[1] = Types.get_string_number_full_from( value );
										if( upgraded[ key ] ){
											row[2] = 'gold';
										}
										rows.push( row );
									}
								}
								return get_sections_block( Translation.ships, rows );
							}
							function get_sections_planets_fields_from( data ){
								const positions = data.game.player.positions;
								const maximum = [];
								const used = [];
								for( const coordinates in positions ){
									const fields = positions[ coordinates ].planet.fields;
									maximum.push( fields.maximum );
									used.push( fields.used );
								}
								const rows = {
									[ Translation.maximum ]: {
										values: maximum
									},
									[ Translation.used ]: {
										values: used
									}
								};
								return get_sections_inline( Translation.planet_fields, rows, 3, get_average_from );
							}
							function get_sections_planets_buildings_from( data ){
								const ids = Classes.technologies.ids.planet;
								const rows = get_sections_inline_technologies_from( data, 'planet', [ ...ids.mines, ...ids.buildings ] );
								return get_sections_inline( Translation.planets_buildings, rows, 2, get_sum_from );
							}
							function get_sections_planets_defences_from( data ){
								const rows = get_sections_inline_technologies_from( data, 'planet', Classes.technologies.ids.units.defences );
								return get_sections_inline( Translation.planets_defences, rows, 8, get_sum_from );
							}
							function get_sections_moons_buildings_from( data ){
								const rows = get_sections_inline_technologies_from( data, 'moon', Classes.technologies.ids.moon.buildings );
								return get_sections_inline( Translation.moons_buildings, rows, 2, get_sum_from );
							}
							function get_sections_lifeforms_buildings_from( data ){
								const rows = get_sections_inline_technologies_from( data, 'planet', Classes.technologies.ids.planet.lifeforms.buildings );
								return get_sections_inline( Translation.lifeforms_buildings, rows, 2, get_sum_from );
							}
							function get_sections_lifeforms_researches_from( data ){
								const rows = get_sections_inline_technologies_from( data, 'planet', Classes.technologies.ids.planet.lifeforms.researches );
								return get_sections_inline( Translation.lifeforms_researches, rows, 2, get_sum_from );
							}
							function get_sections_moons_defences_from( data ){
								const rows = get_sections_inline_technologies_from( data, 'moon', Classes.technologies.ids.units.defences );
								return get_sections_inline( Translation.planets_defences, rows, 8, get_sum_from );
							}
							function get_sections_block( subtitle, rows ){
								let result = '';
								for( const [ key, value, color, suffix ] of rows ){
									let content = `${ key } : `;
									content += get_colored_from( value, color || Colors.defaults.main );
									if( suffix ){
										content += ` · ${ suffix }`;
									}
									result += `${ content }\n`;
								}
								if( result ){
									result = get_sections_subtitle_from( subtitle )
											 + result
											 + '\n';
								}
								return result;
							}
							function get_sections_inline( subtitle, rows, digits, fn ){
								let result = '';
								for( const key in rows ){
									const { values, upgrades } = rows[ key ];
									let total = fn( values );
									if( total ){
										let content = [];
										let has_upgrade = false;
										for( let i = 0; i < values.length; i++ ){
											const value = values[ i ];
											const upgrade = upgrades?.[ i ];
											const padding = get_padding_from( value, digits );
											const colored = upgrade ? get_colored_from( value, 'gold' ) : value;
											if( upgrade ){
												has_upgrade = true;
											}
											content[ i ] = padding + colored;
										}
										total = Types.get_string_number_full_from( total );
										total = get_colored_from( total, has_upgrade ? 'gold' : Colors.defaults.main );
										content = content.join( ', ' );
										content = `${ content }  · ${ total } ${ key }\n`;
										result += content;
									}
								}
								if( result ){
									result = get_sections_subtitle_from( subtitle )
											 + result
											 + '\n';
								}
								return result;
							}
							function get_sections_inline_technologies_from( data, type, ids ){
								const positions = data.game.player.positions;
								const result = {};
								for( const coordinates in positions ){
									const body = positions[ coordinates ][ type ];
									if( body ){
										for( const id of ids ){
											const technology = body.technologies[ id ];
											if( technology ){
												const key = Translation[ id ]
												result[ key ] ||= {
													values: [],
													upgrades: []
												};
												if( technology.upgrade ){
													result[ key ].values.push( technology.upgraded );
													result[ key ].upgrades.push( true );
												}else{
													result[ key ].values.push( technology.value );
													result[ key ].upgrades.push( false );
												}
											}
										}
									}
								}
								return result;
							}
							return {
								get_from
							};
						})();
						const Production = (function(){
							function get_from( data ){
								return get_sections_title_from( `${ Translation.production_of } ${ data.game.player.name } ${ Translation.on } ${ data.game.universe.name }.${ data.game.universe.language }` )
									 + get_sections_classes_from( data )
									 + get_sections_points_from( data )
									 + get_sections_planets_from( data )
									 + get_sections_researches_from( data )
									 + get_sections_production_from( data )
							}
							function get_sections_planets_from( data ){
								const subtitle = get_sections_subtitle_from( Translation.planets );
								const positions = data.game.player.positions;
								let content = '';
								let i = 1;
								for( const coordinates in positions ){
									const { location, planet } = positions[ coordinates ];
									const { technologies, temperatures } = planet;
									content += get_planet_place_from( i++ );
									content += get_planet_location_from( location );
									content += get_planet_technology_from( technologies[1], Colors.defaults.metal, 2 );
									content += get_planet_technology_from( technologies[2], Colors.defaults.crystal, 2 );
									content += get_planet_technology_from( technologies[3], Colors.defaults.deuterium, 2 );
									content += get_planet_technology_from( technologies[217], Colors.defaults.crawlers, 0 );
									content += get_planet_temperature_from( temperatures.max );
								}
								return `${ subtitle + content }\n`;
							}
							function get_sections_points_from( data ){
								const subtitle = get_sections_subtitle_from( Translation.points_repartition );
								const mines = data.game.player.points.planets.mines;
								const metal = get_colored_from( Types.get_string_number_truncated_from( mines.metal ), Colors.defaults.metal );
								const crystal = get_colored_from( Types.get_string_number_truncated_from( mines.crystal ), Colors.defaults.crystal );
								const deuterium = get_colored_from( Types.get_string_number_truncated_from( mines.deuterium ), Colors.defaults.deuterium );
								const total = Types.get_string_number_truncated_from( mines.all );
								return subtitle
									   + `${ Translation[1] } : ${ metal }\n`
									   + `${ Translation[2] } : ${ crystal }\n`
									   + `${ Translation[3] } : ${ deuterium }\n`
									   + `${ Translation.total } : ${ total }\n\n`;
							}
							function get_sections_production_from( data ){
								const subtitle = get_sections_subtitle_from( Translation.daily_productions );
								const productions = data.game.player.productions;
								const mines = productions.mines;
								const bonuses = productions.bonuses;
								const lifeforms = productions.lifeforms;
								const total = productions.total;
								const mines_metal = get_colored_from( Types.get_string_number_truncated_from( mines.metal * 24 ), Colors.defaults.metal );
								const mines_crystal = get_colored_from( Types.get_string_number_truncated_from( mines.crystal * 24 ), Colors.defaults.crystal );
								const mines_deuterium = get_colored_from( Types.get_string_number_truncated_from( mines.deuterium * 24 ), Colors.defaults.deuterium );
								const lifeforms_metal = get_colored_from( Types.get_string_number_truncated_from( lifeforms.metal * 24 ), Colors.defaults.metal );
								const lifeforms_crystal = get_colored_from( Types.get_string_number_truncated_from( lifeforms.crystal * 24 ), Colors.defaults.crystal );
								const lifeforms_deuterium = get_colored_from( Types.get_string_number_truncated_from( lifeforms.deuterium * 24 ), Colors.defaults.deuterium );
								const bonuses_metal = get_colored_from( Types.get_string_number_truncated_from( bonuses.metal * 24 ), Colors.defaults.metal );
								const bonuses_crystal = get_colored_from( Types.get_string_number_truncated_from( bonuses.crystal * 24 ), Colors.defaults.crystal );
								const bonuses_deuterium = get_colored_from( Types.get_string_number_truncated_from( bonuses.deuterium * 24 ), Colors.defaults.deuterium );
								const total_metal = get_colored_from( Types.get_string_number_truncated_from( total.metal * 24 ), Colors.defaults.metal );
								const total_crystal = get_colored_from( Types.get_string_number_truncated_from( total.crystal * 24 ), Colors.defaults.crystal );
								const total_deuterium = get_colored_from( Types.get_string_number_truncated_from( total.deuterium * 24 ), Colors.defaults.deuterium );
								return subtitle
									   + `${ Translation.mines } : ${ mines_metal }, ${ mines_crystal }, ${ mines_deuterium }\n`
									   + `${ Translation.lifeforms } : ${ lifeforms_metal }, ${ lifeforms_crystal }, ${ lifeforms_deuterium }\n`
									   + `${ Translation.objects } & ${ Translation.officers } : ${ bonuses_metal }, ${ bonuses_crystal }, ${ bonuses_deuterium }\n`
									   + `${ Translation.total } : ${ total_metal }, ${ total_crystal }, ${ total_deuterium }\n\n`;
							}
							function get_sections_researches_from( data ){
								const researches = data.game.player.researches;
								const research = researches[ 122 ];
								const subtitle = get_sections_subtitle_from( Translation.researches );
								let content = '';
								if( research ){
									let value;
									let color;
									if( research.upgrade ){
										value = research.upgraded;
										color = 'gold';
									}else{
										value = research.value;
										color = Colors.defaults.main;
									}
									value = get_colored_from( value, color );
									content += `${ Translation[ 122 ] } : ${ value }\n`
								}
								return content ? `${ subtitle + content }\n` : '';
							}
							function get_planet_place_from( value ){
								return `${ value.toString().padStart( 2, '0' ) }. `;
							}
							function get_planet_location_from( value ){
								return `P${ value.toString().padStart( 2, '0' ) }, `;
							}
							function get_planet_technology_from( technology, color, padding ){
								let value;
								if( technology.upgrade ){
									value = technology.upgraded;
									color = 'gold';
								}else{
									value = technology.value;
								}
								return get_padding_from( value, padding ) + get_colored_from( Types.get_string_number_full_from( value ), color ) + ', ';
							}
							function get_planet_temperature_from( value ){
								return get_colored_from( value + ' °C', '#f5bbb4' ) + '\n';
							}
							return {
								get_from
							};
						})();
						function get_sections_title_from( value ){
							const date = new Date();
							const locale_date =  date.toLocaleDateString( 'fr-FR' );
							const locale_time = date.toLocaleTimeString( 'de-DE', { timeStyle: 'short' } );
							const url = `[url=https://board.fr.ogame.gameforge.com/index.php?thread/746302-infocompte/]InfoCompte ${ GM_info.script.version }[/url]`
							const title = get_sized_from( get_colored_from( value, Colors.defaults.main ), 24 );
							const stamp = `${ Translation.generated_on } ${ locale_date } ${ Translation.at } ${ locale_time } ${ Translation.with } ${ url }`;
							return `${ title }\n${ stamp }\n\n`;
						}
						function get_sections_subtitle_from( value ){
							return get_sized_from( get_colored_from( value, Colors.defaults.main ), 18 ) + '\n';
						}
						function get_sections_classes_from( data ){
							const class_player = data.game.player.class;
							const class_alliance = data.game.player?.alliance?.class;
							let result = '';
							if( class_player ){
								const value = Translation[ `classes_player_${ class_player }` ];
								result += get_colored_from( value, Colors.defaults.main );
							}
							if( class_alliance ){
								const value = Translation[ `classes_alliance_${ class_alliance }` ];
								const colored = get_colored_from( value, Colors.defaults.main );
								result += result ? ` & ${ colored }` : colored;
							}
							if( result ){
								result = get_sized_from( result, 14 )
										 + '\n\n';
							}
							return result;
						}
						function get_sections_lifeforms_levels_from( data ){
							const subtitle = get_sections_subtitle_from( Translation.lifeforms_levels );
							const lifeforms = data.game.player.lifeforms;
							let result = '';
							for( const key in lifeforms ){
								const lifeform = lifeforms[ key ];
								const level = get_colored_from( lifeform.level, Colors.defaults.main );
								const current_xp = Types.get_string_number_full_from( lifeform.xp.current );
								const maximum_xp = Types.get_string_number_full_from( lifeform.xp.maximum );
								result += `${ Translation[ key ] } : ${ level } · ${ current_xp }/${ maximum_xp } xp\n`;
							}
							if( result ){
								result = `${ subtitle + result }\n`;
							}
							return result;
						}
						function get_padding_from( value, length ){
							const count = Math.max( 0, length - value.toString().length );
							return '_'.repeat( count );
						}
						function get_colored_from( value, color ){
							return `[color=${ color }]${ value }[/color]`;
						}
						function get_sized_from( value, size ){
							return `[size=${ size }]${ value }[/size]`;
						}
						function get_sum_from( array ){
							return array.reduce( ( previous, current ) => previous + current, 0 );
						}
						function get_average_from( array ){
							return Math.round( get_sum_from( array ) / array.length ) + ' Ø';
						}
						return {
							empire: Empire,
							production: Production
						};
					})();
					function get_html(){
						return	`<div id="ic_exports-panel" class="ic_panel" data-state="collapsed">
									<h3 class="ic_panel_title"><span></span>Exports</h3>
									<div class="ic_panel_main">
										<form>
											<button id="ic_empire-export-button" class="ic_button btn_blue">${ Translation.empire }</button>
											<button id="ic_production-export-button" class="ic_button btn_blue">${ Translation.production }</button>
											<label><input type="radio" name="export" disabled>${ Translation.image }</label>
											<label><input type="radio" name="export" checked>${ Translation.text }</label>
											<label><input type="checkbox" checked>BBCode</label>
										</form>
										<div id="ic_exports-notification">${ Translation.export_notification }</div>
									</div>
								</div>`;
					}
					function set_events_from( data ){
						document.querySelector( '#ic_exports-panel form' ).addEventListener( 'submit', event => event.preventDefault() );
						document.querySelector( '#ic_empire-export-button' ).addEventListener( 'click', event => set_empire_text_to_clipboard_from( data ) );
						document.querySelector( '#ic_production-export-button' ).addEventListener( 'click', event => set_productions_text_to_clipboard_from( data ) );
					}
					function set_empire_text_to_clipboard_from( data ){
						try{
							set_text_export_to_clipboard_from( Texts.empire.get_from( data ) );
						}catch( error ){
							console.error(error)
							alert( Translation.data_alert );
						}
					}
					function set_productions_text_to_clipboard_from( data ){
						try{
							set_text_export_to_clipboard_from( Texts.production.get_from( data ) );
						}catch( error ){
							alert( Translation.data_alert );
						}
					}
					function set_text_export_to_clipboard_from( content ){
						const element = document.querySelector( '#ic_exports-panel form [type="checkbox"]' );
						const result = element.checked ? content : content.replace( /\[\/?[^\]]*\]/g, '' );
						navigator.clipboard.writeText( result );
						set_notification();
					}
					async function set_notification(){
						const form = document.querySelector( '#ic_exports-panel form' );
						const notification = document.querySelector( '#ic_exports-notification' );
						await form.animate( { opacity: 0 }, 250 ).finished;
						form.style.display = 'none';
						notification.style.display = 'flex';
						await notification.animate( { opacity: [0, 1] }, 250 ).finished;
						await notification.animate( { opacity: [1, 0] }, { delay: 1_500, duration: 500 } ).finished;
						notification.style.display = 'none';
						form.style.display = 'flex';
						form.animate( { opacity: [0, 1] }, 500 );
					}
					return {
						get_html,
						set_events_from
					};
				})();
				function get_html_from( data ){
					return `${ Account.get_html_from( data ) }
							${ Positions.get_html_from( data ) }
							${ Productions.get_html_from( data ) }
							${ Amortizations.get_html_from( data ) }
							${ Exports.get_html() }`;
				}
				function set_html_from( data ){
					const collapsibles = data.script.collapsibles;
					for( const element of document.querySelectorAll( '.ic_panel' ) ){
						if( collapsibles[ element.id ] === 'collapsed' ) collapse( element );
						else if( collapsibles[ element.id ] === 'expanded' ) expand( element );
						else if( element.dataset.state === 'collapsed' ) collapse( element );
						else if( element.dataset.state === 'expanded' ) expand( element );
					}
				}
				function set_events_from( data ){
					Amortizations.set_events();
					Exports.set_events_from( data );
					for( const element of document.querySelectorAll( '.ic_panel' ) ){
						const title = element.firstElementChild;
						title.addEventListener( 'click', event => toggle( element ) );
					}
				}
				function toggle( element ){
					const data = Storage.get();
					const collapsibles = data.script.collapsibles;
					if( element.dataset.state === 'collapsed' ){
						collapsibles[ element.id ] = 'expanded';
						expand( element );
					}else if( element.dataset.state === 'expanded' ){
						collapsibles[ element.id ] = 'collapsed';
						collapse( element );
					}
					Storage.set_from( data );
				}
				function collapse( element ){
					const main = element.querySelector( '.ic_panel_main' );
					element.dataset.state = 'collapsed';
					main.style.display = 'none';
				}
				function expand( element ){
					const main = element.querySelector( '.ic_panel_main' );
					element.dataset.state = 'expanded';
					main.style.display = null;
				}
				return {
					get_html_from,
					set_html_from,
					set_events_from
				};
			})();
			function init_from( data ){
				set_html_from( data );
				set_events_from( data );
			}
			function set_html_from( data ){
				const result = `<div class="ic_box">
									<h3 class="ic_box_title">${ Translation.account_overview }</h3>
									${ Panels.get_html_from( data ) }
								</div>`;
				document.querySelector( '#inhalt' ).innerHTML += result;
				Panels.set_html_from( data );
			 }
			function set_events_from( data ){
				Panels.set_events_from( data );
			}
			return {
				init_from
			};
		})();
		const Settings = (function(){
			function init_from( data ){
				set_html_from( data );
				set_events();
			}
			function set_html_from( data ){
				const colors = data.script.colors.user;
				const rates = data.script.rates;
				const result = `<h1>${ Translation.settings }<span class="ui-icon ui-icon-closethick"></span></h1>
								<form>
									<fieldset>
										<legend>${ Translation.rates }</legend>
										<label>${ Translation.metal }<input type="number" value="${ rates.metal }" data-key="metal"></label>
										<label>${ Translation.crystal }<input type="number" value="${ rates.crystal }" data-key="crystal"></label>
										<label>${ Translation.deuterium }<input type="number" value="${ rates.deuterium }" data-key="deuterium" disabled></label>
									</fieldset>
									<fieldset>
										<legend>${ Translation.colors }</legend>
										${ get_html_colors_from( data ) }
									</fieldset>
								</form>
                                <button class="btn_blue" type="button">Clear script data</button>
								<a href="https://ko-fi.com/A0A4DEZRA" target="_blank">Buy me a coffee <span>\u2764</span></a>`;
				// toolbarcomponent element not allowed for compatibility reason with AntiGame & OGame Tracker
                const element = document.createElement('dialog');
                element.id = 'ic_dialog';
				element.innerHTML += result;
                document.body.appendChild(element);
			}
			function get_html_colors_from( data ){
				const colors = data.script.colors.user;
				let result = '';
				for( const key in colors ){
					const title = Translation[ key ];
					const value = colors[ key ];
					result += `<label>${ title }<input type="color" value="${ value }" data-key="${ key }"></label>`;
				}
				return result;
			}
			function set_events(){
				set_events_dialog();
				set_events_change();
				set_events_reset();
			}
			function set_events_dialog(){
				const dialog = document.querySelector( '#ic_dialog' );
				const open = document.querySelector( '#ic_menu-button .menu_icon div');
				const close = document.querySelector( '#ic_dialog .ui-icon');
				open.addEventListener( 'mousedown', event => dialog.showModal() );
				close.addEventListener( 'mousedown', event => dialog.close() );
			}
			function set_events_change(){
				const dialog = document.querySelector( '#ic_dialog' );
				dialog.addEventListener( 'change', function(){
					const data = Storage.get();
					for( const input of dialog.querySelectorAll( '[type=color]' ) ){
						const key = input.dataset.key;
						const value = input.value;
						data.script.colors.user[ key ] = value;
					}
					for( const input of dialog.querySelectorAll( '[type=number]' ) ){
						const key = input.dataset.key;
						const value = input.value;
						data.script.rates[ key ] = value;
					}
					Storage.set_from( data );
				} );
			}
			function set_events_reset(){
				const button = document.querySelector( '#ic_dialog button' );
				button.addEventListener( 'click', function( event ){
					Storage.clear();
					window.location.reload();
				} );
			}
			return {
				init_from
			};
		})();
		const Styles = (function(){
			function init_from( data ){
				const result = get_from( data );
				GM_addStyle( result );
			}
			function get_from( data ){
				const colors = data.script.colors.user;
				return `.ic_box {
							background: #0d1014;
							border: 2px solid black;
							box-sizing: border-box;
							color: lightgrey;
							line-height: 1;
							margin: 0 auto 51px;
							padding: 8px;
							position: relative;
							width: 654px;
						}
						.ic_box::before,
						.ic_box::after {
							content: '';
							position: absolute;
							width: 668px;
						}
						.ic_box::before {
							background: url(//gf3.geo.gfsrv.net/cdn53/f333e15eb738b8ec692340f507e1ae.png) bottom left no-repeat,
										url(//gf2.geo.gfsrv.net/cdnd5/66551209db14e23b3001901b996cc6.png) bottom right no-repeat;
							height: 28px;
							left: -9px;
							top: -3px;
						}
						.ic_box::after {
							background: url(//gf3.geo.gfsrv.net/cdnea/0330abcdca0d125d35a0ebace4b584.png) bottom left no-repeat,
										url(//gf1.geo.gfsrv.net/cdn9b/8003a40825bc96919c5fec01b018b8.png) bottom right no-repeat;
							height: 50px;
							bottom: -4px;
							left: -9px;
							z-index: -1;
						}
						.ic_box_title {
							background: url(//gf1.geo.gfsrv.net/cdnfb/a4e7913209228ebaf2297429aeb87b.png);
							color: #6f9fc8;
							font: bold 12px/27px Verdana,Arial,Helvetica,sans-serif;
							margin: -9px -8px 4px;
							text-align: center;
							position: relative;
						}
						.ic_box_title::before,
						.ic_box_title::after {
							content: '';
							display: block;
							position: absolute;
							top: 0;
							width: 26px;
							height: 27px;
						}
						.ic_box_title::before {
							background: url(//gf2.geo.gfsrv.net/cdn4a/127bd495b9325216af08a588ecc540.png);
							left: 0;
						}
						.ic_box_title::after {
							background: url(//gf2.geo.gfsrv.net/cdn1d/80db96934a5b82ce002f839cd85a44.png);
							right: 0;
						}
						.ic_panel {
							padding: 1px 0;
						}
						.ic_panel_title {
							background-image: url(//gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);
							color: #576472;
							cursor: pointer;
							font-weight: bold;
							line-height: 28px;
							overflow: hidden;
							padding-left: 35px;
							position: relative;
						}
						.ic_panel_title::after {
							background-image: url(//gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);
							background-position: -21px -169px;
							content: '';
							display: block;
							position: absolute;
							right: -2px;
							top: 1px;
							width: 10px;
							height: 26px;
						}
						.ic_panel_title:hover::after {
							background-position: -21px -196px;
						}
						.ic_panel_title:hover {
							background-position: 0 -28px;
							color: #6f9fc8;
						}
						.ic_panel_title > span {
							background-image: url(//gf3.geo.gfsrv.net/cdne1/d03835718066a5a592a6426736e019.png);
							left: -4px;
							position: absolute;
							width: 31px;
							height: 27px;
						}
						.ic_panel[ data-state="expanded" ] .ic_panel_title > span {
							background-position: 0 -113px;
						}
						.ic_panel[ data-state="expanded" ] .ic_panel_title:hover > span {
							background-position: 0 -141px;
						}
						.ic_panel[ data-state="collapsed" ] .ic_panel_title > span {
							background-position: 0 -57px;
						}
						.ic_panel[ data-state="collapsed" ] .ic_panel_title:hover > span {
							background-position: 0 -85px;
						}
						.ic_panel_main {
							background: #12171c;
							border: 1px solid black;
							display: flex;
							margin: 0 1px;
						}
						.ic_panel table {
							font-size: 11px;
						}
						.ic_panel tbody th {
							text-align: left;
						}
						.ic_panel caption {
							border-bottom: 1px dotted rgb( 128, 128, 128, .2 );
							color: #6f9fc8;
							font: bold 12px/27px Verdana,Arial,Helvetica,sans-serif;
							line-height: 1;
							padding: 16px 8px;
							text-align: left;
						}
						.ic_panel tr:nth-child( even ) {
							background: #141e26;
						}
						.ic_panel tr > * {
							padding: 6px;
							white-space: nowrap;
						}
						.ic_panel tr > :first-child {
							padding-left: 8px;
						}
						.ic_panel tr > :last-child {
							padding-right: 8px;
						}
						.ic_panel td {
							text-align: right;
						}
						.ic_panel :is( th, td ) > div:not( :last-child ) {
							margin-bottom: 6px;
						}
						#ic_account-points-panel tr:nth-child( 8 ) > * {
							padding-bottom: 8px;
						}
						#ic_account-points-panel tr:nth-child( 9 ) > * {
							border-top: 1px dotted rgb( 128, 128, 128, .2 );
							padding-top: 8px;
						}
						#ic_account-points-panel th::before {
							color: transparent;
							content: '\u2b24';
							margin-right: 8px;
						}
						#ic_account-points-panel tr:nth-child( 1 ) th::before {
							color: ${ colors.mines };
						}
						#ic_account-points-panel tr:nth-child( 2 ) th::before {
							color: ${ colors.planets_buildings };
						}
						#ic_account-points-panel tr:nth-child( 3 ) th::before {
							color: ${ colors.moons_buildings };
						}
						#ic_account-points-panel tr:nth-child( 4 ) th::before {
							color: ${ colors.lifeforms_buildings };
						}
						#ic_account-points-panel tr:nth-child( 5 ) th::before {
							color: ${ colors.lifeforms_researches };
						}
						#ic_account-points-panel tr:nth-child( 6 ) th::before {
							color: ${ colors.researches };
						}
						#ic_account-points-panel tr:nth-child( 7 ) th::before {
							color: ${ colors.ships };
						}
						#ic_account-points-panel tr:nth-child( 8 ) th::before {
							color: ${ colors.defences };
						}
						#ic_account-points-panel svg {
							margin: auto;
							width: 33.3%;
						}
						#ic_positions-points-panel table {
							width: 100%;
						}
						#ic_positions-points-panel tr > :nth-child( -n+2 ) {
							width: 0;
						}
						#ic_positions-points-panel td {
							text-align: center;
							vertical-align: baseline;
						}
						#ic_positions-points-panel td:nth-child( 2 ) {
							text-align: left;
						}
						#ic_positions-points-panel td:nth-child( 3 ) {
							color: ${ colors.mines };
						}
						#ic_positions-points-panel td:nth-child( 4 ) {
							color: ${ colors.planets_buildings };
						}
						#ic_positions-points-panel td:nth-child( 4 ) div:nth-child( 2 ){
							color: ${ colors.moons_buildings };
						}
						#ic_positions-points-panel td:nth-child( 5 ) {
							color: ${ colors.lifeforms_buildings };
						}
						#ic_positions-points-panel td:nth-child( 6 ) {
							color: ${ colors.lifeforms_researches };
						}
						#ic_positions-points-panel td:nth-child( 7 ) {
							color: ${ colors.defences };
						}
						#ic_positions-points-panel td:last-child {
							text-align: right;
							width: 0;
						}
						#ic_productions-panel table {
							table-layout: fixed;
							width: 100%;
						}
						#ic_productions-panel tr:first-child th {
							text-align: right;
						}
						#ic_productions-panel td:nth-child( 2 ) {
							color: ${ colors.metal };
						}
						#ic_productions-panel td:nth-child( 3 ) {
							color: ${ colors.crystal };
						}
						#ic_productions-panel td:nth-child( 4 ) {
							color: ${ colors.deuterium };
						}
						#ic_amortizations-panel .ic_panel_main {
							align-items: end;
							flex-direction: column;
							gap: 8px;
						}
						#ic_amortizations-panel .ic_panel_main .btn_blue {
							margin: 8px 6px;
						}
						#ic_amortizations-panel table {
							width: 100%;
						}
						#ic_amortizations-panel th {
							width: 0;
						}
						#ic_amortizations-tables_mines {
							table-layout: fixed;
						}
						#ic_amortizations-tables_mines td:nth-child( 2 ) {
							color: ${ colors.metal };
						}
						#ic_amortizations-tables_mines td:nth-child( 3 ) {
							color: ${ colors.crystal };
						}
						#ic_amortizations-tables_mines td:nth-child( 4 ) {
							color: ${ colors.deuterium };
						}
						#ic_amortizations-tables_researches {
							table-layout: fixed;
						}
						#ic_amortizations-tables_queue tbody {
							display: block;
							column-count: 2;
						}
						#ic_amortizations-tables_queue tr {
							display: block;
						}
						#ic_amortizations-tables_queue tr:nth-child( n+26 ):nth-child( even ){
							background: #12171c;
						}
						#ic_amortizations-tables_queue tr:nth-child( n+26 ):nth-child( odd ){
							background: #141e26;
						}
						#ic_amortizations-tables_queue th {
							text-align: right;
						}
						#ic_amortizations-tables_queue td {
							width: 50%;
						}
						#ic_amortizations-tables_queue td:first-of-type {
							text-align: left;
						}
						#ic_amortizations-tables_queue .ic_technology-1 {
							color: ${ colors.metal }
						}
						#ic_amortizations-tables_queue .ic_technology-2 {
							color: ${ colors.crystal }
						}
						#ic_amortizations-tables_queue .ic_technology-3 {
							color: ${ colors.deuterium }
						}
						#ic_amortizations-tables_queue :is( .ic_technology-122, .ic_technology-124 ) {
							color: ${ colors.researches }
						}
						#ic_exports-panel .ic_panel_main {
							align-items: center;
							display: flex;
							padding: 8px;
						}
						#ic_exports-panel form {
							display: flex;
						}
						#ic_exports-panel form label {
							align-items: center;
							display: inline-flex;
						}
						#ic_exports-panel form label:not( :last-of-type ) {
							margin-right: 8px;
						}
						#ic_exports-panel form input {
							margin: 0 4px 0 0;
						}
						#ic_exports-panel form > label:nth-child( 3 ) {
							opacity: .33;
						}
						#ic_exports-panel form :is( label:nth-child( 3 ), label:nth-child( 3 ) input ):hover {
							cursor: default;
						}
						#ic_exports-panel form :is( label, input ):hover {
							cursor: pointer;
						}
						#ic_exports-panel form button {
							margin-right: 8px;
						}
						#ic_exports-panel form button:last-of-type {
							margin-right: 16px;
						}
						#ic_exports-notification {
							display: none;
							padding: 7.5px 0;
						}
						#ic_exports-notification::before {
							content: '\u2713';
							margin-right: 4px;
						}
						#ic_menu-button .textlabel {
							font-size: 10px;
						}
						#ic_menu-button .menu_icon div {
							align-items: center;
							background: linear-gradient( to bottom, #1b2024 50%, #000 50% );
							border-radius: 4px;
							color: #353a3c;
							display: flex;
							justify-content: center;
							width: 27px;
							height: 27px;
						}
						#ic_menu-button .menu_icon div:hover {
							color: #d39343;
							cursor: pointer;
						}
						#ic_dialog {
							background: url(//gf1.geo.gfsrv.net/cdnc8/a70be772b78f27691516fa29654cef.jpg) -100px -100px;
							border: 1px solid #1f2833;
							color: lightgrey;
							padding: 16px;
						}
						#ic_dialog::backdrop {
							background: rgb( 0, 0, 0, .5 );
						}
						#ic_dialog h1 {
							background: linear-gradient( to top, #3d4b5b 0%, #2b343f 49%, #1f262d 50%, #1f2934 100% );
							color: #6f9fc8;
							display: flex;
							font-weight: bold;
							justify-content: space-between;
							margin: -16px -16px 16px;
							padding: 8px 16px;
						}
						#ic_dialog .ui-icon:hover {
							cursor: pointer;
						}
						#ic_dialog form {
							display: flex;
							flex-direction: column;
							gap: 16px;
							margin-bottom: 16px;
						}
						#ic_dialog legend {
							color: #6f9fc8;
							font-weight: bold;
							margin-bottom: 8px;
						}
						#ic_dialog label {
							align-items: center;
							display: flex;
							gap: 8px;
							justify-content: space-between;
						}
						#ic_dialog label:hover {
							cursor: pointer;
						}
						#ic_dialog label:not( :last-child ) {
							margin-bottom: 4px;
						}
						#ic_dialog [type=color] {
							-webkit-appearance: none;
							background: none;
							border: none;
							width: 37px;
						}
						#ic_dialog [type=color]::-webkit-color-swatch-wrapper {
							padding: 0;
						}
						#ic_dialog [type=color]::-webkit-color-swatch {
							border: none;
							border-radius: 3px;
						}
						#ic_dialog [type=color]:hover {
							cursor: pointer;
						}
						#ic_dialog [type=number] {
							-moz-appearance: textfield;
							background: #b3c3cb;
							border: 1px solid #668599;
							border-radius: 3px;
							padding: 2px 4px;
							text-align: center;
							width: 26px;
						}
						#ic_dialog [type=number]::-webkit-outer-spin-button,
						#ic_dialog [type=number]::-webkit-inner-spin-button {
							-webkit-appearance: none;
							margin: 0;
						}
						#ic_dialog [type=number]:disabled {
							background: none;
							border: 1px solid white;
							color: white;
							opacity: .5;
							width: 26px;
						}
						#ic_dialog button {
							display:block;
							width: 100%;
						}
						#ic_dialog a {
							display: block;
							margin-top: 8px;
							text-align: center;
						}
						#ic_dialog a span {
							color: #ff3131;
						}
						.ic_energy-warning::after {
							animation: pulse 1s ease-in-out infinite alternate;
							color: yellow;
							content: '\ud83d\uddf2';
							margin-left: 4px;
						}
						.ic_percent {
							display: inline-block;
							width: 48px;
						}
						.btn_blue {
							min-width: unset;
						}
						@keyframes pulse {
							to {
								opacity: 0;
							}
						}`;
			}
			return {
				init_from
			};
		})();
		function init_from( data ){
			if( currentPage !== 'empire' ){
				if( currentPage === 'highscore' ){
					Highscores.init_from( data );
				}else if( currentPage === 'overview' ){
					Overview.init_from( data );
				}
				Energy.init_from( data );
				Menu.init();
				Settings.init_from( data );
				Styles.init_from( data );
			}
		}
		return {
			init_from
		};
	})();
	const Data = (function(){
		function get_from( stored, scraped ){
			const result = get_merged_from( stored, scraped );
			remove_obselete_positions_from( result, scraped );
			sort_positions_from( result, scraped );
			set_script_data_to( result );
			set_computed_to( result );
			return result;
		}
		function get_merged_from( ...objects ){
			const result = {};
			for( const object of objects ){
				for( const key in object ){
					if( Types.are_objects( result[ key ], object[ key ] ) ){
						const value = get_merged_from( result[ key ], object[ key ] );
						result[ key ] = value;
					}else if( object[ key ] !== undefined ){
						const value = object[ key ];
						result[ key ] = value;
					}
				}
			}
			return result;
		}
		function set_computed_to( data ){
			set_computed_points_to( data );
			set_computed_percents_to( data );
			set_computed_productions_to( data );
			set_computed_highscores_to( data );
		}
		function set_computed_points_to( data ){
			const { points, positions, researches } = data.game.player;
			const result = {
				indestructibles: 0,
				moons: {
					buildings: 0
				},
				planets: {
					buildings: 0,
					lifeforms: {
						buildings: 0,
						researches: 0,
					},
					mines: {
						all: 0,
						metal: 0,
						crystal: 0,
						deuterium: 0
					}
				},
				positions: {},
				researches: 0,
				total: 0,
				units: {
					defences: 0,
					ships: {
						all: 0
					}
				},
				upgrades: 0
			};
			if( points ){
				const rates = {
					metal: 1,
					crystal: 1,
					deuterium: 1
				};
				for( const coordinates in positions ){
					const position = result.positions[ coordinates ] = {};
					const { moon, planet } = positions[ coordinates ];
					position.planet = get_computed_points_planet_from( planet, rates );
					if( moon ){
						position.moon = get_computed_points_moon_from( moon, rates );
					}
				}
				for( const coordinates in result.positions ){
					const { moon, planet } = result.positions[ coordinates ];
					result.planets.buildings += planet.buildings;
					result.planets.lifeforms.buildings += planet.lifeforms.buildings;
					result.planets.lifeforms.researches += planet.lifeforms.researches;
					result.planets.mines.all += planet.mines.all;
					result.planets.mines.metal += planet.mines.metal;
					result.planets.mines.crystal += planet.mines.crystal;
					result.planets.mines.deuterium += planet.mines.deuterium;
					result.units.defences += planet.units.defences;
					result.upgrades += planet.upgrades;
					if( moon ){
						result.moons.buildings += moon.buildings;
						result.units.defences += moon.units.defences;
						result.upgrades += moon.upgrades;
					}
				}
				result.researches = Classes.researches.get_costs_from( researches, rates ) * .001;
				result.upgrades += Classes.researches.get_costs_upgrade_from( researches, rates ) * .001;
				result.total = points.total;
				result.units.ships.all = result.total - Math.trunc( result.moons.buildings + result.planets.buildings + result.planets.lifeforms.buildings + result.planets.lifeforms.researches + result.planets.mines.all + result.researches + result.units.defences );
				result.indestructibles = result.total - result.moons.buildings - result.units.defences - result.units.ships.all;
			}
			data.game.player.points = result;
		}
		function get_computed_points_moon_from( moon, rates ){
			const technologies = moon.technologies;
			const result = {
				buildings: Classes.moon.get_costs_buildings_from( technologies, rates ) * .001,
				units: {
					defences: Classes.moon.get_costs_defences_from( technologies, rates ) * .001,
					ships: {
						statics: Classes.moon.get_costs_ships_statics_from( technologies, rates ) * .001
					}
				},
				upgrades: Classes.moon.get_costs_upgrades_from( technologies, rates ) * .001,
				statics: 0
			};
			result.statics = result.buildings + result.units.defences + result.units.ships.statics;
			return result;
		}
		function get_computed_points_planet_from( planet, rates ){
			const technologies = planet.technologies;
			const result = {
				buildings: Classes.planet.get_costs_buildings_from( technologies, rates ) * .001,
				lifeforms: {
					buildings: Classes.planet.get_costs_lifeforms_buildings_from( technologies, rates ) * .001,
					researches: Classes.planet.get_costs_lifeforms_researches_from( technologies, rates ) * .001
				},
				mines: {
					all: 0,
					metal: Classes.planet.get_costs_mines_metal_from( technologies, rates ) * .001,
					crystal: Classes.planet.get_costs_mines_crystal_from( technologies, rates ) * .001,
					deuterium: Classes.planet.get_costs_mines_deuterium_from( technologies, rates ) * .001
				},
				units: {
					defences: Classes.planet.get_costs_defences_from( technologies, rates ) * .001,
					ships: {
						statics: Classes.planet.get_costs_ships_statics_from( technologies, rates ) * .001
					}
				},
				upgrades: Classes.planet.get_costs_upgrades_from( technologies, rates ) * .001,
				statics: 0
			};
			result.mines.all = result.mines.metal + result.mines.crystal + result.mines.deuterium;
			result.statics = result.buildings + result.lifeforms.buildings + result.lifeforms.researches + result.mines.all + result.units.defences + result.units.ships.statics;
			return result;
		}
		function set_computed_percents_to( data ){
			const points = data.game.player.points;
			const total = points.total;
			data.game.player.percents = get_computed_percents_from( points, total );
		}
		function get_computed_percents_from( points, total ){
			const result = {};
			for( const key in points ){
				const value = points[ key ];
				if( Types.are_objects( value ) ){
					result[ key ] = get_computed_percents_from( value, total );
				}else{
					result[ key ] = value / total || 0;
				}
			}
			return result;
		}
		function set_computed_productions_to( data ){
			const positions = data.game.player.positions;
			data.game.player.productions = {
                basic: get_computed_productions_basic_from( positions ),
				bonuses: get_computed_productions_bonuses_from( positions ),
                classes: get_computed_productions_classes_from( positions ),
                crawlers: get_computed_productions_crawlers_from( positions ),
                plasma: get_computed_plasma_from( positions ),
				lifeforms: get_computed_productions_lifeforms_from( positions ),
				mines: get_computed_productions_mines_from( positions ),
				total: get_computed_productions_total_from( positions )
			};
		}
        function get_computed_productions_basic_from( positions ){
            const result = {
                metal: 0,
                crystal: 0,
                deuterium: 0
            };
            for( const coordinates in positions ){
                const productions = positions[ coordinates ].planet.productions;
                if( productions ){
                    const basic = productions.basic;
                    result.metal += basic.metal;
                    result.crystal += basic.crystal;
                }
            }
            return result;
        }
		function get_computed_productions_bonuses_from( positions ){
			const result = {
				metal: 0,
				crystal: 0,
				deuterium: 0
			};
			for( const coordinates in positions ){
				const productions = positions[ coordinates ].planet.productions;
				if( productions ){
					const objects = productions.objects;
					const geologist = productions.geologist;
					const officers = productions.officers;
					result.metal += objects.metal + geologist.metal + officers.metal;
					result.crystal += objects.crystal + geologist.crystal + officers.crystal;
					result.deuterium += objects.deuterium + geologist.deuterium + officers.deuterium;
				}
			}
			return result;
		}
        function get_computed_productions_classes_from( positions ){
            const result = {
                metal: 0,
                crystal: 0,
                deuterium: 0
            };
            for( const coordinates in positions ){
                const productions = positions[ coordinates ].planet.productions;
                if( productions ){
                    const classes = productions.classes;
                    result.metal += classes.player.metal + classes.alliance.metal;
                    result.crystal += classes.player.crystal + classes.alliance.crystal;
                    result.deuterium += classes.player.deuterium + classes.alliance.deuterium;
                }
            }
            return result;
        }
        function get_computed_productions_crawlers_from( positions ){
            const result = {
                metal: 0,
                crystal: 0,
                deuterium: 0
            };

            for( const coordinates in positions ){
                const productions = positions[ coordinates ].planet.productions;
                if( productions ){
                    const crawlers = productions.crawlers;
                    result.metal += crawlers.metal;
                    result.crystal += crawlers.crystal;
                    result.deuterium += crawlers.deuterium;
                }
            }
            return result;
        }
        function get_computed_plasma_from( positions ){
            const result = {
                metal: 0,
                crystal: 0,
                deuterium: 0
            };
            for( const coordinates in positions ){
                const productions = positions[ coordinates ].planet.productions;
                if( productions ){
                    const plasma = productions.plasma;
                    result.metal += plasma.metal;
                    result.crystal += plasma.crystal;
                    result.deuterium += plasma.deuterium;
                }
            }
            return result;
        }
		function get_computed_productions_lifeforms_from( positions ){
			const result = {
				metal: 0,
				crystal: 0,
				deuterium: 0
			};
			for( const coordinates in positions ){
				const productions = positions[ coordinates ].planet.productions;
				if( productions?.lifeforms ){
					result.metal += productions.lifeforms.metal;
					result.crystal += productions.lifeforms.crystal;
					result.deuterium += productions.lifeforms.deuterium;
				}
			}
			return result;
		}
		function get_computed_productions_mines_from( positions ){
			const result = {
				metal: 0,
				crystal: 0,
				deuterium: 0
			};
			for( const coordinates in positions ){
				const productions = positions[ coordinates ].planet.productions;
				if( productions ){
					result.metal += productions.mines.metal;
					result.crystal += productions.mines.crystal;
					result.deuterium += productions.mines.deuterium;
				}
			}
			return result;
		}
		function get_computed_productions_total_from( positions ){
			const result = {
				metal: 0,
				crystal: 0,
				deuterium: 0
			};
			for( const coordinates in positions ){
				const productions = positions[ coordinates ].planet.productions;
				if( productions ){
					result.metal += productions.total.metal;
					result.crystal += productions.total.crystal;
					result.deuterium += productions.total.deuterium;
				}
			}
			return result;
		}
		function set_computed_highscores_to( data ){
			if( currentPage === 'highscore' ){
				const { player, players } = data.game.universe.highscores[1][0];
				const points = data.game.player.points;
				const positions = player.positions;
				const upgraded = player.points + points.upgrades;
				// set default values
				positions.if_destroyed = positions.current;
				positions.when_finished = positions.current;
				// get highscores player position when destroyed
				for( const key in players ){
					const value = players[ key ];
					if( value < points.indestructibles ){
						positions.if_destroyed = parseInt( key ) - 1;
						break;
					}
				}
				// get highscores player position when upgraded
				for( const key in players ){
					const value = players[ key ];
					if( value <= upgraded ){
						positions.when_finished = parseInt( key );
						break;
					}
				}
			}
		}
		function set_script_data_to( data ){
			data.script ||= {
				amortizations: {},
				collapsibles: {},
				colors: {
					defaults: Colors.defaults,
					user: Colors.user
				},
				rates: {
					metal: 2,
					crystal: 1.5,
					deuterium: 1
				}
			};
		}
		function remove_obselete_positions_from( result, scraped ){
      console.log(result)
			const result_positions = result.game.player.positions;
			const scraped_positions = scraped.game.player.positions;
			if( currentPage === 'empire' ){
				for( const coordinates in result_positions ){
					const position = scraped_positions[ coordinates ];
					if( !position ){
						if( planetType === 0 ) delete result_positions[ coordinates ];
						else delete result_positions[ coordinates ].moon;
					}
				}
			}else{
				for( const coordinates in result_positions ){
					const position = scraped_positions[ coordinates ];
					if( !position ) delete result_positions[ coordinates ];
					else if( !position.moon ) delete result_positions[ coordinates ].moon;
				}
			}
		}
		function sort_positions_from( result, scraped ){
			const result_positions = result.game.player.positions;
			const scraped_positions = scraped.game.player.positions;
			const sorted_positions = {};
			for( const coordinates in scraped_positions ){
				sorted_positions[ coordinates ] = result_positions[ coordinates ];
			}
			console.log(sorted_positions)
			result.game.player.positions = sorted_positions;
		}
		return {
			get_from
		};
	})();
	const Scraper = (function(){
		async function get(){
			console.group( 'InfoCompte' );
			for( let i = 0; i < 5; i++ ){
				try{
					const result = get_data();
					console.log( 'Data has been scraped with success:', result );
					return result;
				}catch( error ){
					console.log( 'A problem occurred while scraping data (see below). The script will attempt to scrape the data again...' );
					console.error( error );
					await new Promise( resolve => setTimeout( resolve, 1_000 ) );
				}
			}
			console.groupEnd();
		}
		function get_data(){
			return {
				game: {
					interface: get_interface(),
					player: get_player(),
					universe: get_universe()
				}
			};
		}
		function get_interface(){
			return {
				coordinates: document.head.querySelector( 'meta[name=ogame-planet-coordinates]' ).content,
				type: document.head.querySelector( 'meta[name=ogame-planet-type]' ).content
			};
		}
		function get_player(){
			return {
				id: parseInt( document.head.querySelector( 'meta[name=ogame-player-id]' ).content ),
				name: document.head.querySelector( 'meta[name=ogame-player-name]' ).content,
				class: get_player_class(),
				officers: get_player_officers(),
				points: get_player_points(),
				positions: get_player_positions(),
				lifeforms: get_player_lifeforms(),
				researches: get_player_researches(),
				alliance: get_player_alliance()
			};
		}
		function get_player_class(){
			if( currentPage !== 'empire' ){
				let result = null;
				for( const key of [ 'miner', 'warrior', 'explorer' ] ){
					if( document.querySelector( `#characterclass .${ key }` ) ){
						result = key;
						break;
					}
				}
				return result;
			}
		}
		function get_player_officers(){
			if( currentPage !== 'empire' ){
				const result = {};
				result.all = true;
				for( const key of [ 'commander', 'admiral', 'engineer', 'geologist', 'technocrat' ] ){
					const element = document.querySelector( `#officers a.on.${ key }` );
					if( element ){
						result[ key ] = true;
					}else{
						result[ key ] = result.all = false;
					}
				}
				return result;
			}
		}
		function get_player_points(){
			if( currentPage === 'overview' ){
				const result = {};
				let values = document.querySelector( '#overviewcomponent > script:nth-child(2)' ).textContent;
				values = values.split( '\n' )[20];
				values = values.replaceAll( LocalizationStrings.thousandSeperator, '' ).match( /\d+/g );
				result.total = parseInt( values[2] );
				return result;
			}
		}
		function get_player_positions(){
			if( currentPage === 'empire' ){
				return get_player_positions_from_empire();
			}else{
				return get_player_positions_from_list();
			}
		}
		function get_player_positions_from_list(){
			const elements = document.querySelectorAll( '#planetList .smallplanet' );
			const count =  parseInt( document.querySelector( '#countColonies > p > span' ).textContent.match( /\d+/g )[0] );
			const result = {};
			if( elements.length !== count ){
				throw new Error( 'All positions are not displayed yet in planetList html element' );
			}
			for( const element of elements ){
				const coordinates = element.querySelector( '.planet-koords' ).textContent.slice( 1, -1 );
				const position = result[ coordinates ] = {};
				position.location = parseInt( coordinates.split( ':' )[2] );
				position.planet = {};
				if( element.querySelector( '.moonlink' ) ){
					position.moon = {};
				}
			}
			const coordinates = document.head.querySelector( 'meta[name=ogame-planet-coordinates]' ).content;
			const type = document.head.querySelector( 'meta[name=ogame-planet-type]' ).content;
			const body = result[ coordinates ][ type ] = get_player_body();
			return result;
		}
		function get_player_positions_from_empire(){
			const type = planetType ? 'moon' : 'planet';
			const result = {};
			for( const element of document.querySelectorAll( '.planet:not( .summary )' ) ){
				const coordinates = element.querySelector( '.planetData .coords' ).textContent.slice( 1, -1 );
				const position = result[ coordinates ] = {};
				position.location = parseInt( coordinates.split( ':' )[2] );
				position[ type ] = get_player_body_from( element );
			}
			return result;
		}
		function get_player_body(){
			return {
				id: document.head.querySelector( 'meta[name=ogame-planet-id]' ).content,
				name: document.head.querySelector( 'meta[name=ogame-planet-name]' ).content,
				fields: get_player_fields(),
				temperatures: get_player_temperatures(),
				technologies: get_player_technologies_from_body(),
				lifeform: get_player_lifeform(),
				productions: get_player_productions(),
				resources: get_player_resources()
			};
		}
		function get_player_body_from( element ){
			const technologies = element.querySelectorAll( '.values:not( .items, .resources, .storage, .research ) > div' );
			return {
				name: element.querySelector( '.planetname' ).textContent,
				fields: get_player_fields_from( element ),
				temperatures: get_player_temperatures_from( element ),
				technologies: get_player_technologies_from( technologies ),
				resources: get_player_resources_from( element )
			};
		}
		function get_player_fields(){
			if( currentPage === 'overview' ){
				const content = document.querySelector( '#overviewcomponent > script:nth-child(2)' ).textContent;
				const values = content.replaceAll( LocalizationStrings.thousandSeperator, '' ).split( '\n' )[14].match( /\d+/g );
				return {
					used: parseInt( values[2] ),
					maximum: parseInt( values[3] )
				};
			}
		}
		function get_player_fields_from( element ){
			const values = element.querySelector( '.fields' ).textContent.match( /\d+/g );
			return {
				used: parseInt( values[0] ),
				maximum: parseInt( values[1] )
			};
		}
		function get_player_temperatures(){
			if( currentPage === 'overview' ){
				let values = document.querySelector( '#overviewcomponent > script:nth-child(2)' ).textContent;
				values = values.split( '\n' )[16];
				values = values.replaceAll( /\\u\S{0,5}/g, '' ).match( /-?\d+/g );
				return {
					min: parseInt( values[1] ),
					max: parseInt( values[2] )
				};
			}
		}
		function get_player_temperatures_from( element ){
			const values = element.querySelector( '.planetDataBottom' ).textContent.match( /-?\d+/g );
			return {
				min: parseInt( values[0] ),
				max: parseInt( values[1] )
			};
		}
		function get_player_lifeform(){
			let result = null;
			for( const key of [ 'lifeform1', 'lifeform2', 'lifeform3', 'lifeform4' ] ){
				if( document.querySelector( `#lifeform .${ key }` ) ){
					result = key;
					break;
				}
			}
			return result;
		}
		function get_player_productions(){
			const element = document.querySelector( '.listOfResourceSettingsPerPlanet' );
			if( element ){
				return {
					basic: {
						metal: get_player_productions_value_from( element.querySelector( '.alt :nth-child(2)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.alt :nth-child(3)' ) )
					},
					mines: {
						metal: get_player_productions_value_from( element.querySelector( '.\\31  :nth-child(3)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.\\32  :nth-child(4)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.\\33  :nth-child(5)' ) )
					},
					fusion: {
						deuterium: get_player_productions_value_from( element.querySelector( '.\\31 2  :nth-child(5)' ) ),
						factor: get_player_productions_factor_from( element.querySelector( '.\\31 2' ) )
					},
					lifeforms: get_player_productions_lifeform_from( element ),
					crawlers: {
						metal: get_player_productions_value_from( element.querySelector( '.\\32 17 :nth-child(3)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.\\32 17 :nth-child(4)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.\\32 17 :nth-child(5)' ) ),
						factor: get_player_productions_factor_from( element.querySelector( '.\\32 17' ) )
					},
					plasma: {
						metal: get_player_productions_value_from( element.querySelector( '.\\31 22 :nth-child(3)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.\\31 22 :nth-child(4)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.\\31 22 :nth-child(5)' ) )
					},
					objects: {
						metal: get_player_productions_value_from( element.querySelector( '.\\31 000 :nth-child(3)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.\\31 000 :nth-child(4)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.\\31 000 :nth-child(5)' ) )
					},
					geologist: {
						metal: get_player_productions_value_from( element.querySelector( '.\\31 001 :nth-child(3)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.\\31 001 :nth-child(4)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.\\31 001 :nth-child(5)' ) )
					},
					officers: {
						metal: get_player_productions_value_from( element.querySelector( '.\\31 003 :nth-child(3)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.\\31 003 :nth-child(4)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.\\31 003 :nth-child(5)' ) )
					},
					classes: {
						player: {
							metal: get_player_productions_value_from( element.querySelector( '.\\31 004 :nth-child(3)' ) ),
							crystal: get_player_productions_value_from( element.querySelector( '.\\31 004 :nth-child(4)' ) ),
							deuterium: get_player_productions_value_from( element.querySelector( '.\\31 004 :nth-child(5)' ) )
						},
						alliance: {
							metal: get_player_productions_value_from( element.querySelector( '.\\31 005 :nth-child(3)' ) ),
							crystal: get_player_productions_value_from( element.querySelector( '.\\31 005 :nth-child(4)' ) ),
							deuterium: get_player_productions_value_from( element.querySelector( '.\\31 005 :nth-child(5)' ) )
						}
					},
					total: {
						metal: get_player_productions_value_from( element.querySelector( '.summary :nth-child(2)' ) ),
						crystal: get_player_productions_value_from( element.querySelector( '.summary :nth-child(3)' ) ),
						deuterium: get_player_productions_value_from( element.querySelector( '.summary :nth-child(4)' ) )
					}
				};
			}
		}
		function get_player_productions_lifeform_from( element ){
			const result = {
				metal: 0,
				crystal: 0,
				deuterium: 0
			};
			if( document.querySelector( '#lifeform .lifeform-item-icon' ) ){
				const elements = element.querySelectorAll( '.\\31 2 ~ tr' );
				for( const element of elements ){
                    // lifeform entries have a class with a number that is greater than or equal to 1006
                    const classes = Array.from(element.classList);
                    const hasNumericClass = classes.some(cls => !isNaN(cls));
                    const hasClassLessThan1006 = classes.some(cls => !isNaN(cls) && Number(cls) < 1006);
                    if (!hasNumericClass || hasClassLessThan1006) continue;
					result.metal += get_player_productions_value_from( element.querySelector( ':nth-child(3)' ) );
					result.crystal += get_player_productions_value_from( element.querySelector( ':nth-child(4)' ) );
					result.deuterium += get_player_productions_value_from( element.querySelector( ':nth-child(5)' ) );
				}

			}
			return result;
		}
		function get_player_productions_value_from( element ){
			let value = element.querySelector( 'span' ).title;
			value = value.replaceAll( LocalizationStrings.thousandSeperator, '' );
			value = value.replace( LocalizationStrings.decimalPoint, '.' );
			return parseFloat( value );
		}
		function get_player_productions_factor_from( element ){
			// dropdown game options management
			let value = element.querySelector( 'a' )?.dataset.value;
			value ||= element.querySelector( 'option:checked' ).value;
			return parseInt( value ) * .01;
		}
		function get_player_resources(){
			const result = {};
			const resources = resourcesBar.resources;
			for( const key in resources ){
				result[ key ] = resources[ key ].amount;
			}
			return result
		}
		function get_player_resources_from( element ){
			const result = {};
			result.energy = parseInt( element.querySelector( '.planetDataTop .coords.textRight' ).textContent );
			for( const { classList, textContent } of element.querySelectorAll( '.resources > div' ) ){
				const key = classList[0];
				const value = parseInt( textContent.replaceAll( LocalizationStrings.thousandSeperator, '' ) );
				result[ key ] = value;
			}
			return result;
		}
		function get_player_lifeforms(){
			if( currentPage === 'lfsettings' ){
				const result = {};
				for( const element of document.querySelectorAll( '.lifeform-item' ) ){
					const id = element.querySelector( '.lifeform-item-icon' ).classList[1];
					const values = element.querySelector( '.lifeform-item-wrapper p:nth-last-of-type(2)' ).textContent.match( /\d+/g );
					result[ id ] = {
						level: parseInt( values[0] ),
						xp: {
							current: parseInt( values[1] ),
							maximum: parseInt( values[2] )
						}
					};
				}
				return result;
			}
		}
		function get_player_researches(){
			if( currentPage === 'empire' ){
				const elements = document.querySelector( '.planet:not( .summary )' ).querySelectorAll( '.research > div' );
				return get_player_technologies_from( elements );
			}else if( currentPage === 'research' ){
				return get_player_technologies();
			}
		}
		function get_player_technologies_from( elements ){
			const result = {};
			for( const element of elements ){
				const id = parseInt( element.classList[0] );
				const value = Types.get_number_from( element.firstChild.textContent );
				let upgrade = 0;
				if( id > 200 && id < 600 ){
					for( const { textContent } of element.querySelectorAll( '.active, .loop' ) ){
						upgrade += parseInt( textContent );
					}
				}else{
					const content = element.querySelector( '.active' )?.textContent;
					upgrade = Math.max( 0, parseInt( content || 0 ) - value );
				}
				result[ id ] = {
					value,
					upgrade,
					upgraded: value + upgrade
				}
			}
			return result;
		}
		function get_player_technologies_from_body(){
			const has_technologies = document.querySelector( '#technologies' );
			const is_research = currentPage === 'research';
			if( has_technologies && !is_research ){
				return get_player_technologies();
			}
		}
		function get_player_technologies(){
			const result = {};
			for( const element of document.querySelectorAll( '#technologies ul > li.hasDetails' ) ){
				const id = parseInt( element.dataset.technology );
				const value = parseInt( element.querySelector( '.level, .amount' ).dataset.value );
				let upgrade = 0;
				if( id > 200 && id < 600 ){
					for( const element of document.querySelectorAll( '#productionboxshipyardcomponent :is( .first, .queue td )' ) ){
						const { src } = element.querySelector( 'img' );
						if( Classes.technologies.ids.miniatures[ src ] === id ){
							upgrade += parseInt( element.textContent );
						}
					}
				}else{
					const level = element.querySelector( '.targetlevel' )?.dataset.value || 0;
					upgrade = Math.max( 0, parseInt( level ) - value );
				}
				result[ id ] = {
					value,
					upgrade,
					upgraded: value + upgrade
				}
			}
			return result;
		}
		function get_player_alliance(){
			if( currentPage === 'alliance' ){
				const classes = document.querySelector( '.alliance_class' ).classList;
				const result = {};
				for( const key of [ 'trader', 'warrior', 'explorer' ] ){
					if( classes.contains( key ) ){
						result.class = key;
						break;
					}
				}
				return result;
			}
		}
		function get_universe(){
			return {
				language: document.head.querySelector( 'meta[name=ogame-language]' ).content,
				name: document.head.querySelector( 'meta[name=ogame-universe-name]' ).content,
				speed: parseInt( document.head.querySelector( 'meta[name=ogame-universe-speed]' ).content ),
				highscores: get_universe_highscores()
			};
		}
		function get_universe_highscores(){
			if( currentPage === 'highscore' ){
				const result = {};
				const category = result[ currentCategory ] = {};
				const type = category[ currentType ] = {};
				const players = type.players = {};
				const player = type.player = {};
				const positions = player.positions = {};
				if( document.querySelector( '.myrank' ) ){
					positions.current = parseInt( document.querySelector( '.myrank .position' ).textContent );
					player.points = get_universe_highscores_points_from( document.querySelector( '.myrank .score' ) );
				}
				for( const element of document.querySelectorAll( '#ranks tbody tr' ) ){
					const position = parseInt( element.querySelector( '.position' ).textContent );
					players[ position ] = get_universe_highscores_points_from( element.querySelector( '.score' ) );
				}
				return result;
			}
		}
		function get_universe_highscores_points_from( element ){
			// firstChild used for OGLight compatibility
			const value = element.firstChild.textContent;
			return Types.get_number_from( value );
		}
		function element_has_changed( selector ){
			return new Promise( function( resolve ){
				const element = document.querySelector( selector );
				const options = { childList: true, subtree: true }
				const observer = new MutationObserver( function(){
					observer.disconnect();
					resolve();
				} );
				observer.observe( element, options );
			} );
		}
		return {
			get,
			element_has_changed
		};
	})();
	const Storage = (function(){
		const id = document.head.querySelector( 'meta[name=ogame-player-id]' ).content;
		const version = 5;
		const key = `${ id }_v${ version }`;
		function get(){
			return GM_getValue( key, {} );
		}
		function set_from( data ){
			GM_setValue( key, data );
		}
		function clear(){
			GM_setValue( key, {} );
		}
		return {
			get,
			set_from,
			clear
		};
	})();
	const Translation = (function(){
		const translations = {
			en: {
				1: 'Metal mine',
				2: 'Crystal mine',
				3: 'Deuterium synthesizer',
				4: 'Solar plant',
				12: 'Fusion plant',
				14: 'Robotics factory',
				15: 'Nanite factory',
				21: 'Shipyard',
				22: 'Metal storage',
				23: 'Crystal storage',
				24: 'Deuterium storage',
				31: 'Research laboratory',
				33: 'Terraformer',
				34: 'Alliance depot',
				36: 'Repair dock',
				41: 'Moonbase',
				42: 'Sensor phalanx',
				43: 'Jump gate',
				44: 'Missile silo',
				106: 'Espionage',
				108: 'Computer',
				109: 'Weapons',
				110: 'Shielding',
				111: 'Armour',
				113: 'Energy',
				114: 'Hyperspace',
				115: 'Combustion drive',
				117: 'Impulse drive',
				118: 'Hyperspace drive',
				120: 'Laser',
				121: 'Ion',
				122: 'Plasma',
				123: 'Intergalacticresearch network',
				124: 'Astrophysics',
				199: 'Graviton',
				202: 'Small cargo',
				203: 'Large cargo',
				204: 'Light fighter',
				205: 'Heavy fighter',
				206: 'Cruiser',
				207: 'Battleship',
				208: 'Colony ship',
				209: 'Recycler',
				210: 'Espionage probe',
				211: 'Bomber',
				212: 'Solar satellite',
				213: 'Destroyer',
				214: 'Deathstar',
				215: 'Battlecruiser',
				217: 'Crawler',
				218: 'Reaper',
				219: 'Pathfinder',
				401: 'Rocket launchers',
				402: 'Light lasers',
				403: 'Heavy laser',
				404: 'Gauss cannon',
				405: 'Ion cannon',
				406: 'Plasma turret',
				407: 'Small shield dome',
				408: 'Large shield dome',
				502: 'Anti-ballistic missiles',
				503: 'Interplanetary missile',
				11_101: 'Residential Sector',
				11_102: 'Biosphere Farm',
				11_103: 'Research Centre',
				11_104: 'Academy of Sciences',
				11_105: 'Neuro-Calibration Centre',
				11_106: 'High Energy Smelting',
				11_107: 'Food Silo',
				11_108: 'Fusion-Powered Production',
				11_109: 'Skyscraper',
				11_110: 'Biotech Lab',
				11_111: 'Metropolis',
				11_112: 'Planetary Shield',
				11_201: 'Intergalactic Envoys',
				11_202: 'High-Performance Extractors',
				11_203: 'Fusion Drives',
				11_204: 'Stealth Field Generator',
				11_205: 'Orbital Den',
				11_206: 'Research AI',
				11_207: 'High-Performance Terraformer',
				11_208: 'Enhanced Production Technologies',
				11_209: 'Light Fighter Mk II',
				11_210: 'Cruiser Mk II',
				11_211: 'Improved Lab Technology',
				11_212: 'Plasma Terraformer',
				11_213: 'Low-Temperature Drives',
				11_214: 'Bomber Mk II',
				11_215: 'Destructeur Mk II',
				11_216: 'Battlecruiser Mk II',
				11_217: 'Robot Assistants',
				11_218: 'Supercomputer',
				12_101: 'Meditation Enclave',
				12_102: 'Crystal Farm',
				12_103: 'Rune Technologium',
				12_104: 'Rune Forge',
				12_105: 'Oriktorium',
				12_106: 'Magma Forge',
				12_107: 'Disruption Chamber',
				12_108: 'Megalith',
				12_109: 'Crystal Refinery',
				12_110: 'Deuterium Synthesiser',
				12_111: 'Mineral Research Centre',
				12_112: 'Advanced Recycling Plant',
				12_201: 'Magma Refinement',
				12_202: 'Acoustic Scanning',
				12_203: 'High Energy Pump Systems',
				12_204: 'Cargo Hold Expansion',
				12_205: 'Magma-Powered Production',
				12_206: 'Geothermal Power Plants',
				12_207: 'Depth Sounding',
				12_208: 'Ion Crystal Enhancement (Heavy Fighter)',
				12_209: 'Improved Stellarator',
				12_210: 'Hardened Diamond Drill Heads',
				12_211: 'Seismic Mining Technology',
				12_212: 'Magma-Powered Pump Systems',
				12_213: 'Ion Crystal Modules',
				12_214: 'Optimised Silo Construction Method',
				12_215: 'Diamond Energy Transmitter',
				12_216: 'Obsidian Shield Reinforcement',
				12_217: 'Rune Shields',
				12_218: 'Rock’tal Collector Enhancement',
				13_101: 'Assembly Line',
				13_102: 'Fusion Cell Factory',
				13_103: 'Robotics Research Centre',
				13_104: 'Update Network',
				13_105: 'Quantum Computer Centre',
				13_106: 'Automatised Assembly Centre',
				13_107: 'High-Performance Transformer',
				13_108: 'Microchip Assembly Line',
				13_109: 'Production Assembly Hall',
				13_110: 'High-Performance Synthesiser',
				13_111: 'Chip Mass Production',
				13_112: 'Nano Repair Bots',
				13_201: 'Catalyser Technology',
				13_202: 'Plasma Drive',
				13_203: 'Efficiency Module',
				13_204: 'Depot AI',
				13_205: 'General Overhaul (Light Fighter)',
				13_206: 'Automated Transport Lines',
				13_207: 'Improved Drone AI',
				13_208: 'Experimental Recycling Technology',
				13_209: 'General Overhaul (Cruiser)',
				13_210: 'Slingshot Autopilot',
				13_211: 'High-Temperature Superconductors',
				13_212: 'General Overhaul (Battleship)',
				13_213: 'Artificial Swarm Intelligence',
				13_214: 'General Overhaul (Battlecruiser)',
				13_215: 'General Overhaul (Bomber)',
				13_216: 'General Overhaul (Destroyer)',
				13_217: 'Experimental Weapons Technology',
				13_218: 'Mechan General Enhancement',
				14_101: 'Sanctuary',
				14_102: 'Antimatter Condenser',
				14_103: 'Vortex Chamber',
				14_104: 'Halls of Realisation',
				14_105: 'Forum of Transcendence',
				14_106: 'Antimatter Convector',
				14_107: 'Cloning Laboratory',
				14_108: 'Chrysalis Accelerator',
				14_109: 'Bio Modifier',
				14_110: 'Psionic Modulator',
				14_111: 'Ship Manufacturing Hall',
				14_112: 'Supra Refractor',
				14_201: 'Heat Recovery',
				14_202: 'Sulphide Process',
				14_203: 'Psionic Network',
				14_204: 'Telekinetic Tractor Beam',
				14_205: 'Enhanced Sensor Technology',
				14_206: 'Neuromodal Compressor',
				14_207: 'Neuro-Interface',
				14_208: 'Interplanetary Analysis Network',
				14_209: 'Overclocking (Heavy Fighter)',
				14_210: 'Telekinetic Drive',
				14_211: 'Sixth Sense',
				14_212: 'Psychoharmoniser',
				14_213: 'Efficient Swarm Intelligence',
				14_214: 'Overclocking (Large Cargo)',
				14_215: 'Gravitation Sensors',
				14_216: 'Overclocking (Battleship)',
				14_217: 'Psionic Shield Matrix',
				14_218: 'Kaelesh Discoverer Enhancement',
				account_overview: "Account overview",
				alliance: 'Alliance',
				amortizations: 'Amortizations',
				at: 'at',
                basic: 'Basic production',
				buildings: 'Buildings',
                classes: 'Classes',
				classes_alliance_researcher: 'Researcher',
				classes_alliance_trader: 'Trader',
				classes_alliance_warrior: 'Warrior',
				classes_player_explorer: 'Discoverer',
				classes_player_miner: 'Collector',
				classes_player_warrior: 'General',
				clear_confirm: 'You are going to delete the InfoCompte data.',
				colors: 'Colors',
				crystal: 'Crystal',
				daily_productions: 'Daily production',
				data_alert: 'Data are missing. Visit the Empire view.',
				days: 'jours',
				defences: 'Defences',
				deuterium: 'Deuterium',
				deuterium_equivalent: 'Deuterium equivalent',
				empire: 'Empire',
				empire_of: "Empire of",
				export_notification: 'Export placed in clipboard',
				generated_on: 'Generated on',
				highscore: 'Highscore',
				hours: 'hours',
				if_destroyed: 'place(s) if destroyed',
				image: 'Image',
				indestructibles: 'Indestructibles',
				levels: 'Levels',
				lifeform1: 'Human',
				lifeform2: 'Rock’tal',
				lifeform3: 'Mecha',
				lifeform4: 'Kaelesh',
				lifeforms: 'Lifeforms',
				lifeforms_buildings: 'Lifeform buildings',
                lifeforms_buildings_short: 'LF buildings',
				lifeforms_levels: 'Lifeform levels',
				lifeforms_researches: 'Lifeform researches',
                lifeforms_researches_short: 'LF researches',
				maximum: 'maximum',
				metal: 'Metal',
				mines: 'Mines',
				mines_only: 'Mines only',
				months: 'months',
				moon: 'Moon',
				moons_buildings: 'Moons buildings',
				moons_defences: 'Moons defences',
				objects: 'Items',
				officers: 'Officers',
				on: 'on',
				others: 'Others',
				planet: 'Planet',
				planet_fields: 'Planet fields',
				planets: 'Planets',
				planets_buildings: 'Planetary buildings',
				planets_defences: 'Planetary defences',
				planets_points_repartition: 'Planets points repartition',
				points: 'Points',
				points_repartition: 'Points repartition',
				production: 'Production',
				production_of: "Production of",
				productions: 'Productions',
				queue: 'Upgrades queue',
				rates: 'Trade rates',
				recalculate: 'Recalculate',
				researches: 'Researches',
				resources: 'Resources',
				script_data: 'Script data',
				settings: 'Settings',
				ships: 'Ships',
				shipyards: 'Shipyards',
				support_link: "https://forum.origin.ogame.gameforge.com/forum/thread/151-infocompte/",
				temperatures_maximum: 'Maxmimum temperatures',
				text: 'Text',
				total: 'Total',
				upgrades: 'In construction',
				used: 'used',
				weeks: 'weeks',
				when_finished: 'place(s) when finished',
				with: 'with',
				years: 'years'
			},
			fr: {
				1: "Mine de métal",
				2: "Mine de cristal",
				3: "Synthétiseur de deutérium",
				4: "Centrale électrique solaire",
				12: "Centrale électrique de fusion",
				14: "Usine de robots",
				15: "Usine de nanites",
				21: "Chantier spatial",
				22: "Hangar de métal",
				23: "Hangar de cristal",
				24: "Réservoir de deutérium",
				31: "Laboratoire de recherche",
				33: "Terraformeur",
				34: "Dépôt de ravitaillement",
				36: "Dock spatial",
				41: "Base lunaire",
				42: "Phalange de capteur",
				43: "Porte de saut spatial",
				44: "Silo de missiles",
				106: "Espionnage",
				108: "Ordinateur",
				109: "Armes",
				110: "Bouclier",
				111: "Protection",
				113: "Énergie",
				114: "Hyperespace",
				115: "Réacteur à combustion",
				117: "Réacteur à impulsion",
				118: "Propulsion hyperespace",
				120: "Laser",
				121: "Ions",
				122: "Plasma",
				123: "Réseau de recherche",
				124: "Astrophysique",
				199: "Graviton",
				202: "Petit transporteur",
				203: "Grand transporteur",
				204: "Chasseur léger",
				205: "Chasseur lourd",
				206: "Croiseur",
				207: "Vaisseau de bataille",
				208: "Vaisseau de colonisation",
				209: "Recycleur",
				210: "Sonde d'espionnage",
				211: "Bombardier",
				212: "Satellite solaire",
				213: "Destructeur",
				214: "Étoile de la mort",
				215: "Traqueur",
				217: "Foreuse",
				218: "Faucheur",
				219: "Éclaireur",
				401: "Lanceur de missiles",
				402: "Artillerie laser légère",
				403: "Artillerie laser lourde",
				404: "Canon de Gauss",
				405: "Artillerie à ions",
				406: "Lanceur de plasma",
				407: "Petit bouclier",
				408: "Grand bouclier",
				502: "Missile d'interception",
				503: "Missile interplanétaire",
				11_101: "Secteur résidentiel",
				11_102: "Ferme biosphérique",
				11_103: "Centre de recherche",
				11_104: "Académie des sciences",
				11_105: "Centre de neurocalibrage",
				11_106: "Fusion à haute énergie",
				11_107: "Réserve alimentaire",
				11_108: "Extraction par fusion",
				11_109: "Tour d’habitation",
				11_110: "Laboratoire de biotechnologie",
				11_111: "Metropolis",
				11_112: "Bouclier planétaire",
				11_201: "Intergalactic Envoys",
				11_202: "Extracteurs à haute performance",
				11_203: "Moteur à fusion",
				11_204: "Générateur de champ de camouflage",
				11_205: "Planque orbitale",
				11_206: "IA de recherche",
				11_207: "Terraformeur à haute performance",
				11_208: "Technologies d'extraction améliorés",
				11_209: "Chasseur léger Mk II",
				11_210: "Croiseur Mk II",
				11_211: "Technologie de laboratoire améliorée",
				11_212: "Terraformeur à plasma",
				11_213: "Propulseurs à faible température",
				11_214: "Bombardier Mk II",
				11_215: "Destroyer Mk II",
				11_216: "Traqueur Mk II",
				11_217: "Assistants robotiques",
				11_218: "Superordinateur",
				12_101: "Enclave stoïque",
				12_102: "Culture du cristal",
				12_103: "Centre technologique runique",
				12_104: "Forge runique",
				12_105: "Orictorium",
				12_106: "Fusion magmatique",
				12_107: "Chambre de disruption",
				12_108: "Monument rocheux",
				12_109: "Raffinerie de cristal",
				12_110: "Syntoniseur de deutérium",
				12_111: "Centre de recherche sur les minéraux",
				12_112: "Usine de traitement à haut rendement",
				12_201: "Batteries volcaniques",
				12_202: "Sondage acoustique",
				12_203: "Système de pompage à haute énergie",
				12_204: "Extension d'espace fret",
				12_205: "Extraction",
				12_206: "Centrales géothermiques",
				12_207: "Sondage en profondeur",
				12_208: "Renforcement à cristaux ioniques",
				12_209: "Stellarator amélioré",
				12_210: "Tête de forage en dimant",
				12_211: "Technologie d'extraction sismique",
				12_212: "Pompes au magma",
				12_213: "Module à cristaux ioniques",
				12_214: "Construction optimisée de silos",
				12_215: "Émetteur d'énergie à diamants",
				12_216: "Intensification du bouclier à l'obsidienne",
				12_217: "Boucliers runiques",
				12_218: "Renfort du collecteur Rocta",
				13_101: "Chaîne de production",
				13_102: "Usine de fusion de cellules",
				13_103: "Centre de recherche en robotique",
				13_104: "Réseau d’actualisation",
				13_105: "Centre d’informatique quantique",
				13_106: "Centre d’assemblage automatisé",
				13_107: "Transformateur hyperpuissant",
				13_108: "Chaîne de production de micropuces",
				13_109: "Atelier de montage",
				13_110: "Synthétiseur à haut rendement",
				13_111: "Production de masse de puces",
				13_112: "Nanorobots réparateurs",
				13_201: "Technique de catalyse",
				13_202: "Moteur à plasma",
				13_203: "Module d'optimisation",
				13_204: "IA du dépôt",
				13_205: "Révision général (chasseur léger)",
				13_206: "Chaîne de production automatisée",
				13_207: "IA de drone améliorée",
				13_208: "Technique de recyclage expérimental",
				13_209: "Révision général (croiseur)",
				13_210: "Pilote automatique Slingshot",
				13_211: "Supraconducteur à haute température",
				13_212: "Révision général (vaisseau de bataille)",
				13_213: "Intelligence artificielle collective",
				13_214: "Révision général (traqueur)",
				13_215: "Révision général (bombardier)",
				13_216: "Révision général (destructeur)",
				13_217: "Technique d'armement expérimental",
				13_218: "Renforcement du général des Mechas",
				14_101: "Refugium",
				14_102: "Condensateur d’antimatière",
				14_103: "Salle à vortex",
				14_104: "Maison du savoir",
				14_105: "Forum de la transcendance",
				14_106: "Convecteur d’antimatière",
				14_107: "Laboratoire de clonage",
				14_108: "Accélérateur par chrysalide",
				14_109: "Biomodificateur",
				14_110: "Modulateur psionique",
				14_111: "Hangar de construction de vaisseau",
				14_112: "Supraréfracteur",
				14_201: "Récupération de chaleur",
				14_202: "Traitement au sulfure",
				14_203: "Réseau psionique",
				14_204: "Faisceau de traction télékinésique	",
				14_205: "Technologie de détection améliorée",
				14_206: "Compresseur neuromodal",
				14_207: "Neuro-interface",
				14_208: "Réseau d'analyse superglobal",
				14_209: "Surcadençage (chasseur lourd)",
				14_210: "Système de propulsion télékinétique",
				14_211: "Sixième sens",
				14_212: "Harmonisateur psychique",
				14_213: "Efficient Swarm Intelligence",
				14_214: "Surcadençage (grand transporteur)",
				14_215: "Capteurs gravitationnels",
				14_216: "Surcadençage (vaisseau de bataille)",
				14_217: "Matrice de protection psionique",
				14_218: "Renforcement d'explorateur Kaelesh",
				account_overview: "Résumé du compte",
				alliance: "Alliance",
				amortizations: "Amortissements",
				at: "à",
				buildings: "Bâtiments",
				classes_alliance_researcher: "Chercheur",
				classes_alliance_trader: "Marchand",
				classes_alliance_warrior: "Guerrier",
				classes_player_explorer: "Explorateur",
				classes_player_miner: "Collecteur",
				classes_player_warrior: "Général",
				clear_confirm: "Vous êtes sur le point de supprimer les données d'InfoCompte.",
				colors: "Couleurs",
				crystal: "Cristal",
				daily_productions: "Productions journalières",
				data_alert: "Il manque des données. Visitez la vue Empire.",
				days: "jours",
				defences: "Défenses",
				deuterium: "Deutérium",
				deuterium_equivalent: "Équivalent deutérium",
				empire: "Empire",
				empire_of: "Empire du joueur",
				export_notification: "Export placé dans le presse-papier",
				generated_on: "Généré le",
				highscore: "Classement",
				hours: "heures",
				if_destroyed: "place(s) si détruit",
				image: "Image",
				indestructibles: "Indestructibles",
				levels: "Niveaux",
				lifeform1: "Humains",
				lifeform2: "Roctas",
				lifeform3: "Mecas",
				lifeform4: "Kaeleshs",
				lifeforms: "Formes de vie",
				lifeforms_buildings: "Bâtiments FDV",
				lifeforms_levels: "Niveaux des FDV",
				lifeforms_researches: "Recherches FDV",
				maximum: "maximum",
				metal: "Métal",
				mines: "Mines",
				mines_only: "Mines seules",
				months: "mois",
				moon: "Lune",
				moons_buildings: "Bâtiments lunaires",
				moons_defences: "Défenses lunaires",
				objects: "Objets",
				officers: "Officiers",
				on: "sur",
				others: "Autres",
				planet: "Planète",
				planet_fields: "Cases planétaires",
				planets: "Planètes",
				planets_buildings: "Bâtiments planétaires",
				planets_defences: "Défenses planétaires",
				planets_points_repartition: "Répartition des points par planète",
				points: "Points",
				points_repartition: "Répartition des points",
				production: "Production",
				production_of: "Production du joueur",
				productions: "Productions",
				queue: "File de constructions",
				rates: "Taux de change",
				recalculate: "Recalculer",
				researches: "Recherches",
				resources: "Ressources",
				script_data: "Données du script",
				settings: "Options",
				ships: "Vaisseaux",
				shipyards: "Chantiers spatiaux",
				support_link: "https://board.fr.ogame.gameforge.com/index.php?thread/746302-infocompte/",
				temperatures_maximum: "Températures maximales",
				text: "Texte",
				total: "Total",
				upgrades: "En construction",
				used: "utilisées",
				weeks: "semaines",
				when_finished: "place(s) quand terminé",
				with: "avec",
				years: "années"
			}
		};
		const translation = translations[ document.documentElement.lang ] || translations.en;
		return translation;
	})();
	const Types = (function(){
		const locale = LocalizationStrings.decimalPoint === '.' ? 'en-US' : 'de-DE';
		const options = {
			compact: {
				notation: 'compact' ,
				compactDisplay: 'short',
				maximumFractionDigits: 2
			},
			decimal: {
				style: 'decimal',
				maximumFractionDigits: 2
			},
			percent: {
				style: 'percent',
				minimumFractionDigits: 2
			}
		};
		function get_number_from( value ){
			value = value.replaceAll( LocalizationStrings.thousandSeperator, '' );
			return parseInt( value );
		}
		function get_string_number_compact_from( value ){
			value = Math.floor( value ).toLocaleString( 'en', options.compact );
			return value.replaceAll( '.', LocalizationStrings.decimalPoint );
		}
		function get_string_number_full_from( value ){
			return value.toLocaleString( locale, options.decimal );
		}
		function get_string_number_truncated_from( value ){
			return Math.trunc( value ).toLocaleString( locale, options.decimal );
		}
		function get_duration_from( value ){
			let unit;
			if( value === Infinity ){
				return '&infin;';
			}else if( value > 8_760 ){
				unit = Translation.years;
				value /= 8_760
			}else if( value > 732 ){
				unit = Translation.months;
				value /= 732;
			}else if( value > 168 ){
				unit = Translation.weeks;
				value /= 168;
			}else if( value > 24 ){
				unit = Translation.days;
				value /= 24;
			}else{
				unit = Translation.hours;
			}
			value = value.toLocaleString( locale, options.decimal );
			return `${ value } ${ unit }`;
		}
		function get_percent_from( value ){
			return value.toLocaleString( locale, options.percent );
		}
		function are_objects( ...values ){
			let result = true;
			for( const value of values ){
				const is_object = value != null && value.constructor.name === 'Object';
				if( !is_object ){
					result = false;
					break;
				}
			}
			return result;
		}
		return {
			get_number_from,
			get_string_number_compact_from,
			get_string_number_full_from,
			get_string_number_truncated_from,
			get_duration_from,
			get_percent_from,
			are_objects
		};
	})();
// Initialization
	const storage = Storage.get();
	const scraper = await Scraper.get();
	const data = Data.get_from( storage, scraper );
	Components.init_from( data );
	Storage.set_from( data );
})();