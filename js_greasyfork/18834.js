console.time('itemDictionary');

window.dictionary = {
    qualities: {
        0: 'Normal',
        1: 'Genuine',
        3: 'Vintage',
        5: 'Unusual',
        6: 'Unique',
        11: 'Strange',
        13: 'Haunted',
        14: 'Collector\'s',
        15: 'Decorated Weapon',
    },
    wears: [
        null,
        'Factory New',
        'Minimal Wear',
        'Field tested',
        'Well-Worn',
        'Battle Scarred',
    ],
    grades: [
        null,
        'Elite',
        'Assassin',
        'Commando',
        'Mercenary',
        'Freelance',
        'Civilian',
    ],
    unusualEffects: [
        null,
        'Particle 1',
        'Flying Bits',
        'Nemesis Burst',
        'Community Sparkle',
        'Holy Glow',
        'Green Confetti',
        'Purple Confetti',
        'Haunted Ghosts',
        'Green Energy',
        'Purple Energy',
        'Circling TF Logo',
        'Massed Flies',
        'Burning Flames',
        'Scorching Flames',
        'Searing Plasma',
        'Vivid Plasma',
        'Sunbeams',
        'Circling Peace Sign',
        'Circling Heart',
        'Map Stamps',
        'Genteel Smoke',
        'Stormy Storm',
        'Blizzardy Storm',
        'Nuts n\' Bolts',
        'Orbiting Planets',
        'Orbiting Fire',
        'Bubbling',
        'Smoking',
        'Steaming',
        'Flaming Lantern',
        'Cloudy Moon',
        'Cauldron Bubbles',
        'Eerie Orbiting Fire',
        'Knifestorm',
        'Misty Skull',
        'Harvest Moon',
        'It\'s A Secret To Everybody',
        'Stormy 13th Hour',
        'Attrib_Particle55',
        'Kill-a-Watt',
        'Terror-Watt',
        'Cloud 9',
        'Aces High',
        'Dead Presidents',
        'Miami Nights',
        'Disco Beat Down',
        'Phosphorous',
        'Sulphurous',
        'Memory Leak',
        'Overclocked',
        'Electrostatic',
        'Power Surge',
        'Anti-Freeze',
        'Time Warp',
        'Green Black Hole',
        'Roboactive',
        'Arcana',
        'Spellbound',
        'Chiroptera Venenata',
        'Poisoned Shadows',
        'Something Burning This Way Comes',
        'Hellfire',
        'Darkblaze',
        'Demonflame',
        'Bonzo The All-Gnawing',
        'Amaranthine',
        'Stare From Beyond',
        'The Ooze',
        'Ghastly Ghosts Jr',
        'Haunted Phantasm Jr',
        'Frostbite',
        'Molten Mallard',
        'Morning Glory',
        'Death at Dusk',
        'Abduction',
        'Atomic',
        'Subatomic',
        'Electric Hat Protector',
        'Magnetic Hat Protector',
        'Voltaic Hat Protector',
        'Galactic Codex',
        'Ancient Codex',
        'Nebula',
        'Death by Disco',
        'It\'s a mystery to everyone',
        'It\'s a puzzle to me ',
        'Ether Trail',
        'Nether Trail',
        'Ancient Eldritch',
        'Eldritch Flame',
        'Hot',
        'Isotope',
        'Cool',
        'Energy Orb',
        'Attrib_Particle2001',
        'Attrib_Particle2002',
        'Attrib_Particle2003',
        'Attrib_Particle2004',
        'Attrib_Particle2005',
        'Attrib_Particle2006',
        'Attrib_Particle2007',
        'Attrib_Particle2008',
        'Showstopper',
        'Showstopper',
        'Holy Grail',
        '\'72',
        'Fountain of Delight',
        'Screaming Tiger',
        'Skill Gotten Gains',
        'Midnight Whirlwind',
        'Silver Cyclone',
        'Mega Strike',
        'Haunted Phantasm',
        'Ghastly Ghosts',
        'Attrib_Particle22001',
        'Attrib_Particle22002',
        'Attrib_Particle22003',
        'Attrib_Particle22004',
        'Attrib_Particle22005',
        'Attrib_Particle22006',
        'Attrib_Particle22007',
        'Attrib_Particle22008',
    ],
    unusualEffectImages: [
        null,
        null,
        null,
        null,
        '4_94x94.png',
        '5_94x94.png',
        '6_94x94.png',
        '7_94x94.png',
        '8_94x94.png',
        '9_94x94.png',
        '10_94x94.png',
        '11_94x94.png',
        '12_94x94.png',
        '13_94x94.png',
        '14_94x94.png',
        '15_94x94.png',
        '16_94x94.png',
        '17_94x94.png',
        '18_94x94.png',
        '19_94x94.png',
        '20_94x94.png',
        null,
        '29_94x94.png',
        '30_94x94.png',
        '31_94x94.png',
        '32_94x94.png',
        '33_94x94.png',
        '34_94x94.png',
        '35_94x94.png',
        '36_94x94.png',
        '37_94x94.png',
        '38_94x94.png',
        '39_94x94.png',
        '40_94x94.png',
        '43_94x94.png',
        '44_94x94.png',
        '45_94x94.png',
        '46_94x94.png',
        '47_94x94.png',
        null,
        '56_94x94.png',
        '57_94x94.png',
        '58_94x94.png',
        '59_94x94.png',
        '60_94x94.png',
        '61_94x94.png',
        '62_94x94.png',
        '63_94x94.png',
        '64_94x94.png',
        '65_94x94.png',
        '66_94x94.png',
        '67_94x94.png',
        '68_94x94.png',
        '69_94x94.png',
        '70_94x94.png',
        '71_94x94.png',
        '72_94x94.png',
        '73_94x94.png',
        '74_94x94.png',
        '75_94x94.png',
        '76_94x94.png',
        '77_94x94.png',
        '78_94x94.png',
        '79_94x94.png',
        '80_94x94.png',
        '81_94x94.png',
        '82_94x94.png',
        '83_94x94.png',
        '84_94x94.png',
        '85_94x94.png',
        '86_94x94.png',
        '87_94x94.png',
        '88_94x94.png',
        '89_94x94.png',
        '90_94x94.png',
        '91_94x94.png',
        '92_94x94.png',
        '93_94x94.png',
        '94_94x94.png',
        '95_94x94.png',
        '96_94x94.png',
        '97_94x94.png',
        '98_94x94.png',
        '99_94x94.png',
        '100_94x94.png',
        '101_94x94.png',
        '102_94x94.png',
        '103_94x94.png',
        '104_94x94.png',
        '105_94x94.png',
        '106_94x94.png',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        '3001_94x94.png',
        '3001_94x94.png',
        '3003_94x94.png',
        '3004_94x94.png',
        '3005_94x94.png',
        '3006_94x94.png',
        '3007_94x94.png',
        '3008_94x94.png',
        '3009_94x94.png',
        '3010_94x94.png',
        '3011_94x94.png',
        '3012_94x94.png',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ],
    killstreakSheens: [
        null,
        'Team Shine',
        'Deadly Daffodil',
        'Manndarin',
        'Mean Green',
        'Agonizing Emerald',
        'Villainous Violet',
        'Hot Rod',
    ],
    killstreakEffects: [
        null,
        'Fire Horns',
        'Cerebral Discharge',
        'Tornado',
        'Flames',
        'Singularity',
        'Incinerator',
        'Hypno-Beam',
    ],
    halloweenSpells: [
        null,
        'Exorcism',
        'Halloween Fire',
        'Pumpkin Bombs',
        'Voices From Below',
        'Chromatic Corruption',
        'Team Spirit Footprints',
        'Gangreen Footprints',
        'Corpse Gray Footprints',
        'Violent Violet Footprints',
        'Rotten Orange Footprints',
        'Bruised Purple Footprints',
        'Headless Horseshoes',
        'Die Job',
        'Spectral Spectrum',
        'Putrescent Pigmentation',
        'Sinister Staining',
        'Chromatic Corruption',
    ],
    paintColours: [
        null,
        'A Color Similar to Slate',
        'Indubitably Green',
        'A Deep Commitment to Purple',
        'Mann Co. Orange',
        'A Distinctive Lack of Hue',
        'Muskelmannbraun',
        'A Mann\'s Mint',
        'Noble Hatter\'s Violet',
        'After Eight',
        'Peculiarly Drab Tincture',
        'Aged Moustache Grey',
        'Pink as Hell',
        'An Extraordinary Abundance of Tinge',
        'Radigan Conagher Brown',
        'Australium Gold',
        'The Bitter Taste of Defeat and Lime',
        'Color No. 216-190-216  ',
        'The Color of a Gentlemann\'s Business Pants',
        'Dark Salmon Injustice',
        'Ye Olde Rustic Colour',
        'Drably Olive',
        'Zepheniah\'s Greed',
        'An Air of Debonair',
        'Team Spirit',
        'Balaclavas Are Forever',
        'The Value of Teamwork',
        'Cream Spirit',
        'Waterlogged Lab Coat',
        'Operator\'s Overalls',
    ],
    strangeParts: [
        null,
        'Airborne Enemy Kills',
        'Heavies Killed',
        'Demomen Killed',
        'Revenges',
        'Dominations',
        'Soldiers Killed',
        'Full Moon Kills',
        'Cloaked Spies Killed',
        'Scouts Killed',
        'Engineers Killed',
        'Robots Destroyed',
        'Kills While Low Health',
        'Halloween Kills',
        'Robots Destroyed During Halloween',
        'Underwater Kills',
        'Snipers Killed',
        'Kills While Übercharged',
        'Pyros Killed',
        'Defenders Killed',
        'Medics Killed',
        'Tanks Destroyed',
        'Medics Killed That Have Full ÜberCharge',
        'Giant Robots Destroyed',
        'Kills During Victory Time',
        'Robot Spies Destroyed',
        'Unusual-Wearing Player Kills',
        'Spies Killed',
        'Burning Enemy Kills',
        'Killstreaks Ended',
        'Damage Dealt',
        'Point-Blank Kills',
        'Full Health Kills',
        'Robot Scouts Destroyed',
        'Taunting Player Kills',
        'Not Crit nor MiniCrit Kills',
        'Players Hit',
        'Gib Kills',
        'Buildings Destroyed',
        'Headshot Kills',
        'Projectiles Reflected',
        'Allies Extinguished',
        'Posthumous Kills',
        'Critical Kills',
        'Kills While Explosive Jumping',
        'Sappers Destroyed',
        'Long-Distance Kills',
        'Taunt Kills',
        'Freezecam Taunt Appearances',
        'Fires Survived',
        'Kills',
        'Kill Assists',
        'Allied Healing Done',
        'Health Dispensed to Allies',
        'Allies Teleported',
    ],
};

window.schema = ({
	0: {
		defindex: 0,
		image: "c_bat.d037d6a40ec30ab4aa009387d476dca889b6f7dc.png",
		name: "Bat"
	},
	1: {
		defindex: 1,
		image: "w_bottle.859ddb315a2748f04bcc211aa7a04f2c926e6169.png",
		name: "Bottle"
	},
	2: {
		defindex: 2,
		image: "c_fireaxe_pyro.f1743d06c5ad3ed4cccbfb1a5ff844c6ef84ac3f.png",
		name: "Fire Axe"
	},
	3: {
		defindex: 3,
		image: "w_machete.9cb57348f07f43e1c0b08398aa527eeb7a5d3f60.png",
		name: "Kukri"
	},
	4: {
		defindex: 4,
		image: "w_knife.f6487ad29a3ca5c0911e0e64cfb980310f085404.png",
		name: "Knife"
	},
	5: {
		defindex: 5,
		image: "v_fist_heavy.df01c751923cd2533976afb6fdd6084c91766bdb.png",
		name: "Fists"
	},
	6: {
		defindex: 6,
		image: "w_shovel.7e0a9c306cf9c736ae96b8a359ffe781218e2d3d.png",
		name: "Shovel"
	},
	7: {
		defindex: 7,
		image: "w_wrench.1e62c104993c727771e374e42f4fc59d9fe31281.png",
		name: "Wrench"
	},
	8: {
		defindex: 8,
		image: "c_bonesaw.3ea746d98dc8e42f2a0b85c8381cebd775eb97be.png",
		name: "Bonesaw"
	},
	9: {
		defindex: 9,
		image: "w_shotgun.1d9c8ea9d8b2b14b331ae22427c5e624f6d5d60c.png",
		name: "Shotgun"
	},
	10: {
		defindex: 10,
		image: "w_shotgun.1d9c8ea9d8b2b14b331ae22427c5e624f6d5d60c.png",
		name: "Shotgun"
	},
	11: {
		defindex: 11,
		image: "w_shotgun.1d9c8ea9d8b2b14b331ae22427c5e624f6d5d60c.png",
		name: "Shotgun"
	},
	12: {
		defindex: 12,
		image: "w_shotgun.1d9c8ea9d8b2b14b331ae22427c5e624f6d5d60c.png",
		name: "Shotgun"
	},
	13: {
		defindex: 13,
		image: "c_scattergun.ce3503c253ae091b5998ab90b494e5e79c7cfd0f.png",
		name: "Scattergun"
	},
	14: {
		defindex: 14,
		image: "w_sniperrifle.21d9333f9e049df30271e65f773d63122b3dfc1d.png",
		name: "Sniper Rifle"
	},
	15: {
		defindex: 15,
		image: "w_minigun.c8dd004e4691ebde7af11d564bf2717468e485ff.png",
		name: "Minigun"
	},
	16: {
		defindex: 16,
		image: "w_smg.279702a5506727459f733580105c96ce684756b1.png",
		name: "SMG"
	},
	17: {
		defindex: 17,
		image: "w_syringegun.a492bd72c4521e4d6cb782c7e2c6255238bba83c.png",
		name: "Syringe Gun"
	},
	18: {
		defindex: 18,
		image: "w_rocketlauncher.41eed5b3c42e52270d11bab5a740b293d0795484.png",
		name: "Rocket Launcher"
	},
	19: {
		defindex: 19,
		image: "w_grenadelauncher.9ffbaccde7325b1222b2b43031f0cc5e41a25eb6.png",
		name: "Grenade Launcher"
	},
	20: {
		defindex: 20,
		image: "w_stickybomb_launcher.1d3fbc10d5464af8f36a790ff8a22c4f9f751d2f.png",
		name: "Stickybomb Launcher"
	},
	21: {
		defindex: 21,
		image: "c_flamethrower.484cd74d322778cb2db0a20d4ce4309fab80ed26.png",
		name: "Flame Thrower"
	},
	22: {
		defindex: 22,
		image: "c_pistol.ce84784f306986c45185237fcd30c23767af0836.png",
		name: "Pistol"
	},
	23: {
		defindex: 23,
		image: "c_pistol.ce84784f306986c45185237fcd30c23767af0836.png",
		name: "Pistol"
	},
	24: {
		defindex: 24,
		image: "w_revolver.acf5df029d30364e66b3ab280349c707347c51b0.png",
		name: "Revolver"
	},
	25: {
		defindex: 25,
		image: "w_builder.a98ad31120795e8cceadd3040dd94b0ea08b5369.png",
		name: "Construction PDA"
	},
	26: {
		defindex: 26,
		image: "w_pda_engineer.ceab5848585bdbb80f24bbd7000705cf626ffa4d.png",
		name: "Destruction PDA"
	},
	27: {
		defindex: 27,
		image: "w_cigarette_case.b7c2a549208c89bc082db86e6a685c597574037e.png",
		name: "Disguise Kit"
	},
	28: {
		defindex: 28,
		image: "w_pda_engineer.ceab5848585bdbb80f24bbd7000705cf626ffa4d.png",
		name: "PDA"
	},
	29: {
		defindex: 29,
		image: "c_medigun.f7083ca62943a045a141554a320f289f508a4f2e.png",
		name: "Medi Gun"
	},
	30: {
		defindex: 30,
		image: "c_spy_watch.34585b4b22b929cba94960ada08beb157e4469dd.png",
		name: "Invis Watch"
	},
	35: {
		defindex: 35,
		image: "c_overhealer.b5ed539b534216652b45694e19c78d2aaebcfe5e.png",
		name: "Kritzkrieg",
		the: true
	},
	36: {
		defindex: 36,
		image: "c_leechgun.198c5a7943a16f08b5227f2e84d165c153ed0223.png",
		name: "Blutsauger",
		the: true
	},
	37: {
		defindex: 37,
		image: "c_ubersaw.81b280b88c0bc3d54ba7f4de26328dc8197f2af4.png",
		name: "Ubersaw",
		the: true
	},
	38: {
		defindex: 38,
		image: "c_axtinguisher_pyro.7b55ff83853a1613134deb9889708b14a0c1dd52.png",
		name: "Axtinguisher",
		the: true,
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwYJSRLsvy1Km8DjH82cEfIPpN066ZRq1Td5lgQ1MbGzNmc3d1OVVKVbBaJu8A6-WSVi7sNiUdXvrr0FKwvq4oDCZbkoN8YMQZdHEuWXyA"
	},
	39: {
		defindex: 39,
		image: "c_flaregun_pyro.6062669f77c2b9a5d3885172e652b8aa82e6e7d9.png",
		name: "Flare Gun",
		the: true
	},
	40: {
		defindex: 40,
		image: "c_backburner.de59b3c05622bc579189c18f846222552b538894.png",
		name: "Backburner",
		the: true
	},
	41: {
		defindex: 41,
		image: "c_w_ludmila.0a81c5a51bbddc0def4f0a0ffa2ddba6a24fd231.png",
		name: "Natascha"
	},
	42: {
		defindex: 42,
		image: "c_sandwich.2cc7be554d9b5bea7deea358a900809708eb3c69.png",
		name: "Sandvich",
		the: true
	},
	43: {
		defindex: 43,
		image: "c_boxing_gloves.760a4d8dca25f0d63f2c9f05effbfb28560ce5a2.png",
		name: "Killing Gloves of Boxing",
		the: true
	},
	44: {
		defindex: 44,
		image: "c_wooden_bat.00bad56acc50ba4c07368af5b5e3f8a92f2cd801.png",
		name: "Sandman",
		the: true
	},
	45: {
		defindex: 45,
		image: "c_double_barrel.0bc198a9abd3c3cf527e07ce560b2f0d8e1c16b9.png",
		name: "Force-A-Nature",
		the: true,
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwMeSBnuvQdBidr0CP6zD-8Mn-U55IJS3Hg5wAB-YuHhaWNjcwXAVfVaDac8rVi6WHI36sNlAtG0pr9XcAu6vYHFLfByZ2RZX1cn"
	},
	46: {
		defindex: 46,
		image: "c_energy_drink.31859ba4d0f0c1a83b416042b61251af08f4f6d7.png",
		name: "Bonk! Atomic Punch"
	},
	47: {
		defindex: 47,
		image: "demo_afro.edb64f526a34c9dbd3037f30d7ec9ab4d79fa998.png",
		name: "Demoman's Fro"
	},
	48: {
		defindex: 48,
		image: "mining_hat.d5062a027722626dfb875594abe7ad5b0ccd48d9.png",
		name: "Mining Light"
	},
	49: {
		defindex: 49,
		image: "football_helmet.f36900f19c8e73abfa86156e86f2276eb09c7c13.png",
		name: "Football Helmet"
	},
	50: {
		defindex: 50,
		image: "medic_helmet.4b6ea6ee4cd45561621a428ea9d86801455ff8dd.png",
		name: "Prussian Pickelhaube"
	},
	51: {
		defindex: 51,
		image: "pyro_hat.dde5d551fcd9ab7bc537ac43486aa62239ffc2ac.png",
		name: "Pyro's Beanie"
	},
	52: {
		defindex: 52,
		image: "batter_helmet.e0ab07cb9f561863c3986bcbbb6765893e5d9ebc.png",
		name: "Batter's Helmet"
	},
	53: {
		defindex: 53,
		image: "tooth_hat.c2014cb6315e2ce880058cdcd0a7569056b11260.png",
		name: "Trophy Belt"
	},
	54: {
		defindex: 54,
		image: "soldier_hat.61b68df2672217c4d2a2c98e3ed5e386a389d5cf.png",
		name: "Soldier's Stash"
	},
	55: {
		defindex: 55,
		image: "spy_hat.ee8875d6e841c142e2fe7b2a74bd65b918755544.png",
		name: "Fancy Fedora"
	},
	56: {
		defindex: 56,
		image: "c_bow.5fc4dcfec7ae596479fb864f3bbf43ece0506246.png",
		name: "Huntsman",
		the: true
	},
	57: {
		defindex: 57,
		image: "knife_shield.2b7f7e6df85f3763bde5813a054892cfbf717880.png",
		name: "Razorback",
		the: true
	},
	58: {
		defindex: 58,
		image: "urinejar.976d39a79847351a8b505c59ccdf605c7204408e.png",
		name: "Jarate"
	},
	59: {
		defindex: 59,
		image: "c_pocket_watch.123eae773883b4358258a969a9f3006e55fcf15b.png",
		name: "Dead Ringer",
		the: true
	},
	60: {
		defindex: 60,
		image: "c_leather_watch.b78744c181a961297a3193ac49a66e85d423d795.png",
		name: "Cloak and Dagger",
		the: true
	},
	61: {
		defindex: 61,
		image: "c_ambassador_opt.5a05f0ae3486dc204d2c2e037cda748d58e6bc2b.png",
		name: "Ambassador",
		the: true,
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwYcXxrxqzlHh9rZCv2ADN8Mmsgy4N4F2zNvyVAobOXnZ2BldgWSBfhbWaI5o1vtUCJr7pE3BITnpOtVKlnnqsKYZJecC625"
	},
	94: {
		defindex: 94,
		image: "engineer_cowboy_hat.d55c03bdd050c5a8bf82ea95b197126b63f4f968.png",
		name: "Texas Ten Gallon"
	},
	95: {
		defindex: 95,
		image: "engineer_train_hat.0d8c0d695190ec3fe609013fe9a752518f0e6b0d.png",
		name: "Engineer's Cap"
	},
	96: {
		defindex: 96,
		image: "heavy_ushanka.2102f3aba3d285eb51da18b70866ce90426f6a05.png",
		name: "Officer's Ushanka"
	},
	97: {
		defindex: 97,
		image: "heavy_stocking_cap.ca8644efe4a089fcdbca282b6c19ca6332a05bc2.png",
		name: "Tough Guy's Toque"
	},
	98: {
		defindex: 98,
		image: "soldier_pot.379b4ec1cf8978d45040c284c3379ffbc3ce134c.png",
		name: "Stainless Pot"
	},
	99: {
		defindex: 99,
		image: "soldier_viking.c94d197bff92342a9e8ba8cb39a14759fb3e784f.png",
		name: "Tyrant's Helm"
	},
	100: {
		defindex: 100,
		image: "demo_scott.5d89506f9567ce9c8a5bf8f8767e1f8265f6a400.png",
		name: "Glengarry Bonnet"
	},
	101: {
		defindex: 101,
		image: "medic_tyrolean.a40b4e63573eca0c4073a96aec74c0be61e8ab48.png",
		name: "Vintage Tyrolean"
	},
	102: {
		defindex: 102,
		image: "pyro_chicken.9f8e125f893d8756186355f69ead017f80a7d416.png",
		name: "Respectless Rubber Glove"
	},
	103: {
		defindex: 103,
		image: "spy_camera_beard.3ae4414cef7affeb3faf9f33d9e0fa5759a1d8a0.png",
		name: "Camera Beard"
	},
	104: {
		defindex: 104,
		image: "medic_mirror.39505276760ace54085b86ca5c0d50949eb27648.png",
		name: "Otolaryngologist's Mirror"
	},
	105: {
		defindex: 105,
		image: "fireman_helmet.edf8b22d362d324f11fb80476aff4a2855ee130f.png",
		name: "Brigade Helm"
	},
	106: {
		defindex: 106,
		image: "bonk_helmet.c1c02a5209a9ad6610ec6ed0f97370f5f5fbada7.png",
		name: "Bonk Helm"
	},
	107: {
		defindex: 107,
		image: "newsboy_cap.4080eedcc5c12bfd9365132fc93789f2e05f5659.png",
		name: "Ye Olde Baker Boy"
	},
	108: {
		defindex: 108,
		image: "derby_hat.e3af00e62d1819172b82280be97932436ceb675a.png",
		name: "Backbiter's Billycock"
	},
	109: {
		defindex: 109,
		image: "straw_hat.ec35b5fb85e33e8d4f43a44ee98d11f83534f9de.png",
		name: "Professional's Panama"
	},
	110: {
		defindex: 110,
		image: "jarate_headband.2042c40d93a4445e9b4d525078f2ecaebe7ded83.png",
		name: "Master's Yellow Belt"
	},
	111: {
		defindex: 111,
		image: "scout_nohat.540bb9593d3aefc3af05bcc33d0a05253b3f6941.png",
		name: "Baseball Bill's Sports Shine"
	},
	116: {
		defindex: 116,
		image: "all_domination_b_demo.fb14eae4eb62521ffef188ee8d7fa562a611de74.png",
		name: "Ghastlierest Gibus"
	},
	117: {
		defindex: 117,
		image: "sniper_nohat.2e5aa4d19808d1718d8dceac3ab36375a5cd7dfe.png",
		name: "Ritzy Rick's Hair Fixative"
	},
	118: {
		defindex: 118,
		image: "engineer_nohat.067a505b8c203e39751929fe53f1f787e61be474.png",
		name: "Texas Slim's Dome Shine"
	},
	120: {
		defindex: 120,
		image: "top_hat.c376396932e657a1fd4c6d334ae177da5e3a8448.png",
		name: "Scotsman's Stove Pipe"
	},
	121: {
		defindex: 121,
		image: "medal.2191e008d6ab1f3fa40101b2c995e20b2f2cecfb.png",
		name: "Gentle Manne's Service Medal"
	},
	126: {
		defindex: 126,
		image: "demo_bill.c3d26e27431f1a15511abf01b5819bc51975b94d.png",
		name: "Bill's Hat"
	},
	127: {
		defindex: 127,
		image: "c_directhit.930799b71a23be7e9a5c528980c016e8d08d9ee3.png",
		name: "Direct Hit",
		the: true
	},
	128: {
		defindex: 128,
		image: "c_pickaxe_s2.3f6bf8f2419c91d8af247699feb3c28677ee9a1a.png",
		name: "Equalizer",
		the: true
	},
	129: {
		defindex: 129,
		image: "c_buffpack.9ac20db0a53692d14679ef563e4def830f3c5d0a.png",
		name: "Buff Banner",
		the: true
	},
	130: {
		defindex: 130,
		image: "w_stickybomb_defender.f3df27bc56669f4399289349c3605145bbd587d3.png",
		name: "Scottish Resistance",
		the: true
	},
	131: {
		defindex: 131,
		image: "c_targe.f8f59dd38b93f0c08ef9b991ecd71104a11be629.png",
		name: "Chargin' Targe",
		the: true
	},
	132: {
		defindex: 132,
		image: "c_claymore.732371620c39ac918b7357fced835adc7f268fa3.png",
		name: "Eyelander",
		the: true,
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwQdXALvtypGt8_pAfazBOESnN974JYE3zQ_kAAiZrK2ZWE-I1TEVvYGCKZtogroWSNrvsUxAdXl9bhRKxKv6tVZ-4lhBA"
	},
	133: {
		defindex: 133,
		image: "c_rocketboots_soldier.ef451e6571177e7c2cf522030e0e31a34a937a0b.png",
		name: "Gunboats",
		the: true
	},
	135: {
		defindex: 135,
		image: "hat_first_nr.e7cb3f5de1158e924aede8c3eeda31e920315f9a.png",
		name: "Towering Pillar of Hats"
	},
	137: {
		defindex: 137,
		image: "hat_second_nr.5935e32c0f19fa0bc55ccb0bf2f2180e5808ac6f.png",
		name: "Noble Amassment of Hats"
	},
	139: {
		defindex: 139,
		image: "hat_third_nr.f43aa7b1b88b440242f906a759e0580ff088662e.png",
		name: "Modest Pile of Hat"
	},
	140: {
		defindex: 140,
		image: "c_wrangler.f4529a9bc127dbee747ae96cd12d3275f014efac.png",
		name: "Wrangler",
		the: true
	},
	141: {
		defindex: 141,
		image: "c_frontierjustice.f7fd714580b480a2c5e94f3b9efb4fc13f09e648.png",
		name: "Frontier Justice",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwEDUhX2sT1Rgt31GfuPDd8HlNYx2pxUyzFu31goZ7K3aWM_c1aWV_BaC6w78QnpWHFrusI7BY-19OMDKw3ntIXCO-EycIYbyFCx6-w"
	},
	142: {
		defindex: 142,
		image: "gunslinger.f927fc7c1c8250289021cd75fdab9d115ee80384.png",
		name: "Gunslinger",
		the: true
	},
	143: {
		defindex: 143,
		image: "earbuds.f6dc85683202f2530ae8728880f4a47d4b013ea8.png",
		name: "Earbuds"
	},
	144: {
		defindex: 144,
		image: "medic_mask.4f276abd0b28adf1a93376fee1d2bba5d226b847.png",
		name: "Physician's Procedure Mask"
	},
	145: {
		defindex: 145,
		image: "hounddog.821ab0c2d29bfac666547514bd072fe75ad56235.png",
		name: "Hound Dog",
		the: true
	},
	146: {
		defindex: 146,
		image: "hallmark.dc148bfa993d6e29c00be96c1ac1482370e7ff8f.png",
		name: "Hustler's Hallmark"
	},
	147: {
		defindex: 147,
		image: "noblehair.3fc55d260211dddcc066604b27b4afe42716e162.png",
		name: "Magistrate's Mullet"
	},
	148: {
		defindex: 148,
		image: "weldingmask.0d7ba7b790259d650cc98677f4518502accac80e.png",
		name: "Hotrod"
	},
	150: {
		defindex: 150,
		image: "beanie.3b13f34b8d78412782eef5aa66daa0c9ef607778.png",
		name: "Troublemaker's Tossle Cap"
	},
	151: {
		defindex: 151,
		image: "pyro_brainsucker.ca3f5ab63ae3fb9d926bb5b7e2af9107465a52e1.png",
		name: "Triboniophorus Tyrannus"
	},
	152: {
		defindex: 152,
		image: "soldier_samurai.5be25e13362284a07a5eedf28c31ae877d84fd4e.png",
		name: "Killer's Kabuto"
	},
	153: {
		defindex: 153,
		image: "c_sledgehammer.ef72f157b027990d43a37953881013313d420d62.png",
		name: "Homewrecker",
		the: true
	},
	154: {
		defindex: 154,
		image: "c_paintrain.80d50edcb2b21b34fffeee7c00d0531efcd8d9c9.png",
		name: "Pain Train",
		the: true
	},
	155: {
		defindex: 155,
		image: "c_spikewrench.f92de738930fb2a1f50250969df75b765c71d7c7.png",
		name: "Southern Hospitality",
		the: true
	},
	158: {
		defindex: 158,
		image: "pith_helmet.f6728bf3b167531ef50240c320369d02876ecc2b.png",
		name: "Shooter's Sola Topi"
	},
	159: {
		defindex: 159,
		image: "c_chocolate.bba220aeb0eaa2baa446b4d3d72e52195cd9fe95.png",
		name: "Dalokohs Bar",
		the: true
	},
	160: {
		defindex: 160,
		image: "c_ttg_max_gun.ec679aa6f742399c7217019c92ce008136e7e80a.png",
		name: "Lugermorph",
		the: true
	},
	161: {
		defindex: 161,
		image: "c_ttg_sam_gun.db682e9c82cf74c2086afe92e7a642fbb0fc2105.png",
		name: "Big Kill",
		the: true
	},
	162: {
		defindex: 162,
		image: "medic_ttg_max.5c4b7fcf10ab25fbd166831aea1979395549cb75.png",
		name: "Max's Severed Head"
	},
	163: {
		defindex: 163,
		image: "c_critcola.79e12611a783a3a75b06514bf2ede879b8bd6324.png",
		name: "Crit-a-Cola"
	},
	167: {
		defindex: 167,
		image: "taunt_highfive.e6c647334d9a4503665db370f89805653939bf57.png",
		name: "Taunt: The High Five!"
	},
	171: {
		defindex: 171,
		image: "c_wood_machete.064e0657a025d61b171695a187e24b56fae4c12e.png",
		name: "Tribalman's Shiv",
		the: true
	},
	172: {
		defindex: 172,
		image: "c_battleaxe.9a099dd67123235351e28ae350568ef27a1d2715.png",
		name: "Scotsman's Skullcutter",
		the: true
	},
	173: {
		defindex: 173,
		image: "c_uberneedle.f886149b184703a95dddb0ddb0f8b2da481edcba.png",
		name: "Vita-Saw",
		the: true
	},
	174: {
		defindex: 174,
		image: "scout_whoopee.26200a68de8d63a113a3e15c144b043fdebd8c05.png",
		name: "Whoopee Cap"
	},
	175: {
		defindex: 175,
		image: "pyro_monocle.35cb45321b849a1e6a706cd9377cde5a48f997e0.png",
		name: "Whiskered Gentleman"
	},
	177: {
		defindex: 177,
		image: "medic_goggles.d7b715123b9212fbb9d8deb7b467f735e4cf09a2.png",
		name: "Ze Goggles"
	},
	178: {
		defindex: 178,
		image: "engy_earphones.3eff80c749e06108fbc1fa76f2dae9e5191c375e.png",
		name: "Safe'n'Sound"
	},
	179: {
		defindex: 179,
		image: "demo_tricorne.fdf07c72735dd4e6da0a2e149363645821216fe2.png",
		name: "Tippler's Tricorne"
	},
	180: {
		defindex: 180,
		image: "spy_beret.5619c45c5d3352c27479e47265a2d8c524c88558.png",
		name: "Frenchman's Beret"
	},
	181: {
		defindex: 181,
		image: "sniper_fishinghat.bd752d641e9691932b2f9c46ee6a592668fd8f90.png",
		name: "Bloke's Bucket Hat"
	},
	182: {
		defindex: 182,
		image: "pyro_pyrolean.e59655a0bc5944a12f8c9b5120129b363cf9a3d1.png",
		name: "Vintage Merryweather"
	},
	183: {
		defindex: 183,
		image: "soldier_sargehat.07a167776bdff721a3da1e9f9c30619634928c45.png",
		name: "Sergeant's Drill Hat"
	},
	184: {
		defindex: 184,
		image: "medic_gatsby.e09121a74ef8770b48a0d5df68f371c9af36dc36.png",
		name: "Gentleman's Gatsby"
	},
	185: {
		defindex: 185,
		image: "heavy_bandana.2c8da7fb5f73f65ffd2f5aea13bd0776bb798cb4.png",
		name: "Heavy Duty Rag",
		the: true
	},
	189: {
		defindex: 189,
		image: "parasite_hat.19cb919bd4b45ff4613ccc66b3c1fe24b009c5d4.png",
		name: "Alien Swarm Parasite"
	},
	190: {
		defindex: 190,
		image: "c_bat.d037d6a40ec30ab4aa009387d476dca889b6f7dc.png",
		name: "Bat"
	},
	191: {
		defindex: 191,
		image: "w_bottle.859ddb315a2748f04bcc211aa7a04f2c926e6169.png",
		name: "Bottle"
	},
	192: {
		defindex: 192,
		image: "c_fireaxe_pyro.f1743d06c5ad3ed4cccbfb1a5ff844c6ef84ac3f.png",
		name: "Fire Axe"
	},
	193: {
		defindex: 193,
		image: "w_machete.9cb57348f07f43e1c0b08398aa527eeb7a5d3f60.png",
		name: "Kukri"
	},
	194: {
		defindex: 194,
		image: "w_knife.f6487ad29a3ca5c0911e0e64cfb980310f085404.png",
		name: "Knife",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUwwfVB3nhz9MhMzZAfOeD-VOyt82sJRRiGA8yVF5YOa0Y2A-c1GSAPRbDa0-o1C5W3Bi7sYzUIK0p_UWJ1usryWcAg"
	},
	195: {
		defindex: 195,
		image: "v_fist_heavy.df01c751923cd2533976afb6fdd6084c91766bdb.png",
		name: "Fists"
	},
	196: {
		defindex: 196,
		image: "w_shovel.7e0a9c306cf9c736ae96b8a359ffe781218e2d3d.png",
		name: "Shovel"
	},
	197: {
		defindex: 197,
		image: "w_wrench.1e62c104993c727771e374e42f4fc59d9fe31281.png",
		name: "Wrench",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUxADWBXhsAdEh8TiMv6NGucF1YljvMIDj2BukgMvMbqxZ2RmK1HAUfhaD6Nu8ly-CiNn7pNgDIDioupIOVK4JMSNbHA"
	},
	198: {
		defindex: 198,
		image: "c_bonesaw.3ea746d98dc8e42f2a0b85c8381cebd775eb97be.png",
		name: "Bonesaw"
	},
	199: {
		defindex: 199,
		image: "w_shotgun.1d9c8ea9d8b2b14b331ae22427c5e624f6d5d60c.png",
		name: "Shotgun"
	},
	200: {
		defindex: 200,
		image: "c_scattergun.ce3503c253ae091b5998ab90b494e5e79c7cfd0f.png",
		name: "Scattergun",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUxQSXA_2vSpEncbZCv2ADN8Mmsgy4N4EgDdvxVkuY7rtYmI2cVTHA_haC_BjrFC6D3VmvcYyB9Hup79XKlnmqsKYZGyyl_An"
	},
	201: {
		defindex: 201,
		image: "w_sniperrifle.21d9333f9e049df30271e65f773d63122b3dfc1d.png",
		name: "Sniper Rifle",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUxQfVAvnqipKjsTjMvWDBOQ_l9sn4pUbizNqxwB5MLrtMmA2KlSbU_RdCPFioAu1DXQ3uZY0BY7k8b5TeAvr4pyGbefE9AFZuQ"
	},
	202: {
		defindex: 202,
		image: "w_minigun.c8dd004e4691ebde7af11d564bf2717468e485ff.png",
		name: "Minigun",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUwoYUxLlrTZ8j8fqCc2ACfIHnpRlvZNU2GQ8x1EoZbvjNjQ0c1GVVfgHBKI88l7oXHBn7pZnAdWwoe5VZ0yx47LI5C17"
	},
	203: {
		defindex: 203,
		image: "w_smg.279702a5506727459f733580105c96ce684756b1.png",
		name: "SMG",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUxQcWiTltzRHt8TnH_WJRuYGzolitcJTiTI8klkvbOLsYGQ2JFGXBPEPWKZo91G4W3ZmvpQ2Aof457UBjdHmiT8"
	},
	204: {
		defindex: 204,
		image: "w_syringegun.a492bd72c4521e4d6cb782c7e2c6255238bba83c.png",
		name: "Syringe Gun"
	},
	205: {
		defindex: 205,
		image: "w_rocketlauncher.41eed5b3c42e52270d11bab5a740b293d0795484.png",
		name: "Rocket Launcher",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUxUeXhDnrDRCncblBfeeN-cPl94K6ZFH3jMlwAAtZrvnMmY2cwCXA6MKX6Vr8FDoWnNl6pZlBYPvp-4HKwW85dTPZa5sbo-w5TMAKw"
	},
	206: {
		defindex: 206,
		image: "w_grenadelauncher.9ffbaccde7325b1222b2b43031f0cc5e41a25eb6.png",
		name: "Grenade Launcher",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUwADWBXjvD1Pid3oDvqJGt8HlNYx2pxUyzFu31kjNeXmNGEwIV3HV_QJBKJi9V-9XnVnusYyB4bvoOwELwW94dPAYbQycIYb6mjCO94"
	},
	207: {
		defindex: 207,
		image: "w_stickybomb_launcher.1d3fbc10d5464af8f36a790ff8a22c4f9f751d2f.png",
		name: "Stickybomb Launcher",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUxQFVBjpoTpMhcrZAfOZBuMInsgK4p9Z3QlnkBN8Ma2zMTEyKweTWaEKXaxspVDvDHc2659mUdPu87pWLwTvsNPCNLArZYpJAYCODZzGS_cN"
	},
	208: {
		defindex: 208,
		image: "c_flamethrower.484cd74d322778cb2db0a20d4ce4309fab80ed26.png",
		name: "Flame Thrower",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwEdXBbnrDBRh9_jH82LB-wEpNY095dQl2Y4w1YjN7uzZmA3KlDAUaYODKdi8A20Xn9iupFgDdbn9LkFLQ3ttdHYc-576ce-AFA"
	},
	209: {
		defindex: 209,
		image: "c_pistol.ce84784f306986c45185237fcd30c23767af0836.png",
		name: "Pistol"
	},
	210: {
		defindex: 210,
		image: "w_revolver.acf5df029d30364e66b3ab280349c707347c51b0.png",
		name: "Revolver"
	},
	211: {
		defindex: 211,
		image: "c_medigun.f7083ca62943a045a141554a320f289f508a4f2e.png",
		name: "Medi Gun",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEcUwoUWRLlrTZ8j8fqCc2ACfIHnpRm48QFiDA8wAd9Nua3YDM1IlzBU6ZaDvY8p1q4C35k6cIxVoXn9OJUZ0yx4xklBHGQ"
	},
	212: {
		defindex: 212,
		image: "c_spy_watch.34585b4b22b929cba94960ada08beb157e4469dd.png",
		name: "Invis Watch"
	},
	213: {
		defindex: 213,
		image: "attendant.62440cb63ca8afd089f34644dd74f389f551bd68.png",
		name: "Attendant",
		the: true
	},
	214: {
		defindex: 214,
		image: "c_powerjack.35b48cbb0c32bdfeff66c5c1be39ec6f4251ce29.png",
		name: "Powerjack",
		the: true
	},
	215: {
		defindex: 215,
		image: "c_degreaser.0a934206b32be241915edb1919937c4c9dfa2440.png",
		name: "Degreaser",
		the: true
	},
	216: {
		defindex: 216,
		image: "drinking_hat.8cd4be964bd66c7780a7b1f180911b8844dc48b2.png",
		name: "Rimmed Raincatcher"
	},
	219: {
		defindex: 219,
		image: "milkhat.a0e9e44ff3167898c5d26d83ecdcb0a1fdc91cbe.png",
		name: "Milkman",
		the: true
	},
	220: {
		defindex: 220,
		image: "c_shortstop.79e5a99efc8541a3a8e79894eb65c5b51c63f708.png",
		name: "Shortstop",
		the: true
	},
	221: {
		defindex: 221,
		image: "c_holymackerel.6b4527967e1ba165b84207764411d1206edbf6d0.png",
		name: "Holy Mackerel",
		the: true
	},
	222: {
		defindex: 222,
		image: "c_madmilk.0f92cfc6eed1c31bd4128ac5609e67807b984044.png",
		name: "Mad Milk"
	},
	223: {
		defindex: 223,
		image: "fez.ee87ed452e089760f1c9019526d22fcde9ec2450.png",
		name: "Familiar Fez"
	},
	224: {
		defindex: 224,
		image: "c_letranger.2df471c95380ba267699bfef213c0c96b9daa12a.png",
		name: "L'Etranger"
	},
	225: {
		defindex: 225,
		image: "c_eternal_reward.87437a62786d360056de682c1fafed4c9a5c854d.png",
		name: "Your Eternal Reward"
	},
	226: {
		defindex: 226,
		image: "c_batt_buffpack.46f652816d828a7602e230f17881a74c5ce463dc.png",
		name: "Battalion's Backup",
		the: true
	},
	227: {
		defindex: 227,
		image: "grenadier_softcap.774121f23179d3e8fbc93a40ead69f9a27ae1133.png",
		name: "Grenadier's Softcap"
	},
	228: {
		defindex: 228,
		image: "c_blackbox.a79f984a703948956688be5abd17bd1c71583da8.png",
		name: "Black Box",
		the: true,
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUwUdXBjpujdbt8_pAfazBOESnN97tpIE22E_kgArZ7S0ZmFiKgXGBPRaD6Ro9lm1DyZkuJQ6UtSwruMFKBKv6tXZCQ3uVQ"
	},
	229: {
		defindex: 229,
		image: "snaggletooth.d1da7be2a93ecfe83ecf1966359568acdad52032.png",
		name: "Ol' Snaggletooth"
	},
	230: {
		defindex: 230,
		image: "c_dartgun.9db7c5fe2e15c35996bde409bc3c3ff852e0c83c.png",
		name: "Sydney Sleeper",
		the: true
	},
	231: {
		defindex: 231,
		image: "croc_shield.032e9314be3aaf0034531da59890eb00a6f92a7b.png",
		name: "Darwin's Danger Shield"
	},
	232: {
		defindex: 232,
		image: "c_croc_knife.ae304e977e7127b3ea5ddc862614b627604489a9.png",
		name: "Bushwacka",
		the: true
	},
	233: {
		defindex: 233,
		image: "gift_single.224407c5bfff829bb61f22562323b9607e7ac888.png",
		name: "Secret Saxton"
	},
	234: {
		defindex: 234,
		image: "gift_multiple.143035edf27aafbe5950dc91bd35662b69be2f62.png",
		name: "Pile o' Gifts"
	},
	237: {
		defindex: 237,
		image: "c_rocketjumper.ffc4f77c5b1590c4423ff555ba7a11dbd4bb0e49.png",
		name: "Rocket Jumper",
		the: true
	},
	239: {
		defindex: 239,
		image: "c_boxing_gloves_urgency.1bf8411d11eda1618e9f8f25f3ea6711dfb42c03.png",
		name: "Gloves of Running Urgently"
	},
	240: {
		defindex: 240,
		image: "worms_gear.9999ba0d655345188c2e694e37d5cd272056efef.png",
		name: "Lumbricus Lid"
	},
	241: {
		defindex: 241,
		image: "icon_dueling.04be500d28b0eb9113cb38035472df07d9aab216.png",
		name: "Dueling Mini-Game"
	},
	246: {
		defindex: 246,
		image: "pugilist_protector.fc32caa3a6eddf2762133b497443b36f9f66019c.png",
		name: "Pugilist's Protector"
	},
	247: {
		defindex: 247,
		image: "fiesta_sombrero.3a84e2e9c103c115ed97c02f76e0b4f126f08210.png",
		name: "Old Guadalajara"
	},
	248: {
		defindex: 248,
		image: "pyro_beanie.015bccf3650e7278bdafd24520c88a5bd09f29d6.png",
		name: "Napper's Respite"
	},
	249: {
		defindex: 249,
		image: "pilot_protector.11f1fd2e1cc487c711125903d7eb6669fc84ba7f.png",
		name: "Bombing Run"
	},
	250: {
		defindex: 250,
		image: "chief_rocketeer.b9fe011f29ac010811e6f11057c37f141082602b.png",
		name: "Chieftain's Challenge"
	},
	251: {
		defindex: 251,
		image: "soldier_shako.3633cb29db5fdeae3e26a04aeacdd0cfa6bb03ce.png",
		name: "Stout Shako"
	},
	252: {
		defindex: 252,
		image: "dappertopper.e925afc37b04b511c94b3ce83f3c75d933e935cc.png",
		name: "Dr's Dapper Topper"
	},
	253: {
		defindex: 253,
		image: "pyro_plunger.ee90d9d370b5fbd6271d6195b622af58980f2aa3.png",
		name: "Handyman's Handle"
	},
	254: {
		defindex: 254,
		image: "heavy_umbrella.7acee2a070b8843bb9bd30857b6eaf82073c3c7e.png",
		name: "Hard Counter"
	},
	255: {
		defindex: 255,
		image: "stunt_helmet.bf22b346852ff68cad55708286efe0b783323ca5.png",
		name: "Sober Stuntman"
	},
	259: {
		defindex: 259,
		image: "inquisitor.30eb3a7ac4104547abb2bdadb1bf08519d94137a.png",
		name: "Carouser's Capotain"
	},
	260: {
		defindex: 260,
		image: "wikicap.cd511140da7a50a2a9cf9f83bd58a12e4652d5ca.png",
		name: "Wiki Cap"
	},
	263: {
		defindex: 263,
		image: "all_ellis.1b709f7e73b0a4d101703ad9bdc584e791619ef1.png",
		name: "Ellis' Cap"
	},
	264: {
		defindex: 264,
		image: "all_pan.e09e9bd9bcbe5c4951bb039b633bf11c0185da64.png",
		name: "Frying Pan",
		the: true
	},
	265: {
		defindex: 265,
		image: "c_sticky_jumper.380d8d8ffd47c2512a78568c11dcc240e01a2a09.png",
		name: "Sticky Jumper",
		the: true
	},
	266: {
		defindex: 266,
		image: "c_headtaker.0bc713e0dc8ab90199c86c9c58697c1c3ca42af0.png",
		name: "Horseless Headless Horsemann's Headtaker",
		the: true
	},
	267: {
		defindex: 267,
		image: "haunted_metal.cadba5ab06528dda6d0db5bab0f6cc4274fe5dde.png",
		name: "Haunted Metal Scrap"
	},
	268: {
		defindex: 268,
		image: "halloween_bag_scout.6288df8b3f01298bed8c042985bb71788568397a.png",
		name: "Scout Mask"
	},
	269: {
		defindex: 269,
		image: "halloween_bag_sniper.0a82171bd73a54c1fa389ba0c4e71c0d843ca784.png",
		name: "Sniper Mask"
	},
	270: {
		defindex: 270,
		image: "halloween_bag_soldier.443aeb47ccab56e54d032e57ac7689e326b27bf0.png",
		name: "Soldier Mask"
	},
	271: {
		defindex: 271,
		image: "halloween_bag_demo.969d92b94c559ab30a054592fb1e2bc5f44d3b1c.png",
		name: "Demoman Mask"
	},
	272: {
		defindex: 272,
		image: "halloween_bag_medic.08fca109d42aa7aff505aa2b23bb1d4b60cb1a52.png",
		name: "Medic Mask"
	},
	273: {
		defindex: 273,
		image: "halloween_bag_heavy.0b033f099a510785f6e4413285e6d0941c098fcc.png",
		name: "Heavy Mask"
	},
	274: {
		defindex: 274,
		image: "halloween_bag_spy.6de591f787e5da270489b78a1c7de9149aef057e.png",
		name: "Spy Mask"
	},
	275: {
		defindex: 275,
		image: "halloween_bag_engineer.9b81f9b8d3c8375f9587bb3e4796d62df0bf51d0.png",
		name: "Engineer Mask"
	},
	276: {
		defindex: 276,
		image: "halloween_bag_pyro.977dc436c0aadf8154bd840ea34aed102c075090.png",
		name: "Pyro Mask"
	},
	277: {
		defindex: 277,
		image: "halloween_bag_saxton.c18ad7dfcbb0bef2d4da536070d1671b2c09212b.png",
		name: "Saxton Hale Mask"
	},
	278: {
		defindex: 278,
		image: "pumkin_hat.c4cc2f0e935711af71b2829bcfc7ee9a4a1cf948.png",
		name: "Horseless Headless Horsemann's Head"
	},
	280: {
		defindex: 280,
		image: "noisemaker_cat.8bc7fa684215be048d0d909fc99ed2406e73fe3a.png",
		name: "Noise Maker - Black Cat"
	},
	281: {
		defindex: 281,
		image: "noisemaker_gremlin.4820fbeced5ea6fd2593192719cca1ff90e5e4f4.png",
		name: "Noise Maker - Gremlin"
	},
	282: {
		defindex: 282,
		image: "noisemaker_wolf.6ea16c80cb78c7aafbed16b11e8d5d880b185682.png",
		name: "Noise Maker - Werewolf"
	},
	283: {
		defindex: 283,
		image: "noisemaker_witch.b31db478471556fc09539f992ca161d603b1c9d7.png",
		name: "Noise Maker - Witch"
	},
	284: {
		defindex: 284,
		image: "noisemaker_banshee.f90678fc353fa7707196c78a9fb35dd16e0a3bff.png",
		name: "Noise Maker - Banshee"
	},
	286: {
		defindex: 286,
		image: "noisemaker_laugh.ad2da99932fd78832dfcc5c36612043e9d24e9a4.png",
		name: "Noise Maker - Crazy Laugh"
	},
	287: {
		defindex: 287,
		image: "skull.77a16933985d9ab3946b230f8e24dcdcd5ca0dcb.png",
		name: "Spine-Chilling Skull"
	},
	288: {
		defindex: 288,
		image: "noisemaker_stabby.bc76cd2282df054772950b43f230646fcc255b19.png",
		name: "Noise Maker - Stabby"
	},
	289: {
		defindex: 289,
		image: "voodoojuju_hat.c3f8c6ed8359a4cb983a2f1a2da21d9fe686ed62.png",
		name: "Voodoo Juju"
	},
	290: {
		defindex: 290,
		image: "cadavers_cranium.977c181dc09e4bb090b9e7fa0b07b2d062cffc87.png",
		name: "Cadaver's Cranium"
	},
	291: {
		defindex: 291,
		image: "headsplitter.f6a798753ef62e2bff073a5159339c4a9c061449.png",
		name: "Horrific Headsplitter"
	},
	292: {
		defindex: 292,
		image: "ttg_visor.8f15be97277922acec8efd0506ef9f6cc88da5f9.png",
		name: "Dealer's Visor"
	},
	294: {
		defindex: 294,
		image: "c_ttg_max_gun.ec679aa6f742399c7217019c92ce008136e7e80a.png",
		name: "Lugermorph",
		the: true
	},
	295: {
		defindex: 295,
		image: "ttg_glasses.ac2911939760bd4212bfd7a0ece866eac4f3b59e.png",
		name: "Dangeresque, Too?"
	},
	296: {
		defindex: 296,
		image: "ttg_badge.5ba68d265e183525a40312ef9a23847e2d234a48.png",
		name: "License to Maim"
	},
	299: {
		defindex: 299,
		image: "p2_pin.a3c3f5532aec39b5ad9f55b1ff1c1774fa39cd13.png",
		name: "Companion Cube Pin"
	},
	302: {
		defindex: 302,
		image: "replay_hat.718315e19e9aa2aed8cae4e15d11d17ffa31d7b0.png",
		name: "Frontline Field Recorder"
	},
	303: {
		defindex: 303,
		image: "berliners_bucket_helm.2c1288625a8ab4c16e3c804a6649254b1a9325ca.png",
		name: "Berliner's Bucket Helm"
	},
	304: {
		defindex: 304,
		image: "c_amputator.3ece5985436f0e702b1ee0f657fb7e6a93219e9b.png",
		name: "Amputator",
		the: true
	},
	305: {
		defindex: 305,
		image: "c_crusaders_crossbow.ac432a68ed3ce2dbc8bcced8eac27bc4d7e7a6b2.png",
		name: "Crusader's Crossbow"
	},
	306: {
		defindex: 306,
		image: "demo_scotchbonnet.2fa99937841c1a4ede4806b9d039c4d07f42fd14.png",
		name: "Scotch Bonnet"
	},
	307: {
		defindex: 307,
		image: "c_caber.d7b1dcd7b9dbc34c833b63a149e430fe807f3c7d.png",
		name: "Ullapool Caber",
		the: true
	},
	308: {
		defindex: 308,
		image: "c_lochnload.034589c6ed4af675ac5faa7983820c800b600751.png",
		name: "Loch-n-Load",
		the: true
	},
	309: {
		defindex: 309,
		image: "heavy_big_chief.21b3362a88450aaf42d2848170db7b14067a1dae.png",
		name: "Big Chief",
		the: true
	},
	310: {
		defindex: 310,
		image: "c_bear_claw.e16c1603d27b518b87799b2537d0127af944b2e9.png",
		name: "Warrior's Spirit",
		the: true
	},
	311: {
		defindex: 311,
		image: "c_buffalo_steak.736ac3cbf87178a0986bb3f8dd0f27f463485c14.png",
		name: "Buffalo Steak Sandvich",
		the: true
	},
	312: {
		defindex: 312,
		image: "c_gatling_gun.b8925ce97f23026162f9d678ab23c99f2f21f8f1.png",
		name: "Brass Beast",
		the: true
	},
	313: {
		defindex: 313,
		image: "heavy_magnificent_mongolian.c0dd084b02578b21faea755e34a74d807135da1a.png",
		name: "Magnificent Mongolian"
	},
	314: {
		defindex: 314,
		image: "larrikin_robin.defe8558b275b0b95638ede429859d1721b38346.png",
		name: "Larrikin Robin"
	},
	315: {
		defindex: 315,
		image: "blighted_beak.c8e35e37cb01e114071917fdd6d0dcc4c8c5f7dc.png",
		name: "Blighted Beak"
	},
	316: {
		defindex: 316,
		image: "pyro_pyromancers_mask.c37a257c3fea5fbbfb10b36013ef1a84398e4a84.png",
		name: "Pyromancer's Mask"
	},
	317: {
		defindex: 317,
		image: "c_candy_cane.c878751528959d5b168cdd0b5a744fbd7a46590b.png",
		name: "Candy Cane",
		the: true
	},
	318: {
		defindex: 318,
		image: "prancers_pride.620adb3aea3a3722388e152ec51d5fe0aaa6b6b3.png",
		name: "Prancer's Pride"
	},
	319: {
		defindex: 319,
		image: "spy_detective_noir.e244b569dff49cdc892c914f9093f48b43678783.png",
		name: "D\xE9tective Noir"
	},
	321: {
		defindex: 321,
		image: "pyro_madame_dixie.0926c7c97e6a6db8dbdd623f47fbbfde87b96d20.png",
		name: "Madame Dixie"
	},
	322: {
		defindex: 322,
		image: "engineer_buckaroos_hat.0f6090fc8afbfb1dcf0f259e0fe94ebd65955e9f.png",
		name: "Buckaroos Hat"
	},
	323: {
		defindex: 323,
		image: "medic_german_gonzila.898c7f501748456772e92b61bba9c3fd01219175.png",
		name: "German Gonzila"
	},
	324: {
		defindex: 324,
		image: "scout_flipped_trilby.8942c159a2b2ac118719b5687ba34d050a5f9d26.png",
		name: "Flipped Trilby"
	},
	325: {
		defindex: 325,
		image: "c_boston_basher.b7b789a9cf7c1b83839f1863eb289e682f98592c.png",
		name: "Boston Basher",
		the: true
	},
	326: {
		defindex: 326,
		image: "c_back_scratcher.19411b1febcaff1a9f9006dcf7e89b217fb7c206.png",
		name: "Back Scratcher",
		the: true
	},
	327: {
		defindex: 327,
		image: "c_claidheamohmor.03330e4649a882c92501b35b45d184a1aa2ac3e3.png",
		name: "Claidheamh M\xF2r",
		the: true
	},
	329: {
		defindex: 329,
		image: "c_jag.069d8b5eece289aa09147619ac9edd5b34163d5c.png",
		name: "Jag",
		the: true
	},
	330: {
		defindex: 330,
		image: "coupe_disaster.62c61eff29d1f9fd3d0fc9212002b567902a2cfb.png",
		name: "Coupe D'isaster"
	},
	331: {
		defindex: 331,
		image: "c_fists_of_steel.e1a6613020dcdf73dc9b9e3dcba11e8c0f74e424.png",
		name: "Fists of Steel",
		the: true
	},
	332: {
		defindex: 332,
		image: "treasure_hat_01.6b1ce8af17c8b67ad8e4a745b411561e812f5a5a.png",
		name: "Bounty Hat"
	},
	333: {
		defindex: 333,
		image: "treasure_hat_02.3fe721112958b52dc7c07ba821c4387690c12709.png",
		name: "Treasure Hat"
	},
	334: {
		defindex: 334,
		image: "treasure_hat_oct.21426c0dd011eebca2ed050ce63aba51effc390c.png",
		name: "Hat of Undeniable Wealth And Respect"
	},
	335: {
		defindex: 335,
		image: "pyro_tripwire_mask.4aac347cea67b7426c2752392bbb92454292fc38.png",
		name: "Foster's Facade"
	},
	336: {
		defindex: 336,
		image: "pyro_tripwire_tie.087072aeefa4651de2faab9c54cf7bc4d636aacf.png",
		name: "Stockbroker's Scarf"
	},
	337: {
		defindex: 337,
		image: "spy_party_phantom.3db4c988bbfefb45366c3165e1ff345d3f879b69.png",
		name: "Le Party Phantom"
	},
	338: {
		defindex: 338,
		image: "engineer_colored_lights.9ec426c12dd2d668b88dd97540e09a3ff856b6ca.png",
		name: "Industrial Festivizer"
	},
	339: {
		defindex: 339,
		image: "soldier_holiday_antlers.799e58ec6e649e7578d5125a1b47ff4572927f0c.png",
		name: "Exquisite Rack"
	},
	340: {
		defindex: 340,
		image: "soldier_spartan.8ee76990c00504f3262c30768a5b909001fab27e.png",
		name: "Defiant Spartan"
	},
	341: {
		defindex: 341,
		image: "oh_xmas_tree.49a1d47a907126bbca630fdfd72fa921758c62c8.png",
		name: "A Rather Festive Tree"
	},
	342: {
		defindex: 342,
		image: "crown.ee5238530b8221bee9ba00f989264642b7881966.png",
		name: "Prince Tavish's Crown"
	},
	344: {
		defindex: 344,
		image: "sniper_crocleather_slouch.b15d9d562a6fb9f01937d98a006fdc06827e8492.png",
		name: "Crocleather Slouch"
	},
	345: {
		defindex: 345,
		image: "mnc_hat.1bcafa9ea09eeec6ff5b9f89357d51253e48ffc4.png",
		name: "The Athletic Supporter"
	},
	346: {
		defindex: 346,
		image: "mnc_mascot_hat.3cf0fd693c8d7f11fe6ab2c16fd387de37ee5a9f.png",
		name: "The Superfan"
	},
	347: {
		defindex: 347,
		image: "mnc_mascot_outfit.0b41524fda1b2e4b4c515fe8acf73aad50283134.png",
		name: "The Essential Accessories"
	},
	348: {
		defindex: 348,
		image: "c_rift_fire_axe.c5fb53f050e8cb9c950cd907054bdc192836f0f3.png",
		name: "Sharpened Volcano Fragment"
	},
	349: {
		defindex: 349,
		image: "c_rift_fire_mace.8e6e8938c7f47e42366cf16e45444b173962d343.png",
		name: "Sun-on-a-Stick",
		the: true
	},
	351: {
		defindex: 351,
		image: "c_detonator.9a5e941e6f3b6ce1feefc8ee1e96211acc50a83b.png",
		name: "Detonator"
	},
	354: {
		defindex: 354,
		image: "shogun_warpack_backpackscene.5f0ec60557b4646a83aa8a21e491b5c5c7ea6a85.png",
		name: "Concheror",
		the: true
	},
	355: {
		defindex: 355,
		image: "c_shogun_warfan.a9805ae498b2c4edab9a5bda21b6072843c517e6.png",
		name: "Fan O'War",
		the: true
	},
	356: {
		defindex: 356,
		image: "c_shogun_kunai.f7b5d3eb3346b30ff54a6979e603a3e9c3f51902.png",
		name: "Conniver's Kunai"
	},
	357: {
		defindex: 357,
		image: "c_shogun_katana.d3b199dea6013c98cc0db3a678e03edd0256976d.png",
		name: "Half-Zatoichi",
		the: true
	},
	358: {
		defindex: 358,
		image: "heavy_shogun_topknot.ad568562a7556a028c3519a9db9c4569034b249b.png",
		name: "Dread Knot",
		the: true
	},
	359: {
		defindex: 359,
		image: "demo_shogun_kabuto.9a05511d3a829d03b7b316c920d77e1fc2644ac2.png",
		name: "Samur-Eye",
		the: true
	},
	360: {
		defindex: 360,
		image: "homefront_blindfold.b20bb88f7507a62f48fb9203210563e07c315cf6.png",
		name: "Hero's Hachimaki"
	},
	361: {
		defindex: 361,
		image: "shogun_ninjamask.6403787a988a3b028f4281a7e5ceb0745fb1bb6d.png",
		name: "Noh Mercy",
		the: true
	},
	363: {
		defindex: 363,
		image: "shogun_geishahair.8113b6f3e50b53d60d2564251526b477d72da554.png",
		name: "Geisha Boy",
		the: true
	},
	365: {
		defindex: 365,
		image: "noisemaker_harp.7cef7af7a8fec6e17f6a587d0b89734bd4ed305c.png",
		name: "Noise Maker - Koto"
	},
	377: {
		defindex: 377,
		image: "hotties_hoodie.cdc19864087cc4fb89c14101e8b3253a88fed38f.png",
		name: "Hottie's Hoodie"
	},
	378: {
		defindex: 378,
		image: "soldier_officer.56c7b247886abeb5829c93798723368a8d905ff7.png",
		name: "Team Captain",
		the: true
	},
	379: {
		defindex: 379,
		image: "engineer_top_hat.16035cb162f623ca9fe123a743d12f24bb2391cb.png",
		name: "Western Wear"
	},
	380: {
		defindex: 380,
		image: "wrestling_mask.ddda7f2a6d382737cfc6208f49c14eca5502278f.png",
		name: "Large Luchadore"
	},
	381: {
		defindex: 381,
		image: "fieldcap.5ec2be963d3ce53f23faa13e11ef1bb63f50b157.png",
		name: "Medic's Mountain Cap"
	},
	382: {
		defindex: 382,
		image: "mullet_hat_icon.e755f36e8d5067a5a3a4191f8461ab21d6588dfd.png",
		name: "Big Country"
	},
	383: {
		defindex: 383,
		image: "grimm_hatte.97628b3c898abe13be541e6d12776eecee73ac98.png",
		name: "Grimm Hatte"
	},
	384: {
		defindex: 384,
		image: "professor_hair_icon.617a3480ba02278d7cfbcb2823fd69748fdf197e.png",
		name: "Professor's Peculiarity"
	},
	386: {
		defindex: 386,
		image: "teddy_roosebelt.9cd681f33d9f7901320b2d119e618d40573bf416.png",
		name: "Teddy Roosebelt"
	},
	387: {
		defindex: 387,
		image: "sore_eyes.7a06317f9f1b3d4f47f72a619cf2a2f3c0767111.png",
		name: "Sight for Sore Eyes"
	},
	388: {
		defindex: 388,
		image: "spy_private_eye.47cb13cdc7d2eb96ee73d828f4bf44e8d1211b16.png",
		name: "Private Eye"
	},
	389: {
		defindex: 389,
		image: "mad_eye.b8684073c29bf555c1094799d8fe3305ae37c657.png",
		name: "Googly Gazer"
	},
	390: {
		defindex: 390,
		image: "demo_dreads.c5b3fa359166faa1d4eafd32583bca79c79f2cc3.png",
		name: "Reggaelator"
	},
	391: {
		defindex: 391,
		image: "honchos_headgear.28eb29e3a7c35487d1f41960f3fbd849da74accc.png",
		name: "Honcho's Headgear"
	},
	392: {
		defindex: 392,
		image: "pocket_medic.671d3c810ac5f33f9088b7d1830e0a4de5794802.png",
		name: "Pocket Medic"
	},
	393: {
		defindex: 393,
		image: "kerch.25bcd8c286dcf605c61d329f26e9545fa699ff7e.png",
		name: "Villain's Veil"
	},
	394: {
		defindex: 394,
		image: "pyro_chef_hat.07cc71069f7bc0f33c93a5265de125882fd3f29d.png",
		name: "Connoisseur's Cap"
	},
	395: {
		defindex: 395,
		image: "asian_merc.ff069aa9f19ba7fe59fcfd215bc1dfcd0856df19.png",
		name: "Furious Fukaamigasa"
	},
	397: {
		defindex: 397,
		image: "spy_charmers_chapeau.5591bb51e50c780c92044ba717fdadff2abf2172.png",
		name: "Charmer's Chapeau"
	},
	398: {
		defindex: 398,
		image: "icepack.43a54e7e46682b8d68b98bc8bedd6de4c7cde00a.png",
		name: "Doctor's Sack"
	},
	399: {
		defindex: 399,
		image: "prospector_hat.096cf76cff6d152996ad83201c4d9a5028ce786c.png",
		name: "Ol' Geezer"
	},
	400: {
		defindex: 400,
		image: "desert_marauder.4a753ed01d7b56203182e0e9804e29b3785f666c.png",
		name: "Desert Marauder"
	},
	401: {
		defindex: 401,
		image: "c_scimitar.00e6e1fbb57b60c4add3ac729f22c2eb34bf97c1.png",
		name: "Shahanshah",
		the: true
	},
	402: {
		defindex: 402,
		image: "c_bazaar_sniper.cccd28a16c50e6dc07696859a8e9e297923f31c3.png",
		name: "Bazaar Bargain",
		the: true
	},
	403: {
		defindex: 403,
		image: "demo_sultan_hat.31ea9dfa3087a0ce0ef8996e429ba1a99e665d91.png",
		name: "Sultan's Ceremonial"
	},
	404: {
		defindex: 404,
		image: "c_demo_sultan_sword.3d0f5782c72cb07453690a3831653116c1face56.png",
		name: "Persian Persuader",
		the: true
	},
	405: {
		defindex: 405,
		image: "demo_booties.3e3c5e14226bc5acc14da454ea7274b265f8c70d.png",
		name: "Ali Baba's Wee Booties"
	},
	406: {
		defindex: 406,
		image: "c_persian_shield.6879c1df7eb95e415f6a5d7deb5ba0f01d65fa98.png",
		name: "Splendid Screen",
		the: true
	},
	411: {
		defindex: 411,
		image: "c_proto_medigun.ca7a9aecfe09b4bdcf5006ff2e59732e45b766e0.png",
		name: "Quick-Fix",
		the: true
	},
	412: {
		defindex: 412,
		image: "c_proto_syringegun.779cd2809c695cb93953cbdf0ff9ab910a6c5108.png",
		name: "Overdose",
		the: true
	},
	413: {
		defindex: 413,
		image: "c_hippocrates_bust.349e0d8021c3c1945ff973427c56c4710df9683e.png",
		name: "Solemn Vow",
		the: true
	},
	414: {
		defindex: 414,
		image: "c_liberty_launcher.aa2c5dece0f466afbb0342c54fa51836e2062aec.png",
		name: "Liberty Launcher",
		the: true
	},
	415: {
		defindex: 415,
		image: "c_reserve_shooter.317a2e62654330c4d83bf33bb1fda6fdd3dc73a0.png",
		name: "Reserve Shooter",
		the: true
	},
	416: {
		defindex: 416,
		image: "c_market_gardener.716e407839facc6a60faf9c37e5cb1b2a8522ec4.png",
		name: "Market Gardener",
		the: true
	},
	417: {
		defindex: 417,
		image: "soldier_jeepcap.8d6854d71b13ff2af6b219725cc016d05d8c3c80.png",
		name: "Jumper's Jeepcap"
	},
	420: {
		defindex: 420,
		image: "hardhat.82a7ca9376946face6c9886c970ab3575ee61e04.png",
		name: "Aperture Labs Hard Hat"
	},
	422: {
		defindex: 422,
		image: "p2_pin.a3c3f5532aec39b5ad9f55b1ff1c1774fa39cd13.png",
		name: "Resurrection Associate Pin"
	},
	424: {
		defindex: 424,
		image: "c_tomislav.b90c5429748c939efcc61171d91a9fe731c6b911.png",
		name: "Tomislav",
		australium: "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEIUxMeUBLxtDlVt8_pAfazBOESnN9748kMjzNtxlQsMuXlaGQ1cwHHVaQJDq1roF7qDXRrvp5nBoTuoeNfLRKv6tXaVQugRw"
	},
	425: {
		defindex: 425,
		image: "c_russian_riot.775cdcec2ab6ae23aa7d4915f1eee77626fdd5a6.png",
		name: "Family Business",
		the: true
	},
	426: {
		defindex: 426,
		image: "c_eviction_notice.ac117b4c084eb6341d97d6bb8819298662c0805d.png",
		name: "Eviction Notice",
		the: true
	},
	427: {
		defindex: 427,
		image: "capones_capper.e462eb63d54e1502c10c9f185fc231504b0e4206.png",
		name: "Capo's Capper",
		the: true
	},
	429: {
		defindex: 429,
		image: "moustachium.79ba47320af2a79c993ae441e052313442fd9ab5.png",
		name: "Moustachium Bar"
	},
	430: {
		defindex: 430,
		image: "fish.49af1dceb6b6e05a35aa2d72780b6271057efed6.png",
		name: "'Fish'"
	},
	431: {
		defindex: 431,
		image: "spacechem_token_01.8822c7b938373e620514f6ad3556c8a0dc498c90.png",
		name: "Spacemetal Scrap"
	},
	432: {
		defindex: 432,
		image: "spacechem_pin.f1abd77fb2a43093717e2e530cfc81b93ebb5fdd.png",
		name: "SpaceChem Pin"
	},
	433: {
		defindex: 433,
		image: "c_fishcake.5abb622a20e6a60120b23f32f15f7403a624ebe7.png",
		name: "Fishcake"
	},
	434: {
		defindex: 434,
		image: "bucket.07ffe03fb0c5209a0126146f49aa951e18a34feb.png",
		name: "Brain Bucket"
	},
	435: {
		defindex: 435,
		image: "traffic_cone.67a3fd18970ffb12cc44afb6e5f650ce646fe61f.png",
		name: "Dead Cone",
		the: true
	},
	436: {
		defindex: 436,
		image: "mbsf_engineer.76072445a76c946a39021cbe59bad3fd0bc21e35.png",
		name: "Hetman's Headpiece",
		the: true
	},
	437: {
		defindex: 437,
		image: "mbsf_spy.fd684745262f8cb4b4bf459337177b14ccfe645c.png",
		name: "Janissary Ketche",
		the: true
	},
	438: {
		defindex: 438,
		image: "taunt_replay.d5ab6c2e83421c67a51ddf05d11ef91ff42eff00.png",
		name: "Taunt: The Director's Vision"
	},
	439: {
		defindex: 439,
		image: "drg_pith_hat.42a83d657c7456e27532965d0edeb6eec492f8d0.png",
		name: "Lord Cockswain's Pith Helmet"
	},
	440: {
		defindex: 440,
		image: "drg_hair_beard_icon.d29d774f67c35ee356befc79b66027b3d7859b49.png",
		name: "Lord Cockswain's Novelty Mutton Chops and Pipe"
	},
	441: {
		defindex: 441,
		image: "c_drg_cowmangler.a74918c7984a947e48da080038b8713ee6472bd5.png",
		name: "Cow Mangler 5000",
		the: true
	},
	442: {
		defindex: 442,
		image: "c_drg_righteousbison.056fde174f868a1b211b5b415d346ebafdba2da8.png",
		name: "Righteous Bison",
		the: true
	},
	443: {
		defindex: 443,
		image: "drg_badge.988aa4d408bd0cedd8888f65876f81dea9305687.png",
		name: "Dr. Grordbort's Crest"
	},
	444: {
		defindex: 444,
		image: "tankerboots.003a1b5678649907ffb7079ec0ff159531155e59.png",
		name: "Mantreads",
		the: true
	},
	445: {
		defindex: 445,
		image: "armored_authority.cfc050197c14cf9a6b836d8b4c9600155a3a9dad.png",
		name: "Armored Authority"
	},
	446: {
		defindex: 446,
		image: "fdu.231f1c4ca508006181ce2c93f8d7781f8f7e2a33.png",
		name: "Fancy Dress Uniform"
	},
	447: {
		defindex: 447,
		image: "c_riding_crop.cc21df3f23cb5748c390466401aee7eeca503ea3.png",
		name: "Disciplinary Action",
		the: true
	},
	448: {
		defindex: 448,
		image: "c_soda_popper.c2bdd7385a26175e9e7a8d0a8f5a4345f90afec2.png",
		name: "Soda Popper",
		the: true
	},
	449: {
		defindex: 449,
		image: "c_winger_pistol.fce3527b5e1d059837ecda6302c9fdde5acfa0b0.png",
		name: "Winger",
		the: true
	},
	450: {
		defindex: 450,
		image: "c_bonk_bat.dd3c8ea0e80d8201cf2fced7027ceb96ece0643d.png",
		name: "Atomizer",
		the: true
	},
	451: {
		defindex: 451,
		image: "bonk_mask.4752d501f0a2c46d9eb172bbfe9b1885bb04fdc3.png",
		name: "Bonk Boy"
	},
	452: {
		defindex: 452,
		image: "c_scout_sword.3215a162296e9ac138d46026614466a856391ea3.png",
		name: "Three-Rune Blade"
	},
	453: {
		defindex: 453,
		image: "scout_hair_icon.29c7caa166843b2d6c2fb9a50d6101f6c2ece5bc.png",
		name: "Hero's Tail",
		the: true
	},
	454: {
		defindex: 454,
		image: "scout_medallion.5a2a05897d0c049376461687bbc967a10927ddaf.png",
		name: "Sign of the Wolf's School"
	},
	457: {
		defindex: 457,
		image: "c_mailbox.dff3d009414b02731ca9353f1caaf6617dd8f219.png",
		name: "Postal Pummeler",
		the: true
	},
	459: {
		defindex: 459,
		image: "spy_gang_cap.75175dbfcfbb35b925369cf63b04a0c873638de8.png",
		name: "Cosa Nostra Cap"
	},
	460: {
		defindex: 460,
		image: "c_snub_nose.af23cbd3dcd2d2f2a43703c4a7c43b9c53d359f3.png",
		name: "Enforcer",
		the: true
	},
	461: {
		defindex: 461,
		image: "c_switchblade.eb0b378d8b19efcbda3f6130f3f4bfda22e51deb.png",
		name: "Big Earner",
		the: true
	},
	462: {
		defindex: 462,
		image: "spy_rose.a832a5797b5d26905f528f4ad4f4c493f1104426.png",
		name: "Made Man",
		the: true
	},
	463: {
		defindex: 463,
		image: "all_laugh_taunt.72e7a926cf5d34ca2377872aca7d8aa9b41c4655.png",
		name: "Taunt: The Schadenfreude"
	},
	465: {
		defindex: 465,
		image: "demo_hood.2fa33d5d09dcbfed6345cf927db03c10170b341e.png",
		name: "Conjurer's Cowl",
		the: true
	},
	466: {
		defindex: 466,
		image: "c_rfa_hammer.7c7790d19a53582693b7900df71003f0deee11d2.png",
		name: "Maul",
		the: true
	},
	467: {
		defindex: 467,
		image: "medic_mtg.833e6137f6258d96fe5b2742eafb355414d40d20.png",
		name: "Planeswalker Helm",
		the: true
	},
	468: {
		defindex: 468,
		image: "scout_mtg.a3dab389e1db2959c0afab09e25968a2689cb87a.png",
		name: "Planeswalker Goggles",
		the: true
	},
	472: {
		defindex: 472,
		image: "null.fa51eceab3a3f8687a546be5a30034605e3316f8.png",
		name: "Team Fortress 2 - Upgrade to Premium"
	},
	473: {
		defindex: 473,
		image: "soldier_spiral.de609ea3c4f6683fed87761cece4f43ffbc2f03a.png",
		name: "Spiral Sallet",
		the: true
	},
	474: {
		defindex: 474,
		image: "c_picket.7022ac5835466085f20e73ac030ecafe9ce4401c.png",
		name: "Conscientious Objector",
		the: true
	},
	477: {
		defindex: 477,
		image: "medic_heroic_taunt.d040d3030583ba1e189e6f7af9a23d57780ad824.png",
		name: "Taunt: The Meet the Medic"
	},
	478: {
		defindex: 478,
		image: "cop_helmet.c671e72e1541a957f61adcb6355cff8215d7df1d.png",
		name: "Copper's Hard Top"
	},
	479: {
		defindex: 479,
		image: "cop_glasses.9a9a8608d71736898db8764422a5d1d00f60d489.png",
		name: "Security Shades"
	},
	480: {
		defindex: 480,
		image: "tamoshanter.f9d7fcac89f71b31831fd5c51ca0e57f6c7ce623.png",
		name: "Tam O' Shanter"
	},
	481: {
		defindex: 481,
		image: "boot_hat.39b735f48e0196e8dd70ba1185d60059d222de0c.png",
		name: "Stately Steel Toe"
	},
	482: {
		defindex: 482,
		image: "c_golfclub.5a8ab596c03e955509dee72e6037789d0f4d3d54.png",
		name: "Nessie's Nine Iron"
	},
	483: {
		defindex: 483,
		image: "tneck_backpack_icon.99d6d1172da01eef3135c83774272c70185f7709.png",
		name: "Rogue's Col Roule"
	},
	484: {
		defindex: 484,
		image: "spurs_backpack_icon.c522b76e6933f89585bbde9d1459187901d5ddb2.png",
		name: "Prairie Heel Biters"
	},
	485: {
		defindex: 485,
		image: "big_jaw.03c73617a7336e8458c030231210dde3da0f48f3.png",
		name: "Big Steel Jaw of Summer Fun",
		the: true
	},
	486: {
		defindex: 486,
		image: "summer_shades.f22bb0b19e3862e9e0d95cfacb38ff332159eac1.png",
		name: "Summer Shades"
	},
	489: {
		defindex: 489,
		image: "powerupbottle.1908d78941919586ff0e4dff5bac49f8b10bb671.png",
		name: "Power Up Canteen"
	},
	490: {
		defindex: 490,
		image: "flipflops.4dc7c95bb6e0a25097d79e99a399bf00aa2df5ae.png",
		name: "Flip-Flops"
	},
	491: {
		defindex: 491,
		image: "summer_pack.ebeef8607fb27a6cb4b84807de8482f2413c156e.png",
		name: "Lucky No. 42"
	},
	492: {
		defindex: 492,
		image: "summer_hat_demo.8282e29020abbad072100853d228e2f5f651d7e3.png",
		name: "Summer Hat"
	},
	493: {
		defindex: 493,
		image: "noisemaker_fireworks.d4d309ccb5cfa246e361f48aff78cc9ec9504c51.png",
		name: "Noise Maker - Fireworks"
	},
	513: {
		defindex: 513,
		image: "c_bet_rocketlauncher.466851a0bc8f67e1224e889da03ed08515a7e052.png",
		name: "Original",
		the: true
	},
	514: {
		defindex: 514,
		image: "dust_mask.5d01655818f250d71ad503b9ace2fd3e239aa878.png",
		name: "Mask of the Shaman",
		the: true
	},
	515: {
		defindex: 515,
		image: "ro_pilotka.0177ba3f1ad8a44933f28e9f04e8000c8e68a067.png",
		name: "Pilotka",
		the: true
	},
	516: {
		defindex: 516,
		image: "ro_helmet.0455686b664845fad5e4cdd28250ecf6ca130f08.png",
		name: "Stahlhelm",
		the: true
	},
	517: {
		defindex: 517,
		image: "skyrim_helmet.bc6515ea09e6838e338dcdf6d36fab57204abed8.png",
		name: "Dragonborn Helmet",
		the: true
	},
	518: {
		defindex: 518,
		image: "c_bet_brinkhood.6e89bdcb3f0a2eee33acdb02a3614aeac460041f.png",
		name: "Anger",
		the: true
	},
	519: {
		defindex: 519,
		image: "bet_pb.cc0d5e545de6568d4116a35f327bbfc61ac0810e.png",
		name: "Pip-Boy"
	},
	520: {
		defindex: 520,
		image: "bet_wingstick.d5bf7b739802dcd1e858ffbae26bf8b96b3716ea.png",
		name: "Wingstick",
		the: true
	},
	521: {
		defindex: 521,
		image: "dex_belltower_heavy.31151e66fc778eb5b06cb56adb48375c44aaa607.png",
		name: "Nanobalaclava",
		the: true
	},
	522: {
		defindex: 522,
		image: "dex_glasses_heavy.bb9511f30d17a260b9ab978a0cf8c97ed9186949.png",
		name: "Deus Specs",
		the: true
	},
	523: {
		defindex: 523,
		image: "demo_dex.8ffb0557ec86e15f99d688b5031b254394abbe22.png",
		name: "Company Man",
		the: true
	},
	524: {
		defindex: 524,
		image: "dex_sarifarm.33a0d404edf4fc99ef3f3a74115e0800453116c7.png",
		name: "Purity Fist",
		the: true
	},
	525: {
		defindex: 525,
		image: "c_dex_revolver.b379d943d06568f90d93763b305141b77b75ebcb.png",
		name: "Diamondback",
		the: true
	},
	526: {
		defindex: 526,
		image: "c_dex_sniperrifle.81e976fb35c261054d3537c3d74d7559a4dac397.png",
		name: "Machina",
		the: true
	},
	527: {
		defindex: 527,
		image: "c_dex_shotgun.ed94dfbf035ed9df16cba060541bd7816e92156a.png",
		name: "Widowmaker",
		the: true
	},
	528: {
		defindex: 528,
		image: "c_dex_arm.03d97329aabd802e65a41dbba97027bbc2242dff.png",
		name: "Short Circuit",
		the: true
	},
	538: {
		defindex: 538,
		image: "pcg_hat_engineer.13ee1cad574b26c2b7d561a799f8edfaca9ac18c.png",
		name: "Killer Exclusive",
		the: true
	},
	539: {
		defindex: 539,
		image: "rebel_cap.59bbff90acf0c4a5f3282c033bc4d03b1b3ffdcd.png",
		name: "El Jefe",
		the: true
	},
	540: {
		defindex: 540,
		image: "fm2012_cleats.faa4c1b4890afbc486f09465274efd26c1d2c9b8.png",
		name: "Ball-Kicking Boots",
		the: true
	},
	541: {
		defindex: 541,
		image: "scarf_soccer.d6ae3b18c8cfd4450bbecf7a0ea7000a15ce5b6a.png",
		name: "Merc's Pride Scarf",
		the: true
	},
	542: {
		defindex: 542,
		image: "noisemaker_soccer.beac091f3a66e6a3280098d9463d12cc86055fb4.png",
		name: "Noise Maker - Vuvuzela"
	},
	543: {
		defindex: 543,
		image: "hwn_demo_hat.cac8eee73abd90afe71198744ecd927b1e60206e.png",
		name: "Hair of the Dog",
		the: true
	},
	544: {
		defindex: 544,
		image: "hwn_demo_misc1.e2f4583accce08f9a0080dd42821c15b7dac0747.png",
		name: "Scottish Snarl",
		the: true
	},
	545: {
		defindex: 545,
		image: "hwn_demo_misc2.ff34aabc0dd1ddf8bf624eacf493c0fdc2b41654.png",
		name: "Pickled Paws",
		the: true
	},
	546: {
		defindex: 546,
		image: "hwn_scout_hat.5c556a198299889c4eed682bb9b97b0dde5808c2.png",
		name: "Wrap Battler",
		the: true
	},
	547: {
		defindex: 547,
		image: "hwn_scout_misc1.806f662612ee4c8b52e13bd003742ced57a0bdf2.png",
		name: "B-ankh!"
	},
	548: {
		defindex: 548,
		image: "hwn_scout_misc2.60bfb4afccd0aedc8c6321b5a071d70ad3065273.png",
		name: "Futankhamun",
		the: true
	},
	549: {
		defindex: 549,
		image: "hwn_pyro_hat.d2b5300a102ea67c036149c6d39a09f6648f2f28.png",
		name: "Blazing Bull",
		the: true
	},
	550: {
		defindex: 550,
		image: "hwn_pyro_misc1.b26db8e9a9fde9173cc9d8dfbdd73301e06836be.png",
		name: "Fallen Angel",
		the: true
	},
	551: {
		defindex: 551,
		image: "hwn_pyro_misc2.287a57b1150a1f044f0ed5b54aa43836fb7371f3.png",
		name: "Tail From the Crypt"
	},
	552: {
		defindex: 552,
		image: "hwn_medic_hat.8e961ea2131582948aa3739424540819dcfae38d.png",
		name: "Einstein",
		the: true
	},
	553: {
		defindex: 553,
		image: "hwn_medic_misc1.cfcc8be105efb8064a18a1cdbc649b8a6feec979.png",
		name: "Dr. Gogglestache"
	},
	554: {
		defindex: 554,
		image: "hwn_medic_misc2.61b93cce06141077cb44498852aac9eba6706fd2.png",
		name: "Emerald Jarate",
		the: true
	},
	555: {
		defindex: 555,
		image: "hwn_soldier_hat.f9853361feb654796b6d5ea5f1d9a663b41527bd.png",
		name: "Idiot Box",
		the: true
	},
	556: {
		defindex: 556,
		image: "hwn_soldier_misc1.2aee6b05e22eac00852e8c6a58defcabc3de2e0d.png",
		name: "Steel Pipes",
		the: true
	},
	557: {
		defindex: 557,
		image: "hwn_soldier_misc2.ddd52e9b60b553869e496c86b96bc2a242b51f3b.png",
		name: "Shoestring Budget",
		the: true
	},
	558: {
		defindex: 558,
		image: "hwn_spy_hat.a4eca782435bce85a6fe53259952f16e4ae9ea40.png",
		name: "Under Cover",
		the: true
	},
	559: {
		defindex: 559,
		image: "hwn_spy_misc1.a544d356c0cd721cfbc8d829e30ae7825694f289.png",
		name: "Griffin's Gog"
	},
	560: {
		defindex: 560,
		image: "hwn_spy_misc2.3daaa6142c885a7c8af1ad4b220e65387ea6ee34.png",
		name: "Intangible Ascot",
		the: true
	},
	561: {
		defindex: 561,
		image: "hwn_heavy_hat.4747e5f0fede456c469f40ad03e036f57a2765b1.png",
		name: "Can Opener",
		the: true
	},
	562: {
		defindex: 562,
		image: "hwn_heavy_misc1.64560d08bb8209d3e669d4512c8d08a95ad32511.png",
		name: "Soviet Stitch-Up",
		the: true
	},
	563: {
		defindex: 563,
		image: "hwn_heavy_misc2.7bfa8076581b7993f64d9e35a39c56b79b711d72.png",
		name: "Steel-Toed Stompers",
		the: true
	},
	564: {
		defindex: 564,
		image: "hwn_sniper_hat.c41c0e82c35e15ba276e3c1448dbb2c390812ca8.png",
		name: "Holy Hunter",
		the: true
	},
	565: {
		defindex: 565,
		image: "hwn_sniper_misc1.652d494d64330b167ba5f7e1fcc3c56b592b44eb.png",
		name: "Silver Bullets"
	},
	566: {
		defindex: 566,
		image: "hwn_sniper_misc2.9f4efe73471bf028fda71d3b1b89ab5711c3b948.png",
		name: "Garlic Flank Stake"
	},
	567: {
		defindex: 567,
		image: "hwn_engineer_hat.888c5e9b9c41fb7cb64e7604d7178ff5f8452dea.png",
		name: "Buzz Killer",
		the: true
	},
	568: {
		defindex: 568,
		image: "hwn_engineer_misc1.3992a008845f396d463d911816d9165e4832ffc7.png",
		name: "Frontier Flyboy",
		the: true
	},
	569: {
		defindex: 569,
		image: "hwn_engineer_misc2.e3fa92e3cdfef0cf69a6521f96bea4cca4df8120.png",
		name: "Legend of Bugfoot",
		the: true
	},
	570: {
		defindex: 570,
		image: "pyro_halloween_gasmask.a95d769da423787a368bdacf35499a2d8b99b70a.png",
		name: "Last Breath",
		the: true
	},
	571: {
		defindex: 571,
		image: "ghost_aspect.1a9e6971aa1c798b8115ba2a808bd86166197c3a.png",
		name: "Apparition's Aspect"
	},
	572: {
		defindex: 572,
		image: "c_unarmed_combat.4ba6e7a41ae445c04f266bc86ceb4d0939e93d4e.png",
		name: "Unarmed Combat"
	},
	574: {
		defindex: 574,
		image: "c_voodoo_pin.f70d0be3e6cb4064acd9d967ca06744908bf2ab9.png",
		name: "Wanga Prick"
	},
	575: {
		defindex: 575,
		image: "infernal_impaler.9259a5b1e57bdce5e4cdec7ac0960e36916d86a2.png",
		name: "Infernal Impaler",
		the: true
	},
	576: {
		defindex: 576,
		image: "skull_horns_b.3c2f6e8acd44a917be2fa941dba0f4a7893a2400.png",
		name: "Spine-Chilling Skull 2011",
		the: true
	},
	578: {
		defindex: 578,
		image: "skull_horns_b.3c2f6e8acd44a917be2fa941dba0f4a7893a2400.png",
		name: "Spine-Tingling Skull",
		the: true
	},
	579: {
		defindex: 579,
		image: "skull_horns_b2.1b076a6a5ed214a7e447c654dcc37ee3829e25da.png",
		name: "Spine-Cooling Skull",
		the: true
	},
	580: {
		defindex: 580,
		image: "skull_horns_b3.9e6e4f8b3818dd62e2def6171d63a8abd3bf28a3.png",
		name: "Spine-Twisting Skull",
		the: true
	},
	581: {
		defindex: 581,
		image: "haunted_eyeball_hat.5959079eb73484df5e47fe7a2a07c4646a1ac56b.png",
		name: "MONOCULUS!",
		the: true
	},
	583: {
		defindex: 583,
		image: "bombonomicon.6dc3119f20faa08d10161fa876c57265ae46c282.png",
		name: "Bombinomicon",
		the: true
	},
	585: {
		defindex: 585,
		image: "sr3_heavy_mask.8e1ebfd07d18b65f1c75d98b4a20ff6033799b1f.png",
		name: "Cold War Luchador",
		the: true
	},
	586: {
		defindex: 586,
		image: "sr3_badge.aa68f18685a828e82d70e9f0c58778ca42155253.png",
		name: "Mark of the Saint",
		the: true
	},
	587: {
		defindex: 587,
		image: "c_sr3_punch.077e5337d574c95e4b359be6082fb128cd037c45.png",
		name: "Apoco-Fists",
		the: true
	},
	588: {
		defindex: 588,
		image: "c_drg_pomson.4e5424f79346065be63181b94e7583691d38db5b.png",
		name: "Pomson 6000",
		the: true
	},
	589: {
		defindex: 589,
		image: "c_drg_wrenchmotron.e653fff68b114c2c64439f6fa18ba95dd50a0940.png",
		name: "Eureka Effect",
		the: true
	},
	590: {
		defindex: 590,
		image: "drg_brainiac_hair.e5066a35b278d5290ed8dcf8592e2ec2acde529c.png",
		name: "Brainiac Hairpiece",
		the: true
	},
	591: {
		defindex: 591,
		image: "drg_brainiac_goggles.e51182126ede0f7c6e03ec0cd8d723196d72f650.png",
		name: "Brainiac Goggles",
		the: true
	},
	592: {
		defindex: 592,
		image: "drg_badge_copper.084625905ae25e3534674c72d02c45ab02992715.png",
		name: "Dr. Grordbort's Copper Crest"
	},
	593: {
		defindex: 593,
		image: "c_drg_thirddegree.a0b74c75233404dc9aef3537ec033ea4bd883ee0.png",
		name: "Third Degree",
		the: true
	},
	594: {
		defindex: 594,
		image: "c_drg_phlogistinator.99b83086e28b2f85ed4c925ac5e3c6e123289aec.png",
		name: "Phlogistinator",
		the: true
	},
	595: {
		defindex: 595,
		image: "c_drg_manmelter.b76b87bda3242806c05a6201a4024a560269e805.png",
		name: "Manmelter",
		the: true
	},
	596: {
		defindex: 596,
		image: "drg_pyro_fueltank.c9fcf960077c0761f39838dc6b9b5fe3814d9079.png",
		name: "Moonman Backpack",
		the: true
	},
	597: {
		defindex: 597,
		image: "drg_pyro_bubblehelmet.b6acad238823f110b417b8e54ead921545b92ed5.png",
		name: "Bubble Pipe",
		the: true
	},
	598: {
		defindex: 598,
		image: "paper_hat.9a376ef12de264c2200df3edf84a87343aa03517.png",
		name: "Manniversary Paper Hat",
		the: true
	},
	599: {
		defindex: 599,
		image: "gift_fashion.37487e85b245787048aacefe67105bbe44a20e0c.png",
		name: "Manniversary Package"
	},
	600: {
		defindex: 600,
		image: "fwk_sniper_bandanahair.542d2de2d773195ff7db5d51b7ff768014181f6f.png",
		name: "Your Worst Nightmare"
	},
	601: {
		defindex: 601,
		image: "fwk_heavy_bandanahair.1d4ee4c5be304871cabf0bc81f7d9d6ab18c4f6d.png",
		name: "One-Man Army",
		the: true
	},
	602: {
		defindex: 602,
		image: "fwk_spy_disguisedhat.f5f84e2594172d113f4aed97ac28389b8d57e4e4.png",
		name: "Counterfeit Billycock",
		the: true
	},
	603: {
		defindex: 603,
		image: "fwk_heavy_lumber.b5610408dffce977d44d4c59219422389078e8b8.png",
		name: "Outdoorsman",
		the: true
	},
	604: {
		defindex: 604,
		image: "fwk_demo_sashhat.2d911ad5842f49b61f56ee43d7a096c7965078d3.png",
		name: "Tavish DeGroot Experience",
		the: true
	},
	605: {
		defindex: 605,
		image: "heavy_thinker.f680ecec75ea47ab7223dd315b3a6711f488e82b.png",
		name: "Pencil Pusher",
		the: true
	},
	606: {
		defindex: 606,
		image: "fwk_engineer_blueprints.ec005d293e8f073cbd03bf5295930b823e7111bb.png",
		name: "Builder's Blueprints",
		the: true
	},
	607: {
		defindex: 607,
		image: "mightypirate.2ad51ddcb69e8f916eeb2a6c5021c76d96d6066b.png",
		name: "Buccaneer's Bicorne",
		the: true
	},
	608: {
		defindex: 608,
		image: "pegleg.3a4f6393da46b6b29647f8e2ccd2038639f62942.png",
		name: "Bootlegger",
		the: true
	},
	609: {
		defindex: 609,
		image: "rum.a9f55958f0482adc5b5725b4e17fa44ae10aff2a.png",
		name: "Scottish Handshake",
		the: true
	},
	610: {
		defindex: 610,
		image: "bombs.0c3b23acd73f7cfb3937d6027671f02d1e3bfd08.png",
		name: "A Whiff of the Old Brimstone"
	},
	611: {
		defindex: 611,
		image: "fwk_seacaptain.a3eeba5f50a0a306443bcdcc5a135abd7bee2da1.png",
		name: "Salty Dog",
		the: true
	},
	612: {
		defindex: 612,
		image: "fwk_pyro_sailor.c9757e493f845b66722ff6e058647af0f86bc6ed.png",
		name: "Little Buddy",
		the: true
	},
	613: {
		defindex: 613,
		image: "fwk_heavy_gym.eac33b96c632ab68834eb60f3fd53baaeedf8148.png",
		name: "Gym Rat",
		the: true
	},
	614: {
		defindex: 614,
		image: "fwk_hotdog.4686cd2dde1abea8a4ed6e153a91737eb7f6e4cc.png",
		name: "Hot Dogger",
		the: true
	},
	615: {
		defindex: 615,
		image: "fwk_pyro_birdcage.6d8a17f5c0269509f0e1f2bea18e1b7e39a2e8ab.png",
		name: "Birdcage",
		the: true
	},
	616: {
		defindex: 616,
		image: "fwk_medic_stahlhelm.dd88efb55745d75170049a5815b1dacb1e7be280.png",
		name: "Surgeon's Stahlhelm",
		the: true
	},
	617: {
		defindex: 617,
		image: "fwk_scout_cap.3d9da82029de3b9465aa5b06b398ec35ccc64de3.png",
		name: "Backwards Ballcap",
		the: true
	},
	618: {
		defindex: 618,
		image: "fwk_sniper_necklace.c9978621523fb4c9c1de226551546bb7d39564a8.png",
		name: "Crocodile Smile",
		the: true
	},
	619: {
		defindex: 619,
		image: "flair_buttons.733680e995c93946599ab85851a836348025737e.png",
		name: "Flair!"
	},
	620: {
		defindex: 620,
		image: "fwk_medic_pocketsquare.bd66b8cb10f5da9f12378f1a0b6a314beb825173.png",
		name: "Couvre Corner"
	},
	621: {
		defindex: 621,
		image: "fwk_medic_stethoscope.82dcc86dc853b60b20c1daea1cecf810d712b940.png",
		name: "Surgeon's Stethoscope",
		the: true
	},
	622: {
		defindex: 622,
		image: "fwk_spy_inspector.7f17452bcc180fbe8a8d63c98cc8aac7179f7469.png",
		name: "L'Inspecteur"
	},
	623: {
		defindex: 623,
		image: "photo_badge.73125e102ee3d086175dcf2ffb0742f7998fa643.png",
		name: "Photo Badge"
	},
	625: {
		defindex: 625,
		image: "stampable_medal.ac48f9c2d603d90189dc89139b9357acd83f2c55.png",
		name: "Clan Pride"
	},
	626: {
		defindex: 626,
		image: "fwk_sniper_corkhat.0ec3e4d8996a95d631c0fafeda49c249db52610e.png",
		name: "Swagman's Swatter",
		the: true
	},
	627: {
		defindex: 627,
		image: "fwk_pyro_flamenco.55efe375ba5bb9a450655786544aac85007458f2.png",
		name: "Flamboyant Flamenco",
		the: true
	},
	628: {
		defindex: 628,
		image: "fwk_engineer_cranial.3e625771983a94137ae1191df7714b62cb8164ef.png",
		name: "Virtual Reality Headset",
		the: true
	},
	629: {
		defindex: 629,
		image: "fwk_spy_specs.41a6ccbe4d01bc6fb0ed0d51d7d39330b1c09ebd.png",
		name: "Spectre's Spectacles",
		the: true
	},
	630: {
		defindex: 630,
		image: "fwk_scout_3d.70653ad485954bacc35d273d34f8ec3a0cd14357.png",
		name: "Stereoscopic Shades",
		the: true
	},
	631: {
		defindex: 631,
		image: "fwk_cowboyhat.9f160f7ac74865b7da7277678484033e0fd33cae.png",
		name: "Hat With No Name",
		the: true
	},
	632: {
		defindex: 632,
		image: "fwk_pyro_conscience.8f640c899d2343677a25e76c4edbc794ea4e2efa.png",
		name: "Cremator's Conscience",
		the: true
	},
	633: {
		defindex: 633,
		image: "fwk_scout_provision.3c8c039fd64d47a6ef174cd6d18be1281395f67f.png",
		name: "Hermes",
		the: true
	},
	634: {
		defindex: 634,
		image: "trn_wiz_hat_demo.969d5700c526108989b9e93ef08eaeb17cacbab9.png",
		name: "Point and Shoot",
		the: true
	},
	635: {
		defindex: 635,
		image: "trn_heavy_knight.dba53da7adf78d3d76c5a5933dd4157418ce9e48.png",
		name: "War Head",
		the: true
	},
	636: {
		defindex: 636,
		image: "drg_badge_silver.3e177b3a4a665203c14ddcb13259ec4f971bc070.png",
		name: "Dr. Grordbort's Silver Crest"
	},
	637: {
		defindex: 637,
		image: "acr_assassins_cowl.4e72dde86c77b2a3c4c1a68c4615f6c19e457a2e.png",
		name: "Dashin' Hashshashin",
		the: true
	},
	638: {
		defindex: 638,
		image: "c_acr_hookblade.bff93c1997f755c608bf74d9eadcdbb5261529d8.png",
		name: "Sharp Dresser",
		the: true
	},
	639: {
		defindex: 639,
		image: "bowtie.3dada19c616dba4b20abe31899772f84506955f2.png",
		name: "Dr. Whoa"
	},
	641: {
		defindex: 641,
		image: "xms_soldier_ornaments.4594393c5c24100c6547c28a0baa204df2242827.png",
		name: "Ornament Armament",
		the: true
	},
	642: {
		defindex: 642,
		image: "xms_sniper_commandobackpack.b6424a3ced8f91e3d9f6e3c6cdec5d759c369cdc.png",
		name: "Cozy Camper",
		the: true
	},
	643: {
		defindex: 643,
		image: "xms_heavy_sandvichsafe.bb2bfa9dfa8df97ca00b6bd73a9cd655306a34a0.png",
		name: "Sandvich Safe",
		the: true
	},
	644: {
		defindex: 644,
		image: "xms_pyro_parka.de5a5f80e74f428204a4f4a7d094612173adbe50.png",
		name: "Head Warmer",
		the: true
	},
	645: {
		defindex: 645,
		image: "xms_sniper_sweater_vest.f79217e593fa1ad2069dd9ddb660f58c3ee4b361.png",
		name: "Outback Intellectual",
		the: true
	},
	646: {
		defindex: 646,
		image: "xms_engineer_voodoospy.5354130e3be547a0f3160c38d1af2ce8a6a661eb.png",
		name: "Itsy Bitsy Spyer",
		the: true
	},
	647: {
		defindex: 647,
		image: "xms_beard.502e1d8b4f51d7985743d3c602ccdc978a3bcd12.png",
		name: "All-Father",
		the: true
	},
	648: {
		defindex: 648,
		image: "c_xms_giftwrap.dfc82e73461f5cb82787a854539a7ce2c8f7225f.png",
		name: "Wrap Assassin",
		the: true
	},
	649: {
		defindex: 649,
		image: "c_xms_cold_shoulder.19ae17161a5b98e0105ffc6ffc4ee79edbe8ee1b.png",
		name: "Spy-cicle",
		the: true
	},
	650: {
		defindex: 650,
		image: "xms_snowcoat.9900ad5da6428c5cfbf82ed0009e4ad116420758.png",
		name: "Kringle Collection",
		the: true
	},
	651: {
		defindex: 651,
		image: "xms_pyro_bells.416ec9f93f966ed819cef879f344b30e584d826e.png",
		name: "Jingle Belt",
		the: true
	},
	652: {
		defindex: 652,
		image: "xms_scout_elf_hat.3303da1993090d655f52f551da61608f4bde2bc7.png",
		name: "Big Elfin Deal",
		the: true
	},
	653: {
		defindex: 653,
		image: "xms_scout_elf_sneakers.dfdbab11bb2df9ad26bcda9f6442db2a24d5228a.png",
		name: "Bootie Time",
		the: true
	},
	654: {
		defindex: 654,
		image: "xms_heavy_minigunlights.7697f96e29684b4e6770e21905015b4bba289ead.png",
		name: "Festive Minigun"
	},
	656: {
		defindex: 656,
		image: "c_xms_gloves.3dee18c9ad25a3b3c97c66dbaa3babd67d1314a5.png",
		name: "Holiday Punch",
		the: true
	},
	657: {
		defindex: 657,
		image: "medic_smokingpipe.732a8d19f2ac57b574b8727dde8b41c4068fc68b.png",
		name: "Nine-Pipe Problem",
		the: true
	},
	658: {
		defindex: 658,
		image: "xms_rocketlauncher.e8269736c749530eae09bae41dccf370bfb2d491.png",
		name: "Festive Rocket Launcher"
	},
	659: {
		defindex: 659,
		image: "xms_flamethrower.800383db1f5907020b71ba97b79dc886b0853f90.png",
		name: "Festive Flame Thrower"
	},
	660: {
		defindex: 660,
		image: "xms_bat.9d742f558c81024019f65a6fef3f3fcefaae7d6d.png",
		name: "Festive Bat"
	},
	661: {
		defindex: 661,
		image: "xms_stickybomb_launcher.5761ea7ec513323f41fd5c130bb6d779f47154f4.png",
		name: "Festive Stickybomb Launcher"
	},
	662: {
		defindex: 662,
		image: "xms_wrench.0eeb6bbc09d3042738b820cf3eaa1a3efa2cb11b.png",
		name: "Festive Wrench"
	},
	663: {
		defindex: 663,
		image: "xms_medigun.865427fc82cb3965a6c362d8eab40f2e91a76622.png",
		name: "Festive Medi Gun"
	},
	664: {
		defindex: 664,
		image: "xms_sniperrifle.0788404f4040a3f6d249a59175ac3b70c6405bf3.png",
		name: "Festive Sniper Rifle"
	},
	665: {
		defindex: 665,
		image: "xms_knife.7ab2be3140d50b76c2ee783e067baea3408374e6.png",
		name: "Festive Knife"
	},
	666: {
		defindex: 666,
		image: "xms_santa_hat_demo.227b4d6dba0f2f97395c617f892e510c0d474970.png",
		name: "B.M.O.C.",
		the: true
	},
	667: {
		defindex: 667,
		image: "xms_gift_hat_demo.5116915118aa1698913254ec923ec4b71640e1bf.png",
		name: "Holiday Headcase",
		the: true
	},
	668: {
		defindex: 668,
		image: "xms_steamwhistle_spy.d19e21ee84411f0bee3875325d4791b459d37170.png",
		name: "Full Head Of Steam",
		the: true
	},
	669: {
		defindex: 669,
		image: "xms_scattergun.530c487413a246fc1c149ef67d6264ffa0d13274.png",
		name: "Festive Scattergun"
	},
	670: {
		defindex: 670,
		image: "xms_engineer_stocking.9265191f29f108e5c6b66e6eb6f74e841f86cede.png",
		name: "Stocking Stuffer",
		the: true
	},
	671: {
		defindex: 671,
		image: "xms_furcap_demo.f4d784ffcac7539f24ccc71dab4bf13284cebe2a.png",
		name: "Brown Bomber",
		the: true
	},
	673: {
		defindex: 673,
		image: "noisemaker_xmas.aaeab7ff07b6a16df8c44ce1e1f24499725e4679.png",
		name: "Noise Maker - Winter Holiday"
	},
	675: {
		defindex: 675,
		image: "xms_winter_joy_hat_demo.bb4eb80628e470fb42a705b956196aed4348534c.png",
		name: "Ebenezer",
		the: true
	},
	701: {
		defindex: 701,
		image: "luckyshot.4edc33dce64e4f76c94113169baea5a8bf01335c.png",
		name: "Lucky Shot",
		the: true
	},
	702: {
		defindex: 702,
		image: "all_reckoning_eagonn_spy.cb361972b3d48c4f3f9634c94a289c4cebe47a48.png",
		name: "Warsworn Helmet",
		the: true
	},
	703: {
		defindex: 703,
		image: "all_reckoning_bolgan_demo.0060148eaa66df11caecb2f1356a88831fdfbb46.png",
		name: "Bolgan",
		the: true
	},
	704: {
		defindex: 704,
		image: "all_reckoning_badge.d5d5f44aa6f7aba7ec4767a7bfc114574f68a424.png",
		name: "Bolgan Family Crest",
		the: true
	},
	707: {
		defindex: 707,
		image: "boombox.846e55d239dbf729b3f3ab5eb6fef3292ba3661e.png",
		name: "Boston Boom-Bringer",
		the: true
	},
	708: {
		defindex: 708,
		image: "djinn_lamp.76b9a582eba7dbc3a40d5983e75d9e959138cb92.png",
		name: "Aladdin's Private Reserve"
	},
	709: {
		defindex: 709,
		image: "eyephoto.ef273a68caea50aa6c86f27b9182c25bc7977df8.png",
		name: "Snapped Pupil",
		the: true
	},
	718: {
		defindex: 718,
		image: "jag_badge.86597df81a821b9d08d80b948df3ed3dbc51d2b2.png",
		name: "Merc Medal",
		the: true
	},
	719: {
		defindex: 719,
		image: "jag_bob_haircut.30e88c5a13fbcec379d18c83d19e7295b94ac443.png",
		name: "Battle Bob",
		the: true
	},
	720: {
		defindex: 720,
		image: "jag_shadow.4b496f1ea52575be62e34f8daf9349e7da05e523.png",
		name: "Bushman's Boonie",
		the: true
	},
	721: {
		defindex: 721,
		image: "morion.f67c835708dc34e5d960a72e60a8a2f8bdc2eecc.png",
		name: "Conquistador",
		the: true
	},
	722: {
		defindex: 722,
		image: "scout_prep_shirt.accbdd22191a4d42a27982a1306cd480c8685ceb.png",
		name: "Fast Learner",
		the: true
	},
	725: {
		defindex: 725,
		image: "mvm_ticket.09ace67431a4605c3ddc8593d62ccf957f65aeeb.png",
		name: "Tour of Duty Ticket"
	},
	727: {
		defindex: 727,
		image: "c_ava_roseknife_v.a4c74f0cbff68c2d8700273e56adeda4c4eb2018.png",
		name: "Black Rose",
		the: true
	},
	729: {
		defindex: 729,
		image: "shopping_bag.10340a6535442192a73ae9203e6cb735a578866b.png",
		name: "Mann Co. Store Package"
	},
	730: {
		defindex: 730,
		image: "c_dumpster_device.317580090616deba8e5976dfe3c0c5013a095485.png",
		name: "Beggar's Bazooka",
		the: true
	},
	731: {
		defindex: 731,
		image: "ds_can_grenades.ae104c55c767651cda91805b6fca37ef727d0845.png",
		name: "Captain's Cocktails",
		the: true
	},
	732: {
		defindex: 732,
		image: "ds_football_helmet.be1bec395e50d6dd9adedf7a590e1c993b831ba1.png",
		name: "Helmet Without a Home",
		the: true
	},
	733: {
		defindex: 733,
		image: "pet_robro.cfad84d8f2cb7638e97ffdc268ca4e502cc82dce.png",
		name: "RoBro 3000",
		the: true
	},
	734: {
		defindex: 734,
		image: "cowboyboots_soldier.5211120f4ea54d243bdeb979ab85df5f342f473f.png",
		name: "Teufort Tooth Kicker",
		the: true
	},
	735: {
		defindex: 735,
		image: "w_sapper.75e1eda80ea4ba1c12162cb8c562920d9a1deac6.png",
		name: "Sapper"
	},
	736: {
		defindex: 736,
		image: "w_sapper.75e1eda80ea4ba1c12162cb8c562920d9a1deac6.png",
		name: "Sapper"
	},
	737: {
		defindex: 737,
		image: "w_builder.a98ad31120795e8cceadd3040dd94b0ea08b5369.png",
		name: "Construction PDA"
	},
	738: {
		defindex: 738,
		image: "pet_balloonicorn.d027fc4970883344d6f8ecf9a6bfcfab5d46c6c2.png",
		name: "Balloonicorn",
		the: true
	},
	739: {
		defindex: 739,
		image: "c_lollichop.48a9d5aa006d1213817cda157ad57d251bab61f5.png",
		name: "Lollichop",
		the: true
	},
	740: {
		defindex: 740,
		image: "c_scorch_shot.cd6f4d583387d2910862e0c696f0e39b836db030.png",
		name: "Scorch Shot",
		the: true
	},
	741: {
		defindex: 741,
		image: "c_rainblower.4720610f5bbc9ebae4410148429b76b539c9f6c7.png",
		name: "Rainblower",
		the: true
	},
	743: {
		defindex: 743,
		image: "pyrovision_goggles_heavy.fb9dd8f3255e949238f1aa80e8087a38f1b6cbad.png",
		name: "Pyrovision Goggles"
	},
	744: {
		defindex: 744,
		image: "pyrovision_goggles_heavy.fb9dd8f3255e949238f1aa80e8087a38f1b6cbad.png",
		name: "Pyrovision Goggles"
	},
	745: {
		defindex: 745,
		image: "mtp_backpack.0dec30fa5f21cd94b24c76f2df425fc632e085f0.png",
		name: "Infernal Orchestrina",
		the: true
	},
	746: {
		defindex: 746,
		image: "mtp_bongos.30a2b9309c9e280d2ada433ecef3c328008f5f44.png",
		name: "Burning Bongos",
		the: true
	},
	751: {
		defindex: 751,
		image: "c_pro_smg.11974039568823e9ae23755827d3be434c3b290f.png",
		name: "Cleaner's Carbine",
		the: true
	},
	752: {
		defindex: 752,
		image: "c_pro_rifle.da74aa85cc1e7b657b2ac8499ba99f726044f797.png",
		name: "Hitman's Heatmaker",
		the: true
	},
	753: {
		defindex: 753,
		image: "pyro_candle.8f06a4026cf7b8ee00cb13f39a215f05548eef30.png",
		name: "Waxy Wayfinder",
		the: true
	},
	754: {
		defindex: 754,
		image: "shootmanyrobots_pyro.b5b8307105cd1e90faaac9ec66ff607d5bc7ed2f.png",
		name: "Scrap Pack",
		the: true
	},
	755: {
		defindex: 755,
		image: "engineer_chaps.98720e78fc3bc211907d481815ceeab31edfea88.png",
		name: "Texas Half-Pants",
		the: true
	},
	756: {
		defindex: 756,
		image: "crimecraft_helmet_demo.9fb1a334248d8141a3a1c62df355244e18bed898.png",
		name: "Bolt Action Blitzer",
		the: true
	},
	757: {
		defindex: 757,
		image: "heavy_boxingtowel.3377e51fca2c3ae1630bc42f6bc03c68959a0d04.png",
		name: "Toss-Proof Towel",
		the: true
	},
	758: {
		defindex: 758,
		image: "mvm_squad_surplus.016b1bd4ea8a12eb7d7ecf278f0d60ae6424cdda.png",
		name: "Squad Surplus Voucher"
	},
	759: {
		defindex: 759,
		image: "sniper_applearrow.c80c37d78add3525bfa955177c382deb79919fe5.png",
		name: "Fruit Shoot",
		the: true
	},
	760: {
		defindex: 760,
		image: "scout_headband.96e27a26260754a526ead32923135fe544fa40ad.png",
		name: "Front Runner",
		the: true
	},
	763: {
		defindex: 763,
		image: "spy_spats.53629cf51e2ad167cc47c6a7a67b744ae8cd7aee.png",
		name: "Sneaky Spats of Sneaking",
		the: true
	},
	764: {
		defindex: 764,
		image: "grfs_soldier.db74e1f826550763b5e9062e2838ea3c5422c2f2.png",
		name: "Cross-Comm Crash Helmet",
		the: true
	},
	765: {
		defindex: 765,
		image: "grfs_scout.1fcf6329598d9960d685d2858e4827e13536493d.png",
		name: "Cross-Comm Express",
		the: true
	},
	766: {
		defindex: 766,
		image: "grfs_sniper.3f23c9030b93ec8188fbcda1f501b4a270462f1f.png",
		name: "Doublecross-Comm",
		the: true
	},
	767: {
		defindex: 767,
		image: "qc_badge.bddb508153aa3db5564e3a5fda29fa069efa88d4.png",
		name: "Atomic Accolade",
		the: true
	},
	768: {
		defindex: 768,
		image: "qc_flask_demo.80ba8937e57dcfe6c8e5ad6a647c61f30d9b3159.png",
		name: "Professor's Pineapple",
		the: true
	},
	769: {
		defindex: 769,
		image: "qc_glove.fc2a4c0597c5250499366046c27d41a295e3cc99.png",
		name: "Quadwrangler",
		the: true
	},
	770: {
		defindex: 770,
		image: "medic_clipboard.b0c1d219bfbbfb1c935bc3ce5b00b5ea5f2a882a.png",
		name: "Surgeon's Side Satchel",
		the: true
	},
	771: {
		defindex: 771,
		image: "demo_chest_back.ad58d2fff59483710e154d086c65a7ca69b6fd74.png",
		name: "Liquor Locker",
		the: true
	},
	772: {
		defindex: 772,
		image: "c_pep_scattergun.52bd5d3c27f7916ae10912e5e1083e91d1eae44c.png",
		name: "Baby Face's Blaster"
	},
	773: {
		defindex: 773,
		image: "c_pep_pistol.ceeb65664adb047e035806c357754aa618c0ef22.png",
		name: "Pretty Boy's Pocket Pistol"
	},
	774: {
		defindex: 774,
		image: "sd_rocket_spy.d42dcc007ed4800f18df2c2651180aaad5dcc2bb.png",
		name: "Gentle Munitionne of Leisure",
		the: true
	},
	775: {
		defindex: 775,
		image: "c_pickaxe.0f6c70affe3902e80dea212930c3bc3e70e09580.png",
		name: "Escape Plan",
		the: true
	},
	776: {
		defindex: 776,
		image: "demo_parrot.a9d234cc0a0a9ea3e29126d322de430c045df61c.png",
		name: "Bird-Man of Aberdeen",
		the: true
	},
	777: {
		defindex: 777,
		image: "heavy_shirt.1d13bc4c7cb8437502e8befa232e9bd1deb93de0.png",
		name: "Apparatchik's Apparel",
		the: true
	},
	778: {
		defindex: 778,
		image: "medic_ushanka.b86ff5040ee1eef5268d2392466fec70e7f8cf29.png",
		name: "Gentleman's Ushanka",
		the: true
	},
	779: {
		defindex: 779,
		image: "pro_hat.59343d6eaf91f94d982227fc6ecbde957695a65e.png",
		name: "Liquidator's Lid"
	},
	780: {
		defindex: 780,
		image: "pep_hat.69f1a1c23c38c6ff6ac15fe2364df753f7f37a4d.png",
		name: "Fed-Fightin' Fedora",
		the: true
	},
	781: {
		defindex: 781,
		image: "pep_bag.528b0e857426462773fa65444ec45639dfb0ff73.png",
		name: "Dillinger's Duffel"
	},
	782: {
		defindex: 782,
		image: "spy_openjacket.f469e0d45253aa7e1af16799dd109cfbc507067b.png",
		name: "Business Casual",
		the: true
	},
	783: {
		defindex: 783,
		image: "pyro_hazmat.54315d8ca449d03c9916455ed2c76817f312b63d.png",
		name: "HazMat Headcase",
		the: true
	},
	784: {
		defindex: 784,
		image: "engineer_blueprints_back.a05e570a3d41687eb1bf4a2a01601fe339f6da2b.png",
		name: "Idea Tube",
		the: true
	},
	785: {
		defindex: 785,
		image: "as_robot_chicken_demo.f75f47a8c8e1ccd92d50b1d4b7991451b60dce1c.png",
		name: "Robot Chicken Hat"
	},
	786: {
		defindex: 786,
		image: "hero_academy_demo.b714beff7483a6909c7c86a8a864e9eea1b92adb.png",
		name: "Grenadier Helm",
		the: true
	},
	787: {
		defindex: 787,
		image: "hero_academy_pyro.0421bb41017ac40ed7a5effd436561fe09114321.png",
		name: "Tribal Bones",
		the: true
	},
	788: {
		defindex: 788,
		image: "hero_academy_scout.fd037b0eebb6fe315d0d4e9e100a0b6d84bd69f0.png",
		name: "Void Monk Hair",
		the: true
	},
	789: {
		defindex: 789,
		image: "hero_academy_spy.db2746750cce5e5de8e5ff3bced0534eb8ff4747.png",
		name: "Ninja Cowl",
		the: true
	},
	790: {
		defindex: 790,
		image: "gift_mystery.e0cf7028a586c4ce6c21935928035d928a888498.png",
		name: "What's in the Sandvich Box?"
	},
	791: {
		defindex: 791,
		image: "gift_mystery.e0cf7028a586c4ce6c21935928035d928a888498.png",
		name: "What's in the Companion Square Box?"
	},
	792: {
		defindex: 792,
		image: "fob_h_sniperrifle.4ab6e6d2a54fffd6429c7449a66d87f6313ffde0.png",
		name: "Silver Botkiller Sniper Rifle Mk.I"
	},
	793: {
		defindex: 793,
		image: "fob_h_minigun.8fec69a76ba6f799c28e1156ee2821446cb6db83.png",
		name: "Silver Botkiller Minigun Mk.I"
	},
	794: {
		defindex: 794,
		image: "fob_h_knife.50efc3912307edd5313337d4f82df8ed66b509ad.png",
		name: "Silver Botkiller Knife Mk.I"
	},
	795: {
		defindex: 795,
		image: "fob_h_wrench.26137085758cd765b3e2417dfd721e58568472f4.png",
		name: "Silver Botkiller Wrench Mk.I"
	},
	796: {
		defindex: 796,
		image: "fob_h_medigun.598403c0601edf7dfb41a6713f8ba78f3316a818.png",
		name: "Silver Botkiller Medi Gun Mk.I"
	},
	797: {
		defindex: 797,
		image: "fob_h_stickybomb.226973390bca6b603d846aa19b1cd13ff40f26e8.png",
		name: "Silver Botkiller Stickybomb Launcher Mk.I"
	},
	798: {
		defindex: 798,
		image: "fob_h_flamethrower.cdbcb4071b0333a84e78b32e5a29ec64c7d196d5.png",
		name: "Silver Botkiller Flame Thrower Mk.I"
	},
	799: {
		defindex: 799,
		image: "fob_h_scattergun.b41cc6c14195714a9b93f2d516690cc9d70f9c0e.png",
		name: "Silver Botkiller Scattergun Mk.I"
	},
	800: {
		defindex: 800,
		image: "fob_h_rocketlauncher.f5b960e2881aaa925b7b9595d4496aa6cb086eff.png",
		name: "Silver Botkiller Rocket Launcher Mk.I"
	},
	801: {
		defindex: 801,
		image: "fob_h_sniperrifle_gold.d2771cf37870f30964d1432ed32249a954ffa5a3.png",
		name: "Gold Botkiller Sniper Rifle Mk.I"
	},
	802: {
		defindex: 802,
		image: "fob_h_minigun_gold.f9fcc8a8775658b59287f21a5a74fff9362fee3a.png",
		name: "Gold Botkiller Minigun Mk.I"
	},
	803: {
		defindex: 803,
		image: "fob_h_knife_gold.d28e75f0fcf8b2f942c502da8699eef37528fa6c.png",
		name: "Gold Botkiller Knife Mk.I"
	},
	804: {
		defindex: 804,
		image: "fob_h_wrench_gold.c131a8d5b2521fccbbeecc9149bd12652c054dd1.png",
		name: "Gold Botkiller Wrench Mk.I"
	},
	805: {
		defindex: 805,
		image: "fob_h_medigun_gold.2e8120ceb66d421950ecf53ec088171dfa298762.png",
		name: "Gold Botkiller Medi Gun Mk.I"
	},
	806: {
		defindex: 806,
		image: "fob_h_stickybomb_gold.8bd8ef5f75a6b27da2e93e02cb65a7fffbcf7066.png",
		name: "Gold Botkiller Stickybomb Launcher Mk.I"
	},
	807: {
		defindex: 807,
		image: "fob_h_flamethrower_gold.69e6bd2d0a8b856abd88f1de44c5e85a07537d8b.png",
		name: "Gold Botkiller Flame Thrower Mk.I"
	},
	808: {
		defindex: 808,
		image: "fob_h_scattergun_gold.7ca57e19492b513c8a0c88d901eeb6ca7120ead4.png",
		name: "Gold Botkiller Scattergun Mk.I"
	},
	809: {
		defindex: 809,
		image: "fob_h_rocketlauncher_gold.cd998ae33cc7db7524a8345b3059e16f51549a42.png",
		name: "Gold Botkiller Rocket Launcher Mk.I"
	},
	810: {
		defindex: 810,
		image: "w_sd_sapper.cb93622110a3d16d4b87dec54cc56720d60df284.png",
		name: "Red-Tape Recorder",
		the: true
	},
	811: {
		defindex: 811,
		image: "c_canton.f8f41fbe921d4fd43b936eae81d3a215703f733e.png",
		name: "Huo-Long Heater",
		the: true
	},
	812: {
		defindex: 812,
		image: "c_sd_cleaver.de739c10ace3dfdf62c9bb70f6b5bcda5b894b79.png",
		name: "Flying Guillotine",
		the: true
	},
	813: {
		defindex: 813,
		image: "c_sd_neonsign.0161b268a512b48f1f3f8c0ee07a9e9632afbf9e.png",
		name: "Neon Annihilator",
		the: true
	},
	814: {
		defindex: 814,
		image: "sd_shirt_sniper.f4de164d68ebbd76f078a7c3aa09ec37fc529c17.png",
		name: "Triad Trinket",
		the: true
	},
	815: {
		defindex: 815,
		image: "sd_tattoos_scout.38c0a0517e3721a1541b718dbf25cbb953b3d3a0.png",
		name: "Champ Stamp",
		the: true
	},
	816: {
		defindex: 816,
		image: "sd_glasses.402304a948877617c53c75881df9150f8bc015b3.png",
		name: "Marxman",
		the: true
	},
	817: {
		defindex: 817,
		image: "sd_helm_demo.16c20bf8e4e37c0c920c07582766717498f481e5.png",
		name: "Human Cannonball",
		the: true
	},
	818: {
		defindex: 818,
		image: "awes_badge.2f7695ea32310aefd03ef9a3a73994f405f98a6a.png",
		name: "Awesomenauts Badge"
	},
	819: {
		defindex: 819,
		image: "awes_hat.dc62985694162af799961441845e31565d348456.png",
		name: "Lone Star",
		the: true
	},
	820: {
		defindex: 820,
		image: "awes_jetpack.e6161acb1c5d60b5962f011771dbdb55baa414a3.png",
		name: "Russian Rocketeer",
		the: true
	},
	821: {
		defindex: 821,
		image: "mustachehat.a46ad2f9170bdd72f2f4d84a1e78758278309bb3.png",
		name: "Soviet Gentleman",
		the: true
	},
	823: {
		defindex: 823,
		image: "engineer_pocketcat.54d57bd212c26492f9642018f39a4e9ad8942c9e.png",
		name: "Pocket Purrer",
		the: true
	},
	824: {
		defindex: 824,
		image: "sniper_pocketkoala.0c0d67fc683394e3e7508916eab5f2f12d7f52b8.png",
		name: "Koala Compact",
		the: true
	},
	825: {
		defindex: 825,
		image: "spy_cardhat.6e3e93b0daa8260125d5f032fe98e6711b04cb29.png",
		name: "Hat of Cards"
	},
	826: {
		defindex: 826,
		image: "medic_gasmask.9a5c2700cf9ec26c9bfb0350a7e9e0130ae75d1a.png",
		name: "Medi-Mask"
	},
	827: {
		defindex: 827,
		image: "scout_trackjacket.345e7e660d008fbb2897986d15ec59ce28b2a653.png",
		name: "Track Terrorizer",
		the: true
	},
	828: {
		defindex: 828,
		image: "archimedes.97345e4cafc5611795253fb2ebc42152624d83e2.png",
		name: "Archimedes"
	},
	829: {
		defindex: 829,
		image: "soldier_warpig.af29502b5f44322c182fabc719f9dd96cf00d93a.png",
		name: "War Pig",
		the: true
	},
	830: {
		defindex: 830,
		image: "demo_beardpipe.ea8c066ea739f356401aa906eade3bf87c710535.png",
		name: "Bearded Bombardier",
		the: true
	},
	831: {
		defindex: 831,
		image: "w_sd_sapper.cb93622110a3d16d4b87dec54cc56720d60df284.png",
		name: "Red-Tape Recorder",
		the: true
	},
	832: {
		defindex: 832,
		image: "c_canton.f8f41fbe921d4fd43b936eae81d3a215703f733e.png",
		name: "Huo-Long Heater",
		the: true
	},
	833: {
		defindex: 833,
		image: "c_sd_cleaver.de739c10ace3dfdf62c9bb70f6b5bcda5b894b79.png",
		name: "Flying Guillotine",
		the: true
	},
	834: {
		defindex: 834,
		image: "c_sd_neonsign.0161b268a512b48f1f3f8c0ee07a9e9632afbf9e.png",
		name: "Neon Annihilator",
		the: true
	},
	835: {
		defindex: 835,
		image: "sd_shirt_sniper.f4de164d68ebbd76f078a7c3aa09ec37fc529c17.png",
		name: "Triad Trinket",
		the: true
	},
	836: {
		defindex: 836,
		image: "sd_tattoos_scout.38c0a0517e3721a1541b718dbf25cbb953b3d3a0.png",
		name: "Champ Stamp",
		the: true
	},
	837: {
		defindex: 837,
		image: "sd_glasses.402304a948877617c53c75881df9150f8bc015b3.png",
		name: "Marxman",
		the: true
	},
	838: {
		defindex: 838,
		image: "sd_helm_demo.16c20bf8e4e37c0c920c07582766717498f481e5.png",
		name: "Human Cannonball",
		the: true
	},
	839: {
		defindex: 839,
		image: "shopping_bag.10340a6535442192a73ae9203e6cb735a578866b.png",
		name: "Mann Co. Store Package"
	},
	840: {
		defindex: 840,
		image: "robo_ushanka.289358473e0680bd844a9f00a02a144ec035b2e3.png",
		name: "U-clank-a",
		the: true
	},
	841: {
		defindex: 841,
		image: "robo_fedora.411d9f9d00ef7b0fbbec0025152e0943d1923a5f.png",
		name: "Stealth Steeler",
		the: true
	},
	842: {
		defindex: 842,
		image: "pyrobo_backpack.3b05e2b6975a405e069921df2ef8d84513835faa.png",
		name: "Pyrobotics Pack",
		the: true
	},
	843: {
		defindex: 843,
		image: "robo_backpack.bb8385ed36fdb8500f756bab2f51cb84fd02459b.png",
		name: "Medic Mech-bag",
		the: true
	},
	844: {
		defindex: 844,
		image: "robot_helmet.a8fd9c5fdced7fc3dc7b31dcdbf53b5734e5a1fd.png",
		name: "Tin Pot",
		the: true
	},
	845: {
		defindex: 845,
		image: "battery_grenade.bc24075f2b92c6c0fcc3271df3ac189e30cb4318.png",
		name: "Battery Bandolier",
		the: true
	},
	846: {
		defindex: 846,
		image: "robo_cap.90da1993e385954e4ec5900d0e7167ff948c8dbd.png",
		name: "Robot Running Man",
		the: true
	},
	847: {
		defindex: 847,
		image: "robo_sniper_hat.c07a4143373697ff97740b52b2a457d093b6f915.png",
		name: "Bolted Bushman",
		the: true
	},
	848: {
		defindex: 848,
		image: "robo_engy_hat.0b0d64ee0200ddbce1f567b6076e76d54c9d0f77.png",
		name: "Tin-1000",
		the: true
	},
	850: {
		defindex: 850,
		image: "w_minigun.c8dd004e4691ebde7af11d564bf2717468e485ff.png",
		name: "Deflector"
	},
	851: {
		defindex: 851,
		image: "c_csgo_awp.8480ff27af59a4f8491c48b504e244d3f10c31b2.png",
		name: "AWPer Hand",
		the: true
	},
	852: {
		defindex: 852,
		image: "cigar.0b2a633c64f69984093be6916d58574cbac74a42.png",
		name: "Soldier's Stogie"
	},
	853: {
		defindex: 853,
		image: "xcom_flattop_engineer.b3d37a55ddce69b37655ef7172d4db912b520bf9.png",
		name: "Crafty Hair",
		the: true
	},
	854: {
		defindex: 854,
		image: "xcom_sectoid_mask.b761063728bfaab8c7b46f6153a1e616594ecde4.png",
		name: "Area 451"
	},
	855: {
		defindex: 855,
		image: "xcom_badge.cf1c559fd6f65e7d5e7eb4943b29018f09132c06.png",
		name: "Vigilant Pin",
		the: true
	},
	856: {
		defindex: 856,
		image: "pyro_fireworksbag.d0867a3da48326c4b9731d205cc5316cb8f93c3e.png",
		name: "Pyrotechnic Tote",
		the: true
	},
	857: {
		defindex: 857,
		image: "scout_henchboy_belt.d9136a129e6d6342eb04e1d392769ea84297571c.png",
		name: "Flunkyware"
	},
	858: {
		defindex: 858,
		image: "scout_henchboy_hat.ea499d2e990b47586702f92cbe6090f22ab2315a.png",
		name: "Hanger-On Hood",
		the: true
	},
	859: {
		defindex: 859,
		image: "scout_henchboy_wings.9f4f9b829356868309bb270c63974a861d74d5bb.png",
		name: "Flight of the Monarch",
		the: true
	},
	863: {
		defindex: 863,
		image: "c_robo_sandwich.eae0f38e846f3e1a44e985976c97d4dbae784aac.png",
		name: "Robo-Sandvich",
		the: true
	},
	864: {
		defindex: 864,
		image: "3a_cube.58e7dbb1a39e374997ab030b43f75a8a3e11de92.png",
		name: "Friends Forever Companion Square Badge",
		the: true
	},
	865: {
		defindex: 865,
		image: "3a_badge.610a503695ee9201a29c2586d9ead64ea1bf57fe.png",
		name: "Triple A Badge",
		the: true
	},
	866: {
		defindex: 866,
		image: "coh_heavyhat.6bb8d2311283f650da7281dd0b89f1fc1e1e38be.png",
		name: "Heavy Artillery Officer's Cap",
		the: true
	},
	867: {
		defindex: 867,
		image: "coh_medichat.5805c25346dfa66e0772514730eee50b657e30e3.png",
		name: "Combat Medic's Crusher Cap",
		the: true
	},
	868: {
		defindex: 868,
		image: "coh_badge_sovjet.3c3b779de189e9b3a1437f136b76126dffee107a.png",
		name: "Heroic Companion Badge",
		the: true
	},
	869: {
		defindex: 869,
		image: "pumpkin_lantern_engineer.66ec2cb1ac0d36a4e4667cba4f34f5779819e0f4.png",
		name: "Rump-o'-Lantern",
		the: true
	},
	872: {
		defindex: 872,
		image: "spy_dishonored.643e2651878b106547430e548fb4f0db4850dd11.png",
		name: "Lacking Moral Fiber Mask",
		the: true
	},
	873: {
		defindex: 873,
		image: "dishonored_badge.180b97de780296ff3de1e14f334c665d4a4a23a0.png",
		name: "Whale Bone Charm",
		the: true
	},
	874: {
		defindex: 874,
		image: "tw_kingcape.34590c5eb5c022d903191aef868343c00a31dddf.png",
		name: "King of Scotland Cape",
		the: true
	},
	875: {
		defindex: 875,
		image: "tw_shogun_demo.02a067a71dc034e0f82ae0189812585b0cda1b69.png",
		name: "Menpo",
		the: true
	},
	876: {
		defindex: 876,
		image: "tw_doghat_heavy.af9198fd49f6423e4b2e0b8180ac9101d7ff00bd.png",
		name: "K-9 Mane",
		the: true
	},
	877: {
		defindex: 877,
		image: "tw_shako.6ac58041db2f3e9534352d57d113dc522a814268.png",
		name: "Stovepipe Sniper Shako",
		the: true
	},
	878: {
		defindex: 878,
		image: "tw_coat_medic_necktie.9593b763ec4225a6cdc1b910af0b1e2f366ed1e8.png",
		name: "Foppish Physician",
		the: true
	},
	879: {
		defindex: 879,
		image: "tw_coat_spy.1d5af59e93e167a173e32fc22ceb50a813c75411.png",
		name: "Distinguished Rogue",
		the: true
	},
	880: {
		defindex: 880,
		image: "c_tw_eagle.4b63d3eecec4dc4300c24b1825a25f2670e1bf64.png",
		name: "Freedom Staff",
		the: true
	},
	881: {
		defindex: 881,
		image: "fob_h_sniperrifle_rust.53135399b8130dc40e89e476466691c7eed0ab65.png",
		name: "Rust Botkiller Sniper Rifle Mk.I"
	},
	882: {
		defindex: 882,
		image: "fob_h_minigun_rust.87701ba331000fe3beb8302d2d5e028150660946.png",
		name: "Rust Botkiller Minigun Mk.I"
	},
	883: {
		defindex: 883,
		image: "fob_h_knife_rust.71f9dadd272eeafdd348337d5b3eedd0f5553a16.png",
		name: "Rust Botkiller Knife Mk.I"
	},
	884: {
		defindex: 884,
		image: "fob_h_wrench_rust.f9dd882d7c67b170946cbbd17ac1449036785464.png",
		name: "Rust Botkiller Wrench Mk.I"
	},
	885: {
		defindex: 885,
		image: "fob_h_medigun_rust.440050a40daa3320984d767cd781e67a4840c335.png",
		name: "Rust Botkiller Medi Gun Mk.I"
	},
	886: {
		defindex: 886,
		image: "fob_h_stickybomb_rust.1e12bc0e42ba654e372ee8d763121ed50628ff7e.png",
		name: "Rust Botkiller Stickybomb Launcher Mk.I"
	},
	887: {
		defindex: 887,
		image: "fob_h_flamethrower_rust.b9f22ea1c17ad3da84b35e48d9696a6af82ddb12.png",
		name: "Rust Botkiller Flame Thrower Mk.I"
	},
	888: {
		defindex: 888,
		image: "fob_h_scattergun_rust.772868e26e1a83b295c706315b8c4c3d1cd3e20c.png",
		name: "Rust Botkiller Scattergun Mk.I"
	},
	889: {
		defindex: 889,
		image: "fob_h_rocketlauncher_rust.0998ccd2e8a4b3e657f5300751a006f4fcad9bd8.png",
		name: "Rust Botkiller Rocket Launcher Mk.I"
	},
	890: {
		defindex: 890,
		image: "fob_h_sniperrifle_blood.05691190dbf0ec7c2d2310455dbd119ed8a83a25.png",
		name: "Blood Botkiller Sniper Rifle Mk.I"
	},
	891: {
		defindex: 891,
		image: "fob_h_minigun_blood.889e01c58ddcae5c44714759a8ae1c3a671d189c.png",
		name: "Blood Botkiller Minigun Mk.I"
	},
	892: {
		defindex: 892,
		image: "fob_h_knife_blood.7564aaa1177e45a5ab13e3c240269c6dd64191cd.png",
		name: "Blood Botkiller Knife Mk.I"
	},
	893: {
		defindex: 893,
		image: "fob_h_wrench_blood.8de961d98228be7c2f5e586bfe065f5b2e065ced.png",
		name: "Blood Botkiller Wrench Mk.I"
	},
	894: {
		defindex: 894,
		image: "fob_h_medigun_blood.6a85c98de7a7427dc7435ead4c05313156214a4a.png",
		name: "Blood Botkiller Medi Gun Mk.I"
	},
	895: {
		defindex: 895,
		image: "fob_h_stickybomb_blood.a7751d07967d7c056076baf9b99d688bcbab2072.png",
		name: "Blood Botkiller Stickybomb Launcher Mk.I"
	},
	896: {
		defindex: 896,
		image: "fob_h_flamethrower_blood.9f77e2ffeac75f548c79c366fcbbd55997257fcb.png",
		name: "Blood Botkiller Flame Thrower Mk.I"
	},
	897: {
		defindex: 897,
		image: "fob_h_scattergun_blood.6d9d43d65189f266e4080998639c1237b30ab183.png",
		name: "Blood Botkiller Scattergun Mk.I"
	},
	898: {
		defindex: 898,
		image: "fob_h_rocketlauncher_blood.11d8fa923e2ad6070044f02bab2bd5edfe82af3e.png",
		name: "Blood Botkiller Rocket Launcher Mk.I"
	},
	899: {
		defindex: 899,
		image: "fob_h_sniperrifle_diamond_black.e7cb03dcfe69a7f59850dfb5fe23039a31d9e306.png",
		name: "Carbonado Botkiller Sniper Rifle Mk.I"
	},
	900: {
		defindex: 900,
		image: "fob_h_minigun_diamond_black.225171ad921c38d10800cb249ee15583fe3e01d3.png",
		name: "Carbonado Botkiller Minigun Mk.I"
	},
	901: {
		defindex: 901,
		image: "fob_h_knife_diamond_black.bf4a1b69a3c407c6e3b029f825f1a1273c3b0a8d.png",
		name: "Carbonado Botkiller Knife Mk.I"
	},
	902: {
		defindex: 902,
		image: "fob_h_wrench_diamond_black.50364b863f92ee90b0beaf8b8a785dffeaefade4.png",
		name: "Carbonado Botkiller Wrench Mk.I"
	},
	903: {
		defindex: 903,
		image: "fob_h_medigun_diamond_black.bd5350bd5d3646d71eaf119189d69f1c85f9b372.png",
		name: "Carbonado Botkiller Medi Gun Mk.I"
	},
	904: {
		defindex: 904,
		image: "fob_h_stickybomb_diamond_black.14355f16b3810c722f9f3da6770a87e84c03c412.png",
		name: "Carbonado Botkiller Stickybomb Launcher Mk.I"
	},
	905: {
		defindex: 905,
		image: "fob_h_flamethrower_diamond_black.5862fe02afb329a1df4bb6f94688636787a7dba3.png",
		name: "Carbonado Botkiller Flame Thrower Mk.I"
	},
	906: {
		defindex: 906,
		image: "fob_h_scattergun_diamond_black.5c915d904d00e539ccf147277366b1727f22a57b.png",
		name: "Carbonado Botkiller Scattergun Mk.I"
	},
	907: {
		defindex: 907,
		image: "fob_h_rocketlauncher_diamond_black.9d89fef88892a87723e4b697c7972e9fd177403b.png",
		name: "Carbonado Botkiller Rocket Launcher Mk.I"
	},
	908: {
		defindex: 908,
		image: "fob_h_sniperrifle_diamond.2fe7cc9914d3e27c3ee18a4b52be43a6bfc3b92d.png",
		name: "Diamond Botkiller Sniper Rifle Mk.I"
	},
	909: {
		defindex: 909,
		image: "fob_h_minigun_diamond.fc452a36653e4fc630f22fc36f211bc998d0747c.png",
		name: "Diamond Botkiller Minigun Mk.I"
	},
	910: {
		defindex: 910,
		image: "fob_h_knife_diamond.ad27a622fd019e2686536a3b0ad0e367b35b9505.png",
		name: "Diamond Botkiller Knife Mk.I"
	},
	911: {
		defindex: 911,
		image: "fob_h_wrench_diamond.3ade551d48a16ec6c61a7881670d27ba2af8fbc9.png",
		name: "Diamond Botkiller Wrench Mk.I"
	},
	912: {
		defindex: 912,
		image: "fob_h_medigun_diamond.ae05677e3a0502821711318e9a10f88512a0071a.png",
		name: "Diamond Botkiller Medi Gun Mk.I"
	},
	913: {
		defindex: 913,
		image: "fob_h_stickybomb_diamond.ff1d28ee9d93fbeb74fdc8dc41c6b4f5b038da2f.png",
		name: "Diamond Botkiller Stickybomb Launcher Mk.I"
	},
	914: {
		defindex: 914,
		image: "fob_h_flamethrower_diamond.02fa5b98ef91d5e2fb35d5f5cb1ea02b7ca48ea4.png",
		name: "Diamond Botkiller Flame Thrower Mk.I"
	},
	915: {
		defindex: 915,
		image: "fob_h_scattergun_diamond.4feee1106ffe4064f4aa281fea8bdeb694b582ad.png",
		name: "Diamond Botkiller Scattergun Mk.I"
	},
	916: {
		defindex: 916,
		image: "fob_h_rocketlauncher_diamond.f3d15d7d1ddf5d1c403a9641807715392bf813ab.png",
		name: "Diamond Botkiller Rocket Launcher Mk.I"
	},
	917: {
		defindex: 917,
		image: "sniper_owl.be456f32546c746671298c98479e751df484a5b7.png",
		name: "Sir Hootsalot"
	},
	918: {
		defindex: 918,
		image: "engineer_brain.c5af893b4b40941d88dfe98be9019307189484a3.png",
		name: "Master Mind"
	},
	919: {
		defindex: 919,
		image: "spy_scarecrowface.ef54f438aa574518bcf84bff42fd5466f675d820.png",
		name: "Scarecrow",
		the: true
	},
	920: {
		defindex: 920,
		image: "witchhat.ded89bf1dc2ab883234ea920cdfde73628c28e59.png",
		name: "Crone's Dome",
		the: true
	},
	921: {
		defindex: 921,
		image: "executionerhood_medic.20ad21d171cb0b3d8491e5ab52844e4a5a189d29.png",
		name: "Executioner",
		the: true
	},
	922: {
		defindex: 922,
		image: "demo_grenade_skulls.bd629ee344648def1f27b33fa381f7772b8a2fd9.png",
		name: "Bonedolier",
		the: true
	},
	923: {
		defindex: 923,
		image: "pyro_brainhead.93ae8085610bdc998ffa10273456935fcc8e7542.png",
		name: "Plutonidome",
		the: true
	},
	924: {
		defindex: 924,
		image: "scout_halloweenshoes.a86d53349ef6cdaac9b182e3709a30b7ee1279e8.png",
		name: "Spooky Shoes",
		the: true
	},
	925: {
		defindex: 925,
		image: "halloweenjacket.6240edc8b22364e2a4be193f7427148600b4b9bb.png",
		name: "Spooky Sleeves",
		the: true
	},
	926: {
		defindex: 926,
		image: "soldier_zipperhead.6f94c88ee4adead5eff4baa7a888ccedfb3bed05.png",
		name: "Zipperface",
		the: true
	},
	927: {
		defindex: 927,
		image: "hwn_pet_balloon.6d2808e780addcf48abe6d70338dc846ac579204.png",
		name: "Boo Balloon",
		the: true
	},
	928: {
		defindex: 928,
		image: "gift_mystery.e0cf7028a586c4ce6c21935928035d928a888498.png",
		name: "What's in the Portal 2 Soundtrack Box?"
	},
	929: {
		defindex: 929,
		image: "hwn_ghost_pj.4131385156d96a745c5f0745c0ea70867cdb5bfe.png",
		name: "Unknown Monkeynaut",
		the: true
	},
	930: {
		defindex: 930,
		image: "heavy_fairy_tutu.517e1f5879e2c7cd4c51e1f743b74f0ea1d496bb.png",
		name: "Grand Duchess Tutu",
		the: true
	},
	931: {
		defindex: 931,
		image: "heavy_fairy_wings.0b62ab9967da9e5c81e66034500e4a1650bf3e61.png",
		name: "Grand Duchess Fairy Wings",
		the: true
	},
	932: {
		defindex: 932,
		image: "heavy_fairy_tiara.4076bf560424d5da43db11614e309dc6492c3224.png",
		name: "Grand Duchess Tiara",
		the: true
	},
	933: {
		defindex: 933,
		image: "c_p2rec.080faad55be425fc6c623c77e714782d48d335a5.png",
		name: "Ap-Sap",
		the: true
	},
	934: {
		defindex: 934,
		image: "hwn_pet_ghost.e946936505b2dea3df7bf72fe87498e638ce1e2f.png",
		name: "Dead Little Buddy",
		the: true
	},
	935: {
		defindex: 935,
		image: "demo_bonehat.f89d96df08bfbcb8a6bf1009c6d61434d5b1035d.png",
		name: "Voodoo JuJu (Slight Return)",
		the: true
	},
	936: {
		defindex: 936,
		image: "hwn_spy_priest.66a1800ce2e0200853f7fa1aa1f6ce3e5494f9d5.png",
		name: "Exorcizor",
		the: true
	},
	937: {
		defindex: 937,
		image: "hwn_pyro_spookyhood.a66f51c4cf3ea37ac4f86a2a92cb32938e83a95f.png",
		name: "Wraith Wrap",
		the: true
	},
	938: {
		defindex: 938,
		image: "hwn_pyro_coffinpack.94200426ff8c69a1fd1c9d173e232235c03e49d6.png",
		name: "Coffin Kit",
		the: true
	},
	939: {
		defindex: 939,
		image: "c_skullbat.6c0934b8f63364506ff0cd142c6cf38962eabcae.png",
		name: "Bat Outta Hell",
		the: true
	},
	941: {
		defindex: 941,
		image: "merasmus_skull.13619009044fe0d0de542804733f025bc9d2491e.png",
		name: "Skull Island Topper",
		the: true
	},
	942: {
		defindex: 942,
		image: "all_scrib_m_demo.bd12c91422aa42f4bd000f897fa45efd61fb14b9.png",
		name: "Cockfighter",
		the: true
	},
	943: {
		defindex: 943,
		image: "hm_badge.fd1f23d62f30a055a9a660cdd4d065cab5e4a4e9.png",
		name: "Hitt Mann Badge",
		the: true
	},
	944: {
		defindex: 944,
		image: "hm_disguisehat_demo.11c3fb3e6430fafd41cd77b92894284213427ff1.png",
		name: "That '70s Chapeau"
	},
	945: {
		defindex: 945,
		image: "hm_cap.560752ff608a3267d1348435b8613c674935389e.png",
		name: "Chief Constable",
		the: true
	},
	946: {
		defindex: 946,
		image: "hm_shirt.9fd1eb89f22b3405165eaaae7d99ec035fc79428.png",
		name: "Siberian Sophisticate",
		the: true
	},
	947: {
		defindex: 947,
		image: "v_hm_watch.f858ca6c1368b93570d630d2a9b39bed37584f1e.png",
		name: "Qu\xE4ckenbirdt",
		the: true
	},
	948: {
		defindex: 948,
		image: "hm_duck_demo.ede45573b1cd7ddea2f71b59f54ada463f497f38.png",
		name: "Deadliest Duckling",
		the: true
	},
	949: {
		defindex: 949,
		image: "pyro_rocks_hat.bf5d027a2b3bda273abc40c43f8ed9d4bdf9245a.png",
		name: "DethKapp",
		the: true
	},
	950: {
		defindex: 950,
		image: "pyro_rocks_mask.30eef2c649be0f8dc1ecc3bf18ea59dadc53bdc8.png",
		name: "Nose Candy"
	},
	951: {
		defindex: 951,
		image: "pyro_rocks_spikes.807d92ffebb7a4d26cc91a6a0ee795c3f146c75a.png",
		name: "Rail Spikes"
	},
	952: {
		defindex: 952,
		image: "heavy_hockeyhair.abcf6f92554193f82d504d6846243a04152d6641.png",
		name: "Brock's Locks"
	},
	955: {
		defindex: 955,
		image: "tuxxy_demo.28d634e98552c8ff25f40e551d4edf30cae59c2c.png",
		name: "Tuxxy",
		the: true
	},
	956: {
		defindex: 956,
		image: "all_fs_badge.711e6afe10a3257de8794b598cf10be1c003c764.png",
		name: "Faerie Solitaire Pin"
	},
	957: {
		defindex: 957,
		image: "fob_e_sniperrifle.c477df5b0cdd9d55e83a23367bf3233cf3ed822d.png",
		name: "Silver Botkiller Sniper Rifle Mk.II"
	},
	958: {
		defindex: 958,
		image: "fob_e_minigun.f63eebf1262f43735451d8faf457434b075fdbc2.png",
		name: "Silver Botkiller Minigun Mk.II"
	},
	959: {
		defindex: 959,
		image: "fob_e_knife.43b18001505f20d0b442cfe0d1cb2b4c8f7f825e.png",
		name: "Silver Botkiller Knife Mk.II"
	},
	960: {
		defindex: 960,
		image: "fob_e_wrench.e22a29179256ba2ceb92ac8327ce6e883c60452b.png",
		name: "Silver Botkiller Wrench Mk.II"
	},
	961: {
		defindex: 961,
		image: "fob_e_medigun.4ef1f02048f81e7d0e06e2a575977634432314aa.png",
		name: "Silver Botkiller Medi Gun Mk.II"
	},
	962: {
		defindex: 962,
		image: "fob_e_stickybomb.5728c4467cd8c952cdf5e9b0ce6b287bcb7e10a5.png",
		name: "Silver Botkiller Stickybomb Launcher Mk.II"
	},
	963: {
		defindex: 963,
		image: "fob_e_flamethrower.5faa9a6f07337176e896e72823b050ea8eb69032.png",
		name: "Silver Botkiller Flame Thrower Mk.II"
	},
	964: {
		defindex: 964,
		image: "fob_e_scattergun.31cba7e9f260d1ca05d128c50cf8e1b9949fe14e.png",
		name: "Silver Botkiller Scattergun Mk.II"
	},
	965: {
		defindex: 965,
		image: "fob_e_rocketlauncher.18e99027116a023607367f23fd01045ec8e9cfc2.png",
		name: "Silver Botkiller Rocket Launcher Mk.II"
	},
	966: {
		defindex: 966,
		image: "fob_e_sniperrifle_gold.b384acaa681188fd31c069ce645933914c8fee3a.png",
		name: "Gold Botkiller Sniper Rifle Mk.II"
	},
	967: {
		defindex: 967,
		image: "fob_e_minigun_gold.146137e0ec137257db7f7ca79573c11eda287deb.png",
		name: "Gold Botkiller Minigun Mk.II"
	},
	968: {
		defindex: 968,
		image: "fob_e_knife_gold.b235996aca9db216cf8bbfd2af5c75c65298eb6a.png",
		name: "Gold Botkiller Knife Mk.II"
	},
	969: {
		defindex: 969,
		image: "fob_e_wrench_gold.dfb5ebf0127b4ac4240530500ceb205e04a5f855.png",
		name: "Gold Botkiller Wrench Mk.II"
	},
	970: {
		defindex: 970,
		image: "fob_e_medigun_gold.8963617849800a594b3f4be02441a8b07ed8a8a1.png",
		name: "Gold Botkiller Medi Gun Mk.II"
	},
	971: {
		defindex: 971,
		image: "fob_e_stickybomb_gold.82c3ca9490c961f7eb9809f44298d0a0e143ea50.png",
		name: "Gold Botkiller Stickybomb Launcher Mk.II"
	},
	972: {
		defindex: 972,
		image: "fob_e_flamethrower_gold.47e0484e027ace66e0a7b6f0e7895ae0f926e9df.png",
		name: "Gold Botkiller Flame Thrower Mk.II"
	},
	973: {
		defindex: 973,
		image: "fob_e_scattergun_gold.baa2d0d14293ba39e577e9dd2919b4f677d56977.png",
		name: "Gold Botkiller Scattergun Mk.II"
	},
	974: {
		defindex: 974,
		image: "fob_e_rocketlauncher_gold.817d3fbdcd32f802de672db8968ed53585974ee7.png",
		name: "Gold Botkiller Rocket Launcher Mk.II"
	},
	976: {
		defindex: 976,
		image: "winter_pyro_mask.1c07eac030566e0ae03e1413998d093c79ceaf95.png",
		name: "Winter Wonderland Wrap",
		the: true
	},
	977: {
		defindex: 977,
		image: "spy_winterjacket.81334284b18f39541961c7bd003f1c324501b3df.png",
		name: "Cut Throat Concierge",
		the: true
	},
	978: {
		defindex: 978,
		image: "medic_wintercoat_s01.3a870d0623a581405d054caf7c7ac31a14d198f6.png",
		name: "Der Wintermantel"
	},
	979: {
		defindex: 979,
		image: "demo_kilt.1de2604e298dd1f05c0271ac6f73e22597ea9363.png",
		name: "Cool Breeze",
		the: true
	},
	980: {
		defindex: 980,
		image: "soldier_skihat.bbea3ae6a05e437398a52aaab72925c9502aae10.png",
		name: "Soldier's Slope Scopers"
	},
	981: {
		defindex: 981,
		image: "winter_sniper_hood.751cdfa91f9974b64204a083b10c8ad9e8f5a3d0.png",
		name: "Cold Killer",
		the: true
	},
	982: {
		defindex: 982,
		image: "hawaiian_shirt.9ecd33389553e8fee6dc3e5b3cf9f6a3980cb471.png",
		name: "Doc's Holiday"
	},
	983: {
		defindex: 983,
		image: "scout_gloves_leather_open.7ed1004dcd8112922dcde53ec70731872f66a041.png",
		name: "Digit Divulger",
		the: true
	},
	984: {
		defindex: 984,
		image: "all_earmuffs_style1.563d793eb6bdcf4bb0f67a4b7561ee81f2722bb5.png",
		name: "Tough Stuff Muffs"
	},
	985: {
		defindex: 985,
		image: "skullet.f455e6c360bef5737aff853db7c46ce53b3b1b7f.png",
		name: "Heavy's Hockey Hair"
	},
	986: {
		defindex: 986,
		image: "winter_sideburns.1001fc5c07a71f0d9b66dd6c54b6494441f80752.png",
		name: "Mutton Mann",
		the: true
	},
	987: {
		defindex: 987,
		image: "all_winter_scarf_engy.e36b59ec9141662f587a8e014648542fd6b48d74.png",
		name: "Merc's Muffler",
		the: true
	},
	988: {
		defindex: 988,
		image: "engineer_barnstormer_s01.36fa7240418c34865251ed6b252bc6710d08ab2a.png",
		name: "Barnstormer",
		the: true
	},
	989: {
		defindex: 989,
		image: "heavy_carl_hair.b3e0bf7496f39f012e7211072133c7e32bd32cc6.png",
		name: "Carl",
		the: true
	},
	990: {
		defindex: 990,
		image: "heavy_carl_flops.46fcb18404f98ad35975eac6b5e9a1159e5d8fc2.png",
		name: "Aqua Flops"
	},
	991: {
		defindex: 991,
		image: "heavy_carl_medallion.a02a4e616fe8eddb930e0d80322700f91cd1334d.png",
		name: "Hunger Force",
		the: true
	},
	992: {
		defindex: 992,
		image: "all_wreath_badge.19b5275480527bb55358fb41415eb47140e8998d.png",
		name: "Smissmas Wreath"
	},
	993: {
		defindex: 993,
		image: "xms_antlers_demo.a5897170c581ba787a27a4f34f0d3d50e66f0243.png",
		name: "Antlers"
	},
	995: {
		defindex: 995,
		image: "pet_reinballoonicorn.7b0b3cf405bfcdf66b9f8b6bbbf661800182dfc5.png",
		name: "Reindoonicorn",
		the: true
	},
	996: {
		defindex: 996,
		image: "c_demo_cannon.3a27e7904390d6352a8f47781326cbafb58e9166.png",
		name: "Loose Cannon",
		the: true
	},
	997: {
		defindex: 997,
		image: "c_tele_shotgun.a7600619e5cf5ecc458248ad25d17a40bcb58560.png",
		name: "Rescue Ranger",
		the: true
	},
	998: {
		defindex: 998,
		image: "c_medigun_defense.0222b2d5b4978563d40cc1e2d344153693d1a653.png",
		name: "Vaccinator",
		the: true
	},
	999: {
		defindex: 999,
		image: "c_holymackerel_xmas.743493f16f3629fe0abb16bd846ecf10651c7e38.png",
		name: "Festive Holy Mackerel",
		the: true,
		festive: true
	},
	1000: {
		defindex: 1000,
		image: "c_fireaxe_pyro_xmas.fdeb729276d4f654e49b437941344cfbbf4d22f9.png",
		name: "Festive Axtinguisher",
		the: true,
		festive: true
	},
	1001: {
		defindex: 1001,
		image: "c_buffpack_xmas.7d9d3a49fa1d3194077973dcfc9fc76ac432aa1f.png",
		name: "Festive Buff Banner",
		the: true,
		festive: true
	},
	1002: {
		defindex: 1002,
		image: "c_sandwich_xmas.fbadcd2fac027a46ada72ad96322a7271c2b9ca3.png",
		name: "Festive Sandvich",
		the: true,
		festive: true
	},
	1003: {
		defindex: 1003,
		image: "c_ubersaw_xmas.6771383e1496d274941b8d85be975a95cc1eadf2.png",
		name: "Festive Ubersaw",
		the: true,
		festive: true
	},
	1004: {
		defindex: 1004,
		image: "c_frontierjustice_xmas.216ec7c31b60e11064592717e4d6cad64a734bc7.png",
		name: "Festive Frontier Justice",
		festive: true
	},
	1005: {
		defindex: 1005,
		image: "c_bow_xmas.dac8533939c23c106c46a67edf96f94f0be1afd2.png",
		name: "Festive Huntsman",
		the: true,
		festive: true
	},
	1006: {
		defindex: 1006,
		image: "c_ambassador_xmas.523f7fa4bea498d3bd23b755a483d7c1d03eb9bb.png",
		name: "Festive Ambassador",
		the: true,
		festive: true
	},
	1007: {
		defindex: 1007,
		image: "c_grenadelauncher_xmas.5b2c674c5f001b1b7befbe4bf333744406b053b2.png",
		name: "Festive Grenade Launcher",
		festive: true
	},
	1008: {
		defindex: 1008,
		image: "cave_bear.1dc9c4593d003be55e93ff9b11b06e9f8645708d.png",
		name: "Prize Plushy",
		the: true
	},
	1009: {
		defindex: 1009,
		image: "cave_beard.6f1d3394be9cb1668c580a32a28134f47fe8621c.png",
		name: "Grizzled Growth",
		the: true
	},
	1010: {
		defindex: 1010,
		image: "cave_hat.bbdb4f7a70e1402a313edb3efa26551504fee57f.png",
		name: "Last Straw",
		the: true
	},
	1012: {
		defindex: 1012,
		image: "starve_demo.d93cf98d39d25b6931963e09b6f1e158f7fa01e8.png",
		name: "Wilson Weave",
		the: true
	},
	1013: {
		defindex: 1013,
		image: "c_ham.5bbd140fa8bd6d2f1918a92712750779232ec874.png",
		name: "Ham Shank",
		the: true
	},
	1014: {
		defindex: 1014,
		image: "brutal_hair_demo.046a0c29a67fa49e1d128b5b61ea56bc4617055e.png",
		name: "Br\xFCtal Bouffant",
		the: true
	},
	1015: {
		defindex: 1015,
		image: "all_brutal_taunt.c9cdb716fbf6084335bcf85c3c8be3f83815e4f0.png",
		name: "Shred Alert",
		the: true
	},
	1016: {
		defindex: 1016,
		image: "bit_trippers_demo.e2ae04868734b560018eaa4413f0bdb906e2744c.png",
		name: "Buck Turner All-Stars"
	},
	1017: {
		defindex: 1017,
		image: "bio_voxhood.9b4a222aa4f8cfc8eaea9aa9389f0569980e682d.png",
		name: "Vox Diabolus"
	},
	1018: {
		defindex: 1018,
		image: "bio_heavy_wig.58e1c6eef8d64a23732d40dca5459bc2d53010ed.png",
		name: "Pounding Father",
		the: true
	},
	1019: {
		defindex: 1019,
		image: "bio_demo_patch.712dda3b18dce2cdcd3295664aaea408abf73f18.png",
		name: "Blind Justice"
	},
	1020: {
		defindex: 1020,
		image: "bio_fireman.b48f2d17555721b381d9f865001dc056bbebdbdd.png",
		name: "Person in the Iron Mask",
		the: true
	},
	1021: {
		defindex: 1021,
		image: "bio_soldier_founders.32aeec2d224ed72aa2c1bf00e1c53da500ad4393.png",
		name: "Doe-Boy",
		the: true
	},
	1022: {
		defindex: 1022,
		image: "bio_sniper_boater.668d584edd098259c240cdb0d2e885760c0c1f34.png",
		name: "Sydney Straw Boat",
		the: true
	},
	1023: {
		defindex: 1023,
		image: "bio_sniper_songbird.67509c844f080361d417c002e06eeab3005ffb59.png",
		name: "Steel Songbird",
		the: true
	},
	1024: {
		defindex: 1024,
		image: "tomb_badge.4a2c3b27a3c750a0415d7552a123be060ab83e48.png",
		name: "Croft's Crest"
	},
	1025: {
		defindex: 1025,
		image: "tomb_pick_demo.6e23732304343c4457ac5b30b9dda820235c587e.png",
		name: "Fortune Hunter",
		the: true
	},
	1026: {
		defindex: 1026,
		image: "tomb_tourniquet.88e0eb2281c32bc087731e144d9ba8c464af8467.png",
		name: "Tomb Wrapper",
		the: true
	},
	1027: {
		defindex: 1027,
		image: "random_paint.4c643674ffdda61c0b9c2a858ecd771ebe5d4eed.png",
		name: "Mann Co. Painting Set"
	},
	1028: {
		defindex: 1028,
		image: "pn2_knife_lunchbox.5baebc4f6036aa4b61021de7d0bd5e4b1a4fac92.png",
		name: "Samson Skewer",
		the: true
	},
	1029: {
		defindex: 1029,
		image: "pn2_samhat_spy.613e0f42619a09a729443fcc4e25e9f24d2cd55c.png",
		name: "Bloodhound",
		the: true
	},
	1030: {
		defindex: 1030,
		image: "pn2_mask.46a37af074b6b7e26b3e455a0a965861155e543d.png",
		name: "Dapper Disguise",
		the: true
	},
	1031: {
		defindex: 1031,
		image: "pn2_evilash.68183416be257c2dd010e62b49d1d3a04945fe44.png",
		name: "Necronomicrown",
		the: true
	},
	1032: {
		defindex: 1032,
		image: "pn2_longfall.6c1f1d28dd0e666c002b2881090ac6f9bbd8c685.png",
		name: "Long Fall Loafers",
		the: true
	},
	1037: {
		defindex: 1037,
		image: "pile_of_crates.45236e1918e8eef155967caff2f08593ffe78793.png",
		name: "Pallet of Crates"
	},
	1038: {
		defindex: 1038,
		image: "as_pyro_cleansuit.9870ba208a7176064a37c873708a551016b1fa1f.png",
		name: "Breather Bag",
		the: true
	},
	1039: {
		defindex: 1039,
		image: "as_medic_cloud_hat.68e654cfbf33ffa0940a1559e4cb36c2e2d7f2b1.png",
		name: "Weather Master",
		the: true
	},
	1040: {
		defindex: 1040,
		image: "as_scout_cleansuit_hood.c1bc9a66cb264fe4d027b4b0f5d367f185f3279a.png",
		name: "Bacteria Blocker",
		the: true
	},
	1067: {
		defindex: 1067,
		image: "chess_hat.ed0f248b2781eef19054c220431c7f84b85f06e7.png",
		name: "Grandmaster",
		the: true
	},
	1068: {
		defindex: 1068,
		image: "hwn_spellbook_incomplete.50c2f704d0ee96424db8d2027a5ff745107b3ac5.png",
		name: "Unfilled Fancy Spellbook"
	},
	1069: {
		defindex: 1069,
		image: "hwn_spellbook_complete.b6b14027ec14d6878f16f9c7b42894f0481fe2a1.png",
		name: "Fancy Spellbook"
	},
	1070: {
		defindex: 1070,
		image: "hwn_spellbook_magazine.3527be41918413569094879536304de8c9c44186.png",
		name: "Spellbook Magazine"
	},
	1071: {
		defindex: 1071,
		image: "c_frying_pan_gold.5d5707050571a656488b5f3e66444164f32c8b31.png",
		name: "Golden Frying Pan",
		the: true
	},
	1072: {
		defindex: 1072,
		image: "xms_backpack_snowglobe.873597d71b2bbb197eca6730a0cc4b2a8e08332c.png",
		name: "Portable Smissmas Spirit Dispenser",
		the: true
	},
	1073: {
		defindex: 1073,
		image: "soldier_hood.738fefaa0dd762a18ab6a49352a2a0495a6d08f9.png",
		name: "War on Smissmas Battle Hood",
		the: true
	},
	1074: {
		defindex: 1074,
		image: "xms_nade_socks.fb44d1f8b568b2cb5bda4d482aec30014bb9233a.png",
		name: "War on Smissmas Battle Socks",
		the: true
	},
	1075: {
		defindex: 1075,
		image: "xms_santa_sack.aba68f6e9ef90691f0faa3e0814a8aad3293e1c5.png",
		name: "Sack Fulla Smissmas",
		the: true
	},
	1076: {
		defindex: 1076,
		image: "xms_braindeer.45de3da857e89798385162f986325c602162056d.png",
		name: "Smissmas Caribou",
		the: true
	},
	1077: {
		defindex: 1077,
		image: "xms_braindeer_rare.0308b089c087f52205de92e39b081c3cfe54b5ea.png",
		name: "Randolph the Blood-Nosed Caribou"
	},
	1078: {
		defindex: 1078,
		image: "c_xms_double_barrel.055645d9d6811f1f2884e5939e762c9a8eff70e5.png",
		name: "Festive Force-A-Nature"
	},
	1079: {
		defindex: 1079,
		image: "c_crusaders_crossbow_xmas.baa887988e2f6e4b9970b2627afa0924235b4a78.png",
		name: "Festive Crusader's Crossbow",
		festive: true
	},
	1080: {
		defindex: 1080,
		image: "c_sapper_xmas.46458ac0ac83f2b1fa0d570a71943294273224ba.png",
		name: "Festive Sapper",
		festive: true
	},
	1081: {
		defindex: 1081,
		image: "c_xms_flaregun.5a96124f415133994737a97847a96d1d00e70c16.png",
		name: "Festive Flare Gun",
		festive: true
	},
	1082: {
		defindex: 1082,
		image: "c_claymore_xmas.30068ce40704b8b5bca91c91cd07515d0783bf2c.png",
		name: "Festive Eyelander",
		festive: true
	},
	1083: {
		defindex: 1083,
		image: "c_xms_urinejar.b160f8e56e4125b4352dba0be5013ef3b0f7f483.png",
		name: "Festive Jarate",
		festive: true
	},
	1084: {
		defindex: 1084,
		image: "c_boxing_gloves_xmas.57e41717283452925c16e3d383b4cc457fbcadb7.png",
		name: "Festive Gloves of Running Urgently",
		festive: true
	},
	1085: {
		defindex: 1085,
		image: "c_blackbox_xmas.93290fbb3b93bbf892021e6ec2a4eba2cb79e8c0.png",
		name: "Festive Black Box",
		festive: true
	},
	1086: {
		defindex: 1086,
		image: "c_wrangler_xmas.73933389ba4c3f5327b3303a7a4382183ddf0cdb.png",
		name: "Festive Wrangler",
		festive: true
	},
	1087: {
		defindex: 1087,
		image: "heavy_wolf_helm.1c615cf224629e1ec7cbb7637bb962e54d750f1e.png",
		name: "Der Maschinensoldaten-Helm"
	},
	1088: {
		defindex: 1088,
		image: "heavy_wolf_chest.2d57b26cf078ec8755f273a1c346ac289f7cf79f.png",
		name: "Die Regime-Panzerung"
	},
	1089: {
		defindex: 1089,
		image: "bi_big_daddy_doll.5b71b5f5e70878170efa9099bcdf1660d4286c42.png",
		name: "Mister Bubbles"
	},
	1090: {
		defindex: 1090,
		image: "bi_washington_mask.8b2c1f940ddf81a850b213509456379f13532542.png",
		name: "Big Daddy",
		the: true
	},
	1091: {
		defindex: 1091,
		image: "bi_franklin_mask.45f96b08eeac34ac2ec7e4f54df81bd9a39c82d1.png",
		name: "First American",
		the: true
	},
	1092: {
		defindex: 1092,
		image: "c_bow_thief.2752806eb597af27565b2050a241704801e37237.png",
		name: "Fortified Compound",
		the: true
	},
	1093: {
		defindex: 1093,
		image: "thief_soldier_helmet.19e87a917c12365ef318154aeff6455cac84c32d.png",
		name: "Gilded Guard",
		the: true
	},
	1094: {
		defindex: 1094,
		image: "thief_sniper_cape.b2fa82a26e134ff86132bf762f33a01fe9c929a9.png",
		name: "Criminal Cloak",
		the: true
	},
	1095: {
		defindex: 1095,
		image: "thief_sniper_hood.2dffa960e14a4a094005c44b4545ab31f4a57bcb.png",
		name: "Dread Hiding Hood",
		the: true
	},
	1096: {
		defindex: 1096,
		image: "thief_badge.7660d202e52f0ea5425725f75de8293f4642763b.png",
		name: "Baronial Badge",
		the: true
	},
	1097: {
		defindex: 1097,
		image: "heavy_pocket_bot.7d155ac32dd10bab8ca6d6d47d3cc157fbb0a1ba.png",
		name: "Little Bear",
		the: true
	},
	1098: {
		defindex: 1098,
		image: "c_tfc_sniperrifle.4f4b5629a0d35a1d34758f171e0cf8840c0c1f3e.png",
		name: "Classic",
		the: true
	},
	1099: {
		defindex: 1099,
		image: "c_wheel_shield.f564b2d43f914b10fa70551d18c51dc1c16e154d.png",
		name: "Tide Turner",
		the: true
	},
	1100: {
		defindex: 1100,
		image: "c_breadmonster_gloves.05810a688fdfda9315a033af97850d27a039a67d.png",
		name: "Bread Bite",
		the: true
	},
	1101: {
		defindex: 1101,
		image: "c_paratrooper_pack.9d234ef8cbcfca2c6577906cd912d60ae75bbeb0.png",
		name: "B.A.S.E. Jumper",
		the: true
	},
	1102: {
		defindex: 1102,
		image: "c_breadmonster_sapper.0632bccf6c603b492e0b0cf2739f3fb7ee221543.png",
		name: "Snack Attack",
		the: true
	},
	1103: {
		defindex: 1103,
		image: "c_scatterdrum.32e8add92a0a1a52ceed604c070df8df30fa5c73.png",
		name: "Back Scatter",
		the: true
	},
	1104: {
		defindex: 1104,
		image: "c_atom_launcher.bbf0b8f49f5c805a4e1f8fc5f0bcea15cbb0c331.png",
		name: "Air Strike",
		the: true
	},
	1105: {
		defindex: 1105,
		image: "c_breadmonster.2855e3dff6f4695e9c29f7ec85b343426d6a6d89.png",
		name: "Self-Aware Beauty Mark",
		the: true
	},
	1106: {
		defindex: 1106,
		image: "taunt_dosido.edfd4f5edebe4588dde0b1bcdfaf201982f91607.png",
		name: "Taunt: Square Dance"
	},
	1107: {
		defindex: 1107,
		image: "taunt_flip.1a6e47e1c02af38b59efbe1daf71f9983ab23045.png",
		name: "Taunt: Flippin' Awesome"
	},
	1108: {
		defindex: 1108,
		image: "taunt_buy_a_life.dd1370d2bc2ac119b6c46a9a2fe0bc0df937729a.png",
		name: "Taunt: Buy A Life"
	},
	1109: {
		defindex: 1109,
		image: "taunt_results_are_in.62f11d4e3c19b579cf67c30de5eef1aef82620a0.png",
		name: "Taunt: Results Are In"
	},
	1110: {
		defindex: 1110,
		image: "taunt_rps.14e28ce1f757fdc83b415c6d000354439b18950b.png",
		name: "Taunt: Rock, Paper, Scissors"
	},
	1111: {
		defindex: 1111,
		image: "taunt_skullcracker.4c34c6c14524c5bcf3f98c8b04ea63c7dbaa41b1.png",
		name: "Taunt: Skullcracker"
	},
	1112: {
		defindex: 1112,
		image: "taunt_party_trick.346604354d5b2207834b3df1fd939179fda35a94.png",
		name: "Taunt: Party Trick"
	},
	1113: {
		defindex: 1113,
		image: "taunt_fresh_brewed.ed2f11b0e16ef5b9cb48a6e7387228e6eed8dac3.png",
		name: "Taunt: Fresh Brewed Victory"
	},
	1114: {
		defindex: 1114,
		image: "taunt_spent_well.0365e8af7104f8140f7412405e33e8c47bbd9a14.png",
		name: "Taunt: Spent Well Spirits"
	},
	1115: {
		defindex: 1115,
		image: "taunt_rancho_relaxo.9315161cfb677ec8b7e45174d1841e9b707a4665.png",
		name: "Taunt: Rancho Relaxo"
	},
	1116: {
		defindex: 1116,
		image: "taunt_i_see_you.1d0d8a10e64d697b5c6389712683b338cd96a37b.png",
		name: "Taunt: I See You"
	},
	1117: {
		defindex: 1117,
		image: "taunt_battin_thousand.4738ad387ed4a07d040939918ab2a88a44545afa.png",
		name: "Taunt: Battin' a Thousand"
	},
	1118: {
		defindex: 1118,
		image: "taunt_conga.d9d2e9ef565b0c273d77d59902e3f4a2cdb1d3c9.png",
		name: "Taunt: Conga"
	},
	1119: {
		defindex: 1119,
		image: "taunt_deep_fried.34786e644564535479d75b74a1268d99b66f6f62.png",
		name: "Taunt: Deep Fried Desire"
	},
	1120: {
		defindex: 1120,
		image: "taunt_oblooterated.f558c7530498ac02c00e41b8eb1cd2cf6810ad45.png",
		name: "Taunt: Oblooterated"
	},
	1121: {
		defindex: 1121,
		image: "c_breadmonster_milk.b5838adfa0d3479764c7c4d64474bd2f728fff99.png",
		name: "Mutated Milk"
	},
	1122: {
		defindex: 1122,
		image: "summer_deal_demo.c2cd4190f9f86d1797018bb5e2207572757e1196.png",
		name: "Towering Pillar Of Summer Shades"
	},
	1123: {
		defindex: 1123,
		image: "c_carnival_mallet.6c28a88909cc8bdb7591824072943831c0068d3e.png",
		name: "Necro Smasher",
		the: true
	},
	1124: {
		defindex: 1124,
		image: "threea_nabler.98e28568e1ce73df6ba2063e46c1d9210b48dab7.png",
		name: "Nabler",
		the: true
	},
	1126: {
		defindex: 1126,
		image: "all_class_badge_bonusd.94bbb268e580d4d62aaa59569fb9e799de1e969f.png",
		name: "Duck Journal"
	},
	1127: {
		defindex: 1127,
		image: "c_crossing_guard.0e52d7a7290a5712c3bc9f5e57e4b0263e194c14.png",
		name: "Crossing Guard",
		the: true
	},
	1132: {
		defindex: 1132,
		image: "hwn_spellbook_magazine.3527be41918413569094879536304de8c9c44186.png",
		name: "Spellbook Magazine"
	},
	1133: {
		defindex: 1133,
		image: "",
		name: "Powerup: Strength"
	},
	1134: {
		defindex: 1134,
		image: "",
		name: "Powerup: Haste"
	},
	1135: {
		defindex: 1135,
		image: "",
		name: "Powerup: Regeneration"
	},
	1136: {
		defindex: 1136,
		image: "",
		name: "Powerup: Resistance"
	},
	1137: {
		defindex: 1137,
		image: "",
		name: "Powerup: Vampire"
	},
	1138: {
		defindex: 1138,
		image: "",
		name: "TF_Powerup_Warlock"
	},
	1139: {
		defindex: 1139,
		image: "",
		name: "Powerup: Precision"
	},
	1140: {
		defindex: 1140,
		image: "",
		name: "Powerup: Agility"
	},
	1141: {
		defindex: 1141,
		image: "c_shotgun_xmas.17d9e510d01f54fac9c0c86407426ece748045a6.png",
		name: "Festive Shotgun"
	},
	1142: {
		defindex: 1142,
		image: "c_revolver_xmas.65907434fd9956632543b823b12165c396db566a.png",
		name: "Festive Revolver"
	},
	1143: {
		defindex: 1143,
		image: "c_bonesaw_xmas.ba3acaeb894ed939904137a0d7210e257d50110d.png",
		name: "Festive Bonesaw"
	},
	1144: {
		defindex: 1144,
		image: "c_targe_xmas.e593f53f468adb9bd357f3a74817a4dfd8e19cb7.png",
		name: "Festive Chargin' Targe"
	},
	1145: {
		defindex: 1145,
		image: "c_xms_energy_drink.b3bcb1973148b1e3ae9c425a2a3adf7a62ef8283.png",
		name: "Festive Bonk! Atomic Punch"
	},
	1146: {
		defindex: 1146,
		image: "c_backburner_xmas.e91094d588a699928a07fb4102e530e3cbc13364.png",
		name: "Festive Backburner",
		the: true
	},
	1149: {
		defindex: 1149,
		image: "c_smg_xmas.f6bea5f29d4dcc6411b4be1712765d256988911e.png",
		name: "Festive SMG"
	},
	1150: {
		defindex: 1150,
		image: "c_kingmaker_sticky.172ce11fc660e79d45959b04824dd6c82acd8ec5.png",
		name: "Quickiebomb Launcher",
		the: true
	},
	1151: {
		defindex: 1151,
		image: "c_quadball.df7964760646ddc11d8a25e99e873db7c00dc01b.png",
		name: "Iron Bomber",
		the: true
	},
	1152: {
		defindex: 1152,
		image: "c_grappling_hook.5f43c220ecc507f9970ccb4644a84afe16282fae.png",
		name: "Grappling Hook"
	},
	1153: {
		defindex: 1153,
		image: "c_trenchgun.1c4f0cd6df6024b792e8884c898ff485ad6fc029.png",
		name: "Panic Attack",
		the: true
	},
	1154: {
		defindex: 1154,
		image: "",
		name: "Powerup: Knockout"
	},
	1155: {
		defindex: 1155,
		image: "w_wrench.1e62c104993c727771e374e42f4fc59d9fe31281.png",
		name: "Weapon_Passtime_Gun"
	},
	1157: {
		defindex: 1157,
		image: "taunt_russian.c1b193535e6ca857029066d3b09f55c9c76b44b2.png",
		name: "Taunt: Kazotsky Kick"
	},
	1159: {
		defindex: 1159,
		image: "",
		name: "Powerup: King"
	},
	1160: {
		defindex: 1160,
		image: "",
		name: "Powerup: Plague"
	},
	1161: {
		defindex: 1161,
		image: "",
		name: "Powerup: Supernova"
	},
	1162: {
		defindex: 1162,
		image: "taunt_manrobic.a0b28992e6f1773682f3a81737ae3c63395fd7e9.png",
		name: "Taunt: Mannrobics"
	},
	1163: {
		defindex: 1163,
		image: "powerupbottle.1908d78941919586ff0e4dff5bac49f8b10bb671.png",
		name: "Power Up Canteen"
	},
	1167: {
		defindex: 1167,
		image: "competitive_ticket.e936a9fabc6ba7c39aafd975c93e3e9f8dfe8da7.png",
		name: "Competitive Matchmaking Pass"
	},
	1168: {
		defindex: 1168,
		image: "taunt_freshbeats.dc1cbe717f9a5806666481e471fe513150aa903f.png",
		name: "Taunt: The Carlton"
	},
	1172: {
		defindex: 1172,
		image: "taunt_bumpercar.68d88d2921b5905a17fdb412780b5c88c563f411.png",
		name: "Taunt: The Victory Lap"
	},
	1900: {
		defindex: 1900,
		image: "stamp_egypt.7a20820711c48f9dccc82c7937dada693cf67141.png",
		name: "Map Stamp - Egypt"
	},
	1901: {
		defindex: 1901,
		image: "stamp_coldfront.cb14216058bbb667d4c7ae6999fd788ab390725f.png",
		name: "Map Stamp - Coldfront"
	},
	1902: {
		defindex: 1902,
		image: "stamp_fastlane.fb2d484435678e0185e1a342657e903b6e58c6ad.png",
		name: "Map Stamp - Fastlane"
	},
	1903: {
		defindex: 1903,
		image: "stamp_turbine.dff967fa904fe699765dadf97a70e7f099e75d8d.png",
		name: "Map Stamp - Turbine"
	},
	1904: {
		defindex: 1904,
		image: "stamp_steel.dc7bddf2e8c5bdfad50bc99e278ca304b796b268.png",
		name: "Map Stamp - Steel"
	},
	1905: {
		defindex: 1905,
		image: "stamp_junction.731add1c3e2f80090597975d17cd9c76d6597bd7.png",
		name: "Map Stamp - Junction"
	},
	1906: {
		defindex: 1906,
		image: "stamp_watchtower.58b9eb0c7a8772372e2747c8f510812c837496e4.png",
		name: "Map Stamp - Watchtower"
	},
	1907: {
		defindex: 1907,
		image: "stamp_hoodoo.e549559f62948b9c911c3c63a14be010a9f289f4.png",
		name: "Map Stamp - Hoodoo"
	},
	1908: {
		defindex: 1908,
		image: "stamp_offblast.009445f4506e8e12c1def0b1720f65612e949f8e.png",
		name: "Map Stamp - Offblast"
	},
	1909: {
		defindex: 1909,
		image: "stamp_yukon.93e71538e015ba9f5e17c51cf9b287baa4993604.png",
		name: "Map Stamp - Yukon"
	},
	1910: {
		defindex: 1910,
		image: "stamp_harvest.bec158907f922c29b20677464829369b6ad12542.png",
		name: "Map Stamp - Harvest"
	},
	1911: {
		defindex: 1911,
		image: "stamp_freight.84fb69b792b3cf04986ef96fa0800cbb79b7b05b.png",
		name: "Map Stamp - Freight"
	},
	1912: {
		defindex: 1912,
		image: "stamp_mountainlab.50349e8790982bceb2978e22520c130214248ef0.png",
		name: "Map Stamp - Mountain Lab"
	},
	1913: {
		defindex: 1913,
		image: "stamp_manor.9f6087831a06aa52818c89452d4eccab530105ef.png",
		name: "Map Stamp - Mann Manor"
	},
	1914: {
		defindex: 1914,
		image: "stamp_nightfall.57f38e53fcbf7736aaac70afc08e1bc0ea0f83f5.png",
		name: "Map Stamp - Nightfall"
	},
	1915: {
		defindex: 1915,
		image: "stamp_frontier.1a9f1c4b06f8360eb9a5ed59dbcb94e734931daa.png",
		name: "Map Stamp - Frontier"
	},
	1916: {
		defindex: 1916,
		image: "stamp_lakeside.f9eb7f1848d9cb4da68a544acfd9ec9821c07e42.png",
		name: "Map Stamp - Lakeside"
	},
	1917: {
		defindex: 1917,
		image: "stamp_gullywash.86e8687005ae92c0c3b4eaba6e6a64b5c0f60544.png",
		name: "Map Stamp - Gullywash"
	},
	1918: {
		defindex: 1918,
		image: "stamp_kongking.6c76806a32aae8bcb216c39a75983f8a0257c572.png",
		name: "Map Stamp - Kong King"
	},
	1919: {
		defindex: 1919,
		image: "stamp_process.65abed732695ca282b0d8d93a92a9741cc6f891c.png",
		name: "Map Stamp - Process"
	},
	1920: {
		defindex: 1920,
		image: "stamp_standin.3a0e9e2c9446d56349bdf7e32d1d4714e2560516.png",
		name: "Map Stamp - Standin"
	},
	1921: {
		defindex: 1921,
		image: "stamp_snakewater.eae5ec9a63b1b94955a994aefbc963da1109844f.png",
		name: "Map Stamp - Snakewater"
	},
	1922: {
		defindex: 1922,
		image: "stamp_snowplow.a464184ba5390ff44258f127a4e26f05c51edd5d.png",
		name: "Map Stamp - Snowplow"
	},
	1923: {
		defindex: 1923,
		image: "stamp_borneo.aed7ac89d7000786eb09850b8c811f43635643ae.png",
		name: "Map Stamp - Borneo"
	},
	1924: {
		defindex: 1924,
		image: "stamp_suijin.beada22a671ea7503fce4bd972a7ffdce899755b.png",
		name: "Map Stamp - Suijin"
	},
	1925: {
		defindex: 1925,
		image: "stamp_2fort.b173d61f198aa4a4658b5e1d4f350125e5a85fe9.png",
		name: "Map Stamp - 2Fort Invasion"
	},
	1926: {
		defindex: 1926,
		image: "stamp_probed.fcd35e106c2aa55bf59dc3be947eace3d03ec1f6.png",
		name: "Map Stamp - Probed"
	},
	1927: {
		defindex: 1927,
		image: "stamp_watergate.1fe80053e03432a5f05fc36718bf2ff14a2d427f.png",
		name: "Map Stamp - Watergate"
	},
	1928: {
		defindex: 1928,
		image: "stamp_byre.db7aafea2612027dff913c2056f0071379a53c0a.png",
		name: "Map Stamp - Byre"
	},
	1929: {
		defindex: 1929,
		image: "stamp_gorge_event.4121cc996b2070ed20284baf5b3a8dee2dc643d4.png",
		name: "Map Stamp - Gorge Event"
	},
	1930: {
		defindex: 1930,
		image: "stamp_sunshine_event.d3988637301ed4f24be0311f93d219db3aa12d3e.png",
		name: "Map Stamp - Sinshine"
	},
	1931: {
		defindex: 1931,
		image: "stamp_moonshine_event.d0e9bfd57b6284785ce68593637c48fb56575903.png",
		name: "Map Stamp - Moonshine Event"
	},
	1932: {
		defindex: 1932,
		image: "stamp_millstone_event.a50ec3eabf82c58ccd24d105d76471eab57bfc5c.png",
		name: "Map Stamp - Hellstone"
	},
	1933: {
		defindex: 1933,
		image: "stamp_snowycoast.86b3d6266c7d2dbc463711be34b31e26f2737da0.png",
		name: "Map Stamp - Snowycoast"
	},
	1934: {
		defindex: 1934,
		image: "stamp_vanguard.038142ed7afe10f74a170d33efb19250cd6e84e7.png",
		name: "Map Stamp - Vanguard"
	},
	1935: {
		defindex: 1935,
		image: "stamp_landfall.8dd8c085906675777b987845aa1c6df219d28868.png",
		name: "Map Stamp - Landfall"
	},
	1936: {
		defindex: 1936,
		image: "stamp_highpass.cbdbef699d728cbbeb0ad2f59f080be389d987c0.png",
		name: "Map Stamp - Highpass"
	},
	1937: {
		defindex: 1937,
		image: "stamp_sunshine.69b345dad555b4a7b567205ea9e02ee8de95ea3c.png",
		name: "Map Stamp - Sunshine"
	},
	1938: {
		defindex: 1938,
		image: "stamp_metalworks.980ee72803ac5d155ba51d7ceef49e795587b908.png",
		name: "Map Stamp - Metalworks"
	},
	1939: {
		defindex: 1939,
		image: "stamp_swiftwater.1062c51289fe9df2827da178fafd971335350177.png",
		name: "Map Stamp - Swiftwater"
	},
	1940: {
		defindex: 1940,
		image: "stamp_maple_ridge_event.78f62ea1d4ae141f26932df4ab01af04d201e3d4.png",
		name: "Map Stamp - Maple Ridge Event"
	},
	1941: {
		defindex: 1941,
		image: "stamp_fifth_curve_event.85b682a706eb0aff14c5c14356744e0cfb8eaf28.png",
		name: "Map Stamp - Brimstone"
	},
	1942: {
		defindex: 1942,
		image: "stamp_pit_of_death.eb262b66622a7b89bcbd92e7ffb726420ff84df4.png",
		name: "Map Stamp - Pit of Death"
	},
	2093: {
		defindex: 2093,
		image: "tag.3a71941cf3a981e3812717e78e9b7a26611c5c9c.png",
		name: "Name Tag"
	},
	5000: {
		defindex: 5000,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Scrap Metal"
	},
	5001: {
		defindex: 5001,
		image: "pile_of_junk2.872fae2c0bb8c9114b1258744afef4cffe68a4d0.png",
		name: "Reclaimed Metal"
	},
	5002: {
		defindex: 5002,
		image: "pile_of_junk3.1d654193fea442669f647d81143dd4ac1560fcbf.png",
		name: "Refined Metal"
	},
	5003: {
		defindex: 5003,
		image: "token_scout.64d8fceb3d16ce5df106409ba4f13033ad33fe11.png",
		name: "Class Token - Scout"
	},
	5004: {
		defindex: 5004,
		image: "token_sniper.73b352fe88c54ec03bc799f5991c5944b8e5c514.png",
		name: "Class Token - Sniper"
	},
	5005: {
		defindex: 5005,
		image: "token_soldier.7bb0d474b95b24bf62dbef6b342cd4b208d6c35b.png",
		name: "Class Token - Soldier"
	},
	5006: {
		defindex: 5006,
		image: "token_demo.b651cc7112452837889520e3f6960cbb1d6eb84b.png",
		name: "Class Token - Demoman"
	},
	5007: {
		defindex: 5007,
		image: "token_heavy.cf7306dbc3e72338b9254c3a0537f305418fcdc6.png",
		name: "Class Token - Heavy"
	},
	5008: {
		defindex: 5008,
		image: "token_medic.078db4148eebdb46af87d5d3c1ad5799d8dafc51.png",
		name: "Class Token - Medic"
	},
	5009: {
		defindex: 5009,
		image: "token_pyro.ad3f987e7bc8d0dc2519d45e757e2d2c2e580b62.png",
		name: "Class Token - Pyro"
	},
	5010: {
		defindex: 5010,
		image: "token_spy.4a2ecf5ad5662c7f4d4ade06a3730aa8227cac09.png",
		name: "Class Token - Spy"
	},
	5011: {
		defindex: 5011,
		image: "token_engineer.e9509fc90db1f0f1028413979cbd56b0a7a5c0e6.png",
		name: "Class Token - Engineer"
	},
	5012: {
		defindex: 5012,
		image: "token_primary.5311e92791494de4f8738f258c8ac7708a2d931f.png",
		name: "Slot Token - Primary"
	},
	5013: {
		defindex: 5013,
		image: "token_secondary.f0ff186a8efc5cc77608f43cb27fd717616625cd.png",
		name: "Slot Token - Secondary"
	},
	5014: {
		defindex: 5014,
		image: "token_melee.3393e8ccdc124b8a630791a725c08dd76c9199a1.png",
		name: "Slot Token - Melee"
	},
	5018: {
		defindex: 5018,
		image: "token_pda.08f29889a235c53725ffc64deaf3751e7880adf6.png",
		name: "Slot Token - PDA2"
	},
	5020: {
		defindex: 5020,
		image: "tag.3a71941cf3a981e3812717e78e9b7a26611c5c9c.png",
		name: "Name Tag"
	},
	5021: {
		defindex: 5021,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5022: {
		defindex: 5022,
		image: "crate.7299648976c7a022df68b7d35bf4a7cd05800855.png",
		name: "Mann Co. Supply Crate"
	},
	5023: {
		defindex: 5023,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Paint Can"
	},
	5026: {
		defindex: 5026,
		image: "decal_tool.9e32f1e4ecccc84ff25c437de7e5c92986ebee37.png",
		name: "Decal Tool"
	},
	5027: {
		defindex: 5027,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Indubitably Green"
	},
	5028: {
		defindex: 5028,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Zepheniah's Greed"
	},
	5029: {
		defindex: 5029,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Noble Hatter's Violet"
	},
	5030: {
		defindex: 5030,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Color No. 216-190-216"
	},
	5031: {
		defindex: 5031,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "A Deep Commitment to Purple"
	},
	5032: {
		defindex: 5032,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Mann Co. Orange"
	},
	5033: {
		defindex: 5033,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Muskelmannbraun"
	},
	5034: {
		defindex: 5034,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Peculiarly Drab Tincture"
	},
	5035: {
		defindex: 5035,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Radigan Conagher Brown"
	},
	5036: {
		defindex: 5036,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Ye Olde Rustic Colour"
	},
	5037: {
		defindex: 5037,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Australium Gold"
	},
	5038: {
		defindex: 5038,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Aged Moustache Grey"
	},
	5039: {
		defindex: 5039,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "An Extraordinary Abundance of Tinge"
	},
	5040: {
		defindex: 5040,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "A Distinctive Lack of Hue"
	},
	5041: {
		defindex: 5041,
		image: "crate.7299648976c7a022df68b7d35bf4a7cd05800855.png",
		name: "Mann Co. Supply Crate"
	},
	5042: {
		defindex: 5042,
		image: "gift_custom_supplies.a40c0fd84395c9a034a5db3f1a28d8af62dbd68d.png",
		name: "Gift Wrap"
	},
	5043: {
		defindex: 5043,
		image: "gift_custom.037cfcd77623d50ea3324c8993191e30f1d7e3bc.png",
		name: "A Carefully Wrapped Gift"
	},
	5044: {
		defindex: 5044,
		image: "desc_tag.d916dfdc609a7964e74f4036eb85ed6946da1772.png",
		name: "Description Tag"
	},
	5045: {
		defindex: 5045,
		image: "crate.7299648976c7a022df68b7d35bf4a7cd05800855.png",
		name: "Mann Co. Supply Crate"
	},
	5046: {
		defindex: 5046,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "Team Spirit"
	},
	5048: {
		defindex: 5048,
		image: "festive_crate.18b83b3ca2f58ac931175dd19fe29cd79b8d9128.png",
		name: "Festive Winter Crate"
	},
	5049: {
		defindex: 5049,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5050: {
		defindex: 5050,
		image: "backpack_expander.ec2ef4ef8fc2f4bfe98a83e8336b8cd365035076.png",
		name: "Backpack Expander"
	},
	5051: {
		defindex: 5051,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Pink as Hell"
	},
	5052: {
		defindex: 5052,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "A Color Similar to Slate"
	},
	5053: {
		defindex: 5053,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Drably Olive"
	},
	5054: {
		defindex: 5054,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "The Bitter Taste of Defeat and Lime"
	},
	5055: {
		defindex: 5055,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "The Color of a Gentlemann's Business Pants"
	},
	5056: {
		defindex: 5056,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "Dark Salmon Injustice"
	},
	5060: {
		defindex: 5060,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "Operator's Overalls"
	},
	5061: {
		defindex: 5061,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "Waterlogged Lab Coat"
	},
	5062: {
		defindex: 5062,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "Balaclavas Are Forever"
	},
	5063: {
		defindex: 5063,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "An Air of Debonair"
	},
	5064: {
		defindex: 5064,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "The Value of Teamwork"
	},
	5065: {
		defindex: 5065,
		image: "teampaint.1a4edd3437656c11c51bf790de36f84689375217.png",
		name: "Cream Spirit"
	},
	5066: {
		defindex: 5066,
		image: "crate_summer.447961e3ef65f73b8575a0797a0082f52e1488ee.png",
		name: "Refreshing Summer Cooler"
	},
	5067: {
		defindex: 5067,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5068: {
		defindex: 5068,
		image: "crate_salvage.279ae14ae07a586aeb6dab1ec0dd67e557ee88ae.png",
		name: "Salvaged Mann Co. Supply Crate"
	},
	5070: {
		defindex: 5070,
		image: "bad_winter_crate.eed5d41ab92964a3e14e33e9ea6ba000e80690d7.png",
		name: "Naughty Winter Crate"
	},
	5071: {
		defindex: 5071,
		image: "winter_crate.ad25034a1453c63f43a658ab6d30da80b307f562.png",
		name: "Nice Winter Crate"
	},
	5072: {
		defindex: 5072,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5073: {
		defindex: 5073,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5076: {
		defindex: 5076,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "A Mann's Mint"
	},
	5077: {
		defindex: 5077,
		image: "paintcan.9046edf23b64960a4084dad29d05d2c902feec78.png",
		name: "After Eight"
	},
	5078: {
		defindex: 5078,
		image: "fire_crate.ddf2d8b322081529fd5fa8b0213de7b379e29f7d.png",
		name: "Scorched Crate"
	},
	5079: {
		defindex: 5079,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5080: {
		defindex: 5080,
		image: "fall_crate.35cf419e422e4a416fdc8670475d7a9dc1091a91.png",
		name: "Fall Crate"
	},
	5081: {
		defindex: 5081,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5082: {
		defindex: 5082,
		image: "gift_premium.7bbda7efe294c3b4b8ddbff3fb9f08a79fab3cba.png",
		name: "Upgrade to Premium Gift"
	},
	5083: {
		defindex: 5083,
		image: "giftapult.55bb2dd7fe8bd97c0dd69fbc0c5dfbdb6487a4f9.png",
		name: "Giftapult"
	},
	5084: {
		defindex: 5084,
		image: "giftapult_loaded.ca71decb0096356cfe935069e755a404f6998bc5.png",
		name: "Loaded Giftapult"
	},
	5085: {
		defindex: 5085,
		image: "giftapult_gift.9c9a2a27e8a1ae8772524b98c57999f9541b56e0.png",
		name: "Delivered Giftapult Package"
	},
	5086: {
		defindex: 5086,
		image: "steam_summer_2014_bundle.ae17b5e7957654742b8871d20e1ec900273164c8.png",
		name: "Summer Starter Kit"
	},
	5087: {
		defindex: 5087,
		image: "steam_summer_2014_bundle_2.13a3573d8569825547d5a5120ca07e36f09d0871.png",
		name: "Summer Adventure Pack"
	},
	5500: {
		defindex: 5500,
		image: "ticket.c36c237564ebb71b7d3ba8af7bfa38a5073b60b8.png",
		name: "RIFT Well Spun Hat Claim Code"
	},
	5600: {
		defindex: 5600,
		image: "ash.b782f655f7c81a0f104d30b0baeaf35ed88e7549.png",
		name: "Roasted Goldfish"
	},
	5601: {
		defindex: 5601,
		image: "ash.b782f655f7c81a0f104d30b0baeaf35ed88e7549.png",
		name: "Charred Pocket Lint"
	},
	5602: {
		defindex: 5602,
		image: "ash.b782f655f7c81a0f104d30b0baeaf35ed88e7549.png",
		name: "Smoked Cheese Wheel"
	},
	5603: {
		defindex: 5603,
		image: "ash.b782f655f7c81a0f104d30b0baeaf35ed88e7549.png",
		name: "Burned Banana Peel"
	},
	5604: {
		defindex: 5604,
		image: "ash.b782f655f7c81a0f104d30b0baeaf35ed88e7549.png",
		name: "Incinerated Barn Door Plank"
	},
	5605: {
		defindex: 5605,
		image: "diary_book.830b6fd9c687cfd3515655cf10a9a9c4b8b225bd.png",
		name: "Fireproof Secret Diary"
	},
	5606: {
		defindex: 5606,
		image: "capacitor.bfedac9e259af6bef871eb4530bf4b4fcb3a4c65.png",
		name: "Barely-Melted Capacitor"
	},
	5607: {
		defindex: 5607,
		image: "ash_pile.19cc7c56fd132a7f516c1ac6638dd15ff61be7ae.png",
		name: "Pile Of Ash"
	},
	5608: {
		defindex: 5608,
		image: "mvm_skeleton_arm.c361c372cf80a9acb831e718826c77015a35db3f.png",
		name: "Voodoo-Cursed Object"
	},
	5609: {
		defindex: 5609,
		image: "hh_gib_boot.5235b50fbc83b794194002427ef9d04b5a4202cd.png",
		name: "Voodoo-Cursed Old Boot"
	},
	5610: {
		defindex: 5610,
		image: "mvm_skeleton_arm.c361c372cf80a9acb831e718826c77015a35db3f.png",
		name: "Voodoo-Cursed Skeleton"
	},
	5611: {
		defindex: 5611,
		image: "sack_flat.9fe171e4ea027b32ccba4c5a6efdfc2e0d0175f4.png",
		name: "Voodoo-Cursed Bag Of Quicklime"
	},
	5612: {
		defindex: 5612,
		image: "soldierbot_gib_arm2.3a85e7efd55360ca215ada177ad1c48efb6cdb62.png",
		name: "Voodoo-Cursed Robot Arm"
	},
	5613: {
		defindex: 5613,
		image: "trophy_bass.87b7c96d6c09562d588a0d8adc49548fe55dbeab.png",
		name: "Voodoo-Cursed Novelty Bass"
	},
	5614: {
		defindex: 5614,
		image: "w_stickybomb_gib4.3cf7586b6ab293728c8d651173f2c7ef6b85dbe3.png",
		name: "Voodoo-Cursed Sticky-Bomb"
	},
	5615: {
		defindex: 5615,
		image: "w_nail.017bc2964d24629ff270fa26eb25e388bf15523f.png",
		name: "Voodoo-Cursed Nail"
	},
	5616: {
		defindex: 5616,
		image: "engineer_zombie.85641a28d0a0873ab52ed60b80ac75c1c9a68803.png",
		name: "Voodoo-Cursed Soul"
	},
	5617: {
		defindex: 5617,
		image: "scout_zombie.38da56fcbcc3819df5e94fea9a1cada3a846db45.png",
		name: "Voodoo-Cursed Scout Soul"
	},
	5618: {
		defindex: 5618,
		image: "soldier_zombie.4ca89ee970f7ad62cae7dbd122eb0c50a577595a.png",
		name: "Voodoo-Cursed Soldier Soul"
	},
	5619: {
		defindex: 5619,
		image: "heavy_zombie.88d934029543ec1aeb84c35ebe0f9bee98c9d2e3.png",
		name: "Voodoo-Cursed Heavy Soul"
	},
	5620: {
		defindex: 5620,
		image: "demo_zombie.ad383fb1cd058fc5bb528cf987246bc3dea1e495.png",
		name: "Voodoo-Cursed Demoman Soul"
	},
	5621: {
		defindex: 5621,
		image: "engineer_zombie.85641a28d0a0873ab52ed60b80ac75c1c9a68803.png",
		name: "Voodoo-Cursed Engineer Soul"
	},
	5622: {
		defindex: 5622,
		image: "medic_zombie.9456f1e84a6e18d461ba6720a5b8700707101d99.png",
		name: "Voodoo-Cursed Medic Soul"
	},
	5623: {
		defindex: 5623,
		image: "spy_zombie.0581b4c2acfccdaa03ca3fa2f77e6afc3992dc56.png",
		name: "Voodoo-Cursed Spy Soul"
	},
	5624: {
		defindex: 5624,
		image: "pyro_zombie.ef53cae5dc5004ae836da6ee58b1627841062a45.png",
		name: "Voodoo-Cursed Pyro Soul"
	},
	5625: {
		defindex: 5625,
		image: "sniper_zombie.0b163716318baa1df63a180f2bf56fbc9e80efac.png",
		name: "Voodoo-Cursed Sniper Soul"
	},
	5626: {
		defindex: 5626,
		image: "ash_pile_haunted.6fd2e19a6a0bd2be772bf16da3e2efd513279172.png",
		name: "Pile Of Curses"
	},
	5627: {
		defindex: 5627,
		image: "crate_halloween.97a77ed63620af720a6941e8ca15e1c79d943ccf.png",
		name: "Eerie Crate"
	},
	5628: {
		defindex: 5628,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5629: {
		defindex: 5629,
		image: "smissmass_crate_wicked.e24f0368811b0a0ae9f225ff229ea93d79ba4980.png",
		name: "Naughty Winter Crate 2012"
	},
	5630: {
		defindex: 5630,
		image: "smissmass_crate.33d9294a16757776e7207f802fdfb30a037449a1.png",
		name: "Nice Winter Crate 2012"
	},
	5631: {
		defindex: 5631,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5632: {
		defindex: 5632,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5633: {
		defindex: 5633,
		image: "strange_bacon_grease.e5185b96d3795303a4e26dabe942eb0845b61052.png",
		name: "Strange Bacon Grease"
	},
	5635: {
		defindex: 5635,
		image: "robo_crate.2813f8a94d1773dea9f3cf091eca301748ba11a3.png",
		name: "Robo Community Crate"
	},
	5636: {
		defindex: 5636,
		image: "robo_key.66640b07fb676337eb36c3c241b6d9b5b37d07c7.png",
		name: "Robo Community Crate Key"
	},
	5637: {
		defindex: 5637,
		image: "pile_of_robo_keys.00727c95446d79ffb54bf3ad9cf56cad7a22b91b.png",
		name: "Pile of Robo Community Crate Key Gifts"
	},
	5638: {
		defindex: 5638,
		image: "gift_wrapped_robo_key.c5f0c46611253ceb92caaaa44ac880325d8c9660.png",
		name: "A Random Robo Community Crate Key Gift"
	},
	5639: {
		defindex: 5639,
		image: "claimcheck.78252f5d78967401925210ff6662914139f70ad9.png",
		name: "Summer Claim Check"
	},
	5640: {
		defindex: 5640,
		image: "summer_appetizer_crate.f0fe91c57108a72ccf62265c227a8ad379b9e66b.png",
		name: "Summer Appetizer Crate"
	},
	5641: {
		defindex: 5641,
		image: "summer_jul13_appetizer_key.1b7a314223c954777d96474ef70be01ac6ed7474.png",
		name: "Summer Appetizer Key"
	},
	5642: {
		defindex: 5642,
		image: "crate_summer_cooler_01.1f5aca4591056a6c9584064dd9efc47271b9af28.png",
		name: "Red Summer 2013 Cooler"
	},
	5643: {
		defindex: 5643,
		image: "key_summer_01.41dbd5fdc5793afd34be9a9eb19575468fde3ce8.png",
		name: "Red Summer 2013 Cooler Key"
	},
	5644: {
		defindex: 5644,
		image: "crate_summer_cooler_02.d58b5f550560d66d658d2572c500fb2c044be78e.png",
		name: "Orange Summer 2013 Cooler"
	},
	5645: {
		defindex: 5645,
		image: "key_summer_02.5fd273e5e0ab7c539fc64c97a17580dc244d5f58.png",
		name: "Orange Summer 2013 Cooler Key"
	},
	5646: {
		defindex: 5646,
		image: "crate_summer_cooler_03.d9a4acdefc698085fa27beeca79764fe77fb4620.png",
		name: "Yellow Summer 2013 Cooler"
	},
	5647: {
		defindex: 5647,
		image: "key_summer_03.71669640bec648b1ed9e7a0c3e4a8aec4073c7a8.png",
		name: "Yellow Summer 2013 Cooler Key"
	},
	5648: {
		defindex: 5648,
		image: "crate_summer_cooler_04.47956bad4d7b7afd9479ee6a2477cc07d1ada4dc.png",
		name: "Green Summer 2013 Cooler"
	},
	5649: {
		defindex: 5649,
		image: "key_summer_04.b92dc4783a00c752e0579270b1212f7e1142bf1d.png",
		name: "Green Summer 2013 Cooler Key"
	},
	5650: {
		defindex: 5650,
		image: "crate_summer_cooler_05.9e62669eea8af071bbc79127a5019e0fa523fd5c.png",
		name: "Aqua Summer 2013 Cooler"
	},
	5651: {
		defindex: 5651,
		image: "key_summer_05.a3ecd3b3c2023d70ea14d74d692210ed8893440f.png",
		name: "Aqua Summer 2013 Cooler Key"
	},
	5652: {
		defindex: 5652,
		image: "crate_summer_cooler_06.0761508ebd95d7e8b688eac6177c50079a0571a5.png",
		name: "Blue Summer 2013 Cooler"
	},
	5653: {
		defindex: 5653,
		image: "key_summer_06.a99ea8eb89ccfa4efe04e7741279ea920e44f59d.png",
		name: "Blue Summer 2013 Cooler Key"
	},
	5654: {
		defindex: 5654,
		image: "crate_summer_cooler_07.ba5b42acd8c014ba07a31ed4be0f6bf6357d5b4c.png",
		name: "Brown Summer 2013 Cooler"
	},
	5655: {
		defindex: 5655,
		image: "key_summer_07.40017e9907fab416e8e0c72e59bc34da3728fb47.png",
		name: "Brown Summer 2013 Cooler Key"
	},
	5656: {
		defindex: 5656,
		image: "crate_summer_cooler_08.3b9964150daf67fed4cdd023f9df4cb7bcd418f6.png",
		name: "Black Summer 2013 Cooler"
	},
	5657: {
		defindex: 5657,
		image: "key_summer_08.3df94ded3c73f618ad3fb4b7310588849f4ccd73.png",
		name: "Black Summer 2013 Cooler Key"
	},
	5658: {
		defindex: 5658,
		image: "pile_of_summer_keys.0b9629a7860c2498d3d4055ac03a5c8832a66f01.png",
		name: "Pile of Summer Cooler Key Gifts"
	},
	5659: {
		defindex: 5659,
		image: "gift_wrapped_summer_key.8bafe978768e563d358c64cc2cf79653e8f9b698.png",
		name: "A Random Summer Cooler Key Gift"
	},
	5660: {
		defindex: 5660,
		image: "crate_select_reserve.efebb5f89418d8d253dff3f7dbc96f6ba62bc82d.png",
		name: "Select Reserve Mann Co. Supply Crate"
	},
	5661: {
		defindex: 5661,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5700: {
		defindex: 5700,
		image: "mvm_robits_01.90fc479e691fd7765c9492fb4a6f181c274f9a81.png",
		name: "Pristine Robot Currency Digester"
	},
	5701: {
		defindex: 5701,
		image: "mvm_robits_02.98b0216697e870f6bc6963177331ca46217d806a.png",
		name: "Pristine Robot Brainstorm Bulb"
	},
	5702: {
		defindex: 5702,
		image: "mvm_robits_03.1cd0667e5017dd62bbd1babc2177a969997d1fcb.png",
		name: "Reinforced Robot Emotion Detector"
	},
	5703: {
		defindex: 5703,
		image: "mvm_robits_04.61976ee61344e53961586c18f7a0a8cabd69ae38.png",
		name: "Reinforced Robot Humor Suppression Pump"
	},
	5704: {
		defindex: 5704,
		image: "mvm_robits_05.dc56d867621a3a22adcbe8feb6fe6500305e9176.png",
		name: "Reinforced Robot Bomb Stabilizer"
	},
	5705: {
		defindex: 5705,
		image: "mvm_robits_06.38805807029f0b631031bcb6062fa2d1a89086ef.png",
		name: "Battle-Worn Robot Taunt Processor"
	},
	5706: {
		defindex: 5706,
		image: "mvm_robits_07.26e0e2b5131c0c0020bfbf20df549d902e43345c.png",
		name: "Battle-Worn Robot KB-808"
	},
	5707: {
		defindex: 5707,
		image: "mvm_robits_08.c207bc933a28dd09e3361304b376b13c0ac6cc11.png",
		name: "Battle-Worn Robot Money Furnace"
	},
	5708: {
		defindex: 5708,
		image: "fall_crate_acorns.ba530e8ec1f311e57d8c275ed26c4149607f8520.png",
		name: "Fall 2013 Acorns Crate"
	},
	5709: {
		defindex: 5709,
		image: "fall_crate_gourd.0d9f58cbdc25d5477e5f061f7ea34fdbbe26e248.png",
		name: "Fall 2013 Gourd Crate"
	},
	5710: {
		defindex: 5710,
		image: "fall_acorn_key.f0eaef2cb81ac6b4f938853c39b42e84d9f249c4.png",
		name: "Fall 2013 Acorns Crate Key"
	},
	5711: {
		defindex: 5711,
		image: "fall_gourd_key.f4399d3213ee050b75f974cffc191187badcc475.png",
		name: "Fall 2013 Gourd Crate Key"
	},
	5712: {
		defindex: 5712,
		image: "crate_halloween_02.f60cda616b26723372e19f4c093558c1d0ecae4a.png",
		name: "Spooky Crate"
	},
	5713: {
		defindex: 5713,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5714: {
		defindex: 5714,
		image: "smissmas_crate_naughty_2013.a89a670058cdc94969e0a755ea190a9fd7b59464.png",
		name: "Naughty Winter Crate 2013"
	},
	5715: {
		defindex: 5715,
		image: "smissmas_crate_2013.39cefad34f768c21e76a2c76d60a308a782062bc.png",
		name: "Nice Winter Crate 2013"
	},
	5716: {
		defindex: 5716,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5717: {
		defindex: 5717,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5719: {
		defindex: 5719,
		image: "strongbox_crate.c57f9c259f6a13c328a6e414edee043bd3e443c2.png",
		name: "Mann Co. Strongbox"
	},
	5720: {
		defindex: 5720,
		image: "strongbox_crate_key.13c8267d8f66a8175fc79f6099c10cd7f351bde6.png",
		name: "Mann Co. Strongbox Key"
	},
	5721: {
		defindex: 5721,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5722: {
		defindex: 5722,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5723: {
		defindex: 5723,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5724: {
		defindex: 5724,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5725: {
		defindex: 5725,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5726: {
		defindex: 5726,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5727: {
		defindex: 5727,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5728: {
		defindex: 5728,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5729: {
		defindex: 5729,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5730: {
		defindex: 5730,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5731: {
		defindex: 5731,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5732: {
		defindex: 5732,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5733: {
		defindex: 5733,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5734: {
		defindex: 5734,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5735: {
		defindex: 5735,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5737: {
		defindex: 5737,
		image: "expiration_crate.c6b5392f04a3a5a8773c96a000f8d269274b990a.png",
		name: "Mann Co. Stockpile Crate"
	},
	5738: {
		defindex: 5738,
		image: "expiration_crate.c6b5392f04a3a5a8773c96a000f8d269274b990a.png",
		name: "Mann Co. Stockpile Crate"
	},
	5739: {
		defindex: 5739,
		image: "crate_taunts.efbe4e0f5f06bfcca3b1c566293d4c1e78a3124a.png",
		name: "Mann Co. Audition Reel"
	},
	5740: {
		defindex: 5740,
		image: "summer2014_key.134d75312892e83ea2d0b30d9a38b121677f8abc.png",
		name: "Mann Co. Stockpile Crate Key"
	},
	5741: {
		defindex: 5741,
		image: "crate_bread_box.a004cb49790da8e5bee49c3a9373122a24226933.png",
		name: "Bread Box"
	},
	5742: {
		defindex: 5742,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5743: {
		defindex: 5743,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5744: {
		defindex: 5744,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5745: {
		defindex: 5745,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5746: {
		defindex: 5746,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5747: {
		defindex: 5747,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5748: {
		defindex: 5748,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5749: {
		defindex: 5749,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5750: {
		defindex: 5750,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5751: {
		defindex: 5751,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5752: {
		defindex: 5752,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5753: {
		defindex: 5753,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5754: {
		defindex: 5754,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5755: {
		defindex: 5755,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5756: {
		defindex: 5756,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5757: {
		defindex: 5757,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5758: {
		defindex: 5758,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5759: {
		defindex: 5759,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5760: {
		defindex: 5760,
		image: "shuffle_crate_taunts.26dc9cc41af75b1f49034aa10772308717ada488.png",
		name: "Mann Co. Director's Cut Reel"
	},
	5761: {
		defindex: 5761,
		image: "wading_crate_2.dea09767ade382b0151eb6251d1e5b6deaf8ab75.png",
		name: "Limited Late Summer Crate"
	},
	5762: {
		defindex: 5762,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5763: {
		defindex: 5763,
		image: "crate_halloween_03_scout.9e4fd957f6155b6974ceebce52b5f32388ce1d6b.png",
		name: "Unlocked Creepy Scout Crate"
	},
	5764: {
		defindex: 5764,
		image: "crate_halloween_03_pyro.e5dae963546c142fc66f6a46b0673b41e9345c90.png",
		name: "Unlocked Creepy Pyro Crate"
	},
	5765: {
		defindex: 5765,
		image: "crate_halloween_03_heavy.fd4bc9af158e7644a3e1273062625c43c7a24eb6.png",
		name: "Unlocked Creepy Heavy Crate"
	},
	5766: {
		defindex: 5766,
		image: "crate_halloween_03_engineer.a061618114124c319c3363c3a4b08227b3afe7ff.png",
		name: "Unlocked Creepy Engineer Crate"
	},
	5767: {
		defindex: 5767,
		image: "crate_halloween_03_spy.2bdae76d4a66723cf273d4363ec42755adef7e3f.png",
		name: "Unlocked Creepy Spy Crate"
	},
	5768: {
		defindex: 5768,
		image: "crate_halloween_03_sniper.27b6799a3493db442a542adc9cdf2ea44db71934.png",
		name: "Unlocked Creepy Sniper Crate"
	},
	5769: {
		defindex: 5769,
		image: "crate_halloween_03_soldier.0429c777b64ac2d4d1c1a1e98019d70dda81910f.png",
		name: "Unlocked Creepy Soldier Crate"
	},
	5770: {
		defindex: 5770,
		image: "crate_halloween_03_medic.1117d128c8cbf9b981c49532828e0bf7424d967f.png",
		name: "Unlocked Creepy Medic Crate"
	},
	5771: {
		defindex: 5771,
		image: "crate_halloween_03_demoman.f5d97a4909f9883b989362f285a6f546886efdab.png",
		name: "Unlocked Creepy Demo Crate"
	},
	5774: {
		defindex: 5774,
		image: "eotl_crate.eff87fcb3f5d3ba99ec0482d8a94d549213de0a5.png",
		name: "End of the Line Community Crate"
	},
	5775: {
		defindex: 5775,
		image: "eotl_key.dd05fe08f7c4d05612bdeb5d1b1d80e48847dc49.png",
		name: "End of the Line Key"
	},
	5776: {
		defindex: 5776,
		image: "eotl_key_pile.894b91bd77fff87fbc604334ce4245bbad831f17.png",
		name: "Pile of End of the Line Key Gifts"
	},
	5777: {
		defindex: 5777,
		image: "eotl_key_gift.740745b7422dfcc5b708455936126db03bb759c0.png",
		name: "A Random End of the Line Key Gift"
	},
	5778: {
		defindex: 5778,
		image: "eotl_duck_token.f96e402683833da9a7dbef7716c47cb8cbf35abc.png",
		name: "Duck Token"
	},
	5779: {
		defindex: 5779,
		image: "eotl_duck_pile_of_tokens.718a8ef020506bf1372a13e430a697ab9f927a99.png",
		name: "Pile of Duck Token Gifts"
	},
	5780: {
		defindex: 5780,
		image: "eotl_duck_token_gift.d2698d607333af6c246217554d9580936337184c.png",
		name: "A Random Duck Token Gift"
	},
	5781: {
		defindex: 5781,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5783: {
		defindex: 5783,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5784: {
		defindex: 5784,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5789: {
		defindex: 5789,
		image: "smissmas_crate_naughty_2014.ac8047eba6bcf22da4b2bcb33b2deef08b4cbdd2.png",
		name: "Naughty Winter Crate 2014"
	},
	5790: {
		defindex: 5790,
		image: "smissmas_crate_2014.ba5e7a0a8d87bc071fb5476c28068af2212a3a3d.png",
		name: "Nice Winter Crate 2014"
	},
	5791: {
		defindex: 5791,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5792: {
		defindex: 5792,
		image: "key.067945a6cae528464e4fa00126f0ef17ee2dc8b5.png",
		name: "Mann Co. Supply Crate Key"
	},
	5793: {
		defindex: 5793,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5794: {
		defindex: 5794,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5795: {
		defindex: 5795,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5796: {
		defindex: 5796,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5797: {
		defindex: 5797,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5798: {
		defindex: 5798,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5799: {
		defindex: 5799,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5800: {
		defindex: 5800,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5801: {
		defindex: 5801,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Kit"
	},
	5802: {
		defindex: 5802,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5803: {
		defindex: 5803,
		image: "crate_variation.1468a7751db3e570e1132ef9022fefa4a9449eb1.png",
		name: "Mann Co. Supply Munition"
	},
	5804: {
		defindex: 5804,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	5805: {
		defindex: 5805,
		image: "weapons_key_gun_mettle.0e8c415ad02919b6e2b1e51d87a73cf53320b0e6.png",
		name: "Gun Mettle Key"
	},
	5806: {
		defindex: 5806,
		image: "weapons_case_01_concealed.f20cd68706f75f5dd8fbd43c7f65f2867cc4ca24.png",
		name: "The Concealed Killer Weapons Case"
	},
	5807: {
		defindex: 5807,
		image: "weapons_case_02_powerhouse.cd26d5fc9c3b2d0bfd6f176519cac1a7c94e1afb.png",
		name: "The Powerhouse Weapons Case"
	},
	5808: {
		defindex: 5808,
		image: "ticket_summer2015.1621d4aa3170f6c813bd1db1f304dbf93b43cad7.png",
		name: "Gun Mettle Campaign Pass"
	},
	5809: {
		defindex: 5809,
		image: "coin_summer2015_bronze.2e02cbe0eab1b1a8de3b240bf4d73c2086a0e2aa.png",
		name: "Gun Mettle Campaign Coin"
	},
	5810: {
		defindex: 5810,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Concealed Killer Collection"
	},
	5811: {
		defindex: 5811,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Craftsmann Collection"
	},
	5812: {
		defindex: 5812,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Powerhouse Collection"
	},
	5813: {
		defindex: 5813,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Teufort Collection"
	},
	5814: {
		defindex: 5814,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Gun Mettle Cosmetics Collection"
	},
	5816: {
		defindex: 5816,
		image: "cosmetic_case_key.68b2ea58e92a17c0e5441aea702b3006fafb787e.png",
		name: "Gun Mettle Cosmetic Key"
	},
	5817: {
		defindex: 5817,
		image: "cosmetic_case.8df255dc77105856fa4b6d19d5d55e99b09790d6.png",
		name: "Gun Mettle Cosmetic Case"
	},
	5818: {
		defindex: 5818,
		image: "strange_transfer.5c3759eb17073130b4394c0e15dee4c3ab8b198b.png",
		name: "Strange Count Transfer Tool"
	},
	5819: {
		defindex: 5819,
		image: "ticket_invasion.ad1631663dae129b588b1d17cc44d7799b622bb1.png",
		name: "Invasion Community Update Pass"
	},
	5820: {
		defindex: 5820,
		image: "coin_invasion.3a35234be717bba475b3e0cc065c7b27efbab586.png",
		name: "Invasion Community Update Coin"
	},
	5821: {
		defindex: 5821,
		image: "invasion_key.150d49c5b213cec548b49646a0792040251c989e.png",
		name: "Invasion Community Update Key"
	},
	5822: {
		defindex: 5822,
		image: "invasion_case.ed53f2eb2a055b97a22f62434517e5797c42fe84.png",
		name: "Quarantined Collection Case"
	},
	5823: {
		defindex: 5823,
		image: "invasion_case_rare.9fb395e91e493c9e2a8b27d159a059fb850c7ea3.png",
		name: "Confidential Collection Case"
	},
	5824: {
		defindex: 5824,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Quarantined Collection Case"
	},
	5825: {
		defindex: 5825,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Confidential Collection Case"
	},
	5826: {
		defindex: 5826,
		image: "hwn2015_gargoyle_stone.72e5451676efb88cfaeb6b18b8bde618826ebcb4.png",
		name: "Soul Gargoyle"
	},
	5827: {
		defindex: 5827,
		image: "halloween2015_gargoyle_key.697f2d811c365f1fdea775668a8dacdc9442fc27.png",
		name: "Gargoyle Key"
	},
	5828: {
		defindex: 5828,
		image: "halloween2015_case.5555e3d820f641746bcf3dfeb428adc62de19c02.png",
		name: "Gargoyle Case"
	},
	5829: {
		defindex: 5829,
		image: "ticket_tough_break.488ae3674628e596fc16b97a19b67bd41816fb21.png",
		name: "Tough Break Campaign Pass"
	},
	5830: {
		defindex: 5830,
		image: "stamp_winter2016_gravel.0a07da85e2e6335669e6e7a953aef5892b4a2aa0.png",
		name: "Tough Break Campaign Stamp"
	},
	5831: {
		defindex: 5831,
		image: "weapons_case_03_pyroland.d4118f044b367236c7583bec8840155e00c004d8.png",
		name: "Pyroland Weapons Case"
	},
	5832: {
		defindex: 5832,
		image: "weapons_case_04_warbirds.6ada841cdcfaa70c3edbb520f7e3e08943e738a8.png",
		name: "Warbird Weapons Case"
	},
	5833: {
		defindex: 5833,
		image: "weapons_key_tough_break.3538e2c7bf97422dff21aa861015eecf706ee709.png",
		name: "Tough Break Key"
	},
	5834: {
		defindex: 5834,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Harvest Collection"
	},
	5835: {
		defindex: 5835,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Gentlemanne's Collection"
	},
	5836: {
		defindex: 5836,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Pyroland Collection"
	},
	5837: {
		defindex: 5837,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Warbird Collection"
	},
	5838: {
		defindex: 5838,
		image: "gift_festive.26db1a66cec14b1374bb191289b75228ddd32861.png",
		name: "Smissmas 2015 Festive Gift"
	},
	5839: {
		defindex: 5839,
		image: "festivizer.f0ae0dc470e80a2ba8fe18bf4a012ae8ab9ca38f.png",
		name: "The Gun Mettle and Tough Break Festivizer"
	},
	5840: {
		defindex: 5840,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Tough Break Cosmetics Collection"
	},
	5841: {
		defindex: 5841,
		image: "cosmetic_case_key_tough_break.2815ceae677a6c581f4024011851fb013a8fc554.png",
		name: "Tough Break Cosmetic Key"
	},
	5842: {
		defindex: 5842,
		image: "cosmetic_case_tough_break.6b39b1d8ce44db059c73d9cf7dba62dcb1e0c0dc.png",
		name: "Tough Break Cosmetic Case"
	},
	5843: {
		defindex: 5843,
		image: "stattrack.fea7f754b9ab447df18af382036d7d93ed97aca9.png",
		name: "Civilian Grade Stat Clock"
	},
	5844: {
		defindex: 5844,
		image: "fall_acorn_key.f0eaef2cb81ac6b4f938853c39b42e84d9f249c4.png",
		name: "Fall 2013 Acorns Crate Key"
	},
	5845: {
		defindex: 5845,
		image: "strongbox_crate_key.13c8267d8f66a8175fc79f6099c10cd7f351bde6.png",
		name: "Mann Co. Strongbox Key"
	},
	5846: {
		defindex: 5846,
		image: "summer2014_key.134d75312892e83ea2d0b30d9a38b121677f8abc.png",
		name: "Mann Co. Stockpile Crate Key"
	},
	5847: {
		defindex: 5847,
		image: "halloween2015_gargoyle_key.697f2d811c365f1fdea775668a8dacdc9442fc27.png",
		name: "Gargoyle Key"
	},
	5848: {
		defindex: 5848,
		image: "cosmetic_case_key_spring.462dc9b0f8b22369ef4d1956a63af0e3d8563b43.png",
		name: "Mayflower Cosmetic Key"
	},
	5849: {
		defindex: 5849,
		image: "cosmetic_case_spring.ea935c67c30fa6b739a2736cbfaa1304fde148c3.png",
		name: "Mayflower Cosmetic Case"
	},
	5850: {
		defindex: 5850,
		image: "keyless_cosmetic_crate_scout.8cffbb8af33b9173015c39f55e60b71013343613.png",
		name: "Unlocked Cosmetic Crate Scout"
	},
	5851: {
		defindex: 5851,
		image: "keyless_cosmetic_crate_sniper.fe07ee82b943f316678a38db02be38e53b3ab30a.png",
		name: "Unlocked Cosmetic Crate Sniper"
	},
	5852: {
		defindex: 5852,
		image: "keyless_cosmetic_crate_soldier.bdf3cbd1816d8cbcb0e2ccd5c110bbbaabc203ba.png",
		name: "Unlocked Cosmetic Crate Soldier"
	},
	5853: {
		defindex: 5853,
		image: "keyless_cosmetic_crate_demoman.23f7b6b2a14fd38cf4123467e9ae9b4db40061fd.png",
		name: "Unlocked Cosmetic Crate Demo"
	},
	5854: {
		defindex: 5854,
		image: "keyless_cosmetic_crate_medic.a3ef1c6e76a0af2c66383e10161c9dc1994ad393.png",
		name: "Unlocked Cosmetic Crate Medic"
	},
	5855: {
		defindex: 5855,
		image: "keyless_cosmetic_crate_heavy.af24ea15a562dc02a2ca25e36682e4c27e286e52.png",
		name: "Unlocked Cosmetic Crate Heavy"
	},
	5856: {
		defindex: 5856,
		image: "keyless_cosmetic_crate_pyro.b0113b903ad8364117206c2cd48d6d37887d7c6c.png",
		name: "Unlocked Cosmetic Crate Pyro"
	},
	5857: {
		defindex: 5857,
		image: "keyless_cosmetic_crate_spy.c3089905451bf61d4bee23ea25be87f4079f3118.png",
		name: "Unlocked Cosmetic Crate Spy"
	},
	5858: {
		defindex: 5858,
		image: "keyless_cosmetic_crate_engineer.a6f0692c6c8f391999571876de7a147990f06116.png",
		name: "Unlocked Cosmetic Crate Engineer"
	},
	5859: {
		defindex: 5859,
		image: "crate_strange_weapons.830667fb7a7a5a5627964fb357dfff4d991b2b04.png",
		name: "Mann Co. Supply Munition"
	},
	5860: {
		defindex: 5860,
		image: "keyless_cosmetic_crate_allclass.6eb8bbfa727cd94a8e612c7eada564e2caff40cb.png",
		name: "Unlocked Cosmetic Crate Multi-Class"
	},
	5861: {
		defindex: 5861,
		image: "halloween2016_case.b30daf9f4555403e76a35d5f407ebaa21ed9a8fe.png",
		name: "Creepy Crawly Case"
	},
	5862: {
		defindex: 5862,
		image: "halloween2016_key.a6fc03a4a24c85bdd909d9707ed423e2995ae1d1.png",
		name: "Creepy Crawly Key"
	},
	5863: {
		defindex: 5863,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Gargoyle Collection"
	},
	5864: {
		defindex: 5864,
		image: "pile_of_junk.3e5562e5fe36aa708b914fb746cd6eb5f6b02d40.png",
		name: "Creepy Crawly Collection"
	},
	5999: {
		defindex: 5999,
		image: "strange_parts.c634ebd3dd467c6828d8df27661d99dfceeb0f71.png",
		name: "Strange Part"
	},
	6000: {
		defindex: 6000,
		image: "strange_part_heavies_killed.d653c80f2b4c0a44977015ddb409d1eb81326798.png",
		name: "Strange Part: Heavies Killed"
	},
	6001: {
		defindex: 6001,
		image: "strange_part_demos_killed.908a65355d8cc1deba03c9198863486dd195ab35.png",
		name: "Strange Part: Demomen Killed"
	},
	6002: {
		defindex: 6002,
		image: "strange_part_soldiers_killed.077cdbd0033c4cade88258f3383b086930e01b37.png",
		name: "Strange Part: Soldiers Killed"
	},
	6003: {
		defindex: 6003,
		image: "strange_part_scouts_killed.83be318078c5840bc92b689fb73189d4ff4dfd61.png",
		name: "Strange Part: Scouts Killed"
	},
	6004: {
		defindex: 6004,
		image: "strange_part_engineers_killed.4a13dd1700f9af56522887ff4dd7134a5939fe2f.png",
		name: "Strange Part: Engineers Killed"
	},
	6005: {
		defindex: 6005,
		image: "strange_part_snipers_killed.5f89ab80b5188339187fb187fd366637eb0ece20.png",
		name: "Strange Part: Snipers Killed"
	},
	6006: {
		defindex: 6006,
		image: "strange_part_pyros_killed.eec75eb96da2344e36f0e5f0cdf6c3da5287210f.png",
		name: "Strange Part: Pyros Killed"
	},
	6007: {
		defindex: 6007,
		image: "strange_part_medics_killed.84ddb0e57fddb6dc16d78371afe4bdb3bf1e1c20.png",
		name: "Strange Part: Medics Killed"
	},
	6008: {
		defindex: 6008,
		image: "strange_part_spies_killed.fa33e90c55d5360c34821e7d078dfcf566d3e479.png",
		name: "Strange Part: Spies Killed"
	},
	6009: {
		defindex: 6009,
		image: "strange_part_buildings_destroyed.5d0bfb83d35b075fb4dfbb8fd6aa452f73348baf.png",
		name: "Strange Part: Buildings Destroyed"
	},
	6010: {
		defindex: 6010,
		image: "strange_part_projectiles_deflected.72a3c0116b56308d2ea4cf111b2f4f34fa6c7d4c.png",
		name: "Strange Part: Projectiles Reflected"
	},
	6011: {
		defindex: 6011,
		image: "strange_part_headshots.ed0baf70cda89a5b0e3896102e0785064efced44.png",
		name: "Strange Part: Headshot Kills"
	},
	6012: {
		defindex: 6012,
		image: "strange_part_airborne_killed.84c965e80225b02093e5e663fa8f54451ad64bbe.png",
		name: "Strange Part: Airborne Enemies Killed"
	},
	6013: {
		defindex: 6013,
		image: "strange_part_enemies_gibbed.0c8c98fc4bcb6b29e6e4f52e94d13c3e1f897eee.png",
		name: "Strange Part: Gib Kills"
	},
	6015: {
		defindex: 6015,
		image: "strange_part_killduringfullmoon.e23132ae743904e609a38392c86c6ba698893666.png",
		name: "Strange Part: Full Moon Kills"
	},
	6016: {
		defindex: 6016,
		image: "strange_part_killstartdomination.b0d3e992a4a7fb64462e26add69854eb884485d8.png",
		name: "Strange Part: Domination Kills"
	},
	6018: {
		defindex: 6018,
		image: "strange_part_killrevenge.ecb1445da68d0408df3b784c60dfaba2e11e2547.png",
		name: "Strange Part: Revenge Kills"
	},
	6019: {
		defindex: 6019,
		image: "strange_part_playerkillposthumous.b868bb1c34552badadf0c314cc477c1c39230cb7.png",
		name: "Strange Part: Posthumous Kills"
	},
	6020: {
		defindex: 6020,
		image: "strange_part_burningallyextinguished.c75bcbcf249853c0de883bc11f6f26720c470d5d.png",
		name: "Strange Part: Allies Extinguished"
	},
	6021: {
		defindex: 6021,
		image: "strange_part_killcritical.e04510e4511dfe43c6d3c127c91ef2864caf5ad9.png",
		name: "Strange Part: Critical Kills"
	},
	6022: {
		defindex: 6022,
		image: "strange_part_killwhileexplosivejumping.8c57b22bc5d895504c52a5558334da55290b5b45.png",
		name: "Strange Part: Kills While Explosive Jumping"
	},
	6023: {
		defindex: 6023,
		image: "strange_part_ubers_dropped.ccde45c8247f506f14428888f8c5acd81c1849bf.png",
		name: "Strange Part: Medics Killed That Have Full \xDCberCharge"
	},
	6024: {
		defindex: 6024,
		image: "strange_part_invisibles_killed.211d0ae016ba0b3fc5676ee77fc70f93eb11be4f.png",
		name: "Strange Part: Cloaked Spies Killed"
	},
	6025: {
		defindex: 6025,
		image: "strange_part_sappers_killed.5a2a96e410212217ae9f81f93dc8a73d41a7a1d4.png",
		name: "Strange Part: Sappers Destroyed"
	},
	6026: {
		defindex: 6026,
		image: "strange_part_mvm_robot_kills.f9fb9c62726948b5c6b8f38e8fd72af9acf3c0fb.png",
		name: "Strange Part: Robots Destroyed"
	},
	6028: {
		defindex: 6028,
		image: "strange_part_giant_kills.aa73dfed53113719195c7cf18845905e7c168d00.png",
		name: "Strange Part: Giant Robots Destroyed"
	},
	6032: {
		defindex: 6032,
		image: "strange_part_10_percent_kills.ed363f9e041c11cb54eb1205e9ecd28ae5aca493.png",
		name: "Strange Part: Low-Health Kills"
	},
	6033: {
		defindex: 6033,
		image: "strange_part_halloween_kills.35e5d66d1055889db466fb63eecae059cf41d90c.png",
		name: "Strange Part: Halloween Kills"
	},
	6034: {
		defindex: 6034,
		image: "strange_part_mvm_robot_kills_halloween.b6a4b8fdbe4efd6b65c767bfdb57104a8e94c6c9.png",
		name: "Strange Part: Robots Destroyed During Halloween"
	},
	6035: {
		defindex: 6035,
		image: "strange_part_defender_kill.8964b090ed07ce6f8c4c07a7ab13af300c936702.png",
		name: "Strange Part: Defender Kills"
	},
	6036: {
		defindex: 6036,
		image: "strange_part_underwater_kill.f84c3a09dcb17cd47fcacf0a0668fbdd83e1669c.png",
		name: "Strange Part: Underwater Kills"
	},
	6037: {
		defindex: 6037,
		image: "strange_part_kill_while_uber.dfaeb3d694393326d0256caa1968f6b9f59a5317.png",
		name: "Strange Part: Kills While \xDCbercharged"
	},
	6038: {
		defindex: 6038,
		image: "strange_part_tank_destroyed.c425fc564cc10d805d0b22660a0155566a23af06.png",
		name: "Strange Part: Tanks Destroyed"
	},
	6039: {
		defindex: 6039,
		image: "strange_part_long_distance_kills.4c1a30ec9a2b2209ba3cf11770fad762549fbe9d.png",
		name: "Strange Part: Long-Distance Kills"
	},
	6041: {
		defindex: 6041,
		image: "strange_part_humiliation_kills.2fdc139ec7a753d6e5a17c287bd580a8a984fb4f.png",
		name: "Strange Part: Kills During Victory Time"
	},
	6042: {
		defindex: 6042,
		image: "strange_part_robot_scouts_killed.d557d277ba8dbfc05a2195d0b6dd9babdb3c531d.png",
		name: "Strange Part: Robot Scouts Destroyed"
	},
	6048: {
		defindex: 6048,
		image: "strange_part_robospys_killed.6640b2a55280720106e9e3a25cc413d57aed6b72.png",
		name: "Strange Part: Robot Spies Destroyed"
	},
	6051: {
		defindex: 6051,
		image: "strange_part_taunt_kills.82001324764ba25be12d94e13b808e06f8609ce6.png",
		name: "Strange Part: Kills with a Taunt Attack"
	},
	6052: {
		defindex: 6052,
		image: "strange_part_unusuals_killed.4f71a3b7ce2e1acd6036396d1d6b44fd361a477a.png",
		name: "Strange Part: Unusual-Wearing Player Kills"
	},
	6053: {
		defindex: 6053,
		image: "strange_part_burning_enemies_killed.1fcdab2385a8091e3caacabea0823c5ffd2a65a9.png",
		name: "Strange Part: Burning Enemy Kills"
	},
	6054: {
		defindex: 6054,
		image: "strange_part_killstreaks_ended.72458c0eb8b93257fdcfc4a210ba98b85f0ac196.png",
		name: "Strange Part: Killstreaks Ended"
	},
	6055: {
		defindex: 6055,
		image: "strange_part_killcam_taunts.5b04af8354c45ab6fa9fad0d82f6d5c5852e321e.png",
		name: "Strange Cosmetic Part: Freezecam Taunt Appearances"
	},
	6056: {
		defindex: 6056,
		image: "strange_part_damage_dealt.cdf43b90ce764eb84c57e2d638a4136e964bc0c0.png",
		name: "Strange Part: Damage Dealt"
	},
	6057: {
		defindex: 6057,
		image: "strange_part_fires_survived.21ba12c93a400c0941cf63bdd1a7c46431da9c93.png",
		name: "Strange Cosmetic Part: Fires Survived"
	},
	6058: {
		defindex: 6058,
		image: "strange_part_healing_done.32559603a52856e4acb85baa52e99301864b6464.png",
		name: "Strange Part: Allied Healing Done"
	},
	6059: {
		defindex: 6059,
		image: "strange_part_point_blank.83ad7536a68e8bd67a06b3fba5eebdea5232d9a9.png",
		name: "Strange Part: Point-Blank Kills"
	},
	6060: {
		defindex: 6060,
		image: "strange_cosmetic_part_kills.ac9fdd6505e5eeda27081176adde7771c245bae0.png",
		name: "Strange Cosmetic Part: Kills"
	},
	6061: {
		defindex: 6061,
		image: "strange_part_full_health_kills.87d0d43006654cd1512ab06f07e562e528c3ecab.png",
		name: "Strange Part: Full Health Kills"
	},
	6062: {
		defindex: 6062,
		image: "strange_part_conga_killer.5e941b86adef4d5c4e230226ec2d8e3f444e007f.png",
		name: "Strange Part: Taunting Player Kills"
	},
	6063: {
		defindex: 6063,
		image: "strange_part_no_crit.194fc06426714b5017a67b707b1e7526a6b27a8b.png",
		name: "Strange Part: Not Crit nor MiniCrit Kills"
	},
	6064: {
		defindex: 6064,
		image: "strange_part_players_hit.7e64b228732205b0dd666d8c0f51c10e98375c7a.png",
		name: "Strange Part: Player Hits"
	},
	6065: {
		defindex: 6065,
		image: "strange_part_assists.b1e31f959af6522a0efbd90be745869e9adeb6c2.png",
		name: "Strange Cosmetic Part: Assists"
	},
	6500: {
		defindex: 6500,
		image: "strange_filter_coldfront.9a66f01e6aff966884b24147c189a48668359119.png",
		name: "Strange Filter: Coldfront (Community)"
	},
	6502: {
		defindex: 6502,
		image: "strange_filter_egypt.737692d1b01606941a947bf553144108fd8cf7d4.png",
		name: "Strange Filter: Egypt (Community)"
	},
	6503: {
		defindex: 6503,
		image: "strange_filter_junction.3345b3bbdafbc70b9042ab4bd849fc7acbfac897.png",
		name: "Strange Filter: Junction (Community)"
	},
	6504: {
		defindex: 6504,
		image: "strange_filter_mountainlab.e7bdd811d566266de1c1299856dbf909b695a757.png",
		name: "Strange Filter: Mountain Lab (Community)"
	},
	6505: {
		defindex: 6505,
		image: "strange_filter_steel.ad4a99eb2ae0d65c2192360e8e4b85e75e47f1d5.png",
		name: "Strange Filter: Steel (Community)"
	},
	6506: {
		defindex: 6506,
		image: "strange_filter_gullywash.0ad5cdb00599fe7a1770b88fbc0293df88746f16.png",
		name: "Strange Filter: Gullywash (Community)"
	},
	6507: {
		defindex: 6507,
		image: "strange_filter_turbine.e90e4546a9937005eb2954af9689883a3d25f013.png",
		name: "Strange Filter: Turbine (Community)"
	},
	6508: {
		defindex: 6508,
		image: "strange_filter_fastlane.3e607d1d1dc5855aa251d8bb6471636a34c6de85.png",
		name: "Strange Filter: Fastlane (Community)"
	},
	6509: {
		defindex: 6509,
		image: "strange_filter_freight.d7b79732f00941faed1187fd70ce99f7def90e7b.png",
		name: "Strange Filter: Freight (Community)"
	},
	6510: {
		defindex: 6510,
		image: "strange_filter_yukon.41a7e6a662a2744bbe1bd505aec7e31cf633186e.png",
		name: "Strange Filter: Yukon (Community)"
	},
	6511: {
		defindex: 6511,
		image: "strange_filter_harvest.a4c942702f68e611025100c132d752a52144b948.png",
		name: "Strange Filter: Harvest (Community)"
	},
	6512: {
		defindex: 6512,
		image: "strange_filter_lakeside.35f779564e42aaf1ae732a8dfc0160156b42762c.png",
		name: "Strange Filter: Lakeside (Community)"
	},
	6513: {
		defindex: 6513,
		image: "strange_filter_kongking.c58f0e5a8b474bb2c8a4fde3f4b1089d362a948c.png",
		name: "Strange Filter: Kong King (Community)"
	},
	6514: {
		defindex: 6514,
		image: "strange_filter_frontier.dcb07fdbed09948b7878f67db383352b2930ce52.png",
		name: "Strange Filter: Frontier (Community)"
	},
	6515: {
		defindex: 6515,
		image: "strange_filter_hoodoo.f8ba3ae6efe45324a235b0acade0c957c7abd65a.png",
		name: "Strange Filter: Hoodoo (Community)"
	},
	6516: {
		defindex: 6516,
		image: "strange_filter_nightfall.8240ebf08f86f9907f5010e24d5f858f1761a9ea.png",
		name: "Strange Filter: Nightfall (Community)"
	},
	6517: {
		defindex: 6517,
		image: "strange_filter_watchtower.491898f20e1bc914e8ad5caecf8fe2144f820291.png",
		name: "Strange Filter: Watchtower (Community)"
	},
	6518: {
		defindex: 6518,
		image: "strange_filter_offblast.5024ee4f77c2839d1cf88cc1960edf6309cdffe8.png",
		name: "Strange Filter: Offblast (Community)"
	},
	6519: {
		defindex: 6519,
		image: "strange_filter_manor.0a86c9660f70055a0a3564c52444ad8ab45c9a80.png",
		name: "Strange Filter: Mann Manor (Community)"
	},
	6520: {
		defindex: 6520,
		image: "strange_filter_process.bb82ae39d7ccb71c65b789632618d50a6f1bb54c.png",
		name: "Strange Filter: Process (Community)"
	},
	6521: {
		defindex: 6521,
		image: "strange_filter_standin.0f7b302343924fa73e9b8bcaa2110662df287387.png",
		name: "Strange Filter: Standin (Community)"
	},
	6522: {
		defindex: 6522,
		image: "strange_generic.80b92eafc95cdad2dabedeb3f031d7d7498ab94b.png",
		name: "Strangifier"
	},
	6523: {
		defindex: 6523,
		image: "professional_grease.f0bc959ce084fef620505909507a7e6247870823.png",
		name: "Kit"
	},
	6524: {
		defindex: 6524,
		image: "strange_filter_snakewater.ba52bb798066e835d87aaac75e7e8f443d3bc0c2.png",
		name: "Strange Filter: Snakewater (Community)"
	},
	6526: {
		defindex: 6526,
		image: "professional_grease_rare.cecad396db9cf4312ebf1f206253465ed505fb4f.png",
		name: "Kit"
	},
	6527: {
		defindex: 6527,
		image: "professional_grease_basic.3d5b2cc3b839bafe0de68d7a988fa34b4ff67817.png",
		name: "Killstreak Kit"
	},
	6528: {
		defindex: 6528,
		image: "strange_filter_snowplow.c036807d8e0cb024a61053cc44f74724a257dd32.png",
		name: "Strange Filter: Snowplow (Community)"
	},
	6529: {
		defindex: 6529,
		image: "strange_filter_borneo.034b4173d020c71c75588e595488e2d6d8dedd76.png",
		name: "Strange Filter: Borneo (Community)"
	},
	6530: {
		defindex: 6530,
		image: "strange_filter_suijin.4fca5d8262626ce6cf2e64a440512ff6d8ff3307.png",
		name: "Strange Filter: Suijin (Community)"
	},
	6531: {
		defindex: 6531,
		image: "strange_filter_2fort.a378b597b984db4d1736f9d121cf32ca571d38aa.png",
		name: "Strange Filter: 2Fort Invasion (Community)"
	},
	6532: {
		defindex: 6532,
		image: "strange_filter_probed.6d7f33ddaf0f98f160101de682d93294574fa505.png",
		name: "Strange Filter: Probed (Community)"
	},
	6533: {
		defindex: 6533,
		image: "strange_filter_watergate.06bde1497d3ca9d3ae437cf6e1e14a7d9ca918da.png",
		name: "Strange Filter: Watergate (Community)"
	},
	6534: {
		defindex: 6534,
		image: "strange_filter_byre.241f0cc7a201fa64c603b39b1f874121fc37c96c.png",
		name: "Strange Filter: Byre (Community)"
	},
	6535: {
		defindex: 6535,
		image: "strange_filter_gorge_event.f5df4111dc675a62d81f72badd4079bb003a6728.png",
		name: "Strange Filter: Gorge Event (Community)"
	},
	6536: {
		defindex: 6536,
		image: "strange_filter_sunshine_event.36665c5bde764dc1ae4d23558141a637f9174789.png",
		name: "Strange Filter: Sinshine (Community)"
	},
	6537: {
		defindex: 6537,
		image: "strange_filter_moonshine_event.f305a0465847fc2bba86deaebc1f675e8323881e.png",
		name: "Strange Filter: Moonshine Event (Community)"
	},
	6538: {
		defindex: 6538,
		image: "strange_filter_millstone_event.c2e07c3390a7b61fd9e8f32c8e5e0a201a46e93a.png",
		name: "Strange Filter: Hellstone (Community)"
	},
	6539: {
		defindex: 6539,
		image: "strange_filter_snowycoast.18f1e9ecc727e599a41f079a22cdb90775c3dcff.png",
		name: "Strange Filter: Snowycoast (Community)"
	},
	6540: {
		defindex: 6540,
		image: "strange_filter_vanguard.6e43ca60778ef348e091728d9029b664cbeaf4fc.png",
		name: "Strange Filter: Vanguard (Community)"
	},
	6541: {
		defindex: 6541,
		image: "strange_filter_landfall.c92f4a69aa95dd51648076f20d07a7bcdfa73716.png",
		name: "Strange Filter: Landfall (Community)"
	},
	6542: {
		defindex: 6542,
		image: "strange_filter_highpass.7913cf694573988c277ae7ab144840944a0ccaa3.png",
		name: "Strange Filter: Highpass (Community)"
	},
	6543: {
		defindex: 6543,
		image: "strange_filter_competitive.cafe3b7f942219d4192e56568fba43cc6d3b9210.png",
		name: "Strange Filter: Competitive"
	},
	6544: {
		defindex: 6544,
		image: "strange_filter_sunshine.c50ddb400226bd24afeb558f1f2533873d24559d.png",
		name: "Strange Filter: Sunshine (Community)"
	},
	6545: {
		defindex: 6545,
		image: "strange_filter_metalworks.280d5756aea1ba6eebe360a6122980eae37efecc.png",
		name: "Strange Filter: Metalworks (Community)"
	},
	6546: {
		defindex: 6546,
		image: "strange_filter_swiftwater.74d26bc6f77f43c6b7c670f1bd53e2e68bbefcb7.png",
		name: "Strange Filter: Swiftwater (Community)"
	},
	6547: {
		defindex: 6547,
		image: "strange_filter_maple_ridge_event.350c3b6bcb6a675f677aad2795e57986ffeb9f3b.png",
		name: "Strange Filter: Maple Ridge Event (Community)"
	},
	6548: {
		defindex: 6548,
		image: "strange_filter_curve_event.06fa32fcce57d188c3c175ba99346fa6fb70ba2a.png",
		name: "Strange Filter: Brimstone (Community)"
	},
	6549: {
		defindex: 6549,
		image: "strange_filter_pit_of_death.989b35017aeac439a9db4d6bb2aa31f0aa727b93.png",
		name: "Strange Filter: Pit of Death (Community)"
	},
	8900: {
		defindex: 8900,
		image: "flask_florence.cc7f47c43f77b104dcca67701c72179a6232870a.png",
		name: "Halloween Spell: Putrescent Pigmentation"
	},
	8901: {
		defindex: 8901,
		image: "flask_florence.cc7f47c43f77b104dcca67701c72179a6232870a.png",
		name: "Halloween Spell: Die Job"
	},
	8902: {
		defindex: 8902,
		image: "flask_florence.cc7f47c43f77b104dcca67701c72179a6232870a.png",
		name: "Halloween Spell: Chromatic Corruption"
	},
	8903: {
		defindex: 8903,
		image: "flask_florence.cc7f47c43f77b104dcca67701c72179a6232870a.png",
		name: "Halloween Spell: Spectral Spectrum"
	},
	8904: {
		defindex: 8904,
		image: "flask_florence.cc7f47c43f77b104dcca67701c72179a6232870a.png",
		name: "Halloween Spell: Sinister Staining"
	},
	8905: {
		defindex: 8905,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Soldier's Booming Bark"
	},
	8906: {
		defindex: 8906,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Scout's Spectral Snarl"
	},
	8907: {
		defindex: 8907,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Sniper's Deep Downunder Drawl"
	},
	8908: {
		defindex: 8908,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Engineers's Gravelly Growl"
	},
	8909: {
		defindex: 8909,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Heavy's Bottomless Bass"
	},
	8910: {
		defindex: 8910,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Demoman's Cadaverous Croak"
	},
	8911: {
		defindex: 8911,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Pyro's Muffled Moan"
	},
	8912: {
		defindex: 8912,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Spy's Creepy Croon"
	},
	8913: {
		defindex: 8913,
		image: "flask_erlenmeyer.4499983a165ef3feb171231b05d5e7aa684872e2.png",
		name: "Halloween Spell: Medic's Blood-curdling Bellow"
	},
	8914: {
		defindex: 8914,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Team Spirit Footprints"
	},
	8915: {
		defindex: 8915,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Gangreen Footprints"
	},
	8916: {
		defindex: 8916,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Corpse Gray Footprints"
	},
	8917: {
		defindex: 8917,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Violent Violet Footprints"
	},
	8918: {
		defindex: 8918,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Rotten Orange Footprints"
	},
	8919: {
		defindex: 8919,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Bruised Purple Footprints"
	},
	8920: {
		defindex: 8920,
		image: "flask_bottle.af2ccb2e2e7afcae4ae2ff8b755a129e00a7de90.png",
		name: "Halloween Spell: Headless Horseshoes"
	},
	8921: {
		defindex: 8921,
		image: "flask_vial.72962a062a3ec2180316cdaa5742015dee2bda69.png",
		name: "Halloween Spell: Exorcism"
	},
	8922: {
		defindex: 8922,
		image: "flask_tub.5607977dd8ed7dc2bd3112f097654c009e7938e3.png",
		name: "Halloween Spell: Squash Rockets"
	},
	8923: {
		defindex: 8923,
		image: "flask_tub.5607977dd8ed7dc2bd3112f097654c009e7938e3.png",
		name: "Halloween Spell: Gourd Grenades"
	},
	8924: {
		defindex: 8924,
		image: "flask_tub.5607977dd8ed7dc2bd3112f097654c009e7938e3.png",
		name: "Halloween Spell: Sentry Quad-Pumpkins"
	},
	8925: {
		defindex: 8925,
		image: "flask_tube.e94508f8a8340b5685836e474ac66e24a4745c3a.png",
		name: "Halloween Spell: Spectral Flame"
	},
	8926: {
		defindex: 8926,
		image: "transmogrifier_pyro.f6eb8dc45917711f1f18570d3f6f1ea11a4aad8c.png",
		name: "Pyro Costume Transmogrifier"
	},
	8927: {
		defindex: 8927,
		image: "transmogrifier_scout.131701a15f03ce0b7017a0247850ac7b397693e9.png",
		name: "Scout Costume Transmogrifier"
	},
	8928: {
		defindex: 8928,
		image: "transmogrifier_soldier.e4f47daf542c1a4be760400f9dbd645524508f86.png",
		name: "Soldier Costume Transmogrifier"
	},
	8929: {
		defindex: 8929,
		image: "transmogrifier_demo.8b7758d511242c17e4d0a0d92e005e6732430f3b.png",
		name: "Demo Costume Transmogrifier"
	},
	8930: {
		defindex: 8930,
		image: "transmogrifier_heavy.7c73a0b1c84e5faede983ce032d83e32e0f2c3a3.png",
		name: "Heavy Costume Transmogrifier"
	},
	8931: {
		defindex: 8931,
		image: "transmogrifier_medic.d4925a9f833130f6b580721037b8bd32600d3614.png",
		name: "Medic Costume Transmogrifier"
	},
	8932: {
		defindex: 8932,
		image: "transmogrifier_sniper.92c00d199d4f40392ad3ad8c0809f5ef18b5f1cd.png",
		name: "Sniper Costume Transmogrifier"
	},
	8933: {
		defindex: 8933,
		image: "transmogrifier_spy.b2292d96e710555fdee367feefe9efbf85bfa1b9.png",
		name: "Spy Costume Transmogrifier"
	},
	8934: {
		defindex: 8934,
		image: "transmogrifier_engineer.e2e2f4ef8481b68d61604f4d46ca0ec2cd103a97.png",
		name: "Engineer Costume Transmogrifier"
	},
	8935: {
		defindex: 8935,
		image: "hwn_spellbook_page.2f561409e2c84261f9667d0680e2aedc8e4b78eb.png",
		name: "Spellbook Page"
	},
	8936: {
		defindex: 8936,
		image: "hwn_spellbook_page.2f561409e2c84261f9667d0680e2aedc8e4b78eb.png",
		name: "Spellbook Page"
	},
	8937: {
		defindex: 8937,
		image: "server_halloween.4dcd7d4c0ab8b7f0c19b356c34bc79f3785eea41.png",
		name: "Enchantment: Eternaween"
	},
	8938: {
		defindex: 8938,
		image: "glitched_circuit_board.04c958fb902a103501634607892afbee5572bb1e.png",
		name: "Glitched Circuit Board"
	},
	9258: {
		defindex: 9258,
		image: "unusualifier.f84395e47b1321524ab85c591fa2c213ea5fe031.png",
		name: "Unusualifier"
	},
	15000: {
		defindex: 15000,
		name: "Night Owl",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDHLbV4Zd4fS5XXCaTSMgmv7UM_hqZaLsHboSnu2yruOD9fXka4829Vy-6Z-uw8JYcmDiw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDELeMqZYtFHcSCWv7QMFqruEI8h6cPLJOL8yns2nu6aW4IXkG6-GwDkLOZ-uw8ySMy1OU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDFLeZ-NdxKG8SCCaXQYgmp7UM-hfRcfMSK8y7nj3_rOG0OXBTo-zkFmbKZ-uw8QboOgr0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDCLbUpMNEeH8DRWqSPZgH16kNphKILLJ2O9int2ii7M2lYXxXqqTlRnreZ-uw8Dg5QE1g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDDLbZ4YokdGMKCCfCDMgn8vExshaRYKJKMpCjt2izgPGleDxK_8z4HzOSZ-uw8JJPKNWM"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDHXOZ5c5wVWZXOXPGFb1r97kJq1qVVLp2O8Xy9jCThazwKWBDr_DhRn7CGsrE-0z4fRG_w87uZeHZv_w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDEXOZ5c5wVWZXOWKCAYACuvkI6iaIJJpfb9Hvr33i9OT1eWxfj82MAyu6EueBj0WoUR2_w87vDQdP2bQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDFXOZ5c5wVWZXOXfKOYVj6uBhsgqdbfpbdoSvp23vua28JXkG_-GMFnLCDubFq02ZEEW_w87sn7zDDRQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDCXOZ5c5wVWZXOXPfVZAus4x9rg6BcK5SP8njp3yTtbjhcXhbj_GsCnuWGsrU_1zxAQG_w87tFb7vqqQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys318lqU9-i-KwKFku65cDDXOZ5c5wVWZXOW_aBZA2p7U0_hKZdKcDc9SK81S_sO2oJDxW9_2NRm7XS7LpoimgfRG_w87vs9DrhJA"]
	},
	15001: {
		defindex: 15001,
		name: "Woodsy Widowmaker",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDHLbJ4N4wYGJPYXKPVNFz16ks4hKZUfcfYpn7miX-9bz0LWBW4_mMDyuSZ-uw8C4kE4Po", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDELbUoNNAeGceCUveEbg39u0NqgPcJecfb9Czm3CruPj0PWULpqD9VmOKZ-uw8mJRnUdI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDFLbMuOI0aGcHYXqfXYQur6kg4iKAPJ5GAon7r2iS7a2wOXRO5_GhRn-SZ-uw8j6YAef4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDCLbcpMd5OGsDRD_7SZwmv6Rk9gqMJLZfc8SPv3i3vPzpeW0Du_2IMnOeZ-uw8t5mYM_0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDDLeEvYo4eFpaBUvKONwGo60I8hPRULJ3aoCLm2njuaT8KDxW6_WlQn7WZ-uw8bKZhyR4"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDHXOZ5c5wVWZXOXPaDZV_4uEk-0_JdKsHboni8iX_uOT8MChDo-mhXkOeA77tvhWYeFW_w87tUFJZpJQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDEXOZ5c5wVWZXOCfHXYl_46x4xgalVLpXf9n7t3y-6MmsPW0W9_WNXn7eF7rJp1mtCF2_w87t6L57AyQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDFXOZ5c5wVWZXOWPCFbgj47xo_haJbe5OM9Sq6iCi7PGtZXRK9r2oBnuLSu-Y4gToREG_w87uG473Ffw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDCXOZ5c5wVWZXOXfWHZw_9vk9rhKUIfsaK8iu83njuPWYJCkHvqT8HmrPTvbU90TsfEW_w87tWpzyEGA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNTW8ot-wfoGj4l4cNsQ9q3_L4UFku65cDDXOZ5c5wVWZXOWaTXYgqr6R5r1vJbL5ePoSq61Cq6OWYKXEfu_mJQm7PVvrZrhjlHS2_w87vLp2taFQ"]
	},
	15002: {
		defindex: 15002,
		name: "Night Terror",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbEyYo1PGMbSXPbVNwGovEs50qQIL52P9nno1XzsaGdfWUbt82lVmLWO6awr3DgxC1wu9Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbIyOIxFS8fZU6PQZVr46xkw0vdfKpWL9inqiCi7OjoIUkXo_24EmueOvKwr3DgMe04VQA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbMyNowdHsfVWPeCYQj1uE8xhaRYKcOPoH7u3Czua2oLCBLs-m8NmbfUsqwr3DiHOP6sWw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbQyNd5LGceEWqXTNF_-7x06iPIPJ8DfpXvt2ni4bz8KW0G5-TkMy7KAuKwr3DjCOML9MQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbUyN9tMFsTUXPWFZgGsvx5ugaEMJ8CPqSrpjH-_MzhYXUHp-joCkeTR6awr3DhQnV5dOA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbFDZo0PW5mWD-iBYQr-6Rk60fdfJpTc9iq8jyngODoJWBu4_T1RkODV77o-1GxFRCDls6zS_q-CvLn6", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbJDZo0PW5mWD-iEYg3-7hhq1KYMLpPboXzo1Xm6ODoJWhrsrz1XkOCBvbdugDwXRnixs6zS_pOT43fC", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbNDZo0PW5mWD-jQbgn86xg_haIJK5WBqH_oiCi9PmtfW0XtqW1RmbDV7uNu1D5CFXTjs6zS_sCTRwe4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbRDZo0PW5mWD-iEZgr47R4wifRdL5OIpny-2HjubjwCDkC_-TgCkeOPuLI-1joWRXfis6zS_gnnR8zZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNdXeEu8RrrHCkN5s5kXMOi8qkUJk6A89eXcbVDZo0PW5mWD-iBbwH970kwh6kPK8fb8y293SzvbDsMCRHsqDhWy-fUuuBq12tAQnHls6zS_g_ZeMw6"]
	},
	15003: {
		defindex: 15003,
		name: "Backwoods Boomstick",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpNAcnXC6KCNVj7uBg61PJdL8CNpyru1CW8PDxZU0G-qT1WzreCuuZp0zkIAy_n8eBQxlE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpOAcfYXv-PZQn14x1siKBcK5eB9SPm3STuM29cDxPvrz0GmuLRueNuh2YIAy_nDHuQcjM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpPAcOGDKOANAD06x481vQPJsSJpiK93SjoazsNDxvr-GsEkbSO6OBtgzsIAy_nFWRdCjw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpIAcmFCfTVYlj0vEhs0qEIKsTbpXjr3iTuPzsNXRPrrmINneOHuLtti2gIAy_nBijNuWU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpJAcTXXP7Qb1v4vB84g6kLe8CK9nvviHjtPj9YXRO6820Ey--Av-M61jwIAy_nuw2IXNI"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpNcJaFGbLfIFzj7ko-gPAMKJSOp3i51Hi6aDoMXBbsqGoAnO6H6OY40zpFQiDlqu2Jrd65bKZbuQG7Kw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpOcJaFGbLfIFzjuU9tgKhYe8OApHu83i3uOWhZWxe9r20DmeKG6ec91zoQRSfjru3erN65bKZalCBjmA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpPcJaFGbLfIFzj7B5qiaFeJsTbqSy72izobmcICEHv8mIEmuPV6Ldi0GhCQnO3quSIqd65bKYiXepJYw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpIcJaFGbLfIFzj7xg6g6dfKsfbpSK62n7oPGoDDkK6rz8Cy7WA6OA6impDR3Djr76K_N65bKYRkZsWsA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNWU-E94QbTCyYx49BsW9Ol9bQJJE-r7dGdXPd5YZpJcJaFGbLfIFzj6kg9h_RdfJLb83zqjyu7OD9eXhHv-mwNzLSC7rZi02pDEnSy_7reqt65bKaMrFcdQQ"]
	},
	15004: {
		defindex: 15004,
		name: "King of the Jungle",
		hasWear: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvItLoxFFsPZWvWPYw2s6Uwxg6hdK5OBonntj3zpOz1fDhS6_GoDmrLT7LN1wjFBdl9zKBE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIuLooYHsLWD_-HbwmuuBo50aNeJsSOpXy83n-6OGkLUkfu-GwNneTUurF1wjFBZUuqfyo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIvLtoeFsbYWfOPZwmr7Uw4hPcPLZ2Ipyzu2SXtOj9ZUhrv8m0CnePRvOB1wjFBYatBzSw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIoLo5IHZXZW6PXNAmpuEo_hqUJJ5Ta8Xjn2X_pOTxbCBG4rj9Ske_TuLd1wjFBtXnAjk8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIpLolPSZKCDKPUY1_-7Uo-hPdeLMCB9X7viyq8aGYPXBG6rmlWkLWOu-R1wjFB0aOVDd0"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvItX44ZXISJHKOYblr-vkNt1PRdJ5fb8n6-2SzvP2oJChborG9RzeeP67Fuh2pARXew_vLM95eKXfUVCg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIuX44ZXISJHKOYZw367EI-h6dfKZOKpy3s2CThOTtcWRe4qGsHkeOC6eNo1GYRQHa4qPLM95dRb_Dirw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIvX44ZXISJHKOYZAH5u01t1fBZKMHf9CjtjnjtPGkCWxPo-z5XzrTUu7trgGgREHm4rfLM95fk2SH8lQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIoX44ZXISJHKOYMFv6uE9p1aIPK5Td9iLr2HvqbmcLUkbsrjoAkeCF6bVsgDwQEiCzqvLM95ckKjKuQg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1XUvw94QbTAi4878hlQN-z_a4ILlC628WTYvIpX44ZXISJHKOYMA77vxhs1vJZepKB9C2-iHnpP29ZD0burmJQze-C77E91mkTSnG4-fLM95eZMZr12A"]
	},
	15005: {
		defindex: 15005,
		name: "Forest Fire",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvItLtxLG5PSW6LSNQr760lqh_QOJ5bbpi-61C-8OzoLWhvt8joMzLLRvbJ1wjFBQhNyuDI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIuLolLHcDRDvaBN1v-v0pugKgOJsSJ9Sm9jnzrb2hfUxG9rG1WyeaOuLd1wjFBccy9g5Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIvLt9ETcWDU_6HZAj76x9thaIPe8SMpH_p2S3pbD8LWUbi8moCzu-B77V1wjFBAgMS2rw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIoLolEG8fVCPODNwCr7B85gvAJLsCAoH_m3y_hMztfXkHt-jhVkbOCueB1wjFBNx8Es1Y", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIpLttJHpTSWaLXNF_170gwgaQML53d8SO-iy_sO2kOXEe4rj9WneGBvbt1wjFBZ_NMgiw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvItX44ZXISJHKOYNF34v0M506JaKMCNoy_sjyi4bG8NDxDur2kGy-TW7uFi0T4QR3m0-_LM95fpKFTOfQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIuX44ZXISJHKOYYFj770ls1aMPJpyAoCPviH_vbDwKDRTi_m4DmrLS7rRihTtEQni5-PLM95dLX8tgrg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIvX44ZXISJHKOYMFz46R4_gaVaLJeJqSrn23i6O2YJDRDs-j0CnOHS6bFs02pAEiSxrvLM95fc0Zx3Bw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIoX44ZXISJHKOYZQv-4xg_gKZdLZPcpHzs1HjrOj9bWBa9_DoMzuTVsrRjhTtDR3exqvLM95coEqhcDw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPqZSXfg_4AD-BjA3-vhlW8Wz5K8AIE6628WTYvIpX44ZXISJHKOYZluuuUs_iPNefMPboy_tiCvhOmkOXhG98jlQye-FurJvgzsREXi3rvLM95caW0AWLA"]
	},
	15006: {
		defindex: 15006,
		name: "Woodland Warrior",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSW-iBM1z-uB4-0fRcKJzco3m63yS6Pm9fXEG_qGtQzOGD67A51DoWR3Hhs6zS_mStRx1i", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSWOiCMgv06xlq1KkLKMeOoHnu2izoa2kKXhvoq24GkbWOu7Ni0GwSEnOzs6zS_nl0xxZZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSWejUYQ6suUtthqUJesGKonm93ivpaz8PXxbtr29Sn-aB77BrgmpHEXK1s6zS_gblFWWZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSXujSZwz970M40vBbJsGI8yjq2Hu_b29bCUbo-WlRzuaH7LtvgD0RSyCys6zS_qOWECi3", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSX-iPZgyrvxo81fQPKZGL9C-61SvoOG1fChru8z0FkeWBuuNig2tEQHbhs6zS_u8Ize6A"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSW5nQM0q5sw1tnvdUK8OJony7iyW_bzsNCkXp8m4NzO-FueY5gGwXQnay-7iNqsfwNqKohB5jvIgRt74", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSWJnQM0q5sw1tnvdUecHcoXm82nztOmxZWhvs829Sm-_UuuM50TsQSySyr-qI-MWoMPCohB5jKKkvaP8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSWZnQM0q5sw1tnvRZepXcp3zp3STobGsMXUHq82sAm7DS6LpiizsSFifkreSF_ZL6ZKWohB5j2XvdW4M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSXpnQM0q5sw1tnqEMJ5XbpCLt1C7vM21cUhfsrm8Hzu_U6eFv0WxHS3i5-Ova-JX5YPCohB5j1mkIHeA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8C5-L8KKFK789OEcelzcrcLSpGSX5nQM0q5sw1tnvNeJsGIoC7n2367b2ZcChu9-mwDzO6HvOBr0zkQQHO0-bqLqZP6YPSohB5jbH3MLho"]
	},
	15007: {
		defindex: 15007,
		name: "Purple Range",
		hasWear: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvItLo5LGMjTD_bSZw6u7E4_ifQMe5GJoi7p2yvvbjsIUhe48jlRzOKCubR1wjFBqkljSck", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIuLotPGMWBU_GGYQj1v0lqgfNUfcHapHvmiCTuPG1bWBbv_T1WybSP77B1wjFBlA8ARIo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIvLolOHZaDU_6CNQuuv09phahdfcHfoins3y_tPjtfWRPqqD0Dyu_TubF1wjFB6aeTWQ4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIoLt1MGZLWWf_VMlv77RlthKFaKpHd8ni73CToOT0PXhvrq2sEn-fRued1wjFBAVrs1eM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIpLtgZGsaCD_WONw36vkg7gqcJLsGA9ijmiH7hP2kOWEbt-j8Mn-7V67F1wjFBBN_wXI4"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvItX44ZXISJHKOYblr06Rk7g_NefceL8SzpjC_sOm8KWUK_r2hXzuaE7LRihj0XR3K3rPLM95cFck1ksg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIuX44ZXISJHKOYNQD56kls0vBcKMHboC_u33jpMz9bUkHq8zoMyuLWu7Fv02wTRnHhqPLM95cZb--sJA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIvX44ZXISJHKOYZgGs7R8_hPIMLJSP8nvo1HjuOTtYDkDu-GgFy-aA77Vs0W1CECS2_vLM95cCoFgxSA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIoX44ZXISJHKOYZAv060o7haVfJ5LdpCK-jyy6Mz0LXhTs_GIDzbeHvrU60GgVRSS0pfLM95eV4SXuqg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNQVeU_5hrlDys319d2Rse68qkHJ1u628WTYvIpX44ZXISJHKOYbl_-4kw706NefJ3c9n_r1Cq9PjhbCRa6-GpXnrLUu7Jv1m9HSye4qPLM95ckYODgVQ"]
	},
	15008: {
		defindex: 15008,
		name: "Masked Mender",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDHLeZ_MokYFpaCCKPQYw__7U9pg6UMKMSPoSu5jHjtbDwOUxbo-DkFkO-Z-uw8rfodEHE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDELeV4N4kdF5LUXvSPM1r46k8wiPcIKceLoCu62CzgOGtcWEC_8zkAmLWZ-uw8uQkgR9k", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDFLeIqYtlIFsSCXfWDYwuv7k8xh6gOJ8aIoSu53C7uaWpfXxO_-GNXkOCZ-uw8b0tpkN0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDCLbkpYtAZHZaCW_OBMgj9uUI60_IIKZGJoS3uiCnsPmsPXRXsrmgAzOSZ-uw8iTnLmeU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDDLbErOIpLTMCEC_KCZVup6RhugPJVKsfcqXnrjyvgOW0MXUXjr2hSmOeZ-uw8K9cs3UA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDHXOZ5c5wVWZXOU6LXY1yv6hg-ifQJeZCB8y6-2SvqOGcJDxu5-G8MkO-Hv7dji2wREW_w87sGKTLF-w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDEXOZ5c5wVWZXOU__QZFv-70I-hKdVJ53a8Sq71CXoOToMWxG--WMHnu6Bv-Fvh28VEm_w87sSUXUB2w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDFXOZ5c5wVWZXOU__QZFv-70I-hKdVJ53a8Sq71CXoOToMWxG--WMHnu6Bv-Fvh28VEm_w87udTKBOIg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDCXOZ5c5wVWZXOXfKCMwz5vEps1KgIKpTaqCzoiSq7MzsJCBe4_29XzOCO6OE9gDtDQm_w87vKum1fhg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTBCYh48JnWdK4874UFku65cDDXOZ5c5wVWZXOXfKCMwz5vEps1KgIKpTaqCzoiSq7MzsJCBe4_29XzOCO6OE9gDtDQm_w87tcXF2Xbw"]
	},
	15009: {
		defindex: 15009,
		name: "Sudden Flurry",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPeYbgn46kpr1fMLfJeO8n_njiy8PWoPWxvr_m4AmuaGsrc-hW4eRCTh-fLM95cWSDODlg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPSYNQD_vxg_06MMJpba8n682ii7PGcJXBLi_jlXnLKPveQ90W0SEXTkpfLM95cnCT8ZVg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPWYYg2pv0s61qJaJ5OP9iLn1XjgbmoKWhXp_2wEzePS7-Rq02cUESLirPLM95d_01BuRQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPKYYAn-7kMw1PAIJpaBpy-82n7oOWoKCELi_GMNmePWs7VjizxCSyKwqPLM95fp8JWFkw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPOYYQ6pv0k5gKgML5KNoSO53i67bDoJWRDurmsMnuKDsrNp0G1FECPk-PLM95dNktcfsg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPfpMFy-rhJ-1b9fKsaA8Xy92n7sOWlbDhHs8m8NkO6G7Lti1G8US3a4--zZ-pT-MKWy2gBqhyIhmTXy", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPTpMFy-rhJ-1b9UKMTY9Szmi3nuaWZYUxfq-WgDzrTU6bdsi20WQSPir-Xa-Jb9Y6e-2gBqh0fSzKGg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPXpMFy-rhJ-1b8OKcfcpiK8iHm7aDxbXBXq82IFke7TvbVji2YeECK0_-iOrZL8NKW-2gBqhzk5nf7J", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPLpMFy-rhJ-1b9dJ5PbqSvq1CrrPm8CX0fprjoMnLKBuLNoijpDEXfjq-iF-JOoZPax2gBqh2B6BWwM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQVPFi74dyQb_VucpEjWJWBGPPpMFy-rhJ-1b9fesDapS273Su6aT8LDkfq-m0Gme7S6bNrgW9ESyS4r-6Mq8H8MPW_2gBqh9VnOr5k"]
	},
	15010: {
		defindex: 15010,
		name: "Wrapped Reviver",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbEyZI5KGpPTWaCOYgv67Rlp0aRbfpTdp3u-jyu9OGoDCUfvrm8FyrOPu6wr3Di3SmduNw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbIyNt1OFsWFC6CBNw744x9p0fJcJsSO9n7m3S66aW5fWRPq8jpXnrCO6Kwr3DhoREPkMg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbMyMN8aHpXVCaDUYFiu7xpq1KIMesbdqS2-3yvuO2deCRbrrmMHmO-Evawr3DgHkvJysw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbQyMIseSsDZXqfQYV_-6EI_0vdVfJSO9n_n1HzpPmcIDUa_qT5Vn-HT66wr3Dh-DYIs0A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbUyN99IScXYWvWHZ12o4kwxifJfe5SLoXy8iSrtOGkMChLsqGhVkbOF76wr3DgtTOe20w"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbFDZo0PW5mWD-jSNAj86UI-gKhZKcTc8S-5jy_pPWsJXBrurGIAmrKOsrBv0zwRESTks6zS_tQlyjtF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbJDZo0PW5mWD-iEYAH06ko5gPNUK8HboC_u2Xu9aGcCUxHurjoMn-GGs7RvgmpAFiK3s6zS_pYuU9ch", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbNDZo0PW5mWD-jXYw31709riagILcfaqC-92CzsMzhfW0HirmsCyrWC7OM-hGpFRSKys6zS_gYKA9CE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbRDZo0PW5mWD-jUb1qo6EsxiPMLecaBpXzrjCjpOjxcUka6-mIHm7WFuudjim0WQSW2s6zS_vtDUyHk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPq1bWPw94QbTHjUz-NdmUMWz4bIQLE6A89eXcbVDZo0PW5mWD-iHb1_940w80qdZfpfcpi7ujCvtbGZZD0C-r28AyrSE6-Ns1jwQSnXks6zS_laaxaRk"]
	},
	15011: {
		defindex: 15011,
		name: "Psychedelic Slugger",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOHt7WDqPSNVuruE48iaJce8CJp3vtjiXpMmtYD0C_-GlRkLeCubI60WlFXTHu-tbuIh5l", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOHd6BDKfSYwv56Ew5iahaKJCMo3-72i3haGtYXha6-WkMkbLTuuE9hm0XXTHu-i8Xtp2J", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOHN6DCfKDNAv9ux1pg_IMJpWPpn_r2yzuPGkKUxfvrm8DzuWAs7Bthm0eXTHu-hy6njPs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOG96CC6OPZAD8vkJu1KJfesCAo3jn2S3vOm5ZCRbu-T8MmLXV6-Zr0DwQXTHu-uY40r76", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOGt7WD_KEYl2o7khs1vcLKcHfpCzm1Si_MjgKCBTt_D8BybWCuOZo024VXTHu-iUNM9Cm"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOHq-GD7XCP0-o9EMx1aBcKpTdqS_n3Cu6OGsNWhG6qD4FnrPVsrU9gm9HECLmrO3ZrMjncq_hnhjYDkc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOHa-GD7XCP0-o9Bk6g_dVeZyBoiPv33jrMj0CCBDi-WwEmODWvbQ5120XRyTj-O7ZqcHncq_hnALhu7Y", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOHK-GD7XCP0-o9B1rhKZYfcfdoSnt3iu_OjxcX0Dq-D5QzO-EuLdohWhERHHlqbqEoJHncq_ht9B2lZQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOG6-GD7XCP0-o9Bow0qhZfcaKoyrtjn7qPmZfCRC5_moBmubVv-Rpgm4REHS4quTdqcPncq_h0FpXmlg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJbSvo24g3-Njch8cRrUdOz-7IFOlCq49WTcd9rZYkOGq-GD7XCP0-o9Bow0qhZfcaKoyrtjn7qPmZfCRC5_moBmubVv-Rpgm4REHS4quTdqcPncq_hSw5XKz8"]
	},
	15012: {
		defindex: 15012,
		name: "Carpet Bomber",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPeYbw77u0w41PRdepeKpCy83n7rb2YNXhe__T4CkbeH6-duhD5CQ3K1rvLM95eQIpaPlg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPSYMAn4uB46gKgOe52Ipnno3y_oMmYLDxvv_W8NkbTW7OBu021HQ3PirfLM95e_RkAkNA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPWYbg31uU8xiKYJfsDaoXu7i3u4b2kND0G-qDkCze6GuLBugm9EQXjirvLM95e2vv8DaQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPKYZA-uvBk71PRZfZXaon-5iHvraDgLXxbpqWoAmefRuLo6hj4RSyTjpfLM95fyoj-ArQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPOYZgir6E481PVUKZOM8S7u2SW8bzsMDhHir2xQzeKAuuY60zsTFXK5qvLM95d9p6uk-Q"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPXpMFy-rhJ-1b8ILcCMoH_oj3-7OGxYCBbs-WhSnLXTs7Y602xDRHjjrLjZqsj5MaOw2gBqh0Ow9hkY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPTpMFy-rhJ-1b8PeZPd9C_m2ivvPW8NCBS4-msBmO-P6bBs0T5DS3fj_uiP_ZKqZqC_2gBqhxW1FFJT", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPXpMFy-rhJ-1b8ILcCMoH_oj3-7OGxYCBbs-WhSnLXTs7Y602xDRHjjrLjZqsj5MaOw2gBqh0Ow9hkY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPLpMFy-rhJ-1b8JKceI9S6923y6az1eU0br_2wMy-CBuLRqgjpARSLh--yI_5OoNaC-2gBqhyM9iN6u", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrNKVfYx7QrjBCU-6dJtV9-z5YQFKE6v4caUbO1-ZZojWJWBGPPpMFy-rhJ-1b9ffcPcpS66jn_sb2sLWxW9-moHkOXT67I612YTQCXm-L6Er5P-YfTn2gBqhxTXKM_8"]
	},
	15013: {
		defindex: 15013,
		name: "Red Rock Roscoe",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDHLeMuNd5PGcDZUqPTMFqsvkMx1qYJfZOB83jtiCq6OWleXRPi8m4DmueZ-uw8Ps4xaoo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDELbB-No5EHZKGXqCPYVqv6U1r0vBfKJ3a83i63Cq6bmYKWRPq_2oGybSZ-uw8w4Rbprc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDFLbJ9YtoeHZPQWKPVN1z9uB5uh_NaKJWM9ivt2Si7aWwMWhDo-W9WmOaZ-uw8TFEIYTo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDCLbZ-YdsdGcbSW_GDYQGru0lrh6QIfZCM8XvtjCW_OjwJWEfr-2sEme-Z-uw818Qfx04", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDDLbYrM90YFpSGCfWHZVurvkIx1fdfJpCB9iK9jC3tM2deDhDs82oCmrOZ-uw8co5sJrk"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDHXOZ5c5wVWZXOWPKOZw6u6R9qgvNbL5bboX-82HzpaTpeWRHp-G5WkeWA7uE-i2keF2_w87sgBW1RDw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDEXOZ5c5wVWZXOWPKOZw6u6R9qgvNbL5bboX-82HzpaTpeWRHp-G5WkeWA7uE-i2keF2_w87u5iNxxgw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDFXOZ5c5wVWZXOD_-DYQv1vklqh6RcK8Pap3nt2SzqaGoKXhK-rGkHzuCH67c_12ZHR2_w87tqGyzzkA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDCXOZ5c5wVWZXOWfPQZg797xhqh6UJKMeB9H7t3S_ob2cKX0Hp_T0MyeeP7LVoh2ZFEm_w87uUA8y9OA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrBXT-E1-Df-DCMg58RoRtil9LQDFku65cDDXOZ5c5wVWZXOUveBNF2vvkI51qNcLpDbpX7o3yrqbG0ICkbrrz8Fy-HU7OM9imlHRG_w87vBBU1wQg"]
	},
	15014: {
		defindex: 15014,
		name: "Sand Cannon",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctlSF5bSU_GAMguv7ExrhaUPKJbaoyrq3y_qaGlZDkDv_TgEnOKA6-Noi3FWHSaxx7hI7g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctpSG8LYWfSBM1_64ks_gqFVLp3Y8iPm3STrOjtbDRbq_24BzrWCvbFsg3FWHSYfP_O-Mw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9cttSTZHSWvGPMwCov047iaRdeZLb9Hy7jHi9a2wLXUDqq2kNyuOD77Jv0HFWHSbrhAQ-TQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctxSTZHZW_SFYw-p6x5sgKJUepyJpSO7j367PWxeWxXj-2wNkbWHuLY6gXFWHSbQcpdbKA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ct1SH5GGD_WEZA_47hhqhKMOJpaL9X_tjyjhOGpeUxbjq20FkODRu-RohXFWHSatngGKfA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctkjSZWTHq_AMxeru0w5hahee8aAqX7r3SS7a2oCWRq9qD1WmrXVv7M91moSFnSxpbrZt4CnZaoyCnuB", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctojSZWTHq_AMxf7vh8wgaNdfZPdoC7njyS_bz1cXxG9-W4FzrCCsrc6gW5AR3a0q-mKt4CnZZhwANlj", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctsjSZWTHq_AMxepu0Iwg6kLfZKJp3vt3Cu8OmxcWBDqrm8BzuLUsrVuiz0SRnni_OvYt4CnZSRWCE0X", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ctwjSZWTHq_AMxevuEps1KcMfJff8iLt3y7rPT9cXRe4_GgAzLfR6LZv1DpFRXnmq-uJt4CnZdzUDjqE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2jllkgR6OOaxOz5rfgHQPrJRX_4_4ATtHCkx4MJxa8S3-b8FKFKx69ypdOV9ct0jSZWTHq_AMxeo6R5s1adcLMaJpS3u3CS9P29cWRu4qWMBm-KDuuBqgW0VFnC3-7mKt4CnZWvZcyhA"]
	},
	15015: {
		defindex: 15015,
		name: "Tartan Torpedo",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oPYO-V4ZNsaSsbWWfGDMgD_vkNt0aNYfsbdp3i52n_pbmdcX0C6_mtQm_jH5OXM4M4TaQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oDYYbR5ONAfHpXRUv_VYVur6ks7hKVYfcba8i663Cy6aG4ODxLj-zkEmvjH5OU_Y5SEHg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oHYZuEqNdFMGsHTXfGPYwz6uUM8hPNeK8GIon-7jyi6OmsNUhDv_2kFkPjH5OUdchITwA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9obYYLcvMtBIHcfSCPSDZQH_uxo-hKMMKJ2O8i672yrvaTpbDxS982pSyvjH5OXLjcYnNg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9ofYMbEuOY5MHMiCX_DSNVr4vkxt0_ULfMDbpXnm33nobmlZX0Lu-DoEyfjH5OXPxPzjSQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oOpZeVvdIEKSt7RXvWFZQj4vBow0_cLe5LfpH673SnoPWwKUxS58mNQmeeH6eA9hWYWXTHu-oZ8QNUl", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oCpZeVvdIEKSt6FWfPUNVr_7EJq0fMIK5zc8izqiSjvbD9ZCRfqq2kMzufR6eBj0zlDXTHu-iwHZCbc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oGpZeVvdIEKSt7RWqCGMA397hg_0fdffMON83_t3ni_PWwJXEXrrDgCye6OsrpjhzoUXTHu-i5BcHZw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oapZeVvdIEKSt7QU6LUM13_7Etr1KRbL8SIoXnn1H7oO2oOWxa4rDkAkeCA77tqgj5CXTHu-m7aWuFJ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0yxztGzMz5tNsRsez87Q5Plm-9oepZeVvdIEKSt7WW_eBMgGp7xpsiaddJ8PY9Hu-1H_rbj9fDxbt8j8FmeCCvLZshmgSXTHu-uAUvExf"]
	},
	15016: {
		defindex: 15016,
		name: "Rustic Ruiner",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUeBK64YLGMLN4NNEeF8GBXqKDMg_14x48g6VYKpaN8Xvq1STqMj8LCBrq5CtazwS1JEwe", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUexK6ttbAOrMqM45OTZTQCaeEZFus40Ix1vcJe5DYpyO52i_gaG1bU0Lq5Ctaz4euMDu_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUehK9tNSSNuN9MI0aScPSUv6BMwmp7h9t0qhaJpSIoSu8jynhbz1cDhTp5CtazxKiYXHx", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUfRLn5dHFZeMkMoxPFsCFU_HVYQr4uEo8iKZUKpCKoSPp3S24M20IXUe45Ctaz_j8KOWv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUfBLnsNHBNbR6ZNBOS8aCD6CCZAn0vxgw1KZeK8aP8X--3yvsOGcOUkbu5Ctaz5yZD3bR"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUeGO54cGCavZ5Lt1KGcaGDqSBYwH_6hpriadZe5GK8Xns2i3ubDoNXBTuqDgFy7eA7uF1wjFBxQHUoPE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUe2O54cGCavZ5LoxKFpbSWfHSMwj-uUlr0qYPfp2OpSrr2n64OD0JW0K6_G4FneTT77t1wjFBNGyXPuc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUemO54cGCavZ5LtxPSsSFXfLUMACr4kpu1fIPfsCJpH_o2nvvaDwCWRq4_WtVy7ODu7J1wjFB90mb9WY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUfWO54cGCavZ5Lo5KS8GDC6COYwyvu0M81KMIK5LY9nu81SrsM24KWUHj_m1Qm-WB7rN1wjFBMfs9ZsQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0egvWBrVQY-cv5xzlCjUn4clmRuih8roUfGO54cGCavZ5Lt0aFpTWWP6PNAr5uxkw1qhdepyL9C3q1HnuPGpYCEHp-D9VzuSB6LR1wjFBJN5fDTQ"]
	},
	15017: {
		defindex: 15017,
		name: "Barn Burner",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2ttZyTN7F_N95JFsTQWKeHYQ_-6Us-1qJbecOK8i-83nvrbDxZXhXo-21ShqbZ7V2I2ByV", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2ttpyTM7V_MooZGcGBW_LXYF_-60xq1qYOL8fY8yzqjy24MjtcDRTi829XhqbZ7doMcxSA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2tt5zDNrgsN9hJHciCW_WEMF_77x5pgKVUfcSOoy3qjyzrOWxfDRG-q2gHhqbZ7beVl84b", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2tsJzCOuMpMtkZHcmBWaDVYA714xg5iPJfLMCPqS3o1X68PjxeU0G6rmkNhqbZ7YKC8if0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2tsZzGO7UuZolIHpGDXqDSNAD16R9qgPILKpKM8yno33u6OWgNCRfp_TgChqbZ7T6QFit8"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2tte2QZvNoaZ4ZAcOCWaDUZQz16Rk7ifULLsaIpyq81X67OG0CCEa5_20AkeCPuLQ61GcIAy_nfQcn-M4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2ttu2QZvNoaZ4ZAcODDqCDZwirvE86gagIJ5KApC272ynvaDsLWhfq_TkGyueOveA-gWoIAy_n1zl00GU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2tt-2QZvNoaZ4ZAZbWWKSBZFv6vkI-hqQOK8SK9i3q2izgOjoCCkftr20BmbWHsuA4hW4IAy_nST26Jqo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghhfgXPBLRWTvot8RrTCyYg5sV2Rtmz5YQRLF2tsO2QZvNoaZ4ZAZTXCfaAZlv67xk90aMLK5bYpCO91CTsOj0DCBW-_D8Nn-WB7OZthm4IAy_n6PpbyzA", ""]
	},
	15018: {
		defindex: 15018,
		name: "Homemade Heater",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOw3xs9OQYbUpYdtPFsXWU6WCZF_84hg51fNafcGLoSjn2yW_M2hYWRq9_nVExrFgwILMcg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOw7x54vDMrYtZItOFsjVD_6BMgyu7kk61vdZLZTboCjojnvta2wPDUfu-3VExrFFYwt-EQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOw_xvdSSMLAsYtkfHpbRDKDXZwD860M7iKNfe8aJpXvm3X7paDhfXUW9qXVExrHPJTxoTg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOwjxsdHFOrV_Y45IHJLWWaeAMFj_uU880vAOJseIoSq6iyvoMmpYDhbv-HVExrEHqXzvqw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOwnx4tDPYeMqM99MH8jZW6LXYl36uE4w0aJcK8aLoyvv3C69bzsPDRfi8nVExrFdzVfh_Q"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOw2A4teFd-lqZcZIScXYXfSAMwn_70860_JbJpyOoX7riS3vM2kKDxXi8z5XmuSCv7E6nC9IFG4CS1gt", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOw6A4teFd-lqZcYfSciGXvfTYA2u7ko_h6dVKcPdoC3m3CzoOj8KDkXr8jhRyrSGueE9nC9IFA_aIJOS", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOw-A4teFd-lqZcZLS8jVXP7TYVz_v0Np06RcepTcqCq82Si_OzheXRfu_WkHyrSHu7JsnC9IFK2FwP1R", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOwiA4teFd-lqZcYeHsfVX6KCYg-p40tth_QMfZyNpXu8j3i6bjgJDhTu_2sMzbKE77FonC9IFNMTbMTe", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh3exfWDqxhVPo38QXtDSI67cZ3UcWJ4L4HOwmA4teFd-lqZcZIHsTYDv6BMAD4vkowgaddKZeO8yPoiyS6b2wOX0Hp8z4AzuCGvLNsnC9IFNwuUAEs"]
	},
	15019: {
		defindex: 15019,
		name: "Lumber From Down Under",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpNAZbQX_6DZw36u08whaFZLpKNo3vpj364P28KW0brrz8NnbKEu7Q_0GsIAy_n1OsWn6A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpOAcWCUvbXbgH1uRg_gKNeL8SKp37q2CXrPm1eUhvv8j9RzeOOvLc51GkIAy_nv-26u0U", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpPAcLVXqWBYVz5vE8-1aZee8PdoCnt3i7oODwCXBTurz0HyeaAvOdugTkIAy_nzoteDGY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpIAcbTC_DTM1uu7hk8ifVZKpaPpnm93y_qODgMUkbs-GMAmeGO77FuhjoIAy_nvojWRIE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpJAZLVCfeObl366ExqhPcPLMbdoHvvjyvvMm4KChLpr2oCm-fUvbFjgjoIAy_nXS3vyW0"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpNcJaFGbLfIFzjv0luhfBZK5WLpS-93XvhMz8IWRS4-20HnrSH7-RqgToRRnS2rb3Zqt65bKbJNHiNyg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpOcJaFGbLfIFzjv0luhfBZK5WLpS-93XvhMz8IWRS4-20HnrSH7-RqgToRRnS2rb3Zqt65bKZDwkeKjw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpPcJaFGbLfIFzjvxo5hqQLfJOOpCno1CXrb2YIXUe-8mkNzbTW6-Zq1m9HRCTi-bqIqt65bKYDVUybtQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpIcJaFGbLfIFzj4kk7gPUPJpzd9Sq9jCy8O29eDUDj821WmLCGu-A_impCR3Pm_r2FqN65bKah6TGp6g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28TfgHCow7dVlRti787QRJ0mx4NeEXPd5YZpJcJaFGbLfIFzjvB07gaFcLMDaqS3niHnoaGYDD0C4_WkDzbWF67RphD0WQSW4rr6LqN65bKazgAvlAg"]
	},
	15020: {
		defindex: 15020,
		name: "Iron Wood",
		hasWear: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXnub1RKwy6stfBN-YlOI5MGsWEUvCAZg2v6E04hKFeeZyAoyno3HjhbmkUG028Vn8gyYE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXkue0Dfg7p4ISXNrYrOYlLGMeEDKPUZgr97Us4iPVbLp2Io3_t3nzobDoUG028ivqk01I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXluboCLF7n5oWVNbV5YtFLF8OGCf-Eb1qp6xhu0aVYfJDaoCO-1C_hODgUG028nG6ftl0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXiueJVKFrps4vPZbF_NttNF8XWDvWENQr4vk851akIfpWKqXnq2CS8aGYUG028JQDmVy0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXjuboFLQjmvIWQYeMpZYoYFsPWDPbSMF37uUhq0_QPeZaBpiO82HvuPmgUG028woLyxwE"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXnyL0DOki28tfYNbR6ONofHZSBU_6CYwr46R1sgKlZLJGIqSPr3X7va2oNU0DorG4FmvjH5OVFUQEQaA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXkyL0DOki28tfYMrIqYtoZG8XUXaLQbg3_7B061addJ8CBoSm7jH-8MmoDCRfsrGwHn_jH5OXd2MFX-A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXlyL0DOki28tfYMLN-Zo0fGsfRUqeEZw77v009hqBZfcaJoSvn3CzgPmlZDhTq8mNXnvjH5OXA0MX6Yw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXiyL0DOki28tfYYLB-MdofS8aCD6CCMl2u70JshqcOesbYpi3r33m8PmkPXBDrrjkDmfjH5OXis3mtOw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_wo-wb7Big219BmVcXjyL0DOki28tfYZuF-MdlJGcnSXKDTNwD67Ug50qBZfsCJ9i3s3C_gOGoDUhft-21RmvjH5OXzmpZxeQ"]
	},
	15021: {
		defindex: 15021,
		name: "Country Crusher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDHLbUsOYxNG8HQXKfXMg_6401p1KRbLpWI8nzv1SrgOj0JUhvtq28CmbCZ-uw8TRFHyUI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDELbB4OIxMG8aDUqWHYgn-6hhs1adcK5KK8S_p2i_pOz0NW0Dvrm9Wn-eZ-uw8zUIS6zo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDFLbgpNopOSseBX6DQNwuuu0I7hPNZfcCL9S7mji-8bmheW0ftrmgNzOeZ-uw8J4Pm14U", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDCLbUrYo1MTMOBC_6HZ1iruUs9gPAMesOMoHno3Xnra2lbUhrprmNSy-CZ-uw87j1LCc0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDDLbF5NIpOGcTZXf6OYA6o7kxt1fNdfcGNpyK5jy3vPD8LCka6qGMGnrWZ-uw8JGSdOjQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDHXOZ5c5wVWZXOC_CHMg6ruU090qEIeZKMoSK53Ci6bjsKW0e4_24MzeLWuLY_gWgeF2_w87tibLKxEg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDEXOZ5c5wVWZXOX_PTYw7-uE5t1qFVJ5bd8ny-3yvva2YPDxTq-m0NkLSF7udi02gfF2_w87v7jbrzYw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDFXOZ5c5wVWZXOWfOEMF36vkk9hqZUfpTconzviCToOGwDWhO6_j9Sn-PUsuRp0D0QQ2_w87sZnrNNvQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDCXOZ5c5wVWZXOWqKFYwD04ho5hqULKZeLqC-823_gaDpZXUXj-joGm-XVuLpr1zxHRG_w87sRt8ogag", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywvjHCkm-t5gRsKl_74UFku65cDDXOZ5c5wVWZXOWafUMg_0vB8whPcOeZyKpX7oiyTuOzpfCBS4_msEnOaDsro_ijoUQG_w87veuf7t7w"]
	},
	15022: {
		defindex: 15022,
		name: "Plaid Potshotter",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlXZwW9tYWUMLUrOd9IS8bUC6TVZF_5u0I5hqJbLJOMoCzoiCy4Oj9YX0X1ujVToj6kj8I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlUZ1jnsIbEZrV4ZdAeH5bVU6WPZlv16kI-0addKZzf8iK73H7taG4MWRP1ujVTOObXA4M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlVZw7uvYaUNuQpZdodG5TRDvPXMAqv7x491KRaK8aK9Cm72X-4OjtfU0L1ujVTVBcpfak", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlSZ1js5YrBZeIpMo0aHZTTC_6HZl_66RlrhqQJJ5aLpnju1H_tbjxeUkH1ujVTMTcAI-Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlTZ1_v5YCUNLYlMdlEFpOFDPGGNV_4vx1q1vQILZHcoijr3XzoOG4PDhD1ujVTxHEFvZs"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlXFlq698afdeUyNNFJTcHZW_SEb1-p7Rg5hfUMKMeBoXnoiSXtPm9bXRHrqzpXkLOPu6wr3Dhx0x_muA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlUFlq698afdeUyMYxJGJPSUqWOYgz4608w0acPK8aOpHzo1CzvPW5ZXUHv_DkGnuaH76wr3DgeIOfClw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlVFlq698afdeUyYo0YHsOEDP6EYAGovE07h_UJeZyLoSjtjCq7bD1bWxPqrG1Vm-SA7qwr3Di3tEULsg", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fwP9EaxfVfEq-xz_ASgm_MJxa8Cz9qlTFlq698afdeUyNtBES8KFCKKPZQ2v6ktr1vIOJ8aApXvojyjqbG1eXUDj_WwMmLSCvqwr3DjVxdSmLA"]
	},
	15023: {
		defindex: 15023,
		name: "Shot in the Dark",
		hasWear: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDHLeIsYtxMH5KDDKfTblr_7E9tgKZfLcDc9Cjo3i7qbD0NXRS4_msDm7CZ-uw8-Rw0DSw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDELbIkYY1NSsaDWPDVMAH5vB1s1KBaKpTdoiy-2CrtaGgODkC_-W9XnLKZ-uw8vn3fE9M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDFLbh4Yt9NGsOGUqCGYFr1vxpug_UJJsTbpyy8iCXgM2teDUfu-mkMze6Z-uw8O0dEBq8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDCLbYrONAdHcbSWvbXMw75vEpq1qVUKcSI9n7qji7qOm4JWBa_-GwNm-6Z-uw8uHqGtpU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDDLbQkNdsdHcLRWaWOMF-ruRoxh6ZYesHb8n--2HzrOW5bWkHtqGoDmO-Z-uw8h6zT5dU"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDHXOZ5c5wVWZXOXaXVYQ396BhugacLfJOKqCrq3nm9bjsPU0Lr_G5Qn-PTs-BugTtCFm_w87v3MAWCKw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDEXOZ5c5wVWZXOXaKPb1ivuB9phaMMLpbcqSvn3CvpPG0LDxS6_jgHmOWFvuY_hmxAQG_w87sDMTFYZw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDFXOZ5c5wVWZXOUvDUYQz4u04-1PBfLpeJp3i51C-_bmYCUhG6_zpWyrWB6-Q61mwfSm_w87uhgkYE9w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDCXOZ5c5wVWZXOU6CPYgr9uU9u1aFZep2ApXu-1Hi9b20PX0K5rj0AmLDR6LY-gWxHRW_w87srrqUwFQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0fA3SBLJMVfM28Tf_ASgm4cl3XNKy9qkNFku65cDDXOZ5c5wVWZXOD_DXYFqs6Bpt0vQLK8SA83vo2ym4PmwLDRfrqD8DybCHvLpsgGcVR2_w87sVNdhI5A"]
	},
	15024: {
		defindex: 15024,
		name: "Blasted Bombardier",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPeYYFr8uxo4iadVe8ePpi662i_pPWZcXBru_GJRn7LW6bY6hW8SQne2qPLM95eStRlcYw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPSYNQj570kx0qIIe5CMpyO-iS66M2hZWBO6-j4MzuWGuuFi1GwTEnaxpfLM95c5KfnzHQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPWYb1up7R1qhvVaKZ2K8y6-1CnrMz9YCBK-_TkCmuGDs7Rvg2dERHHk__LM95fARjTL5Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPKYbwv7u01t1PUPepPb8n7r3i7uO2oLUkLsqWNQkbXWvbtoim8SFSPh-_LM95cwPFsJIA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPOYbwv66k48iaQIL5SMo3i-iS27OG0JDRbq_mgNzeDVs7BrgmhHFye3-PLM95fSWLTHRg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPfpMFy-rhJ-1b8Je5GIoCq8j3zoaGpZUxrv82sDnrXR77Y6hGxCFXTh_u7arMCvO_O22gBqhzGHt_wc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPTpMFy-rhJ-1b8JeZKAqCy83i_oOGpYWBXu-WtXzeDTvLJugWtDEnS1_7qL_8j8YKW_2gBqh-jVG8Ob", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPXpMFy-rhJ-1b9fKJyPqCjs1H_oMmlYUkXj-24EyeOHvrE9g2sSQHWw-b2I-MmoYPSx2gBqh0JSjyjl", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPLpMFy-rhJ-1b8OLp2Jpn_n1H_tOmgJCRDrrz5WzuLRs7Q4hzsTQXSxpeuJ-8KqO_Xk2gBqhxk0DPme", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0Zg3BCrlcU_g4-An5ByQ67dVcVtu35K8DLV6w6dCXceR1ZZojWJWBGPPpMFy-rhJ-1b9VeseBpX7r2y-_a24JWxLq_GgDmuWPurNi0G8eEnK3r-na-Mj5N_Ln2gBqhx6p4FJG"]
	},
	15025: {
		defindex: 15025,
		name: "Reclaimed Reanimator",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbEyYttMHsfZWKfTYlyv6B4-gKZbepyKqHy63H64bDxYCkG982IBmueDuqwr3DjiYoQHXw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbIyMtlEGsTSW6TXbgr5v01t1aNeeseJpSLp1Cm8M2tbCELt8z0NnuPSu6wr3DiIPxcRJA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbMyNtsYHsiGDPaFNwv4uB8w1qFVKZLc8Sru3yTtO2YCWEDjqWxQm-KP7qwr3DgXCi0gbg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbQyNo5MFsjQWvWANAj8uB1rgaYPecCLpym-3n_tP2wMWxXqr2wDzbPV66wr3Djoi8g7ZA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbUyN9saF8TTXPSDZg-uvkg-hqgLfcSJo3_v3HvqbmgDDUXu8zkNm7LUuKwr3DjDDtVjLQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbFDZo0PW5mWD-iBYA_66R8x06BYJ52M8yvr2SrvM2wKChbp8jlRm7eDs7JugmkVQnDis6zS_k6Pji9o", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbJDZo0PW5mWD-iDYAGuv05r06defsDdoyjq3ym9bm9fD0Xv-mMHnubVvOBigGofEXmxs6zS_nqD6b9h", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbNDZo0PW5mWD-jQMwiv7kI60qAOKZGKqHzr1CTsbDhZXha4_GJXzOeE6eBvhWYWFyKws6zS_lT829yw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbRDZo0PW5mWD-jVYVr44ks6gKEPKMPfpHvr3CW_PTgKWUK4rjoNyuOGuOE4imlARHaxs6zS_gaL9wBH", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqdwDLBrVQY-c_9wTtACo37NVmVdm_-roSJk6A89eXcbVDZo0PW5mWD-jXNQ6r605rg_BcLpeLpyPm2XvoP2wLXhK_8jgCn7WEvedqhm4WQHfjs6zS_uYP4VIs"]
	},
	15026: {
		defindex: 15026,
		name: "Antique Annihilator",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEMq56ZtwZHMHXWPCPb12vu01q1KkPe5CK9Hjt3irvbjwCCRvu-2oBn7eCpPI11XL5-3EF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEMa4sMt9NTpSGWf_XZA717E9s1KcJfZaBpHm5iHjpbmhYXhru_T0Cm-XTpPI11Ubz-yMV", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEMK5-MNxIG8LSW6OAblz86Ug41fdZfMfY8Si5iSq9P2pZUxPs_DkBkOPRpPI11QFtqV3G", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEN656OYsfS5PTD_OAYlurvEw4gqRfe5eLqSnm3CS6PGsODxG4qDkCn7OEpPI11dvgwP5A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOENq4tNowdGsnXW_CHMl_1vhk8iKQOLJCPpH_o1S2_bmcLXBvr-2tQzrTUpPI11WXg2cAk"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEMt96ZZsIRoaFRPSDM1z86UsxgqlbJpfYpS291SvsbDoCXkHr-jkMzrOFuudoijxHRiSu7bLbyBuIYdk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEMd96ZZsIRoaFRPODZA6ovE1rhaULJ5XapiLviHzha2tZXUW5-zlSy7eAuuA4hj5HR3au7bLbLr9GfaE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEMN96ZZsIRoaFRPWHbgD16kIwiKNaLpaOpy_viS68bjsNWBa4rG0NzeaCurE4gGpARSWu7bLbUmOTemk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7PghqewrLBrVQY_Q04AH9HCIz5slqXN669q8JO2Oo4dOEN996ZZsIRoaFRPSPZg_4vk9sh_NbJ5CL9njo33-7bG0MUxHs-W4AmuaA7uRu1mgUSiCu7bLbsPFu2_A", ""]
	},
	15027: {
		defindex: 15027,
		name: "Old Country",
		hasWear: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlXZ17r4dPDNLV5Nt9PGsbZW6COZA77u0k_0_JeL5GPoni81Cm_bmZeXBT1ujVTAjAHT-k", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlUZw25tYLGMOIqZNwZGsbYUvWCNwH14kkx06AOKp2Jo3no2SrpMjwCChv1ujVTKrbComY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlVZwy-sNbEMLkrNNBISsXRWqLTZwuv7hkxiPdbJsCI9iK-3XzsPjoCXUb1ujVTAVo4SUs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlSZw3otoDDZbJ5NItIGpGEWf-FYQ-u6kI7h6dVLJXd9Sy83yW8PWteCkf1ujVTNvCPEkA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlTZwzqvNeSOuR-M9waS8jRWKKGZF2u4x840fBafMDYpCu82CnuPjtcDkf1ujVTBgQJfXs"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlXFlq698afdeUyY9hMTsjRC_fTZQ6s40w41KVZJpaK8ynvjny9P2oMDxq4_WIDzuCBuawr3DhCzhg5WQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlUFlq698afdeUyN9BPG5TSUvSOYVysuE88g6dcfZOMqCvriH7gOGsLWEDir21SzrWA7Kwr3DgQusgoHg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlVFlq698afdeUyNNsaScLQXvCONFv4vho41KZae5SKoCO61Ci6bmheUhfu_TgFkOWD6Kwr3DgQFk9y6Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlSFlq698afdeUyZd1OHsjVC6WFMgz76B8x1vBUfceNoHnt1CvuPmcLCkXr82oMyuCOuawr3DjOOVnrSg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1dxLNDbZbTso1-AzvBjI8_NV6a8Cz9qlTFlq698afdeUyYtFMHpKBCfCAMgH4vxo51vBZKJOJpSrpjyy4bD0PWBS4-2xXnrPVv6wr3DhVdiTnPA"]
	},
	15028: {
		defindex: 15028,
		name: "American Pastoral",
		hasWear: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpNAZbUU_ODYwyr70NqiKhbLMSMqH7tiy7oaThcUhfqrDgAzO-HvbBtgmkIAy_nN5-_Ly4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpOAZbTCP7TZA2p6E86gaQPLJePpH_s3CjoOG5eDhK5qDgAybSH6LA5gDkIAy_nXm9bMi8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpPAcXTWqDVMlz1vB9rh6YJfZbd8y_n2y-8OWYDWRrjrmxSnLTTs7ts1D0IAy_nx-_wKwo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpIAZSCUvWEbl-r6kxu1qJfLJCPpXy-1X66P2kLXBDj_TkHzOeC7LFv1jwIAy_nqypQ6NE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpJAcGDWvTVYQ6o6ktthKheJ5WMoyru2X7sP2ZZDRq4qToHnueD7rs-hT4IAy_nq5e1In4"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpNcJaFGbLfIFzj7Ugx06cOKZLb9iK93ivsaGgJXBrp8z0Azu7Ru-A5hGYVRyW1rOSNoN65bKaaOtLb6Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpOcJaFGbLfIFzj7Ugx06cOKZLb9iK93ivsaGgJXBrp8z0Azu7Ru-A5hGYVRyW1rOSNoN65bKb5rFzb5w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpPcJaFGbLfIFzjuB1s0qVdfpOBoy263irsb2kCXhfo-TkDy-_Tu-Zq1D4TEiCwquSP_d65bKbxDF3rJw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpIcJaFGbLfIFzj6k4xhaBYfpyJ8n_sjCjgaWkMUxS6_T8FmbTRuLU4imkRSyfj-e6I-965bKZR7qRQpQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh1fQfJBLRSXeA09wDpGxgz5cJxXdS3-asHOkiw9tOaXPd5YZpJcJaFGbLfIFzjuEtu0qlYfJKIon7miC3qMzsIWhe5rGINzObR6LY6gT1EQSO4r-_e-t65bKbkNJqSwg"]
	},
	15029: {
		defindex: 15029,
		name: "Backcountry Blaster",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuMcZOG8mCC_KBZliuuE1t1PRfJsHdqHjv1XvubmdZDhvrqWpWnbKF6bM_nC9IFNmk88xj", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuMsZNS5XRDqePZVr7v0k-1fIPLZ2KpSvo2XnqPWsLCBW58m5SmrLW6ORvnC9IFMyrnV9_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuM8YYH5XQX_aCZgz5u0xphvJde5Tb9inm3S_rMz9fDRW5-jpSn7CPvbBpnC9IFFZEnzFk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuNMZPF5bRWvPXMg3-7hht1PNUfpPaoyLr3CroaGZbU0a4q2pXmuKPu7FunC9IFP08tSRT", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuNcZPTZLXWPaCNAqp6Uxt1qMILpSPpijujCnhP2kIDhLj_2xVzOOG6bNinC9IFMg8FW-y"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuMbcaSoOUA7DTeFj86kxsiKhdfsSP9Czv1CvsO2cNWEbvqWkMm7WHsrNthm0fFSKx_L2S6Z6uwCwhWOY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuMrcaSoOUA7DTeFj86kxsiKhdfsSP9Czv1CvsO2cNWEbvqWkMm7WHsrNthm0fFSKx_L2S6Z6uySfrHaY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuM7caSoOUA7DTeAqs6kls1KlVfsDY83vr2yvsb2ZfCRXo_m8DkOaO6bA_im4XSiC3q76S6Z6uQJVTVLw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuNLcaSoOUA7DTeAqs6kls1KlVfsDY83vr2yvsb2ZfCRXo_m8DkOaO6bA_im4XSiC3q76S6Z6u9PT7Muk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma2iRqlxVoOeK7Pgh0cQXWFaVMW-A0ywrtCiwx59JtQMWv9bcHOki69u2BZuFuNbcaSoOUA7DTeAr-6kg50qRdfJyNpCm93CXhP2gOUxHo_DlQne_Su7Jr1m5HEiPkpO-S6Z6usmnahZE"]
	},
	15030: {
		defindex: 15030,
		name: "Bovine Blazemaker",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEMq4pMI1IHpKDDPHSbwisu0Jt0qYLK8OM8yO533_gPzoJXRvsrzgGyuaPpPI11UPEGF2O", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEMa5-Y9hPHZGDCPLXYgH5709uhPdaeZSL9Hy61H68OWkMWRvrqWpSy-aEpPI11dnnd6lA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEMK4sMtFLF8DWXKSAYVv8vhk61qVYeceM8Sy83y27MjsPXhTr8joEkObWpPI11cnoiBm6", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEN64oYtEYTsGEX_eDY1uo70s-0qZbfsePqX7qi3u7aGwLX0C5_z4HmrCHpPI11darCNG9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOENq4qYt0dFpHXU6TXYFquuBlthakMKpfdoSu7jyXtMmkCUxfj-z4BmufVpPI11dXYCBdE"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEN996ZZsIRoaFRKWANA386Uhq1qVZJseOpSi93y_objgDWxriq2IAmOWP6edriz4fQXOu7bLbenGQSWs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEMd96ZZsIRoaFRPXXYQH87UM71aNVJpyP9CnpiS_sb2deWhbj_ToBkOCP6LE_0T5HRXau7bLbJDAk3ZM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEMN96ZZsIRoaFRPSAMg_-7UoxhvcILpGPqC68jC64aGYCXRfi-mtXnODT7-djhz4fRXiu7bLb52CFRVo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOEN996ZZsIRoaFRKWANA386Uhq1qVZJseOpSi93y_objgDWxriq2IAmOWP6edriz4fQXOu7bLbenGQSWs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF9gf6ACk36stiTtK79rADO2Oo4dOENt96ZZsIRoaFRP6CZlz94kg8g_BbLZeBoS_oiSnvaGwDW0DprmtRmueA7ro6128SQHmu7bLb-d1w0do"]
	},
	15031: {
		defindex: 15031,
		name: "War Room",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pYtAYGz8-kDLAm-soTPO7AvMthLSsPQC_-PYAr8vk8-ifBUecaPoi29jzOpZDmqWGb9Aw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pUtB9Tiou0CeQ-84dCSNbgvZdlOTsiFCPeDZ1j4v088gaJUecSOpC3u3zOpZDk-ZnaMZw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pQtANHg9bhUcAjusNPAZbksZtAaGZSBCPOAZV_0uB4whqMIfpzb8nztjjOpZDnkwcOfgw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pMtVdXvp-leLFrrsNbDZ-YtN9pMTZKDX6eFZAmo4xls0_NdfZeO9Xm8jjOpZDnmjVH6Lg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pItUoXup-pecAS8sYvHYLEtZI0aH8HQXvGEYAyv7Epr1PNdK5WAoiPq3TOpZDmo9wRD5A"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pZcUtKl47IQLBLtvIeXMLF5OYoZHZPQX_SFZFv8uB45gqkPJ8DfpSnp2Cm_aWdYDke55Ctaz8TJBtK-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pVcUtKl47IQLBK9soeTZbcqMt0YGMiBXfSObgiruUJrh_dbJsaApn7q2iXvP2hbUhq55Ctaz9d9qOCi", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pRcUtKl47IQLBLvttaSNOQtMNlFGZOBWf7QMF_84xo4gKVefceLoyrm1XzsMmwCUhru5Ctazysl_eCI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pNcUtKl47IQLBLsttHBNLYvMo0ZGJGCDqOCNQD-7Bg6g_QOL8CAoCu81Su6Mj0MChbq5Ctaz8o7ZK-5", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPrdfTuc1-wXTHiIz-pJcUtKl47IQLBLv5oLGNOV-ONhJSZTWX6OBM1usuR5s1KJaeZTY8iu82S_pOzwNXBC65Ctaz0Nii8M8"]
	},
	15032: {
		defindex: 15032,
		name: "Treadplate Tormenter",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUeBK8soeSMbUtY9EfHsjSXaDSZQ_-6RhriKdVLpXd9iy5iXvhbztbWke55Ctaz-oTEK8L", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUexLqtdGQM7R6Mt5ETJTXUqKOZwCo6k1r1KRcKJCM83zqiyq7OToIXBq95Ctazz_-aqTO", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUehLtsNDAZ-MsMd9MTcfXXvOFMw_06kJug6AOfsDc83zv3CXqOT8JWRC-5Ctaz8jIefdN", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUfRK6tYrHYeEvNIkdS8SEWaDUYQD1vh47iaVefZyNpCLr2SjrMzxfWRrq5Ctaz17bQ6Zb", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUfBK7sIPCYbQtOd1MS8LVX6CGZgv6vBlt0vMOLcbapC673im7aGgCDhW45Ctazwyz7viI"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUeGO54cGCavZ5LtlFHpXXWaSDMAyrvkw60qULK5CA9SPvjim4ODsCWxHr-28Gnu6Gurt1wjFBPDdzgIU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUe2O54cGCavZ5LtpFTcjZCaCPbgCuuEIwgKIJLsaP83nujyntPmpZXkLv_24AmOOHuLF1wjFBZbrVRGs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZhbHAKROUPQu8RzjGyo35tNmRuih8roUemO54cGCavZ5LosaTcWBD_-BYF36uENug_cMKpLYp3np3irvaGoLUxLu_WIGnLTTs7p1wjFBczLNTyc", "", ""]
	},
	15033: {
		defindex: 15033,
		name: "Bogtrotter",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlXZw3ts4OTZeN9OY1ITMGFXKLUb1z94x88iKNcKsSP8Sm9iS-6bjhbWhb1ujVT0IyTqAg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlUZwvnstCXYbMoZt0dSpPTWvCFYQuruE9r1KBfLJSL9S_siCW7OWteXhb1ujVTlLiv22U", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlVZ1274YTGYOIkONBJH8WFDP6DZA3_u0Nq0vIPKsbYoC_rji7pOzwKDxv1ujVTbiIDa3U", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlSZwzmtNDPO7koNtAYHcjRDqOAbwir40xp0aBZLMOBpHnt3XjoOm1fWhT1ujVT_vJo2-0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlTZwzvsYDPZrR-Mo0fScbRCPSENQ6s6kowgaBYKJOLo3_qjC7gM2oNChT1ujVTkmelZqo"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlXFlq698afdeUyZtFNSceFDqfSMwr560I8hqgOLpbY8X6-3S3hO2ZfXxXpqW8Cy-aD7qwr3DjQj-UDpA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlUFlq698afdeUyZtFNSceFDqfSMwr560I8hqgOLpbY8X6-3S3hO2ZfXxXpqW8Cy-aD7qwr3DiZmYhRbA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlVFlq698afdeUyZYweGcbQWP_SZFz4vEg7hqJUK8eAoy_tiSroOjxYDkW6qToHnOfVv6wr3DitvlSElQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlSFlq698afdeUyZYweGcbQWP_SZFz4vEg7hqJUK8eAoy_tiSroOjxYDkW6qToHnOfVv6wr3DiVKNokuQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPj53dxbQCKZSWco4-w_4Gygm_MJxa8Cz9qlTFlq698afdeUyYt4fS8eDD_KAYAv-uUw41PQMKJyLqH68iSjvOz8KU0K-_WsDy-TRuqwr3Dg8B-64nA"]
	},
	15034: {
		defindex: 15034,
		name: "Earth, Sky and Fire",
		hasWear: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDHLbkoY4xKTMbUD_HVbwD67Bg7h_RUecTb83vsiHm7Oz1YUxS5-mtSm-CZ-uw8xGVpX-Y", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDELeEsZIseGpLWWf_VNQz06Bg8gKVfLcaPoiK-33vtP2cLXxviq2NVnreZ-uw8F4-yTSE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDFLeYoON0ZTceBCPCCMg7-6k4_hqJeepyA8yq-2y_qbGYCWUDr-j9QmOKZ-uw8EWS91Hg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDCLeIvNt1EGMCEW6CPZQ_74kxu1PcMK5WMqSPr2y_rP2oJWUC--2gAkbOZ-uw8pvAEp8I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDDLbEvNI1PHcHXXPCFb1z6u0841qBYKZbb9Hvsi3i7bmtbWBW5r24HzbSZ-uw8UW9C5oI"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDHXOZ5c5wVWZXOXPLVZlz4ux88h6hVKMaIpSvqiC3gPGhcWhvp_G0NmbKBubc6g2kWEm_w87sPK-K3tQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDEXOZ5c5wVWZXOXqWCZlj-vhhqh_NYesGPpy7m3iTvaD8CChXj-z4BmOKA7OQ402oVQG_w87tC0UwOZw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDFXOZ5c5wVWZXOU6CCMFj47k0_hvVdKsCK9ny62SS8PT9bUhXurzoEzbCD6ONtimgfEm_w87vR_OcrNw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDCXOZ5c5wVWZXOWf-DNA_-uUhtgPVcfMGO83_p2y69aWxcXkft_mJSzbSPurE_imcfEW_w87vXZiAcpQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINyzPDZqdxDKE69JWecF8Qn-HS8h495iWtOw_qkDFku65cDDXOZ5c5wVWZXODKOCbwCpu0NriaAJK5KPon7niSjtOjgMCBXv-WoAzLeCueA_hjwSFW_w87ukNk7xSw"]
	},
	15035: {
		defindex: 15035,
		name: "Hickory Hole-Puncher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7uqoKSYeR-NN8ZScbXX6CEYgD8u0wx06UOL5KJ8iPoiSvuPDwKWhvt_D4a2LjQM3H2aY0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7tqofFMeUpYYweTsnSW6WDbgH66k0-iakOLJ3bpCPu1HjqMzgIWUe9q2sa2LjQQ7JPBBw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7sqteUOrYsOIxNTsjUUv6EZF34uEtugKZae5yJ9i682H68P24OU0C-qD0a2LjQ8ow-rgM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7rqtfEMLgrYokYHcTSW_fXNwj9uU5ugqFZepPfoC6523vsPmxfDkDprG4a2LjQ97rfa1Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7qqtDEN7N4OI1OGcjXU6fXNQ2uu08xg6VaKZeJ9n6-iCnvaWgPDxrvqWIa2LjQt3eNnqo"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7u29STcPR1do1SHMWCXvWPZQ71vh9rhvcJepeL9Hu9iXu7MmoLWkC4qGNRnOaDsrU_0XFWHSbYVHk4lg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7t29STcPR1do1SHMWCXvWPZQ71vh9rhvcJepeL9Hu9iXu7MmoLWkC4qGNRnOaDsrU_0XFWHSYb4RaC0w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7s29STcPR1do1STMDXWPKBN135uBppg_RUL5WKpCzt2SXsOD9cXRa-qz9SzrXWubNjgHFWHSa4SPJmCQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9CaldV_oo7QDjBSIi_clgXNKkyKwDKE7r29STcPR1do1SFsHQW6eAZwn7704xhqJUKJWOoCjn1Hy_bmsMXBbp8mhQmbSB6OBr13FWHSaaV6OoCg", ""]
	},
	15036: {
		defindex: 15036,
		name: "Spruce Deuce",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlXZw3vtdOVYbd_Nt9LHcDVXaTTYAD76xg9gKEJJ5WN8iLnjy26PTtYDhX1ujVTbEDQ4dE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlUZ1jsstPPN-EuYttNSsPZWvWOMlup7UxtgqlffpeMoy3ujCS8PDpZX0H1ujVTvUUV_qA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlVZwTotdfGYbQvOI5LHsmDCf-BMAn46EhqiPBbe8fcpXnu1S69aToPUxP1ujVT0E6MHqc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlSZ1--4YKXNrZ_M9geFpaFCKTVMgiv7h4wiahZLpPdpyjsiCu7O2ZbUhP1ujVToS28vg8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlTZw3p4YHHZ7J6NYxITMnVDPfXMl2r6BppiaRcK5aOpnvuiCvgMz8OU0D1ujVTWoA_Iyc"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlXFlq698afdeUyNNkeH5HRU6XUZA35uU8xhagJfceK9X_riSq4b28IW0Dv-WkBybeHv6wr3Djn-zIgeg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlUFlq698afdeUyOI4eHsbTXKfVNQ2rvB5rhKEOe5LbqC_o1C_gOmhbXxS58mpWkLWOuawr3Di-wqt4XA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlVFlq698afdeUyNY4ZTMaDD_7QY1306Ro_0_dffZKJpCzs3X66PmwCCEHr_m1Xy-LW7Kwr3Dij7AkQlQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlSFlq698afdeUyMtoYS8WEUqKBNFz84h0_0aQIfcCK8i3v237rMmoPDhW4_jkNmOHSs6wr3DhSFeaUgQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymMzZzZgHQBrVQY-Yq5h3vDCM3_cRma8Cz9qlTFlq698afdeUyNYpKGpXQXKfSb1z6uRhs06gMLpXb8iPm2Cy9OG5eDhO9_DhQyuHRs6wr3Di6SVxkig"]
	},
	15037: {
		defindex: 15037,
		name: "Team Sprayer",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pYtB9Pko-9SfQS6s4LBZeUqNd5IGMXYUv6HY1j76Bk5gPNUe8Pd9nnvjjOpZDmMS1hyFg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pUtAta1oLhWL1_r4YLFMuErOdxJTJTQDqDSNF-u7xpu1qFfK8DaoC2-izOpZDm8jqEhww", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pQtDYW3r-NSKwvosdCTMLEoMd4aHcbZX_DTYV__4kk6haQJfpDco3-81TOpZDnyqGReyA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pMtVdbgrr8Cfgi74oHDNuZ5M9kYF8aFW6KFMlj96Utp0agOLZaA9Xm-izOpZDnj83kK_w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pItAIGwp7hWeQm854POMeUkY4kfGsiBD6XTM1_56ENqhvQLLJCKoSi83DOpZDn7KTX_CA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pZcUtKl47IQLBK64oLGN7EoYotJScHRWfWAZl-o6B8_0_dVLpOJp3y6jCnpaTpeXkDj5CtazwxoMwOO", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pVcUtKl47IQLBK64oLGN7EoYotJScHRWfWAZl-o6B8_0_dVLpOJp3y6jCnpaTpeXkDj5CtazwW2mqkF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pRcUtKl47IQLBK9tNeSMbl6ON4fS8bWDPOAYgj67Ew_gvcPfJLfoiPn2Si4bm1fCkG65Ctaz6TDlbKe", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymPTBYZgHDDLNOTvQj8RrTHiIz-pNcUtKl47IQLBLrvYDFYrF5NIkYGMLZDP7SYFv77E48gfUOLJaLoCi82SjqM2kODhDp5Ctaz-SKVqDT", ""]
	},
	15038: {
		defindex: 15038,
		name: "Rooftop Wrangler",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpNAcHYXvLXNFj-6B9pg6VcKsSIpHjq1Ci6bmwNDxLorz5RmbOO7OBj0z0IAy_nlPlTxQg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpOAZSCXqKAbw766B06g6ZfLMTa8im6iCjrOWdeDkXv_z9QkeCA6OZihWcIAy_nbkEyILg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpPAcDQW_GDZAmp7BhpgaUIJ5KOoCm62im6b28LWUG6rmlRzO6Cubo-gjwIAy_nyRfdYK8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpIAcfZCKDXN1_7ux1thqNdLZXd9Czo2X_vaWcMD0K_8mMEm7ODvbs_1G4IAy_n796ze48", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpJAZWBC6PQNQipvx8_1vdffJDcoinsiy3taDhfXha_82wAn7OEuLA4hT4IAy_nuOSckGI"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpNcJaFGbLfIFzj7h4wh6kPL5GLpizq3XzuPjgJXka-rz8CzuTVu-Ri1GkWS3Gy_rmFrt65bKb2rkIRyA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpOcJaFGbLfIFzjvxpt1qFUJ8OB9nvp3ym6PDhZWRe_-28MmrWHu7Nsh2cWSyflrL_YqN65bKaxzjMfSg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpPcJaFGbLfIFzjvEswhqQLJ8SKo3y53SjqazteDhO4_mwHkbCG6LI-g2wfRiWw_Orf-t65bKZ-s60FuA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpIcJaFGbLfIFzj60041fNaLJCA8nu53nnoPW0IXBDi_2NQneeGsrc6gDsUR3jk-e-PrN65bKakkd6q2Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymJD5keR3ADq1cUPQv-gvkDDUN-shsUsO556wUKFK46NeEXPd5YZpJcJaFGbLfIFzj7Rg-hfIIKJGMoyrq3ni9bzxYCEfv_WhRzrLS7rFugzkXRXW5pe7Yrt65bKaka04HNQ"]
	},
	15039: {
		defindex: 15039,
		name: "Civil Servant",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakpvUHewXu4tSVMbQkMotMGcfWCPGFZl3_6R460fIOLpOPpSy-2Cq4O24KRVO1rflxVZcw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakpfVQLw28s4LHNLR9OdAeSsbZU6DUZAH1uB07hvVVKsaP9Hm723-6bGoLRVO1rV03KF6U", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakpPUDcQTptYLCMrArNtxNTsOGU6XQZFr_405qgvNbfJCLoSLr1Xi8M2sIRVO1rb6NXDz9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0Udako_UDcQ3usIbOZ7h6ZN1JSsbQD6COMAH-6U1q0_dVJ8bY8S27iH7gbjwCRVO1rdQbkEse", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakovUAL13rt9CTZrl5N98aTpWCDPXSYl316xk9hvAOKZaOpSu62yW9bmlbRVO1rX-F32ZS"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakpoQALE-r7cSTLeEuY4xNSZbRW_TSZwqs6k5p0aNfeceM9Xvs2Cu6bjoIXRTq-j1QneOZ-uw8TKOi_hA", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakpIQALE-r7cSTLbkuMdEdTciBWqOPZQys4k1r0aZULJWIpSu6iH7gPGYKUxO98msNmrSZ-uw8n9n_DLw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0Udako4QALE-r7cSTLeN9OIoYHZbSDPOCbwz5vx46iKNcK5yI8yvo33_oMj0JWxe5r24MzuKZ-uw85BxnEKo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4NTNudRHMPqNXSvw25w3-HyY8_Ph0UdakooQALE-r7cSTLeEqZI0fG5bQCaKEYQys4kxqgqYMLZXdqCO52njga20MXhDi-zhXzueZ-uw8g4Wa5Ok"]
	},
	15040: {
		defindex: 15040,
		name: "Citizen Pain",
		hasWear: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXnuepUe1-64oXFMOF4MtxOF8nVU_-CN1_040o41qJdL5SJpyzn1S3gP20UG028kd5QR4Y", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXkubhWcVrvsIbHYOEvNYweH5KGCPOEMgj77EM9iaYLLpaP8iu5iS29MmsUG0281tIxhv4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXlue5ULV3n4ofAYuMpNt1MHcOFCfOEMA-puUlpiPJZe5LdqXvt1C7sOmwUG02820nHOjg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXiuehVLF_mvYbDM-UvNYtLSpOCWf_QZg394kpsh_IJLMDfpCPsiSnqb2gUG0282xNMsW4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXjuewDcA3t5YSSN-ElM90dS8fTXaeDbwj06Bg6g6cJLMCK8im8jyvoOmYUG028NNCK1lQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXnyL0DOki28tfYN-V6NtEZFsTWDv-FNA_87E1rh6hdLZXfpXjriH-8OjoLWRDt_W8NyfjH5OW9bNpirw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXkyL0DOki28tfYZeZ_MtpKScSFXPfQbl35vE46hacOK8eKo37v3SXtPTwLWUDjr2MBzvjH5OXoBNid3g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXlyL0DOki28tfYZ7N_OIpEG5HVXKTTMFus701t0vcMfpKApy262SXsPDhZCRa682gBzfjH5OUxghkvCQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXiyL0DOki28tfYMuZ5Zd5IHcSFU6eAZl3-6B051PMML8bb8njq2SXrO24IDRC-qGkBmPjH5OUfT4chGw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINy4OTludRHMPqNXSPwg8Qb8CC4819BmVcXjyL0DOki28tfYYrN4No0eFpXTC_aANAn_7h5piPRbKpWLqC3o2CW7aDwMXBK-qzpVkfjH5OVwYk9S3Q"]
	},
	15041: {
		defindex: 15041,
		name: "Local Hero",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dUyGtKw9OtWeQ3nsIrPOrIpN9BEGcfWD6SOZFr0vEo8iPBeJp2NoHy93C73ejBdy26qO84", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dUxGoPh9r4EfV28vNPONrkoY9hJFpPTDPSBNFj040gxhaBdeZyP9n7t1CT3ejBdSHT6HxU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dUwGtLvpb9XcVi95tbDYLcvYY4YSZPRWKXUZA6p7xk61PdbeZDfqXvo3Sv3ejBdi-zD-tI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dU3GoS1r78DLAXmttOQYrB-ONoaH8HZDKKAYAr76UNuiKUOL5GM8i7t2Xj3ejBdLOLyCBI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dU2GoXupe9QKgjttIXDYbUuZNtFTpTZCPHTYg347U89hvBZfpPboirpiX73ejBdelQtliE"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dUya9Gz5K8PP1nxt4rAM-UoNtpJHMPRUvHQM1356EIxgKQMKp2KqS_m3i3rOmlZCELq-3VExrGA6Pskag", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dUxa9Gz5K8PP1nxt4rGMuMrY9AYS8LQWaTVM1v-4k85g6ldL8Dfo3_q3iS6O2hbDRq483VExrFhrKuHEg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dUwa9Gz5K8PP1nxtIbCMLN6NopPHJbTW_eGYQip6U5qg_BYJpyO8i7piHy8MmpYDRXo_HVExrGjniU_zg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dU3a9Gz5K8PP1nxtIWSM-MlYowZHZLSDKWAYlqo7Bg6hvVaKceI83u62Cm7bG8DCBHs83VExrHdBYa20w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINylOSRzfQj9Da9dXfky8RrjNjA36dU2a9Gz5K8PP1nxvIKQZbMpOd8aSpXQXv7VMg3_7U09hvNYLpCN83jmiS3vM2kLX0btrHVExrFex7cVQg"]
	},
	15042: {
		defindex: 15042,
		name: "Mayor",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYguYkxAYe09ukHfl7ttoTBZrB-ZItNH8fVCPeAbwr6uUts1PMJfpKAoCLow223barDxzc0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYguoliA4Tlp75RKw3m4YXFZ7h5Zd9PGMjVXPeFZlqp705s0akLe8bY83_rw223bdCkgJpJ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYgu4k3DIWypuNefF275YLHM7EpNNtLFsLWC_WENFqv4x851fdbe53Ypyvnw223bR2Mf5It", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYgvIk3UtTup-xSeAi85dTAZ7d-ONkfHsPZWaKBZgqs70JuhPIOJpKM9n7ow223bR9_hXsw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYgvYkwVoe1p7pRLQW7sILBMOUoN99ISsWEUqSHNQD66k05h6BUKJyN8Xi5w223bcWYjdSs"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYgufhlUcSi_q0DZ1q7toaXZ7glY9BFH8mDD6fVZg347kg6iKhUe5KLo3nviC-4PG5bUxf1ujVTJ2R2XKs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYguvhlUcSi_q0DZwTq5oHCM-V-Y9waHsjWD_bTNwyo7U060vVdK8Hbpnvm237hbjpbXBP1ujVT6w6i2PA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYgu_hlUcSi_q0DZwrutYHPM-J6OItIHJKGU_COYAmsuEs906UIeZLd9i3p2ijua24JXhr1ujVTS_NuY9Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynNSFofhLHE59TXew15jf7DCYgvPhlUcSi_q0DZwq6t4TGM7IqMNFIF8DVW_6BM1z66Ulp0aNcfcfYoCjo2X-8azgCWkD1ujVTW1sZghc", ""]
	},
	15043: {
		defindex: 15043,
		name: "Smalltown Bringdown",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctlSHpPYCKWDZgz_7EM5iakIKcfcpH6-2XnuM2YIXkW-8z4CnrCC6edqhHFWHSYyu1IHsA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctpSTpLXU6PXYFv970gxh6VcL5GM8nnm3i3taGcMCRW_-28EmuGG7OBv13FWHSZy1jxczQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9cttSSpSBCaCDYgiuvEo7iaJdfZaIqCu53HvuM2oIXRfv_G0Dm--F67Vi1HFWHSZdeA7J5Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctxSTcHUDKPSMgv0vE4-gKcLK8Db9ino1HnsbjwDUhPi_24GnuHVv7E5i3FWHSYn9M1Lug", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ct1SS8LSWqKBYA6r6Rg7g6JUe5TYpy_r3HnqbGkCXEXjrGMAnLKG6bo4hHFWHSbEtT21_A"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctkjSZWTHq_AMxf47Elph6FVLZOK8Sq7iCXoPGgPDhK__G9SnbKCvORihG0UFXO4_OWNt4CnZckmKWQU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctojSZWTHq_AMxf57kk9hqlaLMPY9Sjs23u9bDsLDRO4_z5Wn-COuLI4gGgXFSC0runet4CnZQ0oxuMh", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctsjSZWTHq_AMxf0uB5pgqYOJ8SNp3jt3yzgOGlYDhK9-W4BmbSO6ORsijtDRiDipeTet4CnZW7TtLsj", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ctwjSZWTHq_AMxf84k1ugqJcKJSP8y272X_uaGcOXha5825XzrKH7OZv0T1ASnS1_OyIt4CnZfM4JU1r", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINynPzRsdxDOALVQX_0_5jf_BCY-5NNsQ9m05bIILliw89ypdOV9ct0jSZWTHq_AMxev4xg4hfddKcfdqXvr1Crub28PDRq9rjhVzLDVvLpogTkQRHi1_r2Ft4CnZfV97NsR"]
	},
	15044: {
		defindex: 15044,
		name: "Civic Duty",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxBZnj9L9XK1nntdfEZbF_NdkfTseCU_LSZQD7vE9p0fVffJaNoi-93CTpJC5UDA5yF5jF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxBpnn87lWLAi7sIWQMrJ6YdBPH5XVXv_QMFqv7Uww06leK5HYoH6-2X7sJC5UDB9-4QUp", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxB5nirr0Cfl65vITHNbItYt8ZG8nVW_eAbw366Uw7hvIIe8CLpCzv33vqJC5UDITM2x52", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxAJnlpuMFeAzstdHPZ7h_MtkeSsGBWaKHYwH0vE0506dcfZ3Y9Snni37uJC5UDEDwp7Py", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxAZni9ehTewi6tNHAMrQkONlFHsPRW__TMwn97Rg9hqEJLZSBpiLpiS27JC5UDNpyoxA2"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxBeiw8qgSIEq6qoOQZrIsZNAfTZOCWvSAMwn9uxkw1qQLfJLYoii52i7sazgPX0e4qG8a2LjQLFtebvA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxBuiw8qgSIEq6qtHFOrAuOY4YS5KBXafQYQyr6Ek6h_AJe8SPoiruiy66Oz8IU0W5_Doa2LjQdBGd-2w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxB-iw8qgSIEq6qovDNbV5Zd9KGsjQW_6BNQ346R07g6lefpCM9Xzvjym8Mj1cDhTqrm8a2LjQ6hr7yYY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxAOiw8qgSIEq6qtDCYeN6ZIkaS5OEXKTSY1v94kw4gKlefZ2KoCrt3iW4OzwLWhHo-G0a2LjQJgphVWo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MazTN-lw5pINymODhzdRHMPqNXSvw58B34EBgl7cZxAeiw8qgSIEq6qoqSYrkvNdhMSsnZW_CBMA2v70k40qFYKZHcqCruiXy9Mz0PUkW9-2sa2LjQ17MxTpE"]
	},
	15045: {
		defindex: 15045,
		name: "Liquid Asset",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctlSHMLQUvOFMgH06R4_hfJefZeJqSvu2Hm8OGwLDhbq-m4HzrTT67FthnFWHSZF1AWXBw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctpSGpGFX_eCNFz0u0JqgvQOL8OB8ijt3Sq9PjxZWxbs_ToNn7LS7LI_inFWHSYTrrMU0w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9cttSHsSCW_CCNwn9vkowhaAIJ53c83y6iCjsa20IWhbp-D1SzOOCuOFv03FWHSavnq4KAA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctxSTciBWaeAZg7-601shKMOL5bcoXy-2y7rbGkIXUHtrG8EzuHSvLNu13FWHSYcxXuRDA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ct1SF5LVU_XTZF2u7E0_1fJeLZPdoy3vj368P21fD0C-_2gNnbfRubc4gXFWHSZn2Fd7qQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctkjSZWTHq_AMxf96EM5hPcPepDboCi-1XvoMmZfWBq6_24GmeKGuLI4hDkfSifm-bmFt4CnZdP4lp6h", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctojSZWTHq_AMxf07UM4iKReeZCJ9nnsiyXvb24LCUK-r2NXnrSGu-Bigm1EFiS4_-7Yt4CnZUuK0iUL", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctsjSZWTHq_AMxf56B1r0aBeKZCJ9C3miy-_aWkIWxa-_W9QzeSO6eM9128XEnex_7qKt4CnZdWCreJi", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ctwjSZWTHq_AMxf56B1r0aBeKZCJ9C3miy-_aWkIWxa-_W9QzeSO6eM9128XEnex_7qKt4CnZe8d1VX1", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcWN6n4rICKE-s4capdOV9ct0jSZWTHq_AMxes60hpiaZbJ8bdonjm3yi6MzgMXxHu-WsFzu7R7rE612xAEHPh-LmMt4CnZRHKD6JK"]
	},
	15046: {
		defindex: 15046,
		name: "Black Dahlia",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35epIfgvv5dHPNuN_NdBNSsLRWaDQZVv_6Es5hfUJLpXdpnjr1CvqaTwKUg2rpDzQxQXHRA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35elIcV7s4daXOuV4YY5PF8mCU_GAbg79u09qhKJfeZKOpnm-iXm6bjwMCg2rpDyR2875Eg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35ehIf1_p5deVOuQrMtxLG8bXC_eBNF-vu05uiKVcLMDapCPriHy9aTpeDg2rpDxqz59OFQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35e9IfV_ptoPOOrkuMt1JGZLUXPGDNQv4v08_h_BaepyOoCvojH6_a2xYDQ2rpDwiTFgbxw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35e5IcFjtsIfPMOV9YYlMHpTZX_-OZgr-60ps0adfKJfdpiO7iSq8OzwPXA2rpDzaM0uj6g"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35eo5L1ms8NuAZq56Y91FS5XTC_CCbgv87R45g6lbLZGP8njni3ntbD0PCEG9qD4DkeeApPI11VyVZOUm", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35ek5L1ms8NuAZq4rMdpES8CDC_GHbwCp7B5qgqJbepHb9i_m1CvqPG0KWEa6_m4Hm-GGpPI11S3nCYA0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35eg5L1ms8NuAZq4rMdpES8CDC_GHbwCp7B5qgqJbepHb9i_m1CvqPG0KWEa6_m4Hm-GGpPI11Qzon8FK", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35e85L1ms8NuAZq54MIxPH5LZDvSFMg6r6k1sifBbeZHdqSLp2C69O28OCEe-_2gNnbDWpPI11cmHWA9i", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhXvk79wPoCC8-4cZcQ9K35e45L1ms8NuAZq4tYYpPS5TRU6PTYQGs60kxgaIIKpaN8Xi63i3qPjxcUxDq-GlQne7TpPI11Z8_KvF8"]
	},
	15047: {
		defindex: 15047,
		name: "Lightning Rod",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUeBLrs4DCNbclYYlLTMXQX_KHZgz46UgxhfNdepOIpy_o23_sOmgPXUW_5CtazzoJC4ei", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUexLqvYvFZbUrOdhEScPRWv-PYgCrvBpsgKYJJpaKoS3si3zgbzsMUhDp5CtazykuutJD", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUehLvsIaXO7EpM9oaHpPVD6LTblj0uxk61KILLMeLoynm2i29PzwOCBq-5Ctaz1XY51eH", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUfRLp4dDBNLktOY1IS8GGD_fXbluuvk45gakJesCMpS3rjHjhPzteXRPo5Ctaz5Ioa9Yz", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUfBLnvIDEYrZ4OY4eS5HXDvWAYQCsvB04h6dYe8CN9S-82im6MzsOX0Xr5CtazyKJwQ_z"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUeGO54cGCavZ5LokZH8SCXveDY12pvx8w0qAPL5KMqS662i_hOmcCU0fv-WhSm-7Vv7Z1wjFBUgDJO1c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUe2O54cGCavZ5LtAZHMiCXKODM1iuvkM90_dcKcGA83vt2irpP28OX0a6_jkDmeePsuZ1wjFBnCAOqCg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUemO54cGCavZ5LttIGsmDDvDUNwr8vxk8gvdbe52LpHm93SnpOjsNWBS6_29VyrWG7LF1wjFBRptsuis", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUfWO54cGCavZ5LooZGsfWX6TSZQv16B89gPRUKMbY9im7jy_uMzhZCUG9rj0NnOKAu7p1wjFBpJuIh7A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0egvWBrVQY_kz8wD4By4879VsUOih8roUfGO54cGCavZ5LoxEHMPVCP6HYwv57Uo4g6NYLpKIqHjtiyu_OzsNXEC--GtVyeTR67N1wjFBJj3fCK0"]
	},
	15048: {
		defindex: 15048,
		name: "Pink Elephant",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpNAZSCXKXUMlqu7h06hakPJ8CJ9i_t3nm7M2ZYCEfuqW9XmbLRuLdu0D0IAy_nGYzb9jo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpOAcnRWfLTbwH470gwgfBYLcDa9H692H7gP20PChLsrDoMmOGDu-Zt1zoIAy_n_tjCZxc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpPAcLQU6WBM1j17h090aBYJsOM9SjsjyrvazsKXxK982wAzOLSuuNrg2wIAy_nfx3cyCU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpIAcLZWaKHZA2v6h89gqAIJsSNoCLsiS66OTtZWRW4-D9WmbfVu7Zt124IAy_nlCE1OL4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpJAcKBXvKEMw7-vk04gvAJJpzcoXm72H_sazwLXhK4-28My7PR7rJih2gIAy_nco1R3Ms"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpNcJaFGbLfIFzjvx48hfNcKcCIpXjpiX_ob2ZeDRTj8mpVkOaF7OM9020SEiPipL-Jr965bKaMGI0tFw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpOcJaFGbLfIFzj700wg_NZfseNp3jr3S_taTpfWBa_qW9Sm7KB77Bs1DtHQ3DkqL2Mrd65bKYtLj1-_w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpPcJaFGbLfIFzjvkMxh6VYfsGB8n6-jy-9PG8NCkC_-T4Cn-7UsrE6gj0SEXXi_-2Lr965bKaQCVM87w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpIcJaFGbLfIFzju0w-gvRVKcaPoi_r2inrPWcPXRXrrG1WmObRubA90TlARHa0-bqOr965bKZVfEtHNQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0Zg3BCrlcU_g4-An5ByQ67dVcRN64_L4KLEy35dyCXPd5YZpJcJaFGbLfIFzj6kwwhaReeZGNpCu-iCu6az1eWhfrr25WzeCBv-Rp0GwRSna0q-uEqd65bKbpJcBQQg"]
	},
	15049: {
		defindex: 15049,
		name: "Flash Fryer",
		hasWear: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2ttZzHNuV6N4lETsWEX_KGY1z0vB5uhKMOKMHaqH653Cy7a2kJU0Hi_zoGhqbZ7RuX4nWx", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2ttpzDZ7EoNtxPG5PVX_GHYg37vk0_g6kMesPa8Srr1XvpOThfUhS9rjhQhqbZ7YTud2gg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tt5yVZ-IrOd1LGsWGXvTXNFuo4x09hvdYJpXf8Xvv3y-7MmZfXEC482kBhqbZ7bF5kZBE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tsJyUZbcvY4xPGMeGX_aGMw367x0xg_VUeZHapivv2X7vOTxeU0G4rm8FhqbZ7YB6jgmz", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tsZzGZuQoYYoaTMbVW6eFZ1r8uUxqiPBVK8OLoyPqjCvgPG9cXkbj-jhVhqbZ7ddm0jfC"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tte2QZvNoaZ4ZAcGEWqePMAr6vE860_MOKMCIoS_p3CjuO2oKWxviqGNWze_Su-A9hm8IAy_npYF1b-M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2ttu2QZvNoaZ4ZAZTRUqWPNw76uEsxhKVeKpCJoCPviSXrOmZeDxa4_G1XnuCD6bE-gW8IAy_nI4Phmy8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tt-2QZvNoaZ4ZAcSGDPTQbwqp6U5r06lfJpTf9S6-jyu9aG4KX0Dv82kCzOCD6OBvgGgIAy_nGg58Ji4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tsO2QZvNoaZ4ZAZTYWKfUYAis7kM_gqddK5DbqCvp2CW9P24NU0Dr_m4FkOCHubc5gDkIAy_nWDrJMI0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTDysz-89lRs6z5YQRLF2tse2QZvNoaZ4ZAZSCWPCBNVr-4xo_iPdeLpeOoyntiSrpPT8JUhTi-GMNkOeA77Bp0zoIAy_nuLj26-E"]
	},
	15050: {
		defindex: 15050,
		name: "Spark of Life",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlXZ1rntdOUMOR9NN9KF5GBWfbVZgH97x0wgqNZKcHaoC253y3ta2kJCBT1ujVT25cqhBU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlUZ13ttIXPZuR4Zo1FTpKBWPWAZg_-7B1r1vIOfpLboHvq1HjrOjwICBb1ujVTdgTs0Ng", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlVZ13m4YHGYrV4YYtJTMTTUqXUZg74uEg_gKAPe5CI8SPr3ijoaD8JUhL1ujVTurZ0O_k", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlSZ1jntdaSZbl5OYpKScjZXvSPYgj-u01ug_BdL5yLoXjpjiXuPGhfUhH1ujVTeL78FnY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlTZ1rqsYaXNrgkM9hMSpWCWKKDbgCo6kM9iadfJ5LapHm6jC3sO2oCCRP1ujVTYY5S5kw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlXFlq698afdeUyYd9OGsaDU_fTNA_-6E9s0fUMesfbpC_o3CrtOzxZDkborGsAy-WFuqwr3DjTeaKPew", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlUFlq698afdeUyMN0YFsaFCfSPYAivuBprhfcMeseBqHvti364OGoPXxu-_G4GkO6Duawr3DjB9ny67w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlVFlq698afdeUyN98YTMjZC_-HZFz07ElsgvQJL8TYqXi7jCrvaW5bWhK4rjgBmuSF6awr3DhRZyGj5w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlSFlq698afdeUyNNhLH8OGW_WDZQ2svk1sgaAMesGBpinpiHvhO2kCWBC98mwNmOeO7Kwr3Di7e7V-bA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqdwDLBrVQY-Yq9RrnBiE-4cFma8Cz9qlTFlq698afdeUyM95KGsPRX_eGNAz56xg81qBcK5Lboi681CztaW4NXxO9-D9Sn-eCu6wr3Dju9KbGRw"]
	},
	15051: {
		defindex: 15051,
		name: "Dead Reckoner",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOw3xtIPONeUpY98YHpPVW6OFMwuo70Iw0fVdfpDc8yPpiS7hPGYJWxO4_nVExrE0dQc3fg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOw7x5YXAOuEuNo5OSpLSWfeGYAqs6Ehr1vNde5Hf9Hnm2iTrM2cMChru-HVExrGn2Elaiw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOw_xt9bCYbF9Y45JGMDQCfLXbwH_60pshqZYLZLd9i3q1STrbGYMXELi-nVExrGM7Wl01g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOwjxs9eUM7IlZNFNTsTVDKOAZAys6Elrh_JffMSMqS_qiyu8O20NXRHvq3VExrFoPJlR1g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOwnxtITPYbQqNdoZSsXSUvSCbw_970w50_JUJseL8iro1HvvOWcCXUDt-nVExrFXZ7zoeQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOw2A4teFd-lqZcYZSsWDWfLQNAj160g_hKFeJ5SL8Szp2CS6b2xbDRrtr2tSmeOGv7tonC9IFM_gNWi8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOw6A4teFd-lqZcZOF5bUWqWEMFj4vEg506MPe8CMpyvv2Cu9Oz8KX0Di_j0HmOWF6eRvnC9IFKQoqxc0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOw-A4teFd-lqZcZOF5bUWqWEMFj4vEg506MPe8CMpyvv2Cu9Oz8KX0Di_j0HmOWF6eRvnC9IFOWDo0c-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOwiA4teFd-lqZcYYHcmGDvWHYQio4x4806gJfpTY8yvrj3jvbjgCDRe__20Gy-XT6bNunC9IFJALZnPW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1dxLNDbZbTso-8QnoGyIx48htUcWJ4L4HOwmA4teFd-lqZcZITJOGWKSBMgz67B08g_NfKsTdoC65jH7uaW0NXELuqT9QmLPR7rE4nC9IFJdz-wDY"]
	},
	15052: {
		defindex: 15052,
		name: "Shell Shocker",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbEyY91NF5LZW_WDYgz94kxugaJbLsGN83zm2SnsM24OCBG6rGIEzrSE6Kwr3DjRlAgimw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbIyZdpKTpSBDqeBMgiu70w_h6BVJ5CL9ivu3CrpPG4PDxu6rmkFzeGF7Kwr3DgcwH-QNA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbMyN4lPTcTUD6PXbgCs4ko71fUMKcOIpC-53CW8OjxZWBG__W5XkbKOvqwr3DiMUXTPZQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbQyOdpKGMjTXfbUbgn6uBlqiKQMe8aKoX_s3H7vPWwIUkLo8mNVmbWEuawr3DiRAkqO0A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbUyOI5FTcKDCaXQZFr87k9uhaZZKMTY9iPoj3u6P2sKCRboq2kGzrCFvKwr3DiJDRPieA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbFDZo0PW5mWD-iEZlr8u0JsgaYJe5CM8ym73SS6bGpYChvr824Cy7XVv7dq1DsTFXDjs6zS_tsWEorb", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbJDZo0PW5mWD-iHZwv77R881qQOesffoyvujyjhP2leXBS--WxSzubWsrY512hDFXK1s6zS_mrBXOyA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbNDZo0PW5mWD-iCYQ6v6h1pgqhVecaBpn-92yy_OG4LXxLs-z5QzuWPu-RigGdAFiSws6zS_oeBf7Ic", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbRDZo0PW5mWD-jQNQj07Ug_hKEMfJKAqCq63Hm8OW9fWRfjr2JVmOaOu7Br12tFQHnks6zS_paS0UhW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgh4MJvWMS--LgNLE6A89eXcbVDZo0PW5mWD-iPMg7840hr06lVepeOpCnvjC68bjhbDxG-r2sBzeKHu7Fpi2gQSnfls6zS_hcP7_an"]
	},
	15053: {
		defindex: 15053,
		name: "Current Event",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2ttZzFNLkkZoxFF5XWXf-CbgGrvk9sgqcMe8aP8Sjsiyq6bmsPCEfj824ChqbZ7QqwmvuJ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2ttpyXMrQrYd5LGsGGX_SPMFqou01t1fJYLsOI9CrqjCW9MzwKXkHjqG8BhqbZ7fH56HS_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tt5zGN-QoYowaH8CCDKTXNFyu4xgwhqJaKsSJqHjr2SvrOGsMXEfprjkEhqbZ7WNDLThE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tsJzGZrgoNNFMScHVWaCBZwz-uEo7g6UMe5Xdoirq2X-4PDwOCEDqr2NShqbZ7aWXK7hl", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tsZzFMOYkYolMF8PWXvSFM1r7uE9rh6MMLp3do3_sjyy6bDpbWxu9q2sMhqbZ7dZi56lP"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tte2QZvNoaZ4ZAZTQXaSHbgH0uUpsh6IIKMSBoCy8iSi9OW5ZD0C-qGsAnuKF6bpugmYIAy_nwxndrb4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2ttu2QZvNoaZ4ZAZTQC_bQYlz54ks81vQMLMeO8n_uiCS9ODsICkDq-mtQm7CHuudoi2gIAy_nzLEO9As", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tt-2QZvNoaZ4ZAcTWWPfTYVqv601ph6RcLJKK9ni7jiroPz0ICBTs-zhWzOeFvbJjhW8IAy_nm1ynedE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tsO2QZvNoaZ4ZAcmGD_WAMF_8uEs-g6BVK5aI9Su62CjuPDpYWEbr-mIMnuKGu-c6124IAy_n6bdo5QQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0cQXWFaVMW-A0ywv5GzU35tNmQtK444QRLF2tse2QZvNoaZ4ZAcmGD_WAMF_8uEs-g6BVK5aI9Su62CjuPDpYWEbr-mIMnuKGu-c6124IAy_nQSKG0Qw"]
	},
	15054: {
		defindex: 15054,
		name: "Turbine Torcher",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbEyMd5KGMfWUveAZ1io4khriaVdLJbdoivr1S_gOD0JDRfsqD5VzbLTv6wr3Dgoz_mWpw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbIyNNoaTJXQCPWEbwz7uE84gqULL8Taoii8iyi7bmlYXha_-TkHnLfSvqwr3DilcN3tqA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbMyN9gfTZaBDPaGN1ip6EI71fVUK5CI9nnp2nzhPDsKWUe_-moBzeaPuKwr3DhRhcXcng", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbQyNdpIS8jXU_6Ablz0u0I8gqRZJ5eI9Cq72yTvOj8IXULp-2NWmbCOsqwr3Di9hra8Vg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbUyNIpPTpSCDvWFNVr1vkoxhfNfLpPcpSm81HzuPmZZDhO6qGtRmbSC6Kwr3Ditl6faBg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbFDZo0PW5mWD-iFbg2u7xk-ifdceZzcpHzn3S7vaGkIDhLu-TlSkeHV7-Ns1z0eEHe4s6zS_okfEjHE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbJDZo0PW5mWD-iAYwH1uE0_0fJbepOAoX682H-9bjxcDRrprD0CzeSA77Y40GwWQ3S4s6zS_voCnP6h", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbNDZo0PW5mWD-jTYgr_7E85gqZbe8GAqSu81HnoaDwIXBfs8z1VkeCAuuRs0TkWQHCys6zS_mKqvmwH", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbRDZo0PW5mWD-jSbgr6vkg60qVdfceNpCvq2S_sOGsDWBW4qzgGyuPT7OZrgDkTRCW3s6zS_hvmldh-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhhfgXPBLRWTvot8RrTHTIg6s5tUcO55bgOLE6A89eXcbVDZo0PW5mWD-iFMg794ksw1aZeJpCAoXzn3X_saWgLDhK--zkGkOSOvLs40GkWQHezs6zS_gkVcW0I"]
	},
	15055: {
		defindex: 15055,
		name: "Brick House",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35epIew-854HHMuJ5ZNkfF8fQWfeFZg367UI50qRbLJHfqSi72y_qOW1YXA2rpDxyKF6_Fw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35elIKgjss9HFN-MpON9KFsmCWaSAYVqo6RhsifIIJ5yB8y_p3nm4P2cLWg2rpDybHQbwhg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35ehIe1js4IuUM-Z9ONEaS8LVD6SGZF__6h85g6IJK5SO8inujCq4aWwCCg2rpDwGbc2BMg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35e9ILAXs4IDDYLEvOYxJTsmBWfSHMAn16Rhr0vUOfMaJpHnmj37pOmxYWA2rpDweZ9-pHQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35e5IcV3o4IKTZ7ckNN5EScTQCf_Sbg6p6UluiPNbJ8eLp3u51HjrO25eWg2rpDztOXLs8w"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35eo5L1ms8NuAZq54ZtweG8fQXvPVb1j4u0s4haBceZSMoiPv1H-4Pz1YXUbsrjlVy7LUpPI11end4YuF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35ek5L1ms8NuAZq4tNopFGsPZX_ODbw7_uUxt1KRceZ2AqSvu1S24MzhcChLp-T1WnePWpPI11aUzDnS-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35eg5L1ms8NuAZq56MYtITsHUWf-OZgv46UhpiaMMK5ONoC_v2S-_OTsLCULo-TgBnu-OpPI11USTl_u3", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35e85L1ms8NuAZq5-ZYtJG8KEX6CEZgn0uUk-hvNefMaMo3i923y_aDgCCUa6qWoNm-CDpPI11cByMrqW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQhqewrLBrVQY_co_QvnASgn-8JcQ9K35e45L1ms8NuAZq5-OY5LGMOBXKXSNVur60M70aYPfsSB8iPu1CnuOGhcW0K4_T4BnrDSpPI11U2WBmOr"]
	},
	15056: {
		defindex: 15056,
		name: "Sandstone Special",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2ttZzOM7Z6NY0ZScOECfHSbgisuUpthaRcKZOB8SjojCvsa2gPWxW__WtWhqbZ7cF8kj2o", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2ttpySO-F9NNFIF8bVWKLVYgz96hlq1qVeK5CMoXzt1SrhOG9ZCBDqqD0NhqbZ7RxVDMR2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tt5zAYeMqMt1JGsLYCPaAZluuv0hqgKZeLp2L9Hzv3XjtMj1eWkHo-ToGhqbZ7aTmfe4I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tsJzFMrUpNYweScHRD6CFZwD16ktr1fVcfpHdoSq5jC7pbjgDXBbs829RhqbZ7X238WbW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tsZyUZrUlN9BKSsLXDqeGM1z0701rgaIJLceApynvi3jsODpcCBW4_j4EhqbZ7exylRNK"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tte2QZvNoaZ4ZAcbRXKLVZF_14h44ifdZK8DY9X_q3Cvubz8DCBDj8mNVmeWO7rNsh2gIAy_niC0ux4A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2ttu2QZvNoaZ4ZAcbSUqeEMlz84k5u0fQIe8fa8X7sjCXvP2lZXxS5_z0MnuaDvuFigmgIAy_nD3KIw-c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tt-2QZvNoaZ4ZAcGCWvSFN1_-7B5phvUPKZWK8X7q1HzhbzgNWhrsqT4CmuKEvLtigGsIAy_n5N9GzsA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tsO2QZvNoaZ4ZAZPVD6DVZQur6R1q1qUPK8aApyroiHi9OGYKCRK--W1VkeCCvuNrg2oIAy_nVQnosmU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh3exfWDqxhT_Q08Bv4Bik3-9dmV963-4QRLF2tse2QZvNoaZ4ZAciEWKSEZgz74xowiKheLJza8yy92CThPjsCXRXu8jlSybOE7rBvhWkIAy_nmSSsB3s"]
	},
	15057: {
		defindex: 15057,
		name: "Aqua Marine",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDHLeIvMIpNGMHVX_DQMgD_4k9uhacMKsGBpy7s3njuPGcMUxrirjkNzu-Z-uw8NRAGWxg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDELeQsYokYScKFXaLQZ1is4hg6iaddLZKNoyq5jCq8a20PXRHi_mxSmbeZ-uw8rInoyN0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDFLbcpM4wdHciDCaDUbw3-ux44iKNeLZeBoSLqj369PD1YWRLr-20Gn-OZ-uw8nR4Y0-c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDCLeF6ZoxLGMfWW6TQMA7-7ktp0aAPKpyNqSm7j3-_aWsMWRLu-2wEn-OZ-uw8_WZM7lo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDDLbB5YtoZHcHXXKCDNwD66kNrhacLeZCB8n7piSXhMzoICRO_82gNmO-Z-uw8y_b11_M"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDHXOZ5c5wVWZXOW_7XYFip6R49gvdcK8eB83zs2SzpOGlbWhfv_GhRnrSB6-dshDtFEW_w87tlj22ABw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDEXOZ5c5wVWZXOC6KAYlj97Ew_06BYKceP8im93ynpOzxfXxG6_W4BnLKOu7Q5gj5FQG_w87tcprFVJw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDFXOZ5c5wVWZXOCf-FMl3_vBoxhfIJeZeO8izo1XnvOTsODRXurz0BmreF77ppg2YeRW_w87sf6AWNQA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDCXOZ5c5wVWZXOWfPVNw_0vh080aVffZaPpins2HzgMzoIWhfirGgMn-WOuLY5gD5AFm_w87uQpDdsaw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh1fQfJBLRSXeA09wDpGxgz-dJiWdak_rUDFku65cDDXOZ5c5wVWZXOCfTVMFv-600wh_RcKMPdpCvq3i3tPTsOCEbv8mIGmbCCu-dti2oeFm_w87upLW0jMQ"]
	},
	15058: {
		defindex: 15058,
		name: "Low Profile",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxBZnk9ONWKATm4NCQYbcuY98eTpHYW_XXYgr46Es8haVfeZPapyy5i3zrJC5UDALSWQLw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxBpnmpu1fcArv54bGZ7gqN9gYGpLXD_TTMFuru00wgqZbeZTbpCy7iX-6JC5UDJP7dO1M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxB5m1pLpRKlm75tbOO7IpNNtEHMCDC_eAZQv9vxhp1aULfsON9SLu3STuJC5UDFjUXSUf", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxAJmyorpULFq-4oOXYbQrONBEHZLZUveBMA347E1shvUOKcCPoyno2yq7JC5UDGCmXLvA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxAZnip-JXfwq6sNbPYrgkOYlETpGBCKXQMwCo7Bo-hfAPKpCNoiy91HnhJC5UDBKFc440"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxBeiw8qgSIEq6qtDFZ7IsYY5MTcaCC_OBZQyv4ho_iPReLpDc9nzviHu7bGpbWxO6_m0a2LjQhqx-8FQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxBuiw8qgSIEq6qtPENrgrZNxLS5XSCf_XZlz77Ew40aAIepHfpi7o3ym4OzhfCkXiq28a2LjQgk6oO60", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxB-iw8qgSIEq6qoKUZ-V6NN5FTpHQWPfTZFr04hg7haIPe5ePqX7q2CzsPG9YXBC__G0a2LjQrCc6mJU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxAOiw8qgSIEq6qoLDNuJ_YYpKGceEUqLXYAv440M8g6ZYfcaB9Hjp2n6_O28NX0bu8mka2LjQOtpirJs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fwP9Da9JTOc18gHgDBgl7cZxAeiw8qgSIEq6qoCQOuZ6ZNxJH8eGXPePYgiuvxg6iaIILJTaoirriHu6bG1YUhfpr20a2LjQdNqAE1g"]
	},
	15059: {
		defindex: 15059,
		name: "Thunderbolt",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2ttZyUM7V4MYoeFsKCXvDTNQz57U07gaZae5aApHi7iSy9PWtcUhXqqzhQhqbZ7fwqZwYs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2ttpzBYLcsN45KSZPVXf7VMlis700_gahVLZHcoXu61Sy4O28MChO_rGgAhqbZ7TgI9eqU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tt5zAZbUkZNhFScaFDKPTYV2suUJq0aFYLMSPqH-52CTvOTheDhfv_G4AhqbZ7Z2cBj2A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tsJzHZ7J_M9kfSsCBUvTQYVqruUJp0qRaJ5CL9CrniSm8aGgCU0e5-D4NhqbZ7QrqxgNv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tsZzEYLl9OI1IHMjQW6PTbwCuuRkwgKIMfpfYpi-53H-_OG1eDhu5-GNRhqbZ7XLkkgIx"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tte2QZvNoaZ4ZAceFWfWBMl356EJu1qYMJ5PconjuiC28OWcJXEbr_j9Qm-XUurQ6izkIAy_naoEELko", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2ttu2QZvNoaZ4ZAceFWfWBMl356EJu1qYMJ5PconjuiC28OWcJXEbr_j9Qm-XUurQ6izkIAy_n7BtxqKc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tt-2QZvNoaZ4ZAZXVWKXQbl-v7xo-06ZaeseI8XnqiH7hPm4CChrprD0Nm-GDs-M-gToIAy_nqRD3ulU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tsO2QZvNoaZ4ZAcLWWfaBYg71uUw_hfdbK8GPpyvri3i7PW8OU0biq28EmrWOvLtr1D0IAy_nbbBuf9c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayTl8lBNzO_amNQh0fA3SBLJMVfM28Tf4ATI87MJxVti644QRLF2tse2QZvNoaZ4ZAcSGUvXTYAj5uEtsgPJZLJeJpHu5jC7vOWpbCUXs-GwFze-PveY51GgIAy_nsIInyCA"]
	},
	15060: {
		defindex: 15060,
		name: "Macabre Web Pistol",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxBZnnpLhQfl6-4ouQNrEqNdlKHMfTXvaONQn1uRlrh6EPJpyKoHy72nm6JC5UDBG93_cW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxBpnmproFcQ7msNHPYuIqYosaH8PQCPOOZFyo6ko71qMLKZOJqC7p3njvJC5UDEXxD3DB", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxB5m18rlSf1m55oOXNLd4Y40ZHcWDWvaDZlr76xps0qhULMHc8n7q2ijtJC5UDMDWNIZ2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxAJnm9LhfKl3rttCQN7MvNNtITcLWXaOEZV_5vh44gvRUKceJ9SLn3S7oJC5UDCQlEGsB", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxAZm08eNSe17t5oTBNuItON9PSZbRU_GBNAyr6h44h6NfLJyLpHvr3Su8JC5UDNV43hOG"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxBeiw8qgSIEq6qoHPN7coMNhPSsfTC6CFbwyo7EhtgKUOeZWI8iPmjni7Oj8LXkC_-Toa2LjQD3A6G7I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxBuiw8qgSIEq6qtPEZbIlYokeHJHZXf7UZlr1405thqVeK8aBp3m8jizoOm9eUkXsqWsa2LjQb2A7NY4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxB-iw8qgSIEq6qoTGO7EvONxIFpLUXvGOZwH5uRo_hqlVfMHY9SPqjCjvbG9ZChvr-moa2LjQTtsSl5o", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxAOiw8qgSIEq6qoTGO7EvONxIFpLUXvGOZwH5uRo_hqlVfMHY9SPqjCjvbG9ZChvr-moa2LjQK98ptdE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9DKFdXfco8R_pCxgl7cZxAeiw8qgSIEq6qoLDNOZ-Md5FScXTWPeBZl2suBpu1qkIeZ3doiO6iH7gbzwCCBLu-j8a2LjQqnZoYnI"]
	},
	15061: {
		defindex: 15061,
		name: "Nutcracker Pistol",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxBZm38-JReQTr5dSUN7d_NN1FG8PRXvSFNAz07h061PNZLMOBoS263Ci6JC5UDGOo7xJg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxBpnn879WLw7o59DFZrQkOd8fG5SFWfGFZQCv6kI806NUL53ao3_p3iTpJC5UDNCoFZjI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxB5m3puMDeg7pvYeSNeZ-ZItOS8WECPeDZl-uvk491aVYKJOOoXjmjy7rJC5UDDfbJNmq", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxAJnuoO5Re1m9t4rAZ-Z-YoxFHJLUDP-FNwD86h5r06dcfMeP9Hm6jim6JC5UDH93Catn", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxAZnh9etee125t9DOOrR4MtwZHJXZCPCBMlqvuB0-h6kIfpaLpHnq2HzuJC5UDIdHCTyo"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxBeiw8qgSIEq6qtGSYrksZIxKG5WEWaSEZV_17kpsiKRdepSM9S_s3n7tPWpcXhK6rj8a2LjQM_oJLUs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxBuiw8qgSIEq6qovBN7UvM9tJHsmDXP6GZwGv7EprifBVKZWO9iy6iSjgbGYLUkboqzoa2LjQ8Afo77Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxB-iw8qgSIEq6qoOXZbYoN99IS5GCC_OHMgqu4kg7hKZfLJLdo37t2S-7b2ZcWELt_Wwa2LjQxAEj0g8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxAOiw8qgSIEq6qtGUZ-F-YdgfS8mBUv-HZQj46EJs1KZcK8Pf9i7miSvgPWdZWxK4rjka2LjQz3upO1g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINylOSRzfQj9D7VKX-c79wPpGxgl7cZxAeiw8qgSIEq6qoqUO7UtZokZHsOFXvWPZA2p409qg6cIKZDYoy-72S7sazoPWUW-8jga2LjQb1Ncmrk"]
	},
	15062: {
		defindex: 15062,
		name: "Boneyard Revolver",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxBZmwr-tXcA_v4NPGZrV6Nd9LTcHXWv-PM1r4vE9s1fUOeceP8n7p1SjoJC5UDGifkHwa", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxAJmyr79fcAzr5YPON-J9NtBFGZPQXaLXMgj_uElq0adfLJ3fpC_m1SzuJC5UDKmHVwka", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxB5m38b0EKgm-stHEYLJ5Md4aGpXRW_aOY1r6uR86ifdbLsSP9Hjp1C7sJC5UDACpW64F", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxAJmyr79fcAzr5YPON-J9NtBFGZPQXaLXMgj_uElq0adfLJ3fpC_m1SzuJC5UDKmHVwka", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxAZnjpO4Ffgi-sdHCZ-YsN91EHMCBXvaDYl_-uBk_g6hYK5SLqX7n2i6_JC5UDHrNDdym"],
		festives: ["", "", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxAOiw8qgSIEq6qovOO7kqOdhNTsDQWqWOb1r4v0k-0aULKMHYpH66jn7oPG1YUha__D8a2LjQDNE-cyQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59cU_s_7Qn-DRgl7cZxAeiw8qgSIEq6qoHOMrV6MttOGcOGD6eDbw6v4ktr1aYLLJHa8nvv1C_gMj8LWxq5qWoa2LjQdK-QDr4"]
	},
	15063: {
		defindex: 15063,
		name: "Wildwood Revolver",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxBZnurr5Qfwnv4dDANbElMN1KTJXYXfCBZFquuEk4iKdbLcHb9Xzu2SW8JC5UDD2dbEWe", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxBpmwob5ecAm5vNOUYrl9ZN8eG8PUWfCAbwn640g51KBbL5KO8y3u1H_uJC5UDJpiBMRm", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxB5m0oeNVelm9sNGUNrN5ZtEfF8aGD6XSYlj-v09t1qdcfZfbqCK82y_rJC5UDHV0qibh", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxAJnhoOtTLwm8t9DPM7F9MN1LTpLQDPXVZg_86ho-hqQOK8eI8yzn2S_rJC5UDBg3ZJUs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxAZnio71WLw7q4YXGZrQlY45EFpPVX_7UNA357Us4hKFUeZzcpyy63yroJC5UDOsJwSgH"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxBeiw8qgSIEq6qtbEM7B4NYlOSsGBXaKPMw7970JugPVZfpfb8i253Crsa24LWBvj_2ka2LjQRHICtpQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxBuiw8qgSIEq6qoeUNbV9YthKFsSEWKKHYA2r6Bk_iaVZfpXb9Szmj3vsODtfUkW9rmwa2LjQEQmpFu0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxB-iw8qgSIEq6qoSUZbAsM9pETZaGXfaFYwn_7xlu0aVUJ5Pfo3m62invb2ZbWUa4_jka2LjQyl2CO7Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxAOiw8qgSIEq6qoCQNrIvZItLTJOEUqKCNwmp7Us9gqhce8CKoXzp1C-4a2sIXBS9_m4a2LjQ7CV6-kA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59JVfk-4wfjDRgl7cZxAeiw8qgSIEq6qoKVZeYkYo1ISsLUCfbUbg38u08x1vRcK5Pa8X-92yTsbjtcWEHq-Gga2LjQqG8Eayc"]
	},
	15064: {
		defindex: 15064,
		name: "Macabre Web Revolver",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXnue1Qegzo54KTMbEpNNBFGMDZXP7UN1396ko60qNVKZLco3zv3izrbjgUG028vj8UEYU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXkuegDeQm-sIeQYbEtMd4aS8XUCPeEY12vvho_iaQIfZGApC3qjizqPWYUG0284Me90N0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXlub0CeQztvYPFM7l6M9xETMjVDvaPY1_06xo41aNdfZWI8Srq23noMjoUG028qtZk02c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXiubkHfwTrsIPENbV4M9oZH5LWXPKCMgCo40o6h_cOL5Df8y7s3izuOWgUG028f40rv3w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXjuegCKA3rsYvCYOR_YopJSsDVWaWEZFr_40kw06YLJsDd9inn2Su9PmYUG028_EKknYg"],
		festives: ["http://steamcommunity.com/market/listings/440/Festive%20Specialized%20Killstreak%20Macabre%20Web%20Revolver%20%28Factory%20New%29", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXkyL0DOki28tfYZuJ_Mo4aS8OGWKOAZF354kgx0acPecGBqXno3ynvOj8KXELq_W9XzvjH5OVabv95wg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXlyL0DOki28tfYZuJ_Mo4aS8OGWKOAZF354kgx0acPecGBqXno3ynvOj8KXELq_W9XzvjH5OWU0fH90w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXiyL0DOki28tfYYON5Yd1JF8KEWfTSYgj_4x1sgPAOfpGJoC-6jn-8bj1fCkC4-W1WzfjH5OWWUZFhpA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynNSFofhLHE59TXfY79hrpHiIw19BmVcXjyL0DOki28tfYZeQqN40ZGsSBX__SMw35ux9sgfdVJ8GJpn_njym4PDsLUhG_-GwDmfjH5OVLtQoetg"]
	},
	15065: {
		defindex: 15065,
		name: "Macabre Web Scattergun",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35epIfQTttoXGNuYpYolJHMaFU6XXMgz_4xgwg_IJfpCIqCu91X-7b2oKDQ2rpDxnIX1HRw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35elIfA25vNHFNOJ-N9lMGMXWDKWAZgupuB461PQJL8bYoSi7jCW_Om8IXQ2rpDxN7HoSPg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35ehIfA25vNHFNOJ-N9lMGMXWDKWAZgupuB461PQJL8bYoSi7jCW_Om8IXQ2rpDyrYDIXUw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35e9IcV25ttPEMeEkYowYGcWGDvSHYg-uvEJriadYKZKB8n7ojyXuazhbXw2rpDzlXW_msw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35e5IeVq9toaQNbl6N4pJFsfTCaLVYQisvEIw0aleKZGAon_rjHu6PDxeCg2rpDyX1qIw9g"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35eo5L1ms8NuAZq59Mt9ETsTTU_7XZwD6uEw7hvVYfcfcpSi-ji28OmsKDkC5rGtSkeeCpPI11YMWKntK", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35ek5L1ms8NuAZq59M4keTsXYWvOONQ2r4x1s1qhYfMCJqH_tiC_raTgDWkC6rGsMn-_VpPI11T9C_umr", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35eg5L1ms8NuAZq56ZowdF8SEDqPXMlyr7Eg7hvBdesOLo3i5iSq7aD8NDkLoqWsGyrTSpPI11VpLOA8a", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35e85L1ms8NuAZq5_OdsfF8aFXv-OZwGp4h47iaBZfceLoinv3S7hbDwIWkW6-DpVyeHSpPI11bEr1YKk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_g79wnuGyIl7cVcQ9K35e45L1ms8NuAZq4rOdwfSsmGDKWAYgr070k6gKNULpOKoSvrjnngMmoOWhO5-mkCmeGDpPI11aPZ3UzJ"]
	},
	15066: {
		defindex: 15066,
		name: "Autumn Flame Thrower",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXnubgHLAvvtIuUNLQpNNEdG8XUU_eBYw6uu049gKAJK8PaqCnr2ynpbj8UG028ldsEYtw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXkub5eLAnqt4TDNuYrZt4dSsnTDPGENQ_8uxg4gaFYKsSMoHnqjHi4aW8UG0282n0AiDM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXlubhfcQ7s5dPCYrF_MotJS8SBU_XQZwH97B47ifNbJ8HcqCu-iSzqPzgUG02853ymo2c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXiue9Tew7n4YLPZeF5Y9FITceBD_CBZVj64khrh6MMepOPonzuj3jtOzoUG028zZHAj4c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXjue9Tew7n4YLPZeF5Y9FITceBD_CBZVj64khrh6MMepOPonzuj3jtOzoUG028UOiFvJY"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXnyL0DOki28tfYO7h-OdxMGJPXXvbUNwH_60o8gadVLMONoyO52XjvM2kPUxLrqD9Qn_jH5OX-JGBOug", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXkyL0DOki28tfYO7h-OdxMGJPXXvbUNwH_60o8gadVLMONoyO52XjvM2kPUxLrqD9Qn_jH5OVa2DYf5Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXlyL0DOki28tfYZuV6YYpKTsfZCPLTMlyu7khuhKZbLcaJpi_m3SzuazsJDxbj_WsAnfjH5OW5-RyGlQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXiyL0DOki28tfYNrYvMd4aFpTWDP7VYAj4vxgxiPdeKsbbpym6iH_tP2lcWkC982sDkfjH5OVp--9LZw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF9R34HCo819BmVcXjyL0DOki28tfYZrMpZtpFHMmED_OPYVup4h9u1PVfLpDYqS3v3C_vPToLXEa4-DpQnfjH5OV_x2vT0w"]
	},
	15067: {
		defindex: 15067,
		name: "Pumpkin Patch Flame Thrower",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7uqoSVZuIlNY4eHsPSX_6FZ1upvhk9hPcLL5eO9n_viy28PmsIWhfi_Gwa2LjQjbmrEhA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7tqtPAZ7cpMtFNHMSCU6WOYlup4hk41qZUJsGBoizp3Xjuaz9bXkXi-mIa2LjQlKG-Z34", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7sqtPAZ7cpMtFNHMSCU6WOYlup4hk41qZUJsGBoizp3Xjuaz9bXkXi-mIa2LjQ4taLfNQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7rqobGO7B9NolJHsPYCfCDZlz0vk88gKEJK8GJ8yns2S_qOm9fCUC-qT8a2LjQSucF0Ek", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7qqovFYbUqN9gaSsGCU_KAbl2r4k89hKcMLpyP9CjtjH68OTxYXBq6rm0a2LjQW_SZeEM"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7u29STcPR1do1SG8mGWfKHZV_67k45iaVaLJWJoH_siHy_PG9ZCUK4qWoNmbOF6LRu03FWHSZYgyK0NA", "", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7r29STcPR1do1SHMmEC6SEMgyp6h49iaBZJ5zdqSu92H_vOG5eUxroqzkCm-7Tv7M91HFWHSaRZqxsBA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF5B3hGSw75tdiQNS-yKwDKE7q29STcPR1do1SScnUWP_UZF-u7UlqhqNZfJ2J9Cvr3n_qMj0OCkftqz8NzOHVvedt0HFWHSYp7l5CVw"]
	},
	15068: {
		defindex: 15068,
		name: "Nutcracker Flame Thrower",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUeBLqvYeXNuN4M9FPTJWFX6OCN1j0uE4_gfMPfMeJ9Cy-jyi7PmwID0bi5Ctaz26q70A-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUexLottGTM7ksMY5IHMPWWPSAbwqu4kJshfVaLJKBoC272SnpPTpfWBro5Ctaz29LyS_D", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUehK7touUNbArNN5NG8CFDP7TbwH97Eo81aJffZaLoyvo3yi6PGZbUxbi5Ctaz2V3VrTW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUfRLv5ofHZuEqONwdHMPSD_7UNAD96ko-06hcfZOOpy3o2y2_aWleDRK65Ctazzk_9B5m", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUfBLm5oTDNbYkZIxKHZSDU_GCbw_0ux9q1qNbKsPd9n661Hzta2heW0C55Ctaz3SCELKz"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUeGO54cGCavZ5Lt8YTJPTXPKPZAj7vxkwiPBbfZ2PoSvv3n_uOW0IXhq5_2NQnLPVu-Z1wjFB1WozEMg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUe2O54cGCavZ5LtpJG5bYWqeBYlv5vxpt0qBYJ5eKqX_o2XnhOG4KU0borzoDnOGG7-R1wjFBSuIzwaU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUemO54cGCavZ5LoseH8bQW_aONA_5vElq0aQOepOIpyO9iCTqPmdcW0fp_WgFyuOAvrV1wjFB_fkaJ5w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUfWO54cGCavZ5LtFNH8TSDPaFZViruU9qgaYMfZCLpHjsjC7uPToODUC-8j8Hy-aEu-Z1wjFBGyifCQc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyzPDZqdxDKE69JWecF-h34CjUz68xmRuih8roUfGO54cGCavZ5LopIGpPSWqTSY1366hpthaYJLJLYoy68iH7vMmsNXRG5_WoCm-SOuLN1wjFB6BL5a6o"]
	},
	15069: {
		defindex: 15069,
		name: "Nutcracker Scattergun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35epIKAm64ICTMrYrMIxOTsHQUvfSNwmu6Ug-g_Rde5zaqX65jH-7PT0OXQ2rpDwGHrMdMQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35ehIeg7vstPDMrIuMIwaF8HZX_OOZFv9u0I51vNdJsaPo3nvjyq6bj0PXg2rpDyMybGnRw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35ehIeg7vstPDMrIuMIwaF8HZX_OOZFv9u0I51vNdJsaPo3nvjyq6bj0PXg2rpDyMybGnRw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35e9IeAXt5tPBZ-YsNthOS8LSDvSPMwms4khphPRVKJOA8iK63XzoODwMXw2rpDzOd-nZKA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35e5If1-9tIGQZ7V5ON4eG8bTXKePN1396RhqgaEOeceM9nju1S_tMj0OCQ2rpDzofDRYPg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35eo5L1ms8NuAZq4pYo1KGZGFD__QZA71vE480aJee5fbpi7oiCzrOj0LCkDo_mMNkeOOpPI11R1n3_AV", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35ek5L1ms8NuAZq4kOIxITcjZXvOCNQ2p7E1p1KMIe8OB9C251Xzha2gCXxHqr24EmrXTpPI11ez7q56D", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35eg5L1ms8NuAZq4kYdFPH5bSWvPQN1v47E5rg6lfK5eJ9HztjyW4PmcJXBG48m8HzOfTpPI11cKvWcrE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35e85L1ms8NuAZq59ZNAfH5XUU_KEZQmp7E4x0qcOfpXaoyLt2Xy_aWhZWEfp82xVkOLTpPI11dhPhzRD", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymMzZzZgHQBrVQY_sv4Av-CCQ57dVcQ9K35e45L1ms8NuAZq54Mt1JTsLVC_WPbwD66E5tg6QJLJaKoSLrjyTpOmdbUxfjrjkFnuaFpPI11YVQe8da"]
	},
	15070: {
		defindex: 15070,
		name: "Pumpkin Patch Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOw3xvITHMLklOIlOTMjUX_bVZFr87Eg91PcIfpDaoCvt3SzgaGpbXRq9_3VExrFS8T62eg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOw7x5taXN7UkONtKGJOGW_GDYV_-6x44h_dULp3c9Crp2Xi4PmkNDxK5rnVExrH3pgscxQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOw_x5taXN7UkONtKGJOGW_GDYV_-6x44h_dULp3c9Crp2Xi4PmkNDxK5rnVExrE4lvhW4g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOwjxt4TFYuYkNI5FHJbYDvSDYA6uvE840aZcJ5Ddp3i-1STpMmhfChDu_HVExrGYJSKUfA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOwnxt4TFYuYkNI5FHJbYDvSDYA6uvE840aZcJ5Ddp3i-1STpMmhfChDu_HVExrGSXylEgA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOw2A4teFd-lqZcZLH5TXWqTUMwn66x0x0qNce8Haoyy82ynrPTsODhvu_2gFm-OHs-FvnC9IFIAmFgzg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOw6A4teFd-lqZcZLH5TXWqTUMwn66x0x0qNce8Haoyy82ynrPTsODhvu_2gFm-OHs-FvnC9IFLL8PGI8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOw-A4teFd-lqZcZNSsDRCPCHbgv64kM5gaEJLJDc9Hvt1HjqbjxeXxa6-z8DyeHUubE4nC9IFBCYofYm", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcoq4QX8Ai48-MZ3V9-J4L4HOwiA4teFd-lqZcZNSsDRCPCHbgv64kM5gaEJLJDc9Hvt1HjqbjxeXxa6-z8DyeHUubE4nC9IFH26tUge", ""]
	},
	15071: {
		defindex: 15071,
		name: "Boneyard Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakpvVXeAm94NTFYeQsOd8ZFsXUW6DQYgr9uBk7gqlde8Ha8nju3yntOmxfRVO1rY5Ulmbx", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakpfUEL13os4TOMrl_OY1LFpKGD6eAbw3-u0Nr1Kdfe5KAp3_s3Czuaz0JRVO1rQ7005XW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakpPUDelq6t9GVNOEqNtFNF5PQXvKHZwr0uxo4hvQOLZXaqSi5iHvtMmoMRVO1rRAGNrDy", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0Udako_UFflm-5YvEYeUoZdtMSZODWaKEYAr0vkw60fBaL8SLoizu1Hy9bztZRVO1raSzUJVy", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakovVQK1nsstTPMLcsMNxJG8PVCfeGbg377Ug9gKheLZbdpCjnjiW7bGsDRVO1rdtL-chn"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakpoQALE-r7cSTLbcvONEaGceBXKLVbgD67k5tgqALL5SBoCjr2yrrP2lfUhC-qD8AmeKZ-uw8lhSYWRE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakpYQALE-r7cSTLeYtZIpFScfRC_KBblqsvEg6gKkJfcCN8yLmiCrrOmhbCUe9rj5Xne-Z-uw82_l075c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakpIQALE-r7cSTLeQsNNxKS5bVUqeDYV-r60o8haNaJ8HYoCy72HjrOmleDxburmgFm-OZ-uw8Repmu3s", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0Udako4QALE-r7cSTLbQlOdwYHcHZUqfXYVio6h4x1adYK5SP9Cjo3Cq9PTwJX0fq_WkNnrCZ-uw8zOfN5g4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWco4-wbpECYg7Ph0UdakooQALE-r7cSTLbB6ON9OGMDUXKCFMlus7k05gPAOJ5Ldoyrp3ym9bzoKUhroqW4CzeOZ-uw8eTkyy9o"]
	},
	15072: {
		defindex: 15072,
		name: "Wildwood Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakpvVffFm7vdGTYbgvYd8aG5WEDvKAN1ivvhhtiadYJ5aP8SPn2yW9PWsMRVO1rTkgDr0X", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakpfUHKAy65YPEMLAuYo5NH5WFWfDXYw6s7UI5g_NZLJba9SO7jCXvOzoLRVO1rUEkTjz0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakpPVXewS9sYLPOrQrM4oYFsPWXPTUZwH46k04hPJfJ5Ddpnvs3iW_OTsCRVO1rXVCK8CZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0Udako_VXewS9sYLPOrQrM4oYFsPWXPTUZwH46k04hPJfJ5Ddpnvs3iW_OTsCRVO1rWsibca9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakovUAeVm-sYHAM7ktZdBLHcfQWqKGbgGp7UI_1KhfKJSApn7r3S3hOW8ORVO1rZXDJOxa"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakpoQALE-r7cSTLbMoMdxJGcaCW_HUYAr9vkNp1KRaKZLY9nu7jy-8PzheW0a-_m0DyeSZ-uw8bb6tEIg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakpYQALE-r7cSTLbMoMdxJGcaCW_HUYAr9vkNp1KRaKZLY9nu7jy-8PzheW0a-_m0DyeSZ-uw8vObagnc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0UdakpIQALE-r7cSTLeUtZN0dHcTZD_GBYg3-uxk-1PVYJ8HcpCvmiS_pPDsNWEW4_2kCzreZ-uw87cuJEbE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPj53dxbQCKZSWcot_QToHig97Ph0Udako4QALE-r7cSTLbV5OIkfGsXWU_eEYQH4400-h6lae8OO9S7o3yy_MmhZCkfq_mNWkOWZ-uw8nGmAN0Y", ""]
	},
	15073: {
		defindex: 15073,
		name: "Nutcracker Wrench",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxBZm1oOsHKg-9vIeUYrUqN9keHMbVU6eON1_-vBk_hKZYKZzfqSvn1X7pJC5UDHiiwJfh", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxBpnk9OgEe165tIHCYrAkYtpPFsDZWvaGZQivv09rgPVfLseM9im83ingJC5UDCD2hiAK", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxB5nuoutXel7v4IbEO7Z6ONFJG8XXCfOGb1v87x851alZLZTYpyu-ji29JC5UDMivKBz9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxAJnuoutXel7v4IbEO7Z6ONFJG8XXCfOGb1v87x851alZLZTYpyu-ji29JC5UDGH8Enyh", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxAZmzo-NTegq95tTDM-YkY99IGJTTC6ePNAGu7R08h6gOfJWLon_miXi6JC5UDARj58bk"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxBeiw8qgSIEq6qteTN7clNdBEF5aFD6LVMwGpv0tthaNeJ5fdpCrt2n64OWsNWxG9rD0a2LjQCOsqBGw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxBuiw8qgSIEq6qtOSMrUoMI1PGJTUWvWCM1v1u09ugahVe5GMqCu63STqbG4LCBXiq24a2LjQT7nhCOE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxB-iw8qgSIEq6qteVMLUuMo5EHMnWXf6FbwysuUg6haMML5zb8nzqiXnpbzgJWhu_rzga2LjQK-m-hos", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxAOiw8qgSIEq6qoTCYuMpM9AZHcTYX_aFMgiouB1p1qMIK5SKqCu-3SS_bGoJD0bpq2ga2LjQ7Eu-RgM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9D7VKX-c79wPpGxgl7cZxAeiw8qgSIEq6qtaVZ-EvN4xITMHXCKfVbwr87EI7iaIPe5TY8nm83i3vO2hbXEHtrGMa2LjQNg0Jjy4"]
	},
	15074: {
		defindex: 15074,
		name: "Autumn Wrench",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVjpp82BIOw9uoDfwzr4IeSN7IlMIpIG5KDCP-GZl396EI8h6NUJpKB8nvxnXO-3X5qYnM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVgppE1DNTmorlReAzn54KQMeIvONFIGZLQDvfXNFv07Uw_1aJVL5OBonvxnXO-NueWGQA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVhppFiV4a09r9QfAy6s4eTOrUpNYwaG8OEWqeDZQn1vB4-gKUOLJ2LoiPxnXO-H1owz9g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVmppRnA4_j9rpReA7q4IKQZrAqMNwYHsOEX6DTMw2uvhg9gvMLfJWBoX_xnXO-pakNEqw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVnppZmVoOw8r1SfF_n59STNbEpONFLTpLYCfGCMg_-7Ew6gqAPLcCMqSrxnXO-oBTDHbE"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVj18FmR8O_4b5ILAvqtYHOM-UqMtlIH8WEXaWPYA316Rk5haQLfZGJ9Xm93SnuOT8KWQ2rpDz-KJS4AA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVg18FmR8O_4b5IL1nmstTONOIuMIseHcbVXvXQYQn84xlqgKBZfMaOpSu5iyi4OGsKUg2rpDwS2oXlew", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVh18FmR8O_4b5IfQm94YGTOuUsNtgYHsHRXKCEMAD-7Ro4g6kOLp3Yp3m82y3hbzheWw2rpDyLKRV5bA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVm18FmR8O_4b5IKgjn5tGQMuEsN95LS5SEXfPQZA_4uExr0qEJKJPb9ni5i3u_OGoKXQ2rpDwrMQZHFA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9ALVKSfg0yx_pCDVn18FmR8O_4b5IeVrtsNGXNOEqY9BOSpHVUvSEYlz04xk7hvQMfZzf83y5337ga29YWw2rpDz5A2GhjA"]
	},
	15075: {
		defindex: 15075,
		name: "Boneyard Wrench",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pYtVdPv9LgHcF7rs9GVZrYlZt5IGMbYD6WCM1yrv00_haVZLZbcpCu9izOpZDkcOrzUmw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pUtV9a3ob1XfQ7ssdPGMrMpMdwaS8DSU6KONFz6vk070vUJeZ2No3nu1DOpZDm9-Mctkg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pQtUNXj9b5RKwztt9HEZrkoOdxEH5LVWPLSbg_16h841qUOfpCP9iu-3zOpZDnNrUR3KQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pMtB9Hho-tVLQ_nt4XCYeIsNttEGsPSCPHSYl_-4xhs1KBUK8OJpX--iDOpZDlj6bam8A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pItUI_voOwHL1_ttdfGYLB5NIxNScnVC6CPbwv87EI-0aVaLpCKqSLu1DOpZDkbBY9nWA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pZcUtKl47IQLBK7s4DPMLd-OdtEGMGFD6OEMAv47B4-0vdeLJbcoy_qjnnqPG4KCRC-5Ctaz7fjKILY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pVcUtKl47IQLBLmsYTCYeEpZtpJTMnQXaODbgz0uElshvUJLJHfpHjs3SW7PmkNXxrv5CtazzX4zzND", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pRcUtKl47IQLBLmsYTCYeEpZtpJTMnQXaODbgz0uElshvUJLJHfpHjs3SW7PmkNXxrv5Ctaz5STE5_e", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pNcUtKl47IQLBLnvYXGZrIpMdlITMLQWvGAZQH97Ew91qQJL5aPo3zrjnu7PD1YXhPv5CtazzaAbXq9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyiIjJpcQz9A69QWew75gzTHiIz-pJcUtKl47IQLBK9sYvBYuEoZtxNGZHRWaCAZ1v4vEIw1alUKJbf8iu6jC3saGsMWxbs5Ctaz7QWdvBl"]
	},
	15076: {
		defindex: 15076,
		name: "Wildwood SMG",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3Z87ZRlBYO387gFfljssIeVNbF_MN4fHMDRUvXQZgv-vBkx0aNfJsaNpjSvg3rf8aBo7A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3V8vMM0A4XipbkAfQvt4oaSNuF6Y9sYTsjTD6DUNwz96xoxhfJcKMPaqTSvg3o4XUct7g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3R8vMM0A4XipbkAfQvt4oaSNuF6Y9sYTsjTD6DUNwz96xoxhfJcKMPaqTSvg3rcMhrNOQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3N8vJZgA4Tj8rhUKA7stYLAM7l6M4pOSpPTWaDQbwv47E04iKZcLJ2P9DSvg3qCFfBiEQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3J8vJZgA4Tj8rhUKA7stYLAM7l6M4pOSpPTWaDQbwv47E04iKZcLJ2P9DSvg3rvyJOi7g"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3YN7sJwQN6g8vUDfFq8stCXN7AvYt9FHJKGXaLQY1_87BgwiaIOfZ2I9iLu2nu4PmgKRVO1rbMxhBz2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3UN7sJwQN6g8vUDfFq8stCXN7AvYt9FHJKGXaLQY1_87BgwiaIOfZ2I9iLu2nu4PmgKRVO1rcb3AzWk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3QN7sJwQN6g8vUEelm8vITGMbYlNI5EGsnTX6KAZgn7uUxu1qJZJ5GLpS-5iCvpaWYDRVO1rZVK6hdC", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3MN7sJwQN6g8vVQLAjnsNPDZbIkNdwdTMOEDvSBbw746RprialcK8Pb8Sy-2ivqPGkLRVO1rdtEBt1q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymPTBYZQ3OBbdRU_EF4w3tG3IN7sJwQN6g8vUDegvot9DOOrEvNdtFF8WGUvGFZVusvkw90fUJe52JqSjr2yi7MzoORVO1rYMAEs1C"]
	},
	15077: {
		defindex: 15077,
		name: "Autumn Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlXZw695oGQZuJ5ONtNGMfZWPSBZ1307x8_hPNYepyOpS_n2H_tOGcIWhP1ujVTCLenM88", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlUZw695oGQZuJ5ONtNGMfZWPSBZ1307x8_hPNYepyOpS_n2H_tOGcIWhP1ujVTI4re6zY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlVZ1i-s4PBMuJ4Y9lITsPTUvOBMgr-vhptgqQLe8HaoH69iCTtaWpbCEL1ujVTohEq5T8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlSZw665YLENrR-M45KF8KFD_eAM136vBk71aJafZTdpiq81SjuOWsNDUL1ujVTLnDXotk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlTZwvms9OSYrMtNtseHMLYC_OBNV-ouxo_g_NYLpSB9H7viSu_bjoJUhf1ujVTBzqm2kY"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlXFlq698afdeUyOIxMTJXXU_ODblv97k9qhKkOLsPf8n692yy8PW0OCkC98m1SzrKOv6wr3DjusqS22A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlUFlq698afdeUyON5ETJPUWPGPMw7-6kNq1KBVe5HcqCLvj3_vP29YWhS_-jgAzbKEuKwr3DjK4cFxqg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlVFlq698afdeUyOdpIScXSC_OBY1z-v0Iwh6BZKZLcp3zn2yzgOToMWkbqqDpXneSBv6wr3DgCZs6-Mw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlSFlq698afdeUyOYtMH8TTW_KOZ1354kox1fddfpKI8yrq3i3hbDsCXkDq_T5RnuOCvqwr3Dj1hwbxgg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTCDIm_cpta8Cz9qlTFlq698afdeUyNIlKHpKCX_KOZlz5uE9s1qBfJ8TYoiPt3nzpb2kJXRS682xXzeLSs6wr3DiL09Bk3Q"]
	},
	15078: {
		defindex: 15078,
		name: "Wildwood Medi Gun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dUyGoXm9uIFKgTv4tCQNuZ6YdFETsfUXfeHYVr86Ug8h6gIJ5aI9izrjir3ejBdwLCejxs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dUxGobjprpWcV_osoLHO-IqNI1KGcPWC6OOMwz_uU0806IJL8CAoXvp3X_3ejBdvrVIbgE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dUwGoXg8e1SeAXm4orBNLYlMdlJFseGUqfSY12v4ktpiaAMeZCA9i65jin3ejBdlZWwcQA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dU3Gofh9r5fLwrm4oOVO-ItYd0ZHceGCfHQZAj46R441aNVK5DdoiLn2nj3ejBdJCBXTBo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dU2GoK18bpWKAy5sILPZeIkMNkYHZLQWKKEbwn5u0k8haMIecOA9iK9iy73ejBdXm2m8do"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dUya9Gz5K8PP1nxvIGXMOJ9NIpEHsTZWv-FYAD8vkk9hvQIfJaI9C_ojy3tazhcXBC9r3VExrFsVOnsng", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dUxa9Gz5K8PP1nxttPAYbN9MdFETpHQCafTNV3_6Epu1fQIKJPfpSO53CS_OT1YWUXu-nVExrEdSkRndA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dUwa9Gz5K8PP1nx5oPDMOMoZd4eSZTQCf6FZ1z87k5qhqddeZ3dpCjt3H_gO2pbWRLuqHVExrHfPT359Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dU3a9Gz5K8PP1nxtoDCO7YrZt8eTsCCDKXVNw2o40hr0qkPL8SPqSy8iSm7bz0KD0G9qXVExrF2ffZm7g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4NTNudRHMPrdXUPEt-wfoNjA36dU2a9Gz5K8PP1nx5YDOZbh-OdtLTsCDDPePZlj0vEowg6VcLcaBpS_r3Cm9O2gIX0e9_3VExrEFjzawKA"]
	},
	15079: {
		defindex: 15079,
		name: "Macabre Web Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2ttZzAZ-IoYdtFGZHUWfeBMF2u7Ug7hqEPJ8CApH--2Cy6Mm1ZDRK_rmxQhqbZ7decaOBq", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2ttpyTNrUkMdwZHsXTDvHVYA796ks9hqVfL8fa9H-92iq8PTtZDUC5-mhRhqbZ7XKiMnXs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tt5zPMbB5Md5KG8CBWf7VY1r-v0o91PdVe5Taoiq-1C64P2kIUhLo_2MNhqbZ7Z16fSve", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tsJyTZ7cvZNpOTZWFDKLTYw3-70Nuh6AIe5SLqC671C3tPG1fWBG4qG9VhqbZ7fvnH2Kh", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tsZzBNbV-MNEZGpPTWqfSZA6suE0wgaRULpOMoy7miSjqbjxYUhe4q2NWhqbZ7WY_URBv"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tte2QZvNoaZ4ZAZKCUqeCYg_1vk9q0vNYKceL8y28ji3uaGwKCEe_-GgNmObR6bRo1GwIAy_nvbkZlU4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2ttu2QZvNoaZ4ZAZLTUqXXNQGo6Bg-1fNUfcGOpSO63C-9OjhYW0Li-m8AneOOuuBpg20IAy_nUYUFvNw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tt-2QZvNoaZ4ZAZLRU_7TMwuu70g91KlYLZSJpSu53y_vP2sKUkLv_moMyuCAuLFvg24IAy_nd67ATCk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tsO2QZvNoaZ4ZAZLRU_7TMwuu70g91KlYLZSJpSu53y_vP2sKUkLv_moMyuCAuLFvg24IAy_nE3T9oWI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINyyIjJpcwDHDaFLUvYy8RrTBCYx6cVxUcCz9YQRLF2tse2QZvNoaZ4ZAcXQUqXXbgj460841aZZLcCIqCjv1H66OjxZXBG__WsBzbOB67tpgzkIAy_nQUqXJvg"]
	},
	15080: {
		defindex: 15080,
		name: "Boneyard Knife",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYguYk2DNbkru9XeV7usYrCMOMtY9EYHMjUXPOPNQj46UwxiPRbeZKA8iLow223bYFYdYzN", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYguolhBIbhpb5Relm84ouVZuJ-Nt9EH5SDWvCFbwD54klphKlbLpbd8Xi7w223bUhP8Rjy", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYgu4liBYHhpbgHeAjpttfDMrV-N9xIGsOFUvCEZF37vB1sgqcIfpCJoH_vw223bQQT3oad", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYgvIlmVoLl8b9QLF7qtYfON-F4NNgdTsCBWaSDZw776Ehpg6gMfMONpCvtw223bY3UUdsY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYgvYkwUYTkor1fLA3usdTANOIpM9tJHMCDWqXUYFz17Rk-gKgOecHYoCjqw223bc0tpIXa"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYgufhlUcSi_q0DZwnq59fDNrJ5NIlMHMHQC_aCMA_07Ew7gqVeKZCMpHvr2ijsO2tbXBT1ujVTMf80LCg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYguvhlUcSi_q0DZwTqstHFMrMsY4lLS8XYXvKPZAD6vEI7g_BbfMHf9njn3X7gazoIXBv1ujVT457JI24", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYgu_hlUcSi_q0DZ1jq54LGYOMvNthPFsPWWfaHYV_8vkhtgPAPfpaPqCm6jHjgOGkLDhP1ujVTBgYrLyg", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy-Pj5hdzvADq5bRfQo8Df7DCYgvfhlUcSi_q0DZwy74tDAZrB_YtwZHZaGD6WFYV_060xuifdbfpCBpnu92ny_MmgOX0L1ujVTcZ4d_BY"]
	},
	15081: {
		defindex: 15081,
		name: "Autumn Rocket Launcher",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35epIe13m59CSMLMvZt0YHcWFC6TXNQD_vEk9g6FbLZ3d9n68ji6_PmxcDg2rpDxsFG6nbA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35elIeQzosoXHYuQvMo5PGsSGWvOBMliu6hhp1fMJecfcoSO51SXrb2lcXQ2rpDyIibBi_A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35ehIKg685dbFOrglOIxOG8XUXaXUbg79vks60qRbfpDbo3nm3XvhOD8IXA2rpDx-6a8qQQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35e9If1rvsorOM-F-NdEfFsbZWPKDMFr77x0-gPcMeZCM9i69iS7hPWtcDQ2rpDwRbj3R2A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35e5If1rvsorOM-F-NdEfFsbZWPKDMFr77x0-gPcMeZCM9i69iS7hPWtcDQ2rpDxcBtw8DQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35eo5L1ms8NuAZq54NY0ZG8LYD_SEYA6p705q0alcKcaIqH_q1SztOjoNWxe4-G0DzuSHpPI11Xywcf03", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35ek5L1ms8NuAZq4tMtAaSpXSD_CFbwj94h4xh_NdepDaoSLti3ntO2pbCkLu82tSmeSEpPI11b7ORwqe", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35eg5L1ms8NuAZq56YY5NS8jYC_bQZwn-vx4_hKNaLJGOqH683SroaG8IDxviq2oBnbTRpPI11XTlUU0-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35e85L1ms8NuAZq4rM99NTZaECP6CMAj-405tgqlYfZGLqSzm2yTvaTwOCUDo_T4MmeaCpPI11bykLypq", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINynPzRsdxDOALVQX_0_5jftHDMn5clcQ9K35e45L1ms8NuAZq55NtweGJHWXP6AMg756006g6dbfpOI837o3n67bm4LUkHirG9RzeSCpPI11WneSeKK"]
	},
	15082: {
		defindex: 15082,
		name: "Autumn Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7uqtOXZeQtZNBNGJGDDPHTYw36uxk5hPdZfJ3coCq-2n7qazgOCBTq_D0a2LjQHwQgLd4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7tqofAMrEkN4wfHcfSWaDTNFirv0lp1fRafZXc9inv1H_sa25YUxbv_mIa2LjQzIOArmE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7sqoLOZ7EkYdwfGcSBCKTXNVv4vhlt0fJUepSPpSq93Xy4azgJXBDs-mwa2LjQ4KEwQQ0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7rqoLOZ7EkYdwfGcSBCKTXNVv4vhlt0fJUepSPpSq93Xy4azgJXBDs-mwa2LjQLZoNcbc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7qqoDAZbMtNIxPScfTUqLUNQGs7xpq0qAIKMCOoS3v2yy4PGxZXRHorG8a2LjQYdO4pHc"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7u29STcPR1do1SS5OBWv-CYQ_5vkk80akPLZGM8nvq2yi8bz9cDkLtqG8HnbWDvbo_gXFWHSaXdHYDdQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7t29STcPR1do1SGcfSXKKOY1_76Bk41fVYKpTcpC7miX7sMzwIUxK__mJXke_Uu-Y5hHFWHSa5UWdD1A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7s29STcPR1do1SGsDSXfPQZV_0u0psg6RbKZGL83-5iS-7aToLXRHj_mwMne7TubtuhXFWHSaP8hfTrg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7r29STcPR1do1SGsDSXfPQZV_0u0psg6RbKZGL83-5iS-7aToLXRHj_mwMne7TubtuhXFWHSY9ZSGJjg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN6dJ3Qdq4yKwDKE7q29STcPR1do1SSpXWDPCCZwH16khs0vBUJpTYpS-723_tMmxbWkXt_WsAkbLT6-Q_1nFWHSa7YkYRkw"]
	},
	15083: {
		defindex: 15083,
		name: "Pumpkin Patch Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvItLt4YTseDWPKPbgD-vB5ug6BZKsCJ83jmji3ubG8CCkXjrjgAkOKOubF1wjFBSk53shM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIuLtgZH5HZWKCBMAj1vkluhfMOLZbf9CvsjH7hPmhcDRbo82kEmbOC6eF1wjFBBvLloW4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIvLtwYTMfVDvGFbgirv01p0aVeecCLoino1Xu8P29eDxG9qGhXzrXR7rt1wjFBZ5sSZnU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIoLopFFsLRWfCDZFyv6k5phaRbKZSP9Cvq2C7saGYLXBLj_joAkeKH7-F1wjFB5eB37nk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIpLtkdHcbUCaeAM1306Rk-hqYOKJCNqSLqi3m8aWheCkfs_mIHmeGCs7R1wjFBp_BrZMI"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvItX44ZXISJHKOYbg_97x8w1qUOLpOMqXy7i3ngaG1cD0C_-mMDn-SA6OZr0zoSR3O3q_LM95dgIHMF1g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIuX44ZXISJHKOYYg_4vh5r1fQJLpWK9C2-2X_gPGYMXhLirm9Vne7WvbU90G9AFXflpfLM95foZ6Mumg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIvX44ZXISJHKOYZw6ovEhu1PULJseKqCrmiS3obmoODxW6qW8Fm-6Bv7VohW4REiXlpfLM95dnoYMgTg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIoX44ZXISJHKOYYFj8vB44g_JefZKIqXjqi3i9bzwOD0G58z5Qm-GO7rVugj4XECS0r_LM95fYnwdTVA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN-NJuRNy_-asHPV-328WTYvIpX44ZXISJHKOYMAr-v044hvIPL8aJ9X-9iSS8P25YX0fi_ToMzbPU77Fp1z5ERiC3-fLM95fPHg1tNw"]
	},
	15084: {
		defindex: 15084,
		name: "Macabre Web Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEMq56MoxLSsLQCPDQYgis6Eg4iKEOKpbfqC7oiC7oPDtfWRO__WNWzuOBpPI11QWlvYZ-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEMa4tNY0dSsXTWKOBN1yp6kpphfdeKZfd8ym5i3zoa2oPXRXr8mIMzLPWpPI11ZAAJyhy", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEMK4oY9hFS8nVXvPXYAivu01pgfVaLpHbpXy-jyrqbGcNWRHiqWgFkLCCpPI11X-T_aLB", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEN64lMYtJTsnVDqDVZl2p6B5q1vNVKZKOpyzp2CrvbjsIUkLv-2lXmO6BpPI11VEYuotr", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOENq56YYwaTpGGW_LSNQ3740g70qdVepCA83zriSroaWsLWEC9rDlRn-7WpPI11SBJd3Q4"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEMt96ZZsIRoaFRP-GNFyv4h4x1PBbfZbcqHu82Si9OT0CWBrr_20BmuOB7LBj0T5FEiWu7bLbrAJaVtk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEMd96ZZsIRoaFRKSBMg-vuUtsh_Beecbc8nm7iyXgOm0JUhPrrGgGm7KHuLc902cTRSWu7bLb9VSX1R8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEMN96ZZsIRoaFRKSAbliu4k05h_cJfpDa9Cq73XnqPjxeWkG5_mIFnOSB7-Rv1jtAS3Cu7bLbxlqdF0I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOEN996ZZsIRoaFRP6GMgj0uUwwh6UPfcSB9Hy82nvsOTsJUxbq8mgBnrLUsrZsgDlCS3Cu7bLbCkicCp0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymJD5keR3ADq1cUPQv-gvkDDUN5cZgVdWk8qwDK2Oo4dOENt96ZZsIRoaFRKOBMwiu6EI8h6BZfsCMqSLp2C_saTgDCUa-_moMkLfSu-Nt0GlDRHiu7bLbD5Dm-O8"]
	},
	15085: {
		defindex: 15085,
		name: "Autumn Shotgun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYguYlgUoK09L9WLVjmsoOVZ-F9N91JF8bXX_aFNVj6uU440_BUfp3foCzrw223bYLieSou", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYguolhBtWzoO4HLw_rtYLGZ7h5NN8dG8PYU_-FbwGs6B5p1vNZJ53a9inuw223baB6nwnR", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgu4lhA4-09r5Ueg_v4YXOOrR9ZdtFHMCCDqXUNwGo70o7iKNaesON8Xnvw223bd22Ei42", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgvIlnUdPkorpefA67t4WVYeUsN9lPScWFCPGCZgH47Ehs0qBbKMGMpC-8w223bWxwFJgv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgvYlnBIblo-9fKAvt5oKVOrl-ONEeS8bQW6KAYlr04x49gahYKJaBpnzow223bWwT5S-V"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgufhlUcSi_q0DZw695oeSOrd_Yd9EGsjWWvKAZgz_uR1tgqcPKpaAoyy52Cq7bjgPWBX1ujVTMbCor98", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYguvhlUcSi_q0DZ1jp4oqVYuUpMY1KTpHTU6WAbwz-7EJpg_UIKpGBpnjn3iS4bjoKWUL1ujVTdQ49kJs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgu_hlUcSi_q0DZwy654SQZbN_MIpNHsOCCPKCYAn4vEhugKlYJ5SN9X_p3ii_MjsJWRX1ujVTKZMyjYA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgvPhlUcSi_q0DZwu7sdPBYeQtMdtJTsnSX_TVZgr06Ug81fdUL8eAqCPs1S3qO2oIXhv1ujVTkuRXhqE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINymODhzdRHMPqFLSOA3-jf7DCYgvfhlUcSi_q0DZ1nqtYXFOrV5Y9tNS5OGXPeHblir60o-h6AML8SJpn682i3haG4NCRr1ujVTuZPxWZA"]
	},
	15086: {
		defindex: 15086,
		name: "Macabre Web Minigun",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRob4oL8CcA7qttDFZbUvZtEZGJLYUqeFZgH-4x1q06BcfZaJ9iru3C2_PXBKBUS9prhFlw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoX4oL8CcA7qttDFZbUvZtEZGJLYUqeFZgH-4x1q06BcfZaJ9iru3C2_PXBKBUQ8RyTYzA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoT4r-MFeV7tsdaSYrMlMtBOH5bRXvPTMFip70k5ifNZJsCPpX_oiSvvb3BKBUTZ0yAaLw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoP49e0CLFrv4tDHYeItNoseHsPYX6eBYgn_7UJr0qEOKpfYoHjpiSXqaHBKBUSERiPAeQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoL48r9WeFm65YaQYLguMYxOS8nZWaXUZA6p7xlphalUKceI8yrpjC-8OHBKBUQg0N5isA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoaJ8b4VPVWp4ZzCZ7B9ZdpOSpLVCffVNVv7uEw7h_QJfpOBpSK62n_uOjsCXRDp_zkEhqbZ7WGcjq8m", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoWJ8b4VPVWp4ZzAO7V6Mt9NTcmBX6WCZACvuRht1alZK5CBpyu623ztOmYCWRburm0HhqbZ7RHGpySO", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoSJ8b4VPVWp4ZzAO7V6Mt9NTcmBX6WCZACvuRht1alZK5CBpyu623ztOmYCWRburm0HhqbZ7cA5H4_C", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoOJ8b4VPVWp4ZzOZ7gkNYsYG5WGD_6ENQn1v08_1aMIJsTbqC3viCi_aGsPXRq9rGxShqbZ7YkKCvb2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq1fX_Q45g37DCUN_8JiRoKJ8b4VPVWp4ZzCN7V9ON4dGpSGCPPTMwz56Rht1fNULsaPqCq9iSW4M2cJU0Xo_z9ShqbZ7ZQvyLLp"]
	},
	15087: {
		defindex: 15087,
		name: "Pumpkin Patch Minigun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakpvVXLFns5YLHYbUkNYsZS5WBXaOAZgr1uUswiaNaLsfb8izm3nvuOmgNRVO1rX-FzpXc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakpfVXLFns5YLHYbUkNYsZS5WBXaOAZgr1uUswiaNaLsfb8izm3nvuOmgNRVO1rUgMH5i8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakpPVXKArsttPHMOZ6NtBNS8TXWP_UM1v-4kIxhvUPfsGMpHjqiX_sOmoPRVO1rc4obzvz", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0Udako_UHfAjtvIDDO-V9YdBJSsHSC__TNwysvks906RfJpWNpSLt1XvsP2cLRVO1rX-RgVQ8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakovVQfw2-54SSZuJ_YYsaHMCGWaSDMwH86B0x0aFeLMTcpy2-33y7Mm4CRVO1rQvb6gp1"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakpoQALE-r7cSTLeN-MI1NTsnUXqOFbwr07xk9hKcMLpaL9Crv2X7pM2YCCBW5_j5VzrOZ-uw8JdIdDXI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakpYQALE-r7cSTLeN-MI1NTsnUXqOFbwr07xk9hKcMLpaL9Crv2X7pM2YCCBW5_j5VzrOZ-uw8AiQphs4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakpIQALE-r7cSTLeYsNd9JSsXUXvaGYw317E5siKQOecSIony72XnoazpeXhe__msMyeSZ-uw8CWtSX2s", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPrBLUeUx_Qb8CDMx4Ph0UdakooQALE-r7cSTLbYlN9BISsDTX_DUNQ79v08-g6QIJ52O9Cu9iyu6O2pYDxDs82MNzuCZ-uw8xCdHfqs"]
	},
	15088: {
		defindex: 15088,
		name: "Nutcracker Minigun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRob49e5Sew7ntIbBMLl4OY5PH8XWCaCBMgyr60I9hPBfJ8Tf9Sjq3STqaXBKBUR8CiKSmw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoX4879VLFq7tNfPYLQkONweGMOBWKSONw74v0w-1vQLLZ2K8SLr3Xm_a3BKBUSd4ffqCQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoT4r75Rflq5toOXMOUkOI5MHZHQXPLSZgD-vk1ugKMOfJaJoCrn2SW4b3BKBUQybcpTlg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoP48-oAeATutdeSMrAsNtwdF8XXWv7SZg6p6Bo9h6cIK5OK8yi92Su_OnBKBUTKXVauNw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoL4pOhULFjm5oCXOuJ9Y94eS8nSXv6DMg2uv0s7gaVefMONoy--jHm9b3BKBUQa90us4w"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoaJ8b4VPVWp4ZzOMuYtNN4fHJGFU6eBYA76v0sx0qJcKJaB8yK62njhb28CU0G982NXhqbZ7VQGO5GQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoWJ8b4VPVWp4ZzONbArYtsZS5KFDveHYgn96kM40ahUL5bdoX-8jyq8O2lYDhbq8mhVhqbZ7T1Mbmha", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoSJ8b4VPVWp4ZzEMLYsMdtMG8fXWfWBZV-u6U071qkPfcHf9n-83iTrMjoCWEDqr2JWhqbZ7U6_lRF1", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoOJ8b4VPVWp4ZySO7cvZYxOTMCDXqSONA2p4k061fNafseK8im53Sq6OWgNWUG__2MDhqbZ7a4PIBE2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma0Td5hwRoINy4OTludRHMPq5LSPYo9QvnDDUN_8JiRoKJ8b4VPVWp4ZzAYrJ6Md1KGcPWCaKGbl-s4x5sgKFVfJLapy251SvraGsNXxq9-DpVhqbZ7YGTglYC"]
	},
	15089: {
		defindex: 15089,
		name: "Balloonicorn Flame Thrower",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2ttZzOYbIlZYpLSZKGC_KBbgz1vB1pifAPJpHb9ii9i3u7b2kMXBXv8mwChqbZ7ay_TUYF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2ttpyXOuUvYosfHZXSU6OBYgr0v046gfJbL8eMpS_s1C_hPz0NXEDqrm5ShqbZ7X7i9_G7", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tt5zEYuZ5ZIxLGceEX_CPbw6uvB0wgvNcKJOBqHnu2yW8OD1YXBDp_mMNhqbZ7WBawF_7", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tsJzOZ-YsZd9KGsTSD6WBZw79uBgwgPBYesGAoSu833i_bm0IDhPr_z4MhqbZ7f98lRyx", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tsZzOZ-YsZd9KGsTSD6WBZw79uBgwgPBYesGAoSu833i_bm0IDhPr_z4MhqbZ7fz8M3cm"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tte2QZvNoaZ4ZAcWFU6DUZw6s6h8_gfQMJpSJonjviyW4bjwOU0HjqGxSnObVv7A60z4IAy_nxLbg-RM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2ttu2QZvNoaZ4ZAcHQXKCONQr07Rpt0aYPeZaI8yq83H68PG5eUkXu-25Xzu6Fs-dogzkIAy_n7Eq_Iu8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tt-2QZvNoaZ4ZAceCUqfQZ1v6vBo_1qYJLcffpni92HjoMmwMDhTi8mIDyu-GvuRjijoIAy_nGyycvxs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tsO2QZvNoaZ4ZAcCBD_OFYlz76UJrhPRce8Pb9Xy82XvoPTsCCUK4_GhRm7OFvrZo1zoIAy_nGr9v8js", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKNjtmfwHWCbJRS_AoywrtBSs958lqV9ik-YQRLF2tse2QZvNoaZ4ZAcCBD_OFYlz76UJrhPRce8Pb9Xy82XvoPTsCCUK4_GhRm7OFvrZo1zoIAy_nhEAOVRc"]
	},
	15090: {
		defindex: 15090,
		name: "Rainbow Flame Thrower",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15091: {
		defindex: 15091,
		name: "Rainbow Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15092: {
		defindex: 15092,
		name: "Sweet Dreams Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15094: {
		defindex: 15094,
		name: "Blue Mew Knife",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYguYlhBdWwru8HK1m959DOYbcqZtxISsKGWP_Ubw_060wx1KkJL5GO9S_vw223bXu59uBC", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYguokyVYPnou9UKA-5vIDBZrAvYo1FHpPWCPKPblz77Rk70_AOLsDaoyLow223bZxgndM1", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgu4liAtTv9bgFLV3n4YOQNbQvZYwdG8DZC_fSblz76ENr1KgOJsSKoXvsw223bfYDZrdd", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgvIkyAITn9eJQK1jutoCXNOJ4NotJTpaBX6SCN1377x4-hqMOK5KIpC_nw223bUHarbT-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgvYk6UdHnouNXLFrn5orEMeYpOIlNG8fQX6TSZwr-6Es_h6AMK8GNpSi5w223bRis7l2i"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgufhlUcSi_q0DZ1jptIqUYLV5Mt1PTJbQWPbXZ12o60M-gqUJLMGA8iu52iu6PD0JWBf1ujVTRJaujTs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYguvhlUcSi_q0DZ1no5YXAMeQqN9oeTsKCXPSAYV346h5s1fAIL5WA9iLsiH7oaWleDxT1ujVTQ-tN0U0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgu_hlUcSi_q0DZ17ttITDYbZ4MdgfScDWDPGEYA_5uElrgvQIJpzdoXjriSrgaW1fU0f1ujVTD1DrISY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgvPhlUcSi_q0DZ1nt4YHFYeYvZN4fH8iCW6eAYgv46xow0_VdfsOJoS252SzpbD9eDhr1ujVTwdNlvok", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A6xLWfg_4zf7DCYgvfhlUcSi_q0DZwrotoaQMeUqMdtMGcPUDv6EZV38vkk7h_QOKZaPo3np3y26b2dbCUb1ujVTP_Xlg7w"]
	},
	15095: {
		defindex: 15095,
		name: "Brain Candy Knife",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxBZm1orlXfVjtsYqXNLJ4ZtpLH5TVCKWDYwuv6E48gKIPe8OIqSvsjC66JC5UDJ38dMT_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxBpngp75TewTnsIqVZuZ5Y41ITJaFW6WDN1qsuU07hKlZepCN9Sjm1XvtJC5UDDg50csY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxB5nuorpfLQvo5obPO7l_OdFFS8GCCPaDYw7_6h071alYfJDaqCvu1S3vJC5UDDoGUY3-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxAJnuorpfLQvo5obPO7l_OdFFS8GCCPaDYw7_6h071alYfJDaqCvu1S3vJC5UDHfxO3Bx", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxAZm09eNefFrp4YCXNOJ9M44ZGpHUW_OAZgv0vxlshKlZfJeNoX--iSm7JC5UDJ1M6bjl"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxBeiw8qgSIEq6qtaUYbF-YYofHcTXXvLUYF-p70g8ifdeeZCLpi_p1SXpOGhcWBTj82wa2LjQOduaclY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxBuiw8qgSIEq6qoTHNuZ-Md5OFsHTDqLVZgus6kxsh6ZdLZTb9Szt2yzqPTwOXhG9rD4a2LjQvBLA6_g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxB-iw8qgSIEq6qoTHNuZ-Md5OFsHTDqLVZgus6kxsh6ZdLZTb9Szt2yzqPTwOXhG9rD4a2LjQuHK5enQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxAOiw8qgSIEq6qoTCMbAlYd0aSpWFUvCBMl__vh8xhqcLKcCM8nnn2Su8OzwKUhHr_Woa2LjQaj8XqKo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9A7JfVfs59QboEBgl7cZxAeiw8qgSIEq6qteXYuF-MtFFTZTVWqPUNA757Rpqh_BZK8CI8S_qjC-_bjwLCUDu-2Ia2LjQ8joj59I"]
	},
	15096: {
		defindex: 15096,
		name: "Stabbed to Hell Knife",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakpvVeegTnvdDGZuR4NdpNSciEWaWDMgz_uUls0fAILcDcpnvmjCjubG4MRVO1rVUFNGb_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakpfVXfAjuvYDAYrklNotOH5KFD6PXZwqu4kJqgaFVfJ2PoSjpjCXsaDgMRVO1rfDnut5P", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakpPVXfAjuvYDAYrklNotOH5KFD6PXZwqu4kJqgaFVfJ2PoSjpjCXsaDgMRVO1rWvRq4dm", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0Udako_VVKgm-toDENuMtM4pMTJTYXPWDZwz0u09t0qAPK5yL8SO82HzsOGdfRVO1reXnrO3M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakovVVKgm-toDENuMtM4pMTJTYXPWDZwz0u09t0qAPK5yL8SO82HzsOGdfRVO1rTJyt3x7"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakpoQALE-r7cSTLbF-YdAZGcKBU_LQZQCvvk4_1vBUKpaPoSm51Cm4P25fXkHoqWIFnuOZ-uw8zHZL3eU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakpYQALE-r7cSTLbYsM4pKHJPZUvOBMFr9ux5qhaNdfJXcoX7u3yzrOWhZDRq5r2gNmLSZ-uw8uzBU2CY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakpIQALE-r7cSTLeMqONBIHcLWWvSANQquuxo60_QMLJXb837njHu7MzgMW0fjqWoGme6Z-uw8axPNCKw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0Udako4QALE-r7cSTLeQqYd0eHcbRXKCEZl316hlqhalbfMaOoyLv23y4OjteDxHu-GgHmOWZ-uw8NGhPo-o", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKOzludAH9ErRfXvc_8BzjASI-5Ph0UdakooQALE-r7cSTLbIvYtFOG8GED_6HYFr06kJrg6daKpLdpynn2iu9PDhfChXuqGIMneKZ-uw8nD42_Ik"]
	},
	15097: {
		defindex: 15097,
		name: "Flower Power Medi Gun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakpvUCfl7ms4bPZ-IoY4kfHMeDUvaPZFr7v0w9h6ZbL5aJqHvq2izpPTwMRVO1rVVytJXG", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakpfUCfA25soaXMrAoNdlJGcHVDvKPMliuv0k81vIJe5CBqSrm3CW6PWpbRVO1rdXwHrae", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakpPVUcV-9vYfDO-QtMo1EF5TRXf_TMA79uEpp1qZVLZWKoXnoiCTrMm0NRVO1rbXfQl9a", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0Udako_VUK1-6torCN-V5ZtsYTcXYD6OEblv0vB5q1PUPLZyBqSPs2iTuOWgIRVO1rWk_2QOk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakovUHeFi9t4fBYeUqYY4fF8CCCKOFb1ys7UI8g_RbLJCIoSjsjnzga28PRVO1rX_MzupC"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakpoQALE-r7cSTLbR4Y4pEGMiCXvOCNAD_u0xu0fdfKJGPqS7p1CjsOmtfUxXq-W0BzrSZ-uw8WzxO4ns", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakpYQALE-r7cSTLbh_Zd9NF5HYXfDTZwCu4kI60fBeKJ3dpi-93C7qOGkODxu_qGxXnbKZ-uw8U8pOEYg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakpIQALE-r7cSTLbF5Nd1ITZOBW6KBYV30uE9qhvUMJ5eLoHzrjy-4bDgCWhLi-W9Xn-OZ-uw8LKxWW9I", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0Udako4QALE-r7cSTLbUsNtxKGJaCDPTVN13_7ExqgaELecCI8Sm8jy_pbz0LCRW9qT4Bzu-Z-uw8khF69Rc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPTJjewPXD59YUPot8Rr8BjA3-vh0UdakooQALE-r7cSTLeN5ZdlLTZODWaeDMlv9vxo91PBVepSJqCq72y7haD9cDkLj_WpSzbKZ-uw86imb_ig"]
	},
	15098: {
		defindex: 15098,
		name: "Brain Candy Minigun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXnub9Tewu6tICSO7V9ZdgYTcGCW_aBZQ_44x89h6BeKMCOoSzq3ivsbmoUG028NUBtHVQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXkue5TcA655YeQMrcoMdkeFsPSWfCPNFisuEg8hKhcfpaJp3u-2SS8PDwUG0283LH6E54", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXluepQLAzvstTDNrZ_NtEZHcHZW_GBMg3_vkM9g_BZK5GLoy3n2ny7OGYUG028DCY52Ew", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXiub5Wew3r5daQMbB-NtpLHJHSCfLUZl_0605rg6BeeZOOoXzviCvvaGsUG028fO75pHM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXjue9eKATq5YrOM7F6MYoeSsGEW6LXNQv87h5uiKlZLJTc9nzo2SntPjgUG028zcN_m3g"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXnyL0DOki28tfYOrIvMNhJTZPRXvXTbwj86hk4iKQPepfaonjs2S_ha28KXBS4rDkByvjH5OWnWgD3tA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXkyL0DOki28tfYYrR_YolLG5XXC_DTZgqp70M8ifMMLMeJ9Sy-iCXvODwKWUfj82JVm_jH5OUG0eVTOA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXlyL0DOki28tfYOrEuN44ZTZPTXfOEMA_770Ju0fBeLMPY8S7r2y3qaToDWkLu_W8Nm_jH5OW1l3MQmA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXiyL0DOki28tfYNbQpNt9LH8jWX_bXZlj8vB88hvRaJsaO9C_m1SrgMz0ODRPp-2sBzPjH5OXJn58HCg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59cTvQz-gvtByMr19BmVcXjyL0DOki28tfYOuYlYYwZGsiBWfWEb1qvv09uh6VaKcDYoCLrjym_PDpcXxHu-mIHyvjH5OVqYRj_Lw"]
	},
	15099: {
		defindex: 15099,
		name: "Mister Cuddles",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlXZwznsdDDYbN4Y40aGpKDWPSANV_-4kk_1KRVfZ2OqCjq3SzuMmpYXEL1ujVT5tXLjbc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlUZ13n4NTHYbN_MolKFsnRCKXQZwn_7Ew7gKddK5WA9Svq3HzpM25YUhT1ujVTw-wWtfM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlVZw-9vNaSYbcrZN5ES8XWD6XXZQir7Rg8gvIMesTbpXm6jiXpaWoJUxD1ujVTFDdv2F8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlSZw_n5YvCNeIlMdtIHcHZD_KEMl39vx9sgqRaKsCP83-7ji3sMz8MWRL1ujVTyY_7T_k", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlTZwnmtNfEYON4M9BPSsHSUvHXN13-uRlrg6NfesaAoijo2SS_PGcMXRT1ujVTN_RZVr4"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlXFlq698afdeUyOIsaGZbSD6fVNQj07E1u06MIL8OOpino1C3uODsDWUG--jpSn-aO6awr3DgazQQaKQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlUFlq698afdeUyN9FOHcXWUqOHM1is6ho5gPMIKZeJpS3ri3voaTgJCELuqTpVyeCHuqwr3DgxecMklw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlVFlq698afdeUyYtpOGMmGU6eAYA_67khpgqgLe5eAqSm81CW_Oz8NWUfp_mlWmLKEvqwr3DjtLmMYJg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlSFlq698afdeUyYtpOGMmGU6eAYA_67khpgqgLe5eAqSm81CW_Oz8NWUfp_mlWmLKEvqwr3DgN6X9COQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKPT5pewPXD59TVeYu8RrvHCM25MJwa8Cz9qlTFlq698afdeUyMN4dF8jWU_SOYAv440xuhPdbLJeB9njpiCzhP2kCXBLi8j0MmLSAuqwr3Dgb7Q_h1Q"]
	},
	15100: {
		defindex: 15100,
		name: "Blue Mew Pistol",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pYtDdKzoeJffgvmvIrGMOJ6NdseGcLTW6XVYQ6s6BprgalUKZ2L9nju2TOpZDl46rnbfQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pUtBdK0orhTLAzs5YKVMeItNdwYG8fQCfHUZAn16EI4h6IJKsffqX_v3jOpZDkkoW_AOw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pQtUdbm8-hXeg_t5YCXZ7MoMYpOGsnVU_bXMF3-7BltiKgJLJHa9iK9iDOpZDloBdayYg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pMtDNPi8b4DKwTrt4fHMuEsZo4eTsfYWv7UNFj-7R460aNbfpWLpyO8jDOpZDkBo0KwxQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pItVYfvr-9TKgTmvYLON7YqOYwaGcHYWvfTZV_6uEM80vBeJsCLqCK63jOpZDmAIeZgxQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pZcUtKl47IQLBLvvdeVN7gkMIpEScWCDveEZQuuuB4xgfMLeZLf8S68jii4M2sIX0W65Ctaz01PczEb", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pVcUtKl47IQLBK-s4XFOuZ-Y9BKH8PTUqWBblr_7EI6gaMLfJ2JpHm61SS7PWYCUka95CtazxR0ikqV", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pRcUtKl47IQLBLvtYbGM7coMtofS8nRWvKPYFuou0s9g_MMKJ3bpHm-iC-9PDxeDkDj5Ctaz9A8rcc2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pNcUtKl47IQLBK64dDFMLJ9MI0dTJaCWaPXMg_66E0whqQPKcHbpXu53X-_Om0JCEbo5Ctaz72YOnrL", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJSSfA38R_THiIz-pJcUtKl47IQLBLptYCUYrMuNosYHpKFCKOCYQ6o7xhqhKhZfZKA9HjqjC7oa2kDUhe_5Ctaz6iDTLx3"]
	},
	15101: {
		defindex: 15101,
		name: "Brain Candy Pistol",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRob487gEKA6959STMLItNo1EHMjYD6fVblz1uEhq0qgLeZaKqXi82ijqbnBKBUS5eV2oQg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoX4oOJfewy94ISVN7EvNtwfHZXSXPCDNQGv6Ug6iPMMe8SPoiK61SXsPHBKBUTY1VUJ1g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoT4oOJfewy94ISVN7EvNtwfHZXSXPCDNQGv6Ug6iPMMe8SPoiK61SXsPHBKBUSM_I-GsA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoP4r75ScA--vNGSNbh4ONEZScPUWqKCYVr56Uw-iKAMKsTdqS7n2iS9OXBKBUTrCb6Gag", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoL4875QeF--sIDAZrYrMN9EG8nRXaCDMg7_6ko80aNVLMSA8njm3S_tPHBKBUT1WSKZYw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoaJ8b4VPVWp4ZzAZuMpYt1OTJXUC6CBZwGs4ktp1aNae8DY8S_ojivpMj9YWBu6rm0GhqbZ7fwaW4Di", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoWJ8b4VPVWp4ZzFMLd_ZotETsTZUvOFNAqo7xlpgadVeZGB9Xvm3SzvOmdYWkDt8jgGhqbZ7e1ovs_w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoSJ8b4VPVWp4ZzCMOYrZI4aF8SGUvWHNQv-4k840_NeepOOoim53ny9PzhbXBbj-2IEhqbZ7d_jbruG", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoOJ8b4VPVWp4ZzBZeMpOdseHcaBX_KHbwv_vxhtgaZVKpPfoH691Su6PDxZDRO_-GNShqbZ7VRLUXQb", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPqJMXfw09wniDT4N_8JiRoKJ8b4VPVWp4ZySM7ElOdFLTpbTXfSFbg2rvxo41fQPK5XbqSjsjyTobG1bDRTv-TkChqbZ7fHCWxWI"]
	},
	15102: {
		defindex: 15102,
		name: "Shot to Hell Pistol",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRob487lVcV7svIbGNLkoNYlOGsbWDP6Abgipu0xsiKhZJpGJpHjt2Sq6PnBKBUROUASvvg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoX487lVcV7svIbGNLkoNYlOGsbWDP6Abgipu0xsiKhZJpGJpHjt2Sq6PnBKBURfGuufXw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoT4ru4FfwjuttOUYOQlON8eScTWCfWOY1qr4h07gKRUfJbYqHi61CW_bnBKBURObKmCqg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoP4pOxWfg3t4dCQMrl5MItIFsWDW6SPYQ_6vB47g_RVL5WIonjn2CnsOnBKBUTlhdlxVg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoL4oelVfF7ps4bDMrElMosfGsTXXP6CNQqu7kg5g_BUJsCK8Snu3Hi7aXBKBUQ4KYvwbQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoaJ8b4VPVWp4ZyVZeN_OIwYSsfYW_GHNFqr6R0-g6kOLJXdpinr2CS8bmhZWUDrr2JXhqbZ7Rfr50tv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoWJ8b4VPVWp4ZzFNeIkMNpJH8bXXaSCYA-uuUNu1KAPLZONqX_uiX_raTpfXUDqqzkChqbZ7csmDlcl", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoSJ8b4VPVWp4ZySYbcpZN8YTMjTXKeHMlr1u0g_06YJKZWPp3y72ijoP2oNU0C_8zlQhqbZ7ZoWREb5", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoOJ8b4VPVWp4ZySYbcpZN8YTMjTXKeHMlr1u0g_06YJKZWPp3y72ijoP2oNU0C_8zlQhqbZ7Tx0TKy8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKID50ZgvOPrNWU-Eu-wDpBSsN_8JiRoKJ8b4VPVWp4ZyQMLV9MolOHcaFXaTVbgv5uR460_UPe5OP8yy7jiXvPGlfUxPp82kHhqbZ7X8tOiHU"]
	},
	15103: {
		defindex: 15103,
		name: "Flower Power Revolver",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35epIe1_rs9fBOuMvNY5NSsXZDqDTZVyv7Us5hfcJKZCO9Xvs1XnsaT0NWg2rpDxkCtuhJQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35elIfFjt4NHAZeEqMdhLTsLTC6CGZA_87Uw-ifdUKcaP9ivtiXztMm0NXw2rpDxM9FQKqA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35ehILA_rsYSXYOMqZIpPFsPZW_SCZF2suB4-iKFUL5DY8yO82y7taWZfUg2rpDxPavsCoA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35e9IcAzv4NeXMrEoZIkfS5SBU_OGMAqvvxo9ifRfKMGAoCi5iC_paTpbDw2rpDyzAeDMCA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35e5Ifwy959TAO7UtZt5IFsfUCfWGb1r5vEI-gqNbfMaMqHu92Xm7PW8PXg2rpDxtcyY9tA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35eo5L1ms8NuAZq56N91KSZODU6COZwmr70lpg_UPJpWLoSjmiCu8OWpZUke68mhXm-CHpPI11dYBWLfq", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35ek5L1ms8NuAZq4vNYtOScHQXPSOYwj07085g_QLKseIpnznji28Pj8KXhPvrGkBm-CCpPI11TywM5Ui", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35eg5L1ms8NuAZq54Od4eFsSEDqeAMAD47k4xiahfLZGMoSzsiS-6a21fXhXt_zkNy-DTpPI11Th3EY0v", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35e85L1ms8NuAZq5_M4kdGsXRWf6EYw-v4kk71PJUK5OAqCPv2C-6MmYODhe5rDkNyrXVpPI11f2iAf5N", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjJxfQjUBLJhWvk14w3-GSgl7dVcQ9K35e45L1ms8NuAZq4sOI5LS8PWWf6FZgGrvENr1qFcKJLc837njyS9OzsCUkK-8mMAnLPSpPI11dws1_K2"]
	},
	15104: {
		defindex: 15104,
		name: "Blue Mew Rocket Launcher",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUeBLqvdOQMeIvMttOHpKEWqCCNAD47EI41PcOfZ3f8Sq8iS64azgODxfs5CtazyZd3jSn", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUehLrt4fFO-MrOd4YF8eBX_LTYQ3-6x8_iaBbesaI83zniCjtOGkCWkW65Ctaz9_g0502", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUehLrt4fFO-MrOd4YF8eBX_LTYQ3-6x8_iaBbesaI83zniCjtOGkCWkW65Ctaz9_g0502", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUfRK9soTFNrZ9Zt4dG8eEC_OFZFyruB441KlcKcfYpy7tjHjqPDtYD0Xo5Ctaz-_QJ_GA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUfBK5s4TBMLZ6Md4ZTMOFCfDTbg3-7B4whvBYKsaNpX-9ji_qaGwLX0e_5CtazyXfpyN1"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUeGO54cGCavZ5LtEdG8PZXqTSZ1z_vE86g6UPfpGAqC3miSTuPG9eCBXq_mwNnuCE7-F1wjFBfEPE_sY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUe2O54cGCavZ5LtoZH8PUC6WEZlqs70g_hKlZLMaMqH7u1H7gMmxYW0Hv_mIEy-7Surd1wjFB2lTpkCc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUemO54cGCavZ5LopESsjRCPeDZF_4uEprgKkOfpaKpHm9jHzhbGxZW0e5qT8Nm7KF6OZ1wjFBHbjgVf0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUfWO54cGCavZ5LtAZGMmGWPGGZlv4vB5shKFfJseN9nzojCm7aTxcCkG6qWgNnOOC77d1wjFBCK--5Fc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCysn7cpmQ-ih8roUfGO54cGCavZ5LoxNGZbUCaXTbwuuvx491qFcL8eIpH_s2SXpP2cICke_qz1XzLTRvrN1wjFBUMotugk"]
	},
	15105: {
		defindex: 15105,
		name: "Brain Candy Rocket Launcher",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2ttZzCNOMrN95LTZWDWvGOZQCruR8906UPLMeLoiLn1X_pOWwDDRvv_z5ShqbZ7UWVsrWZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2ttpySM7N4MtEeFpaFXveDZwr17B8wg6BdL8DY83_s3X7pMjtfWhTqr2wDhqbZ7Rzr4v-S", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tt5yTYbIvNtgYF8SBWf6FZgyru0MxiaVeJ5Pd9njr2X7qb24PX0Du82wDhqbZ7TU-wvpJ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tsJzGZuEkY9keS8TYU_bQb1_-vklt0qdfeZeO8Xzsjn7tODteXRrtq2MAhqbZ7dHd19_v", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tsZzCMrQoY9BLScaBCKCCYQ2rvkw70aBbfcCBo3jqjyXoa2xYXEbt_DpRhqbZ7Uhxk7gO"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tte2QZvNoaZ4ZAcaDCf7QMAz4vBk-0fJfKZOA9iu-jym_PDwKXxK4_20AmOTRu-Bjij0IAy_nhrpzd5E", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2ttu2QZvNoaZ4ZAceDU6XTZQ70vh041qEJKpaI9Xy9iXm6M2YJWEW-qTkCmrDS6-Ri1DkIAy_n2uu-B3c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tt-2QZvNoaZ4ZAcPYDvWGZwCsv0ls0_dfLpGIoCjniSm7OWpeWUHr_D5VmbKAurM_hWsIAy_nh-VqOPs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tsO2QZvNoaZ4ZAcPUWfaAZgCv7h1rg6NeL5OI8y7vjnvpO2wNUkbj82sGneKGvLpih2sIAy_n-5gGe-o", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIjhkeQHWDaFLUvYy8RrTCzUz4clgVdmy7oQRLF2tse2QZvNoaZ4ZAcbZWPLXYQ3_vx0wgaEJKpCK8yvu2iXgPWcIXRXi_WgAye-Fv7Fti2kIAy_nIjKh9ic"]
	},
	15106: {
		defindex: 15106,
		name: "Blue Mew Scattergun",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXnuexVKgW-tNOSMbAoZdFEGcbXDPGBMgn47h1uhPBcecCP83_mjnjoP2wUG028-UGATps", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXkuexVKgW-tNOSMbAoZdFEGcbXDPGBMgn47h1uhPBcecCP83_mjnjoP2wUG028AwsNxVo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXlubkFKF3tvIXPN7MoMNxLGsDTDPPUYw_47x5r1KdVLpXb8njt3XvrOTwUG0288rMSAZM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXiue5WK1nv4oDHZ7Z6Y9kaG8SEDqPTYwn5405ugqBUKJ2NpyO7iCXoPjwUG028d7L0uRo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXjub1VLwS854KQNbEpZdtIHMnSD_fTNF_56kI61qIJepSLoCPp3Cq6MmcUG028m0rKxRU"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXnyL0DOki28tfYOuIoNolPGsLRXf-BNAGp6h4xiaRcL5bapSq7iS2_O2gCD0fu-WsFzPjH5OWgXjm2Xg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXkyL0DOki28tfYOuIoNolPGsLRXf-BNAGp6h4xiaRcL5bapSq7iS2_O2gCD0fu-WsFzPjH5OW6C9pjKQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXlyL0DOki28tfYNrV5ZdwaHJbVDKCHZg6v70870agLfMSO83nn1CS_bmoPDkG4qGgHmvjH5OWGg8f0DQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXiyL0DOki28tfYZ7MuY4wdHZaCCKDXZQH64k47gvBYepyBpC3p3SToOD8PWhHv_28HzPjH5OUxQR5KXg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso4-B3pBCIl19BmVcXjyL0DOki28tfYMLEpMYtJTMeBX_-Dbw376E891qBfL5LbpH66jyS8OG1ZDxbs8j1QnfjH5OUqkC7wKg"]
	},
	15107: {
		defindex: 15107,
		name: "Flower Power Scattergun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUeBLusoCVNrl-ZtxNTJTRUvaFbw356R4-gvVcLJSL8n69iSTvbG5ZXUC55Ctazxsy2r_H", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUexLt4tTHMLQpOdhLTMXZW_aGMF386x8_1PReK5Hc9SrmiXvqP2cNWxfq5Ctazyjs1Myo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUehK7toHGMeIrONlNG5HQUvKGYV347U4xgqReLMOLpSO63iTpbjhZWRu_5Ctaz-VgqvI5", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUfRK659TOM7F9Yd1EGpSGDvCFYg2s6B05hqNbe8aI8Snr1Xy4bGgIUhK65Ctaz8JJhFsf", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUfBLn5dPAMrF9M4tNTcmFXfSDYw_9vB04gKZUL5Db9S3miy_rPmwJWEfs5CtazzjEEsBE"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUeGO54cGCavZ5Lt5FScnYW6eHYQ_-uUtq0aBbJpba8ny72iW_PWtfWxC48mpWmu7RvLp1wjFBoTQRVQ8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUe2O54cGCavZ5LtBNHZaCC_OEM1_76B5shvNaesGOpny93n-9Mz8IWRXuqW5RkePVvuB1wjFBx51ajNI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUemO54cGCavZ5LtBNHZaCC_OEM1_76B5shvNaesGOpny93n-9Mz8IWRXuqW5RkePVvuB1wjFB6-nZRtw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUfWO54cGCavZ5LtAdTZXVC6KEMwH94x45h6AJep3aqX_vi3zhP2gPXxPu8m0My7KDveB1wjFB3K3ClP8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUso8-Af7DDUi59BmRuih8roUfGO54cGCavZ5LtAYHsbVUvOGNQ77uUox1aVULMbYoyO8iS24PWoLDUDo_jpVkOKDuLV1wjFB4B-Q82g"]
	},
	15108: {
		defindex: 15108,
		name: "Shot to Hell Scattergun",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlXZ1_vs9OTM7MoMI0aTsbYCfSBMwr6vBk6gKJZJ8fd8im53im9bDtcWRH1ujVT9zKsWHI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlUZ1_vs9OTM7MoMI0aTsbYCfSBMwr6vBk6gKJZJ8fd8im53im9bDtcWRH1ujVTYYvBVLo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlVZwnqt4OQN-UlMosaGcKGU6eOZAv-70s5gaMIfcSP9SPvji7vOmwIDkH1ujVT_FjxDZs", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlTZ1i754SXYeMqOYpNHcKBXPbTYw6v7E49haRdfMHfpCnp1Sq9OWwLCUf1ujVTtt1fdc0"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlXFlq698afdeUyMdFMTMDQWfPQMF3-7R4_0_QLfsaMoSvpiCm8PW4DChXo-T9XzuCBuawr3DgdIswXEA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlUFlq698afdeUyM41JHMTUXPGFYF_56R8_ifNffZeJ9irpjHnrMzwMD0fuqWIBmbOC6awr3DjMtdFWoQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlVFlq698afdeUyMI1LHJaFCfXUN1ivuENt0_dfKJTYpn7q2yXoaTwICUfq_m9SzrOP7Kwr3DgF0Eq0uQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlSFlq698afdeUyMdFIH8HQC6WCYFj_uxk4hKVaecCMqC253im_aTsJXxS9rD5Rzu_V6awr3DiMYaKhsA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzRmZhDHE6dLUsop_Af4HSg67ctva8Cz9qlTFlq698afdeUyOYtKHpaGW6KFYA-rvxo41aYIJseL8ni93yq_PmdcWkW9_WxQyuXV76wr3Di_JBUdMQ"]
	},
	15109: {
		defindex: 15109,
		name: "Flower Power Shotgun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakpvUCKF3r5ovOO7AuYY0YH8fRD6KHYAz96Ro71KIMKcbcpnnu1CzuMzhfRVO1rb1BGw1t", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakpfUCew_s4dDDZrR4NY5OSpGECaWOYl3-40w90vULL5KBoCK-iCntPzoCRVO1rX6bjP7K", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakpPVQKl_u5ovOMbMlYtsaGJHZWPbXbwip6B9r1KlZLZ3YoS7vji3uPGoKRVO1raWVi5tX", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0Udako_UAfA3v5dCUNuN5NtgaHcnZD_WBYFyv70g8gKcJKMeM9iK53y3hbm9YRVO1re2gpvy_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakovVfeQi55oWVOrAkOdFMTcHRWPGEZgj87B5shaFfKZHfpXm8iSvrP20CRVO1rd7yYirA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakpoQALE-r7cSTLbV4OdBEH8OCW_6HMA7_70MwhKJVL5WMpX_sjHi6aWpbXxTqrGwCyreZ-uw8O4b_iDU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakpYQALE-r7cSTLbd5Yt1NTcOFC__Ub13_vB0406ldLJWL8Xnn2y7gb2sLCEfirDhWn-WZ-uw8eFvJqvI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakpIQALE-r7cSTLbclYdEfFpTQW_KFNQ3570s7g6Jee5eO8ii8jym8bmoIU0XrqWgNkO-Z-uw8CeqRw6E", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0Udako4QALE-r7cSTLbgsZIkZH5LSW6SBYAqs7k8xhKAIJpHa8ivri3_obmwLDRHrqWsGneWZ-uw8USLX-G8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIz9oZgPXD59YUPot8Rr8BjA3-vh0UdakooQALE-r7cSTLeYuZtsfS8TSUqKBYgr1vBhp1akPepKMo3_uiX69P2sCDxK5-zgFnbKZ-uw8jtG_w34"]
	},
	15110: {
		defindex: 15110,
		name: "Blue Mew SMG",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3Z8vcJmB4W1oupfewq8tNOQOuF9YdgfSZWFXfSOZQ_4uExpg6BVfMeIpjSvg3qN9tp4fQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3V8u5M2A4Ti9b9RLQjm5YTEYbAkNYlLHcDQD_aHblv67h9sgqRfe8HYpDSvg3q_1I8PDQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3R87ZZgUoTko75eLV3t4tbOYON_ZNxKScDVU_fUNA70vklqhKcML8SPozSvg3rKUmtvCw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3N8scQ3Vo_h87pTfl7q4ICUO7YqMdEZHZLWWP6EYgv8uBoxhKcJfMaJojSvg3qLmG5cnw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3J8sJU6VYHk9egHfQ67toPPYLYrNIweGcPSDPGGNQiu4hk51PBZfJyJozSvg3qldEb3fw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3YN7sJwQN6g8vUAfA65t4bHMrQrZt9PS8XVUvCPZFz87UtuhfJaKZLfp3m-jnzrb2gORVO1raPlE1Q2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3UN7sJwQN6g8vVWK1nosNHBZbcoNNwZG5TQC_WCZwv87R9q1aYPKpOIon-5jH_uMz0MRVO1rYH4bZrR", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3QN7sJwQN6g8vUAKlrsttDHN7YoZNxPHcbVU_GDNFyruUpp1KYILcbY9Cnu1X7tPmkCRVO1rYpmkGYa", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3MN7sJwQN6g8vVXK1_nvdOTNuQuONoaF8jYDPOGYAH1uEk9gagPfJGIoCju3yy_PmdcRVO1rVJrKRs3", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKIzpgTQbOFKVTWeIF4w3tG3IN7sJwQN6g8vUDeA6759fFO-R_ZNtOF8XVWaDVNA747Us9hvBUfcDaqSrt2H69PWoJRVO1rYyuQyNs"]
	},
	15111: {
		defindex: 15111,
		name: "Balloonicorn Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15112: {
		defindex: 15112,
		name: "Rainbow Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15113: {
		defindex: 15113,
		name: "Sweet Dreams Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15114: {
		defindex: 15114,
		name: "Torqued to Hell Wrench",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35epIL1jmtIuSZbN6NtgfGcHXWKKPN1quvB050_BVfsPbqSjpjym4aDoNDg2rpDxPNyd77w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35elILwu84IuVMLJ6MNsYGpKFXqTTbwr57kMwhaEMepCJpiO52Sm_bzgNWw2rpDxmnVAIiA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35ehIeQTusoqXYLl6ZtpPTcjVDqOCZwuu7xo60fBcfpGBoX-7jnzoMmYIXA2rpDySOfwszA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35e9IfAq84dCSN7UlMdsYTZHSWvOPYQ__7Ek9g6MIKJLd8ijo1Xu7a2xbCg2rpDxLthpswA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35e5Ie1nqsIeQZbEqN9hEGMOBDvSDbgz0v0k81fJfeceMoX681H7sPWdeWw2rpDyjC0YLCg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35eo5L1ms8NuAZq4uZYsdHsjXWPKDZw6uvENshqQMLJ2K8izm2CzrOGsLWxS9r2sDzOGGpPI11fLNrG2L", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35ek5L1ms8NuAZq4vMNtFSpHYC_CEMw3970M_hKRZfJaLpHjv1X7tOz1YXBHt_DoAzu_RpPI11Y1G00_E", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35eg5L1ms8NuAZq4oNIkfHZHWXPGFYAz66RkxiaJZL5yO9i2-3ijvMmoLCEe_qzhWmuWOpPI11eN0qXTN", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35e85L1ms8NuAZq4rOYtETsTRWPeEZAr_70NthaUMepXb8iO6jiS4a2oJUka98zlWnrOHpPI11RexE8At", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664MayS95ng16OueKJyVifAfKPrRRTuQv8Qz4Bi835MtcQ9K35e45L1ms8NuAZq4lNdxFHceFU6DTbwuu6ENugKQILpTY9Srp3y-9PjxZXhDp_zgDkbeOpPI11aFNlZEH"]
	},
	15115: {
		defindex: 15115,
		name: "Coffin Nail Flame Thrower",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oPYNbYlMdtJGpLVXPWGMA38uENshvVbfpSI8Xvq3Xm6aGYLXEbqrj4EkfjH5OURvQ9Xmw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oDYO-QqNtkYGsfRWfeDYwr56ks81aVZKsCIoivq2yW8PD1fCELi-mgEmPjH5OUAU_e7Pg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oHYZeMqNt8YTMSGD_KEZgCs70k6h_BZeZXY9Xu93SS6PmhbDhq6_GwDkfjH5OXwWGRElA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9obYMrN-MIlMGZaEXfOAMAmuux850qlfKcCOpizp337hPWgDD0G5-zkNy_jH5OWJg8BAhw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9ofYO-UsNI5FS8TZW_fSNwz6vkM50vNYe5KL9C3qiXnoaGwCChfj-GxWm_jH5OXgumIOdw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oOpZeVvdIEKSt7ZCKSAN1r-6kMxg_RYfp2P8y-6jyrgM2cDXRfjqT4MnbDWu7Vs0TkeXTHu-oaHMjqZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oCpZeVvdIEKSt7WDvSDb1v_6Ek-hvRaK5ba9Czq2nu_aGlcXEC4-G4EnObVuOBvgzoSXTHu-iF_b1j0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oGpZeVvdIEKSt7WXfSPYA3_4h8wiacOKMbYqCy8iSTsO2kKXkfoqzgCyuGF77Y50GpFXTHu-qDylqZo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oapZeVvdIEKSt6CC6KEY1is7RprgfBULpLf8S3r3HzvMj0MWxu4-2oBmLWFvbdj12hCXTHu-vHPZC10", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdAjDDKVKVOc14w3-NiQ97sFqWtm3_rc5Plm-9oepZeVvdIEKSt7VDPKEMw2p7k881KlfLcOAoHnt3yq7aWYPWxfirG4Dmu7TuLZv124fXTHu-v9qXaHG"]
	},
	15116: {
		defindex: 15116,
		name: "Coffin Nail Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbEyOYlNH5HUXafXZwj56Uk5iPVeKp2MoyznjiXoOGgOD0e6-G4GnLLR6awr3Djf_T984g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbIyNdwdFsDVU6SBZAn9vk89gPNcLJKP8izsjiu7PjpeWBq__D0Ay--Pv6wr3DgeG-v4GQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbMyZdAeHcjSW6fQNwz1u0M71qMJK5GA8SPq2iq7Om1bCBq482kDnuGF7qwr3Djf6W4ldA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbQyNdoeSsSBDPCENA-p60s8hvNfK5eM9C_u2Su7aT8NDhvr-mgBnefR6awr3DibP1tfdA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbUyYY4YHcDVXfLUb1306ho61qVaKpWNoizq3CnvaTgNWhvt_joAmu6Evawr3Djrry7W2A"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbFDZo0PW5mWD-jSMAz06k5t06ZbepSJoSi73nvoPmkOWRft-2MDn7OA67FvgGpCEXfis6zS_h0vrCO9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbJDZo0PW5mWD-jQNQ-uu00xgqlcJ5Xf9nzn2n_vPGxfXRbo_D4EmuWDs-c9gTlCQCXhs6zS_nDfxcJO", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbNDZo0PW5mWD-iCb1v_uUxs1qFVesbfpCK73CThaT1YWxPp_W5Vm-LS7OZihz0TFyPms6zS_vK73PVs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg18RsUtG_-bUHIFCA89eXcbRDZo0PW5mWD-iOZV_66UxuhPVZfJOM9X_r2yzrP24JDxvsqTkCye-FvrVug28UESfhs6zS_rMJwLxP", ""]
	},
	15117: {
		defindex: 15117,
		name: "Top Shelf Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDHLeYlZdBMFsfZXvCDMF_06BgwiKBVKJLa9S_u2CrqbD1cXxO4-GIGmuGZ-uw8cSbJU50", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDELeEqMdpES8mDW6SHZQiu4x5riahYJpfaoy-52XzsPGwJXhG6q20AyrCZ-uw8rRdoUac", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDFLeMpNNBNSpbXWPbQMAyv40JtgfQOJsCIpy273Si6aGsICBa_r21Sy--Z-uw8kid9Cow", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDCLbV5OdAYHcXTXKKFNFqp7h9phqZeJ52N8njq2ynub25fXkW--DkDyeWZ-uw8I0yXw-c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDDLeQpMI0fGZHXDKWENF2p60M61aVUKcCNpiu7iSrqOjxZCRTs-mJSm--Z-uw8Ljj3fC4"],
		festives: ["", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDFXOZ5c5wVWZXOXPXXYVqo7k1qhqJafpWIo3zsiCzpOjhbWBO4-G1WmbLUs7Nu0GdFEG_w87volF2rpQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDCXOZ5c5wVWZXOX_-Hbgr_7B5riKhVepCM9C27jy64a20KX0bq_2kNm-7Wv7dogztHS2_w87u2cWwbUw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYdRbHD6FaWfk74QbvASIg19NsRMS-8rcAFku65cDDXOZ5c5wVWZXOCfHUNA3470luhqMOK52O8SrmiHngOW4JUxDs-WMGmbeAuOBt1jkRS2_w87sXL042Dg"]
	},
	15118: {
		defindex: 15118,
		name: "Dressed to Kill Knife",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUeBK-54SUMLh4YttFG5HRWPeBblv86k84iPIJeZLf9CLv1SS7bDpcUxS65Ctaz-XOsQWj", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUexLv4YHGZrZ9Zd0aF5PQX6WGZAqo70pqgKQMfpLcoizt3ivtP2oDWRro5Ctaz0KMDvll", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUehLuvIHBZbB-ZdpMTMLRC_WDYlqvvE450aNVK5HdpSLn3Ci9bjhYWhC_5Ctazw75sjr5", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUfRK9tYPCO7MuNdwZGcHSCf-DY1uouxk-hvMPJ8aJpyPu33nsPjgMWxG95Ctaz8rDi6gW", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUfBK959PAMLh9YYwdSpGDD_aDYgv76Ew-hPUPepbYpi7rjH_gOj0NXxDv5CtazzyuUNwD"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUeGO54cGCavZ5LtBMGpaCDKKHbwn56kI9haEMfMOBo3-6iCq7aT9YWRG9_z4MmOKF6Lp1wjFB2ZFzrxA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUe2O54cGCavZ5LtlJGJHXXKWFNQ_66ks8iadYe8bfpyq9jiThbD9ZXkLv_G8HmuSH7LF1wjFBMsIWaE4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUemO54cGCavZ5LtwZGsHVX_SOMF316ko81KVZfZWK9iu63i_uOD1YWBW9_T0DkeWP7rJ1wjFBGEtJMTw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUfWO54cGCavZ5Lt0YHpWDX6OANQH-7Blrh6UPe5SOoS3oiCngbjgCWhDi-WlSkODU6bV1wjFBAxO-PJw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhWOc_5xvpDTM9485vWOih8roUfGO54cGCavZ5LowaHJbSC_-DNQ2s7Uo_iKVYLJWN9C3piXztaDoMUxLo_W4CkLTW6LV1wjFBtejaaMU"]
	},
	15119: {
		defindex: 15119,
		name: "Top Shelf Knife",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRob4ob5RLVjn4tPCMeN5NI5KTpPWDvSBNQr57Eg6gacPfsCLpSm52njvaHBKBUTBnxu0zQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoX4pO1XeQrnt4uSNrV5N9wdFsiBWqOBYw71vkxpiPVdKseKoy682nnua3BKBUTtiWuIgg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoT4oesCKwu54IGUYuR_ZotOGJSBWPSBMgH86U5siPQMKZ2JpXjr3yToOXBKBUQ7BI_CPQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoP4pLpVKg_ntoSXN-Z_OdgfGMbWDP7QZF2u4x0xgqZeeZWOqC653yW_MnBKBUTha-IZ6A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoL4p-1RfVi-sIDDNLQuZNtFTcnXDvHTNA_9uU050fRZL5yKpni63XjpPnBKBUR23i33XA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoaJ8b4VPVWp4ZyVO7l_ZdpLGcLSXfTVZg757UI_h6QLKMOP9S7r3i-7a2YJDUHqr2tShqbZ7WpXJ2ew", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoSJ8b4VPVWp4ZyQYeN-OdlFTJTVXfPUNAms70I61vUMKsHboXvv3i2_PT8MXxS682wFhqbZ7SQmYnLF", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoOJ8b4VPVWp4ZzHNbl5YYxETsiFD_LQZAis4h9siahYLJyBp3no23u9b2gOCRPsqzkHhqbZ7TZlYS5l", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYeQrLB6VhSPoq5wDpBSEN_8JiRoKJ8b4VPVWp4ZzDZrQsYdBJS8LQD6XXNV2s7U45ifJbfMeOpi_qjC24PGhYDRrr_T5RhqbZ7TnG5qOU"]
	},
	15120: {
		defindex: 15120,
		name: "Coffin Nail Medi Gun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlXZ1rr4taUM7YlOdlFHJaBWKeBYw6p4kI-0aVfLJ2B9Czt2yXuOm4LWBf1ujVTFW6fo-Y", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlUZw-64oWSNeQoZd9JGpTUXvWDNwn0vh1pgKJeLseOp3u92CztaW0OCRP1ujVTGfdPJUg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlVZ1q8tIDHNLApZI5LTJXUWPOBb1_5v0Ntg_NUfpKMoC3p3n7rODhbX0H1ujVTGf6sv5M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlSZw3vttfFNrUuY99PFsjRCPSGb1z6uUM5gKRffcHYoCnm1S_ua2kJWRH1ujVTkgEOji0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlTZw_mtoHPZuV_Yd9JGpSDW_OPZgz-6R5rh6FUKMGM9Sjs2S27a2oPDxH1ujVTG5BcMj8"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlXFlq698afdeUyON5OG8LRCP-BZgmvvxo81KQPK5KMp3u-jCrrbzgOWULo-2kHzO-Cvqwr3DjETtbc1A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlUFlq698afdeUyZdkeTJTYC_HTMgz670o-haUPeZWIpCzpjnzgbz9fChe6_m5QmrXSv6wr3DjjqhSKrA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlVFlq698afdeUyZooZHJaCU6XUZAD77Eo-iaUPfMPb9n7ni3vsPD9bXkK9rjgGzObWvawr3DjHwA9tuw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlSFlq698afdeUyZNxPS8SEWvWAY1r4u0I70_UPKsbYqC2-2y69PToLXEe-_G4GnO6O6awr3Dh-HA-msQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso5-w7qACk86c5va8Cz9qlTFlq698afdeUyY4waGcfVC_OFYQ6s7k1t1vcMJ5GBpSnm2n7qOmwJDhforzoMmrTV6Kwr3Di9mt4axQ"]
	},
	15121: {
		defindex: 15121,
		name: "Dressed to Kill Medi Gun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7uqoCSZbEtZN0dG5LUDPeDb1r7u0s606ILKMOO8iLu23nuaG8KWEfj_Gka2LjQSk5v3AM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7tqoPOMbd6NY1KHJWGU_COZF_6vxow06cJfsGJ9ny72S7tO24JUkfo-T0a2LjQZCn8LWc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7sqoLEYLkoYo0eS8OGDvLVYgv57R080qVbfJCAoy7p2n69PjoPUxC6rz4a2LjQA46Hoiw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7rqtDBMLUvNt8eGpWEC_LVYV-s7EswgqQLK8CJ9n_viyu8PGpeCUfr_G8a2LjQx-GZ_64", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7qqtGTM-MoONxNGsSCD_bUZ1uo7UtsgKkJfJKP9im-1SzraW0JDUHiqTka2LjQbu638Qs"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7u29STcPR1do1SH8XZCPaEblr4uR4_0vJZLsaB8i3m3H7qPj1fU0XtrDpWzLWDvbI-0XFWHSZKYi5m_g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7t29STcPR1do1SGZTVCfPVNw_6u0lsgqAPesba9C7o2CvtOW0CXRq5_mwAneWAveRv1HFWHSYhg59AOg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7s29STcPR1do1SGpPRW_WBN12u70JsiaVfLZfa8yvu2C_gbGhcWRO5_24HmuKCuONi1nFWHSbi6FizRQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7r29STcPR1do1STMPSW_aBMF-r4k471vAOepeJpn-5i3_tPmoLChLt8j8FmeOHsuQ-0XFWHSZNA6mwuw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7q29STcPR1do1SFsPXX6CBMAqovkg_gfUPJsGK8ijoiyu9PjhfDka5_G8NnLWF6OBs13FWHSaV-r6SUw"]
	},
	15122: {
		defindex: 15122,
		name: "High Roller's Medi Gun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUeBK6vIbDZ7MoYY0aFsTXD_fXMwD87xhqifRaK8DdpC3v1C_tPW0LD0Xs5Ctaz5PrFzWG", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUexK8toeSYuMuZIwYSpPYCfHTbwGs4k09h_IOLZ3bpi3uiyi8P2YMXxe95Ctaz8TaBL5j", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUehLt4tHCZrl-MosfTsfYDKXQbl36uUw6gqhaKMCLpHjoiCrsOGdbDRTs5Ctaz_kONjDc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUfRLt4dPCMLd4MIxOHJHTXKOENw6s6Es7hPJeK8OBoXnn2yvhbDoCXhrp5Ctaz8Rwrjny", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUfBK74oqVMLYsOd9JF8KGW_7XNQCu6Uxt1aVcKZXfpnjuiyu7M2YIXhfq5Ctaz7nImvcy"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUeGO54cGCavZ5LtFMH8mGUv7TMwH0vE8_0_VZJ5bYpy_u3njhODoMDkHo82lWkeCAueF1wjFB7Ro2Boc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUe2O54cGCavZ5LoxOF8mDDPaDYQCu6R471qJbfZCN8y25iSS_bj8IWhW98zpWn-WD6eB1wjFB_PAb_H8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUemO54cGCavZ5LolKGsiBCfWPYgyuuBluhKNVfJCO9S3pjHjubGtcWEe482wFmuHRsud1wjFBEsxo_oA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUfWO54cGCavZ5LtoeTJHTX6KBYACv7Ro706BdKJaB9C_m1CzqOjxcCBLi8zpSzLSO6Ld1wjFB2t_1xRA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfwHGCKdLUsoy_Q_kGyg-5MJxR-ih8roUfGO54cGCavZ5Lt4YTsPTCf6Ebg7_6Rhr1PMMLpCPoiLojyzpaTpcU0fs-m0DyrOO6Lp1wjFBt00a0so"]
	},
	15123: {
		defindex: 15123,
		name: "Coffin Nail Minigun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlXZw2554HPNrkoM4pKHMTYCKLTYAv1vxo6gPIOfZbfo3i5i3zvPjgMXRb1ujVTo9x-pNY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlUZ1m8vNeQNLl9MNpOHJLRD_eEMgqpvkluhaYLfZKJ9CK83Ci4bzoKCkb1ujVT0JRFCh0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlVZ1_r4YDHO7AqZd1OScnUD__XYw_97xpu0aEJfJeJoyjt3ivrbGsLCkf1ujVTCPv6h4A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlSZwvqtovENbAoYoxNTpXSCPGANA316xlq0_AMJpGIpH-9i3voP2oJXhb1ujVT34Lxi_Y", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlTZ1i74YvGNOYpMd9JTcPQXPGHYV_16Bpr0fdZfceP8yntj3_tOGkOUhP1ujVTt5vfWxY"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlXFlq698afdeUyN9FPTJbQXfDTYQ76vh5q1aYPesOOpivtji-7PGsICkXprmkFmeKHvqwr3Dh8mToIxw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlUFlq698afdeUyZNxISsjRXPLTYgD9vEw_ifVVKpWBo3jujCTgODoOUhK_-ToBzbLSs6wr3DjkzOysjg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlVFlq698afdeUyNNsaGZLWD6TUYgH8uU4-0vJVecOIpXvriCu9PGlZWBXurGtRzuaPvKwr3DhVNpnsxQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlSFlq698afdeUyZdxEHpGBWvTUYA_66kMxgvdUeZXcoHvviCvvM2kCDkXp-T4BybXT6Kwr3DglyFlTLQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso5-w7qACk86c5va8Cz9qlTFlq698afdeUyONoYS8jTWfSGNVipv0g4hqBeJpyN9nnviCrtaWsJD0Xp_2hQmOaAuKwr3DjH-BVS5w"]
	},
	15124: {
		defindex: 15124,
		name: "Dressed to Kill Minigun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7uqtGVZbEqM4lMTsbZWKOAZFiu6x9t0alVecDbpins3y3vbmsPChPoqz8a2LjQH3lZmVg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7tqoTPZuJ5OdpIH8WDC_OPMwr57xo60fQMLJTa9njn3SXhPGoPXkHv_W8a2LjQDqTGe3M", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7sqoDBMeV-MdgeTJLZC6OPYg-pvks-1qFUJ8Pfpizn2iy_bmlbChPsrzoa2LjQXE06XfI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7rqoPDNrQqOIpKTZTUDqSCNVv_4k040aALJsOM9Cnu3H_gOGxYWRHo_G4a2LjQmXyMV1U", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7qqtPEYbIuY4weTMTZU_OGZlj0u0k-gKRcfceAoCrqiSTgP2hbDkfv-Gwa2LjQ8NPOslg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7u29STcPR1do1SFpaBXafQN1-v7B4xgKFULsCO9i692ny6O28IUhHr_zkNnuKOuLo_i3FWHSb5Y219nA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7t29STcPR1do1SH8PVUqCFblyu6hg8gaEMJ5eJp3zr2H-4O2oCCkK6_GNRzrKF7LVrhnFWHSYQ83h6OQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7s29STcPR1do1STMWEWPKCMlv54h08gfNfe8CNqXnn2HnqPm0DWxLq8z8DmbSAvOQ-03FWHSbZOxijJQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7r29STcPR1do1SHcfRDqXVMg-r6x0_iaYMJ5PdoH7oj3jqOGkMWEDt-WhSzLeAubBi13FWHSYulOIu1w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUso-5g3_GiI2_MhoXdu6yKwDKE7q29STcPR1do1SScODDKOBYwD6609p06EILZbcpnju2i7tODhYUhS-_WhVnObSuLFi0XFWHSYCwgTBRA"]
	},
	15125: {
		defindex: 15125,
		name: "Top Shelf Minigun",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakpvVXLV69soDPO7V_Zo5MHMPZXfbVZlivuU0-hKMIecSKp3nn1S7pPW1eRVO1rYbmlznQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakpfVefAW74dTDNuIvZtsfGcTVWqeAZQuu6U8-0_RdJ8CIpCK81H_gaTwDRVO1rQ7m9Bso", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakpPVfK1nn4orBYbcvONBEGsPRU_aPYwD-7k9ugKRVKZCIpyLn3XvsbGYORVO1rRht7fq_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0Udako_VQf13t5YCTM7d-ZYsYGMXXW6TUYVj1uxo6hvdfe5OO9HjqiHnhbmdeRVO1rSLEdsWD", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakovVfK17qstDCOrYrNo1KG8XTXqWAZQD76x0_hPNcKMaIqC7o1S_pMztbRVO1rf0FXv_k"],
		festives: ["", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakpYQALE-r7cSTLbgsY9pES8SECKeEZF374h8whfNZKcfd9X_viCi4PWgCCEC6-WICm7SZ-uw8ISBNYUM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakpIQALE-r7cSTLeUuNYwaS8nXWvbTMgH77xg40_cJK5yBon7ujHvqPj8DD0fpqGoNm-CZ-uw89DOinkQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0Udako4QALE-r7cSTLbYvZIoZHpWGDPfQYQ6r40Jp1qdcfZKPpH67jinha2kDUhG-qGpVmreZ-uw8GbpYZmM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYfw3MCKdLUsou-xj_ASI-7vh0UdakooQALE-r7cSTLeF5Od0YG5aCC6CPNAr47kwwifNZLMDc8Srn1Cy4bmdcWUa6-z4AkbeZ-uw8U5-5t1s"]
	},
	15126: {
		defindex: 15126,
		name: "Dressed to Kill Pistol",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOw3x5tbHM7klNYseG8TUU_GGN1iruUkwhKIOfZSO8X692ijgaWpbXhO9_HVExrEucoYUFw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOw7x4NfPZ7YqN44YFpbTUv-DYVj8vEI7gvRZfsDd9Snm23noOmteXxK68nVExrH7qV-H9A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOw_x5YTPYOMsMdwZGJTZWfTUZgipuUI8hqAOesOMpCruiyrtPjwCCke-8nVExrEGSo2z8A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOwjxsYLAZuZ6NNlEGseFU_XQMgqvv009h6MLJp2JqC671SjpPWsJWxq5-3VExrGPa0KnYA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOwnxstCSNbElOI5MH8SCWqKDZw-v6xht1PdaLJ3cpi-5iyXhaWcOWkW9rnVExrEzhWdgOw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOw2A4teFd-lqZcZKG5KFCaOENVyo7Eg8hPJcfcSNonjo3HngMz8JXRXqrmJWzuPSv7FpnC9IFGlhu4fZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOw6A4teFd-lqZcZES8bXWPPSNVisv00whvNYfMCB8i3o2yvsbjheCRC9_DlWn7SB7LNjnC9IFJvJ2Yw-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOw-A4teFd-lqZcZFGMTRXKfQbwv46h4xifJfe8bdpX6-jHzraToPWhHqqWNVm7PTuLE9nC9IFByVuD1D", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOwiA4teFd-lqZcYaHcODW_bTZgj74h8_06cMfpOM8SLojnvuP2hYCBa-qDoMm7CDvLI4nC9IFIY8vkDv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYg3RFa9SY_Eo8Rv_DCMm58xqWNuJ4L4HOwmA4teFd-lqZcZMH5LQCfCBNF-ru0sxhqQLKceOqC26jiu6PWwLXBq_rz5Vm-7RvLs_nC9IFBubtWVK"]
	},
	15127: {
		defindex: 15127,
		name: "Coffin Nail Revolver",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUeBK54IbDN7h5NdBFGpLVWqeGZg2o40460agJJpCMoSLm2368bmZbCBC65CtazwR8b95X", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUexLrs9bBYOElNolNGcfTWfCDNFv16x4_hqlYJsCLoSzp3XzhMmlbDxG-5CtazxHsOyvs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUehLnvIWQM7QqNtkdFpWEX_LTMFqv60M_1PVaLpbf8irs3n_vP2wCCBfj5Ctaz5qIUVnG", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUfRK8t4KUZbUvOdlIGceEWfGDYlz0vh87gKBUecCJp3nriCXsb2kKDUG-5CtazxIKeaZg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUfBK75tbPYbMpZo4aS5WDCfSAZgD47Ro606dYfZyJoSi93Cq4Om4KChPp5Ctaz9bO-Swb"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUeGO54cGCavZ5LtgfGsHVD_bSb1qs7R1qh_MMepzboiy92S3qaWlcDxa4rD0Cy-aO67F1wjFBEDzsaoQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUe2O54cGCavZ5Lo1LHcbZXqKAMg-o6EtphqIOeZGIoXm-2ny9azhbD0Ht_TpQzrWHvbt1wjFBvISALQc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUemO54cGCavZ5LosZTMnSXfLVMFv86R5s0qlcLZCBoHu5jnu4b2gPCRTuq24AmuWPuOF1wjFBdccAfmU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUfWO54cGCavZ5Lt0fTMKFXafSNQ346h4-1aJbK5ffpCPn3iW7M2hcXhfj-2wFmuPVvrd1wjFBaXnNpkg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF9wfqDy485sZqWOih8roUfGO54cGCavZ5LtxISsOFD_WDNQGp6U9sgqILfp3a9SO8iXjpb25YXhfv-DhXzOWHsrt1wjFBgd44QAI"]
	},
	15128: {
		defindex: 15128,
		name: "Top Shelf Revolver",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35epILwXusIXFNbQsMNFNHsHVCfTXZwr-6Ug51qhULZKJ8S3v1CW_OWYOXQ2rpDxr8neoyQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35elILw7p4tDFN7N-OdBNScaGWaeDYl-o40M5gPMLK8SM9S_p2i3tOzhcXw2rpDz0mRfyoA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35ehIKwq9soSQYLB-ONEeHJLYU_eFMg75uUI7gaVbfZfc9SPr2Cy_OTxYXQ2rpDySw60JoQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35e9ILQnp4YKUMrl5NtxOGpPRD_LSZwz0v047gaYOe8fd9inniyW7bzxcXw2rpDw-YbjDjQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35e5IKwi-tYqTMeR-ONtFF8LYXfXTMl-u7E0xh_IJKceIoC7n3HnrOmsOXg2rpDySCyf9Yg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35eo5L1ms8NuAZq4tYYpPTcfRWqCEZAH47Bpp1fRVLJ3boSK-j3zhPm4LDUfj_GoDnueCpPI11STi1gs4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35ek5L1ms8NuAZq4lMopJGcjRDP6PbgD-7046gqRUL5HcpyO93X7pOW4LXka5qzkFn-DWpPI11a69V7-_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35eg5L1ms8NuAZq5_NtEYTcjQWP_TZgD_7UhshqILJ5eIo3jm3CzsOj0JCBPrrDlRyu6GpPI11R_yNwav", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAHUDqxIWecF4Af8Gi835MFcQ9K35e85L1ms8NuAZq59NY1LGJXYCPGCZAr9v0w80qlfe5bY9nm9j3vuaDtbXEHj_ToMzuKFpPI11W0Y4qQP", ""]
	},
	15129: {
		defindex: 15129,
		name: "Coffin Nail Rocket Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEMq54M44aTcDQW_eFN130vE870_cOecbf9iLnj3u6b2pYXhXvqz9Wy-KOpPI11RcjRfyV", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEMa4qZowZHJGFX_bSNF_56E04g6ZcfJPapC3p1Cq_MmsLDRvr-WkDnLOPpPI11Y6gFinc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEMK4tZNFLS8XYDKKBbwv-uB9tg6JdfZSIqCju33zoaDhbUxTjqGkDnreBpPI11fAEbYGL", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEN656M91MHpGGX_bQNV__7UppgfNdKJONoXzm2yXvaWoCCBTu_TlXnuGCpPI11b3V_-Li", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOENq5-Yt5FGpPSCfOPbwn76R0xiKMJK5bYoy_njny4a2dYChG_rGMHkbOHpPI11bFBHBoD"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEMt96ZZsIRoaFRP-GZwyu6kNuiKEJLsffoX7uiCvuPGhbCRTo-j4AkeLUv7BjimxFFiKu7bLbuM9eRSk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEMd96ZZsIRoaFRKPQMg_9vkgx0qdeKMbfoSy71H64M2pfXULr_j8CnbfRvrFugDpEQHau7bLbaiTV7Gc", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOEN996ZZsIRoaFRPbTN1qs4xg-gKcLJpaPoynn3ijpMz9YCEbsr20DmbLSuOdsijkTEXau7bLbCGBmlq4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN68hlUt64-boPJWOo4dOENt96ZZsIRoaFRKSDYFz17k84gqZcL52N9ivo3y24bG5eXhDr-z8AzeKEvOQ6i2xCSyKu7bLb6UIsUtU"]
	},
	15130: {
		defindex: 15130,
		name: "High Roller's Rocket Launcher",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbEyYdhNGJLTWvTUNw707Uxu1KZbKpWL9ijp2S_pOW4CDRbiqT8Dn7CD6Kwr3DhJ5zSYPw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbIyMY5JG5aEWffXMl3_7B5piaJafZCK9iy93n_oaWdbCELj-m1SmLCO7qwr3DhvEw2EJg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbMyNtFJTsfZUqTTYg2o6R5q1aFbe5HdoHi9jyq7b2sNCkHjqW4Hnu-Ou6wr3Dh4JypO6g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbQyY9pLHcbYW_WObwz44ks9gaAPLpaLqXu-1H_uM20LUkHj-D8MzOOHvKwr3Dj41qkp7w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbUyOYlOG8bUD_OGMlr_uB84gqRcecaIpSvp3Si4OW4JWkDi_T8Fke-Cuawr3DiFZcY0ig"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbFDZo0PW5mWD-iBYgmu6Bhr0qULJ5WKqS3o2Szsb29cDUfvr2IFkeLWveY40W0SRSexs6zS_sqqZOBN", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbJDZo0PW5mWD-jQZV38vEo4hvJce5GApy69i3_qM2pYWhW4_j8FkO7Vu7E_h2xEFXXls6zS_tcoUQAh", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbNDZo0PW5mWD-jUMl2v70xshaNZe5zdpHjp1H_haW8CXUXv_WMBzrDUsrJrijkRRSC1s6zS_pn428l6", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbRDZo0PW5mWD-jSZl3_vks70aJaKpGLpS_q2Hm6b2hcDxS__WoNmufU6bRu12oWQnThs6zS_o60KbES", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYAvBCqVKUPQv-gvkDDUN4M5kXMW5-7cDO0-A89eXcbVDZo0PW5mWD-iEM12r7B86haZZLpKIoii8jyS9PToICUHrqWNVzuWO77JqimwVRnbks6zS_gAsWngS"]
	},
	15131: {
		defindex: 15131,
		name: "Coffin Nail Scattergun",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7uqoHBOuZ-Zd8dTMjUD_-PZQD56Utt1KNbfZbYoinni3-7OTwDXRu_rD0a2LjQcqhcstQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7tqoWQN-UpMNAdTMCDX6WAMluv4k48g6AMeceM8yPmiCTuOG1fDhrt-z4a2LjQQTPTtNM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7sqoXAZ7V4Md0dGJOGWqWFbwr7708-hfcOfpfYqSzm3CntaWoPWBrs-2Ma2LjQiWBOUsM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7rqoSUN-J-N41FTMWFWfPQYgqu60tt1addfZOL8Svm3CzrbGhYD0fo_moa2LjQ-aHctTs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7qqtCXMeEtZtlFSsmDXaCOM1j7uEpphqkPKMaO8y65iHntODoJDhLiq24a2LjQT3VeD6U"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7u29STcPR1do1STcmGXPCHb1qr7B8x0_cMJsfYonjoiCvoaG1eUkbj_WxWme6GuLdrgXFWHSayJlWpQQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7t29STcPR1do1SHsTYW_6EbgH7vkprh6lbLpza8yu5jnu_bmsNDUW9qzgFke_R6eM_i3FWHSZ3RKQUug", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7s29STcPR1do1SFsXWX6TQYVj7uBo8g6JVfsaJpH7r3S-6aDsMX0btqGtWnrPSurtji3FWHSa3Ip0JmQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQfDFbRbTvIv-jfvBiE04cltVd66yKwDKE7r29STcPR1do1SGMLXCKKGMg2uuU09h6YPfsGNo3u62i3uPm8CXBDj-T4FzOTSveA613FWHSaWuTWaZQ", ""]
	},
	15132: {
		defindex: 15132,
		name: "Coffin Nail Shotgun",
		hasWear: true,
		the: true,
		grade: 5,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlXZwzrvYeUZbgpYopMTpbZCaLSbwj670lpiaZcJsOOqS7m2ym_P2oNCUH1ujVT7dtl_H4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlUZ1nt59fCM7h-ZI1KS8aGDPPTZA797U9qgvMLe5KLoyzt23u6aT9fXED1ujVTotR6mjA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlVZ1rotYLFO7kvNI4fTcSDDKKEZgv06R0x06NUKcHb8yLr2C3sPWgMXxL1ujVT_dCwwAE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlSZwi7t4vGZrh4MI1PTpWEXqSBNwn-6hk6hfQMKZaIpijq3H6_OThcCRL1ujVT4QzwXHo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlTZwrns9GXNuEkMtweSsOFU_SCYlz07h840qQMLpKOoSu9iHy9M28IWRf1ujVTHWKLjHc"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlXFlq698afdeUyY4tEHpOCU6CPMgr-7E05g6RZLcGO83-82C29P2kNXhri_W9Sze7Ts6wr3Di7wK-fww", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlUFlq698afdeUyNo1MTZHQXaCPYAD_6B4wgakJLpCI9XnqjyS9O2YJUxXu-GNSzeCPuawr3DioikkwOw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlVFlq698afdeUyMYkaFsDVCPTXZgH0vExs0_VcecCNpni51Xy_OGYOD0G_rDpVmrfSvqwr3DiIyI2cqA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlSFlq698afdeUyN9FIScOEXffUYQr4u0o70aJcLcaNpXy6iSu6azwJChHiqGIHkeeOu6wr3Dj7JexB4Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso5-w7qACk86c5va8Cz9qlTFlq698afdeUyNdoYSsbRXv-HMwCrvh9pgPBdLpeMpHi-2Sq9Oj9fUhO__joFnLOFs6wr3DhyhDMDAQ"]
	},
	15133: {
		defindex: 15133,
		name: "Dressed to Kill Shotgun",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7uqoHGO7R_N9lKHpSEWv-BYFuvvkJthfMPe8HboSq92ynobGkIWhXvrGsa2LjQEuugzDM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7tqtCXO-EuY9xMTJPSCPDQNw__7RptgvAPep2J9SLm3367P20OUkC-_Tka2LjQWaKHzdc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7sqtHOMrApOd5JG5aEXaWDNQr6vExt1aALLMeO8X66jn7oaGkNWUDt-W4a2LjQiLE5jDE", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7rqoPCNOF5No4eGZHZWqPVMw6p6hg-hKdbJpzY8n7q2yzoOWYKWxvo_mMa2LjQ7G_zTn4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7qqtHOYLR6Y99LHJOEUv6ENwH07Rps1akLKsDf83nu3CrtMmcPDRbpqW4a2LjQEk5zFC8"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7u29STcPR1do1STMCFCfGFbw346EI_gvVZJ5GN9X7tj37taD1cWEHs-ToEy7LUvLFt03FWHSZ4a-1XIA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7t29STcPR1do1SHseGU6eCM1yruBpugqlULZPcoi3qiS3tPGwCCkDi-2lXkeWPsrc_1nFWHSZbEUJOjg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7s29STcPR1do1SHJPVW6KBYgCo6EoxgaRVeZOO9H_miC64PGpYD0DorD1WkbKC7OBshXFWHSbNbBp5Uw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQzNFadLUso-5g3_GiI2_MhoXdu6yKwDKE7r29STcPR1do1SHpXVXf6DN1qu40I81qldfsDfoHjt1X_oaW8DXhK-rmJSn-6GueY50XFWHSYTFYQlZQ", ""]
	},
	15134: {
		defindex: 15134,
		name: "High Roller's SMG",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXnubkALF_rsobCNbQuONxIGZTZWv7TZl384hg6iKFYfpWMpCLt2XnsOW0UG028csJPmkI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXkue9TewzsstGSYbArZI0fS8LVWfKDNAiu7h5shKBaKMOK8S-92njgMjoUG028fh9UTEw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXluepSKw3tt4GSOrguOY1NG8jRXvCPbwCvvEM7iaBYfpDdqCnu2X67PjsUG028MUAIMG0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXiueNUewu6t4XCYbJ6N9ofHpKGD6DTZlz9604wh6YPK8Tbpym9jim4OGYUG028RBApffw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXjuboHcV68vIeTO7YqM45KS8KBWv-HMFr96Exsg_cOK8OBqSjt2H67aW0UG028s6KbDjk"],
		festives: ["", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXlyL0DOki28tfYYuJ9Y4xIF8SEXvOCNQCp6xgxh_NYJsOIoH-9iC-4bm0OUkLu_mNVyvjH5OWETL5dJg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXiyL0DOki28tfYZrYlNd8YTpPZDveBYQH87Ro-g6kPL5ba9iq52yTgbmkJCkXo-mpRmfjH5OXYDUG2eA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQnFPqhXW_0o-wTgDDUh19BmVcXjyL0DOki28tfYYOYsYdtFH8TXX6OBZw2rvEM7g_dYfMGBoH7u3C-4Om8IUhq--WgHmfjH5OVzXfKMwQ"]
	},
	15135: {
		defindex: 15135,
		name: "Coffin Nail Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2ttZzCZrV4ZNFESsPWD_TXNAH97EM-0qVdLZKB9XnojizhaWgIXxS-8j1XhqbZ7et0wZbR", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2ttpzPMuUqYokeGZTWDPePNw37vhk5gKBfKZ3fpXnn1X_sOW4JWkHu-G0EhqbZ7dnw8Hcp", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tt5zFZeMtMtBIHsPUC6eFMw-v7h5sgagJL5aMqSK-2yXpO2tYW0Hp_GNQhqbZ7UlViZ7z", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tsJzBM-R-NNhEF8LUUveDZwyuuBgxhfBcL52O8n_o3y67aWwIWRW4-DgDhqbZ7SpvwUg_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tsZzOMrF_OdxITceFX__TZAD-4k5s0vVafpGNoHjn3X_vbD9fUhW-_z5RhqbZ7UUrlNgJ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tte2QZvNoaZ4ZAcXQX6fUMF38uEps0vVbfJPfqX7q1C67Pz9YUhO5_zoGke-CvudshT0IAy_ne-W6-e0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2ttu2QZvNoaZ4ZAZWDCPXVMF39v0ptgKMPK8CB8irm2Hi_PWtfCRO-_jlVmuLTu-A4hjoIAy_najMx82w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tt-2QZvNoaZ4ZAZPRW_7SYl-u6Rk_iadULZGOo37ojnvoaWxcWRbtrGkBmO6C6-dpgzsIAy_nOGlsW-4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tsO2QZvNoaZ4ZAcaGWfWEMF-o4085gqRUepONqSO82yvhazgDWRa_r2hWn-SHurRrg2cIAy_nGA09OcI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TCig07s5tWta_-4QRLF2tse2QZvNoaZ4ZAcDUD6OAZV3_4kw50aZeL5fdpinmiCrqPW0DCEXu_z9XnbLSvrI9gDkIAy_nN-Ixp3Y"]
	},
	15136: {
		defindex: 15136,
		name: "Dressed to Kill Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEMq4tOdxITcTYDveGYAH8405siPNbLMDd9i3piSS4PzpbXUXsq2lQyrOHpPI11cXYpPYc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEMa4tMttMHciGXvKBYgr1uU86hqIJfJ2Moyvs3yjra2pbDkHt-zlRm7XUpPI11bwpXQD_", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEMK4vY90eF8mDWvTSZl2ovxk_06FZJ8PapHvqjiXoO25fXhLi_D8Mn-PTpPI11QMnHY2T", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEN64qOd1PH8WCXf_UNwupuUtq0aYOLZaJqC7riCnqP28JXBW_829Xn7XUpPI11fnjhKMJ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOENq54OdFMHcjYC6OFYVqp7B451qhVfZyL9i7n3CjhOmhbWxXq_DlQkbWPpPI11TNa1x6K"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEMt96ZZsIRoaFRKeBYAup6x88iaRYLpGK9iLt1Si6aTxYDxHurm1Xm-_Ts-c-gD4TRiKu7bLbhteUbLM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEMd96ZZsIRoaFRKSEYAj7uxg9gfIPLJCBoCrm1S7ra2pbD0frqzlVkO6Fvudig2gURXCu7bLbKPWXZ0A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEMN96ZZsIRoaFRPCFYA3_6xo4h6lUKZ3Yon-8jCq8bGYKWkHj_mwMzeSEuuA9gGYWQnau7bLbglOm5eY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOEN996ZZsIRoaFRP6CMA706BhqiaYMfZfboCjmiCTgPT1bDRa_829SzLCPv-Ri1DwUQ3iu7bLbtRDRbY0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYQrLEaVMTvw8-A3TDTU3-9RmUMO5_LIKJWOo4dOENt96ZZsIRoaFRKLQYgyr60Ns0qhZK8aPpC7v3iToP2cOD0buqzhWnLCH7OY5ijkQFyeu7bLb8nXco3c"]
	},
	15137: {
		defindex: 15137,
		name: "Coffin Nail Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctlSGsCCXPTQZgGsv0lpgPJaL5bbpn7n1Sq8OT1ZUkDq_G5Rm-eP7rs5hHFWHSYCwddOmg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctpSTpXYU6SOZQ777U86gqRYfcCO8XvujyvsPWpYX0a__DkCzrTSv7pqhnFWHSZJfw0D_A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9cttSHsaDCfeAZVj06k5rg_dZJ5GNoiK6iyzqPW0MW0firjgEmbOPs7pognFWHSajZhIBoA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctxSGJTYCKWHN1z46B9ugPAMfZOK9S7t3Cy4bDwJDUa4qDkDm-OFsuE90HFWHSbwJDnK2w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ct1SGJLSD6DQZVj77Uw8hKFaJsCP9nu-1Xi_PThYCBfir20MzO7S7rc903FWHSbwgkReIQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctkjSZWTHq_AMxeu601sh6ZcL5PdqXzpjirpOT9bWxu9_m5VnO-PueE5h2ofEiXj_-yFt4CnZUapaISd", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctojSZWTHq_AMxf04kxthacMKJTcoyq9jiXoM2cNCEG6_GwEn-KDu7trgmxAF3Ll--6It4CnZfyty5ih", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctsjSZWTHq_AMxf06U49iKkILMaMpyu-iSnhaG9fCka4q2MDybPS77A5hz0UQXK2-Ozat4CnZU7VeQND", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ctwjSZWTHq_AMxf86EtugvNYKsbb8irr2S-8OTwLX0C5r24EmOWHuuZj0TxCESO3_O-Ft4CnZQkqrAvj", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9S58b0PJ1K-7d6pdOV9ct0jSZWTHq_AMxep7khq06lfLpGJpS-6jym7aG4DDRXv8mxRme-Bv-Y9gW9FRiLmq-SPt4CnZcRc1TM5"]
	},
	15138: {
		defindex: 15138,
		name: "Dressed to Kill Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcHOWfLQNVuuuR880fMOKZSOoH691C_uPGdeCBq4-2hWkOeCvOc90TkTEG_w87todNDc9Q", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcLOWfaGZ1ypvk5rh_NbKZHdpX7tj3jtazsNDULu-mwDnueC67Ft0DxCEG_w87vTuf5yhw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcPODPGDMwuvuU1rgaFdKsHYpii92H_vOG4PDha5_j8Hzu_Tsro40G4fQW_w87vjskBGGQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcTOC6PSNwr-ux5qhqlZK5OL8iy73C7pMmkJUkfu_joGm-aAvec_hG0UR2_w87sSeBKK3g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcXODPPQMFyrv0g61KlaLsON8ni-iH_oaD0KCRbjr2INmLKD6OE-gWxEEG_w87uMWaRaUg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcG_DKPFIlC7v1VrhvJUfpSMpCrvjn7rPD8IWkfvqWoDmu_RvuNihWpCFSCwq7iNoMT5LLHok1XmtX4E", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcK_DKPFIlC7v1U90qhbLsPc9Cjn1X-9aT0MUha9q29Sy-GF7LtrgT5HQ3Czq-rarZarLLHok0iLduon", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcO_DKPFIlC7v1Vq06ZULceOoi3o3S27PGdeXBK--msCmOeE6bRs1G0SQXHlpL6OoJH5LLHok_u2aZBr", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcS_DKPFIlC7v1U6g6lcKMSKoyq8iSS6bm8CCRu58jhVkLOD7OY50zkSR3W4rOyJ-pKtLLHok78l3Yhl", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYYRDLAqtHXvo39gTtHCkx4MJxa9Ok8qgVLFir69mfb-xDd40dXcW_DKPFIlC7v1U_hqhfLZ3fon7riHy9ODxfChrjrmkHyuPT7-c9i2sXESLi_-_docCoLLHok9X3GI3A"]
	},
	15139: {
		defindex: 15139,
		name: "Dressed to Kill Wrench",
		hasWear: true,
		the: true,
		grade: 6,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOw3xs4PCZ-QkY94ZGMXXC6LTbwz_6kMw0_BZKJfYpn7qj3joMmgMWhK6_3VExrFXWwjX5A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOw7xvYvGNLcpM9hITseFXvLSMF_7uU1u0_Rde5Xfo3--3ym6Pz0IChC_rnVExrHZw3IaoQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOw_x54uVYeYvZIpNF8fUXf7QZF316RkwhqddfsCBoSjs3CvqOWwNChHr-nVExrGIyo0P8g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOwjxtIvBNLR5Zd8eGJKECKOHYFr-6UgxhPIJecGBpyPu2irpPW4PWkfrr3VExrHWGu4PRg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOwnx4ITBYrJ_MdweHpXZU6WFZQqv7ko8hqgPecOLqH_q2nm7az8DDhbu_XVExrHSPUTzWw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOw2A4teFd-lqZcZOHcDXX_-CZVj-ux87iKRUJsSL83vo3C27azheWEHq-2JRzeSCvLU_nC9IFLVdtXo3", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOw6A4teFd-lqZcZMTMWGWqSGNA3_6Ew6gqBaJpWO8y7tiX-4PmcKXxDs82hWzbPT77tpnC9IFGtvAMkv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOw-A4teFd-lqZcYfH5ODU6eEZVr7u0M_1fVbL5CL9nnm3Xi_bDxfWRXu_T8CkeWGvrRqnC9IFOMkcf59", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOwiA4teFd-lqZcZKTciCXvHQZVj07EkwgKZUL8SKqC663ijpM25YCBq-_jkBy7DW77tunC9IFNi8AW2t", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY_Eo8Rv_DCMm58xqWNuJ4L4HOwmA4teFd-lqZcZNG8TUDPbUYA34708wh_QOLsCIpiy81SS6O2hZXkLu8mwMkOfUuLBrnC9IFP6ppBFT"]
	},
	15140: {
		defindex: 15140,
		name: "Top Shelf Wrench",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXnub8AK1285oHOMrN6ZooeTpSGXffTYQ-r6UM6iaFdepDb9ni6j3jpaWgUG028P9ysIMk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXkub9QLATs54KXZeR-Y99PTcDYCaCBM130v047haZdK5PdoHnr1Ci_PjgUG028GjfebEU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXlue5ecQvu4tTPO-QtNtFIS8PRDKPQMA-ou0lpgvQIfpeOon-63yXsM2kUG028rr1rwns", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXiuexTK13utITBN7IuOd8fF5aDCafVZA6o4h090fNYfsGBonzm1S_obz0UG0285o36zds", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXjue8DeA7rsYXGYrkvON4ZGJbWW_eBYQ76vh9q06ZdLsOA9Czv3367b24UG028wE5yhfQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXnyL0DOki28tfYYuYkON5OGsjWWPSDbw-v7kJrg6MJLJSP83m93XztPmgDWEK6_z8FnPjH5OVdzDKyKA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXkyL0DOki28tfYYbl6ZtlLFpPWXfaPMlz94kg50qEOKJPao3zq3C_pOj8OXBXjq2sHmPjH5OULPHpl8g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXlyL0DOki28tfYO7YuN98eSsWCU6WDb1-p4x9t1fRaK52BpiK82Sq7PzteCUG9_mkFnfjH5OWDNSfFrQ", "", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Ma3jNlhQ1-OeK7PjJYZRbHD6NWY-E15BvkDCs019BmVcXjyL0DOki28tfYZbh6ZdtIHZbSX6CEYAyo6Es7gvNZLJOIpHm52C3vOWlbCRO6-GgHyfjH5OVxz1asDg"]
	},
	15141: {
		defindex: 15141,
		name: "Warhawk Flame Thrower",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15142: {
		defindex: 15142,
		name: "Warhawk Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15143: {
		defindex: 15143,
		name: "Blitzkrieg Knife",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dUyGtS1pbkDLV-94ofCMLIoZY0ZSsiDU_HVYVuu6Uo90qdcLZeLpy_o3Hj3ejBd5RIDczQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dUxGo7u9e9XLQS65oWUN-MuYYxKHZSEWPODZFj67B47hKddKMeK9izu3Sr3ejBdigkaIxY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dUwGoHj8uIFeV_ts4uQM7Z9ZooaTMOED_-OYw7140o4iKZVecSOo3y5ji33ejBdoT7iQnk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dU3GoC0oL1UKArp4dDFZbQuZdpMTMTZW6eFZ1j6u0MxhqQIeZ2M8y292SX3ejBdt9BH3J0", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dU2GoXvoO1UeQu64IDHM7F6ZY4ZF8SCX6KBYl39vhlph6lVLJeKqXnojCT3ejBdn1bB9rI"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dUya9Gz5K8PP1nx5tCVZuQrYtodGJGFD6fSZgj64h0-hvRefJHd8SPtiH68PjgLWRe--3VExrFHPyIQ-w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dUxa9Gz5K8PP1nx4YaVNLguOIsfHpGBUvLUZgqsvhg5hqdbK8HdpS68jiy6bGYLX0DjqXVExrHvj5Ycbg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dUwa9Gz5K8PP1nx4IvHM-F4ZItKTcPTDqOCN1z_4k05haJbJ5SO8y65jiXvOWgMU0LsrnVExrFScdtt1w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dU3a9Gz5K8PP1nx5daXO7MvYtxKG5KBU_6HYgH9uUI6gfRYJ5Xc8n7n1CS9aD9fDxe6-HVExrHJ-3WPWQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvADalKRv4o_Q3rNjA36dU2a9Gz5K8PP1nx4YKXOuQsNo5IHsjUU_TQNQ_56E08hqEOL8GJpXy-iSW_PTtcXkK9-HVExrF1b5EXcw"]
	},
	15144: {
		defindex: 15144,
		name: "Airwolf Knife",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVjppc3B9O0oelTKgTm54fHZeYuZokdScHYWPaONFv-uBhpiKFffcGJpiLxnXO-ROFbtMM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVgpsJiVoLi9r9WeA_osYOSMLgtN44fHpXTCPGHZAv06Bg70fVeJpaM83vxnXO-LXqPwwo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVhppNhAtG0oO0CLAy6sYLBZ7gkZtofTsmBXqTQb1qu70hugaRUKZXdqS3xnXO-V4cxvDw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVmpsU1UILgoLpTKl7mttHOZuUvNY1NTcbSW_GBMFr8ux4xgaQMLJOAoHnxnXO-LHTXMgA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVnpp9hUYfmrulWKFjp5dPBZrMkY9BETZLQD6KHMgupuBk9hKJbJsSNoi_xnXO-49AxqxA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVj18FmR8O_4b5IfV7o4NCXN7J_MtpLHMbTWqLXNQ71vENp1KldfJGOpH_tiX_vPT8MWA2rpDzKpeNGpg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVg18FmR8O_4b5IfQnos4HCYrZ5ZtFFHZPSX6KAMwj_6hk41qReJ5CJoHjs3XzobzgKXA2rpDz7HrQpBA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVh18FmR8O_4b5IfV-64IDGZ7h5OdBPS8CGXvPUMgH_40o_hKkJKZyBo3vr2Ci9bGgIXg2rpDwlz7r63A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVm18FmR8O_4b5IKArs4IaVMbMtY45OHZLTX6WEbgmo7Uo7gqleK5CL9Xm71HjqbjwOUg2rpDxCCl4Vlg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy-Pj5hdzvDCLJJU_k8yx_pCDVn18FmR8O_4b5IcFjv54aTOuMpMo5KGpaFDqWHbgH_uB46gqMMKJ2MqH672HzsOW5YWg2rpDyNz_NndQ"]
	},
	15145: {
		defindex: 15145,
		name: "Blitzkrieg Medi Gun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRob49rgEKl7rsIeVOuJ6MdgeHMmEU_SAYF317UlugqkJKZCPoirq3yq7PXBKBUT6g2B3Cw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoX48eoAf13msouVMOQsZolLG8CEWKXSZQv8uE88gqMPeZGK9ivu3CjuOnBKBUTiaYRMLA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoT4pb5TfgTp5YPFNLl4MdpNGcbXXKLQZwn_7R0whPBYeZzcoSvr2Hu7M3BKBUS4MSsGtg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoP4o-gFfF29sNbCMrkvY9tNFsiEWPPXYVr76h5p1aUIJp2OqXjsiCi_O3BKBURwZ0Z-FA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoL4pLoAKg_mt4TENrZ-NN0fSZLVC6eHYAuo70lphPULKsHfon_p2ijrPHBKBUQeMUKgKQ"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoaJ8b4VPVWp4ZyXMOUrYdBKGMLYWPHTNQmv6Eo9iaYJKsTd9Cjo1XnsOztZWRW5_20GhqbZ7S7g53c9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoWJ8b4VPVWp4ZySM7QrNtpEGJPUU_OEYQj76UNsgqILecPcqSK-2XnsMmcDWEHirD5WhqbZ7SEY4Imb", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoSJ8b4VPVWp4ZzONrd_Mt1LGZSGXKPVYluu4ko9iPRbKMCAqC_m2y_pMzwNDRa6rmxQhqbZ7WICmAJY", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoOJ8b4VPVWp4ZzEZuJ-MtBKTJHZD_7Ubguo7ks8iKJVKpGKoyLp2CjhPT1fUkDoqDhQhqbZ7Sszivn4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqJSVeEg_xrlDCAN_8JiRoKJ8b4VPVWp4ZzBNuUpM95JG5aEXKXSN1qrvhhshqNVeseJ9Snt3i68bmxcUhq6-T8EhqbZ7Q8MeWOr"]
	},
	15146: {
		defindex: 15146,
		name: "Corsair Medi Gun",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pYtAIGy9ukEfg6-tYWXZ-QrMtxIHMfRD_LUNVr070w8gPdVfpaPpirv3TOpZDmpby9ZYA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pUtVYfn8bgDfArr54LGYrd_Y9lNGZOEXKLSbwH64xk80agMLcDY8iLu2DOpZDlo6GpBCA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pQtDday9roHKAzqttHFMLkqN45OGpHXDvSDZ1yrvBgwgqVYL8Da8yy5iDOpZDlxFCubqg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pMtAdbg874EL1ru5oSTM-UsYo5MTcjWXvKBMwH06084iKhVfcfdqCO5jzOpZDnwFmN2Cw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pItUtWzruhecF6-5dGXZ7QoM94aS5HWXPCHZl-vux5sialee5aOpizmiTOpZDnPKfj4nA"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pZcUtKl47IQLBLp4oPEZ-YrNY1NGpTUCfCOYVys60sw06RbJ8DY8SPsiS_uOmgLXBLv5Ctaz54vQtEb", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pVcUtKl47IQLBLr4IOSN-QrY4oZFsGECaSBbgqs60o6gaFee5eNpyvt3HnqbmsOX0bo5Ctaz_H6myhI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pRcUtKl47IQLBK7vIuVO-IuOYkaG8WEWfKGZV347k08iPdfK8SMoSK9i3nqP2wMUxfu5Ctazxj-DrA2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pNcUtKl47IQLBLo5tDPM7kvZtlMGMmBDKSFYVv-7h0_gKJUfJKBpSvs3ijuaTsOWhvu5CtazzmmCv17", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4NTNudRHMPqNRTuY7_RrTHiIz-pJcUtKl47IQLBK5tILOZbAsMIwdSsTUXvaOMAz5ux4w0_MOJ8DY8Xy53Sq7bm9cU0bo5Ctaz6Rd1fJr"]
	},
	15147: {
		defindex: 15147,
		name: "Butcher Bird Minigun",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXnubpfeg2754aUNuIuMNxOH8PUCKTSZFz87hhthKhYeZfdpSns3i3uaWYUG028k-avl0g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXkuexRfAW94dTCMrAtONwfH5PVWaKOY1qvv0NrhKVfLpaLoHi5iyntOjwUG028KBDiQQc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXlue5SfAjq54aSNrEtMI5FGcTYC_eAYwysvkIxiKZbepaMpS-9iyS8aG0UG0286dcJkj8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXiuewCLw3st4OVYLYoOdkdGsjYCPKCZgur6Rk81KYOfJKIqHy72i29O2kUG028xUj7nqA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXjue5WLwS7t4CSYrMvOYwZTcLZW_WPMgz74k871alcKpCMoSno3Ci8OT8UG028waJzwwk"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXnyL0DOki28tfYZbUuN45LH5OEUvSFYg717Blu0_VUKpaOo3vmiy_oaWYDWELirm5Xy_jH5OWW8labhA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXkyL0DOki28tfYNOJ-Zo1LSpKDCfbQNVv060s5ifAPLJbc8i2-1Xzqa2YPUhS9qD4CzfjH5OWUmS6xdg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXlyL0DOki28tfYO7MvYoseFsXYDvLVYQupux1phKZafsaK9H_ujCjoOmteDhK68j0HnPjH5OXqQqwgkw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXiyL0DOki28tfYZ-Z9M99KGsjYX_XTZgCr60JthPdVfcHcoH_qiH_sb2kCXxTtr2pSzfjH5OVS7eakmw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNy4OTludRHMPqJLSPYy8RruADU219BmVcXjyL0DOki28tfYMeUkM9tPGJWGWfeAZg75vhk61fJdfsOAoi6-3nngOGsCD0K4-T0NnPjH5OU3Df9f5Q"]
	},
	15148: {
		defindex: 15148,
		name: "Blitzkrieg Pistol",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxBZnhpuxUL1_nvNbDYeUlMNxIS5GCCPDTZgj96Bk6gvMOJpTY9ivr2Sq_JC5UDIOiJWvc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxBpnmp-9eeAru4dTDNrkqY45KSpXXCPSBMw744h45hKdcL8aLoXnt2S3rJC5UDL1p5cB6", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxB5nnru5RfAu7vIHPO7ItONtJHMXQC_-PZ1r7uxk8hadaJpWBpyrsiXi7JC5UDFZmeGr1", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxAJng9LoHLQXmt4TOM-IlMI4fS5LUXKTUZAD660I4haNdLcbfo37m2C3hJC5UDHSy_0k7", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxAZni9L8Eeg2654DGZbgsMNFLTMHZCaPTN13_vEpsgKEILJyK9iPt2n7pJC5UDBgt_b4p"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxBeiw8qgSIEq6qoOVNbV_Y9FIHJbTDv_QNVv86B5rhKZdJ8SOpim5j3zqMjxfCkW4rz4a2LjQt9EF8Gw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxBuiw8qgSIEq6qoaXMbAkNItEG8XSC6fTbw_87hg-gqUMJ5PdoHnr3yjhPDoKX0Htr2wa2LjQQQor6D8", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxB-iw8qgSIEq6qoLCNrJ5ZtxKHsjWUqKHYVj840MxgfNfJ5fa8nzq2HnpbGoKWkDu_mga2LjQWpkOIrQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxAOiw8qgSIEq6qoLFYOYlZNoaTZaCX6XSblv-4kk61alffsHd9ijq3Sq4PzteWRLi_msa2LjQtmnPzHo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNylOSRzfQj9A6xXSO8x5gHpDhgl7cZxAeiw8qgSIEq6qtPAYrAqMNpOS8jVCfWONVuovB0xgPBdfJeL9ivqjCu9PGtYWxS6_W4a2LjQs84ThGs"]
	},
	15149: {
		defindex: 15149,
		name: "Blitzkrieg Revolver",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXnuexVfF684tHAZ-EvYdlFF5XWXvKDYVv870xuiKdUJ8aKoHnq2C3rbD8UG02823c8oII", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXkuexVfF684tHAZ-EvYdlFF5XWXvKDYVv870xuiKdUJ8aKoHnq2C3rbD8UG028mgrH7Eg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXlueJefgvv5tDFO7cuZtFOGpWGCPLUNw70u0lq1KlcJ8aJ9iu8ji3oPTgUG028I_RGKEQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXiueJefgvv5tDFO7cuZtFOGpWGCPLUNw70u0lq1KlcJ8aJ9iu8ji3oPTgUG028w4tygAQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXjublQegi-5dGTYeElNt9LSsXZUqOHY1j840xt0aVYeZOMpHvmj3nqPmwUG0289ajNIIg"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXnyL0DOki28tfYMbN6ZNlFGMSFDKSOYQ_74x8xialaLJTY9i_p2yi9PjtbCkHj-WgGkfjH5OUZuCdawA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXkyL0DOki28tfYMbN6ZNlFGMSFDKSOYQ_74x8xialaLJTY9i_p2yi9PjtbCkHj-WgGkfjH5OW4SWb7jQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXlyL0DOki28tfYZbAtM9pOHcOFCfKBZ1r9vx050qEIesCK8Srs3H7uPThbXxPrrz0Fn_jH5OXAbjcZRg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXiyL0DOki28tfYNeYtMdkdHZTZUqSCMF3-6Upqh_dUK5KJ8SPt2n_oOTgLDUG5-m8DyfjH5OXabxMPzQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNynNSFofhLHE59cUPwu7gP-ACI119BmVcXjyL0DOki28tfYZrl_ZNtFGMXXWPLXNwH-uB0_06kMKZGK9SPqiXvhbD8NXUHt-zgHmPjH5OXiYoa4lw"]
	},
	15150: {
		defindex: 15150,
		name: "Warhawk Rocket Launcher",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15151: {
		defindex: 15151,
		name: "Killer Bee Scattergun",
		hasWear: true,
		the: true,
		grade: 1,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15152: {
		defindex: 15152,
		name: "Red Bear Shotgun",
		hasWear: true,
		the: true,
		grade: 2,
		images: ["", "", "", "", ""],
		festives: ["", "", "", "", ""]
	},
	15153: {
		defindex: 15153,
		name: "Blitzkrieg SMG",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYguYk0B4C187lUfQ7nsovDNLN6ZNoZTcHYX_HQbwqu4k860qZcLZLYqCLmw223bb3XtI8z", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYguolgDYDn8elUKw_s54PBZbN_Y9oZTZbWXKWBbg6ouxg4iaFVfJCJ9X_sw223bdcvxpLn", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgu4k2UYbnrr5Qf1nu5oDGNLYtNNEdTcnYX_WON1yp40ps0qNbKZfc8S3qw223bUjLF_Pg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgvIk0UIHh8uJRKAy554fHYrErNYxNTMLRD6KDZQyovx06hqVdesPcqSK9w223bcf4Cyxv", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgvYlnAdbgprlVfAvsvYXEN7F5ZIpKHcbYW6SBYAD_6ElpgqVVepCMpSO8w223banistn4"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgufhlUcSi_q0DZw_osdGVMbF_MN9PFsDTWvfUMlv67kJrgqhdKcbYqCK82HnsaTgLU0H1ujVTtmV43nw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYguvhlUcSi_q0DZw68sYrPZbAvM4tOGcDSXqSFYl2u6kI7h_AILJCApy-51X_rMmZfW0X1ujVTWV3spmQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgu_hlUcSi_q0DZwju4YCUYOYqOYsYG5TTW_bXY1j06Uk91KIIfJWJoy7s3XvrMjhcDkX1ujVT6arcwJU", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgvPhlUcSi_q0DZwnotICTNbErYoxKH5GBD_TXYQ74vE0xiKhcK5aO9Hns23zqOG5cWhT1ujVTt5cJDqg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPTBYcAjLFbpVTvw_8zf7DCYgvfhlUcSi_q0DZwzr5dHCNrR_NYtOHpLQCf6PZw6sv05r1aVVKp2BqS_o2Xjrbm8PWhX1ujVTC8OKXSo"]
	},
	15154: {
		defindex: 15154,
		name: "Airwolf Sniper Rifle",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXnub1UKgrt4dbCYrArNY4eTZLTX6SDYQ2svEw9iPQLJpGI9CjniynvbmsUG0280jOkHqs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXkue9UKAXnvIGUYuQlNtBETcCEX6XUZw306EMw06VYfcPapijv3X-7PGkUG028KfmAzpg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXluepQeQW5s4rCYrh6NNgeTsDZW_SHZwqv7kNsgqFUKZyPpSu-2S3rPWYUG028X49mNVI", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXiuetQew_r4oeUMbF4MdhNS8TYC6SHb1qsvh89gaMOfJfcqXu91HzvPG0UG028ojvy4yk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXjublSeFi5tYPHMbcpYd5JGpLZWP-CM1_-uEJsg6dde8CL8iPo3Sq6bmkUG0287vYfFj8"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXnyL0DOki28tfYO7J5Yd8eH8bSXaSFZwiovx48gPQOfpTa9nnriSXgbmleCkHi-T9VnPjH5OWpsHbn9g", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXkyL0DOki28tfYMeJ6YdAZG8SBDPTXZVuu60Jpg6QILJ3cpy272yu_bGYCCEHv_D4NyfjH5OWIr6Ebvw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXlyL0DOki28tfYOuElMY4dTcLWX_KAMwH1u00-h6RYKsDa9X652njhPGhYWUa__DoEyfjH5OXRIvVUPA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXiyL0DOki28tfYN7EuOdFKSsXTC_GEMgqr4h9q1qZVL8aM8izt2CnvM2wJW0DjrGtQy_jH5OXDE7bTLw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymPj53dxbQCKZSWco7_Rr7Bis019BmVcXjyL0DOki28tfYM7B_MdwaTJbSXfWFNwD57B9qhvALKcaBoX6-iHzvMmYNCBfjrGIEnPjH5OV03CBG9g"]
	},
	15155: {
		defindex: 15155,
		name: "Blitzkrieg Stickybomb Launcher",
		hasWear: true,
		the: true,
		grade: 3,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEMq4qN9xPHMXWDvKBbgH8uBlrhalVfpHaqS25jy27bmcIUhS4r28CmuSFpPI11UUAsZf4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEMa5-NdgfGMHZC_HUYAz57x04hfcIe8aKpSjnjyu7bj8DDhroqWsDm-CEpPI11ciohhDO", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEMK4pNt9FSsXZCPWPNAz5vx04g_IMecOLpSvojizvaWsMDxK5qTkHnOWDpPI11TpeO_p2", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEN65_NI4ZS8WEXPKPNwH44h09iKUPLpyOqX_miSjhO2gDDRXs-z8Mm-6ApPI11UCcMxQ9", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOENq4rM9wfSZHWU__UNw2r60s9iaZZKsSP8n7t3CW8Pj9fDxq5-GsNze6ApPI11QuQgpic"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEMt96ZZsIRoaFRKfSblj57k5sgfNVeZeLonjo2S3pOWYIXRLr8m4Mm7eEubBuhTpCRyeu7bLbGaRVu9A", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEMd96ZZsIRoaFRKSONAGv6xk7h_JZfcDdqXy-i366M2sDXBDq8zkMnbWG7rZj0DsWEiKu7bLbUgW-q0c", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEMN96ZZsIRoaFRP-HNQ_-6Rkx1PAJJp2KqHi8iS_sOmhYXxHq_z8Mzu7RveE_hWhFEiWu7bLbmDeTgMQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOEN996ZZsIRoaFRKeHZgmo7ko-06RcfJWK8i3r1SW4PmpcWEDqqT5Xn-XW7rdu1GoeFSOu7bLbu_kLNVk", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymJD5keR3ADq1cUPQv-gvkDDUN6stqQM295bIDLmOo4dOENt96ZZsIRoaFRPGONF-s60w7h_IIJ5aLpyzv3inhPmdbDhDt-TpRmOaD7OFv12dHFXiu7bLbPDeHZmg"]
	},
	15156: {
		defindex: 15156,
		name: "Airwolf Wrench",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYguYk1BNa0ob0FLQm7tYbHYbN9MN5KTMjUDPOFNAyu4xk-gfdVfcaBpSPow223bYhWLTSZ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYguokxUIXn8e1fcQnptoeVYrF9OdlOSpXXWvHUbwn9uUhqgKgILp2IqX_pw223bWvxlBd5", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgu4k0A46zr-IELwvssYvCNbQoMolKTMnWC_KOMFr47hg50_IIKMTb9S7tw223bfQjTBK3", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgvIlhAdS3ruJWLVi5vIXGYeEsOdtISZODCKXVYw6s6Utp1PJYesCB9Cy6w223bfv09kPo", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgvYk1AYe39O0DK1jptILOZbgvNIlKFsiCW6WGYwz560lrgfNcfJPcqXznw223bW4tlqTw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgufhlUcSi_q0DZ1m54YbCNLgkN9tOHcLYCPOFblr66R0_1KlYKZbY8i7r2Sjtb2pZWhb1ujVTLLXDcgA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYguvhlUcSi_q0DZ1q84dHOO-MrNosZHJHQXqCOYw796Etp1KUMKpeK9Sy7jynuaWgKDRT1ujVTFyWjAf4", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgu_hlUcSi_q0DZw_rsNbHNrQoMdFMSpTSW_SBZAD-60Ns06Vbe5CBonvu1S3qOjhbUxD1ujVT-DMQMlQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgvPhlUcSi_q0DZw7psdaQNuJ6M4wdGcTTDv-OMgipvE491fRUL5DbqSy7iH7uPzgPWhL1ujVTbYNN9zg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyiIjJpcQz9AKlMS_o28jf7DCYgvfhlUcSi_q0DZwXtsYrOZrR_ZtkfHMSFUv-FYA-ru0lt1fcLe8GJpSzpiy7pM25bWhL1ujVTT0xbKWM"]
	},
	15157: {
		defindex: 15157,
		name: "Corsair Scattergun",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRob49L9QfQ-9vIbGNuR9ZNtISsbRW6eONF_860tq1qlYLJLb8S_qjn7qMnBKBUSawxjnBg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoX4puJXLF27toTFNbF6MN4YTcXQX_GHZgr67kpqh6MOKceB83js2yTqaXBKBUS98yACNQ", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoT49uhQeQXn4IXEZ7h9MthMHpGED_PUMAj-6Ro-iaEIKJDa8Sjr3Hy_MnBKBUQhh5fP4w", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoP4o-4CcQvss4WQMbUlMIxNTsmECaDQZgqp40lp1PddfpGBpSu8jHvrPHBKBUQQdq_uqw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoL4oOkHKlq8t4fDZuZ5Y9pPHMPWC_DTMgCouRo91vQLLZaN9n7u3S-9a3BKBUSmmatu2A"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoaJ8b4VPVWp4ZzAMLYrZIpJFsOEUvbSMwz77h5tgPAMfJTYoiLt3SnoOG5fWxu5qD4HhqbZ7cS-FN2i", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoWJ8b4VPVWp4ZzEM-QsMIseSsnXC_DQZQ-p6Eo9hvVYL5aMqHy8jiXqMj1cUxW6-WNShqbZ7YxsmeuM", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoSJ8b4VPVWp4ZzDMLMlON0ZGMjWX_eEZAj04kNuhvUJesDf83jmjy_uPGgPDxDq_WgDhqbZ7XSVh4bs", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoOJ8b4VPVWp4ZzFMbV_NNkYGMjXC6OCNw-ouE5u0adVKMHcoy3p3H_rbmYLCkXo82sBhqbZ7fStQz3L", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNymMzZzZgHQBrVQY_Y15hvtADUN_8JiRoKJ8b4VPVWp4ZzOZuEuNNFKTJWFXPSPZAv44kk7gKEIK8eJpSLu3H67M29cXke9rGNRhqbZ7XWLo04L"]
	},
	15158: {
		defindex: 15158,
		name: "Butcher Bird Grenade Launcher",
		hasWear: true,
		the: true,
		grade: 4,
		images: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oPYMeYsMtwdGMWCXqWDbwqp70xtg6gOJ5aNqC3t3nngPGwLDULsrj9Sy_jH5OXuait7Eg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oDYZeMlZdpPTMeGDqOAMwusuUI5gqZfe5WM9n692SrpPm4KDha_-D0Cm_jH5OXsqj4FIw", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oHYZuQrZdoeGMHUXvGPYA767UNr1KUMfsOO9iy8iSzpbGxfWkXp_28Cm_jH5OWywv32Bg", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9obYNbl4NNxKS8jVDPbQZAr16B5ug6ZZfMHbpiO73367PT8KWxHorz5VkPjH5OUMaCPtMA", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9ofYNbh6YotOFsTUCPWDYFiovB9s06YLe5eAqS-91X7sP2sDXBDo_jlRzvjH5OWrVoY9Mw"],
		festives: ["fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oOpZeVvdIEKSt6GWqKGNVr5uU041KFeLJKI9iu93X_ga2pbD0LpqWgFy-SGvLFt0G8UXTHu-sDt5Mj-", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oCpZeVvdIEKSt6CXPKBZ1r96E870fVUecePpX7n3Hu7b2dbCEa4rmgDnuWO7rI_gDpDXTHu-ks4w12R", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oGpZeVvdIEKSt7XXPSFYg3170o7hPUMe52IpC--3iS8M2sJXRO6-msCnOPSs7Y4g29CXTHu-hGl5XHr", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oapZeVvdIEKSt7VXv-FYVv14kxrhPIMKJeI8i-5jyS8aG8ICUW6-2NRkOOP7LNq1G9AXTHu-orSs1Sc", "fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEMaQkUTxr2vTx8mMnvA-aHAfQ_ktk664Mazjd5kwhpMNyyIjJpcwDHDaFLUvYy8RrTCzIm689mRtW_5b85Plm-9oepZeVvdIEKSt6GXqXQZgCov0lt1KcIepPY9i7u3y-7aW9fCBe5_W4HmrCDvrpu1G0TXTHu-pPqp6mv"]
	},
	20000: {
		defindex: 20000,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	20001: {
		defindex: 20001,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	20002: {
		defindex: 20002,
		image: "professional_kit.e91092b5612133c80fd1c49634c89e60f375e9e6.png",
		name: "Fabricator"
	},
	20003: {
		defindex: 20003,
		image: "professional_kit_rare.51ae1c95c9db7e9baee367285187eb0365868433.png",
		name: "Fabricator"
	},
	20005: {
		defindex: 20005,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	20006: {
		defindex: 20006,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	20007: {
		defindex: 20007,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	20008: {
		defindex: 20008,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	20009: {
		defindex: 20009,
		image: "construction_kit.1fdb61cd0fa671cb99439512198681a53a52f686.png",
		name: "Chemistry Set"
	},
	25000: {
		defindex: 25000,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25000"
	},
	25001: {
		defindex: 25001,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25001"
	},
	25002: {
		defindex: 25002,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25002"
	},
	25003: {
		defindex: 25003,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25003"
	},
	25004: {
		defindex: 25004,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25004"
	},
	25005: {
		defindex: 25005,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25005"
	},
	25006: {
		defindex: 25006,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25006"
	},
	25007: {
		defindex: 25007,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25007"
	},
	25008: {
		defindex: 25008,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25008"
	},
	25009: {
		defindex: 25009,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25009"
	},
	25010: {
		defindex: 25010,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25010"
	},
	25011: {
		defindex: 25011,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25011"
	},
	25012: {
		defindex: 25012,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25012"
	},
	25013: {
		defindex: 25013,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25013"
	},
	25014: {
		defindex: 25014,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "questname25014"
	},
	25015: {
		defindex: 25015,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25015name1632016"
	},
	25016: {
		defindex: 25016,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25016name1632016"
	},
	25017: {
		defindex: 25017,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25017name1632016"
	},
	25018: {
		defindex: 25018,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25018name1632016"
	},
	25019: {
		defindex: 25019,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25019name1632016"
	},
	25020: {
		defindex: 25020,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25020name1632016"
	},
	25021: {
		defindex: 25021,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25021name1632016"
	},
	25022: {
		defindex: 25022,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25022name1632016"
	},
	25023: {
		defindex: 25023,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25023name1632016"
	},
	25024: {
		defindex: 25024,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25024name1632016"
	},
	25025: {
		defindex: 25025,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25025name0"
	},
	25026: {
		defindex: 25026,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25026name0"
	},
	25027: {
		defindex: 25027,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25027name0"
	},
	25028: {
		defindex: 25028,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25028name0"
	},
	25029: {
		defindex: 25029,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25029name0"
	},
	25030: {
		defindex: 25030,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25030name0"
	},
	25031: {
		defindex: 25031,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25031name0"
	},
	25032: {
		defindex: 25032,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25032name0"
	},
	25033: {
		defindex: 25033,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25033name0"
	},
	25034: {
		defindex: 25034,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25034name0"
	},
	25035: {
		defindex: 25035,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25035name0"
	},
	25036: {
		defindex: 25036,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25036name0"
	},
	25037: {
		defindex: 25037,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25037name0"
	},
	25038: {
		defindex: 25038,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25038name0"
	},
	25039: {
		defindex: 25039,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25039name0"
	},
	25040: {
		defindex: 25040,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25040name0"
	},
	25041: {
		defindex: 25041,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25041name0"
	},
	25042: {
		defindex: 25042,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25042name0"
	},
	25043: {
		defindex: 25043,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25043name0"
	},
	25044: {
		defindex: 25044,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25044name0"
	},
	25045: {
		defindex: 25045,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25045name0"
	},
	25046: {
		defindex: 25046,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25046name0"
	},
	25047: {
		defindex: 25047,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25047name0"
	},
	25048: {
		defindex: 25048,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25048name0"
	},
	25049: {
		defindex: 25049,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25049name0"
	},
	25050: {
		defindex: 25050,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25050name0"
	},
	25051: {
		defindex: 25051,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25051name0"
	},
	25052: {
		defindex: 25052,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25052name0"
	},
	25053: {
		defindex: 25053,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25053name0"
	},
	25054: {
		defindex: 25054,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25054name0"
	},
	25055: {
		defindex: 25055,
		image: "quest_folder_blue.2a79acfadf46b84bbb2a08d463e8118bcf7d8de6.png",
		name: "quest25055name0"
	},
	30000: {
		defindex: 30000,
		image: "robo_all_bomb_badge.07fad97737bda21abe7b7d748bb985e4692075f7.png",
		name: "Electric Badge-aloo",
		the: true
	},
	30001: {
		defindex: 30001,
		image: "robo_all_modest_pile.39ceecea08d057a6d86c265d92a733fa64a77cff.png",
		name: "Modest Metal Pile of Scrap"
	},
	30002: {
		defindex: 30002,
		image: "robo_sniper_liquidator.83ef068973e93ee5430966ff58506651f5647059.png",
		name: "Letch's LED"
	},
	30003: {
		defindex: 30003,
		image: "robo_all_gibus.3abb36f0f6cf2704518fa96649b75a76e2f2fb42.png",
		name: "Galvanized Gibus",
		the: true
	},
	30004: {
		defindex: 30004,
		image: "robo_sniper_soldered_sensei.1fc5ca4c3fbfe0fce97deef6ddc72dedcf874a14.png",
		name: "Soldered Sensei"
	},
	30005: {
		defindex: 30005,
		image: "robo_sniper_solar_topi.e5dbff0a06b7e739e2176c30f1b660a3698ded53.png",
		name: "Shooter's Tin Topi"
	},
	30006: {
		defindex: 30006,
		image: "robo_all_noble_amassment.6a3ba86247a4820746e652719dedc5812b62b7d3.png",
		name: "Noble Nickel Amassment of Hats"
	},
	30007: {
		defindex: 30007,
		image: "robo_spy_backbiter_billycock.27daf217fbcec5f3651d2f6acdccf1ebce92af64.png",
		name: "Base Metal Billycock"
	},
	30008: {
		defindex: 30008,
		image: "robo_all_towering_pillar.571d5e4a61458398f0e7263852cb5b2e63c90c64.png",
		name: "Towering Titanium Pillar of Hats"
	},
	30009: {
		defindex: 30009,
		image: "robo_spy_camera_beard.81f6545cc6d37afafd47378262fc063f2be1fd79.png",
		name: "Megapixel Beard",
		the: true
	},
	30010: {
		defindex: 30010,
		image: "robo_demo_pupil.087713f416ffd2f247333da3dc813dd340382c7c.png",
		name: "HDMI Patch",
		the: true
	},
	30011: {
		defindex: 30011,
		image: "robo_demo_beard_bombardier.8baa8c9f8cad4130374badd1ad96d70f62bc23d0.png",
		name: "Bolted Bombardier",
		the: true
	},
	30012: {
		defindex: 30012,
		image: "robo_heavy_boltedscraptowel.1f47e38b2a04134625eed860520b8c3788fe499c.png",
		name: "Titanium Towel",
		the: true
	},
	30013: {
		defindex: 30013,
		image: "robo_heavy_football_helmet.556c06caa502a2b66118735c5fc65498f9ecff29.png",
		name: "Gridiron Guardian",
		the: true
	},
	30014: {
		defindex: 30014,
		image: "robo_soldier_tyrantium.0f4df271e009c202ed41d3eb06acaed115f3a112.png",
		name: "Tyrantium Helmet"
	},
	30015: {
		defindex: 30015,
		image: "robo_all_mvm_canteen.cc86b6514a5e4d56e941e639e0820e270f42a0b6.png",
		name: "Battery Canteens"
	},
	30016: {
		defindex: 30016,
		image: "robo_demo_fro.d5c603e6c0a6e49738e34cbbc4439b06e1830a2d.png",
		name: "FR-0",
		the: true
	},
	30017: {
		defindex: 30017,
		image: "robo_soldier_shako.069947dcb4c1faa7cd50c6148b0b307c6ea93236.png",
		name: "Steel Shako"
	},
	30018: {
		defindex: 30018,
		image: "robo_dogger.0d55781757074a1cc74347cff6d9f7105672f68f.png",
		name: "Bot Dogger",
		the: true
	},
	30019: {
		defindex: 30019,
		image: "robo_scout_baker_boy.94a205dbf9c71c1ee53717527d70f7002f85c2e9.png",
		name: "Ye Oiled Baker Boy"
	},
	30020: {
		defindex: 30020,
		image: "robo_pyro_pyrobotic_tote.3b9b1678b09c460702e89599b80386ace5b8ff95.png",
		name: "Scrap Sack",
		the: true
	},
	30021: {
		defindex: 30021,
		image: "robo_demo_capotain.beadede8732767152ae6d147b9d7b9a2b011b316.png",
		name: "Pure Tin Capotain",
		the: true
	},
	30022: {
		defindex: 30022,
		image: "robo_pyro_prancers_pride.c3963a454328cb8167ac05f6f0a6c67014b9ccd2.png",
		name: "Plumber's Pipe"
	},
	30023: {
		defindex: 30023,
		image: "robo_engineer_teddy.1d834579e8a89945f76c853b9e995d13f235dd23.png",
		name: "Teddy Robobelt"
	},
	30024: {
		defindex: 30024,
		image: "robo_demo_stuntman.c05e44f90fe1c6575921f6f8ee8e0de6027cfda2.png",
		name: "Cyborg Stunt Helmet",
		the: true
	},
	30025: {
		defindex: 30025,
		image: "robo_pyro_electric_escorter.15dfd5daca285ca77666c6dd095a918f8e452820.png",
		name: "Electric Escorter",
		the: true
	},
	30026: {
		defindex: 30026,
		image: "robo_soldier_fullmetaldrillhat.72e2f15e4f61317c570abe0bca1d3c206b855fd6.png",
		name: "Full Metal Drill Hat"
	},
	30027: {
		defindex: 30027,
		image: "robo_scout_bolt_boy.1e707448af423613c8b835480376f60f1a24c8b4.png",
		name: "Bolt Boy",
		the: true
	},
	30028: {
		defindex: 30028,
		image: "robo_pyro_tribtrojan.90d48f2045360141a0450ee7526223b6d8e5bd05.png",
		name: "Metal Slug",
		the: true
	},
	30029: {
		defindex: 30029,
		image: "robo_demo_glengarry_botnet.d537170fa3eb8dec909e78cf0239788c4973930b.png",
		name: "Broadband Bonnet",
		the: true
	},
	30030: {
		defindex: 30030,
		image: "robo_scout_bonk_helm.e6b33c8c8602f20d2d2571628746ceaae971d7b8.png",
		name: "Bonk Leadwear"
	},
	30031: {
		defindex: 30031,
		image: "robo_engineer_greaser.b6a07dbe90526ead9fea0a37a6552cb1313a77ff.png",
		name: "Plug-In Prospector",
		the: true
	},
	30032: {
		defindex: 30032,
		image: "robo_pyro_last_watt.150996b57dded33a8b31aa248900f68eee3796e7.png",
		name: "Rusty Reaper",
		the: true
	},
	30033: {
		defindex: 30033,
		image: "robo_soldier_sparkplug.fa9dff3775e61bf01d5ddd84480acae25f1490a9.png",
		name: "Soldier's Sparkplug"
	},
	30034: {
		defindex: 30034,
		image: "robo_demo_buccaneer_bicorne.6fa5c5848d07ea33d97e13c47d8409221be0153a.png",
		name: "Bolted Bicorne",
		the: true
	},
	30035: {
		defindex: 30035,
		image: "robo_engineer_rustin.6eee19755b8d2c8ea226f5f3cb9c715ed57123f3.png",
		name: "Timeless Topper",
		the: true
	},
	30036: {
		defindex: 30036,
		image: "robo_pyro_figment_filament.d1d2dfd32fd4fef6f7306949ba58e69503cc6681.png",
		name: "Filamental",
		the: true
	},
	30037: {
		defindex: 30037,
		image: "robo_demo_scotsmans_stovepipe.7eed4463f9b246ede5ef2270295f1b10979379f4.png",
		name: "Strontium Stove Pipe",
		the: true
	},
	30038: {
		defindex: 30038,
		image: "robo_pyro_firewall_helmet.6e001f6f6169609c20ed612e85dc1918843e122f.png",
		name: "Firewall Helmet"
	},
	30039: {
		defindex: 30039,
		image: "robo_pyro_respectless_glove.efb0dff19d66b3e99a786fe2bdde01976e3739aa.png",
		name: "Respectless Robo-Glove"
	},
	30040: {
		defindex: 30040,
		image: "robo_pyro_whirly_bird.3f899471d653be6af22f1b3502880fba729db42d.png",
		name: "Pyro's Boron Beanie"
	},
	30041: {
		defindex: 30041,
		image: "robo_medic_otolaryngologists_mirror.7e1dcc5877bb0fddcf4f14a7407098d919f45872.png",
		name: "Halogen Head Lamp"
	},
	30042: {
		defindex: 30042,
		image: "robo_medic_pickelhaube.4a74773394f4142089f7a9a5c6efbf42c527d21d.png",
		name: "Platinum Pickelhaube"
	},
	30043: {
		defindex: 30043,
		image: "robo_medic_grimm_hatte.58156ffa901bf6b1b25401682913fcb6ee566875.png",
		name: "Virus Doctor",
		the: true
	},
	30044: {
		defindex: 30044,
		image: "robo_engineer_texastingallon.6403267082a66d3290f0b263aae3d4156cc2f3a4.png",
		name: "Texas Tin-Gallon"
	},
	30045: {
		defindex: 30045,
		image: "robo_medic_tyrolean.88b663ae8222e0271d52a08133d645b515a84075.png",
		name: "Titanium Tyrolean"
	},
	30046: {
		defindex: 30046,
		image: "robo_medic_physician_mask.e98968cc472e8d7a6ac588a86e7daf6589aaf6d5.png",
		name: "Practitioner's Processing Mask"
	},
	30047: {
		defindex: 30047,
		image: "robo_spy_bootleg_billycock.4ed6ea8db60d4008d89042a9a90b217a27d0199b.png",
		name: "Bootleg Base Metal Billycock"
	},
	30048: {
		defindex: 30048,
		image: "robo_medic_archimedes.0659363e9061987e8ff9341dde96c925b0b64731.png",
		name: "Mecha-Medes"
	},
	30049: {
		defindex: 30049,
		image: "robo_heavy_tungsten_toque.64ab42109ead9f70f1c9bcfa126006a39b625255.png",
		name: "Tungsten Toque",
		the: true
	},
	30050: {
		defindex: 30050,
		image: "robo_medic_ninepipe_problem.68d75518aa541b7541ca033c30bf5767633e3e8c.png",
		name: "Steam Pipe",
		the: true
	},
	30051: {
		defindex: 30051,
		image: "robo_engineer_mining_light.d9b53e3b435a49307019f97634cc9564e9d53786.png",
		name: "Data Mining Light",
		the: true
	},
	30052: {
		defindex: 30052,
		image: "robo_medic_blighted_beak.defb7f30c7b55f2f33b7920c60a628e41eddc11e.png",
		name: "Byte'd Beak",
		the: true
	},
	30053: {
		defindex: 30053,
		image: "robo_pyro_site_for_sore_eyes.160b7d996c9f2e650666f316db0f6481069ffe3c.png",
		name: "Googol Glass Eyes",
		the: true
	},
	30054: {
		defindex: 30054,
		image: "robo_heavy_chief.bc67ca439241a5b7454815b4220d4efb81e20a3a.png",
		name: "Bunsen Brave",
		the: true
	},
	30055: {
		defindex: 30055,
		image: "robo_demo_chest.830cb759489e269d4a8cae1e537aa530beb8d3a0.png",
		name: "Scrumpy Strongbox",
		the: true
	},
	30056: {
		defindex: 30056,
		image: "robo_all_spybot.5c1d4d35934ee8c28016c5583c08ea32ff52658e.png",
		name: "Dual-Core Devil Doll",
		the: true
	},
	30057: {
		defindex: 30057,
		image: "robo_pyro_birdcage.172596830cf65124516f08537fa5935a22ca439d.png",
		name: "Bolted Birdcage",
		the: true
	},
	30058: {
		defindex: 30058,
		image: "gunpointcoilhat.5de90f195cc1dea809a3a966101a21aa68217fb1.png",
		name: "Crosslinker's Coil",
		the: true
	},
	30059: {
		defindex: 30059,
		image: "tw2_cheetah_head.cd2c910b0e041f65407986f380dd00f25a9f02c0.png",
		name: "Beastly Bonnet",
		the: true
	},
	30060: {
		defindex: 30060,
		image: "tw2_cheetah_robe.2508992066e2530014f792cae98ec28cdba75444.png",
		name: "Cheet Sheet",
		the: true
	},
	30061: {
		defindex: 30061,
		image: "tw2_demo_pants.d01b89e56653719f59d66ae62fd8a2bcf9344820.png",
		name: "Tartantaloons",
		the: true
	},
	30062: {
		defindex: 30062,
		image: "tw2_greek_armor.847d154448350bca06a914034316acb7fe9ab2e0.png",
		name: "Steel Sixpack",
		the: true
	},
	30063: {
		defindex: 30063,
		image: "tw2_greek_helm.55fd485f87684f228135c4e7b1be65d3c91274d0.png",
		name: "Centurion",
		the: true
	},
	30064: {
		defindex: 30064,
		image: "tw2_demo_hood.400fefffb75aed051f43ba005d4add98c56eaa85.png",
		name: "Tartan Shade",
		the: true
	},
	30065: {
		defindex: 30065,
		image: "tw2_roman_wreath.dc7aa052b14a75f3920faac81778e638e0b44784.png",
		name: "Hardy Laurel",
		the: true
	},
	30066: {
		defindex: 30066,
		image: "brotherhood_2.57b6fb845dfec7f5625e7ecd084dc1ea6189fabc.png",
		name: "Brotherhood of Arms",
		the: true
	},
	30067: {
		defindex: 30067,
		image: "riflemans_rallycap.bb07637e5fddd8a47ccdd846d48a5fd757dc786a.png",
		name: "Well-Rounded Rifleman",
		the: true
	},
	30068: {
		defindex: 30068,
		image: "jogon.40018e9c43924c3c816e8563b8c1b2806c1c2bb9.png",
		name: "Breakneck Baggies",
		the: true
	},
	30069: {
		defindex: 30069,
		image: "enlightened_mann.d4d9a5bcd577cd8b1817d34d34262591ea821848.png",
		name: "Powdered Practitioner",
		the: true
	},
	30070: {
		defindex: 30070,
		image: "pocket_protector.5691d15735e68c3682ae97e18e14c909664ada1b.png",
		name: "Pocket Pyro",
		the: true
	},
	30071: {
		defindex: 30071,
		image: "cloud_crasher.d005ef29b69251e46c6e073f690da0c75f6c3da9.png",
		name: "Cloud Crasher",
		the: true
	},
	30072: {
		defindex: 30072,
		image: "facestabber.670b16be480d23196fdf553cd9709d17e7e8ceee.png",
		name: "Pom-Pommed Provocateur",
		the: true
	},
	30073: {
		defindex: 30073,
		image: "mail_bomber.ba8e3428a58a03043324e83c99de62de118702e0.png",
		name: "Dark Age Defender",
		the: true
	},
	30074: {
		defindex: 30074,
		image: "diehard_dynafil.3bda714588c4a1f83045771af18674d5321cad87.png",
		name: "Tyurtlenek",
		the: true
	},
	30075: {
		defindex: 30075,
		image: "hazeguard.e9f2d42b233e4b3b6608bb949983754c63cc4a6b.png",
		name: "Mair Mask",
		the: true
	},
	30076: {
		defindex: 30076,
		image: "jul13_scout_varsity.58c324e50cb47ef7ee752799e75aea3b9b8a47d4.png",
		name: "Bigg Mann on Campus",
		the: true
	},
	30077: {
		defindex: 30077,
		image: "jul13_the_cunningmann.6a965aaac046bdf67ec27fb14f9113db00551860.png",
		name: "Cool Cat Cardigan",
		the: true
	},
	30078: {
		defindex: 30078,
		image: "jul13_greased_lightning.3f4cda3de4c3c95671b91342e5066c627978f520.png",
		name: "Greased Lightning"
	},
	30079: {
		defindex: 30079,
		image: "jul13_red_army_robin.f51f8d7dbccf219d5c01ec079a12588f87b95d2a.png",
		name: "Red Army Robin",
		the: true
	},
	30080: {
		defindex: 30080,
		image: "jul13_heavy_weight_belt.f908a3f4302d9ebccd23465e7577a79f7c2acdc8.png",
		name: "Heavy-Weight Champ",
		the: true
	},
	30081: {
		defindex: 30081,
		image: "jul13_unfamiliar_tarboosh.055d11a195db00d04965095097181d8842c92997.png",
		name: "Tsarboosh",
		the: true
	},
	30082: {
		defindex: 30082,
		image: "jul13_pillagers_barrel.7e300a13fd99afb390b4aff37af5f4403ba9c901.png",
		name: "Glasgow Great Helm",
		the: true
	},
	30083: {
		defindex: 30083,
		image: "jul13_koolboy.6495a12c1f90d062aff1237e13c393f944352372.png",
		name: "Caffeine Cooler",
		the: true
	},
	30084: {
		defindex: 30084,
		image: "jul13_skater_boy.e48a0094893567ce156f84c3ef236b85ebcc4339.png",
		name: "Half-Pipe Hurdler",
		the: true
	},
	30085: {
		defindex: 30085,
		image: "jul13_macho_mann_glasses.4b6d3f8ab40eff2a9fb96a85ab4c5c7a322f6f52.png",
		name: "Macho Mann",
		the: true
	},
	30086: {
		defindex: 30086,
		image: "jul13_scrap_reserve.25a4ff3cbe9e921f0190fe2b0405c2557a6b886c.png",
		name: "Trash Toter",
		the: true
	},
	30087: {
		defindex: 30087,
		image: "jul13_thirst_quencher.f007a47ce0a141316bf9854bc6efc5960fefba75.png",
		name: "Dry Gulch Gulp",
		the: true
	},
	30089: {
		defindex: 30089,
		image: "jul13_el_muchacho.0deecdc9c20675afc6201e1f26a8e186faafb7e8.png",
		name: "El Muchacho"
	},
	30090: {
		defindex: 30090,
		image: "jul13_furious_fryup.769ce45198726cdee3bfb432400e3b765a692652.png",
		name: "Backpack Broiler",
		the: true
	},
	30091: {
		defindex: 30091,
		image: "jul13_hot_rag.0638975933f80eda3ca8dd3775652a15179f82b3.png",
		name: "Burning Bandana",
		the: true
	},
	30092: {
		defindex: 30092,
		image: "jul13_soot_suit.5e553e8ba76ad6eb91499ab9ea124c4a375c9478.png",
		name: "Soot Suit",
		the: true
	},
	30093: {
		defindex: 30093,
		image: "jul13_bee_keeper.ff036660863328166e97c88e4625459460952dd1.png",
		name: "Hive Minder",
		the: true
	},
	30094: {
		defindex: 30094,
		image: "jul13_katyusha.2e6729a4737a328bcb7461acd9c131d8bd1bbe95.png",
		name: "Katyusha",
		the: true
	},
	30095: {
		defindex: 30095,
		image: "jul13_positive_pressure_veil.781916703ba5b71e9cb6c1c7024d1e86d42bcadb.png",
		name: "Das Hazmattenhatten"
	},
	30096: {
		defindex: 30096,
		image: "jul13_emergency_supplies.26b61cd0ab59056d1204f8eb86a97f554504b423.png",
		name: "Das Feelinbeterbager"
	},
	30097: {
		defindex: 30097,
		image: "jul13_secret_state_surgeon.831345e47f7553ccba23573f5e8568a664d9089e.png",
		name: "Das Ubersternmann"
	},
	30098: {
		defindex: 30098,
		image: "jul13_heavy_defender.526b43e365a650ff63a85442040c159f4e6d3ebc.png",
		name: "Das Metalmeatencasen"
	},
	30099: {
		defindex: 30099,
		image: "jul13_king_hair.0d23b24614f5aae3889d210f1ac43a468ab50c5b.png",
		name: "Pardner's Pompadour",
		the: true
	},
	30100: {
		defindex: 30100,
		image: "jul13_bushmans_blazer.d88e8bf52f88ec2728f9d7e743cd22d26ea87cbb.png",
		name: "Birdman of Australiacatraz",
		the: true
	},
	30101: {
		defindex: 30101,
		image: "jul13_cameleon.664f6fb98794282007ef6f48adbeea5d3f93f2c8.png",
		name: "Cobber Chameleon",
		the: true
	},
	30103: {
		defindex: 30103,
		image: "jul13_falconer_punch.3fa16563d5188b2cb1d4b60a7c393ef8f40125c7.png",
		name: "Falconer",
		the: true
	},
	30104: {
		defindex: 30104,
		image: "jul13_sweet_shades.9bcd655aad9b76a091cbfddab845625c46dc5f13.png",
		name: "Graybanns"
	},
	30105: {
		defindex: 30105,
		image: "jul13_blam_o_shanter.c05f2c9a1fa59ecbcac8b516c483afaa900ccbfe.png",
		name: "Black Watch",
		the: true
	},
	30106: {
		defindex: 30106,
		image: "jul13_trojan_helmet.fa5db6bf7d0d98aa1a3c02f2f4abc0bfaaa12e84.png",
		name: "Tartan Spartan",
		the: true
	},
	30107: {
		defindex: 30107,
		image: "jul13_scotsmans_golfbag.a45aa65abfa0a2f673be49a570c70ba595255593.png",
		name: "Gaelic Golf Bag",
		the: true
	},
	30108: {
		defindex: 30108,
		image: "jul13_bagdolier.14ac374d28ef94f0a1040d961e43a1acced8c57d.png",
		name: "Borscht Belt",
		the: true
	},
	30109: {
		defindex: 30109,
		image: "jul13_bro_plate.8a906153d33987b144a148c7632b874386139aaa.png",
		name: "Das Naggenvatcher"
	},
	30110: {
		defindex: 30110,
		image: "jul13_gallant_gael.3fb80af0b591d367c4e83acca8e29e8dbe476ac7.png",
		name: "Whiskey Bib",
		the: true
	},
	30112: {
		defindex: 30112,
		image: "jul13_stormn_normn.149ee01f60f7f4f8ac2671e8fe592847705809c4.png",
		name: "Stormin' Norman",
		the: true
	},
	30113: {
		defindex: 30113,
		image: "jul13_king_pants.caa6304b43642a72dc5f7417116b201eb574af6e.png",
		name: "Flared Frontiersman",
		the: true
	},
	30114: {
		defindex: 30114,
		image: "jul13_the_presidential.dfd4fe80b18af07b6183e2c313854b9fef1ba251.png",
		name: "Valley Forge",
		the: true
	},
	30115: {
		defindex: 30115,
		image: "jul13_soldier_eagle.cdb54a40db377bd45db63814f44ff0949d1dc309.png",
		name: "Compatriot",
		the: true
	},
	30116: {
		defindex: 30116,
		image: "jul13_the_caribbean_conqueror.07b18143718b7adf1ef770a26c086dc31f782bf9.png",
		name: "Caribbean Conqueror",
		the: true
	},
	30117: {
		defindex: 30117,
		image: "jul13_colonial_clogs.e1b592899b5c4f4d1cf49442ffd30fedeb9b79b9.png",
		name: "Colonial Clogs",
		the: true
	},
	30118: {
		defindex: 30118,
		image: "jul13_helicopter_helmet.acc8dfe0ef590ce0b9eb868e095413ef49e7ff94.png",
		name: "Whirly Warrior",
		the: true
	},
	30119: {
		defindex: 30119,
		image: "jul13_fedora.60969ba0d45a8060aa5a5ba5df729d9edaeb09f8.png",
		name: "Federal Casemaker",
		the: true
	},
	30120: {
		defindex: 30120,
		image: "jul13_ol_jack.ac4bff6fec7253396cd51bfcc276b577e8b730b2.png",
		name: "Rebel Rouser",
		the: true
	},
	30121: {
		defindex: 30121,
		image: "jul13_madmans_mop.870b215c17c78d25ab1034ad4f84a33976f3b090.png",
		name: "Das Maddendoktor"
	},
	30122: {
		defindex: 30122,
		image: "jul13_bear_necessitys.fd1003f6b6e66c18aa682d0b097bf856a604a217.png",
		name: "Bear Necessities",
		the: true
	},
	30123: {
		defindex: 30123,
		image: "jul13_harmburg.239e41a7e4157c39f879062830bd733f19a9d283.png",
		name: "Harmburg",
		the: true
	},
	30124: {
		defindex: 30124,
		image: "jul13_gaelic_garb.12add8f9a48d773e26215af1092ab86d44f87b27.png",
		name: "Gaelic Garb",
		the: true
	},
	30125: {
		defindex: 30125,
		image: "jul13_rogues_brogues.149c74b0ba9acb41f08ee43c652f7b74aa09b34b.png",
		name: "Rogue's Brogues",
		the: true
	},
	30126: {
		defindex: 30126,
		image: "jul13_shoguns_guard.9d69e22b2ee8d9ac18d4e15650f5a23ace2e49b2.png",
		name: "Shogun's Shoulder Guard",
		the: true
	},
	30127: {
		defindex: 30127,
		image: "jul13_class_act.99d95db149bfbf965dc176ab8bda418434436939.png",
		name: "Das Gutenkutteharen"
	},
	30128: {
		defindex: 30128,
		image: "jul13_double_clue.59e0b6832a8cf2f52d9195fa83c4f8d134ff124d.png",
		name: "Belgian Detective",
		the: true
	},
	30129: {
		defindex: 30129,
		image: "jul13_generals_attire.e66435cd801b4bbc541bc1ceac29773cdba97a40.png",
		name: "Hornblower",
		the: true
	},
	30130: {
		defindex: 30130,
		image: "jul13_lt_bites.4eb1f13954ef1085d084d1ec814238652ed106bb.png",
		name: "Lieutenant Bites"
	},
	30131: {
		defindex: 30131,
		image: "jul13_gangplank_garment.219b5dbb81c67fb2138697f3c58a3798c9246b72.png",
		name: "Brawling Buccaneer",
		the: true
	},
	30132: {
		defindex: 30132,
		image: "jul13_blood_banker.aedab1a2c2b18b266f6d6a1a24749d6dc37bc05c.png",
		name: "Blood Banker",
		the: true
	},
	30133: {
		defindex: 30133,
		image: "jul13_classy_royale.ab04168d8e502465585cd62a33bf9a0bfbf051b2.png",
		name: "After Dark",
		the: true
	},
	30134: {
		defindex: 30134,
		image: "jul13_scout_vestjacket.04b8dbe55841ed8f38f91680d67babe9970acf42.png",
		name: "Delinquent's Down Vest",
		the: true
	},
	30135: {
		defindex: 30135,
		image: "jul13_sniper_souwester.85b19b1e0e1cf7c6f6306c309a8b0b59c61c7d3c.png",
		name: "Wet Works"
	},
	30136: {
		defindex: 30136,
		image: "jul13_montys_menace.6ee55a56ba5ff739d666667d8774322994c80b61.png",
		name: "Baron von Havenaplane"
	},
	30137: {
		defindex: 30137,
		image: "jul13_uncivil_servant.0def76254002d5ac58c02a9e5ffefeec9a5cf438.png",
		name: "Das Fantzipantzen"
	},
	30138: {
		defindex: 30138,
		image: "jul13_border_armor.e99164ade9c2100531201633f7e02626e86233c2.png",
		name: "Bolshevik Biker",
		the: true
	},
	30139: {
		defindex: 30139,
		image: "jul13_pyro_towel.9e9bdc835f0b15e770986153fb5de0bfb8b129ee.png",
		name: "Pampered Pyro",
		the: true
	},
	30140: {
		defindex: 30140,
		image: "jul13_se_headset.343302aca09c79d90a0b966a9d279be01d933465.png",
		name: "Virtual Viewfinder",
		the: true
	},
	30141: {
		defindex: 30141,
		image: "jul13_honchos_heavy_reader.cf2814bb6fc50a3fd01a4b7fec1581536269646a.png",
		name: "Gabe Glasses",
		the: true
	},
	30142: {
		defindex: 30142,
		image: "jul13_dandy_yankee.315173c03ef8072001af717725e487f62192a529.png",
		name: "Founding Father",
		the: true
	},
	30143: {
		defindex: 30143,
		image: "tw_demobot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Demobot Armor"
	},
	30144: {
		defindex: 30144,
		image: "tw_demobot_helmet.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Demobot Helmet"
	},
	30145: {
		defindex: 30145,
		image: "tw_engineerbot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Engineerbot Armor"
	},
	30146: {
		defindex: 30146,
		image: "tw_engineerbot_helmet.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Engineerbot Helmet"
	},
	30147: {
		defindex: 30147,
		image: "tw_heavybot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Heavybot Armor"
	},
	30148: {
		defindex: 30148,
		image: "tw_heavybot_helmet.5e779a6bb436c7172fa45e54950bb26c282dd44c.png",
		name: "Heavybot Helmet"
	},
	30149: {
		defindex: 30149,
		image: "tw_medibot_chariot.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Medicbot Chariot"
	},
	30150: {
		defindex: 30150,
		image: "tw_medibot_hat.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Medicbot Hat"
	},
	30151: {
		defindex: 30151,
		image: "tw_pyrobot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Pyrobot Armor"
	},
	30152: {
		defindex: 30152,
		image: "tw_pyrobot_helmet.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Pyrobot Helmet"
	},
	30153: {
		defindex: 30153,
		image: "tw_scoutbot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Scoutbot Armor"
	},
	30154: {
		defindex: 30154,
		image: "tw_scoutbot_hat.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Scoutbot Hat"
	},
	30155: {
		defindex: 30155,
		image: "tw_sniperbot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Sniperbot Armor"
	},
	30156: {
		defindex: 30156,
		image: "tw_sniperbot_helmet.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Sniperbot Helmet"
	},
	30157: {
		defindex: 30157,
		image: "tw_soldierbot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Soldierbot Armor"
	},
	30158: {
		defindex: 30158,
		image: "tw_soldierbot_helmet.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Soldierbot Helmet"
	},
	30159: {
		defindex: 30159,
		image: "tw_spybot_armor.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Spybot Armor"
	},
	30160: {
		defindex: 30160,
		image: "tw_spybot_hood.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Spybot Hood"
	},
	30161: {
		defindex: 30161,
		image: "tw_sentrybuster.f74e5b197235fb2b777e1c2c86ad4885837202ff.png",
		name: "Sentrybuster"
	},
	30162: {
		defindex: 30162,
		image: "fall2013_air_raider.d954c6b968316c561054b9c88b6592e3b9dcaf88.png",
		name: "Bone Dome",
		the: true
	},
	30163: {
		defindex: 30163,
		image: "fall2013_fire_bird.39e3575611837766cbec11d6a58835b3897139cb.png",
		name: "Air Raider",
		the: true
	},
	30164: {
		defindex: 30164,
		image: "fall2013_the_braided_pride.49ff668af8773fb95973401b8303429e18fee2b8.png",
		name: "Viking Braider",
		the: true
	},
	30165: {
		defindex: 30165,
		image: "fall2013_the_cuban_coverup.6b83e55368ed17b43706d7e42e341af84163e829.png",
		name: "Cuban Bristle Crisis",
		the: true
	},
	30167: {
		defindex: 30167,
		image: "fall2013_beep_boy.b2aa3095284b430b6ba2901e1a3f7b783d585f26.png",
		name: "Beep Boy",
		the: true
	},
	30168: {
		defindex: 30168,
		image: "fall2013_the_special_eyes.daea1d824a841564291c0c45c2f4df5ae9f5b9ed.png",
		name: "Special Eyes",
		the: true
	},
	30169: {
		defindex: 30169,
		image: "fall2013_the_insidious_incinerator.67825428ffe963b7d4982e32b730687d73a80409.png",
		name: "Trickster's Turnout Gear"
	},
	30170: {
		defindex: 30170,
		image: "fall2013_kyoto_rider.58752b93337bdf40d98036b069604fc462886152.png",
		name: "Chronomancer",
		the: true
	},
	30171: {
		defindex: 30171,
		image: "fall2013_aichi_investigator.b8721a0b9cffeeaa7ada6e2cb68fe555acabf417.png",
		name: "Medical Mystery",
		the: true
	},
	30172: {
		defindex: 30172,
		image: "fall2013_the_gold_digger.e6a464cae28da88bb29908d1d57ca3b3ff4238d4.png",
		name: "Gold Digger",
		the: true
	},
	30173: {
		defindex: 30173,
		image: "fall2013_brimfull_of_bullets.9b5ead0e776f8ab66d5119da77241de9ac02fa00.png",
		name: "Brim-Full Of Bullets"
	},
	30175: {
		defindex: 30175,
		image: "fall2013_the_cotton_head.38910f84b946d0afdc1b10a2674aa0a0278d822e.png",
		name: "Cotton Head",
		the: true
	},
	30176: {
		defindex: 30176,
		image: "fall2013_popeyes.1670475e4477a043ec06555f4fff3ab577f499de.png",
		name: "Pop-eyes"
	},
	30177: {
		defindex: 30177,
		image: "fall2013_hong_kong_cone.f1a30e855407bf18b9ad2f308a27bb063a545c85.png",
		name: "Hong Kong Cone"
	},
	30178: {
		defindex: 30178,
		image: "fall2013_weight_room_warmer.d8173b6a496d6ddebb4dbdfe2ad4208ad09f9425.png",
		name: "Weight Room Warmer"
	},
	30179: {
		defindex: 30179,
		image: "fall2013_eod_suit.0268afbca66c186a92175d7dafd352462e382570.png",
		name: "Hurt Locher",
		the: true
	},
	30180: {
		defindex: 30180,
		image: "fall2013_pirate_bandana.0e8436e83807af59239cc84ab314bd53497803a8.png",
		name: "Pirate Bandana"
	},
	30181: {
		defindex: 30181,
		image: "fall2013_lil_snaggletooth.de698908bf4a58cf107afa483a3683f95e835b6c.png",
		name: "Li'l Snaggletooth"
	},
	30182: {
		defindex: 30182,
		image: "fall2013_superthief.ceb8ebe75eb2848abd03ea6b68257a129ea1535d.png",
		name: "L'homme Burglerre"
	},
	30183: {
		defindex: 30183,
		image: "fall2013_escapist.d5bb3cf1469043ff6333b0bf2296ccdedfd5336a.png",
		name: "Escapist"
	},
	30185: {
		defindex: 30185,
		image: "fall2013_neo_tokyo_runner.b3c3f4c29bfdb60bcfc3998e19ab6071c6a9a618.png",
		name: "Flapjack",
		the: true
	},
	30186: {
		defindex: 30186,
		image: "fall2013_medic_wc_beard.8a6c70ef3347a310d05b30ef3e8dc01172a536c3.png",
		name: "A Brush with Death"
	},
	30187: {
		defindex: 30187,
		image: "fall2013_medic_wc_hair.b746ec52eb1b795643b2377af37172288a0f7eb5.png",
		name: "Slick Cut",
		the: true
	},
	30189: {
		defindex: 30189,
		image: "fall2013_fancycoat.653d5830962f7c22cf70dc44dad6e901d57682a1.png",
		name: "Frenchman's Formals",
		the: true
	},
	30190: {
		defindex: 30190,
		image: "fall2013_medic_wc_coat.b2308e76e32db5d74b337cdeb82f6632bb824755.png",
		name: "Ward",
		the: true
	},
	30191: {
		defindex: 30191,
		image: "hw2013_beast_from_below.9f8b705cc1318d48e7a17a0f2b42b6a062ff34f5.png",
		name: "Beast From Below",
		the: true
	},
	30192: {
		defindex: 30192,
		image: "hw2013_hardheaded_hardware.2f42fef36587190510c15d6deb6c0dcb141f430d.png",
		name: "Hard-Headed Hardware"
	},
	30193: {
		defindex: 30193,
		image: "hw2013_octo_face.e67df2e6dae3e440eef1847afbe6c86c3c71dd5a.png",
		name: "Cap'n Calamari"
	},
	30194: {
		defindex: 30194,
		image: "hw2013_space_oddity.4abb6413e7a3fdba78cdf98c6af585b6bd909e5d.png",
		name: "Spectralnaut",
		the: true
	},
	30195: {
		defindex: 30195,
		image: "hw2013_ethereal_hood.9090cf0291b19f1f8f29ba284fa43964ccb76472.png",
		name: "Ethereal Hood"
	},
	30196: {
		defindex: 30196,
		image: "hw2013_maniacs_manacles.47087b7e96ac73342162b9e860c7033d707bb8df.png",
		name: "Maniac's Manacles",
		the: true
	},
	30197: {
		defindex: 30197,
		image: "hw2013_second_opinion.e1fe56edf73fd6a3a42b6b6f4e52602f0fec165d.png",
		name: "Second Opinion",
		the: true
	},
	30198: {
		defindex: 30198,
		image: "hw2013_allclass_horseman.b185ffdb9160003829a2a31a82ef0ecd9f4d8911.png",
		name: "Pocket Horsemann",
		the: true
	},
	30199: {
		defindex: 30199,
		image: "hw2013_last_bite.125a1cbeded43e4d31951f6b39af58faa55efc00.png",
		name: "Last Bite",
		the: true
	},
	30200: {
		defindex: 30200,
		image: "hw2013_scout_demo_faunlegs.4df12ba71e3bba25012703c810150f6aa6030a72.png",
		name: "Baphomet Trotters",
		the: true
	},
	30203: {
		defindex: 30203,
		image: "hw2013_dragon_hood.f4fa922ed8267d3d9dc23df9e44349c9f582a6e1.png",
		name: "Burny's Boney Bonnet"
	},
	30204: {
		defindex: 30204,
		image: "hw2013_golden_crisp_locks.17d288b70c12ae39431c7efeb4ee0514136b5820.png",
		name: "Crispy Golden Locks",
		the: true
	},
	30205: {
		defindex: 30205,
		image: "hw2013_scorched_skirt.6809082d735d834bf11cb917d5605a5b4b93f509.png",
		name: "Scorched Skirt",
		the: true
	},
	30206: {
		defindex: 30206,
		image: "hw2013_wandering_soul.e5d8ba79092eaefdb805c1bd5a41dbf144239c84.png",
		name: "Accursed Apparition",
		the: true
	},
	30207: {
		defindex: 30207,
		image: "hw2013_horrifying_hound_hood.af9ea7fa20979b9711de3e8a533215f08f754ccb.png",
		name: "Hound's Hood",
		the: true
	},
	30208: {
		defindex: 30208,
		image: "hw2013_terrifying_terrier_trousers.f2ff45cc169f276e41d99ca0943a459c6d9abc37.png",
		name: "Terrier Trousers",
		the: true
	},
	30211: {
		defindex: 30211,
		image: "hw2013_bunny_mann.7e91261c3deea8101d97e93e5826a19b43ff012f.png",
		name: "Horrific Head of Hare",
		the: true
	},
	30212: {
		defindex: 30212,
		image: "hw2013_leather_face.55f9795a92b3947161466057946b2cc648b6c94a.png",
		name: "Snaggletoothed Stetson",
		the: true
	},
	30213: {
		defindex: 30213,
		image: "hw2013_per_eye_scopes.aa47bd58f945db00a7dc1b25dd9c9ffd8931acd4.png",
		name: "Up Pyroscopes"
	},
	30214: {
		defindex: 30214,
		image: "hw2013_stiff_buddy.56f5c53acb47a477605f7d5b86d126fb6af3af57.png",
		name: "One-Way Ticket",
		the: true
	},
	30215: {
		defindex: 30215,
		image: "hw2013_tricky_chicken.f1d699cf583c818a28e9f93e74ff7631c4d68cd7.png",
		name: "Birdie Bonnet",
		the: true
	},
	30216: {
		defindex: 30216,
		image: "hw2013_dark_orchestra.a93c4db7547605fdd3f0bd8a1291d7c31fab6053.png",
		name: "External Organ",
		the: true
	},
	30217: {
		defindex: 30217,
		image: "hw2013_ivan_the_inedible.e26ffce3521fedd706ace8df4bd09848f8165a55.png",
		name: "Ivan The Inedible"
	},
	30218: {
		defindex: 30218,
		image: "hw2013_rugged_respirator.fbf11bd172fae15f712a5892190ebaaa15c490c8.png",
		name: "Rugged Respirator",
		the: true
	},
	30219: {
		defindex: 30219,
		image: "hw2013_blackguards_bicorn.3b1abd3bdf0a562ee869a308216ac16467bf7b30.png",
		name: "Squid's Lid",
		the: true
	},
	30220: {
		defindex: 30220,
		image: "hw2013_hollowhead.138ca673c454b612463ae8052bda734d2e5ac1c2.png",
		name: "Hollowhead",
		the: true
	},
	30221: {
		defindex: 30221,
		image: "hw2013_combat_maggots.f4434845b076be4312012cfc1fdf379759137e4d.png",
		name: "Grub Grenades"
	},
	30222: {
		defindex: 30222,
		image: "hw2013_gothic_guise.e7aa77cfd9455f56250e5a10d90e39d82b09d8c6.png",
		name: "Gothic Guise",
		the: true
	},
	30223: {
		defindex: 30223,
		image: "hw2013_grease_monkey.6aa94f1de14c8a3db5576f2cf31fd925092ddbf5.png",
		name: "Grease Monkey",
		the: true
	},
	30224: {
		defindex: 30224,
		image: "hw2013_witching_ward.877bede65c5795b8f6a095c2eb163591a5e88e0b.png",
		name: "Alternative Medicine Mann",
		the: true
	},
	30225: {
		defindex: 30225,
		image: "hw2013_dragonbutt.0286f4f3d706d5e13c01054e7452c09ee8473386.png",
		name: "Cauterizer's Caudal Appendage",
		the: true
	},
	30226: {
		defindex: 30226,
		image: "hw2013_zombie_parrot.83fd7109a33d19f859b85150ac98f4a344e42b7c.png",
		name: "Polly Putrid"
	},
	30227: {
		defindex: 30227,
		image: "hw2013_faux_manchu.02e85a3bb279a2f415eaa2fa1b53f732a11b1d44.png",
		name: "Faux Manchu",
		the: true
	},
	30228: {
		defindex: 30228,
		image: "hw2013_hidden_dragon.a87068d1ec9171b1a88873b7fde73961ebad7e77.png",
		name: "Hidden Dragon",
		the: true
	},
	30229: {
		defindex: 30229,
		image: "hw2013_moon_boots.d88687f070c1e206951b5cb5c7e8c942f8647424.png",
		name: "Lo-Grav Loafers",
		the: true
	},
	30230: {
		defindex: 30230,
		image: "hw2013_spacemans_suit.4c324169f7d1e51291b3ff4e4e75b437ba24a046.png",
		name: "Surgeon's Space Suit",
		the: true
	},
	30231: {
		defindex: 30231,
		image: "hw2013_boston_bandy_mask.8918b61ce96d06d60e8a3dbbd97328f26ca974cf.png",
		name: "Face Plante",
		the: true
	},
	30232: {
		defindex: 30232,
		image: "hw2013_das_blutliebhaber.60099bd39ace77e005b536574ffbb72d1fde69f5.png",
		name: "Das Blutliebhaber"
	},
	30233: {
		defindex: 30233,
		image: "hw2013_quacks_cureall.33291e676c1ce36fda62e37b575365ea668fa882.png",
		name: "Trepanabotomizer",
		the: true
	},
	30234: {
		defindex: 30234,
		image: "hw2013_burlap_buddy.17fbcba841c6fb82a3dd0be61fce7f87331824bb.png",
		name: "Sackcloth Spook",
		the: true
	},
	30235: {
		defindex: 30235,
		image: "hw2013_mucus_membrane.4240af12fdb374d24c3b94fdef7a69cdf18644b7.png",
		name: "Mucous Membrain",
		the: true
	},
	30236: {
		defindex: 30236,
		image: "hw2013_volatile_voodoo.8deb377990538ebde1eae2ef769e73450ab336de.png",
		name: "Pin Pals"
	},
	30237: {
		defindex: 30237,
		image: "hw2013_medicmedes.148a904a1aef5b80cc8f85e3b20c668bf28f17ae.png",
		name: "Medimedes"
	},
	30238: {
		defindex: 30238,
		image: "hw2013_heavy_robin.33ccd1d15265795b6e560a8ed23c101205c53c7e.png",
		name: "Chicken Kiev",
		the: true
	},
	30239: {
		defindex: 30239,
		image: "hw2013_feathered_freedom.3046991caeeca8cf258a9c3c4de0de505d654095.png",
		name: "Freedom Feathers",
		the: true
	},
	30240: {
		defindex: 30240,
		image: "hw2013_demo_executioner_hood.2ebbb68b2c64df2180eda5e32231a4a1cca3c108.png",
		name: "Headtaker's Hood",
		the: true
	},
	30241: {
		defindex: 30241,
		image: "hw2013_demon_fro.647b25e1a536184ac205a0267af40d6848e267f5.png",
		name: "Transylvania Top",
		the: true
	},
	30242: {
		defindex: 30242,
		image: "hw2013_kindlin_candles.10b36cc5a5d8af04fd633a6f3069145738cf0c5c.png",
		name: "Candleer",
		the: true
	},
	30243: {
		defindex: 30243,
		image: "hw2013_demo_cape.59a806e22d8d836fcda8be5c08e5fe41932a2020.png",
		name: "Horsemann's Hand-Me-Down",
		the: true
	},
	30245: {
		defindex: 30245,
		image: "hw2013_the_haha_hairdo.cca7a5519ba46e46d6a9379e9b2b142981fd55c7.png",
		name: "Bozo's Bouffant"
	},
	30247: {
		defindex: 30247,
		image: "hw2013_the_hell_runner.88ff7525953304d35ce3f0a5c397f0bef97ab1d9.png",
		name: "Faun Feet"
	},
	30248: {
		defindex: 30248,
		image: "hw2013_halloweiner.3933e4bbc6807065027d0747bc1c7194b66148d0.png",
		name: "Halloweiner",
		the: true
	},
	30249: {
		defindex: 30249,
		image: "hw2013_the_ghoulic_extension.7c6e7881245d04b675520f789e27b64bcc9b9bba.png",
		name: "Lordly Lapels",
		the: true
	},
	30251: {
		defindex: 30251,
		image: "hw2013_soldier_jiangshi_hat.3ec0cb3a0b1b8b57aa79e37690524556afe957cd.png",
		name: "Cadaver's Capper",
		the: true
	},
	30252: {
		defindex: 30252,
		image: "hw2013_the_fire_bat_v2.74a418e341b303d0ff1ac5784a0439dada7c905e.png",
		name: "Guano"
	},
	30253: {
		defindex: 30253,
		image: "hw2013_running_octopus.db0857b1dc0d179d7b4ba05563fdb2ecedc88052.png",
		name: "Sprinting Cephalopod",
		the: true
	},
	30254: {
		defindex: 30254,
		image: "hw2013_intergalactic_intruder.3ae37e35c1bf12b6e7a2a3a1a79fb2f0a21445b8.png",
		name: "Unidentified Following Object"
	},
	30255: {
		defindex: 30255,
		image: "hw2013_the_enlightening_lantern.352fc43432b63927a4dcd16eaa0973c147fb7cae.png",
		name: "Beacon from Beyond",
		the: true
	},
	30256: {
		defindex: 30256,
		image: "hw2013_brain__bowler.30f14e36c9efd450e275d809edb2a342c10e7de7.png",
		name: "Hyperbaric Bowler",
		the: true
	},
	30257: {
		defindex: 30257,
		image: "hw2013_tin_can.b873b61452432a57c50d22113f7f653ee87bf91a.png",
		name: "Death Support Pack",
		the: true
	},
	30258: {
		defindex: 30258,
		image: "hw2013_zombie_chameleon.090f5cc7584238c053aad48e6c980868ee8eaa5c.png",
		name: "Carious Chameleon",
		the: true
	},
	30259: {
		defindex: 30259,
		image: "hw2013_dragon_shoes.58573fa15afd7600b226794558ee6e59d6aa691b.png",
		name: "Monster's Stompers",
		the: true
	},
	30260: {
		defindex: 30260,
		image: "hw2013_blood_banker.0d03d899287b4122e5be8587b936805a7bd66eee.png",
		name: "Bountiful Bow",
		the: true
	},
	30261: {
		defindex: 30261,
		image: "hw2013_harmburg.3833216e86bce207059e83c71917e416af20f660.png",
		name: "Candyman's Cap",
		the: true
	},
	30263: {
		defindex: 30263,
		image: "hw2013_medic_undertaker_vest.2696d90f7f91650d4c9cf39f0170973649f553a4.png",
		name: "Vicar's Vestments",
		the: true
	},
	30264: {
		defindex: 30264,
		image: "hw2013_rocket_ranger.6ad202b5320f6b3120dece2b8f2f6dd3f31a07d8.png",
		name: "Hardium Helm",
		the: true
	},
	30265: {
		defindex: 30265,
		image: "hw2013_jupiter_jumpers.831f5d698321edae516c4e6456f9ef3aa4e965bd.png",
		name: "Jupiter Jumpers",
		the: true
	},
	30266: {
		defindex: 30266,
		image: "hw2013_galactic_gauntlets.42e85162b55610682ac74584a2db51d896474dab.png",
		name: "Space Bracers",
		the: true
	},
	30267: {
		defindex: 30267,
		image: "hw2013_handhunter.a61689abbd807471e950aaedc3b92407211235a5.png",
		name: "Handhunter",
		the: true
	},
	30268: {
		defindex: 30268,
		image: "hw2013_the_crit_wizard.02b268f756472b8f8507e2cb6d5ef82218201bba.png",
		name: "Spellbinder's Bonnet",
		the: true
	},
	30269: {
		defindex: 30269,
		image: "hw2013_the_creeps_cowl.5776b86f90f5a68d280a63572abe61322dd090c9.png",
		name: "Macabre Mask",
		the: true
	},
	30270: {
		defindex: 30270,
		image: "hw2013_shamans_skull.92ead3081f5aeafeb5f79ec4dde9dc8edabe67df.png",
		name: "Shaman's Skull",
		the: true
	},
	30273: {
		defindex: 30273,
		image: "hw2013_head_of_the_lake_monster.de49e7737b42f7f2e3073643e52f87698677f173.png",
		name: "Vicious Visage",
		the: true
	},
	30274: {
		defindex: 30274,
		image: "hw2013_pumpkin_top.2e17e6518e6ce442d3d2cf21fa1c1fccfcdb0c2e.png",
		name: "Tuque or Treat",
		the: true
	},
	30275: {
		defindex: 30275,
		image: "hw2013_horned_honcho.c92b8552c52001892ce72b05c63a3c59215c0f57.png",
		name: "Horned Honcho",
		the: true
	},
	30276: {
		defindex: 30276,
		image: "hw2013_zombites.67e254b62cc19a8349d077cf7be9c17cae70612e.png",
		name: "Lieutenant Bites the Dust"
	},
	30277: {
		defindex: 30277,
		image: "hw2013_gristly_gumbo_pot.5809ad855e0aa296fb1429366d90178fad26c7d4.png",
		name: "Grisly Gumbo",
		the: true
	},
	30278: {
		defindex: 30278,
		image: "hw2013_the_dark_helm.04c7e17f2b8dd645e5964e522acc05b8e02113da.png",
		name: "Dark Helm",
		the: true
	},
	30279: {
		defindex: 30279,
		image: "hw2013_zombie_archimedes.2e4bdff3a45de4cfcbd5e966d895ff86ccde8d36.png",
		name: "Archimedes the Undying"
	},
	30280: {
		defindex: 30280,
		image: "hw2013_orcish_outburst.afc97624f172af910e2a84a72a9e0c1901edb615.png",
		name: "Monstrous Mandible",
		the: true
	},
	30281: {
		defindex: 30281,
		image: "hw2013_shaolin_sash.24db1a4a24f010563b141012caa3d83cca966322.png",
		name: "Shaolin Sash",
		the: true
	},
	30282: {
		defindex: 30282,
		image: "hw2013_manbird_of_aberdeen.61f8fc5d80cf993afaca097c8e0ceb62f9f67b0e.png",
		name: "Mann-Bird of Aberdeen",
		the: true
	},
	30283: {
		defindex: 30283,
		image: "hw2013_foul_cowl.1ec6c01e7064b18d2bac2f98b24458679d3e9d0b.png",
		name: "Foul Cowl",
		the: true
	},
	30284: {
		defindex: 30284,
		image: "hw2013_sir_shootsalot.36506a2db9b4cea88915f22d5218c5deb3c2b1f4.png",
		name: "Sir Shootsalot"
	},
	30285: {
		defindex: 30285,
		image: "hw2013_corpsemopolitan.1df330d057cc4fdf6351bb90bfb30b49c0487d62.png",
		name: "Corpsemopolitan",
		the: true
	},
	30286: {
		defindex: 30286,
		image: "hw2013_the_glob.159c7cb6c243f98e07d45acf14f6c88a717136bc.png",
		name: "Glob",
		the: true
	},
	30287: {
		defindex: 30287,
		image: "hw2013_the_halloween_headcase.2ea4c4a7a9bb9ceb09cbc8897e173387b3d7e211.png",
		name: "Hallowed Headcase",
		the: true
	},
	30288: {
		defindex: 30288,
		image: "hw2013_carrion_cohort.df8739314aa7d2d5e6caa54681fa801f0340b302.png",
		name: "Carrion Companion"
	},
	30289: {
		defindex: 30289,
		image: "hw2013_the_caws_of_death.41be0b350831325f0a39c4ba12269a014264ce58.png",
		name: "Quoth"
	},
	30290: {
		defindex: 30290,
		image: "hw2013_py40_automaton.8ec0d6033cc1e92dac4d997d058ff32f4f9a811b.png",
		name: "PY-40 Incinibot"
	},
	30292: {
		defindex: 30292,
		image: "hw2013_the_parasight.d7f91a2ab8ae7ef79546d800c3ed4133ae2b8a95.png",
		name: "Parasight",
		the: true
	},
	30293: {
		defindex: 30293,
		image: "hw2013_teutonkahmun.4e5514b3ef4e6baf280289a34c26200250183425.png",
		name: "Teutonkahmun"
	},
	30294: {
		defindex: 30294,
		image: "hw2013_mr_maggot.1161059c873b5bca9187e124bf3d2225b150f09f.png",
		name: "Larval Lid",
		the: true
	},
	30295: {
		defindex: 30295,
		image: "hw2013_the_manneater.5e04f8a253aed366b5f894b2574eb1e9d74ce421.png",
		name: "Manneater",
		the: true
	},
	30296: {
		defindex: 30296,
		image: "hw2013_the_creature_from_the_heap.3cce9715916e395d68efe6eb7a2375a8266f8518.png",
		name: "Creature From The Heap",
		the: true
	},
	30297: {
		defindex: 30297,
		image: "hw2013_the_magical_mercenary.7ec84a9013dacb35abfdb223bf34f2b2c0657615.png",
		name: "Magical Mercenary",
		the: true
	},
	30298: {
		defindex: 30298,
		image: "hw2013_visage_of_the_crow.2d0e4c73578f71551644eee3bb901b274930159b.png",
		name: "Raven's Visage",
		the: true
	},
	30299: {
		defindex: 30299,
		image: "hw2013_ramses_regalia.fe61e0a64d1e7b2b08c361e0f349b8af92e1bc51.png",
		name: "Ramses' Regalia"
	},
	30300: {
		defindex: 30300,
		image: "hw2013_the_haunted_hat.9e0f39e225c5e18ef394ee6ab92e178ea258e461.png",
		name: "Haunted Hat",
		the: true
	},
	30301: {
		defindex: 30301,
		image: "hw2013_rogues_brogues.42fb46761392c2b9a1ab31ed847c520d1abf244a.png",
		name: "Bozo's Brogues"
	},
	30302: {
		defindex: 30302,
		image: "hw2013_all_skull_necklace.0b77e5f0b6e5aed72d3b601083132836b528ef3c.png",
		name: "Cryptic Keepsake",
		the: true
	},
	30303: {
		defindex: 30303,
		image: "hw2013_the_abhorrent_appendages.d0974a194fdd7913f7251bb8fd012f571b03851e.png",
		name: "Abhorrent Appendages",
		the: true
	},
	30304: {
		defindex: 30304,
		image: "xms2013_pyro_arctic_mask.7f68f33c960ff54b0b8d070ecadb3d3198985dc7.png",
		name: "Blizzard Breather",
		the: true
	},
	30305: {
		defindex: 30305,
		image: "xms2013_arctic_suit.5c83569ea7f7e2782b4c91b5a9cad07786329b6d.png",
		name: "Sub Zero Suit",
		the: true
	},
	30306: {
		defindex: 30306,
		image: "xms2013_soviet_stache.679633978b7dacd7d2e0d4353c9585b5d904be00.png",
		name: "Dictator",
		the: true
	},
	30307: {
		defindex: 30307,
		image: "xms2013_winter_hat_scarf.78517c57260ae5fa46b2162502dc9581f3f9aa53.png",
		name: "Neckwear Headwear"
	},
	30308: {
		defindex: 30308,
		image: "xms2013_pyro_sled.a64f6e8056fe08621caa982aa01db3fbe5294b46.png",
		name: "Trail-Blazer",
		the: true
	},
	30309: {
		defindex: 30309,
		image: "xms2013_jacket.b2f539fc5dac0a30c8f11b5139ce374542cb618d.png",
		name: "Dead of Night"
	},
	30310: {
		defindex: 30310,
		image: "xms2013_sniper_jacket.fb15299d15cd7b3ec1cddab910e3f9a482b44e50.png",
		name: "Snow Scoper",
		the: true
	},
	30311: {
		defindex: 30311,
		image: "xms2013_medic_hood.32dd99a3087a079ce1d433f28dc79c2cb0694333.png",
		name: "Nunhood",
		the: true
	},
	30312: {
		defindex: 30312,
		image: "xms2013_medic_robe.8979c63d0de3b0e32a0fbab48ad02f957c208097.png",
		name: "Angel of Death",
		the: true
	},
	30313: {
		defindex: 30313,
		image: "xms2013_kissking.a481289840e4184a6ad1155eb851531e3f8a02e8.png",
		name: "Kiss King",
		the: true
	},
	30314: {
		defindex: 30314,
		image: "xms2013_soldier_marshal_hat.395f6e8790aa22a7271b8d872b4361b13d1a3b2e.png",
		name: "Slo-Poke",
		the: true
	},
	30315: {
		defindex: 30315,
		image: "xms2013_heavy_slick_hair.e2b8c5e73e432c42ecfdd3d9db49647289ac8a4d.png",
		name: "Minnesota Slick"
	},
	30316: {
		defindex: 30316,
		image: "xms2013_sniper_shako.3b4bb23923374d035563a6d5cf7e7ae7945b7c02.png",
		name: "Toy Soldier",
		the: true
	},
	30317: {
		defindex: 30317,
		image: "xms2013_sniper_beard.ad63c4cd572b597d96ff60e92d0d090ff85f390e.png",
		name: "Five-Month Shadow",
		the: true
	},
	30318: {
		defindex: 30318,
		image: "xms2013_medic_knecht_hat.132b788443bff988c1b6e5902e72eb9e35a49278.png",
		name: "Mann of Reason",
		the: true
	},
	30319: {
		defindex: 30319,
		image: "xms2013_heavy_pants.1f78e9173f3d587d3d470be20b46711fe1971c25.png",
		name: "Mann of the House",
		the: true
	},
	30320: {
		defindex: 30320,
		image: "xms2013_scout_squirrel.f4c62d45fa6c9591ea00eb984470923964cfc030.png",
		name: "Chucklenuts"
	},
	30321: {
		defindex: 30321,
		image: "xms2013_pyro_wood.c66f4937942776c13186a4f574874b88eb7a66dc.png",
		name: "Tiny Timber"
	},
	30322: {
		defindex: 30322,
		image: "xms2013_festive_beard.15daa1988e719cdaf9ef1c72cd7f490ed4d17f7b.png",
		name: "Face Full of Festive"
	},
	30323: {
		defindex: 30323,
		image: "xms2013_ruffled_beard.0082097763ec4a8531855b53767c8aa92f127cf5.png",
		name: "Ruffled Ruprecht",
		the: true
	},
	30324: {
		defindex: 30324,
		image: "xms2013_sniper_golden_garment.10a795541e5b9faa2a601ad23d6777d2079e126b.png",
		name: "Golden Garment",
		the: true
	},
	30325: {
		defindex: 30325,
		image: "xms2013_scout_drummer_shirt.6e36cc2343ddf31ed70dc9d01d35544003dad682.png",
		name: "Little Drummer Mann",
		the: true
	},
	30326: {
		defindex: 30326,
		image: "xms2013_scout_drummer_hat.e3ed0ff594a1f921f4d12c585548b75b06789104.png",
		name: "Scout Shako",
		the: true
	},
	30327: {
		defindex: 30327,
		image: "xms2013_pyro_tailor_hat.0bcf9a4ec2187d15e3222540deb7081e875c6e2f.png",
		name: "Toy Tailor",
		the: true
	},
	30328: {
		defindex: 30328,
		image: "xms2013_sniper_layer_vest.2712aacaac8162c5e5de4871c1640036ba7ee358.png",
		name: "Extra Layer",
		the: true
	},
	30329: {
		defindex: 30329,
		image: "xms2013_polar_pullover.90241c42a0f76e3819b96371823aeabf01cb9894.png",
		name: "Polar Pullover",
		the: true
	},
	30330: {
		defindex: 30330,
		image: "xms2013_dogfighter_jacket.c1033c479b8bfabf9e7c7f6c5a79b2885764133c.png",
		name: "Dogfighter",
		the: true
	},
	30331: {
		defindex: 30331,
		image: "xms2013_soldier_parka.bdf727828878f1cb7dac86b875ba9c70c36065b0.png",
		name: "Antarctic Parka"
	},
	30332: {
		defindex: 30332,
		image: "xms2013_scout_skicap.0b6f0c0b79d2b1334771174e9f31b3ee740acdb2.png",
		name: "Runner's Warm-Up"
	},
	30333: {
		defindex: 30333,
		image: "xms2013_demo_plaid_boots.3d34192f38fbbff61dd975c6a490fe21b0963878.png",
		name: "Highland High Heels"
	},
	30334: {
		defindex: 30334,
		image: "xms2013_demo_plaid_hat.152c6db9806406bd10fd82bd518de3c89ccb6fad.png",
		name: "Tartan Tyrolean"
	},
	30335: {
		defindex: 30335,
		image: "xms2013_soldier_marshal_beard.b841648bbccb9cfa108c490fd8b75a7d39e34574.png",
		name: "Marshall's Mutton Chops"
	},
	30336: {
		defindex: 30336,
		image: "sbox2014_trenchers_topper.60eac3e68a08967ee8903fa347fbc886d24df2ce.png",
		name: "Trencher's Topper",
		the: true
	},
	30337: {
		defindex: 30337,
		image: "sbox2014_trenchers_tunic.e4fa46c83b4c744a2bc16c1f0530b54b360dfbf0.png",
		name: "Trencher's Tunic",
		the: true
	},
	30338: {
		defindex: 30338,
		image: "sbox2014_soldier_major.ffe323206ef2c10bb1d9859bbfd8c7c1e0b51468.png",
		name: "Ground Control"
	},
	30339: {
		defindex: 30339,
		image: "sbox2014_killers_kit.1a2d9c27da46145701c83633dd35d588558dd542.png",
		name: "Killer's Kit",
		the: true
	},
	30340: {
		defindex: 30340,
		image: "sbox2014_stylish_degroot.c3cbe1fcf5945bf68acd6a86b751e55c494f1b3a.png",
		name: "Stylish DeGroot"
	},
	30341: {
		defindex: 30341,
		image: "sbox2014_einstein.bad87843db84583609c099c6ebdc55af6b25cce0.png",
		name: "Ein"
	},
	30342: {
		defindex: 30342,
		image: "sbox2014_heavy_gunshow.04286c12460a8638965cc62b6b6a3d9138c7032d.png",
		name: "Heavy Lifter",
		the: true
	},
	30343: {
		defindex: 30343,
		image: "sbox2014_heavy_camopants.99e89f4c7a9ff5d5c54021daf6e4030b351fb058.png",
		name: "Gone Commando"
	},
	30344: {
		defindex: 30344,
		image: "sbox2014_heavy_buzzcut.e8576b0afc833bcf187289e2e771276e1dbf81dc.png",
		name: "Bullet Buzz"
	},
	30345: {
		defindex: 30345,
		image: "sbox2014_leftover_trap.2597a721255f713aa9d101bb7a9a5806d02f73a2.png",
		name: "Leftover Trap",
		the: true
	},
	30346: {
		defindex: 30346,
		image: "sbox2014_trash_man.a828657ac4c491d2099d2eb4b9f86d1433736136.png",
		name: "Trash Man",
		the: true
	},
	30347: {
		defindex: 30347,
		image: "sbox2014_scotch_saver.2b3ce660a2b41ca5dad36b0ba5b9a2cd23de388b.png",
		name: "Scotch Saver",
		the: true
	},
	30348: {
		defindex: 30348,
		image: "sbox2014_demo_samurai_armour.b1ac760a13df29b074144444669dbaa20638bba6.png",
		name: "Bushi-Dou"
	},
	30349: {
		defindex: 30349,
		image: "sbox2014_fashionable_megalomaniac.6c2d4d5563daa1fc9c5b7325bcf22283d698acf8.png",
		name: "Fashionable Megalomaniac",
		the: true
	},
	30350: {
		defindex: 30350,
		image: "sbox2014_chefs_coat.239206b7c45d9b3f138c45c56b084e7198cb5d79.png",
		name: "Dough Puncher",
		the: true
	},
	30351: {
		defindex: 30351,
		image: "sbox2014_teutonic_toque.323822268fb1905791ed41d26151b8f16c878260.png",
		name: "Teutonic Toque",
		the: true
	},
	30352: {
		defindex: 30352,
		image: "sbox2014_mustachioed_mann.b38b6f32b0b97af79b9ee4a9cb92dc6586c55cdb.png",
		name: "Mustachioed Mann",
		the: true
	},
	30353: {
		defindex: 30353,
		image: "sbox2014_spy_snake.72d5e81ae78661af8a65d600b0e1c12ca3c0ff85.png",
		name: "Backstabber's Boomslang",
		the: true
	},
	30354: {
		defindex: 30354,
		image: "sbox2014_rat_stompers.72b258ca37a7d591efb261ce101e71b896b83427.png",
		name: "Rat Stompers",
		the: true
	},
	30355: {
		defindex: 30355,
		image: "sbox2014_sole_mate.5d6f417c9807caca552b2d523c0523bf98471af1.png",
		name: "Sole Mate"
	},
	30356: {
		defindex: 30356,
		image: "sbxo2014_medic_wintergarb_coat.776b2b99dbdf39ad3c451b4502ae9b379c8e6c76.png",
		name: "Heat of Winter",
		the: true
	},
	30357: {
		defindex: 30357,
		image: "sbox2014_knight_helmet.09604d4a8a32164ce266e8c894a0fe846393acb1.png",
		name: "Dark Falkirk Helm",
		the: true
	},
	30358: {
		defindex: 30358,
		image: "sbox2014_armor_shoes.6e28f6eab8914007b79562c229c3439a8c2454b5.png",
		name: "Sole Saviors",
		the: true
	},
	30359: {
		defindex: 30359,
		image: "sbox2014_sniper_quiver.4eaf1d1ed5d105fd2a4a956c4a8b193d43539119.png",
		name: "Huntsman's Essentials",
		the: true
	},
	30360: {
		defindex: 30360,
		image: "sbox2014_napolean_complex.0feba0bf1ac65bdc580172c8fe0ec1b4c42d0c53.png",
		name: "Napoleon Complex",
		the: true
	},
	30361: {
		defindex: 30361,
		image: "sbox2014_medic_colonel_coat.6d242188906388eff0d6ce67bbb49ab28634f552.png",
		name: "Colonel's Coat",
		the: true
	},
	30362: {
		defindex: 30362,
		image: "sbox2014_law.ab6acbc2a1c832512951ef0432d04f459828354b.png",
		name: "Law",
		the: true
	},
	30363: {
		defindex: 30363,
		image: "sbox2014_juggernaut_jacket.15badb00803a120d3aeef55b62fc8a7e12e11262.png",
		name: "Juggernaut Jacket",
		the: true
	},
	30364: {
		defindex: 30364,
		image: "sbox2014_warmth_preserver.6503372ab5479fccb00e79cf01ef3305be74372a.png",
		name: "Warmth Preserver",
		the: true
	},
	30365: {
		defindex: 30365,
		image: "sbox2014_medic_apron.72e1b665aa1a209c857501335c4c11b8719fb369.png",
		name: "Smock Surgeon",
		the: true
	},
	30366: {
		defindex: 30366,
		image: "sbox2014_demo_samurai_sleeves.6128900378fa1993a21c31749d7e36477732d0dc.png",
		name: "Sangu Sleeves",
		the: true
	},
	30367: {
		defindex: 30367,
		image: "sbox2014_zipper_suit.c4b46478850613a54cdb24b15c30a3b453748e1c.png",
		name: "Cute Suit",
		the: true
	},
	30368: {
		defindex: 30368,
		image: "sbox2014_war_goggles.53c0ed105535c6e35f64fea7767286da807e19c1.png",
		name: "War Goggles",
		the: true
	},
	30369: {
		defindex: 30369,
		image: "sbox2014_war_helmet.568b097bb7db410bc3842e331f6fb87ab5e65004.png",
		name: "Eliminators Safeguard",
		the: true
	},
	30371: {
		defindex: 30371,
		image: "sbox2014_archers_groundings.35bb952ab43b0f4b7df68be3ca7f067147ce2a91.png",
		name: "Archers Groundings",
		the: true
	},
	30372: {
		defindex: 30372,
		image: "sbox2014_war_pants.eed460a6b02af20db7597f71c4b5353d914ad555.png",
		name: "Combat Slacks"
	},
	30373: {
		defindex: 30373,
		image: "sbox2014_toowoomba_tunic.c260b55a780912684708eaebc703fea2ece9fc71.png",
		name: "Toowoomba Tunic",
		the: true
	},
	30374: {
		defindex: 30374,
		image: "sbox2014_sammy_cap.30642cbe56f6cb853f414ea436fa2836d250c94f.png",
		name: "Sammy Cap",
		the: true
	},
	30375: {
		defindex: 30375,
		image: "sbox2014_camo_headband.5c92c91390b05977b2d1f40ebef943776b470d9b.png",
		name: "Deep Cover Operator",
		the: true
	},
	30376: {
		defindex: 30376,
		image: "sbox2014_ticket_boy.fc2adb99e3a09e754d3c30c4a3ef8fd463976883.png",
		name: "Ticket Boy",
		the: true
	},
	30377: {
		defindex: 30377,
		image: "sbox2014_antarctic_researcher.d543c55de30eb89c495644937f44b8e49f909a86.png",
		name: "Antarctic Researcher",
		the: true
	},
	30378: {
		defindex: 30378,
		image: "sbox2014_medic_wintergarb_helmet.916428df0ab6d31efe181632c3dc1e60252b449b.png",
		name: "Heer's Helmet"
	},
	30379: {
		defindex: 30379,
		image: "sbox2014_medic_wintergarb_gaiter.026a1a179e23079604bb25adecc6ccf61f133840.png",
		name: "Gaiter Guards",
		the: true
	},
	30388: {
		defindex: 30388,
		image: "short2014_soldier_fed_coat.34a9a5f81826304eb5de59aae1b484adf1bc29ae.png",
		name: "Classified Coif",
		the: true
	},
	30389: {
		defindex: 30389,
		image: "short2014_invisible_ishikawa.3070e0e94d78b250129fd2159076dce4fb6c5fb0.png",
		name: "Rogue's Robe",
		the: true
	},
	30390: {
		defindex: 30390,
		image: "short2014_soldier_fedhair.cb47e2156447d7415f5a75d7f6eabbd82521691b.png",
		name: "Spook Specs",
		the: true
	},
	30391: {
		defindex: 30391,
		image: "short2014_sengoku_scorcher.14e5785eddf4f29c2e6f82b0444251e6e7ad9097.png",
		name: "Sengoku Scorcher",
		the: true
	},
	30392: {
		defindex: 30392,
		image: "short2014_man_in_slacks.269c7c2b7799e346a6f5f193ef2c04649c759dfa.png",
		name: "Man in Slacks",
		the: true
	},
	30393: {
		defindex: 30393,
		image: "short2014_demo_mohawk.c5a8b667e7ff24eae046e456080b80378748cb9f.png",
		name: "Razor Cut",
		the: true
	},
	30394: {
		defindex: 30394,
		image: "short2014_scout_ninja_mask.5957602a15f67719b50f4d4528cbeeda82a1f627.png",
		name: "Frickin' Sweet Ninja Hood",
		the: true
	},
	30395: {
		defindex: 30395,
		image: "short2014_minja_vest.8e95b5f1733ee132375b405429300d1cf68f4211.png",
		name: "Southie Shinobi",
		the: true
	},
	30396: {
		defindex: 30396,
		image: "short2014_ninja_boots.d8d5aaf54811a7434b84067574275ba62c4b2a5c.png",
		name: "Red Socks",
		the: true
	},
	30397: {
		defindex: 30397,
		image: "short2014_all_mercs_mask.389409ebe8c6b31d225b9c2e8957f8cd579e80d4.png",
		name: "Bruiser's Bandanna",
		the: true
	},
	30398: {
		defindex: 30398,
		image: "short2014_the_gas_guzzler.199ba0f4509577ef7ff2e0bee5f008ecd26a6835.png",
		name: "Gas Guzzler",
		the: true
	},
	30399: {
		defindex: 30399,
		image: "short2014_spiked_armourgeddon.1550803d039843f6c2a71e7a7b615e59240a8209.png",
		name: "Smoking Skid Lid",
		the: true
	},
	30400: {
		defindex: 30400,
		image: "short2014_wildfire_wrappers.14542e3948f2b648533f736870a93e09770c7b41.png",
		name: "Lunatic's Leathers",
		the: true
	},
	30401: {
		defindex: 30401,
		image: "short2014_heavy_goatee.2721d00d695ec8af945efd6266cb1f59fe6d88bd.png",
		name: "Yuri's Revenge"
	},
	30402: {
		defindex: 30402,
		image: "short2014_engie_toolbelt.d7fbce2b489276f65e3ae991366a279db0875b96.png",
		name: "Tools of the Trade",
		the: true
	},
	30403: {
		defindex: 30403,
		image: "short2014_poopyj_backpack.1024ddb602c0ea3426db0c1b6d06c9e31c946b19.png",
		name: "Joe-on-the-Go",
		the: true
	},
	30404: {
		defindex: 30404,
		image: "short2014_deadhead.7f6a2e8fbe14dd04ea01448dbfb3f8ed191b43f5.png",
		name: "Aviator Assassin",
		the: true
	},
	30405: {
		defindex: 30405,
		image: "short2014_confidence_trickster.3fdc4a5f536239d7c5e7042c6ad5f154f89ccf5f.png",
		name: "Sky Captain",
		the: true
	},
	30406: {
		defindex: 30406,
		image: "short2014_engineer_nerd_hair.a3ac37c3d2b99c43f6f862d532e579547b139f1b.png",
		name: "Peacenik's Ponytail",
		the: true
	},
	30407: {
		defindex: 30407,
		image: "short2014_engineer_nerd_chin.1c618d01768342eca11399f126b3235c876d865b.png",
		name: "Level Three Chin",
		the: true
	},
	30408: {
		defindex: 30408,
		image: "short2014_engineer_nerd_shirt.acf9aeb8d2c8f5df7a8ff93f8ea485d79d3b75f1.png",
		name: "Egghead's Overalls",
		the: true
	},
	30409: {
		defindex: 30409,
		image: "short2014_engineer_nerd_feet.3ed7cb5ceaf4777363893acfc242795d07b9ff7f.png",
		name: "Lonesome Loafers",
		the: true
	},
	30410: {
		defindex: 30410,
		image: "short2014_medic_nietzsche.e4e0dbadcc4ba332599d06325c803fb40b3d7eea.png",
		name: "Ze \xDCbermensch"
	},
	30411: {
		defindex: 30411,
		image: "short2014_spy_ascot_vest.8ede74e9e6a6471c97d98ba33a35ef66980d7876.png",
		name: "Au Courant Assassin",
		the: true
	},
	30412: {
		defindex: 30412,
		image: "short2014_endothermic_exowear.ca7f797107256993088fcd516557da0cf5d6e59d.png",
		name: "Endothermic Exowear"
	},
	30413: {
		defindex: 30413,
		image: "short2014_lil_moe.806a5c4f37bc4b9bffb58d589e303e13dcdfb905.png",
		name: "Merc's Mohawk",
		the: true
	},
	30414: {
		defindex: 30414,
		image: "short2014_all_eyepatch.87f1c9f0eb784530b63853d65b5dfa121d9eedfb.png",
		name: "Eye-Catcher",
		the: true
	},
	30415: {
		defindex: 30415,
		image: "short2014_medic_messenger_bag.8f9324041e6ce3d33b727f570b886e4953bb077b.png",
		name: "Medicine Manpurse",
		the: true
	},
	30416: {
		defindex: 30416,
		image: "short2014_pyro_chickenhat.f92d96e98afaca4bb63514f35c532f119cd3e75d.png",
		name: "Employee of the Mmmph"
	},
	30417: {
		defindex: 30417,
		image: "short2014_fowl_fryer.8180f092faf3c106e7982a30ac59d5315f959742.png",
		name: "Frymaster",
		the: true
	},
	30418: {
		defindex: 30418,
		image: "short2014_honnoji_helm.d259229bf8a6a2706e705be257b0287f79b687ac.png",
		name: "Combustible Kabuto",
		the: true
	},
	30419: {
		defindex: 30419,
		image: "short2014_chronoscarf.700a2c15b049cc0e3a6ea742ced4b3ad2e419449.png",
		name: "Chronoscarf",
		the: true
	},
	30420: {
		defindex: 30420,
		image: "short2014_chemists_pride.8747db018b57329144edea64baea4d90a120f839.png",
		name: "Danger",
		the: true
	},
	30421: {
		defindex: 30421,
		image: "short2014_badlands_wanderer.6e47b0510654c87ca507207a2335cfcec2c2016e.png",
		name: "Frontier Djustice",
		the: true
	},
	30422: {
		defindex: 30422,
		image: "short2014_vintage_director.4068b17dab4456aebc9229bc96e534096a0bab26.png",
		name: "Vive La France"
	},
	30423: {
		defindex: 30423,
		image: "short2014_scopers_smoke.77b483374095085b9c7f2025a65ad9cdbb36894b.png",
		name: "Scoper's Smoke",
		the: true
	},
	30424: {
		defindex: 30424,
		image: "short2014_sniper_cargo_pants.f707dd8d14e0ded5567051461f1ba9948279ac8a.png",
		name: "Triggerman's Tacticals",
		the: true
	},
	30425: {
		defindex: 30425,
		image: "short2014_tip_of_the_hats.ede596f56f169c91c327c8e756e7e6996b4bb530.png",
		name: "Tipped Lid"
	},
	30426: {
		defindex: 30426,
		image: "scout_fancy_shirt.f42f38cbb86e40cfd7f32c49631944b4f767631d.png",
		name: "Paisley Pro",
		the: true
	},
	30427: {
		defindex: 30427,
		image: "scout_brogues.1e2025e10d336cd38be9732042cc0436a28b7f89.png",
		name: "Argyle Ace",
		the: true
	},
	30428: {
		defindex: 30428,
		image: "scout_pompadour.24b9f065b9dd19ff539fbd22d3bdef29878475a9.png",
		name: "Pomade Prince",
		the: true
	},
	30429: {
		defindex: 30429,
		image: "demo_fiesta_sombrero.81cad7a10d2a55aadff924f77b0d0969f81a2b3e.png",
		name: "Allbrero",
		the: true
	},
	30430: {
		defindex: 30430,
		image: "demo_fiesta_shades.d0d777090496b0231e619032d8e57611fe87863e.png",
		name: "Seeing Double"
	},
	30431: {
		defindex: 30431,
		image: "demo_fiesta_bottles.a576eac1c18c0f9b0f53df9f3a2e577913a853de.png",
		name: "Six Pack Abs"
	},
	30469: {
		defindex: 30469,
		image: "horace.8838f4efe1905507ba54c4bf63de3618b1334687.png",
		name: "Horace"
	},
	30470: {
		defindex: 30470,
		image: "ai_body.73ebde0154c74b02e8e5263d4c9b833e251ce2b0.png",
		name: "Biomech Backpack",
		the: true
	},
	30471: {
		defindex: 30471,
		image: "ai_head.382c621bdabf82042c6c7b6d6794d6913475fb44.png",
		name: "Alien Cranium",
		the: true
	},
	30472: {
		defindex: 30472,
		image: "ai_legs.2160e2e55b8af7df6e97aaa570be1d6bbde0cdba.png",
		name: "Xeno Suit",
		the: true
	},
	30473: {
		defindex: 30473,
		image: "ai_spacehelmet.19c0074fb7557f01ee0a446b85f9cda145fd529b.png",
		name: "MK 50",
		the: true
	},
	30474: {
		defindex: 30474,
		image: "c_ai_flamethrower.2c57cf2fa2548c04baeb0611ff0e6c448a679a69.png",
		name: "Nostromo Napalmer",
		the: true
	},
	30475: {
		defindex: 30475,
		image: "sept2014_pyro_radioactive_mask.713758577341d31217af0adb6b919277220f1bd9.png",
		name: "Mishap Mercenary",
		the: true
	},
	30476: {
		defindex: 30476,
		image: "sept2014_lady_killer.05a5b1932f96a6ec76eb403baa0adb29cebb085d.png",
		name: "Lady Killer",
		the: true
	},
	30477: {
		defindex: 30477,
		image: "sept2014_lone_survivor.b0cd6060ca56dbbd70b3fe5cee0f031ced4b4b67.png",
		name: "Lone Survivor",
		the: true
	},
	30478: {
		defindex: 30478,
		image: "sept2014_poachers_safari_jacket.efecafd49113b99906258f163aea13168b1481d6.png",
		name: "Poacher's Safari Jacket"
	},
	30479: {
		defindex: 30479,
		image: "sept2014_thirst_blood.89868602c43bef69402ecb791989787b4c12ffc5.png",
		name: "Thirst Blood"
	},
	30480: {
		defindex: 30480,
		image: "sept2014_mann_of_the_seven_sees.a39c38c763cb9a4f75b881f82929f433df909ac1.png",
		name: "Mann of the Seven Sees"
	},
	30481: {
		defindex: 30481,
		image: "sept2014_hillbilly_speedbump.740c11469031a55ddb463dfdceea0e700cf5aa9d.png",
		name: "Hillbilly Speed-Bump"
	},
	30482: {
		defindex: 30482,
		image: "sept2014_unshaved_bear.6e4bac79cf8afbca432b48ced9771301d84499ef.png",
		name: "Unshaved Bear",
		the: true
	},
	30483: {
		defindex: 30483,
		image: "sept2014_pocket_heavy.697d267a879e17b8cf482e049637f81710e5e9ca.png",
		name: "Pocket Heavy"
	},
	30484: {
		defindex: 30484,
		image: "nobody_suspects_a_thing.daeefa777747b15b727437e13de27ec88dbfa58c.png",
		name: "Dadliest Catch",
		the: true
	},
	30486: {
		defindex: 30486,
		image: "sf14_medic_herzensbrecher.629754a9872a76182bec6235df5a8a51b13c535a.png",
		name: "Herzensbrecher",
		the: true
	},
	30487: {
		defindex: 30487,
		image: "sf14_medic_hundkopf.526fdee3955a28fbf3ccdf71c28667bf7c7a3078.png",
		name: "Hundkopf",
		the: true
	},
	30488: {
		defindex: 30488,
		image: "sf14_medic_kriegsmaschine_9000.1c9733c91a3577b515b1303e727d8093732a960f.png",
		name: "Kriegsmaschine-9000",
		the: true
	},
	30489: {
		defindex: 30489,
		image: "sf14_vampire_makeover.57cfdade4dea85b064d596a2768547bcf0d1354e.png",
		name: "Vampire Makeover",
		the: true
	},
	30490: {
		defindex: 30490,
		image: "sf14_vampiric_vesture.2b54a4bcbb477777d92ed1c8e376c21a979009cd.png",
		name: "Vampiric Vesture",
		the: true
	},
	30491: {
		defindex: 30491,
		image: "sf14_nugget_noggin.dceb9a335871cc960ea8d2a987d991ab35a8ad7f.png",
		name: "Nugget Noggin",
		the: true
	},
	30492: {
		defindex: 30492,
		image: "sf14_fowl_fists.693c6dcbe40910a819bc012eae20d79045d62493.png",
		name: "Fowl Fists",
		the: true
	},
	30493: {
		defindex: 30493,
		image: "sf14_talon_trotters.5b0f01dc8372f301081eb29520ba7cae1acb9d86.png",
		name: "Talon Trotters",
		the: true
	},
	30494: {
		defindex: 30494,
		image: "sf14_scout_hunter_head.701676b5b5167abdd6f9c5829fe8100d17365350.png",
		name: "Head Hunter",
		the: true
	},
	30495: {
		defindex: 30495,
		image: "sf14_scout_hunter_arm.31651b578c6247820a01eb501e19ad385d770702.png",
		name: "Claws And Infect",
		the: true
	},
	30496: {
		defindex: 30496,
		image: "sf14_scout_hunter_legs.6cca8c9ef98ae197497edab83ec4e92e0f64cee1.png",
		name: "Crazy Legs",
		the: true
	},
	30497: {
		defindex: 30497,
		image: "sf14_ghost_of_spies_checked_past.d6ebee917b8d4f703df7301c66e1081bdbc7bb22.png",
		name: "Ghost of Spies Checked Past",
		the: true
	},
	30498: {
		defindex: 30498,
		image: "sf14_hooded_haunter_classes.25851a07f2ddd496210f050f2df7376bbd2671b0.png",
		name: "Hooded Haunter",
		the: true
	},
	30499: {
		defindex: 30499,
		image: "sf14_conspiratorial_cut.a6ac5c3c68c37ccd9544143b21ddd294f41bd057.png",
		name: "Cranial Conspiracy",
		the: true
	},
	30500: {
		defindex: 30500,
		image: "sf14_skinless_slashers.e4cc1f1b52a22332559387d4e828d3fdfdd2747a.png",
		name: "Scaly Scrapers",
		the: true
	},
	30501: {
		defindex: 30501,
		image: "sf14_marsupial_man.71f8420eff43bb28773d7cbc3e664543c6870ad8.png",
		name: "Marsupial Man",
		the: true
	},
	30502: {
		defindex: 30502,
		image: "sf14_kanga_kickers.b720fe12d2b61e8ce08714b3d6c38fede9986c39.png",
		name: "Kanga Kickers",
		the: true
	},
	30503: {
		defindex: 30503,
		image: "sf14_roo_rippers.be33be145a325954e0fa94a89cdea17b0a78b2b1.png",
		name: "Roo Rippers",
		the: true
	},
	30504: {
		defindex: 30504,
		image: "sf14_marsupial_muzzle.fc3178a684c9c977981fd3af9f74d54a2046dab9.png",
		name: "Marsupial Muzzle",
		the: true
	},
	30505: {
		defindex: 30505,
		image: "sf14_hw2014_spy_voodoo_hat.c1a29f167e10905f88d95876a425ed0ab33fe4b1.png",
		name: "Shadowman's Shade"
	},
	30506: {
		defindex: 30506,
		image: "sf14_nightmare_fedora.fa2c67a406cabb3540e349d6f02e295df871f826.png",
		name: "Nightmare Hunter",
		the: true
	},
	30507: {
		defindex: 30507,
		image: "sf14_the_rogues_rabbit.25317761354e6aac8837de8a6c669a4092970939.png",
		name: "Rogue's Rabbit",
		the: true
	},
	30508: {
		defindex: 30508,
		image: "sf14_iron_fist.ffe2516168df1a5f8eac7699ac70f5bd45264be2.png",
		name: "Iron Fist",
		the: true
	},
	30509: {
		defindex: 30509,
		image: "sf14_beep_man.a6a6661fcd824e10d747de5bcf9dd9cf3ddd2812.png",
		name: "Beep Man",
		the: true
	},
	30510: {
		defindex: 30510,
		image: "sf14__soul_of_spensers_past.ba2fec45a75f55ca7625318cbcc08f359e6735c1.png",
		name: "Soul of 'Spensers Past",
		the: true
	},
	30511: {
		defindex: 30511,
		image: "sf14_tiny_texan.7ae1b44b2041982c20d92b526befad6eec20484d.png",
		name: "Tiny Texan",
		the: true
	},
	30512: {
		defindex: 30512,
		image: "sf14_spy_facepeeler.a0573e9874af57d4a01d41ee3f95c4056c8b6cec.png",
		name: "Facepeeler",
		the: true
	},
	30513: {
		defindex: 30513,
		image: "sf14_sniper_ostrich_legs.c879e2f5ea6233f2168b8a8627896979e6d6bbb2.png",
		name: "Mr. Mundee's Wild Ride"
	},
	30514: {
		defindex: 30514,
		image: "sf14_templar_hood.c3d63e818b9dbccff08f8ea62fb4b69f0c12fb10.png",
		name: "Templar's Spirit",
		the: true
	},
	30515: {
		defindex: 30515,
		image: "sf14_purity_wings.5b9c8f28f68fafe3c9a236a456669f45974a1756.png",
		name: "Wings of Purity",
		the: true
	},
	30516: {
		defindex: 30516,
		image: "sf14_deadking_head.cc966f571ecb60acdf79933527e06fd1f92d1f40.png",
		name: "Forgotten King's Restless Head",
		the: true
	},
	30517: {
		defindex: 30517,
		image: "sf14_deadking_pauldrons.fdb25861729b2643eefc4f37168077cafed7e040.png",
		name: "Forgotten King's Pauldrons",
		the: true
	},
	30518: {
		defindex: 30518,
		image: "sf14_demo_cyborg.acf48ac8e596c09056bdd834cd58840d4bb434a3.png",
		name: "Eyeborg",
		the: true
	},
	30519: {
		defindex: 30519,
		image: "sf14_explosive_mind.cdb804793f872c368af5e12b3b31be239066e1cb.png",
		name: "Mannhattan Project",
		the: true
	},
	30520: {
		defindex: 30520,
		image: "sf14_ghoul_gibbing_gear.db0e06a45654937c8929cc13c20a6175b9835f0b.png",
		name: "Ghoul Gibbin' Gear",
		the: true
	},
	30521: {
		defindex: 30521,
		image: "sf14_hellhunters_headpiece.4b2c69ac5ca9d98aa2e67d0a22dc3c526b6577fb.png",
		name: "Hellhunter's Headpiece",
		the: true
	},
	30522: {
		defindex: 30522,
		image: "sf14_the_supernatural_stalker.138ff3d9ff7d1e83c4c996b33fc79d6ea676fca4.png",
		name: "Supernatural Stalker",
		the: true
	},
	30523: {
		defindex: 30523,
		image: "sf14_hw2014_engi_gnome_beard.45e89310d22541a9b221dbab925fa6bc2b54379d.png",
		name: "Garden Bristles",
		the: true
	},
	30524: {
		defindex: 30524,
		image: "sf14_the_battle_bird.9032b0b8955af4cb42a2563fbddd5ac79117ffaf.png",
		name: "Battle Bird",
		the: true
	},
	30525: {
		defindex: 30525,
		image: "sf14_the_creatures_grin.a1ec2209b260dc6b868b8e73fd5345edc9fb7129.png",
		name: "Creature's Grin",
		the: true
	},
	30526: {
		defindex: 30526,
		image: "sf14_hw2014_robot_arm.6ec299214b787c85ddc70c3d27a814b9df99ad13.png",
		name: "Arsonist Apparatus",
		the: true
	},
	30527: {
		defindex: 30527,
		image: "sf14_hw2014_robot_legg.2c85ba64958e30627e4ab57dc77bf93bd4c9b961.png",
		name: "Moccasin Machinery",
		the: true
	},
	30528: {
		defindex: 30528,
		image: "sf14_lollichop_licker.63f89ee860a2b60a41299f37f259ecf44cea018e.png",
		name: "Lollichop Licker",
		the: true
	},
	30529: {
		defindex: 30529,
		image: "sf14_mr_juice.6491f5391ce6c7842da871e3509eaed09c17b138.png",
		name: "Mr. Juice"
	},
	30530: {
		defindex: 30530,
		image: "sf14_vampyro.c481c2d0285407b0fddb19348368f3453f500c9d.png",
		name: "Vampyro",
		the: true
	},
	30531: {
		defindex: 30531,
		image: "sf14_halloween_bone_cut_belt.736e3dcd26e085f85ec6286d5104047a7bd665ff.png",
		name: "Bone-Cut Belt",
		the: true
	},
	30532: {
		defindex: 30532,
		image: "sf14_halloween_bull_locks.184415abf6cc72e53dbca7004d8dbd3027a01e5b.png",
		name: "Bull Locks",
		the: true
	},
	30533: {
		defindex: 30533,
		image: "sf14_halloween_minsk_beef.1e75d66dc95916b794a84f57517734c5ea3e9c76.png",
		name: "Minsk Beef",
		the: true
	},
	30534: {
		defindex: 30534,
		image: "sf14_heavy_robo_chest.fed298ae9b3b636fffe448428797cb788b5cd80f.png",
		name: "Immobile Suit",
		the: true
	},
	30535: {
		defindex: 30535,
		image: "kritz_or_treat_canteen.802b6c0b8cb4176a37506f10dd5d5228b562fb75.png",
		name: "Kritz or Treat Canteen",
		the: true
	},
	30536: {
		defindex: 30536,
		image: "sf14_cursed_cruise.91e90bf9e5b853bf9d17be151e934d923416eb07.png",
		name: "Li'l Dutchman",
		the: true
	},
	30538: {
		defindex: 30538,
		image: "skier.0a021d6fa9b9662cad4a47747c811c108af13a24.png",
		name: "Wartime Warmth"
	},
	30539: {
		defindex: 30539,
		image: "insulated_innovator.dc343d680a2e24f7cf087147aed03f55aa4ae898.png",
		name: "Insulated Inventor"
	},
	30540: {
		defindex: 30540,
		image: "blinks_breeches.e4aa753082fea9362dd8faae2f24f4af6afb77bc.png",
		name: "Brooklyn Booties"
	},
	30541: {
		defindex: 30541,
		image: "demo_dynamite.a5a3de0f6bb756415c03f80a6a04d8a77d28f5dc.png",
		name: "Double Dynamite"
	},
	30542: {
		defindex: 30542,
		image: "briskweather_beanie.c8e0e1198a67f8c17f2e5f35710fa5598d3c252b.png",
		name: "Coldsnap Cap"
	},
	30543: {
		defindex: 30543,
		image: "eotl_winter_pants.c23d4a9a717e145ffe78f3d4be646f9839882a53.png",
		name: "Snow Stompers"
	},
	30544: {
		defindex: 30544,
		image: "pyro_sweater.6c320ea6defd3e42888428b1cc030519ef783d11.png",
		name: "North Polar Fleece"
	},
	30545: {
		defindex: 30545,
		image: "eotl_flat_cap.9e8112775a32db931a4fa9d5be2398b036bfce32.png",
		name: "Fur-lined Fighter"
	},
	30546: {
		defindex: 30546,
		image: "eotl_furcap.300737344940ce242b5eb8cb5422a46b26aaf719.png",
		name: "Boxcar Bomber"
	},
	30547: {
		defindex: 30547,
		image: "eotl_summerhat.9d51d1cbecf209ef130201a813e1e3a7ebe0f1f6.png",
		name: "Bomber's Bucket Hat"
	},
	30548: {
		defindex: 30548,
		image: "soldier_garrison.cdd5d911ed447412dea2a80df87e266e56d4a8bb.png",
		name: "Screamin' Eagle"
	},
	30549: {
		defindex: 30549,
		image: "hiphunter_hat.347da15f4ace5f2e4124045fc6935a65dad5c558.png",
		name: "Winter Woodsman"
	},
	30550: {
		defindex: 30550,
		image: "hiphunter_jacket.cbd774e5ca999c140d10e8a65db333b90e55cb65.png",
		name: "Snow Sleeves"
	},
	30551: {
		defindex: 30551,
		image: "hiphunter_boots.1cf9ec59913db8391ca1a5e26c70f1e648146c3a.png",
		name: "Flashdance Footies"
	},
	30552: {
		defindex: 30552,
		image: "thermal_sleeves.e97d426d58a95aeceb067486829e154f664da9a9.png",
		name: "Thermal Tracker"
	},
	30553: {
		defindex: 30553,
		image: "eotl_soldierhat.f378b8c79853aa73507e2775008dab6d15b46f8b.png",
		name: "Condor Cap"
	},
	30554: {
		defindex: 30554,
		image: "beard.bbe81b12b4c86738127763f2ea8ac2c6450618f3.png",
		name: "Mistaken Movember"
	},
	30555: {
		defindex: 30555,
		image: "eotl_demopants.43545868442739280d2eda4d3e3579f4afc844f3.png",
		name: "Double Dog Dare Demo Pants"
	},
	30556: {
		defindex: 30556,
		image: "ursa_major.e002c3e8cf5dd8c79550238fa48e28afcdef0f11.png",
		name: "Sleeveless in Siberia"
	},
	30557: {
		defindex: 30557,
		image: "eotl_sheavyshirt.70f0c0782e4a6cf48013e83c1ade62a945c0ec89.png",
		name: "Hunter Heavy"
	},
	30558: {
		defindex: 30558,
		image: "coldfront_curbstompers.cad1465be237c8701ca794215a91acc62d41215e.png",
		name: "Coldfront Curbstompers"
	},
	30559: {
		defindex: 30559,
		image: "eotl_medal.800cd73ea929527f09b1d850afd3fc0f12f2261d.png",
		name: "End of the Line Community Update Medal"
	},
	30561: {
		defindex: 30561,
		image: "tr_bootenkhamuns.a09122f5927c0f9cb1def2f00f1b3917ebd8d949.png",
		name: "Bootenkhamuns",
		the: true
	},
	30563: {
		defindex: 30563,
		image: "tr_jungle_booty.4f283462136d5bf857d558a22b558d7bdd53ce11.png",
		name: "Jungle Booty"
	},
	30564: {
		defindex: 30564,
		image: "tr_orions_belt.6dad1a358399afe94dfccb3320803d5ce901ac69.png",
		name: "Orion's Belt"
	},
	30567: {
		defindex: 30567,
		image: "tr_crown_of_the_old_kingdom.7b1e2a7f97fe6306dda8ada4ccd8bf830f966d01.png",
		name: "Crown of the Old Kingdom",
		the: true
	},
	30569: {
		defindex: 30569,
		image: "tomb_readers.c1c93a0f39be4ad90b858c893d0112bda216c060.png",
		name: "Tomb Readers",
		the: true
	},
	30570: {
		defindex: 30570,
		image: "all_eotl_taunt.80cbf63164317afdef208e12922a85d57aeeb156.png",
		name: "Taunt: Pool Party"
	},
	30571: {
		defindex: 30571,
		image: "brimstone_hat.51d7ffb5f13f6d5a8030d368534a8ff344b3f13b.png",
		name: "Brimstone"
	},
	30572: {
		defindex: 30572,
		image: "taunt_the_boston_breakdance.a740945718518cddcde141910a850f38604ab738.png",
		name: "Taunt: The Boston Breakdance"
	},
	30573: {
		defindex: 30573,
		image: "dec2014_marauders_mask.691f8f9219c2ed12e72d314741d3de1c2d29b4a6.png",
		name: "Mountebank's Masque"
	},
	30574: {
		defindex: 30574,
		image: "dec2014_truands_tunic.e3b5e7c8c221437eae983840efd991c7d1d3eef1.png",
		name: "Courtier's Collar"
	},
	30575: {
		defindex: 30575,
		image: "dec2014_fools_footwear.190df26bd42b8c52570411e1b6638b53a60263da.png",
		name: "Harlequin's Hooves"
	},
	30576: {
		defindex: 30576,
		image: "dec2014_copilot_2014.6e2187aa2b4ec68a4f7890cb535ba3c9bf821cd8.png",
		name: "Co-Pilot"
	},
	30578: {
		defindex: 30578,
		image: "dec2014_skullcap.f6cab65eb1e119863332fca3ef68cc91af179cb5.png",
		name: "Skullcap"
	},
	30580: {
		defindex: 30580,
		image: "dec2014_2014_pyromancer_hood.af0dbd95a44bab5a8940ee6f51fc37b1359c6504.png",
		name: "Pyromancer's Hood"
	},
	30581: {
		defindex: 30581,
		image: "dec2014_pyromancers_raiments.e88e0b5ef69a20e36d6b5c09b3ea256d5970ea9d.png",
		name: "Pyromancer's Raiments"
	},
	30582: {
		defindex: 30582,
		image: "dec2014_black_knights_bascinet.a3d6123e078a7b7cd03d45e179400244e3409e5b.png",
		name: "Black Knight's Bascinet"
	},
	30583: {
		defindex: 30583,
		image: "dec2014_torchers_tabard.1e2c167e8e03b51d1fdb8b2eaecf31d8ab57592c.png",
		name: "Torcher's Tabard"
	},
	30584: {
		defindex: 30584,
		image: "dec2014_armoured_appendages.40963016b3f0bb46434b4bebe63c6449dcc3b8cf.png",
		name: "Charred Chainmail"
	},
	30586: {
		defindex: 30586,
		image: "dec2014_viking_helmet.82e4011fe82f529d1c39a833aae13f3f368c0253.png",
		name: "Valhalla Helm"
	},
	30587: {
		defindex: 30587,
		image: "dec2014_viking_boots.992a96e77944b7a7d22a7eed34b99c4104805d87.png",
		name: "Storm Stompers"
	},
	30588: {
		defindex: 30588,
		image: "dec2014_heavy_parka.5af3f702b3f10a1cd0a861f79147075367f6d18f.png",
		name: "Siberian Facehugger"
	},
	30589: {
		defindex: 30589,
		image: "dec2014_the_big_papa.de3dfc31f81e5381a1304cc343d3cc6d9f714afd.png",
		name: "Old Man Frost"
	},
	30590: {
		defindex: 30590,
		image: "dec2014_engineer_detectiveholster.5583cf0b5e6e1acb17092278b11cd77c83468432.png",
		name: "Holstered Heaters"
	},
	30591: {
		defindex: 30591,
		image: "dec2014_engineer_detectiveradio.cde18d0e0c85b2b5611ea7ad86619a15046d2e31.png",
		name: "Cop Caller"
	},
	30592: {
		defindex: 30592,
		image: "dec2014_engineer_detectiveglasses.7240d8a5881fd9a8a0bf0824e1b4df559976a72b.png",
		name: "Conagher's Combover"
	},
	30593: {
		defindex: 30593,
		image: "dec2014_engineer_seal.8c106146bf10a8afd6ef75c438f4d5f795566165.png",
		name: "Clubsy The Seal"
	},
	30595: {
		defindex: 30595,
		image: "dec2014_medic_unknown_mann.bf0bee62ece8226bb3d3b8cc39a2b34543153f70.png",
		name: "Unknown Mann"
	},
	30596: {
		defindex: 30596,
		image: "dec2014_surgeons_shako.c721681e47842e5d95781a7b78db58c0582f5afa.png",
		name: "Surgeon's Shako"
	},
	30597: {
		defindex: 30597,
		image: "dec2014_hunter_beard.adcfc34a47e3cb944a2b17012a4b2dddff43155c.png",
		name: "Bushman's Bristles"
	},
	30598: {
		defindex: 30598,
		image: "dec2014_hunter_ushanka.55e9ddb87df5d2622fc8852e5cdf0c6b38e3c5a3.png",
		name: "Professional's Ushanka"
	},
	30599: {
		defindex: 30599,
		image: "dec2014_hunter_vest.bb26a7c6c4cdf304fee2c788e7c27b70071bcfc9.png",
		name: "Marksman's Mohair"
	},
	30600: {
		defindex: 30600,
		image: "dec2014_wally_pocket.d92bd753a2a5adba4888984f4478a300a26b6cb9.png",
		name: "Wally Pocket"
	},
	30601: {
		defindex: 30601,
		image: "eotl_winter_coat.128bffad01c45c5a79771dfce924cfbc56b05fb6.png",
		name: "Cold Snap Coat"
	},
	30602: {
		defindex: 30602,
		image: "dec2014_the_puffy_provocateur.a63fe8181235be4e060525709e8e5ccc3c71b5c8.png",
		name: "Puffy Provocateur"
	},
	30603: {
		defindex: 30603,
		image: "dec2014_stealthy_scarf.824ee46125fad524ee870b2d85d11399a327222e.png",
		name: "Stealthy Scarf"
	},
	30604: {
		defindex: 30604,
		image: "dec2014_comforter.be9e0c5f1c47c0df00a68e1f2da894a06d4fe338.png",
		name: "Scot Bonnet"
	},
	30605: {
		defindex: 30605,
		image: "dec2014_thermal_insulation_layer.4c9092d6c95fda9887ebe44a90dbecf921ca3227.png",
		name: "Thermal Insulation Layer"
	},
	30606: {
		defindex: 30606,
		image: "dec2014_pocket_momma.9e28ea1156764040a86fbc58b37817470e7bb0f0.png",
		name: "Pocket Momma"
	},
	30607: {
		defindex: 30607,
		image: "pocket_raiders.263890b8102e6665f279ffbc07e56b06e6ecc916.png",
		name: "Pocket Raiders",
		the: true
	},
	30609: {
		defindex: 30609,
		image: "taunt_killer_solo.8318cd61ba9b223caace2ee0cf2b9135158ddc4f.png",
		name: "Taunt: The Killer Solo"
	},
	30614: {
		defindex: 30614,
		image: "taunt_most_wanted.008acda50db54a3aa2f85cd6ea4d97f6b37597a2.png",
		name: "Taunt: Most Wanted"
	},
	30615: {
		defindex: 30615,
		image: "taunt_spy_boxtrot.0721bd121dc62f873c31ce9ae77378e23392c182.png",
		name: "Taunt: The Box Trot"
	},
	30616: {
		defindex: 30616,
		image: "taunt_soviet_showoff.b626a1f03b3d659699487b8f1dfb49369999ccab.png",
		name: "Taunt: The Proletariat Posedown"
	},
	30618: {
		defindex: 30618,
		image: "bucking_bronco.dfa703b7bc191ac5832090fead3765c3417c4654.png",
		name: "Taunt: Bucking Bronco"
	},
	30621: {
		defindex: 30621,
		image: "taunt_burstchester.f6b9f64e2d000e843a220570e980184b77f32d84.png",
		name: "Taunt: Burstchester",
		grade: 2
	},
	30623: {
		defindex: 30623,
		image: "cc_summer2015_the_rotation_sensation.797f13ad026de3b5c065412d847494a812c0be4d.png",
		name: "Rotation Sensation",
		the: true
	},
	30625: {
		defindex: 30625,
		image: "cc_summer2015_the_physicians_protector.0031b11148c1f6efb47dc75db9c9bfc16f661c51.png",
		name: "Physician's Protector",
		the: true
	},
	30626: {
		defindex: 30626,
		image: "cc_summer2015_the_vascular_vestment.62719a46d4b184d1660eba306ce74f0971015c01.png",
		name: "Vascular Vestment",
		the: true
	},
	30627: {
		defindex: 30627,
		image: "cc_summer2015_bruces_bonnet.a83cffbf6edd42fa60253d80ee55bee97c70d96f.png",
		name: "Bruce's Bonnet"
	},
	30628: {
		defindex: 30628,
		image: "cc_summer2015_outta_sight.074dd7a1f54a4009421978b4e9f2b562c9cac9cc.png",
		name: "Outta' Sight"
	},
	30629: {
		defindex: 30629,
		image: "cc_summer2015_support_spurs.75f0872ef9f13adc36918b108d752a63dc42f3a7.png",
		name: "Support Spurs"
	},
	30631: {
		defindex: 30631,
		image: "cc_summer2015_lurkers_leathers.bea9dbf4c079cf33921ac97c06281514836d409b.png",
		name: "Lurker's Leathers"
	},
	30633: {
		defindex: 30633,
		image: "cc_summer2015_commissars_coat.f37518bb9bb249a4e1345fe58a45f8f1a53b14a1.png",
		name: "Commissar's Coat"
	},
	30634: {
		defindex: 30634,
		image: "cc_summer2015_sheriffs_stetson.56208c424ba3b89ecd6a9099e3ac436c213c9ae0.png",
		name: "Sheriff's Stetson"
	},
	30635: {
		defindex: 30635,
		image: "cc_summer2015_wild_west_waistcoat.f97d10a68918c842a561d30fffc92f784e0f6a95.png",
		name: "Wild West Waistcoat"
	},
	30636: {
		defindex: 30636,
		image: "cc_summer2015_fortunate_son.4d454c88c23aa2a368d915101bd019914e93cc6d.png",
		name: "Fortunate Son"
	},
	30637: {
		defindex: 30637,
		image: "cc_summer2015_flak_jack.9ec86858c3bdec9df948547036b3812e5c6697ad.png",
		name: "Flak Jack"
	},
	30640: {
		defindex: 30640,
		image: "cc_summer2015_captain_cardbeard_cutthroat.f0f28ff2df7a7be3e797cda9fc3eaec1f71df459.png",
		name: "Captain Cardbeard Cutthroat"
	},
	30643: {
		defindex: 30643,
		image: "cc_summer2015_potassium_bonnett.3849871e2fe2b96fb41209de62defa59b136f038.png",
		name: "Potassium Bonnett"
	},
	30644: {
		defindex: 30644,
		image: "cc_summer2015_white_russian.a3d67900e4eb7d40729a168ceb958fa0387ebbc0.png",
		name: "White Russian"
	},
	30645: {
		defindex: 30645,
		image: "cc_summer2015_el_duderino.a820e4f732e0da4001c6d3ffe553473a7906603d.png",
		name: "El Duderino"
	},
	30646: {
		defindex: 30646,
		image: "invasion_captain_space_mann.0a166edbbc1c04bcec87cc030ecf510dd06f9a43.png",
		name: "Captain Space Mann",
		grade: 3
	},
	30647: {
		defindex: 30647,
		image: "invasion_phononaut.7be26beecbefe3c2967f092e7c3c1b2259158af2.png",
		name: "Phononaut",
		grade: 3
	},
	30648: {
		defindex: 30648,
		image: "invasion_corona_australis.0ffdb504afdbc582102dda56453bebb99daaec6c.png",
		name: "Corona Australis",
		grade: 1
	},
	30649: {
		defindex: 30649,
		image: "invasion_final_frontiersman.be49c1f8615253e42da4faf6c1a975a675cf9c86.png",
		name: "Final Frontiersman",
		grade: 4
	},
	30650: {
		defindex: 30650,
		image: "invasion_starduster.1dee2d330376ddcfbfa636d048d4e3f37dfd7416.png",
		name: "Starduster",
		grade: 2
	},
	30651: {
		defindex: 30651,
		image: "invasion_the_graylien.0228f9a775dac06cfb4c93845bd32afa8ae73fa1.png",
		name: "Graylien",
		the: true,
		grade: 4
	},
	30652: {
		defindex: 30652,
		image: "invasion_phobos_filter.e236a6d08fb654c26c563194908a11a023e0033d.png",
		name: "Phobos Filter",
		grade: 4
	},
	30653: {
		defindex: 30653,
		image: "invasion_sucker_slug.d0229d8615112e2a7ea1cbad9c1a784dd8f136ee.png",
		name: "Sucker Slug",
		grade: 1
	},
	30654: {
		defindex: 30654,
		image: "invasion_life_support_system.760847316f135755e22575be59fa60df0336ad83.png",
		name: "Life Support System",
		grade: 4
	},
	30655: {
		defindex: 30655,
		image: "invasion_rocket_operator.8b3a13e57bcc0ccac63421d1edcef624987c8702.png",
		name: "Rocket Operator",
		grade: 3
	},
	30658: {
		defindex: 30658,
		image: "invasion_universal_translator.128f75c20f7f587175fe8b1ee4f555c790a44559.png",
		name: "Universal Translator",
		grade: 4
	},
	30661: {
		defindex: 30661,
		image: "invasion_cadet_visor.b94a870453f3b1834c452c12256cd983f90963ee.png",
		name: "Cadet Visor",
		grade: 4
	},
	30662: {
		defindex: 30662,
		image: "invasion_a_head_full_of_hot_air.51ec0c31a9252fe8c3cb3f80b521dc3c8154d07e.png",
		name: "A Head Full of Hot Air",
		grade: 4
	},
	30663: {
		defindex: 30663,
		image: "invasion_jupiter_jetpack.feeb01c4c11b1f6ad1dc92ac0249fbd5ffb8dbd0.png",
		name: "Jupiter Jetpack",
		grade: 3
	},
	30664: {
		defindex: 30664,
		image: "invasion_the_space_diver.9931db1345be7eb1d1ed5dd8046191a8c6fae9ee.png",
		name: "Space Diver",
		the: true
	},
	30665: {
		defindex: 30665,
		image: "c_invasion_sniperrifle.6f318b9c6e9e71e89180742aa7514a61a3fbdb34.png",
		name: "Shooting Star",
		the: true,
		grade: 3
	},
	30666: {
		defindex: 30666,
		image: "c_invasion_pistol.772bbaaaff2b8cc82eacf844372477c8de599d22.png",
		name: "C.A.P.P.E.R",
		the: true,
		grade: 3
	},
	30667: {
		defindex: 30667,
		image: "c_invasion_bat.777ea2014cd9abe07e9d7b03d1ddb8eaebc0e189.png",
		name: "Batsaber",
		grade: 1
	},
	30668: {
		defindex: 30668,
		image: "c_invasion_wrangler.8dd45ea760e66d79f8c7d6652470bcffc278677a.png",
		name: "Giger Counter",
		the: true,
		grade: 2
	},
	30669: {
		defindex: 30669,
		image: "invasion_space_hamster_hammy.ff00a5765a3723a15e5e1e285488d5ade4ecf0d4.png",
		name: "Space Hamster Hammy",
		grade: 2
	},
	30671: {
		defindex: 30671,
		image: "true_scotsmans_call.3da543fee0b710b731a331371dbe4777c47158a9.png",
		name: "Taunt: Bad Pipes"
	},
	30672: {
		defindex: 30672,
		image: "zoomin_broom.041adf3593dc3fd6c5f0845ffb739a93f3c6fc80.png",
		name: "Taunt: Zoomin' Broom"
	},
	30673: {
		defindex: 30673,
		image: "taunt_maggots_condolence.a15aa2bdf7f395090fc75e4fc404c18b53fc6622.png",
		name: "Taunt: Soldier's Requiem"
	},
	30675: {
		defindex: 30675,
		image: "hwn2015_roboot.644b1354bb78f36e362ac39a70bd138478e188d7.png",
		name: "Roboot",
		grade: 4
	},
	30676: {
		defindex: 30676,
		image: "hwn2015_face_of_mercy.fc0bdfc6156afaac0a28c8d56faefd2220681a4b.png",
		name: "Face of Mercy",
		the: true,
		grade: 4
	},
	30680: {
		defindex: 30680,
		image: "hwn2015_western_poncho.ac53952072c63a8d6c614994be8d7600e9b180f0.png",
		name: "El Caballero",
		grade: 3
	},
	30681: {
		defindex: 30681,
		image: "hwn2015_western_beard.e25317fd9852579cf6db51903ae755d32b97828c.png",
		name: "El Patron",
		grade: 4
	},
	30682: {
		defindex: 30682,
		image: "hwn2015_western_hat.e69c7e985550f6bb19c9d920f32597afb6743e4e.png",
		name: "Smokey Sombrero",
		grade: 4
	},
	30684: {
		defindex: 30684,
		image: "hwn2015_neptunes_nightmare.3f0a9b7c9e81e9cb2e29d1dc3788bdc3f44c29ff.png",
		name: "Neptune's Nightmare",
		grade: 3
	},
	30685: {
		defindex: 30685,
		image: "hwn2015_death_racer_jacket.9e0f5a47722a7a357d544f9b0d8fbcfbf562b816.png",
		name: "Thrilling Tracksuit",
		grade: 4
	},
	30686: {
		defindex: 30686,
		image: "hwn2015_death_racer_helmet.d20badb0a68de890b604a2cabb721955dbe381c9.png",
		name: "Death Racer's Helmet",
		grade: 3
	},
	30693: {
		defindex: 30693,
		image: "hwn2015_grim_tweeter.4628bcdc8e7d817c6ad5fd1a52821d32573e9fd2.png",
		name: "Grim Tweeter",
		grade: 2
	},
	30698: {
		defindex: 30698,
		image: "hwn2015_iron_lung.3ac5536086b83cc9e24b79c0df518937e8472daf.png",
		name: "Iron Lung",
		grade: 3
	},
	30700: {
		defindex: 30700,
		image: "hwn2015_duckyhat.80fc1f335e179994f1847484ce437cb12986f86f.png",
		name: "Duck Billed Hatypus",
		grade: 3
	},
	30704: {
		defindex: 30704,
		image: "hwn2015_dino_hoodie.29afd946a716dd22af1705030da7aa10a2d671eb.png",
		name: "Prehistoric Pullover",
		grade: 4
	},
	30706: {
		defindex: 30706,
		image: "hwn2015_catastrophic_companions.84fd8d5b47a76a5a90b769aad9fb7bb393741d84.png",
		name: "Catastrophic Companions",
		grade: 1
	},
	30707: {
		defindex: 30707,
		image: "hwn2015_mechanical_engineer.8bd0f39accd667b6941981ca3a599309d2dc2f9a.png",
		name: "Dead'er Alive",
		grade: 2
	},
	30708: {
		defindex: 30708,
		image: "hwn2015_hellmet.bfb3b9966930b9e860bc9abbdc8408278afa60bb.png",
		name: "Hellmet",
		the: true,
		grade: 4
	},
	30716: {
		defindex: 30716,
		image: "hwn2015_firebug_suit.bd15ea014eddc8a9b8fc800f2506db1f8f1e45d2.png",
		name: "Crusader's Getup",
		grade: 2
	},
	30717: {
		defindex: 30717,
		image: "hwn2015_firebug_mask.b64d5c293d9f58976ec327e2c656f01f05f29d53.png",
		name: "Arthropod's Aspect",
		grade: 1
	},
	30718: {
		defindex: 30718,
		image: "hwn2015_bargain_bicorne.7d991e392b74f22b6a2f6d78aa3988e0f1643e85.png",
		name: "B'aaarrgh-n-Bicorne",
		grade: 3
	},
	30719: {
		defindex: 30719,
		image: "hwn2015_bargain_britches.3dcb12ff3cab9d3f562ef38a52bf4a6130b2466d.png",
		name: "B'aaarrgh-n-Britches",
		grade: 4
	},
	30720: {
		defindex: 30720,
		image: "bak_arkham_cowl.c90a6e93bc2609f2a1f064885f17679b93a6e8af.png",
		name: "Arkham Cowl"
	},
	30721: {
		defindex: 30721,
		image: "bak_firefly.7a47733f46221365efeb9dfc3e27e004285b6f4f.png",
		name: "Firefly",
		the: true
	},
	30722: {
		defindex: 30722,
		image: "bak_batarm.7eeeb89eda850a7a43e4e38fca373112f3967042.png",
		name: "Batter's Bracers"
	},
	30723: {
		defindex: 30723,
		image: "bak_hood_of_sorrows.16094c6a827239b6a2222e745edd5832c6ab7144.png",
		name: "Hood of Sorrows",
		the: true
	},
	30724: {
		defindex: 30724,
		image: "bak_fear_monger.de2537c18dc2cb5c5103e31fc6dc4a8e557cd230.png",
		name: "Fear Monger"
	},
	30726: {
		defindex: 30726,
		image: "bak_pocket_villians.91b4dfdaccb96b6671e41e281186f39fae381f73.png",
		name: "Pocket Villains"
	},
	30727: {
		defindex: 30727,
		image: "bak_caped_crusader.76ac810614dc1893232622142cca8b9dd8d719bf.png",
		name: "Caped Crusader",
		the: true
	},
	30728: {
		defindex: 30728,
		image: "bak_buttler.cb4f21082eaf112d42c8c6793690aa7fee26787b.png",
		name: "Buttler"
	},
	30733: {
		defindex: 30733,
		image: "bak_teufort_knight.ed4f7108f8e26a0ba4116b80a1ce6d07ead9460e.png",
		name: "Teufort Knight"
	},
	30735: {
		defindex: 30735,
		image: "bak_sidekicks_side_slick.f95dff09b064ed71232a98af506a1755fa50fd5b.png",
		name: "Sidekick's Side Slick"
	},
	30736: {
		defindex: 30736,
		image: "bak_bat_backup.03a594c61fd9f538aaf9955d0c1dbef55ca2d2a2.png",
		name: "Bat Backup",
		the: true
	},
	30737: {
		defindex: 30737,
		image: "bak_crook_combatant.b7a940465a8d29d6da9e5964591f3f17166ff8af.png",
		name: "Crook Combatant"
	},
	30738: {
		defindex: 30738,
		image: "bak_batbelt.8e059a02c74dd3c3b684ff5d77a466b9674816b5.png",
		name: "Batbelt"
	},
	30739: {
		defindex: 30739,
		image: "bak_fear_monger.de2537c18dc2cb5c5103e31fc6dc4a8e557cd230.png",
		name: "Fear Monger"
	},
	30740: {
		defindex: 30740,
		image: "bak_arkham_cowl.c90a6e93bc2609f2a1f064885f17679b93a6e8af.png",
		name: "Arkham Cowl"
	},
	30741: {
		defindex: 30741,
		image: "bak_firefly.7a47733f46221365efeb9dfc3e27e004285b6f4f.png",
		name: "Firefly",
		the: true
	},
	30742: {
		defindex: 30742,
		image: "dec15_shin_shredders.b0104770a0a3d950aed3dbe2778b311e5bb4cdc2.png",
		name: "Shin Shredders"
	},
	30743: {
		defindex: 30743,
		image: "dec15_patriot_peak.9ba6f12ce315f56cf429b82506e0b836e9dfbae0.png",
		name: "Patriot Peak",
		the: true
	},
	30744: {
		defindex: 30744,
		image: "dec15_diplomat.517c339fc885c0ef429efd35cb55b49f220f6ba9.png",
		name: "Diplomat",
		the: true
	},
	30745: {
		defindex: 30745,
		image: "dec15_heavy_sweater.eb500e084317e2ac0504a154a39dc1e47191db9b.png",
		name: "Siberian Sweater"
	},
	30746: {
		defindex: 30746,
		image: "dec15_a_well_wrapped_hat.96455230e7fa549eeb65f4e4359c2383dff98d32.png",
		name: "A Well Wrapped Hat"
	},
	30747: {
		defindex: 30747,
		image: "dec15_gift_bringer.3252ccfff95d11d2b838aa121fb82f21eb09716e.png",
		name: "Gift Bringer",
		the: true
	},
	30748: {
		defindex: 30748,
		image: "dec15_chill_chullo.c2bf625405a05381716d9561a3f18f84c9139b9c.png",
		name: "Chill Chullo",
		the: true
	},
	30749: {
		defindex: 30749,
		image: "dec15_winter_backup.c37a0d6b9ae6c9ca3ea89ed28a633c7bf3394968.png",
		name: "Winter Backup"
	},
	30750: {
		defindex: 30750,
		image: "dec15_medic_winter_jacket2_emblem.156ea89ac5c7a99a4281df2b785c0e864bc753b1.png",
		name: "Medical Monarch"
	},
	30751: {
		defindex: 30751,
		image: "dec15_scout_baseball_bag.6d8c1087c3460fa44d1c5b77f315d7ef515a3eff.png",
		name: "Bonk Batter's Backup"
	},
	30752: {
		defindex: 30752,
		image: "dec15_chicago_overcoat.d2463f546a00c3f1656760297531e554c02d9e6d.png",
		name: "Chicago Overcoat"
	},
	30753: {
		defindex: 30753,
		image: "dec15_a_hat_to_kill_for.eea84f338b17f9c8e9ab6bc88e3b140bdeb2583d.png",
		name: "A Hat to Kill For"
	},
	30754: {
		defindex: 30754,
		image: "dec15_hot_heels.fbb1bf15d8f6e7b69a32efd8e28d67237a5fb3fe.png",
		name: "Hot Heels"
	},
	30755: {
		defindex: 30755,
		image: "dec15_berlin_brain_bowl.bf96bedaa27db6ca538cc612705082b59a695b5e.png",
		name: "Berlin Brain Bowl"
	},
	30756: {
		defindex: 30756,
		image: "dec15_bunnyhoppers_ballistics_vest.6dd7a58bfb8cdd5d5db26fcccf4f21259a50860d.png",
		name: "Bunnyhopper's Ballistics Vest"
	},
	30761: {
		defindex: 30761,
		image: "fumblers_fanfare.1ea9567c982f1947483f2d8c156ef1aa5e00f601.png",
		name: "Taunt: The Fubar Fanfare"
	},
	30762: {
		defindex: 30762,
		image: "disco_fever.c37411bd2ebf7d31836745ebefc65feb807a3f4e.png",
		name: "Taunt: Disco Fever"
	},
	30763: {
		defindex: 30763,
		image: "spring_rider.64077e06a6fe8f3c1359bc0d24a460c66e0b8f85.png",
		name: "Taunt: The Balloonibouncer"
	},
	30767: {
		defindex: 30767,
		image: "snowboard_hat.c2771f0b82cf2bd3b60b974667a63bca7534a2a9.png",
		name: "Airdog",
		the: true,
		grade: 4
	},
	30768: {
		defindex: 30768,
		image: "angsty_hood.69339d0caaf1adba4976a5f567ce529f477b0b93.png",
		name: "Bedouin Bandana",
		grade: 1
	},
	30769: {
		defindex: 30769,
		image: "knight_helmet.6a4cbbc76ec0dcebda087852056cbf9d19ed3aad.png",
		name: "Herald's Helm",
		grade: 3
	},
	30770: {
		defindex: 30770,
		image: "medieval_glory_armor.b51ca6f54c1115db22bdd1d5f3b45db300c72ee0.png",
		name: "Courtly Cuirass",
		grade: 4
	},
	30771: {
		defindex: 30771,
		image: "medieval_glory_boots.b3a15aa6a1b0b3acb818807f4a1257b68d9e47ee.png",
		name: "Squire's Sabatons",
		grade: 4
	},
	30773: {
		defindex: 30773,
		image: "cardiologists_camo.14391952035eed3f62c69bf9235f9d04196d45c2.png",
		name: "Surgical Survivalist",
		the: true,
		grade: 4
	},
	30775: {
		defindex: 30775,
		image: "skullmask.712c118c7d8b2ce9801bbe55e36d1bca434e6919.png",
		name: "Dead Head",
		the: true,
		grade: 1
	},
	30777: {
		defindex: 30777,
		image: "majors_mark.b840b2a1f5545a20ee3724d3ac60148d623e81e1.png",
		name: "Lurking Legionnaire",
		the: true,
		grade: 3
	},
	30779: {
		defindex: 30779,
		image: "vampire_shades.03ea8edc7477f2298358c0084b53e5d91f168e68.png",
		name: "Dayjogger",
		the: true,
		grade: 2
	},
	30780: {
		defindex: 30780,
		image: "shooters_supplies.74fa1854c92e078b8510cd0615486f02185155de.png",
		name: "Patriot's Pouches"
	},
	30785: {
		defindex: 30785,
		image: "all_work_and_no_plaid.a33987092dc9f601b6964fd7f156666e6f783748.png",
		name: "Dad Duds",
		grade: 2
	},
	30786: {
		defindex: 30786,
		image: "surgical_stare.12b339ff99faefc36fd610ef10d1ebe7dda1a8e1.png",
		name: "Gauzed Gaze"
	},
	30788: {
		defindex: 30788,
		image: "demolitionists_dustcatcher.81635dfc108335cca5fae7d864829c16d6aca074.png",
		name: "Demo's Dustcatcher",
		the: true,
		grade: 4
	},
	30789: {
		defindex: 30789,
		image: "headhunters_wrap.bc8777ad9276c5ff9adf504e21b7d273c999496d.png",
		name: "Scoped Spartan"
	},
	30792: {
		defindex: 30792,
		image: "hwn2016_colossal_cranium_2.b00fc20f93189b812b03599014961a64e0e7df80.png",
		name: "Colossal Cranium",
		grade: 4
	},
	30793: {
		defindex: 30793,
		image: "hwn2016_aerobatics_demonstrator.8c0a47b70ea50a826b536e39ff624d68ddc7e24b.png",
		name: "Aerobatics Demonstrator"
	},
	30794: {
		defindex: 30794,
		image: "hwn2016_final_frontiersman.d7b87ab607e4fa4d771d1386468b777e8bf7f319.png",
		name: "Final Frontier Freighter"
	},
	30795: {
		defindex: 30795,
		image: "hwn2016_hovering_hotshot.ff2e4dd3922068f286c455d5c376728ec970ba2d.png",
		name: "Hovering Hotshot"
	},
	30796: {
		defindex: 30796,
		image: "hwn2016_toadstool_topper.5ef069fd092971b95d5ccf40cbb95f3e446328e0.png",
		name: "Toadstool Topper",
		the: true,
		grade: 3
	},
	30797: {
		defindex: 30797,
		image: "hwn2016_showstopper.b2f1e412f53759fe4cefab3abd16411f88a7505c.png",
		name: "Showstopper",
		grade: 4
	},
	30798: {
		defindex: 30798,
		image: "hwn2016_big_topper.73b0ecabf1baeb5a1d0dcd809e63e58e1c995833.png",
		name: "Big Topper",
		grade: 3
	},
	30799: {
		defindex: 30799,
		image: "hwn2016_combustible_cutie.a4b5aada24167f463d1ecfa91b590c49f767c05b.png",
		name: "Combustible Cutie",
		grade: 1
	},
	30800: {
		defindex: 30800,
		image: "hwn2016_pyro_shark.3599e35b10982e529e88a7e16445cbd8c8742acf.png",
		name: "Cranial Carcharodon",
		the: true,
		grade: 4
	},
	30801: {
		defindex: 30801,
		image: "hwn2016_spooktacles.8aaff529de048df296d9f52baf0ff0045d1756f6.png",
		name: "Spooktacles",
		grade: 4
	},
	30803: {
		defindex: 30803,
		image: "hwn2016_heavy_tourism.1d009553cc3be0233d51cbf10df8fbcd161aba05.png",
		name: "Heavy Tourism",
		grade: 3
	},
	30804: {
		defindex: 30804,
		image: "hwn2016_el_paso_poncho.ada364bb45197e92505d1b91af12b3ebbd92631a.png",
		name: "El Paso Poncho",
		the: true,
		grade: 4
	},
	30805: {
		defindex: 30805,
		image: "hwn2016_wide_brimmed_bandito.3ea3632b58e987fd8c2dfdc45b648f1c92f87c10.png",
		name: "Wide-Brimmed Bandito",
		the: true,
		grade: 4
	},
	30806: {
		defindex: 30806,
		image: "hwn2016_corpus_christi_cranium.04e0eb78fa9a02418866ae5f38d84f9be4961c16.png",
		name: "Corpus Christi Cranium",
		the: true,
		grade: 3
	},
	30807: {
		defindex: 30807,
		image: "hwn2016_spirit_of_the_bombing_past.53371e63a7a026c35dce228b3926a320297987e0.png",
		name: "Spirit of the Bombing Past",
		grade: 3
	},
	30808: {
		defindex: 30808,
		image: "hwn2016_class_crown.f8e1613dbcbb02ff5f5af27c4e139a51a9a7c061.png",
		name: "Class Crown",
		grade: 1
	},
	30809: {
		defindex: 30809,
		image: "hwn2016_wing_mann.3697902d31d6e61cb860bf1b565212ffb6803408.png",
		name: "Wing Mann",
		the: true,
		grade: 4
	},
	30810: {
		defindex: 30810,
		image: "hwn2016_nasty_norsemann.64764fb6da2bb01f69116fd7e59320b6446e2f99.png",
		name: "Nasty Norsemann",
		grade: 4
	},
	30811: {
		defindex: 30811,
		image: "hwn2016_pestering_jester.82cc1c57504249a8be6056b0a960ee0e9dd26f93.png",
		name: "Pestering Jester",
		grade: 2
	},
	30812: {
		defindex: 30812,
		image: "hwn2016_mo_horn.97f9d5eb9bf86229099c35a03a6e5356a773fc1d.png",
		name: "Mo'Horn",
		grade: 2
	},
	30813: {
		defindex: 30813,
		image: "hwn2016_surgeons_sidearms.263aac2eed414a20cf029b740e78200cd07d673c.png",
		name: "Surgeon's Sidearms",
		the: true,
		grade: 4
	},
	30814: {
		defindex: 30814,
		image: "hwn2016_lil_bitey.e1c52159672f3d6c2f2c1d69a90e4ac2c37d1121.png",
		name: "Lil' Bitey",
		grade: 3
	},
	30815: {
		defindex: 30815,
		image: "hwn2016_mad_mask.df3f1cd37ce9e1b0b98af39e5a64198b4f59c4c6.png",
		name: "Mad Mask",
		grade: 4
	},
	30816: {
		defindex: 30816,
		image: "secondrate_sorcery.3bf299a8f606d17bccddc84f0315a539a59456b8.png",
		name: "Taunt: Second Rate Sorcery"
	},
	30817: {
		defindex: 30817,
		image: "hwn2016_burly_beast.4b6823e44ff22f491fdffa39285b6ee966439726.png",
		name: "Burly Beast",
		grade: 2
	}
});

window.nameMapping = ({
	tf_weapon_bat: 0,
	tf_weapon_bottle: 1,
	tf_weapon_fireaxe: 2,
	tf_weapon_club: 3,
	tf_weapon_knife: 4,
	tf_weapon_fists: 5,
	tf_weapon_shovel: 6,
	tf_weapon_wrench: 7,
	tf_weapon_bonesaw: 8,
	tf_weapon_shotgun_primary: 9,
	tf_weapon_shotgun_soldier: 10,
	tf_weapon_shotgun_hwg: 11,
	tf_weapon_shotgun_pyro: 12,
	tf_weapon_scattergun: 13,
	tf_weapon_sniperrifle: 14,
	tf_weapon_minigun: 15,
	tf_weapon_smg: 16,
	tf_weapon_syringegun_medic: 17,
	tf_weapon_rocketlauncher: 18,
	tf_weapon_grenadelauncher: 19,
	tf_weapon_pipebomblauncher: 20,
	tf_weapon_flamethrower: 21,
	tf_weapon_pistol: 22,
	tf_weapon_pistol_scout: 23,
	tf_weapon_revolver: 24,
	tf_weapon_pda_engineer_build: 25,
	tf_weapon_pda_engineer_destroy: 26,
	tf_weapon_pda_spy: 27,
	tf_weapon_builder: 28,
	tf_weapon_medigun: 29,
	tf_weapon_invis: 30,
	kritzkrieg: 35,
	blutsauger: 36,
	ubersaw: 37,
	axtinguisher: 38,
	'flare gun': 39,
	backburner: 40,
	natascha: 41,
	sandvich: 42,
	'killing gloves of boxing': 43,
	sandman: 44,
	'force-a-nature': 45,
	'bonk! atomic punch': 46,
	'demoman\'s fro': 47,
	'mining light': 48,
	'football helmet': 49,
	'prussian pickelhaube': 50,
	'pyro\'s beanie': 51,
	'batter\'s helmet': 52,
	'trophy belt': 53,
	'soldier\'s stash': 54,
	'fancy fedora': 55,
	huntsman: 56,
	razorback: 57,
	jarate: 58,
	'dead ringer': 59,
	'cloak and dagger': 60,
	ambassador: 61,
	'texas ten gallon': 94,
	'engineer\'s cap': 95,
	'officer\'s ushanka': 96,
	'tough guy\'s toque': 97,
	'stainless pot': 98,
	'tyrant\'s helm': 99,
	'glengarry bonnet': 100,
	'vintage tyrolean': 101,
	'respectless rubber glove': 102,
	'camera beard': 103,
	'otolaryngologist\'s mirror': 104,
	'brigade helm': 105,
	'bonk helm': 106,
	'ye olde baker boy': 107,
	'backbiter\'s billycock': 108,
	'professional\'s panama': 109,
	'master\'s yellow belt': 110,
	'baseball bill\'s sports shine': 111,
	'ghastly gibus': 116,
	'ritzy rick\'s hair fixative': 117,
	'texas slim\'s dome shine': 118,
	'scotsman\'s stove pipe': 120,
	'web easteregg medal': 121,
	'l4d hat': 126,
	'direct hit': 127,
	equalizer: 128,
	'buff banner': 129,
	'scottish resistance': 130,
	'chargin\' targe': 131,
	eyelander: 132,
	gunboats: 133,
	'towering pillar of hats': 135,
	'noble amassment of hats': 137,
	'modest pile of hat': 139,
	wrangler: 140,
	'frontier justice': 141,
	gunslinger: 142,
	'osx item': 143,
	'medic mask': 144,
	'heavy hair': 145,
	'demoman hallmark': 146,
	'spy noble hair': 147,
	'engineer welding mask': 148,
	'scout beanie': 150,
	'pyro brain sucker': 151,
	'soldier samurai hat': 152,
	homewrecker: 153,
	'pain train': 154,
	'southern hospitality': 155,
	'sniper pith helmet': 158,
	'dalokohs bar': 159,
	'ttg max pistol': 160,
	'ttg sam revolver': 161,
	'ttg max hat': 162,
	'crit-a-cola': 163,
	'high five taunt': 167,
	'tribalman\'s shiv': 171,
	'scotsman\'s skullcutter': 172,
	'vita-saw': 173,
	'scout whoopee cap': 174,
	'pyro monocle': 175,
	'medic goggles': 177,
	'engineer earmuffs': 178,
	'demoman tricorne': 179,
	'spy beret': 180,
	'sniper fishing hat': 181,
	'pyro helm': 182,
	'soldier drill hat': 183,
	'medic gatsby': 184,
	'heavy do-rag': 185,
	'parasite hat': 189,
	'upgradeable tf_weapon_bat': 190,
	'upgradeable tf_weapon_bottle': 191,
	'upgradeable tf_weapon_fireaxe': 192,
	'upgradeable tf_weapon_club': 193,
	'upgradeable tf_weapon_knife': 194,
	'upgradeable tf_weapon_fists': 195,
	'upgradeable tf_weapon_shovel': 196,
	'upgradeable tf_weapon_wrench': 197,
	'upgradeable tf_weapon_bonesaw': 198,
	'upgradeable tf_weapon_shotgun_primary': 199,
	'upgradeable tf_weapon_scattergun': 200,
	'upgradeable tf_weapon_sniperrifle': 201,
	'upgradeable tf_weapon_minigun': 202,
	'upgradeable tf_weapon_smg': 203,
	'upgradeable tf_weapon_syringegun_medic': 204,
	'upgradeable tf_weapon_rocketlauncher': 205,
	'upgradeable tf_weapon_grenadelauncher': 206,
	'upgradeable tf_weapon_pipebomblauncher': 207,
	'upgradeable tf_weapon_flamethrower': 208,
	'upgradeable tf_weapon_pistol': 209,
	'upgradeable tf_weapon_revolver': 210,
	'upgradeable tf_weapon_medigun': 211,
	'upgradeable tf_weapon_invis': 212,
	attendant: 213,
	powerjack: 214,
	degreaser: 215,
	'rimmed raincatcher': 216,
	milkman: 219,
	shortstop: 220,
	'holy mackerel': 221,
	'mad milk': 222,
	'familiar fez': 223,
	'l\'etranger': 224,
	'your eternal reward': 225,
	'battalion\'s backup': 226,
	'grenadier\'s softcap': 227,
	'black box': 228,
	'ol\' snaggletooth': 229,
	'sydney sleeper': 230,
	'darwin\'s danger shield': 231,
	bushwacka: 232,
	'gift - 1 player': 233,
	'gift - 24 players': 234,
	'rocket jumper': 237,
	'gloves of running urgently': 239,
	'worms gear': 240,
	'duel minigame': 241,
	'pugilist\'s protector': 246,
	'old guadalajara': 247,
	'napper\'s respite': 248,
	'bombing run': 249,
	'chieftain\'s challenge': 250,
	'stout shako': 251,
	'dr\'s dapper topper': 252,
	'handyman\'s handle': 253,
	'hard counter': 254,
	'sober stuntman': 255,
	'carouser\'s capotain': 259,
	'wiki cap': 260,
	'ellis hat': 263,
	'frying pan': 264,
	'stickybomb jumper': 265,
	'horseless headless horseman\'s headtaker': 266,
	'haunted metal scrap': 267,
	'halloween mask - scout': 268,
	'halloween mask - sniper': 269,
	'halloween mask - soldier': 270,
	'halloween mask - demoman': 271,
	'halloween mask - medic': 272,
	'halloween mask - heavy': 273,
	'halloween mask - spy': 274,
	'halloween mask - engineer': 275,
	'halloween mask - pyro': 276,
	'halloween mask - saxton hale': 277,
	'horseless headless horseman\'s head': 278,
	'halloween noise maker - black cat': 280,
	'halloween noise maker - gremlin': 281,
	'halloween noise maker - werewolf': 282,
	'halloween noise maker - witch': 283,
	'halloween noise maker - banshee': 284,
	'halloween noise maker - crazy laugh': 286,
	'spine-chilling skull': 287,
	'halloween noise maker - stabby': 288,
	'voodoo juju': 289,
	'cadaver\'s cranium': 290,
	'horrific headsplitter': 291,
	'poker visor': 292,
	'ttg max pistol - poker night': 294,
	'ttg glasses': 295,
	'ttg badge': 296,
	'portal 2 pin': 299,
	'camera helm': 302,
	'berliner\'s bucket helm': 303,
	amputator: 304,
	'crusader\'s crossbow': 305,
	'scotch bonnet': 306,
	'ullapool caber': 307,
	'loch-n-load': 308,
	'big chief': 309,
	'warrior\'s spirit': 310,
	'buffalo steak sandvich': 311,
	'brass beast': 312,
	'magnificent mongolian': 313,
	'larrikin robin': 314,
	'blighted beak': 315,
	'pyromancer\'s mask': 316,
	'candy cane': 317,
	'prancer\'s pride': 318,
	'detective noir': 319,
	'madame dixie': 321,
	'buckaroos hat': 322,
	'german gonzila': 323,
	'flipped trilby': 324,
	'boston basher': 325,
	'back scratcher': 326,
	claidheamohmor: 327,
	jag: 329,
	'coupe d\'isaster': 330,
	'fists of steel': 331,
	'treasure hat 1': 332,
	'treasure hat 2': 333,
	'treasure hat 3': 334,
	'kf pyro mask': 335,
	'kf pyro tie': 336,
	'le party phantom': 337,
	'industrial festivizer': 338,
	'exquisite rack': 339,
	'defiant spartan': 340,
	'a rather festive tree': 341,
	'prince tavish\'s crown': 342,
	'crocleather slouch': 344,
	'mnc hat': 345,
	'mnc mascot hat': 346,
	'mnc mascot outfit': 347,
	'sharpened volcano fragment': 348,
	'sun-on-a-stick': 349,
	detonator: 351,
	concheror: 354,
	'fan o\'war': 355,
	'conniver\'s kunai': 356,
	'half-zatoichi': 357,
	'heavy topknot': 358,
	'demo kabuto': 359,
	'hero\'s hachimaki': 360,
	'spy oni mask': 361,
	'medic geisha hair': 363,
	'promotional noise maker - koto': 365,
	'hottie\'s hoodie': 377,
	'team captain': 378,
	'western wear': 379,
	'large luchadore': 380,
	'medic\'s mountain cap': 381,
	'big country': 382,
	'grimm hatte': 383,
	'professor\'s peculiarity': 384,
	'teddy roosebelt': 386,
	'sight for sore eyes': 387,
	'private eye': 388,
	'googly gazer': 389,
	reggaelator: 390,
	'honcho\'s headgear': 391,
	'pocket medic': 392,
	'villain\'s veil': 393,
	'connoisseur\'s cap': 394,
	'furious fukaamigasa': 395,
	'charmer\'s chapeau': 397,
	'doctor\'s sack': 398,
	'ol\' geezer': 399,
	'desert marauder': 400,
	shahanshah: 401,
	'bazaar bargain': 402,
	'sultan\'s ceremonial': 403,
	'persian persuader': 404,
	'ali baba\'s wee booties': 405,
	'splendid screen': 406,
	'quick-fix': 411,
	overdose: 412,
	'solemn vow': 413,
	'liberty launcher': 414,
	'reserve shooter': 415,
	'market gardener': 416,
	'jumper\'s jeepcap': 417,
	'potato hat': 420,
	'resurrection associate pin': 422,
	tomislav: 424,
	'family business': 425,
	'eviction notice': 426,
	'capone\'s capper': 427,
	'moustachium bar': 429,
	'spacechem fishcake fragment': 430,
	'spacechem pin fragment': 431,
	'spacechem pin': 432,
	fishcake: 433,
	'bucket hat': 434,
	'traffic cone': 435,
	'polish war babushka': 436,
	'janissary hat': 437,
	'replay taunt': 438,
	'lord cockswain\'s pith helmet': 439,
	'lord cockswain\'s novelty mutton chops and pipe': 440,
	'cow mangler 5000': 441,
	'righteous bison': 442,
	'dr. grordbort\'s crest': 443,
	mantreads: 444,
	'armored authority': 445,
	'fancy dress uniform': 446,
	'disciplinary action': 447,
	'soda popper': 448,
	winger: 449,
	atomizer: 450,
	'bonk boy': 451,
	'three-rune blade': 452,
	'hero\'s tail': 453,
	'sign of the wolf\'s school': 454,
	'postal pummeler': 457,
	'cosa nostra cap': 459,
	enforcer: 460,
	'big earner': 461,
	'made man': 462,
	'laugh taunt': 463,
	'conjurer\'s cowl': 465,
	maul: 466,
	'medic mtg hat': 467,
	'scout mtg hat': 468,
	'free trial premium upgrade': 472,
	'spiral sallet': 473,
	'conscientious objector': 474,
	'meet the medic heroic taunt': 477,
	'copper\'s hard top': 478,
	'security shades': 479,
	'tam o\'shanter': 480,
	'stately steel toe': 481,
	'nessie\'s nine iron': 482,
	'rogue\'s col roule': 483,
	'prairie heel biters': 484,
	'big steel jaw of summer fun': 485,
	'summer shades': 486,
	'power up canteen (mvm)': 489,
	'scout flip-flops': 490,
	'lucky no. 42': 491,
	'summer hat': 492,
	'promotional noise maker - fireworks': 493,
	original: 513,
	'mask of the shaman': 514,
	pilotka: 515,
	stahlhelm: 516,
	'dragonborn helmet': 517,
	anger: 518,
	'pip-boy': 519,
	wingstick: 520,
	'belltower spec ops': 521,
	'deus specs': 522,
	'sarif cap': 523,
	'purity fist': 524,
	diamondback: 525,
	machina: 526,
	widowmaker: 527,
	'short circuit': 528,
	'killer exclusive': 538,
	'el jefe': 539,
	'ball-kicking boots': 540,
	'merc\'s pride scarf': 541,
	'noise maker - vuvuzela': 542,
	'hair of the dog': 543,
	'scottish snarl': 544,
	'pickled paws': 545,
	'wrap battler': 546,
	'b-ankh!': 547,
	futankhamun: 548,
	'blazing bull': 549,
	'fallen angel': 550,
	'tail from the crypt': 551,
	einstein: 552,
	'dr. gogglestache': 553,
	'emerald jarate': 554,
	'idiot box': 555,
	'steel pipes': 556,
	'shoestring budget': 557,
	'under cover': 558,
	'griffin\'s gog': 559,
	'intangible ascot': 560,
	'can opener': 561,
	'soviet stitch-up': 562,
	'steel-toed stompers': 563,
	'holy hunter': 564,
	'silver bullets': 565,
	'garlic flank stake': 566,
	'buzz killer': 567,
	'frontier flyboy': 568,
	'legend of bugfoot': 569,
	'last breath': 570,
	'apparition\'s aspect': 571,
	'unarmed combat': 572,
	'wanga prick': 574,
	'infernal impaler': 575,
	'spine-chilling skull 2011': 576,
	'spine-chilling skull 2011 style 1': 578,
	'spine-chilling skull 2011 style 2': 579,
	'spine-chilling skull 2011 style 3': 580,
	'monoculus!': 581,
	bombinomicon: 583,
	'cold war luchador': 585,
	'mark of the saint': 586,
	'apoco-fists': 587,
	'pomson 6000': 588,
	'eureka effect': 589,
	'brainiac hairpiece': 590,
	'brainiac goggles': 591,
	'dr. grordbort\'s copper crest': 592,
	'third degree': 593,
	phlogistinator: 594,
	manmelter: 595,
	'moonman backpack': 596,
	'bubble pipe': 597,
	'manniversary paper hat': 598,
	'manniversary giveaway package': 599,
	'your worst nightmare': 600,
	'one-man army': 601,
	'counterfeit billycock': 602,
	outdoorsman: 603,
	'tavish degroot experience': 604,
	'pencil pusher': 605,
	'builder\'s blueprints': 606,
	'buccaneer\'s bicorne': 607,
	bootlegger: 608,
	'scottish handshake': 609,
	'a whiff of the old brimstone': 610,
	'salty dog': 611,
	'little buddy': 612,
	'gym rat': 613,
	'hot dogger': 614,
	birdcage: 615,
	'surgeon\'s stahlhelm': 616,
	'backwards ballcap': 617,
	'crocodile smile': 618,
	'flair!': 619,
	'couvre corner': 620,
	'surgeon\'s stethoscope': 621,
	'l\'inspecteur': 622,
	'photo badge': 623,
	'clan pride': 625,
	'swagman\'s swatter': 626,
	'flamboyant flamenco': 627,
	'virtual reality headset': 628,
	'spectre\'s spectacles': 629,
	'stereoscopic shades': 630,
	'hat with no name': 631,
	'cremator\'s conscience': 632,
	hermes: 633,
	'point and shoot': 634,
	'war head': 635,
	'dr. grordbort\'s silver crest': 636,
	'dashin\' hashshashin': 637,
	'sharp dresser': 638,
	bowtie: 639,
	'ornament armament': 641,
	'cozy camper': 642,
	'sandvich safe': 643,
	'head warmer': 644,
	'outback intellectual': 645,
	'itsy bitsy spyer': 646,
	'all-father': 647,
	'wrap assassin': 648,
	'spy-cicle': 649,
	'kringle collection': 650,
	'jingle belt': 651,
	'big elfin deal': 652,
	'bootie time': 653,
	'festive minigun 2011': 654,
	'holiday punch': 656,
	'nine-pipe problem': 657,
	'festive rocket launcher 2011': 658,
	'festive flamethrower 2011': 659,
	'festive bat 2011': 660,
	'festive stickybomb launcher 2011': 661,
	'festive wrench 2011': 662,
	'festive medigun 2011': 663,
	'festive sniper rifle 2011': 664,
	'festive knife 2011': 665,
	'b.m.o.c.': 666,
	'holiday headcase': 667,
	'full head of steam': 668,
	'festive scattergun 2011': 669,
	'stocking stuffer': 670,
	'brown bomber': 671,
	'noise maker - winter 2011': 673,
	ebenezer: 675,
	'lucky shot': 701,
	'warsworn helmet': 702,
	bolgan: 703,
	'bolgan family crest': 704,
	'boston boom-bringer': 707,
	'aladdin\'s private reserve': 708,
	'snapped pupil': 709,
	'merc medal': 718,
	'battle bob': 719,
	'bushman\'s boonie': 720,
	conquistador: 721,
	'fast learner': 722,
	'tour of duty ticket': 725,
	'black rose': 727,
	'store purchase promotion package': 729,
	'beggar\'s bazooka': 730,
	'captain\'s cocktails': 731,
	'helmet without a home': 732,
	'pet robro': 733,
	'teufort tooth kicker': 734,
	tf_weapon_builder_spy: 735,
	'upgradeable tf_weapon_builder_spy': 736,
	'upgradeable tf_weapon_pda_engineer_build': 737,
	'pet balloonicorn': 738,
	lollichop: 739,
	'scorch shot': 740,
	rainblower: 741,
	'autogrant pyrovision goggles': 743,
	'pyrovision goggles': 744,
	'infernal orchestrina': 745,
	'burning bongos': 746,
	'cleaner\'s carbine': 751,
	'hitman\'s heatmaker': 752,
	'waxy wayfinder': 753,
	'scrap pack': 754,
	'texas half-pants': 755,
	'bolt action blitzer': 756,
	'toss-proof towel': 757,
	'mvm squad surplus voucher': 758,
	'fruit shoot': 759,
	'front runner': 760,
	'sneaky spats of sneaking': 763,
	'cross-comm crash helmet': 764,
	'cross-comm express': 765,
	'doublecross-comm': 766,
	'atomic accolade': 767,
	'professor\'s pineapple': 768,
	quadwrangler: 769,
	'surgeon\'s side satchel': 770,
	'liquor locker': 771,
	'baby face\'s blaster': 772,
	'pretty boy\'s pocket pistol': 773,
	'gentle munitionne of leisure': 774,
	'escape plan': 775,
	'bird-man of aberdeen': 776,
	'apparatchik\'s apparel': 777,
	'gentleman\'s ushanka': 778,
	'liquidator\'s lid': 779,
	'fed-fightin\' fedora': 780,
	'dillinger\'s duffel': 781,
	'business casual': 782,
	'hazmat headcase': 783,
	'idea tube': 784,
	'robot chicken hat': 785,
	'grenadier helm': 786,
	'tribal bones': 787,
	'void monk hair': 788,
	'ninja cowl': 789,
	'sandvich promo package': 790,
	'companion square promo package': 791,
	'silver botkiller sniper rifle mk.i': 792,
	'silver botkiller minigun mk.i': 793,
	'silver botkiller knife mk.i': 794,
	'silver botkiller wrench mk.i': 795,
	'silver botkiller medi gun mk.i': 796,
	'silver botkiller stickybomb launcher mk.i': 797,
	'silver botkiller flame thrower mk.i': 798,
	'silver botkiller scattergun mk.i': 799,
	'silver botkiller rocket launcher mk.i': 800,
	'gold botkiller sniper rifle mk.i': 801,
	'gold botkiller minigun mk.i': 802,
	'gold botkiller knife mk.i': 803,
	'gold botkiller wrench mk.i': 804,
	'gold botkiller medi gun mk.i': 805,
	'gold botkiller stickybomb launcher mk.i': 806,
	'gold botkiller flame thrower mk.i': 807,
	'gold botkiller scattergun mk.i': 808,
	'gold botkiller rocket launcher mk.i': 809,
	'red-tape recorder': 810,
	'huo long heatmaker': 811,
	'flying guillotine': 812,
	'neon annihilator': 813,
	'triad trinket': 814,
	'champ stamp': 815,
	marxman: 816,
	'human cannonball': 817,
	'awesomenauts badge': 818,
	'lone star': 819,
	'russian rocketeer': 820,
	'soviet gentleman': 821,
	'pocket purrer': 823,
	'koala compact': 824,
	'hat of cards': 825,
	'medi-mask': 826,
	'track terrorizer': 827,
	archimedes: 828,
	'war pig': 829,
	'bearded bombardier': 830,
	'promo red-tape recorder': 831,
	'promo huo long heatmaker': 832,
	'promo flying guillotine': 833,
	'promo neon annihilator': 834,
	'promo triad trinket': 835,
	'promo champ stamp': 836,
	'promo marxman': 837,
	'promo human cannonball': 838,
	'steam translation package': 839,
	'u-clank-a': 840,
	'stealth steeler': 841,
	'pyrobotics pack': 842,
	'medic mech-bag': 843,
	'tin pot': 844,
	'battery bandolier': 845,
	'robot running man': 846,
	'bolted bushman': 847,
	'tin-1000': 848,
	deflector: 850,
	'awper hand': 851,
	'soldier\'s stogie': 852,
	'crafty hair': 853,
	'area 451': 854,
	'vigilant pin': 855,
	'pyrotechnic tote': 856,
	flunkyware: 857,
	'hanger-on hood': 858,
	'flight of the monarch': 859,
	'robo-sandvich': 863,
	'friends forever companion square badge': 864,
	'triple a badge': 865,
	'heavy artillery officer\'s cap': 866,
	'combat medic\'s crusher cap': 867,
	'heroic companion badge': 868,
	'rump-o\'-lantern': 869,
	'lacking moral fiber mask': 872,
	'whale bone charm': 873,
	'king of scotland cape': 874,
	menpo: 875,
	'k-9 mane': 876,
	'stovepipe sniper shako': 877,
	'foppish physician': 878,
	'distinguished rogue': 879,
	'freedom staff': 880,
	'rust botkiller sniper rifle mk.i': 881,
	'rust botkiller minigun mk.i': 882,
	'rust botkiller knife mk.i': 883,
	'rust botkiller wrench mk.i': 884,
	'rust botkiller medi gun mk.i': 885,
	'rust botkiller stickybomb launcher mk.i': 886,
	'rust botkiller flame thrower mk.i': 887,
	'rust botkiller scattergun mk.i': 888,
	'rust botkiller rocket launcher mk.i': 889,
	'blood botkiller sniper rifle mk.i': 890,
	'blood botkiller minigun mk.i': 891,
	'blood botkiller knife mk.i': 892,
	'blood botkiller wrench mk.i': 893,
	'blood botkiller medi gun mk.i': 894,
	'blood botkiller stickybomb launcher mk.i': 895,
	'blood botkiller flame thrower mk.i': 896,
	'blood botkiller scattergun mk.i': 897,
	'blood botkiller rocket launcher mk.i': 898,
	'carbonado botkiller sniper rifle mk.i': 899,
	'carbonado botkiller minigun mk.i': 900,
	'carbonado botkiller knife mk.i': 901,
	'carbonado botkiller wrench mk.i': 902,
	'carbonado botkiller medi gun mk.i': 903,
	'carbonado botkiller stickybomb launcher mk.i': 904,
	'carbonado botkiller flame thrower mk.i': 905,
	'carbonado botkiller scattergun mk.i': 906,
	'carbonado botkiller rocket launcher mk.i': 907,
	'diamond botkiller sniper rifle mk.i': 908,
	'diamond botkiller minigun mk.i': 909,
	'diamond botkiller knife mk.i': 910,
	'diamond botkiller wrench mk.i': 911,
	'diamond botkiller medi gun mk.i': 912,
	'diamond botkiller stickybomb launcher mk.i': 913,
	'diamond botkiller flame thrower mk.i': 914,
	'diamond botkiller scattergun mk.i': 915,
	'diamond botkiller rocket launcher mk.i': 916,
	'sir hootsalot': 917,
	'master mind': 918,
	scarecrow: 919,
	'crone\'s dome': 920,
	executioner: 921,
	bonedolier: 922,
	plutonidome: 923,
	'spooky shoes': 924,
	'spooky sleeves': 925,
	zipperface: 926,
	'boo balloon': 927,
	'portal 2 soundtrack promo package': 928,
	'unknown monkeynaut': 929,
	'grand duchess tutu': 930,
	'grand duchess fairy wings': 931,
	'grand duchess tiara': 932,
	'ap-sap': 933,
	'dead little buddy': 934,
	'voodoo juju (slight return)': 935,
	exorcizor: 936,
	'wraith wrap': 937,
	'coffin kit': 938,
	'bat outta hell': 939,
	'skull island topper': 941,
	cockfighter: 942,
	'hitt mann badge': 943,
	'that \'70s chapeau': 944,
	'chief constable': 945,
	'siberian sophisticate': 946,
	quackenbirdt: 947,
	'deadliest duckling': 948,
	dethkapp: 949,
	'nose candy': 950,
	'rail spikes': 951,
	'brock\'s locks': 952,
	tuxxy: 955,
	'faerie solitaire pin': 956,
	'silver botkiller sniper rifle mk.ii': 957,
	'silver botkiller minigun mk.ii': 958,
	'silver botkiller knife mk.ii': 959,
	'silver botkiller wrench mk.ii': 960,
	'silver botkiller medi gun mk.ii': 961,
	'silver botkiller stickybomb launcher mk.ii': 962,
	'silver botkiller flame thrower mk.ii': 963,
	'silver botkiller scattergun mk.ii': 964,
	'silver botkiller rocket launcher mk.ii': 965,
	'gold botkiller sniper rifle mk.ii': 966,
	'gold botkiller minigun mk.ii': 967,
	'gold botkiller knife mk.ii': 968,
	'gold botkiller wrench mk.ii': 969,
	'gold botkiller medi gun mk.ii': 970,
	'gold botkiller stickybomb launcher mk.ii': 971,
	'gold botkiller flame thrower mk.ii': 972,
	'gold botkiller scattergun mk.ii': 973,
	'gold botkiller rocket launcher mk.ii': 974,
	'winter wonderland wrap': 976,
	'cut-throat concierge': 977,
	'der wintermantel': 978,
	'cool breeze': 979,
	'soldier\'s slope scopers': 980,
	'cold killer': 981,
	'doc\'s holiday': 982,
	'digit divulger': 983,
	'tough stuff muffs': 984,
	'heavy\'s hockey hair': 985,
	'mutton mann': 986,
	'merc\'s muffler': 987,
	barnstormer: 988,
	carl: 989,
	'aqua flops': 990,
	'hunger force': 991,
	'smissmas wreath': 992,
	antlers: 993,
	'pet reindoonicorn': 995,
	'loose cannon': 996,
	'rescue ranger': 997,
	vaccinator: 998,
	'festive holy mackerel': 999,
	'festive axtinguisher': 1000,
	'festive buff banner': 1001,
	'festive sandvich': 1002,
	'festive ubersaw': 1003,
	'festive frontier justice': 1004,
	'festive huntsman': 1005,
	'festive ambassador': 1006,
	'festive grenade launcher': 1007,
	'prize plushy': 1008,
	'grizzled growth': 1009,
	'last straw': 1010,
	'wilson weave': 1012,
	'ham shank': 1013,
	'brutal bouffant': 1014,
	'shred alert': 1015,
	'buck turner all-stars': 1016,
	'vox diabolus': 1017,
	'pounding father': 1018,
	'blind justice': 1019,
	'person in the iron mask': 1020,
	'doe-boy': 1021,
	'sydney straw boat': 1022,
	'steel songbird': 1023,
	'croft\'s crest': 1024,
	'fortune hunter': 1025,
	'tomb wrapper': 1026,
	'random droppable paints package': 1027,
	'samson skewer': 1028,
	bloodhound: 1029,
	'dapper disguise': 1030,
	necronomicrown: 1031,
	'long fall loafers': 1032,
	'pallet of crates': 1037,
	'breather bag': 1038,
	'weather master': 1039,
	'bacteria blocker': 1040,
	grandmaster: 1067,
	'halloween unfilled spellbook': 1068,
	'halloween spellbook': 1069,
	'basic spellbook': 1070,
	'gold frying pan': 1071,
	'portable smissmas spirit dispenser': 1072,
	'war on smissmas battle hood': 1073,
	'war on smissmas battle socks': 1074,
	'sack fulla smissmas': 1075,
	'smissmas caribou': 1076,
	'randolph the blood-nosed caribou': 1077,
	'festive force-a-nature': 1078,
	'festive crusader\'s crossbow': 1079,
	'festive sapper': 1080,
	'festive flare gun': 1081,
	'festive eyelander': 1082,
	'festive jarate': 1083,
	'festive gloves of running urgently': 1084,
	'festive black box': 1085,
	'festive wrangler': 1086,
	'der maschinensoldaten-helm': 1087,
	'die regime-panzerung': 1088,
	'mister bubbles': 1089,
	'big daddy': 1090,
	'first american': 1091,
	'fortified compound': 1092,
	'gilded guard': 1093,
	'criminal cloak': 1094,
	'dread hiding hood': 1095,
	'baronial badge': 1096,
	'little bear': 1097,
	classic: 1098,
	'tide turner': 1099,
	'bread bite': 1100,
	'b.a.s.e. jumper': 1101,
	'snack attack': 1102,
	'back scatter': 1103,
	'air strike': 1104,
	'self-aware beauty mark': 1105,
	'square dance taunt': 1106,
	'flippin\' awesome taunt': 1107,
	'buy a life taunt': 1108,
	'results are in taunt': 1109,
	'rps taunt': 1110,
	'skullcracker taunt': 1111,
	'party trick taunt': 1112,
	'fresh brewed victory taunt': 1113,
	'spent well spirits taunt': 1114,
	'rancho relaxo taunt': 1115,
	'i see you taunt': 1116,
	'battin\' a thousand taunt': 1117,
	'conga taunt': 1118,
	'deep fried desire taunt': 1119,
	'oblooterated taunt': 1120,
	'mutated milk': 1121,
	'towering pillar of summer shades': 1122,
	'necro smasher': 1123,
	nabler: 1124,
	'duck badge': 1126,
	'crossing guard': 1127,
	tf_weapon_spellbook: 1132,
	'powerup strength': 1133,
	'powerup haste': 1134,
	'powerup regen': 1135,
	'powerup resist': 1136,
	'powerup vampire': 1137,
	'powerup warlock': 1138,
	'powerup precision': 1139,
	'powerup agility': 1140,
	'festive shotgun 2014': 1141,
	'festive revolver 2014': 1142,
	'festive bonesaw 2014': 1143,
	'festive targe 2014': 1144,
	'festive bonk 2014': 1145,
	'festive backburner 2014': 1146,
	'festive smg 2014': 1149,
	'quickiebomb launcher': 1150,
	'iron bomber': 1151,
	tf_weapon_grapplinghook: 1152,
	'panic attack shotgun': 1153,
	'powerup knockout': 1154,
	tf_weapon_passtime_gun: 1155,
	'taunt: kazotsky kick': 1157,
	'powerup king': 1159,
	'powerup plague': 1160,
	'powerup supernova': 1161,
	'taunt: mannrobics': 1162,
	'default power up canteen (mvm)': 1163,
	'competitive matchmaking official': 1167,
	'taunt: the carlton': 1168,
	'taunt: the victory lap': 1172,
	'map token egypt': 1900,
	'map token coldfront': 1901,
	'map token fastlane': 1902,
	'map token turbine': 1903,
	'map token steel': 1904,
	'map token junction': 1905,
	'map token watchtower': 1906,
	'map token hoodoo': 1907,
	'map token offblast': 1908,
	'map token yukon': 1909,
	'map token harvest': 1910,
	'map token freight': 1911,
	'map token mountain lab': 1912,
	'map token manor event': 1913,
	'map token nightfall': 1914,
	'map token frontier': 1915,
	'map token lakeside': 1916,
	'map token gullywash': 1917,
	'map token kong king': 1918,
	'map token process': 1919,
	'map token standin': 1920,
	'map token snakewater': 1921,
	'map token snowplow': 1922,
	'map token borneo': 1923,
	'map token suijin': 1924,
	'map token 2fort invasion': 1925,
	'map token probed': 1926,
	'map token watergate': 1927,
	'map token byre': 1928,
	'map token gorge event': 1929,
	'map token sunshine event': 1930,
	'map token moonshine event': 1931,
	'map token millstone event': 1932,
	'map token snowycoast': 1933,
	'map token vanguard': 1934,
	'map token landfall': 1935,
	'map token highpass': 1936,
	'map token sunshine': 1937,
	'map token metalworks': 1938,
	'map token swiftwater': 1939,
	'map token maple ridge event': 1940,
	'map token fifth curve event': 1941,
	'map token pit of death': 1942,
	'name tag for bundles': 2093,
	'craft bar level 1': 5000,
	'craft bar level 2': 5001,
	'craft bar level 3': 5002,
	'scout class token': 5003,
	'sniper class token': 5004,
	'soldier class token': 5005,
	'demoman class token': 5006,
	'heavy class token': 5007,
	'medic class token': 5008,
	'pyro class token': 5009,
	'spy class token': 5010,
	'engineer class token': 5011,
	'slot token - primary': 5012,
	'slot token - secondary': 5013,
	'slot token - melee': 5014,
	'slot token - pda2': 5018,
	'name tag': 5020,
	'decoder ring': 5021,
	'supply crate': 5022,
	'paint can': 5023,
	'customize texture tool': 5026,
	'paint can 1': 5027,
	'paint can 2': 5028,
	'paint can 3': 5029,
	'paint can 4': 5030,
	'paint can 5': 5031,
	'paint can 6': 5032,
	'paint can 7': 5033,
	'paint can 8': 5034,
	'paint can 9': 5035,
	'paint can 10': 5036,
	'paint can 11': 5037,
	'paint can 12': 5038,
	'paint can 13': 5039,
	'paint can 14': 5040,
	'supply crate 2': 5041,
	'gift wrap': 5042,
	'wrapped gift': 5043,
	'description tag': 5044,
	'supply crate 3': 5045,
	'paint can team color': 5046,
	'winter crate': 5048,
	'winter key': 5049,
	'backpack expander': 5050,
	'paint can 15': 5051,
	'paint can 16': 5052,
	'paint can 17': 5053,
	'paint can 18': 5054,
	'paint can 19': 5055,
	'paint can 20': 5056,
	'paint can team color 2': 5060,
	'paint can team color 3': 5061,
	'paint can team color 4': 5062,
	'paint can team color 5': 5063,
	'paint can team color 6': 5064,
	'paint can team color 7': 5065,
	'summer crate': 5066,
	'summer key': 5067,
	'supply crate rare': 5068,
	'naughty winter crate 2011': 5070,
	'nice winter crate 2011': 5071,
	'naughty winter key 2011': 5072,
	'nice winter key 2011': 5073,
	'paint can 21': 5076,
	'paint can 22': 5077,
	'scorched crate': 5078,
	'scorched key': 5079,
	'fall crate 2012': 5080,
	'fall key 2012': 5081,
	'account upgrade to premium': 5082,
	'giftapult gift wrap': 5083,
	'wrapped giftapult package': 5084,
	'delivered giftapult package': 5085,
	'summer starter kit': 5086,
	'summer adventure pack': 5087,
	'rift spider hat code': 5500,
	goldfish: 5600,
	'pocket lint': 5601,
	'cheese wheel': 5602,
	'banana peel': 5603,
	'barn door plank': 5604,
	'secret diary': 5605,
	'damaged capacitor': 5606,
	'pile of ash': 5607,
	'voodoo-cursed item (armory)': 5608,
	'voodoo-cursed old boot': 5609,
	'voodoo-cursed skeleton': 5610,
	'voodoo-cursed bag of quicklime': 5611,
	'voodoo-cursed robot arm': 5612,
	'voodoo-cursed novelty bass': 5613,
	'voodoo-cursed sticky-bomb': 5614,
	'voodoo-cursed nail': 5615,
	'voodoo-cursed soul (armory)': 5616,
	'zombie scout': 5617,
	'zombie soldier': 5618,
	'zombie heavy': 5619,
	'zombie demo': 5620,
	'zombie engineer': 5621,
	'zombie medic': 5622,
	'zombie spy': 5623,
	'zombie pyro': 5624,
	'zombie sniper': 5625,
	'pile of curses': 5626,
	'eerie crate': 5627,
	'eerie key': 5628,
	'naughty winter crate 2012': 5629,
	'nice winter crate 2012': 5630,
	'naughty winter key 2012': 5631,
	'nice winter key 2012': 5632,
	'strange bacon grease': 5633,
	'robo crate 2013': 5635,
	'robo key 2013': 5636,
	'gift - 23 robokeys 2013': 5637,
	'gift - 1 robokey 2013': 5638,
	'july 2013 claim check': 5639,
	'july 2013 early crate': 5640,
	'july 2013 early key': 5641,
	'july 2013 crate 01': 5642,
	'july 2013 key 01': 5643,
	'july 2013 crate 02': 5644,
	'july 2013 key 02': 5645,
	'july 2013 crate 03': 5646,
	'july 2013 key 03': 5647,
	'july 2013 crate 04': 5648,
	'july 2013 key 04': 5649,
	'july 2013 crate 05': 5650,
	'july 2013 key 05': 5651,
	'july 2013 crate 06': 5652,
	'july 2013 key 06': 5653,
	'july 2013 crate 07': 5654,
	'july 2013 key 07': 5655,
	'july 2013 crate 08': 5656,
	'july 2013 key 08': 5657,
	'gift - 23 summerkeys 2013': 5658,
	'gift - 1 summerkey 2013': 5659,
	'supply crate rare 2': 5660,
	'pomson 6000 strangifier': 5661,
	'robits loot 01': 5700,
	'robits loot 02': 5701,
	'robits loot 03': 5702,
	'robits loot 04': 5703,
	'robits loot 05': 5704,
	'robits loot 06': 5705,
	'robits loot 07': 5706,
	'robits loot 08': 5707,
	'fall 2013 acorns crate': 5708,
	'fall 2013 gourd crate': 5709,
	'fall 2013 acorns key': 5710,
	'fall 2013 gourd key': 5711,
	'halloween 2013 crate': 5712,
	'halloween 2013 key': 5713,
	'naughty winter crate 2013': 5714,
	'nice winter crate 2013': 5715,
	'naughty winter key 2013': 5716,
	'nice winter key 2013': 5717,
	'strongbox crate 2014': 5719,
	'strongbox key 2014': 5720,
	'pretty boy\'s pocket pistol strangifier': 5721,
	'phlogistinator strangifier': 5722,
	'cleaner\'s carbine strangifier': 5723,
	'private eye strangifier': 5724,
	'big chief strangifier': 5725,
	'rocket launcher killstreakifier basic': 5726,
	'scattergun killstreakifier basic': 5727,
	'sniperrifle killstreakifier basic': 5728,
	'shotgun killstreakifier basic': 5729,
	'ubersaw killstreakifier basic': 5730,
	'gru killstreakifier basic': 5731,
	'spy-cicle launcher killstreakifier basic': 5732,
	'axtinguisher killstreakifier basic': 5733,
	'supply crate ration': 5734,
	'supply crate ration 2': 5735,
	'short 2014 community crate a': 5737,
	'short 2014 community crate b': 5738,
	'short 2014 taunt crate': 5739,
	'short 2014 key': 5740,
	'self gift - mutated bread box': 5741,
	'supply crate ration 3': 5742,
	'stickylauncher killstreakifier basic': 5743,
	'minigun killstreakifier basic': 5744,
	'directhit killstreakifier basic': 5745,
	'huntsman killstreakifier basic': 5746,
	'backburner killstreakifier basic': 5747,
	'backscatter killstreakifier basic': 5748,
	'kritzkrieg killstreakifier basic': 5749,
	'ambassador killstreakifier basic': 5750,
	'frontier justice killstreakifier basic': 5751,
	'supply crate ration 4': 5752,
	'air strike strangifier': 5753,
	'classic strangifier': 5754,
	'manmelter strangifier': 5755,
	'vaccinator strangifier': 5756,
	'widowmaker strangifier': 5757,
	'anger strangifier': 5758,
	'apparition\'s aspect strangifier': 5759,
	'taunt shuffle crate': 5760,
	'summer crate 2014': 5761,
	'limited summer 2014 key': 5762,
	'halloween 2014 scout crate': 5763,
	'halloween 2014 pyro crate': 5764,
	'halloween 2014 heavy crate': 5765,
	'halloween 2014 engineer crate': 5766,
	'halloween 2014 spy crate': 5767,
	'halloween 2014 sniper crate': 5768,
	'halloween 2014 soldier crate': 5769,
	'halloween 2014 medic crate': 5770,
	'halloween 2014 demo crate': 5771,
	'eotl community crate': 5774,
	'eotl community key': 5775,
	'gift - 23 eotl keys': 5776,
	'gift - 1 eotl key': 5777,
	'duck token': 5778,
	'gift - 23 duck tokens': 5779,
	'gift - 1 duck token': 5780,
	'supply crate ration 5': 5781,
	'cow mangler 5000 strangifier': 5783,
	'third degree strangifier': 5784,
	'naughty winter crate 2014': 5789,
	'nice winter crate 2014': 5790,
	'naughty key 2014 key': 5791,
	'nice key 2014 key': 5792,
	'flaregun killstreakifier basic': 5793,
	'wrench killstreakifier basic': 5794,
	'revolver killstreakifier basic': 5795,
	'machina killstreakifier basic': 5796,
	'baby face blaster killstreakifier basic': 5797,
	'huo long heatmaker killstreakifier basic': 5798,
	'loose cannon killstreakifier basic': 5799,
	'vaccinator killstreakifier basic': 5800,
	'air strike killstreakifier basic': 5801,
	'supply crate ration 6': 5802,
	'supply crate ration 7': 5803,
	'righteous bison strangifier': 5804,
	'summer 2015 operation key': 5805,
	'operation summer 2015 concealed killer case': 5806,
	'operation summer 2015 powerhouse case': 5807,
	'unused summer 2015 operation pass': 5808,
	'activated summer 2015 operation pass': 5809,
	'concealed killer collection dummy': 5810,
	'craftsmann collection dummy': 5811,
	'powerhouse collection dummy': 5812,
	'teufort collection dummy': 5813,
	'gun mettle cosmetics collection dummy': 5814,
	'gun mettle cosmetic key': 5816,
	'gun mettle cosmetic case': 5817,
	'strange count transfer tool': 5818,
	'unused invasion pass': 5819,
	'activated invasion pass': 5820,
	'invasion key': 5821,
	'invasion case 01': 5822,
	'invasion case 02': 5823,
	'invasion collection dummy 01': 5824,
	'invasion collection dummy 02': 5825,
	'activated halloween pass': 5826,
	'halloween 2015 key': 5827,
	'halloween 2015 case': 5828,
	'unused operation tough break pass': 5829,
	'activated operation tough break pass': 5830,
	'tough break case 01 pyroland': 5831,
	'tough break case 02 warbirds': 5832,
	'tough break key': 5833,
	'tough break collection dummy 01': 5834,
	'tough break collection dummy 02': 5835,
	'tough break collection dummy 03': 5836,
	'tough break collection dummy 04': 5837,
	'winter 2015 mystery box': 5838,
	'festivizer 2015': 5839,
	'tough break cosmetics collection dummy': 5840,
	'tough break cosmetic key': 5841,
	'tough break cosmetic case': 5842,
	'common stat clock': 5843,
	'fall 2013 acorns key new': 5844,
	'strongbox key 2014 new': 5845,
	'short 2014 key new': 5846,
	'halloween 2015 key new': 5847,
	'mayflower cosmetic key': 5848,
	'mayflower cosmetic case': 5849,
	'keyless cosmetic crate scout': 5850,
	'keyless cosmetic crate sniper': 5851,
	'keyless cosmetic crate soldier': 5852,
	'keyless cosmetic crate demoman': 5853,
	'keyless cosmetic crate medic': 5854,
	'keyless cosmetic crate heavy': 5855,
	'keyless cosmetic crate pyro': 5856,
	'keyless cosmetic crate spy': 5857,
	'keyless cosmetic crate engineer': 5858,
	'supply crate ration 8': 5859,
	'keyless cosmetic crate multiclass': 5860,
	'halloween 2016 case': 5861,
	'halloween 2016 key': 5862,
	'halloween 2015 collection dummy': 5863,
	'halloween 2016 collection dummy': 5864,
	'strange part (armory)': 5999,
	'strange part: heavies killed': 6000,
	'strange part: demomen killed': 6001,
	'strange part: soldiers killed': 6002,
	'strange part: scouts killed': 6003,
	'strange part: engineers killed': 6004,
	'strange part: snipers killed': 6005,
	'strange part: pyros killed': 6006,
	'strange part: medics killed': 6007,
	'strange part: spies killed': 6008,
	'strange part: buildings destroyed': 6009,
	'strange part: projectiles reflected': 6010,
	'strange part: headshot kills': 6011,
	'strange part: airborne enemies killed': 6012,
	'strange part: enemies gibbed': 6013,
	'strange part: full moon kills': 6015,
	'strange part: domination kills': 6016,
	'strange part: revenge kills': 6018,
	'strange part: posthumous kills': 6019,
	'strange part: allies extinguished': 6020,
	'strange part: critical kills': 6021,
	'strange part: kills while explosive-jumping': 6022,
	'strange part: ubers dropped': 6023,
	'strange part: cloaked spies killed': 6024,
	'strange part: sappers destroyed': 6025,
	'strange part: robots destroyed': 6026,
	'strange part: giant robots destroyed': 6028,
	'strange part: kills while low-health': 6032,
	'strange part: halloween kills': 6033,
	'strange part: robots destroyed during halloween': 6034,
	'strange part: defender kills': 6035,
	'strange part: underwater kills': 6036,
	'strange part: kills while ubercharged': 6037,
	'strange part: tanks destroyed': 6038,
	'strange part: long-distance kills': 6039,
	'strange part: victory time kills': 6041,
	'strange part: robot scout kills': 6042,
	'strange part: robot spy kills': 6048,
	'strange part: taunt kills': 6051,
	'strange part: players wearing unusuals': 6052,
	'strange part: burning enemies killed': 6053,
	'strange part: killstreaks ended': 6054,
	'strange cosmetic part: killcam taunts': 6055,
	'strange part: damage dealt': 6056,
	'strange cosmetic part: fires survived': 6057,
	'strange part: ally healing done': 6058,
	'strange part: point-blank kills': 6059,
	'strange cosmetic part: kills': 6060,
	'strange part: full health kills': 6061,
	'strange part: taunting player kills': 6062,
	'strange part: non-critical kills': 6063,
	'strange part: players hit': 6064,
	'strange cosmetic part: assists': 6065,
	'strange filter: coldfront (community)': 6500,
	'strange filter: egypt (community)': 6502,
	'strange filter: junction (community)': 6503,
	'strange filter: mountain lab (community)': 6504,
	'strange filter: steel (community)': 6505,
	'strange filter: gullywash (community)': 6506,
	'strange filter: turbine (community)': 6507,
	'strange filter: fastlane (community)': 6508,
	'strange filter: freight (community)': 6509,
	'strange filter: yukon (community)': 6510,
	'strange filter: harvest (community)': 6511,
	'strange filter: lakeside (community)': 6512,
	'strange filter: kong king (community)': 6513,
	'strange filter: frontier (community)': 6514,
	'strange filter: hoodoo (community)': 6515,
	'strange filter: nightfall (community)': 6516,
	'strange filter: watchtower (community)': 6517,
	'strange filter: offblast (community)': 6518,
	'strange filter: mann manor (community)': 6519,
	'strange filter: process (community)': 6520,
	'strange filter: standin (community)': 6521,
	strangifier: 6522,
	killstreakifier: 6523,
	'strange filter: snakewater (community)': 6524,
	'killstreakifier rare': 6526,
	'killstreakifier basic': 6527,
	'strange filter: snowplow (community)': 6528,
	'strange filter: borneo (community)': 6529,
	'strange filter: suijin (community)': 6530,
	'strange filter: 2fort invasion (community)': 6531,
	'strange filter: probed (community)': 6532,
	'strange filter: watergate (community)': 6533,
	'strange filter: byre (community)': 6534,
	'strange filter: gorge event (community)': 6535,
	'strange filter: sunshine event (community)': 6536,
	'strange filter: moonshine event (community)': 6537,
	'strange filter: millstone event (community)': 6538,
	'strange filter: snowycoast (community)': 6539,
	'strange filter: vanguard (community)': 6540,
	'strange filter: landfall (community)': 6541,
	'strange filter: highpass (community)': 6542,
	'strange filter: competitive': 6543,
	'strange filter: sunshine (community)': 6544,
	'strange filter: metalworks (community)': 6545,
	'strange filter: swiftwater (community)': 6546,
	'strange filter: maple ridge event (community)': 6547,
	'strange filter: fifth curve event (community)': 6548,
	'strange filter: pit of death (community)': 6549,
	'halloween spell: paint 1': 8900,
	'halloween spell: paint 2': 8901,
	'halloween spell: paint 3': 8902,
	'halloween spell: paint 4': 8903,
	'halloween spell: paint 5': 8904,
	'halloween spell: soldier voice': 8905,
	'halloween spell: scout voice': 8906,
	'halloween spell: sniper voice': 8907,
	'halloween spell: engineer voice': 8908,
	'halloween spell: heavy voice': 8909,
	'halloween spell: demoman voice': 8910,
	'halloween spell: pyro voice': 8911,
	'halloween spell: spy voice': 8912,
	'halloween spell: medic voice': 8913,
	'halloween spell: team spirit footprints': 8914,
	'halloween spell: gangreen footprints': 8915,
	'halloween spell: corpse gray footprints': 8916,
	'halloween spell: violent violet footprints': 8917,
	'halloween spell: rotten orange footprints': 8918,
	'halloween spell: bruised purple footprints': 8919,
	'halloween spell: headless horseshoes': 8920,
	'halloween spell: exorcism': 8921,
	'halloween spell: squash rockets': 8922,
	'halloween spell: gourd grenades': 8923,
	'halloween spell: sentry quad-pumpkins': 8924,
	'halloween spell: spectral flame': 8925,
	'halloween transmogrifier: pyro': 8926,
	'halloween transmogrifier: scout': 8927,
	'halloween transmogrifier: soldier': 8928,
	'halloween transmogrifier: demo': 8929,
	'halloween transmogrifier: heavy': 8930,
	'halloween transmogrifier: medic': 8931,
	'halloween transmogrifier: sniper': 8932,
	'halloween transmogrifier: spy': 8933,
	'halloween transmogrifier: engineer': 8934,
	'halloween spellbook page': 8935,
	'halloween spellbook page (achievement)': 8936,
	'eternaween enchantment': 8937,
	'glitched circuit board': 8938,
	'taunt unusualifier': 9258,
	concealedkiller_sniperrifle_nightowl: 15000,
	concealedkiller_smg_woodsywidowmaker: 15001,
	concealedkiller_scattergun_nightterror: 15002,
	concealedkiller_shotgun_backwoodsboomstick: 15003,
	concealedkiller_minigun_kingofthejungle: 15004,
	concealedkiller_flamethrower_forestfire: 15005,
	concealedkiller_rocketlauncher_woodlandwarrior: 15006,
	concealedkiller_sniperrifle_purplerange: 15007,
	concealedkiller_medigun_maskedmender: 15008,
	concealedkiller_stickybomblauncher_suddenflurry: 15009,
	concealedkiller_medigun_wrappedreviver: 15010,
	concealedkiller_revolver_psychedelicslugger: 15011,
	concealedkiller_stickybomblauncher_carpetbomber: 15012,
	concealedkiller_pistol_redrockroscoe: 15013,
	concealedkiller_rocketlauncher_sandcannon: 15014,
	craftsmann_scattergun_tartantorpedo: 15015,
	craftsmann_shotgun_rusticruiner: 15016,
	craftsmann_flamethrower_barnburner: 15017,
	craftsmann_pistol_homemadeheater: 15018,
	craftsmann_sniperrifle_lumberfromdownunder: 15019,
	craftsmann_minigun_ironwood: 15020,
	craftsmann_scattergun_countrycrusher: 15021,
	craftsmann_smg_plaidpotshotter: 15022,
	craftsmann_sniperrifle_shotinthedark: 15023,
	craftsmann_stickybomblauncher_blastedbombardier: 15024,
	craftsmann_medigun_reclaimedreanimator: 15025,
	craftsmann_minigun_antiqueannihilator: 15026,
	craftsmann_revolver_oldcountry: 15027,
	craftsmann_rocketlauncher_americanpastoral: 15028,
	craftsmann_scattergun_backcountryblaster: 15029,
	teufort_flamethrower_bovineblazemaker: 15030,
	teufort_minigun_warroom: 15031,
	teufort_smg_treadplatetormenter: 15032,
	teufort_sniperrifle_bogtrotter: 15033,
	teufort_flamethrower_earthskyandfire: 15034,
	teufort_pistol_hickoryholepuncher: 15035,
	teufort_scattergun_sprucedeuce: 15036,
	teufort_smg_teamsprayer: 15037,
	teufort_stickybomblauncher_rooftopwrangler: 15038,
	teufort_medigun_civilservant: 15039,
	teufort_minigun_citizenpain: 15040,
	teufort_pistol_localhero: 15041,
	teufort_revolver_mayor: 15042,
	teufort_rocketlauncher_smalltownbringdown: 15043,
	teufort_shotgun_civicduty: 15044,
	powerhouse_stickybomblauncher_liquidasset: 15045,
	powerhouse_pistol_blackdahlia: 15046,
	powerhouse_shotgun_lightningrod: 15047,
	powerhouse_stickybomblauncher_pinkelephant: 15048,
	powerhouse_flamethrower_flashfryer: 15049,
	powerhouse_medigun_sparkoflife: 15050,
	powerhouse_revolver_deadreckoner: 15051,
	powerhouse_rocketlauncher_shellshocker: 15052,
	powerhouse_scattergun_currentevent: 15053,
	powerhouse_flamethrower_turbinetorcher: 15054,
	powerhouse_minigun_brickhouse: 15055,
	powerhouse_pistol_sandstonespecial: 15056,
	powerhouse_rocketlauncher_aquamarine: 15057,
	powerhouse_smg_lowprofile: 15058,
	powerhouse_sniperrifle_thunderbolt: 15059,
	harvest_pistol_macabreweb: 15060,
	harvest_pistol_nutcracker: 15061,
	harvest_revolver_boneyard: 15062,
	harvest_revolver_wildwood: 15063,
	harvest_revolver_macabreweb: 15064,
	harvest_scattergun_macabreweb: 15065,
	harvest_flamethrower_autumn: 15066,
	harvest_flamethrower_pumpkinpatch: 15067,
	harvest_flamethrower_nutcracker: 15068,
	harvest_scattergun_nutcracker: 15069,
	harvest_sniperrifle_pumpkinpatch: 15070,
	harvest_sniperrifle_boneyard: 15071,
	harvest_sniperrifle_wildwood: 15072,
	harvest_wrench_nutcracker: 15073,
	harvest_wrench_autumn: 15074,
	harvest_wrench_boneyard: 15075,
	harvest_smg_wildwood: 15076,
	harvest_grenadelauncher_autumn: 15077,
	harvest_medigun_wildwood: 15078,
	harvest_grenadelauncher_macabreweb: 15079,
	harvest_knife_boneyard: 15080,
	harvest_rocketlauncher_autumn: 15081,
	harvest_stickybomblauncher_autumn: 15082,
	harvest_stickybomblauncher_pumpkinpatch: 15083,
	harvest_stickybomblauncher_macabreweb: 15084,
	harvest_shotgun_autumn: 15085,
	harvest_minigun_macabreweb: 15086,
	harvest_minigun_pumpkinpatch: 15087,
	harvest_minigun_nutcracker: 15088,
	pyroland_flamethrower_balloonicorn: 15089,
	pyroland_flamethrower_rainbow: 15090,
	pyroland_grenadelauncher_rainbow: 15091,
	pyroland_grenadelauncher_sweetdreams: 15092,
	pyroland_knife_bluemew: 15094,
	pyroland_knife_braincandy: 15095,
	pyroland_knife_stabbedtohell: 15096,
	pyroland_medigun_flowerpower: 15097,
	pyroland_minigun_braincandy: 15098,
	pyroland_minigun_mistercuddles: 15099,
	pyroland_pistol_bluemew: 15100,
	pyroland_pistol_braincandy: 15101,
	pyroland_pistol_shottohell: 15102,
	pyroland_revolver_flowerpower: 15103,
	pyroland_rocketlauncher_bluemew: 15104,
	pyroland_rocketlauncher_braincandy: 15105,
	pyroland_scattergun_bluemew: 15106,
	pyroland_scattergun_flowerpower: 15107,
	pyroland_scattergun_shottohell: 15108,
	pyroland_shotgun_flowerpower: 15109,
	pyroland_smg_bluemew: 15110,
	pyroland_sniperrifle_balloonicorn: 15111,
	pyroland_sniperrifle_rainbow: 15112,
	pyroland_stickybomblauncher_sweetdreams: 15113,
	pyroland_wrench_torquedtohell: 15114,
	gentlemanne_flamethrower_coffinnail: 15115,
	gentlemanne_grenadelauncher_coffinnail: 15116,
	gentlemanne_grenadelauncher_topshelf: 15117,
	gentlemanne_knife_dressedtokill: 15118,
	gentlemanne_knife_topshelf: 15119,
	gentlemanne_medigun_coffinnail: 15120,
	gentlemanne_medigun_dressedtokill: 15121,
	gentlemanne_medigun_highrollers: 15122,
	gentlemanne_minigun_coffinnail: 15123,
	gentlemanne_minigun_dressedtokill: 15124,
	gentlemanne_minigun_topshelf: 15125,
	gentlemanne_pistol_dressedtokill: 15126,
	gentlemanne_revolver_coffinnail: 15127,
	gentlemanne_revolver_topshelf: 15128,
	gentlemanne_rocketlauncher_coffinnail: 15129,
	gentlemanne_rocketlauncher_highrollers: 15130,
	gentlemanne_scattergun_coffinnail: 15131,
	gentlemanne_shotgun_coffinnail: 15132,
	gentlemanne_shotgun_dressedtokill: 15133,
	gentlemanne_smg_highrollers: 15134,
	gentlemanne_sniperrifle_coffinnail: 15135,
	gentlemanne_sniperrifle_dressedtokill: 15136,
	gentlemanne_stickybomblauncher_coffinnail: 15137,
	gentlemanne_stickybomblauncher_dressedtokill: 15138,
	gentlemanne_wrench_dressedtokill: 15139,
	gentlemanne_wrench_topshelf: 15140,
	warbird_flamethrower_warhawk: 15141,
	warbird_grenadelauncher_warhawk: 15142,
	warbird_knife_blitzkrieg: 15143,
	warbird_knife_airwolf: 15144,
	warbird_medigun_blitzkrieg: 15145,
	warbird_medigun_corsair: 15146,
	warbird_minigun_butcherbird: 15147,
	warbird_pistol_blitzkrieg: 15148,
	warbird_revolver_blitzkrieg: 15149,
	warbird_rocketlauncher_warhawk: 15150,
	warbird_scattergun_killerbee: 15151,
	warbird_shotgun_redbear: 15152,
	warbird_smg_blitzkrieg: 15153,
	warbird_sniperrifle_airwolf: 15154,
	warbird_stickybomblauncher_blitzkrieg: 15155,
	warbird_wrench_airwolf: 15156,
	warbird_scattergun_corsair: 15157,
	warbird_grenadelauncher_butcherbird: 15158,
	'cosmetic strangifier recipe 1': 20000,
	'cosmetic strangifier recipe 1 rare': 20001,
	'mvm killstreak recipe 1': 20002,
	'mvm killstreak recipe 2': 20003,
	'cosmetic strangifier recipe 2': 20005,
	'collector recipe 1': 20006,
	'festive collector recipe 2013': 20007,
	'rebuild strange weapon recipe': 20008,
	'cosmetic strangifier recipe 3': 20009,
	quest25000: 25000,
	quest25001: 25001,
	quest25002: 25002,
	quest25003: 25003,
	quest25004: 25004,
	quest25005: 25005,
	quest25006: 25006,
	quest25007: 25007,
	quest25008: 25008,
	quest25009: 25009,
	quest25010: 25010,
	quest25011: 25011,
	quest25012: 25012,
	quest25013: 25013,
	quest25014: 25014,
	quest25015: 25015,
	quest25016: 25016,
	quest25017: 25017,
	quest25018: 25018,
	quest25019: 25019,
	quest25020: 25020,
	quest25021: 25021,
	quest25022: 25022,
	quest25023: 25023,
	quest25024: 25024,
	quest25025: 25025,
	quest25026: 25026,
	quest25027: 25027,
	quest25028: 25028,
	quest25029: 25029,
	quest25030: 25030,
	quest25031: 25031,
	quest25032: 25032,
	quest25033: 25033,
	quest25034: 25034,
	quest25035: 25035,
	quest25036: 25036,
	quest25037: 25037,
	quest25038: 25038,
	quest25039: 25039,
	quest25040: 25040,
	quest25041: 25041,
	quest25042: 25042,
	quest25043: 25043,
	quest25044: 25044,
	quest25045: 25045,
	quest25046: 25046,
	quest25047: 25047,
	quest25048: 25048,
	quest25049: 25049,
	quest25050: 25050,
	quest25051: 25051,
	quest25052: 25052,
	quest25053: 25053,
	quest25054: 25054,
	quest25055: 25055,
	'electric badge-aloo': 30000,
	'modest metal pile of scrap': 30001,
	'letch\'s led': 30002,
	'galvanized gibus': 30003,
	'soldered sensei': 30004,
	'shooter\'s tin topi': 30005,
	'noble nickel amassment of hats': 30006,
	'base metal billycock': 30007,
	'towering titanium pillar of hats': 30008,
	'megapixel beard': 30009,
	'hdmi patch': 30010,
	'bolted bombardier': 30011,
	'titanium towel': 30012,
	'gridiron guardian': 30013,
	'tyrantium helmet': 30014,
	'battery canteens': 30015,
	'fr-0': 30016,
	'steel shako': 30017,
	'bot dogger': 30018,
	'ye oiled baker boy': 30019,
	'scrap sack': 30020,
	'pure tin capotain': 30021,
	'plumber\'s pipe': 30022,
	'teddy robobelt': 30023,
	'cyborg stunt helmet': 30024,
	'electric escorter': 30025,
	'full metal drill hat': 30026,
	'bolt boy': 30027,
	'metal slug': 30028,
	'broadband bonnet': 30029,
	'bonk leadwear': 30030,
	'plug-in prospector': 30031,
	'rusty reaper': 30032,
	'soldier\'s sparkplug': 30033,
	'bolted bicorne': 30034,
	'timeless topper': 30035,
	filamental: 30036,
	'strontium stove pipe': 30037,
	'firewall helmet': 30038,
	'respectless robo-glove': 30039,
	'pyro\'s boron beanie': 30040,
	'halogen head lamp': 30041,
	'platinum pickelhaube': 30042,
	'virus doctor': 30043,
	'texas tin-gallon': 30044,
	'titanium tyrolean': 30045,
	'practitioner\'s processing mask': 30046,
	'bootleg base metal billycock': 30047,
	'mecha-medes': 30048,
	'tungsten toque': 30049,
	'steam pipe': 30050,
	'data mining light': 30051,
	'byte\'d beak': 30052,
	'googol glass eyes': 30053,
	'bunsen brave': 30054,
	'scrumpy strongbox': 30055,
	'dual-core devil doll': 30056,
	'bolted birdcage': 30057,
	'crosslinker\'s coil': 30058,
	'beastly bonnet': 30059,
	'cheet sheet': 30060,
	tartantaloons: 30061,
	'steel sixpack': 30062,
	centurion: 30063,
	'tartan shade': 30064,
	'hardy laurel': 30065,
	'brotherhood of arms': 30066,
	'well-rounded rifleman': 30067,
	'breakneck baggies': 30068,
	'powdered practitioner': 30069,
	'pocket pyro': 30070,
	'cloud crasher': 30071,
	'pom-pommed provocateur': 30072,
	'dark age defender': 30073,
	tyurtlenek: 30074,
	'mair mask': 30075,
	'bigg mann on campus': 30076,
	'cool cat cardigan': 30077,
	'greased lightning': 30078,
	'red army robin': 30079,
	'heavy-weight champ': 30080,
	tsarboosh: 30081,
	'glasgow great helm': 30082,
	'caffeine cooler': 30083,
	'half-pipe hurdler': 30084,
	'macho mann': 30085,
	'trash toter': 30086,
	'dry gulch gulp': 30087,
	'el muchacho': 30089,
	'backpack broiler': 30090,
	'burning bandana': 30091,
	'soot suit': 30092,
	'hive minder': 30093,
	katyusha: 30094,
	'das hazmattenhatten': 30095,
	'das feelinbeterbager': 30096,
	'das ubersternmann': 30097,
	'das metalmeatencasen': 30098,
	'pardner\'s pompadour': 30099,
	'birdman of australiacatraz': 30100,
	'cobber chameleon': 30101,
	falconer: 30103,
	graybanns: 30104,
	'black watch': 30105,
	'tartan spartan': 30106,
	'gaelic golf bag': 30107,
	'borscht belt': 30108,
	'das naggenvatcher': 30109,
	'whiskey bib': 30110,
	'stormin\' norman': 30112,
	'flared frontiersman': 30113,
	'valley forge': 30114,
	compatriot: 30115,
	'caribbean conqueror': 30116,
	'colonial clogs': 30117,
	'whirly warrior': 30118,
	'federal casemaker': 30119,
	'rebel rouser': 30120,
	'das maddendoktor': 30121,
	'bear necessities': 30122,
	harmburg: 30123,
	'gaelic garb': 30124,
	'rogue\'s brogues': 30125,
	'shogun\'s shoulder guard': 30126,
	'das gutenkutteharen': 30127,
	'belgian detective': 30128,
	hornblower: 30129,
	'lieutenant bites': 30130,
	'brawling buccaneer': 30131,
	'blood banker': 30132,
	'after dark': 30133,
	'delinquent\'s down vest': 30134,
	'wet works': 30135,
	'baron von havenaplane': 30136,
	'das fantzipantzen': 30137,
	'bolshevik biker': 30138,
	'pampered pyro': 30139,
	'virtual viewfinder': 30140,
	'gabe glasses': 30141,
	'founding father': 30142,
	tw_demobot_armor: 30143,
	tw_demobot_helmet: 30144,
	tw_engineerbot_armor: 30145,
	tw_engineerbot_helmet: 30146,
	tw_heavybot_armor: 30147,
	tw_heavybot_helmet: 30148,
	tw_medibot_chariot: 30149,
	tw_medibot_hat: 30150,
	tw_pyrobot_armor: 30151,
	tw_pyrobot_helmet: 30152,
	tw_scoutbot_armor: 30153,
	tw_scoutbot_hat: 30154,
	tw_sniperbot_armor: 30155,
	tw_sniperbot_helmet: 30156,
	tw_soldierbot_armor: 30157,
	tw_soldierbot_helmet: 30158,
	tw_spybot_armor: 30159,
	tw_spybot_hood: 30160,
	tw_sentrybuster: 30161,
	'bone dome': 30162,
	'air raider': 30163,
	'viking braider': 30164,
	'cuban bristle crisis': 30165,
	'beep boy': 30167,
	'special eyes': 30168,
	'trickster\'s turnout gear': 30169,
	chronomancer: 30170,
	'medical mystery': 30171,
	'gold digger': 30172,
	'brim-full of bullets': 30173,
	'cotton head': 30175,
	'pop-eyes': 30176,
	'hong kong cone': 30177,
	'weight room warmer': 30178,
	'hurt locher': 30179,
	'pirate bandana': 30180,
	'li\'l snaggletooth': 30181,
	'l\'homme burglerre': 30182,
	escapist: 30183,
	flapjack: 30185,
	'a brush with death': 30186,
	'slick cut': 30187,
	'frenchman\'s formals': 30189,
	ward: 30190,
	'beast from below': 30191,
	'hard-headed hardware': 30192,
	'cap\'n calamari': 30193,
	spectralnaut: 30194,
	'ethereal hood': 30195,
	'maniac\'s manacles': 30196,
	'second opinion': 30197,
	'pocket horsemann': 30198,
	'last bite': 30199,
	'baphomet trotters': 30200,
	'burny\'s boney bonnet': 30203,
	'crispy golden locks': 30204,
	'scorched skirt': 30205,
	'accursed apparition': 30206,
	'hound\'s hood': 30207,
	'terrier trousers': 30208,
	'horrific head of hare': 30211,
	'snaggletoothed stetson': 30212,
	'up pyroscopes': 30213,
	'one-way ticket': 30214,
	'birdie bonnet': 30215,
	'external organ': 30216,
	'ivan the inedible': 30217,
	'rugged respirator': 30218,
	'squid\'s lid': 30219,
	hollowhead: 30220,
	'grub grenades': 30221,
	'gothic guise': 30222,
	'grease monkey': 30223,
	'alternative medicine mann': 30224,
	'cauterizer\'s caudal appendage': 30225,
	'polly putrid': 30226,
	'faux manchu': 30227,
	'hidden dragon': 30228,
	'lo-grav loafers': 30229,
	'surgeon\'s space suit': 30230,
	'face plante': 30231,
	'das blutliebhaber': 30232,
	trepanabotomizer: 30233,
	'sackcloth spook': 30234,
	'mucous membrain': 30235,
	'pin pals': 30236,
	medimedes: 30237,
	'chicken kiev': 30238,
	'freedom feathers': 30239,
	'headtaker\'s hood': 30240,
	'transylvania top': 30241,
	candleer: 30242,
	'horsemann\'s hand-me-down': 30243,
	'bozo\'s bouffant': 30245,
	'faun feet': 30247,
	halloweiner: 30248,
	'lordly lapels': 30249,
	'cadaver\'s capper': 30251,
	guano: 30252,
	'sprinting cephalopod': 30253,
	'unidentified following object': 30254,
	'beacon from beyond': 30255,
	'hyperbaric bowler': 30256,
	'death support pack': 30257,
	'carious chameleon': 30258,
	'monster\'s stompers': 30259,
	'bountiful bow': 30260,
	'candyman\'s cap': 30261,
	'vicar\'s vestments': 30263,
	'hardium helm': 30264,
	'jupiter jumpers': 30265,
	'space bracers': 30266,
	handhunter: 30267,
	'spellbinder\'s bonnet': 30268,
	'macabre mask': 30269,
	'shaman\'s skull': 30270,
	'vicious visage': 30273,
	'tuque or treat': 30274,
	'horned honcho': 30275,
	'lieutenant bites the dust': 30276,
	'grisly gumbo': 30277,
	'dark helm': 30278,
	'archimedes the undying': 30279,
	'monstrous mandible': 30280,
	'shaolin sash': 30281,
	'mann-bird of aberdeen': 30282,
	'foul cowl': 30283,
	'sir shootsalot': 30284,
	corpsemopolitan: 30285,
	glob: 30286,
	'hallowed headcase': 30287,
	'carrion companion': 30288,
	quoth: 30289,
	'py-40 incinibot': 30290,
	parasight: 30292,
	teutonkahmun: 30293,
	'larval lid': 30294,
	manneater: 30295,
	'creature from the heap': 30296,
	'magical mercenary': 30297,
	'raven\'s visage': 30298,
	'ramses\' regalia': 30299,
	'haunted hat': 30300,
	'bozo\'s brogues': 30301,
	'cryptic keepsake': 30302,
	'abhorrent appendages': 30303,
	'blizzard breather': 30304,
	'sub zero suit': 30305,
	dictator: 30306,
	'neckwear headwear': 30307,
	'trail-blazer': 30308,
	'dead of night': 30309,
	'snow scoper': 30310,
	nunhood: 30311,
	'angel of death': 30312,
	'kiss king': 30313,
	'slo-poke': 30314,
	'minnesota slick': 30315,
	'toy soldier': 30316,
	'five-month shadow': 30317,
	'mann of reason': 30318,
	'mann of the house': 30319,
	chucklenuts: 30320,
	'tiny timber': 30321,
	'face full of festive': 30322,
	'ruffled ruprecht': 30323,
	'golden garment': 30324,
	'little drummer mann': 30325,
	'scout shako': 30326,
	'toy tailor': 30327,
	'extra layer': 30328,
	'polar pullover': 30329,
	dogfighter: 30330,
	'antarctic parka': 30331,
	'runner\'s warm-up': 30332,
	'highland high heels': 30333,
	'tartan tyrolean': 30334,
	'marshall\'s mutton chops': 30335,
	'trencher\'s topper': 30336,
	'trencher\'s tunic': 30337,
	'ground control': 30338,
	'killer\'s kit': 30339,
	'stylish degroot': 30340,
	ein: 30341,
	'heavy lifter': 30342,
	'gone commando': 30343,
	'bullet buzz': 30344,
	'leftover trap': 30345,
	'trash man': 30346,
	'scotch saver': 30347,
	'bushi-dou': 30348,
	'fashionable megalomaniac': 30349,
	'dough puncher': 30350,
	'teutonic toque': 30351,
	'mustachioed mann': 30352,
	'backstabber\'s boomslang': 30353,
	'rat stompers': 30354,
	'sole mate': 30355,
	'heat of winter': 30356,
	'dark falkirk helm': 30357,
	'sole saviors': 30358,
	'huntsman\'s essentials': 30359,
	'napoleon complex': 30360,
	'colonel\'s coat': 30361,
	law: 30362,
	'juggernaut jacket': 30363,
	'warmth preserver': 30364,
	'smock surgeon': 30365,
	'sangu sleeves': 30366,
	'cute suit': 30367,
	'war goggles': 30368,
	'eliminators safeguard': 30369,
	'archers groundings': 30371,
	'combat slacks': 30372,
	'toowoomba tunic': 30373,
	'sammy cap': 30374,
	'deep cover operator': 30375,
	'ticket boy': 30376,
	'antarctic researcher': 30377,
	'heer\'s helmet': 30378,
	'gaiter guards': 30379,
	'classified coif': 30388,
	'rogue\'s robe': 30389,
	'spook specs': 30390,
	'sengoku scorcher': 30391,
	'man in slacks': 30392,
	'razor cut': 30393,
	'frickin\' sweet ninja hood': 30394,
	'southie shinobi': 30395,
	'red socks': 30396,
	'bruiser\'s bandanna': 30397,
	'gas guzzler': 30398,
	'smoking skid lid': 30399,
	'lunatic\'s leathers': 30400,
	'yuri\'s revenge': 30401,
	'tools of the trade': 30402,
	'joe-on-the-go': 30403,
	'aviator assassin': 30404,
	'sky captain': 30405,
	'peacenik\'s ponytail': 30406,
	'level three chin': 30407,
	'egghead\'s overalls': 30408,
	'lonesome loafers': 30409,
	'ze ubermensch': 30410,
	'au courant assassin': 30411,
	'endothermic exowear': 30412,
	'merc\'s mohawk': 30413,
	'eye-catcher': 30414,
	'medicine manpurse': 30415,
	'employee of the mmmph': 30416,
	frymaster: 30417,
	'combustible kabuto': 30418,
	chronoscarf: 30419,
	danger: 30420,
	'frontier djustice': 30421,
	'vive la france': 30422,
	'scoper\'s smoke': 30423,
	'triggerman\'s tacticals': 30424,
	'tipped lid': 30425,
	'paisley pro': 30426,
	'argyle ace': 30427,
	'pomade prince': 30428,
	allbrero: 30429,
	'seeing double': 30430,
	'six pack abs': 30431,
	horace: 30469,
	'biomech backpack': 30470,
	'alien cranium': 30471,
	'xeno suit': 30472,
	'mk 50': 30473,
	'nostromo napalmer': 30474,
	'mishap mercenary': 30475,
	'lady killer': 30476,
	'lone survivor': 30477,
	'poacher\'s safari jacket': 30478,
	'thirst blood': 30479,
	'mann of the seven sees': 30480,
	'hillbilly speed-bump': 30481,
	'unshaved bear': 30482,
	'pocket heavy': 30483,
	'dadliest catch': 30484,
	herzensbrecher: 30486,
	hundekopf: 30487,
	'kriegsmaschine-9000': 30488,
	'transylvanian toupe': 30489,
	'vampiric vesture': 30490,
	'nugget noggin': 30491,
	'fowl fists': 30492,
	'talon trotters': 30493,
	'head hunter': 30494,
	'claws and infect': 30495,
	'crazy legs': 30496,
	'ghost of spies checked past': 30497,
	'hooded haunter': 30498,
	'conspiratorial cut': 30499,
	'skinless slashers': 30500,
	'marsupial man': 30501,
	'kanga kickers': 30502,
	'roo rippers': 30503,
	'marsupial muzzle': 30504,
	'shadowman\'s shade': 30505,
	'nightmare hunter': 30506,
	'rogue\'s rabbit': 30507,
	'iron fist': 30508,
	'beep man': 30509,
	'soul of \'spenser\'s past': 30510,
	'tiny texan': 30511,
	facepeeler: 30512,
	'mr. mundee\'s wild ride': 30513,
	'templar\'s spirit': 30514,
	'wings of purity': 30515,
	'forgotten king\'s restless head': 30516,
	'forgotten king\'s pauldrons': 30517,
	eyeborg: 30518,
	'explosive mind': 30519,
	'ghoul gibbin\' gear': 30520,
	'hellhunter\'s headpiece': 30521,
	'supernatural stalker': 30522,
	'garden bristles': 30523,
	'battle bird': 30524,
	'creature\'s grin': 30525,
	'arsonist apparatus': 30526,
	'moccasin machinery': 30527,
	'lollichop licker': 30528,
	'mr. juice': 30529,
	vampyro: 30530,
	'bone-cut belt': 30531,
	'bull locks': 30532,
	'minsk beef': 30533,
	'immobile suit': 30534,
	'kritz or treat canteen': 30535,
	'cursed cruise': 30536,
	eotl_skier: 30538,
	eotl_insulated_innovator: 30539,
	eotl_blinks_breeches: 30540,
	eotl_demo_dynamite: 30541,
	'eotl_brisk-weather beanie': 30542,
	eotl_winter_pants: 30543,
	eotl_pyro_sweater: 30544,
	eotl_flat_cap: 30545,
	eotl_furcap: 30546,
	eotl_summerhat: 30547,
	eotl_soldier_garrison: 30548,
	eotl_hiphunter_hat: 30549,
	eotl_hiphunter_jacket: 30550,
	eotl_hiphunter_boots: 30551,
	eotl_thermal_sleeves: 30552,
	eotl_soldierhat: 30553,
	eotl_beard: 30554,
	eotl_demopants: 30555,
	'eotl_ursa major': 30556,
	eotl_sheavyshirt: 30557,
	'eotl_coldfront curbstompers': 30558,
	'end of the line community update medal': 30559,
	bootenkhamuns: 30561,
	'jungle booty': 30563,
	'orion\'s belt': 30564,
	'crown of the old kingdom': 30567,
	'tomb readers': 30569,
	'pool party taunt': 30570,
	brimstone: 30571,
	'taunt: the boston breakdance': 30572,
	'dec2014 marauders mask': 30573,
	'dec2014 truands tunic': 30574,
	'dec2014 fools footwear': 30575,
	'dec2014 copilot_2014': 30576,
	'dec2014 skullcap': 30578,
	'dec2014 2014_pyromancer_hood': 30580,
	'dec2014 pyromancer\'s raiments': 30581,
	'dec2014 black knights bascinet': 30582,
	'dec2014 torchers tabard': 30583,
	'dec2014 armoured appendages': 30584,
	'dec2014 viking helmet': 30586,
	'dec2014 viking boots': 30587,
	'dec2014 heavy_parka': 30588,
	'dec2014 the big papa': 30589,
	'dec2014 engineer_detectiveholster': 30590,
	'dec2014 engineer_detectiveradio': 30591,
	'dec2014 engineer_detectiveglasses': 30592,
	'dec2014 engineer_seal': 30593,
	'dec2014 medic_unknown_mann': 30595,
	'dec2014 surgeon\'s shako': 30596,
	'dec2014 hunter_beard': 30597,
	'dec2014 hunter_ushanka': 30598,
	'dec2014 hunter_vest': 30599,
	'dec2014 wally pocket': 30600,
	eotl_winter_coat: 30601,
	'dec2014 the puffy provocateur': 30602,
	'dec2014 stealthy scarf': 30603,
	'dec2014 comforter': 30604,
	'dec2014 thermal insulation layer': 30605,
	'dec2014 pocket momma': 30606,
	'pocket raiders': 30607,
	'taunt: the killer solo': 30609,
	'taunt: most wanted': 30614,
	'taunt: the boxtrot': 30615,
	'taunt: the proletariat showoff': 30616,
	'taunt: bucking bronco': 30618,
	'taunt: burstchester': 30621,
	'rotation sensation': 30623,
	'physician\'s protector': 30625,
	'vascular vestment': 30626,
	'bruce\'s bonnet': 30627,
	'outta\' sight': 30628,
	'support spurs': 30629,
	'lurker\'s leathers': 30631,
	'commissar\'s coat': 30633,
	'sheriff\'s stetson': 30634,
	'wild west waistcoat': 30635,
	'fortunate son': 30636,
	'flak jack': 30637,
	'captain cardbeard cutthroat': 30640,
	'potassium bonnett': 30643,
	'white russian': 30644,
	'el duderino': 30645,
	'captain space mann': 30646,
	phononaut: 30647,
	'corona australis': 30648,
	'final frontiersman': 30649,
	starduster: 30650,
	graylien: 30651,
	'phobos filter': 30652,
	'sucker slug': 30653,
	'life support system': 30654,
	'rocket operator': 30655,
	'universal translator': 30658,
	'cadet visor': 30661,
	'a head full of hot air': 30662,
	'jupiter jetpack': 30663,
	'space diver': 30664,
	'shooting star': 30665,
	'c.a.p.p.e.r': 30666,
	batsaber: 30667,
	'giger counter': 30668,
	'space hamster hammy': 30669,
	'taunt: true scotsman\'s call': 30671,
	'taunt: zoomin\' broom': 30672,
	'taunt: soldier\'s requiem': 30673,
	roboot: 30675,
	'face of mercy': 30676,
	'el caballero': 30680,
	'el patron': 30681,
	'smokey sombrero': 30682,
	'neptune\'s nightmare': 30684,
	'thrilling tracksuit': 30685,
	'death racer\'s helmet': 30686,
	'grim tweeter': 30693,
	'iron lung': 30698,
	'duck billed hatypus': 30700,
	'prehistoric pullover': 30704,
	'catastrophic companions': 30706,
	'dead\'er alive': 30707,
	hellmet: 30708,
	'crusader\'s getup': 30716,
	'arthropod\'s aspect': 30717,
	'b\'aaarrgh-n-bicorne': 30718,
	'b\'aaarrgh-n-britches': 30719,
	'arkham cowl': 30720,
	firefly: 30721,
	'batter\'s bracers': 30722,
	'hood of sorrows': 30723,
	'fear monger': 30724,
	'pocket villains': 30726,
	'caped crusader': 30727,
	buttler: 30728,
	'teufort knight': 30733,
	'sidekick\'s side slick': 30735,
	'bat backup': 30736,
	'crook combatant': 30737,
	batbelt: 30738,
	'promo fear monger': 30739,
	'promo arkham cowl': 30740,
	'promo the firefly': 30741,
	'shin shredders': 30742,
	'patriot peak': 30743,
	diplomat: 30744,
	'siberian sweater': 30745,
	'a well wrapped hat': 30746,
	'gift bringer': 30747,
	'chill chullo': 30748,
	'winter backup': 30749,
	'medical monarch': 30750,
	'bonk batter\'s backup': 30751,
	'chicago overcoat': 30752,
	'a hat to kill for': 30753,
	'hot heels': 30754,
	'berlin brain bowl': 30755,
	'bunnyhopper\'s ballistics vest': 30756,
	'taunt: the fubar fanfare': 30761,
	'taunt: disco fever': 30762,
	'taunt: the balloonibouncer': 30763,
	airdog: 30767,
	'bedouin bandana': 30768,
	'herald\'s helm': 30769,
	'courtly cuirass': 30770,
	'squire\'s sabatons': 30771,
	'surgical survivalist': 30773,
	'dead head': 30775,
	'lurking legionnaire': 30777,
	dayjogger: 30779,
	'patriot\'s pouches': 30780,
	'dad duds': 30785,
	'gauzed gaze': 30786,
	'demo\'s dustcatcher': 30788,
	'scoped spartan': 30789,
	'colossal cranium': 30792,
	'aerobatics demonstrator': 30793,
	'final frontier freighter': 30794,
	'hovering hotshot': 30795,
	'toadstool topper': 30796,
	showstopper: 30797,
	'big topper': 30798,
	'combustible cutie': 30799,
	'cranial carcharodon': 30800,
	spooktacles: 30801,
	'heavy tourism': 30803,
	'el paso poncho': 30804,
	'wide-brimmed bandito': 30805,
	'corpus christi cranium': 30806,
	'spirit of the bombing past': 30807,
	'class crown': 30808,
	'wing mann': 30809,
	'nasty norsemann': 30810,
	'pestering jester': 30811,
	'mo\'horn': 30812,
	'surgeon\'s sidearms': 30813,
	'lil\' bitey': 30814,
	'mad mask': 30815,
	'taunt: second rate sorcery': 30816,
	'burly beast': 30817,
	'safe n\' sound': 178,
	bootle: 191,
	'pipe bomb launcher': 206,
	flamethrower: 208,
	medigun: 211,
	schadenfreude: 463,
	'max\'s servered head': 162,
	'creepy crawly case': 5861,
	'ze \xE3\x9Cbermensch': 30410,
	'night owl': 15000,
	'woodsy widowmaker': 15001,
	'night terror': 15002,
	'backwoods boomstick': 15003,
	'king of the jungle': 15004,
	'forest fire': 15005,
	'woodland warrior': 15006,
	'purple range': 15007,
	'masked mender': 15008,
	'sudden flurry': 15009,
	'wrapped reviver': 15010,
	'psychedelic slugger': 15011,
	'carpet bomber': 15012,
	'red rock roscoe': 15013,
	'sand cannon': 15014,
	'tartan torpedo': 15015,
	'rustic ruiner': 15016,
	'barn burner': 15017,
	'homemade heater': 15018,
	'lumber from down under': 15019,
	'iron wood': 15020,
	'country crusher': 15021,
	'plaid potshotter': 15022,
	'shot in the dark': 15023,
	'blasted bombardier': 15024,
	'reclaimed reanimator': 15025,
	'antique annihilator': 15026,
	'old country': 15027,
	'american pastoral': 15028,
	'backcountry blaster': 15029,
	'bovine blazemaker': 15030,
	'war room': 15031,
	'treadplate tormenter': 15032,
	bogtrotter: 15033,
	'earth, sky and fire': 15034,
	'hickory hole-puncher': 15035,
	'spruce deuce': 15036,
	'team sprayer': 15037,
	'rooftop wrangler': 15038,
	'civil servant': 15039,
	'citizen pain': 15040,
	'local hero': 15041,
	mayor: 15042,
	'smalltown bringdown': 15043,
	'civic duty': 15044,
	'liquid asset': 15045,
	'black dahlia': 15046,
	'lightning rod': 15047,
	'pink elephant': 15048,
	'flash fryer': 15049,
	'spark of life': 15050,
	'dead reckoner': 15051,
	'shell shocker': 15052,
	'current event': 15053,
	'turbine torcher': 15054,
	'brick house': 15055,
	'sandstone special': 15056,
	'aqua marine': 15057,
	'low profile': 15058,
	thunderbolt: 15059,
	'macabre web pistol': 15060,
	'nutcracker pistol': 15061,
	'boneyard revolver': 15062,
	'wildwood revolver': 15063,
	'macabre web revolver': 15064,
	'macabre web scattergun': 15065,
	'autumn flame thrower': 15066,
	'pumpkin patch flame thrower': 15067,
	'nutcracker flame thrower': 15068,
	'nutcracker scattergun': 15069,
	'pumpkin patch sniper rifle': 15070,
	'boneyard sniper rifle': 15071,
	'wildwood sniper rifle': 15072,
	'nutcracker wrench': 15073,
	'autumn wrench': 15074,
	'boneyard wrench': 15075,
	'wildwood smg': 15076,
	'autumn grenade launcher': 15077,
	'wildwood medi gun': 15078,
	'macabre web grenade launcher': 15079,
	'boneyard knife': 15080,
	'autumn rocket launcher': 15081,
	'autumn stickybomb launcher': 15082,
	'pumpkin patch stickybomb launcher': 15083,
	'macabre web stickybomb launcher': 15084,
	'autumn shotgun': 15085,
	'macabre web minigun': 15086,
	'pumpkin patch minigun': 15087,
	'nutcracker minigun': 15088,
	'balloonicorn flame thrower': 15089,
	'rainbow flame thrower': 15090,
	'rainbow grenade launcher': 15091,
	'sweet dreams grenade launcher': 15092,
	'blue mew knife': 15094,
	'brain candy knife': 15095,
	'stabbed to hell knife': 15096,
	'flower power medi gun': 15097,
	'brain candy minigun': 15098,
	'mister cuddles minigun': 15099,
	'blue mew pistol': 15100,
	'brain candy pistol': 15101,
	'shot to hell pistol': 15102,
	'flower power revolver': 15103,
	'blue mew rocket launcher': 15104,
	'brain candy rocket launcher': 15105,
	'blue mew scattergun': 15106,
	'flower power scattergun': 15107,
	'shot to hell scattergun': 15108,
	'flower power shotgun': 15109,
	'blue mew smg': 15110,
	'balloonicorn sniper rifle': 15111,
	'rainbow sniper rifle': 15112,
	'sweet dreams stickybomb launcher': 15113,
	'torqued to hell wrench': 15114,
	'coffin nail flame thrower': 15115,
	'coffin nail grenade launcher': 15116,
	'top shelf grenade launcher': 15117,
	'dressed to kill knife': 15118,
	'top shelf knife': 15119,
	'coffin nail medi gun': 15120,
	'dressed to kill medi gun': 15121,
	'high roller\'s medi gun': 15122,
	'coffin nail minigun': 15123,
	'dressed to kill minigun': 15124,
	'top shelf minigun': 15125,
	'dressed to kill pistol': 15126,
	'coffin nail revolver': 15127,
	'top shelf revolver': 15128,
	'coffin nail rocket launcher': 15129,
	'high roller\'s rocket launcher': 15130,
	'coffin nail scattergun': 15131,
	'coffin nail shotgun': 15132,
	'dressed to kill shotgun': 15133,
	'high roller\'s smg': 15134,
	'coffin nail sniper rifle': 15135,
	'dressed to kill sniper rifle': 15136,
	'coffin nail stickybomb launcher': 15137,
	'dressed to kill stickybomb launcher': 15138,
	'dressed to kill wrench': 15139,
	'top shelf wrench': 15140,
	'warhawk flame thrower': 15141,
	'warhawk grenade launcher': 15142,
	'blitzkrieg knife': 15143,
	'airwolf knife': 15144,
	'blitzkrieg medi gun': 15145,
	'corsair medi gun': 15146,
	'butcher bird minigun': 15147,
	'blitzkrieg pistol': 15148,
	'blitzkrieg revolver': 15149,
	'warhawk rocket launcher': 15150,
	'killer bee scattergun': 15151,
	'red bear shotgun': 15152,
	'blitzkrieg smg': 15153,
	'airwolf sniper rifle': 15154,
	'blitzkrieg stickybomb launcher': 15155,
	'airwolf wrench': 15156,
	'corsair scattergun': 15157,
	'butcher bird grenade launcher': 15158
});

window.itemNameMapping = ({
	bat: 190,
	bottle: 191,
	'fire axe': 192,
	kukri: 193,
	knife: 194,
	fists: 195,
	shovel: 196,
	wrench: 197,
	bonesaw: 198,
	shotgun: 199,
	scattergun: 200,
	'sniper rifle': 201,
	minigun: 202,
	smg: 203,
	'syringe gun': 204,
	'rocket launcher': 205,
	'grenade launcher': 206,
	'stickybomb launcher': 207,
	'flame thrower': 208,
	pistol: 209,
	revolver: 210,
	'construction pda': 737,
	'destruction pda': 26,
	'disguise kit': 27,
	pda: 28,
	'medi gun': 211,
	'invis watch': 212,
	kritzkrieg: 35,
	blutsauger: 36,
	ubersaw: 37,
	axtinguisher: 38,
	'flare gun': 39,
	backburner: 40,
	natascha: 41,
	sandvich: 42,
	'killing gloves of boxing': 43,
	sandman: 44,
	'force-a-nature': 45,
	'bonk! atomic punch': 46,
	'demoman\'s fro': 47,
	'mining light': 48,
	'football helmet': 49,
	'prussian pickelhaube': 50,
	'pyro\'s beanie': 51,
	'batter\'s helmet': 52,
	'trophy belt': 53,
	'soldier\'s stash': 54,
	'fancy fedora': 55,
	huntsman: 56,
	razorback: 57,
	jarate: 58,
	'dead ringer': 59,
	'cloak and dagger': 60,
	ambassador: 61,
	'texas ten gallon': 94,
	'engineer\'s cap': 95,
	'officer\'s ushanka': 96,
	'tough guy\'s toque': 97,
	'stainless pot': 98,
	'tyrant\'s helm': 99,
	'glengarry bonnet': 100,
	'vintage tyrolean': 101,
	'respectless rubber glove': 102,
	'camera beard': 103,
	'otolaryngologist\'s mirror': 104,
	'brigade helm': 105,
	'bonk helm': 106,
	'ye olde baker boy': 107,
	'backbiter\'s billycock': 108,
	'professional\'s panama': 109,
	'master\'s yellow belt': 110,
	'baseball bill\'s sports shine': 111,
	'ghastlierest gibus': 116,
	'ritzy rick\'s hair fixative': 117,
	'texas slim\'s dome shine': 118,
	'scotsman\'s stove pipe': 120,
	'gentle manne\'s service medal': 121,
	'bill\'s hat': 126,
	'direct hit': 127,
	equalizer: 128,
	'buff banner': 129,
	'scottish resistance': 130,
	'chargin\' targe': 131,
	eyelander: 132,
	gunboats: 133,
	'towering pillar of hats': 135,
	'noble amassment of hats': 137,
	'modest pile of hat': 139,
	wrangler: 140,
	'frontier justice': 141,
	gunslinger: 142,
	earbuds: 143,
	'physician\'s procedure mask': 144,
	'hound dog': 145,
	'hustler\'s hallmark': 146,
	'magistrate\'s mullet': 147,
	hotrod: 148,
	'troublemaker\'s tossle cap': 150,
	'triboniophorus tyrannus': 151,
	'killer\'s kabuto': 152,
	homewrecker: 153,
	'pain train': 154,
	'southern hospitality': 155,
	'shooter\'s sola topi': 158,
	'dalokohs bar': 159,
	lugermorph: 294,
	'big kill': 161,
	'max\'s severed head': 162,
	'crit-a-cola': 163,
	'taunt: the high five!': 167,
	'tribalman\'s shiv': 171,
	'scotsman\'s skullcutter': 172,
	'vita-saw': 173,
	'whoopee cap': 174,
	'whiskered gentleman': 175,
	'ze goggles': 177,
	'safe\'n\'sound': 178,
	'tippler\'s tricorne': 179,
	'frenchman\'s beret': 180,
	'bloke\'s bucket hat': 181,
	'vintage merryweather': 182,
	'sergeant\'s drill hat': 183,
	'gentleman\'s gatsby': 184,
	'heavy duty rag': 185,
	'alien swarm parasite': 189,
	attendant: 213,
	powerjack: 214,
	degreaser: 215,
	'rimmed raincatcher': 216,
	milkman: 219,
	shortstop: 220,
	'holy mackerel': 221,
	'mad milk': 222,
	'familiar fez': 223,
	'l\'etranger': 224,
	'your eternal reward': 225,
	'battalion\'s backup': 226,
	'grenadier\'s softcap': 227,
	'black box': 228,
	'ol\' snaggletooth': 229,
	'sydney sleeper': 230,
	'darwin\'s danger shield': 231,
	bushwacka: 232,
	'secret saxton': 233,
	'pile o\' gifts': 234,
	'rocket jumper': 237,
	'gloves of running urgently': 239,
	'lumbricus lid': 240,
	'dueling mini-game': 241,
	'pugilist\'s protector': 246,
	'old guadalajara': 247,
	'napper\'s respite': 248,
	'bombing run': 249,
	'chieftain\'s challenge': 250,
	'stout shako': 251,
	'dr\'s dapper topper': 252,
	'handyman\'s handle': 253,
	'hard counter': 254,
	'sober stuntman': 255,
	'carouser\'s capotain': 259,
	'wiki cap': 260,
	'ellis\' cap': 263,
	'frying pan': 264,
	'sticky jumper': 265,
	'horseless headless horsemann\'s headtaker': 266,
	'haunted metal scrap': 267,
	'scout mask': 268,
	'sniper mask': 269,
	'soldier mask': 270,
	'demoman mask': 271,
	'medic mask': 272,
	'heavy mask': 273,
	'spy mask': 274,
	'engineer mask': 275,
	'pyro mask': 276,
	'saxton hale mask': 277,
	'horseless headless horsemann\'s head': 278,
	'noise maker - black cat': 280,
	'noise maker - gremlin': 281,
	'noise maker - werewolf': 282,
	'noise maker - witch': 283,
	'noise maker - banshee': 284,
	'noise maker - crazy laugh': 286,
	'spine-chilling skull': 287,
	'noise maker - stabby': 288,
	'voodoo juju': 289,
	'cadaver\'s cranium': 290,
	'horrific headsplitter': 291,
	'dealer\'s visor': 292,
	'dangeresque, too?': 295,
	'license to maim': 296,
	'companion cube pin': 299,
	'frontline field recorder': 302,
	'berliner\'s bucket helm': 303,
	amputator: 304,
	'crusader\'s crossbow': 305,
	'scotch bonnet': 306,
	'ullapool caber': 307,
	'loch-n-load': 308,
	'big chief': 309,
	'warrior\'s spirit': 310,
	'buffalo steak sandvich': 311,
	'brass beast': 312,
	'magnificent mongolian': 313,
	'larrikin robin': 314,
	'blighted beak': 315,
	'pyromancer\'s mask': 316,
	'candy cane': 317,
	'prancer\'s pride': 318,
	'd\xE9tective noir': 319,
	'madame dixie': 321,
	'buckaroos hat': 322,
	'german gonzila': 323,
	'flipped trilby': 324,
	'boston basher': 325,
	'back scratcher': 326,
	'claidheamh m\xF2r': 327,
	jag: 329,
	'coupe d\'isaster': 330,
	'fists of steel': 331,
	'bounty hat': 332,
	'treasure hat': 333,
	'hat of undeniable wealth and respect': 334,
	'foster\'s facade': 335,
	'stockbroker\'s scarf': 336,
	'le party phantom': 337,
	'industrial festivizer': 338,
	'exquisite rack': 339,
	'defiant spartan': 340,
	'a rather festive tree': 341,
	'prince tavish\'s crown': 342,
	'crocleather slouch': 344,
	'athletic supporter': 345,
	superfan: 346,
	'essential accessories': 347,
	'sharpened volcano fragment': 348,
	'sun-on-a-stick': 349,
	detonator: 351,
	concheror: 354,
	'fan o\'war': 355,
	'conniver\'s kunai': 356,
	'half-zatoichi': 357,
	'dread knot': 358,
	'samur-eye': 359,
	'hero\'s hachimaki': 360,
	'noh mercy': 361,
	'geisha boy': 363,
	'noise maker - koto': 365,
	'hottie\'s hoodie': 377,
	'team captain': 378,
	'western wear': 379,
	'large luchadore': 380,
	'medic\'s mountain cap': 381,
	'big country': 382,
	'grimm hatte': 383,
	'professor\'s peculiarity': 384,
	'teddy roosebelt': 386,
	'sight for sore eyes': 387,
	'private eye': 388,
	'googly gazer': 389,
	reggaelator: 390,
	'honcho\'s headgear': 391,
	'pocket medic': 392,
	'villain\'s veil': 393,
	'connoisseur\'s cap': 394,
	'furious fukaamigasa': 395,
	'charmer\'s chapeau': 397,
	'doctor\'s sack': 398,
	'ol\' geezer': 399,
	'desert marauder': 400,
	shahanshah: 401,
	'bazaar bargain': 402,
	'sultan\'s ceremonial': 403,
	'persian persuader': 404,
	'ali baba\'s wee booties': 405,
	'splendid screen': 406,
	'quick-fix': 411,
	overdose: 412,
	'solemn vow': 413,
	'liberty launcher': 414,
	'reserve shooter': 415,
	'market gardener': 416,
	'jumper\'s jeepcap': 417,
	'aperture labs hard hat': 420,
	'resurrection associate pin': 422,
	tomislav: 424,
	'family business': 425,
	'eviction notice': 426,
	'capo\'s capper': 427,
	'moustachium bar': 429,
	'\'fish\'': 430,
	'spacemetal scrap': 431,
	'spacechem pin': 432,
	fishcake: 433,
	'brain bucket': 434,
	'dead cone': 435,
	'hetman\'s headpiece': 436,
	'janissary ketche': 437,
	'taunt: the director\'s vision': 438,
	'lord cockswain\'s pith helmet': 439,
	'lord cockswain\'s novelty mutton chops and pipe': 440,
	'cow mangler 5000': 441,
	'righteous bison': 442,
	'dr. grordbort\'s crest': 443,
	mantreads: 444,
	'armored authority': 445,
	'fancy dress uniform': 446,
	'disciplinary action': 447,
	'soda popper': 448,
	winger: 449,
	atomizer: 450,
	'bonk boy': 451,
	'three-rune blade': 452,
	'hero\'s tail': 453,
	'sign of the wolf\'s school': 454,
	'postal pummeler': 457,
	'cosa nostra cap': 459,
	enforcer: 460,
	'big earner': 461,
	'made man': 462,
	'taunt: the schadenfreude': 463,
	'conjurer\'s cowl': 465,
	maul: 466,
	'planeswalker helm': 467,
	'planeswalker goggles': 468,
	'team fortress 2 - upgrade to premium': 472,
	'spiral sallet': 473,
	'conscientious objector': 474,
	'taunt: the meet the medic': 477,
	'copper\'s hard top': 478,
	'security shades': 479,
	'tam o\' shanter': 480,
	'stately steel toe': 481,
	'nessie\'s nine iron': 482,
	'rogue\'s col roule': 483,
	'prairie heel biters': 484,
	'big steel jaw of summer fun': 485,
	'summer shades': 486,
	'power up canteen': 1163,
	'flip-flops': 490,
	'lucky no. 42': 491,
	'summer hat': 492,
	'noise maker - fireworks': 493,
	original: 513,
	'mask of the shaman': 514,
	pilotka: 515,
	stahlhelm: 516,
	'dragonborn helmet': 517,
	anger: 518,
	'pip-boy': 519,
	wingstick: 520,
	nanobalaclava: 521,
	'deus specs': 522,
	'company man': 523,
	'purity fist': 524,
	diamondback: 525,
	machina: 526,
	widowmaker: 527,
	'short circuit': 528,
	'killer exclusive': 538,
	'el jefe': 539,
	'ball-kicking boots': 540,
	'merc\'s pride scarf': 541,
	'noise maker - vuvuzela': 542,
	'hair of the dog': 543,
	'scottish snarl': 544,
	'pickled paws': 545,
	'wrap battler': 546,
	'b-ankh!': 547,
	futankhamun: 548,
	'blazing bull': 549,
	'fallen angel': 550,
	'tail from the crypt': 551,
	einstein: 552,
	'dr. gogglestache': 553,
	'emerald jarate': 554,
	'idiot box': 555,
	'steel pipes': 556,
	'shoestring budget': 557,
	'under cover': 558,
	'griffin\'s gog': 559,
	'intangible ascot': 560,
	'can opener': 561,
	'soviet stitch-up': 562,
	'steel-toed stompers': 563,
	'holy hunter': 564,
	'silver bullets': 565,
	'garlic flank stake': 566,
	'buzz killer': 567,
	'frontier flyboy': 568,
	'legend of bugfoot': 569,
	'last breath': 570,
	'apparition\'s aspect': 571,
	'unarmed combat': 572,
	'wanga prick': 574,
	'infernal impaler': 575,
	'spine-chilling skull 2011': 576,
	'spine-tingling skull': 578,
	'spine-cooling skull': 579,
	'spine-twisting skull': 580,
	'monoculus!': 581,
	bombinomicon: 583,
	'cold war luchador': 585,
	'mark of the saint': 586,
	'apoco-fists': 587,
	'pomson 6000': 588,
	'eureka effect': 589,
	'brainiac hairpiece': 590,
	'brainiac goggles': 591,
	'dr. grordbort\'s copper crest': 592,
	'third degree': 593,
	phlogistinator: 594,
	manmelter: 595,
	'moonman backpack': 596,
	'bubble pipe': 597,
	'manniversary paper hat': 598,
	'manniversary package': 599,
	'your worst nightmare': 600,
	'one-man army': 601,
	'counterfeit billycock': 602,
	outdoorsman: 603,
	'tavish degroot experience': 604,
	'pencil pusher': 605,
	'builder\'s blueprints': 606,
	'buccaneer\'s bicorne': 607,
	bootlegger: 608,
	'scottish handshake': 609,
	'a whiff of the old brimstone': 610,
	'salty dog': 611,
	'little buddy': 612,
	'gym rat': 613,
	'hot dogger': 614,
	birdcage: 615,
	'surgeon\'s stahlhelm': 616,
	'backwards ballcap': 617,
	'crocodile smile': 618,
	'flair!': 619,
	'couvre corner': 620,
	'surgeon\'s stethoscope': 621,
	'l\'inspecteur': 622,
	'photo badge': 623,
	'clan pride': 625,
	'swagman\'s swatter': 626,
	'flamboyant flamenco': 627,
	'virtual reality headset': 628,
	'spectre\'s spectacles': 629,
	'stereoscopic shades': 630,
	'hat with no name': 631,
	'cremator\'s conscience': 632,
	hermes: 633,
	'point and shoot': 634,
	'war head': 635,
	'dr. grordbort\'s silver crest': 636,
	'dashin\' hashshashin': 637,
	'sharp dresser': 638,
	'dr. whoa': 639,
	'ornament armament': 641,
	'cozy camper': 642,
	'sandvich safe': 643,
	'head warmer': 644,
	'outback intellectual': 645,
	'itsy bitsy spyer': 646,
	'all-father': 647,
	'wrap assassin': 648,
	'spy-cicle': 649,
	'kringle collection': 650,
	'jingle belt': 651,
	'big elfin deal': 652,
	'bootie time': 653,
	'festive minigun': 654,
	'holiday punch': 656,
	'nine-pipe problem': 657,
	'festive rocket launcher': 658,
	'festive flame thrower': 659,
	'festive bat': 660,
	'festive stickybomb launcher': 661,
	'festive wrench': 662,
	'festive medi gun': 663,
	'festive sniper rifle': 664,
	'festive knife': 665,
	'b.m.o.c.': 666,
	'holiday headcase': 667,
	'full head of steam': 668,
	'festive scattergun': 669,
	'stocking stuffer': 670,
	'brown bomber': 671,
	'noise maker - winter holiday': 673,
	ebenezer: 675,
	'lucky shot': 701,
	'warsworn helmet': 702,
	bolgan: 703,
	'bolgan family crest': 704,
	'boston boom-bringer': 707,
	'aladdin\'s private reserve': 708,
	'snapped pupil': 709,
	'merc medal': 718,
	'battle bob': 719,
	'bushman\'s boonie': 720,
	conquistador: 721,
	'fast learner': 722,
	'tour of duty ticket': 725,
	'black rose': 727,
	'mann co. store package': 839,
	'beggar\'s bazooka': 730,
	'captain\'s cocktails': 731,
	'helmet without a home': 732,
	'robro 3000': 733,
	'teufort tooth kicker': 734,
	sapper: 736,
	balloonicorn: 738,
	lollichop: 739,
	'scorch shot': 740,
	rainblower: 741,
	'pyrovision goggles': 744,
	'infernal orchestrina': 745,
	'burning bongos': 746,
	'cleaner\'s carbine': 751,
	'hitman\'s heatmaker': 752,
	'waxy wayfinder': 753,
	'scrap pack': 754,
	'texas half-pants': 755,
	'bolt action blitzer': 756,
	'toss-proof towel': 757,
	'squad surplus voucher': 758,
	'fruit shoot': 759,
	'front runner': 760,
	'sneaky spats of sneaking': 763,
	'cross-comm crash helmet': 764,
	'cross-comm express': 765,
	'doublecross-comm': 766,
	'atomic accolade': 767,
	'professor\'s pineapple': 768,
	quadwrangler: 769,
	'surgeon\'s side satchel': 770,
	'liquor locker': 771,
	'baby face\'s blaster': 772,
	'pretty boy\'s pocket pistol': 773,
	'gentle munitionne of leisure': 774,
	'escape plan': 775,
	'bird-man of aberdeen': 776,
	'apparatchik\'s apparel': 777,
	'gentleman\'s ushanka': 778,
	'liquidator\'s lid': 779,
	'fed-fightin\' fedora': 780,
	'dillinger\'s duffel': 781,
	'business casual': 782,
	'hazmat headcase': 783,
	'idea tube': 784,
	'robot chicken hat': 785,
	'grenadier helm': 786,
	'tribal bones': 787,
	'void monk hair': 788,
	'ninja cowl': 789,
	'what\'s in the sandvich box?': 790,
	'what\'s in the companion square box?': 791,
	'silver botkiller sniper rifle mk.i': 792,
	'silver botkiller minigun mk.i': 793,
	'silver botkiller knife mk.i': 794,
	'silver botkiller wrench mk.i': 795,
	'silver botkiller medi gun mk.i': 796,
	'silver botkiller stickybomb launcher mk.i': 797,
	'silver botkiller flame thrower mk.i': 798,
	'silver botkiller scattergun mk.i': 799,
	'silver botkiller rocket launcher mk.i': 800,
	'gold botkiller sniper rifle mk.i': 801,
	'gold botkiller minigun mk.i': 802,
	'gold botkiller knife mk.i': 803,
	'gold botkiller wrench mk.i': 804,
	'gold botkiller medi gun mk.i': 805,
	'gold botkiller stickybomb launcher mk.i': 806,
	'gold botkiller flame thrower mk.i': 807,
	'gold botkiller scattergun mk.i': 808,
	'gold botkiller rocket launcher mk.i': 809,
	'red-tape recorder': 831,
	'huo-long heater': 832,
	'flying guillotine': 833,
	'neon annihilator': 834,
	'triad trinket': 835,
	'champ stamp': 836,
	marxman: 837,
	'human cannonball': 838,
	'awesomenauts badge': 818,
	'lone star': 819,
	'russian rocketeer': 820,
	'soviet gentleman': 821,
	'pocket purrer': 823,
	'koala compact': 824,
	'hat of cards': 825,
	'medi-mask': 826,
	'track terrorizer': 827,
	archimedes: 828,
	'war pig': 829,
	'bearded bombardier': 830,
	'u-clank-a': 840,
	'stealth steeler': 841,
	'pyrobotics pack': 842,
	'medic mech-bag': 843,
	'tin pot': 844,
	'battery bandolier': 845,
	'robot running man': 846,
	'bolted bushman': 847,
	'tin-1000': 848,
	deflector: 850,
	'awper hand': 851,
	'soldier\'s stogie': 852,
	'crafty hair': 853,
	'area 451': 854,
	'vigilant pin': 855,
	'pyrotechnic tote': 856,
	flunkyware: 857,
	'hanger-on hood': 858,
	'flight of the monarch': 859,
	'robo-sandvich': 863,
	'friends forever companion square badge': 864,
	'triple a badge': 865,
	'heavy artillery officer\'s cap': 866,
	'combat medic\'s crusher cap': 867,
	'heroic companion badge': 868,
	'rump-o\'-lantern': 869,
	'lacking moral fiber mask': 872,
	'whale bone charm': 873,
	'king of scotland cape': 874,
	menpo: 875,
	'k-9 mane': 876,
	'stovepipe sniper shako': 877,
	'foppish physician': 878,
	'distinguished rogue': 879,
	'freedom staff': 880,
	'rust botkiller sniper rifle mk.i': 881,
	'rust botkiller minigun mk.i': 882,
	'rust botkiller knife mk.i': 883,
	'rust botkiller wrench mk.i': 884,
	'rust botkiller medi gun mk.i': 885,
	'rust botkiller stickybomb launcher mk.i': 886,
	'rust botkiller flame thrower mk.i': 887,
	'rust botkiller scattergun mk.i': 888,
	'rust botkiller rocket launcher mk.i': 889,
	'blood botkiller sniper rifle mk.i': 890,
	'blood botkiller minigun mk.i': 891,
	'blood botkiller knife mk.i': 892,
	'blood botkiller wrench mk.i': 893,
	'blood botkiller medi gun mk.i': 894,
	'blood botkiller stickybomb launcher mk.i': 895,
	'blood botkiller flame thrower mk.i': 896,
	'blood botkiller scattergun mk.i': 897,
	'blood botkiller rocket launcher mk.i': 898,
	'carbonado botkiller sniper rifle mk.i': 899,
	'carbonado botkiller minigun mk.i': 900,
	'carbonado botkiller knife mk.i': 901,
	'carbonado botkiller wrench mk.i': 902,
	'carbonado botkiller medi gun mk.i': 903,
	'carbonado botkiller stickybomb launcher mk.i': 904,
	'carbonado botkiller flame thrower mk.i': 905,
	'carbonado botkiller scattergun mk.i': 906,
	'carbonado botkiller rocket launcher mk.i': 907,
	'diamond botkiller sniper rifle mk.i': 908,
	'diamond botkiller minigun mk.i': 909,
	'diamond botkiller knife mk.i': 910,
	'diamond botkiller wrench mk.i': 911,
	'diamond botkiller medi gun mk.i': 912,
	'diamond botkiller stickybomb launcher mk.i': 913,
	'diamond botkiller flame thrower mk.i': 914,
	'diamond botkiller scattergun mk.i': 915,
	'diamond botkiller rocket launcher mk.i': 916,
	'sir hootsalot': 917,
	'master mind': 918,
	scarecrow: 919,
	'crone\'s dome': 920,
	executioner: 921,
	bonedolier: 922,
	plutonidome: 923,
	'spooky shoes': 924,
	'spooky sleeves': 925,
	zipperface: 926,
	'boo balloon': 927,
	'what\'s in the portal 2 soundtrack box?': 928,
	'unknown monkeynaut': 929,
	'grand duchess tutu': 930,
	'grand duchess fairy wings': 931,
	'grand duchess tiara': 932,
	'ap-sap': 933,
	'dead little buddy': 934,
	'voodoo juju (slight return)': 935,
	exorcizor: 936,
	'wraith wrap': 937,
	'coffin kit': 938,
	'bat outta hell': 939,
	'skull island topper': 941,
	cockfighter: 942,
	'hitt mann badge': 943,
	'that \'70s chapeau': 944,
	'chief constable': 945,
	'siberian sophisticate': 946,
	quäckenbirdt: 947,
	'deadliest duckling': 948,
	dethkapp: 949,
	'nose candy': 950,
	'rail spikes': 951,
	'brock\'s locks': 952,
	tuxxy: 955,
	'faerie solitaire pin': 956,
	'silver botkiller sniper rifle mk.ii': 957,
	'silver botkiller minigun mk.ii': 958,
	'silver botkiller knife mk.ii': 959,
	'silver botkiller wrench mk.ii': 960,
	'silver botkiller medi gun mk.ii': 961,
	'silver botkiller stickybomb launcher mk.ii': 962,
	'silver botkiller flame thrower mk.ii': 963,
	'silver botkiller scattergun mk.ii': 964,
	'silver botkiller rocket launcher mk.ii': 965,
	'gold botkiller sniper rifle mk.ii': 966,
	'gold botkiller minigun mk.ii': 967,
	'gold botkiller knife mk.ii': 968,
	'gold botkiller wrench mk.ii': 969,
	'gold botkiller medi gun mk.ii': 970,
	'gold botkiller stickybomb launcher mk.ii': 971,
	'gold botkiller flame thrower mk.ii': 972,
	'gold botkiller scattergun mk.ii': 973,
	'gold botkiller rocket launcher mk.ii': 974,
	'winter wonderland wrap': 976,
	'cut throat concierge': 977,
	'der wintermantel': 978,
	'cool breeze': 979,
	'soldier\'s slope scopers': 980,
	'cold killer': 981,
	'doc\'s holiday': 982,
	'digit divulger': 983,
	'tough stuff muffs': 984,
	'heavy\'s hockey hair': 985,
	'mutton mann': 986,
	'merc\'s muffler': 987,
	barnstormer: 988,
	carl: 989,
	'aqua flops': 990,
	'hunger force': 991,
	'smissmas wreath': 992,
	antlers: 993,
	reindoonicorn: 995,
	'loose cannon': 996,
	'rescue ranger': 997,
	vaccinator: 998,
	'festive holy mackerel': 999,
	'festive axtinguisher': 1000,
	'festive buff banner': 1001,
	'festive sandvich': 1002,
	'festive ubersaw': 1003,
	'festive frontier justice': 1004,
	'festive huntsman': 1005,
	'festive ambassador': 1006,
	'festive grenade launcher': 1007,
	'prize plushy': 1008,
	'grizzled growth': 1009,
	'last straw': 1010,
	'wilson weave': 1012,
	'ham shank': 1013,
	'br\xFCtal bouffant': 1014,
	'shred alert': 1015,
	'buck turner all-stars': 1016,
	'vox diabolus': 1017,
	'pounding father': 1018,
	'blind justice': 1019,
	'person in the iron mask': 1020,
	'doe-boy': 1021,
	'sydney straw boat': 1022,
	'steel songbird': 1023,
	'croft\'s crest': 1024,
	'fortune hunter': 1025,
	'tomb wrapper': 1026,
	'mann co. painting set': 1027,
	'samson skewer': 1028,
	bloodhound: 1029,
	'dapper disguise': 1030,
	necronomicrown: 1031,
	'long fall loafers': 1032,
	'pallet of crates': 1037,
	'breather bag': 1038,
	'weather master': 1039,
	'bacteria blocker': 1040,
	grandmaster: 1067,
	'unfilled fancy spellbook': 1068,
	'fancy spellbook': 1069,
	'spellbook magazine': 1132,
	'golden frying pan': 1071,
	'portable smissmas spirit dispenser': 1072,
	'war on smissmas battle hood': 1073,
	'war on smissmas battle socks': 1074,
	'sack fulla smissmas': 1075,
	'smissmas caribou': 1076,
	'randolph the blood-nosed caribou': 1077,
	'festive force-a-nature': 1078,
	'festive crusader\'s crossbow': 1079,
	'festive sapper': 1080,
	'festive flare gun': 1081,
	'festive eyelander': 1082,
	'festive jarate': 1083,
	'festive gloves of running urgently': 1084,
	'festive black box': 1085,
	'festive wrangler': 1086,
	'der maschinensoldaten-helm': 1087,
	'die regime-panzerung': 1088,
	'mister bubbles': 1089,
	'big daddy': 1090,
	'first american': 1091,
	'fortified compound': 1092,
	'gilded guard': 1093,
	'criminal cloak': 1094,
	'dread hiding hood': 1095,
	'baronial badge': 1096,
	'little bear': 1097,
	classic: 1098,
	'tide turner': 1099,
	'bread bite': 1100,
	'b.a.s.e. jumper': 1101,
	'snack attack': 1102,
	'back scatter': 1103,
	'air strike': 1104,
	'self-aware beauty mark': 1105,
	'taunt: square dance': 1106,
	'taunt: flippin\' awesome': 1107,
	'taunt: buy a life': 1108,
	'taunt: results are in': 1109,
	'taunt: rock, paper, scissors': 1110,
	'taunt: skullcracker': 1111,
	'taunt: party trick': 1112,
	'taunt: fresh brewed victory': 1113,
	'taunt: spent well spirits': 1114,
	'taunt: rancho relaxo': 1115,
	'taunt: i see you': 1116,
	'taunt: battin\' a thousand': 1117,
	'taunt: conga': 1118,
	'taunt: deep fried desire': 1119,
	'taunt: oblooterated': 1120,
	'mutated milk': 1121,
	'towering pillar of summer shades': 1122,
	'necro smasher': 1123,
	nabler: 1124,
	'duck journal': 1126,
	'crossing guard': 1127,
	'powerup: strength': 1133,
	'powerup: haste': 1134,
	'powerup: regeneration': 1135,
	'powerup: resistance': 1136,
	'powerup: vampire': 1137,
	tf_powerup_warlock: 1138,
	'powerup: precision': 1139,
	'powerup: agility': 1140,
	'festive shotgun': 1141,
	'festive revolver': 1142,
	'festive bonesaw': 1143,
	'festive chargin\' targe': 1144,
	'festive bonk! atomic punch': 1145,
	'festive backburner': 1146,
	'festive smg': 1149,
	'quickiebomb launcher': 1150,
	'iron bomber': 1151,
	'grappling hook': 1152,
	'panic attack': 1153,
	'powerup: knockout': 1154,
	weapon_passtime_gun: 1155,
	'taunt: kazotsky kick': 1157,
	'powerup: king': 1159,
	'powerup: plague': 1160,
	'powerup: supernova': 1161,
	'taunt: mannrobics': 1162,
	'competitive matchmaking pass': 1167,
	'taunt: the carlton': 1168,
	'taunt: the victory lap': 1172,
	'map stamp - egypt': 1900,
	'map stamp - coldfront': 1901,
	'map stamp - fastlane': 1902,
	'map stamp - turbine': 1903,
	'map stamp - steel': 1904,
	'map stamp - junction': 1905,
	'map stamp - watchtower': 1906,
	'map stamp - hoodoo': 1907,
	'map stamp - offblast': 1908,
	'map stamp - yukon': 1909,
	'map stamp - harvest': 1910,
	'map stamp - freight': 1911,
	'map stamp - mountain lab': 1912,
	'map stamp - mann manor': 1913,
	'map stamp - nightfall': 1914,
	'map stamp - frontier': 1915,
	'map stamp - lakeside': 1916,
	'map stamp - gullywash': 1917,
	'map stamp - kong king': 1918,
	'map stamp - process': 1919,
	'map stamp - standin': 1920,
	'map stamp - snakewater': 1921,
	'map stamp - snowplow': 1922,
	'map stamp - borneo': 1923,
	'map stamp - suijin': 1924,
	'map stamp - 2fort invasion': 1925,
	'map stamp - probed': 1926,
	'map stamp - watergate': 1927,
	'map stamp - byre': 1928,
	'map stamp - gorge event': 1929,
	'map stamp - sinshine': 1930,
	'map stamp - moonshine event': 1931,
	'map stamp - hellstone': 1932,
	'map stamp - snowycoast': 1933,
	'map stamp - vanguard': 1934,
	'map stamp - landfall': 1935,
	'map stamp - highpass': 1936,
	'map stamp - sunshine': 1937,
	'map stamp - metalworks': 1938,
	'map stamp - swiftwater': 1939,
	'map stamp - maple ridge event': 1940,
	'map stamp - brimstone': 1941,
	'map stamp - pit of death': 1942,
	'name tag': 5020,
	'scrap metal': 5000,
	'reclaimed metal': 5001,
	'refined metal': 5002,
	'class token - scout': 5003,
	'class token - sniper': 5004,
	'class token - soldier': 5005,
	'class token - demoman': 5006,
	'class token - heavy': 5007,
	'class token - medic': 5008,
	'class token - pyro': 5009,
	'class token - spy': 5010,
	'class token - engineer': 5011,
	'slot token - primary': 5012,
	'slot token - secondary': 5013,
	'slot token - melee': 5014,
	'slot token - pda2': 5018,
	'mann co. supply crate key': 5792,
	'mann co. supply crate': 5045,
	'paint can': 5023,
	'decal tool': 5026,
	'indubitably green': 5027,
	'zepheniah\'s greed': 5028,
	'noble hatter\'s violet': 5029,
	'color no. 216-190-216': 5030,
	'a deep commitment to purple': 5031,
	'mann co. orange': 5032,
	muskelmannbraun: 5033,
	'peculiarly drab tincture': 5034,
	'radigan conagher brown': 5035,
	'ye olde rustic colour': 5036,
	'australium gold': 5037,
	'aged moustache grey': 5038,
	'an extraordinary abundance of tinge': 5039,
	'a distinctive lack of hue': 5040,
	'gift wrap': 5042,
	'a carefully wrapped gift': 5043,
	'description tag': 5044,
	'team spirit': 5046,
	'festive winter crate': 5048,
	'backpack expander': 5050,
	'pink as hell': 5051,
	'a color similar to slate': 5052,
	'drably olive': 5053,
	'bitter taste of defeat and lime': 5054,
	'color of a gentlemann\'s business pants': 5055,
	'dark salmon injustice': 5056,
	'operator\'s overalls': 5060,
	'waterlogged lab coat': 5061,
	'balaclavas are forever': 5062,
	'an air of debonair': 5063,
	'value of teamwork': 5064,
	'cream spirit': 5065,
	'refreshing summer cooler': 5066,
	'salvaged mann co. supply crate': 5068,
	'naughty winter crate': 5070,
	'nice winter crate': 5071,
	'a mann\'s mint': 5076,
	'after eight': 5077,
	'scorched crate': 5078,
	'fall crate': 5080,
	'upgrade to premium gift': 5082,
	giftapult: 5083,
	'loaded giftapult': 5084,
	'delivered giftapult package': 5085,
	'summer starter kit': 5086,
	'summer adventure pack': 5087,
	'rift well spun hat claim code': 5500,
	'roasted goldfish': 5600,
	'charred pocket lint': 5601,
	'smoked cheese wheel': 5602,
	'burned banana peel': 5603,
	'incinerated barn door plank': 5604,
	'fireproof secret diary': 5605,
	'barely-melted capacitor': 5606,
	'pile of ash': 5607,
	'voodoo-cursed object': 5608,
	'voodoo-cursed old boot': 5609,
	'voodoo-cursed skeleton': 5610,
	'voodoo-cursed bag of quicklime': 5611,
	'voodoo-cursed robot arm': 5612,
	'voodoo-cursed novelty bass': 5613,
	'voodoo-cursed sticky-bomb': 5614,
	'voodoo-cursed nail': 5615,
	'voodoo-cursed soul': 5616,
	'voodoo-cursed scout soul': 5617,
	'voodoo-cursed soldier soul': 5618,
	'voodoo-cursed heavy soul': 5619,
	'voodoo-cursed demoman soul': 5620,
	'voodoo-cursed engineer soul': 5621,
	'voodoo-cursed medic soul': 5622,
	'voodoo-cursed spy soul': 5623,
	'voodoo-cursed pyro soul': 5624,
	'voodoo-cursed sniper soul': 5625,
	'pile of curses': 5626,
	'eerie crate': 5627,
	'naughty winter crate 2012': 5629,
	'nice winter crate 2012': 5630,
	'strange bacon grease': 5633,
	'robo community crate': 5635,
	'robo community crate key': 5636,
	'pile of robo community crate key gifts': 5637,
	'a random robo community crate key gift': 5638,
	'summer claim check': 5639,
	'summer appetizer crate': 5640,
	'summer appetizer key': 5641,
	'red summer 2013 cooler': 5642,
	'red summer 2013 cooler key': 5643,
	'orange summer 2013 cooler': 5644,
	'orange summer 2013 cooler key': 5645,
	'yellow summer 2013 cooler': 5646,
	'yellow summer 2013 cooler key': 5647,
	'green summer 2013 cooler': 5648,
	'green summer 2013 cooler key': 5649,
	'aqua summer 2013 cooler': 5650,
	'aqua summer 2013 cooler key': 5651,
	'blue summer 2013 cooler': 5652,
	'blue summer 2013 cooler key': 5653,
	'brown summer 2013 cooler': 5654,
	'brown summer 2013 cooler key': 5655,
	'black summer 2013 cooler': 5656,
	'black summer 2013 cooler key': 5657,
	'pile of summer cooler key gifts': 5658,
	'a random summer cooler key gift': 5659,
	'select reserve mann co. supply crate': 5660,
	strangifier: 6522,
	'pristine robot currency digester': 5700,
	'pristine robot brainstorm bulb': 5701,
	'reinforced robot emotion detector': 5702,
	'reinforced robot humor suppression pump': 5703,
	'reinforced robot bomb stabilizer': 5704,
	'battle-worn robot taunt processor': 5705,
	'battle-worn robot kb-808': 5706,
	'battle-worn robot money furnace': 5707,
	'fall 2013 acorns crate': 5708,
	'fall 2013 gourd crate': 5709,
	'fall 2013 acorns crate key': 5844,
	'fall 2013 gourd crate key': 5711,
	'spooky crate': 5712,
	'naughty winter crate 2013': 5714,
	'nice winter crate 2013': 5715,
	'mann co. strongbox': 5719,
	'mann co. strongbox key': 5845,
	kit: 6527,
	'mann co. supply munition': 5859,
	'mann co. stockpile crate': 5738,
	'mann co. audition reel': 5739,
	'mann co. stockpile crate key': 5846,
	'bread box': 5741,
	'mann co. director\'s cut reel': 5760,
	'limited late summer crate': 5761,
	'unlocked creepy scout crate': 5763,
	'unlocked creepy pyro crate': 5764,
	'unlocked creepy heavy crate': 5765,
	'unlocked creepy engineer crate': 5766,
	'unlocked creepy spy crate': 5767,
	'unlocked creepy sniper crate': 5768,
	'unlocked creepy soldier crate': 5769,
	'unlocked creepy medic crate': 5770,
	'unlocked creepy demo crate': 5771,
	'end of the line community crate': 5774,
	'end of the line key': 5775,
	'pile of end of the line key gifts': 5776,
	'a random end of the line key gift': 5777,
	'duck token': 5778,
	'pile of duck token gifts': 5779,
	'a random duck token gift': 5780,
	'naughty winter crate 2014': 5789,
	'nice winter crate 2014': 5790,
	'gun mettle key': 5805,
	'concealed killer weapons case': 5806,
	'powerhouse weapons case': 5807,
	'gun mettle campaign pass': 5808,
	'gun mettle campaign coin': 5809,
	'concealed killer collection': 5810,
	'craftsmann collection': 5811,
	'powerhouse collection': 5812,
	'teufort collection': 5813,
	'gun mettle cosmetics collection': 5814,
	'gun mettle cosmetic key': 5816,
	'gun mettle cosmetic case': 5817,
	'strange count transfer tool': 5818,
	'invasion community update pass': 5819,
	'invasion community update coin': 5820,
	'invasion community update key': 5821,
	'quarantined collection case': 5824,
	'confidential collection case': 5825,
	'soul gargoyle': 5826,
	'gargoyle key': 5847,
	'gargoyle case': 5828,
	'tough break campaign pass': 5829,
	'tough break campaign stamp': 5830,
	'pyroland weapons case': 5831,
	'warbird weapons case': 5832,
	'tough break key': 5833,
	'harvest collection': 5834,
	'gentlemanne\'s collection': 5835,
	'pyroland collection': 5836,
	'warbird collection': 5837,
	'smissmas 2015 festive gift': 5838,
	'gun mettle and tough break festivizer': 5839,
	'festivizer': 5839,
	'tough break cosmetics collection': 5840,
	'tough break cosmetic key': 5841,
	'tough break cosmetic case': 5842,
	'civilian grade stat clock': 5843,
	'mayflower cosmetic key': 5848,
	'mayflower cosmetic case': 5849,
	'unlocked cosmetic crate scout': 5850,
	'unlocked cosmetic crate sniper': 5851,
	'unlocked cosmetic crate soldier': 5852,
	'unlocked cosmetic crate demo': 5853,
	'unlocked cosmetic crate medic': 5854,
	'unlocked cosmetic crate heavy': 5855,
	'unlocked cosmetic crate pyro': 5856,
	'unlocked cosmetic crate spy': 5857,
	'unlocked cosmetic crate engineer': 5858,
	'unlocked cosmetic crate multi-class': 5860,
	'creepy crawly case': 5861,
	'creepy crawly key': 5862,
	'gargoyle collection': 5863,
	'creepy crawly collection': 5864,
	'strange part': 5999,
	'strange part: heavies killed': 6000,
	'strange part: demomen killed': 6001,
	'strange part: soldiers killed': 6002,
	'strange part: scouts killed': 6003,
	'strange part: engineers killed': 6004,
	'strange part: snipers killed': 6005,
	'strange part: pyros killed': 6006,
	'strange part: medics killed': 6007,
	'strange part: spies killed': 6008,
	'strange part: buildings destroyed': 6009,
	'strange part: projectiles reflected': 6010,
	'strange part: headshot kills': 6011,
	'strange part: airborne enemies killed': 6012,
	'strange part: gib kills': 6013,
	'strange part: full moon kills': 6015,
	'strange part: domination kills': 6016,
	'strange part: revenge kills': 6018,
	'strange part: posthumous kills': 6019,
	'strange part: allies extinguished': 6020,
	'strange part: critical kills': 6021,
	'strange part: kills while explosive jumping': 6022,
	'strange part: medics killed that have full \xFCbercharge': 6023,
	'strange part: cloaked spies killed': 6024,
	'strange part: sappers destroyed': 6025,
	'strange part: robots destroyed': 6026,
	'strange part: giant robots destroyed': 6028,
	'strange part: low-health kills': 6032,
	'strange part: halloween kills': 6033,
	'strange part: robots destroyed during halloween': 6034,
	'strange part: defender kills': 6035,
	'strange part: underwater kills': 6036,
	'strange part: kills while \xFCbercharged': 6037,
	'strange part: tanks destroyed': 6038,
	'strange part: long-distance kills': 6039,
	'strange part: kills during victory time': 6041,
	'strange part: robot scouts destroyed': 6042,
	'strange part: robot spies destroyed': 6048,
	'strange part: kills with a taunt attack': 6051,
	'strange part: unusual-wearing player kills': 6052,
	'strange part: burning enemy kills': 6053,
	'strange part: killstreaks ended': 6054,
	'strange cosmetic part: freezecam taunt appearances': 6055,
	'strange part: damage dealt': 6056,
	'strange cosmetic part: fires survived': 6057,
	'strange part: allied healing done': 6058,
	'strange part: point-blank kills': 6059,
	'strange cosmetic part: kills': 6060,
	'strange part: full health kills': 6061,
	'strange part: taunting player kills': 6062,
	'strange part: not crit nor minicrit kills': 6063,
	'strange part: player hits': 6064,
	'strange cosmetic part: assists': 6065,
	'strange filter: coldfront (community)': 6500,
	'strange filter: egypt (community)': 6502,
	'strange filter: junction (community)': 6503,
	'strange filter: mountain lab (community)': 6504,
	'strange filter: steel (community)': 6505,
	'strange filter: gullywash (community)': 6506,
	'strange filter: turbine (community)': 6507,
	'strange filter: fastlane (community)': 6508,
	'strange filter: freight (community)': 6509,
	'strange filter: yukon (community)': 6510,
	'strange filter: harvest (community)': 6511,
	'strange filter: lakeside (community)': 6512,
	'strange filter: kong king (community)': 6513,
	'strange filter: frontier (community)': 6514,
	'strange filter: hoodoo (community)': 6515,
	'strange filter: nightfall (community)': 6516,
	'strange filter: watchtower (community)': 6517,
	'strange filter: offblast (community)': 6518,
	'strange filter: mann manor (community)': 6519,
	'strange filter: process (community)': 6520,
	'strange filter: standin (community)': 6521,
	'strange filter: snakewater (community)': 6524,
	'strange filter: snowplow (community)': 6528,
	'strange filter: borneo (community)': 6529,
	'strange filter: suijin (community)': 6530,
	'strange filter: 2fort invasion (community)': 6531,
	'strange filter: probed (community)': 6532,
	'strange filter: watergate (community)': 6533,
	'strange filter: byre (community)': 6534,
	'strange filter: gorge event (community)': 6535,
	'strange filter: sinshine (community)': 6536,
	'strange filter: moonshine event (community)': 6537,
	'strange filter: hellstone (community)': 6538,
	'strange filter: snowycoast (community)': 6539,
	'strange filter: vanguard (community)': 6540,
	'strange filter: landfall (community)': 6541,
	'strange filter: highpass (community)': 6542,
	'strange filter: competitive': 6543,
	'strange filter: sunshine (community)': 6544,
	'strange filter: metalworks (community)': 6545,
	'strange filter: swiftwater (community)': 6546,
	'strange filter: maple ridge event (community)': 6547,
	'strange filter: brimstone (community)': 6548,
	'strange filter: pit of death (community)': 6549,
	'halloween spell: putrescent pigmentation': 8900,
	'halloween spell: die job': 8901,
	'halloween spell: chromatic corruption': 8902,
	'halloween spell: spectral spectrum': 8903,
	'halloween spell: sinister staining': 8904,
	'halloween spell: soldier\'s booming bark': 8905,
	'halloween spell: scout\'s spectral snarl': 8906,
	'halloween spell: sniper\'s deep downunder drawl': 8907,
	'halloween spell: engineers\'s gravelly growl': 8908,
	'halloween spell: heavy\'s bottomless bass': 8909,
	'halloween spell: demoman\'s cadaverous croak': 8910,
	'halloween spell: pyro\'s muffled moan': 8911,
	'halloween spell: spy\'s creepy croon': 8912,
	'halloween spell: medic\'s blood-curdling bellow': 8913,
	'halloween spell: team spirit footprints': 8914,
	'halloween spell: gangreen footprints': 8915,
	'halloween spell: corpse gray footprints': 8916,
	'halloween spell: violent violet footprints': 8917,
	'halloween spell: rotten orange footprints': 8918,
	'halloween spell: bruised purple footprints': 8919,
	'halloween spell: headless horseshoes': 8920,
	'halloween spell: exorcism': 8921,
	'halloween spell: squash rockets': 8922,
	'halloween spell: gourd grenades': 8923,
	'halloween spell: sentry quad-pumpkins': 8924,
	'halloween spell: spectral flame': 8925,
	'pyro costume transmogrifier': 8926,
	'scout costume transmogrifier': 8927,
	'soldier costume transmogrifier': 8928,
	'demo costume transmogrifier': 8929,
	'heavy costume transmogrifier': 8930,
	'medic costume transmogrifier': 8931,
	'sniper costume transmogrifier': 8932,
	'spy costume transmogrifier': 8933,
	'engineer costume transmogrifier': 8934,
	'spellbook page': 8936,
	'enchantment: eternaween': 8937,
	'glitched circuit board': 8938,
	unusualifier: 9258,
	'chemistry set': 20009,
	fabricator: 20003,
	questname25000: 25000,
	questname25001: 25001,
	questname25002: 25002,
	questname25003: 25003,
	questname25004: 25004,
	questname25005: 25005,
	questname25006: 25006,
	questname25007: 25007,
	questname25008: 25008,
	questname25009: 25009,
	questname25010: 25010,
	questname25011: 25011,
	questname25012: 25012,
	questname25013: 25013,
	questname25014: 25014,
	quest25015name1632016: 25015,
	quest25016name1632016: 25016,
	quest25017name1632016: 25017,
	quest25018name1632016: 25018,
	quest25019name1632016: 25019,
	quest25020name1632016: 25020,
	quest25021name1632016: 25021,
	quest25022name1632016: 25022,
	quest25023name1632016: 25023,
	quest25024name1632016: 25024,
	quest25025name0: 25025,
	quest25026name0: 25026,
	quest25027name0: 25027,
	quest25028name0: 25028,
	quest25029name0: 25029,
	quest25030name0: 25030,
	quest25031name0: 25031,
	quest25032name0: 25032,
	quest25033name0: 25033,
	quest25034name0: 25034,
	quest25035name0: 25035,
	quest25036name0: 25036,
	quest25037name0: 25037,
	quest25038name0: 25038,
	quest25039name0: 25039,
	quest25040name0: 25040,
	quest25041name0: 25041,
	quest25042name0: 25042,
	quest25043name0: 25043,
	quest25044name0: 25044,
	quest25045name0: 25045,
	quest25046name0: 25046,
	quest25047name0: 25047,
	quest25048name0: 25048,
	quest25049name0: 25049,
	quest25050name0: 25050,
	quest25051name0: 25051,
	quest25052name0: 25052,
	quest25053name0: 25053,
	quest25054name0: 25054,
	quest25055name0: 25055,
	'electric badge-aloo': 30000,
	'modest metal pile of scrap': 30001,
	'letch\'s led': 30002,
	'galvanized gibus': 30003,
	'soldered sensei': 30004,
	'shooter\'s tin topi': 30005,
	'noble nickel amassment of hats': 30006,
	'base metal billycock': 30007,
	'towering titanium pillar of hats': 30008,
	'megapixel beard': 30009,
	'hdmi patch': 30010,
	'bolted bombardier': 30011,
	'titanium towel': 30012,
	'gridiron guardian': 30013,
	'tyrantium helmet': 30014,
	'battery canteens': 30015,
	'fr-0': 30016,
	'steel shako': 30017,
	'bot dogger': 30018,
	'ye oiled baker boy': 30019,
	'scrap sack': 30020,
	'pure tin capotain': 30021,
	'plumber\'s pipe': 30022,
	'teddy robobelt': 30023,
	'cyborg stunt helmet': 30024,
	'electric escorter': 30025,
	'full metal drill hat': 30026,
	'bolt boy': 30027,
	'metal slug': 30028,
	'broadband bonnet': 30029,
	'bonk leadwear': 30030,
	'plug-in prospector': 30031,
	'rusty reaper': 30032,
	'soldier\'s sparkplug': 30033,
	'bolted bicorne': 30034,
	'timeless topper': 30035,
	filamental: 30036,
	'strontium stove pipe': 30037,
	'firewall helmet': 30038,
	'respectless robo-glove': 30039,
	'pyro\'s boron beanie': 30040,
	'halogen head lamp': 30041,
	'platinum pickelhaube': 30042,
	'virus doctor': 30043,
	'texas tin-gallon': 30044,
	'titanium tyrolean': 30045,
	'practitioner\'s processing mask': 30046,
	'bootleg base metal billycock': 30047,
	'mecha-medes': 30048,
	'tungsten toque': 30049,
	'steam pipe': 30050,
	'data mining light': 30051,
	'byte\'d beak': 30052,
	'googol glass eyes': 30053,
	'bunsen brave': 30054,
	'scrumpy strongbox': 30055,
	'dual-core devil doll': 30056,
	'bolted birdcage': 30057,
	'crosslinker\'s coil': 30058,
	'beastly bonnet': 30059,
	'cheet sheet': 30060,
	tartantaloons: 30061,
	'steel sixpack': 30062,
	centurion: 30063,
	'tartan shade': 30064,
	'hardy laurel': 30065,
	'brotherhood of arms': 30066,
	'well-rounded rifleman': 30067,
	'breakneck baggies': 30068,
	'powdered practitioner': 30069,
	'pocket pyro': 30070,
	'cloud crasher': 30071,
	'pom-pommed provocateur': 30072,
	'dark age defender': 30073,
	tyurtlenek: 30074,
	'mair mask': 30075,
	'bigg mann on campus': 30076,
	'cool cat cardigan': 30077,
	'greased lightning': 30078,
	'red army robin': 30079,
	'heavy-weight champ': 30080,
	tsarboosh: 30081,
	'glasgow great helm': 30082,
	'caffeine cooler': 30083,
	'half-pipe hurdler': 30084,
	'macho mann': 30085,
	'trash toter': 30086,
	'dry gulch gulp': 30087,
	'el muchacho': 30089,
	'backpack broiler': 30090,
	'burning bandana': 30091,
	'soot suit': 30092,
	'hive minder': 30093,
	katyusha: 30094,
	'das hazmattenhatten': 30095,
	'das feelinbeterbager': 30096,
	'das ubersternmann': 30097,
	'das metalmeatencasen': 30098,
	'pardner\'s pompadour': 30099,
	'birdman of australiacatraz': 30100,
	'cobber chameleon': 30101,
	falconer: 30103,
	graybanns: 30104,
	'black watch': 30105,
	'tartan spartan': 30106,
	'gaelic golf bag': 30107,
	'borscht belt': 30108,
	'das naggenvatcher': 30109,
	'whiskey bib': 30110,
	'stormin\' norman': 30112,
	'flared frontiersman': 30113,
	'valley forge': 30114,
	compatriot: 30115,
	'caribbean conqueror': 30116,
	'colonial clogs': 30117,
	'whirly warrior': 30118,
	'federal casemaker': 30119,
	'rebel rouser': 30120,
	'das maddendoktor': 30121,
	'bear necessities': 30122,
	harmburg: 30123,
	'gaelic garb': 30124,
	'rogue\'s brogues': 30125,
	'shogun\'s shoulder guard': 30126,
	'das gutenkutteharen': 30127,
	'belgian detective': 30128,
	hornblower: 30129,
	'lieutenant bites': 30130,
	'brawling buccaneer': 30131,
	'blood banker': 30132,
	'after dark': 30133,
	'delinquent\'s down vest': 30134,
	'wet works': 30135,
	'baron von havenaplane': 30136,
	'das fantzipantzen': 30137,
	'bolshevik biker': 30138,
	'pampered pyro': 30139,
	'virtual viewfinder': 30140,
	'gabe glasses': 30141,
	'founding father': 30142,
	'demobot armor': 30143,
	'demobot helmet': 30144,
	'engineerbot armor': 30145,
	'engineerbot helmet': 30146,
	'heavybot armor': 30147,
	'heavybot helmet': 30148,
	'medicbot chariot': 30149,
	'medicbot hat': 30150,
	'pyrobot armor': 30151,
	'pyrobot helmet': 30152,
	'scoutbot armor': 30153,
	'scoutbot hat': 30154,
	'sniperbot armor': 30155,
	'sniperbot helmet': 30156,
	'soldierbot armor': 30157,
	'soldierbot helmet': 30158,
	'spybot armor': 30159,
	'spybot hood': 30160,
	sentrybuster: 30161,
	'bone dome': 30162,
	'air raider': 30163,
	'viking braider': 30164,
	'cuban bristle crisis': 30165,
	'beep boy': 30167,
	'special eyes': 30168,
	'trickster\'s turnout gear': 30169,
	chronomancer: 30170,
	'medical mystery': 30171,
	'gold digger': 30172,
	'brim-full of bullets': 30173,
	'cotton head': 30175,
	'pop-eyes': 30176,
	'hong kong cone': 30177,
	'weight room warmer': 30178,
	'hurt locher': 30179,
	'pirate bandana': 30180,
	'li\'l snaggletooth': 30181,
	'l\'homme burglerre': 30182,
	escapist: 30183,
	flapjack: 30185,
	'a brush with death': 30186,
	'slick cut': 30187,
	'frenchman\'s formals': 30189,
	ward: 30190,
	'beast from below': 30191,
	'hard-headed hardware': 30192,
	'cap\'n calamari': 30193,
	spectralnaut: 30194,
	'ethereal hood': 30195,
	'maniac\'s manacles': 30196,
	'second opinion': 30197,
	'pocket horsemann': 30198,
	'last bite': 30199,
	'baphomet trotters': 30200,
	'burny\'s boney bonnet': 30203,
	'crispy golden locks': 30204,
	'scorched skirt': 30205,
	'accursed apparition': 30206,
	'hound\'s hood': 30207,
	'terrier trousers': 30208,
	'horrific head of hare': 30211,
	'snaggletoothed stetson': 30212,
	'up pyroscopes': 30213,
	'one-way ticket': 30214,
	'birdie bonnet': 30215,
	'external organ': 30216,
	'ivan the inedible': 30217,
	'rugged respirator': 30218,
	'squid\'s lid': 30219,
	hollowhead: 30220,
	'grub grenades': 30221,
	'gothic guise': 30222,
	'grease monkey': 30223,
	'alternative medicine mann': 30224,
	'cauterizer\'s caudal appendage': 30225,
	'polly putrid': 30226,
	'faux manchu': 30227,
	'hidden dragon': 30228,
	'lo-grav loafers': 30229,
	'surgeon\'s space suit': 30230,
	'face plante': 30231,
	'das blutliebhaber': 30232,
	trepanabotomizer: 30233,
	'sackcloth spook': 30234,
	'mucous membrain': 30235,
	'pin pals': 30236,
	medimedes: 30237,
	'chicken kiev': 30238,
	'freedom feathers': 30239,
	'headtaker\'s hood': 30240,
	'transylvania top': 30241,
	candleer: 30242,
	'horsemann\'s hand-me-down': 30243,
	'bozo\'s bouffant': 30245,
	'faun feet': 30247,
	halloweiner: 30248,
	'lordly lapels': 30249,
	'cadaver\'s capper': 30251,
	guano: 30252,
	'sprinting cephalopod': 30253,
	'unidentified following object': 30254,
	'beacon from beyond': 30255,
	'hyperbaric bowler': 30256,
	'death support pack': 30257,
	'carious chameleon': 30258,
	'monster\'s stompers': 30259,
	'bountiful bow': 30260,
	'candyman\'s cap': 30261,
	'vicar\'s vestments': 30263,
	'hardium helm': 30264,
	'jupiter jumpers': 30265,
	'space bracers': 30266,
	handhunter: 30267,
	'spellbinder\'s bonnet': 30268,
	'macabre mask': 30269,
	'shaman\'s skull': 30270,
	'vicious visage': 30273,
	'tuque or treat': 30274,
	'horned honcho': 30275,
	'lieutenant bites the dust': 30276,
	'grisly gumbo': 30277,
	'dark helm': 30278,
	'archimedes the undying': 30279,
	'monstrous mandible': 30280,
	'shaolin sash': 30281,
	'mann-bird of aberdeen': 30282,
	'foul cowl': 30283,
	'sir shootsalot': 30284,
	corpsemopolitan: 30285,
	glob: 30286,
	'hallowed headcase': 30287,
	'carrion companion': 30288,
	quoth: 30289,
	'py-40 incinibot': 30290,
	parasight: 30292,
	teutonkahmun: 30293,
	'larval lid': 30294,
	manneater: 30295,
	'creature from the heap': 30296,
	'magical mercenary': 30297,
	'raven\'s visage': 30298,
	'ramses\' regalia': 30299,
	'haunted hat': 30300,
	'bozo\'s brogues': 30301,
	'cryptic keepsake': 30302,
	'abhorrent appendages': 30303,
	'blizzard breather': 30304,
	'sub zero suit': 30305,
	dictator: 30306,
	'neckwear headwear': 30307,
	'trail-blazer': 30308,
	'dead of night': 30309,
	'snow scoper': 30310,
	nunhood: 30311,
	'angel of death': 30312,
	'kiss king': 30313,
	'slo-poke': 30314,
	'minnesota slick': 30315,
	'toy soldier': 30316,
	'five-month shadow': 30317,
	'mann of reason': 30318,
	'mann of the house': 30319,
	chucklenuts: 30320,
	'tiny timber': 30321,
	'face full of festive': 30322,
	'ruffled ruprecht': 30323,
	'golden garment': 30324,
	'little drummer mann': 30325,
	'scout shako': 30326,
	'toy tailor': 30327,
	'extra layer': 30328,
	'polar pullover': 30329,
	dogfighter: 30330,
	'antarctic parka': 30331,
	'runner\'s warm-up': 30332,
	'highland high heels': 30333,
	'tartan tyrolean': 30334,
	'marshall\'s mutton chops': 30335,
	'trencher\'s topper': 30336,
	'trencher\'s tunic': 30337,
	'ground control': 30338,
	'killer\'s kit': 30339,
	'stylish degroot': 30340,
	ein: 30341,
	'heavy lifter': 30342,
	'gone commando': 30343,
	'bullet buzz': 30344,
	'leftover trap': 30345,
	'trash man': 30346,
	'scotch saver': 30347,
	'bushi-dou': 30348,
	'fashionable megalomaniac': 30349,
	'dough puncher': 30350,
	'teutonic toque': 30351,
	'mustachioed mann': 30352,
	'backstabber\'s boomslang': 30353,
	'rat stompers': 30354,
	'sole mate': 30355,
	'heat of winter': 30356,
	'dark falkirk helm': 30357,
	'sole saviors': 30358,
	'huntsman\'s essentials': 30359,
	'napoleon complex': 30360,
	'colonel\'s coat': 30361,
	law: 30362,
	'juggernaut jacket': 30363,
	'warmth preserver': 30364,
	'smock surgeon': 30365,
	'sangu sleeves': 30366,
	'cute suit': 30367,
	'war goggles': 30368,
	'eliminators safeguard': 30369,
	'archers groundings': 30371,
	'combat slacks': 30372,
	'toowoomba tunic': 30373,
	'sammy cap': 30374,
	'deep cover operator': 30375,
	'ticket boy': 30376,
	'antarctic researcher': 30377,
	'heer\'s helmet': 30378,
	'gaiter guards': 30379,
	'classified coif': 30388,
	'rogue\'s robe': 30389,
	'spook specs': 30390,
	'sengoku scorcher': 30391,
	'man in slacks': 30392,
	'razor cut': 30393,
	'frickin\' sweet ninja hood': 30394,
	'southie shinobi': 30395,
	'red socks': 30396,
	'bruiser\'s bandanna': 30397,
	'gas guzzler': 30398,
	'smoking skid lid': 30399,
	'lunatic\'s leathers': 30400,
	'yuri\'s revenge': 30401,
	'tools of the trade': 30402,
	'joe-on-the-go': 30403,
	'aviator assassin': 30404,
	'sky captain': 30405,
	'peacenik\'s ponytail': 30406,
	'level three chin': 30407,
	'egghead\'s overalls': 30408,
	'lonesome loafers': 30409,
	'ze \xFCbermensch': 30410,
	'au courant assassin': 30411,
	'endothermic exowear': 30412,
	'merc\'s mohawk': 30413,
	'eye-catcher': 30414,
	'medicine manpurse': 30415,
	'employee of the mmmph': 30416,
	frymaster: 30417,
	'combustible kabuto': 30418,
	chronoscarf: 30419,
	danger: 30420,
	'frontier djustice': 30421,
	'vive la france': 30422,
	'scoper\'s smoke': 30423,
	'triggerman\'s tacticals': 30424,
	'tipped lid': 30425,
	'paisley pro': 30426,
	'argyle ace': 30427,
	'pomade prince': 30428,
	allbrero: 30429,
	'seeing double': 30430,
	'six pack abs': 30431,
	horace: 30469,
	'biomech backpack': 30470,
	'alien cranium': 30471,
	'xeno suit': 30472,
	'mk 50': 30473,
	'nostromo napalmer': 30474,
	'mishap mercenary': 30475,
	'lady killer': 30476,
	'lone survivor': 30477,
	'poacher\'s safari jacket': 30478,
	'thirst blood': 30479,
	'mann of the seven sees': 30480,
	'hillbilly speed-bump': 30481,
	'unshaved bear': 30482,
	'pocket heavy': 30483,
	'dadliest catch': 30484,
	herzensbrecher: 30486,
	hundkopf: 30487,
	'kriegsmaschine-9000': 30488,
	'vampire makeover': 30489,
	'vampiric vesture': 30490,
	'nugget noggin': 30491,
	'fowl fists': 30492,
	'talon trotters': 30493,
	'head hunter': 30494,
	'claws and infect': 30495,
	'crazy legs': 30496,
	'ghost of spies checked past': 30497,
	'hooded haunter': 30498,
	'cranial conspiracy': 30499,
	'scaly scrapers': 30500,
	'marsupial man': 30501,
	'kanga kickers': 30502,
	'roo rippers': 30503,
	'marsupial muzzle': 30504,
	'shadowman\'s shade': 30505,
	'nightmare hunter': 30506,
	'rogue\'s rabbit': 30507,
	'iron fist': 30508,
	'beep man': 30509,
	'soul of \'spensers past': 30510,
	'tiny texan': 30511,
	facepeeler: 30512,
	'mr. mundee\'s wild ride': 30513,
	'templar\'s spirit': 30514,
	'wings of purity': 30515,
	'forgotten king\'s restless head': 30516,
	'forgotten king\'s pauldrons': 30517,
	eyeborg: 30518,
	'mannhattan project': 30519,
	'ghoul gibbin\' gear': 30520,
	'hellhunter\'s headpiece': 30521,
	'supernatural stalker': 30522,
	'garden bristles': 30523,
	'battle bird': 30524,
	'creature\'s grin': 30525,
	'arsonist apparatus': 30526,
	'moccasin machinery': 30527,
	'lollichop licker': 30528,
	'mr. juice': 30529,
	vampyro: 30530,
	'bone-cut belt': 30531,
	'bull locks': 30532,
	'minsk beef': 30533,
	'immobile suit': 30534,
	'kritz or treat canteen': 30535,
	'li\'l dutchman': 30536,
	'wartime warmth': 30538,
	'insulated inventor': 30539,
	'brooklyn booties': 30540,
	'double dynamite': 30541,
	'coldsnap cap': 30542,
	'snow stompers': 30543,
	'north polar fleece': 30544,
	'fur-lined fighter': 30545,
	'boxcar bomber': 30546,
	'bomber\'s bucket hat': 30547,
	'screamin\' eagle': 30548,
	'winter woodsman': 30549,
	'snow sleeves': 30550,
	'flashdance footies': 30551,
	'thermal tracker': 30552,
	'condor cap': 30553,
	'mistaken movember': 30554,
	'double dog dare demo pants': 30555,
	'sleeveless in siberia': 30556,
	'hunter heavy': 30557,
	'coldfront curbstompers': 30558,
	'end of the line community update medal': 30559,
	bootenkhamuns: 30561,
	'jungle booty': 30563,
	'orion\'s belt': 30564,
	'crown of the old kingdom': 30567,
	'tomb readers': 30569,
	'taunt: pool party': 30570,
	brimstone: 30571,
	'taunt: the boston breakdance': 30572,
	'mountebank\'s masque': 30573,
	'courtier\'s collar': 30574,
	'harlequin\'s hooves': 30575,
	'co-pilot': 30576,
	skullcap: 30578,
	'pyromancer\'s hood': 30580,
	'pyromancer\'s raiments': 30581,
	'black knight\'s bascinet': 30582,
	'torcher\'s tabard': 30583,
	'charred chainmail': 30584,
	'valhalla helm': 30586,
	'storm stompers': 30587,
	'siberian facehugger': 30588,
	'old man frost': 30589,
	'holstered heaters': 30590,
	'cop caller': 30591,
	'conagher\'s combover': 30592,
	'clubsy the seal': 30593,
	'unknown mann': 30595,
	'surgeon\'s shako': 30596,
	'bushman\'s bristles': 30597,
	'professional\'s ushanka': 30598,
	'marksman\'s mohair': 30599,
	'wally pocket': 30600,
	'cold snap coat': 30601,
	'puffy provocateur': 30602,
	'stealthy scarf': 30603,
	'scot bonnet': 30604,
	'thermal insulation layer': 30605,
	'pocket momma': 30606,
	'pocket raiders': 30607,
	'taunt: the killer solo': 30609,
	'taunt: most wanted': 30614,
	'taunt: the box trot': 30615,
	'taunt: the proletariat posedown': 30616,
	'taunt: bucking bronco': 30618,
	'taunt: burstchester': 30621,
	'rotation sensation': 30623,
	'physician\'s protector': 30625,
	'vascular vestment': 30626,
	'bruce\'s bonnet': 30627,
	'outta\' sight': 30628,
	'support spurs': 30629,
	'lurker\'s leathers': 30631,
	'commissar\'s coat': 30633,
	'sheriff\'s stetson': 30634,
	'wild west waistcoat': 30635,
	'fortunate son': 30636,
	'flak jack': 30637,
	'captain cardbeard cutthroat': 30640,
	'potassium bonnett': 30643,
	'white russian': 30644,
	'el duderino': 30645,
	'captain space mann': 30646,
	phononaut: 30647,
	'corona australis': 30648,
	'final frontiersman': 30649,
	starduster: 30650,
	graylien: 30651,
	'phobos filter': 30652,
	'sucker slug': 30653,
	'life support system': 30654,
	'rocket operator': 30655,
	'universal translator': 30658,
	'cadet visor': 30661,
	'a head full of hot air': 30662,
	'jupiter jetpack': 30663,
	'space diver': 30664,
	'shooting star': 30665,
	'c.a.p.p.e.r': 30666,
	batsaber: 30667,
	'giger counter': 30668,
	'space hamster hammy': 30669,
	'taunt: bad pipes': 30671,
	'taunt: zoomin\' broom': 30672,
	'taunt: soldier\'s requiem': 30673,
	roboot: 30675,
	'face of mercy': 30676,
	'el caballero': 30680,
	'el patron': 30681,
	'smokey sombrero': 30682,
	'neptune\'s nightmare': 30684,
	'thrilling tracksuit': 30685,
	'death racer\'s helmet': 30686,
	'grim tweeter': 30693,
	'iron lung': 30698,
	'duck billed hatypus': 30700,
	'prehistoric pullover': 30704,
	'catastrophic companions': 30706,
	'dead\'er alive': 30707,
	hellmet: 30708,
	'crusader\'s getup': 30716,
	'arthropod\'s aspect': 30717,
	'b\'aaarrgh-n-bicorne': 30718,
	'b\'aaarrgh-n-britches': 30719,
	'arkham cowl': 30740,
	firefly: 30741,
	'batter\'s bracers': 30722,
	'hood of sorrows': 30723,
	'fear monger': 30739,
	'pocket villains': 30726,
	'caped crusader': 30727,
	buttler: 30728,
	'teufort knight': 30733,
	'sidekick\'s side slick': 30735,
	'bat backup': 30736,
	'crook combatant': 30737,
	batbelt: 30738,
	'shin shredders': 30742,
	'patriot peak': 30743,
	diplomat: 30744,
	'siberian sweater': 30745,
	'a well wrapped hat': 30746,
	'gift bringer': 30747,
	'chill chullo': 30748,
	'winter backup': 30749,
	'medical monarch': 30750,
	'bonk batter\'s backup': 30751,
	'chicago overcoat': 30752,
	'a hat to kill for': 30753,
	'hot heels': 30754,
	'berlin brain bowl': 30755,
	'bunnyhopper\'s ballistics vest': 30756,
	'taunt: the fubar fanfare': 30761,
	'taunt: disco fever': 30762,
	'taunt: the balloonibouncer': 30763,
	airdog: 30767,
	'bedouin bandana': 30768,
	'herald\'s helm': 30769,
	'courtly cuirass': 30770,
	'squire\'s sabatons': 30771,
	'surgical survivalist': 30773,
	'dead head': 30775,
	'lurking legionnaire': 30777,
	dayjogger: 30779,
	'patriot\'s pouches': 30780,
	'dad duds': 30785,
	'gauzed gaze': 30786,
	'demo\'s dustcatcher': 30788,
	'scoped spartan': 30789,
	'colossal cranium': 30792,
	'aerobatics demonstrator': 30793,
	'final frontier freighter': 30794,
	'hovering hotshot': 30795,
	'toadstool topper': 30796,
	showstopper: 30797,
	'big topper': 30798,
	'combustible cutie': 30799,
	'cranial carcharodon': 30800,
	spooktacles: 30801,
	'heavy tourism': 30803,
	'el paso poncho': 30804,
	'wide-brimmed bandito': 30805,
	'corpus christi cranium': 30806,
	'spirit of the bombing past': 30807,
	'class crown': 30808,
	'wing mann': 30809,
	'nasty norsemann': 30810,
	'pestering jester': 30811,
	'mo\'horn': 30812,
	'surgeon\'s sidearms': 30813,
	'lil\' bitey': 30814,
	'mad mask': 30815,
	'taunt: second rate sorcery': 30816,
	'burly beast': 30817
});

console.timeEnd('itemDictionary');
