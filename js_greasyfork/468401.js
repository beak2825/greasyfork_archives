
// ==UserScript==
// @name         Mafia.gg Hosting Contraption
// @namespace    taintedhost
// @version      1.2.1b
// @description  A script for mafia.gg allowing easy hosting of setups and semi-opens mostly taken from the Open Setup List, as well as the ability to import your own setups! (dont use this with my other scripts plskthx)
// @author       Tainted
// @license      You can do whatever with this script but credit me if you upload an edited version <3
// @match        https://mafia.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mafia.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468401/Mafiagg%20Hosting%20Contraption.user.js
// @updateURL https://update.greasyfork.org/scripts/468401/Mafiagg%20Hosting%20Contraption.meta.js
// ==/UserScript==
    
(function() {
    "use strict";
    const roles = [{name:"(Random Balanced Meeting Mafia)",id:12340003,align:"mafia",hol:"none",tags:["Meeting"]},{name:"(Random Cop)",id:1624907922,align:"town",hol:"none",tags:["Night Power","Visits"]},{name:"(Random Meeting Mafia)",id:1625030984,align:"mafia",hol:"none",tags:["Meeting"]},{name:"(Random Non-Scum Third Party)",id:12340005,align:"third",hol:"none",tags:[]},{name:"(Random Nonmeeting Mafia)",id:1625031283,align:"mafia",hol:"none",tags:["Non-Meeting Mafia"]},{name:"(Random On-Condemn Villager)",id:12340004,align:"town",hol:"none",tags:["On-Condemn Power","Villager"]},{name:"(Random PR)",id:1625029370,align:"town",hol:"none",tags:[]},{name:"(Random Protector)",id:1625029035,align:"town",hol:"none",tags:["Night Power","Protective","Visits"]},{name:"(Random Third Party)",id:1625031508,align:"third",hol:"none",tags:[]},{name:"(Random Villager)",id:1625355725,align:"town",hol:"none",tags:["Villager"]},{name:"Administrator",id:999991,align:"town",hol:"none",tags:["On-Condemn Power","Single-Use"]},{name:"Agent",id:322,align:"town",hol:"none",tags:["Day Power"]},{name:"Agoraphobe",id:1567786474,align:"town",hol:"none",tags:["Night Power","Visits"]},{name:"Alcoholic",id:1599661616,align:"town",hol:"none",tags:["Night Power","Roleblocker","Visits"]},{name:"Amnesiac",id:1624413356,align:"third",hol:"none",tags:["Conversions","Night Power","Single-Use","Visits"]},{name:"Anarchist",description:'Each night, may visit a non-Mafia faction player and perform one of three actions\n\nMay block them from performing visiting night actions and break their items\n\nMay frame them as "sided with the Mafia" and steal their items\n\nMay learn their role\n\nEach action may only be performed once',id:1602978335,align:"mafia",hol:"none",tags:["Info Power","Item Interaction","Liar","Meeting","Night Power","Roleblocker","Single-Use","Visits"]},{name:"Announcer",id:28,align:"town",hol:"none",tags:["Info Power","Villager"]},{name:"Armorer",id:1,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Arms Dealer",id:19,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Assassin",id:68,align:"mafia",hol:"none",tags:["Extra KP","Night Power","Non-Meeting Mafia","Visits"]},{name:"Associate",id:1596416878,align:"mafia",hol:"none",tags:["Non-Meeting Mafia"]},{name:"Auditor",id:91,align:"town",hol:"none",tags:["Info Power","Item Interaction","Night Power","Visits"]},{name:"Author",id:1665562409,align:"town",hol:"none",tags:["Item Interaction","Night Power","Single-Use","Visits"]},{name:"Bee Thief",id:134134131,align:"mafia",hol:"none",tags:["Item Interaction","Meeting","Night Power","Visits"]},{name:"Beekeeper",id:133133131,align:"third",hol:"none",tags:["Extra KP","Item Interaction","Night Power","Non-Faction Scum","Visits"]},{name:"Bishop",id:321,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Blade Master",id:8,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Bodyguard",id:9,align:"town",hol:"none",tags:["Extra KP","Night Power","Protective","Visits"]},{name:"Bolthus",id:12340002,align:"mafia",hol:"Mafia Anniversary",tags:["Extra KP","Meeting","Single-Use","Visits"]},{name:"Bomb",id:4,align:"town",hol:"none",tags:["Extra KP","Single-Use"]},{name:"Bouncer",id:1661823768,align:"mafia",hol:"none",tags:["Meeting","Night Power","Roleblocker","Visits"]},{name:"Bounty Hunter",id:1541122637,align:"third",hol:"none",tags:["Non-Faction Scum","Starting Item"]},{name:"Bozoman",id:1555727200,align:"town",hol:"none",tags:["Liar","Revealing","Villager"]},{name:"Brainwasher",id:1555026977,align:"mafia",hol:"none",tags:["Conversions","Meeting","Night Power","Single-Use","Visits"]},{name:"Bruiser",id:1596420536,align:"town",hol:"none",tags:["Villager"]},{name:"Buffoon",id:1596418309,align:"town",hol:"none",tags:["Item Interaction","Negative Utility","Villager"]},{name:"Bulletproof",id:5,align:"town",hol:"none",tags:["Starting Item"]},{name:"Bus Cop",id:1676023569,align:"town",hol:"none",tags:["Investigative","Night Power","Visits"]},{name:"Busboy",id:1540004252,align:"mafia",hol:"none",tags:["Liar","Meeting"]},{name:"Butler",id:1643595684,align:"mafia",hol:"none",tags:["Liar","Meeting","Negative Utility","Night Power","Revealing","Single-Use"]},{name:"Candle",id:27,align:"town",hol:"none",tags:["Negative Utility","Obfuscating"]},{name:"Capo",id:1664318705,align:"mafia",hol:"none",tags:["Meeting","Non-Meeting Mafia","Revealing"]},{name:"Cat",id:1609987970,align:"mafia",hol:"none",tags:["Meeting","Night Power"]},{name:"Clown",id:1554252534,align:"mafia",hol:"none",tags:["Extra KP","Meeting","Single-Use"]},{name:"Con Man",description:'Appears as "NOT sided with the Mafia" on investigations\n\nUpon death, will reveal as @{role:Villager}',id:60,align:"mafia",hol:"none",tags:["Liar","Meeting"]},{name:"Confused Cop",id:6,align:"town",hol:"none",tags:["Investigative","Liar","Night Power","Visits"]},{name:"Consigliere",description:'Once per game, may choose during the day to convert to a @{role:Mafia}\n\nConversion occurs immediately after choosing \n\nDoes not attend the Mafia night meeting until converted\n\nAppears as "NOT sided with the Mafia" on investigations until converted',id:61,align:"mafia",hol:"none",tags:["Conversions","Day Power","Liar","Meeting","Non-Meeting Mafia","Single-Use"]},{name:"Contingency Planner",id:1547802152,align:"mafia",hol:"none",tags:["Item Interaction","Meeting"]},{name:"Cop",id:7,align:"town",hol:"none",tags:["Investigative","Night Power","Visits"]},{name:"Coroner",id:1550785710,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Corruptor",id:1567787886,align:"mafia",hol:"none",tags:["Conversions","Meeting","Negative Utility","Night Power","Single-Use","Visits"]},{name:"Counterfeiter",id:1623799794,align:"mafia",hol:"none",tags:["Item Interaction","Meeting","Night Power","Visits"]},{name:"Crier",id:51,align:"town",hol:"none",tags:["Day Power"]},{name:"Crook",id:5639273,align:"mafia",hol:"none",tags:["Meeting","On-Condemn Power","Single-Use"]},{name:"Cult",id:93,align:"third",hol:"none",tags:["Conversions","Meeting","Visits"]},{name:"Dark Templar",id:1616290531,align:"mafia",hol:"none",tags:["Meeting","Non-Meeting Mafia"]},{name:"Deathcaller",id:1643942425,align:"mafia",hol:"none",tags:["Day Power","Extra KP","Meeting","Single-Use"]},{name:"Decoy",id:12340007,align:"town",hol:"none",tags:["Liar","Villager"]},{name:"Defector",id:1644117932,align:"town",hol:"none",tags:["Conversions","Negative Utility","Single-Use"]},{name:"Defense Attorney",id:1609649171,align:"town",hol:"none",tags:["Day Power"]},{name:"Delinquent",description:'Appears as “sided with Mafia" on investigations',id:1596417104,align:"town",hol:"none",tags:["Liar"]},{name:"Dentist",id:12340008,align:"mafia",hol:"none",tags:["Info Power","Night Power","Non-Meeting Mafia","Protective","Visits"]},{name:"Detective",id:11,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Detonator",id:1539825403,align:"mafia",hol:"none",tags:["Day Power","Extra KP","Item Interaction","Night Power","Non-Meeting Mafia","Single-Use","Visits"]},{name:"Diva",id:59,align:"mafia",hol:"none",tags:["Info Power","Liar","Meeting","Night Power","Revealing","Visits"]},{name:"Doctor",id:12,align:"town",hol:"none",tags:["Night Power","Protective","Visits"]},{name:"Dog",id:22,align:"town",hol:"none",tags:["Revealing"]},{name:"Don",id:1599674667,align:"mafia",hol:"none",tags:["Meeting","VIP"]},{name:"Drunk",id:14,align:"town",hol:"none",tags:["Night Power","Roleblocker","Visits"]},{name:"Eavesdropper",id:133133138,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Electrician",id:1597889202,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Emcee",id:1583467528,align:"town",hol:"none",tags:["Info Power"]},{name:"Executioner",id:100,align:"third",hol:"none",tags:[]},{name:"Extrovert",id:1625356264,align:"town",hol:"none",tags:["Info Power","Starting Item"]},{name:"Fall Guy",description:'Sees self as @{role:Villager}\n\nRevealed to all Mafia-aligned and @{role:Liaison} players at the start of the game\n\nAppears as "sided with the Mafia" on investigations\n\nUpon being condemned, revealed as a @{role:Mafia}',id:1611988688,align:"town",hol:"none",tags:["Liar","Negative Utility","Revealing","Villager"]},{name:"Fixer",description:'Each night, may visit a player from their faction and make them appear as "NOT sided with the Mafia" for investigations that night\n\nCannot visit themselves',id:73,align:"mafia",hol:"none",tags:["Liar","Meeting","Night Power","Visits"]},{name:"Fool",id:95,align:"third",hol:"none",tags:["Night Power","Visits"]},{name:"Fortune Teller",id:15,align:"town",hol:"none",tags:["Item Interaction","Night Power","Revealing","Single-Use","Visits"]},{name:"Framer",description:'Each night, may visit and frame a player from another faction to appear as "sided with the Mafia" for investigations that night',id:64,align:"mafia",hol:"none",tags:["Liar","Meeting","Night Power","Visits"]},{name:"Freeloader",id:1623810832,align:"mafia",hol:"none",tags:["Meeting","Negative Utility"]},{name:"Freezer",id:80,align:"mafia",hol:"none",tags:["Day Power","Meeting","Single-Use"]},{name:"Fruit Vendor",id:324,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Genie",id:64942425,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Ghost",id:1611035758,align:"town",hol:"none",tags:["Day Power","Night Power","Villager"]},{name:"Godfather",id:65,align:"mafia",hol:"none",tags:["Liar","Meeting"]},{name:"Goof",id:1565222419,align:"town",hol:"none",tags:["Item Interaction","Negative Utility"]},{name:"Gossip",id:133133132,align:"town",hol:"none",tags:["Day Power","Meeting","Night Power"]},{name:"Governor",id:17,align:"town",hol:"none",tags:["On-Condemn Power","Single-Use"]},{name:"Grandma",id:18,align:"town",hol:"none",tags:["Extra KP"]},{name:"Grandpa",id:66,align:"mafia",hol:"none",tags:["Info Power","Meeting"]},{name:"Grandparent",id:12340006,align:"mafia",hol:"none",tags:["Info Power","Non-Meeting Mafia"]},{name:"Graverobber",id:1559319559,align:"mafia",hol:"none",tags:["Item Interaction","Meeting","Night Power","Visits"]},{name:"Greedy Executioner",id:96,align:"third",hol:"none",tags:[]},{name:"Groundhog",id:999993,align:"town",hol:"Groundhog Day",tags:["Info Power","Night Power"]},{name:"Guardian",id:1559001189,align:"town",hol:"none",tags:["Night Power","Protective","Visits"]},{name:"Guilty Conscience",id:133769420,align:"town",hol:"none",tags:["Day Power","Info Power","Single-Use"]},{name:"Handyman",id:1558467454,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Hangman",id:1540783473,align:"town",hol:"none",tags:["On-Condemn Power","Single-Use"]},{name:"Headhunter",id:1610841973,align:"mafia",hol:"none",tags:["Info Power","Meeting","Night Power","Visits"]},{name:"Hitman",id:1538276587,align:"mafia",hol:"none",tags:["Extra KP","Meeting","Starting Item"]},{name:"Hooker",id:69,align:"mafia",hol:"none",tags:["Meeting","Night Power","Roleblocker","Visits"]},{name:"Hunter",id:20,align:"town",hol:"none",tags:["On-Condemn Power","Single-Use"]},{name:"Hustler",id:1575667373,align:"mafia",hol:"none",tags:["Meeting","Night Power"]},{name:"Hypnotist",description:'Once per game, may visit and hypnotize a player at night\n\nThe hypnotized player’s first message of the following day will be changed to "I am [the role they see themselves as]" once sent\n\nIf the hypnotized player does not speak within the first 25 messages of the day, a message will be generated for them',id:21,align:"town",hol:"none",tags:["Info Power","Night Power","Single-Use","Visits"]},{name:"Iatrophobe",id:123450001,align:"mafia",hol:"none",tags:["Extra KP","Meeting"]},{name:"Idol Hunter",id:1609825209,align:"town",hol:"none",tags:["Item Interaction"]},{name:"Impostor",id:1596337363,align:"mafia",hol:"none",tags:["Liar","Meeting","Night Power","Revealing"]},{name:"Impulsive",id:1646594368,align:"town",hol:"none",tags:["Extra KP","Investigative","Item Interaction","Single-Use","Villager"]},{name:"Indignant",id:1617657618,align:"town",hol:"none",tags:["Extra KP","Item Interaction","Single-Use","Villager"]},{name:"Informant",id:1588457214,align:"mafia",hol:"none",tags:["Info Power","Meeting"]},{name:"Insane Cop",id:23,align:"town",hol:"none",tags:["Investigative","Liar","Night Power","Visits"]},{name:"Interceptor",id:71,align:"mafia",hol:"none",tags:["Extra KP","Meeting","Night Power","Visits"]},{name:"Jack",id:1577500425,align:"town",hol:"none",tags:["Extra KP","Investigative","Night Power","Protective","Single-Use","Visits"]},{name:"Jailer",id:24,align:"town",hol:"none",tags:["Meeting","Night Power","On-Condemn Power","Roleblocker","Visits"]},{name:"Janitor",id:72,align:"mafia",hol:"none",tags:["Meeting","Night Power","Obfuscating","Single-Use","Visits"]},{name:"Jaywalker",id:1598154575,align:"mafia",hol:"none",tags:["Meeting","Negative Utility","Night Power","Visits"]},{name:"Jekyll",id:83,align:"mafia",hol:"none",tags:["Meeting","Night Power","Protective","Visits"]},{name:"Jester",id:97,align:"third",hol:"none",tags:[]},{name:"Killer",id:98,align:"third",hol:"none",tags:["Conversions","Extra KP","Night Power","Non-Faction Scum","Visits"]},{name:"King",id:26,align:"town",hol:"none",tags:["Day Power","Night Power","Single-Use"]},{name:"Kingmaker",id:1643419817,align:"mafia",hol:"none",tags:["Conversions","Meeting","Single-Use","Visits"]},{name:"Kingpin",id:1611986711,align:"mafia",hol:"none",tags:["Meeting","VIP"]},{name:"Klutz",id:1565223e3,align:"mafia",hol:"none",tags:["Item Interaction","Meeting","Negative Utility"]},{name:"Lamb",id:1539915457,align:"town",hol:"none",tags:["Day Power","Revealing","Single-Use"]},{name:"Lazy Tracker",id:1603688758,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Liaison",id:1664437581,align:"third",hol:"none",tags:["Conversions","Extra KP","Meeting","Non-Meeting Mafia","Single-Use","VIP"]},{name:"Librarian",id:1553337595,align:"mafia",hol:"none",tags:["Meeting","Night Power","Obfuscating","Single-Use"]},{name:"Linchpin",id:1623980546,align:"mafia",hol:"none",tags:["Meeting","Non-Meeting Mafia","Revealing"]},{name:"Lookout",id:1541790284,align:"town",hol:"none",tags:["Info Power","Night Power"]},{name:"Loser",id:1599572963,align:"town",hol:"none",tags:["Negative Utility","Revealing"]},{name:"Lover",id:99,align:"third",hol:"none",tags:["Night Power","Single-Use"]},{name:"Luckyguard",id:3,align:"town",hol:"none",tags:["Night Power","Protective","Visits"]},{name:"Lurker",id:74,align:"mafia",hol:"none",tags:["Info Power","Meeting","Night Power","Visits"]},{name:"Mad Bomber",id:1557626901,align:"mafia",hol:"none",tags:["Day Power","Non-Meeting Mafia","Obfuscating","Single-Use"]},{name:"Mafia",id:75,align:"mafia",hol:"none",tags:["Meeting"]},{name:"Magician",id:70,align:"mafia",hol:"none",tags:["Meeting","Night Power","Obfuscating","Revealing","Starting Item"]},{name:"Mailman",id:1556837816,align:"mafia",hol:"none",tags:["Day Power","Item Interaction","Meeting","Visits"]},{name:"Manipulator",id:1547078335,align:"third",hol:"none",tags:["Liar","Revealing"]},{name:"Marksman",id:86,align:"mafia",hol:"none",tags:["Extra KP","Non-Meeting Mafia","Single-Use","Starting Item"]},{name:"Martyr",id:1572486115,align:"town",hol:"none",tags:["Extra KP","On-Condemn Power","Single-Use","Villager"]},{name:"Mason",id:29,align:"town",hol:"none",tags:["Conversions","Meeting","Night Power"]},{name:"Medic",id:31,align:"town",hol:"none",tags:["Night Power","Protective","Visits"]},{name:"Medium",id:1610228810,align:"town",hol:"none",tags:["Day Power"]},{name:"Merlin",id:1600386374,align:"town",hol:"none",tags:["Revealing","VIP"]},{name:"Mesmer",description:'Once per game, may visit and hypnotize a player at night\n\nThe mesmerized player’s first message of the following day will be changed to "I am [the role they see themselves as]" once sent\n\nIf the mesmerized player does not speak within the first 25 messages of the day, a message will be generated for them',id:76,align:"mafia",hol:"none",tags:["Info Power","Meeting","Night Power","Single-Use"]},{name:"Miller",id:32,align:"town",hol:"none",tags:["Liar","Villager"]},{name:"Moderator",id:1623812683,align:"mafia",hol:"none",tags:["Day Power","Meeting","Single-Use"]},{name:"Moko",id:12340001,align:"town",hol:"Mafia Anniversary",tags:["Extra KP","Single-Use","Visits"]},{name:"Mole",id:1581354568,align:"mafia",hol:"none",tags:["Info Power","Meeting"]},{name:"Mudslinger",id:1665623260,align:"mafia",hol:"none",tags:["Extra KP","Info Power","Night Power","Non-Meeting Mafia","Visits"]},{name:"Naive Cop",id:33,align:"town",hol:"none",tags:["Investigative","Liar","Night Power","Visits"]},{name:"Nervous Sleeper",id:1572568017,align:"town",hol:"none",tags:["Extra KP"]},{name:"Ninja",id:77,align:"mafia",hol:"none",tags:["Meeting","Obfuscating"]},{name:"Nurse",id:35,align:"town",hol:"none",tags:["Night Power","Protective","Roleblocker","Visits"]},{name:"Oracle",id:36,align:"town",hol:"none",tags:["Revealing","Starting Item"]},{name:"Overlord",id:92,align:"third",hol:"none",tags:[]},{name:"Pacifist",id:101,align:"third",hol:"none",tags:["Night Power","Protective","Visits"]},{name:"Painter",id:78,align:"mafia",hol:"none",tags:["Liar","Meeting","Night Power","Visits"]},{name:"Paparazzo",id:79,align:"mafia",hol:"none",tags:["Meeting","On-Condemn Power","Revealing","Single-Use"]},{name:"Paranoiac",id:1552856661,align:"town",hol:"none",tags:["Extra KP","Info Power","Item Interaction"]},{name:"Paranoid Cop",id:37,align:"town",hol:"none",tags:["Investigative","Liar","Night Power","Visits"]},{name:"Parity Cop",id:38,align:"town",hol:"none",tags:["Investigative","Night Power","Visits"]},{name:"Party Host",id:1573101280,align:"town",hol:"none",tags:["Day Power","Extra KP","Night Power","Single-Use"]},{name:"Party Planner",id:821013751,align:"town",hol:"New Year",tags:["Day Power","Extra KP","Item Interaction","Night Power","Single-Use","Visits"]},{name:"Patroller",id:39,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Patsy",description:'Sees self as @{role:Villager}\n\nRevealed to all Mafia-aligned and @{role:Liaison} players at the start of the game\n\nAppears as "sided with the Mafia" on investigations',id:1596417444,align:"town",hol:"none",tags:["Liar","Negative Utility","Revealing","Villager"]},{name:"Phantom",id:16,align:"town",hol:"none",tags:["Extra KP","Night Power","Single-Use"]},{name:"Photographer",id:1580766301,align:"town",hol:"none",tags:["Day Power","Info Power","Single-Use"]},{name:"Poacher",id:1596416287,align:"mafia",hol:"none",tags:["Extra KP","Meeting","On-Condemn Power","Single-Use"]},{name:"Pollster",id:1576088848,align:"town",hol:"none",tags:["Day Power","Single-Use"]},{name:"Polygraph",id:1565630670,align:"town",hol:"none",tags:["Info Power","Liar","Night Power","Visits"]},{name:"President",id:40,align:"town",hol:"none",tags:["Revealing","VIP"]},{name:"Profiler",id:1610848791,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Prosecutor",id:1609898885,align:"town",hol:"none",tags:["Extra KP","Night Power","On-Condemn Power","Roleblocker","Single-Use"]},{name:"Psychiatrist",id:44,align:"town",hol:"none",tags:["Conversions","Night Power","Visits"]},{name:"Puppy",id:999992,align:"town",hol:"none",tags:["Revealing"]},{name:"Pyromaniac",id:1573568724,align:"mafia",hol:"none",tags:["Day Power","Extra KP","Night Power","Non-Meeting Mafia","Single-Use","Visits"]},{name:"Quack",id:62,align:"mafia",hol:"none",tags:["Conversions","Meeting","Night Power","Visits"]},{name:"Radio Operator",id:1546127461,align:"mafia",hol:"none",tags:["Meeting","Negative Utility"]},{name:"Reaper",id:1676008595,align:"mafia",hol:"none",tags:["Day Power","Extra KP","Item Interaction","Meeting","Single-Use","Visits"]},{name:"Regent",id:1643511585,align:"town",hol:"none",tags:["Day Power","Single-Use"]},{name:"Remorseful",id:133133136,align:"mafia",hol:"none",tags:["Conversions","Meeting","Negative Utility"]},{name:"Representative",id:25,align:"town",hol:"none",tags:["Day Power"]},{name:"Revenant",id:2,align:"town",hol:"none",tags:[]},{name:"Rifleman",id:10,align:"town",hol:"none",tags:["Extra KP","Starting Item"]},{name:"Robot Santa",id:15582324,align:"mafia",hol:"Winter Holidays",tags:["Extra KP","Meeting","Single-Use"]},{name:"Rogue",id:54,align:"town",hol:"none",tags:["Conversions","Villager"]},{name:"Runner",id:1625357559,align:"town",hol:"none",tags:["Night Power","Single-Use","Visits"]},{name:"Saboteur",id:1553863028,align:"mafia",hol:"none",tags:["Item Interaction","Meeting","Night Power","Visits"]},{name:"Saint",id:1588642540,align:"town",hol:"none",tags:["On-Condemn Power","Protective","Single-Use","Villager"]},{name:"Scout",id:84,align:"mafia",hol:"none",tags:["Info Power","Meeting","Night Power","Visits"]},{name:"Scumbag",id:103,align:"third",hol:"none",tags:[]},{name:"Secret Service",id:1541480746,align:"town",hol:"none",tags:["Day Power","Item Interaction"]},{name:"Security Guard",id:1661814887,align:"town",hol:"none",tags:["Night Power","Roleblocker","Visits"]},{name:"Seer",id:13,align:"town",hol:"none",tags:["Info Power"]},{name:"Selfish Fool",id:104,align:"third",hol:"none",tags:["Night Power","Visits"]},{name:"Sergeant",id:34,align:"town",hol:"none",tags:["Extra KP","Night Power","Single-Use","Visits"]},{name:"Shaman",id:107,align:"third",hol:"none",tags:["Night Power"]},{name:"Sharpshooter",id:133133137,align:"third",hol:"none",tags:["Extra KP","Item Interaction","Single-Use","Starting Item"]},{name:"Sheriff",id:43,align:"town",hol:"none",tags:["Extra KP","Revealing","Single-Use","Starting Item"]},{name:"Shogun",id:42,align:"town",hol:"none",tags:["Conversions","Extra KP"]},{name:"Siren",id:105,align:"third",hol:"none",tags:["Extra KP","Night Power"]},{name:"Sleepwalker",id:45,align:"town",hol:"none",tags:["Negative Utility","Villager","Visits"]},{name:"Snoop",id:1577132908,align:"town",hol:"none",tags:["Day Power","Revealing","Single-Use"]},{name:"Soloman",id:47,align:"town",hol:"none",tags:["Liar","Night Power","Revealing"]},{name:"Speaker",id:1580879842,align:"town",hol:"none",tags:["Negative Utility","Obfuscating"]},{name:"Spy",id:323,align:"mafia",hol:"none",tags:["Day Power","Meeting"]},{name:"Stooge",id:1611988621,align:"town",hol:"none",tags:["Negative Utility","Revealing","Villager"]},{name:"Stray Kitten",id:12340009,align:"third",hol:"none",tags:["Night Power","Visits"]},{name:"Strongman",id:1558930946,align:"mafia",hol:"none",tags:["Extra KP","Meeting","Night Power","Single-Use","Visits"]},{name:"Succubus",description:'Once per game, may choose a player from another faction to visit and seduce\n\nSeduced player learns that they have fallen in love, but not with whom\n\nIf Succubus dies, the charmed player also dies\n\n"First you succ, then you bus."',id:67,align:"mafia",hol:"none",tags:["Extra KP","Meeting","Night Power","Single-Use","Visits"]},{name:"Surveyor",id:1558240320,align:"town",hol:"none",tags:["Info Power","Night Power","Single-Use"]},{name:"Survivor",id:1580690992,align:"third",hol:"none",tags:[]},{name:"Suspect",description:'Sees self as @{role:Villager}\n\nAppears as "sided with the Mafia" on investigations',id:49,align:"town",hol:"none",tags:["Liar","Villager"]},{name:"Suspect Governor",id:1597815390,align:"town",hol:"none",tags:["On-Condemn Power"]},{name:"Suspect Mind",id:1540344996,align:"town",hol:"none",tags:["Extra KP","Item Interaction","Revealing","Starting Item"]},{name:"Sweeper",id:1541806737,align:"mafia",hol:"none",tags:["Meeting","Obfuscating","On-Condemn Power","Single-Use"]},{name:"Tactician",id:1644316289,align:"town",hol:"none",tags:["Item Interaction"]},{name:"Tagger",id:87,align:"mafia",hol:"none",tags:["Info Power","Meeting","Night Power","Visits"]},{name:"Tailor",id:1595571568,align:"mafia",hol:"none",tags:["Item Interaction","Liar","Meeting","Night Power","Visits"]},{name:"Tank",id:88,align:"mafia",hol:"none",tags:["Meeting","Night Power","Starting Item"]},{name:"Tapioca",id:50,align:"town",hol:"none",tags:["Liar"]},{name:"Tax Collector",id:201,align:"third",hol:"none",tags:["Conversions","Info Power","Night Power","Visits"]},{name:"Templar",id:1573416236,align:"town",hol:"none",tags:["Meeting"]},{name:"Thief",id:1556390101,align:"mafia",hol:"none",tags:["Item Interaction","Night Power","Non-Meeting Mafia","Visits"]},{name:"Thorne",id:1596390851,align:"third",hol:"none",tags:["Conversions","Extra KP","Night Power","Obfuscating","Visits"]},{name:"Ticketmaster",id:1676679526,align:"mafia",hol:"none",tags:["Day Power","Info Power","Meeting","Single-Use"]},{name:"Tourist",id:1596418665,align:"town",hol:"none",tags:["Night Power","Visits"]},{name:"Tracker",id:52,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Traitor",id:106,align:"third",hol:"none",tags:[]},{name:"Trancer",id:89,align:"mafia",hol:"none",tags:["Meeting","Night Power"]},{name:"Trapper",id:53,align:"town",hol:"none",tags:["Extra KP","Night Power","Visits"]},{name:"Trickster",id:1618178898,align:"town",hol:"none",tags:["Item Interaction","On-Condemn Power","Single-Use","Villager"]},{name:"Understudy",id:1587533794,align:"mafia",hol:"none",tags:["Conversions","Meeting","Night Power","Single-Use","Visits"]},{name:"Unknown",id:1589145477,align:"none",hol:"none"},{name:"Vanilla Cop",id:1565316812,align:"town",hol:"none",tags:["Info Power","Night Power","Visits"]},{name:"Vash",id:200,align:"town",hol:"none",tags:["Item Interaction","Night Power","Visits"]},{name:"Veteran",id:55,align:"town",hol:"none",tags:["Extra KP","Night Power"]},{name:"Veterinarian",id:1676354787,align:"town",hol:"none",tags:["Conversions","Night Power","Protective","Visits"]},{name:"Vigilante",id:56,align:"town",hol:"none",tags:["Extra KP","Night Power","Visits"]},{name:"Villager",id:57,align:"town",hol:"none",tags:["Villager"]},{name:"Virgin",id:58,align:"town",hol:"none",tags:["Conversions","On-Condemn Power","Protective","Single-Use"]},{name:"Wanderer",id:1624739756,align:"mafia",hol:"none",tags:["Meeting","Night Power","Non-Meeting Mafia","Visits"]},{name:"Wannabe",id:1580928590,align:"mafia",hol:"none",tags:["Investigative","Night Power","Non-Meeting Mafia","Visits"]},{name:"Weaver",id:1568391955,align:"town",hol:"none",tags:["Item Interaction","Night Power","Single-Use","Visits"]},{name:"Wiretapper",id:1553924852,align:"town",hol:"none",tags:["Day Power","Info Power","Single-Use"]},{name:"Witness",id:1611085230,align:"town",hol:"none",tags:["On-Condemn Power","Revealing","Single-Use","Villager"]},{name:"Yakuza",id:90,align:"mafia",hol:"none",tags:["Conversions","Extra KP","Meeting","Night Power","Single-Use","Visits"]},{name:"Zombie",id:1558372324,align:"third",hol:"none",tags:["Conversions","Extra KP","Night Power","Non-Faction Scum","Visits"]}];
    function code2roles(code) {
        let data = {};
        for (const pair of code.split("b")) {
            const spl = pair.split("a");
            if (spl.length !== 2) return null;
            const id = spl[0];
            const quant = spl[1];
            const qint = parseInt(quant);
            if (isNaN(qint)) return null;
            data[id] = parseInt(quant);
        }
        return data;
    }
    function isHost() {
        for (const elm of document.querySelectorAll(".game-accordion-header")) {
            if (elm.innerText === "HOST ACTIONS") return true;
        }
        return false;
    }
    let packet = {
        "type":"options",
        //"roomName":"powa",
        "roles":{},
        //"unlisted":true,
        //"holiday":"NONE",
        //"deck":"-1",
        //"dayLength":5,
        //"nightLength":2,
        //"scaleTimer":false,
        "dayStart":"off",
        //"disableVoteLock":true,
        "revealSetting":"allReveal",
        "mustVote":false,
        "majorityRule":"51",
        "twoKp":"0",
        "deadlockPreventionLimit":"5",
        //"hostRoleSelection":false,
        "hideSetup":false,
        "noNightTalk":false,
        "killAllMafiaAfterSomeDie":0,
        "killAllTownAfterTooManyMiscondemns":0
    };
    function setDefaults(options) {
        packet.roomName = options.roomName;
        packet.unlisted = options.unlisted;
        packet.deck = options.deck;
        packet.dayLength = options.dayLength;
        packet.nightLength = options.nightLength;
        packet.scaleTimer = options.scaleTimer;
        packet.disableVoteLock = options.disableVoteLock;
        packet.hostRoleSelection = options.hostRoleSelection;
    
        //
    
        packet.roles = options.roles;
    }
    let setups = {
        "#tainted-3-4": {
            "Consifom [3P]": {
                roles: code2roles("5a1b61a1b19a1")
            },
            "Small Vengeful [3P]": {
                roles: code2roles("75a1b20a1b106a1"),
                dayStart: "dawnStart",
                mustVote: true
            },
            "The One I Cannot Kill [3P]": {
                roles: code2roles("1596416878a1b1572486115a1b1596417444a1")
            },
            "Cop Cop Patsy [4P]": {
                roles: code2roles("7a1b84a1b1596417444a1b23a1"),
                dayStart: "mafiaNKn1",
            },
            "Superposition [4P Semi]": {
                roles: [
                    "1599661616a1b37a1b1600386374a1b1556390101a1",
                    "1599661616a1b37a1b1600386374a1b1547802152a1",
                    "1599661616a1b37a1b1600386374a1b1573568724a1",
                    "1599661616a1b1600386374a1b33a1b1580928590a1",
                    "1596417444a1b37a1b1599661616a1b1547802152a1",
                    "1596417444a1b1538276587a1b1596418665a1b37a1",
                    "1596417444a1b1596418665a1b37a1b75a1",
                    "1596417444a1b23a1b69a1b1599661616a1"
                ].map(code2roles),
                dayStart: "dawnStart",
                hideSetup: true
            },
            "Scumshoot [4P]": {
                roles: code2roles("1596416878a1b1547078335a1b92a1b10a1"),
                dayStart: "dawnStart",
                revealSetting: "noReveal"
            },
            "Two Time's The Charm [4P]": {
                roles: code2roles("5a2b7a1b70a1"),
                dayStart: "dawnStart",
            }
        },
        "#tainted-5-6": {
            "5 Man Conplan [5P]": {
                roles: code2roles("18a1b31a1b40a1b52a1b1547802152a1")
            },
            "CSPAN [5P]": {
                roles: code2roles("11a1b17a1b98a1b92a1b5a1")
            },
            "Dethy [5P]": {
                roles: code2roles("75a1b7a1b23a1b33a1b37a1")
            },
            "Semi Conplan [5P Semi]": {
                roles: [
                    "1547802152a1b18a1b31a1b40a1b52a1",
                    "1547802152a1b40a1b52a1b1599661616a1b55a1",
                    "1547802152a1b40a1b52a1b1552856661a1b1596418665a1",
                    "1547802152a1b40a1b52a1b1625356264a1b35a1",
                    "1547802152a1b40a1b35a1b18a1b7a1",
                    "1547802152a1b40a1b7a1b55a1b31a1",
                    "1547802152a1b40a1b7a1b1552856661a1b1599661616a1",
                    "1547802152a1b40a1b7a1b1625356264a1b1596418665a1",
                    "1547802152a1b40a1b1596418665a1b18a1b39a1",
                    "1547802152a1b40a1b35a1b55a1b39a1",
                    "1547802152a1b40a1b39a1b31a1b1552856661a1",
                    "1547802152a1b40a1b39a1b1599661616a1b1625356264a1",
                    "1547802152a1b40a1b1599661616a1b18a1b1540344996a1",
                    "1547802152a1b40a1b1540344996a1b55a1b1596418665a1",
                    "1547802152a1b40a1b1540344996a1b1552856661a1b35a1",
                    "1547802152a1b40a1b1540344996a1b1625356264a1b31a1"
                ].map(code2roles),
                hideSetup: true
            },
            "Zombies [5P]": {
                roles: code2roles("57a2b1558372324a1b1572486115a2"),
                dayStart: "dawnStart"
            },
            "Camera Shy [6P]": {
                roles: code2roles("4a3b1540004252a1b1580766301a1b5639273a1"),
                dayStart: "dawnStart"
            },
            "Everyman [6P]": {
                roles: code2roles("12a1b100a1b95a1b44a1b90a1b18a1"),
                dayStart: "dawnStart"
            },
            "Lovers Mafia [6P]": {
                roles: code2roles("18a4b83a2"),
                mustVote: true
            },
            "Shrink the Cult [6P]": {
                roles: code2roles("98a1b12a1b93a1b44a3")
            },
            "TMI [6P]": {
                roles: code2roles("1611986711a1b1547078335a1b1611988621a1b58a3"),
                dayStart: "dawnStart"
            }
        },
        "#tainted-7-8": {
            "Bootcamp [7P]": {
                roles: code2roles("7a1b65a1b57a3b1565630670a1b75a1"),
                dayStart: "dawnStart"
            },
            "Carbon-14 [7P]": {
                roles: code2roles("75a2b7a1b33a1b57a3"),
                dayStart: "dawnStart",
            },
            "Guns & Hookers [7P]": {
                roles: code2roles("19a1b7a1b69a1b75a1b57a3")
            },
            "Matrix6.gg [7P Semi]": {
                roles: [
                    "75a1b57a4b66a1b1577500425a1",
                    "57a3b75a1b7a1b12a1b69a1",
                    "57a3b1603688758a1b75a1b1567786474a1b1540004252a1",
                    "1567786474a1b1577500425a1b75a1b57a3b69a1",
                    "57a4b75a1b7a1b1540004252a1",
                    "75a1b57a3b66a1b12a1b1603688758a1"
                ].map(code2roles),
                dayStart: "dawnStart",
                hideSetup: true
            },
            "Pie E7 [7P]": {
                roles: code2roles("7a1b75a1b57a3b12a1b69a1"),
                dayStart: "dawnStart"
            },
            "Voltron Doesn't Like It: Mafia.gg Edition [7P]": {
                roles: code2roles("75a1b57a2b5a1b36a1b1611988688a1b1565223000a1"),
                dayStart: "mafiaNKn1"
            },
            "CBNG8 [8P Semi]": {
                roles: [
                    "69a1b38a1b57a4b1540004252a1b12a1",
                    "38a1b57a4b1540004252a1b75a1b31a1",
                    "38a1b57a4b1540004252a1b9a1b1538276587a1",
                    "38a1b57a4b1540004252a1b75a1b35a1",
                    "69a1b38a1b57a4b1540004252a1b1565222419a1",
                    "69a1b38a1b57a4b1540004252a1b16a1",
                    "38a1b57a4b1540004252a1b75a1b1559001189a1",
                    "38a1b57a4b1540004252a1b1583467528a1b1538276587a1",
                    "38a1b57a4b1540004252a1b1538276587a1b10a1"
                ].map(code2roles),
                dayStart: "mafiaNKn1",
                hideSetup: true
            },
            "Civil Arms [8P]": {
                roles: code2roles("19a1b1596418309a2b1565223000a2b57a3")
            },
            "McPick 2 [8P Semi]": {
                roles: [
                    "32a1b57a3b61a1b20a1b7a1b1596416287a1",
                    "61a1b32a1b57a3b7a1b1610841973a1b1610848791a1",
                    "61a1b32a1b57a3b7a1b1538276587a1b10a1",
                    "1610841973a1b20a1b32a1b57a3b1610848791a1b1596416287a1",
                    "1538276587a1b32a1b1596416287a1b10a1b57a3b20a1",
                    "32a1b57a3b1538276587a1b1610848791a1b10a1b1610841973a1"
                ].map(code2roles),
                dayStart: "dayStart",
                hideSetup: true
            },
            "Mesdirection [8P]": {
                roles: code2roles("7a1b1538276587a1b76a1b2a2b57a3"),
                dayStart: "dawnStart"
            },
            "Sweet Dreams [8P]": {
                roles: code2roles("75a1b57a2b28a1b13a1b45a2b87a1")
            },
            "Stackjack [8P]": {
                roles: code2roles("57a3b1602978335a1b66a1b1577500425a2b1596417444a1"),
                dayStart: "dawnStart"
            },
            "Voltron [8P]": {
                roles: code2roles("5a1b75a2b36a1b57a4")
            },
            "Voltron Doesn't Like It [8P]": {
                roles: code2roles("5a1b75a1b36a1b57a3b87a1b32a1")
            },
            "What a LOSER(S) [8P]": {
                roles: code2roles("69a1b1599572963a2b75a1b57a3b12a1"),
                dayStart: "dayStart",
            },
            "Wishes & Boundaries [8P]": {
                roles: code2roles("321a1b1661823768a1b1540004252a1b64942425a1b32a1b57a3")
            }
        },
        "#tainted-9-10": {
            "Dreams Never Come True [9P]": {
                roles: code2roles("59a1b1553863028a1b45a3b1568391955a2b28a1b1596418309a1")
            },
            "Gnightless [9P]": {
                roles: code2roles("1596417444a7b86a2")
            },
            "NewD3 M [9P Semi]": {
                roles: [
                    "57a5b69a1b1540004252a1b7a1b12a1",
                    "69a1b57a5b1540004252a1b35a1b52a1",
                    "57a5b69a1b1573416236a2b1540004252a1",
                    "57a5b52a1b1540004252a1b324a1b87a1",
                    "57a5b1540004252a1b324a1b87a1b35a1",
                    "57a5b1540004252a1b87a1b52a1b12a1",
                    "57a6b75a2b7a1",
                    "57a6b75a2b35a1",
                    "57a5b75a2b1573416236a2"
                ].map(code2roles),
                dayStart: "dawnStart",
                hideSetup: true
            },
            "Voltron Micro [9P]": {
                roles: code2roles("1567786474a1b5639273a1b36a1b1541806737a1b57a5"),
                dayStart: "dawnStart"
            },
            "ABC [10P]": {
                roles: code2roles("28a1b9a1b1540004252a1b7a1b65a1b1565222419a4b83a1")
            },
            "ConPLEX [10P]": {
                roles: code2roles("1547802152a1b18a1b99a1b31a1b40a1b323a1b1597815390a1b52a1b106a1b1547078335a1")
            },
            "Janitorial [10P]": {
                roles: code2roles("73a1b72a1b75a1b57a3b7a1b12a1b32a1b36a1")
            }
        },
        "#tainted-11-12": {
            "How To Fail As Marksman [11P]": {
                roles: code2roles("57a4b4a1b7a1b5639273a1b65a1b86a1b1596417444a1b10a1"),
                dayStart: "dawnStart"
            },
            "How To Play Marksman [11P]": {
                roles: code2roles("65a1b75a1b86a1b7a1b32a1b57a4b5a1b31a1"),
                dayStart: "dawnStart"
            },
            "McPick 3 [11P Semi]": {
                roles: [
                    "61a1b7a1b1610841973a1b1610848791a1b20a1b1596416287a1b32a1b57a4",
                    "61a1b7a1b1610841973a1b1610848791a1b1538276587a1b10a1b32a1b57a4",
                    "61a1b7a1b1610841973a1b1610848791a1b1603688758a1b84a1b32a1b57a4",
                    "61a1b7a1b1610841973a1b1610848791a1b21a1b76a1b32a1b57a4",
                    "61a1b7a1b20a1b1596416287a1b1538276587a1b10a1b32a1b57a4",
                    "61a1b7a1b20a1b1596416287a1b1603688758a1b84a1b32a1b57a4",
                    "61a1b7a1b20a1b1596416287a1b21a1b76a1b32a1b57a4",
                    "61a1b7a1b1538276587a1b10a1b1603688758a1b84a1b32a1b57a4",
                    "61a1b7a1b1538276587a1b10a1b21a1b76a1b32a1b57a4",
                    "61a1b7a1b1603688758a1b84a1b21a1b76a1b32a1b57a4",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1538276587a1b10a1b32a1b57a4",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1603688758a1b84a1b32a1b57a4",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b21a1b76a1b32a1b57a4",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b1603688758a1b84a1b32a1b57a4",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b21a1b76a1b32a1b57a4",
                    "1610841973a1b1610848791a1b1603688758a1b84a1b21a1b76a1b32a1b57a4",
                    "20a1b1596416287a1b1538276587a1b10a1b1603688758a1b84a1b32a1b57a4",
                    "20a1b1596416287a1b1538276587a1b10a1b21a1b76a1b32a1b57a4",
                    "20a1b1596416287a1b1603688758a1b84a1b21a1b76a1b32a1b57a4",
                    "1538276587a1b10a1b1603688758a1b84a1b21a1b76a1b32a1b57a4"
                ].map(code2roles),
                dayStart: "dawnStart",
                hideSetup: true
            },
            "Triplecamp [11P]": {
                roles: code2roles("65a1b75a1b1565630670a1b45a5b1565316812a1b1603688758a1b77a1"),
                dayStart: "dawnStart"
            },
            "God Save the King [12P]": {
                roles: code2roles("5639273a1b57a6b26a1b39a1b43a1b323a1b106a1"),
                dayStart: "mafiaNKn1"
            },
            "JacKing Off [12P]": {
                roles: code2roles("61a1b69a1b1577500425a1b26a1b32a1b79a1b1597815390a1b57a5"),
                dayStart: "dawnStart"
            },
            "Sodium-24 [12P Semi]": {
                roles: [
                    "5a1b7a1b75a3b1596417444a1b1565630670a1b57a5",
                    "5a1b7a1b75a2b1596417444a1b1565630670a1b57a5b65a1",
                    "5a1b7a1b75a1b1596417444a1b1565630670a1b57a5b65a2",
                    "5a1b7a1b1596417444a1b1565630670a1b57a5b65a3"
                ].map(code2roles),
                dayStart: "dawnStart",
                hideSetup: true
            },
            "Talking on Borrowed Time [12P]": {
                roles: code2roles("1538276587a1b31a1b79a1b38a1b16a1b2a6b1541806737a1"),
                dayStart: "dawnStart"
            },
            "Tic-Tac-Toe [12P Semi]": {
                roles: [
                    "57a6b77a2b72a1b1603688758a1b31a1b52a1",
                    "57a6b72a1b7a1b65a1b11a1b1559001189a1b1595571568a1",
                    "57a6b72a1b14a1b1a1b35a1b1558930946a2",
                    "57a6b14a1b11a1b31a1b72a2b1595571568a1",
                    "57a6b1a1b7a1b1603688758a1b1558930946a1b65a1b77a1",
                    "57a6b1558930946a1b77a1b72a1b35a1b1559001189a1b52a1",
                    "57a6b35a1b7a1b31a1b1558930946a1b72a1b65a1",
                    "57a6b52a1b7a1b14a1b72a1b77a1b65a1"
                ].map(code2roles),
                dayStart: "dawnStart",
                hideSetup: true
            },
            "What Ever Major Loser [12P]": {
                roles: code2roles("1555026977a1b1610841973a1b1599572963a2b75a1b31a1b1565316812a1b57a5"),
                dayStart: "dawnStart"
            }
        },
        "#tainted-13-14": {
            "Death's Wind [13P]": {
                roles: code2roles("65a1b57a6b27a1b1643942425a1b31a1b36a1b38a1b1541806737a1"),
                dayStart: "dawnStart"
            },
            "Dust & Vashes [13P]": {
                roles: code2roles("57a6b7a1b1587533794a1b1538276587a1b65a1b31a1b200a1b1567786474a1"),
                dayStart: "dawnStart"
            },
            "Doggobombs [13P]": {
                roles: code2roles("31a1b8a1b4a6b22a1b1565222419a1b77a2b90a1"),
                dayStart: "dawnStart"
            },
            "Tax Fraud [13P]": {
                roles: code2roles("60a3b12a1b1610848791a1b44a1b1558240320a1b50a5b201a1"),
                dayStart: "mafiaNKn1"
            },
            "TMI+ [13P]": {
                roles: code2roles("1596420536a1b1559001189a1b1611986711a1b1603688758a2b1547078335a1b45a5b1611988621a1b1587533794a1"),
                dayStart: "dawnStart"
            },
            "Housekeeping [14P]": {
                roles: code2roles("1602978335a1b1a1b91a1b86a1b16a1b1541806737a1b50a7b106a1"),
                dayStart: "dawnStart",
                revealSetting: "alignmentReveal"
            },
            "Tale of Two Tourists [14P]": {
                roles: code2roles("1599661616a1b4a6b1603688758a1b31a1b77a1b1596418665a1b1587533794a3"),
                dayStart: "dawnStart"
            }
        },
        "#tainted-15-16": {
            "Cirque [15P]": {
                roles: code2roles("57a5b5a1b1554252534a2b10a1b1596417444a1b1577500425a1b16a1b1596416287a2b999991a1"),
                dayStart: "dawnStart"
            },
            "Conditional Matrix16 [15P Semi]": {
                roles: [
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b7a1b31a1b2a1b75a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b7a1b2a1b5a1b1598154575a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1567786474a1b35a1b62a1b7a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b7a1b83a1b1599661616a1b1596418665a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b31a1b75a1b16a1b1565316812a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1565316812a1b1596418665a1b5a1b1598154575a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1565316812a1b1596418665a1b35a1b62a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1565316812a1b83a1b1599661616a1b2a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1599661616a1b1603688758a1b1596418665a1b75a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1603688758a1b1598154575a1b31a1b1567786474a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1603688758a1b62a1b5a1b16a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1603688758a1b16a1b83a1b35a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1567786474a1b1573416236a2b75a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1573416236a2b16a1b1598154575a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1573416236a2b62a1b2a1",
                    "1602978335a1b65a1b1609825209a1b77a1b1596417444a1b45a1b57a5b1573416236a2b1567786474a1b83a1"
                ].map(code2roles),
                dayStart: "dawnStart",
                revealSetting: "alignmentReveal",
                hideSetup: true
            },
            "McPick 4 [15P Semi]": {
                roles: [
                    "61a1b7a1b1610841973a1b1610848791a1b20a1b1596416287a1b1538276587a1b10a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b20a1b1596416287a1b1603688758a1b84a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b20a1b1596416287a1b21a1b76a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b20a1b1596416287a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b20a1b1596416287a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1538276587a1b10a1b1603688758a1b84a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1538276587a1b10a1b21a1b76a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1538276587a1b10a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1538276587a1b10a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1603688758a1b84a1b21a1b76a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1603688758a1b84a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b1603688758a1b84a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1610841973a1b1610848791a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1538276587a1b10a1b1603688758a1b84a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1538276587a1b10a1b21a1b76a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1538276587a1b10a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1538276587a1b10a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1603688758a1b84a1b21a1b76a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1603688758a1b84a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b1603688758a1b84a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b20a1b1596416287a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1538276587a1b10a1b1603688758a1b84a1b21a1b76a1b32a1b57a6",
                    "61a1b7a1b1538276587a1b10a1b1603688758a1b84a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1538276587a1b10a1b1603688758a1b84a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1538276587a1b10a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1538276587a1b10a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1538276587a1b10a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1603688758a1b84a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "61a1b7a1b1603688758a1b84a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b1603688758a1b84a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "61a1b7a1b21a1b76a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1538276587a1b10a1b1603688758a1b84a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1538276587a1b10a1b21a1b76a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1538276587a1b10a1b322a1b323a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1538276587a1b10a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1603688758a1b84a1b21a1b76a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1603688758a1b84a1b322a1b323a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b1603688758a1b84a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b20a1b1596416287a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b1603688758a1b84a1b21a1b76a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b1603688758a1b84a1b322a1b323a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b1603688758a1b84a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1538276587a1b10a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1603688758a1b84a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1603688758a1b84a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b1603688758a1b84a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1610841973a1b1610848791a1b21a1b76a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "20a1b1596416287a1b1538276587a1b10a1b1603688758a1b84a1b21a1b76a1b32a1b57a6",
                    "20a1b1596416287a1b1538276587a1b10a1b1603688758a1b84a1b322a1b323a1b32a1b57a6",
                    "20a1b1596416287a1b1538276587a1b10a1b1603688758a1b84a1b1550785710a1b72a1b32a1b57a6",
                    "20a1b1596416287a1b1538276587a1b10a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "20a1b1596416287a1b1538276587a1b10a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "20a1b1596416287a1b1538276587a1b10a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "20a1b1596416287a1b1603688758a1b84a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "20a1b1596416287a1b1603688758a1b84a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "20a1b1596416287a1b1603688758a1b84a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "20a1b1596416287a1b21a1b76a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1538276587a1b10a1b1603688758a1b84a1b21a1b76a1b322a1b323a1b32a1b57a6",
                    "1538276587a1b10a1b1603688758a1b84a1b21a1b76a1b1550785710a1b72a1b32a1b57a6",
                    "1538276587a1b10a1b1603688758a1b84a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1538276587a1b10a1b21a1b76a1b322a1b323a1b1550785710a1b72a1b32a1b57a6",
                    "1603688758a1b84a1b21a1b76a1b322a1b323a1b1550785710a1b72a1b32a1b57a6"
                ].map(code2roles),
                dayStart: "dawnStart",
                revealSetting: "alignmentReveal",
                hideSetup: true
            },
            "Sin City [15P]": {
                roles: code2roles("19a1b1547802152a1b321a1b5a1b35a1b89a1b57a6b69a1b1611988621a1b60a1"),
                dayStart: "dawnStart"
            },
            "Shobombs [15P]": {
                roles: code2roles("4a1b59a1b73a1b31a1b1572568017a1b77a2b38a1b47a6b1558240320a1"),
                dayStart: "mafiaNKn1"
            },
            "wangabombs [15P]": {
                roles: code2roles("4a7b31a1b77a3b36a1b1580766301a1b43a1b87a1"),
                dayStart: "mafiaNKn1"
            },
            "iBern [16P]": {
                roles: code2roles("4a1b1547802152a1b65a1b35a1b1552856661a1b38a1b1573568724a1b45a2b47a1b49a1b87a1b57a4")
            },
            "JacKing Off+ [16P]": {
                roles: code2roles("69a1b57a6b61a1b1577500425a1b83a1b26a1b32a1b79a1b16a1b1597815390a1b1611085230a1"),
                dayStart: "dawnStart"
            },
            "Outlaws [16P]": {
                roles: code2roles("65a1b1565223000a2b86a1b1596417444a1b57a7b1540783473a1b1609825209a1b31a1b38a1"),
                dayStart: "mafiaNKn1"
            },
            "VIP [16P]": {
                roles: code2roles("1567786474a1b7a1b1559319559a1b69a1b86a1b31a1b1581354568a1b1541480746a1b1580879842a1b57a6b1572486115a1"),
                dayStart: "mafiaNKn1"
            }
        },
        "#tainted-17-18": {
            "Congress [17P]": {
                roles: code2roles("5639273a1b17a1b1540783473a1b24a1b72a1b25a7b84a1b201a1b106a3")
            },
            "weBern [17P]": {
                roles: code2roles("14a1b1625356264a1b1572486115a1b35a1b1573568724a1b47a1b1611988621a1b1587533794a3b57a7"),
                dayStart: "mafiaNKn1"
            },
            "Convert Me, Corrupt Me, Control Me [18P]": {
                roles: code2roles("1540004252a1b69a1b31a1b5a1b7a1b1567787886a1b14a1b98a1b44a1b62a1b42a8"),
                dayStart: "dawnStart"
            },
            "Deaths and Taxes [18P]": {
                roles: code2roles("57a7b7a1b73a1b1538276587a1b1581354568a1b1572568017a1b1596417444a1b1609898885a1b44a1b62a1b1558240320a1b201a1"),
                dayStart: "dawnStart"
            }
        },
        "#tainted-19": {
            "Assassin Exists to be Bussed [19P]": {
                roles: code2roles("1596417444a1b57a8b68a1b5a1b27a1b1577500425a1b35a1b1573101280a1b1587533794a3b58a1"),
                dayStart: "dawnStart"
            },
            "Sin City+ [19P]": {
                roles: code2roles("57a9b19a1b321a1b5a1b60a1b1547802152a1b1596417104a1b69a1b35a1b89a1b1580928590a1"),
                dayStart: "dawnStart"
            },
            "WANG19 [19P]": {
                roles: code2roles("28a1b1540004252a1b7a1b1625356264a1b80a1b17a1b1538276587a1b69a1b31a1b32a1b33a1b45a2b57a5b1624739756a1"),
                dayStart: "dawnStart"
            },
            "wangabombs+ [19P]": {
                roles: code2roles("5a1b36a1b87a1b4a9b31a1b77a3b1580766301a1b10a1b1556390101a1"),
                dayStart: "mafiaNKn1"
            },
            "Basic20 [20P]": {
                roles: code2roles("28a1b5a1b1540004252a1b7a1b65a1b1538276587a1b69a1b75a1b1572486115a1b31a1b32a1b1552856661a1b45a2b1597815390a1b57a5")
            },
            "Chillln20 [20P]": {
                roles: code2roles("57a5b1602978335a1b61a1b7a1b1611988688a1b80a1b1540783473a1b1617657618a1b1539915457a1b1623980546a1b1599572963a2b86a1b35a1b1618178898a2"),
                dayStart: "dawnStart"
            },
            "Pie25 [25P]": {
                roles: code2roles("7a1b75a2b57a7b28a1b9a1b5a1b1540004252a1b1554252534a1b65a1b17a1b69a1b1539915457a1b86a1b32a1b1552856661a1b45a2b47a1")
            }
        },
        "#tainted-imported": localStorage.getItem("tainted-imported") !== null ? JSON.parse(localStorage.getItem("tainted-imported")) : {}
    };
    let send = () => {};
    //let started = false;
    let settings = document.createElement("table");
    let hostPressCD = false;
    settings.id = "tainted-settings";
    settings.style.display = "none";
    settings.classList.add("game-table", "game-table-allow-wrap");
    settings.innerHTML = `
    <tr><th colspan=2><div class="game-table-cell">Tainted Hosting Contraption</div></th></tr>
    
    <tr><td colspan=2><button type="button" class="tainted-smalpreset game-table-button standalone">Close Small Preset Menu <span class="icon-down"></span></button></td></tr>
    
    <tr class="tainted-smalpreset"><td><div class="game-table-cell">3 & 4 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-3-4">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-smalpreset"><td><div class="game-table-cell">5 & 6 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-5-6">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-smalpreset"><td><div class="game-table-cell">7 & 8 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-7-8">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-smalpreset"><td><div class="game-table-cell">9 & 10 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-9-10">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr><td colspan=2><button type="button" class="tainted-bigpreset game-table-button standalone">Close Big Preset Menu <span class="icon-down"></span></button></td></tr>
    
    
    <tr class="tainted-bigpreset"><td><div class="game-table-cell">11 & 12 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-11-12">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-bigpreset"><td><div class="game-table-cell">13 & 14 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-13-14">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-bigpreset"><td><div class="game-table-cell">15 & 16 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-15-16">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-bigpreset"><td><div class="game-table-cell">17 & 18 Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-17-18">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-bigpreset"><td><div class="game-table-cell">19+ Man Setups</div></td><td><div class="game-table-cell"><select id="tainted-19">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr><td colspan=2><button type="button" class="tainted-importm game-table-button standalone">Close Import Menu <span class="icon-down"></span></button></td></tr>
    
    <tr class="tainted-importm"><td><div class="game-table-cell">Imported Setups</div></td><td><div class="game-table-cell"><select id="tainted-imported">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-importm"><td><div class="game-table-cell">Delete Imported Setups</div></td><td><div class="game-table-cell"><select id="tainted-import-del">
    <option value="none">Select...</option>
    </select></div></td></tr>
    
    <tr class="tainted-importm"><td><div class="game-table-cell">Open Import Menu</div></td><td><div class="game-table-cell"><button class="button" type="button" id="tainted-import" style="width:100%"><span class="button-contents">Import</span></button></div></td></tr>
    
    <tr><td colspan=2><button type="button" class="tainted-misc game-table-button standalone">Close Miscellaneous Menu <span class="icon-down"></span></button></td></tr>
    
    <tr class="tainted-misc"><td><div class="game-table-cell">Multiply Setup</div></td><td><div class="game-table-cell"><select id="tainted-mult">
        <option value="1">Select...</option>
        <option value="2">Double Setup</option>
        <option value="3">Triple Setup</option>
        <option value="4">Quadruple Setup</option>
        <option value="5">Quintuple Setup</option>
        <option value="6">Sextuple Setup</option>
    </select></div></td></tr>
    
    <tr class="tainted-misc"><td><div class="game-table-cell">Auto New Room</div></td><td><div class="game-table-cell"><button class="button" type="button" id="tainted-newroom" style="width:100%"><span class="button-contents">Off</span></button></div></td></tr>
    `;
    let popup = document.createElement("div");
    popup.className = "overlay-element";
    popup.innerHTML = `<div class="dialog" style="opacity: 1;"><div class="dialog-overlay"><div class="dialog-content"><div class="dialog-header"><h1>Import Setup</h1><nav><button type="button" id="tainted-dialog-close" class="dialog-close"></button></nav></div><div class="dialog-body">
    <i style="font-style: italic;">As a side note: you have to click the x to exit this menu</i><table class="game-table game-table-allow-wrap game-table-bordered">
    
    <tr><th><div class="game-table-cell">Setting</div></th><th class=""><div class="game-table-cell">Value</div></th></tr>
    
    <tr><td><div class="game-table-cell">Setup Name</div></td><td><div class="game-table-cell"><input type="text" maxlength="500" id="tainted-name" placeholder="This must be unique and non-empty!" autocomplete="off"></div></td></tr>
    
    <tr><td><div class="game-table-cell">Setup Code</div></td><td><div class="game-table-cell"><input type="text" maxlength="500" id="tainted-code" placeholder="Make sure that the setup code is valid!" autocomplete="off"></div></td></tr>
    
    <tr><td><div class="game-table-cell">Game Start</div></td><td><div class="game-table-cell"><select id="tainted-dayStart">
        <option value="off">Nightstart</option>
        <option value="dawnStart">Informed Daystart</option>
        <option value="dayStart">Uninformed Daystart</option>
        <option value="mafiaNKn1">Nightstart (No Kill Night 1)</option>
    </select></div></td></tr>
    
    <tr><td><div class="game-table-cell">Reveal Setting</div></td><td><div class="game-table-cell"><select id="tainted-revealSetting">
        <option value="allReveal">Roles Revealed Upon Death</option>
        <option value="alignmentReveal">Alignments Revealed Upon Death</option>
        <option value="noReveal">No Reveals Upon Death</option>
    </select></div></td></tr>
    
    </table>
    
    <button class="button" type="button" id="tainted-confimport"><span class="button-contents">Import this setup!</span></button>
    
    </div></div></div></div>`
    popup.querySelector("#tainted-dialog-close").addEventListener("click", e => {
        popup.remove();
    });
    popup.querySelector("#tainted-confimport").addEventListener("click", e => {
        let name = popup.querySelector("#tainted-name").value;
        popup.querySelector("#tainted-name").value = "";
        if (name in setups["#tainted-imported"] || name === "") return;
        let opt = document.createElement("option");
        opt.value = name;
        opt.innerText = name;
        setups["#tainted-imported"][name] = {
            dayStart: popup.querySelector("#tainted-dayStart").value,
            revealSetting: popup.querySelector("#tainted-revealSetting").value,
            roles: code2roles(popup.querySelector("#tainted-code").value) === null ? {} : code2roles(popup.querySelector("#tainted-code").value)
        };
        let insind = Object.entries(setups["#tainted-imported"]).sort((fir, sec) => {
            let fcount = Object.values(fir[1].roles).reduce((a, b) => a + b);
            let scount = Object.values(sec[1].roles).reduce((a, b) => a + b);
            if (fcount > scount) return 1;
            else if (fcount < scount) return -1;
            else if (fir[0] > sec[0]) return 1;
            else if (fir[0] < sec[0]) return -1;
            return 0;
        }).findIndex(kv => kv[0] === name);
        if (insind + 1 === Object.entries(setups["#tainted-imported"]).length) {
            settings.querySelector("#tainted-imported").appendChild(opt);
            settings.querySelector("#tainted-import-del").appendChild(opt.cloneNode());
            settings.querySelector("#tainted-import-del").lastChild.innerText = name;
        } else {
            settings.querySelector("#tainted-imported").insertBefore(opt, [...settings.querySelector("#tainted-imported").children][insind+1]);
            settings.querySelector("#tainted-import-del").insertBefore(opt.cloneNode(), [...settings.querySelector("#tainted-import-del").children][insind+1]);
            [...settings.querySelector("#tainted-import-del").children][insind+1].innerText = name;
        }
        popup.querySelector("#tainted-dayStart").value = "off";
        popup.querySelector("#tainted-revealSetting").value = "allReveal";
        popup.querySelector("#tainted-code").value = "";
        localStorage.setItem("tainted-imported", JSON.stringify(setups["#tainted-imported"]));
        popup.remove();
    });
    for (const [cat, list] of Object.entries(setups)) {
        for (const [name, setup] of (cat === "#tainted-imported" ? Object.entries(list).sort((fir, sec) => {
            let fcount = Object.values(fir[1].roles).reduce((a, b) => a + b);
            let scount = Object.values(sec[1].roles).reduce((a, b) => a + b);
            if (fcount > scount) return 1;
            else if (fcount < scount) return -1;
            else if (fir[0] > sec[0]) return 1;
            else if (fir[0] < sec[0]) return -1;
            return 0;
        }) : Object.entries(list))) {
            let opt = document.createElement("option");
            opt.value = name;
            opt.innerText = name;
            settings.querySelector(cat).appendChild(opt);
            if (cat === "#tainted-imported") {
                settings.querySelector("#tainted-import-del").appendChild(opt.cloneNode());
                settings.querySelector("#tainted-import-del").lastChild.innerText = name;
            }
        }
        settings.querySelector(cat).addEventListener("change", e => {
            if (e.target.value !== "none") {
                let stp = {...setups["#" + e.target.id][e.target.value]};
                if (Array.isArray(stp.roles)) stp.roles = stp.roles[Math.floor(Math.random() * stp.roles.length)];
                send(Object.assign({}, packet, stp));
                e.target.value = "none";
            }
        });
    }
    for (const but of settings.querySelectorAll(".game-table-button")) {
        but.addEventListener("click", e => {
            let arrow = e.target.lastElementChild;
            if (arrow.className === "icon-down") {
                arrow.className = "icon-right";
                e.target.firstChild.textContent = e.target.firstChild.textContent.replace("Close", "Open");
                for (const tr of settings.querySelectorAll(`tr.${[...e.target.classList].find(c => c.startsWith("tainted"))}`)) {
                    tr.style.display = "none";
                }
            } else {
                arrow.className = "icon-down";
                e.target.firstChild.textContent = e.target.firstChild.textContent.replace("Open", "Close");
                for (const tr of settings.querySelectorAll(`tr.${[...e.target.classList].find(c => c.startsWith("tainted"))}`)) {
                    tr.style.display = "table-row";
                }
            }
        });
    }
    settings.querySelector("#tainted-import").addEventListener("click", e => {
        document.querySelector(".overlay").prepend(popup);
    });
    settings.querySelector("#tainted-import-del").addEventListener("change", e => {
        if (e.target.value === "none") return;
        delete setups["#tainted-imported"][e.target.value];
        localStorage.setItem("tainted-imported", JSON.stringify(setups["#tainted-imported"]));
        document.querySelector("#tainted-imported").remove(e.target.selectedIndex);
        e.target.remove(e.target.selectedIndex);
        e.target.value = "none";
    });
    settings.querySelector("#tainted-newroom").addEventListener("click", e => {
        e.target.innerHTML = e.target.innerHTML.replace("On", "TEMP").replace("Off", "On").replace("TEMP", "Off");
    });
    settings.querySelector("#tainted-mult").addEventListener("change", e => {
        for (const [role, count] of Object.entries(packet.roles)) {
            packet.roles[role] *= parseInt(e.target.value);
        }
        e.target.value = "1";
        send(packet);
    });
    setInterval(() => {
        let disp = isHost() ? "table" : "none";
        if (settings.style.display !== disp) settings.style.display = disp;
        if (document.querySelector("#tainted-settings") === null) {
            let menu = document.querySelector(".game-right-tabs > .game-tab-group > .game-tab-contents > .scrollable > .scrollable-inner");
            if (menu !== null) {
                menu.prepend(settings);
                hostPressCD = false;
            }
        }
        if (settings.querySelector("#tainted-newroom").innerText === "On") for (const elm of document.querySelectorAll(".button-contents")) {
            if (elm.innerText === "Host new room" && !hostPressCD) {
                elm.click();
                hostPressCD = true;
            } else if (elm.innerText === "Create" && elm.parentElement.parentElement.className === "dialog-footer") {
                elm.click();
            }
        };
    }, 100);
    XMLHttpRequest = new Proxy(XMLHttpRequest, {
        construct: (target, args) => {
            let object = new target(...args);
            let opencpy = XMLHttpRequest.prototype.open;
            object.open = (...args) => {
                object.method = args[0];
                object.url = args[1];
                console.log(object.method);
                return opencpy.apply(object, args);
            }
            let sendcpy = XMLHttpRequest.prototype.send;
            object.send = (...args) => {
                if (object.url.startsWith("/api/rooms") && object.method == "POST" && packet.roomName) {
                    console.log("hi");
                    let mod = JSON.parse(args[0]);
                    mod.name = packet.roomName;
                    mod.unlisted = packet.unlisted;
                    console.log(mod);
                    return sendcpy.apply(object, [JSON.stringify(mod)]);
                } else return sendcpy.apply(object, args);
            }
            return object;
        }
    });
    WebSocket = new Proxy(WebSocket, {
        construct: (target, args) => {
            let object = new target(...args);
            send = msg => {
                object.send(JSON.stringify(msg));
                // if (msg.type === "options")
                fetch("https://mafia.gg/api/option-presets", {
                    method: "PATCH",
                    body: JSON.stringify({options: msg}),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                });
            }
            object.addEventListener("message", msg => {
                let data = JSON.parse(msg.data);
                if (data.type === "clientHandshake") {
                    setDefaults(data.events.findLast(p => p.type === "options"));
                }
                else if (data.type === "options") setDefaults(data);
                //else if (data.type === "startGame") started = true;
            });
            return object;
        }
    });
})();

