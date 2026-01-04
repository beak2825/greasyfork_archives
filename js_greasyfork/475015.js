// ==UserScript==
// @name         PIU Phoenix
// @license      MIT
// @namespace    https://github.com/numbuh1/pump-it-up-phoenix-bookmarklet
// @version      1.2
// @description  PIU Phoenix Score&Title Analyser Patch 1.0.2
// @author       numbuh1
// @match        https://piugame.com/my_page/my_best_score.php
// @icon         <$ICON$>
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/475015/PIU%20Phoenix.user.js
// @updateURL https://update.greasyfork.org/scripts/475015/PIU%20Phoenix.meta.js
// ==/UserScript==

const rating_text = {
	'sss_p': 'SSS+',
	'sss': 'SSS',
	'ss_p': 'SS+',
	'ss': 'SS',
	's_p': 'S+',
	's': 'S',
	'aaa_p': 'AAA+',
	'aaa': 'AAA',
	'aa_p': 'AA+',
	'aa': 'AA',
	'a_p': 'A+',
	'a': 'A',
	'b': 'B',
	'c': 'C',
	'd': 'D',
	'f': 'F',
};
const plate_text = {
	'pg': 'PERFECT GAME',
	'ug': 'ULTIMATE GAME',
	'eg': 'EXTREME GAME',
	'sg': 'SUPERB GAME',
	'mg': 'MARVELOUS GAME',
	'tg': 'TALENTED GAME',
	'fg': 'FAIR GAME',
	'rg': 'ROUGH GAME'
};
const expert_titles = [
	{
		name: 'THE MASTER',
		description: '[Lv.28] 1,900 rating',
		tier: 'platinum',
		type: 'rating',
		level: '28',
		rating: '1900'
	},
	{
		name: 'EXPERT Lv.10',
		description: '[Lv.27] 7,000 rating',
		tier: 'platinum',
		type: 'rating',
		level: '27',
		rating: '7000'
	},
	{
		name: 'EXPERT Lv.9',
		description: '[Lv.27] 3,500 rating',
		tier: 'gold',
		type: 'rating',
		level: '27',
		rating: '3500'
	},
	{
		name: 'EXPERT Lv.8',
		description: '[Lv.26] 26,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '26',
		rating: '26000'
	},
	{
		name: 'EXPERT Lv.7',
		description: '[Lv.26] 13,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '26',
		rating: '13000'
	},
	{
		name: 'EXPERT Lv.6',
		description: '[Lv.25] 40,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '25',
		rating: '40000'
	},
	{
		name: 'EXPERT Lv.5',
		description: '[Lv.25] 20,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '25',
		rating: '20000'
	},
	{
		name: 'EXPERT Lv.4',
		description: '[Lv.24] 60,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '24',
		rating: '60000'
	},
	{
		name: 'EXPERT Lv.3',
		description: '[Lv.24] 30,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '24',
		rating: '30000'
	},
	{
		name: 'EXPERT Lv.2',
		description: '[Lv.23] 80,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '23',
		rating: '80000'
	},
	{
		name: 'EXPERT Lv.1',
		description: '[Lv.23] 40,000 rating',
		tier: 'gold',
		type: 'rating',
		level: '23',
		rating: '40000'
	},
	{
		name: 'ADVANCED Lv.10',
		description: '[Lv.22] 70,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '22',
		rating: '70000'
	},
	{
		name: 'ADVANCED Lv.9',
		description: '[Lv.22] 52,500 rating',
		tier: 'silver',
		type: 'rating',
		level: '22',
		rating: '52500'
	},
	{
		name: 'ADVANCED Lv.8',
		description: '[Lv.22] 35,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '22',
		rating: '35000'
	},
	{
		name: 'ADVANCED Lv.7',
		description: '[Lv.22] 17,500 rating',
		tier: 'silver',
		type: 'rating',
		level: '22',
		rating: '17500'
	},
	{
		name: 'ADVANCED Lv.6',
		description: '[Lv.21] 45,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '21',
		rating: '45000'
	},
	{
		name: 'ADVANCED Lv.5',
		description: '[Lv.21] 30,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '21',
		rating: '30000'
	},
	{
		name: 'ADVANCED Lv.4',
		description: '[Lv.21] 15,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '21',
		rating: '15000'
	},
	{
		name: 'ADVANCED Lv.3',
		description: '[Lv.20] 39,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '20',
		rating: '39000'
	},
	{
		name: 'ADVANCED Lv.2',
		description: '[Lv.20] 26,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '20',
		rating: '26000'
	},
	{
		name: 'ADVANCED Lv.1',
		description: '[Lv.20] 13,000 rating',
		tier: 'silver',
		type: 'rating',
		level: '20',
		rating: '13000'
	},
	{
		name: 'INTERMEDIATE Lv.10',
		description: '[Lv.19] 11,000 rating',
		tier: 'bronze',
		type: 'rating',
		level: '19',
		rating: '11000'
	},
	{
		name: 'INTERMEDIATE Lv.9',
		description: '[Lv.18] 9,200 rating',
		tier: 'bronze',
		type: 'rating',
		level: '18',
		rating: '9200'
	},
	{
		name: 'INTERMEDIATE Lv.8',
		description: '[Lv.17] 7,600 rating',
		tier: 'bronze',
		type: 'rating',
		level: '17',
		rating: '7600'
	},
	{
		name: 'INTERMEDIATE Lv.7',
		description: '[Lv.16] 6,200 rating',
		tier: 'bronze',
		type: 'rating',
		level: '16',
		rating: '6200'
	},
	{
		name: 'INTERMEDIATE Lv.6',
		description: '[Lv.15] 5,000 rating',
		tier: 'bronze',
		type: 'rating',
		level: '15',
		rating: '5000'
	},
	{
		name: 'INTERMEDIATE Lv.5',
		description: '[Lv.14] 4,000 rating',
		tier: 'bronze',
		type: 'rating',
		level: '14',
		rating: '4000'
	},
	{
		name: 'INTERMEDIATE Lv.4',
		description: '[Lv.13] 3,200 rating',
		tier: 'bronze',
		type: 'rating',
		level: '13',
		rating: '3200'
	},
	{
		name: 'INTERMEDIATE Lv.3',
		description: '[Lv.12] 2,600 rating',
		tier: 'bronze',
		type: 'rating',
		level: '12',
		rating: '2600'
	},
	{
		name: 'INTERMEDIATE Lv.2',
		description: '[Lv.11] 2,200 rating',
		tier: 'bronze',
		type: 'rating',
		level: '11',
		rating: '2200'
	},
	{
		name: 'INTERMEDIATE Lv.1',
		description: '[Lv.10] 2,000 rating',
		tier: 'bronze',
		type: 'rating',
		level: '10',
		rating: '2000'
	},
	{
		name: 'SPECIALIST',
		description: 'All skill titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'skill',
		count: 60
	},
	{
		name: '[BRACKET] EXPERT',
		description: 'All Bracket titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'bracket',
		count: 10
	},
	{
		name: '[BRACKET] Lv.10',
		description: 'Phalanx D24',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Phalanx',
		diff: 'D24'
	},
	{
		name: '[BRACKET] Lv.9',
		description: 'Scorpion King D23',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Scorpion King',
		diff: 'D23'
	},
	{
		name: '[BRACKET] Lv.8',
		description: 'Pop Sequence D23',
		tier: 'gold',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Pop Sequence',
		diff: 'D23'
	},
	{
		name: '[BRACKET] Lv.7',
		description: 'What Happened D23',
		tier: 'gold',
		type: 'skill',
		collect_type: 'bracket',
		song: 'What Happened',
		diff: 'D23'
	},
	{
		name: '[BRACKET] Lv.6',
		description: 'Meteo5cience D22',
		tier: 'silver',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Meteo5cience',
		diff: 'D22'
	},
	{
		name: '[BRACKET] Lv.5',
		description: 'Phalanx S22',
		tier: 'silver',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Phalanx',
		diff: 'S22'
	},
	{
		name: '[BRACKET] Lv.4',
		description: 'What Happened S21',
		tier: 'silver',
		type: 'skill',
		collect_type: 'bracket',
		song: 'What Happened',
		diff: 'S21'
	},
	{
		name: '[BRACKET] Lv.3',
		description: 'Meteo5cience D21',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Meteo5cience',
		diff: 'D21'
	},
	{
		name: '[BRACKET] Lv.2',
		description: 'Mad5cience S20',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Mad5cience',
		diff: 'S20'
	},
	{
		name: '[BRACKET] Lv.1',
		description: 'Allegro furioso D20',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'bracket',
		song: 'Allegro furioso',
		diff: 'D20'
	},
	{
		name: '[HALF] EXPERT',
		description: 'All Half titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'half',
		count: 10
	},
	{
		name: '[HALF] Lv.10',
		description: 'Imprinting D24',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'half',
		song: 'Imprinting',
		diff: 'D24'
	},
	{
		name: '[HALF] Lv.9',
		description: 'Love is a Danger Zone 2 Try To B.P.M D23',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'half',
		song: 'Love is a Danger Zone 2 Try To B.P.M',
		diff: 'D23'
	},
	{
		name: '[HALF] Lv.8',
		description: 'Redline D22',
		tier: 'gold',
		type: 'skill',
		collect_type: 'half',
		song: 'Redline',
		diff: 'D22'
	},
	{
		name: '[HALF] Lv.7',
		description: 'Witch Doctor #1 D21',
		tier: 'gold',
		type: 'skill',
		collect_type: 'half',
		song: 'Witch Doctor #1',
		diff: 'D21'
	},
	{
		name: '[HALF] Lv.6',
		description: 'Utsushiyo No Kaze D20',
		tier: 'silver',
		type: 'skill',
		collect_type: 'half',
		song: 'Utsushiyo No Kaze',
		diff: 'D20'
	},
	{
		name: '[HALF] Lv.5',
		description: 'Phantom D19',
		tier: 'silver',
		type: 'skill',
		collect_type: 'half',
		song: 'Phantom',
		diff: 'D19'
	},
	{
		name: '[HALF] Lv.4',
		description: 'Super Fantasy D18',
		tier: 'silver',
		type: 'skill',
		collect_type: 'half',
		song: 'Super Fantasy',
		diff: 'D18'
	},
	{
		name: '[HALF] Lv.3',
		description: 'Shub Niggurath D18',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'half',
		song: 'Shub Niggurath',
		diff: 'D18'
	},
	{
		name: '[HALF] Lv.2',
		description: 'Butterfly D17',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'half',
		song: 'Butterfly',
		diff: 'D17'
	},
	{
		name: '[HALF] Lv.1',
		description: 'Mopemope D17',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'half',
		song: 'Mopemope',
		diff: 'D17'
	},
	{
		name: '[GIMMICK] EXPERT',
		description: 'All Gimmick titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'gimmick',
		count: 10
	},
	{
		name: '[GIMMICK] Lv.10',
		description: 'Everybody Got 2 Know S21',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Everybody Got 2 Know',
		diff: 'S21'
	},
	{
		name: '[GIMMICK] Lv.9',
		description: '8 6 S20',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'gimmick',
		song: '8 6',
		diff: 'S20'
	},
	{
		name: '[GIMMICK] Lv.8',
		description: 'Twist of Fate (feat. Ruriling) S19',
		tier: 'gold',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Twist of Fate (feat. Ruriling)',
		diff: 'S19'
	},
	{
		name: '[GIMMICK] Lv.7',
		description: 'Nakakapagpabagabag S19',
		tier: 'gold',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Nakakapagpabagabag',
		diff: 'S19'
	},
	{
		name: '[GIMMICK] Lv.6',
		description: 'Miss S\' story S19',
		tier: 'silver',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Miss S\' story',
		diff: 'S19'
	},
	{
		name: '[GIMMICK] Lv.5',
		description: 'Rock the house - SHORT CUT - S18',
		tier: 'silver',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Rock the house - SHORT CUT -',
		diff: 'S18'
	},
	{
		name: '[GIMMICK] Lv.4',
		description: 'Come to Me S17',
		tier: 'silver',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Come to Me',
		diff: 'S17'
	},
	{
		name: '[GIMMICK] Lv.3',
		description: 'Ugly Dee S17',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Ugly Dee',
		diff: 'S17'
	},
	{
		name: '[GIMMICK] Lv.2',
		description: '8 6 S16',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'gimmick',
		song: '8 6',
		diff: 'S16'
	},
	{
		name: '[GIMMICK] Lv.1',
		description: 'Yeo rae a S13',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'gimmick',
		song: 'Yeo rae a',
		diff: 'S13'
	},
	{
		name: '[DRILL] EXPERT',
		description: 'All Drill titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'drill',
		count: 10
	},
	{
		name: '[DRILL] Lv.10',
		description: 'WI-EX-DOC-VA D24',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'drill',
		song: 'WI-EX-DOC-VA',
		diff: 'D24'
	},
	{
		name: '[DRILL] Lv.9',
		description: 'Witch Doctor D23',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'drill',
		song: 'Witch Doctor',
		diff: 'D23'
	},
	{
		name: '[DRILL] Lv.8',
		description: 'Rock the house D22',
		tier: 'gold',
		type: 'skill',
		collect_type: 'drill',
		song: 'Rock the house',
		diff: 'D22'
	},
	{
		name: '[DRILL] Lv.7',
		description: 'Sorceress Elise S21',
		tier: 'gold',
		type: 'skill',
		collect_type: 'drill',
		song: 'Sorceress Elise',
		diff: 'S21'
	},
	{
		name: '[DRILL] Lv.6',
		description: 'Overblow S20',
		tier: 'silver',
		type: 'skill',
		collect_type: 'drill',
		song: 'Overblow',
		diff: 'S20'
	},
	{
		name: '[DRILL] Lv.5',
		description: 'Vacuum S19',
		tier: 'silver',
		type: 'skill',
		collect_type: 'drill',
		song: 'Vacuum',
		diff: 'S19'
	},
	{
		name: '[DRILL] Lv.4',
		description: 'Moonlight S18',
		tier: 'silver',
		type: 'skill',
		collect_type: 'drill',
		song: 'Moonlight',
		diff: 'S18'
	},
	{
		name: '[DRILL] Lv.3',
		description: 'Gun Rock S17',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'drill',
		song: 'Gun Rock',
		diff: 'S17'
	},
	{
		name: '[DRILL] Lv.2',
		description: 'Vook S16',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'drill',
		song: 'Vook',
		diff: 'S16'
	},
	{
		name: '[DRILL] Lv.1',
		description: 'Hellfire S13',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'drill',
		song: 'Hellfire',
		diff: 'S13'
	},
	{
		name: '[RUN] EXPERT',
		description: 'All Run titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'run',
		count: 10
	},
	{
		name: '[RUN] Lv.10',
		description: 'Yog-Sothoth D24',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'run',
		song: 'Yog-Sothoth',
		diff: 'D24'
	},
	{
		name: '[RUN] Lv.9',
		description: 'Baroque Virus - FULL SONG - D23',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'run',
		song: 'Baroque Virus - FULL SONG -',
		diff: 'D23'
	},
	{
		name: '[RUN] Lv.8',
		description: 'Gargoyle - FULL SONG - D22',
		tier: 'gold',
		type: 'skill',
		collect_type: 'run',
		song: 'Gargoyle - FULL SONG -',
		diff: 'D22'
	},
	{
		name: '[RUN] Lv.7',
		description: 'Sarabande D21',
		tier: 'gold',
		type: 'skill',
		collect_type: 'run',
		song: 'Sarabande',
		diff: 'D21'
	},
	{
		name: '[RUN] Lv.6',
		description: 'Bee D20',
		tier: 'silver',
		type: 'skill',
		collect_type: 'run',
		song: 'Bee',
		diff: 'D20'
	},
	{
		name: '[RUN] Lv.5',
		description: 'Napalm S19',
		tier: 'silver',
		type: 'skill',
		collect_type: 'run',
		song: 'Napalm',
		diff: 'S19'
	},
	{
		name: '[RUN] Lv.4',
		description: 'Gothique Resonance S18',
		tier: 'silver',
		type: 'skill',
		collect_type: 'run',
		song: 'Gothique Resonance',
		diff: 'S18'
	},
	{
		name: '[RUN] Lv.3',
		description: 'Pavane S17',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'run',
		song: 'Pavane',
		diff: 'S17'
	},
	{
		name: '[RUN] Lv.2',
		description: 'Super Fantasy S16',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'run',
		song: 'Super Fantasy',
		diff: 'S16'
	},
	{
		name: '[RUN] Lv.1',
		description: 'Switronic S13',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'run',
		song: 'Switronic',
		diff: 'S13'
	},
	{
		name: '[TWIST] EXPERT',
		description: 'All Twist titles',
		tier: 'platinum',
		type: 'skill_collect',
		collect_type: 'twist',
		count: 10
	},
	{
		name: '[TWIST] Lv.10',
		description: 'Bee D24',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'twist',
		song: 'Bee',
		diff: 'D24'
	},
	{
		name: '[TWIST] Lv.9',
		description: 'Love Is A Danger Zone(Cranky Mix) D23',
		tier: 'platinum',
		type: 'skill',
		collect_type: 'twist',
		song: 'Love Is A Danger Zone(Cranky Mix)',
		diff: 'D23'
	},
	{
		name: '[TWIST] Lv.8',
		description: 'Super Fantasy D22',
		tier: 'gold',
		type: 'skill',
		collect_type: 'twist',
		song: 'Super Fantasy',
		diff: 'D22'
	},
	{
		name: '[TWIST] Lv.7',
		description: 'Love is a Danger Zone D21',
		tier: 'gold',
		type: 'skill',
		collect_type: 'twist',
		song: 'Love is a Danger Zone',
		diff: 'D21'
	},
	{
		name: '[TWIST] Lv.6',
		description: 'Witch Doctor #1 D20',
		tier: 'silver',
		type: 'skill',
		collect_type: 'twist',
		song: 'Witch Doctor #1',
		diff: 'D20'
	},
	{
		name: '[TWIST] Lv.5',
		description: 'U GOT 2 KNOW S19',
		tier: 'silver',
		type: 'skill',
		collect_type: 'twist',
		song: 'U GOT 2 KNOW',
		diff: 'S19'
	},
	{
		name: '[TWIST] Lv.4',
		description: 'Solitary 2 S18',
		tier: 'silver',
		type: 'skill',
		collect_type: 'twist',
		song: 'Solitary 2',
		diff: 'S18'
	},
	{
		name: '[TWIST] Lv.3',
		description: 'U Got Me Rocking S17',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'twist',
		song: 'U Got Me Rocking',
		diff: 'S17'
	},
	{
		name: '[TWIST] Lv.2',
		description: 'Street show down S16',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'twist',
		song: 'Street show down',
		diff: 'S16'
	},
	{
		name: '[TWIST] Lv.1',
		description: 'Scorpion King S13',
		tier: 'bronze',
		type: 'skill',
		collect_type: 'twist',
		song: 'Scorpion King',
		diff: 'S13'
	},
	{
		name: '[XX] Double',
		description: '1949 D28',
		tier: 'platinum',
		type: 'boss',
		song: '1949',
		diff: 'D28'
	},
	{
		name: '[XX] Single',
		description: 'ERRORCODE: 0 S25',
		tier: 'gold',
		type: 'boss',
		song: 'ERRORCODE: 0',
		diff: 'S25'
	},
	{
		name: '[PRIME2] Double',
		description: 'Shub Sothoth D27',
		tier: 'platinum',
		type: 'boss',
		song: 'Shub Sothoth',
		diff: 'D27'
	},
	{
		name: '[PRIME2] Single',
		description: 'Shub Sothoth S25',
		tier: 'gold',
		type: 'boss',
		song: 'Shub Sothoth',
		diff: 'S25'
	},
	{
		name: '[PRIME] Double',
		description: 'Paradoxx D28',
		tier: 'platinum',
		type: 'boss',
		song: 'Paradoxx',
		diff: 'D28'
	},
	{
		name: '[PRIME] Single',
		description: 'Paradoxx S26',
		tier: 'gold',
		type: 'boss',
		song: 'Paradoxx',
		diff: 'S26'
	},
	{
		name: '[FIESTA2] Double',
		description: 'Ignis Fatuus D25',
		tier: 'gold',
		type: 'boss',
		song: 'Ignis Fatuus',
		diff: 'D25'
	},
	{
		name: '[FIESTA2] Single',
		description: 'Ignis Fatuus S22',
		tier: 'silver',
		type: 'boss',
		song: 'Ignis Fatuus',
		diff: 'S22'
	},
	{
		name: '[FIESTA EX] Double',
		description: 'Vacuum Cleaner D26',
		tier: 'gold',
		type: 'boss',
		song: 'Vacuum Cleaner',
		diff: 'D26'
	},
	{
		name: '[FIESTA EX] Single',
		description: 'Vacuum Cleaner S25',
		tier: 'gold',
		type: 'boss',
		song: 'Vacuum Cleaner',
		diff: 'S25'
	},
	{
		name: '[FIESTA] Double',
		description: 'Vacuum D25',
		tier: 'gold',
		type: 'boss',
		song: 'Vacuum',
		diff: 'D25'
	},
	{
		name: '[FIESTA] Single',
		description: 'Vacuum S23',
		tier: 'silver',
		type: 'boss',
		song: 'Vacuum',
		diff: 'S23'
	},
	{
		name: '[NXA] Double',
		description: 'Final Audition Ep. 2-X D24',
		tier: 'gold',
		type: 'boss',
		song: 'Final Audition Ep. 2-X',
		diff: 'D24'
	},
	{
		name: '[NXA] Single',
		description: 'Final Audition Ep. 2-X S23',
		tier: 'silver',
		type: 'boss',
		song: 'Final Audition Ep. 2-X',
		diff: 'S23'
	},
	{
		name: '[NX2] Double',
		description: 'Banya-P Guitar Remix D24',
		tier: 'gold',
		type: 'boss',
		song: 'Banya-P Guitar Remix',
		diff: 'D24'
	},
	{
		name: '[NX2] Single',
		description: 'Banya-P Guitar Remix S22',
		tier: 'silver',
		type: 'boss',
		song: 'Banya-P Guitar Remix',
		diff: 'S22'
	},
	{
		name: '[NX] Double',
		description: 'Bemera D26',
		tier: 'gold',
		type: 'boss',
		song: 'Bemera',
		diff: 'D26'
	},
	{
		name: '[NX] Single',
		description: 'Bemera S24',
		tier: 'silver',
		type: 'boss',
		song: 'Bemera',
		diff: 'S24'
	},
	{
		name: '[ZERO] Double',
		description: 'Love is a Danger Zone pt. 2 D24',
		tier: 'silver',
		type: 'boss',
		song: 'Love is a Danger Zone pt. 2',
		diff: 'D24'
	},
	{
		name: '[ZERO] Single',
		description: 'Love is a Danger Zone pt. 2 S22',
		tier: 'silver',
		type: 'boss',
		song: 'Love is a Danger Zone pt. 2',
		diff: 'S22'
	},
	{
		name: '[EXCEED2] Double',
		description: 'Canon D D23',
		tier: 'silver',
		type: 'boss',
		song: 'Canon D',
		diff: 'D23'
	},
	{
		name: '[EXCEED2] Single',
		description: 'Canon D S20',
		tier: 'silver',
		type: 'boss',
		song: 'Canon D',
		diff: 'S20'
	},
	{
		name: '[EXCEED] Double',
		description: 'Dignity D24',
		tier: 'gold',
		type: 'boss',
		song: 'Dignity',
		diff: 'D24'
	},
	{
		name: '[EXCEED] Single',
		description: 'Dignity S21',
		tier: 'silver',
		type: 'boss',
		song: 'Dignity',
		diff: 'S21'
	},
	{
		name: '[THE PREX3]',
		description: 'Bee S17',
		tier: 'bronze',
		type: 'boss',
		song: 'Bee',
		diff: 'S17'
	},
	{
		name: '[THE REBIRTH]',
		description: 'Love is a Danger Zone S17',
		tier: 'bronze',
		type: 'boss',
		song: 'Love is a Danger Zone',
		diff: 'S17'
	},
	{
		name: '[EXTRA]',
		description: 'Radetzky Can Can D18',
		tier: 'bronze',
		type: 'boss',
		song: 'Radetzky Can Can',
		diff: 'D18'
	},
	{
		name: '[Perfect Collection]',
		description: 'Slam S18',
		tier: 'bronze',
		type: 'boss',
		song: 'Slam',
		diff: 'S18'
	},
	{
		name: '[The O.B.G SE]',
		description: 'Mr. Larpus S15',
		tier: 'bronze',
		type: 'boss',
		song: 'Mr. Larpus',
		diff: 'S15'
	},
	{
		name: '[The O.B.G]',
		description: 'Turkey March S12',
		tier: 'bronze',
		type: 'boss',
		song: 'Turkey March',
		diff: 'S12'
	},
	{
		name: '[The 2nd]',
		description: 'Extravaganza S11',
		tier: 'bronze',
		type: 'boss',
		song: 'Extravaganza',
		diff: 'S11'
	},
	{
		name: '[The 1st]',
		description: 'Another Truth S6',
		tier: 'bronze',
		type: 'boss',
		song: 'Another Truth',
		diff: 'S6'
	},
];

fetchAllScores();

function fetchAllScores() {
	let pages = parseInt($('.board_paging button:last').attr('onclick').split('=')[2].split('\'')[0]);
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css') );
	$('#contents').css('background', '#1a1b1e');
	$('#header').remove();
	$('.pageWrap').html('');
	showProgress(pages);
	let scores = [];
	let current_url = window.location.href;

	if(window.location.href.indexOf('?') == -1) {
		current_url = current_url + '?';
	}

	let mark = 1;
	for (var i = 1; i <= pages; i++) {
		fetchScores(current_url + '&&page=' + i)
			.then((score) => {
				console.log(mark + '/' + pages);
				$('#current_progress_page').html(mark);
				$('#fetch_progress_bar').css('width', ((mark/pages)*100) + '%');
				for (var j = score.length - 1; j >= 0; j--) {
					scores.push(score[j])
				}
				if(mark == pages) {
					$('#progress_pane').hide();
					run(scores)
				}
				mark++;
			});
	}
}


function run(scores) {
	scores.sort(function(a, b){
	    var a1 = a.rating, b1 = b.rating;
	    if(a1 == b1) {
		var a2 = a.score, b2 = b.score;
		    if(a2 == b2) {
			return 0;
		    }
		return a2 > b2 ? -1 : 1;
	    }
	    return a1 > b1 ? -1 : 1;
	});

	createAnalytic(scores);
}

function showProgress(page) {
	$('.pageWrap').prepend('<div id="progress_pane"><h1 style="color:white">Fetching scores:</h1><div id="fetch_progress" class="progress" style="height: 30px;"></div>');
	$('#fetch_progress').append('<div id="fetch_progress_bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" ' +
		'aria-valuenow="0" aria-valuemin="0" aria-valuemax="' + page + '" style="width: 0%">'+
		'<div style="position: absolute; text-align: center; line-height: 20px; overflow: hidden; color: black; right: 0; left: 0; top: 0;">'+
		'<span style="font-size: 20px;"><span id="current_progress_page">0</span>/' + page + '</span></div></div>');
}

function createAnalytic(scores) {
	console.log("Run Analytics");

	$('.pageWrap').prepend('<div id="table_pane" class="row"><div id="table_pane_body" class="col-md-6"><table id="main_table" class="table table-dark table-striped"></table></div></div>');
	$('#main_table').append('<thead class="thead-dark"><tr><th width="30">#</th><th>Song</th><th width="50">Diff</th><th width="100">Score</th><th width="50">Rank</th><th width="70">Rating</th></tr></thead>');
	//$('#main_table').css('');
	$('#main_table').append('<tbody id="main_table_body"><tbody>');

	for (var i = 0; i < scores.length; i++) {
		switch(scores[i].level_type) {
			case 'single':
			    var level_style = 'style="font-weight: bolder; color: orangered;"';
			    break;
			case 'double':
			    level_style = 'style="font-weight: bolder; color: lawngreen;"';
			    break;
			case 'coop':
			level_style = 'style="font-weight: bolder; color: yellow;"';
			break;
		    default:
			level_style = '';
		}
		switch(scores[i].score_rate) {
			case 'sss_p':
			case 'sss':
			    var score_style = 'style="font-weight: bolder; color: cyan;"';
			    break;
			case 'ss_p':
			case 'ss':
			case 's_p':
			case 's':
			    score_style = 'style="font-weight: bolder; color: gold;"';
			    break;
			case 'aaa_p':
			case 'aaa':
			score_style = 'style="font-weight: bolder; color: silver;"';
			break;
		    case 'aa_p':
		    case 'aa':
		    case 'a_p':
		    case 'a':
			score_style = 'style="font-weight: bolder; color: orangered;"';
			break;
		    default:
			score_style = 'style="font-weight: bolder; color: greenyellow;"';
		}
		$('#main_table_body').append('<tr>' +
			'<td>' + (i+1) + '</td>' +
			'<td>' + scores[i].name + '</td>' +
			'<td ' + level_style + '>' + scores[i].level_text + '</td>' +
			'<td>' + scores[i].score_text + '</td>' +
			'<td ' + score_style + '>' + scores[i].score_rate_text + '</td>' +
			'<td>' + scores[i].rating + '</td>');
	}


	$('#table_pane').append('<div id="table_pane_progress" class="col-md-6"><table id="progress_table" class="table table-dark table-striped"></table></div>');
	$('#progress_table').append('<thead class="thead-dark"><tr><th width="180">Title</th><th width="180">Description</th><th>Progress</th></tr></thead>');
	$('#progress_table').append('<tbody id="progress_table_body"><tbody>');

	var level_progress = [];
	var level_progress_list = [];
	var score_progress = scores;
	score_progress.reduce(function(res, value) {
		if (!res[value.level]) {
		    res[value.level] = { diff: value.level, rating: 0 };
		    level_progress_list.push(res[value.level])
		}
		res[value.level].rating += parseInt(value.rating);
		return res;
	}, {});
	for (let i = 0; i < level_progress_list.length; i++) {
		level_progress[level_progress_list[i].diff] = level_progress_list[i].rating;
	}

	for (let i = 0; i < expert_titles.length; i++) {
		switch(expert_titles[i].tier) {
			case 'platinum':
			    var title_style = 'style="font-weight: bolder; color: cyan;"';
			    break;
			case 'gold':
			    title_style = 'style="font-weight: bolder; color: gold;"';
			    break;
			case 'silver':
			title_style = 'style="font-weight: bolder; color: silver;"';
			break;
		    case 'bronze':
			title_style = 'style="font-weight: bolder; color: orangered;"';
			break;
		    default:
			title_style = '';
		}
		switch(expert_titles[i].type) {
			case 'rating':
				var current_level = expert_titles[i].level;
				var current_rating = level_progress[current_level] ? level_progress[current_level] : 0;
				var max_rating = parseInt(expert_titles[i].rating);
				var progress = Math.round((current_rating / max_rating) * 100);
				if(progress >= 100) {
					var bar_bg = 'bg-success';
				} else {
					bar_bg = 'bg-danger';
				}
				$('#progress_table_body').append('<tr>' +
					'<td ' + title_style + '>' + expert_titles[i].name + '</td>' +
					'<td>' + expert_titles[i].description + '</td>' +
					'<td><div class="progress" style="position: relative;">' +
						'<div class="progress-bar ' + bar_bg + ' progress-bar-striped progress-bar-animated" role="progressbar"' +
							'aria-valuenow="' + current_rating + '" aria-valuemin="0" aria-valuemax="' + max_rating + '" style="width: ' + progress + '%"></div>' +
						'<div style="position: absolute; text-align: center; line-height: 20px; overflow: hidden; color: black; right: 0; left: 0; top: 0;">' + current_rating.toLocaleString() + '/' + max_rating.toLocaleString() + '</div>' +
					'</div></td></tr>');
			    break;
			case 'skill_collect':
				$('#progress_table_body').append('<tr>' +
					'<td ' + title_style + '>' + expert_titles[i].name + '</td>' +
					'<td>' + expert_titles[i].description + '</td>' +
					'<td><div class="progress" style="position: relative;">' +
						'<div id="progress_bar_' + expert_titles[i].collect_type + '" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar"' +
							'aria-valuenow="0" aria-valuemin="0" aria-valuemax="' + expert_titles[i].count + '" style="width: 0%"></div>' +
						'<div id="progress_bar_' + expert_titles[i].collect_type + '_text" style="position: absolute; text-align: center; line-height: 20px; overflow: hidden; color: black; right: 0; left: 0; top: 0;">0/' + expert_titles[i].count + '</div>' +
					'</div></td><tr><input type="hidden" id="skill_count_' + expert_titles[i].collect_type + '" value="0">');
				break;
			case 'skill':
				var current_song = scores.find(o => o.name === expert_titles[i].song && o.level_text === expert_titles[i].diff);
				if(current_song == undefined) {
					var current_song_score = 0;
					var score_text = 0;
				} else {
					current_song_score = current_song.score;
					score_text = current_song.score_text;
				}
				progress = Math.round(parseInt(current_song_score) / 1000000 * 100);
				if(current_song_score > 990000) {
					bar_bg = 'bg-success';

					var skill_count = parseInt($('#skill_count_skill').val()) + 1;
					$('#skill_count_skill').val(skill_count);
					$('#progress_bar_skill').css('width', skill_count/60*100 + '%');
					$('#progress_bar_skill_text').html(skill_count + '/60');
					if(skill_count == 60) {
						$('#progress_bar_skill').removeClass('bg-danger');
						$('#progress_bar_skill').addClass('bg-success');
					}


					var sub_skill_count = parseInt($('#skill_count_' + expert_titles[i].collect_type).val()) + 1;
					$('#skill_count_' + expert_titles[i].collect_type).val(sub_skill_count);
					$('#progress_bar_' + expert_titles[i].collect_type).css('width', sub_skill_count/10*100 + '%');
					$('#progress_bar_' + expert_titles[i].collect_type + '_text').html(sub_skill_count + '/10');
					if(sub_skill_count == 10) {
						$('#progress_bar_' + expert_titles[i].collect_type).removeClass('bg-danger');
						$('#progress_bar_' + expert_titles[i].collect_type).addClass('bg-success');
					}
				} else {
					bar_bg = 'bg-danger';
				}
				$('#progress_table_body').append('<tr>' +
					'<td ' + title_style + '>' + expert_titles[i].name + '</td>' +
					'<td>' + expert_titles[i].description + '</td>' +
					'<td><div class="progress" style="position: relative;">' +
						'<div class="progress-bar ' + bar_bg + ' progress-bar-striped progress-bar-animated" role="progressbar"' +
							'aria-valuenow="' + current_song_score + '" aria-valuemin="0" aria-valuemax="1000000" style="width: ' + progress + '%"></div>' +
						'<div style="position: absolute; text-align: center; line-height: 20px; overflow: hidden; color: black; right: 0; left: 0; top: 0;">' + score_text + '/1,000,000</div>' +
					'</div></td>');
				break;
			case 'boss':
				current_song = scores.find(o => o.name === expert_titles[i].song && o.level_text === expert_titles[i].diff);
				if(current_song == undefined) {
					current_song_score = 0;
					score_text = 0;
					bar_bg = 'bg-danger';
				} else {
					current_song_score = current_song.score;
					score_text = current_song.score_text;
					bar_bg = 'bg-success';
				}
				progress = Math.round(parseInt(current_song_score) / 1000000 * 100);
				$('#progress_table_body').append('<tr>' +
					'<td ' + title_style + '>' + expert_titles[i].name + '</td>' +
					'<td>' + expert_titles[i].description + '</td>' +
					'<td><div class="progress" style="position: relative;">' +
						'<div class="progress-bar ' + bar_bg + ' progress-bar-striped progress-bar-animated" role="progressbar"' +
							'aria-valuenow="' + current_song_score + '" aria-valuemin="0" aria-valuemax="1000000" style="width: ' + progress + '%"></div>' +
						'<div style="position: absolute; text-align: center; line-height: 20px; overflow: hidden; color: black; right: 0; left: 0; top: 0;">' + score_text + '/1,000,000</div>' +
					'</div></td>');
				break;
			default:
			continue;
		}
	}
}

async function fetchScores(url) {
	var dom = await fetchPage(url);
	const rows = dom.querySelectorAll('.my_best_scoreList .in');
	var songs = [];
	for (var i = 0; i < rows.length; i++) {
		var song = $(dom.querySelectorAll('.my_best_scoreList .in .song_name p')[i]).html();
		var score = $(dom.querySelectorAll('.my_best_scoreList .in .num')[i]).html();
		var score_rate = $(dom.querySelectorAll('.my_best_scoreList .in .etc_con .img:not(.st1) img')[i]).attr('src');
		score_rate = score_rate.split('/grade/')[1].split('.png')[0];

		var score_plate = $(dom.querySelectorAll('.my_best_scoreList .in .etc_con .st1 img')[i]).attr('src');
		score_plate = score_plate.split('/plate/')[1].split('.png')[0];

		var level_type_data = $(dom.querySelectorAll('.my_best_scoreList .in .stepBall_in')[i]).attr('style').split('full/')[1].split('_bg')[0];
		switch(level_type_data) {
			case 's':
			    var level_type = 'single';
			    break;
			case 'd':
			    level_type = 'double';
			    break;
			default:
			level_type = 'coop';
		}

		var level = '';
		var levels = $(dom.querySelectorAll('.my_best_scoreList .in .stepBall_in')[0]).find('.imG');

		switch(level_type_data) {
			case 's':
			case 'd':
				for (var j = 0; j < levels.length; j++) {
					url = $(dom.querySelectorAll('.my_best_scoreList .in .stepBall_in')[i]).find('.imG img').eq(j).attr('src');
					level += url.split('num_')[1].split('.png')[0];
				}
				var rating = calculateRating(level, rating_text[score_rate], 'normal');
				var level_text = level_type_data + level;
				level_text = level_text.toUpperCase();
				break;
			default:
			    url = $(dom.querySelectorAll('.my_best_scoreList .in .stepBall_in')[i]).find('.imG img').eq(1).attr('src');
				level = url.split('num_')[1].split('.png')[0];
				rating = calculateRating(null, rating_text[score_rate], 'coop');
				level_text = 'Cx' + level;
		}

		song = {
		name: song,
		level_text: level_text,
		score_text: score,
		score_rate_text: rating_text[score_rate],
		rating: rating,
		score_plate_text: plate_text[score_plate],
		level_type: level_type,
		level: level,
		score: score.replaceAll(',',''),
		score_rate: score_rate,
		score_plate: score_plate,
	}

	songs.push(song);
	}

	songs.sort(function(a, b){
	    var a1 = a.rating, b1 = b.rating;
	    if(a1 == b1) {
		var a2 = a.score, b2 = b.score;
		    if(a2 == b2) {
			return 0;
		    }
		return a2 > b2 ? -1 : 1;
	    }
	    return a1 > b1 ? -1 : 1;
	});

	return songs;
}

async function fetchPage(url) {
	const response = await fetch(url, {redirect: 'error'});
	const html = await response.text();
	const parser = new DOMParser();
	return parser.parseFromString(html, 'text/html');
}

function calculateRating(level, rate, type) {
	var rate_index = {
		'A':0.9,
		'A+':0.95,
		'AA':1,
		'AA+':1.05,
		'AAA':1.1,
		'AAA+':1.15,
		'S':1.2,
		'S+':1.26,
		'SS':1.32,
		'SS+':1.38,
		'SSS':1.44,
		'SSS+':1.5,
	};

	if(type == 'normal') {
		var level_base = {
			'10':100,
			'11':110,
			'12':130,
			'13':160,
			'14':200,
			'15':250,
			'16':310,
			'17':380,
			'18':460,
			'19':550,
			'20':650,
			'21':760,
			'22':880,
			'23':1010,
			'24':1150,
			'25':1300,
			'26':1460,
			'27':1630,
			'28':1810,
		};
		if(level < 10) return 0;
		var rating = parseInt(level_base[level]) * parseFloat(rate_index[rate]);
	} else if(type == 'coop') {
		level_base = 2000;
		rating = parseInt(level_base) * parseFloat(rate_index[rate]);
	}
	return Math.round(rating.toFixed(2));
}